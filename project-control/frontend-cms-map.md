# Frontend ↔ CMS Map

**Goal:** Every visible component on the site is either CMS-controlled OR explicitly documented as temporary/hardcoded.

---

## Legend

- **CMS** — Content comes from WordPress (CPT, taxonomy, customizer, menu, widget, page)
- **HARDCODED** — In a PHP file; editor cannot change without code edit
- **HYBRID** — Hardcoded structure + CMS data inside it
- **TEMP** — Hardcoded with intent to migrate to CMS later
- **NOT VERIFIED** — Status unknown, requires live server check

---

## Header

| Component | Source | File | Editable? |
|---|---|---|---|
| Logo image | CMS — Customizer custom logo | `header.php` line 39 calls `the_custom_logo()` | YES |
| Site name fallback (when no logo) | CMS — Settings > General | `template-parts/layout/site-header.php` line 42 | YES |
| Tagline | CMS — Settings > General | `site-header.php` line 43 | YES |
| Top trust line ("מידע משפטי, התאמת עורכי דין...") | HARDCODED | `site-header.php` line 19 | NO |
| Secondary nav | CMS — Menu (location: `secondary`) | `site-header.php` lines 24–30 | YES — assign menu in WP Admin > Appearance > Menus |
| Primary nav | CMS — Menu (location: `primary`) | `site-header.php` lines 55–60 | YES |
| Primary nav fallback (when no menu) | HARDCODED | `site-header.php` lines 77–84 (`justice_theme_fallback_menu`) | NO |
| Phone CTA in header | CMS — Customizer (`justice_phone`) | `site-header.php` lines 12, 65 | YES — Customizer > Contact |
| Mobile menu toggle | HARDCODED (markup) + JS | `site-header.php` line 48–51 + `assets/js/navigation.js` | NO |

---

## Hero (homepage only)

| Component | Source | File | Editable? |
|---|---|---|---|
| H1 ("מצאו את עורך הדין המתאים — לפי תחום ומיקום") | HARDCODED | `template-parts/sections/hero.php` line 54 | NO — code edit |
| Description | HARDCODED | `hero.php` line 58 | NO |
| Practice-area dropdown | CMS — `practice-areas` taxonomy terms | `hero.php` lines 18–23, 67–80 | YES — terms managed in WP Admin |
| City dropdown | HARDCODED ARRAY of 20 cities | `hero.php` lines 25–47, 87–93 | NO — code array (DUPLICATED in `cities-grid.php` and `site-footer.php` and `taxonomy-city.php` plugin) |
| Search input | n/a (form input) | `hero.php` lines 99–105 | n/a |
| Search button | HARDCODED text "חיפוש" | `hero.php` line 107 | NO |
| Stats: article count | CMS (live count via `wp_count_posts('articles')`) | `hero.php` lines 113–122 | n/a — live |
| Stats: practice-area count | CMS (live count via `wp_count_terms`) | `hero.php` lines 117, 123–126 | n/a — live |
| Stats: city count | HARDCODED — `count($israel_cities)` (20 cities) | `hero.php` lines 128–129 | NO — should query taxonomy when city terms exist on live |
| Hero panel quick-links | CMS — top 8 `practice-areas` terms by count | `hero.php` lines 137–158 | YES — managed via term creation/order |

---

## Practice areas grid (homepage)

| Component | Source | File | Editable? |
|---|---|---|---|
| Section heading | HARDCODED | `template-parts/sections/practice-areas-grid.php` lines 26–37 | NO |
| Cards | CMS — top 12 `practice-areas` terms (`parent=0`) | `practice-areas-grid.php` lines 12–17 | YES — create terms |
| Card icon | HARDCODED `§` symbol on each card | `template-parts/cards/practice-area-card.php` line 29 | NO — same icon for every term (LIMITATION — should be customizable per term) |
| Card description | CMS — term description | `practice-area-card.php` lines 35–39 | YES — edit term |
| Card count | CMS — `$term->count` | `practice-area-card.php` lines 41–53 | n/a — live |

---

## Cities grid (homepage)

| Component | Source | File | Editable? |
|---|---|---|---|
| Section heading | HARDCODED | `template-parts/sections/cities-grid.php` lines 34–37 | NO |
| 12 cities listed | HARDCODED ARRAY | `cities-grid.php` lines 16–29 | NO — duplicates list in `hero.php`, `site-footer.php`, `taxonomy-city.php` |
| Link target | HYBRID — `/lawyers/?city=slug` | `cities-grid.php` line 41 | n/a — handled by archive |

