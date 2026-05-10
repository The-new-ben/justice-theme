# Lawyer Onboarding Flow

**Date:** 2026-05-10
**Status:** PLANNING — no live onboarding yet.

---

## 1. Three modes of onboarding

| Mode | Trigger | Goal |
|---|---|---|
| **A. Self-registration** | Lawyer finds `/lawyer-registration/` from CTA | Self-serve at scale |
| **B. Profile claim** | Lawyer's name already exists (imported); they claim it | Convert imported profiles to active accounts |
| **C. Concierge / manual** | Owner outreach to high-value lawyer | First 30–50 lawyers, deep relationships |

---

## 2. Mode A — Self-registration (canonical flow)

```
Step 1 — LANDING (/lawyer-registration/)
    ─ Value prop: "Reach 1000s of clients searching for lawyers in your field"
    ─ Trust signals: "Free to start", "Israeli Bar verified", "No long-term commitment"
    ─ CTA: "Start free profile"

Step 2 — REGISTER FORM
    Fields:
    ─ Full name (Hebrew)
    ─ Email (for account)
    ─ Phone
    ─ Bar number (לשכת עורכי הדין license #)
    ─ Password
    ─ Consent checkbox (terms + privacy)

Step 3 — EMAIL VERIFICATION
    ─ Confirmation link sent
    ─ Link click → account activated

Step 4 — BAR VERIFICATION (Phase 2)
    ─ Look up Bar number against lsb.org.il
    ─ If match: license_status='active' + verification_status='verified'
    ─ If no match: status='pending' → manual admin review

Step 5 — PROFILE WIZARD (4 sub-steps)
    Step 5a — Identity
        ─ Display name (auto from registration)
        ─ Firm name
        ─ Profile photo upload
        ─ Bio short (50–200 chars)
        ─ Bio long (200–1500 chars)

    Step 5b — Practice
        ─ Practice areas (max 5 free, more with paid)
        ─ Years experience
        ─ Languages spoken
        ─ Courts/jurisdictions

    Step 5c — Contact
        ─ Office address
        ─ Public phone (defaults to registration phone)
        ─ Public email (defaults to registration email)
        ─ WhatsApp (optional)
        ─ Website (optional)

    Step 5d — Service area
        ─ Cities where you practice (max 3 free)
        ─ Inquiry routing on/off

Step 6 — REVIEW & SUBMIT
    ─ Preview as visitor will see
    ─ Submit → profile_status='pending' → admin queue

Step 7 — ADMIN APPROVAL (within 24h)
    ─ Admin reviews → approves → profile_status='active' → published
    ─ OR rejects with reason → email + corrective steps

Step 8 — WELCOME EMAIL
    ─ Profile is live (link)
    ─ How to get more leads (link to upgrade plans)
    ─ Tips for completing optional fields
    ─ Add a testimonial collection link to email signature

Step 9 — UPGRADE PROMPT
    ─ After 7 days OR when profile gets first impression
    ─ "Upgrade to Pro to receive client inquiries"
    ─ Funnel to /lawyer-plans/
```

---

## 3. Mode B — Profile claim (imported profiles)

```
Triggered when a lawyer searches their name on jus-tice.co.il and finds a profile they didn't create.

Step 1 — VISIBILITY
    Each profile has small "האם זה הפרופיל שלך?" link

Step 2 — CLAIM FORM
    ─ Bar number (must match what we have on file OR what lsb.org.il returns)
    ─ Email (must match what's on file OR be verifiable)
    ─ Optional: photo of Bar ID for manual verification

Step 3 — VERIFICATION
    ─ Auto-match Bar # → instant claim approval
    ─ Manual review otherwise (24–48h)

Step 4 — TAKE OVER
    ─ Profile linked to user account (claimed_by_user_id)
    ─ Lawyer gains edit access via wizard (Step 5 above)
    ─ Source type updated from `import` → `registration`

Step 5 — REQUEST REMOVAL OPTION
    ─ "I am this person but I do not want to be listed"
    ─ Profile moved to trash within 14 days
    ─ Email sent to confirm
```

