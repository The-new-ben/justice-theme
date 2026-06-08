# JUS-TICE Legal Tech Portal — Milestone 6 E-E-A-T Advisory Board Analysis

## Executive Summary
This report analyzes the practice areas, Hub and Spoke page structures, SEO metadata, JSON-LD structured data (schema markup), and testing mechanisms in the JUS-TICE legal tech portal. It provides detailed architecture mapping and concrete engineering recommendations for integrating 20 legal experts and dynamically mapping them to Hub and Spoke pages.

---

## 1. Directory Structure & Key Codebase Paths
The codebase relies on Next.js App Router. The core paths under investigation are:
- **Category Hub Pages (dynamic router)**: `src/app/practice-areas/[category]/page.js`
- **Spoke Pages (dynamic nested router)**: `src/app/practice-areas/[category]/[slug]/page.js`
- **Data Layer & Fallbacks**: `src/lib/wordpress.js` (houses raw mock schemas and dynamic API retrieval)
- **Sitemap Compilation**: `src/app/sitemap.js`
- **E2E Testing Suite**: `tests/e2e/tests.js` (executed via custom Node.js runner `tests/e2e/runner.js`)

---

## 2. Practice Areas, Categories, and Slugs (Mapping & Definition)
The list of practice areas is centrally defined in `src/lib/wordpress.js` within `OFFLINE_DB.hubs`. Each category (Hub) and its sub-pages (Spokes) are outlined below:

| Category Slug (`[category]`) | Hub Title (Hebrew) | Associated Spoke Slugs (`[slug]`) | Spoke Titles (Hebrew) |
| :--- | :--- | :--- | :--- |
| **`labor-law`** | דיני עבודה | `severance-pay-calculator`<br>`prior-notice-calculator` | מחשבון פיצויי פיטורין<br>מחשבון הודעה מוקדמת |
| **`real-estate-law`** | נדל״ן ומקרקעין | `purchase-tax-calculator`<br>`betterment-levy-estimator` | מחשבון מס רכישה<br>אומדן היטל השבחה |
| **`family-law`** | דיני משפחה | `child-support-calculator`<br>`divorce-agreement-approval`<br>`rabbinical-agreement-approval` | מחשבון דמי מזונות<br>אישור הסכם גירושין (משפחה)<br>אישור הסכם גירושין (רבני) |
| **`personal-injury-law`** | נזקי גוף | `whiplash-compensation-estimator`<br>`car-accident-claim-guide` | אומדן פיצוי צליפת שוט<br>מדריך תביעת תאונת דרכים |
| **`criminal-law`** | משפט פלילי | `police-interrogation-rights`<br>`criminal-record-deletion` | זכויות בחקירת משטרה<br>מחיקת רישום פלילי |
| **`medical-malpractice`** | רשלנות רפואית | `hospital-negligence-claims`<br>`delayed-diagnosis-lawsuits` | תביעות רשלנות בבית חולים<br>תביעות איחור באבחון |

### Where Defined:
*   **Production Source**: Headless WordPress GraphQL endpoint (fetching custom posts/taxonomies) via `src/lib/wordpress.js`.
*   **Offline Fallback**: The `OFFLINE_DB` object inside `src/lib/wordpress.js` acts as the single source of truth when the WordPress API is unreachable or credentials are not supplied.

---

## 3. Page Structure Analysis (Hub vs. Spoke)

### A. Hub Pages (`src/app/practice-areas/[category]/page.js`)
- **Static Generation**: Uses `generateStaticParams()` returning `category` values from `getAllLocalHubs()`.
- **Data Load**: Calls `getLocalHub(category)` to load the specific practice area.
- **Layout & Components**:
  - Implements dynamic breadcrumbs navigation: `בית` ➔ `תחומי התמחות` ➔ `{hub.title}`.
  - Interactive "Reviewed By" banner showcasing the designated legal reviewer's name, credentials, and links.
  - Embeds category-specific lead intake forms or calculators.
  - Lists related articles/Spokes within the category.
  - Sidebar showing the expert's LinkedIn link and bio page.
