# Homepage Competitor-Aligned Strategy - 2026-05-22

Status: VERIFIED RESEARCH / STRATEGY ONLY / NO PUBLIC CHANGES

## Purpose

This document completes T244 by mapping current legal portal and directory patterns to the existing Jus-Tice homepage. It does not approve a homepage rewrite, template edit, title/H1/meta change, URL change, internal-link change, taxonomy change, CMS edit, lawyer-card edit, lead/CRM change or uPress deployment.

## Sources Reviewed

LIVE / SEARCH VERIFIED on 2026-05-22:

- Din.co.il: search result and lawyer directory result showed a lawyer-directory/search-first model with practice-area and location inputs, plus public counts around recommendations/lawyers. Source: `https://www.din.co.il/default.asp`, `https://www.din.co.il/SearchLawyer.asp?it=31`.
- PsakDin: homepage showed dense practice-area and region navigation, article/category blocks, author/date signals, legal news and video blocks. Source: `https://www.psakdin.co.il/`.
- Mishpati: homepage showed editorial article cards with author/source, date and reading time, plus lawyer-linked content. Source: `https://www.mishpati.co.il/`.
- Justia Lawyer Directory: marketing page shows free/pro/premium profile logic, practice-area/metro placements, contact/profile features, traffic stats and monthly reports. Source: `https://www.justia.com/marketing/lawyer-directory/`.

## Current Jus-Tice Homepage Stack

VERIFIED LOCAL in `front-page.php`:

1. Hero.
2. Customer intake strip.
3. Homepage intent pyramid.
4. Practice areas grid.
5. Find lawyer guide.
6. Featured lawyers.
7. LegalTech tools.
8. Lawyer CTA.
9. Latest articles.
10. Ask lawyer.
11. Trust section.
12. CTA section.

Assessment:
- The stack is already directionally correct.
- The next homepage work should not add bulk.
- The next homepage work should sharpen each section's job and remove weak/fake signals.

## Competitor Patterns To Use

| Pattern | Competitor evidence | Jus-Tice implication | Status |
|---|---|---|---|
| Search-first directory entry | Din uses practice-area and location discovery as the main front-door pattern | Keep hero/search and `/lawyers/` as the broad directory path | VERIFIED STRATEGY |
| Category and region navigation | PsakDin/Din expose many practice-area and region paths | Keep broad discovery, but use curated priority categories rather than taxonomy count | VERIFIED STRATEGY |
| Editorial proof | PsakDin/Mishpati use author/date/category/read-time style editorial cards | Replace latest-only homepage article logic with curated cluster guides when owner approves | RECOMMENDED |
| Lawyer profile value | Justia sells complete profile, professional photo, contact info, FAQs, reviews, visibility and reporting | Lawyer CTA should keep measured profile/visibility/reporting promise, not guaranteed leads | VERIFIED CURRENT DIRECTION |
| Paid visibility with clear boundaries | Justia separates free profiles from paid placements and says premium placement is visibility, not direct lead guarantee | Jus-Tice should mark paid/featured placements clearly and avoid "best/recommended" claims | MUST NOT SKIP |
| Trust through process | Israeli portals lean on articles, lawyers, categories and visible recency | Trust section should explain editorial/disclaimer/review boundaries, not generic badges | RECOMMENDED |

## Recommended Homepage Role

The homepage should be the root portal page:

- For users: problem -> legal field -> guide/profile/intake.
- For Google: brand/entity page -> controlled commercial hubs -> curated cluster pages.
- For lawyers: paid product path -> profile/onboarding -> manual approval/payment -> monthly reporting.

It should not try to become:

- A full category archive.
- A random latest-post feed.
- A fake "recommended lawyer" ranking page.
- A direct replacement for `/lawyers/`.
- A broad URL-migration tool.

## Recommended Section Refinement

| Section | Keep | Change later only with approval | Risk to avoid |
|---|---|---|---|
| Hero | Brand, problem search, directory CTA | Confirm primary CTA points to stable `/lawyers/` or filtered search | Keyword stuffing |
| Customer intake strip | Fast routing and phone/lead path | Add clear "not legal advice / no representation until agreement" microcopy if missing | Implied legal advice |
| Intent pyramid | Problem-first navigation | Tie top cards to approved cluster order: Family, Criminal, Medical, Real Estate, Traffic | Unapproved clean slugs |
| Practice areas grid | Broad discovery | Replace count-ordering with controlled business/SEO priority list | Old content volume outranking money hubs |
| Find lawyer guide | Education before contact | Keep practical selection criteria and license/review checks | "Best lawyer" claims |
| Featured lawyers | Social proof only if real/approved | Hide, limit or label until approved real profiles exist | Fake profiles/reviews |
| LegalTech tools | Conversion gateway | Keep fallback links until tool archive is verified | Promoting thin `/legal-tools/` |
| Lawyer CTA | B2B money path | Keep monthly value/reporting language and manual approval/payment boundary | Guaranteed leads or outcomes |
| Latest articles | Recency signal | Prefer curated cluster guides over chronological feed | Sending homepage weight to weak/random pages |
| Ask lawyer | Lead capture | Keep no-advice/no-representation boundary visible | Unsafe free legal advice framing |
| Trust section | Editorial/compliance clarity | Add concrete trust process: source review, lawyer verification, sponsored labeling | Generic badges |
| CTA section | Final routing | Keep consumer and lawyer CTAs separated | Mixed intent |

## Priority Recommendations

1. Do not redesign the homepage yet.
2. Keep `front-page.php` as the short-term authoritative homepage template.
3. Create a controlled homepage section QA before any visual/template change.
4. Replace taxonomy-count homepage priority with curated commercial priority when owner approves.
5. Replace latest-only article exposure with curated Family/Divorce, Criminal, Medical and Real Estate guide links after each cluster clears upload governance.
6. Keep lawyer CTA and LegalTech gateway, but avoid hard promises and unverified archive links.
7. Keep paid placement language as visibility/profile/reporting, not guaranteed leads.
8. Keep `/lawyers/` as the broad lawyer-directory target, with homepage supporting it.

## First Safe Homepage Batch

BLOCKED UNTIL OWNER APPROVAL:

1. Audit live homepage copy and rendered links against this map.
2. Confirm every section has one job and one primary outcome.
3. Prepare exact revised section copy for hero subcopy, trust/disclaimer block, curated guides, featured lawyers fallback and lawyer CTA.
4. Run desktop/mobile visual QA.
5. Execute only no-URL-change template/content edits.

NOT INCLUDED:
- URL migration.
- Redirect rules.
- Canonical/noindex/sitemap changes.
- Taxonomy edits.
- Fake lawyer/review/rating display.
- Public CMS edits.

## Decision

VERIFIED:
- Competitors validate the current Jus-Tice direction: search/discovery, legal guides, lawyer profiles, lead routing and lawyer acquisition can coexist on the homepage.

RECOMMENDED:
- Next homepage work should be a controlled refinement pass, not a new layout.

BLOCKED:
- No public homepage change is approved by this document.
