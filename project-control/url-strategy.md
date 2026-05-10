# URL Strategy — Jus-Tice
## Date: 2026-05-10
## Phase: Analysis and Recommendation

---

## 1. The Core Decision: Hebrew vs. English Slugs

**Decision:** The site UI and content are in Hebrew. The URL slugs MUST be translated to clean, semantic English.

### Why?
1.  **Sharing:** Hebrew URLs break when shared on WhatsApp, Facebook, or Email, turning into massive, ugly UTF-8 strings (e.g., `%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F`). This looks like spam and reduces Click-Through Rate (CTR).
2.  **Analytics:** Google Analytics and Search Console are much easier to parse when URLs are clean ASCII.
3.  **Brevity:** English legal terms are often shorter than Hebrew counterparts.

## 2. Global URL Architecture

| Content Type | Current Slug Pattern | Recommended Slug Pattern | Example |
| :--- | :--- | :--- | :--- |
| **Lawyer Profile** | `/lawyers/שם-עורך-הדין/` | `/lawyers/{first-last}/` | `/lawyers/maya-rotenberg/` |
| **Practice Area** | `/practice-areas/דיני-משפחה/` | `/{practice-area}/` | `/family-law/` |
| **City Filter** | `/?city=תל-אביב` | `/lawyers/{city}/` | `/lawyers/tel-aviv/` |
| **Articles** | `/articles/שם-המאמר/` | `/{practice-area}/{topic-slug}/` | `/family-law/divorce-agreement-guide/` |
| **Category/Pillar** | `/category/דיני-משפחה/` | `/{practice-area}/` | `/family-law/` |

## 3. Pillar Architecture

Remove the `/category/` and `/practice-areas/` bases entirely. The top-level slug should define the silo.

**Example Silo: Family Law**
*   **Pillar:** `jus-tice.co.il/family-law/` (Shows overview, top lawyers, latest articles).
*   **Sub-Service:** `jus-tice.co.il/family-law/divorce-lawyer/`
*   **Article:** `jus-tice.co.il/family-law/child-support-calculator/`
*   **Lawyer Directory Filter:** `jus-tice.co.il/family-law/lawyers/tel-aviv/`

## 4. Migration Rules & Risks

**WARNING:** Do not change URLs without a 1-to-1 301 redirect map.
Changing 1,200 slugs simultaneously without mapping will destroy existing SEO rankings.

1.  **Rule 1:** Export all current URLs and traffic data from Google Search Console.
2.  **Rule 2:** Identify the top 20% of traffic-driving URLs. These must be mapped manually to ensure semantic accuracy.
3.  **Rule 3:** The remaining 80% can be translated programmatically (e.g., using an LLM to generate the `slug-normalization-rules.md`), but must still be 301 redirected.
4.  **Rule 4:** Update all internal links to point to the new English slugs to avoid redirect chains.

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

* **LAWYER SLUGS VIOLATE PLAN:** Live site uses `/lawyers/עוד-מאיה-רוטנברג/` (Hebrew). Plan above calls for `/lawyers/maya-rotenberg/` (English). **ALL 10 seed lawyer slugs need migration.**
* **PRACTICE AREAS — MIXED STATE:** Some new terms use the `/practice-areas/` prefix correctly (environmental-law, insurance-law, blockchain-crypto). But most legacy practice areas still use old bare-slug WP category URLs (`/family-law/`, `/criminal-law/`). These two structures CONFLICT.
* **Contact/About pages use `?page_id=42` and `?page_id=315`** — raw WP parameter URLs. Must create pretty slugs `/contact/` and `/about/`.
* **No evidence of 301 redirect implementation yet.** Migration rules above are still pre-requisites.
