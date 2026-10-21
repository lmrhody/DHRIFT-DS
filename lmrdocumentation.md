# DHRIFT: A Plain-Language Guide to What Was Done

*Prepared October 21, 2026*

This document explains, in plain language, two pieces of work done on the DHRIFT project:

1. A review of how the DHRIFT website is put together, including parts it relies on that are missing or fragile.
2. Setting up this computer so it can build the website.

You don't need any programming background to read it.

---

## Part 1: How DHRIFT works

### The big picture

DHRIFT (Digital Humanities Research Infrastructure for Teaching) is a website for presenting digital humanities workshops. The most important thing about it is that **the website doesn't store the workshops itself.** It works more like an empty picture frame. When someone visits, it fetches the workshop content from GitHub (a popular website for storing and sharing files) and displays it.

The web address tells DHRIFT what to fetch. For example:

```
https://app.dhrift.org/inst?instUser=dhri-curriculum&instRepo=dhrift-site-template
```

This address says, in effect: "Go to the GitHub account named `dhri-curriculum`, open the folder called `dhrift-site-template`, and show what's in it." That folder holds a settings file (`config.yml`) with the event name, dates, schedule, and so on. The settings file then points to a second folder that holds the actual workshop lessons.

So one copy of DHRIFT can display any number of different institutes and workshops, as long as their content lives on GitHub in the expected format.

### How it gets published

DHRIFT is a "static" website. Everything is prepared ahead of time as a set of ready-made files, and there is no server running behind the scenes. This makes it cheap and reliable to host. The project is set up so that every time a change is saved to the main version on GitHub, an automated process rebuilds the site and publishes it on GitHub Pages, GitHub's free hosting service.

### How the lessons are written and displayed

Workshop authors write their lessons in **Markdown**, a simple way of formatting text (for example, `# Title` for a heading or `**bold**` for bold text). DHRIFT reads these Markdown files and turns them into web pages. Authors can also add special boxes, such as:

- **Info boxes** for helpful tips
- **Secret boxes** that hide answers until the reader clicks
- **Quizzes**
- **Download links** for workshop files

There are two versions of this system:

- **The original ("legacy") version** uses a style of special tags that authors often typed slightly wrong. A lot of DHRIFT's code exists just to repair those small mistakes automatically so the page still displays correctly.
- **The newer ("v2") version** uses a simpler, more forgiving format. The project includes a tool to convert older workshops to the new format.

### Hands-on coding in the browser

One of DHRIFT's distinctive features is that learners can **write and run real code right in their web browser**, with nothing to install. A panel slides out from the side of the page with a code editor. Depending on the workshop, learners can practice:

- **Python** (a popular programming language)
- **JavaScript** and **HTML/CSS** (the languages of web pages)
- **R** (a language used for statistics)
- **Jupyter notebooks** (interactive documents mixing code and text)
- **A Linux command line** (a text-based way of controlling a computer)
- **An AI chat model** that runs entirely in the browser

This works through a technology called **WebAssembly**, which lets browsers run programs that would normally need to be installed on a computer.

### The setup wizard

DHRIFT also has a **wizard**, a step-by-step tool that helps people create a new institute or workshop. This is the only part of DHRIFT that relies on an outside service. It asks people to log in with GitHub and then uses a separate service to create the needed folders on their behalf.

---

## Part 2: Missing and fragile pieces ("dependencies")

### What is a "dependency"?

Modern websites are built from many pre-made pieces of software written by other people, much like a house uses factory-made windows, doors, and plumbing rather than building each one by hand. These pre-made pieces are called **dependencies**.

A project keeps a list of the dependencies it needs, like a shopping list, in a file called `package.json`. When someone sets up the project, the computer reads that list and downloads everything on it.

### What the review found

The review compared the shopping list to what the code actually uses. Some items are used but **not on the list**.

**Missing, but not currently causing problems (3 items).** These are used by parts of the code that are no longer connected to the website (old, unused features) or that have been switched off. They would only cause problems if someone switched those features back on.

**Missing from the list, but working by luck (7 items).** These aren't on DHRIFT's shopping list, but they happen to come bundled with *other* items that are. It's a bit like relying on your neighbor's ladder because you never bought your own: it works today, but if the neighbor moves, you're stuck. The most important one, called `remark-parse`, is used to read every workshop lesson. **We recommend adding all seven to the list** so they don't disappear unexpectedly during a future update.

### Other problems found

- **The R coding panel is broken.** The code that starts the R language was switched off (likely by accident), so opening the R editor will produce an error.
- **Two file names are wrong.** A couple of parts of the site look for a helper file called `coi-service.js`, but the file is actually named `coi-serviceworker.js`. This helper is what allows the in-browser coding tools to work.
- **One feature points to files that aren't there.** An older Jupyter notebook feature expects files that aren't included in the project. The current Jupyter feature uses an online version instead, so this mostly affects unused code.
- **Two different versions of the Python tool are mentioned** in different places, which could cause confusion in the future.
- **About 40 items on the shopping list are never used.** They don't break anything, but they make setup slower and the project harder to maintain.
- **The instructions in the README are out of date.** They describe a setup tool called `npm`, but the project now uses a different tool called `bun`.

