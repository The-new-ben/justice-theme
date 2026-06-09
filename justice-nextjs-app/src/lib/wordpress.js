/**
 * Headless WordPress Client with robust offline fallback
 */


const API_URL = process.env.WORDPRESS_API_URL || 'https://jus-tice.co.il/graphql';

// 1. Offline Fallback Database complying with Copywriting Quality Guidelines (no em-dashes, no AI tells, explicit law citations)
const OFFLINE_DB = {
  hubs: {
    'real-estate-law': {
      slug: 'real-estate-law',
      title: 'עורך דין מקרקעין ונדל״ן',
      category: 'real-estate-law',
      content: 'עסקאות נדל״ן דורשות בדיקות נאותות מעמיקות. משרדנו מלווה רוכשים ומוכרים של דירות יד שנייה ודירות קבלן. אנו מוודאים עמידה בהוראות חוק המקרקעין, תשכ״ט-1969. המשרד מטפל ברישום הערות אזהרה, בדיקת זכויות בטאבו וייצוג מול רשויות המס לצורך הפחתת חבות מס רכישה ומס שבח.',
      date: '2026-06-01T10:00:00.000Z',
      modified: '2026-06-05T12:00:00.000Z',
      expert: {
        name: 'עו״ד דניאל כהן',
        barId: '54321',
        bioUrl: 'https://jus-tice.co.il/lawyers/adv-daniel-cohen',
        credentials: 'חבר לשכת עורכי הדין בישראל',
        linkedin: 'https://www.linkedin.com/in/adv-daniel-cohen'
      }
    },
    'medical-malpractice': {
      slug: 'medical-malpractice',
      title: 'רשלנות רפואית',
      category: 'medical-malpractice',
      content: 'נזקים שנגרמו עקב טיפול רפואי רשלני מקימים עילת תביעה לפי פקודת הנזיקין [נוסח חדש]. משרדנו מייצג נפגעים בתביעות רשלנות רפואית מורכבות. אנו עובדים בצמוד לרופאים מומחים לצורך הגשת חוות דעת רפואיות מפורטות לבית המשפט. הטיפול כולל רשלנות בלידה, אבחון מאוחר של מחלות קשות וטעויות בניתוחים.',
      date: '2026-06-02T10:00:00.000Z',
      modified: '2026-06-06T12:00:00.000Z',
      expert: {
        name: 'עו״ד רחל לוין',
        barId: '65432',
        bioUrl: 'https://jus-tice.co.il/lawyers/adv-rachel-levin',
        credentials: 'חברה בלשכת עורכי הדין בישראל',
        linkedin: 'https://www.linkedin.com/in/adv-rachel-levin'
      }
    },
    'labor-law': {
      slug: 'labor-law',
      title: 'עורך דין דיני עבודה',
      category: 'labor-law',
      content: 'הגנה על זכויות עובדים ומעסיקים בהתאם לחוקי המגן במדינת ישראל. משרדנו מטפל בתביעות בגין פיטורים שלא כדין, אי-עריכת שימוע כדין, והלנת שכר. אנו מלווים עובדים בהליכי תביעה לקבלת פיצויי פיטורין מלאים לפי חוק פיצויי פיטורים, תשכ״ג-1963. אנו מוודאים מתן הודעה מוקדמת כנדרש בחוק הודעה מוקדמת לפיטורים ולהתפטרות, תשס״א-2001.',
      date: '2026-06-03T10:00:00.000Z',
      modified: '2026-06-07T12:00:00.000Z',
      expert: {
        name: 'עו״ד מיטל לוי',
        barId: '76543',
        bioUrl: 'https://jus-tice.co.il/lawyers/adv-meital-levi',
        credentials: 'חברה בלשכת עורכי הדין בישראל',
        linkedin: 'https://www.linkedin.com/in/adv-meital-levi'
      }
    },
    'criminal-law': {
      slug: 'criminal-law',
      title: 'עורך דין פלילי',
      category: 'criminal-law',
      content: 'ייצוג חשודים ונאשמים בהליכים פליליים דורש מקצועיות ללא פשרות. המשרד מספק ליווי וייעוץ מיידי לקראת חקירה באזהרה בתחנת המשטרה. אנו מייצגים בדיוני מעצר ימים ומעצר עד תום ההליכים בבתי המשפט. הטיפול כולל הגשת בקשות למחיקת רישום פלילי ושימוע פלילי לפי חוק העונשין, תשל״ז-1977 ופקודת הסמים המסוכנים [נוסח חדש], תשל״ג-1973.',
      date: '2026-06-04T10:00:00.000Z',
      modified: '2026-06-08T12:00:00.000Z',
      expert: {
        name: 'עו״ד יונתן רפאלי',
        barId: '87654',
        bioUrl: 'https://jus-tice.co.il/lawyers/adv-yonatan-refaeli',
        credentials: 'חבר לשכת עורכי הדין בישראל',
        linkedin: 'https://www.linkedin.com/in/adv-yonatan-refaeli'
      }
    },
    'family-law': {
      slug: 'family-law',
      title: 'עורך דין גירושין ומשפחה',
      category: 'family-law',
      content: 'ניהול תיקי גירושין ומשפחה ברגישות ובמקצועיות. המשרד מתמחה בעריכת הסכמי גירושין מקיפים, הסדרת משמורת ילדים וקביעת גובה מזונות. אנו מייצגים בבתי המשפט לענייני משפחה ובבתי הדין הרבניים בהתאם לחוק בית המשפט לענייני משפחה, תשנ״ה-1995. אנו עורכים צוואות והסכמי ממון ומסייעים בפתרון סכסוכי ירושה מורכבים.',
      date: '2026-06-05T10:00:00.000Z',
      modified: '2026-06-08T13:00:00.000Z',
      expert: {
        name: 'עו״ד משה כהן',
        barId: '71234',
        bioUrl: 'https://jus-tice.co.il/lawyers/adv-moshe-cohen',
        credentials: 'חבר לשכת עורכי הדין בישראל, מומחה לניהול תיקי גירושין, הסכמי ממון וירושות',
        linkedin: 'https://www.linkedin.com/in/adv-moshe-cohen'
      }
    },
    'personal-injury': {
      slug: 'personal-injury',
      title: 'עורכי דין תאונות דרכים ונזקי גוף',
      category: 'personal-injury',
      content: 'נפגעי תאונות דרכים זכאים לפיצויים כספיים מלאים בגין נזקי הגוף שנגרמו להם. משרדנו מגיש תביעות פיצויים בהתאם לחוק הפיצויים לנפגעי תאונות דרכים, תשל״ה-1975. אנו מלווים את הנפגעים בוועדות רפואיות של המוסד לביטוח לאומי לצורך קביעת דרגות נכות רפואית ותפקודית ומימוש זכויות רפואיות מלאות.',
      date: '2026-06-06T10:00:00.000Z',
      modified: '2026-06-08T14:00:00.000Z',
      expert: {
        name: 'עו״ד שמעון מזרחי',
        barId: '98765',
        bioUrl: 'https://jus-tice.co.il/lawyers/adv-shimon-mizrachi',
        credentials: 'חבר לשכת עורכי הדין בישראל',
        linkedin: 'https://www.linkedin.com/in/adv-shimon-mizrachi'
      }
    }
  },
  spokes: {
    'purchase-tax-calculator': {
      slug: 'purchase-tax-calculator',
      category: 'real-estate-law',
      title: 'מחשבון מס רכישה',
      content: 'רכישת זכות במקרקעין בישראל מחייבת תשלום מס רכישה בהתאם להוראות חוק מיסוי מקרקעין (שבח ורכישה), תשכ״ג-1963. מדרגות המס נקבעות ומעודכנות מדי שנה על ידי רשות המיסים. מחשבון מס הרכישה מאפשר לחשב את סכום המס המדויק החל על דירת מגורים יחידה או על דירה נוספת. החוק מעניק פטורים או הקלות לרוכשים זכאים כגון עולים חדשים, נכים או משפחות שכולות. מומלץ לבצע תכנון מס קפדני טרם חתימה על הסכם הרכישה.',
      date: '2026-06-01T11:00:00.000Z',
      modified: '2026-06-05T12:30:00.000Z'
    },
    'tama-38-rights': {
      slug: 'tama-38-rights',
      category: 'real-estate-law',
      title: 'זכויות דיירים בתמ״א 38',
      content: 'תכנית המתאר הארצית לחיזוק מבנים קיימים בפני רעידות אדמה (תמ״א 38) מעניקה זכויות רבות לבעלי הדירות. ביצוע פרויקט תמ״א 38 דורש הבנה מעמיקה של זכויות הדיירים לקבלת דירה חלופית מורחבת, תוספת מרפסת שמש, חניה רשומה ומחסן. חוק המקרקעין (חיזוק בתים משותפים מפני רעידות אדמה), תשס״ח-2008 מסדיר את הרוב המיוחס הנדרש מקרב בעלי הדירות לשם אישור הביצוע. ליווי משפטי צמוד מבטיח קבלת ערבויות בנקאיות מלאות להבטחת כספי הדיירים ותשלומי שכר דירה בתקופת הפינוי.',
      date: '2026-06-01T12:00:00.000Z',
      modified: '2026-06-05T13:00:00.000Z'
    },
    'tabu-registration-guide': {
      slug: 'tabu-registration-guide',
      category: 'real-estate-law',
      title: 'מדריך רישום בטאבו',
      content: 'רישום זכויות בלשכת רישום המקרקעין (הטאבו) הוא השלב האחרון והמכריע בכל עסקת מקרקעין. חוק המקרקעין, תשכ״ט-1969 קובע כי עסקה במקרקעין טעונה רישום, וכי העסקה נגמרת ברישום. מדריך זה מפרט את השלבים להגשת שטרי מכר חתומים, אישורי מיסוי מקרקעין, אישורי עירייה על היעדר חובות ורישום הערות אזהרה. אי-השלמת הרישום בטאבו מותירה את זכויות הרוכש כזכויות חוזיות בלבד וחושפת אותו לסיכונים משפטיים משמעותיים.',
      date: '2026-06-01T13:00:00.000Z',
      modified: '2026-06-05T14:00:00.000Z'
    },
    'birth-injury-compensation': {
      slug: 'birth-injury-compensation',
      category: 'medical-malpractice',
      title: 'רשלנות רפואית בלידה',
      content: 'נזקים גופניים קשים הנגרמים לילוד או ליולדת במהלך הלידה או בשלבי מעקב ההיריון מקימים עילת תביעה בגין רשלנות רפואית. תביעות אלו מבוססות על הוכחת הפרת חובת הזהירות מצד הצוות הרפואי לפי פקודת הנזיקין [נוסח חדש]. אי-זיהוי מצוקה עוברית במוניטור, עיכוב בלתי מוצדק בביצוע ניתוח קיסרי או שימוש לא מיומן במכשיר ואקום עלולים להוביל לפגיעות מוחיות קבועות כגון שיתוק מוחין (CP). הפיצויים בתביעות אלו כוללים כיסוי הוצאות טיפול, שיקום, כאב וסבל ואובדן כושר השתכרות עתידי.',
      date: '2026-06-02T11:00:00.000Z',
      modified: '2026-06-06T13:00:00.000Z'
    },
    'misdiagnosis-lawsuit': {
      slug: 'misdiagnosis-lawsuit',
      category: 'medical-malpractice',
      title: 'אבחון רפואי שגוי',
      content: 'אבחון רפואי שגוי או עיכוב משמעותי באבחון מחלה קשה עלול להוביל לפגיעה בלתי הפיכה בסיכויי ההחלמה של המטופל. עילת התביעה ברשלנות רפואית מתגבשת כאשר מוכח כי הרופא המטפל חרג מסטנדרט הרופא הסביר. מקרים נפוצים כוללים פענוח שגוי של בדיקות הדמיה כגון צילומי רנטגן, בדיקות CT או ממוגרפיה, והתעלמות מתלונות קליניות של המטופל. תביעת הפיצויים דורשת הצגת חוות דעת רפואית מטעם רופא מומחה בתחום הרלוונטי המפרטת את הקשר הסיבתי שבין השגיאה באבחון לבין הנזק הגופני.',
      date: '2026-06-02T12:00:00.000Z',
      modified: '2026-06-06T14:00:00.000Z'
    },
    'severance-pay-calculator': {
      slug: 'severance-pay-calculator',
      category: 'labor-law',
      title: 'חישוב פיצויי פיטורין',
      content: 'חוק פיצויי פיטורים, תשכ״ג-1963 קובע כי עובד שעבד שנה אחת ברציפות ופוטר זכאי לקבל פיצויי פיטורין ממעסיקו. חישוב הפיצויים מבוסס על מכפלת השכר האחרון של העובד בשנות הוותק שלו במקום העבודה. הפרשות המעסיק לרכיב הפיצויים בחיסכון הפנסיוני בהתאם להסדר לפי סעיף 14 לחוק עשויות לבוא במקום תשלום הפיצויים הישיר, בכפוף לעמידה בתנאי צו ההרחבה. במקרה של התפטרות עקב הרעת תנאים מוחשית בעבודה, זכאי העובד להתפטר בדין מפוטר ולקבל פיצויים מלאים.',
      date: '2026-06-03T11:00:00.000Z',
      modified: '2026-06-07T13:00:00.000Z'
    },
    'hearing-before-dismissal-rights': {
      slug: 'hearing-before-dismissal-rights',
      category: 'labor-law',
      title: 'זכות השימוע לפני פיטורין',
      content: 'זכות השימוע היא זכות יסוד של עובד העומד בפני פיטורים, אשר נקבעה בפסיקת בתי הדין לעבודה. מעסיק המתכוון לפטר עובד מחויב לזמן אותו לשיחת שימוע בכתב, תוך פירוט מלא של הנימוקים שבעטיים נשקלים הפיטורים. יש להעניק לעובד זמן סביר להיערך לשימוע ולאפשר לו לעיין במסמכים הרלוונטיים. העובד זכאי להיות מיוצג בשימוע על ידי עורך דין או נציג ועד עובדים. מעסיק שיפטר עובד ללא עריכת שימוע תקין ובנפש חפצה עלול להיות מחויב בתשלום פיצויים משמעותיים בגין פיטורים שלא כדין.',
      date: '2026-06-03T12:00:00.000Z',
      modified: '2026-06-07T14:00:00.000Z'
    },
    'police-interrogation-guide': {
      slug: 'police-interrogation-guide',
      category: 'criminal-law',
      title: 'חקירה באזהרה במשטרה',
      content: 'חקירה באזהרה היא שלב קריטי בהליך הפלילי, המעוגן בהוראות חוק סדר הדין הפלילי (סמכויות אכיפה - מעצרים), תשנ״ו-1996. לכל חשוד עומדת זכות יסוד להיוועץ בעורך דין פלילי מוסמך טרם תחילת החקירה, ועל חוקרי המשטרה להודיע לו על זכות זו. לחשוד עומדת זכות השתיקה, המאפשרת לו שלא להשיב לשאלות העלולות להפלילו. שתיקה בחקירה עשויה לחזק את ראיות התביעה בבית המשפט, ולכן קבלת ייעוץ משפטי מקצועי לפני מסירת גרסה ראשונית היא בעלת חשיבות מכרעת להמשך התיק.',
      date: '2026-06-04T11:00:00.000Z',
      modified: '2026-06-08T12:30:00.000Z'
    },
    'expunging-criminal-record': {
      slug: 'expunging-criminal-record',
      category: 'criminal-law',
      title: 'מחיקת רישום פלילי',
      content: 'רישום פלילי משפיע לרעה על אפשרויות התעסוקה, קבלת רישיונות מקצועיים ומעבר בין מדינות. חוק המרשם הפלילי ותקנת השבים, תשע״ט-2019 מפרט את תקופות ההתיישנות והמחיקה של הרשעות פליליות ותיקים סגורים. הגשת בקשה למחיקת רישום פלילי או לקיצור תקופת המחיקה מוגשת ללשכת נשיא המדינה. הבקשה צריכה לכלול נימוקים כבדי משקל כגון שיקום אישי, תרומה לקהילה, חלוף הזמן והיעדר עבירות נוספות. מומלץ להסתייע בעורך דין פלילי לניסוח הבקשה לשיפור סיכויי קבלתה.',
      date: '2026-06-04T12:00:00.000Z',
      modified: '2026-06-08T13:00:00.000Z'
    },
    'divorce-agreement-template': {
      slug: 'divorce-agreement-template',
      category: 'family-law',
      title: 'הסכם גירושין',
      content: 'עריכת הסכם גירושין כולל מאפשרת לבני הזוג לסיים את קשר הנישואין בדרכי שלום וללא התדיינות משפטית ממושכת. ההסכם מוסדר לפי חוק יחסי ממון בין בני זוג, תשל״ג-1973. הסכם גירושין תקף ומחייב רק לאחר שקיבל אישור מבית המשפט לענייני משפחה או מבית הדין הרבני, אשר מוודאים כי הצדדים הבינו את תנאי ההסכם וחתמו עליו מרצון חופשי. ההסכם מסדיר את נושאי חלוקת הרכוש המשותף, קביעת גובה דמי מזונות הילדים והסדרי שהות מפורטים.',
      date: '2026-06-05T11:00:00.000Z',
      modified: '2026-06-08T13:30:00.000Z'
    },
    'child-custody-guidelines': {
      slug: 'child-custody-guidelines',
      category: 'family-law',
      title: 'משמורת ילדים',
      content: 'קביעת הסדרי שהות ומשמורת ילדים מונחית בראש ובראשונה על ידי עקרון טובת הילד, בהתאם לחוק הכשרות המשפטית והאפוטרופסות, תשכ״ב-1962. בתי המשפט מעודדים כיום קיום אחריות הורית משותפת והסדרי שהות שוויוניים ככל שהדבר מתאים לצרכי הילדים. הסדרי השהות קובעים את חלוקת הימים והשעות שבהם ישהו הילדים עם כל אחד מההורים, כולל סופי שבוע וחגים. קביעה זו משפיעה באופן ישיר גם על חישוב דמי המזונות בהתאם להלכה שנקבעה בבית המשפט העליון.',
      date: '2026-06-05T12:00:00.000Z',
      modified: '2026-06-08T14:00:00.000Z'
    },
    'car-accident-compensation': {
      slug: 'car-accident-compensation',
      category: 'personal-injury',
      title: 'פיצויים תאונת דרכים',
      content: 'כל אדם שנפגע בתאונת דרכים בישראל זכאי לפיצויים כספיים בגין נזקי הגוף שנגרמו לו. חוק הפיצויים לנפגעי תאונות דרכים, תשל״ה-1975 קובע משטר של אחריות מוחלטת. החוק קובע כי חברת הביטוח המבטחת את הרכב בפוליסת ביטוח חובה מחויבת לפצות את הנפגע, ללא קשר לשאלת אשמו בגרימת התאונה. גובה הפיצוי נקבע בהתאם לדרגת הנכות הרפואית שנקבעת על ידי מומחים רפואיים הממונים על ידי בית המשפט, וכולל רכיבים כגון כאב וסבל, הפסדי שכר והוצאות רפואיות עקב התאונה.',
      date: '2026-06-06T11:00:00.000Z',
      modified: '2026-06-08T14:30:00.000Z'
    },
    'national-insurance-appeal-guide': {
      slug: 'national-insurance-appeal-guide',
      category: 'personal-injury',
      title: 'ערעור לביטוח לאומי',
      content: 'החלטות של ועדות רפואיות של המוסד לביטוח לאומי ניתנות לערעור בפני ועדה רפואית לעררים. חוק הביטוח הלאומי [נוסח משולב], תשנ״ה-1995 קובע את סמכויות הוועדות והזכות להגשת ערעור בתוך 60 ימים ממועד קבלת ההחלטה. הערעור מוגש בכתב ומפרט את הטעויות הרפואיות או הפרוצדורליות שנפלו בהחלטת הוועדה מדרג ראשון. ליווי של עורך דין מומחה בהליכים אלו חיוני להצגה נכונה של הליקויים הרפואיים ומקסום אחוזי הנכות הרלוונטיים.',
      date: '2026-06-06T12:00:00.000Z',
      modified: '2026-06-08T15:00:00.000Z'
    },
    'hospital-negligence-claims': {
      slug: 'hospital-negligence-claims',
      category: 'medical-malpractice',
      title: 'תביעת רשלנות רפואית נגד בית חולים',
      content: 'רשלנות רפואית בבתי חולים עשויה להקים עילת תביעה משמעותית בהתאם לפקודת הנזיקין [נוסח חדש]. מקרים אלו כוללים אי-אבחון בזמן של מצבים מסכני חיים, טיפול תרופתי שגוי או רשלנות במהלך ניתוח. תביעות אלו מלוות בחוות דעת של רופאים מומחים בכירים.',
      date: '2026-06-02T13:00:00.000Z',
      modified: '2026-06-06T15:00:00.000Z'
    },
    'divorce-agreement-approval': {
      slug: 'divorce-agreement-approval',
      category: 'family-law',
      title: 'אישור הסכם גירושין בבית המשפט לענייני משפחה',
      content: 'אישור הסכם גירושין בבית המשפט לענייני משפחה נעשה לפי חוק בית המשפט לענייני משפחה, תשנ״ה-1995. בני הזוג מגישים את ההסכם לאישור השופט המוסמך. ההליך כולל בדיקה מעמיקה של הסכמות הצדדים לגבי משמורת הילדים, דמי מזונות והסדרי שהות.',
      date: '2026-06-05T14:00:00.000Z',
      modified: '2026-06-08T16:00:00.000Z'
    },
    'rabbinical-agreement-approval': {
      slug: 'rabbinical-agreement-approval',
      category: 'family-law',
      title: 'אישור הסכם גירושין בבית הדין הרבני',
      content: 'אישור הסכם גירושין בבית הדין הרבני דורש פנייה מסודרת בהתאם לחוק שיפוט בתי דין רבניים (נישואין וגירושין), תשי״ג-1953. על בני הזוג להציג את ההסכם בפני דייני בית הדין המוסמך ולוודא כי ההוראות ברורות ומקובלות על שני הצדדים. בית הדין יבחן את ההסכם ויעניק לו תוקף של פסק דין לאחר שיוודא כי בני הזוג חתמו עליו מרצונם החופשי והבינו את השלכותיו.',
      date: '2026-06-05T13:00:00.000Z',
      modified: '2026-06-08T15:30:00.000Z'
    }
  },
  lawyers: {
    'adv-daniel-cohen': {
      slug: 'adv-daniel-cohen',
      title: 'עו״ד דניאל כהן',
      content: 'עו״ד דניאל כהן הוא שותף בכיר ומנהל מחלקת המקרקעין והליטיגציה האזרחית. בעל מעל 14 שנות ניסיון בייצוג יזמים ודיירים בעסקאות נדל״ן מורכבות, פרויקטים של התחדשות עירונית, וליטיגציה מסחרית בבתי המשפט. מוסמך וחבר לשכת עורכי הדין בישראל משנת 2012 (מספר רישיון 54321).',
      date: '2026-06-01T10:00:00.000Z'
    },
    'adv-meital-levi': {
      slug: 'adv-meital-levi',
      title: 'עו״ד מיטל לוי',
      content: 'עו״ד מיטל לוי מומחית בדיני משפחה, הסכמי גירושין, ירושות וצוואות. בעלת ניסיון עשיר בייצוג בבית המשפט לענייני משפחה ובבתי הדין הרבניים. מלווה לקוחות ברגישות ובמקצועיות לפתרון סכסוכים משפחתיים מורכבים. חברה בלשכת עורכי הדין בישראל משנת 2017 (מספר רישיון 76543).',
      date: '2026-06-03T10:00:00.000Z'
    },
    'adv-moshe-cohen': {
      slug: 'adv-moshe-cohen',
      title: 'עו״ד משה כהן',
      content: 'עו״ד משה כהן הוא מומחה לדיני משפחה, ניהול תיקי גירושין, הסכמי ממון וירושות. בעל ניסיון רב בייצוג בבתי המשפט לענייני משפחה ובבתי הדין הרבניים. חבר לשכת עורכי הדין בישראל משנת 2011 (מספר רישיון 71234).',
      date: '2026-06-05T10:00:00.000Z'
    },
    'adv-rachel-levin': {
      slug: 'adv-rachel-levin',
      title: 'עו״ד רחל לוין',
      content: 'עו״ד רחל לוין מומחית בתחום הרשלנות הרפואית ונזקי גוף קשים. בעלת ניסיון רב בניהול תביעות מורכבות מול בתי חולים ומוסדות רפואיים, בשיתוף פעולה הדוק עם מיטב המומחים הרפואיים בארץ. חברה בלשכת עורכי הדין בישראל משנת 2014 (מספר רישיון 65432).',
      date: '2026-06-02T10:00:00.000Z'
    },
    'adv-yonatan-refaeli': {
      slug: 'adv-yonatan-refaeli',
      title: 'עו״ד יונתן רפאלי',
      content: 'עו״ד יונתן רפאלי מומחה בדין הפלילי, ייצוג בדיוני מעצרים, חקירות משטרה, שימועים לפני כתבי אישום ומחיקת רישומים פליליים. חבר לשכת עורכי הדין בישראל משנת 2015 (מספר רישיון 87654).',
      date: '2026-06-04T10:00:00.000Z'
    },
    'adv-shimon-mizrachi': {
      slug: 'adv-shimon-mizrachi',
      title: 'עו״ד שמעון מזרחי',
      content: 'עו״ד שמעון מזרחי מתמחה בדיני נזיקין, תאונות דרכים, תביעות ביטוח וייצוג נפגעים מול המוסד לביטוח לאומי. בעל ניסיון רב בהשגת פיצויים מקסימליים לנפגעי גוף. חבר לשכת עורכי הדין בישראל משנת 2011 (מספר רישיון 98765).',
      date: '2026-06-06T10:00:00.000Z'
    }
  },
  pages: {
    'about-us': {
      slug: 'about-us',
      title: 'אודותינו',
      content: 'פורטל JUS-TICE הוקם במטרה להנגיש פתרונות משפטיים מתקדמים לקהל הרחב באמצעות שילוב טכנולוגיית בינה מלאכותית מבוקרת (AI) ועורכי דין מומחים ומורשים בלשכת עורכי הדין. אנו מאמינים כי השירות המשפטי צריך להיות נגיש, מהיר, שקוף ומאובטח ברמה הגבוהה ביותר.',
      date: '2026-06-01T10:00:00.000Z'
    },
    'contact': {
      slug: 'contact',
      title: 'צור קשר',
      content: 'נשמח לעמוד לשירותכם בכל שאלה או פנייה משפטית. באפשרותכם להשתמש במעריכי הסיכויים הדיגיטליים שלנו בעמוד הבית או ליצור קשר ישיר עם צוות הפורטל או עם עורכי הדין המובילים. כתובתנו: דרך מנחם בגין, תל אביב. טלפון: 03-750-2020.',
      date: '2026-06-01T10:00:00.000Z'
    }
  }
};

