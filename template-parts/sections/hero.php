<?php
/**
 * Homepage hero — search-first, CMS-driven, mobile-optimized.
 *
 * All editable content is sourced from the Customizer.
 * Practice areas + cities are sourced from their taxonomies.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$headline    = function_exists( 'justice_theme_mod' )
	? justice_theme_mod( 'justice_hero_headline', __( 'צריכים עורך דין או הכוונה משפטית? התחילו כאן', 'justice-theme' ) )
	: __( 'צריכים עורך דין או הכוונה משפטית? התחילו כאן', 'justice-theme' );

$description = function_exists( 'justice_theme_mod' )
	? justice_theme_mod( 'justice_hero_description', __( 'חיפוש עורכי דין לפי תחום ומיקום, מאמרים משפטיים, ומדריכים מקצועיים — הכל במקום אחד.', 'justice-theme' ) )
	: __( 'חיפוש עורכי דין לפי תחום ומיקום, מאמרים משפטיים, ומדריכים מקצועיים — הכל במקום אחד.', 'justice-theme' );

$placeholder = function_exists( 'justice_theme_mod' )
	? justice_theme_mod( 'justice_hero_search_placeholder', __( 'מה הבעיה המשפטית שלך?', 'justice-theme' ) )
	: __( 'מה הבעיה המשפטית שלך?', 'justice-theme' );

$trust_micro = function_exists( 'justice_theme_mod' )
	? justice_theme_mod( 'justice_hero_trust_microcopy', __( 'עורכי דין מאומתים בלבד · רישוי מלא בלשכת עורכי הדין', 'justice-theme' ) )
	: __( 'עורכי דין מאומתים בלבד · רישוי מלא בלשכת עורכי הדין', 'justice-theme' );

$hero_bg = function_exists( 'justice_theme_mod' )
	? justice_theme_mod( 'justice_hero_bg_image', JUSTICE_THEME_URI . '/assets/images/hero-bg.png' )
	: JUSTICE_THEME_URI . '/assets/images/hero-bg.png';

$hero_bg_mobile = function_exists( 'justice_theme_mod' )
	? justice_theme_mod( 'justice_hero_bg_image_mobile', '' )
	: '';
$hero_bg_mobile = $hero_bg_mobile ? $hero_bg_mobile : $hero_bg;

// Practice areas from taxonomy.
$practice_terms = get_terms( array(
	'taxonomy'   => 'practice-areas',
	'hide_empty' => false,
	'orderby'    => 'count',
	'order'      => 'DESC',
) );

// Cities from taxonomy (NOT hardcoded any more).
$city_terms = get_terms( array(
	'taxonomy'   => 'city',
	'hide_empty' => false,
	'orderby'    => 'name',
	'order'      => 'ASC',
) );

// Fallback major cities if the taxonomy is empty.
$fallback_cities = array(
	'תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה',
	'אשדוד', 'נתניה', 'באר שבע', 'חולון', 'רמת גן',
	'הרצליה', 'כפר סבא', 'מודיעין', 'אשקלון', 'רחובות',
);

$lawyers_archive = get_post_type_archive_link( 'justice_lawyer' );
$search_action   = $lawyers_archive ? $lawyers_archive : home_url( '/lawyers/' );

$total_articles = wp_count_posts( 'articles' );
$total_count    = isset( $total_articles->publish ) ? (int) $total_articles->publish : 0;
$total_count   += (int) wp_count_posts( 'post' )->publish;
$total_terms    = wp_count_terms( array( 'taxonomy' => 'practice-areas' ) );
$total_terms    = is_wp_error( $total_terms ) ? 0 : (int) $total_terms;
$total_lawyers  = (int) ( wp_count_posts( 'justice_lawyer' )->publish ?? 0 );
$total_cities   = is_wp_error( $city_terms ) ? count( $fallback_cities ) : ( ! empty( $city_terms ) ? count( $city_terms ) : count( $fallback_cities ) );
?>

<section class="hero hero--has-bg" id="hero"
	style="--hero-bg-image: url('<?php echo esc_url( $hero_bg ); ?>'); --hero-bg-image-mobile: url('<?php echo esc_url( $hero_bg_mobile ); ?>');">
	<div class="container hero__grid">
		<div class="hero__content">
			<h1 class="hero__title"><?php echo esc_html( $headline ); ?></h1>

			<p class="hero__description"><?php echo esc_html( $description ); ?></p>

			<form
				class="hero-search"
				role="search"
				method="get"
				action="<?php echo esc_url( $search_action ); ?>"
				id="hero-search-form"
				aria-label="<?php esc_attr_e( 'חיפוש עורך דין', 'justice-theme' ); ?>"
			>
				<div class="hero-search__filters">
					<div class="hero-search__field">
						<label class="screen-reader-text" for="hero-practice-area">
							<?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?>
						</label>
						<select id="hero-practice-area" name="area">
							<option value=""><?php esc_html_e( 'בחרו תחום משפטי', 'justice-theme' ); ?></option>
							<?php if ( ! empty( $practice_terms ) && ! is_wp_error( $practice_terms ) ) : ?>
								<?php foreach ( $practice_terms as $pterm ) : ?>
									<option value="<?php echo esc_attr( $pterm->slug ); ?>">
										<?php echo esc_html( $pterm->name ); ?>
									</option>
								<?php endforeach; ?>
							<?php endif; ?>
						</select>
					</div>

					<div class="hero-search__field">
						<label class="screen-reader-text" for="hero-city">
							<?php esc_html_e( 'עיר', 'justice-theme' ); ?>
						</label>
						<select id="hero-city" name="city">
							<option value=""><?php esc_html_e( 'בחרו עיר', 'justice-theme' ); ?></option>
							<?php if ( ! empty( $city_terms ) && ! is_wp_error( $city_terms ) ) : ?>
								<?php foreach ( $city_terms as $cterm ) : ?>
									<option value="<?php echo esc_attr( $cterm->slug ); ?>">
										<?php echo esc_html( $cterm->name ); ?>
									</option>
								<?php endforeach; ?>
							<?php else : ?>
								<?php foreach ( $fallback_cities as $fallback_city ) : ?>
									<option value="<?php echo esc_attr( sanitize_title( $fallback_city ) ); ?>">
										<?php echo esc_html( $fallback_city ); ?>
									</option>
								<?php endforeach; ?>
							<?php endif; ?>
						</select>
					</div>
				</div>

				<div class="hero-search__actions">
					<input
						id="hero-search-input"
						type="search"
						name="keyword"
						placeholder="<?php echo esc_attr( $placeholder ); ?>"
						aria-label="<?php esc_attr_e( 'מילת מפתח', 'justice-theme' ); ?>"
						value=""
					>
					<button type="submit" class="button button--primary hero-search__submit">
						<?php esc_html_e( 'חיפוש עורך דין', 'justice-theme' ); ?>
					</button>
				</div>
			</form>

			<?php if ( $trust_micro ) : ?>
				<p class="hero__trust-micro">
					<span aria-hidden="true">✓</span>
					<?php echo esc_html( $trust_micro ); ?>
				</p>
			<?php endif; ?>

			<div class="hero__stats" role="list" aria-label="<?php esc_attr_e( 'נתוני הפלטפורמה', 'justice-theme' ); ?>">
				<span class="hero__stat" role="listitem">
					<strong><?php echo esc_html( number_format_i18n( $total_count ) ); ?></strong>
					<?php esc_html_e( 'מאמרים משפטיים', 'justice-theme' ); ?>
				</span>
				<span class="hero__stat" role="listitem">
					<strong><?php echo esc_html( number_format_i18n( $total_terms ) ); ?></strong>
					<?php esc_html_e( 'תחומי משפט', 'justice-theme' ); ?>
				</span>
				<?php if ( $total_lawyers > 0 ) : ?>
					<span class="hero__stat" role="listitem">
						<strong><?php echo esc_html( number_format_i18n( $total_lawyers ) ); ?></strong>
						<?php esc_html_e( 'עורכי דין', 'justice-theme' ); ?>
					</span>
				<?php endif; ?>
				<span class="hero__stat" role="listitem">
					<strong><?php echo esc_html( number_format_i18n( $total_cities ) ); ?>+</strong>
					<?php esc_html_e( 'ערים', 'justice-theme' ); ?>
				</span>
			</div>
		</div>

		<?php
		$popular_terms = get_terms( array(
			'taxonomy'   => 'practice-areas',
			'hide_empty' => true,
			'number'     => 10,
			'orderby'    => 'count',
			'order'      => 'DESC',
		) );

		if ( ! empty( $popular_terms ) && ! is_wp_error( $popular_terms ) ) :
		?>
		<aside class="hero__panel" aria-label="<?php esc_attr_e( 'תחומי משפט נפוצים', 'justice-theme' ); ?>">
			<p class="hero__panel-label"><?php esc_html_e( 'תחומי חיפוש מרכזיים', 'justice-theme' ); ?></p>

			<ul class="hero__quick-links">
				<?php foreach ( $popular_terms as $pterm ) : ?>
					<li>
						<a href="<?php echo esc_url( get_term_link( $pterm ) ); ?>" rel="tag">
							<?php echo esc_html( $pterm->name ); ?>
							<span class="hero__quick-count"><?php echo esc_html( $pterm->count ); ?></span>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>

			<a href="<?php echo esc_url( $search_action ); ?>" class="hero__panel-cta">
				<?php esc_html_e( 'לכל התחומים', 'justice-theme' ); ?>
				<span aria-hidden="true" class="hero__panel-arrow">›</span>
			</a>
		</aside>
		<?php endif; ?>
	</div>
</section>