---

## 4. Mode C — Concierge

For first 30–50 high-value lawyers:

```
1. Owner identifies target lawyer (referral / personal network)
2. Owner reaches out personally
3. Owner collects info via Google Form or phone call
4. Owner creates profile manually in WP Admin (status=draft)
5. Owner emails lawyer "Here's your profile preview, approve to publish"
6. Lawyer approves
7. Owner publishes (status=active, source_type=manual)
8. Owner adds lawyer's WP user account, links via claimed_by_user_id
9. Lawyer can edit on their own from this point forward
```

---

## 5. Required UI artifacts

| Artifact | Status |
|---|---|
| `/lawyer-registration/` PAGE | NOT BUILT |
| Registration form | NOT BUILT |
| Email verification system | NOT BUILT — WP core supports it |
| Profile wizard (4 steps) | NOT BUILT — likely Gravity Forms or custom |
| `/lawyer-claim-profile/` PAGE | NOT BUILT |
| `/lawyer-dashboard/` PAGE | NOT BUILT |
| Admin approval queue | NOT BUILT — WP Admin filters on `profile_status=pending` |
| Welcome email template | NOT BUILT |
| Upgrade prompt email | NOT BUILT |

---

## 6. Bar Association integration (Phase 2)

The Israel Bar Association (לשכת עורכי הדין) has a public lawyer directory at lsb.org.il. We need:

1. **Lookup endpoint** — given a Bar number, return: name, license status (active/inactive/suspended), date of license issuance
2. **API or scrape** — no public API exists (NOT VERIFIED). May require scraping with rate-limit + caching, or partnership.
3. **Verification cache** — store the result with timestamp; re-verify monthly via cron

**Action:** Owner contacts Bar Association to inquire about API/data partnership. Until then, manual verification.

---

## 7. Friction-reduction principles

| Principle | Application |
|---|---|
| **Defer optional fields** | Required: name, phone, email, Bar #, 1 practice area, 1 city. Everything else can wait. |
| **Save partial progress** | Wizard saves on each step click; lawyer can resume |
| **Mobile-first** | Lawyers will sign up from their phone |
| **Show value at every step** | "This makes your profile rank for 3 more keywords" |
| **One-tap upgrade** | After registration, single tap to upgrade plan |
| **No legalese** | Plain Hebrew copy throughout |

---

## 8. Anti-abuse

| Threat | Mitigation |
|---|---|
| Fake registrations (not real lawyers) | Bar # required + verification |
| Squatting on a name (claiming another lawyer's profile) | Bar # MUST match what lsb.org.il says for that name |
| Registration spam | Captcha + email verification |
| Multiple accounts per lawyer | Bar # uniqueness check |
| Disbarred lawyer registering | Verify license_status=active |

---

## 9. Tracking & metrics

| Metric | Source |
|---|---|
| Registration starts | Page view on `/lawyer-registration/` |
| Registration completions | Count of lawyers with `source_type=registration` |
| Claim attempts | Count of users who triggered claim form |
| Wizard completion rate | Per-step funnel — needs front-end analytics |
| Time to first lead | Days between activation and first lead routed |
| Free → paid conversion rate | Plans changed from free → paid within 30 days |
| Churn (cancellations within 90 days) | Subscriptions cancelled |

---

## 10. Verified vs NOT VERIFIED

| Item | Status |
|---|---|
| `claimed_by_user_id` meta field exists in CPT | ✅ verified in `cpt-lawyers.php` |
| `profile_status` workflow (`draft|imported|pending|active|suspended`) defined | ✅ verified |
| Source-of-data tagging (`source_type`) exists | ✅ verified |
| Registration page | ❌ NOT BUILT |
| Wizard | ❌ NOT BUILT |
| Email verification | ❌ NOT BUILT (WP supports natively but flow not designed) |
| Bar Association lookup | ❌ NOT BUILT, NO API agreement |
| Claim flow | ❌ NOT BUILT |
| Dashboard | ❌ NOT BUILT |
