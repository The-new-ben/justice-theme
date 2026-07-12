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

## 2026-07-06 (midnight): SPOKE ARTICLES LANE LIVE (justice-ops 1.3.4), first article published

Research (owner request): competitive terms need 1,500-2,500 words,
top-10 average 1,400+. Lane spec: target 1,500-2,200, floor 1,300 in
code, ONE per day (cost control), English slugs only, site-wide
collision check at intake, briefs pre-approved from the expedition list.

Iterations that got it there (all telemetry-driven): 1.3.1 brief
storage survives meta unslashing (gershayim in statute years broke
JSON); 1.3.2 dedicated articles model option (gpt-4o) + second expand;
1.3.3 two-part generation (still undershot); 1.3.4 FULL per-section
generation (opening + one call per H2 with deterministic headings +
FAQ) = 2,146 words on first pass.

PROOF PUBLISHED (owner request):
- Article: https://jus-tice.co.il/arrest-detention-lawyer-israel/
  (עורך דין מעצרים) 2,146 rendered words, English slug, Yoast title
  live, keyword-first H1 and opening, table, pillar links in body,
  0 dashes in body, 0 AI-tellers, מדריכים קשורים mesh block.
- Encyclopedia entry: https://jus-tice.co.il/encyclopedia/contributory-negligence/
  (אשם תורם) live with EN chip, disclaimer, DefinedTerm schema, and
  autolinked FROM /criminal-negligence/.

Queue: 7 more approved briefs (pre-indictment hearing, domestic
violence defense, assault, buying from contractor, threats,
inheritance disputes, company formation) writing at 1/day, publishing
10:07 daily. Cost: ~$0.10-0.15/article with gpt-4o, ~$6/month total
both lanes. Polish item: FAQ renders as paragraphs, force h3 next rev.

## 2026-07-07 (owner QA round): article quality hardened (justice-ops 1.3.5-1.3.6)

Owner spotted on the live arrest article: literal **asterisks**, markdown
bullets re-texturized into en dashes, weak design, and suspected
detention cannibalization. All confirmed and fixed:
- Cleaner now converts markdown to HTML deterministically (bold, lists,
  headers), strips wptexturize dash-bait, upgrades bold FAQ questions
  to h3; markdown residue is a validation FAILURE.
- AI-teller list widened (+7 phrases) AND connector tellers scrubbed
  deterministically before validation (the gate had rejected a good
  1,766-word draft over one מעבר לכך).
- Articles model upgraded to gpt-4.1 (tested live, better instruction
  following).
- CANNIBALIZATION (owner was right): /detention-days/ owns מעצר ימים,
  /detention-before-charge-or-trial/ owns מעצר עד תום ההליכים,
  /arrest-rights/ owns the rights guide. The arrest article's mesh was
  rewired to LINK all three as siblings instead of competing. Two queued
  briefs KILLED as intent collisions with existing 2026 guides:
  pre-indictment-hearing-lawyer (vs /pre-indictment-hearing/) and
  domestic-violence-defense-lawyer (vs /domestic-violence/). Remaining
  five briefs verified clear.
- Article 21296 REGENERATED IN PLACE and live-verified: 1,922 words,
  0 asterisks, 0 markdown bullets, 0 dashes in body, 7 ul lists, 2
  tables, 12 H2, 5 FAQ h3, 0 AI-tellers, links to pillar + all three
  detention siblings.
- Bonus: published superlative title fixed on
  /experienced-family-law-attorney/ (תותח removed).

## 2026-07-07 (full product run): NEWS ENGINE LIVE (justice-ops 1.4.0-1.4.2)

Owner mandate: full product run, layer by layer. Shipped:
- NEWS ENGINE: hourly watcher over Israeli feeds (law.co.il verified,
  ynet, globes, calcalist with runtime health), family keyword router
  (criminal/family/real-estate/labor/tax-business/courts), gpt-4.1
  writer producing sourced value-add briefs (attribution first
  sentence, legal context, practical meaning, curated GOV LINKS ONLY
  from verified registry, pillar + related article links), sub-judice
  rule (לכאורה), all style gates, 2h gap + 3/day cap, English slugs
  ({family}-legal-news-{date}-{hash}).
- FIRST BRIEF PUBLISHED ON FIRST RUN and live-verified:
  /criminal-legal-news-2026-07-06-adana/ (403w, attribution, 2 gov
  links, 3 internal links, NewsArticle schema, clean) and already
  rendering on the homepage news band.
- GOOGLE NEWS SITEMAP live at /sitemap-news.xml (48h window; moved
  outside the Yoast *-sitemap.xml intercept pattern).
- OWNER CONTROL PANEL: wp-admin -> Justice News (pause switch, daily
  cap, model, per-source toggles + health, per-family toggles, log,
  spend estimate, manual run, links to sitemap + status JSON). Public
  status: /wp-json/justice-ops/v1/news-status.
- Articles lane: gov_links wired into briefs (4 repaired); the cron
  AUTONOMOUSLY wrote inheritance-disputes-lawyer (1,217w clean, 1
  table, 13 FAQ h3) scheduled 10:07.
- FAQPage schema confirmed already covering machine articles (theme
  extractor matches our exact FAQ format).
- Monetization wiring verified: /lawyer-registration/ /lawyer-plans/
  /lawyers/ /legal-tools/ all 200; homepage lead form posts to
  admin-post handler. Gap: /contact-us/ 404 (find real contact slug);
  full lead e2e submit not tested tonight.
- Screenshots blocked by container proxy (browser CONNECT resets):
  visual QA routed to cowork's browser.
- Full sweep: ops 1.4.2, theme 2.23.0, all 10 key surfaces HTTP 200,
  encyclopedia 14 generated today / 212 queued / 13 scheduled, news
  1/1 success, zero stuck.

## 2026-07-07 (owner QA round 2): practice-area blanks KILLED + WhatsApp lead button (ops 1.5.0-1.5.1)

ROOT CAUSES MEASURED (not guessed): full multi-thousand-word guides
live in the practice-areas TERM DESCRIPTIONS (family-law 35K chars /
4,909 words; divorce 47K; lawyer-directory 23K; personal-injury 17K)
and render inside the narrow hero column = the giant blank walls. Plus
the taxonomy archive had no pagination cap: family-law page was 968KB
with hundreds of cards.

FIXES (render-layer, instant, zero content loss):
- Hero shows the first two paragraphs + anchor; the FULL description
  moves into a readable full-width section (max-width 820px, 1.85
  line-height) injected before the guides grid. Same URL, same text.
- Taxonomy main query capped at 24 cards; theme pagination renders.
- VERIFIED live on family-law, divorce, personal-injury, real-estate,
  israeli-labor-law, traffic-law: 968KB -> 200KB (family), all pages
  100-220KB, exactly 24 cards, trim + full-guide present on all.

WHATSAPP LEAD BUTTON (sitewide, ops): floating button, big labeled bar
on mobile ("שליחת הודעה לעורך דין עכשיו"), prefill carries page title
+ clean URL + intent line with pipe separators (newlines get stripped
by esc_url). Verified live prefill: "שלום, אני פונה מהעמוד: דיני
משפחה | {URL} | אשמח לשוחח עם עורך דין בנושא." Uses the existing
justice_theme_public_whatsapp_url configured number;
data-whatsapp-surface=floating_button for analytics. Present on
homepage, articles, practice areas, encyclopedia, news.

Container browser cannot pass the egress proxy (CONNECT reset), so
pixel-level screenshot confirmation routes to cowork's browser.

## 2026-07-06 evening: PROFESSIONAL CARDS, the monetization surface (ops 1.6.0-1.6.2)

THE BUSINESS LAYER the owner ordered: rich sponsored lawyer cards
inside every content piece by practice family, sold via priority.

HOW IT WORKS (justice-ops/professional-cards.php):
- Family resolver per page: encyclopedia entries via enc_domain, news
  briefs via news_family, articles via their OWN practice-areas terms
  first (the same taxonomy the lawyers carry; term found in a family
  expands to the whole family pool), category slugs as fallback.
