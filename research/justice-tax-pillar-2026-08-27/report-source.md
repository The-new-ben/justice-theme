# Justice tax-cluster research source

Date: 2026-08-27
Geography: Israel
Decision audience: site owner, SEO/content lead, WordPress implementer, product team, future agents
Status: research complete; repository contract corrected; no Production change

## Answer first

Do **not** create `/real-estate-tax-advisor/` as the owner of the existing `tax`
cluster. The proposed URL does not exist, and its real-estate intent conflicts
with the cluster's actual international-tax, returning-resident and Tax
Authority content.

Use the existing `/tax-lawyer/` page as the broad `tax` owner. Treat Israeli
real-estate taxation as a distinct sub-cluster inside `real-estate`, led by an
expanded `/real-estate-tax-israel/`, with `/land-appreciation-tax/` as a
specialist spoke. Do not delete `/tax-lawyer-israel/` now: it has recent search
exposure and remains protected pending an intent split and post-change
measurement.

## Research question

The investigation tested four alternatives:

1. create the missing `/real-estate-tax-advisor/` page;
2. make the live `/tax-lawyer/` article the broad tax owner;
3. make the thin `/tax-lawyer-israel/` page the owner;
4. split broad tax-law intent from real-estate-tax intent.

The decision criterion was not word count. It combined actual search demand,
live URL state, cluster semantics, official legal-service workflows, current
SERP formats, trust requirements and the ability to lead users into a useful
Justice product journey.

## Local evidence and reconciliation

Source: exact read-only Search Console property `https://jus-tice.co.il/`,
requested 2025-04-25 through 2026-08-25, with Google-final data through
2026-08-23. The pull used the read-only Search Console scope and reconciled
94,175 query-page rows with zero direct-versus-daily metric differences.

The current architecture contains 11 commercial clusters and 102 mapped
spokes. Before this research, 10 of 11 configured owner URLs were live. The
missing owner was `/real-estate-tax-advisor/`.

### Corrected page-control evidence

| URL | Full clicks | Full impressions | Recent 90d impressions | Interpretation |
|---|---:|---:|---:|---|
| `/top-global-tax-cpa-firms/` | 41 | 12,663 | 911 | strongest recent page in the configured tax cluster; international/provider intent |
| `/israel-tax-authority/` | 17 | 10,815 | 535 | authority/navigation/representation intent |
| `/returning-resident-rights-determining-tax-rate/` | 11 | 12,171 | 108 | returning-resident intent |
| `/legal-tax-saving-guide/` | 10 | 1,408 | 0 | historical broad informational value; protected |
| `/top-international-tax-law-firms/` | 3 | 333 | 98 | international provider-discovery intent |
| `/tax-lawyer/` | 1 | 529 | 154 | live, indexable broad tax-law page; 10,116 words in public inventory |
| `/tax-lawyer-israel/` | 0 | 115 | 110 | live but thin, only 169 words; protected by recent exposure |
| `/land-appreciation-tax/` | 3 | 13,238 | 314 | distinct real-estate-tax intent; should not own broad international tax |
| `/real-estate-tax-israel/` | 0 | 0 | 0 | live, 165-word thin sub-pillar candidate; needs substantive expansion |

Search Analytics top-row data can omit anonymized queries, so page controls are
the authoritative page-level totals and query families are directional intent
evidence, not complete demand totals.

### Query-family evidence

Across the reviewed tax-related pages, mutually exclusive generic query-family
classification produced the following visible query-page evidence:

| Family | Query-page rows | Clicks | Impressions |
|---|---:|---:|---:|
| returning resident | 96 | 0 | 8,970 |
| real-estate tax | 166 | 0 | 6,912 |
| international tax | 25 | 3 | 3,892 |
| Tax Authority | 310 | 0 | 3,313 |
| tax professional | 10 | 0 | 402 |
| provider discovery | 12 | 0 | 84 |
| other demand on reviewed tax pages | 612 | 1 | 10,489 |

The categories are a reproducible regex classification, not a keyword-volume
tool. They prove that “tax” currently contains several materially different
jobs. They do not prove that one page should absorb every query.

## Data-quality defect found and fixed

The first migration inventory reported 0 clicks and 1 impression for
`/top-global-tax-cpa-firms/`, contradicting the 41-click/12,663-impression page
control. Search Console contained three fragment variants such as `#sec-4`.
The analysis normalized fragments to the document URL and then let the last
one-impression fragment overwrite the canonical row.

The analyzer now prefers the explicit fragment-free page control regardless of
input order and uses strongest evidence only for true duplicate canonical
rows. Three regression tests cover canonical-first, fragment-first and duplicate
canonical inputs. The full analysis and dependent architecture/410 outputs were
rebuilt. Six relevant tests pass, and the 410 output still marks zero URLs as
release-ready.

