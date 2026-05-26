# CMS Audit
Date: 2026-05-09

## VERIFIED From Repo
- Theme templates expect CPTs: `articles`, `justice_lawyer`.
- Plugin code registers CPTs: `articles`, `justice_lawyer`, `justice_lead`.
- Theme expects taxonomies: `practice-areas`, `city`.
- Local plugin taxonomy ownership was corrected so `justice_lawyer` receives both `city` and `practice-areas`.
- Homepage sections are template-driven through `front-page.php`.
- Lead forms submit to `admin-post.php?action=justice_submit_lead`.

## VERIFIED From Public Live HTML
- Homepage returns many article/practice-area links and stats.
- `/lawyers/` returns 10 lawyer cards/profiles.
- Live lawyer archive shows city values as slugs in card meta (`tel-aviv`, etc.), so taxonomy display requires cleanup.

## NOT VERIFIED
- Active theme option (`template`/`stylesheet`).
- Menu assignments in WP admin.
- Customizer logo/contact values.
- Whether homepage is a static page or template-only.
- Whether spam exists in posts, pages, widgets, menus, or options.

## Risks
- Regular `post` content appears to include broad legacy/legal material and possible low-quality content. Keep homepage authority sections attached to `articles` only until audit is complete.
- Public category/practice lists contain noisy terms such as court names and years. This is a cannibalization and UX problem.
