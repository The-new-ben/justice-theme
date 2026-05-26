# Live CMS Lawyer Index Batch 2 - 2026-05-25

## What Changed

- Added 11 additional live `justice_lawyer` CMS records through the authenticated WordPress REST API.
- Total public REST lawyer/profile inventory after the batch: 20 records.
- The new batch includes 6 lawyer/law-firm public-basic cards from LawReviews service-search surfaces and 5 legal-service professional cards from Din public profile surfaces.
- All new records are `public_index`, `profile_status=public`, `plan_type=free`, `subscription_status=inactive`, and `verification_status=unverified`.
- Legal-service professionals use `professional_type=rabbinical_advocate` so the card can present them as professional cards rather than mislabeling them as ordinary lawyer profiles.

## Live Records Created

| ID | Slug | Title | Source |
|---:|---|---|---|
| 20541 | `public-basic-gila-eini` | עו"ד גילה עיני נוטריון מגשרת | LawReviews |
| 20542 | `public-basic-dana-nahum-buskila` | עורכת דין דנה נחום בוסקילה | LawReviews |
| 20543 | `public-basic-meital-yaakobi` | עורכת דין ומגשרת מיטל יעקובי | LawReviews |
| 20544 | `public-basic-yitzhaki-frid` | משרד עורכי דין יצחקי פריד | LawReviews |
| 20545 | `public-basic-portnoy-lis-kalfa` | משרד עורכי דין פורטנוי ליס כלפה ושות׳ | LawReviews |
| 20546 | `public-basic-hila-weintraub` | עורכת דין הילה וינטרוב | LawReviews |
| 20547 | `public-basic-nissim-abergel-rabbinical-mediator` | אברג׳ל נסים - טוען רבני ומגשר משפטי | Din |
| 20548 | `public-basic-david-asor-rabbinical-mediator` | דוד עשור טוען רבני ומגשר | Din |
| 20549 | `public-basic-elhanan-rabinsky-rabbinical-mediator` | טוען רבני ומגשר אלחנן רבינסקי | Din |
| 20550 | `public-basic-david-hassan-rabbinical-advocate` | טוען רבני דוד חסן | Din |
| 20551 | `public-basic-israel-ben-baruch-rabbinical-mediator` | טוען רבני ומגשר ישראל בן ברוך | Din |

## Verification

- `/wp-json/wp/v2/justice_lawyer?per_page=30` returns 20 public records.
- `/lawyers/?justice_readonly=1` returns 20 visible unique cards.
- Homepage lawyer showcase returns 6 CMS-backed cards.
- Single profile fallback returns HTTP 200 for `public-basic-israel-ben-baruch-rabbinical-mediator` with `X-Justice-Route: lawyer-profile-cms-fallback`.
- UTF-8 repair was applied after the first import attempt produced mojibake/question-mark titles.

## Revenue Status

- Realized revenue remains ₪0.
- Commercial progress: the platform now has real CMS inventory for public-basic claim/upgrade outreach.
- Near-term conversion target: 1 claimed/sponsored lawyer at ₪349-₪749/month, then repeat by field/city cluster.

## Safety

- No copied competitor photos.
- No copied competitor reviews.
- No copied competitor ratings.
- No fake verification or recommendation claims.
- No contact details displayed for unclaimed public-basic cards.
- No payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting changed.
