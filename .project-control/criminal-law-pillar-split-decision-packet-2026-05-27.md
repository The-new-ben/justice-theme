# Criminal Law Pillar Split Decision Packet - 2026-05-27

Status: CRIMINAL_LAW_PILLAR_SPLIT_DECISION_PACKET_READY_NO_PUBLIC_CHANGE

Scope: private decision packet for the criminal-law pillar/local-page split. It reads prior live QA artifacts and creates owner/GSC decision templates only. It does not publish, edit CMS content, change SEO settings, contact anyone, create records, send email or deploy.

## Summary

- Source QA status: LIVE_CRIMINAL_JERUSALEM_QA_REVIEW_NO_PUBLIC_CHANGE.
- Role rows: 8.
- Decision rows: 5.
- GSC template rows: 40.
- Public actions: 0; CMS writes: 0; SEO changes: 0.

## Decision Rows

| ID | Decision | Status | Evidence | Recommendation | Approval Needed |
| --- | --- | --- | --- | --- | --- |
| CRIM-DEC-01 | choose_central_criminal_law_surface | OWNER_GSC_SEO_REQUIRED | /practice-areas/criminal-law/:200/289w/final=https://jus-tice.co.il/practice-areas/criminal-law/?jt_live_qa=1779844362983 \| /criminal-lawyer/:200/289w/final=https://jus-tice.co.il/practice-areas/criminal-law/ | Do not expand local pages until one central route is chosen and strengthened. | Owner + SEO/GSC + legal/editor |
| CRIM-DEC-02 | hold_or_revise_live_jerusalem_page | OWNER_LEGAL_EDITOR_REQUIRED | /criminal-lawyer-jerusalem/:200/488w; issues=thin_content \| source_sensitive_claim_markers; claims=מוביל \| מובילים \| מחירים \| בתי משפט | Preserve page as live asset for now; prepare only private revisions until GSC and legal/editor review approve exact copy. | Owner + legal/editor + GSC query/page evidence |
| CRIM-DEC-03 | protect_specialist_pages | SEO_LEGAL_REQUIRED | /sex-crime-lawyer/:200/24404w \| /traffic-lawyer/:200/1881w | Keep sex-crime and traffic intent separate from the Jerusalem local criminal page. | SEO/internal overlap review |
| CRIM-DEC-04 | verify_lawyer_supply_before_conversion_claims | SUPPLY_PROOF_REQUIRED | /lawyers/?city=jerusalem&practice=criminal-law:200/730w; filtered profile count and quality not proven by this packet | Do not claim Jerusalem criminal lawyer availability until filtered profile count and quality are verified. | Owner/admin profile review |
| CRIM-DEC-05 | public_action_gate | BLOCKED_NO_PUBLIC_CHANGE_APPROVED | This packet creates private decision artifacts only. | No publish/update/unpublish/redirect/canonical/noindex/sitemap/taxonomy/internal-link action from this packet. | Explicit owner approval after evidence is filled |

## Route Role Map

