# Goal Execution Loop - 2026-05-18

Status: ACTIVE

Owner instruction:
- Work sequentially.
- Start each cycle with current research.
- Implement one safe, goal-aligned improvement per cycle.
- Test hands-on from time to time across the public user journey, lawyer customer journey, and Googlebot/indexing journey.
- Keep shared repo progress updated for other agents.
- After deployable code is pushed, pull Git in uPress for `jus-tice.co.il` and record success/blockers.
- Primary business goal: make lawyers see Jus-Tice, register, pay, receive ongoing value, stay satisfied, and upgrade over time.

## Priority Cycle 37 - Money Query SEO Rescue Edit Blocks

Research reviewed:
- `project-control/money-query-seo-rescue-batch-001-2026-05-18.md`.
- `project-control/gsc-money-query-opportunity-map-2026-05-18.csv`.
- `project-control/real-estate-support-to-hub-map-2026-05-18.csv`.
- `project-control/criminal-law-support-to-hub-map-2026-05-18.csv`.

Business interpretation:
- The fastest safe SEO recovery path is not a broad migration. It is preserving high-impression URLs and making their title/H1/intro/CTA/internal links match the money queries they already receive.
- `/real-estate-attorney/` should be repaired first because it has the highest opportunity and lower legal sensitivity than criminal defense.

Implemented in this cycle:
- Created `project-control/money-query-seo-rescue-edit-blocks-2026-05-19.md`.
- Created `project-control/money-query-seo-rescue-edit-blocks-2026-05-19.csv`.
- Prepared exact owner-review blocks for `/real-estate-attorney/` and `/criminal-defense-attorney/`.

Verification:
- Live Googlebot-style checks returned HTTP 200, self-canonical and indexable state for both priority pages.
- Proposed real-estate and criminal support-link targets returned HTTP 200.
- The redirecting `/articles/criminal-indictment/` path was excluded from the first criminal internal-link block.

Next step:
- Owner approves or edits the `/real-estate-attorney/` packet.
- After approval, back up current CMS fields and apply real estate first with post-upload QA before editing `/criminal-defense-attorney/`.

Safety:
- Repo-only planning and read-only live checks. No public CMS database row, article body, WordPress title/H1/meta, URL slug, redirect, noindex, canonical, sitemap setting, taxonomy term, internal link, related-card, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value or uPress deployment was changed.

## Priority Cycle 36 - Spam Footprint Discovery Queue

Research reviewed:
- Google Search Console Removals can temporarily hide URLs from Google Search, but permanent removal still requires server-side action such as 404/410 or noindex. Source: https://support.google.com/webmasters/answer/9689846
- Google's Removals guidance says hacked URLs can be blocked with the URL blocking tool, but the whole site should not be blocked; clean the hack and let Google recrawl. Source: https://support.google.com/webmasters/answer/9689846
- Google recrawl guidance says URL Inspection can request recrawl for updated pages. Source: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- Google's crawl-budget guidance says permanently removed pages should return 404 or 410. Source: https://developers.google.com/crawling/docs/crawl-budget

Business interpretation:
- The visible favicon/casino fix is live, but the domain may still have hidden spam footprint in indexed URLs, anchors or backlinks.
- The safe growth move is evidence collection, not broad deletion or disavow.

Implemented in this cycle:
- Created `project-control/spam-footprint-discovery-queue-2026-05-18.md`.
- Created `project-control/spam-footprint-discovery-queue-2026-05-18.csv`.
- Defined exact URL removal rules, backlink/disavow rules, and GSC/Semrush export needs.

Verification:
- `node tools/check-live-favicon-and-spam-guard.mjs` still passes for homepage marker, canonical scales favicon tags, old J absence, and two casino URLs 410/noindex.
- Reviewed repo evidence from prior spam investigation and criminal-law Semrush playbook.
- Repo change is planning/status-only, so no public deployment or uPress pull was required.

Next step:
- In GSC, export Pages and Links data filtered by spam terms: `casino`, `bonos`, `juego`, `keno`, `mostbet`, `kasyno`, `payid`.
- Test every exact URL live before submitting removals or considering disavow.

Safety:
- Repo-only discovery planning and read-only verification. No public CMS database row, article body, WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value or uPress deployment was changed.

## Priority Cycle 35 - GSC Favicon/Spam Aftercare Packet

Research reviewed:
- Google Search Console Removals can temporarily hide URLs from Google Search for owned properties, but permanent removal still requires server-side action such as 404/410 or noindex. Source: https://support.google.com/webmasters/answer/9689846
- Google's Removals guidance specifically says hacked URLs can be blocked with the URL blocking tool, but the site itself should be cleaned and recrawled rather than blocking the whole domain. Source: https://support.google.com/webmasters/answer/9689846
- Google recrawl guidance says URL Inspection can request recrawl for updated pages. Source: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- Google's crawl-budget guidance says permanently removed pages should return 404 or 410. Source: https://developers.google.com/crawling/docs/crawl-budget

Business interpretation:
- The code fix is live, but Google may still show old casino results and the old/globe favicon until it recrawls or a temporary removal is submitted.
- The right operational move is precise Search Console action: homepage recrawl plus exact casino URL removals.

Implemented in this cycle:
- Created `project-control/gsc-favicon-spam-aftercare-packet-2026-05-18.md`.
- Created `project-control/gsc-favicon-spam-aftercare-packet-2026-05-18.csv`.
- Recorded the exact owner-safe removal queue and guardrails.

Verification:
- `node tools/check-live-favicon-and-spam-guard.mjs` passed for homepage marker, canonical scales favicon tags, old J absence, and 410/noindex casino examples.
- Repo change is planning/status-only, so no public deployment or uPress pull was required.

Next step:
- In Search Console: inspect/request indexing for `https://jus-tice.co.il/`.
- In Search Console Removals: submit the exact casino URLs copied from Google results, starting with `/guide-complet-du-casino-en-ligne/` and `/guia-experta-para-maximizar-bonos-y-estrategias-de-juego/`.

Safety:
- Repo-only operational guidance and read-only live verification. No public CMS database row, article body, WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value was changed.

## Priority Cycle 34 - Favicon And Casino Spam Indexing Fix

Research reviewed:
- Google Search Central says the homepage should expose a crawlable favicon with supported `rel` values, the favicon should be square, stable, and larger than 48x48 for best display, and Google supports one favicon per hostname. Source: https://developers.google.com/search/docs/appearance/favicon-in-search
- Search Console Removals guidance says deleted URLs can still appear temporarily and the removals tool can hide URLs while permanent removal is handled by 404/410/noindex signals. Source: https://support.google.com/webmasters/answer/9689846

Business interpretation:
- The missing Google favicon is not just Yoast versus Rank Math. The live page exposed multiple competing icon systems, including the unwanted J mark, so Google could pick the wrong source or fall back to the globe.
- Deleted casino spam results need two tracks: server-side permanent removal signals and Search Console temporary removals for fast hiding.

Implemented in this cycle:
- Removed hardcoded J favicon links from `header.php`.
- Added canonical scales favicon head output and favicon-tag cleanup in `inc/seo.php`.
- Added root `/favicon.ico` and `/favicon.png` serving plus deleted casino/gambling spam 410 guard in `inc/spam-url-guards.php`.
- Combined the legacy scales logo asset with the Jus-Tice wordmark in header/footer while preserving the blinking red dot.
- Added `tools/check-live-favicon-and-spam-guard.mjs`.
- Updated deployment marker to `2026-05-18-brand-favicon-spam-guard-v1`.
- Created `project-control/favicon-and-casino-spam-indexing-fix-2026-05-18.md` and `.csv`.

Verification:
- PHP lint passed for all touched PHP files.
- JS syntax check passed for the new live checker.
- `git diff --check` passed.
- After the first uPress pull, cache-busted homepage checks showed the new favicon marker and canonical scales icon tags, but root favicon/spam URL status handling still returned through the 404 flow. The guard was moved earlier to `init` and now explicitly forces the HTTP status code.
- After the second uPress pull, cache-busted homepage checks passed for the deployment marker, canonical scales favicon tags, and old J favicon absence.
- Deleted casino spam examples now return HTTP 410 with `X-Robots-Tag: noindex,nofollow`.
- Browser visual check confirmed the header combines the legacy circular scales logo with the Jus-Tice wordmark and preserves the red dot.
- `/favicon.ico` and `/favicon.png` remain server-level 404 paths outside the theme, but the homepage `<link rel="icon">` tags are the Google-supported source and now point to stable crawlable theme assets.

Next step:
- Request homepage recrawl in Search Console. Submit exact casino URLs in Search Console Removals if they must disappear faster than normal recrawl.

Safety:
- Theme-level technical SEO/brand fix only. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value was changed.

## Priority Cycle 33 - Real Estate Cluster Consolidation Packet

Research reviewed:
- Google Search Console Performance reports should be used to review queries, pages, impressions, clicks, CTR and average position before deciding what to improve. Source: https://support.google.com/webmasters/answer/7576553
- Google canonical guidance says the canonical URL should represent the best representative page among duplicate or very similar pages, but canonicalization is not a substitute for deciding each page's unique purpose. Source: https://developers.google.com/search/docs/crawling-indexing/canonicalization
- Google's title-link guidance says title links should describe page content clearly and avoid weak or boilerplate text. Source: https://developers.google.com/search/docs/appearance/title-link

Business interpretation:
- Real estate is the first commercial recovery cluster because `עורך דין מקרקעין` and related lawyer queries have thousands of impressions and almost no clicks.
- The pages are live and indexable, so the problem is not a basic crawl block. It is likely split intent, weak hub/support structure, internal linking and authority.

Implemented in this cycle:
- Created `project-control/real-estate-cluster-consolidation-packet-2026-05-18.md`.
- Created `project-control/real-estate-cluster-consolidation-packet-2026-05-18.csv`.
- Defined `/real-estate-attorney/` as the primary commercial hub candidate and mapped the guide, purchase/sale, registration and rental pages into support/tool roles.

Verification:
- GSC query/page mirror confirmed `עורך דין מקרקעין` to `/real-estate-attorney/` has 7,986 impressions and 0.01% CTR.
- Googlebot-style live checks returned HTTP 200, indexable and self-canonical for `/real-estate-attorney/`, `/real-estate-lawyer-guide/`, `/lawyer-for-buying-or-selling-a-house/`, `/registration-of-real-estate-israel/`, `/rental-agreement/`, and `/online-rent-agreement/`.
- Repo change is planning/status-only, so no public deployment or uPress pull was required.

Next step:
- Prepare owner-approved public edit text for `/real-estate-attorney/` and support-to-hub links from `/real-estate-lawyer-guide/`, `/lawyer-for-buying-or-selling-a-house/`, and `/registration-of-real-estate-israel/`.

Safety:
- Repo-only planning and read-only live checks. No public CMS database row, article body, WordPress title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value or uPress deployment was changed.

## Priority Cycle 32 - GSC Money Query Opportunity Map

Research reviewed:
- Google Search Console Performance reports support query/page filters, impressions, clicks, CTR and average position. The guidance recommends reviewing low-CTR pages and improving title/snippet/content when the page is worth keeping. Source: https://support.google.com/webmasters/answer/7576553
- Google's Search Console guidance says important low-CTR queries should be checked against generated titles/snippets and page content. Source: https://support.google.com/webmasters/answer/10268906
- Google's title/snippet guidance says titles and snippets should accurately describe the page and match what users are looking for. Source: https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets

Business interpretation:
- The most valuable next work is not generic traffic recovery. It is money-query recovery where there are thousands of impressions and almost no clicks.
- Low CTR at position 9 is a snippet/conversion-path opportunity; low CTR at position 60 usually needs content depth, internal links and authority before title changes alone will matter.

Implemented in this cycle:
- Created `project-control/gsc-money-query-opportunity-map-2026-05-18.md`.
- Created `project-control/gsc-money-query-opportunity-map-2026-05-18.csv`.
- Mapped the top money-query opportunities across real estate, criminal, family/prenup, medical malpractice, traffic and homepage directory search.

