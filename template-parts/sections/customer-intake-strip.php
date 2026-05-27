<?php
/**
 * Homepage customer intake strip.
 *
 * A practical bridge between search intent and lead capture for visitors who
 * arrive stressed, unsure which practice area fits, or ready to compare lawyers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$intake_cards = array(
	array(
		'label'       => __( 'יש לי בעיה דחופה ואני לא יודע מאיפה להתחיל', 'justice-theme' ),
		'description' => __( 'כתבו בקצרה מה קרה, באיזו עיר מדובר והאם יש מועד קרוב כמו דיון, שימוע, חקירה, תשלום או מכתב אזהרה. כך קל יותר להבין אם צריך מדריך, עורך דין או בדיקה נוספת לפני פעולה.', 'justice-theme' ),
		'url'         => '#ask-lawyer',
		'action'      => __( 'שליחת פנייה', 'justice-theme' ),
	),
	array(
		'label'       => __( 'אני רוצה להבין את הזכויות והאפשרויות שלי', 'justice-theme' ),
		'description' => __( 'עברו למדריכים לפי נושא משפטי וקראו מה בדרך כלל בודקים, אילו מסמכים מכינים, מה עלול להיות דחוף ואילו שאלות כדאי לשאול לפני שמשלמים על ייעוץ או ייצוג.', 'justice-theme' ),
		'url'         => home_url( '/articles/' ),
		'action'      => __( 'קריאת מדריכים', 'justice-theme' ),
	),
	array(
		'label'       => __( 'אני מוכן להשוות עורכי דין בצורה מסודרת', 'justice-theme' ),
		'description' => __( 'חפשו לפי תחום ועיר, קראו פרופילים ותוכן מקצועי, בדקו התאמה לשאלה שלכם, ואז פנו רק למי שנראה רלוונטי. אין צורך להתחייב לפני שמבינים את המסלול והעלות.', 'justice-theme' ),
		'url'         => home_url( '/lawyers/' ),
		'action'      => __( 'חיפוש עורכי דין', 'justice-theme' ),
	),
);
?>

<section class="customer-intake-strip" aria-labelledby="customer-intake-title">
	<div class="container">
		<div class="customer-intake-strip__header">
			<p class="section-header__eyebrow"><?php esc_html_e( 'מסלול מהיר ללקוח', 'justice-theme' ); ?></p>
			<h2 id="customer-intake-title"><?php esc_html_e( 'שלושה מסלולים ברורים לפי רמת הדחיפות שלכם', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'לא כל שאלה משפטית מתחילה באותו מקום. לפעמים צריך לקרוא ולהבין, לפעמים להשוות עורכי דין, ולפעמים להשאיר פנייה קצרה כדי שמישהו יבחן לאיזה תחום הבעיה שייכת.', 'justice-theme' ); ?></p>
		</div>

		<div class="customer-intake-strip__grid">
			<?php foreach ( $intake_cards as $index => $card ) : ?>
				<article class="customer-intake-card">
					<span class="customer-intake-card__number"><?php echo esc_html( (string) ( $index + 1 ) ); ?></span>
					<h3><?php echo esc_html( $card['label'] ); ?></h3>
					<p><?php echo esc_html( $card['description'] ); ?></p>
					<a href="<?php echo esc_url( $card['url'] ); ?>"><?php echo esc_html( $card['action'] ); ?></a>
				</article>
			<?php endforeach; ?>
		</div>
	</div>
</section>
