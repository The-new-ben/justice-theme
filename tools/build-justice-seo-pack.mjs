import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outDir = path.join(root, 'mnt', 'documents', 'justice');
const competitorDir = path.join(outDir, 'STEP_3_competitors');
const internalDir = path.join(outDir, 'internal-pages');

for (const dir of [outDir, competitorDir, internalDir]) {
  fs.mkdirSync(dir, { recursive: true });
}

const today = '2026-05-25';

const sourceLog = [
  ['Google Search Central helpful content', 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content', 'people-first content, expertise, original value, no search-first padding'],
  ['Google SEO starter guide', 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide', 'SEO helps search engines understand content and users decide whether to visit'],
  ['Google Images SEO', 'https://developers.google.com/search/docs/appearance/google-images', 'descriptive alt text and page context for images'],
  ['Google FAQ changes', 'https://developers.google.com/search/blog/2023/08/howto-faq-changes', 'FAQ schema may not always create visible rich results, but valid structured data is still safe'],
  ['Schema LegalService', 'https://schema.org/LegalService', 'legal service structured data model'],
  ['Schema Attorney', 'https://schema.org/Attorney', 'attorney structured data model'],
  ['Schema FAQPage', 'https://schema.org/FAQPage', 'FAQ structured data model'],
  ['Schema BreadcrumbList', 'https://schema.org/BreadcrumbList', 'breadcrumb structured data model'],
  ['Din advertising advantages', 'https://www.din.co.il/whyadv.asp', 'profile as digital asset, leads, recommendations, articles, forums'],
  ['Din lawyer forum', 'https://www.din.co.il/forum/lawyers.asp', 'forum and expert-answer authority structure'],
  ['Din homepage', 'https://www.din.co.il/', 'directory, reviews, cities, articles and forums'],
  ['Din recommendations', 'https://www.din.co.il/recomend.asp', 'lawyer-side testimonials and lead promise'],
  ['PsakDin homepage', 'https://www.psakdin.co.il/', 'portal authority, lawyers, articles, case-law and legal services'],
  ['PsakDin lawyers', 'https://www.psakdin.co.il/Lawyers', 'lawyer index and taxonomy direction'],
  ['PsakDin lawyer register', 'https://www.psakdin.co.il/Register?UserType=Lawyer', 'lawyer registration path'],
  ['LawReviews homepage', 'https://www.lawreviews.co.il/', 'review-led lawyer discovery, filtering, profile detail'],
  ['LawReviews about', 'https://www.lawreviews.co.il/about', 'review verification and lawyer profile setup'],
  ['LawReviews join', 'https://www.lawreviews.co.il/join', 'join form and reputation promise'],
  ['LawReviews sample profile', 'https://www.lawreviews.co.il/provider/profile-law-reviews', 'profile layout, review proof and trust model'],
  ['Justia lawyer directory marketing', 'https://www.justia.com/marketing/lawyer-directory/', 'free claimed profiles and sponsored placement model'],
  ['Justia lawyers directory', 'https://www.justia.com/lawyers', 'practice and location directory architecture'],
  ['Justia ratings and reviews', 'https://lawyers.justia.com/about-the-justia-lawyer-rating-reviews?profile_id=23877', 'rating and verified-lawyer review governance'],
  ['Justia FAQ', 'https://lawyers.justia.com/faq', 'claim profile questions and edit/update patterns'],
  ['Avvo rating support', 'https://support.avvo.com/hc/en-us/articles/360013500772-What-is-the-Avvo-Rating-', 'claimed versus unclaimed profile treatment'],
  ['Jus-Tice homepage', 'https://jus-tice.co.il/', 'current homepage surface and lawyer revenue path'],
  ['Jus-Tice family law page', 'https://jus-tice.co.il/practice-areas/family-law/', 'existing family/divorce cluster signal'],
  ['Jus-Tice sitemap', 'https://jus-tice.co.il/site-map/', 'site taxonomy and current legal content inventory'],
  ['Jus-Tice divorce agreement', 'https://jus-tice.co.il/what-is-a-divorce-settlement-agreement/', 'existing divorce-support content'],
  ['Knesset contract remedies law PDF', 'https://fs.knesset.gov.il/7/law/7_lsr_211750.pdf', 'Contracts Remedies Law, 1970'],
  ['Knesset land law PDF', 'https://fs.knesset.gov.il/6/law/6_lsr_208977.PDF', 'Land Law, 1969'],
  ['Gov land first registration', 'https://www.gov.il/he/service/real-estate-first-registration-application', 'land registration process and Land Law reference'],
  ['Gov inheritance order', 'https://www.gov.il/he/service/application-for-inheritance-order', 'inheritance order process and Inheritance Law reference'],
  ['Knesset legal capacity law PDF', 'https://fs.knesset.gov.il/5/law/5_lsr_208473.pdf', 'Legal Capacity and Guardianship Law, 1962'],
  ['Ministry of Health guardianship explainer', 'https://me.health.gov.il/mental-health/therapy-and-rehabilitation/public-care/psychiatric-hospitalization/patient-entitlements/legal-competence-and-guardianship/', 'capacity and guardianship public explanation'],
  ['Ron Festinger malpractice', 'https://www.rofs.co.il/', 'medical malpractice and injury commercial page pattern'],
  ['Ronen Ziv family law', 'https://www.ronenziv.com/', 'divorce and family law emotional reassurance pattern'],
  ['Elinor Libovitch family law', 'https://www.gerushin.co.il/', 'specialist family law and credentials pattern'],
  ['Sharon Segal divorce', 'https://divorced.co.il/', 'family/divorce portal and urgency language'],
  ['Hagit Halevy family law', 'https://www.hhlaw.org.il/', 'family law service cluster and personal guidance'],
  ['Rose Shulman malpractice', 'https://www.roseshul-law.com/', 'malpractice expertise and case-type breadth'],
  ['Algabi Agbali injury law', 'https://aa-lawyers.co.il/', 'injury and malpractice proof signals'],
  ['Dor Weinberg injury', 'https://www.weinbergdor.com/', 'injury landing page visual/CTA pattern'],
  ['Ohed Shoham inheritance', 'https://www.yerusha.org.il/', 'inheritance and wills service structure'],
  ['Yitzhak Goldstein inheritance', 'https://ygoldlaw.co.il/', 'wills, inheritance and estate litigation cluster'],
  ['ODY inheritance', 'https://ody.co.il/', 'will objection and inheritance disputes'],
  ['Kaufman inheritance', 'https://www.kaufmanlaw.co.il/', 'probate and objection explanatory structure'],
  ['Guy Kamri inheritance', 'https://guykamri-law.co.il/', 'estate dispute services and tax caution'],
  ['Klein tax law', 'https://www.klein-law.co.il/', 'tax-law boutique positioning'],
  ['Kalifi Cohen tax law', 'https://www.bennykalifi.com/', 'tax disputes, VAT, international tax and options'],
  ['Shimon Gigi class actions', 'https://s-gigilaw.co.il/', 'class action and commercial litigation service intent'],
  ['Diogines employment rights', 'https://www.diogines.co.il/worker_rights.ASP', 'employment rights and labor-law issue clusters'],
  ['Midrag will objection', 'https://www.midrag.co.il/Content/Tip/14623', 'cost transparency and will-objection questions'],
  ['Gov real estate tax declaration PDF', 'https://www.gov.il/BlobFolder/service/real_eatate_tax7002/he/Service_Pages_Real_Estate_Taxation_real-estate-tax-7002.pdf', 'real-estate tax forms and attorney verification context'],
  ['State Comptroller land rights report', 'https://library.mevaker.gov.il/sites/DigitalLibrary/Pages/Reports/297-13.aspx', 'land rights registration complexity'],
  ['Jus-Tice targeted GSC query queue', 'project-control/targeted-gsc-query-queue.csv', 'existing internal GSC-derived decision queue'],
  ['Jus-Tice topic clusters', 'project-control/topic-clusters.csv', 'existing site cluster inventory'],
  ['Jus-Tice SERP research log', 'project-control/serp-research-log.csv', 'prior partial SERP observations'],
  ['Jus-Tice competitor success plan', 'project-control/competitor-success-replication-plan-2026-05-25.md', 'competitor implementation plan already prepared'],
  ['Jus-Tice live CMS indexed customers', 'project-control/live-cms-indexed-customers-2026-05-25.md', '20 public lawyer cards and supplier blocker'],
];

const baselineMetrics = new Map([
  ['עורך דין', { volume: 5400, cpc: null, kdi: null, source: 'owner_baseline_semrush_like_snapshot', current_position: 20 }],
  ['חיפוש עורך דין לפי שם', { volume: 480, cpc: null, kdi: null, source: 'owner_baseline_semrush_like_snapshot', current_position: 7 }],
  ['איתור עורך דין', { volume: 320, cpc: null, kdi: null, source: 'owner_baseline_semrush_like_snapshot', current_position: 7 }],
  ['ייעוץ עורך דין אונליין חינם', { volume: 320, cpc: null, kdi: null, source: 'owner_baseline_semrush_like_snapshot', current_position: 9 }],
  ['כמה עולה עורך דין לתביעות קטנות', { volume: 320, cpc: null, kdi: null, source: 'owner_baseline_semrush_like_snapshot', current_position: 6 }],
  ['קפריסין', { volume: 18100, cpc: null, kdi: null, source: 'owner_baseline_semrush_like_snapshot', current_position: 21 }],
  ['חוק החוזים תרופות', { volume: 2400, cpc: null, kdi: null, source: 'owner_baseline_semrush_like_snapshot', current_position: 14 }],
  ['צוואה', { volume: null, cpc: null, kdi: null, source: 'internal_gsc_queue_201_impressions', current_position: null }],
  ['התנגדות לצוואה', { volume: null, cpc: null, kdi: null, source: 'internal_gsc_queue_121_impressions', current_position: null }],
  ['תאונת דרכים', { volume: null, cpc: null, kdi: null, source: 'internal_gsc_queue_84_impressions', current_position: null }],
  ['נהיגה בשכרות', { volume: null, cpc: null, kdi: null, source: 'internal_gsc_queue_8_impressions_wrong_page', current_position: null }],
]);

const categories = [
  ['lawyer-discovery', ['עורך דין', 'עורך דין מומלץ', 'איתור עורך דין', 'חיפוש עורך דין לפי שם', 'עורכי דין בישראל']],
  ['family-divorce', ['עורך דין גירושין', 'עורך דין לענייני משפחה', 'עורך דין גירושין ודיני משפחה', 'גירושין בהסכמה', 'מזונות ילדים', 'משמורת ילדים', 'חלוקת רכוש בגירושין', 'הסכם ממון']],
  ['real-estate', ['עורך דין מקרקעין', 'עורך דין נדלן', 'חוזה מכר דירה', 'בדיקת חוזה דירה', 'מס שבח', 'היטל השבחה', 'טאבו', 'רישום בית משותף', 'ליקויי בנייה', 'פינוי בינוי']],
  ['injury-malpractice', ['עורך דין נזיקין', 'רשלנות רפואית', 'עורך דין רשלנות רפואית', 'תאונת דרכים פיצוי', 'תאונת עבודה', 'ביטוח לאומי תאונת עבודה', 'נזקי גוף']],
  ['inheritance', ['עורך דין ירושה', 'עורך דין צוואות וירושות', 'התנגדות לצוואה', 'צו ירושה', 'צו קיום צוואה', 'ייפוי כוח מתמשך', 'ניהול עיזבון']],
  ['criminal', ['עורך דין פלילי', 'סגירת תיק פלילי', 'מחיקת רישום פלילי', 'חקירה במשטרה', 'חזרה מכתב אישום', 'עבירות סמים', 'מעצר ימים']],
  ['employment', ['עורך דין דיני עבודה', 'פיטורים שלא כדין', 'שימוע לפני פיטורים', 'הלנת שכר', 'זכויות עובדים', 'פיצויי פיטורים', 'הטרדה מינית בעבודה']],
  ['tax-business', ['עורך דין מיסים', 'מס הכנסה', 'מע"מ', 'הסכם מייסדים', 'חברה בע"מ פתיחה', 'אופציות לעובדים', 'תכנון מס', 'גילוי מרצון']],
  ['commercial-contracts', ['חוק החוזים תרופות', 'ביטול חוזה', 'ביטול עסקה', 'תביעה ייצוגית', 'גביית חובות', 'הוצאה לפועל', 'לשון הרע']],
  ['real-estate-general', ['דירות למכירה', 'מחירי נדל"ן', 'תיווך', 'השקעות נדל"ן', 'מחירון נדל"ן', 'בדיקת דירה לפני קנייה']],
];

const modifiers = ['', ' מחיר', ' עלות', ' מומלץ', ' בתל אביב', ' בירושלים', ' בחיפה', ' בראשון לציון', ' בפתח תקווה', ' ברמת גן', ' בבאר שבע', ' באשדוד', ' בכפר סבא', ' מדריך', ' שאלות ותשובות', ' ייעוץ', ' בדיקה לפני חתימה', ' תביעה', ' הסכם', ' מסמכים'];

function intentFor(category, keyword) {
  if (keyword.includes('מחיר') || keyword.includes('עלות') || keyword.includes('שכר טרחה')) return 'commercial_investigation';
  if (keyword.includes('עורך דין') || keyword.includes('עורכי דין') || keyword.includes('איתור')) return 'commercial_directory';
  if (keyword.includes('דירות למכירה') || keyword.includes('תיווך')) return 'commercial_real_estate_general';
  return category.includes('business') || category.includes('real-estate') ? 'mixed_commercial_informational' : 'informational_to_commercial';
}

const keywords = [];
const seenKeywords = new Set();
for (const [category, seeds] of categories) {
  for (const seed of seeds) {
    for (const mod of modifiers) {
      const keyword = `${seed}${mod}`.trim().replace(/\s+/g, ' ');
      if (seenKeywords.has(keyword)) continue;
      seenKeywords.add(keyword);
      const metric = baselineMetrics.get(keyword) || {};
      keywords.push({
        keyword,
        volume: metric.volume ?? null,
        cpc: metric.cpc ?? null,
        kdi: metric.kdi ?? null,
        intent: intentFor(category, keyword),
        category,
        related: [
          `${seed} מומלץ`,
          `${seed} מחיר`,
          `${seed} שאלות`,
          `${seed} מסמכים`,
          `${seed} ייעוץ`,
          `${seed} תהליך`,
          `${seed} תביעה`,
          `${seed} עורך דין`,
          `${seed} זכויות`,
          `${seed} בישראל`,
        ].filter((value, index, array) => array.indexOf(value) === index).slice(0, 10),
        questions: [
          `איך בוחרים ${seed}?`,
          `כמה עולה ${seed}?`,
          `מתי צריך לפנות לעורך דין בנושא ${seed}?`,
          `אילו מסמכים חשוב להכין לפני פנייה בנושא ${seed}?`,
          `מה הסיכון המשפטי הנפוץ בנושא ${seed}?`,
          `האם אפשר להתחיל בבדיקה אונליין בנושא ${seed}?`,
          `איך יודעים אם עורך הדין מתאים לתיק ${seed}?`,
          `מה ההבדל בין ייעוץ ראשוני לבין ייצוג מלא בנושא ${seed}?`,
          `כמה זמן נמשך טיפול בנושא ${seed}?`,
          `מה אסור להבטיח ללקוח בנושא ${seed}?`,
        ],
        sources: metric.source ? [metric.source] : ['public_seed_expansion_no_volume_source_available_2026-05-25'],
        metric_status: metric.source ? 'PARTIAL_NUMERIC_BASELINE' : 'NEEDS_KEYWORD_PLANNER_OR_SEMRUSH_EXPORT',
      });
      if (keywords.length >= 240) break;
    }
    if (keywords.length >= 240) break;
  }
  if (keywords.length >= 240) break;
}

const targetPages = [
  {
    slug: 'divorce-family-lawyer',
    url: '/divorce-family-lawyer/',
    title: 'עורך דין גירושין ומשפחה | Jus-Tice',
    meta: 'מדריך לבחירת עורך דין גירושין ודיני משפחה, עלויות, ילדים, רכוש, מזונות ותהליך משפטי בישראל.',
    primary: 'עורך דין גירושין ודיני משפחה',
    secondaries: ['עורך דין גירושין', 'עורך דין לענייני משפחה', 'מזונות ילדים', 'משמורת ילדים', 'חלוקת רכוש'],
    lawRefs: ['חוק בית המשפט לענייני משפחה, תשנ"ה-1995', 'חוק יחסי ממון בין בני זוג, תשל"ג-1973', 'חוק הכשרות המשפטית והאפוטרופסות, תשכ"ב-1962'],
    intent: 'commercial and urgent family-law hiring',
  },
  {
    slug: 'real-estate-lawyer',
    url: '/real-estate-lawyer/',
    title: 'עורך דין מקרקעין ונדל"ן | Jus-Tice',
    meta: 'בדיקת חוזה דירה, טאבו, מס שבח, היטל השבחה, קבלן ורישום זכויות עם עורך דין מקרקעין.',
    primary: 'עורך דין מקרקעין',
    secondaries: ['עורך דין נדלן', 'חוזה מכר דירה', 'מס שבח', 'היטל השבחה', 'טאבו'],
    lawRefs: ['חוק המקרקעין, תשכ"ט-1969', 'חוק החוזים (תרופות בשל הפרת חוזה), תשל"א-1970', 'חוק מיסוי מקרקעין'],
    intent: 'commercial real-estate transaction hiring',
  },
  {
    slug: 'medical-malpractice-lawyer',
    url: '/medical-malpractice-lawyer/',
    title: 'עורך דין רשלנות רפואית | Jus-Tice',
    meta: 'בדיקת רשלנות רפואית, חוות דעת מומחה, נזקי גוף, פיצוי ותיעוד רפואי לפני תביעה.',
    primary: 'עורך דין רשלנות רפואית',
    secondaries: ['רשלנות רפואית', 'תביעת נזיקין', 'נזקי גוף', 'חוות דעת רפואית', 'תאונת דרכים פיצוי'],
    lawRefs: ['פקודת הנזיקין [נוסח חדש]', 'חוק זכויות החולה, תשנ"ו-1996', 'חוק פיצויים לנפגעי תאונות דרכים, תשל"ה-1975'],
    intent: 'high-value injury and malpractice hiring',
  },
  {
    slug: 'inheritance-wills-lawyer',
    url: '/inheritance-wills-lawyer/',
    title: 'עורך דין ירושה וצוואות | Jus-Tice',
    meta: 'ירושה, צוואה, התנגדות לצוואה, צו קיום צוואה, ייפוי כוח מתמשך וניהול עיזבון.',
    primary: 'עורך דין ירושה וצוואות',
    secondaries: ['עורך דין ירושה', 'התנגדות לצוואה', 'צו ירושה', 'צו קיום צוואה', 'ייפוי כוח מתמשך'],
    lawRefs: ['חוק הירושה, תשכ"ה-1965', 'חוק הכשרות המשפטית והאפוטרופסות, תשכ"ב-1962'],
    intent: 'estate dispute and planning hiring',
  },
  {
    slug: 'criminal-lawyer',
    url: '/criminal-lawyer/',
    title: 'עורך דין פלילי | Jus-Tice',
    meta: 'חקירה במשטרה, מעצר, כתב אישום, סגירת תיק פלילי ומחיקת רישום פלילי.',
    primary: 'עורך דין פלילי',
    secondaries: ['חקירה במשטרה', 'סגירת תיק פלילי', 'מחיקת רישום פלילי', 'מעצר ימים', 'עבירות סמים'],
    lawRefs: ['חוק סדר הדין הפלילי', 'חוק המרשם הפלילי ותקנת השבים', 'חוק המעצרים'],
    intent: 'urgent criminal defense hiring',
  },
  {
    slug: 'employment-lawyer',
    url: '/employment-lawyer/',
    title: 'עורך דין דיני עבודה | Jus-Tice',
    meta: 'פיטורים, שימוע, פיצויי פיטורים, הלנת שכר, הטרדה בעבודה וייצוג עובדים או מעסיקים.',
    primary: 'עורך דין דיני עבודה',
    secondaries: ['פיטורים שלא כדין', 'שימוע לפני פיטורים', 'הלנת שכר', 'פיצויי פיטורים', 'זכויות עובדים'],
    lawRefs: ['חוק פיצויי פיטורים, תשכ"ג-1963', 'חוק הודעה מוקדמת לפיטורים ולהתפטרות', 'חוק שוויון הזדמנויות בעבודה'],
    intent: 'employment rights and dispute hiring',
  },
  {
    slug: 'tax-business-lawyer',
    url: '/tax-business-lawyer/',
    title: 'עורך דין מיסים ועסקים | Jus-Tice',
    meta: 'מס הכנסה, מע"מ, חברה בע"מ, הסכם מייסדים, אופציות לעובדים, גילוי מרצון ותכנון מס.',
    primary: 'עורך דין מיסים ועסקים',
    secondaries: ['עורך דין מיסים', 'מס הכנסה', 'מע"מ', 'הסכם מייסדים', 'אופציות לעובדים'],
    lawRefs: ['פקודת מס הכנסה', 'חוק מס ערך מוסף, תשל"ו-1975', 'חוק החברות, תשנ"ט-1999'],
    intent: 'business and tax planning or dispute hiring',
  },
];

const homeCategories = [
  ['עורכי דין גירושין ודיני משפחה', '/divorce-family-lawyer/', 'הליך משפחתי לא מתחיל בטופס, הוא מתחיל בפחד ממשי סביב ילדים, דירה, מזונות, חשבון בנק, כתובה ולעיתים גם מרוץ סמכויות. לכן עמוד משפחה טוב חייב לחבר בין עורך דין גירושין לבין עורך דין לענייני משפחה באותו מרחב חיפוש, ולא לפצל אותם כאילו מדובר בשני עולמות נפרדים. בג׳אסטיס השאיפה היא להציג עורכי דין לפי תחומי משנה, עיר, זמינות, מסמכים נדרשים ורמת אימות, עם מעבר מסודר לשיחה או פתיחת פנייה.'],
  ['עורכי דין מקרקעין ונדל"ן', '/real-estate-lawyer/', 'עסקת דירה היא נקודת מפגש בין חוזה, טאבו, מיסוי, מימון, קבלן, עירייה ולעיתים גם בני משפחה או שותפים. עורך דין מקרקעין נבחן ביכולת לעצור חתימה מסוכנת בזמן, לבדוק הערת אזהרה, להבין מס שבח והיטל השבחה, לקרוא נספחים ולזהות התחייבויות שמסתתרות בין סעיפים. ג׳אסטיס צריך להציג את התחום כמרכז כסף אמיתי, עם מדריכים קצרים, כרטיסי עורכי דין, בדיקת חוזה ותיעוד של השלב שבו נמצא המשתמש.'],
  ['רשלנות רפואית ונזקי גוף', '/medical-malpractice-lawyer/', 'בתביעת רשלנות רפואית אין מקום להבטחות. יש רשומות רפואיות, שאלת חובת זהירות, קשר סיבתי, חוות דעת מומחה ונזק שניתן להוכחה. המשתמש בדרך כלל מגיע מבולבל, אחרי אירוע רפואי קשה או תאונה, ולכן הדף צריך להסביר מה בודקים לפני תביעה, כמה מסמכים נדרשים, מתי צריך מומחה, ואיך בוחרים עורך דין שמכיר עבודה מול חברות ביטוח, בתי חולים ובית המשפט.'],
  ['צוואות, ירושות וייפוי כוח מתמשך', '/inheritance-wills-lawyer/', 'ירושה נראית לפעמים כמו עניין משפחתי פנימי עד שמופיעים צוואה חדשה, חשבון בנק, דירה, התנגדות או טענה להשפעה בלתי הוגנת. כאן המשתמש צריך שפה מדויקת ולא דרמטית: צו ירושה, צו קיום צוואה, ניהול עיזבון, התנגדות לצוואה וייפוי כוח מתמשך. ג׳אסטיס צריך להפוך את הכאוס המשפחתי למסלול בדיקה, עם עורכי דין מתאימים ועם קישורים לתוכן שמסביר מה מגישים ולמי.'],
  ['משפט פלילי', '/criminal-lawyer/', 'במשפט פלילי הזמן קצר. חקירה במשטרה, מעצר, כתב אישום, שימוע פלילי או רישום פלילי הם לא חיפוש רגיל של שירות מקצועי. צריך להציג למשתמש דרך פעולה בלי להפחיד ובלי להבטיח תוצאה. כרטיסי עורכי הדין צריכים להראות תחומי טיפול כמו עבירות סמים, אלימות, צווארון לבן או תעבורה פלילית, ולהבליט שיחה מהירה, זמינות ותיעוד ראשוני של מה כבר קרה.'],
  ['דיני עבודה', '/employment-lawyer/', 'עובד שפוטר בלי שימוע, מעסיק שקיבל מכתב דרישה, הלנת שכר, הטרדה מינית או הסכם עבודה לא ברור יוצרים חיפוש שיש בו גם לחץ וגם כסף. עמוד דיני עבודה צריך להפריד בין עובדים למעסיקים, בין בדיקה ראשונית לבין ייצוג, ולתת מקום לשאלות על פיצויי פיטורים, זכויות סוציאליות, חוזה עבודה והליך בבית הדין לעבודה.'],
  ['מיסים ועסקים', '/tax-business-lawyer/', 'יזמים ובעלי עסקים לא מחפשים רק עורך דין, הם מחפשים מניעת נזק. חברה בע"מ, הסכם מייסדים, אופציות לעובדים, מע"מ, מס הכנסה, גילוי מרצון ותכנון עסקה דורשים שילוב בין משפט, חשבונאות וסיכון מסחרי. בג׳אסטיס התחום צריך לקבל שפה עסקית, עם אפשרות לפנות לעורך דין מתאים, לשמור מסמכים, ולהבין מראש מה עשוי להיות דחוף.'],
  ['תביעות ייצוגיות וחוזים', '/class-actions-contracts/', 'תביעה ייצוגית, ביטול עסקה, הפרת חוזה או גביית חוב הם תחומים שבהם המשתמש רוצה לדעת אם יש עילה אמיתית ולא רק תחושת עוול. הדף צריך לעבוד לפי חוק החוזים, חוק הגנת הצרכן ודיני התובענות הייצוגיות, ולהסביר מה ההבדל בין תלונה, מכתב התראה, תביעה אישית ותביעה ייצוגית. זהו מסלול טוב ללידים מסחריים, אבל רק אם הסינון הראשוני רציני.'],
  ['תעבורה ותאונות דרכים', '/car-accident-lawyer/', 'תאונת דרכים יכולה להיות תיק פיצויים, תיק תעבורה, תיק ביטוח ולעיתים גם תיק פלילי. משתמש שמחפש עורך דין אחרי תאונה צריך להבין לאיזה מסלול הוא נכנס: פגיעה גופנית, שלילת רישיון, נהיגה בשכרות, ביטוח חובה, קרנית או תאונת עבודה. ג׳אסטיס צריך למנוע ערבוב בין עמודים, במיוחד אחרי שהתגלה בעבר איתות שגוי סביב נהיגה בשכרות.'],
  ['לשון הרע ופרטיות', '/defamation-privacy-lawyer/', 'פוסט, הודעה בקבוצת וואטסאפ, ביקורת בגוגל, צילום פרטי או שימוש במידע אישי יכולים להפוך לתיק לשון הרע או פרטיות. המשתמש צריך להבין מה נחשב פרסום, איזה נזק צריך להוכיח, מתי שולחים מכתב התראה ומתי עדיף לא להסלים. זה תחום שמתאים לעמודים עם דוגמאות ישראליות, אבל בלי להעתיק פסקי דין ובלי ליצור הבטחות פיצוי.'],
  ['הוצאה לפועל וחדלות פירעון', '/debt-enforcement-lawyer/', 'חוב פתוח, עיקול, אזהרה מהוצאה לפועל או בקשה לחדלות פירעון הם מצבים שבהם המשתמש מחפש פעולה מעשית. התוכן צריך להסביר איך מזהים את סוג ההליך, אילו מסמכים מכינים, מתי אפשר לבקש איחוד תיקים, התנגדות או צו תשלומים, ואיך עורך דין מתאים יכול לבחון אם יש טעות בחוב או אפשרות להסדר.'],
  ['מסחרי, חברות וסטארטאפים', '/commercial-business-lawyer/', 'הסכם מייסדים, השקעה, אופציות, סכסוך בין שותפים, חוזה ספק או מכתב לפני תביעה דורשים שפה של עסק ולא רק של בית משפט. עמוד מסחרי טוב צריך להציג תרחישים, לא סיסמאות: מי חותם, מי אחראי, מה קורה אם צד מפר, איך מוגדר קניין רוחני ואיך מונעים מלחמה יקרה אחרי שהכסף כבר נכנס.'],
  ['משפט מנהלי ורשויות', '/administrative-lawyer/', 'מכרז, רישיון עסק, החלטת רשות, עתירה מנהלית או סירוב לקבל שירות הם מצבים שבהם המשתמש צריך להבין את לוח הזמנים ואת המסמך הנכון. כאן חשוב להציג עורכי דין שמכירים עבודה מול רשויות, ועדות, משרדי ממשלה ובתי משפט מנהליים. הדף צריך להיות נקי מהבטחות, עם דגש על בחינת החלטה, זכות טיעון ותיעוד.'],
  ['ביטוח לאומי וביטוח', '/insurance-national-insurance-lawyer/', 'אובדן כושר עבודה, תאונת עבודה, נכות כללית, ביטוח סיעודי או דחיית תביעה מול חברת ביטוח הם תחומים עם מסמכים רבים ושפה מסורבלת. משתמש טוב לג׳אסטיס הוא מי שכבר קיבל דחייה או עומד לפני ועדה. צריך להוביל אותו לאיסוף מסמכים, הכנה לשיחה עם עורך דין, והבנה של ההבדל בין מסלול ביטוח לאומי למסלול ביטוח פרטי.'],
  ['רישוי עסקים ורגולציה', '/business-license-lawyer/', 'עסק קטן או חברה שמקבלים דרישה מהרשות, בעיית רישיון, צו סגירה או תנאי רגולטורי צריכים תשובה מעשית. עורך דין בתחום נדרש להבין את הרשות המקומית, משרד הבריאות, כיבוי אש, תכנון ובנייה ולעיתים גם חוזה שכירות מסחרי. הדף צריך להיות חלק ממסלול עסקי רחב יותר ולא עמוד מבודד.'],
  ['גישור ובוררות', '/mediation-arbitration-lawyer/', 'לא כל סכסוך צריך להגיע לבית משפט. גישור משפחה, גישור מסחרי, בוררות בין שותפים או הסכם פשרה יכולים לחסוך זמן וכסף, אך רק כאשר הצדדים מבינים מה הם מוותרים ומה נשאר פתוח. ג׳אסטיס צריך להציג גישור כאפשרות מקצועית, לא כקסם, עם עורכי דין ומגשרים לפי תחום, עיר וזמינות.'],
  ['סייבר, פרטיות וטכנולוגיה', '/cyber-privacy-lawyer/', 'חברות, חנויות אונליין ומפתחים נתקלים בשאלות על פרטיות, מאגרי מידע, הסכמי שימוש, אבטחת מידע, בינה מלאכותית ותקלות חשיפה. זה תחום שבו המשתמש העסקי מחפש גם תבנית פעולה וגם עורך דין שמבין מוצר. העמוד צריך לחבר בין רגולציה, חוזים, סיכון עסקי והגנת לקוחות.'],
  ['נוטריונים ותרגומים משפטיים', '/notary-lawyer/', 'אישור נוטריוני, תרגום מסמך, ייפוי כוח, אישור חתימה או מסמך לחו"ל הם חיפושים עם כוונת פעולה גבוהה. המשתמש רוצה לדעת מי זמין, מה המחיר המשוער, איזה מסמך להביא, ואיך מקבלים שירות בלי סיבוך. התחום מתאים לכרטיסי ספקים משפטיים ולמסלול שדרוג של נוטריונים בתוך האינדקס.'],
  ['עורכי דין לפי עיר', '/lawyers/', 'חיפוש לפי עיר עדיין חשוב, אבל הוא מסוכן אם הופך לדפי doorway ריקים. הדרך הנכונה היא לשלב עיר עם תחום משפטי, כרטיסים אמיתיים, מידע שימושי על בתי משפט ורשויות מקומיות, וסינון שמשרת את המשתמש. דף עיר צריך להציג עורכי דין זמינים, תחומים חזקים בעיר, וקישורים לעמודי תוכן רלוונטיים.'],
  ['שירותים מקצועיים סביב משפט', '/legal-service-providers/', 'שמאים, מגשרים, חוקרים פרטיים, מומחי מס, מתרגמים נוטריוניים ויועצים פיננסיים יכולים להפוך לשכבת הכנסה נוספת סביב עורכי הדין. אבל אסור להציג אותם כאילו הם עורכי דין, ואסור לערבב חוות דעת או הבטחות. המודל הנכון הוא כרטיס ספק מאושר, קטגוריה ברורה, גילוי נאות, ומסלול שדרוג או חסות.'],
];

function faqFor(page) {
  const base = page.primary;
  return [
    [`מתי כדאי לפנות אל ${base}?`, `כדאי לפנות כאשר ההחלטה הבאה עלולה לשנות כסף, זכויות, חירות, בעלות או יחסים משפחתיים. פנייה מוקדמת לא מחייבת ייצוג מלא, אבל היא מאפשרת להבין אם צריך מסמך, שיחה, מכתב, משא ומתן או הליך משפטי. בג׳אסטיס המטרה היא לתעד את השלב, התחום והדחיפות כדי שהפנייה תגיע לאיש מקצוע מתאים.`],
    [`איך בודקים אם עורך הדין מתאים?`, `בודקים תחום טיפול, עיר, זמינות, ניסיון מוכח, שפה מקצועית, מסמכים שהוא מבקש לראות, והאם הוא מסביר סיכונים לצד אפשרויות. אין להסתמך על תמונה, תואר שיווקי או דירוג לא מאומת. כרטיס טוב צריך להראות מה מאומת, מה ממתין לבדיקה ומה נמסר על ידי בעל הפרופיל.`],
    [`כמה עולה טיפול בתחום ${base}?`, `אין מחיר אחד. עלות תלויה במורכבות, דחיפות, מספר מסמכים, צורך בדיונים, מומחים, מכתבים או משא ומתן. לכן עדיף להציג טווחי עלות ושאלות להכנה, ולא הבטחה למחיר קבוע. במקרים מסוימים אפשר להתחיל בבדיקת מסמך או שיחת ייעוץ לפני התחייבות לייצוג מלא.`],
    [`אילו מסמכים כדאי להכין?`, `כדאי להכין חוזים, החלטות, התכתבויות, תעודות, מסמכי רישום, מסמכי בנק, תלושי שכר, רשומות רפואיות או כל מסמך שמוכיח את העובדות. גם ציר זמן קצר עוזר מאוד. משתמש שמגיע עם מסמכים מסודרים חוסך זמן ומאפשר לעורך הדין לזהות סיכון אמיתי מהר יותר.`],
    [`האם ג׳אסטיס נותנת ייעוץ משפטי בעצמה?`, `ג׳אסטיס היא פלטפורמה שמארגנת מידע, כרטיסי אנשי מקצוע ופניות. התוכן אינו תחליף לייעוץ משפטי אישי, משום שכל תיק תלוי בעובדות, במסמכים ובמועדים. ההפניה לעורך דין נועדה לקצר את הדרך בין הבעיה לבין איש מקצוע מתאים.`],
    [`מה ההבדל בין כרטיס בסיסי לכרטיס מאומת?`, `כרטיס בסיסי יכול להופיע על בסיס מידע ציבורי או מידע ראשוני, ולכן הוא צריך להיות צנוע וזהיר. כרטיס מאומת כולל פרטים שבעל הפרופיל או המקורות אישרו: תחומים, עיר, דרכי קשר, תמונה, מאמרים, ביקורות או זמינות. אין להציג ניסיון, השכלה או דירוג ללא מקור.`],
    [`האם אפשר להסיר או לתקן כרטיס?`, `כן. כרטיס ציבורי צריך לכלול מסלול ברור לתביעה, תיקון, עדכון או בקשת הסרה לפי מדיניות האתר והדין. זה חשוב במיוחד בשוק המשפטי, שבו טעות בשם, תחום טיפול או תמונה יכולה לפגוע באמון. הבעלים צריך לראות מי פנה ומה התבקש.`],
    [`איך מודדים אם העמוד עובד עסקית?`, `מודדים צפיות בפרופיל, קליקים לשיחה, פניות, שיעור מענה, פניות שלא טופלו, שדרוגים, חשבוניות ותשלומים מאומתים. תנועה אורגנית לבדה אינה הכנסה. המשקיע צריך לראות מסלול שמתחיל בחיפוש ומסתיים בפנייה, תשלום או שדרוג שניתן להוכיח.`],
    [`האם ביקורות צריכות להופיע בכל כרטיס?`, `לא לפני שקיימת מדיניות אימות. ביקורות משפטיות רגישות יותר מביקורות רגילות כי הן נוגעות לפרטיות, תוצאות הליך ומידע חסוי. עדיף להתחיל במצב "ביקורות טרם נאספו" או "ממתין לאימות" מאשר להציג דירוג או המלצה לא מבוססים.`],
    [`מה חשוב לא להבטיח למשתמש?`, `לא מבטיחים תוצאה משפטית, גובה פיצוי, מהירות רישום, מחיקת תיק, ניצחון או חיסכון במס. אפשר להסביר תהליך, מסמכים, סיכונים ואפשרויות. שפה מדויקת שומרת על אמון המשתמש, על האתר ועל עורכי הדין שמצטרפים למערכת.`],
  ];
}

function schemaFor(page, isHome = false) {
  const faqs = faqFor(page);
  const graph = [
    {
      '@type': 'Organization',
      '@id': 'https://jus-tice.co.il/#organization',
      name: 'Jus-Tice',
      alternateName: 'ג׳אסטיס',
      url: 'https://jus-tice.co.il/',
    },
    {
      '@type': isHome ? 'WebSite' : 'WebPage',
      '@id': `https://jus-tice.co.il${isHome ? '#website' : page.url + '#webpage'}`,
      url: `https://jus-tice.co.il${isHome ? '/' : page.url}`,
      name: isHome ? 'עורכי דין בישראל | Jus-Tice' : page.title,
      inLanguage: 'he-IL',
      isPartOf: { '@id': 'https://jus-tice.co.il/#website' },
    },
    {
      '@type': 'LegalService',
      '@id': `https://jus-tice.co.il${isHome ? '#legalservice' : page.url + '#legalservice'}`,
      name: isHome ? 'Jus-Tice legal marketplace' : page.primary,
      areaServed: 'IL',
      provider: { '@id': 'https://jus-tice.co.il/#organization' },
      serviceType: isHome ? 'Lawyer discovery and legal intake' : page.primary,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'דף הבית', item: 'https://jus-tice.co.il/' },
        ...(isHome ? [] : [{ '@type': 'ListItem', position: 2, name: page.primary, item: `https://jus-tice.co.il${page.url}` }]),
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqs.map(([name, text]) => ({
        '@type': 'Question',
        name,
        acceptedAnswer: { '@type': 'Answer', text },
      })),
    },
  ];
  if (isHome) {
    graph.push({
      '@type': 'WebSite',
      '@id': 'https://jus-tice.co.il/#search',
      url: 'https://jus-tice.co.il/',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://jus-tice.co.il/?s={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

function para(topic, focus, lawRefs) {
  return `ב${topic} אין ערך לעמוד שמסתפק בסיסמאות. המשתמש צריך להבין מה קורה עכשיו, איזה מסמך משנה את התמונה, מה המועד הקרוב, מי הגוף שמטפל בעניין, ומה נדרש מעורך הדין לפני שמתחילים לשלם. בתחום ${focus} חשוב להשתמש בשפה ישראלית מדויקת: בית משפט השלום כשמדובר בתביעה אזרחית רגילה, בית המשפט לענייני משפחה כשיש סכסוך משפחתי, רשם המקרקעין כאשר הזכות צריכה רישום, ולשכת עורכי הדין כאשר בודקים כשירות מקצועית או כללי אתיקה. נקודת הייחוס המשפטית כוללת ${lawRefs.join(', ')}, אבל החוק לבדו לא מספיק. צריך לחבר אותו לעובדות, למועדים ולמסמכים שנמצאים בידי המשתמש.`;
}

function listBlock(items) {
  return `<ul>\n${items.map((item) => `  <li>${item}</li>`).join('\n')}\n</ul>`;
}

function buildInternalPage(page) {
  const faqs = faqFor(page);
  const sections = [
    ['מתי החיפוש הופך לצורך משפטי אמיתי', `הסימן הראשון הוא נקודת אל חזור: חתימה, דיון, שיחה עם חוקר, קבלת החלטה מרשות, הודעת פיטורים, מכתב דרישה או מסמך שמחייב תגובה. מי שמחכה עד שהצד השני כבר הגיש בקשה או תביעה מאבד זמן יקר. עמוד ${page.primary} צריך להחזיק את המשתמש בשלב הזה, לתת לו סדר, ואז להעביר אותו לפנייה מסודרת.`],
    ['איך בוחרים עורך דין בלי להסתנוור משיווק', `בחירה נכונה מתחילה בהוכחות קטנות: תחום טיפול ברור, עיר, זמינות, מסמכים שהמשרד מבקש, הסבר על עלויות, ומדיניות לגבי תוצאה שאינה מובטחת. כרטיס עורך דין לא צריך להיראות כמו פרסומת ריקה. הוא צריך להראות מה נבדק, מה מוצהר על ידי בעל הפרופיל, ומה עדיין ממתין לאימות.`],
    ['המסמכים שמשנים את התיק', `לפני שיחה ראשונה כדאי להכין ציר זמן קצר. אחר כך מצרפים חוזים, החלטות, תמונות, תכתובות, אישורי מסירה, תלושי שכר, רשומות רפואיות או נסחי טאבו לפי התחום. משתמש שמגיע עם סדר מקבל תשובה טובה יותר. לכן ג׳אסטיס צריכה להציע מסלול איסוף מסמכים בכל עמוד כסף.`],
    ['תמחור ושכר טרחה', `המשתמש שואל מחיר כי הוא מפחד להיכנס להתחייבות פתוחה. לכן עדיף להסביר מה משפיע על שכר הטרחה: מספר פגישות, מכתבים, דיונים, חוות דעת, דחיפות, מסמכים וחומרת הסיכון. לא נכון להבטיח מחיר אחד לכל תיק. כן נכון להציע בדיקה ראשונית, שיחת התאמה או מסלול הצעת מחיר לאחר מסמכים.`],
    ['תוכן, עורכי דין ולידים באותו מסלול', `התוכן צריך לענות קודם על השאלה המשפטית. רק אחר כך מציגים עורכי דין, טופס פנייה, כרטיסים ותוכנית שדרוג. זה חשוב גם למשתמש וגם לגוגל. עמוד שמתחיל במכירה לפני תשובה משפטית נראה חלש, במיוחד בתחומי YMYL שבהם אמון, מומחיות ודיוק עובדות הם חלק מהשאלה עצמה.`],
    ['איך ג׳אסטיס צריכה להציג כרטיס מקצועי', `כרטיס טוב מתחיל בשם, עיר ותחום. לאחר מכן הוא מציג רמת אימות, מקור מידע, דרכי קשר, זמינות, שירותים, שפות, מאמרים, ביקורות אם הן מאומתות, ואפשרות לתביעה או תיקון פרופיל. בכרטיס בסיסי אין מקום לתמונה גנרית או לעובדות שלא נבדקו. בכרטיס משודרג יש מקום למדיה אמיתית, ניסיון ונתוני ביצוע.`],
    ['קישורים פנימיים ותפקיד העמוד בתוך האתר', `העמוד הזה צריך לקשר לדף הבית, לאינדקס עורכי הדין, לעמוד תמחור עורכי דין, לעמוד הרשמת עורך דין, לעמודי תחום משיקים ולמדריכי משנה. כך נוצר hub and spoke: דף כסף מרכזי, מדריכים תומכים, כרטיסי עורכי דין ופניות. בלי המפה הזו, האתר מקבל תנועה אבל לא הופך אותה להכנסה.`],
    ['טעויות שמחלישות אמון ודירוג', `הטעות הראשונה היא להציג עובדות לא נכונות בפרופיל. השנייה היא להשתמש בתמונות stock שנראות זרות לשוק הישראלי. השלישית היא לפצל כוונות חיפוש קרובות מדי, כמו עורך דין גירושין ועורך דין לענייני משפחה, בלי להבין שהמשתמש רואה אותן יחד. הטעות הרביעית היא להבטיח תוצאה במקום להסביר תהליך.`],
    ['מדדי הצלחה עסקיים', `מדד SEO לבדו אינו מספיק. צריך למדוד כמה משתמשים הגיעו לעמוד, כמה עברו לכרטיס עורך דין, כמה התקשרו, כמה מילאו טופס, כמה פניות נסגרו, כמה עורכי דין שדרגו, כמה חשבוניות יצאו וכמה הכנסות התקבלו בפועל. כרגע יש תנועה ושיפור במוצר, אבל הכנסה מאומתת עדיין צריכה הוכחה.`],
    ['השלב הבא למשתמש', `השלב הבא הוא לא ללחוץ על כל כפתור באתר. הוא לבחור את הבעיה הקרובה ביותר, להכין מסמכים, לבדוק אם מדובר בדחיפות אמיתית, ולפתוח פנייה מסודרת. ג׳אסטיס צריכה להעביר את הפנייה עם תחום, עיר, דחיפות ומקור העמוד, כדי שהמערכת תדע איזה עורך דין או ספק מקצועי מתאים.`],
  ];

  const services = [
    `בדיקה ראשונית של מסמכים בתחום ${page.primary}`,
    `שיחת התאמה עם עורך דין בתחום ${page.secondaries[0]}`,
    `מיפוי סיכון לפי ${page.lawRefs[0]}`,
    `הכנת רשימת מסמכים לפני פנייה`,
    `חיבור לכרטיסי עורכי דין מאומתים`,
    `שמירת מקור פנייה למדידת המרה`,
    `בחינת אפשרות מכתב התראה או משא ומתן`,
    `הפרדה בין מידע כללי לבין ייעוץ אישי`,
    `בדיקת דחיפות מול מועדים משפטיים`,
    `מסלול שדרוג פרופיל לעורכי דין בתחום`,
  ];

  const links = targetPages.filter((other) => other.slug !== page.slug).slice(0, 6).map((other) => `<a href="${other.url}">${other.primary}</a>`);

  return `<!-- TITLE: ${page.title} | META: ${page.meta} | SLUG: ${page.url} | TARGET KW: ${page.primary} -->
<main class="justice-seo-page" dir="rtl" lang="he">
  <article>
    <header>
      <p class="justice-kicker">מדריך משפטי מסחרי, לא תחליף לייעוץ אישי</p>
      <h1>${page.primary}: איך בוחרים נכון, מה בודקים ומה לא מבטיחים</h1>
      <p>${page.meta} הדף נבנה כדי לחבר בין חיפוש אורגני, תוכן מועיל, כרטיסי עורכי דין, פנייה מסודרת ומדידה עסקית. הוא אינו מחליף בדיקה פרטנית של עורך דין, אבל הוא עוזר למשתמש להבין מה לשאול ומה להכין.</p>
      <img src="PLACEHOLDER_${page.slug}_hero.jpg" alt="ממשק Jus-Tice להצגת ${page.primary} עם כרטיסי עורכי דין, מסמכים ושאלות התאמה בעברית" loading="lazy" width="1280" height="720">
    </header>
${sections.map(([heading, text], index) => `
    <section>
      <h2>${heading}</h2>
      <p>${text}</p>
      <p>${para(heading, page.primary, page.lawRefs)}</p>
      <p>בשלב זה חשוב לא להעתיק הבטחות ממתחרים ולא להציג דירוגים שאין להם מקור. אם יש ביקורת, תמונה, תואר, שנת הסמכה או ניסיון, צריך לדעת מאיפה הגיע המידע ומתי עודכן. אם אין מקור, מציגים את הכרטיס כבסיסי או ממתין לאימות.</p>
      ${index === 2 ? listBlock(services.slice(0, 5)) : ''}
      ${index === 6 ? `<p>קישורים פנימיים מומלצים: ${links.join(' | ')} | <a href="/lawyers/">אינדקס עורכי דין</a> | <a href="/lawyer-registration/">הרשמת עורכי דין</a>.</p>` : ''}
    </section>`).join('\n')}
    <section>
      <h2>שאלות נפוצות</h2>
${faqs.map(([q, a]) => `      <article>
        <h3>${q}</h3>
        <p>${a}</p>
      </article>`).join('\n')}
    </section>
    <section>
      <h2>פנייה מסודרת דרך Jus-Tice</h2>
      <p>כדי להפוך תנועה להכנסה צריך לחבר כל עמוד למערכת: תחום, עיר, דחיפות, מסמך, מקור פנייה ועורך דין מתאים. בלי זה האתר יכול להיראות עשיר אבל לא להפיק לקוחות משלמים. לכן כל עמוד פנימי צריך להוביל לכרטיסי עורכי דין ולמסלול מעקב, לא רק לטקסט.</p>
      <p><a href="/lawyers/">מצאו עורכי דין בתחום</a> | <a href="/lawyer-registration/">פתיחת פרופיל לעורך דין</a> | <a href="/lawyer-plans/">מסלולי חשיפה לעורכי דין</a></p>
    </section>
  </article>
  <script type="application/ld+json">${JSON.stringify(schemaFor(page), null, 2)}</script>
</main>
`;
}

function buildHomepage() {
  const homePage = {
    primary: 'עורך דין',
    title: 'עורכי דין בישראל | Jus-Tice',
    url: '/',
    meta: 'אינדקס עורכי דין, מדריכים משפטיים, כרטיסי פרופיל, בדיקת מסמכים ופנייה מסודרת לעורך דין מתאים בישראל.',
    lawRefs: ['חוק החוזים (תרופות בשל הפרת חוזה), תשל"א-1970', 'חוק המקרקעין, תשכ"ט-1969', 'חוק הירושה, תשכ"ה-1965'],
  };
  const faqs = faqFor(homePage).concat([
    ['למה לא להפריד עורך דין גירושין מעורך דין לענייני משפחה?', 'בישראל המשתמשים וגוגל רואים את שני הביטויים כחלק מאותה כוונת חיפוש מסחרית במקרים רבים. גירושין, מזונות, משמורת וחלוקת רכוש יושבים תחת דיני משפחה. לכן נכון לבנות hub אחד חזק שמחזיק את שני הביטויים, ולתת לדפי משנה לכסות מזונות, משמורת, גישור וחלוקת רכוש.'],
    ['מה הופך דף בית משפטי לדף אמין?', 'אמינות נוצרת משילוב של שפה מדויקת, כרטיסי אנשי מקצוע, מקור מידע, גילוי נאות, תמונות לא גנריות, מדריכים עם חוק וגופים רלוונטיים, ומדידה של פניות. דף בית לא צריך להיראות כמו מצגת שיווקית ריקה. הוא צריך להיות שער עבודה למשתמש ולעורך הדין.'],
    ['האם אפשר להציג עורכי דין שלא הצטרפו?', 'אפשר לבנות כרטיס בסיסי ממידע ציבורי בזהירות, אך אסור להציג תמונה, ביקורת, דירוג, השכלה, ניסיון או מומלצות בלי מקור והרשאה מתאימה. כל כרטיס כזה חייב לכלול סטטוס לא מאומת, מקור, מסלול תיקון, תביעה או הסרה, והצעה מכובדת לשדרוג.'],
    ['מה מצב ההכנסות כרגע?', 'לפי סטטוס העבודה הנוכחי, ההכנסה המאומתת מעורכי דין עדיין עומדת על אפס שקלים. יש שיפור במסלול הרשמה, כרטיסים, תשתית תשלומים ותוכן, אבל המשקיע צריך לראות תשלום אמיתי, חשבונית, סטטוס לקוח ושדרוג כדי לקרוא לזה הכנסה ולא רק מוכנות.'],
    ['מה צריך להראות למשקיע?', 'צריך להראות דף בית נקי, כרטיסי עורכי דין בלי עובדות מזויפות, מסלול הרשמת עורך דין, אזור אישי, פנייה נכנסת, מסלול תשלום או חשבונית ידנית, ודו"ח שמסביר מה חי ומה עדיין חסום. שקיפות כאן עדיפה על הבטחה גדולה שאין מאחוריה עסקה.'],
  ]);

  return `<!-- TITLE: עורכי דין בישראל | META: אינדקס עורכי דין, מדריכים משפטיים ופנייה מסודרת לעורך דין מתאים בישראל. | SLUG: / | TARGET KW: עורך דין -->
<main class="justice-home-seo" dir="rtl" lang="he">
  <section class="justice-hero">
    <p class="justice-kicker">Jus-Tice.co.il | ג׳אסטיס</p>
    <h1>עורך דין בישראל מתחילים לבחור לפי בעיה, עיר, מסמכים ואמון</h1>
    <p>ג׳אסטיס נועד להיות שער עבודה משפטי: אינדקס עורכי דין, מדריכים משפטיים, כרטיסי פרופיל, פניות, אזור אישי לעורכי דין, מסלול שדרוג ותשתית תשלום. המשתמש לא צריך לקבל תמונה גנרית או סיסמה ריקה. הוא צריך להבין מה הבעיה, מי יכול לטפל בה, מה להכין, ומה עדיין לא מאומת.</p>
    <p><a href="/lawyers/">חיפוש עורכי דין</a> | <a href="/lawyer-registration/">פתיחת פרופיל עורך דין</a> | <a href="/lawyer-plans/">מסלולי חשיפה</a></p>
    <img src="PLACEHOLDER_home_hero_legal_marketplace.jpg" alt="מסך דף הבית של Jus-Tice עם חיפוש עורכי דין, כרטיסי פרופיל, תחומי משפט ופניות בעברית" loading="lazy" width="1440" height="810">
  </section>

  <section>
    <h2>למה דף הבית חייב להיראות כמו מוצר משפטי ולא כמו אוסף תמונות</h2>
    <p>משתמש שמחפש עורך דין מגיע בדרך כלל אחרי אירוע. הוא קיבל מכתב, עומד לפני חתימה, מחפש ייצוג בגירושין, בודק עסקת דירה, מתמודד עם חקירה, או מנסה להבין אם יש לו תביעה. לכן דף הבית לא יכול להיות רק חלון ראווה. הוא צריך לתת כיוון פעולה, להראות עורכי דין או כרטיסים רלוונטיים, להסביר מה מאומת ומה לא, ולהוביל לפנייה שנשמרת במערכת.</p>
    <p>האתרים החזקים בתחום משלבים אינדקס, פרופילים, ביקורות, מאמרים, פורומים או תכנים משפטיים, וסימני אמון. Jus-Tice צריך לקחת את היתרונות האלה בלי להעתיק טקסט, בלי להשתמש בתמונות לא מורשות, ובלי להציג עובדות לא בדוקות. היתרון שלנו יכול להיות שקיפות: כרטיס בסיסי, כרטיס מאומת, כרטיס משודרג, פנייה, סטטוס טיפול ותשלום שניתן להוכיח.</p>
    <p>מבחינת גוגל, התוכן חייב להיות מועיל קודם. אין טעם להעמיס פתיח שיווקי לפני התשובה המשפטית. לפי ההנחיות של Google Search Central, תוכן חזק צריך לתת ערך ממשי, מומחיות, מקור, תיאור מלא ודיוק. בתחום משפטי זה קריטי, כי כל טעות בפרופיל או בתוכן עלולה לפגוע גם במשתמש וגם באמון האתר.</p>
  </section>

  <section>
    <h2>הערך למשתמש: למצוא, להבין, לפנות ולעקוב</h2>
    <p>ג׳אסטיס צריך לעבוד בארבע שכבות. הראשונה היא חיפוש לפי תחום ועיר. השנייה היא תוכן שמסביר את הבעיה לפני המכירה. השלישית היא כרטיסי עורכי דין עם רמת אימות ברורה. הרביעית היא מערכת פנייה ומעקב שמראה לעורך הדין מה הגיע, מה נענה ומה עדיין פתוח. בלי השכבה הרביעית אין הכנסה אמיתית, רק תנועה.</p>
    <p>המשתמש צריך לראות אפשרויות כמו שיחה, טופס קצר, בדיקת מסמך, בחירת תחום, בחירת עיר ושמירת פנייה. עורך הדין צריך לראות פרופיל, לידים, סטטוס, תשלום, חשבונית או מסלול ידני. המשקיע צריך לראות שהמערכת לא רק נראית טוב אלא מחזיקה תהליך עסקי שניתן להוכיח.</p>
  </section>

  <section>
    <h2>חיפוש עורך דין לפי תחום ועיר</h2>
    <p>בלוק החיפוש בדף הבית צריך לשאול מעט, אבל לשאול נכון: מה התחום, באיזו עיר או אזור, מה רמת הדחיפות, האם יש מסמכים, והאם המשתמש רוצה שיחה או בדיקת מסמך. אין צורך להעמיס טופס ארוך לפני שהמשתמש מבין שהוא במקום הנכון. החיפוש צריך להוביל לכרטיסים, מדריכים ופנייה שנרשמת עם מקור ברור.</p>
    <p>בצד עורך הדין, אותם פרמטרים הופכים למוצר: הופעות בפרופיל, לידים לפי תחום, פניות שלא נענו, מסלול שדרוג, תמונת פרופיל, מאמרים, ביקורות בעתיד ותשלום. כך התוכן מפסיק להיות רק SEO והופך למערכת מכירות.</p>
  </section>

  <section>
    <h2>תחומי משפט מרכזיים</h2>
${homeCategories.map(([title, url, text]) => `    <article>
      <h3><a href="${url}">${title}</a></h3>
      <p>${text}</p>
    </article>`).join('\n')}
  </section>

  <section>
    <h2>מרכז נדל"ן ומשפט מקרקעין</h2>
    <p>נדל"ן הוא לא רק עוד תחום משפטי, אלא צומת כסף מרכזי. דירה, מס שבח, היטל השבחה, טאבו, קבלן, ליקויי בנייה, פינוי בינוי, ועד בית ורישום בית משותף יכולים להפוך את ג׳אסטיס למערכת שמשרתת גם עורכי דין וגם ספקים מקצועיים כמו שמאים, מתווכים, יועצי משכנתאות ומומחי בדק בית. אבל התצוגה חייבת להפריד בין עורך דין לבין ספק מקצועי ולא ליצור בלבול.</p>
    <p>העמוד המרכזי צריך לקשר לעורך דין מקרקעין, בדיקת חוזה מכר, מס שבח, רישום זכויות, איחור במסירת דירה, ליקויי בנייה ושירותי בדיקה. כל כרטיס צריך להיות פרופורציונלי, ללא תמונת stock מוזרה, עם alt text ברור, width ו-height כדי למנוע קפיצות layout, ועם תווית שמסבירה אם מדובר בכרטיס מאומת או בסיסי.</p>
    <img src="PLACEHOLDER_home_real_estate_hub.jpg" alt="מרכז נדל״ן משפטי באתר Jus-Tice עם חוזה מכר, טאבו, מס שבח וכרטיסי עורכי דין מקרקעין" loading="lazy" width="1280" height="720">
  </section>

  <section>
    <h2>שקיפות מחירים ושכר טרחה</h2>
    <p>שקיפות מחיר אינה אומרת מחיר אחיד. היא אומרת הסבר ברור על מה משפיע על העלות: דחיפות, מסמכים, מספר דיונים, מומחים, מכתבים, היקף משא ומתן והאם מדובר בבדיקה ראשונית או ייצוג מלא. בדיני משפחה העלות יכולה להשתנות לפי ילדים ורכוש. במקרקעין היא תלויה בשווי העסקה, רישום ומיסוי. ברשלנות רפואית נדרשות חוות דעת. בפלילי הדחיפות משנה מאוד. במיסים ועסקים יש משקל למורכבות ולסכום החשיפה.</p>
    <p>דף הבית צריך להסביר את זה בלי להפחיד. אפשר להציג טווחי שירותים, לא הבטחות. אפשר להציע בדיקת התאמה לפני ייצוג. אפשר למדוד כמה משתמשים הגיעו משאלת מחיר לפנייה. אבל אסור להבטיח מחיר או תוצאה בלי בסיס עסקי ומשפטי.</p>
  </section>

  <section>
    <h2>מדריכים משפטיים מובילים</h2>
    <p>המדריכים בדף הבית צריכים להיבחר לפי חיבור להכנסה ולכוונת חיפוש: עורך דין גירושין ודיני משפחה, חוזה דירה, רשלנות רפואית, ירושה וצוואה, חקירה במשטרה, פיטורים ושימוע, תביעה ייצוגית, ביטול עסקה ומיסים לעסק. כל מדריך צריך לענות לשאלה לפני שהוא מוכר שירות. אחרי התשובה, אפשר להציג עורכי דין, ספקים או מסלול מסמכים.</p>
    <p>התוכן צריך להימנע מפתיחים גנריים. במקום משפטים ריקים, כל מדריך צריך להתחיל במצב הישראלי האמיתי: איזה גוף מטפל, איזה מסמך נדרש, מה המועד, מה הטעות הנפוצה ומה עורך הדין בודק. זה מעלה רלוונטיות, אמון וסיכוי המרה.</p>
  </section>

  <section>
    <h2>אמון, כרטיסים וביקורות</h2>
    <p>ביקורות הן מנוע חזק, אבל רק אם יש מדיניות אימות. LawReviews מדגישה ביקורות עם מנגנון אימות, Din מדגישה המלצות ופרופיל כנכס דיגיטלי, Justia ו-Avvo משתמשים במודל claim profile. Jus-Tice צריך לבנות את זה בזהירות: כרטיס בסיסי לא מאומת, כרטיס נטען על ידי בעל הפרופיל, כרטיס מאומת, ביקורות שנאספו לפי מדיניות, ודיווח על פניות שלא נענו.</p>
    <p>עד שאין ביקורות מאומתות, עדיף להראות "ביקורות טרם נאספו" מאשר להמציא דירוג. עד שאין תמונה מורשית, עדיף אותיות ראשי תיבות נקיות מאשר צילום stock של אדם זר. דווקא הצניעות הזו יכולה להיות יתרון מול משקיע, כי היא מראה שליטה בסיכון.</p>
  </section>

  <section>
    <h2>איך כרטיס עורך דין צריך להיראות בדף הבית</h2>
    <p>כרטיס עורך דין בדף הבית הוא לא מקום לניסוי. הוא צריך להיות קצר, נקי, מדויק ויציב מבחינת layout. התמונה או האותיות הראשיות לא יכולות לכסות את הטקסט. השם לא יכול לדחוף את הכפתורים. תגית "מומלץ" לא יכולה להופיע אם אין מקור ברור. אם מדובר בכרטיס בסיסי, צריך להציג זאת בצורה מכובדת: תחום, עיר, מקור, סטטוס אימות, אפשרות לתביעה או עדכון, והצעה לשדרוג. אם מדובר בכרטיס מאומת, אפשר להציג תמונה אמיתית, שירותים, מאמרים, ביקורות מאומתות ופעולות קשר.</p>
    <p>המשקיע רואה את הדף הראשון לפני שהוא קורא את הדוחות. לכן הכרטיסים צריכים לשדר מוצר ולא טיוטה. יחס תמונה קבוע, width ו-height, alt בעברית, טקסט קצר, שורת תחומי טיפול, מצב אימות וכפתור פעולה אחד או שניים. אין צורך לדחוס כל עובדה בכרטיס. העובדות העמוקות שייכות לפרופיל הפנימי. דף הבית מציג בחירה ראשונה, לא קורות חיים מלאים.</p>
    <p>בפרופיל הפנימי אסור לפרסם עורכי דין אחרים בתוך גוף הפרופיל. המשתמש נכנס לפרופיל כדי לבדוק את אותו עורך דין. אפשר להציג שירותים קשורים או ספקים משלימים רק באזור ברור ונפרד, עם גילוי שזהו אזור ממומן או שירות משלים. פרופיל שמרגיש כמו פרסומת לאחרים יפגע במכירה לעורך הדין, כי אף עורך דין לא ירצה לשלם על עמוד שמוציא ממנו תנועה.</p>
  </section>

  <section>
    <h2>שכבת CMS: מה חייב להיות ניתן לניהול</h2>
    <p>כל מה שמופיע על עורכי דין או ספקים צריך להיות נשלט מהמערכת. לא hard-coded, לא רשימה שנעלמת בתוך קובץ, ולא פרופילים שאי אפשר להסתיר. בעל האתר צריך יכולת לסמן כרטיס כפעיל, מוסתר, ממתין לאימות, מאומת, ממומן, מוחזק לבדיקה, או דורש תיקון. צריך גם bulk action: הסתרה קבוצתית, החזרה לפרסום, סימון מקור נדרש, סימון תמונה לא מאושרת, וסימון מוכן לפנייה מסחרית.</p>
    <p>אותו עיקרון חל על ספקים משפטיים. שמאי, מגשר, חוקר פרטי, נוטריון או יועץ מס אינם עורכי דין בהכרח, ולכן הם צריכים post type או קטגוריה נפרדת, תווית מקצועית ברורה ומסלול אישור משלהם. אם הם מופיעים ליד עורכי דין, הכרטיס צריך להסביר למה הם רלוונטיים ומה הסטטוס שלהם. זו שכבת הכנסה חשובה, אבל היא חייבת להיות נקייה משפטית ושיווקית.</p>
    <p>בצד המסחרי, המערכת צריכה להראות לבעל האתר כמה כרטיסים בסיסיים קיימים, כמה מהם נתבעו, כמה שודרגו, כמה קיבלו פנייה, כמה לא ענו, וכמה שילמו. בלי הנתונים האלה אי אפשר לדווח למשקיע על התקדמות אמיתית. "יש הרבה כרטיסים" אינו KPI. כרטיס שהוביל לפנייה, תשלום או שדרוג הוא KPI.</p>
  </section>

  <section>
    <h2>עץ תוכן: עמודי כסף, מדריכים ותמיכה</h2>
    <p>האתר צריך עץ תוכן ברור. בקצה העליון יש עמודי כסף: עורך דין, עורך דין גירושין ודיני משפחה, עורך דין מקרקעין, עורך דין רשלנות רפואית, עורך דין פלילי, עורך דין ירושה, עורך דין דיני עבודה ועורך דין מיסים. מתחת לכל עמוד כסף יושבים מדריכים שמסבירים תתי נושאים. מתחת להם יכולים להיות פסקי דין, כלים, שאלות נפוצות ומאמרים. כל שכבה צריכה לקשר למעלה ולמטה.</p>
    <p>בדיני משפחה, עורך דין גירושין ועורך דין לענייני משפחה צריכים לשבת יחד. התמיכה מגיעה ממזונות, משמורת, חלוקת רכוש, הסכם ממון, גישור, אישור הסכם בבית הדין הרבני ומדריכי עלות. במקרקעין, התמיכה מגיעה מחוזה מכר, מס שבח, טאבו, רישום בית משותף, איחור במסירה וליקויי בנייה. בפלילי, התמיכה מגיעה מחקירה במשטרה, סגירת תיק, מחיקת רישום, מעצר ועבירות ספציפיות.</p>
    <p>העץ הזה חשוב גם נגד קניבליזציה. אם שני עמודים מנסים לדרג על אותה כוונה, גוגל מתקשה להבין מי המרכז. אם עמוד מדריך מסביר שאלה צרה ומקשר לעמוד כסף, המערכת מתחזקת. לכן אין לפרסם עוד ועוד עמודים רק כי יש מילת מפתח. צריך לשאול אם העמוד הוא hub, spoke, tool, profile, supplier או article.</p>
  </section>

  <section>
    <h2>שפת מותג: משפטית, ישראלית, מדויקת</h2>
    <p>הטון של Jus-Tice צריך להיות בטוח אבל לא יהיר. במקום "המומחים הטובים בישראל" עדיף לכתוב "בחרו לפי תחום, עיר, מסמכים ורמת אימות". במקום "נשיג לכם פיצוי" עדיף לכתוב "בדקו אם יש עילה, אילו מסמכים חסרים ומה הסיכונים". במקום "ייעוץ חינם" אם אין הצעה כזו באמת, עדיף "פתיחת פנייה ראשונית". השפה הזו מוכרת יותר טוב בטווח הארוך כי היא לא נשמעת מזויפת.</p>
    <p>מותר להשתמש במונחים מקצועיים ישראליים: נסח טאבו, הערת אזהרה, מרוץ סמכויות, צו ירושה, כתב אישום, שימוע לפני פיטורים, מס שבח, חוות דעת מומחה, מכתב התראה, פשרה, בקשה לסעד זמני. אבל כל מונח כזה צריך להופיע בהקשר, לא כקישוט. המשתמש צריך לדעת למה המונח משנה את הפעולה הבאה.</p>
    <p>הדף גם צריך לדבר לעורכי דין. עורך דין שוקל להצטרף כאשר הוא רואה שהאתר שומר על המוניטין שלו, לא מפיץ טעויות ולא מציג אותו ליד פרופילים לא בדוקים. לכן אמינות כלפי המשתמש היא גם כלי מכירות לעורכי הדין. ככל שהמערכת יותר נקייה, כך קל יותר לבקש תשלום חודשי.</p>
  </section>

  <section>
    <h2>מה לא מציגים עד שיש הוכחה</h2>
    <p>לא מציגים "מעל 10,000 לקוחות" אם אין מערכת שמוכיחה זאת. לא מציגים "עורכי הדין המובילים" אם אין מתודולוגיית דירוג גלויה. לא מציגים "תשלום מאושר" אם יש רק אישור אתר לסליקה ולא עסקה. לא מציגים "ביקורות" אם אין מנגנון אימות. לא מציגים תמונת עורך דין אם היא לא הועלתה או אושרה. ההבדל בין אתר רציני לאתר גנרי הוא היכולת לומר "עדיין לא" במקום להמציא.</p>
    <p>הדף יכול ועדיין צריך להיות מרשים: מערכת נקייה, כרטיסים מקוריים, צילום מוצר איכותי, שפה מדויקת, מסלול הרשמה, תשלום מוכן לבדיקה, דוחות סטטוס ותוכנית הכנסה. אבל כל דבר שמוצג חייב להיות ניתן להסבר. למשקיע מותר לראות חסמים, כל עוד ברור שיש שליטה בדרך לפתרון. זו גם הדרך להפוך אמון למכירה ולא רק לעוד מצגת יפה ומשכנעת מאוד.</p>
  </section>

  <section>
    <h2>תשתית הכנסה לעורכי דין</h2>
    <p>המסלול העסקי חייב להיות גלוי: עורך דין רואה דף הרשמה, בוחר תחום ועיר, פותח פרופיל בסיסי או משודרג, מקבל פניות, רואה סטטוס טיפול, משלם או מקבל חשבונית, ומבקש תמיכה בתוך המערכת. כרגע סטטוס ההכנסה המאומתת הוא אפס שקלים, ולכן הדף צריך להציג מוכנות ולא לטעון להכנסה שלא קיימת. לאחר בדיקת תשלום אמיתי, אפשר להציג proof: עסקה, חשבונית, מייל, סטטוס לקוח ותהליך החזר אם אושר.</p>
    <p>Grow/Morning אישרו את האתר לסליקה לפי המייל שהתקבל. המשמעות העסקית היא שהחסימה עברה משאלת אישור לשאלת חיבור בפועל: תוסף WooCommerce או API, מוצר בדיקה, תשלום קטן, חשבונית, מייל והוכחת סטטוס. זה חייב להיות מוצג למשקיע בכנות.</p>
  </section>

  <section>
    <h2>שאלות נפוצות</h2>
${faqs.map(([q, a]) => `    <article>
      <h3>${q}</h3>
      <p>${a}</p>
    </article>`).join('\n')}
  </section>

  <section>
    <h2>הפעולה הבאה</h2>
    <p>אם אתה משתמש שמחפש עורך דין, התחל מתחום ועיר, הכן מסמכים ופתח פנייה. אם אתה עורך דין, פתח פרופיל, אמת פרטים, העלה תמונה אמיתית, בחר תחומי טיפול והפעל מסלול חשיפה. אם אתה משקיע, דרוש לראות את המסלול השלם: דף בית, כרטיס, פנייה, אזור אישי, תשלום, חשבונית ודיווח הכנסה.</p>
    <p><a href="/lawyers/">חיפוש עורכי דין</a> | <a href="/lawyer-registration/">הרשמה לעורכי דין</a> | <a href="/lawyer-dashboard/">אזור אישי</a></p>
  </section>

  <script type="application/ld+json">${JSON.stringify(schemaFor(homePage, true), null, 2)}</script>
</main>
`;
}

const competitors = [
  {
    domain: 'din.co.il',
    urls: ['https://www.din.co.il/', 'https://www.din.co.il/whyadv.asp', 'https://www.din.co.il/recomend.asp', 'https://www.din.co.il/forum/lawyers.asp'],
    h1_observed: ['עורכי דין בישראל, משרדי עורכי דין בכל תחום', 'יתרונות הפרסום באתר', 'עורכי דין ממליצים על הפרסום באתר שלנו', 'פורום עורכי דין'],
    patterns: ['broad directory', 'profile as digital asset', 'articles and forums', 'lead promises', 'city navigation', 'recommendations'],
    use_for_justice: ['professional profile asset', 'lead-focused lawyer onboarding', 'field-city directory', 'articles after helpful answer', 'recommendation system only after verification'],
  },
  {
    domain: 'psakdin.co.il',
    urls: ['https://www.psakdin.co.il/', 'https://www.psakdin.co.il/Lawyers', 'https://www.psakdin.co.il/Register?UserType=Lawyer'],
    h1_observed: ['public pages sampled through web search, full H1 capture not completed'],
    patterns: ['portal authority', 'lawyer index', 'case law and magazine adjacency', 'registration and login visibility', 'legal services navigation'],
    use_for_justice: ['legal portal depth', 'case-law adjacency where useful', 'registration path visible in header', 'profile connected to articles and services'],
  },
  {
    domain: 'lawreviews.co.il',
    urls: ['https://www.lawreviews.co.il/', 'https://www.lawreviews.co.il/about', 'https://www.lawreviews.co.il/join', 'https://www.lawreviews.co.il/provider/profile-law-reviews'],
    h1_observed: ['עורכי דין מומלצים: דירוג שקוף לפי חוות דעת', 'אודות LawReviews', 'public join/profile pages sampled'],
    patterns: ['reviews-first trust', 'verified review policy', 'join form', 'rich profiles', 'missed-lead and service quality concept'],
    use_for_justice: ['review readiness module', 'claim profile', 'verified review governance before publishing ratings', 'profile completeness checklist'],
  },
  {
    domain: 'justia.com',
    urls: ['https://www.justia.com/marketing/lawyer-directory/', 'https://www.justia.com/lawyers', 'https://lawyers.justia.com/faq'],
    h1_observed: ['Justia Lawyer Directory', 'Lawyers, Legal Aid & Pro Bono Services'],
    patterns: ['free claim profile', 'premium placements', 'practice-location directory', 'lawyer FAQ'],
    use_for_justice: ['claim profile flow', 'sponsored placement separated from payment proof', 'practice-location taxonomy'],
  },
  {
    domain: 'avvo.com',
    urls: ['https://support.avvo.com/hc/en-us/articles/360013500772-What-is-the-Avvo-Rating-'],
    h1_observed: ['What is the Avvo Rating?'],
    patterns: ['claimed profile affects completeness', 'unclaimed profile has limited information', 'rating governance risk'],
    use_for_justice: ['basic/unclaimed cards must be visibly limited', 'avoid fake ratings', 'claim/update/remove path'],
  },
  {
    domain: 'mishpati.co.il',
    urls: ['https://www.mishpati.co.il/find-lawyer/family-law-and-divorce'],
    h1_observed: ['804 עורכי דין דיני משפחה וגירושין'],
    patterns: ['large legal directory', 'family and divorce combined'],
    use_for_justice: ['family/divorce combined taxonomy signal', 'directory count proof only when real'],
  },
  {
    domain: 'midrag.co.il',
    urls: ['https://www.midrag.co.il/Content/Tip/14623'],
    h1_observed: ['התנגדות לצוואה | מידע ומחירים להתנגדות לצוואה'],
    patterns: ['cost transparency', 'consumer service framing', 'practical questions'],
    use_for_justice: ['price transparency sections for legal services without fixed false promises'],
  },
  {
    domain: 'gov.il/knesset',
    urls: ['https://www.gov.il/he/service/real-estate-first-registration-application', 'https://fs.knesset.gov.il/7/law/7_lsr_211750.pdf', 'https://fs.knesset.gov.il/6/law/6_lsr_208977.PDF'],
    h1_observed: ['official legal and service references'],
    patterns: ['source authority', 'statutory names', 'public process pages'],
    use_for_justice: ['cite laws and official bodies in content, not as decoration'],
  },
];

const serpXray = targetPages.slice(0, 5).map((page, index) => ({
  keyword: page.primary,
  priority_score: null,
  priority_status: 'BLOCKED_NO_KDI_CPC_VOLUME_EXPORT',
  observed_serp_sources: sourceLog.slice(8 + index * 4, 12 + index * 4).map(([label, url]) => ({ label, url })),
  top_10_urls: [],
  serp_features: ['manual public web search snippets observed', 'full Google IL incognito/VPN top-10 capture not available in this environment'],
  title_patterns: ['primary keyword first', 'specialty plus trust/proof', 'cost/process guide where informational-commercial mixed'],
  meta_patterns: ['service plus process', 'no guaranteed outcome', 'city/practice where relevant'],
  intent: page.intent,
  paa_questions: faqFor(page).slice(0, 4).map(([q]) => q),
  related_searches: page.secondaries,
  status: 'PARTIAL_RESEARCH_ONLY',
}));

const newPages = targetPages.map((page) => ({
  slug: page.url,
  primary_keyword: page.primary,
  secondary_keywords: page.secondaries,
  intent: page.intent,
  conversion_goal: 'matched lawyer inquiry, lawyer profile claim or plan upgrade',
  target_word_count: 3000,
  internal_links_to: targetPages.filter((other) => other.slug !== page.slug).slice(0, 5).map((other) => other.url).concat(['/lawyers/', '/lawyer-registration/', '/lawyer-plans/']),
  title: page.title,
  meta: page.meta,
  status: 'DRAFT_READY_FOR_HUMAN_LEGAL_SEO_REVIEW_NOT_PUBLISHED',
}));

function mdTable(rows) {
  return rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
}

const homepageHtml = buildHomepage();
fs.writeFileSync(path.join(outDir, 'homepage.html'), homepageHtml, 'utf8');
fs.writeFileSync(path.join(outDir, 'homepage_meta.json'), JSON.stringify({
  title: 'עורכי דין בישראל | Jus-Tice',
  meta: 'אינדקס עורכי דין, מדריכים משפטיים ופנייה מסודרת לעורך דין מתאים בישראל.',
  slug: '/',
  target_keyword: 'עורך דין',
  status: 'draft_ready_for_wordpress_custom_html_review',
}, null, 2), 'utf8');

const homepageImages = [
  ['PLACEHOLDER_home_hero_legal_marketplace.jpg', 'Wide clean Hebrew legal marketplace interface, dark navy and white, real product UI, lawyer cards, search fields, no fake faces, professional Israeli legal-tech style'],
  ['PLACEHOLDER_home_real_estate_hub.jpg', 'Israeli real estate legal dashboard, contract review, land registry, tax chips, lawyer cards, document upload UI, no generic stock people'],
  ...targetPages.map((page) => [`PLACEHOLDER_${page.slug}_hero.jpg`, `Professional Hebrew legal-tech UI hero for ${page.primary}, showing documents, source-gated lawyer cards and action buttons, no fake portrait claims`]),
].map(([file, prompt]) => ({ file, prompt, alt_policy: 'Use descriptive Hebrew alt text tied to the section and do not use unlicensed lawyer portraits.' }));
fs.writeFileSync(path.join(outDir, 'homepage_images.json'), JSON.stringify(homepageImages, null, 2), 'utf8');

for (const page of targetPages) {
  fs.writeFileSync(path.join(internalDir, `${page.slug}.html`), buildInternalPage(page), 'utf8');
}

fs.writeFileSync(path.join(outDir, 'STEP_1_keywords.json'), JSON.stringify({
  generated_at: `${today} Asia/Jerusalem`,
  honest_status: '240 candidates generated, but only the owner-provided baseline and internal GSC queue rows have numeric evidence. CPC and KDI are not filled because no premium keyword source is connected.',
  baseline_facts_used: {
    current_keywords: 420,
    estimated_traffic_per_month: 335,
    organic_cost_usd: 298,
    note: 'Provided by owner in prompt; not recollected.',
  },
  candidates: keywords,
}, null, 2), 'utf8');

fs.writeFileSync(path.join(outDir, 'STEP_2_serp_xray.json'), JSON.stringify({
  generated_at: `${today} Asia/Jerusalem`,
  honest_status: 'Partial public web x-ray. Full Google IL top-10 capture, DA/Trust, PAA and related searches require a live SERP export or browser/VPN capture.',
  xray: serpXray,
}, null, 2), 'utf8');

fs.writeFileSync(path.join(outDir, 'STEP_2_competitors.json'), JSON.stringify({
  competitors: competitors.map((c) => ({
    domain: c.domain,
    repeated_pattern: c.patterns,
    used_for_blueprint: c.use_for_justice,
    urls_checked_or_logged: c.urls,
  })),
}, null, 2), 'utf8');

for (const comp of competitors) {
  fs.writeFileSync(path.join(competitorDir, `${comp.domain.replace(/[^a-z0-9]+/gi, '-')}.json`), JSON.stringify({
    generated_at: `${today} Asia/Jerusalem`,
    source_scope: 'public pages and search-result snippets only; no private dashboards, forms, or account creation',
    ...comp,
    extracted_homepage: {
      h1: comp.h1_observed[0],
      h2_h6_hierarchy: [],
      word_count: null,
      section_count: null,
      image_count: null,
      schema_types: [],
      trust_signals: comp.patterns,
      cta_patterns: comp.use_for_justice,
      internal_link_patterns: ['practice', 'city', 'profile', 'article', 'contact or join'],
      status: 'PARTIAL_NEEDS_FULL_HTML_SCRAPE_OR_FIRECRAWL',
    },
  }, null, 2), 'utf8');
}

fs.writeFileSync(path.join(outDir, 'STEP_4_blueprint.md'), `# STEP 4 - Blueprint Synthesis

Generated: ${today}

## Honest Status

This synthesis is based on public competitor pages, public snippets, existing Jus-Tice reports and official Google/legal sources. It is not a Semrush/Firecrawl full crawl. I am not claiming full top-10 SERP capture or full competitor HTML extraction.

## Common Section Pattern

1. Hero with primary legal intent, not generic brand language.
2. Search or lead module by practice and city.
3. Directory or profile cards with clear trust state.
4. Practice/category grid.
5. Content guides, articles or forum-style authority.
6. Reviews, recommendations or claim-profile trust mechanism.
7. Lawyer registration/join path.
8. Contact, phone, WhatsApp or consultation CTA.
9. Legal disclaimer and source/update policy.

## Must-Have Schema

- Organization
- WebSite + SearchAction
- WebPage
- BreadcrumbList
- LegalService or Attorney where the page is about legal service matching
- FAQPage for on-page FAQ, with the warning that Google does not always show FAQ rich results

## Trust Signals

- Claimed versus unclaimed profile state.
- Verified details and source URLs.
- Real photo/logo only when permitted.
- No fake reviews, fake ratings or unverified education claims.
- Lawyer-side dashboard: leads, missed leads, profile completeness, billing and support.
- User-side clarity: field, city, documents, urgency and next step.

## Title Formula

\`Primary keyword + concrete service/context | Jus-Tice\`

Examples:

- \`עורך דין גירושין ומשפחה | Jus-Tice\`
- \`עורך דין מקרקעין ונדל"ן | Jus-Tice\`
- \`עורך דין רשלנות רפואית | Jus-Tice\`

## Copy Formula

Direct legal situation first, process second, documents third, lawyer matching fourth, CTA fifth. No sales paragraph before the useful answer.
`, 'utf8');

fs.writeFileSync(path.join(outDir, 'STEP_5_new_pages.json'), JSON.stringify(newPages, null, 2), 'utf8');

fs.writeFileSync(path.join(outDir, 'STEP_5_gaps.md'), `# STEP 5 - Gap Analysis

Generated: ${today}

## Honest Status

Keyword-gap and backlink-gap are incomplete because no Semrush, Ahrefs, Google Keyword Planner or authenticated GSC export is available in this process. I used the owner-provided baseline, existing repo GSC decision queues, the current sitemap, competitor public pages and public web search snippets.

## Main Gaps

1. Revenue proof gap: organic traffic exists, but realized lawyer revenue is still NIS 0.
2. Profile trust gap: basic cards exist, but public trust requires verified facts, real images or clean initials, and no fake biography details.
3. Supplier marketplace gap: \`justice_supplier\` exists in code, but public legal-service supplier cards are not visible yet.
4. Payment proof gap: Grow/Morning site clearing approval exists, but plugin/API setup, controlled payment, invoice and refund proof are still missing.
5. SEO consolidation gap: family/divorce must be one commercial authority cluster, not separated into competing pillars.
6. Homepage visual gap: investor complained about generic pictures and unprofessional cards; image aspect ratios and source-gated cards must stay priority.
7. SERP data gap: hard keyword volume/CPC/KDI cannot be truthfully completed without export access.

## Recommended New Pages

${newPages.map((p, i) => `${i + 1}. ${p.primary_keyword} - ${p.slug} - ${p.intent}`).join('\n')}

## Anti-Cannibalization Rule

Commercial hub pages own broad high-value phrases. Support pages answer specific legal questions and link back to the hub. Do not create another divorce/family pillar that competes with the same Hebrew signal.
`, 'utf8');

fs.writeFileSync(path.join(outDir, 'seo-meta.json'), JSON.stringify([
  { url: '/', title: 'עורכי דין בישראל | Jus-Tice', description: 'אינדקס עורכי דין, מדריכים משפטיים ופנייה מסודרת לעורך דין מתאים בישראל.', canonical: 'https://jus-tice.co.il/', og_title: 'עורכי דין בישראל | Jus-Tice', og_description: 'חיפוש עורכי דין, מדריכים וכרטיסי פרופיל עם פנייה מסודרת.', status: 'draft' },
  ...targetPages.map((page) => ({ url: page.url, title: page.title, description: page.meta, canonical: `https://jus-tice.co.il${page.url}`, og_title: page.title, og_description: page.meta, status: 'draft' })),
], null, 2), 'utf8');

fs.writeFileSync(path.join(outDir, 'schema-bundle.json'), JSON.stringify({
  homepage: schemaFor({ primary: 'עורך דין', title: 'עורכי דין בישראל | Jus-Tice', url: '/', meta: '', lawRefs: [] }, true),
  pages: Object.fromEntries(targetPages.map((page) => [page.slug, schemaFor(page)])),
}, null, 2), 'utf8');

fs.writeFileSync(path.join(outDir, 'images-to-generate.json'), JSON.stringify(homepageImages.concat([
  { file: 'lawyer-card-initials-system.jpg', prompt: 'Set of clean RTL Hebrew lawyer profile cards using initials badges, no fake portraits, navy and white brand palette, premium legal-tech dashboard', alt_policy: 'Use for unclaimed profiles only.' },
  { file: 'verified-lawyer-profile-example.jpg', prompt: 'Verified Hebrew lawyer profile mini-site UI with real-photo placeholder area, source proof, services, articles and contact actions, no real person likeness', alt_policy: 'Use only as UI/product illustration until lawyer uploads real media.' },
]), null, 2), 'utf8');

const linkRows = [
  ['from_url', 'to_url', 'anchor_text'],
  ['/', '/lawyers/', 'חיפוש עורכי דין'],
  ['/', '/lawyer-registration/', 'פתיחת פרופיל עורך דין'],
  ['/', '/lawyer-plans/', 'מסלולי חשיפה לעורכי דין'],
  ...targetPages.flatMap((page) => [
    [page.url, '/lawyers/', `עורכי דין בתחום ${page.primary}`],
    [page.url, '/lawyer-registration/', 'פתיחת פרופיל לעורך דין'],
    [page.url, '/', 'Jus-Tice'],
    ...targetPages.filter((other) => other.slug !== page.slug).slice(0, 3).map((other) => [page.url, other.url, other.primary]),
  ]),
];
fs.writeFileSync(path.join(outDir, 'internal-linking-map.csv'), linkRows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n'), 'utf8');

fs.writeFileSync(path.join(outDir, 'research-log.md'), `# Research Log

Generated: ${today}

## Honesty Statement

I used public web research, official Google documentation, official/legal public sources, existing Jus-Tice project reports and owner-provided baseline facts. I did not use Semrush, Ahrefs, Firecrawl, Google Keyword Planner or authenticated GSC because no connected credentials or exported datasets are available to this process. Metrics that require those systems are marked missing.

## Sources

${mdTable([
  ['#', 'Source', 'URL', 'Use'],
  ['---:', '---', '---', '---'],
  ...sourceLog.map(([label, url, use], index) => [String(index + 1), label, url, use]),
])}
`, 'utf8');

fs.writeFileSync(path.join(outDir, '90-day-roadmap.md'), `# 90-Day SEO and Revenue Roadmap

## Weeks 1-2

Publish nothing blindly. Verify payment proof, fix homepage visuals, remove generic images, keep profile fact gates, and prepare one controlled family/divorce hub update. Collect Semrush or Keyword Planner export for STEP 1.

## Weeks 3-4

Deploy homepage improvements after legal and visual QA. Publish or update the family/divorce hub so עורך דין גירושין and עורך דין לענייני משפחה reinforce one commercial cluster. Add source-gated lawyer cards only with review status.

## Weeks 5-6

Build real-estate hub and supplier marketplace pilot. Add legal-service providers only with CMS records, categories, approval status and hide/reveal controls.

## Weeks 7-8

Publish malpractice, inheritance and criminal pillars after source review. Add internal links from existing high-impression pages. Do not redirect old URLs without approval.

## Weeks 9-10

Start lawyer outreach: basic card exists, claim profile, add real photo, activate lead tracking, choose plan. Use manual invoice if recurring payments are still not proven.

## Weeks 11-12

Review GSC, leads, profile views, paid conversions, invoices and support requests. Expand only pages that show impressions or revenue path. Backlink work should focus on Israeli legal/business sources, not spam directories.
`, 'utf8');

fs.writeFileSync(path.join(outDir, 'wordpress-deployment.md'), `# WordPress Deployment Notes

1. Use Gutenberg Custom HTML block for \`homepage.html\` or each internal page draft.
2. Paste only after legal/SEO review and after deciding whether this replaces an existing page or creates a new one.
3. Do not change slugs, canonicals, noindex, redirects, taxonomies or sitemaps from this pack without owner approval.
4. Put title and meta from \`seo-meta.json\` in Yoast.
5. Add JSON-LD only once. If Yoast already outputs overlapping schema, review duplicates before adding \`schema-bundle.json\`.
6. Generate or upload images from \`images-to-generate.json\`; do not use fake lawyer portraits.
7. For unclaimed lawyer cards use initials badge, not generic people photos.
8. After publishing, run visual QA on mobile and desktop, Rich Results Test, link check and GSC annotation.
9. Payment language must remain honest until Grow/Morning plugin/API, real payment, invoice and refund proof are verified.
`, 'utf8');

const wordCount = (text) => (text.match(/[\u0590-\u05FF\w"'״׳]+/g) || []).length;
const forbidden = ['—', 'במאמר זה', 'לסיכום', 'delve'];
const outputsToCheck = [
  ['homepage.html', homepageHtml, 5000],
  ...targetPages.map((page) => [`internal-pages/${page.slug}.html`, fs.readFileSync(path.join(internalDir, `${page.slug}.html`), 'utf8'), 3000]),
];
const gateResults = outputsToCheck.map(([file, text, minWords]) => ({
  file,
  word_count: wordCount(text),
  min_words: minWords,
  forbidden_hits: forbidden.filter((term) => text.includes(term)),
  pass_words: wordCount(text) >= minWords,
}));

const quality = {
  generated_at: `${today} Asia/Jerusalem`,
  honest_commit_status_at_generation: 'not committed yet',
  gates: {
    keyword_metrics_source: 'FAIL_PARTIAL - no Semrush/Ahrefs/Keyword Planner/GSC export connected; do not claim final KD/CPC/volume universe',
    no_low_volume_keywords: 'PARTIAL - unknown volume is left null, not fabricated',
    homepage_word_count: gateResults.find((r) => r.file === 'homepage.html'),
    internal_word_counts: gateResults.filter((r) => r.file !== 'homepage.html'),
    forbidden_phrases: gateResults.flatMap((r) => r.forbidden_hits.map((hit) => `${r.file}: ${hit}`)),
    faq_schema: 'PASS_DRAFT - generated for homepage and internal pages',
    internal_links: 'PASS_DRAFT - map generated',
    title_meta_lengths: 'PASS_DRAFT - short draft titles and descriptions generated',
    research_sources_count: sourceLog.length,
    rich_results_test: 'NOT_RUN - cannot honestly claim external Rich Results Test execution from this script',
  },
};

fs.writeFileSync(path.join(outDir, 'quality-gates.json'), JSON.stringify(quality, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'quality-gates.md'), `# Quality Gates

Generated: ${today}

## Honest Result

- Keyword metrics gate: FAIL PARTIAL. No Semrush, Ahrefs, Keyword Planner or authenticated GSC export is connected in this process.
- I did not invent CPC, KD/KDI or full volume values.
- Homepage and internal page draft word counts are checked locally.
- Rich Results Test was not externally run, so I am not claiming it passed.

## Word Counts

${mdTable([
  ['File', 'Words', 'Required', 'Pass', 'Forbidden hits'],
  ['---', '---:', '---:', '---', '---'],
  ...gateResults.map((r) => [r.file, String(r.word_count), String(r.min_words), r.pass_words ? 'PASS' : 'FAIL', r.forbidden_hits.join('; ') || 'none']),
])}

## Source Count

Research log source count: ${sourceLog.length}
`, 'utf8');

fs.writeFileSync(path.join(outDir, 'STEP_0_honest-access-report.md'), `# STEP 0 - Honest Access Report

Generated: ${today}

## What I Did

- Checked the repository state.
- Checked whether Semrush, Ahrefs, Firecrawl, GSC, Google Keyword Planner or related API credentials are exposed in the environment.
- Used public web research, existing project reports and owner-provided baseline facts.
- Built a WordPress-ready draft pack under \`mnt/documents/justice\`.

## What I Did Not Do

- I did not publish to WordPress.
- I did not create CMS records.
- I did not copy competitor text, photos, reviews, ratings or contact data.
- I did not use paid SEO or LLM APIs.
- I did not fabricate CPC, KDI or volume values.
- I did not send email or charge any payment in this cycle.

## Access Reality

Only \`USERPROFILE\` appeared in the environment search for premium SEO/API credentials. That means this process does not have direct Semrush, Ahrefs, Firecrawl, Keyword Planner or GSC API access. If the owner provides CSV exports or connected credentials, STEP 1 and STEP 2 can be upgraded from partial to numeric.
`, 'utf8');

console.log(JSON.stringify({
  outDir,
  keywordCandidates: keywords.length,
  sourceCount: sourceLog.length,
  quality,
}, null, 2));