Verification:
- Source data came from `justice_theme_emergency_master_2026_05_13/content-master/gsc-mirror/gsc-query-page-master.csv`.
- Filtered for money keywords with at least 100 impressions and CTR under 2.5%.
- Googlebot-style sample checks returned HTTP 200 and indexable for homepage, `/real-estate-attorney/`, the criminal indictment cancellation article, `/sex-crime-lawyer/`, `/prenup-attorney/`, `/traffic-lawyer/`, `/criminal-defense-attorney/`, and `/real-estate-lawyer-guide/`.
- Repo change is planning/status-only, so no public deployment or uPress pull was required.

Next step:
- Prepare the real estate cluster consolidation packet first, especially `/real-estate-attorney/` versus `/real-estate-lawyer-guide/`, before public title/H1/meta/content edits.
- Then prepare the criminal cluster consolidation packet because multiple criminal pages compete for high-impression commercial queries.

Safety:
- Repo-only GSC opportunity planning and read-only live checks. No public CMS database row, article body, WordPress title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value or uPress deployment was changed.

## Priority Cycle 31 - GSC Traffic Drop Triage

Research reviewed:
- Google Search Console Performance reports support page/query comparisons, CTR, impressions, filters and exports for diagnosing traffic changes. Source: https://support.google.com/webmasters/answer/7576553
- Google's title-link guidance says title links are a primary search-result decision point and should be descriptive, concise and aligned to the page. Source: https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets
- Google's snippet guidance says snippets are primarily generated from page content and can be improved with useful page content and quality meta descriptions. Source: https://developers.google.com/search/docs/appearance/snippet

Business interpretation:
- The current traffic concern should be handled with query-page evidence, not blanket SEO edits.
- The first loss rows in the GSC mirror are mostly legacy PDFs, archive/utility pages and narrow articles. These may matter for authority, but they are not the first commercial conversion path.
- The strongest growth path is to prioritize money clusters where impressions exist but CTR or recent visibility is weak: family/divorce, medical malpractice, criminal, traffic, inheritance/wills, employment/labor and real estate.

Implemented in this cycle:
- Created `project-control/gsc-traffic-drop-triage-2026-05-18.md`.
- Created `project-control/gsc-traffic-drop-triage-2026-05-18.csv`.
- Recorded a shared decision not to delete, noindex or redirect old PDFs/archive pages without owner approval and backlink/history review.

Verification:
- Used `gsc-traffic-drop-analysis.csv` and `gsc-url-master.csv` from the local GSC mirror.
- Homepage row verified at 8 clicks / 1,723 impressions over 28 days and 27 clicks / 5,153 impressions over 3 months.
- Money-cluster sampled rows showed historical impressions with weak recent sampled traffic for `/criminal-defense-attorney`, `/real-estate-lawyer-guide`, `/medical-malpractice-lawyer`, and `/traffic-lawyer`.
- Repo change is planning/status-only, so no public deployment or uPress pull was required.

Next step:
- Mine `gsc-query-page-master.csv` for money-cluster query-page pairs and prepare page-specific title/snippet/H1/internal-link recommendations before any public CMS edits.

Safety:
- Repo-only GSC triage. No public CMS database row, article body, WordPress title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value or uPress deployment was changed.

## Priority Cycle 30 - Live Reachability And Contact Signal Checker

Research reviewed:
- Google's LocalBusiness structured-data guidance defines `telephone` as the primary customer contact number and recommends including country/area code where relevant. Source: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google's Organization structured-data guidance says primary phone information belongs at the organization/local-business level before using multiple contact points. Source: https://developers.google.com/search/docs/appearance/structured-data/organization
- Current local SEO guidance emphasizes that website phone, structured data, and business-profile phone should be consistent so users and search systems do not receive conflicting contact signals.

Business interpretation:
- A "site can't be reached" report must be split quickly into DNS/SSL/server outage, WordPress/theme failure, page-level failure, or local/browser/ISP issue.
- Phone consistency is a conversion and trust signal. If a mock number leaks into the header, footer or schema, users may call the wrong number and Google receives inconsistent entity information.

Implemented in this cycle:
- Added `tools/check-live-reachability.mjs`.
- The checker verifies DNS A records, homepage, HTML sitemap, WordPress REST API, robots.txt, XML sitemap, owner phone, WhatsApp number, legacy/mock phone absence, and homepage canonical.
- Updated shared status so other agents know the site is currently reachable and the old phone number is not live.

Verification:
- Homepage, `/site-map/`, `/wp-json/`, `/robots.txt`, and `/sitemap_index.xml` returned HTTP 200.
- DNS resolved `jus-tice.co.il` to `185.108.148.104`; HTTPS verified and port 443 was reachable.
- Existing owner-phone checker passed: homepage exposes `0525101555`, `tel:0525101555`, WhatsApp `972525101555`, and no legacy/mock phone numbers.
- Repo change is tooling/status-only, so no public deployment or uPress pull was required.

Next step:
- Run `node tools/check-live-reachability.mjs` after future uPress pulls and whenever the user reports reachability issues.
- If the user still sees a browser failure, capture the exact Chrome error code and compare it with the checker output.

Safety:
- Tooling/status-only repo update. No public CMS database row, article body, WordPress title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.

## Priority Cycle 29 - Employment Law Support-to-Hub Map

Research reviewed:
- Google's link guidance says internal links should be crawlable `<a href>` links and that clear anchor text helps both users and Google understand the destination. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Current 2026 internal-linking guidance recommends service hubs supported by related detail pages with varied, topically relevant anchors. Source: https://seoglen.com/guides/internal-linking-seo
- Israeli employment-law competitors cluster around dismissal, severance, wage withholding, employee rights, employer representation, employment contracts, hearings, harassment at work, discrimination, pregnancy/parental rights, pensions, overtime and labor-court representation.

Business interpretation:
- `/labor-lawyer/` is a real commercial hub with 29,862 GSC impressions and only 3 clicks, which means the page has visibility but weak click/conversion capture.
- The employment-law cluster has false positives and boundaries: foreign real-estate/Airbnb, work injury, insurance, foreign-worker permits, PDFs, and outdated corona/emergency-workplace content.
- The safest next step is a boundary-aware support-to-hub map before public content edits.

Implemented in this cycle:
- Created `project-control/employment-law-support-to-hub-map-2026-05-18.md`.
- Created `project-control/employment-law-support-to-hub-map-2026-05-18.csv`.
- Mapped employment-contract, employee-employer relationship, Israeli labor law, work-capacity, foreign-worker permit, work-injury and employer-representation pages to the correct hub or boundary posture.
- Flagged two high-impression 404 routes for route-history review before public recovery or redirect.

Verification:
- Googlebot-style live fetch returned HTTP 200/indexable for `/labor-lawyer/`, `/employment-contract/`, `/employer-worker-relationship/`, `/israeli-labor-law/`, `/income-protection-insurance/`, and `/working-permit-for-foreign-workers/`.
- Found two route blockers: early-notice/firing URL under `/labor-law/` has 5,467 impressions but returned 404, and the Wolt courier employee-status URL has 5,806 impressions and 14 clicks but returned 404.
- Repo change is planning-only, so no public deployment or uPress pull was required.

Next step:
- Owner approves the first public employment-law internal-link/content cleanup batch, starting with factual links from `/employment-contract/` and `/employer-worker-relationship/` into `/labor-lawyer/`.
- Review the two high-impression 404 employment routes before deciding whether to recover, redirect, or leave them alone.

Safety:
- Planning-only repo update. No public CMS database row, article body, WordPress title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.

## Priority Cycle 28 - Traffic Law Support-to-Hub Map

Research reviewed:
- Google's link guidance says internal links should be crawlable `<a href>` links and that clear anchor text helps both users and Google understand the destination. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Current 2026 internal-linking guidance recommends service hubs supported by related detail pages with varied, topically relevant anchors. Source: https://seoglen.com/guides/internal-linking-seo
- Israeli traffic-law competitors cluster around drunk driving, license suspension, traffic points, speeding, phone use while driving, driving while disqualified, new-driver offenses, accidents, administrative disqualification, vehicle use bans and traffic-court representation.

Business interpretation:
- `/traffic-lawyer/` is a real commercial hub with 20,330 GSC impressions and 0 clicks, which means the page has visibility but weak click/conversion capture.
- The traffic-law cluster has dangerous false positives: "traffic" can mean road traffic, human/drug/sex trafficking, business licensing, car rental, medical-fitness licensing or personal-injury car accidents.
- The safest next step is a boundary-aware support-to-hub map before public content edits.

Implemented in this cycle:
- Created `project-control/traffic-law-support-to-hub-map-2026-05-18.md`.
- Created `project-control/traffic-law-support-to-hub-map-2026-05-18.csv`.
- Mapped drunk-driving, refusal-test, drugged-driving, points/suspension, camera-evidence and fatal-accident boundary pages to the correct hub or boundary posture.
- Flagged false-positive and outdated pages that should not feed the traffic-law hub without owner/legal approval.

Verification:
- Googlebot-style live fetch returned HTTP 200 for `/traffic-lawyer/`, `/driving-under-the-influence/`, `/driving-under-the-influence-of-drugs/`, `/dui-refusal-blood-breath-urine-test/`, `/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/`, `/car-accident-auto-injury-lawyer/`, and `/medical-fitness-tests-for-driving-marvad-info/`.
- Found one route blocker: old traffic category URL `/קטגוריות-מאמרים/דיני-תעבורה` has 1,116 GSC impressions but returned HTTP 404.
- Repo change is planning-only, so no public deployment or uPress pull was required.

Next step:
- Owner approves the first public traffic-law internal-link/content cleanup batch, starting with factual links from drunk-driving and refusal-test pages into `/traffic-lawyer/`.
- Review the 404 old traffic-category route before deciding whether to recover, redirect, or leave it alone.

Safety:
- Planning-only repo update. No public CMS database row, article body, WordPress title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.

## Priority Cycle 27 - Real Estate Support-to-Hub Map

Research reviewed:
- Google's link guidance says internal links should be crawlable `<a href>` links and that clear anchor text helps both users and Google understand the destination. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Current 2026 internal-linking guidance recommends hub-and-spoke topic clusters where support pages link back to the relevant commercial hub with natural, specific anchors. Source: https://seoglen.com/guides/internal-linking-seo
- Leading Israeli real-estate-law competitor pages cluster around apartment purchase/sale, contract review, land registry, real-estate tax, late delivery by contractor, appraisers, property agreements and transaction risk checks.

Business interpretation:
- Real estate is the fourth commercial-priority cluster after family/divorce, medical malpractice and criminal law.
- The recovered `/real-estate-lawyer-guide/` route should support the main commercial `/real-estate-attorney/` page instead of competing with it.
- Foreign real-estate investment pages have real search demand, but they should not dominate homepage/global signals unless owner confirms monetization and lawyer supply.

Implemented in this cycle:
- Created `project-control/real-estate-support-to-hub-map-2026-05-18.md`.
- Created `project-control/real-estate-support-to-hub-map-2026-05-18.csv`.
- Mapped Israeli transaction, registration, tax, appraiser, late-delivery and family/property-overlap pages to the commercial real-estate hub.
- Marked foreign real-estate investment pages as discoverable but lower commercial priority.

Verification:
- Googlebot-style live fetch passed for `/real-estate-attorney/`, `/real-estate-lawyer-guide/`, `/lawyer-for-buying-or-selling-a-house/`, `/registration-of-real-estate-israel/`, `/land-appreciation-tax/`, `/real-estate-lawyer-cost-2025/`, `/real-estate-appraiser/`, `/marital-property-agreement/`, and `/spouse-property-registration-guide/`.
- All sampled URLs returned HTTP 200, no `noindex`, and self-canonical URLs.
- Repo change is planning-only, so no public deployment or uPress pull was required.

Next step:
- Owner approves the first public real-estate internal-link/content cleanup batch, starting with Israeli transaction-intent pages and factual anchor language.
- Rewrite unsupported "recommended", "free consultation", "best", "leading" and "expert" wording into factual selection/checklist language before public content edits.

Safety:
- Planning-only repo update. No public CMS database row, article body, WordPress title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or uPress deployment was changed.

