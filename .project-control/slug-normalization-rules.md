# Slug Normalization Rules
Date: 2026-05-09

## Final Rule

Hebrew content, English slugs.

## Allowed Slug Format

- Lowercase English only.
- ASCII letters, numbers, and hyphens only.
- Short, clear, search-intent aligned.
- No Hebrew characters.
- No URL-encoded Hebrew.
- No spaces.
- No underscores.
- No trailing numbers unless the number is part of the legal topic.
- No duplicate `-2`, `-3`, or imported CMS suffixes.
- No generic slugs like `post-123`, `uncategorized`, `new-page`, or `article`.

## Slug Pattern By Entity

| Entity | Pattern | Example |
|---|---|---|
| Pillar legal page | `{practice}-lawyer` | `divorce-lawyer` |
| Supporting article | `{topic}` | `child-custody` |
| Lawyer profile | `advocate-{first}-{last}` | `advocate-maya-rotenberg` |
| Practice taxonomy | `{practice}-law` or concise topic | `family-law` |
| City taxonomy | English city name | `tel-aviv` |
| LegalTech tool | product/action name | `demand-letter` |

## Intent Rules

1. One primary URL per major keyword.
2. Supporting pages must not compete with the pillar keyword.
3. Use `lawyer` in slug only when the page targets lawyer-hiring intent.
4. Use topic-only slug when the page is informational.
5. Use `-lawyer` for commercial/service pages:
   - `divorce-lawyer`
   - `criminal-lawyer`
   - `real-estate-lawyer`
6. Do not create multiple equivalent slugs:
   - avoid both `divorce-attorney` and `divorce-lawyer`
   - avoid both `family-lawyer` and `divorce-lawyer` for the same page

## Cleanup Rules

- Keep existing English slugs if they are short, relevant, and unique.
- Convert Hebrew slugs to English.
- Shorten long English slugs.
- Remove category clutter from URLs where WordPress settings allow it.
- Redirect old URLs only after approval.
- Update menus, breadcrumbs, internal links, canonicals, and sitemap after redirects.

## Traffic Risk Rules

Use `UNKNOWN` until GSC data is available.

Use `HIGH` when:
- page has meaningful clicks/impressions
- page has backlinks
- page ranks for target legal keywords
- page is linked from paid campaigns or important internal pages

Use `LOW` when:
- no indexation, no traffic, no backlinks, and no meaningful internal links are verified.
