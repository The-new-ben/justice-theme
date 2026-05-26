import { readFile, writeFile } from 'node:fs/promises';

const FILE = '.content-drafts/divorce-property-division-public-body-he.md';

const insertions = [
  {
    id: 'separate-registration-shared-intent',
    anchor: '- האם יש חשש להסתרת מידע או הברחת נכסים.',
    placement: 'after',
    compact: true,
    text: '- האם רישום נפרד של נכס משקף באמת הפרדה, או שהייתה לאורך השנים התנהלות שממנה אפשר לטעון לכוונת שיתוף.',
  },
  {
    id: 'housing-children-practical-timing',
    anchor: 'אם הדירה רשומה על שם שני הצדדים, עדיין צריך לבחון חובות, משכנתה, זכויות צדדים שלישיים ולוחות זמנים. אם הדירה רשומה על שם צד אחד בלבד, השאלה מורכבת יותר ותלויה במקור הדירה, מועד הרכישה, התשלומים, השיפוצים, ההתנהלות המשפחתית והאם הייתה כוונת שיתוף.',
    placement: 'after',
    text: 'כאשר יש ילדים או צורך בהסדר מגורים זמני, הדיון אינו רק בשאלה מי בעל הזכויות בדירה. לעיתים צריך לבחון גם לוחות זמנים, יכולת מימון, יציבות לילדים ופתרונות ביניים, בלי להניח מראש שתוצאה אחת מתאימה לכל תיק.',
  },
  {
    id: 'separation-date-checklist',
    anchor: 'אין לקבוע את המועד הזה לפי תחושה בלבד. לפעמים בוחנים מועד עזיבה מהבית, פתיחת הליך, ניהול חשבונות נפרדים, הפסקת חיים משותפים או אירועים אחרים. מחלוקת על מועד הקרע יכולה להיות משמעותית במיוחד כאשר עסק גדל, חוב נוצר, או נכס עלה בערכו אחרי הפרידה.',
    placement: 'after',
    text: [
      'לפני שיחה על מועד הקרע כדאי להכין נקודות בסיסיות:',
      '',
      '- מתי הייתה הפרידה בפועל.',
      '- האם אחד הצדדים עזב את הבית או שהחשבונות הופרדו.',
      '- האם נפתח הליך או נשלחה בקשה ליישוב סכסוך.',
      '- אילו נכסים, הכנסות או חובות נוצרו אחרי הפרידה.',
    ].join('\n'),
  },
  {
    id: 'post-separation-assets-debts',
    anchor: '- אילו נכסים, הכנסות או חובות נוצרו אחרי הפרידה.',
    placement: 'after',
    text: 'נכסים או חובות שנוצרו אחרי הפרידה עשויים לשנות את הבדיקה העובדתית. במקרים מסוימים יהיה צורך בהערכת שווי, בדיקת מסמכים או חוות דעת מקצועית לפני שמחליטים איך להתייחס אליהם בהסכם.',
  },
  {
    id: 'prenup-checklist',
    anchor: 'לפעמים בני זוג חושבים שהסכם ממון פותר הכל, אבל בפועל הוא לא מתייחס לנכסים חדשים, לעסק שנפתח בהמשך, לזכויות פנסיוניות, לחובות או לשינויים גדולים שחלו בחיים. לכן כדאי לקרוא את ההסכם ביחד עם מפת הרכוש העדכנית.',
    placement: 'after',
    text: [
      'בבדיקה ראשונית של הסכם קודם כדאי לשים לב במיוחד:',
      '',
      '- מתי נחתם ההסכם.',
      '- האם הוא אושר כדין, אם היה צורך באישור.',
      '- אילו נכסים הוא כולל ואילו נכסים אינם מוזכרים בו.',
      '- האם ההתנהלות המאוחרת של הצדדים תואמת את ההסכם או יוצרת שאלות חדשות.',
    ].join('\n'),
  },
  {
    id: 'prenup-validity-caution',
    anchor: '- האם ההתנהלות המאוחרת של הצדדים תואמת את ההסכם או יוצרת שאלות חדשות.',
    placement: 'after',
    text: 'עמוד מידע אינו יכול לקבוע אם הסכם ממון תקף או כיצד יפורש במקרה מסוים. כאשר יש טענה ללחץ, חוסר גילוי, אי-הבנה או שינוי נסיבות מהותי, נדרשת בדיקה פרטנית של המסמכים ושל נסיבות החתימה.',
  },
];

function insertAfter(text, anchor, addition, compact = false) {
  const marker = `${anchor}\n`;
  if (!text.includes(marker)) {
    throw new Error(`Anchor not found: ${anchor}`);
  }
  if (compact) {
    text = text.replace(`${anchor}\n\n${addition}`, `${anchor}\n${addition}`);
  }
  if (text.includes(addition)) {
    return text;
  }
  return text.replace(marker, compact ? `${marker}${addition}\n` : `${marker}\n${addition}\n`);
}

let markdown = await readFile(FILE, 'utf8');

for (const insertion of insertions) {
  if (insertion.placement !== 'after') {
    throw new Error(`Unsupported placement: ${insertion.placement}`);
  }
  markdown = insertAfter(markdown, insertion.anchor, insertion.text, insertion.compact);
}

await writeFile(FILE, markdown, 'utf8');
console.log(`Applied ${insertions.length} property-division draft merges to ${FILE}`);
