# E-E-A-T Author Authority — Research & Implementation Plan
**Date:** 2026-05-18
**Prepared by:** Antigravity (Claude Opus)
**Research sources:** 5 separate web searches covering Google guidelines, Moz, Ahrefs, Search Engine Land, Israeli Bar Association, and WordPress implementation patterns.

---

## WHY THIS MATTERS

We added "מאת עו״ד בן בטש" as a visible byline on all articles (commit `ea369a6`). **But a name alone is NOT enough.** Google's Quality Raters look for a **publicly verifiable footprint** — a chain of evidence proving that the named author is a real, qualified person who stands behind the content.

For legal content (YMYL — Your Money or Your Life), Google holds this to the **highest possible standard**. A byline without a verifiable author page is worse than no byline at all — it looks like a fake attempt to game trust signals.

---

## WHAT GOOGLE ACTUALLY LOOKS FOR (Based on Research)

### The 3-Layer Author Authority Chain

```
Layer 1: BYLINE on every article
  → "מאת עו״ד בן בטש" — ✅ DONE (commit ea369a6)
  → Links to the author's dedicated bio page — ❌ NOT DONE

Layer 2: AUTHOR BIO PAGE (dedicated URL)
  → /about/ben-batash/ or /team/ben-batash/
  → Full professional credentials
  → Professional photo
  → Links to external verifiable profiles (sameAs)
  → Person schema markup
  → ❌ NOT DONE — THIS PAGE DOES NOT EXIST

Layer 3: EXTERNAL VERIFICATION (off-site)
  → Israel Bar Association profile (israelbar.org.il)
  → LinkedIn professional profile
  → Any legal directories, publications, or speaking engagements
  → ❌ NOT VERIFIED — need owner to provide these links
```

---

## WHAT THE AUTHOR BIO PAGE MUST CONTAIN

Based on consolidated research from Moz, Ahrefs, Search Engine Land, and Google's own Quality Rater Guidelines:

### Required Elements

| Element | Description | Priority |
|---------|-------------|----------|
| **Full name** | עו״ד בן בטש (Ben Batash, Adv.) | 🔴 CRITICAL |
| **Professional title** | e.g., "עורך דין ומייסד Jus-Tice" | 🔴 CRITICAL |
| **Professional photo** | Real headshot, no stock photos | 🔴 CRITICAL |
| **Bar membership** | Israel Bar Association number + link to official directory | 🔴 CRITICAL |
| **Education** | Law degree, university, graduation year | 🟡 HIGH |
| **Years of practice** | How long they've been practicing | 🟡 HIGH |
| **Practice areas** | Criminal law, family law, etc. | 🟡 HIGH |
| **Experience narrative** | Real-world case experience (within ethical limits) | 🟡 HIGH |
| **sameAs links** | LinkedIn, Bar profile, law firm page | 🔴 CRITICAL |
| **Contact path** | Email or contact form | 🟡 HIGH |
| **Published articles list** | Links to articles on the site | 🟢 MEDIUM |
| **Editorial policy** | How content is reviewed and kept accurate | 🟢 MEDIUM |

### Israeli Bar Association Specifics

- The Israel Bar Association (לשכת עורכי הדין) maintains an official attorney directory at **israelbar.org.il**
- You can search by name, license number, location, or expertise
- Including the **Bar license number** and a **direct link** to the official IBA profile is the strongest trust signal for an Israeli legal site
- Must comply with the **Advocates Law (1961)** and **Rules of Ethics for Advocates (1986)** — no misleading claims, no "best lawyer" language

---

## SCHEMA MARKUP — PROPER IMPLEMENTATION

### Current State (What We Have)
```json
{
  "@type": "Article",
  "author": {
    "@type": "Person",
    "name": "עו״ד בן בטש",
    "url": "https://jus-tice.co.il/"
  }
}
```

