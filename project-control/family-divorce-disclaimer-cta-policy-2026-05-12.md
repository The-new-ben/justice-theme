# Family / Divorce Disclaimer And CTA Policy

Date: 2026-05-12
Status: VERIFIED / REVIEW ONLY / NO PUBLIC CHANGES

This file defines the minimum disclaimer, CTA and trust-language rules before the first Family/Divorce upload. It is a content safety gate only.

It does not approve public copy upload, CMS import, template edits, title/H1/meta edits, URL changes, redirects, canonicals, noindex, sitemap changes, taxonomy/category changes, internal-link execution, related-card changes, lawyer-card changes, Maya profile changes, ratings/reviews/schema, CRM changes, wp-admin settings or database writes.

## Inputs Reviewed

VERIFIED:
- `content-drafts/divorce-lawyer-pillar-he.md`
- `content-drafts/consensual-divorce-supporting-he.md`
- `content-drafts/divorce-mediation-supporting-he.md`
- `content-drafts/child-support-supporting-he.md`
- `content-drafts/child-custody-supporting-he.md`
- `content-drafts/divorce-property-division-supporting-he.md`
- `content-drafts/family-dispute-resolution-supporting-he.md`
- `template-parts/sections/ask-lawyer.php`
- `template-parts/sections/cta-section.php`
- `template-parts/sections/find-lawyer-guide.php`
- `project-control/family-divorce-pillar-owner-review-draft-package-2026-05-12.md`
- `project-control/family-law-pre-upload-minimum-checklist-2026-05-12.csv`

## Current Finding

VERIFIED:
- The Family/Divorce drafts already contain strong internal editorial warnings.
- The live/homepage CTA sections already include useful no-legal-advice disclaimers.
- The upload checklist still marked disclaimers as `NOT VERIFIED`, because the exact first-wave page rules had not been converted into a single gate.

Decision:
- Family/Divorce disclaimer planning is now `VERIFIED PLANNING`.
- Live verification remains blocked until upload/preview exists.

## Required User-Facing Disclaimer Blocks

Every first-wave Family/Divorce page needs a visible disclaimer in plain Hebrew.

Recommended article-level text:

> המידע בעמוד זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי, חוות דעת משפטית או תחליף לבדיקת עורך דין לפי נסיבות המקרה. דיני משפחה וגירושין תלויים בפרטים אישיים, כלכליים ומשפטיים, ולכן לפני פעולה, חתימה או החלטה חשוב לקבל ייעוץ פרטני.

Recommended lead/CTA-level text:

> שליחת פנייה דרך Jus-Tice אינה יוצרת יחסי עורך דין-לקוח ואינה מהווה ייעוץ משפטי. הפרטים יועברו לבדיקה או להתאמה ראשונית בכפוף להסכמתכם.

Recommended urgent-risk text:

> אם קיימת סכנה מיידית, אלימות, חשש לפגיעה בילד, חטיפה או מצב חירום אחר, אין להסתפק בקריאת מידע באתר. יש לפנות לגורמי חירום או לגורם מקצועי מתאים לפי הצורך.

Recommended review/status note before full legal review:

> העמוד מיועד למידע כללי ולהכנה ראשונית. לפני פרסום סופי או הרחבה מקצועית נדרשים בדיקת מקורות, תאריך עדכון ושיוך כותב/בודק.

Use the status note only in draft/review surfaces unless the owner wants a public editorial disclosure.

## Page-Specific Disclaimer Requirements

`/divorce-lawyer/`
- Must include general-information disclaimer.
- Must state that outcomes depend on facts.
- Must avoid guaranteed results, guaranteed timelines or guaranteed costs.
- CTA must be neutral: connect/check/consult, not promise representation quality.

`/consensual-divorce/`
- Must say an agreement needs individual review before signing.
- Must not present a template as safe for every couple.
- Must warn that consent can be unsafe where there is pressure, fear, violence, hidden assets or major information gaps.

