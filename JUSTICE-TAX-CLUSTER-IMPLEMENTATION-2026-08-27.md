# Justice tax cluster — implementation brief

Date: 2026-08-27
Status: repository owner corrected; content and Production pending expert review

## Sharp decision

1. Make `/tax-lawyer/` the canonical owner for the broad `tax` journey.
2. Do not create `/real-estate-tax-advisor/`.
3. Build `/real-estate-tax-israel/` as the real-estate-tax sub-pillar under the
   existing `real-estate` cluster.
4. Keep `/land-appreciation-tax/` as the focused capital-gains-tax spoke.
5. Hold `/tax-lawyer-israel/`; do not 410 or redirect it now. It has 110 recent
   impressions and first needs a unique purpose or an evidence-gated retirement
   decision.
6. Keep the international-tax, returning-resident, Tax Authority and provider
   comparison pages as spokes linking contextually to `/tax-lawyer/`.

The research and complete claim ledger are in
`research/justice-tax-pillar-2026-08-27/report-source.md`.

## Why this is the right architecture

The old owner name promised real-estate tax while its spokes answered unrelated
international and authority questions. That sends contradictory relevance
signals to readers, internal links and retrieval systems. One owner per distinct
job creates a clean hierarchy:

```text
Tax law
└── /tax-lawyer/
    ├── returning residents
    ├── international tax
    ├── dealing with the Tax Authority
    ├── tax-law-firm discovery
    └── legal tax-planning guide

Real estate law
└── /articles/real-estate-attorney/
    └── /real-estate-tax-israel/
        ├── /land-appreciation-tax/
        ├── purchase tax
        ├── exemptions and reliefs
        ├── reporting and documents
        └── assessment, correction and objection
```

The broad tax owner connects naturally to the product scenario
`tax-review-preparation`: organize the issue, evidence, people, dates and open
questions before a professional review. The real-estate-tax sub-pillar can offer
a narrower pre-transaction checklist without pretending to calculate a binding
tax result.

## Page-by-page execution

| URL | Action now | Target intent | Why | Measurement cadence |
|---|---|---|---|---|
| `/tax-lawyer/` | keep, rewrite and strengthen | עורך דין מיסים / ייצוג ותכנון מס בישראל | live broad asset; best semantic match for current spokes | weekly 8 weeks, then monthly |
| `/real-estate-tax-israel/` | keep, expand from 165 words into a real sub-pillar | מיסוי מקרקעין, מס שבח ומס רכישה | exact transactional intent; currently too thin to satisfy it | weekly 8 weeks, then monthly |
| `/land-appreciation-tax/` | keep, clarify and link both ways | מס שבח וחישוב/פטורים | 13,238 historical impressions; specialized job | monthly |
| `/tax-lawyer-israel/` | hold and differentiate | “מתי צריך עורך דין מיסים” decision page, only if made genuinely unique | 110 recent impressions; deletion is unsafe now | review after 8–12 weeks |
| `/top-global-tax-cpa-firms/` | keep, improve disclosure/methodology, link to owner | comparison/provider discovery | 41 clicks and 12,663 impressions | monthly |
| `/top-international-tax-law-firms/` | keep, clarify lawyer-vs-accountant need | international provider discovery | distinct professional selection intent | monthly |
| `/israel-tax-authority/` | keep, clarify official navigation vs representation | working with the Tax Authority | 17 clicks and 10,815 impressions | monthly |
| `/returning-resident-rights-determining-tax-rate/` | keep/protect, update expert review | returning-resident tax | 11 clicks and 12,171 impressions | monthly plus law-change review |
| `/legal-tax-saving-guide/` | keep/protect, rename away from guarantees | lawful planning and document preparation | 10 historical clicks; risky wording if it implies guaranteed savings | quarterly |

## `/tax-lawyer/` content specification

### Search promise

**Proposed title:** `עורך דין מיסים בישראל: תכנון, ייצוג והכנה מול רשות המסים | Jus-Tice`

**Proposed H1:** `עורך דין מיסים: מתי צריך ליווי משפטי ואיך מתכוננים נכון`

**Meta direction:** distinguish planning before an action, handling an existing
assessment/dispute, international/returning-resident questions and source-safe
preparation for professional review. Do not promise a result or quote volatile
tax rates in the description.

### Required sections

1. A 60-second decision panel: “planning”, “reporting”, “assessment received”,
   “objection/dispute”, “international/returning resident”.
2. What a tax lawyer does, what an accountant/tax adviser does, where roles can
   overlap, and when a combined team is appropriate.
3. A problem-to-professional matrix: transaction planning, civil assessment,
   objection, investigation/criminal exposure, international tax, returning
   resident.
4. Before contacting a professional: documents, dates, prior filings,
   correspondence, calculations and unresolved questions.
5. Process timeline using only verified official deadlines, each with source and
   “last substantively reviewed” date.
6. Common failure modes: signing/filing first and asking later; missing a
   deadline; relying on a calculator as a determination; hiding contradictory
   documents; confusing Tax Authority assessment with Israel Land Authority
   valuation.
7. Original Justice utility: a private preparation checklist that starts a
   Matter without putting facts in the cross-domain URL.
8. `tax-review-preparation` simulation: rehearse how to present chronology,
   source documents, uncertain facts and professional questions. It must never
   predict a legal outcome or manufacture a source.
9. Professional action: find a tax lawyer or submit a consented, attributable
   request after useful preparation.
10. Author, licensed expert reviewer, review date, method and official sources.

## `/real-estate-tax-israel/` content specification

