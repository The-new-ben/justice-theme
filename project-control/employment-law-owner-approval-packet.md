# Employment Law Owner Approval Packet

Date: 2026-05-11
Status: REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This packet converts the employment-law inventory, GSC browser evidence, content-quality audit and current URL map into an owner decision framework. It does not approve or execute public content rewrites, URL changes, redirects, canonical changes, sitemap changes, noindex actions, taxonomy/menu changes, homepage changes or CMS writes.

## Recommended Approval Decision

RECOMMENDED:
- Approve a no-URL-change employment-law primary-selection and intent-split planning batch.
- Do not create `/employment-lawyer/` yet.
- Do not redirect `/labor-lawyer/` yet.
- Do not rewrite the homepage to solve employment-law ranking yet.
- Treat `/labor-lawyer/` as the current service-page candidate, but compare it against a future `/employment-lawyer/` strategy.
- Treat `/israeli-labor-law/` as the current informational candidate, not the lawyer-service primary.

Why:
- GSC browser evidence shows weak primary ownership.
- `עורך דין דיני עבודה` maps mostly to the homepage, not a dedicated employment-lawyer page.
- `דיני עבודה` maps mostly to `/israeli-labor-law/`, not a lawyer-service page.
- `/labor-lawyer/` exists but is thin:
  - `689` words in the public inventory.
  - content-quality score `4/10`.
  - `EXPAND` recommendation in the quality audit.
- `/employment-lawyer/` is a cleaner strategic slug but no exact current URL is present in the public map.

## Current Evidence

VERIFIED:
- `project-control/gsc-targeted-query-pass-2026-05-11.csv`.
- `project-control/content-decision-evidence-overlay.csv`.
- `project-control/content-master-inventory.csv`.
- `project-control/content-quality-audit.csv`.
- `project-control/url-migration-map.csv`.
- `project-control/internal-link-map.csv`.
- `project-control/cannibalization-map.csv`.
- `project-control/topic-clusters.csv`.

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page or lead data.
- SERP review for employment-lawyer and broad employment-law terms.
- Full source/legal review of employment-law claims.
- Owner approval for primary URL choice.
- Lawyer availability/verification for employment-law lawyer cards.

## Query Evidence From GSC Browser Pass

VERIFIED:
- `עורך דין דיני עבודה`: `88` impressions, `0` clicks, average position `33.4`.
- Visible pages for `עורך דין דיני עבודה`:
  - `https://jus-tice.co.il/`: `72` impressions, average position `21.7`.
  - `https://jus-tice.co.il/labor-lawyer/`: `16` impressions, average position `86.1`.
- `דיני עבודה`: `614` impressions, `0` clicks, average position `57.0`.
- Visible pages for `דיני עבודה`:
  - `https://jus-tice.co.il/israeli-labor-law/`: `472` impressions, average position `62.0`.
  - `https://jus-tice.co.il/`: `89` impressions, average position `23.5`.
  - `https://jus-tice.co.il/labor-lawyer/`: `34` impressions, average position `85.5`.
  - `https://jus-tice.co.il/פסק-דין-בנושא-הרמת-מסך-סעש-12385-08-16/`: `14` impressions, average position `40.0`.
  - `https://jus-tice.co.il/employer-worker-relationship/`: `4` impressions, average position `42.0`.
  - `https://jus-tice.co.il/legal-courses-for-lawyers/`: `1` impression, average position `16.0`.

Interpretation:
- The homepage is carrying some lawyer-service employment relevance, but it should not be the employment-law primary.
- `/israeli-labor-law/` is the strongest informational candidate for broad `דיני עבודה`.
- `/labor-lawyer/` is the current clean service candidate, but it is too thin and weak.
- Lawyer-facing content such as `/legal-courses-for-lawyers/` should be separated from public legal-help intent.

## Page Decisions For Approval

### 1. Current Service Candidate

Current URL:
- `https://jus-tice.co.il/labor-lawyer/`

Current facts:
- Published article.
- Public REST word count: `689`.
- Quality score: `4/10`.
- Quality audit recommended action: `EXPAND`.
- Appears weakly in GSC for both checked employment queries.

Recommended action:
- APPROVE COMPARE / POSSIBLE NO-URL-CHANGE EXPANSION.

Owner question:
- Should `/labor-lawyer/` be improved first as the service-page candidate, or should it remain a bridge toward a later `/employment-lawyer/` migration?

### 2. Future Strategic Slug

Future target:
- `https://jus-tice.co.il/employment-lawyer/`

Current facts:
- No exact current public URL found in the URL map.
- Cleaner English slug for the global pillar strategy.

Recommended action:
- HOLD URL MIGRATION.

Blocked:
- Do not create `/employment-lawyer/` yet.
- Do not redirect `/labor-lawyer/` yet.
- Do not change canonical/sitemap entries.

### 3. Informational Employment-Law Candidate

Current URL:
- `https://jus-tice.co.il/israeli-labor-law/`

Current facts:
- Receives `472` impressions for `דיני עבודה` in the checked GSC browser filter.
- Serves informational broad employment-law intent, not necessarily lawyer-hiring intent.

Recommended action:
- PROTECT / KEEP AS INFORMATIONAL SUPPORT OR GUIDE CANDIDATE.

