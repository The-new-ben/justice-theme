# Polish Cycles Log

**Format:** Each cycle = inspect → identify → fix → verify → document.
**Status of cycles:** Cycles 1–3 complete. Cycle 4 partially complete (live access blocked).

---

## Cycle 1 (2026-05-08, previous session)

**Scope:** Hebraize UI strings, fix critical bugs, project-control documents.

| Fixed | File |
|---|---|
| Removed double `<main>` in `single-justice_lawyer.php` | template |
| Removed `<main>` wrapper in `archive-justice_lawyer.php` (partial — orphan `</main>` remained) | template |
| Hebraized Customizer labels | `inc/lead-ui.php` |
| Hebraized reading-time, breadcrumb, article disclaimer | `inc/template-tags.php`, `inc/breadcrumbs.php`, `single-articles.php` |
| Fixed lawyer-card meta key prefix mismatch | `template-parts/cards/lawyer-card.php` |
| Fixed `is_paid` plan list to match plugin | `template-parts/cards/lawyer-card.php`, `single-justice_lawyer.php` |
| Added missing CSS custom properties | `assets/css/main.css` |
| Replaced emoji icons with SVG in `featured-pillars.php`, `featured-lawyers.php`, `lawyer-card.php` | templates |
| Fixed hero search form action + param names | `template-parts/sections/hero.php` |
| Fixed featured-lawyers query: correct CPT slug + correct meta query | template |
| Wrote 14+ project-control documents | `project-control/*.md` |

**Verified:** Code-only verification. Live behavior NOT VERIFIED.

---

## Cycle 2 (2026-05-08, plugin build)

**Scope:** Build the `jus-tice-engine` plugin.

| Built | File |
|---|---|
| Plugin scaffolding | `jus-tice-engine.php` |
| `justice_lawyer` CPT with 23 meta fields | `cpt-lawyers.php` |
| `justice_lead` CPT with 14 meta fields | `lead-submissions.php` |
| `practice-areas` taxonomy | `taxonomy-practice-areas.php` |
| `city` taxonomy | `taxonomy-city.php` |
| Lead form handler | `lead-submissions.php` |
| 17 admin-only REST routes | `rest-health.php`, `rest-content-tools.php`, `rest-db-tools.php`, `seeder.php` |
| Lawyer auto-seeder (10 demo profiles) | `seeder.php` |
| Audit log | `logger.php` |

**Verified:** Plugin file structure exists. Activation result on live NOT VERIFIED.

---

## Cycle 3 (2026-05-10, this session, code fixes)

**Scope:** Critical code bugs found during deep audit.

| Fixed | File | Severity |
|---|---|---|
| Orphan `</main>` in archive-justice_lawyer.php (invalid HTML) | template | High |
| `taxonomy-city.php` registered against `'lawyer'` instead of `'justice_lawyer'` | plugin | High |
| `cpt-articles.php` labels English → Hebrew | plugin | Medium |
| `taxonomy-practice-areas.php` labels English → Hebrew + attached to `'justice_lawyer'` (was `'post'`) | plugin | High |
| `lawyer-cta.php` emoji icons (👤📩📊) → inline SVG | template | Low |
| `ask-lawyer.php` form `action="#"` (leads going nowhere) → `admin-post.php?action=justice_submit_lead` | template | Critical |
| `trust-section.php` fake "10+ years" → cities count + conditional render | template | High (trust) |
| `topic-clusters.php` links to non-existent pages → term-link-with-fallback | template | High |
| `topic-clusters.php` queried `'post'` (spam-prone) → `'articles'` only | template | Medium |
| `featured-pillars.php` links to non-existent pages → term-link-with-fallback | template | High |
| Canonical URL meta tag added | `inc/seo.php` | High (SEO) |
| Robots noindex for thin pages added | `inc/seo.php` | Medium (SEO) |
| Attorney schema (Schema.org) added | `inc/schema.php` | High (SEO) |
| LegalService schema added on practice-area pages | `inc/schema.php` | Medium (SEO) |
| Customizer `justice_whatsapp` + `justice_business_hours` settings added | `inc/lead-ui.php` | Medium |
| Lawyer view counter excludes bots/admins/feeds | `single-justice_lawyer.php` | Medium (data) |
| Removed dead `agent-bridge.php` and `file-tools.php` (not loaded) | plugin | Low |
| Added CSS for ask-lawyer notice (success/error) | `main.css` | Low |
| Added CSS auto-fit for lawyer grid (handles 1–3 lawyers gracefully) | `main.css` | Medium |
| Polished breadcrumbs styling (white bg, sharper separator, bold current) | `main.css` | Medium |
| Polished lawyer card depth (avatar border, area pill, larger name) | `main.css` | Medium |
| Polished practice-area card icon | `main.css` | Low |

**Verified:** Code-level verification via Read tool. Live behavior NOT VERIFIED.

---

## Cycle 4 (NEXT — when live access available)

**Cannot proceed without:**
- WP-CLI access OR REST `/health` access on live
- Browser access to jus-tice.co.il for visual verification
- WP Admin access to populate menus, terms, pages, lawyer profiles, logo

**Planned:**
1. Verify plugin is active + version 1.0.0
2. Verify CPTs registered (`justice_lawyer`, `articles`, `justice_lead`)
3. Verify taxonomies registered (`practice-areas`, `city`)
4. Run `/reports/spam` and trash any casino content
5. Run `/reports/duplicates` and consolidate
6. Run `/reports/plugins` to confirm only ONE Justice plugin
7. Create taxonomy terms (10 practice areas, 20 cities)
8. Create pillar PAGES per `url-strategy.md`
9. Upload logo
10. Assign menus
11. Take live screenshots at desktop + mobile widths
12. Run Lighthouse audit
13. Document findings in cycle 5

---

## How to log a new cycle

Add a new section above with:

```markdown
## Cycle N (date, scope)

| Fixed | File | Severity |
|---|---|---|
| ... | ... | ... |

**Verified:** how / where verified.
```
