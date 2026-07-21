<?php
/**
 * "How to Find a Lawyer" — comprehensive educational guide section.
 *
 * Inspired by din.co.il / psakdin.co.il guide structure but significantly
 * more detailed, with step-by-step process, FAQ, and trust signals.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>

<section class="find-guide section" id="find-lawyer-guide">
	<div class="container">

		<!-- Section Header -->
		<div class="section-header section-header--center">
			<span class="section-header__eyebrow"><?php esc_html_e( 'המדריך המלא', 'justice-theme' ); ?></span>
			<h2><?php esc_html_e( 'איך מוצאים עורך דין מתאים? 6 שלבים לבחירה נכונה', 'justice-theme' ); ?></h2>
			<p class="section-header__desc"><?php esc_html_e( 'בחירת עורך דין היא אחת ההחלטות המשמעותיות ביותר שתקבלו. המדריך שלנו יעזור לכם להבין בדיוק מה לחפש, מה לשאול, ואיך להגן על האינטרסים שלכם.', 'justice-theme' ); ?></p>
		</div>

		<?php
		// The stock guide photo is retired (owner request). Mission 2 ships a
		// screened premium photography set; until then the section opens with
		// the steps grid directly.
		?>

		<!-- Steps Grid -->
		<div class="find-guide__steps">

			<!-- Step 1 -->
			<div class="find-guide__step">
				<div class="find-guide__step-number">1</div>
				<div class="find-guide__step-icon">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
				</div>
				<h3 class="find-guide__step-title"><?php esc_html_e( 'זהו את סוג הבעיה המשפטית', 'justice-theme' ); ?></h3>
				<p class="find-guide__step-desc"><?php esc_html_e( 'לפני שמחפשים עורך דין, חשוב להבין באיזה תחום משפטי מדובר. דיני משפחה? נזיקין? מקרקעין? עבודה? פלילי? התשובה תשפיע על סוג המומחיות שאתם צריכים. אם אתם לא בטוחים, זה בסדר. שיחת ייעוץ ראשונית (לרוב ללא תשלום) תעזור לכם להבין.', 'justice-theme' ); ?></p>
				<div class="find-guide__step-tip">
					<strong><?php esc_html_e( '💡 טיפ:', 'justice-theme' ); ?></strong>
					<?php esc_html_e( 'עיינו במדריכים המשפטיים שלנו לפי תחום כדי להבין טוב יותר את הסיטואציה שלכם לפני הפגישה הראשונה.', 'justice-theme' ); ?>
				</div>
			</div>

			<!-- Step 2 -->
			<div class="find-guide__step">
				<div class="find-guide__step-number">2</div>
				<div class="find-guide__step-icon">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path stroke-linecap="round" d="m9 12 2 2 4-4"/></svg>
				</div>
				<h3 class="find-guide__step-title"><?php esc_html_e( 'ודאו רישיון ומעמד פעיל', 'justice-theme' ); ?></h3>
				<p class="find-guide__step-desc"><?php esc_html_e( 'כל עורך דין בישראל חייב להיות רשום בלשכת עורכי הדין ולהחזיק ברישיון פעיל. בדקו שעורך הדין שאתם שוקלים הוא בעל רישיון תקף, ושלא הוטלו עליו הגבלות משמעתיות. ניתן לבדוק זאת באתר לשכת עורכי הדין הישראלית.', 'justice-theme' ); ?></p>
				<div class="find-guide__step-tip">
					<strong><?php esc_html_e( '⚠️ חשוב:', 'justice-theme' ); ?></strong>
					<?php esc_html_e( 'אל תהססו לבקש מספר רישיון ולבדוק אותו. עורך דין מקצועי ישמח לספק את המידע הזה.', 'justice-theme' ); ?>
				</div>
			</div>

			<!-- Step 3 -->
			<div class="find-guide__step">
				<div class="find-guide__step-number">3</div>
				<div class="find-guide__step-icon">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path stroke-linecap="round" stroke-linejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
				</div>
				<h3 class="find-guide__step-title"><?php esc_html_e( 'בדקו ניסיון והתמחות ספציפית', 'justice-theme' ); ?></h3>
				<p class="find-guide__step-desc"><?php esc_html_e( 'לא כל עורך דין מתאים לכל תיק. חפשו עורך דין שמתמחה ספציפית בתחום שלכם, עם ניסיון מוכח בטיפול בתיקים דומים. שאלו על תיקים קודמים, שיעורי הצלחה, וכמה שנים של ניסיון יש להם בתחום הספציפי הזה. חפשו מאמרים מקצועיים שפרסמו בתחום.', 'justice-theme' ); ?></p>
				<div class="find-guide__step-tip">
					<strong><?php esc_html_e( '💡 טיפ:', 'justice-theme' ); ?></strong>
					<?php esc_html_e( 'עורך דין שמפרסם תוכן מקצועי (מאמרים, סרטונים, פודקאסטים) בתחום שלכם, זה סימן טוב למומחיות ומעורבות בתחום.', 'justice-theme' ); ?>
				</div>
			</div>

			<!-- Step 4 -->
			<div class="find-guide__step">
				<div class="find-guide__step-number">4</div>
				<div class="find-guide__step-icon">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
				</div>
				<h3 class="find-guide__step-title"><?php esc_html_e( 'קבעו פגישת ייעוץ ראשונית', 'justice-theme' ); ?></h3>
				<p class="find-guide__step-desc"><?php esc_html_e( 'רוב עורכי הדין מציעים פגישת ייעוץ ראשונית (לעיתים ללא תשלום או בתשלום מופחת). הפגישה הזו היא ההזדמנות שלכם להציג את המקרה, לשמוע הערכה ראשונית, ולהרגיש אם יש "כימיה" עם עורך הדין. שימו לב: האם הוא מקשיב? האם הוא מסביר בשפה פשוטה? האם אתם מרגישים בנוח?', 'justice-theme' ); ?></p>
				<div class="find-guide__step-tip">
					<strong><?php esc_html_e( '📋 מה לשאול בפגישה:', 'justice-theme' ); ?></strong>
					<?php esc_html_e( 'כמה תיקים דומים טיפלת? מהי ההערכה שלך למקרה שלי? כמה זמן זה ייקח? מהי מדיניות העמלות?', 'justice-theme' ); ?>
				</div>
			</div>

			<!-- Step 5 -->
			<div class="find-guide__step">
				<div class="find-guide__step-number">5</div>
				<div class="find-guide__step-icon">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path stroke-linecap="round" stroke-linejoin="round" d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
				</div>
				<h3 class="find-guide__step-title"><?php esc_html_e( 'הבינו את מבנה השכר טרחה', 'justice-theme' ); ?></h3>
				<p class="find-guide__step-desc"><?php esc_html_e( 'שכר טרחה של עורכי דין בישראל יכול להיות מגוון: שעתי, קבוע (פאושלי), אחוז מהפיצוי (בתיקי נזיקין), או שילוב. בקשו הסבר מפורט ובכתב: מה נכלל, מה לא, האם יש הוצאות נוספות (אגרות בית משפט, חוות דעת מומחים), ומה קורה אם התיק לא מצליח. אל תתביישו לשאול ולהשוות מחירים.', 'justice-theme' ); ?></p>
				<div class="find-guide__step-tip">
					<strong><?php esc_html_e( '💰 שימו לב:', 'justice-theme' ); ?></strong>
					<?php esc_html_e( 'לפי כללי לשכת עורכי הדין, על עורך הדין לחתום על הסכם שכר טרחה בכתב. אם לא מציעים לכם חוזה, זה דגל אדום.', 'justice-theme' ); ?>
				</div>
			</div>

			<!-- Step 6 -->
			<div class="find-guide__step">
				<div class="find-guide__step-number">6</div>
				<div class="find-guide__step-icon">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/><polyline points="16,7 22,7 22,13"/></svg>
				</div>
				<h3 class="find-guide__step-title"><?php esc_html_e( 'בדקו חוות דעת וביקורות', 'justice-theme' ); ?></h3>
				<p class="find-guide__step-desc"><?php esc_html_e( 'קראו ביקורות מלקוחות קודמים. בדקו את הפרופיל באתרי עורכי דין, בגוגל ובפורומים מקצועיים. שימו לב לתבניות: האם לקוחות משבחים את התקשורת? האם יש תלונות חוזרות? בקשו המלצות מחברים ומשפחה שטופלו בהצלחה. זכרו: עורך דין טוב לא רק מנצח תיקים, אלא גם זמין, מגיב, ומעדכן אתכם לאורך כל הדרך.', 'justice-theme' ); ?></p>
				<div class="find-guide__step-tip">
					<strong><?php esc_html_e( '⭐ זכרו:', 'justice-theme' ); ?></strong>
					<?php esc_html_e( 'מספר ביקורות שלילי קטן הוא נורמלי. חפשו תבנית כללית חיובית ושימו לב לאופן שבו עורך הדין מגיב לביקורת.', 'justice-theme' ); ?>
				</div>
			</div>

		</div>

		<!-- Quick FAQ -->
		<div class="find-guide__faq">
			<h3 class="find-guide__faq-title"><?php esc_html_e( 'שאלות נפוצות בבחירת עורך דין', 'justice-theme' ); ?></h3>

			<div class="find-guide__faq-grid">
				<details class="find-guide__faq-item">
					<summary><?php esc_html_e( 'כמה עולה עורך דין בישראל?', 'justice-theme' ); ?></summary>
					<p><?php esc_html_e( 'העלות משתנה לפי תחום, מורכבות התיק, ומיקום גיאוגרפי. ייעוץ ראשוני עולה בין 200-800 ₪. שכר טרחה שעתי נע בין 350-1,500 ₪ לשעה. בתיקי נזיקין, נהוג לעבוד באחוזים (8-25% מהפיצוי). בתיקי גירושין, שכר טרחה נע בין 5,000-30,000 ₪ ומעלה. חשוב לקבל הצעה מפורטת בכתב לפני תחילת העבודה.', 'justice-theme' ); ?></p>
				</details>

				<details class="find-guide__faq-item">
					<summary><?php esc_html_e( 'האם כדאי לקחת עורך דין מהעיר שלי?', 'justice-theme' ); ?></summary>
					<p><?php esc_html_e( 'לא בהכרח. בזכות הטכנולוגיה, עורכי דין רבים עובדים מרחוק (זום, טלפון, מייל). עם זאת, בתיקים שדורשים הופעות בבית משפט ספציפי, ייתכן שעורך דין מקומי יכיר טוב יותר את השופטים ואת הנוהגים המקומיים. כלל אצבע: התמחות חשובה יותר ממיקום.', 'justice-theme' ); ?></p>
				</details>

				<details class="find-guide__faq-item">
					<summary><?php esc_html_e( 'מתי חייבים עורך דין ומתי אפשר בלי?', 'justice-theme' ); ?></summary>
					<p><?php esc_html_e( 'בישראל, ייצוג עצמי אפשרי ברוב ההליכים האזרחיים. עם זאת, מומלץ מאוד להיעזר בעורך דין בתיקים פליליים (חובה בעבירות חמורות), בעסקאות נדל"ן (חובה לפי חוק), בתיקי משפחה מורכבים, ובתיקים מול גופים גדולים (חברות ביטוח, מעסיקים). גם אם לא מייצגים, ייעוץ חד-פעמי יכול לחסוך טעויות יקרות.', 'justice-theme' ); ?></p>
				</details>

				<details class="find-guide__faq-item">
					<summary><?php esc_html_e( 'איך יודעים שעורך הדין טוב?', 'justice-theme' ); ?></summary>
					<p><?php esc_html_e( 'סימנים לעורך דין איכותי: מגיב בזמן סביר, מסביר בשפה ברורה, מציג תוכנית פעולה, שקוף לגבי עלויות, לא מבטיח תוצאות בוודאות מוחלטת (אף אחד לא יכול), מעדכן אתכם באופן שוטף, ויש לו חוות דעת חיוביות מלקוחות קודמים. דגלים אדומים: לחץ לחתום מיד, הבטחות מוגזמות, אי-שקיפות בנושא עלויות.', 'justice-theme' ); ?></p>
				</details>

				<details class="find-guide__faq-item">
					<summary><?php esc_html_e( 'מה ההבדל בין עורך דין לייעוץ משפטי?', 'justice-theme' ); ?></summary>
					<p><?php esc_html_e( 'ייעוץ משפטי הוא שירות חד-פעמי: מבהירים מצב, מסבירים זכויות, ממליצים על דרך פעולה. ייצוג משפטי כולל ליווי מלא: הכנת מסמכים, משא ומתן, הופעות בבית משפט, טיפול בתיק מתחילתו ועד סופו. ייעוץ עולה פחות ומתאים לשאלות פשוטות. ייצוג מתאים כשיש תיק פעיל או סכסוך שדורש טיפול מקיף.', 'justice-theme' ); ?></p>
				</details>

				<details class="find-guide__faq-item">
					<summary><?php esc_html_e( 'מה עושים אם לא מרוצים מעורך הדין?', 'justice-theme' ); ?></summary>
					<p><?php esc_html_e( 'זכותכם להחליף עורך דין בכל שלב. דברו קודם עם עורך הדין על הבעיה, לפעמים תקשורת טובה יותר פותרת את העניין. אם לא נפתר, בקשו את התיק שלכם (כולל כל המסמכים) ופנו לעורך דין חדש. שימו לב: ייתכן שתצטרכו לשלם על עבודה שכבר בוצעה. במקרה של התנהלות לא אתית, ניתן לפנות לוועדת האתיקה של לשכת עורכי הדין.', 'justice-theme' ); ?></p>
				</details>
			</div>
		</div>

		<!-- Red Flags Section -->
		<div class="find-guide__deep-section">
			<h3><?php esc_html_e( '🚩 דגלים אדומים: 7 סימני אזהרה בבחירת עורך דין', 'justice-theme' ); ?></h3>
			<p><?php esc_html_e( 'לפי לשכת עורכי הדין בישראל והמלצות ה-American Bar Association, הסימנים הבאים מחייבים זהירות מיוחדת:', 'justice-theme' ); ?></p>
			<ol>
				<li><strong><?php esc_html_e( 'הבטחת תוצאה:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'עורך דין שמבטיח "ניצחון בטוח" פועל בניגוד לכללי האתיקה. אף עורך דין לא יכול לערוב לתוצאה בבית משפט.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'לחץ לחתום מיד:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'עורך דין מקצועי ייתן לכם זמן לחשוב. לחץ לחתום על הסכם שכר טרחה במקום הוא סימן מדאיג.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'חוסר שקיפות בעלויות:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'סירוב לפרט עלויות, עמלות נסתרות, או חוסר נכונות לחתום על הסכם שכר טרחה בכתב.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'תקשורת לקויה:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'אם עורך הדין לא חוזר לשיחות, לא עונה למיילים, או לא מעדכן, זה יחמיר רק אחרי שתשלמו.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( '"אני מומחה בהכל":', 'justice-theme' ); ?></strong> <?php esc_html_e( 'עורך דין שטוען להתמחות בכל תחום חסר לרוב את העומק הנדרש. חפשו מומחיות ספציפית.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'משרד לא מאורגן:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'מסמכים אבודים, פגישות שנדחות שוב ושוב, או חוסר היכרות עם פרטי התיק שלכם.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'תחושת בטן:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'אם אתם לא מרגישים בנוח, לא מרגישים שמקשיבים לכם, או לא סומכים על עורך הדין, סמכו על האינסטינקט שלכם.', 'justice-theme' ); ?></li>
			</ol>
		</div>

		<!-- Fee Structures -->
		<div class="find-guide__deep-section">
			<h3><?php esc_html_e( '💰 שיטות תמחור שכר טרחה: מדריך השוואתי', 'justice-theme' ); ?></h3>
			<p><?php esc_html_e( 'הבנת מבנה שכר הטרחה היא קריטית לפני שמתחילים לעבוד עם עורך דין. להלן השיטות המקובלות בישראל:', 'justice-theme' ); ?></p>
			<div class="find-guide__fee-grid">
				<div class="find-guide__fee-card">
					<h4><?php esc_html_e( 'שכר טרחה שעתי', 'justice-theme' ); ?></h4>
					<p><?php esc_html_e( 'חיוב לפי שעות עבודה (350-1,500 ₪ לשעה). נפוץ בתחומים מסחריים, ליטיגציה מורכבת, ודיני עבודה. יתרון: משלמים רק על עבודה שבוצעה. חיסרון: קשה לחזות את העלות הסופית.', 'justice-theme' ); ?></p>
				</div>
				<div class="find-guide__fee-card">
					<h4><?php esc_html_e( 'שכר טרחה קבוע (פאושלי)', 'justice-theme' ); ?></h4>
					<p><?php esc_html_e( 'סכום מוסכם מראש עבור כל הטיפול. נפוץ בעסקאות נדל"ן, הסכמי גירושין בהסכמה, ורישום חברות. יתרון: ודאות תקציבית מלאה. חיסרון: אם התיק מתארך, עורך הדין עלול לקצר בטיפול.', 'justice-theme' ); ?></p>
				</div>
				<div class="find-guide__fee-card">
					<h4><?php esc_html_e( 'אחוז מהפיצוי (שכר טרחה מותנה)', 'justice-theme' ); ?></h4>
					<p><?php esc_html_e( 'עורך הדין מקבל 8-25% מהסכום שנפסק. נפוץ בתיקי נזיקין, תאונות דרכים, ורשלנות רפואית. אסור בתיקים פליליים. יתרון: אין תשלום מראש. חיסרון: אם הפיצוי גבוה, שכר הטרחה יהיה גבוה מאוד.', 'justice-theme' ); ?></p>
				</div>
				<div class="find-guide__fee-card">
					<h4><?php esc_html_e( 'ריטיינר (שירות שוטף)', 'justice-theme' ); ?></h4>
					<p><?php esc_html_e( 'תשלום חודשי קבוע עבור ליווי משפטי שוטף. נפוץ אצל עסקים, חברות, ויזמים. יתרון: זמינות מיידית ומחיר צפוי. חיסרון: משלמים גם בחודשים שקטים.', 'justice-theme' ); ?></p>
				</div>
			</div>
			<p><strong><?php esc_html_e( 'חשוב: לפי כללי לשכת עורכי הדין, כל הסכם שכר טרחה חייב להיות בכתב. אם עורך הדין לא מציע הסכם כתוב, אל תמשיכו.', 'justice-theme' ); ?></strong></p>
		</div>

		<!-- When You Must Have a Lawyer -->
		<div class="find-guide__deep-section">
			<h3><?php esc_html_e( '⚖️ מתי חובה להיעזר בעורך דין?', 'justice-theme' ); ?></h3>
			<p><?php esc_html_e( 'בישראל, ייצוג עצמי מותר ברוב ההליכים האזרחיים. עם זאת, במקרים הבאים חובה או מומלץ מאוד להיעזר בעורך דין:', 'justice-theme' ); ?></p>
			<ul>
				<li><strong><?php esc_html_e( 'הליכים פליליים:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'חובת ייצוג בעבירות שעונשן מעל 10 שנות מאסר. מומלץ מאוד בכל תיק פלילי.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'עסקאות נדל"ן:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'חובה לפי חוק. עורך דין נדל"ן מטפל ברישום טאבו, בדיקת זכויות, ועריכת חוזה.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'גירושין ומשמורת:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'מומלץ מאוד כשיש ילדים, רכוש משותף, או מחלוקת. שגיאות בהסכם גירושין עלולות להשפיע שנים קדימה.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'תביעות ביטוח ונזיקין:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'חברות ביטוח מעסיקות צוותים משפטיים. בלי ייצוג, הפיצוי שלכם יהיה נמוך משמעותית.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'סכסוכי עבודה:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'פיטורים שלא כדין, הטרדה מינית, הפרת חוזה עבודה: עורך דין דיני עבודה מכיר את הפסיקות והזכויות.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'ירושה וצוואות:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'עריכת צוואה, קבלת צו ירושה, או התנגדות לצוואה דורשות ידע משפטי מדויק.', 'justice-theme' ); ?></li>
			</ul>
			<p><?php esc_html_e( 'גם כשלא חובה, ייעוץ משפטי חד-פעמי (200-800 ₪) יכול לחסוך טעויות יקרות של אלפי שקלים.', 'justice-theme' ); ?></p>
		</div>

		<!-- 10 Questions Checklist -->
		<div class="find-guide__deep-section">
			<h3><?php esc_html_e( '📋 10 שאלות שחייבים לשאול עורך דין לפני ששוכרים אותו', 'justice-theme' ); ?></h3>
			<ol>
				<li><?php esc_html_e( 'מה תחום ההתמחות העיקרי שלך? כמה שנים אתה עוסק בתחום הזה?', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'כמה תיקים דומים לשלי טיפלת? מה היו התוצאות?', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'מהי ההערכה שלך לגבי סיכויי התיק? מהם הסיכונים?', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'מי יטפל בתיק ביומיום: אתה אישית, שותף, או מתמחה?', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'מהו מבנה שכר הטרחה? האם יש הוצאות נוספות (אגרות, מומחים)?', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'האם תוכל לספק הסכם שכר טרחה כתוב ומפורט?', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'כמה זמן צפוי ההליך להימשך? מה עלול לגרום לעיכובים?', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'איך ניתן ליצור קשר? כמה פעם אקבל עדכון על מצב התיק?', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'האם יש חלופות (גישור, בוררות, פשרה) שכדאי לשקול?', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'מה קורה אם ארצה להחליף עורך דין באמצע ההליך?', 'justice-theme' ); ?></li>
			</ol>
		</div>

		<!-- Types of Lawyers by Practice Area -->
		<div class="find-guide__deep-section">
			<h3><?php esc_html_e( '👨‍⚖️ סוגי עורכי דין לפי תחום: מתי לפנות לכל מומחה?', 'justice-theme' ); ?></h3>
			<p><?php esc_html_e( 'המשפט הישראלי מתחלק לעשרות תחומי התמחות. בחירת עורך דין עם מומחיות ספציפית בתחום שלכם יכולה לעשות את ההבדל בין הצלחה לכישלון. להלן התחומים העיקריים ומתי כדאי לפנות לכל סוג של עורך דין:', 'justice-theme' ); ?></p>

			<div class="find-guide__specialties-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.2rem; margin: 1.5rem 0;">
				<div class="find-guide__specialty-card" style="background: rgba(82, 114, 178, 0.05); padding: 1.2rem; border-radius: 12px; border-right: 3px solid var(--color-accent, #5272b2);">
					<h4><?php esc_html_e( 'עורך דין משפחה וגירושין', 'justice-theme' ); ?></h4>
					<p style="font-size: 0.9rem; color: var(--color-muted, #666);"><?php esc_html_e( 'גירושין, משמורת ילדים, מזונות, הסכמי ממון, ידועים בציבור, אימוץ, אפוטרופסות. מומלץ לפנות מייד כשיש סכסוך משפחתי, שגיאות בשלב מוקדם עלולות לעלות ביוקר שנים קדימה. בישראל, ענייני נישואין וגירושין נידונים בבית הדין הרבני.', 'justice-theme' ); ?></p>
				</div>
				<div class="find-guide__specialty-card" style="background: rgba(82, 114, 178, 0.05); padding: 1.2rem; border-radius: 12px; border-right: 3px solid var(--color-accent, #5272b2);">
					<h4><?php esc_html_e( 'עורך דין פלילי', 'justice-theme' ); ?></h4>
					<p style="font-size: 0.9rem; color: var(--color-muted, #666);"><?php esc_html_e( 'עבירות אלימות, סמים, הונאה, עבירות מין, צווארון לבן, הליכי מעצר, ערעורים פליליים. פנו מיד כשיש חשד או הזמנה לחקירה. אל תמסרו עדות בלי עורך דין. בעבירות שעונשן מעל 10 שנים, הייצוג הוא חובה.', 'justice-theme' ); ?></p>
				</div>
				<div class="find-guide__specialty-card" style="background: rgba(82, 114, 178, 0.05); padding: 1.2rem; border-radius: 12px; border-right: 3px solid var(--color-accent, #5272b2);">
					<h4><?php esc_html_e( 'עורך דין מקרקעין ונדל"ן', 'justice-theme' ); ?></h4>
					<p style="font-size: 0.9rem; color: var(--color-muted, #666);"><?php esc_html_e( 'קנייה ומכירה של דירה, בדיקת זכויות בטאבו, רישום בית משותף, סכסוכי שכנים, עסקאות קומבינציה, תמ"א 38, פינוי בינוי. בישראל, חובה לפי חוק שעורך דין ילווה כל עסקת נדל"ן.', 'justice-theme' ); ?></p>
				</div>
				<div class="find-guide__specialty-card" style="background: rgba(82, 114, 178, 0.05); padding: 1.2rem; border-radius: 12px; border-right: 3px solid var(--color-accent, #5272b2);">
					<h4><?php esc_html_e( 'עורך דין נזיקין ותאונות', 'justice-theme' ); ?></h4>
					<p style="font-size: 0.9rem; color: var(--color-muted, #666);"><?php esc_html_e( 'תאונות דרכים, תאונות עבודה, רשלנות רפואית, נפילות, נזקי גוף. רוב עורכי הדין בתחום עובדים באחוזים (8%-25% מהפיצוי), כך שאין צורך בתשלום מראש. פנו מוקדם ככל האפשר, יש התיישנות של 7 שנים.', 'justice-theme' ); ?></p>
				</div>
				<div class="find-guide__specialty-card" style="background: rgba(82, 114, 178, 0.05); padding: 1.2rem; border-radius: 12px; border-right: 3px solid var(--color-accent, #5272b2);">
					<h4><?php esc_html_e( 'עורך דין עבודה', 'justice-theme' ); ?></h4>
					<p style="font-size: 0.9rem; color: var(--color-muted, #666);"><?php esc_html_e( 'פיטורים שלא כדין, הטרדה מינית, אפליה, הפרת חוזה עבודה, שעות נוספות, פנסיה, זכויות עובדים. פנו כשהמעסיק מפר זכויות, בית הדין לעבודה מכיר בזכויות רבות גם ללא חוזה כתוב.', 'justice-theme' ); ?></p>
				</div>
				<div class="find-guide__specialty-card" style="background: rgba(82, 114, 178, 0.05); padding: 1.2rem; border-radius: 12px; border-right: 3px solid var(--color-accent, #5272b2);">
					<h4><?php esc_html_e( 'עורך דין ירושה וצוואות', 'justice-theme' ); ?></h4>
					<p style="font-size: 0.9rem; color: var(--color-muted, #666);"><?php esc_html_e( 'עריכת צוואה, בקשת צו ירושה, התנגדות לצוואה, ניהול עיזבון, הסכמי חלוקת ירושה. מומלץ לערוך צוואה בגיל צעיר כדי למנוע סכסוכים. עורך דין ירושה מכיר את חוק הירושה 1965 ואת הפסיקה העדכנית.', 'justice-theme' ); ?></p>
				</div>
			</div>

			<p><?php esc_html_e( 'לרשימה מלאה של תחומי התמחות ועורכי דין מומחים, השתמשו בחיפוש המתקדם שלנו בראש העמוד.', 'justice-theme' ); ?></p>
		</div>

		<!-- Online vs Offline Search -->
		<div class="find-guide__deep-section">
			<h3><?php esc_html_e( '🌐 חיפוש עורך דין באינטרנט לעומת המלצות אישיות: מה עדיף?', 'justice-theme' ); ?></h3>
			<p><?php esc_html_e( 'לפי מחקרים של ה-American Bar Association ואתרי FindLaw ו-Avvo, שילוב של שתי השיטות מניב את התוצאה הטובה ביותר:', 'justice-theme' ); ?></p>
			<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 1.5rem 0;">
				<div style="background: rgba(16, 185, 129, 0.06); padding: 1.2rem; border-radius: 12px;">
					<h4 style="color: #10b981;"><?php esc_html_e( '✅ יתרונות חיפוש אונליין', 'justice-theme' ); ?></h4>
					<ul style="font-size: 0.9rem; padding-right: 1.2rem;">
						<li><?php esc_html_e( 'גישה למאות עורכי דין ברגע אחד', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'ביקורות ודירוגים מלקוחות אמיתיים', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'סינון לפי תחום, עיר, שפה ומחיר', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'מאמרים מקצועיים שמעידים על מומחיות', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'השוואה בין מספר מועמדים ללא לחץ', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'בדיקת רישיון ומעמד באתר לשכת עוה"ד', 'justice-theme' ); ?></li>
					</ul>
				</div>
				<div style="background: rgba(59, 130, 246, 0.06); padding: 1.2rem; border-radius: 12px;">
					<h4 style="color: #3b82f6;"><?php esc_html_e( '✅ יתרונות המלצה אישית', 'justice-theme' ); ?></h4>
					<ul style="font-size: 0.9rem; padding-right: 1.2rem;">
						<li><?php esc_html_e( 'חוויה ממקור ראשון מאדם שאתם סומכים עליו', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'מידע על הגישה האישית ואופי העבודה', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'פרטים שלא מופיעים בפרופיל מקוון', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'תחושת ביטחון ראשונית', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'אפשרות לתיווך ו"כניסה חמה"', 'justice-theme' ); ?></li>
					</ul>
				</div>
			</div>
			<p><strong><?php esc_html_e( 'המלצה: התחילו עם חיפוש אונליין כדי לבנות רשימה קצרה, ואז בקשו המלצות אישיות כדי לאמת. זוהי הגישה המומלצת על ידי לשכת עורכי הדין בישראל ו-ABA.', 'justice-theme' ); ?></strong></p>
		</div>

		<!-- First Meeting Preparation -->
		<div class="find-guide__deep-section">
			<h3><?php esc_html_e( '📂 הכנה לפגישה ראשונה עם עורך דין: רשימת מסמכים', 'justice-theme' ); ?></h3>
			<p><?php esc_html_e( 'הגעה מוכנה לפגישה הראשונית חוסכת זמן ויקרה, ומאפשרת לעורך הדין לתת לכם הערכה מדויקת יותר. הנה מה להביא:', 'justice-theme' ); ?></p>
			<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; margin: 1rem 0;">
				<div style="background: rgba(0,0,0,0.03); padding: 1rem; border-radius: 8px;">
					<h4><?php esc_html_e( 'כל תיק', 'justice-theme' ); ?></h4>
					<ul style="font-size: 0.88rem; padding-right: 1.2rem;">
						<li><?php esc_html_e( 'תיאור כתוב קצר של המצב', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'ציר זמן עם תאריכים מרכזיים', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'רשימת שאלות שרוצים לשאול', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'תעודת זהות', 'justice-theme' ); ?></li>
					</ul>
				</div>
				<div style="background: rgba(0,0,0,0.03); padding: 1rem; border-radius: 8px;">
					<h4><?php esc_html_e( 'דיני משפחה', 'justice-theme' ); ?></h4>
					<ul style="font-size: 0.88rem; padding-right: 1.2rem;">
						<li><?php esc_html_e( 'תעודת נישואין', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'הסכם ממון (אם קיים)', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'מסמכי רכוש (נסחי טאבו)', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'תלושי שכר של שני בני הזוג', 'justice-theme' ); ?></li>
					</ul>
				</div>
				<div style="background: rgba(0,0,0,0.03); padding: 1rem; border-radius: 8px;">
					<h4><?php esc_html_e( 'נזיקין / תאונות', 'justice-theme' ); ?></h4>
					<ul style="font-size: 0.88rem; padding-right: 1.2rem;">
						<li><?php esc_html_e( 'דו"ח משטרה / דו"ח תאונה', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'מסמכים רפואיים ואישורי מחלה', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'תמונות מהאירוע', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'פוליסת ביטוח', 'justice-theme' ); ?></li>
					</ul>
				</div>
				<div style="background: rgba(0,0,0,0.03); padding: 1rem; border-radius: 8px;">
					<h4><?php esc_html_e( 'פלילי', 'justice-theme' ); ?></h4>
					<ul style="font-size: 0.88rem; padding-right: 1.2rem;">
						<li><?php esc_html_e( 'הזמנה לחקירה / כתב אישום', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'תנאי שחרור ממעצר (אם רלוונטי)', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'גיליון רישום פלילי (אם זמין)', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'עדויות או ראיות שיש ברשותכם', 'justice-theme' ); ?></li>
					</ul>
				</div>
			</div>
			<p><strong><?php esc_html_e( 'טיפ מהפרקטיקה: צלמו את כל המסמכים לפני הפגישה ושמרו עותק דיגיטלי. אף פעם אל תמסרו מסמכים מקוריים בלי לשמור העתק.', 'justice-theme' ); ?></strong></p>
		</div>

		<!-- Client Rights -->
		<div class="find-guide__deep-section">
			<h3><?php esc_html_e( '🛡️ הזכויות שלכם כלקוחות: מה לשכת עורכי הדין מחייבת?', 'justice-theme' ); ?></h3>
			<p><?php esc_html_e( 'לפי כללי לשכת עורכי הדין בישראל וחוק לשכת עורכי הדין, התשכ"א-1961, יש לכם זכויות ברורות שחשוב להכיר:', 'justice-theme' ); ?></p>
			<ol>
				<li><strong><?php esc_html_e( 'הסכם שכר טרחה כתוב:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'עורך הדין חייב לפרט את שכר הטרחה ואת תנאי ההתקשרות בכתב. זו אינה המלצה. זו חובה.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'סודיות מלאה:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'כל מה שתספרו לעורך הדין חסוי על פי חיסיון עורך דין-לקוח. הוא לא יכול לחשוף מידע בלי הסכמתכם (למעט חריגים קיצוניים הקבועים בחוק).', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'עדכון שוטף:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'יש לכם זכות לדעת מה קורה בתיק. עורך דין שלא מעדכן אתכם מפר את חובתו.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'החלפת עורך דין:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'זכותכם להחליף עורך דין בכל שלב. עורך הדין חייב להעביר לכם את כל חומרי התיק.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'תלונה לוועדת אתיקה:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'אם אתם חשים שעורך הדין פעל באופן לא אתי, תוכלו להגיש תלונה לוועדת האתיקה של לשכת עורכי הדין. התלונה אינה עולה כסף.', 'justice-theme' ); ?></li>
				<li><strong><?php esc_html_e( 'אין הבטחת תוצאות:', 'justice-theme' ); ?></strong> <?php esc_html_e( 'עורך דין שמבטיח לכם "ניצחון בטוח" פועל בניגוד לכללי האתיקה. אף עורך דין לא יכול לערוב לתוצאה.', 'justice-theme' ); ?></li>
			</ol>
			<p><?php esc_html_e( 'לפרטים נוספים: אתר לשכת עורכי הדין בישראל, israelbar.org.il', 'justice-theme' ); ?></p>
		</div>

		<!-- CTA -->
		<div class="find-guide__cta">
			<p><?php esc_html_e( 'מוכנים למצוא עורך דין מתאים?', 'justice-theme' ); ?></p>
			<div class="find-guide__cta-buttons">
				<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" class="button button--primary">
					<?php esc_html_e( 'חיפוש עורך דין לפי תחום', 'justice-theme' ); ?>
				</a>
				<a href="#hero-search-form" class="button button--ghost">
					<?php esc_html_e( 'חזרו לחיפוש ↑', 'justice-theme' ); ?>
				</a>
			</div>
		</div>

	</div>
</section>