---

## Featured lawyers (homepage)

| Component | Source | File | Editable? |
|---|---|---|---|
| Section heading | HARDCODED | `template-parts/sections/featured-lawyers.php` lines 22–28 | NO |
| Lawyer cards | CMS — `justice_lawyer` CPT, ordered by `featured_until DESC` (showing only those with future date) | `featured-lawyers.php` lines 33–53 | YES — set `featured_until` meta on lawyer |
| Empty state ("מדריך עורכי הדין בבנייה") | HARDCODED | `featured-lawyers.php` lines 58–67 | NO — shown when no lawyers exist |

---

## Latest articles (homepage)

| Component | Source | File | Editable? |
|---|---|---|---|
| Section heading | HARDCODED | `template-parts/sections/latest-articles.php` lines 26–35 | NO |
| Article cards (6 latest) | CMS — `articles` CPT, ordered by date DESC | `latest-articles.php` lines 12–17 | YES — publish articles |

---

## Featured pillars (homepage)

| Component | Source | File | Editable? |
|---|---|---|---|
| 6 pillar cards | HARDCODED — array of 6 entries | `template-parts/sections/featured-pillars.php` lines 26–62 | NO — code edit (TEMP — should migrate to a "pillar" CPT or option) |
| Pillar URL | HYBRID — uses term link if it exists, falls back to `/lawyers/?area=slug` | `featured-pillars.php` lines 14–24 | n/a — automatic |
| Pillar icon | HARDCODED inline SVG (one per pillar) | `featured-pillars.php` | NO |

---

## Topic clusters (homepage)

| Component | Source | File | Editable? |
|---|---|---|---|
| 4 cluster cards | HARDCODED ARRAY of 4 topics | `template-parts/sections/topic-clusters.php` lines 12–17 | NO — code edit |
| Article links inside each cluster | CMS — top 4 articles in `practice-areas` term | `topic-clusters.php` lines 38–55 | YES — publish articles |
| "All guides" link | HYBRID — term link or directory fallback | `topic-clusters.php` lines 19–23 | n/a — automatic |

---

## Ask-a-lawyer form (homepage)

| Component | Source | File | Editable? |
|---|---|---|---|
| Section heading + intro | HARDCODED | `template-parts/sections/ask-lawyer.php` lines 17–21 | NO |
| Form fields | HARDCODED | `ask-lawyer.php` lines 27–37 | NO |
| Form action | HARDCODED — `admin-post.php?action=justice_submit_lead` | `ask-lawyer.php` line 27 | NO — handled by plugin |
| Disclaimer | HARDCODED | `ask-lawyer.php` line 47 | NO |

---

## Trust section (homepage)

| Component | Source | File | Editable? |
|---|---|---|---|
| Article count | CMS — live count | `template-parts/sections/trust-section.php` lines 12–13 | n/a |
| Practice area count | CMS — live term count | `trust-section.php` lines 15–16 | n/a |
| City count | CMS — live term count (FIXED — was hardcoded "10+ years") | `trust-section.php` lines 18–19 | n/a |
| Whole section conditional render — only if at least one stat > 0 | CODE | `trust-section.php` line 20–22 | n/a |

---

## Lawyer CTA (homepage — B2B)

| Component | Source | File | Editable? |
|---|---|---|---|
| All copy | HARDCODED | `template-parts/sections/lawyer-cta.php` lines 16–46 | NO |
| Icons | HARDCODED inline SVG (FIXED — were emojis) | `lawyer-cta.php` lines 23, 28, 33 | NO |
| Registration button | HARDCODED link to `/lawyer-registration/` | `lawyer-cta.php` line 40 | NO — page must exist |
| Plans button | HARDCODED link to `/lawyer-plans/` | `lawyer-cta.php` line 43 | NO — page must exist |

---

## Newsletter (homepage)

| Component | Source | File |
|---|---|---|
| Form | HARDCODED — no backend wired | `template-parts/sections/newsletter.php` |
| **GAP** | Form does nothing on submit. Needs Mailchimp/SendinBlue integration or simple subscriber CPT. |

---

## CTA section (homepage)

| Component | Source | File |
|---|---|---|
| Heading + buttons | HARDCODED | `template-parts/sections/cta-section.php` |

---

## Footer