**Proposed title:** `מיסוי מקרקעין בישראל: מס שבח, מס רכישה, דיווח ובדיקות לפני עסקה`

**Proposed H1:** `מיסוי מקרקעין לפני קנייה או מכירה: מפת החלטה ומסמכים`

The page should answer a transaction-stage job, not imitate a law textbook:

1. buyer/seller selector;
2. asset and ownership context: residential, additional dwelling, land,
   inheritance/gift, company/business inventory, foreign resident;
3. purchase tax versus appreciation tax, with no universal rate claim;
4. pre-signing questions and documents;
5. official 30-day declaration workflow and forms;
6. self-assessment, payment/registration approval, correction, objection and
   when a deadline makes the matter urgent;
7. contextual links to the detailed appreciation-tax page and official tools;
8. a preparation CTA plus a professional-review CTA.

All numerical thresholds must live in a dated, source-backed component or be
omitted. A licensed reviewer must approve the page before Production.

## Internal-link implementation

Each spoke gets one early contextual link to its owner and one next-step link at
the end. The owner links back only where the child page answers a narrower job.
Anchors must describe the target intent.

Good examples:

- `להבנת תפקידו של עורך דין מיסים לפני פנייה לרשות המסים`
- `למפת ההחלטה המלאה של מס שבח ומס רכישה לפני עסקת מקרקעין`

Bad examples:

- `לחצו כאן`
- ten identical links saying `עורך דין מיסים מומלץ` on every page

Why: descriptive, contextual anchors help the user predict the destination and
help search systems understand the relationship. Repetitive commercial anchors
look mechanical and do not explain the page hierarchy.

## Trust and legal accuracy

Every YMYL tax page must show:

- named author and named licensed substantive reviewer;
- reviewer credentials and a real profile page;
- original publication date and substantive review date;
- claim-level links to the Knesset or Tax Authority for deadlines, forms and
  current rules;
- a clear distinction between general preparation and individualized advice;
- change log when rates, deadlines or official procedures materially change.

Good examples:

- `נבדק מהותית ב־27.8.2026 בידי עו״ד ___, על בסיס טופס 7000 והחוק המקושר.`
- `הצהרה על העסקה מוגשת ככלל בתוך 30 ימים; בדקו את השירות הרשמי והנסיבות הספציפיות.`

Bad examples:

- `עודכן היום` when only the date was changed
- `אנחנו נחסוך לכם מס` without facts, scope, reviewer or qualification

The good form exposes who checked what and when. The bad form creates legal and
trust risk and can mislead a financially vulnerable reader.

## Product CTA and conversion design

Use a two-step ladder, not a contact-form wall:

1. **Prepare privately:** `הכינו ציר זמן, מסמכים ושאלות לבדיקת מס מקצועית`.
   This enters the allow-listed `tax-review-preparation` flow and transfers only
   cluster/owner/scenario attribution, never case facts.
2. **Act professionally:** after the user receives a useful preparation output,
   offer `מצאו עורך דין מיסים` or a consented lead form.

Good CTA examples:

- `התחילו הכנה לבדיקת מס — בלי לשלוח את פרטי המקרה בכתובת`
- `קיבלתם שומה? ארגנו מסמכים ושאלות לפני פנייה מקצועית`

Bad CTA examples:

- `גלו עכשיו כמה מס בטוח תחסכו`
- `העלו את כל התיק ונאמר לכם אם תנצחו`

The good path promises a controllable output. The bad path implies a financial
or legal outcome, creates privacy risk and weakens professional credibility.

## Business value and KPI contract

The tax area can monetize in three layers:

1. free organic decision utility that earns trust and starts a Matter;
2. paid or qualified preparation/simulation for complex matters;
3. consented professional matching and, later, a professional workspace for
   document intake, evidence chronology and client preparation.

The primary business KPI is not page views. It is evidenced collected revenue
by cluster and scenario. The funnel is:

`organic owner visit → Matter started → evidence/people prepared → simulation completed → useful output produced → professional action → consented lead → qualified → accepted → won → collected revenue`

Monitor owner impressions/clicks and intent overlap weekly for the first eight
weeks after publication. Review lead quality and revenue monthly. Review legal
sources quarterly and immediately after a material law, Tax Authority procedure
or official-rate change.

## 410 and no-redirect policy

No URL in this tax slice is approved for 410 now.

- `/tax-lawyer-israel/` is protected by recent visibility.
- `/articles/top-global-tax-cpa-firms/` and
  `/articles/top-international-tax-law-firms/` are duplicate-looking variants,
  but each still requires the full 410 release gates: exact content evidence,
  external/internal link checks, CRM and server-log checks, sitemap/canonical
  cleanup plan, 24-hour recheck and explicit Production approval.
- No new 301 is proposed.

If a page later passes all deletion gates, the correct execution is a true 410,
removal from internal links and sitemap, and post-release monitoring. A soft 404,
homepage redirect or chained redirect is not an acceptable substitute.

## Release layers

1. **Repository contract — done:** broad tax owner changed to `/tax-lawyer/` in
   the SEO cluster and cross-domain attribution contracts.
2. **Editorial draft:** create the two page drafts and source ledger; do not
   overwrite live WordPress content.
3. **Expert gate:** licensed Israeli tax-law review with named accountability.
4. **Preview QA:** desktop/mobile, RTL, accessibility, links, schema, privacy,
   funnel telemetry and screenshot evidence.
5. **Production gate:** explicit scoped approval for the named pages only.
6. **Measurement:** weekly 8-week overlap/CTR review, then monthly business and
   revenue review.
