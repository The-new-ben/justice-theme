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

## 2026-07-06 (evening): Phase 1 title de-cannibalization EXECUTED (repo session)

Cowork hit a browser wall on the heavy editors; routed to REST per its
own recommendation. Two temp-route one-shots (created, fired, deleted,
404-confirmed): #1 set _yoast_wpseo_title + _yoast_wpseo_focuskw on all
12 targets; #2 set the theme's own seo_title meta on the 4 page-type
targets after discovering the render chain. All 12 LIVE-VERIFIED:

- Spec titles now rendering: lawyer-near-me-criminal-law,
  best-criminal-defence-lawyers-worldwide (superlative REMOVED),
  consensual-divorce, divorce-lawyer-cost, lawyer-fees-guide,
  women-lawyer-vs-men-divorce-lawyer, immigration-to-portugal,
  birth-injury (double collision resolved), posta.
- Kept as intent-correct theme-map titles (already aligned):
  real-estate-lawyer-cost-2025, online-rent-agreement,
  types-of-lawyers-small-business.
- Old values captured in one-shot responses for revert.

TITLE RENDER CHAIN (for future sessions): pages read the theme meta
seo_title first; articles read the theme money/year maps first, then
Yoast meta; Yoast indexables cache needs a touch-save after direct
meta writes. Yoast meta alone does NOT move page-type titles here.

## 2026-07-06 (evening): Phase 2 merges EXECUTED (repo session, owner approved)

All three intent merges done via REST, live-verified (keeper renders
one H1 + absorbed section; loser 301s to keeper; old content hidden
reversibly as draft {slug}-merged-src-2026):
- most-recommended-family-lawyer (13152) merged INTO
  the-recommended-family-lawyers (12897); 301 rule 1598. The מומלץ
  family intent has ONE page now.
- medical-malpractice-lawyer-birth-representation (11952) merged INTO
  medical-malpractice-lawyer-birth-recommended (11834); 301 rule 1599;
  inbound rule 912 retargeted to the keeper (no chain). Replaces
  expedition entry 29.
- employment-sexual-harassment (20462, 2.8K) merged INTO
  sexual-harassment-work (20293, 7.3K, keeper by content weight; both
  had zero GSC impressions); 301 rule 1600. Replaces entry 51.

Cowork is now on Phase 3 only: gap articles per the round-2 order.

## 2026-07-06 (night): self-writing legal encyclopedia LIVE (justice-ops 1.1.0)

Owner supplied the production-proven nad-lan spec; ported to legal and
shipped through the plugin self-update channel, no theme pull needed.
- justice_term CPT at /encyclopedia/ (archive 200), taxonomy, tier
  meta. Intake endpoint with site-wide exact-title anti-cannibalization.
- Hourly writer: gpt-4o-mini via the existing JUSTICE_OPENAI_KEY
  mu-plugin constant, tier floors in code, expand pass, 10% tolerance,
  AI-teller phrases and em/en dashes are validation FAILURES, citation
  law in the system prompt (case refs only from input), fail parking
  at 5, drip scheduler with edit_date, telemetry.
- Endpoints: glossary-intake, enc-writer-status (public), enc-writer-run
  (admin), keys (fallback; constant wins). Decorations: EN chip,
  disclaimer footer, DefinedTerm/Legislation JSON-LD.
- ACCEPTANCE PASSED live: 3-entry smoke batch ingested (3 drafted, 0
  collisions); forced run wrote entry 21070 (אשם תורם): 272 words vs
  250 floor, 0 dashes, 0 AI-tellers, 0 h1/fences, 5 H2 sections, opens
  with a definition, scheduled future on the drip, provenance stamped.
- Caps: 15 generated/day, 12 published/day across 09:00-19:00.

## 2026-07-06 (night): encyclopedia ontology batch 1 INGESTED, machine autonomous

Research-driven ontology (competitor lexicon superset + own GSC
definitional gaps): 151 entries authored across criminal (largest),
family, civil procedure and evidence, torts, property and inheritance,
labor, contracts, roles and legal system. 20 cornerstones (800-1300w),
109 standard, 22 niche. Every entry statute-anchored in enc_sources;
money-page head intents deliberately excluded.

Live results: 148 skeletons created, 3 REFUSED by the site-wide
anti-cannibalization guard (working as designed). Writer proven across
tiers: p3 entries at 272-300 words, p1 cornerstones חוק העונשין (790w)
and תקדים מחייב (824w), zero failures. The hourly cron already ran
unattended and wrote entries on its own. Drip queue verified at
50-minute intervals inside the 09:00-19:00 window, 12/day. At 15
generated/day the 148-entry queue writes itself in ~10 days for $1-3
total. Supervision: GET /wp-json/justice-ops/v1/enc-writer-status.

## 2026-07-06 (late night): batch 2 + autolinker LIVE (justice-ops 1.2.1), routing root cause fixed

- Batch 2 ingested: 75 entries (real estate planning and taxation, tax,
  immigration and citizenship, enforcement and insolvency, corporate,
  consumer), 1 collision refused. Queue: 218 skeletons.
- Autolinker live and PROVEN: /criminal-negligence/ renders a
  justice-enc-link on אשם תורם into /encyclopedia/contributory-negligence/.
  Capped 4/page, boundary-safe, cache invalidates on publish.
- ROOT CAUSE FOUND AND FIXED: inc/routing-guards.php
  justice_theme_modify_request_for_articles force-retyped EVERY named
  request to page/post/articles. It 404d encyclopedia singles AND was
  the engine of the same-slug double-body renders (the criminal pillar
  disease). Theme fix: bail when the request already resolved to a post
  type (needs pull). Ops bridge 1.2.1 restores justice_term requests
  live NOW. Intake assigns Latin slugs from name_en going forward.
- First entry LIVE and verified: /encyclopedia/contributory-negligence/
  (אשם תורם): HTTP 200, one H1, EN chip, disclaimer, DefinedTerm schema,
  definition-first opening citing פקודת הנזיקין.
- Writer day total: 8 generated, 0 failed. Scheduled drip tomorrow
  09:00-14:00 at 50-minute slots: מעשה בית דין, תקנת השוק, חוק העונשין
  (790w), תקדים מחייב (824w), חזקת החפות (704w), כתב אישום (633w),
  נטל ההוכחה (670w).
