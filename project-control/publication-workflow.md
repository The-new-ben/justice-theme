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

## Code Gate
The family-law live publisher is now blocked by default unless:
- `publication-cannibalization-check.csv` marks the page status as approved.
- The recommended action does not block publication.
- The cleaned public draft has no internal safety markers.

## Current Emergency Decision
Automatic publication of the family-law cluster is disabled. The wp-admin manual trigger runs preflight checks first and will block publication while rows remain unapproved.
