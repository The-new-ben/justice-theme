# Jus-Tice.co.il SEO rebuild decision report

**Decision date:** 13 July 2026  
**Data window:** 20 March 2025–10 July 2026  
**Scope:** all 1,522 inventory URLs; 23,337 usable query×page rows; 2,799 page rows; 478 daily rows; live Hebrew SERP sampling; 43 external sources checked.

## D7 — Executive decision

Jus-Tice did not suffer a normal seasonal dip. Its daily Google impressions collapsed by **88.1%** and clicks by **78.2%** around the August 2025 spam rollout, with the best statistical break on **11 September 2025**. The most likely explanation is an algorithmic quality/spam reclassification of a large, highly overlapping, AI-assisted YMYL corpus—not a single technical outage. Continued weakness through April 2026 and only partial recovery after the May 2026 core update indicate that later systems repeatedly confirmed the underlying quality/architecture problem.

The recommended response is controlled consolidation and rebuilding, not mass deletion and not another mass rewrite:

- **144 KEEP-IMPROVE**, protecting pages with real equity or strategic roles.
- **740 REBUILD**, but only in gated topic waves with named-attorney review and primary-law sourcing.
- **37 MERGE** through direct permanent redirects to a surviving, same-intent owner.
- **601 NOINDEX**, retained for users where useful but removed from the indexed quality footprint.
- **0 PRUNE-410**. The supplied backlink exports list anchors or linking pages, not the destination URL receiving each link. A 410 cannot be authorized safely until target-level backlink data is available.

The plan retains **884 indexable survivors** across **17 operational clusters**: 13 practice/service clusters plus Portugal, international desks, legal-system reference, and a general-lawyer discovery hub. That is still a large footprint. “REBUILD” is a brief and quality commitment, not permission to republish 740 pages automatically; any page that cannot meet its wave’s usefulness and evidence bar should be downgraded to NOINDEX.

The first production wave is medical malpractice. The flagship service asset belongs on `/medical-malpractice-lawyer/`; the original 2022 public-expenditure report belongs on `/medical-malpractice-lawsuits-law-account/`. They must remain separate, self-canonical URLs because the intents and historical equity differ.

## D0 — Collapse diagnosis

### Measured break

| Measure | Baseline | Post-break | Change |
|---|---:|---:|---:|
| Window | 4–24 Aug 2025 | 22 Sep–12 Oct 2025 | — |
| Daily impressions | 36,653.0 | 4,357.8 | **−88.1%** |
| Daily clicks | 147.3 | 32.1 | **−78.2%** |
| Single-break geometric mean impressions | 31,368.9 pre-break | 4,705.7 post-break | **−85.0%** |

The structural-break search selected **11 September 2025**. This falls inside Google’s **26 August–22 September 2025 spam rollout**. Google’s official ranking history records that rollout as 26 days and 15 hours. It also records the later December 2025 core update and the March, May and June 2026 core/spam updates used as alignment markers. [Google Search Status Dashboard](https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history)

The reported average position improved while impressions disappeared. That is not evidence that rankings broadly improved: low-ranking long-tail exposures vanished first, leaving a smaller, better-positioned observed set. This is a selection effect.

### Update alignment and confidence

| Hypothesis | Confidence | Evidence for | Evidence against / limitation |
|---|---:|---|---|
| August 2025 spam/quality systems were the primary trigger | **95%** | Collapse begins during the official rollout; scale and abruptness match a classifier change; the corpus contains extensive thin/overlapping and AI-assisted legal content | Temporal alignment does not prove which individual spam system fired; no manual-action export was supplied |
| Fragmented topical ownership and scaled low-value pages amplified the loss | **85%** | 3,860 multi-URL query families; 601 low-signal pages; 1,211 articles; thin local/generic variants; 186 high-severity families | Search Console is capped at 25,000 query×page rows and therefore understates the tail |
| YMYL trust and editorial-evidence weaknesses reinforced later core-update losses | **80%** | Legal/medical advice requires high trust; many pages lack consistent attorney attribution, citations, metadata and clear purpose | The files do not contain rendered author boxes, citation blocks or complete page HTML, so on-page trust cannot be scored perfectly |
| A technical deindexing/crawl failure was the main cause | **15%** | Technical failures can create similarly steep drops | The site retained traffic and later partially recovered; the break aligns tightly with a spam update; no supplied evidence shows a sitewide robots/canonical outage |
| A manual action was the main cause | **10%** | Scale could resemble a manual penalty | No manual-action notice was supplied; partial update-aligned recovery is more consistent with algorithmic re-evaluation |

