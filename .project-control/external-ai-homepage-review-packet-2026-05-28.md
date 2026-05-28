# External AI homepage review packet - 2026-05-28

## Purpose

Use this packet manually in Lovable, ChatGPT, Gemini, Claude, or another supervised web account to get additional design/copy/UX critique without paid API spend or unattended login automation.

## Guardrails for reviewer

- Do not copy competitor text.
- Do not invent lawyer reviews, ratings, credentials, payments, or customer stories.
- Do not recommend public CMS/database publishing, redirects, canonicals, noindex, sitemap, taxonomy, or migration changes unless explicitly separated as owner-approval items.
- Do not rely on unsupported AI/legal-advice claims.
- Prioritize conversion to real leads and lawyer subscriptions while preserving legal safety.

## URLs to inspect

- Jus-Tice homepage: https://jus-tice.co.il/
- Jus-Tice lawyer directory: https://jus-tice.co.il/lawyers/
- din.co.il: https://www.din.co.il/
- LawReviews: https://www.lawreviews.co.il/
- LawReviews about: https://www.lawreviews.co.il/about
- Lawhive: https://lawhive.com/
- Lawhive about: https://lawhive.co.uk/about-us/
- Harvey: https://www.harvey.ai/

## Prompt

You are reviewing Jus-Tice, an Israeli Hebrew legal-help and lawyer marketplace site. The goal is to rebuild the homepage from scratch while preserving existing approved content, keywords, URLs, legal safety, and CMS connectivity. The homepage must serve two audiences:

1. Public users who need legal help and should quickly choose practice/city/contact path.
2. Lawyers who may join, manage profile/leads, and eventually pay for subscription or lead services.

Review the competitor URLs above and return:

1. The strongest copywriting mechanisms by competitor.
2. The strongest design/layout mechanisms by competitor.
3. Mobile-menu and mobile-first risks to avoid.
4. A recommended homepage section order for Jus-Tice.
5. A recommended above-the-fold hero layout for a Hebrew RTL legal marketplace.
6. Trust/proof elements that are safe to use before verified reviews/payments exist.
7. Lawyer-side monetization blocks to add without overpromising.
8. CMS data fields needed for the homepage to be maintainable.
9. CRM/payment/invoice blockers that must be solved before claiming revenue readiness.
10. A strict list of claims Jus-Tice must not make yet.

Constraints:

- Write original recommendations, not copied copy.
- No fake reviews, fake lawyers, fake counts, or fake payment proof.
- Public legal-help path must be first; lawyer revenue path should be visible but secondary.
- Use Hebrew-market assumptions where relevant.
- Keep the mobile menu stable: fixed overlay/panel, body scroll lock, visible close button, CTA-first layout.
- Return concise, actionable implementation rules.

## Required storage after use

After receiving an answer from any external tool, paste the answer into a new `.project-control/` evidence file with:

- tool used,
- date,
- prompt version,
- exact answer,
- what was accepted,
- what was rejected,
- what remains owner-approval-only.
