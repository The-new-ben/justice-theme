# Owner reputation building — the pre-E-E-A-T step

Date: 2026-06-11
Status: ACTIVE PLAN / owner executes the external steps, agents execute the on-site steps

## Why this comes BEFORE the reviewer schema

The owner decided (correctly) to hold the site-wide "reviewed by" rollout until his own
footprint exists on the open web. Marie Haynes' guidance: Google cross-checks named
authors against external sources; a reviewer whose `sameAs` links point at nothing (or
at thin profiles) adds no trust and can look fabricated. The schema engine is already
built and gated (`inc/authority.php`, `justice_theme_site_legal_reviewer()`); it stays
silent until real data is filled in.

## The footprint checklist (in order of impact)

Each item creates a REAL external URL that later goes into the reviewer `sameAs` array.

1. **Israel Bar registry profile** (israelbar.org.il → ספר עורכי הדין).
   - Verify the listing exists, name spelled exactly as it will appear on the site.
   - Copy the profile URL. This is the single most important credential link for a lawyer.
2. **Bio page on rotenberglaw.co.il** (the office site).
   - A real page: photo, admission year, practice focus, contact. The firm site is an
     independent domain confirming the identity — strong corroboration.
3. **LinkedIn profile** — completed: photo, headline "עורך דין", the office, education,
   admission year. Activity helps but completeness matters more.
4. **Google Business Profile** (if the owner takes clients directly) or presence on the
   office's GBP as a team member.
5. **One or two external directory listings** that verify lawyers (e.g. דין / פסקדין /
   Dun's, only where listing is genuinely his).
6. **2-3 bylined pieces on external sites** (גלובס/כלכליסט opinion, professional blogs,
   או אתרי משפט) — slow burn, highest authority payoff. Owner writes; agent can pitch
   topics from GSC data.
7. **Knowledge corroboration on jus-tice.co.il itself**: the `/legal-editor/` bio page
   (built by agent when activated) linking out to items 1-3.

## What the agent does once items 1-3 exist

Single push, already coded and waiting:
- Fill `justice_theme_site_legal_reviewer()` with the real name, bar number, admission
  year, law school, profile URL, and the verified sameAs URLs.
- The site-wide `reviewedBy` + visible byline activates automatically (the honesty guard
  flips when name + bar number are present).
- Build `/legal-editor/` bio page + `/editorial-policy/` page.
- Decision already leaning (owner to confirm): reviewer on the 7 pure-law clusters only;
  non-law clusters (intl real estate, crypto lifestyle) stay `author = editorial team`.

## Maya Rotenberg

- Stays the family-law expert reviewer (already live for connected articles).
- Her bar number `32125` appears in a gated legacy file with a source comment; NOT used
  anywhere live. Needs her confirmation before any live use.

## Sharon Nahari

- Client of the site (directory lawyer), per owner: keep as DRAFT, not active.
- Never appears in author/reviewer schema (fabricated entry was removed 2026-06-09).
- `justice_lawyer` profile stays unpublished until owner flips it.
