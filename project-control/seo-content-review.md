# SEO & Content Review — Jus-Tice
## Date: 2026-05-10
## Phase: Analysis and Recommendation

---

## 1. Topical Authority & Search Intent

Jus-Tice aims to capture high-value, high-intent traffic (e.g., "עורך דין גירושין במרכז").

### Current Strengths
*   **Volume:** The site appears to have a massive database of articles (~1,200). This provides excellent raw material for long-tail queries.
*   **Structure:** The division between "Lawyers" (Directory Intent) and "Articles" (Information Intent) is correct.

### Weaknesses & Risks
*   **Cannibalization Risk:** With 1,200 articles, there are likely dozens of articles covering the exact same topic (e.g., 5 articles on "How to file for divorce"). Google will not know which one to rank, leading to keyword cannibalization.
*   **Lack of Pillar Pages:** There doesn't seem to be a structured "Hub and Spoke" model.

## 2. The Pillar Strategy (Recommendation)

For every major practice area, we need a **Pillar Page** (e.g., `/family-law/divorce-lawyer/`).
This page must satisfy BOTH intents:
1.  **Informational:** Explain the process, costs, and timeline.
2.  **Transactional:** Display a curated list of top Divorce Lawyers in the user's city.

**Action:** Consolidate the 1,200 articles. Group them around 10-15 main Pillar Pages. Redirect the weak ones to the strong ones.

## 3. Schema Markup (Crucial)

To dominate SERPs, we must feed Google structured data.
*   **Lawyer Profiles:** Must use `LegalService` or `Attorney` Schema.
*   **Articles:** Must use `Article` or `FAQPage` Schema (highly effective for legal queries).
*   **Breadcrumbs:** `BreadcrumbList` Schema must be present on all pages.

## 4. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

Google strictly penalizes YMYL (Your Money or Your Life) sites that lack E-E-A-T.
*   **Author Bios:** Every article MUST be attributed to a specific, real lawyer with a link to their profile. "Admin" or "Jus-Tice Staff" will harm rankings.
*   **Review Process:** Articles should have a "Reviewed by Adv. [Name] on [Date]" badge.

## 5. SEO Recommendations

1.  **Content Audit:** Export all 1,200 URLs. Categorize by Intent and Traffic. Prune/Redirect the bottom 30%.
2.  **Implement Schema:** Ensure `justice-core` outputs valid JSON-LD schema for Lawyers.
3.  **Internal Linking Engine:** Develop a shortcode or automated block that injects "Related Lawyers" into the bottom of every article based on the taxonomy match.

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

* **Schema JSON-LD: VERIFIED WORKING.** WebSite + SearchAction confirmed on homepage. Article + BreadcrumbList confirmed in code. **Recommendation #2 above is partially DONE.**
* **OG tags: WORKING but "Archive" leak.** `/lawyers/` og:description says "עורכי דין Archive" — English word must be replaced.
* **hreflang: MISSING.** No `<link rel="alternate" hreflang="he">` tag found. Must be added for Hebrew language declaration.
* **TAXONOMY FRAGMENTATION CRITICAL:** 35+ practice-area terms on /articles/ with massive overlap. "דיני נזיקין" appears TWICE with different URLs. "ירושות/צוואות" has 3 separate terms. "נזיקין" has 4+ variant terms. **This is the #1 SEO cannibalization risk.**
* **E-E-A-T gap CONFIRMED:** Articles have no author attribution. No "Reviewed by Adv. [Name]" badges. All content appears site-authored — this directly harms YMYL rankings.
* **Mixed http/https links:** Some homepage practice-area links use `http://` not `https://`. Creates redirect overhead and mixed-content risk.
