# Money-Query SEO Batch 001 Refresh - 2026-05-19

Branch: `codex/money-query-seo-batch-001`  
Status: ready for review / no public CMS edits  
Purpose: update the existing Batch 001 packet with the stronger 2026-05-19 GSC evidence and live title/H1 checks.

## Research Used

- Google title-link guidance: titles should be clear, descriptive and page-specific; Google may rewrite titles that are generic, misleading, keyword-stuffed, or misaligned with the page.
- Google helpful-content guidance: legal/YMYL pages need people-first value, trust, and clear who/how/why signals, not thin SEO text.

## Why This Matters For Money

These pages already have demand. The problem is that almost nobody clicks. The fastest traffic recovery path is not new articles first; it is rescuing high-impression commercial URLs that already rank somewhere but fail to earn clicks.

If the five URLs below reached only 1% CTR, the rough upside is about 2,100 extra clicks per export period compared with the current baseline. That is not guaranteed revenue, but it is a direct input into lawyer subscriptions and lead supply.

## Updated Batch 001 Targets

| Priority | URL | Clicks | Impressions | CTR | Position | Current live issue | Proposed next move |
|---|---|---:|---:|---:|---:|---|---|
| P0 | `/real-estate-attorney/` | 17 | 88,601 | 0.02% | 58.6 | Title/H1 include promotional wording: `מומלץ`, `ייעוץ חינם`. | Replace title/H1 with practical real-estate-law scope; keep URL. |
| P0 | `/criminal-defense-attorney/` | 10 | 62,561 | 0.02% | 56.4 | Broad title; urgent user stages are not visible in title. | Emphasize investigation, arrest, indictment and representation. |
| P0 | `/sex-crime-lawyer/` | 34 | 27,904 | 0.12% | 56.0 | Long keyword chain; sensitive topic needs trust/process clarity. | Tighten title/H1 around rights, investigation and defense path. |
| P0 | `/prenup-attorney/` | 1 | 20,894 | 0.00% | 55.4 | Title/H1 include `מומלץ`; weak for YMYL trust. | Reframe around prenup, common-law partners, apartment/property and approval. |
| P1 | `/traffic-lawyer/` | 0 | 20,330 | 0.00% | 67.9 | Generic title; no concrete reason to click. | Mention license risk, points, drunk driving, fines and court summons. |

## Proposed Title/H1 Direction

These are approval candidates only.

| URL | Proposed title | Proposed H1 |
|---|---|---|
| `/real-estate-attorney/` | `עורך דין מקרקעין בישראל: קנייה, מכירה, חוזים ומיסוי | Jus-Tice` | `עורך דין מקרקעין: מדריך לקנייה, מכירה וחוזים` |
| `/criminal-defense-attorney/` | `עורך דין פלילי: חקירה, מעצר, כתב אישום וייצוג | Jus-Tice` | `עורך דין פלילי בישראל: מה עושים לפני חקירה או כתב אישום` |
| `/sex-crime-lawyer/` | `עורך דין עבירות מין: חקירה, כתב אישום וזכויות בהליך | Jus-Tice` | `עורך דין עבירות מין: זכויות, חקירה והגנה בהליך פלילי` |
| `/prenup-attorney/` | `עורך דין הסכם ממון: לפני נישואין, ידועים בציבור ודירה | Jus-Tice` | `עורך דין הסכם ממון: מה חשוב לבדוק לפני חתימה` |
| `/traffic-lawyer/` | `עורך דין תעבורה: שלילה, נקודות, נהיגה בשכרות וקנסות | Jus-Tice` | `עורך דין תעבורה: מה עושים אחרי דוח, נקודות או זימון לדין` |

## Safe Intro Formula

Each approved page should open with:

1. the exact user situation;
2. the practical risk;
3. what documents/facts to prepare;
4. when a lawyer is needed;
5. a neutral request/compare-lawyers CTA;
6. an editorial/reviewer disclosure after PR #8 is deployed.

Avoid: `מומלץ`, `הכי טוב`, guarantees, fake ratings, fake reviews, fake lawyer recommendations, or outcome promises.

## Implementation Gate

Do not upload edits to WordPress until:

1. owner/legal review approves the five title/H1 directions;
2. PR #8 authority changes are merged or reviewers confirm this batch can proceed independently;
3. pre-edit snapshots are saved;
4. post-edit checks are ready: 200 status, title/H1 match, no noindex/canonical issue, sitemap inclusion, lead CTA intact.

## 2026-05-19 Pre-Edit Snapshot

Added `tools/snapshot-money-query-pages.mjs` and captured the live baseline before any public CMS edits:

- `reports/money-query-preedit-snapshot-2026-05-19.csv`
- `reports/money-query-preedit-snapshot-2026-05-19.json`

Snapshot result:

| URL | Status | Sitemap | Canonical | Noindex | H1 count | Lead intent |
|---|---:|---|---|---|---:|---|
| `/real-estate-attorney/` | 200 | YES | self | NO | 1 | YES |
| `/criminal-defense-attorney/` | 200 | YES | self | NO | 2 | YES |
| `/sex-crime-lawyer/` | 200 | YES | self | NO | 1 | YES |
| `/prenup-attorney/` | 200 | YES | self | NO | 1 | YES |
| `/traffic-lawyer/` | 200 | YES | self | NO | 1 | YES |

Interpretation: these pages are eligible for a no-URL-change title/H1/intro rescue. The criminal page has two H1s and should be checked during implementation. The sex-crime page has a very long title and meta description, which strengthens the case for a careful rewrite.

## 2026-05-19 Post-Edit Verification Packet

Added a post-edit verification checklist:

- `project-control/money-query-post-edit-verification-2026-05-19.md`
- `project-control/money-query-post-edit-verification-2026-05-19.csv`

This defines the exact after-edit checks: HTTP 200, same final URL, sitemap inclusion, self-canonical, no noindex, approved title/H1 rendering, H1 count, lead intent, URL Inspection live test, Request Indexing, and 14/28/45-day GSC measurement.

## Completion Assessment

Money-query SEO recovery moves to **37%** for this lane, and PR #9 review readiness is now **76%**.

What advanced: the old Batch 001 is now refreshed with stronger GSC evidence, current live title/H1 checks, safer title/H1 directions, a no-URL-change implementation gate, a saved pre-edit snapshot report, and a post-edit verification packet.

2026-05-19 17:29 review handoff: PR #9 is no longer draft, remains mergeable, `git diff --check` passed, and `node tools/check-live-traffic-priority.mjs` passed.

What remains blocked: human review, owner/legal approval, public CMS edits, PR #8 authority sequencing, Search Console recrawl requests, and measured CTR lift.

Where the owner can notice now: this packet and the CSV next to it.  
Where the owner can notice after implementation: titles/H1s on the five pages, then GSC CTR movement.
