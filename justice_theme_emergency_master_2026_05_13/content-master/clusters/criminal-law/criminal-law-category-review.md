# Criminal Law Category / Practice-Area Page Review
**Reviewed**: 2026-05-15
**URL**: https://jus-tice.co.il/criminal-law/
**Type**: practice-areas taxonomy archive (term ID 170, slug: criminal-law)
**Template**: taxonomy-practice-areas.php (or archive.php fallback)
**Articles**: 143
**Status**: GOOD — professional hub, needs minor improvements

---

## Page Identity
- **Taxonomy**: `practice-areas` (NOT WordPress `category`)
- **Term ID**: 170
- **Slug**: `criminal-law`
- **Name**: משפט פלילי
- **Description**: 238 chars (Hebrew)
- **URL**: `/criminal-law/` (bare slug, no `/practice-areas/` prefix — Permalink Manager Pro)
- **HTTP Status**: 200 ✅

### Category Duplication Issue
WordPress `category` term ID **730** also has slug `criminal-law` with 18 articles.
- `/practice-areas/criminal-law/` → 301 redirect (nginx)
- `/category/criminal-law/` → 301 redirect
- **Only `/criminal-law/` works** (200) — this is the practice-areas archive
- **Action needed**: Map the 18 category-730 articles into practice-areas-170 (append, don't remove category yet)

---

## Content & Layout Assessment

### ✅ What works well
- **H1**: `משפט פלילי` — correct, single H1
- **Hero section**: Dark, professional, with intro text explaining criminal law scope
- **Intro text**: Covers חקירה במשטרה, זכויות נחקר, מעצר, כתב אישום, רישום פלילי
- **Disclaimer**: Present — info is general, not a substitute for legal advice
- **Lawyer cards**: Sharon Nahari card appears with CTA buttons (View Profile, Call, WhatsApp)
- **Article grid**: Clean cards with title, date, reading time, "Read More" CTA
- **Pagination**: Present at bottom
- **RTL**: Fully correct
- **Mobile**: Responsive layout
- **Breadcrumbs**: `עמוד הבית / תחומי משפט / משפט פלילי`
- **CTA**: Sticky WhatsApp button + Tawk.to chat widget
- **Professional feel**: Not spammy, well-structured

### ⚠️ Improvements needed
- **No meta description**: Yoast doesn't output description for taxonomy archives by default — configure in Yoast settings
- **JSON-LD**: 3 blocks — need to audit for duplicate schema (Yoast + Schema plugin + theme)
- **Breadcrumb label**: "תחומי משפט" links to `/lawyers/` — should link to a practice-areas hub page instead
- **Internal links to pillar**: No visible link to the Criminal Law pillar article (עורך דין פלילי)
- **Support topic links**: No visible links to specific support articles (חקירה במשטרה, מעצר, etc.)
- **Category 730 articles**: 18 articles are in the wrong taxonomy — need to add practice-areas:170

### ❌ Issues to fix
1. Yoast meta description for this taxonomy archive
2. Schema duplication audit (3 JSON-LD blocks)
3. Internal links from category page to pillar + support pages
4. Map category-730 articles into practice-areas-170

---

## SEO Technical State

| Signal | Status | Notes |
|--------|--------|-------|
| Canonical | ✅ 1 tag | Fixed (was 3 before Yoast migration) |
| Description | ⚠️ Missing | Need Yoast taxonomy archive meta desc |
| H1 | ✅ Correct | Single, descriptive |
| OG tags | ⚠️ Not checked | Need to verify Yoast outputs for archives |
| Schema | ⚠️ 3 blocks | May have duplicates |
| Breadcrumbs | ✅ Present | Minor: parent links to /lawyers/ |
| Sitemap | ✅ | URL in REST sitemap taxonomies sub-sitemap |
| Internal links | ⚠️ Weak | Need pillar + support page links |

---

## Recommended Intro Text Improvement
Current intro is good. Suggested enhanced version:

```
משפט פלילי עוסק במצבים שבהם אדם נחקר, חשוד, נאשם או מורשע בעבירה פלילית.
בעמוד זה ריכזנו מדריכים ומידע כללי על חקירה במשטרה, זכויות נחקר, מעצר,
כתב אישום, רישום פלילי ותחומי ייצוג נפוצים.

נושאים מרכזיים: חקירה במשטרה | זכויות נחקר | מעצר | כתב אישום | שימוע |
רישום פלילי | מחיקת רישום פלילי | עבירות סמים | עבירות מין | צווארון לבן

המידע באתר הוא כללי ואינו מחליף ייעוץ משפטי פרטני.
```

---

## Next Actions
1. Configure Yoast meta description for criminal-law taxonomy archive
2. Audit 3 JSON-LD blocks for duplicates
3. Add internal links to pillar article from this page
4. Map category-730 articles to practice-areas-170
5. Consider adding sub-topic section with links to support articles
