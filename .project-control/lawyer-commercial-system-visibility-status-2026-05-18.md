# Lawyer Commercial System Visibility Status - 2026-05-18

Status: LIVE VISIBILITY / OWNER UPDATE / NO PUBLIC CMS OR DATABASE CHANGES

## Purpose

Answer the owner's question: what really exists for lawyer registration, private zone, account, payments, leads, insights and ongoing value, and where can it be seen.

## Research Basis

Current legal intake and client portal guidance emphasizes a short path from interest to value:
- structured intake form;
- immediate CRM record and follow-up workflow;
- booking/payment path where ethically and commercially approved;
- private portal or dashboard;
- monthly reporting around leads, response speed, visibility and next actions.

Sources reviewed this cycle:
- Clio client intake best practices, updated 2026: `https://www.clio.com/blog/client-intake-law-firms/`
- Current legal intake automation research results emphasizing fast response, CRM workflow triggers and follow-up automation.

Applied conclusion for Jus-Tice:
- A public registration page is not enough. The system must make first value visible to the owner and the lawyer: profile readiness, assigned leads, response SLA, profile views, content work, and a monthly value snapshot.

## Live Public URLs

| Area | URL | Live status | What the owner can spot |
| --- | --- | --- | --- |
| Lawyer registration | `https://jus-tice.co.il/lawyer-registration/` | HTTP 200, public form present | A lawyer can submit plan interest, contact details, profile content, practice area and consent |
| Plan interest registration | `https://jus-tice.co.il/lawyer-registration/?plan_interest=pro` | HTTP 200, public form present | The pro plan intent path is reachable |
| Lawyer plans | `https://jus-tice.co.il/lawyer-plans/` | HTTP 200 | Public plan page exists, but checkout is not live |
| Lawyer dashboard | `https://jus-tice.co.il/lawyer-dashboard/` | HTTP 200 | Logged-out visitors see the gated entry/login state; real dashboard needs a linked lawyer account |
| Lawyer directory | `https://jus-tice.co.il/lawyers/` | HTTP 200 | Public lawyer directory is reachable |

## What Exists

- Public lawyer registration handler creates a draft `justice_lawyer` profile.
- New registrations preserve selected plan interest.
- New registrations start as pending: subscription, verification, profile and activation.
- Owner-side lawyer onboarding admin exists.
- Owner-only lawyer activation fields exist: activation status, first value date and owner/customer-success note.
- Lawyer dashboard exists for logged-in, linked lawyers.
- Dashboard can show profile views, linked profiles, assigned leads and content requests.
- Lawyer can submit mini-site/profile update requests from the dashboard.
- Lawyer can request signed article/content work from the dashboard.
- Justice CRM exists in wp-admin.
- CRM shows lead quality, response/follow-up signals and lead status information.
- Lead routing exists, but it only routes when a matching lawyer has routing enabled.
- Monthly lawyer value report spec exists.
- Time-to-first-value activation plan exists.

## What Is Not Yet Fully Live

- Automatic payment collection is not active.
- Recurring subscription billing is not active.
- WooCommerce product IDs/payment provider mapping is not confirmed live.
- Tax invoice, refund and renewal automation is not active.
- Qualified-lead billing rules are not finalized.
- Lawyer self-service account creation/login linking is not complete as a public frictionless journey.
- Lawyer-facing monthly value report is specified but not implemented as a finished report.
- GA4/GTM receipt for all commercial events still needs verification.
- GSC/GA4 lawyer-level insights are not yet automatically mapped into the dashboard.

## Why The Owner Does Not See A Big Change

Most completed pieces are owner/admin/private-zone infrastructure. The public visitor mainly sees three simple pages: registration, plans and dashboard login. The revenue engine needs the next layer: visible activation status, clear payment path, account linking and value reporting.

## This Cycle Live Verification

Read-only live checks passed:
- public user journey;
- lawyer registration journey;
- Googlebot sitemap/robots journey;
- lawyer registration URL;
- lawyer plans URL;
- lawyer dashboard URL;
- lawyer directory URL.

No test registration was submitted.
No lead record was created.
No payment setting was changed.
No public CMS/database content was changed.

## Next High-Impact Safe Work

1. Make the lawyer funnel visibly stronger on `/lawyer-plans/` and `/lawyer-registration/`.
2. Create a demo/owner-verifiable lawyer account journey so the private zone can be inspected end to end.
3. Add a lawyer dashboard first-value panel that explains profile status, leads, views, content work and next action.
4. Verify GA4/GTM events for plan clicks, registration starts, successful registration and lead form actions.
5. Only after owner approval, connect the chosen Israel-compatible payment provider and recurring billing model.

## Safety Statement

This document is a repo-only progress/status artifact. It does not alter public content, WordPress database rows, lawyer profiles, lead records, payment settings, GA4/GSC settings, sitemap settings, redirects, canonical tags, noindex rules or uPress deployment.
