# Public Business-Language Safety - 2026-05-26

Status: VERIFIED

Scope: repo-local verification that internal revenue/business-plan language is blocked before public publication.

The owner caught a real user-facing risk: a legal-help page title can accidentally explain why the page makes money for Jus-Tice. This guard verifies that public titles, excerpts and bodies are scanned before publication.

## Results

| Check | Status | Evidence |
| --- | --- | --- |
| PUBLIC-FIELDS-SCANNED | VERIFIED | Publish gate fields: post_title, post_excerpt, post_content |
| PUBLICATION-SAFETY-MARKERS | VERIFIED | 12/12 required markers in inc/publication-safety.php |
| LIVE-CONTENT-MARKERS | VERIFIED | 12/12 required markers in justice_theme_detect_public_content_internal_markers() |
| HEADING-LINE-GATES | VERIFIED | Heading and line cleanup gates include business-plan/revenue Hebrew markers. |
| BITUACH-LEUMI-SAMPLE-CATCH | VERIFIED | Sample heading caught by: מסלול הכנסה / למה ביטוח לאומי הוא מסלול הכנסה |

## Simulated Bad Public Heading

- Sample: `למה ביטוח לאומי הוא מסלול הכנסה חשוב ל-Jus-Tice`
- Detected markers: `מסלול הכנסה`, `למה ביטוח לאומי הוא מסלול הכנסה`

## Operating Rule

- Visitor-facing legal pages should explain the legal problem and next safe action for the user.
- Internal terms such as revenue path, paid leads, CRM workflow, owner notes, Linear, uPress, Grow/Meshulam or pre-publication gates belong only in private docs/admin screens.
- This check does not publish, edit CMS rows, change URLs, redirects, canonicals, noindex, sitemap or taxonomy settings.
