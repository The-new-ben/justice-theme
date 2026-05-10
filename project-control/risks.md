# Risks

Each risk: WHAT, LIKELIHOOD, IMPACT, MITIGATION, OWNER.

---

## R-001 — Casino/gambling/spam content live on the site
**Likelihood:** HIGH (confirmed by owner)
**Impact:** HIGH — kills SEO ranking, user trust, and could trigger Google manual action
**Mitigation:**
  1. Use REST `/reports/spam` to identify
  2. Trash via `/content/trash-post` or WP Admin
  3. Identify ROOT CAUSE: was it a compromised plugin? scheduled cron? compromised user? See `spam-investigation.md`
  4. Block the source — review `wp_options` for malicious cron via `/reports/cron`
**Status:** OPEN — actions documented, not executed

---

## R-002 — Real lawyer names on live without consent
**Likelihood:** UNKNOWN — owner mentioned names exist
**Impact:** CRITICAL — Israeli Privacy Protection Law violation, defamation risk, Bar complaint
**Mitigation:**
  1. Audit ALL `justice_lawyer` posts on live — list by `source_type`
  2. Any with `source_type=seed` AND `post_status=publish` → trash immediately
  3. For non-seed published profiles: confirm consent or remove within 14 days
  4. Build claim-your-profile flow ASAP
**Status:** OPEN

---

## R-003 — Multiple "Justice" plugins active simultaneously
**Likelihood:** UNKNOWN — owner mentioned plugin folder confusion
**Impact:** HIGH — fatal errors, duplicate function declarations, conflicting CPT registrations
**Mitigation:** REST `/reports/plugins` shows all plugins with ACTIVE_JUSTICE_PLUGIN flag — deactivate duplicates
**Status:** OPEN

---

## R-004 — Lawyer profile inflated views due to bot traffic
**Likelihood:** WAS HIGH, NOW LOW
**Impact:** Medium — corrupts analytics + priority_score logic
**Mitigation:** Bot-detection added to view counter (this session)
**Status:** RESOLVED IN CODE — pending deployment

---

## R-005 — Lead form being scraped/spammed
**Likelihood:** HIGH once form is discovered
**Impact:** MEDIUM — fills `justice_lead` CPT with garbage; confuses real lead processing
**Mitigation:** Add Cloudflare Turnstile or honeypot before going live with marketing
**Status:** OPEN

---

## R-006 — Plugin v1.0.0 + PHP 7.4 = parse error → site down
**Likelihood:** UNKNOWN — depends on uPress PHP version
**Impact:** CRITICAL — plugin won't activate, possibly breaks site
**Mitigation:**
  1. Verify live PHP version BEFORE deploying
  2. If PHP 7.4: refactor `int|WP_Error` to `int` with separate `WP_Error` checks; replace `str_contains` with `strpos`
  3. Or upgrade hosting to PHP 8.1+
**Status:** OPEN

---

## R-007 — Schema.org Attorney emits incorrect data
**Likelihood:** Medium — depends on data quality
**Impact:** Medium — Google penalizes structured-data misalignment with visible content
**Mitigation:** Schema only emits fields when corresponding meta exists (defensive code). Validate with Schema Markup Validator after deployment.
**Status:** RESOLVED IN CODE — needs validation post-deploy

---

## R-008 — `wp_mail()` failures = leads silently lost
**Likelihood:** HIGH on shared hosting without SMTP
**Impact:** CRITICAL for lead-driven business
**Mitigation:** Install WP Mail SMTP + SendGrid/SES; verify deliverability with test send
**Status:** OPEN — see `crm-architecture.md`

---

## R-009 — Israeli Bar advertising rule violation
**Likelihood:** Medium if claims aren't carefully managed
**Impact:** HIGH — Bar complaint can affect lawyer participation
**Mitigation:** All advertising disclosure in code (`פרופיל ממומן` badge); `lawyer-privacy-review.md` documents allowed/banned claims
**Status:** ONGOING — must NEVER add fake testimonials, "best lawyer" lists