- Candidate pool: publish + practice-areas tax query, NO meta join
  (a meta_key orderby would silently drop profiles missing the meta).
- Eligibility, strictly: passes the theme public-approval gate
  (justice_theme_lawyer_profile_is_public_approved, the same gate that
  keeps hidden and seed profiles off public surfaces; Sharon Nahari
  stays impossible to float) AND priority_score >= 1. Score zero =
  directory only. THE SCORE IS THE PLACEMENT DIAL WE SELL: set a
  score, the lawyer floats; higher score, earlier slot; equal scores
  rotate daily (seed wp_date zY) so paying peers share fairly.
- Card: photo or initial avatar, name, up to 3 practice areas, city,
  license badge only with license_number, rating only when the
  verified reviews pipeline shows, "מקודם" compliance chip, WhatsApp
  CTA prefilled "שלום, אני פונה מהעמוד: {title} | {URL} | אשמח לשוחח
  עם {lawyer}." plus profile link with utm_source=jt-card.
- Placement mobile-first: long content card 1 after the 2nd h2,
  card 2 before the FAQ heading; short content one card at the end.
  Options: justice_cards_enabled (1), justice_cards_max (2, cap 3).
- 1.6.2 lesson: style tags inside the_content get stripped by
  sanitization; card CSS prints from wp_head and Autoptimize
  aggregates it (rules verified inside the live aggregate file).

DEPLOY LESSON: raw.githubusercontent served the SERVER a stale
response for a fresh zip; the package URL now always carries ?nlcb=
cache buster. Disk mtime, not the ok flag, proves an install landed.

LIVE VERIFIED:
- petah-tikva-divorce-lawyer: Maya card after exactly the 2nd h2,
  styled, WhatsApp prefill carries page title + URL + her name,
  profile link /lawyers/advocate-maya-rotenberg/?utm_source=jt-card.
- experienced-family-law-attorney, divorce-mediation-cons-pros,
  lawyer-infidelity-divorce: single end card (short or h2-poor).
- arrest-detention-lawyer-israel, encyclopedia/contributory-negligence,
  criminal news brief: NO card, page intact (no scored lawyer in those
  families yet) = graceful absence, inventory ready to sell.
- Maya 19130 already fully activated on live: visibility show,
  priority_score 100, subscription active, plan featured, verified
  owner sources; family pool = Maya + 19 score-zero public imports
  that correctly stay directory-only.
- Her profile mini-site (the card destination) audited: 13 sections,
  ~3,095 words, LegalService schema, 5 WhatsApp CTAs, FAQ, video,
  office map. The funnel article -> card -> mini-site -> WhatsApp
  carries page context end to end.

SELLING A NEW PLACEMENT = tag lawyer with the family's practice-areas
term + set priority_score + pass the approval gate. No code.

## 2026-07-06 night (owner QA): CARDS REDESIGNED to marketplace grade + real portrait (ops 1.7.0)

Owner rejected the first card: photo overflowing, not professional.
ROOT CAUSES FOUND, not guessed:
- Maya's only media asset is a 1920x616 press-collage banner; its
  square crops show newspaper clippings, not a face. medium = 300x96.
- Pages cached in the 12 minutes between 1.6.0 and 1.6.2 linked a CSS
  aggregate that autoptimizeCache::clearall() had DELETED on upgrade,
  so the card rendered with no styles at all. The upgrade hook no
  longer wipes aggregates (old files stay valid; new ones generate on
  demand).

FIXES SHIPPED (1.7.0):
- Avatar geometry rides INLINE on the img (width, height, aspect-ratio
  1, object-fit cover, object-position center 30%): no theme CSS and
  no stale stylesheet can ever distort it again.
- Real profile picture: her official portrait from rotenberglaw.co.il
  (the owner-approved source of this profile) uploaded as media 21313
  with Hebrew alt, wired via the new card_photo_id override meta on
  profile 19130. Fresh renders serve
  adv-maya-rotenberg-portrait-150x150.jpg with a 300x300 2x srcset,
  face-centered crop verified by eye.
- Design rebuilt on marketplace card patterns (2026 card UI research:
  gradient borders + layered elevation, avatar ring, aspect-ratio
  locked media, strict CTA hierarchy, functional micro-interactions):
  navy ribbon with gold flag label + "מקודם" pill, conic-gradient
  avatar ring, practice-area chips + gold city chip with pin, trust
  row (verified license only with a license number, years of
  experience, gated rating), 48px WhatsApp gradient button with glyph
  + ghost profile button with RTL arrow, hover lift on pointer
  devices, prefers-reduced-motion honored, mobile stacks CTAs at 74px
  avatar.
- Placement logic: second card requires a SECOND distinct lawyer AND
  the FAQ anchor at least min_gap_chars (2500) beyond the first card:
  cards never stack.
- CUSTOMIZABLE: Settings > Justice Cards panel (enable, max, gap,
  brand color, accent color, all four labels) + justice_cards_settings
  filter + card_photo_id per-lawyer photo override.

LIVE VERIFIED (fresh renders): petah-tikva-divorce-lawyer shows the
full new card after the 2nd h2 with the real portrait; the new
aggregate carries every rule block including the mobile media query;
criminal article, nezikin encyclopedia entry and news brief stay
card-free and byte-identical; healthcheck 1.7.0. Design preview
artifact published for the owner with desktop + mobile frames.

## 2026-07-06 late night: MINI-SITE POLISH + legacy repair (ops 1.7.1-1.7.2)

The card funnel's landing page brought to advertiser grade:
- Profile hero: the wide 840x270 banner strip replaced by the real
  portrait (card_photo_id) via post_thumbnail_html, scoped to the
  queried profile only; listing cards and portrait-less profiles
  (initials block) untouched, verified on public-basic-hila-weintraub.
- Social share image: og:image and twitter:image for lawyer profiles
  were the SITE LOGO; now the portrait via the Yoast filters. A
  WhatsApp share of a paid mini-site shows the person.
- Floating WhatsApp bar on profiles now names the lawyer: "שלום, אני
  פונה מהפרופיל של עו"ד מאיה רוטנברג | URL | אשמח לשוחח עם...".
- /contact-us/ 404 fixed: 301 to the live /contact/ page. Lesson: the
  redirect could NOT hang on is_404() at template_redirect (the theme
  routing guard rewrites the 404 state first); raw REQUEST_URI match
  at init works. Verified 301 with and without cache bypass.

Machines checked mid-run: encyclopedia 6 generated today (205
skeletons queued, one floor-fail retrying), news sources scanned 01:04
(calcalist simplepie-error known), brief published 22:50.

Ops lesson recorded: $RANDOM cache busters collide (healthcheck served
a stale edge copy while runtime was already current); use date +%s%N.
Runtime-vs-disk version probes settle what the healthcheck cannot.

## 2026-07-07 early: SEQUENTIAL ROADMAP RUN (ops 1.7.3-1.7.6)

1) /buying-property-abroad-guide/ PILLAR BUILT (was 404; every spoke's
   cluster block linked a dead hub across ~110K monthly impressions).
   Written via the article machine from a full brief: 1,667 words, the
   6 briefed H2s, 5 FAQ h3s, zero tellers, zero dashes, zero markdown,
   links to ALL 8 spokes + /real-estate/ hub + verified רשות המסים
   link (patched in post-publish; the writer's link repair covers
   pillar+siblings only). practice-areas real-estate-law tagged.
   Spoke cluster blocks now resolve 200 to the pillar. Also fixed two
   owner-law violations found in the cluster: buying-property-in-
   portugal title carried a superlative + asterisked stale year;
   greece-price-list H1 carried an en-dash. Both retitled, live.

