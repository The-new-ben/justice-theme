# Justice Theme Audit Report

> Generated: 2026-05-07 | Pre-rebuild assessment

## 1. What Exists (9 files)

| File | Status |
|---|---|
| style.css | Monolithic, not modular |
| functions.php | All logic in one file, hardcoded strings |
| front-page.php | Hardcoded Hebrew, no template parts |
| archive-articles.php | No sidebar, no taxonomy filter |
| single-articles.php | No schema, no editorial note |
| single.php | Minimal fallback |
| page.php | Minimal fallback |
| search.php | No search form partial |
| 404.php | Inline styles |

## 2. Critical Issues

- No header.php / footer.php — header/footer are PHP functions
- No inc/ directory — everything in functions.php
- No template-parts/ — zero reusable partials
- No assets/ directory
- No Schema.org structured data
- No breadcrumbs
- No accessibility (skip links, focus styles, aria labels)
- No i18n — hardcoded Hebrew strings
- No RTL CSS file
- jQuery dependency for nav toggle
- No escaping on many outputs

## 3. Build Plan — 40+ files to create

See full file structure in user specification.
Build order: functions.php loader → inc/ → templates → partials → CSS → JS → package.