async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (process.env.WORDPRESS_AUTH_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_TOKEN}`;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 3600 },
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Failed to fetch API from Headless WordPress');
  }
  return json.data;
}

// 2. Wrap exports with transparent offline fallbacks (allows testing sitemaps + WP offline)
export async function getAllPageSlugs() {
  try {
    const data = await fetchAPI(`
      query AllPageSlugs {
        pages(first: 100) {
          nodes {
            slug
          }
        }
      }
    `);
    const nodes = data?.pages?.nodes || [];
    if (nodes.length > 0) return nodes;
  } catch (err) {
    console.warn('getAllPageSlugs: Falling back to local content database', err.message);
  }
  return Object.keys(OFFLINE_DB.pages).map(slug => ({ slug }));
}

export async function getPageBySlug(slug) {
  try {
    const data = await fetchAPI(`
      query PageBySlug($id: ID!, $idType: PageIdType!) {
        page(id: $id, idType: $idType) {
          title
          content
          slug
          date
          modified
        }
      }
    `, {
      variables: {
        id: slug,
        idType: 'URI'
      }
    });
    if (data?.page) return data.page;
  } catch (err) {
    console.warn(`getPageBySlug(${slug}): Falling back to local content database`, err.message);
  }
  return OFFLINE_DB.pages[slug] || null;
}

export async function getAllPosts() {
  try {
    const data = await fetchAPI(`
      query AllPosts {
        posts(first: 50, where: { orderby: { field: DATE, order: DESC } }) {
          nodes {
            title
            excerpt
            slug
            date
          }
        }
      }
    `);
    const nodes = data?.posts?.nodes || [];
    if (nodes.length > 0) return nodes;
  } catch (err) {
    console.warn('getAllPosts: Falling back to local content database', err.message);
  }
  return Object.values(OFFLINE_DB.spokes).map(post => ({
    title: post.title,
    excerpt: post.content.substring(0, 120) + '...',
    slug: post.slug,
    date: post.date
  }));
}

export async function getPostBySlug(slug) {
  try {
    const data = await fetchAPI(`
      query PostBySlug($id: ID!, $idType: PostIdType!) {
        post(id: $id, idType: $idType) {
          title
          content
          slug
          date
          modified
          author {
            node {
              name
            }
          }
        }
      }
    `, {
      variables: {
        id: slug,
        idType: 'SLUG'
      }
    });
    if (data?.post) return data.post;
  } catch (err) {
    console.warn(`getPostBySlug(${slug}): Falling back to local content database`, err.message);
  }
  return OFFLINE_DB.spokes[slug] || null;
}

export async function getAllLawyers() {
  try {
    const data = await fetchAPI(`
      query AllLawyers {
        posts(where: { postTypes: ["justice_lawyer"] }, first: 100) {
          nodes {
            title
            slug
            excerpt
            date
          }
        }
      }
    `);
    const nodes = data?.posts?.nodes || [];
    if (nodes.length > 0) return nodes;
  } catch (err) {
    console.warn('getAllLawyers: Falling back to local content database', err.message);
  }
  return Object.values(OFFLINE_DB.lawyers).map(lawyer => ({
    title: lawyer.title,
    slug: lawyer.slug,
    excerpt: lawyer.content.substring(0, 120) + '...',
    date: lawyer.date
  }));
}

// 3. Helper functions specifically for Hub/Spoke URL silo lookup and rendering
export function getLocalHub(category) {
  return OFFLINE_DB.hubs[category] || null;
}

export function getLocalSpoke(category, slug) {
  const spoke = OFFLINE_DB.spokes[slug];
  if (spoke && spoke.category === category) {
    return spoke;
  }
  return null;
}

export function getLocalLawyer(slug) {
  return OFFLINE_DB.lawyers[slug] || null;
}

export function getAllLocalHubs() {
  return Object.values(OFFLINE_DB.hubs);
}

export function getAllLocalSpokes() {
  return Object.values(OFFLINE_DB.spokes);
}
