# Cyber / Privacy SERP And Source Review - 2026-05-11

Status: VERIFIED / REVIEW ONLY / NO URL CHANGE

## Scope

This pass adds SERP-style and source evidence to the existing cyber/privacy GSC work.

Checked query groups:
- עורך דין סייבר
- דיני סייבר
- מתקפת סייבר
- פגיעה בפרטיות
- הגנת הפרטיות
- לשון הרע באינטרנט
- שיימינג
- מחיקת מידע

This is not approval to rewrite, migrate, redirect, noindex, change canonicals, change sitemap entries, edit related content, change lawyer cards or update the CMS.

## Method

VERIFIED:
- Compared current web/SERP result patterns with the already documented GSC browser rows.
- Checked whether each query behaves like a service page, practical legal guide, technical explainer, reputation/privacy support topic or boundary topic.
- Identified official/public source anchors for privacy and data-removal topics.
- Mapped what should remain protected before any content or URL decision.

NOT VERIFIED:
- Full Google Search Console API export.
- GA4 traffic/conversion data.
- Full legal review.
- Final source list for every public legal claim.
- Owner approval for public execution.

## Main Findings

### Cyber Lawyer / Cyber Law

VERIFIED:
- The cyber-service SERP pattern supports a lawyer/service page plus practical support guides.
- Current GSC evidence is weak: `עורך דין סייבר` mapped to `/cybercrime-lawyer-roll/` with `42` impressions, while `/cyber-lawyer/` had no visible reverse-query rows in the checked pass.

Recommended planning:
- Keep `/cyber-lawyer/` as the current inventory service candidate.
- Treat `/cybercrime-lawyer-roll/`, `/cyber-laws/`, `/what-is-cyberattack/`, `/cyber-insurance/` and `/cybersex-trafficking/` as support/boundary pages until owner approval.
- Do not create `/cyber-privacy-lawyer/` yet.

### Cyberattack

VERIFIED:
- The cyberattack intent looks mostly technical, educational and business-risk oriented, not a pure lawyer-service query.
- GSC showed no visible rows for `מתקפת סייבר`.

Recommended planning:
- Keep cyberattack as support content only.
- Do not make it a primary service page.

### Privacy Injury / Privacy Protection

VERIFIED:
- GSC shows a small but real signal on the old Hebrew privacy-injury URL:
  - `פגיעה בפרטיות`: `38` impressions.
  - `הגנת הפרטיות`: `7` impressions.
- SERP/source review supports a practical support page with evidence, rights, privacy harm examples, official/public source links and lawyer-timing guidance.

Recommended planning:
- Protect the old Hebrew privacy-injury URL.
- Compare it before any rewrite, merge, redirect or English-slug migration.
- Use official/public sources from the Privacy Protection Authority and current legal text before drafting.

### Online Defamation / Shaming

VERIFIED:
- The SERP pattern mixes defamation, online reputation, content removal and compensation/service pages.
- GSC has only one weak wrong-page row for `שיימינג`, mapped to a family-law/prenup URL.

Recommended planning:
- Do not edit the prenup page for shaming.
- Keep online defamation/shaming as a separate source/SERP/legal-review item.
- Decide later whether it belongs under cyber/privacy, reputation, tort/damages or a separate defamation cluster.

### Data Deletion / Search Result Removal

VERIFIED:
- GSC showed zero visible rows for `מחיקת מידע`.
- Google documentation distinguishes removal from Google Search from removal at the original source site.
- The topic overlaps with privacy rights, online reputation, criminal records and data protection.

Recommended planning:
- Do not merge data deletion blindly into cyber/privacy.
- Keep `/police-records-data-deletion/` as a boundary page requiring criminal-record and privacy review.

## Official / Public Source Anchors

SOURCE ANCHORS IDENTIFIED:
- Privacy Protection Authority digital privacy tool and guidance: `https://mojforms.justice.gov.il/mojaemprivacyprotectionauthority/dpiaform.html`
- Privacy Protection Authority / government privacy services and Amendment 13 references: `https://www.gov.il/he/service/registration_in_the_database`
- Knesset Privacy Protection Law text candidate: `https://fs.knesset.gov.il/25/law/25_ls_bk_4300009.pdf`
- Google personal information removal guidance: `https://support.google.com/websearch/answer/9673730?hl=en`
- Google legal/privacy delisting overview: `https://support.google.com/legal/answer/10769224?hl=en`

NOT VERIFIED:
- Final official-source list for defamation, online shaming and Israeli search-removal/legal-remedy claims.
- Final citation placement inside any public article.

## Content Structure Implications

Recommended structure, planning only:

- `/cyber-lawyer/` - current service candidate after owner approval.
- `/cyber-laws/` - informational cyber law guide or support page.
- `/cybercrime-lawyer-roll/` - cybercrime/criminal boundary support.
- `/what-is-cyberattack/` - cyberattack explainer support.
- Old Hebrew privacy-injury URL - protected privacy support review item.
- `/police-records-data-deletion/` - criminal records / privacy / data deletion boundary page.
- Future online defamation/shaming page - only after source/legal review and duplicate check.

## Blocked Actions

BLOCKED:
- No public content changes.
- No title/H1/meta changes.
- No slug or URL changes.
- No 301 redirects.
- No canonical changes.
- No sitemap changes.
- No robots/noindex changes.
- No menu, taxonomy, breadcrumb, related-card or lawyer-card changes.
- No CMS writes or database changes.

## Next Safe Work

1. Build a side-by-side comparison of `/cyber-lawyer/`, `/cybercrime-lawyer-roll/`, `/cyber-laws/`, `/what-is-cyberattack/`, old privacy-injury URL and `/police-records-data-deletion/`.
2. Create a final official/public source checklist for privacy, data deletion, defamation and cybercrime claims.
3. Decide whether privacy and online reputation should be one support cluster or separate clusters.
4. Draft an internal-link plan only after primary/support roles are approved.
5. Prepare URL migration decisions only after owner approval and redirect/canonical/sitemap mapping.

## Safety

VERIFIED:
- This pass is repo documentation and CSV planning only.
- No live public site state was changed.
