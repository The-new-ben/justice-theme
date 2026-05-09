<?php
/**
 * Homepage featured lawyer section.
 *
 * Only the verified client profile is allowed here.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$verified_lawyer = null;

if ( post_type_exists( 'justice_lawyer' ) ) {
	$verified_lawyer = new WP_Query(
		array(
			'name'           => 'advocate-maya-rotenberg',
			'post_type'      => 'justice_lawyer',
			'post_status'    => 'publish',
			'posts_per_page' => 1,
		)
	);

	if ( ! $verified_lawyer->have_posts() ) {
		$verified_lawyer = new WP_Query(
			array(
				's'              => 'מאיה רוטנברג',
				'post_type'      => 'justice_lawyer',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
			)
		);
	}
}
?>

<section class="featured-lawyers section" id="featured-lawyers">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'עורכת דין מאומתת', 'justice-theme' ); ?></p>
				<h2><?php esc_html_e( 'מיני-סייט מקצועי לדיני משפחה', 'justice-theme' ); ?></h2>
			</div>
			<a href="<?php echo esc_url( home_url( '/join/' ) ); ?>" class="button button--gold">
				<?php esc_html_e( 'לעורכי דין: בניית מיני-סייט', 'justice-theme' ); ?>
			</a>
		</div>

		<?php if ( $verified_lawyer && $verified_lawyer->have_posts() ) : ?>
			<div class="verified-lawyer-showcase">
				<div class="verified-lawyer-showcase__profile">
					<?php
					while ( $verified_lawyer->have_posts() ) :
						$verified_lawyer->the_post();
						get_template_part( 'template-parts/cards/lawyer-card' );
					endwhile;
					wp_reset_postdata();
					?>
				</div>

				<div class="verified-lawyer-showcase__value">
					<h3><?php esc_html_e( 'מה עורך דין מקבל בפרופיל פרימיום?', 'justice-theme' ); ?></h3>
					<ul>
						<li><?php esc_html_e( 'עמוד פרופיל עשיר עם תמונה, וידאו, תחומי התמחות, אזורי שירות ופרטי קשר.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'מאמרים מקצועיים חתומים בשם עורך הדין ומקושרים לתחומי המשפט הרלוונטיים.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'פניות לקוחות, WhatsApp, טלפון ומעקב לידים ממקור אחד.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'ביקורות מאושרות, קישורים חברתיים, מדדי חשיפה ותוכן שמחזק אמון לאורך זמן.', 'justice-theme' ); ?></li>
					</ul>
				</div>
			</div>
		<?php else : ?>
			<div class="verified-lawyer-showcase verified-lawyer-showcase--empty">
				<h3><?php esc_html_e( 'פרופיל עורכת הדין המאומתת יופיע כאן לאחר שיוגדר במערכת.', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'עמוד הבית לא מציג עורכי דין דמו או המלצות לא מאומתות. רק לקוח שאושר ידנית יכול להופיע כאן.', 'justice-theme' ); ?></p>
				<a class="button button--gold" href="<?php echo esc_url( home_url( '/join/' ) ); ?>">
					<?php esc_html_e( 'הצטרפות עורכי דין', 'justice-theme' ); ?>
				</a>
			</div>
		<?php endif; ?>
	</div>
</section>
