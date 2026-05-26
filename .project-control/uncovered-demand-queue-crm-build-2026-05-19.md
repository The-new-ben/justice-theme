# Uncovered Demand Queue CRM Build - 2026-05-19

Status: BRANCH IMPLEMENTED  
Related: `project-control/uncovered-demand-lead-monetization-2026-05-19.md`, Linear HAD-64

## Objective

Turn unmatched legal requests into structured demand evidence inside the owner CRM, instead of leaving them as free manual calls.

## Research Used

- Current legal intake guidance consistently emphasizes speed-to-lead and structured qualification as core conversion levers.
- Legal lead-generation ethics research warns against hidden recommendations, fee-splitting, and misleading referral models.
- Business implication: capture and classify every request first; monetize repeated uncovered demand through transparent lawyer subscription/coverage, not through unsafe referral promises.

## Code Change

Updated `inc/lead-crm.php`:

- Registered a new lead meta field: `coverage_status`.
- Added CRM coverage labels:
  - `coverage_review`
  - `covered_routable`
  - `covered_nonpaying`
  - `uncovered_recruit`
  - `unsupported`
  - `urgent_manual`
- Added a coverage-status select to the lead disposition meta box.
- Added a Coverage column to CRM lead tables.
- Added an "Uncovered demand queue" section to the Justice CRM admin page.
- Added coverage summary cards so the owner can see how many leads require coverage/recruitment action.

## Owner-Visible After Merge

After PR merge and uPress pull, the owner can check:

`wp-admin -> Justice CRM`

Expected visible changes:

- New "Uncovered demand queue" section.
- New coverage-status cards.
- New Coverage column in lead tables.
- New Coverage status dropdown inside each `justice_lead` edit screen.

## Completion Assessment

Lead monetization/intake moved from **30% to 34%** because the queue is now partly implemented in code. It is not live and not revenue-producing until merged, deployed, and used on real leads.

## Remaining Blockers

- No live deployment yet because this is still draft PR work.
- No automated no-match response template yet.
- No lawyer recruitment report/email yet.
- No AI classifier mapping uncovered practice/jurisdiction yet.
- No commercial plan rule that turns repeated uncovered demand into a paid category slot yet.

## Verification

- `php -l inc/lead-crm.php` passed.
- PHP lint also passed for `functions.php`, `inc/lead-routing.php`, and `inc/lead-classifier.php`.
- `git diff --check` is clean except expected Windows line-ending warnings.
- Live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index, and robots.txt.

## Safety

Branch code only. No live lead records, lawyer profiles, users, payments, CMS content, GSC/GA4 settings, public URLs, sitemap settings, uPress deployment, social account, Google Business Profile, lawyer contact, or client charge changed.
