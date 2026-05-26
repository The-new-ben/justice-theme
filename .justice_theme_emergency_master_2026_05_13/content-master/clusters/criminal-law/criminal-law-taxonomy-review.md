# Criminal Law — Taxonomy Review

**Date:** 2026-05-15
**Cycle:** Taxonomy audit (HARD STOP gate)
**Status:** Taxonomy is functional on live for Criminal Law; structural cleanup still required.

## 1. Criminal Law taxonomy objects

| Object | Value | Status | Source |
|---|---|---|---|
| practice-areas term | `criminal-law`, term ID **170**, name משפט פלילי | Exists, in use | Nahari profile + theme seed `inc/taxonomy-seed.php` |
| Term post count | ~139 posts on term 170 (per 2026-05-14 review) | Healthy | Prior review doc — not re-counted this cycle |
| Competing `category` term | `criminal-law`, category ID **730**, ~18 posts | Cannibalization risk | Prior review doc |
| Lawyer assigned | Sharon Nahari (post 19309) → practice-areas `[170]` | Working | Live REST `/wp-json/wp/v2/justice_lawyer/19309` |

## 2. What is verified working

- `practice-areas` is registered, hierarchical, `show_in_rest` true, and attached to `articles`, `post`, `justice_lawyer` on live.
- The Criminal Law term (170) is a clean English slug `criminal-law` with a Hebrew name — correct convention.
- Sharon Nahari is published, typed `justice_lawyer`, and carries `practice-areas:[170]` + `city:[700,721]`. The Criminal Law → lawyer link exists at the data layer.
- The REST query path `…/justice_lawyer?practice-areas=170` is exposed (the term's `wp:post_type` links include `justice_lawyer`), so a Criminal Law page template *can* query lawyers by practice area.

## 3. Open taxonomy issues that affect the Criminal Law hub

1. **Category vs practice-area duplication.** Both `category/criminal-law` (730) and `practice-areas/criminal-law` (170) exist. This splits link equity and confuses crawlers. **Do not delete 730 yet** — first confirm every article under 730 is also tagged with term 170, then decide redirect/cleanup in a later approved cycle.
2. **Legacy term pollution in `practice-areas`.** The taxonomy contains old categories merged in (URL-encoded Hebrew slugs, terms carrying full HTML article bodies as descriptions). The Criminal Law term itself is clean, but the taxonomy it lives in is not — this hurts the practice-area archive quality sitewide.
3. **Full Criminal Law sub-term map not yet built.** The brief's Criminal Law sub-topics (חקירה במשטרה, זכויות נחקר, מעצר, כתב אישום, רישום פלילי, מחיקת רישום פלילי, עבירות סמים, עבירות מין, עבירות אלימות, צווארון לבן, שימוע, הסדר מותנה, סגירת תיק) are **not yet represented as child terms** under `criminal-law` (170). Decision needed: child terms vs. tags vs. pillar/spoke pages only.
4. **Lawyer image missing.** Nahari has `featured_media = 0`. Not a taxonomy bug, but it blocks a clean lawyer card on the Criminal Law hub. Handle per `lawyer-profile-image-system.md`.

## 4. Fix applied this cycle (theme code)

`inc/taxonomy-seed.php` — the safety-net function was generalised:

- Old: `justice_theme_ensure_practice_areas_on_lawyer_cpt()` (practice-areas → justice_lawyer only).
- New: `justice_theme_ensure_core_taxonomy_objects()` at `init` priority 99 — guarantees `practice-areas → articles, post, justice_lawyer` **and** `city → justice_lawyer`, regardless of which plugin copy is active or load order.
- Purely additive + idempotent (only ever *adds* a missing association). Old function name kept as a back-compat alias.
- This makes the Criminal Law → lawyer/article taxonomy links deterministic on every page load instead of dependent on plugin load order.

Deployment marker bumped to `2026-05-15-taxonomy-object-type-safety-net-v1` so the live server state can be verified after uPress Pull.

## 5. Not done / needs follow-up before the Criminal Law hub work

- Confirm the **active plugin copy** (`wp-admin/plugins.php`) — inferred to be `ultra-justice`.
- Pull the **complete `practice-areas` term inventory** (tooling truncated it this cycle) and build the legacy→canonical merge map.
- Re-verify the **lawyer card + single profile templates** actually render practice-area and city.
- Decide the **Criminal Law sub-term structure** (child terms vs pillar/spoke pages).
- Then, and only then, proceed to the Criminal Law category-page review and the pillar/spoke build.

## 6. Hard-stop status

Taxonomy is **functional but not yet clean**. The data links Criminal Law needs (term 170, lawyer assignment, REST exposure) are verified working and now hardened in code. The remaining items (legacy term cleanup, category/practice duplication, sub-term map) are **documented and safe to defer** — they do not block continuing within the Criminal Law layer, but they must be resolved before moving to the next practice area.
