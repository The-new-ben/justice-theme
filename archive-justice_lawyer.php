<?php
/**
 * Lawyer archive — directory listing page.
 *
 * Template: archive-justice_lawyer.php
 * URL: /lawyers/ (rewrite slug)
 * Filters: /lawyers/?city=tel-aviv&area=family-law
 * SEO target: "עורכי דין", "עורכי דין בתל אביב"
 *
 * @package JusticeTheme
 */

get_header();

// Get filter params
$filter_city    = isset( $_GET['city'] )    ? sanitize_text_field( wp_unslash( $_GET['city'] ) )    : '';
$filter_area    = isset( $_GET['area'] )    ? sanitize_text_field( wp_unslash( $_GET['area'] ) )    : '';
$filter_keyword = isset( $_GET['keyword'] ) ? sanitize_text_field( wp_unslash( $_GET['keyword'] ) ) : '';

$legacy_area_map = array(
	'family'      => 'family-law',
	'criminal'    => 'criminal-law',
	'real-estate' => 'real-estate-law',
	'labor'       => 'labor-law',
	'traffic'     => 'traffic-law',
);

if ( isset( $legacy_area_map[ $filter_area ] ) ) {
	$filter_area = $legacy_area_map[ $filter_area ];
}

// Build query
$args = array(
	'post_type'      => 'justice_lawyer',
	'posts_per_page' => 24,
	'paged'          => get_query_var( 'paged' ) ? get_query_var( 'paged' ) : 1,
	'meta_query'     => array(
		'relation' => 'OR',
		array(
			'key'     => 'priority_score',
			'compare' => 'EXISTS',
		),
		array(
			'key'     => 'priority_score',
			'compare' => 'NOT EXISTS',
		),
	),
	'orderby'        => 'meta_value_num',
	'meta_key'       => 'priority_score',
	'order'          => 'DESC',
);

// Keyword search across lawyer name and firm
if ( $filter_keyword ) {
	$args['s'] = $filter_keyword;
}

// City filter
$tax_query = array();
if ( $filter_city ) {
	$tax_query[] = array(
		'taxonomy' => 'city',
		'field'    => 'slug',
		'terms'    => $filter_city,
	);
}

// Practice area filter
if ( $filter_area ) {
	$tax_query[] = array(
		'taxonomy' => 'practice-areas',
		'field'    => 'slug',
		'terms'    => $filter_area,
	);
}

if ( count( $tax_query ) > 1 ) {
	$tax_query['relation'] = 'AND';
}
if ( ! empty( $tax_query ) ) {
	$args['tax_query'] = $tax_query;
}

$lawyers = new WP_Query( $args );
$public_lawyer_posts = array();

if ( $lawyers->have_posts() ) {
	foreach ( $lawyers->posts as $lawyer_post ) {
		if (
			$lawyer_post instanceof WP_Post
			&& function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
			&& justice_theme_lawyer_profile_is_public_approved( (int) $lawyer_post->ID )
		) {
			$public_lawyer_posts[] = $lawyer_post;
		}
	}
}

// Dynamic H1 based on filters
$page_title = 'מדריך עורכי דין בישראל';
$page_desc  = 'השוו בין פרופילים, תחומי התמחות, אזורי שירות ודרכי פנייה. הנתונים מוצגים בזהירות, בלי הבטחות דירוג או המלצות שאינן מאומתות.';

if ( $filter_city ) {
	$city_term = get_term_by( 'slug', $filter_city, 'city' );
}
if ( $filter_area ) {
	$area_term = get_term_by( 'slug', $filter_area, 'practice-areas' );
}

if ( ! empty( $city_term ) && ! empty( $area_term ) ) {
	$page_title = sprintf( 'עורך דין %s ב%s', $area_term->name, $city_term->name );
	$page_desc  = sprintf( 'מצאו עורך דין %s ב%s — פרופילים מקצועיים, תחומי עיסוק, פרטי קשר ופנייה מסודרת.', $area_term->name, $city_term->name );
} elseif ( ! empty( $city_term ) ) {
	$page_title = sprintf( 'עורכי דין ב%s', $city_term->name );
	$page_desc  = sprintf( 'כל עורכי הדין ב%s — חיפוש לפי תחום התמחות, פנייה ישירה ופרופילים מקצועיים.', $city_term->name );
} elseif ( ! empty( $area_term ) ) {
	$page_title = sprintf( 'עורך דין %s', $area_term->name );
	$page_desc  = sprintf( 'מצאו עורך דין %s — התחילו מהתחום, קראו את פרטי הפרופיל והשאירו פנייה רק אחרי שהנתונים מתאימים לצורך שלכם.', $area_term->name );
}

// Get all cities and practice areas for filters
$all_cities = get_terms( array( 'taxonomy' => 'city', 'hide_empty' => false, 'orderby' => 'name' ) );
$all_areas  = get_terms( array( 'taxonomy' => 'practice-areas', 'hide_empty' => true, 'orderby' => 'count', 'order' => 'DESC', 'number' => 30 ) );
?>

<section class="lawyer-directory section" aria-labelledby="directory-heading">
		<div class="container">

			<header class="section-header">
				<h1 id="directory-heading"><?php echo esc_html( $page_title ); ?></h1>
				<p><?php echo esc_html( $page_desc ); ?></p>
			</header>

			<!-- Filter bar -->
			<form class="directory-filters" method="get" action="<?php echo esc_url( get_post_type_archive_link( 'justice_lawyer' ) ); ?>">
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

					<div class="directory-filters__field">
						<label for="filter-keyword"><?php esc_html_e( 'שם עורך דין', 'justice-theme' ); ?></label>
						<input type="text" id="filter-keyword" name="keyword" value="<?php echo esc_attr( $filter_keyword ); ?>" placeholder="<?php esc_attr_e( 'חיפוש לפי שם...', 'justice-theme' ); ?>">
					</div>

					<div class="directory-filters__action">
						<button type="submit" class="button button--gold"><?php esc_html_e( 'חיפוש', 'justice-theme' ); ?></button>
					</div>
				</div>
			</form>

			<?php if ( ! empty( $public_lawyer_posts ) ) : ?>
				<div class="lawyers-grid">
					<?php foreach ( $public_lawyer_posts as $lawyer_post ) : ?>
						<?php setup_postdata( $lawyer_post ); ?>
						<?php get_template_part( 'template-parts/cards/lawyer-card' ); ?>
					<?php endforeach; ?>
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
					'prev_text' => 'הקודם',
					'next_text' => 'הבא',
				) );
				echo '</nav>';
				?>

			<?php else : ?>
				<div class="directory-empty">
					<div class="directory-empty__icon" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" width="40" height="40"><circle cx="24" cy="16" r="8"/><path d="M8 42c0-8.8 7.2-16 16-16s16 7.2 16 16"/></svg></div>
					<h2>מדריך עורכי הדין בבנייה</h2>
					<p>אנו בונים את מדריך עורכי הדין המקיף ביותר בישראל. בקרוב כאן יופיעו פרופילים של עורכי דין מומחים לפי תחום ומיקום.</p>
					<div class="directory-empty__cta">
						<a href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>" class="button button--gold">עורכי דין — הרשמו למדריך</a>
						<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="button button--outline">חזרה לעמוד הראשי</a>
					</div>
				</div>
			<?php endif; ?>

			<?php wp_reset_postdata(); ?>

		</div>
	</section>

<?php get_footer(); ?>
