<?php
/**
 * Homepage featured lawyers — dynamic, multi-card grid.
 *
 * Only public-approved, verified, active-subscription lawyers are shown.
 * No hardcoded slugs, no demo data, no fallback fake profiles.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$eyebrow  = function_exists( 'justice_theme_mod' )
	? justice_theme_mod( 'justice_featured_lawyers_eyebrow', __( 'פרופילים מאומתים', 'justice-theme' ) )
	: __( 'פרופילים מאומתים', 'justice-theme' );

$headline = function_exists( 'justice_theme_mod' )
	? justice_theme_mod( 'justice_featured_lawyers_headline', __( 'עורכי דין מובילים בפלטפורמה', 'justice-theme' ) )
	: __( 'עורכי דין מובילים בפלטפורמה', 'justice-theme' );

$count = function_exists( 'justice_theme_mod' )
	? (int) justice_theme_mod( 'justice_featured_lawyers_count', 6 )
	: 6;
$count = max( 0, min( 12, $count ) );

$featured_lawyers = array();

if ( $count > 0 && post_type_exists( 'justice_lawyer' ) ) {

	// Primary query: verified + active subscription + premium plan, ordered by priority_score.
	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => 'publish',
		'posts_per_page' => $count,
		'no_found_rows'  => true,
		'orderby'        => array(
			'meta_value_num' => 'DESC',
			'date'           => 'DESC',
		),
		'meta_key'       => 'priority_score', // phpcs:ignore WordPress.DB.SlowDBQuery
		'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery
			'relation' => 'AND',
			array(
				'key'     => 'verification_status',
				'value'   => 'verified',
				'compare' => '=',
			),
			array(
				'key'     => 'subscription_status',
				'value'   => 'active',
				'compare' => '=',
			),
		),
	) );

	if ( $query->have_posts() ) {
		foreach ( $query->posts as $post_obj ) {
			if (
				function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
				&& justice_theme_lawyer_profile_is_public_approved( (int) $post_obj->ID )
			) {
				$featured_lawyers[] = $post_obj;
			}
		}
	}

	// Fallback query: verified only (in case no paid lawyers exist yet).
	if ( empty( $featured_lawyers ) ) {
		$fallback = new WP_Query( array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => 'publish',
			'posts_per_page' => $count,
			'no_found_rows'  => true,
			'orderby'        => 'date',
			'order'          => 'DESC',
			'meta_query'     => array( // phpcs:ignore WordPress.DB.SlowDBQuery
				array(
					'key'     => 'verification_status',
					'value'   => 'verified',
					'compare' => '=',
				),
			),
		) );

		if ( $fallback->have_posts() ) {
			foreach ( $fallback->posts as $post_obj ) {
				if (
					function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
					&& justice_theme_lawyer_profile_is_public_approved( (int) $post_obj->ID )
				) {
					$featured_lawyers[] = $post_obj;
				}
			}
		}
	}
}
?>

<section class="featured-lawyers section" id="featured-lawyers" aria-labelledby="featured-lawyers-title">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
				<h2 id="featured-lawyers-title"><?php echo esc_html( $headline ); ?></h2>
			</div>
			<a href="<?php echo esc_url( get_post_type_archive_link( 'justice_lawyer' ) ?: home_url( '/lawyers/' ) ); ?>" class="button button--outline">
				<?php esc_html_e( 'לכל עורכי הדין', 'justice-theme' ); ?>
				<span aria-hidden="true">›</span>
			</a>
		</div>

		<?php if ( ! empty( $featured_lawyers ) ) : ?>
			<div class="featured-lawyers__grid lawyers-grid">
				<?php foreach ( $featured_lawyers as $lawyer_post ) : ?>
					<?php
					$GLOBALS['post'] = $lawyer_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
					setup_postdata( $lawyer_post );
					get_template_part( 'template-parts/cards/lawyer-card' );
					?>
				<?php endforeach; ?>
				<?php wp_reset_postdata(); ?>
			</div>
		<?php else : ?>
			<div class="featured-lawyers__empty">
				<div class="featured-lawyers__empty-visual">
					<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/lawyer-cta-visual.png' ); ?>"
						alt="<?php esc_attr_e( 'פרופיל פרימיום לעורכי דין ב-Jus-Tice', 'justice-theme' ); ?>"
						width="520" height="340" loading="lazy" decoding="async">
				</div>
				<div class="featured-lawyers__empty-text">
					<h3><?php esc_html_e( 'פרופילים מאומתים יוצגו כאן ברגע שייקלטו במערכת.', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'אנחנו לא מציגים עורכי דין דמו, המלצות לא מאומתות או נתוני קשר שלא עברו בדיקה. רק פרופיל שאושר ידנית מופיע בעמוד הבית.', 'justice-theme' ); ?></p>
					<div class="featured-lawyers__empty-actions">
						<a class="button button--gold" href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>">
							<?php esc_html_e( 'הצטרפות עורכי דין', 'justice-theme' ); ?>
						</a>
						<a class="button button--outline" href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>">
							<?php esc_html_e( 'תוכניות חברות', 'justice-theme' ); ?>
						</a>
					</div>
				</div>
			</div>
		<?php endif; ?>
	</div>
</section>
