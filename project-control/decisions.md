# Decisions Log

Append-only. Each decision: WHAT, WHY, ALTERNATIVES, REVERSIBILITY.

---

## D-001 — Theme structure: Hebrew-first, RTL native
**Date:** 2026-05-08 (previous session)
**What:** Theme is built Hebrew-first with `dir="rtl"`, all UI strings in Hebrew via `__()`.
**Why:** Site is for Israeli legal market. Hebrew is primary, not bolt-on.
**Alternatives:** English-first with translation layer; bilingual switch.
**Reversibility:** Hard — pervasive throughout templates.

---

## D-002 — Plugin name: `jus-tice-engine`
**Date:** 2026-05-08
**What:** Single canonical plugin folder `jus-tice-engine/`, main file `jus-tice-engine.php`, prefix `jte_`.
**Why:** Eliminates the duplicate-plugin confusion observed earlier (multiple Justice* plugins).
**Alternatives:** Theme-level functionality (rejected — theme switches break CPTs).
**Reversibility:** Possible but disruptive (would need data migration).

---

## D-003 — CPT slug for lawyers: `justice_lawyer` (NOT `lawyer`)
**Date:** 2026-05-08
**What:** Lawyer post type uses slug `justice_lawyer`. Archive URL is still `/lawyers/` via rewrite.
**Why:** `lawyer` is too generic and conflicts with future plugin imports / theme-builder fields.
**Alternatives:** `lawyer`, `attorney`, `pro` — all rejected.
**Reversibility:** Possible via `register_post_type` arg change + DB rename query — disruptive.

---

## D-004 — Lawyer plan slugs: `free | pro | featured | lead_partner | full_service`
**Date:** 2026-05-08
**What:** Five plan tiers with these exact slugs.
**Why:** Mirrors industry standard (Justia premium tiers, din.co.il listing levels).
**Alternatives:** `basic | premium | elite` (rejected — generic, lower-value branding).
**Reversibility:** DB migration if changed.

---

## D-005 — URL strategy: short English slugs at root for pillar pages
**Date:** 2026-05-10 (this session)
**What:** Pillar pages live at `/divorce-lawyer/`, `/criminal-lawyer/`, etc. — NOT under `/practice-areas/`.
**Why:** Owner directive. Cleaner SERP display, easier to remember, matches Justia/competitor patterns.
**Alternatives:** Hebrew slugs (rejected — owner directive); under `/practice-areas/` (rejected — extra hierarchy hurts ranking).
**Reversibility:** Easy if pillar pages aren't yet created. Hard if redirected URLs are already live.
**Operational implication:** Pillar PAGES must be created in WP Admin with these slugs. Until then, code falls back to taxonomy term link or directory filter URL.

---

## D-006 — Pillar pages are WordPress PAGES, not taxonomy archives
**Date:** 2026-05-10
**What:** `/divorce-lawyer/` is a WP Page with rich content, NOT a redirect to `/practice-areas/family-law/`.
**Why:** Pages support full editorial control (1500–3000 words, FAQ schema, lawyer carousel, custom layout). Taxonomy archives are query-driven and limited.
**Alternatives:** Taxonomy archives as canonical (rejected — limited control); CPT `pillar` (rejected — overkill).
**Reversibility:** Possible.

---

## D-007 — Combinatorial directory URLs are noindexed
**Date:** 2026-05-10
**What:** `/lawyers/?city=X&area=Y` and `/lawyers/?keyword=X` get `<meta name="robots" content="noindex,follow">`.
**Why:** Combinatorial filters multiply into hundreds of thin-content URLs that hurt site quality. `follow` preserves crawl budget for the canonical filter URLs.
**Alternatives:** Index everything (rejected — thin content); block in robots.txt (rejected — robots.txt blocks crawl, noindex+follow is preferred).
**Reversibility:** Trivial — change `inc/seo.php`.

---

## D-008 — Single-filter directory URLs are indexable
**Date:** 2026-05-10
**What:** `/lawyers/?city=tel-aviv` and `/lawyers/?area=family-law` ARE indexable (default).
**Why:** These are useful long-tail SERP targets ("עורכי דין בתל אביב", "עורך דין דיני משפחה").
**Alternatives:** Create separate `/lawyers-tel-aviv/` URLs (rejected for now — wait for content density).
**Reversibility:** Trivial.

---