## Cycle 1 - Research To Implementation

Research reviewed:
- LawReviews positions its lawyer directory around search by practice area/location/name, verified client reviews, rich profiles, popular legal categories, and a direct lawyer profile CTA. Source: https://www.lawreviews.co.il/
- Clio's 2026 intake guidance frames legal intake as the full path from attracting a potential client through contact capture, pre-screening, scheduling, intake questionnaires, fee agreements, and onboarding. It emphasizes online forms, analytics, automation, and regular improvement. Source: https://www.clio.com/blog/client-intake-law-firms/
- Google Search Central reiterates that legal/YMYL content needs people-first usefulness, visible trust, author/source clarity, and E-E-A-T alignment. Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Tranzila supports Israeli recurring billing/subscriptions with recurring credit-card and bank-debit flows, failed-payment handling, customer/product management, reports, and invoice/email automation. Source: https://www.tranzila.com/recurring.html
- WooCommerce Subscriptions supports recurring payments and automatic/manual renewal flows, but production gateway choice still depends on gateway support and owner/legal/tax approval. Source: https://woocommerce.com/document/subscriptions/renewal-process

Business interpretation:
- The winning loop is not just "more articles." It is: rank helpful legal content, capture and qualify demand quickly, route leads to lawyers, prove value in a dashboard/report, bill recurring, and give lawyers ongoing content/reputation/reporting reasons to stay.
- Current repo already has lead forms, lawyer registration, lawyer plans, CRM views, and content planning. The biggest immediate blind spot is conversion measurement: GA4/GTM events were documented but not wired, so the owner cannot know which pages, CTAs, forms, lawyer cards, or channels make money.

Implemented in this cycle:
- Added `assets/js/analytics-events.js`.
- Enqueued it from `inc/enqueue.php`.
- Events now fire through `gtag` when present, or `dataLayer` when GTM is present.
- No PII is sent: names, phone numbers, emails, and free-text legal descriptions are intentionally excluded.

Events wired:
- `ask_lawyer_start`
- `lead_form_submit`
- `generate_lead` on `?lead=success` redirect
- `phone_click`
- `whatsapp_click`
- `lawyer_card_click`
- `article_cta_click`
- `related_article_click`
- `lawyer_signup_start`
- `lawyer_signup_submit` on `?registration=sent` redirect
- `document_request_start`
- `document_request_submit` on `?request=sent` redirect

Verification:
- `node --check assets/js/analytics-events.js` passed.
- `php -l inc/enqueue.php` passed.

Next cycle recommendation:
- Research competitor lawyer-registration value propositions and legal SaaS onboarding retention.
- Improve `/lawyer-registration/` and `/lawyer-plans/` conversion copy or tracking parameters without enabling live payments.
- Then run local/live visual QA if a reachable WordPress environment is available.

Coordination note for other agents:
- Do not implement live payment collection until owner chooses provider, pricing, invoice/tax handling, cancellation/refund policy, lawyer-advertising disclosure, and compliance rules.
- Do not add fake ranking, fake recommendations, undisclosed paid placement, or unverified review/rating claims.
- Treat this file as the active 2026-05-18 execution-log entry for the business-growth loop.

## Cycle 2 - Lawyer Signup Funnel Continuity

Research reviewed:
- Attorney-directory pricing pages commonly sell richer profiles, photos/logos, direct and indirect leads, highlighted placement, and ongoing profile availability. Source: https://premierattorneydirectory.com/pricing-tables/
- Legal marketing packages emphasize transparent monthly reporting, SEO/content work, keyword opportunity analysis, analytics/tag setup, and recurring consultation/reporting as retention value. Source: https://www.360media.com/lawfirmmarketing
- Legal marketing pricing pages often package audit, competitor analysis, keyword research, website optimization, campaign setup, content, and reporting into recurring monthly products. Source: https://legaledge.marketing/pricing

Business interpretation:
- A lawyer who clicks a paid plan has already shown commercial intent. Losing that selected plan during registration weakens follow-up, analytics, and sales prioritization.
- The registration funnel should preserve selected plan interest before payment activation, so the owner can see which packages lawyers want even while billing remains blocked.

Implemented in this cycle:
- `page-lawyer-registration.php` now reads a safe `plan_interest` query value from `/lawyer-plans/` fallback links.
- The plan select now carries `data-selected-plan`, and `assets/js/analytics-events.js` applies it on page load.
- `inc/lawyer-onboarding.php` now preserves the accepted `plan_interest` on the successful registration redirect, allowing `lawyer_signup_submit` analytics to include the plan.

Verification:
- `node --check assets/js/analytics-events.js` passed.
- `php -l inc/enqueue.php` passed.
- `php -l inc/lawyer-onboarding.php` passed.
- `php -l page-lawyer-registration.php` passed.

Next cycle recommendation:
- Add an owner-facing "lawyer value report" spec: monthly profile views, phone/WhatsApp clicks, leads, content links, ranking/impression notes, and next recommended action.
- This becomes the recurring value artifact that helps lawyers justify staying subscribed and upgrading.

## Cycle 3 - Lawyer Retention Value Report

Research reviewed:
- Law Firm Leap frames legal marketing around verified leads, SEO/AEO/GEO visibility, conversion rates, and revenue, with clear qualification boundaries. Source: https://www.lawfirmleap.com/
- Inoriseo emphasizes transparent visibility into articles published, pages optimized, links earned, and ranking changes, plus recurring monthly calls. Source: https://inoriseo.com/
- Grow Law sells real-time visibility into marketing-qualified leads, cost per lead, and ROI through a growth portal. Source: https://growlaw.co/law-firm-seo
- FirmMetrics positions a monthly law-firm analytics report around keyword rankings, traffic sources, leads, and an emailed interactive report. Source: https://esquireinteractive.com/firmmetrics/

Business interpretation:
- Lawyers keep paying when they see proof of business value every month: profile visibility, qualified leads, calls, WhatsApp activity, content work, search visibility, and a concrete next action.
- Jus-Tice should make the lawyer dashboard feel like a recurring value report, not just an account page.

Implemented in this cycle:
- `page-lawyer-dashboard.php` now totals stored profile views for the lawyer's connected profiles.
- The dashboard summary now shows profile views instead of a vague future payments/AI card.
- The dashboard sidebar now includes a "monthly value report" block with profile views, assigned leads, content requests, and a clear note that phone/WhatsApp/GSC metrics appear after GA4/GSC verification.

Verification:
- `php -l page-lawyer-dashboard.php` passed.
- `node --check assets/js/analytics-events.js` passed.
- `git diff --check` passed with line-ending warnings only.

Next cycle recommendation:
- Add a repo-only value-report specification for the full future report: GA4 events, GSC fields, CRM fields, monthly email/report cadence, and upgrade prompts.
- Then wire the owner/admin CRM to show plan-interest and lead-quality segmentation.

## Cycle 4 - Pricing Intent Measurement

Research reviewed:
- Current SaaS pricing guidance emphasizes plan clarity, highlighted plans, annual/default pricing tests, and measuring which plans users choose before signup. Source: https://www.mida.so/blog/ab-testing-pricing-pages
- Recent pricing-page analysis frames pricing pages as a high-intent funnel point where tier clarity and signup continuation matter. Source: https://www.925studios.co/blog/saas-pricing-page-examples-convert-2026
- Legal marketing/pricing pages package services around clear law-firm goals and conversion-focused CTAs, so plan interest should be captured before manual sales follow-up. Source: https://legalkeywordmarketing.com/our-pricing-page

Business interpretation:
- A lawyer clicking `Pro`, `Featured`, `Lead Partner`, or `Full Service` is a warmer commercial signal than a generic registration-page visit.
- Since live payment remains blocked by owner/legal/tax/provider decisions, measuring plan choice is the safest next monetization move.

Implemented in this cycle:
- `assets/js/analytics-events.js` now emits `lawyer_plan_click` whenever a clicked link carries `plan_interest`.
- `project-control/ga4-event-plan.csv` now documents `lawyer_plan_click` as a high-priority pre-signup monetization event.

Verification:
- `node --check assets/js/analytics-events.js` passed.
- `php -l page-lawyer-dashboard.php` passed.
- `php -l page-lawyer-registration.php` passed.
- `git diff --check` passed with line-ending warnings only.

Next cycle recommendation:
- Build the full repo-only lawyer value report specification, including which metrics come from CRM, GA4, GSC, and manual owner review.
- Then add owner CRM fields/columns for plan-interest and sales priority.

## Cycle 5 - Owner Sales Priority From Plan Intent

Research reviewed:
- Recent B2B lead-scoring guidance treats pricing-page behavior as a strong commercial-intent signal and recommends separating fit from intent so sales follows up on the right leads first. Source: https://leadanic.com/blog/lead-scoring-b2b/
- Lead-prioritization guidance emphasizes scoring models, clean data, and sales process adoption; pricing-page views and form submissions are reliable first-party intent signals. Source: https://prospeo.io/s/lead-prioritization-b2b
- Law-firm CRM guidance frames missed consultations and weak follow-up as revenue problems, not just marketing problems. Source: https://www.milemarkmedia.com/law-firm-crm/
- Law-firm marketing automation guidance emphasizes follow-up automation and lead-to-client conversion tracking as a way to recover revenue from already-generated leads. Source: https://inoriseo.com/law-firm-seo/law-firm-marketing-automation/

Business interpretation:
- Capturing plan intent is only useful if the owner can act on it. The onboarding admin should tell the owner who to call first.
- High-value plans (`lead_partner`, `full_service`) should be surfaced as priority follow-ups while payment remains blocked.

Implemented in this cycle:
- `inc/lawyer-onboarding.php` now includes helper functions for plan labels and sales-priority classification.
- The Lawyer Onboarding admin table now shows the chosen plan label/key and a `Sales Priority` badge:
  - `HIGH` for `lead_partner` and `full_service`.
  - `MEDIUM` for `pro` and `featured`.
  - `LOW` for `free` or missing paid intent.
- No payment activation, public profile publication, CMS data mutation, or pricing decision was changed.

Verification:
- `php -l inc/lawyer-onboarding.php` passed.
- `node --check assets/js/analytics-events.js` passed.
- `php -l page-lawyer-dashboard.php` passed.
- `git diff --check` passed with line-ending warnings only.

Next cycle recommendation:
- Add the repo-only full lawyer value-report spec and then map it into dashboard/admin fields.
- After deployment, verify the onboarding table visually in wp-admin and confirm plan-priority badges appear for new registrations.

## Cycle 6 - Full Lawyer Value Report Spec

Research reviewed:
- Law Firm Sites emphasizes monthly legal-marketing KPIs tied to leads, calls, form submissions, intake quality and collections/revenue, not just clicks. Source: https://lawfirmsites.com/law-firm-marketing-kpis-you-should-track-monthly/
- FirmMetrics positions law-firm reporting as a monthly interactive report combining keyword rankings, traffic breakdowns and lead sources. Source: https://esquireinteractive.com/firmmetrics/
- Inoriseo's automation guidance emphasizes that more organic leads only matter if follow-up captures them, and monthly automation metrics should be monitored. Source: https://inoriseo.com/law-firm-seo/law-firm-marketing-automation/
- Legal SEO Consultant frames monthly legal SEO dashboards around qualified organic leads, conversion quality, page/query performance and GSC health. Source: https://legalseoconsultant.com/seo-metrics-law-firm/
- Geeks for Growth recommends reporting leads, consults, signed cases, qualified lead rate and call-answer behavior above vanity metrics. Source: https://geeksforgrowth.com/law-firm-marketing-metrics/

Business interpretation:
- The durable retention product is a monthly report that proves Jus-Tice created visibility, qualified intake, content value, and next actions.
- The report must separate current verified data from future GA4/GSC/reporting placeholders so the platform does not oversell unverified proof.

Implemented in this cycle:
- Created `project-control/lawyer-monthly-value-report-spec-2026-05-18.md`.
- The spec defines report sections, data sources, current implementation status, boundary rules, phases, and open decisions.
- No public CMS data, payment logic, live reports, GA4 admin settings, or GSC API settings were changed.

Verification:
- Documentation-only artifact. No syntax check required.

