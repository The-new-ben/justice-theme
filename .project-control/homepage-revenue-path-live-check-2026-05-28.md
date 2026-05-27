# Homepage Revenue Path Live Check

Date: 2026-05-28
Status: live route/CTA smoke test passed; mobile-menu deployment still blocked.

## Why This Exists

The owner asked for visible progress toward leads, lawyers, and money. This checker verifies that the homepage and core lawyer-conversion routes are reachable before and after homepage/header/footer changes.

Reusable script:

`C:\Users\janana\jutice-theme\.project-control\scripts\check-homepage-revenue-paths.ps1`

## Live Check Result

Command:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .project-control\scripts\check-homepage-revenue-paths.ps1
```

Result: `PASS`

Checked at: `2026-05-27T21:27:29.7568864Z`

| Route | Status | Required Signal |
|---|---:|---|
| Homepage public lead surface | 200 | theme marker, `ask-lawyer`, homepage WhatsApp, mobile-menu WhatsApp, lawyer registration, lawyer plans |
| Lawyers directory | 200 | theme marker |
| Lawyer registration | 200 | theme marker, `justice_lawyer_registration` |
| Lawyer plans | 200 | theme marker |
| About trust route | 200 | theme marker |
| Contact route | 200 | theme marker |

## What This Proves

- Public lead entry is reachable.
- WhatsApp surfaces exist on homepage/mobile menu HTML.
- Lawyer registration and lawyer plans routes are live and reachable.
- About and Contact trust routes are live.
- This can be rerun after every homepage/header/footer deployment.

## What This Does Not Prove

- It does not prove a real lead was created.
- It does not prove CRM routing works end to end.
- It does not prove payment, invoice, Grow/Meshulam, or WooCommerce readiness.
- It does not prove the new mobile-menu stability fix is deployed.
- It does not verify Lighthouse, visual layout, or mobile tap behavior.

## Current Deployment Blocker

The pushed mobile-menu fix is still not live. Live deployment marker check still returns:

- New marker `2026-05-27-mobile-menu-stable-toggle-v1`: `false`
- New version `1.1.67`: `false`
- Old marker `2026-05-27-footer-trust-path-v1`: `true`

Required action remains: uPress Pull Git for `wp-content/themes/justice-theme`, then rerun marker and mobile QA.

## Readiness Impact

Readiness to profit remains approximately `68%`: the public routes exist and are measurable, but the site still lacks verified payment/invoice execution, verified paid lawyer conversion, and live deployment of the mobile-menu fix.

## Honesty Statement

This was a live route and CTA smoke test plus a reusable checker. It did not publish content, change CMS/database records, create leads, contact clients/lawyers, change redirects/canonicals/noindex/sitemaps/taxonomies, or charge money.