### What It Should Be (After Author Page Exists)
```json
{
  "@type": "Article",
  "author": {
    "@type": "Person",
    "@id": "https://jus-tice.co.il/about/ben-batash/#person",
    "name": "עו״ד בן בטש",
    "url": "https://jus-tice.co.il/about/ben-batash/",
    "jobTitle": "עורך דין ומייסד",
    "worksFor": {
      "@id": "https://jus-tice.co.il/#organization"
    },
    "sameAs": [
      "https://www.linkedin.com/in/XXXXXXX",
      "https://www.israelbar.org.il/attorney/XXXXXXX"
    ]
  }
}
```

### On the Author Bio Page Itself
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://jus-tice.co.il/about/ben-batash/#person",
  "name": "עו״ד בן בטש",
  "jobTitle": "עורך דין ומייסד Jus-Tice",
  "worksFor": {
    "@type": "LegalService",
    "@id": "https://jus-tice.co.il/#organization",
    "name": "ג'סטיס - פורטל משפטי"
  },
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "UNIVERSITY_NAME_HERE"
  },
  "knowsAbout": ["Criminal Law", "Family Law", "Real Estate Law"],
  "sameAs": [
    "https://www.linkedin.com/in/XXXXXXX",
    "https://www.israelbar.org.il/attorney/XXXXXXX"
  ],
  "image": "https://jus-tice.co.il/wp-content/uploads/AUTHOR_PHOTO.jpg"
}
```

> **IMPORTANT:** `Attorney` schema type has been **deprecated** by Schema.org. Use `Person` for individuals and `LegalService` for the firm.

---

## IMPLEMENTATION PLAN

### Step 1: Owner Provides Information (BLOCKED — needs owner input)
The owner (Ben Batash) must provide:
- [ ] Israel Bar Association license number
- [ ] LinkedIn profile URL
- [ ] Professional headshot photo
- [ ] University/law school name + graduation year
- [ ] Years of practice
- [ ] Brief bio in Hebrew (3–5 paragraphs, third person)
- [ ] Any other professional directory listings

### Step 2: Create the Author Bio Page
- Create a WordPress page at `/about/ben-batash/` (or `/team/ben-batash/`)
- Implement the full `Person` schema on that page
- Include all the elements from the table above
- Link the byline on every article to this page

### Step 3: Update Article Schema
- Change `author.url` from homepage to the author bio page
- Add `@id` reference to connect Article → Person → Organization graph
- Add `sameAs` array with external profile URLs

### Step 4: Create Editorial Policy Page
- Create `/editorial-policy/` or `/about/editorial-policy/`
- Explain how content is created, reviewed, and updated
- Reference the author's qualifications
- State the disclaimer and content accuracy standards

### Step 5: Verify
- Run Google Rich Results Test on the author page
- Run Google Rich Results Test on 3+ articles
- Verify the Person schema appears correctly
- Verify sameAs links resolve

---

## WHAT WE SHOULD NOT DO

1. **Do NOT fabricate credentials** — only use real, verifiable information
2. **Do NOT use stock photos** — must be a real professional headshot
3. **Do NOT claim "best lawyer"** — violates Israeli Bar ethics rules
4. **Do NOT add sameAs links we haven't verified** — broken links hurt trust
5. **Do NOT skip the author page** — a byline without a linked bio page is a half-measure that could backfire

---

## RESEARCH SOURCES CONSULTED

1. **Google E-E-A-T author page best practices 2024-2025** — YMYL legal content, author bio schema, professional credentials
2. **Author authority establishment for Google SEO** — Person schema, sameAs implementation, legal website specifics
3. **Moz / Ahrefs / Search Engine Land** — E-E-A-T page requirements checklist, author page best practices
4. **Israeli Bar Association requirements** — Official directory (israelbar.org.il), Advocates Law (1961), ethics rules
5. **WordPress Person schema implementation** — JSON-LD patterns, sameAs best practices, @id graph stacking
