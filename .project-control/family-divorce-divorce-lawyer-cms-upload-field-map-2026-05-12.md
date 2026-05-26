# Divorce Lawyer CMS Upload Field Map

Date: 2026-05-12
Status: VERIFIED PLANNING / REVIEW ONLY / NO PUBLIC CHANGES

This map turns the approved planning material for `/divorce-lawyer/` into a practical CMS upload worksheet. It tells us which WordPress fields to prepare, what the recommended value is, what must be backed up, and what remains blocked.

It does not approve any CMS edit, public upload, redirect, noindex, canonical change, sitemap change, taxonomy edit, related-card edit, schema edit, wp-admin setting or database write.

## Source Inputs

VERIFIED:
- Clean body source: `content-drafts/divorce-lawyer-public-body-he.md`
- Metadata package: `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.md`
- Controlled QA package: `project-control/family-divorce-controlled-upload-qa-package-2026-05-12.md`
- First upload decision brief: `project-control/family-divorce-first-upload-decision-brief-2026-05-12.md`
- Current live URL: `https://jus-tice.co.il/divorce-lawyer/`
- Current live status: `200`
- Current canonical: `https://jus-tice.co.il/divorce-lawyer/`

## Recommended CMS Field Values

Use these only after owner approval:

- Page/post URL: `https://jus-tice.co.il/divorce-lawyer/`
- Slug: `/divorce-lawyer/`
- Post title / H1: `עורך דין גירושין: מדריך לבחירה נכונה ולהיערכות להליך`
- SEO title: `עורך דין גירושין | מדריך לבחירה נכונה ולהיערכות להליך`
- Meta description: `מדריך למי שמחפש עורך דין גירושין: מתי לפנות, אילו מסמכים להכין, ומה לבדוק לגבי ילדים, מזונות, רכוש והסכם גירושין.`
- OG title: `עורך דין גירושין: מדריך לבחירה ולהיערכות`
- OG description: same as meta description
- Breadcrumb label: `עורך דין גירושין`
- Canonical: `https://jus-tice.co.il/divorce-lawyer/`
- Robots: index/follow only after owner approval and upload QA
- Practice-area terms: `family-law`, `divorce`
- Public body: copy from `content-drafts/divorce-lawyer-public-body-he.md`

## Backup Before Any CMS Edit

Before touching the live page, save:
- Current body content.
- Current post title / H1.
- Current SEO title.
- Current meta description.
- Current OG title and description.
- Current canonical.
- Current taxonomy terms.
- Current related links/cards.
- Current schema/source output if visible.
- Current page screenshots if possible.

Do not overwrite anything until rollback material exists.

## Related Links

Allowed primary links after approval:
- `/consensual-divorce/`
- `/divorce-mediation/`
- `/child-support/`
- `/child-custody/`

Allowed secondary links after approval:
- `/divorce-property-division/`
- `/family-dispute-resolution/`

Blocked from the first upload:
- city pages,
- ranking/recommended/trusted lawyer pages,
- Maya/profile/reputation links,
- review/rating pages,
- LegalTech/tool promises,
- old duplicate URLs,
- PDF/DOCX/calculator/case-law URLs as related cards.

## Schema And Trust Safety

Allowed:
- safe WebPage/Article/Breadcrumb output if it matches visible content.

Blocked:
- Review schema,
- AggregateRating,
- fake ratings,
- fake review counts,
- fake badges,
- top/recommended/trusted lawyer claims,
- success or outcome guarantees.

## Upload Decision

RECOMMENDED:
- Use this as the final operator worksheet only after owner approval.
- Upload `/divorce-lawyer/` first, not the whole support cluster.
- Keep old URLs and protected assets live.

BLOCKED:
- Owner approval is still required.
- GSC API is still required before redirect/canonical/noindex/sitemap-removal decisions.
- No public CMS or URL action has been executed.

## Next Step

Owner can now review three pieces together:
1. Clean body: `content-drafts/divorce-lawyer-public-body-he.md`
2. Metadata package: `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.md`
3. CMS upload field map: `project-control/family-divorce-divorce-lawyer-cms-upload-field-map-2026-05-12.md`

After approval, use the controlled QA package before and after the CMS edit.
