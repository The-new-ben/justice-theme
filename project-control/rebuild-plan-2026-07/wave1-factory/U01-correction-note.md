# U01 CORRECTION NOTE — engineering decisions on the dry-run flags
(For Claude Cowork. Paste this into the Cowork session. All three of your
flags were correct; here are the binding decisions.)

## 1. U01 scope — proceed, do NOT block. Informational build.
`/medical-malpractice-in-the-united-states/` is NOT a service page and must
not pretend to be one. Build it as an informational overview for Israelis:
how US medical-malpractice claims work vs Israel (limitation, contingency
fees, jury awards vs Israeli court practice), when an Israeli needs a US
attorney (treatment/injury in the US, medical tourism), how to choose one
and what to ask, and what stays under Israeli law. Route every Israeli-side
matter to the pillar `/medical-malpractice-lawyer/`. The page owns the
phrase honestly as an informational query; it does not claim US
representation.

## 2. U01 secondaries — trimmed in the work order (canon updated).
Keep: `דירוג עורכי דין רשלנות רפואית`, `גילוי רשלנות רפואית מאוחרת`
(the late-discovery angle bridges naturally to the Israeli limitation
rules — link the pillar / the limitation gap page there).
Dropped: all US health-insurance shopping phrases (`ביטוח רפואי לישראלים
בארה"ב`, `ביטוח בריאות בארה"ב מחיר`, `ביטוח רשלנות מקצועית עורכי דין`) —
different intent, different page, not ours. Do not weave them in.

## 3. U01 E-E-A-T line — jurisdiction-honest override (this page only).
Replace the first line of the §6 block with:

```html
<p><strong>נכתב ונבדק על ידי עו"ד מאיה רוטנברג (מ.ר. 32125)</strong>,
עורכת דין ישראלית. הסקירה מציגה את הדין האמריקאי כרקע כללי לקוראים
בישראל ואינה ייעוץ בדין זר; לעניינים לפי הדין הישראלי ראו
<a href="/medical-malpractice-lawyer/">עורך דין רשלנות רפואית</a>.
עדכון ובדיקה משפטית אחרונה: [REVIEW-DATE].</p>
```

Rest of the block (sources list + disclaimer) unchanged. Every other unit
uses the standard §6 block verbatim.

## 4. Allowlist — `/legal-simulation/` was an omission, now fixed.
`wave1-link-allowlist.txt` (canon) now contains `/legal-simulation/` (28
URLs). Treat it as allowlisted; §4/§5 of the manual stand.

## 5. Review model — confirmed.
Attorney (Maya Rotenberg) reviews every page before publish; `[REVIEW-DATE]`
is stamped at upload after her review. Your license-block gate stays as is.

## 6. Everything else in the manual is unchanged.
Finish U01 under these corrections and stop, per the dry-run protocol. The
output comes back for the QA gauntlet before U02-U30.
