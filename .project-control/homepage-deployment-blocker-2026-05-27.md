# Homepage deployment blocker - 2026-05-27

Status: HOMEPAGE_DEPLOYMENT_BLOCKED_UPRESS_PULL_REQUIRED

Scope: private owner/operator deployment blocker. This file does not approve CMS/database edits, public SEO changes, CRM records, client/lawyer/supplier contact, invoices, payments, email, WhatsApp/TalkTo messages, GSC API calls or uPress action by itself.

## What is ready

- GitHub `main` includes `432c6175 Improve public-first homepage routing`.
- The homepage hero was changed to lead with public legal help instead of a directory-first message.
- A new homepage section was added: legal help by situation.
- The lawyer-selection guide content was not changed.
- PHP syntax checks passed for the changed templates and enqueue file.
- CSS cache version was bumped to `4.4.6`.

## What is blocked

The live homepage still shows the older copy. The change is ready in GitHub but has not been pulled into the uPress theme directory.

## Required owner/operator action

Open uPress for `jus-tice.co.il`, go to Git management for `wp-content/themes/justice-theme`, run Pull Git, then verify the live homepage contains:

- `צריכים עזרה משפטית? התחילו מהבעיה, העיר והצעד הבא`
- `עזרה משפטית לפי מצב`
- the new situation cards for criminal, family, real estate, labor, injury/national insurance and debt/enforcement.

## Hard no

- Do not change CMS content, redirects, canonicals/noindex, sitemap, taxonomies, CRM records, payment settings or provider settings while pulling the theme.
- Do not count homepage conversion impact until the live page shows the new copy.

## Completion assessment

- GitHub readiness: 100%.
- Live deployment: 0% until uPress Pull Git succeeds.
- Business impact: 0% until live deployment is verified and lead/search paths are tested.
