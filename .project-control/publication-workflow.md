# Public Publication Workflow

Status: ACTIVE RULE  
Date: 2026-05-10

## Core Rule
Nothing goes live unless it is written for the public visitor and passes cannibalization check.

Public article content is for the Google visitor. Project notes are for the owner and development team.

## Never Publish Public Content Containing
- NOT VERIFIED / VERIFIED / BLOCKED labels.
- Next action / task-board / QA notes.
- Developer notes or owner instructions.
- Source audit notes.
- Review blockers.
- Internal CMS, CRM, GSC, LegalTech implementation notes.
- Business-model or product-planning notes such as paid-lawyer value, lead monetization, owner strategy, AI-internal routing, mini-site sales plans, or "Jus-Tice should" implementation instructions.
- Project-control paths.
- Draft/publication status sections.
- Cannibalization notes written as internal instructions.

## Required Steps Before Publication
1. Check existing URLs by keyword, Hebrew title, English slug and related terms.
2. Fill `project-control/publication-cannibalization-check.csv`.
3. Decide one action: CREATE_NEW_PAGE, UPDATE_EXISTING_PAGE, MERGE_WITH_EXISTING_PAGE, KEEP_AS_SUPPORTING_PAGE, REDIRECT_OLD_TO_NEW, DO_NOT_PUBLISH_DUPLICATE, NEEDS_OWNER_REVIEW.
4. Check slug conflict and URL migration risk.
5. Keep old content if it is stronger or has traffic.
6. Merge useful old and new content where appropriate.
7. Prepare public-facing Hebrew article only.
8. Strip all internal notes from public body content.
9. Add internal links to pillar, supporting pages, lawyer directory, lead form and practice hub.
10. Add safe public source links where appropriate.
11. Add public disclaimer and CTA.
12. Update content inventory, cannibalization map and URL migration map if needed.
13. Publish only after status is explicitly approved.

## Editorial Repair Mode
If a page is already live and contains internal notes, do not delete the page as the first action.

1. Keep the URL.
2. Remove internal notes from the public article body.
3. Move those notes into a draft/private internal editorial note.
4. Repair the article in place with public-facing content.
5. Continue the cannibalization and merge review afterward.

This mode is allowed only for existing live pages. It must not create a new duplicate URL.

## Code Gate
The family-law live publisher is now blocked by default unless:
- `publication-cannibalization-check.csv` marks the page status as approved.
- The recommended action does not block publication.
- The cleaned public draft has no internal safety markers.

The theme now also has a global public-publication safety gate:
- File: `inc/publication-safety.php`.
- It applies to `articles`, `page`, and `post` only when the target status is `publish` or `future`.
- It blocks publication if the content still contains internal markers such as `NOT VERIFIED`, `project-control/`, `Source audit:`, `GSC`, `CMS`, `CRM`, `Slug target:`, `Primary keyword:`, source-review notes, owner/team notes, or business-planning notes.
- Draft/private editing is still allowed, so internal notes can be preserved in draft/private editorial notes.
- Status: FIXED IN CODE, NOT VERIFIED LIVE until uPress pulls and an editor tries a controlled test publish.

## Current Decision
Automatic creation of new family-law public pages is disabled. Existing family-law pages are handled through editorial repair/enrichment, while future public legal content should first enter the `articles` CPT as clean drafts.
