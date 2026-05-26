# Family / Divorce Taxonomy And Category Plan

Date: 2026-05-12
Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGES

This plan closes the Family/Divorce category gate before any controlled content upload. It defines which taxonomy terms can be used for the first `/divorce-lawyer/` cluster, which terms must stay out of the first wave, and what must be checked after any draft import or public update.

It does not approve taxonomy edits, category edits, term slug changes, term parent changes, content import, public publishing, redirects, canonicals, noindex, sitemap changes, menu changes, breadcrumbs, related cards, lawyer cards, wp-admin settings or database writes.

## Inputs Reviewed

VERIFIED:
- `project-control/category-map.csv`
- `project-control/family-law-content-cluster-map.md`
- `project-control/family-law-publication-readiness.csv`
- `project-control/family-divorce-current-url-upload-readiness-2026-05-11.csv`
- `project-control/family-divorce-no-url-internal-link-map-2026-05-12.csv`
- `content-drafts/divorce-lawyer-pillar-he.md`
- `content-drafts/child-support-supporting-he.md`
- `content-drafts/family-dispute-resolution-supporting-he.md`
- `ultra-justice-engine/includes/taxonomy-practice-areas.php`
- `inc/taxonomy-seed.php`
- `inc/content-draft-importer.php`
- `inc/live-content-publication.php`

## Current Technical Reality

VERIFIED:
- The active `practice-areas` taxonomy is hierarchical and attached to `articles`, `justice_lawyer` and `post`.
- Its public archive base is `/practice-areas/`.
- The `city` taxonomy is attached to `justice_lawyer`, not to legal articles.
- Breadcrumbs, lawyer filters, SEO titles and related-content logic all depend on `practice-areas`.
- The repo draft importer currently writes article metadata such as `content_cluster`, but it does not visibly assign `practice-areas` terms during import.
- The family-cluster publication helper stores `pillar_lawyer_area = family-law` and `content_cluster = family-law`, but the upload plan needs more precise Family/Divorce taxonomy rules before use.

Implication:
- If Family/Divorce pages are imported or updated without explicit taxonomy rules, breadcrumbs, archives, related content, lawyer routing and sitemap decisions can drift.

## Recommended First-Wave Taxonomy Rules

Primary broad term:
- `family-law`
- Role: broad parent/directory term for Family Law.
- Use on all first-wave Family/Divorce articles after approval.
- Use for lawyer-directory filtering only when real lawyer profiles are safe.

Primary subtopic terms:
- `divorce`
- `child-support`
- `child-custody`

Use these only where they match the page intent:
- `/divorce-lawyer/`: `family-law`, `divorce`
- `/consensual-divorce/`: `family-law`, `divorce`
- `/divorce-mediation/`: `family-law`, `divorce`
- `/child-support/`: `family-law`, `child-support`
- `/child-custody/`: `family-law`, `child-custody`
- `/divorce-property-division/`: `family-law`, `divorce`
- `/family-dispute-resolution/`: `family-law` only for first wave, unless a dedicated dispute-resolution term is approved later.

Do not create new terms during the first upload unless owner approves:
- `divorce-agreement`
- `prenuptial-agreement`
- `divorce-mediation`
- `property-division`
- `family-dispute-resolution`
- `family-lawyer`

Reason:
- The first wave should reduce fragmentation, not create more term archives.

## Terms To Hold Out Of First Upload

Hold these out of the main divorce service pages:
- `family-court`
- `rabbinical-court`
- `family-court-rulings`

Reason:
- They are process/court/case-law terms, not broad service terms. Use them later for procedure pages, case-law archives or source support after role review.

Hold these for Phase 1B:
- `inheritance-law`
- `inheritance`
- `wills`
- Hebrew inheritance/wills duplicates

Reason:
- Wills and inheritance are adjacent family-law topics, but they should not be mixed into the divorce upload wave.

## Important Slug Collision Risk

VERIFIED RISK:
- `category-map.csv` shows a `practice-areas` term with current slug `prenuptial-agreement`, but its visible name and mapped cluster are criminal-law related.

Decision:
- Do not create or use `/prenuptial-agreement/` as a Family/Divorce URL or taxonomy slug until this collision is reviewed.
- Keep `prenuptial-agreement` as a future-only URL/term decision.
- Treat `הסכם ממון` content as a future support page only after the collision is resolved.

## WordPress Category Rules

VERIFIED:
- `category-map.csv` shows the normal WordPress `category` taxonomy is legacy/noisy and not the clean architecture layer for Family/Divorce.

Decision:
- Do not use WordPress `category` as the main Family/Divorce cluster control.
- Do not create new WP categories for the first Family/Divorce upload.
- Use `practice-areas` and content metadata instead.

## Post Tag Rules

Decision:
- Do not use `post_tag` for first-wave Family/Divorce architecture.
- Tags can be reviewed later, but they should not drive breadcrumbs, related cards, sitemap inclusion or upload approval.

## Metadata Rules

Recommended:
- Keep `pillar_lawyer_area = family-law` for lawyer-directory routing.
- Use `content_cluster = family-law-divorce` for analytics and cluster QA, or add a separate `content_subcluster = family-law-divorce` if backward compatibility requires `content_cluster = family-law`.
- Do not rely on metadata alone. Assign approved `practice-areas` terms when drafts are imported or updated.

Current draft note:
- Existing Family/Divorce drafts currently say `Cluster: family-law`.
- This is acceptable for draft history, but before upload the import/update path should either normalize the metadata or document a compatibility rule.

## Post-Upload Taxonomy QA

MUST VERIFY AFTER ANY DRAFT IMPORT OR PUBLIC UPDATE:
1. Each first-wave page has `family-law`.
2. Divorce pages also have `divorce` where appropriate.
3. `/child-support/` has `child-support`.
4. `/child-custody/` has `child-custody`.
5. No first-wave page is assigned to inheritance/wills terms.
6. No first-wave page is assigned to city terms.
7. No first-wave page is assigned to ranking/recommendation/trust terms.
8. Breadcrumbs show a sensible Family Law path and do not jump into court-ruling archives.
9. Related-content logic does not use court/ruling/inheritance/city terms as the main match for `/divorce-lawyer/`.
10. Term archive sitemap posture is reviewed before any new term archives are intentionally promoted.

## Current Decision

VERIFIED:
- Family/Divorce taxonomy planning can advance without GSC API or public CMS changes.
- The first upload should use existing terms only: `family-law`, `divorce`, `child-support`, `child-custody`.
- Category/taxonomy execution remains blocked until owner approval and final upload procedure.

BLOCKED:
- No taxonomy, category, term slug, term parent, sitemap, breadcrumb, menu, related-card, content import or database change is approved by this plan.
