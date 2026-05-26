# AI Content Audit Workflow

Date: 2026-05-10
Status: ACTIVE - AI may assist audit, not publish blindly

## Purpose

Use AI to speed up inventory analysis, clustering, duplicate detection, slug suggestions and editorial planning while protecting existing SEO value and avoiding unsupported legal claims.

## Inputs

Required before AI recommendations:
- `project-control/content-master-inventory.csv`
- `project-control/content-quality-audit.csv`
- `project-control/cannibalization-map.csv`
- `project-control/url-migration-map.csv`
- `project-control/topic-clusters.csv`
- `project-control/internal-link-map.csv`

Optional but important:
- GSC exports
- old sitemap
- redirect list
- official source audit files
- live page screenshots for key templates

## AI Tasks Allowed

AI may help with:
- topic clustering
- intent classification
- duplicate title/topic detection
- content quality scoring drafts
- English slug suggestions
- title/meta rewrite suggestions
- article outline suggestions
- source suggestion lists
- internal link recommendations
- merge summaries
- gap analysis

## AI Tasks Not Allowed

AI must not:
- publish or update live content without approval
- invent legal facts
- invent citations
- claim a lawyer is verified/recommended without proof
- replace an old page without comparing old content
- execute redirects
- delete, noindex or canonicalize live pages
- decide high-traffic URL changes without GSC

## Prompt Templates

### Intent Classification

```text
You are auditing a Hebrew legal website. Given this row from content-master-inventory, classify search intent as one of: commercial lawyer-hiring, informational guide, urgent legal issue, legal form/process, news/case summary, glossary, lawyer profile, category/hub, spam/irrelevant. Return only CSV-safe values: top_keyword, secondary_keywords, search_intent, topic_cluster, pillar_candidate, notes.
```

### Quality Scoring

```text
Score this page 1-10 for public legal usefulness. Consider clarity, depth, practical steps, legal-source need, FAQ/checklist, internal links, CTA, spam/internal-note risk, topic cluster fit. Return: quality_score_1_10, is_thin, is_outdated, is_duplicate, has_sources, has_practical_steps, has_faq, has_checklist, has_internal_links, has_clear_intent, has_cta, recommended_action, notes.
```

### Cannibalization Grouping

```text
Given these page titles/slugs/excerpts/keywords, group pages that compete for the same search intent. Choose one recommended primary URL only if evidence is strong; otherwise mark NEEDS_REVIEW. Return: cannibalization_group, primary_keyword, search_intent, competing_urls, current_best_url, recommended_primary_url, supporting_urls, pages_to_merge, pages_to_redirect_later, pages_to_keep, notes, owner_approval_required.
```

### Slug Suggestion

```text
Suggest a short English slug for this Hebrew legal page. Rules: lowercase, hyphenated, no Hebrew, no dates unless needed, no duplicate of existing slugs, match search intent, prefer canonical legal-English phrase. Return: proposed_english_slug, confidence, duplicate_risk, notes.
```

### Merge Plan

```text
Compare old page A and proposed/new page B. Identify unique useful sections to preserve, duplicated sections, outdated claims, source gaps, and recommended canonical URL. Do not recommend deletion unless content is spam or owner approved. Return a merge plan and redirect recommendation.
```

## Review Gates

Every AI recommendation must pass:
1. CSV row traceability to source URL/post ID.
2. Duplicate/cannibalization check.
3. Slug conflict check.
4. Legal/source check for YMYL claims.
5. GSC traffic-risk review where available.
6. Owner approval for publish/redirect/delete/noindex.

## Output Rules

AI outputs go into:
- `project-control/content-quality-audit.csv`
- `project-control/cannibalization-map.csv`
- `project-control/url-migration-map.csv`
- `project-control/topic-clusters.csv`
- `project-control/internal-link-map.csv`

AI notes do not go into public article bodies.

## Publication Rule

Nothing goes live unless:
- it is public-facing Hebrew content
- it has no internal notes
- it has passed cannibalization review
- old content was compared
- URL risk was reviewed
- legal/source review is complete for sensitive claims
- owner approves publish/migration

## Source Model

Kol Zchut is a useful structural model for clarity, not a content source to copy. Use the model:
- who this is for
- what the issue is
- what steps to take
- what documents to prepare
- related topics
- official/public sources
- disclaimer

Do not copy protected text.
