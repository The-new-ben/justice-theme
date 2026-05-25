# Original Research Packet: Seven Revenue Plays And Supporting Ideas

Date supplied: 2026-05-25

Status: internal source packet. This preserves the full scope of the first
revenue-play report. Market numbers and legal claims must be source-checked
before investor/public use.

## Research Depth Statement From Source

The report cross-referenced:

- Israeli market data: Bituach Leumi appeals, Net HaMishpat, Kol Zchut,
  Avvo patterns, severance calculators, process-server market, small claims and
  Hebrew Q&A competitors.
- Current code infrastructure: `justice_legal_tool`,
  `justice_legal_request`, payment-status fields, seeded tools, REST routes,
  rule-based classifier, lead routing and lawyer claim/subscription fields.
- Competitor gaps: Din monetizes lawyers, LawReviews monetizes reviews,
  PsakDin monetizes editorial, Hebrew Q&A sites are weak and Kol Zchut does not
  monetize.
- Compliance reality: avoid outcome promises, use disclosure, keep lawyer
  review in the loop, do not charge forbidden per-referral structures without
  legal review.

## Play 1: Bituach Leumi Appeal Funnel

Why it matters:

- High urgency because appeal windows are short.
- Kol Zchut owns information but not lead capture.
- Lawyers can monetize successful appeal work.
- Existing classifier already supports `national-insurance`.

Build:

- Pillar route: `/bituach-leumi-appeal-guide/`
- Tool: appeal worth-it calculator.
- Lead request area: `national-insurance`.
- Route only to lawyers with the national-insurance practice area, active paid
  status and lead cap availability.
- Lead fee idea: approximately NIS 249 per qualified appeal lead, manual invoice
  first.
- Recruit three specialist lawyers as founding coverage partners.

Status in repo:

- Started and live in code.
- Tracked in Linear `HAD-76`.

## Play 2: Severance-Pay Tax-Back Calculator

Why it matters:

- Fired employees may not claim the full tax-back/exemption.
- Calculator intent is strong and conversion-friendly.

Build:

- JS calculator.
- CTAs for report download, demand-letter generation and paid lawyer review.
- Paid lawyer review flow through `justice_legal_request`.
- PDF generator later.
- Protect existing employment/severance pages from cannibalization.

Tracked in Linear:

- `HAD-86`

## Play 3: Claim Your Profile Conversion Campaign

Why it matters:

- Seeded lawyer profiles are zero-CAC sales leads if handled ethically and
  accurately.

Build:

- Claim-profile CTA on public lawyer profiles.
- `/claim-profile/` flow with email/license proof.
- Owner approval before access.
- Magic-link to lawyer dashboard.
- Personalized outreach to seeded lawyers.

Tracked in Linear:

- `HAD-82`

## Play 4: Hebrew Legal Q&A Forum

Why it matters:

- Avvo built a major organic moat with Q&A.
- Hebrew competitors are weak.
- Each question can become a long-tail SEO page after moderation.

Build:

- `justice_qa_question` and `justice_qa_answer` CPTs.
- Public question form.
- Lawyer dashboard panel for unanswered questions.
- Answer points/leaderboard.
- Paid Q&A option later.
- FAQ schema and internal links.

Tracked in Linear:

- `HAD-85`

## Play 5: Multi-Professional Directory

Why it matters:

- Din/LawReviews focus mostly on lawyers.
- Untapped legal-service categories include mediators, medical experts,
  investigators, appraisers, process servers, notaries and tax advisors.

Build:

- `professional_type` taxonomy/field.
- Registration and templates flex by type.
- Separate plan ladders for lawyers and non-lawyer professionals.
- Dedicated landing pages for each professional type.
- Outreach to first mediators/providers.

Tracked in Linear:

- `HAD-82`

## Play 6: Process Server Marketplace

Why it matters:

- Lawyers need document delivery frequently.
- Existing UX is fragmented.
- Marketplace can combine subscriptions and order-flow commission.

Build:

- `justice_service_request` for process serving.
- Process servers as professional providers.
- Dashboard tile for lawyers.
- Quote/response flow.
- Proof-of-service upload.
- Split payment only after payment-provider approval.

Tracked in Linear:

- `HAD-82`

## Play 7: Real-Estate Due-Diligence Free Report Funnel

Why it matters:

- Property buyers have high legal value.
- A report can capture high-intent leads before they choose a lawyer.

Build:

- `/property-check/` form.
- Public data lookup only if allowed and stable.
- Free report with lawyer verification upsell.
- Route to real-estate lawyers.
- Must avoid cannibalizing existing real-estate calculator/pages.

Tracked in Linear:

- `HAD-86`

## Additional Ideas From The Source Report

These were listed as future revenue plays:

8. Voice-AI receptionist for solo lawyers.
9. WhatsApp Business bot.
10. Court-hearing notification SaaS.
11. Hebrew Wikipedia/content authority service.
12. Legal news Telegram channel.
13. Lawyer Google Ads management.
14. English diaspora sub-portal.
15. Mortgage broker referral pipeline.
16. Kibbutz/workers council bulk legal-insurance plans.
17. AI-drafted standardized contracts.
18. Will and inheritance tool.
19. Lawyer credentials verification API.
20. Court-rulings summarizer.
21. Bituach Leumi forms generator.
22. Car-accident emergency intake.
23. Paid 15-minute consult.
24. Lawyer client portal as a service.
25. Tax-refund/found-cash agent.

## Execution Discipline From Source

Every play must map to:

- A revenue surface: the user or supplier can pay.
- A conversion surface: email/phone is captured with a next step.
- A paying user path: a real human can be invoiced or charged.

No more strategy-only loops. Convert into code, admin workflow, Linear task or
source-checked content packet.

## Source Links Listed In The Supplied Report

- https://www.avvo.com/for-lawyers/legal-qa
- https://vizologi.com/business-strategy-canvas/avvo-business-model-canvas/
- https://www.kolzchut.org.il/he/ערעור_על_החלטת_ועדה_רפואית_לעררים_של_המוסד_לביטוח_לאומי
- https://www.kolzchut.org.il/he/כל-זכות:תיאור_כללי
- https://kicky.co.il/blog/severance-pay-calculator/
- https://www.lawreviews.co.il/article/calculating-severance-pay
- https://www.gov.il/en/service/filing_a_small_claim
- https://agentskills.co.il/en/skills/legal-tech/israeli-small-claims-court
- https://supreme.court.gov.il/sites/en/Pages/FullSearch.aspx
- https://iscd.huji.ac.il/
- https://gidurim-delivery.co.il/
- https://practiceguides.chambers.com/practice-guides/litigation-2026/israel
- https://shalod.com/
- https://www.ask-lawyer.co.il/
- https://www.lexology.com/library/detail.aspx?g=695f243d-10cd-4501-80dc-cc515d75fe15
- https://www.nevo.co.il/law_html/law00/4427.htm
