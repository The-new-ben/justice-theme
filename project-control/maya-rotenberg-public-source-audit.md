# Maya Rotenberg Public Source Audit
Date: 2026-05-10

## Purpose
Build the Maya Rotenberg mini-site from public, reviewable sources without inventing facts, rankings, ratings, reviews, awards, bar numbers, photos, videos, or case achievements.

## VERIFIED IN REPO
- The lawyer profile template can now display a public-facing "מקורות ציבוריים" sidebox from CMS meta.
- A new live migration, `justice_theme_bootstrap_maya_rotenberg_public_sources()`, fills source fields only if they are empty.
- The migration is separate from the earlier mini-site bootstrap, so it can run on live installs where the first bootstrap already ran.
- The migration sets only source/reference fields and the official website/source URL if empty.
- The migration does not set phone, WhatsApp, email, bar number, awards, reviews, ratings, profile photo, plan status, or claimed case outcomes.

## PUBLIC SOURCES USED
| Source | URL | Use | Status |
|---|---|---|---|
| Official firm site | https://rotenberglaw.co.il/ | Primary public source for office identity and family-law positioning | SOURCE FOUND |
| Official about page | https://rotenberglaw.co.il/about | Public background/practice-area source | SOURCE FOUND |
| Dun's 100 profile | https://www.duns100.co.il/%D7%9E%D7%90%D7%99%D7%94_%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92_%D7%9E%D7%A9%D7%A8%D7%93_%D7%A2%D7%95%D7%A8%D7%9B%D7%99_%D7%93%D7%99%D7%9F | Public business profile source | SOURCE FOUND |
| Psakdin lawyer card | https://www.psakdin.co.il/Lawyers/2183 | Public Israeli lawyer-directory source | SOURCE FOUND |
| Easy listing | https://easy.co.il/en/page/26164262 | Public business listing source | SOURCE FOUND |
| Official press page | https://rotenberglaw.co.il/press-release | Public media/reference source from the firm site | SOURCE FOUND |

## CLAIMS NOT AUTO-PUBLISHED
- Specific case-achievement claims.
- "Leading", "best", "recommended", or ranking claims.
- Client reviews or testimonial claims.
- Years of experience as a public badge, unless Maya approves final wording.
- Phone/WhatsApp/email/address changes, because contact details must be owner/lawyer verified before marketing.

## LIVE STATUS
- CODE FIXED: source fields and visible source sidebox are implemented in repo.
- NOT VERIFIED LIVE: live WordPress must pull the latest GitHub commit and execute the migration.
- BLOCKED: final contact details, profile image, video and marketing copy still need wp-admin/lawyer approval.

## Next Action
After uPress pull, open the Maya profile in wp-admin and verify:
- `website`
- `source_url`
- `profile_public_sources`
- `profile_source_summary`
- `profile_media_urls`
- contact details and final public wording before outreach.
