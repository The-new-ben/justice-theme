# Jus-Tice Revenue Streams Backlog - 2026-05-25

## Honesty Statement

This is not a strategy dump. It is an execution backlog that converts the last two revenue research reports into tracked work, Linear tasks and owner-only WordPress infrastructure.

I am not abandoning started work. The Bituach Leumi appeal funnel is already live as code and remains the first unfinished revenue loop to close. It now has its own Linear child task: `HAD-76`.

I am also not treating every market number in the pasted reports as verified fact. Several numbers, dates and valuation claims are useful for direction, but they must be source-checked before they appear in investor materials, public pages or sales decks.

## Hard Rules

- No public CMS/database publication from this backlog without owner approval.
- No redirects, canonicals, noindex, sitemap changes or taxonomy changes from this backlog without owner approval.
- No paid OpenAI, Anthropic, Gemini, Groq or other LLM/API automation unless the owner explicitly approves spend.
- No unattended scraping, login automation, CAPTCHA/MFA bypass or platform-protection bypass.
- No legal outcome promises, ranking promises, guaranteed compensation claims or "best lawyer" claims.
- Every new calculator/tool must pass an anti-cannibalization audit before a public URL is created.

## Linear Tracking

Parent issue:

- `HAD-75` - Revenue Streams Backlog: consolidate plays 1-32 into execution system

Child issues created:

- `HAD-76` - Finish started Bituach Leumi appeal funnel to first billable lead
- `HAD-77` - Build internal Revenue Streams Map admin page
- `HAD-78` - Anti-cannibalization audit for calculators and money tools
- `HAD-79` - Supplier and immigration marketplace with smart bidding mechanism
- `HAD-80` - Wave 1 urgent legal-money funnels: Aliyah Tax, hostile act, reservists, property tax, arnona
- `HAD-81` - Wave 2 conversion infrastructure: AI intake, WhatsApp, RAG, demand letters
- `HAD-82` - Multi-professional directory and claim-profile expansion
- `HAD-83` - Advanced niche revenue streams: accessibility, crypto, class actions, insurance, HNW estate
- `HAD-84` - Enterprise and premium platform plays: HarvIL, contract AI, virtual law firm, SMB compliance, diaspora
- `HAD-85` - Legal Q&A and court-ruling SEO moat
- `HAD-86` - Employment and real-estate due-diligence tool funnels

## Original Research Packets

The source reports are preserved under `project-control/research-originals/` so
remote teams and future agents can inspect the original strategic material
instead of relying only on this distilled backlog.

- `project-control/research-originals/README.md.php`
- `project-control/research-originals/2026-05-25-investor-critical-review-original.md.php`
- `project-control/research-originals/2026-05-25-revenue-plays-original.md.php`
- `project-control/research-originals/2026-05-25-deep-research-revenue-plays-original.md.php`

Remote continuation rule:

- Read this file first for current execution order.
- Then read the matching original packet before changing scope.
- Then update the matching Linear issue so the work does not disappear into chat.
- Do not publish public content, create URLs, alter SEO controls or launch paid
  API work from the original packets without the relevant guard issue.

## WordPress Infrastructure Added

Owner-only admin page:

- `Justice CRM -> Revenue Streams`
- Slug: `admin.php?page=justice-revenue-streams`
- Code: `inc/revenue-streams.php`

Purpose:

- Keep all 32 plays visible with equal fields: play ID, status, wave, SEO surface, target keyword, monetization, infrastructure, anti-cannibalization blocker, next action and Linear issue.
- Keep strategy private. This is not a public landing page.
- Make the next step obvious instead of letting research disappear in chat.

Supplier marketplace infrastructure:

- Extended `justice_supplier` with provider type, jurisdictions, license/credential status, minimum price, response SLA and bid/proposal model.
- Added immigration/citizenship, cross-border tax/EOR/employment and premium packaged consult categories.
- Added bid/proposal marketplace revenue model.
- Added CRM supplier table visibility for provider type, bid model and pricing floor.

