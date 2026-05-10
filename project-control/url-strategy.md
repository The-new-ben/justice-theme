# URL Strategy

**Decision date:** 2026-05-10
**Status:** APPROVED — short English slugs at root for canonical pillar pages.
**Owner:** Jus-Tice
**Constraint:** Hebrew UI, Hebrew page titles, English slugs.

---

## 1. Final URL rules

| Rule | What it means |
|---|---|
| **R1** | Page titles are Hebrew. Slugs are short English. |
| **R2** | Pillar pages live at root: `/divorce-lawyer/`, `/criminal-lawyer/`, `/real-estate-lawyer/` — NOT `/practice-areas/divorce/`. |
| **R3** | Lawyer profiles live at `/lawyers/{slug}/`. Slugs are kebab-case Hebrew transliteration or English firm name. |
| **R4** | Articles live at `/articles/{slug}/`. Article slugs MAY use English keywords if cleaner. |
| **R5** | Practice-areas taxonomy archive (`/practice-areas/{slug}/`) acts as a SUPPORTING article cluster, not the canonical pillar. |
| **R6** | City filtering uses query strings: `/lawyers/?city=tel-aviv`. We do NOT create a separate `/lawyers-tel-aviv/` URL until volume justifies it. |
| **R7** | Combined area+city URLs (`/lawyers/?area=family-law&city=tel-aviv`) are **noindexed** to prevent thin-content sprawl (already wired in `inc/seo.php` `justice_theme_robots_meta()`). |
| **R8** | NO Hebrew slugs in URLs. `/עורך-דין-גירושין/` is BANNED. |
| **R9** | NO ugly suffixes. `-2`, `-3`, trailing numbers indicate duplicates and must be merged or redirected. |
| **R10** | Every URL change ships with a 301 redirect rule. Map first in `url-migration-map.csv`, then act. |
| **R11** | Canonical tags are emitted by the theme (`inc/seo.php` `justice_theme_canonical_url()`) on every public page; deferred when Yoast/RankMath/AIOSEO is detected. |

---

## 2. URL hierarchy

```
/                                       (homepage — Hebrew title, no slug)
/divorce-lawyer/                        (pillar PAGE — Hebrew H1: "עורך דין גירושין")
  /consensual-divorce/                  (supporting PAGE)
  /child-support/                       (supporting PAGE)
  /child-custody/                       (supporting PAGE)
  /divorce-property-division/           (supporting PAGE)
  /divorce-mediation/                   (supporting PAGE)
  /prenuptial-agreement/                (supporting PAGE)

/criminal-lawyer/                       (pillar PAGE — "עורך דין פלילי")
  /police-investigation/
  /indictment/
  /pretrial-detention/
  /drug-offenses/
  /sex-offenses/
  /white-collar-crime/

/real-estate-lawyer/                    (pillar PAGE — "עורך דין מקרקעין")
  /buying-apartment/
  /real-estate-purchase-agreement/
  /land-registry/
  /construction-defects/
  /urban-renewal/

/traffic-lawyer/                        (pillar PAGE — "עורך דין תעבורה")
  /drunk-driving/
  /license-suspension/
  /traffic-tickets/

/labor-lawyer/                          (pillar PAGE — "עורך דין דיני עבודה")
/inheritance-lawyer/                    (pillar PAGE — "עורך דין ירושה")
/medical-malpractice-lawyer/            (pillar PAGE — "עורך דין רשלנות רפואית")
/personal-injury-lawyer/                (pillar PAGE — "עורך דין נזיקין")

/lawyers/                               (DIRECTORY archive — justice_lawyer CPT)
  /lawyers/{slug}/                      (lawyer profile)
  /lawyers/?city=tel-aviv               (filtered, indexable)
  /lawyers/?area=family-law             (filtered, indexable)
  /lawyers/?city=X&area=Y               (NOINDEX — combinatorial)
  /lawyers/?keyword=X                   (NOINDEX — search)

/articles/                              (article archive)
  /articles/{slug}/                     (single article)

/practice-areas/{slug}/                 (taxonomy archive — supporting cluster, NOT canonical)
/category/{slug}/                       (legacy WP category — should be merged into practice-areas)

/contact/                               (PAGE)
/about/                                 (PAGE)
/privacy/                               (PAGE)
/terms/                                 (PAGE)
/editorial-policy/                      (PAGE — required for E-E-A-T / YMYL)
/advertising-disclosure/                (PAGE — required by Israeli Bar advertising rules)
/lawyer-registration/                   (PAGE — B2B onboarding entry)
/lawyer-plans/                          (PAGE — pricing for lawyers)
```

