# Demo Readiness — Jus-Tice.co.il
**Date:** 2026-05-09  
**Purpose:** Track exactly what must be true before the site can be demonstrated

---

## DEMO REQUIREMENTS

For a convincing demo, the following must be TRUE:

### Must-Have (Demo Blockers)
| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| D1 | Homepage loads without casino/spam content | ❌ NOT VERIFIED | Fix spam issue first |
| D2 | Active theme is Justice Theme (not GeneratePress or default) | ❌ NOT VERIFIED | Verify via wp-admin |
| D3 | All UI text is Hebrew — no English visible | ✅ FIXED in this session | Single articles, archive, breadcrumbs |
| D4 | Hero section shows correctly with search form | ❌ NOT VERIFIED | Search form action may be broken |
| D5 | Practice areas grid shows at least 5 terms | ❌ NOT VERIFIED | Requires terms in DB |
| D6 | Lawyer directory page loads (even if empty state) | ❌ NOT VERIFIED | CPT must be registered |
| D7 | At least 1 article is published and readable | ❌ NOT VERIFIED | Requires content |
| D8 | No PHP fatal errors in debug.log | ❌ NOT VERIFIED | Requires live check |
| D9 | Mobile view looks clean (RTL, no overflow) | ❌ NOT VERIFIED | Requires browser test |
| D10 | WhatsApp float button works | ❌ NOT VERIFIED | Requires phone number in Customizer |

### Nice-to-Have (Impressive Demo)
| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| N1 | 5+ published legal articles with real content | — | Shows content authority |
| N2 | 3–5 lawyer profile cards visible on homepage | — | Shows directory exists |
| N3 | Practice area taxonomy page with articles | — | Shows SEO structure |
| N4 | Hero stats show real numbers (not 0) | — | Trust signal |
| N5 | About page explains editorial policy | — | YMYL authority signal |
| N6 | Professional logo uploaded | — | Brand trust |
| N7 | Contact page with lead form working | — | Lead capture visible |

---

## DEMO MINIMUM CONTENT CHECKLIST

| Content Item | Quantity | Status |
|-------------|---------|--------|
| Lawyer profiles (draft OK) | 10 | ❌ |
| Legal articles (published) | 5 | ❌ |
| Practice area taxonomy terms | 10 | ❌ |
| About page | 1 | ❌ |
| Contact page | 1 | ❌ |

---

## PRE-DEMO VERIFICATION SCRIPT

Run these commands before the demo:

```bash
# 1. Verify theme
wp option get template
# Expected: justice-theme

# 2. Verify CPTs exist
wp post-type list | grep -E "articles|justice_lawyer"

# 3. Check article count
wp post list --post_type=articles --post_status=publish --format=count

# 4. Check lawyer count
wp post list --post_type=justice_lawyer --post_status=publish,private,draft --format=count

# 5. Check for spam posts
wp post list --post_type=post --post_status=publish --format=count

# 6. Verify practice areas exist
wp term list practice-areas --format=table | head -20

# 7. Check for PHP errors
tail -20 /wp-content/debug.log

# 8. Flush rewrite rules
wp rewrite flush
```

---

## CURRENT DEMO READINESS: NOT READY

**Blockers (in priority order):**
1. Spam content on homepage — must be identified and removed
2. Active theme needs verification
3. CPT registration needs verification
4. Zero content (articles, lawyers, taxonomy terms)
5. Hero search broken (wrong form action)

**Estimated time to demo-ready:** 2–3 days of focused work after live site access is established.
