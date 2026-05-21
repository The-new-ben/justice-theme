<?php
/**
 * Homepage hero section — search-first centered design.
 *
 * Redesigned based on competitive analysis:
 * - Centered layout with real background image
 * - Search form is the dominant element above the fold
 * - Practice area chips integrated as quick-links below search
 * - Stats bar at the bottom for social proof
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Get practice area terms for dropdown
$practice_terms = get_terms( array(
	'taxonomy'   => 'practice-areas',
	'hide_empty' => false,
	'orderby'    => 'count',
	'order'      => 'DESC',
) );

// Major Israeli cities for dropdown
$israel_cities = array(
	'תל אביב',
	'ירושלים',
	'חיפה',
	'ראשון לציון',
	'פתח תקווה',
	'אשדוד',
	'נתניה',
	'באר שבע',
	'חולון',
	'בני ברק',
	'רמת גן',
	'אשקלון',
	'רחובות',
	'בת ים',
	'הרצליה',
	'כפר סבא',
	'מודיעין',
	'נצרת',
	'לוד',
	'רמלה',
);

// Hero background image
$hero_bg = JUSTICE_THEME_URI . '/assets/images/hero-bg.png';
?>

<section class="hero hero--has-bg" id="hero" style="--hero-bg-image: url('<?php echo esc_url( $hero_bg ); ?>');">
	<div class="container hero__grid">
		<div class="hero__content">
			<h1 class="hero__title">
				<?php esc_html_e( 'עורכי דין בישראל — מאגר עורכי דין, מאמרים משפטיים ומדריכים מקצועיים', 'justice-theme' ); ?>
			</h1>

			<p class="hero__description">
				<?php esc_html_e( 'מחפשים עורך דין? התחילו מחיפוש לפי תחום משפטי, עיר או שם עורך דין. Jus-Tice מרכז מידע משפטי, מדריכים ופרופילים של עורכי דין כדי לעזור לכם להבין את האפשרויות ולפנות בצורה מסודרת. אין באתר הבטחה לתוצאה, דירוג מקצועי או ייעוץ משפטי אישי.', 'justice-theme' ); ?>
			</p>

			<form class="hero-search" role="search" method="get" action="<?php echo esc_url( get_post_type_archive_link( 'justice_lawyer' ) ?: home_url( '/lawyers/' ) ); ?>" id="hero-search-form">
				<div class="hero-search__filters">
					<div class="hero-search__field">
						<label class="screen-reader-text" for="hero-practice-area">
							<?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?>
						</label>
						<select id="hero-practice-area" name="area">
							<option value=""><?php esc_html_e( 'בחרו תחום משפטי', 'justice-theme' ); ?></option>
							<?php
							if ( ! empty( $practice_terms ) && ! is_wp_error( $practice_terms ) ) :
								foreach ( $practice_terms as $pterm ) :
							?>
								<option value="<?php echo esc_attr( $pterm->slug ); ?>">
									<?php echo esc_html( $pterm->name ); ?>
								</option>
							<?php
								endforeach;
							endif;
							?>
						</select>
					</div>

					<div class="hero-search__field">
						<label class="screen-reader-text" for="hero-city">
							<?php esc_html_e( 'עיר', 'justice-theme' ); ?>
						</label>
						<select id="hero-city" name="city">
							<option value=""><?php esc_html_e( 'בחרו עיר', 'justice-theme' ); ?></option>
							<?php foreach ( $israel_cities as $city ) : ?>
								<option value="<?php echo esc_attr( $city ); ?>">
									<?php echo esc_html( $city ); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</div>
				</div>

				<div class="hero-search__actions">
					<input
						id="hero-search-input"
						type="search"
						name="keyword"
						placeholder="<?php echo esc_attr__( 'חפשו עורך דין או תחום משפטי...', 'justice-theme' ); ?>"
						value=""
					>
					<button type="submit" class="button button--primary">
						<?php esc_html_e( 'חיפוש', 'justice-theme' ); ?>
					</button>
				</div>
			</form>

			<div class="hero__ctas" style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center;">
				<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" class="button button--primary">
					<?php esc_html_e( 'מצאו עורך דין', 'justice-theme' ); ?>
				</a>
				<a href="<?php echo esc_url( home_url( '/articles/' ) ); ?>" class="button button--outline" style="border-color: rgba(255,255,255,0.4); color: #fff;">
					<?php esc_html_e( 'עיינו במדריכים', 'justice-theme' ); ?>
				</a>
			</div>

			<div class="hero__stats">
				<?php
				$total_articles = wp_count_posts( 'articles' );
				$total_count = isset( $total_articles->publish ) ? (int) $total_articles->publish : 0;
				$post_counts = wp_count_posts( 'post' );
				$total_count += isset( $post_counts->publish ) ? (int) $post_counts->publish : 0;
				$total_terms = wp_count_terms( array( 'taxonomy' => 'practice-areas' ) );
				?>
				<span class="hero__stat">
					<strong><?php echo esc_html( number_format_i18n( $total_count ) ); ?></strong>
					<?php esc_html_e( 'מאמרים משפטיים', 'justice-theme' ); ?>
				</span>
				<span class="hero__stat">
					<strong><?php echo esc_html( is_numeric( $total_terms ) ? $total_terms : 0 ); ?></strong>
					<?php esc_html_e( 'תחומי משפט', 'justice-theme' ); ?>
				</span>
				<span class="hero__stat">
					<strong><?php echo esc_html( count( $israel_cities ) ); ?></strong>
					<?php esc_html_e( 'ערים', 'justice-theme' ); ?>
				</span>
			</div>
		</div>

		<?php
		// Quick-links bar — popular practice areas as chip buttons
		$popular_terms = get_terms( array(
			'taxonomy'   => 'practice-areas',
			'hide_empty' => true,
			'number'     => 10,
			'orderby'    => 'count',
			'order'      => 'DESC',
		) );

		if ( ! empty( $popular_terms ) && ! is_wp_error( $popular_terms ) ) :
		?>
		<div class="hero__panel" aria-label="<?php esc_attr_e( 'תחומי משפט נפוצים', 'justice-theme' ); ?>">
			<h2><?php esc_html_e( 'תחומי חיפוש מרכזיים', 'justice-theme' ); ?></h2>

			<ul class="hero__quick-links">
				<?php 
					foreach ( $popular_terms as $pterm ) : 
						$pterm_url = justice_theme_public_term_link( $pterm );
				?>
					<li>
						<a href="<?php echo esc_url( $pterm_url ); ?>">
							<?php echo esc_html( $pterm->name ); ?>
							<span><?php echo esc_html( $pterm->count ); ?></span>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>

			<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" class="hero__panel-cta">
				<?php esc_html_e( 'כל התחומים ←', 'justice-theme' ); ?>
			</a>
		</div>
		<?php endif; ?>
	</div>
</section>
