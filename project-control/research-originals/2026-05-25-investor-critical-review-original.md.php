<?php
http_response_code( 404 );
header( 'X-Robots-Tag: noindex, nofollow', true );
exit;
__halt_compiler();
# Original Research Packet: Multi-Layer Critical Review

Date supplied: 2026-05-25

Status: internal source packet. This preserves the full scope, findings,
priorities and source references from the owner-supplied critical review. It is
not a public deliverable and must not be used as public copy without review.

## Honesty Statement From The Source Report

The review checked the live repo, live site, the live homepage, the live lawyers
directory, Maya Rotenberg profile routes, practice landing pages, homepage
templates, the find-lawyer guide, Din, LawReviews, PsakDin and the current SERP
for the head term "עורך דין".

The review explicitly reported what was seen, not what planning documents said.

## Critical Investor Risks

### CRITICAL 1: Maya's Profile Was 404

The report found that Maya Rotenberg was visible as the real named attorney but
both `/lawyer/maya-rotenberg/` and `/lawyers/maya-rotenberg/` returned 404 at
that time. This was identified as a must-fix before investor review.

Implementation status after later work: public lawyer route trust surfaces and
legacy path handling were improved in later commits. Continue validating from
the live route and do not assume old route behavior is still current.

### CRITICAL 2: Public Cards Over-Emphasized "Unverified"

The review found public lawyer cards labelled as basic/unverified/pending
background review. This was honest but harmful for conversion. The recommended
direction was to hide negative public labels and show trust-positive facts only
when source-checked.

Implementation status after later work: public wording was softened and fact
gates were added. Continue using the fact gate.

### CRITICAL 3: Homepage Showed Non-Lawyer Legal Professionals

The report identified a mismatch between "עורך דין" intent and cards for
rabbinical-court pleaders or other legal professionals. It recommended either
filtering the homepage to Bar-licensed lawyers or clearly reframing the platform
as "אנשי משפט" when non-lawyers are shown.

Owner direction after review: lawyers remain core, but professional-services
providers are approved as a revenue category when clearly separated and not
misrepresented as lawyers.

### CRITICAL 4: No Revenue Infrastructure Fully Live Yet

The report stated that the investor could not yet be shown a lawyer signing up
and paying end-to-end because WooCommerce/subscriptions/Morning/Meshulam/Grow
and product mapping were not fully live/verified.

Current rule: do not claim recurring billing, automated invoices, refunds or
payment automation until real provider-approved tests pass.

## Layer 1: Customer-Facing Reality

What worked:

- Hero structure existed: H1, explanation, practice/city search, keyword field,
  CTA, stats and popular chips.
- The six-step "how to find a lawyer" guide was considered genuinely valuable
  content with FAQ, red flags, fees, when to hire a lawyer, questions to ask and
  meeting checklist.
- Infrastructure existed: schema, breadcrumbs, sitemap, large article base,
  practice areas, mobile/RTL, footer compliance.

What was broken:

- Maya profile route issue.
- Public "unverified" labels.
- Mostly non-lawyers shown against lawyer intent.
- No phone numbers above the fold on cards.
- No reviews/star ratings.
- Competing CTAs.
- Generic hero wording.
- Multiple home templates causing technical confusion.

Competitor lessons:

- Din exposes phone numbers on cards, lawyer-advertising links and practice
  navigation.
- LawReviews leads with reviews and rating volume.
- PsakDin owns editorial/content signals but not the same directory/payment
  funnel.

## Layer 2: Lawyer-Facing Reality

What worked:

- Lawyer registration collected rich profile fields.
- Lawyer plan pricing existed in the planning/workflow: Pro, Featured, Lead
  Partner and Full Service tiers.
- Lawyer dashboard had a first-value panel, magic-link login and request forms.
- Owner-side onboarding queue existed.

Risks:

- Zero proven published paying lawyers at review time.
- Lawyer journey had not been tested end-to-end.
- Data model over-used "lawyer" language while the business model also wanted
  mediators, experts, investigators, process servers and other legal-service
  providers.
- Claim-your-profile conversion funnel was missing or incomplete.

