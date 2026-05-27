# City/Practice Thin Page Improvement Packet - 2026-05-27

Status: CITY_PRACTICE_THIN_PAGE_PACKET_READY_NO_PUBLIC_CHANGE

Scope: private content-improvement and anti-cannibalization packet for draft city/practice pages. It reads repo source only and does not publish CMS content, create pages, change redirects/canonicals/noindex/sitemaps/taxonomies, contact lawyers/leads, send email or deploy.

## Summary

- Seed pages found: 5.
- Static gates: 3/3 passed.
- Target improvement rows: 5.
- High-priority private-review rows: 2.
- Live actions: 0 public changes, 0 CMS writes, 0 CRM records, 0 lead/lawyer contacts, 0 invoices/payments, 0 emails.

## Static Gates

| ID | Gate | Status | File | Evidence | Missing Markers | Next Action |
| --- | --- | --- | --- | --- | --- | --- |
| CPG-01 | draft_seed_write_guard | PASS | inc/city-practice-pages.php | 5/5 markers found; City/practice pages are seeded only as guarded drafts with unknown traffic risk. | - | Keep this packet private until owner approves exact draft improvement and publication gates. |
| CPG-02 | template_lawyer_coverage_guard | PASS | page-city-practice.php | 6/6 markers found; Public template requires city/practice filtering and displays a hold message when lawyer coverage is insufficient. | - | Do not publish a target unless filtered lawyer coverage is verified. |
| CPG-03 | practice_hub_pattern_reference | PASS | template-parts/content/practice-landing-page.php | 5/5 markers found; Richer practice hubs provide the pattern: topical signals, supporting links, body content and lead form. | - | Use hub structure as inspiration, not as duplicate copy. |

## Target Rows

| ID | Slug | Priority | City | Practice | Pillar | Current Status | Unique Content Needed | Blocked Without |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CP-01 | divorce-lawyer-tel-aviv | HIGH | tel-aviv | family-law | /divorce-lawyer/ | DRAFT_SEED_THIN_PLACEHOLDER | local-intent opening that explains who this city/practice page is for \| document/evidence checklist specific to the practice area \| when to move from reading to a lawyer fit check \| filtered lawyer coverage proof before public visibility \| FAQ rows only after real search, lead or owner evidence \| links to the central pillar and filtered directory without competing with the pillar | GSC query/page evidence, internal overlap review, lawyer coverage proof, legal/editor review and owner approval. |
| CP-02 | criminal-lawyer-jerusalem | HIGH | jerusalem | criminal-law | /criminal-lawyer/ | DRAFT_SEED_THIN_PLACEHOLDER | local-intent opening that explains who this city/practice page is for \| document/evidence checklist specific to the practice area \| when to move from reading to a lawyer fit check \| filtered lawyer coverage proof before public visibility \| FAQ rows only after real search, lead or owner evidence \| links to the central pillar and filtered directory without competing with the pillar | GSC query/page evidence, internal overlap review, lawyer coverage proof, legal/editor review and owner approval. |
| CP-03 | real-estate-lawyer-haifa | MEDIUM | haifa | real-estate-law | /practice-areas/real-estate-law/ | DRAFT_SEED_THIN_PLACEHOLDER | local-intent opening that explains who this city/practice page is for \| document/evidence checklist specific to the practice area \| when to move from reading to a lawyer fit check \| filtered lawyer coverage proof before public visibility \| FAQ rows only after real search, lead or owner evidence \| links to the central pillar and filtered directory without competing with the pillar | GSC query/page evidence, internal overlap review, lawyer coverage proof, legal/editor review and owner approval. |
| CP-04 | employment-lawyer-tel-aviv | MEDIUM | tel-aviv | labor-law | /practice-areas/labor-law/ | DRAFT_SEED_THIN_PLACEHOLDER | local-intent opening that explains who this city/practice page is for \| document/evidence checklist specific to the practice area \| when to move from reading to a lawyer fit check \| filtered lawyer coverage proof before public visibility \| FAQ rows only after real search, lead or owner evidence \| links to the central pillar and filtered directory without competing with the pillar | GSC query/page evidence, internal overlap review, lawyer coverage proof, legal/editor review and owner approval. |
| CP-05 | personal-injury-lawyer-rishon-lezion | MEDIUM | rishon-lezion | torts | /tort-lawyer/ | DRAFT_SEED_THIN_PLACEHOLDER | local-intent opening that explains who this city/practice page is for \| document/evidence checklist specific to the practice area \| when to move from reading to a lawyer fit check \| filtered lawyer coverage proof before public visibility \| FAQ rows only after real search, lead or owner evidence \| links to the central pillar and filtered directory without competing with the pillar | GSC query/page evidence, internal overlap review, lawyer coverage proof, legal/editor review and owner approval. |

## Review

The existing city/practice system is correctly conservative: pages are draft-only, explicitly thin/unknown-risk, and blocked until unique content and lawyer coverage exist. The next safe improvement is not publication; it is filling evidence and preparing one human-reviewed draft brief at a time.

Recommended first private targets are the first two seed rows only, because broad publication of all five would raise duplicate local SEO risk before GSC evidence and lawyer coverage are proven.
