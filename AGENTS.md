# Public website repository

Everything committed here, including commit messages and deleted files in history, is public.

## Before working

- Verify root, branch, `git status --short` and every fetch/push URL. Expected origin: `https://github.com/Kyntrin/spirit-meter-releases.git` (SSH equivalent accepted).
- Read the README and this file. Preserve unrelated local changes.
- Keep README, documentation and commit messages in English. User-facing website copy supports en, pt, es, zh and ja.

## Publication boundary

- This is a website/distribution repository, not application source storage.
- Only explicitly allowed site files, public documentation, site tests, guard scripts, workflows and reviewed screenshots may be committed.
- Never copy application code/history, extractors, game archives, standalone game assets, logs, packet captures, memory dumps, session notes, credentials or local configurations here.
- Screenshots must use demo data and generic class labels, including targets and history. Review every image visually; automated metadata checks cannot detect personal information rendered into pixels.
- No public downloads/releases until separately authorized and reviewed. Never weaken the allowlist just to make an unexpected file pass.

## Checks and workflow

1. Install local hooks once: `git config --local core.hooksPath .githooks` (review before replacing custom hooks).
2. Stage explicit files only; inspect `git diff --cached`.
3. Run `node scripts/verify-public.mjs --staged` and `bun test`.
4. Commit using a short English conventional message, such as `fix(site): correct class icons`. Never include private context, usernames from tests, local paths or conversation excerpts.
5. Use a feature branch and PR. Required CI must pass before merging to `main`; no force-push, deletion, direct-main push or bypass without explicit authorization.
6. Verify the Pages deployment and served files before saying the change is live. Account for browser/CDN caching.

The local pre-push guard scans every outgoing commit, not just the final tree. CI is defense in depth: once a file reaches any public branch it is already public, even if CI rejects it. Hooks are clone-local and must be installed again in new clones.
