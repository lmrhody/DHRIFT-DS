#!/usr/bin/env node
// `bun run dev:local`: starts the local content server and the Next.js dev server together,
// with the site switched to read the `local` GitHub owner from this computer.
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { startLocalContentServer } from './local-content-server.mjs';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentPort = Number(process.env.LOCAL_CONTENT_PORT) || 4000;

const contentServer = startLocalContentServer({ port: contentPort });

const next = spawn(path.join(projectDir, 'node_modules', '.bin', 'next'), ['dev'], {
  cwd: projectDir,
  stdio: 'inherit',
  env: { ...process.env, LOCAL_CONTENT_URL: `http://localhost:${contentPort}` },
});

const shutdown = () => {
  contentServer.close();
  next.kill('SIGINT');
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
next.on('exit', (code) => {
  contentServer.close();
  process.exit(code ?? 0);
});
