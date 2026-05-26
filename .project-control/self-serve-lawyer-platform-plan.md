# Self-Serve Lawyer Platform Plan
Date: 2026-05-09

## Product Principle

Goal: reach near-zero founder effort.

Lawyers should be able to:
- register themselves
- choose a plan
- pay online
- build their own profile / mini-site
- upload photo, logo, video, social links, practice areas, cities, languages, credentials and content
- ask AI to draft profile text and articles
- submit content for approval
- receive and manage leads
- track profile views, inquiries, conversions and subscription status
- upgrade/downgrade/cancel without manual negotiation

The founder should mainly review exceptions, compliance flags, payment failures and high-value opportunities.

## Research Notes

VERIFIED from competitor/product research:
- Justia premium/profile products emphasize profile completeness, lawyer directory statistics, premium placement, reviews, badges, social links and directory exposure.
- Avvo-style profiles use lawyer-submitted profile data, reviews, Q&A, legal guides and lead-generation/marketing services.
- FindLaw premium profiles emphasize practice overview, attorney credentials, law firm marketing presence and faster online visibility.
- Modern legal AI intake tools emphasize guided intake, document upload, AI summarization, approval gates and workflow automation.

RISK:
- Lawyer advertising and referral/payment structures are regulated.
- WhatsApp/outreach in Israel must not be treated as free bulk spam. Research indicates Israeli marketing messages require prior consent/opt-in, unsubscribe, timing controls and audit logs; violation risk can be high per message.
- AI-generated legal content must not be published as attorney-authored content without lawyer review and approval.

## Self-Serve System Architecture

### Lawyer Account
- WordPress user role: `justice_lawyer_member`
- One user can claim/manage one or more `justice_lawyer` profiles.
- Profile claim requires email/phone verification and admin approval before public “verified” status.

### Lawyer Onboarding Wizard
Steps:
1. Account creation
2. Identity and license details
3. Practice areas and cities
4. Contact and WhatsApp preferences
5. Upload photo/logo/video
6. AI profile interview
7. Mini-site preview
8. Choose plan
9. Payment
10. Submit for review

### AI Console
Purpose: reduce founder/operator work.

The AI console should:
- interview the lawyer about services, ideal clients, experience and tone
- generate profile headline/subheadline
- generate service cards
- generate FAQ drafts
- generate article brief ideas by practice area
- generate lead response templates
- summarize leads
- classify lead area/city/urgency
- suggest profile completion tasks
- flag risky advertising claims
- require lawyer approval before publishing under the lawyer's name

Guardrails:
- no legal advice to site visitors as if from a lawyer unless reviewed
- no fake reviews, fake rankings or unverified badges
- no “best/top/recommended” claims without a documented methodology
- no attorney-authored article unless approved by that attorney

### Content Workflow
Statuses:
- draft_by_lawyer
- ai_draft
- lawyer_review
- submitted_for_site_review
- approved
- rejected
- published
- needs_update

Every content item should store:
- author lawyer id
- reviewer id
- AI-generated flag
- approval timestamp
- source/citation notes
- target keyword
- practice area
- internal links
- disclaimer block

### Payments / Plans
MVP plans:
- Free Claim: basic listing, no homepage placement
- Pro Mini-Site: full profile, video, FAQ, articles, analytics
- Lead Partner: lead inbox, routing, notifications
- Featured Placement: sponsored positions with visible disclosure
- Full Service: AI content briefs + managed approvals

Do not launch live payment rules until Israeli lawyer advertising/referral compliance is reviewed.

### Outreach Model
Preferred:
- inbound SEO
- opt-in lawyer signup
- LinkedIn/email outreach with compliance controls
- retargeting ads
- webinars/checklists for lawyers
- “claim your profile” landing pages

WhatsApp:
- only for opt-in contacts, existing relationships, or explicit consent lists
- every message must include identity, purpose and unsubscribe path
- keep audit logs: consent source, timestamp, campaign, message template, opt-out
- avoid scraping and cold blasting lawyers on WhatsApp

### Founder Dashboard
Must show:
- new lawyer signups
- profiles waiting approval
- AI content waiting review
- payment failures
- suspicious claims
- leads by area/city
- revenue by plan
- churn/cancellation
- top ranking pages
- profiles with low completion

### Lawyer Dashboard
Must show:
- profile completion score
- edit mini-site
- AI console
- content requests
- lead inbox
- analytics
- billing/subscription
- reviews/testimonials awaiting moderation
- compliance checklist

## MVP Build Order

1. CMS fields for mini-site profile sections.
2. Lawyer profile owner relation: `claimed_by_user_id`.
3. Frontend account area skeleton.
4. AI profile interview draft generator.
5. Approval workflow for profile/content changes.
6. Payment plan architecture.
7. Lead inbox.
8. Analytics.
9. Review/testimonial moderation.
10. Outreach compliance CRM.

## Current Repo Implementation

FIXED:
- Mini-site template reads new `justice_lawyer` CMS fields.
- Admin meta fields added for profile content sections.
- Homepage has an editable page-content band with spam guard.

NOT VERIFIED:
- Active live plugin path.
- Whether these new admin fields appear in the exact plugin currently active on live.
- Lawyer dashboard/login area does not exist yet.
- Payment flow does not exist yet.
- AI console does not exist yet.
