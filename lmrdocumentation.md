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

### October 21, 2026: Planned a rebrand to Digital Scholar

- **What:** Studied the Digital Scholar website (digitalscholar.org) and found every place in DHRIFT that carries its current branding. Then wrote out the steps needed to rebrand. No changes have been made to the site yet.
- **Why:** To give DHRIFT the look, feel, icons, and information of Digital Scholar.
- **What Digital Scholar's look is made of:**
  - **Name and tagline:** "Digital Scholar" and "Making Methods Modern."
  - **Colors:** Mostly white and light gray, near-black text, and one strong blue as the main color (`#2929cc`), with lighter blues for highlights.
  - **Font:** "Circular XX." This is a commercial font that has to be paid for and licensed. It can't simply be copied from their site.
  - **Icons:** Each of their projects (Omeka, Zotero, Tropy, PressForward, Sourcery) has its own simple, colorful geometric shape.
  - **Footer information:** Partner organizations, a mailing address and email, and links to Bluesky, LinkedIn, Mastodon, and RSS.
- **Where DHRIFT's current branding lives:** The colors are defined in one place, which makes them easy to change. The logos, links to dhrift.org, and the word "DHRIFT" are spread across about 15 files. The footer credits the NEH and the CUNY Graduate Center, and the site's web address is `app.dhrift.org`.
- **Decisions needed before starting:** Permission to use Digital Scholar's brand, whether to keep the DHRIFT name, what to do about the font, how to keep credit for the original funders, and which web address to use.
- **Result:** A step-by-step plan was drafted. Work will start once the decisions above are made, and each completed step will be logged below.

### October 21, 2026: Created a separate branch for the Digital Scholar version

- **What:** Created a new "branch" called `ds-rebrand` and switched to it.
- **Why:** A branch is like a separate working copy of the project. Changes made on it don't affect the main version (`main`), which is what the live website is built from. This lets the Digital Scholar version be built and reviewed safely while the current site keeps running unchanged.
- **Result:** All rebranding work will now happen on `ds-rebrand`. When the new version is ready and approved, it can be merged (combined) into `main`, which publishes it. Until then, the live site is untouched. The branch exists only on this computer for now. It will appear on GitHub once it is "pushed" (uploaded).

### October 21, 2026: Saved the documentation and uploaded the branch to GitHub

- **What:** Saved the latest version of this document as a "commit" on the `ds-rebrand` branch, then "pushed" (uploaded) the branch to GitHub.
- **Why:** A commit is a permanent, labeled snapshot of the project's files, like saving a version of a document with a note about what changed. Pushing copies those snapshots to GitHub, so the work is backed up and others can see it.
- **Result:** The `ds-rebrand` branch now exists on GitHub at github.com/lmrhody/DHRIFT-DS. It holds this documentation, and the live site is still unchanged.

### October 21, 2026: Phase 2 of the rebrand: Digital Scholar colors and font

- **What:** Changed the site's colors and font to match Digital Scholar. This work is on the `ds-rebrand` branch only.
- **Decision made:** Use a free font that looks like Digital Scholar's licensed font (Circular XX) for now. The font chosen is **DM Sans**, a free Google font with a similar clean, rounded look. It can be swapped for the real Circular XX later if a license is bought, by changing one line.
- **Colors changed:**

  | Used for | Before (DHRIFT) | After (Digital Scholar) |
  |---|---|---|
  | Page background | Cream | White |
  | Main color (headings, links, buttons) | Brown | Blue `#2929cc` |
  | Hover color | Light brown | Brighter blue |
  | Borders and dividers | Tan | Light gray |
  | Accent on dark areas | Teal | Light blue |
  | Highlight (e.g., "Command Line" labels) | Gold | Light red |
  | Dark areas and text | Purple-black | Near-black |

- **What stayed the same, on purpose:**
  - The colored labels for each technology (yellow for JavaScript, orange for Git, and so on) are those technologies' own well-known colors. They also suit Digital Scholar's colorful project icons.
  - Workshop authors can choose a cover color by name (such as "teal" or "gold"). Those choices still work, so a workshop that asked for "teal" stays teal. Only the **default** cover changed, to Digital Scholar black and blue. The decorative triangle patterns on workshop cards also use the new colors.
- **Behind-the-scenes tidying:** The style code used to refer to colors by hue name ("teal," "brown"). Those references now use role names ("accent," "primary"), and all the actual color values sit in one short list at the top of the style file. Future color changes only need edits to that list.
- **A bug found and fixed along the way:** The site's chosen fonts had **never actually been loading**, even before this work. Two separate problems caused it:
  1. The font was requested in a way browsers ignore when other styles come first. The request now sits in the page's header, where browsers reliably follow it.
  2. The design toolkit the site is built with (called MUI) was quietly applying its own default font to the whole page. It has now been told to use the site's font instead.