## D-009 — Practice-areas taxonomy now attached to `articles` + `justice_lawyer`
**Date:** 2026-05-10
**What:** Removed `'post'` from object_types; added `'justice_lawyer'`.
**Why:** Default `post` is spam-prone (casino content origin). Lawyer profiles need practice-areas tagging.
**Alternatives:** Keep `post` and noindex it (rejected — spam still pollutes admin); separate "lawyer-areas" taxonomy (rejected — duplication).
**Reversibility:** Possible.

---

## D-010 — Auto-seeded lawyers MUST be drafts, MUST be unverified
**Date:** 2026-05-10 (codified earlier; flag bumped this session)
**What:** Seeder creates lawyers with `post_status=draft` and `verification_status=unverified`. Bumped seed flag to `jte_seeded_v5` to force re-seed after fix.
**Why:** Test data must NEVER appear as real, verified lawyers on the live site. Risk of trust + Bar issues.
**Alternatives:** Don't seed (rejected — useful for dev); seed as published (rejected — TRUST DISASTER).
**Reversibility:** Trivial.

---

## D-011 — View counter excludes bots/admins/feeds
**Date:** 2026-05-10
**What:** `single-justice_lawyer.php` only increments `profile_views` for real human visitors.
**Why:** Bot/admin/feed inflation makes lawyer analytics useless and inflates `priority_score` falsely.
**Alternatives:** Use external analytics only (rejected — we want the data in our DB).
**Reversibility:** Trivial.

---

## D-012 — All REST routes require `manage_options`
**Date:** 2026-05-08 (codified)
**What:** Every REST route in `jus-tice-engine` checks `current_user_can('manage_options')`.
**Why:** All routes expose internal data or write to DB. Admin-only is the safe default.
**Alternatives:** Per-route capability mapping (rejected — premature complexity).
**Reversibility:** Per-route override possible.

---

## D-013 — Schema.org Attorney for lawyer profiles
**Date:** 2026-05-10
**What:** Each lawyer single page emits `Attorney` JSON-LD with all relevant fields.
**Why:** Better SERP display + AI-engine citation.
**Alternatives:** `Person` schema (rejected — less specific); `LegalService` only (rejected — that's for the practice area page, not the individual).
**Reversibility:** Trivial.

---

## D-014 — Schema.org LegalService for practice-area pages
**Date:** 2026-05-10
**What:** Each `practice-areas` taxonomy archive emits `LegalService` JSON-LD.
**Why:** Helps Google understand the page topic for AI Overviews and rich results.
**Reversibility:** Trivial.

---

## D-015 — Canonical URL emitted by theme (deferred when SEO plugin active)
**Date:** 2026-05-10
**What:** Theme outputs `<link rel="canonical">` on every public page; defers to Yoast/RankMath/AIOSEO if detected.
**Why:** Avoid duplicate canonical tags when SEO plugin is later installed.
**Reversibility:** Trivial.

---

## D-016 — Removed dead plugin files (`agent-bridge.php`, `file-tools.php`)
**Date:** 2026-05-10
**What:** Files were not loaded by the main plugin file but had remained in repo. They exposed file-write REST endpoints.
**Why:** Reduce attack surface; clean code.
**Alternatives:** Keep + load (rejected — file-write via REST is risky even with admin auth).
**Reversibility:** Files in git history if needed.

---

## D-017 — Lead form notice via querystring (success/missing)
**Date:** 2026-05-10
**What:** Lead handler redirects with `?lead=success` or `?lead=missing`; form template displays notice based on value.
**Why:** Simple, no JS required, works in all browsers.
**Alternatives:** AJAX submit (rejected — added complexity for marginal UX gain).
**Reversibility:** Trivial.

---

## D-018 — DRAFT pricing: Pro ₪299/mo, Featured ₪699/mo, Lead Partner ₪0+per-lead, Full Service ₪1,499/mo
**Date:** 2026-05-10
**Status:** DRAFT — not committed.
**Owner action:** Confirm market rates against din.co.il, PsakDin advertising tiers.
**Reversibility:** Easy until billing live.

---

## D-019 — Manual concierge onboarding for first 30–50 lawyers
**Date:** 2026-05-10
**What:** Owner manually onboards first cohort instead of building self-serve registration immediately.
**Why:** Lower tech cost, learn what lawyers actually want, build trust relationships.
**Alternatives:** Build full self-serve from day 1 (rejected — high cost, low information).
**Reversibility:** Self-serve to be built in parallel; can switch when ready.

---

## D-020 — No fake testimonials, no "best/top/leading" lists ever
**Date:** 2026-05-10
**What:** Per `lawyer-privacy-review.md` — no false superlatives, no fabricated reviews.
**Why:** Israeli Bar advertising rules + Google quality guidelines.
**Reversibility:** Never reverse.