2) /family-law/ HUB BODY LIVE. The page body was a REAL 175-word stub
   masked by template chrome; post_title was mojibake; pillar_keyword
   meta was mojibake (both fixed). Wrote a 405-word intent-router body
   (7 spoke links: divorce-lawyer, child-custody, child-support,
   prenuptial-agreement, divorce-agreement, domestic-violence,
   inheritance-lawyer). Three root causes to make it RENDER:
   a. The live theme predates the repo template's pillar-content slot
      (awaits owner pull) -> plugin bridge injects the body into the
      content column, self-retiring on the slot's arrival.
   b. The theme renders /family-law/ via a CONTROLLED ROUTE that
      renders and exits at template_redirect -999999 -> bridge buffer
      opens at -1000000.
   c. On controlled routes the main query is force-retyped: is_page()
      is FALSE and the global post is not the page -> bridge resolves
      the page by URL path (get_page_by_path).
   VERIFIED live: 4 new h2s, all 7 spoke links, pillar-content div.

3) LEAD FORM E2E PROVEN + REVENUE BUG FIXED. Test lead submitted
   through the public form path (nonce from live page, honeypot empty,
   admin-post.php): 302 lead=success, justice_lead record stored with
   full attribution (name, phone, area, city, urgency, source_url =
   the submitting page, source_channel public_site_form, lead_status
   new), then hard-deleted. admin_email got the notification mails
   (subject contains TEST). THE BUG: the theme timing guard rejected
   any submission whose started_at stamp (baked into cached HTML) was
   older than a day, so pages cached >24h silently blocked every lead.
   1.7.6 keeps the 3s bot floor + honeypot, drops the stale upper
   bound. Verified: 3-day-old stamp -> lead=success; honeypot filled
   -> lead=blocked&lead_reason=honeypot.

Infra lessons: uPress edge = SeoEdge (x-cached-engine-header), caches
pages regardless of query params some of the time; verification needs
either virgin params + size deltas, response headers, or origin-side
probes (header-stamping temp snippet at template_redirect -1000001).
7310 stays draft: it is a single-ruling analysis (Judge Ofra Guy,
property claims), wrong intent for the family hub; candidate for a
future property-division spoke after fact review.

## 2026-07-07 morning: SEVEN-CYCLE AUTONOMOUS MARATHON (ops 1.8.0-1.8.7)

Owner order: all proposed enhancements, sequential, deep, a moat every
cycle. All deployed and live-verified; container browser cannot pass
the egress proxy so QA ran on rendered HTML plus server-side probes.

1) JOURNEY MONITOR (1.8.0): hourly walk of 8 money paths against the
   CACHED public surface, transition-only alert mail, ring log,
   monitor-status/monitor-run. First run and closing run: ALL GREEN.
2) CARD ANALYTICS (1.8.0): viewable impressions (IntersectionObserver
   at half card) + WhatsApp/profile clicks per lawyer/surface/day,
   beaconed so cached views count, per-IP caps, card-stats, monthly
   advertiser proof mail. E2E: events counted, bogus lawyer 400.
3) ADVERTISER FUNNEL (1.8.1): /advertise/ plans + guarded application
   form -> draft profile + owner mail + WhatsApp reply; one-click
   activation sets plan/score/renewal (verified: publish, score 50,
   renews +30d, PASSES the public gate); daily lapse watchdog zeroes
   expired scores. Manual payment mode until a processor is chosen.
4) LEAD ROUTER (1.8.2): area->family->top eligible advertiser (cards
   eligibility engine + monthly_lead_limit), price stamped as billing
   evidence, lawyer mail with acknowledge, owner mail with WhatsApp
   forward. E2E in isolated traffic family: routed with price 120,
   labor lead correctly unrouted_no_capacity. QA FOUND: mail scanners
   prefetch GET links and false-acknowledged a lead -> acknowledge is
   now a confirm-button POST (proven: GET leaves meta empty, POST
   sets it).
5) VERIFIED REVIEWS (1.8.3-1.8.5): tokenized links minted only from
   real CRM leads, one per lead, moderated, approval recomputes lawyer
   aggregates and unlocks the gated stars (verified end to end:
   public_state show true, 5.0). FOUNDATIONAL BUG UNEARTHED: the
   historical justice_recommendation type name is 22 chars, over the
   WP 20-char post type limit and the wp_posts column width, so the
   native reviews pipeline could never store anything; reviews now
   live in justice_review with self-computed aggregates.
6) SERP TITLE MACHINE (1.8.6-1.8.7): weekly GSC strike-zone scan
   (positions 4-15, 300+ impressions; service account JWT signed
   server-side, key in a non-autoloaded option, never in repo),
   iron-rule titles to both title channels, experiment records,
   3-week measure with auto-revert, owner mail per change, pause
   option. Live scan returned 4 real candidates (incl. הסכם גירושין
   pos 7.4 / 1,360 impressions / 0.15% CTR). Weekly cron armed.
7) CITY x PRACTICE ENGINE + COCKPIT (1.8.7): local pages generate
   ONLY where a scored gate-approved advertiser carries the city term
   (doorway defense = the inventory gate); machine opening under the
   iron rules, advertiser cards, family guides, hub link; weekly
   generation rides the serp tick so new advertisers unlock local
   pages automatically. First page live:
   /family-lawyer-tel-aviv/ (title, H1, Maya card, hub link, zero
   tellers after anchor fix). Justice Cockpit admin screen + 
   cockpit-json: monitor, 7d card stats, advertiser roster, machine
   counters, SERP tallies.

Also fixed on sight: three nav menu labels carried dashes (1512,
1522, 6292) -> retitled clean in DB; one cached nav fragment rotates
out with the page cache. Known: lead post titles from the companion
handler carry mojibake dash bytes (admin display only; companion
plugin is outside the delivery channel). Cockpit advertiser count
reads score>0 without the public gate (roster shows names; refine
next pass).

MOATS THIS RUN: self-checking money paths; unbackfillable proof
data; a sales funnel with self-enforcing lapses; routed-lead billing
evidence; structurally unfakeable reviews; a compounding title loop
with auto-revert; local pages that mint themselves as advertisers
join; one-screen business truth.

## 2026-07-07 midday: GROWTH MARATHON (ops 1.9.0-1.9.3)

Owner grant: full ownership, continuous marathon, fix everything seen.

CALCULATORS SUITE (1.9.0): severance, recuperation pay, annual leave,
small claims fee. Stable statutory formulas only; yearly-changing
rates in DATED options (never silently stale); FAQ blocks; WhatsApp
CTA carries the computed result so leads arrive prequalified. Pages
auto-created with English slugs + /legal-calculators/ index. All four
verified live (builder + FAQ render).

INTAKE BRAIN (1.9.0): /legal-help/ three-step deterministic triage
(area, situation, urgency), zero model in the loop. Ends in WhatsApp
handoff carrying the full path AND a prefilled standard lead form
(surface intake_brain) that routes, prices and bills through the
existing engine. E2E proven: triage-shaped lead 302 lead=success,
fixture deleted.

WIRING: header nav gained מחשבונים משפטיים + אבחון מהיר (menu 243);
family-law hub body links both; monitor extended to both surfaces.

DOCUMENT GENERATORS (1.9.1): demand letter + parking ticket appeal.
Hand-written neutral skeletons assembled in the browser, copy and
lawyer-review WhatsApp paths, /legal-documents/ index cross-linking
the calculators. Verified live.

RESPONSE-TIME BADGE (1.9.1): cards show median first-response time
computed from OUR routing telemetry (routed_at to ack_at, 3+ samples,
12h cache). Appears only with real data: a trust signal competitors
cannot fake or backfill. AI first-reply suggestion (gpt-4.1-mini,
scrubbed, optional) now rides the routed-lead mail to the lawyer.

AI ANSWER SURFACES (1.9.2-1.9.3): FAQPage JSON-LD on calculator and
generator pages from their hand-written Q&A; Attorney JSON-LD with
gated aggregateRating on city practice pages; llms.txt covered by
Yoast's own generator (ours stays as fallback if Yoast's vanishes).
LESSON REPEATED AND GENERALIZED: is_page() lies on this theme (the
routing guard force-retypes page queries); every guard now trusts
get_queried_object(). Both schemas verified emitting live.

FINAL STATE: monitor ALL GREEN across 10 journey checks + healthcheck.
Funnel mesh now: content -> cards/calculators/generators/triage ->
router -> ack telemetry -> badges -> reviews -> schema, one system.

## 2026-07-07 afternoon: Q&A ENGINE (ops 1.9.4-1.9.6)