## Started Work That Must Not Be Dropped

### Bituach Leumi appeal funnel

Status: started and live.

Already shipped:

- `/bituach-leumi-appeal-guide/`
- `/national-insurance-attorney/`
- Appeal calculator JS
- Paid-lawyer routing gate
- Lead caps
- Qualified lead billing queue in CRM
- Public-facing path chooser that explains the next visitor step without
  exposing internal revenue, CMS, Grow or billing language.
- Owner-only CRM billing queue for qualified appeal leads that are ready for
  manual invoice/payment follow-up while Grow/Meshulam is not fully active.
- One-click owner-only email/WhatsApp prompts from the qualified billing queue
  to billable lawyers. These create manual messages only; they do not send
  automatically and do not expose this flow publicly.
- Owner-only Bituach Leumi specialist supply panel in Justice CRM. It counts
  active routable paid specialists, counts open prospects, shows the gap to the
  first three specialists, and opens a prefilled prospect form without creating
  public profiles.
- Owner-only Bituach Leumi recruitment packet in Justice CRM with copy-ready
  initial outreach text, qualification questions and a credential/response
  checklist. It does not send messages automatically.
- Public publication guard tightened after the Bituach Leumi screenshot issue:
  visitor-facing content must not expose internal revenue logic, provider setup,
  Linear/uPress workflow language or "revenue for Jus-Tice" framing. The
  Revenue Streams admin page now shows the no-hourly-email rule and the
  publication email/cannibalization obligations.
- Private prospect verification added for Bituach Leumi specialist supply:
  prospect records now track license check, niche-experience check, response
  commitment and manual-payment readiness before a prospect is treated as ready
  for lead routing.
- Prospect verification views added: the private prospect pipeline can now be
  filtered by "Needs verification" and "Ready for routing", and the Bituach
  Leumi supply panel links directly into both views.
- First-three-specialists tracker added to the private Bituach Leumi CRM panel.
  It lists matching prospects, contact status, verification gaps, next action
  dates and direct edit links, with ready prospects sorted first.
- Private Bituach Leumi specialist source pack added:
  `project-control/btl-specialist-prospect-shortlist-2026-05-26.md` and `.csv`
  collect source-linked candidates for manual verification. No public profile,
  database record or outreach was created from this pack.
- Source-pack candidates are now visible in the private Bituach Leumi CRM panel,
  with "Add private prospect" buttons that prefill private draft fields but do
  not create records until the owner saves them.
- Each source-pack candidate row now includes a copy-ready verification brief
  covering source, focus, evidence, five checks before routing and the
  no-promise/no-public-profile boundary.
- Source-pack progress tracking added to the private Bituach Leumi CRM panel:
  the panel now counts total source-pack candidates, private prospects already
  created from matching source URLs, and remaining candidates still needing
  manual private prospect creation. Candidate rows now show "Already in
  pipeline" with a direct private prospect link instead of inviting duplicate
  CRM creation.
- Next-source action board added to the private Bituach Leumi CRM panel:
  it surfaces the next three non-duplicated source-pack candidates, with
  Create private prospect, Open source, copy-ready verification brief and
  exact manual checks before routing.
- Private prospect draft prefill tightened for source-pack conversions:
  source-pack draft links now prefill next action date, response-fit status and
  the verification-note field, not only the source URL and owner note.
- Manual verification call sheet added to the private next-source action board:
  the next three candidates can now be copied as a TSV working sheet with
  candidate, source, focus, evidence, missing checks, next action date and the
  no-publish/no-routing boundary.

Remaining:

- Recruit 3 specialist lawyers.
- Convert the three candidates shown in the next-source action board into
  verified private prospects, then continue through the remaining high-priority
  rows.
- Run a real test lead.
- Mark first billable qualified lead in CRM.
- Use manual invoice/payment path until Grow/Meshulam is ready.
- Confirm final intent split between `/bituach-leumi-appeal-guide/`,
  `/national-insurance-attorney/`, old Bituach Leumi calculator URLs and the
  broad national-insurance directory/filter before creating any additional
  public Bituach Leumi pages.

