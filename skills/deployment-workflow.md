# Deployment Workflow — Jus-Tice

## Standard Deployment Flow

### 1. Code Changes (Developer)
```
# Edit files in justice-theme/
git add -A
git commit -m "type: description"
git push origin main
```

### 2. Owner Actions (uPress)
1. Log into uPress dashboard
2. Pull latest commit from GitHub
3. Go to WP Admin → Settings → Permalinks → Save (flush rewrite rules)
4. Clear ALL caches:
   - SG Optimizer (if active)
   - WP-Optimize → Cache → Clear all
   - Autoptimize → Settings → Delete cache
5. Verify the site loads correctly

### 3. Post-Deploy Verification
- Check `/wp-json/justice/v1/sitemap` returns valid XML
- Check `robots.txt` contains correct sitemap URL
- Check key pages load without errors
- Check Yoast meta tags appear in HTML source

## Commit Message Convention
```
type: description

- detail 1
- detail 2
```

Types:
- `feat:` — New feature
- `fix:` — Bug fix
- `chore:` — Cleanup, refactoring, documentation
- `content:` — New content/articles

## Key REST API Endpoints
| Endpoint | Auth | Purpose |
|----------|------|---------|
| `/wp-json/wp/v2/articles` | App Password | CRUD articles |
| `/wp-json/wp/v2/practice-areas` | App Password | Taxonomy terms |
| `/wp-json/justice/v1/sitemap` | Public | Sitemap index |
| `/wp-json/justice/v1/sitemap/articles` | Public | Articles sitemap |

## Git Repository
- Remote: `https://github.com/The-new-ben/justice-theme.git`
- Branch: `main`
- Theme path on server: `wp-content/themes/justice-theme/`

## Emergency Checklist
If the site breaks after deploy:
1. Check PHP errors: WP Admin → Tools → Error Log (via plugin)
2. Check if theme is active: `/wp-json/` should return API
3. Check robots.txt: `https://jus-tice.co.il/robots.txt`
4. Check sitemap: `https://jus-tice.co.il/wp-json/justice/v1/sitemap`
5. If critical: revert via `git revert HEAD && git push`
