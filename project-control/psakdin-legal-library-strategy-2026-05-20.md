# PsakDin Legal Library Strategy
Date: 2026-05-20
Status: COMPETITIVE INTELLIGENCE / IMPLEMENTATION ROADMAP

## Why This Matters

PsakDin's real strength is not only a lawyer directory. It is a legal information ecosystem:

- lawyer directory;
- court judgment search;
- magazine/news analysis;
- legal forms;
- forums;
- video/live content;
- polls;
- auxiliary legal-service providers;
- AI/case-law search entry point;
- topic/category navigation in every major footer/header path.

This is the model Jus-Tice should compete with over time: a legal portal that attracts users through useful free legal data and then converts the right demand into paid lawyer subscriptions, qualified leads and authority products.

## Access Status

The owner said a PsakDin account is logged in locally and shared a screenshot. In the browser available to Codex, the only visible PsakDin tab remained the login page. Earlier credential attempts returned a wrong username/password message. After the owner supplied an updated password, the browser automation could not type into the login fields because of a local input/clipboard limitation, so private account inspection remains blocked. No further guessing was attempted. No forms, profile edits, payments, messages or submissions were made.

This document therefore combines:

- public PsakDin section inspection;
- the owner's screenshot of the logged-in area;
- official/government source research for lawful content strategy.

## What PsakDin Is Doing Strategically

### 1. Court Decisions As Traffic Infrastructure

PsakDin's `/Court` page is a judgment search product. It includes:

- broad legal-topic navigation;
- contextual / AI search framing;
- search by case details;
- direct connection from judgments to legal topics and lawyer search.

Business lesson: judgments are not only content. They are an indexable data layer that can feed topic pages, article briefs, lawyer authority pages and user-intake flows.

### 2. Magazine As Digestible Interpretation

The magazine turns judgments and legal changes into readable stories by topic:

- family law;
- real estate;
- criminal;
- contracts;
- medical malpractice;
- wills/inheritance;
- labor law;
- more.

Business lesson: raw legal materials need an editorial layer. Users do not search only for case numbers; they search for problems in plain language.

### 3. Forms And Tools

The forms section makes PsakDin useful before a user is ready to hire a lawyer.

Business lesson: forms/checklists can capture high-intent users earlier, but must include clear "not legal advice" boundaries and routing to a lawyer when risk is high.

### 4. Forums As Long-Tail Demand Capture

The forum structure captures real user wording and long-tail questions. Even if Jus-Tice does not launch a public forum immediately, the lead/intake CRM should collect repeated questions and convert them into:

- FAQs;
- article briefs;
- practice-area pages;
- lawyer recruitment signals;
- lead-routing coverage gaps.

### 5. Providers Marketplace

PsakDin also lists legal-service providers: expert witnesses, engineers, private investigators, appraisers, accountants, translators, transcription providers and medical opinions.

Business lesson: Jus-Tice can eventually monetize adjacent legal services, not only lawyers. For now, document this as a later marketplace line, not a launch promise.

## Official Sources To Use Before Private/Commercial Sources

Do not scrape PsakDin content. Build from official sources and original editorial summaries.

### Judgments / Decisions

Primary public sources to review and source from:

- Israeli Judiciary public decisions and spokesperson releases: https://www.gov.il/he/Departments/DynamicCollectors/spokmanship_court
- Net HaMishpat is the official route for broader public court decisions, but access/terms and privacy constraints must be checked before automation.
- Freedom of Information case-law index: https://www.gov.il/he/Departments/DynamicCollectors/verdict-freedom-of-information

Safe first implementation: do not mass-import judgments. Start with a manually curated judgment index for one topic cluster, with source URL, court, date, case number, allowed-publication status and editorial summary.

### Legislation

Primary public sources:

