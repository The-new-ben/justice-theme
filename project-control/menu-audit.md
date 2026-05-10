# Menu Audit — jus-tice.co.il
## Date: 2026-05-09

---

## Theme Menu Locations (Registered in setup.php)

| Location Key | Label (Hebrew) | Status |
|-------------|----------------|--------|
| `primary` | תפריט ראשי | ASSIGNED — only 2 items |
| `secondary` | תפריט משני | NOT ASSIGNED |
| `mobile` | תפריט נייד | NOT ASSIGNED |
| `footer` | תפריט תחתון | NOT ASSIGNED |
| `legal_areas` | תפריט תחומי משפט | NOT ASSIGNED |
| `footer_trust` | תפריט מידע שימושי | NOT ASSIGNED |

---

## Current Primary Menu (Live Screenshot Verified)

```
1. עמוד הבית
2. אינדקס עורכי דין בישראל
```

**Problem:** Only 2 items. No practice-areas dropdown. No articles. No contact.

---

## Fixed Fallback Menu (Now in Code)

The `justice_theme_fallback_menu()` function now renders:

```
1. עמוד הבית → /
2. עורכי דין → /lawyers/
3. תחומי משפט → # [DROPDOWN]
   └─ [Auto-pulled from practice-areas taxonomy — top 10 by count]
   └─ OR static: משפחה/פלילי/מקרקעין/עבודה/נזיקין/תעבורה/ירושה/מיסים
4. מאמרים משפטיים → /articles/
5. ייעוץ משפטי → /contact/
6. [CTA] מצאו עורך דין → /lawyers/
```

Dropdown: Pulls from `practice-areas` taxonomy dynamically. Falls back to 8 static items.
Mobile: Sub-menu accordion added via navigation.js `is-open` toggle.

---

## Recommended WP Admin Menu Structure

Log in → Appearance → Menus → Create new menu "תפריט ראשי" and assign to Primary:

```
תפריט ראשי:
  עמוד הבית         → /
  עורכי דין          → /lawyers/
  תחומי משפט        → Custom URL: #
    ↳ משפחה וגירושין   → /practice-areas/family/
    ↳ משפט פלילי       → /practice-areas/criminal/
    ↳ מקרקעין ונדל"ן   → /practice-areas/real-estate/
    ↳ דיני עבודה       → /practice-areas/labor/
    ↳ נזיקין ותאונות   → /practice-areas/torts/
    ↳ תעבורה           → /practice-areas/traffic/
    ↳ ירושה וצוואות    → /practice-areas/inheritance/
    ↳ מיסים            → /practice-areas/taxes/
  מאמרים משפטיים    → /articles/
  ייעוץ משפטי        → /contact/
  [CTA] מצאו עורך דין → /lawyers/
```

Footer Menu (assign to `footer` location):
```
  אינדקס עורכי דין → /lawyers/
  מאמרים משפטיים   → /articles/
  הצטרפות עורכי דין → /join/
  יצירת קשר         → /contact/
```

---

## Mobile Menu Status

- **Toggle:** ☰ icon button working ✓
- **Opens:** Full-screen dark overlay ✓
- **Shows:** Same 6 items from fallback ✓
- **Dropdown accordion:** Added via navigation.js `is-open` class
- **Closes:** Click outside, Escape key ✓

---

## Next Actions

1. **WP Admin:** Create real menu with above structure
2. **WP Admin:** Assign to Primary + Footer + Mobile locations
3. **CSS:** Dropdown arrow already added via `::after` content
4. **CSS:** `.menu-item--cta` class targets the CTA button style

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

* **MENU NOW FULLY POPULATED on live site.** Confirmed 7 items: צור קשר, אודות, עורכי דין, תחומי משפט (mega-dropdown with 20+ practice areas), מאמרים, שאלות, הצטרפות. Original "2 items" problem is **RESOLVED**.
* **BUG: Contact/About use `?page_id=42` and `?page_id=315`** — non-pretty URLs visible in header nav. Must create proper page slugs (`/contact/`, `/about/`).
* **Dropdown working:** Practice-area sub-menu renders correctly with taxonomy terms.
