# CONTENT WAR MACHINE — full handoff for the article-writing agent

You are a Claude Code session on the jus-tice.co.il repo running a LONG
content expedition: fill every money-keyword gap with deep, competitor-
grade Hebrew articles that strengthen PILLARS, then publish them live,
schema and mesh included, verifying every one. This is head-to-head
war with the incumbents, not generic blogging. Read this whole file
before writing a single word. Everything you need is named here: skills,
credentials, targets, quality bar. Do not go looking; it is all below.

## 0. The one rule that decides survival (read first)

Lily Ray, May 2026: of 220+ sites that SCALED AI content, 54% lost 30%+
of peak organic traffic. The formats that got killed: mass "what is X"
glossaries, self-promo listicles, comparison pages at scale, anything
published fast and thin. We do the OPPOSITE and it is non-negotiable:
- FEWER, DEEPER pages. One 3,000+ word authority piece per gap, not ten
  shallow ones. Quality gate before publish, always.
- Every article must contain something only THIS company can say: a real
  Israeli-law procedure, a real court/tribunal name, a real fee range, a
  real statute or ruling, a real step-by-step a practitioner would give.
  If a paragraph could sit on any generic site, rewrite it.
- Match and BEAT the top-3 competitor pages structurally (headings,
  entities, schema, depth), never copy their text. Clone DNA, not words.
- No invented numbers, no fake reviews, no outcome promises, never a
  superlative in a title. These are the ways sites in our position die.

## 1. Repo, skills, credentials (all already here)

- Repo root = the theme. Branch main = LIVE. Work on branch
  claude/justice-handoff-briefing-rdr885, push to BOTH that branch and
  main (git push -u origin HEAD:main && ... HEAD:<branch>).
- SKILLS (.claude/skills/, invoke by reading the SKILL.md):
  - serp-anatomy: reverse-engineer a SERP end to end (autocomplete
    demand, top-10 composition, verbatim #1 teardown, why-they-win,
    gap plan). RUN THIS PER ARTICLE before writing. It already knows
    the environment blocks (Google full-page scrape fails; use GSC +
    autocomplete API + WebSearch top-10 + curl competitor landing pages).
  - serp-strike: the title/description/H1 layer, money-map in inc/seo.php.
  - live-verify: MANDATORY after every publish. Prove it on the rendered
    live page, positive AND negative probes, purge all caches.
  - wp-deploy: the justice-ops pipeline and the six cache layers.
  - serp-dna-expedition-2026-07.md + serp-anatomy-divorce-lawyer-2026-07.md
    in project-control/: worked competitor teardowns, copy their method.
- CREDENTIALS (in the session environment, never print, never commit):
  - GSC: service account gsc-reader@jus-tice-theme.iam.gserviceaccount.com
    added to https://jus-tice.co.il/ property. Mint a token by signing a
    JWT with raw openssl (python-cryptography and gcloud are BROKEN in this
    container). Exact recipe in section 6. Fresh data in
    reports/gsc-live-2026-07-06/.
  - WP REST: env WP_USER / WP_APP_PASSWORD / WP_BASE_URL, administrator.
    Publish with: curl -u "$WP_USER:$WP_APP_PASSWORD" ... POST
    /wp-json/wp/v2/posts (NOT pages, unless it is a pillar). Note: use
    curl, python urllib gets a 405 through the proxy.
  - OpenAI (for drafting): key lives ONLY on the server mu-plugin; the
    endpoint /wp-json/justice/v1/generate is live but rate-limited (30/day
    site). For a long expedition, the OWNER runs the drafting in ChatGPT
    (section 4) and pastes drafts back, OR you draft in-session. Do NOT
    burn the server endpoint for 3000-word drafts.

## 2. Iron rules (owner law — violating any = revert)

No em/en dashes anywhere. No Hebrew AI-teller phrases (חשוב לציין,
בעידן המודרני, מעבר לכך, לסיכום, ראוי לציין, יש לזכור). No new URL slugs
without the owner approving that exact slug first (list proposed slugs,
wait). AI output is a DRAFT for attorney review, never legal advice or an
outcome promise; every article ends with the standard disclaimer +
reviewer byline (inc/authority.php: Ben Betesh sitewide; Maya Rotenberg
family-law ONLY; never put the client Sharon Nahari in schema). Every
number from real data. php -l before any code push. Run live-verify
before reporting anything done.

## 3. The per-article workflow (repeat for each target)

1. RECON (serp-anatomy): pull the query family from GSC, get the
   autocomplete demand map, WebSearch the top 10, curl the top 3 landing
   pages, record their exact H1, first paragraph shape, heading skeleton,
   entities, schema @types, word band. This is the blueprint to beat.
