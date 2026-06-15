# Deployment & Operations Handoff — jus-tice.co.il

Audience: another agent ("Cobra") or any operator taking over deployment.
Author: Claude (handoff prepared 2026-06-15). Everything here is verified against the
live repo at commit `aa7c6463` on branch `main`, not assumed.

Read this top to bottom once. It explains exactly how code and content reach the live
site, what the REST API is and how to authenticate to it, how to use Google Search
Console, how to verify a deploy, and how to roll back.

---

## 0. The one mental model you must hold

There are **TWO independent deployment channels**, and confusing them is the single
biggest source of "I changed it but nothing happened":

| Channel | What it carries | How it reaches live |
|---|---|---|
| **A. Theme code** | PHP / CSS / JS in the Git repo (`inc/`, templates, `functions.php`, the bundled `justice-core/` plugin folder, `content-drafts/*.md`) | `git push origin main` → in uPress: **Pull Git** → live |
| **B. Database content** | Pages, posts, post_meta, Yoast meta, menus, options — things stored in MySQL, NOT in Git | WordPress REST API **OR** gated theme routines that run on an admin page load **OR** wp-admin by hand |

Theme code is in Git. Page/post content is in the database. A `git push` never changes a
single article's text by itself — it ships the *code* that can then publish/transform DB
content when an admin loads wp-admin or when the REST API is called.

---

## 1. Hosting & repo facts

- **Host:** uPress (Israeli managed WordPress). Control panel = the uPress dashboard
  ("CloudView"/File Manager is the uPress file area).
- **Live theme path on server:** `wp-content/themes/justice-theme`
- **Git repo:** `github.com/The-new-ben/justice-theme`
- **Deploy branch:** `main` (this is what uPress pulls; feature branches do NOT deploy)
- **The repo root IS the theme.** The `justice-core/` folder inside the repo is the
  companion plugin (`Plugin Name: Justice Core`) bundled in the theme repo. `ultra-justice/`
  and `ultra-justice-engine/` are LEGACY duplicate plugin folders — do not develop in them.
- **Active stack on live:** WordPress + Yoast SEO + WooCommerce + the Justice Core plugin.
- **Deploy verification marker:** `JUSTICE_DEPLOY_MARKER` constant in `functions.php`,
  printed on every public page as `<meta name="justice-deployment-marker" content="...">`.
  Bump it on every deploy so you can confirm the pull landed.

---

## 2. Channel A — deploying theme code (the normal path)

This is what we use for everything in `inc/`, templates, CSS, the plugin, and `content-drafts/`.

**Step 1 — commit and push to `main`:**
```
git add <files>
git commit -m "..."
git push origin main
```
Always `php -l` every changed PHP file before committing. A fatal in theme code white-screens
the live site on pull.

**Step 2 — pull on uPress:**
- Log into the uPress panel → **File Manager** → navigate to `wp-content/themes/justice-theme`
  → **Git management** → click **Pull Git** (Hebrew: **משוך גיט**).
- Wait for the success toast (`המשיכה הסתיימה בהצלחה`). If it shows a conflict, do NOT force;
  report the conflict text.

**Step 3 — verify it went live (no login needed):**
```
curl -s https://jus-tice.co.il/ | grep -o 'justice-deployment-marker[^>]*'
```
The `content="..."` value must equal the marker you just pushed in `functions.php`.
Then spot-check the actual change on the relevant page.

That is the entire code-deploy loop. Bump the marker, push, pull, curl-verify.

---

## 3. Channel B — changing database content

Three sub-methods, in order of how we actually use them.

### 3a. content-drafts + auto-publisher (how the pillar articles ship)

- Long-form article bodies live as Markdown-ish files in `content-drafts/*.md` (in Git).
  Header fields the importer reads: `Slug target:`, `Status:`, `Cluster:`,
  `Connected lawyer:`, `Primary keyword:`, `Secondary keywords:`. The first `# ` line is the title.
- The converter (`inc/content-draft-importer.php`) turns them into HTML and supports a safe
  inline subset (`<a href>`, `<strong>`, `<em>`). Internal links written as `[label](/slug/)`
  and external links as raw `<a href="https://...">` both survive.
- **Pillar publisher** (`inc/cluster-pillar-content-publisher.php`) maps specific drafts to
  live PAGE slugs and, on the next wp-admin page load after a pull, automatically:
  overwrites the page body, backs up the old body to `legacy_pillar_content` meta, and writes
  Yoast meta (`_yoast_wpseo_title`, `_yoast_wpseo_focuskw`, `_yoast_wpseo_metadesc`).
  It is idempotent (per-draft flag `pillar_body_from_draft`) and gated by the
  `justice_theme_enable_pillar_publish` filter (currently defaulted ON in code).
