# Project Execution Guide — Jus-Tice Legal Portal
# Last updated: 2026-05-09

---

## Core Principle

**Do not guess. Do not claim success without verification. Label everything.**

Labels in use:
- `VERIFIED:` — tested and confirmed on live server
- `NOT VERIFIED:` — code written, not yet confirmed live
- `FAILED:` — attempted and confirmed broken
- `ASSUMPTION:` — logical inference, not tested
- `BLOCKED:` — access or tooling issue prevents progress
- `RISK:` — action could break something if done wrong

---

## Working Hierarchy

### 1. Code (primary)
Write PHP, CSS, JS locally → validate → ZIP → upload.

### 2. REST API (inspection and controlled writes)
After plugin is active, use REST tools to inspect/modify content.

### 3. File Upload (only when needed)
Upload ZIPs via wp-admin only after local validation.

### 4. Browser (visual verification only)
Use browser only to verify rendered output after code changes.

---

## Task Workflow

```
1. Read project-control/current-status.md
2. Read project-control/next-actions.md
3. Pick ONE task
4. Update task-board.csv: set status = IN_PROGRESS
5. Write the smallest useful code change
6. Validate locally (PHP lint, zip structure check)
7. Upload to live site
8. Verify via REST or browser
9. Update changelog.md
10. Update current-status.md
11. Update task-board.csv: status = DONE or FAILED
12. Update next-actions.md
13. Continue to next task
```

---

## Plugin Deployment Workflow

```
1. Make changes to justice-core/ locally
2. Run: .\build.ps1 (validates + creates justice-core.zip)
3. Upload: https://jus-tice.co.il/wp-admin/update.php?action=upload-plugin
4. Select "Replace current with uploaded"
5. Activate
6. Call: GET /wp-json/justice-core/v1/health
7. Verify response: ok=true, plugin_version=4.0.0
8. Log in changelog.md
```

## Theme Deployment Workflow

```
1. Make changes to justice-theme/ locally
2. Run: .\build.ps1 (validates + creates justice-theme.zip)
3. Upload: https://jus-tice.co.il/wp-admin/update.php?action=upload-theme
4. Select "Replace current with uploaded"
5. Activate
6. Visit https://jus-tice.co.il/ in browser
7. Verify no PHP errors, correct layout
8. Call: GET /wp-json/justice-core/v1/theme-state
9. Verify active_theme matches
10. Log in changelog.md
```

---

## REST API Access Pattern

Base URL: `https://jus-tice.co.il/wp-json/justice-core/v1/`

Auth: WordPress Application Password
- Go to /wp-admin/profile.php → Application Passwords → Create
- Use: `Authorization: Basic base64(username:app_password)`

### Key Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /health | Verify plugin active, CPTs, counts |
| GET | /theme-state | Active theme + plugin list |
| GET | /content/lawyers | List all lawyers |
| GET | /content/posts | List all posts (pass ?status=any) |
| GET | /content/leads | List all CRM leads |
| GET | /reports/spam | Find casino/gambling content |
| GET | /reports/duplicates | Find duplicate titles |
| GET | /reports/users | List WP users |
| GET | /reports/cron | Inspect cron jobs |
| GET | /reports/plugins | List all plugins + active status |
| GET | /reports/log | Read action log |
| POST | /content/update-meta | Update whitelisted post meta |
| POST | /content/trash-post | Move post to trash (logged) |
| POST | /seed-lawyers | Run CSV seeder |
| POST | /seed-reset | Clear auto-seed flag |

---

## File Change Log Format

Every edit to changelog.md must follow:

```markdown
## 2026-05-09 — [component] v[version]
- ACTION: what happened
- FILES: which files changed
- VERIFICATION: VERIFIED / NOT VERIFIED / FAILED
- NOTES: anything unusual
```

---

## Never Do These

- [ ] Do NOT edit live files directly through File Manager for anything more than emergency hotfix
- [ ] Do NOT run UPDATE/DELETE SQL without explicit user approval
- [ ] Do NOT create arbitrary PHP execution endpoints
- [ ] Do NOT claim "done" without verifying
- [ ] Do NOT activate two plugins that register the same CPT/taxonomy
- [ ] Do NOT create a ZIP with wrong folder structure
- [ ] Do NOT ignore PHP lint errors before uploading
