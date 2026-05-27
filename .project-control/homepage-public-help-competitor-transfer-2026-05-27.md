# Homepage public-help competitor transfer - 2026-05-27

Status: INTERNAL_IMPLEMENTED_IN_THEME_NOT_DEPLOYED

## Project-manager check

Active goal: make the homepage feel like a legal-help entry point for the public while keeping lawyer monetization visible but secondary.

Revenue connection: stronger public trust and clearer issue routing should improve lead submission quality, especially for Bituach Leumi and other urgent/intake-friendly categories. This does not create revenue by itself.

Readiness to profit: public-copy/theme readiness 85%, live deployment 0% until uPress Pull Git, paid revenue 0% until a real accepted partner, consented lead, invoice/payment proof and owner release exist.

## Competitor signals checked

| Source | What they do on the first interaction | Useful transfer for Jus-Tice | What not to copy |
|---|---|---|---|
| https://www.myattorney.co.il/ | Opens with finding an attorney and legal information, then search by area and city. | Keep search obvious but add more human situation text before lawyer cards. | Do not lead with generic "recommended lawyer" language or unverifiable testimonials. |
| https://advocato.co.il/ | Uses broad attorney search, practice categories and tools. | Keep categories scannable and add plain-language paths from problem to action. | Do not overpromise ratings or recommendations unless evidence exists. |
| https://www.ilaw.co.il/ | Lists major legal categories and has a "find me a lawyer" path. | Keep major categories near the top, but explain what the person should prepare. | Do not make the homepage only a directory. |
| https://www.mishpati.co.il/find-lawyer | Separates search by field/location from search by lawyer or firm name. | Keep field/city/name search structure clear. | Do not bury the public help path under directory mechanics. |
| https://www.isralawyer.co.il/ | Gives quick navigation: documents, find attorney, personal consultation, articles. | Add stronger "what to do next" language and keep documents/guides visible. | Do not push a consultation form before the visitor understands the issue. |
| https://jus-tice.co.il/ | Current live homepage already has search and a disclaimer, but still reads partly like a directory. | Make the hero more public-first and remove internal SEO wording from visible copy. | Do not expose internal Google/SEO/revenue logic to users. |

## Implemented local theme change

Files changed:

- `template-parts/sections/hero.php`
- `template-parts/sections/homepage-intent-pyramid.php`

Visible copy changes:

- H1 changed from lawyer-search framing to "what happened to you now" framing.
- Hero paragraph now mentions real visitor situations: Bituach Leumi letter, investigation summons, family dispute, accident, dismissal and unclear contract.
- Three trust/action signals now explain how to describe the problem, what to check before contacting a lawyer, and when to move to a lawyer.
- Primary CTA changed from direct "find a lawyer" wording to a softer "check the next step" wording.
- Removed the visible arrow sign from "all fields".
- Removed visible Google/SEO language from the homepage intent section and replaced it with public-facing help language.

## Guardrails

- No choosing-lawyer guide content was changed.
- No CMS/database/public page publication was performed.
- No redirects, canonicals, noindex, sitemap or taxonomy changes were made.
- No paid LLM API was used.
- Lovable was requested by the owner, but no active Lovable tool was available in this Codex session. No Lovable output is being claimed.
- The change is in Git only until the owner-approved deployment path is available.

## Next owner-visible action

After code verification and push, this still needs uPress Pull Git for the live site to change. Until then, the owner can only see it in Git, not on the public homepage.
