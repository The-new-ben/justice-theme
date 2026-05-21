# Lawyer Plans Sales System - 2026-05-21

## Why This Matters
- Goal: make `/lawyer-plans/` feel like a measurable client-acquisition product, not only a price list.
- Money path: a lawyer must understand what they receive before they leave details or approve manual invoicing.
- This supports lawyer subscriptions while Grow/Meshulam recurring billing approval is still pending.

## Research Input
- Justia sells its lawyer directory around enhanced profile visibility, contact options, and traffic/reporting value.
- FindLaw positions lawyer marketing as visibility plus measurable lead generation, not just a static listing.
- Practical takeaway: Jus-Tice should show the operating system behind the plan: rich mini-site, measured inquiries, monthly value reporting, and compliant disclosure.

Sources:
- https://www.justia.com/marketing/lawyer-directory/
- https://www.findlaw.com/lawyer-marketing/

## What Changed
- Added a new public section to `/lawyer-plans/`: "what the lawyer receives in practice".
- The section explains:
  - rich mini-site/profile
  - measurable leads
  - monthly value report
  - compliant disclosure and no fake ranking
- Added CTAs to the lead-partner fit check and the plan comparison section.
- Added responsive CSS so the section works on desktop and mobile.

## Verification
- `php -l page-lawyer-plans.php` passed.
- `git diff --check` passed, with only the existing Windows line-ending warning.

## Completion Assessment
- Materially advanced: the public lawyer sales page now communicates product value more clearly before asking for signup.
- Still blocked: Grow/Meshulam final approval, payment products, actual outreach, first lawyer signup, first paid subscription.
- Lawyer plan conversion readiness: 64% -> 70%.
- First paid-lawyer readiness: 89% -> 90%.
- Owner-visible after deploy: `/lawyer-plans/`, above the plan cards.

## Safety
- Repo theme code/docs only.
- No public CMS database page edited.
- No payment setting changed.
- No product, lawyer, lead or order record created.
- No outreach sent.
- No 301 redirect package touched.