Source recommendation:

- Add `professional_type`.
- Enable claim profile.
- Build sales/outreach around seeded profiles.
- Do not conflate non-lawyers with lawyers.

## Layer 3: SEO And Ranking Reality

The reported SERP for "עורך דין" had established/high-authority competitors in
the top 10, including Din, LawReviews, Lawzana, Duns 100, Israel Bar and other
directories.

Honest assessment:

- "עורך דין" is a YMYL head term.
- Top 3 is a long-term project, not a short promise.
- Realistic path is to rescue mid-tail money queries where Jus-Tice already has
  impressions and weak CTR.

The report identified mid-tail opportunities such as:

- `עורך דין מקרקעין`
- `ביטול כתב אישום`
- `עורך דין עבירות מין`
- `עורך דין הסכם ממון`
- `עורך דין תעבורה`

Execution idea:

- Rewrite title/H1/opening 80 words for the top five GSC opportunities.
- Submit to GSC.
- Repeat in batches.

## Layer 4: Business-Model Reality

Revenue lines discussed:

- Lawyer subscriptions.
- Lead Partner / Full Service tiers.
- Non-lawyer professionals.
- Sponsored placement.
- Content-as-a-service to law firms.
- Lawyer-advertising packages.

Key idea:

The fastest extra revenue may come from legal-service professionals who are not
well served by Din/LawReviews: mediators, medical experts, investigators,
process servers, notaries and related providers. This requires a clean
professional-type data model and disclosure.

## Layer 5: Technical Reality

Risks identified:

- Multiple plugin folders and uncertainty about the active live plugin path.
- Large zip artifact in repo.
- Multiple home templates (`page-home.php`, `front-page.php`, `home.php`).
- Lawyer/lawyers slug confusion.
- Lack of automated funnel test coverage.

Loop-breaking discipline proposed:

1. Every commit must move product/revenue/user value, not only planning.
2. Every PR or deployment should include verification.
3. No new strategy document until previous actions are executed or tracked.
4. One focused revenue-impact task at a time.
5. After a task finishes, move to the next highest revenue-impact task.

## 30-Day Revenue Path From Source Report

Day 0:

- Fix Maya profile route.
- Hide negative unverified labels.
- Filter/reframe homepage cards.
- Verify deployment marker.

Day 1:

- Run preflight checks.
- Merge commercial pipeline if safe.
- Open Morning trial/setup.
- Install payment pieces in safe/demo mode.
- Prepare investor demo script.

Days 2-7:

- Finish subscription/payment activation path.
- Execute sandbox test.
- Rescue top five money queries.
- Start profile-claim campaign.

Days 8-14:

- Real-money smoke test.
- Add professional type.
- Outreach to first legal professionals.

Days 15-30:

- More query rescue.
- Lead Router v2.
- Reviews phase 1.
- Convert seeded lawyers.
- AI lead classifier later only with approved API spend.

## Investor Talk Track From Source Report

Do not promise:

- Top 3 for "עורך דין" in a short period.
- Lead guarantees.
- Immediate cross-media packages.
- Guaranteed lawyer count.

Do show:

- Built funnel spine.
- Indexed demand and GSC opportunity.
- Revenue plan with pricing.
- Manual minutes per lawyer moving downward.
- Category extension into legal professionals.

## Source Links Listed In The Supplied Review

- https://www.din.co.il/
- https://www.din.co.il/adv.asp
- https://www.lawreviews.co.il/
- https://www.lawreviews.co.il/join
- https://www.psakdin.co.il/
- https://lawzana.com/lawyers/israel
- https://www.duns100.co.il/rating/דירוגים/משרדי_עורכי_דין
- https://www.israelbar.biz/
- https://orhey-din.co.il/
- https://www.israeliyp.com/category/Lawyers
- https://www.nevo.co.il/law_html/law00/4427.htm
- https://sgo.co.il/seo-orchei-din-2026/
- https://wordpress.org/plugins/wc-gateway-greeninvoice/
- https://woocommerce.com/products/woocommerce-subscriptions/
- https://woocommerce.com/document/subscriptions/creating-subscription-products/