| Route | Current Role | Proposed Role | Role Decision | Words | Issues | Allowed Future Copy | Blocked Future Copy |
| --- | --- | --- | --- | --- | --- | --- | --- |
| /practice-areas/criminal-law/ | practice_archive_or_topic | central_topic_or_archive_candidate | NEEDS_OWNER_SEO_DECISION | 289 | thin_content \| source_sensitive_claim_markers | Broad criminal law orientation only if upgraded into a proper pillar. | Do not leave as a thin archive while expanding local pages against it. |
| /criminal-lawyer/ | declared_pillar | legacy_declared_pillar_alias | NEEDS_REDIRECT_CANONICAL_REVIEW_WITHOUT_ACTION | 289 | thin_content \| source_sensitive_claim_markers \| declared_pillar_lands_elsewhere | Only if owner decides this remains the user-facing pillar route. | Do not use as a source of truth while it lands on the weak topic/archive page. |
| /criminal-lawyer-jerusalem/ | live_target | local_city_practice_support_page | HOLD_EXISTING_PUBLIC_PAGE_NO_EXPANSION_YET | 488 | thin_content \| source_sensitive_claim_markers | Local triage, document prep, when to check lawyer fit, and filtered directory support. | No broad criminal-law guide, no rankings, no price/court claims without sources, no specialist-topic takeover. |
| /criminal-defense-attorney/ | related_criminal_page | broad_criminal_defense_comparison_page | KEEP_DISTINCT_FROM_LOCAL_JERUSALEM | 4128 | source_sensitive_claim_markers | National/broad criminal defense selection, comparison and matching intent. | Do not make it the Jerusalem local page or duplicate its broad claims locally. |
| /sex-crime-lawyer/ | related_criminal_page | specialist_criminal_subtopic_page | KEEP_SPECIALIST_PROTECTED | 24404 | source_sensitive_claim_markers \| protect_specialist_intent | Sensitive specialist intent around sexual offenses only. | Do not let the Jerusalem local page absorb this specialist subject. |
| /traffic-lawyer/ | adjacent_practice_page | adjacent_traffic_practice_page | KEEP_ADJACENT_ONLY | 1881 | source_sensitive_claim_markers \| protect_specialist_intent | Traffic law intent only. | Do not mix traffic/fines intent into the criminal Jerusalem local page. |
| /lawyers/?city=jerusalem&practice=criminal-law | filtered_directory | filtered_directory_conversion_path | VERIFY_SUPPLY_BEFORE_PUBLIC_PROMISES | 730 | source_sensitive_claim_markers | Conversion path only if lawyer coverage is verified. | No promise of available/qualified Jerusalem criminal lawyers until profile coverage is reviewed. |
| /find-lawyer-how-to-find-good-attorney/ | selection_guide | generic_lawyer_selection_support | SUPPORT_ONLY | 1025 | source_sensitive_claim_markers | Trust and selection support link if editorially relevant. | Do not use as the criminal-law pillar. |

## GSC Template Preview

| Cluster | Example Queries | First Route | Go Rule |
| --- | --- | --- | --- |
| criminal_lawyer_jerusalem_exact | עורך דין פלילי ירושלים \| עורך דין פלילי בירושלים \| עורך דין פלילי ירושלים המלצה | /practice-areas/criminal-law/ | If Jerusalem local terms land on /criminal-lawyer-jerusalem/ with impressions/clicks, preserve role and improve cautiously. |
| criminal_lawyer_broad | עורך דין פלילי \| עורך דין פלילי מומלץ \| עורך דין פלילי טוב | /practice-areas/criminal-law/ | If broad terms land on local Jerusalem page, central pillar split is urgent before expansion. |
| criminal_defense_broad | עורך דין פלילי הגנה \| עורך דין פלילי כתב אישום \| עורך דין פלילי חקירה | /practice-areas/criminal-law/ | Route broad defense intent to central/broad defense surface, not necessarily local page. |
| specialist_sex_crime | עורך דין עבירות מין \| עבירות מין עורך דין \| חקירה עבירות מין | /practice-areas/criminal-law/ | Keep specialist intent on specialist page unless GSC proves local modifier demand. |
| traffic_adjacent | עורך דין תעבורה פלילי \| עבירת תנועה פלילית \| נהיגה בשכרות עורך דין | /practice-areas/criminal-law/ | Keep traffic intent on traffic page unless legal/SEO approves a small cross-link. |

## Review

The live QA shows the criminal-law cluster has a structural issue, not just a copy issue. The central criminal-law surface is weak and the local Jerusalem page is already public. The safest sequence is: fill the GSC template, choose the central route, verify lawyer supply, then prepare one owner/legal/editor-reviewed update brief. Until then, no public edit, redirect, canonical/noindex, sitemap, taxonomy or internal-link action is approved.
