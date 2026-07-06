# JUS-TICE MEGA HANDOFF (2026-07-03) - read me first, then execute

You are the lead engineer + business owner-proxy for jus-tice.co.il, a
Hebrew (RTL) legal portal monetized by lawyer subscriptions and routed
leads. Work autonomously, ship in small verified commits, never lie
about results.

## 1. Repo, deploy, verification
- Repo: github.com/The-new-ben/justice-theme, branch main = LIVE lineage.
  uPress (Israeli managed WP host) pulls main via File Manager > Git
  management > Pull. Feature branches never deploy.
- Every deploy: php -l each changed PHP file, node --check changed JS,
  bump JUSTICE_THEME_VERSION + JUSTICE_DEPLOY_MARKER in functions.php,
  commit, push, then OWNER pulls in uPress. Verify live with:
  curl -s https://jus-tice.co.il/ | grep -o 'justice-deployment-marker[^>]*'
- Full runbook: project-control/DEPLOYMENT-HANDOFF-for-cobra.md
- Channels: A=theme code via git+owner pull (trending toward static
  chrome only); B=database content via REST or gated init routines;
  C=justice-ops PLUGIN, live since 2026-07-02, THE channel for new live
  behavior per owner order. Source justice-ops/, artifacts plugin-dist/
  (manifest justice-ops.json + versioned zips), builder
  scripts/deploy/build-ops-zip.py, healthcheck
  /wp-json/justice-ops/v1/healthcheck. Core-native Update URI protocol:
  push a version bump to main and WP cron auto-installs (justice-ops is
  in auto_update_plugins); instant path = temp-route pipeline
  (.claude/skills/wp-deploy). Proven live 1.0.0 -> 1.0.1 on 2026-07-02
  via WordPress's own updater. Owner veto stands: NO Theme_Upgrader
  zips, never touch the server .git.

## 2. Credentials and keys (locations only, never commit secrets)
- OpenAI key: lives ONLY on the server in wp-content/mu-plugins/
  justice-ai-mu.php (repo copy: upress-upload/justice-ai-mu.php has a
  placeholder). Endpoint /wp-json/justice/v1/generate is LIVE and
  verified working. Guards: 30 req/day site, 3/day per IP, $1.50/day.
- GSC OAuth: tools/gsc/ scripts; gsc-oauth-client.json + gsc-token.json
  are gitignored, exist only on the owner's machine; ask owner to run
  the exporters (run-*.ps1) if fresh data needed. Last full pull:
  tools/gsc/reports/gsc-live-2026-06-09/ (pages.csv 2561 rows,
  queries.csv 39144 rows).
- WP REST credentials: WP_BASE_URL, WP_USER, WP_APP_PASSWORD are SET in
  the session Environment (verified 2026-07-02, administrator role).
  Never commit, never print values. GitHub push works through the
  session's git proxy.
- Mapbox public token (pk): stored ONLY in the live DB option
  justice_ops_mapbox_public_token; justice-ops filters it into
  justice_theme_mapbox_public_token(). NOT in the repo: GitHub push
  protection hard-blocks Mapbox tokens (learned 2026-07-02). LawyerScout
  map verified live with it. Owner still owes the token a URL
  restriction to https://jus-tice.co.il in the Mapbox dashboard. The
  Mapbox SECRET sk token is NOT needed by anything we run; owner was
  advised to delete it.
- courtai repo (github.com/The-new-ben/courtai): public; sandbox blocks
  code download, page-level WebFetch reads work.

