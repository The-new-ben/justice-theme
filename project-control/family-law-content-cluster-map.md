# Family Law Content Cluster Map
Date: 2026-05-10

## VERIFIED
- The first family-law repo draft set exists under `content-drafts/`.
- The cluster is built around one commercial pillar URL and five supporting URLs.
- Maya Rotenberg is the only verified lawyer/client to connect to this cluster.
- All six first-cluster drafts are now long-form repo drafts.
- All six first-cluster drafts have source-audit files.

## Cluster Readiness Snapshot
| URL | Words | Draft Status | Source Audit | Publication Status |
|---|---:|---|---|---|
| `/divorce-lawyer/` | 5,083 | DRAFT_5000_WORD_CLASS_SOURCE_AUDITED | `divorce-pillar-source-audit.csv` | BLOCKED: legal review + browser source verification |
| `/consensual-divorce/` | 3,518 | DRAFT_3500_WORD_CLASS_SOURCE_AUDITED | `consensual-divorce-source-audit.csv` | BLOCKED: legal review + browser source verification |
| `/divorce-mediation/` | 3,525 | DRAFT_3500_WORD_CLASS_SOURCE_AUDITED | `divorce-mediation-source-audit.csv` | BLOCKED: legal review + browser source verification |
| `/child-support/` | 5,019 | DRAFT_5000_WORD_CLASS_SOURCE_AUDITED | `child-support-source-audit.csv` | BLOCKED: legal review + browser source verification |
| `/child-custody/` | 4,575 | DRAFT_4500_WORD_CLASS_SOURCE_AUDITED | `child-custody-source-audit.csv` | BLOCKED: legal review + browser source verification |
| `/divorce-property-division/` | 4,553 | DRAFT_4500_WORD_CLASS_SOURCE_AUDITED | `property-division-source-audit.csv` | BLOCKED: legal review + browser source verification |

## Primary Pillar
- URL: `/divorce-lawyer/`
- Hebrew title: עורך דין גירושין
- Job: commercial/informational pillar for people deciding whether and how to hire a divorce/family lawyer.
- Connected lawyer: `/lawyers/advocate-maya-rotenberg/`
- Draft: `content-drafts/divorce-lawyer-pillar-he.md`

## Supporting Pages
| URL | Draft | Intent | Must Link To |
|---|---|---|---|
| `/consensual-divorce/` | `consensual-divorce-supporting-he.md` | User wants lower-conflict agreement path | `/divorce-lawyer/`, `/lawyers/advocate-maya-rotenberg/`, `/divorce-mediation/` |
| `/divorce-mediation/` | `divorce-mediation-supporting-he.md` | User compares mediation vs lawyer/litigation | `/divorce-lawyer/`, `/consensual-divorce/`, `/lawyers/advocate-maya-rotenberg/` |
| `/child-support/` | `child-support-supporting-he.md` | User needs support calculation/process guidance | `/divorce-lawyer/`, `/child-custody/`, `/lawyers/advocate-maya-rotenberg/` |
| `/child-custody/` | `child-custody-supporting-he.md` | User needs parenting/time-sharing guidance | `/divorce-lawyer/`, `/child-support/`, `/lawyers/advocate-maya-rotenberg/` |
| `/divorce-property-division/` | `divorce-property-division-supporting-he.md` | User needs property/assets/debt framework | `/divorce-lawyer/`, `/consensual-divorce/`, `/lawyers/advocate-maya-rotenberg/` |

## Anti-Cannibalization Rules
- `/divorce-lawyer/` owns the keyword "עורך דין גירושין" and lawyer-hiring intent.
- `/consensual-divorce/` owns agreement/low-conflict divorce intent.
- `/divorce-mediation/` owns mediation/comparison intent.
- `/child-support/` owns support/payment/calculation intent.
- `/child-custody/` owns public "משמורת ילדים" demand but should educate toward "זמני שהות" and "אחריות הורית".
- `/divorce-property-division/` owns assets/property/pension/debt division intent.
- None of the supporting pages should present itself as the main "עורך דין גירושין" page.
- Every supporting page should include one contextual CTA back to the pillar and one factual Maya mini-site block.

## CMS Import Path
- Admin path: `Tools > Jus-Tice Content Drafts`
- Import behavior: draft-only `articles` CPT posts.
- Safety: published articles are not refreshed automatically.
- Editorial status after import: `needs_legal_review = 1`.

## Publication Gate
Do not publish until:
- Hebrew text is reviewed by a lawyer.
- Sources are confirmed and linked.
- Internal links are verified.
- Breadcrumbs and English slugs are verified.
- No duplicate H1/title exists.
- Maya profile block pulls from CMS and does not make unverified claims.
- Lead form/source tracking works.

## Import Order
1. Import `/divorce-lawyer/` as draft only.
2. Import `/consensual-divorce/` as draft only.
3. Import `/divorce-mediation/` as draft only.
4. Import `/child-support/` as draft only.
5. Import `/child-custody/` as draft only.
6. Import `/divorce-property-division/` as draft only.

## BLOCKED Before Publication
- NOT VERIFIED: Maya/legal review of all six drafts.
- NOT VERIFIED: browser verification for gov.il sources that block scripted checks.
- NOT VERIFIED: live CMS import via `Tools > Jus-Tice Content Drafts`.
- NOT VERIFIED: live internal links and breadcrumbs after import.
- NOT VERIFIED: live Maya Rotenberg profile slug `/lawyers/advocate-maya-rotenberg/`.
- NOT VERIFIED: GSC data for traffic-risk and cannibalization.

## Next Drafts After This Cluster
- `/family-dispute-resolution/`
- `/ketubah-divorce/`
- `/prenuptial-agreement/`
- `/family-lawyer/`
