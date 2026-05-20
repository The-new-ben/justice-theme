# Family Law Legal Library MVP Spec
Date: 2026-05-20
Status: EXECUTION SPEC FOR HAD-68 / PR #23

## Goal

Build the first Jus-Tice legal-library product around Family Law / Divorce, inspired by PsakDin and Justia but sourced from official Israeli materials and original editorial summaries.

This is not a mass-import project. The first win is a small, trustworthy, crawlable law center that can:

- restore and grow family-law SEO traffic;
- create more qualified user demand;
- give Maya Rotenberg a credible authority surface after owner verification;
- give paying lawyers a visible value product: topic authority, legal updates and user-intent insights.

## Current Research Basis

Sources reviewed this cycle:

- Google helpful content / E-E-A-T guidance: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google link best practices: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google Article structured data guidance: https://developers.google.com/search/docs/appearance/structured-data/article
- Google AI features guidance: https://developers.google.com/search/docs/appearance/ai-features
- PsakDin public product analysis: `project-control/psakdin-legal-library-strategy-2026-05-20.md`
- Justia family law center analysis: `project-control/justia-family-law-center-analysis-2026-05-20.md`
- Family-law official source map: `project-control/family-law-library-map-2026-05-20.csv`

Practical takeaway: for legal/YMYL content, the MVP must show original value, clear sourcing, real expertise/review, current dates, crawlable internal links and no copy/paste from competitors or government pages.

## MVP Shape

### Public User Journey

1. User searches a practical family-law problem.
2. User lands on a hub or guide with plain-language steps.
3. Guide links to relevant official law/service/case references.
4. User sees when the issue is simple, risky or urgent.
5. User can call, submit an intake form or request a matched lawyer.

### Googlebot / AI Bot Journey

Every MVP page must have:

- one clear H1;
- crawlable `<a href>` links to the hub, related guides, official source and intake;
- descriptive anchor text, not "read more";
- last reviewed date;
- author/reviewer placeholder policy;
- Article or WebPage JSON-LD where appropriate;
- canonical URL policy;
- noindex for thin source-only pages until they have original summary and useful routing.

### Lawyer Customer Journey

A paying family-law lawyer should eventually see:

- which family-law topics get user demand;
- which official updates are connected to their practice;
- which pages mention or can be reviewed by them;
- which leads came from which legal-library topic;
- monthly proof of value: profile views, content exposure, calls/leads and review freshness.

## First 6 Public Pages

Use `project-control/family-law-legal-library-mvp-pages-2026-05-20.csv` as the page brief map.

1. Family Law Center / hub
2. Divorce by agreement guide
3. Divorce agreement / property agreement approval guide
4. Parenting time / stay arrangements guide
5. Divorce certificate and post-divorce checklist
6. Family-court assistance units and dispute-resolution guide

These should be linked from the future Family Law Center, dynamic HTML site map and relevant existing family-law pages.

## Data Model Before Code

### `justice_legal_source`

Use for every official source before creating public content.

Fields:

- source_id
- source_type
- official_url
- source_body
- source_date
- retrieval_date
- topic
- practice_area
- jurisdiction
- privacy_risk: low / medium / high
- publication_policy: cite_only / summarize / review_required / hold
- source_status: candidate / approved / rejected / stale
- reviewer_required: yes / no

### `justice_legal_reference`

Use for public-facing law/case/form references later.

Fields:

- reference_id
- source_id
- public_title
- short_summary
- practical_question_answered
- connected_hub_url
- connected_guide_url
- connected_intake_type
- canonical_policy: index / noindex / source_only
- author_id
- reviewer_id
- reviewed_at
- next_review_due

### `justice_topic_hub`

Use for commercial clusters, not isolated articles.

Fields:

- hub_slug
- primary_keyword
- user_problem
- money_intent
- connected_pages
- connected_sources
- connected_lawyers
- lead_route_rule
- internal_link_targets
- conversion_cta

## Publication Gate

No item should go public unless it passes:

1. Official source URL exists and loads.
2. Content is original summary, not copied.
3. Privacy risk is assessed.
4. Family/minor/case details are reviewed before publication.
5. Last reviewed date is truthful.
6. Reviewer/author is real and linked only if verified.
7. Page has a clear route to the user action: read more, prepare documents, call, submit intake or choose lawyer.

## Implementation Order

### Phase 1 - Repo-Safe

- Merge PR #23.
- Approve this MVP spec.
- Create a live checker spec for Family Law Center links and official sources.
- Decide canonical Family Law Center URL.

### Phase 2 - First Code PR

- Add theme/data support for official legal-source cards.
- Add a Family Law Center template section with topic cards and source cards.
- Add noindex support for source-only pages if needed.
- Add checker for crawlable links, H1, CTA, source link and reviewed date.

### Phase 3 - Content PR

- Publish the first 3 guides only after legal/owner review.
- Link from homepage/footer dynamic site map and family-law hub.
- Request indexing only after QA passes.

## Money Impact

Short term:

- Better family-law traffic recovery path.
- Better lead capture from practical searches.
- Stronger pitch to Maya/family-law lawyers: "we build authority around your field, not just a profile."

Medium term:

- Paid lawyer retention: monthly legal-update and topic-demand reports.
- Full Service value: reviewed content, legal updates, reputation prompts and authority assets.
- Lead coverage insight: if users ask for Thailand law, immigration, wills, etc., the library records demand and triggers lawyer recruitment.

## Completion Assessment

- Research and competitor synthesis: 75%.
- Official source map: 60%.
- MVP data model: 55%.
- Live Family Law Center product: 0%.
- Money/customer impact today: indirect; this prepares the asset that can bring qualified traffic and sell authority services.

## Next Action

Build the first code PR for the Family Law Center MVP shell: hub section, source cards, legal-review metadata and crawler checker. Do not publish legal-source pages until owner/legal review approves the first 3 guides.
