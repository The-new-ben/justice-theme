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
- Two channels: A=theme code via git; B=database content via REST or
  gated admin routines (pattern: option flag + justice_theme_admin_cms_
  write_enabled filter, run once on wp-admin visit).

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
- WP admin/app passwords: NOT held by agents; ask the owner. GitHub
  push works through the session's git proxy.
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
Marker 2026-07-03-verified-case-reviews-v1 (v2.9.0) shipped: hygiene
sweep wp-admin hotfix (the sweep no longer wp_dies on marker-flagged
posts; it skips them and records them under flagged_for_review in the
justice_copy_hygiene_done_v1 option) + the full verified per-case
REVIEWS system (mission 1 DONE). Previous marker
2026-07-03-courtroom-panel-owner-pass-v1 was verified live incl. full
funnel smoke test. Owner still owed: wp-admin visit (triggers the
hygiene sweep, now safe); decision on 6 slug/content mismatches;
review of any flagged_for_review post IDs after the sweep runs.

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
