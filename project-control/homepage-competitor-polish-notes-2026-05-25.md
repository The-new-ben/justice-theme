# Homepage Competitor Polish Notes - 2026-05-25

## Sources Checked
- Din homepage/search result: https://www.din.co.il/
- Din lawyer index result: https://www.din.co.il/lawyers/3824/7048/
- LawReviews homepage/result: https://www.lawreviews.co.il/
- LawReviews profile examples from public search results.
- PsakDin lawyer profile examples from public search results.

## Pattern Extracted
- Din communicates a broad lawyer index, search by practice area and city, and legal articles around common problems.
- LawReviews communicates filtering, detailed profiles, review trust and verified-information language.
- PsakDin combines lawyer index, legal content, forms/services and profile pages.

## Original Jus-Tice Implementation
- Added a homepage signal row under the search box:
  - Search by field and city.
  - Profile review before contact.
  - Content that helps the user decide before sending an inquiry.
- This does not copy competitor copy and does not claim reviews, ranking, recommendation, or verified ratings that are not yet in the CMS.
- The goal is to make the first viewport feel more like a legal directory/search product and less like a generic content site.

## Safety
- No CMS/database rows were created.
- No lawyer card, review, rating, redirect, canonical/noindex, sitemap, taxonomy, payment, invoice, refund, GSC or GA4 setting changed.
- The row is theme-rendered homepage UI and can be refined after visual QA.