Next cycle recommendation:
- Add report-ready CRM fields for lead quality and follow-up status, then surface those fields in owner CRM/admin views.

## Cycle 7 - CRM Lead Quality And Follow-Up Triage

Research reviewed:
- FirmPilot's law-firm intake guidance emphasizes tracking every lead, response times, lead source, qualification rate and sign-up rate, with fast and consistent follow-up. Source: https://firmpilot.com/blog/law-firm-intake-best-practices/
- Intake.link's 2026 law-firm intake guide frames routing and qualification around practice area, urgency, jurisdiction/location and avoiding leads falling through the cracks. Source: https://www.intake.link/blog/intake/complete-guide-law-firm-client-intake
- Inoriseo's law-firm intake optimization guidance recommends defined qualification criteria, structured intake and multi-channel follow-up tracking. Source: https://inoriseo.com/law-firm-seo/law-firm-client-intake-optimization/
- Remote Legal Staff's speed-to-lead guidance reinforces that legal leads are time-sensitive and response expectations should be operationalized. Source: https://remotelegalstaff.com/blog/law-firm-intake-response-time/

Business interpretation:
- The owner CRM needs to show which leads deserve fast attention before full automation exists.
- Lead quality can start as a conservative, display-only score from existing data: phone/email, legal area, city, message depth, urgency and assigned lawyer.
- Follow-up urgency should be visible in the owner inbox, especially for urgent new/qualified/assigned leads.

Implemented in this cycle:
- `inc/lead-crm.php` now includes display-only lead quality classification.
- The CRM table now shows `Quality` and `Follow-up` badges for legal leads.
- `Call now` appears for urgent open leads, `Same day` for new/qualified/assigned non-urgent leads, `Monitor` for active contacted states, and `Closed loop` for closed/converted/rejected states.
- No lead records, statuses, schema, database fields, email automation, payment logic or public content were changed.

Verification:
- `php -l inc/lead-crm.php` passed.
- `php -l inc/lawyer-onboarding.php` passed.
- `node --check assets/js/analytics-events.js` passed.
- `git diff --check` passed with line-ending warnings only.

Next cycle recommendation:
- Add editable owner-only lead disposition fields in the lead meta box: lead quality, follow-up outcome, first-contact timestamp and customer-success note.
- Then map those fields into the monthly value report.

## Cycle 8 - Owner-Editable Lead Disposition Fields

Research reviewed:
- Fudaut's 2026 law-firm intake-field guidance emphasizes minimal intake fields first, then clear operational fields for status, owner, next step and SLA. Source: https://www.fudaut.com/en/blog/intake-form-the-7-most-important-fields
- Clio's 2026 lead-management guidance frames lead management as tracking inquiries, following up, intake and conversion into paying clients. Source: https://www.clio.com/blog/lead-management-best-practices-law-firms/
- SMB Automation's law-firm intake automation guidance emphasizes follow-up sequences, lead-to-consultation rate, and source attribution that identifies retained clients, not just inquiries. Source: https://smbautomation.io/blog/law-firm-intake-automation
- Intake.link's 2026 client-intake guide warns that relying on memory/manual follow-up lets leads fall through the cracks. Source: https://www.intake.link/blog/intake/complete-guide-law-firm-client-intake

Business interpretation:
- Monthly lawyer value reporting needs owner-entered outcomes, not only inferred lead urgency.
- The safest next step is owner-only metadata on lead edit screens, so operators can record quality, follow-up status, first contact time and customer-success notes before any automation or public reporting.

Implemented in this cycle:
- `inc/lead-crm.php` now registers owner-only lead disposition meta:
  - `lead_quality_override`
  - `follow_up_status`
  - `first_contact_at`
  - `customer_success_note`
- Added a `Jus-Tice Lead Disposition` meta box on `justice_lead` edit screens.
- CRM lead quality now respects a manual quality override when one is saved.
- CRM follow-up badges now respect a manual follow-up status when one is saved.
- Updated `project-control/lawyer-monthly-value-report-spec-2026-05-18.md` to mark these fields as implemented.
- No public site content, payment logic, live automation, GA4 admin setting, GSC API setting, or existing lead record was changed by this code change.

Verification:
- `php -l inc/lead-crm.php` passed.
- `php -l inc/lawyer-onboarding.php` passed.
- `node --check assets/js/analytics-events.js` passed.
- `git diff --check` passed with line-ending warnings only.

Next cycle recommendation:
- Add a monthly value report admin/export skeleton that reads these fields without emailing or publishing anything.

## Cycle 9 - Response SLA And Journey Testing Goal

Research reviewed:
- Current 2026 legal-intake guidance repeatedly emphasizes speed-to-lead, immediate acknowledgement, fast routing, and visible follow-up accountability as conversion levers. Sources: https://ustechautomations.com/resources/blog/legal-lead-response-qualification-how-to-2026, https://firmpilot.com/blog/law-firm-intake-best-practices/, https://smbautomation.io/blog/law-firm-intake-automation, https://www.intake.link/blog/intake/speed-to-lead-law-firm-response-time

Business interpretation:
- Jus-Tice must not only generate leads; it must help the owner and lawyers act before a serious client moves to another lawyer.
- The operating goals must include hands-on testing of the visitor journey, lawyer customer journey and Googlebot journey, because ranking, conversion and retention only matter if the real paths work.

Implemented in this cycle:
- `project-control/strategic-goals.md` now explicitly includes journey-quality goals for users, lawyer customers and Googlebot.
- The 10-minute heartbeat mission was updated to include periodic hands-on journey checks and uPress Git Pull after deployable code is pushed.
- `inc/lead-crm.php` now adds a display-only `Response SLA` badge in the Justice CRM table using existing post date, lead status, urgency and first-contact/follow-up fields.
- Added `tools/check-live-journeys.mjs`, a read-only live checker for visitor, lawyer and Googlebot journeys.
- No public CMS content, lead records, emails, payment logic, redirects, sitemap settings or database rows were changed.

Response SLA labels:
- `Fresh` for new leads within 15 minutes.
- `Within hour` for leads still inside a one-hour follow-up window.
- `Due today` for active leads older than one hour.
- `Overdue` for active leads older than four hours.
- `Call now` or `Overdue urgent` for urgent leads.
- `Contact logged` after first contact or a contacted/consult/won/lost disposition is saved.

Verification:
- `php -l inc/lead-crm.php` passed.
- `node --check tools/check-live-journeys.mjs` passed.
- `node tools/check-live-journeys.mjs` passed all sampled live checks: homepage lead path, lawyer directory, sample article, lawyer registration, lawyer registration with `plan_interest=pro`, sitemap index and robots.
- `git diff --check` passed with line-ending warnings only.

Next cycle recommendation:
- Extend the journey checker with browser screenshots after deployment, especially for mobile visitor flow and lawyer registration.

## Cycle 10 - Deployment Proof And Activation Discipline

Research reviewed:
- 2026 SaaS onboarding guidance emphasizes activation events and time-to-first-value, not just page visits or completed setup. Source: https://www.arcade.software/post/customer-onboarding-best-practices
- Current legal-intake automation guidance emphasizes fast response, follow-up sequences and CRM workflow triggers as the practical difference between generated leads and signed clients. Sources: https://inoriseo.com/law-firm-seo/law-firm-marketing-automation/, https://softabase.com/guides/client-intake-automation-law-firms

Business interpretation:
- Jus-Tice must prove that code actually reached the live site before measuring activation, GA4 events, lawyer onboarding or CRM follow-up value.
- Deployment verification is now part of the business loop: no uPress pull means no live analytics, no live CRM SLA UI and no reliable customer/lawyer journey validation.

Implemented in this cycle:
- Added `tools/check-live-deployment.mjs`, a read-only live deployment checker.
- Updated `project-control/upress-git-pull-workflow.md` with the 2026-05-18 pull blocker and the exact post-pull verification command.
- No public CMS content, lead records, redirects, payment logic, sitemap settings, wp-admin settings or database rows were changed.

Verification:
- `node --check tools/check-live-deployment.mjs` passed.
- `node --check tools/check-live-journeys.mjs` passed.
- `git diff --check` passed with line-ending warnings only.
- `node tools/check-live-deployment.mjs` correctly returned BLOCKED: live analytics asset is `404`, homepage does not enqueue `analytics-events.js`, and homepage deployment marker is present.

Current deployment blocker:
- GitHub main includes `08a3844`, but the live analytics asset still returns HTTP `404`, so uPress has not pulled the latest pushed code yet.
- Browser/uPress control tools are not exposed in this Codex heartbeat session.

Next cycle recommendation:
- Once uPress pull is completed by an agent with browser control or by the owner, run `node tools/check-live-deployment.mjs` and then verify GA4/GTM receipt for the new events.

## Cycle 11 - Lawyer Time To First Value

Research reviewed:
- Current SaaS onboarding guidance emphasizes time-to-first-value and activation events over generic checklist completion. Sources: https://www.arcade.software/post/customer-onboarding-best-practices, https://productgrowth.in/insights/saas/saas-onboarding-benchmarks-2026/, https://retentioncheck.com/learn/onboarding-reduces-churn, https://growthlayer.app/blog/saas-customer-onboarding-best-practices

Business interpretation:
- A lawyer registering is not enough. Jus-Tice needs to get each lawyer to first measurable value quickly: profile readiness, verified visibility, a qualified lead, a contact event, content linkage or a first monthly report snapshot.
- This gives the owner a retention system: who is activated, who is stalled, who needs follow-up, and who has a real upgrade reason.

Implemented in this cycle:
- Created `project-control/lawyer-time-to-first-value-plan-2026-05-18.md`.
- The plan defines registration complete, profile ready, first measurable value, retention value, owner/admin signals, at-risk rules and safe next implementation steps.
- No public CMS content, lead records, redirects, payment logic, sitemap settings, wp-admin settings or database rows were changed.

Verification:
- `git diff --check` passed with line-ending warnings only.
- `node tools/check-live-deployment.mjs` still returns BLOCKED for live analytics asset/homepage enqueue and PASS for homepage deployment marker.

Current deployment status:
- Owner manually ran the uPress Git pull.
- `node tools/check-live-deployment.mjs` now passes: live `analytics-events.js` returns HTTP `200`, homepage serves analytics through Autoptimize, and deployment markers are present.
- Remaining next verification is GA4/GTM receipt and browser/visual journey QA.

Next cycle recommendation:
- After uPress pull, add owner-only activation status fields to lawyer onboarding/admin views and verify the live lawyer registration journey.

## Cycle 12 - Owner Activation Status Fields

Research reviewed:
- Current SaaS/customer-success guidance emphasizes milestone-based activation and time-to-first-value tracking, rather than treating onboarding completion as success. Sources: https://netpartners.marketing/customer-onboarding-automation-2026-saas-guide/, https://www.pmguru.org/insights/customer-onboarding-retention/, https://retentioncheck.com/learn/onboarding-reduces-churn
- Current law-firm marketing/reporting positioning emphasizes signed retainers, qualified leads, transparent reporting and ROI, not vanity metrics. Source: https://goconstellation.com/

Business interpretation:
- Jus-Tice needs an owner-visible activation state for every registered lawyer: registered, profile ready, first value reached, retention review or at risk.
- This gives the owner a simple customer-success operating layer before billing automation is approved.

Implemented in this cycle:
- `inc/lawyer-onboarding.php` now registers owner-only lawyer activation meta: `activation_status`, `first_value_at`, and `activation_owner_note`.
- New lawyer registrations now start with `activation_status=registered`.
- Added a `Jus-Tice Lawyer Activation` meta box on `justice_lawyer` edit screens.
- Lawyer Onboarding admin now shows activation status and first-value timestamp beside sales priority.
- Updated `project-control/lawyer-time-to-first-value-plan-2026-05-18.md`.
- No public CMS content, public profile approval, lead record, email automation, payment logic, redirect, sitemap setting, wp-admin setting or existing database row was changed.

Verification:
- `php -l inc/lawyer-onboarding.php` passed.
- `node tools/check-live-deployment.mjs` passed.
- `node tools/check-live-journeys.mjs` passed sampled user, lawyer and Googlebot checks.
- `git diff --check` passed with line-ending warnings only.

