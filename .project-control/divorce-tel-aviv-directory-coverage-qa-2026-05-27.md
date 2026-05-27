# Divorce Tel Aviv Directory Coverage QA - 2026-05-27

Status: DIRECTORY_COVERAGE_QA_FOUND_FILTER_ALIAS_GAP_NO_PUBLIC_CHANGE

Scope: private read-only QA for the filtered lawyer-directory coverage behind the `/divorce-lawyer-tel-aviv/` candidate. This packet does not edit the public directory, publish a page, change CMS/database content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact anyone, send email/WhatsApp/TalkTo, create invoices/payments, or deploy.

## Summary

- Canonical coverage URL to use for future evidence: /lawyers/?city=tel-aviv&area=family-law
- Canonical route status: 200
- Canonical visible lawyer card count: 3
- Public actions: 0 approved; 0 CMS writes; 0 SEO changes; 0 emails; 0 uPress actions.

## Local Parameter Gates

| ID | Gate | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| LOCAL-01 | archive_reads_area_param | PASS | archive-justice_lawyer.php reads `area` as the practice-area filter parameter. | Use `area=family-law` for coverage evidence unless an alias is approved. |
| LOCAL-02 | archive_reads_practice_param | REVIEW_ALIAS_MISSING | The archive does not read `practice`; URLs using `practice=family-law` may not filter by practice. | Treat private packet directory evidence URL as needing correction or public alias fix review. |
| LOCAL-03 | private_packet_uses_practice_param | REVIEW_MISMATCH_FOUND | The latest divorce Tel Aviv evidence packet contains `practice=family-law` in the directory URL. | Correct the evidence gate to the canonical `area=family-law` route before publication review. |

## Live Directory Route Checks

| ID | Route | Status | H1 | Cards | Filter Chips | Empty State | Expected Use |
| --- | --- | ---: | --- | ---: | ---: | --- | --- |
| DIR-01 | /lawyers/?city=tel-aviv&practice=family-law | 200 | עורכי דין בתל אביב | 3 | 1 | no | Should represent Tel Aviv family-law coverage if practice is accepted as an alias. |
| DIR-02 | /lawyers/?city=tel-aviv&area=family-law | 200 | עורך דין דיני משפחה בתל אביב | 3 | 2 | no | Should represent the actual archive-supported Tel Aviv family-law filter. |
| DIR-03 | /lawyers/?city=tel-aviv | 200 | עורכי דין בתל אביב | 3 | 1 | no | Control route for Tel Aviv without practice filter. |
| DIR-04 | /lawyers/?area=family-law | 200 | עורך דין דיני משפחה | 20 | 1 | no | Control route for family-law without city filter. |

## Comparisons

| ID | Comparison | Status | Evidence | Next Action |
| --- | --- | --- | --- | --- |
| CMP-01 | practice_param_vs_city_only | REVIEW_PRACTICE_PARAM_BEHAVES_LIKE_CITY_ONLY | `practice=family-law` has the same H1/card-count/chip-count shape as the city-only control. | Do not use `practice=family-law` as proof of family-law coverage. |
| CMP-02 | practice_param_vs_area_param | REVIEW_CANONICAL_AREA_DIFFERS | `area=family-law` produces a different page shape from `practice=family-law`. | Use the canonical `area=family-law` route for the coverage gate. |

## Proposed Fix Plan

| ID | Decision | Proposed Action | Public Impact If Approved | Blocker | Forbidden Now |
| --- | --- | --- | --- | --- | --- |
| FIX-01 | parameter_alias_review | Accept `practice` as a read-only alias for `area` in the lawyer directory filter, or update all internal/private planning URLs to use `area` only. | Existing links with `practice=family-law` would apply the intended practice filter instead of city-only results. | Requires owner approval for a public-facing code change and Hebrew public-change email workflow after deployment. | Do not change archive code, links, redirects, canonicals, noindex, sitemaps, taxonomies or CMS content from this private QA packet. |
| FIX-02 | coverage_count_review | Use only the canonical `area=family-law` filtered route when checking Tel Aviv family-law/divorce lawyer coverage. | The local divorce page coverage gate will be based on the real filtered directory, not an accidental city-only URL. | Still needs wp-admin profile readiness review; public HTML card counts are not enough to prove routable paid/verified coverage. | Do not publish `/divorce-lawyer-tel-aviv/` from public card counts alone. |
| FIX-03 | draft_gate_update | Update the divorce Tel Aviv public-draft gate template manually or in the next private packet to use `/lawyers/?city=tel-aviv&area=family-law` as the directory evidence URL. | None if kept private; it only corrects the evidence checklist. | GSC, legal/editor and owner approval are still missing. | Do not infer GSC demand or legal suitability from this directory QA. |

## Own Review

The divorce Tel Aviv coverage gate is not ready to rely on the `practice=family-law` directory URL. The archive template reads `area`, and the live comparison should treat `area=family-law` as the canonical evidence route. This is useful because the local page must not be approved on a false coverage signal. The next public-facing fix, if approved, is small: accept `practice` as an alias or correct all internal planning URLs to `area`; either path still leaves GSC, wp-admin profile readiness, legal/editor review and owner approval as blockers.