שאל עורך דין live at /ask-a-lawyer/: guarded public form (honeypot +
bot floor + nonce), questions land PENDING with a machine-drafted
general answer (iron-rule prompt, SKIP on doubt); nothing publishes
without one-click owner approval (YMYL discipline, same as reviews).
Published questions: /q/ English slugs, question box + disclaimer,
QAPage JSON-LD, practice-areas terms so the SPONSORED CARDS MESH
injects the family advertiser automatically (cards singular-type list
became filterable), and askers who left a phone become ROUTED LEADS
with the full billing trail on publish.

E2E proven on live: ask -> pending with draft + family-law term ->
publish -> page 200 with question box, QAPage schema, Maya card,
disclaimer; lead auto-created, routed to 19130 at 180 ILS. Fixtures
deleted.

THREE DEFECTS CAUGHT AND FIXED BY THE QA PASS (1.9.5-1.9.6):
- A companion wp_insert_post_data filter strips post_name on pending
  inserts: slugs are now forced post-insert.
- added_post_meta does not fire reliably inside a publish transition:
  the QA lead now routes by direct call.
- The theme request guard 404ed /q/ singles exactly as it once 404ed
  the encyclopedia: same request-filter bridge applied.
FALSE ALARM LESSON: str_word_count counts zero for Hebrew; the machine
drafts were never broken, the measurement was. Count Hebrew with a
unicode-range regex.

## 2026-07-07 evening: THE AI BRAIN (ops 2.0.0)

Research-backed generation pipeline shared by every machine, built
from the papers (searched and cited):
- Retrieval grounding in OUR OWN published pages (factuality survey
  arXiv:2310.07521): drafts may lean only on well-known general
  knowledge plus retrieved site sources, whose links get woven in as
  internal links.
- Chain-of-Verification, factored variant (Dhuliawala et al., Meta AI,
  arXiv:2309.11495): verification questions answered independently,
  final rewritten with uncertain claims removed.
- LLM-as-Judge rubric gate (Zheng et al., arXiv:2306.05685): JSON
  scores for accuracy framing, iron rules, clarity, helpfulness;
  minimum 4 of 5 on every axis or the output does not ship.
- Self-Refine (Madaan et al., arXiv:2303.17651): one refine pass
  driven by the judge's own feedback, then re-judged.
- Self-consistency selection (Wang et al., arXiv:2203.11171): three
  title candidates in one call, judge picks the winner; wired into the
  SERP machine.
Deterministic iron-rule scrub stays the last gate. Every output
carries a full trace (sources, draft words, cove verdict, judge
scores) persisted per question; daily counters (passes, refines,
fails, skips, scrub kills) at brain-status; test bench at brain-test.

CONSUMERS WIRED: Q&A drafts ride justice_brain_answer (trace saved to
qa_brain_trace meta); SERP titles ride justice_brain_best_title with
legacy single-shot fallback.

LIVE BENCH PROOF (production run): question on regular vs notarial
wills. Grounded 2 site sources, draft 142 words, CoVe revised, judge
4/4/5/5 PASSED, final 147 words with 1 internal link, legally accurate
framing (notarial will as a form of will before an authority). Hebrew
word counts now use the unicode-aware counter everywhere in the brain.

## 2026-07-07 night: BRAIN EVERYWHERE + READER UX (ops 2.0.1)

- Article machine outputs now pass the brain rubric judge before
  shipping; judge failures re-enter the existing retry path with
  reason 'judge'. The daily 10:07 article is now grounded floors +
  per-section generation + deterministic scrub + rubric gate.
- Cockpit gained the brain quality panel: passes, refined-and-passed,
  rejected, responsible skips, titles picked, per day.
- Reader UX shipped render-layer: automatic anchored TOC on long-form
  content with 4+ sections (details/summary, collapsed on mobile, open
  on desktop, smooth anchors honoring reduced motion) + gold reading
  progress bar. LIVE VERIFIED on the abroad pillar: 7 anchored
  sections, TOC items, progress div, rules inside the new Autoptimize
  aggregate. Monitor ALL GREEN after deploy.

## 2026-07-07 late: MARKETPLACE SCIENCE LAYER (ops 2.1.0-2.1.1)

Research searched, cited and OPERATIONALIZED:
- MIT/InsideSales Lead Response Management (Oldroyd): contact odds
  drop 100x between minutes 5 and 30 -> SLA ESCALATION ENGINE on a 15
  minute cron: tier1 reminder at 30 unacked minutes (lawyer re-notify
  + owner nudge), tier2 at 90 reassigns to the next performance-ranked
  eligible lawyer, sla_events evidence trail on every lead, sla-run
  endpoint. Options: justice_sla_tier1_minutes / tier2.
- Market design (Gale-Shapley/Roth, Nobel 2012: stability, thickness,
  speed) -> PERFORMANCE-WEIGHTED MATCHING: within equal paid tiers the
  router prefers real responsiveness (median first-response <= 60m:
  +8; ack rate >= 80%: +7; 2+ recent escalations: -10; minimum sample
  3). Paid tier ALWAYS dominates: performance reorders equals only.
- Goldstein/Cialdini descriptive norms (2008 hotel field experiment,
  +9pp with truthful proof) -> TRUST STRIP on intake and Q&A surfaces
  rendering only REAL figures above a floor (verified live: shows
  1,213 published guides; hides the 2-leads and 0-questions figures
  instead of inflating). Endpoint market-stats.
- Post-submit EXPECTATION PANEL on lead=success: what happens next
  timeline + WhatsApp accelerator (uncertainty reduction).
- Cockpit gained the lead-market panel (7d leads, median response,
  sample, published questions).

QA HARNESS CAUGHT A REAL BUG BEFORE ANY REAL LEAD: SLA ages compared a
site-timezone stamp against time() via strtotime (reads UTC), delaying
every escalation by the site offset. 2.1.1 parses with wp_timezone.
Harness rerun: 100-minute lead -> tier2 fired -> no-alternative owner
path -> events stamped. Fixtures deleted. Monitor ALL GREEN.

## 2026-07-07 evening: CINEMATIC MAP + FINDER, THE DIN.CO.IL ANSWER (ops 2.2.0-2.2.2)

COMPETITOR SCAN (din.co.il, the market leader): they lead with a
lawyer finder, forums, video and live chat; they ship ZERO JSON-LD
schema and no calculators or generators (both are ours already).
Their finder was their strongest asset -> CLOSED this cycle: a
server-rendered finder strip (area select from the family hubs, city
select from live inventory-gated city pages, real internal links so
SEO reads them without JS) sits on every map surface.

THE MAP (owner order: "like a drone", gold flag for payers, no dots,
courts labeled, light so Google does not punish, AFTER content):
- Mapbox GL v3 Standard style: real 3D buildings and NATIVE Hebrew
  POI labels: courthouses and government buildings are labeled by the
  basemap itself, zero invented coordinates (iron-rule safe by
  construction).
- Drone choreography in cinema-map.js: high approach (IP-approximate
  region via ipapi.co, 1.4s timeout, IL only, no permission prompt),
  dive onto the TOP PAYING office (Maya Rotenberg), slow orbit around
  the building, pull back to overview. "Aerial tour" button replays
  across every premium office in a chained flyTo+orbit loop. Motion
  stops on first user touch; prefers-reduced-motion gets a static map.
- Premium renders as a GOLD FLAG marker with portrait, name pill and
  a promoted tag; every other firm is a quiet logo chip; courts and
  institutions are dark place chips + basemap labels. Popups: premium
  gets WhatsApp + profile buttons, others profile only.
- WEIGHT: IntersectionObserver boots the whole engine only 500px from
  the viewport; GL js+css injected on demand; LCP never pays. Embed
  appended at the_content priority 32, ALWAYS AFTER the article body
  so the first paragraphs keep their SEO weight. Surfaces: articles,
  Q&A singles, city-practice pages, legal-help / ask-a-lawyer /
  calculators / documents / family-law.

