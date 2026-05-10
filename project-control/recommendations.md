# Strategic Recommendations & Roadmap — Jus-Tice
## Date: 2026-05-10
## Phase: Analysis and Recommendation

---

This document prioritizes the findings from all reviews into an actionable execution roadmap.

## 1. Quick Wins (Next 48 Hours)
*These require no new infrastructure, just execution.*

1.  **Seed the WP Menu:** Verify `menu-seed.php` ran, or manually create the "Main Menu" in WP Admin so the header isn't empty.
2.  **Publish Demo Lawyers:** Move the 10 lawyers in `lawyer-seed.csv` from `draft` to `publish` via the REST API or WP Admin so the homepage cards are real CPT data.
3.  **Upload Logo:** Replace `logo.png` via WP Customizer with a real brand asset.
4.  **Add Taxonomy Icons:** Map SVG icons to the `practice-areas` terms to fix the broken grid on the homepage.
5.  **Wire Lead Forms:** Connect the HTML forms in the Hero and "Ask a Lawyer" sections to a form plugin (Gravity Forms/CF7) that creates `justice_lead` posts.

## 2. Deep Work Required (Next 30 Days)
*These are architectural shifts required for the business model.*

1.  **Lawyer Onboarding Portal:**
    *   Build a frontend registration flow for lawyers.
    *   Integrate a payment gateway (Stripe/WooCommerce Subscriptions).
    *   Create a simple dashboard for lawyers to view leads and edit their profile.
2.  **SEO Silo Restructuring:**
    *   Export all 1,200 URLs.
    *   Map the top 20% to the new English slug architecture (`/family-law/divorce-guide/`).
    *   Implement 301 redirects and update internal links.
3.  **Pillar Pages:**
    *   Design and build 10 "Pillar Pages" (e.g., `/family-law/`) that combine the practice area description, top lawyers in that field, and latest articles.
4.  **Real Content Audit:**
    *   Identify and merge cannibalizing articles. Ensure every article has an author linked to a Lawyer Profile.

## 3. Legal-Tech Innovations (Q3-Q4)
*These are the differentiators that will crush din.co.il.*

1.  **AI Intake Assistant:** A chat interface replacing static forms to pre-qualify leads.
2.  **Automated Document Generation:** Flat-fee legal templates (NDA, Lease) that upsell lawyer reviews.
3.  **AI Content Assistant:** A tool in the lawyer dashboard to help them draft SEO-optimized articles quickly.

## 4. What I Could Not Verify (Access Blockers)

*   **WP Admin Functionality:** Browser automation failed repeatedly due to timeouts and active connection refusals. I could not verify if `menu-seed.php` successfully populated the menu, nor could I publish lawyers manually.
*   **Active Plugins:** I cannot verify exactly which plugins are active on the live production server (e.g., `justice-core` vs `justice-core-v3`) without authenticated REST API access or WP-CLI.
*   **Google Search Console Data:** I do not have access to GSC to see which of the 1,200 articles actually drive traffic, making a precise URL migration map impossible right now.

## 5. What Access I Need

*   **Application Passwords:** I need a WordPress Application Password for an Administrator account to use the REST API for creating menus, publishing posts, and auditing plugins reliably. Browser automation is too brittle for this environment.
*   **GSC Export:** A CSV export of the top 500 landing pages from Google Search Console to plan the URL migration safely.

## 6. Next Immediate Action Items

1.  Provide Application Password for WP REST API.
2.  Confirm preference for English URL slugs.
3.  Provide the official vector logo file.
4.  Provide 5-10 real lawyer profiles (or confirm we should use the fictional seed data) to publish.

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

* **Quick Win #1 (Menu): DONE.** Live site has 7-item menu with practice-area dropdown working.
* **Quick Win #2 (Publish Lawyers): DONE but PROBLEMATIC.** 10 lawyers published — but they're all fictional seed data with fake phone numbers. Presented as real. **Must be marked as demo or unpublished.**
* **Quick Win #3 (Logo): STILL PENDING.** CSS fallback active. No image logo uploaded.
* **Quick Win #4 (Taxonomy Icons): PARTIALLY DONE.** Practice area grid shows counts. Icons may still be generic.
* **Quick Win #5 (Lead Forms): STILL PENDING.** Ask-a-lawyer form section visible but not wired to CRM.
* **NEW PRIORITY ITEMS from V2 audit:**
  - Fix English text on 404.php and search.php (3 strings)
  - Fix "Archive" OG description leak on /lawyers/
  - Fix `?page_id=42`/`?page_id=315` for Contact/About
  - Merge duplicate taxonomy terms (דיני נזיקין x2)
  - Add hreflang `he` tag
  - Remove profile_views DB write from page load
