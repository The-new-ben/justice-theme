# Lawyer Acquisition First Wave
Date: 2026-05-20
Status: READY FOR OWNER / OUTREACH PREP

## Business Goal

Get the first paying lawyers into Jus-Tice before the full automated recurring-payment system is finished.

Meshulam/Grow KYC is still the blocker for automated recurring card payments. Until that is approved, the practical money path is:

1. sell the value clearly;
2. collect lawyer interest through the site;
3. close manually with invoice/payment link if needed;
4. move them into automated billing once Meshulam is approved.

## Research Finding

Current legal marketing patterns in 2026 point to the same conclusion:

- lawyers care about qualified leads, not traffic vanity metrics;
- Google Business Profile, fresh reviews and local SEO are still major lead channels;
- review velocity and reputation proof matter heavily;
- directories win when they give lawyers a visible authority profile, not just a name listing;
- high-performing systems connect SEO, reviews, lead intake, follow-up and measurement.

For Jus-Tice, the pitch should not be "buy a listing." The pitch should be:

> We build your legal authority profile, connect it to guides and legal demand, and show you measurable exposure and qualified lead opportunities.

## First-Wave Target Lawyers

Start with lawyers where Jus-Tice can create visible value fast:

- family law;
- criminal defense;
- traffic law;
- real estate;
- inheritance/wills;
- personal injury/medical malpractice.

Avoid very rare niches in wave 1 unless demand already arrives by phone, because we need fast proof and clean matching.

## Offer To Use Before Meshulam Is Approved

Use "manual activation" language:

- no long-term promise before payment automation is finished;
- no guaranteed cases;
- no "best lawyer" claims;
- no pay-per-lead model that creates Bar-rule risk;
- subscription plan chosen now, invoice/manual payment path if the lawyer wants to start before Meshulam approval.

Suggested first close:

- 14-day setup sprint;
- profile + authority checklist;
- connected practice/city/category placement where relevant;
- first monthly exposure/lead report;
- manual invoice for the chosen tier if they approve.

## What To Show The Lawyer

Each outreach should include only concrete, visible value:

- public lawyer profile/mini-site example;
- plan page with prices;
- dashboard direction: profile completeness, leads, views, review freshness, content assets;
- the legal-library direction: articles/verdicts can support lawyer authority;
- compliance note: sponsored placements are marked clearly and no outcomes are guaranteed.

## First 20 Prospect List Structure

Do not store private personal data in this repo. Use this only as the structure for the owner/private CRM:

- lawyer name;
- practice area;
- city;
- email/phone source;
- current Google review count;
- latest review date;
- has website: yes/no;
- has strong profile photo: yes/no;
- likely pain point;
- plan fit: Pro / Featured / Lead Partner / Full Service;
- outreach status;
- next follow-up date;
- owner notes.

## Private List Validation - 2026-05-22

VERIFIED LOCAL:
- `tools/validate-lawyer-prospect-private-list.ps1` validates the first-wave CSV structure and allowed values.
- `project-control/lawyer-prospect-private-list-validator-2026-05-22.md` explains the owner workflow.
- Template validation passed with `20` rows, `0` errors and `0` warnings.

OWNER ACTION:
- Copy `project-control/lawyer-acquisition-first-wave-template-2026-05-20.csv` outside Git.
- Fill the real first 20 prospects privately.
- Run the validator against the private file.
- Enter only validated reachable prospects into WordPress admin manually.

BLOCKED:
- Do not commit a filled prospect list.
- Do not store private lawyer names, phones, emails or contact-source notes in this repo.
- Do not send outreach before owner approval.

## Outreach Message Angle

Keep it simple:

> I am opening a small first group of Israeli lawyers on Jus-Tice. The goal is not just another listing. We build a practical authority profile, connect it to legal guides and user demand, and give a monthly visibility/lead report. I think your practice area fits the first wave. If you want, I can show you the profile and plan options.

Do not promise leads until a matching supply/demand route exists for that practice area.

## Completion Assessment

- Lawyer acquisition strategy clarity: 65%.
- First-wave positioning: 70%.
- Actual outreach sent: 0%.
- Paying lawyers closed: 0%.
- Payment automation: blocked by Meshulam/Grow identity and bank approval.
- Revenue impact today: no money earned, but this creates the first sales track that can run before recurring payments are fully automated.

## Next Action

Create the private first-20 prospect list outside the repo, validate it with `tools/validate-lawyer-prospect-private-list.ps1`, then manually enter reachable prospects in WordPress admin. Start with family, criminal, traffic and real estate lawyers. Use manual activation until Meshulam approval is complete.

## 2026-05-22 Google Business Ecosystem Addendum

Evidence:
- `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.md`.
- `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.csv`.

VERIFIED PLANNING:
- First-wave prospect qualification should include public Google Business / Google Maps presence where available.
- The private first-20 list should keep Google review count, latest review date, GBP URL, website URL, service area and likely reputation gap as owner-private data.
- Do not commit filled prospect lists or account screenshots to Git.

Sales positioning update:
- Offer a practical authority and reputation setup path: profile, content links, GBP/review-link readiness, lead tracking and first monthly value report.
- Do not sell guaranteed rankings, guaranteed leads, fake reviews or pay-for-review activity.

BLOCKED:
- No outreach, prospect record, lawyer profile edit, Google account action, review request sending, payment action or CRM change is approved by this addendum.

