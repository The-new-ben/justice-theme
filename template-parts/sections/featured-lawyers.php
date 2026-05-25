<?php
/**
 * Homepage lawyer showcase.
 *
 * Pulls real CMS lawyer profiles, ranks sponsored/priority profiles first,
 * and falls back to a clean onboarding message when no public profiles exist.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'justice_theme_homepage_lawyer_showcase_score' ) ) {
	/**
	 * Score a lawyer for homepage placement.
	 *
	 * @param int $post_id Lawyer profile ID.
	 * @return int
	 */
	function justice_theme_homepage_lawyer_showcase_score( int $post_id ): int {
		$plan         = strtolower( (string) get_post_meta( $post_id, 'plan_type', true ) );
		$subscription = strtolower( (string) get_post_meta( $post_id, 'subscription_status', true ) );
		$verified     = strtolower( (string) get_post_meta( $post_id, 'verification_status', true ) );
		$priority     = (int) get_post_meta( $post_id, 'priority_score', true );
		$is_paid      = 'active' === $subscription && in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true );

		if ( $is_paid ) {
			$priority += 1000;
		}

		if ( 'verified' === $verified ) {
			$priority += 100;
		}

		return $priority;
	}
}

$showcase_lawyer_ids = array();

if ( post_type_exists( 'justice_lawyer' ) ) {
	$candidate_ids = get_posts(
		array(
			'post_type'        => 'justice_lawyer',
			'post_status'      => 'publish',
			'posts_per_page'   => (int) apply_filters( 'justice_theme_homepage_lawyer_showcase_scan_limit', 72 ),
			'fields'           => 'ids',
			'no_found_rows'    => true,
			'suppress_filters' => true,
			'orderby'          => 'modified',
			'order'            => 'DESC',
		)
	);

	foreach ( $candidate_ids as $candidate_id ) {
		$candidate_id = (int) $candidate_id;
		if (
			function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			&& ! justice_theme_lawyer_profile_is_public_approved( $candidate_id )
		) {
			continue;
		}

		$showcase_lawyer_ids[] = $candidate_id;
	}

	usort(
		$showcase_lawyer_ids,
		static function ( int $left, int $right ): int {
			$score_delta = justice_theme_homepage_lawyer_showcase_score( $right ) <=> justice_theme_homepage_lawyer_showcase_score( $left );
			if ( 0 !== $score_delta ) {
				return $score_delta;
			}

			return (int) get_post_modified_time( 'U', true, $right ) <=> (int) get_post_modified_time( 'U', true, $left );
		}
	);

	$showcase_lawyer_ids = array_slice( $showcase_lawyer_ids, 0, 6 );
}

$registration_url = add_query_arg(
	array(
		'source'        => 'homepage_lawyer_showcase',
		'plan_interest' => 'featured',
	),
	home_url( '/lawyer-registration/' )
);
?>

<section class="featured-lawyers section" id="featured-lawyers">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'עורכי דין במערכת', 'justice-theme' ); ?></p>
				<h2><?php esc_html_e( 'לקוחות משווים כרטיסים לפי תחום, אזור ואמון', 'justice-theme' ); ?></h2>
			</div>
			<div class="featured-lawyers__actions">
				<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" class="button button--ghost">
					<?php esc_html_e( 'צפייה באינדקס', 'justice-theme' ); ?>
				</a>
				<a href="<?php echo esc_url( $registration_url ); ?>" class="button button--gold">
					<?php esc_html_e( 'שדרוג לכרטיס מוביל', 'justice-theme' ); ?>
				</a>
			</div>
		</div>

		<?php if ( ! empty( $showcase_lawyer_ids ) ) : ?>
			<div class="featured-lawyers__showcase">
				<div class="featured-lawyers__grid" aria-label="<?php esc_attr_e( 'כרטיסי עורכי דין מתוך מערכת Jus-Tice', 'justice-theme' ); ?>">
					<?php
					foreach ( $showcase_lawyer_ids as $lawyer_id ) :
						$lawyer_post = get_post( $lawyer_id );
						if ( ! $lawyer_post instanceof WP_Post ) {
							continue;
						}

						$GLOBALS['post'] = $lawyer_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
						setup_postdata( $lawyer_post );
						get_template_part( 'template-parts/cards/lawyer-card' );
					endforeach;
					wp_reset_postdata();
					?>
				</div>

				<aside class="featured-lawyers__value" aria-label="<?php esc_attr_e( 'אפשרויות קידום לעורכי דין', 'justice-theme' ); ?>">
					<p class="featured-lawyers__value-eyebrow"><?php esc_html_e( 'מודל הכנסה ברור', 'justice-theme' ); ?></p>
					<h3><?php esc_html_e( 'כרטיס בסיסי מופיע באינדקס. כרטיס ממומן מקבל קדימות, אמון ולידים.', 'justice-theme' ); ?></h3>
					<ul>
						<li><?php esc_html_e( 'ניהול מלא מה-CMS: הצגה, הסתרה, כרטיס בסיסי או מיקום ממומן.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'כרטיסים ציבוריים לא מאומתים מסומנים בבירור, בלי תמונות או ביקורות שהועתקו.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'עורך דין יכול לתבוע כרטיס, להשלים פרטים, ולשדרג למסלול שמייצר פניות.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'הסדר בדף הבית נקבע לפי סטטוס מנוי, אימות וציון עדיפות.', 'justice-theme' ); ?></li>
					</ul>
					<a class="button button--primary" href="<?php echo esc_url( $registration_url ); ?>">
						<?php esc_html_e( 'הצטרפות למסלול ממומן', 'justice-theme' ); ?>
					</a>
				</aside>
			</div>
		<?php else : ?>
			<div class="verified-lawyer-showcase verified-lawyer-showcase--empty">
				<div class="verified-lawyer-showcase__visual">
					<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/lawyer-cta-visual.png' ); ?>"
						alt="<?php esc_attr_e( 'פרופיל עורך דין מקצועי ב-Jus-Tice', 'justice-theme' ); ?>"
						width="520" height="340" loading="lazy" decoding="async">
				</div>
				<div class="verified-lawyer-showcase__text">
					<h3><?php esc_html_e( 'בנו נוכחות משפטית שאפשר למדוד', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'פרופיל Jus-Tice מחבר בין תחומי מומחיות, אזור שירות, מאמרים מקצועיים ופניות לקוח במקום אחד.', 'justice-theme' ); ?></p>
					<a class="button button--gold" href="<?php echo esc_url( $registration_url ); ?>">
						<?php esc_html_e( 'פתיחת כרטיס עורך דין', 'justice-theme' ); ?>
					</a>
				</div>
			</div>
		<?php endif; ?>
	</div>
</section>
