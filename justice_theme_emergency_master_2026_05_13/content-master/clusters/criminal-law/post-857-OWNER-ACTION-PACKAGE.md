# Post 857 — Owner Action Package
## עורך דין פלילי | Update Existing Pillar — `/criminal-defense-attorney/`

Date prepared: 2026-05-13
Prepared by: claude-agent
Status: PASTE-READY — awaits owner action in wp-admin

---

## VERIFICATION COMPLETE

| Check | Status |
|---|---|
| Post ID 857 exists | YES — verified via WP REST |
| Current URL | `http://jus-tice.co.il/criminal-defense-attorney/` |
| Current status | `publish` |
| Current slug | `criminal-defense-attorney` (KEEP — DO NOT CHANGE) |
| Current title | `עורך דין פלילי | עו"ד פלילי | משרדי עורכי דין פליליים` |
| Current modified date | 2025-09-14 |
| Current content length | 69,927 chars |
| H2 sections in current content | **0** (uses bold paragraphs — bad for SEO) |
| Internal notes in current content | NONE — content is clean |
| Best pillar candidate | YES — confirmed (62,561 imp, primary keyword in title already) |
| `/criminal-lawyer/` redirect | 301 → homepage (DO NOT change today) |
| Old content backed up | YES |

### Backups
- `backups/post-857-backup-2026-05-13.json` — full WP REST response
- `backups/post-857-old-content-2026-05-13.html` — original content body
- `backups/post-857-old-title-2026-05-13.txt` — original title

---

## OWNER ACTION — STEP-BY-STEP

### Step 1: Open the post in wp-admin
Go to: `https://jus-tice.co.il/wp-admin/post.php?post=857&action=edit`

### Step 2: Update the TITLE field
**OLD:** `עורך דין פלילי | עו"ד פלילי | משרדי עורכי דין פליליים`
**NEW:** `עורך דין פלילי`

(The H1 should be clean — the long pipe-separated title hurts CTR. The full SEO title with brand goes in Rank Math/Yoast meta title field — see Step 4.)

### Step 3: Update the CONTENT
1. Switch the editor to **Text/HTML mode** (not Visual)
2. **DELETE** all current content
3. **PASTE** the entire contents of: `post-857-NEW-content-paste-ready.html`
4. Switch back to Visual mode briefly to verify rendering, then back to Text mode if you need to tweak

### Step 4: Update SEO META (Rank Math or Yoast — whichever is installed)
- **SEO Title:** `עורך דין פלילי | חקירה, מעצר, כתב אישום ורישום פלילי | Jus-Tice`
- **Meta Description:** `מדריך מעשי בנושא עורך דין פלילי: חקירה במשטרה, זכויות נחקר, מעצר, כתב אישום, רישום פלילי ומתי כדאי לפנות לייעוץ משפטי.`
- **Focus keyword:** `עורך דין פלילי`

### Step 5: DO NOT TOUCH
- ❌ DO NOT change the slug (`criminal-defense-attorney` — must stay)
- ❌ DO NOT change the URL
- ❌ DO NOT change the post type
- ❌ DO NOT change the practice-area taxonomy assignment
- ❌ DO NOT change the published date
- ❌ DO NOT add/remove redirects
- ❌ DO NOT bulk-edit any other posts

### Step 6: Preview before publishing
1. Click "Preview Changes" (top right)
2. Check desktop: H1 visible? All 38 H2 sections render? FAQ visible? Disclaimer + CTA box render at bottom?
3. Check mobile (phone or DevTools mobile view): readable in RTL Hebrew? Tap targets work?
4. Verify internal links work — click 2-3 random links in the preview
5. Verify disclaimer block is visible at bottom

### Step 7: Update (publish)
Click "Update" — the article is already published, so this just updates the content. No new URL, no redirect, no slug change.

