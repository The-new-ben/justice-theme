# Blockers

Things that prevent forward progress. Each: WHAT, WHO/WHAT can unblock, IMPACT.

---

## B-001 — No live server access (REST/SSH/admin)
**Status:** OPEN
**What:** Cannot run any verification on jus-tice.co.il from this session.
**Unblocked by:** Owner provides one of:
  - WP Admin login (preferred for inspection + config)
  - Application Password for REST API access
  - SSH/WP-CLI access
  - Live URL screenshots from owner
**Impact:** Every "NOT VERIFIED" item across the project-control docs stays unverifiable. Cannot:
  - Confirm fixes deployed
  - Trash spam content
  - Upload logo
  - Assign menus
  - Create taxonomy terms
  - Test lead submission end-to-end
  - Run Lighthouse / PageSpeed
  - Take screenshots for visual QA

---

## B-002 — No Google Search Console connection
**Status:** OPEN
**What:** Cannot pull keyword data, indexed pages list, click data, position data.
**Unblocked by:** Owner verifies domain ownership in GSC + grants reporting access OR shares CSV exports.
**Impact:**
  - `serp-research-log.csv` cannot be populated with real top-titles + PAA
  - `url-migration-map.csv` cannot map legacy URLs that have organic traffic
  - Cannot prioritize URL changes by traffic risk
  - Cannot measure SEO progress

---

## B-003 — No SEO plugin installed
**Status:** OPEN
**What:** No XML sitemap, no centralized SEO settings, no per-page meta override UI.
**Unblocked by:** Install RankMath (free) or Yoast (free).
**Impact:**
  - No sitemap to submit to GSC
  - No editor-friendly meta description override UI
  - No structured breadcrumb settings
  - Schema.org coverage relies entirely on theme code (works, but not extensible)

---

## B-004 — No Israeli Bar Association (lsb.org.il) lookup integration
**Status:** OPEN
**What:** Cannot auto-verify lawyer license_status against the Bar database.
**Unblocked by:** Owner contacts Israel Bar Association to inquire about API or partnership; OR we build a scraper with rate-limit + caching.
**Impact:**
  - All `verification_status=verified` is manual
  - Cannot detect disbarred lawyers automatically
  - Slows lawyer onboarding (Mode A self-registration)

---

## B-005 — No SMTP for reliable lead email
**Status:** OPEN
**What:** Lead handler uses `wp_mail()` which often fails on shared hosting (no SPF/DKIM).
**Unblocked by:** Install WP Mail SMTP plugin + configure SendGrid/SES/Mailgun.
**Impact:** Lead emails may go to spam OR fail silently. Owner doesn't get notified, lawyer doesn't get matched, lead is lost.

---

## B-006 — No anti-spam on lead forms
**Status:** OPEN
**What:** Forms have no captcha, no honeypot, no rate-limit.
**Unblocked by:** Decision (Cloudflare Turnstile / hCaptcha / honeypot) + install + wire into form.
**Impact:** Bot-vulnerable. Could quickly fill `justice_lead` CPT with garbage.

---

## B-007 — Pillar PAGES don't exist
**Status:** OPEN
**What:** `/divorce-lawyer/`, `/criminal-lawyer/` etc. don't exist as published WP Pages.
**Unblocked by:** Editor creates the 8 pillar PAGES with content per `url-strategy.md` and `seo-aio-geo-strategy.md`.
**Impact:**
  - Code falls back to taxonomy term link or directory filter (works but not optimal SERP target)
  - Cannot rank for the primary money keywords
  - Cannot demonstrate the cluster architecture to investors / lawyers

---

## B-008 — No taxonomy terms created
**Status:** OPEN (assumed — NOT VERIFIED)
**What:** Practice-areas taxonomy may have zero terms on live.
**Unblocked by:** Editor creates 10+ practice-areas terms (Hebrew name, English slug per `slug-normalization-rules.md`).
**Impact:**
  - Hero quick-links empty
  - Practice-areas grid shows nothing
  - Cluster architecture has no data
  - Lawyer profiles can't be tagged by area

---

## B-009 — Logo not uploaded
**Status:** OPEN (assumed — NOT VERIFIED)
**What:** Customizer logo slot is empty → text fallback shown.
**Unblocked by:** Owner uploads SVG/PNG logo (≤80px tall × 260px wide, white-on-dark).
**Impact:** Site looks unbranded; weakens trust.

---

## B-010 — No menus assigned to nav locations
**Status:** OPEN (assumed — fallback menu visible suggests no `primary` menu assigned)
**What:** 6 menu locations registered (`primary`, `secondary`, `mobile`, `footer`, `legal_areas`, `footer_trust`) but presumably none assigned.
**Unblocked by:** Owner creates menus in Appearance > Menus and assigns to locations.
**Impact:** Header shows fallback menu (just home + articles); footer sections empty.

---

## B-011 — No SSL/HTTPS verification
**Status:** OPEN — NOT VERIFIED
**What:** Don't know if site enforces HTTPS.
**Unblocked by:** Owner confirms in hosting panel (uPress provides Let's Encrypt).
**Impact:** Mixed-content errors; SEO penalty; lead form data potentially in plaintext.

---

## B-012 — No PHP version confirmed
**Status:** OPEN — NOT VERIFIED
**What:** Plugin requires PHP 8.0+; live PHP version unknown.
**Unblocked by:** Owner runs `wp eval 'echo PHP_VERSION;'` or checks hosting panel.
**Impact:** If PHP 7.4, plugin breaks on activation (parse error on `int|WP_Error` union type and `str_contains`).

---

## B-013 — Pricing not committed
**Status:** OPEN
**What:** Plan pricing is DRAFT in `payment-architecture.md`.
**Unblocked by:** Owner confirms after market check.
**Impact:** Cannot build payment flow until pricing committed.

---

## B-014 — Editorial team / reviewer named
**Status:** OPEN
**What:** Articles need a real human author + reviewer (lawyer) for E-E-A-T compliance.
**Unblocked by:** Owner identifies editor + reviewer lawyer; obtains consent + bio.
**Impact:** Articles using "Organization" as author = weak E-E-A-T signal.

---

## B-015 — `agent-bridge.php` removal must be deployed
**Status:** RESOLVED IN CODE — pending deployment
**What:** File removed from repo this session, but live server still has it.
**Unblocked by:** Plugin update deployed to live.
**Impact:** While unresolved, an attacker with admin credentials could write arbitrary theme files via REST.

---

## How to update

When a blocker is resolved, change "Status: OPEN" → "Status: RESOLVED <date>", note who resolved it and how. Do NOT delete resolved blockers — keep history.