- **How it was checked:** The site was rebuilt and viewed in a browser running in the background. Screenshots were taken of the institute page, the workshops list, and a workshop page. A check confirmed that every piece of visible text on those pages now uses DM Sans.
- **Result:** The site now has Digital Scholar's colors and a matching font. Logos, the "DHRIFT" name, links, and footer information haven't changed yet. Those are later phases of the plan.

### October 21, 2026: Replaced the DHRIFT logo with the Digital Scholar wordmark

- **What:** Removed the DHRIFT logo image from the top of every page and replaced it with the words **DIGITAL SCHOLAR**, in DM Sans, in all capital letters, in Digital Scholar blue. This kind of text-only logo is called a "wordmark."
- **Where it appears:**
  - The top of the landing page, workshops list, and glossary
  - The slide-out menu on phones (in white, because that menu has a blue background)
  - The top of workshop pages, in both the newer and older workshop page styles
- **Links:** Clicking the wordmark now goes to **digitalscholar.org** instead of dhrift.org. The "About" menu item now goes to Digital Scholar's About page.
- **Accessibility detail:** The words are typed normally ("Digital Scholar") and the style sheet displays them in capitals. Screen readers, used by people who are blind or have low vision, therefore read it as two words rather than spelling out letters.
- **Also fixed:** The older workshop page style still had a cream background and brown colors left over from DHRIFT, because they were set in a separate style file. They now use the same Digital Scholar colors as the rest of the site.
- **Not changed yet:** The logo at the bottom of each page (the footer) still says DHRIFT. It sits next to the funding credits for the NEH and CUNY Graduate Center, so it will be changed together with those credits once that decision is made.
- **How it was checked:** The site was rebuilt and screenshots were taken of the landing page and both workshop page styles to confirm the wordmark looks right.
- **Important discovery about the site's content:** Most of the words on the landing page aren't stored in this project. Text such as "Learn with DHRIFT.", the description, and the list of workshops is fetched from two other GitHub repositories run by the DHRI-Curriculum organization. Changing the site to be about the Digital Scholar software suite therefore means creating new content for those pages and pointing the site at it, not just editing this project.

### October 21, 2026: Decisions about the site's new content

- **Where the content will live:** In new GitHub repositories (storage folders) on the `lmrhody` GitHub account: one for the landing page settings and text, and one for the workshops. The DHRI-Curriculum repositories, and therefore the live DHRIFT site at app.dhrift.org, will be left untouched.
- **Workshop material:** The Digital Scholar workshops (for Omeka, Zotero, Tropy, PressForward, and Sourcery) will be built from existing tutorial or workshop materials rather than written from scratch.
- **The current workshops and glossary:** The existing general workshops (Python, Git, HTML, and others) and the 140-term glossary will stay available alongside the new Digital Scholar workshops.

### October 21, 2026: Saved and uploaded the colors, font, and wordmark

- **What:** Saved the Digital Scholar colors, the DM Sans font, the font-loading fix, and the new wordmark as a commit (a saved snapshot), then pushed (uploaded) it to the `ds-rebrand` branch on GitHub.
- **Why:** To back up the work and make it viewable on GitHub.
- **Result:** The changes are stored safely on GitHub in the `ds-rebrand` branch. The live site is still unchanged, because it's only rebuilt from the `main` branch.

### October 21, 2026: Created placeholder workshops for the Digital Scholar software

- **What:** Created a new workshops folder (a repository) called `ds-workshops` with a placeholder ("demo") workshop for each of the five Digital Scholar tools:

  | Workshop | File | Planned lessons |
  |---|---|---|
  | Omeka | `omeka.md` | Getting started; items and collections; exhibits |
  | Zotero | `zotero.md` | Getting started; collecting sources; organizing your library; citing and sharing |
  | Tropy | `tropy.md` | Getting started; importing and organizing photos; describing your sources |
  | PressForward | `pressforward.md` | Getting started; gathering content; reviewing and publishing |
  | Sourcery | `sourcery.md` | Making a request; receiving and managing materials |

- **Why:** Real lesson content for these tools hasn't been written yet. The placeholders let the site show the full set of Digital Scholar workshops now, and give future authors a ready-made structure to fill in.
- **What each placeholder contains:**
  - A front page with the workshop title, a short description taken from Digital Scholar's own wording, learning goals, and links to the tool's official website and documentation. All the links were checked and work.
  - A notice at the top saying the workshop is a placeholder and its content is in development.
  - A page for each planned lesson, marked "Placeholder" with a one-sentence note on what it will cover.
  - A sample quiz question and key terms, showing authors how those features work.
