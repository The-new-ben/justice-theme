# Family Law Visible Repair Field Map - 2026-05-22

Status: READY FOR OWNER REVIEW / NOT APPROVED FOR CMS EXECUTION / NO PUBLIC CHANGES

This field map translates the live diagnostics into exact current-URL repair instructions for the owner/operator. It is not permission to edit the public site. It does not authorize slug changes, redirects, canonical changes, noindex changes, sitemap changes, taxonomy edits, related-card writes, media upload, lawyer-card changes, lead/CRM changes, wp-admin setting changes or uPress deployment.

## Source Evidence

- `project-control/family-law-live-repair-diagnostics-2026-05-22.md`
- `project-control/family-law-live-repair-diagnostics-2026-05-22.csv`
- `project-control/family-law-live-repair-operator-packet-2026-05-22.md`
- `project-control/family-law-live-safety-check-2026-05-22.md`

## Repair Rules

Allowed only after owner approval and page-specific CMS rollback backup:

- Use existing live URLs only.
- Repair visible H1 structure so each page has exactly one intended H1.
- Demote extra body H1s to H2/H3 where the content still belongs on the page.
- Remove duplicate H1 blocks where the same heading is repeated.
- On `/divorce-agreement/`, remove raw shortcode text or replace it with approved rendered/static UI.
- Do not leave a PDF download CTA unless the PDF URL returns HTTP `200` with a PDF content type.

Still blocked:

- Divorce-lawyer canonical consolidation between `/divorce-lawyer/` and `/lawyer-divorce-guide-proceedings-costs-rights/`.
- Redirects, canonicals, noindex, sitemap changes and slug changes.
- Category hierarchy changes and related-content writes.
- Full Family/Divorce content upload.

## Page Field Map

| URL | Keep as intended H1 | Demote/remove | Notes |
|---|---|---|---|
| `/divorce-agreement/` | `הסכם גירושין 2025 — מדריך מלא, טופס PDF להורדה וכל מה שצריך לדעת` | Demote/remove the auto/title H1 `הסכם גירושין 2025 \| מדריך + טופס PDF להורדה \| Jus-Tice` if it remains visible as an H1. | Also fix raw `justice_pdf_download` and `justice_contact_form`; PDF CTA must be removed unless file is verified. |
| `/divorce-lawyer/` | `עורך דין גירושין: מדריך עומק לבחירה נכונה, תהליך, עלויות, ילדים ורכוש` | Remove one duplicate identical H1. | Keep URL/canonical/robots unchanged until GSC-backed canonical decision. |
| `/lawyer-divorce-guide-proceedings-costs-rights/` | `עורך דין גירושין – מדריך להליכים, עלויות, זכויות ושלבי התהליך` | Demote/remove `עורך דין גירושין \| מחירים, זכויות וייצוג 2025 \| Jus-Tice`; demote `עורך דין גירושין — מדריך מלא לשנת 2025: הליך, מחירים וזכויות` to H2 if it remains in body. | Keep URL/canonical/robots unchanged until GSC-backed canonical decision. |
| `/child-support/` | `מזונות ילדים: מדריך מעשי לפני הסכם, תביעה או שינוי מצב` | Demote `מזונות ילדים: איך בודקים צרכים, הכנסות, זמני שהות וסיכונים לפני הסכם או תביעה` to H2; demote/remove `רבני מזונות ילדים יסודות חיוב בדמי טיפול`. | The `רבני` heading looks unrelated/noisy and should be reviewed before keeping. |
| `/child-custody/` | `משמורת ילדים וזמני שהות: איך מתכננים הסדר שמתאים לילדים` | Demote `זמני שהות ואחריות הורית: מדריך להורים בגירושין בלי להפוך את הילדים לזירת מאבק` to H2. | Current URL/canonical/robots stay unchanged. |
| `/divorce-mediation/` | `גישור גירושין: מתי זה נכון, איך מתכוננים ומה חשוב לבדוק` | Demote `גישור גירושין: מתי זה מתאים, מה בודקים, כמה זה עולה ומה חשוב לא לפספס` to H2; demote `גירושין בגישור עם ילדים: הדרך הטובה להתגרש בגישור בלי לפגוע בילדים` to H2/H3. | Current URL/canonical/robots stay unchanged. |

## Agreement Page CTA/PDF Repair

Current raw shortcode context:

- `[justice_pdf_download file="divorce-agreement-template-2025.pdf" ...]`
- `[justice_contact_form type="divorce" subject="הסכם גירושין"]`

Approved repair options after owner approval:

1. Restore shortcode rendering if the plugin/template support is intended and verified.
2. Replace the PDF shortcode with a static note that the template is temporarily unavailable.
3. Upload/attach the PDF only if owner approves the file and the final URL returns HTTP `200` with PDF content type.
4. Replace the contact shortcode with a normal approved CTA/form block only if the form flow and privacy copy are verified.

Default safe option if the PDF is not ready:

> הטופס להורדה נמצא בבדיקה ועדכון. בינתיים מומלץ לא לחתום על הסכם גירושין בלי בדיקה פרטנית של עורך דין לפי נסיבות המקרה.

Do not promise a download until the file is actually live.

## Verification Required After Approved Repair

Run:

```powershell
node tools/check-family-law-live-safety.mjs --reportDate=YYYY-MM-DD
node tools/extract-family-law-live-repair-diagnostics.mjs --reportDate=YYYY-MM-DD
```

Must pass before marking visible repair complete:

- All repaired pages return HTTP `200`.
- Final paths remain unchanged.
- Canonical/robots remain unchanged unless separately approved after GSC.
- Repaired pages have exactly one intended H1.
- `/divorce-agreement/` has no raw `justice_pdf_download` or `justice_contact_form` text.
- If a PDF CTA remains, the PDF URL returns HTTP `200` with PDF content type.
- Desktop and mobile screenshots are captured after route/status checks pass.

## Safety

No public CMS page body, database row, title/H1/meta, URL slug, redirect rule, canonical setting, noindex setting, taxonomy, sitemap setting, media asset, lawyer, lead, CRM, payment, GA4/GSC setting, wp-admin setting or uPress deployment was changed.
