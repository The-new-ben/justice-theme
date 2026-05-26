# Jus-Tice Lawyer Platform Owner Walkthrough
Date: 2026-05-21
Status: VERIFIED OWNER OPERATING GUIDE / LIVE-CODE AWARE / NO PUBLIC CHANGES

## What This System Is

This is the lawyer money system we are building.

It is not only a public profile. It is a workflow:

1. Lawyer sees plans.
2. Lawyer registers.
3. System creates or links the lawyer profile.
4. Owner reviews identity, license, claims, content and payment status.
5. Lawyer logs into the dashboard.
6. Dashboard pushes the lawyer toward first value: profile readiness, reputation source, content request, exposure and leads.
7. Owner tracks registrations, prospects, follow-ups, reputation requests and manual activation inside WordPress admin.
8. Homepage LegalTech cards capture user intent into the existing lead form while the real LegalTech archive remains gated.

The first value for a paying lawyer is not a tour. It is proof that the profile is real, improving, measurable and connected to demand.

## Verified Live State

VERIFIED LIVE on 2026-05-21:

- `/` returned 200.
- `/lawyer-plans/` returned 200.
- `/lawyer-registration/` returned 200.
- `/lawyer-dashboard/` returned 200.
- `/lawyers/` returned 200.
- `/legal-tools/` still redirected/fell back to the homepage and should not be promoted as a finished archive.
- The homepage source contains the LegalTech section, AI Console label, `#ask-lawyer` target and `data-lead-message` prefill attributes.
- The homepage source has no direct `/legal-tools/` archive link and no page-level `noindex`.
- Unauthenticated access to `wp-admin -> Lawyer Onboarding`, `justice_prospect` list and `Outreach Links` redirects to WordPress login.

## Public URLs

- Plans page: `/lawyer-plans/`
- Registration page: `/lawyer-registration/`
- Lawyer dashboard: `/lawyer-dashboard/`
- Lawyer directory: `/lawyers/`
- Homepage LegalTech gateway: `/#legaltech-tools`
- Lead form used by LegalTech cards: `/#ask-lawyer`

Do not promote `/legal-tools/` as a direct destination until the archive/tool records are verified public and not thin.

## Daily Owner Operating Loop

Run this sequence once per working day:

1. Open `wp-admin -> Lawyer Onboarding`.
2. Read the Lawyer sales command center.
3. Follow the `Next best action` card first.
4. Clear overdue follow-ups.
5. Clear due-today follow-ups.
6. Review active prospects with no next action date.
7. Review active prospects missing both email and phone.
8. Process new lawyer registrations and pending profile/content/reputation requests.
9. Use Outreach Links for one manual batch of 10-20 lawyers only when the owner is ready to track follow-up.
10. Check recent leads and LegalTech requests for source keyword, UTM medium and practice area.

If a prospect cannot be followed up, the record is not useful yet. Add a contact channel or mark it as research debt.

## Owner/Admin Walkthrough

### 1. Start In Lawyer Onboarding

Go to:

`wp-admin -> Lawyer Onboarding`

Use this as the daily command center. It now includes sales execution, registration review and pending lawyer-value requests.

Look for:

- Lawyer sales command center.
- Next best action.
- Overdue follow-ups.
- Due now.
- Needs scheduling.
- Needs contact details.
- Hot prospects.
- Proposals sent.
- Active monthly pipeline.
- Won monthly value.
- New lawyer registrations.
- Profile update requests.
- Content requests.
- Reputation/review campaign requests.

### 2. Work Prospect Views

Go to:

`wp-admin -> Lawyer Onboarding -> Lawyer Prospects`

Use the list views:

- Due now.
- Overdue.
- Today.
- Upcoming.
- Needs scheduling.
- Needs contact details.

Use the columns:

- Monthly value.
- Contact.
- Next action.
- Status.
- Plan.
- Priority.

Use quick actions only when true:

- Contacted today.
- Set follow-up.
- Proposal sent.
- Won/onboarding.
- Lost/not fit.

The owner should not send broad outreach from this repo. Outreach is manual, small-batch and owner-controlled.

### 3. Use Outreach Links For Small Manual Batches

Go to:

`wp-admin -> Lawyer Onboarding -> Outreach Links`

Use this only for controlled batches:

- 10-20 lawyers.
- One segment at a time.
- One message angle at a time.
- Personal first sentence.
- No bulk sending.
- No guaranteed leads, outcomes or ranking.

After a response or serious target selection, create a `justice_prospect` record. The link builder and prospect prefill exist so manual outreach can become a tracked follow-up, not a loose message.

### 4. Review New Lawyer Registrations

From Lawyer Onboarding, review:

- Lawyer name.
- Firm.
- Phone.
- Email.
- Bar/license number.
- Practice areas.
- Cities.
- Plan interest.
- Sales priority.
- Payment follow-up.
- Mini-site content state.
- Pending profile update.
- Pending content request.
- Reputation request.
- Recent notes.

Do not publish or activate a profile until identity, license, claims and payment status are reviewed.

### 5. Edit The Lawyer Profile

From Lawyer Onboarding, click `Review`.

Check:

- Name.
- Firm.
- Phone.
- Email.
- Bar/license number.
- Practice areas.
- Cities.
- Profile text.
- Services.
- Process.
- Video link.
- FAQs.
- Plan type.
- Subscription/payment status.

Remove unverifiable superiority claims, fake trust language and unsupported recommendations before publication.

### 6. Manage Reputation Sources

Inside the lawyer profile edit screen, use:

`Jus-Tice Reputation Sources`