- Generic importer UI: **wp-admin → Tools → Jus-Tice Content Drafts** (manual import/review).

So to publish a new pillar: add the `.md` to `content-drafts/`, map it in
`justice_theme_pillar_publish_map()`, add its Yoast row in `justice_theme_pillar_yoast_meta()`,
push, pull, load wp-admin once. Done.

### 3b. The WordPress REST API (for programmatic content writes)

**Base:** `https://jus-tice.co.il/wp-json/`

**Custom namespace:** `justice-core/v1` (provided by the Justice Core plugin — the plugin must
be ACTIVE). Verified routes:

| Method | Route | Purpose | Permission |
|---|---|---|---|
| GET | `/justice-core/v1/health` | stack/health check | admin |
| GET | `/justice-core/v1/site-state` | site config snapshot | admin |
| GET | `/justice-core/v1/theme-state` | theme/deploy state | admin |
| GET | `/justice-core/v1/content/posts` (`/content-inventory`) | list posts/articles | admin |
| GET | `/justice-core/v1/content/lawyers` (`/lawyers`) | list lawyer profiles | admin |
| GET | `/justice-core/v1/content/leads` (`/leads`) | list leads | admin |
| POST | `/justice-core/v1/content/update-meta` | set post meta | admin **+ write flag** |
| POST | `/justice-core/v1/content/posts` | create/update posts | admin **+ write flag** |
| POST | `/justice-core/v1/content/trash-post` | trash a post | admin **+ write flag** |

**AUTHENTICATION — read this carefully.** There is **no custom API key / shared secret**.
Every route requires `current_user_can('manage_options')`, i.e. you must authenticate as a
real WordPress administrator. The correct, modern way for an agent to do that is a
**WordPress Application Password** (HTTP Basic auth):

1. Owner: wp-admin → **Users → (your admin user) → Application Passwords** → create one named
   e.g. `cobra-rest`. WordPress shows a 24-char password ONCE (format `xxxx xxxx xxxx ...`).
2. Use it as HTTP Basic auth (spaces in the password are fine / can be removed):
```
curl -u 'ADMIN_USER:APP_PASSWORD' https://jus-tice.co.il/wp-json/justice-core/v1/health
```
3. The **write** routes (`/content/*` POST) are additionally gated behind the
   `uje_enable_rest_content_writes` filter, which defaults to FALSE. To allow REST writes,
   a small theme/plugin filter must set it true:
   `add_filter('uje_enable_rest_content_writes','__return_true');`
   Until that filter is enabled, write POSTs return 403 even with a valid admin app password.

Standard WP core routes (`/wp-json/wp/v2/pages/<id>`, `/posts/<id>`) also work with the same
Application Password and are often the simplest way to update a page body or meta directly.

> Honest note: I (this session) deployed almost everything via Channel A (Git) + 3a
> (auto-publisher), NOT via REST. The REST write path is real and available, but it needs the
> app password (owner-generated) + the write flag enabled. Don't assume a stored key exists —
> none does.

### 3c. Gated admin routines + feature-flag catalog

Many one-time DB actions run automatically on an admin page load when their feature flag is
enabled (the flag passes through `justice_theme_admin_cms_write_enabled()`, which itself
requires `is_admin()` + `manage_options`). Catalog of flags:

| Filter | Default | Effect when true |
|---|---|---|
| `justice_theme_enable_pillar_publish` | **ON** (set in code) | Auto-publish the 5 pillar bodies + Yoast meta |
| `justice_theme_enable_legal_editor_page_seed` | **ON** (set in code) | Create `/adv-ben-betesh/` bio page |
| `justice_theme_enable_lawyer_plans_page_seed` | off | Seed `/lawyer-plans/` page |
| `justice_theme_enable_lawyer_registration_page_seed` | off | Seed `/lawyer-registration/` page |
| `justice_theme_enable_pillar_page_draft_seed` | off | Seed pillar page drafts |
| `justice_theme_enable_legacy_eeat_auto_injection` | off | (do NOT enable — legacy registry) |
| `justice_theme_enable_maya_slug_redirect` | off | Maya profile slug canonical redirect |
| `uje_enable_rest_content_writes` | off | Allow REST content POST writes |
| `uje_enable_agent_bridge_rest` / `_file_write` | off | Legacy agent file-write bridge (leave off) |