### Step 8: After publishing — submit to GSC
1. Open Google Search Console
2. Use "URL Inspection" → enter `https://jus-tice.co.il/criminal-defense-attorney/`
3. Click "Request Indexing"
4. This signals Google to re-crawl the updated content faster (typically 1-7 days vs 2-4 weeks)

### Step 9: Monitor (Day 7 + Day 30)
Track these in GSC:
- Impressions on `/criminal-defense-attorney/` (was 62,561 over 12m)
- CTR (was 0.02% — target: >1% within 30 days)
- Position (was 56.4 — target: 30-40 within 60-90 days)
- Top queries (should expand beyond "עורך דין פלילי" to include חקירה, מעצר, etc.)

---

## INTERNAL LINKS INCLUDED IN THE NEW CONTENT (all verified live)

The new content links TO these existing pages:
- `/police-investigation/` (HTTP 200 ✓)
- `/pretrial-detention/` (HTTP 200 ✓)
- `/indictment/` (HTTP 200 ✓)
- `/drug-offenses/` (HTTP 200 ✓)
- `/lawyers/?area=criminal-law` (HTTP 200 ✓)

**None of these support pages are being modified.** Only post 857 is touched.

---

## WHAT IS *NOT* HAPPENING

- ❌ No redirect changes
- ❌ No slug changes
- ❌ No URL migrations
- ❌ No deletions
- ❌ No merges
- ❌ No edits to the 8 DO_NOT_TOUCH high-traffic URLs
- ❌ No edits to the 7 cannibalizing URLs (marked NEEDS_REWRITE_OR_MERGE_REVIEW for later)
- ❌ No edits to other 137 Criminal Law articles
- ❌ No edits to any non-Criminal-Law content
- ❌ No bulk imports
- ❌ No new plugin activations

---

## CANNIBALIZING PAGES — MARKED FOR LATER REVIEW (DO NOT TOUCH NOW)

These pages compete with the pillar but will NOT be touched today:
- `/famous-criminal-defense-lawyer/` → tag: `NEEDS_REWRITE_OR_MERGE_REVIEW` + `HIGH_RISK_LANGUAGE` (fake-ranking title)
- `/leading-criminal-law-firm/` → tag: `NEEDS_REWRITE_OR_MERGE_REVIEW` + `HIGH_RISK_LANGUAGE`
- `/best-criminal-defence-lawyers-worldwide/` → tag: `NEEDS_REWRITE_OR_MERGE_REVIEW` + `HIGH_RISK_LANGUAGE`
- `/lawyer-near-me-criminal-law/` → tag: `OWNER_REVIEW_REQUIRED`
- `/criminal-law/` → tag: `OWNER_REVIEW_REQUIRED` (verify if category or article)
- `/everything-you-need-to-know-about-becoming-a-criminal-lawyer/` → tag: `OWNER_REVIEW_REQUIRED` (wrong intent)

Documented in: `criminal-law-cannibalization-strategy.md` for future cycle.

---

## ROLLBACK PLAN

If the update causes issues:

1. Go to: `https://jus-tice.co.il/wp-admin/revision.php?revision=<latest_id>` (WordPress automatically saves a revision before update)
2. OR manually paste back the old content from: `backups/post-857-old-content-2026-05-13.html`
3. Restore old title from: `backups/post-857-old-title-2026-05-13.txt`
4. Click "Update"

The URL stays the same in all cases — no risk of broken links or lost rankings.

---

## FILES IN THIS PACKAGE

| File | Purpose |
|---|---|
| `post-857-OWNER-ACTION-PACKAGE.md` | This file — step-by-step instructions |
| `post-857-NEW-content-paste-ready.html` | The new content to paste into WP editor (Text mode) |
| `backups/post-857-old-content-2026-05-13.html` | Backup of current content body |
| `backups/post-857-old-title-2026-05-13.txt` | Backup of current title |
| `backups/post-857-backup-2026-05-13.json` | Full backup (REST response) |