### Public trust and homepage fixes

Status: live.

Already shipped:

- Public lawyer-card labels softened away from "unverified" language.
- Maya legacy URLs redirected to the real lawyer profile path.
- Homepage reframed to include lawyers and legal professionals.

Remaining:

- Continue visual QA before investor review.
- Keep internal terms like Grow, Meshulam, CMS and implementation details off public pages.

## Anti-Cannibalization Warnings

Do not create these public pages/tools before audit:

- `מחשבון מס רכישה` - purchase tax pages and verdict pages already exist.
- `מס שבח` - `/land-appreciation-tax/` already owns tax-support intent.
- `property-tax-calculator` or `property-check` - `/property-investment-calculator/` already exists and has GSC risk.
- `מחשבון מזונות` - old Hebrew child-support calculator URL and `/child-support/` have known conflict.
- `national-insurance-calculator` - an older Bituach Leumi calculator exists separately from the new appeal funnel.

Current Bituach Leumi relationship to report on publication:

- `/bituach-leumi-appeal-guide/` is the canonical guide/tool route for appeal
  intent in current theme code.
- `/national-insurance-attorney/` is a matching service-intent entry point that
  currently renders the same focused appeal funnel.
- `/lawyers/?area=national-insurance` is the lawyer-directory destination.
- Old Bituach Leumi calculator URLs are related but should not be merged,
  redirected or expanded until source/GSC evidence confirms which URL owns the
  calculator intent.

Execution rule:

- Upgrade the existing URL when it already owns the intent.
- Create a new route only when the intent is materially different and documented.

## Revenue Play Coverage

The internal admin page contains all 32 plays from both research reports.

Coverage map:

- Play 1: `HAD-76`
- Plays 2 and 7: `HAD-86`
- Plays 3, 5 and 6: `HAD-82`
- Plays 4 and 25: `HAD-85`
- Plays 8, 10, 11, 12, 22, 28, 29 and 30: `HAD-84`
- Plays 9, 21, 23, 24 and 27: `HAD-81`
- Plays 13, 14, 15, 18 and 19: `HAD-80`
- Plays 16, 17, 20, 26, 31 and 32: `HAD-83`

## Immigration and Citizenship Opinion

Immigration is relevant, but it should not become a fantasy lane.

What is relevant:

- Aliyah tax and cross-border reporting.
- Portugal/citizenship suppliers if real suppliers exist and pricing is clear.
- Notary/apostille and document preparation.
- EOR/employment and relocation support.
- CPA plus lawyer bundled consults for high-value cross-border cases.

What I would not do yet:

- Do not promise citizenship outcomes.
- Do not build a public immigration marketplace before verifying supplier credentials.
- Do not force low pricing. Some cases should be premium bids or packaged consults.

Best structure:

- Internal supplier records first.
- Credential/license status.
- Jurisdictions/countries.
- Minimum price.
- Response SLA.
- Owner-invited or approved-supplier bidding.
- Public disclosure for sponsored/featured placement.

## Next Execution Order

1. Close `HAD-76`: Bituach Leumi first billable lead.
2. Complete `HAD-78`: calculator anti-cannibalization audit.
3. Build `HAD-79`: supplier and immigration marketplace fields plus first 20 supplier candidates.
4. Start `HAD-80`: one urgent public funnel only after source verification, probably Aliyah Tax or hostile-act compensation.
5. Keep `HAD-81` blocked until API spend and compliance are approved, but build no-API intake structure where useful.

## Current Completion Assessment

- Research-to-task capture: 80%
- WordPress internal revenue map: 70%
- Supplier marketplace infrastructure: 45%
- Bituach Leumi revenue loop: 62%
- Calculator anti-cannibalization: 20%
- Payment/Grow readiness: still blocked by KYC/payment setup
