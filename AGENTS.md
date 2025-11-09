# Repository Guidelines
This Chrome MV3 new-tab override uses static HTML, CSS, and vanilla JS; keep contributions fast, dependency-free, and privacy-friendly.

## Project Structure & Module Organization
- `manifest.json` registers the new tab override, permissions, and icons - update it whenever assets or entry files change.
- `newtab.html`, `newtab.css`, and `newtab.js` are the entire runtime bundle; treat DOM IDs/class names as shared contracts across the trio.
- `icons/` holds the 16/48/128 px PNGs cited in the manifest; reuse filenames to avoid cache churn.
- `pic/` stores the background art (`background.jpg`) referenced in CSS; add only optimized images under 500 KB with noted sources.
- `CLAUDE.md` and `AGENTS.md` capture contributor processes; edit both when workflows shift.

## Build, Test, and Development Commands
- `chrome.exe --load-extension="C:\path\to\chrome-mytab"` loads the unpacked extension for manual smoke tests.
- `npx web-ext lint --source-dir .` flags manifest or API issues before review.
- `Compress-Archive -Path * -DestinationPath dist\chrome-mytab.zip` creates the upload bundle; inspect the archive before tagging.

## Coding Style & Naming Conventions
- Stick to 2-space indentation, single quotes in JS, and trailing semicolons for consistency with existing files.
- Use camelCase for JS variables/IDs (`searchInput`) and kebab-case for CSS classes (`bookmark-bar`, `.engine-btn`).
- Prefer `const` over `let`, guard DOM lookups (`if (!modal) return;`), and keep functions small enough to scan in one screen.

## Testing Guidelines
- `npx web-ext run --chromium-binary=chrome.exe --source-dir .` launches an isolated profile for regression checks.
- Exercise search-engine switching, bookmark rendering, modal flows, and background loading on every change; capture screenshots for visible UI edits.
- Verify responsive layouts at 768 px, 1024 px, and 1440 px widths and note the Chrome version in bug reports.

## Commit & Pull Request Guidelines
- History currently uses short imperative subjects like `initial`; continue that style or adopt Conventional Commits (for example, `feat: add quick launcher`).
- Reference related issues, list validation commands executed, and describe user impact in PR descriptions.
- Include before/after visuals for UI changes plus a checklist that covers lint, load-extension, and manual smoke tests.

## Security & Configuration Tips
- Never commit personal bookmarks, API keys, or account-specific settings; rely on sanitized samples.
- Keep external URLs centralized in `newtab.js` so reviewers can audit changes quickly.
- Document asset licenses inside PRs and confirm each file is declared in `manifest.json`.
