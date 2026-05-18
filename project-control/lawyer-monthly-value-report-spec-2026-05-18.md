# Lawyer Monthly Value Report Spec - 2026-05-18

Status: SPEC V1 / REPO ONLY / NO LIVE REPORTING CHANGES

## Purpose

Create the recurring report that keeps lawyers paying for Jus-Tice because it shows concrete value:
- visibility generated;
- qualified demand captured;
- follow-up quality;
- content and profile work completed;
- search visibility movement;
- next recommended action.

The report must avoid fake ranking, fake reviews, fake "recommended lawyer" claims, undisclosed paid placement, or guaranteed legal/SEO outcomes.

## Current Research Basis

Current legal-marketing reporting patterns emphasize:
- monthly KPIs tied to leads, calls, form submissions, intake quality and collection/revenue, not vanity metrics alone;
- dashboard/report formats that combine traffic, keyword rankings, conversion events and source attribution;
- search visibility and ranking trends, but only as business context;
- fast follow-up and intake quality as the difference between generated demand and revenue;
- monthly report cadence with a concise executive summary and action list.

Sources reviewed:
- `https://lawfirmsites.com/law-firm-marketing-kpis-you-should-track-monthly/`
- `https://esquireinteractive.com/firmmetrics/`
- `https://inoriseo.com/law-firm-seo/law-firm-marketing-automation/`
- `https://legalseoconsultant.com/seo-metrics-law-firm/`
- `https://geeksforgrowth.com/law-firm-marketing-metrics/`

## Report Sections

### 1. Executive Snapshot

Audience: lawyer and owner.

Fields:
- report month;
- lawyer profile ID/name;
- plan type;
- subscription status;
- sales/customer-success status;
- one-sentence summary;
- one next recommended action.

Source:
- WordPress lawyer meta.
- Owner/customer-success note.

Current status:
- `plan_type` and `subscription_status` exist.
- Customer-success summary/note is not implemented.

### 2. Visibility

Fields:
- profile views;
- lawyer card clicks;
- related article clicks to lawyer/profile assets;
- top profile entry pages when available.

Source:
- `profile_views` post meta, currently gated/partial.
- GA4/GTM events: `lawyer_profile_view`, `lawyer_card_click`, `related_article_click`.

Current status:
- Dashboard displays stored `profile_views`.
- GA4 live receipt not verified.

### 3. Intake And Leads

Fields:
- assigned leads;
- new / qualified / contacted / converted / closed leads;
- lead practice area;
- lead city/region;
- urgency;
- source URL;
- source keyword/UTM when available;
- response status and response time when implemented.

Source:
- `justice_lead` CPT.
- Lead meta: `assigned_lawyer_id`, `lead_status`, `legal_area`, `lead_city`, `lead_urgency`, `source_url`, `source_keyword`, UTM fields.
- Future: first-contact timestamp and owner/lawyer disposition.

Current status:
- CRM has lead status counts and recent leads.
- Display-only lead quality/follow-up badges are implemented in `inc/lead-crm.php`.
- Owner-only lead disposition fields are implemented in `inc/lead-crm.php`: `lead_quality_override`, `follow_up_status`, `first_contact_at`, and `customer_success_note`.
- Response-time automation and monthly aggregation are not implemented.

### 4. Contact Conversions

Fields:
- phone clicks;
- WhatsApp clicks;
- form submissions;
- document/tool requests connected to the lawyer or area.

Source:
- GA4/GTM events: `phone_click`, `whatsapp_click`, `lead_form_submit`, `generate_lead`, `document_request_submit`.

Current status:
- Front-end events are wired in `assets/js/analytics-events.js`.
- Live GA4/GTM receipt and key-event configuration are not verified.

### 5. Content Value

Fields:
- connected published articles;
- pending content requests;
- new article ideas generated from GSC/CRM demand;
- internal links from article cluster to lawyer profile;
- content review status: source/legal/owner approved.

Source:
- `articles` CPT.
- Meta: `connected_lawyer_slug`, `requested_by_lawyer_id`, `content_status`, review gates.
- Project-control content packages.

Current status:
- Lawyer dashboard displays content requests.
- Published connected-article report is not implemented.

### 6. Search Visibility

Fields:
- top GSC queries for lawyer's practice area pages;
- top landing pages connected to the lawyer's cluster;
- impressions;
- clicks;
- CTR;
- average position;
- indexing/canonical warnings for relevant pages.

Source:
- GSC API/export.
- `project-control` GSC mirror files when available.

Current status:
- GSC documents exist, but automated API/export loop and exact lawyer-level mapping are not verified.

### 7. Reputation And Trust

Fields:
- profile completeness;
- verification status;
- source-backed bio fields completed;
- review/reputation status only where verified and approved;
- pending trust tasks.

Source:
- Lawyer profile meta.
- Review/reputation roadmap only after policy approval.

Current status:
- Profile completeness exists in dashboard.
- Reviews/ratings remain blocked unless source-verified and policy-approved.

### 8. Next Action

Examples:
- complete profile photo/bio/services;
- add video introduction;
- approve one connected article topic;
- improve response speed;
- upgrade to a plan only after legal/commercial approval;
- review lead quality with owner.

Source:
- Rule-based recommendation from missing fields, plan type, leads, content status and analytics.

Current status:
- Not implemented.

## Data Boundary Rules

- Do not expose client PII in lawyer-facing reports unless the lead is assigned to that lawyer and consent/routing rules allow it.
- Do not report fake views, fake lead counts or fake rankings.
- Do not promise first-page ranking, a number of leads, or legal outcomes.
- Paid/featured placement must be disclosed.
- Review/rating data must remain hidden unless verified and policy-approved.

## Implementation Phases

Phase A - already started:
- Track privacy-safe GA4/GTM events.
- Preserve selected lawyer plan intent.
- Show profile views, assigned leads and content requests in dashboard.
- Show plan/sales priority in owner onboarding admin.

Phase B - next safe repo work:
- Surface owner CRM/report fields in reporting views: lead quality, response status, first contact, sales/customer-success note.
- Add dashboard report skeleton with placeholders for GA4/GSC metrics.
- Add monthly value report admin export view.

Phase C - after deployment/verification:
- Verify GA4/GTM event receipt.
- Configure GA4 key events.
- Map GA4 event exports into report fields.
- Map GSC query/page exports into report fields.
- Add monthly email/report generation only after data quality is verified.

## Open Decisions

- Payment provider and recurring billing stack.
- Final plan names/prices.
- Lawyer advertising and paid-placement disclosure wording.
- Lead-quality definition.
- Whether report is lawyer-visible dashboard only, admin export only, email digest, or all three.