### Recommended next steps

1. Add the seven "working by luck" items to the official list.
2. Fix the R coding panel and the misspelled helper file name.
3. Clean out the old, unused code and the unused items on the list.

---

## Part 3: Setting up this computer to build the site

### What "building" means

"Building" the site means turning the project's source files into the finished set of web pages that get published. To do this on your own computer, you need a few tools installed first.

### What was installed

All tools were installed with **Homebrew**, a widely used, trusted app for installing software on Macs.

| Tool | What it's for |
|---|---|
| **Node.js** (version 22) | The engine that runs the website-building tools. Version 22 was chosen because it matches what the automatic publishing process uses, so the results on your computer match the live site. |
| **npm** | Comes with Node.js. A standard tool for downloading dependencies. |
| **Bun** | The tool this project actually uses to download dependencies and run the build. |
| **Graphics libraries** (cairo, pango, librsvg, and a few others) | Needed by one dependency, called `canvas`, that draws images. It needs these system tools to set itself up. The automatic publishing process installs the same tools. |

### What happened along the way

1. Node.js and Bun installed without trouble.
2. The first attempt to download the project's dependencies **failed** because `canvas` couldn't set itself up without the graphics libraries.
3. After the graphics libraries were installed, `canvas` was reinstalled and set itself up successfully.
4. The full website build was then run and **completed successfully**. All 12 pages of the site were produced and saved into a folder called `out`.

### How to build the site yourself

Open the Terminal app, go to the project folder, and type these commands:

```bash
bun install --frozen-lockfile
```
This downloads all the dependencies. You only need to do it once, or again after the dependency list changes.

```bash
bun run build
```
This builds the finished website into the `out` folder.

```bash
bun run dev
```
This starts a private preview of the site on your own computer. While it's running, open a web browser and go to **http://localhost:3000** to see it. Press `Control` + `C` in Terminal to stop it.

---

## Summary

- **DHRIFT is a "picture frame" website.** It displays workshops stored on GitHub and lets learners practice coding directly in their browser.
- **Some of the software it depends on isn't properly listed.** It works for now, but should be fixed to prevent surprises. The R coding panel is currently broken.
- **This computer is now fully set up** to build and preview the DHRIFT website, and a test build succeeded.

---

## Ongoing Work Log

This section is a running record of work on the project. Each entry explains what was done, why, and what happened, in plain language. New entries are added at the bottom as work continues.

### October 21, 2026: Project review and computer setup

- **What:** Reviewed how DHRIFT is built, listed missing and fragile dependencies, and installed the tools needed to build the site on this computer.
- **Why:** To understand the project's current state before making changes, and to be able to test changes locally.
- **Result:** The review findings are in Parts 1 and 2 above. The tools were installed and a test build of the website succeeded (see Part 3).

### October 21, 2026: Started this ongoing log

- **What:** Added this "Ongoing Work Log" section.
- **Why:** To keep a clear, continuous record of each step of the work for readers who aren't programmers.
- **Result:** Every future step will get a dated entry here. If a step changes something described earlier in this document (for example, fixing the R coding panel), that earlier section will be updated too, so the whole document stays accurate.

### October 21, 2026: Set up Git identity for this project

- **What:** Told Git (the tool that tracks changes to the project) who is making changes. The name was set to `lmrhody` and the email to `lisarhody.gc@gmail.com`.
- **Why:** Git stamps every saved change (a "commit") with a name and email. Without them, Git won't let you save changes, so they can't be sent ("pushed") to GitHub.
- **Result:** The setting applies only to this project, not to other projects on this computer. The name and email will be publicly visible on GitHub for any change that is pushed. Because the email is the one linked to the GitHub account, changes will show up on that GitHub profile.

### October 21, 2026: Built the site and ran it on this computer

- **What:** Built the website, then started a small local web server so the finished site could be viewed in a browser at **http://localhost:3000**. "localhost" means "this computer," so the site is private and only visible on this machine.
- **Why:** To see the site working exactly as it will appear when published, before making any changes.
- **How:** The build turns the project into ready-made web pages in the `out` folder. Those pages are named like `inst.html`, but the site's links leave off the `.html` (for example `/inst`). GitHub Pages fills in the `.html` automatically, so a small tool called `serve` was used locally because it does the same thing. The commands are:

  ```bash
  bun run build
  bunx serve@14.2.4 out -l 3000
  ```

  Then open **http://localhost:3000** in a web browser. To stop the server, go to the Terminal window running it and press `Control` + `C`.

- **Result:** The build succeeded and every main page (home, institute, workshops, glossary, v2) loaded. The home page automatically sends visitors to the sample DHRI institute, whose content is fetched live from GitHub.
- **Things to know:**
  - The site needs an internet connection, even when running locally, because it fetches workshop content from GitHub each time.
  - On the live site, GitHub requests use a special read-only access key. This computer doesn't have that key, so GitHub limits it to about 60 requests per hour. If pages stop loading content after a lot of clicking around, waiting an hour fixes it.
  - For working on the site's code, `bun run dev` is a better choice (see Part 3) because it updates the page automatically as files change. The steps above show the final, published version.
