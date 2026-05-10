# Editorial Repair Runbook - Family Law Cluster

Date: 2026-05-10  
Mode: EDITORIAL IMPROVEMENT / CONTENT ENRICHMENT

## Goal
Keep the seven family-law URLs live, but make the public body clean, useful and visitor-facing.

Public pages must not show:
- NOT VERIFIED labels
- source-audit notes
- owner/developer instructions
- CMS, CRM, GSC or task-board notes
- publication blockers
- implementation status

Those notes are synced into a draft-only WordPress page:

`Internal Editorial Notes — Family Law Cluster`

## Pages
- `/divorce-lawyer/`
- `/consensual-divorce/`
- `/divorce-mediation/`
- `/child-support/`
- `/child-custody/`
- `/divorce-property-division/`
- `/family-dispute-resolution/`

## What The Code Now Does
1. Does not delete or draft these pages.
2. Does not create missing pages by default.
3. Repairs existing live pages in place with cleaned public article HTML.
4. Moves internal/editorial notes into a draft-only page.
5. Keeps the cannibalization review active for later merge/redirect decisions.
6. Imports future repo drafts into the `articles` CPT as clean drafts, with internal notes stored separately.
7. Removes whole internal Markdown sections when their body contains strong team-only markers, not only when the heading text is an exact match.

## Verification After uPress Pull
1. Open each of the seven URLs.
2. Confirm the article is Hebrew and public-facing.
3. Confirm no internal notes appear in the body.
4. Confirm cluster links, CTA and legal disclaimer appear.
5. In wp-admin, confirm the internal notes page exists as draft/private.
6. Continue old-content merge review before any redirects.

## Search Patterns That Must Not Appear Publicly
- `NOT VERIFIED`
- `project-control`
- `Source audit`
- `GSC`
- `CRM`
- `PARTIAL:`
- `READY NEXT`
- `CMS`
- `LegalTech`
- `Tools > Jus-Tice`
- `FAQ schema`
- `source audit`
- `סטטוס לפני פרסום`
- `פעולות המשך`
- `חסמי פרסום`
- `מבנה CMS`
