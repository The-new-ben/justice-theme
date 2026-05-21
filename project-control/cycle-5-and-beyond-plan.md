# Jus-Tice Portal: Strategic Execution Plan (Cycle 5 & Beyond)

## Overview
This plan outlines the rigorous continuation of the Jus-Tice legal portal build. It transitions from the foundational setup and the Criminal Law cluster (Cycle 4) into mobile verification, CMS solidification, and the rollout of the Family Law cluster, while heavily prioritizing UX and Technical SEO based on industry-leading legal directories.

---

## Phase 1: Cycle 5 — Criminal Law Finalization & Mobile Verification
**Goal:** Close out the Criminal Law cluster with 100% completion and ensure flawless mobile usability.

1. **Content Completion:**
   - Generate and publish the final missing article: `אלימות במשפחה` (Family/Domestic Violence) — Target Vol: 720/mo.
   - Link this article back to the `/criminal-law/` hub and related spoke articles.
2. **Media & Trust Signals:**
   - Upload and attach the official profile photo for Sharon Nahari (Criminal Lawyer ID 19309).
   - Verify E-E-A-T elements (disclaimers, credentials) are visible on his profile.
3. **Mobile Journey QA:**
   - Test the hamburger menu toggle, dropdowns, and tap targets (minimum 44x44px for CTAs).
   - Ensure Lawyer Cards and Article Cards stack cleanly without horizontal overflow (`minmax` CSS grid validation).
   - Verify the sticky "Contact CTA" on single articles remains usable and non-intrusive on mobile screens.

---

## Phase 2: CMS Architecture & Technical SEO Solidification
**Goal:** Deploy the pending `justice-core` structural updates and implement competitive SEO best practices.

1. **Deploy Staged Core Components:**
   - Commit and push the pending `justice-core/` architecture (e.g., `seeder.php`, `batch-tagger.php`, `rest-content-tools.php`, `agent-bridge.php`).
   - Clean up the 7 legacy CPTs (e.g., `labor_law`, `small_claims`) still registered in the REST API.
2. **Schema & Structured Data Injection:**
   - Implement `LegalService` / `LocalBusiness` schema on all Lawyer profiles.
   - Implement `FAQPage` schema on all article pages with FAQ blocks.
   - Implement `BreadcrumbList` schema to define the site hierarchy for search engines.
3. **Navigation & Taxonomy Fixes:**
   - Programmatically or manually build the WP Admin menus (Primary, Footer, Mobile) to replace the 2-item fallback.
   - Resolve the duplicate taxonomy bug ("דיני נזיקין" appearing twice).
   - Ensure all demo/fictional lawyers are marked clearly or drafted to avoid credibility risks.

---

## Phase 3: The Family Law Cluster Rollout
**Goal:** Establish dominance in the next major practice area using the Pillar-Cluster model.

1. **Hub & Taxonomy Setup:**
   - Initialize the `/family-law/` hub.
   - Activate the staged `family-law-subtopics.php` structure.
2. **Content Generation (Spokes):**
   - Create comprehensive articles for high-volume keywords: Divorce (גירושין), Child Custody (משמורת ילדים), Alimony (מזונות), and Prenuptial Agreements (הסכם ממון).
3. **Lawyer Integration:**
   - Build out the profile for Rothenberg (Family Lawyer, ID 19130).
   - Link the Rothenberg profile to the new Family Law hub and specific sub-topic articles as the trusted authority.

---

## Phase 4: High-End UX & Conversion Rate Optimization (CRO)
**Goal:** Elevate the portal to a premium, high-conversion platform comparable to top-tier competitors.

1. **Visual Polish (DEFCON 1):**
   - Execute the remaining cycles from `visual-polish-plan.md` (e.g., premium text-based logo lockup, Glassmorphism hero panel, elegant category icons).
2. **Trust & Frictionless Conversion:**
   - Prominently display "Schedule a Consultation" or "Call Now" CTAs above the fold on lawyer profiles.
   - Ensure lead forms are minimalist (Name, Phone/Email, short message) to reduce cognitive load.
3. **Search & Discovery Optimization:**
   - Improve the global search box to support practice-area and city-based filtering, matching the user intent found in top directories like *din.co.il*.