- **How they're built:** Each workshop is a single text file in the DHRIFT workshop format (Markdown). The details between the `---` lines at the top fill in the workshop's front page, and each heading starting with `#` becomes a new page. A `README.md` file explains this for future authors.
- **How they were checked:** Each file was run through the same tools the site uses to read workshops. All five were read correctly, including their front-page details, pages, quizzes, and key terms.
- **Where it is now:** The folder is at `/Users/lmrhody/ds-workshops` on this computer and saved as its first commit. It isn't on GitHub yet. The site reads workshops from GitHub, so the placeholders will appear on the site once this folder is uploaded there and the site is pointed at it.

### October 21, 2026: Set up a private, local-only preview of the new content

- **The problem:** The site normally fetches its landing page text and workshops from GitHub, and only from **public** repositories. The Digital Scholar content isn't ready to be public.
- **The solution, "local mode":** A new way to run the site on this computer that reads the Digital Scholar content from folders on this computer instead of GitHub. Nothing is uploaded or made public.
- **How it works:**
  1. A small helper program, the **local content server**, pretends to be GitHub. It hands the site files from two folders on this computer:
     - `/Users/lmrhody/ds-site`: the landing page settings (`config.yml`)
     - `/Users/lmrhody/ds-workshops`: the five placeholder workshops
  2. In local mode, the site sends requests for the made-up GitHub account name **`local`** to that helper instead of GitHub. Everything else, such as the existing DHRI workshops, still comes from the real GitHub.
  3. The home page automatically opens the Digital Scholar landing page in local mode.
- **Safety:** The helper only shares those two folders, never hidden files or anything else on the computer. It only accepts connections from this computer, and only answers the local preview site, so other websites open in your browser can't read your files through it. Local mode is never switched on when the public site is built, so the live site isn't affected.
- **New landing page text** (in `ds-site/config.yml`):
  - Heading: "Learn the Digital Scholar Suite."
  - Under the heading: "Hands-on workshops for Omeka, Zotero, Tropy, PressForward, and Sourcery."
  - A description based on Digital Scholar's mission statement that introduces each of the five tools
  - A button: "Visit Digital Scholar," linking to digitalscholar.org
- **How to use it:** Open Terminal, go to the `DHRIFT-DS` folder, and type:

  ```bash
  bun run dev:local
  ```

  Wait until it says "Ready," then open **http://localhost:3000**. Edits saved to any file in the two content folders show up when you refresh the page. To stop it, press `Control` + `C` in Terminal. (A small floating button appears at the bottom of pages in this mode. It's a developer tool, not part of the site.)
- **Two fixes made while testing:**
  - Each placeholder workshop began with an empty "Introduction" page, because the site turns anything above a workshop's first heading into a page. The hidden note for authors was moved into the settings at the top of each file, which removed the empty page.
  - Workshops that don't choose a cover color were falling back to teal rather than the Digital Scholar black and blue. They now use the Digital Scholar colors. This also applies to existing DHRI workshops that never chose a color.
- **How it was checked:** The landing page and the Zotero workshop were opened in a background browser and screenshotted. They showed the new heading, description, button, workshop cards, cover, and lesson pages. The helper was also tested to confirm it refuses requests for files outside the two folders.
- **Result:** The Digital Scholar version of the site, with its own landing page and the five placeholder workshops, can now be previewed privately on this computer. The two content folders are saved as commits on this computer only. They haven't been uploaded anywhere.
- **Still to do:**
  - Show the existing DHRI workshops alongside the new ones (decided earlier). The site can currently read workshops from only one place at a time, so this needs a further change.
  - The footer still shows the DHRIFT logo and the NEH and CUNY credits.

### October 21, 2026: One shared workshop directory, and a sample institute

#### Part 1: DHRI workshops moved next to the Digital Scholar workshops

- **What:** Copied all of the existing DHRI workshops into the `ds-workshops` folder, alongside the five Digital Scholar placeholders. Their pictures (`images`), downloadable practice files (`uploads`), and notebooks came too, so the lessons work as before.
- **Why:** So there is a single, **unified directory** of workshops that any site or institute page can draw from.
- **Credit:** The `ds-workshops` README records that these workshops came from the DHRI-Curriculum/workshops repository (as of August 10, 2026), were developed by the DHRI at the CUNY Graduate Center, and list their authors in each file.
- **Note:** This is a copy. Future changes the DHRI team makes to their workshops won't appear here automatically.
- **Four workshops are hidden on purpose:** Their DHRI authors marked them "not published": Catch Our DHRIFT, Introduction to R, Mapping With JavaScript, and Databases and SQL. The site hides them, just as the live DHRI site does. Changing `published: false` in a file shows it.
- **Small fix:** The workshop list now shows only workshop files. Before this, other files in the folder (such as a `tracks.yaml` settings file) would have appeared as broken workshop cards.

