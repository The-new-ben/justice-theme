# Criminal Lawyer Cannibalization Note

Date: 2026-05-10

## Proposed Primary Page

- Target keyword: עורך דין פלילי
- Proposed slug: `/criminal-lawyer/`
- Page type: pillar article / commercial-informational guide
- Cluster: `criminal-law`

## Existing Overlap Found

- `https://jus-tice.co.il/criminal-prosecutions/`
  - Search result snippet indicates this page already covers criminal prosecution, arrest hearing roles, hearing before indictment and indictment process.
  - Risk: HIGH overlap with sections on indictment, prosecution and hearing.

- `https://jus-tice.co.il/סדר-דין-פלילי-חוק-המעצרים/`
  - Search result snippet indicates an older Hebrew-slug page around criminal procedure/arrests law.
  - Risk: HIGH overlap with arrest/remand sections and English-slug migration plan.

## Recommended Action

Do not publish `/criminal-lawyer/` as a duplicate without review.

Recommended sequence:

1. Import `content-drafts/criminal-lawyer-pillar-he.md` as draft only.
2. Compare the draft with existing `/criminal-prosecutions/` and the Hebrew arrests-law page.
3. Preserve any stronger old sections and add them into the pillar or supporting pages.
4. Decide canonical ownership:
   - `/criminal-lawyer/` should own lawyer-hiring + broad criminal defense guide intent.
   - `/police-investigation/` should own investigation-specific urgent intent.
   - `/pretrial-detention/` should own arrest/remand intent.
   - `/indictment/` should own post-indictment process intent.
5. Use 301 redirects only after owner approval and GSC traffic-risk review.

## Status

- Current draft: repo-only.
- Live publication: not approved.
- GSC traffic risk: UNKNOWN.
- Legal review: required before import/publish.
