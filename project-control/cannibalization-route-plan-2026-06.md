# Cannibalization route plan + pillar briefs

Date: 2026-06-12. Source: live GSC per-query check (last 6 months) run 2026-06-12.
Standing rule honored: NO redirects executed without per-URL owner approval.

## What was executed now (safe, render-layer)

1. Overlapping pages added to the cluster map as SPOKES of their hub, so they link
   into the pillar instead of fighting it (breadcrumb + bottom guide block):
   - criminal: best-criminal-defence-lawyers-worldwide, top-criminal-lawyer-tel-aviv,
     criminal-defenses (joining famous-criminal-defense-lawyer, lawyer-near-me-criminal-law
     already mapped).
   - family: lawyer-divorce-israel, lawyer-divorce-guide-proceedings-costs-rights,
     the-recommended-family-lawyers.
2. Pilot pillar body written: content-drafts/criminal-defense-attorney-pillar.md
   (~4,000 words, statute-cited, FAQ from real queries). Import via Tools > Jus-Tice
   Content Drafts, legal-review, paste into the PAGE /criminal-defense-attorney/.

## Awaiting owner per-URL decisions (the 301 list)

| URL | GSC signal | Recommendation |
|---|---|---|
| /עורך-דין-פלילי-מפורסם-עוד-פלילי-מפורסם-בישראל/ | 91% of "עורך דין פלילי" imp, pos 58 | KEEP for now (it carries the family's only visibility). After the new pillar body is live 30 days and the pillar overtakes it, 301 to /criminal-defense-attorney/ |
| /משרד-עורכי-דין-פלילי-הכי-טוב-תל-אביב/ | 85% of "עורך דין פלילי בתל אביב" | Retitle to factual language (remove "הכי טוב" trust-claim risk) + link into pillar; 301 into /top-criminal-lawyer-tel-aviv/ later if both stagnate |
| /criminal-law-counsel-criminal-israel/ | 6 imp, pos 99 | 301 to /criminal-defense-attorney/ (no value lost) |
| /עוד-גירושין-מומלץ-כיצד-למצוא-עורך-דין-גירושין-וכמה-עולה-להתגרש/ | 39% of "עורך דין גירושין" | KEEP; after divorce pillar refresh, 301 into /divorce-lawyer/ |
| Maya profile slash/no-slash duplication | impressions split across 2 URL forms | Fix: enforce trailing-slash canonical on justice_lawyer permalinks (tiny theme/canonical patch, no URL change) |
| /how-much-does-a-lawyer-cost/ (404, 17.5k imp) | dead with history | RESTORE as cost hub page or 301 to /how-much-will-a-criminal-defense-lawyer-cost/ |
| /what-is-child-custody/ (404, 10.8k imp) | dead with history | RESTORE (family spoke) or 301 to /child-custody-modification/ |
| /leading-criminal-law-firm/ (404, 10.6k imp) | dead with history | RESTORE or 301 to /criminal-defense-attorney/ |
| /legal-tax-saving-guide/ (404) | dead | 301 to /returning-resident-rights-determining-tax-rate/ or drop |

## Briefs for the remaining thin pillars (owner writes or approves AI-draft per the criminal pilot)

### /medical-malpractice-lawyer/ (222 words vs 39k imp)
H2 skeleton from GSC demand: מהי רשלנות רפואית (יסודות: חריגה מסטנדרט, נזק, קשר סיבתי) /
רשלנות בלידה (highest demand: עורך דין רשלנות רפואית בלידה 8.2k imp) / רשלנות באבחון /
רשלנות בניתוח והרדמה / איך בודקים תיק: חוות דעת מומחה / התיישנות (7 שנים, חריגי קטינים) /
כמה עולה ושיטת אחוזים / שאלות נפוצות. Spokes to link: anesthesia-medical-malpractice,
what-is-medical-malpractice-definition-examples, cerebral-palsy, malpractice-cerebral-palsy,
medical-malpractice-common-errors-doctors-hospitals.

### /inheritance-lawyer/ (211 words)
H2 skeleton: מתי צריך עורך דין ירושה / צו ירושה מול צו קיום צוואה / התנגדות לצוואה (עילות) /
ירושה על פי דין: סדר היורשים / עיזבון וניהולו / ירושה בינלאומית / שאלות נפוצות.
Spokes: what-is-a-probate-order, inheritance-order, will-and-testament, will-probate-objection,
revocation-of-a-will-and-reviving-previous-will, international-inheritance-wills-lawyer,
maximize-an-inheritance.

### /labor-lawyer/ (757 words, structure weak)
H2 skeleton: מתי פונים לעורך דין דיני עבודה / פיטורים ושימוע / זכויות בסיום העסקה
(פיצויים, הודעה מוקדמת) / שכר ושעות נוספות / הטרדה ואפליה / יחסי עובד-מעסיק והעסקה קבלנית /
שאלות נפוצות. Spokes: employment-contract, employer-worker-relationship, israeli-labor-law,
lawyer-fee-outlook. Note: /israeli-labor-law/ wins "דיני עבודה" (730 imp, 100%) but has only
28 words; it needs its own body next.

## Measurement

Re-run tools/gsc comparison at +14 and +30 days after each step ships. Success =
pillar overtakes its cannibalizing siblings on the head query, family CTR rises.
