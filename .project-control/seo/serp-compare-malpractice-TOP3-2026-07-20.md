# עורך דין רשלנות רפואית — full comparison vs the REAL top-3 (owner's SERP, 2026-07-20)

Corrected target set from the owner's live SERP screenshot (Tel-Aviv localized): **#1 m-adv.co.il (אלי מאור)**, **#2 caspisror.com (כספי סרור)**, **#3 assafodiz.co.il (אסף אודיז)**. Previous report compared ginzburgadv (WebSearch approximation — not on the owner's page 1); superseded by this file. Neutral-SERP ground truth still pending the SerpApi key.

## The measured signal matrix

| Signal | OURS | #1 m-adv | #2 caspisror | #3 odiz |
|---|---|---|---|---|
| Title | head phrase + task words | **niche-first** "רשלנות רפואית בלידה" + person brand | plural head + **"מעל 40 שנות ניסיון"** | head + **"97% הצלחה, אלפי תיקים"** + person |
| H1 | head phrase ✓ | head+person, **plus a second conversion H1: "רוצה לדעת עכשיו מהו הסיכוי שלך לקבלת פיצויים?"** | firm name | head phrase |
| Words | **5,979 (deepest)** | 3,567 | 1,778 | 1,968 |
| "רשלנות רפואית" count | 64 (~1.1%) | **106 (~3.0%)** | 60 (~3.4%) | 54 (~2.7%) |
| Exact "עורך דין רשלנות רפואית" | 5 → **12 after today's fold fix** | 13 | 0 (plural form) | 7 |
| Above-fold phrase hits (first ~1500 chars) | 5 | **20** | 12 | 1 |
| שנות ניסיון claims | 0 | 20/15 ×4 | **40 ×3, 20** | 20 |
| Success % / sums | 0 | — | "3 מיליון", 2×% | **"97%" in title**, ×10 הצלחה |
| AggregateRating schema | none | none | **yes** | **5(9)** |
| Person/Attorney schema | none | **none at all (#1 has zero schema!)** | Person ×2 | Person,Attorney |
| FAQPage schema | **13 Qs (best)** | none | 4 Qs | none |
| Cross-practice anchors on page | **46 (torts 8, criminal 6, family 6, RE 12, traffic 3, labor 5, inherit 6)** | **0** | ~1 | ~3 |
| Malpractice anchors | 22 | 33 | 18 | 20 |
| tel: links / forms | 3 / 2 | 1 / 0 | 5 / 4 | 6 / 2 |

## What actually decides this SERP (evidence-ranked)
1. **Topic isolation** — every winner runs a single-practice ecosystem (0-3 off-topic anchors). We inject 46 cross-practice anchors into the pillar via the mega-menu + topics bar. *The owner's hypothesis, confirmed by measurement.*
2. **Above-fold density + conversion question** — winners hammer the phrase and a "what are my chances" hook before the first scroll.
3. **Human trust numbers** — years, %, sums, ratings. All three carry them; we carried none.
4. Schema is NOT the decider (#1 ranks with zero schema). Our FAQ-13 is an edge to keep, after hygiene (dedupe FAQPage+WebSite, drop CollectionPage).
5. Depth is NOT our problem — we're the deepest page in the set.

## Executed today (rendered-verified)
- **Menu isolation shipped (theme)**: `site-header.php` now supports per-route scoped topics; the malpractice route declares a 7-spoke pure-malpractice bar (pillar, בלידה, בניתוח, שיניים, פיצויים, עלות, מומחים — all URLs verified 200). Cross-practice anchors on the pillar drop from 46 to near-zero at next pull. Same mechanism ready for the other routes.
- **Fold rebuild (live now)**: conversion H2 mirroring #1's second-H1 pattern ("מה הסיכוי של תביעת הרשלנות הרפואית שלכם? בדקו עכשיו, בחינם") + density paragraph with exact-phrase + מומלץ + city anchors (ת"א, חיפה) + real inventory numbers (39 guides). Exact-phrase rendered count: 5 → 12.
- Leak "כפילות SEO": confirmed dead server-side on desktop+mobile UA across all pillars (owner's sighting = browser service-worker cache; structural fix = neutralize SW HTML caching at ops v2.36).

## Parity queue (honest sources — never invented)
- **Trust numbers**: "עד 40 שנות ניסיון" via the indexed firms' real profiles; real judgment sums with case citations via the rulings pipeline (the PASF shows searchers know "2.6 מיליון" — find and cite the actual verdict); firm-strip with real years on the pillar.
- **AggregateRating**: only when the reviews-engine collects real reviews — never before.
- **Density completion**: 12 → ~14-16 via the trust block + אבחון-שגוי H2 (their 48 vs our 13) + פסיכיאטרית spoke (autocomplete demand, zero coverage).
- **Roll the method**: same matrix + isolation for divorce, criminal, real-estate, inheritance routes.
