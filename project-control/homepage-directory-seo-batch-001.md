# Homepage + Directory SEO Batch 001

Date: 2026-05-10  
Status: CODE FIXED - NOT LIVE VERIFIED  
Scope: no URL changes, no redirects, no public content publication, no CMS/database edits.

## Goal

Improve the homepage and lawyer-directory SEO structure without risking URL migration damage.

This batch is intentionally conservative. It strengthens visible crawlable links from the homepage/header to major legal topics, but it does not force visitors into planned pillar URLs that currently redirect to the homepage.

## Live Verification Before Code Change

LIVE VERIFIED:
- Homepage returns 200.
- `/lawyers/` returns 200.
- `/divorce-lawyer/`, `/family-law/`, `/criminal-law/`, `/medical-malpractice-lawyer/`, `/personal-injury-law/`, `/traffic-lawyer/`, and `/inheritance/` return 200.

LIVE VERIFIED BLOCKER:
- `/criminal-lawyer/` returns 301 to homepage.
- `/real-estate-lawyer/` returns 301 to homepage.
- `/personal-injury-lawyer/` returns 301 to homepage.
- `/traffic-law/` returns 301 to homepage.
- `/employment-lawyer/` returns 301 to homepage.
- `/inheritance-lawyer/` returns 301 to homepage.

Current live homepage export:
- Title: `עורכי דין מומלצים אינדקס | חיפוש עורך דין ומשרדי עורכי דין | עו"ד מומלץ`
- H1: `צריכים עורך דין או הכוונה משפטית? התחילו כאן`
- Meta: `מחפשים עורך דין? פורטל Jus-Tice — מדריך עורכי דין מומחים בישראל לפי תחום ומיקום. מאמרים משפטיים, מדריכים מקצועיים, ופנייה חכמה לייצוג המשפטי המתאים.`

Current live `/lawyers/` export:
- Title: `עורכי דין Archive | Jus-Tice.co.il`
- H1: `מדריך עורכי דין בישראל`
- Meta: `מדריך עורכי הדין של Jus-Tice מציג פרופילים מאושרים בלבד, לפי תחום משפטי, עיר, ניסיון, שפות ודרכי פנייה. אין דירוג או המלצה ללא בסיס מאומת.`

## Code Changes

CODE FIXED:
- Added `justice_theme_public_path_is_published()` and `justice_theme_safe_public_link()` in `inc/template-tags.php`.
- Header topic strip now uses a shared topic-link array instead of hard-coded links.
- Header topic strip now includes all major homepage legal-intent links: divorce, criminal, real estate, medical malpractice, personal injury, traffic, employment, inheritance, and AI intake.
- Featured pillar cards now use safe primary/fallback URLs.
- Topic cluster headings and static supporting links now use safe primary/fallback URLs.

The safe-link rule:
- Use the clean planned English pillar URL only when WordPress has a published page/article at that path.
- Otherwise link to a working existing hub or filtered lawyer directory.
- Return full fallback URLs safely if already resolved.

## Not Changed

NOT EXECUTED:
- No slugs changed.
- No redirects added.
- No posts/pages/articles published.
- No internal content rewritten.
- No sitemap or robots rules changed.
- No wp-admin/menu/database work performed.

## Verification

VERIFIED:
- PHP lint passed locally for 127 PHP files.

NOT LIVE VERIFIED:
- Live header/topic-strip links require deployment/pull/cache refresh.
- Live homepage title and `/lawyers/` title still show legacy title issues until the newest code is served.
- Visual desktop/mobile verification is still required after deployment.

## Next Action

1. Pull/deploy latest repo code to live and clear cache.
2. Recheck homepage rendered links in public HTML.
3. Recheck `/lawyers/` title output to confirm the `Archive` leak is gone.
4. Recheck homepage mobile topic strip and pillar cards visually.
5. Continue GSC-informed title/H1/meta fixes without changing URLs.
