# Spam Footprint Discovery Queue - 2026-05-18

Cycle time: 2026-05-18 18:42 Asia/Jerusalem

## Research basis

- Google Search Console Removals can temporarily hide URLs from Google Search, but permanent removal still requires server-side action such as 404/410 or noindex. Source: https://support.google.com/webmasters/answer/9689846
- Google's Removals guidance explicitly says hacked URLs can be blocked with the URL blocking tool, but the whole site should not be blocked; clean the hack and let Google recrawl. Source: https://support.google.com/webmasters/answer/9689846
- Google's recrawl guidance says URL Inspection can request recrawl for updated pages. Source: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- Google's crawl-budget guidance says permanently removed pages should return 404 or 410. Source: https://developers.google.com/crawling/docs/crawl-budget

## Current verified baseline

The live favicon/spam guard checker currently verifies:

- Homepage returns HTTP 200.
- Deployment marker is live.
- Six canonical scales favicon tags are live.
- Old J favicon source is absent.
- `/guide-complet-du-casino-en-ligne/` returns HTTP 410 with `X-Robots-Tag: noindex,nofollow`.
- `/guia-experta-para-maximizar-bonos-y-estrategias-de-juego/` returns HTTP 410 with `X-Robots-Tag: noindex,nofollow`.

One focused public search query for `site:jus-tice.co.il casino OR bonos OR juego Jus-Tice` did not surface the two spam URLs in the visible top results during this cycle, but that is not proof that Google has fully dropped every hacked URL.

## Existing internal evidence

Repo evidence says this cleanup should not stop at two URLs:

- `project-control/spam-investigation.md` recorded the original casino/gaming spam investigation plan.
- `criminal-law-semrush-playbook-actions.csv` recorded toxic spam anchors such as `payid casino`, `mostbet`, `kasyno`, and `online casino`.
- `criminal-law-exit-review.md` still lists toxic backlink cleanup as an open risk.

## Discovery queue

| Priority | Source | What to collect | Why | Action after collection |
|---:|---|---|---|---|
| 1 | Google Search result URLs | Exact URLs for every casino/gambling result visible in Google | Search result truncation hides exact paths | Test each URL live; if 410/404/noindex, submit exact URL in GSC Removals |
| 2 | GSC Pages report | Pages containing casino/gambling terms, foreign casino titles, or sudden impression spikes | Finds indexed URLs not visible in manual search | Add to removal queue only after live status check |
| 3 | GSC Links report | Top linked pages and top anchor text containing casino/spam terms | Confirms whether toxic anchors still target the domain | Prepare backlink export/disavow review, owner-approved only |
| 4 | Semrush/Ahrefs export | Referring domains and anchors for `payid casino`, `mostbet`, `kasyno`, `online casino` | Existing playbook says anchors are polluted | Do not disavow blindly; classify domains first |
| 5 | WordPress DB/admin audit | Recent posts, unknown users, widgets, plugin imports, cron jobs | Ensures the spam source is closed | Owner-approved admin/database audit only |

## Exact removal rule

Only submit Search Console Removals when all of these are true:

1. The URL is copied exactly from Google Search or GSC.
2. Live fetch returns `410`, `404`, or a valid `noindex` signal.
3. The URL is clearly hacked/spam/off-topic.
4. The URL is not a legitimate legal page, lawyer profile, article archive, homepage, `/articles/`, `/lawyers/`, sitemap, or core commercial route.

## Backlink/disavow rule

Do not disavow domains from memory or keyword suspicion. First produce a backlink CSV with:

- referring domain
- source URL
- target URL
- anchor text
- first seen
- last seen
- follow/nofollow
- spam reason
- recommended action

Then owner/legal review decides whether to contact site owners, ignore, or disavow.

## Safe next actions

1. In GSC, run Performance > Pages filtered by query/page terms: `casino`, `bonos`, `juego`, `keno`, `mostbet`, `kasyno`, `payid`.
2. Copy exact URLs into `project-control/spam-footprint-discovery-queue-2026-05-18.csv`.
3. Run live status checks for every copied URL before removal.
4. Submit only confirmed spam URLs in Removals.
5. Request homepage indexing again after the favicon fix.

## Safety

This cycle changed only repo planning/status artifacts and used read-only verification. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment changed.
