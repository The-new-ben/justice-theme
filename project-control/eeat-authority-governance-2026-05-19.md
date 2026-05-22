# E-E-A-T Authority Governance - 2026-05-19

## Decision

Jus-Tice must stop treating author bylines as a decorative SEO field. For legal/YMYL content, a named person should appear as author or reviewer only when there is a real authority chain:

1. A visible author/reviewer identity on the article.
2. A dedicated profile page on Jus-Tice.
3. Structured data that reuses the same Person `@id`.
4. External verification such as Israel Bar profile, LinkedIn, Google Business Profile, professional website, directory profile, publications, or public speaking.
5. Practice-area match between the article and the person's real expertise.

## Research Summary

- Google's people-first content guidance says YMYL topics need strong trust signals and that E-E-A-T is especially important where content can affect health, finances, safety, legal rights, or major life decisions.
- Google Article structured-data guidance recommends `author` as `Person` or `Organization`, and recommends using `url` or `sameAs` to help Google identify the author.
- Google's Business Profile documentation says local ranking is mainly based on relevance, distance, and prominence. For Jus-Tice, this means the entity footprint matters: a complete Google Business Profile, consistent website/social/entity links, reviews, photos, posts, and real-world prominence.
- Current law-firm SEO guidance is consistent: authority is built from practice-area hubs, expert/reviewer profiles, external corroboration, source citations, review/update process, and local/entity signals.

Sources:

- Google people-first content and E-E-A-T: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Article structured data author guidance: https://developers.google.com/search/docs/appearance/structured-data/article
- Google Business Profile local ranking guidance: https://support.google.com/business/answer/7091
- Search Quality Rater Guidelines reference: https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf

## Current Risk Found

The `single-articles.php` template and `inc/schema.php` had a hardcoded Ben Batash article-author signal for `articles`.

That is risky because:

- A name alone is not a verified author entity.
- Ben is a lawyer, but the public authority footprint and topic-specific reputation are not yet established.
- It can overstate author expertise on all criminal articles.
- Remote teams may copy the pattern and add named authors without proof.

## Code Change In This Branch

Branch: `codex/eeat-authority-linear-sync`

Files changed:

- `inc/authority.php`
- `functions.php`
- `inc/schema.php`
- `single-articles.php`

Behavior:

- Default Article schema author is now the Jus-Tice organization, not a hardcoded person.
- A new authority registry defines which verified people may appear as legal reviewers.
- Maya Rotenberg is the first approved reviewer candidate, limited to `family-law` content and connected lawyer metadata.
- Article schema can add `reviewedBy` only when `connected_lawyer_slug` maps to a verified person and the content cluster matches.
- Visible article attribution now says editorial/review attribution instead of hardcoded "by Ben".

Important: this does not yet create Ben's author page or Maya's authority page improvements. It prevents unsafe output and creates the controlled path.

## Authority Model

### Default

Use:

- Article `author`: Jus-Tice organization.
- Visible attribution: editorial attribution.
- No named lawyer unless verified.

Use this for:

- Generic legal encyclopedia pages.
- Imported old content.
- Criminal content until a verified criminal-law reviewer exists.
- International/foreign-law pages until the relevant country/practice expert exists.

### Family Law

Use:

- Article `author`: Jus-Tice organization.
- Article `reviewedBy`: Maya Rotenberg, only when `connected_lawyer_slug=advocate-maya-rotenberg` and cluster is `family-law`.
- Visible attribution: professionally reviewed by Maya.

Requirements before broad rollout:

- Confirm live Maya profile URL.
- Add/verify Maya external links: official profile, firm site, LinkedIn, public publications, professional pages.
- Add Person schema to the lawyer profile page with stable `@id`.
- Keep claims factual and avoid "best", "top", or outcome promises.

### Criminal Law

Do not put Ben as author/reviewer across all criminal articles yet.

Better path:

1. Use Jus-Tice editorial author for now.
2. Build Ben's public entity page.
3. Add bar/license verification and external profiles.
4. Start with "editor / founder / legal content coordinator" if that is more accurate than "criminal-law expert".
5. Add a stronger criminal-law reviewer later when a qualified criminal-law partner is available.

## External Entity Goals

Create and connect the Jus-Tice entity footprint:

- Google Business Profile / Google Maps.
- LinkedIn company page.
- X/Twitter profile if owner approves.
- Facebook page if owner approves.
- YouTube or short-video profile later for legal explainer clips.
- Consistent NAP: name, address/service area, phone `0525101555`, website, logo/favicon.
- Link these from Organization schema `sameAs` after verified.
- Link back from each profile to `https://jus-tice.co.il/`.

## Rules For Remote Teams

1. No new named article author without an approved authority record.
2. No lawyer byline on a practice area where that lawyer is not actually qualified/reviewing.
3. No `sameAs` links that have not been opened and verified.
4. No fake awards, fake review/rating schema, "best lawyer", "top lawyer", or guaranteed-result language.
5. Family-law content may use Maya only after the page/article has the correct connected-lawyer metadata and review status.
6. Criminal-law content remains organization-authored until Ben's entity page or a stronger criminal-law reviewer is ready.
7. Every public authority change needs source/legal review and Rich Results/schema validation.

## Next Implementation Steps

1. Create Linear coordination issues so teams stop ad-hoc byline changes.
2. Build `/about/editorial-policy/`.
3. Build `/about/ben-batash/` only after owner supplies verified facts and links.
4. Enrich Maya's lawyer profile with Person schema and sameAs links.
5. Create Google Business Profile and company social profiles.
6. Add Organization `sameAs` only after profiles are live and verified.
7. Audit all published criminal articles for hardcoded Ben byline/schema after deployment.

## Linear Coordination

- HAD-59: E-E-A-T authority governance parent issue.
- HAD-60: Build verified author/reviewer pages for Ben Batash and Maya Rotenberg.
- HAD-61: Create Jus-Tice entity footprint: Google Business Profile, LinkedIn and sameAs plan.
- HAD-62: Audit existing criminal articles for unsafe Ben author attribution.
- Linear project document: `E-E-A-T Authority Governance - 2026-05-19`.

## Verification

- PHP lint passed for `inc/authority.php`, `inc/schema.php`, `single-articles.php`, and `functions.php`.
- `git diff --check` passed.
- Live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index, and robots.txt.
- No public CMS/database changes were made.
- No uPress pull should happen until PR review/merge.

## 2026-05-22 Safety Hardening Update

FIXED / VERIFIED LOCAL: `inc/schema.php` now defaults Article `author` to the Jus-Tice organization authority helper and defines `reviewedBy` only through `justice_theme_authority_article_reviewer_schema()`.

FIXED / VERIFIED LOCAL: legacy `inc/eeat.php` automatic Person schema/byline injection is disabled by default behind `justice_theme_enable_legacy_eeat_auto_injection`.

CREATED: `tools/check-eeat-authority-safety.mjs`.

VERIFIED LOCAL: checker generated `reports/eeat-authority-safety-2026-05-22.csv` and returned `6/6 VERIFIED`.

NOT LIVE VERIFIED: public JSON-LD/Rich Results validation and screenshots still require deploy/pull and cache clear.
