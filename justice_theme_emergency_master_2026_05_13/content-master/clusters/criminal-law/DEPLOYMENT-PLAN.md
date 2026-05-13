# Criminal Law Department: Deployment Log
## GOAL: #1 for "עורך דין פלילי" and ALL criminal law queries in Israel

**Last Updated**: 2026-05-13T22:42:00+03:00

## DEPLOYED ARTICLES (8 total, ~56K chars total content)

| # | Time | ID | Slug | Impressions | Chars |
|---|------|----|------|-------------|-------|
| 1 | 22:00 | 857 | /criminal-defense-attorney/ | 62K | 20K |
| 2 | 22:30 | 19257 | /criminal-record-check/ | 38K | 6.8K |
| 3 | 22:32 | 19259 | /criminal-record-deletion/ | 33K | 6.8K |
| 4 | 22:34 | 19261 | /criminal-lawyer-cost/ | 23K | 5.4K |
| 5 | 22:36 | 19263 | /drug-crimes/ | 23K | 5.9K |
| 6 | 22:37 | 19265 | /shoplifting-defense/ | 11K | 4.2K |
| 7 | 22:39 | 19267 | /lahav-433-guide/ | 23K | 4.5K |
| 8 | 22:40 | 19269 | /police-investigation-rights/ | NEW | 4.8K |
| 9 | 22:41 | 19271 | /murder-charges/ | 12K | 3.7K |

## Architecture
- Pillar: /criminal-defense-attorney/ (857)
- All spokes link to pillar with anchor "עורך דין פלילי"
- Pillar links to all spokes
- Cross-links between related spokes
- No URL conflicts with existing virtual pages

## STILL TO DEPLOY
- /drug-trafficking/ - סחר בסמים (8K imp)
- /drug-possession/ - החזקת סמים (5K imp)
- /driving-under-influence/ - נהיגה בשכרות (7K imp)
- /fraud-types/ - סוגי הונאה (5K imp)
- /tax-crimes/ - עבירות מס (2K imp)
- /criminal-negligence/ - רשלנות פלילית (2K imp)
- /arrest-rights/ - מעצר וזכויות עצור (NEW)
- /plea-bargain/ - הסדר טיעון (NEW)
- /criminal-appeal/ - ערעור פלילי (NEW)

## Technical Notes
- CPT: articles (wp.newPost via XML-RPC)
- Auth: benbatash / wp password
- Creds: tools/gsc/wp-app-password.json (gitignored)
- Publisher: quick-publish.js
