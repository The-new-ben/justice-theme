# Medical Malpractice Source / Legal Checklist

Date: 2026-05-11  
Status: VERIFIED SOURCE ANCHORS / REVIEW ONLY / NO PUBLIC CHANGES

This checklist adds source and legal-review gates for the medical-malpractice cluster before any public rewrite, CMS import, URL migration, redirect, canonical, sitemap or internal-link execution. It does not approve legal advice, medical advice, content edits, title/H1/meta changes, schema, lawyer cards, review/rating blocks or lead-form changes.

## Why This Is High Risk

Medical malpractice is both legal and medical YMYL content. A weak page can mislead users about:
- whether they have a claim,
- limitation periods,
- causation and damages,
- expert medical opinions,
- medical records and evidence,
- birth/pregnancy/surgery risks,
- whether a doctor/hospital/HMO made an error,
- what to do with sensitive health information.

Therefore, every final page must be reviewed by a qualified Israeli legal reviewer before publication.

## Source Anchors Reviewed

VERIFIED / PUBLIC SOURCE ANCHORS:
- Ministry of Health medical-malpractice information page: `https://me.health.gov.il/older-adult/services-rights/diagnoses/medical-malpractice-and-claims/medical-malpractice/`
- Kol Zchut definition page: `https://www.kolzchut.org.il/he/הגדרת_רשלנות_רפואית`
- Kol Zchut claim overview: `https://www.kolzchut.org.il/he/תביעת_רשלנות_רפואית`
- Ministry of Health second-opinion information page: `https://me.health.gov.il/older-adult/services-rights/diagnoses/second-opinion/`
- Patient Rights Law PDF copy from National Insurance: `https://www.btl.gov.il/Laws1/00_0037_000000.pdf`
- Gov.il committee on medical-treatment injury responsibility: `https://www.gov.il/he/departments/units/committee-malpractice`
- State Comptroller report page on medical-malpractice claims, insurance, risk management and disciplinary law: `https://library.mevaker.gov.il/sites/DigitalLibrary/Pages/Reports/583-10.aspx`
- Ministry of Health medical-record inspection PDF: `https://www.gov.il/BlobFolder/dynamiccollectorresultitem/insp-medicalrecords-hmo/he/files_databases_inspections_hmo_Insp_medicalrecords_hmo.pdf`

LIMITATIONS:
- These sources do not replace legal review.
- Source pages are not enough to approve damages, limitation, causation, expert-opinion or procedural claims.
- Some source pages are broad public information and should support cautious explanations, not precise legal conclusions.
- Any quotation, statutory wording or procedural deadline must be verified directly against the current official legal text before publication.

## Page / Topic Gates

### 1. Commercial Pillar - `/medical-malpractice-lawyer/`

Current issue:
- The URL has two public REST records in the owner packet.
- The visible GSC main-query row maps to a fee article, not clearly to the clean pillar.

Allowed after review:
- General explanation that medical-malpractice claims require legal and medical factual review.
- General user-intent sections: what to prepare, why records matter, why expert review may matter, what questions to ask a lawyer.

Blocked:
- Guaranteed compensation language.
- "Best", "top", "recommended" or verified-lawyer claims without a documented policy.
- Specific limitation/deadline statements without legal review.
- Medical diagnosis or treatment advice.
- Claims that a specific event is definitely malpractice.

### 2. Fee Article / Cost Intent

Current URL:
- `REFERENCE:MEDMAL-FEE-GSC-001`

Allowed after review:
- Explain that costs may include legal work, expert review, records and court/process costs in general terms.
- Link naturally to the main pillar after the primary URL is approved.

Blocked:
- Fixed fee promises.
- "No risk" or "guaranteed result" claims.
- Unverified fee tables or dated pricing without review.

### 3. Birth / Pregnancy Malpractice

Current issue:
- One old Hebrew birth-malpractice page carries GSC evidence for both birth and pregnancy malpractice.

Allowed after review:
- Separate birth injury, pregnancy monitoring, delivery management and neonatal injury as distinct intent groups.
- Explain that medical/legal review is needed before concluding malpractice.

