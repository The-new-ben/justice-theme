# Lawyer Mini-Site Product Research
Date: 2026-05-09
Status: RESEARCH + PRODUCT SPEC

## Verified Client Rule

VERIFIED by user/project knowledge:
- The only lawyer who should appear as a verified homepage client right now is `advocate-maya-rotenberg`.
- Public homepage must not show fake/demo lawyers.
- Other lawyers can exist as draft, unverified, testing, or internal data, but should not be presented as verified clients.

NOT VERIFIED from public web search:
- External public sources for the exact verified client details were not confirmed in this session.

## Benchmark Findings

Sources:
- Justia Lawyer Directory / Premium Placements: https://www.justia.com/marketing/lawyer-directory/
- Justia free profiles and LII distribution: https://lawyers.justia.com/lawyer-directory-listings
- LII Lawyer Directory FAQ: https://lawyers.law.cornell.edu/content/about-lii-lawyer-directory
- Justia profile traffic statistics: https://onward.justia.com/unlocking-access-to-your-justia-profile-traffic-statistics-with-justia-premium-placements/
- Justia badges: https://lawyers.justia.com/lawyer-directory-badges
- Avvo public positioning: https://www.avvo.com/

## What Makes A Lawyer Profile Worth Paying For

A paid lawyer profile is not a card. It is a mini-site, lead engine, reputation asset, and content hub.

Core value:
- A professional profile page that can rank in Google.
- A conversion page that receives phone, WhatsApp, and form leads.
- A credibility page with reviews, author content, videos, badges, and social proof.
- A reporting dashboard that shows exposure, profile views, leads, and content performance.

## Feature Map

### Public Mini-Site
- Professional headshot / firm logo.
- Hero section with name, firm, practice focus, city/region, and main CTA.
- Short bio and long bio.
- Practice-area sections, each with custom text.
- Cities served.
- Languages.
- Courts/tribunals.
- Bar number / license status when verified.
- Office address and map.
- Phone, WhatsApp, email, website.
- Embedded intro video.
- Social links: LinkedIn, Facebook, Instagram, YouTube.
- Downloadable vCard later.
- FAQ answered by the lawyer.
- Legal disclaimer.

### Content Authority
- Articles signed by the lawyer.
- Article clusters attached to professional domains.
- Lawyer appears on related article pages.
- Lawyer can request articles/content briefs.
- Author box with credentials.
- Review/editorial workflow before publishing.

### Engagement
- Lead form on profile.
- WhatsApp click tracking.
- Phone click tracking.
- Intake questions by practice area.
- Urgency/city classification.
- Lead status tracking.
- Auto email/WhatsApp notification to lawyer later.

### Reviews / Reputation
- Client reviews after moderation.
- Peer/lawyer reviews later.
- Review request link.
- Review count and average rating only after genuine reviews exist.
- Ability to feature selected reviews after approval.
- No fake ratings.

### Analytics For Lawyer
- Profile views.
- Directory impressions.
- Phone clicks.
- WhatsApp clicks.
- Lead submissions.
- Top pages sending leads.
- Top search queries when GSC data exists.
- Monthly PDF/email report.

### Monetization
- Free profile: basic listing, limited fields, no homepage placement.
- Pro mini-site: full profile, video, articles, social links, analytics.
- Featured family-law placement: homepage/practice-page visibility.
- Lead partner: lead routing and lead inbox.
- Full service: profile + content + reporting + optimization.

## MVP For Advocate Maya Rotenberg

Homepage:
- Show only `advocate-maya-rotenberg`.
- Present the profile as a premium example of what a lawyer receives.
- No fake "top lawyer" claims.
- If paid/sponsored, label transparently.

Profile:
- Expand single lawyer page into mini-site layout.
- Add sections for video, articles, reviews, FAQ, social links, and lead CTA.
- Show empty states only when appropriate, not broken blank areas.

Admin/CMS:
- Add meta fields for video and social links.
- Add `featured_on_front` boolean, but homepage also guards by slug.
- Add review count/rating fields for future real review system.

Content:
- Create a family-law pillar cluster where Maya can be connected as the visible expert after approval.
- Suggested first authored topics:
  - עורך דין גירושין - איך בוחרים נכון
  - גירושין בהסכמה
  - משמורת ילדים
  - מזונות ילדים
  - הסכם ממון
  - חלוקת רכוש

## Compliance / Trust Rules

- Do not claim verification unless verified by the site owner.
- Do not fabricate reviews, ratings, awards, years, bar data, or client success.
- Paid placement must be labeled.
- Reviews must be moderated and tied to a real submission workflow.
- AI can help intake, summarize, draft, and classify, but must not provide legal advice as a lawyer.

## Implementation Tasks

1. Homepage feature: query `advocate-maya-rotenberg` only.
2. Lawyer meta: video/social/review analytics fields.
3. Mini-site page: add video, articles, FAQ, reviews, social links, metrics-ready CTA.
4. Review CPT or comment workflow: design moderation before enabling public reviews.
5. Analytics: track profile views, phone clicks, WhatsApp clicks, leads.
6. Lawyer dashboard: show profile completeness and performance.
