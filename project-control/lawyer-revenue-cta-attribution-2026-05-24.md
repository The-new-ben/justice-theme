# Lawyer Revenue CTA Attribution - 2026-05-24

## Goal

Make the lawyer acquisition path measurable from the public site. The header already exposes lawyer plans and lawyer login, but clicks needed clear analytics attribution so we can see whether lawyers are entering the money path.

## Change

- Added UTM attribution to the two header lawyer actions:
  - Lawyer plans: `utm_source=site_header`, `utm_medium=lawyer_cta`, `utm_campaign=lawyer_acquisition`
  - Lawyer dashboard/login: `utm_source=site_header`, `utm_medium=lawyer_login`, `utm_campaign=lawyer_retention`
- Added a `lawyer_revenue_click` analytics event for links to:
  - `/lawyer-plans/`
  - `/lawyer-registration/`
  - `/lawyer-dashboard/`
- The event records destination, surface, plan interest, payment path, outreach segment, and UTM values when present.
- Bumped the analytics script version to force the updated tracking file to load.

## Safety

- No public CMS/database content changed.
- No redirects, canonicals, noindex, sitemap, taxonomy, or payment behavior changed.
- Existing lawyer CTA text and layout stayed the same.

## Verification

- PHP syntax checks passed for `template-parts/layout/site-header.php` and `inc/enqueue.php`.
- JavaScript syntax check passed for `assets/js/analytics-events.js`.

