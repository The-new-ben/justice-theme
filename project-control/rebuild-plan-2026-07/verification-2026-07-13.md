# Independent verification of the ChatGPT 5.6 disposition plan (2026-07-13)

Verified by Claude against the raw GSC exports, independently of the plan's
own M8 self-audit. Every check re-run from scratch in Python.

| Check | Claimed | Independently verified |
|---|---|---|
| Rows / action sum | 1,522 | 1,522 ✓ (144 KEEP-IMPROVE / 740 REBUILD / 37 MERGE / 601 NOINDEX / 0 PRUNE) |
| C2: NOINDEX on page with 16mo clicks>0 | 0 | 0 ✓ |
| C2: NOINDEX on page with 16mo impressions≥50 | 0 | 0 ✓ |
| NOINDEX bucket total equity | — | 0 clicks, 6,127 impressions/16mo = 0.14% of site impressions ✓ dead weight |
| C3: redirect chains / non-survivor targets | 0/0 | 0/0 ✓ (5 apparent misses were percent-encoding artifacts in MY check; resolve after URL-decode) |
| C6: duplicate survivor primary queries / titles | 0/0 | 0/0 ✓ across all 884 survivors (normalized incl. עו"ד variants) |
| Title/meta length + blanks | 0 | 0 ✓ |
| Waves >60 URLs | 0 | 0 ✓ (34 waves in D5; wave 1 = malpractice, 49 URLs) |
| Malpractice split | as specified | ✓ both KEEP-IMPROVE, wave 1, distinct primary queries, no cross-redirect |

Equity by action (16 months): KEEP-IMPROVE 9,146 clicks / 1.56M imp;
REBUILD 8,866 clicks / 2.65M imp; MERGE losers 88 clicks / 68k imp
(all conditioned on backlink-check); NOINDEX 0 clicks / 6.1k imp.

23 of 37 merge losers carry some equity — permitted as same-intent
duplicates per C2's exception; every rationale embeds the comparative
evidence and a pre-deploy backlink-check condition. Spot-read: all are
plainly legitimate (city doorways → pillar, -2/-3 duplicate posts, cost
duplicates → strongest cost page).

VERDICT: plan passes all ten constraints independently. Safe to submit for
owner approval. Nothing executes without it.

Execution gates (owner):
1. Approve the sheet (minimum review: top-100 queue + 37-row merge map).
2. Explicit "go wave 1" — includes the malpractice flagship move + 2022
   report restore previously frozen by owner instruction.
3. Supply: GSC Links "Top linked pages" export (target URLs), Maya's bar
   license number.


---

## v1.1 addendum (2026-07-13, after owner supplied GSC Top-target-pages export)

Backlink data (70 target URLs with external links) joined against the plan:

- 39 backlinked URLs → REBUILD, 19 → KEEP-IMPROVE: already protected. ✓
- 0 of the 37 merge losers carry known external links → all 37 redirects
  CONFIRMED deployable (backlink-check condition satisfied).
- **8 corrections applied** (D1-full-url-disposition-1522-v1.1.csv): seven
  NOINDEX pages with 54-56 external links each upgraded to survivors
  (penal-code guide → REBUILD; six court-ruling/case pages → KEEP-IMPROVE),
  plus /attorney-compensation-13590-07-17/ — the 301 landing of the site's
  strongest-linked URL (/psakdin/..., 65 links) — upgraded from NOINDEX.
- v1.1 histogram: 151 KEEP-IMPROVE / 741 REBUILD / 37 MERGE / 593 NOINDEX.
  892 survivors; uniqueness re-verified: 0 duplicate primary queries,
  0 duplicate titles.

## New wave-0 findings (outside the 1,522 inventory)

1. ~10 additional registered content post types exist (supreme_court, tort,
   labor_law, small_claims, corona_virus, goverment-gazette, yada_wiki,
   justice_term [84 published], justice_lawyer [20 published], product…).
   Legacy URL families in GSC: /psakdin/ (88 URLs, 1,602 clicks/16mo),
   /articles/ (452), /corona_virus/ (23), /practice-areas/ archives (43),
   Hebrew category archives, /city/, /lawyers/.
2. Sampled redirect integrity: /psakdin/… 301→ root article ✓;
   /practice-areas/criminal-law/ live 200 (54 external links — should become
   or feed the criminal cluster hub); /corona_virus/… **404 — equity leak**.
3. Wave 0 must therefore include: full status sweep of all ~1,400
   GSC-known non-inventory URLs → 301-map fixes for 404 families;
   disposition pass for justice_term (84) + justice_lawyer (20);
   confirm every legacy CPT family redirects into the surviving structure.