| Component | Source | File | Editable? |
|---|---|---|---|
| Practice areas links bar (top 20 by count) | CMS — practice-areas terms | `template-parts/layout/site-footer.php` lines 19–55 | YES — terms |
| Cities links bar (12 cities) | HARDCODED ARRAY | `site-footer.php` lines 29–42 | NO — code array (DUPLICATE) |
| About blurb | HARDCODED | `site-footer.php` lines 70–73 | NO |
| Practice areas menu | CMS — Menu (location: `legal_areas`) | `site-footer.php` lines 78–84 | YES |
| Useful info menu | CMS — Menu (location: `footer_trust`) | `site-footer.php` lines 90–96 | YES |
| Contact phone | CMS — Customizer | `site-footer.php` line 12, 105 | YES |
| Contact email | CMS — Customizer | `site-footer.php` line 13, 112 | YES |
| Contact WhatsApp | CMS — Customizer (FIXED — added customizer setting) | `site-footer.php` line 14, 119 | YES |
| Copyright + disclaimer | HARDCODED | `site-footer.php` lines 130–138 | NO |
| WhatsApp float button | CMS — Customizer | `site-footer.php` lines 144–149 | YES |

---

## Lawyer profile page

All content from `justice_lawyer` CPT meta + taxonomies. Fully CMS.

| Component | Source | File |
|---|---|---|
| Photo | CMS — Featured image | `single-justice_lawyer.php` lines 50–56 |
| Name | CMS — `the_title()` | line 112 |
| Firm | CMS — `firm_name` meta | line 115 |
| Phone, WhatsApp, email, website, address | CMS — meta | lines 62–88 |
| Practice areas tags | CMS — `practice-areas` terms | lines 118–124 |
| Bio short | CMS — `bio_short` meta | lines 128–132 |
| Bio long | CMS — `the_content()` | line 135 |
| Cities served | CMS — `city` terms | lines 142–147 |
| Languages | CMS — `languages` meta | lines 149–154 |
| License status | CMS — `license_status` meta | lines 156–166 |
| Verification status | CMS — `verification_status` meta | lines 168–173 |
| Inquiry form | HARDCODED structure + plugin handler | lines 178–212 |

---

## Article page

| Component | Source | File |
|---|---|---|
| Primary practice area | CMS — first `practice-areas` term | `single-articles.php` lines 19–23 |
| Title | CMS | line 25 |
| Date, modified date | CMS | lines 28–42 |
| Sidebar CTA box | HARDCODED | lines 49–56 |
| Featured image | CMS | lines 59–63 |
| Content | CMS — `the_content()` | line 66 |
| Editorial note disclaimer | HARDCODED | lines 69–74 |
| Related articles | CMS — query in `inc/related-content.php` | line 83 |

---

## Lawyer directory archive

All filters use CMS data. Fully CMS-driven query.

| Component | Source | File |
|---|---|---|
| Page title (dynamic by filters) | CODE — varies by `?city`/`?area` query | `archive-justice_lawyer.php` lines 75–94 |
| Filter dropdowns | CMS — taxonomy terms | lines 96–149 |
| Lawyer cards | CMS — `justice_lawyer` CPT, ordered by `priority_score DESC` | lines 21–73 |
| Empty state | HARDCODED | lines 174–182 |

---

## CMS connection summary

| Layer | CMS-controlled | Hardcoded | Stub |
|---|---|---|---|
| Content body | YES (CPTs, taxonomies, pages) | minimal | n/a |
| Layout structure | NO | YES (templates) | n/a |
| Menu/navigation | YES (6 menu locations) | fallback only | n/a |
| Logo | YES (Customizer) | text fallback | n/a |
| Contact info (phone, email, WhatsApp, hours) | YES (Customizer) | defaults | n/a |
| City data | NO — duplicated 4 places | YES (4 places) | should be unified to `city` taxonomy |
| Pillar pages | NO — hardcoded array | TEMP | should be "pillar" CPT or WP Pages |
| Newsletter signup | n/a | n/a | NOT WIRED |
| Lead form | YES (handler in plugin) | structure hardcoded | n/a |

---

## Top CMS gaps to close

| Gap | Effort | Priority |
|---|---|---|
| Unify city data in 4 files → use `city` taxonomy everywhere | M | High |
| Migrate hardcoded pillar array → WP Pages with the slugs in `url-strategy.md` | L | High |
| Wire newsletter form to Mailchimp/SendinBlue | M | Medium |
| Custom logo for each `practice-areas` term (currently identical `§` icon) | M | Medium |
| Article author = real Person not Organization (E-E-A-T) | S | High |
| Pillar PAGE has lawyer carousel + supporting article list (template part) | M | High |
