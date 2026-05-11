<?php
/**
 * Homepage featured lawyer section.
 *
 * Only public-approved lawyer profiles are allowed here.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$featured_lawyer = null;

if ( post_type_exists( 'justice_lawyer' ) ) {
	if ( function_exists( 'justice_theme_get_connected_lawyer_by_slug' ) ) {
		$featured_lawyer = justice_theme_get_connected_lawyer_by_slug( 'advocate-maya-rotenberg' );
	}

	if ( ! $featured_lawyer instanceof WP_Post ) {
		$query = new WP_Query(
			array(
				'name'           => 'advocate-maya-rotenberg',
				'post_type'      => 'justice_lawyer',
				'post_status'    => 'publish',
				'posts_per_page' => 1,
				'no_found_rows'  => true,
			)
		);

		if ( $query->have_posts() ) {
			$featured_lawyer = $query->posts[0];
		}
	}

	if (
		! $featured_lawyer instanceof WP_Post
		|| ! function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
		|| ! justice_theme_lawyer_profile_is_public_approved( (int) $featured_lawyer->ID )
	) {
		$featured_lawyer = null;
	}
}
?>

<section class="featured-lawyers section" id="featured-lawyers">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'פרופיל עורכת דין', 'justice-theme' ); ?></p>
				<h2><?php esc_html_e( 'מיני-סייט מקצועי בדיני משפחה', 'justice-theme' ); ?></h2>
			</div>
			<a href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>" class="button button--gold">
				<?php esc_html_e( 'לעורכי דין: בניית מיני-סייט', 'justice-theme' ); ?>
			</a>
		</div>

		<?php if ( $featured_lawyer instanceof WP_Post ) : ?>
			<div class="verified-lawyer-showcase">
				<div class="verified-lawyer-showcase__profile">
					<?php
					$GLOBALS['post'] = $featured_lawyer; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
					setup_postdata( $featured_lawyer );
					get_template_part( 'template-parts/cards/lawyer-card' );
					wp_reset_postdata();
					?>
				</div>

				<div class="verified-lawyer-showcase__value">
					<h3><?php esc_html_e( 'מה עורך דין מקבל בפרופיל פרימיום?', 'justice-theme' ); ?></h3>
					<ul>
						<li><?php esc_html_e( 'עמוד פרופיל עשיר עם תמונה, וידאו, תחומי התמחות, אזורי שירות ופרטי קשר שאושרו להצגה.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'מאמרים מקצועיים שמחוברים לפרופיל ולתחומי המשפט הרלוונטיים.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'פניות לקוחות, טלפון או WhatsApp רק כאשר פרטי הקשר עברו בדיקה ואינם נתוני דמו.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'ביקורות, דירוגים וסימוני אמון יוצגו רק לאחר אימות, אישור ומדיניות פרסום ברורה.', 'justice-theme' ); ?></li>
					</ul>
				</div>
			</div>
		<?php else : ?>
			<div class="verified-lawyer-showcase verified-lawyer-showcase--empty">
				<div class="verified-lawyer-showcase__visual">
					<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/lawyer-cta-visual.png' ); ?>"
						alt="<?php esc_attr_e( 'סביבת עבודה מקצועית של עורך דין — פרופיל פרימיום ב-Jus-Tice', 'justice-theme' ); ?>"
						width="520" height="340" loading="lazy" decoding="async">
				</div>
				<div class="verified-lawyer-showcase__text">
					<h3><?php esc_html_e( 'פרופיל עורכת הדין יוצג כאן לאחר אישור במערכת.', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'עמוד הבית לא מציג עורכי דין דמו, המלצות לא מאומתות או נתוני קשר שלא עברו בדיקה. רק פרופיל שאושר ידנית יכול להופיע באזור זה.', 'justice-theme' ); ?></p>
					<a class="button button--gold" href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>">
						<?php esc_html_e( 'הצטרפות עורכי דין', 'justice-theme' ); ?>
					</a>
				</div>
			</div>
		<?php endif; ?>
	</div>
</section>
