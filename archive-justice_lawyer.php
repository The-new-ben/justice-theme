<?php
/**
 * Lawyer archive - directory listing page.
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
	'family'              => 'family-law',
	'criminal'            => 'criminal-law',
	'real-estate'         => 'real-estate-law',
	'labor'               => 'labor-law',
	'employment'          => 'labor-law',
	'employment-law'      => 'labor-law',
	'traffic'             => 'traffic-law',
	'tort'                => 'personal-injury-law',
	'torts'               => 'personal-injury-law',
	'personal-injury'     => 'personal-injury-law',
	'medical'             => 'medical-malpractice-law',
	'medical-malpractice' => 'medical-malpractice-law',
	'medical_malpractice' => 'medical-malpractice-law',
	'inheritance'         => 'inheritance-law',
	'cyber'               => 'privacy-cyber-law',
	'privacy'             => 'privacy-cyber-law',
	'cyber-law'           => 'privacy-cyber-law',
	'cyber-privacy'       => 'privacy-cyber-law',
	'privacy-cyber'       => 'privacy-cyber-law',
	'tax'                 => 'tax-law',
);

if ( isset( $legacy_area_map[ $filter_area ] ) ) {
	$filter_area = $legacy_area_map[ $filter_area ];
}

$area_taxonomy_slug_map = array(
	'personal-injury-law'     => 'torts',
	'medical-malpractice-law' => 'medical-malpractice',
	'privacy-cyber-law'       => 'cyber-law',
);

$filter_area_tax_slug = $area_taxonomy_slug_map[ $filter_area ] ?? $filter_area;

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
		'terms'    => $filter_area_tax_slug,
	);
}

if ( count( $tax_query ) > 1 ) {
	$tax_query['relation'] = 'AND';
}
if ( ! empty( $tax_query ) ) {
	$args['tax_query'] = $tax_query;
}

$approved_lawyer_ids = array();
$candidate_args      = $args;

$candidate_args['fields']         = 'ids';
$candidate_args['posts_per_page'] = (int) apply_filters( 'justice_theme_lawyer_directory_approval_scan_limit', -1 );
$candidate_args['paged']          = 1;
$candidate_args['no_found_rows']  = true;

unset( $candidate_args['meta_query'], $candidate_args['meta_key'], $candidate_args['orderby'], $candidate_args['order'] );

if ( function_exists( 'justice_theme_lawyer_profile_is_public_approved' ) ) {
	foreach ( get_posts( $candidate_args ) as $candidate_id ) {
		if ( justice_theme_lawyer_profile_is_public_approved( (int) $candidate_id ) ) {
			$approved_lawyer_ids[] = (int) $candidate_id;
		}
	}
}

usort(
	$approved_lawyer_ids,
	static function ( int $left, int $right ): int {
		$left_score  = function_exists( 'justice_theme_lawyer_profile_sort_score' ) ? justice_theme_lawyer_profile_sort_score( $left ) : (int) get_post_meta( $left, 'priority_score', true );
		$right_score = function_exists( 'justice_theme_lawyer_profile_sort_score' ) ? justice_theme_lawyer_profile_sort_score( $right ) : (int) get_post_meta( $right, 'priority_score', true );

		$score_delta = $right_score <=> $left_score;
		if ( 0 !== $score_delta ) {
			return $score_delta;
		}

		return (int) get_post_modified_time( 'U', true, $right ) <=> (int) get_post_modified_time( 'U', true, $left );
	}
);

unset( $args['meta_query'], $args['meta_key'] );
$args['post__in'] = ! empty( $approved_lawyer_ids ) ? $approved_lawyer_ids : array( 0 );
$args['orderby']  = 'post__in';

$lawyers = new WP_Query( $args );
$public_lawyer_posts = $lawyers->posts;

$canonical_area_options = array(
	'family-law'              => 'משפחה וגירושין',
	'criminal-law'            => 'משפט פלילי',
	'traffic-law'             => 'דיני תעבורה',
	'real-estate-law'         => 'מקרקעין ונדל"ן',
	'personal-injury-law'     => 'נזיקין ותאונות',
	'labor-law'               => 'דיני עבודה',
	'inheritance-law'         => 'ירושה וצוואות',
	'medical-malpractice-law' => 'רשלנות רפואית',
	'tax-law'                 => 'מיסים',
	'privacy-cyber-law'       => 'סייבר ופרטיות',
);

$canonical_city_options = array(
	'tel-aviv'      => 'תל אביב',
	'jerusalem'     => 'ירושלים',
	'haifa'         => 'חיפה',
	'ramat-gan'     => 'רמת גן',
	'petah-tikva'   => 'פתח תקווה',
	'rishon-lezion' => 'ראשון לציון',
	'netanya'       => 'נתניה',
	'beer-sheva'    => 'באר שבע',
	'herzliya'      => 'הרצליה',
	'holon'         => 'חולון',
	'ashdod'        => 'אשדוד',
	'kfar-saba'     => 'כפר סבא',
);

$city_term = null;
$area_term = null;

// Dynamic H1 based on filters
$page_title = 'מדריך עורכי דין בישראל';
$page_desc  = 'השוו בין פרופילים, תחומי התמחות, אזורי שירות ודרכי פנייה. הנתונים מוצגים בזהירות, בלי הבטחות דירוג או המלצות שאינן מאומתות.';

if ( $filter_city ) {
	$city_term = get_term_by( 'slug', $filter_city, 'city' );
	if ( ! $city_term && isset( $canonical_city_options[ $filter_city ] ) ) {
		$city_term = (object) array(
			'name' => $canonical_city_options[ $filter_city ],
			'slug' => $filter_city,
		);
	}
}
if ( $filter_area ) {
	$area_term = get_term_by( 'slug', $filter_area_tax_slug, 'practice-areas' );
	if ( ! $area_term && isset( $canonical_area_options[ $filter_area ] ) ) {
		$area_term = (object) array(
			'name' => $canonical_area_options[ $filter_area ],
			'slug' => $filter_area,
		);
	}
}

if ( ! empty( $city_term ) && ! empty( $area_term ) ) {
	$page_title = sprintf( 'עורך דין %s ב%s', $area_term->name, $city_term->name );
	$page_desc  = sprintf( 'מצאו עורך דין %s ב%s: פרופילים מקצועיים, תחומי עיסוק, פרטי קשר ופנייה מסודרת.', $area_term->name, $city_term->name );
} elseif ( ! empty( $city_term ) ) {
	$page_title = sprintf( 'עורכי דין ב%s', $city_term->name );
	$page_desc  = sprintf( 'כל עורכי הדין ב%s: חיפוש לפי תחום התמחות, פנייה ישירה ופרופילים מקצועיים.', $city_term->name );
} elseif ( ! empty( $area_term ) ) {
	$page_title = sprintf( 'עורך דין %s', $area_term->name );
	$page_desc  = sprintf( 'מצאו עורך דין %s: התחילו מהתחום, קראו את פרטי הפרופיל והשאירו פנייה רק אחרי שהנתונים מתאימים לצורך שלכם.', $area_term->name );
}

// Get all cities and practice areas for filters
$all_cities = get_terms( array( 'taxonomy' => 'city', 'hide_empty' => false, 'orderby' => 'name' ) );
$all_areas  = get_terms( array( 'taxonomy' => 'practice-areas', 'hide_empty' => true, 'orderby' => 'count', 'order' => 'DESC', 'number' => 30 ) );

$public_area_option_map = array(
	'torts'               => array( 'slug' => 'personal-injury-law', 'name' => 'נזיקין ותאונות' ),
	'medical-malpractice' => array( 'slug' => 'medical-malpractice-law', 'name' => 'רשלנות רפואית' ),
	'labor-law'           => array( 'slug' => 'labor-law', 'name' => 'דיני עבודה' ),
);

$normalize_area_filter_options = static function ( $terms, array $aliases ): array {
	$options = ( ! empty( $terms ) && ! is_wp_error( $terms ) ) ? array_values( $terms ) : array();

	foreach ( $options as $index => $term_option ) {
		if ( ! isset( $term_option->slug, $aliases[ $term_option->slug ] ) ) {
			continue;
		}

		$options[ $index ] = (object) array(
			'slug' => $aliases[ $term_option->slug ]['slug'],
			'name' => $aliases[ $term_option->slug ]['name'],
		);
	}

	return $options;
};

$merge_filter_options = static function ( $terms, array $fallbacks ): array {
	$options        = ( ! empty( $terms ) && ! is_wp_error( $terms ) ) ? array_values( $terms ) : array();
	$existing_slugs = array();

	foreach ( $options as $term_option ) {
		if ( isset( $term_option->slug ) ) {
			$existing_slugs[] = (string) $term_option->slug;
		}
	}

	foreach ( $fallbacks as $fallback_slug => $fallback_name ) {
		if ( in_array( $fallback_slug, $existing_slugs, true ) ) {
			continue;
		}

		$options[] = (object) array(
			'slug' => $fallback_slug,
			'name' => $fallback_name,
		);
	}

	return $options;
};

$all_areas = $normalize_area_filter_options( $all_areas, $public_area_option_map );
$all_areas  = $merge_filter_options( $all_areas, $canonical_area_options );
$all_cities = $merge_filter_options( $all_cities, $canonical_city_options );

$active_filters = array();
if ( ! empty( $area_term->name ) ) {
	$active_filters[] = $area_term->name;
}
if ( ! empty( $city_term->name ) ) {
	$active_filters[] = $city_term->name;
}
if ( $filter_keyword ) {
	$active_filters[] = sprintf( 'חיפוש: %s', $filter_keyword );
}

$approved_count = (int) $lawyers->found_posts;
?>

<section class="lawyer-directory section" aria-labelledby="directory-heading">
		<div class="container">

			<header class="section-header">
				<h1 id="directory-heading"><?php echo esc_html( $page_title ); ?></h1>
				<p><?php echo esc_html( $page_desc ); ?></p>
			</header>

			<div class="directory-guidance" aria-label="איך להשתמש במדריך עורכי הדין">
				<div class="directory-guidance__item">
					<strong>התחילו מהבעיה המשפטית</strong>
					<span>בחרו תחום משפטי מדויק ככל האפשר כדי להגיע לפרופילים רלוונטיים יותר.</span>
				</div>
				<div class="directory-guidance__item">
					<strong>בדקו התאמה לפני פנייה</strong>
					<span>קראו תחומי עיסוק, אזורי שירות ושפות. אין כאן דירוג אוטומטי או הבטחה לתוצאה.</span>
				</div>
				<div class="directory-guidance__item">
					<strong>השאירו פנייה מסודרת</strong>
					<span>פנייה עם עיר, דחיפות ותיאור קצר עוזרת להבין למי כדאי להעביר את הבקשה.</span>
				</div>
			</div>

			<section class="directory-comparison-playbook" aria-label="<?php esc_attr_e( 'בדיקת התאמה לפני בחירת עורך דין', 'justice-theme' ); ?>">
				<div class="directory-comparison-playbook__header">
					<span><?php esc_html_e( 'בהשראת דפוסי חיפוש באינדקסים משפטיים מובילים', 'justice-theme' ); ?></span>
					<h2><?php esc_html_e( 'מה כדאי לבדוק לפני שבוחרים פרופיל?', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'העמוד הזה לא מסתפק ברשימת שמות. הוא מכוון את הגולש לבדוק תחום, אזור, סימני אימות ויכולת פנייה, כדי שהאינדקס ירגיש רציני כמו אתרי עורכי הדין החזקים בישראל בלי להציג עובדות שלא נבדקו.', 'justice-theme' ); ?></p>
				</div>
				<div class="directory-comparison-playbook__grid">
					<article>
						<strong><?php esc_html_e( 'התאמת תחום ועיר', 'justice-theme' ); ?></strong>
						<span><?php esc_html_e( 'כמו באינדקסים תחרותיים, נקודת הפתיחה היא סינון לפי תחום משפטי ואזור שירות. אם התחום קרוב, למשל גירושין ודיני משפחה, הוא צריך להופיע יחד ולא להתפצל למסלולים מבלבלים.', 'justice-theme' ); ?></span>
					</article>
					<article>
						<strong><?php esc_html_e( 'אמון בלי המצאות', 'justice-theme' ); ?></strong>
						<span><?php esc_html_e( 'תמונה, ביקורות, השכלה, תיקים או הופעות במדיה מוצגים רק כאשר הם קיימים ומאומתים. בפרופילים בסיסיים עדיף להציג פחות, אבל נכון.', 'justice-theme' ); ?></span>
					</article>
					<article>
						<strong><?php esc_html_e( 'מסלול שדרוג ברור', 'justice-theme' ); ?></strong>
						<span><?php esc_html_e( 'פרופיל בסיסי יכול להפוך לפרופיל מורחב עם תמונה, מאמרים, ביקורות מאומתות, קישורי מדיה ומיקום ממומן, הכל מנוהל מה-CMS ולא מקוד קשיח.', 'justice-theme' ); ?></span>
					</article>
				</div>
				<div class="directory-comparison-playbook__actions">
					<a class="button button--primary" href="<?php echo esc_url( home_url( '/find-lawyer-how-to-find-good-attorney/' ) ); ?>"><?php esc_html_e( 'איך לבחור עורך דין נכון', 'justice-theme' ); ?></a>
					<a class="button button--ghost" href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'לבעלי מקצוע: ניהול ושדרוג פרופיל', 'justice-theme' ); ?></a>
				</div>
			</section>

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

			<div class="directory-results-bar">
				<div>
					<strong>
						<?php
						printf(
							/* translators: %d: approved lawyer profiles count. */
							esc_html__( 'נמצאו %d פרופילים המאושרים להצגה', 'justice-theme' ),
							(int) $approved_count
						);
						?>
					</strong>
					<span>הפרופילים מוצגים כמידע ראשוני בלבד, ולא כהמלצה או דירוג.</span>
				</div>

				<?php if ( ! empty( $active_filters ) ) : ?>
					<div class="directory-active-filters" aria-label="מסננים פעילים">
						<?php foreach ( $active_filters as $active_filter ) : ?>
							<span class="directory-chip"><?php echo esc_html( $active_filter ); ?></span>
						<?php endforeach; ?>
						<a class="directory-clear" href="<?php echo esc_url( get_post_type_archive_link( 'justice_lawyer' ) ); ?>">ניקוי מסננים</a>
					</div>
				<?php endif; ?>
			</div>

			<?php if ( ! empty( $public_lawyer_posts ) ) : ?>
				<div class="lawyers-grid">
					<?php foreach ( $public_lawyer_posts as $lawyer_post ) : ?>
						<?php $GLOBALS['post'] = $lawyer_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited ?>
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
				<?php
				$justice_empty_area_slug  = ! empty( $area_term->slug ) ? $area_term->slug : '';
				$justice_empty_area_name  = ! empty( $area_term->name ) ? $area_term->name : '';
				$justice_empty_arena_url  = add_query_arg(
					array_filter( array( 'tool' => 'court-arena', 'area' => $justice_empty_area_slug ) ),
					home_url( '/legal-tools/' )
				);
				$justice_empty_whatsapp   = function_exists( 'justice_theme_public_whatsapp_url' )
					? justice_theme_public_whatsapp_url( sprintf( 'שלום, אני מחפש/ת עורך דין בתחום %s ואשמח להתאמה.', $justice_empty_area_name ?: 'משפטי' ) )
					: '';
				?>
				<div class="directory-empty">
					<h2><?php echo esc_html( $justice_empty_area_name ? sprintf( 'הפרופילים בתחום %s נמצאים בבדיקת אימות', $justice_empty_area_name ) : 'הפרופילים בתחום הזה נמצאים בבדיקת אימות' ); ?></h2>
					<p><?php esc_html_e( 'אנחנו מציגים רק פרופילים שעברו בדיקה. עד שהם עולים, אפשר להתקדם כבר עכשיו:', 'justice-theme' ); ?></p>
					<div class="directory-empty__cta">
						<?php if ( $justice_empty_whatsapp ) : ?>
							<a href="<?php echo esc_url( $justice_empty_whatsapp ); ?>" class="button button--whatsapp-inline" target="_blank" rel="noopener" data-whatsapp-surface="directory_empty" data-lead-utm-source="directory_empty" data-lead-utm-medium="whatsapp" data-lead-utm-campaign="public_legal_help"><?php esc_html_e( 'התאמה אישית בוואטסאפ', 'justice-theme' ); ?></a>
						<?php endif; ?>
						<a href="<?php echo esc_url( $justice_empty_arena_url ); ?>" class="button button--primary"><?php esc_html_e( 'לסמלץ את המקרה בבית משפט', 'justice-theme' ); ?></a>
						<?php if ( function_exists( 'justice_theme_cluster_pillar_crumb' ) && $justice_empty_area_slug ) : ?>
							<a href="<?php echo esc_url( home_url( '/practice-areas/' . $justice_empty_area_slug . '/' ) ); ?>" class="button button--outline"><?php esc_html_e( 'המדריכים בתחום', 'justice-theme' ); ?></a>
						<?php endif; ?>
					</div>
				</div>

				<?php
				// Cross-area fallback: show real approved professionals instead of a wall.
				$justice_fallback_ids = get_posts( array(
					'post_type'      => 'justice_lawyer',
					'post_status'    => 'publish',
					'posts_per_page' => 12,
					'fields'         => 'ids',
					'no_found_rows'  => true,
					'orderby'        => 'modified',
					'order'          => 'DESC',
				) );
				$justice_fallback_shown = 0;
				?>
				<?php if ( ! empty( $justice_fallback_ids ) ) : ?>
					<h3 class="directory-empty__more"><?php esc_html_e( 'בינתיים, אנשי מקצוע מאומתים מתחומים נוספים', 'justice-theme' ); ?></h3>
					<div class="lawyers-grid">
						<?php
						foreach ( $justice_fallback_ids as $justice_fb_id ) {
							if ( $justice_fallback_shown >= 3 ) {
								break;
							}
							if ( function_exists( 'justice_theme_lawyer_profile_is_public_approved' ) && ! justice_theme_lawyer_profile_is_public_approved( (int) $justice_fb_id ) ) {
								continue;
							}
							$justice_fb_post = get_post( (int) $justice_fb_id );
							if ( ! $justice_fb_post instanceof WP_Post ) {
								continue;
							}
							$GLOBALS['post'] = $justice_fb_post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
							setup_postdata( $justice_fb_post );
							get_template_part( 'template-parts/cards/lawyer-card' );
							++$justice_fallback_shown;
						}
						wp_reset_postdata();
						?>
					</div>
				<?php endif; ?>
			<?php endif; ?>

			<aside class="directory-help-cta" aria-label="פנייה כללית להתאמת עורך דין">
				<div>
					<strong>לא בטוחים איזה עורך דין מתאים?</strong>
					<span>אפשר להשאיר פנייה קצרה עם התחום, העיר והדחיפות. המערכת נבנית כדי לסייע בניתוב ראשוני בלי להציג הבטחות או דירוגים לא מאומתים.</span>
				</div>
				<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">שליחת פנייה</a>
			</aside>

			<?php wp_reset_postdata(); ?>

		</div>
	</section>

<?php get_footer(); ?>
