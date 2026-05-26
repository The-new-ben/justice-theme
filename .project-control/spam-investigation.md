# Spam / Casino Content Investigation — Jus-Tice.co.il
**Date:** 2026-05-09  
**Status:** INVESTIGATION PLAN — actual database queries NOT VERIFIED (no live site access)  
**Priority:** CRITICAL — casino/gaming content appearing on homepage destroys site credibility and risks Google penalties

---

## 1. PROBLEM STATEMENT

Casino/gaming/spam content is visible on the homepage. This is:
- A **Google Spam Policy violation** if it's injected content
- A **YMYL trust killer** — legal sites with gambling links are penalized
- A **sign of possible site compromise** or rogue plugin
- **Blocking any SEO progress** — Google sees a legal site with casino links as low-quality or hacked

---

## 2. MOST LIKELY ROOT CAUSES (Priority Order)

### CAUSE A: Spam `post` posts published (MOST LIKELY)

The `latest-articles.php` section queries BOTH `articles` CPT and `post` post type:
```php
'post_type' => array( 'articles', 'post' ),
```

If spam/casino posts were created as regular WordPress Posts, they will appear in this query.

**Immediate mitigation (safe, no data loss):**  
Change `latest-articles.php` to only query `articles` CPT:
```php
'post_type' => array( 'articles' ),
```
This removes spam posts from the homepage immediately without deleting anything.

**Verify with WP-CLI:**
```bash
wp post list --post_type=post --post_status=publish --format=table --fields=ID,post_title,post_author,post_date
```
Look for: titles in foreign languages (Russian, Chinese, Arabic), casino-themed titles, URLs/domains in titles.

### CAUSE B: Homepage is a Page with spam content (MEDIUM LIKELIHOOD)

If the homepage is set to a static Page (e.g., Page ID 38), that page may contain spam content in its body.

**Check:**
```bash
wp option get page_on_front
wp post get {PAGE_ID} --fields=post_content | head -50
```

### CAUSE C: Widget area with spam HTML (MEDIUM LIKELIHOOD)

Old widgets may contain spam HTML, iframes, or JavaScript that injects casino content.

**Check:**
```bash
wp option get widget_text --format=json
wp option get sidebars_widgets --format=json
```

Look for: base64-encoded content, iframe src pointing to gambling domains, JavaScript with external URLs.

### CAUSE D: Auto-blogging or RSS import plugin (MEDIUM LIKELIHOOD)

A plugin may be importing posts from an external RSS feed that contains spam.

**Check:**
```bash
wp plugin list --status=active
wp cron event list
```

Look for: any plugin with "import", "auto-blog", "RSS", "feed", "syndication" in the name.

### CAUSE E: Compromised admin user or additional admin (MEDIUM LIKELIHOOD)

An unauthorized user may have admin access and is publishing spam.

**Check:**
```bash
wp user list --role=administrator --format=table
wp user list --role=editor --format=table
```

Look for: usernames or email addresses you don't recognize.

### CAUSE F: Malicious plugin injecting content (LOWER LIKELIHOOD)

A plugin may be injecting content via `the_content` filter or a widget hook.

**Check:**
```bash
grep -r "casino\|gambling\|poker\|slots\|betting" /wp-content/plugins/
grep -r "eval\|base64_decode\|gzinflate" /wp-content/plugins/
```

### CAUSE G: Hacked theme file (LOWER LIKELIHOOD — theme is clean in repo)

**Check:**
```bash
diff -r /wp-content/themes/justice-theme/ {local-clean-copy}
grep -r "eval\|base64_decode" /wp-content/themes/justice-theme/
```

---

## 3. INVESTIGATION CHECKLIST

Execute in this order (from least destructive to most):

```bash
# Step 1: Count suspicious posts
wp post list --post_type=post --post_status=publish --format=count
wp post list --post_type=articles --post_status=publish --format=count

# Step 2: List all recent posts (both types) with author and date
wp post list \
  --post_type=post \
  --post_status=publish \
  --orderby=post_date \
  --order=DESC \
  --fields=ID,post_title,post_author,post_date \
  --format=table \
  --posts_per_page=50

# Step 3: Check admin users
wp user list --role=administrator --format=table

# Step 4: Check active plugins for suspicious names
wp plugin list --status=active --format=table

# Step 5: Check scheduled cron jobs
wp cron event list --format=table

# Step 6: Check widgets
wp option get widget_text

# Step 7: Check homepage setting
wp option get page_on_front
wp option get show_on_front

# Step 8: Search for casino keywords in DB
wp db query "SELECT ID, post_title, post_type, post_status, post_author FROM wp_posts WHERE post_content LIKE '%casino%' OR post_content LIKE '%gambling%' OR post_title LIKE '%casino%' LIMIT 50"

# Step 9: Check for spam in options/widgets
wp db query "SELECT option_name, option_value FROM wp_options WHERE option_value LIKE '%casino%' LIMIT 20"
```

---

## 4. SAFE CLEANUP PROTOCOL

**DO NOT delete anything without first mapping it. Document before destroying.**

### Step 1: Export list of spam posts to CSV
```bash
wp post list --post_type=post --post_status=publish \
  --fields=ID,post_title,post_author,post_date,post_modified \
  --format=csv > spam-posts-export.csv
```

### Step 2: Trash (not delete) suspicious posts
```bash
# Trash single post by ID
wp post delete {POST_ID} --force=false

# Or mass trash all regular Posts (if ALL posts are spam)
wp post list --post_type=post --post_status=publish --format=ids | xargs wp post delete --force=false
```

### Step 3: Verify homepage no longer shows spam
Test: load homepage, check hero stats, check latest-articles section.

### Step 4: Revoke compromised user access
```bash
wp user set-role {USER_ID} subscriber
# Or delete completely
wp user delete {USER_ID} --reassign={ADMIN_ID}
```

### Step 5: Deactivate + delete suspicious plugin
```bash
wp plugin deactivate suspicious-plugin
wp plugin delete suspicious-plugin
```

### Step 6: Change all admin passwords
```bash
wp user update {ADMIN_ID} --user_pass="NEW_STRONG_PASSWORD"
```

### Step 7: Install Wordfence and run full scan
This will detect malware injections, backdoors, and file modifications.

---

## 5. PREVENTION GOING FORWARD

1. **Limit `latest-articles.php` to `articles` CPT only** — isolates legal content from regular posts
2. **Restrict post creation** — remove Editor role from lawyer users; lawyers should only edit their own profile
3. **Disable XML-RPC** if not used (common attack vector):
   ```php
   add_filter( 'xmlrpc_enabled', '__return_false' );
   ```
4. **Enable WP Rocket / Wordfence** for file monitoring
5. **Audit plugin list** — remove any plugin you don't recognize or didn't install
6. **Two-factor authentication** on all admin accounts
7. **WP admin URL change** — move from `/wp-admin` to a custom path (Wordfence or custom code)

---

## 6. OUTPUT FILES TO CREATE AFTER INVESTIGATION

Once live site access is available, populate:
- `project-control/spam-candidates.csv` — list of suspect posts with ID, title, author, date, action
- `project-control/suspicious-users.csv` — list of users with unusual roles or unknown origin

### spam-candidates.csv Template
```
id,post_type,post_title,post_author,post_date,post_status,has_casino_content,action
```

### Action values
- `TRASH` — move to trash, review before permanent delete
- `KEEP` — legitimate post, keep
- `INVESTIGATE` — needs manual review
- `DELETE_IMMEDIATELY` — confirmed spam, delete
