# Scope: Milestone 4 (SEO Silo Routing & Programmatic SEO)

## Architecture
- Practice areas pillars will be served under `/practice-areas/[category]/page.js`
- Practice areas spokes will be served under `/practice-areas/[category]/[slug]/page.js`
- Navigation layout and Breadcrumbs will be updated dynamically using next/navigation and dynamic structured data schemas (`BreadcrumbList`).
- Dynamic sitemap.js generation matching the directory structures.
- Israel laws citation guidelines and no em-dashes / AI tells.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|---|---|---|---|
| M4.1 | Route Setup | Create practice area directories & skeleton routes for the 6 practice areas and their respective spokes | None | PLANNED |
| M4.2 | Navigation & Breadcrumbs | Implement the Dynamic Breadcrumb component & schema, update header menu navigation | M4.1 | PLANNED |
| M4.3 | SEO Optimization | Implement sitemap.js updates and canonical tag generation matching https://jus-tice.co.il | M4.2 | PLANNED |
| M4.4 | Search Engine Ping | Implement search engine ping mechanism for programmatic SEO updates | M4.3 | PLANNED |
| M4.5 | Validation & Integrity | Forensic Audit & Challenger validation of copywriting rules and integrity constraints | M4.4 | PLANNED |

## Interface Contracts
### Practice Area Pillar API
- Path: `/practice-areas/[category]`
- Props: `params: { category: string }`

### Practice Area Spoke API
- Path: `/practice-areas/[category]/[slug]`
- Props: `params: { category: string, slug: string }`