- National Legislation Database / Knesset: https://www.gov.il/he/service/the_laws_of_the_state_of_israel_in_the_national_legislation_database
- Knesset reporting says raw legislation-database information is also published for public use through OData.
- Official Gazette / Reshumot references remain controlling if there is conflict with database pages.

Safe first implementation: create law reference pages that summarize and link to official sources. Do not claim the site hosts the controlling version of the law.

## Proposed Jus-Tice Architecture

### Content Types

Add a legal-library layer over time:

- `justice_case`: judgment/court decision reference;
- `justice_law`: law/section/reference page;
- `justice_form`: form/checklist/tool reference;
- `justice_legal_update`: short editorial update based on law/judgment changes;
- `justice_topic`: canonical problem/topic hub.

These can be implemented as CPTs later. The first step should be a planning schema and one proof-of-concept cluster, not a mass import.

### Required Metadata

Every case/law item should store:

- source type: judgment, law, regulation, form, government notice;
- official source URL;
- source date;
- court/body;
- case number / law name;
- allowed-publication status;
- privacy risk flag;
- topic/practice taxonomy;
- city/jurisdiction where relevant;
- editorial summary;
- legal-review status;
- connected lawyer/reviewer, only if verified;
- connected hub page;
- canonical policy: index, noindex, or source-only.

### User Journey

A user should be able to move:

1. From Google query to practical topic hub.
2. From topic hub to relevant law/judgment examples.
3. From example to plain-language explanation.
4. From explanation to checklist/form/intake.
5. From intake to matched lawyer or owner review.

### Lawyer Customer Journey

A paying lawyer should see:

- cases and legal updates connected to their field;
- content briefs generated from repeated user questions;
- authority assets connected to their profile;
- monthly "your field is active" report;
- opportunity to review/sign legal explainers after approval.

This directly supports Pro / Featured / Lead Partner / Full Service retention.

## Legal And SEO Guardrails

- Do not copy PsakDin's editorial text.
- Do not scrape competitor databases.
- Do not bulk-import sensitive family/minor/criminal details without privacy review.
- Do not publish full case texts unless source terms and privacy rules allow it.
- Prefer short editorial summaries + official source links at first.
- Use noindex for thin/source-only pages until they have unique value.
- Add legal/source review gates before public publication.
- Add "not legal advice" and source-date notices.
- Do not create duplicate pages for the same law/case/topic.

## MVP Recommendation

Start with one cluster: Family Law / Divorce.

Why:

- The owner already has Maya Rotenberg as a strong authority candidate.
- Justia analysis already supports a family/divorce law-center model.
- Family law has high user demand and commercial lawyer value.
- Privacy risk is high, so doing one careful cluster teaches the right process.

MVP deliverables:

1. `family-law-library-map-2026-05-20.csv`: target topics, source URLs, risk flags, connected pages.
2. `justice_case` data model spec, not yet public CPT.
3. 10 manually curated public-source case/law references.
4. One family-law hub section: "פסיקה וחקיקה רלוונטית" with no mass import.
5. Live checker for source links, noindex/index policy and internal links.

Initial source map created:

- `project-control/family-law-library-map-2026-05-20.csv`
- 10 official-source rows across divorce by consent, agreement approval, parenting time, divorce certificate, assistance units, rabbinical-court decisions, Sharia-court decisions, judiciary spokesperson decisions, National Legislation Database and a government case-law-index model.
- Every high-risk source is marked against mass import and requires privacy/legal review before public publication.

## Completion Assessment

- PsakDin public product understanding: 65%.
- Private PsakDin account understanding: blocked in Codex browser, 0%.
- Official source strategy: 45%.
- Legal-library implementation readiness: 35%.
- Actual legal-library product/code: 0%.
- Money impact today: strategic, not direct revenue. This gives Jus-Tice a durable SEO moat and a paid-lawyer authority product path.

## Next Safe Action

Create the first implementation ticket and owner-review packet for a Family Law legal-library MVP. Do not import or publish legal materials until source, privacy and legal-review gates are defined.
