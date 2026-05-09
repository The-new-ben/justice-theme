# Changelog — Jus-Tice Portal

## [2.0.0] — 2026-05-09

### Plugin (justice-core)
- **BREAKING:** Renamed CPT from `lawyer` → `justice_lawyer`
- **BREAKING:** Renamed CPT from `lead` → `justice_lead`
- Expanded lawyer meta: 30+ fields (identity, professional, contact, commercial, analytics, admin)
- Three admin meta boxes: Identity, Contact, Commercial
- Lead CRM: 8-status workflow (new, qualified, assigned, contacted, accepted, rejected, converted, closed)
- UTM campaign tracking on leads
- REST health endpoint: `/justice-core/v1/health`
- REST theme-state endpoint: `/justice-core/v1/theme-state`
- Lawyer seeder: `/justice-core/v1/seed-lawyers` (POST, admin-only)
- Seeder function reads from `data/lawyer-seed.csv`

### Theme (justice-theme)
- Renamed `archive-lawyer.php` → `archive-justice_lawyer.php`
- Renamed `single-lawyer.php` → `single-justice_lawyer.php`
- Updated all meta key references (removed `_justice_` prefix → direct field names)
- Updated SEO title hooks for `justice_lawyer` CPT
- Removed emoji from visible UI labels
- Added verification badge to profile page
- Added office address field to profile template
- Added bio_short display above full content

### Documentation
- Created `project-control/current-status.md`
- Created `project-control/lawyer-seed.csv` (10 fictional test profiles)
- Created `project-control/changelog.md`

## [1.1.0] — 2026-05-08

### Plugin
- Added `cpt-lawyers.php` with `lawyer` CPT (14 meta fields)
- Added `taxonomy-city.php` with 20 pre-seeded cities
- Upgraded `lead-submissions.php` to CPT + email

### Theme
- Created `archive-lawyer.php` directory listing
- Created `single-lawyer.php` profile page
- Created `lawyer-card.php` template part
- Added 60+ CSS rules for directory + profile
- Added dynamic SEO titles for lawyer pages
- Dense footer: 20 practice area links + 12 city links

## [1.0.0] — 2026-05-08

### Theme
- Initial rebuild: 47 files, premium Hebrew legal portal
- RTL design system with CSS custom properties
- Homepage: hero, practice areas grid, latest articles, topic clusters, trust section, CTA
- Article templates: archive, single, cards
- Practice area taxonomy template
- SEO meta tags, schema.org markup, breadcrumbs
- Accessibility features
- WhatsApp floating button
