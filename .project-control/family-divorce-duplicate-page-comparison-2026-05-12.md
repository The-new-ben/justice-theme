# Family / Divorce Duplicate Page Comparison

Date: 2026-05-12
Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGES

This batch compares the main divorce-lawyer duplicate group before the first Family/Divorce upload. It does not approve publishing, rewriting, redirects, deletion, noindex, canonical changes, sitemap changes, internal-link execution, related-card changes, lawyer-card changes, schema, CRM changes or CMS writes.

## Batch Scope

VERIFIED:
- `6` live URLs were checked.
- All `6` returned HTTP `200`.
- All `6` self-canonicalize.
- The group is a true cannibalization/merge group because several pages target the same commercial divorce-lawyer intent.

Pages checked:
- `/divorce-lawyer/`
- `/עורך-דין-לענייני-גירושין/`
- `/articles/איך-לבחור-משרד-עורך-דין-גירושין-כשמתגר/`
- `/מה-זה-עורך-דין-גירושין/`
- `/divorce-everything-you-need-to-know/`
- `/divorce-consultation-guide/`

## Main Finding

The clean `/divorce-lawyer/` page remains the recommended future pillar because it has the right English URL and primary commercial intent.

But the large Hebrew duplicate `/עורך-דין-לענייני-גירושין/` is materially stronger in current live word count and likely contains useful sections that must be mined before final upload.

Decision:
- Do not publish the final `/divorce-lawyer/` pillar until the large Hebrew duplicate has been merged or explicitly excluded section by section.
- Do not redirect the large Hebrew duplicate yet.
- Do not canonicalize it to `/divorce-lawyer/` yet.
- Do not leave it as a long-term competing pillar after the final clean pillar is approved.

## Page Decisions

### 1. `/divorce-lawyer/`

VERIFIED LIVE:
- HTTP `200`.
- Self-canonical.
- H1 directly targets `עורך דין גירושין`.
- Live extracted word count: `4,017`.
- Repo draft exists and is broader than the live page.

Recommended role:
- Future primary divorce-lawyer pillar.

Action:
- Repair/enrich as the first public Family/Divorce page after owner approval.
- Merge useful material from the duplicate group before upload.
- Keep title/H1 focused; avoid making it a broad family-law/wills page.

### 2. `/עורך-דין-לענייני-גירושין/`

VERIFIED LIVE:
- HTTP `200`.
- Self-canonical.
- H1 directly targets `עורך דין גירושין`.
- Live extracted word count: `9,697`.
- Inventory word count: `9,077`.
- URL migration map already points it toward `/divorce-lawyer/` as a duplicate target-slug conflict.

Recommended role:
- Large duplicate and section-source candidate.

Action:
- Use it as a merge source for process, cost, rights, children, property, documents and decision-flow sections if the copy is accurate.
- Do not keep it as a separate pillar unless GSC API proves it owns a distinct query set that `/divorce-lawyer/` should not own.
- After merge and owner approval, likely redirect/canonical candidate.

Risk:
- If `/divorce-lawyer/` is enriched while this page stays as-is, the site will keep two strong divorce-lawyer pages competing with each other.

### 3. `/articles/איך-לבחור-משרד-עורך-דין-גירושין-כשמתגר/`

VERIFIED LIVE:
- HTTP `200`.
- Self-canonical.
- H1 targets how to choose a divorce-law firm.
- Live extracted word count: `1,464`.
- Inventory word count: `903`.
- URL migration map points it toward `/divorce-lawyer/` as a duplicate target-slug conflict.

Recommended role:
- Merge into the lawyer-selection section of `/divorce-lawyer/`.

Action:
- Keep only practical selection guidance.
- Remove any unsupported "recommended/top/best/trusted" language.
- Redirect later only after merge approval and GSC check.

### 4. `/מה-זה-עורך-דין-גירושין/`

VERIFIED LIVE:
- HTTP `200`.
- Self-canonical.
- H1 targets "what is a divorce lawyer".
- Live extracted word count: `2,197`.
- Inventory word count: `1,617`.
- URL migration map points it toward `/divorce-lawyer/` as a duplicate target-slug conflict.

Recommended role:
- Merge basic definition and "when a lawyer is needed" into `/divorce-lawyer/`.

Action:
- Do not keep as an independent page unless it is rewritten into a narrow glossary/definition support page with a clear different purpose.
- Redirect later only after owner approval and GSC API check.

### 5. `/divorce-everything-you-need-to-know/`

VERIFIED LIVE:
- HTTP `200`.
- Self-canonical.
- H1 targets broad divorce process intent.
- Live extracted word count: `3,950`.
- Inventory word count: `3,357`.

Recommended role:
- Process-support page or merge candidate, not first public pillar.

Action:
- Keep temporarily.
- Compare later against `/divorce-lawyer/` and potential `/divorce-process/` or process-section strategy.
- If retained, it must own informational divorce-process intent rather than lawyer-selection intent.

### 6. `/divorce-consultation-guide/`

VERIFIED LIVE:
- HTTP `200`.
- Self-canonical.
- H1 targets divorce consultation / first meeting.
- Live extracted word count: `3,400`.
- Inventory word count: `2,809`.

Recommended role:
- Keep as support page.

Action:
- Link from the consultation/preparation section of `/divorce-lawyer/` after approval.
- Do not merge wholesale unless duplicate review later shows it has no distinct search role.

## Upload Implication

Family/Divorce can still move cluster-by-cluster, but the first public upload must be a controlled merge into `/divorce-lawyer/`, not a blind overwrite of the clean page and not a new duplicate page.

Minimum before first upload:
1. Build section-level merge outline for `/divorce-lawyer/`.
2. Decide which sections from `/עורך-דין-לענייני-גירושין/` are reused.
3. Decide whether selection/definition pages are merged into the pillar.
4. Keep `/divorce-consultation-guide/` as support.
5. Keep `/divorce-everything-you-need-to-know/` protected until process-guide decision.
6. Do not execute redirects/canonicals until GSC API export and owner approval.

## What Is Ready

READY:
- `/divorce-lawyer/` is still the clean primary target.
- Large duplicate group is identified.
- Six live pages are checked.
- Merge/keep/hold decisions are documented.
- The next useful step is section-level merge planning.

## What Is Still Blocked

BLOCKED:
- Final public copy import.
- Redirects from duplicate pages.
- Canonical changes.
- Sitemap changes.
- Internal-link execution.
- Related-card changes.
- Category/taxonomy changes.
- Any ranking/recommended/trusted language.
- Maya profile/rating/review use.
- CMS/database writes.

## Next Step

Create a section-level merge outline for `/divorce-lawyer/` that explicitly says:
- what to keep from the clean pillar,
- what to pull from the large Hebrew duplicate,
- what to pull from the selection article,
- what to pull from the definition article,
- what to leave in support pages,
- what to exclude for legal/compliance/SEO reasons.

