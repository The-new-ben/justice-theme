# Israeli Lawyer Advertising Compliance Research

> **CRITICAL**: This document must be reviewed by an Israeli attorney before implementing any paid features. The information below is based on publicly available rules and should not be treated as legal advice.

## Source Documents
- כללי לשכת עורכי הדין (פרסומת) — Israel Bar Association Advertising Rules
- תיקון 2018 — March 2018 Amendment to advertising rules
- חוק לשכת עורכי הדין, תשכ"א-1961 — Israel Bar Association Law

## Key Rules

### 1. Lawyer Advertising — General Permission
- **Status:** Allowed since 2001, expanded in 2018
- The 2018 amendment significantly liberalized lawyer advertising
- Lawyers MAY advertise their services, including online
- The advertisement must be truthful and not misleading
- Must include: lawyer name, bar number, and practice areas

### 2. Paid Profiles / Directory Listings
- **Status:** LIKELY ALLOWED with disclosure
- A paid directory listing is considered advertising
- Must be clearly identified as a paid placement
- Must not imply endorsement by the Bar Association
- Must include required identification fields (name, bar number)
- **Recommendation:** Include clear disclosure: "פרופיל ממומן" or "רישום בתשלום"

### 3. Reviews / Ratings
- **Status:** REQUIRES CAREFUL IMPLEMENTATION
- The 2018 rules do not explicitly prohibit reviews
- However, reviews must not be fabricated or misleading
- A "verified client" review system would need careful design
- **Risk:** If reviews are manipulated or false, both the lawyer and the platform could face disciplinary action
- **Recommendation:** If implementing reviews, require verification that a professional relationship existed. Consider starting WITHOUT reviews and adding them in Phase 3 after legal consultation.

### 4. Rankings / "Recommended" Wording
- **Status:** HIGH RISK
- Ranking lawyers (e.g., "best divorce lawyer") could be considered misleading
- The word "מומלץ" (recommended) implies endorsement
- **Recommendation:** Avoid "מומלץ" or "הטוב ביותר". Use neutral language: "עורכי דין בתחום X" or "עורכי דין באזור Y"
- Use factual sorting: by alphabetical, by distance, by number of articles, by registration date
- Featured placements must be labeled: "מיקום מקודם" or "פרופיל מובלט"

### 5. Lead Fees / Referral Fees
- **Status:** COMPLEX — REQUIRES LEGAL OPINION
- Rule 11A of the advertising rules addresses fee-sharing
- Lawyer-to-lawyer referral fees have specific restrictions
- A platform charging per-lead may be classified differently than a referral fee
- **Key distinction:** Advertising fee (allowed) vs. referral fee (restricted)
- **Recommendation:** Structure as advertising/marketing fee, not as referral commission. Consult an attorney specializing in legal ethics before launching.

### 6. Commission on Closed Cases
- **Status:** LIKELY PROHIBITED
- This closely resembles a referral fee / fee-sharing arrangement
- Rule 11A restricts splitting fees with non-lawyers
- The Midrag model (commission on closed deals) may not be applicable to legal services
- **Recommendation:** Do NOT implement this model without explicit legal clearance. Use flat-fee advertising or per-lead pricing instead.

### 7. Required Disclosures

Every lawyer profile/ad on the platform must include:
- Full name (שם מלא)
- Bar number (מספר רישיון)
- Practice areas (תחומי התמחות)
- City/region of practice (אזור פעילות)

Platform-level disclosures needed:
- "מדריכים אלה אינם מהווים ייעוץ משפטי" — editorial disclaimer
- "פרופילים ממומנים מסומנים בהתאם" — paid profile disclosure
- "תוצאות החיפוש אינן מהוות המלצה" — search results disclaimer
- Clear separation between editorial content and paid content

### 8. Lawyer Profile Content Rules
- Bio must be factual, not exaggerated
- Cannot claim "specialization" without recognized specialization certification (from the Bar)
- Can describe experience and practice areas
- Can list cases handled (with client consent)
- Cannot guarantee results
- Cannot use superlatives like "הטוב ביותר" (the best) without factual basis

## Implementation Guidelines

### SAFE to implement now:
- ✅ Lawyer directory with factual profiles
- ✅ Paid profile listings with "פרופיל ממומן" disclosure
- ✅ Featured/promoted placements with "מיקום מקודם" label
- ✅ Lead form that routes inquiries (as advertising service)
- ✅ Lawyer articles with author attribution
- ✅ Practice area + city pages with lawyer listings
- ✅ Bar number field (required)

### NEEDS legal consultation before implementing:
- ⚠️ Pay-per-lead pricing model (structure as advertising fee)
- ⚠️ Client reviews/ratings (verification requirements)
- ⚠️ "Verified lawyer" badge (what does verification mean?)
- ⚠️ Response time metrics (could be misleading)

### DO NOT implement without explicit legal clearance:
- ❌ Commission on closed cases
- ❌ "Recommended" or "Best" lawyer labels
- ❌ Rankings that imply quality judgment
- ❌ Fabricated or unverified reviews
- ❌ Claims of specialization without Bar certification

## Required Pages

1. **מדיניות פרסום ושיווק** (Advertising & Marketing Policy)
   - Explains how lawyer profiles work
   - Discloses paid vs. free profiles
   - Explains how search results are ordered

2. **מדיניות עריכה** (Editorial Policy)
   - Explains content creation process
   - Distinguishes editorial from sponsored content
   - Names responsible editor

3. **מדיניות פרטיות** (Privacy Policy)
   - Required by law (GDPR-equivalent: Protection of Privacy Law)
   - Explains data collection from leads and lawyers

4. **תנאי שימוש** (Terms of Use)
   - For visitors, leads, and registered lawyers
   - Liability limitations
   - Dispute resolution

## Action Items
- [ ] Create disclosure text for paid profiles
- [ ] Create advertising policy page
- [ ] Create editorial policy page
- [ ] Consult Israeli ethics attorney before Phase 3 (monetization)
- [ ] Add bar_number as required field in Lawyer CPT
- [ ] Add disclosure labels to featured placement components
