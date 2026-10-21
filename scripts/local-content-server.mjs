#!/usr/bin/env node
// Serves content folders on this computer in the shape of the GitHub API, so the site can
// render institutes and workshops locally without publishing them. Used by `bun run dev:local`.
//
// The site rewrites requests for the GitHub owner `local` to this server (see localizeGitHubUrl
// in utils/github.js). By default it serves every folder next to this project whose name starts
// with `ds-` (such as ds-site, ds-workshops, ds-sample-institute), and nothing else. To serve
// other folders instead, list them, with paths relative to the project folder:
//   LOCAL_CONTENT_REPOS="my-institute=../my-institute,ds-workshops=../ds-workshops"
// The branch in a request is ignored: files are always served from the folder as it is on disk.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const LOCAL_OWNER = 'local';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const DEFAULT_PREFIX = 'ds-';

// Read at each request, so new ds- folders work without restarting
const siblingRepos = () => {
  const parent = path.dirname(projectDir);
  return Object.fromEntries(
    fs.readdirSync(parent, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && entry.name.toLowerCase().startsWith(DEFAULT_PREFIX))
      .map((entry) => [entry.name.toLowerCase(), path.join(parent, entry.name)])
  );
};

const parseRepos = (spec) => Object.fromEntries(
  spec.split(',').map((entry) => entry.trim()).filter(Boolean).map((entry) => {
    const [name, dir] = entry.split('=');
    return [name.trim().toLowerCase(), path.resolve(projectDir, dir.trim())];
  })
);

const MIME = {
  '.md': 'text/markdown; charset=utf-8', '.yml': 'text/yaml; charset=utf-8', '.yaml': 'text/yaml; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8',
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.pdf': 'application/pdf', '.ipynb': 'application/json; charset=utf-8',
};

// GitHub-shaped URLs, so the site's normal code paths apply and then get rewritten back to this server
const apiUrl = (repo, p) => `https://api.github.com/repos/${LOCAL_OWNER}/${repo}/contents/${p}`;
const rawUrl = (repo, p) => `https://raw.githubusercontent.com/${LOCAL_OWNER}/${repo}/main/${p}`;

const describe = (repo, relPath, stat) => ({
  name: path.basename(relPath),
  path: relPath,
  sha: `${stat.size}-${stat.mtimeMs}`,
  size: stat.isFile() ? stat.size : 0,
  url: apiUrl(repo, relPath),
  html_url: null,
  git_url: null,
  download_url: stat.isFile() ? rawUrl(repo, relPath) : null,
  type: stat.isFile() ? 'file' : 'dir',
});

export function startLocalContentServer({
  port = Number(process.env.LOCAL_CONTENT_PORT) || 4000,
  repos = process.env.LOCAL_CONTENT_REPOS ? parseRepos(process.env.LOCAL_CONTENT_REPOS) : null,
  allowedOrigin = process.env.LOCAL_CONTENT_ALLOWED_ORIGIN || 'http://localhost:3000',
} = {}) {
  const getRepos = () => repos || siblingRepos();
  const send = (res, status, body, type = 'application/json; charset=utf-8') => {
    res.writeHead(status, {
      'Content-Type': type,
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      // The site runs cross-origin isolated (public/coi-serviceworker.js), which blocks images from
      // other origins unless they opt in. localhost:3000 and :4000 count as the same site.
      'Cross-Origin-Resource-Policy': 'same-site',
      'Cache-Control': 'no-store',
    });
    res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
  };
  const notFound = (res) => send(res, 404, { message: 'Not Found' });

  // Resolve a path inside an allowed repo folder, refusing anything outside it or hidden
  const resolveInRepo = (repo, relPath) => {
    const root = getRepos()[repo.toLowerCase()];
    if (!root) return null;
    const segments = relPath.split('/').filter(Boolean);
    if (segments.some((s) => s.startsWith('.'))) return null;
    const full = path.resolve(root, ...segments);
    if (full !== root && !full.startsWith(root + path.sep)) return null;
    return { root, full, relPath: segments.join('/') };
  };

  const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') return send(res, 204, '');
    if (req.method !== 'GET') return send(res, 405, { message: 'Method Not Allowed' });

    const url = new URL(req.url, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean).map(decodeURIComponent);

    // /api/repos/local/:repo[/contents/:path]
    if (parts[0] === 'api' && parts[1] === 'repos' && parts[2] === LOCAL_OWNER && parts[3]) {
      const repo = parts[3];
      const target = resolveInRepo(repo, parts.slice(5).join('/'));
      if (!target || !fs.existsSync(target.full)) return notFound(res);
      if (parts.length === 4) return send(res, 200, { name: repo, full_name: `${LOCAL_OWNER}/${repo}`, private: true });
      if (parts[4] !== 'contents') return notFound(res);

      const stat = fs.statSync(target.full);
      if (stat.isDirectory()) {
        const listing = fs.readdirSync(target.full)
          .filter((name) => !name.startsWith('.'))
          .sort()
          .map((name) => {
            const rel = target.relPath ? `${target.relPath}/${name}` : name;
            return describe(repo, rel, fs.statSync(path.join(target.full, name)));
          });
        return send(res, 200, listing);
      }
      return send(res, 200, {
        ...describe(repo, target.relPath, stat),
        encoding: 'base64',
        content: fs.readFileSync(target.full).toString('base64'),
      });
    }

    // /raw/local/:repo/:branch/:path
    if (parts[0] === 'raw' && parts[1] === LOCAL_OWNER && parts[2] && parts[3]) {
      const target = resolveInRepo(parts[2], parts.slice(4).join('/'));
      if (!target || !fs.existsSync(target.full) || !fs.statSync(target.full).isFile()) return notFound(res);
      const type = MIME[path.extname(target.full).toLowerCase()] || 'application/octet-stream';
      return send(res, 200, fs.readFileSync(target.full), type);
    }

    return notFound(res);
  });

  // Listen on this computer only, never on the network
  server.listen(port, '127.0.0.1', () => {
    console.log(`Local content server: http://localhost:${port}`);
    for (const [name, dir] of Object.entries(getRepos())) {
      console.log(`  ${LOCAL_OWNER}/${name} -> ${dir}${fs.existsSync(dir) ? '' : '  (folder not found)'}`);
    }
  });
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startLocalContentServer();
}
