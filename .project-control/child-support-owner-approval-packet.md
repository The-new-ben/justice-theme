# Child Support Owner Approval Packet

Date: 2026-05-11
Status: REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This packet converts the child-support inventory, slug-conflict, GSC browser evidence and source-audit findings into an owner decision framework. It does not approve or execute public content rewrites, URL changes, redirects, canonical changes, sitemap changes, noindex actions, taxonomy/menu changes or CMS writes.

## Recommended Approval Decision

RECOMMENDED:
- Approve a no-URL-change child-support consolidation planning batch.
- Do not redirect, delete, noindex or rewrite the old calculator URL yet.
- Treat `/child-support/` as the likely public guide candidate, but protect the old calculator URL until the support/tool strategy is approved.

Why:
- `child-support` is the largest current target-slug conflict group with `30` conflict rows.
- The exact clean URL already exists:
  - `https://jus-tice.co.il/child-support/`
  - public REST word count: `2,767`
  - quality heuristic: `8/10`
- GSC browser evidence shows the checked child-support and calculation queries do not currently map to `/child-support/`.
- GSC browser evidence maps the visible child-support/calculation demand to the old calculator URL:
  - `https://jus-tice.co.il/מחשבון-מזונות-ילדים/`
- Therefore, the safest first decision is not a URL migration. It is a controlled comparison and source/legal review of:
  - `/child-support/` as the guide candidate,
  - the old calculator URL as a protected traffic-risk/support/tool URL,
  - old case-law and doctrine pages as support or merge-review material.

## Current Evidence

VERIFIED:
- `project-control/child-support-content-decision-packet.md`.
- `project-control/child-support-conflict-review.csv`.
- `project-control/child-support-source-audit.csv`.
- `project-control/content-decision-evidence-overlay.csv`.
- `project-control/gsc-targeted-query-pass-2026-05-11.csv`.
- `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`.
- `project-control/slug-conflict-review.csv`.
- `project-control/url-migration-map.csv`.
- `project-control/content-master-inventory.csv`.

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page or lead data.
- Full legal review of child-support claims.
- Approved source wording for `בע"מ 919/15`, age bands, calculation methods, medor, expenses, shared-custody adjustments or rabbinical-court jurisdiction.
- Owner approval for choosing final primary/support/merge/redirect paths.

## Query Evidence From GSC Browser Passes

VERIFIED:
- `מזונות ילדים`: `160` impressions, `0` clicks, `0%` CTR, average position `49.6`.
- `חישוב מזונות`: `131` impressions, `0` clicks, `0%` CTR, average position `54.9`.
- `מחשבון מזונות`: `70` impressions, `0` clicks, `0%` CTR, average position `30.0`.
- All three visible query filters mapped to:
  - `https://jus-tice.co.il/מחשבון-מזונות-ילדים/`
- `בעמ 919/15`, `בע"מ 919/15`, `מזונות משותפת`, `הפחתת מזונות`, `שינוי מזונות`, and `הלכת המזונות החדשה` returned no visible rows in the checked filters.

Interpretation:
- The old calculator URL is a protected URL, not a deletion or blind redirect candidate.
- `/child-support/` is a strong guide candidate, but it does not yet own the checked GSC demand.
- Zero-row variants should generally become sections inside a stronger guide first, not thin standalone pages.

## Page Decisions For Approval

### 1. Child Support Guide Candidate

Current URL:
- `https://jus-tice.co.il/child-support/`

Current facts:
- Exact clean English slug exists.
- Published page.
- Public REST word count: `2,767`.
- Quality heuristic: `8/10`.
- Already links into the family-law cluster.

Recommended action:
- APPROVE COMPARE / PREPARE AS PRIMARY / NO URL CHANGE.

Required next review:
- Compare title, H1, structure, source quality, current internal links and public usefulness against the old calculator page and major case-law pages.
- Do not publish changes until source/legal review is complete.

### 2. Calculator URL

Current URL:
- `https://jus-tice.co.il/מחשבון-מזונות-ילדים/`

Current facts:
- GSC visible demand maps here for child-support/calculation queries.
- GSC browser pass: `160 + 131 + 70` impressions across the checked related queries.

Recommended action:
- PROTECT / DO NOT TOUCH HIGH-RISK URL.
- Review as possible support/tool page, not automatic redirect material.

