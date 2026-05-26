# GSC Favicon And Spam Aftercare Packet - 2026-05-18

Cycle time: 2026-05-18 18:32 Asia/Jerusalem

## Research basis

- Google Search Console Removals can temporarily hide URLs from Google Search for owned properties, but permanent removal still requires server-side action such as 404/410 or noindex. Source: https://support.google.com/webmasters/answer/9689846
- Google's Removals guidance specifically says hacked URLs can be blocked with the URL blocking tool, but the site itself should be cleaned and recrawled rather than blocking the whole domain. Source: https://support.google.com/webmasters/answer/9689846
- Google recrawl guidance says URL Inspection can request recrawl for updated pages, including the homepage after a technical change. Source: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- Google's crawl budget guidance says permanently removed pages should return 404 or 410. Source: https://developers.google.com/crawling/docs/crawl-budget

## Current live state

Live checker result from this cycle:

- Homepage: HTTP 200.
- Deployment marker: `2026-05-18-brand-favicon-spam-guard-v1` is live.
- Canonical favicon tags: 6 brand-icon links are live.
- Old J favicon leak: no.
- `/guide-complet-du-casino-en-ligne/`: HTTP 410 with `X-Robots-Tag: noindex,nofollow`.
- `/guia-experta-para-maximizar-bonos-y-estrategias-de-juego/`: HTTP 410 with `X-Robots-Tag: noindex,nofollow`.
- `/favicon.ico` and `/favicon.png`: still server-level 404 outside the theme, but the homepage `<link rel="icon">` tags are the Google-supported favicon source and now point to crawlable scales assets.

## Immediate Search Console actions

1. URL Inspection: inspect `https://jus-tice.co.il/`.
2. Confirm Google can fetch the page and sees the current homepage.
3. Request indexing for the homepage so Google refreshes the favicon and snippet source.
4. Removals > Temporary removals > New request:
   - Submit the exact SERP URL for `https://jus-tice.co.il/guide-complet-du-casino-en-ligne/`.
   - Submit the exact SERP URL for `https://jus-tice.co.il/guia-experta-para-maximizar-bonos-y-estrategias-de-juego/`.
   - If Google Search shows a different full path from the screenshot truncation, copy the exact result URL from the result menu and submit that exact URL too.
5. Do not submit a full-site or root-domain removal. Only submit the spam URLs or tightly matched spam prefixes if Search Console shows a clear prefix family.

## Owner-safe removal queue

| Priority | URL | Live state | GSC action | Reason |
|---:|---|---|---|---|
| 1 | `https://jus-tice.co.il/` | 200, canonical scales icon tags live | URL Inspection > Request indexing | Refresh Google favicon/search branding. |
| 2 | `https://jus-tice.co.il/guide-complet-du-casino-en-ligne/` | 410 + noindex/nofollow | Temporary removal, exact URL | This is the French casino result shown in the screenshot. |
| 3 | `https://jus-tice.co.il/guia-experta-para-maximizar-bonos-y-estrategias-de-juego/` | 410 + noindex/nofollow | Temporary removal, exact URL | This matches the Spanish casino result shown in the screenshot. |
| 4 | Any additional copied casino result URL | Must be tested first | Temporary removal only after live status check | Search result truncation can hide the exact path. |

## What not to do

- Do not use Removals to hide legitimate legal pages just because they are old or low traffic.
- Do not block the full site or the homepage.
- Do not block `/articles/`, `/lawyers/`, or legal cluster prefixes.
- Do not use `robots.txt` for hacked URL removal. Google's own guidance says permanent removal should be done by removing/updating the content, 404/410, password protection, or noindex.
- Do not re-add deleted spam URLs to the sitemap. The current 410/noindex signal is enough; the temporary removal request is only for faster SERP hiding.

## Follow-up checks

- Within 24-48 hours: check Search Console Removals status for submitted URLs.
- Within 3-7 days: run a Google `site:jus-tice.co.il casino` and exact-title checks to see if the visible results are shrinking.
- After Google recrawls homepage: check whether the search favicon changes from globe to the scales mark. This can lag behind the live technical fix.
- Keep `tools/check-live-favicon-and-spam-guard.mjs` in the deployment checklist after future uPress pulls.

## Safety

This packet is repo-only operational guidance plus read-only live verification. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value changed.