## 3. Architecture map (where everything is)
- functions.php: version+marker, loads inc/*.php list.
- Design system: assets/css/redesign.css (tokens --jt2-*; ivory canvas,
  navy #122c52, coral #e8624f; Frank Ruhl Libre 700 display + Assistant
  UI; WCAG AA contrast tokens --jt2-coral-text / --jt2-coral-text-dark;
  frosted radii 22-26px). Loaded LAST; legacy CSS remapped via vars.
- Homepage: front-page.php + page-home.php (identical lineup) using
  template-parts/redesign/*.php: hero, situational-router,
  ai-tools-strip (AI center + virtual courtroom panel + inline docket
  typewriter + localStorage handoff justice_ai_prefill), how-it-works,
  lawyer-revenue (prices from justice_theme_lawyer_plans + overrides:
  349/749/1490/2490 ILS), practice-areas (real term counts),
  content-tabs, stats-trust, faq (FAQPage JSON-LD), final-cta. Plus
  legacy sections: featured-lawyers (fact-review gated), ask-lawyer,
  find-lawyer-guide, home-page-content.
- Header/Footer: template-parts/layout/site-header.php (navy pill nav,
  topic bar with money keywords, 920px drawer via assets/js/
  navigation.js + html.nav-is-open), site-footer.php (4 columns, trust
  cards, floating WhatsApp with wide mobile label).
- AI tools app: page-legal-tools.php renders at /legal-tools/ (forced
  template via justice_theme_is_legal_tools_page in
  inc/legal-tools-app.php - the justice_legal_tool CPT slug collides,
  never trust is_page('legal-tools')). App = assets/js/
  legal-tools-app.js (53 tools incl. court-arena, contract-arena,
  hearing-simulation, witness-prep, cost-estimator; lead gate modal;
  speak-to-court turn with SpeechRecognition he-IL + speechSynthesis;
  matched-lawyers rail; simulate-this button carries any generated doc
  into the arena; genius quality directives appended to every enhance)
  + assets/css/legal-tools-app.css.
- Server logic hub inc/legal-tools-app.php: lead gate REST
  (justice/v1/legal-tools/lead: honeypot, consent, file upload as
  private attachment, area validation, contact_channel, review_request)
  -> marketplace bridge creates a real justice_lead so the EXISTING
  pipeline fires (inc/lead-classifier.php prio 20, inc/lead-routing.php
  prio 30: area match via practice-areas taxonomy + lead_routing_enabled
  + paid subscription_status, leads_received counter, billing status).
  matched-lawyers REST (approved-only via justice_theme_lawyer_profile_
  is_public_approved, verified-first, skills=terms). Article mesh
  filter appends area-matched tool CTAs to every article. Copy-hygiene
  one-shot sweep (em-dashes + AI tellers in DB) runs on next wp-admin
  visit, flag justice_copy_hygiene_done_v1.
- Agent/knowledge API: inc/knowledge-api.php: justice/v1/knowledge/
  schemas|articles|professionals (courtai-compatible contract names).
- SEO/EEAT: inc/content-clusters.php (11 hub-spoke map),
  inc/cluster-pillar-titles.php, inc/cluster-pillar-content-publisher
  (5 pillar bodies published w/ Yoast green + FAQ schema), inc/seo.php,
  inc/schema.php, inc/eeat.php + inc/authority.php (reviewer engine:
  Ben Betesh = site legal reviewer bottom-of-article; Maya Rotenberg =
  family-law ONLY; Sharon Nahari = client, draft, NEVER in schema).
- Directory: archive-justice_lawyer.php (approved-only, converting
  empty state), single-justice_lawyer.php (arena reverse CTA),
  template-parts/cards/lawyer-card.php.
- Lawyer funnel LIVE+smoke-tested: /lawyer-registration/ (free plan
  offered, POST works), /lawyer-plans/, /lawyer-dashboard/ (wp-login),
  manual approval then invoice model - no auto-billing.

## 4. Knowledge docs (read before the matching mission)
- project-control/million-dollar-wishlist-2026-07.md (ranked roadmap)
- project-control/courtai-knowledge-digest-2026-07.md (System3 PAC,
  juris-arena engines, schemas, comms models)
- project-control/legaltech-oss-research-2026-07.md (Harvey patterns;
  751k Israeli Supreme Court corpus on HF LevMuchnik/
  SupremeCourtOfIsrael; Knesset OData; Legal-HeBERT; eyecite concept)
- project-control/url-content-mismatch-audit-2026-07*.md and
  cannibalization-route-plan-2026-06.md (SEO debts, 6 slug/content
  mismatches await owner decision + WP write access)
- Design comps: uploaded zip Justice_Portal_Redesign (DesignTokens/
  StrategyDoc/9 page comps) - ask owner to re-upload if needed.

## 5. Standing rules (owner law - never violate)
- MANDATORY after every change: the live-verify skill
  (.claude/skills/live-verify). Never report done without proving it on
  the rendered live page, positive AND negative probes. Owner ordered
  this 2026-07-02 after a retired stock photo was still rendering.
- NO stock photos of people anywhere, ever (2026-07-02). The three
  stock visuals were deleted from repo AND server. Real, consenting
  people only (EEAT rule); no AI-generated people.
- Cache truth: SEVEN layers (uPress SeoEdge nginx edge cache purged
  only by HTTP PURGE per URL, sg-cachepress, Autoptimize, WP-Optimize,
  Asset CleanUp, object cache, owner browser).
- No em-dashes or en-dashes anywhere (code comments included). No
  Hebrew AI-teller phrases (חשוב לציין, בעידן המודרני...).
- No new public slugs / redirects / URL changes without per-URL owner
  approval ("no evil URLs").
- EEAT people must be real+consenting. Owner bottom-of-article only.
- AI output always framed as draft for attorney review, never advice,
  never outcome promises (Bar rules + FTC/DoNotPay precedent). FOMO/
  scarcity only lawyer-facing; consumer urgency = real deadlines only.
- All numbers on site computed from CMS, no mock content, validate
  links with justice_theme_safe_public_link.
- WCAG AA: verify any new text/bg pair >= 4.5:1 (formula pass done).

## 6. State now
- TRAFFIC EMERGENCY SWEEP 2026-07-06 (theme 2.22.0 pushed, ops 1.0.10
  LIVE): index health verified clean first (no noindex, canonicals OK,
  sitemap 200; drop is not a technical self-wound; fresh GSC export
  still owed by owner). Batch 4 shipped: 14 receiving pages retargeted
  head-first across criminal, drugs, real estate, buy-sell home,
  malpractice, USA, Cyprus, Greece, abroad-invest, business families
  (about 1.1M impr/mo, under 600 clicks). 13 of 14 verified rendering
  live via the ops SEO bridge; /medical-malpractice-lawyer/ resolves
  to the practice-areas TERM page (not singular) so the bridge skips
  it, native on pull. Homepage money-hubs band (exact-match anchors to
  12 hubs, dead slugs skipped) is in theme 2.22.0, renders after owner
  pull; live theme still 2.19.1. NEXT: owner pull retires all bridges;
  fresh GSC export to diagnose the drop date and confirm lifts.
- SEO strikes are LIVE agent-side (2026-07-03, justice-ops 1.0.9 SEO
  bridge, self-retires at theme 2.21.2): directory family + divorce
  head-term titles, descriptions, H1s and intros verified rendering.
  DB one-shots executed with owner authority ("you pull, we fixed the
  pipeline"): post 20212 and its SAME-SLUG twin post 11813
  (lawyer-divorce-guide-proceedings-costs-rights, duplicate slug, the
  twin renders as a second embedded article header) retitled dash-free
  and de-cannibalized (20212 = rights guide, 11813 = process steps).
  OWNER DECISION QUEUE: merge or unpublish one of the twins; the
  duplicated article header markup is a theme bug to fix at next theme
  release. Directory H1 still says the old text until theme pull
  (template variable, unbridgeable). Related-card titles of OTHER posts
  still carry DB dashes sitewide: extend the copy-hygiene sweep next.
- HEAD-TERM STRIKE shipped 2026-07-02 (theme 2.21.2, marker
  head-term-divorce-strike-v1, lands on owner pull): one page now owns
  the bare head term עורך דין גירושין (8.5k impr, family 81k): the
  family pillar /divorce-lawyer/ (exact-phrase title, H1, intent-mirror
  intro naming both court systems; Maya reviewer box already renders
  there). De-cannibalized: trusted-divorce-attorney-guide (23.7k impr,
  pos 72) now owns the מומלץ reputation sub-family and loses its
  stuffed title plus AI-teller opener;
  lawyer-divorce-guide-proceedings-costs-rights stops opening with the
  bare head phrase, owns זכויות וייצוג. Anatomy and rationale:
  project-control/serp-anatomy-divorce-lawyer-2026-07.md. OWNER
  DECISION QUEUE addition: /review-of-divorce-by-divorce-lawyer-israel/
  is a live 404 with 11,280 impr/mo (restore vs 301, per-URL approval
  required). Measure family at next GSC pull; one retitle per cycle.
- SERP strike shipped 2026-07-02 (theme 2.21.1, marker
  serp-directory-family-v1, lands on owner pull): the lawyer DIRECTORY
  family (22.4k impr/mo across "חיפוש עורך דין לפי שם", "איתור",
  "אינדקס", "מאגר", "לפי מספר רישיון", pos 7-12, CTR under 0.7%).
  Directory title now head-first ("חיפוש עורך דין לפי שם, תחום ועיר |
  אינדקס Jus-Tice"), H1 matches, desc weaves בחינם + מספר רישיון + bar
  registry verification line on page. De-cannibalized:
  how-to-find-qualified-lawyer-israel-guide retitled to the how-to
  sub-intent ("איך לבחור עורך דין: בדיקות חובה"), it no longer opens
  with the directory head term. Measure in next GSC pull (2-4 weeks):
  watch the family CTR and the guide's איך-לבחור rankings. Do not
  retitle these again within the cycle. Follow-up found: the seeded
  Yoast homepage metadesc option still contains an em dash (seed
  metadesc-home-wpseo, seo.php line ~185); fix needs a one-shot DB
  update via justice-ops, seed flag already consumed.
Marker 2026-07-03-verified-case-reviews-v1 (v2.9.0) shipped: hygiene
sweep wp-admin hotfix (the sweep no longer wp_dies on marker-flagged
posts; it skips them and records them under flagged_for_review in the
justice_copy_hygiene_done_v1 option) + the full verified per-case
REVIEWS system (mission 1 DONE). Previous marker
2026-07-03-courtroom-panel-owner-pass-v1 was verified live incl. full
funnel smoke test. Owner still owed: wp-admin visit (triggers the
hygiene sweep, now safe); decision on 6 slug/content mismatches;
review of any flagged_for_review post IDs after the sweep runs.

Full system check 2026-07-02 (owner reported "CMS is not right"):
site is healthy. Funnel URLs all 200, all justice/v1 routes
registered, schema and sitemaps fine. Real findings, owner decisions
pending:
- /jus-tice-2/ is an OLD DUPLICATE of the homepage page (the real
  front page is page ID 38). It renders identical homepage content at
  its own URL (HTTP 200). Mitigations already in place: canonical
  points to /, not in the sitemap. Recommended (needs per-URL owner
  approval): 301 /jus-tice-2/ to / and unpublish the duplicate page.
  Add to the slug-mismatch queue.
- The "components of the homepage" picture-repeater metabox seen on
  page edit screens is NOT from this repo (theme or bundled plugins).
  It is a legacy live-only field group (ACF era). Nothing in the
  current theme reads those fields, so editing those pictures changes
  nothing on the site. All live imagery is theme-controlled via git
  (assets/images + templates). Candidate for cleanup in wp-admin.
- The empty main editor on the homepage pages is expected: the
  redesign homepage is template-driven (template-parts/redesign).
- Live plugin list is heavily bloated (Elementor, Jetpack, WooCommerce
  in store-coming-soon mode, AMP, Hostinger Migrator, multiple
  optimizer/cache plugins). Perf + security surface. Worth a dedicated
  owner-driven cleanup session with a keep/remove list.
- guide-hero.jpg retired 2026-07-03 (owner request): /legal-tools/
  hero now uses ask-lawyer-visual.jpg, homepage guide section is
  text-only until the mission 2 photography set is approved.

SEO hierarchy + internal-linking pass 2026-07-03 (owner-ordered,
advances mission 4, render-layer only, grounded in the GSC 2026-06-09
strike zone: positions 4-25 with real impressions):
- Pillar hub block (inc/content-clusters.php,
  justice_theme_render_cluster_hub_links, the_content prio 21): every
  pillar now links DOWN to all live spokes plus the area directory and
  the practice-areas taxonomy hub. Completes the hub-and-spoke both
  ways (spokes already linked up at prio 20).
- Money-query map (inc/seo.php) extended with 9 strike-zone pages,
  title+meta only (intro override is now optional): hesekem gerushin
  behaskama / bitul rishum plili / teudat yosher / drugs / criminal
  cost / buy-sell apartment / Greece / Cyprus / Cyprus lawyer.
- Practice-areas taxonomy overrides added for criminal-law,
  family-law, medical-malpractice, traffic-law, inheritance-law,
  torts (titles carry the exact strike-query vocabulary).
- Directory head terms: /lawyers/ default title now targets
  "עורכי דין מומלצים" + "חיפוש עורך דין לפי שם" (8.7k monthly
  impressions combined) with a matching meta description.
- All titles sized 50-60 chars (Zyppy low-rewrite band), no dashes,
  no AI tellers, no outcome promises.

SEO batch 2 same day (marker 2026-07-03-seo-strike-batch2-v1):
- 10 more money-map overrides after mapping strike queries to their
  live ranking pages via the WP search API: indictment withdrawal,
  DUI test refusal, money laundering, probate objection, spouse
  assault, military lawyer, land registry (tabu), notary, criminal
  price list, criminal lawyer Tel Aviv. Plus year-freshness overrides
  (justice_theme_year_fresh_seo_map, wp_date based, never stale) for
  divorce-costs-2025, mutual-divorce-agreement-2025,
  real-estate-lawyer-cost-2025, online-rent-agreement.
- Cluster mesh: 8 orphaned criminal pages (incl. military + city
  pages), 3 landlord/tenant pages (rental-agreement-guide,
  online-rent-agreement, commercial-lease-israel) and the
  driving-under-influence slug variant joined as spokes, so the hub
  block and backlinks now cover those families.

OWNER DECISION QUEUE from this audit (blocked on no-evil-URLs rule):
1. Five dead URLs with big GSC history, all 404 now: restore or 301:
   /how-much-does-a-lawyer-cost/ (17.5k impr),
   /what-is-child-custody/ (10.8k), /leading-criminal-law-firm/
   (10.6k), /buying-property-abroad-guide/ (PILLAR of the 100k-impr
   abroad cluster), /real-estate-tax-advisor/ (tax pillar).
2. Mis-slugged money pages (url-content-mismatch audit): child
   support slug serves the police-stations article; landlord/tenant
   slug serves a COVID health post. Re-slug needs owner approval.
3. Competitor gap (LawReviews wins "עורך דין פלילי מומלץ" 13.2k impr
   family with a review-count trust token in the title): once the
   verified reviews system accumulates approved reviews, render
   computed "לפי N ביקורות" tokens in directory/taxonomy titles.
   Zero mock numbers; wire only when N is real.
4. Documented competitor research for din.co.il/psakdin/mishpati does
   not exist yet; only LawReviews is analyzed (TITLE-BLUEPRINT doc).

Reviews premium pass (owner approved 2026-07-03, marker
2026-07-03-reviews-premium-maps-v1):
- Directory title trust token: /lawyers/ title renders "עורכי דין
  מומלצים לפי N ביקורות מאומתות" once sitewide approved review count
  reaches 10 (filter justice_theme_directory_review_token_threshold);
  N computed by justice_theme_total_approved_review_stats (12h
  transient, invalidated on every aggregate recompute). Below the
  threshold the plain head-term title renders. Never a mock number.
- Lawyer profile titles append a computed "דירוג X מתוך 5 (N
  ביקורות)" token behind the same public gates as on-page display.
- Profile reviews panel upgraded to directory-leader standard: big
  average + stars + count + per-star breakdown bars
  (justice_theme_lawyer_review_breakdown) + outbound "ביקורות בגוגל"
  link when google_business_profile_url is set (nofollow).
- Google Maps embed on profiles (justice_theme_lawyer_map_embed_url,
  keyless maps?q= iframe, place_id preferred over address), only for
  fact-checked/approved profiles, lazy loaded, in a sidebar box.
- Intake page: case-linked reviews now use one-tap star rating (pure
  CSS radio stars, keyboard accessible) instead of a select; after
  submit, everyone (no rating gating, Google policy) sees a "כתיבת
  ביקורת בגוגל" cross-ask when the lawyer has
  google_review_request_url set.
- Still owner-blocked: restore-vs-301 choice per dead URL (list
  above); owner wrote "i approve" but did not pick restore or 301 per
  URL, so no URL was touched.

Google Business reviews embed (owner-ordered, marker
2026-07-03-google-reviews-embed-v1): inc/google-reviews.php pulls the
office's REAL Google rating, count and up to 4 newest reviews via the
official Places API (server-held key: JUSTICE_GOOGLE_PLACES_KEY in
wp-config or the mu-plugin filter justice_theme_google_places_api_key,
placeholder added to upress-upload/justice-ai-mu.php). Place ID
auto-resolves once from firm name + office address and persists to
google_place_id. 12h transient cache per profile, 1 resolve attempt
per day. Rendered on approved profiles as an attributed Google panel
(brand mark, stars, per-review cards, "מתוך Google" attribution,
link to all reviews). Deliberately EXCLUDED from Review/
AggregateRating schema: first-party reviews only in structured data,
per Google policy. Feature is sellable to every lawyer: key once,
then any profile with an address gets its live Google reviews.
OWNER SETUP REQUIRED: create a Google Cloud key with Places API
enabled, restrict it, add the define to wp-config.php.

Flagship showroom profile (owner-authorized in writing 2026-07-02,
marker 2026-07-03-maya-showroom-diamond-v1): advocate-maya-rotenberg
is the site's premium reference profile. One-shot migrations (run on
next wp-admin visit): full featured/active/verified tier + routing,
featured_on_front, priority 100, and complete profile enrichment
(headline, bio, 8 services, approach, 4 process steps, credentials
incl. Dun's 100 + BDI 2024-2026 + mediator + Bar committee + the
919/15 case as cited on the office site, FAQs, CTA), portrait
sideloaded from the office site (owner holds the asset rights;
screened: real photo, no flags/foreign text). Maya-specific photo
hard-blocks in card + profile templates now defer to the fact-check
status. EEAT: the authority engine already routes family-law content
to her as reviewer; verification activates it. Diamond CSS tier for
paid profiles: hover lift, photo zoom, badge sheen, staggered proof
rise, all behind prefers-reduced-motion. NOT done, by rule: no
fabricated reviews (verified pipeline only), no generated imagery,
no video URL (none published on the office site; owner can paste one
into profile_video_url).

REVIEWS system map (inc/lawyer-reviews.php + extended
inc/lawyer-recommendations.php):
- Case-linked tokens: justice_reco_token gains
  recommendation_token_lead_id; justice_theme_create_case_review_token
  only mints for a lawyer actually on the lead (assigned_lawyer_id or
  routed_to_lawyer_ids), revokes older active tokens per lead+lawyer.
- Intake (same one-time token URL): case-linked submissions REQUIRE a
  1-5 score, store reviewed_lead_id + reviewed_case_area, and get
  source type verified_client (courtai ratings schema).
- Moderation unchanged (justice_recommendation queue): owner sets
  approved_public + permission confirmed; the sync hook then promotes
  the post to publish and recomputes the lawyer's review_count +
  average_rating from approved rated reviews only; first approved
  review auto-sets review_display_enabled=approved (filter
  justice_theme_reviews_auto_enable_display).
- Display: card shows star+avg+count; profile reviews panel shows
  per-review stars, verified-client badge, case area; matched-lawyers
  REST + knowledge professionals expose rating/reviewCount (courtai
  professional.json names) and the tools rail renders them.
- Schema: Attorney JSON-LD gains aggregateRating + review nodes via
  justice_theme_lawyer_review_schema_fields, same gates as display.
- Invite surfaces: metabox on the justice_lead edit screen (owner) +
  lawyer dashboard per-lead button (stages first_attempt/contacted/
  consult_scheduled/won) with one-time link + WhatsApp share.
- Shared gate helper: justice_theme_lawyer_reviews_public_state
  (seed/fact-gate/Maya aware). Use it for any new rating surface.


PIPELINE ARMED AND SMOKE-PASSED ON LIVE (2026-07-02): the agent-driven
REST pipeline is operational end to end. Owner supplied an admin
application password (held in session chat / to be added to the repo
Environment settings as WP_USER + WP_APP_PASSWORD + WP_BASE_URL; NEVER
committed). Verified live: administrator role with install/update
capabilities; Code Snippets 3.9.6 installed and activated VIA REST
(POST wp/v2/plugins); full temp-route loop smoke: create snippet ->
authed call OK -> unauthed 401 -> delete 204 -> route 404 -> homepage
200 and healthcheck intact. Agents can now run one-shot privileged
operations and plugin installs without owner clicks. Theme code still
reaches live only via uPress git pull.

CRITICAL STACK CORRECTION discovered via live plugin inventory: the
active companion plugin on live is ultra-justice-engine 1.0.0 (the
folder previously documented as legacy), NOT justice-core. justice-core
is NOT installed on live. NEVER install/activate the justice-core zip
while ultra-justice-engine is active: near-identical function names
mean a probable fatal redeclaration. Any plugin deploy must target
ultra-justice-engine or first migrate it. Live also runs 64 active
plugins (bloat list captured 2026-07-02; includes duplicates like two
schema plugins inactive, AMP, Jetpack, Pods+CPT-UI+ACF together);
plugin cleanup remains an owner-approved future session.


LAWYERSCOUT MAP + JUSTIA/DIN REDESIGN (owner approved 2026-07-02):
- Design authorized: Justia look (white, blue #14477D/#1866B4, orange
  red #E4572E CTAs, mega menu, sans-first Assistant) + din.co.il card
  functionality. Mock at the session artifact justia-din-homepage-v1.
  Build order: header+mega menu, hero v2 (din-style with the 3D map
  teaser as the hero visual, no stock photo), cards v2, bands. SEO is
  a first-class requirement of the redesign: hierarchy, breadcrumbs,
  practice-area silo isolation, EEAT, plus a competitor gap-mapping
  and content plan (din/psakdin/lawguide) = next big session.
- Map foundation SHIPPED (inc/legal-map.php, assets/js/legal-map.js,
  template-parts/redesign/legal-map.php, homepage center): Mapbox GL
  v3 (owner already holds a key; chosen over Google for 3D + styling
  + cost), justice_place CPT for imported POIs, GET
  /justice/v1/map/offices GeoJSON (approved lawyers with office_lat/
  office_lng + published places, 1h cache), admin POST
  /map/import-places (batch, dedupe, Israel bbox gate), admin POST
  /map/geocode-missing (Mapbox geocoder, 20 per call). Click-to-load,
  clustered, 3D pitch, rich RTL popups, nearest-to-me geolocation.
- OWNER SETUP: add define('JUSTICE_MAPBOX_PUBLIC_TOKEN','pk...') in
  wp-config (restrict token to the domain in Mapbox dashboard). Until
  then the map section renders nothing. Then run geocode-missing via
  the pipeline until remaining=0, and feed the collection agent's
  batches (prompt: project-control/map-data-agent-prompt-2026-07.md)
  into /map/import-places.

## 7. NEXT MISSIONS (execute in order, one per session, ship live)
1. DONE 2026-07-03: REVIEWS (see section 6). Follow-ups if needed:
   review-request email automation and per-area review snippets on
   city x area pages once mission 3 exists.
2. CARDS V2 + PHOTOS: rich premium lawyer cards (response-time badge,
   case-focus chips, video slot, availability, editorial quote,
   full-bleed photo header) monetized into Featured tier; replace
   guide-hero.jpg + hero photography with European-Israeli top-firm
   look (screen every candidate: no flags, no foreign text, no AI
   images). Owner hates current guide photo.
3. PROGRAMMATIC SEO: city x area pages (עורך דין {area} ב{city}) from
   real directory+guides data with FAQ schema and cannibalization
   guard against the 10 pillars; internal-link mesh.
4. CONTENT OFFENSIVE: fresh GSC pull (owner runs exporter), SERP
   reverse-engineering on money keywords (עורך דין גירושין/פלילי/
   מקרקעין/דייר ומשכיר/נדל"ן בחו"ל), rewrite pillar openings (TLDR
   200 words), fix cannibalization per plan doc, meta descriptions.
5. HEBREW RAG MOAT: vector-index the Supreme Court corpus + Knesset
   OData behind the existing proxy; grounded answers with cited
   sources + Hebrew citation linker (eyecite concept). New infra -
   propose architecture to owner first.
6. GROWTH LOOPS: WhatsApp Business webhook lead intake (courtai model),
   paid 15-min video consult booking, lawyer ROI monthly email, digital
   PR fee-index study.
Always: after each mission run the funnel smoke test (section 3 URLs)
and keep this file updated.
