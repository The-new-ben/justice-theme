# Taxonomy Governance — Jus-Tice.co.il

**Date:** 2026-05-15
**Owner:** project (Ben)
**Purpose:** Single source of truth for how taxonomies are registered, named and used across the legal portal — articles, lawyers, practice-area pages, city pages, directory filters, breadcrumbs, sitemap, schema and future lead routing.

## 1. Canonical taxonomy model

| Taxonomy | Slug | Object types (canonical) | Hierarchical | Purpose |
|---|---|---|---|---|
| Practice areas | `practice-areas` | `articles`, `post`, `justice_lawyer` | Yes | The one and only "legal field" taxonomy. Every article and every lawyer is classified here. |
| City | `city` | `justice_lawyer` | No | Geographic classification for the lawyer directory and city pages. |
| Category | `category` | `post` (+ legacy CPTs) | Yes | Legacy WordPress categories. **Not** the legal-field taxonomy. Being phased toward `practice-areas`. |
| Post tag | `post_tag` | `post` | No | Free-form tags. Not used for legal-field classification. |

**Rule:** `practice-areas` is the canonical legal-field taxonomy. `category` must not be used as a parallel legal-field system. New legal classification always goes to `practice-areas`.

## 2. Verified live state (2026-05-15)

- `practice-areas` — live label "Practice Areas" (English — should be Hebrew "תחומי משפט"), object types `articles, post, justice_lawyer`, `show_in_rest` true. ✅ attached correctly.
- `city` — live label "ערים", object types `lawyer (legacy), justice_lawyer`, `show_in_rest` true. ✅ attached to `justice_lawyer`.
- `category` — still attached to legacy CPTs `labor_law, small_claims, corona_virus, supreme_court` plus `post, articles`.
- SEO plugin: **Yoast SEO v27.6** (relevant because Yoast also emits BreadcrumbList schema and sitemaps — taxonomy term pages inherit Yoast output).

## 3. The core infrastructure problem

The theme repository bundles **three plugin copies**, two of which collide:

| Folder | Function prefix | Hebrew encoding | Practice-areas label | Notes |
|---|---|---|---|---|
| `justice-core` | `uje_` | **Corrupted** (mojibake) | Hebrew | Do not activate as-is |
| `ultra-justice-engine` | `uje_` | Correct | Hebrew | **Same function names as justice-core → fatal redeclare if both active** |
| `ultra-justice` | `uj_` | Correct | English | Inferred to be the currently active copy (live label is English) |

**Governance rules going forward:**

1. **Exactly one** of these plugin copies may be active at any time. `justice-core` and `ultra-justice-engine` can never both be active (function name collision = fatal error).
2. The repo must converge on **one canonical plugin copy**. Recommended: pick the active one, fix its labels/encoding, delete the other two folders from the theme repo (after confirming the active copy in `wp-admin/plugins.php`).
3. Plugin copies should not live inside the theme folder long-term — either move plugin source to its own repo/path, or document explicitly why it is bundled.
4. The theme keeps a **safety net** in `inc/taxonomy-seed.php` (`justice_theme_ensure_core_taxonomy_objects()`, `init` priority 99) that guarantees the canonical object-type associations regardless of which plugin copy is active. This net is additive and idempotent — it never removes associations.

## 4. Registration rules

- `practice-areas` and `city` must always register with `show_ui`, `show_admin_column`, `show_in_rest` all true.
- Object-type association is guaranteed by the theme safety net at `init` priority 99 — do not rely on plugin/CPT load order.
- REST field name for a taxonomy on a post equals the taxonomy slug (`practice-areas`, `city`). Do not rename.
- Programmatic assignment: REST `POST /wp-json/wp/v2/justice_lawyer/{id}` with body `{"practice-areas":[<term_id>],"city":[<term_id>...]}` using an authenticated App Password user with `edit_posts`.

## 5. Term naming standard

- **Slug:** lowercase Latin, hyphenated, English (`criminal-law`, `family-law`, `medical-malpractice`). Never percent-encoded Hebrew.
- **Name:** Hebrew display name (`משפט פלילי`, `דיני משפחה`). Never an English slug-string in the name field.
- **Description:** one short plain-text sentence. Never a full HTML article body (legacy terms violate this).
- One term per legal field. No semantic duplicates. No category/practice-area twins.

## 6. Known cleanup backlog (documented, not yet executed)

1. Pull the full `practice-areas` term inventory and build a legacy→canonical merge map (controlled merge, no deletes until mapped).
2. Rename the 9 city terms (IDs 700–710) that currently have Latin placeholder names to proper Hebrew names — names only, keep slugs/IDs.
3. Resolve `category/criminal-law` (730) vs `practice-areas/criminal-law` (170) duplication — re-tag, then decide redirect.
4. Give `practice-areas` term 713 (and any other) a real Hebrew name; clean the percent-encoded slug on term 18.
5. Decide and build the Criminal Law sub-term structure.
6. Inventory legacy CPTs (`labor_law`, `small_claims`, `corona_virus`, `supreme_court`, old `lawyer`) and decide keep/redirect/migrate.

## 7. Safe-change rules for taxonomy work

Allowed: additive code safety nets, term renames (name only), term description cleanup, building the inventory, REST diagnostics, single controlled term assignments.
Not allowed without explicit approval: deleting terms, merging terms in bulk, changing slugs (breaks URLs), deactivating/swapping plugins, mass re-tagging, changing `category`/`practice-areas` URL structure.