Blocked:
- Treating every poor birth outcome as malpractice.
- Creating duplicate `/birth-malpractice/` and `/pregnancy-malpractice/` pages before the split/merge plan is approved.
- Rewriting the old Hebrew GSC-visible page without migration strategy.

### 4. Birth Injury / Cerebral Palsy Support

Current URLs:
- `/birth-injury/`
- `/birth-injury-lawyer/`
- `/birth-injury-causes/`
- `/malpractice-cerebral-palsy/`

Allowed after review:
- Support pages that explain what records and expert review may be relevant.
- Internal links back to the approved medical-malpractice pillar and birth/pregnancy parent.

Blocked:
- Medical causation claims without expert/legal review.
- Overstating the cause of cerebral palsy or birth injury.

### 5. Surgery / Anesthesia / Hospital Error

Current URLs:
- `/anesthesia-medical-malpractice/`
- `/surgical-errors-medical-malpractice/`
- `/personal-injury/medical-malpractice/surgery/`

Allowed after review:
- Separate surgery, anesthesia and hospital-system issues as support topics.
- Use cautious user-preparation sections and records/checklist framing.

Blocked:
- Surgical-risk explanations that become medical advice.
- Claims that a complication is necessarily negligent.
- Nested URL migration without redirect/canonical review.

### 6. Definition / Common Errors / Diagnosis

Current URLs:
- `/what-is-medical-malpractice-definition-examples/`
- `/medical-malpractice-common-errors-doctors-hospitals/`
- `medical-malpractice-vs-negligence-differences-israel/`

Allowed after review:
- Informational support pages that define concepts and link to the commercial pillar.
- Examples framed as possible warning signs, not conclusions.

Blocked:
- Legal tests stated as final advice without source/legal review.
- Duplicate definitions competing with the commercial pillar.

### 7. Records, Evidence, Expert Opinion And Privacy

Source anchors:
- Patient Rights Law PDF copy.
- Ministry of Health medical-record inspection PDF.
- Ministry of Health second-opinion page.
- Kol Zchut claim overview.

Allowed after review:
- General guidance that medical records, chronology and expert review can be important.
- Strong privacy warning before submitting sensitive health details.

Blocked:
- Asking users to submit confidential/sensitive medical files through unsecured forms.
- Publishing case details, reviews or testimonials that expose health information.
- Claiming an expert opinion is always required or never required without legal review.

### 8. System / Report / Background Content

Source anchors:
- Gov.il medical-treatment responsibility committee.
- State Comptroller report.

Allowed after review:
- Background content about system-level malpractice/risk-management issues.
- Use as context, not as a replacement for practical legal-service pages.

Blocked:
- Turning reports into exaggerated marketing claims.
- Using system statistics without date/source context.
- Promoting the very large report-style page as the commercial pillar by word count alone.

## Required Page-Level Disclaimers

Every public medical-malpractice page should include a visible disclaimer that:
- the information is general only,
- the page is not medical advice,
- the page is not a substitute for legal advice,
- users should not rely on the page to diagnose malpractice,
- sensitive health information should be shared only through secure/approved channels.

## Schema / Reviews / Lawyer Cards

BLOCKED:
- Do not add `AggregateRating` or review schema.
- Do not show fake reviews, fake ratings, fake "verified" badges or "top lawyer" claims.
- Do not show lawyer cards unless profile data and contact details are real and approved.
- Do not allow review/testimonial text to expose sensitive medical details.

## Next Safe Step

RECOMMENDED:
1. Build a medical-malpractice current-URL readiness queue that uses the owner packet and this source checklist.
2. Then create a current-URL internal-link map.
3. Then prepare an owner review package for the first medical-malpractice upload group.

BLOCKED:
- No public content body, title, H1, meta, URL, slug, redirect, canonical, noindex, sitemap, taxonomy, category, menu, breadcrumb, internal-link, related-card, schema, lawyer-card, review/rating, CRM, wp-admin setting or database row change was executed by this checklist.