Next cycle recommendation:
- After deployment/uPress pull, verify the activation meta box in wp-admin and then expose a non-sensitive first-value milestone on the lawyer dashboard.

## Priority Cycle 13 - Dynamic HTML Sitemap Crawl Hub

Research reviewed:
- Google Search Central says Google discovers pages through crawlable links and generally needs real `<a>` elements with `href` attributes. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google's SEO Starter Guide notes that content organization can affect crawling and indexing as a site grows. Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Current internal-linking guidance emphasizes shallow crawl paths, descriptive anchors and hub-style linking for important pages. Source: https://searchengineland.com/guide/internal-linking
- Recent SEO guidance reinforces that internal links help search engines discover pages and understand site structure. Source: https://ahrefs.com/blog/internal-links-for-seo/

Business interpretation:
- The owner is worried about traffic and wants Googlebot to find the full site more reliably.
- The safest immediate change is a dynamic HTML crawl hub linked from the global footer, using real server-rendered links and no CMS/database writes.

Implemented in this cycle:
- Added `inc/html-sitemap.php`, serving `/site-map/` as a dynamic public HTML sitemap.
- Added `/html-sitemap/` as a canonical redirect to `/site-map/`.
- The page dynamically lists published articles/posts, non-empty legal topics/categories, selected pages and approved public lawyer profiles.
- Added a footer link to `/site-map/`.
- Updated deployment marker to `2026-05-18-html-sitemap-v1`.
- Added `tools/check-live-html-sitemap.mjs` for live post-pull validation.
- Created `project-control/html-sitemap-crawl-hub-plan-2026-05-18.md`.

Verification:
- `php -l inc/html-sitemap.php` passed.
- `php -l functions.php` passed.
- `php -l template-parts/layout/site-footer.php` passed.
- `node --check tools/check-live-html-sitemap.mjs` passed.
- `git diff --check` passed with line-ending warnings only.

Next cycle recommendation:
- Commit and push this batch, pull Git in uPress, then run `node tools/check-live-html-sitemap.mjs` and a quick visual check of `/site-map/`.
- Resume the normal growth loop with GA4/GSC traffic diagnostics and crawl/indexing journey checks.

## Priority Cycle 14 - uPress Pull Control + Owner Phone Cleanup

Research reviewed:
- Google Search Central link guidance says Google needs crawlable `<a href>` links and meaningful internal anchor text so users and Google can discover site pages. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google Search Central structured-data guidance says the primary business phone should be represented consistently in LocalBusiness/Organization-style structured data where applicable. Sources: https://developers.google.com/search/docs/appearance/structured-data/local-business and https://developers.google.com/search/docs/appearance/structured-data/organization

Business interpretation:
- The owner identified the public bottom phone number as a mock value. A wrong phone number is a direct trust, conversion and local-entity signal problem.
- The safest immediate fix is a render-level owner-phone guard, so stale uPress/Customizer values cannot leak the old phone back into the public header, footer, CTA, WhatsApp button or LegalService schema.

Implemented in this cycle:
- Replaced public theme fallbacks for phone and WhatsApp with `0525101555`.
- Added a render-level legacy-number guard in `justice_theme_option()` for `justice_phone` and `justice_whatsapp`.
- Updated LegalService schema telephone to use the same public owner contact value.
- Added `tools/check-live-owner-phone.mjs` to verify the live homepage displays `0525101555`, uses `tel:0525101555`, points WhatsApp to `972525101555`, and no longer exposes the old mock numbers.
- Updated the deployment marker to `2026-05-18-owner-phone-v1`.

Verification:
- PHP lint passed for `inc/lead-ui.php`, `inc/schema.php`, `functions.php`, `template-parts/layout/site-header.php`, `template-parts/layout/site-footer.php`, and `template-parts/sections/cta-section.php`.
- Node syntax checks passed for `tools/check-live-owner-phone.mjs` and `tools/check-live-html-sitemap.mjs`.
- `git diff --check` passed with line-ending warnings only.

Deployment result:
- Committed and pushed the owner-phone batch to GitHub `main`.
- Codex operated the uPress File Manager Git panel directly and clicked `משיכת נתונים (Pull)` for `/wp-content/themes/justice-theme`.
- Live verification passed with:
  - `node tools/check-live-owner-phone.mjs`
  - `node tools/check-live-html-sitemap.mjs`
  - `node tools/check-live-journeys.mjs`
- A cached homepage variant initially still showed the old LegalService telephone. A no-cache fetch showed the fixed schema, and the normal homepage check passed on rerun.

Safety:
- No CMS database row, content body, URL slug, redirect, taxonomy, lawyer profile, lead record, payment setting, GA4/GSC admin setting, XML sitemap setting or wp-admin setting was changed.

## Priority Cycle 16 - Live Traffic Priority Audit

Research reviewed:
- Google's Search Console traffic-drop guide recommends checking whether a drop is tied to specific pages, queries, countries, devices or search features before making broad changes. Source: https://support.google.com/webmasters/answer/9079473
- Google's helpful-content guidance recommends auditing the pages and searches most affected by a drop, then judging whether the content is complete, trustworthy and people-first. Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Business interpretation:
- The traffic problem should be handled as a priority-path audit: money pages, crawl hubs and trust pages first.
- The next safe step is not blind content generation; it is catching live route/intent defects that can waste Googlebot and lose paying users.

Implemented in this cycle:
- Added `tools/check-live-traffic-priority.mjs`.
- Generated `reports/traffic-priority-audit-2026-05-18.csv`.
- Created `project-control/traffic-priority-audit-2026-05-18.md` for other agents.

Live findings:
- PASS: `/`, `/site-map/`, `/lawyers/?area=family-law`, `/criminal-defense-attorney/`, `/traffic-lawyer/`.
- REVIEW: `/family-law/` is live 200 but title/H1 are wrong-intent court-judgment language rather than family-law commercial/practice intent.
- REVIEW: `/medical-malpractice-lawyer/` is HTTP 404/noindex.
- REVIEW: `/articles/` is about 2.9 MB with 4,793 links.
- REVIEW: `/contact/` is HTTP 404/noindex.
- REVIEW: `/about/` is HTTP 404/noindex.

Safety:
- Read-only live audit plus repo documentation/tooling only. No CMS database row, content body, URL slug, redirect, taxonomy, lawyer profile, lead record, payment setting, GA4/GSC admin setting, XML sitemap setting or wp-admin setting was changed.

## Priority Cycle 17 - Family Law Route Intent Fix

Research reviewed:
- Google's title-link guidance says title text and prominent headings should clearly and accurately describe the page. Source: https://developers.google.com/search/docs/appearance/title-link

Business interpretation:
- `/family-law/` is a commercial/practice-intent page, but live Googlebot/user checks showed a court-judgment title and H1. That confuses users, Google title generation and internal relevance signals.
- Since the URL itself is valuable and already linked internally, the safe fix is route ownership at render time, not a redirect or CMS database rewrite.

Implemented in this cycle:
- Added `practice-family-law-route.php`, a controlled family-law practice template.
- Updated `inc/practice-landing.php` so `/family-law/` uses the controlled practice template even if a legacy content item owns the slug.
- Kept the URL stable at `/family-law/`.
- Updated deployment marker to `2026-05-18-family-law-template-v1`.

Verification:
- First attempt (`2a6617b`) deployed but did not win route ownership; live audit still showed the old court-judgment title/H1.
- Second attempt (`90c437a`) used `template_include`, was pulled in uPress, and fixed the live route.
- Live traffic priority audit now shows `/family-law/` as `PASS`, HTTP 200, about 105 KB, 104 links.
- Live sitemap, owner-phone and user/lawyer/Googlebot journey checks passed after uPress pull.

Remaining blockers:
- `/medical-malpractice-lawyer/` is still HTTP 404/noindex.
- `/contact/` is still HTTP 404/noindex.
- `/about/` is still HTTP 404/noindex.
- `/articles/` remains too large/link-dense.

Safety:
- Render-only theme change. No CMS database row, content body, URL slug, redirect, taxonomy, lawyer profile, lead record, payment setting, GA4/GSC admin setting, XML sitemap setting or wp-admin setting was changed.

## Priority Cycle 15 - Sitewide Breadcrumb Schema Fix

Research reviewed:
- Google Search Central Breadcrumb structured data documentation says each `ListItem` needs a visible breadcrumb title via `name` or `item.name`. Source: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb

Business interpretation:
- GSC flagged `/site-map/` with `Either "name" or "item.name" should be specified` because the virtual sitemap route emitted an empty second breadcrumb item.
- Broken rich-result structured data is a Googlebot trust/eligibility issue. It does not explain all traffic loss by itself, but it is a clean technical defect that should be fixed immediately.

Implemented in this cycle:
- Fixed the virtual `/site-map/` breadcrumb name to render `מפת אתר`.
- Hardened breadcrumb schema generation so empty breadcrumb names fall back to a safe non-empty label.
- Added a current-request public URL helper for virtual routes without a WordPress post ID.
- Added `tools/check-live-breadcrumb-schema.mjs`, which discovers URLs from the XML sitemap, fetches them with a Googlebot user agent, parses JSON-LD, and checks every `BreadcrumbList` for missing names or empty `item` values.
- Updated deployment marker to `2026-05-18-breadcrumb-schema-v1`.

Verification:
- Pre-fix live sample found `/site-map/` invalid: `breadcrumb_0_position_2_missing_name;breadcrumb_0_position_2_empty_item`.
- PHP lint passed for `inc/breadcrumbs.php`, `inc/schema.php`, `inc/template-tags.php`, and `functions.php`.
- Node syntax passed for the breadcrumb checker and updated live checkers.
- Codex pushed commit `ed9b2ae` and ran uPress Git Pull for `/wp-content/themes/justice-theme`.
- Live `/site-map/` JSON-LD now has position 2 `name` = `מפת אתר` and `item` = `https://jus-tice.co.il/site-map/`.
- Full live breadcrumb scan checked `1,299` URLs and found `0` review items. Report: `reports/breadcrumb-schema-audit-2026-05-18.csv`.
- Live user/lawyer/Googlebot journey checker passed after deployment.

Safety:
- No CMS database row, content body, URL slug, redirect, taxonomy, lawyer profile, lead record, payment setting, GA4/GSC admin setting, XML sitemap setting or wp-admin setting was changed.

## Priority Cycle 26 - Real Estate Guide Route Recovery

Research reviewed:
- Google crawlable-link guidance says important pages should use normal crawlable links and descriptive anchors. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Current internal-linking hub guidance recommends preserving valuable pages with search evidence and linking them into the correct hub. Source: https://seoglen.com/guides/internal-linking-seo
- Competitor review for Israeli real-estate-law pages shows common commercial subtopics: buying/selling apartments, contract review, land registry, real-estate tax, late delivery by contractor, appraisers and property agreements. Sources reviewed: https://mli-law.co.il/ , https://www.propertylaw.co.il/ , https://peteladv.co.il/ , https://myglaw.co.il/ , https://ygoldlaw.co.il/real-estate-lawyer/

Business interpretation:
- `/real-estate-lawyer-guide/` has P0 GSC evidence but was live as 404/noindex. This is a technical traffic leak in a money cluster, so it outranked another planning-only map.

Implemented in this cycle:
- Added `practice-real-estate-guide-route.php`.
- Updated `inc/practice-landing.php` to treat `/real-estate-lawyer-guide/` as a controlled 200/indexable route.
- Updated the deployment marker to `2026-05-18-real-estate-guide-route-v1`.
- Updated live checkers so `/real-estate-lawyer-guide/` is part of the traffic-priority audit and marker checks expect the new deployment.
- Created `project-control/real-estate-guide-route-recovery-2026-05-18.md`.

Verification before deployment:
- PHP lint passed for `inc/practice-landing.php`, `practice-real-estate-guide-route.php`, and `functions.php`.
- Node syntax passed for `tools/check-live-traffic-priority.mjs`, `tools/check-live-html-sitemap.mjs`, and `tools/check-live-owner-phone.mjs`.

