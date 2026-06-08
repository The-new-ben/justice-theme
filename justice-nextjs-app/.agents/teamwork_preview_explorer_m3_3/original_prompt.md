## 2026-06-08T19:55:04Z
You are teamwork_preview_explorer.
Your working directory is c:\Users\pro\justice\justice-nextjs-app\.agents\teamwork_preview_explorer_m3_3.
Your mission is to perform exploration and analysis for Milestone 3 (Milky Glassmorphic UI & JSON-LD Integration).

Specifically:
1. Locate the files rendering reviews, including the practice area category pages (e.g. `src/app/practice-areas/[category]/page.js`) and any other pages/components displaying reviews.
2. Locate `src/app/globals.css` and find the CSS variables defined for the premium white/silver/frosty light glassmorphism design system.
3. Locate where reviews data is retrieved/stored (the database, cache, or API layer) and verify the format of Client, Colleague, and Google reviews.
4. Locate existing dynamic JSON-LD injection sites or Metadata generation files. Suggest where and how dynamic structured data for `AggregateRating` and `Review` markup can be nested under the appropriate types (like `LocalBusiness`, `LegalService`, or `LegalArticle`).
5. Check if there are E2E or unit tests in the project testing reviews or structured data (e.g., in `tests/` or using playwright/jest) and note how to run them.
6. Check current copywriting against compliance constraints (no em-dash `—`, no AI Hebrew transitions like "בנוסף", "חשוב לציין כי", active voice).

Provide your findings and recommendation strategy in handoff.md in your working directory. Ensure you include absolute file paths, code snippets, and terminal command outputs to back up your findings. Do not implement changes or write/modify code files.
