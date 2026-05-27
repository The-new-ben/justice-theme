<?php
/**
 * Homepage legal service flow.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$service_steps = array(
	array(
		'step'  => __( '1', 'justice-theme' ),
		'title' => __( 'מספרים מה קרה', 'justice-theme' ),
		'text'  => __( 'כותבים בכמה משפטים את הבעיה, העיר, הדחיפות והמסמכים שכבר יש. אפשר להתחיל מטופס או מוואטסאפ.', 'justice-theme' ),
	),
	array(
		'step'  => __( '2', 'justice-theme' ),
		'title' => __( 'מסדרים את הפנייה', 'justice-theme' ),
		'text'  => __( 'בודקים תחום, עיר, דחיפות וסוג המסלול: מידע כללי, השוואת עורכי דין או פנייה שדורשת המשך טיפול.', 'justice-theme' ),
	),
	array(
		'step'  => __( '3', 'justice-theme' ),
		'title' => __( 'מבינים מחיר וצעד הבא', 'justice-theme' ),
		'text'  => __( 'לפני התחייבות, חשוב לדעת מה השירות כולל, מה לא מובטח, ומה צריך לבדוק מול עורך דין או ספק מתאים.', 'justice-theme' ),
	),
	array(
		'step'  => __( '4', 'justice-theme' ),
		'title' => __( 'נשארים עם עדכון ברור', 'justice-theme' ),
		'text'  => __( 'אם הפנייה מתקדמת, המטרה היא לא להשאיר אתכם באוויר: מי מטפל, מה חסר, ומה מועד החזרה הבא.', 'justice-theme' ),
	),
);
?>

<section class="homepage-service-flow section" aria-labelledby="homepage-service-flow-title">
	<div class="container homepage-service-flow__inner">
		<div class="homepage-service-flow__header">
			<p class="section-header__eyebrow"><?php esc_html_e( 'איך מקבלים עזרה', 'justice-theme' ); ?></p>
			<h2 id="homepage-service-flow-title"><?php esc_html_e( 'מהפנייה הראשונה עד עורך דין מתאים, בלי להישאר בחוסר ודאות', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'אנשים לא מגיעים לאתר משפטי כדי לקרוא עוד סיסמאות. הם רוצים להבין אם יש בעיה, למי פונים, כמה זה עלול לעלות ומה קורה אחרי שמשאירים פרטים.', 'justice-theme' ); ?></p>
		</div>

		<div class="homepage-service-flow__steps">
			<?php foreach ( $service_steps as $service_step ) : ?>
				<article class="homepage-service-flow__step">
					<span><?php echo esc_html( $service_step['step'] ); ?></span>
					<h3><?php echo esc_html( $service_step['title'] ); ?></h3>
					<p><?php echo esc_html( $service_step['text'] ); ?></p>
				</article>
			<?php endforeach; ?>
		</div>

		<div class="homepage-service-flow__cta">
			<a class="button button--primary" href="<?php echo esc_url( home_url( '/#ask-lawyer' ) ); ?>"><?php esc_html_e( 'להשאיר פנייה עכשיו', 'justice-theme' ); ?></a>
			<a class="button button--outline" href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>"><?php esc_html_e( 'לחפש עורך דין', 'justice-theme' ); ?></a>
		</div>
	</div>
</section>