Deployment:
- Codex used uPress File Manager Git management for `wp-content/themes/justice-theme` and clicked `משיכת נתונים (Pull)`. uPress did not show a clear success toast, but live marker verification proved the pull landed.
- Live `/real-estate-lawyer-guide/` now returns HTTP 200, no noindex, self-canonical to `https://jus-tice.co.il/real-estate-lawyer-guide/`, includes expected support links, and serves deployment marker `2026-05-18-real-estate-guide-route-v1`.
- Live traffic-priority audit passed including `/real-estate-lawyer-guide/`.
- Live HTML sitemap checker and owner-phone checker passed after deployment.

Safety:
- Theme-rendered route recovery only. No public CMS database row, article body, WordPress title/H1/meta, URL slug, redirect, taxonomy, noindex setting, canonical setting in CMS, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC admin setting or wp-admin setting was changed.

## Priority Cycle 25 - Criminal Law Support-to-Hub Map

Research reviewed:
- Google crawlable-link guidance says internal links should use real `<a href>` elements and descriptive anchor text so users and Google understand the destination page. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Current internal-linking hub guidance recommends connecting related support pages back to the hub with natural, varied anchors. Source: https://seoglen.com/guides/internal-linking-seo
- Competitor review for Israeli criminal-defense pages shows common commercial subtopics: police investigation, arrest, sex offenses, drug offenses, criminal record, white-collar/economic offenses, price/cost and court representation. Sources reviewed: https://sasson-oren.co.il/ , https://www.mizrahi-law.co.il/ , https://peretz-law.co.il/ , https://www.criminallaw.co.il/

Business interpretation:
- `/criminal-defense-attorney/` is a major commercial hub with strong GSC evidence, but criminal-law content has heavy trust-claim and sensitivity risk.
- The safe next move is an approved support-to-hub map plus a trust-language cleanup gate before any live CMS edit.

Implemented in this cycle:
- Created `project-control/criminal-law-support-to-hub-map-2026-05-18.md`.
- Created `project-control/criminal-law-support-to-hub-map-2026-05-18.csv`.
- Mapped 18 P0 support URLs to `/criminal-defense-attorney/` with factual anchor directions, trust-claim cautions, and sensitive-page review gates.

Verification:
- Googlebot-style live fetch returned 200, indexable and self-canonical for `/criminal-defense-attorney/`, `/apply-for-police-criminal-information-certificates/`, `/sex-crime-lawyer/`, `/drug-related-crime/`, `/how-much-will-a-criminal-defense-lawyer-cost/`, `/tax-investigation-guide/`, `/famous-criminal-defense-lawyer/`, and `/what-is-money-laundering/`.
- No deployable theme code changed, so no uPress pull was required.

Safety:
- Repo-only planning. No public CMS database row, article body, title/H1/meta, URL slug, redirect, taxonomy, noindex, canonical, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC admin setting or wp-admin setting was changed.

## Priority Cycle 24 - Family Law Support-to-Hub Map

Research reviewed:
- Google crawlable-link guidance says internal links should be crawlable and anchor text should help users and Google understand the destination page. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google SEO starter guidance emphasizes useful content and clear navigation to important pages. Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Competitor review for Israeli family/divorce pages shows common commercial subtopics: divorce agreement, costs, custody/parental responsibility, child support, dispute resolution, property division, mediation and process checklists. Sources reviewed: https://gertelaw.co.il/divorce-agreement/ , https://www.lawreviews.co.il/article/divorce-by-mutual-consent , https://divorcify.co.il/he/calculators/divorce-cost , https://www.sayag-law.co.il/cost-divorce-how-much/

Business interpretation:
- `/family-law/` is the first homepage commercial-priority category and has a real lawyer-supply path through Maya Rotenberg.
- Existing family/divorce support pages already have strong GSC demand. The safe next move is an approved support-to-hub link map, not broad live content edits.

Implemented in this cycle:
- Created `project-control/family-law-support-to-hub-map-2026-05-18.md`.
- Created `project-control/family-law-support-to-hub-map-2026-05-18.csv`.
- Mapped 18 P0 support URLs to `/family-law/` with factual anchor directions and trust-claim cautions.

Verification:
- Googlebot-style live fetch returned 200, indexable and self-canonical for `/family-law/`, `/free-divorce-agreement-template/`, `/joint-custody-shared-parenting/`, `/child-custody-modification/`, `/divorce-costs-2025/`, `/request-for-family-dispute-settlements/`, and `/how-much-does-a-divorce-agreement-cost/`.
- No deployable theme code changed, so no uPress pull was required.

Safety:
- Repo-only planning. No public CMS database row, article body, title/H1/meta, URL slug, redirect, taxonomy, noindex, canonical, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC admin setting or wp-admin setting was changed.

## Priority Cycle 23 - Medical Malpractice Support-to-Hub Map

Research reviewed:
- Google crawlable-link guidance says internal links should be crawlable and anchor text should help users and Google understand the destination page. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google SEO starter guidance emphasizes useful content and clear navigation to important pages. Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Competitor review for Israeli medical-malpractice pages shows common commercial subtopics: birth malpractice, cerebral palsy, medical experts, costs, examples, hospitals, diagnosis/treatment errors and claim process. Sources reviewed: https://yairlaw.co.il/ , https://www.bilaw.co.il/ , https://www.gn-law.co.il/ , https://www.mishpati.co.il/find-lawyer/medical-malpractice

Business interpretation:
- The recovered `/medical-malpractice-lawyer/` hub needs support links from high-impression informational pages so Google and users see it as the commercial center of the cluster.
- The safe next step is not a live CMS edit. It is an approved link map, because several candidate pages include risky "recommended/leading" language and legal/YMYL claims.

Implemented in this cycle:
- Created `project-control/medical-malpractice-support-to-hub-map-2026-05-18.md`.
- Created `project-control/medical-malpractice-support-to-hub-map-2026-05-18.csv`.
- Mapped 15 P0 support URLs to `/medical-malpractice-lawyer/` with factual anchor directions and trust-claim cautions.

Verification:
- Googlebot-style live fetch returned 200, indexable and self-canonical for `/medical-malpractice-lawyer/`, `/cerebral-palsy/`, `/what-is-medical-malpractice-definition-examples/`, `/malpractice-cerebral-palsy/`, `/medical-malpractice-common-errors-doctors-hospitals/`, and `/anesthesia-medical-malpractice/`.
- No deployable theme code changed, so no uPress pull was required.

Safety:
- Repo-only planning. No public CMS database row, article body, title/H1/meta, URL slug, redirect, taxonomy, noindex, canonical, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC admin setting or wp-admin setting was changed.

## Priority Cycle 22 - Homepage Commercial Priority Map

Research reviewed:
- Google SEO starter guidance says link text should tell users and Google something about the linked page, and navigation should help users find important pages. Source: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google's crawl-budget guidance says higher-value content improves crawl demand, while low-value URL exposure can waste crawl attention. Source: https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget
- Current large-site internal-link architecture guidance recommends reserving homepage/global prominence for the most important pillar or commercial pages, then supporting them with contextual cluster links. Source: https://www.ranktracker.com/blog/internal-linking-strategy-for-large-sites-100k-pages/

Business interpretation:
- The homepage is the strongest internal-link signal source. If it sorts practice areas by content count, old or broad clusters can outrank the legal money categories the business wants to sell to lawyers.
- The next public homepage change should not be visual guesswork. It should follow an approved commercial priority list backed by GSC signals, lawyer supply, and lead value.

Implemented in this cycle:
- Created `project-control/homepage-commercial-priority-map-2026-05-18.md`.
- Created `project-control/homepage-commercial-priority-map-2026-05-18.csv`.
- Documented that `template-parts/sections/practice-areas-grid.php` currently orders cards by term `count`.
- Proposed the safe homepage priority order: Family/Divorce, Medical Malpractice, Criminal Law, Real Estate, Traffic Law, Employment, Inheritance/Wills, Personal Injury, foreign/relocation, broad informational.

Verification:
- Live read-only journey check passed homepage lead path, lawyer directory, sample article, lawyer registration, plan-intent registration, XML sitemap and robots.
- No deployable theme code changed, so no uPress pull was required for this cycle.

Safety:
- Repo-only planning. No public CMS database row, homepage template, article body, title/H1/meta, URL slug, redirect, taxonomy, noindex, canonical, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC admin setting or wp-admin setting was changed.

## Priority Cycle 21 - Content Triage and GSC Protection Map

Research reviewed:
- Google's core-update guidance recommends checking dropped pages against helpful-content self-assessment and improving or removing unhelpful content. Source: https://developers.google.com/search/docs/appearance/core-updates
- Google's helpful-content guidance emphasizes people-first content, clear purpose, and user satisfaction. Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google's crawl-budget guidance says higher-value content improves crawl demand, while low-value URL exposure can waste crawl attention. Source: https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget

Business interpretation:
- Traffic recovery is no longer only a technical-routing problem. The site has many old, broad, non-commercial, corona-era, trust-claim and misclassified pages that can dilute the legal-money clusters.
- Because this is legal/YMYL-style content, the safe path is evidence-first triage: protect URLs with Search Console value, rewrite/merge weak pages, and only propose noindex/merge/delete after owner approval.

Implemented in this cycle:
- Added `tools/content-audit/build-content-triage.mjs`.
- Created `project-control/content-triage-2026-05-18.csv`.
- Created `project-control/content-triage-2026-05-18.md`.
- The tool combines `project-control/url-migration-map.csv`, `reports/site-health-audit-2026-05-18.csv`, `content-master/gsc/gsc-url-summary.csv`, and `content-master/content-gap-map.csv`.

Results:
- 2,055 triage candidates.
- 821 P0 protect/rewrite/merge candidates with strong GSC evidence.
- 612 P1 review-before-change candidates.
- 622 P2 owner-approval cleanup candidates.
- Specific queues include 40 outdated/corona-or-2020 cleanup candidates, 93 merge-mapping reviews, 19 trust-claim rewrites, and 27 technical-first rows.

Verification:
- Node syntax passed for `tools/content-audit/build-content-triage.mjs`.
- The triage builder ran successfully and generated both CSV and Markdown outputs.
- No deployable theme code changed, so no uPress pull was required for this cycle.

Safety:
- Repo-only analysis/tooling. No public CMS database row, article body, title/H1/meta, URL slug, redirect, taxonomy, noindex, canonical, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC admin setting or wp-admin setting was changed.

## Priority Cycle 18 - Medical Malpractice Money Route Recovery

Research reviewed:
- Google Search Console traffic-drop guidance recommends checking whether a decline is tied to specific pages and fixing page-level causes before making broad changes. Source: https://support.google.com/webmasters/answer/9079473
- Google link and site-structure guidance recommends making important pages reachable through crawlable internal links with clear anchors. Sources: https://developers.google.com/search/docs/crawling-indexing/links-crawlable and https://developers.google.com/search/docs/appearance/sitelinks
- Google's indexing report guidance says to fix 404s that the site links to itself or lists in discovery surfaces. Source: https://support.google.com/webmasters/answer/7440203

Business interpretation:
- `/medical-malpractice-lawyer/` is an internally linked commercial URL and appears in GSC/export evidence, so leaving it as a 404/noindex wastes crawl signals and loses high-value user intent.
- The safest immediate recovery is a render-only controlled landing route. This keeps the public URL stable and avoids CMS/database edits while the larger medical-malpractice content audit continues.

Implemented in this cycle:
- Added `practice-medical-malpractice-route.php`.
- Updated `inc/practice-landing.php` to serve `/medical-malpractice-lawyer/` through the controlled medical-malpractice practice template and force a real 200 response even when WordPress initially resolves the request as 404.
- Added index/follow, canonical and title/meta filters for the recovered commercial route.
- Updated the deployment marker to `2026-05-18-medical-malpractice-route-v1`.
- Updated live checkers to expect the new marker.

