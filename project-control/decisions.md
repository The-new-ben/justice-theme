# Decisions
Date: 2026-05-09

## DECISION-001 - Deployment Path
Status: VERIFIED by user instruction

The project deploys through GitHub sync to live WordPress. We will work in the repository and will not create or rely on upload ZIP packages unless the user explicitly asks later.

## DECISION-002 - Canonical Plugin Target
Status: ASSUMPTION pending live verification

Preferred canonical plugin remains:

```
justice-core/
  justice-core.php
```

Rationale:
- Project docs consistently name `justice-core` as canonical.
- REST routes requested by the product brief use `/justice-core/v1/*`.
- The existing `ultra-justice` and `ultra-justice-engine` names create activation and ownership ambiguity.

Constraint:
- Legacy folders are not deleted until the live active plugin path is verified. Removing the active plugin path through GitHub sync could break CPTs, taxonomies, and lawyer archive pages.

## DECISION-003 - Theme Canonical Name
Status: PARTIALLY VERIFIED

Canonical theme source is the current repo root as the WordPress theme. The preferred installed folder is `justice-theme`.

Risk:
- `style.css` currently says `Theme Name: Ultra Justice UI`, while older docs say `Justice Theme`. This mismatch must be resolved after confirming what the GitHub sync expects.

## DECISION-004 - No Fake Lawyer Trust Claims
Status: ACTIVE

Seed/demo lawyer profiles must not be marked as verified or described as partners unless actually verified. Paid/sponsored status must be clearly labeled.
