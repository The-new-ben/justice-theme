# Next Actions — jus-tice.co.il
## Updated: 2026-05-09

---

## CRITICAL — Must Be Done By Admin in WordPress (You / Client)

### 1. Create Real Navigation Menu (15 minutes)
- Login: WP Admin → Appearance → Menus
- Create menu "תפריט ראשי"
- Add items: עמוד הבית, עורכי דין, תחומי משפט (with Practice Area children), מאמרים משפטיים, ייעוץ משפטי, [CTA] מצאו עורך דין
- Assign to: Primary location
- Repeat for Footer menu

### 2. Upload Real Logo (5 minutes)
- WP Admin → Appearance → Customize → Site Identity
- Upload logo PNG or SVG (min 260×80px)
- The brand-lockup will auto-hide once custom_logo is set

### 3. Add at Least 1 Real or Test Lawyer (20 minutes)
- WP Admin → Lawyers → Add New
- Title = Lawyer name (Hebrew)
- Set photo or leave blank (initials placeholder)
- Add meta: firm, city, practice areas, phone, experience
- Set status to Publish
- Demo cards disappear automatically

---

## IMMEDIATE CODE FIXES DONE (Pass 3 — Deployed)

- [x] **Menu fallback** — 6-item menu with practice-area dropdown (dynamic taxonomy)
- [x] **Mobile nav accordion** — navigation.js rewritten for is-open toggle
- [x] **Lawyer demo cards** — 4 premium demo cards with disclaimer
- [x] **Featured lawyers query** — removed featured_until requirement
- [x] **Article archive title** — English "Articles" → Hebrew "ספריית מאמרים משפטיים"
- [x] **Hero depth** — radial gradient + dot pattern overlay
- [x] **premium-pass-3.css** — nav dropdown, lawyer chips, mobile hero, header CTA
- [x] **navigation.js** — full rewrite with dropdown + close-on-outside-click

---

## NEXT CODE PASS (Pass 4)

- [ ] Practice area card icons — add emoji/SVG icon mapping per taxonomy term
- [ ] Lawyer archive filters — verify area + city filters work on /lawyers/
- [ ] Single lawyer profile — visual QA of single-justice_lawyer.php
- [ ] Hero background image — generate or use abstract SVG pattern
- [ ] Ask-a-lawyer form — connect to CF7 or WPForms
- [ ] Footer nav — wire to wp_nav_menu with footer location
- [ ] Trust section numbers — verify article count is dynamic

---

## DOCUMENTATION COMPLETED

- [x] competitor-element-analysis.md
- [x] cms-audit.md
- [x] cms-checklist.csv
- [x] logo-audit.md
- [x] menu-audit.md
- [x] lawyer-system-audit.md
- [x] frontend-cms-map.md
- [x] visual-qa-report.md
- [x] mobile-visual-qa.md
- [x] next-actions.md
- [x] deep-dive-audit-v2.md ← NEW

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

* **Pass 4 PRIORITY REORDER based on V2 findings:**
  1. 🔴 **P0: Unpublish or mark seed lawyers as DEMO** — 10 fictional lawyers live with fake numbers
  2. 🔴 **P0: Fix English text leak** — 404.php body, search.php H1, search pagination
  3. 🔴 **P0: Fix "Archive" OG meta leak** — /lawyers/ og:description
  4. 🟡 **P1: Add lawyer archive filters** — no filter bar for area/city on /lawyers/
  5. 🟡 **P1: Fix mixed http/https links** — homepage practice-area grid
  6. 🟡 **P1: Fix `?page_id=42`/`?page_id=315`** — Contact/About need pretty URLs
  7. 🟡 **P1: Fix profile_views DB write** — remove or defer to async/cron
* **Admin items from original "CRITICAL" section:**
  * ✅ Menu — RESOLVED (7 items live)
  * ⬜ Logo — STILL PENDING
  * ⬜ Real lawyers — STILL PENDING (seed data is placeholder)