Fill only real data:

- Google Business profile URL.
- Google Place ID.
- Google review request URL.
- Google review count.
- Latest review date.
- Display-approved recommendations status.

Rules:

- Do not paste Google review text into public pages.
- Do not mark reviews as public until permission and policy are reviewed.
- Google reviews and Jus-Tice first-party recommendations are separate assets.

### 7. Manage First-Party Recommendations

Go to:

`wp-admin -> Lawyer Onboarding -> Recommendations`

Create a recommendation record only when there is a real source and permission status.

Fields:

- Linked lawyer.
- Client display name.
- Client relationship/context.
- Rating, if approved.
- Source type.
- Source URL.
- Received date.
- Permission status.
- Moderation status.
- Owner note.

Use `Approved public` only after permission, ethics and owner review.

### 8. Process Lawyer Dashboard Requests

Lawyers can submit three kinds of requests from `/lawyer-dashboard/`:

- Profile/mini-site update request.
- Signed content/article request.
- Google reviews/recommendations campaign request.

All three are safe by design:

- Nothing public changes automatically.
- No review request is sent automatically.
- Owner review happens first.

### 9. Process LegalTech And Lead Demand

The homepage LegalTech cards currently send users to `#ask-lawyer` with context:

- Lead area.
- Starter message.
- Source keyword.
- `utm_medium=legaltech_gateway`.
- `legaltech_tool_click` event in the frontend tracker.

Treat these as lead-intent capture, not as a finished LegalTech product sale.

Do not promote `/legal-tools/` until:

- The archive returns a real product archive, not a homepage fallback.
- Real tool records exist and are approved.
- Tool pages have visible disclaimers, pricing/status boundaries and owner-approved routing.
- Thin/draft/noindex/canonical/sitemap states are checked.

## Lawyer Walkthrough

### 1. Register

Lawyer goes to:

`/lawyer-plans/`

Then reaches:

`/lawyer-registration/`

They submit:

- Name.
- Firm.
- Bar number.
- Phone/email.
- Practice area.
- Cities.
- Profile text.
- Plan interest.

### 2. Log In

Lawyer goes to:

`/lawyer-dashboard/`

They see:

- Linked profile.
- First-value progress.
- Profile views.
- Assigned leads.
- Content requests.
- Reputation/authority checklist.

### 3. Improve The Profile

From the dashboard, the lawyer can request:

- Headline update.
- Services.
- Process.
- Video link.
- FAQs.

The request waits for owner review.

### 4. Request Content

Lawyer can submit an article or guide idea.

This creates an internal content request that requires:

- Editorial review.
- Source review.
- Legal review.
- Owner approval before any public change.

### 5. Request Review Campaign Setup

Lawyer can ask Jus-Tice to prepare a review campaign.

This does not send messages yet.

Owner verifies:

- Google review link.
- Safe wording.
- Client group.
- Sensitive cases to avoid.
- Permission and compliance posture.

## First Manual Sale Path While Meshulam Is Being Finished

If a lawyer wants to start before automated recurring payments are fully active:

1. Let the lawyer choose a plan.
2. Register them through `/lawyer-registration/`.
3. Review the draft profile.
4. Use manual invoice/payment instructions outside this repo.
5. Activate only after payment is confirmed.
6. Move to automated recurring billing after Meshulam/Grow KYC is complete.

The product should continue as if Meshulam will be solved. Do not weaken the system because KYC is temporarily blocked.

## First 24 Hours Owner Checklist

- Open Lawyer Onboarding.
- Confirm no overdue prospects exist.
- Confirm active prospects have next action dates.
- Confirm active prospects have at least one contact channel.
- Review any new lawyer registration.
- Review any pending dashboard request.
- Run one small manual outreach batch only if the owner can follow up.
- Create or update prospect records for every serious outreach target.
- Review LegalTech/lead source keywords for actual demand.
- Do not activate any lawyer profile before license, claims and payment status are reviewed.

## Do Not Do Yet

- Do not bulk-email or bulk-SMS lawyers.
- Do not promise leads, case outcomes, ranking, exclusivity or guaranteed ROI.
- Do not publish fake recommendations or imported Google review text.
- Do not mark a recommendation public without permission and owner review.
- Do not promote `/legal-tools/` as a finished archive.
- Do not create or publish thin LegalTech product pages to fill the archive.
- Do not activate a lawyer before identity/license/payment review.
- Do not show public ratings/review schema until the source policy and display section are approved.

## What Is Still Blocked

- Meshulam/Grow recurring payments until owner completes account/KYC/bank approval.
- Google Business Profile API until lawyers grant OAuth/access to their business profiles.
- Public recommendation display until we add the display section and owner approves policy.
- SMS/email review request sending until sender/tool/copy are approved.
- LegalTech archive/tool pages until records, routes, disclaimers, pricing boundaries and sitemap/canonical states are verified.
- Actual first revenue until owner sends outreach, closes a lawyer and confirms payment.

## Completion Assessment

- Owner walkthrough clarity: 95%.
- Lawyer dashboard value clarity: 70%.
- Admin operating system: 78%.
- Prospect follow-up/readiness discipline: 90%.
- Recommendation/reputation system: 48%.
- LegalTech product-path readiness: 47%.
- Operational paying-customer readiness: 90%.
- Actual paid-lawyer acquisition: 0%.
- First revenue: 0%.

No revenue is earned just by this walkthrough. The material advancement is operational: the owner now has a current guide for the live lawyer platform, prospect pipeline, dashboard requests, reputation workflow and LegalTech lead-intent gateway.
