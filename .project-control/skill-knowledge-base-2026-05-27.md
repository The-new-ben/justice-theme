# Jus-Tice Skill Knowledge Base

Date: 2026-05-27
Status: Active project standard, internal only until owner approves public deployment changes.

## What Was Installed

Official OpenAI curated skills installed into `C:\Users\janana\.codex\skills`:

1. `figma`
2. `figma-create-design-system-rules`
3. `figma-implement-design`
4. `playwright`
5. `screenshot`
6. `security-best-practices`

WordPress agent skills installed from `https://github.com/WordPress/agent-skills` branch `trunk`:

1. `wordpress-router`
2. `wp-project-triage`
3. `wp-block-themes`
4. `wp-plugin-development`
5. `wp-performance`
6. `wp-wpcli-and-ops`
7. `wp-rest-api`
8. `wpds`

Note: Codex must be restarted before newly installed skills become automatically discoverable in future sessions. I can still use the knowledge manually by reading the installed files.

## Sources Checked

1. WordPress Agent Skills: `https://github.com/WordPress/agent-skills`
   - Reason: WordPress-focused skills for repo triage, block themes, plugin development, REST, WP-CLI, performance and WordPress design system.
   - Project use: baseline for theme/plugin work, admin UI, performance checks and WordPress-native patterns.

2. WordPress Theme Developer Handbook: `https://developer.wordpress.org/themes/`
   - Reason: canonical WordPress source for classic and block theme development.
   - Project use: keep template/header/footer/theme changes aligned with WordPress theme rules and template structure.

3. WordPress Accessibility guidance: `https://developer.wordpress.org/themes/classic-themes/functionality/accessibility/`
   - Reason: official minimum expectations for accessible theme behavior.
   - Project use: focus states, keyboard menus, form labels, semantic headings, skip links, descriptive links.

4. WooCommerce Payment Gateway docs: `https://developer.woocommerce.com/docs/apis/rest-api/v2/payment-gateways/`
   - Reason: payment gateways need sandbox/live separation, logging and verification controls.
   - Project use: do not count revenue unless invoice/payment evidence exists; keep sandbox/live explicit.

5. Google Search Central Breadcrumb structured data: `https://developers.google.com/search/docs/appearance/structured-data/breadcrumb`
   - Reason: canonical source for breadcrumb structured data eligibility.
   - Project use: every major content template should expose human breadcrumbs and valid structured data where appropriate.

6. Google SEO Starter Guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
   - Reason: canonical source for basic crawl/index/content guidance.
   - Project use: human-readable titles, helpful content, descriptive links, no duplicate pages competing for one intent.

7. Vaquill awesome legaltech: `https://github.com/Vaquill-AI/awesome-legaltech`
   - Reason: curated legaltech landscape, APIs, legal AI models, MCP servers, platforms and practice-management categories.
   - Project use: supplier/customer/legal marketplace ideas must be mapped to real categories and not invented from nowhere.

8. Codex SEO skill suite candidate: `https://github.com/AgriciDaniel/codex-seo`
   - Reason: broad SEO workflows including technical SEO, schema, local SEO, GSC and ecommerce SEO.
   - Project decision: researched but not installed yet because it references DataForSEO, Gemini, Firecrawl and other integrations that may create paid API or credential risk. It can be audited before installation if owner explicitly wants that risk.

9. Agent Skills for Legal: `https://agentskills.legal/`
   - Reason: legal-domain skill directory.
   - Project decision: logged as a research source, not installed yet because legal advice, jurisdiction and provenance standards must be reviewed before use on a public Israeli legal site.

## Minimum Standard For Every Future Jus-Tice Page

### 1. Business Gate

Every page must answer:

1. Who is this page for?
2. What urgent legal problem does it solve?
3. What action should the visitor take now?
4. Which lawyer, supplier or internal owner path can monetize it?
5. What proof is missing before it can be counted as revenue?

Revenue status labels:

1. `Traffic only`: no contact action or no suitable provider path.
2. `Lead ready`: clear WhatsApp/form/call path and owner can contact the client.
3. `Provider ready`: paid or approved lawyer/supplier exists.
4. `Billable`: consent, fit, terms and invoice path are ready.
5. `Paid`: payment evidence exists. No evidence means not paid.