`/divorce-mediation/`
- Must say mediation is not suitable for every case.
- Must warn against mediation where there is violence, coercion, major power imbalance or hidden information.
- Must not imply that mediation always saves money or always prevents litigation.

`/child-support/`
- Must say there is no automatic calculator or guaranteed amount.
- Must not give fixed amounts as legal results.
- Any future tool must be described as preparation/intake only, not a binding child-support calculator.

`/child-custody/`
- Must use cautious language around custody, parenting time and parental responsibility.
- Must not instruct unilateral action.
- Must include child-safety and urgent-risk caution.

`/divorce-property-division/`
- Must state that property division depends on documents, registration, timing, debts, pension rights and facts.
- Must not advise hiding, moving or pressuring around assets.
- Must avoid exact entitlement promises without legal review.

`/family-dispute-resolution/`
- Must warn that procedure, timing and exceptions require current legal review.
- Must not tell users to ignore deadlines or wait blindly.
- Must mention urgent cases may need direct legal action.

## CTA Language Rules

Allowed:
- "בדיקה ראשונית"
- "פנייה לעורך דין מתאים"
- "הכנת שאלות לפגישה"
- "בדיקת התאמה ראשונית"
- "שיחה עם עורך דין בתחום דיני המשפחה"

Allowed with caution:
- "ייעוץ ראשוני" only if the service flow actually connects to a lawyer or clearly says it is a request for advice, not advice from the website itself.
- "עורכת דין משפחה" only when a real verified profile is connected and approved.

Blocked until verified:
- "עורך הדין המומלץ ביותר"
- "הכי טוב"
- "מוביל/ה בתחום"
- "מומחה/ית" unless legally and professionally approved.
- "מדורג/ת"
- "חוות דעת מאומתות"
- "לקוחות ממליצים"
- Star ratings, review counts or badges.
- Any promise of success, quick divorce, fixed child-support amount or guaranteed cost.

## Maya Rotenberg Boundary

VERIFIED PLANNING:
- Maya can be part of the Family/Divorce strategy only through verified facts and owner-approved profile copy.
- Do not use Maya as a ranking, review, badge or recommendation signal.
- Do not add review/rating/reputation language until the review module and profile verification policy are approved.

Allowed after profile-safety approval:
- neutral lawyer connection block,
- verified practice areas,
- verified office/contact details,
- verified article/review byline if approved.

Blocked:
- fake recommendation,
- "trusted" badge,
- star rating,
- Google review summary,
- "top lawyer" language,
- unsupported case/result claims.

## Schema And Rich Result Boundary

BLOCKED:
- No `Review`, `AggregateRating`, FAQ schema or review rich-result markup should be added as part of this gate.
- FAQ schema can be reviewed later only if the final visible FAQ is stable and legally reviewed.
- Do not mark Google reviews or future Jus-Tice reviews until the review/reputation module is approved.

## Upload QA Requirements

MUST VERIFY AFTER ANY PREVIEW OR PUBLIC UPDATE:
1. Visible disclaimer appears on every first-wave Family/Divorce page.
2. CTA disclaimer appears beside lead/contact/request forms.
3. No fake ratings, badges, recommendation labels or review counts appear.
4. No guaranteed outcome, fixed child-support amount, guaranteed timeline or guaranteed cost appears.
5. Urgent-risk content tells users not to rely only on the website.
6. Maya/profile language is neutral and verified.
7. No review or aggregate-rating schema appears.
8. Page copy still supports the correct pillar/support role and does not create duplicate intent.

## Current Decision

VERIFIED:
- Disclaimer/CTA planning can advance without GSC API or public CMS changes.
- This closes the planning side of `FAM-UPLOAD-016`.
- Live verification remains blocked until a preview or public upload exists.

BLOCKED:
- No public disclaimer, CTA, template, schema, lawyer-card, review, rating, content, CMS or database change is approved by this plan.