#### Part 2: The demonstration institute, rebuilt as a sample Digital Scholar institute

- **Background:** The earlier site had a "See a Demonstration Institute" button. It led to an **institute page**, a landing page for a specific workshop event, with event details, a day-by-day schedule, and the event's workshops. The feature was still in the site's code. It is driven entirely by the settings file (`config.yml`) of the institute.
- **What was built:** A new folder, `ds-sample-institute`, holding a sample event called "Digital Scholar Summer Workshop (Sample)." Its settings file has a plain-language note beside every setting, so anyone can copy the folder and make their own institute. It includes:
  - The event name, dates (June 14 to 16, 2027, as an example), and venue ("Online")
  - An introduction paragraph
  - A "Details" panel with organizers, sponsors, contacts, dates, venue, and a longer description. Digital Scholar's public contact address is used as a placeholder.
  - A three-day schedule of eight sessions. Each session can link to a workshop.
  - A chosen set of seven workshops: the five Digital Scholar tools plus Data Literacies and HTML & CSS
- **New feature, choosing workshops:** Institutes can now list which workshops from the shared directory they want, in the order they want, using a `workshops:` list in their settings file. Without the list, every workshop is shown. This is what lets many different institutes draw on one shared directory.
- **The landing page button** now reads "See a Sample Institute" and opens the sample. The landing page description also now mentions the DHRI workshops.
- **Schedule links fixed:** Schedule entries linked to the older workshop page style and an old version of the content, which would display wrongly. They now open the newer style, the same one the workshop cards use.

#### Part 3: Local mode improvements

- **New folders are picked up automatically:** In local mode, the site can now see **any folder next to `DHRIFT-DS` whose name starts with `ds-`**. To make another institute, copy `ds-sample-institute` to a new folder such as `ds-my-institute` and open `http://localhost:3000/inst?instUser=local&instRepo=ds-my-institute`. No settings need changing. Folders without the `ds-` prefix, and hidden files, are still never shared.
- **Images fixed:** Pictures in workshops weren't appearing in local mode. The site uses a browser security setting (needed for the in-browser coding tools) that blocks pictures from another address unless that address says it's allowed. GitHub says so; the local helper didn't. It now does, for the local site only.

#### How it was checked

The landing page, the sample institute, the Zotero, Data Literacies, and Catch Our DHRIFT workshops were opened in a background browser. The checks confirmed:

- the landing page lists both sets of workshops and its button opens the sample institute
- the institute shows its heading, dates, all six Details sections, the three schedule days, and exactly its seven chosen workshops in order
- each schedule link points to the right workshop
- workshop pictures load

**Where things are now:** The three content folders (`ds-site`, `ds-workshops`, `ds-sample-institute`) are saved as commits on this computer only. The site code changes aren't committed yet.

### October 21, 2026: Added project logos to the workshop cards

- **What:** Each Digital Scholar workshop card (Omeka, Zotero, Tropy, PressForward, Sourcery) now shows that project's logo beside its title, on the landing page, the workshops page, and institute pages.
- **Where the logos came from:** Digital Scholar's own homepage (digitalscholar.org). They are stored in `ds-workshops/images/logos/`, and the `ds-workshops` README notes that they belong to their projects. Using them on a published site falls under the permission question raised in the rebrand plan.
- **How it works, so it can be reused:** A workshop can now include a `logo:` line in its front-page details, for example `logo: /images/logos/zotero.png`. If it has one, its card shows the logo; if not, the card looks as before. Any future workshop can get a logo the same way, with no code changes.
- **Accessibility detail:** The logo is marked as decorative, because the title right beside it already names the project. Screen readers therefore don't announce the name twice.
- **How it was checked:** The landing page and sample institute were opened in a background browser, which confirmed all five logos load. A screenshot confirmed they display neatly beside the titles.

### October 21, 2026: Checked, saved, and uploaded the site changes

- **What:** Ran a full build of the site, then saved the code changes from the last several steps as a commit and pushed (uploaded) it to the `ds-rebrand` branch on GitHub. The commit covers local mode, workshop selection for institutes, the schedule link fix, the default cover color, and card logos.
- **Checks before saving:**
  - The build finished without errors.
  - The built site contains no trace of local mode, so the published version will keep reading from GitHub.
  - The built site was opened in a background browser in normal (not local) mode. It still showed the original DHRI landing page and its workshop cards, confirming that nothing broke for the existing site.
- **Not uploaded:** The three content folders (`ds-site`, `ds-workshops`, `ds-sample-institute`) stay on this computer only, as planned.
