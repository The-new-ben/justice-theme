# GSC Cyber / Privacy / National Insurance Gap Pass - 2026-05-11

Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGE

## Scope

This pass used the Google Search Console browser UI for the URL-prefix property `https://jus-tice.co.il/`.

Checked:
- Last 3 months.
- Performance > Search results.
- Query-to-page checks:
  - `עורך דין סייבר`
  - `דיני סייבר`
  - `עורך דין פרטיות`
  - `עורך דין ביטוח לאומי`
  - `ביטוח לאומי`
  - `ועדה רפואית ביטוח לאומי`
  - `קצבת נכות`
- Page-to-query checks:
  - `https://jus-tice.co.il/cyber-lawyer/`
  - `https://jus-tice.co.il/practice-areas/national-insurance/`

Evidence files:
- `project-control/gsc-cyber-national-gap-pass-2026-05-11.csv`
- `project-control/visual-evidence/gsc-gap-query-cyber-lawyer-2026-05-11.png`
- `project-control/visual-evidence/gsc-gap-query-privacy-lawyer-2026-05-11.png`

Screenshot limitation:
- BLOCKED: after the cyber/privacy screenshots, GSC screenshot capture timed out for national-insurance rows. Text metrics and table rows were still visible and recorded from the browser UI.

## Verified Findings

### Cyber / Privacy

VERIFIED: `עורך דין סייבר` has a weak visible signal.

Rows:
- `/cybercrime-lawyer-roll/` - `0` clicks, `42` impressions, CTR `0%`, position `71.6`.

Interpretation:
- The intended current service candidate `/cyber-lawyer/` did not appear for this visible query row.
- `/cybercrime-lawyer-roll/` should be treated as a support/review URL, not automatically as the primary.
- This is a weak-primary-page signal and supports the need for internal-link/title/content review later.

VERIFIED_ZERO_ROWS:
- `דיני סייבר` returned no visible rows.
- `עורך דין פרטיות` returned no visible rows.
- Reverse page check for `/cyber-lawyer/` returned no visible rows.

Interpretation:
- `/cyber-lawyer/` remains the best current inventory candidate, but it is not GSC-proven in this pass.
- `/cyber-privacy-lawyer/` remains strategic only.
- No cyber/privacy URL, title, H1, content body, redirect, canonical, sitemap, related-card or CMS change is approved.

### National Insurance

VERIFIED_ZERO_ROWS:
- `עורך דין ביטוח לאומי` returned no visible rows.
- `ועדה רפואית ביטוח לאומי` returned no visible rows.
- Reverse page check for `/practice-areas/national-insurance/` returned no visible rows.

VERIFIED_LOW_SAMPLE:
- `ביטוח לאומי` returned `0` clicks and `2` impressions:
  - `/returning-resident-rights-determining-tax-rate/` - `1` impression, position `62.0`.
  - `/psakdin/צו-הורות-מכוח-זיקה-לזיקה-לאזרחית-זרה/` - `1` impression, position `82.0`.
- `קצבת נכות` returned `0` clicks and `1` impression:
  - `/cerebral-palsy-rights/` - `1` impression, position `76.0`.

Interpretation:
- There is no verified current lawyer-service signal for national insurance.
- The existing empty practice-area hub has no visible GSC rows.
- Broad national-insurance and disability-benefit terms show only tiny wrong-page or boundary signals.
- `/national-insurance-lawyer/` must remain a strategic future slug only until content, source/legal review, SERP review and owner approval are complete.

## Recommended Actions

CYBER:
- Keep `/cyber-lawyer/` as current inventory candidate only.
- Review `/cybercrime-lawyer-roll/` as a possible support page that should eventually link to the approved cyber service page.
- Keep privacy-lawyer and cyber-law guide decisions NOT VERIFIED from GSC alone.
- Do not create `/cyber-privacy-lawyer/` yet.

NATIONAL INSURANCE:
- Keep `/practice-areas/national-insurance/` as an empty hub candidate only.
- Keep `/national-insurance-lawyer/` as a strategic future slug only.
- Do not redirect the old calculator to `/national-insurance-lawyer/`.
- Treat medical committee, disability benefit and calculator/tool pages as source/legal review opportunities, not proven current GSC assets.

BLOCKED:
- No title/H1/meta edits.
- No public content rewrites.
- No URL changes.
- No redirects.
- No canonical/noindex/sitemap changes.
- No taxonomy/menu/related-card/lawyer-card/CRM/review/CMS writes.

## Next Step

Fold these findings into:
- `project-control/cyber-privacy-owner-approval-packet.md`
- `project-control/national-insurance-owner-approval-packet.md`
- `project-control/gsc-keyword-page-map.csv`
- `project-control/gsc-cannibalization-review.csv`
- `project-control/gsc-content-priorities.csv`

Then continue with remaining cyber/privacy support terms such as privacy invasion, defamation, data deletion and shaming, or begin homepage line-by-line SEO/design alignment using the already verified homepage GSC evidence.
