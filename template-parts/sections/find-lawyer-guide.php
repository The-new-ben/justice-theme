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

		<!-- Guide Visual -->
		<div class="find-guide__visual">
			<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/guide-hero.png' ); ?>"
				alt="<?php esc_attr_e( 'מחקר משפטי — חיפוש עורך דין מתאים', 'justice-theme' ); ?>"
				width="760" height="420" loading="lazy" decoding="async">
		</div>

		<!-- Steps Grid -->
		<div class="find-guide__steps">

			<!-- Step 1 -->
			<div class="find-guide__step">
				<div class="find-guide__step-number">1</div>
				<div class="find-guide__step-icon">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" d="m21 21-4.35-4.35"/></svg>
				</div>
				<h3 class="find-guide__step-title"><?php esc_html_e( 'זהו את סוג הבעיה המשפטית', 'justice-theme' ); ?></h3>
				<p class="find-guide__step-desc"><?php esc_html_e( 'לפני שמחפשים עורך דין, חשוב להבין באיזה תחום משפטי מדובר. דיני משפחה? נזיקין? מקרקעין? עבודה? פלילי? התשובה תשפיע על סוג המומחיות שאתם צריכים. אם אתם לא בטוחים — זה בסדר. שיחת ייעוץ ראשונית (לרוב ללא תשלום) תעזור לכם להבין.', 'justice-theme' ); ?></p>
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
					<?php esc_html_e( 'עורך דין שמפרסם תוכן מקצועי (מאמרים, סרטונים, פודקאסטים) בתחום שלכם — סימן טוב למומחיות ומעורבות בתחום.', 'justice-theme' ); ?>
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
					<?php esc_html_e( 'לפי כללי לשכת עורכי הדין, על עורך הדין לחתום על הסכם שכר טרחה בכתב. אם לא מציעים לכם חוזה — זה דגל אדום.', 'justice-theme' ); ?>
				</div>
			</div>

			<!-- Step 6 -->
			<div class="find-guide__step">
				<div class="find-guide__step-number">6</div>
				<div class="find-guide__step-icon">
					<svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/><polyline points="16,7 22,7 22,13"/></svg>
				</div>
				<h3 class="find-guide__step-title"><?php esc_html_e( 'בדקו חוות דעת וביקורות', 'justice-theme' ); ?></h3>
				<p class="find-guide__step-desc"><?php esc_html_e( 'קראו ביקורות מלקוחות קודמים. בדקו את הפרופיל באינדקסים משפטיים, בגוגל, ובפורומים מקצועיים. שימו לב לתבניות: האם לקוחות משבחים את התקשורת? האם יש תלונות חוזרות? בקשו המלצות מחברים ומשפחה שטופלו בהצלחה. זכרו — עורך דין טוב לא רק מנצח תיקים, אלא גם זמין, מגיב, ומעדכן אתכם לאורך כל הדרך.', 'justice-theme' ); ?></p>
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
					<p><?php esc_html_e( 'בישראל, ייצוג עצמי אפשרי ברוב ההליכים האזרחיים. עם זאת, מומלץ מאוד להיעזר בעורך דין בתיקים פליליים (חובה בעבירות חמורות), בעסקאות נדל"ן (חובה לפי חוק), בתיקי משפחה מורכבים, ובתיקים מול גופים גדולים (חברות ביטוח, מעסיקים). גם אם לא מייצגים — ייעוץ חד-פעמי יכול לחסוך טעויות יקרות.', 'justice-theme' ); ?></p>
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
					<p><?php esc_html_e( 'זכותכם להחליף עורך דין בכל שלב. דברו קודם עם עורך הדין על הבעיה — לפעמים תקשורת טובה יותר פותרת את העניין. אם לא נפתר, בקשו את התיק שלכם (כולל כל המסמכים) ופנו לעורך דין חדש. שימו לב: ייתכן שתצטרכו לשלם על עבודה שכבר בוצעה. במקרה של התנהלות לא אתית, ניתן לפנות לוועדת האתיקה של לשכת עורכי הדין.', 'justice-theme' ); ?></p>
				</details>
			</div>
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