- **SEO & Alternate Links**:
  - `generateMetadata({ params })` dynamically generates localized titles and descriptions from `hub.seoTitle` and `hub.seoDescription`.
  - Canonical link sets: `https://jus-tice.co.il/practice-areas/[category]`.
- **JSON-LD Schema Markup**:
  - **`BreadcrumbList`**: Structured path mapping back to Home.
  - **`LegalArticle`**: Represents the hub content, with the publisher as `Organization` (JUS-TICE) and `reviewedBy` set to a `Person` schema containing the expert's name, bar registration ID, LinkedIn profile, and biography link.

### B. Spoke Pages (`src/app/practice-areas/[category]/[slug]/page.js`)
- **Static Generation**: Uses `generateStaticParams()` combining categories and spokes.
- **Data Load**: Calls `getLocalSpoke(category, slug)` to retrieve the specific content.
- **Layout & Components**:
  - Breadcrumbs path: `בית` ➔ `תחומי התמחות` ➔ `{category.title}` ➔ `{spoke.title}`.
  - Renders the specific interactive calculator tool (e.g. Severance Pay, Purchase Tax) alongside a detailed legal guide.
  - Displays the "Reviewed By" banner referencing the parent category's expert to ensure high E-E-A-T scoring.
- **SEO & Alternate Links**:
  - `generateMetadata({ params })` resolves values dynamically based on spoke configuration.
  - Canonical links set to: `https://jus-tice.co.il/practice-areas/[category]/[slug]`.
- **JSON-LD Schema Markup**:
  - **`BreadcrumbList`**: Full hierarchical path navigation schema.
  - **`LegalArticle`** (or specialized `FAQPage` / `Calculator` schemas): Inherits the parent category's expert Person block in `reviewedBy`.

---

## 4. SEO, Metadata, and JSON-LD implementation details

### E-E-A-T Architecture:
1.  **Metadata generation**: Standard Next.js `generateMetadata` exports are used, resolving asynchronous parameters cleanly.
2.  **Breadcrumb JSON-LD**:
    ```json
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "בית", "item": "https://jus-tice.co.il/" },
        { "@type": "ListItem", "position": 2, "name": "תחומי התמחות", "item": "https://jus-tice.co.il/practice-areas" },
        { "@type": "ListItem", "position": 3, "name": "Category Name", "item": "https://jus-tice.co.il/practice-areas/category" }
      ]
    }
    ```
3.  **ReviewedBy Schema**: Inside the `LegalArticle` markup:
    ```json
    {
      "@context": "https://schema.org",
      "@type": "LegalArticle",
      "headline": "Title",
      "author": { "@type": "Organization", "name": "JUS-TICE" },
      "reviewedBy": {
        "@type": "Person",
        "name": "עו״ד דניאל כהן",
        "description": "רישיון לשכה 54321 - חבר לשכת עורכי הדין בישראל",
        "url": "https://jus-tice.co.il/lawyers/adv-daniel-cohen",
        "sameAs": "https://www.linkedin.com/in/adv-daniel-cohen"
      }
    }
    ```

---

## 5. Testing Infrastructure & Validation Rules
Tests are executed via `node tests/e2e/runner.js` which spins up a Next.js development server on a dynamically allocated port, waits for it to respond, warms up API routes, and then triggers `tests/e2e/tests.js`.

### Validation Rules inside tests:
1.  **Sitemaps**:
    - Validates that `sitemap.xml` returns 200.
    - Inspects the XML text to ensure it includes the Hub paths (`/practice-areas/labor-law`) and dynamic offline Spoke paths (`/practice-areas/family-law/divorce-agreement-approval`).
    - Asserts that the total number of paths (`<loc>`) is at least 20 to prevent build truncation.
2.  **Redirects**:
    - Validates trailing slashes and double slashes behavior.
    - Validates dynamic redirect maps for Hebrew paths (e.g. `/פוסטה-פלילים` redirects with 301 to `/posta`).
    - Validates that non-existent paths return Hebrew 404 pages containing the string `לא נמצא` or `404`.