Verification:
- PHP lint passed for `inc/practice-landing.php`, `practice-medical-malpractice-route.php`, and `functions.php`.
- Node syntax checks passed for `tools/check-live-traffic-priority.mjs`, `tools/check-live-html-sitemap.mjs`, and `tools/check-live-owner-phone.mjs`.
- `git diff --check` passed with line-ending warnings only.
- Commit `2d1f99e` was pushed to GitHub `main`.
- Codex operated the uPress File Manager Git panel directly and clicked `משיכת נתונים (Pull)` for `/wp-content/themes/justice-theme`; uPress reported pull success.
- Live traffic priority audit now shows `/medical-malpractice-lawyer/` as `PASS`, HTTP 200, about 56 KB, 67 links.
- Live sitemap, owner-phone and user/lawyer/Googlebot journey checks passed after uPress pull.

Remaining blockers:
- `/articles/` is still oversized at about 2.9 MB with 4,793 links.
- `/contact/` is still HTTP 404/noindex.
- `/about/` is still HTTP 404/noindex.

Safety:
- Render-only theme change. No CMS database row, content body, URL slug, redirect, taxonomy, lawyer profile, lead record, payment setting, GA4/GSC admin setting, XML sitemap setting or wp-admin setting was changed.

## Priority Cycle 19 - Contact and About Trust Route Recovery

Research reviewed:
- Google's helpful-content guidance recommends making it clear who created/published content, how it was made and why it exists, and says trust can be supported by background about the author or site such as an About page. Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google's traffic-drop guidance recommends isolating and fixing page-level causes rather than making broad blind changes. Source: https://support.google.com/webmasters/answer/9079473

Business interpretation:
- `/contact/` is a direct conversion/trust path. Leaving it as 404/noindex loses users who click old links, lawyer cards or search results looking for a way to reach the business.
- `/about/` is a trust path for a legal information site. The safest immediate fix is truthful lightweight copy that explains what Jus-Tice does and what it does not do, without fake claims.

Implemented in this cycle:
- Added `inc/trust-routes.php`.
- Added render-only virtual routes for `/contact/` and `/about/`.
- `/contact/` includes direct owner phone `0525101555`, email, lawyer-directory link, and the existing lead form.
- `/about/` explains Jus-Tice, its content/navigation/intake purpose, and the no-legal-advice boundary.
- Footer and dynamic HTML sitemap now link to `/contact/` and `/about/`.
- Updated deployment marker to `2026-05-18-trust-routes-v1`.

Verification:
- PHP lint passed for `inc/trust-routes.php`, `functions.php`, `inc/html-sitemap.php`, and `template-parts/layout/site-footer.php`.
- Node syntax checks passed for the live traffic, sitemap, and owner-phone checkers.
- `git diff --check` passed with line-ending warnings only.
- Commit `72ed36c` was pushed to GitHub `main`.
- Codex operated the uPress File Manager Git panel directly for `/wp-content/themes/justice-theme`. The success toast did not appear on this run, but live marker checks showed the new deployment marker, proving the pull landed.
- Live direct fetch: `/contact/` HTTP 200, no noindex, H1 `יצירת קשר`.
- Live direct fetch: `/about/` HTTP 200, no noindex, H1 `אודות Jus-Tice`.
- Live traffic priority audit now shows `/contact/` and `/about/` as `PASS`.
- Live sitemap, owner-phone and user/lawyer/Googlebot journey checks passed after uPress pull.

Remaining blocker:
- `/articles/` is still oversized at about 2.9 MB with 4,795 links.

Safety:
- Render-only theme change. No CMS database row, content body, URL slug, redirect, taxonomy, lawyer profile, lead record, payment setting, GA4/GSC admin setting, XML sitemap setting or wp-admin setting was changed.

## Priority Cycle 20 - Article Archive Segmentation

Research reviewed:
- Google's pagination guidance says paginated content should expose crawlable links between pages rather than relying on user-triggered JavaScript. Source: https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- Google's large-site crawl-budget guidance warns that excessive crawl paths and low-value URL exposure can waste Googlebot attention. Source: https://developers.google.com/search/docs/crawling-indexing/large-site-managing-crawl-budget

Business interpretation:
- `/articles/` was technically indexable, but it rendered about 2.9 MB and 4,795 links. That is poor for users and weak for crawl prioritization.
- The HTML sitemap should remain the broad discovery hub. The article archive should be a usable paginated entry point.

Implemented in this cycle:
- Added `inc/article-archive-controls.php`.
- Limited the public `articles` archive main query to 24 posts per page.
- Preserved standard WordPress pagination and did not touch individual article URLs, article bodies, taxonomies, redirects or sitemap settings.
- Updated deployment marker to `2026-05-18-articles-archive-segment-v1`.

Verification:
- PHP lint passed for `inc/article-archive-controls.php` and `functions.php`.
- Node syntax checks passed for the live traffic, sitemap, and owner-phone checkers.
- `git diff --check` passed with line-ending warnings only.
- Commit `c3b5a27` was pushed to GitHub `main`.
- Codex operated the uPress File Manager Git panel directly for `/wp-content/themes/justice-theme`. The success toast did not appear, but live marker checks showed the new deployment marker, proving the pull landed.
- Live direct Googlebot fetch: `/articles/` HTTP 200, no noindex, about 125 KB, 203 links, down from about 2.9 MB and 4,795 links.
- Live traffic priority audit now shows all sampled priority routes as `PASS`.
- Live sitemap, owner-phone and user/lawyer/Googlebot journey checks passed after uPress pull.

Remaining work:
- Technical priority-route blockers from the sampled audit are cleared.
- Next work should move into content classification, outdated/corona article review, homepage commercial priority order, support-to-pillar internal links, and GSC query/page mismatch diagnostics.

Safety:
- Query-only theme change. No CMS database row, article body, URL slug, redirect, taxonomy, lawyer profile, lead record, payment setting, GA4/GSC admin setting, XML sitemap setting or wp-admin setting was changed.

## Priority Cycle 31 - Inheritance Lawyer Route Recovery

Research reviewed:
- Google's crawlable-link guidance says important internal links should be real `<a href>` links and the visible anchor text should help users and Google understand the destination. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Israeli inheritance/wills competitors reviewed this cycle cluster their commercial pages around inheritance orders, probate orders, wills, objections to wills, estate administration, heir disputes and estate division.

Business interpretation:
- `/inheritance-lawyer/` is the better commercial destination than `/lawyers/?area=inheritance-law` because the lawyer directory filter is noindexed and not a clean money-page target.
- Leaving `/inheritance-lawyer/` as 404 creates a crawl and user-journey hole in a category that should sit near the homepage's paid-lead priorities.

Implemented in this cycle:
- Added `practice-inheritance-lawyer-route.php`.
- Added a controlled `/inheritance-lawyer/` route, index/follow metadata and canonical handling in `inc/practice-landing.php`.
- Replaced non-live inheritance support links with existing live support pages: `/inheritance/`, `/inheritance-order/`, `/will-and-testament/`, `/will-probate-objection/`, and `/what-is-a-probate-order/`.
- Updated `JUSTICE_DEPLOY_MARKER` to `2026-05-18-inheritance-lawyer-route-v1`.
- Updated live checkers so `/inheritance-lawyer/` is part of the traffic-priority sample and the new deployment marker is required.

Verification:
- PHP lint passed for `functions.php`, `inc/practice-landing.php`, and `practice-inheritance-lawyer-route.php`.
- Node syntax checks passed for `tools/check-live-traffic-priority.mjs`, `tools/check-live-html-sitemap.mjs`, and `tools/check-live-owner-phone.mjs`.
- `git diff --check` passed with line-ending warnings only.
- Commit `d6cfc64` was pushed to GitHub `main`.
- Codex operated uPress File Manager Git management for `/wp-content/themes/justice-theme` and clicked Pull Git. uPress did not display a clear success toast, but live deployment-marker proof showed the pull landed.
- Live direct Googlebot-style fetch: `/inheritance-lawyer/` HTTP 200, no `noindex`, self-canonical, support links present, deployment marker present.
- Live traffic-priority audit, HTML sitemap/footer checker, owner-phone checker and broad reachability checker all passed after the pull.

Remaining work:
- Strengthen the visible H1/title language on the inherited route so it says `עורך דין ירושה` more directly.
- Continue content classification and owner-approved support-to-hub internal linking for inheritance/wills, employment, traffic, real-estate, criminal, family and medical-malpractice clusters.

Safety:
- Render-only theme route recovery. No CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or WordPress database value was changed.

## Priority Cycle 32 - Inheritance Lawyer H1 Intent Alignment

Research reviewed:
- Google's title-link guidance says Google uses several sources to create a search result title link, including the `<title>` element, the main visual title, heading elements such as `<h1>`, prominent text, on-page anchor text and inbound anchor text. Source: https://developers.google.com/search/docs/appearance/title-link
- The inheritance route already had correct metadata, but the visible H1 still fell back to the taxonomy term name, weakening the on-page signal for `עורך דין ירושה`.

Business interpretation:
- The recovered route was technically indexable, but the visible page title was still not aligned with the money query. That can reduce user confidence and give Google a weaker title source.
- The safest fix is a route-level display-title override, not a taxonomy or CMS edit.

Implemented in this cycle:
- Added `display_title` support in `template-parts/content/practice-landing-page.php`.
- Set `display_title` only in `practice-inheritance-lawyer-route.php` to `עורך דין ירושה וצוואות`.
- Updated `JUSTICE_DEPLOY_MARKER` to `2026-05-18-inheritance-lawyer-h1-v2`.
- Updated live checkers to expect the new marker and to require inheritance H1 intent in `tools/check-live-traffic-priority.mjs`.

Verification:
- PHP lint passed for `functions.php`, `template-parts/content/practice-landing-page.php`, and `practice-inheritance-lawyer-route.php`.
- Node syntax checks passed for `tools/check-live-traffic-priority.mjs`, `tools/check-live-html-sitemap.mjs`, and `tools/check-live-owner-phone.mjs`.
- `git diff --check` passed with line-ending warnings only.
- Commit `a30e808` was pushed to GitHub `main`.
- Codex opened uPress File Manager Git management for `/wp-content/themes/justice-theme` and clicked Pull Git.
- Live direct Googlebot-style fetch: `/inheritance-lawyer/` HTTP 200, no `noindex`, deployment marker present, title `עורך דין ירושה וצוואות | צו ירושה, צוואה והתנגדות לצוואה | Jus-Tice`, H1 `עורך דין ירושה וצוואות`.
- Live traffic-priority audit, HTML sitemap/footer checker and owner-phone checker all passed after the pull.

Remaining work:
- Continue owner-approved content classification and support-to-hub internal links for inheritance/wills and the other commercial clusters.

Safety:
- Render-only route display-title/template change. No CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or WordPress database value was changed.

## Priority Cycle 38 - Live Journey Health Snapshot

Research reviewed:
- Google snippet guidance says useful, page-specific meta descriptions can help Google generate better search snippets. Source: https://developers.google.com/search/docs/appearance/snippet
- Google title-link guidance says title links may use title elements, prominent headings and other visible page text. Source: https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets
- Google LocalBusiness guidance says telephone should be the primary customer contact method. Source: https://developers.google.com/search/docs/appearance/structured-data/local-business
- Google crawlable-link guidance says important pages should be reachable through crawlable anchor links. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable

Business interpretation:
- After the recent crawl fixes, the main sampled journeys are healthy.
- The next growth work should shift toward GSC-led content decisions, title/snippet clarity and support-to-hub content quality instead of chasing the already-fixed basic reachability bugs.

Implemented in this cycle:
- Ran live user/lawyer/Googlebot journey checker.
- Ran live traffic-priority checker.
- Ran live reachability checker.
- Ran live breadcrumb schema scan across 1,299 URLs.
- Created `project-control/live-journey-health-snapshot-2026-05-18-1741.md`.
- Created `project-control/live-journey-health-snapshot-2026-05-18-1741.csv`.

Verification:
- Public user journey passed homepage lead path, lawyer directory and sample article.
- Lawyer customer journey passed registration and plan-intent registration.
- Googlebot journey passed XML sitemap and robots.
- Commercial route checker passed all 12 sampled paths.
- Reachability checker passed DNS, homepage, sitemap, REST API, robots, XML sitemap, phone/WhatsApp, mock phone absence and canonical.
- Breadcrumb schema checker scanned 1,299 URLs and found 0 review rows.
- `git diff --check` passed with line-ending warnings only.

