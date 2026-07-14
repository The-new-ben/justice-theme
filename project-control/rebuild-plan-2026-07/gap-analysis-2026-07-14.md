# Head-term gap analysis — 2026-07-14 (post pillar go-live)

Owner question: "we need to analyze the gap. There are more articles to be
supporting this... We must be first."

## Where the pillar stands right now

| Metric | Us (live) | Rank-2 heavyweight (rashlanut.co.il) | gn-law / caspisror |
|---|---|---|---|
| Words | 4,723 (verified only) | 6,289 | 1,676 / 1,723 |
| Case law with sums | 7 identified rulings, all verified | mentions, few sums | none |
| Statute quotes | 4 (זכויות החולה, התיישנות 15א, ראיות, נזיקין) | none | none |
| Tables | 13 | 0-1 | 0 |
| Embedded tool | claim checker + simulation link | none | none |
| FAQ | PAA-mirrored + US-PAA additions | none | short |
| E-E-A-T | bottom block, real reviewer (Ben) | strong (named lawyer, reviews, press) | weak |

We now beat 2 of the 3 head-term competitors on substance and all three on
scannable structure + tools. The remaining volume gap to rank-2 is ~1,600
words; the remaining CONTENT gaps (sections the SERP rewards that nobody in
IL covers well) are the expansion list below — that is how we pass 6,289
without padding, on the way to the 10k bar.

## Pillar expansion delta (run card authored: wave1-factory/run-card-pillar-expansion.md)

| # | New H2 | Evidence |
|---|---|---|
| A | אחריות בית חולים מול קופת חולים ומרפאה פרטית | US PAA "who can be sued"; no IL competitor covers; high commercial relevance (defendant selection) |
| B | תביעת עיזבון ותלויים במקרי פטירה | high-value cases; supports the two pesika spokes (U19/U20); corpus gap |
| C | התנהלות מול חברת הביטוח והצעות פשרה | US SERP settlement queries; IL corpus gap; matches "כמה מקבלים" intent |
| D | איך בוחרים עורך דין רשלנות רפואית (קריטריונים, שאלות, דגלים אדומים) | the rank-2 page's main differentiator; head-term intent IS lawyer selection |
| E | ישראל מול העולם בקצרה (נטל הוכחה, תקרות פיצוי) | rank-2 covers at length; we add a precision version |

Target: +4,000–5,500 verified words → ~9–10k total.

## Supporting-articles state (the "more articles" the owner wants)

- 30 spokes staged as WP drafts (raw-wave1-u01..u30, registry in
  wave1-spokes-staged/draft-registry.csv), gauntlet 30/30 green, attribution
  law applied, 179 TODO-VERIFYs awaiting the fact pass.
- Query coverage: 30/33 wave-1 queries have a spoke. The 3 without one are
  correct: the head term (= the pillar), the public-expenditure report (=
  the gate-locked account page, canonicalized to the pillar interim), and
  גרימת מוות ברשלנות חוק העונשין (criminal-cluster query — belongs to the
  criminal hub, decide at wave 2).
- Thinnest spokes = the court-decision reports (U19 334w, U20 368w, U11
  391w, U24, U08, U06). Their SERPs are precision SERPs (case summaries) —
  deepen via run-card batches 2-6 (money-core first), not via padding.
- Publish order per the wave plan: fact-verify TODO batches → owner
  approval → wave-atomic publish with internal wiring (each spoke links up
  to the pillar; pillar links down per section).

## Cannibalization sweep (owner: "nobody threatens it")

| URL | Owns | Verdict |
|---|---|---|
| /medical-malpractice-lawyer/ | the head term | pillar ✓ |
| /medical-malpractice-lawsuits-law-account/ | (2022 report) | canonicalized → pillar (interim) ✓ |
| /medical-malpractice-attorney/ | שכר טרחה sub-family | differentiated ✓ |
| /medical-malpractice-lawyers-law-medical-israel/ | "מובילים/דירוג" variant | differentiated ✓ (title has a duplicated fragment — polish later, not a cannibal) |

## Blocked item awaiting owner

The pillar's rendered `<title>`/meta-desc still show the old engine strings.
Fix (ops 2.18.2) is built, committed and zipped; production install was
classifier-blocked pending explicit owner approval. Until deployed, Google
sees the old (indexable, coherent) title — the CTR-optimized one lands with
the deploy. Details: pillar-golive-execution-record.md.
