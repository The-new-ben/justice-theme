# Reputation Product Roadmap
Date: 2026-05-10  
Status: ROADMAP - NOT IMPLEMENTED

## Product Goal

Turn lawyer reputation into a trust and monetization layer:
- better user confidence.
- higher lawyer profile conversion.
- better mini-site value.
- stronger E-E-A-T/entity signals.
- better paid lawyer product ladder.

## Phases

### Phase 0 - Policy And Data Model

Deliverables:
- review compliance policy.
- Google integration plan.
- review fields.
- schema policy.
- review moderation workflow.
- paid-placement disclosure rule.

Status: DOCUMENTED / NOT IMPLEMENTED.

### Phase 1 - Manual Source-Verified MVP

Features:
- Google Place ID field.
- Google review URL field.
- manually verified Google rating/count.
- last verified date.
- "Read reviews on Google" CTA.
- profile completeness score in admin.
- no review schema.

Best first profile: Maya Rotenberg.

### Phase 2 - Jus-Tice First-Party Reviews

Features:
- private `justice_review` CPT.
- review submission form after real interaction.
- privacy warnings.
- genuine-experience confirmation.
- moderation queue.
- lawyer reply workflow.
- review source disclosure.
- audit log.

### Phase 3 - Google API Sync

Features:
- Places API summary sync by Place ID.
- optional review sample only if terms allow.
- Business Profile API for authorized lawyer-owned profiles.
- last synced date and stale/error status.
- monthly sync or admin sync button.

### Phase 4 - Reputation Dashboard

Features:
- review source health.
- review trend.
- profile completeness.
- response-time metric.
- lead response metrics.
- article/Q&A authority metrics.
- AI review summary.
- AI suggested reply drafts.
- monthly reputation report.

### Phase 5 - Paid Product Packaging

Free profile:
- basic profile.
- no automated review import.
- no featured review block.

Pro profile:
- Google review link.
- review collection enabled.
- profile completeness.
- review moderation.
- basic analytics.

Featured / Premium:
- Google review sync if authorized.
- review highlights.
- reputation dashboard.
- article authority block.
- Q&A authority block.
- lead CRM insights.

Full service:
- review strategy.
- content strategy.
- profile optimization.
- video/media.
- article publishing.
- monthly reputation report.

## 50 Ideas Triage

| # | Idea | Phase | Status |
|---|---|---|---|
| 1 | Google Review link button | 1 | MVP |
| 2 | Google rating summary | 1 | MVP when verified |
| 3 | Google Place ID field | 1 | MVP |
| 4 | Google reviews last synced date | 3 | Later |
| 5 | Jus-Tice first-party reviews | 2 | Later |
| 6 | Review moderation dashboard | 2 | Later |
| 7 | Review privacy warning | 2 | Required |
| 8 | Lawyer review reply | 2 | Later |
| 9 | AI review summary | 4 | Later |
| 10 | Sentiment analysis | 4 | Later |
| 11 | Review source disclosure | 1 | Required |
| 12 | Review verification status | 1 | Required |
| 13 | Featured review block | 2 | Policy needed |
| 14 | Profile completeness score | 1 | MVP admin |
| 15 | Reputation dashboard | 4 | Later |
| 16 | Review request link | 2 | Later |
| 17 | QR review request code | 2 | Later |
| 18 | No-incentive review policy | 0 | Required |
| 19 | Conflict-of-interest warning | 2 | Required |
| 20 | Negative review handling policy | 0 | Required |
| 21 | Review removal request process | 0 | Required |
| 22 | Public review policy page | 0 | Required |
| 23 | Lawyer response-time metric | 4 | Private first |
| 24 | Lead conversion metric | 4 | Private |
| 25 | Q&A contribution metric | 4 | Later |
| 26 | Article contribution metric | 4 | Later |
| 27 | Video/profile media score | 4 | Later |
| 28 | External profile links | 1 | MVP when sourced |
| 29 | Bar/license status field | 1 | Needs source |
| 30 | Practice-area authority score | 4 | Avoid public score initially |
| 31 | City authority score | 4 | Avoid public score initially |
| 32 | Review schema review | 0 | Required |
| 33 | Rich Results Test workflow | 3 | Required before schema |
| 34 | Google Business Profile OAuth plan | 3 | Later |
| 35 | Places API MVP | 3 | Later |
| 36 | Manual review import fallback | 2 | Legal review |
| 37 | Review screenshots prohibited unless allowed | 0 | Required |
| 38 | Review cache expiry | 3 | Later |
| 39 | Review sync cron | 3 | Later |
| 40 | Review audit log | 2 | Required |
| 41 | Lawyer notification on new review | 2 | Later |
| 42 | Admin alert for risky review | 2 | Required |
| 43 | AI suggested reply | 4 | Later |
| 44 | Monthly reputation report | 4 | Premium |
| 45 | Review CTA on lead completion | 2 | Later |
| 46 | Read reviews on Google external link | 1 | MVP |
| 47 | Leave a review post-service email | 2 | Policy needed |
| 48 | Lawyer onboarding review setup | 1 | MVP |
| 49 | Premium plan review features | 5 | Product |
| 50 | Competitor review UX benchmark | 0 | Started |

