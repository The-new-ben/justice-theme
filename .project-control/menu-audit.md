# Menu Audit
Date: 2026-05-09

## VERIFIED From Repo
- Theme registers menu locations: `primary`, `secondary`, `mobile`, `footer`, `legal_areas`, `footer_trust`.
- Header renders assigned `primary` menu and falls back to a dynamic menu.
- Fallback menu includes home, lawyers, practice areas dropdown, articles, consultation, and find-a-lawyer CTA.

## VERIFIED From Public Live HTML
- Public extract shows only secondary-looking links near the top: contact and about.
- Primary menu may be hidden in text extraction or not assigned properly. NOT VERIFIED visually.

## Required Primary Menu
- עמוד הבית
- עורכי דין
- תחומי משפט
- מאמרים משפטיים
- שאלות ותשובות
- פסקי דין / מגזין
- הצטרפות עורכי דין
- יצירת קשר

## Required Mega/Dropdown Under תחומי משפט
- משפחה וגירושין
- פלילי
- תעבורה
- מקרקעין
- נזיקין
- עבודה
- ירושה וצוואות
- רשלנות רפואית
- מיסים
- סייבר ופרטיות

## Next Action
- Verify live menu assignments through WP admin/WP-CLI.
- If no menu is assigned, improve the fallback to exactly match the required structure.
