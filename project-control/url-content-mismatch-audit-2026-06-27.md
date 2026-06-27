# URL ↔ content mismatch audit (site-wide)

Date: 2026-06-27. Trigger: owner reported the WhatsApp button on
`/child-support-alimony-updated-guidelines-2023/` "opened a different page about police
stations", suspected many confused URLs / redirects. Owner: "check deeply, the whole site
if needed — SEO state is not good."

## Bottom line

It is NOT a WhatsApp bug and NOT a redirect bug. The WhatsApp button, the redirect map,
and the canonical tags are all correct. The real problem is a **database slug ↔ content
mismatch**: the post living at a given English slug contains an article about a *different
topic*. The slug says one thing, the post body/title/H1 say another.

The reported page is the clearest case:

| Field | Value |
|---|---|
| URL / slug | `child-support-alimony-updated-guidelines-2023` (a child-support / alimony slug) |
| Post ID | 6005 (CPT `articles`, status `publish`) |
| Actual `<title>` / `og:title` / `<h1>` | **תחנות משטרה כתובת טלפון רשימה ארצית מעודכן 2023** (police stations) |
| Canonical | correct (matches the slug) |
| HTTP | 200, zero redirects |

So a visitor (or Google) on a "child support / alimony" URL is served a **police-stations**
article. The WhatsApp button on that page works fine — it is the *page itself* that is the
wrong article. The owner saw "police stations" because the page content is police stations.

This is a fingerprint of a botched Hebrew→English slug migration: English slugs were
assigned to the wrong posts. Corroborating evidence in code: `inc/url-redirects.php` line
~875 has a truncated entry `'תחנות-משטרה-כתובת-טלפון-רשימה-ארצית-מע' => 'updated-2023'`,
a leftover from that migration.

## How the audit was run

Pulled all 1,219 `articles` via the REST API (`/wp-json/wp/v2/articles`, raw `post_title`
straight from the DB, bypassing any theme title filtering). Classified each post's English
slug into a legal topic domain and its Hebrew title into a domain, then flagged posts where
the two domains conflict. Script + data: scratchpad `detect_mismatch.py`, `articles.json`,
`mismatches.json`.

Note: this method only catches **cross-topic** mismatches (police vs family, labor vs real
estate, etc.). Same-domain mismatches (e.g. a divorce article sitting on a child-custody
slug) are invisible to it, so the true count of mis-slugged posts is likely higher. The
cross-topic ones below are the most SEO-damaging because they serve wholly off-topic content
for the keywords baked into the URL.

## Confirmed cross-topic mismatches (live, published) — need owner decision per URL

These are real. Slug topic and content topic genuinely disagree.

| # | Post ID | Slug (URL) | Slug implies | Actual content (Hebrew title) |
|---|---|---|---|---|
| 1 | 6005 | `child-support-alimony-updated-guidelines-2023` | child support / alimony | תחנות משטרה כתובת טלפון רשימה ארצית מעודכן 2023 (police stations) |
| 2 | 2127 | `tenancy-regulation-israel-landlord-tenant` | landlord/tenant law | טופס הצהרת עובד על מדידת חום… תקנות חירום נגיף הקורונה (COVID employee health-declaration form) |
| 3 | 1884 | `ottoman-land-code-1884-israel-property` | Ottoman land code / property | נגיף הקורונה: בג"צ צו ביניים נגד תקנות מעקב שב"כ ומשטרה על טלפונים (COVID Shin Bet/police phone-tracking ruling) |
| 4 | 1827 | `criminal-appeal-sentencing-review-israel` | criminal appeal / sentencing | נגיף הקורונה: היתר כללי להעסקת עובדים בשעות נוספות (COVID overtime-employment permit) |
| 5 | 7305 | `labor-law-article-7305-employee-rights-israel` | labor / employee rights | מהי רשלנות \| עוולת הרשלנות (general tort of negligence) |
| 6 | 6558 | `rabbinical-court-divorce-verdict-57428-12-19` | rabbinical-court divorce verdict | פלילים: נהג מונית שהואשם במעשה מגונה בנוסעת (criminal indecent-act case) |

Pattern: items 2–4 are old COVID-era articles that were handed high-value evergreen legal
English slugs. Item 5 has an auto-generated `article-7305` slug. Item 6 is a criminal case
on a divorce slug.

## Flagged but FALSE POSITIVES (no action — listed so they are not re-flagged)

- #823 `dui-refusal-blood-breath-urine-test` → "סירוב לבדיקת שכרות" — perfect match; "שכרות"
  (drunkenness) tripped the "שכר" (wage) keyword.
- #6935 `receivers-trustees-property-management-court` → "שכר כונס נכסים…" — a receiver's-fee
  case, matches the slug; "שכר" tripped labor.
- #13152 `most-recommended-family-lawyer` → family lawyer who also handles inheritance — fine.
- #3202 `returning-resident-rights-determining-tax-rate` → returning-resident tax — both
  topics present in slug and title, fine.
- #8601 `…estate-trust-legal-judgment` → estate/trust judgment involving real estate — fine.
- #7113 `apartment-tax-partners` → apartment division on tax grounds — fine.
- #1681 `tax-law-israel-guide-…` → municipality payroll-tax case — both tax, acceptable.
- #5570 `criminal-conviction-…-defense-options` → non-conviction smuggling case — criminal, ok.
- #5385 `criminal-sentencing-…` → vehicular-manslaughter sentencing — criminal, ok.
- #5602 `criminal-procedure-rights-investigation-israel` → social-worker role in proceedings
  — borderline (slug far more specific than content); low priority.
- #7067 `personal-injury-car-accident-compensation-bus` → worker slip-and-fall compensation —
  domain (personal injury) is right but the slug's specifics (car/bus accident) are wrong;
  low priority.

## Why the agent did NOT auto-fix these

Each fix is a per-URL editorial + SEO decision and a **database write** (changing a post's
slug and/or moving content), not theme code. Standing rule: no URL changes / redirects
without explicit per-URL owner approval ("no evil URLs"). Each of the 6 needs the owner to
choose one of:

- **(a) Re-slug the content** — give the post a slug that matches its real topic
  (e.g. move the police article to `israel-police-stations-directory-2023`) AND 301 the old
  slug. Frees the good keyword-rich slug to be reused by the right article later.
- **(b) Replace the content** — keep the slug, replace the off-topic body with a correct
  article for that slug's topic (best when the slug targets a high-value query the owner
  wants to rank for, e.g. child support / alimony).
- **(c) Leave + de-index** — if the content has value but the slug is wrong and low-traffic,
  `noindex` until decided.

Recommended default per case:
- #1 (6005): option (b) — child-support/alimony is a high-demand family query; write a real
  child-support article for this slug and move the police content to its own slug.
- #2,#3,#4 (COVID articles on evergreen slugs): option (a) — re-slug the COVID posts to
  honest covid-* slugs with 301s, freeing `tenancy-regulation…`, `ottoman-land-code…`,
  `criminal-appeal-sentencing…` for correct future articles.
- #5 (7305): option (a) — re-slug to a negligence/tort slug.
- #6 (6558): option (a) — re-slug to a criminal slug (indecent-act / sexual-offense case).

Before any of this runs, the agent needs (1) the owner's per-URL choice above and (2) WP
write access (application password) to perform the slug change + 301 via REST, since the
owner asked the agent not to type his password.
