# Entity network: the contract between the SEO layer and the redesign

Owner order 2026-09-07: Astra redesigns the whole site; the entity network (Claude's lane) must float into the new design and enrich the pages, and the two lanes collaborate instead of overwriting each other. This document is the whole interface. Everything the design needs is a function call or a filter; nothing in the design needs to know how the pages are seeded.

## What exists

- 235 reference pages in five waves (family, criminal, real estate, labor, medical malpractice), ordinary WordPress pages with clean English slugs at the site root, seeded once from `justice-ops/data/legal-entities/*.php`. Every page carries an intro, a sourced facts box ("בקצרה"), sections, official sources, related links, a link to the simulation and the disclaimer.
- Each page belongs to one money pillar (`pillar` in the data): `divorce-lawyer`, `family-law`, `criminal-defense-attorney`, `real-estate-attorney`, `labor-lawyer`, `medical-malpractice-lawyer` and a few narrower ones.
- Two automatic placements exist today and keep working under any theme: a hierarchy line (`nav.jt-entity-crumb`) at the top of every entity page, and a practical-information hub (`section.jt-entity-hub`) at the end of every pillar page. Both are plain, parameter-free links.

## What the design can call

```php
// The hub of a pillar, ready HTML (empty string below 3 live items).
echo justice_ops_entity_hub_html( 'divorce-lawyer' );
echo justice_ops_entity_hub_html( 'divorce-lawyer', 'כלים, אגרות וטפסים בגירושין' );

// The hierarchy line of the entity page being served.
echo justice_ops_entity_crumb_html();

// Plain data for a custom component: slug, title, description, url (live pages only).
foreach ( justice_ops_entity_items( 'labor-lawyer', 12 ) as $item ) { ... }
```

Shortcode for page builders and Gutenberg: `[justice_entity_hub pillar="criminal-defense-attorney" title="…"]`.

REST for the React side (jus-tice.com, mega menu, search): `GET /wp-json/justice-ops/v1/entities?pillar=medical-malpractice-lawyer` returns `{pillar, url, items[]}`; without `pillar` it returns every pillar with its live count.

## How to take over the placement

If the new templates render the hub or the hierarchy line themselves:

```php
add_filter( 'justice_ops_entity_auto_wire', '__return_false' );
```

To keep the automatic placement but restyle the markup:

```php
add_filter( 'justice_ops_entity_hub_html', function ( $html, $pillar, $items ) { /* rebuild from $items */ return $html; }, 10, 3 );
add_filter( 'justice_ops_entity_crumb_html', function ( $html, $slug, $entry ) { return $html; }, 10, 3 );
```

The default CSS is printed in `wp_head` only on entity and pillar pages, inside `<style id="jt-entity-wiring-css">`; a theme that ships its own styles for `.jt-entity-hub` and `.jt-entity-crumb` can drop that block with `remove_action` or override it, both are fine.

## Where the links should float in the new design (recommendation, not a rule)

1. Pillar pages: the hub belongs right after the pillar's first answer block and before the lead form, as a two-column card grid with the heading as the section title. Google reads the whole page, users read the first screen, so the hub also earns a shorter "top 6" strip near the top if the design has room.
2. Entity pages: keep the hierarchy line in the first viewport; the theme's own breadcrumb and Yoast's BreadcrumbList already carry the pillar (the plugin inserts it), so the design may render one visible line, not two.
3. Mega menu: each practice column can list its top entity items from the REST route (fees, forms, institutions), which is exactly what the reference sites rank with.
4. Homepage: a "מידע מעשי" band with the counts per pillar from `/entities` (no pillar) turns 235 pages into a visible product.

## What must not change from the design lane

- Slugs and URLs of the seeded pages (301 layers and internal links depend on them). Titles and bodies may be edited in wp-admin; an edited page is detected by fingerprint and is never overwritten by the plugin's refresh pass.
- The data files under `justice-ops/data/legal-entities/` and `justice-ops/legal-entities.php` stay in Claude's lane; the theme lane calls them and never forks them.
- `/legal-simulation/` and the Hadmaia bridge stay in Astra's lane; the entity pages only link to the simulation.

Status and proofs: `GET /wp-json/justice-ops/v1/entity-waves` (seeding, refresh, data currency, lock), stub test `php tests/test-legal-entities-wiring.php`.
