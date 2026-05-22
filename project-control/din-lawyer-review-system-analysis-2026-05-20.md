# Din Lawyer Reputation System Analysis
Date: 2026-05-20
Status: COMPETITIVE INTELLIGENCE / PRODUCT ROADMAP

## Scope And Safety

The owner authorized read-only login to a Din lawyer account for competitive analysis. No credentials are stored in this repository. No SMS, profile edit, payment load, article edit, judgment edit, or outreach action was intentionally performed.

Important honesty note: during inspection, the "improve your position" link did not open a neutral information page. It redirected to a Din system message saying a request was received and they may call within 48 hours. No form was filled, no payment was made, and no profile details were changed, but this click may have created a callback request inside Din. Treat this as a read-only inspection exception and avoid that link in future competitor analysis.

## Research Basis

- BrightLocal Local Consumer Review Survey 2026: review recency matters strongly; consumers increasingly prefer recent reviews and many ignore businesses below high rating thresholds.
- Google Business Profile policy: fake engagement, incentives, review manipulation, selective solicitation, and discouraging negative reviews are prohibited and can create profile restrictions.
- Google local/review enforcement in 2026 is stricter around incentivized or artificial reviews, so Jus-Tice must build compliant review requests, not fake review growth.
- Din account inspection: the strongest monetization pattern is not only "reviews"; it is a private lawyer dashboard that connects reviews, leads, phone calls, profile views, category position, content management and paid placement into one value story.

Sources:
- https://www.brightlocal.com/research/local-consumer-review-survey/
- https://support.google.com/business/answer/2622994
- https://support.google.com/business/answer/14114287
- https://www.din.co.il/live/loginform.asp

## What Din Does Well

### 1. One Control Panel For The Lawyer

Din gives the lawyer one private area with visible modules:

- email inquiries
- phone inquiries
- forum inquiries
- SMS review request
- profile management
- email/password settings
- article management
- judgment/case-law management
- job-board and office-board ads
- advertising advantages

The important product lesson: a paying lawyer should not feel they bought "a page". They should feel they entered a business system.

### 2. KPI Cards That Justify Renewal

The Din dashboard makes value visible with cards for:

- email leads
- phone leads
- advertising budget balance
- category/region position
- profile views
- review count and rating

The important product lesson: monthly subscription retention needs visible proof. Even if lead volume is low, the lawyer should see exposure, profile improvement, review requests, content work and next actions.

### 3. Review Request Workflow

Din's review module is very simple:

- enter client name
- enter phone
- accept terms
- send SMS
- copy a review link as an alternative
- show review list with content, client name, date and rating

The important product lesson: the first Jus-Tice version should be simpler and safer than SMS. Start with a copyable review-request link and a logged manual request. Add SMS only after provider, consent text, cost and compliance are approved.

### 4. Review Recency As A Sales Trigger

Din's email to the lawyer frames stale reviews as a business risk: clients care not only about count, but freshness. This is the correct retention angle.

Jus-Tice should track:

- last review date
- review freshness state: fresh, aging, stale
- monthly review-request target
- requests sent
- reviews received
- reviews awaiting moderation

This can become a monthly upsell and retention message for Pro, Featured, Lead Partner and Full Service plans.

### 5. Paid Placement Upsell

Din connects position/rank and advertising budget directly to the lawyer dashboard. That makes upgrade pressure visible.

Jus-Tice should use this carefully:

- paid placement must be labeled "פרופיל ממומן"
- avoid "best", "recommended", "top lawyer" or unverifiable ranking claims
- show exposure opportunities as "sponsored visibility" and "available placements", not quality superiority

### 6. Content As Lawyer Value

Din exposes article and judgment management inside the lawyer private area. This tells the lawyer: "your professional footprint lives here."

Jus-Tice should connect content requests, author/reviewer authority, profile completeness and monthly reports to the dashboard. This is especially important for E-E-A-T and for convincing lawyers to pay beyond basic listing.

## Jus-Tice Product Direction

### Near-Term MVP

Build a "Reputation And Value" panel in the lawyer dashboard:

- profile views
- linked leads
- content/profile update requests
- payment/manual-invoice state
- last review date
- review freshness state
- copyable review-request link
- "request more reviews this month" task

Do not publish public ratings or review schema until the review source, moderation and compliance policy are complete.

### Admin / Owner View

Add an owner/admin view for lawyers needing attention:

- stale reviews
- no reviews
- high profile views but low leads
- paid-intent manual invoice requested
- profile completeness below target
- no recent content update
- uncovered demand by practice area where Jus-Tice has no partner lawyer

This turns daily operations into a money workflow: call lawyers who have a clear business reason to upgrade or join.

### Review Collection Flow

Phase 1 should be low-risk:

- create a unique review request URL per lawyer profile
- lawyer copies link or sends it manually
- client lands on Jus-Tice review intake page
- client confirms genuine experience and no incentive
- review enters moderation queue
- no public display until owner/admin approves
- no Google review scraping or fake imports

Phase 2 can add:

- SMS provider integration
- request log
- throttling
- client consent checkbox
- lawyer monthly request quota by plan

### Paid Plan Packaging

Pro:
- profile completeness
- review-request link
- basic exposure and review freshness dashboard

Featured:
- sponsored placement disclosure where applicable
- review freshness monitoring
- monthly value report

Lead Partner:
- routed lead visibility
- review + lead response metrics
- uncovered-demand opportunity alerts

Full Service:
- review campaign management
- profile/content optimization
- monthly reputation report
- owner-managed outreach and content plan

## Implementation Plan

1. Document competitor findings and compliance guardrails.
2. Add dashboard read-only reputation placeholders using existing meta fields.
3. Add admin stale-review/follow-up columns, private first.
4. Add review-request link generator with no SMS.
5. Add first-party review intake CPT and moderation queue.
6. Add monthly reputation/value report.
7. Add SMS only after provider approval, cost approval and compliance wording.

## What Not To Copy

- Do not send SMS before explicit provider and wording approval.
- Do not promise ranking superiority.
- Do not create fake reviews, fake ratings, scraped reviews or imported Google reviews.
- Do not publish "recommended lawyer" claims without a compliant, verifiable basis.
- Do not make review solicitation selective only for happy clients.
- Do not expose private lead or phone-call data publicly.

## Completion Assessment

- Competitive intelligence captured: 70%.
- Reputation/reviews product definition: 45%.
- Lawyer dashboard value/retention direction: 55%.
- Actual Jus-Tice review request implementation: 0%.
- SMS review automation: 0%, intentionally blocked until provider/compliance approval.
- Revenue impact today: indirect but important. This gives us a concrete retention and upsell layer for paid lawyers.

## Where The Owner Will Notice Progress

At this stage, the change is not visible publicly. It is visible in the repository as this product plan and should guide the next code step: a dashboard "Reputation And Value" panel that makes lawyers feel the subscription is actively working for them.