Blocked:
- No redirect.
- No noindex.
- No deletion.
- No calculator/formula claims without legal review.

### 3. `בע"מ 919/15` Case-Law Asset

Current URL:
- `https://jus-tice.co.il/psakdin/בע״ם-919-15-הלכת-המזונות-החדשה/`

Current facts:
- Very large case-law page in the public inventory.
- Word count: `39,818`.
- Exact checked GSC filters for `בעמ 919/15` and `בע"מ 919/15` returned no visible rows.

Recommended action:
- KEEP SEPARATE / USE AS SOURCE-SUPPORT AFTER LEGAL REVIEW.
- Do not treat as the primary public child-support guide.

### 4. Change / Reduction / Shared-Support Variants

Current status:
- Checked filters for `מזונות משותפת`, `הפחתת מזונות`, `שינוי מזונות`, and `הלכת המזונות החדשה` returned no visible rows.

Recommended action:
- Do not create thin standalone pages now.
- Treat as guide sections or later support candidates only after content-quality and source review.

### 5. Rabbinical-Court Jurisdiction Content

Known candidate pages:
- `https://jus-tice.co.il/5988-21/`
- `https://jus-tice.co.il/בגץ-5988/21-סמכות-בתי-הדין-הרבניים-במזונות-ילדים/`

Recommended action:
- REVIEW AS SUPPORT / DO NOT MERGE OR REDIRECT YET.
- Jurisdiction content needs careful legal framing and official/source review.

## Internal-Link Direction After Approval

If owner approves the comparison batch:
- `/child-support/` should link naturally to divorce, family-law lawyer, child custody, divorce mediation, property division, family dispute resolution and relevant official/public source pages.
- The old calculator URL should link to `/child-support/` if it remains live.
- Case-law/support pages should link back to the main guide when the final primary is confirmed.
- Maya Rotenberg or family-law lawyer cards should appear only if real profile data and disclosure are verified.

## Source / Legal Review Checklist

Before public edits:
- Verify claims about `בע"מ 919/15`.
- Verify calculation language and avoid presenting formula output as legal certainty.
- Verify age-band and shared-custody explanations.
- Verify medor, expenses and exceptional-expense language.
- Verify rabbinical-court jurisdiction statements.
- Add official/public sources where appropriate.
- Add a clear legal disclaimer.
- Avoid unsupported legal conclusions.

## Sitemap / Canonical / Redirect Position

NOT APPROVED:
- No child-support redirects.
- No old calculator URL redirect.
- No canonical changes.
- No sitemap inclusion/exclusion change.
- No noindex.
- No deletion.

Required before URL migration:
- Full URL inventory for all child-support conflict rows.
- GSC query/page evidence for high-risk URLs.
- Internal-link update map.
- Redirect map.
- Canonical plan.
- Sitemap plan.
- Owner approval.

## Owner Approval Questions

1. Should `/child-support/` be compared as the near-term primary guide while keeping the old calculator URL protected?
2. Should the old calculator URL remain live as a support/tool page until legal/source review is complete?
3. Should `בע"מ 919/15` and other case-law pages stay separate as source/support pages instead of becoming public guide primaries?
4. Should zero-row variants become sections inside `/child-support/` first, rather than new standalone pages?
5. Should Maya Rotenberg/family-law lawyer cards be connected only after profile/review/disclosure data is verified?

## Blocked Actions

Do not execute yet:
- Public content body edits.
- Title/H1/meta changes.
- Slug changes.
- Redirects.
- Canonical changes.
- Sitemap changes.
- Noindex.
- Deletions.
- New calculator or formula claims.
- New standalone support pages.
- Menu/category/taxonomy edits.
- Lawyer cards, review widgets or lead-flow changes.
- CMS/database writes.

## Next Approved Work If Owner Says Yes

1. Build a side-by-side content-quality comparison:
   - `/child-support/`
   - old calculator URL
   - `בע"מ 919/15`
   - change/reduction/jurisdiction support candidates
2. Build a source/legal checklist for every claim that may appear in the public guide.
3. Build an internal-link plan for the family-law child-support cluster.
4. Draft a no-URL-change editorial brief for `/child-support/`.
5. Return for owner approval before any CMS edit.

## Safety

This packet is documentation and CSV planning only. No public content body, URL slug, redirect, sitemap inclusion, canonical setting, noindex setting, taxonomy term, menu, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.
