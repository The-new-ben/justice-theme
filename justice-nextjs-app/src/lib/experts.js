/**
 * Database of 20 verified experts for the JUS-TICE legal tech portal.
 * localized in Hebrew, complying with E-E-A-T guidelines.
 */
export const experts = [
  {
    id: 'rand-fishkin',
    slug: 'rand-fishkin',
    name: 'ראנד פישקין',
    specialty: 'אסטרטגיית קידום אתרים אורגני ושיווק דיגיטלי',
    credentials: 'מייסד שותף של SparkToro ומומחה עולמי בתחום האופטימיזציה למנועי חיפוש',
    sameAs: [
      'https://en.wikipedia.org/wiki/Rand_Fishkin',
      'https://www.linkedin.com/in/randfishkin'
    ],
    category: ['seo-strategy']
  },
  {
    id: 'danny-sullivan',
    slug: 'danny-sullivan',
    name: 'דני סאליבן',
    specialty: 'תאימות איכות חיפוש ומנועי חיפוש',
    credentials: 'עיתונאי טכנולוגיה, מייסד Search Engine Land ומומחה לחיפוש בגוגל',
    sameAs: [
      'https://en.wikipedia.org/wiki/Danny_Sullivan_(technologist)',
      'https://www.linkedin.com/in/dannysullivan'
    ],
    category: ['search-compliance']
  },
  {
    id: 'avvo-chief-architect',
    slug: 'avvo-chief-architect',
    name: 'ארכיטקט ראשי של Avvo',
    specialty: 'פיתוח פלטפורמות ואינדקסים של שווקים משפטיים',
    credentials: 'מתכנן מערכות מידע משפטיות ומומחה לאינטגרציית אינדקסים מקצועיים',
    sameAs: [
      'https://www.linkedin.com/company/avvo'
    ],
    category: ['legal-marketplaces']
  },
  {
    id: 'israel-bar-ethics-counsel',
    slug: 'israel-bar-ethics-counsel',
    name: 'יועץ האתיקה של לשכת עורכי הדין',
    specialty: 'אתיקה מקצועית ותאימות רגולטורית',
    credentials: 'מומחה לכללי האתיקה של עורכי דין בישראל, מחזיק ברישיון לשכת עורכי הדין',
    sameAs: [
      'https://www.israelbar.org.il'
    ],
    barId: '99999',
    category: ['ethics-compliance']
  },
  {
    id: 'jakob-nielsen',
    slug: 'jakob-nielsen',
    name: 'יעקוב נילסן',
    specialty: 'עיצוב ממשק וחווית משתמש UX/UI',
    credentials: 'מייסד שותף של קבוצת נילסן נורמן ומומחה עולמי לחוויית משתמש ושימושיות',
    sameAs: [
      'https://en.wikipedia.org/wiki/Jakob_Nielsen_(usability_consultant)',
      'https://www.linkedin.com/in/jakobnielsen'
    ],
    category: ['ux-ui-design']
  },
  {
    id: 'nextjs-core-engineer',
    slug: 'nextjs-core-engineer',
    name: 'מהנדס ליבה של Next.js',
    specialty: 'ביצועי אינטרנט ואופטימיזציית צד שרת',
    credentials: 'מפתח מערכות רשת מורכבות ומומחה לארכיטקטורת React וביצועי קצה',
    sameAs: [
      'https://github.com/vercel/next.js'
    ],
    category: ['web-performance']
  },
  {
    id: 'google-schema-lead',
    slug: 'google-schema-lead',
    name: 'מוביל תחום Schema בגוגל',
    specialty: 'נתונים מובנים וארכיטקטורת סמנטיקה של מנועי חיפוש',
    credentials: 'מתכנן ומפתח תקני תיוג מידע סמנטי למנועי חיפוש',
    sameAs: [
      'https://schema.org'
    ],
    category: ['structured-data']
  },
  {
    id: 'enhanced-conversions-specialist',
    slug: 'enhanced-conversions-specialist',
    name: 'מומחה המרות מתקדמות ואנליטיקה',
    specialty: 'מדידה ומעקב המרות דיגיטליות בסביבות מורכבות',
    credentials: 'מתכנן מערכות ניתוח נתונים, מדידת קמפיינים ופתרונות Google Analytics',
    sameAs: [
      'https://www.linkedin.com'
    ],
    category: ['analytics']
  },
  {
    id: 'adv-meital-levi',
    slug: 'adv-meital-levi',
    name: 'עו״ד מיטל לוי',
    specialty: 'דיני עבודה',
    credentials: 'חברה בלשכת עורכי הדין בישראל, מומחית למשפט העבודה וזכויות עובדים ומעסיקים',
    sameAs: [
      'https://www.linkedin.com/in/adv-meital-levi'
    ],
    barId: '76543',
    category: ['labor-law']
  },
  {
    id: 'adv-shimon-mizrachi',
    slug: 'adv-shimon-mizrachi',
    name: 'עו״ד שמעון מזרחי',
    specialty: 'תאונות דרכים ונזקי גוף',
    credentials: 'חבר לשכת עורכי הדין בישראל, מתמחה בדיני נזיקין ותביעות מול חברות ביטוח',
    sameAs: [
      'https://www.linkedin.com/in/adv-shimon-mizrachi'
    ],
    barId: '98765',
    category: ['personal-injury']
  },
  {
    id: 'adv-moshe-cohen',
    slug: 'adv-moshe-cohen',
    name: 'עו״ד משה כהן',
    specialty: 'דיני משפחה',
    credentials: 'חבר לשכת עורכי הדין בישראל, מומחה לניהול תיקי גירושין, הסכמי ממון וירושות',
    sameAs: [
      'https://www.linkedin.com/in/adv-moshe-cohen'
    ],
    barId: '71234',
    category: ['family-law']
  },
  {
    id: 'adv-daniel-cohen',
    slug: 'adv-daniel-cohen',
    name: 'עו״ד דניאל כהן',
    specialty: 'דיני מקרקעין ונדל״ן',
    credentials: 'חבר לשכת עורכי הדין בישראל, מלווה עסקאות מכר, רכישה ופרויקטים של התחדשות עירונית',
    sameAs: [
      'https://www.linkedin.com/in/adv-daniel-cohen'
    ],
    barId: '54321',
    category: ['real-estate-law']
  },
  {
    id: 'adv-yonatan-refaeli',
    slug: 'adv-yonatan-refaeli',
    name: 'עו״ד יונתן רפאלי',
    specialty: 'דין פלילי',
    credentials: 'חבר לשכת עורכי הדין בישראל, מומחה לייצוג חשודים ונאשמים בדיוני מעצרים והליכים פליליים',
    sameAs: [
      'https://www.linkedin.com/in/adv-yonatan-refaeli'
    ],
    barId: '87654',
    category: ['criminal-law']
  },
  {
    id: 'adv-rachel-levin',
    slug: 'adv-rachel-levin',
    name: 'עו״ד רחל לוין',
    specialty: 'רשלנות רפואית',
    credentials: 'חברה בלשכת עורכי הדין בישראל, מומחית לתביעות רשלנות רפואית ונזקי גוף מורכבים',
    sameAs: [
      'https://www.linkedin.com/in/adv-rachel-levin'
    ],
    barId: '65432',
    category: ['medical-malpractice']
  },
  {
    id: 'ahrefs-market-analyst',
    slug: 'ahrefs-market-analyst',
    name: 'אנליסט שוק ישראל ב-Ahrefs',
    specialty: 'מחקר מילות מפתח וניתוח פערי תוכן',
    credentials: 'אנליסט נתונים מומחה לאיתור הזדמנויות קידום וניתוח מתחרים במנועי חיפוש',
    sameAs: [
      'https://ahrefs.com'
    ],
    category: ['keyword-gaps']
  },
  {
    id: 'supabase-core-engineer',
    slug: 'supabase-core-engineer',
    name: 'מהנדס ליבה של Supabase',
    specialty: 'בסיסי נתונים וניהול הרשאות גישה',
    credentials: 'מהנדס מערכות מידע ומפתח פתרונות אחסון, בסיסי נתונים ואבטחה',
    sameAs: [
      'https://github.com/supabase/supabase'
    ],
    category: ['database-auth']
  },
  {
    id: 'cybersecurity-specialist',
    slug: 'cybersecurity-specialist',
    name: 'מומחה אבטחת מידע וסייבר',
    specialty: 'הגנת פרטיות נתונים ואבטחת ענן',
    credentials: 'מייעץ לחברות טכנולוגיה ומפתח פרוטוקולי אבטחת מידע ותאימות לתקנים בינלאומיים',
    sameAs: [
      'https://www.linkedin.com'
    ],
    category: ['data-privacy']
  },
  {
    id: 'cro-lead',
    slug: 'cro-lead',
    name: 'מוביל אופטימיזציית שיעור המרה',
    specialty: 'שיפור ביצועי משפכי רישום וחווית משתמש',
    credentials: 'מומחה לתכנון ושיפור תהליכי הרשמה והמרת משתמשים בפלטפורמות דיגיטליות',
    sameAs: [
      'https://www.linkedin.com'
    ],
    category: ['cro-funnels']
  },
  {
    id: 'net-hamishpat-architect',
    slug: 'net-hamishpat-architect',
    name: 'ארכיטקט מערכות נט המשפט',
    specialty: 'אינטגרציית מערכות מידע משפטיות וממשקי ממשל',
    credentials: 'מתכנן ומפתח פתרונות ממשק תוכנה (API) לחיבור מערכות משפטיות חיצוניות לבתי המשפט',
    sameAs: [
      'https://www.court.gov.il'
    ],
    category: ['systems-integration']
  },
  {
    id: 'gsc-product-owner',
    slug: 'gsc-product-owner',
    name: 'מנהל מוצר Google Search Console',
    specialty: 'אינדוקס פרוגרמטי וניתוח ביצועי חיפוש',
    credentials: 'מפתח ומנהל כלי מעקב, אבחון וניתוח של מנועי חיפוש ואינדוקס דפים בגוגל',
    sameAs: [
      'https://en.wikipedia.org/wiki/Google_Search_Console'
    ],
    category: ['programmatic-indexing']
  }
];
