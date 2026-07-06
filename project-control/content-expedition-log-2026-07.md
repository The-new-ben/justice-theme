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
