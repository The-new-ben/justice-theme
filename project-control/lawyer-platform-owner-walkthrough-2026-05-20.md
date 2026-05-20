# Jus-Tice Lawyer Platform Walkthrough
Date: 2026-05-20
Status: OWNER WALKTHROUGH / PR #26

## What This System Is

This is the lawyer money system we are building.

It is not only a public profile. It is a workflow:

1. Lawyer sees plans.
2. Lawyer registers.
3. System creates or links the lawyer profile.
4. Owner reviews identity, license, content and payment status.
5. Lawyer logs into the dashboard.
6. Dashboard pushes the lawyer toward first value:
   - profile ready;
   - reputation source;
   - content request;
   - exposure;
   - leads.
7. Owner can track the lawyer in the admin queue.

Research point: good SaaS onboarding does not start with a huge tour. It pushes the customer to one clear first value. For Jus-Tice, first value is: "my profile is real, improving, visible, and starting to generate proof."

## Public URLs

- Plans page: `/lawyer-plans/`
- Registration page: `/lawyer-registration/`
- Lawyer dashboard: `/lawyer-dashboard/`
- Lawyer directory: `/lawyers/`

## Owner/Admin Walkthrough

### 1. Review New Lawyer Registrations

Go to:

`wp-admin -> Lawyer Onboarding`

You will see:

- lawyer name;
- firm;
- phone;
- email;
- plan interest;
- sales priority;
- payment follow-up;
- mini-site content state;
- pending profile update;
- pending content request;
- reputation request;
- recent notes.

Use this screen as the daily command center.

### 2. Edit The Lawyer Profile

From Lawyer Onboarding, click `Review`.

Check:

- name;
- firm;
- phone;
- email;
- Bar/license number;
- practice areas;
- cities;
- profile text;
- services;
- process;
- video link;
- FAQs;
- plan type;
- subscription/payment status.

Do not publish the profile until identity, license and claims are reviewed.

### 3. Add Google Review Source Fields

Inside the lawyer profile edit screen, use the box:

`Jus-Tice Reputation Sources`

Fill what you have:

- Google Business profile URL;
- Google Place ID;
- Google review request URL;
- Google review count;
- latest review date;
- display-approved recommendations status.

Important:

- Do not paste Google review text into public pages.
- Do not mark reviews as public until permission/policy is reviewed.
- Google reviews and Jus-Tice recommendations are separate things.

### 4. Manage First-Party Recommendations

Go to:

`wp-admin -> Lawyer Onboarding -> Recommendations`

Create a recommendation record only when you have a real source and permission status.

Fields:

- linked lawyer;
- client display name;
- client relationship/context;
- rating, if approved;
- source type;
- source URL;
- received date;
- permission status;
- moderation status;
- owner note.

Use `Approved public` only after permission, ethics and owner review.

### 5. Process Lawyer Dashboard Requests

Lawyers can submit three kinds of requests from `/lawyer-dashboard/`:

- profile/mini-site update request;
- signed content/article request;
- Google reviews / recommendations campaign request.

All three are safe by design:

- nothing public changes automatically;
- no review request is sent automatically;
- owner reviews first.

### 6. First Manual Sale Path While Meshulam Is Being Finished

If a lawyer wants to start before automated recurring payments are fully active:

1. Let the lawyer choose a plan.
2. Register them through `/lawyer-registration/`.
3. Review the draft profile.
4. Use manual invoice/payment instructions.
5. Activate only after payment is confirmed.
6. Move to automated recurring billing after Meshulam/Grow KYC is complete.

The product should continue as if Meshulam will be solved. Do not weaken the system because KYC is temporarily blocked.

## Lawyer Walkthrough

### 1. Register

Lawyer goes to:

`/lawyer-plans/`

Then chooses a plan and reaches:

`/lawyer-registration/`

They submit:

- name;
- firm;
- Bar number;
- phone/email;
- practice area;
- cities;
- profile text;
- plan interest.

### 2. Log In

Lawyer goes to:

`/lawyer-dashboard/`

They see:

- linked profile;
- first-value progress;
- profile views;
- assigned leads;
- content requests;
- reputation/authority checklist.

### 3. Improve The Profile

From the dashboard, lawyer can request:

- headline update;
- services;
- process;
- video link;
- FAQs.

The request waits for owner review.

### 4. Request Content

Lawyer can submit an article/guide idea.

This creates a draft-only content request that requires:

- editorial review;
- source review;
- legal review.

### 5. Request Review Campaign Setup

Lawyer can ask Jus-Tice to prepare a review campaign.

This does not send messages yet.

Owner verifies:

- Google review link;
- safe wording;
- client group;
- sensitive cases to avoid.

## What The Owner Can Notice After Merge And Deploy

On `/lawyer-dashboard/`:

- new reputation/authority cockpit;
- growth asset score;
- review campaign request form.

In wp-admin:

- `Lawyer Onboarding` has reputation request visibility;
- lawyer profile edit page has Google review source fields;
- `Recommendations` appears under Lawyer Onboarding.

## What Is Still Blocked

- Meshulam/Grow recurring payments until owner completes account/KYC/bank approval.
- Google Business Profile API until lawyers grant OAuth/access to their business profiles.
- Public recommendation display until we add the display section and owner approves policy.
- SMS/email review request sending until sender/tool/copy are approved.

## Completion Assessment

- Owner walkthrough clarity: 80%.
- Lawyer dashboard value clarity: 60%.
- Admin operating system: 55%.
- Recommendation/reputation system: 48%.
- Paying customer readiness: 45%.

No revenue is earned just by this walkthrough. The material advancement is operational: the owner can now understand where to operate the system and what will become visible after PR #26 is merged/deployed.

