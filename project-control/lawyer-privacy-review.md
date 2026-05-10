# Lawyer Privacy & Representation Review

**Date:** 2026-05-10
**Scope:** All lawyer-related claims and data on jus-tice.co.il.
**Risk:** Israeli Bar advertising rules + Israeli Privacy Protection Law + general defamation/representation law.

---

## 1. What we MUST NOT claim (without proof)

| Claim | Risk | Allowed when |
|---|---|---|
| "מאומת" / "verified" | Misrepresentation; potential Bar complaint | Only when WE have actually verified the bar number against lsb.org.il AND have a documented process |
| "מומלץ" / "recommended" | False endorsement | Only with verifiable client recommendation under our review system |
| "מוביל" / "top" / "leading" | Misleading superlative — Bar prohibits | Almost never; requires verifiable ranking with disclosed methodology |
| "שותף" / "partner" | Implies business relationship | Only if there IS a business relationship (paid plan = "lead_partner") AND it's disclosed |
| "ממומן" / "sponsored" | Required disclosure when true | When `plan_type` ∈ paid set, the badge MUST appear |
| "10+ years of activity" (site-level) | False — site is new | NEVER until true |
| Pre-filled testimonials | Fraud | Never. Only real client reviews after verified lead. |
| "Best lawyer in X" lists | Bar rule violation + Google guidelines | Never |
| Specific case win rate | Bar prohibits without disclaimer | Only with full Bar-compliant context + disclaimer |

### Status of each claim in current code

| Claim location | Current state | OK? |
|---|---|---|
| `single-justice_lawyer.php:42` "פרופיל ממומן" badge | Conditional on `plan_type ∈ paid set` | ✅ OK |
| `single-justice_lawyer.php:171` "פרופיל מאומת" | Conditional on `verification_status === 'verified'` | ✅ OK in code, but data could be wrong |
| `lawyer-card.php:27` "פרופיל ממומן" | Same as above | ✅ OK |
| `trust-section.php` "10+ years" stat | REMOVED this session | ✅ OK |
| Hero stats (article count, area count, city count) | Live counts | ✅ OK |
| `single-justice_lawyer.php` schema `Attorney` | Output is from CPT meta only | ✅ OK provided meta is real |
| Auto-seeded lawyer profiles | Created as `draft` (FIXED earlier session) | ✅ OK provided drafts stay drafts |
| Auto-seeded lawyer profiles `verification_status=unverified` | FIXED earlier session | ✅ OK |

---

## 2. Source-of-data tagging

Every lawyer profile MUST have `source_type` set:

| Value | Meaning | Visible? |
|---|---|---|
| `manual` | Admin entered manually | n/a — internal |
| `import` | Imported from a public list (e.g., Bar Association directory) | n/a — internal |
| `registration` | Lawyer claimed/created own profile | n/a — internal |
| `seed` | Test/demo data | MUST stay `draft` until reviewed |

**Rule:** Any profile with `source_type=seed` and `post_status=publish` is a bug → `draft`.

---

## 3. Personal data minimization

For each lawyer field, document why we hold it:

| Field | Justification | Public? |
|---|---|---|
| `lawyer_full_name` | Identification | Yes |
| `firm_name` | Affiliation, public info | Yes |
| `bar_number` | Verification — public via Bar Association | Yes |
| `bio_short`, content body | Self-described biography | Yes (lawyer-provided) |
| `phone` | Contact | Yes |
| `email` | Contact | Yes (or admin-only if lawyer prefers) |
| `whatsapp` | Contact | Yes (lawyer-provided) |
| `website` | Public URL | Yes |
| `office_address` | Business address | Yes (or city only) |
| `years_experience` | Self-attested | Yes |
| `languages` | Service capability | Yes |
| `license_status` | Public via Bar Association | Yes |
| `verification_status` | Our process result | Yes |
| `plan_type` | Internal monetization data | NO (only "ממומן" badge derived from it) |
| `subscription_status` | Internal | NO |
| `featured_until` | Internal | NO |
| `priority_score` | Internal sort | NO |
| `lead_routing_enabled` | Internal | NO |
| `monthly_lead_limit` | Internal | NO |
| `profile_views`, `leads_received`, `leads_accepted` | Analytics | NO (admin-only) |
| `claimed_by_user_id` | Account linkage | NO |
| `internal_notes` | Admin notes | NO |
| `source_url`, `source_type` | Data lineage | NO |