LIVE QA FOUND AND FIXED THREE REAL BUGS:
- 2.2.0 rendered NOTHING: the premium enrichment lived inside the
  theme-bridge filter that self-retires at theme 2.21.0 (live theme
  is 2.23.0), and the token resolver read the empty plugin option
  while the real token lives in theme storage. 2.2.1: always-on
  enrichment filter + token through the theme resolver first.
- A pre-existing `continue` for logo-carrying lawyers skipped the
  premium block for exactly the lawyers who have logos (Maya).
- 2.2.2: the WhatsApp prefill URL-encoded an entity-escaped title
  (gershayim arrived as a literal quot entity inside the message);
  now decoded before encoding. Enrichment single-sourced (bridge copy
  deleted). MONITOR NOW WATCHES THE MAP: money article must carry the
  embed, offices feed must serve a premium office with a portrait.

LIVE VERIFIED (cache purged, probed inside aggregates):
- /petah-tikva-divorce-lawyer/: map + finder + tour render, order is
  content -> sponsored card -> FAQ -> map, tel-aviv city option live.
- /legal-calculators/: embed + finder + tour live; map CSS inside
  Autoptimize aggregate 0822a987, engine flyTour x3 inside JS
  aggregate a4e09676, JT_CINEMA config inside the base64 data URI.
- Offices feed: premium=1 (Maya) with portrait + clean WhatsApp text.
- Monitor 10/10 GREEN before the 2.2.2 deploy.

## 2026-07-07 night: THE NATIONAL COURT LAYER (ops 2.2.2-2.3.1)

The owner's map order had one line not yet fully honored: "every court,
every government office, everything has to be labeled." The basemap
labels courthouses natively, but only at close zoom. So the map now
carries the authoritative set, seeded from the Judicial Authority
directory (gov.il courts-data).

WEB-RESEARCHED, then GEOCODED, never invented:
- Sources: gov.il/he/departments/dynamiccollectors/courts-data (the
  official directory), cross-read against odonline.co.il and
  insolvency-law.org.il for the full magistrate branch list with
  street addresses.
- Every court carries its OFFICIAL PUBLISHED ADDRESS. Coordinates come
  from geocoding that address on the server through Mapbox (the same
  token and endpoint the theme already uses for lawyer offices), never
  a hand-typed latitude. Iron-rule safe: no invented facts, and every
  seeded point passed the Israel bounding-box gate (0 out of range).
- Idempotent seed (justice-ops/map-places.php, admin seed-courts
  route): skips a court whose exact title exists and skips any court
  that geocodes within ~150m of an existing place. That proximity
  guard is why the shared Hall of Justice buildings never double-pin:
  district + magistrate + labor under one roof in Beer Sheva, Nazareth
  and Haifa collapsed to a single chip (9 near-existing skips, all
  correct).

LIVE RESULT: 30 courts now labeled on the map. The Supreme Court, all
six district courts, every magistrate branch from Eilat to Nof HaGalil,
the national and regional labor courts, plus the main government
complexes. Courts render as gold scales chips, government as classical
building chips, each popup carrying a one-tap navigate link to maps.

TWO REFINEMENTS FROM SELF-QA:
- map-places used get_page_by_title (deprecated in WP 6.2+); switched
  to a WP_Query title lookup before it could log a notice.
- With 43 features now spanning the whole country, the drone's closing
  overview was fitting Eilat-to-Galilee into frame and showing empty
  desert. 2.3.1 rests the overview on the lawyer offices (fallback
  premium, then all); courts stay as labeled chips within the view.

VERIFIED LIVE: healthcheck 2.3.1; feed serves 30 court + 3 institution
places with place_type, address and type_label; the money article
still renders map + finder + tour; the new JS aggregate carries
placeGlyph, the maps navigate link and the lawyer-anchored overview;
monitor 11/11 GREEN.

DIN.CO.IL POSTURE: their finder was their edge and it is matched; their
core court archive is answered on the map side (labeled national court
coverage) with the court-decision digest lane still queued for the
content side. Remaining honest gaps: video and forum-scale community.

## 2026-07-11: GOD-MODE REVIEW + THE AI LEGAL DESK (ops 2.4.0-2.4.1)

Owner order: deep review, dramatic design, fix low traffic from GSC,
close competitor gaps side by side, simplify the process to one click
and document upload, improve accessibility, prove the research.

GROUNDING (real data + three parallel research agents, all sourced):
- GSC (28d): 213,285 impressions but only 1,242 clicks (0.58% CTR),
  avg position 26.9. Diagnosis: not a visibility problem, a BURIED +
  JUNK problem. /posta/ pulls 12,483 impressions for a crime-news
  brand term (irrelevant). Real money pages are on page 3-6:
  /the-recommended-family-lawyers/ at pos 64, /child-support/ at 61,
  the divorce-agreement template at 17. Strike-zone gold that maps to
  our own tools: "הסכם גירושין" (1,590 imp, pos 7.9), "חוזה שכירות
  אונליין" (pos 6.3), "חיפוש עורך דין" (pos 7.5).
- Competitor agent: din.co.il leads on SCALE (5,574 lawyers, 341K Q&A)
  but has NO AI intake, NO document upload, NO price transparency, NO
  modern wizard. The pattern to steal is Rocket Lawyer's upload -> AI
  read -> one-tap free human. Avvo embeds hiring-intent + timeline
  qualifiers for warmer leads. Guardrail: the FTC order against
  DoNotPay means we frame AI as guidance that ends at a human, never a
  lawyer substitute (which our iron rules already require).
- Design agent: the 2026 formula is "looks like a SaaS product, feels
  like a 100-year institution": one aesthetic, high contrast, one
  accent, doubled whitespace, real product in the hero, one obvious
  action. #1 move: make the hero one open box; #2: upload a document
  for instant plain-Hebrew value, no signup.
- QA agent (live HTML audit): NO document upload existed anywhere on
  the site; missing meta descriptions on the tool pages; detached
  form labels; broken focus outlines; money articles missing
  Article/FAQPage schema; off-topic news diluting topical focus (the
  same signal as the /posta/ junk impressions).

SHIPPED - THE AI LEGAL DESK (the one-action front door):
- Describe what happened OR upload a document (a phone photo of a
  contract, ticket, letter). The image is downscaled in the browser,
  analyzed in memory, and never stored. Within seconds: doc type, a
  plain-Hebrew summary, the points that matter, things to check, your
  rights, the next steps, and a one-tap lawyer handoff that routes
  through the existing lead engine carrying the summary + hiring
  intent (the Avvo qualifier).
- Built on the graded brain with vision (gpt-4.1). Iron-rule framed:
  general guidance, recommends a lawyer, no promises, always ends at a
  human. Bot-guarded + rate limited. Premium accessible UI (one accent,
  glass card, aria-live result, keyboard operable, RTL logical props).
- Flagship page /legal-ai-desk/, leads /legal-help/ above the old
  wizard, money-page finder points to it, monitor guards it.

LIVE PROOF (verified after deploy):
- Describe: "fired after 6 years with no hearing, no severance" ->
  area_key labor, correct summary, 4 points / 3 rights / 4 steps / 3
  questions for the lawyer, WhatsApp handoff with context.
- Vision: uploaded an English lease image -> "חוזה שכירות למגורים",
  area real-estate, and the watch list caught exactly the planted
  predatory clauses (14-day landlord termination, no early exit,
  tenant liable for ALL structural repairs "not customary, check it",
  high deposit + penalty) - all framed as flags, not rulings.
- Desk CSS in the Autoptimize CSS aggregate; JT_DESK endpoint config +
  desk JS in the JS aggregate; monitor 12/12 GREEN incl the ai_desk
  check.

