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
		'label'       => __( 'אני צריך עורך דין עכשיו', 'justice-theme' ),
		'description' => __( 'השאירו פרטים ותיאור קצר. הפנייה תיבדק לפי תחום, עיר ודחיפות כדי שנוכל לכוון אותה בצורה מסודרת.', 'justice-theme' ),
		'url'         => '#ask-lawyer',
		'action'      => __( 'שליחת פנייה', 'justice-theme' ),
	),
	array(
		'label'       => __( 'אני רוצה להבין את התחום', 'justice-theme' ),
		'description' => __( 'עברו למדריכים לפי נושא משפטי לפני פנייה לעורך דין: משפחה, פלילי, מקרקעין, עבודה, נזיקין ועוד.', 'justice-theme' ),
		'url'         => home_url( '/articles/' ),
		'action'      => __( 'קריאת מדריכים', 'justice-theme' ),
	),
	array(
		'label'       => __( 'אני רוצה להשוות עורכי דין', 'justice-theme' ),
		'description' => __( 'חפשו לפי תחום ועיר, בדקו פרופיל, פרטי קשר ותוכן מקצועי, ואז פנו רק למי שנראה מתאים למקרה שלכם.', 'justice-theme' ),
		'url'         => home_url( '/lawyers/' ),
		'action'      => __( 'חיפוש עורכי דין', 'justice-theme' ),
	),
);
?>

<section class="customer-intake-strip" aria-labelledby="customer-intake-title">
	<div class="container">
		<div class="customer-intake-strip__header">
			<p class="section-header__eyebrow"><?php esc_html_e( 'מסלול מהיר ללקוח', 'justice-theme' ); ?></p>
			<h2 id="customer-intake-title"><?php esc_html_e( 'שלושה צעדים פשוטים כדי להתקדם נכון', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'האתר לא מחליף ייעוץ משפטי, אבל הוא כן עוזר לכם להגיע מהר יותר למידע, לפרופילים ולפנייה מסודרת.', 'justice-theme' ); ?></p>
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
