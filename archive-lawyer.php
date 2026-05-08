<?php
/**
 * Lawyer archive — directory listing page.
 *
 * URL: /lawyers/ (or /lawyers/?city=tel-aviv&area=family-law)
 * SEO target: "עורכי דין", "עורכי דין בתל אביב", etc.
 *
 * @package JusticeTheme
 */

get_header();

// Get filter params
$filter_city = isset( $_GET['city'] ) ? sanitize_text_field( $_GET['city'] ) : '';
$filter_area = isset( $_GET['area'] ) ? sanitize_text_field( $_GET['area'] ) : '';

// Build query
$args = array(
	'post_type'      => 'lawyer',
	'posts_per_page' => 24,
	'paged'          => get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1,
	'orderby'        => 'meta_value',
	'meta_key'       => '_justice_featured',
	'order'          => 'DESC',
);

// City filter
if ( $filter_city ) {
	$args['tax_query'][] = array(
		'taxonomy' => 'city',
		'field'    => 'slug',
		'terms'    => $filter_city,
	);
}

// Practice area filter
if ( $filter_area ) {
	$args['tax_query'][] = array(
		'taxonomy' => 'practice-areas',
		'field'    => 'slug',
		'terms'    => $filter_area,
	);
}

if ( count( $args['tax_query'] ?? array() ) > 1 ) {
	$args['tax_query']['relation'] = 'AND';
}

$lawyers = new WP_Query( $args );

// Dynamic H1 based on filters
$page_title = __( 'מדריך עורכי דין בישראל', 'justice-theme' );
if ( $filter_city ) {
	$city_term = get_term_by( 'slug', $filter_city, 'city' );
	if ( $city_term ) {
		$page_title = sprintf( __( 'עורכי דין ב%s', 'justice-theme' ), $city_term->name );
	}
}
if ( $filter_area ) {
	$area_term = get_term_by( 'slug', $filter_area, 'practice-areas' );
	if ( $area_term ) {
		if ( $filter_city && $city_term ) {
			$page_title = sprintf( __( 'עורך דין %s ב%s', 'justice-theme' ), $area_term->name, $city_term->name );
		} else {
			$page_title = sprintf( __( 'עורך דין %s', 'justice-theme' ), $area_term->name );
		}
	}
}

// Get all cities and practice areas for filters
$all_cities = get_terms( array( 'taxonomy' => 'city', 'hide_empty' => false, 'orderby' => 'name' ) );
$all_areas  = get_terms( array( 'taxonomy' => 'practice-areas', 'hide_empty' => true, 'orderby' => 'count', 'order' => 'DESC', 'number' => 20 ) );
?>

<main id="primary" class="site-main">

	<section class="lawyer-directory section" aria-labelledby="directory-heading">
		<div class="container">

			<header class="section-header">
				<h1 id="directory-heading"><?php echo esc_html( $page_title ); ?></h1>
				<p><?php esc_html_e( 'חיפוש עורכי דין מומחים לפי תחום משפטי ומיקום. כל עורכי הדין המופיעים הם בעלי רישיון פעיל של לשכת עורכי הדין בישראל.', 'justice-theme' ); ?></p>
			</header>

			<!-- Filter bar -->
			<form class="directory-filters" method="get" action="<?php echo esc_url( get_post_type_archive_link( 'lawyer' ) ); ?>">
				<div class="directory-filters__fields">
					<div class="directory-filters__field">
						<label for="filter-area"><?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?></label>
						<select id="filter-area" name="area">
							<option value=""><?php esc_html_e( 'כל התחומים', 'justice-theme' ); ?></option>
							<?php if ( ! empty( $all_areas ) && ! is_wp_error( $all_areas ) ) : ?>
								<?php foreach ( $all_areas as $at ) : ?>
									<option value="<?php echo esc_attr( $at->slug ); ?>" <?php selected( $filter_area, $at->slug ); ?>>
										<?php echo esc_html( $at->name ); ?>
									</option>
								<?php endforeach; ?>
							<?php endif; ?>
						</select>
					</div>

					<div class="directory-filters__field">
						<label for="filter-city"><?php esc_html_e( 'עיר', 'justice-theme' ); ?></label>
						<select id="filter-city" name="city">
							<option value=""><?php esc_html_e( 'כל הערים', 'justice-theme' ); ?></option>
							<?php if ( ! empty( $all_cities ) && ! is_wp_error( $all_cities ) ) : ?>
								<?php foreach ( $all_cities as $ct ) : ?>
									<option value="<?php echo esc_attr( $ct->slug ); ?>" <?php selected( $filter_city, $ct->slug ); ?>>
										<?php echo esc_html( $ct->name ); ?>
									</option>
								<?php endforeach; ?>
							<?php endif; ?>
						</select>
					</div>

					<div class="directory-filters__action">
						<button type="submit" class="button button--gold"><?php esc_html_e( 'חיפוש', 'justice-theme' ); ?></button>
					</div>
				</div>
			</form>

			<?php if ( $lawyers->have_posts() ) : ?>
				<div class="lawyers-grid">
					<?php while ( $lawyers->have_posts() ) : $lawyers->the_post(); ?>
						<?php get_template_part( 'template-parts/cards/lawyer-card' ); ?>
					<?php endwhile; ?>
				</div>

				<?php
				// Pagination
				$big = 999999999;
				echo '<nav class="directory-pagination">';
				echo paginate_links( array(
					'base'      => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
					'format'    => '?paged=%#%',
					'current'   => max( 1, get_query_var( 'paged' ) ),
					'total'     => $lawyers->max_num_pages,
					'prev_text' => '→ ' . __( 'הקודם', 'justice-theme' ),
					'next_text' => __( 'הבא', 'justice-theme' ) . ' ←',
				) );
				echo '</nav>';
				?>

			<?php else : ?>
				<div class="directory-empty">
					<div class="directory-empty__icon">⚖️</div>
					<h2><?php esc_html_e( 'מדריך עורכי הדין בבנייה', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'אנו בונים את מדריך עורכי הדין המקיף ביותר בישראל. בקרוב כאן יופיעו פרופילים של עורכי דין מומחים לפי תחום ומיקום.', 'justice-theme' ); ?></p>
					<div class="directory-empty__cta">
						<a href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>" class="button button--gold"><?php esc_html_e( 'עורכי דין — הרשמו למדריך', 'justice-theme' ); ?></a>
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="button button--outline"><?php esc_html_e( 'חזרה לעמוד הראשי', 'justice-theme' ); ?></a>
					</div>
				</div>
			<?php endif; ?>

			<?php wp_reset_postdata(); ?>

		</div>
	</section>

</main>

<?php get_footer(); ?>
