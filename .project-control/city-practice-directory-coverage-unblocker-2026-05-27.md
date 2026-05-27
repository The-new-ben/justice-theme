# City/Practice Directory Coverage Unblocker - 2026-05-27

Status: DIRECTORY_COVERAGE_UNBLOCKER_READY_NO_PUBLIC_CHANGE

Scope: private unblocker packet for city/practice draft targets whose canonical filtered lawyer-directory URL lacks usable coverage. This packet performs read-only live checks only. It does not publish content, edit WordPress, change SEO settings, create CRM records, contact anyone, send email, invoice, take payment or deploy.

## Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| DGU-GATE-01 | source_priority_packet_available | PASS | Source city/practice packet status: CITY_PRACTICE_PRIORITY_DRAFT_BRIEFS_BLOCKED_NO_PUBLIC_CHANGE. | Use source packet only as private evidence; do not publish from it. |
| DGU-GATE-02 | blocked_directory_rows_found | PASS | 1 blocked canonical directory row(s) found. | Build owner choices around the exact blocked rows. |
| DGU-GATE-03 | alternate_paths_checked_read_only | PASS | 3 live alternate path check(s) recorded. | Treat alternatives as review candidates only, not approved public links. |
| DGU-GATE-04 | owner_options_ready | PASS | 5 private option row(s) generated. | Owner/admin can choose private coverage, park, or ask for a separate alternate-CTA packet. |
| DGU-GATE-05 | no_public_change_authorized | PASS | All option rows keep public change forbidden without fresh owner approval. | Do not publish, link, route, contact, invoice or deploy from this packet. |

## Blocked Directory Rows

| ID | Slug | Gate | URL | H1 | Lawyer Cards | Next Action |
| --- | --- | --- | --- | --- | --- | --- |
| CPD-02-DIRECTORY | criminal-lawyer-jerusalem | BLOCKED_CANONICAL_DIRECTORY_FILTER_GENERIC_OR_EMPTY | https://jus-tice.co.il/lawyers/?city=jerusalem&area=criminal-law | עורך דין משפט פלילי בירושלים | 0 | Fix lawyer coverage privately, choose an approved alternate CTA/path, or park the city/practice draft. |

## Read-Only Alternate Checks

| ID | Slug | Option | Gate | URL | H1 | Lawyer Cards | Safety |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CPD-02-DIRECTORY-ALT-AREA | criminal-lawyer-jerusalem | area_only_directory | BLOCKED_ALTERNATE_DIRECTORY_EMPTY | https://jus-tice.co.il/lawyers/?area=criminal-law | עורך דין משפט פלילי | 0 | Do not present as Jerusalem-specific coverage. |
| CPD-02-DIRECTORY-ALT-CITY | criminal-lawyer-jerusalem | city_only_directory | REVIEW_ALTERNATE_DIRECTORY_HAS_COVERAGE | https://jus-tice.co.il/lawyers/?city=jerusalem | עורכי דין בירושלים | 2 | Do not present as criminal-law-specific coverage. |
| CPD-02-DIRECTORY-ALT-CONTACT | criminal-lawyer-jerusalem | contact_form_fallback | REVIEW_CONTACT_FORM_REACHABLE | https://jus-tice.co.il/contact/?area=criminal-law&city=jerusalem&source=criminal-lawyer-jerusalem | יצירת קשר | 0 | Requires owner/SEO/legal approval before any public content or internal-link use. |

## Owner Options

| ID | Slug | Option | Status | Evidence | Next Action | Public Change Allowed |
| --- | --- | --- | --- | --- | --- | --- |
| CPD-02-DIRECTORY-OPTION-01 | criminal-lawyer-jerusalem | activate_matching_lawyer_coverage | RECOMMENDED_PRIVATE_REVENUE_PATH | https://jus-tice.co.il/lawyers/?city=jerusalem&area=criminal-law has 0 lawyer cards for the exact city/practice filter. | Owner/admin should activate or verify at least one matching routable lawyer profile/prospect before relying on the exact directory path. | no |
| CPD-02-DIRECTORY-OPTION-02 | criminal-lawyer-jerusalem | broader_area_directory_fallback | BLOCKED_EMPTY_OR_UNVERIFIED | /lawyers/?area=criminal-law returned 0 lawyer cards and H1 "עורך דין משפט פלילי". | Use only if owner/SEO/legal approves a broader non-local directory CTA in a future public draft packet. | no |
| CPD-02-DIRECTORY-OPTION-03 | criminal-lawyer-jerusalem | broader_city_directory_fallback | REVIEW_ONLY_HAS_COVERAGE | /lawyers/?city=jerusalem returned 2 lawyer cards and H1 "עורכי דין בירושלים". | Use only if owner/SEO/legal approves a broader non-practice-specific directory CTA in a future public draft packet. | no |
| CPD-02-DIRECTORY-OPTION-04 | criminal-lawyer-jerusalem | contact_form_fallback | REVIEW_ONLY_REACHABLE | /contact/?area=criminal-law&city=jerusalem&source=criminal-lawyer-jerusalem returned status 200 and H1 "יצירת קשר". | Use only after explicit approval of public copy, lead-routing expectations and non-directory wording. | no |
| CPD-02-DIRECTORY-OPTION-05 | criminal-lawyer-jerusalem | park_city_practice_public_work | SAFE_DEFAULT | Exact directory coverage is missing and public content approval is absent. | Keep the local/practice update private until coverage or approved fallback is ready. | no |

## Owner Template Rows

| Decision ID | Slug | Recommended Value | Allowed Next Step | Forbidden Without Fresh Approval |
| --- | --- | --- | --- | --- |
| CPD-02-DIRECTORY-DECISION-01 | criminal-lawyer-jerusalem | approve private matching-lawyer coverage work | Create/verify one matching private lawyer/prospect record and only later rerun the coverage gate. | Do not publish content, add internal links, contact anyone, route leads, invoice, mark paid or change SEO settings. |
| CPD-02-DIRECTORY-DECISION-02 | criminal-lawyer-jerusalem | park public city/practice update | Keep content private and continue revenue/content prep on targets with proven directory coverage. | Do not use a broader area/city/contact fallback on the public site without owner/SEO/legal approval. |
| CPD-02-DIRECTORY-DECISION-03 | criminal-lawyer-jerusalem | request alternate CTA plan | Prepare a separate public-copy review packet for a non-directory CTA, still with no CMS change. | Do not imply exact lawyer availability in the blocked city/practice combination. |

## Review

The safest revenue-aligned fix is private lawyer coverage: create or verify a matching routable criminal-law/Jerusalem lawyer or prospect, then rerun the directory coverage gate. A broader area directory, broader city directory, or contact-form fallback can be considered only in a separate owner/SEO/legal-approved public-copy packet. Until then, keep the Jerusalem criminal city/practice draft and internal-link plan blocked.