DEPLOY NOTE: raw.githubusercontent.com went fully 404 for the repo
mid-cycle (private-repo/token issue on GitHub's side; even main/style.css
404'd while codeload + the API worked). Bypassed it with an
authenticated upload-install route (base64 zip -> WP writes a local temp
file -> Plugin_Upgrader installs from disk). Deploys 2.4.0 and 2.4.1
both landed this way; disk_version verified each time.

STILL QUEUED (GSC-prioritized, next cycles): recover the buried money
pages (recommended-family-lawyers pos 64, child-support pos 61) with
titles + internal-link hierarchy; win the strike-zone tool terms; add
Article + FAQPage schema to money articles; add the 4 missing meta
descriptions; associate form labels + restore focus outlines; address
the topical dilution from the /posta/ + off-topic news content.

## 2026-07-12: CONTENT HIERARCHY + INTERNAL AUTHORITY (ops 2.5.0)

Continuing the god-mode marathon on the GSC read. The money pages were
buried on page 3-6 with almost no internal links pointing at them:
/the-recommended-family-lawyers/ sat at position 64 as a literal orphan
(diagnosed: zero links from the family hub OR the homepage). Search
engines pass relevance and authority along internal links; an orphan
gets neither.

SHIPPED (justice-ops/seo-hierarchy.php):
- A curated, capped, self-link-safe related-pages mesh. Every family
  article now carries a "מדריכים וכלים בדיני משפחה" block linking to the
  recommended-lawyers page, the child-support calculator, the family
  hub and the AI desk. The orphan went from zero inbound internal
  links to one per family article. Verified live on
  /petah-tikva-divorce-lawyer/: the full nav block renders with all
  four links.
- The four missing tool-page meta descriptions (legal-help,
  calculators, documents, ask-a-lawyer) that the theme and Yoast left
  blank are now emitted from curated, GSC-relevant copy. Verified live:
  exactly one description tag on each, no duplicates.

KNOWN LIMIT: the family hub itself (/family-law/) is a controlled
practice route that renders and exits at template_redirect -999999, so
a the_content append lands only its wp_head CSS, not the nav block.
Injecting into the hub body needs the practice-landing buffer bridge
(open at -1000000); the article-level links already give the orphan
real inbound authority, so the hub link is deferred, not required.

STILL QUEUED: Article + FAQPage schema on money articles; H1 pipe-junk
cleanup (child-support H1 carries "| Jus-Tice"); form-label association
+ focus-outline restoration (a11y); the topical dilution from /posta/
and off-topic news.

DEPLOY: raw.githubusercontent.com still 404 for the repo, so 2.5.0
shipped via the authenticated upload-install route. Monitor 12/12 GREEN.

## 2026-07-12: ACCESSIBILITY BATCH (ops 2.5.1)

From the live audit, two plugin-reachable WCAG fixes: the intake wizard
form labels are now programmatically associated (for/id + autocomplete),
fixing a 1.3.1/4.1.2 failure and enabling browser autofill; the
cinematic map div carries role=img so its label is announced and points
screen-reader users to the accessible area/city finder above it. Verified
live (for="jtb-name/phone/city" present, map role=img present), monitor
12/12 GREEN. Remaining a11y (theme-level focus outlines, contrast tokens,
duplicate dir=rtl) ships with the next theme pull.

## 2026-07-12: SEQUENTIAL QUEUE PASS (schema, H1, dilution, mesh) — ops 2.5.2

Worked the queue in order:

1. ARTICLE + FAQPAGE SCHEMA ON MONEY ARTICLES: verified already
   resolved. The live money article (/petah-tikva-divorce-lawyer/)
   carries Article + LegalService + Person + ImageObject schema; the
   earlier "missing" audit read a stale/cached copy. No FAQ section on
   that page, so no FAQPage to add. Building a bridge would only have
   created duplicate Article schema, so it was correctly skipped after
   verification.

2. MONEY-PAGE H1 CLEANUP: /child-support/ carries "| Jus-Tice" in its
   H1, but it is a controlled pillar page (inc/pillar-pages.php) whose
   H1 and title are one config string, so cleaning only the H1 needs an
   output-buffer bridge on the controlled route. Deferred to the theme
   pull as a low-risk template fix rather than buffering a live route.

3. TOPICAL DILUTION (/posta/, 12,483 junk impressions): diagnosed as a
   deliberate brand-jack article targeting the din-adjacent "posta"
   crime-news brand (0.3% CTR because those searchers want the news
   site). noindexing it is a destructive, outward-facing traffic
   trade-off (removes ~35 real clicks/month, hard to reverse), so it was
   flagged for an owner decision rather than done unilaterally.

4. EXTEND THE AUTHORITY MESH (ops 2.5.2): DONE. The internal-authority
   mesh now covers five clusters (family, criminal, real estate, labor,
   nezikin), reusing justice_cards_family_map so it matches the same
   articles the sponsored cards do. Verified live: the criminal money
   pages cross-link (apply-for-police-... links Lahav 433 + the criminal
   pillar + the AI desk, self-link dropped); real-estate, labor and
   nezikin money pages each render their cluster mesh. Every buried
   money page now sits in an internal-link neighborhood instead of
   alone. Monitor 12/12 GREEN.

## 2026-07-12: DEEP SEO QA + FORUM RESEARCH + IMPLEMENT (ops 2.6.0-2.6.1)

Owner order: deep SEO QA, web-search sources from forums, upgrade SEO and
content, implement, complex and smart.

RESEARCH (three parallel agents, forum-heavy, all sourced):
- FORUM INTEL (BlackHatWorld, WebmasterWorld, Hacker News, Search Engine
  Roundtable which quotes Reddit/X/WMW). Strongest consensus tactics:
  (1) re-point internal links FROM aged/authority pages INTO buried pages
  (fastest cheap lever); (2) tight topical clusters not flat meshes;
  (3) refresh pages that used to rank; (4) PRUNE/noindex off-topic
  zero-value pages, quality is judged only on indexed pages (case studies:
  pruning doubled traffic); (5) off-topic pages ranking for irrelevant
  terms are a documented site-quality DRAG (Mueller); (6) removal
  mechanics: 410 purge / noindex keep-out / 301+canonical consolidate,
  and cut internal links to removed pages; (7) named + bar-numbered
  attorney authorship is the defining YMYL lever (Dec-2025 core update hit
  legal hard); (13-14) title/meta-only rewrites (51-55 chars, intent
  first, year stamp) move rankings and clicks with zero new content.
  STOP list: JSON-LD is NOT an AI-citation lever (Ahrefs study), author
  bio alone is not a ranking factor, rewriting-AI-to-human does not
  recover, programmatic pages need proprietary data or read as doorways.
- CONTENT/SERP GAP: /free-divorce-agreement-template/ (#17) is the best
  near-term win, gap is a missing FAQ + FAQPage schema + freshness.
  /child-support/ (#61) buried DESPITE strong content: 12 FAQ unmarked,
  no year in title, and probable BRAND CANNIBALIZATION with rotenberglaw
  (same Maya Rotenberg author-home). Medical-malpractice (#16) and
  apartment (#29) target the WRONG intent (a 2002 gov report; an OVERSEAS
  property guide) and need new consumer-intent pages. Winning pattern:
  intent-matched, tool/template-first, year in title, named+bar-numbered
  author, FAQPage schema.

OWN GSC QA: pulled page+query pairs. CANNIBALIZATION is the #1 structural
problem: "cost of divorce lawyer" has 4 competing pages, "cost of traffic
lawyer" has 7, divorce-mediation exists at two near-identical slugs, the
divorce-agreement variants split across pages. Plus catastrophic CTR
(0 clicks at positions 9-16 on many impression-rich pages).

IMPLEMENTED:
- 2.6.0 CANNIBALIZATION CONSOLIDATION: weaker duplicates canonical to the
  stronger page through Yoast (reversible, loop-safe): mediation-divorce
  onto divorce-mediation, mutual-divorce-agreement-2025 onto the hero
  template, immigration-to-portugal onto portugal-relocation. Verified the
  canonicals changed live. Extensible map.
- 2.6.1 FAQPAGE SCHEMA BRIDGE: root-caused why child-support shipped no
  FAQPage despite 12 Q&A: the theme extracts with a strict h3+p regex, but
  Gutenberg wraps answers in block comments so the strict pattern finds
  nothing. A comment-tolerant bridge emits FAQPage only when the strict
  pattern found nothing (never duplicates). Verified: 9 real questions now
  marked up on child-support, monitor 12/12 GREEN.

NEXT (forum-validated, prioritized): title/meta CTR rewrites on the
impression-rich page-3 set (fastest lever); noindex the off-topic
news/brand-jack pages (Mueller-backed site-quality move, reversible);
named + bar-numbered attorney authorship (YMYL); route mesh links FROM the
tools INTO buried pages; new intent-matched pages for malpractice +
domestic apartment. Technical-audit agent still running; its findings feed
the next cycle.

## 2026-07-12 night: FULL RE-AUDIT OF THE OPUS-ERA WORK (ops 2.7.0 + 257-page H1 repair)

Owner order: the prior model's work is not trusted; re-research, deep QA
everything, repair deeply, take responsibility. Model facts: the entire
session ran on claude-opus-4-8 until this order; claude-fable-5 from here.

FIVE CODE DEFECTS FOUND AND FIXED (ops 2.7.0), from a hostile re-read of
every module shipped in the recent cycles:
1. CRITICAL: the AI desk posted family-vocabulary lead areas (nezikin,
   labor, real-estate, family) that justice_router_area_to_family did not
   recognize, so a desk handoff lead would land unrouted_no_family and
   never reach a lawyer. Desk now posts router-native keys per area, and
   the router gained family-key aliases. No real leads were harmed (leads
   summary: zero desk leads to date). VERIFIED server-side: every desk
   area now resolves to a family (deskmap probe, all 8 OK).
2. The index-bloat noindex filter claimed Yoast would also drop pages
   from the sitemap; runtime robots filters never touch the sitemap
   (exactly how checkout stayed listed while noindexed). Added
   wpseo_exclude_from_sitemap_by_post_ids + term exclusion. VERIFIED:
   cart/checkout/my-account/shop/lawyer-dashboard gone from
   page-sitemap.xml AND noindexed (core emits robots with single quotes;
   the first verification grep was quote-naive and false-failed).
3. The FAQ schema bridge anchored on the first loose mention of the FAQ
   marker; an intro sentence naming the section would have turned
   ordinary sections into fake questions. Now anchors on the section
   heading. VERIFIED: child-support still emits 9 real questions.
4. Consolidated pages kept a self og:url contradicting the 2.6.0
   canonical. og:url now follows the same shared resolver; term archives
   consolidate too (category news -> legal-news, raw practice-areas
   archives -> the controlled hubs). VERIFIED live on all three.
5. The meta-description emitter could double-emit against Yoast; now
   skips any post where Yoast prints its own. Encyclopedia terms +
   legal-tools now carry exactly one description each. VERIFIED.

THE 257-PAGE H1 REPAIR: the tech audit found the H1 = full SEO title
(pipes + brand) systemically. A dry-run measured the true scale: 257
published pages. Fixed sitewide with a time-boxed batched route:
post_title cleaned (brand tail stripped, pipes to colons), every page's
existing <title> preserved byte-for-byte by copying the old title into
_yoast_wpseo_title when absent, old values backed up in jt_h1_backup
(fully reversible). The run tripped the theme's own publication safety
gate; root-caused: pages whose CONTENT contains internal markers die in
wp_update_post. Pre-screened with the theme's own detector; exactly ONE
page flagged (startup-equity-israel, marker "מסלול הכנסה") and it is a
FALSE POSITIVE (Section 102 income-tax track, legitimate tax content) so
there are ZERO real internal-note leaks sitewide. Final server-side
count: 0 piped titles remain. VERIFIED on child-support, divorce-lawyer,
criminal-lawyer-eilat, medical-malpractice-lawyer: H1 clean, title
preserved. 166 URLs purged.

CRITICAL OPERATIONAL FINDING: the OpenAI account behind
JUSTICE_OPENAI_KEY is OUT OF QUOTA ("You exceeded your current quota")
and brain stats show nothing logged since 2026-07-07. The entire AI
layer is silently down: desk analysis, Q&A drafts, article judging,
SERP titles. OWNER ACTION REQUIRED: top up OpenAI billing. The desk
mapping fix is verified server-side; end-to-end desk analysis resumes
the moment quota returns.

Monitor 12/12 GREEN. Gate-pattern tightening (the מסלול הכנסה false
positive) queued for the theme pull.

## 2026-07-12: THE AI ENGINE, LOUD FAILOVER + CIRCUIT BREAKERS (ops 2.8.0)

Owner order: a quality backup AI engine that never switches silently,
research how the quota drained (exploited?), circuit breakers, which
model is best for us, check the repo for existing connections.

FORENSICS (answer to "how did we over-quota"):
- NO EXPLOIT. The drain was our own machines: a 122-term encyclopedia
  burst on 07-06, then the steady cadence (~15 encyclopedia drafts/day
  on gpt-4o-mini at 6K tokens, 1-2 articles/day on gpt-4.1 at 10K,
  news briefs at 4K, judge passes). TIMELINE CORRECTION from the
  earlier report: the writer still succeeded on the morning of 07-12,
  so the quota died TODAY, hours before it was caught, not on 07-07
  (the brain counter was stale because nothing calls the brain daily).
- Repo scan: NINE raw OpenAI call sites across 8 files, no existing
  Anthropic/OpenRouter wiring. Public attack surface is guarded (desk
  10/hr/IP + honeypot + dwell; QA form honeypot + timing) but nothing
  capped GLOBAL daily spend until now.

SHIPPED (justice-ops/ai-engine.php + all call sites rerouted):
- justice_ai_chat: the ONE door. All nine call sites (encyclopedia,
  articles, news, brain, desk, QA drafts, SERP titles, city openings,
  lead replies) now route through it; verified zero raw api.openai.com
  callers remain outside the engine.
- LOUD failover: primary OpenAI; fallback Anthropic
  (JUSTICE_ANTHROPIC_KEY, default model claude-opus-4-8, option
  jt_ai_fallback_model; vision converted from OpenAI image_url to
  Anthropic base64 blocks so the document desk keeps working during
  failover; sampling params omitted per current Claude API) or
  OpenRouter (JUSTICE_OPENROUTER_KEY, OpenAI-compatible passthrough).
  EVERY state transition mails the owner exactly once (failover / down
  / capped / paused / recovered), shows on the cockpit, flips the
  public ai-health endpoint, and trips the hourly monitor. Nothing
  switches silently, per the order.
- Circuit breakers: daily call cap jt_ai_daily_cap (default 400) with
  a capped-state mail; kill switch jt_ai_paused; deterministic no-retry
  on quota/auth failures; per-provider and per-source daily counters
  (jt_ai_usage) so every consumer is attributable forever.

PROVEN LIVE with the real outage:
- Fresh ai-health: state normal. One desk call: primary failed,
  classified "quota: היתרה בחשבון OpenAI נגמרה", state flipped to
  down, counters openai fail=1 / source ai_desk=1, transition mail
  fired. Monitor: 12/13 green with exactly ai_engine RED, and the
  green-to-red transition fired the monitor alert mail. Both loud
  channels verified with a genuine failure.

MODEL RESEARCH (claude-api skill + web): fallback default
claude-opus-4-8 ($5/$25 per MTok, vision, 1M context); cost-efficient
alternative claude-sonnet-5 ($2/$10 intro through 2026-08-31) via
option jt_ai_fallback_model. OpenRouter (openrouter.ai) confirmed as
the one-key aggregator alternative (OpenAI-compatible, +5.5% fee,
its own model fallbacks).

OWNER ACTIONS: (1) top up OpenAI billing to restore the primary; the
engine auto-recovers and mails "back to primary". (2) Optionally add
ONE line to wp-config for the backup: define('JUSTICE_ANTHROPIC_KEY',
'sk-ant-...'); the failover activates by itself and announces itself.
Monitor stays honestly RED on ai_engine until either happens.

## 2026-07-12: THE PROFESSIONAL HOMEPAGE (ops 2.9.0-2.9.2)

Owner order: deep SEO QA, research how to surface content on the
homepage, AI-content SEO guides, side-by-side with din.co.il, fill the
gap, a professional homepage.

RESEARCH (cited): homepage is the highest-equity page; contextual
descriptive-anchor links from it are the strongest internal-link lever;
keep total links under ~150 (clickrank, singlegrain, shopify,
link-assistant 2026 guides). Google's own gen-AI content doc: quality
over method, named human review, original value; scaled-content abuse
is about intent, not tools (developers.google.com using-gen-ai-content).

SIDE-BY-SIDE (live fetch, both homepages):
- din: H1 5 words, 146 disciplined links, trust wall (17,490 guides /
  14,347 recommendations / per-area counts), 3 forms, no AI anywhere.
- us BEFORE: 239 links (bloat), ZERO links to our own money pages,
  ZERO mention of the AI desk (our differentiator), 37 emoji inside
  headings, 270-char auto meta description.

SHIPPED:
- 2.9.0 homepage-pro.php: one premium band injected right after the
  hero: a one-box "ספרו מה קרה" that lands in the AI desk prefilled
  (?q= wiring added to the desk JS, #doc opens the upload tab), a
  TRUTHFUL trust wall (floors, never inflated), and six curated
  descriptive-anchor money links. Hand-written homepage meta
  description via wpseo_metadesc. News engine gained an Israel-anchor
  topical gate (world-crime items no longer publish; the German and
  Venezuela class of dilution ends at the source).
- 2.9.1: the 37 heading emoji turned out to live in THEME templates,
  not page content (front-page post_content scanned clean); the
  front-page buffer now strips emoji from headings at render time.
- 2.9.2: live QA caught the band missing while the meta description
  was live: the theme front page is a CONTROLLED ROUTE that renders
  and exits at template_redirect -999999; the buffer now opens at
  -1000000 (the documented bridge pattern strikes again).

VERIFIED LIVE (purged, fresh fetch, proper Unicode parsing):
- Band renders hero -> band -> featured (byte order verified); one-box
  form action = /legal-ai-desk/; #doc deep link present.
- Trust wall: 4 truthful stats live (1,229 guides, 67 encyclopedia
  terms, 6 tools, 30 courts on the map).
- All six money links now flow from the homepage (every one was 0).
- Meta description: hand-written copy, exactly one tag.
- Emoji in headings: 0 of 82 (was 37); a first bash count of 65 was a
  multibyte byte-class false positive, settled with python Unicode.
- Desk ?q prefill live in the JS aggregate. Monitor 12/13 with only
  the known ai_engine red (quota, owner action pending).

## 2026-07-12 (later): ops 2.10.0-2.10.1, discoverability + the .com discovery

Order: continue developing AI tools, make them upfront and discoverable;
plus deliver the ChatGPT Pro deep-research mega prompt.

Shipped and live-verified (2.10.1 on healthcheck):
- Primary menu: gold "עוזר AI מיידי" prepended site-wide (needle-checked
  so a future CMS menu entry wins). Screenshot-proofed first in the nav.
- Floating assistant button, navy/gold, inline-end corner, hover-expand
  label, hidden on the desk page and the front page, lifted above the
  WhatsApp bar on mobile (bottom:76px under 768px).
- In-guide one-box teaser before a mid-article h2 on singular post and
  articles content over 2200 chars, GET handoff to /legal-ai-desk/?q=,
  doc deep-link to #doc. Feed/REST guarded, never doubles.
- Screenshot QA caught a pre-existing defect: the THEME footer ships its
  own green .whatsapp-float bubble on top of the ops pill (two identical
  WhatsApp CTAs, overlapping bars on mobile). Hidden via a.whatsapp-float
  display:none (element+class outranks the theme rule in any aggregate
  order). One action per corner now: WhatsApp inline-start, AI inline-end.
- Verification matrix (virgin params): home nav=1 fab=0 band=1; article
  nav=1 fab=1 teaser=1; desk fab=0; pillar fab=1 teaser=0. CSS confirmed
  inside the rotated Autoptimize aggregate. Proof PNGs in scratchpad.

Discovery: jus-tice.com (the .com, GoDaddy DNS) serves the owner's React
demo "Jus-tice Global Legal Platform" via an SPA host (185.158.133.1,
Cloudflare-fronted, GTS cert chain, fresh cert 2026-07-07), catch-all
shell on every path, canonical to root, robots allows crawling, sitemap
404. NOT our production (.co.il untouched); flagged to owner for brand
SERP and indexing decisions on his side.

Strategy deliverable: project-control/deep-research-prompt-divorce-
agreement-2026-07.md, the paste-ready ChatGPT Pro deep-research mega
prompt targeting /free-divorce-agreement-template/ (positions 14-20,
biggest near-win), iron rules embedded verbatim, three-part output
contract, self-check line, child-support swap block, ingestion path
back through our gates. Decision record inside the file.

Open on owner: OpenAI billing (engine down since 11:13 UTC, desk
degrades to WhatsApp path politely), optional JUSTICE_ANTHROPIC_KEY,
attorney byline (name + bar number) for the money pages, target
confirmation (divorce agreement vs child support).

## 2026-07-12 (evening): ops 2.11.0-2.11.1, the full money-stack cycle

Orders executed: proceed (serp-strike), more money pages + prompts, the
courtai simulation embedded for real, divorce research ingested, every
money page becomes an SEO page with an application inside, monetized.

SERP strike (GSC query+page pull, live SERP vocabulary):
- הסכם גירושין sat on PAGE 1 (pos 7.7, 1,527 imp) with 2 clicks; new
  intent-first year-stamped title + desc + H1 live. עורך דין פלילי שכר
  page at pos 3.7 with 0 clicks behind a 71-char double-pipe title:
  rewritten to the salary intent its content actually serves. Rent
  agreement gains אונליין+חינם; cert page gains the year. All verified
  rendered. Theme map (inc/seo.php) updated to the same texts so the
  next owner pull aligns; ops layer self-retires on text equality.
- Criminal-fee cannibal pair consolidated (Hebrew-slug cost page ->
  price-list page canonical, encoded+decoded keys, verified live).
- Homepage snippet now opens with the searchers' words (חיפוש עורך דין
  לפי שם). /posta/ left untouched: navigational queries, deindex
  decision stays with the owner.

Deep-research ingestion (owner ran the divorce prompt in ChatGPT Pro):
- Output passed iron-rule scans AFTER cleanup (citeturn markers stripped,
  byline placeholder removed pending the real attorney name, FAQ heading
  normalized to שאלות נפוצות so the schema bridge fires, 5 bracket
  anchors wired to live URLs, sources appendix rebuilt with verified
  links only). Honest count: body ~3,800 words, not the self-reported
  7,000; still 2-3x the strongest competitor. Published to
  /free-divorce-agreement-template/ (post 3130) via a reusable gated
  artup snippet; verified rendered: 4,880 Hebrew words, FAQPage schema
  live, docx download kept, generator embedded.

Divorce generator v1 (the "page is an application" rule, zero AI
dependency so the OpenAI outage cannot touch it): seven defaulted
questions -> personalized agreement skeleton preview + named locked
sections + paid full-document order (jt_divorce_gen_price, default 149)
on the existing guarded lead rail, manual settlement like the advertiser
funnel. Copy makes the payment flow explicit.

Simulation embedded for real: /legal-simulation/ hosts HADMAIA from
jus-tice.com chrome-less (deep repo read done by agent; embed mode,
frame-safety and baked key verified live). Homepage band links it. Old
"embed" was just a link to one recording in the tools strip.

Prompt factory shipped: project-control/prompt-factory-2026-07.md with
the pipeline tracker (never buried; updated every cycle) + 5 new
self-contained mega prompts (criminal, malpractice, property+RSU split,
AI-tools-for-lawyers with GEO focus, lawyer-rankings index with strict
public-data/ethics guardrails and the AI-adoption parameter). Each
demands an embedded-app spec + competitor app benchmarks + data tables.

courtai plan committed: project-control/courtai-integration-plan.md
(phases, verified embed facts, owner risk flags: client-side Groq key
extractable, .com sitemap 404, HashRouter invisible to crawlers).

Open on owner: OpenAI billing / fallback key (engine still down);
attorney byline name + bar number (blocks the top YMYL lever and the
article byline); divorce-gen price confirm (149 default); rankings
prompt ethics framing acknowledged; .com key rotation recommendation.
