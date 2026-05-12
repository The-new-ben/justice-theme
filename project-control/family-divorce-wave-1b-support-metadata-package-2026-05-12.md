# Family / Divorce Wave 1B Support Metadata Package

Date: 2026-05-12
Status: VERIFIED PLANNING / REVIEW ONLY / NO PUBLIC CHANGES

This package defines the exact support-page metadata posture for the six Wave 1B Family/Divorce support pages. It is meant to keep support uploads controlled if owner approves them after the `/divorce-lawyer/` pillar.

It does not approve public upload, CMS import, title/H1/meta changes, redirects, canonicals, noindex, sitemap changes, taxonomy edits, related-card edits, schema edits, wp-admin settings or database writes.

## Scope

Wave 1B pages:
- `/consensual-divorce/`
- `/divorce-mediation/`
- `/divorce-property-division/`
- `/family-dispute-resolution/`
- `/child-support/`
- `/child-custody/`

Clean body files:
- `content-drafts/consensual-divorce-public-body-he.md` - `1,875` words
- `content-drafts/divorce-mediation-public-body-he.md` - `2,059` words
- `content-drafts/divorce-property-division-public-body-he.md` - `1,874` words
- `content-drafts/family-dispute-resolution-public-body-he.md` - `1,992` words
- `content-drafts/child-support-public-body-he.md` - `1,729` words
- `content-drafts/child-custody-public-body-he.md` - `1,693` words

Total clean support copy: `11,222` words.

## Live Metadata Snapshot

VERIFIED:
- All six support URLs returned `200`.
- All six support URLs self-canonicalized.
- Current live H1/title/meta signals are already broadly aligned with the intended support roles.

Decision:
- Do not rewrite support-page metadata just to change it.
- Preserve the current safe metadata unless owner requests a specific edit.
- If the clean body upload is approved, use the field values below as the approved baseline.

## Recommended Metadata By Page

| Page | H1 / SEO title direction | Meta description | Breadcrumb | Taxonomy |
|---|---|---|---|---|
| `/consensual-divorce/` | `גירושין בהסכמה: איך בונים הסכם שמחזיק לאורך זמן` | `מדריך לגירושין בהסכמה: מה צריך לכלול בהסכם, איך מזהים סיכונים, מה לבדוק לפני חתימה ומתי חשוב לערב עורך דין לענייני משפחה.` | `גירושין בהסכמה` | `family-law`, `divorce` |
| `/divorce-mediation/` | `גישור גירושין: מתי זה נכון, איך מתכוננים ומה חשוב לבדוק` | `מדריך לגישור גירושין: התאמת המסלול, הכנה לפגישות, גבולות הגישור, סיכונים, ילדים ורכוש, והנקודה שבה כדאי לערב עורך דין.` | `גישור גירושין` | `family-law`, `divorce` |
| `/divorce-property-division/` | `חלוקת רכוש בגירושין: נכסים, חובות, דירה, פנסיה ועסק משפחתי` | `מדריך לחלוקת רכוש בגירושין: מיפוי נכסים וחובות, דירה, פנסיה, עסק, מתנות, ירושות, הסכמים והכנה לפגישה עם עורך דין.` | `חלוקת רכוש בגירושין` | `family-law`, `divorce` |
| `/family-dispute-resolution/` | `יישוב סכסוך במשפחה: מה קורה לפני תביעה ומה צריך להכין` | `מדריך לתהליך יישוב סכסוך במשפחה: פתיחת הליך, הכנה לפגישה, מצבי דחיפות, קשר לגירושין בהסכמה ומתי צריך עורך דין.` | `יישוב סכסוך במשפחה` | `family-law` |
| `/child-support/` | `מזונות ילדים: מדריך מעשי לפני הסכם, תביעה או שינוי מצב` | `מדריך עומק בנושא מזונות ילדים: מסמכים, הוצאות, זמני שהות, מדור, שינוי נסיבות, אכיפה וסימנים שמצריכים ייעוץ משפטי.` | `מזונות ילדים` | `family-law`, `child-support` |
| `/child-custody/` | `משמורת ילדים וזמני שהות: איך מתכננים הסדר שמתאים לילדים` | `מדריך למשמורת ילדים, אחריות הורית וזמני שהות: לוחות זמנים, חגים, תקשורת בין הורים, מעבר מקום, סיכונים ומתי לפנות לעורך דין.` | `משמורת ילדים וזמני שהות` | `family-law`, `child-custody` |

Notes:
- The site/SEO layer may append `Jus-Tice` to the browser title.
- The H1 and title direction should not add "top", "recommended", "trusted", ratings, reviews or success claims.
- The descriptions should stay practical and informational.

## Related-Link Rules

All six pages may link back to:
- `/divorce-lawyer/`

Allowed sibling links after owner approval:
- `/consensual-divorce/`
- `/divorce-mediation/`
- `/divorce-property-division/`
- `/family-dispute-resolution/`
- `/child-support/`
- `/child-custody/`

Blocked from core related cards:
- city pages,
- ranking/recommended/trusted lawyer pages,
- Maya/profile/reputation links,
- review/rating pages,
- LegalTech/tool promises,
- old duplicate URLs,
- PDFs, DOCX files, calculators and case-law pages as cards.

## Schema And Trust Safety

Allowed:
- Safe WebPage/Article/Breadcrumb output only if it matches visible content.

Blocked:
- `Review`
- `AggregateRating`
- fake ratings
- fake review counts
- badges
- best/top/recommended/trusted lawyer claims
- success or outcome guarantees

## Upload Recommendation

RECOMMENDED:
- Keep Wave 1B public upload blocked until `/divorce-lawyer/` is approved or owner explicitly chooses a lower-risk support-first path.
- If support upload begins, consider `/consensual-divorce/` and `/divorce-mediation/` first because they are lower risk than child-support, custody and property division.

BLOCKED:
- No support metadata change is approved.
- No support body upload is approved.
- No redirect, canonical, noindex, sitemap or protected-asset decision is approved.
- GSC API remains required before URL migration or old-page retirement.