Google states that scaled content made primarily to manipulate rankings can violate spam policy regardless of whether it is produced by people, automation, or both; it also identifies substantially similar regional pages and pages that funnel users as doorway abuse. [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies) The corrective standard is not “remove AI,” but demonstrate an original purpose, accountable expertise, accuracy and substantial user value. [Google people-first content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [Google generative-AI guidance](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content)

### Later trajectory

- The December 2025 core update and March 2026 spam/core updates did not restore the previous baseline. That weakens any “temporary glitch” theory.
- The May 2026 core update coincides with a partial recovery. This is encouraging: the domain is not irrecoverably suppressed, and some changed signals may have been recognized.
- The June 2026 spam rollout did not return the site to its former level. Treat the recovery as permission to continue controlled remediation, not as proof that the job is done.
- Evaluate progress by query-owner stability, indexed footprint, protected-page performance and conversions—not by waiting for a single future update. Google’s own diagnostic guidance recommends separating technical, security, seasonality and algorithmic causes and using Search Console patterns rather than assuming one cause. [Debugging Search traffic drops](https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops)

## M1 — Data profile and limitations

| Item | Result |
|---|---:|
| Inventory URLs | 1,522 |
| Articles / pages / posts | 1,211 / 293 / 18 |
| Real-traffic tier | 103 |
| Low-traffic | 346 |
| Seen, not clicked | 416 |
| Negligible | 483 |
| Invisible in 90 days | 174 |
| Missing `practice_area` | 504 |
| Blank stored meta description | 1,453 |
| Yoast title overrides present | 315 |
| Inventory URLs without a matching 16-month page row | 142 |
| Duplicate normalized paths in page export | 16 |
| Median / maximum estimated words | 3,417 / 476,949 |

The high maximum word count and wide variance are warning signs, not direct penalties. Length alone does not establish usefulness. The query-page export is click-sorted and capped, so zero demand in that file is “not observed,” not proof of no demand. The live-SERP appendix is directional web-search sampling rather than a signed-out, geo-locked Google Israel rank export; domains are observed competitors, not an exact position-by-position archive.

## R1 — Live Hebrew SERP conclusions

The 15 required head queries were sampled on 13 July 2026. The row-level evidence is in `R1-live-serp-benchmark-15-queries.csv`.

Three repeatable patterns drive the plan:

1. **Hiring queries** such as `עורך דין רשלנות רפואית`, `עורך דין פלילי` and `עורך דין מקרקעין` are dominated by specialist firm/service pages and review directories. A generic long article is usually the wrong page type. The owner should begin with the exact head term, show named expertise and proof, explain the process, and provide a clear consultation path.
2. **Procedural queries** such as `מחיקת רישום פלילי`, `תעודת יושר`, `הסכם גירושין` and `צוואה` repeatedly surface gov.il, KolZchut and narrowly focused guides. These need concise eligibility, steps, documents, exceptions, official links and update ownership—not inflated word count.
3. **Document queries** such as `חוזה שכירות` reward usable templates/tools and clause-level explanations. A maintained legal artifact is a stronger differentiator than another generic guide.

Observed recurring competitors include gov.il, KolZchut, LawReviews, Rotenberg Law, Flanter, Ginsburg, Divorce1 and DOK. Their architecture and the corresponding Jus-Tice gaps are recorded in `R2-competitor-profiles.csv`.

## D1 — Full URL disposition

`D1-full-url-disposition-1522.csv` contains every inventory row and all requested additions: action, direct merge target, one unique primary query, up to five secondary queries, intent, cluster, role, priority wave, Hebrew title, Hebrew meta description and a ≤15-word data rationale.

### Decision rules

- **KEEP-IMPROVE:** strategic pillar/tool/trust page, meaningful recent clicks, or material historical equity. Preserve URL and intent; improve evidence, structure and conversion value.
- **REBUILD:** observed demand or protected equity exists, but the page requires a new brief, original value and accountable legal review.
- **MERGE:** same user intent and sufficiently duplicative content; move any unique value, then issue one direct permanent redirect to the final survivor. No redirect chains.
- **NOINDEX:** little or no demand/equity and insufficient unique index value. Keep accessible where it serves users; use a crawlable `noindex` and remove it from XML sitemaps and index-oriented internal links.
- **PRUNE-410:** blocked in this plan. Reconsider only after target-level backlink, conversion, legal-retention and historical-traffic checks.

Google recommends permanent server-side redirects when a URL has permanently moved. [Redirects and Google Search](https://developers.google.com/search/docs/crawling-indexing/301-redirects) A `noindex` instruction must remain crawlable to be seen; do not block these URLs in robots.txt before Google can process the directive. [Robots meta tag specifications](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)

## D2 — Site hierarchy and content gaps

The data resolves to **13 practice/service pillars** and four cross-practice hubs. Every surviving URL is assigned to one of the 17 operational clusters in `D2-site-hierarchy-survivors.csv`; `D2-cluster-summary.csv` gives exact cluster counts.

| Cluster group | Pillars / hubs |
|---|---|
| High-stakes service | medical malpractice, criminal, family/divorce, traffic, real estate, inheritance/wills, labor, torts/insurance |
| Specialist service | tax, debt/insolvency, commercial/civil, cyber/privacy, immigration/citizenship |
| Cross-border | Portugal desk, international desks |
| Reference/discovery | Israeli legal system, lawyer discovery |

Public navigation should expose the service and cross-border pillars. “Miscellaneous” is an operational holding cluster, not a public catch-all archive; its survivors must be reassigned to a real user journey before waves 30–34 ship.

The gap model found 24 candidate pages in `D2-new-page-gaps.csv`. The first four are live-SERP-supported medical-malpractice gaps where the capped GSC extract did not contain an exact observed row: limitation periods, compensation, disability/compensation and dental malpractice. The remaining candidates have observed GSC-family demand, including `חיפוש עורך דין לפי שם` (6,013 impressions/30 clicks), `עורך דין לעסקים קטנים` (2,024/9), `איך להתכונן לגירושין` (1,368/0), `העברת משמורת מאם לאב` (1,291/0), `העלמת מס חוק העונשין` (1,176/0) and `הסכם ירושה בין אחים` (1,060/0).

Do not create a gap page solely because it appears in the list. It must pass a final live-SERP intent check, have a distinct owner, and offer a materially better tool, decision framework, primary-source explanation or practitioner contribution than the existing cluster.

## D3 — Cannibalization resolution

The normalized Hebrew-family model found **3,860 query families with at least two URLs receiving impressions**; **186** meet the high-severity rule. The full family table and URL detail are in `D3-cannibalization-families.csv` and `D3-cannibalization-url-detail.csv`.

Winner selection prefers the surviving URL deliberately assigned to own the normalized family. If no explicit owner exists, legacy performance and title/intent alignment are used. Each loser receives one of three resolutions: direct merge/301, NOINDEX, or differentiation to its unique primary query. A high-severity flag identifies close impression share and ranking proximity; it is a triage signal, not automatic redirect permission.

### Mandatory medical-malpractice split

| URL | Final role | Primary query | Action |
|---|---|---|---|
| `/medical-malpractice-lawyer/` | flagship hiring pillar with the checker and ~15k-word evidence-led asset | `עורך דין רשלנות רפואית` | KEEP-IMPROVE; self-canonical |
| `/medical-malpractice-lawsuits-law-account/` | restored 2022 inter-ministerial public-expenditure report | `דוח הוצאה ציבורית בתביעות רשלנות רפואית` | KEEP-IMPROVE; self-canonical |

There is **no redirect between these two URLs**. Move the new flagship content to the pillar and restore the historical report on its existing report URL. The report title is `תביעות רשלנות רפואית וההוצאה הציבורית | דוח 2022`; the pillar title is `עורך דין רשלנות רפואית | תביעה, פיצויים ובדיקת עילה`.

The explicit same-intent medical redirects are:

- `/surgical-errors-medical-malpractice/` → `/medical-malpractice-surgery/`
- `/medical-malpractice-7583/` → `/medical-malpractice-israel-medical/`
- `/medical-malpractice-8269/` → `/what-is-medical-malpractice-definition-examples/`
- `/medical-malpractice-lawyer-recommended/` → `/medical-malpractice-lawyer/`

All 37 redirects require a target-level backlink check before deployment, a unique-content transfer check, and a direct final target. The audit found zero chains and zero merge targets that are themselves non-survivors.

## D4 — Title governance

### Role formulas

| Role | Formula | Example |
|---|---|---|
| Pillar | `[exact head term] \| [three differentiating scopes]` | `עורך דין פלילי | ייעוץ בחקירה, מעצר וייצוג` |
| Cluster guide | `[specific query]: [decision, process or outcome]` | `מחיקת רישום פלילי: תנאים, הליך ועלות` |
| Tool/template | `[artifact] \| [use/action/version]` | `חוזה שכירות סטנדרטי | מילוי והורדה` |
| Fees | `[service] מחיר \| [what is included]` | `עורך דין פלילי מחיר | שכר טרחה ומה כלול` |
| Case/support | `[court/case]: [rule or outcome]` | preserve identifying legal facts; do not retarget to a service head term |
| Local | `[service] ב[place] \| [real local proof]` | publish only with genuine location-specific evidence; otherwise consolidate/noindex |
| Trust/about | `[attorney/person] \| [licensed role and differentiator]` | brand may appear if it improves identification |

### Rules

- One normalized head family per indexable URL. `עו״ד`/`עורך דין`, singular/plural, years, punctuation and common Hebrew prefixes are normalized for uniqueness.
- Put the exact user phrase first when it reads naturally. Do not repeat the head term or append generic superlatives.
- Keep proposed titles at **≤60 characters** as a governance threshold, while recognizing Google truncates by rendered width and can generate title links from several page signals.
- Add a brand suffix only to the home page, trust pages, or where it fits without displacing intent. Do not append `| Jus-Tice` mechanically to every page.
- Use a year only when the answer is genuinely versioned and revalidated: prices, statutory thresholds, annual statistics, regulatory changes or maintained templates. Do not use a year on durable service/definition pages or inject the current year at render time.
- Align `<title>`, H1, visible page purpose, anchor text and primary query. Google can rewrite titles that are inaccurate, boilerplate, obsolete or inconsistent with the page. [Google title-link guidance](https://developers.google.com/search/docs/appearance/title-link)

The machine audit covers all **884** KEEP-IMPROVE/REBUILD pages, not only the top 300: zero duplicate normalized primary queries, zero duplicate normalized proposed titles, zero titles over 60 characters, zero metas over 155 characters, and zero blank survivor titles/metas.

## D5 — Execution waves

There are **34 waves**, each capped at 60 URLs. The detailed counts are in `D5-execution-waves.csv`, and every URL’s wave is in D1.

| Waves | Scope |
|---|---|
| 1 | medical malpractice (49 URLs) |
| 2–6 | criminal |
| 7–12 | family/divorce |
| 13–15 | real estate |
| 16 | traffic |
| 17 | inheritance/wills |
| 18–19 | torts/insurance |
| 20–29 | labor, Portugal, immigration, debt, commercial, tax, cyber, legal system, international |
| 30–34 | miscellaneous holding queue; reassign before production |

### Wave 1 production brief

1. Snapshot titles, canonicals, index status, internal links, conversions and GSC page/query baselines.
2. Restore the 2022 report and move the flagship asset to the malpractice pillar without cross-redirecting them.
3. Publish the four approved direct redirects after backlink/unique-content checks.
4. Rebuild the 25 designated pages; add named-attorney review, Israeli primary-law/official sources, last substantive review date, correction ownership and clear medical-vs-legal boundaries.
5. Noindex the 18 designated low-value pages while leaving them crawlable until the directive is processed.
6. Link pillar → definition/proof → limitation → damages → procedure → condition-specific pages → consultation. Support pages link back to exactly one parent intent owner.
7. QA the checker for legal disclaimers, false reassurance, data collection, privacy, accessibility, mobile behavior, analytics and escalation to a lawyer.

### Entry and exit gates

**Entry:** previous wave technically stable for 21 days; final content/redirect/backlink/legal review complete; staging crawl shows intended status, canonical, sitemap and links; baseline annotations saved.

**Exit:** no new coverage/canonical/redirect errors; designated winners indexed; winner impressions stable or increasing; no protected page suffers an unexplained >20% click/impression decline against its pre-wave comparison; conversion and engagement instrumentation works.

Proceed after technical stability rather than waiting for full ranking recovery, which may take longer and may coincide with unrelated updates. Roll back only a demonstrable technical, redirect, title or content error—not ordinary short-term ranking volatility. Never roll back by recreating a duplicate URL.

## D6 — Risks, dissent and stop conditions

1. **Mass synthetic rewriting:** publishing hundreds of formulaic rewrites could reproduce the original scaled-content risk. Stop if page briefs lack unique user value or attorney contribution.
2. **YMYL legal accuracy:** outdated statutes, procedure or medical-legal assertions can harm users. Every rebuilt legal/medical page needs a named accountable reviewer and primary sources.
3. **Wrong-intent redirects:** traffic similarity is not enough. Redirect only same-intent pages after unique-content and backlink checks.
4. **Unknown backlink targets:** the supplied link files cannot show which Jus-Tice URL earned a link. This is why the plan authorizes no 410s.
5. **Local doorway risk:** city pages without genuine offices, cases, courts, service differences or local proof should be merged or noindexed, not rewritten with place-name substitution.
6. **Internal-link graph break:** removing index-oriented links at scale can orphan survivors. Every wave needs a before/after graph and crawl-depth check.
7. **Title churn:** changing title, H1, content, URL and internal anchors simultaneously obscures causality. Preserve URLs for survivors and annotate every release.
8. **Noindex implementation failure:** blocking first in robots.txt can prevent processing. Keep the URL crawlable until Google observes `noindex`.
9. **Flagship/report collision:** overwriting or redirecting the historical malpractice report into the service pillar would destroy a distinct intent and asset.
10. **Measurement confounding:** core/spam updates, holidays and legal news can distort 21-day comparisons. Use query/page cohorts, not sitewide totals alone.
11. **Over-retention:** 884 survivors may still be too many for the site’s demonstrated editorial capacity. A REBUILD page that fails its brief should become NOINDEX.
12. **Under-pruning pressure:** zero 410s is deliberate, not indecision. Destructive deletion without destination-level link and conversion evidence is not defensible.

### Dissent from simplistic recovery advice

- I disagree with “delete everything with zero clicks.” The GSC query export is capped; some pages have impressions, links, legal retention value or support roles. Consolidation/noindex is safer until target-level evidence exists.
- I disagree with “refresh every page with the current year.” It creates stale-looking titles and encourages superficial churn. Use years only for genuinely versioned facts.
- I disagree with “more words equals more authority.” The corpus already has a 10,000-word mean and extreme outliers. Useful structure, primary evidence, accountable expertise and distinct intent are the constraint.
- I disagree that exact per-URL certainty is possible from these exports. The plan is decisive, but confidence is lower where query data are capped, backlinks lack target URLs, conversion data are absent, or rendered content was not crawled.
- I agree with consolidation over deletion, but not with shipping 884 rewritten survivors on a calendar. Wave gates must be allowed to reduce the final indexed count.

## D8 — Research record

The source log contains **43 checked sources**, **38 relied upon**, including **25 practitioner sources** and 13 official sources. Practitioner research is **65.8%** of relied-on sources. The complete record, status and use are in `D8-sources-checked-and-used.csv`; the mix audit is in `D8-source-mix-audit.csv`.

Research included Google’s ranking history and policy/documentation, update analyses from Marie Haynes, GSQi, Amsive and SISTRIX, consolidation/pruning case studies from Ahrefs, Inflow and Seer, title experiments and studies from SearchPilot and Zyppy, YMYL/E-E-A-T practitioner work from Marie Haynes and iPullRank, and recovery case analysis from Search Engine Land. Community anecdotes were checked but marked “not relied” where they lacked verifiable controls.

## M8 — Machine audit

| Check | Result |
|---|---:|
| Inventory rows = action rows | 1,522 = 1,522 |
| C2 destructive-action protection violations | 0 |
| Merge target is a non-survivor | 0 |
| Redirect chains | 0 |
| Duplicate survivor primary-query families | 0 |
| Duplicate survivor title families | 0 |
| Titles >60 characters | 0 |
| Metas >155 characters | 0 |
| Blank survivor titles / metas | 0 / 0 |
| Rationales >15 words | 0 |
| Waves >60 URLs | 0 |
| PRUNE-410 actions | 0 |

## File manifest

- `D1-full-url-disposition-1522.csv` — complete per-URL plan
- `top-100-priority-urls.csv` — review queue
- `D2-site-hierarchy-survivors.csv` and `D2-cluster-summary.csv` — architecture
- `D2-new-page-gaps.csv` — gap candidates
- `D3-cannibalization-families.csv` and `D3-cannibalization-url-detail.csv` — all multi-URL families
- `D5-execution-waves.csv` — wave summary
- `R1-live-serp-benchmark-15-queries.csv` — required SERP seeds
- `R2-competitor-profiles.csv` — eight recurring competitors
- `D8-sources-checked-and-used.csv` and `D8-source-mix-audit.csv` — research audit
- `D0-daily-with-7d-rolling.csv` and `D0-collapse-statistics.json` — collapse model
- `M1-data-profile.json` and `M8-machine-audit.json` — data/audit outputs

The rebuild generator is preserved as `build_seo_plan.py`; the research appendix generator is `build_research_appendices.py`.