2. ANTI-CANNIBALIZATION CHECK (mandatory): search existing content for
   the head term:
   curl "$WP_BASE_URL/wp-json/wp/v2/search?search=<term>&per_page=5"
   and check inc/content-clusters.php. If a page already targets this
   query, you STRENGTHEN that page (add sections, schema, depth) — you
   do NOT create a competitor to ourselves. New article only when no
   existing page owns the intent. Log the decision.
3. BRIEF: write the H2/H3 skeleton that covers every entity and PAA the
   top-3 cover PLUS at least two sections they miss (the Israeli-procedure
   depth only we add). Assign the head keyword to H1 + first sentence,
   secondary keywords to H2s, the vocabulary the winners use throughout.
4. DRAFT 3,000+ words (section 4 for the ChatGPT method). Hebrew, RTL,
   real procedures, real court names, real fee ranges, real statutes.
5. QA GATE before publish: word count >=3000; head term in H1, first
   paragraph, and >=3 H2s; every competitor entity present; two unique
   depth sections; zero dashes; zero AI-teller phrases; disclaimer +
   reviewer byline; internal links present (step 7); FAQ block for schema.
   If any fails, fix before publishing. Never publish to hit a count.
6. PUBLISH via REST as an 'articles' post (or strengthen existing).
   Set the Yoast focus keyword + meta via post meta if the field is
   writable, else add the money-map entry in inc/seo.php and bridge it.
7. MESH (strengthen the PILLAR, per owner): add the new article as a
   spoke in inc/content-clusters.php under its family, with an EXACT-
   MATCH anchor. Add a contextual in-body link UP to the pillar and
   sideways to 2-3 sibling spokes, anchors = their head queries. The
   pillar hub block and spoke backlinks then render automatically.
8. SCHEMA: Article + FAQPage (from the FAQ block) + BreadcrumbList must
   render. Verify @types in the live HTML.
9. LIVE-VERIFY: purge caches (justice-ops route + SeoEdge PURGE per URL),
   fetch the rendered page, assert title/H1/first-para/schema present,
   assert no dashes, confirm the sitemap lists it and robots is index.
10. LOG in project-control/content-war-log-2026-07.md: slug, family,
    target query, competitor beaten, word count, schema, mesh links,
    live-verify result, GSC baseline position for later measurement.

## 4. Drafting method (ChatGPT, or in-session) — the per-article prompt

Best model for 3,000-word Hebrew legal depth: GPT-4.1 / o-series high
reasoning (the "high" setting the owner mentioned). Temperature moderate.
Feed it the recon output as context. Use THIS structure every time:

  ROLE: Senior Israeli legal content strategist writing for jus-tice.co.il,
  head-to-head against [competitor URLs from recon]. Hebrew, RTL.
  INTENT: [informational / commercial] for query "[HEAD QUERY]".
  BEAT THESE: [paste the top-3 H1s, first paragraphs, heading skeletons,
  entity lists, schema types from serp-anatomy recon].
  WRITE: a 3,000+ word Hebrew article that covers every heading and entity
  the top 3 cover, in the same vocabulary, PLUS these depth sections only a
  real Israeli practitioner adds: [2-3 procedure/fee/statute sections].
  STRUCTURE: H1 = [head query first]. First sentence mirrors the query and
  states a concrete fact or number. H2s = [brief skeleton]. Include a
  5-8 item FAQ using real "People Also Ask" questions from the SERP.
  HARD BANS: no em/en dashes; no phrases חשוב לציין/בעידן/לסיכום/יש לזכור;
  no superlatives; no outcome promises; no invented statistics — mark any
  number that needs a real source as [VERIFY].
  END WITH: a general-information disclaimer (not legal advice).
  Return clean HTML: <p>, <h2>, <h3>, <ul>, no inline styles except
  text-align: justify on paragraphs.

Then YOU verify every [VERIFY] against a real source before publishing,
and replace or cut it. Never publish an unverified number.

## 5. THE TARGET LIST (priority order, by addressable impressions)

Money families and their scale (GSC 2026-06 full-month + 2026-07 fresh).
For each: STRENGTHEN the pillar first, then add the missing spokes. Do
NOT create pages that cannibalize the pillar. Slugs marked NEW need owner
approval before creating.

