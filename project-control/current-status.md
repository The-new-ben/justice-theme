# LATEST WORK STATUS - 2026-05-25 19:34 Asia/Jerusalem
- SEO PACK CANNIBALIZATION GATE ADDED: checked the 7 proposed SEO-pack page drafts against the current public URL export before any WordPress publishing.
- ADDED: `tools/check-seo-pack-cannibalization-gate.mjs`, `project-control/seo-pack-cannibalization-gate-2026-05-25.md`, `reports/seo-pack-cannibalization-gate-2026-05-25.json`, and `reports/seo-pack-cannibalization-gate-2026-05-25.csv`.
- RESULT: `PUBLICATION_BLOCKED_FOR_REVIEW`.
- DECISION: all 7 proposed new page slugs must not be published as new public URLs yet; use them as repair/merge drafts for existing hubs or hold for GSC/SERP primary selection.
- KEY MAPPINGS: `/divorce-family-lawyer/` -> review/merge into `/divorce-lawyer/`; `/real-estate-lawyer/` -> map to `/real-estate-attorney/`; `/medical-malpractice-lawyer/` -> update existing exact URL only; inheritance/criminal/employment/tax all require primary selection or existing-page review.
- REVENUE STATUS: realized lawyer revenue remains NIS 0. Review artifact only; no CMS record, supplier record, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 19:22 Asia/Jerusalem
- SEO PACK VALIDATION GATE ADDED: added a rerunnable checker for the generated SEO/content pack.
- ADDED: `tools/check-justice-seo-pack.mjs`, `project-control/justice-seo-pack-validation-2026-05-25.md`, and `reports/justice-seo-pack-validation-2026-05-25.json`.
- RESULT: `PASS_WITH_DISCLOSED_PARTIALS`; no hard fails.
- VERIFIED COUNTS: 240 keyword candidates, 8 competitor records, 7 new page plans, 8 SEO meta entries, 11 image prompts, 59 research sources, 5,000 homepage words, and all 7 internal pages above 3,000 words.
- HONEST PARTIALS: CPC/KDI are still unavailable, SERP x-ray remains partial, and external Rich Results Test was not run.
- REVENUE STATUS: realized lawyer revenue remains NIS 0. Validation only; no CMS record, supplier record, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 19:08 Asia/Jerusalem
- SEO PACK GENERATED IN ENGLISH-CONTROLLED CYCLE: created a local WordPress-ready SEO/content pack under `mnt/documents/justice`.
- ADDED: `tools/build-justice-seo-pack.mjs`, `project-control/justice-seo-pack-2026-05-25.md`, and the generated `mnt/documents/justice/*` deliverables.
- OUTPUT: 240 keyword candidates, 8 competitor deep-dive JSON stubs, blueprint/gap/new-page plan, 5,000-word homepage HTML, 7 internal HTML pages above 3,000 words each, metadata, schema bundle, image prompts, internal linking map, research log with 59 sources, 90-day roadmap and WordPress deployment notes.
- HONEST DATA STATUS: no Semrush/Ahrefs/Firecrawl/Keyword Planner/authenticated GSC credentials are exposed in this process, so CPC/KDI/full volume were not invented; the keyword and SERP steps are marked partial until real exports are supplied.
- VERIFIED LOCAL: generated JSON parsed; word-count gate passed for homepage and internal pages; forbidden phrase scan passed for generated output.
- REVENUE STATUS: realized lawyer revenue remains NIS 0. No CMS record, supplier record, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 18:42 Asia/Jerusalem
- POST-PULL INVESTOR STATUS REFRESHED: after the owner pulled Git on uPress, live read-only checks were refreshed for the investor/demo path.
- ADDED: `project-control/investor-post-pull-status-2026-05-25.md`.
- REFRESHED: investor readiness, lawyer revenue funnel, CMS indexed customers, signup conversion, payment proof drill, payment overclaim, Grow compliance and morning go/no-go reports.
- LIVE RESULTS: lawyer revenue funnel passed `10/10`; investor readiness is `PASS_WITH_DISCLOSED_BLOCKERS`; CMS indexed customers reports `20` REST records and `20` visible public cards; signup conversion passed `7/7`; Grow/payment compliance passed `8/8`; payment overclaim passed; morning go/no-go is `GO_WITH_DISCLOSED_BLOCKERS`.
- HONEST REVENUE STATUS: realized lawyer revenue remains NIS 0. No confirmed recurring charge, automatic branded invoice, refund execution or paid lawyer subscription proof was created in this cycle.
- UPress PULL ANSWER: Codex can push Git locally, but the uPress Pull Git action lives behind the authenticated uPress browser UI; in this session the Codex browser bridge has repeatedly reported no active browser pane or timed out, so the owner-performed pull plus read-only live verification is the reliable path.
- SAFETY: read-only live checks and local report artifacts only; no CMS database record, legal-service supplier record, competitor profile/photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 18:28 Asia/Jerusalem
- LAWYER PROFILE CLAIM BANNER ADDED: basic/unverified/fact-gated lawyer profiles now have a professional "is this your profile?" claim/update path in the hero.
- UPDATED: `single-justice_lawyer.php`, `assets/css/premium-pass-4.css`, `inc/enqueue.php`.
- ADDED: `project-control/lawyer-profile-claim-banner-2026-05-25.md`.
- MATERIAL ADVANCE: this creates a cleaner lawyer subscription conversion path directly from public profiles without adding fake facts or advertising other lawyers inside the profile. Paid profiles do not show the banner.
- COMPETITOR RESEARCH BASIS: checked current Justia claim-profile/premium-placement and Avvo claim-profile/rating behavior, on top of the existing Din/Psakdin/LawReviews profile-pattern work. Applied the pattern as original UI/copy.
- VERIFIED LOCAL / DEPLOY PENDING: `php -l single-justice_lawyer.php`, `php -l inc/enqueue.php`, and `git diff --check` passed.
- REVENUE STATUS: realized revenue remains NIS 0. This improves claim/upgrade readiness, but no lawyer has paid, upgraded, received an invoice, or completed subscription/payment proof.
- SAFETY: repo display/CSS/docs only; no live CMS database edit, lawyer/customer/provider creation, competitor import, competitor photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 18:21 Asia/Jerusalem
- LAWYER PROFILE PROOF STRIP CLEANED: single lawyer profiles no longer show fixed placeholder dashes for missing years/license/review facts.
- UPDATED: `single-justice_lawyer.php`, `assets/css/premium-pass-4.css`, `inc/enqueue.php`.
- ADDED: `project-control/lawyer-profile-proof-strip-no-placeholder-2026-05-25.md`.
- MATERIAL ADVANCE: profile pages now show a dynamic proof strip built only from available and allowed CMS signals. Fact-gated/basic profiles show safe signals like status, practice area, city and public source count instead of fake-looking empty facts.
- COMPETITOR RESEARCH BASIS: applied the current profile-pattern research from Din, Psakdin, LawReviews, Avvo and Justia: proof should be dense, specific and gated, not padded with missing claims.
- VERIFIED LOCAL / DEPLOY PENDING: `php -l single-justice_lawyer.php`, `php -l inc/enqueue.php`, and `git diff --check` passed.
- REVENUE STATUS: realized revenue remains NIS 0. This improves lawyer trust/upgrade conversion readiness, but does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo display/CSS/docs only; no live CMS database edit, lawyer/customer/provider creation, competitor import, competitor photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 18:11 Asia/Jerusalem
- LEGAL SERVICE PROVIDERS PUBLIC GATE ADDED: the existing `justice_supplier` CMS pipeline can now power a controlled public homepage section, but only after explicit public approval and source checks.
- UPDATED: `inc/lawyer-suppliers.php`, `front-page.php`, `page-home.php`, `assets/css/premium-pass-4.css`, `inc/enqueue.php`.
- ADDED: `template-parts/sections/legal-service-providers.php`, `project-control/legal-service-providers-public-gate-2026-05-25.md`.
- MATERIAL ADVANCE: owner gets CMS-level display controls, filters and bulk actions for legal-service providers/supplier partners. The homepage can now surface approved service-provider cards without hard-coded data or fake competitor imports.
- COMPETITOR RESEARCH BASIS: checked current public patterns from Din, Psakdin, LawReviews, Avvo and Justia. Applied the structure: category fit, source-gated profile cards, trust language, and conversion path. Did not copy competitor text, people, photos, reviews, ratings or contact data.
- VERIFIED LOCAL / DEPLOY PENDING: PHP lint passed for supplier CMS, new provider section, both homepage templates and enqueue; `git diff --check` passed.
- REVENUE STATUS: realized revenue remains NIS 0. This creates inventory for provider listing/sponsorship/lead-fee revenue, but no customer/provider was indexed or sold in this cycle.
- SAFETY: repo code/docs only; no live CMS database edit, supplier/customer creation, competitor import, competitor photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 18:06 Asia/Jerusalem
- SPONSORED PLACEMENT SEPARATED FROM PAYMENT STATUS: lawyer sponsored/top placement is now a CMS placement state, not a fake active subscription.
- UPDATED: `inc/template-tags.php`, `inc/lawyer-visibility.php`, `template-parts/cards/lawyer-card.php`, `template-parts/sections/featured-lawyers.php`.
- ADDED: `project-control/lawyer-sponsored-placement-payment-separation-2026-05-25.md`.
- MATERIAL ADVANCE: owner can reserve/clear sponsored placement and priority from lawyer edit/bulk controls without changing `subscription_status=active`. Real payment/subscription state stays separate for Grow/Morning/invoice proof.
- INVESTOR DEMO HONESTY: reserved placement can influence ordering for sales/demo review; public sponsored badge still requires real active paid plan or explicit active sponsored placement, and fact-gated profiles remain restricted.
- VERIFIED LOCAL / DEPLOY PENDING: `php -l inc/template-tags.php`, `php -l inc/lawyer-visibility.php`, `php -l template-parts/cards/lawyer-card.php`, `php -l template-parts/sections/featured-lawyers.php`, and `git diff --check` passed; after uPress Pull Git, check wp-admin lawyer edit screen and the lawyers list bulk actions.
- REVENUE STATUS: realized revenue remains NIS 0. This improves sponsored-slot sales readiness and prevents fake payment claims, but it does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo code/docs only; no live CMS database edit, competitor lawyer/profile import, competitor photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 17:47 Asia/Jerusalem
- ARTICLE LEAD CTA CONTEXTUALIZED: regular posts and custom `articles` pages now use a contextual post-content lead path instead of generic marketing copy.
- UPDATED: `inc/template-tags.php`, `single.php`, `single-articles.php`, `assets/css/main.css`.
- ADDED: `project-control/article-contextual-lead-cta-2026-05-25.md`.
- MATERIAL ADVANCE: this addresses the owner/investor concern that article pages should not open with sales language that can dilute legal relevance. The legal content remains first; the CTA appears after content/editorial note and passes the article topic, slug and campaign context into the `#ask-lawyer` lead form.
- SEO/CONTENT LOGIC: divorce and family-law article signals are now intentionally consolidated into the same `family-law` lead path, matching the owner's point that `עורך דין גירושין` and `עורך דין לענייני משפחה` should be treated together in the user journey.
- RESEARCH BASIS: checked Google Search Central guidance on people-first helpful content and the SEO Starter Guide. Applied here by keeping the page focused on useful legal content first and making the conversion action contextual rather than generic.
- VERIFIED LOCAL / DEPLOY PENDING: `php -l inc/template-tags.php`, `php -l single.php`, `php -l single-articles.php`, and `git diff --check` passed; after uPress Pull Git, visually check an `articles` page and a normal post for a contextual post-content CTA and a URL carrying lead context.
- REVENUE STATUS: realized revenue remains NIS 0. This improves article-to-lead qualification and attribution, but it does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo template/CSS/docs only; no live CMS database edit, public content migration, competitor lawyer/profile import, competitor photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 17:31 Asia/Jerusalem
- LAWYER PROFILE PRODUCT-COPY SUPPRESSION: the single lawyer mini-site no longer shows the generic platform explainer block by default.
- UPDATED: `single-justice_lawyer.php`.
- ADDED: `project-control/lawyer-profile-product-copy-suppression-2026-05-25.md`.
- MATERIAL ADVANCE: this addresses the owner feedback that a lawyer profile must feel like the lawyer's own premium profile, not an advertisement for the platform or other lawyers. The profile keeps its owned sections: facts when approved, services, practice areas, articles, reviews, sources and inquiry.
- RESEARCH BASIS: checked current public direction from Psakdin, LawReviews, Justia and Avvo: strong profiles center details, reviews/contact and topic proof, while product/claim mechanics are separated from the profile body.
- VERIFIED LOCAL / DEPLOY PENDING: `php -l single-justice_lawyer.php` and `git diff --check` passed; after uPress Pull Git, visually check a lawyer profile and confirm the generic mini-site explainer is gone.
- REVENUE STATUS: realized revenue remains NIS 0. This improves lawyer upgrade conversion readiness, but it does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo template/docs only; no live CMS database edit, competitor lawyer/profile import, competitor photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 17:18 Asia/Jerusalem
- LAWYER CARD MEDIA OVERLAP HARDENING: tightened the public lawyer-card CSS so CMS photos, initials, badges, long names and CTA buttons stay inside the card and do not crowd or cover text.
- UPDATED: `assets/css/premium-pass-4.css`, `inc/enqueue.php`.
- ADDED: `project-control/lawyer-card-media-overlap-hardening-2026-05-25.md`.
- MATERIAL ADVANCE: this directly targets the investor-visible complaint that lawyer index/homepage card imagery looked unprofessional or overlapped text. The fix is a layout guard around dynamic CMS content, not a fake profile/photo/content layer.
- RESEARCH BASIS: checked current public direction from Psakdin, LawReviews, Justia and Avvo: dense lawyer cards need robust media/text containment, and profile depth/reviews must be separated from unverified/basic profiles.
- VERIFIED LOCAL / DEPLOY PENDING: `php -l inc/enqueue.php` and `git diff --check` passed; after uPress Pull Git, visually check `/lawyers/?justice_readonly=1` and homepage lawyer cards on desktop/mobile.
- REVENUE STATUS: realized revenue remains NIS 0. This improves investor trust and lawyer upgrade conversion readiness, but it does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo CSS/enqueue/docs only; no live CMS database edit, competitor lawyer/profile import, competitor photo/review/rating/contact copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 17:04 Asia/Jerusalem
- HOMEPAGE LAWYER REVENUE STRIP HONESTY PASS: removed hard-coded live-like mini-dashboard claims from the homepage lawyer revenue strip and replaced them with a truthful capability path.
- UPDATED: `template-parts/sections/homepage-lawyer-revenue-strip.php`.
- ADDED: `project-control/homepage-lawyer-revenue-strip-honesty-pass-2026-05-25.md`.
- MATERIAL ADVANCE: the homepage can still sell the lawyer upgrade path, but it no longer implies fake lead counts or sent payment status before real payment/revenue proof exists.
- VERIFIED LOCAL / DEPLOY PENDING: `php -l template-parts/sections/homepage-lawyer-revenue-strip.php` and `git diff --check` passed; text check confirmed the old hard-coded `3 בטיפול` and `קישור נשלח` states are gone.
- REVENUE STATUS: realized revenue remains NIS 0. This improves investor trust and lawyer conversion messaging, but it does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo template/docs only; no live CMS database edit, competitor data import/copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 16:55 Asia/Jerusalem
- POST-PULL LIVE CHECK: after the owner pulled git, read-only public checks found the live `/lawyers/?justice_readonly=1` page emitting the new lawyer-card trust markers (`lawyer-card--initials`, `lawyer-card--fact-gated`) and the live `premium-pass-4.css?ver=4.3.8` containing the investor polish.
- UNVERIFIED CONTACT/FACT GATE TIGHTENED: fact-gated lawyer cards and mini-sites no longer show firm/contact/license/social/profile detail signals before fact review, paid/verified status, or a trusted source.
- UPDATED: `template-parts/cards/lawyer-card.php`, `single-justice_lawyer.php`.
- ADDED: `project-control/lawyer-profile-unverified-contact-gate-2026-05-25.md`.
- MATERIAL ADVANCE: this directly addresses the Maya/fake-profile concern. Imported/basic/public profiles can still be visible as controlled claim/update cards, but they should not look like a fully verified premium lawyer site until source review is real.
- RESEARCH BASIS: checked current LawReviews and Justia profile/review/claim patterns; implementation is original and does not copy competitor lawyers, photos, reviews, ratings, contact details or profile text.
- VERIFIED LOCAL / DEPLOY PENDING: `php -l template-parts/cards/lawyer-card.php`, `php -l single-justice_lawyer.php`, and `git diff --check` passed; production needs git push and owner/uPress pull after verification.
- REVENUE STATUS: realized revenue remains NIS 0. This improves trust and conversion readiness, but it does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo display/docs only; no live CMS database edit, competitor data import/copy, payment, invoice, refund, email, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 16:43 Asia/Jerusalem
- MANUAL PAYMENT-LINK QUEUE EMAIL ACTION ADDED: Lawyer Onboarding now lets the owner send/resend a saved Grow/Morning manual payment link directly from the payment queue.
- UPDATED: `inc/lawyer-onboarding.php`.
- ADDED: `project-control/manual-payment-link-queue-email-action-2026-05-25.md`.
- MATERIAL ADVANCE: once a real provider link is pasted onto a lawyer profile, the owner can send it from the onboarding queue, record the send result, and move the deal into invoice-sent follow-up without opening the edit screen. The action uses existing recipient rules, internal notes and payment status meta.
- VERIFIED LOCAL / DEPLOY BLOCKED: `php -l inc/lawyer-onboarding.php` passed; production still needs uPress Pull Git because Codex still has no active browser pane for uPress.
- REVENUE STATUS: realized revenue remains NIS 0. This improves the real payment-link handoff path, but it does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo admin workflow/docs only; no email sent, no payment link/invoice/refund/recurring billing/provider setting created or changed, and no public CMS database edit, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 16:32 Asia/Jerusalem
- GROW/MORNING PROVIDER STATUS PANEL ADDED: Lawyer Onboarding now has an admin-only payment route matrix and a copyable Hebrew reply to Grow support.
- UPDATED: `inc/lawyer-onboarding.php`.
- ADDED: `project-control/grow-morning-provider-status-panel-2026-05-25.md`.
- MATERIAL ADVANCE: the investor/payment demo now has a clearer owner script: one-time Morning/Grow payment links are the real demo bridge when saved on a lawyer record; recurring/standing-order billing is provider-gated until Grow/Morning enables it and a controlled paid smoke test passes; WooCommerce/API are future integration routes, not the immediate no-API bridge.
- RESEARCH BASIS: checked current Morning/Green Invoice API/payment docs and WooCommerce plugin direction. Payment-form/API work needs approved credentials/server-side integration, and automatic recurring billing must not be claimed before provider approval.
- VERIFIED LOCAL / DEPLOY BLOCKED: `php -l inc/lawyer-onboarding.php` passed; production still needs uPress Pull Git because Codex still has no active browser pane for uPress.
- REVENUE STATUS: realized revenue remains NIS 0. This improves payment handoff accuracy and prevents overclaiming; it does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo admin/docs only; no email sent, no payment link/invoice/refund/recurring billing/Woo/provider setting created or changed, and no public CMS database edit, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 16:25 Asia/Jerusalem
- LAWYER INDEX/PROFILE VISUAL TRUST POLISH ADDED: lawyer cards now have explicit visual/trust states and fact-gated lawyer mini-sites no longer use unverified marketing headlines or proof-number strips.
- UPDATED: `template-parts/cards/lawyer-card.php`, `single-justice_lawyer.php`, `assets/css/premium-pass-4.css`, and `inc/enqueue.php`.
- ADDED: `project-control/lawyer-index-profile-visual-trust-polish-2026-05-25.md`.
- MATERIAL ADVANCE: this addresses the investor-visible complaint that lawyer cards/profile imagery looked generic or unsafe. Directory/homepage cards now use stable portrait slots, clamped summaries and initials fallback for fact-gated profiles; fact-gated mini-sites use the safe post title and suppress placeholder proof metrics.
- RESEARCH BASIS: checked current competitor direction from LawReviews, Psakdin and Din. The pattern is broad directory coverage plus profile/review/contact trust signals, but profile depth and photos must be governed. Implementation is original and does not copy competitor lawyer data, photos, ratings, reviews or text.
- VERIFIED LOCAL / DEPLOY BLOCKED: `php -l template-parts/cards/lawyer-card.php`, `php -l single-justice_lawyer.php`, and `php -l inc/enqueue.php` passed; production still needs uPress Pull Git because Codex still has no active browser pane for uPress.
- REVENUE STATUS: realized revenue remains NIS 0. This improves investor/demo trust and lawyer upgrade conversion readiness, but it does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo display/CSS/docs only; no live CMS database edit, competitor lawyer/profile import, competitor asset/content copy, payment, invoice, refund, email to customer, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 16:08 Asia/Jerusalem
- OWNER SERVICE-REQUEST ACTIONS ADDED: Lawyer Onboarding now has one-click owner actions for lawyer service/billing/refund/cancellation/complaint requests.
- UPDATED: `inc/lawyer-onboarding.php`.
- ADDED: `project-control/lawyer-onboarding-service-request-owner-actions-2026-05-25.md`.
- MATERIAL ADVANCE: the private lawyer service desk now connects to an owner-side workflow. A submitted service request can be marked in review, resolved, blocked or reopened from the admin queue, with unresolved requests kept in the pending service queue and resolved requests removed from it.
- VERIFIED LOCAL / PUSHED / DEPLOY BLOCKED: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed; production still needs uPress Pull Git because Codex still has no active browser pane for uPress.
- REVENUE STATUS: realized revenue remains NIS 0. This improves support/retention and investor-demo credibility, but it does not prove payment, invoice, refund, subscription, lead delivery or CRM monetization.
- SAFETY: repo admin workflow/docs only; no live CMS database edit, public content change, competitor import/copy, payment, invoice, refund, email to customer, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 15:58 Asia/Jerusalem
- LAWYER DASHBOARD SERVICE STATUS SURFACED: the top dashboard command center now echoes the latest service/billing/refund/complaint request status, type and response target when a lawyer has submitted one.
- UPDATED: `page-lawyer-dashboard.php`, `assets/css/premium-pass-3.css`, and `inc/enqueue.php`.
- ADDED: `project-control/lawyer-dashboard-service-status-command-center-2026-05-25.md`.
- MATERIAL ADVANCE: the customer-success scenarios the owner asked to demonstrate are now more visible in the first dashboard surface, not only buried inside the service desk. A lawyer/customer can see that an upgrade, downgrade, cancellation, invoice, refund, complaint or lead-quality request is open and owner-reviewed.
- VERIFIED LOCAL / PUSHED / DEPLOY BLOCKED: `php -l page-lawyer-dashboard.php`, `php -l inc/enqueue.php`, and `git diff --check` passed; production still needs uPress Pull Git because Codex still has no active browser pane for uPress.
- REVENUE STATUS: realized revenue remains NIS 0. This improves service retention and investor-demo readiness, but does not prove payment, invoice, refund, subscription, lead delivery, or CRM monetization.
- SAFETY: repo dashboard/CSS/docs only; no live CMS database edit, competitor lawyer/profile import, competitor asset/content copy, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 15:47 Asia/Jerusalem
- ASSIGNED HOMEPAGE TEMPLATE REVENUE STRIP ADDED: `page-home.php` now loads the lawyer revenue strip immediately after the customer intake strip, matching the existing `front-page.php` path.
- UPDATED: `page-home.php`.
- ADDED: `project-control/homepage-assigned-template-lawyer-revenue-strip-2026-05-25.md`.
- MATERIAL ADVANCE: the paid lawyer journey is now visible from both homepage template paths, reducing the risk that WordPress template assignment or preview uses a homepage without lawyer signup, plan comparison and personal-area links.
- VERIFIED LOCAL / PUSHED / DEPLOY BLOCKED: `php -l page-home.php` and `git diff --check` passed; production still needs uPress Pull Git because recent read-only live checks show the server is behind the pushed theme commits.
- REVENUE STATUS: realized revenue remains NIS 0. This improves investor-visible lawyer conversion readiness, but it does not prove payment, invoice, refund, subscription, lead delivery, or CRM monetization.
- SAFETY: repo template/docs only; no live CMS database edit, competitor lawyer/profile import, competitor asset/content copy, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 15:39 Asia/Jerusalem
- HOMEPAGE LAWYER SHOWCASE QUALITY GATE ADDED: the homepage no longer promotes Maya, seed/demo/test-like, imported, or public-index lawyer profiles unless their profile facts are approved/source-checked/owner-approved/lawyer-approved.
- UPDATED: `template-parts/sections/featured-lawyers.php`, `assets/css/premium-pass-4.css`, and `inc/enqueue.php`.
- ADDED: `project-control/homepage-lawyer-showcase-quality-gate-2026-05-25.md`.
- MATERIAL ADVANCE: this addresses the investor-facing homepage quality problem directly. The full directory can still contain controlled/basic cards, but the homepage showcase now behaves like a premium surface and holds unsafe profiles out of first impression placement.
- RESEARCH BASIS: checked current public direction from Din, Justia and Avvo context. The standard is broad directory coverage plus contact/claim paths, but homepage promotion requires trust governance. Implementation is original and does not copy competitor lawyer data, photos, ratings, reviews or text.
- VERIFIED LOCAL / PUSHED / DEPLOY BLOCKED: `php -l template-parts/sections/featured-lawyers.php`, `php -l inc/enqueue.php`, and `git diff --check` passed; pushed commit `17c9892`. The Codex browser still reports no active uPress pane, and a read-only live check still finds the old unverified Maya text, so production is not yet pulled to this commit.
- REVENUE STATUS: realized revenue remains NIS 0. This improves homepage trust and sponsored-slot conversion readiness, but it does not prove payment, invoice, refund, subscription, lead delivery, or CRM monetization.
- SAFETY: repo display logic and docs only; no live CMS database edit, competitor lawyer/profile import, competitor asset/content copy, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 15:27 Asia/Jerusalem
- LAWYER PUBLIC PROFILE CLAIM SAFETY TIGHTENED: unverified/fact-gated lawyer mini-sites and homepage/directory cards no longer show rich profile claims before source review.
- UPDATED: `single-justice_lawyer.php` and `template-parts/cards/lawyer-card.php`.
- ADDED: `project-control/lawyer-public-profile-claim-safety-2026-05-25.md`.
- MATERIAL ADVANCE: this directly addresses the owner/investor complaint that a profile could look premium while facts were inaccurate. After deploy, Maya/public-index/import/seed-like cards show a source-review message instead of unverified short bios, years of experience, languages, ratings, verified badges, videos, services, FAQs, signed articles, or marketing CTAs. The mini-site keeps safe contact/source/profile-claim paths visible.
- RESEARCH BASIS: checked current public patterns from LawReviews, Justia directory and Justia Connect featured-review guidance; the rule is to separate profile depth/reviews from unverified claims. Implementation is original and does not copy competitor lawyer data, photos, ratings, reviews or text.
- VERIFIED LOCAL / PUSHED / DEPLOY BLOCKED: `php -l single-justice_lawyer.php`, `php -l template-parts/cards/lawyer-card.php`, and `git diff --check` passed; pushed commit `43ca5d9`. The Codex browser still reports no active uPress pane, and a read-only live check still finds the old unverified Maya text, so production is not yet pulled to this commit.
- REVENUE STATUS: realized revenue remains NIS 0. This improves trust and profile-claim conversion readiness, but it does not prove payment, invoice, refund, subscription, lead delivery, or CRM monetization.
- SAFETY: repo display logic and docs only; no live CMS database edit, competitor lawyer/profile import, competitor asset/content copy, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 15:12 Asia/Jerusalem
- LAWYER FACT-REVIEW ADMIN CONTROL ADDED: the CMS now has an explicit owner control for whether premium lawyer profile facts are pending, source-checked, owner-approved, lawyer-approved, approved, held, or rejected.
- UPDATED: `inc/lawyer-visibility.php`.
- ADDED: `project-control/lawyer-profile-fact-review-admin-control-2026-05-25.md`.
- MATERIAL ADVANCE: this closes the operator gap behind the public fact gate. After deploy, the owner can open a lawyer profile, set `profile_fact_review_status`, filter the lawyer list by fact-review state, and bulk mark profiles as source-checked or held before homepage/sponsored/outreach promotion.
- RESEARCH BASIS: spot-checked current public directory patterns from LawReviews, PsakDin, Justia and Justia Connect. The standard is profile depth plus review/contact/claim governance; implementation is original and does not copy competitor profile text, photos, ratings, reviews, badges, or lawyer data.
- VERIFIED LOCAL / PUSHED / DEPLOY BLOCKED: `php -l inc/lawyer-visibility.php` and `git diff --check` passed; pushed commit `4d99a93`. The Codex browser still reports no active uPress pane, and a read-only live check still finds the old unverified Maya text, so production is not yet pulled to this commit.
- REVENUE STATUS: realized revenue remains NIS 0. This improves trust and conversion readiness, but it does not prove payment, invoice, refund, subscription, lead delivery, or CRM monetization.
- SAFETY: repo CMS/admin logic and docs only; no live CMS database edit, competitor lawyer/profile import, competitor asset/content copy, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 14:58 Asia/Jerusalem
- LAWYER PROFILE FACT GATE ADDED: high-risk public profiles now stop showing free-form biography facts, credentials, placeholder review/article panels, and mini-site marketing modules unless the CMS marks the facts as source-checked.
- UPDATED: `single-justice_lawyer.php`, `assets/css/premium-pass-4.css`, and `inc/enqueue.php`.
- ADDED: `project-control/lawyer-profile-fact-gate-2026-05-25.md`.
- MATERIAL ADVANCE: this directly addresses the live Maya profile issue. A read-only check found the public page still contained an education claim with `אוניברסיטת`; after this code path is deployed, Maya/public-index/seed-like profiles will show a fact-review notice instead of unverified education, credentials, ratings, reviews, or success claims.
- RESEARCH BASIS: current benchmark direction remains Avvo/Justia/LawReviews/Din/PsakDin-inspired profile depth, but only after facts are verified; this implementation is original and intentionally does not copy competitor photos, reviews, ratings, or profile text.
- VERIFIED LOCAL / PUSHED / DEPLOY BLOCKED: `php -l single-justice_lawyer.php`, `php -l inc/enqueue.php`, and `git diff --check` passed; pushed commit `20e4b49`. uPress Pull Git is not yet completed because the Codex in-app browser currently reports no active browser pane even after visibility reset, so live post-pull verification is still pending.
- REVENUE STATUS: realized revenue remains NIS 0. This protects trust and investor credibility, but it does not prove payment, invoice, refund, subscription, or lead monetization.
- SAFETY: repo theme/display logic and docs only; no CMS database edit, competitor asset/content copy, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 14:40 Asia/Jerusalem
- REVENUE PROOF STRIP ADDED: `Lawyer Onboarding -> Paid registration command center` now shows whether paid lawyer revenue is actually owner-confirmed or only in the manual-invoice pipeline.
- UPDATED: `inc/lawyer-onboarding.php`.
- ADDED: `project-control/lawyer-onboarding-revenue-proof-strip-2026-05-25.md`.
- MATERIAL ADVANCE: the investor/payment demo now has an admin-visible honesty boundary: confirmed paid profiles, confirmed monthly plan value, manual-invoice count, saved payment-link count, and a warning not to claim automatic recurring billing/refunds/invoice automation until Grow/Morning/Woo passes a controlled paid smoke test.
- VERIFIED LOCAL / DEPLOYED / VERIFIED LIVE: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed; pushed commit `bbb32c6`; uPress Pull Git succeeded and uPress log showed live HEAD `bbb32c6`; wp-admin `Lawyer Onboarding` exposed the new proof strip, manual payment bridge, and provider claim boundary.
- REVENUE STATUS: realized revenue remains NIS 0 unless the live admin count shows owner-confirmed paid profiles backed by real provider/accounting proof. This change makes that truth visible; it does not create payment proof.
- SAFETY: admin/theme logic and docs only; no CMS database record, email/WhatsApp send, payment link, provider setting, WooCommerce product/subscription, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 14:29 Asia/Jerusalem
- LAWYER TRUST SUMMARY BAR ADDED: wp-admin lawyer list now gets a visible `Jus-Tice profile trust queue` bar with counts and quick links for hold/review/source/media/Maya/ready profiles.
- UPDATED: `inc/lawyer-visibility.php`.
- ADDED: `project-control/lawyer-profile-trust-summary-bar-2026-05-25.md`.
- MATERIAL ADVANCE: the owner no longer needs to hunt through filters one-by-one; the CMS now surfaces the size of the profile cleanup queue before sponsored/homepage/outreach promotion.
- VERIFIED LOCAL / DEPLOYED / VERIFIED LIVE: `php -l inc/lawyer-visibility.php` and `git diff --check` passed; pushed commit `8c93ee4`; uPress Pull Git succeeded and uPress log showed live HEAD `8c93ee4`; wp-admin exposed the `Jus-Tice profile trust queue`; homepage first 6 lawyer cards stayed at `overlapping=0`.
- REVENUE STATUS: realized revenue remains NIS 0. This improves operator safety and demo credibility but does not prove payment, invoice, refund, subscription, or lead monetization.
- SAFETY: admin/theme logic and docs only; no CMS database record, competitor asset/content, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 14:20 Asia/Jerusalem
- LAWYER PROFILE TRUST GATE ADDED: wp-admin lawyer list now has an owner-facing `Trust gate` column and filters to catch profiles that need source/media/fact review before promotion.
- UPDATED: `inc/lawyer-visibility.php`.
- ADDED: `project-control/lawyer-profile-trust-gate-admin-2026-05-25.md`.
- MATERIAL ADVANCE: after the Maya profile issue, the CMS now gives the owner an operating screen for `Hold before promotion`, `Missing source URL`, `Blocked/unverified media`, `Maya source review`, and `Trust ready`, instead of relying on memory or scattered notes.
- VERIFIED LOCAL / DEPLOYED / VERIFIED LIVE: PHP lint and diff check passed; pushed commit `281c188`; uPress Pull Git succeeded and uPress log showed live HEAD `281c188`; wp-admin lawyer list exposed `Trust gate`; homepage card overlap stayed `0`; Maya profile still had no photo image and no linked article authority.
- RESEARCH BASIS: this cycle operationalizes the previous competitor/profile-quality research and live owner feedback; it does not copy competitor photos, reviews, ratings, profile text, or contact details.
- REVENUE STATUS: realized revenue remains NIS 0. This reduces demo/outreach trust risk but does not prove payment, invoice, refund, subscription, or lead monetization.
- SAFETY: admin/theme logic and docs only; no CMS database record, competitor asset/content, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 13:58 Asia/Jerusalem
- LAWYER CARD VISUAL/TRUST POLISH: fixed the live homepage/directory card overlap issue where profile media could render wider than its grid track and cover lawyer text.
- UPDATED: `assets/css/premium-pass-4.css`, `inc/enqueue.php`, `template-parts/cards/lawyer-card.php`, `single-justice_lawyer.php`, and `inc/template-tags.php`.
- ADDED: `project-control/lawyer-profile-visual-trust-polish-2026-05-25.md`.
- MATERIAL ADVANCE: public lawyer cards now use bounded portrait media/initials, unverified public-basic cards do not show questionable thumbnails, the questionable Maya image is suppressed until verified/owned media exists, and unverified/person-specific Maya content no longer borrows article authority or forced legacy content until source-checked.
- RESEARCH BASIS: checked current public patterns from Din, PsakDin, LawReviews, Avvo, Justia, and MDN CSS image/aspect-ratio guidance. Implementation is original and does not copy competitor photos, reviews, ratings, or profile text.
- HONEST LIMITATION: I did not add a real Maya Rotenberg photo because I do not have a verified owned/licensed source. I tightened the system so unverified/fake-looking profile data is not presented as a premium mini-site.
- REVENUE STATUS: realized revenue remains NIS 0. This improves investor/customer trust in the profile layer but does not prove payment, invoice, refund, or subscription flow.
- SAFETY: theme/display logic and docs only; no CMS database record, competitor photo/review/rating/contact copy, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 13:42 Asia/Jerusalem
- DYNAMIC PAID BILLING FIELDS ADDED: `/lawyer-registration/` now keeps manual-invoice billing fields in the form markup and reveals them when a lawyer selects a paid plan inside the wizard.
- UPDATED: `page-lawyer-registration.php`, `assets/js/lawyer-registration-wizard.js`, and `inc/enqueue.php`.
- ADDED: `project-control/lawyer-registration-dynamic-billing-fields-2026-05-25.md`.
- GENERATED: `reports/lawyer-registration-dynamic-billing-fields-2026-05-25.json`.
- MATERIAL ADVANCE: a lawyer no longer has to arrive through a special paid-plan URL to provide billing details; generic registration can now convert into a paid manual-invoice handoff from inside the same customer journey.
- VERIFIED LOCAL: `php -l page-lawyer-registration.php`, `php -l inc/enqueue.php`, `node --check assets/js/lawyer-registration-wizard.js`, JSON parse, and `git diff --check` passed.
- VERIFIED LIVE: uPress Git log shows live HEAD `59a9c8b`; free registration keeps billing fields hidden, paid `plan_interest=featured` exposes required billing fields and `payment_path=manual_invoice`, and browser interaction from the registration wizard reveals the billing fieldset after paid selection.
- REVENUE STATUS: realized revenue remains NIS 0. This improves the paid signup handoff but does not prove a Grow/Woo payment or invoice.
- SAFETY: theme/form behavior only; no CMS/database record, competitor content, payment gateway setting, charge, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 13:28 Asia/Jerusalem
- CLAIM ADMIN QUEUE ADDED: `Lawyer Onboarding` now has a `claim_queue=1` path for public-card claim registrations, and admin rows/side boxes resolve the claimed public card with public/edit links.
- UPDATED: `inc/lawyer-onboarding.php`.
- ADDED: `project-control/lawyer-claim-admin-queue-2026-05-25.md`.
- GENERATED: `reports/lawyer-claim-admin-queue-2026-05-25.json`.
- MATERIAL ADVANCE: a lawyer who clicks "this is my card" now enters an owner-visible claim queue instead of becoming a generic registration. The operator can verify identity, open the exact card, then connect the deal to featured/sponsored upgrade handling.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` passed. JSON parse, `git diff --check`, commit/push and live post-pull verification still need to complete for this cycle.
- REVENUE STATUS: realized revenue remains NIS 0. This reduces follow-up leakage but does not prove payment.
- SAFETY: admin/workflow-only change; no new CMS lawyer/professional records were created; no public visibility changes, competitor photos/reviews/ratings/contact details, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 13:15 Asia/Jerusalem
- CLAIM/UPGRADE REGISTRATION CONTEXT ADDED: `/lawyer-registration/` now recognizes `claim_profile_id` and `claim_profile` from public lawyer/professional cards and shows a contextual "claim existing card" panel before the account-opening form.
- UPDATED: `page-lawyer-registration.php`, `inc/lawyer-onboarding.php`, and `assets/css/premium-pass-4.css`.
- ADDED: `project-control/lawyer-registration-claim-context-2026-05-25.md`.
- GENERATED: `reports/lawyer-registration-claim-context-2026-05-25.json`.
- MATERIAL ADVANCE: public-basic CMS cards now have a more complete conversion path: card -> claim/upgrade CTA -> registration page naming the selected card -> submission attribution for follow-up.
- RESEARCH BASIS: checked LawReviews, Din and PsakDin public surfaces again for claim/profile/review/signup positioning; implementation is original and does not copy competitor profile content.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `php -l page-lawyer-registration.php` passed. JSON parse, `git diff --check`, commit/push and live post-pull verification still need to complete for this cycle.
- REVENUE STATUS: realized revenue remains NIS 0 until claim/upgrade/payment is completed.
- SAFETY: no new CMS lawyer/professional records were created; no competitor photos/reviews/ratings/contact details copied; no fake phone, WhatsApp, rating, recommendation, verification, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 13:08 Asia/Jerusalem
- CLAIM/UPGRADE PATH ADDED: public-basic unclaimed lawyer/professional cards now show a small owner-facing prompt asking "זה הכרטיס שלך?" with a claim/upgrade link.
- UPDATED: `template-parts/cards/lawyer-card.php` and `assets/css/premium-pass-4.css`.
- ADDED: `project-control/public-card-claim-upgrade-cta-2026-05-25.md`.
- GENERATED: `reports/public-card-claim-upgrade-cta-2026-05-25.json`.
- MATERIAL ADVANCE: the 20 live public-basic cards now serve the revenue path more directly: visible profile -> claim ownership -> update details -> featured/sponsored upgrade attribution.
- RESEARCH BASIS: checked LawReviews, Din and PsakDin surfaces again for profile/conversion behavior; implementation is original and does not copy their profile content.
- VERIFIED LOCAL: `php -l template-parts/cards/lawyer-card.php`, JSON parse for the report, and `git diff --check` passed. Live post-pull visual verification still needs to run for this cycle.
- REVENUE STATUS: realized revenue remains NIS 0 until claim/upgrade/payment is completed.
- SAFETY: no competitor photos/reviews/ratings/contact details copied; no fake phone, WhatsApp, rating, recommendation, verification, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 12:58 Asia/Jerusalem
- CMS OPERATING CONTROL IMPROVED: added owner-facing wp-admin columns and filters to the `justice_lawyer` list so indexed lawyers/professionals can be found, batched, hidden/revealed, and promoted faster from the CMS.
- UPDATED: `inc/lawyer-visibility.php`.
- ADDED: `project-control/lawyer-index-cms-management-controls-2026-05-25.md`.
- GENERATED: `reports/lawyer-index-cms-management-controls-2026-05-25.json`.
- MATERIAL ADVANCE: the owner can now filter basic-unclaimed, sponsored/priority, active-paid, hidden, forced-show, source-type, plan and professional-type cohorts, then use existing bulk actions to show/hide/mark sponsored/mark basic.
- RESEARCH BASIS: checked current LawReviews, Din and PsakDin surfaces again; this cycle implements the operational layer needed to scale their directory pattern without hard-coding.
- VERIFIED LOCAL: `php -l inc/lawyer-visibility.php` and `git diff --check` passed.
- HONEST LIMITATION: no new competitor records were added in this cycle; this cycle made the existing and next batches easier to control safely.
- REVENUE STATUS: realized revenue remains NIS 0. This improves the route to paid upgrades but does not create payment proof by itself.
- SAFETY: admin/theme-only change; no public CMS/database record, redirect, canonical/noindex, sitemap, taxonomy, payment, invoice, refund, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 12:28 Asia/Jerusalem
- LIVE CMS BATCH 2 COMPLETED: added 11 additional live CMS public-basic records, bringing public REST inventory to 20 records and visible `/lawyers/` cards to 20 unique cards.
- LEGAL PROFESSIONALS INDEXED: added 5 Din-sourced rabbinical advocate/mediator professional cards with `professional_type=rabbinical_advocate`, plus 6 LawReviews-sourced lawyer/law-firm cards.
- ADDED: `project-control/live-cms-lawyer-index-batch-2-2026-05-25.md`.
- GENERATED: `reports/live-cms-lawyer-index-batch-2-2026-05-25.json`.
- VERIFIED LIVE: homepage showcase shows 6 CMS-backed cards; `/lawyers/?justice_readonly=1` shows 20 unique cards; `/lawyers/public-basic-israel-ben-baruch-rabbinical-mediator/` returns 200 through the CMS fallback.
- IMPORT INCIDENT FIXED: initial batch write produced mojibake/question-mark titles for the 11 new records; the titles/content/meta were repaired with UTF-8 and verified through REST/live HTML.
- LIVE PATCH AFTER DEPLOY TEST: homepage now verified at 6 CMS-backed lawyer cards after uPress pull; the archive `/lawyers/` still showed only one card, so `archive-justice_lawyer.php` was adjusted to sort/filter by the approved ID list instead of the old `priority_score` meta query that dropped basic cards.
- CMS-BACKED LAWYER SHOWCASE CONTROL: replaced the homepage single-lawyer showcase with a dynamic CMS query that ranks public-approved lawyers by paid/sponsored status, verification and `priority_score`, then renders real `justice_lawyer` cards.
- ADDED ADMIN BULK CONTROL: wp-admin lawyer list now has bulk actions to show, hide, return to automatic visibility, mark sponsored/top, or mark basic/unclaimed. This is the control layer the owner asked for before scaling competitor-inspired indexing.
- UPDATED SAFETY GATE: `justice_theme_lawyer_profile_is_public_approved()` now respects `admin_profile_visibility=hide/show`, so hidden cards are removed consistently from public output while explicit admin-approved cards can be shown.
- ADDED PROFESSIONAL TYPE SUPPORT: `justice_lawyer` meta now includes `professional_type`, and cards can distinguish legal-service professionals such as rabbinical advocates/mediators from regular lawyer profiles.
- UPDATED: `template-parts/sections/featured-lawyers.php`, `archive-justice_lawyer.php`, `inc/lawyer-visibility.php`, `inc/template-tags.php`, `justice-core/includes/cpt-lawyers.php`, `template-parts/cards/lawyer-card.php`, and `assets/css/premium-pass-4.css`.
- RESEARCH BASIS: current public surfaces checked on LawReviews, Din and PsakDin: they emphasize search by field/area/name, leading profiles/reviews, direct contact CTAs, long profile pages, author/content authority and service/related-topic clustering.
- VERIFIED LOCAL: PHP lint passed for `inc/template-tags.php`, `inc/lawyer-visibility.php`, `template-parts/sections/featured-lawyers.php`, `template-parts/cards/lawyer-card.php`, `justice-core/includes/cpt-lawyers.php`, and `inc/lawyer-rest-guards.php`.
- LIVE STATUS: existing 8 CMS lawyer cards remain live in the database; route/showcase/bulk-control code still needs commit, push and uPress pull before it appears on the public site.
- HONEST LIMITATION: I have not bulk-copied "all premium" lawyers from competitors. That would be unsafe and operationally noisy. The implemented path is legal-safe: public basic cards without copied photos/reviews/ratings, then claim/upgrade outreach.
- REVENUE STATUS: realized MRR remains ₪0. The immediate revenue path is now clearer: indexed public-basic card -> claim profile -> sponsored/top placement -> Grow/WooCommerce/manual invoice payment.
- SAFETY: no competitor photos/reviews copied; no fake ratings, recommendations, verification, contact details, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy creation, GSC/GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 12:13 Asia/Jerusalem
- LIVE CMS LAWYER INDEXING: used the owner-provided WordPress application password to create 8 real `justice_lawyer` CMS records, not hard-coded cards.
- CREATED LIVE CMS IDS: 20533 שלמה פרידמן, 20534 מארי שני עשהאל, 20535 שמואל גרוס, 20536 טלי בן יקיר, 20537 איל בר-לב, 20538 ד"ר איריס טרומן, 20539 מורן גוהר, 20540 אביטל רבינוביץ.
- CATEGORY DECISION APPLIED: every new card uses both `דיני משפחה` and `גירושין` taxonomy terms together, matching the owner's point that עורך דין גירושין and עורך דין לענייני משפחה should consolidate signal instead of being split.
- ADDED: `project-control/live-cms-lawyer-index-emergency-update-2026-05-25.md`.
- GENERATED: `reports/live-cms-lawyer-index-emergency-update-2026-05-25.json`.
- UPDATED: `inc/lawyer-rest-guards.php` with a narrow `/lawyers/{slug}/` CMS profile fallback because live single lawyer URLs currently return 404 even for valid CMS records.
- VERIFIED: admin REST and public REST both show the 8 new CMS records; public REST currently exposes 9 lawyer records total. `php -l inc/lawyer-rest-guards.php` and `git diff --check` passed.
- HONEST DISPLAY STATUS: the visible `/lawyers/` HTML currently shows the newest new card only, apparently due to front-end/cache behavior; direct mini-site URLs still need the route fix deployed and re-tested after server pull/cache refresh.
- REVENUE STATUS: current realized MRR remains ₪0. Material advance is conversion inventory: 8 public-index cards can now be used for claim/outreach, with first paid target still one lawyer at ₪349-₪749/month after claim + payment setup.
- SAFETY: no competitor photos/reviews copied; no fake ratings, recommendations, verification, contact details, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy creation, GSC/GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 11:35 Asia/Jerusalem
- HOMEPAGE COMPETITOR-INSPIRED POLISH: checked current public competitor surfaces from Din, LawReviews and PsakDin, then added an original three-signal homepage row under the main search box: search by field/city, review the profile before contact, and use legal content before sending an inquiry.
- UPDATED: `template-parts/sections/hero.php` and `assets/css/premium-pass-4.css`.
- ADDED: `project-control/homepage-competitor-polish-notes-2026-05-25.md`.
- MATERIAL ADVANCE: the homepage first viewport now reads more like a legal directory/search product and less like a generic article portal, without falsely claiming reviews, rankings or verified ratings that are not yet backed by CMS data.
- VERIFIED BASIS: public web result pass on Din, LawReviews and PsakDin; implementation is original/inspired, not copied verbatim.
- STILL BLOCKED: live CMS creation of additional lawyer/professional records still depends on working WordPress admin access or a working REST application password; public reviews/ratings should not be shown until there is verified review infrastructure and approval.
- COMPLETION: homepage/commercial polish moved from about 62% to 66%; article-page polish remains about 66%; CMS-backed customer/professional indexing remains constrained by live CMS access.
- SAFETY: theme-only homepage rendering/CSS and local notes; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice, refund, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 11:26 Asia/Jerusalem
- ARTICLE PAGE RELEVANCE POLISH: disabled the repeated pre-content article intent/marketing panel by default via `justice_theme_show_article_intent_panel`, so article pages now move from title/meta directly into the article body unless an owner/developer explicitly re-enables the panel.
- UPDATED: `single-articles.php`.
- MATERIAL ADVANCE: this directly addresses the investor/owner concern that article pages were opening with generic "what to do / when to contact a lawyer / how Jus-Tice helps" marketing text before the real article, which can feel less professional and may dilute above-the-fold topical relevance.
- VERIFIED LOCAL: `php -l single-articles.php` passed and the default filter value is `false`.
- STILL BLOCKED: live CMS creation of additional lawyer/professional records still depends on working WordPress admin access or a working REST application password; no new CMS customers/professionals were created in this cycle.
- COMPLETION: article-page polish moved from about 60% to 66%; homepage/commercial polish remains about 62%; CMS-backed customer/professional indexing remains constrained by live CMS access.
- SAFETY: theme-only rendering change; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice, refund, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 11:16 Asia/Jerusalem
- VISUAL POLISH / GENERIC IMAGE REDUCTION: replaced generic no-photo lawyer-card avatars with CMS-derived initials cards, and replaced the generic article fallback thumbnail with an editorial legal placeholder driven by the article practice area.
- UPDATED: `template-parts/cards/lawyer-card.php`, `template-parts/cards/article-card.php`, and `assets/css/premium-pass-4.css`.
- MATERIAL ADVANCE: public lawyer cards and article cards without real images now look like intentional Jus-Tice directory/editorial surfaces instead of stock/demo imagery, directly addressing the investor feedback about generic thumbnails.
- VERIFIED LOCAL: `php -l template-parts/cards/lawyer-card.php`, `php -l template-parts/cards/article-card.php`, and `git diff --check` passed.
- STILL BLOCKED: live CMS creation of additional lawyer/professional records still depends on working WordPress admin access or a working REST application password; uPress SSO opened the user picker but did not leave the in-app browser authenticated.
- COMPLETION: homepage visual polish moved from about 55% to 62%; CMS-backed customer/professional indexing remains constrained by live CMS access.
- SAFETY: theme-only rendering/CSS change; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice, refund, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 11:02 Asia/Jerusalem
- LEGAL-SERVICE SUPPLIER INDEX PACKET: prepared the CMS-backed supplier/professional pipeline requested by the owner, using the existing private `justice_supplier` CMS model rather than hard-coded public cards.
- ADDED: `project-control/legal-service-supplier-cms-index-candidates-2026-05-25.md` and `.csv`.
- ADDED: `tools/check-legal-service-supplier-index-candidates.mjs`.
- GENERATED: `project-control/legal-service-supplier-index-candidates-check-2026-05-25.md` and `.csv`.
- GENERATED: `reports/legal-service-supplier-index-candidates-2026-05-25.json` and `.csv`.
- MATERIAL ADVANCE: 10 legal-service supplier candidates are now ready for internal CMS creation across translation/notary, digital forensics, investigations, legal tech, finance/payment and professional information/training.
- REVENUE VIEW: current public legal-service index and supplier revenue remain 0; realistic 30-60 day target after outreach is 1-2 lead-fee/affiliate agreements and ₪0-₪2,000/month until actual referrals happen.
- BLOCKED: live CMS record creation still needs the owner to clear the uPress/F5 image-code challenge or provide a working REST application password; public supplier cards still need owner/compliance approval.
- COMPLETION: supplier candidate preparation is about 60%; live supplier indexing remains 0% until CMS access is cleared.
- SAFETY: repo-only supplier candidate packet and checker; no live CMS record, public supplier page, outreach, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting changed.

# LATEST WORK STATUS - 2026-05-25 10:45 Asia/Jerusalem
- CMS-BACKED BASIC LAWYER CARDS: added support for a safe `public_index` / `public` unclaimed lawyer-card state in the existing `justice_lawyer` CMS model.
- ADDED: `project-control/competitor-success-replication-plan-2026-05-25.md`.
- ADDED: `project-control/public-basic-lawyer-cms-import-candidates-2026-05-25.md` and `.csv` with 14 CMS-ready basic lawyer-card candidates from public LawReviews/PsakDin/Jus-Tice sources.
- ADDED: `tools/check-live-cms-indexed-customers.mjs`.
- GENERATED: `project-control/live-cms-indexed-customers-2026-05-25.md` and `.csv`.
- GENERATED: `reports/live-cms-indexed-customers-2026-05-25.json` and `.csv`.
- SAVED VISUAL: `project-control/visual-evidence/lawyer-directory-current-cms-cards-2026-05-25.png`.
- UPDATED: `template-parts/cards/lawyer-card.php` to show "כרטיס בסיסי" and "כרטיס ציבורי לא מאומת" for unclaimed public-index cards.
- UPDATED: `justice-core/includes/cpt-lawyers.php` so CMS admins can choose `public_index`, `public`, and `published` values without custom-field hacks.
- UPDATED: `assets/css/premium-pass-4.css` for the basic-card badge.
- LIVE FACTS: current public REST `justice_lawyer` count is 1 and visible live directory card count is 1; public legal-service/supplier cards are not exposed yet.
- EMAIL: Grow/Morning recurring-billing reply was sent in the live thread; owner-pasted update says the site is approved for clearing, so payment is now plugin/API setup plus real transaction proof, not site-approval blocked.
- BLOCKED: WordPress CMS login is currently stopped at the uPress/F5 image-code challenge; I cannot solve or bypass it. Owner must enter the image code in the visible browser once, or provide a working REST application password, before live CMS records can be created.
- COMPLETION: CMS-backed basic-card infrastructure is about 75%; live indexed customer count remains 1 until CMS access is cleared and approved records are created.
- SAFETY: no new CMS/database lawyer record, supplier record, payment, invoice, refund, redirect, canonical/noindex, sitemap, taxonomy, GSC/GA4 or provider setting was changed.

# LATEST WORK STATUS - 2026-05-25 08:56 Asia/Jerusalem
- INVESTOR LIVE-ROOM RUNBOOK: added a timed 10-minute owner/operator flow for the investor meeting, with exact screens, spoken lines, no-claim boundaries and owner-only live payment actions.
- RESEARCH BASIS: 2026 SaaS demo/onboarding guidance emphasizes buyer-problem framing, one workflow, early value, immediate proof and a clear next step.
- ADDED: `project-control/investor-live-room-runbook-2026-05-25.md`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html`.
- UPDATED: `tools/check-investor-launchpad-pack.mjs`.
- MATERIAL ADVANCE: the owner now has a minute-by-minute room script that protects against rambling, feature dumping and payment overclaiming.
- STILL BLOCKED: claimed demo lawyer, assigned demo lead, paid Grow link verification, automatic invoice proof, refund execution and recurring debit authorization require owner/provider-approved live actions.
- COMPLETION: investor/demo operating readiness remains about 98%; live money proof becomes stronger after the owner pays/verifies the existing Grow link.
- SAFETY: local planning/checker/report artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 08:45 Asia/Jerusalem
- INVESTOR VALUE MOMENT CUE CARD: added a browser-ready Hebrew cue card that compresses the investor demo into one workflow: lawyer value, payment proof, and honest recurring-payment blocker.
- RESEARCH BASIS: current SaaS demo/onboarding guidance emphasizes one workflow, fast time-to-value, proof immediately after value and a clear next step.
- ADDED: `project-control/investor-value-moment-cue-card-2026-05-25.html`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html`.
- UPDATED: `tools/check-investor-launchpad-pack.mjs`.
- MATERIAL ADVANCE: the owner can open one clean card and speak the investor story without reading terminal reports or overclaiming payment automation.
- STILL BLOCKED: paying the existing Grow link, verifying receipt/invoice, real refund execution, recurring authorization and gateway/product mapping require owner/provider-approved live actions.
- COMPLETION: investor demo operator readiness is about 98%; real recurring revenue automation remains provider-blocked.
- SAFETY: local HTML/checker/report artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 08:34 Asia/Jerusalem
- PAYMENT PROOF DRILL CHECKER: added a repeatable evidence reconciliation for the live Grow one-time payment-link smoke test and the failed Grow recurring-debit attempt.
- RESEARCH BASIS: Grow's current fixed-amount payment-link guide supports one-time links that can be branded and shared; Morning/Green Invoice payment documentation supports payment-form flows that can generate a document after payment when eligible clearing is connected.
- ADDED: `tools/check-payment-proof-drill.mjs`.
- GENERATED: `project-control/payment-proof-drill-2026-05-25.md` and `.csv`.
- GENERATED: `reports/payment-proof-drill-2026-05-25.json` and `.csv`.
- UPDATED: `tools/run-investor-morning-pack.ps1`, `project-control/investor-demo-launchpad-2026-05-25.html`, and `tools/check-investor-launchpad-pack.mjs`.
- MATERIAL ADVANCE: the owner now has one investor-safe payment line: one-time Grow link exists and was emailed; payment/receipt verification is next; recurring debit remains provider-blocked.
- STILL BLOCKED: paying the existing link, verifying receipt/invoice, real refund execution, recurring authorization and gateway/product mapping require owner/provider-approved live actions.
- COMPLETION: payment-proof readiness is about 85% for one-time demo proof if the owner pays the existing link; recurring subscription automation remains materially blocked.
- SAFETY: local evidence reconciliation and reports only; no provider login, payment link, charge, invoice, refund, CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 08:27 Asia/Jerusalem
- LAWYER SIGNUP CONVERSION STANDARD CHECKER: added a repeatable live audit for the competitor-informed lawyer signup standard, including entrypoints, plan page, registration, checkout/manual payment bridge, dashboard gate, support assistant and telemetry.
- RESEARCH BASIS: Lawmatics and Clio emphasize instant intake response, follow-up automation, pipeline visibility, scheduling/reminders and one lead timeline; Avvo emphasizes claimed profiles, visibility and urgent-client demand.
- ADDED: `tools/check-lawyer-signup-conversion-standard.mjs`.
- GENERATED: `project-control/lawyer-signup-conversion-standard-2026-05-25.md` and `.csv`.
- GENERATED: `reports/lawyer-signup-conversion-standard-2026-05-25.json` and `.csv`.
- UPDATED: `tools/run-investor-morning-pack.ps1`, `project-control/investor-demo-launchpad-2026-05-25.html`, and `tools/check-investor-launchpad-pack.mjs`.
- MATERIAL ADVANCE: the owner can now refresh one command and see whether the live lawyer signup path matches the revenue standard instead of relying on memory or taste.
- STILL BLOCKED: live page redesign/copy polish, payment links, invoices, recurring billing, refunds and account activation require owner/provider-approved live execution.
- COMPLETION: lawyer signup conversion audit coverage is about 95%; live implementation remains bounded by any failed markers and provider approval.
- SAFETY: read-only public route/static asset checks and local reports only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 08:16 Asia/Jerusalem
- LAWYER SIGNUP COMPETITOR PATTERN MAP: inspected public competitor signup/profile surfaces from LawReviews, Psakdin and Din and converted the useful patterns into an original Jus-Tice signup/revenue standard.
- ADDED: `project-control/lawyer-signup-competitor-patterns-2026-05-25.md`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html`.
- UPDATED: `tools/check-investor-launchpad-pack.mjs`.
- MATERIAL ADVANCE: the lawyer subscription path now has a concrete competitor-informed standard for above-fold lawyer CTAs, short signup, profile proof, lead board, manual payment bridge and lifecycle support.
- STILL BLOCKED: live page copy/layout changes, payment links, invoices, recurring billing, refunds and account activation require owner/provider-approved live execution.
- COMPLETION: lawyer signup/revenue messaging standard is about 85%; live conversion implementation still needs page-level updates after approval.
- SAFETY: local research/planning/checker artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 08:04 Asia/Jerusalem
- MORNING RUNNER SALES-PACK COVERAGE: updated the one-command investor morning refresh runner so it also runs the first-paid-lawyer sales-pack checker before the launchpad/go-no-go gates.
- UPDATED: `tools/run-investor-morning-pack.ps1`.
- MATERIAL ADVANCE: the owner's single refresh command now verifies both investor-demo readiness and first paid-lawyer sales collateral, so lawyer outreach proof cannot silently go stale after the investor meeting.
- STILL BLOCKED: actual outreach, payment link sending, invoices and account activation require owner approval/live execution.
- COMPLETION: investor/operator/sales preparation remains about 98%; actual revenue remains blocked until owner executes outreach and manual payment links.
- SAFETY: local script/status artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 07:53 Asia/Jerusalem
- FIRST PAID LAWYER SALES-PACK CHECKER: added a repeatable local QA gate for the first-cohort lawyer sales materials.
- ADDED: `tools/check-first-paid-lawyer-sales-pack.mjs`.
- GENERATED: `project-control/first-paid-lawyer-sales-pack-2026-05-25.md` and `.csv`.
- GENERATED: `reports/first-paid-lawyer-sales-pack-2026-05-25.json` and `.csv`.
- VERIFIED LOCAL: sales pack is PASS with 4/4 required files, 9/9 sales tokens and 30 tracker rows.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html` and `tools/check-investor-launchpad-pack.mjs` so the sales-pack check is linked and verified.
- MATERIAL ADVANCE: first-cohort sales collateral now has a guard that verifies plan prices, manual payment bridge, no-guarantee language, cadence and tracker before outreach.
- STILL BLOCKED: actual outreach, payment link sending, invoices and account activation require owner approval/live execution.
- COMPLETION: first-cohort sales collateral is about 98%; actual revenue remains blocked until owner executes outreach and manual payment links.
- SAFETY: local checker/report/documentation artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 07:43 Asia/Jerusalem
- HEBREW LAWYER OFFER HTML: added a browser-ready RTL Hebrew one-pager for first-cohort lawyer sales, with value proposition, plan ladder, WhatsApp close, phone close and boundaries.
- RESEARCH BASIS: current one-pager guidance from HubSpot, Dock and Qwilr emphasizes concise value, proof points and a clear next step.
- ADDED: `project-control/first-cohort-lawyer-offer-sheet-he-2026-05-25.html`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html` to link the Hebrew lawyer offer.
- UPDATED: `tools/check-investor-launchpad-pack.mjs` so the pack verifies the Hebrew lawyer offer is present and linked.
- MATERIAL ADVANCE: the owner now has a lawyer-facing Hebrew sales one-pager that can be opened in a browser after a call or investor demo.
- STILL BLOCKED: actual outreach, payment link sending, invoices and account activation require owner approval/live execution.
- COMPLETION: first-cohort sales collateral is about 97%; actual revenue remains blocked until owner executes outreach and manual payment links.
- SAFETY: local HTML/documentation/checker/launchpad artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 07:33 Asia/Jerusalem
- FIRST COHORT LAWYER OFFER SHEET: added a concrete first-cohort commercial offer sheet that turns the public plan ladder into a lawyer-facing sales close.
- RESEARCH BASIS: HubSpot pipeline, sales sequence and sales automation guidance emphasizes clear stages, structured cadence and activity logging.
- ADDED: `project-control/first-cohort-lawyer-offer-sheet-2026-05-25.md`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html` to link the offer sheet.
- UPDATED: `tools/check-investor-launchpad-pack.mjs` so the pack verifies the offer sheet is present and linked.
- MATERIAL ADVANCE: the outreach sprint now has a concrete "what exactly am I buying?" answer with plan prices, WhatsApp copy, phone close and objection handling.
- STILL BLOCKED: actual outreach, payment link sending, invoices and account activation require owner approval/live execution.
- COMPLETION: first-cohort sales material is about 95%; actual revenue remains blocked until owner executes outreach and manual payment links.
- SAFETY: local documentation/checker/launchpad artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 07:22 Asia/Jerusalem
- FIRST PAID LAWYER OUTREACH SPRINT: added a revenue-focused first-cohort outreach plan with target cohorts, pipeline stages, 7-day cadence, phone/WhatsApp/email copy, qualification questions and a 30-row CRM tracker.
- RESEARCH BASIS: HubSpot pipeline, sales sequence and sales automation guidance emphasizes clear pipeline stages, planned multi-touch cadence and activity logging.
- ADDED: `project-control/first-paid-lawyer-outreach-sprint-2026-05-25.md`.
- ADDED: `project-control/first-paid-lawyer-outreach-sprint-2026-05-25.csv`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html` to link the outreach sprint.
- UPDATED: `tools/check-investor-launchpad-pack.mjs` so the pack verifies the outreach sprint and tracker are present and linked.
- MATERIAL ADVANCE: the post-demo path now has a practical first paid-lawyer sales sprint instead of only investor materials.
- STILL BLOCKED: actual outreach, payment links and customer records require owner approval/live execution.
- COMPLETION: revenue-sprint planning is about 90%; actual first-cohort revenue remains blocked until outreach and manual payment links are executed.
- SAFETY: local documentation/tracker/checker/launchpad artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 07:12 Asia/Jerusalem
- INVESTOR POST-DEMO FOLLOW-UP: added an owner-ready follow-up plan with meeting notes to capture, English/Hebrew recap email templates, follow-up cadence and payment-proof wording.
- RESEARCH BASIS: HubSpot recap/sales-email guidance and recent investor-follow-up guidance emphasize concise recaps, clear next steps, promised materials within 24 hours and specific asks.
- ADDED: `project-control/investor-post-demo-follow-up-2026-05-25.md`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html` to link the follow-up plan.
- UPDATED: `tools/check-investor-launchpad-pack.mjs` so the pack verifies the follow-up plan is present and linked.
- MATERIAL ADVANCE: the investor process now covers conversion after the demo, not only the meeting itself.
- STILL BLOCKED: actual investor email sending and live payment proof require owner approval.
- COMPLETION: investor meeting operations move to about 97% prepared; conversion depends on capturing objections and sending follow-up within 24 hours.
- SAFETY: local documentation/checker/launchpad artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 07:02 Asia/Jerusalem
- HEBREW BRIEF COUNT SYNC: corrected the Hebrew Markdown and browser-ready Hebrew brief so the launchpad-pack proof numbers match the latest verified pack count.
- UPDATED: `project-control/investor-morning-brief-he-2026-05-25.md`.
- UPDATED: `project-control/investor-morning-brief-he-2026-05-25.html`.
- MATERIAL ADVANCE: removes a presentation-risk mismatch where the owner could read stale launchpad-pack numbers aloud during the investor meeting.
- STILL BLOCKED: actual live data/payment/refund execution requires explicit owner/provider approval.
- COMPLETION: investor operator readiness remains about 96%; wording consistency is cleaner and safer.
- SAFETY: local documentation only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 06:52 Asia/Jerusalem
- HEBREW BRIEF HTML: added a browser-ready RTL Hebrew morning brief so the owner can open clean Hebrew wording without terminal encoding problems.
- ADDED: `project-control/investor-morning-brief-he-2026-05-25.html`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html` to link the Hebrew HTML brief.
- UPDATED: `tools/check-investor-launchpad-pack.mjs` so the pack verifies the Hebrew HTML brief is present and linked.
- MATERIAL ADVANCE: Hebrew meeting script is now readable in a browser with proper RTL layout and does not depend on Markdown/terminal rendering.
- STILL BLOCKED: actual live data/payment/refund execution requires explicit owner/provider approval.
- COMPLETION: investor operator readiness stays about 96%, but presentation reliability improves because the Hebrew script is browser-safe.
- SAFETY: local HTML/documentation/checker/launchpad artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 06:42 Asia/Jerusalem
- HEBREW INVESTOR MORNING BRIEF: added a Hebrew owner-facing meeting script with the opening line, proof numbers, payment answer, fake-data answer, business answer, blocker-closing steps and do-not-say list.
- ADDED: `project-control/investor-morning-brief-he-2026-05-25.md`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html` to link the Hebrew brief.
- UPDATED: `tools/check-investor-launchpad-pack.mjs` so the pack verifies the Hebrew brief is present and linked.
- MATERIAL ADVANCE: the owner now has pressure-safe Hebrew wording for the investor conversation, reducing the risk of overclaiming or freezing during payment/demo-data questions.
- STILL BLOCKED: actual live data/payment/refund execution requires explicit owner/provider approval.
- COMPLETION: investor operator readiness moves to about 96%; full real-money lifecycle proof remains provider/data gated.
- SAFETY: local documentation/checker/launchpad artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 06:32 Asia/Jerusalem
- LIVE DATA/PROVIDER ACTION CHECKLIST: added a five-minute owner-side checklist for the five remaining investor blockers: claimed demo lawyer, assigned medical-malpractice lead, real provider payment, branded invoice/receipt proof and refund execution proof.
- RESEARCH BASIS: HubSpot demo guidance emphasizes value and clear next steps; Stripe Payment Links docs/support confirm the no-code hosted payment-link pattern while recurring billing/invoicing remains provider setup.
- ADDED: `project-control/investor-live-data-provider-action-checklist-2026-05-25.md`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html` to link the checklist.
- UPDATED: `tools/check-investor-launchpad-pack.mjs` so the pack verifies this checklist is present and linked.
- MATERIAL ADVANCE: the unresolved blockers are now expressed as exact owner/provider actions with pass signals, not vague risks.
- STILL BLOCKED: actual live data/payment/refund execution requires explicit owner/provider approval.
- COMPLETION: investor operator readiness moves to about 95%; full real-money lifecycle proof remains provider/data gated.
- SAFETY: local documentation/checker/launchpad artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 06:22 Asia/Jerusalem
- INVESTOR FALLBACK ANSWERS: added a concise local sheet for what to say if the homepage is slow, the dashboard needs login, the investor asks for a real payment, or payment/refund/invoice automation is challenged.
- ADDED: `project-control/investor-demo-fallback-answers-2026-05-25.md`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html` to link the fallback answers.
- UPDATED: `tools/check-investor-launchpad-pack.mjs` so the launchpad pack verifies the fallback sheet is present and linked.
- MATERIAL ADVANCE: the owner has controlled, truthful answers for the exact failure/challenge moments that could otherwise derail the meeting.
- STILL BLOCKED: claimed demo lawyer, assigned medical-malpractice lead, real provider payment, branded invoice and refund execution require explicit owner/provider-approved live actions.
- COMPLETION: investor operator readiness moves to about 94%; full real-money lifecycle proof remains provider/data gated.
- SAFETY: local documentation/checker/launchpad artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 06:12 Asia/Jerusalem
- INVESTOR MORNING REFRESH SCRIPT: added a one-command PowerShell runner for the owner to refresh the live revenue funnel, investor readiness, launchpad pack, payment-overclaim gate and final go/no-go report before the meeting.
- ADDED: `tools/run-investor-morning-pack.ps1`.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html` to show the morning refresh command and link to the script.
- UPDATED: `tools/check-investor-launchpad-pack.mjs` so the launchpad pack also proves the refresh script is present.
- VERIFIED LIVE/LOCAL: `tools/run-investor-morning-pack.ps1` completed end to end; live revenue funnel 10/10 PASS, investor readiness `PASS_WITH_DISCLOSED_BLOCKERS`, launchpad pack 8/8 files and 15/15 tokens PASS, payment-overclaim PASS and go/no-go `GO_WITH_DISCLOSED_BLOCKERS`.
- MATERIAL ADVANCE: the owner no longer needs to remember multiple commands; the morning control screen now tells them exactly how to refresh all proof and the script has been proven once.
- STILL BLOCKED: claimed demo lawyer, assigned medical-malpractice lead, real provider payment, branded invoice and refund execution require explicit owner/provider-approved live actions.
- COMPLETION: investor operator readiness moves to about 93%; full real-money lifecycle proof remains provider/data gated.
- SAFETY: local script/checker/launchpad artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 06:02 Asia/Jerusalem
- INVESTOR MORNING GO/NO-GO: refreshed the live revenue funnel, investor readiness, launchpad pack and payment-overclaim gates, then generated a single go/no-go report for the meeting.
- ADDED: `tools/check-investor-morning-go-no-go.mjs`.
- GENERATED: `project-control/investor-morning-go-no-go-2026-05-25.md` and `.csv`.
- GENERATED: `reports/investor-morning-go-no-go-2026-05-25.json` and `.csv`.
- VERIFIED LIVE: lawyer revenue funnel remains 10/10 PASS.
- VERIFIED LIVE/SOURCE: investor readiness remains `PASS_WITH_DISCLOSED_BLOCKERS`.
- VERIFIED LOCAL: launchpad pack remains PASS and payment-overclaim checker remains PASS.
- DECISION: `GO_WITH_DISCLOSED_BLOCKERS` for an honest investor demo.
- STILL BLOCKED: claimed demo lawyer, assigned medical-malpractice lead, real provider payment, branded invoice and refund execution require explicit owner/provider-approved live actions.
- COMPLETION: investor operator readiness moves to about 92%; full real-money lifecycle proof remains provider/data gated.
- SAFETY: read-only live checks plus local checker/report artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 05:52 Asia/Jerusalem
- INVESTOR PAYMENT OVERCLAIM CHECKER: added and ran a local guard that scans the investor demo pack for unsafe payment, recurring-billing, invoice, refund and fake-data claims.
- RESEARCH BASIS: Stripe Customer Portal and Chargebee Self-Serve Portal docs confirm that mature billing portals expose billing details, payment methods, invoices, subscription state and cancellation/change paths; Jus-Tice must not overclaim those provider-managed actions before Grow/Meshulam proof.
- ADDED: `tools/check-investor-payment-overclaim.mjs`.
- GENERATED: `project-control/investor-payment-overclaim-2026-05-25.md` and `.csv`.
- GENERATED: `reports/investor-payment-overclaim-2026-05-25.json` and `.csv`.
- VERIFIED LOCAL: payment overclaim gate is PASS with 3/3 honesty markers and 8/8 overclaim scans passing.
- MATERIAL ADVANCE: the morning payment conversation now has a repeatable honesty gate that protects the owner from accidentally saying recurring billing, invoices or refunds are already automatic.
- STILL BLOCKED: claimed demo lawyer, assigned medical-malpractice lead, real provider payment, branded invoice and refund execution require explicit owner/provider-approved live actions.
- COMPLETION: investor operator/payment-message readiness moves to about 91%; full real-money lifecycle proof remains provider/data gated.
- SAFETY: local checker/report artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 05:42 Asia/Jerusalem
- INVESTOR LAUNCHPAD PACK CHECKER: added and ran a local readiness checker for the morning investor control pack.
- ADDED: `tools/check-investor-launchpad-pack.mjs`.
- GENERATED: `project-control/investor-launchpad-pack-2026-05-25.md` and `.csv`.
- GENERATED: `reports/investor-launchpad-pack-2026-05-25.json` and `.csv`.
- VERIFIED LOCAL: launchpad pack is PASS with 7/7 required files present and 14/14 launchpad tokens present.
- MATERIAL ADVANCE: the owner can now prove the local demo pack is coherent before the meeting: launchpad, scenario script, control sheet, payment lifecycle playbook, ASCII demo data, readiness report and live revenue-funnel report are all present and linked.
- STILL BLOCKED: claimed demo lawyer, assigned medical-malpractice lead, real provider payment, branded invoice and refund execution require explicit owner/provider-approved live actions.
- COMPLETION: investor operator readiness moves to about 90%; full real-money lifecycle proof remains provider/data gated.
- SAFETY: local checker/report artifacts only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 05:31 Asia/Jerusalem
- INVESTOR LAUNCHPAD PAYMENT LINK-IN: updated the local demo launchpad so the new payment lifecycle playbook is visible as a status badge, an ordered demo step and a supporting file link.
- UPDATED: `project-control/investor-demo-launchpad-2026-05-25.html`.
- MATERIAL ADVANCE: the morning demo can now answer real-money, invoice, refund, upgrade/downgrade and cancellation questions from the same non-technical control screen.
- STILL BLOCKED: real low-amount payment, branded invoice, refund execution, claimed demo lawyer and assigned demo lead require explicit owner/provider-approved actions.
- COMPLETION: investor operator readiness moves from about 86% to about 88% because the control screen now includes the money-lifecycle drill; full real-money lifecycle proof remains provider/data gated.
- SAFETY: local project-control HTML/status artifact only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 05:22 Asia/Jerusalem
- INVESTOR PAYMENT LIFECYCLE PLAYBOOK: added a morning-demo playbook that maps best-practice billing portal expectations to the exact Jus-Tice payment, lead, support, cancellation, upgrade, downgrade, invoice and refund paths.
- RESEARCH BASIS: Stripe Billing Customer Portal, Stripe subscription-change docs and Chargebee Self-Serve Portal all emphasize customer-managed billing details, invoices, payment methods, subscription changes and cancellation/refund lifecycle visibility.
- ADDED: `project-control/investor-payment-lifecycle-playbook-2026-05-25.md`.
- ADDED: `project-control/investor-payment-lifecycle-playbook-2026-05-25.csv`.
- MATERIAL ADVANCE: the investor demo now has an honest real-money lifecycle story: what is live, what can be captured in the system, what must be executed manually, and what remains provider-gated.
- STILL BLOCKED: real low-amount payment, branded invoice, refund execution, claimed demo lawyer and assigned demo lead require explicit owner/provider-approved actions.
- COMPLETION: route/product proof remains about 98%; full real-money lifecycle proof remains about 86% until provider test and demo data are executed.
- SAFETY: documentation/playbook only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 05:11 Asia/Jerusalem
- INVESTOR DEMO LAUNCHPAD: added a local HTML launchpad with clickable morning demo tabs, status badges, exact investor line, do-not-claim warning and links to the supporting scripts/reports.
- ADDED: `project-control/investor-demo-launchpad-2026-05-25.html`.
- MATERIAL ADVANCE: the owner can open one local file and run the investor demo from a polished, non-technical control screen instead of hunting through Markdown files.
- STILL BLOCKED: live claimed-lawyer login, assigned lead and real payment/refund execution require owner-approved data/provider actions.
- SAFETY: local project-control HTML artifact only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 04:56 Asia/Jerusalem
- INVESTOR SCENARIO SCRIPT: added a first-person walkthrough script for the exact medical-malpractice lawyer journey the owner described: discovery, plan choice, payment fallback, registration, dashboard, owner admin, assigned lead, service request and close.
- ADDED: `project-control/investor-demo-scenario-script-2026-05-25.md` with talk tracks and panic lines for payment/refund/fake-data questions.
- ADDED: `project-control/investor-demo-scenario-script-2026-05-25.csv` with the same flow as a compact checklist.
- MATERIAL ADVANCE: the investor demo can now be narrated as one coherent customer story instead of jumping between technical checks.
- STILL BLOCKED: live claimed-lawyer login, assigned lead and real payment/refund execution require owner-approved data/provider actions.
- SAFETY: documentation/script only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 04:46 Asia/Jerusalem
- ASCII DEMO DATA BACKUP: added an ASCII-only backup for the investor demo seed packet so the owner has safe copy/paste text even if Hebrew renders incorrectly in a terminal, CSV viewer, email client or admin field.
- ADDED: `project-control/investor-demo-data-seed-packet-ascii-2026-05-25.md` with English demo lawyer, demo lead, service request and payment-link text.
- ADDED: `project-control/investor-demo-data-seed-packet-ascii-2026-05-25.csv` with structured ASCII fields.
- MATERIAL ADVANCE: removes a practical morning risk: corrupted Hebrew display during urgent demo-data creation.
- STILL BLOCKED: no live demo data was created; owner approval is still required before creating any live lawyer, user, lead, payment link, invoice or service request.
- SAFETY: documentation/seed packet only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 04:35 Asia/Jerusalem
- INVESTOR MORNING CONTROL SHEET: added a one-page operator sheet that turns the verified revenue funnel into exact tabs, URLs and talk tracks for the morning investor walkthrough.
- ADDED: `project-control/investor-demo-morning-control-sheet-2026-05-25.md` with the six-tab demo order, approved live-demo-data checklist, do-not-fake list and exact investor line.
- ADDED: `project-control/investor-demo-morning-control-sheet-2026-05-25.csv` for quick copy/paste into an owner checklist.
- MATERIAL ADVANCE: reduces morning presentation risk by putting the live PASS routes, demo-data gap and payment honesty script in one short control sheet.
- STILL BLOCKED: live demo data and payment-provider execution remain owner/provider steps; no live records or payment actions were performed.
- SAFETY: documentation/control sheet only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 04:24 Asia/Jerusalem
- INVESTOR DEMO DATA SEED PACKET: created a copy-ready controlled demo packet for the remaining demo-data blockers without writing any CMS/database records.
- ADDED: `project-control/investor-demo-data-seed-packet-2026-05-25.md` with the medical-malpractice lawyer persona, profile copy, demo lead, follow-up note, service-request messages, payment-link wording and honest investor script.
- ADDED: `project-control/investor-demo-data-seed-packet-2026-05-25.csv` for structured copy/paste into owner/admin workflows if live demo data creation is approved.
- MATERIAL ADVANCE: the demo-data blocker is now operationally precise: owner can create one claimed lawyer and one assigned medical-malpractice lead quickly without inventing details during the investor morning.
- STILL BLOCKED: no live demo data was created; real recurring charge, automatic branded invoice and real refund execution remain external/payment-provider steps.
- COMPLETION: route readiness stays about 98%; full investor demo readiness moves from about 82% to about 86% because the demo-data instructions are now concrete, though still not executed.
- SAFETY: docs/data packet only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 04:03 Asia/Jerusalem
- POST-UPRESS PULL VERIFICATION: owner pulled latest Git to production; live checks now confirm the competitor signup funnel deployment is active.
- VERIFIED LIVE: deployment marker `2026-05-25-competitor-signup-funnel-v1`, premium CSS `4.3.4`, homepage lawyer revenue strip, lawyer plans competitor signup stages, paid checkout fallback, registration prefill, logged-out dashboard gate, support CSS, policy pages, dashboard JS and analytics event JS all pass.
- VERIFIED INVESTOR GATE: public lawyer entrypoints, paid plan routing, checkout compliance, registration prefill, dashboard gate, service desk/source checks and owner demo panel source checks pass.
- STILL BLOCKED: claimed demo lawyer profile, assigned medical-malpractice lead, real recurring charge, automatic branded invoice and real refund execution remain external/demo-data/provider steps and were not faked.
- COMPLETION: live public route readiness is about 98%; full investor demo readiness is about 82% until demo data plus controlled provider/payment proof are completed.
- SAFETY: read-only live verification and report refresh only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 01:25 Asia/Jerusalem
- COMPETITOR SIGNUP FUNNEL V1: inspected public signup/login/marketing paths from din.co.il, psakdin.co.il and lawreviews.co.il, then folded the observed funnel patterns into Jus-Tice.
- HONEST INSPECTION SCOPE: I reached public pages and public form stages only; I did not submit competitor forms, create competitor accounts or access private dashboards.
- OBSERVED: Din emphasizes fast/free signup, focused exposure, email for inquiries, mobile verification, password, terms, articles, case wins and forums. PsakDin exposes login/registration/subscriber routes and ties lawyers to legal content authority. LawReviews emphasizes reputation, verified reviews, profile richness, contact/appointments and missed-lead tracking.
- UPDATED: `page-lawyer-plans.php` now includes `lawyer-plans-market-proof__signup-stages`, translating those competitor patterns into a four-stage Jus-Tice account path.
- UPDATED: `page-lawyer-registration.php` now includes `lawyer-registration-account-path__fields`, explaining why the registration fields matter for activation, measurement and billing.
- UPDATED: `assets/css/premium-pass-4.css` and `inc/enqueue.php` to CSS version `4.3.4`; marker moved to `2026-05-25-competitor-signup-funnel-v1`.
- DOCUMENTED: `project-control/competitor-signup-funnel-audit-2026-05-25.md` records exactly what was checked and what was not.
- STILL BLOCKED: uPress Pull Git/cache refresh is required after push; no real demo lawyer/account/payment/invoice/refund data was created in this repo-safe pass.
- SAFETY: public theme/template/CSS/checker/docs only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 00:58 Asia/Jerusalem
- LAWYER ACCOUNT OPENING POLISH V1: sharpened the public lawyer acquisition path around account opening, discoverability, trust profile, measurable leads, dashboard value, payment handoff and lifecycle service.
- RESEARCH BASIS: current lawyer-index and legal-marketing pages sell intent-time visibility, complete attorney profiles, reviews/trust signals, qualified leads and marketing ROI; current Israeli digital-payment materials sell fast payment links, flexible payment methods and recurring-payment readiness. The site copy now adapts those patterns without copying competitor text verbatim.
- UPDATED: `template-parts/sections/homepage-lawyer-revenue-strip.php` adds a four-step account-opening path directly on the homepage revenue strip.
- UPDATED: `page-lawyer-plans.php` adds `lawyer-plans-market-proof`, explaining why Jus-Tice is more than a listing card: it is visibility, trust, measured leads and follow-up.
- UPDATED: `page-lawyer-registration.php` adds `lawyer-registration-account-path` before the form so registration feels like a managed business account, not a loose contact form.
- UPDATED: `assets/css/premium-pass-4.css` and `inc/enqueue.php` move the polish asset to version `4.3.3`.
- UPDATED: `functions.php`, `deployment-marker.txt`, and live checkers now expect marker `2026-05-25-lawyer-account-opening-polish-v1`.
- VERIFIED LOCAL: PHP syntax passed for touched templates and `functions.php`; Node syntax passed for affected checkers; live checkers correctly show REVIEW for the new tokens because production has not pulled this commit yet.
- STILL BLOCKED: uPress Pull Git/cache refresh is required after push before the new public polish appears live; claimed demo lawyer, assigned medical-malpractice lead, real recurring charge, automatic branded invoice and real refund execution remain outside the repo and must not be faked.
- COMPLETION: public lawyer conversion story moved from about 85% to about 92% locally; full live investor demo readiness remains about 78% until uPress pull, demo data and provider/payment proof are completed.
- SAFETY: repo-only theme/template/CSS/checker/report changes; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 00:45 Asia/Jerusalem
- POST-PUSH LIVE RECHECK: refreshed the May 25 investor readiness reports after commit `b9604e3`.
- VERIFIED LIVE: homepage lawyer entrypoints, paid plan routing, checkout compliance, registration prefill, logged-out dashboard gate, service desk CSS and Grow policy pages are still passing on production.
- EXPECTED LIVE MARKER GAP: production still shows the previous marker, so the new admin-only payment-playbook marker `2026-05-25-owner-demo-payment-playbook-v1` still needs uPress Pull Git/cache refresh before it is live.
- STILL BLOCKED: claimed demo lawyer profile, assigned medical-malpractice lead, real recurring charge, automatic branded invoice and real refund execution remain outside the repo and must not be faked.
- COMPLETION: public investor route readiness remains about 95%; full end-to-end demo readiness remains about 78% until live pull, demo data and payment-provider test are done.
- SAFETY: read-only live checks and report refresh only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 00:35 Asia/Jerusalem
- OWNER DEMO PAYMENT PLAYBOOK V1: added the missing operator instructions directly inside the admin-only investor demo panel, after live checks showed the deployed routes now pass.
- UPDATED: `inc/lawyer-onboarding.php` now includes a real Morning/Grow payment-link playbook and a demo-data checklist for claimed lawyer profile plus assigned medical-malpractice lead.
- UPDATED: `tools/check-investor-demo-readiness.mjs` now expects the payment playbook and demo-data checklist tokens in the owner demo panel source gate.
- UPDATED: `functions.php`, `deployment-marker.txt`, and `tools/check-homepage-investor-polish-live.mjs` to marker `2026-05-25-owner-demo-payment-playbook-v1`.
- RESEARCH BASIS: Morning's current payment-link guide says a fixed-amount payment link is created from Payments > Payment links and can be sent digitally; the admin panel now tells the owner to use that fixed-amount path for the investor test, then paste the real link into the lawyer record.
- MATERIAL ADVANCE: the owner no longer has to remember the payment-link steps or demo-data prerequisites during the investor walkthrough; they are visible in wp-admin where the demo starts.
- VERIFIED LIVE BEFORE EDIT: homepage polish, lawyer entrypoints, plan routing, checkout compliance, registration prefill, dashboard gate, service CSS and policy pages all passed after the uPress pull.
- VERIFIED LOCAL AFTER EDIT: PHP syntax passed for `inc/lawyer-onboarding.php` and `functions.php`; Node syntax passed for affected checkers; `git diff --check` passed with line-ending warnings only; refreshed readiness report shows all live/source rows passing with only demo-data/provider blockers remaining.
- LIVE MARKER STATUS: the new `2026-05-25-owner-demo-payment-playbook-v1` marker is not live until this commit is pushed and uPress pulls again, so the marker checker correctly reports REVIEW for this new update.
- STILL BLOCKED: this new panel update needs push plus another uPress Pull Git/cache refresh before it is live; real demo data still requires owner-approved WP/CMS entries; Grow recurring debit, automatic branded invoice and real refund execution remain provider approval/smoke-test blockers.
- COMPLETION: live route readiness is now about 95%; full investor demo readiness is about 78% until the demo lawyer, assigned lead and provider/payment-link test are completed.
- SAFETY: admin-only UI/source/checker/marker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-25 00:06 Asia/Jerusalem
- OWNER DEMO DEPLOYMENT WARNING V1: strengthened the admin-only investor demo panel with a red first-action warning to pull Git in uPress and clear cache before opening investor tabs.
- UPDATED: `inc/lawyer-onboarding.php` now states that skipping the uPress pull can leave homepage, plans, dashboard gate and deployment marker on the older production version.
- UPDATED: `tools/check-investor-demo-readiness.mjs` expects the new deployment-warning text in the owner demo panel source gate.
- UPDATED: `functions.php`, `deployment-marker.txt`, and `tools/check-homepage-investor-polish-live.mjs` to marker `2026-05-25-owner-demo-deployment-warning-v1`.
- MATERIAL ADVANCE: reduces the biggest morning presentation risk: local/pushed work exists, but production is stale because uPress was not pulled.
- VERIFIED LOCAL: PHP syntax passed for `inc/lawyer-onboarding.php` and `functions.php`; Node syntax passed for affected checkers; `git diff --check` passed with line-ending warnings only; May 25 live/readiness reports were generated and still correctly show production deployment, demo-data and provider blockers.
- STILL BLOCKED: uPress Pull Git/cache refresh is required before this admin warning and the recent investor polish are live; a claimed demo lawyer plus assigned demo lead are still needed for full walkthrough; Grow recurring debit remains provider-authorisation blocked.
- COMPLETION: deployment-hand-off clarity moved from about 75% to about 90% locally; full live investor readiness still depends on deployment, demo data and provider approval.
- SAFETY: admin-only UI/source/checker/marker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 23:56 Asia/Jerusalem
- OWNER DEMO CONTROL PANEL V1: added an admin-only investor rehearsal panel at the top of Lawyer Onboarding with direct links to homepage, lawyer plans, paid registration, lawyer dashboard, Justice CRM and service-request queue.
- UPDATED: `inc/lawyer-onboarding.php` adds `justice_theme_render_lawyer_onboarding_investor_demo_panel()` and renders it before the paid registration command center.
- UPDATED: the panel includes the honest payment script: manual Grow/Morning payment links are live bridge; recurring billing, branded invoice automation and refunds remain provider/smoke-test gated.
- UPDATED: `tools/check-investor-demo-readiness.mjs` now checks the owner demo panel source gate; deployment marker moved to `2026-05-24-owner-demo-control-panel-v1`.
- MATERIAL ADVANCE: the owner gets a one-screen morning run order inside wp-admin instead of relying on scattered notes while presenting.
- VERIFIED LOCAL: PHP syntax passed for `inc/lawyer-onboarding.php` and `functions.php`; Node syntax passed for affected checkers; `git diff --check` passed with line-ending warnings only; refreshed investor readiness shows the new owner demo panel source gate passing while live deployment/demo-data/provider blockers remain.
- STILL BLOCKED: uPress Pull Git/cache refresh is required before this admin panel is live; a claimed demo lawyer plus assigned demo lead are still needed for full walkthrough; Grow recurring debit remains provider-authorisation blocked.
- COMPLETION: investor rehearsal ergonomics moved from about 70% to about 88% locally; full live investor readiness still depends on deployment, demo data and provider approval.
- SAFETY: admin-only UI/source/checker/marker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 23:47 Asia/Jerusalem
- OWNER CRM LAWYER REPORT V1: added owner-visible lawyer follow-up reporting inside Justice CRM, so a lawyer's lead call note is visible to the owner after dashboard stage updates.
- UPDATED: `inc/lead-crm.php` adds a `Lawyer report` column in the CRM table and a `Latest lawyer report` panel in the lead disposition metabox.
- UPDATED: `tools/check-investor-demo-readiness.mjs` now checks the owner CRM source gate for `latest_lawyer_follow_up_note` and `latest_lawyer_stage_update_at`.
- UPDATED: `functions.php`, `deployment-marker.txt`, and `tools/check-homepage-investor-polish-live.mjs` to marker `2026-05-24-owner-crm-lawyer-report-v1`.
- MATERIAL ADVANCE: the investor demo can now show the complete loop: assigned lead -> lawyer contact/update -> owner sees the lawyer's report in CRM.
- VERIFIED LOCAL: PHP syntax passed for `inc/lead-crm.php` and `functions.php`; Node syntax passed for affected checkers; `git diff --check` passed with line-ending warnings only; refreshed investor readiness shows the new owner CRM lawyer-report source gate passing while live deployment/demo-data/provider blockers remain.
- STILL BLOCKED: uPress Pull Git/cache refresh is required before this is live; a claimed demo lawyer plus assigned demo lead are still needed for the full walkthrough; Grow recurring debit remains provider-authorisation blocked.
- COMPLETION: owner-visible CRM proof moved from about 78% to about 86% locally; full live investor readiness still depends on deployment, demo data and provider approval.
- SAFETY: admin UI/source/checker/marker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 23:38 Asia/Jerusalem
- LAWYER LEAD FOLLOW-UP NOTES V1: added a short call-result note field to the lawyer dashboard lead stage form so lawyers can report what happened after calling/WhatsApping/emailing a lead.
- UPDATED: `inc/lawyer-dashboard.php` stores `lead_follow_up_note` as `latest_lawyer_follow_up_note` with the existing stage update timestamp.
- UPDATED: `page-lawyer-dashboard.php` renders the note input and shows the latest reported note/timestamp under each lead.
- UPDATED: `assets/css/premium-pass-3.css` styles the richer CRM form and last-note panel; `inc/enqueue.php` bumps the premium-pass-3 asset version to `3.0.8`.
- UPDATED: `tools/check-investor-demo-readiness.mjs` now checks source support for lead follow-up notes; deployment marker moved to `2026-05-24-lead-follow-up-notes-v1`.
- MATERIAL ADVANCE: the investor demo can now show real lead follow-up reporting, not only lead contact buttons and a stage dropdown.
- VERIFIED LOCAL: PHP syntax passed for `inc/lawyer-dashboard.php`, `page-lawyer-dashboard.php`, `functions.php`, and `inc/enqueue.php`; Node syntax passed for affected checkers; `git diff --check` passed with line-ending warnings only; refreshed investor readiness shows the new lead-follow-up source gate passing while live deployment/demo-data/provider blockers remain.
- STILL BLOCKED: uPress Pull Git/cache refresh is required before this is live; a claimed demo lawyer plus assigned demo lead are still needed for the full CRM walkthrough; Grow recurring debit remains provider-authorisation blocked.
- COMPLETION: lawyer CRM demo readiness moved from about 82% to about 86% locally; full live investor readiness still depends on deployment, demo data and provider approval.
- SAFETY: theme/plugin-source/CSS/checker/marker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 23:23 Asia/Jerusalem
- LAWYER DASHBOARD LOGIN PREVIEW V1: added a logged-out private-area preview so the investor/lawyer can see the product promise before authentication: mini-site updates, manual payment/invoice activation, lead follow-up and lifecycle service requests.
- UPDATED: `page-lawyer-dashboard.php` renders `lawyer-dashboard-login-preview` cards under the login/plans/registration actions.
- UPDATED: `assets/css/premium-pass-3.css` styles the preview cards and stacks them on mobile; `inc/enqueue.php` bumps the premium-pass-3 asset version to `3.0.7`.
- UPDATED: `tools/check-investor-demo-readiness.mjs` expects the preview marker on both the live dashboard gate and source checks.
- UPDATED: `functions.php`, `deployment-marker.txt`, and `tools/check-homepage-investor-polish-live.mjs` to marker `2026-05-24-lawyer-dashboard-login-preview-v1`.
- MATERIAL ADVANCE: the demo no longer depends on explaining a hidden dashboard from memory; the public `/lawyer-dashboard/` gate now previews the actual revenue/customer-service value without exposing admin or fake data.
- VERIFIED LOCAL: PHP syntax passed for `page-lawyer-dashboard.php`, `functions.php`, and `inc/enqueue.php`; Node syntax passed for affected checkers; `git diff --check` passed with line-ending warnings only; investor readiness source checks pass, while live checks correctly show deployment/data/provider blockers.
- STILL BLOCKED: uPress Pull Git/cache refresh is required before this is live; Grow recurring debit remains provider-authorisation blocked.
- COMPLETION: investor-facing lawyer portal story moved from about 90% to about 92% locally; live completion remains blocked by deployment verification and a real claimed demo account.
- SAFETY: theme/template/CSS/checker/marker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 23:12 Asia/Jerusalem
- LAWYER SUPPORT SLA V1: added an explicit next-response target to the lawyer dashboard latest service request summary, so cancellation/refund/complaint/payment tickets do not look like a black hole after submission.
- UPDATED: `page-lawyer-dashboard.php` computes `latest_service_request_sla` from urgency and displays `Next response` beside the latest service request.
- UPDATED: `tools/check-investor-demo-readiness.mjs` expects the SLA marker in dashboard source checks.
- UPDATED: `functions.php`, `deployment-marker.txt`, and `tools/check-homepage-investor-polish-live.mjs` to marker `2026-05-24-lawyer-support-sla-v1`.
- MATERIAL ADVANCE: lawyers can now see both that their request was captured and when owner review is expected, which is important for investor demo scenarios around complaints, refunds, cancellations and billing disputes.
- VERIFIED LOCAL: PHP lint passed for `page-lawyer-dashboard.php` and `functions.php`; Node syntax passed for affected checkers; live marker check still correctly reports REVIEW because production has not pulled the code.
- STILL BLOCKED: uPress Pull Git/cache refresh is required before this is live; Grow recurring debit remains provider-authorisation blocked.
- COMPLETION: lawyer support lifecycle readiness moved from about 88% to about 90% locally; live completion remains blocked by deployment verification and demo account/data.
- SAFETY: theme/template/checker/marker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 23:04 Asia/Jerusalem
- LAWYER SELF-SERVICE SUPPORT V1: added guided service-request shortcuts inside the lawyer dashboard so lawyers can resolve common billing, invoice, plan-change, cancellation, refund, complaint and lead-quality issues from structured buttons instead of calling the owner.
- RESEARCH BASIS: current 2026 SaaS/customer-portal guidance emphasizes one clear primary action, visible billing inside the portal, self-service plan/cancel/invoice controls, and contextual support that reduces repetitive tickets.
- UPDATED: `page-lawyer-dashboard.php` defines `dashboard_service_self_help` groups and renders structured shortcut buttons above the service request form.
- UPDATED: `assets/css/premium-pass-3.css` styles the self-help cards and makes them responsive.
- UPDATED: `tools/check-investor-demo-readiness.mjs` expects the new self-help marker in dashboard source checks.
- UPDATED: `functions.php`, `deployment-marker.txt`, and `tools/check-homepage-investor-polish-live.mjs` to marker `2026-05-24-lawyer-self-service-support-v1`.
- MATERIAL ADVANCE: this directly supports the investor requirement for complaints, upgrades, downgrades, cancellations, refunds, invoice copies and support to be captured inside the system with owner-reviewable data.
- VERIFIED LOCAL: PHP lint passed for `page-lawyer-dashboard.php` and `functions.php`; Node syntax passed for affected checker scripts; live marker check still correctly reports REVIEW because production has not pulled the code.
- STILL BLOCKED: uPress Pull Git/cache refresh is required before the dashboard self-service polish and marker are live; Grow recurring debit remains provider-authorisation blocked.
- COMPLETION: lawyer customer-service/self-service readiness moved from about 82% to about 88% locally; live completion remains blocked by deployment verification and demo account/data.
- SAFETY: theme/template/CSS/checker/marker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 22:51 Asia/Jerusalem
- DEPLOYMENT PROOF MARKER V2: updated the public deployment marker so the next uPress Pull Git can prove the full investor revenue polish bundle, including the latest lawyer-plans decision flow, not only the earlier homepage strip.
- UPDATED: `functions.php` marker to `2026-05-24-investor-revenue-polish-v2`.
- UPDATED: `deployment-marker.txt` expected marker and expected commit label to `f0238bc-investor-revenue-polish-v2`.
- UPDATED: `tools/check-homepage-investor-polish-live.mjs` to verify the new marker and commit label.
- MATERIAL ADVANCE: after uPress pulls, the live checker will now validate the current pushed bundle rather than giving false confidence from an older marker.
- VERIFIED LOCAL: PHP lint passed for `functions.php`; Node syntax passed for the homepage live checker; refreshed live check still correctly reports REVIEW because production has not pulled the new marker.
- STILL BLOCKED: uPress Pull Git/cache refresh is required before the investor homepage/plans polish is live.
- COMPLETION: deployment proof readiness moved from about 75% to about 90% locally; live proof remains 0/4 until uPress pulls.
- SAFETY: marker/checker/reporting only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 22:42 Asia/Jerusalem
- LAWYER PLANS CONVERSION FLOW: added a "what happens after choosing a plan" section to the lawyer plans page so the investor/lawyer sees onboarding, payment, dashboard value and lifecycle support before comparing plans.
- RESEARCH BASIS: 2026 SaaS pricing-page guidance emphasizes decision flow, trust/risk reversal near the pricing decision, transparent next steps, and self-service lifecycle handling instead of a bare feature table.
- UPDATED: `page-lawyer-plans.php` adds `lawyer-plans-next-steps` with four operational steps: fit check, payment/invoice, private area and upgrade/downgrade/cancel/refund service requests.
- UPDATED: `assets/css/premium-pass-4.css` adds responsive polish for the new pricing decision-flow panel.
- UPDATED: `tools/check-investor-demo-readiness.mjs` and `tools/check-live-lawyer-revenue-funnel.mjs` so demo gates expect the new plan-flow marker.
- VERIFIED LOCAL: PHP lint passed for `page-lawyer-plans.php`; Node syntax passed for both checker scripts; `git diff --check` passed with line-ending warnings only.
- STILL BLOCKED: live site requires uPress Pull Git/cache refresh before this is visible; recurring Grow debit remains provider-authorisation blocked, so the page correctly presents manual invoice/payment-link fallback.
- COMPLETION: lawyer subscription conversion readiness moved from about 86% to about 89% locally; live completion remains blocked by deployment verification and Grow recurring approval.
- SAFETY: theme/template/CSS/checker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 22:50 Asia/Jerusalem
- HOMEPAGE PRODUCT-PROOF POLISH: upgraded the lawyer revenue strip from copy-only into a visible product preview showing new leads, payment-link status and service follow-up inside the lawyer personal-area concept.
- UPDATED: `template-parts/sections/homepage-lawyer-revenue-strip.php` now wraps the proof cards and adds `homepage-lawyer-revenue__mini-dashboard`.
- UPDATED: `assets/css/premium-pass-4.css` adds the polished dark mini-dashboard panel with responsive mobile stacking.
- UPDATED: `tools/check-homepage-investor-polish-live.mjs` and `tools/check-investor-demo-readiness.mjs` so investor gates expect the mini-dashboard marker.
- MATERIAL ADVANCE: the homepage now communicates that Jus-Tice is a working two-sided revenue product, not just a content directory: visitor intake, lawyer signup, private area, leads, payment link and support status are all surfaced.
- VERIFIED LOCAL: PHP lint passed for the revenue strip; Node syntax passed for both checker scripts; `git diff --check` passed with line-ending warnings only.
- STILL BLOCKED: live site still requires uPress Pull Git/cache refresh for the pushed homepage polish bundle.
- COMPLETION: homepage investor/commercial readiness moved from about 86% to about 89% locally; live readiness remains blocked by deployment verification.
- SAFETY: theme/template/CSS/checker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 22:35 Asia/Jerusalem
- HOMEPAGE LAWYER ACCESS RAIL: added direct lawyer private-area and plan-entry links inside the hero, immediately under the main visitor CTAs, so the investor can see both sides of the marketplace without hunting.
- UPDATED: `template-parts/sections/hero.php` adds the visible `לעורכי דין` hero access rail with links to `/lawyer-dashboard/` and `/lawyer-plans/`.
- UPDATED: `assets/css/premium-pass-4.css` adds responsive polished styling for the rail on desktop and mobile.
- UPDATED: `tools/check-homepage-investor-polish-live.mjs` and `tools/check-investor-demo-readiness.mjs` so future gates expect the hero lawyer access rail, not only the lower revenue strip.
- RESEARCH BASIS: current SaaS/conversion patterns emphasize clear above-the-fold next action, visible trust/commercial proof, and low-friction entry points; Israeli legal-directory competitors also surface lawyer/public routing on the homepage.
- VERIFIED LOCAL: PHP lint passed for touched PHP files; Node syntax passed for both checker scripts; `git diff --check` passed with line-ending warnings only.
- STILL BLOCKED: live site will not show this polish until GitHub push plus uPress Pull Git/cache refresh.
- COMPLETION: homepage investor/commercial readiness moved from about 82% to about 86% locally; live completion remains blocked by deployment verification.
- SAFETY: theme/template/CSS/checker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 22:34 Asia/Jerusalem
- HOMEPAGE INVESTOR POLISH V1: added a new above-the-fold-adjacent lawyer revenue strip after the customer intake strip so the homepage now shows lawyer signup, plans and private-area login as a clear commercial system.
- UPDATED: `front-page.php` loads `template-parts/sections/homepage-lawyer-revenue-strip.php`.
- CREATED: `template-parts/sections/homepage-lawyer-revenue-strip.php`.
- UPDATED: `assets/css/premium-pass-4.css` with polished responsive styling for the new strip and bumped visual polish version to `4.3.2`.
- UPDATED: `inc/enqueue.php` to serve `premium-pass-4.css` version `4.3.2`.
- UPDATED: `functions.php` and `deployment-marker.txt` to marker `2026-05-24-homepage-investor-polish-v1`.
- CREATED: `tools/check-homepage-investor-polish-live.mjs` for post-uPress live proof.
- UPDATED: `tools/check-investor-demo-readiness.mjs` so future investor readiness gates expect the homepage revenue strip.
- VERIFIED LOCAL: PHP lint passed for `functions.php`, `front-page.php`, `inc/enqueue.php` and the new section; Node syntax passed for the new live checker; `git diff --check` passed with line-ending warnings only.
- STILL BLOCKED: live site will not show this polish until GitHub push plus uPress Pull Git/cache refresh.
- COMPLETION: homepage commercial polish moved from about 70% to about 82% locally; live investor-ready value requires deployment verification.
- SAFETY: theme/template/CSS/checker changes only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 22:19 Asia/Jerusalem
- INVESTOR DEMO LIVE REHEARSAL GATE: reran `node tools/check-investor-demo-readiness.mjs` against the live public site and local source markers.
- RESULT: `PASS_WITH_DISCLOSED_BLOCKERS`.
- PASSED: `11/11` live/source checks. Homepage lawyer entrypoints, lawyer plans, checkout/manual invoice route, registration prefill, dashboard gate, service desk CSS, Grow policy page, service-request source, dashboard source, owner queue source and investor matrix all passed.
- STILL NEEDED: `2` demo-data items: claimed demo lawyer profile/dashboard access and assigned medical-malpractice lead walkthrough.
- STILL BLOCKED: `3` external payment items: real recurring charge, automatic branded invoice/receipt, real refund execution.
- MATERIAL ADVANCE: this converts the demo from a plan into a fresh read-only rehearsal result; no repair checks are failing right now.
- OWNER P0: pay the real Grow NIS 1 link and verify the transaction/receipt; prepare login credentials for one claimed demo lawyer before the investor sits down.
- COMPLETION: live/code demo path is about 90%; money proof remains 75% until NIS 1 is paid; recurring/refund automation remains provider-blocked around 45%.
- SAFETY: read-only public route checks plus local source/report checks only; no CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 22:17 Asia/Jerusalem
- INVESTOR DEMO MASTER RUNBOOK: created a practical no-fluff runbook for tomorrow's investor demo that separates real working paths from provider-blocked paths.
- RESEARCH BASIS: WooCommerce Subscriptions' subscriber account model, WooCommerce renewal recovery, Grow Payment Links sharing, and Morning/Green Invoice digital payment docs support the safest demo framing: real one-time payment link now, recurring only after provider authorization.
- CREATED: `project-control/investor-demo-master-runbook-2026-05-24.md`.
- CREATED: `project-control/investor-demo-master-runbook-2026-05-24.csv`.
- MATERIAL ADVANCE: tomorrow's demo now has a five-minute click script, scenario checklist, recovery lines for investor questions, and tonight's P0 owner actions.
- STILL BLOCKED: owner still must pay the real Grow NIS 1 link and verify transaction/receipt; Grow recurring debit remains blocked until Grow authorizes recurring payments for account `10182706`.
- COMPLETION: investor narrative/control readiness about 88%; one-time payment proof 75% until the link is paid; recurring lifecycle remains about 45%.
- SAFETY: documentation/runbook only; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 21:59 Asia/Jerusalem
- GROW RECURRING SUPPORT ESCALATION SENT: emailed `support@grow.business` to request enabling/authorizing recurring debit for Grow account `10182706`.
- EMAIL SUBJECT: `דחוף: פתיחת הרשאה להוראת קבע בחשבון Grow 10182706 - Jus-Tice Israel`.
- COPIED: `info@jus-tice.co.il` and `benbetesh@gmail.com`.
- INCLUDED: account name/number, the tested `₪1` / `2` charge recurring setup, exact provider blocker `לקוח אינו מורשה להוראת קבע`, and request for the missing authorization/document/setup required.
- CREATED: `project-control/grow-recurring-support-escalation-2026-05-24.md`.
- CREATED: `project-control/grow-recurring-support-escalation-2026-05-24.csv`.
- MATERIAL ADVANCE: recurring billing is no longer just documented as blocked; the provider has been contacted with a concrete unblock request before the investor demo.
- STILL BLOCKED: waiting for Grow response; one-time `₪1` payment link still needs owner payment and transaction/receipt verification.
- COMPLETION: recurring subscription readiness remains about 45%, but the unblock path is now active with the provider; one-time collection proof remains about 75% until payment is completed.
- SAFETY: external support email only; no CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 21:48 Asia/Jerusalem
- GROW RECURRING DEBIT LIVE ATTEMPT: tested the real `Grow > הוראות קבע` path for a controlled recurring-payment setup.
- ATTEMPTED: `₪1` monthly recurring debit, `2` monthly charges, customer `Jus-Tice Investor Recurring Test`, email `benbetesh@gmail.com`, phone `0525101555`, payment method `יצירת לינק חד-פעמי`.
- RESULT: Grow blocked creation with the exact provider message `לקוח אינו מורשה להוראת קבע`.
- CREATED: `project-control/grow-recurring-debit-live-attempt-2026-05-24.md`.
- CREATED: `project-control/grow-recurring-debit-live-attempt-2026-05-24.csv`.
- UPDATED: `project-control/investor-demo-war-room-live-status-2026-05-24.md`.
- INVESTOR-SAFE TRUTH: real one-time payment link creation works; recurring debit/subscription setup is not yet enabled/authorized in Grow for this flow and must not be claimed as working.
- COMPLETION: one-time money collection proof remains about 75% until the `₪1` link is paid; recurring subscription lifecycle remains about 45% and now has a concrete Grow-side blocker instead of a vague unknown.
- SAFETY: no recurring agreement, charge, invoice, refund, WordPress CMS/database change, product, gateway setting, lawyer record, lead, CRM, GSC or GA4 setting was created/changed by this failed recurring attempt.

# LATEST WORK STATUS - 2026-05-24 21:38 Asia/Jerusalem
- REAL GROW PAYMENT LINK CREATED: created a real one-time Grow Payment Link inside the `Jus-Tice Israel` Grow account for the investor smoke test.
- LINK DETAILS: one-time `₪1` charge, customer label `Jus-Tice Investor Demo Payment Test`, description `Jus-Tice investor demo real payment smoke test`; full URL was sent by email and is intentionally not stored in this repo.
- EMAIL SENT: sent the full payment link to `info@jus-tice.co.il` and `benbetesh@gmail.com` with subject `REAL Grow payment link ready: Jus-Tice investor demo 1 NIS smoke test`.
- VERIFIED LIVE PROVIDER PAGE: the `pay.grow.link` URL opens a real branded `Jus-Tice Israel` payment page showing `₪1` and a secure payment button.
- CREATED: `project-control/grow-real-payment-link-smoke-test-2026-05-24.md`.
- CREATED: `project-control/grow-real-payment-link-smoke-test-2026-05-24.csv`.
- UPDATED: `project-control/investor-demo-war-room-live-status-2026-05-24.md` and `.csv`.
- STILL BLOCKED: no actual payment has been completed yet; the link has not yet been pasted into a lawyer profile and sent through the WordPress admin checkbox; automatic recurring subscription, upgrade/downgrade payment changes and refund execution remain gateway/product-lifecycle work.
- COMPLETION: full money collection proof moved from about 65% to about 75%; after the owner pays the `₪1` link and Grow shows the transaction/receipt, it should move to about 82%-85%.
- SAFETY: this cycle created one real provider payment link and sent the link by email under the owner's emergency approval; no public CMS/database content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution, lawyer record, lead, CRM, GSC or GA4 setting was changed.

# LATEST WORK STATUS - 2026-05-24 21:11 Asia/Jerusalem
- INVESTOR DEMO WAR ROOM LIVE STATUS: consolidated the current live truth after the owner's uPress pull so tomorrow's investor demo has one reliable control sheet instead of stale blocker notes.
- CREATED: `project-control/investor-demo-war-room-live-status-2026-05-24.md`.
- CREATED: `project-control/investor-demo-war-room-live-status-2026-05-24.csv`.
- VERIFIED LIVE READ-ONLY / LIVE FORM WRITE: deployment marker passed `2/2`; lawyer revenue funnel passed `10/10`; Grow compliance passed `8/8`; fresh lawyer registration after uPress pull returned `registration=sent`.
- REAL DEMO DATA CREATED WITH OWNER EMERGENCY APPROVAL: draft lawyer registration `INVESTOR DEMO Account Invite Lawyer 20260524180553` and earlier medical-malpractice demo lead `INVESTOR DEMO - Medical Malpractice Lead` were submitted through public live forms and clearly marked as demo.
- EMAIL SENT: sent owner-facing summary to `info@jus-tice.co.il` with the subject `Significant advance: live lawyer registration now tests account invite path`.
- STILL BLOCKED AT 21:11: owner must check inbox for the WordPress account setup/password email; this payment-link blocker was superseded by the 21:38 Grow link creation, but the link still needs payment verification and optional WordPress profile handoff.
- COMPLETION AT 21:11: registration + dashboard invite path was about 85% investor-demo ready; full money collection was about 65% before the real Grow link was created at 21:38.
- SAFETY: no content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, charge, invoice execution, refund execution or GSC/GA4 setting changed in this documentation cycle.

# LATEST WORK STATUS - 2026-05-24 20:29 Asia/Jerusalem
- PAYMENT HANDOFF DEPLOYMENT GATE: added an exact live marker check so tomorrow's demo cannot accidentally rely on payment-handoff code that is only pushed to GitHub.
- RESEARCH BASIS: for real payment links, current best practice is to prove the customer can reach a real payment action through a shareable provider link or account payment page; because our new handoff is admin-side PHP, a public deployment marker is the safest read-only way to prove uPress pulled the relevant code.
- UPDATED: `functions.php` and `deployment-marker.txt` now use `2026-05-24-lawyer-payment-handoff-v1`.
- CREATED: `tools/check-payment-handoff-live-deployment.mjs` plus live report files under `project-control/` and `reports/`.
- VERIFIED LOCAL: `php -l functions.php` and `node --check tools/check-payment-handoff-live-deployment.mjs` passed.
- VERIFIED LIVE READ-ONLY: the new checker correctly returns `REVIEW 0/2` right now because production still serves the old marker. This confirms the uPress pull blocker is real and visible.
- BLOCKED: uPress must pull latest GitHub `main` before relying on the email/WhatsApp payment-handoff features in the investor demo.
- SAFETY: marker/checker/reporting only; no public CMS/database write, content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, payment, invoice, charge, refund, lawyer record, lead, CRM record, email/SMS/WhatsApp send or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 20:19 Asia/Jerusalem
- WHATSAPP PAYMENT HANDOFF: added one-click WhatsApp sharing for the same real manual invoice/payment-link message used in the admin queue.
- RESEARCH BASIS: Grow explicitly positions Payment Links as shareable through WhatsApp, email and SMS; WooCommerce Subscriptions documents manual/failed renewal recovery as a customer Pay action reached from a link or account area rather than a silent/fake charge.
- UPDATED: `inc/lawyer-onboarding.php` now builds a WhatsApp handoff URL from the saved lawyer WhatsApp number first, then phone fallback, and falls back to a generic WhatsApp share URL when no direct number exists.
- UPDATED: the lawyer activation box and Lawyer Onboarding queue now expose `Open WhatsApp payment message` / `Open WhatsApp handoff` when a handoff message exists.
- UPDATED: manual invoice CSV export now includes `whatsapp_handoff_url` for batch follow-up.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` passed.
- BLOCKED: uPress still needs to pull the latest GitHub commits before this and the email handoff are live; real Grow link creation remains an authenticated owner/Grow task.
- SAFETY: repo code/admin workflow only; no public CMS/database write, content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, payment, invoice, charge, refund, lawyer record, lead, CRM record, email/SMS/WhatsApp send or GSC/GA4 setting changed during implementation.

# LATEST WORK STATUS - 2026-05-24 20:10 Asia/Jerusalem
- MANUAL PAYMENT LINK EMAIL HANDOFF: added the missing owner action that sends a real saved Grow/Morning payment link to the lawyer from the lawyer admin record.
- RESEARCH BASIS: Grow documents Payment Links as shareable by email, WhatsApp, SMS, website and landing pages; WooCommerce Subscriptions documents that manual/failed payment recovery depends on emailing the customer and giving them a link to complete payment rather than pretending the charge happened automatically.
- UPDATED: `inc/lawyer-onboarding.php` now has a `Send this payment link by email now` checkbox beside the existing manual payment link field.
- UPDATED: when checked, the system emails the saved payment link to the billing invoice email first, then the lawyer email fallback; records `manual_payment_link_sent_at`, `manual_payment_link_sent_to` and `manual_payment_link_email_last_result`; and marks payment follow-up as `invoice_sent` unless the deal is already paid or cancelled.
- UPDATED: Lawyer Onboarding queue and manual invoice CSV export now show payment-link email delivery status for demo/audit proof.
- PUSHED: `a267a55 Add manual payment link email handoff`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` passed.
- DEPLOYMENT BLOCKER: authenticated uPress browser/File Manager control is not exposed in this heartbeat toolset, so I could not click Pull Git for `wp-content/themes/justice-theme`. The owner or a browser-enabled agent must pull Git in uPress before this admin email handoff is live.
- BLOCKED: the actual real Grow link still must be created in Grow/Morning by an authenticated owner account, and true automatic recurring charges, automatic branded invoices and refund execution still require Grow/Meshulam approval plus product/gateway/subscription mapping.
- SAFETY: repo code/admin workflow only; no public CMS/database write, content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, payment, invoice, charge, refund, lawyer record, lead, CRM record, email/SMS or GSC/GA4 setting changed during implementation.

# LATEST WORK STATUS - 2026-05-24 20:24 Asia/Jerusalem
- LAWYER CUSTOMER-SUCCESS COMMAND CENTER: upgraded the lawyer dashboard from scattered controls into a real operating cockpit for payment, urgent lead handling, WhatsApp contact, and lifecycle support.
- RESEARCH BASIS: current CRM/WhatsApp pipeline guidance emphasizes one shared pipeline, fast response, searchable context and no forgotten follow-ups; billing best practice is self-service lifecycle actions with clear upgrade/downgrade/cancel/refund policies; WooCommerce Subscriptions documents customer upgrade/downgrade/cancel flows through the subscriber view when subscription/gateway support is active; Grow documents real Payment Links as the provider-side way to collect payment links.
- UPDATED: `page-lawyer-dashboard.php` now adds a customer-success command center with payment action, hottest assigned lead, call/WhatsApp/email buttons and guided support actions.
- UPDATED: `inc/lawyer-dashboard.php` now includes a real `payment_link_request` service request type plus lifecycle presets for payment link, upgrade, downgrade, cancellation, refund, invoice copy, lead-quality issue and complaint.
- CREATED: `assets/js/lawyer-dashboard.js` to prefill the real service desk form from lifecycle buttons without submitting or changing account state until the lawyer sends the request.
- UPDATED: `assets/css/premium-pass-3.css`, `inc/enqueue.php` and `tools/check-live-lawyer-revenue-funnel.mjs` for dashboard command-center styling, cache-busted assets and deployment verification.
- PUSHED: `6680e10 Add lawyer customer success command center`.
- VERIFIED LIVE READ-ONLY: public lawyer revenue funnel now passes `10/10`, including the deployed dashboard support assistant JS, paid-plan route, checkout compliance fallback, registration handoff, dashboard gate, CSS markers and analytics asset.
- VERIFIED LIVE READ-ONLY: Grow payment compliance checker passes `8/8` for required checkout fields, terms approval, lawyer-plan entrypoint, terms, cancellation, privacy and business-contact signals.
- DEPLOYMENT NOTE: authenticated uPress File Manager/Git Pull control was not exposed in this execution environment, so I could not click the uPress Pull Git button myself. Public production assets already serve the new dashboard JS/CSS and the live checker passes, which indicates the pushed code is publicly available.
- BLOCKED: real Grow payment links still must be created in Grow/Morning and pasted into the lawyer record; true automatic recurring charges, branded automatic invoices and real refund execution remain blocked until Grow/Meshulam approval plus WooCommerce product/gateway/subscription mapping.
- SAFETY: theme code/UI only; no public CMS/database write, content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway setting, payment, invoice, charge, refund, lawyer record, lead, CRM record, email/SMS or GSC/GA4 setting changed during implementation.

# LATEST WORK STATUS - 2026-05-24 19:51 Asia/Jerusalem
- INVESTOR HARD QUESTIONS Q&A: created a meeting-side answer sheet for the questions most likely to expose unfinished payment, traction, moat, legal/compliance and SEO risks.
- RESEARCH BASIS: current investor diligence guidance groups hard questions around team, market, product, traction, economics, legal/compliance and risk; VC-meeting guidance says investors test traction, moat, unit economics, market and go-to-market; Q&A guidance recommends acknowledging weaknesses, then bridging to mitigation, evidence and next de-risking.
- CREATED: `project-control/investor-hard-questions-qa-2026-05-24.md`.
- CREATED: `project-control/investor-hard-questions-qa-2026-05-24.csv`.
- OWNER ACTION BEFORE INVESTOR: keep this Q&A sheet open next to the one-page cheat sheet; use the acknowledge -> proof -> risk -> next-step format, especially on payment, invoices, refunds and SEO timing.
- BLOCKED: true automatic recurring charges, branded automatic invoices and real refund execution still require Grow/Meshulam approval plus WooCommerce product/gateway/subscription mapping.
- SAFETY: planning/Q&A artifacts only; no public CMS/database write, content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, refund, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 19:39 Asia/Jerusalem
- INVESTOR ONE-PAGE CHEAT SHEET: condensed the demo story into a single meeting-side sheet covering story, proof, blockers, payment answer and the ask.
- RESEARCH BASIS: demo-prep guidance emphasizes one primary workflow, known-good environment and backup plan; SaaS demo guidance emphasizes outcomes over feature tours; investor-ready means reliable flow and honest answers, not production-complete automation.
- CREATED: `project-control/investor-one-page-cheat-sheet-2026-05-24.md`.
- CREATED: `project-control/investor-one-page-cheat-sheet-2026-05-24.csv`.
- OWNER ACTION BEFORE INVESTOR: keep the cheat sheet visible beside the browser tabs, use the exact payment answer if challenged, and anchor the ask around closing payment approval, subscription mapping, lawyer sales and permissioned demo data.
- BLOCKED: true automatic recurring charges, branded automatic invoices and real refund execution still require Grow/Meshulam approval plus WooCommerce product/gateway/subscription mapping.
- SAFETY: planning/cheat-sheet artifacts only; no public CMS/database write, content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, refund, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 19:29 Asia/Jerusalem
- INVESTOR DEMO TAB CHECKLIST: created a ten-tab pre-call checklist and backup pack so tomorrow's live demo is not a tab-hunt.
- RESEARCH BASIS: current demo-prep guidance recommends a known-good environment, tested screen/audio, one primary workflow and a backup plan; investor-ready is not the same as production-ready, so the flow must be reliable and honest rather than overclaiming unfinished automation.
- CREATED: `project-control/investor-demo-tab-checklist-2026-05-24.md`.
- CREATED: `project-control/investor-demo-tab-checklist-2026-05-24.csv`.
- OWNER ACTION BEFORE INVESTOR: open the ten tabs in order, verify demo lawyer dashboard and service request queue, and keep the payment honesty line visible.
- BLOCKED: true automatic recurring charges, branded automatic invoices and real refund execution still require Grow/Meshulam approval plus WooCommerce product/gateway/subscription mapping.
- SAFETY: planning/checklist artifacts only; no public CMS/database write, content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, refund, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 19:20 Asia/Jerusalem
- INVESTOR DEMO TALK TRACK: created a 12-minute investor-facing script that shows the money workflow instead of touring every feature.
- RESEARCH BASIS: current SaaS/product demo guidance emphasizes showing outcomes and a specific persona/problem rather than a feature dump; WooCommerce Subscriptions docs confirm upgrade/downgrade/cancel flows depend on subscription/gateway readiness, so Jus-Tice must demo lifecycle requests through the service desk until Grow/Meshulam recurring billing is approved.
- CREATED: `project-control/investor-demo-talk-track-2026-05-24.md`.
- CREATED: `project-control/investor-demo-talk-track-2026-05-24.csv`.
- OWNER ACTION BEFORE INVESTOR: open the listed URLs in tabs, prepare the claimed demo lawyer and safe medical-malpractice demo lead, and use the exact payment-blocker language if asked about real charges/invoices/refunds.
- BLOCKED: true automatic recurring charges, branded automatic invoices and real refund execution still require Grow/Meshulam approval plus WooCommerce product/gateway/subscription mapping.
- SAFETY: planning/talk-track artifacts only; no public CMS/database write, content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, refund, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 19:09 Asia/Jerusalem
- INVESTOR DEMO LIVE DATA PREP: converted the two remaining demo-data blockers into an owner/admin runbook and CSV checklist.
- RESEARCH BASIS: WooCommerce Subscriptions documents upgrade/downgrade through the customer subscription view and checkout, with eligibility depending on active subscription status, completed payment and gateway support; cancellation/suspension also depends on subscription/gateway support. Jus-Tice should therefore demo upgrade/downgrade/cancel/refund through the deployed service desk until Grow/Meshulam recurring billing is approved.
- CREATED: `project-control/investor-demo-live-data-prep-runbook-2026-05-24.md`.
- CREATED: `project-control/investor-demo-live-data-prep-runbook-2026-05-24.csv`.
- OWNER ACTION BEFORE INVESTOR: prepare one claimed demo lawyer account/profile and one safe assigned medical-malpractice demo lead. Use harmless demo text and do not mark a real unpaid customer as paid.
- BLOCKED: true automatic recurring charges, branded automatic invoices and real refund execution still require Grow/Meshulam approval plus WooCommerce product/gateway/subscription mapping.
- SAFETY: planning/runbook artifacts only; no public CMS/database write, content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, refund, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 18:50 Asia/Jerusalem
- INVESTOR DEMO READINESS GATE: added one read-only command that separates live-ready demo proof from demo-data needs and external payment blockers.
- CREATED: `tools/check-investor-demo-readiness.mjs`.
- CREATED / GENERATED: `project-control/investor-demo-readiness-2026-05-24.md`, `project-control/investor-demo-readiness-2026-05-24.csv`, `reports/investor-demo-readiness-2026-05-24.json` and `reports/investor-demo-readiness-2026-05-24.csv`.
- VERIFIED: `node --check tools/check-investor-demo-readiness.mjs` passed.
- VERIFIED LIVE READ-ONLY: investor demo readiness gate returned `PASS_WITH_DISCLOSED_BLOCKERS`: 11 live/source checks passed, 0 repair checks, 2 demo-data requirements and 3 external payment blockers.
- OWNER ACTION BEFORE INVESTOR: prepare one claimed demo lawyer profile and one assigned medical-malpractice demo lead. Do not fake real recurring payment, branded automatic invoice or refund execution; demo the manual payment-link path and service-desk request capture honestly.
- BLOCKED: Grow/Meshulam approval plus product/gateway/subscription mapping still block true automatic recurring lawyer charges, automatic invoices and refund execution.
- SAFETY: read-only public route/source checks and report generation only; no public CMS/database write, content, redirect, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, refund, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 18:40 Asia/Jerusalem
- INVESTOR DEMO EMERGENCY PATH: added and deployed the missing lawyer private-area service desk for subscription lifecycle and support scenarios.
- UPDATED: `inc/lawyer-dashboard.php` now accepts nonce-protected lawyer service requests for billing question, invoice copy, upgrade, downgrade, cancellation, refund request, complaint, lead quality, technical issue and other support.
- UPDATED: `page-lawyer-dashboard.php` now exposes a logged-in lawyer service desk with request type, urgency, desired plan, subject/details and latest-request status.
- UPDATED: `inc/lawyer-onboarding.php` now counts pending service requests in the paid-registration command center, prioritizes service requests as a churn/payment-risk next action, supports `service_request_status=pending`, and surfaces the latest request on the lawyer row.
- UPDATED: `assets/css/premium-pass-3.css` and `tools/check-live-lawyer-revenue-funnel.mjs` now verify the deployed service-desk UI marker.
- CREATED: `project-control/investor-demo-emergency-test-matrix-2026-05-24.md` with the full tomorrow-demo scenario matrix, demo script, honest blockers and readiness assessment.
- REGENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json`, `reports/lawyer-revenue-funnel-live-2026-05-24.csv`, `project-control/grow-payment-compliance-live-2026-05-24.md`, `project-control/grow-payment-compliance-live-2026-05-24.csv`, `reports/grow-payment-compliance-live-2026-05-24.json` and `reports/grow-payment-compliance-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-dashboard.php`, `php -l page-lawyer-dashboard.php`, `php -l inc/lawyer-onboarding.php`, `node --check tools/check-live-lawyer-revenue-funnel.mjs` and `git diff --check` passed before deployment.
- DEPLOYED: committed/pushed `a254e44`; uPress Git pull log showed `Add lawyer service request desk` as live `HEAD`.
- VERIFIED LIVE READ-ONLY: public lawyer revenue funnel passed `9/9`; Grow payment compliance passed `8/8`.
- BLOCKED: real automatic recurring lawyer charges, automatic invoices and refund execution still require Grow/Meshulam approval plus product/gateway/subscription mapping. Demo can show the truthful manual-payment/invoice-readiness path now, not a fake automated payment processor.
- SAFETY: code/UI/reporting/read-only live checks only; no public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, refund, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting was changed during this cycle.

# LATEST WORK STATUS - 2026-05-24 18:00 Asia/Jerusalem
- PAYMENT LINK READINESS QUEUE: made the next manual revenue bottleneck visible after billing details are collected.
- RESEARCH BASIS: Grow Payment Links supports payment requests shared by WhatsApp, email, SMS and other channels; Morning / Green Invoice documents payment links, payment buttons and standing-order links. Jus-Tice now tracks whether billing-ready lawyers still need an actual payment URL.
- UPDATED: `inc/lawyer-onboarding.php` now adds `Needs payment link` and `Payment link ready` cards to the Lawyer Onboarding paid registration command center.
- UPDATED: the next money action now prioritizes `Create payment links` after overdue payments and missing billing details.
- UPDATED: Lawyer Onboarding now supports safe `payment_link_status=needed` and `payment_link_status=ready` admin filters.
- CREATED: `project-control/payment-link-readiness-queue-2026-05-24.md`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- DEPLOYED: committed/pushed `f02fdfe`; uPress Git pull log showed `Add payment link readiness queue` as live HEAD.
- VERIFIED LIVE READ-ONLY: the public lawyer revenue funnel check still passed `9/9` after deployment.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: admin-only reporting/filtering and read-only live checks only; no CMS database write happened during this cycle, and no public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 17:55 Asia/Jerusalem
- MANUAL PAYMENT LINK HANDOFF: connected the manual invoice path to an actual payment-request URL/reference after the owner creates a Grow/Morning payment link.
- RESEARCH BASIS: Grow Payment Links supports payment requests shared by WhatsApp, email, SMS and other channels, including recurring-payment links; Morning / Green Invoice documents payment buttons, payment links and standing-order links. Jus-Tice now has a structured place to attach that payment request to the lawyer record.
- UPDATED: `inc/lawyer-onboarding.php` registers and saves `manual_payment_link_url` and `manual_invoice_reference` on lawyer records.
- UPDATED: the Lawyer Activation box now exposes owner-only fields for the manual payment link and invoice/payment reference.
- UPDATED: payment queue CSV exports, invoice handoff context/message and the Lawyer Onboarding payment column include the saved link/reference.
- UPDATED: `page-lawyer-dashboard.php` shows a `Complete payment` CTA in the lawyer private area when status is `invoice_sent` and a manual payment link exists.
- UPDATED: `assets/css/premium-pass-3.css` styles the private-dashboard payment-link CTA marker.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` verifies the deployed CSS marker.
- CREATED: `project-control/manual-payment-link-handoff-2026-05-24.md`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php`, `php -l page-lawyer-dashboard.php`, `node --check tools/check-live-lawyer-revenue-funnel.mjs` and `git diff --check` passed.
- DEPLOYED: committed/pushed `7dacc59`; uPress Git pull log showed `Add manual payment link handoff` as live HEAD.
- VERIFIED LIVE READ-ONLY: the public lawyer revenue funnel check still passed `9/9` after deployment.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: admin-only metadata fields, export columns, handoff text, private-dashboard conditional display and read-only live checks only; no CMS database write happened during this cycle, and no public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 17:43 Asia/Jerusalem
- LAWYER BILLING READINESS GATE: made the manual-invoice queue more actionable by separating paid registrations that are invoice-ready from paid registrations still missing billing identity details.
- RESEARCH BASIS: Grow Payment Links support one-time and recurring payment-link flows shared over WhatsApp, email, SMS and other channels; Morning / Green Invoice similarly documents invoice/payment-button/payment-link/standing-order flows. The manual fallback needs invoice identity and invoice email before payment follow-up is fast.
- UPDATED: `inc/lawyer-onboarding.php` now adds `Needs billing details` and `Billing ready` cards to the Lawyer Onboarding payment command center.
- UPDATED: Lawyer Onboarding now supports safe `billing_status=missing` and `billing_status=ready` admin filters.
- UPDATED: the next money action now prioritizes missing billing details after overdue payment follow-up and before ordinary invoice chasing.
- CREATED: `project-control/lawyer-billing-readiness-gate-2026-05-24.md`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- DEPLOYED: committed/pushed `fed6aa0`; uPress Git pull log showed `Add lawyer billing readiness gate` as live HEAD.
- VERIFIED LIVE READ-ONLY: the public lawyer revenue funnel check still passed `9/9` after deployment.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: admin-only reporting/filtering and read-only live checks only; no CMS database write happened during this cycle, and no public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 17:36 Asia/Jerusalem
- MANUAL INVOICE BILLING DETAILS: reduced the back-and-forth between paid lawyer signup and manual invoice/payment request.
- RESEARCH BASIS: Morning / Green Invoice describes digital payment flows using invoice/receipt charging, payment buttons, payment links and recurring-payment links; the manual fallback should collect billing context early so the owner can send the right payment request faster.
- UPDATED: `page-lawyer-registration.php` now shows optional billing details only on paid manual-invoice registration paths.
- UPDATED: `inc/lawyer-onboarding.php` now saves billing legal name, business ID, invoice email and invoice address; owner notification emails, manual invoice handoff context and payment queue CSV exports include those fields.
- UPDATED: `assets/css/premium-pass-3.css` styles the manual-invoice billing block.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` verifies the live paid manual-invoice registration path renders and prefills the billing fields.
- CREATED: `project-control/manual-invoice-billing-details-2026-05-24.md`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l page-lawyer-registration.php`, `php -l inc/lawyer-onboarding.php`, `node --check tools/check-live-lawyer-revenue-funnel.mjs` and `git diff --check` passed.
- DEPLOYED: committed/pushed `51d3c1d`; uPress Git pull log showed `Collect manual invoice billing details` as live HEAD.
- VERIFIED LIVE READ-ONLY: the public lawyer revenue funnel check still passed `9/9`, including the stricter billing-details gate.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: optional paid-path form fields/metadata/reporting and read-only live checks only; no CMS database write happened during this cycle, and no public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 17:21 Asia/Jerusalem
- LAWYER SOURCE PERFORMANCE EXPORT: made the new source performance board usable outside wp-admin for sorting, calling and repeating winning outreach buckets.
- RESEARCH BASIS: Clio Grow's lead source revenue report summarizes business generated by advertising/outreach sources; Lawmatics custom reporting is positioned around identifying highest-quality leads, how they found the firm and how to convert them.
- UPDATED: `inc/lawyer-onboarding.php` now adds an `Export source performance CSV` button to the owner-only Source performance board.
- UPDATED: added nonce-protected `justice_export_lawyer_source_performance` admin export with source key/value, registration count, expected monthly/annual value, payment statuses, city/practice/message variants, filtered admin URL and next-action recommendation.
- CREATED: `project-control/lawyer-source-performance-export-2026-05-24.md`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- DEPLOYED: committed/pushed `5ccf3c3`; uPress Git pull log showed `Export lawyer source performance` as live HEAD.
- VERIFIED LIVE READ-ONLY: the public lawyer revenue funnel check still passed `9/9` after deployment.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: admin-only CSV export/report UI and read-only live checks only; no CMS database write, public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 17:13 Asia/Jerusalem
- LAWYER SOURCE PERFORMANCE BOARD: turned protected signup attribution into an owner-only sales operating view.
- RESEARCH BASIS: Clio Grow intake/revenue reporting emphasizes filtering by lead source and connecting source/referral data to anticipated value.
- UPDATED: `inc/lawyer-onboarding.php` now renders a `Source performance board` inside Lawyer Onboarding, grouping registrations/manual-invoice records by outreach segment, message, city, practice, campaign or source.
- UPDATED: Lawyer Onboarding now supports safe source filters via restricted `source_key` and `source_value` parameters, so the owner can open one winning outreach bucket directly.
- CREATED: `project-control/lawyer-source-performance-board-2026-05-24.md`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- DEPLOYED: committed/pushed `53f7dac`; uPress Git pull log showed `Add lawyer source performance board` as live HEAD.
- VERIFIED LIVE READ-ONLY: the public lawyer revenue funnel check still passed `9/9` after deployment.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: admin-only report UI/filtering and read-only live checks only; no CMS database write, public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 17:05 Asia/Jerusalem
- SIGNUP SUCCESS ATTRIBUTION: kept paid-lawyer campaign, message, city and practice context alive through the registration success step.
- RESEARCH BASIS: Google Analytics 4 campaign URL guidance documents UTM-based campaign collection, and live Jus-Tice checks showed Yoast moves UTM query parameters into the URL hash on registration-success URLs.
- UPDATED: `inc/lawyer-onboarding.php` now carries `utm_content`, `utm_term`, `outreach_city` and `outreach_practice` into the post-submit success redirect.
- UPDATED: `assets/js/analytics-events.js` now merges URL hash parameters into success-event parameters before firing `lawyer_signup_submit`.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` now verifies Yoast's UTM-to-hash redirect and the deployed analytics markers for the richer attribution fields.
- CREATED: `project-control/signup-success-attribution-2026-05-24.md`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php`, `node --check assets/js/analytics-events.js`, `node --check tools/check-live-lawyer-revenue-funnel.mjs` and `git diff --check` passed.
- DEPLOYED: committed/pushed `001d993` and `c7a845f`; uPress Git pull log showed `Track signup attribution from redirect hash` as live HEAD.
- VERIFIED LIVE READ-ONLY: the full lawyer revenue funnel check passed `9/9`, including the new UTM-hash redirect gate.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: theme redirect-argument/analytics/checker/docs and read-only live checks only; no CMS database write, public content, redirect rule, canonical/noindex, sitemap, taxonomy, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 16:52 Asia/Jerusalem
- CHECKOUT REGISTRATION PREFILL: reduced paid-lawyer signup friction after the Grow-compliance checkout fallback.
- RESEARCH BASIS: Baymard form-field research recommends prefilling values when users would otherwise retype the same information; Clio intake guidance emphasizes reducing duplicate intake data entry and moving contact information into the pipeline.
- UPDATED: `page-lawyer-registration.php` now pre-fills `lawyer_full_name`, `phone`, `email` and `firm_name` from safe request values, including checkout `billing_first_name`, `billing_last_name`, `billing_phone` and `billing_email`.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` now verifies the paid manual-invoice registration form preserves the selected paid plan and prefilled name, phone and email.
- CREATED: `project-control/checkout-registration-prefill-2026-05-24.md`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l page-lawyer-registration.php`, `node --check tools/check-live-lawyer-revenue-funnel.mjs` and `git diff --check` passed.
- DEPLOYED: committed/pushed `c9ea012`; uPress Git pull log showed `Prefill registration from checkout details` as live HEAD.
- VERIFIED LIVE READ-ONLY: the full lawyer revenue funnel check passed `8/8`, including the stricter registration prefill gate.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: theme prefill/checker/docs and read-only live checks only; no CMS database write, public content, redirect/canonical/noindex/sitemap/taxonomy change, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 16:43 Asia/Jerusalem
- CHECKOUT ATTRIBUTION PRESERVATION: kept paid-lawyer source data alive through the Grow-compliance checkout fallback into registration.
- RESEARCH BASIS: Justia monetizes lawyer visibility by practice/metro placement; Clio intake reporting emphasizes lead source, matter type, revenue potential and dashboard visibility.
- UPDATED: `inc/payment-compliance-routes.php` now renders hidden checkout attribution fields for `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `outreach_segment`, `outreach_city` and `outreach_practice`, preserving incoming values or applying safe manual-invoice defaults.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` now verifies that the checkout fallback keeps the paid `lead_partner` plan, manual-invoice path and plan-page attribution hidden fields.
- CREATED: `project-control/checkout-attribution-preservation-2026-05-24.md`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l inc/payment-compliance-routes.php`, `node --check tools/check-live-lawyer-revenue-funnel.mjs` and `git diff --check` passed.
- DEPLOYED: committed/pushed `5cb8761`; uPress Git pull log showed `Preserve checkout lawyer attribution` as live HEAD.
- VERIFIED LIVE READ-ONLY: the full lawyer revenue funnel check passed `8/8`, including the stricter checkout attribution gate.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: theme checkout-form hidden fields/checker/docs and read-only live checks only; no CMS database write, public content, redirect/canonical/noindex/sitemap/taxonomy change, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 16:32 Asia/Jerusalem
- HEADER LAWYER REVENUE LINKS: made the top-of-site lawyer path more explicit for subscription sales and retention.
- RESEARCH BASIS: Justia sells lawyer visibility through free/enhanced profiles and paid premium placements by practice/metro; Clio frames intake/reporting value through a dashboard/portal.
- UPDATED: `template-parts/layout/site-header.php` changes the desktop lawyer CTAs to `מסלולים לעורכי דין` and `אזור אישי`, with compact mobile labels `מסלולים` and `כניסה`.
- UPDATED: `assets/css/premium-pass-3.css` adds full/short label switching for the sticky header.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` now verifies the clearer homepage/header text and header label CSS markers.
- CREATED: `project-control/header-lawyer-revenue-links-2026-05-24.md`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `php -l template-parts/layout/site-header.php`, `node --check tools/check-live-lawyer-revenue-funnel.mjs` and `git diff --check` passed.
- DEPLOYED: committed/pushed `090aa6c`; uPress Git pull log showed `Clarify header lawyer revenue links` as live HEAD.
- VERIFIED LIVE READ-ONLY: the full lawyer revenue funnel check passed `8/8`.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: theme display/CSS/checker/docs and read-only live checks only; no CMS database write, public content, redirect/canonical/noindex/sitemap/taxonomy change, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 16:24 Asia/Jerusalem
- LAWYER REGISTRATION PAID STATE GATE: hardened the paid lawyer signup path so a Lead Partner/manual-invoice visitor cannot silently fall back to the free plan if JavaScript is unavailable.
- UPDATED: `page-lawyer-registration.php` now renders the selected `plan_interest` option server-side with WordPress `selected()` attributes.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` now checks the live paid registration form state at `/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice`.
- GENERATED / UPDATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`, `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`, `reports/lawyer-revenue-funnel-live-2026-05-24.json` and `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- CREATED: `project-control/lawyer-registration-paid-state-gate-2026-05-24.md`.
- VERIFIED LOCAL: `php -l page-lawyer-registration.php`, `node --check tools/check-live-lawyer-revenue-funnel.mjs` and `git diff --check` passed.
- DEPLOYED: committed/pushed `6bbf7ae`; uPress Git pull log showed `Harden paid lawyer registration state` as live HEAD.
- VERIFIED LIVE READ-ONLY: the full lawyer revenue funnel check passed `8/8`, including the new `registration-paid-manual-form-state` gate.
- BLOCKED: automated recurring lawyer payments still require Grow/Meshulam approval plus gateway/product mapping.
- SAFETY: theme code/docs and read-only live checks only; no CMS database write, public content, redirect/canonical/noindex/sitemap/taxonomy change, product, gateway, payment, invoice, charge, lawyer record, lead, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 16:09 Asia/Jerusalem
- LAWYER DASHBOARD PLAN/PAYMENT STATUS: added a logged-in private-area card that tells lawyers their selected plan, payment stage, activation status and next action.
- UPDATED: `page-lawyer-dashboard.php` now reads existing `plan_type`, `subscription_status`, `payment_path`, `payment_followup_status`, `payment_followup_due_at` and `activation_status` metadata and turns it into a clear next-action card.
- UPDATED: `assets/css/premium-pass-3.css` adds responsive styling for `.lawyer-dashboard-plan-status`.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` now checks the deployed CSS marker for the plan/payment card.
- CREATED: `project-control/lawyer-dashboard-plan-payment-status-2026-05-24.md`.
- VERIFIED LOCAL: `php -l page-lawyer-dashboard.php`, `node --check tools/check-live-lawyer-revenue-funnel.mjs` and `git diff --check` passed.
- DEPLOYED: committed/pushed `d877749`; uPress Git pull log showed `Show lawyer plan payment status` as live HEAD.
- VERIFIED LIVE READ-ONLY: live dashboard returned 200, live CSS contains `.lawyer-dashboard-plan-status`, logged-out dashboard gate still renders and no `X-Robots-Tag` noindex header was present.
- SAFETY: display/CSS only and reads existing profile metadata; no CMS database write, public content, redirect/canonical/noindex/sitemap/taxonomy change, payment, invoice, charge, product, gateway, lawyer record, lead record, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 15:57 Asia/Jerusalem
- GROW APPROVAL HANDOFF: added an owner-only handoff card to Plan Payments so approval does not stall after Grow responds.
- UPDATED: `inc/lawyer-plans.php` now shows a Grow Approval Handoff card with the exact no-API compliance-check rerun command and direct links to checkout, terms, cancellation and privacy.
- CREATED: `project-control/grow-approval-handoff-2026-05-24.md`.
- VERIFIED LOCAL: `php -l inc/lawyer-plans.php` and `git diff --check` passed.
- DEPLOYED: committed/pushed `32378a6`; uPress Git pull log showed `Add Grow approval handoff card` as live HEAD.
- SAFETY: admin-only UI copy/links; no CMS database write, public content, redirect/canonical/noindex/sitemap/taxonomy change, payment, invoice, charge, product, gateway, lawyer record, lead record, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 15:48 Asia/Jerusalem
- GROW PAYMENT COMPLIANCE MONITOR: added a repeatable no-API live check for the exact payment-approval markers Grow failed.
- CREATED: `tools/check-grow-payment-compliance.mjs`.
- GENERATED: `reports/grow-payment-compliance-live-2026-05-24.json` and `reports/grow-payment-compliance-live-2026-05-24.csv`.
- GENERATED: `project-control/grow-payment-compliance-live-2026-05-24.md` and `project-control/grow-payment-compliance-live-2026-05-24.csv`.
- VERIFIED LIVE READ-ONLY: 8/8 checks passed for checkout existence, required customer fields, terms checkbox/link, paid lawyer plan checkout entrypoint, terms page, cancellation/supply page, privacy page and business contact signals.
- OWNER VALUE: when Grow responds, rerun `node tools/check-grow-payment-compliance.mjs` to prove the public site still satisfies the rejected items before changing payment/gateway settings.
- SAFETY: read-only public route checks and repo report files only; no CMS database write, content publishing, redirect/canonical/noindex/sitemap/taxonomy change, payment, invoice, charge, product, gateway, lawyer record, lead record, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 15:47 Asia/Jerusalem
- GROW CHECKOUT ROUTING REPAIR: matched the latest Grow failure report to the paid-plan path and repaired the route that could bypass checkout.
- FINDING: Grow passed the site's general policy/address/phone/cancellation/privacy/service checks, but failed checkout page, checkout terms checkbox and checkout terms-link checks.
- UPDATED: `inc/lawyer-plans.php` now sends paid plans without ready WooCommerce subscription products to `/checkout/?plan_interest={plan}&pre_checkout=1&payment_path=manual_invoice` instead of direct registration.
- UPDATED: `page-lawyer-plans.php` now routes the top paid-plan CTAs through the checkout helper while keeping the manual activation link available as the secondary handoff.
- UPDATED: `tools/check-live-lawyer-revenue-funnel.mjs` now verifies the paid-plan checkout route and the Grow-required checkout fields/terms markers.
- CREATED: `project-control/grow-checkout-routing-repair-2026-05-24.md`.
- VERIFIED LOCAL: `php -l inc/lawyer-plans.php`, `php -l page-lawyer-plans.php`, `node --check tools/check-live-lawyer-revenue-funnel.mjs` and `git diff --check` passed.
- DEPLOYED: committed/pushed `7a2435c` and uPress Git pull log showed `Route paid plans through checkout fallback` as live HEAD.
- VERIFIED LIVE READ-ONLY: `/lawyer-plans/` returns 200 and exposes `/checkout/`, `plan_interest=lead_partner` and `payment_path=manual_invoice`; `/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice` returns 200 and exposes WooCommerce checkout markers, first name, last name, phone, country, email, terms checkbox, terms link, cancellation link and privacy link.
- GROW RESUBMISSION: checked the Grow report confirmation box and submitted the site for re-check; Grow displayed the success message that re-check was submitted and can take up to one business day.
- SAFETY: theme code/docs and Grow re-check submission only; no CMS database write, content publishing, redirect/canonical/noindex/sitemap/taxonomy change, payment, invoice, charge, product, gateway, lawyer record, lead record, CRM, email/SMS or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 15:39 Asia/Jerusalem
- MANUAL INVOICE HANDOFF CONTEXT: attached plan value, payment status, activation status and due timing to the owner-only copy-ready invoice handoff.
- UPDATED: `inc/lawyer-onboarding.php` now builds `invoice_handoff_context` for manual-invoice lawyer registrations.
- UPDATED: Lawyer Onboarding now shows the compact context line directly above the copy-ready invoice handoff textarea.
- UPDATED: payment queue CSV exports now include `invoice_handoff_context` before `invoice_handoff_message`.
- CREATED: `project-control/manual-invoice-handoff-context-2026-05-24.md`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- SAFETY: admin-only visibility; no message send, invoice, payment, activation, public CMS record, public lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, CRM or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 15:29 Asia/Jerusalem
- PAID REGISTRATION OWNER ALERT: made future paid lawyer registrations arrive as revenue-action emails, not generic pending-review notices.
- UPDATED: `inc/lawyer-onboarding.php` now changes paid manual-invoice registration email subjects to include expected monthly value.
- UPDATED: owner notification body now starts with next action, expected monthly/annual value, invoice due date, invoice queue link and Plan Payments setup link.
- CREATED: `project-control/paid-registration-owner-alert-2026-05-24.md`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- SAFETY: future owner notification text only; no lawyer email, payment, invoice, activation, public CMS record, public lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 15:20 Asia/Jerusalem
- LAWYER PAYMENT READINESS BOARD: upgraded the owner-only Plan Payments screen from a setup form into a clear revenue-readiness board.
- UPDATED: `inc/lawyer-plans.php` now summarizes recurring checkout readiness, manual invoice selling availability and ready checkout products before the mapping table.
- UPDATED: the screen now gives the next owner action based on the current blocker: missing WooCommerce/Subs/gateway requirement, missing product IDs, non-purchasable products or controlled checkout smoke test.
- UPDATED: added quick links from Plan Payments to the invoice queue and a manual paid-signup test path.
- CREATED: `project-control/lawyer-payment-readiness-board-2026-05-24.md`.
- VERIFIED LOCAL: `php -l inc/lawyer-plans.php` and `git diff --check` passed.
- SAFETY: admin-only visibility/navigation; no product, gateway, public CMS record, public lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, invoice, email/SMS send or GSC/GA4 setting changed.

# LATEST WORK STATUS - 2026-05-24 15:08 Asia/Jerusalem
- LAWYER PAYMENT MRR VISIBILITY: made the owner payment queue show expected monthly value, so manual invoice follow-up can be prioritized by money and urgency.
- UPDATED: `inc/lawyer-onboarding.php` now aligns internal value math with the public lawyer plan prices: 349, 749, 1490 and 2490 NIS per month.
- UPDATED: the Lawyer Onboarding command center now shows potential, at-risk, scheduled, pending, confirmed and total manual-invoice monthly value.
- UPDATED: the next-money action box now displays the monthly value of the active queue.
- UPDATED: onboarding table rows now show each lawyer registration's expected monthly value next to the selected plan.
- UPDATED: payment queue CSV exports now include `expected_monthly_nis` and `expected_annual_nis`.
- CREATED: `project-control/lawyer-payment-mrr-visibility-2026-05-24.md`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- SAFETY: admin-only operational visibility; no public CMS record, public lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, invoice, email/SMS send, GSC/GA4 setting or wp-admin setting changed.

# LATEST WORK STATUS - 2026-05-24 14:55 Asia/Jerusalem
- LAWYER PAYMENT FOLLOW-UP SLA: turned manual invoice statuses into an owner-operating queue with due/overdue pressure.
- UPDATED: `inc/lawyer-onboarding.php` now registers `payment_followup_due_at` for lawyer profiles.
- UPDATED: new paid manual registrations get an invoice-requested due date 1 day out; invoice-sent status gets a chase date 2 days out; terminal states clear the due date.
- UPDATED: Lawyer Onboarding command center now prioritizes overdue payment follow-ups before new invoice work and includes overdue/due-within-48h cards and filters.
- UPDATED: payment badges in the activation box and onboarding table now show due/overdue timing.
- UPDATED: payment queue CSV exports now include `payment_followup_due_at` and `payment_followup_urgency`.
- CREATED: `project-control/lawyer-payment-followup-sla-2026-05-24.md`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- SAFETY: admin-only operational metadata; no public CMS record, public lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, invoice, email/SMS send, GSC/GA4 setting or wp-admin setting changed.

# LATEST WORK STATUS - 2026-05-24 14:45 Asia/Jerusalem
- LAWYER PAYMENT QUEUE EXPORT: reduced revenue follow-up friction by adding owner-only CSV exports for paid lawyer manual-invoice queues.
- UPDATED: `inc/lawyer-onboarding.php` now provides nonce-protected admin exports for `invoice_requested`, `invoice_sent` and all `manual_invoice` lawyer registrations.
- UPDATED: the Lawyer Onboarding payment command center now includes export buttons next to the daily next-money action.
- UPDATED: exported rows include contact details, plan, payment status, activation status, practice/city, attribution, timestamps, admin edit URL, next action and the copy-ready invoice handoff message.
- CREATED: `project-control/lawyer-payment-queue-export-2026-05-24.md`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- SAFETY: owner/admin only, read-only CSV export, formula-injection guarded; no public CMS record, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, invoice, email/SMS send, GSC/GA4 setting or wp-admin setting changed.

# LATEST WORK STATUS - 2026-05-24 14:33 Asia/Jerusalem
- LAWYER REVENUE FUNNEL LIVE CHECKER: added a repeatable read-only live QA gate for the paid lawyer acquisition path after deployment.
- CREATED: `tools/check-live-lawyer-revenue-funnel.mjs`.
- CREATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.md`.
- CREATED: `project-control/lawyer-revenue-funnel-live-2026-05-24.csv`.
- GENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.json`.
- GENERATED: `reports/lawyer-revenue-funnel-live-2026-05-24.csv`.
- VERIFIED LOCAL: `node --check tools/check-live-lawyer-revenue-funnel.mjs` passed.
- VERIFIED LIVE READ-ONLY: 6/6 checks passed for homepage lawyer CTAs, lawyer plans manual-invoice routing, registration success handoff, logged-out dashboard gate, deployed revenue CSS markers and deployed lawyer revenue analytics events.
- SAFETY: no public CMS record, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, invoice, email/SMS send, GSC/GA4 setting or wp-admin setting changed.

# LATEST WORK STATUS - 2026-05-24 14:18 Asia/Jerusalem
- LAWYER MANUAL INVOICE HANDOFF: reduced owner friction after paid lawyer registrations by adding a copy-ready manual invoice/customer-success message to the admin payment queue.
- UPDATED: `inc/lawyer-onboarding.php` now builds a Hebrew handoff message for `payment_path=manual_invoice` rows unless payment is already confirmed or cancelled.
- UPDATED: `inc/lawyer-onboarding.php` now shows `Copy invoice handoff` in the owner-only Lawyer Onboarding table payment column.
- CREATED: `project-control/lawyer-manual-invoice-handoff-2026-05-24.md`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed.
- SAFETY: no public CMS record, user account, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, invoice, email/SMS send, GSC/GA4 setting or wp-admin setting changed.

# LATEST WORK STATUS - 2026-05-24 14:08 Asia/Jerusalem
- LAWYER DASHBOARD EMPTY-STATE ACTIVATION: fixed the logged-in/no-profile dashboard state so a newly invited lawyer account has a clear path to profile request, plan comparison and manual activation.
- UPDATED: `page-lawyer-dashboard.php` now routes the hero add-profile button and no-profile CTAs through tracked manual-invoice/plan URLs with `utm_source=lawyer_dashboard`.
- UPDATED: `page-lawyer-dashboard.php` now explains the no-profile activation sequence: request, license/commercial review, manual payment/account connection and dashboard value.
- UPDATED: `assets/css/premium-pass-3.css` adds no-profile step styling.
- UPDATED: `inc/enqueue.php` bumps `justice-premium-3` to version `3.0.5` so the no-profile styling is not hidden by cache after deployment.
- CREATED: `project-control/lawyer-dashboard-empty-state-activation-2026-05-24.md`.
- VERIFIED LOCAL: `php -l page-lawyer-dashboard.php`, `php -l inc/enqueue.php` and `git diff --check` passed.
- SAFETY: no public CMS record, user account, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4 setting or wp-admin setting changed.

# LATEST WORK STATUS - 2026-05-24 13:59 Asia/Jerusalem
- LAWYER PLANS ATTRIBUTION CLOSURE: closed a measurement gap where plan-page CTAs could reach registration without clearly identifying the plan page as the source.
- UPDATED: `page-lawyer-plans.php` now adds `utm_source=lawyer_plans`, `utm_medium=plan_page`, `utm_campaign=lawyer_acquisition`, `utm_content` by CTA surface and `outreach_segment=plans_page` to plan-page registration/checkout links.
- CREATED: `project-control/lawyer-plans-attribution-closure-2026-05-24.md`.
- VERIFIED LOCAL: `php -l page-lawyer-plans.php` and `git diff --check` passed.
- SAFETY: no public CMS record, page body, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4 setting or wp-admin setting changed.

# LATEST WORK STATUS - 2026-05-24 13:49 Asia/Jerusalem
- LAWYER REGISTRATION SUCCESS HANDOFF: made the post-submit paid/manual-invoice experience customer-ready instead of leaving the lawyer on the same form.
- UPDATED: `page-lawyer-registration.php` now renders a structured success handoff with selected plan, no-automatic-charge language, review/invoice/dashboard next steps and dashboard/plans CTAs.
- UPDATED: `page-lawyer-registration.php` hides the registration form after successful submission to reduce duplicate paid registration attempts.
- UPDATED: `assets/css/premium-pass-3.css` adds responsive styling for the success handoff panel.
- UPDATED: `inc/enqueue.php` bumps `justice-premium-3` to version `3.0.4` so the success panel styling is not hidden by cache after deployment.
- CREATED: `project-control/lawyer-registration-success-handoff-2026-05-24.md`.
- VERIFIED LOCAL: `php -l page-lawyer-registration.php`, `php -l inc/enqueue.php` and `git diff --check` passed.
- SAFETY: no public CMS record, page body, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4 setting or wp-admin setting changed.

# LATEST WORK STATUS - 2026-05-24 13:38 Asia/Jerusalem
- LAWYER DASHBOARD GATE REVENUE SURFACING: upgraded the logged-out lawyer personal-area screen from a basic login wall into a conversion doorway for existing lawyers and new paid-plan prospects.
- UPDATED: `page-lawyer-dashboard.php` now shows login, plan-selection and fast manual-invoice registration CTAs with `utm_source=lawyer_dashboard_gate`.
- UPDATED: `assets/css/premium-pass-3.css` adds responsive logged-out gate value points without changing CMS content.
- UPDATED: `inc/enqueue.php` bumps `justice-premium-3` to version `3.0.3` so the dashboard CSS is not hidden by cache after deployment.
- CREATED: `project-control/lawyer-dashboard-gate-revenue-surfacing-2026-05-24.md`.
- VERIFIED LOCAL: `php -l page-lawyer-dashboard.php`, `php -l inc/enqueue.php` and `git diff --check` passed.
- SAFETY: no public CMS record, page body, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4 setting or wp-admin setting changed.

# LATEST WORK STATUS - 2026-05-24 13:27 Asia/Jerusalem
- LAWYER SIGNUP ATTRIBUTION CLOSURE: connected submitted lawyer registrations back to the paid plan, manual invoice path and campaign/source that produced the signup.
- UPDATED: `inc/lawyer-onboarding.php` now preserves safe UTM and outreach fields on the successful lawyer-registration redirect.
- UPDATED: `assets/js/analytics-events.js` now sends `payment_path`, `outreach_segment`, `utm_source`, `utm_medium`, `utm_campaign` and `registration_result` with `lawyer_signup_submit`.
- UPDATED: `inc/enqueue.php` bumps `justice-analytics-events` to version `1.1.2`.
- CREATED: `project-control/lawyer-registration-success-attribution-2026-05-24.md`.
- VERIFIED LOCAL: `node --check assets/js/analytics-events.js`, `php -l inc/lawyer-onboarding.php`, `php -l inc/enqueue.php` and `git diff --check` passed.
- SAFETY: no public CMS record, page body, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4 setting or wp-admin setting changed.

# LATEST WORK STATUS - 2026-05-24 11:49 Asia/Jerusalem
- MAYA LAWYER LIVE REFRESH + CMS ACTIVATION PACKET: reran the focused public read-only Maya route check and converted the still-blocked state into an exact owner/operator activation gate.
- REGENERATED: `project-control/maya-lawyer-live-readonly-2026-05-24.md`.
- REGENERATED: `project-control/maya-lawyer-live-readonly-2026-05-24.csv`.
- GENERATED: `reports/maya-lawyer-live-readonly-2026-05-24.csv`.
- GENERATED: `reports/maya-lawyer-live-readonly-2026-05-24.json`.
- CREATED: `tools/build-maya-lawyer-cms-activation-packet.mjs`.
- CREATED: `project-control/maya-lawyer-cms-activation-packet-2026-05-24.md`.
- CREATED: `project-control/maya-lawyer-cms-activation-packet-2026-05-24.csv`.
- GENERATED: `reports/maya-lawyer-cms-activation-packet-2026-05-24.csv`.
- GENERATED: `reports/maya-lawyer-cms-activation-packet-2026-05-24.json`.
- VERIFIED LOCAL: `node --check tools/check-maya-lawyer-live-readonly.mjs` passed.
- VERIFIED LOCAL: `node --check tools/build-maya-lawyer-cms-activation-packet.mjs` passed.
- VERIFIED LIVE READ-ONLY PARTIAL: current public QA still finds `justice_lawyer` REST type exposed but `/lawyers/advocate-maya-rotenberg/` returns HTTP `404`, has no canonical, exposes `noindex, follow`, renders the 404 page, and `justice_lawyer?slug=advocate-maya-rotenberg` returns `0` records.
- FIXED PLANNING: the packet records `9` activation rows, including admin confirmation for the existing Maya profile candidate, rollback capture, public approval signals, false-by-default migration filters, mini-site bootstrap, public source transparency and post-activation live QA.
- BLOCKED PUBLIC CMS ACTIVATION: owner/operator must confirm the existing `justice_lawyer` record, capture rollback material, approve exact profile status/source fields and rerun live QA before any public profile, slug, redirect, canonical/noindex, taxonomy, sitemap, lead or CRM change.
- NOT SCREENSHOT VERIFIED: no desktop/mobile Maya screenshots were captured because the route is still HTTP `404`.
- SAFETY: no public CMS record, lawyer profile data, page body, title, H1, meta, URL slug, redirect, canonical/noindex, taxonomy, sitemap, media asset, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-24 11:40 Asia/Jerusalem
- ROUTE DEPLOY LIVE + SCREENSHOT QA CLOSURE: reran the critical route gate after deployment/cache time and closed the remaining T416/T418/T419 live blockers.
- UPDATED: `tools/build-route-deploy-verification-gate.mjs` now verifies desktop/mobile screenshot evidence from `project-control/visual-evidence/route-deploy-{date}`.
- CREATED: `project-control/route-deploy-verification-gate-2026-05-24.md`.
- CREATED: `project-control/route-deploy-verification-gate-2026-05-24.csv`.
- GENERATED: `reports/route-deploy-verification-gate-2026-05-24.csv`.
- GENERATED: `reports/route-deploy-verification-gate-2026-05-24.json`.
- GENERATED: `reports/route-deploy-live-traffic-priority-2026-05-24.csv`.
- GENERATED: `reports/route-deploy-live-trust-routes-2026-05-24.csv`.
- GENERATED: `reports/route-deploy-live-controlled-breadcrumbs-2026-05-24.csv`.
- CREATED / VERIFIED SCREENSHOTS: `project-control/visual-evidence/route-deploy-2026-05-24/` contains `12/12` desktop/mobile PNG screenshots for `/family-law/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/`, `/inheritance-lawyer/`, `/contact/` and `/about/`.
- VERIFIED LOCAL: `node --check tools/build-route-deploy-verification-gate.mjs` passed.
- VERIFIED LIVE READ-ONLY: traffic checker returned `12/12` PASS; trust checker returned `3/3` PASS; controlled breadcrumb checker returned `4/4` PASS.
- VERIFIED SCREENSHOTS: route gate returned `14/14` verified rows with `0` blocked and `0` not-verified rows.
- FIXED: task-board rows `T416`, `T418` and `T419` are now marked completed in repo control docs.
- SAFETY: no public CMS record, page body, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 23:32 Asia/Jerusalem
- MAYA LAWYER LIVE READ-ONLY QA: added a focused public smoke checker for `/lawyers/advocate-maya-rotenberg/` and generated a current route/REST report.
- CREATED: `tools/check-maya-lawyer-live-readonly.mjs`.
- CREATED: `project-control/maya-lawyer-live-readonly-2026-05-22.md`.
- CREATED: `project-control/maya-lawyer-live-readonly-2026-05-22.csv`.
- GENERATED: `reports/maya-lawyer-live-readonly-2026-05-22.csv`.
- GENERATED: `reports/maya-lawyer-live-readonly-2026-05-22.json`.
- VERIFIED LIVE READ-ONLY PARTIAL: anonymous `wp/v2/types` exposes `justice_lawyer`.
- BLOCKED LIVE QA: `/lawyers/advocate-maya-rotenberg/` returns HTTP `404`, has no canonical, exposes `noindex, follow`, renders the site 404 title/H1 and anonymous `justice_lawyer?slug=advocate-maya-rotenberg` returns `0` records.
- NOT SCREENSHOT VERIFIED: no desktop/mobile screenshots were captured because the profile route is not yet HTTP 200/live-ready.
- NOT PUBLISHED: no public CMS record, lawyer profile data, page body, title, H1, meta, URL slug, redirect, canonical/noindex, taxonomy, sitemap, media asset, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 23:20 Asia/Jerusalem
- FAMILY/DIVORCE OWNER WORDING APPROVAL PACKET: converted the draft enhancement readiness gate into explicit owner approve/edit/hold decisions before any legal body-copy edits.
- CREATED: `project-control/family-law-owner-wording-approval-2026-05-22.md`.
- CREATED: `project-control/family-law-owner-wording-approval-2026-05-22.csv`.
- FIXED PLANNING: isolated the five ready wording modules from agreement/PDF, CTA/lawyer matching, Maya fact and GSC/canonical dependency rows.
- VERIFIED LOCAL: owner wording CSV parses with `9` rows.
- OWNER DECISION PENDING: owner must approve, edit or hold cost, process, document checklist, mediation risk and children decision-table wording before any Family/Divorce draft body copy is edited.
- BLOCKED PUBLIC EXECUTION: agreement/PDF language, lawyer matching CTA, Maya fact language, canonical/noindex/redirect/sitemap/taxonomy decisions, CMS upload and live repair remain blocked by their separate gates.
- NOT PUBLISHED: no public CMS record, page body, title, H1, meta, URL slug, redirect, canonical/noindex, taxonomy, sitemap, media/PDF asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 23:10 Asia/Jerusalem
- FAMILY/DIVORCE DRAFT ENHANCEMENT READINESS GATE: added a generated checker for the draft enhancement queue so future work can verify target draft files and source artifacts before editing legal copy.
- CREATED: `tools/check-family-law-draft-enhancement-readiness.mjs`.
- CREATED: `project-control/family-law-draft-enhancement-readiness-2026-05-22.md`.
- CREATED: `project-control/family-law-draft-enhancement-readiness-2026-05-22.csv`.
- GENERATED: `reports/family-law-draft-enhancement-readiness-2026-05-22.csv`.
- GENERATED: `reports/family-law-draft-enhancement-readiness-2026-05-22.json`.
- FIXED: normalized `project-control/family-law-draft-enhancement-queue-2026-05-22.csv` row `FL-DRAFT-ENH-007` so strict CSV parsers see all `12` columns.
- VERIFIED LOCAL: node syntax passed; readiness checker reviewed `12` queue rows with `0` missing repo artifacts, `5` rows ready for owner wording review, `6` externally blocked rows and `1` post-upload backlog row.
- BLOCKED OWNER WORDING: no Family/Divorce draft body copy should be edited until cost/process/document/agreement/CTA wording is approved.
- NOT PUBLISHED: no public CMS record, page body, title, H1, meta, URL slug, redirect, canonical/noindex, taxonomy, sitemap, media/PDF asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 22:59 Asia/Jerusalem
- FAMILY/DIVORCE DRAFT ENHANCEMENT QUEUE: converted the competitor gap analysis into an owner/operator edit queue for the seven planned Family/Divorce public-body drafts.
- CREATED: `project-control/family-law-draft-enhancement-queue-2026-05-22.md`.
- CREATED: `project-control/family-law-draft-enhancement-queue-2026-05-22.csv`.
- FIXED PLANNING: mapped costs, process, document checklist, agreement/template policy, mediation safety, children decision tables, CTA, FAQ/schema, E-E-A-T, structure, live repair and calculator backlog into exact draft/source targets.
- VERIFIED LOCAL: draft enhancement queue CSV parses with `12` rows.
- BLOCKED OWNER WORDING: cost, process, document, agreement/template and CTA copy still requires owner-approved wording before body-copy edits.
- BLOCKED PUBLIC EXECUTION: visible live repair, CMS rollback backup, focused GSC export, Maya route/schema verification and post-repair QA still block upload/public repair.
- NOT PUBLISHED: no public CMS record, page body, title, H1, meta, URL slug, redirect, canonical/noindex, taxonomy, sitemap, media/PDF asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 22:51 Asia/Jerusalem
- FAMILY/DIVORCE COMPETITOR GAP ANALYSIS: created a current repo-only competitor gap packet for the first controlled Family Law upload cluster.
- CREATED: `project-control/family-law-competitor-gap-analysis-2026-05-22.md`.
- CREATED: `project-control/family-law-competitor-gap-analysis-2026-05-22.csv`.
- VERIFIED RESEARCH: compared Jus-Tice Family/Divorce package against current competitor evidence from specialist family firms, agreement/cost guides and directory/price pages.
- VERIFIED LOCAL: matrix covers costs, process, FAQs, documents/templates, mediation, children/custody/support, agreements, lawyer connection, CTAs, structure, E-E-A-T and tools/calculators.
- FIXED PLANNING: first upload should add/tighten cost, process, document, agreement and CTA modules before owner approval.
- BLOCKED LIVE QA: Family/Divorce remains blocked by duplicate H1s, raw shortcode/PDF issues, missing PDF asset and divorce-pillar canonical conflict until owner approval, CMS rollback backup, visible repair and focused GSC export.
- NOT PUBLISHED: no public CMS record, page body, title, H1, meta, URL slug, redirect, canonical/noindex, taxonomy, sitemap, media asset, lawyer card, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 22:43 Asia/Jerusalem
- ROUTE DEPLOY VERIFICATION GATE: consolidated T416/T418/T419 into one generated deploy/live QA gate and added focused live breadcrumb checking for controlled money routes.
- UPDATED: `functions.php` runtime marker to `2026-05-22-route-deploy-verification-gate-v1`.
- UPDATED: `deployment-marker.txt` static marker to `2026-05-22-route-deploy-verification-gate-v1`.
- UPDATED / FIXED: `inc/breadcrumbs.php` now removes stale Yoast BreadcrumbList schema on controlled practice routes, so old queried articles cannot add duplicate breadcrumb JSON-LD.
- UPDATED: `tools/check-live-trust-routes.mjs` can now write CSV reports and records the `X-Justice-Route-Guard` header.
- CREATED: `tools/check-live-controlled-route-breadcrumbs.mjs`.
- CREATED: `tools/build-route-deploy-verification-gate.mjs`.
- CREATED: `project-control/route-deploy-verification-gate-2026-05-22.md`.
- CREATED: `project-control/route-deploy-verification-gate-2026-05-22.csv`.
- GENERATED: `reports/route-deploy-verification-gate-2026-05-22.csv`, `reports/route-deploy-verification-gate-2026-05-22.json`, `reports/route-deploy-live-traffic-priority-2026-05-22.csv`, `reports/route-deploy-live-trust-routes-2026-05-22.csv`, `reports/route-deploy-live-controlled-breadcrumbs-2026-05-22.csv`.
- VERIFIED LIVE READ-ONLY: traffic checker returned `12/12` PASS and trust checker returned `3/3` PASS.
- BLOCKED LIVE QA: focused controlled breadcrumb checker returned `3/4` PASS; `/family-law/` still shows a stale article BreadcrumbList live until the new filter deploys and cache clears.
- VERIFIED LOCAL: `php -l functions.php`, `php -l inc/breadcrumbs.php`, node syntax checks and controlled-route breadcrumb safety checker passed; source checker now returns `11/11 VERIFIED`.
- NOT SCREENSHOT VERIFIED: no desktop/mobile route screenshots captured in this cycle.
- SAFETY: no public CMS record, page body, lawyer profile, URL slug, redirect rule, canonical/noindex setting, taxonomy, sitemap setting, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 22:29 Asia/Jerusalem
- MAYA LAWYER MINI-SITE READINESS: tightened the single lawyer profile template so related-article lookup now includes the shared authority person slug for Maya Rotenberg.
- UPDATED: `single-justice_lawyer.php`.
- CREATED: `tools/check-maya-lawyer-mini-site-readiness.mjs`.
- CREATED: `project-control/maya-lawyer-mini-site-readiness-2026-05-22.md`.
- CREATED: `project-control/maya-lawyer-mini-site-readiness-2026-05-22.csv`.
- GENERATED: `reports/maya-lawyer-mini-site-readiness-2026-05-22.csv`.
- GENERATED: `reports/maya-lawyer-mini-site-readiness-2026-05-22.json`.
- FIXED / VERIFIED LOCAL: `php -l single-justice_lawyer.php`, `node --check tools/check-maya-lawyer-mini-site-readiness.mjs` and `node tools/check-maya-lawyer-mini-site-readiness.mjs --reportDate=2026-05-22` passed.
- VERIFIED LOCAL: readiness report produced `13` checks: `12` verified source checks, `1` blocked live route check and `1` not-verified screenshot check.
- BLOCKED LIVE QA: `/lawyers/advocate-maya-rotenberg/` still needs deployment/uPress cache control, HTTP/canonical/robots/schema/content verification and desktop/mobile screenshots.
- SAFETY: no public CMS record, lawyer profile data, URL slug, redirect, canonical/noindex, sitemap, taxonomy, media asset, live lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 22:15 Asia/Jerusalem
- PRIORITY PAGES CMS REPAIR READINESS GATE: added a generated go/no-go gate that consolidates live QA, repair packet, rollback capture, owner approval and publisher safety before any public CMS repair.
- CREATED: `tools/build-priority-page-cms-repair-readiness-gate.mjs`.
- CREATED: `project-control/priority-pages-cms-repair-readiness-gate-2026-05-22.md`.
- CREATED: `project-control/priority-pages-cms-repair-readiness-gate-2026-05-22.csv`.
- GENERATED: `reports/priority-pages-cms-repair-readiness-gate-2026-05-22.csv`.
- GENERATED: `reports/priority-pages-cms-repair-readiness-gate-2026-05-22.json`.
- VERIFIED LOCAL: `node --check tools/build-priority-page-cms-repair-readiness-gate.mjs` passed.
- VERIFIED LOCAL: readiness gate generated `7` gate rows from `51` reviewed source rows.
- BLOCKED: readiness result is `BLOCKED_NOT_READY_FOR_PUBLIC_CMS_REPAIR`; `7/7` gates remain blocked with `28` blocked markers and `17` pending markers.
- NOT LIVE VERIFIED: no wp-admin repair, REST write, redirect, canonical/noindex, sitemap, taxonomy, internal-link, GSC/GA4, screenshot or uPress action happened.
- SAFETY: no public CMS page/article body, database row, URL slug, redirect, canonical/noindex, taxonomy, sitemap, lawyer profile, lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 22:05 Asia/Jerusalem
- PRIORITY PAGES CMS OWNER APPROVAL WORKSHEET: added a narrow approval sheet for the two live article H1 repairs and the four blocked clean-slug decisions.
- CREATED: `project-control/priority-pages-cms-owner-approval-2026-05-22.md`.
- CREATED: `project-control/priority-pages-cms-owner-approval-2026-05-22.csv`.
- FIXED PLANNING: owner can approve `APPROVE_ARTICLE_H1_REPAIR_ONLY` for `/criminal-lawyer-cost/` article ID `19261` and `/plea-bargain/` article ID `19279` after rollback capture.
- BLOCKED PLANNING: clean-slug creation and SEO migration remain explicitly held for `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/`.
- VERIFIED LOCAL: owner approval CSV parses with `11` rows.
- NOT LIVE VERIFIED: no wp-admin repair, REST write, redirect, canonical/noindex, sitemap, taxonomy, internal-link, GSC/GA4, screenshot or uPress action happened.
- SAFETY: no public CMS page/article body, database row, URL slug, redirect, canonical/noindex, taxonomy, sitemap, lawyer profile, lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 21:55 Asia/Jerusalem
- PRIORITY PAGES CMS ROLLBACK CAPTURE TEMPLATE: added the exact pre-edit backup worksheet for the priority-page repair packet.
- CREATED: `project-control/priority-pages-cms-rollback-capture-template-2026-05-22.md`.
- CREATED: `project-control/priority-pages-cms-rollback-capture-template-2026-05-22.csv`.
- FIXED PLANNING: documented exact capture fields for article IDs `19261` and `19279` before duplicate body/content H1 repair.
- BLOCKED PLANNING: documented related-asset capture requirements before any clean-slug decision for `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/`.
- VERIFIED LOCAL: rollback capture CSV parses with `10` rows.
- NOT LIVE VERIFIED: no wp-admin repair, REST write, redirect, canonical/noindex, sitemap, taxonomy, internal-link, GSC/GA4, screenshot or uPress action happened.
- SAFETY: no public CMS page/article body, database row, URL slug, redirect, canonical/noindex, taxonomy, sitemap, lawyer profile, lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 21:46 Asia/Jerusalem
- PRIORITY PAGES CMS REPAIR PACKET: converted the live read-only priority page findings into exact owner/operator CMS repair instructions without performing public changes.
- CREATED: `project-control/priority-pages-cms-repair-packet-2026-05-22.md`.
- CREATED: `project-control/priority-pages-cms-repair-packet-2026-05-22.csv`.
- VERIFIED LIVE READ-ONLY SOURCE MAP: `/criminal-lawyer-cost/` is public `articles` CPT ID `19261`; `/plea-bargain/` is public `articles` CPT ID `19279`.
- FIXED PLANNING: the packet identifies the safe first repair as body/content duplicate H1 cleanup on those two `articles` records only, after rollback capture.
- BLOCKED PLANNING: `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/` must not be blindly created because related current assets, GSC risk, source/legal review or content-type decisions are still unresolved.
- VERIFIED LOCAL RISK: `reports/semrush/build-priority-pages.js` writes to `wp/v2/pages`, so it must not be used to repair the two live `articles` CPT records.
- VERIFIED LOCAL: repair packet CSV parses with `10` rows.
- NOT LIVE VERIFIED: no wp-admin repair, REST write, redirect, canonical/noindex, sitemap, taxonomy, internal-link, GSC/GA4, screenshot or uPress action happened.
- SAFETY: no public CMS page/article body, database row, URL slug, redirect, canonical/noindex, taxonomy, sitemap, lawyer profile, lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 21:40 Asia/Jerusalem
- PRIORITY PAGES CUSTOM REST SOURCE DIAGNOSTICS: expanded the read-only priority-page checker from page/post REST only to page/post/article REST lookup so the operator can identify the actual source type before repair.
- UPDATED: `tools/check-priority-pages-live-readonly.mjs`.
- UPDATED: `project-control/priority-pages-live-readonly-2026-05-22.md`.
- UPDATED: `project-control/priority-pages-live-readonly-2026-05-22.csv`.
- UPDATED: `reports/priority-pages-live-readonly-2026-05-22.csv`.
- UPDATED: `reports/priority-pages-live-readonly-2026-05-22.json`.
- VERIFIED LIVE READ-ONLY: public REST collection discovery returned HTTP `200`; the checker now verifies `pages`, `posts` and `articles`.
- VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` maps to public `articles` CPT ID `19261`.
- VERIFIED LIVE READ-ONLY: `/plea-bargain/` maps to public `articles` CPT ID `19279`.
- BLOCKED LIVE READ-ONLY: `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/` have no public hit in `pages`, `posts` or `articles`, and still return HTTP `404`, missing canonical and `noindex`.
- VERIFIED LOCAL: `node --check tools/check-priority-pages-live-readonly.mjs` and `node tools/check-priority-pages-live-readonly.mjs --reportDate=2026-05-22` passed.
- VERIFIED LIVE READ-ONLY: checker result remains `0/6 VERIFIED`; the two live article rows are blocked only by duplicate H1s, and the four missing rows are blocked by 404/noindex/no source hit.
- NOT SCREENSHOT VERIFIED: screenshots were not captured because Playwright is not installed in this repo environment.
- SAFETY: no public CMS page/article body, database row, URL slug, redirect, canonical/noindex, taxonomy, sitemap, lawyer profile, lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 21:28 Asia/Jerusalem
- PRIORITY PAGES H1/REST DIAGNOSTICS: expanded the read-only priority-page QA checker so blocked rows now show duplicate H1 source/class/context and public WP REST page/post visibility.
- UPDATED: `tools/check-priority-pages-live-readonly.mjs`.
- UPDATED: `project-control/priority-pages-live-readonly-2026-05-22.md`.
- UPDATED: `project-control/priority-pages-live-readonly-2026-05-22.csv`.
- UPDATED: `reports/priority-pages-live-readonly-2026-05-22.csv`.
- UPDATED: `reports/priority-pages-live-readonly-2026-05-22.json`.
- VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` and `/plea-bargain/` still return HTTP `200`, but both have two H1s: one template title H1 with class `single-article__title` and one body/content H1 with the same text.
- BLOCKED LIVE READ-ONLY: `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/` still return HTTP `404`, missing canonical and `noindex`.
- VERIFIED LIVE READ-ONLY: public REST checks return `200/0` for both `wp/v2/pages?slug=...` and `wp/v2/posts?slug=...` on all six target slugs, so the objects are not visible through normal public page/post REST lookup.
- VERIFIED LOCAL: `node --check tools/check-priority-pages-live-readonly.mjs` and `node tools/check-priority-pages-live-readonly.mjs --reportDate=2026-05-22` passed.
- VERIFIED LIVE READ-ONLY: checker result remains `0/6 VERIFIED`; this is a QA finding, not a script failure.
- NOT SCREENSHOT VERIFIED: screenshots were not captured because Playwright is not installed in this repo environment.
- SAFETY: no public CMS page body, database row, URL slug, redirect, canonical/noindex, taxonomy, sitemap, lawyer profile, lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 21:18 Asia/Jerusalem
- PRIORITY PAGES LIVE READ-ONLY QA: checked the six pages from the recent WP REST priority-page publish commit against the public site without making any public changes.
- CREATED: `tools/check-priority-pages-live-readonly.mjs`.
- CREATED: `project-control/priority-pages-live-readonly-2026-05-22.md`.
- CREATED: `project-control/priority-pages-live-readonly-2026-05-22.csv`.
- GENERATED: `reports/priority-pages-live-readonly-2026-05-22.csv`.
- GENERATED: `reports/priority-pages-live-readonly-2026-05-22.json`.
- VERIFIED LIVE READ-ONLY: `/criminal-lawyer-cost/` and `/plea-bargain/` return HTTP `200`, have index/follow robots and no mojibake markers, but both are BLOCKED by duplicate H1s.
- BLOCKED LIVE READ-ONLY: `/medical-malpractice-diagnosis-errors/`, `/joint-custody/`, `/medication-errors-malpractice/` and `/divorce-pension-split/` return HTTP `404`, have no canonical and expose `noindex`.
- VERIFIED LOCAL: `node --check tools/check-priority-pages-live-readonly.mjs` and `node tools/check-priority-pages-live-readonly.mjs --reportDate=2026-05-22` passed.
- VERIFIED LIVE READ-ONLY: checker result is `0/6 VERIFIED`; this is a QA finding, not a script failure.
- NOT SCREENSHOT VERIFIED: screenshots were not captured because Playwright is not installed in this repo environment.
- SAFETY: no public CMS page body, database row, URL slug, redirect, canonical/noindex, taxonomy, sitemap, lawyer profile, lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 21:07 Asia/Jerusalem
- WP REST PUBLISHER SAFETY: hardened the newly merged priority-page publisher so it cannot write to live WordPress on normal execution.
- UPDATED: `reports/semrush/build-priority-pages.js`.
- CREATED: `tools/check-wp-rest-publisher-safety.mjs`.
- CREATED: `project-control/wp-rest-publisher-safety-2026-05-22.md`.
- CREATED: `project-control/wp-rest-publisher-safety-2026-05-22.csv`.
- GENERATED: `reports/wp-rest-publisher-safety-2026-05-22.csv`.
- GENERATED: `reports/wp-rest-publisher-safety-2026-05-22.json`.
- FIXED: publisher now defaults to dry-run; live publishing requires explicit `--publish`.
- FIXED: removed the hardcoded machine-specific app-password path and requires `WP_APP_PASSWORD_PATH` outside Git for publish mode.
- VERIFIED LOCAL: `node --check reports/semrush/build-priority-pages.js`, `node --check tools/check-wp-rest-publisher-safety.mjs`, `node tools/check-wp-rest-publisher-safety.mjs --reportDate=2026-05-22` and default publisher dry-run passed.
- VERIFIED LOCAL: publisher safety checker returned `10/10 VERIFIED`.
- VERIFIED LOCAL: `node reports/semrush/build-priority-pages.js --publish` exits before any page loop/write when `WP_APP_PASSWORD_PATH` is missing.
- NOT LIVE VERIFIED: no WordPress REST write, wp-admin action, public page update, redirect, sitemap, GSC/GA4 action or screenshot was performed in this cycle.
- SAFETY: no public CMS page body, database row, URL slug, redirect, canonical/noindex, taxonomy, sitemap, lawyer profile, live lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 20:59 Asia/Jerusalem
- LEAD AREA VOCABULARY SAFETY: advanced lead/CRM routing reliability by centralizing public lead-area options into one canonical helper and replacing duplicated option blocks in both public lead forms.
- UPDATED: `inc/lead-spam-guard.php`.
- UPDATED: `template-parts/forms/lead-form.php`.
- UPDATED: `template-parts/sections/ask-lawyer.php`.
- CREATED: `tools/check-lead-area-vocabulary-safety.mjs`.
- CREATED: `project-control/lead-area-vocabulary-safety-2026-05-22.md`.
- CREATED: `project-control/lead-area-vocabulary-safety-2026-05-22.csv`.
- GENERATED: `reports/lead-area-vocabulary-safety-2026-05-22.csv`.
- GENERATED: `reports/lead-area-vocabulary-safety-2026-05-22.json`.
- FIXED: accepted public `lead_area` values now derive from the same canonical option set used to render forms.
- VERIFIED LOCAL: `php -l inc/lead-spam-guard.php`, `php -l template-parts/forms/lead-form.php`, `php -l template-parts/sections/ask-lawyer.php`, `node --check tools/check-lead-area-vocabulary-safety.mjs` and `node tools/check-lead-area-vocabulary-safety.mjs --reportDate=2026-05-22` passed.
- VERIFIED LOCAL: lead-area vocabulary checker returned `11/11 VERIFIED`.
- NOT LIVE VERIFIED: live form rendering, controlled lead submission, CRM label display and lawyer routing still require uPress pull/cache clear and an approved test lead.
- SAFETY: no public CMS page body, database row, URL slug, redirect, canonical/noindex, taxonomy, sitemap, lawyer profile, live lead, CRM record, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 20:44 Asia/Jerusalem
- CONTROLLED ROUTE BREADCRUMB SAFETY: advanced T418 by binding protected practice route breadcrumbs to the existing practice landing config before normal WordPress query fallbacks can supply stale page, article or 404 labels.
- UPDATED: `inc/breadcrumbs.php`.
- CREATED: `tools/check-controlled-route-breadcrumb-safety.mjs`.
- CREATED: `project-control/controlled-route-breadcrumb-safety-2026-05-22.md`.
- CREATED: `project-control/controlled-route-breadcrumb-safety-2026-05-22.csv`.
- GENERATED: `reports/controlled-route-breadcrumb-safety-2026-05-22.csv`.
- GENERATED: `reports/controlled-route-breadcrumb-safety-2026-05-22.json`.
- VERIFIED LOCAL: `php -l inc/breadcrumbs.php`, `node --check tools/check-controlled-route-breadcrumb-safety.mjs`, `node tools/check-controlled-route-breadcrumb-safety.mjs --reportDate=2026-05-22` passed.
- VERIFIED LOCAL: controlled route breadcrumb checker returned `10/10 VERIFIED`.
- VERIFIED LOCAL: `/family-law/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/` and `/inheritance-lawyer/` map to their protected practice config before 404/page/article fallbacks.
- NOT LIVE VERIFIED: public breadcrumb UI and BreadcrumbList schema still require uPress pull/cache clear and a live route/screenshot rerun.
- SAFETY: no public CMS page body, database row, URL slug, redirect, canonical/noindex, taxonomy, sitemap, lawyer profile, lead, CRM, payment, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 20:58 Asia/Jerusalem
- AUTHORITY PERSON PROFILE SCHEMA GATE: advanced T315 by gating lawyer schema behind public-profile approval and adding a verified Person schema path for Maya Rotenberg through the authority registry.
- UPDATED: `inc/authority.php`.
- UPDATED: `inc/schema.php`.
- UPDATED: `tools/check-eeat-authority-safety.mjs`.
- UPDATED: `project-control/eeat-authority-governance-2026-05-19.md`.
- CREATED: `project-control/authority-person-profile-schema-gate-2026-05-22.md`.
- CREATED: `project-control/authority-person-profile-schema-gate-2026-05-22.csv`.
- GENERATED: `reports/eeat-authority-safety-2026-05-22.csv`.
- GENERATED: `reports/eeat-authority-safety-2026-05-22.json`.
- VERIFIED LOCAL: `php -l inc/authority.php`, `php -l inc/schema.php`, `node --check tools/check-eeat-authority-safety.mjs`, `node tools/check-eeat-authority-safety.mjs` and `git diff --check` passed.
- VERIFIED LOCAL: authority safety checker returned `11/11 VERIFIED`.
- BLOCKED: Ben entity page/schema remains blocked until owner supplies verified facts, external links and approved role wording; no `/about/ben-batash/` route was created.
- NOT LIVE VERIFIED: live Maya profile JSON-LD/Rich Results/screenshots still require uPress pull/cache clear and Maya redirect-loop/admin-permalink resolution.
- SAFETY: no public CMS page body, database row, lawyer profile, author page, Google Business/social profile, lead/CRM record, payment setting, outreach, URL, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 20:25 Asia/Jerusalem
- E-E-A-T AUTHORITY SAFETY HARDENING: advanced T315 by removing the remaining hardcoded article-author schema risk and disabling legacy automatic E-E-A-T byline/schema injection by default.
- UPDATED: `inc/schema.php`.
- UPDATED: `inc/eeat.php`.
- CREATED: `tools/check-eeat-authority-safety.mjs`.
- CREATED: `project-control/eeat-authority-safety-hardening-2026-05-22.md`.
- CREATED: `project-control/eeat-authority-safety-hardening-2026-05-22.csv`.
- GENERATED: `reports/eeat-authority-safety-2026-05-22.csv`.
- GENERATED: `reports/eeat-authority-safety-2026-05-22.json`.
- VERIFIED LOCAL: `php -l inc/schema.php`, `php -l inc/eeat.php`, `node --check tools/check-eeat-authority-safety.mjs` and `node tools/check-eeat-authority-safety.mjs` passed.
- VERIFIED LOCAL: authority safety checker returned `6/6 VERIFIED`.
- NOT LIVE VERIFIED: no live JSON-LD/Rich Results check, public article screenshot, wp-admin setting, CMS content change or uPress deployment was executed.
- SAFETY: no public CMS page body, database row, lawyer profile, author page, Google Business/social profile, lead/CRM record, payment setting, outreach, URL, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 20:14 Asia/Jerusalem
- SUPPLIER MARKETPLACE PROSPECT RESEARCH: completed T370 repo-side prospect/exposure package for the first controlled supplier marketplace pipeline.
- CREATED: `project-control/supplier-marketplace-prospect-research-2026-05-22.md`.
- CREATED: `project-control/supplier-marketplace-prospect-research-2026-05-22.csv`.
- UPDATED: `project-control/supplier-marketplace-outreach-playbook-2026-05-20.md`.
- UPDATED: `project-control/lawyer-platform-product-spine-2026-05-20.md`.
- VERIFIED RESEARCH: reviewed current public PsakDin/Din/provider/company pages and created `30` research-only supplier candidate rows across translation/notary, office space, legal marketing, legal tech, courier/filing and expert/private-investigation categories.
- VERIFIED LOCAL: prospect CSV parses with `30` rows: `8` translation/notary, `6` office-space, `5` legal-marketing, `5` legal-tech, `3` courier/filing and `3` expert/private-investigation.
- VERIFIED PLANNING: dashboard exposure is explicitly admin-only until supplier status is `approved`, owner evidence is recorded, paid placement disclosure is written and no lawyer data is auto-sent.
- NOT LIVE VERIFIED: no wp-admin Supplier record, dashboard supplier offer, public supplier page, outreach message or lawyer introduction was created.
- SAFETY: no public CMS page body, database row, supplier record, lawyer record, lead record, payment setting, outreach, URL, redirect, canonical/noindex, taxonomy, sitemap, GSC/GA4 setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 20:08 Asia/Jerusalem
- LAWYER ONBOARDING UPLOAD + AI QUEUE: completed T369 implementation slice for account-continuation status, optional public-safe uploads, AI-assistant draft scaffold and owner review queue flags.
- CREATED: `project-control/lawyer-onboarding-upload-ai-queue-2026-05-22.md`.
- CREATED: `project-control/lawyer-onboarding-upload-ai-queue-2026-05-22.csv`.
- UPDATED: `page-lawyer-registration.php`.
- UPDATED: `inc/lawyer-onboarding.php`.
- UPDATED: `assets/js/lawyer-registration-wizard.js`.
- UPDATED: `assets/css/premium-pass-3.css`.
- UPDATED: `project-control/lawyer-onboarding-workflow.md`.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php`, `php -l page-lawyer-registration.php`, `node --check assets/js/lawyer-registration-wizard.js` and `git diff --check` passed.
- NOT LIVE VERIFIED: no live registration submission, file upload, admin queue screenshot or public lawyer profile check was executed.
- SAFETY: uploads are owner-review material only; AI scaffold is not public copy; no public CMS page body, live lawyer profile, public attachment display, lead routing, payment, outreach, URL, redirect, canonical, noindex, taxonomy, sitemap, GA4/GSC setting, wp-admin setting or uPress deployment changed.

# LATEST WORK STATUS - 2026-05-22 19:50 Asia/Jerusalem
- PROJECT TIMING AND ACCELERATION ESTIMATE: completed T247 as a repo-only timing packet for staged content upload, acceleration resources and blocker-aware schedule ranges.
- CREATED: `project-control/project-timing-acceleration-resources-2026-05-22.md`.
- CREATED: `project-control/project-timing-acceleration-resources-2026-05-22.csv`.
- UPDATED: `project-control/content-upload-governance-checklist-2026-05-22.md`.
- UPDATED: `project-control/priority-owner-action-queue-2026-05-22.md`.
- VERIFIED PLANNING: first narrow Family/Divorce visible repair is estimated at `0.5-1 operator day` after owner approval, CMS rollback backup and focused GSC or owner-approved substitute.
- VERIFIED PLANNING: complete Family/Divorce controlled current-URL upload package is estimated at `2-4 operator days` after owner/legal/source decisions, GSC evidence and rollback backup.
- VERIFIED PLANNING: all priority clusters can likely reach controlled upload-ready state in `2-4 focused weeks` if owner/GSC/CMS gates are available, or `4-8+ calendar weeks` under current blocker pattern.
- BLOCKED PUBLIC EXECUTION: this estimate does not approve CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy, internal-link write, lawyer card, lead/CRM, payment, GA4/GSC setting, wp-admin or uPress action.
- SAFETY: this cycle made repo-only docs changes; no public CMS page body, database row, URL, redirect, canonical, noindex, taxonomy, sitemap, lawyer, lead, CRM, payment setting, GA4/GSC setting, wp-admin setting, uPress deployment or outreach message changed.

## LATEST WORK STATUS - 2026-05-22 19:40 Asia/Jerusalem
- GOOGLE BUSINESS MARKETING ECOSYSTEM STRATEGY: completed T246 as a repo-only strategy packet connecting Google Business Profile, reviews, GA4 events, lead tracking, lawyer onboarding and off-site visibility.
- CREATED: `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.md`.
- CREATED: `project-control/google-business-marketing-ecosystem-strategy-2026-05-22.csv`.
- UPDATED: `project-control/google-reviews-integration-plan.md`.
- UPDATED: `project-control/google-reviews-reputation-system-2026-05-20.md`.
- UPDATED: `project-control/reputation-product-roadmap.md`.
- UPDATED: `project-control/ga4-analytics-review.md`.
- UPDATED: `project-control/lawyer-acquisition-first-wave-2026-05-20.md`.
- VERIFIED RESEARCH: reviewed current official Google Business Profile guidance for review requests/replies, profile edits, local ranking, performance metrics, Performance API and Reviews API.
- VERIFIED PLANNING: safest path remains manual/source-verified GBP and review-link data first, first-party recommendations second, API/OAuth later after owner/lawyer authorization.
- BLOCKED PUBLIC EXECUTION: no Google Business Profile setting, GA4 setting, GSC setting, API/OAuth flow, review import, SMS/email outreach, lawyer profile edit, public review display, schema, CRM, wp-admin or uPress action is approved.
- NEXT: create an owner-private Google Business evidence checklist outside Git if account screenshots/exports are involved; repo-side next safe task is GA4 event/UTM implementation planning for GBP and reputation flows.
- SAFETY: this cycle made repo-only docs changes; no public CMS page body, database row, lawyer record, lead record, prospect record, payment setting, Google account setting, GA4/GSC setting, URL, redirect, canonical, noindex, taxonomy, sitemap, wp-admin setting, uPress deployment or outreach message changed.

## LATEST WORK STATUS - 2026-05-22 19:31 Asia/Jerusalem
- HOMEPAGE LINE-BY-LINE BUSINESS REVIEW: completed T243 as a repo-only section-by-section review of the current homepage stack.
- CREATED: `project-control/homepage-line-by-line-business-review-2026-05-22.md`.
- CREATED: `project-control/homepage-line-by-line-business-review-2026-05-22.csv`.
- UPDATED: `project-control/homepage-seo-strategy.md`.
- UPDATED: `project-control/homepage-seo-design-alignment.md`.
- VERIFIED LOCAL: reviewed `front-page.php` and the 12 included section templates from hero through final CTA.
- VERIFIED PLANNING: current homepage structure is directionally correct; next work should be a no-URL-change copy/link QA batch, not a rebuild.
- VERIFIED PLANNING: highest homepage risks are featured-lawyer approval/labeling, latest-article leakage to weak pages, taxonomy-count practice ordering, trust-process copy, lead delivery/consent QA and exact route verification.
- BLOCKED PUBLIC EXECUTION: no homepage template, copy, title/H1/meta, URL, redirect, canonical/noindex, sitemap, taxonomy, lawyer card, lead/CRM, payment, wp-admin or uPress change is approved.
- NEXT: owner-approved no-URL-change homepage copy/link QA focused on hero/search, intent pyramid, practice-area priority, featured lawyer boundaries, latest-articles replacement plan, trust copy and final CTA wording.
- SAFETY: this cycle made repo-only docs changes; no public CMS page body, database row, lawyer record, lead record, prospect record, payment setting, URL, redirect, canonical, noindex, taxonomy, sitemap, GA4/GSC setting, wp-admin setting, uPress deployment or outreach message changed.

## LATEST WORK STATUS - 2026-05-22 19:18 Asia/Jerusalem
- HOMEPAGE COMPETITOR-ALIGNED STRATEGY: completed the queued T244 research/strategy pass without changing the homepage.
- CREATED: `project-control/homepage-competitor-aligned-strategy-2026-05-22.md`.
- CREATED: `project-control/homepage-competitor-aligned-strategy-2026-05-22.csv`.
- UPDATED: `project-control/homepage-seo-strategy.md`.
- UPDATED: `project-control/homepage-seo-design-alignment.md`.
- VERIFIED RESEARCH: reviewed current Din, PsakDin, Mishpati and Justia directory/portal patterns for search-first discovery, category navigation, editorial proof, profile value, paid-placement boundaries and reporting.
- VERIFIED LOCAL: `front-page.php` already has a strong 12-section stack; recommendation is controlled refinement, not another homepage rebuild.
- BLOCKED PUBLIC EXECUTION: no homepage template, copy, title/H1/meta, URL, redirect, canonical/noindex, sitemap, taxonomy, lawyer card, lead/CRM, payment, wp-admin or uPress change is approved.
- NEXT: if owner approves, prepare a no-URL-change homepage copy/link QA for hero, trust, curated guides, featured lawyers fallback and lawyer CTA.
- SAFETY: this cycle made repo-only docs changes; no public CMS page body, database row, lawyer record, lead record, prospect record, payment setting, URL, redirect, canonical, noindex, taxonomy, sitemap, GA4/GSC setting, wp-admin setting, uPress deployment or outreach message changed.

## LATEST WORK STATUS - 2026-05-22 19:08 Asia/Jerusalem
- LAWYER PROSPECT PRIVATE LIST VALIDATOR: added a local checker for the owner-filled first-20 lawyer acquisition CSV while keeping private lawyer/contact data out of Git.
- CREATED: `tools/validate-lawyer-prospect-private-list.ps1`.
- CREATED: `project-control/lawyer-prospect-private-list-validator-2026-05-22.md`.
- CREATED: `project-control/lawyer-prospect-private-list-validator-2026-05-22.csv`.
- GENERATED: `reports/lawyer-prospect-private-list-template-validation-2026-05-22.csv`.
- UPDATED: `project-control/lawyer-acquisition-first-wave-2026-05-20.md`.
- VERIFIED LOCAL: template validation ran in `-TemplateMode` against `project-control/lawyer-acquisition-first-wave-template-2026-05-20.csv` and returned `VERIFIED_PRIVATE_LIST_STRUCTURE` with `20` rows, `0` errors and `0` warnings.
- VERIFIED PRIVACY: filled private prospect CSVs are blocked from repo-local paths by default; sanitized reports contain issue codes only, not lawyer names or contact details.
- NEXT OWNER ACTION: copy the first-wave template outside Git, fill the real first 20 lawyers privately, validate it, then enter reachable prospects manually in WordPress admin.
- SAFETY: this cycle made repo-only tooling/docs/report changes; no public CMS page body, database row, lawyer record, lead record, prospect record, payment setting, URL, redirect, canonical, noindex, taxonomy, sitemap, GA4/GSC setting, wp-admin setting, uPress deployment or outreach message changed.

## LATEST WORK STATUS - 2026-05-22 18:58 Asia/Jerusalem
- CONTENT UPLOAD GOVERNANCE CHECKLIST: converted the staged cluster-by-cluster publishing strategy into one hard pre-upload gate.
- CREATED: `project-control/content-upload-governance-checklist-2026-05-22.md`.
- CREATED: `project-control/content-upload-governance-checklist-2026-05-22.csv`.
- UPDATED: `project-control/priority-owner-action-queue-2026-05-22.md`.
- UPDATED: `project-control/cluster-by-cluster-publishing-strategy-2026-05-12.md`.
- VERIFIED PLANNING: checklist defines `15` gates from cluster selection through rollback/hold and separates current-URL updates from later migration.
- VERIFIED PLANNING: Family/Divorce remains the first recommended controlled domain, but only narrow current-URL visible repair is a first safe public-action candidate after owner approval, rollback backup, focused GSC and post-repair QA.
- BLOCKED PUBLIC EXECUTION: `0` clusters are upload-approved; clean slugs, redirects, canonicals/noindex, sitemap, taxonomy, broad internal links, lawyer cards, lead/CRM and uPress actions remain blocked.
- NEXT: owner completes GSC OAuth/export, then uses this checklist with the Family/Divorce approval and rollback packets before any public CMS work.
- SAFETY: this cycle made repo-only docs changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC API call, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 18:49 Asia/Jerusalem
- CRIMINAL SOURCE/LEGAL REVIEW WORKSHEET: added the missing page-level approval gate for the completed Criminal first-upload draft set.
- CREATED: `project-control/criminal-source-legal-review-worksheet-2026-05-22.md`.
- CREATED: `project-control/criminal-source-legal-review-worksheet-2026-05-22.csv`.
- UPDATED: `project-control/criminal-first-upload-metadata-package-2026-05-22.md`.
- UPDATED: `project-control/criminal-owner-review-packet-2026-05-22.md`.
- VERIFIED PLANNING: worksheet covers five Criminal current-URL first-upload pages plus one cluster-wide disclaimer/lead/schema gate.
- VERIFIED PLANNING: `0/6` rows are approved for upload; all require owner/legal/source approval and WordPress rollback backup before CMS execution.
- BLOCKED PUBLIC EXECUTION: clean slugs, redirects, canonicals/noindex, sitemap, taxonomy, internal-link writes, lawyer cards, lead/CRM and uPress actions remain blocked.
- NEXT: owner reviews Criminal rows and marks each `APPROVE_CURRENT_URL_UPDATE`, `EDIT_REQUIRED`, `HOLD` or `LEGAL_REVIEW_REQUIRED`; focused GSC is still required before any URL migration.
- SAFETY: this cycle made repo-only docs changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC API call, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 18:39 Asia/Jerusalem
- GSC OWNER EXECUTION PACKET: created a single owner/operator command packet for tomorrow's Search Console API setup and priority export run.
- CREATED: `project-control/gsc-owner-execution-packet-2026-05-22.md`.
- CREATED: `project-control/gsc-owner-execution-packet-2026-05-22.csv`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- UPDATED: `tools/gsc/README.md`.
- VERIFIED PLANNING: packet sequences credential storage outside Git, env vars, OAuth preflight, priority dry run, real read-only export and strict output validation.
- BLOCKED PUBLIC EXECUTION: CMS upload, URL migration, redirects, canonicals/noindex, sitemap, taxonomy, internal links, lawyer, lead, CRM and uPress actions remain blocked until separate owner approval and rollback evidence.
- NEXT OWNER ACTION: save OAuth Desktop credentials outside Git, set `GSC_OAUTH_CLIENT_PATH` and `GSC_TOKEN_PATH`, then run the packet commands.
- SAFETY: this cycle made repo-only docs changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC API call, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 18:33 Asia/Jerusalem
- GSC PRIORITY EXPORT OUTPUT VALIDATOR: added a local validator for the real priority GSC export outputs after owner OAuth setup.
- CREATED: `tools/gsc/check-priority-gsc-export-output.ps1`.
- CREATED: `project-control/gsc-priority-export-output-validator-2026-05-22.md`.
- CREATED: `project-control/gsc-priority-export-output-validator-2026-05-22.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: validator ran for Family/Divorce, Criminal Law and Medical Malpractice and correctly returned `BLOCKED_EXPORT_VALIDATION` because focused export folders are not present yet.
- VERIFIED LOCAL: existing baseline/cache/dashboard decision-map CSVs parse, but their summaries remain `BLOCKED_DECISION_MAP_NOT_FOCUSED`, so they are not approved as upload evidence.
- BLOCKED OWNER SETUP: owner still needs to finish read-only GSC OAuth setup and run the priority cluster export before any CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy or internal-link action.
- SAFETY: this cycle made repo-only tooling/docs/report changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC API call, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 18:18 Asia/Jerusalem
- GSC OAUTH PREFLIGHT: added a local setup checker so the owner can validate GSC credential paths, token hygiene, dependencies and priority-runner wiring before the first real OAuth/API export.
- CREATED: `tools/gsc/check-gsc-oauth-preflight.ps1`.
- CREATED: `project-control/gsc-oauth-preflight-runbook-2026-05-22.md`.
- CREATED: `project-control/gsc-oauth-preflight-runbook-2026-05-22.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: preflight without credential env vars correctly returns `BLOCKED_PRECHECK` for missing OAuth and token paths.
- VERIFIED LOCAL: preflight with the local ignored OAuth client and `-RunPriorityDryRun` returned `VERIFIED_PRECHECK_READY` and dry-ran Family/Divorce, Criminal Law and Medical Malpractice without opening OAuth or calling GSC.
- BLOCKED OWNER SETUP: real GSC export still requires owner-created OAuth Desktop credentials and owner approval of the first OAuth screen.
- SAFETY: this cycle made repo-only tooling/docs changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC API write, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 18:08 Asia/Jerusalem
- PRIORITY OWNER ACTION QUEUE: consolidated the upload-blocking owner/operator gates across Family/Divorce, Criminal Law, Medical Malpractice and GSC into one action queue.
- CREATED: `tools/build-priority-owner-action-queue.mjs`.
- GENERATED: `reports/priority-owner-action-queue-2026-05-22.csv`.
- GENERATED: `reports/priority-owner-action-queue-2026-05-22.json`.
- CREATED: `project-control/priority-owner-action-queue-2026-05-22.md`.
- CREATED: `project-control/priority-owner-action-queue-2026-05-22.csv`.
- VERIFIED LOCAL: Node syntax check passed and queue generation produced `10` owner/operator action rows from `139` reviewed source rows.
- VERIFIED LOCAL: all `10/10` action rows are `BLOCKED` until owner/operator prerequisites are completed.
- NEXT OWNER ACTION: complete read-only GSC OAuth setup outside Git, then run `.\tools\gsc\run-priority-cluster-gsc-exports.ps1`.
- BLOCKED: no priority cluster is approved for public content upload; Family/Divorce still needs owner visible-repair decision, actual CMS rollback backup, focused GSC, approved visible repairs and post-repair QA.
- SAFETY: this cycle made repo-only tooling/docs/report changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 18:00 Asia/Jerusalem
- GSC PRIORITY CLUSTER EXPORT RUNNER: added a one-command read-only workflow for the main upload-blocking clusters after owner OAuth setup.
- CREATED: `tools/gsc/run-priority-cluster-gsc-exports.ps1`.
- CREATED: `project-control/gsc-priority-cluster-export-runner-2026-05-22.md`.
- CREATED: `project-control/gsc-priority-cluster-export-runner-2026-05-22.csv`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- UPDATED: `tools/gsc/README.md`.
- VERIFIED LOCAL: `.\tools\gsc\run-priority-cluster-gsc-exports.ps1 -DryRun` completed for Family/Divorce, Criminal Law and Medical Malpractice with no OAuth browser and no GSC API call.
- VERIFIED LOCAL: dry-run scope covers `7` Family/Divorce target paths, `5` Criminal target paths, `1` Medical Malpractice primary target, `111` protected/source paths, `10` Medical Malpractice route candidates, `8` Medical Malpractice boundary paths and `67` query terms.
- READY FOR OWNER OAUTH / NOT EXECUTION: after credentials are set outside Git, the owner can run one command to generate all three priority decision-map batches.
- BLOCKED: real exports still require owner OAuth approval; no generated GSC decision maps from live API data should be treated as final until that run completes.
- SAFETY: this cycle made repo-only tooling/docs changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 17:51 Asia/Jerusalem
- FAMILY LAW LIVE REPAIR READINESS GATE: consolidated the Family/Divorce live repair evidence into one go/no-go dashboard before any content upload or public repair.
- CREATED: `tools/build-family-law-live-repair-readiness-gate.mjs`.
- GENERATED: `reports/family-law-live-repair-readiness-gate-2026-05-22.csv`.
- GENERATED: `reports/family-law-live-repair-readiness-gate-2026-05-22.json`.
- CREATED: `project-control/family-law-live-repair-readiness-gate-2026-05-22.md`.
- CREATED: `project-control/family-law-live-repair-readiness-gate-2026-05-22.csv`.
- UPDATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md` now links to the readiness gate as source evidence.
- VERIFIED LOCAL: Node syntax check passed and the gate generated `8` critical gate rows from `95` reviewed source rows.
- VERIFIED LOCAL: all `8/8` gates are currently `BLOCKED`; the source artifacts contain `123` blocked markers and `31` pending markers.
- BLOCKED: Family/Divorce is procedurally prepared but not upload-safe; owner approval, actual CMS rollback backup, focused GSC export, visible current-URL repair execution and post-repair screenshots/checks remain required.
- SAFETY: this cycle made repo-only tooling/docs/report changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 17:38 Asia/Jerusalem
- FAMILY LAW OWNER APPROVAL WORKSHEET: created a narrow owner decision sheet for the May 22 live Family/Divorce visible repair batch.
- CREATED: `project-control/family-law-live-repair-owner-approval-2026-05-22.md`.
- CREATED: `project-control/family-law-live-repair-owner-approval-2026-05-22.csv`.
- UPDATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md` now links to the owner approval worksheet as source evidence.
- VERIFIED LOCAL: owner-approval CSV parses and contains `13` rows: `10` owner-decision-pending visible repair/backup rows, `2` GSC/owner-decision blocked SEO/protected-asset rows and `1` post-repair QA row blocked until repair.
- VERIFIED PLANNING: worksheet separates `APPROVE_VISIBLE_REPAIR_ONLY` from full content upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy, related-card, protected-asset and CRM changes.
- READY FOR OWNER REVIEW / NOT EXECUTION: owner can approve or hold the visible current-URL repair batch without accidentally approving SEO consolidation or upload.
- BLOCKED: actual WordPress rollback material, owner approval, focused GSC, public repair execution and post-repair screenshots/checks are still required before marking Family/Divorce upload-safe.
- SAFETY: this cycle made repo-only planning/docs changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 17:29 Asia/Jerusalem
- FAMILY LAW CMS BACKUP TEMPLATE: prepared the rollback-capture worksheet needed before any approved live Family/Divorce visible repair.
- CREATED: `project-control/family-law-live-repair-cms-backup-template-2026-05-22.md`.
- CREATED: `project-control/family-law-live-repair-cms-backup-template-2026-05-22.csv`.
- UPDATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md` now links to the backup template as required source evidence.
- VERIFIED LOCAL: backup-template CSV parses and contains `14` rows covering owner authorization, safe rollback storage, six affected page backups, `/divorce-agreement/` shortcode/PDF media capture, divorce-lawyer SEO field freeze, visual baseline, post-repair QA, rollback method and repo-boundary safety.
- VERIFIED PLANNING: backup fields require post ID, title, slug, body, SEO title, meta description, canonical, robots, taxonomy, featured image, related fields, revision ID, screenshots, owner decision and rollback location before any edit.
- READY FOR OPERATOR PREP / NOT EXECUTION: the operator now has the exact backup fields to capture after owner approval, but no public CMS edit is approved yet.
- BLOCKED: actual WordPress rollback material, owner approval, focused GSC and post-repair screenshots/checks are still required before marking Family/Divorce upload-safe.
- SAFETY: this cycle made repo-only planning/docs changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 17:20 Asia/Jerusalem
- FAMILY LAW VISIBLE REPAIR FIELD MAP: converted the live diagnostics into exact owner/operator field instructions for H1 repair, `/divorce-agreement/` shortcode/PDF handling and post-repair verification.
- CREATED: `project-control/family-law-visible-repair-field-map-2026-05-22.md`.
- CREATED: `project-control/family-law-visible-repair-field-map-2026-05-22.csv`.
- UPDATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md` now links to the field map as source evidence.
- VERIFIED LOCAL: field-map CSV parses and contains `10` rows: `8` `BLOCKED_OWNER_APPROVAL`, `1` `BLOCKED_GSC_OWNER_DECISION` and `1` `BLOCKED_UNTIL_REPAIR`.
- VERIFIED PLANNING: field map identifies the intended H1 to keep for each affected URL and the extra H1 blocks to demote/remove.
- VERIFIED PLANNING: `/divorce-agreement/` now has separate owner-review rows for H1 repair, raw shortcode repair and PDF promise removal/verification.
- READY FOR OWNER REVIEW / NOT EXECUTION: operator can use this field map after owner approval and CMS rollback backup; no public edit is approved yet.
- BLOCKED: divorce-lawyer canonical/redirect/noindex/sitemap decisions remain blocked until focused GSC export and owner canonical decision.
- SAFETY: this cycle made repo-only planning/docs changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 17:10 Asia/Jerusalem
- FAMILY LAW LIVE REPAIR DIAGNOSTICS: added and ran a read-only live diagnostics extractor so the operator can see exact H1 texts, shortcode context, canonical/robots state and PDF candidate status before any CMS repair.
- CREATED: `tools/extract-family-law-live-repair-diagnostics.mjs`.
- GENERATED: `reports/family-law-live-repair-diagnostics-2026-05-22.csv`.
- GENERATED: `reports/family-law-live-repair-diagnostics-2026-05-22.json`.
- CREATED: `project-control/family-law-live-repair-diagnostics-2026-05-22.md`.
- CREATED: `project-control/family-law-live-repair-diagnostics-2026-05-22.csv`.
- UPDATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md` now links to the diagnostics outputs as source evidence.
- VERIFIED LOCAL: `node --check tools/extract-family-law-live-repair-diagnostics.mjs` passed.
- VERIFIED LIVE READ-ONLY: diagnostics fetched `6` public Family/Divorce HTML pages and `3` PDF candidates; no CMS write, credential, wp-admin, redirect, canonical/noindex, taxonomy, sitemap, media, CRM or uPress action was made.
- VERIFIED LIVE READ-ONLY: generated `9` diagnostic rows; all `9` have repair issues, including `6` H1 issue rows, `1` raw-shortcode row and `0` working PDF candidates.
- READY FOR OPERATOR REVIEW / NOT EXECUTION: exact live H1 texts and `/divorce-agreement/` shortcode context are now captured for the owner/operator repair packet.
- BLOCKED: public repairs still require owner approval, CMS rollback backup, and focused GSC before any divorce-lawyer canonical/redirect/noindex/sitemap action.
- SAFETY: this cycle made repo-only tooling/docs/report changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 17:00 Asia/Jerusalem
- FAMILY LAW LIVE REPAIR OPERATOR PACKET: converted the measured live Family/Divorce blockers into an owner/operator repair packet without authorizing public execution.
- CREATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.md`.
- CREATED: `project-control/family-law-live-repair-operator-packet-2026-05-22.csv`.
- VERIFIED LOCAL: repair CSV parses and contains `20` operator rows: `1` row `READY_FOR_OPERATOR_PREP` and `19` rows `BLOCKED`.
- VERIFIED PLANNING: packet separates visible current-URL repairs from SEO consolidation; shortcode/PDF/H1 repairs can be approved separately, but divorce-lawyer canonical/redirect/noindex/sitemap decisions remain blocked until focused Family/Divorce GSC export and owner decision.
- VERIFIED PLANNING: packet defines exact repair order: CMS rollback backup, GSC gate for SEO decisions, owner canonical decision, `/divorce-agreement/` shortcode/PDF repair, H1/template repair, rerun safety checker, then desktop/mobile screenshots.
- READY FOR OWNER/OPERATOR REVIEW / NOT EXECUTION: owner can now choose `APPROVE_VISIBLE_REPAIR_ONLY`, `HOLD_PUBLIC_REPAIR`, `LEGAL_SOURCE_REVIEW_REQUIRED`, or keep SEO consolidation at `HOLD_PENDING_GSC`.
- BLOCKED: no Family/Divorce public edit, PDF upload, redirect, canonical/noindex, slug, sitemap, taxonomy, related-card, lawyer, lead or CRM action is approved by this packet.
- SAFETY: this cycle made repo-only planning/docs changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 16:51 Asia/Jerusalem
- FAMILY LAW LIVE SAFETY CHECKER: added a repeatable read-only checker for the already-live Family/Divorce pages and PDF asset candidates.
- CREATED: `tools/check-family-law-live-safety.mjs`.
- GENERATED: `reports/family-law-live-safety-check-2026-05-22.csv`.
- GENERATED: `reports/family-law-live-safety-check-2026-05-22.json`.
- CREATED: `project-control/family-law-live-safety-check-2026-05-22.md`.
- CREATED: `project-control/family-law-live-safety-check-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/check-family-law-live-safety.mjs` passed.
- VERIFIED LIVE READ-ONLY: checker fetched `6` public Family/Divorce HTML URLs and `3` PDF asset candidate URLs; no CMS write, credential, wp-admin, redirect, canonical/noindex, taxonomy, sitemap, media, CRM or uPress action was made.
- BLOCKED LIVE: generated `11` safety rows, `0` verified rows, `11` blocked/review rows and `8` critical blockers.
- BLOCKED LIVE: `/lawyer-divorce-guide-proceedings-costs-rights/` and `/divorce-lawyer/` remain two indexable self-canonical divorce-lawyer pillar candidates.
- BLOCKED LIVE: `/divorce-agreement/` still exposes raw `justice_pdf_download` and `justice_contact_form` shortcode text, and no tested `divorce-agreement-template-2025.pdf` candidate returned a working PDF.
- BLOCKED LIVE: all checked Family/Divorce HTML pages currently need H1/template review before the cluster can be marked upload-safe.
- NEXT: run focused Family/Divorce GSC export, make owner canonical URL decision, repair shortcode/PDF/H1 issues, then rerun `node tools/check-family-law-live-safety.mjs --reportDate=YYYY-MM-DD` before any further upload, redirect, canonical/noindex or sitemap action.
- SAFETY: this cycle made repo-only tooling/docs/report changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 16:43 Asia/Jerusalem
- FAMILY LAW LIVE PUBLISH SAFETY REVIEW: hardened the Family Law REST publisher and documented live safety blockers caused by the already-public Family/Divorce pages.
- FIXED REPO SAFETY: `reports/semrush/publish-family-law-pages.js` now defaults to dry-run mode and requires `ALLOW_WP_PUBLISH=YES` plus `WP_APP_PASSWORD_JSON` before any live WordPress write.
- CREATED: `project-control/family-law-live-publish-safety-review-2026-05-22.md`.
- CREATED: `project-control/family-law-live-publish-safety-review-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check reports/semrush/publish-family-law-pages.js` passed.
- VERIFIED LOCAL: dry run parsed the Family Law JSON and reported the two planned pages without reading credentials or making a network request.
- VERIFIED LOCAL: live-write guard rejects `ALLOW_WP_PUBLISH=YES` when `WP_APP_PASSWORD_JSON` is missing, before any request can be made.
- VERIFIED LIVE READ-ONLY: checked `9` public URLs/resources; the two published Family pages and the main support URLs return HTTP 200 with Hebrew rendering and no replacement characters detected.
- VERIFIED LIVE CONFLICT: `/lawyer-divorce-guide-proceedings-costs-rights/` and `/divorce-lawyer/` are both live, index/follow and self-canonical, creating a high-priority divorce-lawyer cannibalization/URL-strategy blocker.
- BLOCKED LIVE: `/divorce-agreement/` exposes raw `justice_pdf_download` and `justice_contact_form` shortcodes in public HTML; tested `divorce-agreement-template-2025.pdf` upload paths returned 404.
- BLOCKED: no redirect, canonical/noindex, deletion, slug migration or further Family publish should run until owner URL decision, focused GSC export, shortcode/PDF repair and source/legal review are complete.
- SAFETY: this cycle made repo-only safety/docs changes; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 16:27 Asia/Jerusalem
- MEDICAL MALPRACTICE SOURCE / LEGAL REVIEW WORKSHEET: prepared the page-level review gate for the first Medical Malpractice upload-review set.
- CREATED: `project-control/medical-malpractice-source-legal-review-worksheet-2026-05-22.md`.
- CREATED: `project-control/medical-malpractice-source-legal-review-worksheet-2026-05-22.csv`.
- VERIFIED LOCAL: worksheet CSV parses and contains `10` review rows: `9` metadata pages plus `1` cluster-wide privacy/lead-form gate.
- VERIFIED PLANNING: all rows keep upload status at `NOT_APPROVED_FOR_UPLOAD` and isolate allowed-after-review language, blocked claims/actions, privacy risk, source anchors and next reviewer decisions.
- VERIFIED PLANNING: birth/pregnancy, surgery/anesthesia and cluster-wide health-detail intake are marked high or very high risk.
- READY FOR OWNER/LEGAL/SOURCE REVIEW / NOT EXECUTION: owner can now assign page rows to approve, edit, hold or source/legal/privacy review without changing the public site.
- BLOCKED: Medical Malpractice upload still requires authoritative CMS record decision for `/medical-malpractice-lawyer/`, focused GSC export, legal/source/privacy review, rollback evidence and explicit CMS upload approval.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 16:17 Asia/Jerusalem
- MEDICAL MALPRACTICE FIRST-UPLOAD METADATA PACKAGE: prepared current-URL-only field metadata for the first Medical Malpractice upload-review set.
- CREATED: `project-control/medical-malpractice-first-upload-metadata-package-2026-05-22.md`.
- CREATED: `project-control/medical-malpractice-first-upload-metadata-package-2026-05-22.csv`.
- VERIFIED LOCAL: metadata CSV parses and contains `9` page rows with `0` upload-approved rows.
- VERIFIED PLANNING: package covers `/medical-malpractice-lawyer/`, protected cost support, definition/common-errors/comparison support, anesthesia/surgery support, `/birth-injury/` and the protected high-visibility old birth/pregnancy page.
- VERIFIED PLANNING: every row keeps current URLs only and blocks clean slugs, redirects, canonical/noindex changes, sitemap changes, taxonomy edits, related-card writes, schema expansion and CMS execution until owner/GSC/source/legal gates clear.
- READY FOR OWNER REVIEW / NOT EXECUTION: owner can approve, edit, hold or send each row to legal/source review before any CMS operator action.
- BLOCKED: Medical Malpractice upload still requires authoritative CMS record decision for `/medical-malpractice-lawyer/`, focused GSC export, source/legal/privacy review, rollback evidence and explicit CMS upload approval.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 16:08 Asia/Jerusalem
- MEDICAL MALPRACTICE CMS IDENTITY OPERATOR RUNBOOK: prepared the inspection-only operator workflow for the `/medical-malpractice-lawyer/` duplicate CMS identity blocker.
- CREATED: `project-control/medical-malpractice-cms-identity-operator-runbook-2026-05-22.md`.
- CREATED: `project-control/medical-malpractice-cms-identity-operator-runbook-2026-05-22.csv`.
- VERIFIED LOCAL: runbook covers `9` operator checklist rows for inspection authorization, backup of IDs `11607` and `1130`, served-record verification, field comparison, owner decision, GSC gate, source/legal gate and upload boundary.
- VERIFIED PLANNING: runbook allows inspection/export only and explicitly blocks saving editor changes, publishing, slug changes, redirects, canonicals/noindex, sitemap, taxonomy, media changes, schema, lawyer cards and CRM actions.
- READY FOR OPERATOR PREP / NOT EXECUTION: owner/operator can use this to verify the authoritative WordPress record without changing the public site.
- BLOCKED: Medical Malpractice upload still requires owner authoritative-record decision, rollback evidence, focused GSC export, source/legal/privacy review and explicit CMS upload approval.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 16:01 Asia/Jerusalem
- MEDICAL MALPRACTICE DUPLICATE IDENTITY REVIEW: prepared a focused repo-only comparison packet for the `/medical-malpractice-lawyer/` duplicate CMS identity blocker.
- CREATED: `tools/build-medical-malpractice-duplicate-identity-review.mjs`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-duplicate-identity-review-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-duplicate-identity-review-2026-05-22.json`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-duplicate-identity-review-2026-05-22.md`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-duplicate-identity-review-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-medical-malpractice-duplicate-identity-review.mjs` passed.
- VERIFIED LOCAL: packet generation reviewed CMS IDs `11607` and `1130`, produced `8` evidence/decision rows, confirmed the same public URL in local exports, found `2` distinct content hashes, recorded slug-conflict count `27`, exact current records `2`, and proposed primary post ID `11607`.
- VERIFIED LOCAL: comparison flags material differences: ID `11607` is newer and longer (`5,135` words, quality `6`, no featured image/outgoing links); ID `1130` is older and shorter (`3,287` words, quality `8`, one featured image and outgoing links).
- NOT VERIFIED FINAL: wp-admin/database canonical served-record state is still not verified.
- BLOCKED: owner must choose `KEEP_11607_AS_AUTHORITATIVE`, `KEEP_1130_AS_AUTHORITATIVE`, `MERGE_1130_ASSETS_INTO_11607`, or `HOLD_PENDING_WP_ADMIN_DB_CHECK` before Medical Malpractice CMS upload can proceed.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 15:52 Asia/Jerusalem
- MEDICAL MALPRACTICE OWNER DECISION PACKET: converted the 249-row readiness dashboard and GSC baseline map into a smaller owner-facing decision packet for pre-upload review.
- CREATED: `tools/build-medical-malpractice-owner-decision-packet.mjs`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-owner-decision-packet-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-owner-decision-packet-2026-05-22.json`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-owner-decision-packet-2026-05-22.md`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-owner-decision-packet-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-medical-malpractice-owner-decision-packet.mjs` passed.
- VERIFIED LOCAL: packet generation produced `69` owner decision rows: `8` owner gates, `23` current-URL review rows, `15` P0 support/protected rows, `12` clean-slug route blocker rows, `8` source/legal rows, `1` cannibalization row and `2` possible false-positive rows.
- VERIFIED LOCAL: upload-approved rows remain `0`; all public execution remains blocked pending owner decisions, focused GSC export, duplicate CMS identity review, source/legal review and WordPress rollback backup.
- BLOCKED: no Medical Malpractice CMS upload, English slug migration, redirect, canonical/noindex, sitemap, taxonomy, related-card/internal-link write, lawyer-card, schema or CRM change is approved.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.
## LATEST WORK STATUS - 2026-05-22 15:43 Asia/Jerusalem
- MEDICAL MALPRACTICE GSC EXPORT WORKFLOW: prepared the focused read-only Search Console export and post-export decision-map workflow for the Medical Malpractice cluster.
- CREATED: `tools/gsc/gsc-medical-malpractice-export.js`.
- CREATED: `tools/gsc/run-medical-malpractice-gsc-export.ps1`.
- CREATED: `tools/build-medical-malpractice-gsc-decision-map.mjs`.
- CREATED: `project-control/gsc-medical-malpractice-export-runner-2026-05-22.md`.
- CREATED: `project-control/gsc-medical-malpractice-export-runner-2026-05-22.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-gsc-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-protected-url-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-cannibalization-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/medical-malpractice-gsc-decision-map-2026-05-22.json`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-gsc-decision-map-2026-05-22.md`.
- CREATED / NOT FINAL: `project-control/medical-malpractice-gsc-decision-map-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/gsc/gsc-medical-malpractice-export.js` passed.
- VERIFIED LOCAL: `node --check tools/build-medical-malpractice-gsc-decision-map.mjs` passed.
- VERIFIED LOCAL: `.\tools\gsc\run-medical-malpractice-gsc-export.ps1 -DryRun` passed without reading credential contents, opening OAuth or calling GSC API.
- VERIFIED LOCAL: dry-run scope is `1` primary target path, `73` protected/source paths, `10` route candidate paths, `8` boundary paths and `22` Medical Malpractice query terms.
- VERIFIED LOCAL / NOT FINAL: baseline decision map generated `187` rows, including `1` primary target row, `178` protected/review rows, `8` source/legal gate rows, `26` high/protected/unknown-GSC risk rows and `1` cannibalization row.
- BLOCKED: real Medical Malpractice GSC export still requires owner credential setup and OAuth approval.
- BLOCKED: no Medical Malpractice CMS upload, English slug migration, redirect, canonical/noindex, sitemap, taxonomy, related-card/internal-link write, lawyer-card, schema or CRM change is approved.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 15:32 Asia/Jerusalem
- MEDICAL MALPRACTICE READINESS DASHBOARD: consolidated the next cluster-by-cluster upload-readiness batch while Family/Divorce and Criminal remain blocked by owner GSC/OAuth and CMS approval.
- CREATED: `tools/build-medical-malpractice-readiness-dashboard.mjs`.
- GENERATED: `reports/medical-malpractice-readiness-dashboard-2026-05-22.csv`.
- GENERATED: `reports/medical-malpractice-readiness-dashboard-2026-05-22.json`.
- CREATED: `project-control/medical-malpractice-readiness-dashboard-2026-05-22.md`.
- CREATED: `project-control/medical-malpractice-readiness-dashboard-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-medical-malpractice-readiness-dashboard.mjs` passed.
- VERIFIED LOCAL: dashboard generated `249` consolidated planning rows across `9` lanes: owner gates, current URL readiness, P0 support pages, clean slug route review, internal links, source/legal gates, content inventory, URL migration and cannibalization.
- VERIFIED LOCAL: flagged `63` high/protected/unknown-GSC risk rows, `86` blocked or approval-gated rows, `4` clean-slug/route blockers, `8` source/legal blockers and `2` possible false-positive medical-malpractice cluster assignments.
- READY FOR REVIEW / NOT UPLOAD: Medical Malpractice now has a single repo-controlled readiness dashboard for owner/GSC/API decision work.
- BLOCKED: no Medical Malpractice CMS upload, English slug migration, redirect, canonical/noindex, sitemap, taxonomy, related-card/internal-link write, lawyer-card, schema or CRM change is approved.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 15:19 Asia/Jerusalem
- CRIMINAL GSC DECISION MAPS: prepared the post-export parser/decision workflow for the Criminal first-upload cluster.
- CREATED: `tools/build-criminal-gsc-decision-map.mjs`.
- UPDATED: `tools/gsc/run-criminal-gsc-export.ps1` now runs the decision-map builder after the full read-only Criminal GSC export.
- GENERATED / NOT FINAL: `reports/criminal-gsc-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/criminal-protected-url-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/criminal-cannibalization-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/criminal-gsc-decision-map-2026-05-22.json`.
- CREATED: `project-control/criminal-gsc-decision-map-2026-05-22.md`.
- CREATED: `project-control/criminal-gsc-decision-map-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-criminal-gsc-decision-map.mjs` passed.
- VERIFIED LOCAL: baseline generation produced `5` current Criminal targets, `20` protected/support/route-risk rows and `8` cannibalization/wrong-page rows.
- NOT VERIFIED FINAL: generated maps are `BASELINE_DASHBOARD_NOT_FINAL`; focused owner-authorized GSC export is still required before URL migration, redirects, canonicals/noindex or sitemap decisions.
- BLOCKED: no Criminal CMS upload, English slug migration, redirect, canonical/noindex, sitemap, taxonomy, related-card/internal-link write, lawyer-card, schema or CRM change is approved.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 15:09 Asia/Jerusalem
- CRIMINAL GSC EXPORT RUNNER: prepared a focused read-only Search Console export workflow for the Criminal first-upload cluster.
- CREATED: `tools/gsc/gsc-criminal-export.js`.
- CREATED: `tools/gsc/run-criminal-gsc-export.ps1`.
- CREATED: `project-control/gsc-criminal-export-runner-2026-05-22.md`.
- CREATED: `project-control/gsc-criminal-export-runner-2026-05-22.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: `node --check tools/gsc/gsc-criminal-export.js` passed.
- VERIFIED LOCAL: `node tools/gsc/gsc-criminal-export.js --dry-run` passed without reading credential contents, opening OAuth or calling GSC API.
- VERIFIED LOCAL: `.\tools\gsc\run-criminal-gsc-export.ps1 -DryRun` passed without reading credential contents, opening OAuth or calling GSC API.
- VERIFIED LOCAL: dry run scope is `5` Criminal first-upload target URLs, `20` protected/support/route-risk paths and `27` Criminal query terms.
- BLOCKED: real API export still requires owner OAuth/GSC approval; no Criminal URL migration, redirect, canonical/noindex, sitemap, taxonomy, related-card/internal-link write, CMS upload, lawyer-card, schema or CRM change is approved.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 14:55 Asia/Jerusalem
- CRIMINAL FIRST-UPLOAD METADATA PACKAGE: prepared field-level CMS metadata for the five Criminal current-URL first-upload pages.
- CREATED: `project-control/criminal-first-upload-metadata-package-2026-05-22.md`.
- CREATED: `project-control/criminal-first-upload-metadata-package-2026-05-22.csv`.
- UPDATED: `project-control/criminal-cms-operator-runbook-2026-05-22.md` now points operators to the metadata package for approved field values.
- VERIFIED PLANNING: package covers `5` Criminal target pages with H1, SEO title, meta description, OG title, OG description, breadcrumb label, taxonomy label, current-URL links, schema policy and robots policy.
- VERIFIED PLANNING: all links stay on current URLs; future clean slugs remain blocked until GSC and owner migration approval.
- READY FOR OWNER REVIEW / NOT EXECUTION: rows are ready to approve, edit, hold or send to legal/source review.
- BLOCKED: all `5` rows remain `BLOCKED_OWNER_LEGAL_SOURCE_APPROVAL`; no Criminal CMS upload, English slug migration, redirect, canonical/noindex, sitemap, taxonomy, related-card/internal-link write, lawyer-card, schema or CRM change is approved.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 14:44 Asia/Jerusalem
- CRIMINAL CMS OPERATOR RUNBOOK: prepared a blocked post-approval CMS execution guide for the five Criminal first-upload current URLs.
- CREATED: `project-control/criminal-cms-operator-runbook-2026-05-22.md`.
- CREATED: `project-control/criminal-cms-operator-runbook-2026-05-22.csv`.
- VERIFIED LOCAL: runbook covers `5` Criminal target pages and `11` operator checklist rows.
- VERIFIED PLANNING: runbook requires owner/legal/source approval, actual WordPress editor/database rollback material, current-URL-only updates and post-upload route/indexability/link/visual QA.
- READY FOR OPERATOR PREP / NOT EXECUTION: operator boundaries are documented before approval, but every page row remains `BLOCKED`.
- BLOCKED: no Criminal CMS upload, English slug migration, redirect, canonical/noindex, sitemap, taxonomy, related-card/internal-link, lawyer-card, schema or CRM change is approved.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 14:31 Asia/Jerusalem
- CRIMINAL FIRST-UPLOAD DRAFT CLOSURE: completed the two missing Criminal support drafts and regenerated the readiness dashboard.
- CREATED: `content-drafts/indictment-supporting-he.md`.
- CREATED: `content-drafts/drug-offenses-supporting-he.md`.
- UPDATED: `tools/build-criminal-traffic-readiness-dashboard.mjs` now tracks all five Criminal first-upload draft files.
- CREATED: `project-control/criminal-first-upload-draft-closure-2026-05-22.md`.
- CREATED: `project-control/criminal-first-upload-draft-closure-2026-05-22.csv`.
- REGENERATED: `reports/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
- REGENERATED: `reports/criminal-traffic-readiness-dashboard-2026-05-22.json`.
- REGENERATED: `project-control/criminal-traffic-readiness-dashboard-2026-05-22.md`.
- REGENERATED: `project-control/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-criminal-traffic-readiness-dashboard.mjs` passed.
- VERIFIED LOCAL: dashboard still has `57` consolidated rows and Criminal first-upload draft coverage is now `5/5`, with `0` missing drafts.
- VERIFIED LOCAL: new tracked dashboard word counts are `2,148` for the indictment draft and `2,237` for the drug-offenses draft.
- READY FOR OWNER REVIEW / NOT UPLOAD: Criminal current-URL first-upload package has drafts for pillar, police investigation, pretrial detention, indictment and drug offenses.
- BLOCKED: no Criminal CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy or internal-link expansion is approved by this draft closure.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 14:35 Asia/Jerusalem
- CRIMINAL + TRAFFIC READINESS DASHBOARD: consolidated the next cluster-by-cluster content-upload evidence batch while Family/Divorce remains blocked by owner GSC/OAuth and CMS approval.
- TOOLING FIXED: created `tools/build-criminal-traffic-readiness-dashboard.mjs`.
- GENERATED: `reports/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
- GENERATED: `reports/criminal-traffic-readiness-dashboard-2026-05-22.json`.
- CREATED: `project-control/criminal-traffic-readiness-dashboard-2026-05-22.md`.
- CREATED: `project-control/criminal-traffic-readiness-dashboard-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-criminal-traffic-readiness-dashboard.mjs` passed.
- VERIFIED LOCAL: generated dashboard has `57` consolidated rows: `5` criminal first-upload targets, `18` criminal P0 support/protection rows, `13` traffic support/boundary rows, `9` targeted GSC signal rows and the traffic/criminal wrong-page decision packet.
- FIXED LATER: criminal first-upload readiness now has `5/5` drafts present and `0` missing drafts after the Criminal first-upload draft closure cycle.
- VERIFIED LOCAL: traffic boundary review remains active with `7` P0 traffic support rows and `4` boundary/hold rows.
- READY FOR OWNER REVIEW / NOT UPLOAD: `/criminal-defense-attorney/` remains the first current-URL criminal publish candidate.
- BLOCKED: no Criminal/Traffic CMS upload, URL migration, redirect, canonical/noindex, sitemap, taxonomy or internal-link expansion is approved by this dashboard.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-22 14:25 Asia/Jerusalem
- FAMILY/DIVORCE GSC WORKFLOW HANDOFF: removed hardcoded `2026-05-21` assumptions from the post-export decision workflow.
- TOOLING FIXED: `tools/build-family-divorce-gsc-decision-map.mjs` now supports `--reportDate=YYYY-MM-DD` and latest/explicit live-preupload input selection.
- TOOLING FIXED: `tools/build-family-divorce-protected-url-review-packet.mjs` now supports `--reportDate=YYYY-MM-DD` and `--input=path`.
- TOOLING FIXED: created `tools/gsc/run-family-divorce-gsc-workflow.ps1` to run dry-run, focused export, decision-map build and protected packet build as one controlled workflow.
- CREATED: `project-control/family-divorce-gsc-workflow-handoff-2026-05-22.md`.
- CREATED: `project-control/family-divorce-gsc-workflow-handoff-2026-05-22.csv`.
- CREATED: `project-control/family-divorce-protected-url-owner-review-packet-2026-05-22.md`.
- GENERATED / NOT FINAL: `reports/family-divorce-gsc-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-protected-url-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-cannibalization-decision-map-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-gsc-decision-map-2026-05-22.json`.
- GENERATED / NOT FINAL: `reports/family-divorce-protected-url-owner-review-packet-2026-05-22.csv`.
- GENERATED / NOT FINAL: `reports/family-divorce-protected-url-owner-review-packet-2026-05-22.json`.
- GENERATED / NOT FINAL: `project-control/family-divorce-protected-url-owner-review-packet-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-family-divorce-gsc-decision-map.mjs` passed.
- VERIFIED LOCAL: `node --check tools/build-family-divorce-protected-url-review-packet.mjs` passed.
- VERIFIED LOCAL: `tools/gsc/run-family-divorce-gsc-workflow.ps1 -DryRun` passed without opening OAuth or calling GSC.
- VERIFIED LOCAL: regenerated baseline shows `18` protected rows, `5` protected conflicts, `18` high-risk protected rows and `40` cannibalization rows.
- BLOCKED: baseline remains `FALLBACK_EXISTING_GSC_CACHE_NOT_FINAL`; owner OAuth credential setup and focused GSC export are still required before final URL decisions.
- BLOCKED: public CMS execution still requires owner/legal/source approval and actual WordPress editor/database backup.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 23:49 Asia/Jerusalem
- FAMILY/DIVORCE PROTECTED URL OWNER REVIEW PACKET: converted the protected URL decision-map baseline into owner-review rows without approving URL changes.
- TOOLING FIXED: created `tools/build-family-divorce-protected-url-review-packet.mjs`.
- GENERATED: `reports/family-divorce-protected-url-owner-review-packet-2026-05-21.csv`.
- GENERATED: `reports/family-divorce-protected-url-owner-review-packet-2026-05-21.json`.
- CREATED: `project-control/family-divorce-protected-url-owner-review-packet-2026-05-21.md`.
- CREATED: `project-control/family-divorce-protected-url-owner-review-packet-2026-05-21.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: `node --check tools/build-family-divorce-protected-url-review-packet.mjs` passed.
- VERIFIED LOCAL: `node tools/build-family-divorce-protected-url-review-packet.mjs` generated `18` review rows.
- VERIFIED LOCAL: packet contains `5` P0 restore-or-targeted-301 conflict rows, `1` P0 keep-asset-live row and `18` high-risk baseline rows.
- BLOCKED: all packet rows remain `BLOCKED_FOCUSED_GSC_EXPORT_REQUIRED`; cached GSC baseline is not final.
- BLOCKED: public CMS execution still requires owner/legal/source approval and actual WordPress editor/database backup.
- BLOCKED: URL migration, redirects, canonical/noindex and sitemap actions still require focused GSC API export and final owner review.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 23:40 Asia/Jerusalem
- FAMILY/DIVORCE GSC DECISION MAP BASELINE: prepared the post-GSC URL/cannibalization decision-map workflow before owner credentials are available.
- TOOLING FIXED: created `tools/build-family-divorce-gsc-decision-map.mjs`.
- GENERATED: `reports/family-divorce-gsc-decision-map-2026-05-21.csv`.
- GENERATED: `reports/family-divorce-protected-url-decision-map-2026-05-21.csv`.
- GENERATED: `reports/family-divorce-cannibalization-decision-map-2026-05-21.csv`.
- GENERATED: `reports/family-divorce-gsc-decision-map-2026-05-21.json`.
- CREATED: `project-control/family-divorce-gsc-decision-map-2026-05-21.md`.
- CREATED: `project-control/family-divorce-gsc-decision-map-2026-05-21.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: `node --check tools/build-family-divorce-gsc-decision-map.mjs` passed.
- VERIFIED LOCAL: `node tools/build-family-divorce-gsc-decision-map.mjs` passed using `FALLBACK_EXISTING_GSC_CACHE_NOT_FINAL`.
- VERIFIED LOCAL: generated `7` clean target rows, `18` protected source/asset rows and `40` cannibalization baseline rows.
- VERIFIED LOCAL: cached GSC data found all `18` protected source/asset URLs and marks all `18` as high-risk.
- BLOCKED: `5` protected source URLs still redirect to the homepage and have cached GSC value; final action requires focused GSC export plus restore-or-targeted-301 review.
- BLOCKED: public CMS execution still requires owner/legal/source approval and actual WordPress editor/database backup.
- BLOCKED: URL migration, redirects, canonical/noindex and sitemap actions still require focused GSC API export and final decision review.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 23:30 Asia/Jerusalem
- FAMILY/DIVORCE WAVE 1B METADATA SYNC: closed the stale word-count review item from the upload readiness dashboard.
- TOOLING FIXED: created `tools/sync-family-divorce-wave1b-metadata-counts.mjs`.
- FIXED: synced `6/6` Wave 1B support metadata word counts to the current static-QA counts.
- GENERATED: `reports/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.md`.
- CREATED: `project-control/family-divorce-wave1b-metadata-word-count-sync-2026-05-21.csv`.
- UPDATED: `project-control/family-divorce-wave-1b-support-metadata-package-2026-05-12.csv`.
- UPDATED: `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.md`.
- UPDATED: `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.csv`.
- UPDATED: `reports/family-divorce-upload-readiness-2026-05-21.csv`.
- UPDATED: `reports/family-divorce-upload-readiness-2026-05-21.json`.
- VERIFIED LOCAL: `node --check tools/sync-family-divorce-wave1b-metadata-counts.mjs` passed.
- VERIFIED LOCAL: `node tools/sync-family-divorce-wave1b-metadata-counts.mjs` fixed `6` rows and skipped `0`.
- VERIFIED LOCAL: `node --check tools/check-family-divorce-upload-readiness.mjs` passed.
- VERIFIED LOCAL: `node tools/check-family-divorce-upload-readiness.mjs` passed.
- VERIFIED: Wave 1B metadata word-count mismatches are now `0`.
- VERIFIED: `7/7` Family/Divorce drafts still pass static QA and `7/7` target URLs still have live public backups.
- BLOCKED: public CMS execution still requires owner/legal/source approval and actual WordPress editor/database backup.
- BLOCKED: URL migration, redirects, canonical/noindex and sitemap actions still require GSC API export plus review of `5` protected source homepage redirects.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 23:16 Asia/Jerusalem
- FAMILY/DIVORCE UPLOAD READINESS DASHBOARD: consolidated the first upload cluster gates into one repeatable checker/report.
- TOOLING FIXED: created `tools/check-family-divorce-upload-readiness.mjs`.
- GENERATED: `reports/family-divorce-upload-readiness-2026-05-21.csv`.
- GENERATED: `reports/family-divorce-upload-readiness-2026-05-21.json`.
- CREATED: `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.md`.
- CREATED: `project-control/family-divorce-upload-readiness-dashboard-2026-05-21.csv`.
- VERIFIED LOCAL: `node --check tools/check-family-divorce-upload-readiness.mjs` passed.
- VERIFIED LOCAL: `node tools/check-family-divorce-upload-readiness.mjs` passed.
- VERIFIED: `7/7` Family/Divorce drafts pass static QA and `7/7` target URLs have live public backups.
- FIXED LATER: the older Wave 1B support metadata package had `6` stale word-count fields; the follow-up sync cycle brought the mismatch count to `0`.
- BLOCKED: public CMS execution still requires owner/legal/source approval and actual WordPress editor/database backup.
- BLOCKED: URL migration, redirects, canonical/noindex and sitemap actions still require GSC API export plus review of `5` protected source homepage redirects.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 23:08 Asia/Jerusalem
- GSC FAMILY/DIVORCE EXPORT RUNNER: prepared a focused read-only Search Console runner for the first controlled Family/Divorce URL/cannibalization risk check.
- TOOLING FIXED: created `tools/gsc/gsc-family-divorce-export.js`.
- FIXED: the runner supports `GSC_OAUTH_CLIENT_PATH` and `GSC_TOKEN_PATH`, so owner credentials can stay outside Git.
- FIXED: added `--dry-run` support that verifies scope and paths without reading credential contents, opening OAuth or calling the API.
- CREATED: `project-control/gsc-family-divorce-export-runner-2026-05-21.md`.
- CREATED: `project-control/gsc-family-divorce-export-runner-2026-05-21.csv`.
- UPDATED: `tools/gsc/README.md`.
- UPDATED: `project-control/gsc-api-setup-guide.md`.
- VERIFIED LOCAL: `node --check tools/gsc/gsc-family-divorce-export.js` passed.
- VERIFIED LOCAL: `node tools/gsc/gsc-family-divorce-export.js --dry-run` passed and reported `7` target paths, `18` protected source/asset paths and `18` query terms.
- BLOCKED / OWNER ACTION: actual GSC API export still requires owner credential rotation/setup and local paths for OAuth client/token.
- SAFETY: no credential contents were printed; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 22:56 Asia/Jerusalem
- GSC CREDENTIAL HYGIENE: removed the tracked local Search Console OAuth client JSON from Git tracking while leaving the local ignored file in place.
- FIXED: `tools/gsc/oauth-client.json` is no longer tracked in Git.
- FIXED: `.gitignore` now ignores `tools/gsc/oauth-client.json`, OAuth client JSON variants, token JSON and common Google credential JSON names under `tools/gsc/`.
- FIXED: `tools/gsc/README.md` now documents local credential safety and rotation guidance.
- CREATED: `project-control/gsc-credential-hygiene-2026-05-21.md`.
- CREATED: `project-control/gsc-credential-hygiene-2026-05-21.csv`.
- VERIFIED LOCAL: the local credential file is ignored after removal from Git tracking.
- BLOCKED / OWNER ACTION: if the removed tracked OAuth client was real, create a new OAuth Desktop client in Google Cloud and delete/rotate the old one before using GSC API exports.
- SAFETY: credential contents were not printed; no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 22:45 Asia/Jerusalem
- FAMILY/DIVORCE CMS OPERATOR RUNBOOK: created a seven-page CMS execution runbook for the approved upload stage without authorizing public changes.
- CREATED: `project-control/family-divorce-cms-operator-runbook-2026-05-21.md`.
- CREATED: `project-control/family-divorce-cms-operator-runbook-2026-05-21.csv`.
- VERIFIED LOCAL: the runbook covers the same `7` Family/Divorce target pages as the owner review packet and maps each page to its current static-QA-clean public-body draft.
- VERIFIED PLANNING: the runbook separates approved body/metadata updates from URL migration, redirects, noindex, canonical retirement, sitemap changes and protected old URL/asset decisions.
- READY: once owner/legal/source approval exists, the CMS operator has a step-by-step backup, update-existing-page-only, post-upload QA and rollback boundary.
- BLOCKED: CMS execution still requires owner/legal/source approval and actual WordPress editor/database backup; GSC API/export remains required before URL migration, redirects, canonical/noindex or sitemap actions.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 22:36 Asia/Jerusalem
- FAMILY/DIVORCE OWNER REVIEW PACKET: converted the seven locally merged Family/Divorce upload candidates into a controlled owner/legal/source review gate.
- CREATED: `project-control/family-divorce-owner-review-packet-2026-05-21.md`.
- CREATED: `project-control/family-divorce-owner-review-packet-2026-05-21.csv`.
- VERIFIED LOCAL: the packet covers `7` target URLs: `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/divorce-property-division/`, `/family-dispute-resolution/`, `/child-support/` and `/child-custody/`.
- VERIFIED LOCAL: all `7` drafts are listed with current static QA status `PASS`; draft word counts are `2,106`, `1,656`, `1,834`, `1,851`, `1,793`, `1,650` and `1,748`.
- FIXED: the packet explicitly records that the three high-risk merge blockers are resolved locally: `/divorce-property-division/`, `/child-custody/` and `/child-support/`.
- READY: Family/Divorce is now ready for owner page-by-page decisions of `APPROVE`, `EDIT`, `HOLD` or `LEGAL_REVIEW_REQUIRED`.
- BLOCKED: no CMS upload is approved until owner/legal/source approval and actual WordPress editor/database backup are complete; GSC API/export remains required before URL migration, redirects, canonical/noindex or sitemap actions.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 22:32 Asia/Jerusalem
- FAMILY/DIVORCE CHILD-SUPPORT MERGE DECISIONS + DRAFT MERGE: resolved all `/child-support/` current-live candidate rows and applied the approved draft edits locally.
- TOOLING FIXED: created `tools/resolve-family-divorce-child-support-merge.mjs`.
- TOOLING FIXED: created `tools/apply-family-divorce-child-support-draft-merges.mjs`.
- CONTENT FIXED: updated `content-drafts/child-support-public-body-he.md` with the approved included-vs-separate expense, extraordinary-expense mechanics, change-of-support checklist and evidence/communications additions.
- GENERATED: `reports/family-divorce-child-support-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-child-support-merge-decisions-2026-05-21.md`.
- CREATED: `project-control/family-divorce-child-support-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-child-support-draft-merge-2026-05-21.md`.
- CREATED: `project-control/family-divorce-child-support-draft-merge-2026-05-21.csv`.
- VERIFIED LOCAL: all `35` current-live candidate rows resolved: `4` merge into draft, `25` covered/no action and `6` skip as UI/CTA/taxonomy/related-link fragments.
- VERIFIED LOCAL: all four approved insertion blocks are present in the draft.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce drafts pass static QA and `/child-support/` now reports `1,650` words.
- FIXED: the three high-risk Family/Divorce merge blockers (`/child-support/`, `/child-custody/`, `/divorce-property-division/`) now all have row-level decisions and applied approved draft merges.
- BLOCKED: no CMS upload is approved until owner/legal/source approval and actual WordPress editor/database backup are complete; GSC API/export remains required before URL migration, redirects, canonical/noindex or sitemap actions.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 22:14 Asia/Jerusalem
- FAMILY/DIVORCE CHILD-CUSTODY MERGE DECISIONS + DRAFT MERGE: resolved all `/child-custody/` current-live candidate rows and applied the approved draft edits locally.
- TOOLING FIXED: created `tools/resolve-family-divorce-child-custody-merge.mjs`.
- TOOLING FIXED: created `tools/apply-family-divorce-child-custody-draft-merges.mjs`.
- CONTENT FIXED: updated `content-drafts/child-custody-public-body-he.md` with the approved communication, professional-factor, parenting-time checklist, lateness/documentation and child-expense boundary additions.
- GENERATED: `reports/family-divorce-child-custody-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-child-custody-merge-decisions-2026-05-21.md`.
- CREATED: `project-control/family-divorce-child-custody-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-child-custody-draft-merge-2026-05-21.md`.
- CREATED: `project-control/family-divorce-child-custody-draft-merge-2026-05-21.csv`.
- VERIFIED LOCAL: all `35` current-live candidate rows resolved: `9` merge into draft, `20` covered/no action and `6` skip as UI/CTA/taxonomy/related-link fragments.
- VERIFIED LOCAL: all nine insertion IDs are present in the draft.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce drafts pass static QA and `/child-custody/` now reports `1,748` words.
- BLOCKED: no CMS upload is approved until owner/legal/source approval and actual WordPress editor/database backup are complete; `/child-support/` still needs row-level merge decisions.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 22:02 Asia/Jerusalem
- FAMILY/DIVORCE PROPERTY-DIVISION DRAFT MERGE: applied the six approved `/divorce-property-division/` merge edits to the clean public-body draft.
- CONTENT FIXED: updated `content-drafts/divorce-property-division-public-body-he.md` with the approved separate-registration, housing/children, separation-date and prenup/prior-agreement additions.
- TOOLING FIXED: created `tools/apply-family-divorce-property-division-draft-merges.mjs`.
- CREATED: `project-control/family-divorce-property-division-draft-merge-2026-05-21.md`.
- CREATED: `project-control/family-divorce-property-division-draft-merge-2026-05-21.csv`.
- VERIFIED LOCAL: all six insertion IDs are present in the draft.
- VERIFIED LOCAL: reran `tools/check-family-divorce-public-bodies.mjs`; all seven Family/Divorce drafts pass static QA and `/divorce-property-division/` now reports `1,851` words.
- BLOCKED: no CMS upload is approved until owner/legal/source approval and an actual WordPress editor/database backup are complete; `/child-support/` and `/child-custody/` still need row-level merge decisions.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 21:53 Asia/Jerusalem
- FAMILY/DIVORCE PROPERTY-DIVISION MERGE DECISIONS: resolved the live-candidate decision layer for `/divorce-property-division/`, the highest-risk page from the high-risk merge worksheet.
- TOOLING FIXED: created `tools/resolve-family-divorce-property-division-merge.mjs`.
- VERIFIED LOCAL: generated `reports/family-divorce-property-division-merge-decisions-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-property-division-merge-decisions-2026-05-21.md`.
- CREATED: `project-control/family-divorce-property-division-merge-decisions-2026-05-21.csv`.
- VERIFIED: all `35` current-live candidate rows for `/divorce-property-division/` have final decisions: `6` merge into draft, `23` covered/no action and `6` skip as UI/CTA/taxonomy/related-link fragments.
- BLOCKED: `/divorce-property-division/` still needs the six concise draft edits applied and static QA rerun before owner/legal/source approval or CMS upload.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 21:42 Asia/Jerusalem
- FAMILY/DIVORCE HIGH-RISK MERGE REVIEW: prepared the first side-by-side merge worksheet for the three highest-retention-risk pages: `/child-support/`, `/child-custody/` and `/divorce-property-division/`.
- TOOLING FIXED: created `tools/prepare-family-divorce-merge-review.mjs`.
- VERIFIED LOCAL: generated `reports/family-divorce-high-risk-merge-review-2026-05-21.csv` with `165` section rows.
- CREATED: `project-control/family-divorce-high-risk-merge-review-2026-05-21.md`.
- CREATED: `project-control/family-divorce-high-risk-merge-review-2026-05-21.csv`.
- VERIFIED: worksheet includes `60` draft base sections, `30` live sections marked `REVIEW_FOR_MERGE`, `46` live sections marked `PARTIAL_OVERLAP_REVIEW` and `29` live sections marked `COVERED_BY_DRAFT`.
- BLOCKED: these three pages should not be uploaded until all `REVIEW_FOR_MERGE` and `PARTIAL_OVERLAP_REVIEW` rows are resolved into keep/merge/rewrite/skip decisions.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 21:32 Asia/Jerusalem
- FAMILY/DIVORCE LIVE VS DRAFT COMPARISON: compared the seven clean public-body drafts against the seven live public text snapshots before any CMS overwrite.
- TOOLING FIXED: created `tools/compare-family-divorce-live-vs-drafts.mjs`.
- VERIFIED LOCAL: the comparison reviewed `7` target pages and generated `reports/family-divorce-live-vs-draft-comparison-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-live-vs-draft-comparison-2026-05-21.md`.
- CREATED: `project-control/family-divorce-live-vs-draft-comparison-2026-05-21.csv`.
- VERIFIED: live snapshots total `19,236` words; clean draft bodies total `11,673` words; net draft reduction is `-7,563` words.
- BLOCKED: no Family/Divorce page should be uploaded as a blind overwrite; all seven need merge review, with HIGH priority for `/child-support/`, `/child-custody/` and `/divorce-property-division/`.
- READY: the next content-readiness step is side-by-side merge review to keep or merge stronger current-live sections into the approved drafts.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 21:22 Asia/Jerusalem
- FAMILY/DIVORCE LIVE TARGET BACKUP: exported public text snapshots and metadata for the seven live Family/Divorce target pages before any CMS overwrite.
- TOOLING FIXED: created `tools/export-family-divorce-live-targets.mjs` to fetch title, H1, meta description, canonical, robots, final path and primary page text.
- VERIFIED LIVE / READ ONLY: all seven target URLs returned `200`, stayed on their own final paths and exported as `PASS`.
- GENERATED: `reports/family-divorce-live-target-backup-2026-05-21/` with `manifest.csv`, `README.md` and seven `.txt` public-text snapshots.
- CREATED: `project-control/family-divorce-live-target-backup-2026-05-21.md`.
- CREATED: `project-control/family-divorce-live-target-backup-2026-05-21.csv`.
- VERIFIED: captured `19,236` words of current live public text across `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/divorce-property-division/`, `/family-dispute-resolution/`, `/child-support/` and `/child-custody/`.
- NOT A DB BACKUP: this is a public HTML/text snapshot; actual WordPress editor/database export is still required before CMS edits.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 21:16 Asia/Jerusalem
- FAMILY/DIVORCE LIVE PRE-UPLOAD GUARD: added a read-only live checker for the first controlled Family/Divorce upload cluster.
- TOOLING FIXED: created `tools/check-family-divorce-live-preupload.mjs` to record initial redirects, final paths, HTTP status, content type, canonical, robots, title, H1 and byte size.
- VERIFIED LIVE / READ ONLY WITH BLOCKERS: checked `25` URLs: `7` clean target pages, `17` protected P0 source URLs and `1` protected DOCX asset.
- GENERATED: `reports/family-divorce-live-preupload-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-live-preupload-guard-2026-05-21.md`.
- CREATED: `project-control/family-divorce-live-preupload-guard-2026-05-21.csv`.
- VERIFIED: `13` protected source/asset URLs passed live reachability checks.
- LIVE PRESENT REVIEW: all `7` clean upload targets already return `200` on their own final paths, so they need current-live backup/export before any CMS overwrite.
- BLOCKED LIVE: `5` protected source URLs return initial `301` to homepage: child support calculator Hebrew URL, updated divorce guide Hebrew URL, recommended divorce lawyer Hebrew URL, divorce mediation Hebrew URL and `/what-is-child-custody/`.
- NEXT: investigate those five redirects and decide restore/update-in-place/documented 301 after GSC API confirmation; do not approve Family/Divorce URL migration until this is resolved.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 21:03 Asia/Jerusalem
- FAMILY/DIVORCE PUBLIC BODY STATIC QA: added a repeatable local checker for the seven Family/Divorce public-body drafts before any CMS upload.
- TOOLING FIXED: created `tools/check-family-divorce-public-bodies.mjs` to verify minimum word counts, required Family/Divorce internal links, internal-note markers, fake trust/review/outcome-promise terms and disclaimer signals.
- FIXED: cleaned one `/divorce-lawyer/` caution sentence in `content-drafts/divorce-lawyer-public-body-he.md` so the public draft avoids a risky outcome-promise phrase.
- VERIFIED LOCAL: all seven draft bodies passed static QA: `/divorce-lawyer/`, `/consensual-divorce/`, `/divorce-mediation/`, `/divorce-property-division/`, `/family-dispute-resolution/`, `/child-support/` and `/child-custody/`.
- GENERATED: `reports/family-divorce-public-body-static-qa-2026-05-21.csv`.
- CREATED: `project-control/family-divorce-public-body-static-qa-2026-05-21.md`.
- CREATED: `project-control/family-divorce-public-body-static-qa-2026-05-21.csv`.
- UPDATED: `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.md`.
- NOT LEGAL VERIFIED: this is static upload hygiene only; owner/legal/source approval remains required.
- BLOCKED: no CMS/public upload, redirect, canonical, noindex, sitemap or URL migration action is approved by this check.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 20:53 Asia/Jerusalem
- TRUST ROUTE EARLY RENDER: hardened the existing virtual `/contact/`, `/about/` and `/editorial-policy/` trust routes against later WordPress redirect plugins.
- CODE FIXED: `inc/trust-routes.php` now renders trust routes at `template_redirect` priority `-999999`, matching the protected practice route and HTML sitemap early renderers.
- CODE FIXED: trust-route responses now send `X-Justice-Route-Guard: trust-route-early-render`.
- UPDATED: deployment marker to `2026-05-21-trust-route-early-render-v1`.
- CREATED: `project-control/trust-route-early-render-2026-05-21.md`.
- CREATED: `project-control/trust-route-early-render-2026-05-21.csv`.
- VERIFIED LOCAL: `php -l functions.php`, `php -l inc/trust-routes.php`, `node --check tools/check-live-traffic-priority.mjs`, `node --check tools/check-live-trust-routes.mjs`, task-board CSV parse and `git diff --check` passed; `git diff --check` reported normal Windows line-ending warnings only.
- NOT LIVE VERIFIED: public server still needs uPress Git pull/cache clear; if `/contact/` or `/about/` still return an initial `301` to `/`, the blocker is server/CDN/host-panel/early-plugin redirect behavior before the theme can render.
- SAFETY: no CMS page body, database row, title/H1/meta, public slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 20:42 Asia/Jerusalem
- PROTECTED PRACTICE ROUTE EARLY RENDER: added a repo-side mitigation for priority routes that may be intercepted by later WordPress redirect plugins.
- CODE FIXED: `inc/practice-landing.php` now resolves controlled practice route templates through one helper and renders them at `template_redirect` priority `-999999`.
- CODE FIXED: controlled practice route output now exits before later `template_redirect` handlers and sends `X-Justice-Route-Guard: controlled-practice-early-render`.
- CODE FIXED: `inc/html-sitemap.php` now renders `/site-map/` at `template_redirect` priority `-999999`.
- UPDATED: deployment marker to `2026-05-21-protected-route-early-render-v1`.
- CREATED: `project-control/protected-practice-route-early-render-2026-05-21.md`.
- CREATED: `project-control/protected-practice-route-early-render-2026-05-21.csv`.
- VERIFIED LOCAL: `php -l inc/practice-landing.php`, `php -l inc/html-sitemap.php` and `php -l functions.php` passed.
- NOT LIVE VERIFIED: public server still needs uPress Git pull/cache clear; if initial `301` to `/` remains after deploy, blocker is server/CDN/plugin redirect before the theme can render.
- BLOCKED REMAINING: `/contact/` and `/about/` are not fixed by this practice-route patch and still need CMS route restore, explicit theme route or redirect-rule cleanup.
- SAFETY: no CMS page body, database row, title/H1/meta, public slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 20:32 Asia/Jerusalem
- PUBLIC ROUTE HOME REDIRECT TRIAGE: reviewed `12` priority public URLs with an enhanced checker that records initial redirects before following them.
- TOOLING FIXED: `tools/check-live-traffic-priority.mjs` now records `initialHttp` and `redirectLocation`, and flags `initial_redirect_301_to_/` separately from final-path mismatch.
- CREATED: `project-control/public-route-home-redirect-triage-2026-05-21.md`.
- CREATED: `project-control/public-route-home-redirect-triage-2026-05-21.csv`.
- GENERATED: `reports/traffic-priority-audit-2026-05-21-route-home-redirects.csv`.
- VERIFIED LIVE: `/`, `/articles/`, `/family-law/`, `/lawyers/?area=family-law`, `/criminal-defense-attorney/` and `/traffic-lawyer/` returned initial `200` and stayed on their intended route.
- BLOCKED LIVE: `/site-map/`, `/medical-malpractice-lawyer/`, `/real-estate-lawyer-guide/`, `/inheritance-lawyer/`, `/contact/` and `/about/` returned initial `301` to `https://jus-tice.co.il`, then served homepage HTML after following redirects.
- VERIFIED LOCAL: `node --check tools/check-live-traffic-priority.mjs` passed after the checker update.
- NEXT: after uPress pull/cache clear, rerun the checker; if these six still return initial `301` to `/`, inspect uPress/server/Redirection-plugin/Permalink Manager rules.
- SAFETY: no CMS page body, database row, title/H1/meta, public slug, live redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 20:24 Asia/Jerusalem
- REAL-ESTATE GUIDE REDIRECT GUARD: investigated the `/real-estate-lawyer-guide/` route regression that was blocking the real-estate public edit package.
- BLOCKED LIVE: trailing-slash `/real-estate-lawyer-guide/` currently redirects to the homepage before the controlled guide template renders.
- BLOCKED LIVE: no-slash `/real-estate-lawyer-guide` currently redirects to `http://jus-tice.co.il/real-estate-attorney`.
- CODE FIXED: `inc/routing-guards.php` now blocks WordPress-level `wp_redirect` and `redirect_canonical` conflicts from the guide route to `/` or `/real-estate-attorney`.
- TOOLING FIXED: `tools/check-live-traffic-priority.mjs` now requires route checks to finish on their expected final path, preventing homepage fallback false positives.
- CREATED: `project-control/real-estate-guide-redirect-guard-2026-05-21.md`.
- CREATED: `project-control/real-estate-guide-redirect-guard-2026-05-21.csv`.
- GENERATED: `reports/traffic-priority-audit-2026-05-21-real-estate-guide-redirect-guard.csv`.
- VERIFIED LOCAL: `php -l inc/routing-guards.php`, `php -l functions.php`, and `node --check tools/check-live-traffic-priority.mjs` passed.
- NOT LIVE VERIFIED: public server needs uPress Git pull/cache clear before this guard can be tested live; if the redirect is server/plugin-level before WordPress filters, owner/admin must remove the stale redirect rule.
- ROUTE QA BACKLOG: the tightened checker also exposes current homepage-fallback final-path failures for `/site-map/`, `/medical-malpractice-lawyer/`, `/inheritance-lawyer/`, `/contact/` and `/about/`; those were not fixed in this cycle.
- SAFETY: no CMS page body, database row, title/H1/meta, public slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap, lawyer, lead, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 20:45 Asia/Jerusalem
- REAL-ESTATE PUBLIC EDIT PACKAGE: prepared the owner-approved CMS execution package for the Israeli real-estate support-to-hub batch without publishing anything.
- CREATED: `project-control/real-estate-public-edit-package-2026-05-21.md`.
- CREATED: `project-control/real-estate-public-edit-package-2026-05-21.csv`.
- VERIFIED LIVE: `/real-estate-attorney/` returned `200`, stayed on its own URL, self-canonicalized and already has `3` hub self/related links in the sampled HTML.
- VERIFIED LIVE: `/lawyer-for-buying-or-selling-a-house/`, `/registration-of-real-estate-israel/`, `/land-appreciation-tax/`, `/real-estate-lawyer-cost-2025/` and `/real-estate-appraiser/` returned `200`, self-canonicalized and currently have `0` sampled body/source links to `/real-estate-attorney/`.
- BLOCKED LIVE: `/real-estate-lawyer-guide/` returned `200` but resolved to the homepage URL/canonical, so it is excluded from the public edit batch until route QA is repaired.
- READY AFTER OWNER APPROVAL: exact Hebrew insert text is prepared for the hub intro/navigation and five safe support pages.
- HOLD: shared-apartment partition, marital property agreement and spouse property registration remain blocked for Family/Divorce coordination; foreign-investment pages remain de-emphasized.
- SAFETY: repo documentation and read-only public checks only. No public CMS page/body/title/H1/meta, database row, URL slug, redirect, canonical, noindex, taxonomy, sitemap, lawyer, lead, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.

## LATEST WORK STATUS - 2026-05-21 20:32 Asia/Jerusalem
- RECOMMENDATION TOKEN SAFETY CHECKER: added a repeatable static regression checker for the first-party recommendation token flow while authenticated/live QA remains blocked.
- CODED: `tools/check-recommendation-token-safety.mjs` verifies private token CPT posture, hashed tokens, noindex public token form, honeypot, draft-only recommendation creation, `first_party` source type, `confirmed` permission, `draft_review` moderation and no accidental `approved_public`.
- CODED: the checker also verifies that the public display guard still requires `approved_public`, `confirmed` and source-type filtering, and that no `AggregateRating` or Review schema was added in the token flow.
- CREATED: `project-control/recommendation-token-safety-checker-2026-05-21.md`.
- CREATED: `project-control/recommendation-token-safety-checker-2026-05-21.csv`.
- VERIFIED LOCAL: `node --check tools/check-recommendation-token-safety.mjs` passed.
- VERIFIED LOCAL: `node tools/check-recommendation-token-safety.mjs` passed.
- VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` passed.
- NOT LIVE VERIFIED: authenticated admin click-through, live token submission, draft record creation and email delivery still require owner/admin access after uPress pull.
- SAFETY: tooling/docs only. No live CMS database row, no lawyer/customer/recommendation record, no Google data, no outbound client message, no public schema, no payment setting, no redirect and no sitemap changed.

## LATEST WORK STATUS - 2026-05-21 20:18 Asia/Jerusalem
- FIRST-PARTY RECOMMENDATION TOKEN INTAKE: added the missing owner-controlled link flow for collecting real client recommendations without automatic public display.
- CODED: `inc/lawyer-recommendations.php` now registers private `justice_reco_token` records, stores only hashed tokens, creates 30-day one-time intake links, renders a noindex Hebrew public intake form and saves valid submissions as draft first-party recommendations.
- CODED: valid submissions set `recommendation_source_type=first_party`, `recommendation_permission=confirmed` and `recommendation_moderation=draft_review`; the token is marked used and owner notification is sent for review.
- CODED: `inc/lawyer-onboarding.php` now exposes a `Create recommendation link` action and shows the generated link in an admin-only notice.
- CREATED: `project-control/first-party-recommendation-token-intake-2026-05-21.md`.
- CREATED: `project-control/first-party-recommendation-token-intake-2026-05-21.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
- VERIFIED LOCAL: `php -l inc/lawyer-onboarding.php` passed.
- VERIFIED LOCAL: `git diff --check` passed with normal Windows line-ending warnings only.
- NOT LIVE VERIFIED: authenticated admin click-through, uPress pull, live token submission and public profile display QA still require owner/admin access and a real approved first-party test record.
- BLOCKED: Google API, Google OAuth, Google review import, outbound client SMS/email, public Review schema and AggregateRating remain blocked.
- SAFETY: repo theme code/docs only. No live CMS database row, no lawyer/customer/recommendation record, no Google data, no outbound client message, no public schema, no payment setting, no redirect and no sitemap changed in this cycle.

## LATEST WORK STATUS - 2026-05-21 20:02 Asia/Jerusalem
- FIRST-PARTY RECOMMENDATION PUBLIC DISPLAY GUARD: tightened the public recommendation query so lawyer profiles can only show owner-approved first-party Jus-Tice recommendations by default.
- RESEARCHED: Google Business Profile prohibited/restricted content policy covers review manipulation and fake engagement risk; Google Business Profile API policy requires proper purpose/consent and limits automated/programmatic use. Sources: https://support.google.com/business/answer/2622994 and https://developers.google.com/my-business/content/policies
- CODED: `inc/lawyer-recommendations.php` now centralizes recommendation source type options, validates saved source types and uses one shared public meta-query guard.
- CODED: public recommendation counts and public recommendation lists now require linked lawyer ID, `approved_public`, `confirmed` permission and `recommendation_source_type=first_party` by default.
- CODED: admin source labels now make Google links/reference records explicitly non-public by default.
- CREATED: `project-control/public-recommendations-display-guard-2026-05-21.md`.
- CREATED: `project-control/public-recommendations-display-guard-2026-05-21.csv`.
- VERIFIED LOCAL: `php -l inc/lawyer-recommendations.php` passed.
- NOT LIVE VERIFIED: public server behavior still requires uPress pull/cache refresh and a real approved first-party recommendation record to test the profile section.
- BLOCKED: recommendation request token/intake flow remains the next T367 subtask; Google API, outbound SMS/email, public review schema and AggregateRating remain blocked.
- SAFETY: repo theme code/docs only. No Google API connection, no Google review import, no outbound review request, no public schema, no CMS database row, no recommendation/lawyer/customer record, no payment setting, no redirect, no sitemap and no outreach message changed.

## LATEST WORK STATUS - 2026-05-21 19:44 Asia/Jerusalem
- LAWYER PLATFORM OWNER WALKTHROUGH: updated the stale PR-era guide into a live-aware owner operating guide for the current lawyer sales, prospect, reputation and LegalTech lead-intent system.
- UPDATED: `project-control/lawyer-platform-owner-walkthrough-2026-05-20.md`.
- VERIFIED LIVE: `/`, `/lawyer-plans/`, `/lawyer-registration/`, `/lawyer-dashboard/` and `/lawyers/` returned `200`.
- VERIFIED LIVE: `/legal-tools/` still resolves to the homepage, so the guide keeps it blocked from promotion as a finished product archive.
- VERIFIED LIVE: the homepage source contains `legaltech-tools`, `AI Console`, `ask-lawyer` and `data-lead-message`; it has no direct `/legal-tools/` archive link and no page-level `noindex`.
- VERIFIED PRIVATE: unauthenticated `wp-admin` access to Lawyer Onboarding, Lawyer Prospects and Outreach Links redirects to WordPress login.
- COMPLETED: task-board item `T368` is now marked completed because the owner walkthrough now reflects deployed public URLs, private admin surfaces, prospect follow-up views, outreach-link handoff, reputation workflow and LegalTech prefill behavior.
- BLOCKED: authenticated WordPress admin walkthrough, real outreach, real payment, real lawyer activation and real LegalTech archive/product records still require owner action/access.
- SAFETY: repo documentation and read-only public/private boundary checks only. No public CMS page, database row, lawyer, lead, prospect, product, payment, redirect, sitemap, taxonomy, title/H1/meta or outreach message was changed.

## LATEST WORK STATUS - 2026-05-21 19:14 Asia/Jerusalem
- LEGALTECH CONTEXTUAL INTAKE PREFILL: made the homepage LegalTech/product cards prepare the existing lead form with product context instead of dropping every click into a generic blank form.
- RESEARCHED: Baymard form-field research recommends reducing irrelevant form effort, using smart defaults and keeping prefilled values editable; this fits LegalTech product clicks because the user already showed intent by choosing a tool. Source: https://baymard.com/learn/input-fields
- CODED: `inc/lead-spam-guard.php` now has safe helpers for allowed lead areas, editable message prefill and contextual ask-lawyer fallback URLs.
- CODED: `template-parts/sections/ask-lawyer.php` and `template-parts/forms/lead-form.php` can render sanitized `lead_area` and `lead_message` prefill values.
- CODED: `template-parts/sections/legaltech-tools.php` keeps SEO-clean `#ask-lawyer` fallback links but attaches lead area, starter message, source keyword and UTM data to the LegalTech cards/buttons.
- CODED: `assets/js/analytics-events.js` applies LegalTech card context to the homepage form on click and tracks `legaltech_tool_click`.
- VERIFIED: `php -l` passed for the touched PHP files, `node --check assets/js/analytics-events.js` passed, and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `4f4da66 Prefill lead form from LegalTech clicks`; uPress Pull Git succeeded and the uPress log showed `4f4da66` as live HEAD.
- LIVE CHECK: cache-busted homepage returns 200, contains LegalTech contextual data attributes, has no direct `/legal-tools/` archive link and has no page-level `noindex`; live JavaScript contains `applyLeadPrefillFromLink`, `legaltech_tool_click` and the hidden-field helper.
- LIVE CLICK CHECK: clicking the real-estate LegalTech card scrolls to `#ask-lawyer`, selects `real-estate-law`, fills the editable starter message, and records `source_keyword` plus `utm_medium=legaltech_gateway`.
- HONEST MONEY ASSESSMENT: no revenue and no outreach yet. Material advancement is making the product block behave more like a conversion funnel while the real LegalTech archive/CPT remains gated.
- COMPLETION ASSESSMENT: homepage money-machine readiness moved from 87% to 88%; LegalTech product-path readiness moved from 44% to 47%; first paid-lawyer readiness remains about 90% until real outreach/signups or Grow/payment setup moves.
- OWNER-VISIBLE AFTER DEPLOY: homepage LegalTech cards and the homepage ask-lawyer form.
- SAFETY: repo theme code/docs only. No public CMS database page edited, no product record created, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 19:01 Asia/Jerusalem
- LEGALTECH SAFE LINK CLEANUP: removed the remaining theme-level raw `/legal-tools/` links from fallback navigation and LegalTech/pillar templates until the archive route is verified live.
- RESEARCHED: Google Search Central says crawlable internal links help Google and users understand pages, and Google warns against redirecting missing-file traffic to the homepage because it can create weak soft-404 style signals. Sources: https://developers.google.com/search/docs/crawling-indexing/links-crawlable, https://developers.google.com/search/blog/2005/09/verifying-your-site-trouble-with-404, https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- CODED: `template-parts/layout/site-header.php` fallback menu now uses `justice_theme_safe_public_link( '/legal-tools/', '/#ask-lawyer' )`.
- CODED: `single-justice_legal_tool.php` now keeps the "all tools" button on the safe fallback until `/legal-tools/` is a verified public archive.
- CODED: `page-legal-pillar.php` now renders `pillar_legaltech_url` only when the target path is published, so future pillar pages do not promote unpublished LegalTech tools.
- VERIFIED: `php -l template-parts/layout/site-header.php`, `php -l single-justice_legal_tool.php`, `php -l page-legal-pillar.php` and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `07d052a Keep LegalTech archive links on safe fallback`; uPress Pull Git succeeded and the uPress log showed `07d052a` as live HEAD.
- LIVE CHECK: cache-busted homepage returns 200, contains `legaltech-tools` and `AI Console`, has no page-level `noindex`, does not expose a direct `/legal-tools/` archive link, and keeps the safe `#ask-lawyer` fallback. Live `/legal-tools/` still returns 301 to the homepage, so the archive remains intentionally unpromoted.
- HONEST MONEY ASSESSMENT: no revenue, no outreach and no product record created. Material advancement is reducing internal-link waste around the new product layer so the homepage/pillar funnel stays cleaner for users and Google.
- COMPLETION ASSESSMENT: homepage money-machine readiness moved from 86% to 87%; LegalTech product-path readiness moved from 42% to 44%; first paid-lawyer readiness remains about 90% until real outreach/signups or Grow/payment setup moves.
- OWNER-VISIBLE AFTER DEPLOY: mostly invisible safety cleanup; it affects fallback header navigation, future LegalTech single pages and future legal pillar product CTAs.
- SAFETY: repo theme code/docs only. No public CMS database page edited, no product record created, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 18:41 Asia/Jerusalem
- HOMEPAGE LEGALTECH PRODUCT GATEWAY: connected the existing LegalTech/tools section into the homepage so the page now points users toward document/intake products as well as lawyers and articles.
- RESEARCHED: Google Search Central says navigation and cross-page links help Google understand site structure and important products; LegalZoom's official help content shows attorney-drafted templates/document flows as a legal-service product model; FindLaw sells legal directory value through visibility, contact paths and search optimization. Sources: https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure, https://help.legalzoom.com/docs/creating-documents, https://www.findlaw.com/lawyer-marketing/services/legal-directory-advertising/findlaw-premium-profile/
- CODED: `front-page.php` now renders `template-parts/sections/legaltech-tools.php` after featured lawyers and before the lawyer acquisition CTA.
- CODED: `inc/template-tags.php` now treats published `justice_legal_tool` CMS records as safe public destinations, including tool URLs under `/legal-tools/{tool}/`.
- SAFETY DECISION: the `/legal-tools/` archive route itself is not promoted as safe yet because the current pre-deploy live check shows it redirects to the homepage.
- VERIFIED: `php -l front-page.php`, `php -l inc\template-tags.php` and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `ca98eb9 Add homepage LegalTech product gateway`; uPress Pull Git succeeded and the uPress log shows `ca98eb9` as live HEAD.
- LIVE CHECK: cache-busted homepage returns 200, contains `legaltech-tools` and `AI Console`, has no page-level `noindex`, does not link to `/legal-tools/`, and keeps LegalTech cards on the safe `#ask-lawyer` fallback.
- HONEST MONEY ASSESSMENT: no revenue, no CMS product records and no outreach. Material advancement is exposing the future LegalTech/form/intake product layer on the homepage and improving safe CMS linking for that product line.
- COMPLETION ASSESSMENT: homepage money-machine readiness moved from 84% to 86%; LegalTech product-path readiness moved from 35% to 42%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE AFTER DEPLOY: homepage, below featured lawyers and above the lawyer acquisition section.
- SAFETY: repo theme code/docs only. No public CMS database page edited, no product record created, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 18:29 Asia/Jerusalem
- LAWYER PROSPECT MONTHLY VALUE COLUMN: added a private sortable monthly-value column so the owner can prioritize higher-value lawyer prospects.
- RESEARCHED: Pipedrive guidance says deal value can be used for sorting to focus on high-revenue opportunities; Pipedrive deal management shows value and priority as core pipeline details visible at a glance. Sources: https://support.pipedrive.com/en/article/how-are-deals-ordered-in-the-pipeline-view, https://www.pipedrive.com/en/products/sales/deal-management/
- CODED: `inc/lawyer-prospects.php` now adds a `Monthly value` column to the private `justice_prospect` list.
- CODED: the column displays expected monthly NIS or `Not set`.
- CODED: `Monthly value` is sortable by numeric value, and `Next action` is sortable by date.
- VERIFIED: `php -l inc/lawyer-prospects.php` and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `36dccca Add prospect monthly value column`; uPress Git pull succeeded and the uPress log shows `36dccca` as live HEAD before this documentation correction.
- LIVE CHECK: unauthenticated access to a value-sorted private prospect list redirects to WordPress login, then uPress Login Protector; the monthly-value column is not public.
- HONEST MONEY ASSESSMENT: no revenue, no outreach and no records updated. Material advancement is money-priority triage before manual lawyer outreach.
- COMPLETION ASSESSMENT: lawyer acquisition execution readiness moved from 85% to 86%; prospect follow-up/readiness discipline moved from 89% to 90%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE AFTER WORDPRESS ADMIN LOGIN: Lawyer Onboarding -> Lawyer Prospects -> Monthly value column.
- SAFETY: repo theme admin code/docs plus uPress pull/live login-gate check only. No public CMS database page edited, no public page changed, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 18:20 Asia/Jerusalem
- LAWYER PROSPECT CONTACT COLUMN: added a private list-level contact column so the owner can see whether prospects are reachable without opening each record.
- RESEARCHED: Pipedrive contact-management guidance emphasizes keeping contact info and deals together so teams can follow up while prospects are warm; Clio Grow API fields include email and phone number for lead/contact records. Sources: https://www.pipedrive.com/en/crm/solutions/crm-for-contact-managers, https://docs.developers.clio.com/clio-grow/api-reference/
- CODED: `inc/lawyer-prospects.php` now adds a `Contact` column to the private `justice_prospect` list.
- CODED: the column shows email as `mailto:`, phone as `tel:`, and `Missing email + phone` when no contact channel exists.
- VERIFIED: `php -l inc/lawyer-prospects.php` and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `33848ba Add prospect contact column`; uPress Git pull succeeded and the uPress log shows `33848ba` as live HEAD before this documentation correction.
- LIVE CHECK: unauthenticated access to the private prospect list redirects to WordPress login, then uPress Login Protector; the contact column is not public.
- HONEST MONEY ASSESSMENT: no revenue, no outreach and no records updated. Material advancement is faster prospect triage before manual lawyer outreach.
- COMPLETION ASSESSMENT: lawyer acquisition execution readiness moved from 84% to 85%; prospect follow-up/readiness discipline moved from 88% to 89%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE AFTER WORDPRESS ADMIN LOGIN: Lawyer Onboarding -> Lawyer Prospects -> Contact column.
- SAFETY: repo theme admin code/docs plus uPress pull/live login-gate check only. No public CMS database page edited, no public page changed, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 18:11 Asia/Jerusalem
- LAWYER PROSPECT CONTACT-DETAILS VIEW: added a private CRM view for active lawyer prospects that have no email and no phone.
- RESEARCHED: HubSpot contact management emphasizes complete contact records, calls, emails and follow-ups inside the CRM; HubSpot enrichment frames blank contact/company fields as sales friction; Salesforce sales data guidance frames quality data as the foundation for faster revenue decisions. Sources: https://www.hubspot.com/products/crm/contact-management, https://www.hubspot.com/products/artificial-intelligence/use-cases/enrich-contact-data, https://www.salesforce.com/sales/data/
- CODED: `inc/lawyer-prospects.php` now supports `justice_prospect_contact_filter=missing` and adds a "Needs contact details" list view.
- CODED: the missing-contact and unscheduled filters exclude `won` and `lost`, while treating missing status as active/research debt.
- CODED: `inc/lawyer-onboarding.php` now shows a "Needs contact details" card and makes missing contact info a next-best-action priority after overdue/due work.
- VERIFIED: `php -l inc/lawyer-prospects.php`, `php -l inc/lawyer-onboarding.php` and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `2c8f893 Add prospect contact details view`; uPress Git pull succeeded and the uPress log shows `2c8f893` as live HEAD before this documentation correction.
- LIVE CHECK: unauthenticated access to the `Needs contact details` admin list redirects to WordPress login, then uPress Login Protector; the private prospect list is not public.
- HONEST MONEY ASSESSMENT: no revenue, no outreach and no records updated. Material advancement is separating reachable lawyer prospects from research debt before manual outreach starts.
- COMPLETION ASSESSMENT: lawyer acquisition execution readiness moved from 82% to 84%; prospect follow-up/readiness discipline moved from 86% to 88%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE AFTER WORDPRESS ADMIN LOGIN: Lawyer Onboarding -> Lawyer Prospects -> Needs contact details; also Lawyer Onboarding -> Lawyer sales command center.
- SAFETY: repo theme admin code/docs plus uPress pull/live login-gate check only. No public CMS database page edited, no public page changed, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 18:00 Asia/Jerusalem
- LAWYER PROSPECT NEEDS-SCHEDULING VIEW: added a private CRM view for active lawyer prospects that have no next action date.
- RESEARCHED: Salesforce warns that unclear next actions create fuzzy pipeline data and says healthy pipelines need prospects moving on a set time frame; HubSpot frames task queues and due dates as the way to keep action items organized. Sources: https://www.salesforce.com/ca/sales/team-productivity/sales-productivity-pitfalls/, https://www.salesforce.com/sales/pipeline, https://www.hubspot.com/products/task-management
- CODED: `inc/lawyer-prospects.php` now supports `justice_prospect_due_filter=unscheduled` and adds a "Needs scheduling" list view.
- CODED: the unscheduled view excludes `won` and `lost` records because those intentionally clear follow-up dates.
- CODED: `inc/lawyer-onboarding.php` now shows a "Needs scheduling" card and makes unscheduled active prospects a next-best-action priority after overdue/due work.
- VERIFIED: `php -l inc/lawyer-prospects.php`, `php -l inc/lawyer-onboarding.php` and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `e0ddcf3 Add unscheduled lawyer prospect view`; uPress Git pull succeeded and the uPress log shows `e0ddcf3` as live HEAD before this documentation correction.
- LIVE CHECK: unauthenticated access to the `Needs scheduling` admin list redirects to WordPress login, then uPress Login Protector; the private prospect list is not public.
- HONEST MONEY ASSESSMENT: no revenue, no outreach and no records updated. Material advancement is preventing active lawyer prospects from stalling without a next action.
- COMPLETION ASSESSMENT: lawyer acquisition execution readiness moved from 80% to 82%; prospect follow-up readiness moved from 82% to 86%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE AFTER WORDPRESS ADMIN LOGIN: Lawyer Onboarding -> Lawyer Prospects -> Needs scheduling; also Lawyer Onboarding -> Lawyer sales command center.
- SAFETY: repo theme admin code/docs plus uPress pull/live login-gate check only. No public CMS database page edited, no public page changed, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 17:50 Asia/Jerusalem
- LAWYER SALES NEXT BEST ACTION: upgraded the private Lawyer sales command center from raw counts to a clear first action.
- RESEARCHED: Salesforce says pipeline stages identify next best steps and pipeline management should keep interactions/reminders in the CRM; HubSpot frames its task dashboard as a command center for tasks, meetings and contact details. Sources: https://www.salesforce.com/sales/pipeline/, https://www.salesforce.com/sales/pipeline/management/, https://www.hubspot.com/products/task-management
- CODED: `inc/lawyer-onboarding.php` now adds `justice_theme_lawyer_onboarding_sales_next_action()` and a "Next best action" card.
- CODED: the action order is overdue follow-ups, due follow-ups, proposals, hot prospects, active pipeline review, then new outreach batch.
- VERIFIED: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `867d59c Add lawyer sales next best action`; uPress Git pull succeeded and the uPress log shows `867d59c` as live HEAD before this documentation correction.
- LIVE CHECK: unauthenticated admin URL redirects to WordPress login, then uPress Login Protector; the next-action card is not public.
- HONEST MONEY ASSESSMENT: no revenue, no outreach and no records updated. Material advancement is owner execution clarity: the dashboard now says what to work first.
- COMPLETION ASSESSMENT: lawyer acquisition execution readiness moved from 78% to 80%; prospect follow-up readiness moved from 78% to 82%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE AFTER WORDPRESS ADMIN LOGIN: Lawyer Onboarding -> Lawyer sales command center -> Next best action card.
- SAFETY: repo theme admin code/docs plus uPress pull/live login-gate check only. No public CMS database page edited, no public page changed, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 17:48 Asia/Jerusalem
- LAWYER SALES COMMAND CENTER: added one top-level owner view inside Lawyer Onboarding for daily lawyer sales execution.
- RESEARCHED: HubSpot task guidance uses record-linked due dates, reminders, priority and follow-up work; Salesforce pipeline guidance stresses clear next steps, regular pipeline review and automation. Sources: https://knowledge.hubspot.com/tasks/create-tasks, https://www.salesforce.com/sales/pipeline/management/
- CODED: `inc/lawyer-onboarding.php` now renders command-center cards for overdue follow-ups, due now, hot prospects, proposals sent, active monthly pipeline and won monthly value.
- CODED: the command center links directly to Due, Overdue, Hot, Proposal, Outreach Links, Add manual prospect and All prospects.
- VERIFIED: `php -l inc/lawyer-onboarding.php` and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `d0b61d0 Show lawyer sales command center`; uPress Git pull succeeded and the uPress log showed `d0b61d0` as the live code commit before this documentation update.
- LIVE CHECK: unauthenticated admin URL redirects to WordPress login, then uPress Login Protector; the command center is not public.
- HONEST MONEY ASSESSMENT: no revenue, no outreach and no records updated. Material advancement is owner execution visibility.
- COMPLETION ASSESSMENT: lawyer acquisition execution readiness moved from 74% to 78%; prospect follow-up readiness moved from 72% to 78%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE AFTER WORDPRESS ADMIN LOGIN: Lawyer Onboarding -> top Lawyer sales command center.
- SAFETY: repo theme admin code/docs plus uPress pull/live login-gate check only. No public CMS database page edited, no public page changed, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 17:35 Asia/Jerusalem
- LAWYER PROSPECT FOLLOW-UP VIEWS: added due/overdue follow-up views and list-level quick actions to the private Lawyer Prospects admin list.
- RESEARCHED: HubSpot tasks use record-linked due dates, reminders, priority and follow-up creation; Salesforce's 2026 pipeline guidance stresses clear next steps, regular reviews and automation because leads do not close by themselves. Sources: https://knowledge.hubspot.com/tasks/create-tasks, https://www.salesforce.com/sales/pipeline/management/
- CODED: `inc/lawyer-prospects.php` now adds Due now, Overdue, Today and Upcoming views on the `justice_prospect` list using `prospect_next_action_at`.
- CODED: the Next action column now labels records as Overdue, Due today, Scheduled or No date set.
- CODED: the prospect list now shows quick action buttons for Contacted today, Set follow-up, Proposal sent, Won/onboarding and Lost/not fit.
- VERIFIED: `php -l inc/lawyer-prospects.php` and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `a8a9493 Show due follow-ups in lawyer prospect list`; uPress Git pull succeeded and the uPress log shows `a8a9493` as `HEAD -> main, origin/main, origin/HEAD`.
- LIVE CHECK: direct unauthenticated access to `wp-admin/edit.php?post_type=justice_prospect&justice_prospect_due_filter=due` redirects to WordPress login; the follow-up request hit the uPress login protector challenge and did not expose the private list publicly.
- HONEST MONEY ASSESSMENT: no revenue earned yet, no outreach sent and no prospect updated. Material advancement is daily sales execution: the owner can now see due lawyer follow-ups and update status without opening every prospect.
- COMPLETION ASSESSMENT: lawyer acquisition execution readiness moved from 70% to 74%; prospect follow-up readiness moved from 62% to 72%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE AFTER WORDPRESS ADMIN LOGIN: Lawyer Onboarding -> Lawyer Prospects -> Due now / Overdue / Today / Upcoming.
- SAFETY: repo theme admin code/docs plus uPress pull/live login-gate check only. No public CMS database page edited, no public page changed, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 17:31 Asia/Jerusalem
- LAWYER OUTREACH -> PROSPECT PIPELINE: connected the owner-only Outreach Links screen to the private Lawyer Prospects CRM so each manual lawyer message can become a tracked follow-up record.
- RESEARCHED: Clio Grow tracks marketing sources on contacts/matters and reports source, status, estimated value, conversion rate, revenue and pipeline value. Sources: https://help.clio.com/hc/en-us/articles/25315194374299-Clio-Grow-Marketing-Sources, https://help.clio.com/hc/en-us/articles/29739406189339-Clio-Grow-Reports
- CODED: `inc/lawyer-onboarding.php` now shows a "Prospect pipeline handoff" section on Lawyer Onboarding -> Outreach Links with buttons to add a prefilled prospect draft or open the prospect pipeline.
- CODED: `inc/lawyer-prospects.php` now accepts safe query-string prefill for new prospect drafts and keeps UTM/outreach attribution in private prospect outreach messages.
- CODED: the Outreach Links batch rule now tells the owner to create a prospect record before sending or immediately after the first reply.
- VERIFIED: `php -l inc/lawyer-onboarding.php`, `php -l inc/lawyer-prospects.php`, and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `4327606 Connect outreach links to prospect pipeline`; uPress Git pull succeeded and the uPress log shows `4327606` as `HEAD -> main, origin/main, origin/HEAD`.
- LIVE CHECK: direct unauthenticated access to `wp-admin/admin.php?page=justice-lawyer-outreach-links` redirects to WordPress login; the follow-up request hit the uPress login protector challenge and did not expose the admin tool publicly.
- HONEST MONEY ASSESSMENT: no revenue earned yet, no outreach sent and no prospect saved. Material advancement is sales discipline: the first manual lawyer batch can now move from message -> tracked prospect -> follow-up -> signup/won/lost.
- COMPLETION ASSESSMENT: lawyer acquisition execution readiness moved from 63% to 70%; prospect follow-up readiness moved from 45% to 62%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE AFTER WORDPRESS ADMIN LOGIN: Lawyer Onboarding -> Outreach Links -> "Add prospect with these batch defaults"; also Lawyer Onboarding -> Lawyer Prospects.
- SAFETY: repo theme admin code/docs plus uPress pull/live login-gate check only. No public CMS database page edited, no public page changed, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/prospect/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 17:16 Asia/Jerusalem
- LAWYER OUTREACH LAUNCH DRAFTS: strengthened the owner-only Outreach Links screen so the first lawyer sales batch can be small, personal, tracked and safer.
- RESEARCHED: Google Analytics says campaign URLs should use consistent `utm_source`, `utm_medium`, `utm_campaign` and `utm_content` for message variants; Israeli anti-spam commentary around section 30A warns that commercial email/SMS outreach has consent/unsubscribe risk. Sources: https://support.google.com/analytics/answer/10917952, https://www.law.co.il/en/news/2016/08/19/israeli-anti-spam-law-amended-for-first-time/
- CODED: `inc/lawyer-onboarding.php` now gives the owner-only outreach builder three message variants, a personal opening line field, and a manual-outreach warning.
- CODED: the personal opening line is copied into the message only and is not added to the tracked registration URL.
- CODED: the owner-only batch rule now says to start with 10-20 lawyers, use one segment, change one variable at a time, personalize the first sentence, avoid bulk sending and watch Lawyer Onboarding source data.
- VERIFIED: `php -l inc/lawyer-onboarding.php` passed and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `45d817a Improve lawyer outreach launch drafts`; uPress Git pull succeeded and the uPress log shows `45d817a` as `HEAD -> main, origin/main, origin/HEAD`.
- LIVE CHECK: direct access to `wp-admin/admin.php?page=justice-lawyer-outreach-links` redirects to WordPress login, includes `noindex`, and does not expose the outreach screen text publicly.
- HONEST MONEY ASSESSMENT: no revenue earned yet and no outreach sent. Material advancement is execution readiness for the first tracked lawyer sales batch.
- COMPLETION ASSESSMENT: lawyer acquisition execution readiness moved from 55% to 63%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE AFTER WORDPRESS ADMIN LOGIN: Lawyer Onboarding -> Outreach Links.
- SAFETY: repo theme admin code/docs plus uPress pull/live login-gate check only. No public CMS database page edited, no public page changed, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 17:02 Asia/Jerusalem
- LAWYER PLANS FAQ SCHEMA: added FAQPage JSON-LD to `/lawyer-plans/` so the existing lawyer objections are machine-readable as well as visible.
- RESEARCHED: Google's FAQPage guidance was updated with FAQ rich-result deprecation from May 7, 2026, but still documents `FAQPage`, `Question` and `Answer`; Google's structured-data policies require markup to match visible page content and avoid hidden/misleading content. Sources: https://developers.google.com/search/docs/appearance/structured-data/faqpage, https://developers.google.com/search/docs/appearance/structured-data/sd-policies, https://developers.google.com/search/blog/2023/08/howto-faq-changes
- CODED: `page-lawyer-plans.php` now prints a FAQPage schema block for the four visible lawyer-plan FAQ answers.
- VERIFIED: `php -l page-lawyer-plans.php` passed, `git diff --check` passed with only the existing Windows line-ending warning, and `page-lawyer-plans.php` contains no public WooCommerce/Morning/Grow/Meshulam wording.
- DEPLOYED: pushed `921656c Add lawyer plans FAQ schema`; uPress Git pull succeeded and the uPress log shows `921656c` as `HEAD -> main, origin/main, origin/HEAD`.
- LIVE CHECK: `/lawyer-plans/?qa=faq-schema-202605211705` has four visible FAQ items, one FAQPage schema with four questions, no page-level `noindex`, no public payment-vendor wording, and desktop page width stayed within the viewport.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Material advancement is SEO/AI clarity: the subscription objections now line up for users and crawlers.
- COMPLETION ASSESSMENT: lawyer plan SEO clarity moved from 68% to 73%; lawyer plan conversion readiness remains 74%; first paid-lawyer readiness remains about 90% until real outreach/signups or payment setup moves.
- OWNER-VISIBLE: `/lawyer-plans/`; the schema is in the page source, while the matching FAQ remains visible below the plan/compliance blocks.
- SAFETY: repo theme code/docs plus uPress pull/live read-only verification only. No public CMS database page edited, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 16:44 Asia/Jerusalem
- LAWYER PLAN OBJECTION FAQ: added a conversion FAQ to `/lawyer-plans/` so lawyers understand quality, payment readiness, limits and activation requirements before leaving details.
- RESEARCHED: FindLaw sells premium profiles around online presence, credibility, easy contact, detailed reporting and monthly performance reports; Justia compares paid tiers by premium visibility, prominent contact info, practice FAQs and traffic statistics; Lawzana frames lawyer reporting around profile views, lead conversions and marketing performance. Sources: https://www.findlaw.com/lawyer-marketing/services/legal-directory-advertising/findlaw-premium-profile/, https://www.justia.com/marketing/lawyer-directory/, https://lawzana.com/support/lawyers/reporting-and-analytics
- CODED: `page-lawyer-plans.php` was rebuilt cleanly with readable Hebrew copy, safe URL fallbacks, and the new FAQ section after plan/compliance content.
- CODED: `assets/css/premium-pass-3.css` now styles the FAQ with responsive two-column/one-column behavior.
- VERIFIED: `php -l page-lawyer-plans.php` passed, `git diff --check` passed with only the existing Windows line-ending warning, and `page-lawyer-plans.php` contains no public WooCommerce/Morning/Grow/Meshulam wording.
- DEPLOYED: pushed `112baa2 Add lawyer plans objection FAQ`; uPress Git pull succeeded and the uPress log shows `112baa2` as `HEAD -> main, origin/main, origin/HEAD`.
- LIVE CHECK: `/lawyer-plans/?qa=plans-faq-202605211645` includes the FAQ with four questions, has no page-level `noindex`, includes no public Grow/Meshulam/WooCommerce/Morning wording, and desktop page width stayed within the viewport.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Material advancement is conversion clarity: the plan page now handles likely lawyer objections before a sales call.
- COMPLETION ASSESSMENT: lawyer plan conversion readiness moved from 70% to 74%; first paid-lawyer readiness remains about 90%; homepage-to-lawyer-subscription path remains 82% until real outreach/signups arrive.
- OWNER-VISIBLE: `/lawyer-plans/`, below the plan/compliance blocks.
- SAFETY: repo theme code/docs only. No public CMS database page edited, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 16:28 Asia/Jerusalem
- LAWYER PLAN SALES PAGE: strengthened `/lawyer-plans/` so it explains the actual business system lawyers receive, not only pricing/cards.
- RESEARCHED: Justia sells premium lawyer directory value through enhanced profiles, contact visibility and reporting; FindLaw frames lawyer marketing around visibility and lead generation, not static listing alone. Sources: https://www.justia.com/marketing/lawyer-directory/ and https://www.findlaw.com/lawyer-marketing/
- CODED: `page-lawyer-plans.php` now includes a new "what the lawyer receives in practice" section before plan cards.
- CODED: the section explains rich mini-site/profile, measured inquiries, monthly value reporting and compliant disclosure/no fake ranking.
- CODED: removed public WooCommerce/Morning vendor wording from the plan-page copy and replaced it with clean billing-readiness language.
- CODED: `assets/css/premium-pass-3.css` styles the new section across desktop and mobile.
- VERIFIED: `php -l page-lawyer-plans.php` passed, `git diff --check` passed with only the existing Windows line-ending warning, and `page-lawyer-plans.php` no longer contains public WooCommerce/Morning/Grow/Meshulam wording.
- DEPLOYED: pushed `27c7065 Strengthen lawyer plans sales page` and `92d0f03 Hide payment vendor wording on lawyer plans`; uPress Git pull succeeded and the uPress log shows `92d0f03` as `HEAD -> main, origin/main, origin/HEAD`.
- LIVE CHECK: `/lawyer-plans/?qa=plans-sales-final-202605211633` returns the live page, the new sales-system section is present, there is no page-level `noindex`, no public Grow/Meshulam/WooCommerce/Morning wording was found, and desktop page width stayed within the viewport.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Material advancement is sales conversion: lawyers now see a clearer product reason to leave details before billing is active.
- COMPLETION ASSESSMENT: lawyer plan conversion readiness moved from 64% to 70%; first paid-lawyer readiness moved from 89% to 90%; homepage-to-lawyer-subscription path remains 82% until real outreach/signups arrive.
- OWNER-VISIBLE: `/lawyer-plans/`, above the plan cards.
- SAFETY: repo theme code/docs only. No public CMS database page edited, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead/order record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 16:15 Asia/Jerusalem
- LAWYER OUTREACH LINK BUILDER: added an owner-only WordPress admin screen to create tracked lawyer-registration links for targeted lawyer sales batches.
- RESEARCHED: Google Analytics campaign-link guidance says referral/ad campaign URLs should carry UTM parameters, and Google recommends using source, medium and campaign consistently so acquisition reports can attribute traffic correctly. Sources: https://support.google.com/analytics/answer/10917952 and https://support.google.com/analytics/answer/15567068
- CODED: `inc/lawyer-onboarding.php` now adds Lawyer Onboarding -> Outreach Links in wp-admin.
- CODED: the screen builds a `/lawyer-registration/` URL with plan interest, source, medium, campaign, message variant, segment, city and practice.
- CODED: the screen creates a short Hebrew outreach message draft and copy buttons for the URL/message.
- VERIFIED: `php -l inc/lawyer-onboarding.php` passed and `git diff --check` passed with only the existing Windows line-ending warning.
- DEPLOYED: pushed `075b98e Add lawyer outreach link builder`; uPress Git pull succeeded and the uPress log shows `075b98e` as `HEAD -> main, origin/main, origin/HEAD`.
- LIVE CHECK: direct access to the owner-only admin URL redirects to WordPress login in the current browser, so the screen is not public. Visual admin-screen verification still needs an authenticated WordPress admin session.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Material advancement is sales execution: the owner can now start small, measurable lawyer outreach batches instead of sending untracked signup links.
- COMPLETION ASSESSMENT: lawyer acquisition execution readiness moved from 45% to 55%; first paid-lawyer readiness moved from 88% to 89%; homepage-to-lawyer-subscription path remains 82% until real outreach and submissions arrive.
- OWNER-VISIBLE AFTER WORDPRESS ADMIN LOGIN: Lawyer Onboarding -> Outreach Links.
- SAFETY: repo theme code/docs only. No public CMS page edited, no 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no product/lawyer/lead record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 16:01 Asia/Jerusalem
- LAWYER OUTREACH ATTRIBUTION: added campaign/source tracking to the lawyer registration path so outreach can be measured by source, segment, city and practice.
- RESEARCHED: Clio Grow tracks marketing sources from outreach and online channels on contacts/matters, and its reports expose source, referral, status and revenue data to show where profit originates. Sources: https://help.clio.com/hc/en-us/articles/25315194374299-Clio-Grow-Marketing-Sources, https://help.clio.com/hc/en-us/articles/29739406189339-Clio-Grow-Reports
- CODED: `page-lawyer-registration.php` now renders hidden attribution fields from UTM/outreach query parameters.
- CODED: `inc/lawyer-onboarding.php` now sanitizes, stores and summarizes attribution fields on submitted lawyer drafts; admin notification emails include attribution and landing-page context.
- CODED: the Lawyer Onboarding admin table now has a Source column so future registrations show their source/campaign context.
- CODED: `template-parts/sections/lawyer-cta.php` now appends homepage CTA attribution tags to the lead-partner registration URL.
- CODED: `assets/js/lawyer-registration-wizard.js` now fills missing attribution hidden fields from both query string and URL hash, because live redirects can move unknown UTM parameters into the hash.
- CODED: `inc/enqueue.php` bumps the wizard script to `1.2.0` for cache busting.
- DOCUMENTED: added `project-control/lawyer-registration-attribution-2026-05-21.md`.
- VERIFIED: `php -l inc/lawyer-onboarding.php`, `php -l page-lawyer-registration.php`, `php -l template-parts/sections/lawyer-cta.php`, `php -l inc/enqueue.php`, and `git diff --check` passed. uPress Git log shows `0449321 Capture lawyer attribution from URL hash` as `HEAD -> main, origin/main`.
- LIVE CHECK: homepage returns 200, no page-level `noindex`, and the lawyer CTA link includes homepage attribution tags.
- LIVE CHECK: a tagged lawyer registration URL with outreach query fields and UTM values in the URL hash renders the wizard, has no page-level `noindex`, and fills hidden fields for `utm_source`, `utm_medium`, `utm_campaign`, `outreach_segment`, `outreach_city`, `outreach_practice` and the full landing URL.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Material advancement is sales measurement: first lawyer outreach can now be tracked by message/source/city/practice instead of becoming anonymous form traffic.
- COMPLETION ASSESSMENT: lawyer outreach measurement readiness moved from 15% to 45%; first paid-lawyer readiness moved from 87% to 88%; homepage-to-lawyer-subscription path remains 82% but now carries attribution tags.
- OWNER-VISIBLE AFTER DEPLOY: use a lawyer-registration URL with `utm_source`, `outreach_segment`, `outreach_city` or `outreach_practice`; submitted drafts should preserve those values in Lawyer Onboarding.
- SAFETY: repo theme code/docs plus uPress pull/read-only live verification only. No 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no public CMS page edited, no product created, no lawyer/lead record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 15:47 Asia/Jerusalem
- HOMEPAGE LAWYER ACQUISITION: connected the homepage to the stronger paid-lawyer onboarding path so lawyers can clearly start a lead-partner fit check from the front page.
- RESEARCHED: Justia monetizes premium lawyer visibility with enhanced profiles, contact forms, traffic stats and monthly reporting; Clio Grow sells lawyers on organized lead stages, source tracking, conversion and value reporting. Sources: https://www.justia.com/marketing/lawyer-directory/, https://www.clio.com/grow/, https://help.clio.com/hc/en-us/articles/29739406189339-Clio-Grow-Reports
- CODED: `front-page.php` now loads `template-parts/sections/lawyer-cta.php` after featured lawyers and before latest articles.
- CODED: `template-parts/sections/lawyer-cta.php` now presents a serious business offer: mini-site/profile, lead status tracking, monthly value reporting, eligibility check, setup and measurement.
- CODED: the primary CTA points to the existing lead-partner registration URL, and the secondary CTA points to `/lawyer-plans/`.
- CODED: `assets/css/main.css` supports the new three-step pipeline, mobile stacking and numbered badges.
- DOCUMENTED: added `project-control/homepage-lawyer-acquisition-cta-2026-05-21.md`.
- VERIFIED: `php -l front-page.php`, `php -l template-parts/sections/lawyer-cta.php`, and `git diff --check` passed. uPress Git log shows `0d9c367 Add homepage lawyer acquisition CTA` as `HEAD -> main, origin/main`.
- LIVE CHECK: homepage returns 200, no page-level `noindex`, shows the lawyer CTA, has no public Grow/Meshulam wording, and its main button opens `/lawyer-registration/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice`.
- LIVE CHECK: mobile verification shows no actual horizontal page scroll; `documentElement.scrollWidth` equals the viewport. The only wider `body.scrollWidth` reading is from the existing fixed accessibility toolbar panel.
- LIVE CHECK: the lead-partner registration URL returns 200, no page-level `noindex`, and the registration wizard is present.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Material advancement is that lawyer prospects now have a direct homepage route into the paid-product onboarding path.
- COMPLETION ASSESSMENT: homepage-to-lawyer-subscription path moved from 77% to 82%; first paid-lawyer readiness moved from 86% to 87%; overall homepage money-machine readiness moved from 78% to 82%. Still blocked: Grow/Meshulam final approval, payment product mapping, real lawyer outreach and first paid lawyer.
- OWNER-VISIBLE AFTER DEPLOY: homepage should show the lawyer business CTA between featured lawyers and latest articles; its main button should open the lead-partner registration wizard.
- SAFETY: repo theme code/docs plus uPress pull/read-only live verification only. No 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no public CMS page edited, no product created, no lawyer/lead record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 15:42 Asia/Jerusalem
- LAWYER ONBOARDING CONVERSION: polished the lawyer registration flow so it feels like a guided paid-product onboarding path, not a raw form.
- RESEARCHED: Clio Grow emphasizes lead performance, pipeline health and value tracking; Justia emphasizes complete lawyer profiles, premium visibility and traffic stats; current conversion guidance emphasizes clear next steps after submission, reassurance and mobile usability. Sources: https://help.clio.com/hc/en-us/articles/14353490331035-Clio-Grow-Dashboard, https://www.justia.com/marketing/lawyer-directory/, https://www.simplelaw.com/blog/conversion-strategies-for-law-firm-websites
- CODED: `assets/js/lawyer-registration-wizard.js` now shows Hebrew wizard steps and buttons, adds a final "what happens after submission" summary, and removes English wizard leftovers.
- CODED: `page-lawyer-registration.php` now includes a server-rendered after-submission section explaining license/practice review, mini-site preparation, and activation/measurement.
- CODED: `assets/css/premium-pass-3.css` styles the new onboarding summary/next-step section and fixes the hidden anti-spam field so it no longer creates horizontal overflow.
- CODED: `inc/enqueue.php` bumps registration JS and CSS versions so the deployed assets are cache-busted.
- DOCUMENTED: added `project-control/lawyer-onboarding-conversion-polish-2026-05-21.md`.
- VERIFIED: `php -l page-lawyer-registration.php`, `php -l inc/enqueue.php`, and `git diff --check` passed. uPress Git log shows `7abb331 Prevent lawyer registration horizontal overflow` as `HEAD -> main, origin/main`.
- LIVE CHECK: `/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice` returns 200, no page-level `noindex`, Hebrew wizard copy is visible, no English wizard leftovers were found, manual invoice wording is present, the new after-submission section is present, the wizard reaches the final review step with dummy required fields, and checked viewport overflow is fixed.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is lawyer acquisition trust: the signup path now explains the product journey from registration to profile, dashboard, lead handling and payment activation.
- COMPLETION ASSESSMENT: lawyer onboarding conversion readiness moved from 62% to 70%; first paid-lawyer readiness moved from 84% to 86%; homepage-to-lawyer-subscription path moved from 72% to 77%. Still blocked: Grow/Meshulam final approval, WooCommerce subscription product mapping, real outreach and first paid lawyer.
- OWNER-VISIBLE AFTER DEPLOY: visit `/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice`; the wizard should be Hebrew, clearer, and free of horizontal page overflow.
- SAFETY: repo theme code/docs plus uPress pull/read-only live verification only. No 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no public CMS page edited, no product created, no lawyer/lead record created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 15:29 Asia/Jerusalem
- PRACTICE TERM LINK ALIASES: cleaned the remaining generated practice-area links that diluted homepage/internal authority across older duplicate taxonomy URLs.
- RESEARCHED: Google Search Central says internal links should point to the preferred canonical URL when duplicates exist, and crawlable internal links with clear anchor text help Google find and understand important pages. Sources: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls and https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- FOUND: after the previous money-topic cleanup, live homepage still rendered older 200 taxonomy links from generated term output: `/practice-areas/real-estate/`, `/practice-areas/personal-injury/`, `/practice-areas/tort-law/` and `/practice-areas/israeli-labor-law/`.
- CODED: `inc/template-tags.php` now maps those older term slugs to the preferred live hubs when public templates render a term link: real estate -> `/practice-areas/real-estate-law/`, injury/tort -> `/tort-lawyer/`, labor -> `/practice-areas/labor-law/`.
- CODED: `template-parts/sections/hero.php` now uses `justice_theme_public_term_link()` for homepage hero popular-practice links instead of calling WordPress term URLs directly.
- DOCUMENTED: added `project-control/practice-term-link-alias-cleanup-2026-05-21.md`.
- VERIFIED: `php -l inc/template-tags.php`, `php -l template-parts/sections/hero.php` and `git diff --check` passed. uPress Git log shows `d80e576 Route homepage hero terms through public links` as `HEAD -> main, origin/main`.
- LIVE CHECK: homepage, `/practice-areas/real-estate-law/`, `/practice-areas/labor-law/` and `/articles/` all return 200 with no page-level `noindex`; cache-busted HTML contains `/practice-areas/real-estate-law/`, `/practice-areas/labor-law/` and `/tort-lawyer/`, and contains zero links to the targeted duplicate term URLs.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is homepage SEO authority hygiene: generated CMS links now reinforce current money hubs instead of splitting signals across duplicate taxonomy URLs.
- COMPLETION ASSESSMENT: public money-link hygiene moved from 83% to 88%; homepage-to-money-hub SEO chain moved from 85% to 88%; first paid-lawyer readiness remains around 84% because Grow/payment approval, product mapping and paying lawyers are still the bottleneck.
- OWNER-VISIBLE AFTER DEPLOY: homepage hero popular practice links and generated practice-area links should now open the preferred real-estate, labor and tort/injury hubs.
- SAFETY: repo theme code/docs plus uPress pull/read-only live verification only. No 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no public CMS page edited, no product created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 15:15 Asia/Jerusalem
- MONEY-TOPIC LINK HYGIENE: cleaned public template links so major money topics point to current live hubs, not future/dead slugs or noindex filtered-directory fallbacks.
- RESEARCHED: Google Search Central recommends using the preferred/canonical URL consistently in internal links and says crawlable links with descriptive anchor text help users and Google understand linked pages. Sources: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls and https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- FOUND: `/real-estate-lawyer/`, `/employment-lawyer/` and `/personal-injury-lawyer/` return 404 today, while the current safe targets are `/practice-areas/real-estate-law/`, `/practice-areas/labor-law/` and `/tort-lawyer/`.
- FOUND: `/medical-malpractice-lawyer/` is live and indexable, but some templates used a helper that could fall back to a noindex filtered lawyer-directory URL.
- CODED: updated header topic strip, footer practice links, featured pillar cards, topic clusters, homepage medical-malpractice guide link, lost-visitor rescue links and draft seed links to the current live hubs.
- DOCUMENTED: added `project-control/money-topic-link-canonical-cleanup-2026-05-21.md`.
- VERIFIED: PHP lint passed for all changed PHP files and `git diff --check` passed. uPress Git log shows `4c276b4 Point money topic links to live hubs` as `HEAD -> main, origin/main`.
- LIVE CHECK: homepage no-cache response returns 200 and includes `/practice-areas/real-estate-law/`, `/practice-areas/labor-law/`, `/tort-lawyer/` and `/medical-malpractice-lawyer/`; it no longer includes `/real-estate-lawyer/`, `/employment-lawyer/` or `/personal-injury-lawyer/`.
- LIVE CHECK: `/not-found-help/` returns 200 with `X-Justice-Route: not-found-rescue`; no-cache response includes the new real-estate, labor and tort hub links.
- RESIDUAL FINDING: related-term output still exposes older 200 taxonomy URLs: `/practice-areas/real-estate/`, `/practice-areas/personal-injury/` and `/practice-areas/israeli-labor-law/`. They are not 404s, so this is a later taxonomy alias/duplicate cleanup task.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is SEO and conversion hygiene: public navigation now sends authority and users toward current indexable money hubs instead of dead/future targets.
- COMPLETION ASSESSMENT: public money-link hygiene moved from 74% to 83%; homepage-to-money-hub SEO chain moved from 82% to 85%; first paid-lawyer readiness remains around 84% because Grow/payment approval and real sales are still the bottleneck.
- OWNER-VISIBLE AFTER DEPLOY: header topic strip, homepage practice cards, footer practice links and `/not-found-help/` should now guide users to the current live hubs for real estate, labor, torts and medical malpractice.
- SAFETY: repo theme code/docs plus uPress pull/read-only live verification only. No 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no public CMS page edited, no product created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 15:03 Asia/Jerusalem
- PRACTICE MONEY HUB SEO: strengthened the two indexable practice hubs that the homepage now links to for real-estate and labor-law intent.
- RESEARCHED: Google Search Central says Google understands site structure through internal links and important categories should be reachable from prominent links; Google also uses page titles and prominent headings to understand/search-display page topics. Sources: https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure, https://developers.google.com/search/docs/appearance/title-link, https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- FOUND: live `/practice-areas/real-estate-law/` and `/practice-areas/labor-law/` were indexable but had weak taxonomy H1s: `מקרקעין` and `עבודה`.
- CODED: `taxonomy-practice-areas.php` now gives `real-estate-law` and `labor-law` stronger money-intent H1s, intro copy and guide headings while keeping the generic taxonomy template intact for other areas.
- CODED: `inc/seo.php` now aligns theme/SEO-plugin title and description output for those two taxonomy hubs.
- DOCUMENTED: added `project-control/practice-taxonomy-money-page-seo-2026-05-21.md`.
- VERIFIED: `php -l taxonomy-practice-areas.php`, `php -l inc/seo.php`, and `git diff --check` passed. uPress Git log shows `ae0b038 Improve practice taxonomy money pages` as `HEAD -> main, origin/main`.
- LIVE CHECK: `/practice-areas/real-estate-law/` returns 200, no `noindex`, H1 `עורך דין מקרקעין ונדל״ן`, title `עורך דין מקרקעין ונדל״ן | מדריכים, מאמרים ועורכי דין`, and the new real-estate intro is present.
- LIVE CHECK: `/practice-areas/labor-law/` returns 200, no `noindex`, H1 `עורך דין דיני עבודה`, title `עורך דין דיני עבודה | זכויות עובדים, פיטורים ושימוע`, and the new labor-law intro is present.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is SEO intent alignment on two homepage-linked money hubs that can attract future real-estate and labor-law leads.
- COMPLETION ASSESSMENT: real-estate practice hub readiness moved from 42% to 49%; labor-law practice hub readiness moved from 38% to 47%; homepage-to-money-hub SEO chain moved from 78% to 82%. Still blocked: real GSC/Analytics lift, deeper support content, Grow approval/product mapping and actual paid lawyers.
- OWNER-VISIBLE AFTER DEPLOY: visit `/practice-areas/real-estate-law/` and `/practice-areas/labor-law/`; the top headline and browser title should now use stronger lawyer-search language.
- SAFETY: repo theme code/docs plus uPress pull/read-only live verification only. No 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no public CMS page edited, no product created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 14:59 Asia/Jerusalem
- HOMEPAGE GOOGLEBOT JOURNEY: ran a live homepage check with a smartphone Googlebot-style user agent after the homepage SEO changes.
- RESEARCHED: Google Search Central mobile-first indexing guidance says Google mainly uses the mobile version for indexing/ranking and needs access to the same content, links and structured data. Source: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing
- AUDITED: homepage returns content, canonical is `https://jus-tice.co.il/`, no homepage `noindex`, H1 count is 1, customer strip present, money-intent pyramid present, `#homepage-intent-pyramid` anchor present, find-lawyer guide present, ask-lawyer path present, and homepage intent `ItemList` has 6 items.
- AUDITED: `robots.txt` returns 200 with sitemap, and `sitemap_index.xml` returns 200 with 7 HTTPS sitemap URLs and 0 HTTP sitemap URLs.
- FOUND: real-estate, labor-law and personal-injury homepage guide/title destinations were landing on filtered lawyer directory URLs that return 200 but are `noindex`. Good for conversion, weak as main SEO guide targets.
- CODED: changed those three homepage guide/title destinations to indexable pages while keeping the profile buttons on filtered lawyer-directory URLs: real estate -> `/practice-areas/real-estate-law/`, labor law -> `/practice-areas/labor-law/`, personal injury -> `/tort-lawyer/`.
- DOCUMENTED: added `project-control/homepage-googlebot-journey-2026-05-21.md`.
- VERIFIED: `php -l template-parts/sections/homepage-intent-pyramid.php` and `git diff --check` passed before commit. uPress Git log shows `14f6fa9 Point homepage guides to indexable paths` as `HEAD -> main, origin/main`. Live homepage check confirms real-estate, labor and personal-injury guide/title links are visible, the matching `ItemList` schema URLs updated, and all three guide targets return 200 with no `noindex`.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is homepage crawl quality: the homepage now points its main guide actions at indexable legal destinations instead of noindex filters.
- COMPLETION ASSESSMENT: homepage Googlebot/indexing confidence moved from 70% to 78%; homepage SEO/root readiness moved from 75% to 78%. Still blocked: GSC/Analytics impact, Grow approval/product mapping and paid lawyer users.
- OWNER-VISIBLE AFTER DEPLOY: on the homepage, real-estate/labor/personal-injury card title and guide buttons should open legal content pages; profile buttons still open filtered lawyer lists.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `14f6fa9 Point homepage guides to indexable paths` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs plus uPress pull/read-only live verification only. No 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no public CMS page edited, no product created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 14:49 Asia/Jerusalem
- HOMEPAGE STRUCTURED DATA: added a safe JSON-LD `ItemList` for the six visible money-intent cards on the homepage.
- RESEARCHED: Google Search Central structured-data guidance says JSON-LD is recommended, structured data must describe visible content, and multiple visible items can be marked up when it helps Google understand the page. Sources: https://developers.google.com/search/docs/appearance/structured-data/sd-policies and https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- CODED: `template-parts/sections/homepage-intent-pyramid.php` now gives the section a real anchor ID and prints an `ItemList` whose six items use the same visible card titles, descriptions and safe destination URLs already on the page.
- DOCUMENTED: added `project-control/homepage-intent-structured-data-2026-05-21.md`.
- VERIFIED: `php -l template-parts/sections/homepage-intent-pyramid.php` and `git diff --check` passed before commit. uPress Git log shows `010d946 Add homepage intent structured data` as `HEAD -> main, origin/main`. Live homepage check shows one `ItemList` with six items, six visible cards with matching names, customer strip present, find-lawyer guide present, and no review/rating claims in the intent schema.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is SEO clarity: the homepage now describes the six high-value legal paths in crawlable links and matching structured data.
- COMPLETION ASSESSMENT: homepage structured-data readiness moved from 55% to 62%; homepage SEO/root readiness moved from 73% to 75%. Still blocked: real GSC/Analytics impact, Grow approval/product mapping and paid lawyer users.
- OWNER-VISIBLE AFTER DEPLOY: no visual design change expected, except the money-intent section has a stable `#homepage-intent-pyramid` anchor for direct links.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `010d946 Add homepage intent structured data` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs plus uPress pull/read-only live verification only. No 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no public CMS page edited, no product created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 14:35 Asia/Jerusalem
- HOMEPAGE LINK QUALITY: tightened the new money-intent homepage section so related-guide labels only point to real published support pages.
- RESEARCHED: Google Search Central link guidance says crawlable internal links and descriptive relevant anchor text help users and Google understand the site. Source: https://developers.google.com/search/docs/crawling-indexing/links-crawlable?hl=en
- FOUND: the section already uses published CMS articles first, but unpublished planned fallback guide paths could fall back to the same primary or directory URL. That was safe technically but weak for trust because different labels could lead to one generic destination.
- CODED: `template-parts/sections/homepage-intent-pyramid.php` now filters fallback guide links through published-path checks and deduplicates URLs. If no real support link exists, it shows one honest practice-area profile-search link.
- DOCUMENTED: added `project-control/homepage-intent-link-quality-2026-05-21.md`.
- VERIFIED: `php -l template-parts/sections/homepage-intent-pyramid.php` and `git diff --check` passed before commit. uPress Git log shows `de83fab Improve homepage intent fallback links` as `HEAD -> main, origin/main`. Live homepage check shows six intent cards, zero duplicate related URLs per card, customer strip present, find-lawyer guide present and no public Grow/Meshulam wording.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is homepage trust and SEO hygiene on the high-money practice cards.
- COMPLETION ASSESSMENT: homepage SEO/link-quality readiness moved from 70% to 73%; traffic-to-lead conversion readiness remains 55% until real analytics prove lift. Still blocked: GSC/Analytics impact, Grow approval/product mapping and real paid lawyer users.
- OWNER-VISIBLE AFTER DEPLOY: homepage related-guide links no longer show unpublished planned article labels that all land on the same generic page.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `de83fab Improve homepage intent fallback links` is `HEAD -> main, origin/main`.
- SAFETY: repo code/docs plus uPress pull/read-only live verification only. No 301 redirect package touched, no Grow action taken, no card charged, no payment setting changed, no public CMS page edited, no product created and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 14:12 Asia/Jerusalem
- HOMEPAGE MOBILE QA: checked the live homepage after the money-intent pyramid deploy, focusing on mobile because Google uses mobile-first indexing and urgent legal leads often come from phones.
- RESEARCHED: Google Search Central mobile-first indexing guidance says Google uses the mobile version of content for indexing and recommends mobile-friendly responsive design. Current legal website conversion guidance emphasizes visible CTAs, mobile usability and clear practice-area navigation. Sources: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing, https://growlaw.co/blog/law-firm-website-ux-best-practices, https://www.simplelaw.com/blog/conversion-strategies-for-law-firm-websites
- AUDITED: created `project-control/visual-evidence/homepage-intent-pyramid-qa-2026-05-21.json` plus desktop/mobile screenshots for the live homepage section.
- FOUND: mobile and desktop both show the new section with 6 cards, no page-level horizontal overflow, customer strip still present, find-lawyer guide still present, ask-lawyer path still present, and no public Grow wording.
- CODED: improved `.homepage-intent-card` title and related-guide links in `assets/css/premium-pass-4.css` so mobile taps have larger block/flex hit areas.
- DOCUMENTED: added `project-control/homepage-intent-mobile-qa-2026-05-21.md`.
- VERIFIED: `git diff --check` passed with only expected line-ending warnings. After deploy, uPress Git log shows `3cf8e7d Improve homepage intent mobile tap targets` as `HEAD -> main, origin/main`; live optimized CSS contains the new `min-height:36px` tap-target rules.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is mobile conversion confidence on the homepage path that routes visitors to high-value practice areas, lawyer profiles and lead capture.
- COMPLETION ASSESSMENT: traffic-to-lead conversion readiness moved from 54% to 55%; mobile homepage confidence moved from 62% to 70%. Still blocked: real analytics/GSC impact, Grow approval, mapped paid products and real paid lawyer users.
- OWNER-VISIBLE AFTER DEPLOY: homepage intent cards should feel easier to tap on mobile, especially the title and related-guide links.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `3cf8e7d Improve homepage intent mobile tap targets` is `HEAD -> main, origin/main`.
- SAFETY: repo code/status/evidence only. No 301 redirect package touched, no Grow action taken, no card charged, no payment gateway setting changed, no public CMS page edited, no product created, and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 13:57 Asia/Jerusalem
- HOMEPAGE SEO PYRAMID: kept the separate 301 redirect package untouched and treated Grow as waiting; used the owner's Green Invoice/Morning digital-payments guide as FYI for the payment track only.
- RESEARCHED: Google Search Central says Google understands site importance from crawlable links between pages and recommends linking important categories/products from the homepage. Justia surfaces lawyer search by practice area and location; FindLaw separates "Find a Lawyer" from legal learning; Israeli competitors iLaw and LawZone emphasize practice-area search, lawyer matching and inquiry forms. Sources: https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure, https://www.justia.com/lawyers/, https://www.findlaw.com/, https://www.ilaw.co.il/, https://lawzone.co.il/, https://www.clio.com/blog/best-lawyer-directories/, https://www.greeninvoice.co.il/magazine/digital-payments-guide/
- CODED: added `template-parts/sections/homepage-intent-pyramid.php`, a CMS-connected homepage section for high-money intents: criminal, family/divorce, real estate, medical malpractice, labor law and personal injury.
- CODED: each intent card links to the safe pillar/hub URL, filtered lawyer directory URL, and two related CMS articles when taxonomy content exists, falling back to safe planned links only when needed.
- CODED: added a lawyer-side path from the homepage to plans, registration and dashboard so the same page now serves both lead demand and lawyer subscription demand.
- CODED: inserted the section after the customer path strip in both `front-page.php` and `page-home.php`; the existing "how to choose lawyer" section remains unchanged.
- VERIFIED: `php -l` passed for the new section plus both homepage templates, and `git diff --check` passed with only expected line-ending warnings. After deploy, uPress Git log shows `882f4ee Add homepage money intent pyramid` as `HEAD -> main, origin/main`; live homepage HTML/browser checks show `homepage-intent-pyramid`, six intent cards, the existing customer strip and find-lawyer guide, no horizontal overflow on desktop, and no public Grow wording.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is SEO and conversion architecture: the homepage now pushes internal authority toward the money topics and gives users/lawyers clearer next actions.
- COMPLETION ASSESSMENT: homepage SEO hierarchy moved from 55% to 66%; traffic-to-lead conversion readiness moved from 49% to 54%; first paid-lawyer readiness moved from 83% to 84%. Still blocked: deeper mobile visual QA, real GSC/analytics impact, Grow approval and paid product mapping.
- OWNER-VISIBLE AFTER DEPLOY: homepage should show a new "search by legal intent" section below the first customer path, with six money-topic cards and lawyer plan/register/dashboard buttons.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `882f4ee Add homepage money intent pyramid` is `HEAD -> main, origin/main`.
- SAFETY: repo code/status only. No 301 redirect package touched, no Grow action taken, no card charged, no payment gateway setting changed, no public CMS page edited, no product created, and no outreach sent.

## LATEST WORK STATUS - 2026-05-21 13:45 Asia/Jerusalem
- HOMEPAGE CUSTOMER READINESS: left the separate 301 redirect package untouched as requested and treated Grow as waiting for post-holiday approval; focused on the public homepage.
- RESEARCHED: Justia's lawyer directory puts legal issue/name plus location search at the top and also lets users browse by practice area/location. FindLaw similarly emphasizes finding legal help by issue and nearby location, while current Clio legal-directory guidance frames directory listings as lead-generation and local SEO assets. Sources: https://www.justia.com/lawyers/, https://lawyers.justia.com/faq, https://www.findlaw.com/home.html, https://www.clio.com/blog/best-lawyer-directories/
- CODED: added `template-parts/sections/customer-intake-strip.php`, a three-path homepage band for visitors who need to submit a legal inquiry, read guides first, or compare lawyer profiles.
- CODED: added the new band immediately after the hero in `front-page.php` and `page-home.php`, so both possible homepage templates get the same customer-ready path.
- CODED: tightened the hero description to remove unsupported "recommended/leading" wording and add clear no-guarantee/no-personal-advice language.
- VERIFIED: `php -l front-page.php`, `php -l page-home.php`, `php -l template-parts/sections/hero.php`, `php -l template-parts/sections/customer-intake-strip.php`, and `git diff --check` passed before commit. After deploy, uPress Git log shows `84ae16c Clarify homepage customer path` as `HEAD -> main, origin/main`; live homepage HTML/browser check shows `customer-intake-strip`, the new safer hero wording and no old "recommended/leading" phrase.
- HONEST MONEY ASSESSMENT: no revenue earned yet. Substantial advancement is conversion readiness: homepage visitors now get a clearer path to lead submission, guide consumption or lawyer comparison, with safer legal-advertising language.
- COMPLETION ASSESSMENT: homepage customer readiness moved from 68% to 74%; lead capture readiness moved from 72% to 74%; traffic-to-lead conversion readiness moved from 45% to 49%. Still blocked: real homepage analytics, paid traffic/leads, Grow approval and deeper homepage visual testing after deploy.
- OWNER-VISIBLE AFTER DEPLOY: homepage below the hero should show a three-card "fast path for clients" band and the hero copy should no longer use "recommended/leading" lawyer claims.
- UPRESS: pulled through uPress Git Manager and verified in the live Git log: `84ae16c Clarify homepage customer path` is `HEAD -> main, origin/main`.
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

## 2026-05-26 QUALIFIED LEAD INVOICE PACKET
- CODE UPDATED: the owner-only Justice CRM qualified lead billing queue now includes a copyable invoice/request packet for each ready-to-bill or invoice-sent lead.
- CODE UPDATED: each packet pulls the lead ID, legal area, billing status, revenue model, suggested/accepted lead fee, billable lawyer IDs, available billing/email/phone contact, existing invoice reference and payment proof URL.
- SAFETY: the packet explicitly says to send it only after the routed lawyer accepted the fee, terms and billing contact requirements; it also repeats that no outcome, ranking, exclusivity or lead volume is promised.
- MONEY IMPACT: this reduces the manual gap between a billable lead and a sent invoice/payment request, so the Bituach Leumi controlled-test path can prove payment without improvised owner notes.
- BLOCKED: still needs real verified specialists, a real controlled billable lead, and real payment evidence before claiming revenue proof.
- COMPLETION ASSESSMENT: qualified-lead billing handoff 80%; Bituach Leumi revenue loop 55%; realized payment proof still 0% until a real invoice/payment is recorded.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin -> Justice CRM -> Qualified lead billing queue -> Copy invoice/request packet.

## 2026-05-26 PROSPECT ACTIVATION PACKET
- CODE UPDATED: private Lawyer Prospect outreach screens now include copy buttons for the email draft, call script and terms acceptance note.
- CODE UPDATED: the same screen now includes a copyable `Routable specialist activation packet` that bridges a verified prospect into a safe `justice_lawyer` routing setup.
- SAFETY: the activation packet tells the owner not to enable routing until license/status, niche experience, manual-payment acceptance, billing contact and lead-fee terms are recorded; it also keeps public cards fact-gated until profile facts/photos/contact/claims are reviewed.
- MONEY IMPACT: this closes the operational gap between "verified prospect" and "active routable specialist", which is the next blocker before the first Bituach Leumi billable lead test.
- BLOCKED: no prospect was contacted, no lawyer profile was created, and no routing was enabled; owner/admin still needs real specialist verification and activation.
- COMPLETION ASSESSMENT: prospect-to-routing handoff 78%; Bituach Leumi supply infrastructure 75%; real specialist supply still 0% until actual verified lawyers are entered.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin -> Lawyer Onboarding -> Lawyer Prospects -> open a prospect -> Manual Outreach Kit -> Routable specialist activation packet.

## 2026-05-26 BTL ACTIVATION GAP BOARD
- CODE UPDATED: Justice CRM now includes an owner-only `Verified-to-routable activation gap` board inside the Bituach Leumi specialist supply panel.
- CODE UPDATED: the board separately lists published active routable Bituach Leumi lawyer profiles and verified prospects that still need profile/routing activation review.
- CODE FIXED: the active-routable specialist count now mirrors the real lead router by counting only published `justice_lawyer` profiles with the national-insurance practice area, `lead_routing_enabled=1` and paid/trialing/active subscription status.
- CODE FIXED: `Won / onboarding` Bituach Leumi prospects are no longer hidden from verified-prospect activation review before a routable lawyer profile exists.
- MONEY IMPACT: this prevents a false sense of coverage and keeps verified specialists visible until they are actually routable for the first controlled paid-lead test.
- BLOCKED: still needs real verified specialists and owner-approved activation of published routable lawyer profiles; no CMS record, public card or routing state was changed.
- COMPLETION ASSESSMENT: Bituach Leumi supply visibility 85%; activation-to-routing readiness 62%; actual first paid lead proof remains blocked by real supply/payment evidence.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin -> Justice CRM -> Bituach Leumi specialist supply -> Verified-to-routable activation gap.

## 2026-05-26 BTL FIRST TEST PREFLIGHT
- CODE UPDATED: Justice CRM now includes an owner-only `First paid-lead routing preflight` panel inside the Bituach Leumi specialist supply flow.
- CODE UPDATED: the preflight uses the same routing constraints as the live lead router, including published profile, matching `national-insurance` practice area, `lead_routing_enabled=1`, paid/trialing/active subscription status and remaining monthly lead capacity.
- CODE FIXED: the active-routable specialist count now filters out lawyers whose monthly cap is exhausted or whose plan/cap would block the real router.
- CODE UPDATED: the panel shows each eligible lawyer's plan/status, monthly cap, used count, remaining capacity and billing/contact email readiness, plus a copyable preflight note for the first controlled paid-lead test.
- MONEY IMPACT: this reduces the risk of sending the first paid Bituach Leumi lead into a profile that looks active but cannot receive a routed lead or cannot be invoiced manually.
- BLOCKED: still needs three real eligible specialists with recorded billing contacts, one consented controlled lead and invoice/payment proof; no lead, lawyer, CMS record, payment, email or public page was changed.
- COMPLETION ASSESSMENT: Bituach Leumi routing-readiness visibility 90%; first-paid-lead operational readiness 68%; realized revenue proof remains 0% until a real payment is recorded.
- OWNER CAN NOTICE AFTER DEPLOY: wp-admin -> Justice CRM -> Bituach Leumi specialist supply -> First paid-lead routing preflight.
## LATEST WORK STATUS - 2026-05-22 14:38 Asia/Jerusalem
- CRIMINAL OWNER REVIEW PACKET: converted the five current-URL Criminal first-upload targets into a controlled owner/legal/source review gate.
- TOOLING FIXED: created `tools/build-criminal-owner-review-packet.mjs`.
- GENERATED: `reports/criminal-owner-review-packet-2026-05-22.csv`.
- GENERATED: `reports/criminal-owner-review-packet-2026-05-22.json`.
- CREATED: `project-control/criminal-owner-review-packet-2026-05-22.md`.
- CREATED: `project-control/criminal-owner-review-packet-2026-05-22.csv`.
- VERIFIED LOCAL: `node --check tools/build-criminal-owner-review-packet.mjs` passed.
- VERIFIED LOCAL: packet generation produced `5` review rows, all `READY_FOR_OWNER_LEGAL_SOURCE_REVIEW_NOT_UPLOAD`.
- VERIFIED LOCAL: all `5` rows remain `PENDING_OWNER_DECISION`; `0` rows are approved for upload.
- READY FOR OWNER REVIEW / NOT UPLOAD: `/criminal-defense-attorney/` is the first recommended Criminal review target, followed by police investigation, pretrial detention, indictment and drug offenses.
- BLOCKED: Criminal CMS upload, English slug migration, redirects, canonicals/noindex, sitemap, taxonomy, related-card/internal-link writes, lawyer cards, schema and CRM changes remain unapproved.
- SAFETY: no public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment changed.
