# GSC API Access Plan

Date: 2026-05-12
Status: RECOMMENDED / BLOCKED UNTIL ACCESS / NO PUBLIC CHANGES

Browser-based Search Console work is useful but too slow for cluster-by-cluster publishing. API access is worth setting up because it can turn manual query/page checks into repeatable exports.

OWNER SETUP GUIDE:
- Use `project-control/gsc-api-setup-guide.md` for the practical step-by-step setup instructions.

## Recommendation

VERIFIED:
- Use GSC API for read-only query/page exports before each cluster upload.
- Start with Family/Divorce.
- Use the exact URL-prefix property `https://jus-tice.co.il/` if that is the active verified property.

## Access Needed

REQUIRED:
1. A Google account with Full or Owner access to the GSC property.
2. Google Search Console API enabled in a Google Cloud project.
3. OAuth user authorization for the GSC account, or a service account added to the GSC property if Google property permissions allow it.
4. Read-only local token storage outside the repo.

DO NOT COMMIT:
- OAuth client secrets.
- Access tokens.
- Refresh tokens.
- API keys.
- Exported private account data that is not intended for project-control.

## What The API Saves

SAVES TIME:
- Query/page exports by cluster.
- Old URL protection checks.
- Cannibalization checks where one query maps to many URLs.
- Pre/post publish comparison.
- Page-level traffic-risk scoring.
- Reusable CSV files instead of browser screenshots.

ESTIMATED SAVINGS:
- Family/Divorce: saves about 1-2 work cycles.
- Each later cluster: saves about 1 cycle.
- First 5 clusters: saves about 5-8 cycles.

## First Exports To Produce

TARGET FILES AFTER ACCESS:
- `project-control/gsc-api-family-divorce-query-page-export-2026-05-12.csv`
- `project-control/gsc-api-family-divorce-risk-map-2026-05-12.csv`
- `project-control/gsc-api-family-divorce-protected-url-list-2026-05-12.csv`

FIELDS:
- query
- page
- clicks
- impressions
- ctr
- position
- date range
- cluster
- recommended action
- protected_url
- upload_risk

## Family / Divorce First Use

QUESTIONS TO ANSWER:
1. Which URLs currently get impressions for divorce-lawyer terms?
2. Which URLs currently get impressions for child-support calculation terms?
3. Which URLs currently get impressions for custody terms?
4. Do PDF/DOCX/calculator URLs have enough visibility to protect?
5. Are clean English URLs already visible?
6. Which pages should not be redirected, noindexed or overwritten?

## Blocker

BLOCKED:
- API execution cannot begin until GSC API access is available.
- Until then, browser GSC checks can continue, but they should be used only for narrow proof points rather than broad repetitive exports.
