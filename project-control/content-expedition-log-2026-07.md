# Content expedition log, July 2026

One line per shipped unit. Newest at the bottom. Every entry was
live-verified on the rendered page before logging (owner law).

## 2026-07-06: homepage upper fold, keyword-first rebuild

- Homepage title, H1, hero lead, and 11 exact-match practice-area links
  rebuilt on the din/psakdin/mishpati keyword pattern. Section order:
  practice areas, money hubs, how-to-choose guide, guides tabs float
  up; AI sections down; map unchanged. Theme 2.23.0, marker
  2026-07-06-home-keywords-upperfold-v1. Pushed to main, AWAITING
  OWNER PULL in uPress, then live-verify.

## 2026-07-06: same-slug consolidation sweep (the collision disease)

Method proven on the criminal pillar, then applied site-wide. A full
slug scan across post types (279 pages, 1,218 articles, 10 posts)
found 12 URLs where a page and an articles post shared one slug.
WordPress rendered BOTH bodies stacked on 8 of them (two H1s, two
entry-content blocks, duplicated intent on one URL), including a DRAFT
body visible to anonymous visitors on the criminal pillar.

Treatment: page keeps the URL. Where bodies were stacked, the article
body was appended into the page as a titled H2 section (Google keeps
seeing the same content it already indexed, minus the duplication),
then the article was re-slugged to {slug}-merged-src-2026 and drafted
(reversible, kept as merge source). Where the article was an invisible
shadow, it was hidden the same way with zero visible change.

| URL | page kept | article hidden | action |
|---|---|---|---|
| /criminal-defense-attorney/ | 20211 | 857 (legacy 2019 guide) | shadow hidden |
| /anesthesia-medical-malpractice/ | 20227 | 11560 | merged + hidden |
| /birth-injury/ | 20225 | 11497 | merged + hidden |
| /criminal-record-deletion/ | 20244 | 19259 | merged + hidden |
| /lawyer-divorce-guide-proceedings-costs-rights/ | 20212 | 11813 | merged + hidden |
| /medical-malpractice-surgery/ | 20297 | 8565 | merged + hidden |
| /police-investigation-rights/ | 20245 | 19269 | merged + hidden |
| /surgical-errors-medical-malpractice/ | 20226 | 11558 | merged + hidden |
| /child-support/ | 19213 | 7256 (432K chars, merge source for entry 37) | shadow hidden |
| /divorce-mediation/ | 19212 | 8236 | shadow hidden |
| /family-law/ | 20305 (2K STUB, needs body) | 7310 (141K, merge source) | shadow hidden, stub flagged |
| /medical-malpractice-lawyer/ | 19193 | 11607 (150K, merge source for entry 26) | shadow hidden |

Live-verify 2026-07-06: all 12 URLs HTTP 200, exactly one H1, exactly
one entry-content, zero draft leakage, content weight preserved.

## 2026-07-06: criminal head-term redirect equity fix

The legacy URL /עורך-דין-פלילי-מפורסם.../ (91% of the family head-term
impressions per the 2026-06-12 GSC analysis) was 301ing into
/criminal-law-counsel-criminal-israel/ (6 impressions, position 99), a
dead end. Redirection rule 1080 retargeted to
/criminal-defense-attorney/ and verified live. Theme map
inc/url-redirects.php updated to match.

## 2026-07-06: housekeeping

- Junk drafts trashed (reversible): 20071 "בדיקה" test page, 6495
  superlative-title draft.
- Publish pipeline re-proven: REST draft create + delete (post 21055).

## Staged, needs one owner reply

- 301 /criminal-law-counsel-criminal-israel/ into the pillar (June
  plan: "no value lost"). Standing rule requires per-URL approval.
- /buying-property-abroad-guide/ pillar is a 404 on live but exists in
  the cluster map; needs building (expedition Family 7).
- /family-law/ page is a 2K stub; the 141K hidden article 7310 is the
  merge source for a proper body.
- Homepage meta description lives in the SEO plugin settings (DB), can
  be rewritten to the keyword pattern on request.

## 2026-07-06 (afternoon): deep structural scan + fixes

- Homepage keyword upper fold LIVE-VERIFIED after owner pull (theme
  2.23.0): new title, new H1, practice link row, old H1 absent.
- GSC query+page pull (28d, 10,670 rows): 115 cannibalized queries
  mapped. Full doctrine: intent-architecture-map-2026-07.md.
- 45 two-hop redirect chains flattened via Redirection API (751 rules
  audited, zero loops).
- Draft slug shadow on /real-estate-lawyer-guide/ (33K impr page)
  re-slugged before it could collide (article 19197).
- Duplicate-intent pair found: employment-sexual-harassment vs
  sexual-harassment-work (entry 51 corrected to consolidate).
- Prevention shipped: inc/slug-collision-guard.php (cross-type slug
  uniqueness). Needs owner pull to activate.
- Verified clean: zero exact duplicate titles (1,486 objects), sitemap
  hygiene, 404-blanket plugin inactive, /articles/ prefix layer
  self-healing via correct 301s+canonicals.
