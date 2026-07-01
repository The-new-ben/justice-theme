<?php
/**
 * Homepage FAQ per Homepage.dc.html: native <details> accordions whose
 * answers are always in the DOM (crawlers see them without interaction),
 * plus matching FAQPage JSON-LD.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_faqs = array(
	array(
		'q' => __( 'כמה עולה עורך דין בישראל?', 'justice-theme' ),
		'a' => __( 'העלות משתנה לפי תחום, מורכבות התיק ומיקום. ייעוץ ראשוני עולה בין 200-800 שקלים. שכר טרחה שעתי נע בין 350-1,500 שקלים לשעה. בתיקי נזיקין נהוג לעבוד באחוזים (8-25% מהפיצוי). חשוב לקבל הצעה מפורטת בכתב לפני תחילת העבודה.', 'justice-theme' ),
	),
	array(
		'q' => __( 'האם כדאי לקחת עורך דין מהעיר שלי?', 'justice-theme' ),
		'a' => __( 'לא בהכרח. עורכי דין רבים עובדים מרחוק בשיחות וידאו, טלפון ומייל. בתיקים שדורשים הופעות בבית משפט ספציפי, ייתכן שעורך דין מקומי יכיר טוב יותר את הנוהגים המקומיים. התמחות חשובה בדרך כלל יותר ממיקום.', 'justice-theme' ),
	),
	array(
		'q' => __( 'מתי חייבים עורך דין ומתי אפשר בלי?', 'justice-theme' ),
		'a' => __( 'ייצוג עצמי אפשרי ברוב ההליכים האזרחיים. עם זאת, מומלץ מאוד בתיקים פליליים, בעסקאות נדל"ן (חובה לפי חוק), בתיקי משפחה מורכבים ובתיקים מול גופים גדולים כמו חברות ביטוח או מעסיקים.', 'justice-theme' ),
	),
	array(
		'q' => __( 'איך יודעים שעורך הדין טוב?', 'justice-theme' ),
		'a' => __( 'סימנים לעורך דין איכותי: מגיב בזמן סביר, מסביר בשפה ברורה, שקוף לגבי עלויות, ולא מבטיח תוצאה בוודאות מוחלטת. אף עורך דין לא יכול לערוב לתוצאה בבית משפט.', 'justice-theme' ),
	),
	array(
		'q' => __( 'מה ההבדל בין ייעוץ משפטי לייצוג משפטי?', 'justice-theme' ),
		'a' => __( 'ייעוץ משפטי הוא שירות חד-פעמי שמבהיר מצב, זכויות והמלצה לדרך פעולה. ייצוג משפטי כולל ליווי מלא: הכנת מסמכים, משא ומתן והופעות בבית משפט מתחילת התיק ועד סופו.', 'justice-theme' ),
	),
);

$justice_faq_schema = array(
	'@context'   => 'https://schema.org',
	'@type'      => 'FAQPage',
	'mainEntity' => array(),
);

foreach ( $justice_faqs as $justice_faq ) {
	$justice_faq_schema['mainEntity'][] = array(
		'@type'          => 'Question',
		'name'           => $justice_faq['q'],
		'acceptedAnswer' => array(
			'@type' => 'Answer',
			'text'  => $justice_faq['a'],
		),
	);
}
?>

<section class="jt2-section" id="faq">
	<div class="jt2-faq">
		<span class="jt2-eyebrow" style="text-align:center"><?php esc_html_e( 'שאלות נפוצות', 'justice-theme' ); ?></span>
		<h2 class="jt2-h2" style="text-align:center;margin-bottom:32px"><?php esc_html_e( 'שאלות שאנשים שואלים לפני שפונים לעורך דין', 'justice-theme' ); ?></h2>
		<?php foreach ( $justice_faqs as $justice_faq_index => $justice_faq ) : ?>
			<details <?php echo 0 === $justice_faq_index ? 'open' : ''; ?>>
				<summary><?php echo esc_html( $justice_faq['q'] ); ?></summary>
				<p><?php echo esc_html( $justice_faq['a'] ); ?></p>
			</details>
		<?php endforeach; ?>
	</div>
	<script type="application/ld+json"><?php echo wp_json_encode( $justice_faq_schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ); ?></script>
</section>
