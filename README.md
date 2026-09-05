# Spirit Meter

A companion overlay for SpiritVale: combat meters, active effects, enemy cast alerts, local encounter history, and farming statistics.

**Status: alpha, under development. No public releases or downloads are available yet.**

**[Visit the website](https://kyntrin.github.io/spirit-meter-releases/) · [Explore the screenshots](https://kyntrin.github.io/spirit-meter-releases/#gallery)**

## What lives here

This repository contains the public website, documentation, and presentation screenshots. Future reviewed distribution packages and release notes will be published here as well.

The application's source code and development history remain in a separate private repository. There is no automatic synchronization from that repository.

## Feature previews

- **Combat:** live DPS and HPS, class icons, and skill contributions for yourself or your party.
- **Effects:** configurable buffs, auras, debuffs, and a searchable effect selector.
- **Enemy casts:** detected cast timers and target information when available, with a boss-only option.
- **Encounter history:** skill breakdowns, effective/excess metrics, confirmation coverage, and local buff/aura uptime.
- **Farming:** XP, job XP, gold income and spending, and acquired items with type and display-count filters.

The gallery uses high-resolution captures of the real interface with synthetic demonstration data. Class labels replace player nicknames, including cast targets and history entries. Screenshots are in English; descriptions and image labels are available in all five website languages. These are feature previews, not measurements from real player sessions or a guarantee of final release behavior.

## Languages

English, Portuguese, Spanish, Simplified Chinese, and Japanese, matching the overlay. The language selector remembers the visitor's preference locally when storage is available. Otherwise, the first supported browser language is used, with English as the fallback. Without JavaScript, the initial Portuguese content and screenshot links remain usable.

## Website development

GitHub Pages publishes the root of `main`. The site uses local HTML, CSS, and JavaScript with no external runtime dependencies or analytics. Screenshots load lazily and link to their full-size originals.

Run the checks with [Bun](https://bun.sh/):

```sh
bun test
```

To preview locally, serve this directory with any static HTTP server.

## Contribution safeguards

Read `AGENTS.md` before making changes. Install the clone-local hooks with `git config --local core.hooksPath .githooks` after checking for existing custom hooks. Run `node scripts/verify-public.mjs --staged` and `bun test` before committing.

Use a feature branch and pull request, with concise English conventional commit subjects. The publication guard checks approved file paths, destinations, common credential patterns, file types and screenshot metadata. The pre-push hook checks every outgoing commit tree, including intermediate commits that later deleted a file. Website CI runs the guard and tests before integration.

These checks do not establish that arbitrary code is safe or that screenshot pixels contain no personal information. Human review remains required. Once data has been pushed to any public branch, CI cannot undo its disclosure. Never bypass a guard to publish unreviewed content.

## Screenshot publication checklist

- Generate screenshots from the application's presentation mode, never from a tester's live session.
- Use generic class labels instead of nicknames in every panel, target, and history entry.
- Render with an isolated configuration, a fixed virtual screen, and 2× scale.
- Review every image for clipping, legibility, names, paths, and other personal information.
- Copy only the reviewed PNG files to `assets/screenshots/`; keep the application and generator private.
- Update all five caption catalogs in `gallery.js`, the no-JavaScript HTML, and the tests when adding a feature.

## Before the first release

- Validate the package on Windows with testers.
- Inspect the extracted archive: do not publish application source files, source maps, dumps, logs, credentials, personal settings, or development files.
- Review redistribution permissions for dependencies and assets.
- Include requirements, installation instructions, and known limitations.
- Generate a SHA-256 checksum for the final package and include it in the release notes.
- Publish only reviewed artifacts through GitHub Releases, then enable the website's download links.

A private development repository does not protect source files accidentally included inside a public package.

## Disclaimer

Spirit Meter is an independent project and is not officially affiliated with SpiritVale. Game names and artwork shown within interface previews belong to their respective owners. Publishing screenshots does not imply permission to redistribute standalone game assets.