Remaining work:
- Pull GSC page-level data for medical-malpractice birth/pregnancy/diagnosis candidates.
- Continue corona legacy review with GSC/backlink evidence.
- Compare title/snippet intent on homepage and money pages before public copy changes.

Safety:
- Read-only live audit and repo documentation only. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or WordPress database value was changed.

## Priority Cycle 37 - Medical Malpractice Clean Slug Route Review

Research reviewed:
- Google redirect guidance: redirects should point to meaningful new destinations when content moved or merged. Source: https://developers.google.com/search/docs/crawling-indexing/301-redirects
- Google HTTP/soft-404 guidance: empty/error-like content may be treated as soft 404 even when a server returns 200. Source: https://developers.google.com/search/docs/advanced/crawling/http-network-errors
- Google helpful-content guidance calls out YMYL topics; legal and medical pages require high trust and useful people-first content. Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Business interpretation:
- The dead clean slugs are important, but recovering them as thin route pages would be unsafe.
- Birth and pregnancy malpractice already have overlapping live pages and older GSC-visible Hebrew demand.
- Diagnosis malpractice has a live diagnosis-specific candidate, so any future redirect should be precise.

Implemented in this cycle:
- Created `project-control/medical-malpractice-clean-slug-route-review-2026-05-18.md`.
- Created `project-control/medical-malpractice-clean-slug-route-review-2026-05-18.csv`.
- Mapped `/birth-malpractice/`, `/pregnancy-malpractice/`, and `/diagnosis-malpractice/` to live status and candidate equivalents.
- Confirmed live alternatives including `/medical-malpractice-lawyer-birth-representation/`, `/medical-malpractice-lawyer-birth-recommended/`, `/birth-injury/`, `/birth-injury-lawyer/`, `/birth-injury-causes/`, `/brain-damage-at-birth/`, and `/medical-malpractice-8271/`.

Verification:
- Repo was up to date before work.
- Googlebot-style curl checks captured live status for the clean slugs and key candidate URLs.
- `git diff --check` passed with line-ending warnings only.
- No deployable theme code changed, so no uPress pull was required.

Remaining work:
- Pull GSC page-level clicks/impressions for the candidate pages.
- Compare birth/pregnancy pages before any route recovery, redirect, or CMS rewrite.
- Consider `/diagnosis-malpractice/` -> `/medical-malpractice-8271/` only after equivalence and legal/source review.

Safety:
- Repo-only route review and read-only live checks. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or WordPress database value was changed.

## Priority Cycle 36 - Medical Malpractice Support Link Fix

Research reviewed:
- Google's crawlable-link guidance says Google generally crawls links from real anchor elements with `href`, and descriptive anchor text helps both people and Google understand linked pages. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Current Israeli medical-malpractice competitors emphasize birth injury, pregnancy/birth care, diagnosis or treatment mistakes, surgery, anesthesia, expert medical opinions, causation, damages and limitation periods.

Business interpretation:
- `/medical-malpractice-lawyer/` is a commercial money route, so it must not send users or Googlebot into 404 support paths.
- Birth and pregnancy malpractice are important intents, but the clean English slugs currently return 404 and should not be promoted until route-history review.

Implemented in this cycle:
- Replaced `/birth-malpractice/`, `/pregnancy-malpractice/`, and `/diagnosis-malpractice/` in theme-owned medical-malpractice support surfaces.
- Added live support URLs: `/birth-injury/`, `/anesthesia-medical-malpractice/`, `/surgical-errors-medical-malpractice/`, and `/what-is-medical-malpractice-definition-examples/`.
- Updated `inc/practice-landing.php`, `template-parts/sections/topic-clusters.php`, `inc/pillar-pages.php`, `inc/related-content.php`, and `tools/check-live-traffic-priority.mjs`.
- Updated deployment marker to `2026-05-18-medmal-support-links-v1`.
- Created `project-control/medical-malpractice-support-link-fix-2026-05-18.md`.
- Created `project-control/medical-malpractice-support-link-fix-2026-05-18.csv`.

Verification:
- PHP lint passed for modified PHP files.
- Node syntax checks passed for modified live checkers.
- Static scan shows the blocked clean slugs are no longer present in public theme output surfaces, except as explicit test guards and offline audit heuristics.
- `git diff --check` passed with line-ending warnings only.
- Commit `21fff2c` was pushed to GitHub `main`.
- Codex opened uPress File Manager Git management for `/wp-content/themes/justice-theme` and clicked Pull Git.
- Live traffic-priority checker passed all sampled commercial/trust routes.
- Live HTML sitemap/footer checker passed.
- Live owner-phone checker passed.
- Targeted Googlebot-style fetch of `/medical-malpractice-lawyer/` confirmed marker `2026-05-18-medmal-support-links-v1`, confirmed the live support URLs, and confirmed `/birth-malpractice/`, `/pregnancy-malpractice/`, and `/diagnosis-malpractice/` are absent.

Remaining work:
- Review GSC and route history for the old Hebrew birth/pregnancy malpractice page before deciding whether to recover clean routes, merge, redirect, or leave unavailable.
- Continue medical-malpractice content support mapping only after owner/legal approval.

Safety:
- Theme-owned crawl-path correction. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or WordPress database value was changed.

## Priority Cycle 35 - Corona Legacy Content Audit

Research reviewed:
- Google's helpful-content guidance says successful content should be useful, reliable and people-first, not written mainly for search traffic. Source: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google's core-update guidance warns against reactive quick fixes and says broad site-quality improvements may take time to be reflected. Source: https://developers.google.com/search/docs/appearance/core-updates
- Google's outdated-content tool is for content that no longer exists or materially changed in Google results; it is not a blanket instruction to delete old pages. Source: https://support.google.com/webmasters/answer/7041154

Business interpretation:
- Corona-era content can dilute quality if it still presents obsolete practical guidance as current advice.
- It can also still carry legal archive, backlink, long-tail, or support value, so mass deletion/noindexing is unsafe.
- The right move is evidence-led triage: refresh useful commercial/support pages, label historical pages, and only prune after GSC/backlink review.

Implemented in this cycle:
- Scanned `project-control/url-migration-map.csv` for corona/COVID/emergency-regulation candidates.
- Found 48 corona-adjacent rows: 29 `outdated-corona-legacy`, 7 `employment-law`, 4 `needs-classification`, 2 `cyber-privacy`, 2 `criminal-law`, 2 `real-estate`, 1 `traffic-law`, and 1 `medical-malpractice`.
- Created `project-control/corona-legacy-content-audit-2026-05-18.md`.
- Created `project-control/corona-legacy-content-audit-2026-05-18.csv`.
- Classified representative rows into `REFRESH_EVERGREEN`, `HISTORICAL_ARCHIVE_OR_REFRESH`, `NOINDEX_OR_ARCHIVE_REVIEW`, and `KEEP_OUT_OF_COMMERCIAL_CLUSTER` style lanes.

Verification:
- Repo was up to date before work.
- Googlebot-style header checks returned HTTP 200 for `https://jus-tice.co.il/coronavirus-employers-guide/`, `https://jus-tice.co.il/income-protection-insurance/`, and `https://jus-tice.co.il/research-report-n156-persistent-symptoms/`.
- `git diff --check` passed with line-ending warnings only.
- No deployable theme code changed, so no uPress pull was required.

Remaining work:
- Pull GSC clicks/impressions for all 48 candidates.
- Run live indexability checks for the 29 `outdated-corona-legacy` rows.
- Owner approval needed before any CMS refresh, noindex, 410, redirect, category, or internal-link changes.

Safety:
- Repo-only editorial planning and read-only live checks. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or WordPress database value was changed.

## Priority Cycle 33 - Inheritance/Wills Support-To-Hub Map

Research reviewed:
- Google's crawlable-link guidance says important pages should be reachable through real `<a href>` links and descriptive anchor text. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Google's title-link guidance says Google can use title, main visual title, headings, prominent text and anchor text to understand and display page titles. Source: https://developers.google.com/search/docs/appearance/title-link
- Leading Israeli inheritance/wills competitors cluster around inheritance orders, probate orders, wills, objections to wills, estate administration, heir disputes, estate division, capacity, undue influence and cross-border inheritance.

Business interpretation:
- `/inheritance-lawyer/` now exists and has the correct H1, but it needs clean support pages pointing into it before it can become a stronger commercial route.
- The first safe batch should use pages with GSC demand and live 200/indexable status, while excluding false positives and route-conflict pages.

Implemented in this cycle:
- Created `project-control/inheritance-wills-support-to-hub-map-2026-05-18.md`.
- Created `project-control/inheritance-wills-support-to-hub-map-2026-05-18.csv`.
- Mapped P0 support pages: `/inheritance/`, `/inheritance-order/`, `/what-is-a-probate-order/`, `/will-probate-objection/`, `/will-and-testament/`, and `/international-inheritance-wills-lawyer/`.
- Logged `/will/` as a blocker because it is 404/noindex and has duplicate target slug history.
- Logged false positives caused by the English word "will", including criminal-law cost and traffic-law license pages.

Verification:
- Googlebot-style live checks passed for the inheritance hub and support pages listed in the support map.
- `/will/` returned 404/noindex and remains blocked for route-history review.
- `git diff --check` passed with line-ending warnings only.
- No deployable theme code changed, so no uPress pull was required.

Remaining work:
- Owner approval is needed before public CMS edits.
- After approval, add one natural contextual link from each P0 support page to `/inheritance-lawyer/`, avoiding unsupported "best/recommended/free consultation" claims.

Safety:
- Repo-only planning and live read-only audit. No CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or WordPress database value was changed.

## Priority Cycle 34 - Inheritance Topic Link Bug Fix And `/will/` Route Review

Research reviewed:
- Google redirect guidance says redirects are useful when content has moved, been removed with a new destination, or when merging URLs. Source: https://developers.google.com/search/docs/crawling-indexing/301-redirects
- Google site-move guidance recommends a URL mapping from current URLs to corresponding new URLs before redirects. Source: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- Google soft-404 guidance discourages successful pages for non-existent content because they confuse users/search engines and can waste crawl coverage. Source: https://developers.google.com/search/blog/2008/08/farewell-to-soft-404s

Business interpretation:
- The site should not link users or Googlebot to `/will/`, `/will-contest/`, or `/estate-administration/` while those are not verified live destinations.
- `/will/` is not safe for blanket recovery because the repo shows it as a 10-row duplicate target for several different case-law intents.

Implemented in this cycle:
- Updated `template-parts/sections/topic-clusters.php`.
- Replaced `/will/` with `/will-and-testament/`.
- Replaced `/will-contest/` with `/will-probate-objection/`.
- Replaced `/estate-administration/` with `/what-is-a-probate-order/`.
- Added `/inheritance-order/` to the inheritance topic cluster.
- Updated `JUSTICE_DEPLOY_MARKER` to `2026-05-18-inheritance-topic-links-v1`.
- Created `project-control/will-route-conflict-review-2026-05-18.md`.
- Created `project-control/will-route-conflict-review-2026-05-18.csv`.

Verification:
- PHP lint passed for `functions.php` and `template-parts/sections/topic-clusters.php`.
- Node syntax checks passed for live checkers.
- Static scan found no remaining hardcoded `'/will/'`, `'/will-contest/'`, or `'/estate-administration/'` links in `template-parts`, `inc`, `tools`, or `functions.php`.
- `git diff --check` passed with line-ending warnings only.
- Commit `5e6973b` was pushed to GitHub `main`.
- Codex opened uPress File Manager Git management for `/wp-content/themes/justice-theme` and clicked Pull Git.
- Live HTML sitemap/footer checker, owner-phone checker, traffic-priority audit and reachability checker all passed after the pull.

Remaining work:
- Review each old URL mapped to `/will/` and choose a specific equivalent target, merge target, or true 404/410 decision. Do not blanket redirect `/will/` to homepage or `/inheritance-lawyer/`.

Safety:
- Theme link correction plus read-only route review. No CMS database row, article body, stored WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting or WordPress database value was changed.