### TIER 1 — biggest money, most competitive
1. CRIMINAL (320k impr/mo). Pillar /criminal-defense-attorney/ (96k, pos
   ~58). Rating page /criminal-lawyers-rating/ live (needs real lawyers).
   Gap spokes to WRITE (each 3000w, meshed to pillar): עורך דין מעצרים;
   עורך דין שימוע לפני כתב אישום; סגירת תיק פלילי בהיעדר אשמה/חוסר עניין
   לציבור; עבירות מין הליך וזכויות; עבירות נשק; צווארון לבן ומרמה; עבירות
   סייבר; המשפט הצבאי (מצ"ח, עריקות, נפקדות). Strengthen existing
   /drug-related-crime/ + /drug-trafficking/ to full depth.
2. REAL ESTATE IL (309k + 63k buy-sell). Pillar /real-estate-attorney/
   (pos ~64 — big opportunity). Spokes: ליווי משפטי בקניית דירה מקבלן;
   מכירת דירה שלבים ומיסוי; חוזה מכר מה חובה שיופיע; מיסוי מקרקעין מס
   רכישה ומס שבח; בדק בית וטאבו; פינוי בינוי ותמ"א 38 לדיירים. Add price
   TABLES (the winning format on cost queries).
3. MEDICAL MALPRACTICE (124k). Pillar /medical-malpractice-lawyer/ (pos
   ~65). Query-network spokes (one per injury, exact-match): רשלנות
   רפואית בלידה; רשלנות בהרדמה (page exists, deepen); שיתוק מוחין; רשלנות
   בניתוח; רשלנות באבחון; רשלנות רפואית בשיניים. Each: how you prove
   negligence + causation, the medical-opinion requirement, fee-by-%.

### TIER 2 — high-value, high-intent leads
4. FAMILY/DIVORCE (81k). Pillar /divorce-lawyer/ struck. Deepen the
   הסכם גירושין cluster (הסכם גירושין at pos 8 with 1,297 impr, 2 clicks —
   snippet + depth win). Spokes: משמורת משותפת; מזונות ילדים חישוב 2026;
   ידועים בציבור זכויות רכוש; חלוקת רכוש ואיזון משאבים; גישור גירושין.
5. INHERITANCE (est. tens of k). Pillar /inheritance-lawyer/. Spokes:
   צו ירושה איך מוציאים; התנגדות לצוואה עילות והליך; סכסוכי ירושה בין
   יורשים; עריכת צוואה סוגים ותקינות; עיזבון וניהולו.
6. LABOR (37k+). Pillar /labor-lawyer/. Spokes: פיטורים שלא כדין; שימוע
   לפני פיטורים זכויות; פיצויי פיטורים חישוב; הטרדה מינית בעבודה; שעות
   נוספות וזכויות שכר.

### TIER 3 — money abroad (rich clients, less competition, guides win)
7. REAL ESTATE ABROAD (Cyprus 48k, Greece 52k, abroad 56k). Deepen
   existing guides with price TABLES + FAQ schema per country. Add:
   רילוקיישן לפורטוגל (pos 18, real gap); אזרחות פורטוגלית; קניית נכס
   ביוון מס ותשואה; קפריסין מיסוי ובעלות.
8. LAWYERS/IMMIGRATION USA (37k). Deepen /usa-lawyers/, /choose-usa-
   attorney/. Add: ויזת השקעה לארה"ב (EB-5); גרין קארד מסלולים;
   רילוקיישן לארה"ב היבטים משפטיים.
9. BUSINESS (38k, page-1 CTR failure — fastest). Deepen /types-of-
   lawyers-small-business/. Add: הקמת חברה שלבים; הסכם מייסדים; קניין
   רוחני לעסק; חוזים מסחריים בדיקה.

Run TIER 1 first, one family at a time, pillar-then-spokes, verifying
each. Expect 40-60 articles across all tiers. This is a marathon; do it
right, log each, never spray.

## 6. GSC token recipe (copy exactly — the broken-container workaround)

  # 1. write the SA json (from env) to a 600-perm file
  # 2. build the JWT header+claims (base64url), then:
  SIG=$(openssl dgst -sha256 -sign key.pem -binary jwt-unsigned | base64 -w0 | tr '+/' '-_' | tr -d '=')
  JWT="$(cat jwt-unsigned).$SIG"
  curl -s -X POST https://oauth2.googleapis.com/token \
    -d grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer \
    --data-urlencode "assertion=$JWT"
  # 3. POST to searchAnalytics/query with Bearer token, site
  #    https://jus-tice.co.il/ (url-encoded in the path).
  # Full working script: reports/gsc-live-2026-07-06/ was built this way.

## 7. Definition of done, per article and per session

Per article: recon done, not cannibalizing, 3000+ words of real depth,
QA gate passed, published, schema live, meshed to pillar with exact-match
anchors, live-verified, logged. Per session: pillar strengthened before
its spokes, families done one at a time, every claim real, GSC baseline
recorded so the next session measures movement. Report to the owner the
list shipped, the competitors beaten, and the pages that still need him
(real lawyer onboarding, any [VERIFY] he must confirm, any new slug).
