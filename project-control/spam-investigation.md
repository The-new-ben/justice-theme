# Spam / Casino Content Investigation
# Jus-Tice Legal Portal
# Status: OPEN — investigation in progress
# Last updated: 2026-05-09

---

## Problem Statement

The homepage of jus-tice.co.il is displaying casino/gaming spam posts or content.

**Status:** NOT VERIFIED what exact mechanism is responsible.  
**Risk:** HIGH — destroys brand credibility, risks Google penalty.

---

## Investigation Checklist

### Phase 1 — What content exists?

- [ ] Run REST: `GET /wp-json/justice-core/v1/reports/spam` — find all posts with casino/gambling terms
- [ ] Check which `post_type` the spam posts are: `post`, `page`, `articles`, custom?
- [ ] Check which `post_author` created them and when
- [ ] Check `post_status`: published, draft, scheduled?
- [ ] Inspect the homepage template (`front-page.php`) — what query does it use?
- [ ] Does the homepage use `WP_Query` or `query_posts`?
- [ ] Are there any shortcodes like `[display-posts]` or `[recent-posts]`?

### Phase 2 — How does it appear?

- [ ] Is it in the main content area or a sidebar widget?
- [ ] Is it injected via a menu?
- [ ] Is it in a page block (Gutenberg block)?
- [ ] Is it in a text widget?
- [ ] Is it in a PHP include that's hardcoded?
- [ ] Is it coming from an RSS/feed import plugin?
- [ ] Is it in a custom homepage section that renders `post` type by default?

### Phase 3 — How was it created?

- [ ] Run REST: `GET /wp-json/justice-core/v1/reports/users` — are there unknown admin users?
- [ ] Run REST: `GET /wp-json/justice-core/v1/reports/cron` — suspicious cron jobs?
- [ ] Run REST: `GET /wp-json/justice-core/v1/reports/options-suspect` — suspicious wp_options?
- [ ] Run REST: `GET /wp-json/justice-core/v1/reports/plugins` — any unknown import plugins?
- [ ] Is there a WP All Import, RSS Aggregator, or Auto Post Scheduler plugin active?
- [ ] Check wp_posts for `post_modified` dates on spam posts — were they created in a batch?
- [ ] Check `post_name` (slugs) of spam posts — do they match casino SEO patterns?

### Phase 4 — Has the site been compromised?

- [ ] Are there unknown admin users (user_login that doesn't match the owner)?
- [ ] Are there PHP files with encoded content in theme/plugin folders?
- [ ] Is `debug.log` available? Does it show suspicious PHP includes?
- [ ] Check if the site's backup (the 3.5GB ZIP) contains spam posts — if so, this is a long-standing issue

---

## SQL Queries to Run (READ ONLY)

Run these via phpMyAdmin or a secured DB tool:

```sql
-- Find all casino/gambling posts
SELECT ID, post_author, post_date, post_modified, post_status, post_type, post_title, post_name
FROM wp_posts
WHERE post_title LIKE '%casino%'
   OR post_title LIKE '%gaming%'
   OR post_title LIKE '%gambling%'
   OR post_title LIKE '%slot%'
   OR post_title LIKE '%poker%'
   OR post_content LIKE '%casino%'
   OR post_content LIKE '%gambling%'
ORDER BY post_modified DESC
LIMIT 200;
```

```sql
-- Find all users (check for unknowns)
SELECT ID, user_login, user_email, user_registered
FROM wp_users
ORDER BY user_registered DESC;
```

```sql
-- Find suspicious cron / feed options
SELECT option_name, LENGTH(option_value) AS value_size
FROM wp_options
WHERE option_name LIKE '%feed%'
   OR option_name LIKE '%import%'
   OR option_name LIKE '%casino%'
ORDER BY value_size DESC
LIMIT 100;
```

```sql
-- Count posts by type and status
SELECT post_type, post_status, COUNT(*) AS count
FROM wp_posts
GROUP BY post_type, post_status
ORDER BY count DESC;
```

```sql
-- Find posts created by author ID 1 with gaming terms
SELECT ID, post_title, post_date, post_status
FROM wp_posts
WHERE post_author = 1
  AND (post_title LIKE '%casino%' OR post_title LIKE '%game%')
LIMIT 100;
```

---

## Hypothesis (ASSUMPTION — not verified)

**Most likely cause:** The site was previously a general blog running on the default `post` type. The homepage (or an archive page) likely shows recent `post` type entries without filtering by category. The "casino" content is old blog posts from before the legal portal pivot.

**Second hypothesis:** An RSS/feed import plugin was installed at some point and created spam posts automatically.

**If confirmed:** The fix is to either:
1. Trash/delete the spam `post` type entries, OR
2. Change the homepage query to show only `articles` CPT (not `post`), OR
3. Set the casino posts to `draft` status

---

## Files to Output

After running REST inspection:
- `project-control/spam-candidates.csv` — list of found posts with IDs and titles
- `project-control/duplicate-titles.csv` — list of duplicate content

DO NOT DELETE anything before reviewing the reports.

---

## Verification Status

NOT VERIFIED — investigation not yet run on live server.
