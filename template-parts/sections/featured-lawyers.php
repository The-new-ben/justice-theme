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
		return function_exists( 'justice_theme_lawyer_profile_sort_score' )
			? justice_theme_lawyer_profile_sort_score( $post_id )
			: (int) get_post_meta( $post_id, 'priority_score', true );
	}
}

if ( ! function_exists( 'justice_theme_homepage_lawyer_fact_status_is_approved' ) ) {
	/**
	 * Check if profile facts are approved for homepage promotion.
	 *
	 * @param int $post_id Lawyer profile ID.
	 * @return bool
	 */
	function justice_theme_homepage_lawyer_fact_status_is_approved( int $post_id ): bool {
		$status = sanitize_key( (string) get_post_meta( $post_id, 'profile_fact_review_status', true ) );

		if ( function_exists( 'justice_lawyer_fact_review_status_is_approved' ) ) {
			return justice_lawyer_fact_review_status_is_approved( $status );
		}

		return in_array( $status, array( 'approved', 'source_checked', 'owner_approved', 'lawyer_approved' ), true );
	}
}

if ( ! function_exists( 'justice_theme_homepage_lawyer_requires_fact_gate' ) ) {
	/**
	 * Detect profiles that must not be homepage-promoted before fact review.
	 *
	 * @param int $post_id Lawyer profile ID.
	 * @return bool
	 */
	function justice_theme_homepage_lawyer_requires_fact_gate( int $post_id ): bool {
		$source_type    = strtolower( (string) get_post_meta( $post_id, 'source_type', true ) );
		$internal_notes = strtolower( (string) get_post_meta( $post_id, 'internal_notes', true ) );
		$is_seed_like   = 'seed' === $source_type
			|| false !== strpos( $internal_notes, 'seed' )
			|| false !== strpos( $internal_notes, 'demo' )
			|| false !== strpos( $internal_notes, 'test data' )
			|| false !== strpos( $internal_notes, 'fake' )
			|| false !== strpos( $internal_notes, 'fictional' );

		return $is_seed_like;
	}
}

if ( ! function_exists( 'justice_theme_homepage_lawyer_is_showcase_safe' ) ) {
	/**
	 * Keep the homepage from elevating unverified imported/basic profiles.
	 *
	 * @param int $post_id Lawyer profile ID.
	 * @return bool
	 */
	function justice_theme_homepage_lawyer_is_showcase_safe( int $post_id ): bool {
		if ( justice_theme_homepage_lawyer_requires_fact_gate( $post_id ) ) {
			return justice_theme_homepage_lawyer_fact_status_is_approved( $post_id );
		}

		return true;
	}
}

$showcase_lawyer_ids = array();
$showcase_hold_count = 0;

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

		if ( ! justice_theme_homepage_lawyer_is_showcase_safe( $candidate_id ) ) {
			++$showcase_hold_count;
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
				<p class="section-header__eyebrow"><?php esc_html_e( 'עורכי דין ואנשי משפט', 'justice-theme' ); ?></p>
				<h2><?php esc_html_e( 'לקוחות משווים אנשי מקצוע לפי תחום, אזור ואמון', 'justice-theme' ); ?></h2>
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
				<div class="featured-lawyers__grid" aria-label="<?php esc_attr_e( 'כרטיסי עורכי דין ואנשי משפט ב-Jus-Tice', 'justice-theme' ); ?>">
					<?php
					foreach ( $showcase_lawyer_ids as $lawyer_id ) :
						$lawyer_post = get_post( $lawyer_id );
						if ( ! $lawyer_post instanceof WP_Post ) {
							continue;
						}

						$GLOBALS['post'] = $lawyer_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
						$GLOBALS['justice_lawyer_card_context'] = 'homepage_showcase'; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
						setup_postdata( $lawyer_post );
						get_template_part( 'template-parts/cards/lawyer-card' );
					endforeach;
					unset( $GLOBALS['justice_lawyer_card_context'] );
					wp_reset_postdata();
					?>
				</div>

				<aside class="featured-lawyers__value" aria-label="<?php esc_attr_e( 'אפשרויות קידום לעורכי דין ואנשי משפט', 'justice-theme' ); ?>">
					<p class="featured-lawyers__value-eyebrow"><?php esc_html_e( 'פרופילים שניתן להשוות', 'justice-theme' ); ?></p>
					<h3><?php esc_html_e( 'כרטיס בסיסי מציג פרטים זהירים. פרופיל מורחב יכול להוסיף אמון, תוכן וחשיפה.', 'justice-theme' ); ?></h3>
					<ul>
						<li><?php esc_html_e( 'פרטים בסיסיים מוצגים בזהירות, בלי עובדות לימודים, ניסיון או תמונה שלא נבדקו.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'ביקורות, מדיה ותוכן מקצועי נכנסים רק אחרי מקור ברור ואישור מתאים.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'בעל מקצוע יכול לבקש עדכון, הסרה, אימות או הרחבת פרופיל.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'חשיפה מוגברת מסומנת בצורה נקייה, בלי לפגוע בחוויית החיפוש של הלקוח.', 'justice-theme' ); ?></li>
					</ul>
					<?php if ( $showcase_hold_count > 0 ) : ?>
						<p class="featured-lawyers__quality-note">
							<?php
							printf(
								/* translators: %d: number of held profiles. */
								esc_html__( '%d כרטיסים לא עולים לדף הבית עד בדיקת מקורות, תמונה ואישור פרטי הפרופיל.', 'justice-theme' ),
								(int) $showcase_hold_count
							);
							?>
						</p>
					<?php endif; ?>
					<a class="button button--primary" href="<?php echo esc_url( $registration_url ); ?>">
						<?php esc_html_e( 'בקשת הרחבת חשיפה', 'justice-theme' ); ?>
					</a>
				</aside>
			</div>
		<?php else : ?>
			<div class="verified-lawyer-showcase verified-lawyer-showcase--empty">
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