Blocked:
- No redirect to a lawyer-service page.
- No overwrite with commercial copy.
- No noindex/canonical change.

### 4. Homepage Overlap

Current URL:
- `https://jus-tice.co.il/`

Current facts:
- Receives `72` impressions for `עורך דין דיני עבודה`.
- Receives `89` impressions for `דיני עבודה`.
- Has better visible position than the weak service page in the checked filters.

Recommended action:
- HOMEPAGE INTERNAL-LINK REVIEW ONLY.

Blocked:
- Do not rewrite the homepage just to chase employment-law traffic.
- Do not make employment law dominate homepage structure.
- Add homepage-to-employment linking only after the employment primary decision is approved.

### 5. Support / Case-Law / Adjacent Pages

Known pages from GSC and inventory:
- `https://jus-tice.co.il/employer-worker-relationship/`
- `https://jus-tice.co.il/employment-contract/`
- `https://jus-tice.co.il/notice-of-termination/`
- `https://jus-tice.co.il/פסק-דין-בנושא-הרמת-מסך-סעש-12385-08-16/`

Recommended action:
- REVIEW AS SUPPORT / DO NOT MERGE OR REDIRECT YET.

Quality notes:
- `employer-worker-relationship/`: `3,879` words, quality score `8/10`.
- `employment-contract/`: `1,097` words, quality score `2/10`, recommended rewrite.
- `notice-of-termination/`: `842` words, quality score `4/10`, recommended rewrite.
- Case-law pages should remain support/case material unless source/legal review approves summarized use.

### 6. Lawyer-Facing Content

Current URL:
- `https://jus-tice.co.il/legal-courses-for-lawyers/`

Current facts:
- Appeared once for public `דיני עבודה` query.
- It is lawyer-facing, not public legal-help content.

Recommended action:
- SEPARATE PUBLIC USER INTENT FROM LAWYER-MARKETING CONTENT.

Blocked:
- Do not optimize lawyer-facing pages for public legal-help terms.
- Do not link them as core support articles from public employment-law pages unless the context is clearly lawyer/business-facing.

## Source / Legal Review Checklist

Before public edits:
- Verify employee/worker rights language.
- Verify employer/employee distinction and contract obligations.
- Verify termination, prior notice and severance language.
- Verify workplace relationship and contractor/employee distinction.
- Verify any COVID-era pages are outdated or historical before reuse.
- Add official/public sources where appropriate.
- Add a clear legal disclaimer.
- Avoid unsupported legal conclusions or practical instructions that require legal advice.

## Internal-Link Direction After Approval

If owner approves the comparison batch:
- The chosen service primary should link to employer-worker relationship, employment contract, notice/termination, severance/firing topics and relevant official/public sources.
- Informational `/israeli-labor-law/` should link to the service primary only where hiring a lawyer is naturally relevant.
- Homepage should link to the approved employment-law primary as one of many major legal fields, not as a dominant homepage theme.
- Lawyer cards should appear only if real employment-law lawyer profile data is verified.

## Sitemap / Canonical / Redirect Position

NOT APPROVED:
- No `/employment-lawyer/` creation.
- No `/labor-lawyer/` rename.
- No redirects.
- No canonical changes.
- No sitemap inclusion/exclusion changes.
- No noindex.
- No homepage structural changes.

Required before URL migration:
- Decide whether the long-term public service URL is `/labor-lawyer/` or `/employment-lawyer/`.
- Run SERP review for `עורך דין דיני עבודה`, `דיני עבודה`, `פיטורים`, `זכויות עובדים`, and employer-side terms.
- Build internal-link update map.
- Build redirect/canonical/sitemap plan if migration is chosen.
- Owner approval.

## Owner Approval Questions

1. Should `/labor-lawyer/` be expanded first with no URL change, or should `/employment-lawyer/` remain the long-term target?
2. Should `/israeli-labor-law/` stay as a separate informational guide rather than a commercial lawyer page?
3. Should the homepage only link to the approved employment primary, instead of being treated as the employment-law primary?
4. Should lawyer-facing content be separated from public legal-help employment content?
5. Should support pages like employer-worker relationship, employment contract and notice of termination be reviewed as support pages before new employment articles are created?

## Blocked Actions

Do not execute yet:
- Public content body edits.
- Title/H1/meta changes.
- Slug changes.
- Redirects.
- Canonical changes.
- Sitemap changes.
- Noindex.
- Homepage copy or section changes.
- New `/employment-lawyer/` page.
- New standalone employment-law support pages.
- Menu/category/taxonomy edits.
- Lawyer cards, review widgets or lead-flow changes.
- CMS/database writes.

## Next Approved Work If Owner Says Yes

1. Build a side-by-side content-quality comparison:
   - `/labor-lawyer/`
   - future `/employment-lawyer/`
   - `/israeli-labor-law/`
   - employer-worker relationship
   - employment contract
   - notice of termination
2. Build a SERP pass for the employment cluster.
3. Build a source/legal checklist for public employment-law claims.
4. Build an internal-link plan for homepage, service page, informational guide and support pages.
5. Return for owner approval before any CMS edit.

## Safety

This packet is documentation and CSV planning only. No public content body, URL slug, redirect, sitemap inclusion, canonical setting, noindex setting, homepage structure, taxonomy term, menu, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.
