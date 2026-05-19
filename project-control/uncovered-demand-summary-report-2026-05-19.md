# Uncovered Demand Summary Report - 2026-05-19

Status: BRANCH IMPLEMENTED  
Related: Linear HAD-64

## Objective

Help the owner decide which missing lawyer category to recruit next, based on real unmatched lead demand rather than memory or guesswork.

## Research Used

- Legal intake analytics guidance emphasizes tracking lead volume by practice area, source, response time, and conversion so marketing/recruiting spend can be adjusted intelligently.
- Law firm intake research also emphasizes speed and ownership. A queue alone is not enough; the owner needs a quick summary of demand patterns.

## Code Change

Updated `inc/lead-crm.php`:

- Added `justice_theme_crm_render_uncovered_demand_summary()`.
- Added `justice_theme_crm_uncovered_demand_summary()`.
- The Justice CRM Uncovered Demand Queue now shows a summary table before the raw lead list.
- The table groups recent uncovered leads by practice/market signal.
- It shows:
  - demand signal;
  - lead count;
  - urgent/manual count;
  - latest lead;
  - suggested business action.

## Owner-Visible After Merge

After PR merge and uPress pull:

`wp-admin -> Justice CRM -> Uncovered demand queue`

The owner should see a top-demand summary before the lead list. This should answer:

> "Which missing category should I recruit a paying lawyer for next?"

## Completion Assessment

Lead monetization/intake moved from **36% to 38%** because the CRM now has an internal partner-recruitment signal, not only raw lead storage. It is still not revenue-producing until deployed and used for actual outreach.

## Remaining Blockers

- No live deployment yet.
- No automated weekly email/report yet.
- No dedicated outreach workflow for lawyers yet.
- No AI coverage classifier yet.
- No paying lawyer recruited from a repeated uncovered category yet.

## Verification

- PHP lint passed for `inc/lead-crm.php`, `functions.php`, `inc/lead-routing.php`, and `inc/lead-classifier.php`.
- `git diff --check` is clean except expected Windows line-ending warnings.
- Live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index, and robots.txt.

## Safety

Branch code and docs only. No live lead record, lawyer profile, user, payment, public CMS content, GA4/GSC setting, public URL, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.
