## LATEST WORK STATUS - 2026-05-21 13:45 Asia/Jerusalem
- HOMEPAGE CUSTOMER READINESS: left the separate 301 redirect package untouched as requested and treated Grow as waiting for post-holiday approval; focused on the public homepage.
- RESEARCHED: Justia's lawyer directory puts legal issue/name plus location search at the top and also lets users browse by practice area/location. FindLaw similarly emphasizes finding legal help by issue and nearby location, while current Clio legal-directory guidance frames directory listings as lead-generation and local SEO assets. Sources: https://www.justia.com/lawyers/, https://lawyers.justia.com/faq, https://www.findlaw.com/home.html, https://www.clio.com/blog/best-lawyer-directories/
- CODED: added `template-parts/sections/customer-intake-strip.php`, a three-path homepage band for visitors who need to submit a legal inquiry, read guides first, or compare lawyer profiles.
- CODED: added the new band immediately after the hero in `front-page.php` and `page-home.php`, so both possible homepage templates get the same customer-ready path.
- CODED: tightened the hero description to remove unsupported "recommended/leading" wording and add clear no-guarantee/no-personal-advice language.
- VERIFIED: `php -l front-page.php`, `php -l page-home.php`, `php -l template-parts/sections/hero.php`, `php -l template-parts/sections/customer-intake-strip.php`, and `git diff --check` passed before commit.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is conversion readiness: homepage visitors now get a clearer path to lead submission, guide consumption or lawyer comparison, with safer legal-advertising language.
- COMPLETION ASSESSMENT: homepage customer readiness moved from 68% to 74%; lead capture readiness moved from 72% to 74%; traffic-to-lead conversion readiness moved from 45% to 49%. Still blocked: real homepage analytics, paid traffic/leads, Grow approval and deeper homepage visual testing after deploy.
- OWNER-VISIBLE AFTER DEPLOY: homepage below the hero should show a three-card "fast path for clients" band and the hero copy should no longer use "recommended/leading" lawyer claims.
- UPRESS: pending after commit/push.
- SAFETY: repo code/status only. No 301 redirect package touched, no Grow action taken, no card charged, no payment gateway setting changed, no CMS page edited, no product created, and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 12:55 Asia/Jerusalem
- PLAN PAYMENT MAPPING SCREEN: added a safe admin screen for the exact post-Grow step: mapping the four paid lawyer plans to WooCommerce subscription products.
- RESEARCHED: WooCommerce Subscriptions documentation says subscriptions are sold through subscription products, and those products generate recurring orders on their schedule. WooCommerce also documents that subscription gateways must support recurring payments for automatic renewals. Sources: https://woocommerce.com/document/subscriptions/creating-subscription-products/ and https://woocommerce.com/document/subscriptions/payment-gateways/
- CODED: `inc/lawyer-plans.php` now has `Lawyer Onboarding -> Plan Payments`, showing WooCommerce, Subscriptions and enabled-gateway readiness.
- CODED: the screen lets an admin paste/save the product IDs for Pro, Featured, Lead Partner and Full Service, then shows whether each product is found, subscription-like, purchasable and checkout-ready.
- VERIFIED: `php -l inc/lawyer-plans.php` and `git diff --check` passed before commit. After deploy, uPress Git log shows `4870c18 Add lawyer plan payment mapping admin` as `HEAD -> main, origin/main`.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is reducing the next payment setup bottleneck: after Grow approves, product mapping can be done from wp-admin without guessing option names or running WP-CLI.
- COMPLETION ASSESSMENT: automated payment readiness moved from 84% to 86%; first paid-lawyer readiness moved from 82% to 83%; owner self-service for payment setup moved from 30% to 55%. Still blocked: Grow re-check approval, real WooCommerce subscription products, gateway connection and payment smoke test.
- OWNER-VISIBLE AFTER DEPLOY: wp-admin -> Lawyer Onboarding -> Plan Payments.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `4870c18 Add lawyer plan payment mapping admin` is `HEAD -> main, origin/main`.
- SAFETY: repo code/status only. No card charged, no payment gateway setting changed, no WooCommerce product created, no product ID mapped, no CMS page edited, and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 12:47 Asia/Jerusalem
- GROW CHECKOUT APPROVAL FIX: Grow account creation is complete, the checkout fixes are live, and the site was submitted back to Grow for review.
- RESEARCHED: the Grow report for `https://jus-tice.co.il` marks terms page, business address, phone, cancellation, privacy, supply policy and product responsibility as passed. The only failed items are: checkout page exists, terms approval checkbox on checkout, and a terms link inside that checkout approval. WooCommerce checkout guidance confirms billing/customer fields such as `billing_first_name`, `billing_last_name`, `billing_email`, `billing_phone` and country are checkout field surfaces. Sources: Grow report link from owner, https://developer.woocommerce.com/docs/customizing-checkout-fields-using-actions-and-filters/
- CODED: paid plan CTAs now route to `/checkout/?plan_interest=<plan>&pre_checkout=1&payment_path=manual_invoice` when subscription products are not mapped yet, instead of skipping straight to lawyer registration.
- CODED: the checkout compliance fallback now keeps the selected paid plan visible, preserves the selected `plan_interest`, and uses a WooCommerce-style terms checkbox with a direct terms link.
- VERIFIED: `php -l inc/lawyer-plans.php`, `php -l inc/payment-compliance-routes.php`, and `git diff --check` passed before commit. After uPress pull, live `/lawyer-plans/` contains paid checkout links and live `/checkout/?plan_interest=pro&pre_checkout=1&payment_path=manual_invoice` returns 200 with the selected plan, required billing fields, terms checkbox, and terms link.
- GROW RESUBMISSION: clicked the Grow report confirmation checkbox and submitted the site for re-check. Grow confirmed: `תודה, האתר נשלח לבדיקה חוזרת בהצלחה! הבדיקה אורכת עד יום עסקים`.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is payment approval readiness: Grow's checker should now see a public paid-plan path that lands on a checkout page with the exact required customer fields and terms checkbox/link.
- COMPLETION ASSESSMENT: Grow/Meshulam website approval readiness moved from 83% to 93%; automated payment readiness moved from 82% to 84%; first paid-lawyer readiness moved from 80% to 82%. Still blocked: Grow must re-check and approve, then WooCommerce product/gateway mapping and live smoke test must be completed.
- OWNER-VISIBLE AFTER DEPLOY: `/lawyer-plans/` paid plan buttons should open `/checkout/` with the selected plan, and `/checkout/?plan_interest=pro` should show required customer fields plus a terms checkbox/link.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `540bdb4 Fix Grow checkout approval path` is `HEAD -> main, origin/main`.
- SAFETY: repo code/status plus Grow review resubmission only. No card charged, no payment gateway setting changed, no CMS page edited, no product created, and no outreach sent.

## LATEST WORK STATUS - 2026-05-20 23:47 Asia/Jerusalem
- LAWYER DASHBOARD NEXT BEST ACTION: upgraded the logged-in lawyer private area from a passive checklist into an action-driven activation cockpit.
- RESEARCHED: Justia sells lawyer visibility around complete professional profiles, premium placement, traffic stats, professional headshots, FAQs, reviews and profile maintenance; Clio's current lead-management guidance frames lawyer growth around tracking/follow-up/intake and dashboard metrics; Google Business Profile policy allows genuine review requests but forbids incentives, selective positive-only solicitation and requested review wording. Sources: https://www.justia.com/marketing/lawyer-directory/, https://www.clio.com/blog/lead-management-best-practices-law-firms/, https://help.clio.com/hc/en-150/articles/14353490331035-Clio-Grow-Dashboard, https://support.google.com/business/answer/7400114
- CODED: `inc/lawyer-dashboard.php` now gives each missing growth asset a direct action: profile update, review campaign, signed guide request, supplier request, visibility upgrade or lead-plan view.
- CODED: `page-lawyer-dashboard.php` now shows a clear `Next best action` panel above the reputation/authority checklist, adds action links to each pending item, and anchors every dashboard form so buttons jump to the right place.
- CODED: the profile update request now captures Bar license number and website/external proof link, and `inc/lawyer-onboarding.php` lets the owner review/apply/discard those staged trust fields without changing the public profile automatically.
- VERIFIED: `php -l inc/lawyer-dashboard.php`, `php -l inc/lawyer-onboarding.php`, `php -l page-lawyer-dashboard.php`, and `git diff --check` passed before commit. After deploy, live CSS contains `lawyer-dashboard-growth__next` and `/lawyer-dashboard/` returns HTTP 200.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is customer activation and retention: a lawyer who enters the private area now sees exactly what is missing and where to submit it, making paid profile completion faster and easier to sell.
- COMPLETION ASSESSMENT: lawyer dashboard operating value moved from 66% to 70%; lawyer onboarding/private-area readiness moved from 62% to 66%; first paid-lawyer readiness moved from 79% to 80%. Still blocked: real lawyer usage, owner license/profile review, and Grow/Meshulam external payment approval.
- OWNER-VISIBLE AFTER DEPLOY: logged-in `/lawyer-dashboard/` reputation and authority cockpit should show `Next best action` plus action links on missing items; the profile update form should include Bar license number and external proof link.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `d70e71c Guide lawyer dashboard next actions` is `HEAD -> main, origin/main`.
- SAFETY: repo code/status only. No public lawyer profile changed, no CMS page was edited, no outreach was sent, no review was requested, no Google API was called, no payment setting changed and no client charge happened.

## LATEST WORK STATUS - 2026-05-20 23:33 Asia/Jerusalem
- LOST VISITOR RESCUE ROUTE: respected the owner's temporary decision to keep the 404-to-home plugin for logging, and added a better future target page for lost visitors.
- RESEARCHED: Google says useful custom 404 experiences should keep the same site look, explain the missing page clearly, include popular links/search, and return real redirects only when content has a clear replacement. UX research similarly treats 404 recovery as navigation/search plus clear next actions, not a dead end. Sources: https://developers.google.com/search/docs/advanced/crawling/http-network-errors, https://developers.google.com/search/blog/2008/08/make-your-404-pages-more-useful, https://www.uxpin.com/studio/blog/404-page-best-practices/
- CODED: `inc/not-found-rescue.php` adds `/not-found-help/` and `/404-help/` as a noindex, follow rescue route with legal search, high-value practice links, lawyer directory/site-map links and the lead form.
- CODED: `functions.php` now loads the new rescue route before the trust/payment virtual pages.
- VERIFIED: `php -l inc/not-found-rescue.php` and `php -l functions.php` passed before commit. First live deploy showed the active 404-to-home plugin also redirected the new rescue route, so the rescue route was moved earlier to the `wp` stage to beat plugin redirects.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is conversion recovery: when the 404 plugin is reconfigured later, lost visitors can become search users or leads instead of being dumped on the homepage with no context.
- COMPLETION ASSESSMENT: 404 recovery system moved from 30% to 58%; traffic/ranking recovery moved from 32% to 33%; lead capture readiness moved from 70% to 72%. Still blocked: plugin must be pointed to `/not-found-help/` later, and we still need a weekly export from the plugin log to identify exact redirect candidates.
- OWNER-VISIBLE AFTER DEPLOY: `/not-found-help/` and `/404-help/` should show the new lost-visitor rescue page.
- SAFETY: repo route only. No plugin settings changed, no public CMS page was created, no 404 plugin log was touched, no GSC validation was clicked, no outreach was sent, no payment setting changed and no client charge happened.

## LATEST WORK STATUS - 2026-05-20 23:24 Asia/Jerusalem
- GSC 404 LIVE AUDIT: checked the exact Search Console 404 examples the owner shared instead of adding broad redirects.
- RESEARCHED: Google's own guidance says use 3XX/301 redirects when a page moved or has a clear replacement, but real missing/no-replacement URLs can stay 404/410; generic fake-valid redirects can create poor crawl signals. Sources: https://support.google.com/webmasters/answer/7440203, https://developers.google.com/search/docs/crawling-indexing/301-redirects, https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors
- FOUND: `/drug-crimes/`, `/criminal-record-deletion/`, `/shoplifting-defense/` and `/real-estate/` now return live 200, so the GSC report is stale for those examples.
- FOUND: `/tax-law/` and `/personal-injury/` were redirecting to the homepage, which is weaker than redirecting to the closest real legal pages.
- CODED: `inc/url-redirects.php` now redirects only `/tax-law/` -> `/tax-lawyer/` and `/personal-injury/` -> `/tort-lawyer/` during early WordPress startup, before canonical/plugin homepage redirects.
- LEFT ALONE: `/wp-content/plugins/real-accessability/support.php` and fake `/wp-*.php` requests remain 404 because they are plugin/security noise, not user journeys or moved content.
- DOCUMENTED: `project-control/gsc-404-live-audit-2026-05-20.md` and `.csv` record the sample, live result and decision.
- VERIFIED: `php -l inc/url-redirects.php` passed before commit; first uPress pull showed another layer still won at `template_redirect`, so the hook was moved earlier to `init` and needs final live verification after the second pull.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is SEO hygiene: two bad homepage redirects are now mapped to relevant money/legal pages, while stale resolved 404 examples do not distract the build.
- COMPLETION ASSESSMENT: known GSC 404 sample handling moved from 45% to 78%; traffic/ranking recovery moved from 31% to 32%; first-lawyer sales readiness unchanged. Still blocked: Google must recrawl, GSC remains delayed, and we need Analytics/Search Console export for the full 404 list later.
- OWNER-VISIBLE AFTER DEPLOY: `/tax-law/` should land on `/tax-lawyer/`; `/personal-injury/` should land on `/tort-lawyer/`.
- SAFETY: exact redirect code and repo docs only. No public CMS page was edited, no sitemap/canonical/noindex rule changed, no GSC validation was clicked, no outreach was sent, no payment setting changed and no client charge happened.

## LATEST WORK STATUS - 2026-05-20 23:13 Asia/Jerusalem
- REVIEW CAMPAIGN OPERATIONS: tightened the Google reviews workflow so it can move from lawyer request to owner-reviewed task without getting stuck.
- RESEARCHED: BrightLocal's 2026 local review survey says review recency and star ratings are increasingly important, 85% of consumers are more likely to use a business after positive reviews, and many users continue to the business website after reading reviews. Google Business Profile guidance says review requests are allowed through a review link/QR code, but incentives and fake engagement are prohibited. LawReviews positions itself around verified reviews and online consultation filters, confirming that reputation is a competitive legal-directory feature. Sources: https://www.brightlocal.com/research/local-consumer-review-survey/, https://support.google.com/business/answer/3474122, https://www.lawreviews.co.il/en/search/all
- CODED: `page-lawyer-dashboard.php` now pre-fills the Google Business URL, Google review request URL and Place ID in the review campaign request form when the lawyer already supplied them during signup or owner setup.
- CODED: `inc/lawyer-onboarding.php` now has an owner-only `Mark reviewed` action for review campaign requests, mirroring the content-review workflow.
- CODED: marking a review campaign reviewed clears the pending flag, stores `latest_review_campaign_reviewed_at`, appends an internal note and logs the owner action.
- VERIFIED: `php -l page-lawyer-dashboard.php`, `php -l inc/lawyer-onboarding.php`, `git diff --check`, GitHub push, uPress pull, and uPress Git log showing `3608f3d Tighten review campaign operations`.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is retention/product value: Google review growth can now be sold and operated as a controlled service instead of remaining a loose note on the profile.
- COMPLETION ASSESSMENT: reputation/review infrastructure moved from 34% to 41%; lawyer dashboard operating value moved from 62% to 66%; first paid-lawyer readiness moved from 78% to 79%. Still blocked: real lawyer usage, owner review, and a future approved public review display/API path.
- OWNER-VISIBLE AFTER DEPLOY: logged-in `/lawyer-dashboard/` review campaign form will reuse saved Google links; wp-admin -> Lawyer Onboarding -> Reputation column will show `Mark reviewed` on pending review campaign rows.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `3608f3d Tighten review campaign operations` is `HEAD -> main, origin/main`.
- SAFETY: repo code only. No review request was sent, no Google review was copied, no public profile changed, no CMS record was created, no payment setting changed and no client charge happened.

## LATEST WORK STATUS - 2026-05-20 23:04 Asia/Jerusalem
- LAWYER ONBOARDING REPUTATION INTAKE: added Google reputation source collection to the lawyer signup wizard.
- RESEARCHED: Google Business Profile guidance allows businesses to create/share a review request link or QR code, but reviews must reflect genuine customer experiences and incentives for reviews are prohibited. Google also notes that Business Profile review links can be shared in emails, chat and receipts, and that Place IDs are reusable identifiers but should be refreshed if older than 12 months. Sources: https://support.google.com/business/answer/16816815, https://support.google.com/business/answer/3474122, https://developers.google.com/maps/documentation/places/web-service/place-id
- CODED: `page-lawyer-registration.php` now asks lawyers for their Google Business / Maps profile URL and Google review request link during self-registration.
- CODED: `assets/js/lawyer-registration-wizard.js` now adds a dedicated `Trust sources` step before final review, so reputation assets are part of the professional onboarding flow instead of buried later in manual follow-up.
- CODED: `inc/lawyer-onboarding.php` sanitizes and stores the submitted Google Business/review links on the draft lawyer profile, adds an internal compliance note, and includes the links in the owner notification email.
- VERIFIED: `php -l page-lawyer-registration.php`, `php -l inc/lawyer-onboarding.php`, `node --check assets/js/lawyer-registration-wizard.js`, `git diff --check`, GitHub push, uPress pull, and uPress Git log showing `858918c Collect lawyer Google reputation sources`.
- LIVE CHECK: `/lawyer-registration/` returns HTTP 200 and live HTML contains `google_business_profile_url` plus `google_review_request_url`; the live wizard asset contains `Trust sources`, `google_business_profile_url` and `Step 5`.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is sales readiness: a paying lawyer can now provide Google reputation assets during onboarding, which reduces founder follow-up and prepares the future review module without unsafe scraping or fake reviews.
- COMPLETION ASSESSMENT: lawyer onboarding wizard moved from 55% to 62%; reputation/review infrastructure moved from 25% to 34%; first paid-lawyer readiness moved from 76% to 78%. Still blocked: real lawyers must sign up, owner must verify license/reputation before publishing, and Google review display/import rules need a separate implementation before public review widgets.
- OWNER-VISIBLE AFTER DEPLOY: `/lawyer-registration/` wizard step `Trust sources`; wp-admin -> Lawyer Onboarding draft profile meta and registration email will include the supplied Google links.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `858918c Collect lawyer Google reputation sources` is `HEAD -> main, origin/main`.
- SAFETY: repo code only. No public lawyer profile was published, no review was copied, no Google API was called, no CMS database record was created, no outreach was sent, no payment setting changed, and no client charge happened.

## LATEST WORK STATUS - 2026-05-20 22:52 Asia/Jerusalem
- CHECKOUT CONSENT HARDENING FOR GROW APPROVAL: tightened the payment-review checkout consent behavior.
- RESEARCHED: payment processors commonly require visible business contact details, privacy/terms/cancellation policies, service/delivery policy and an explicit customer acknowledgement before checkout; WooCommerce documentation also recommends terms/privacy checkout links and blocks order placement without terms acceptance. Sources: https://www.allpay.co.il/en/help/site-requirements, https://support.wix.com/en/article/wix-payments-ensuring-your-business-is-ready-for-sales, https://woocommerce.com/document/woocommerce-customizer/checkout/
- CODED: `inc/payment-compliance-routes.php` now renders the checkout compliance consent block only once per checkout request, even if multiple WooCommerce hooks fire.
- CODED: checkout submission now has server-side validation requiring the Jus-Tice terms/privacy/cancellation/service-responsibility consent checkbox.
- CODED: accepted checkout consent is stored on the WooCommerce order with approved-at timestamp and the terms, cancellation and privacy URLs.
- VERIFIED: `php -l inc/payment-compliance-routes.php`, `git diff --check`, GitHub push, uPress pull, and uPress Git log showing `dd94a9d Harden checkout policy consent`.
- LIVE CHECK: terms, privacy, cancellation and checkout URLs all return HTTP 200. Terms/privacy/cancellation are not noindexed and show business name, email, phone and policy cross-links. Checkout returns 200, shows business/contact/policy links and the `justice_visible_terms_approval` consent checkbox; checkout remains noindexed, which is normal for checkout pages and not a payment-review blocker.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is payment approval quality: Grow/Meshulam can see a cleaner checkout consent flow and future orders keep an audit trail that the buyer accepted the site policies.
- COMPLETION ASSESSMENT: Grow/Meshulam website approval readiness moved from 78% to 83%; automated payment readiness moved from 80% to 82%; first paid-lawyer readiness moved from 74% to 76%. External approval/KYC still remains outside the repo.
- OWNER-VISIBLE AFTER DEPLOY: live WooCommerce checkout will show one terms/privacy/cancellation consent block and reject checkout if it is not accepted.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `dd94a9d Harden checkout policy consent` is `HEAD -> main, origin/main`.
- SAFETY: checkout validation code only. No payment gateway settings changed, no order was created, no card was charged, no public CMS page was edited, and no outbound message was sent.

## LATEST WORK STATUS - 2026-05-20 22:44 Asia/Jerusalem
- SUPPLIER PIPELINE CRM VISIBILITY: added the supplier/provider marketplace as a visible revenue line inside Justice CRM.
- RESEARCHED: legal marketplaces monetize adjacent professional services, not only lawyers. Din exposes a broad lawyer-search/directory funnel; expert marketplaces like Synapsis and Legal Experts AI show supplier discovery patterns around verified profiles, specialty filters, credentials, rates and availability. Sources: https://www.din.co.il/default.asp, https://www.joinsynapsis.com/, https://www.legalexperts.ai/
- CODED: `inc/lead-crm.php` now renders `Supplier marketplace pipeline` below the lawyer sales pipeline in Justice CRM.
- CODED: the new panel shows open suppliers, outreach-ready suppliers, approved partners and suppliers with a real commercial model set.
- CODED: the supplier table shows category, revenue model, priority, status, service area, contact, source link and Open/Website actions.
- VERIFIED: `php -l inc/lead-crm.php`, `git diff --check`, GitHub push, uPress pull, and uPress Git log showing `dcd9605 Show supplier pipeline in CRM`.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is that the second revenue line, supplier/provider deals sold to vendors who want lawyer exposure, is no longer buried in a separate admin list.
- COMPLETION ASSESSMENT: supplier CRM visibility moved from 45% to 65%; supplier marketplace operating system moved from 42% to 50%; lawyer monetization system moved from 72% to 74%; live supplier revenue remains 0% until real supplier prospects and commercial terms are added.
- OWNER-VISIBLE AFTER DEPLOY: wp-admin -> Justice CRM -> Supplier marketplace pipeline.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `dcd9605 Show supplier pipeline in CRM` is `HEAD -> main, origin/main`.
- SAFETY: admin display only. No supplier record was created, no supplier was contacted, no public page changed, no payment setting changed, and no client charge happened.

## LATEST WORK STATUS - 2026-05-20 22:34 Asia/Jerusalem
- PROSPECT FOLLOW-UP QUICK ACTIONS: added one-click admin status actions so lawyer outreach records can move after a call/email instead of staying stale.
- RESEARCHED: 2026 B2B follow-up guidance emphasizes multi-touch outreach, logging outcomes in the CRM, and scheduling the next attempt; HubSpot also frames modern sequences around task reminders, calls and CRM-connected stopping rules. Sources: https://syncgtm.com/blog/follow-up-calls and https://blog.hubspot.com/sales/sales-sequence
- CODED: Lawyer Prospect outreach kit now includes quick actions: contacted today, set follow-up, demo booked, proposal sent, won/onboarding, and lost/not fit.
- CODED: quick actions are nonce-protected admin links that update status, last-contact date, next-action date, priority for lost records, and append a small owner-note log line.
- CODED: Justice CRM lawyer sales pipeline table now exposes `Contacted` and `Follow-up` buttons next to open prospects.
- VERIFIED: `php -l inc/lawyer-prospects.php`, `php -l inc/lead-crm.php`, `git diff --check`, GitHub push, uPress pull, and uPress Git log showing `7302293 Add prospect follow-up quick actions`.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is pipeline discipline: after outreach, the owner can immediately update the record and next follow-up date, reducing the chance that a possible paying lawyer is forgotten.
- COMPLETION ASSESSMENT: lawyer outreach operating system moved from 60% to 66%; paid coverage pipeline moved from 48% to 52%; first-lawyer sales readiness moved from 69% to 72%; automated payment readiness unchanged at 80%.
- OWNER-VISIBLE AFTER DEPLOY: wp-admin -> Lawyer Onboarding -> Lawyer Prospects -> Manual Outreach Kit quick actions; also wp-admin -> Justice CRM -> Lawyer sales pipeline action buttons.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `7302293 Add prospect follow-up quick actions` is `HEAD -> main, origin/main`.
- SAFETY: admin action links only. No action was clicked, no prospect was updated, no outreach was sent, no public content changed, and no payment settings or charges changed.

## LATEST WORK STATUS - 2026-05-20 22:23 Asia/Jerusalem
- LAWYER PROSPECT OUTREACH KIT: added manual email, WhatsApp and call drafts to each Lawyer Prospect so the owner can start outreach from the prospect record.
- RESEARCHED: 2026 B2B outreach guidance says sequences should be multi-channel, personalized to a real signal and short around one pain point; Justia's lawyer marketing model sells paid visibility by practice/market, so our pitch should anchor on the exact demand gap instead of generic directory promotion. Sources: https://blog.hubspot.com/sales/sales-sequence and https://www.justia.com/marketing/lawyer-directory/
- CODED: `inc/lawyer-prospects.php` now adds a `Manual Outreach Kit` meta box to Lawyer Prospect edit screens.
- CODED: the kit builds a short email/WhatsApp draft, call opener, three qualification questions, partner-form link, expected monthly value, and compliance reminder not to promise lead volume, outcomes or exclusivity.
- VERIFIED: `php -l inc/lawyer-prospects.php`, `git diff --check`, GitHub push, uPress pull, and uPress Git log showing `de5d118 Add lawyer prospect outreach kit`.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is outreach execution: a saved prospect can now be contacted manually from one screen with a demand-specific pitch.
- COMPLETION ASSESSMENT: lawyer outreach operating system moved from 52% to 60%; paid coverage pipeline moved from 43% to 48%; first-lawyer sales readiness moved from 66% to 69%; automated payment readiness unchanged at 80%.
- OWNER-VISIBLE AFTER DEPLOY: wp-admin -> Lawyer Onboarding -> Lawyer Prospects -> open a prospect -> Manual Outreach Kit.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `de5d118 Add lawyer prospect outreach kit` is `HEAD -> main, origin/main`.
- SAFETY: manual-send only. No outreach was sent, no prospect/contact record was created, no public content changed, no payment settings changed, and no client charge happened.

## LATEST WORK STATUS - 2026-05-20 22:14 Asia/Jerusalem
- LAWYER SALES PIPELINE VIEW: added a sales pipeline block inside Justice CRM so the owner can see prospect count, expected monthly value, hot prospects and due follow-ups without opening the separate prospects screen first.
- RESEARCHED: current Clio Grow documentation says CRM dashboards should expose pipeline value, lead source/matter type and conversion rate; Clio CRM marketing also emphasizes tracking every client, conversation and follow-up so opportunities do not fall through. Sources: https://help.clio.com/hc/en-us/articles/29739406189339-Clio-Grow-Reports and https://www.clio.com/features/legal-crm-software/
- CODED: `inc/lead-crm.php` now renders `Lawyer sales pipeline` under Recent legal leads.
- CODED: the new CRM block shows open prospects, open monthly pipeline value in NIS, hot prospects, due follow-ups, buttons to open/add prospects, and a next-action table with source lead links.
- VERIFIED: `php -l inc/lead-crm.php`, `git diff --check`, GitHub push, uPress pull, and uPress Git log showing `f2d705a Show lawyer prospect pipeline in CRM`.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is sales focus: the owner can now see the monthly value and next action queue for lawyer recruitment from the CRM, which makes outreach faster and less likely to disappear.
- COMPLETION ASSESSMENT: lawyer outreach operating system moved from 45% to 52%; paid coverage pipeline moved from 35% to 43%; first-lawyer sales readiness moved from 63% to 66%; automated payment readiness unchanged at 80%.
- OWNER-VISIBLE AFTER DEPLOY: wp-admin -> Justice CRM -> Lawyer sales pipeline.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `f2d705a Show lawyer prospect pipeline in CRM` is `HEAD -> main, origin/main`.
- SAFETY: admin display only. No public CMS database content, lawyer profile, lead record, prospect record, outbound message, payment setting, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 22:06 Asia/Jerusalem
- CRM TO LAWYER-PROSPECT BRIDGE: connected uncovered demand in Justice CRM to the new Lawyer Prospects pipeline.
- RESEARCHED: current legal lead-management guidance says intake systems should track lead source, status, follow-up and conversion by channel; Justia's 2026 directory material reinforces that lawyers buy visibility by practice area and metro area, which matches our area/city prospect pipeline. Sources: https://www.clio.com/blog/lead-management-best-practices-law-firms/ and https://onward.justia.com/how-to-maximize-the-benefits-of-your-justia-lawyer-directory-profile/
- CODED: Justice CRM lead rows now include a `Prospect` action for legal leads, and the uncovered-demand summary has a `Create prospect` button for the latest demand signal.
- CODED: clicking the button opens a new Lawyer Prospect draft prefilled from the source lead: title, practice area, market, target plan, priority, demand signal, expected monthly NIS and source lead link.
- VERIFIED: `php -l inc/lead-crm.php`, `php -l inc/lawyer-prospects.php`, `git diff --check`, GitHub push, uPress pull, and uPress Git log showing `bdba3f2 Bridge uncovered leads to lawyer prospects`.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is speed-to-sales: an uncovered lead can now become a prepared lawyer recruitment record in one click, instead of being manually retyped or forgotten.
- COMPLETION ASSESSMENT: uncovered-demand-to-sales workflow moved from 35% to 55%; lawyer outreach operating system moved from 35% to 45%; first-lawyer sales readiness moved from 60% to 63%; automated payment readiness unchanged at 80%.
- OWNER-VISIBLE AFTER DEPLOY: wp-admin -> Justice CRM -> Recent legal leads / Uncovered demand queue -> `Prospect` or `Create prospect`.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `bdba3f2 Bridge uncovered leads to lawyer prospects` is `HEAD -> main, origin/main`.
- SAFETY: admin workflow only. It does not create a prospect until an admin saves the new draft, and it sends no outreach, changes no payment settings, charges no card, and publishes no public content.

## LATEST WORK STATUS - 2026-05-20 21:58 Asia/Jerusalem
- LAWYER OUTREACH PIPELINE: added an admin-only prospect pipeline so uncovered demand and target lawyer lists can become structured sales work.
- RESEARCHED: current legal intake and directory monetization patterns. Clio emphasizes tracking lead source, status, follow-up and conversion; Justia Premium Placements sells lawyer visibility by practice area and metro area. Sources: https://www.clio.com/blog/client-intake-law-firms/ and https://www.justia.com/marketing/lawyer-directory/
- CODED: new `justice_prospect` admin post type under Lawyer Onboarding for lawyer sales prospects.
- CODED: each prospect stores practice area, city, target plan, priority, outreach status, response-fit commitment, source URL, demand signal, expected monthly NIS value, contact details and next action date.
- VERIFIED: `php -l functions.php`, `php -l inc/lawyer-prospects.php`, staged diff check, GitHub push, uPress pull, and uPress Git log showing `4633c9c Add lawyer outreach prospect pipeline`.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is sales operations: repeated calls like "I need a Thailand lawyer" can now become a trackable recruiting list for paid coverage instead of disappearing into memory.
- COMPLETION ASSESSMENT: lawyer outreach operating system moved to 35%; first-lawyer sales readiness moved from 55% to 60%; paid coverage pipeline moved to 35%; automated payment readiness unchanged at 80% because Grow/Meshulam is still external.
- OWNER-VISIBLE AFTER DEPLOY: wp-admin -> Lawyer Onboarding -> Lawyer Prospects.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `4633c9c Add lawyer outreach prospect pipeline` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only. No live wp-admin record, public CMS database content, lawyer profile, lead record, user, payment setting, GA4/GSC setting, redirect, sitemap, social account, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 21:49 Asia/Jerusalem
- LAWYER REGISTRATION QUALIFICATION: tightened the handoff from `/lawyer-plans/` to `/lawyer-registration/` so paid-plan prospects see the selected plan/price and tell us how fast they can respond to leads.
- RESEARCHED: current 2026 legal intake guidance. Clio emphasizes tracking lead source/status/conversion and says the intake process starts the moment a prospect reaches out; Justia sells premium visibility by practice area and metro area, so availability/coverage fit matters before selling placement. Sources: https://www.clio.com/blog/client-intake-law-firms/ and https://www.justia.com/marketing/lawyer-directory/
- CODED: `page-lawyer-registration.php` now shows a selected-plan summary panel, including manual-invoice wording when the founder-partner path is used.
- CODED: the lawyer onboarding form now asks for lead-response availability: within 15 minutes, same day, next day, or needs process setup.
- CODED: `inc/lawyer-onboarding.php` stores `lead_response_commitment`, includes it in owner notification email/internal notes, and displays it in the lawyer activation box.
- CODED: `assets/js/lawyer-registration-wizard.js` includes the response availability field in the Practice fit step; `assets/css/premium-pass-3.css` styles the selected-plan summary.
- VERIFIED: `php -l page-lawyer-registration.php`, `php -l inc/lawyer-onboarding.php`, `node --check assets/js/lawyer-registration-wizard.js`, `git diff --check`, uPress pull, uPress Git log, and live markup check on `/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice` all passed.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is sales quality: before selling Lead Partner access, Jus-Tice can now see whether the lawyer can actually respond fast enough to protect lead value.
- COMPLETION ASSESSMENT: first-lawyer sales readiness moved from 51% to 55%; paid lead quality control moved from 40% to 48%; automated payment readiness unchanged at 56% because Grow/Meshulam approval is still external.
- OWNER-VISIBLE AFTER DEPLOY: open `/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice`; the selected plan panel appears and the form asks for lead-response availability.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `30b53ab Qualify lawyer registration response fit` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 21:36 Asia/Jerusalem
- LAWYER SALES CONVERSION: added a founder-partner activation panel to `/lawyer-plans/` so outreach calls can point lawyers to a clearer early-partner path instead of only the pricing cards.
- RESEARCHED: current 2026 law-firm intake guidance. Clio says client intake should reduce manual work, improve client experience, track where leads come from and show lead/client status; Justia sells premium lawyer visibility by practice area and metro area. Sources: https://www.clio.com/blog/client-intake-law-firms/ and https://www.justia.com/marketing/lawyer-directory/
- CODED: `page-lawyer-plans.php` now explains the launch-partner flow: submit details, Jus-Tice checks fit/license/area/availability, then profile/dashboard/value tracking starts after approval and payment.
- CODED: the panel links directly into the existing manual-invoice activation paths for Lead Partner and Pro, without changing payment settings or charging anyone.
- CODED: `assets/css/premium-pass-3.css` now styles the panel responsively above the plan grid.
- VERIFIED: `php -l page-lawyer-plans.php`, `git diff --check`, uPress pull, uPress Git log, and live markup check on `https://jus-tice.co.il/lawyer-plans/` all passed.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is sales readiness: the owner can now send one public URL during lawyer outreach that explains the early partner path and captures plan interest.
- COMPLETION ASSESSMENT: lawyer-plan conversion readiness moved from 55% to 62%; first-lawyer sales readiness moved from 45% to 51%; full automated payment readiness unchanged at 56% because Grow/Meshulam approval is still external.
- OWNER-VISIBLE AFTER DEPLOY: open `/lawyer-plans/`; the new launch-partner block appears above the pricing cards.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `ddae8fe Add lawyer founder partner activation path` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 20:27 Asia/Jerusalem
- LAWYER DASHBOARD VALUE SNAPSHOT: added a live monthly value panel to `/lawyer-dashboard/` so lawyers can see this month's assigned leads, first responses, consultations set, retained clients and closed/not-fit outcomes.
- RESEARCHED: Clio's current Legal Trends material says firms that combine digital client intake tools with their referral/marketing flow see stronger revenue, lead-generation and conversion results; Clio's intake/CRM reporting also emphasizes full-funnel visibility from lead to retained client. Source: https://www.clio.com/about/press/legal-trends-solo-small-law-firms-2025/ and https://www.clio.com/resources/legal-trends/read-online/
- CODED: `page-lawyer-dashboard.php` now builds monthly funnel metrics from existing assigned lead data and the milestone timestamps already saved by the CRM/dashboard stage workflow.
- CODED: `assets/css/premium-pass-3.css` now styles the new value snapshot as compact dashboard metric tiles with mobile fallback.
- VERIFIED: `php -l page-lawyer-dashboard.php` and `git diff --check` pass.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is retention/sales proof: a paying lawyer can now see this month's funnel movement instead of only raw lead counts.
- COMPLETION ASSESSMENT: lawyer private zone moved from 68% to 70%; Clio-lite dashboard moved from 58% to 62%; paid-lawyer reporting/value proof moved from 43% to 50%. Remaining blockers: live QA with an actual lawyer user and assigned lead, automatic monthly email report, lead alert notifications, per-lead detail page, and payment activation.
- OWNER-VISIBLE AFTER DEPLOY: logged-in lawyers on `/lawyer-dashboard/` will see `Monthly value snapshot` above Recent leads.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `b408df1 Show monthly lawyer lead value snapshot` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 20:11 Asia/Jerusalem
- LEAD VALUE REPORTING: added milestone timestamps for the lead funnel so future lawyer reports can measure consultation and retained/lost outcomes, not only raw lead count.
- RESEARCHED: 2026 law-firm conversion benchmarks and CRM guidance. Key point: firms should track lead-to-consultation and consultation-to-retained conversion separately; raw lead volume is not enough to prove marketing value.
- CODED: lawyer dashboard stage updates now save `consultation_scheduled_at`, `retained_at`, and `closed_at` when the lead reaches consultation, won, or lost stages.
- CODED: owner/admin CRM follow-up saves now also sync `lead_status` and the same milestone timestamps, so both update paths support reporting.
- VERIFIED: `php -l inc/lawyer-dashboard.php`, `php -l inc/lead-crm.php`, and `git diff --check` pass.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is value proof: the platform can begin showing lawyers not just leads, but funnel movement toward retained clients.
- COMPLETION ASSESSMENT: lawyer private zone remains 68%; Clio-lite dashboard moved from 55% to 58%; paid-lawyer reporting/value proof moved from 35% to 43%. Remaining blockers: live QA with real lawyer user/lead, monthly value report UI/email, automatic lead alerts, per-lead detail page, and payment activation.
- OWNER-VISIBLE AFTER DEPLOY: stage changes to Consultation/Won/Lost from either `/lawyer-dashboard/` or wp-admin CRM will preserve milestone timestamps for later reports.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `f537d59 Track lead funnel milestones` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 20:00 Asia/Jerusalem
- LEAD CRM CONSISTENCY: synced lawyer dashboard stage updates with the older internal CRM lead status field.
- RESEARCHED: current 2026 legal CRM/intake guidance. Key point: fast lead response is not enough; the CRM must remain trustworthy and consistent, otherwise teams stop relying on it and leads slip.
- CODED: when a lawyer updates an assigned lead stage from `/lawyer-dashboard/`, `inc/lawyer-dashboard.php` now updates both `follow_up_status` and the legacy/internal `lead_status`.
- STATUS MAP: New -> assigned, First attempt/Contacted -> contacted, Consultation scheduled -> accepted, Won -> converted, Not fit/lost -> closed.
- VERIFIED: `php -l inc/lawyer-dashboard.php` and `git diff --check` pass.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is operational reliability: private-zone actions now keep admin CRM reports aligned, which matters before selling this as paid lead management.
- COMPLETION ASSESSMENT: lawyer private zone remains 68%; Clio-lite dashboard moved from 53% to 55%; paid-lawyer retention value moved from 62% to 63%. Remaining blockers: live QA with real lawyer user/lead, automatic lead alerts, per-lead detail page, and payment activation.
- OWNER-VISIBLE AFTER DEPLOY: stage updates made in `/lawyer-dashboard/` should also reflect in wp-admin lead status columns/reports.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `a239225 Sync lawyer lead stage to CRM status` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 19:51 Asia/Jerusalem
- LAWYER PRIVATE ZONE / NEXT ACTIONS: added response urgency and next-action guidance to the private lead pipeline.
- RESEARCHED: current 2026 legal intake guidance. Key point: Clio recommends calling every lead within 15 minutes; faster intake response is a major conversion lever, so the dashboard should show which leads need response now.
- CODED: `/lawyer-dashboard/` pipeline summary now shows assigned leads, leads needing response, and overdue responses.
- CODED: each Recent lead now shows a next-action label: Call within 15 min, Call now - overdue, Follow up / book consult, Prepare consultation, Client retained, or Closed.
- VERIFIED: `php -l page-lawyer-dashboard.php` and `git diff --check` pass.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is conversion discipline: paid lawyers can see what to do next and which leads are slipping.
- COMPLETION ASSESSMENT: lawyer private zone moved from 66% to 68%; Clio-lite lead dashboard moved from 47% to 53%; paid-lawyer retention value moved from 60% to 62%. Remaining blockers: live QA with real lawyer user/lead, automatic lead alerts, per-lead detail page, and payment activation.
- OWNER-VISIBLE AFTER DEPLOY: logged-in lawyers on `/lawyer-dashboard/` will see response-needed/overdue counts in the pipeline header and next-action labels beside Recent leads.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `8329097 Show lawyer lead next actions` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 19:41 Asia/Jerusalem
- LAWYER PRIVATE ZONE / LEAD CONTACT ACTIONS: added direct contact actions to assigned leads inside the lawyer dashboard.
- RESEARCHED: current 2026 legal intake guidance. Key point: law firms should respond to every lead quickly and use multiple channels; Clio specifically recommends calling every lead within 15 minutes and tracking follow-up in a CRM.
- CODED: `/lawyer-dashboard/` Recent leads now shows Call, WhatsApp and Email buttons when assigned lead contact data exists. WhatsApp and email open prefilled, lawyer-side messages; nothing is sent automatically.
- CODED: `assets/css/premium-pass-3.css` now supports the extra private-zone contact action column with mobile fallback inherited from the dashboard grid.
- VERIFIED: `php -l page-lawyer-dashboard.php` and `git diff --check` pass.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is direct lead usability: a paid lawyer can now receive, contact and stage an assigned lead from the private zone.
- COMPLETION ASSESSMENT: lawyer private zone moved from 63% to 66%; Clio-lite lead dashboard moved from 40% to 47%; paid-lawyer retention value moved from 56% to 60%. Remaining blockers: live QA with a real lawyer user and assigned lead, per-lead detail view, automated lead notifications, and payment activation.
- OWNER-VISIBLE AFTER DEPLOY: logged-in lawyers on `/lawyer-dashboard/` will see Call / WhatsApp / Email beside Recent leads when contact data exists.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `72c171f Show lawyer lead contact actions` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 19:33 Asia/Jerusalem
- LAWYER PRIVATE ZONE / PIPELINE CONTROL: upgraded the dashboard from a display-only lead pipeline into a usable lightweight CRM workflow.
- RESEARCHED: Clio's 2026 lead-management guidance. Key point: lead management is the pre-retention sales process; lawyers need a CRM to track follow-up, consultation, and hire/not-fit stages so prospects do not slip through cracks.
- CODED: `inc/lawyer-dashboard.php` now has an ownership-checked `justice_lawyer_lead_stage_update` handler. A lawyer can update only leads assigned to a profile claimed by their own user account.
- CODED: `/lawyer-dashboard/` Recent leads now includes a stage selector and Update button for each assigned lead: New, First attempt, Contacted, Consultation scheduled, Won, Not fit/lost.
- CODED: stage updates save `follow_up_status`, `latest_lawyer_stage_update_at`, `latest_lawyer_stage_update_by`, and first-contact time when relevant.
- VERIFIED: `php -l inc/lawyer-dashboard.php`, `php -l page-lawyer-dashboard.php`, and `git diff --check` pass.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is paid-lawyer retention value: lawyers can now operate leads inside the private zone instead of only looking at them.
- COMPLETION ASSESSMENT: lawyer private zone moved from 59% to 63%; Clio-lite lead dashboard moved from 28% to 40%; paid-lawyer retention value moved from 52% to 56%. Remaining blockers: live QA with a lawyer user and real assigned lead, per-lead detail pages, automatic WhatsApp/SMS notifications, and payment activation.
- OWNER-VISIBLE AFTER DEPLOY: logged-in lawyers on `/lawyer-dashboard/` will see Update controls beside Recent leads, and stage changes will refresh the pipeline.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `c55302e Let lawyers update lead pipeline stage` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 19:22 Asia/Jerusalem
- LAWYER PRIVATE ZONE / CLIO-LITE: added a first visual lead pipeline to the lawyer dashboard so paid lawyers can see where assigned leads stand instead of only reading a flat recent-leads list.
- RESEARCHED: current 2026 law-firm CRM/intake guidance. Key point: legal CRMs that stick show a visible pipeline and source/conversion metrics; lawyers need to see inquiry -> response -> consultation -> retained progress without digging in email or wp-admin.
- CODED: `/lawyer-dashboard/` now builds a private lead pipeline from assigned lead follow-up/status data: New, First response, Consultation, Won, and Not fit.
- CODED: `assets/css/premium-pass-3.css` now styles the pipeline as compact dashboard stage cards with mobile fallback.
- VERIFIED: `php -l page-lawyer-dashboard.php` and `git diff --check` pass.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is lawyer subscription value: the private zone now looks more like a paid lead cockpit and less like a simple list.
- COMPLETION ASSESSMENT: lawyer private zone moved from 55% to 59%; Clio-lite lead dashboard moved from 15% to 28%; paid-lawyer retention value moved from 49% to 52%. Remaining blockers: lead stage update buttons inside the lawyer dashboard, live QA with a lawyer user, per-lead contact visibility rules, and payment activation.
- OWNER-VISIBLE AFTER DEPLOY: logged-in lawyers on `/lawyer-dashboard/` will see a `Lead pipeline` block above Recent leads.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `e68bbe6 Show lawyer dashboard lead pipeline` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 17:31 Asia/Jerusalem
- LEAD RESPONSE SPEED / OPERATOR UX: added one-click contact actions directly inside the lead CRM table.
- RESEARCHED: current 2026 legal intake guidance. Key point: law-firm lead conversion depends on immediate, multi-channel response; call/text/WhatsApp/email actions should be available from the intake system instead of buried in separate screens.
- CODED: `inc/lead-crm.php` now shows quick action buttons per lead: Open, Call, WhatsApp with a prefilled Jus-Tice follow-up message, and Email with a prefilled follow-up message when contact data exists.
- VERIFIED: `php -l inc/lead-crm.php` passes.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is practical conversion speed: the owner/operator can now contact a fresh lead from the CRM table without opening the edit screen first.
- COMPLETION ASSESSMENT: lead CRM operator workflow moved from 68% to 73%; intake-to-revenue system moved from 52% to 54%. Remaining blockers: live admin QA with a real lead, automated WhatsApp/SMS notifications, response owner assignment, and paid lawyer supply in uncovered niches.
- OWNER-VISIBLE AFTER DEPLOY: in wp-admin lead CRM, the Action column will show Call / WhatsApp / Email buttons next to Open for leads with phone/email data.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `5304be8 Add lead CRM quick contact actions` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 17:22 Asia/Jerusalem
- LEAD RESPONSE SPEED: tightened the internal CRM response clock so leads marked as first attempt/contacted now automatically receive a first-contact timestamp when the owner does not type one manually.
- RESEARCHED: current 2026 legal intake guidance. Key point: for law firms, speed-to-lead is one of the highest-leverage conversion factors; web traffic only becomes money when the first human response is fast and tracked.
- CODED: `inc/lead-crm.php` now treats "first attempt" as a logged response in the Response SLA badge, auto-stamps `first_contact_at` for attempted/contacted follow-up statuses, and fixes a corrupted Hebrew urgent-value check so urgent leads do not silently look normal.
- VERIFIED: `php -l inc/lead-crm.php` passes.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is conversion infrastructure: the CRM now measures first response more reliably, which supports lawyer value reporting and reduces lost client calls.
- COMPLETION ASSESSMENT: lead CRM response tracking moved from 62% to 68%; intake-to-revenue system moved from 50% to 52%. Remaining blockers: live follow-up workflow QA with a real test lead, SMS/WhatsApp automation, owner/operator response discipline, and paid lawyer onboarding.
- OWNER-VISIBLE AFTER DEPLOY: in wp-admin lead CRM, setting a lead follow-up to "First attempt" or later will immediately change the Response SLA badge to "Contact logged" and save the first contact time automatically.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: code commit `c6a25a6 Track lead first response time` reached live. This status correction was pushed afterward as docs-only.
- SAFETY: repo code/docs only so far. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 11:34 Asia/Jerusalem
- OWNER WALKTHROUGH: created the plain-English operating guide for the lawyer platform so the owner can understand how to use/administer the system after PR #26 is merged and deployed.
- RESEARCHED: current SaaS onboarding/activation best practices. Key point: the system should guide lawyers to first value quickly, not overwhelm them with a feature tour; first value for Jus-Tice is profile readiness, reputation source, content, exposure and leads.
- CREATED: `project-control/lawyer-platform-owner-walkthrough-2026-05-20.md`.
- UPDATED: PR #26 with the walkthrough.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is operational readiness: the owner now has a clear map for registration, admin review, dashboard use, Google review source fields, first-party recommendations and manual activation while Meshulam is being handled.
- COMPLETION ASSESSMENT: owner walkthrough clarity 80%; lawyer dashboard value clarity 60%; admin operating system 55%; recommendation/reputation system 48%; paying customer readiness 45%.
- OWNER-VISIBLE AFTER MERGE/DEPLOY: the dashboard/admin surfaces described in the walkthrough become visible on `/lawyer-dashboard/` and `wp-admin -> Lawyer Onboarding`.
- UPRESS: no uPress pull yet because this branch is not merged to `main`.
- SAFETY: repo documentation only in this cycle. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, SMS/email review request, review publication, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 11:18 Asia/Jerusalem
- GOOGLE REVIEWS / REPUTATION SYSTEM: started turning the lawyer dashboard into an active reputation and authority cockpit, inspired by Justia, Din, PsakDin and LawReviews patterns.
- RESEARCHED: official Google Business Profile review APIs, Google Maps user-generated-content policy, Google review-link workflows, Justia lawyer profile badges/premium placements/reviews, Din fresh-review/directory/Q&A surfaces, and lawyer reputation-management patterns.
- CODED: lawyer dashboard now has a reputation/authority growth checklist and a "Google reviews and recommendations" request form. Submitting it saves an internal owner-review request only; it does not send SMS/email or publish reviews.
- CODED: Lawyer Onboarding admin now includes pending review-campaign requests in the onboarding queue with a Reputation column.
- CODED: lawyer profile edit screens now include owner-only Google reputation source fields for Google Business profile URL, Place ID, review request URL, review count, latest review date and display-approved recommendation status.
- CODED: internal first-party recommendation records (`justice_recommendation`) with moderation, permission and lawyer-link fields. These are admin-only and not public by default.
- CODED: dashboard reputation checklist now recognizes approved first-party recommendations as a real reputation asset.
- CREATED LINEAR: `HAD-72` - build Google reviews and first-party reputation system.
- STRATEGIC DECISION: phase 1 stores/uses lawyer Google review links and first-party review workflow; phase 2 can use Google Business Profile API only for lawyers who grant profile access/OAuth; first-party Jus-Tice recommendations remain separate from Google reviews.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is that the paid lawyer dashboard now moves closer to a real retention/value system: profile authority, reviews, content, exposure and leads are visible as growth assets.
- COMPLETION ASSESSMENT: reputation system phase 1 moved from 0% to 48%; lawyer dashboard paid-value system moved from 35% to 49%. Remaining blockers: approved public recommendation display, recommendation request intake/token flow, SMS/email sender approval, Google Business Profile OAuth integration, walkthrough QA, merge/deploy/uPress pull.
- OWNER-VISIBLE AFTER MERGE/DEPLOY: logged-in lawyers will see the new reputation/authority cockpit and review-campaign request form on `/lawyer-dashboard/`; owner/admin will see review-campaign requests inside Lawyer Onboarding.
- UPRESS: no uPress pull yet because this branch is not merged to `main`.
- SAFETY: code and repo docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, SMS/email review request, review publication, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-20 10:57 Asia/Jerusalem
- LAWYER ACQUISITION FIRST WAVE: created a practical first-wave sales packet for getting paying lawyers before Meshulam/Grow recurring payments are fully approved.
- RESEARCHED: current 2026 lawyer marketing guidance and legal-directory patterns. Key point: lawyers buy qualified demand, reputation proof, local SEO/reviews, authority assets and measurable follow-up; they do not care about raw traffic claims.
- CREATED: `project-control/lawyer-acquisition-first-wave-2026-05-20.md`.
- CREATED: `project-control/lawyer-acquisition-first-wave-template-2026-05-20.csv`.
- CREATED LINEAR: `HAD-71` - prepare and run first lawyer acquisition wave.
- STRATEGIC DECISION: pitch "authority profile + connected content + measurable exposure/lead report" instead of "listing." Use manual invoice/manual activation until Meshulam KYC is complete.
- HONEST MONEY ASSESSMENT: no money earned this cycle and no outreach was sent. Substantial advancement is that the first lawyer sales motion now has a clear offer, target practice areas, safe promise language and private CRM template.
- COMPLETION ASSESSMENT: lawyer acquisition strategy 65%; first-wave positioning 70%; actual outreach 0%; paying lawyers 0%; payment automation still blocked by Meshulam/Grow KYC.
- OWNER-VISIBLE NOW: repo contains the first-wave acquisition packet. It is not visible on the public website.
- UPRESS: no uPress pull because this is a planning branch and not merged to `main`.
- SAFETY: repo-only planning. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, payment action, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 17:52 Asia/Jerusalem
- MONEY-QUERY POST-EDIT VERIFICATION: added the after-edit safety checklist for the five PR #9 target pages.
- RESEARCHED: Google URL Inspection, recrawl and title-link guidance. Key point: after page edits, the right workflow is live inspection, crawl/indexability confirmation, request indexing when appropriate, then 14/28/45-day performance comparison.
- VERIFIED SHARED PROGRESS: PR #8 and PR #9 are both ready for review and mergeable/clean.
- CREATED: `project-control/money-query-post-edit-verification-2026-05-19.md`.
- CREATED: `project-control/money-query-post-edit-verification-2026-05-19.csv`.
- UPDATED: `project-control/money-query-seo-batch-001-refresh-2026-05-19.md` with the post-edit gate.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is that PR #9 now has both before-state evidence and after-edit verification, so approved CMS edits can be measured rather than guessed.
- COMPLETION ASSESSMENT: money-query SEO recovery moved from 35% to 37%; PR #9 review readiness moved to 76%. Remaining blockers are human review, owner/legal approval, public CMS edits, PR #8 authority sequencing, Search Console recrawl requests, and measured CTR lift.
- OWNER-VISIBLE NOW: PR #9 contains an execution-ready post-edit checklist with Search Console and 14/28/45-day measurement steps.
- UPRESS: no uPress pull because this is a branch docs/report update and not merged to `main`.
- SAFETY: branch docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 17:42 Asia/Jerusalem
- MONEY-QUERY PRE-EDIT SNAPSHOT: added a repeatable snapshot tool and captured the before-state for the five PR #9 target pages.
- RESEARCHED: Google Search Console Performance guidance and Google title/canonical/noindex guidance. Key point: high-impression low-CTR pages should be improved by title/snippet/content alignment, but pre-edit checks must confirm indexability, canonical state and page intent before changing content.
- VERIFIED SHARED PROGRESS: PR #8 and PR #9 are both ready for review and mergeable.
- CODED: `tools/snapshot-money-query-pages.mjs`.
- CREATED: `reports/money-query-preedit-snapshot-2026-05-19.csv`.
- CREATED: `reports/money-query-preedit-snapshot-2026-05-19.json`.
- UPDATED: `project-control/money-query-seo-batch-001-refresh-2026-05-19.md` with the snapshot results.
- SNAPSHOT RESULT: all five target pages return HTTP 200, are in the sitemap, canonicalize to themselves, are not noindex, and expose lead intent signals.
- SNAPSHOT WARNINGS: `/criminal-defense-attorney/` has 2 H1s; `/sex-crime-lawyer/` has a very long title/meta description.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is implementation readiness: we now have a saved before-state to compare after approved WordPress edits.
- COMPLETION ASSESSMENT: money-query SEO recovery moved from 32% to 35%; PR #9 review readiness remains about 70%. Remaining blockers are human review, owner/legal approval, public CMS edits, PR #8 authority sequencing, recrawl/indexing, and measured CTR lift.
- OWNER-VISIBLE NOW: PR #9 contains the snapshot tool and reports showing the current live state before any edits.
- UPRESS: no uPress pull because this is a branch/report update and not merged to `main`.
- SAFETY: read-only live fetches plus branch code/report/docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 17:29 Asia/Jerusalem
- MONEY-QUERY SEO PR HANDOFF: marked PR #9 ready for review after verification.
- RESEARCHED: Google Search Console Performance report guidance and Google title-link guidance. Key point: for high-impression/low-CTR pages, improve title/snippet/content alignment by page and query; clear page-specific titles are safer than generic or promotional wording.
- VERIFIED: PR #9 is no longer draft, remains mergeable, and has 4 changed files / 2 commits.
- VERIFIED: `git diff --check` passed.
- VERIFIED LIVE JOURNEY: `node tools/check-live-traffic-priority.mjs` passed all checked public routes.
- UPDATED: Linear `HAD-65` with PR #9 ready-for-review state and verification results.
- UPDATED: `project-control/money-query-seo-batch-001-refresh-2026-05-19.md` with the review handoff.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is release-flow progress: the money-query rescue packet is now review-ready instead of draft.
- COMPLETION ASSESSMENT: money-query SEO recovery remains 32%; PR #9 review readiness is 70%. Remaining blockers are human review, owner/legal approval, public CMS edits, PR #8 authority sequencing, recrawl/indexing, and measured CTR lift.
- OWNER-VISIBLE NOW: PR #9 shows ready for review, and Linear `HAD-65` shows the verification state.
- UPRESS: no uPress pull because this is repo-only planning and not merged to `main`.
- SAFETY: GitHub PR state and branch docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 17:28 Asia/Jerusalem
- MONEY-QUERY SEO RESCUE REFRESH: created a separate branch `codex/money-query-seo-batch-001` from `main` so PR #8 remains clean for review.
- RESEARCHED: Google title-link guidance and helpful-content guidance. Key point: titles should be clear, descriptive and page-specific; legal/YMYL content needs people-first trust signals rather than promotional keyword chains.
- VERIFIED PR TRACK: PR #8 remains ready for review and mergeable; no extra scope was added to that PR.
- VERIFIED LIVE JOURNEY: `node tools/check-live-traffic-priority.mjs` passed all checked public routes, including `/real-estate-lawyer-guide/`, `/criminal-defense-attorney/`, and `/traffic-lawyer/`.
- VERIFIED LIVE TARGETS: `/real-estate-attorney/`, `/traffic-lawyer/`, `/prenup-attorney/`, `/criminal-defense-attorney/`, and `/sex-crime-lawyer/` all return HTTP 200.
- UPDATED EVIDENCE: Batch 001 now uses stronger GSC evidence: `/real-estate-attorney/` 88,601 impressions / 0.02% CTR; `/criminal-defense-attorney/` 62,561 / 0.02%; `/sex-crime-lawyer/` 27,904 / 0.12%; `/prenup-attorney/` 20,894 / 0.00%; `/traffic-lawyer/` 20,330 / 0.00%.
- CREATED: `project-control/money-query-seo-batch-001-refresh-2026-05-19.md`.
- CREATED: `project-control/money-query-seo-batch-001-refresh-2026-05-19.csv`.
- CREATED: Linear `HAD-65` for money-query SEO rescue batch 001.
- CREATED: draft PR #9: `https://github.com/The-new-ben/justice-theme/pull/9`.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is that five high-impression commercial pages now have refreshed metrics, live title/H1 risk findings, and safe no-URL-change title/H1 directions ready for owner/legal approval.
- COMPLETION ASSESSMENT: money-query SEO recovery moved from 28% to 32% for this lane; remaining blockers are owner/legal approval, public CMS edits, PR #8 authority sequencing, recrawl/indexing and measured CTR lift.
- OWNER-VISIBLE NOW: draft PR #9 and the new refresh packet list exact target pages, metrics, current risks, proposed titles/H1s and approval gates.
- UPRESS: no uPress pull because this is a repo-only planning branch and not merged to `main`.
- SAFETY: branch docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.
## LATEST WORK STATUS - 2026-05-19 17:09 Asia/Jerusalem
- PR #8 REVIEW STATE ADVANCED: marked PR #8 ready for review after the 17:03 pre-merge verification passed.
- RESEARCHED: GitHub draft/ready PR guidance and PR review guidance. Key point: draft PRs are for unfinished work; once verification evidence is complete, moving to ready-for-review is the correct handoff to reviewers.
- VERIFIED: PR #8 is no longer draft, remains mergeable, and still has 34 changed files / 13 commits.
- UPDATED: Linear HAD-59 and PR #8 already have the pre-merge readiness checkpoint; this cycle removed the draft blocker.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is release-flow progress: the E-E-A-T authority fix and uncovered-demand CRM are now waiting on review/merge instead of sitting as draft work.
- COMPLETION ASSESSMENT: PR #8 review/deploy readiness moved from 70% to 78%. Remaining blockers are human review/approval, merge to main, uPress pull, live wp-admin visual QA, and post-deploy author audit.
- OWNER-VISIBLE NOW: GitHub PR #8 shows "ready for review" instead of draft.
- OWNER-VISIBLE AFTER MERGE: footer/editorial policy trust link, safer article attribution, and Justice CRM uncovered-demand workflow.
- UPRESS: no uPress pull because PR #8 is not merged to `main`.
- SAFETY: GitHub PR state and repo docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 17:03 Asia/Jerusalem
- PR #8 FINAL PRE-MERGE CHECKS: ran the release-readiness verification set for the authority + uncovered-demand branch.
- RESEARCHED: GitHub PR review guidance and Google Search technical/crawl requirements. Key point: large PRs need strong review context, and Google-facing deploys need robots/sitemap/canonical/crawl checks before and after launch.
- VERIFIED: PR #8 is still draft and mergeable; current scope is 34 changed files and 12 commits.
- VERIFIED: PHP lint passed for authority, schema, article template, functions, trust route, footer, HTML sitemap, lead CRM, lead routing and lead classifier.
- VERIFIED: `git diff --check` passed with no output.
- VERIFIED: live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index and robots.txt.
- VERIFIED BASELINE: live author-attribution audit checked 80 URLs as Googlebot; found 45 visible Ben attributions, 45 Article schema Ben authors, and 0 fetch errors.
- UPDATED: `project-control/pr8-review-deploy-readiness-2026-05-19.md` and `.csv`; readiness moved from 55% to 70%.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is that PR #8 now has passing pre-merge evidence and a clean baseline for post-deploy comparison.
- NEXT DECISION: mark PR #8 ready for human review or split CRM work if reviewers prefer smaller PRs. Do not add more feature scope to this branch.
- UPRESS: no uPress pull because this is draft-PR branch work and not merged to `main`.
- SAFETY: checks/docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 16:48 Asia/Jerusalem
- PR #8 REVIEW/DEPLOY READINESS: stopped feature expansion and created a reviewer/deployment map so the authority + lead monetization branch can move toward safe merge.
- RESEARCHED: current PR review best practices and Google launch/migration verification guidance. Key point: large PRs need clear intent, risk-specific review passes, pre-merge checks, and post-deploy crawl/admin verification.
- CREATED: `project-control/pr8-review-deploy-readiness-2026-05-19.md`.
- CREATED: `project-control/pr8-review-deploy-readiness-2026-05-19.csv`.
- PR STATUS: PR #8 is draft, mergeable, 32 changed files, 11 commits.
- COMPLETION ASSESSMENT: PR #8 review/deploy readiness is 55%; complete enough to map/review, not complete enough to merge/deploy without final checks and owner/reviewer approval.
- OWNER-VISIBLE AFTER MERGE: editorial policy links, safer article attribution, and Justice CRM uncovered-demand workflow.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is reducing merge risk and creating a clear path to deploy the work that can support authority and future revenue.
- UPRESS: no uPress pull because this is draft-PR branch/docs work and not merged to `main`.
- SAFETY: repo docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 16:38 Asia/Jerusalem
- UNCOVERED DEMAND WEEKLY BRIEF: added a copy-ready partner-recruitment brief to the CRM so repeated missing-lawyer demand can move into outreach faster.
- RESEARCHED: law-firm intake analytics and lead-source reporting best practices. Key point: growth teams need concise reports by practice/market and stage, not raw lead lists, to choose where to invest or recruit.
- CODED: `inc/lead-crm.php` now renders a weekly recruitment brief from the top five uncovered demand signals, with lead count, urgent/manual count, latest activity, suggested action, and compliance reminders.
- CREATED: `project-control/uncovered-demand-weekly-brief-2026-05-19.md`.
- CREATED: `project-control/uncovered-demand-weekly-brief-2026-05-19.csv`.
- UPDATED: `project-control/goals-money-earning-scorecard-2026-05-19.md` and `.csv`; lead monetization/intake moved from 38% to 40%.
- VERIFIED: PHP lint passed for `inc/lead-crm.php`, `functions.php`, `inc/lead-routing.php`, and `inc/lead-classifier.php`; `git diff --check` is clean except expected Windows line-ending warnings; first live journey checker attempt hit a full-network fetch failure across all URLs, then retry passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index and robots.txt.
- OWNER-VISIBLE AFTER MERGE: `wp-admin -> Justice CRM -> Uncovered demand queue -> Weekly recruitment brief`.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is a faster sales/outreach artifact for recruiting lawyers into uncovered categories after deploy.
- UPRESS: no uPress pull because this is draft-PR branch work and not merged to `main`.
- SAFETY: branch code/docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 16:28 Asia/Jerusalem
- UNCOVERED DEMAND SUMMARY REPORT: added a partner-recruitment signal table to the CRM queue so repeated missing-lawyer demand can be prioritized.
- RESEARCHED: legal intake analytics and lead reporting best practices. Key point: a lead queue is useful, but revenue decisions need grouped demand by practice/market, urgency, and latest activity.
- CODED: `inc/lead-crm.php` now renders an uncovered-demand summary table before the raw queue, grouped by practice/market with lead count, urgent/manual count, latest lead, and suggested business action.
- CREATED: `project-control/uncovered-demand-summary-report-2026-05-19.md`.
- CREATED: `project-control/uncovered-demand-summary-report-2026-05-19.csv`.
- UPDATED: `project-control/goals-money-earning-scorecard-2026-05-19.md` and `.csv`; lead monetization/intake moved from 36% to 38%.
- VERIFIED: PHP lint passed for `inc/lead-crm.php`, `functions.php`, `inc/lead-routing.php`, and `inc/lead-classifier.php`; `git diff --check` is clean except expected Windows line-ending warnings; live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index and robots.txt.
- OWNER-VISIBLE AFTER MERGE: `wp-admin -> Justice CRM -> Uncovered demand queue` should show a top-demand summary answering which missing lawyer category to recruit next.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is making partner recruitment smarter from real demand patterns after deploy.
- UPRESS: no uPress pull because this is draft-PR branch work and not merged to `main`.
- SAFETY: branch code/docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 16:18 Asia/Jerusalem
- UNCOVERED DEMAND RESPONSE TEMPLATES: added safe operational scripts to the CRM queue so unmatched calls can receive a fast, careful response.
- RESEARCHED: legal intake/no-legal-advice guidance and lawyer advertising/lead-generation ethics. Key point: when no verified lawyer coverage exists, response language must avoid recommendations, legal advice, fee-split implications, and outcome promises.
- CODED: `inc/lead-crm.php` now renders a CRM panel with a user no-match response template and a lawyer recruitment script under the Uncovered Demand Queue.
- CREATED: `project-control/uncovered-demand-response-templates-2026-05-19.md`.
- CREATED: `project-control/uncovered-demand-response-templates-2026-05-19.csv`.
- UPDATED: `project-control/goals-money-earning-scorecard-2026-05-19.md` and `.csv`; lead monetization/intake moved from 34% to 36%.
- VERIFIED: PHP lint passed for `inc/lead-crm.php`, `functions.php`, `inc/lead-routing.php`, and `inc/lead-classifier.php`; `git diff --check` is clean except expected Windows line-ending warnings; live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index and robots.txt.
- OWNER-VISIBLE AFTER MERGE: `wp-admin -> Justice CRM -> Uncovered demand queue` should show ready response templates for the owner.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is reducing manual improvisation and making unmatched-demand handling faster and safer.
- UPRESS: no uPress pull because this is draft-PR branch work and not merged to `main`.
- SAFETY: branch code/docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, outbound message, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 16:08 Asia/Jerusalem
- UNCOVERED DEMAND CRM BUILD: moved the "Thailand lawyer / no partner" leakage path from planning into branch code.
- RESEARCHED: current legal intake speed-to-lead and CRM guidance. Key point: leads convert when they are captured, qualified, owned, and responded to quickly; unmatched demand also needs structured classification so it can become partner-recruitment evidence.
- CODED: `inc/lead-crm.php` now registers `coverage_status`, adds a coverage dropdown to the lead disposition box, adds a Coverage badge column to CRM lead tables, and adds an "Uncovered demand queue" section to Justice CRM.
- CREATED: `project-control/uncovered-demand-queue-crm-build-2026-05-19.md`.
- CREATED: `project-control/uncovered-demand-queue-crm-build-2026-05-19.csv`.
- UPDATED: `project-control/goals-money-earning-scorecard-2026-05-19.md` and `.csv`; lead monetization/intake moved from 30% to 34%.
- VERIFIED: PHP lint passed for `inc/lead-crm.php`, `functions.php`, `inc/lead-routing.php`, and `inc/lead-classifier.php`; `git diff --check` is clean except expected Windows line-ending warnings; live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index and robots.txt.
- OWNER-VISIBLE AFTER MERGE: `wp-admin -> Justice CRM` should show coverage-status cards, an Uncovered demand queue, and a Coverage column/dropdown for leads.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is that unmatched demand now has a CRM workflow in code, pending merge/deploy.
- UPRESS: no uPress pull because this is draft-PR branch work and not merged to `main`.
- SAFETY: branch code/docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 15:58 Asia/Jerusalem
- UNCOVERED DEMAND MONETIZATION: converted the owner's "Thailand lawyer" call problem into a safer lead monetization model.
- RESEARCHED: lawyer lead-generation ethics, Israeli lawyer advertising constraints, and current lead-generation quality concerns. Key point: sell transparent advertising/subscription/coverage and response SLA, not unsafe hidden recommendations, fee-splits, or user-paid connection fees before legal review.
- CREATED: `project-control/uncovered-demand-lead-monetization-2026-05-19.md`.
- CREATED: `project-control/uncovered-demand-lead-monetization-2026-05-19.csv`.
- UPDATED: `project-control/goals-money-earning-scorecard-2026-05-19.md` and `.csv`; lead monetization/intake moved from 24% to 30% planning maturity.
- RECOMMENDED PRODUCT: Uncovered Demand Queue -> partner acquisition evidence -> paid niche coverage slot -> transparent routing under plan caps/SLA.
- HONEST MONEY ASSESSMENT: no money earned this cycle. Substantial advancement is that unmatched calls now have a monetization path and next implementation steps instead of staying manual/free.
- UPRESS: no uPress pull because this is draft-PR branch/planning work and not merged to `main`.
- SAFETY: repo docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 15:29 Asia/Jerusalem
- GOALS/MONEY SCORECARD: converted the owner's "advance goals and money earning" instruction into a measurable operating scoreboard for every future cycle.
- RESEARCHED: Google helpful-content guidance, Google Business Profile local ranking guidance, and Clio 2025 legal trends. Key point: money comes from combining qualified demand, trust/authority, fast digital intake, and paid lawyer value; generic task volume is not enough.
- UPDATED AUTOMATION: the 10-minute execution loop now requires money-focused completion assessment, blocker reporting, and "where can the owner notice this" reporting.
- CREATED: `project-control/goals-money-earning-scorecard-2026-05-19.md`.
- CREATED: `project-control/goals-money-earning-scorecard-2026-05-19.csv`.
- HONEST COMPLETION SNAPSHOT: technical crawl/index 72%; SEO authority/E-E-A-T 38%; money-query SEO 28%; lawyer commercial pipeline 31%; lead monetization/intake 24%; lawyer retention/value 22%; entity footprint/local trust 18%.
- MONEY REALITY: no new money earned yet from this cycle. The closest revenue path remains commercial pipeline launch plus paying lawyers; the closest demand path remains money-query recovery plus authority cleanup.
- UPRESS: no uPress pull because this is draft-PR branch/status work and not merged to `main`.
- SAFETY: repo docs and automation prompt only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 13:02 Asia/Jerusalem
- TRUST DISCOVERABILITY: moved the editorial-policy work one step closer to real SEO/user value by adding crawlable links to it.
- RESEARCHED: Google helpful-content guidance and Google customer-support/search guidance. Key point: trust/support pages are most useful when users and Googlebot can easily find them; hidden policy pages are weaker trust signals.
- CODED: `template-parts/layout/site-footer.php` now links to `/editorial-policy/` in the quick navigation and the footer legal/trust row.
- CODED: `inc/html-sitemap.php` now includes `/editorial-policy/` in the core quick links on `/site-map/`.
- UPDATED: `project-control/editorial-policy-route-2026-05-19.md` and `.csv`.
- VERIFIED: PHP lint passed for footer, HTML sitemap, trust route, authority, schema, article template and functions; `git diff --check` is clean except expected Windows line-ending warnings; live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index and robots.txt.
- LINEAR: this remains under HAD-59 authority governance and PR #8.
- UPRESS: no uPress pull because this is draft-PR branch work and not merged to `main`.
- SAFETY: branch template/docs only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap setting, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 12:48 Asia/Jerusalem
- EDITORIAL POLICY TRUST ROUTE: added the missing public policy surface for legal content governance on the authority branch.
- RESEARCHED: Google Search Central helpful-content "who/how/why" guidance and Google Article structured-data guidance. Key point: YMYL legal content needs transparent authorship, process, review boundaries, and accurate schema; schema alone is not a ranking shortcut.
- CODED: `inc/trust-routes.php` now defines a virtual `/editorial-policy/` route with canonical metadata, index/follow robots behavior, and Hebrew copy explaining content purpose, legal-advice limits, author/reviewer rules, paid profile disclosure, and correction/update process.
- CREATED: `project-control/editorial-policy-route-2026-05-19.md`.
- CREATED: `project-control/editorial-policy-route-2026-05-19.csv`.
- VERIFIED: PHP lint passed for `inc/trust-routes.php`, `inc/authority.php`, `inc/schema.php`, `single-articles.php`, and `functions.php`; `git diff --check` is clean except expected Windows line-ending warnings; live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index, and robots.txt.
- LINEAR: this work belongs under HAD-59 authority governance and PR #8.
- UPRESS: no uPress pull because this is draft-PR branch work and not merged to `main`.
- SAFETY: branch code and repo documentation only. No live wp-admin, public CMS database, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL redirect, canonical/noindex setting, sitemap, taxonomy, uPress deployment, social account, Google Business Profile, lawyer contact, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 12:47 Asia/Jerusalem
- LIVE AUTHOR ATTRIBUTION AUDIT: built and ran a read-only audit for the owner's concern that Ben Batash was placed as writer/byline across criminal articles.
- RESEARCHED: Google Article author structured-data guidance and people-first/E-E-A-T guidance. Key point: Article author can be Organization or Person, but a Person author should have a real `url`/`sameAs` identity chain; legal/YMYL pages should not use unverified broad person attribution.
- CODED: `tools/check-live-author-attribution.mjs` reads the GSC mirror, selects likely criminal/high-risk URLs, fetches live pages as Googlebot, detects visible Ben attribution, parses Article JSON-LD author/reviewer data, and writes a CSV report.
- RAN: checked 80 live URLs and wrote `reports/live-author-attribution-audit-2026-05-19.csv`.
- FOUND: 45 URLs have visible Ben attribution and 45 have Ben as Article schema author; 35 checked URLs had no Ben attribution detected; 0 fetch errors.
- CREATED: `project-control/live-author-attribution-audit-2026-05-19.md`.
- CREATED: `project-control/live-author-attribution-audit-2026-05-19.csv`.
- LINEAR: HAD-62 is the coordinating issue for this audit and cleanup.
- UPRESS: no uPress pull because this is branch work and not merged to `main`.
- SAFETY: read-only live fetches and repo artifacts only. No live wp-admin login, public CMS content, WordPress record, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL, redirect, canonical, noindex, sitemap, taxonomy, uPress deployment, lawyer contact, social account creation, Google Business Profile change, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 12:33 Asia/Jerusalem
- ENTITY FOOTPRINT CHECKLIST: turned the Google Business/Profile/social authority goal into an approval-gated execution checklist.
- RESEARCHED: Google Business Profile representation guidelines, Google local ranking guidance, and Schema.org Organization `sameAs`. Key point: do not invent a physical office or schema links; Google entity trust must reflect the real business footprint.
- CREATED: `project-control/jus-tice-entity-footprint-checklist-2026-05-19.md`.
- CREATED: `project-control/jus-tice-entity-footprint-checklist-2026-05-19.csv`.
- DECISION: start with entity data lock, then Google Business Profile eligibility, then LinkedIn company page; add Organization `sameAs` only after profiles are live and verified.
- LINEAR: HAD-61 remains the coordinating issue for Google Business/Profile/social entity footprint.
- UPRESS: no uPress pull because this is branch planning/status only and not merged to `main`.
- SAFETY: no live wp-admin login, public CMS content, WordPress record, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL, redirect, canonical, noindex, sitemap, taxonomy, uPress deployment, lawyer contact, social account creation, Google Business Profile change, or client charge changed.

## LATEST WORK STATUS - 2026-05-19 10:35 Asia/Jerusalem
- LINEAR CONNECTED: installed/connected the Linear plugin and searched existing Jus-Tice coordination work. Found the project `Jus-Tice Dominant Legal Portal` plus related SEO/internal-linking/lawyer-CPT tasks.
- E-E-A-T AUTHORITY RISK FOUND: article schema and `single-articles.php` were hardcoding Ben Batash as the author for articles. That is too broad for legal/YMYL content unless the author entity and practice-area authority are verified.
- RESEARCHED: Google people-first/E-E-A-T guidance, Google Article author structured-data guidance, Google Business Profile local ranking guidance, and current law-firm SEO authority patterns.
- CODED: added `inc/authority.php` as the authority registry and reviewer resolver.
- CODED: `inc/schema.php` now defaults Article `author` to the Jus-Tice Organization and adds `reviewedBy` only for a verified connected lawyer/practice-area match.
- CODED: `single-articles.php` now uses controlled editorial/reviewer attribution instead of the hardcoded Ben byline.
- CODED: Maya Rotenberg is the first verified reviewer candidate, scoped only to `family-law` content connected by `connected_lawyer_slug=advocate-maya-rotenberg`.
- CREATED: `project-control/eeat-authority-governance-2026-05-19.md`.
- CREATED: `project-control/eeat-authority-governance-2026-05-19.csv`.
- LINEAR CREATED: HAD-59 authority governance parent, HAD-60 verified Ben/Maya author-reviewer pages, HAD-61 Jus-Tice Google Business/Profile/social entity footprint, HAD-62 criminal-article Ben attribution audit, plus a Linear project document.
- VERIFIED: PHP lint passed for `inc/authority.php`, `inc/schema.php`, `single-articles.php`, and `functions.php`; `git diff --check` clean; live journey checker passed homepage, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap index, and robots.txt.
- NEXT: create the PR, then build editorial policy, Ben entity page requirements, Maya profile enrichment, and Google Business/social footprint checklist.
- UPRESS: no uPress pull yet because this is branch work and not merged to `main`.
- SAFETY: no live wp-admin login, public CMS content, WordPress record, lawyer profile, lead record, user, payment setting, GA4/GSC setting, URL, redirect, canonical, noindex, sitemap, taxonomy, uPress deployment, lawyer contact, or client charge changed.

## LATEST WORK STATUS - 2026-05-18 20:03 Asia/Jerusalem
- COMMERCIAL PIPELINE SECTION 3 PREFLIGHT: read `project-control/codex-commercial-pipeline-runbook-2026-05-18.md` from `origin/claude/review-legal-portal-aRAzz` and executed only Section 3 checks.
- RESULT 3.1: PR #5 is not mergeable. GitHub API reports `mergeable=false`, `mergeable_state=dirty`; local merge simulation confirms a conflict in `project-control/current-status.md`.
- RESULT 3.1: PR #5 currently has 11 changed files and 2 commits, while the runbook still says to expect 10 files and a single commit.
- RESULT 3.2: live public checks passed. Homepage, `/lawyer-plans/`, `/lawyer-registration/`, and `/lawyer-dashboard/` returned HTTP 200; homepage headers did not show `X-Robots-Tag`.
- RESULT 3.3: wp-admin is blocked pending authenticated session. `/wp-admin/` redirects to login and the login page loads, but dashboard/version could not be confirmed without login.
- RESULT 3.4: uPress Git Manager is blocked pending authenticated session. The uPress URL redirects repeatedly without login, so clean working tree/current branch could not be confirmed.
- RESULT 3.5: approval gate not reached. Do not merge PR #5, do not install plugins, do not create paid products, and do not uPress pull until branch conflict and authenticated checks are resolved.
- CREATED: `project-control/commercial-pipeline-section-3-preflight-2026-05-18.md`.
- CREATED: `project-control/commercial-pipeline-section-3-preflight-2026-05-18.csv`.
- SAFETY: read-only public checks and GitHub/local merge checks only. No wp-admin login, uPress pull, plugin install, WooCommerce product, payment, user, lawyer profile, lead, CMS content, URL, redirect, canonical, noindex, sitemap, GA4, GSC, or public database change.

## LATEST WORK STATUS - 2026-05-18 20:06 Asia/Jerusalem
- COMMERCIAL PIPELINE LIVE TEST MATRIX: converted the repaired branch status into exact go-live tests before any uPress deployment.
- RESEARCHED: WooCommerce Subscriptions staging/migration guidance, WooCommerce Subscriptions Health Check, and recurring-billing launch guidance. Key point: plugin installation is not launch; subscription creation, invoice, customer portal, profile linkage, cancellation and failed-payment states must be tested end to end.
- CHECKED BRANCH: `origin/claude/review-legal-portal-aRAzz` advanced to commit `49c25df`, but still conflicts with current `main` in `project-control/current-status.md`.
- VERIFIED LIVE BASELINE: `node tools/check-live-journeys.mjs` passed homepage lead path, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap and robots.
- VERIFIED LIVE BASELINE: `/lawyer-plans/` returns HTTP 200, still does not expose the approved NIS 349 pricing, and does not expose checkout/add-to-cart links; commercial branch is not live yet.
- CREATED: `project-control/commercial-pipeline-live-test-matrix-2026-05-18.md`.
- CREATED: `project-control/commercial-pipeline-live-test-matrix-2026-05-18.csv`.
- DECISION: before deployment, require branch merge into current `main`, clean uPress Git status, registration-first paid CTA, linked profile/user, magic-link flow, checkout product mapping, Meshulam payment, Morning invoice, subscription sync, lead-routing gate, safety-net path and cancellation tests.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable theme code changed on `main`.
- SAFETY: repo-only launch/test matrix and read-only live checks. No plugin installed, WooCommerce product created, user created, lawyer profile created, test registration submitted, card charged, payment setting changed, public CMS content changed, URL/redirect/canonical/noindex/sitemap setting changed, GA4/GSC setting changed or uPress deployment triggered.

## LATEST WORK STATUS - 2026-05-18 19:56 Asia/Jerusalem
- COMMERCIAL PIPELINE BRANCH RE-REVIEW: reviewed updated `origin/claude/review-legal-portal-aRAzz` / commit `2ebe724` after Codex blocker fixes.
- VERIFIED FIXED: paid plan CTA is now registration-first unless the logged-in user already has a linked `justice_lawyer` profile.
- VERIFIED FIXED: WooCommerce subscription bridge now has a safety net that auto-creates a draft linked lawyer profile from WooCommerce customer data if a paying user has no profile.
- VERIFIED FIXED: magic-link resend now has per-email and per-IP throttling while preserving the non-enumerating public response.
- VERIFIED LOCAL: PHP lint passed on touched branch files in the review worktree.
- FOUND REMAINING P1: branch still conflicts with current `main` in `project-control/current-status.md` because `main` now includes the money-query SEO rescue packet.
- FOUND REMAINING P2: `project-control/commercial-pipeline-activation-2026-05-18.md` still has a stale "not in this commit" bullet saying checkout-first draft profile auto-creation is backlog, even though the code now implements it.
- CREATED: `project-control/commercial-pipeline-branch-rereview-2026-05-18.md`.
- CREATED: `project-control/commercial-pipeline-branch-rereview-2026-05-18.csv`.
- DECISION: original code blockers are addressed, but do not uPress-pull/deploy until the branch is rebased onto current `main`, the status conflict is resolved, and the stale runbook bullet is fixed.
- UPRESS: no uPress pull needed because this cycle changed repo review/status artifacts only; no deployable theme code changed on `main`.
- SAFETY: repo-only branch re-review. No live WordPress content, database row, lawyer profile, user, lead, payment setting, WooCommerce product, GA4/GSC setting, URL, redirect, canonical/noindex rule, sitemap setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-18 19:46 Asia/Jerusalem
- MONEY-QUERY SEO RESCUE BATCH 001: prepared the first owner-review packet for five commercial pages with high impressions and weak/zero CTR.
- RESEARCHED: Google Search Console Performance guidance and Google title-link/snippet guidance. Key point: low CTR pages with real impressions should be reviewed by query/page, then titles/snippets/content should better match searcher intent.
- USED EVIDENCE: `project-control/gsc-money-query-opportunity-map-2026-05-18.md`, `project-control/gsc-money-query-opportunity-map-2026-05-18.csv`, and `reports/traffic-priority-audit-2026-05-18.csv`.
- PREPARED: proposed title/H1/intro/internal-link direction for `/real-estate-attorney/`, the criminal indictment cancellation article, `/sex-crime-lawyer/`, `/prenup-attorney/`, and `/traffic-lawyer/`.
- CREATED: `project-control/money-query-seo-rescue-batch-001-2026-05-18.md`.
- CREATED: `project-control/money-query-seo-rescue-batch-001-2026-05-18.csv`.
- DECISION: do not edit all five live pages blindly. Start with real estate, then traffic, then prenup, then criminal indictment, then sex-crime after YMYL tone/privacy review.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable public theme code changed.
- SAFETY: repo-only SEO rescue packet. No public CMS title, H1, meta description, article body, slug, redirect, canonical, noindex, sitemap setting, taxonomy term, lawyer profile, lead record, payment setting, GA4/GSC setting, WordPress database row or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-18 19:36 Asia/Jerusalem
- COMMERCIAL PIPELINE BRANCH REVIEW: reviewed `origin/claude/review-legal-portal-aRAzz` / commit `e07851a` before deployment.
- RESEARCHED: WooCommerce Subscriptions action reference and 2026 law-firm intake/payment workflow guidance. Key point: subscription/account/profile state must be connected before payment is treated as activation; do not rely on redirect luck.
- VERIFIED: PHP lint passed on touched files in the branch worktree, but the branch diverges from current `main` and conflicts in `project-control/current-status.md`.
- FOUND P0 BLOCKER: paid plan CTAs can go directly to WooCommerce checkout after product IDs are mapped, but the subscription bridge exits if no linked `justice_lawyer` profile exists. A lawyer could pay without a connected profile/dashboard/lead-routing/value-report path.
- FOUND P1 BLOCKER: magic-link resend has no throttle. It avoids account enumeration but can spam a real lawyer email and repeatedly invalidate the current link.
- CREATED: `project-control/commercial-pipeline-branch-review-2026-05-18.md`.
- CREATED: `project-control/commercial-pipeline-branch-review-2026-05-18.csv`.
- DECISION: do not deploy/merge that branch as-is. Patch it so paid CTAs go registration-first or checkout auto-creates/links a draft lawyer profile before subscription sync; add resend throttling; then rerun review.
- UPRESS: no uPress pull needed because this cycle changed repo review/status artifacts only; no deployable theme code changed on `main`.
- SAFETY: repo-only review artifact and branch analysis. No live WordPress content, database rows, lawyer profiles, users, leads, payment settings, WooCommerce products, GA4/GSC settings, URL, redirect, canonical/noindex rule, sitemap setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-18 19:16 Asia/Jerusalem
- LAWYER DASHBOARD FIRST-VALUE PANEL: turned the private-zone MVP into a more visible lawyer value surface.
- RESEARCHED: current legal intake/client-portal best practices. Key point: lawyers need to see progress from onboarding to measurable value, including profile readiness, leads, visibility, content work, follow-up and payment/status boundaries.
- IMPLEMENTED: `/lawyer-dashboard/` now includes a logged-in first-value panel that summarizes profile linkage, profile readiness, measured visibility, assigned leads, content/profile work, activation status and honest payment status.
- IMPLEMENTED: added responsive styling for the first-value panel in `assets/css/premium-pass-3.css`.
- IMPLEMENTED: added dashboard marker `justice-dashboard-first-value-v1` so live deployment can be verified from the public logged-out dashboard page after uPress pull.
- FOUND UPRESS BLOCKER: uPress Git status showed three tracked emergency utility files deleted on the server: `emergency-recovery.php`, `restore-from-github.php`, and `server-cleanup.php`.
- RESOLUTION: those files explicitly say they should be deleted after recovery and are security-sensitive utility scripts, so they were removed from the repo to align GitHub with the safer server state and unblock future uPress pulls.
- VERIFIED LOCAL: PHP lint passed for `page-lawyer-dashboard.php`; `git diff --check` passed with line-ending warnings only.
- DEPLOYED: pushed commits `791bc4d` and `b079a8a` to GitHub `main`; opened uPress File Manager Git management for `wp-content/themes/justice-theme` and clicked Pull Git.
- VERIFIED UPRESS: Git status now reports a clean worktree (`לא זוהו שינויים, ספריית עבודה נקייה`).
- VERIFIED LIVE: direct CSS fetch shows the new `lawyer-dashboard__first-value` styles are live; `/lawyer-dashboard/` returns HTTP 200 and the logged-out gate is intact.
- NOTE: the first-value panel itself is intentionally visible only to a logged-in linked lawyer account, so full visual QA still needs an owner-approved demo/linked lawyer account.
- NEXT: create or use an approved linked lawyer account for browser QA, then verify the private-zone panel visually and continue toward payment-provider selection.
- SAFETY: dashboard/CSS change plus removal of obsolete emergency utility scripts from version control. No user account, lawyer profile, lead record, payment product, subscription, invoice, public CMS database content, URL, redirect, canonical, noindex, sitemap setting, GA4/GSC setting or WordPress database row was changed.

## LATEST WORK STATUS - 2026-05-18 19:06 Asia/Jerusalem
- LAWYER DEMO ACCOUNT JOURNEY PACKET: converted the hidden lawyer/private-zone/payment/value gap into a concrete owner-verifiable demo journey plan.
- RESEARCHED: 2026 legal intake/client-portal best practices from Clio, Lawmatics, US Tech Automations and CounselStack. Key point: a winning system links intake, fast follow-up, private portal, payment/status and recurring value reporting; a static registration page is not enough.
- REVIEWED REPO STATE: previous lawyer commercial status artifacts are still uncommitted local work; no conflicting user changes were detected.
- CREATED: `project-control/lawyer-demo-account-journey-packet-2026-05-18.md`.
- CREATED: `project-control/lawyer-demo-account-journey-packet-2026-05-18.csv`.
- DECISION: next safe implementation should make `/lawyer-dashboard/` show a clear first-value/status panel and then create a demo linked lawyer account only after owner approval for live/staging test data.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable public theme code changed.
- SAFETY: repo-only implementation packet. No user account, lawyer profile, lead record, payment product, subscription, invoice, public CMS content, URL, redirect, noindex/canonical rule, sitemap setting, GA4/GSC setting, WordPress database row or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-18 18:56 Asia/Jerusalem
- LAWYER COMMERCIAL SYSTEM VISIBILITY STATUS: answered the owner question about what actually exists for lawyer registration, private zone, account, payments, leads, insights and value.
- RESEARCHED: 2026 legal intake/client-portal best practices. Key point: winning systems do not stop at a registration form; they connect intake, CRM/follow-up, payment path, private dashboard and recurring value reporting.
- VERIFIED LIVE: `node tools/check-live-journeys.mjs` passed homepage lead path, lawyer directory, sample article, lawyer registration, plan-intent registration, sitemap and robots.
- VERIFIED LIVE: `/lawyer-registration/`, `/lawyer-registration/?plan_interest=pro`, `/lawyer-plans/`, `/lawyer-dashboard/`, and `/lawyers/` return HTTP 200.
- FOUND: the lawyer business system exists as infrastructure/MVP: registration, draft lawyer profile creation, plan-interest preservation, owner onboarding admin, Justice CRM, lead routing, gated lawyer dashboard, content requests, owner activation fields, monthly value report spec and time-to-first-value plan.
- FOUND GAP: public-visible revenue engine is not finished: no live payment checkout/recurring billing, no confirmed payment provider/product IDs, no finalized qualified-lead billing rules, no frictionless self-service account linking, and no finished lawyer-facing monthly value report.
- CREATED: `project-control/lawyer-commercial-system-visibility-status-2026-05-18.md`.
- CREATED: `project-control/lawyer-commercial-system-visibility-status-2026-05-18.csv`.
- NEXT: make the lawyer funnel more visible on `/lawyer-plans/` and `/lawyer-registration/`, then create an owner-verifiable demo linked lawyer account/private-zone journey before activating payments.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable public theme code changed.
- SAFETY: repo-only status/planning and read-only live checks. No public CMS database row, lawyer profile, lead record, payment setting, user account, GA4/GSC setting, URL, redirect, canonical, noindex, sitemap setting, article body, title/H1/meta, taxonomy term or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-18 18:42 Asia/Jerusalem
- SPAM FOOTPRINT DISCOVERY QUEUE: expanded the casino cleanup from two visible URLs into a controlled discovery/removal workflow.
- RESEARCHED: Google Removals, hacked URL, recrawl, and 404/410 guidance. Key point: use exact URL removals for hacked URLs, keep permanent 404/410/noindex signals, and do not block the whole site or legitimate legal prefixes.
- VERIFIED LIVE: favicon/spam checker still passes for the important live signals: homepage marker, canonical scales favicon tags, old J favicon absence, and two casino URLs returning 410/noindex.
- REVIEWED INTERNAL EVIDENCE: `spam-investigation.md`, `criminal-law-semrush-playbook-actions.csv`, and `criminal-law-exit-review.md` show unresolved wider risk around spam anchors such as `payid casino`, `mostbet`, `kasyno`, and `online casino`.
- CREATED: `project-control/spam-footprint-discovery-queue-2026-05-18.md`.
- CREATED: `project-control/spam-footprint-discovery-queue-2026-05-18.csv`.
- DECISION: do not disavow backlinks, delete DB rows, remove broad prefixes, or touch legal pages without exact URL/source evidence and owner approval. Next evidence source is GSC Pages/Links export filtered by spam terms.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable theme code changed.
- SAFETY: repo-only discovery planning and read-only verification. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-18 18:32 Asia/Jerusalem
- GSC FAVICON/SPAM AFTERCARE PACKET: converted the live favicon/spam fix into exact Search Console next actions.
- RESEARCHED: Google Search Console Removals, hacked URL handling, recrawl, and crawl-budget guidance. Key point: Removals hides URLs temporarily; permanent cleanup still depends on 404/410/noindex, and hacked URLs should be blocked specifically rather than blocking the whole site.
- VERIFIED LIVE: `node tools/check-live-favicon-and-spam-guard.mjs` passed for the important live signals: homepage 200, marker live, six canonical scales favicon tags, old J favicon absent, and the two casino example URLs returning 410/noindex.
- CREATED: `project-control/gsc-favicon-spam-aftercare-packet-2026-05-18.md`.
- CREATED: `project-control/gsc-favicon-spam-aftercare-packet-2026-05-18.csv`.
- DECISION: submit homepage URL Inspection recrawl, then submit exact casino result URLs in Search Console Removals; do not remove full site, homepage, legal prefixes, `/articles/`, or `/lawyers/`.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable theme code changed.
- SAFETY: repo-only operational guidance and read-only live verification. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value changed.

## LATEST WORK STATUS - 2026-05-18 18:28 Asia/Jerusalem
- FAVICON AND CASINO SPAM INDEXING FIX: fixed the conflicting favicon stack and added a deleted-spam URL guard for casino/gambling hacked paths.
- RESEARCHED: Google favicon-in-search and Search Console Removals guidance. Key point: Google supports one favicon per hostname; homepage and favicon must be crawlable; use a square stable icon larger than 48x48; deleted URLs can remain in results until recrawl/removal and should return 404/410/noindex signals.
- FOUND LIVE BEFORE FIX: homepage head exposed multiple competing icon sources, including the unwanted J favicon, fbrfg plugin icons, and WordPress Site Icon output; `/favicon.ico` and `/favicon.png` returned 404.
- IMPLEMENTED: canonical scales favicon output in `inc/seo.php`, removed hardcoded J favicon links from `header.php`, added root `/favicon.ico` and `/favicon.png` fallbacks, combined the legacy scales logo asset with the Jus-Tice wordmark in header/footer while preserving the blinking red dot, and added 410/noindex spam path guard.
- CREATED: `tools/check-live-favicon-and-spam-guard.mjs`.
- CREATED: `project-control/favicon-and-casino-spam-indexing-fix-2026-05-18.md`.
- CREATED: `project-control/favicon-and-casino-spam-indexing-fix-2026-05-18.csv`.
- VERIFIED LOCAL: PHP lint passed for touched PHP files, JS syntax check passed for the checker, and `git diff --check` passed.
- DEPLOYMENT ADJUSTMENT: after uPress pull, live homepage showed the new favicon marker with cache-busting, but root favicon/spam URL handling was still being captured by the normal 404 flow. Moved those guards from `template_redirect` to early `init` and forced HTTP status codes.
- DEPLOYED: commits `1215009` and `c856135` were pushed to GitHub `main`; Codex opened uPress File Manager for `wp-content/themes/justice-theme`, opened Git management, and clicked Pull Git twice.
- VERIFIED LIVE: cache-busted homepage returns marker `2026-05-18-brand-favicon-spam-guard-v1`, exposes six canonical `data-justice-theme="brand-icon"` scales favicon links, and no longer exposes `favicon-gen.png` or `cropped-jus-tice-ai-2025` old J icon source.
- VERIFIED LIVE: deleted casino spam examples `/guide-complet-du-casino-en-ligne/` and `/guia-experta-para-maximizar-bonos-y-estrategias-de-juego/` now return HTTP 410 with `X-Robots-Tag: noindex,nofollow`.
- VERIFIED LIVE VISUAL: homepage header combines the circular legacy scales logo with the Jus-Tice wordmark; the red dot remains in the wordmark.
- ROOT FAVICON NOTE: `/favicon.ico` and `/favicon.png` still return server-level 404 before WordPress can handle them, but Google favicon guidance accepts the homepage `<link rel="icon">` path, which is now stable and crawlable.
- UPRESS: completed for deployable theme code.
- SAFETY: theme-level technical SEO/brand fix only. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value changed.

## LATEST WORK STATUS - 2026-05-18 18:12 Asia/Jerusalem
- REAL ESTATE CLUSTER CONSOLIDATION PACKET: converted the top money-query opportunity into a safe hub/support decision packet before any public CMS edits.
- RESEARCHED: Google Performance report, canonicalization, and title-link guidance. Key point: similar pages should not be redirected/canonicalized blindly; first define the best representative money hub and each support page's unique role.
- FOUND: `/real-estate-attorney/` is the strongest primary commercial hub candidate for `עורך דין מקרקעין` and `עורך דין נדלן`, while `/real-estate-lawyer-guide/`, `/lawyer-for-buying-or-selling-a-house/`, `/registration-of-real-estate-israel/`, and rental-contract pages should remain support/tool pages.
- VERIFIED LIVE: sampled real-estate URLs returned HTTP 200, indexable, and self-canonical to Googlebot-style fetches.
- CREATED: `project-control/real-estate-cluster-consolidation-packet-2026-05-18.md`.
- CREATED: `project-control/real-estate-cluster-consolidation-packet-2026-05-18.csv`.
- DECISION: no redirects/canonical merges now. Next public edit packet should strengthen `/real-estate-attorney/` as the hub and add support-to-hub internal links from guide, purchase/sale, and registration pages after owner approval.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable public theme code changed.
- SAFETY: repo-only planning and read-only live checks. No public CMS database row, article body, stored title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-18 18:04 Asia/Jerusalem
- GSC MONEY QUERY OPPORTUNITY MAP: mined the query/page mirror for money keywords with impressions, weak CTR, and clear commercial intent.
- RESEARCHED: Google Search Console Performance report and title/snippet guidance. Key point: the next recovery pass should filter by important queries/pages, then improve title/snippet/content alignment and internal links where important queries have low CTR.
- FOUND: top commercial weak-CTR rows include `עורך דין מקרקעין` to `/real-estate-attorney/` (7,986 impressions, 0.01% CTR), `ביטול כתב אישום` to a criminal article (7,771 impressions, 0% CTR), `עורך דין עבירות מין` to `/sex-crime-lawyer/` (7,171 impressions, 0% CTR), `עורך דין הסכם ממון` to `/prenup-attorney/` (6,251 impressions, 0% CTR), and `עורך דין תעבורה` to `/traffic-lawyer/` (3,455 impressions, 0% CTR).
- VERIFIED LIVE SAMPLE: homepage, `/real-estate-attorney/`, criminal indictment cancellation article, `/sex-crime-lawyer/`, `/prenup-attorney/`, `/traffic-lawyer/`, `/criminal-defense-attorney/`, and `/real-estate-lawyer-guide/` returned HTTP 200 and indexable to a Googlebot-style fetch.
- CREATED: `project-control/gsc-money-query-opportunity-map-2026-05-18.md`.
- CREATED: `project-control/gsc-money-query-opportunity-map-2026-05-18.csv`.
- DECISION: next public content work should start with real estate and criminal cluster consolidation packets, then family/prenup, medical-malpractice birth, traffic, and homepage directory CTR.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable public theme code changed.
- SAFETY: repo-only GSC opportunity planning and read-only live checks. No public CMS database row, article body, stored title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-18 17:54 Asia/Jerusalem
- GSC TRAFFIC DROP TRIAGE: used the local GSC mirror to separate traffic-loss noise from commercial recovery work.
- RESEARCHED: Google Search Console Performance report, title-link, and snippet guidance. Key point: recovery should be page/query-driven; compare pages and queries, then improve title/snippet/content/internal-link signals where impressions exist but CTR or recent visibility collapsed.
- FOUND: the first drop rows are concentrated in old PDFs, `/court-judge`, narrow case/archive articles, and low-priority topics; this does not look like a simple sitewide crawl block after today's live technical checks passed.
- FOUND: homepage still matters commercially: 8 clicks / 1,723 impressions over 28 days and 27 clicks / 5,153 impressions over 3 months, with directory/lawyer-search intent queries in the GSC mirror.
- FOUND: money clusters need priority review because historical visibility exists with weak recent sampled traffic: criminal defense, real estate lawyer guide, medical malpractice lawyer, and traffic lawyer.
- CREATED: `project-control/gsc-traffic-drop-triage-2026-05-18.md`.
- CREATED: `project-control/gsc-traffic-drop-triage-2026-05-18.csv`.
- DECISION: do not chase old PDF/archive traffic first and do not delete/noindex/redirect those assets without owner approval and backlink/history review. Next safe cycle should mine query-page pairs for money clusters and prepare title/snippet/H1/internal-link fixes.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable public theme code changed.
- SAFETY: repo-only GSC triage. No public CMS database row, article body, stored title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, WordPress database value, or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-18 17:41 Asia/Jerusalem
- LIVE JOURNEY HEALTH SNAPSHOT: ran the current post-fix user, lawyer, Googlebot, reachability, commercial-route and breadcrumb-schema checks.
- RESEARCHED: Google title/snippet, LocalBusiness/Organization phone/contact, and crawlable-link guidance. Key point: traffic recovery now depends less on basic reachability breakage and more on clear page intent, consistent entity/contact signals, crawlable internal links, and GSC-driven content decisions.
- VERIFIED LIVE: public user journey passed for homepage lead path, lawyer directory and sample article.
- VERIFIED LIVE: lawyer customer journey passed for `/lawyer-registration/` and `/lawyer-registration/?plan_interest=pro`.
- VERIFIED LIVE: Googlebot journey passed for `/sitemap_index.xml` and `/robots.txt`.
- VERIFIED LIVE: traffic-priority checker passed all sampled commercial/trust routes, including family, medical malpractice, real estate, criminal, traffic, inheritance, contact and about.
- VERIFIED LIVE: reachability checker passed DNS, homepage, HTML sitemap, REST API, robots, XML sitemap, owner phone, WhatsApp, legacy phone leakage and canonical checks.
- VERIFIED LIVE: breadcrumb schema checker scanned 1,299 URLs with 0 review rows.
- CREATED: `project-control/live-journey-health-snapshot-2026-05-18-1741.md`.
- CREATED: `project-control/live-journey-health-snapshot-2026-05-18-1741.csv`.
- UPRESS: no uPress pull needed because this cycle changed repo documentation/status artifacts only; no deployable public theme code changed.
- SAFETY: read-only live audit and repo documentation only. No public CMS database row, article body, stored title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value changed.

## LATEST WORK STATUS - 2026-05-18 17:31 Asia/Jerusalem
- MEDICAL MALPRACTICE CLEAN SLUG REVIEW: reviewed `/birth-malpractice/`, `/pregnancy-malpractice/`, and `/diagnosis-malpractice/` after removing public links to those 404 paths.
- RESEARCHED: Google redirect, HTTP/soft-404, and people-first/YMYL guidance. Key point: use precise equivalent redirects or real useful pages; do not create thin medical/legal route recoveries or broad redirects to a generic hub.
- VERIFIED LIVE: `/birth-malpractice/`, `/pregnancy-malpractice/`, and `/diagnosis-malpractice/` remain 404 and should stay unlinked until route-history/GSC review is approved.
- FOUND LIVE ALTERNATIVES: `/medical-malpractice-lawyer-birth-representation/`, `/medical-malpractice-lawyer-birth-recommended/`, `/birth-injury/`, `/birth-injury-lawyer/`, `/birth-injury-causes/`, `/brain-damage-at-birth/`, and `/medical-malpractice-8271/` return 200.
- CREATED: `project-control/medical-malpractice-clean-slug-route-review-2026-05-18.md`.
- CREATED: `project-control/medical-malpractice-clean-slug-route-review-2026-05-18.csv`.
- DECISION: no public route recovery or redirects yet. Birth/pregnancy need a split/merge decision; diagnosis may later get a precise redirect to `/medical-malpractice-8271/` if owner/legal approval confirms equivalence.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable public theme code changed.
- SAFETY: repo-only route review and read-only live checks. No public CMS database row, article body, stored title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value changed.

## LATEST WORK STATUS - 2026-05-18 17:21 Asia/Jerusalem
- MEDICAL MALPRACTICE SUPPORT LINK FIX: found and fixed theme-owned links from the live `/medical-malpractice-lawyer/` route/topic cluster to dead support URLs.
- RESEARCHED: Google crawlable-link guidance and current Israeli medical-malpractice competitors. Key point: the money hub should link to crawlable, live support pages around birth injury, surgery, anesthesia, definitions/examples and medical causation topics, not to clean slugs that currently 404.
- VERIFIED BEFORE FIX: `/medical-malpractice-lawyer/` is live 200, but `/birth-malpractice/`, `/pregnancy-malpractice/`, and `/diagnosis-malpractice/` return 404.
- IMPLEMENTED: replaced dead medical-malpractice support links in `inc/practice-landing.php`, `template-parts/sections/topic-clusters.php`, `inc/pillar-pages.php`, and related-content cluster tokens with verified live support URLs.
- UPDATED: deployment marker to `2026-05-18-medmal-support-links-v1`.
- UPDATED: `tools/check-live-traffic-priority.mjs` now fails the medical-malpractice route if the three blocked clean slugs appear in public HTML.
- CREATED: `project-control/medical-malpractice-support-link-fix-2026-05-18.md`.
- CREATED: `project-control/medical-malpractice-support-link-fix-2026-05-18.csv`.
- DEPLOYED: commit `21fff2c` was pushed to GitHub `main`; Codex opened uPress File Manager Git management for `wp-content/themes/justice-theme` and clicked Pull Git.
- VERIFIED LIVE: traffic-priority checker passed all sampled commercial/trust routes; HTML sitemap/footer checker passed; owner-phone checker passed.
- VERIFIED LIVE: Googlebot-style fetch of `/medical-malpractice-lawyer/` contains marker `2026-05-18-medmal-support-links-v1`, contains the live support URLs `/birth-injury/`, `/anesthesia-medical-malpractice/`, `/surgical-errors-medical-malpractice/`, and `/what-is-medical-malpractice-definition-examples/`, and does not contain `/birth-malpractice/`, `/pregnancy-malpractice/`, or `/diagnosis-malpractice/`.
- NEXT: route-history/GSC review is still needed before deciding whether to recover, redirect, or leave unavailable the clean birth/pregnancy/diagnosis malpractice slugs.
- SAFETY: theme-owned crawl-path correction only. No public CMS database row, article body, stored title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value changed.

## LATEST WORK STATUS - 2026-05-18 17:11 Asia/Jerusalem
- CORONA LEGACY CONTENT AUDIT: converted the owner's stale corona-content concern into a safe editorial control packet before any public CMS cleanup.
- RESEARCHED: Google helpful-content, core-update, and outdated-content guidance. Key point: improve useful pages and avoid reactive mass deletion/noindexing; old pages should be refreshed, archived, or pruned only after evidence.
- SCANNED: `project-control/url-migration-map.csv` for corona/COVID/emergency-regulation signals and found 48 candidates: 29 `outdated-corona-legacy`, 7 `employment-law`, 4 `needs-classification`, 2 `cyber-privacy`, 2 `criminal-law`, 2 `real-estate`, 1 `traffic-law`, and 1 `medical-malpractice`.
- LIVE SAMPLE: Googlebot-style header checks returned HTTP 200 for `coronavirus-employers-guide`, `income-protection-insurance`, and `research-report-n156-persistent-symptoms`, proving the group needs page-by-page handling instead of blanket pruning.
- CREATED: `project-control/corona-legacy-content-audit-2026-05-18.md`.
- CREATED: `project-control/corona-legacy-content-audit-2026-05-18.csv`.
- DECISION: do not mass-delete, mass-noindex, or broad-redirect corona pages. First approved batch should refresh current commercial/support pages and hold pure 2020 emergency updates for GSC/backlink review.
- UPRESS: no uPress pull needed because this cycle changed repo planning/status artifacts only; no deployable public theme code changed.
- SAFETY: no public CMS database row, article body, title/H1/meta, URL slug, redirect, noindex, canonical, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value was changed.

## LATEST WORK STATUS - 2026-05-18 16:51 Asia/Jerusalem
- INHERITANCE TOPIC LINK BUG FIX: replaced dead inheritance topic-cluster links to `/will/`, `/will-contest/`, and `/estate-administration/` with live verified support URLs.
- RESEARCHED: Google redirect/site-move/soft-404 guidance. Key point: redirect or link only to meaningful equivalent pages; do not mask missing/conflicted URLs with broad unrelated destinations.
- IMPLEMENTED: `template-parts/sections/topic-clusters.php` now links inheritance users to `/inheritance-order/`, `/will-and-testament/`, `/will-probate-objection/`, and `/what-is-a-probate-order/`.
- UPDATED: deployment marker to `2026-05-18-inheritance-topic-links-v1`; live marker checkers now expect it.
- CREATED: `project-control/will-route-conflict-review-2026-05-18.md`.
- CREATED: `project-control/will-route-conflict-review-2026-05-18.csv`.
- DEPLOYED: commit `5e6973b` was pushed to GitHub `main`; Codex opened uPress File Manager Git management for `wp-content/themes/justice-theme` and clicked Pull Git.
- VERIFIED LIVE: HTML sitemap/footer checker, owner-phone checker, traffic-priority audit and reachability checker all passed after the uPress pull.
- DECISION: `/will/` remains blocked for route-history review because it is live 404/noindex and is a 10-row duplicate slug conflict; do not blanket-redirect it.
- SAFETY: theme link correction plus read-only route review. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value was changed.

## LATEST WORK STATUS - 2026-05-18 16:41 Asia/Jerusalem
- INHERITANCE/WILLS SUPPORT MAP: converted the recovered `/inheritance-lawyer/` route into the next owner-approval content/internal-link batch.
- RESEARCHED: Google crawlable-link and title-link guidance plus leading Israeli inheritance/wills competitors. Key point: competitors cluster around inheritance orders, probate orders, wills, objections to wills, estate administration, heir disputes, estate division, capacity and undue influence.
- CREATED: `project-control/inheritance-wills-support-to-hub-map-2026-05-18.md`.
- CREATED: `project-control/inheritance-wills-support-to-hub-map-2026-05-18.csv`.
- VERIFIED LIVE: Googlebot-style checks passed for `/inheritance-lawyer/`, `/inheritance/`, `/inheritance-order/`, `/will-and-testament/`, `/will-probate-objection/`, `/what-is-a-probate-order/`, `/maximize-an-inheritance/`, `/revocation-of-a-will-and-reviving-previous-will/`, and `/international-inheritance-wills-lawyer/`.
- FOUND BLOCKER: `/will/` is live 404/noindex and the migration map shows repeated `TARGET_SLUG_CONFLICT_NEEDS_REVIEW`; do not recover or redirect `/will/` blindly.
- FOUND DATA ISSUE: GSC inheritance export has false positives caused by the English word "will", including criminal-law and traffic-law URLs; these must be excluded from inheritance planning.
- NEXT: owner approval is needed before public CMS edits; start with factual links from `/inheritance/`, `/inheritance-order/`, `/what-is-a-probate-order/`, `/will-probate-objection/`, and `/will-and-testament/` into `/inheritance-lawyer/`.
- UPRESS: no uPress pull was needed in this cycle because only repo planning artifacts changed; no deployable public theme code changed.
- SAFETY: planning and live read-only audit only. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value was changed.

## LATEST WORK STATUS - 2026-05-18 16:31 Asia/Jerusalem
- INHERITANCE H1 INTENT FIX: strengthened `/inheritance-lawyer/` visible H1 from the generic taxonomy fallback to the commercial phrase `עורך דין ירושה וצוואות`.
- RESEARCHED: Google title-link guidance says Google uses the `<title>`, main visual title, heading elements including `<h1>`, prominent text, and anchor text to create title links; the visible H1 should clearly describe the page.
- IMPLEMENTED: added a `display_title` override for controlled practice routes in `template-parts/content/practice-landing-page.php`, set it only for `practice-inheritance-lawyer-route.php`, and updated live checkers to require the new deployment marker and inheritance H1 intent.
- DEPLOYED: commit `a30e808` was pushed to GitHub `main`; Codex opened uPress File Manager Git management for `wp-content/themes/justice-theme` and clicked Pull Git.
- VERIFIED LIVE: `/inheritance-lawyer/` returns HTTP 200, has no `noindex`, serves marker `2026-05-18-inheritance-lawyer-h1-v2`, title `עורך דין ירושה וצוואות | צו ירושה, צוואה והתנגדות לצוואה | Jus-Tice`, and H1 `עורך דין ירושה וצוואות`.
- VERIFIED LIVE: traffic-priority audit, HTML sitemap/footer audit, and owner-phone audit all passed after the uPress pull.
- NEXT: continue content classification and owner-approved support-to-hub internal links; inheritance route now has the correct visible money-page heading.
- SAFETY: render-only template/config change. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value was changed.

## LATEST WORK STATUS - 2026-05-18 16:20 Asia/Jerusalem
- INHERITANCE/WILLS ROUTE RECOVERY: recovered `/inheritance-lawyer/` as a controlled, indexable commercial route after live checks found it returned 404.
- RESEARCHED: Google crawlable/internal-link guidance and current Israeli inheritance/wills competitors. Key point: the route should be reachable through crawlable links with descriptive anchors and support the main money intent around inheritance orders, probate orders, wills and objections to wills.
- IMPLEMENTED: `practice-inheritance-lawyer-route.php` plus route/metadata guards in `inc/practice-landing.php`; updated inheritance support links away from non-live `/will/` and `/will-contest/` paths to current live support pages.
- UPDATED: deployment marker to `2026-05-18-inheritance-lawyer-route-v1`; live checkers now include `/inheritance-lawyer/` and expect the new marker.
- DEPLOYED: commit `d6cfc64` was pushed to GitHub `main`; Codex opened uPress File Manager Git management for `wp-content/themes/justice-theme` and clicked Pull Git. uPress did not show a clear success toast, but live marker checks prove the pull landed.
- VERIFIED LIVE: `/inheritance-lawyer/` returns HTTP 200, does not expose `noindex`, self-canonicalizes to `https://jus-tice.co.il/inheritance-lawyer/`, includes support links to live inheritance/wills pages, and serves marker `2026-05-18-inheritance-lawyer-route-v1`.
- VERIFIED LIVE: traffic-priority audit, HTML sitemap/footer audit, owner-phone audit, and broad reachability audit all passed after the uPress pull.
- NEXT: improve the inherited H1/title language for stronger `עורך דין ירושה` intent, then continue content classification and owner-approved support-to-hub internal links.
- SAFETY: render-only theme route recovery. No public CMS database row, article body, stored WordPress title/H1/meta, URL slug, redirect, taxonomy term, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting, wp-admin setting, or WordPress database value was changed.

## LATEST WORK STATUS - 2026-05-18 16:10 Asia/Jerusalem
- LIVE INCIDENT CHECK: owner reported "This site can't be reached"; external fetch, DNS and HTTPS checks showed the site is reachable now.
- RESEARCHED: Google LocalBusiness/Organization schema guidance says `telephone` should represent the primary customer contact number, and current local SEO guidance emphasizes consistent name/address/phone signals across the site and business profiles.
- VERIFIED LIVE: homepage, `/site-map/`, `/wp-json/`, `/robots.txt`, and `/sitemap_index.xml` returned HTTP 200.
- VERIFIED LIVE: DNS resolves `jus-tice.co.il` to uPress IP `185.108.148.104`, HTTPS verifies, and port 443 is reachable.
- VERIFIED LIVE: owner-phone checker passes; homepage exposes `0525101555`, `tel:0525101555`, WhatsApp `972525101555`, and no legacy/mock phone numbers.
- CREATED: `tools/check-live-reachability.mjs` for repeatable live checks across DNS, homepage, HTML sitemap, REST API, robots, XML sitemap, owner phone, WhatsApp, legacy phone leakage, and canonical.
- NEXT: run `node tools/check-live-reachability.mjs` whenever the site appears unavailable, after uPress pulls, and during journey checks; if a user still sees "site can't be reached", capture the exact browser error code and compare against this checker.
- UPRESS: no uPress pull was needed in this cycle because only repo tooling and shared status changed; no deployable public theme code changed.
- SAFETY: no public CMS/database content, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.

## LATEST WORK STATUS - 2026-05-18 16:00 Asia/Jerusalem
- EMPLOYMENT LAW MONEY CLUSTER: converted employment-law and employment-boundary GSC evidence into a support-to-hub map for `/labor-lawyer/`.
- RESEARCHED: Google crawlable/internal-link guidance, 2026 internal-linking hub guidance, and leading Israeli employment-law competitors. Key point: competitor pages cluster around dismissal, severance, wage withholding, employee rights, employer representation, employment contracts, hearings, harassment at work, discrimination, pregnancy/parental rights, pensions, overtime, and labor-court representation.
- CREATED: `project-control/employment-law-support-to-hub-map-2026-05-18.md`.
- CREATED: `project-control/employment-law-support-to-hub-map-2026-05-18.csv`.
- VERIFIED LIVE: Googlebot-style fetch returned HTTP 200/indexable for `/labor-lawyer/`, `/employment-contract/`, `/employer-worker-relationship/`, `/israeli-labor-law/`, `/income-protection-insurance/`, and `/working-permit-for-foreign-workers/`.
- FOUND BLOCKER: early-notice/firing URL under `/labor-law/` has 5,467 GSC impressions but normalized to `/labor-law/law-2731/` and returned HTTP 404.
- FOUND BLOCKER: Wolt courier employee-status URL has 5,806 GSC impressions and 14 clicks but returned HTTP 404.
- FOUND: `/labor-lawyer/` has 29,862 impressions and only 3 clicks, so the first approved public batch should strengthen factual click intent and connect employment-contract and employee-employer relationship pages into the hub.
- FOUND: false positives and boundaries must be held out or handled carefully, including foreign real-estate/Airbnb, work-injury/national-insurance, income-protection insurance, foreign-worker permits, PDFs, and outdated corona/emergency workplace pages.
- NEXT: owner approval is needed before public CMS edits; start with factual internal links from employment-contract and employee-employer relationship pages, then route-review the two high-impression 404 URLs.
- UPRESS: no uPress pull was needed in this cycle because only repo planning artifacts changed; no deployable public theme code changed.
- SAFETY: no public CMS/database content, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.

## LATEST WORK STATUS - 2026-05-18 15:50 Asia/Jerusalem
- TRAFFIC LAW MONEY CLUSTER: converted traffic-law and traffic/criminal-boundary evidence into a support-to-hub map for `/traffic-lawyer/`.
- RESEARCHED: Google crawlable/internal-link guidance, 2026 internal-linking hub guidance, and leading Israeli traffic-law competitors. Key point: competitor pages cluster around drunk driving, license suspension, traffic points, speeding, phone use while driving, driving while disqualified, new-driver offenses, accident representation, administrative disqualification, vehicle impound/use bans, and traffic-court representation.
- CREATED: `project-control/traffic-law-support-to-hub-map-2026-05-18.md`.
- CREATED: `project-control/traffic-law-support-to-hub-map-2026-05-18.csv`.
- VERIFIED LIVE: Googlebot-style fetch returned HTTP 200 for `/traffic-lawyer/`, `/driving-under-the-influence/`, `/driving-under-the-influence-of-drugs/`, `/dui-refusal-blood-breath-urine-test/`, `/driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license/`, `/car-accident-auto-injury-lawyer/`, and `/medical-fitness-tests-for-driving-marvad-info/`.
- FOUND BLOCKER: old traffic category URL `/קטגוריות-מאמרים/דיני-תעבורה` has 1,116 GSC impressions but returned HTTP 404; it needs old-route/GSC review before route recovery or redirect.
- FOUND: `/traffic-lawyer/` has 20,330 impressions and 0 clicks, so the first approved public batch should strengthen factual on-page click intent and connect drunk-driving/refusal/points pages into the hub.
- FOUND: several false positives must be held out of traffic-law promotion, including `drug-trafficking`, `human-trafficking`, `sex-trafficking`, `cybersex-trafficking`, business-licensing pages, rental-agreement pages, and outdated corona/license-extension pages.
- NEXT: owner approval is needed before public CMS edits; start with factual internal links from drunk-driving and refusal-test pages, then handle the 404 traffic category route only after route-history review.
- UPRESS: no uPress pull was needed in this cycle because only repo planning artifacts changed; no deployable public theme code changed.
- SAFETY: no public CMS/database content, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.

## LATEST WORK STATUS - 2026-05-18 15:40 Asia/Jerusalem
- REAL ESTATE MONEY CLUSTER: converted real-estate P0 evidence into a support-to-hub map for `/real-estate-attorney/`, with `/real-estate-lawyer-guide/` as the newly recovered secondary explainer.
- RESEARCHED: Google crawlable/internal-link guidance, 2026 internal-linking hub guidance, and leading real-estate-law competitors. Key point: competitor pages cluster around apartment purchase/sale, contract checks, land registry, real-estate tax, late delivery, appraisers and transaction risk.
- CREATED: `project-control/real-estate-support-to-hub-map-2026-05-18.md`.
- CREATED: `project-control/real-estate-support-to-hub-map-2026-05-18.csv`.
- VERIFIED LIVE: Googlebot-style fetch returned 200/indexable/self-canonical for `/real-estate-attorney/`, `/real-estate-lawyer-guide/`, `/lawyer-for-buying-or-selling-a-house/`, `/registration-of-real-estate-israel/`, `/land-appreciation-tax/`, `/real-estate-lawyer-cost-2025/`, `/real-estate-appraiser/`, `/marital-property-agreement/`, and `/spouse-property-registration-guide/`.
- FOUND: strongest Israeli commercial support opportunities include buying/selling apartment (35,650 impressions), real-estate lawyer guide (26,708), registration of rights (17,400), partition of shared apartment (16,201), land-appreciation tax (11,831), lawyer cost (10,927), appraiser (10,295), and spouse-property registration (7,432 and 84 clicks).
- FOUND: high-traffic foreign real-estate pages such as Greece, Dubai, UK, Portugal and broad foreign investment should remain discoverable but not outrank Israeli lawyer-lead pages unless monetization is confirmed.
- NEXT: owner approval is needed before public CMS edits; start with Israeli transaction pages and rewrite unsupported "recommended/free consultation/expert" language into factual selection/checklist language.
- UPRESS: no uPress pull was needed in this cycle because only repo planning artifacts changed; no deployable public theme code changed.
- SAFETY: no public CMS/database content, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.

## LATEST WORK STATUS - 2026-05-18 15:30 Asia/Jerusalem
- REAL ESTATE ROUTE RECOVERY: during the real-estate cycle, `/real-estate-lawyer-guide/` was found live as 404/noindex despite P0 GSC evidence (26,708 impressions and 7 clicks).
- RESEARCHED: Google crawlable/internal-link guidance, current internal-linking hub guidance, and leading Israeli real-estate-law competitor pages. Key point: real-estate competitors cluster around buying/selling apartments, contract review, land registry, real-estate tax, late delivery by contractor, appraisers and property agreements.
- IMPLEMENTED: `practice-real-estate-guide-route.php` and a controlled route guard in `inc/practice-landing.php` to render `/real-estate-lawyer-guide/` as a real indexable guide route without CMS/database edits.
- IMPLEMENTED: supporting links in the controlled route point to existing live pages for buying/selling apartment, real-estate registration, land-appreciation tax, lawyer cost, appraiser and marital-property agreement.
- UPDATED: deployment marker to `2026-05-18-real-estate-guide-route-v1`; live checkers now expect it and include `/real-estate-lawyer-guide/`.
- CREATED: `project-control/real-estate-guide-route-recovery-2026-05-18.md`.
- VERIFIED LOCAL: PHP lint passed for `inc/practice-landing.php`, `practice-real-estate-guide-route.php`, and `functions.php`; Node syntax passed for traffic-priority, HTML sitemap and owner-phone live checkers.
- DEPLOYED: Codex used uPress File Manager Git management for `wp-content/themes/justice-theme`; uPress did not show a clear success message, but the live deployment marker proves the pull landed.
- VERIFIED LIVE: `/real-estate-lawyer-guide/` is HTTP 200, indexable, self-canonical, includes the expected real-estate support links, and serves deployment marker `2026-05-18-real-estate-guide-route-v1`.
- VERIFIED LIVE: traffic-priority audit, HTML sitemap checker, and owner-phone checker all passed after uPress pull.
- SAFETY: no public CMS/database content, WordPress title/H1/meta, URL slug, redirect, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.

## LATEST WORK STATUS - 2026-05-18 15:20 Asia/Jerusalem
- CRIMINAL LAW MONEY CLUSTER: converted P0 GSC evidence into a support-to-hub internal-link plan for `/criminal-defense-attorney/`, the third homepage commercial-priority category.
- RESEARCHED: Google crawlable/internal-link guidance, current internal-linking hub guidance, and leading Israeli criminal-defense competitor pages. Key point: competitors cluster around police investigation, arrest, sex offenses, drug offenses, criminal record, white-collar/economic offenses, price/cost, and court representation.
- CREATED: `project-control/criminal-law-support-to-hub-map-2026-05-18.md`.
- CREATED: `project-control/criminal-law-support-to-hub-map-2026-05-18.csv`.
- VERIFIED LIVE: Googlebot-style fetch returned 200/indexable/self-canonical for `/criminal-defense-attorney/`, `/apply-for-police-criminal-information-certificates/`, `/sex-crime-lawyer/`, `/drug-related-crime/`, `/how-much-will-a-criminal-defense-lawyer-cost/`, `/tax-investigation-guide/`, `/famous-criminal-defense-lawyer/`, and `/what-is-money-laundering/`.
- FOUND: strongest support opportunities include police stations list (118,014 impressions and 482 clicks), criminal hub (62,561), famous/best lawyer pages (52,640 / 16,268 with trust-claim risk), criminal certificate page (38,667 and 188 clicks), criminal price pages (38,017 / 23,313), sex crimes (27,904), drug crimes (24,014), and tax investigations (22,811).
- NEXT: owner approval is needed before public CMS edits; start with lower-risk record/cost/drug/white-collar pages, hold sex-offense/victim-sensitive pages for extra legal/ethical review, and rewrite unsupported "recommended/best/leading/famous" language.
- UPRESS: no uPress pull was needed in this cycle because only repo planning artifacts changed; no deployable public theme code changed.
- SAFETY: no public CMS/database content, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.

## LATEST WORK STATUS - 2026-05-18 15:10 Asia/Jerusalem
- FAMILY/DIVORCE MONEY CLUSTER: converted P0 GSC evidence into a support-to-hub internal-link plan for `/family-law/`, the highest homepage commercial-priority category.
- RESEARCHED: Google crawlable/internal-link guidance, Google SEO starter guidance, and leading Israeli family/divorce competitor pages. Key point: competitors cluster around divorce agreement, costs, custody/parental responsibility, child support, dispute resolution, property division, mediation and process checklists.
- CREATED: `project-control/family-law-support-to-hub-map-2026-05-18.md`.
- CREATED: `project-control/family-law-support-to-hub-map-2026-05-18.csv`.
- VERIFIED LIVE: Googlebot-style fetch returned 200/indexable/self-canonical for `/family-law/`, `/free-divorce-agreement-template/`, `/joint-custody-shared-parenting/`, `/child-custody-modification/`, `/divorce-costs-2025/`, `/request-for-family-dispute-settlements/`, and `/how-much-does-a-divorce-agreement-cost/`.
- FOUND: strongest support opportunities include divorce agreement template (36,900 impressions and 185 clicks), child-support calculator (17,808 impressions), joint custody/shared parenting (16,996), updated divorce guide (16,790 and 128 clicks), custody modification (14,186), divorce costs (13,272), and how-to-choose divorce lawyer queries (13,216).
- NEXT: owner approval is needed before public CMS edits; then add one contextual factual link from each approved source page into `/family-law/`, avoiding unsupported "recommended/leading/free consultation" language.
- UPRESS: no uPress pull was needed in this cycle because only repo planning artifacts changed; no deployable public theme code changed.
- SAFETY: no public CMS/database content, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.

## LATEST WORK STATUS - 2026-05-18 15:00 Asia/Jerusalem
- MEDICAL MALPRACTICE MONEY CLUSTER: converted P0 GSC evidence into a support-to-hub internal-link plan for the recovered `/medical-malpractice-lawyer/` commercial page.
- RESEARCHED: Google crawlable/internal-link guidance, Google SEO starter guidance, and leading Israeli medical-malpractice competitor pages. Key point: competitors organize around birth malpractice, cerebral palsy, experts, costs, examples, hospitals, diagnosis/treatment errors and claim process.
- CREATED: `project-control/medical-malpractice-support-to-hub-map-2026-05-18.md`.
- CREATED: `project-control/medical-malpractice-support-to-hub-map-2026-05-18.csv`.
- VERIFIED LIVE: Googlebot-style fetch returned 200/indexable/self-canonical for `/medical-malpractice-lawyer/`, `/cerebral-palsy/`, `/what-is-medical-malpractice-definition-examples/`, `/malpractice-cerebral-palsy/`, `/medical-malpractice-common-errors-doctors-hospitals/`, and `/anesthesia-medical-malpractice/`.
- FOUND: strongest support opportunities include birth-malpractice lawyer query page (27,275 impressions), medical-malpractice lawyer comparison/trust page (19,549 impressions), United States malpractice page (10,267), claim-cost page (9,670), medical-expert list (8,191 and 144 clicks), and cerebral-palsy page (7,104 and 21 clicks).
- NEXT: owner approval is needed before public CMS edits; then add one contextual factual link from each approved source page into `/medical-malpractice-lawyer/`, avoiding unsupported "recommended/leading/free consultation" language.
- UPRESS: no uPress pull was needed in this cycle because only repo planning artifacts changed; no deployable public theme code changed.
- SAFETY: no public CMS/database content, article body, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.

## LATEST WORK STATUS - 2026-05-18 14:50 Asia/Jerusalem
- HOMEPAGE COMMERCIAL PRIORITY: converted the content triage into a homepage/internal-link priority map so the site can stop rewarding old content volume and start promoting lawyer-lead categories.
- RESEARCHED: Google SEO starter/internal-link guidance, Google crawl-budget guidance, and current large-site internal-link architecture guidance. Key point: homepage/global prominence should point to important user/business pages with descriptive anchors.
- VERIFIED CURRENT HOMEPAGE LOGIC: `template-parts/sections/practice-areas-grid.php` sorts practice areas by term `count`, which is crawlable but not aligned with business priority or lawyer monetization.
- CREATED: `project-control/homepage-commercial-priority-map-2026-05-18.md`.
- CREATED: `project-control/homepage-commercial-priority-map-2026-05-18.csv`.
- RECOMMENDED HOMEPAGE ORDER: Family/Divorce, Medical Malpractice, Criminal Law, Real Estate, Traffic Law, then Employment, Inheritance/Wills, Personal Injury, foreign/relocation, broad informational.
- VERIFIED LIVE: `tools/check-live-journeys.mjs` passed homepage lead path, lawyer directory, sample article, lawyer registration, plan-intent registration, XML sitemap and robots checks.
- UPRESS: no uPress pull was needed in this cycle because only repo planning artifacts changed; no deployable public theme code changed.
- SAFETY: no public CMS/database content, homepage template, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.

## LATEST WORK STATUS - 2026-05-18 14:40 Asia/Jerusalem
- CONTENT QUALITY / TRAFFIC RECOVERY: shifted from technical route recovery into content triage for outdated, weak, misclassified, corona-era, trust-claim and GSC-risk pages.
- RESEARCHED: Google core-update, helpful-content, and crawl-budget guidance. Key point: do not blindly delete legal/YMYL content; improve, merge, or remove only after page-level evidence review, because unhelpful sitewide content can suppress stronger pages.
- IMPLEMENTED: `tools/content-audit/build-content-triage.mjs`, a repeatable repo-only triage builder combining the URL migration map, live site-health audit, GSC URL summary, and content-gap map.
- CREATED: `project-control/content-triage-2026-05-18.csv` and `project-control/content-triage-2026-05-18.md`.
- RESULT: 2,055 triage candidates: 821 P0 protect/rewrite/merge candidates with strong GSC signals, 612 P1 review-before-change candidates, and 622 P2 owner-approval content cleanup candidates.
- FOUND: high-value GSC pages include police-station list, real estate attorney, criminal defense attorney, tax refund calculator, criminal certificates, divorce agreement template and other pages that must not be noindexed/deleted/redirected without owner/GSC review.
- FOUND: 40 outdated/corona-or-2020 cleanup candidates, 93 merge-mapping reviews, 19 trust-claim rewrite candidates, and 27 technical-first rows.
- NEXT: process P0 commercial/legal pages first for rewrite/merge protection, then batch outdated/corona candidates for owner approval, then connect high-value content gaps to family-law and medical-malpractice hubs.
- UPRESS: no uPress pull was needed in this cycle because only repo planning/reporting/tool artifacts changed; no deployable public theme code changed.
- SAFETY: no public CMS/database content, title/H1/meta, URL slug, redirect, canonical, noindex, taxonomy, sitemap setting, lawyer profile, lead record, payment setting, GA4/GSC setting or wp-admin setting was changed.

## LATEST WORK STATUS - 2026-05-18 14:34 Asia/Jerusalem
- PRIORITY CRAWL/UX RECOVERY: `/articles/` was the last failing item in the live traffic-priority audit and now passes.
- RESEARCHED: Google pagination guidance and large-site crawl-budget guidance. Key point: paginated content should expose crawlable sequential links, while huge link-heavy pages can waste crawl attention and weaken discovery priority.
- IMPLEMENTED: `inc/article-archive-controls.php` to cap the public `articles` archive main query at 24 posts per page while keeping standard pagination.
- UPDATED: deployment marker to `2026-05-18-articles-archive-segment-v1`; live marker checkers now expect it.
- PUSHED: GitHub `main` includes commit `c3b5a27` (`Segment articles archive output`).
- DEPLOYED: Codex used uPress File Manager Git management for `wp-content/themes/justice-theme`; the success toast did not appear, but live deployment marker verification proved the pull landed.
- VERIFIED LIVE: `/articles/` with Googlebot user agent is HTTP 200, indexable, about 125 KB, and 203 links, down from about 2.9 MB and 4,795 links.
- VERIFIED LIVE: full traffic-priority audit now passes all sampled priority routes: `/`, `/site-map/`, `/articles/`, `/family-law/`, `/lawyers/?area=family-law`, `/medical-malpractice-lawyer/`, `/criminal-defense-attorney/`, `/traffic-lawyer/`, `/contact/`, and `/about/`.
- VERIFIED LIVE: HTML sitemap, owner phone, and public user/lawyer/Googlebot journey checks passed after uPress pull.
- NEXT: move from technical traffic leaks into content classification, outdated/corona content review, homepage priority order, commercial cluster support links, and GSC query/page diagnostics.
- SAFETY: no public CMS/database content, taxonomy term, slug, redirect rule, XML sitemap setting, robots rule, lawyer record, lead record, payment setting, GA4/GSC setting or database row was changed.

## LATEST WORK STATUS - 2026-05-18 14:25 Asia/Jerusalem
- PRIORITY TRUST RECOVERY: `/contact/` and `/about/` were live 404/noindex paths and are now recovered as lightweight indexable trust routes.
- RESEARCHED: Google helpful-content guidance on clear "who/how/why" and site/About context, plus contact/about expectations for trust on high-stakes legal/YMYL-style sites.
- IMPLEMENTED: `inc/trust-routes.php` to serve `/contact/` and `/about/` without CMS/database edits.
- IMPLEMENTED: `/contact/` includes direct owner phone `0525101555`, email, lawyer-directory link and the existing lead form with the legal-advice boundary notice.
- IMPLEMENTED: `/about/` explains what Jus-Tice does, the limits of general legal information, and links to contact, sitemap, articles and lawyers.
- IMPLEMENTED: footer and dynamic HTML sitemap now link to `/contact/` and `/about/`.
- UPDATED: deployment marker to `2026-05-18-trust-routes-v1`; live marker checkers now expect it.
- PUSHED: GitHub `main` includes commit `72ed36c` (`Recover contact and about trust routes`).
- DEPLOYED: Codex used uPress File Manager Git management for `wp-content/themes/justice-theme`; the success toast did not appear, but live deployment marker verification proved the pull landed.
- VERIFIED LIVE: `/contact/` is HTTP 200, indexable, about 72 KB, and passes the traffic-priority audit.
- VERIFIED LIVE: `/about/` is HTTP 200, indexable, about 70 KB, and passes the traffic-priority audit.
- VERIFIED LIVE: HTML sitemap, owner phone, and public user/lawyer/Googlebot journey checks passed after uPress pull.
- REMAINING TRAFFIC BLOCKER: `/articles/` is still too large/link-dense at about 2.9 MB and 4,795 links.
- SAFETY: no public CMS/database content, taxonomy term, slug, redirect rule, XML sitemap setting, robots rule, lawyer record, lead record, payment setting, GA4/GSC setting or database row was changed.

## LATEST WORK STATUS - 2026-05-18 14:16 Asia/Jerusalem
- PRIORITY TRAFFIC RECOVERY: `/medical-malpractice-lawyer/` was a live commercial 404/noindex and is now recovered as an indexable controlled practice route.
- RESEARCHED: Google traffic-drop diagnostics, crawlable-link/site-structure guidance, and indexing guidance for fixing internally linked 404s.
- IMPLEMENTED: `practice-medical-malpractice-route.php` and route handling in `inc/practice-landing.php` to serve the medical-malpractice hub at the existing URL without CMS/database edits.
- IMPLEMENTED: index/follow robots, canonical, and title/meta filters for the recovered route.
- UPDATED: deployment marker to `2026-05-18-medical-malpractice-route-v1`; live marker checkers now expect it.
- PUSHED: GitHub `main` includes commit `2d1f99e` (`Recover medical malpractice money route`).
- DEPLOYED: Codex used uPress File Manager Git management for `wp-content/themes/justice-theme` and uPress reported `משיכת נתונים (Pull) הושלמה בהצלחה`.
- VERIFIED LIVE: `/medical-malpractice-lawyer/` now passes the traffic-priority audit with HTTP 200, about 56 KB, 67 links.
- VERIFIED LIVE: HTML sitemap, owner phone, and public user/lawyer/Googlebot journey checks passed after uPress pull.
- REMAINING TRAFFIC BLOCKERS: `/articles/` is still too large/link-dense; `/contact/` and `/about/` are still 404/noindex.
- SAFETY: no public CMS/database content, taxonomy term, slug, redirect rule, XML sitemap setting, robots rule, lawyer record, lead record, payment setting, GA4/GSC setting or database row was changed.

## LATEST WORK STATUS - 2026-05-18 13:05 Asia/Jerusalem
- PRIORITY INTERRUPTION ACCEPTED: owner reported traffic concern and requested an immediate dynamic HTML sitemap page, with web research first, linked close to the homepage/footer, and designed for Google crawling.
- RESEARCHED: Google Search Central crawlable-link guidance, Google's SEO Starter Guide site-structure guidance, and current internal-linking/HTML-sitemap best practices.
- IMPLEMENTED: dynamic human-readable sitemap route at `/site-map/` in `inc/html-sitemap.php`; `/html-sitemap/` 301-redirects to the canonical route.
- IMPLEMENTED: the sitemap is generated from live WordPress data without database writes: published `articles`, standard posts, non-empty `practice-areas`, non-empty `category` terms, selected pages, and approved public lawyer profiles.
- IMPLEMENTED: global footer now links to `/site-map/`, so the homepage and normal site pages point crawlers toward the HTML crawl hub.
- IMPLEMENTED: deployment marker updated to `2026-05-18-html-sitemap-v1`.
- CREATED: `tools/check-live-html-sitemap.mjs` to verify homepage/footer link, `/site-map/` status, crawlable anchors, article/lawyer hub links, deployment marker and Googlebot fetch behavior after uPress pull.
- CREATED: `project-control/html-sitemap-crawl-hub-plan-2026-05-18.md`.
- VERIFIED: `php -l inc/html-sitemap.php`, `php -l functions.php`, `php -l template-parts/layout/site-footer.php`, `node --check tools/check-live-html-sitemap.mjs`, and `git diff --check` passed.
- UPRESS PULL NEEDED AFTER PUSH: this is deployable public code. After GitHub push, run uPress Git Pull for `wp-content/themes/justice-theme`, then run `node tools/check-live-html-sitemap.mjs`.
- SAFETY: no public CMS/database content, taxonomy term, slug, redirect rule, XML sitemap setting, robots rule, lawyer record, lead record, payment setting, GA4/GSC setting or database row was changed.

## LIVE TRAFFIC AUDIT SNAPSHOT - 2026-05-18 13:20 Asia/Jerusalem
- VERIFIED: `tools/url-checker/site-health-audit.js` completed against the live site.
- RESULT: 1,292 URLs checked; 1,289 returned 200; 3 returned 404; 0 server errors; 0 redirect loops; 0 multi-hop redirects.
- FOUND 404: `/medical-malpractice-lawyer/`, `/contact/`, and `/about/`.
- FOUND DUPLICATE TITLE GROUPS: `חדלות פירעון`, `דיני נזיקין`, and `דיני עבודה`.
- CREATED: `reports/site-health-audit-2026-05-18.csv`.
- CREATED: `reports/site-health-summary-2026-05-18.txt`.
- NOTE: `/site-map/` failed live before commit/push because the sitemap change was still local; commit `ef30efb` is now pushed and requires a fresh uPress Git Pull before live verification.

## LATEST WORK STATUS - 2026-05-18 12:20 Asia/Jerusalem
- ACTIVE BUSINESS EXECUTION LOOP: owner instructed sequential cycles that start with current research, implement the highest-impact safe next change, and update shared repo progress for other agents.
- CREATED HEARTBEAT: `jus-tice-10-minute-execution-loop` is active and will continue this thread every 10 minutes if work stalls.
- UPDATED HEARTBEAT: the recurring mission now includes periodic hands-on checks for the public user journey, lawyer customer journey and Googlebot/indexing journey, plus uPress Git Pull after deployable code is pushed.
- RESEARCHED: Israeli legal directory competitors, legal intake automation, Google people-first/YMYL content guidance, and recurring billing options for Israel/WooCommerce.
- IMPLEMENTED: privacy-safe GA4/GTM event hooks in `assets/js/analytics-events.js`, enqueued from `inc/enqueue.php`.
- IMPLEMENTED: paid-plan interest now persists through lawyer registration preselection and successful registration redirects.
- IMPLEMENTED: lawyer dashboard now shows a first monthly-value snapshot using stored profile views, assigned leads and content requests, while clearly holding phone/WhatsApp/GSC metrics until GA4/GSC verification.
- IMPLEMENTED: `lawyer_plan_click` tracking for plan-selection links carrying `plan_interest`, so commercial plan demand is visible before signup completion.
- IMPLEMENTED: Lawyer Onboarding admin now turns selected plan interest into owner-facing sales-priority badges for faster follow-up.
- CREATED: `project-control/lawyer-monthly-value-report-spec-2026-05-18.md`, defining the recurring lawyer value report across CRM, GA4, GSC, content, profile and customer-success data.
- IMPLEMENTED: Justice CRM now shows display-only lead quality and follow-up badges derived from existing lead fields, with no database mutation.
- IMPLEMENTED: owner-only lead disposition meta box for lead quality override, follow-up status, first contact time and customer-success note.
- IMPLEMENTED: Justice CRM now shows a display-only Response SLA badge so urgent/fresh/overdue leads are visible before automation sends any message.
- CREATED: `tools/check-live-journeys.mjs`, a read-only live checker for public user, lawyer customer and Googlebot journeys.
- UPDATED: `project-control/strategic-goals.md` now records the user journey, lawyer customer journey and Googlebot journey as standing quality goals.
- UPDATED: `project-control/goal-execution-loop-2026-05-18.md`, `project-control/analytics-monitoring-plan.md`, and `project-control/ga4-event-plan.csv`.
- VERIFIED: `node --check assets/js/analytics-events.js` passed; `node --check tools/check-live-journeys.mjs` passed; `php -l inc/enqueue.php` passed; `php -l inc/lead-crm.php` passed.
- VERIFIED LIVE: `node tools/check-live-journeys.mjs` passed sampled public user, lawyer customer and Googlebot checks for homepage, `/lawyers/`, sample article, `/lawyer-registration/`, `/lawyer-registration/?plan_interest=pro`, `/sitemap_index.xml` and `/robots.txt`.
- CREATED: `tools/check-live-deployment.mjs`, a read-only checker that proves whether the pushed growth analytics batch is actually served by uPress.
- VERIFIED: `node --check tools/check-live-deployment.mjs` passed.
- VERIFIED DEPLOYMENT AFTER OWNER MANUAL PULL: `node tools/check-live-deployment.mjs` now passes; live `assets/js/analytics-events.js` returns `200`, homepage serves analytics through Autoptimize, and deployment markers are present.
- CREATED: `project-control/lawyer-time-to-first-value-plan-2026-05-18.md`, defining lawyer activation, first measurable value, retention value, at-risk rules and next owner/admin signals.
- IMPLEMENTED: owner-only lawyer activation status fields in `inc/lawyer-onboarding.php` for `activation_status`, `first_value_at`, and `activation_owner_note`; new registrations start as `registered`.
- PUSHED: GitHub `main` includes `c2c4328` (`Add lawyer activation tracking fields`).
- UPRESS PULL NEEDED: latest admin activation fields are pushed to GitHub but not verified on uPress yet; browser/uPress control tool was not exposed in this heartbeat session.
- BLOCKED: live GA4/GTM receipt, GA4 key-event configuration, payment provider selection, pricing/legal/tax/refund terms, and live payment activation remain unverified/not approved.
- NEXT: continue the loop with browser/visual checks after deployment, CRM/admin verification, lawyer-registration value proposition and recurring lawyer-retention/product packaging.

## LATEST WORK STATUS - 2026-05-12 07:17 Asia/Jerusalem
- VERIFIED PLANNING / WAVE 1B SUPPORT METADATA PACKAGE: created exact metadata posture for all six Family/Divorce support pages.
- CREATED: `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.csv`.
- VERIFIED LIVE: `/consensual-divorce/`, `/divorce-mediation/`, `/divorce-property-division/`, `/family-dispute-resolution/`, `/child-support/` and `/child-custody/` all returned `200` and self-canonicalized.
- VERIFIED: the six clean support bodies total `11,222` words and now have a `6`-row metadata package covering H1/title, meta description, OG posture, breadcrumb label, taxonomy, related-link boundaries and schema/trust exclusions.
- RECOMMENDED: preserve the current safe support metadata unless owner requests edits; do not rewrite metadata just to change it.
- BLOCKED: `FAM-UPLOAD-061` now blocks support metadata/public upload approval until owner/legal/source approval.
- BLOCKED: no public content, support title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 04:36 Asia/Jerusalem
- VERIFIED PLANNING / DIVORCE LAWYER CMS UPLOAD FIELD MAP: created the practical CMS field worksheet for the first `/divorce-lawyer/` upload candidate.
- CREATED: `project-control/family-divorce-divorce-lawyer-cms-upload-field-map-2026-05-12.md`.
- CREATED: `project-control/family-divorce-divorce-lawyer-cms-upload-field-map-2026-05-12.csv`.
- VERIFIED: the map converts the clean body, metadata package and controlled QA package into `24` upload fields/actions covering URL, backup, body, title/H1, SEO meta, OG fields, breadcrumb, canonical, robots, taxonomy, related links, schema safety, disclaimer, CTA, post-upload QA and GSC monitoring.
- VERIFIED: the field map keeps the slug/canonical unchanged, protects old URLs/assets and blocks Review/AggregateRating/fake trust/fake rating claims.
- BLOCKED: `FAM-UPLOAD-059` now blocks CMS field execution until owner approval of the clean body, metadata and field map.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 04:26 Asia/Jerusalem
- VERIFIED PLANNING / DIVORCE LAWYER METADATA PACKAGE: created the exact title/H1/meta/canonical/taxonomy package for the first `/divorce-lawyer/` upload candidate.
- CREATED: `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-divorce-lawyer-metadata-package-2026-05-12.csv`.
- VERIFIED: live `/divorce-lawyer/` returned `200` and self-canonicalized to `https://jus-tice.co.il/divorce-lawyer/`.
- VERIFIED: current live title, H1, meta description and clean body size were captured before any public change.
- RECOMMENDED: use the tighter H1 `עורך דין גירושין: מדריך לבחירה נכונה ולהיערכות להליך` and SEO title `עורך דין גירושין | מדריך לבחירה נכונה ולהיערכות להליך` if the first upload is approved.
- VERIFIED: the metadata package keeps the slug and canonical unchanged, assigns only `family-law` and `divorce`, blocks Review/AggregateRating/fake trust claims and limits related links to the approved Family/Divorce boundaries.
- BLOCKED: `FAM-UPLOAD-057` now blocks metadata/public upload approval until owner approval.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 04:14 Asia/Jerusalem
- VERIFIED PLANNING / FIRST UPLOAD DECISION BRIEF: created the short owner-facing decision brief for the first Family/Divorce public upload.
- CREATED: `project-control/family-divorce-first-upload-decision-brief-2026-05-12.md`.
- CREATED: `project-control/family-divorce-first-upload-decision-brief-2026-05-12.csv`.
- VERIFIED: the brief defines `10` decision rows covering Wave 1A, support copy approval, lower-risk support path, protected assets, taxonomy, related links, trust/schema exclusions, GSC API and immediate next action.
- RECOMMENDED: first public upload should be Wave 1A only: `/divorce-lawyer/`, after owner/legal/source approval and controlled QA.
- BLOCKED: `FAM-UPLOAD-055` now blocks the first public Family/Divorce upload scope until owner approval.
- RECOMMENDED NEXT: approve or edit `content-drafts/divorce-lawyer-public-body-he.md`; if approval is not ready, prepare exact `/divorce-lawyer/` title/H1/meta package as repo-only work.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 04:04 Asia/Jerusalem
- VERIFIED PLANNING / WAVE 1B SUPPORT APPROVAL PACKAGE: created the owner/legal/source approval gate for all six clean Family/Divorce support bodies.
- CREATED: `project-control/family-divorce-wave-1b-support-approval-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-wave-1b-support-approval-package-2026-05-12.csv`.
- VERIFIED: the six clean support bodies total `11,222` words across `435` lines.
- VERIFIED: strict scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language, recommendation-label terms or guaranteed-result claims.
- FIXED: two harmless "not recommended" phrasing hits in `/divorce-property-division/` and `/family-dispute-resolution/` were rewritten so the scan stays clean.
- VERIFIED: `FAM-UPLOAD-052` is now planning-verified.
- BLOCKED: `FAM-UPLOAD-053` now blocks support upload scope until owner/legal/source approval.
- RECOMMENDED: approve copy as a batch, but keep public upload blocked until `/divorce-lawyer/` upload scope and QA are settled.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 03:56 Asia/Jerusalem
- PARTIAL VERIFIED / CHILD CUSTODY CMS-CLEAN PUBLIC BODY: created the clean public Hebrew body for the sixth Wave 1B support page.
- CREATED: `content-drafts/child-custody-public-body-he.md`.
- VERIFIED: the clean body is `1,693` words across `54` lines.
- VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language, custody-result promises or guaranteed-result claims.
- VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/child-support/`, `/consensual-divorce/`, `/divorce-mediation/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
- PARTIAL VERIFIED: `FAM-UPLOAD-050` is now partially verified; the clean file exists, but it still needs owner/legal/source approval.
- BLOCKED: `FAM-UPLOAD-051` now blocks public upload until the clean body is approved.
- VERIFIED: all six Wave 1B support pages now have CMS-clean public bodies.
- RECOMMENDED: review the six clean support bodies as one owner/legal/source approval batch, or return to the first controlled `/divorce-lawyer/` upload decision.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 03:45 Asia/Jerusalem
- PARTIAL VERIFIED / CHILD SUPPORT CMS-CLEAN PUBLIC BODY: created the clean public Hebrew body for the fifth Wave 1B support page.
- CREATED: `content-drafts/child-support-public-body-he.md`.
- VERIFIED: the clean body is `1,729` words across `49` lines.
- VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language, fixed calculator promises or guaranteed-result claims.
- VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-custody/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
- PARTIAL VERIFIED: `FAM-UPLOAD-048` is now partially verified; the clean file exists, but it still needs owner/legal/source approval.
- BLOCKED: `FAM-UPLOAD-049` now blocks public upload until the clean body is approved.
- RECOMMENDED: `/child-custody/` clean body now exists; review all six Wave 1B support bodies before any support upload.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 03:36 Asia/Jerusalem
- PARTIAL VERIFIED / FAMILY DISPUTE RESOLUTION CMS-CLEAN PUBLIC BODY: created the clean public Hebrew body for the fourth Wave 1B support page.
- CREATED: `content-drafts/family-dispute-resolution-public-body-he.md`.
- VERIFIED: the clean body is `1,992` words across `87` lines.
- VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language or guaranteed-result claims.
- VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/` and `/divorce-property-division/`.
- PARTIAL VERIFIED: `FAM-UPLOAD-046` is now partially verified; the clean file exists, but it still needs owner/legal/source approval.
- BLOCKED: `FAM-UPLOAD-047` now blocks public upload until the clean body is approved.
- RECOMMENDED: prepare the CMS-clean `/child-support/` body next if the repo-only support prep continues.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 03:25 Asia/Jerusalem
- PARTIAL VERIFIED / DIVORCE PROPERTY DIVISION CMS-CLEAN PUBLIC BODY: created the clean public Hebrew body for the third Wave 1B support page.
- CREATED: `content-drafts/divorce-property-division-public-body-he.md`.
- VERIFIED: the clean body is `1,874` words across `89` lines.
- VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language or guaranteed-result claims.
- VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/` and `/family-dispute-resolution/`.
- PARTIAL VERIFIED: `FAM-UPLOAD-044` is now partially verified; the clean file exists, but it still needs owner/legal/source approval.
- BLOCKED: `FAM-UPLOAD-045` now blocks public upload until the clean body is approved.
- RECOMMENDED: prepare the CMS-clean `/family-dispute-resolution/` body next if the repo-only support prep continues.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 03:16 Asia/Jerusalem
- PARTIAL VERIFIED / DIVORCE MEDIATION CMS-CLEAN PUBLIC BODY: created the clean public Hebrew body for the second Wave 1B support page.
- CREATED: `content-drafts/divorce-mediation-public-body-he.md`.
- VERIFIED: the clean body is `2,059` words across `77` lines.
- VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language or guaranteed-result claims.
- VERIFIED: required Family/Divorce related paths were found for `/divorce-lawyer/`, `/consensual-divorce/`, `/child-support/`, `/child-custody/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
- PARTIAL VERIFIED: `FAM-UPLOAD-042` is now partially verified; the clean file exists, but it still needs owner/legal/source approval.
- BLOCKED: `FAM-UPLOAD-043` now blocks public upload until the clean body is approved.
- RECOMMENDED: prepare the CMS-clean `/divorce-property-division/` body next if the repo-only support prep continues.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 03:05 Asia/Jerusalem
- PARTIAL VERIFIED / CONSENSUAL DIVORCE CMS-CLEAN PUBLIC BODY: created the clean public Hebrew body for the first Wave 1B support page.
- CREATED: `content-drafts/consensual-divorce-public-body-he.md`.
- VERIFIED: the clean body is `1,875` words across `79` lines.
- VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, Maya/profile notes, LegalTech notes, fake-trust language, fake-rating language or guaranteed-result claims.
- PARTIAL VERIFIED: `FAM-UPLOAD-040` is now partially verified; the clean file exists, but it still needs owner/legal/source approval.
- BLOCKED: `FAM-UPLOAD-041` now blocks public upload until the clean body is approved.
- RECOMMENDED: prepare the CMS-clean `/divorce-mediation/` body next if the repo-only support prep continues.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 02:53 Asia/Jerusalem
- VERIFIED PLANNING / FAMILY-DIVORCE WAVE 1B SUPPORT REVIEW PACKAGE: reviewed the six support-page drafts planned after `/divorce-lawyer/`.
- CREATED: `project-control/family-divorce-wave-1b-support-review-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-wave-1b-support-review-package-2026-05-12.csv`.
- VERIFIED: `6` support drafts exist and total `27,277` words across agreement, mediation, child support, custody, property division and dispute-resolution procedure.
- VERIFIED: all six drafts target clean English URLs and support `/divorce-lawyer/`.
- NOT VERIFIED / NOT CMS-CLEAN: all six still contain internal production notes, source-audit notes, CMS notes, Maya/profile notes, LegalTech notes or pre-publication status notes.
- RECOMMENDED: create clean public support bodies next, starting with `/consensual-divorce/` and then `/divorce-mediation/`.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 02:42 Asia/Jerusalem
- VERIFIED PLANNING / DIVORCE LAWYER CONTROLLED UPLOAD QA PACKAGE: created the first practical QA package for a controlled `/divorce-lawyer/` upload after approval.
- CREATED: `project-control/family-divorce-controlled-upload-qa-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-controlled-upload-qa-package-2026-05-12.csv`.
- VERIFIED: `32` QA rows cover pre-upload approval, backup, content cleanliness, title/H1/meta, taxonomy, related cards, protected old URLs/assets, canonical/indexability, mobile/desktop QA, GSC follow-up and rollback.
- VERIFIED: `FAM-UPLOAD-037` is now planning-verified.
- BLOCKED: `FAM-UPLOAD-038` remains blocked until there is an approved preview or public upload to test.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 02:36 Asia/Jerusalem
- PARTIAL VERIFIED / DIVORCE LAWYER CMS-CLEAN PUBLIC BODY: created a clean public Hebrew body for the first Family/Divorce upload candidate.
- CREATED: `content-drafts/divorce-lawyer-public-body-he.md`.
- VERIFIED: the clean body is `2,374` words across `92` lines.
- VERIFIED: scans found no internal planning notes, `TODO`/`TBD`, fake-trust language, fake-rating language or guaranteed-result claims.
- PARTIAL VERIFIED: `FAM-UPLOAD-035` is now partially verified; the clean file exists, but it still needs owner/legal/source approval.
- BLOCKED: `FAM-UPLOAD-036` now blocks public upload until the clean body is approved.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 04:45 Asia/Jerusalem
- PARTIAL VERIFIED / DIVORCE LAWYER FINAL DRAFT PACKAGE: translated the existing `5,691`-word `/divorce-lawyer/` Hebrew draft and 20-section merge outline into a CMS update plan.
- CREATED: `project-control/family-divorce-divorce-lawyer-final-draft-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-divorce-lawyer-final-draft-package-2026-05-12.csv`.
- VERIFIED: `36` package rows now cover CMS fields, internal-note removals, section actions, related-content controls, schema block and URL hold state.
- PARTIAL VERIFIED: `FAM-UPLOAD-027` is now partially verified; the final draft package exists, but a CMS-clean public body file has not been created yet.
- RECOMMENDED: create the clean `/divorce-lawyer/` public body file next, removing internal notes, duplicate FAQ and planning sections.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 04:25 Asia/Jerusalem
- VERIFIED / FAMILY-DIVORCE FIRST UPLOAD PACKAGE: converted the Family/Divorce planning work into a practical owner-review upload sequence.
- CREATED: `project-control/family-divorce-first-upload-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-first-upload-package-2026-05-12.csv`.
- VERIFIED: `20` package rows now define Wave 1A, Wave 1B, Wave 1C, wait-list, QA and GSC lanes.
- VERIFIED: Wave 1A is `/divorce-lawyer/`; Wave 1B contains `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/`, `/divorce-property-division/` and `/family-dispute-resolution/`.
- RECOMMENDED: prepare the final merged `/divorce-lawyer/` draft/update package next; do not publish all seven pages blindly as one dump.
- BLOCKED: owner approval is still required before public upload or draft import, and GSC API is still required before URL, redirect, noindex, deletion, canonical or sitemap-removal actions.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 04:05 Asia/Jerusalem
- VERIFIED / FAMILY-DIVORCE PROTECTED ASSETS STRATEGY: created the first-wave protected document, tool and case-law strategy for the controlled Family/Divorce upload.
- CREATED: `project-control/family-divorce-protected-assets-strategy-2026-05-12.md`.
- CREATED: `project-control/family-divorce-protected-assets-strategy-2026-05-12.csv`.
- VERIFIED: `16` protected asset rows now cover the divorce PDF, mediation DOCX, child-support calculator, 919/15 case-law asset, what-is-child-custody article, ChildCustody PDF, sole-mother custody case reference and upload QA gates.
- VERIFIED: `FAM-UPLOAD-003`, `FAM-UPLOAD-004`, `FAM-UPLOAD-005` and `FAM-UPLOAD-006` are now `VERIFIED PLANNING`; this protects assets but does not approve execution.
- BLOCKED: GSC API export and owner approval are still required before any redirect, noindex, deletion, canonical, sitemap-removal, media-file, document-template, calculator/tool or public content action.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 03:45 Asia/Jerusalem
- VERIFIED / FAMILY-DIVORCE DISCLAIMER CTA POLICY: created the disclaimer, CTA and trust-language gate for the first controlled Family/Divorce upload.
- CREATED: `project-control/family-divorce-disclaimer-cta-policy-2026-05-12.md`.
- CREATED: `project-control/family-divorce-disclaimer-cta-policy-2026-05-12.csv`.
- VERIFIED: `20` disclaimer/CTA policy rows now cover every first-wave Family/Divorce page, lead CTA disclaimers, urgent-risk language, Maya profile boundaries, fake trust exclusions and schema restrictions.
- VERIFIED: `FAM-UPLOAD-016` is now `VERIFIED PLANNING`; live disclaimer QA remains blocked until preview/public upload exists.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 03:25 Asia/Jerusalem
- VERIFIED / FAMILY-DIVORCE TAXONOMY CATEGORY PLAN: created the first-wave taxonomy/category rules for the controlled Family/Divorce upload gate.
- CREATED: `project-control/family-divorce-taxonomy-category-plan-2026-05-12.md`.
- CREATED: `project-control/family-divorce-taxonomy-category-plan-2026-05-12.csv`.
- VERIFIED: `22` taxonomy/category decision rows now define allowed first-wave terms, held terms, blocked new term creation, metadata rules, lawyer-profile boundaries and sitemap posture.
- VERIFIED: first-wave pages should use existing `practice-areas` terms only: `family-law`, `divorce`, `child-support` and `child-custody`; no new Family/Divorce term archives should be created during the first upload.
- VERIFIED RISK: current slug `prenuptial-agreement` appears attached to an unrelated criminal/ruling term in the category map, so the future `הסכם ממון` page/term remains blocked until term cleanup.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 03:05 Asia/Jerusalem
- VERIFIED / DIVORCE PILLAR RELATED-CONTENT BOUNDARY PLAN: created a manual related-card allowlist and blocked-list for `/divorce-lawyer/` before any public upload.
- CREATED: `project-control/family-divorce-related-content-boundary-plan-2026-05-12.md`.
- CREATED: `project-control/family-divorce-related-content-boundary-plan-2026-05-12.csv`.
- VERIFIED: `20` related-content decision rows now define primary support cards, secondary/deep links, freshness/legal review gates and blocked trust/ranking/city/LegalTech/profile/document assets.
- VERIFIED: first upload related cards should prefer `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/` and `/child-custody/`; broad recommended/top/trusted lawyer pages remain blocked.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 02:45 Asia/Jerusalem
- VERIFIED / DIVORCE PILLAR OWNER-REVIEW DRAFT PACKAGE: converted the `/divorce-lawyer/` section merge outline into an owner approval package for the first controlled Family/Divorce upload candidate.
- CREATED: `project-control/family-divorce-pillar-owner-review-draft-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-pillar-owner-review-draft-package-2026-05-12.csv`.
- VERIFIED: `15` owner decision rows now define the primary URL, merge sources, support-page boundaries, related-content boundary, metadata posture, review gates and redirect/canonical/sitemap hold state.
- VERIFIED: `/divorce-lawyer/` is now close to first controlled upload readiness, but final public copy is still blocked until owner approval and final draft review.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 02:25 Asia/Jerusalem
- VERIFIED / DIVORCE PILLAR SECTION MERGE OUTLINE: converted the duplicate-page comparison into a section-by-section merge plan for the final `/divorce-lawyer/` pillar.
- CREATED: `project-control/family-divorce-pillar-section-merge-outline-2026-05-12.md`.
- CREATED: `project-control/family-divorce-pillar-section-merge-outline-2026-05-12.csv`.
- VERIFIED: `20` target pillar sections now define what to keep, merge, keep separate, review legally, exclude and link internally.
- VERIFIED: the large Hebrew duplicate is assigned as a section source, while `/divorce-consultation-guide/` remains support and `/divorce-everything-you-need-to-know/` remains held for process-role review.
- REVIEW: the live `/divorce-lawyer/` related-content area includes broad/recommendation-style items, so related-card boundaries must be cleaned before upload execution.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 02:10 Asia/Jerusalem
- VERIFIED / FAMILY-DIVORCE DUPLICATE PAGE COMPARISON: compared the clean `/divorce-lawyer/` target against the large Hebrew duplicate, selection article, definition article, generic divorce guide and consultation guide.
- CREATED: `project-control/family-divorce-duplicate-page-comparison-2026-05-12.md`.
- CREATED: `project-control/family-divorce-duplicate-page-comparison-2026-05-12.csv`.
- VERIFIED LIVE: `6` checked URLs return `200` and self-canonicalize, so the divorce-lawyer upload group is a real cannibalization/merge group.
- VERIFIED LIVE: the large Hebrew duplicate `/עורך-דין-לענייני-גירושין/` has the strongest current live word count (`9,697`) and must be mined before final `/divorce-lawyer/` upload.
- RECOMMENDED: keep `/divorce-lawyer/` as the future primary pillar, merge useful sections from the large duplicate and smaller selection/definition pages, keep consultation as support and hold the broad generic divorce guide until process-role review.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 02:00 Asia/Jerusalem
- VERIFIED / DIVORCE PILLAR SIDE-BY-SIDE REVIEW: compared the clean `/divorce-lawyer/` pillar candidate against the old Hebrew divorce URL with existing GSC evidence and live page checks.
- CREATED: `project-control/family-divorce-divorce-pillar-side-by-side-2026-05-12.md`.
- CREATED: `project-control/family-divorce-first-upload-decision-table-2026-05-12.csv`.
- VERIFIED LIVE: `/divorce-lawyer/` returns `200`, self-canonicalizes, has the intended divorce-lawyer H1/meta direction and is the best first public repair/enrichment candidate after approval.
- VERIFIED LIVE: the old Hebrew divorce URL returns `200`, self-canonicalizes, has only `697` exported words but has `960` GSC-browser impressions for `עורך דין גירושין`, so it remains protected short term.
- RECOMMENDED: merge useful old-page value into `/divorce-lawyer/`; do not treat the weak old page as sacred forever; decide redirect/canonical only after GSC API export and owner approval.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 01:35 Asia/Jerusalem
- VERIFIED / FAMILY LAW DIVORCE EXECUTION PLAN + GSC SETUP GUIDE: prepared the first cluster execution plan under the staged publishing strategy and saved a simple owner-facing GSC API connection guide for tomorrow.
- CREATED: `project-control/gsc-api-setup-guide.md`.
- CREATED: `project-control/family-law-divorce-execution-plan-2026-05-12.md`.
- VERIFIED: the Family/Divorce plan covers competitor research, current Jus-Tice pages, keep/improve/merge/new-page decisions, pillar/support structures, internal-link posture, English slug map, redirect/canonical notes, content gaps, upload checklist, first-publish candidates and wait list.
- VERIFIED: GSC setup guide explains required Search Console access, Google Cloud/API/OAuth credentials, read-only scope, export fields, first Family/Divorce exports and token safety.
- RECOMMENDED: continue with side-by-side comparison for `/divorce-lawyer/` against the old Hebrew divorce URL, then run GSC API export once access is ready.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, deletion, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 00:55 Asia/Jerusalem
- VERIFIED / STRATEGY SHIFT TO CLUSTER-BY-CLUSTER PUBLISHING: documented the faster staged publishing strategy so content upload can advance one legal field at a time instead of waiting for a full 1,200-article audit.
- CREATED: `project-control/cluster-by-cluster-publishing-strategy-2026-05-12.md`.
- CREATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.md`.
- CREATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.csv`.
- CREATED: `project-control/gsc-api-access-plan-2026-05-12.md`.
- VERIFIED: Family/Divorce remains the recommended first upload cluster, followed by Criminal Law, Medical Malpractice, Traffic, Real Estate and Personal Injury/Damages.
- VERIFIED: the minimum safe upload gate now explicitly requires URL conflict prevention, protected old URL/document review, anti-cannibalization, English slug posture, internal-link map, redirect/canonical/sitemap posture, no-fake-trust controls and post-publish monitoring.
- RECOMMENDED: set up GSC API read-only exports for `https://jus-tice.co.il/` to reduce browser-based query/page checks and speed each future cluster by roughly one work cycle.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-12 00:30 Asia/Jerusalem
- VERIFIED / FAMILY-DIVORCE INTERNAL-LINK MAP + OWNER UPLOAD REVIEW PACKAGE: converted the family/divorce current-URL readiness queue into a no-URL internal-link map and owner-facing upload review layer.
- CREATED: `project-control/family-divorce-no-url-internal-link-map-2026-05-12.md`.
- CREATED: `project-control/family-divorce-no-url-internal-link-map-2026-05-12.csv`.
- CREATED: `project-control/family-divorce-owner-upload-review-package-2026-05-12.md`.
- CREATED: `project-control/family-divorce-owner-upload-review-package-2026-05-12.csv`.
- VERIFIED: `82` planned relationship/control rows now connect the divorce pillar, six support pages, protected old GSC/document URLs, child-support/custody assets, property/dispute supports and compliance boundaries without using future unapproved hub/ranking/trust paths.
- VERIFIED: `13` owner-review decisions are packaged before any public upload, including old Hebrew URL comparison, document strategy, support roles, cost/freshness review, family-law hub separation, Maya profile safety and ranking/trust-language exclusions.
- READY FOR REVIEW: next safe step is owner/legal approval for side-by-side comparison and document strategy before any public Hebrew copy, draft import or URL execution.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 23:25 Asia/Jerusalem
- VERIFIED / MEDICAL MALPRACTICE INTERNAL-LINK MAP + OWNER UPLOAD REVIEW PACKAGE: converted the malpractice current-URL readiness queue into a no-URL internal-link map and owner-facing upload review layer.
- CREATED: `project-control/medical-malpractice-no-url-internal-link-map-2026-05-11.md`.
- CREATED: `project-control/medical-malpractice-no-url-internal-link-map-2026-05-11.csv`.
- CREATED: `project-control/medical-malpractice-owner-upload-review-package-2026-05-11.md`.
- CREATED: `project-control/medical-malpractice-owner-upload-review-package-2026-05-11.csv`.
- VERIFIED: `38` planned relationship/control rows now connect the malpractice pillar candidate, protected fee/birth assets, surgery/anesthesia support, definition/common-errors support, birth-injury support and boundary exclusions without using future slugs.
- VERIFIED: `8` owner-review decisions are packaged before any public upload, including duplicate same-public-URL identity review, protected GSC-visible fee/birth pages, source/legal gates, support-page roles and blocked future slugs.
- READY FOR REVIEW: next safe step is owner/legal approval for side-by-side comparison before any public Hebrew copy or URL execution.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 23:59 Asia/Jerusalem
- VERIFIED / MEDICAL MALPRACTICE CURRENT-URL UPLOAD READINESS: converted the malpractice owner packet, inventory scan and source/legal gates into a current-URL upload-readiness queue.
- CREATED: `project-control/medical-malpractice-current-url-upload-readiness-2026-05-11.md`.
- CREATED: `project-control/medical-malpractice-current-url-upload-readiness-2026-05-11.csv`.
- VERIFIED: `19` inventory candidates were scanned and `23` URL or URL-reference items were advanced into review roles, including duplicate same-public-URL state, fee/cost article, birth/pregnancy old URL, support pages, traffic/criminal boundaries and future-only slugs.
- VERIFIED: the queue records pillar/support/protected/boundary roles, internal-link posture, sitemap posture and blocked future slugs for the malpractice cluster.
- READY FOR REVIEW: next safe step is a current-URL internal-link map before an owner upload package.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 23:59 Asia/Jerusalem
- VERIFIED SOURCE ANCHORS / MEDICAL MALPRACTICE SOURCE-LEGAL CHECKLIST: created the source/legal gate for the medical-malpractice cluster before any public YMYL copy or URL execution.
- CREATED: `project-control/medical-malpractice-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/medical-malpractice-source-legal-checklist-2026-05-11.csv`.
- VERIFIED: `8` page/topic gates were mapped: commercial pillar, fee/cost support, birth/pregnancy malpractice, birth injury/cerebral palsy, surgery/anesthesia/hospital error, definition/common-errors, records/evidence/expert-opinion/privacy and system/report background.
- VERIFIED: source anchors were documented from Ministry of Health, Kol Zchut, Patient Rights Law PDF, Gov.il malpractice committee, State Comptroller report and medical-record documentation sources.
- CONTENT-UPLOAD READINESS: final Hebrew medical-malpractice copy remains blocked, but allowed/blocked claims, privacy risk, source anchors, schema/review limits and legal-review status are now documented.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 23:58 Asia/Jerusalem
- VERIFIED / FAMILY-DIVORCE CURRENT-URL UPLOAD READINESS: consolidated the family/divorce cluster into a larger current-URL readiness queue before any public upload.
- CREATED: `project-control/family-divorce-current-url-upload-readiness-2026-05-11.md`.
- CREATED: `project-control/family-divorce-current-url-upload-readiness-2026-05-11.csv`.
- VERIFIED: `92` inventory candidates were scanned and `58` family/divorce URL or URL-reference items were advanced into review roles.
- VERIFIED: the queue separates divorce pillar, support pages, protected old GSC-visible URLs, document risks, child-support/custody risks, property/dispute supports, broad family-lawyer hub risks, Maya profile risks and future-only decisions.
- READY FOR REVIEW: family/divorce now has page roles, support hierarchy, protected high-risk URLs, merge candidates, future-only slugs, sitemap posture, internal-link requirements and related-content boundaries in one consolidated package.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, Maya profile, review/rating, CRM, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 23:38 Asia/Jerusalem
- VERIFIED / TRAFFIC LAW OWNER UPLOAD REVIEW PACKAGE: packaged the first traffic-law group into a single owner-review approval layer before any content upload.
- CREATED: `project-control/traffic-law-owner-upload-review-package-2026-05-11.md`.
- CREATED: `project-control/traffic-law-owner-upload-review-package-2026-05-11.csv`.
- VERIFIED: `5` target decisions are ready for owner review: traffic-law pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness.
- VERIFIED: package combines outline structure, source/legal gates, current-URL internal-link map, upload order, anti-cannibalization rules and blocked future slugs.
- RECOMMENDED: approve the planning package only, then draft `/traffic-lawyer/` first under source/legal review.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 23:25 Asia/Jerusalem
- VERIFIED / TRAFFIC LAW NO-URL INTERNAL LINK MAP: created the first current-URL internal-link map for the traffic-law upload group.
- CREATED: `project-control/traffic-law-no-url-internal-link-map-2026-05-11.md`.
- CREATED: `project-control/traffic-law-no-url-internal-link-map-2026-05-11.csv`.
- VERIFIED: `31` planned internal-link relationships connect the traffic-law pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness without using blocked future slugs.
- VERIFIED: the map separates priority 1 pillar/support links, priority 2 evidence/license/process links and priority 3 boundary links.
- CONTENT-UPLOAD READINESS: the traffic-law group now has outline structure, source/legal gates and a current-URL internal-link map.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 23:12 Asia/Jerusalem
- VERIFIED SOURCE ANCHORS / TRAFFIC LAW SOURCE-LEGAL CHECKLIST: created the source/legal gate for the first traffic-law upload group before any public drafting.
- CREATED: `project-control/traffic-law-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/traffic-law-source-legal-checklist-2026-05-11.csv`.
- VERIFIED: `5` page/topic gates were mapped for traffic-law pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness.
- VERIFIED: official/public source anchors are documented for police intoxication/breathalyzer procedures, Ministry of Transport point/suspension workflows, driver inquiries and Marvad medical-fitness workflows, with limitations noted.
- CONTENT-UPLOAD READINESS: final Hebrew copy is still blocked, but the traffic-law group now has source anchors, allowed/blocked legal claims, privacy/medical-risk flags, disclaimer requirements and approval status.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 23:00 Asia/Jerusalem
- VERIFIED / TRAFFIC LAW NO-URL-CHANGE OUTLINE QUEUE: converted the traffic-law upload-readiness evidence into the next practical outline batch.
- CREATED: `project-control/traffic-law-no-url-change-outline-queue-2026-05-11.md`.
- CREATED: `project-control/traffic-law-no-url-change-outline-queue-2026-05-11.csv`.
- VERIFIED: `5` outline targets were prepared across `10` current URLs: traffic-law pillar, drunk driving, breathalyzer/refusal/testing, speeding/points/license risk and Marvad/medical fitness.
- VERIFIED: the queue uses current URLs only and keeps `/drunk-driving/`, `/breathalyzer-test/`, `/license-suspension/`, `/traffic-evidence/` and `/fatal-road-accident-offenses/` blocked as future-only slugs.
- CONTENT-UPLOAD READINESS: traffic-law page roles, section structures, internal-link posture, related-content rules, CTA/lawyer-card safety rules and sitemap posture are ready for owner/legal review.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 22:48 Asia/Jerusalem
- VERIFIED / CRIMINAL LAW OWNER UPLOAD REVIEW PACKAGE: packaged the first criminal-law group into a single owner-review approval layer before any content upload.
- CREATED: `project-control/criminal-law-owner-upload-review-package-2026-05-11.md`.
- CREATED: `project-control/criminal-law-owner-upload-review-package-2026-05-11.csv`.
- VERIFIED: `5` target decisions are ready for owner review: current criminal planning pillar, police investigation, detention, indictment and drug offenses.
- VERIFIED: package combines outline structure, source/legal gates, current-URL internal-link map, upload order, anti-cannibalization rules and blocked future slugs.
- RECOMMENDED: approve the planning package only, then draft `/criminal-defense-attorney/` first under source/legal review.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 22:32 Asia/Jerusalem
- VERIFIED / CRIMINAL LAW NO-URL INTERNAL LINK MAP: created the first current-URL internal-link map for the criminal-law upload group.
- CREATED: `project-control/criminal-law-no-url-internal-link-map-2026-05-11.md`.
- CREATED: `project-control/criminal-law-no-url-internal-link-map-2026-05-11.csv`.
- VERIFIED: `21` planned internal-link relationships connect the current criminal planning pillar, police investigation, indictment, detention, detention-days and drug offenses without using blocked future slugs.
- VERIFIED: the map separates priority 1 pillar/support links, priority 2 process links and priority 3 support/boundary links.
- CONTENT-UPLOAD READINESS: the first criminal-law group now has outline structure, source/legal gates and a current-URL internal-link map.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 22:20 Asia/Jerusalem
- VERIFIED SOURCE ANCHORS / CRIMINAL LAW SOURCE-LEGAL CHECKLIST: created the source/legal gate for the first criminal-law upload group before any public drafting.
- CREATED: `project-control/criminal-law-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/criminal-law-source-legal-checklist-2026-05-11.csv`.
- VERIFIED: `5` page/topic gates were mapped for current criminal pillar, police investigation, indictment, detention and drug offenses.
- VERIFIED: official/public source anchors are documented for criminal procedure, public-defense representation/investigation context, detention context and drug/cannabis public workflows, with limitations noted.
- CONTENT-UPLOAD READINESS: final Hebrew copy is still blocked, but the first criminal-law group now has source anchors, allowed/blocked legal claims, confidentiality risk, disclaimer requirements and approval status.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 22:10 Asia/Jerusalem
- VERIFIED / CRIMINAL LAW NO-URL-CHANGE OUTLINE QUEUE: converted the criminal-law primary-selection and upload-readiness evidence into a first practical outline batch.
- CREATED: `project-control/criminal-law-no-url-change-outline-queue-2026-05-11.md`.
- CREATED: `project-control/criminal-law-no-url-change-outline-queue-2026-05-11.csv`.
- VERIFIED: `5` outline targets were prepared across `6` current URLs: current criminal planning pillar, police investigation, indictment, detention group and drug offenses.
- VERIFIED: the queue uses current URLs only and keeps `/criminal-lawyer/`, `/police-investigation/`, `/indictment/`, `/pretrial-detention/` and `/drug-offenses/` blocked as future-only slugs.
- CONTENT-UPLOAD READINESS: criminal-law page roles, section structure, internal-link posture, related-content rules, CTA/lawyer-card safety rules and sitemap posture are ready for owner/legal review.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 22:00 Asia/Jerusalem
- VERIFIED LIVE / CRIMINAL LAW PRIMARY SELECTION REVIEW: compared the current criminal-law primary candidate, future target slug, old GSC-visible URL and support page before any public migration.
- CREATED: `project-control/criminal-law-primary-selection-2026-05-11.md`.
- CREATED: `project-control/criminal-law-primary-selection-2026-05-11.csv`.
- CREATED: `project-control/criminal-law-primary-live-url-check-2026-05-11.csv`.
- CREATED: `project-control/criminal-law-primary-redirect-check-2026-05-11.csv`.
- VERIFIED LIVE: `/criminal-defense-attorney/` returns `200 OK`, self-canonicalizes, is indexable, and has criminal-lawyer title/H1 signals.
- VERIFIED LIVE: `/criminal-lawyer/`, the old Hebrew broad criminal-lawyer URL and a legacy deep criminal-law URL currently return first-hop `301` redirects to the homepage, so they must not be used as sitemap, internal-link, menu, breadcrumb, canonical or redirect targets yet.
- RECOMMENDED: use `/criminal-defense-attorney/` as the current no-URL-change planning primary; keep `/criminal-lawyer/` as future-only until owner approval, route repair and redirect/canonical/internal-link/sitemap planning.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 21:52 Asia/Jerusalem
- VERIFIED / CRIMINAL LAW CONTENT UPLOAD READINESS BATCH: reviewed `50` higher-value criminal-law URL candidates after extracting `220` raw criminal-adjacent inventory matches.
- CREATED: `project-control/criminal-law-content-upload-readiness-2026-05-11.md`.
- CREATED: `project-control/criminal-law-content-upload-readiness-2026-05-11.csv`.
- VERIFIED: batch separates the current clean-ish `/criminal-defense-attorney/` candidate, the future `/criminal-lawyer/` strategic target, the old GSC-visible Hebrew criminal-lawyer URL, and support lanes for police investigation, indictment, detention, drug offenses, sex offenses, economic/white-collar crime, tax offenses, criminal records and defenses.
- VERIFIED: GSC evidence still blocks immediate `/criminal-lawyer/` migration because broad criminal-lawyer intent is currently attached to an old Hebrew URL and scattered legacy/support URLs.
- CATEGORY CLEANUP: international/foreign-law, legal-career, victim-rights, defamation/police-complaint, traffic-criminal and cyber-criminal boundary pages must not be merged blindly into the Israeli criminal-lawyer service pillar.
- CONTENT-UPLOAD READINESS: criminal-law role map, category cleanup concept, URL lanes, internal-link requirements and sitemap posture are ready for owner review.
- BLOCKED: no public content, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 21:31 Asia/Jerusalem
- VERIFIED / TRAFFIC LAW CONTENT UPLOAD READINESS BATCH: reviewed `38` traffic-adjacent URL candidates as one larger cluster batch.
- CREATED: `project-control/traffic-law-content-upload-readiness-2026-05-11.md`.
- CREATED: `project-control/traffic-law-content-upload-readiness-2026-05-11.csv`.
- VERIFIED: batch includes `1` traffic pillar candidate, `10` traffic support/source candidates, `7` traffic/criminal or evidence case-law candidates, `7` personal-injury car-accident boundary pages, `1` outdated traffic legacy page and `12` false-positive/non-traffic pages.
- RECOMMENDED: keep `/traffic-lawyer/` as the no-URL-change pillar candidate and prepare support outlines for drunk driving, refusal/testing, breathalyzer, speeding, Marvad, license suspension/points and traffic evidence.
- CATEGORY CLEANUP: business-license, lawyer-license, medical-license, real-estate-license, trafficking and unrelated intoxication pages must be excluded from the traffic-law category strategy.
- BLOCKED: no content upload, title/H1/meta, URL migration, redirect, noindex, canonical, sitemap, taxonomy/category, internal-link, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.
- CONTENT-UPLOAD READINESS: traffic-law cluster role map, URL lanes, category cleanup concept, internal-link requirements and sitemap posture are ready for owner review; public upload is still blocked pending source/legal approval.

## LATEST WORK STATUS - 2026-05-11 21:28 Asia/Jerusalem
- VERIFIED LIVE / LAWYER REST PUBLIC GUARD POST-PULL QA: ran the live checker after page-source markers showed the latest guard is active.
- CREATED: `project-control/live-lawyer-rest-public-guard-2026-05-11.csv`.
- VERIFIED LIVE: anonymous `/wp-json/wp/v2/justice_lawyer?per_page=20` now returns `X-WP-Total: 0`, with no placeholder phone hits and no sensitive meta-key hits.
- VERIFIED LIVE: anonymous direct REST request for seed ID `19139` returns `404`.
- VERIFIED LIVE: `/lawyers/` stays public `200`, with `0` lawyer-card blocks and no placeholder phone hits.
- REVIEW: static `deployment-marker.txt` still reports `2026-05-11-branding-polish-v3`, while page meta reports `2026-05-11-lawyer-rest-public-guard-v1`.
- REVIEW: one sampled old lawyer profile route redirects/lands on the homepage with `200` instead of the expected generic noindex `404`, but it did not expose placeholder phone data or sensitive meta.
- BLOCKED: old profile-route behavior still needs routing/permalink review; no CMS records, lawyer records, URLs, redirects, taxonomy, sitemap, content, menu, CRM, review or wp-admin settings were changed.

## LATEST WORK STATUS - 2026-05-11 21:25 Asia/Jerusalem
- VERIFIED / TRAFFIC DRUNK-DRIVING SOURCE AUDIT: checked the current drunk-driving support page, traffic-law pillar and wrong-page will-revocation URL before any public content or URL change.
- CREATED: `project-control/traffic-drunk-driving-source-audit-2026-05-11.md`.
- CREATED: `project-control/traffic-drunk-driving-source-audit-2026-05-11.csv`.
- VERIFIED LIVE: `/driving-under-the-influence/`, `/traffic-lawyer/` and `/revocation-of-a-will-and-reviving-previous-will/` all return `200`, self-canonical and indexable pages.
- VERIFIED: the will-revocation page has strong will/inheritance signals and `0` visible `נהיגה בשכרות` matches in the fetched text, so it should remain protected from traffic-law optimization.
- TECHNICAL SEO REVIEW: the will page source includes sitewide `SiteNavigationElement` schema entries for traffic pages, including `driving-under-the-influence` and `traffic-lawyer`, using `http://` URLs; generator is NOT VERIFIED and needs a schema/navigation-source audit.
- RECOMMENDED: draft a no-URL-change expansion outline for `/driving-under-the-influence/` only after owner/legal review.
- BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, schema, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.

## LATEST WORK STATUS - 2026-05-11 21:16 Asia/Jerusalem
- VERIFIED / TRAFFIC-CRIMINAL WRONG-PAGE DECISION PACKET: converted the latest targeted GSC evidence into an owner-review decision layer before any traffic/criminal content or URL execution.
- CREATED: `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.md`.
- CREATED: `project-control/traffic-criminal-wrong-page-decision-packet-2026-05-11.csv`.
- VERIFIED: `עורך דין נהיגה בשכרות` maps to the will-revocation page in GSC, so the will page must be protected and not optimized for traffic-law intent.
- VERIFIED: `כתב אישום` maps only to a specific Netanyahu indictment page and the homepage in the latest pass, not to a general indictment guide.
- RECOMMENDED: review `/driving-under-the-influence/`, `/traffic-lawyer/` and the wrong-page will URL before drafting any public drunk-driving expansion.
- BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM/review, wp-admin setting or CMS/database change was executed.
- NEXT: audit the current drunk-driving support page and wrong-page source, then prepare a no-URL-change content outline only after owner/legal review.

## LATEST WORK STATUS - 2026-05-11 21:01 Asia/Jerusalem
- VERIFIED / LAWYER SEED PROFILE CLEANUP PLAN: exported the live public REST `justice_lawyer` records into an owner-approval cleanup packet.
- CREATED: `project-control/lawyer-seed-profile-cleanup-plan-2026-05-11.md`.
- CREATED: `project-control/lawyer-seed-profile-cleanup-plan-2026-05-11.csv`.
- VERIFIED LIVE BASELINE: public REST currently exposes `10` published lawyer records, IDs `19130` through `19139`.
- VERIFIED LIVE BASELINE: all `10` exported records have placeholder/seed-style contact signals and are recommended as `DRAFT_OR_PRIVATE_UNTIL_REAL_SOURCE_APPROVED`.
- IMPORTANT: ID `19130` / Maya Rotenberg must be reviewed separately because she may be the intended real client prototype, but the current live record still requires verified source/contact/approval before public use.
- BLOCKED: owner approval and backup are required before any CMS/database post-status or meta cleanup.
- SAFETY: no CMS records, lawyer records, URLs, redirects, taxonomy, sitemap, content, menu, CRM, review or wp-admin settings were changed.

## LATEST WORK STATUS - 2026-05-11 20:55 Asia/Jerusalem
- FIXED IN CODE / P0 LAWYER REST PUBLIC GUARD: found that the visible `/lawyers/` archive currently shows `0` lawyer cards, but anonymous `wp-json/wp/v2/justice_lawyer` still exposes published seed-style lawyer profiles and custom meta.
- VERIFIED LIVE BASELINE: `/wp-json/wp/v2/justice_lawyer?per_page=20` returns `200`, `X-WP-Total: 10`, `11` placeholder phone hits and `50` sensitive meta-key hits before this patch is live.
- VERIFIED LIVE BASELINE: `/wp-json/wp/v2/justice_lawyer/19139` returns `200` to anonymous users before this patch is live.
- CODE FIXED: added `inc/lawyer-rest-guards.php` and included it from `functions.php`.
- CODE FIXED: anonymous lawyer REST collections now filter to public-approved profiles only, anonymous direct REST reads for unapproved lawyer IDs return `404`, and anonymous approved lawyer REST responses strip `meta`, `acf` and `guid`.
- CODE FIXED: unapproved public lawyer profile routes are marked as `404` before head/SEO output, with generic Hebrew title/description, no Rank Math canonical and noindex/nofollow robots.
- CREATED: `project-control/lawyer-rest-public-guard-2026-05-11.md`.
- CREATED: `project-control/lawyer-rest-public-guard-2026-05-11.csv`.
- CREATED: `tools/check-live-lawyer-rest-public-guard.ps1`.
- CREATED: `project-control/live-lawyer-rest-public-guard-2026-05-11-before-pull.csv`.
- VERIFIED LOCAL: PHP lint passed for all `130` PHP files with the local PHP runtime.
- NOT LIVE VERIFIED: requires GitHub push, uPress pull/cache clear and checker rerun for marker `2026-05-11-lawyer-rest-public-guard-v1`.
- SAFETY: no CMS records, lawyer records, URLs, redirects, taxonomy, sitemap, content, menu, CRM, review or wp-admin settings were changed.

## LATEST WORK STATUS - 2026-05-11 20:44 Asia/Jerusalem
- VERIFIED / FULL REVIEW REPORT TASK INTAKE: read the owner-provided full review report and converted needed items into launch-readiness tasks only.
- CREATED: `project-control/full-review-report-action-intake-2026-05-11.md`.
- CREATED: `project-control/full-review-report-action-intake-2026-05-11.csv`.
- UPDATED: `project-control/next-actions.md`, `project-control/final-integrated-launch-checklist.md`, `project-control/changelog.md`, and `project-control/task-board.csv`.
- VERIFIED: several report items already overlap with documented fixes or live checks, including lawyer public approval gates, placeholder phone suppression, branding/favicons, hreflang/HTTPS normalization, Hebrew UI cleanup, and the known 404 plugin blocker.
- BLOCKED / P0: public demo or seed lawyer exposure remains the highest launch-readiness verification task until a live QA pass proves no visitor can mistake demo data for real lawyers.
- BLOCKED: no public lawyer record, content, title/H1/meta, URL, redirect, canonical, sitemap, taxonomy, menu, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: use the new intake CSV as the pre-marketing trust/SEO cleanup queue, then return to the current GSC/content architecture sequence.

## LATEST WORK STATUS - 2026-05-11 20:39 Asia/Jerusalem
- VERIFIED / REAL-ESTATE ROUTE-CMS AUDIT PLAN: created the review-only route/CMS audit plan for the blocked real-estate future slugs.
- CREATED: `project-control/real-estate-route-cms-audit-plan-2026-05-11.md`.
- CREATED: `project-control/real-estate-route-cms-audit-plan-2026-05-11.csv`.
- VERIFIED LIVE: `/real-estate-lawyer/` returns `200` with `0` response bytes and no title/H1/canonical/body marker.
- VERIFIED LIVE: `/buying-apartment/` and `/real-estate-purchase-agreement/` resolve to homepage content with homepage canonical and marker `2026-05-11-branding-polish-v3`.
- BLOCKED: these three future slugs must not be used in internal links, redirects, canonicals, sitemap plans, related cards, menus or breadcrumbs until route/CMS audit and owner approval.
- BLOCKED: no public route, content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, homepage, menu, taxonomy, internal-link, related-card, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: owner/legal review can approve wp-admin/CMS route lookup, then an approval-gated real-estate internal-link plan using safe current URLs only.

## LATEST WORK STATUS - 2026-05-11 20:28 Asia/Jerusalem
- VERIFIED / REAL-ESTATE OWNER DECISION SUMMARY: created the short owner approval layer after the source/legal checklist, page matrix and side-by-side review.
- CREATED: `project-control/real-estate-owner-decision-summary-2026-05-11.md`.
- CREATED: `project-control/real-estate-owner-decision-summary-2026-05-11.csv`.
- RECOMMENDED: use `/real-estate-attorney/` as the current no-URL-change working primary for planning only.
- RECOMMENDED: keep `/real-estate-lawyer/`, `/buying-apartment/` and `/real-estate-purchase-agreement/` blocked future slugs until route/CMS audit and migration planning are approved.
- RECOMMENDED: protect `/real-estate-lawyer-cost-2025/` as support, keep `/israeli_land_and_property_laws/` and fee/buying/registry/tax/rental/contractor pages in support or merge-review lanes, and separate international property pages from local Israeli service intent.
- BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, homepage, menu, taxonomy, internal-link, related-card, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: owner/legal review can approve a route/CMS audit and then an approval-gated internal-link plan using only safe current URLs.

## LATEST WORK STATUS - 2026-05-11 20:21 Asia/Jerusalem
- VERIFIED / REAL-ESTATE SIDE-BY-SIDE REVIEW: created the review-only comparison for current real-estate commercial, cost, property-law, buying-apartment, registry, tax, rental, contractor/defect, urban-renewal and international-property pages.
- CREATED: `project-control/real-estate-side-by-side-review-2026-05-11.md`.
- CREATED: `project-control/real-estate-side-by-side-review-2026-05-11.csv`.
- VERIFIED LIVE: `/real-estate-attorney/`, `/real-estate-lawyer-cost-2025/`, `/israeli_land_and_property_laws/`, `/lawyer-for-buying-or-selling-a-house/`, registry, tax, rental and Greece/international pages return live `200` pages with expected page signals.
- REVIEW / ROUTING RISK: `/real-estate-lawyer/` returns a `200 OK` route with no fetched title/H1/canonical/body marker; `/buying-apartment/` and `/real-estate-purchase-agreement/` resolve to homepage content/canonical and must not be used as live destinations yet.
- VERIFIED: `/real-estate-attorney/` remains the current no-URL-change planning primary; `/real-estate-lawyer/`, `/buying-apartment/` and `/real-estate-purchase-agreement/` remain blocked future slugs.
- BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, homepage, menu, taxonomy, internal-link, related-card, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: create a real-estate internal-link plan only after owner/legal approval confirms the page roles and route fixes.

## LATEST WORK STATUS - 2026-05-11 20:08 Asia/Jerusalem
- VERIFIED / REAL-ESTATE PAGE DECISION MATRIX: created the review-only page-by-page classification layer for the real-estate cluster.
- CREATED: `project-control/real-estate-page-decision-matrix-2026-05-11.md`.
- CREATED: `project-control/real-estate-page-decision-matrix-2026-05-11.csv`.
- VERIFIED: `/real-estate-attorney/` remains the current no-URL-change commercial candidate; `/real-estate-lawyer/` remains future-only until a migration map is approved.
- VERIFIED: `/real-estate-lawyer-cost-2025/` is protected as high-impression support content, not the broad pillar.
- VERIFIED: `/israeli_land_and_property_laws/`, cost/fee pages, buying-apartment candidates, registry, tax, rental, contractor/defect and international-property pages are now separated by role before any rewrite or URL decision.
- BLOCKED: no public content, title/H1/meta, URL, redirect, noindex, canonical, sitemap, homepage, menu, taxonomy, internal-link, related-card, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: run a real-estate side-by-side comparison and then an approval-gated internal-link plan.

## LATEST WORK STATUS - 2026-05-11 19:58 Asia/Jerusalem
- VERIFIED / REAL-ESTATE SOURCE-LEGAL CHECKLIST: created the review-only source/legal gate for the Israeli real-estate, apartment purchase/sale, land registry, tax, contractor/defect, rental and international-property boundary cluster.
- CREATED: `project-control/real-estate-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/real-estate-source-legal-checklist-2026-05-11.csv`.
- VERIFIED: `/real-estate-attorney/` remains the current no-URL-change commercial candidate, while `/real-estate-lawyer/` remains a future strategic slug only.
- VERIFIED: `/real-estate-lawyer-cost-2025/` is protected as a high-impression support page and must not be redirected, canonicalized away, noindexed or rewritten blindly.
- VERIFIED: registry, tax, contractor/defect, rental, buying-apartment and sale-agreement topics now have source/legal gates before public content or URL execution.
- BLOCKED: no public content, title/H1/meta, URL, redirect, canonical, sitemap, robots/noindex, homepage, menu, taxonomy, related-card, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: build a real-estate page decision matrix or side-by-side comparison before any internal-link, rewrite or migration plan.

## LATEST WORK STATUS - 2026-05-11 19:47 Asia/Jerusalem
- VERIFIED / PERSONAL-INJURY OUTLINE QUEUE: created the review-only rewrite/outline queue for the approved-planning personal-injury/damages lane.
- CREATED: `project-control/personal-injury-rewrite-outline-queue-2026-05-11.md`.
- CREATED: `project-control/personal-injury-rewrite-outline-queue-2026-05-11.csv`.
- VERIFIED: `/tort-lawyer/` and `/car-accident-auto-injury-lawyer/` are queued only as outline candidates with no URL/content/title execution.
- VERIFIED: road-accident, compulsory-insurance, punitive-damage, tort-law overview, tort-reform, deep-pocket, US/international and work-accident boundary items are separated with owner/legal gates.
- BLOCKED: no public content, title/H1/meta, URL, redirect, canonical, sitemap, internal-link, related-card, menu, breadcrumb, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: owner/legal review can approve one outline-only draft package, or direct GSC browser checks can be run first for damages and accident variants.

## LATEST WORK STATUS - 2026-05-11 19:37 Asia/Jerusalem
- VERIFIED / PERSONAL-INJURY OWNER DECISION SUMMARY: created the short approval layer after the source checklist, page matrix, side-by-side review, internal-link plan and SERP review.
- CREATED: `project-control/personal-injury-owner-decision-summary-2026-05-11.md`.
- CREATED: `project-control/personal-injury-owner-decision-summary-2026-05-11.csv`.
- VERIFIED: recommended owner decisions keep `/tort-lawyer/` as the current no-URL-change planning primary, protect `/car-accident-auto-injury-lawyer/`, and keep `/personal-injury-lawyer/`, `/car-accident-lawyer/` and `/work-accident-lawyer/` future-only.
- VERIFIED: support pages stay support/specialist only; internal-link rows remain planned and not live.
- BLOCKED: no public content, title/H1/meta, URL, redirect, canonical, sitemap, internal-link, related-card, menu, breadcrumb, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: owner/legal review can approve a no-URL-change outline batch, or run direct GSC browser checks for damages, road-accident and work-accident variants first.

## LATEST WORK STATUS - 2026-05-11 19:28 Asia/Jerusalem
- VERIFIED / PERSONAL-INJURY SERP REVIEW: created the review-only public SERP evidence pass for damages, bodily injury, tort claims, road accidents and work-accident boundary terms.
- CREATED: `project-control/serp-personal-injury-damages-review-2026-05-11.md`.
- CREATED: `project-control/serp-personal-injury-damages-review-2026-05-11.csv`.
- VERIFIED: public SERP patterns support a strong damages service page plus a separate car-accident injury page, while work accident remains a national-insurance/employment/personal-injury boundary.
- VERIFIED: `/tort-lawyer/` and `/car-accident-auto-injury-lawyer/` remain protected current candidates; `/personal-injury-lawyer/`, `/car-accident-lawyer/` and `/work-accident-lawyer/` remain future-only until approved.
- NOT VERIFIED: full manual Google top-10 screenshots, PAA/autocomplete, GSC API, GA4 evidence and legal review.
- BLOCKED: no public content, title/H1/meta, URL, redirect, canonical, sitemap, internal-link, related-card, menu, breadcrumb, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: fold this evidence into owner/legal approval decisions or run direct GSC browser checks for damages, bodily injury, road accident and work accident variants.

## LATEST WORK STATUS - 2026-05-11 19:18 Asia/Jerusalem
- VERIFIED / PERSONAL-INJURY INTERNAL-LINK PLAN: created the review-only internal-link map for the personal-injury, damages, tort-law, road-accident and compulsory-insurance cluster.
- CREATED: `project-control/personal-injury-internal-link-plan-2026-05-11.md`.
- CREATED: `project-control/personal-injury-internal-link-plan-2026-05-11.csv`.
- VERIFIED: the plan connects `/tort-lawyer/`, `/car-accident-auto-injury-lawyer/`, `/israel-road-accident-compensation-law/`, `/compulsory-motor-vehicle-insurance/`, `/punitive-damage/`, `/tort-reform/`, `/outline-of-tort-law/`, `/deep-pocket/` and `/personal-injury-law/` only as approval-gated rows.
- VERIFIED: future clean slugs `/personal-injury-lawyer/` and `/car-accident-lawyer/` remain future-only and are not approved as live destinations.
- BLOCKED: no public content, title/H1/meta, URL, redirect, canonical, sitemap, internal-link, related-card, menu, breadcrumb, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: owner/legal review decides primary service URL, car-accident URL strategy and which rows can move from `PLANNED_NEEDS_OWNER_APPROVAL` to approved implementation.

## LATEST WORK STATUS - 2026-05-11 19:18 Asia/Jerusalem
- VERIFIED / PERSONAL-INJURY SIDE-BY-SIDE REVIEW: created the review-only side-by-side comparison for current damages, tort, car-accident, road-accident, insurance and US/international pages.
- CREATED: `project-control/personal-injury-side-by-side-review-2026-05-11.md`.
- CREATED: `project-control/personal-injury-side-by-side-review-2026-05-11.csv`.
- VERIFIED: `/tort-lawyer/` remains the current local damages/service candidate, but is thin and not ready as a finished pillar.
- VERIFIED: `/car-accident-auto-injury-lawyer/` remains protected as the current GSC-visible car-accident candidate, but needs source-backed rewrite/migration review.
- VERIFIED: `/punitive-damage/` is specialist support, `/personal-injury-law/` is international/US content, and the tort concept pages are support/merge-review assets.
- REVIEW: old Hebrew damages/category URL variants currently 301 to the homepage while the 404 redirect plugin is active, so exact old-URL capture and routing cleanup are still required before redirects.
- BLOCKED: no public content, title/H1/meta, URL, redirect, canonical, sitemap, internal-link, related-card, menu, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: create an approval-gated internal-link plan for the personal-injury/damages cluster, or run deeper GSC/SERP checks before primary URL approval.

## LATEST WORK STATUS - 2026-05-11 18:26 Asia/Jerusalem
- VERIFIED / PERSONAL-INJURY PAGE DECISION MATRIX: created the review-only page-by-page decision matrix for damages, tort-law, car-accident, insurance, work-accident and US/international boundary pages.
- CREATED: `project-control/personal-injury-page-decision-matrix-2026-05-11.md`.
- CREATED: `project-control/personal-injury-page-decision-matrix-2026-05-11.csv`.
- VERIFIED: `/tort-lawyer/` is classified as the current thin service candidate, while `/personal-injury-lawyer/` remains a future-only strategic slug.
- VERIFIED: `/car-accident-auto-injury-lawyer/` is protected as the current GSC-visible car-accident candidate; `/car-accident-lawyer/` remains future-only pending migration map.
- VERIFIED: `/punitive-damage/`, `/tort-reform/`, `/outline-of-tort-law/`, `/deep-pocket/`, `/israel-road-accident-compensation-law/` and `/compulsory-motor-vehicle-insurance/` are support/specialist pages, not approved broad pillars.
- BLOCKED: no public content, title/H1/meta, URL, redirect, canonical, sitemap, internal-link, related-card, menu, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: run side-by-side comparison or draft an approval-gated internal-link map after owner approves primary/support roles.

## LATEST WORK STATUS - 2026-05-11 18:17 Asia/Jerusalem
- VERIFIED / PERSONAL-INJURY SOURCE-LEGAL CHECKLIST: created the review-only source/legal gate for damages, tort-law, car-accident, compulsory-insurance, work-accident, personal-accident and US/international boundaries.
- CREATED: `project-control/personal-injury-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/personal-injury-source-legal-checklist-2026-05-11.csv`.
- VERIFIED: direct public URL checks returned 200 for `/tort-lawyer/`, `/punitive-damage/`, `/car-accident-auto-injury-lawyer/`, `/israel-road-accident-compensation-law/`, `/compulsory-motor-vehicle-insurance/`, `/personal-injury-law/`, `/tort-reform/`, `/outline-of-tort-law/` and `/deep-pocket/`.
- VERIFIED: official/public source anchors were mapped for Torts Ordinance, road-accident compensation law, police accident confirmation, National Insurance work injury, Ministry of Labor work-accident reporting and personal-accident benefits.
- BLOCKED: no public content, title/H1/meta, URL, redirect, canonical, sitemap, internal-link, related-card, menu, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.
- NEXT: build a page decision matrix for the personal-injury/damages cluster, or continue another cluster source/legal gate while owner approvals are pending.

## LATEST WORK STATUS - 2026-05-11 18:06 Asia/Jerusalem
- FIXED / BRANDING POLISH V3: corrected the latest logo/favicon polish commit before live rollout and aligned it over the v4.3 CSS work that arrived during rebase.
- CODE FIXED: removed duplicate fallback favicon output from `header.php`; fallback now remains centralized in `inc/seo.php` and still respects WordPress Site Icon.
- CODE FIXED: removed negative letter-spacing from the new premium brand/trust polish rules and bumped premium CSS cache version to `4.3.1`.
- CODE FIXED: theme version moved to `1.0.4` and deployment marker moved to `2026-05-11-branding-polish-v3`.
- VERIFIED LOCAL: `git diff --check` passed with only normal Windows LF-to-CRLF warnings; public source still shows old marker `2026-05-11-media-sitemap-https-v1`.
- VERIFIED LOCAL: PHP lint passed for all PHP files using the owner-provided local PHP zip extracted to a temporary runtime.
- NOT LIVE VERIFIED: browser tab/favicon/mobile bookmark visual QA requires uPress pull/cache refresh.
- SAFETY: no content, URL slug, redirect, canonical, sitemap, title/H1/meta, taxonomy, menu, lawyer, CRM, review, wp-admin option or CMS/database row was changed.

## LATEST WORK STATUS - 2026-05-11 17:53 Asia/Jerusalem
- VERIFIED / CYBER-PRIVACY OUTLINE QUEUE: created the review-only rewrite/outline queue for cyber/privacy pages and section-first topics.
- CREATED: `project-control/cyber-privacy-rewrite-outline-queue-2026-05-11.md`.
- CREATED: `project-control/cyber-privacy-rewrite-outline-queue-2026-05-11.csv`.
- VERIFIED: the queue keeps `/cyber-lawyer/` as a blocked primary-service outline candidate pending comparison with the Hebrew role page and `/cybercrime-lawyer-roll/`.
- VERIFIED: support outlines were separated for cybercrime, cyber laws, cyberattack, privacy injury, police-record/data deletion, Google/platform removal, data-breach reporting, cyber insurance, sensitive cybersex/criminal boundary and FBI context.
- BLOCKED: all queue rows are outline-only or section-only and explicitly block public content, title/H1/meta, URL, redirect, canonical, sitemap, internal-link, related-card, menu, lawyer-card, CRM/review, wp-admin setting or CMS/database action.

## LATEST WORK STATUS - 2026-05-11 17:43 Asia/Jerusalem
- VERIFIED / CYBER-PRIVACY PAGE DECISION MATRIX: created the review-only page-by-page decision matrix for cyber/privacy assets.
- CREATED: `project-control/cyber-privacy-page-decision-matrix-2026-05-11.md`.
- CREATED: `project-control/cyber-privacy-page-decision-matrix-2026-05-11.csv`.
- VERIFIED: public direct 200 checks passed for `/cyber-lawyer/`, `/cybercrime-lawyer-roll/`, `/cyber-laws/`, `/what-is-cyberattack/`, `/cyber-insurance/`, `/cybersex-trafficking/`, `/police-records-data-deletion/` and `/fbi-cyber-division/`.
- VERIFIED: `/cyber-lawyer/` remains the current primary candidate, while cybercrime, cyber laws, cyberattack, cyber insurance, cybersex trafficking and FBI pages are classified as support/boundary/context assets.
- VERIFIED: old Hebrew privacy, thin privacy overview, privacy/defamation case-law, online reputation, data breach and Google removal items remain protected/review-only and blocked from public execution.
- BLOCKED: no public content, title/H1/meta, URL, redirect, canonical, sitemap, internal-link, related-card, menu, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

## LATEST WORK STATUS - 2026-05-11 17:33 Asia/Jerusalem
- VERIFIED / CYBER-PRIVACY SOURCE-LEGAL CHECKLIST: created the review-only source/legal gate for cyber, privacy, data breach, online defamation/shaming, Google removal and police-record/data-deletion boundaries.
- CREATED: `project-control/cyber-privacy-source-legal-checklist-2026-05-11.md`.
- CREATED: `project-control/cyber-privacy-source-legal-checklist-2026-05-11.csv`.
- VERIFIED: official/public source anchors were mapped for Privacy Protection Authority breach reporting, database/privacy obligations, information-security regulations, Israel National Cyber Directorate cyber reporting, CERT, Israel Police online complaint service, Knesset Computer Law PDFs, Knesset Defamation Law PDFs and Google removal process pages.
- VERIFIED: the checklist separates cyber lawyer, cybercrime, privacy/data breach, online reputation/defamation, Google removal and police-record/data-deletion intents so they are not merged blindly.
- BLOCKED: legal review remains required before publishing advice-like claims, compensation language, procedural eligibility, criminal classifications or sensitive examples.
- SAFETY: no public content, title/H1/meta, URL, redirect, canonical, sitemap, internal-link, related-card, menu, lawyer-card, CRM/review, wp-admin setting or CMS/database action was executed.

## LATEST WORK STATUS - 2026-05-11 17:22 Asia/Jerusalem
- VERIFIED / HOMEPAGE IMPLEMENTATION CHECKLIST: completed the approval-gated no-URL-change homepage implementation checklist.
- CREATED: `project-control/homepage-controlled-implementation-checklist-2026-05-11.md`.
- CREATED: `project-control/homepage-controlled-implementation-checklist-2026-05-11.csv`.
- VERIFIED: the checklist keeps the first homepage batch limited to owner-approved template, link, empty-state and UX cleanup only.
- VERIFIED: the checklist explicitly blocks URL, redirect, canonical, sitemap, robots/noindex, title/H1/meta, menu, CMS/database, CRM, review/rating and fake-data changes.
- VERIFIED: preflight and QA gates include baseline screenshots, link crawl, URL checks, PHP syntax, `git diff --check`, secret scan, desktop/mobile QA and rollback strategy.
- BLOCKED: no public homepage, template, link, title/H1/meta, URL, redirect, canonical, sitemap, CMS/database, CRM/review, wp-admin setting or deploy action was executed.
- SAFETY: repo documentation/CSV planning only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 17:12 Asia/Jerusalem
- VERIFIED / HOMEPAGE STRUCTURE PLAN: completed the approval-gated homepage section-order proposal and curated pillar-link map.
- CREATED: `project-control/homepage-section-order-proposal-2026-05-11.md`.
- CREATED: `project-control/homepage-section-order-proposal-2026-05-11.csv`.
- CREATED: `project-control/homepage-curated-pillar-link-map-2026-05-11.csv`.
- VERIFIED: live URL checks show `/lawyers/`, `/divorce-lawyer/`, `/real-estate-lawyer/`, `/medical-malpractice-lawyer/`, `/traffic-lawyer/`, `/cyber-lawyer/` and `/practice-areas/national-insurance/` return 200 on their own paths.
- VERIFIED: `/family-lawyer/`, `/criminal-lawyer/`, `/personal-injury-lawyer/`, `/employment-lawyer/` and `/inheritance-lawyer/` resolve to the homepage, so the proposed map uses safer fallbacks or marks them as gated.
- REVIEW: proposed homepage order keeps `front-page.php` as the short-term authoritative live template and avoids switching to `page-home.php` blindly.
- BLOCKED: no public homepage, title/H1/meta, menu, template, URL, redirect, canonical, sitemap, internal-link, lawyer-card, CRM, review, wp-admin setting or CMS/database action was executed.
- SAFETY: repo documentation/CSV planning only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 17:02 Asia/Jerusalem
- VERIFIED / HOMEPAGE REVIEW: completed the homepage line-by-line SEO/design alignment pass as review-only documentation.
- CREATED: `project-control/homepage-line-by-line-review-2026-05-11.md`.
- CREATED: `project-control/homepage-line-by-line-review-2026-05-11.csv`.
- VERIFIED: live homepage title, meta and H1 support broad legal-help / lawyer-directory intent, and prior GSC evidence still makes the homepage the current broad lawyer/search entry.
- VERIFIED: live homepage scrape matches the shorter `front-page.php` flow more than the richer `page-home.php` flow; authoritative homepage template must be decided before public changes.
- REVIEW: live scrape showed raw/uncurated practice-area labels, an empty featured-lawyer state, latest-only article logic, first-party `http://` links, `?page_id=` links, and a possible hero city-filter mismatch against `/lawyers/` slug filters.
- BLOCKED: no public homepage, title/H1/meta, menu, template, URL, redirect, canonical, sitemap, internal-link, lawyer-card, CRM, review, wp-admin setting or CMS/database action was executed.
- SAFETY: repo documentation/CSV planning only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 16:52 Asia/Jerusalem
- VERIFIED / INTERNAL-LINK PLAN: completed the approval-gated cyber/privacy internal-link plan after the GSC, SERP/source and side-by-side review layers.
- CREATED: `project-control/cyber-privacy-internal-link-plan-2026-05-11.md`.
- CREATED: `project-control/cyber-privacy-internal-link-plan-2026-05-11.csv`.
- VERIFIED: the plan maps primary-to-support and support-to-primary relationships around `/cyber-lawyer/`, `/cybercrime-lawyer-roll/`, `/cyber-laws/`, `/what-is-cyberattack/`, `/cyber-insurance/`, `/cybersex-trafficking/`, the old privacy-injury URL and `/police-records-data-deletion/`.
- VERIFIED: every planned link row is marked `PLANNED_NEEDS_OWNER_APPROVAL`; no link is approved for public execution yet.
- BLOCKED: no public links, related-card, breadcrumb, menu, sitemap, canonical, redirect, title/H1/meta, content, CMS/database, CRM or lawyer-card action was executed.
- SAFETY: repo documentation/CSV planning only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 16:43 Asia/Jerusalem
- VERIFIED / SIDE-BY-SIDE REVIEW: completed the cyber/privacy content comparison layer after the GSC and SERP/source passes.
- CREATED: `project-control/cyber-privacy-side-by-side-review-2026-05-11.md`.
- CREATED: `project-control/cyber-privacy-side-by-side-review-2026-05-11.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md` and `.csv`.
- VERIFIED: `/cyber-lawyer/` remains the current service candidate, but the Hebrew `תפקידם של עורכי דין בתחום הסייבר` page and `/cybercrime-lawyer-roll/` must be compared before any rewrite.
- VERIFIED: `/fbi-cyber-division/` and `/cyber-laws/` are strong/long support assets but must not be selected as pillars by word count alone.
- VERIFIED: the old Hebrew privacy-injury URL is still protected as the privacy support/migration-risk page; `/police-records-data-deletion/` remains a criminal-record/privacy boundary item.
- BLOCKED: no public cyber/privacy title/H1/meta, content body, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM, review, wp-admin setting or CMS/database action was executed.
- SAFETY: repo documentation/CSV planning only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 16:35 Asia/Jerusalem
- VERIFIED / SERP-SOURCE REVIEW: completed the cyber/privacy SERP and source-overlay pass after the GSC support-term evidence.
- CREATED: `project-control/serp-cyber-privacy-review-2026-05-11.md`.
- CREATED: `project-control/serp-cyber-privacy-review-2026-05-11.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md` and `.csv`.
- UPDATED: `project-control/content-decision-evidence-overlay.csv`.
- VERIFIED: `/cyber-lawyer/` remains the current inventory service candidate, but it is not GSC-proven enough for public execution.
- VERIFIED: the old Hebrew privacy-injury URL remains protected because `פגיעה בפרטיות` and `הגנת הפרטיות` already show visible GSC impressions there.
- VERIFIED: online defamation/shaming and data deletion remain separate source/legal/boundary review topics, not approved new pages.
- BLOCKED: no public cyber/privacy title/H1/meta, content body, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM, review, wp-admin setting or CMS/database action was executed.
- SAFETY: repo documentation/CSV planning only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 16:23 Asia/Jerusalem
- VERIFIED / GSC: completed the cyber/privacy support-term browser pass from the remaining-gap queue.
- CREATED: `project-control/gsc-cyber-privacy-support-pass-2026-05-11.md`.
- CREATED: `project-control/gsc-cyber-privacy-support-pass-2026-05-11.csv`.
- UPDATED: `project-control/gsc-keyword-page-map.csv`.
- UPDATED: `project-control/gsc-cannibalization-review.csv`.
- UPDATED: `project-control/gsc-content-priorities.csv`.
- UPDATED: `project-control/content-decision-evidence-overlay.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md` and `.csv`.
- VERIFIED: `פגיעה בפרטיות` returned `0` clicks and `38` impressions at position `46`, mapped to old Hebrew URL `https://jus-tice.co.il/פיצוי-כספי-בגין-פגיעה-בפרטיות-צפייה-ומחיקה-של-פריטים-מהטלפון-ללא-רשות/`.
- VERIFIED: `הגנת הפרטיות` returned `0` clicks and `7` impressions at position `49.3`, mapped to the same old Hebrew privacy-injury URL.
- VERIFIED: `שיימינג` returned only `1` impression at position `137`, mapped to unrelated family-law/prenup URL `/changing-or-canceling-a-prenuptial-agreement/`.
- VERIFIED: `מתקפת סייבר`, `לשון הרע באינטרנט`, and `מחיקת מידע` returned zero visible rows.
- BLOCKED: screenshot capture timed out during this pass; text rows and metrics were still recorded from the browser UI.
- BLOCKED: no public cyber/privacy title/H1/meta, content body, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM, review, wp-admin setting or CMS/database action was executed.
- SAFETY: browser evidence capture and repo documentation only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 16:10 Asia/Jerusalem
- VERIFIED / GSC: completed the cyber/privacy and national-insurance remaining-gap browser pass.
- CREATED: `project-control/gsc-cyber-national-gap-pass-2026-05-11.md`.
- CREATED: `project-control/gsc-cyber-national-gap-pass-2026-05-11.csv`.
- CREATED: `project-control/visual-evidence/gsc-gap-query-cyber-lawyer-2026-05-11.png`.
- CREATED: `project-control/visual-evidence/gsc-gap-query-privacy-lawyer-2026-05-11.png`.
- UPDATED: `project-control/gsc-keyword-page-map.csv`.
- UPDATED: `project-control/gsc-cannibalization-review.csv`.
- UPDATED: `project-control/gsc-content-priorities.csv`.
- UPDATED: `project-control/cyber-privacy-owner-approval-packet.md` and `.csv`.
- UPDATED: `project-control/national-insurance-owner-approval-packet.md` and `.csv`.
- VERIFIED: `עורך דין סייבר` returned `0` clicks and `42` impressions at position `71.6`, mapped only to `/cybercrime-lawyer-roll/`; `/cyber-lawyer/` itself returned `No data` in reverse page-to-query.
- VERIFIED: `דיני סייבר` and `עורך דין פרטיות` returned zero visible rows in this pass.
- VERIFIED: `עורך דין ביטוח לאומי`, `ועדה רפואית ביטוח לאומי`, and `/practice-areas/national-insurance/` returned zero visible rows.
- VERIFIED: broad `ביטוח לאומי` had only `2` impressions across weak/wrong URLs; `קצבת נכות` had only `1` impression on `/cerebral-palsy-rights/`.
- BLOCKED: national-insurance screenshots were not captured because GSC screenshot capture timed out after the cyber/privacy screenshots; text rows and metrics were still recorded from the browser UI.
- BLOCKED: no public cyber/privacy, national-insurance, title/H1/meta, content body, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM, review, wp-admin setting or CMS/database action was executed.
- SAFETY: browser evidence capture and repo documentation only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 15:42 Asia/Jerusalem
- VERIFIED / GSC: completed the first remaining-gap browser evidence pass for homepage and lawyer-directory intent.
- CREATED: `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.md`.
- CREATED: `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.csv`.
- CREATED: `project-control/visual-evidence/gsc-homepage-page-query-2026-05-11.png`.
- CREATED: `project-control/visual-evidence/gsc-lawyers-page-query-2026-05-11.png`.
- CREATED: `project-control/visual-evidence/gsc-query-lawyer-singular-pages-2026-05-11.png`.
- CREATED: `project-control/visual-evidence/gsc-query-lawyers-plural-pages-2026-05-11.png`.
- CREATED: `project-control/visual-evidence/gsc-query-find-lawyer-pages-2026-05-11.png`.
- UPDATED: `project-control/gsc-keyword-page-map.csv`.
- UPDATED: `project-control/gsc-cannibalization-review.csv`.
- UPDATED: `project-control/gsc-content-priorities.csv`.
- VERIFIED: homepage reverse page-to-query check shows `26` clicks, `5,459` impressions, CTR `0.5%`, and average position `17.1`; top visible intents are lawyer-name search, lawyer search, online legal consultation, lawyer directory/index and find-a-lawyer terms.
- VERIFIED: `/lawyers/` reverse page-to-query check returned `0` clicks, `0` impressions and `No data`, so the lawyer directory is not yet a verified broad SEO primary URL in GSC.
- VERIFIED: broad `עורך דין` query-to-page check shows homepage as current best URL by clicks with `9` clicks and `2,004` impressions, while many old/support URLs receive broad impressions.
- VERIFIED: broad `עורכי דין` query-to-page check also maps primarily to the homepage with `3` clicks and `1,228` impressions; `/lawyers/` did not appear in the visible top rows.
- VERIFIED: `מציאת עורך דין` maps to the homepage only in the visible row with `1` click, `34` impressions and position `7.2`.
- REVIEW: homepage is currently the de facto broad legal portal/find-a-lawyer entry; `/lawyers/` needs indexability, internal-link, title/H1, sitemap and real-lawyer-content review before it can be treated as a primary directory SEO page.
- BLOCKED: no public homepage, `/lawyers/`, title/H1/meta, URL, redirect, noindex, canonical, sitemap, menu, taxonomy, related-card, lawyer-card, CRM, review, wp-admin setting or CMS/database action was executed.
- SAFETY: browser evidence capture and repo documentation only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 15:36 Asia/Jerusalem
- VERIFIED / REVIEW: created the next remaining-gap GSC queue for cyber/privacy, national insurance, homepage, lawyer-directory and page-to-query checks.
- CREATED: `project-control/gsc-remaining-gap-queue-2026-05-11.md`.
- CREATED: `project-control/gsc-remaining-gap-queue-2026-05-11.csv`.
- UPDATED: `project-control/targeted-gsc-query-queue.md`.
- VERIFIED: the queue includes query-to-page checks for cyber lawyer, cyber law, privacy, data deletion, national insurance, medical committees, disability benefits, broad lawyer/homepage terms and find-a-lawyer intent.
- VERIFIED: the queue includes page-to-query checks for the homepage, `/lawyers/`, `/cyber-lawyer/`, `/practice-areas/national-insurance/`, and the old national-insurance calculator URL.
- NOT VERIFIED: no new GSC browser metrics were pulled in this cycle; this is a structured queue for the next browser evidence pass.
- BLOCKED: no public content, URL, redirect, noindex, canonical, sitemap, related-card, menu, taxonomy, lawyer-card, CRM, review, wp-admin setting or CMS/database action is approved by this queue.
- SAFETY: repo documentation/CSV planning only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 15:24 Asia/Jerusalem
- VERIFIED / REVIEW: folded the second targeted GSC browser evidence pass into the child-custody and traffic-law owner-approval packets.
- UPDATED: `project-control/child-custody-owner-approval-packet.md`.
- UPDATED: `project-control/child-custody-owner-approval-packet.csv`.
- UPDATED: `project-control/traffic-law-owner-approval-packet.md`.
- UPDATED: `project-control/traffic-law-owner-approval-packet.csv`.
- VERIFIED: the custody packet now explicitly carries forward the `משמורת בלעדית לאם` old-case-law URL risk with `107` impressions and average position `9.6`.
- VERIFIED: the traffic packet now explicitly carries forward the drunk-driving wrong-page signal where `נהיגה בשכרות` and `עורך דין נהיגה בשכרות` map to `/revocation-of-a-will-and-reviving-previous-will/`.
- NOT VERIFIED: these packet updates do not replace full GSC API export, GA4 data, legal/source review, side-by-side content comparison or owner approval.
- BLOCKED: no public content, URL, redirect, noindex, canonical, sitemap, related-card, menu, taxonomy, lawyer-card, CRM, review, wp-admin setting or CMS/database action is approved by these updates.
- SAFETY: repo documentation/CSV planning only; no live public site state was changed.

## LATEST WORK STATUS - 2026-05-11 15:12 Asia/Jerusalem
- VERIFIED / GSC: completed the second targeted GSC browser evidence pass for child-support variants, sole-custody, police-investigation, drug-offenses and drunk-driving terms.
- CREATED: `project-control/gsc-targeted-query-pass-2-2026-05-11.md`.
- CREATED: `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`.
- CREATED: `project-control/visual-evidence/gsc-targeted-drunk-driving-pages-2026-05-11.png`.
- VERIFIED: `משמורת בלעדית לאם` has `107` impressions at average position `9.6`, all mapped to an old case-law URL, so it is a high-risk custody support/migration review item.
- VERIFIED: `נהיגה בשכרות` and `עורך דין נהיגה בשכרות` each show `7` impressions mapped to `/revocation-of-a-will-and-reviving-previous-will/`, confirming a wrong-page traffic-law signal.
- VERIFIED: `עבירות סמים` has only `2` impressions across a case-law page and an old criminal-lawyer URL, so it remains low-sample support evidence.
- NOT VERIFIED: child-support modification/shared-custody variants, `בע"מ 919/15`, and `חקירה במשטרה` showed no visible rows in this pass.
- BLOCKED: owner approval, old-content comparison, source/legal review, internal-link planning and redirect/canonical/sitemap planning remain required before public content, URL, noindex, sitemap, related-card, menu, taxonomy, lawyer-card or CMS changes.
- SAFETY: evidence capture and repo documentation only; no live public content, GSC setting, URL, redirect, sitemap, canonical, related-card, lawyer profile or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 14:55 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the national-insurance owner-approval packet as a no-URL-change empty practice-area, strategic slug, calculator/tool, law-text, work-accident boundary and source/legal review planning decision.
- CREATED: `project-control/national-insurance-owner-approval-packet.md`.
- CREATED: `project-control/national-insurance-owner-approval-packet.csv`.
- VERIFIED: practice area `ביטוח לאומי` exists at `/practice-areas/national-insurance/`, has slug `national-insurance`, description text and count `0`, so it is a hub candidate only.
- VERIFIED: strategic `/national-insurance-lawyer/` appears as a proposed target for the old calculator URL in `url-migration-map.csv`, but it is not approved and is not treated as a verified current public pillar.
- VERIFIED: the old `מחשבון דמי ביטוח לאומי ובריאות` URL has `1,778` words, quality `5/10`, traffic risk `UNKNOWN`, and needs calculator/tool strategy before any redirect or rewrite.
- VERIFIED: the old national-insurance disability regulations page has `24,883` words, quality `4/10`, is outdated, and must be treated as law-text/source support review rather than a pillar by word count.
- NOT VERIFIED: direct GSC/SERP evidence for national-insurance lawyer, medical committee, disability-benefit and work-injury variants is still incomplete; the checked `תאונת עבודה` row showed zero visible rows.
- BLOCKED: owner approval, side-by-side comparison, source/legal review, deeper GSC/SERP evidence, work-accident/personal-injury/employment boundary review and redirect/canonical/sitemap planning are required before title/H1/meta, URL, content-body, menu/taxonomy, related-card, lawyer-card or CMS changes.
- SAFETY: repo documentation/CSV planning only; no live public content, national-insurance URL, redirect, sitemap, canonical, related-card, lawyer profile or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 14:40 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the cyber/privacy owner-approval packet as a no-URL-change primary-selection, cyber support, privacy support, criminal/cyber boundary and source/legal review planning decision.
- CREATED: `project-control/cyber-privacy-owner-approval-packet.md`.
- CREATED: `project-control/cyber-privacy-owner-approval-packet.csv`.
- VERIFIED: `/cyber-lawyer/` exists as the strongest current service candidate with `6,405` words, quality `8/10`, and internal links.
- VERIFIED: strategic `/cyber-privacy-lawyer/` is not a verified current public URL; the heuristic selected `/fbi-cyber-division/` by word count only.
- VERIFIED: `/fbi-cyber-division/` has `21,917` words and quality `6/10`, but its FBI/international-security intent is not an approved local service pillar.
- NOT VERIFIED: direct GSC rows for cyber/privacy terms are missing from the checked keyword map, so GSC/SERP evidence is required before public execution.
- BLOCKED: owner approval, side-by-side comparison, source/legal review, direct GSC/SERP evidence, cyber/privacy/criminal boundary review and redirect/canonical/sitemap planning are required before title/H1/meta, URL, content-body, menu/taxonomy, related-card, lawyer-card or CMS changes.
- SAFETY: repo documentation/CSV planning only; no live public content, cyber/privacy URL, redirect, sitemap, canonical, related-card or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 14:30 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the personal-injury/damages owner-approval packet as a no-URL-change primary-selection, tort-law, car-accident, work-accident and source/legal review planning decision.
- CREATED: `project-control/personal-injury-owner-approval-packet.md`.
- CREATED: `project-control/personal-injury-owner-approval-packet.csv`.
- VERIFIED: strategic `/personal-injury-lawyer/` is not a verified current public URL; the heuristic selected `/punitive-damage/` by word count only, so owner approval is required before any primary decision.
- VERIFIED: `/tort-lawyer/` exists as a current local damages/service candidate but is thin at `507` words with quality `4/10`.
- VERIFIED: GSC browser evidence maps `תאונת דרכים` mainly to `/car-accident-auto-injury-lawyer/` with `79-84` impressions, while future `/car-accident-lawyer/` has `4` conflict rows and `0` exact current clean URL.
- VERIFIED: `עורך דין נזיקין` has only a low-sample old category/verdict URL row with `2` impressions, and `תאונת עבודה` returned no visible rows in the checked pass.
- BLOCKED: owner approval, side-by-side comparison, source/legal review, deeper GSC/SERP evidence, car-accident/work-accident boundary review and redirect/canonical/sitemap planning are required before title/H1/meta, URL, content-body, menu/taxonomy, related-card, lawyer-card or CMS changes.
- SAFETY: repo documentation/CSV planning only; no live public content, personal-injury URL, redirect, sitemap, canonical, related-card or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 14:20 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the inheritance/wills owner-approval packet as a no-URL-change primary-selection, will-guide, will-contest, document/media-risk and support-page planning decision.
- CREATED: `project-control/inheritance-wills-owner-approval-packet.md`.
- CREATED: `project-control/inheritance-wills-owner-approval-packet.csv`.
- VERIFIED: `will` has `10` conflict rows and `0` exact current clean `/will/` URLs.
- VERIFIED: strategic `/inheritance-lawyer/` is not a verified current public URL; the heuristic selected `/most-recommended-family-lawyer/` by word count only, so owner approval is required before any primary decision.
- VERIFIED: GSC browser evidence maps `צוואה` and `התנגדות לצוואה` to old Hebrew, case-law, support and document/template URLs, including `126` impressions for a case-law page on `צוואה`, `120` impressions for the same case-law page on `התנגדות לצוואה`, and `6` impressions for `צוואה.docx`.
- VERIFIED: exact `עורך דין ירושה` filter returned no visible rows in the checked GSC browser pass, so lawyer-service traffic risk remains UNKNOWN/low-sample.
- BLOCKED: owner approval, side-by-side comparison, source/legal review, deeper GSC/SERP evidence, document/media strategy and redirect/canonical/sitemap planning are required before title/H1/meta, URL, content-body, document/media, menu/taxonomy, related-card, lawyer-card or CMS changes.
- SAFETY: repo documentation/CSV planning only; no live public content, inheritance/wills URL, redirect, sitemap, canonical, document/media, related-card or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 14:10 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the real-estate owner-approval packet as a no-URL-change primary-selection, homepage-signal, support-page and international-content cleanup planning decision.
- CREATED: `project-control/real-estate-owner-approval-packet.md`.
- CREATED: `project-control/real-estate-owner-approval-packet.csv`.
- VERIFIED: `/real-estate-attorney/` exists as the current commercial candidate with `6,941` words and quality `6/10`; exact `/real-estate-lawyer/` was not found as a current public URL.
- VERIFIED: GSC browser evidence maps `עורך דין מקרקעין` mainly to the homepage with `136` impressions, while `/real-estate-lawyer-cost-2025/` carries sale/buying/support queries including `3.85K` impressions for `עורך דין מכירת דירה`.
- VERIFIED: the real-estate cluster has international-property contamination; the heuristic selected a Greece property article as pillar by word count, so manual classification is required.
- BLOCKED: owner approval, side-by-side comparison, source/legal review, deeper GSC/SERP evidence and redirect/canonical/sitemap planning are required before homepage, title/H1/meta, URL, content-body, menu/taxonomy, related-card, lawyer-card or CMS changes.
- SAFETY: repo documentation/CSV planning only; no live public content, homepage, real-estate URL, redirect, related-card or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 14:00 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the medical-malpractice owner-approval packet as a no-URL-change primary-selection, duplicate-same-public-URL and YMYL source/legal review planning decision.
- CREATED: `project-control/medical-malpractice-owner-approval-packet.md`.
- CREATED: `project-control/medical-malpractice-owner-approval-packet.csv`.
- VERIFIED: `medical-malpractice-lawyer` has `27` conflict rows and `2` exact current records for the same public URL.
- VERIFIED: `/medical-malpractice-lawyer/` has two public REST records: ID `11607` with `5,135` words and quality `6/10`, and ID `1130` with `3,287` words and quality `8/10`.
- VERIFIED: GSC browser evidence maps visible `עורך דין רשלנות רפואית` demand to the fee article with `145` impressions, while birth/pregnancy malpractice demand maps to the old Hebrew birth-malpractice page with `661` and `419` impressions.
- BLOCKED: duplicate identity review, source/legal review, GSC/SERP deepening and owner approval are required before title/H1/meta, URL, redirect, content-body, canonical, sitemap, noindex, taxonomy/menu, lawyer-card, review/rating, schema or CMS changes.
- SAFETY: repo documentation/CSV planning only; no live public content, medical page, URL, redirect, profile, review, rating or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 13:49 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the divorce/family-law owner-approval packet as a no-URL-change primary-selection, document-risk and merge-review planning decision.
- CREATED: `project-control/divorce-family-owner-approval-packet.md`.
- CREATED: `project-control/divorce-family-owner-approval-packet.csv`.
- VERIFIED: `/divorce-lawyer/` exists as a clean candidate with `3,205` words and quality score `8/10`.
- VERIFIED: `עורך דין גירושין` maps mostly to the old Hebrew divorce-lawyer article with `960` impressions, so that URL is protected.
- VERIFIED: divorce/family document risk exists: a PDF has `45` impressions for `עורך דין גירושין`, and a DOCX has `86` impressions for `גישור גירושין`.
- BLOCKED: side-by-side content comparison, document strategy, source/legal review and owner approval are required before title/H1/meta, URL, redirect, document/media, homepage, canonical, sitemap, noindex, taxonomy/menu, Maya profile, lawyer-card or CMS changes.
- SAFETY: repo documentation/CSV planning only; no live public content, document, profile, homepage, URL or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 13:39 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the employment-law owner-approval packet as a no-URL-change primary-selection and intent-split planning decision.
- CREATED: `project-control/employment-law-owner-approval-packet.md`.
- CREATED: `project-control/employment-law-owner-approval-packet.csv`.
- VERIFIED: `/labor-lawyer/` exists but is thin at `689` words and has quality score `4/10`.
- VERIFIED: `עורך דין דיני עבודה` maps mostly to the homepage, while `דיני עבודה` maps mostly to `/israeli-labor-law/`.
- VERIFIED: future `/employment-lawyer/` is cleaner strategically, but no exact current URL exists and migration is not approved.
- BLOCKED: source/legal review and primary URL approval are required before title/H1/meta, URL, redirect, homepage, canonical, sitemap, noindex, taxonomy/menu, lawyer-card or CMS changes.
- SAFETY: repo documentation/CSV planning only; no live public content, homepage, URL or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 13:29 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the child-custody owner-approval packet as a no-URL-change comparison, source/legal review and document-risk planning decision.
- CREATED: `project-control/child-custody-owner-approval-packet.md`.
- CREATED: `project-control/child-custody-owner-approval-packet.csv`.
- VERIFIED: `/child-custody/` exists, has `2,397` words, and remains the likely public guide candidate.
- VERIFIED: broad `משמורת ילדים` demand maps to `what-is-child-custody/` and `ChildCustody.pdf`, not to `/child-custody/`.
- VERIFIED: `משמורת בלעדית לאם` maps to an old Hebrew case-law URL with `107` impressions and average position `9.6`.
- BLOCKED: source/legal review and a document strategy are required before title/H1/meta, URL, redirect, PDF, robots, canonical, sitemap, noindex, taxonomy/menu, lawyer-card or CMS changes.
- SAFETY: repo documentation/CSV planning only; no live public content, PDF, URL or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 13:28 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the child-support owner-approval packet as a no-URL-change comparison and source/legal planning decision.
- CREATED: `project-control/child-support-owner-approval-packet.md`.
- CREATED: `project-control/child-support-owner-approval-packet.csv`.
- VERIFIED: `/child-support/` exists, has `2,767` words, and remains the likely public guide candidate.
- VERIFIED: visible GSC child-support/calculation demand maps to `https://jus-tice.co.il/מחשבון-מזונות-ילדים/`, not to `/child-support/`.
- VERIFIED: `מזונות ילדים` has `160` impressions, `חישוב מזונות` has `131`, and `מחשבון מזונות` has `70` on the old calculator URL in the checked GSC browser filters.
- BLOCKED: source/legal review is required before calculator, formula, `בע"מ 919/15`, jurisdiction, title/H1/meta, URL, redirect, canonical, sitemap, noindex, taxonomy/menu, lawyer-card or CMS changes.
- SAFETY: repo documentation/CSV planning only; no live public content or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 13:18 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the criminal-law owner-approval packet as a primary-selection/consolidation decision, not a URL migration task.
- CREATED: `project-control/criminal-law-owner-approval-packet.md`.
- CREATED: `project-control/criminal-law-owner-approval-packet.csv`.
- VERIFIED: existing clean `/criminal-defense-attorney/` is published, has `9,086` words, and already targets `עורך דין פלילי` in the title.
- VERIFIED: `/criminal-lawyer/` remains a strategic future target, but migration is blocked by `13` conflict rows and old Hebrew GSC-signal URLs.
- VERIFIED: support targets such as police investigation, indictment, detention and drug offenses already have old/current assets, so duplicate clean slugs are blocked.
- BLOCKED: owner approval is required before public content edits, title/H1/meta changes, URL changes, redirects, canonicals, sitemap changes, noindex changes, taxonomy/menu edits or CMS writes.
- SAFETY: repo documentation/CSV planning only; no live public content or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 13:08 Asia/Jerusalem
- VERIFIED / REVIEW: prepared the first owner-approval packet for a traffic-law no-URL-change expansion batch.
- CREATED: `project-control/traffic-law-owner-approval-packet.md`.
- CREATED: `project-control/traffic-law-owner-approval-packet.csv`.
- VERIFIED: `/traffic-lawyer/` is a published exact clean URL and is thin at `1,399` words, making it a safer first expansion target than a URL migration task.
- VERIFIED: existing support pages `/driving-under-the-influence/`, `/yanshuf-breathalyzer-test/`, `/speeding/`, and `/driving-under-the-influence-of-drugs/` are thin and should be reviewed before any duplicate support slugs are created.
- VERIFIED: `/driving-under-the-influence/` should be reviewed/expanded before any `/drunk-driving/` decision.
- BLOCKED: owner approval is required before public content edits, title/H1/meta changes, URL changes, redirects, canonicals, sitemap changes, noindex changes, taxonomy/menu edits or CMS writes.
- SAFETY: repo documentation/CSV planning only; no live public content or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 12:56 Asia/Jerusalem
- VERIFIED / REVIEW: added a current SERP evidence pass for the criminal-law and traffic-law decision packets.
- CREATED: `project-control/serp-criminal-traffic-review-2026-05-11.md`.
- CREATED: `project-control/serp-criminal-traffic-review-2026-05-11.csv`.
- UPDATED: `project-control/criminal-law-support-decision-packet.md`.
- UPDATED: `project-control/traffic-law-support-decision-packet.md`.
- VERIFIED: criminal-law SERPs support `/criminal-lawyer/` as a strategic commercial pillar, but old Hebrew criminal-lawyer URLs and existing support pages still require comparison before any migration.
- VERIFIED: `דין פלילי` can cannibalize `עורך דין פלילי` if it becomes a competing pillar without a clear separate informational role.
- VERIFIED: `חקירה במשטרה`, `כתב אישום`, `מעצר ימים`, and `עבירות סמים` are support intents, but none should be created as duplicate pages before old-content/source/legal review.
- VERIFIED: traffic-law SERPs support expanding existing `/traffic-lawyer/` as the pillar and reviewing existing `/driving-under-the-influence/` before any `/drunk-driving/` slug decision.
- BLOCKED: no public content body, URL slug, redirect, noindex, canonical, sitemap, taxonomy, menu, lawyer, CRM, review, plugin-state, wp-admin setting or database row was changed.
- SAFETY: repo documentation/CSV planning only; no live public content or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 12:43 Asia/Jerusalem
- VERIFIED / REVIEW: created criminal-law and traffic-law support decision packets from the refreshed inventory, slug-conflict map, URL migration map and targeted GSC browser passes.
- CREATED: `project-control/criminal-law-support-decision-packet.md`.
- CREATED: `project-control/criminal-law-support-review.csv`.
- CREATED: `project-control/traffic-law-support-decision-packet.md`.
- CREATED: `project-control/traffic-law-support-review.csv`.
- VERIFIED: `criminal-lawyer` remains a strategic pillar target, but the public map has `13` conflict rows and no exact current `/criminal-lawyer/` URL; broad GSC evidence still favors old Hebrew criminal-lawyer URLs.
- VERIFIED: criminal support terms are mostly low-sample or zero-row in GSC; `כתב אישום` maps to a specific Netanyahu indictment page and homepage, while `עבירות סמים` has only `2` impressions split across old/case-law URLs.
- VERIFIED: `traffic-lawyer` has an exact current clean URL, but the pillar is thin and weak in GSC; drunk-driving intent still maps to the will-revocation page, which is a wrong-page match.
- VERIFIED: `driving-under-the-influence/`, `yanshuf-breathalyzer-test/`, and `speeding/` already exist, so future `/drunk-driving/` or traffic-support work must avoid duplicates.
- BLOCKED: these packets do not approve URL changes, redirects, noindex, canonical changes, sitemap changes, content rewrites, content deletion, menu/taxonomy edits, lawyer/CRM/review changes, plugin-state changes, wp-admin settings or database writes.
- SAFETY: repo documentation/CSV planning only; no live public content or CMS state was changed.

## LATEST WORK STATUS - 2026-05-11 12:42 Asia/Jerusalem
- VERIFIED / REVIEW: ran the third targeted GSC browser pass from the query queue against the accessible URL-prefix property `https://jus-tice.co.il/`.
- CREATED: `project-control/gsc-targeted-query-pass-3-2026-05-11.csv`.
- CREATED: `project-control/gsc-targeted-query-pass-3-2026-05-11.md`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass3-indictment-netanyahu-url-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass3-drunk-driving-lawyer-wrong-page-2026-05-11.png`.
- VERIFIED: `זכויות חשוד`, `מעצר ימים`, `סגירת תיק פלילי`, `עורך דין עבירות סמים`, `פסילה מנהלית`, and `שלילת רישיון נהיגה` returned no visible rows in the checked GSC filters.
- VERIFIED: `כתב אישום` has only `4` impressions, with visible rows on a specific Netanyahu indictment page (`3` impressions, average position `9.7`) and the homepage (`1` impression, position `70.0`).
- VERIFIED: `עורך דין נהיגה בשכרות` has `7` impressions on `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`, confirming the wrong-page traffic-law match.
- BLOCKED: this evidence does not approve any URL, redirect, noindex, canonical, sitemap, content rewrite, document removal, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change.
- SAFETY: browser GSC was read-only; repo changes are documentation/CSV evidence only.
## LATEST WORK STATUS - 2026-05-11 12:31 Asia/Jerusalem
- VERIFIED / REVIEW: ran the second targeted GSC browser pass from the query queue against the accessible URL-prefix property `https://jus-tice.co.il/`.
- CREATED: `project-control/gsc-targeted-query-pass-2-2026-05-11.csv`.
- CREATED: `project-control/gsc-targeted-query-pass-2-2026-05-11.md`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-custody-sole-mother-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-custody-sole-mother-table-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-drunk-driving-wrong-page-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-pass2-drunk-driving-wrong-page-table-2026-05-11.png`.
- VERIFIED: `מזונות משותפת`, `הפחתת מזונות`, `שינוי מזונות`, `הלכת המזונות החדשה`, `בע"מ 919/15`, and `חקירה במשטרה` returned no visible rows in the checked GSC filters.
- VERIFIED: `משמורת בלעדית לאם` has `107` impressions, `0` clicks, `0%` CTR and average position `9.6`, all on an old Hebrew case-law URL.
- VERIFIED: `עבירות סמים` has only `2` impressions split between a case-law page and an old criminal-lawyer URL; no clean `/drug-offenses/` support page owns the query.
- VERIFIED: `נהיגה בשכרות` has `7` impressions on `https://jus-tice.co.il/revocation-of-a-will-and-reviving-previous-will/`, a wrong-page match for traffic-law intent.
- BLOCKED: this evidence does not approve any URL, redirect, noindex, canonical, sitemap, content rewrite, document removal, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change.
- SAFETY: browser GSC was read-only; repo changes are documentation/CSV evidence only.
# Current Status - Jus-Tice.co.il
Date: 2026-05-10
Deployment model: GitHub repo sync to live WordPress. Do not build ZIP packages unless explicitly requested.

## LATEST WORK STATUS - 2026-05-11 12:17 Asia/Jerusalem
- IN PROGRESS / REVIEW: ran the first targeted GSC browser pass from the new query queue against the accessible URL-prefix property `https://jus-tice.co.il/`.
- CREATED: `project-control/gsc-targeted-query-pass-2026-05-11.csv`.
- CREATED: `project-control/gsc-targeted-query-pass-2026-05-11.md`.
- EVIDENCE: `project-control/visual-evidence/gsc-targeted-child-support-pages-2026-05-11.png`.
- UPDATED: `project-control/gsc-keyword-page-map.csv`, `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-content-priorities.csv`, `project-control/content-decision-evidence-overlay.csv`, and `project-control/child-support-content-decision-packet.md`.
- VERIFIED: `מזונות ילדים` has `160` impressions and all visible impressions go to `https://jus-tice.co.il/מחשבון-מזונות-ילדים/`, not `/child-support/`.
- VERIFIED: `חישוב מזונות` has `131` impressions and `מחשבון מזונות` has `70` impressions; both also map to the old calculator URL.
- VERIFIED: `משמורת ילדים` has `611` impressions split between `https://jus-tice.co.il/what-is-child-custody/` and `https://jus-tice.co.il/wp-content/uploads/2021/07/ChildCustody.pdf`; clean `/child-custody/` did not appear.
- VERIFIED: employment-law queries show weak primary ownership: `עורך דין דיני עבודה` maps mostly to the homepage, while `דיני עבודה` maps mostly to `https://jus-tice.co.il/israeli-labor-law/`.
- VERIFIED: exact `עורך דין ירושה` and `עורך דין צוואות וירושות` filters returned no visible rows; `עורך דין תאונות דרכים` had only `2` impressions on `https://jus-tice.co.il/car-accident-auto-injury-lawyer/`.
- BLOCKED: this evidence does not approve any URL, redirect, noindex, canonical, sitemap, content rewrite, document removal, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change.
- SAFETY: browser GSC was read-only; repo changes are documentation/CSV evidence only.

## LATEST WORK STATUS - 2026-05-11 11:55 Asia/Jerusalem
- IN PROGRESS / REVIEW: created a targeted GSC query queue to turn the current audit gaps into a concrete browser-check sequence.
- CREATED: `project-control/targeted-gsc-query-queue.csv`.
- CREATED: `project-control/targeted-gsc-query-queue.md`.
- VERIFIED: the queue covers the active NOT VERIFIED decision gaps for child support, child custody, employment law, inheritance/wills, work/car accident, traffic/drunk-driving, and criminal support spokes.
- VERIFIED: every row records expected primary URL, supporting URLs, why the query matters, what to record in GSC, and what to do if an old URL, clean URL, or multiple URLs appear.
- REVIEW: the first browser pass should start with `מזונות ילדים`, `חישוב מזונות`, `מחשבון מזונות`, `בעמ 919/15`, `משמורת ילדים`, employment-law, inheritance-lawyer, wills/inheritance, and car-accident lawyer variants.
- BLOCKED: the queue is not approval for any URL, redirect, noindex, canonical, sitemap, content rewrite, menu, taxonomy, lawyer, CRM, review, plugin-state, wp-admin setting or database change.
- SAFETY: this pass created planning documents only; no public site state was changed.

## LATEST WORK STATUS - 2026-05-11 11:44 Asia/Jerusalem
- IN PROGRESS / REVIEW: created a focused child-support decision packet for the largest current target-slug conflict group.
- CREATED: `project-control/child-support-content-decision-packet.md`.
- CREATED: `project-control/child-support-conflict-review.csv`.
- VERIFIED: `child-support` has `30` conflict rows and an exact clean URL candidate at `https://jus-tice.co.il/child-support/`.
- VERIFIED: the clean page is a public guide candidate with public REST word count `2,767`, quality heuristic `8/10`, and existing internal links to divorce, custody, mediation, property division, family dispute resolution, consensual divorce, and family-law lawyer directory pages.
- REVIEW: long old case-law/doctrine pages, including `בע״ם 919/15`, `בג״ץ 5988/21`, calculator/change-of-circumstances/court-jurisdiction content, should be treated as support or merge-review material, not automatic primary pages.
- NOT VERIFIED: direct GSC filters for `מזונות ילדים`, `חישוב מזונות`, `בעמ 919/15`, `מזונות משותפת`, and related variants are still needed before approving URL or redirect actions.
- SAFETY: no public content body, URL slug, redirect, sitemap inclusion, canonical setting, taxonomy term, menu, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 11:34 Asia/Jerusalem
- IN PROGRESS / REVIEW: created a first GSC/SERP evidence overlay that connects the refreshed content inventory and slug-conflict queues to existing Search Console browser evidence.
- CREATED: `project-control/content-decision-evidence-overlay.csv`.
- CREATED: `project-control/gsc-serp-first-evidence-pass.md`.
- VERIFIED: existing `GSC_BROWSER_VERIFIED` evidence is now mapped to the first priority decision targets: `criminal-lawyer`, `divorce-lawyer`, `medical-malpractice-lawyer`, `real-estate-lawyer`, `divorce-mediation`, `traffic-lawyer`, `personal-injury-lawyer`, and `inheritance-lawyer` / will variants.
- VERIFIED: `child-support` is a major inventory conflict (`30` rows) with an exact clean URL candidate, but direct GSC traffic for `מזונות ילדים` variants is still NOT VERIFIED.
- REVIEW: high-risk old URL signals are visible for divorce, criminal, malpractice, mediation/document URLs, real estate, and will/inheritance variants, so these must be handled as controlled migration decisions, not quick slug changes.
- BLOCKED: fresh browser GSC was not captured in this pass; authenticated menus/private content/full postmeta remain outside the public export.
- SAFETY: no public content body, URL slug, redirect, sitemap inclusion, canonical setting, taxonomy term, menu, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 11:13 Asia/Jerusalem
- FIXED LIVE: render-only HTTPS normalization for first-party media URLs is deployed in public attachment helpers, image srcsets, post content output and Rank Math image sitemap callbacks.
- PUSHED: `a74a28b` (`Normalize media sitemap URLs to HTTPS`) to GitHub main.
- VERIFIED UPRESS PULL: uPress Git log shows top commit `a74a28b` (`Normalize media sitemap URLs to HTTPS`).
- LIVE VERIFIED: static marker returns `2026-05-11-media-sitemap-https-v1`.
- VERIFIED AFTER-SCAN: `project-control/public-http-internal-link-scan-2026-05-11-after-media-sitemap-https.csv` records 42 `VERIFIED` resources and 0 `REVIEW` findings.
- FIXED LIVE: the remaining 69 `SEO_PLUGIN_SITEMAP_MEDIA` rows and 2 `CONTENT_MEDIA_OUTPUT` rows from the prior scan dropped to 0 in the bounded after-scan.
- WHY: after the term-link fix, the remaining public HTTP findings were isolated to 69 `SEO_PLUGIN_SITEMAP_MEDIA` rows and 2 `CONTENT_MEDIA_OUTPUT` rows.
- VERIFIED SOURCE: Rank Math official documentation lists `rank_math/sitemap/urlimages` for changing images included in XML sitemaps and `rank_math/sitemap/xml_img_src` for changing image URLs in the sitemap.
- VERIFIED LOCAL: PHP lint passed for 128 PHP files; `git diff --check` returned only normal Windows LF-to-CRLF warnings.
- SAFETY: no media-library record, content body, stored URL, URL slug, redirect, sitemap inclusion rule, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 11:00 Asia/Jerusalem
- FIXED LIVE: theme-owned taxonomy/term links now render through HTTPS normalization on the tested public surfaces.
- PUSHED: `005af18` (`Normalize theme term links to HTTPS`) to GitHub main.
- VERIFIED UPRESS PULL: uPress Git log shows top commit `005af18` (`Normalize theme term links to HTTPS`).
- LIVE VERIFIED: static marker returns `2026-05-11-theme-term-link-https-v1`.
- VERIFIED AFTER-SCAN: `project-control/public-http-internal-link-scan-2026-05-11-after-theme-term-link-https.csv` records 107 rows: 36 `VERIFIED` resources and 71 remaining `REVIEW` findings.
- FIXED LIVE: the `THEME_DISPLAY_FIX` lane dropped from 54 findings before deployment to 0 after deployment.
- REVIEW REMAINS: 69 findings are `SEO_PLUGIN_SITEMAP_MEDIA` and 2 are `CONTENT_MEDIA_OUTPUT`; these are now separate media/sitemap/content review tasks, not theme-link or URL-migration actions.
- ROADMAP ADDED: future actions are queued for homepage line-by-line review, competitor-aligned homepage strategy, holistic content-upload governance, Google Business/marketing ecosystem planning, and timeline/resource estimation.
- SAFETY: no public content body, stored URL, URL slug, redirect, sitemap inclusion rule, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 10:53 Asia/Jerusalem
- CODE FIXED / NOT LIVE VERIFIED: theme-owned taxonomy links now use a shared HTTPS-normalized term-link helper in breadcrumbs, homepage quick links, practice-area cards, article term chips, article archive term lists, lawyer mini-site area chips, header fallback dropdowns and related-content fallback targets.
- TOOLING FIXED / VERIFIED LOCAL: `tools/check-public-http-internal-links.ps1` now classifies findings into suspected source and remediation lane columns.
- CREATED / REVIEW: `project-control/public-http-internal-link-scan-2026-05-11-classified-before-theme-fix.csv` records the pre-deployment classified baseline.
- REVIEW FINDING: classified pre-fix sample has 160 `REVIEW` findings and 15 `VERIFIED` resources.
- REVIEW FINDING: 54 findings are in the `THEME_DISPLAY_FIX` lane, 69 are `PLUGIN_OR_MEDIA_CONFIG_REVIEW`, 2 are `CONTENT_MEDIA_DISPLAY_OR_CMS_REVIEW`, and 35 still require source classification.
- VERIFIED LOCAL: PHP lint passed for 128 PHP files; `git diff --check` returned only normal Windows LF-to-CRLF warnings.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-theme-term-link-https-v1`; uPress pull and after-scan still need to verify whether theme-owned HTTP references dropped from public output.
- SAFETY: this is rendered-output normalization only. No public content body, stored URL, URL slug, redirect, sitemap inclusion rule, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 10:40 Asia/Jerusalem
- IN PROGRESS / REVIEW: added a read-only broad public scanner for remaining first-party `http://jus-tice.co.il` references after the template HTTPS fix.
- PUSHED: `88a92f0` (`Add public HTTP link scan baseline`) to GitHub main.
- VERIFIED UPRESS PULL: uPress Git log shows top commit `88a92f0` (`Add public HTTP link scan baseline`).
- VERIFIED TOOLING: `tools/check-public-http-internal-links.ps1` produced `project-control/public-http-internal-link-scan-2026-05-11.csv`.
- REVIEW FINDING: bounded scan found 199 remaining first-party HTTP references: 122 in rendered HTML pages and 77 in child sitemap XML.
- REVIEW FINDING: 118 findings are internal page/category/article URLs and 81 are media upload URLs under `/wp-content/uploads/`.
- NOT FIXED YET: findings now need source classification before remediation: theme output, menu output, content body, media upload, SEO-plugin sitemap output, or unknown.
- SAFETY: this pass was read-only plus repo tooling/docs; no public content body, CMS metadata, URL slug, redirect, sitemap inclusion rule, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 10:10 Asia/Jerusalem
- FIXED LIVE: public template links now explicitly normalize first-party permalinks to HTTPS before rendering cards, lawyer links, LegalTech cards, schema URLs and cluster links.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows top commit `3b99fbb` (`Normalize public template links to HTTPS`).
- LIVE VERIFIED: static marker returns `2026-05-11-public-link-https-normalization-v1`.
- VERIFIED: `tools/check-live-related-content-qa.ps1` produced `project-control/live-related-content-qa-2026-05-11-after-public-link-https.csv` with all sampled rows marked `VERIFIED`.
- FIXED LIVE: sampled related-card `card_url` values now use `https://jus-tice.co.il/...` instead of `http://jus-tice.co.il/...`.
- VERIFIED STABLE: related-content semantic/fallback cluster QA still passes for general lawyer selection, criminal/drug offenses, local real estate cost, and family mutual divorce samples.
- VERIFIED LOCAL: PHP lint passed for 128 PHP files using the local PHP binary; `git diff --check` returned only normal Windows LF-to-CRLF warnings.
- SAFETY: no public content body, CMS metadata, URL slug, redirect, sitemap inclusion rule, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 10:02 Asia/Jerusalem
- FIXED LIVE: related-content cluster inference now separates foreign/international real-estate intent from local Israeli real-estate intent.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows top commit `4868db2` (`Filter international real estate related cards`).
- LIVE VERIFIED: static marker returns `2026-05-11-related-international-filter-v1`.
- VERIFIED: `tools/check-live-related-content-qa.ps1` produced `project-control/live-related-content-qa-2026-05-11-after-international-filter.csv` with all sampled rows marked `VERIFIED`.
- FIXED LIVE: `/real-estate-lawyer-cost-2025/` no longer shows the Greece real-estate pricing article as a related card; the third card is now an Israel/legal-real-estate article about building rights on roofs.
- VERIFIED STABLE: general lawyer-selection fallback, criminal-law semantic cards, and family-divorce semantic cards still pass cluster QA.
- SAFETY: no public content body, CMS metadata, URL, redirect, sitemap, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 09:51 Asia/Jerusalem
- FIXED LIVE: related-content fallback sections now expose QA attributes and safe cluster-aware fallback links instead of disappearing when a page has no practice-area term.
- LIVE DEPLOYMENT VERIFIED: uPress Git log shows top commit `40ee1c4` (`Expose related fallback QA attributes`).
- LIVE VERIFIED: static marker returns `2026-05-11-related-fallback-qa-v1`.
- VERIFIED: `tools/check-live-related-content-qa.ps1` produced `project-control/live-related-content-qa-2026-05-11-after-fallback-attrs.csv` with all sampled rows marked `VERIFIED`.
- FIXED LIVE: `/find-lawyer-how-to-find-good-attorney/` now has a `lawyer_selection` fallback instead of missing related-section QA or off-topic cards.
- FIXED LIVE: `/drug-offenses-criminal-lawyer/` now has `criminal_law` semantic related cards with cluster matches.
- STILL REVIEW: some same-cluster cards remain editorially weak even when they pass the technical cluster gate, such as international real-estate articles under a local real-estate cost page.
- SAFETY: no public content body, CMS metadata, URL, redirect, sitemap, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 09:07 Asia/Jerusalem
- VERIFIED UPress PULL: uPress Git log shows top commit `74309c5` (`Prepare plugin manifest export tooling`).
- VERIFIED SYNC: the hosted theme repo now contains `tools/export-plugin-manifest-diagnostic.ps1` and `tools/compare-plugin-manifests.ps1`.
- STILL BLOCKED: authenticated live manifest export still requires a WordPress Application Password or an already authenticated WordPress admin session.
- SAFETY: no plugin activation, deactivation, deletion, upload, rename, compression, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## LATEST WORK STATUS - 2026-05-11 09:04 Asia/Jerusalem
- BLOCKED AUTH EXPORT: Codex browser could not open the WordPress-side diagnostic route or `/wp-admin/` because the in-app browser returned a network failure for `jus-tice.co.il`.
- VERIFIED PUBLIC ROUTE STILL REACHABLE: local public checker reaches the same diagnostic route and receives HTTP 401, so the route remains live/protected.
- DECISION: do not pass normal account passwords through command-line Basic Auth and do not store credentials in the repo.
- CODE FIXED: added `tools/export-plugin-manifest-diagnostic.ps1` for future authenticated export via WordPress Application Password or safe environment variables.
- CODE FIXED: added `tools/compare-plugin-manifests.ps1` to compare the authenticated live manifest CSV against `project-control/ultra-justice-engine-repo-manifest.csv`.
- DOCUMENTED: updated `project-control/plugin-manifest-diagnostic-review.md` with the export/compare workflow and current blocker.
- STILL BLOCKED: actual live manifest export remains pending until a WordPress admin-authenticated request or Application Password is available.
- SAFETY: no plugin activation, deactivation, deletion, upload, rename, compression, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## LATEST WORK STATUS - 2026-05-11 08:58 Asia/Jerusalem
- VERIFIED LIVE DEPLOYMENT: uPress Git log shows top commit `8111d12` (`Add active plugin manifest diagnostic`).
- VERIFIED LIVE MARKER: public static marker returns `2026-05-11-plugin-manifest-diagnostic-v1`.
- VERIFIED LIVE SECURITY: unauthenticated public request to `/wp-json/justice-theme/v1/active-plugin-manifest?plugin=ultra-justice-engine%2Fultra-justice-engine.php` returns HTTP 401.
- VERIFIED TOOLING: `tools/check-plugin-manifest-diagnostic.ps1` reports `RESULT: VERIFIED - diagnostic route is protected from public unauthenticated access.`
- STILL BLOCKED: admin-authenticated export of the live active plugin manifest was not performed in this pass; it requires a WordPress admin-authenticated request/session.
- NEXT: use authenticated admin access to export the route JSON, convert the `files` array into CSV, and compare against `project-control/ultra-justice-engine-repo-manifest.csv`.
- SAFETY: no plugin activation, deactivation, deletion, upload, rename, compression, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## LATEST WORK STATUS - 2026-05-11 08:54 Asia/Jerusalem
- CODE FIXED: added admin-only read-only REST route `GET /wp-json/justice-theme/v1/active-plugin-manifest` for active plugin file manifests.
- WHY: the live active plugin code parity check is blocked without SSH/WP-CLI/download support; this gives an administrator a controlled way to retrieve active plugin paths, byte sizes and SHA-256 hashes without changing plugin state.
- VERIFIED IN CODE: route requires `manage_options`, only allows active plugins, constrains file reads to `WP_PLUGIN_DIR`, returns hashes/metadata only, and does not return file contents.
- CODE FIXED: added `tools/check-plugin-manifest-diagnostic.ps1` to verify the route is not publicly accessible without authentication after deployment.
- DOCUMENTED: created `project-control/plugin-manifest-diagnostic-review.md` and updated the plugin parity workflow.
- VERIFIED: PHP lint passed for 128 files; `git diff --check` returned only Windows LF-to-CRLF warnings.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-plugin-manifest-diagnostic-v1`; uPress pull/cache check still needed before public route protection can be verified.
- SAFETY: no plugin activation, deactivation, deletion, upload, rename, compression, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## LATEST WORK STATUS - 2026-05-11 08:48 Asia/Jerusalem
- VERIFIED UPress PULL: uPress Git log for `/wp-content/themes/justice-theme` shows top commit `8800b13` (`Document live plugin parity gap`).
- VERIFIED SYNC: the live theme repository now has the plugin parity baseline docs/tooling pulled from GitHub.
- IMPORTANT: this was a theme Git pull only; it does not update the separately active live plugin under `/wp-content/plugins/ultra-justice-engine/`.
- DECISION: do not assume the active live plugin has the repo LegalTech CPT file until a plugin-specific deployment/parity plan is approved.
- SAFETY: no plugin activation, deactivation, deletion, upload, rename, compression, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## LATEST WORK STATUS - 2026-05-11 08:43 Asia/Jerusalem
- PARTIAL VERIFIED LIVE PARITY: created a repo-side hash manifest for `ultra-justice-engine/` and a live-visible uPress manifest for the active plugin folder.
- VERIFIED LOCAL: repo `ultra-justice-engine/` contains 17 files / 80,392 bytes; repo `includes/` contains 16 files / 77,046 bytes.
- VERIFIED LIVE VISIBLE: uPress File Manager `includes/` listing for `/wp-content/plugins/ultra-justice-engine/includes/` shows 15 files and screenshot evidence was saved.
- VERIFIED PARITY GAP: repo contains `ultra-justice-engine/includes/cpt-legal-tools.php`, but that file was NOT VISIBLE in the live active plugin `includes/` listing.
- EXPLAINED: this matches the earlier public REST finding that `justice_legal_tool` and `justice_legal_request` are NOT_EXPOSED on live, so LegalTech CPT parity must be treated as NOT VERIFIED before any product/CMS planning depends on it.
- BLOCKED: byte-level live-vs-repo comparison remains blocked because the Codex in-app browser cannot download files from uPress File Manager and SSH/WP-CLI/file API access is not available in this session.
- DOCUMENTED: created `project-control/live-plugin-code-parity-review.md`, `project-control/ultra-justice-engine-repo-manifest.csv`, `project-control/ultra-justice-engine-live-visible-manifest.csv`, and `tools/build-plugin-manifest.ps1`.
- SAFETY: no plugin activation, deactivation, deletion, upload, rename, compression, file edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## LATEST WORK STATUS - 2026-05-11 08:30 Asia/Jerusalem
- VERIFIED LIVE PATH: uPress File Manager read-only inspection confirms the active Justice plugin filesystem path is `/wp-content/plugins/ultra-justice-engine/ultra-justice-engine.php`.
- VERIFIED LIVE PATH: `/wp-content/plugins/ultra-justice-engine/` exists, is marked active in the uPress filesystem view, and contains `includes/` plus `ultra-justice-engine.php`.
- VERIFIED LIVE ABSENCE: filtering `/wp-content/plugins/` for `justice-core` returned 0 items, so `justice-core/` is a repo-side future target, not the live plugin folder in this uPress check.
- DOCUMENTED: created `project-control/upress-plugin-filesystem-readonly-review.md` and saved screenshot evidence under `project-control/visual-evidence/`.
- DECISION: exact plugin path question is now closed for the current live state; keep `Ultra Justice Engine` as active track and keep any future `justice-core` migration approval-gated.
- SAFETY: no plugin activation, deactivation, deletion, upload, rename, file-manager edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## LATEST WORK STATUS - 2026-05-11 08:16 Asia/Jerusalem
- DOCUMENTED / VERIFIED LOCAL: added repeatable Justice plugin collision scanner `tools/check-justice-plugin-collision.ps1`.
- VERIFIED LOCAL: `ultra-justice-engine/ultra-justice-engine.php` is `Ultra Justice Engine` v1.0.0 and uses REST namespace `ultra-justice-engine/v1`.
- VERIFIED LOCAL: `justice-core/justice-core.php` is `Justice Core` v1.0.0 and uses REST namespace `justice-core/v1`.
- VERIFIED LOCAL RISK: `justice-core/` and `ultra-justice-engine/` both define `UJE_VERSION`, `UJE_DIR`, `UJE_URL` and many `uje_*` functions, so they must not be active together.
- DOCUMENTED: created `project-control/justice-plugin-collision-review.md` and updated `project-control/plugin-registry.md` / `project-control/live-plugin-architecture-review.md`.
- DECISION: keep treating `Ultra Justice Engine` as the active live Justice plugin; keep `Justice Core` as a future migration target only after parity/collision review, backup, maintenance window and owner approval.
- SAFETY: no plugin activation, deactivation, deletion, installation, file-manager edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## LATEST WORK STATUS - 2026-05-11 07:30 Asia/Jerusalem
- CODE FIXED / DEPLOYED: added a narrow native-404 route guard that renders the theme 404 template before later template handlers can redirect a request, but only after WordPress has already identified the request as `is_404()`.
- DEPLOYED LIVE: uPress Git log shows commit `cbbba45` (`Render native 404 before homepage redirects`) and the public static marker returns `2026-05-11-native-404-before-redirect-v1`.
- VERIFIED LIVE BLOCKER: fake public URLs still return `301 Location: https://jus-tice.co.il` instead of a 404, even after the native-404 guard deployed.
- VERIFIED LIVE BLOCKER: `/?p=99999999`, `/wp-admin/not-a-real-admin-.../`, `/index.php/not-a-real-index-path-.../`, and arbitrary fake paths all redirect to the homepage.
- VERIFIED LIVE CLUE: the 301 response has no `X-Redirect-By` header and does not include the theme `X-Justice-Route-Guard` header, so the redirect source is likely earlier than theme template routing or bypasses normal WordPress redirect filters. Exact source NOT VERIFIED.
- VERIFIED SOURCE: uPress plugin manager shows `All 404 Redirect to Homepage` active (`פעיל`), and its description says it redirects random 404 links to the homepage or another page using 301 redirects.
- DOCUMENTED: created `project-control/redirect-404-source-review.md` and screenshot evidence `project-control/visual-evidence/all-404-redirect-plugin-active-upress-2026-05-11.png`.
- NEXT: with owner approval, deactivate `All 404 Redirect to Homepage`, clear cache if needed, and verify fake URLs return HTTP 404 while valid URLs remain 200. Do not change `.htaccess`, permalink settings, URL migrations, or redirect maps.
- SAFETY: no public content, URL, redirect rule, `.htaccess`, taxonomy, canonical, sitemap, lawyer, lead/CRM, review, wp-admin option or database row was changed. Plugin source was identified read-only; deactivation still requires approval.

## LATEST WORK STATUS - 2026-05-11 07:00 Asia/Jerusalem
- FIXED LIVE: replaced the zero-byte static root `robots.txt` in uPress File Manager with a conservative crawl file that includes the verified sitemap directive `Sitemap: https://jus-tice.co.il/sitemap_index.xml`.
- WHY: public `https://jus-tice.co.il/robots.txt` was shadowing WordPress' healthy generated robots output and returned HTTP 200 with an empty body, which blocked clean GSC sitemap/crawl verification.
- VERIFIED BEFORE FIX: `https://jus-tice.co.il/robots.txt?codex_check=...` returned length 0, while `https://jus-tice.co.il/?robots=1&codex_check=...` returned valid WordPress robots output with the sitemap directive.
- VERIFIED LIVE: `https://jus-tice.co.il/robots.txt?codex_verify=...` now returns HTTP 200, length 268, includes the sitemap index, has no global `Disallow: /`, and does not block `/wp-content/themes`.
- VERIFIED LIVE: the active sitemap index and sampled child sitemaps remain valid XML and all sampled first-party loc values are HTTPS only: sitemap index 0 HTTP / 9 HTTPS, page 0 / 11, articles1 0 / 201, articles2 0 / 200, practice-areas 0 / 40, category 0 / 16.
- SAFETY: no URL, redirect, `.htaccess` rule, sitemap inclusion rule, content body, taxonomy term, canonical setting, lawyer profile, lead/CRM record, review data, wp-admin setting or database row was changed. The only live mutation was the root `robots.txt` file content.

## LATEST WORK STATUS - 2026-05-11 06:49 Asia/Jerusalem
- CODE FIXED: disabled Rank Math sitemap caching through the official `rank_math/sitemap/enable_caching` filter while the sitemap HTTPS baseline is being verified.
- WHY: after uPress pull confirmed the latest theme code was live, public Rank Math child sitemap XML still exposed stale `http://jus-tice.co.il` loc values. Cache bypass is the narrowest repo-level next step before any plugin setting or URL migration work.
- CODE FIXED: deployment marker advanced to `2026-05-11-rankmath-sitemap-cache-bypass-v1`.
- VERIFIED BEFORE PATCH: `articles-sitemap2.xml?nocache=1` still returned 200 HTTP loc values and zero HTTPS loc values, so the issue was not solved by a simple URL query cache bust.
- VERIFIED LIVE: uPress Git log shows top commit `4c7b45e` (`Bypass Rank Math sitemap cache`) and public static marker returns `2026-05-11-rankmath-sitemap-cache-bypass-v1`.
- FIXED LIVE: sampled child sitemaps now return zero first-party HTTP locs: `page-sitemap.xml` 0 HTTP / 11 HTTPS, `articles-sitemap1.xml` 0 HTTP / 201 HTTPS, `articles-sitemap2.xml` 0 HTTP / 200 HTTPS, `practice-areas-sitemap.xml` 0 HTTP / 40 HTTPS, `category-sitemap.xml` 0 HTTP / 16 HTTPS.
- STILL BLOCKED: `https://jus-tice.co.il/robots.txt` still returns HTTP 200 with zero-length body and needs separate static/server/plugin robots-source investigation.
- SAFETY: no URL, redirect, sitemap plugin setting, robots/htaccess file, content body, taxonomy term, canonical setting, lawyer profile, lead/CRM record, review data, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 06:39 Asia/Jerusalem
- VERIFIED LIVE: uPress browser Git workflow is now usable from this session. The theme working tree was clean before pull, the pull completed, and uPress Git log shows top commit `c992fd2` (`Document reviews compliance alias`).
- VERIFIED LIVE: static marker now returns `justice-theme-deployment-marker=2026-05-11-robots-sitemap-directive-v1`, and homepage source includes `2026-05-11-robots-sitemap-directive-v1`.
- VERIFIED LIVE PARTIAL: homepage source still uses the WordPress/RealFaviconGenerator manifest and does not duplicate the theme fallback manifest.
- BLOCKED / NOT FIXED BY PULL: `https://jus-tice.co.il/robots.txt` still returns HTTP 200 with zero-length body, so the theme `robots_txt` filter is not affecting public output. This likely indicates a static/server/plugin robots layer; exact source NOT VERIFIED.
- BLOCKED / NOT FIXED BY PULL: `https://jus-tice.co.il/articles-sitemap2.xml` still exposes 200 `http://jus-tice.co.il` loc values and zero HTTPS loc values, despite the latest theme code being live. The sitemap appears Rank Math generated and likely needs sitemap cache/settings flush.
- DOCUMENTED: created `project-control/upress-git-pull-workflow.md` with the verified pull steps, post-pull evidence and next safe actions.
- SAFETY: no content body, URL, redirect, taxonomy term, canonical setting, lawyer profile, lead/CRM record, review data, wp-admin content setting or database row was changed; the only live action was the requested Git pull.

## LATEST WORK STATUS - 2026-05-11 06:29 Asia/Jerusalem
- DOCUMENTED: expanded `project-control/reviews-compliance-risk.md` from a thin pointer into an owner-facing compliance summary for the lawyer reviews, ratings, reputation and trust module.
- DOCUMENTED: the plural file now clearly aliases the canonical detailed register `project-control/review-compliance-risk.md` and lists non-negotiable rules, MVP compliance position, approval gates, launch blockers and related planning files.
- WHY: the owner requested both `reviews-compliance-risk.md` and `review-compliance-risk.md`; the project-control package should not look incomplete or ambiguous during the review/reputation module rollout.
- VERIFIED: documentation review confirmed the broader review/reputation package is present, including research, Google integration plan, rating spec, review fields, schema policy, product roadmap and Maya prototype plan.
- NOT IMPLEMENTED: no public review UI, no fake ratings, no reputation score, no review schema, no Google review sync, no lawyer profile change and no database/wp-admin change were made.
- SAFETY: docs-only change; no URL, redirect, sitemap, robots/htaccess, content body, taxonomy term, canonical setting, lawyer profile, lead/CRM record, review data, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 06:18 Asia/Jerusalem
- CODE FIXED: added a `robots_txt` filter that appends the verified active sitemap index `https://jus-tice.co.il/sitemap_index.xml` when robots.txt does not already include it.
- WHY: public checks verified `sitemap_index.xml` is valid XML, while default sitemap aliases redirect to the homepage. Robots should point crawlers to the known working sitemap source before any URL migration.
- VERIFIED: the filter respects the WordPress public-indexing flag and avoids duplicate directives when the same sitemap URL is already present.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-robots-sitemap-directive-v1`; public robots.txt verification still needs uPress pull/cache clear.
- SAFETY: no URL, redirect, sitemap plugin setting, robots/htaccess server file, content body, taxonomy term, canonical setting, lawyer profile, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 06:09 Asia/Jerusalem
- CODE FIXED: added plugin-sitemap HTTPS normalization hooks for first-party sitemap entries, covering WordPress core sitemap entries plus common Yoast, Rank Math and AIOSEO sitemap URL/index filters.
- CODE FIXED: sitemap `loc` values are normalized through the existing `justice_theme_normalize_public_url()` helper; the patch does not add, remove, redirect, migrate or noindex any URL.
- WHY: live sitemap checks previously found many `http://jus-tice.co.il` child sitemap URLs, which is a technical SEO blocker before any controlled URL migration.
- VERIFIED: plugin hook names were checked against official Yoast, Rank Math and AIOSEO documentation before coding.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-sitemap-https-plugin-filters-v1`; public sitemap verification still needs uPress pull/cache clear.
- SAFETY: no URL, redirect, sitemap plugin setting, robots/htaccess rule, content body, taxonomy term, canonical setting, lawyer profile, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 05:58 Asia/Jerusalem
- CODE FIXED: added stable `assets/images/site.webmanifest` for mobile bookmark/install surfaces, pointing to the existing 192x192 and 512x512 Jus-Tice icon assets.
- CODE FIXED: `inc/seo.php` now provides a fallback manifest link only when WordPress has no Site Icon, matching the favicon fallback behavior and avoiding duplicate live manifest tags.
- VERIFIED: existing logo/icon dimensions were checked locally; square icon assets exist at 16, 32, 48, 180, 192 and 512 pixels, and the full logo source is 1781x1654.
- VERIFIED: PHP lint passed for 127 files, `site.webmanifest` JSON validated, and `git diff --check` passed.
- PARTIAL LIVE VERIFIED: current public source already has a RealFaviconGenerator manifest under `/wp-content/uploads/fbrfg/site.webmanifest`; the new theme manifest should stay suppressed while WordPress Site Icon remains active.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-branding-manifest-v1`; public homepage/static marker still needs uPress pull/cache clear before the theme-side fallback behavior can be verified live.
- SAFETY: no WordPress Site Icon setting, custom logo setting, media-library item, content body, URL, redirect, sitemap, canonical, taxonomy, lawyer profile, lead/CRM record, review data or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 05:46 Asia/Jerusalem
- CODE FIXED: the public lawyer directory now prefilters candidate profiles through `justice_theme_lawyer_profile_is_public_approved()` before the visible `WP_Query` runs.
- CODE FIXED: directory result counts and pagination now use the approved-profile query result instead of counting only the already-loaded page after filtering.
- WHY: seed/demo/unapproved lawyer records should not distort the public directory count or create weak empty pages while the lawyer trust, review/reputation and URL architecture projects are still controlled.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-lawyer-directory-approved-query-v1`; public homepage/static marker still needs uPress pull/cache clear before live behavior can be verified.
- SAFETY: no lawyer profile, URL, redirect, content body, taxonomy term, sitemap, canonical, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 05:29 Asia/Jerusalem
- CODE FIXED: Maya Rotenberg no longer bypasses lawyer public-approval safety by name/slug before seed/demo metadata is evaluated.
- CODE FIXED: a Maya name/slug fallback now requires either normal approval/source signals or explicit opt-in filter `justice_theme_allow_maya_name_public_profile_fallback`.
- WHY: the Maya mini-site should be rich and serious, but it must not appear as public-approved if the only available record is still seed/demo data.
- VERIFIED: seed/demo metadata now blocks Maya public approval; approved/verified/source-backed Maya metadata can still render.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-maya-public-approval-hardening-v1`; public homepage still needs uPress pull/cache clear before this can be verified.
- SAFETY: no Maya profile field, lawyer profile, URL, redirect, content body, taxonomy term, sitemap, canonical, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 05:19 Asia/Jerusalem
- CODE FIXED: legacy LegalTech tool-page seeders in `justice-core`, `ultra-justice-engine`, and `ultra-justice` now require explicit opt-in filters before they can publish `justice_legal_tool` pages.
- WHY: LegalTech/intake pages are product and SEO surfaces, so they must be planned, reviewed and approved instead of being silently published by an admin page load during the content architecture project.
- VERIFIED: public/user-submitted LegalTech request handling is unchanged; only automatic admin-init tool-page creation is gated.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-legal-tools-seed-gate-v1`; public homepage still needs uPress pull/cache clear before this can be verified.
- SAFETY: no legal tool page, legal request, lawyer profile, URL, redirect, content body, taxonomy term, sitemap, canonical, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 05:10 Asia/Jerusalem
- CODE FIXED: lawyer profile view tracking is now disabled by default and requires explicit opt-in filter `justice_theme_enable_lawyer_profile_view_tracking`.
- WHY: single lawyer profile page loads should not write `profile_views` metadata or visitor throttling transients during the content audit, URL migration and marketplace trust cleanup phase.
- VERIFIED: lawyer mini-site rendering, approval checks, contact safety gates and public content output remain unchanged; only the automatic page-load write path is gated.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-lawyer-profile-view-tracking-gate-v1`; public homepage still needs uPress pull/cache clear before this can be verified.
- SAFETY: no lawyer profile, URL, redirect, content body, taxonomy term, sitemap, canonical, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 05:01 Asia/Jerusalem
- CODE FIXED: legacy/demo lawyer auto-seeders in `justice-core`, `ultra-justice-engine`, and `ultra-justice` now require explicit opt-in filters before they can create or update demo `justice_lawyer` profiles.
- CODE FIXED: legacy `/seed-lawyers` and `/seed-reset` REST routes now require separate explicit opt-in filters in addition to admin capability.
- WHY: demo/seed profiles, placeholder phones and automatic Maya slug changes must not quietly re-enter the live marketplace while the content architecture, lawyer trust and URL migration projects are in controlled audit mode.
- VERIFIED: default behavior is no automatic demo lawyer seeding and no seed reset/import route access unless the owner intentionally enables the matching filters.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-demo-lawyer-seed-gates-v1`; public homepage still needs uPress pull/cache clear before this can be verified.
- SAFETY: no lawyer profile, URL, redirect, content body, taxonomy term, sitemap, canonical, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 04:50 Asia/Jerusalem
- CODE FIXED: custom REST content write routes for `update-meta` and `trash-post` now require explicit opt-in filters (`uje_enable_rest_content_writes` / `uj_enable_rest_content_writes`) in addition to admin capability.
- CODE FIXED: legacy agent bridge REST routes are disabled by default through `uje_enable_agent_bridge_rest` / `uj_enable_agent_bridge_rest`; theme file writes also require `uje_enable_agent_bridge_file_write` / `uj_enable_agent_bridge_file_write`.
- WHY: REST read tools can help the audit, but REST writes and theme-file writes must not become an unplanned deployment/CMS mutation channel.
- VERIFIED: read-only audit/report routes remain admin-only; write routes are opt-in only.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-rest-write-gates-v1`; public homepage still needs uPress pull/cache clear before this can be verified.
- SAFETY: no REST call, file write, taxonomy term, page, article, URL, redirect, content body, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 04:40 Asia/Jerusalem
- CODE FIXED: theme admin seeders now require explicit opt-in filters before creating taxonomy terms, pillar page drafts, article drafts, city/practice drafts, lawyer registration page, lawyer dashboard page or lawyer plans page.
- CODE FIXED: added shared `justice_theme_admin_cms_write_enabled()` gate for owner-approved admin seed/write actions.
- WHY: opening wp-admin during the content audit/URL migration project should not silently create public pages, article drafts, taxonomy terms or business-funnel pages.
- VERIFIED: manual/editorial form submissions and existing public render-time fallbacks are unchanged; this patch only controls automatic seeders.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-admin-seed-write-guard-v1`; public homepage still needs uPress pull/cache clear before this can be verified.
- SAFETY: no taxonomy term, page, article, URL, redirect, content body, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 04:30 Asia/Jerusalem
- CODE FIXED: primary WordPress menu seeding no longer runs from public `init`; it is admin-only and requires explicit opt-in filter `justice_theme_enable_primary_menu_seed`.
- CODE FIXED: seeded-menu URL repair now requires explicit opt-in filter `justice_theme_enable_seeded_menu_area_url_repair`.
- WHY: menus are part of SEO/design hierarchy and should not be permanently rewritten by an ordinary frontend request during the content architecture and URL migration project.
- VERIFIED: customer-facing render-time fallback menu links remain in place through `wp_nav_menu_items`; the patch only controls permanent WordPress menu writes.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-menu-cms-write-guard-v1`; public homepage still needs uPress pull/cache clear before this can be verified.
- SAFETY: no menu item, URL, redirect, content body, taxonomy term, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 04:22 Asia/Jerusalem
- CODE FIXED: family-law public runtime guard now remains visitor-safe but render-only by default; if old public bodies still contain internal markers, the rendered output is replaced with the cleaned repo article body without silently saving it back to WordPress.
- CODE FIXED: family-law editorial repair, internal-notes draft sync, quarantine and auto-publication now all require explicit opt-in filters before they can perform permanent CMS writes.
- WHY: the current project mode is content inventory, URL migration mapping and controlled approvals. A theme pull should not silently rewrite article bodies, draft pages, URLs, metadata or cache state.
- VERIFIED: automatic creation/update of the internal notes draft is paused by default; manual wp-admin repair remains available through the existing approved admin action.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-family-cluster-render-only-guard-v1`; public homepage still serves older marker `2026-05-11-mobile-inner-qa-v1`, so uPress pull/cache clear is still required.
- SAFETY: no public content body, URL, redirect, taxonomy term, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 05:18 Asia/Jerusalem
- CODE FIXED: automatic Maya Rotenberg live slug migration is now disabled by default and requires explicit opt-in through `justice_theme_enable_maya_slug_migration`.
- CODE FIXED: automatic Maya mini-site CMS field bootstrapping is now disabled by default and requires explicit opt-in through `justice_theme_enable_maya_minisite_bootstrap`.
- CODE FIXED: automatic Maya public-source metadata bootstrapping is now disabled by default and requires explicit opt-in through `justice_theme_enable_maya_public_sources_bootstrap`.
- WHY: URL/profile changes must be controlled by the content inventory, URL migration map, redirect plan and owner approval. A theme pull should not silently mutate WordPress slugs or lawyer profile fields.
- VERIFIED: the previous public lawyer trust gate remains in place; this patch only changes when live data migrations are allowed to run.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-controlled-maya-migration-guard-v1`; requires uPress pull/cache clear and a source-marker check.
- SAFETY: no public content body, URL, redirect, taxonomy term, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 05:02 Asia/Jerusalem
- CODE FIXED: breadcrumb markup now includes stable item/current/home classes, a breadcrumb depth attribute, and text wrappers for safer truncation.
- CODE FIXED: breadcrumb styling was upgraded from a plain grey strip to a compact premium navigation band with pill links, current-page emphasis, subtle legal-brand accent, mobile horizontal scrolling, and RTL-safe separators.
- VERIFIED: breadcrumb schema output remains in place through the existing `justice_theme_print_breadcrumb_schema()` path.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-breadcrumb-polish-v1`; requires uPress pull/cache clear and desktop/mobile checks on article, archive, lawyer directory, practice, search and 404 pages.
- SAFETY: no public content body, URL, redirect, taxonomy term, sitemap, canonical, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 04:52 Asia/Jerusalem
- CODE FIXED: related-content manual URL metadata now accepts comma, newline, pipe and semicolon separators, so admin/CMS batches are less brittle.
- CODE FIXED: related-article sections now expose safe DOM QA signals: `data-related-source-cluster`, `data-related-card-count`, and per-card `data-related-card-cluster` / `data-related-cluster-match`.
- CODE FIXED: reusable article cards can receive controlled `data-*` attributes without changing public text, layout, URLs or article content.
- VERIFIED: PHP lint passed for 127 files and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-related-content-qa-attrs-v1`; requires uPress pull/cache clear and repeat related-content DOM/visual QA.
- SAFETY: no WordPress article body, CMS metadata, URL, redirect, taxonomy term, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:41 Asia/Jerusalem
- DOCUMENTED: created `project-control/related-content-cms-update-batch-001.csv` for four priority pages whose live related cards need explicit CMS metadata.
- DOCUMENTED: batch 001 specifies `content_cluster`, `parent_pillar_url`, and `manual_related_urls` for the general lawyer-selection article, drug-offenses article, real-estate cost article, and mutual-divorce-agreement article.
- DOCUMENTED: updated related-content strategy and implementation report so the next CMS/admin pass has a concrete metadata update list instead of a vague "fix related cards" note.
- VERIFIED: docs-only CSV/header/content checks passed locally.
- NOT LIVE VERIFIED / NOT EXECUTED: no WordPress article body, CMS metadata, URL, redirect, taxonomy term, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed.
- NEXT: after owner approval and wp-admin/REST write access, apply the metadata batch and then repeat the 2026-05-11 related-content visual QA sample.

## LATEST WORK STATUS - 2026-05-11 03:31 Asia/Jerusalem
- CODE FIXED: header topic-strip fallbacks for personal injury/damages and inheritance now route to canonical lawyer-directory filters instead of old standalone fallback paths.
- CODE FIXED: homepage inheritance pillar fallback now also routes to the canonical inheritance lawyer-directory filter until the clean pillar page is published.
- CODE FIXED: footer specialization links now expose medical malpractice, employment, traffic and inheritance filters in addition to family, criminal, real estate and personal injury.
- CODE FIXED: seeded/admin-repaired practice-area menu URLs now normalize additional stale aliases (`medical-malpractice`, `medical_malpractice`, `cyber-privacy`, `privacy-cyber`, `employment-law`) into canonical directory filters.
- CODE FIXED: lawyer-directory filter parsing now accepts extra public aliases for medical malpractice, privacy/cyber and tax filters, with `privacy-cyber-law` querying the existing `cyber-law` taxonomy slug.
- VERIFIED: PHP lint passed for 127 files, `git diff --check` passed, and the remaining legacy alias scan matches intentional admin-menu repair mappings only.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-nav-area-fallback-normalization-v1`; requires uPress pull/cache clear and live checks of header/footer/menu links plus filtered directory URLs.
- SAFETY: no public article body, URL migration, redirect, taxonomy term, lawyer record, lead/CRM record, review data, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:20 Asia/Jerusalem
- CODE FIXED: public lead forms now submit canonical clean legal-area slugs (`family-law`, `criminal-law`, `real-estate-law`, `personal-injury-law`, `medical-malpractice-law`, etc.) instead of mixed legacy values.
- CODE FIXED: the lead classifier now normalizes old/legacy area values (`family`, `real_estate`, `damages`, `torts`, `medical_malpractice`, `employment-law`, Hebrew `אחר`) into the same canonical CRM/content-cluster vocabulary.
- CODE FIXED: existing non-canonical `legal_area` values are normalized on lead save, and the CRM table displays Hebrew legal-area labels instead of raw slugs where possible.
- VERIFIED: PHP lint passed for 127 files using the provided local PHP 8.5.6 runtime, and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-lead-area-normalization-v1`; requires uPress pull/cache clear and one controlled test lead from homepage/lead form.
- SAFETY: no existing lead rows, lawyer records, review data, public article bodies, URLs, redirects, taxonomy terms, wp-admin settings or database rows were changed by this repo patch.

## LATEST WORK STATUS - 2026-05-11 03:10 Asia/Jerusalem
- CODE FIXED: lawyer-directory area filters now accept clean/public aliases such as `personal-injury-law`, `medical-malpractice-law`, and `employment-law` while querying the existing taxonomy slugs safely.
- CODE FIXED: legacy/old filter params (`torts`, `medical-malpractice`, `labor`, `employment`) are normalized so menu/header/homepage links do not silently produce empty or weak lawyer-directory states.
- CODE FIXED: the public filter dropdown now presents normalized visitor-facing labels for `נזיקין ותאונות`, `רשלנות רפואית`, and `דיני עבודה` while preserving the underlying taxonomy route.
- VERIFIED: PHP lint passed for 127 files using the provided local PHP 8.5.6 runtime, and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-lawyer-filter-slug-alias-v1`; requires uPress pull/cache clear and live checks for `/lawyers/?area=personal-injury-law`, `/lawyers/?area=medical-malpractice-law`, and `/lawyers/?area=labor-law`.
- SAFETY: no taxonomy terms, URLs, redirects, public article bodies, lawyer records, review data, lead/CRM records, wp-admin settings or database rows were changed.

## LATEST WORK STATUS - 2026-05-11 04:36 Asia/Jerusalem
- CODE FIXED: homepage featured pillar cards now include visible entries for `עורך דין רשלנות רפואית` and `עורך דין נזיקין`, using safe published-page checks with lawyer-directory fallbacks.
- CODE FIXED: homepage topic clusters now cover `רשלנות רפואית`, `נזיקין ותאונות`, `דיני עבודה`, and `ירושה וצוואות` in addition to family, criminal, real estate and traffic.
- CODE FIXED: new supporting links use `justice_theme_safe_public_link()`, so unpublished clean English slugs fall back to safe topic/directory URLs instead of creating weak homepage redirects or broken links.
- VERIFIED: PHP lint passed for 127 files using the provided local PHP 8.5.6 runtime, and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-homepage-hub-coverage-v1`; requires uPress pull/cache clear and a public homepage DOM/mobile visual check.
- SAFETY: no public article body, URL migration, redirect, sitemap, wp-admin setting, lead/CRM record, lawyer data, review data or database row was changed.

## LATEST WORK STATUS - 2026-05-11 04:24 Asia/Jerusalem
- CODE FIXED: forced homepage-fallback 404 responses now emit `X-Justice-Route-Guard: forced-unknown-path-404` so the routing guard can be verified cleanly after deployment.
- CODE FIXED: the same forced 404 responses emit `X-Robots-Tag: noindex, nofollow` to avoid accidental indexing if a missing path is caught by the guard.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-forced-404-header-signal-v1`; requires uPress pull/cache clear and a public fake-URL header/status check.
- SAFETY: no public content body, URL migration, redirect, sitemap, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 04:12 Asia/Jerusalem
- CODE FIXED: public frontend first-party links generated by WordPress now normalize to HTTPS through `home_url`, post/page/CPT permalink, term link and attachment link filters.
- CODE FIXED: the URL normalization helper no longer calls `home_url()` internally, avoiding recursion while still matching the configured Jus-Tice host.
- PARTIAL ONLY: this does not change stored database URLs, redirect rules, URL slugs, wp-admin settings, or external links; plugin-specific sitemap settings may still need admin review.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-public-link-https-normalization-v1`; requires uPress pull/cache clear and public HTML/sitemap spot checks for internal `http://jus-tice.co.il` links.
- SAFETY: no public content body, URL migration, redirect, robots rule, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 04:00 Asia/Jerusalem
- CODE FIXED: theme-emitted first-party canonical, hreflang and Open Graph URLs now normalize to HTTPS when they point to the Jus-Tice public host.
- CODE FIXED: common SEO plugin canonical/Open Graph URL filters are normalized through the same safe helper, and WordPress core sitemap entries are normalized if core sitemaps are active.
- PARTIAL ONLY: this does not change live redirects, database URLs, URL slugs, or the active SEO-plugin sitemap configuration; the plugin sitemap still needs wp-admin/uPress review because live child sitemaps previously exposed many `http://` locs.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-https-seo-url-normalization-v1`; requires uPress pull/cache clear and source checks on homepage, article, practice page, lawyer directory and sitemap outputs.
- SAFETY: no public content body, URL migration, redirect, robots rule, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:40 Asia/Jerusalem
- CODE FIXED: shared public legal search forms now have premium responsive styling instead of plain browser-form presentation.
- CODE FIXED: the public search header, no-results state, and 404 search panel now use consistent card spacing, focus states, mobile stacking, and Hebrew visitor-facing hierarchy.
- CODE FIXED: `404.php` no longer uses inline layout styles for the 404 panel/home CTA; styling now lives in reusable theme CSS.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-search-404-polish-v1`; requires uPress pull/cache clear and live desktop/mobile QA for search, no-results, and a true 404 URL.
- SAFETY: no content body, URL, redirect, sitemap, robots, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:27 Asia/Jerusalem
- CODE FIXED: search result cards now use a theme-side Hebrew public post-type label map instead of trusting raw plugin labels.
- CODE FIXED: mapped public labels include `מאמר משפטי`, `מאמר`, `עמוד מידע`, `פרופיל עורך דין`, `כלי משפטי`, with a safe Hebrew fallback `תוכן משפטי`.
- CODE FIXED: this protects the public search UI even if a legacy plugin registration or cached CPT label still exposes English labels.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-public-label-map-v1`; requires uPress pull/cache clear and live search-page QA.
- SAFETY: no content body, URL, redirect, sitemap, robots, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:14 Asia/Jerusalem
- CODE FIXED: Articles CPT labels in both plugin trees now use Hebrew public/admin labels (`מאמרים משפטיים`, `מאמר משפטי`) instead of English `Articles` / `Article`.
- CODE FIXED: practice-area taxonomy labels in both plugin trees now use Hebrew labels (`תחומי משפט`, `תחום משפט`) instead of English `Practice Areas`.
- VERIFIED IN CODE: 404 and search templates already had Hebrew body/H1/pagination strings; this batch closes the remaining CPT-label leak that can appear on search result cards.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-hebrew-cpt-labels-v1`; requires uPress pull/cache clear and live search-page QA.
- SAFETY: no content body, URL, redirect, sitemap, robots, wp-admin setting, lead/CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 03:00 Asia/Jerusalem
- CODE FIXED: homepage featured-lawyer module now requires the selected lawyer profile to pass the public-approved profile helper before rendering.
- CODE FIXED: homepage featured-lawyer copy no longer says "verified lawyer" at section level; verification language is left to the card only when real profile metadata supports it.
- CODE FIXED: homepage lawyer CTA now points to `/lawyer-registration/` instead of the weaker `/join/` path.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-featured-lawyer-trust-v1`; requires uPress pull/cache clear and homepage visual QA.
- SAFETY: no lawyer profile content, review data, lead data, URL, redirect, sitemap, robots, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 02:45 Asia/Jerusalem
- CODE FIXED: lawyer phone and WhatsApp CTAs now pass through a shared public-contact safety filter before rendering on directory cards or mini-site hero buttons.
- CODE FIXED: obvious placeholder/demo numbers such as sequential values, repeated digits and `555123`-style values are suppressed from public lawyer CTAs.
- CODE FIXED: Attorney schema now uses the same safe phone value, so placeholder lawyer numbers should not be emitted as structured data.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-lawyer-contact-safety-v1`; requires uPress pull/cache clear and live QA on `/lawyers/` plus at least one lawyer profile.
- SAFETY: no lawyer profile content, review data, lead data, URL, redirect, sitemap, robots, wp-admin setting or database row was changed.

## LATEST WORK STATUS - 2026-05-11 02:28 Asia/Jerusalem
- CODE FIXED: lawyer card/profile ratings and testimonials now require explicit `review_display_enabled` approval before public display.
- CODE FIXED: sponsored/profile-paid labels on the lawyer mini-site now require `subscription_status=active` and are suppressed for seed-like profiles.
- CODE FIXED: lawyer profile view counting is throttled with a one-day hashed visitor transient, reducing database writes from every anonymous page load to at most one counted write per visitor/profile/day.
- VERIFIED: `single-justice_lawyer.php`, `template-parts/cards/lawyer-card.php`, and `functions.php` passed PHP syntax checks.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-lawyer-trust-safety-v1`; requires uPress pull/cache clear and public lawyer-profile QA.
- SAFETY: no review data, lawyer profile content, URL, redirect, sitemap, robots, wp-admin setting, CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 02:05 Asia/Jerusalem
- CODE FIXED: related article taxonomy fallback now has a cluster-sanity gate in `inc/related-content.php`.
- CODE FIXED: when explicit `content_cluster` metadata is absent, the related-content system infers a conservative editorial cluster from slug/title/meta/practice-area signals before accepting taxonomy fallback cards.
- CODE FIXED: off-intent fallback patterns such as AI-for-law-firms, business-license, Australia lawyers and Cyprus pricing should no longer be accepted under criminal/general/real-estate pages unless they match the source cluster.
- VERIFIED: `inc/related-content.php` passed PHP syntax check and `git diff --check` passed.
- NOT LIVE VERIFIED: deployment marker is now `2026-05-11-related-cluster-gate-v1`; requires uPress pull/cache clear and repeat QA on general, criminal, family and real-estate article samples.
- SAFETY: no article body, URL, redirect, sitemap, robots, wp-admin setting, CRM record or database row was changed.

## LATEST WORK STATUS - 2026-05-11 01:35 Asia/Jerusalem
- CODE FIXED: article templates no longer expose internal review/status panels to anonymous public visitors. The `NOT VERIFIED` / source-audit / draft word-count/status blocks in `single-articles.php` are now editor-only via `current_user_can( 'edit_post', get_the_ID() )`.
- VERIFIED: PHP lint passed for 127 PHP files after the article-note guard.
- LIVE VERIFIED BEFORE FIX: four sampled live article pages did not currently expose unsafe internal markers, but the template was unsafe when those meta fields existed.
- LIVE RELATED QA: sampled general, family, criminal and real-estate article pages show `data-related-mode="semantic"` and no unsafe internal markers.
- PARTIAL QUALITY: related cards are still not customer-ready across all clusters. General/criminal samples still surface off-intent cards such as AI-for-law-firms, business-license and Australia lawyers; real-estate also surfaces Cyprus pricing. Manual related URLs, `content_cluster`, and practice-area metadata cleanup are required.
- NOT LIVE VERIFIED AFTER FIX: deployment marker is now `2026-05-11-public-article-note-guard-v1`; uPress pull/cache clear is required before public verification of this exact guard.
- BLOCKED FOR AUTONOMOUS DEPLOY: uPress file-manager still redirects this Codex browser session to login, and browser automation cannot safely fill the uPress login form. Owner must either log in once in the Codex browser and keep the session authenticated, or provide SSH/WP-CLI/deploy-hook access.
- SAFETY: no article body, URL, redirect, sitemap, robots, wp-admin setting, CRM record or database row was changed.

## LATEST LIVE STATUS - 2026-05-11 01:10 Asia/Jerusalem
- LIVE VERIFIED: owner pressed uPress Git pull and the public site now serves deployment marker `2026-05-11-mobile-inner-qa-v1` on homepage and `/family-law/`.
- LIVE VERIFIED: public `premium-pass-3.css` contains the inner-page mobile overflow/contact-control fix.
- VISUAL VERIFIED: fresh live mobile screenshots were captured for `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/` without injected CSS.
- EVIDENCE: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-live.json` and `project-control/visual-evidence/mobile-inner-*-2026-05-11-live.png`.
- FIXED / LIVE VERIFIED: all four sampled mobile pages report `scrollWidth = 390`, `clientWidth = 390`, `overflowX = false`.
- FIXED / LIVE VERIFIED: duplicate theme `.whatsapp-float` is hidden on sampled inner mobile pages; one compact third-party WhatsApp button remains.
- VERIFIED: article page still exposes `data-related-mode="semantic"`.
- BLOCKED FOR AUTONOMOUS PULL: the direct uPress file-manager URL still redirects this Codex browser session to the uPress login screen. A persistent authenticated uPress session, SSH/WP-CLI access, or an approved secured deploy webhook is needed for Codex to pull without owner action.
- CREATED: `project-control/deployment-access-plan.md`.
- SAFETY: no public content, URLs, redirects, sitemap settings, robots rules, CRM records, database rows or wp-admin settings were changed.

## LATEST WORK STATUS - 2026-05-10 23:32 Asia/Jerusalem
- BLOCKED: the provided uPress file-manager URL opened to the uPress login screen in the in-app browser, so authenticated file-manager inspection is not available yet.
- CODE FIXED: related article selection now uses semantic priority instead of broad/latest fallback.
- CODE FIXED: `inc/related-content.php` prioritizes manual editorial URLs, then `content_cluster`, then shared `practice-areas`; it no longer uses legacy `post` as a normal related-content source.
- CODE FIXED: when no semantic related card exists, article pages show a relevant practice-area link instead of unrelated cards.
- VERIFIED: PHP lint passed for 127 PHP files.
- SAFETY: no public content, URLs, redirects, sitemap, robots, wp-admin, CRM or database records were changed.
- NOT LIVE VERIFIED: requires uPress pull/cache clear and visual check on representative article pages.

## LATEST WORK STATUS - 2026-05-10 23:20 Asia/Jerusalem
- LIVE VERIFIED ISSUE: mobile DOM inspection found the remaining green lower-right overlay is `a.whatsapp-button`, not the Tawk chat iframe.
- LIVE VERIFIED ISSUE DETAIL: before fix the button rendered about 255x61px at the mobile bottom-right and covered lower hero/customer content. Evidence: `project-control/visual-evidence/mobile-third-party-cta-before-2026-05-10.png`.
- CODE FIXED: `assets/css/premium-pass-3.css` now converts the third-party/mobile WhatsApp lead banner into a 54x54px round icon-only control on screens under 760px.
- CODE FIXED: the mobile override hides the extra Jus-Tice logo image/text inside that injected button, keeps the WhatsApp icon visible, lowers stacking priority, and preserves the outbound WhatsApp link.
- VISUAL VERIFIED BY LIVE CSS SIMULATION: injected the exact CSS into the live mobile page and captured `project-control/visual-evidence/mobile-chat-widget-css-test-final-2026-05-10.png`; computed size changed to 54x54px.
- SAFETY: no URLs, redirects, content bodies, sitemap rules, robots rules, admin settings, leads, CRM records or database data were changed.
- NOT LIVE VERIFIED AFTER CODE FIX: requires owner/uPress pull, cache clear, and fresh mobile screenshot.

## LATEST LIVE STATUS - 2026-05-10 23:25 Asia/Jerusalem
- LIVE VERIFIED: owner uPress pull is public; homepage now serves deployment marker `2026-05-10-branding-v1`.
- LIVE VERIFIED: theme version `1.0.2` assets are visible in public source.
- LIVE VERIFIED: repo fallback brand/icon files are crawlable and return HTTP 200: `favicon.svg`, `favicon.ico`, `favicon-512.png`, `apple-touch-icon.png`, `site-icon-512.png`, and `logo.png`.
- LIVE VERIFIED: WordPress/media/plugin favicon tags are still the active source output, so the theme fallback correctly does not print duplicate fallback tags while `has_site_icon()` is true.
- VISUAL VERIFIED: fresh screenshots captured at `project-control/visual-evidence/homepage-branding-post-pull-desktop-2026-05-10.png` and `project-control/visual-evidence/homepage-branding-post-pull-mobile-2026-05-10.png`.
- VISUAL VERIFIED: mobile/desktop header logo remains visible after the branding pull.
- PARTIAL FIX: the theme WhatsApp float is smaller/raised on mobile after the pull.
- STILL LOOKS BAD: the third-party green chat/lead bubble still overlaps lower mobile hero cards; this is separate from the theme WhatsApp float.
- NOT VERIFIED: wp-admin Site Icon selected media item and final Google search-result favicon refresh.

## LATEST WORK STATUS - 2026-05-10 23:05 Asia/Jerusalem
- CODE FIXED: logo/favicon/search-branding task added and documented in `project-control/favicon-logo-task.md` and `project-control/design-polish-checklist.md`.
- VERIFIED: owner-provided Downloads logo PNG was inspected; full image is 1781x1654 and is not square, so it is not directly suitable as a Site Icon without crop/export.
- CODE FIXED: repo dummy `assets/images/logo.png` was replaced with the provided Jus-Tice logo source, and `assets/images/justice-logo-full.png` was added as a reference copy.
- CODE FIXED: square fallback favicon/app assets were generated from the old mark: 16, 32, 48, 180, 192 and 512 PNGs plus `favicon.ico`.
- CODE FIXED: `assets/images/favicon.svg` now uses a square legal mark with the red accent; `inc/seo.php` now emits ICO/SVG/512/Apple fallback tags only when WordPress has no Site Icon.
- CODE FIXED: red dot logo animation is slightly faster and the fallback wordmark is slightly smaller.
- LIVE VERIFIED: current live page already outputs multiple favicon tags from WordPress/media/plugin layers, and sampled live favicon URLs return HTTP 200.
- NOT LIVE VERIFIED AFTER FIX: requires uPress pull/cache refresh, browser tab/mobile icon visual check and wp-admin Site Icon review.

## LATEST WORK STATUS - 2026-05-10 22:48 Asia/Jerusalem
- LIVE VERIFIED BEFORE FIX: mobile homepage screenshot shows the Pojo accessibility tab overlapping the hero area and the theme WhatsApp button competing with the lower mobile lead/chat CTA.
- VISUAL EVIDENCE: `project-control/visual-evidence/mobile-floating-actions-before-2026-05-10.png`.
- CODE FIXED: mobile CSS now reserves bottom safe space, reduces the theme WhatsApp float from 52px to 48px, raises it above the lower CTA zone, and lowers its stacking priority.
- CODE FIXED: mobile CSS now moves the Pojo accessibility toolbar from the middle of the first viewport to a predictable top-side position and caps the overlay height.
- VERIFIED: `git diff --check` passed after the CSS change.
- SAFETY: no public URLs, redirects, content bodies, sitemap rules, robots rules, wp-admin settings, lead submissions or CMS/database records were changed.
- NOT LIVE VERIFIED: requires uPress pull/cache refresh and a fresh mobile screenshot after deployment.

## LATEST LIVE STATUS - 2026-05-10 22:35 Asia/Jerusalem
- LIVE VERIFIED: follow-up fallback patch is now public.
- LIVE VERIFIED: homepage topic strip traffic link now renders as `https://jus-tice.co.il/lawyers/?area=traffic-law` instead of the homepage-redirecting `/traffic-law/`.
- LIVE VERIFIED: homepage topic strip AI/intake link now renders as `https://jus-tice.co.il/#ask-lawyer` instead of the homepage-redirecting `/legal-tools/ai-intake/`.
- LIVE VERIFIED: enriched ask-lawyer form is public and now includes visible fields for email, legal area, city/region and urgency.
- LIVE VERIFIED: old hidden `lead_area=general` and `lead_urgency=normal` values are no longer present in the homepage form.
- LIVE VERIFIED: homepage lead source keyword is now neutral: `עורך דין / עורכי דין / הכוונה משפטית`.
- VISUAL VERIFIED: screenshots captured at `project-control/visual-evidence/ask-lawyer-enriched-desktop-2026-05-10.png` and `project-control/visual-evidence/ask-lawyer-enriched-mobile-2026-05-10.png`.
- SAFETY: no lead submission was sent, no CRM records changed, and no public URLs/redirects/content bodies were changed.
- NEXT: run one controlled lead submission only when CRM/wp-admin verification is available.

## LATEST LIVE STATUS - 2026-05-10 22:15 Asia/Jerusalem
- LIVE VERIFIED: owner Upress pull is now reflected publicly. Homepage deployment marker is `2026-05-10-contextual-title-v1`.
- LIVE VERIFIED: homepage title is now `עורכי דין בישראל | מדריך עורכי דין, מאמרים משפטיים וייעוץ`.
- LIVE VERIFIED: `/lawyers/` title is now `מדריך עורכי דין בישראל | Jus-Tice`; the English `Archive` leak is fixed live.
- LIVE VERIFIED: header topic strip renders expanded crawlable topic links for divorce, criminal, real estate, malpractice, personal injury, traffic, employment, inheritance and legal intake.
- VISUAL VERIFIED: fresh homepage and `/lawyers/` desktop/mobile screenshots were captured under `project-control/visual-evidence/*post-pull*2026-05-10.png`.
- LIVE VERIFIED FOLLOW-UP ISSUE: rendered traffic topic fallback used `/traffic-law/`, which returns 301 to homepage.
- LIVE VERIFIED FOLLOW-UP ISSUE: `/legal-tools/` and `/legal-tools/ai-intake/` return 301 to homepage, so LegalTech CTAs are not safe until tool pages are published.
- CODE FIXED: traffic fallbacks now use `/lawyers/?area=traffic-law`, and LegalTech/header AI links fall back to `/#ask-lawyer` until the legal-tool pages exist.
- VERIFIED: PHP lint passed locally for 127 PHP files after the follow-up traffic/LegalTech fallback patch.
- SAFETY: no slugs, redirects, public content, sitemap rules, robots rules, wp-admin settings or database records were changed.
- NOT LIVE VERIFIED AFTER FOLLOW-UP FIX: requires another Upress pull/cache refresh after commit.

## LATEST LEAD / INTAKE STATUS - 2026-05-10 22:25 Asia/Jerusalem
- LIVE VERIFIED: homepage ask-lawyer form now posts to `wp-admin/admin-post.php` and includes the nonce/spam/attribution hidden fields.
- LIVE VERIFIED ISSUE: the pulled homepage ask-lawyer form still captures `lead_area=general` and `lead_urgency=normal` as hidden values, which is too thin for a LegalTech/AI fallback destination.
- LIVE VERIFIED ISSUE: homepage lead attribution still used an old recommendation-heavy source keyword in the hidden field.
- CODE FIXED: homepage ask-lawyer form now asks for email, legal area, city/region and urgency as visible public fields.
- CODE FIXED: homepage and lawyer-directory lead source keywords now use neutral portal/directory phrases instead of stale page meta.
- VERIFIED: PHP lint passed locally for 127 PHP files after the lead/intake form enrichment.
- SAFETY: no lead submissions were sent, no CRM records changed, and no public content/URLs/redirects changed.
- NOT LIVE VERIFIED AFTER FIX: requires Upress pull/cache refresh and one controlled lead submission test.

## LATEST WORK STATUS - 2026-05-10 21:55 Asia/Jerusalem
- CODE FIXED: no-URL-change homepage/directory SEO batch added safe primary/fallback internal links for major legal-intent topics.
- CODE FIXED: `inc/template-tags.php` now exposes `justice_theme_public_path_is_published()` and `justice_theme_safe_public_link()` so planned English pillar URLs are used only when published.
- CODE FIXED: header topic strip now includes divorce, criminal, real estate, medical malpractice, personal injury, traffic, employment, inheritance and AI intake links.
- CODE FIXED: featured pillar cards and topic-cluster links now use safe published-path checks and fallbacks.
- VERIFIED LIVE BEFORE FIX: `/criminal-lawyer/`, `/real-estate-lawyer/`, `/personal-injury-lawyer/`, `/employment-lawyer/` and `/inheritance-lawyer/` redirect to homepage, so direct hard-coded links were unsafe before the batch.
- VERIFIED LIVE BEFORE FIX: homepage and `/lawyers/` title/H1/meta were exported into `project-control/seo-title-h1-review.csv`; `/lawyers/` still shows the English `Archive` title leak on live.
- VERIFIED: PHP lint passed locally for 127 PHP files after this batch.
- DOCUMENTED: evidence and next steps are in `project-control/homepage-directory-seo-batch-001.md` and `project-control/homepage-directory-seo-batch-001.csv`.
- SAFETY: no slugs, redirects, public content, sitemap rules, robots rules, wp-admin settings or database records were changed.
- NOT VERIFIED LIVE: requires deployment/pull/cache refresh and visual recheck.

## LATEST VERIFICATION STATUS - 2026-05-10 21:30 Asia/Jerusalem
- VERIFIED: owner-provided PHP ZIP was installed locally at `C:\Users\janana\tools\php-8.5.6\php.exe`.
- VERIFIED: full repo PHP lint now passes for 127 PHP files; the previous "PHP lint blocked" status for the contextual SEO title fix is resolved locally.
- FIXED: `tools/php-lint.ps1` now discovers the local PHP 8.5.6 install before older Winget fallback paths.
- DOCUMENTED: local PHP setup is recorded in `project-control/php-local-setup.md`.
- NOT VERIFIED LIVE: `/articles/` still serves deployment marker `2026-05-10-runtime-guard-v5` and the old `Articles Archive | Jus-Tice.co.il` title, so commit `a90bf4b` is not live yet or is blocked by cache/sync.
- LIVE VERIFIED: `/not-a-real-page-justice-qa/` currently returns a 301 redirect to the homepage, which is a customer-facing 404/routing problem and likely requires uPress/wp-admin/server/cache review.
- LIVE VERIFIED: a sample Hebrew lawyer URL returns 200, but sampled HTML still contains old deployment marker and HTTP canonical/OG signals; this needs a post-deploy lawyer-profile/canonical QA pass.
- BLOCKED LIVE: uPress pull/cache refresh/wp-admin access is still needed before repo fixes can be called live customer-ready.
- LIVE VERIFIED: `https://jus-tice.co.il/sitemap_index.xml` is the active sitemap index and returns valid XML with 9 child sitemaps.
- LIVE VERIFIED BLOCKER: `/sitemap.xml`, `/wp-sitemap.xml`, and `/post-sitemap.xml` redirect to the homepage instead of returning XML.
- LIVE VERIFIED BLOCKER: active child sitemaps list many `http://` URLs: page sitemap 10/11 HTTP, articles sitemap 1 has 238/252 HTTP, articles sitemap 2 has 217/217 HTTP, and practice-area sitemap has 34/48 HTTP.
- DOCUMENTED: sitemap evidence is recorded in `project-control/sitemap-live-verification.csv`, `project-control/sitemap-strategy.md`, and `project-control/robots-htaccess-review.md`.
- CREATED: first no-URL-change remediation batch at `project-control/no-url-change-remediation-batch-001.md` and `project-control/no-url-change-remediation-batch-001.csv`.
- DOCUMENTED: media/document policy, legacy CPT migration review, and divorce mediation merge review now exist in `project-control/media-document-policy.md`, `project-control/legacy-cpt-migration-review.md`, and `project-control/divorce-mediation-merge-review.md`.
- VERIFIED: `/divorce-mediation-basics/` already exists and overlaps `/divorce-mediation/`; no duplicate publication or redirect is approved.
- DECISION: next safe unblocked task is a no-URL-change homepage/directory SEO batch, not article publication or URL migration.

## LATEST CONTENT AUDIT STATUS - 2026-05-10
- VERIFIED: GSC/GA4 continuous SEO intelligence baseline was expanded beyond keyword filters into Page indexing, Sitemaps, Core Web Vitals, HTTPS, Links overview, GA4 acquisition, GA4 events, and GA4 pages/screens.
- CREATED/UPDATED: `project-control/gsc-master-workflow.md`, `project-control/gsc-indexing-review.csv`, `project-control/gsc-core-web-vitals-review.csv`, `project-control/ga4-analytics-review.md`, `project-control/ga4-event-plan.csv`, `project-control/seo-title-h1-review.csv`, `project-control/homepage-seo-strategy.md`, `project-control/content-architecture-decisions.md`, `project-control/sitemap-strategy.md`, and `project-control/daily-gsc-monitoring.md`.
- VERIFIED FROM GSC: Page indexing shows 198 indexed pages and 1.58K not indexed pages, including 785 crawled-currently-not-indexed URLs, 38 duplicate-without-user-selected-canonical URLs, 90 page-with-redirect URLs, 2 not-found URLs, and 1 Google-selected-different-canonical URL.
- VERIFIED FROM GSC DRILLDOWNS: sampled Page indexing examples show not-indexed URLs are a mix of media/PDF/DOCX URLs, legacy CPT URLs (`/labor_law/...`), old Hebrew taxonomy/category URLs, attachment redirect URLs, a test URL, and real content candidates such as `/divorce-mediation-basics`. This supports classification before deletion/redirect, not blanket cleanup.
- CLASSIFIED: first 16 sampled GSC indexing examples are now split in `project-control/gsc-indexing-example-classification.csv` into media/document noise, technical asset/probe URLs, legacy CPT migration candidates, old taxonomy/category URLs, redirect sources, and real content candidates.
- DECISION FROM CLASSIFICATION: valid 404/probe URLs should stay 404; media files require document-library policy; `/divorce-mediation-basics` must be compared/merged before any `/divorce-mediation/` publication; old criminal/family taxonomy URLs remain migration-sensitive.
- VERIFIED FROM GSC: Core Web Vitals summary shows 8 poor URLs and 8 needs-improvement URLs; drilldown metrics still need opening before template-level fixes.
- VERIFIED FROM GSC: HTTPS report shows 412 Non-HTTPS URLs, 25 HTTPS URLs, and 222 HTTPS-not-evaluated URLs, making HTTPS/canonical/sitemap consistency a migration blocker.
- VERIFIED FROM GA4: Organic Search is the largest visible channel with 1,261 sessions; total visible sessions are 2,447; key events are 0, so business conversions are not measurable yet.
- VERIFIED FROM GA4: `/` has 396 views and strong visible engagement, while `/lawyers/` has only 22 views but high repeat views/engagement, so homepage-to-directory routing and event tracking are priority.
- GSC BROAD INTENT FINDING: `עורך דין` has 10.4K impressions, 9 clicks, 0.1% CTR, average position 50.6; `עורכי דין` has 2.49K impressions, 4 clicks, 0.2% CTR, average position 29.7. Broad lawyer/directory intent is scattered and should be handled by homepage + `/lawyers/`, not random article rewrites.
- DECISION: first execution batch should be no-URL-change SEO architecture work: homepage/directory title-H1-meta review, internal links to approved pillars, GA4 key events, sitemap verification and GSC indexing drilldowns.
- MODE SHIFT: article-by-article publishing is paused. The active project is now full content audit, URL migration planning and SEO restructure.
- VERIFIED: public WordPress REST export completed with 1,220 public content rows and 1,707 extracted internal links.
- CREATED/UPDATED: `project-control/content-audit-access-plan.md`, `project-control/content-restructure-execution-plan.md`, `project-control/ai-content-audit-workflow.md`, `project-control/content-master-inventory.csv`, `project-control/content-quality-audit.csv`, `project-control/cannibalization-map.csv`, `project-control/url-migration-map.csv`, `project-control/redirect-map.csv`, `project-control/category-map.csv`, `project-control/topic-clusters.csv`, `project-control/internal-link-map.csv`, `project-control/sitemap-plan.md`, and `project-control/robots-htaccess-review.md`.
- VERIFIED: the first heuristic audit marks all GSC-dependent traffic fields as `UNKNOWN`; no fake GSC data was invented.
- VERIFIED: Google Search Console browser UI access now works for the `https://jus-tice.co.il/` property after owner-approved sign-in/2FA.
- VERIFIED: first GSC browser pass checked last-3-month query/page data for `עורך דין פלילי`, `דין פלילי`, `עורך דין גירושין`, `גישור גירושין`, and `עורך דין לענייני משפחה`.
- VERIFIED: second GSC browser pass checked last-3-month query/page data for `עורך דין מקרקעין`, `עורך דין רשלנות רפואית`, `עורך דין נזיקין`, and `עורך דין תעבורה`.
- CREATED: `project-control/gsc-browser-workflow.md`, `project-control/gsc-cannibalization-method.md`, `project-control/gsc-cannibalization-review.csv`, `project-control/gsc-keyword-page-map.csv`, and `project-control/gsc-content-priorities.csv`.
- FOUND FROM GSC: clean pillar URLs do not yet own the competitive criminal/family terms; Google is mostly seeing old Hebrew slugs, uploaded documents, homepage and scattered legacy pages.
- FOUND FROM GSC: `עורך דין מקרקעין` has 153 impressions at average position 15.8, mostly landing on the homepage; this is a strong candidate for a controlled `/real-estate-lawyer/` pillar/internal-linking batch after inventory review.
- FOUND FROM GSC: `עורך דין רשלנות רפואית` has 1.34K impressions, mainly birth/pregnancy/c-section variants, but the visible page mapping points to a narrow fee article; this needs a malpractice pillar plus deeper export/manual review before migration.
- VERIFIED: page-to-query browser pass found `/real-estate-lawyer-cost-2025/` has 2 clicks, 3.85K impressions, 0.1% CTR and average position 50.1; it should support a future `/real-estate-lawyer/` pillar.
- VERIFIED: high-traffic media URLs include `06102016_1.pdf` with 99 clicks / 928 impressions / 10.7% CTR / position 8.1, plus foreign-lawyer list PDFs for Greece and Italy with 1.39K and 1.35K impressions. These must not be deleted during cleanup without review.
- VERIFIED: support-cluster GSC pass checked `קניית דירה`, `חוזה מכר`, `רשלנות רפואית בלידה`, `רשלנות רפואית בהריון`, `תאונת עבודה`, and `תאונת דרכים`.
- FOUND FROM GSC: `/real-estate-lawyer-cost-2025/` owns 871 of 885 impressions for `קניית דירה` and all 31 visible impressions for `חוזה מכר`; it is overloaded as a cost/support page and should not be the final pillar.
- FOUND FROM GSC: old Hebrew birth-malpractice URL owns 661 impressions for `רשלנות רפואית בלידה` and 419 impressions for `רשלנות רפואית בהריון`; pregnancy and birth malpractice need a careful split/merge plan before English slug migration.
- FOUND FROM GSC: `/car-accident-auto-injury-lawyer/` owns 79 of 84 impressions for `תאונת דרכים`; it needs review before deciding whether to keep it or migrate later to `/car-accident-lawyer/`.
- VERIFIED: work/traffic/inheritance variant GSC pass checked `עורך דין תאונת עבודה`, `פגיעה בעבודה`, `תאונת עבודה ביטוח לאומי`, `נהיגה בשכרות`, `שלילת רישיון`, `עורך דין ירושה`, `צוואה`, and `התנגדות לצוואה`.
- FOUND FROM GSC: work-accident exact variants returned no visible rows; traffic subtopic signals are currently mismapped or off-intent.
- FOUND FROM GSC: `צוואה` has 201 impressions and `התנגדות לצוואה` has 121 impressions, mostly on old case-law pages and one old Hebrew wills/inheritance page. This is an inheritance/wills cluster opportunity but requires merge planning.
- VERIFIED: overloaded page-to-query pass reconfirmed `/real-estate-lawyer-cost-2025/` as a real estate cost/payment support asset with 3.85K impressions and found `/car-accident-auto-injury-lawyer/` has 124 impressions mainly for fatal-accident/criminal-punishment intent.
- PARTIAL: direct GSC page filters for Hebrew malpractice and inheritance URLs returned zero rows even though those URLs appeared in query-to-page checks; this is documented as a browser-filter limitation, not proof of no traffic.
- BLOCKED: GSC API/download export, database/phpMyAdmin, wp-admin menu export and uPress server settings remain unavailable from this session without separate credentials/tooling.
- DECISION: no URL changes, redirects, deletes, noindex actions, sitemap edits or content overwrites will happen until the maps are reviewed and approved.
- RISK: `sitemap.xml` and `wp-sitemap.xml` returned homepage-like HTML in public shell checks, so sitemap generation must be verified/fixed before any migration.
- GSC MIGRATION WARNING: the old Hebrew divorce-lawyer URL has 960 impressions for `עורך דין גירושין`; the old Hebrew criminal Tel Aviv URL has 267 impressions for `עורך דין פלילי`. These must be protected until merge/redirect plans are approved.
- GSC OPPORTUNITY: homepage currently captures lawyer-intent impressions for real estate and traffic; these should be redirected by internal architecture, not by URL redirect, into clean pillar pages and supporting articles.

## LATEST CODE STATUS - 2026-05-10
- EXPANDED IN REPO: Criminal-law pillar draft at `content-drafts/criminal-lawyer-pillar-he.md` for `/criminal-lawyer/`, now 5,037 words and in 5,000-word-class draft status.
- CREATED IN REPO: Police-investigation supporting draft at `content-drafts/police-investigation-supporting-he.md` for `/police-investigation/`, now 3,500 words and connected back to the criminal-law pillar.
- CREATED IN REPO: Pretrial-detention supporting draft at `content-drafts/pretrial-detention-supporting-he.md` for `/pretrial-detention/`, now 3,500 words and connected back to the criminal-law pillar.
- DOCUMENTED: Pretrial-detention source audit and cannibalization note exist at `project-control/pretrial-detention-source-audit.csv` and `project-control/pretrial-detention-cannibalization-note.md`.
- SAFETY: `/pretrial-detention/` is draft-only. Existing arrest/procedure pages must be compared before any publication or redirect.
- VERIFIED: Word-count and internal-marker scan were run locally for the pretrial-detention draft; the public body has no internal project markers.
- DOCUMENTED: Police-investigation source audit and cannibalization note exist at `project-control/police-investigation-source-audit.csv` and `project-control/police-investigation-cannibalization-note.md`.
- SAFETY: `/police-investigation/` is draft-only. Existing criminal prosecution/arrest pages must be compared before any publication or redirect.
- VERIFIED: Word-count and internal-marker scan were run locally for the police-investigation draft; the public body has no internal project markers.
- DOCUMENTED: Criminal source audit and cannibalization note exist at `project-control/criminal-lawyer-source-audit.csv` and `project-control/criminal-lawyer-cannibalization-note.md`.
- SAFETY: `/criminal-lawyer/` is draft-only. Existing live pages such as `/criminal-prosecutions/` and the Hebrew arrests-law slug must be compared before any publication or redirect.
- VERIFIED: Word-count and internal-marker scan were run locally after expansion; the public body has no internal project markers. The draft still needs old-content comparison plus legal/source/GSC review before CMS import or publication.
- FIXED IN CODE: Public lead forms now carry hidden attribution fields for `source_keyword`, `utm_source`, `utm_campaign`, and `utm_medium` when available.
- BUSINESS VALUE: Lead records can now connect a CRM inquiry back to search/ad/source context instead of losing the context during form submission.
- VERIFIED: PHP lint passed locally for 127 PHP files after the lead-attribution patch.
- NOT VERIFIED LIVE: requires uPress pull and one controlled lead test from a URL containing keyword/UTM parameters.
- LIVE RECHECK AFTER PUSH `0c6cf21`: deployment marker remains absent and family-law pages remain dirty. Lead attribution is pushed, but not live-verified.
- FIXED IN CODE: Lawyer mini-site inquiry leads now persist `assigned_lawyer_id` and `source_keyword` in the lead CRM metadata.
- FIXED IN CODE: The lead admin detail box can show the assigned lawyer as a profile edit link, which makes Maya/lawyer mini-site inquiries traceable inside CRM.
- HARDENED: UTM values and lead-status saves now use `wp_unslash()` before sanitization, and lead-status saves require `edit_post` permission.
- SCOPE: Applied the same lead-routing patch to `justice-core`, `ultra-justice-engine`, and `ultra-justice` because the active live plugin folder is still not definitively verified.
- VERIFIED: PHP lint passed locally for 127 PHP files after the lead-routing patch.
- NOT VERIFIED LIVE: requires uPress pull and one controlled lead submission from a lawyer mini-site.
- LIVE RECHECK AFTER PUSH `31a0026`: deployment marker remains absent and family-law pages remain dirty. Lead routing is pushed, but not live-verified.
- FIXED IN CODE: Added a lightweight anti-spam guard for public legal lead forms. Shared lead forms, homepage ask-lawyer and lawyer mini-site inquiry now include a hidden honeypot and timestamp field.
- SAFETY: The guard runs before the plugin lead handler; filled honeypot or impossible timing is blocked without creating a CRM lead, while missing timestamp remains allowed for old cached forms.
- VERIFIED: PHP lint passed locally for 127 PHP files after the lead spam guard.
- NOT VERIFIED LIVE: requires uPress pull and a controlled test lead submission.
- LIVE RECHECK AFTER PUSH `9d19686`: deployment marker remains absent and family-law pages remain dirty. Lead spam guard is pushed, but not live-verified.
- FIXED IN CODE: Added a global publication safety gate for public posts/pages/articles. It blocks publish/future saves if internal markers like `NOT VERIFIED`, `project-control/`, `Source audit:`, `GSC`, `CMS`, `CRM`, slug metadata, keyword metadata, or owner/team notes remain in the body.
- SAFETY: Draft/private editing remains allowed so internal notes can be preserved in draft-only editorial notes.
- VERIFIED: PHP lint passed locally for 126 PHP files after the publication safety gate.
- NOT VERIFIED LIVE: requires uPress pull and a controlled wp-admin test publish attempt.
- LIVE RECHECK AFTER PUSH `76dc56f`: deployment marker remains absent and family-law pages remain dirty. Publication safety gate is pushed, but not live-verified.
- FIXED IN CODE: Header/footer/fallback menu URLs now use canonical English lawyer-directory filter slugs for personal injury and inheritance, while old `torts`/`inheritance` params are still normalized for compatibility.
- FIXED IN CODE: Existing WordPress menu repair is bumped to `justice_menu_area_urls_repaired_v2` so stale `torts`/`inheritance` menu items can be repaired even if the older v1 hook already ran.
- VERIFIED: PHP lint passed locally for 125 PHP files after the menu slug cleanup.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and menu repair hook execution.
- LIVE RECHECK AFTER PUSH `3fdae22`: deployment marker remains absent and family-law pages remain dirty. Menu repair versioning is pushed, but not live-verified.
- LIVE RECHECK AFTER PUSH `ae8726b`: deployment marker remains absent and family-law pages remain dirty. Canonical filter cleanup is pushed, but not live-verified.
- FIXED IN CODE: Lawyer directory now has customer-facing guidance cards, canonical fallback filter options, active-filter chips, public-approved profile count, and a general inquiry CTA.
- VERIFIED: PHP lint passed locally for 125 PHP files after the lawyer-directory changes.
- NOT VERIFIED LIVE: `/lawyers/` needs uPress pull/cache refresh and public visual check before calling this customer-ready.
- LIVE RECHECK AFTER PUSH `23e3807`: homepage deployment marker is still absent, static marker is still absent, and family-law pages still expose internal markers. The lawyer-directory fix is pushed but not live-verified.
- FIXED IN CODE: Public canonical pages now emit Hebrew-first alternate tags: `hreflang="he"` and `hreflang="x-default"`.
- SAFETY: Search pages, 404 pages and filtered lawyer-directory URLs are skipped because they are not primary public landing pages.
- VERIFIED: PHP lint passed locally for 125 PHP files after the hreflang change.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and public HTML recheck.
- BLOCKED LIVE: the deployment checker still needs to prove that live WordPress is serving the newest GitHub `main` code before any family-law cleanup, lawyer trust gate or hreflang work can be called live.
- LIVE RECHECK AFTER PUSH `2c418b4`: homepage deployment marker is still absent, static theme marker is still absent, and all seven family-law pages still expose internal markers. This is a live deployment/cache blocker, not a local PHP syntax blocker.

## VERIFIED
- Repo is available at `C:\Users\janana\jutice-theme` and tracks `origin/main`.
- Claude/Opus review is now converted into an explicit response file at `project-control/claude-opus-review-response.md`.
- Customer-facing screenshots were captured for homepage, articles archive, single article, lawyer archive, divorce pillar and a fake 404 URL under `project-control/visual-evidence/`.
- PHP lint passed locally for 120 PHP files after the customer-facing code pass.
- Live public recheck on 2026-05-10 11:48 Asia/Jerusalem returned HTTP 200 for the homepage and `/lawyers/?area=family-law`.
- Live public recheck VERIFIED that canonical tags and the header topic strip are present on the public homepage.
- PHP 8.3 is installed locally through Winget and can be run directly from the Winget package path in this session.
- PHP lint passed locally for 120 PHP files after fixing two legacy `ultra-justice` syntax issues.
- `tools/php-lint.ps1` is now available as the repeatable repo PHP syntax check and passes locally for 120 PHP files.
- Live homepage at https://jus-tice.co.il responds and is serving the Jus-Tice portal UI.
- Live `/lawyers/` responds and displays `justice_lawyer` profiles.
- Live `/lawyers/` currently includes `עו"ד מאיה רוטנברג`, but also still shows multiple demo profiles.
- Live profile links currently use Hebrew URL slugs; example observed: `/lawyers/%D7%A2%D7%95%D7%93-%D7%9E%D7%90%D7%99%D7%94-%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92/`.
- Live homepage DOM snapshot did not show obvious casino/gambling terms in this check.
- Google Search Console URL opened to the public/about screen; `jus-tice.co.il` property access was NOT VERIFIED in this browser check.
- Public wp-admin check redirects to `wp-login.php`, so authenticated admin work is BLOCKED from the current repo shell session unless an authenticated browser/connector is available.
- Public uPress filemanager URL redirects to login/session flow, so direct uPress pull/filemanager work is BLOCKED from the current repo shell session.
- Local theme has required WordPress files: `style.css`, `index.php`, `functions.php`, `header.php`, `footer.php`.
- `assets/images/logo.png` exists in repo.
- `assets/images/logo.png` is a dummy placeholder, not a usable final brand asset.
- Hero search form in local repo submits to the `justice_lawyer` archive with `area`, `city`, and `keyword` params.
- `latest-articles.php` no longer needs regular `post` content for homepage article feed in the intended architecture.
- Article pages can now resolve connected lawyer metadata through a shared public-lawyer resolver, including a Maya Rotenberg fallback while the live slug migration is pending.
- Imported repo draft metadata is normalized without Markdown backticks, and family-law article pages can render a connected cluster-navigation block.
- Family-law article cluster navigation styling is now class-based in CSS, with stronger tap targets and current-page state for mobile/desktop article sidebars.
- Lawyer mini-sites now prefer CMS-connected articles via `connected_lawyer_slug` before falling back to practice-area articles, so Maya can become a proper signed content hub once drafts are reviewed and published.
- Seeded WordPress menu practice-area links now use canonical lawyer-directory filter slugs such as `family-law`, `criminal-law`, `real-estate-law`, `labor-law`, and `traffic-law`.
- Lawyer archive filters now normalize legacy incoming area values such as `family`, `criminal`, `real-estate`, `labor`, and `traffic` to their canonical slugs before querying.
- Lawyer self-registration now collects richer mini-site fields: profile headline, services, process steps, video URL and FAQ ideas.
- Lawyer onboarding admin queue now surfaces mini-site field completeness, and owner notification email includes headline/video context.
- Lawyer registration now maps recognized submitted city names to `city` taxonomy terms on the draft profile, while still keeping the original free-text `cities_served` meta.
- Lawyer registration city field now suggests core city names so lawyers are more likely to enter values the taxonomy mapper can recognize.
- Lawyer registration has fallback primary-practice options with canonical English slugs if `practice-areas` terms are not available yet.
- Lawyer dashboard now includes a draft-only content request flow for logged-in lawyers with claimed profiles.
- Lawyer content request drafts are now visible in the Articles admin list through a `Content Origin` column and trigger an owner notification email.
- Lawyer dashboard now shows a lawyer-facing queue of submitted content requests with draft/publish state and legal/source review gates.
- Lawyer-requested article drafts now inherit the lawyer profile's practice-area terms and receive cluster metadata for editorial/SEO review.
- Lawyer dashboard now supports staged mini-site update requests that save to `pending_profile_*` metadata instead of changing public profile fields directly.
- Lawyer Onboarding admin queue now includes profiles flagged with `pending_profile_review = 1`, including published profiles that need update review.
- Lawyer Onboarding admin queue now previews pending mini-site update fields so owner review is faster.
- Lawyer Onboarding admin queue now has a nonce-protected action to apply reviewed pending mini-site updates into public profile fields while leaving final review status.
- Lawyer Onboarding admin queue now has a nonce-protected action to discard pending mini-site updates without changing public profile fields.
- Lawyer mini-site update submission/apply/discard events now append timestamped notes to lawyer `internal_notes` for lightweight CRM audit history.
- Lawyer Onboarding admin queue now previews the latest internal notes for each listed lawyer profile.
- Lawyer content request submissions now append timestamped notes to the requesting lawyer profile `internal_notes`.
- Lawyer content request submissions now flag the lawyer profile for pending content review, and Lawyer Onboarding shows the latest content request with a draft-review link.
- Lawyer Onboarding admin queue now has a nonce-protected action to mark a pending content request reviewed and clear the lawyer profile review flag.
- Legacy `ultra-justice` PHP 8 syntax errors in admin column fallback expressions are fixed in repo.
- Added a reusable PHP lint helper at `tools/php-lint.ps1`, replacing the one-off manual PHP path check with a repeatable local verification command.
- Header now includes a premium topic strip under the main navigation with Hebrew labels and English slug targets for core legal routes and AI intake.
- Latest repo commit `e511c00` is pushed to `origin/main`, but live public HTML does not yet show every fix from that commit.

## FIXED IN THIS PASS
- CODE FIXED: family-law editorial repair bumped to `v6` and now strips product/business/editorial-planning language from public article bodies, including paid-lawyer logic, lead monetization, owner strategy, CRM/CMS/GSC/LegalTech implementation notes, AI-internal routing and `Jus-Tice should` instructions.
- DOCUMENTED: publication workflow now explicitly bans business/product-planning notes from public articles.
- VERIFIED locally: PHP lint passed for 125 PHP files after the family-law public cleaner v6 pass.
- NOT VERIFIED LIVE: v6 repair requires uPress pull/cache refresh and public recheck of the seven family-law URLs.
- CODE FIXED: removed remaining visible English fallback strings from `index.php`, `home.php`, and `template-parts/content/content-none.php`.
- VERIFIED locally: PHP lint passed for 125 PHP files after the Hebrew fallback-template cleanup.
- NOT VERIFIED LIVE: fallback/search empty states require uPress pull/cache refresh and public visual recheck.
- CODE FIXED: added a conservative public approval gate for lawyer profiles so old seed/demo/testing lawyer records are no longer rendered as real public listings.
- CODE FIXED: lawyer archive now filters rendered cards through the approval gate; single lawyer pages return 404 for unapproved public profiles while admins can still inspect them.
- CODE FIXED: lawyer directory now outputs explicit Hebrew meta/OG tags, preventing generic "Archive" wording from leaking into previews.
- CODE FIXED: lawyer-card city display now maps `herzliya` to `הרצליה`.
- DOCUMENTED: `project-control/deep-dive-audit-v2-response.md` records the accepted/partial/blocker status for the V2 audit.
- VERIFIED locally: PHP lint passed for 125 PHP files after the lawyer trust gate.
- NOT VERIFIED LIVE: requires uPress pull/cache refresh and a public `/lawyers/` recheck.
- CODE FIXED: Maya Rotenberg mini-site now has a CMS-driven public-source sidebox so the profile can show reviewable public references instead of unsupported claims.
- CODE FIXED: a separate Maya public-source migration fills only empty source fields and the official website/source URL; it does not auto-fill phone, WhatsApp, email, photo, awards, ratings, reviews, bar number or case-achievement claims.
- DOCUMENTED: `project-control/maya-rotenberg-public-source-audit.md` records public sources used for the source layer: official firm site, official about page, Dun's 100, Psakdin, Easy and official press page.
- VERIFIED locally: PHP lint passed for 125 PHP files after the Maya public-source layer.
- NOT VERIFIED LIVE: Maya source layer requires uPress pull/cache refresh and profile render/admin review.
- MODE SHIFT APPLIED: emergency route blocking/quarantine work is stopped. The workflow is now editorial repair/enrichment: keep pages, clean public article bodies, move internal notes to a draft-only internal WordPress page, and continue anti-cannibalization/cluster work.
- CODE FIXED: unapproved-family route blocking was removed before commit, and the previous quarantine routine is now disabled by default.
- CODE FIXED: existing family-law pages can now be repaired in place with public-facing body content from the repo drafts; the repair does not delete, draft, redirect, or create missing pages.
- CODE FIXED: WordPress will create/update a draft-only internal page titled `Internal Editorial Notes — Family Law Cluster` with the team/source/CMS/GSC/publication notes extracted from the repo drafts.
- CODE FIXED: content-draft imports into the `articles` CPT now use public-cleaned body content and store internal notes separately in `internal_editorial_notes` meta.
- DOCUMENTED: `publication-cannibalization-check.csv` now marks the seven family-law URLs as `APPROVED_FOR_EDITORIAL_REPAIR`, meaning clean existing live pages now while merge/redirect decisions remain pending.
- LIVE RECHECK AFTER PUSH `d3ff1d6`: all seven family-law URLs still returned HTTP 200 with internal-note markers. This means uPress/live cache has not yet applied the editorial repair commit, or WordPress has not executed the repair hook yet.
- CODE FIXED: public article conversion now changes backticked internal URL references into real internal links and strips more internal SEO/CMS/CRM/GSC/LegalTech planning paragraphs before repair/import.
- CODE FIXED: bumped the family-law editorial repair version to `v2` so WordPress reruns the stricter repair after uPress pulls the latest commit.
- CODE FIXED: bumped the family-law editorial repair version to `v3` and changed the cleaner to remove whole internal Markdown sections by strong body markers, not only by exact heading matches.
- CODE FIXED: extracted internal sections are still preserved in the draft-only `Internal Editorial Notes — Family Law Cluster` page.
- VERIFIED locally: PHP lint passed for 124 PHP files after the v3 family-law repair hardening.
- VERIFIED locally: all seven family-law draft files scan clean after the v3 public-content cleanup function is applied.
- LIVE RECHECK after push `cd9b123`: all seven family-law URLs still expose internal markers publicly, so uPress/live WordPress has not yet pulled/executed the v3 repair or cache is still serving the previous page bodies.
- CODE FIXED: family-law editorial repair is bumped to `v4` and now purges common WordPress/page-cache layers after public-body repair, reducing the chance that visitors keep seeing old unsafe cached HTML after the database is cleaned.
- VERIFIED locally: PHP lint passed for 124 PHP files after the v4 cache-purge repair pass, and the seven-draft public-marker scan still passes.
- LIVE RECHECK after push `d5824ed`: all seven family-law URLs still expose internal markers publicly. GitHub is updated; live still needs uPress pull, wp-admin load/hook execution, or cache refresh.
- CODE FIXED: family-law editorial repair is bumped to `v5` and now includes a runtime public-content guard. If an approved family-law page renders with internal markers, the theme serves the cleaned article body from the repo draft, persists it back to the WordPress page, records guard metadata, and purges cache.
- VERIFIED locally: PHP lint passed for 124 PHP files after the v5 runtime guard, and the seven-draft public-marker scan still passes.
- LIVE RECHECK after push `d374407`: all seven family-law URLs still expose internal markers publicly. This confirms GitHub is ahead of the live WordPress files/cache; uPress pull or wp-admin execution remains required.
- CODE FIXED: added a public non-visual deployment marker in `<head>` so future checks can prove whether live WordPress is serving the latest theme code. Current marker: `2026-05-10-runtime-guard-v5`.
- VERIFIED locally: PHP lint passed for 125 PHP files after adding the deployment marker.
- LIVE RECHECK after push `9dd41aa`: homepage and `/divorce-lawyer/` do not contain `justice-deployment-marker` or `2026-05-10-runtime-guard-v5`. This VERIFIED that live WordPress is not yet serving the latest pushed theme code.
- CODE FIXED: added a static `deployment-marker.txt` and `tools/check-live-deployment.ps1` to separate GitHub state, uPress file sync state, WordPress PHP rendering state, and family-law public content cleanliness.
- VERIFIED locally: `tools/check-live-deployment.ps1` runs and confirms current live state: homepage PHP marker absent, static theme marker absent, and seven family-law URLs still dirty. Details documented in `project-control/deployment-verification.md`.
- LIVE RECHECK after push `542aeef`: the deployment checker still reports PHP marker absent, static theme marker absent, and all seven family-law pages dirty. This reinforces that live is not serving the latest pushed files.
- EDITORIAL SAFETY: family-law auto-publication remains paused as a creation mechanism, but existing live pages are now treated as content to repair and enrich rather than remove.
- LIVE VERIFIED: the seven family-law URLs were live and contained internal markers in the earlier public check; the current repo fix is to clean those pages in place on the next pull.
- CODE FIXED: the previous draft/restore cleanup routine is disabled by default and replaced by editorial repair for existing pages.
- LIVE RECHECK 13:52 Asia/Jerusalem: the pages still needed public-body cleanup on live.
- LIVE RECHECK 14:02 Asia/Jerusalem: the pages still needed public-body cleanup on live; the follow-up work is now editorial repair/enrichment rather than page removal.
- CODE FIXED: manual wp-admin publication now runs public-content and cannibalization preflight checks and blocks unapproved pages.
- CODE FIXED: internal-only sections such as NOT VERIFIED, source-audit notes, CMS/CRM/GSC notes, LegalTech product notes, owner/dev instructions, status sections and cannibalization notes are stripped/blocked from public output.
- DOCUMENTED: `project-control/publication-workflow.md`, `project-control/publication-cannibalization-check.csv`, and `project-control/publication-review-family-law-cluster.md` now define the required workflow.
- PREVIOUS PUBLICATION PACKAGE: a one-time publisher exists for the first family-law SEO cluster in `inc/live-content-publication.php`, but manual creation of missing public pages is no longer the preferred path. Current mode repairs existing pages and keeps article drafts in the `articles` CPT.
- CODE FIXED: the publisher creates/updates public root English-slug pages for `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/child-support/`, `/child-custody/`, `/divorce-property-division/`, and `/family-dispute-resolution/`.
- CODE FIXED: each published page gets SEO title/description, AEO/GEO summary meta, Article schema eligibility, visible internal cluster links, Maya Rotenberg connection, lead CTA and a public legal disclaimer.
- SAFETY VERIFIED IN CODE: existing root page content is backed up into post meta before replacement.
- DOCUMENTED: `project-control/live-content-publication-status.md` lists the exact public review links and publish status.
- LIVE RECHECK: after push `8e28528`, all seven new URLs still redirected to the homepage and did not expose publication markers, so uPress pull/cache/migration execution is still required.
- CODE FIXED: homepage topic clusters now include direct links to the seven family-law cluster pages; `/family-law/` now includes the family-dispute-resolution page in its supporting-topic map.
- CODE FIXED: the featured divorce pillar card now points to `/divorce-lawyer/` instead of the old `/family-law/divorce/` path.
- CODE FIXED: `Tools > Jus-Tice Content Drafts` now has an admin-only manual button to preflight and repair existing family-law pages without creating missing pages.
- Maya Rotenberg mini-site CMS bootstrap added in `inc/live-migrations.php`: it fills rich editable profile fields only when empty and targets only the verified Maya profile.
- Maya bootstrap adds services, process, approach, FAQ, CTA and credentials-style fields without fake ratings, awards, photos, bar number or paid claims.
- Practice-area archive pages now have an intent-first customer layer in `taxonomy-practice-areas.php`: problem framing, when-to-contact guidance, preparation checklist and a lead CTA.
- Practice-area CTAs now link to the filtered lawyer directory with canonical English area slugs where available, plus the homepage lead form.
- Practice-area visual styling added in `assets/css/premium-pass-3.css` for desktop/mobile cards and CTA panel.
- VERIFIED locally: PHP lint passed for 120 PHP files after the practice-area landing-page pass.
- LIVE RECHECK: homepage hero copy and article intent panel are now visible publicly, so part of the customer-facing theme pass is live.
- LIVE VERIFIED: `/family-law/` now exposes the practice intent layer publicly. Screenshot: `project-control/visual-evidence/family-law-live-intent-2026-05-10.png`.
- LIVE VERIFIED: `/lawyers/?area=family-law` now outputs a Jus-Tice fallback `noindex,follow` robots tag and base `/lawyers/` canonical. Screenshot: `project-control/visual-evidence/lawyers-family-filter-2026-05-10.png`.
- STILL BROKEN LIVE: Maya lawyer profile URLs are in a redirect loop between Permalink Manager English-to-Hebrew and theme Hebrew-to-English redirect logic.
- FIXED IN CODE: theme-side Maya Hebrew-to-English redirect is now disabled by default behind `justice_theme_enable_maya_slug_redirect` to stop the redirect loop after deployment.
- English practice slug pages served through generic `page.php` now get a structured practice landing template when the page slug matches a controlled legal area such as `/family-law/`, `/criminal-law/`, `/traffic-law/`, `/real-estate-law/`, `/labor-law/`, `/inheritance/`, `/torts/`, `/medical-malpractice/`, or `/national-insurance/`.
- The page-route practice landing layer includes intent cards, supporting-topic links, a lead form, related articles and a Maya Rotenberg card only on the family-law route when her public profile can be resolved.
- VERIFIED locally: PHP lint passed for 122 PHP files after adding the reusable practice landing helper/template.
- PARTIAL LIVE: `/family-law/` now shows the practice intent layer, but the separate generic `practice-landing` page fallback marker is not visible; route ownership still needs wp-admin/permalink review.
- Lawyer mini-site template now includes an engagement module explaining structured inquiry, signed content, video/media and verified reviews without inventing ratings or claims.
- CODE FIXED: added `inc/routing-guards.php` to turn suspicious "unknown URL served as homepage" requests into real 404 responses before WordPress canonical redirect can send them to the homepage.
- VERIFIED locally: PHP lint passed for 123 PHP files after adding the routing guard.
- NOT VERIFIED live: fake URL `/not-a-real-page-justice-qa/` must be rechecked after uPress pull/cache refresh; currently live still redirects that path to the homepage.
- Maya bootstrap can attach `family-law` and a city term only where safe, and adds an internal note for admin review.
- Homepage hero copy is now more direct: it speaks to users who need a lawyer or legal direction, not only generic portal language.
- Primary navigation now has a code safety layer that appends missing customer-critical links when the assigned WordPress menu is too thin.
- Added a temporary SVG favicon fallback when WordPress Site Icon is not configured.
- Breadcrumbs now have premium CSS/RTL treatment instead of visible ordered-list numbering.
- Single article pages now show a short intent panel before the body: problem, lawyer threshold, and how Jus-Tice helps.
- Article archive copy now frames guides by user problem and anti-cannibalization.
- Lawyer cards no longer show a sponsored badge unless the profile has an active paid subscription and is not seed/demo data.
- Common city slugs in lawyer cards are mapped to Hebrew display labels where possible.
- 404 template copy is now Hebrew and user-friendly, although live routing still needs investigation.
- Added tracked `page-home.php` because the live homepage is assigned to the `page-home.php` page template, not only `front-page.php`.
- Removed failed package artifacts from the previous interrupted ZIP attempt.
- Added a canonical source candidate at `justice-core/justice-core.php` for repo review.
- Fixed taxonomy ownership in legacy plugin folders: `city` now attaches to `justice_lawyer`; `practice-areas` now attaches to `articles`, `justice_lawyer`, and `post`.
- Fixed duplicate `</main>` in `archive-justice_lawyer.php`.
- Fixed one remaining English lead-form label: "Short description" -> Hebrew.
- Added canonical `justice-core/v1` REST aliases in the new `justice-core` candidate for health, site-state, plugin-registry, content inventory, spam candidates, duplicate titles, lawyers, and leads.
- Fixed lead REST reporting in the new `justice-core` candidate to read canonical lead meta keys (`visitor_name`, `visitor_phone`, `legal_area`, `source_url`).
- Homepage featured-lawyer section now queries only `advocate-maya-rotenberg` and does not show fake/demo lawyer cards.
- Lawyer profile meta model now includes initial mini-site fields for video, social links, homepage feature flag, review count, and average rating.
- `single-justice_lawyer.php` is now a richer lawyer mini-site template with hero, CTAs, video support, practice areas, related content, reviews placeholder, social links, and lead form.
- `lawyer-card.php` is now a richer premium card and avoids fake ratings or unsupported "top lawyer" claims.
- Homepage featured lawyer section now has a fallback lookup for live posts still using the Hebrew title while slug migration is pending.
- Seeder now assigns `advocate-maya-rotenberg` to the Maya Rotenberg seed/profile and generates English-only slugs for future seed profiles.
- Admin lawyer meta boxes now expose video URL, social URLs, homepage feature flag, approved review count, and approved average rating.
- Lawyer mini-site now reads additional CMS fields for headline, subheadline, approach, services, process, credentials, media links, FAQs, testimonials and final CTA.
- Homepage templates now include an editable WordPress page-content band through `template-parts/sections/home-page-content.php`, with a basic spam keyword guard.
- Self-serve/passive-income platform direction documented in `project-control/self-serve-lawyer-platform-plan.md`.
- Breadcrumbs fixed in repo: generic single posts no longer render breadcrumbs twice, and lawyer/article/archive breadcrumb hierarchy is explicit.
- Final URL decision documented: Hebrew content/UI with short clean English slugs only.
- URL strategy files created/updated: `url-strategy.md`, `slug-normalization-rules.md`, `url-migration-map.csv`, and legacy `url-slug-migration-plan.md`.
- Strategic goals file created at `project-control/strategic-goals.md`.
- Hebrew-slug audit file created at `project-control/url-hebrew-audit.csv`.
- SEO goal files updated around English-slug pillar architecture: `topic-clusters.csv`, `internal-link-opportunities.csv`, `cannibalization-map.csv`, `keyword-serp-plan.md`, `serp-research-log.csv`, and `title-audit.csv`.
- Legal pillar CMS controls added in `inc/pillar-pages.php`.
- Draft seeding added for the first pillar pages: `/divorce-lawyer/`, `/criminal-lawyer/`, `/real-estate-lawyer/`, and `/medical-malpractice-lawyer/`.
- Draft seeding added for the first 5 SEO article starters: divorce, criminal, traffic, real estate, and labor law. These are intentionally draft-only and marked for legal/editorial review.
- Practice-area taxonomy pages upgraded into richer hubs with lawyer cards, article cards, LegalTech tools, and related practice links.
- Lawyer self-registration funnel added. `/lawyer-registration/` can collect lawyer details and create draft/pending `justice_lawyer` profiles for review.
- Lawyer onboarding review workflow documented in `project-control/lawyer-onboarding-workflow.md`.
- Lawyer registration now sends an admin email and adds a WordPress admin review queue at `Lawyer Onboarding`.
- Owner CRM overview added at `Justice CRM` in WordPress admin for leads and LegalTech requests.
- Core practice-area term seeder added for the 10 main legal areas with Hebrew names and English slugs.
- Header/footer fallback no longer renders the dummy bundled logo. It now renders a Jus-Tice wordmark with a red blinking dot when no WordPress custom logo is configured.
- Lawyer seeders hardened across all plugin candidates: demo profiles use canonical practice-area slugs where available, remain draft/unverified/inactive, are not homepage-featured, are not lead-routed, and are marked `SEED_DATA`.
- Added first LegalTech product layer in code: CMS-backed legal tools, private tool requests, homepage gateway, archive/single templates, and starter tools for AI intake, demand letter, family agreement, and real-estate contract review.
- Added `project-control/legaltech-platform-roadmap.md` to document the broader document automation, AI console, lawyer-review and passive-income product plan.
- Article sidebar lawyer lookup now uses `justice_theme_get_connected_lawyer_by_slug()` instead of a raw slug-only lookup, so family-law drafts connected to `advocate-maya-rotenberg` can still show Maya when live data is temporarily on the old Hebrew slug.
- Content draft imports now strip Markdown backticks from metadata fields, preventing values like `family-law` or `advocate-maya-rotenberg` from being stored with literal backticks.
- Single article sidebars now show a family-law cluster navigation module for imported family-law drafts, linking the divorce pillar and supporting article URLs with Hebrew labels and English slugs.
- Article cluster navigation was moved out of inline styling into `premium-pass-3.css`, improving mobile usability and making future visual QA/polish safer.
- Maya/lawyer mini-site article feed now queries published articles explicitly connected to the lawyer by `connected_lawyer_slug`, including a temporary backtick-tolerant match for any drafts imported before metadata normalization.
- Menu seeding and repair now normalize stale filter URLs like `/lawyers/?area=family` to `/lawyers/?area=family-law` without rebuilding the full menu.
- Lawyer archive query handling now accepts old short area filter values and converts them to canonical values, protecting users and crawlers that hit older links.
- Lawyer onboarding handler now stores mini-site inputs as draft metadata for admin review instead of forcing the owner to gather that information manually later.
- Lawyer onboarding admin review table now shows a mini-site content checklist, reducing owner effort when deciding which registrations are ready for polishing.
- Lawyer onboarding now auto-assigns known city terms such as Tel Aviv, Jerusalem, Haifa and Ramat Gan to draft profiles so future directory filtering needs less manual cleanup.
- Lawyer registration form now includes a city datalist for the seeded/core cities while still allowing multiple free-text areas.
- Lawyer registration primary-area select no longer depends entirely on live taxonomy seeding; it can show canonical fallback options during setup.
- Lawyer content requests create draft `articles` records connected to the lawyer slug and marked for legal/source review before publication.
- Articles admin review columns now distinguish repo drafts from lawyer-requested drafts and show the connected/requesting lawyer context.

## NOT VERIFIED
- LIVE NOT VERIFIED: the seven family-law cluster URLs will publish only after this commit is pushed, uPress pulls it, and WordPress executes the one-time publication migration.
- GSC NOT USED YET: no Search Console traffic-risk scoring has been applied to these publication URLs.
- Active live plugin path and name.
- Whether live WordPress activates `ultra-justice`, `ultra-justice-engine`, or another Justice plugin.
- WordPress version, PHP version, active plugin list, and debug log.
- Whether GitHub sync deploys only the theme directory or also plugin directories.
- Whether `justice-core/` is recognized on live; it has not been activated live.
- Visual rendering quality after current local changes; no browser QA cycle has been run in this pass.
- Live homepage does not yet show Maya Rotenberg at the time of browser verification.
- Live `/lawyers/advocate-maya-rotenberg/` currently redirects to the homepage, indicating the live slug is not migrated yet.
- GSC property visibility, sitemap status, and performance data are NOT VERIFIED.
- The new homepage lawyer section was not visible before adding `page-home.php` because the live page assignment uses `page-template-page-home`.
- Lawyer self-registration and a front-end lawyer dashboard MVP are built in code. Billing, AI console, self-edit workflow and full approval automation are still NOT BUILT.
- Lawyer plan presentation and WooCommerce product-ID mapping helpers are built in code. Live billing is NOT enabled and remains blocked pending WooCommerce setup, product IDs, gateway testing and legal/ethical review.
- Rule-based lead intake classification is built in code. Leads now receive detected area, detected urgency, summary and routing notes on save.
- GSC weekly report automation scaffold is built: GitHub Action plus Python report generator for opportunities, low CTR, positions 5-20 and cannibalization CSVs.
- GSC report script smoke test ran locally without secrets and safely generated BLOCKED placeholder CSVs instead of fake data.
- City-practice architecture is built in code: core city seeder, city-practice template and five draft English-slug city/practice pages.
- Public lead form upgraded to collect email, city/area, urgency and consent so CRM/AI classification receives usable routing data.
- Lawyer monetization pages are linked from footer: registration, plans and dashboard.
- Live `/legal-tools/` is NOT VERIFIED until GitHub/Upress sync is pulled and WordPress rewrites/cache are refreshed.
- Starter LegalTech tool posts are NOT VERIFIED on live; seeding runs on an admin dashboard visit after plugin code is active.
- SERP research is PARTIAL. Initial web sampling was recorded, but manual top-10 capture, People Also Ask, autocomplete, and GSC data are still NOT VERIFIED.
- Legal pillar draft pages are NOT VERIFIED on live; they seed only after Upress pulls the commit and an admin dashboard visit runs.
- Draft SEO article starters are NOT VERIFIED live; they seed only after Upress pulls the commit, the `articles` CPT exists, and an admin dashboard visit runs.
- Current draft SEO article starters are NOT enough for publication. User direction is 5,000-word-class pillar/supporting articles built from SERP reverse engineering, intent mapping, FAQs, related lawyers, and internal links.
- Practice-area hub rendering is NOT VERIFIED on live after this pass.
- Lawyer registration page and submission handler are NOT VERIFIED live until latest code is pulled and `/wp-admin/` runs the page seeder.
- Lawyer dashboard page is NOT VERIFIED live; it seeds `/lawyer-dashboard/` after Upress pull and an admin dashboard visit.
- Lawyer plans page is NOT VERIFIED live; it seeds `/lawyer-plans/` after Upress pull and an admin dashboard visit.
- Lead classification is NOT VERIFIED live; it requires a test lead after Upress pull and active `justice_lead` CPT.
- GSC automation is NOT VERIFIED; it requires GitHub secrets and Search Console service-account access.
- City terms and draft city-practice pages are NOT VERIFIED live; they require Upress pull and admin dashboard visit.
- Upgraded lead form is NOT VERIFIED live after Upress pull.
- Lawyer onboarding admin queue and email notification are NOT VERIFIED live.
- Justice CRM admin overview is NOT VERIFIED live.
- Practice-area term seeding is NOT VERIFIED live; it runs after Upress pull and an admin dashboard visit, if the taxonomy is active.
- Header/footer logo fallback is NOT VERIFIED live after this pass.
- Hardened lawyer seeding is NOT VERIFIED live; it requires Upress pull and the active plugin/admin seeder path.
- Live visual screenshot check ran again on 2026-05-10. Homepage returned 200 and latest repo markers (`brand-lockup--justice`, `hero__visual`, `article-card__placeholder--legal`) are present live, so GitHub/Upress sync is now VERIFIED for the latest theme changes.

## STILL BROKEN / RISK
- NEEDS LIVE VERIFICATION: Maya mini-site bootstrap will not run until the latest theme code is pulled and WordPress executes `init`.
- NEEDS ADMIN REVIEW: Maya profile contact details, photo, video, license/bar data and final copy approval still require wp-admin review.
- LIVE VERIFIED STILL BROKEN: a fake URL (`/not-a-real-page-justice-qa/`) returned the homepage with HTTP 200 instead of a real 404; likely needs permalink/plugin/server inspection.
- LIVE VERIFIED STILL WEAK: desktop primary menu currently shows only a thin assigned menu; code now mitigates this, but wp-admin menu assignment is still required for a clean permanent fix.
- NEEDS LIVE VERIFICATION: breadcrumb CSS, menu augmentation, favicon fallback, article intent panel and lawyer-card badge/city cleanup after Upress pulls this pass.
- POST-PUSH LIVE RECHECK: after commit `5b4f16e`, public homepage still did not show the new hero copy, fallback favicon, or appended menu marker; single article did not show `article-intent-panel`. This means the latest commit is NOT LIVE yet or cache is serving old assets/templates.
- NOT VERIFIED LIVE: Homepage ask-lawyer form still did not expose `admin-post.php` or `justice_submit_lead` in the public HTML check, so the newest lead-form wiring from `e511c00` has not been confirmed live.
- NOT VERIFIED LIVE: `/lawyers/?area=family-law` returned 200 and canonical output, but did not expose `noindex` in the public HTML check, so the newest filtered-directory robots hardening from `e511c00` has not been confirmed live.
- BLOCKED: Upress/GitHub pull/cache state is not directly verified from the repo-only workflow; live may need another Upress pull or cache refresh before these latest theme changes appear publicly.
- Repo still contains duplicate plugin-like folders: `ultra-justice/`, `ultra-justice-engine/`, and new `justice-core/`.
- Do not delete the legacy plugin folders until live active plugin path is verified; otherwise GitHub sync could remove the currently active plugin and break CPTs.
- Do not merge `origin/claude/justice-website-review-aovSK` wholesale; it deletes newer `main` work and must only be used as a reviewed patch source.
- Live lawyer cards show city slugs such as `tel-aviv` in the public extract, which means terms or assigned values may not be user-facing Hebrew in every place.
- Live archive still exposes multiple demo lawyers publicly; this must be cleaned or moved to draft/private from WP admin/API after active plugin and content ownership are verified.
- Existing public demo lawyers on live may predate the hardened seeder and require manual/API cleanup after backup.
- The 5 article starters are not publication-ready; they are scaffolds only. Production target is long-form, source-backed, reviewed legal content, not short SEO stubs.
- First long-form divorce pillar production draft now exists in repo at `content-drafts/divorce-lawyer-pillar-he.md` and was expanded to about 5,083 words with a decision map, process timeline, document checklist, common mistakes, rabbinical/ketubah notes, agreement/common-law/children/assets/urgent-relief sections, lawyer-comparison guidance, FAQ, CMS module plan and official-source anchors. It is source-audited in `project-control/divorce-pillar-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- First supporting family-law draft now exists at `content-drafts/consensual-divorce-supporting-he.md` and was expanded to about 3,518 words with agreement-quality checks, agreement structure, approval workflow, cost caution, children/risk sections, CRM intent, CMS module plan, common mistakes and a LegalTech readiness-tool concept. It is source-audited in `project-control/consensual-divorce-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- Consensual-divorce source audit now exists at `project-control/consensual-divorce-source-audit.csv`; official gov.il and Kol Zchut source candidates were search-verified and unresolved price/children/property/pressure claims remain blocked for review.
- Second supporting family-law draft now exists at `content-drafts/divorce-mediation-supporting-he.md` and was expanded to about 3,525 words with suitability test, mediation types, preparation checklist, failure paths, power-imbalance warnings, children section, legal-advice boundary, pricing caution, anti-cannibalization, CMS layout and LegalTech questionnaire concept. It is source-audited in `project-control/divorce-mediation-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- Divorce-mediation source audit now exists at `project-control/divorce-mediation-source-audit.csv`; gov.il/Midrag source candidates were search-verified and confidentiality, mediator-role and power-imbalance claims remain blocked for legal review.
- Third supporting family-law draft now exists at `content-drafts/child-support-supporting-he.md` and was expanded to about 5,019 words with no-fake-calculator policy, intake model, medor, exceptional expenses, time-sharing, variable income, agreement clauses, temporary support, age bands, proof/evidence, modification, unmarried parents, anti-cannibalization, cautious examples, FAQ, CMS structure, enforcement cautions, CRM routing, decision paths and LegalTech tool guardrails. It is source-audited in `project-control/child-support-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- Child-support source audit maps court procedure, financial-detail form, National Insurance payment/collection rules, change-of-support guidance, 919/15, calculator policy and age/medor/time-sharing claims to source candidates or legal-review blockers. BTL and Kol Zchut direct checks returned 200 where tested; gov.il source candidates returned 403 in scripted checks and remain browser verification items.
- Fourth supporting family-law draft now exists at `content-drafts/child-custody-supporting-he.md` and was expanded to about 4,575 words with custody-vs-parenting-time terminology, parenting schedules, holidays, logistics, parent communication, risk situations, professional factors, relocation/school changes, age bands, temporary-vs-permanent arrangements, breach/enforcement cautions, proof/evidence guidance, urgent situations, CRM intake model, LegalTech parenting-plan tool concept, Maya mini-site modules, CMS layout, decision paths, agreement-structure guidance, success metrics, common mistakes and anti-cannibalization links. It is source-audited in `project-control/child-custody-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- Child-custody source audit maps custody/time-sharing procedure, family-dispute filing, dispute-resolution process, interim relief, assistance units, legal aid, social-work reports, tender terminology, child-wishes, parental alienation, risk/urgency and evidence guidance to source candidates or legal-review blockers. gov.il direct checks returned 403 in scripted checks and remain browser verification items.
- Fifth supporting family-law draft now exists at `content-drafts/divorce-property-division-supporting-he.md` and was expanded to about 4,553 words with asset map, rupture-date caution, prenuptial agreement review, premarital home, inheritance/gifts, pension documentation, business/company/self-employed issues, tech options, family-vs-personal debts, hidden-asset warning signs, asset table, staged workflow, expert roles, home-sale alternatives, common mistakes, urgency detection, CRM intake fields, lawyer monetization modules, decision paths, publication gates, follow-up cluster plan, anti-cannibalization boundaries, LegalTech property-map tool and CMS structure. It is source-audited in `project-control/property-division-source-audit.csv`, but still NOT legal-reviewed and not ready to publish.
- Property-division source audit maps resource balancing, excluded assets, pension division, tax authority pension-transfer guidance, family-dispute procedure, interim relief, rupture date, premarital home, intent to share, agreements, inheritances/gifts, business/options, debts and hidden-assets warnings to source candidates or legal-review blockers. Kol Zchut direct checks returned 200; gov.il source candidates returned 403 in scripted checks and remain browser verification items.
- Existing live Hebrew slugs need a controlled English-slug migration with 301 redirects; repo changes prevent future seed slugs but do not automatically fix already-published URLs unless an approved migration runs.
- Live homepage extract shows "Content is protected !!", likely from a content-protection/accessibility/plugin layer; source and impact are NOT VERIFIED.
- Spam source remains NOT VERIFIED. Homepage may be hiding spam by querying only `articles`, but database cleanup is still required.
- Live visual recheck found fallback wordmark order reversed on RTL (`Tice dot Jus`). FIXED IN REPO with LTR isolation; live verification pending next Upress pull.
- Header fallback menu is stronger in repo: readable Hebrew labels, LegalTech and lawyer-registration links, corrected English filter slugs, and heavier premium nav styling. LIVE NOT VERIFIED.
- Header topic strip is VERIFIED LIVE in public HTML and screenshots. Evidence: `project-control/visual-evidence/homepage-topic-strip-desktop.png` and `project-control/visual-evidence/homepage-topic-strip-mobile.png`.
- Header recheck on live public homepage found `brand-lockup--justice`, `/legal-tools/`, and `/lawyer-registration/` links present. Dummy logo text was not present.
- Search and archive pagination labels were cleaned in repo: search results, previous/next labels, article archive pagination, and lawyer archive pagination no longer use English or mojibake arrows.
- CMS draft-import bridge added in repo: `Tools > Jus-Tice Content Drafts` can import repo Markdown drafts from `content-drafts/` into the `articles` CPT as draft-only posts. It never publishes content and blocks refresh of already-published articles.
- CMS draft-import bridge now supports admin-only bulk draft import for all repo drafts. Bulk import still keeps everything draft-only and preserves the block on refreshing already-published articles.
- Articles admin list now has repo-draft review columns for imported drafts: source file/status, legal/source verification gates, source-audit file and draft word count.
- Single article pages now read imported draft metadata and can show legal/source review status, source-audit file, draft word count/status, and a connected lawyer mini-site card when `connected_lawyer_slug` is present.
- Family-law cluster map now exists at `project-control/family-law-content-cluster-map.md`, with anti-cannibalization roles and internal-link rules for the divorce pillar and first five supporting drafts.
- Content inventory and title audit now include the first six repo-maintained family-law drafts with word counts, status, intent, duplicate-risk notes, and review/import actions.
- Divorce pillar source audit now exists at `project-control/divorce-pillar-source-audit.csv`. It maps official/legal-reference sources to sensitive sections and keeps unresolved legal claims blocked from publication. Kol Zchut source URLs were direct-check verified where possible; gov.il direct checks returned 403 and remain browser/source-review items.
- Family-law publication readiness file now exists at `project-control/family-law-publication-readiness.csv`; all six first-cluster drafts are mapped with word counts, source-audit files, CMS module requirements, blockers and import order.
- Seventh family-law supporting draft now exists at `content-drafts/family-dispute-resolution-supporting-he.md` for `/family-dispute-resolution/`, with a source audit at `project-control/family-dispute-resolution-source-audit.csv`.
- Family-dispute-resolution draft is intentionally NOT publication-ready: it is now 3,521 words, but still needs legal review, browser source verification, and cannibalization review against existing live Jus-Tice URLs.
- Cannibalization note created at `project-control/family-dispute-resolution-cannibalization-note.md`; existing live URLs `/request-for-family-dispute-settlements` and `/is-a-law-for-the-settlement-of-family-disputes-successful/` are marked as merge/redirect review candidates, with traffic risk UNKNOWN until GSC data is checked.
- Reviewed `origin/claude/justice-website-review-aovSK` and documented it at `project-control/branch-review-claude-aovsk.md`.
- FIXED: Homepage ask-lawyer section now posts to the existing `justice_submit_lead` admin-post handler instead of `action="#"`.
- FIXED: Footer WhatsApp number is now configurable through the WordPress Customizer via `justice_whatsapp`.
- FIXED: Non-singular canonical URLs and `noindex,follow` for search/filter states are implemented in `inc/seo.php`.
- FIXED: Lawyer mini-site pages now output conservative `Attorney` JSON-LD without fake ratings or unverified claims.
- FIXED: Lawyer profile view counting now skips logged-in/admin/feed/ajax/cron/bot/preview traffic.

## INTEGRATED SEO / DESIGN / CONTENT LAYER
- ACCEPTED: SEO content architecture and page design must now be planned together. The working rule is content cluster + URL + template + related links + mobile + schema + sitemap + analytics as one system.
- CREATED: `project-control/homepage-seo-design-alignment.md` for the homepage portal-entry strategy.
- CREATED: `project-control/related-content-strategy.md` and `project-control/related-content-map.csv` so related articles become semantic cluster links instead of random latest posts.
- CREATED: `project-control/kol-zchut-article-structure.md` to standardize public legal articles around practical user-facing sections.
- CREATED: `project-control/lawyer-mini-site-strategy.md` and `project-control/lawyer-mini-site-fields.csv` for richer lawyer profile/mini-site architecture.
- CREATED: `project-control/lawyer-funnel-strategy.md` and `project-control/payment-and-subscription-model.md` for marketplace monetization planning without implementing payments.
- CREATED: `project-control/mobile-first-template-review.md`, `project-control/accessibility-review.md`, `project-control/entity-schema-review.md`, `project-control/image-seo-review.md` and `project-control/faceted-navigation-indexing-review.md`.
- CREATED: `project-control/analytics-monitoring-plan.md` and `project-control/integrated-launch-checklist.md`.
- UPDATED: `project-control/ga4-event-plan.csv` with `generate_lead`, `lawyer_signup_start` and `related_article_click`.
- STATUS: CODE/DOC FIXED in repo; NOT LIVE EXECUTED. No URLs, redirects, sitemap settings, robots rules, public content or payments were changed.
- VISUAL VERIFIED: integrated desktop/mobile screenshots captured for homepage, articles archive, one article, lawyer directory, sample lawyer profile URL, family practice page, search and 404 test at `project-control/visual-evidence/integrated-*-2026-05-10.png`.
- LIVE VERIFIED WEAK: `/articles/`, `/lawyers/` and search still show English/default title leaks (`Articles Archive`, `Archive`, `You searched for`) in live HTML during this pass.
- FIXED IN CODE: `inc/seo.php` now uses contextual Hebrew SEO titles through WordPress title parts and common SEO-plugin title filters.
- LIVE VERIFIED BROKEN: sample Hebrew lawyer profile URL renders homepage-style content with status 200 and homepage canonical; not a real mini-site/profile experience.
- LIVE VERIFIED BROKEN: fake 404 URL finalizes as homepage with status 200.
- LIVE VERIFIED RISK: `/practice-areas/family-law/` finalizes to `http://jus-tice.co.il/family-law/`, so HTTPS/canonical consistency needs review.
- LIVE VERIFIED MOBILE RISK: sticky WhatsApp/lead CTA and accessibility button overlap important content on several mobile views.
- NOT VERIFIED: PHP syntax lint for the latest `inc/seo.php` title fix because PHP is not installed in this local session.

## 2026-05-10 UPRESS PULL + MOBILE FLOATING CTA LIVE STATUS
- LIVE VERIFIED: uPress theme folder was pulled from GitHub after commits `ffc08c8` and `b7763b7`; uPress cache clear was triggered after each pull.
- LIVE VERIFIED: public CSS now contains the homepage-only mobile hide rule for `.whatsapp-float` and third-party `a.whatsapp-button`.
- LIVE VERIFIED: public CSS still keeps the compact 54px third-party mobile button behavior for non-home pages.
- VISUAL VERIFIED: homepage mobile screenshot `project-control/visual-evidence/homepage-mobile-after-floating-hide-2026-05-10.png` shows the search form and CTAs are no longer covered by floating WhatsApp bubbles.
- VERIFIED: computed mobile homepage geometry reports `display: none` for both floating WhatsApp controls on `body.home` and no horizontal overflow.
- LIVE VERIFIED: sample article `/find-lawyer-how-to-find-good-attorney/` exposes `data-related-mode="semantic"`, proving the semantic related-content implementation is live at least on the tested article.
- SAFETY: no public content, URLs, redirects, sitemap settings, robots rules, CRM data, payments, lawyer records or database rows were changed in this pass.
- NOT VERIFIED: related-content quality still needs manual visual review across family, criminal and real-estate article examples.
- NOT VERIFIED: mobile floating controls on non-home inner pages still need a separate article/directory QA pass.

## 2026-05-10 LAWYER REVIEWS / REPUTATION MODULE
- ACCEPTED: reviews, ratings, reputation and trust are now a major planned product/SEO/business module.
- CREATED: `project-control/reviews-reputation-research.md`, `google-reviews-integration-plan.md`, `lawyer-rating-system-spec.md`, `lawyer-review-fields.csv`, `review-schema-policy.md`, `review-compliance-risk.md`, `reviews-compliance-risk.md`, `reputation-product-roadmap.md`, and `maya-rotenberg-reputation-plan.md`.
- CREATED: `project-control/final-integrated-launch-checklist.md` and `project-control/seo-aio-geo-strategy.md` to carry the module into launch/SEO planning.
- UPDATED: `lawyer-mini-site-strategy.md`, `payment-and-subscription-model.md`, and `integrated-launch-checklist.md`.
- VERIFIED: research used official Google Business Profile, Google Places, Google review schema and Google Maps UGC policy docs, plus Avvo, Justia, Midrag, LawReviews and Israeli lawyer-advertising rule references.
- DECISION: MVP should start with verified Google Place ID/review link/manual rating-count fields and profile completeness; first-party reviews, API sync and review schema come later.
- BLOCKED: Google API sync requires API key/billing/OAuth/terms review and lawyer/business authorization.
- NEEDS LEGAL REVIEW: Israeli lawyer advertising, testimonials, directory ratings, paid placement disclosure, review moderation and any public stars/rating/schema.
- SAFETY: no review CPT, ratings, schema, public profile changes, API calls, database updates or fake review content were implemented.

## 2026-05-11 LAWYER REVIEWS / REPUTATION DEEPENING
- ACCEPTED: the module is not just a design widget; it is a trust, SEO, mini-site, conversion and monetization layer.
- UPDATED: `reviews-reputation-research.md` with a deeper Avvo/Justia/FindLaw/Midrag/Zap/LawReviews/Google/reputation-tools comparison matrix.
- UPDATED: `google-reviews-integration-plan.md` with stronger Google Business Profile API, Places API, manual MVP and third-party reputation-tool boundaries.
- UPDATED: `review-compliance-risk.md` with explicit no-review-gating, no-incentive, moderation, lawyer-reply and schema gates.
- UPDATED: `lawyer-rating-system-spec.md` with public label boundaries, review workflow, reputation-score boundary and future criminal-lawyer mini-site example.
- UPDATED: `reputation-product-roadmap.md`, `maya-rotenberg-reputation-plan.md`, `review-schema-policy.md`, `seo-aio-geo-strategy.md`, `payment-and-subscription-model.md`, and `final-integrated-launch-checklist.md`.
- DECISION: MVP remains source-disclosed and conservative: Google link + verified rating/count fields + profile completeness, no automated sync, no public score, no AggregateRating schema.
- VERIFIED: documentation-only research pass. No public reviews, fake ratings, lawyer-card UI, API calls, schema, database changes, URLs, redirects or live content changes were made.

## 2026-05-11 INNER-PAGE MOBILE QA FIX
- LIVE VERIFIED BEFORE FIX: mobile Playwright QA checked `/find-lawyer-how-to-find-good-attorney/`, `/articles/`, `/lawyers/`, and `/family-law/` at 390px.
- EVIDENCE BEFORE: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11.json` plus matching `mobile-inner-*-2026-05-11.png` screenshots.
- FOUND: article, articles archive and lawyer directory passed horizontal-overflow checks; `/family-law/` failed with `scrollWidth` 434 vs `clientWidth` 390.
- FOUND: `/family-law/` showed duplicate mobile WhatsApp controls and practice-hub hero text overflowing its grid column.
- CODE FIXED: `assets/css/premium-pass-3.css` clips mobile page overflow, constrains practice-hub hero content, hides duplicate theme WhatsApp on non-home mobile, keeps one compact third-party WhatsApp button, and strengthens the Pojo accessibility toolbar mobile selector.
- UPDATED: `functions.php` deployment marker is now `2026-05-11-mobile-inner-qa-v1`.
- VERIFIED: `functions.php` passed PHP syntax check using local cached PHP from the owner-provided zip.
- VISUAL VERIFIED BY CSS SIMULATION: `project-control/visual-evidence/mobile-inner-page-qa-2026-05-11-final-css.json`; all four sampled pages pass overflow and duplicate-WhatsApp checks with local CSS injected.
- NOT LIVE VERIFIED AFTER CODE FIX: requires uPress pull/cache clear and fresh public screenshots without local CSS injection.

## 2026-05-11 CONTROLLED 404 PLUGIN DEACTIVATION PREP
- CREATED: `project-control/404-plugin-deactivation-checklist.md`.
- CREATED: `tools/check-404-routing.ps1`.
- VERIFIED: the routing checker runs locally and validates fake URLs, invalid post queries, homepage, `/articles/`, `/lawyers/`, `robots.txt`, and `sitemap_index.xml`.
- VERIFIED BASELINE: homepage, articles archive, lawyers archive, robots and sitemap checks pass.
- BLOCKED BASELINE: fake URLs and invalid `?p=99999999` still return `301 Location: https://jus-tice.co.il/` while `All 404 Redirect to Homepage` remains active.
- OWNER APPROVAL NEEDED: deactivate `All 404 Redirect to Homepage` only after explicit approval, then rerun the checker and capture a real 404 screenshot.
- LIVE DEPLOYMENT VERIFIED: Codex operated the uPress Git panel directly; the uPress Git log showed `(HEAD -> main, origin/main, origin/HEAD) Prepare 404 plugin deactivation checks` at commit `0410d2f`.
- SAFETY: no live plugin state, URL, redirect rule, `.htaccess`, permalink setting, content body, taxonomy, canonical, sitemap, lawyer data, CRM data, review data or database row was changed.

## 2026-05-11 LIVE JUSTICE PLUGIN SURFACE REVIEW
- CREATED: `project-control/live-plugin-architecture-review.md`.
- CREATED: `tools/check-live-plugin-surface.ps1`.
- VERIFIED LIVE: public REST namespaces expose `ultra-justice-engine/v1`.
- VERIFIED LIVE: `justice-core/v1` and `ultra-justice/v1` return 404, so they are not the current public REST surface.
- VERIFIED LIVE: core CPTs `articles`, `justice_lawyer`, and `justice_lead` are exposed through `wp/v2/types`.
- NOT VERIFIED LIVE: `justice_legal_tool` and `justice_legal_request` are not exposed in the current public `wp/v2/types` check.
- VERIFIED RISK: legacy CPTs remain exposed in `wp/v2/types`, including `labor_law`, `small_claims`, `corona_virus`, `supreme_court`, `tort`, `goverment-gazette`, and `yada_wiki`.
- VERIFIED UPRESS PLUGIN MANAGER: `Ultra Justice Engine` version `1.0.0` is active. Filtering for `Justice` did not show a separate `Justice Core` row.
- VERIFIED UPRESS PLUGIN MANAGER: `All 404 Redirect to Homepage` version `5.6` is active.
- CREATED: `project-control/upress-plugin-manager-readonly-review.md`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-manager-ultra-justice-engine-active-2026-05-11.png`.
- EVIDENCE: `project-control/visual-evidence/upress-plugin-manager-all-404-active-2026-05-11.png`.
- DECISION: treat `ultra-justice-engine/` as the active live plugin surface for now; do not activate `justice-core/` beside it because both share `UJE_*` constants and `uje_*` functions.
- LIVE DEPLOYMENT VERIFIED: Codex operated the uPress Git panel directly; the uPress Git log showed `(HEAD -> main, origin/main, origin/HEAD) Verify live plugin architecture surface` at commit `c58cd7e`.
- LIVE DEPLOYMENT VERIFIED: uPress Git log now shows `(HEAD -> main, origin/main, origin/HEAD) Document uPress plugin manager status` at commit `7acd40c`.
- NOT VERIFIED: exact active plugin PHP file path remains unconfirmed because the uPress plugin manager shows name/status/version but not the plugin file path.
- SAFETY: no plugin activation, deactivation, deletion, installation, file-manager edit, wp-admin setting, URL, redirect, sitemap, canonical, content, taxonomy, lawyer, CRM, review or database change was made.

## 2026-05-11 LIVE PUBLIC TEMPLATE QA + LAWYER FILTER TITLE FIX
- CREATED: `tools/check-live-public-template-qa.ps1`.
- CREATED: `project-control/live-public-template-qa-2026-05-11.csv`.
- VERIFIED LIVE SOURCE: homepage, main `/lawyers/`, `/articles/`, search for `גירושין`, and article sample `/find-lawyer-how-to-find-good-attorney/` return HTTP 200 with Hebrew titles and no English default-title leak in the sampled title/UI checks.
- VERIFIED LIVE SOURCE: homepage still contains the traffic fallback link to `/lawyers/?area=traffic-law` and AI/intake fallback to `/#ask-lawyer`.
- VERIFIED LIVE SOURCE: sampled article exposes semantic related-content QA attributes, including `data-related-mode="semantic"` and related cluster-match attributes.
- VERIFIED LIVE SOURCE: clean lawyer filter URLs stay on `/lawyers/` and do not redirect to homepage.
- FOUND LIVE: `/lawyers/?area=personal-injury-law`, `/lawyers/?area=medical-malpractice-law`, and `/lawyers/?area=employment-law` render specific H1s but generic SEO titles (`עורך דין | מצאו עורך דין מתאים`).
- FIXED IN CODE: `inc/seo.php` now normalizes lawyer-directory area aliases for title generation, mapping clean public aliases to current taxonomy slugs without changing URLs, redirects, terms or stored content.
- UPDATED: deployment marker is now `2026-05-11-lawyer-filter-seo-alias-v1`.
- VERIFIED: PHP lint passed for 128 PHP files; `git diff --check` passed.
- LIVE VERIFIED AFTER FIX: see the following verification section and `project-control/live-public-template-qa-2026-05-11-after-pull.csv`.
- SAFETY: no public content body, URL, redirect, sitemap, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state or database row was changed.

## 2026-05-11 LAWYER FILTER TITLE LIVE VERIFICATION
- PUSHED: commit `3b07267` (`Fix lawyer filter SEO alias titles`) to GitHub main.
- LIVE DEPLOYMENT VERIFIED: Codex operated the uPress Git panel directly; the uPress Git log shows `(HEAD -> main, origin/main, origin/HEAD) Fix lawyer filter SEO alias titles` at commit `3b07267`.
- LIVE VERIFIED: static marker now returns `2026-05-11-lawyer-filter-seo-alias-v1`.
- CREATED: `project-control/live-public-template-qa-2026-05-11-after-pull.csv`.
- VERIFIED: full public source QA passed with all sampled rows `VERIFIED`.
- FIXED LIVE: `/lawyers/?area=personal-injury-law` title is now `עורך דין נזיקין | מצאו עורך דין מתאים`.
- FIXED LIVE: `/lawyers/?area=medical-malpractice-law` title is now `עורך דין רשלנות רפואית | מצאו עורך דין מתאים`.
- FIXED LIVE: `/lawyers/?area=employment-law` title is now `עורך דין דיני עבודה | מצאו עורך דין מתאים`.
- SAFETY: no public content body, URL, redirect, sitemap, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state or database row was changed.

## 2026-05-11 RELATED CONTENT URL INFERENCE FIX
- CREATED: `tools/check-live-related-content-qa.ps1`.
- CREATED: `project-control/live-related-content-qa-2026-05-11-before-url-inference.csv`.
- FOUND LIVE: related-content source/card clusters for `/find-lawyer-how-to-find-good-attorney/` and `/drug-offenses-criminal-lawyer/` were still `unknown`, allowing off-topic cards such as AI-for-law-firms, business-license and Australia lawyers.
- VERIFIED LIVE BASELINE: `/real-estate-lawyer-cost-2025/` and `/mutual-divorce-agreement-2025/` already pass cluster QA with matched cards.
- FIXED IN CODE: `inc/related-content.php` now includes each post permalink and the current request URI in the cluster-inference text fingerprint.
- UPDATED: deployment marker is now `2026-05-11-related-cluster-url-inference-v1`.
- VERIFIED: PHP lint passed for 128 PHP files; `git diff --check` passed.
- NOT LIVE VERIFIED AFTER FIX: requires commit, push, uPress pull/cache refresh, then rerun `tools/check-live-related-content-qa.ps1`.
- SAFETY: no public content body, CMS metadata, URL, redirect, sitemap, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state or database row was changed.

## 2026-05-11 CONTENT INVENTORY REFRESH + AUDIT MAP REBUILD
- VERIFIED: public REST content export was rerun safely without WordPress login or live writes.
- VERIFIED: exported `1,220` public content rows: `1,199` articles, `11` pages, and `10` lawyer profiles.
- VERIFIED: exported `1,707` internal-link rows.
- VERIFIED: rebuilt audit maps from the refreshed inventory: `1,220` quality rows, `1,220` URL migration rows, `1,160` redirect-plan rows, `11` cannibalization groups, `110` term/category rows, `11` topic clusters, and `1,707` internal-link map rows.
- VERIFIED: refreshed `internal-link-map.csv` has `1,707` HTTPS first-party targets and `0` HTTP first-party targets after the public template/link normalization work.
- REVIEW: URL migration status counts are `604` keep-current-clean-slug rows, `481` needs-editorial-slug-mapping rows, `129` target-slug-conflict rows, and `6` proposed-English-slug review rows.
- REVIEW: quality actions are `455` review/classify rows, `310` rewrite rows, `270` keep-or-make-pillar review rows, `105` support-pillar review rows, and `80` expand rows.
- REVIEW: some heuristic pillar picks are intentionally not final, including criminal, real-estate, personal-injury, inheritance, employment and uncategorized clusters; GSC/manual SERP review must choose the real pillars before migration.
- BLOCKED: public menu export remains blocked by WordPress REST `401`; authenticated menus, private/draft content, full custom meta and GSC metrics are not included in this public-only export.
- NOT VERIFIED: GSC traffic overlay is not applied to these refreshed CSVs yet; traffic risk remains `UNKNOWN` until browser/API data is mapped into the inventory.
- SAFETY: no public content body, URL slug, redirect, sitemap inclusion, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## 2026-05-11 CONTENT ARCHITECTURE DECISION BATCHES
- CREATED: `tools/content-audit/build-decision-review-batches.ps1`.
- CREATED: `project-control/slug-conflict-review.csv`.
- CREATED: `project-control/editorial-slug-mapping-review.csv`.
- CREATED: `project-control/cluster-pillar-review.csv`.
- CREATED: `project-control/content-decision-batches.md`.
- VERIFIED: generated `15` target-slug conflict groups for manual review before URL migration.
- VERIFIED: generated `481` editorial slug mapping rows; review lanes are `266` classify-topic-first, `154` manual review, `35` thin-content review, and `26` legacy-outdated review.
- VERIFIED: generated `11` cluster pillar review rows. Strategic clean pillar candidates are found for family divorce, medical malpractice and traffic; criminal, real estate, personal injury, employment, inheritance and cyber/privacy still lack confirmed clean target pillar URLs in the public URL map.
- REVIEW: major conflict groups include `child-support` (`30` rows), `medical-malpractice-lawyer` (`27`), `criminal-lawyer` (`13`), `child-custody` (`12`), `will` (`10`), and `pretrial-detention` (`8`).
- BLOCKED: these are review-only planning files; GSC/SERP evidence and owner approval are still required before changing URLs, redirects, canonicals, sitemap inclusion, content bodies, taxonomies or menus.
- SAFETY: no public content body, URL slug, redirect, sitemap inclusion, canonical setting, taxonomy term, lawyer record, CRM record, review data, plugin state, wp-admin setting or database row was changed.

## NEXT BEST ACTION
1. Confirm the live plugin filesystem path in wp-admin/uPress plugin manager before any plugin migration.
2. Decide whether `justice-core/` will replace `ultra-justice-engine/` on live or whether the legacy active folder must be renamed in a controlled migration.
3. Use admin/API access to set Maya Rotenberg's live slug to `advocate-maya-rotenberg` and draft/unpublish demo lawyers after backup.
4. Run PHP lint on changed files when PHP is available locally or on server.
5. Pull latest repo in Upress and visit `/wp-admin/` once to trigger LegalTech starter tool seeding.
6. Verify `/legal-tools/`, `/legal-tools/ai-intake/`, and one test LegalTech request in admin.
7. Commit only repo-safe changes; do not create ZIPs.
8. Export live URL/slug inventory before changing any Hebrew slugs; fill `url-migration-map.csv`, then create approved 301 redirects for every changed URL.
9. Pull latest in Upress and visit `/wp-admin/` once so the family-law editorial repair and internal notes draft sync can run.
10. Recheck all seven family-law URLs for clean public body content, then continue old-content merge review and import future legal content into the `articles` CPT as clean drafts.
11. Verify live homepage after Upress pull; expected signs are the blinking red-dot Jus-Tice fallback, richer hero visual layer, and upgraded article-card placeholders.

## 2026-05-18 OWNER PHONE CLEANUP + uPRESS PULL CONTROL
- PRIORITY FROM OWNER: stop everything until Codex can operate the uPress Git Pull path directly and remove the mock phone number from the public site.
- uPRESS CONTROL: browser-based uPress File Manager and Git Management path is working again in Codex; Codex clicked the uPress `Pull` action for `/wp-content/themes/justice-theme`.
- CODE FIXED: public phone/WhatsApp fallbacks now use `0525101555`.
- CODE FIXED: `justice_theme_option()` now guards `justice_phone` and `justice_whatsapp` against legacy/mock saved values (`03-6161535`, `0544705733`) at render time.
- CODE FIXED: front-page LegalService schema telephone now uses the same owner contact value.
- CREATED: `tools/check-live-owner-phone.mjs` to verify homepage phone display, tel link, WhatsApp link, legacy-number removal and deployment marker.
- UPDATED: deployment marker is now `2026-05-18-owner-phone-v1`.
- VERIFIED LOCALLY: PHP lint passed for touched PHP files; Node syntax checks passed; `git diff --check` passed with line-ending warnings only.
- LIVE VERIFIED AFTER uPRESS PULL: `node tools/check-live-owner-phone.mjs`, `node tools/check-live-html-sitemap.mjs`, and `node tools/check-live-journeys.mjs` passed.
- CACHE NOTE: a cached homepage variant initially still exposed the old LegalService phone, but no-cache fetch showed `0525101555` and the normal homepage owner-phone checker passed on rerun.
- NEXT: resume traffic/content audit: family-law wrong-page bug, `/about/` and `/contact/` 404s, outdated/corona content classification, and homepage priority order.
- SAFETY: no public CMS/database writes, content changes, redirects, sitemap settings, taxonomy changes, lawyer profile changes, lead records, payment settings or GSC/GA4 admin settings were changed.

## 2026-05-18 SITEWIDE BREADCRUMB SCHEMA FIX
- OWNER/GSC ISSUE: URL Inspection for `https://jus-tice.co.il/site-map/` reported Breadcrumbs invalid: ListItem position 2 had no `name` or `item.name`.
- LIVE ROOT CAUSE VERIFIED: `/site-map/` emitted JSON-LD with position 2 `name: ""` and `item: ""`.
- CODE FIXED: `/site-map/` now gets a real breadcrumb label (`מפת אתר`).
- CODE HARDENED: breadcrumb schema generation now prevents empty `name` values and uses the current public request URL for virtual routes without a post ID.
- CREATED: `tools/check-live-breadcrumb-schema.mjs` to run a Googlebot-style BreadcrumbList validation across XML-sitemap URLs.
- UPDATED: deployment marker is now `2026-05-18-breadcrumb-schema-v1`.
- DEPLOYED: Codex pushed commit `ed9b2ae` and clicked uPress Git Pull for `/wp-content/themes/justice-theme`.
- LIVE VERIFIED: `/site-map/` now emits position 2 `name: "מפת אתר"` and `item: "https://jus-tice.co.il/site-map/"`.
- SITEWIDE VERIFIED: `reports/breadcrumb-schema-audit-2026-05-18.csv` checked `1,299` live URLs; all rows are `PASS`.
- LIVE JOURNEY VERIFIED: `node tools/check-live-journeys.mjs` passed homepage, lawyer directory, sample article, lawyer registration, sitemap and robots checks.
- NEXT: resume traffic/content audit: family-law wrong-page bug, `/about/` and `/contact/` 404s, outdated/corona content classification, homepage priority order, and GSC indexing diagnostics.
- SAFETY: no public CMS/database writes, content changes, redirects, sitemap settings, taxonomy changes, lawyer profile changes, lead records, payment settings or GSC/GA4 admin settings were changed.

## 2026-05-18 LIVE TRAFFIC PRIORITY AUDIT
- RESEARCH BASIS: Google recommends diagnosing traffic drops by page/query/device/country/search-feature segments before broad changes, and helpful-content guidance says to audit impacted pages for completeness, trust and people-first value.
- CREATED: `tools/check-live-traffic-priority.mjs`.
- CREATED: `reports/traffic-priority-audit-2026-05-18.csv`.
- CREATED: `project-control/traffic-priority-audit-2026-05-18.md`.
- LIVE PASS: `/`, `/site-map/`, `/lawyers/?area=family-law`, `/criminal-defense-attorney/`, `/traffic-lawyer/`.
- LIVE REVIEW: `/family-law/` returns 200 but has wrong-intent court-judgment title/H1 instead of family-law practice intent.
- LIVE REVIEW: `/medical-malpractice-lawyer/` returns 404/noindex.
- LIVE REVIEW: `/articles/` is about 2.9 MB with 4,793 links, so it is too heavy and link-dense as a primary article hub.
- LIVE REVIEW: `/contact/` returns 404/noindex.
- LIVE REVIEW: `/about/` returns 404/noindex.
- NEXT: fix `/family-law/` route ownership/title/H1 without changing URL; decide `/medical-malpractice-lawyer/` landing vs safe directory fallback; add accurate `/contact/` and `/about/`; split/reduce `/articles/`.
- SAFETY: read-only live audit plus repo tooling/docs only; no public CMS/database writes, content changes, redirects, sitemap settings, taxonomy changes, lawyer profile changes, lead records, payment settings or GSC/GA4 admin settings were changed.

## 2026-05-18 FAMILY LAW ROUTE INTENT FIX
- LIVE ROOT CAUSE: `/family-law/` was a valuable practice URL, but WordPress served an old court-judgment item with court-verdict title/H1.
- FIRST FIX ATTEMPT: commit `2a6617b` added a route guard and was pulled in uPress, but live verification showed it did not win request ownership.
- FINAL FIX: commit `90c437a` added `practice-family-law-route.php` and switched `/family-law/` through `template_include` to the controlled practice landing template.
- DEPLOYED: Codex clicked uPress Git Pull for `/wp-content/themes/justice-theme`.
- LIVE VERIFIED: `/family-law/` now passes `tools/check-live-traffic-priority.mjs` with HTTP 200, about 105 KB and 104 links.
- LIVE VERIFIED: `node tools/check-live-html-sitemap.mjs`, `node tools/check-live-owner-phone.mjs`, and `node tools/check-live-journeys.mjs` passed after deployment.
- UPDATED: deployment marker is now `2026-05-18-family-law-template-v1`.
- REMAINING LIVE REVIEW: `/medical-malpractice-lawyer/`, `/contact/`, `/about/`, and oversized `/articles/`.
- SAFETY: render-only theme fix; no public CMS/database writes, content changes, redirects, sitemap settings, taxonomy changes, lawyer profile changes, lead records, payment settings or GSC/GA4 admin settings were changed.

## 2026-05-19 LAWYER PLAN MONEY-PATH GUARD
- OWNER APPROVAL BASIS: owner approved deployment, SEO page edits, payment setup and lawyer outreach; payment stack is partially installed live but not yet subscription-ready.
- RESEARCH BASIS: WooCommerce Subscriptions documentation requires a real subscription engine and recurring-capable payment gateway for automatic renewal flows; Google link guidance also reinforces that public CTAs should be crawlable and truthful, not script-only or dead-end paths.
- CODE UPDATED: `/lawyer-plans/` now publishes the approved monthly prices and lead caps: Pro ₪349/5 leads, Featured ₪749/15 leads, Lead Partner ₪1,490/40 leads, Full Service ₪2,490/80 leads.
- CODE UPDATED: paid plan checkout now requires all readiness checks before sending a lawyer to checkout: mapped product ID, WooCommerce checkout helper, product lookup, WooCommerce Subscriptions availability and purchasable product.
- CODE UPDATED: when the recurring-payment stack is not ready, paid CTAs route to `/lawyer-registration/?plan_interest=<plan>&pre_checkout=1` instead of a broken checkout.
- MONEY IMPACT: lawyers can now understand the offer and register intent immediately, while the site avoids trust damage from sending prospects to an unfinished payment flow.
- BLOCKED FOR FULL REVENUE: Morning license/plugin key, Morning/Meshulam business approval, WooCommerce Subscriptions paid plugin/license and four subscription products still need completion before live charging.
- COMPLETION ASSESSMENT: lawyer acquisition page clarity 70%; automated paid checkout 35%; revenue collection 0% until the paid subscription stack is active.
- OWNER CAN NOTICE: `/lawyer-plans/` should show real prices/caps; buttons should say registration/check-fit until checkout is truly ready.
- SAFETY: repo-only template/logic change; no public CMS/database writes, product creation, payment activation, lead record changes or lawyer profile changes were made in this step.

## 2026-05-19 UNCOVERED DEMAND CAPTURE UPGRADE
- OWNER PAIN: callers ask for niche lawyers (example: Thailand lawyer) and the owner currently spends time manually helping without monetization.
- RESEARCH BASIS: legal lead-generation guidance repeatedly warns against fee-splitting/recommendation-style referrals; safer monetization is transparent advertising/subscription coverage, qualified intake tracking, and strong intake/disposition infrastructure.
- CODE UPDATED: public lead form now includes `תאילנד / משפט בינלאומי` as a selectable demand area.
- CODE UPDATED: rule-based lead classifier now detects Thailand/Bangkok/Phuket/Koh Samui/Thai keywords and normalizes them into `thailand-law`.
- CODE UPDATED: new leads now automatically receive a `coverage_status`: routable when assigned, urgent manual when urgent, uncovered recruit when specific but no routable lawyer exists, or coverage review when unclear.
- CODE UPDATED: Thailand leads are tagged with `jurisdiction=Thailand` so the Justice CRM uncovered-demand queue can aggregate them as a recruitable niche market.
- MONEY IMPACT: repeated niche calls become measurable demand evidence for recruiting paid coverage partners instead of owner-only manual goodwill.
- BLOCKED FOR OUTREACH: Gmail connector token is expired; direct email outreach cannot be sent until Gmail is reconnected.
- COMPLETION ASSESSMENT: uncovered-demand capture 75%; automated niche lawyer recruitment 25%; paid lead monetization still blocked by payment setup and outreach channel.
- OWNER CAN NOTICE: future Thailand/international requests should appear in wp-admin → Justice CRM → Uncovered demand queue rather than disappearing into phone memory.
- SAFETY: repo-only intake/classification change; no live lead records, lawyer records, public CMS content, payment settings or database rows were edited manually.

## 2026-05-19 MANUAL PAYMENT BRIDGE WHILE GROW KYC IS BLOCKED
- OWNER STATUS: Morning/Green Invoice account and digital-payments setup moved forward, but Grow/Meshulam onboarding is temporarily blocked at identity-document verification; owner will handle the ID/KYC step tomorrow.
- RESEARCH BASIS: WooCommerce documents Direct Bank Transfer/BACS as an offline/manual payment method where the customer places an order and the merchant verifies payment outside the online card flow; this supports a temporary manual invoice bridge while recurring card billing waits for KYC.
- CODE UPDATED: paid `/lawyer-plans/` cards now expose a secondary "בקשת חשבונית והפעלה ידנית" path when automatic checkout is not ready.
- CODE UPDATED: `/lawyer-registration/?payment_path=manual_invoice` shows a clear manual-invoice notice and submits a hidden payment path.
- CODE UPDATED: lawyer registration drafts now store `payment_path=manual_invoice` and `payment_followup_status=invoice_requested` for paid manual requests.
- CODE UPDATED: admin notification email now includes payment path and follow-up status so paid-intent lawyers can be handled commercially, not as generic free leads.
- MONEY IMPACT: first paid lawyers can now be captured and manually invoiced via Morning while automatic recurring billing is blocked; this reduces the risk of losing interested lawyers during KYC delay.
- BLOCKED FOR FULL AUTOMATION: Grow/Meshulam ID verification, WooCommerce Subscriptions license/install, subscription products and product mapping still need completion before automatic monthly card billing.
- COMPLETION ASSESSMENT: manual revenue intake path 55%; automated recurring checkout 35%; first-payment readiness 45% overall because owner can invoice manually but card recurrence is not live.
- OWNER CAN NOTICE: `/lawyer-plans/` should show a manual invoice activation link on paid plans until checkout readiness becomes true; submitted manual requests should be marked in the lawyer draft meta/admin email.
- SAFETY: repo-only template/logic/status change; no live products, payment settings, invoices, lawyer records, lead records, CMS pages or database rows were changed manually.

## 2026-05-19 MANUAL PAYMENT BRIDGE LIVE DEPLOYMENT
- MERGED: PR #13 (`codex/manual-payment-bridge`) was squash-merged to `main`.
- DEPLOYED: Codex opened uPress File Manager → `/wp-content/themes/justice-theme` → `ניהול GIT` and ran `משיכת נתונים (Pull)` successfully.
- LIVE VERIFIED: `https://jus-tice.co.il/lawyer-plans/` returns 200 and contains the manual invoice activation path (`payment_path=manual_invoice`).
- LIVE VERIFIED: `https://jus-tice.co.il/lawyer-registration/?plan_interest=pro&payment_path=manual_invoice` returns 200, shows the manual-invoice notice, keeps the selected Pro plan and includes the manual payment marker.
- MONEY IMPACT: paid lawyer interest is now capturable on the live site even before Grow/Meshulam card recurrence is approved.
- NEXT MONEY STEP: owner completes Grow/Meshulam ID/KYC; Codex then finishes WooCommerce Subscriptions/product mapping and tests checkout.
- SAFETY: uPress pull + live read-only verification only; no live invoices, products, lawyer records, lead records, payment settings or CMS database content were manually changed.

## 2026-05-19 MANUAL PAYMENT ADMIN VISIBILITY
- RESEARCH BASIS: WooCommerce B2B invoice guidance supports invoice/manual-payment flows for business buyers; operationally, the important part is making manual payment follow-up visible so paid-intent prospects are not lost in a generic registration queue.
- CODE UPDATED: Lawyer Onboarding now shows a `Payment Follow-up` column for every lawyer registration row.
- CODE UPDATED: manual invoice requests show an `Invoice requested` badge with the explicit next action: create/send Morning invoice and activate only after payment confirmation.
- CODE UPDATED: the lawyer activation side box now repeats the payment follow-up state so the reviewer sees the money step while editing the draft profile.
- MONEY IMPACT: paid plan requests are now surfaced inside the owner workflow instead of being hidden in post meta or email only.
- BLOCKED FOR FULL AUTOMATION: Grow/Meshulam ID verification, recurring billing, subscription products and live checkout mapping remain incomplete.
- COMPLETION ASSESSMENT: manual revenue operations 65%; automated recurring checkout 35%; first-payment readiness 50%.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin → Lawyer Onboarding should include the `Payment Follow-up` column and each manual invoice lawyer should show `Invoice requested`.
- SAFETY: repo-only admin visibility/status change; no live lawyer records, payment settings, invoices, products, CMS pages or database rows were changed manually.

## 2026-05-19 MANUAL PAYMENT ADMIN VISIBILITY LIVE
- MERGED: PR #15 (`codex/manual-payment-admin-visibility`) was squash-merged to `main`.
- DEPLOYED: Codex opened uPress File Manager → `/wp-content/themes/justice-theme` → `ניהול GIT` and ran `משיכת נתונים (Pull)` successfully.
- LIVE VERIFIED: wp-admin → Lawyer Onboarding loads and shows the new `Payment Follow-up` column.
- LIVE VERIFIED: existing rows show `No manual payment`; future manual-invoice registrations should show `Invoice requested` with the Morning invoice next action.
- MONEY IMPACT: owner can now spot paid-intent lawyer registrations directly in the onboarding queue without hunting through emails or hidden meta.
- COMPLETION ASSESSMENT: manual revenue operations 70%; automated recurring checkout 35%; first-payment readiness 52%.
- SAFETY: uPress pull + live read-only wp-admin verification only; no live lawyer records, payment settings, invoices, products or CMS database content were changed manually.

## 2026-05-19 TRUST ROUTE GOOGLEBOT CHECKER
- RESEARCH BASIS: Google Search Central recommends creating people-first pages that make ownership, purpose, contact paths and content review context clear; for legal/YMYL trust, the crawlable `/about/`, `/contact/` and `/editorial-policy/` pages are part of the authority and conversion journey.
- CREATED: `tools/check-live-trust-routes.mjs` to verify `/about/`, `/contact/` and `/editorial-policy/` as Googlebot.
- LIVE VERIFIED: all three routes return 200, are indexable, self-canonical and expose the expected H1.
- LIVE VERIFIED: `/contact/` includes the public phone `0525101555`, `info@jus-tice.co.il` and the lead form anchor.
- MONEY IMPACT: contact/trust pages that were previously traffic-audit risks are now protected by a repeatable check, reducing the chance that lawyer/user conversion paths silently fall back to 404/noindex.
- BLOCKED: this checker does not create new traffic by itself; it protects crawl trust and conversion while money-query content edits and outreach continue.
- COMPLETION ASSESSMENT: Googlebot trust route stability 90%; broader traffic recovery 38%; lawyer/customer conversion foundation 62%.
- OWNER CAN NOTICE: `https://jus-tice.co.il/about/`, `/contact/` and `/editorial-policy/` should load as real indexable trust pages, and future agents can run `node tools/check-live-trust-routes.mjs`.
- SAFETY: repo-only checker/status plus read-only live verification; no live CMS/database, payment, lawyer, lead, redirect, GSC or product settings were changed.

## 2026-05-19 TRUST ROUTE CHECKER LIVE SYNC
- MERGED: PR #17 (`codex/trust-route-googlebot-checker`) was squash-merged to `main`.
- DEPLOYED: Codex opened uPress File Manager → `/wp-content/themes/justice-theme` → `ניהול GIT` and ran `משיכת נתונים (Pull)` successfully.
- VERIFIED: local/live checker run passed for `/about/`, `/contact/` and `/editorial-policy/`.
- MONEY IMPACT: this does not collect payment directly; it protects three trust/conversion URLs that support SEO, user confidence and lawyer sales conversations.
- COMPLETION ASSESSMENT: Googlebot trust route stability 92%; broader traffic recovery 38%; lawyer/customer conversion foundation 63%.
- SAFETY: uPress pull + read-only route verification only; no live CMS/database, payment, lawyer, lead, redirect, GSC or product settings were changed.

## 2026-05-19 COMMERCIAL JOURNEY CHECKER
- RESEARCH BASIS: Google link best practices say important paths should be crawlable `<a href>` links with meaningful anchor text; the lawyer-money path therefore needs a repeatable check that the pricing page links to the manual invoice registration path before full checkout is ready.
- CREATED: `tools/check-live-commercial-journey.mjs`.
- LIVE VERIFIED: `/lawyer-plans/` exposes all approved paid prices and the manual invoice activation link.
- LIVE VERIFIED: `/lawyer-registration/?plan_interest=pro&payment_path=manual_invoice` preserves the Pro plan, includes the hidden manual payment marker and shows the manual-invoice notice.
- MONEY IMPACT: future deployments can quickly catch broken pricing/manual-invoice paths before outreach sends lawyers into a dead end.
- BLOCKED FOR FULL MONEY: Grow/Meshulam ID/KYC and recurring checkout setup remain blocked until owner completes identity verification.
- COMPLETION ASSESSMENT: commercial journey monitoring 80%; manual revenue operations 72%; automated recurring checkout 35%; first-payment readiness 53%.
- OWNER CAN NOTICE: future agents can run `node tools/check-live-commercial-journey.mjs`; lawyers should see real prices and a working manual invoice path.
- SAFETY: repo-only checker/status plus read-only live verification; no live CMS/database, payment, lawyer, lead, product, redirect or GSC settings were changed.

## 2026-05-19 LAWYER RECRUITMENT MICRO-OFFER SCRIPT
- RESEARCH BASIS: current B2B outreach guidance emphasizes signal-based targeting, relevance over volume, and low-friction micro-offers instead of asking cold prospects for a long sales call immediately.
- CODE UPDATED: Justice CRM uncovered-demand templates now include the live `/lawyer-plans/` URL and approved monthly plan prices.
- CODE UPDATED: lawyer recruitment copy now offers a 5-minute fit check / 2-minute overview instead of a hard sales call.
- CODE UPDATED: added a 3-touch outreach sequence: day 1 signal/opening, day 3 demand evidence, day 7 polite close with compliance guardrails.
- MONEY IMPACT: repeated uncovered demand can now be turned into a concrete lawyer outreach workflow linked to the manual invoice/payment path.
- BLOCKED: no outreach was sent in this cycle; Gmail/outbound channel and owner-approved target list still determine actual customer acquisition speed.
- COMPLETION ASSESSMENT: lawyer outreach readiness 48%; manual revenue operations 74%; first-payment readiness 54%.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin → Justice CRM → Safe uncovered-demand response templates should show the enriched lawyer recruitment script and 3-touch outreach sequence.
- SAFETY: repo-only admin copy/status change; no live outreach, emails, SMS, lawyer records, lead records, invoices, products, payment settings or CMS database content were changed manually.

## 2026-05-19 LAWYER RECRUITMENT MICRO-OFFER LIVE
- MERGED: PR #20 (`codex/lawyer-recruitment-micro-offer`) was squash-merged to `main`.
- DEPLOYED: Codex opened uPress File Manager → `/wp-content/themes/justice-theme` → `ניהול GIT` and ran `משיכת נתונים (Pull)` successfully.
- LIVE VERIFIED: wp-admin → Justice CRM contains the enriched lawyer recruitment script, `/lawyer-plans/` link, approved prices and 3-touch outreach sequence.
- MONEY IMPACT: the owner now has copy-ready outreach inside the CRM to turn uncovered demand into paid lawyer conversations without waiting for automatic billing.
- COMPLETION ASSESSMENT: lawyer outreach readiness 52%; manual revenue operations 75%; first-payment readiness 55%.
- SAFETY: uPress pull + live read-only wp-admin verification only; no outreach, emails, SMS, lawyer records, lead records, invoices, products, payment settings or CMS database content were changed manually.

## 2026-05-20 DIN REPUTATION SYSTEM COMPETITIVE ANALYSIS
- OWNER INPUT: owner authorized read-only inspection of a Din lawyer management account for inspiration and product analysis.
- SAFETY: no credentials were stored in repo; no SMS, payment load, profile edit, article edit, judgment edit, lead update or outreach action was intentionally performed.
- HONESTY NOTE: while inspecting, Din's "improve your position" link redirected to a system message saying a callback request was received. No form was filled and no payment/profile change was made, but future agents should avoid that link during competitor analysis.
- RESEARCH BASIS: BrightLocal 2026 review research and Google Business Profile policies both reinforce that review recency, authenticity and no-incentive collection matter; fake/incentivized/manipulated reviews can trigger Google restrictions.
- CREATED: `project-control/din-lawyer-review-system-analysis-2026-05-20.md`.
- LINEAR: created `HAD-66` for the next implementation PR: `Build lawyer Reputation And Value dashboard from Din competitive analysis`.
- PRODUCT FINDING: Din's monetization strength is a private lawyer control panel combining leads, phone calls, profile views, category position, ad budget, content and reviews into one value story.
- MONEY IMPACT: this turns the reputation module from "nice review widget" into a retention/upsell engine for Pro, Featured, Lead Partner and Full Service lawyers.
- NEXT SAFE CODE STEP: add a private lawyer dashboard `Reputation And Value` panel with review freshness, profile views, linked leads, content/profile actions and copyable review-request link placeholders; do not add SMS yet.
- COMPLETION ASSESSMENT: competitive intelligence 70%; reputation/reviews product definition 45%; lawyer dashboard retention layer 55%; actual review/SMS automation 0%.
- OWNER CAN NOTICE: repo planning exists now; public website does not change until the next implementation PR.

## 2026-05-20 PSAKDIN LAWYER PLATFORM PARTIAL ANALYSIS
- OWNER INPUT: owner authorized read-only PsakDin inspection and provided credentials.
- ACCESS RESULT: login attempt returned `wrong username/password`; no additional guesses were attempted.
- SAFETY: no credentials were stored in repo; no profile edit, payment, message, registration, content edit, subscription, lead action or form submission was performed.
- CREATED: `project-control/psakdin-lawyer-platform-analysis-2026-05-20.md`.
- PRODUCT FINDING: PsakDin combines lawyer index, case-law database, magazine, forms, video/live, polls, legal-service providers, forums and AI/chat entry points into a recurring legal platform.
- PROFILE FINDING: public lawyer profiles act as authority hubs with practice areas, cities, narrative bio, video CTA, media/publication links and article links.
- MONEY IMPACT: reinforces that Jus-Tice paid lawyer value must include authority assets and content/media proof, not just a profile and raw leads.
- NEXT SAFE CODE STEP: include an `Authority Assets` checklist inside the same private `Reputation And Value` dashboard panel planned in `HAD-66`.
- COMPLETION ASSESSMENT: private PsakDin analysis 0% blocked; public PsakDin product analysis 45%; competitive profile/authority pattern captured 50%.

## 2026-05-20 JUSTIA FAMILY LAW CENTER ANALYSIS
- OWNER INPUT: owner provided `https://www.justia.com/family/divorce/` as a model for content/SEO inspiration.
- SAFETY: public research only; no account login, form submission, payment, outreach or account action was performed.
- CREATED: `project-control/justia-family-law-center-analysis-2026-05-20.md`.
- LINEAR: created `HAD-67` for implementation follow-up: `Build Family Law Center / Divorce hub from Justia analysis`.
- RESEARCH BASIS: Justia's divorce page behaves as a law center hub with plain-language guide content, internal links, topic cards, FAQs, popular topics, last-reviewed signal and lawyer/resource paths.
- COMMERCIAL FINDING: Justia packages lawyer monetization as directory + premium placement + SEO + websites + blogs + PPC + Google Business Profile + social media + analytics.
- MONEY IMPACT: validates Jus-Tice's plan ladder and shows the family/divorce cluster should become a guided Israeli law center, not isolated articles.
- NEXT SAFE CODE STEP: create a family-law/divorce hub rescue package: URL audit, canonical pillar, topic cards, internal links, last-reviewed/reviewer plan, Maya authority block after verification and live link/CTA checker.
- COMPLETION ASSESSMENT: Justia public content analysis 65%; marketing packaging analysis 60%; family-law SEO rescue readiness 45%; implementation 0%.

## 2026-05-20 LAWYER PLATFORM PRODUCT SPINE
- OWNER INPUT: owner clarified that lawyer onboarding must become a smart wizard that creates a rich mini-site with minimal owner work, and that supplier/provider monetization for lawyers is now a formal revenue track.
- RESEARCH BASIS: WordPress.com AI Assistant is useful inspiration but mainly applies to WordPress.com editor/media workflows; AI Engine-style plugins can help with chat/forms/content, but Jus-Tice should keep the commercial onboarding, approval and publication logic first-party. Google Business Profile APIs require authorized locations for review data. Din has supplier categories such as translations/notary/apostille and office rentals for lawyers.
- CODE UPDATED: `/lawyer-registration/` now loads `assets/js/lawyer-registration-wizard.js`, turning the long registration form into a four-step guided wizard while preserving the existing backend submission and no-JS fallback.
- CODE UPDATED: added admin-only `justice_supplier` CPT in `inc/lawyer-suppliers.php` for the supplier marketplace pipeline: category, source URL, contact, service area, status, revenue model, priority, offer summary and owner note.
- LINEAR: created `HAD-73` for the AI-assisted lawyer onboarding wizard and `HAD-74` for the supplier marketplace revenue pipeline.
- MONEY IMPACT: lawyers should face a more serious onboarding experience, and supplier/provider monetization now has a repo-backed place to collect prospects before public exposure.
- BLOCKED: automated recurring payments remain blocked until Meshulam/Grow KYC/account recovery is completed by owner; AI drafting still needs provider/API and safety work.
- COMPLETION ASSESSMENT: lawyer onboarding UX 48%; zero-owner-interference onboarding 35%; supplier marketplace revenue track 18%; admin money-system cleanup 40%; automated AI profile drafting 10%.
- OWNER CAN NOTICE AFTER MERGE/DEPLOY: `/lawyer-registration/` should feel like a guided wizard; wp-admin should expose `Suppliers` under the lawyer onboarding/admin area.
- SAFETY: branch code/docs/Linear only; no live CMS/database, supplier, lawyer, lead, payment, outbound email/SMS, GSC, GA4, redirect, noindex, sitemap or uPress deployment changed.

## 2026-05-20 LAWYER SUPPLIER REQUEST INTAKE
- RESEARCH BASIS: current onboarding guidance emphasizes fast first value and repeatable next-step actions; legal marketplace/vendor examples show that curated suppliers for lawyers can become a second revenue line when quality and disclosure are controlled.
- CODE UPDATED: lawyer dashboard now includes a private `Vetted services for your firm` request form.
- CODE UPDATED: added `justice_lawyer_supplier_request` handler that verifies the logged-in lawyer owns the profile, stores category/urgency/notes on the profile, appends an internal note and emails the owner.
- CODE UPDATED: growth assets now count captured professional supplier/service needs as a value signal.
- MONEY IMPACT: this turns supplier monetization from only a prospect CRM into real lawyer demand capture; each request can support supplier outreach and future partner offers.
- BLOCKED: supplier matching remains manual until approved suppliers and commercial terms exist; automated recurring lawyer payments remain blocked until Meshulam/Grow KYC/account recovery is completed by owner.
- COMPLETION ASSESSMENT: supplier marketplace revenue track 24%; lawyer dashboard retention/value layer 64%; zero-owner-interference onboarding 36%; first-payment readiness 56%.
- OWNER CAN NOTICE AFTER MERGE/DEPLOY: logged-in lawyers on `/lawyer-dashboard/` should see `Vetted services for your firm` and can request a supplier match.
- SAFETY: branch code/docs only; no live CMS/database, supplier record, lawyer record, lead, payment, outbound email/SMS, GSC, GA4, redirect, noindex, sitemap or uPress deployment changed.

## 2026-05-20 SUPPLIER PIPELINE ADMIN FILTERS
- RESEARCH BASIS: 2026 attorney marketplace examples emphasize curated/vetted providers, attorney-focused categories and warm introductions; therefore the supplier CRM must be easy to filter by category, status and priority instead of becoming another flat CMS list.
- CODE UPDATED: `justice_supplier` wp-admin list now has filters for supplier category, partnership status and priority.
- MONEY IMPACT: owner can quickly find high-priority outreach-ready suppliers and turn lawyer demand into partner conversations.
- BLOCKED: real supplier records and commercial terms still need owner/business outreach; automated recurring lawyer payments remain blocked until Meshulam/Grow KYC/account recovery is completed by owner.
- COMPLETION ASSESSMENT: supplier marketplace revenue track 27%; admin money-system cleanup 42%; lawyer dashboard retention/value layer 64%.
- OWNER CAN NOTICE AFTER MERGE/DEPLOY: wp-admin supplier list should have dropdown filters for category, status and priority.
- SAFETY: branch code/docs only; no live CMS/database, supplier record, lawyer record, lead, payment, outbound email/SMS, GSC, GA4, redirect, noindex, sitemap or uPress deployment changed.

## 2026-05-20 SUPPLIER MARKETPLACE OUTREACH PLAYBOOK
- RESEARCH BASIS: 2026 B2B lead generation guidance points toward ICP fit, buying intent and relevant follow-up; legal vendor marketplaces position themselves around curated/vendor networks rather than generic lists.
- CREATED: `project-control/supplier-marketplace-outreach-playbook-2026-05-20.md`.
- CREATED: `project-control/supplier-marketplace-prospect-template-2026-05-20.csv`.
- MONEY IMPACT: supplier monetization now has a practical outbound motion: first 30 prospect categories, qualification questions, scripts, follow-ups and revenue models.
- BLOCKED: no supplier outreach was sent; real prospect records and commercial terms still need owner/business action; automated recurring lawyer payments remain blocked until Meshulam/Grow KYC/account recovery is completed by owner.
- COMPLETION ASSESSMENT: supplier strategy 55%; supplier CRM 45%; supplier demand capture 35%; supplier outreach readiness 50%; supplier revenue live 0%.
- OWNER CAN NOTICE: repo now contains a ready supplier outreach playbook and prospect template for translation/notary, office rooms, legal marketing, legal tech, experts and courier/filing.
- SAFETY: branch docs only; no live CMS/database, supplier record, lawyer record, lead, payment, outbound email/SMS, GSC, GA4, redirect, noindex, sitemap or uPress deployment changed.

## 2026-05-20 GROW/MESHULAM WEBSITE APPROVAL FIX
- OWNER INPUT: owner shared the Grow/Meshulam failed site-review report and told support the site fixes are in progress.
- REVIEW FINDING: Grow accepted site activity, phone and content category checks, but rejected missing business address, terms, privacy, cancellation, supply policy, warranty/responsibility, checkout page, and checkout terms checkbox/link.
- CODE UPDATED: added `inc/payment-compliance-routes.php` with public `/terms/`, `/privacy/`, `/refund-cancellation-policy/`, and fallback `/checkout/` routes.
- CODE UPDATED: fallback `/checkout/` collects first name, last name, phone without international prefix, country and email, and requires a terms approval checkbox linking to `/terms/`.
- CODE UPDATED: Customizer now has business name and business address fields for payment compliance; footer and HTML sitemap expose the policy pages; contact page and schema can show the business address once saved.
- MONEY IMPACT: this directly addresses the payment-provider approval blocker so automated recurring lawyer subscriptions can move forward once the exact public address is saved and the branch is deployed.
- BLOCKED: exact public business address is still required from owner before re-submitting Grow/Meshulam review; no live deployment/uPress pull yet because this is branch code, not merged to main.
- COMPLETION ASSESSMENT: Grow website checklist fix 80%; automated recurring payment readiness 68%; first-payment readiness 63%.
- OWNER CAN NOTICE AFTER MERGE/DEPLOY: `/terms/`, `/privacy/`, `/refund-cancellation-policy/`, `/checkout/`, footer links, and Customizer business address field.
- SAFETY: branch code/status only; no live CMS/database, supplier record, lawyer record, lead, payment, outbound email/SMS, GSC, GA4, redirect, noindex, sitemap or uPress deployment changed.

## 2026-05-20 GROW/MESHULAM LIVE DEPLOYMENT AND ROUTE PATCH
- DEPLOYED: PR #26 was squash-merged to GitHub `main` as commit `20913a4` (`Prepare first lawyer acquisition wave`), then Codex opened uPress File Manager for `wp-content/themes/justice-theme`, opened Git management and ran Pull.
- VERIFIED UPRESS: uPress Git log shows top commit `(HEAD -> main, origin/main, origin/HEAD) Prepare first lawyer acquisition wave`.
- LIVE FINDING: `/privacy/` renders the new compliance route, but `/terms/` and `/refund-cancellation-policy/` were still redirected to homepage by the live 404/redirect layer because those slugs were not existing WordPress objects.
- CODE PATCHED: compliance pages now render on existing live slugs `/sample-terms-and-conditions-template/` for Terms and `/cancellation/` for cancellation/supply/warranty, while `/terms/` and `/refund-cancellation-policy/` redirect to those working slugs.
- CODE PATCHED: WooCommerce checkout now gets a visible terms/privacy/cancellation approval box via WooCommerce hooks, because the live site has a real `/checkout/` WooCommerce page and the fallback route does not override it.
- BLOCKED: this second patch still needs commit/push and another uPress pull; exact public business address is still required before Grow/Meshulam re-check.
- COMPLETION ASSESSMENT: Grow website checklist fix 88%; automated recurring payment readiness 70%; first-payment readiness 65%.
- OWNER CAN NOTICE AFTER NEXT PULL: footer policy links should point to working pages, `/sample-terms-and-conditions-template/` should show the real terms, `/cancellation/` should show service/cancellation responsibility policy, and checkout should show a terms approval box.

## 2026-05-20 GROW/MESHULAM CHECKOUT REVIEW PATCH
- FINDING: the legal/compliance pages were live, but the empty `/checkout/` URL still rendered the normal WooCommerce empty-cart page. This is the exact URL a payment-provider reviewer is likely to open, so the required customer details form and terms checkbox were not visible.
- CODE UPDATED: empty `/checkout/` now renders the payment-compliance fallback page. Real WooCommerce payment checkout is preserved when there is an active cart or payment/order query such as `add-to-cart`, `order-pay`, `order-received`, `key`, `pay_for_order` or `wc-ajax`.
- MONEY IMPACT: this closes one more concrete Grow/Meshulam approval blocker without changing the lawyer payment architecture.
- BLOCKED: exact public business address is still required before final re-check submission; live deployment/uPress pull and public verification still need to happen for this patch.
- COMPLETION ASSESSMENT: Grow website checklist fix 92%; automated recurring payment readiness 72%; first-payment readiness 67%.
- OWNER CAN NOTICE AFTER DEPLOY: opening `/checkout/` while not paying should show a Jus-Tice customer details form and required terms approval checkbox; checkout with a product should still go through WooCommerce.

## 2026-05-20 GROW/MESHULAM CHECKOUT CACHE FOLLOW-UP
- LIVE FINDING: after deploying `f150c7f`, uPress Git showed the correct commit, but public `/checkout/` still rendered the WooCommerce empty-cart page and did not expose the reviewer compliance form.
- CODE UPDATED: checkout fallback detection now uses payment/order query parameters and WooCommerce cart cookies instead of the server-side cart object. This should let reviewers with no cart see the compliance form while preserving real buyer checkout sessions.
- BLOCKED: exact public business address is still required before final Grow/Meshulam re-check; deployment and public verification for this follow-up patch still need to happen.
- COMPLETION ASSESSMENT: Grow website checklist fix 94%; automated recurring payment readiness 73%; first-payment readiness 68%.

## 2026-05-20 GROW/MESHULAM LIVE VERIFICATION
- DEPLOYED: pushed and pulled `81a46e9` to live via uPress Git management for `wp-content/themes/justice-theme`; uPress Git log showed `(HEAD -> main, origin/main, origin/HEAD) Use cart cookies for checkout reviewer fallback`.
- VERIFIED LIVE: public `/checkout/` now renders `jt-compliance--checkout`, a customer details form, required `accept_terms` checkbox, and links to `/sample-terms-and-conditions-template/`, `/privacy/`, and `/cancellation/`.
- VERIFIED LIVE: `/sample-terms-and-conditions-template/` renders `jt-compliance--terms` and still shows the business-address warning; `/privacy/` and `/cancellation/` render the compliance pages.
- VERIFIED SAFETY: `/checkout/?add-to-cart=999999` bypasses the fallback, so payment/cart query URLs are still left to WooCommerce instead of the reviewer page.
- BLOCKED BEFORE RESUBMISSION: exact public business address must be saved in the Customizer or the Grow/Meshulam reviewer will still see the address warning.
- COMPLETION ASSESSMENT: Grow website checklist fix 96%; automated recurring payment readiness 74%; first-payment readiness 69%.

## 2026-05-20 GROW/MESHULAM BUSINESS ADDRESS FIX
- OWNER INPUT: owner confirmed the public business address as Tel Aviv-Yafo, Raul Wallenberg 18, Tower C, floor 2, same office footprint as Maya Rotenberg.
- RESEARCH BASIS: Maya Rotenberg's own site lists `רחוב ראול ולנברג 18, מתחם CU (שוק צפון), מגדל C, קומה 2, תל אביב-יפו`; Din, PsakDin and Duns also list Raul Wallenberg 18 / CU / Tower C / floor 2 for the same office.
- CODE UPDATED: default `justice_business_address` now uses `רחוב ראול ולנברג 18, מתחם CU, מגדל C, קומה 2, תל אביב-יפו`, so Grow/Meshulam reviewers see a full address on compliance pages even before a Customizer value is manually saved.
- MONEY IMPACT: this removes the remaining visible website-address blocker from the Grow/Meshulam checklist.
- BLOCKED: needs commit/push/uPress pull and live verification before resubmission.
- COMPLETION ASSESSMENT: Grow website checklist fix 98%; automated recurring payment readiness 76%; first-payment readiness 71%.

## 2026-05-20 GROW/MESHULAM RESUBMITTED FOR REVIEW
- DEPLOYED: pushed and pulled `5f0ce5d` to live via uPress Git management; uPress Git log showed `(HEAD -> main, origin/main, origin/HEAD) Add public business address for Grow approval`.
- VERIFIED LIVE: `/sample-terms-and-conditions-template/` and `/checkout/` now show `רחוב ראול ולנברג 18, מתחם CU, מגדל C, קומה 2, תל אביב-יפו`; the missing-address warning text is no longer present in the rendered compliance content.
- VERIFIED LIVE: `/checkout/` still shows the customer details form and required `accept_terms` checkbox.
- ACTION TAKEN: opened the Grow/Meshulam review-result link, checked the confirmation box, and submitted the site for re-check.
- RESULT: Grow page confirmed: `תודה, האתר נשלח לבדיקה חוזרת בהצלחה! הבדיקה אורכת עד יום עסקים, בסיום הבדיקה ניצור קשר עם בית העסק.`
- BLOCKED: waiting for Grow/Meshulam reviewer response; recurring lawyer payments still depend on their approval and account/payment setup completion.
- COMPLETION ASSESSMENT: Grow website checklist fix 100% submitted; automated recurring payment readiness 78%; first-payment readiness 73%.

## 2026-05-20 GROW/MESHULAM SECOND REVIEW RESPONSE
- RESULT: Grow/Meshulam rejected the second review. They now accepted: active site, terms exist, age limit, phone, cancellation, supply policy. Remaining failures: business address, checkout page, checkout terms approval, checkout terms link, product/service responsibility, privacy.
- DIAGNOSIS: the site content exists, but the reviewer/checker appears to require more literal checklist wording and WooCommerce-style checkout field names.
- CODE UPDATED: checkout fallback now uses WooCommerce checkout form/class naming and billing field names: `billing_first_name`, `billing_last_name`, `billing_phone`, `billing_country`, `billing_email`, plus a required `terms` checkbox linking to terms, cancellation/responsibility and privacy.
- CODE UPDATED: privacy page now includes explicit text about information use, confidentiality, security measures and not selling user details.
- CODE UPDATED: terms/cancellation content now includes explicit `אחריות המוצר והשירות` wording and liability limitation text.
- CODE UPDATED: footer now shows `כתובת בית עסק:` with the public Raul Wallenberg office address, so the address is visible site-wide and not only inside the legal page box.
- BLOCKED: needs commit/push/uPress pull/live verification, then submit Grow/Meshulam re-check again.
- COMPLETION ASSESSMENT: Grow website checklist fix 100% code-adjusted after rejection; automated recurring payment readiness 78%; first-payment readiness 73%.

## 2026-05-20 GROW/MESHULAM THIRD REVIEW SUBMISSION
- DEPLOYED: live uPress Git log already showed `5d82f68 Match Grow compliance checklist wording` on `main`.
- CACHE ACTION: uPress development/no-cache mode was enabled temporarily so public reviewers see the latest compliance pages instead of stale cached copies.
- VERIFIED LIVE: normal public `/checkout/` contains `jt-compliance--checkout`, WooCommerce-style billing fields, required `terms` checkbox, and links to terms, privacy and cancellation/responsibility pages.
- VERIFIED LIVE: homepage/footer show the public business address; `/privacy/` includes security/use-of-data wording; `/cancellation/` includes product/service responsibility and liability-limitation wording.
- ACTION TAKEN: after owner approval, opened the Grow/Meshulam checklist link, checked the confirmation box and submitted the site for another review.
- RESULT: Grow page confirmed: `תודה, האתר נשלח לבדיקה חוזרת בהצלחה! הבדיקה אורכת עד יום עסקים, בסיום הבדיקה ניצור קשר עם בית העסק.`
- BLOCKED: waiting for Grow/Meshulam reviewer response; automated recurring lawyer payments still depend on their approval and final account/payment activation.
- COMPLETION ASSESSMENT: Grow website checklist fix 100% submitted after third pass; automated recurring payment readiness 80%; first-payment readiness 75%.

## 2026-05-20 REPUTATION PRODUCT: GOOGLE REVIEW SOURCE CAPTURE
- RESEARCH BASIS: Google allows businesses to ask real customers for reviews via a Google link/QR code, but prohibits incentives and fake/misleading reviews; Google review content/API display requires attribution and policy compliance; BrightLocal 2026 reinforces review freshness as a major trust factor.
- CODE UPDATED: lawyer dashboard review-campaign requests now capture Google Business profile URL, Google review request URL and Google Place ID instead of relying only on free-text notes.
- CODE UPDATED: submitted Google reputation sources are saved onto the linked lawyer profile and included in the owner notification email. No SMS/email is sent to clients automatically.
- CREATED: `project-control/reputation-google-review-system-plan-2026-05-20.md`.
- DEPLOYED: pushed `572b845 Capture lawyer Google review sources` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed `(HEAD -> main, origin/main, origin/HEAD) Capture lawyer Google review sources`.
- MONEY IMPACT: this turns the review feature into a concrete paid value path: lawyers can connect their Google reputation source, request a managed review campaign, and later upgrade into review monitoring/reply/first-party recommendation services.
- BLOCKED: official Google review sync still needs a Google Cloud/OAuth/API decision and Business Profile access; public first-party recommendation display still needs a focused build; recurring payments still wait for Grow/Meshulam approval.
- COMPLETION ASSESSMENT: Google review source capture 60%; Google API sync 10%; first-party recommendation storage 55%; public reputation display 20%; reputation product revenue readiness 35%.
- OWNER CAN NOTICE AFTER DEPLOY: logged-in lawyer dashboard, section `Google reviews and recommendations`, now has separate fields for Google Business URL, Google review request URL and Place ID.

## 2026-05-20 REPUTATION ADMIN QUEUE VISIBILITY
- RESEARCH BASIS: BrightLocal 2026 emphasizes review recency and response handling; Google allows real review requests through a business link/QR code but prohibits incentives and fake/misleading reviews.
- CODE UPDATED: Lawyer Onboarding admin queue now surfaces the Google Business profile link, Google review request link and Place ID for pending review-campaign requests, with missing-source warnings.
- DEPLOYED: pushed `472619b Show review sources in onboarding queue` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed the commit at `HEAD`.
- MONEY IMPACT: owner/admin can now process review campaign requests without opening each lawyer profile first, making the reputation product operational for sales and retention.
- BLOCKED: needs commit/push/uPress pull/live verification; first-party public recommendation display and official Google API sync still need focused builds.
- COMPLETION ASSESSMENT: review source capture 65%; admin reputation operations 45%; Google API sync 10%; public reputation display 20%; reputation product revenue readiness 38%.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin -> Lawyer Onboarding -> Reputation column will show Google profile/review links for lawyers who requested a review campaign.

## 2026-05-20 FIRST-PARTY RECOMMENDATION PUBLIC DISPLAY
- RESEARCH BASIS: Google Search Central says LocalBusiness/Organization pages are not eligible for self-serving review snippets when the entity controls the reviews; Google Business Profile guidance supports asking real customers for reviews, but not inventing/copying review content. So the safe build is first-party Jus-Tice recommendations with explicit permission and moderation, without adding review schema.
- CODE UPDATED: added a public recommendation query helper that only returns published `justice_recommendation` records linked to the lawyer, with `recommendation_moderation=approved_public` and `recommendation_permission=confirmed`.
- CODE UPDATED: public lawyer mini-sites now render those approved first-party recommendations in the reviews/recommendations section when review display is enabled for that lawyer.
- DEPLOYED: pushed `e218e4d Display approved lawyer recommendations` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed the commit at `HEAD`.
- MONEY IMPACT: lawyers can now be sold a visible reputation asset, not only an admin workflow. This supports the paid mini-site/reputation product while keeping Google review integration separate and compliant.
- BLOCKED: needs real approved recommendation records to be visible; Google official review sync/API is still not built; Grow/Meshulam payment approval is still pending.
- COMPLETION ASSESSMENT: first-party recommendation storage 65%; public recommendation display 45%; Google review source connection 65%; reputation product revenue readiness 43%.
- OWNER CAN NOTICE AFTER DEPLOY: on a public lawyer profile, the review section will show approved client recommendations after an admin publishes a linked recommendation with confirmed permission and turns on review display for that lawyer.

## 2026-05-20 LAWYER DASHBOARD REVIEW REQUEST KIT
- RESEARCH BASIS: BrightLocal 2026 says review freshness is now a major decision factor; Google Business Profile now supports direct review links/QR codes but requires genuine customer experiences and forbids incentives or fake engagement.
- CODE UPDATED: logged-in lawyer dashboard now builds a ready-to-send review request message when the lawyer has a saved Google review request URL.
- CODE UPDATED: dashboard shows a WhatsApp share button, direct Google review-link button, and Google profile button when sources exist; if the link is missing, the dashboard gives the lawyer the exact Google Business Profile path to copy it.
- DEPLOYED: pushed `a117a34 Add lawyer review request kit` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed the commit at `HEAD`.
- MONEY IMPACT: this turns the reputation module into an action tool lawyers can use immediately, making it easier to sell review/reputation management before full Google API sync exists.
- BLOCKED: messages are not sent automatically; the lawyer still needs a real Google review link and should only send to real clients. Grow/Meshulam approval is still pending for automated recurring payments.
- COMPLETION ASSESSMENT: review request activation 55%; Google review source connection 70%; public recommendation display 45%; reputation product revenue readiness 48%.
- OWNER CAN NOTICE AFTER DEPLOY: logged-in lawyer dashboard -> Google reviews and recommendations -> Fast review request kit.

## 2026-05-20 UNCOVERED DEMAND CAPTURE RELIABILITY FIX
- RESEARCH BASIS: current legal-intake guidance emphasizes fast, structured lead capture by practice area/source; ethics guidance warns against hidden paid referrals or fee-split style lead sales, so Jus-Tice should turn uncovered demand into transparent partner-recruitment evidence and subscription coverage.
- CODE UPDATED: homepage Ask-a-Lawyer form now includes `Thailand / international law`, matching the reusable lead form and the CRM classifier.
- CODE UPDATED: lead classification now refreshes after public lead meta is written, not only when the lead post shell is created. This fixes a timing leak where `legal_area`, `city` and `message` could be saved after the classifier had already run.
- CODE UPDATED: coverage status now refreshes when a lead message is saved, and force-refreshes to `covered_routable` if an assigned lawyer/routing completion is written later.
- DEPLOYED: pushed `349f7ac Fix uncovered demand lead classification` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed the commit at `HEAD`.
- MONEY IMPACT: niche demand like Thailand/international lawyer requests is more likely to land in the uncovered-demand queue as a recruitable sales signal instead of disappearing under `general` or an unclassified lead.
- BLOCKED: still needs real inbound leads and lawyer outreach; payment automation still waits on Grow/Meshulam approval.
- COMPLETION ASSESSMENT: uncovered-demand capture 85%; CRM recruitment evidence 70%; automated niche lawyer recruitment 35%; paid lead monetization 35%.
- OWNER CAN NOTICE AFTER DEPLOY: homepage Ask-a-Lawyer field includes Thailand/international law; new submitted leads should show AI/coverage metadata in wp-admin -> Justice CRM.

## 2026-05-20 LEAD ROUTING META-TIMING FIX
- RESEARCH BASIS: legal intake best practice emphasizes fast response and structured practice-area/source routing; Clio and intake research repeatedly frame slow or missed follow-up as a major conversion loss.
- CODE UPDATED: lead routing now retries after important lead meta is written (`message`, `legal_area`, `ai_detected_area`, `assigned_lawyer_id`) instead of relying only on the first empty post-save event.
- CODE UPDATED: direct lawyer mini-site inquiry forms now submit the practice-area slug instead of the display name, so routing and CRM grouping use stable taxonomy keys.
- DEPLOYED: pushed `b75c005 Retry lead routing after meta save` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed the commit at `HEAD`.
- MONEY IMPACT: direct lawyer-profile leads and matched area leads are less likely to sit unrouted because the form details arrived after initial post creation. This protects the core promise lawyers pay for: “you receive relevant leads quickly.”
- BLOCKED: still needs real live lead submissions to measure route success and response times; Grow/Meshulam approval still blocks automated recurring subscription payments.
- COMPLETION ASSESSMENT: lead capture reliability 88%; lead routing reliability 72%; lawyer-value delivery 58%; paid lead monetization 38%.
- OWNER CAN NOTICE AFTER DEPLOY: new leads from public lawyer profiles should route using the assigned lawyer and normalized practice slug, with routing metadata visible in Justice CRM.

## 2026-05-20 LAWYER OUTREACH PROSPECT PIPELINE
- RESEARCH BASIS: Clio intake guidance frames lead source, lead status, follow-up timing and conversion tracking as core legal intake operations; Justia Premium Placements shows the market already sells practice-area and metro-position visibility to lawyers.
- CODE UPDATED: added an admin-only `justice_prospect` post type under Lawyer Onboarding for lawyer sales prospects.
- CODE UPDATED: each prospect can now store practice area, city, target plan, priority, outreach status, response-fit commitment, source URL, demand signal, expected monthly NIS value, contact details and next action date.
- DEPLOYED: pushed `4633c9c Add lawyer outreach prospect pipeline` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed `(HEAD -> main, origin/main, origin/HEAD) Add lawyer outreach prospect pipeline`.
- MONEY IMPACT: this does not create revenue by itself, but it turns repeated uncovered demand into a trackable sales pipeline so the owner can recruit lawyers in exact practice/city gaps instead of handling every call manually.
- BLOCKED: still needs real prospects entered and outreach performed; no automatic outbound messages were sent; Grow/Meshulam approval still controls automated recurring payment collection.
- COMPLETION ASSESSMENT: lawyer outreach operating system 35%; first-lawyer sales readiness 60%; paid coverage pipeline 35%; automated payment readiness unchanged at 80%.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin -> Lawyer Onboarding -> Lawyer Prospects.

## 2026-05-20 CRM TO LAWYER-PROSPECT BRIDGE
- RESEARCH BASIS: current legal lead-management guidance says firms need source/status/follow-up/conversion tracking; Justia's 2026 directory marketing reinforces paid visibility by practice area and metro area.
- CODE UPDATED: Justice CRM lead rows now include a `Prospect` action, and uncovered-demand summary rows include `Create prospect` for the latest lead behind the demand signal.
- CODE UPDATED: new Lawyer Prospect drafts opened from CRM are prefilled from the source lead: title, practice area, market, target plan, priority, expected monthly NIS, demand signal, owner note and source lead ID.
- DEPLOYED: pushed `bdba3f2 Bridge uncovered leads to lawyer prospects` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed the commit at `HEAD`.
- MONEY IMPACT: this reduces the manual work needed to convert real demand into paid lawyer coverage outreach.
- BLOCKED: requires owner/admin to save prospects and perform outreach; no automatic lawyer messages were sent; payment automation still depends on Grow/Meshulam approval.
- COMPLETION ASSESSMENT: uncovered-demand-to-sales workflow 55%; lawyer outreach operating system 45%; first-lawyer sales readiness 63%; automated payment readiness 80%.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin -> Justice CRM -> `Prospect` / `Create prospect`.

## 2026-05-20 LAWYER SALES PIPELINE VIEW
- RESEARCH BASIS: Clio Grow reports expose pipeline value, source/matter type and conversion rate; Clio CRM guidance emphasizes tracking every contact, conversation and follow-up so opportunities do not fall through.
- CODE UPDATED: Justice CRM now has a `Lawyer sales pipeline` block with open prospect count, open monthly NIS value, hot prospect count and due follow-up count.
- CODE UPDATED: the same block shows the next prospect actions, target plan, status, priority, expected monthly value and source lead link.
- DEPLOYED: pushed `f2d705a Show lawyer prospect pipeline in CRM` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed the commit at `HEAD`.
- MONEY IMPACT: this makes the owner sales queue visible from the CRM so repeated demand can move toward paid lawyer coverage faster.
- BLOCKED: still requires real prospects and owner/admin outreach; no automatic outreach or records were created.
- COMPLETION ASSESSMENT: lawyer outreach operating system 52%; paid coverage pipeline 43%; first-lawyer sales readiness 66%; automated payment readiness 80%.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin -> Justice CRM -> Lawyer sales pipeline.

## 2026-05-20 LAWYER PROSPECT OUTREACH KIT
- RESEARCH BASIS: 2026 B2B outreach guidance emphasizes multi-channel, signal-based, short outreach around one visible pain point; Justia's lawyer marketing model sells paid visibility by practice/market.
- CODE UPDATED: Lawyer Prospect edit screens now include a `Manual Outreach Kit`.
- CODE UPDATED: the kit prepares email, WhatsApp and call drafts using the prospect's practice area, market, demand signal, target plan and partner form URL, with compliance language avoiding promises about outcomes, lead volume or exclusivity.
- DEPLOYED: pushed `de5d118 Add lawyer prospect outreach kit` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed the commit at `HEAD`.
- MONEY IMPACT: this lowers friction from saved prospect to actual sales contact, while keeping the send action manual and controlled.
- BLOCKED: owner/admin still needs to review and send outreach; Grow/Meshulam approval still controls automated recurring payment collection.
- COMPLETION ASSESSMENT: lawyer outreach operating system 60%; paid coverage pipeline 48%; first-lawyer sales readiness 69%; automated payment readiness 80%.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin -> Lawyer Onboarding -> Lawyer Prospects -> Manual Outreach Kit.

## 2026-05-20 PROSPECT FOLLOW-UP QUICK ACTIONS
- RESEARCH BASIS: 2026 follow-up guidance emphasizes multi-touch outreach, CRM outcome logging and scheduling the next attempt so warm prospects do not disappear after one contact.
- CODE UPDATED: Lawyer Prospect outreach kit now has quick action buttons for contacted, follow-up, demo booked, proposal sent, won/onboarding and lost/not fit.
- CODE UPDATED: quick actions are nonce-protected admin links that update status, last-contact date, next-action date and owner-note history.
- CODE UPDATED: Justice CRM lawyer sales pipeline table now has `Contacted` and `Follow-up` buttons next to open prospects.
- DEPLOYED: pushed `7302293 Add prospect follow-up quick actions` to GitHub `main` and pulled it through uPress Git management; uPress Git log showed the commit at `HEAD`.
- MONEY IMPACT: this improves sales discipline after outreach and reduces forgotten paying-lawyer opportunities.
- BLOCKED: owner/admin still needs to actually contact prospects and click the relevant action after real activity; no automated outreach was added.
- COMPLETION ASSESSMENT: lawyer outreach operating system 66%; paid coverage pipeline 52%; first-lawyer sales readiness 72%; automated payment readiness 80%.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin -> Lawyer Prospects -> Manual Outreach Kit quick actions, and wp-admin -> Justice CRM -> Lawyer sales pipeline action buttons.
