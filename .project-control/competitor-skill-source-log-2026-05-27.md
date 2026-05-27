# Competitor Skill Source Log

Date: 2026-05-27
Scope: homepage/index UX, legal marketplace copywriting, mobile-menu stability, revenue-facing lead paths.

## Sources Checked

- din.co.il homepage/search result snapshot: `https://www.din.co.il/`
- din.co.il sitemap/search result snapshot: `https://www.din.co.il/sitemap/`
- LawReviews homepage: `https://www.lawreviews.co.il/`
- LawReviews about page: `https://www.lawreviews.co.il/about`
- Lawhive homepage: `https://lawhive.com/`
- Lawhive about page/search result snapshot: `https://lawhive.co.uk/about-us`
- Enloya homepage: `https://www.enloya.com/`
- W3C ARIA modal dialog pattern: `https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/`
- Mobile-menu/accessibility UX searches around fixed close buttons, focus return, overlay behavior, and tap-target stability.

## Extracted Mechanisms

### Legal Marketplace Homepage

- Lead with user intent: field, city/area, and simple legal-help action before internal product language.
- Treat the homepage as a lawyer index plus education hub: popular practice areas, city/service routes, lawyer profiles, trust proof, and long-form guidance on choosing a lawyer.
- Use real review/profile proof only when available. Do not fabricate ratings, counts, testimonials, or verified-lawyer claims.
- Explain what happens after inquiry: who receives the request, what the user should prepare, how follow-up works, and what is not guaranteed.
- Keep lawyer-side monetization visible but secondary: profile, exposure, plans, dashboard, and manual invoice path while payment KYC is blocked.

### Copywriting

- Start with the user's situation: what happened, in which field, in which city, how urgent it is.
- Use short Hebrew sentences and concrete verbs.
- Avoid platform-first headlines, invented superlatives, and legal promises.
- Preserve and enrich "how to choose a lawyer" as homepage SEO support for `עורך דין` and `עורכי דין`, without turning the homepage into a narrow practice page.

### Mobile Menu

- The open/close control must be stable. If the button changes to fixed positioning, freeze the measured location before the overlay opens.
- Overlay should lock body scroll, avoid horizontal overflow, expose WhatsApp/phone/form CTAs, and keep lawyer CTAs secondary.
- Escape should close the menu; future pass should also improve focus management and return focus to the trigger.

## Skill Updates Made

- Updated skill reference: `C:\Users\janana\.codex\skills\justice-competitor-homepage-copy-design\references\competitor-patterns.md`
- Added anti-jump rule: freeze measured `top`, `left`, `width`, and `height` before opening a fixed mobile-menu toggle; do not rely on RTL `inset-inline-end` for the close button.
- Validation: `Skill is valid!`

## Applied To Site Code

- Commit `594a1914 Fix mobile menu toggle stability`
- Files changed:
  - `assets/js/navigation.js`
  - `assets/css/premium-pass-4.css`
  - `functions.php`
  - `inc/enqueue.php`
- New expected live marker: `2026-05-27-mobile-menu-stable-toggle-v1`
- New expected theme version: `1.1.67`

## Deployment Status

- Pushed to `codex/live-homepage-conversion-release`.
- Pushed to `main`.
- Live site still serves marker `2026-05-27-footer-trust-path-v1`, so the fix is not live yet.
- Handoff artifact: `.project-control/upress-mobile-menu-deploy-handoff-2026-05-27.md`

## Tools Actually Used

- Local repo inspection and code editing.
- Web search/direct page checks for competitor and UX sources.
- Skill validation script.
- Live deploy marker checker.
- Chrome extension connection test.

## Tools Not Actually Used Yet

- Lovable: not used in this pass because Chrome extension control is still unavailable.
- ChatGPT/Gemini/Claude via browser: not used in this pass because Chrome extension control is still unavailable.
- Paid LLM APIs: not used.
- Payment test: not run in this pass; Grow/Meshulam and safe payment-test path still need a dedicated verified flow.

## Honesty Statement

This pass produced a code fix, a reusable skill update, and a deploy handoff. It did not publish the mobile-menu fix to the live site, did not rebuild the homepage, did not create a customer/lead/payment/invoice, and did not use Lovable/ChatGPT/Gemini/Claude through browser sessions.
