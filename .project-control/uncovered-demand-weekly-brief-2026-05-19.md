# Uncovered Demand Weekly Brief - 2026-05-19

Status: BRANCH IMPLEMENTED  
Related: Linear HAD-64

## Objective

Turn the uncovered-demand summary into a copy-ready weekly partner-recruitment brief, so the owner can contact lawyers faster and with demand evidence.

## Research Used

- Current law-firm intake/marketing reporting guidance emphasizes measuring leads by practice area, location/source, and conversion stage so growth decisions are based on business outcomes, not impressions alone.
- Lead-management guidance also emphasizes one owner, quick follow-up, and a single source of truth for intake data.

## Code Change

Updated `inc/lead-crm.php`:

- Added `justice_theme_crm_render_uncovered_recruitment_brief()`.
- The Uncovered Demand Queue now generates a copy-ready weekly brief from the top five uncovered demand signals.
- The brief includes:
  - demand signal;
  - lead count;
  - urgent/manual count;
  - latest activity date;
  - suggested action;
  - compliance reminders.

## Owner-Visible After Merge

After PR merge and uPress pull:

`wp-admin -> Justice CRM -> Uncovered demand queue -> Weekly recruitment brief`

The owner can copy the brief into a weekly sales workflow or send it to a team member who recruits lawyers.

## Completion Assessment

Lead monetization/intake moved from **38% to 40%** because the branch now supports the full uncovered-demand loop: classify, summarize, respond, and produce partner-recruitment evidence. It is not revenue-producing until deployed and used for actual outreach.

## Remaining Blockers

- No live deployment yet.
- No automated weekly email yet.
- No outreach ownership/CRM stage for recruited lawyers yet.
- No paying lawyer recruited yet from this flow.

## Verification

- PHP lint passed for `inc/lead-crm.php`, `functions.php`, `inc/lead-routing.php`, and `inc/lead-classifier.php`.
- `git diff --check` is clean except expected Windows line-ending warnings.
- First live journey checker attempt hit a full-network fetch failure across all URLs; retry passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index, and robots.txt.

## Safety

Branch code and docs only. No live lead record, lawyer profile, user, payment, public CMS content, GA4/GSC setting, public URL, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.
