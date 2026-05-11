# GSC Homepage And Lawyer Directory Evidence Pass - 2026-05-11

Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGE

## Scope

This pass used the Google Search Console browser UI for the URL-prefix property `https://jus-tice.co.il/`.

Checked:
- Last 3 months.
- Performance > Search results.
- Homepage page-to-query check: page filter `https://jus-tice.co.il/`, Queries tab.
- Lawyer directory page-to-query check: page filter `https://jus-tice.co.il/lawyers/`, Queries tab.
- Broad query-to-page checks:
  - `עורך דין`
  - `עורכי דין`
  - `מציאת עורך דין`

Evidence files:
- `project-control/gsc-homepage-directory-page-query-pass-2026-05-11.csv`
- `project-control/visual-evidence/gsc-homepage-page-query-2026-05-11.png`
- `project-control/visual-evidence/gsc-lawyers-page-query-2026-05-11.png`
- `project-control/visual-evidence/gsc-query-lawyer-singular-pages-2026-05-11.png`
- `project-control/visual-evidence/gsc-query-lawyers-plural-pages-2026-05-11.png`
- `project-control/visual-evidence/gsc-query-find-lawyer-pages-2026-05-11.png`

## Verified Findings

VERIFIED: the homepage has real broad lawyer/directory/legal-help visibility.

Homepage page-to-query totals:
- Clicks: `26`
- Impressions: `5,459`
- CTR: `0.5%`
- Average position: `17.1`

Top homepage queries include:
- `חיפוש עורך דין לפי שם` - `3` clicks, `595` impressions, position `8.3`.
- `ייעוץ עורך דין אונליין חינם` - `3` clicks, `83` impressions, position `10.9`.
- `חיפוש עורכי דין` - `2` clicks, `279` impressions, position `10.1`.
- `איתור עורך דין` - `1` click, `348` impressions, position `7.2`.
- `חיפוש עורך דין` - `1` click, `230` impressions, position `8.2`.
- `מציאת עורך דין` - `1` click, `34` impressions, position `7.2`.
- `אינדקס עורכי דין בישראל` - `0` clicks, `98` impressions, position `6.8`.
- `אינדקס עורכי דין בחינם` - `0` clicks, `97` impressions, position `5.0`.
- `פורטל עורכי דין` - `0` clicks, `40` impressions, position `11.0`.

VERIFIED: `/lawyers/` returned no visible GSC rows in the page-to-query check.

`/lawyers/` page-to-query totals:
- Clicks: `0`
- Impressions: `0`
- CTR: `0%`
- Average position: `0`
- Visible table: `No data`

This does not mean the directory has no business value. It means Google is currently not associating measurable last-3-month query visibility with that URL in this browser check.

VERIFIED: broad singular `עורך דין` maps primarily to the homepage by clicks, but many non-homepage URLs receive impressions.

Query contains `עורך דין`:
- Total: `9` clicks, `10.2K` impressions, CTR `0.1%`, average position `50.5`.
- Homepage: `9` clicks, `2,004` impressions, position `14.0`.
- `/real-estate-lawyer-cost-2025/`: `0` clicks, `2,327` impressions, position `64.6`.
- Old Hebrew divorce lawyer URL: `0` clicks, `1,571` impressions, position `65.6`.
- Old medical-malpractice birth URL: `0` clicks, `1,235` impressions, position `52.8`.
- `/prenup-attorney/`: `0` clicks, `768` impressions, position `53.0`.
- `/continuous-power-of-attorney-israel/`: `0` clicks, `523` impressions, position `67.5`.

VERIFIED: plural `עורכי דין` also maps primarily to the homepage, not `/lawyers/`.

Query contains `עורכי דין`:
- Total: `4` clicks, `2.43K` impressions, CTR `0.2%`, average position `29.5`.
- Homepage: `3` clicks, `1,228` impressions, position `16.6`.
- `/legal-courses-for-lawyers/`: `1` click, `35` impressions, position `31.2`.
- Online reputation article for lawyers: `0` clicks, `529` impressions, position `17.4`.
- Several B2B/practice articles appear weakly.

VERIFIED: `מציאת עורך דין` maps only to the homepage in the visible row.

Query contains `מציאת עורך דין`:
- Homepage: `1` click, `34` impressions, CTR `2.9%`, position `7.2`.

## Interpretation

REVIEW: the homepage is currently the de facto broad lawyer/search/directory entry page.

This supports the current homepage strategy:
- legal portal identity,
- find-a-lawyer entry,
- lawyer directory entry,
- practice-area hub links,
- legal information/library entry,
- lead/intake CTA,
- lawyer onboarding CTA.

REVIEW: `/lawyers/` should not be treated as the current proven primary SEO URL for broad lawyer-directory intent yet.

Before pushing `/lawyers/` harder, review:
- indexability,
- title and H1,
- sitemap inclusion,
- homepage/header/footer links,
- internal anchor text,
- whether the archive has enough real lawyer profiles,
- whether empty/demo states reduce trust,
- whether filters create crawl/index bloat.

REVIEW: broad lawyer queries are scattered across many old practice and support URLs.

This is not automatic cannibalization, but it is a weak-primary-page pattern:
- the homepage gets the clicks,
- many old/support pages get broad impressions,
- `/lawyers/` is not visible,
- practice pages should eventually link back up to the correct pillar/directory path.

## Recommended Actions

KEEP_AS_PRIMARY for now:
- Homepage as broad legal portal / lawyer-finding entry.

NEEDS_INTERNAL_LINKING:
- Homepage -> `/lawyers/`
- Homepage -> major practice pillars.
- Practice pillars -> relevant lawyer directory/filter entry only after filter-indexing rules are approved.

NEEDS_TITLE_H1_REVIEW:
- Homepage title/H1 should support legal portal and find-a-lawyer intent without keyword stuffing.
- `/lawyers/` title/H1 should be reviewed only after checking indexability, sitemap and visible content depth.

NEEDS_CONTENT_EXPANSION:
- Homepage should explain the platform, legal fields, lawyer matching, legal information library and trust model.
- `/lawyers/` needs enough real, credible lawyer inventory to justify search visibility.

NEEDS_COMPLIANCE_REVIEW:
- Terms like `מומלץ`, `המלצות`, `אינדקס בחינם`, and consultation/free-lawyer language require careful claims and review/reputation policy.

BLOCKED:
- No URL changes.
- No redirects.
- No title/H1/meta edits.
- No homepage rewrite.
- No `/lawyers/` indexing decision.
- No sitemap/canonical/menu/taxonomy changes.
- No fake reviews, ratings, recommendations or lawyer-card claims.

## Next Step

Run the next GSC evidence pass for:
- `/cyber-lawyer/` page-to-query.
- `עורך דין סייבר`.
- `דיני סייבר`.
- `עורך דין פרטיות`.
- national-insurance lawyer and the empty national-insurance hub.

The homepage/directory findings should then feed into `project-control/homepage-seo-design-alignment.md`, but no public homepage or directory change should be made until the broader content architecture map is approved.
