# Lawyer System Audit — jus-tice.co.il
## Date: 2026-05-09

---

## CPT Existence Check

| Check | Status | Evidence |
|-------|--------|---------|
| `justice_lawyer` CPT registered | VERIFIED | `archive-justice_lawyer.php` and `single-justice_lawyer.php` both exist in theme and are named correctly per WP template hierarchy |
| Archive template | VERIFIED | `archive-justice_lawyer.php` — 7596 bytes |
| Single template | VERIFIED | `single-justice_lawyer.php` — 8518 bytes |
| CPT registered by plugin | INFERRED | Registered by `justice-core` or similar plugin (not in theme — correct) |

---

## Published Lawyers Check

| Check | Status | Evidence |
|-------|--------|---------|
| Published lawyers in CMS | NONE | `wp_count_posts('justice_lawyer')->publish === 0` — confirmed by hero stats showing 0 lawyers, and featured-lawyers section showing placeholder/demo |
| Draft lawyers | UNKNOWN | Possible via WP admin |

---

## Lawyer Card Fields

| Field | Source | Status |
|-------|--------|--------|
| Name | Post title | WORKING |
| Photo | Post thumbnail | NO PHOTO — placeholder shows initials |
| Firm | `firm_name` post meta | WORKING in template |
| Phone | `phone` post meta | In lawyer-card.php |
| Experience | `years_experience` post meta | In lawyer-card.php |
| Plan type | `plan_type` post meta | In lawyer-card.php |
| City | `city` taxonomy | In lawyer-card.php |
| Practice areas | `practice-areas` taxonomy | In lawyer-card.php |
| Demo badge | ADDED | Shows "דמו" red pill when using demo cards |

---

## Demo Cards System (NEW — Pass 3)

When no published lawyers exist, the homepage now shows 4 demo cards:
- **עו"ד דנה לוי** — משפחה וגירושין — תל אביב — 12 שנה
- **עו"ד אבי כהן** — נזיקין, תאונות — ירושלים — 18 שנה
- **עו"ד מיכל שרון** — מקרקעין ונדל"ן — חיפה — 9 שנה
- **עו"ד יוסי רוזן** — פלילי, תעבורה — ראשון לציון — 15 שנה

Each card has:
- Premium initials placeholder (first letter, navy gradient)
- Red "דמו" badge
- Name, city, firm, areas, experience
- "צפייה בפרופיל" → /lawyers/
- "שליחת פנייה" → /contact/
- Disclaimer: "הכרטיסיות לעיל הן לדמיון בלבד"

---

## How to Add a Real Lawyer (Admin Instructions)

1. Log into WP Admin → Lawyers (or Custom Post Type)
2. Click "Add New"
3. Title = Lawyer full name (e.g., עו"ד רחל כהן)
4. Set Featured Image = professional photo (head shot)
5. Fill meta fields:
   - Firm Name
   - Phone
   - WhatsApp number
   - City (taxonomy)
   - Practice Areas (taxonomy — can multi-select)
   - Years of Experience
   - Short bio (excerpt)
   - Plan Type (pro / standard / free)
6. Publish
7. Lawyer card immediately appears on homepage and archive

---

## Next Actions

1. Add at least 1 real lawyer post to replace demo cards
2. Add featured photos or keep initials system
3. Verify `single-justice_lawyer.php` displays correctly
4. Verify lawyer archive filters work (area + city)

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

* **10 SEED LAWYERS NOW PUBLISHED.** Maya Rotenberg, David Cohen, Moshe Levy, Sarah Ben-David, Tamar Goldstein, Eitan Shapira, Yossi Avraham, Liat Mizrahi, Noa Peretz, Avi Katz. All visible at /lawyers/ and on homepage featured section.
* **ALL USE FAKE DATA.** Phone numbers are 972545551234-style. WhatsApp links point to fake numbers. **Must be unpublished or marked as demo before any public marketing.**
* **NO FILTER BAR on /lawyers/ archive.** Users can see 10 cards but cannot filter by practice area or city. This makes the directory non-functional as a marketplace.
* **"Herzliya" in English** on Tamar Goldstein's city field. All other cities in Hebrew. Data quality issue in seed.
* **Hebrew URL slugs:** `/lawyers/עוד-מאיה-רוטנברג/` — violates the English slug normalization plan.