**No SSN, no date of birth, no home address, no government ID number** — none of these are in the schema. Good.

---

## 4. Israeli Bar advertising rules — operational checklist

The Israel Bar Association (לשכת עורכי הדין) restricts lawyer advertising. Per current rules:

| Rule | Applied? |
|---|---|
| Paid placements MUST be marked as advertising | ✅ "פרופיל ממומן" badge on paid profiles |
| No false superlatives ("the best", "leading") | ✅ Code does not generate these |
| No fabricated testimonials | ✅ No testimonial section in code yet |
| No misleading specialization claims | ⚠️ Lawyer can self-claim any practice area; future: only Bar-recognized specializations |
| Lawyer must approve content about themselves | ⚠️ NOT VERIFIED — needs claim-your-profile flow |
| Disclosure of fee arrangements (if specific fee shown) | ⚠️ No fee field exists yet — when added, disclose conditions |

---

## 5. Required compliance pages (NOT YET ON LIVE)

| Page | Purpose | Status |
|---|---|---|
| `/advertising-disclosure/` | Explain how paid placements work, what "פרופיל ממומן" means | NOT BUILT |
| `/editorial-policy/` | How content is reviewed, who reviews it | NOT BUILT |
| `/privacy/` | Data handling per Israeli Privacy Protection Law | NOT BUILT |
| `/terms/` | Terms of use, dispute resolution | NOT BUILT |
| `/lawyer-data-policy/` | How lawyer data is collected, sourced, displayed; how lawyers can claim/edit/remove their profile | NOT BUILT |
| `/about/` | Who runs the site, contact info, business identity | NOT BUILT |

---

## 6. Lawyer claim/removal flow (required, not yet built)

A lawyer must be able to:

1. **Claim** an existing profile — verify they are the named person (Bar number + email confirmation)
2. **Edit** the profile fields after claim
3. **Request removal** — comply within reasonable time per Israeli Privacy Law
4. **Dispute** information shown about them

### MVP plan
- Page: `/lawyer-claim-profile/`
- Form: name, Bar number, email (must match Bar Association)
- Process: admin review → profile linked to lawyer's WP user account → lawyer gets `claimed_by_user_id` set
- For removal: simple form → admin reviews → trash within 14 days OR explain why retained

---

## 7. Active risks today

| Risk | Severity | Action |
|---|---|---|
| Seeded fake lawyers might have been published on live (before earlier-session fix) | High | Run `wp post list --post_type=justice_lawyer --meta_key=source_type --meta_value=seed --format=table`. Trash any seed profiles that ended up `publish`. |
| `verification_status=verified` on seed profiles | High | Same as above. Confirm post-fix flag bump (`jte_seeded_v5`) ran. |
| Real lawyer names appearing without consent | UNKNOWN | Audit live: are there ANY published lawyers? If yes, are they real names that did not opt in? |
| Lawyer photos uploaded without rights | Medium | Add upload notice: "אתם מאשרים שיש לכם זכויות שימוש בתמונה" |
| Inquiry form data routed without disclosure of who receives it | Medium | Add line to disclaimer: "הפנייה תועבר לעורך הדין X שתופיע על המסך" |

---

## 8. NOT VERIFIED — needs live access

| Check | Command/method |
|---|---|
| Real names on live as published profiles | `wp post list --post_type=justice_lawyer --post_status=publish --format=csv` |
| Source type for each | `wp post list --post_type=justice_lawyer --meta_key=source_type --post_status=publish` |
| Verification status for each | `wp post list --post_type=justice_lawyer --meta_key=verification_status --post_status=publish` |
| Whether any user has tried to claim a profile | Check leads + user registrations |
| Whether anyone has requested removal | Check support inbox |

Until these run, all live-server lawyer privacy status is **UNKNOWN**.