3.  **Schemas**:
    - Validates HTML payloads for both `BreadcrumbList` and `reviewedBy` (Person) within `LegalArticle`.
    - Asserts that the `reviewedBy` description contains the string `רישיון לשכה` (Bar ID) to verify official legal qualification display.
4.  **Copywriting Compliance (Antigravity Constraints)**:
    - **No Em-dashes (`—`)**: Pages are scanned to ensure no em-dashes exist. Em-dashes must be replaced by simple hyphens (`-`) or semicolons.
    - **Forbidden AI Tells**: The test runner strips script tags and scans the page text to verify it does *not* contain standard AI transition words: `בנוסף`, `חשוב לציין כי`, `לסיכום`, `ראוי לציין`.
    - **Statutory Law Citations**: Validates that Hub and Spoke pages contain at least one citation of Israeli laws (`חוק המקרקעין`, `חוק פיצויי פיטורים`, `חוק הפיצויים לנפגעי תאונות דרכים`, `חוק הודעה מוקדמת`, `חוק העונשין`).

---

## 6. Recommendations for 20 Experts Data Integration

To scale the Advisory Board to 20 experts while maintaining the portal's architectural integrity, we propose the following implementation strategy:

### A. Storage Strategy
We recommend a dual-layer storage model:
1.  **Primary CMS (Production)**: Create a Custom Post Type (CPT) `justice_expert` in WordPress with the following fields (managed via ACF or standard REST API endpoints):
    *   `bar_id` (Text)
    *   `bio_url` (URL)
    *   `linkedin` (URL)
    *   `credentials` (Text/Area)
    *   `specialties` (Taxonomy or select field corresponding to category slugs: `labor-law`, `real-estate-law`, etc.)
2.  **Local Fallback (Offline first)**: Create a new JSON file at `src/lib/experts-db.json` and export it inside `src/lib/wordpress.js`. This prevents builds from failing if WordPress is offline.
    ```json
    [
      {
        "id": "exp_daniel_cohen",
        "slug": "adv-daniel-cohen",
        "name": "עו״ד דניאל כהן",
        "barId": "54321",
        "bioUrl": "https://jus-tice.co.il/lawyers/adv-daniel-cohen",
        "credentials": "חבר לשכת עורכי הדין בישראל, מומחה למשפט העבודה הקיבוצי והאישי",
        "linkedin": "https://www.linkedin.com/in/adv-daniel-cohen",
        "specialties": ["labor-law", "civil-law"]
      }
    ]
    ```

### B. Dynamic Mapping Logic
1.  **WordPress Library Update**: Inside `src/lib/wordpress.js`, add helper functions:
    ```javascript
    export function getExpertsForCategory(categorySlug) {
      // Return all experts where specialties includes categorySlug
      return OFFLINE_DB.experts.filter(exp => exp.specialties.includes(categorySlug));
    }
    
    export function getPrimaryReviewer(categorySlug) {
      const experts = getExpertsForCategory(categorySlug);
      // Select the lead expert or return a default fallback expert
      return experts[0] || DEFAULT_EXPERT;
    }
    ```
2.  **Dynamic Rendering on Pages**:
    - **Hub Pages**: Use `getExpertsForCategory(category)` to fetch all experts for that area. Render a grid/list of "Advisory Board Members for [Category Name]" with links to their profiles.
    - **Spoke Pages**: Map a single "Lead Expert" as the reviewer of the calculator/guide. Show their badge and credentials prominently.
3.  **JSON-LD E-E-A-T Schema Enhancement**:
    - Update `reviewedBy` on the pages to support multiple reviewers when multiple experts are mapped to a category:
      ```javascript
      const experts = getExpertsForCategory(category);
      const reviewedByArray = experts.map(exp => ({
        "@type": "Person",
        "name": exp.name,
        "description": `רישיון לשכה ${exp.barId} - ${exp.credentials}`,
        "url": exp.bioUrl,
        "sameAs": exp.linkedin
      }));
      ```
      Place this array in the `reviewedBy` field of the `LegalArticle` schema.
4.  **Integration of Profile Pages**:
    - Map the experts directly to the existing directory in `/src/app/lawyers/[slug]/page.js` so that clicking on an expert's name navigates to their detailed profile page within the portal.
