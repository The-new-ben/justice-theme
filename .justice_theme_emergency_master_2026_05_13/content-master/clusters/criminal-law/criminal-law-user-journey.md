# Criminal Law — User Journey Review
**Date:** 2026-05-14 (verified live after commit cda8a18)

## Persona
A person in Israel who was summoned to police investigation or needs a criminal lawyer urgently.

---

## Step 1: Homepage
- **URL:** `https://jus-tice.co.il/`
- **What user sees:** Header with logo + nav, hero section "עורכי דין בישראל", practice area cards grid, lead form
- **Criminal Law visible:** YES — practice area card for "משפט פלילי" exists in grid
- **Clear purpose:** YES — user can see practice areas and click Criminal Law
- **Professional feel:** YES — clean dark theme, RTL, modern layout
- **Missing:** No main menu dropdown for practice areas (only grid cards)
- **Status:** ✅ WORKING

## Step 2: Criminal Law Practice Area Page
- **URL:** `https://jus-tice.co.il/practice-areas/criminal-law/`
- **What user sees:** H1 "משפט פלילי", intro description, lawyer section, article grid, CTA, related areas
- **H1:** ✅ "משפט פלילי"
- **Description:** ✅ Custom text about criminal law scope and disclaimer
- **Lawyer cards:** ✅ Sharon Nahari appears (after taxonomy fix) with practice area + city
- **Article grid:** PENDING — needs uPress pull of archive query fix (commit cda8a18)
- **CTA:** ✅ "השארת פנייה" + "חיפוש עורכי דין בתחום" buttons
- **Related areas:** ✅ Shows other practice area cards (Family, Traffic, etc.)
- **Breadcrumbs:** NEEDS VERIFICATION after pull
- **Professional feel:** YES — well-structured hub page
- **Missing:** Article grid will show after uPress pull; currently shows "המדריכים בתחום הזה בהכנה"
- **Status:** ⚠️ PARTIALLY WORKING (articles fix pushed, needs pull)

## Step 3: Criminal Law Pillar
- **URL:** `https://jus-tice.co.il/criminal-defense-attorney/`
- **What user sees:** Full pillar article "עורך דין פלילי", 22.4K chars, hub navigation
- **H1:** ✅ "עורך דין פלילי"
- **Hub links:** ✅ Links to all 17 support articles
- **FAQ section:** ✅ Present
- **E-E-A-T footer:** ✅ Disclaimer, sources, updated date
- **CTA:** ✅ Contact section
- **Professional feel:** YES — comprehensive, authoritative guide
- **Status:** ✅ WORKING

## Step 4: Supporting Article (example)
- **URL:** `https://jus-tice.co.il/articles/criminal-record-deletion/`
- **What user sees:** Guide on criminal record deletion
- **Back-link to pillar:** ✅ E-E-A-T footer links to pillar
- **Sources:** ✅ Official links to nevo.co.il, kolzchut
- **Disclaimer:** ✅ Present
- **FAQ:** ✅ Present
- **Status:** ✅ WORKING

## Step 5: Lawyer Profile
- **URL:** `https://jus-tice.co.il/lawyers/advocate-sharon-nahari/`
- **What user sees:** Lawyer profile page with name, bio, practice areas, cities
- **Name:** ✅ "עו״ד שרון נהרי"
- **Practice area:** ✅ "משפט פלילי" (after taxonomy fix)
- **City:** ✅ "תל אביב" + "בני ברק"
- **Contact CTA:** ✅ Present
- **Photo:** ❌ MISSING — no featured image set
- **Bio:** ✅ Present
- **Professional feel:** PARTIAL — needs photo, more polished layout
- **Status:** ⚠️ WORKING but missing photo

## Step 6: Lawyer Directory
- **URL:** `https://jus-tice.co.il/lawyers/?area=criminal-law`
- **What user sees:** Lawyer directory filtered by Criminal Law
- **Sharon Nahari appears:** ✅ YES — card with name, city, practice area
- **Filter working:** ✅ Criminal Law filter active
- **Professional feel:** YES
- **Status:** ✅ WORKING

## Step 7: Lead/CTA
- **URL:** `https://jus-tice.co.il/#ask-lawyer`
- **What user sees:** Lead form on homepage
- **Form present:** ✅ YES
- **Fields:** Name, phone, practice area, description
- **Status:** ✅ WORKING

## Step 8: Mobile
- **Status:** NOT YET VERIFIED — need separate mobile test

---

## User Journey Score

| Step | Status | Score |
|------|--------|-------|
| Homepage → Criminal Law | ✅ | 8/10 |
| Practice Area Page | ⚠️ | 6/10 (articles pending) |
| Pillar Page | ✅ | 9/10 |
| Support Article | ✅ | 8/10 |
| Lawyer Profile | ⚠️ | 6/10 (no photo) |
| Lawyer Directory | ✅ | 8/10 |
| Lead CTA | ✅ | 7/10 |
| **Overall** | **⚠️** | **7.4/10** |

## Top Gaps
1. Practice area page shows no articles (fix pushed, needs uPress pull)
2. Lawyer profile has no photo
3. Mobile journey not verified
4. No main menu dropdown for practice areas
5. Category page `/category/criminal-law/` is unused/redirects — should be resolved