## Success Metrics

- lawyer profile inquiry rate.
- review CTA clicks.
- Google review link clicks.
- profile completeness lift.
- lead conversion by profile completeness band.
- lawyer upgrade conversion.
- review moderation turnaround.

## Status

ROADMAP ONLY. No payment, review, schema, API or public profile code was changed.

## 2026-05-11 Roadmap Addendum

Status: ACCEPTED - roadmap expanded after deeper review/reputation research.
Implementation status: NOT IMPLEMENTED.

### Reputation Management Product Layer

## 2026-05-22 Google Business Marketing Ecosystem Addendum

Evidence:
- `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.md`.
- `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.csv`.

VERIFIED PLANNING:
- Reputation product packaging should include Google Business Profile setup status, review link readiness, review freshness, first-party recommendation status, profile completeness and lead/contact attribution.
- Google Business Profile metrics should feed monthly value reports only after owner/lawyer access and measurement fields are ready.
- API sync remains Phase 3 or later; manual/source-verified evidence remains the MVP.

PHASE UPDATE:
- Phase 1 now includes GBP URL, Place ID, review request URL, review count, latest review date, source status, UTM convention and GA4 event plan.
- Phase 4 monthly reporting should include profile views, contact clicks, lead submits, review-link clicks, first-party recommendation count, profile completeness and content exposure.

BLOCKED:
- No public rating/review UI, Google API sync, review schema, SMS/email sender, account edit or lawyer profile edit is approved by this addendum.

The module should become part of the lawyer monetization path, not just a profile widget.

Product capabilities to plan:
- review source setup during lawyer onboarding;
- Google Maps profile URL and Place ID capture;
- source proof and last verified date;
- review request link after a real client interaction;
- privacy-safe first-party review form;
- moderation dashboard;
- lawyer reply workflow;
- negative review handling policy;
- public review policy page;
- reputation health dashboard;
- monthly profile/reputation report;
- AI-assisted review themes and reply drafts, with human approval.

### Package Alignment

Free profile:
- basic profile;
- no public rating unless admin verifies external source;
- no automated review tools.

Pro profile:
- Google review link;
- profile completeness;
- review collection enabled after policy approval;
- basic reputation dashboard.

Featured / Premium:
- review highlights after moderation;
- Google Places summary sync if approved;
- AI response drafts;
- monthly reputation report;
- profile/content recommendations.

Full service:
- reputation setup;
- content strategy;
- profile optimization;
- media/video;
- monthly SEO and reputation report.

## 2026-05-20 Din Competitive Intelligence Addendum

Status: ADDED TO ROADMAP - NOT IMPLEMENTED.

Reference: `project-control/din-lawyer-review-system-analysis-2026-05-20.md`.

The Din account inspection confirmed that the review product should be part of a broader lawyer value dashboard, not a standalone widget. The commercial pattern to copy carefully is:

- review freshness warnings;
- review request workflow;
- profile views;
- phone/email lead history;
- category/region position;
- paid exposure budget;
- profile/content management;
- monthly proof of value.

Near-term Jus-Tice priority:

1. Add a private `Reputation And Value` dashboard panel.
2. Show review freshness and copyable review-request link placeholders.
3. Keep public ratings/schema disabled until source, moderation and compliance rules are implemented.
4. Add SMS only after owner approves provider, cost, consent text and throttling.

Money reason: this gives paying lawyers a reason to log in, see progress, ask for help, renew, and upgrade.

### Vendor Strategy

Podium, Birdeye and ReviewTrackers show that businesses pay for review collection, response management, reporting and AI summaries. Jus-Tice should copy the workflow logic, not the widgets:
- keep UX native to Jus-Tice;
- avoid slow third-party widgets;
- ensure exportability;
- avoid review gating;
- preserve legal-specific moderation and privacy rules.
