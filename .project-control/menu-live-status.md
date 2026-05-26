# Menu Live Status
Date: 2026-05-10

## LIVE VERIFIED
- Public desktop homepage currently shows a thin primary menu: mainly `אודות` and `צור קשר`.
- The dark topic strip is live and visible on desktop/mobile.
- Header includes `/legal-tools/` and `/lawyer-registration/` in public HTML from prior checks.

## FIXED IN CODE
- Added a public safety layer in `inc/menu-seed.php`: if the assigned WordPress primary menu is missing essential portal links, the theme appends:
  - עורכי דין
  - תחומי משפט with a dropdown
  - מאמרים משפטיים
  - שאלות ותשובות
  - הצטרפות עורכי דין
- This keeps the site usable even before wp-admin menu assignment is fixed.

## NEEDS LIVE VERIFICATION
- The appended primary links after Upress pulls this commit.
- Mobile hamburger with the fuller menu.
- Whether a real `primary`, `mobile`, `footer`, `legal_areas`, and `footer_trust` menu is assigned in wp-admin.

## BLOCKED
- Direct menu assignment requires wp-admin access.

## ADMIN STEPS
1. wp-admin > Appearance > Menus.
2. Create or edit a primary menu named `תפריט ראשי`.
3. Assign it to Primary and Mobile.
4. Add:
   - עמוד הבית
   - עורכי דין
   - תחומי משפט
   - מאמרים משפטיים
   - שאלות ותשובות
   - הצטרפות עורכי דין
   - יצירת קשר
5. Add the practice-area children under `תחומי משפט`.
6. Save and test desktop/mobile.