To enable a flag, add `add_filter('<flag>','__return_true');` in a theme include, push, pull,
load wp-admin once. To make it a one-shot, the routine sets a `get_option(... _done)` guard.

---

## 4. Google Search Console access

GSC is how we get real query/impression/position data and verify ranking movement.

- **Property:** `https://jus-tice.co.il/` (owner-verified; siteOwner permission confirmed).
- **Tooling:** `tools/gsc/` — Node scripts using the `googleapis` OAuth flow.
  - `oauth-client.json` — the OAuth *client* (client_id + client_secret). Project `jus-tice-theme`.
  - `gsc-token.json` — the *user* token (access + **refresh_token**). **gitignored**, so a fresh
    clone will NOT have it; the owner provides/refreshes it. The refresh_token is long-lived;
    the access_token is refreshed programmatically before each pull.
  - Refresh pattern (what every script does): POST the refresh_token to
    `https://oauth2.googleapis.com/token` with the client_id/secret, grant_type=refresh_token →
    get a fresh access_token → call `https://www.googleapis.com/webmasters/v3/sites/<SITE>/searchAnalytics/query`.
- **Useful scripts:** `gsc-pull.js` (standard pull → `reports/gsc/`), `gsc-pull-extended.js`,
  `gsc-mirror-master.js` (16-month deep mirror), `analyze-clusters.js`, the per-cluster
  exporters (`gsc-criminal-export.js`, etc.). Run with `node tools/gsc/<script>.js` from the
  repo root after `npm i googleapis` in `tools/gsc/`.
- **Scope is read-only** (`webmasters.readonly`) — GSC is for measurement, not changes.

> If `gsc-token.json` is missing (fresh container), the owner must paste it or re-run the
> browser OAuth consent once on a machine with a browser (`node gsc-pull.js` opens it). There
> is no headless way around Google's consent for a desktop OAuth client.

---

## 5. Verify & roll back

**Verify a content/Yoast change:** fetch the page and check the rendered `<title>`, the
`<meta name="description">`, the reviewer box at article bottom, and any FAQ JSON-LD:
```
curl -s https://jus-tice.co.il/criminal-defense-attorney/ | grep -E '<title>|name="description"|FAQPage'
```

**Roll back a pillar body:** the previous body is stored in the page's `legacy_pillar_content`
meta. Restore it via wp-admin or a REST `update-meta`/post-update call. To roll back theme
code: `git revert <sha>`, push, pull. The pre-content-overhaul main is also tagged on branch
`backup/main-before-melt-2026-06-09`.

---

## 6. Standing rules (owner-set — do not violate)

- **No "evil URLs":** never create new slugs, `-2`/`-3` suffixes, or redirects without explicit
  per-URL owner approval. Render-layer changes (titles, meta, internal links, breadcrumbs,
  schema) are fine; URL changes are not.
- **No em-dashes, no AI-teller phrasing** in any published copy.
- **Titles reverse-engineer the live SERP** (head keyword first + one SERP-vocabulary trust
  word); never invented marketing slogans. See `project-control/gsc-strict-2026-06-09/TITLE-BLUEPRINT-from-SERP.md`.
- **E-E-A-T is real or absent — never fabricated.** Author/reviewer = only real, consenting,
  licensed people. The site legal reviewer is Adv. Ben Betesh (bottom of articles); Maya
  Rotenberg reviews family-law. A fabricated attorney ("Sharon Nahari") was removed — do not
  reintroduce named people without real credentials.
- **Owner appears at the BOTTOM of articles**, never the top.
- **Every PHP file lints** (`php -l`) before push. Bump the deploy marker every deploy.
- **Verify live after every uPress pull.**

---

## 7. Current state at handoff (commit aa7c6463)

Live/deployable now: 11-cluster hub-spoke map driving nav+footer+breadcrumbs; SERP-matched
pillar titles; GSC-derived cannibalization map; E-E-A-T reviewer engine with real Bar data
(gated, activates on the data already filled in); 5 pillar bodies (~21k Hebrew words) queued
to auto-publish on the next admin load; FAQPage schema; the `/adv-ben-betesh/` bio page.

Open queue (awaiting owner): 4 dead URLs with GSC history (restore vs 301), em-dash/emoji
sweep across ~90 pages, `lorem` on `/real-estate-appraiser/`, `/israeli-labor-law/` thin page,
Maya trailing-slash canonical. See `project-control/cannibalization-route-plan-2026-06.md`.
