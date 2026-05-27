# Tel Aviv Family Local Human Draft Prompt - 2026-05-27

Purpose: no-API, human-supervised prompt for the owner/editor to use in an existing ChatGPT Pro, Claude or Gemini web account if desired. Do not run this as an unattended bot, and do not publish its output directly.

## Guardrails

- Write in Hebrew for a legal-help seeker.
- Produce a private outline and short draft blocks only, not final publishable copy.
- Keep the page subordinate to `/divorce-lawyer/`; do not duplicate the central divorce guide.
- Use `/lawyers/?city=tel-aviv&area=family-law` as the only filtered directory path in private planning.
- Do not use `/lawyers/?city=tel-aviv&practice=family-law` except as a QA warning.
- Do not claim best/recommended/ranked lawyers, outcomes, prices, deadlines, eligibility or legal advice.
- Add placeholders for GSC evidence, internal overlap review, legal/editor review and owner approval.

## Target Row

- Title: עורך דין גירושין בתל אביב
- Slug: divorce-lawyer-tel-aviv
- Pillar: /divorce-lawyer/
- Role: עמוד עזר מקומי ותמציתי שמפנה לעמוד הגירושין המרכזי ואינו מנסה להיות מדריך גירושין מלא.
- Safe private opening seed: טיוטת עבודה פרטית: אם אתם מחפשים עורך דין גירושין בתל אביב, העמוד הזה אמור לעזור להבין אילו שאלות ומסמכים כדאי להכין לפני פנייה מסודרת. הוא לא מחליף ייעוץ משפטי, ולא אמור להתחרות במדריך הגירושין המרכזי של Jus-Tice.
- Evidence checklist seed: פרטי הצדדים והילדים, מסמכי הליכים קיימים אם יש, הסכמות או מחלוקות מרכזיות, מסמכים כלכליים בסיסיים, מועדי דיון או פניות קודמות, ושאלות שהגולש רוצה לברר מול עורך דין.
- Lawyer fit trigger seed: כאשר יש הליך פתוח, מועד קרוב, מחלוקת משמעותית או צורך להבין התאמה לעורך דין בתחום המשפחה בעיר או בסביבה.
- FAQ candidates requiring evidence: איך יודעים אם צריך עורך דין גירושין מקומי? | אילו מסמכים כדאי להכין לפני פנייה? | מתי לקרוא קודם את מדריך הגירושין המרכזי?

## Official Sources To Use Carefully

- קבלת תעודת גירושין - בתי הדין הרבניים: https://www.gov.il/he/service/obtaining-divorce-certificate
  Use for: source prompt for official-document language and evidence checklist only
  Boundary: Do not turn certificate-service details into legal advice or deadline claims.
- בקשה לסיוע משפטי - סיוע משפטי: https://www.gov.il/he/service/legal_aid_application
  Use for: source prompt for eligibility-sensitive wording and urgent-family-matter caveats
  Boundary: Do not claim eligibility; invite users to verify with official service or lawyer.
- יחידות הסיוע ליד בתי המשפט ובתי הדין: https://www.gov.il/he/departments/Units/molsa-court-assiatance-units
  Use for: source prompt for non-adversarial family-dispute context
  Boundary: Do not describe a mandatory process unless legal/editor review confirms the exact case type.

## Competitor Sources For SERP Context Only

- מורן גוהר - עורך דין גירושין בתל אביב: https://www.goharlaw.com/
  Use for: SERP positioning reference: competitor pages lead with credentials, family-court experience and local service framing
  Boundary: Do not copy claims, rankings, testimonials, case outcomes, pricing or personal positioning.
- מאיה רוטנברג - עורך דין גירושין: https://rotenberglaw.co.il/
  Use for: SERP positioning reference: competitor pages often use experience, process reassurance and city coverage
  Boundary: Do not copy claims, price ranges, badges, testimonials or outcome promises.

## Prompt

Create a private Hebrew editor draft outline for `עורך דין גירושין בתל אביב`. Include:

1. A local/practice intent opening that explains who the page helps and when the main divorce guide is enough.
2. A document/evidence preparation checklist that does not become legal advice.
3. A short section on when a reader may consider a lawyer fit check.
4. A safe internal link plan with the central pillar and the canonical filtered directory only.
5. FAQ candidates marked `requires evidence` unless supported by supplied GSC, lead, owner or legal evidence.
6. Anti-cannibalization notes: what this page must not compete with or repeat from the divorce pillar.
7. Publication blockers: GSC evidence, internal overlap review, legal/editor review, owner approval, and no accidental public exposure.

End with a review checklist. Do not include publication instructions, CMS fields, SEO title/meta, schema, or final copy.