---

## 3. Why pillar pages are PAGES, not taxonomy archives

| Reason | Detail |
|---|---|
| **Editorial control** | A WP Page lets the editor write 1500–3000 words of pillar content with sections, FAQs, schema, lawyer carousel, articles list, lead form. A taxonomy archive is just a query result with a description field. |
| **Schema flexibility** | Pillar PAGE can emit `LegalService` + `FAQPage` + custom Lawyer carousel — all in one URL. Taxonomy archive cannot. |
| **Cluster math** | One canonical PAGE = `/divorce-lawyer/` + supporting PAGES + supporting articles. The taxonomy archive at `/practice-areas/family-law/` becomes the article-cluster index, NOT the SERP target. Both URLs serve different intents. |
| **Anti-cannibalization** | If pillar = taxonomy archive, every supporting article tagged with that taxonomy creates an internal competing page. Better: pillar PAGE manually links to chosen children. |

**Implication:** Currently `featured-pillars.php` and `topic-clusters.php` use a fallback that points to either the taxonomy term link OR the lawyer directory filter (whichever exists). When the editor creates the actual pillar PAGES, those URLs will work — but those code paths still fall back gracefully if the page doesn't exist. The editor must manually update the link map.

**See:** `frontend-cms-map.md` for which template renders which URL.

---

## 4. Slug normalization

See `slug-normalization-rules.md` for the full spec. Summary:

- Lowercase only.
- Words joined by single `-` hyphens. NEVER `_` or spaces.
- ASCII only. NEVER Hebrew, NEVER emoji, NEVER special characters.
- Stop words removed (`the`, `a`, `of`).
- Money keyword first: `divorce-lawyer` not `lawyer-divorce`.
- Plural vs singular: prefer **singular** unless plural is the dominant search term.
- Maximum 60 chars (URL friendly + readable).

---

## 5. Migration approach

### Phase 0 — DOCUMENT (now)
1. Build full `url-migration-map.csv` of every existing URL on live server.
2. NOT VERIFIED — depends on live server access. Owner must export Search Console URL list and WP `wp_posts` table to populate it.
3. Until Phase 0 is done, **DO NOT change any existing URL**.

### Phase 1 — CREATE PILLARS (next)
1. Create the pillar PAGES in WP Admin with the slugs in section 2.
2. Each pillar PAGE: H1 in Hebrew, body 1500+ words, FAQ section, internal links to lawyer directory, `Page` template (default).
3. Each pillar PAGE links to its supporting articles.
4. Update internal navigation menus to point to the new pillar PAGES.

### Phase 2 — REDIRECT (after pillars exist)
1. For every legacy URL that should become a pillar, write a 301 in `.htaccess` (Apache) or via Redirection plugin.
2. NEVER delete the legacy content silently. Always redirect.
3. After 30 days, verify no traffic loss in Search Console.

### Phase 3 — CLEANUP (after Phase 2 stable)
1. Trash legacy duplicate articles (do NOT permanently delete for 90 days).
2. Update sitemap.
3. Update breadcrumbs.
4. Re-submit sitemap to Search Console.

---

## 6. Risks

| Risk | Mitigation |
|---|---|
| Changing slugs breaks live ranking URLs | Map first (Phase 0), redirect always (Phase 2), monitor GSC for 30+ days |
| Hebrew slugs already indexed | Identify in `url-migration-map.csv` with `traffic_risk=HIGH`; consider keeping if traffic is significant |
| Multiple URLs target same keyword (cannibalization) | `cannibalization-map.csv` already lists known cases; resolve via canonicals or merge |
| Plugin permalink change requires `flush_rewrite_rules()` | Plugin activation already calls this; manual change requires Settings → Permalinks → Save |

---

## 7. Verification status

| Item | Status |
|---|---|
| URL strategy decision documented | ✅ done |
| Code paths use term-link-with-fallback (no 404 risk) | ✅ done — `featured-pillars.php`, `topic-clusters.php` |
| Canonical tag emitted on all page types | ✅ done — `inc/seo.php` |
| `noindex` on combinatorial directory URLs | ✅ done — `inc/seo.php` `justice_theme_robots_meta()` |
| Pillar PAGES created in WP Admin | ❌ NOT DONE — requires editor in WP Admin |
| Legacy URL inventory exported from Search Console | ❌ NOT DONE — BLOCKED on GSC access |
| Redirect rules deployed | ❌ NOT DONE — requires Phase 0 inventory first |
| Sitemap regenerated and submitted | ❌ NOT DONE — requires Yoast/RankMath/AIOSEO install |