## Official legal and service evidence

- The governing law is the Real Estate Taxation (Appreciation and Purchase)
  Law, 1963; the Knesset's national legislation page shows the law as active and
  records amendments, including updates in 2026:
  https://main.knesset.gov.il/Activity/Legislation/Laws/pages/lawprimary.aspx?lawitemid=2001072
- The Tax Authority's transaction declaration service states that sellers and
  buyers file within 30 days, distinguishes forms 7000, 7000B and 7002, and says
  represented sellers file online through their lawyer:
  https://www.gov.il/he/service/real-estate-tax-7000
- Since 1 April 2025, unrepresented people can also file a real-estate
  transaction declaration online. This means the page must explain the value of
  professional review without falsely claiming a lawyer is always technically
  required:
  https://www.gov.il/he/service/corona-statment-of-real-estate-transaction
- A person disputing a purchase-tax or appreciation-tax assessment may file
  form 7013 within 30 days of receiving the assessment, subject to the official
  conditions:
  https://www.gov.il/he/service/real-estate-tax-7013
- The Tax Authority registers authorized accountants, tax advisers and lawyers
  as representatives for the tax systems described by its registration
  service. Role and permitted action must therefore be stated precisely rather
  than collapsing all professionals into “real-estate tax adviser”:
  https://www.gov.il/he/service/tax-representors-registration
- A Tax Authority position paper published on 26 July 2026 demonstrates that
  operative interpretation continues to change. Every legal/tax page needs a
  visible substantive-review date and source trail:
  https://www.gov.il/he/pages/procedures-260726-1

These sources support process statements, not individualized legal conclusions.
If the page and the law differ, the law governs. Current rates, thresholds and
temporary arrangements must be verified again at publication time.

## Current SERP sample

The sampled Hebrew SERPs are mixed:

- professional directories dominate provider discovery: Midrag combines an
  explanatory page with local lawyer selection; Mishpati and LawReviews expose
  lists, filters and contact actions;
- specialist firm pages emphasize pre-transaction planning, assessment,
  objections and direct contact;
- the strongest differentiated utility observed was an interactive purchase
  and appreciation-tax calculator with methodology, limitations, official
  sources and a professional-review CTA.

Reviewed examples:

- https://www.midrag.co.il/Content/Tip/12008
- https://www.mishpati.co.il/find-lawyer/taxation?lp=real-estate-taxation
- https://www.lawreviews.co.il/search/service/real-estate-tax-consulting
- https://ygoldlaw.co.il/real-estate-lawyer/tax/
- https://www.barkai-law.co.il/real-estate-tax-calculators/

This was a dated SERP sample, not a rank-tracking census. Rankings, local packs,
personalization and result features can change.

## Search-quality implications

Tax content can affect financial stability and is therefore a high-trust topic.
Google says trust is the most important E-E-A-T element, with stronger scrutiny
for YMYL subjects; it recommends clear authorship, demonstrated expertise,
original value and accurate sources:
https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Google also states that contextual internal links help people and Google
understand pages, and every important page should be linked from another
findable page:
https://developers.google.com/search/docs/crawling-indexing/links-crawlable

For AI search features, Google recommends non-commodity, expert-led content and
warns against creating separate pages for every query variation:
https://developers.google.com/search/docs/fundamentals/ai-optimization-guide

Therefore the correct advantage is not another generic 10,000-word rewrite.
It is a precise intent architecture plus original utility: decision tree,
document checklist, official-source ledger, preparation simulation and an
evidence-backed professional handoff.

## Decision matrix

| Alternative | Demand fit | Existing equity | Cannibalization risk | Product fit | Decision |
|---|---|---|---|---|---|
| create `/real-estate-tax-advisor/` | low for configured tax cluster | none | high | narrow | reject |
| `/tax-lawyer/` as broad owner | high | live, indexed, long-form, recent exposure | manageable after intent rewrite | strong | select |
| `/tax-lawyer-israel/` as owner | medium | recent exposure but extremely thin | high against `/tax-lawyer/` | medium | hold/repurpose |
| split broad tax from real-estate tax | highest | preserves both demand sets | lowest | strongest | select |

## Uncertainty and publication gates

1. Search Console does not contain lead quality, accepted matters, collected
   fees, margin or profit. Commercial priority is a hypothesis until CRM funnel
   data is connected.
2. Search query rows are incomplete because anonymized queries can be omitted.
3. A licensed Israeli tax-law expert must substantively review legal content,
   author/reviewer identity, process statements and any rates before Production.
4. No 301 or 410 follows from this research. `/tax-lawyer-israel/` and all pages
   with clicks or meaningful recent impressions remain protected.
5. Production content, navigation, schema, canonical, sitemap and deletion
   changes require a preview, QA evidence and explicit scoped approval.
