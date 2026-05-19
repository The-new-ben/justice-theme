# Uncovered Demand Response Templates - 2026-05-19

Status: BRANCH IMPLEMENTED  
Related: Linear HAD-64

## Objective

Give the owner a safe, repeatable response when a user asks for a lawyer in a category where Jus-Tice has no verified/paid coverage yet.

## Research Used

- Lawyer advertising/lead-generation guidance repeatedly warns against misleading recommendations, fee-splitting, and unsupported superiority or referral claims.
- Legal intake guidance warns that prospective users may assume intake creates representation; safe intake messaging should clarify that it is not legal advice and does not create an attorney-client relationship.
- Speed-to-lead guidance supports having ready response templates so the user is not left waiting while the owner improvises.

## Code Change

Updated `inc/lead-crm.php`:

- Added `justice_theme_crm_render_uncovered_response_templates()`.
- Added a visible CRM panel below the Uncovered Demand Queue.
- Added a neutral user no-match response template.
- Added a lawyer recruitment script for uncovered demand categories.

## Owner-Visible After Merge

After PR merge and uPress pull:

`wp-admin -> Justice CRM -> Uncovered demand queue`

The owner should see:

- user no-match response template;
- lawyer recruitment script;
- safety reminder: no recommendation, no legal advice, no outcome promise.

## Completion Assessment

Lead monetization/intake moved from **34% to 36%** because the system now helps capture, classify, and respond to uncovered demand without inventing a risky referral model. It is still not revenue-producing until merged/deployed and paired with active partner outreach.

## Remaining Blockers

- No live deployment yet.
- No automated email/WhatsApp send action yet.
- No weekly uncovered-category report yet.
- No AI classifier for jurisdiction/practice coverage yet.
- No paying partner recruited from uncovered demand yet.

## Verification

- PHP lint passed for `inc/lead-crm.php`, `functions.php`, `inc/lead-routing.php`, and `inc/lead-classifier.php`.
- `git diff --check` is clean except expected Windows line-ending warnings.
- Live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index, and robots.txt.

## Safety

Branch code and docs only. No live lead record, lawyer profile, user, payment, public CMS content, GA4/GSC setting, public URL, uPress deployment, social account, Google Business Profile, lawyer contact, or client charge changed.