### 2. Content And SEO Gate

Minimum page rules:

1. One primary search intent per URL.
2. H1 must match the page promise, not a vague marketing slogan.
3. Simple practice/local pages target 3,000 to 4,000 Hebrew words unless the owner approves a thinner utility page.
4. Pillar pages should be deeper than simple pages and include subtopic navigation, FAQs, examples, process, risks, local context and clear next steps.
5. No new or updated page moves forward without an anti-cannibalization check against similar URLs, synonyms and associated pages.
6. Human language first. No AI-looking filler, no generic legal disclaimers replacing useful guidance, no large decorative dashes.
7. Include internal links up to the parent pillar, sibling/supporting pages and conversion route.
8. Include breadcrumbs in UI and structured data where the template supports it.

### 3. Theme And UI Gate

Every public-facing page should include:

1. Header with visible brand, primary navigation, mobile menu, search/find lawyer route and contact/WhatsApp action.
2. Skip link and keyboard-usable menu controls.
3. Breadcrumbs below the header on inner pages.
4. Above-the-fold answer to the visitor problem, not only lawyer marketing.
5. A side or inline conversion panel that lets the visitor ask for help without hunting.
6. Clear section hierarchy: H2 for major questions, H3 for concrete details.
7. Footer with legal areas, cities, lawyer onboarding, contact, privacy/terms and trust signals.
8. Mobile QA: no overlapping text, no hidden CTAs, no menu trap.

### 4. Payments And WooCommerce Gate

Until Grow/Meshulam KYC and a verified payment path are complete, payment is a blocker.

Payment standard:

1. Separate sandbox/test and live mode.
2. Log gateway events during testing.
3. Keep invoice/reference unique.
4. Never mark a lead/order/subscription as paid without payment evidence URL or gateway evidence.
5. For manual invoice fallback, mark only `invoice_sent` until evidence exists.
6. Do not route client PII to a lawyer/supplier before consent, accepted terms and owner release.

### 5. Lead And Supplier Gate

Every lead-producing page must define:

1. Lead source surface.
2. Legal area.
3. City or national scope.
4. Required consent text.
5. First owner action.
6. Provider fit path.
7. Billing readiness.
8. Follow-up state.

Current CRM standard now live:

1. Public homepage leads are tagged for revenue triage.
2. Admin lead list shows revenue status and next action.
3. Admin lead list has quick contact links.
4. Admin lead list can mark first contact attempt directly from the list.

### 6. Legal Safety Gate

Every legal page must:

1. Address the public, not only lawyers.
2. Avoid promising legal outcomes.
3. Separate general information from legal advice.
4. Use Israeli legal context when relevant.
5. Use reviewed sources for legal claims.
6. Flag content that requires lawyer review before publication.

## Honesty Statement

What I did:

1. Installed official OpenAI skills relevant to design, testing and security.
2. Installed WordPress agent skills relevant to theme, plugin, performance, REST, WP-CLI and design system work.
3. Researched legaltech and SEO skill sources.
4. Created a Jus-Tice-specific minimum standard from those sources.

What I did not do:

1. I did not install every random SEO/legal skill found on the internet because some require paid APIs, credentials or legal-domain review.
2. I did not publish a new public page from this standard because the standing instruction forbids new public CMS publication without explicit approval.
3. I did not use Lovable, Claude Code, Gemini or ChatGPT web accounts in this cycle because no safe authenticated connector is available here for those accounts, and unattended login automation is not allowed.
4. I did not create revenue. I created infrastructure that reduces time from lead arrival to first owner action.

## Next Application Targets

1. Apply this standard to the homepage header/footer/mobile menu and conversion sections.
2. Apply it to one narrow practice/local page as a proof page.
3. Add a content QA checklist that fails pages under the 3,000 to 4,000 word simple-page standard unless they are utility pages.
4. Add a live payment readiness checklist for Grow/Meshulam, manual invoice fallback and future WooCommerce subscriptions.
5. Map legaltech supplier categories from Vaquill awesome-legaltech into Jus-Tice supplier/customer connection ideas.
