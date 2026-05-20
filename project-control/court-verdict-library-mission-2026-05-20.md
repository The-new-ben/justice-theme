# Court Verdict Library Mission
Date: 2026-05-20
Status: APPROVED DIRECTION / SAFE SOURCE PLAN

## Business Goal

Build Jus-Tice into a major Israeli legal knowledge library: practical guides, lawyer profiles, laws, forms, and a large searchable verdict/ruling library.

This is not only an SEO project. It supports three money goals:

- Users arrive through long-tail legal searches and convert into qualified calls/leads.
- Lawyers see that Jus-Tice gives them authority, exposure and content value, so they subscribe.
- Internal content teams can update commercial pages with fresh case-law proof instead of thin generic text.

## Owner Direction

The owner wants Jus-Tice to become one of the biggest available verdict resources in Israel, with systematic upload of new verdicts later.

Approved sources mentioned by the owner:

- Net HaMishpat / court.gov.il decision search:
  `https://www.court.gov.il/NGCS.Web.Site/LocateDecisions/LocateDecisionQuering.aspx`
- Court homepage:
  `https://www.court.gov.il/NGCS.Web.Site/HomePage.aspx`
- PsakDin, Nevo and Takdin as competitor/product inspiration and possible discovery references.

## Research Finding

The official court homepage currently returned an infrastructure/upgrade notice during this check. The gov.il judiciary page says that decisions of public interest are published by the court spokesperson, and that the full set of decisions, including publication-permitted copies from confidential matters such as family and youth cases, can be located through Net HaMishpat.

The safest source hierarchy is:

1. Official court / gov.il sources for source records and documents.
2. Public legal databases only as discovery and product inspiration.
3. Jus-Tice original summaries, classifications, explanations and practical lessons.

## Important Safety Rule

Court rulings can be public legal material, but competitor databases may still have protected summaries, tagging, editorial text, layout, internal taxonomy, and terms of use.

Therefore:

- Do not copy PsakDin, Nevo, Takdin, or other competitor summaries.
- Do not copy their taxonomy or product wording one-to-one.
- Do not automate competitor scraping until owner/legal review approves the method.
- Use competitors to learn product structure and find demand patterns.
- Use official sources for the actual verdict source link/document whenever possible.

This keeps Jus-Tice independent and defensible.

## MVP Scope

Start with a controlled Family Law Verdict Library because:

- Maya Rotenberg can support authority in family law.
- Family law already has strong commercial intent.
- Family rulings need the strictest privacy handling, so the workflow will be safe before expanding.

MVP pages:

- `/legal-library/`
- `/legal-library/family-law/`
- `/legal-library/family-law/verdicts/`
- individual verdict pages only after privacy/source review.

## Intake Fields

Every verdict candidate must have these fields before publication:

- source system: court.gov.il, gov.il, Nevo, Takdin, PsakDin, other
- official source URL
- document URL if available
- case number
- court
- judge / panel
- decision date
- upload/discovery date
- legal field
- subtopic
- parties/anonymized title
- publication status
- privacy risk: low / medium / high
- contains minors/family/medical/criminal-sensitive material: yes/no
- allowed for public publication: yes/no/unknown
- summary drafted by Jus-Tice: yes/no
- reviewer/lawyer authority
- connected guide page
- connected lawyer profile
- index policy: index / noindex / hold
- owner/legal approval status

## Publication Policy

Do not publish raw sensitive decisions blindly.

For each approved verdict page:

- Use a clear title that explains the legal topic, not only the case number.
- Link to the official source.
- Add an original plain-language summary.
- Add "what this means in practice" for users.
- Link to the relevant guide and lawyer profile.
- Add legal disclaimer.
- Mark uncertain or sensitive pages as `noindex` until reviewed.
- Never expose details that are prohibited, sealed, confidential, or risky around minors/family matters.

## Product Shape

The library should not be a dead archive. It should behave like a content engine:

- filter by practice area, court, judge, date and topic;
- connect verdicts to practical guides;
- connect verdicts to lawyer authority pages;
- show recent decisions in topic hubs;
- create monthly "new rulings" email/report for paid lawyers;
- give lawyers a reason to pay for content authority and exposure.

## First Implementation Path

1. Build an internal verdict intake CSV/schema.
2. Manually enter 10 family-law verdict candidates from official sources.
3. Review privacy and publication status.
4. Draft 3 original summaries connected to family-law guides.
5. Create the WordPress content type only after the schema is stable.
6. Add public archive pages only after at least 10 approved records exist.

## Completion Assessment

- Business strategy clarity: 70%.
- Source safety clarity: 65%.
- Actual verdict import system: 0%.
- Public verdict pages: 0%.
- Revenue impact today: indirect, but important. This becomes a durable SEO moat and a paid-lawyer value feature.

## Next Action

Create the intake schema and 10-record manual pilot for family law. Do not scrape competitors or bulk-import until the pilot proves the workflow.

## Linear

- `HAD-70`: Build official-source court verdict library pilot.
