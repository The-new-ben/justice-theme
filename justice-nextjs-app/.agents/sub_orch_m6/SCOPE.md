# Scope: Milestone 6 - E-E-A-T Advisory Board UI & Dynamic Schema Integration

## Architecture
- **Data Layer**: A central file `src/lib/experts.js` to store the 20 experts from ORIGINAL_REQUEST.md.
- **Components**: `src/app/components/ReviewingExpert.js` – a premium glassmorphism/Apple-style light theme visual component displaying expert info (name, specialty, Bar ID, SameAs credentials link, LinkedIn/Wikipedia, and legal fields compliance verification).
- **Pages**:
  - `src/app/advisory-board/page.js` – Index page for the Advisory Board. Renders all 20 experts.
  - `src/app/practice-areas/[category]/page.js` – Category Hub pages. Dynamically links to their respective expert(s).
  - `src/app/practice-areas/[category]/[slug]/page.js` – Spoke pages. Dynamically links to their respective expert(s).
- **Metadata/Schemas**: Dynamically inject E-E-A-T schemas on Hub and Spoke pages using the `reviewedBy` Person structure pointing to the expert.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Setup & Exploration | Analyze existing pages, schemas, data structures, and tests. | None | DONE |
| 2 | Implementation | Implement experts database, component, index page, and page updates. | M1 | IN_PROGRESS |
| 3 | Verification & Auditing | Run Reviewers, Challengers, and Forensic Auditor. | M2 | PLANNED |
| 4 | E2E Integration Test | Run standard Next.js build and E2E tests to verify all tests pass. | M3 | PLANNED |

## Detailed Tasks
1. **Create `src/lib/experts.js`**: Create a Javascript module containing the 20 experts with their specialties, roles, SameAs links, and Bar IDs (for the 6 legal practices and ethics counsel).
2. **Create `src/app/components/ReviewingExpert.js`**: Implement the premium Apple-style/glassmorphism UI component for the reviewing expert. Ensure no em-dashes `—` are used (use normal hyphens or parentheses), and active Hebrew voice.
3. **Create `src/app/advisory-board/page.js`**: Dedicated page listing all 20 experts. Design it with the premium Apple-style light theme (frosted glass, gray/silver accents). Ensure copywriting compliance (no em-dashes, no AI tells, active voice).
4. **Update `src/app/practice-areas/[category]/page.js`**: Import the expert and dynamically link them in the UI (using the new `ReviewingExpert` component) and in the JSON-LD `reviewedBy` schema.
5. **Update `src/app/practice-areas/[category]/[slug]/page.js`**: Import the expert and dynamically link them in the UI and in the JSON-LD `reviewedBy` schema.
6. **Update `src/lib/wordpress.js`**: Ensure the fallback database (`OFFLINE_DB`) and functions are compatible and consistent with the new experts data.

## Interface Contracts
- **Expert Schema in JSON-LD**:
  ```json
  "reviewedBy": {
    "@type": "Person",
    "name": "Expert Name",
    "jobTitle": "Role/Title",
    "sameAs": "SameAs Link (LinkedIn or Wiki)",
    "description": "Credentials including רישיון לשכה XXXX"
  }
  ```
- **Copywriting Rules**:
  - No em-dashes `—`.
  - No AI tells: `בנוסף`, `חשוב לציין כי`, `לסיכום`, `ראוי לציין`.
  - Active Hebrew voice.
