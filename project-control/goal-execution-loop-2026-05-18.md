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