---

## R-010 — Combinatorial directory URLs flooding GSC index
**Likelihood:** HIGH if not noindexed
**Impact:** HIGH — thin content penalty + diluted authority
**Mitigation:** Robots noindex on combinatorial filters added (this session)
**Status:** RESOLVED IN CODE — pending deployment

---

## R-011 — Trust collapse from showing "10+ years" on a brand-new site
**Likelihood:** WAS CERTAIN
**Impact:** MEDIUM — kills trust if savvy user notices the new domain
**Mitigation:** Removed (this session)
**Status:** RESOLVED IN CODE

---

## R-012 — Pillar pages 404 because URLs in code don't match real PAGES
**Likelihood:** WAS HIGH (templates linked to non-existent `/family-law/divorce/` etc.)
**Impact:** HIGH — broken UX + crawl errors
**Mitigation:** Fallback URL strategy implemented (term link → directory filter)
**Status:** RESOLVED IN CODE — but optimal solution requires creating the actual PAGES

---

## R-013 — `taxonomy-city.php` registered against wrong CPT slug
**Likelihood:** WAS CERTAIN (plugin code defect)
**Impact:** Medium — admin column doesn't show, filter URLs may not work as expected
**Mitigation:** Fixed (this session)
**Status:** RESOLVED IN CODE

---

## R-014 — Practice-areas taxonomy on `'post'` enabling spam to pollute the cluster
**Likelihood:** HIGH given existing casino spam
**Impact:** Medium — spam posts could appear under `/practice-areas/X/`
**Mitigation:** Removed `'post'` from object_types (this session)
**Status:** RESOLVED IN CODE — but spam posts already tagged remain (will need manual cleanup)

---

## R-015 — `agent-bridge.php` arbitrary file write via REST
**Likelihood:** WAS LATENT (route was registered if file loaded; file wasn't loaded but file existed)
**Impact:** CRITICAL if a single admin account is compromised
**Mitigation:** File removed entirely (this session)
**Status:** RESOLVED IN CODE — pending deployment

---

## R-016 — Auto-seed creates fake lawyer profiles as `published` (was the case until v5 fix)
**Likelihood:** WAS HIGH on first admin_init after activation
**Impact:** CRITICAL — fake lawyers + fake names go live
**Mitigation:** Fixed in earlier session: status=draft, verification=unverified, flag bumped
**Status:** RESOLVED IN CODE — but if v4 had already run on live, those profiles need cleanup

---

## R-017 — Lawyer site doesn't load on iOS Safari due to RTL bug
**Likelihood:** Medium — Safari RTL has historically had quirks
**Impact:** Medium — iOS is large in Israel
**Mitigation:** Test on real iPhone after deploy. Currently NOT VERIFIED.
**Status:** OPEN — visual QA blocked

---

## R-018 — uPress hosting cache serves stale content after fixes deployed
**Likelihood:** Medium
**Impact:** Medium — fixes appear not to take effect
**Mitigation:** Clear uPress cache + Cloudflare cache after deploy. Document in deploy checklist.
**Status:** ONGOING

---

## R-019 — Plugin activation flushes rewrite rules but live admin needs to visit Permalinks → Save
**Likelihood:** Medium
**Impact:** Medium — fresh URLs (e.g., `/lawyers/`, `/practice-areas/`) might 404
**Mitigation:** After plugin update, admin visits Settings → Permalinks → Save
**Status:** ONGOING — operational note

---

## R-020 — Israeli Privacy Protection Law data subject right requests
**Likelihood:** HIGH eventually
**Impact:** Medium — must handle within reasonable time
**Mitigation:** Build "remove my data" flow + lawyer claim flow; appoint data protection officer
**Status:** OPEN

---

## How to update

When risk changes status, edit in place. When fully mitigated, change to "RESOLVED <date>".
