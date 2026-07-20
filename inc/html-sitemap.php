<?php
/**
 * Dynamic human-readable sitemap.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Serve the public HTML sitemap before 404 redirect helpers can intercept it.
 */
function justice_theme_maybe_render_html_sitemap(): void {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = (string) wp_parse_url( $request_uri, PHP_URL_PATH );
	$request_path = '/' . trim( $request_path, '/' ) . '/';

	$canonical_path = '/site-map/';
	$aliases        = array( $canonical_path, '/html-sitemap/' );

	if ( ! in_array( $request_path, $aliases, true ) ) {
		return;
	}

	if ( $canonical_path !== $request_path ) {
		wp_safe_redirect( home_url( $canonical_path ), 301 );
		exit;
	}

	justice_theme_render_html_sitemap_page();
	exit;
}
add_action( 'template_redirect', 'justice_theme_maybe_render_html_sitemap', -999999 );

/**
 * Get published post IDs for a sitemap section.
 *
 * @param string $post_type Post type.
 * @param int    $limit     Maximum posts to fetch. -1 means all.
 * @return int[]
 */
function justice_theme_html_sitemap_get_post_ids( string $post_type, int $limit = -1 ): array {
	if ( ! post_type_exists( $post_type ) ) {
		return array();
	}

	$post_ids = get_posts(
		array(
			'post_type'        => $post_type,
			'post_status'      => 'publish',
			'posts_per_page'   => $limit,
			'orderby'          => 'title',
			'order'            => 'ASC',
			'fields'           => 'ids',
			'no_found_rows'    => true,
			'suppress_filters' => false,
		)
	);

	return array_values( array_map( 'intval', is_array( $post_ids ) ? $post_ids : array() ) );
}

/**
 * Get non-empty public taxonomy terms for sitemap navigation.
 *
 * @param string $taxonomy Taxonomy name.
 * @return WP_Term[]
 */
function justice_theme_html_sitemap_get_terms( string $taxonomy ): array {
	if ( ! taxonomy_exists( $taxonomy ) ) {
		return array();
	}

	$terms = get_terms(
		array(
			'taxonomy'   => $taxonomy,
			'hide_empty' => true,
			'orderby'    => 'name',
			'order'      => 'ASC',
		)
	);

	if ( is_wp_error( $terms ) || ! is_array( $terms ) ) {
		return array();
	}

	return $terms;
}

/**
 * Pick one public grouping term for an article.
 *
 * @param int $post_id Post ID.
 * @return WP_Term|null
 */
function justice_theme_html_sitemap_primary_article_term( int $post_id ): ?WP_Term {
	foreach ( array( 'practice-areas', 'category' ) as $taxonomy ) {
		if ( ! taxonomy_exists( $taxonomy ) ) {
			continue;
		}

		$terms = get_the_terms( $post_id, $taxonomy );
		if ( is_array( $terms ) && ! empty( $terms ) && ! is_wp_error( $terms ) ) {
			return array_shift( $terms );
		}
	}

	return null;
}

/**
 * Group article links by their primary legal topic.
 *
 * @param int[] $article_ids Article IDs.
 * @return array<string,array{label:string,link:string,items:int[]}>
 */
function justice_theme_html_sitemap_group_articles( array $article_ids ): array {
	$groups = array();

	foreach ( $article_ids as $post_id ) {
		$term = justice_theme_html_sitemap_primary_article_term( (int) $post_id );

		if ( $term instanceof WP_Term ) {
			$key   = $term->taxonomy . ':' . $term->term_id;
			$label = $term->name;
			$link  = justice_theme_public_term_link( $term );
		} else {
			$key   = 'ungrouped';
			$label = __( 'מאמרים משפטיים נוספים', 'justice-theme' );
			$link  = home_url( '/articles/' );
		}

		if ( ! isset( $groups[ $key ] ) ) {
			$groups[ $key ] = array(
				'label' => $label,
				'link'  => $link,
				'items' => array(),
			);
		}

		$groups[ $key ]['items'][] = (int) $post_id;
	}

	uasort(
		$groups,
		static function ( array $a, array $b ): int {
			return strcasecmp( $a['label'], $b['label'] );
		}
	);

	return $groups;
}

/**
 * Render a compact list of post links.
 *
 * @param int[] $post_ids Post IDs.
 */
function justice_theme_html_sitemap_render_post_list( array $post_ids ): void {
	if ( empty( $post_ids ) ) {
		return;
	}
	?>
	<ul class="jt-html-sitemap__links">
		<?php foreach ( $post_ids as $post_id ) : ?>
			<?php
			$permalink = justice_theme_public_permalink( (int) $post_id );
			if ( '' === $permalink ) {
				continue;
			}
			?>
			<li>
				<a href="<?php echo esc_url( $permalink ); ?>">
					<?php echo esc_html( get_the_title( (int) $post_id ) ); ?>
				</a>
			</li>
		<?php endforeach; ?>
	</ul>
	<?php
}

/**
 * Render taxonomy term links.
 *
 * @param WP_Term[] $terms Terms.
 */
function justice_theme_html_sitemap_render_term_grid( array $terms ): void {
	if ( empty( $terms ) ) {
		return;
	}
	?>
	<div class="jt-html-sitemap__term-grid">
		<?php foreach ( $terms as $term ) : ?>
			<?php
			$term_link = justice_theme_public_term_link( $term );
			if ( '' === $term_link ) {
				continue;
			}
			?>
			<a class="jt-html-sitemap__term" href="<?php echo esc_url( $term_link ); ?>">
				<span><?php echo esc_html( $term->name ); ?></span>
				<small><?php echo esc_html( sprintf( _n( '%d עמוד', '%d עמודים', (int) $term->count, 'justice-theme' ), (int) $term->count ) ); ?></small>
			</a>
		<?php endforeach; ?>
	</div>
	<?php
}

/**
 * Render the dynamic sitemap page.
 */
function justice_theme_render_html_sitemap_page(): void {
	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->is_404  = false;
		$wp_query->is_page = true;
	}

	status_header( 200 );

	$canonical_url = justice_theme_public_url( home_url( '/site-map/' ) );
	$title         = __( 'מפת אתר', 'justice-theme' );
	$description   = __( 'מפת האתר של Jus-Tice מרכזת מאמרים משפטיים, תחומי התמחות, קטגוריות ועמודי שירות כדי לעזור לגולשים ולמנועי חיפוש למצוא תוכן במהירות.', 'justice-theme' );

	add_filter(
		'pre_get_document_title',
		static function () use ( $title ): string {
			return $title . ' | Jus-Tice';
		},
		99
	);
	add_filter(
		'wpseo_title',
		static function () use ( $title ): string {
			return $title . ' | Jus-Tice';
		},
		99
	);
	add_filter(
		'wpseo_metadesc',
		static function () use ( $description ): string {
			return $description;
		},
		99
	);
	add_filter(
		'wpseo_canonical',
		static function () use ( $canonical_url ): string {
			return $canonical_url;
		},
		99
	);
	add_filter(
		'wpseo_robots',
		static function (): string {
			return 'index, follow';
		},
		99
	);
	add_filter(
		'body_class',
		static function ( array $classes ): array {
			$classes[] = 'justice-html-sitemap-page';
			return $classes;
		}
	);

	$articles       = justice_theme_html_sitemap_get_post_ids( 'articles' );
	$standard_posts = justice_theme_html_sitemap_get_post_ids( 'post' );
	$all_articles   = array_values( array_unique( array_merge( $articles, $standard_posts ) ) );
	$article_groups = justice_theme_html_sitemap_group_articles( $all_articles );
	$pages          = justice_theme_html_sitemap_get_post_ids( 'page', 300 );
	$lawyers        = array_filter(
		justice_theme_html_sitemap_get_post_ids( 'justice_lawyer', 300 ),
		static function ( int $post_id ): bool {
			return function_exists( 'justice_theme_lawyer_profile_is_public_approved' )
				? justice_theme_lawyer_profile_is_public_approved( $post_id )
				: true;
		}
	);
	$practice_terms = justice_theme_html_sitemap_get_terms( 'practice-areas' );
	$category_terms = justice_theme_html_sitemap_get_terms( 'category' );

	get_header();
	?>
	<style>
		.jt-html-sitemap {
			background: #f7f9fb;
			color: #14213d;
			direction: rtl;
			font-family: inherit;
		}
		.jt-html-sitemap__hero,
		.jt-html-sitemap__inner {
			width: min(1180px, calc(100% - 32px));
			margin: 0 auto;
		}
		.jt-html-sitemap__hero {
			padding: clamp(44px, 6vw, 84px) 0 28px;
		}
		.jt-html-sitemap__eyebrow {
			color: #c1121f;
			font-weight: 800;
			margin: 0 0 10px;
		}
		.jt-html-sitemap h1 {
			font-size: clamp(2.2rem, 5vw, 4.8rem);
			line-height: 1.05;
			margin: 0 0 16px;
			letter-spacing: 0;
		}
		.jt-html-sitemap__intro {
			color: #42526b;
			font-size: 1.08rem;
			line-height: 1.8;
			max-width: 760px;
			margin: 0;
		}
		.jt-html-sitemap__stats {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 12px;
			margin-top: 28px;
		}
		.jt-html-sitemap__stat,
		.jt-html-sitemap__panel,
		.jt-html-sitemap__topic {
			background: #fff;
			border: 1px solid #dde5ee;
			border-radius: 8px;
			box-shadow: 0 8px 24px rgba(20, 33, 61, 0.06);
		}
		.jt-html-sitemap__stat {
			padding: 18px;
		}
		.jt-html-sitemap__stat strong {
			display: block;
			font-size: 1.9rem;
			line-height: 1;
			color: #14213d;
		}
		.jt-html-sitemap__stat span {
			color: #5c6b80;
			font-size: 0.92rem;
		}
		.jt-html-sitemap__inner {
			padding: 18px 0 70px;
			display: grid;
			gap: 22px;
		}
		.jt-html-sitemap__panel {
			padding: clamp(18px, 3vw, 30px);
		}
		.jt-html-sitemap__panel h2,
		.jt-html-sitemap__topic h3 {
			font-size: 1.25rem;
			line-height: 1.35;
			margin: 0 0 14px;
			letter-spacing: 0;
		}
		.jt-html-sitemap__quick-links,
		.jt-html-sitemap__term-grid,
		.jt-html-sitemap__topics {
			display: grid;
			gap: 12px;
		}
		.jt-html-sitemap__quick-links,
		.jt-html-sitemap__term-grid {
			grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
		}
		.jt-html-sitemap__quick-links a,
		.jt-html-sitemap__term,
		.jt-html-sitemap__links a {
			color: #14213d;
			text-decoration: none;
		}
		.jt-html-sitemap__quick-links a,
		.jt-html-sitemap__term {
			border: 1px solid #dde5ee;
			border-radius: 8px;
			padding: 14px 16px;
			background: #fbfcfe;
			font-weight: 700;
		}
		.jt-html-sitemap__term {
			display: flex;
			justify-content: space-between;
			gap: 12px;
			align-items: center;
		}
		.jt-html-sitemap__term small {
			color: #6b778c;
			font-size: 0.82rem;
			white-space: nowrap;
		}
		.jt-html-sitemap__topics {
			grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		}
		.jt-html-sitemap__topic {
			padding: 18px;
		}
		.jt-html-sitemap__topic-header {
			display: flex;
			justify-content: space-between;
			gap: 12px;
			align-items: baseline;
			border-bottom: 1px solid #edf1f6;
			margin-bottom: 12px;
			padding-bottom: 10px;
		}
		.jt-html-sitemap__topic-header a {
			color: #c1121f;
			font-weight: 800;
			text-decoration: none;
		}
		.jt-html-sitemap__count {
			color: #6b778c;
			font-size: 0.88rem;
			white-space: nowrap;
		}
		.jt-html-sitemap__links {
			list-style: none;
			padding: 0;
			margin: 0;
			display: grid;
			gap: 9px;
		}
		.jt-html-sitemap__links li {
			position: relative;
			padding-inline-start: 16px;
		}
		.jt-html-sitemap__links li::before {
			content: "";
			position: absolute;
			inset-inline-start: 0;
			top: 0.72em;
			width: 6px;
			height: 6px;
			border-radius: 999px;
			background: #c1121f;
		}
		.jt-html-sitemap__links a:hover,
		.jt-html-sitemap__quick-links a:hover,
		.jt-html-sitemap__term:hover {
			color: #c1121f;
			border-color: #c1121f;
		}
		@media (max-width: 640px) {
			.jt-html-sitemap__quick-links,
			.jt-html-sitemap__term-grid,
			.jt-html-sitemap__topics {
				grid-template-columns: 1fr;
			}
		}
	</style>

	<main id="primary" class="site-main jt-html-sitemap">
		<section class="jt-html-sitemap__hero" aria-labelledby="jt-html-sitemap-title">
			<p class="jt-html-sitemap__eyebrow"><?php esc_html_e( 'ניווט משפטי חכם', 'justice-theme' ); ?></p>
			<h1 id="jt-html-sitemap-title"><?php echo esc_html( $title ); ?></h1>
			<p class="jt-html-sitemap__intro"><?php echo esc_html( $description ); ?></p>
			<div class="jt-html-sitemap__stats" aria-label="<?php esc_attr_e( 'סיכום תוכן באתר', 'justice-theme' ); ?>">
				<div class="jt-html-sitemap__stat"><strong><?php echo esc_html( number_format_i18n( count( $all_articles ) ) ); ?></strong><span><?php esc_html_e( 'מאמרים ומדריכים', 'justice-theme' ); ?></span></div>
				<div class="jt-html-sitemap__stat"><strong><?php echo esc_html( number_format_i18n( count( $practice_terms ) ) ); ?></strong><span><?php esc_html_e( 'תחומי התמחות', 'justice-theme' ); ?></span></div>
				<div class="jt-html-sitemap__stat"><strong><?php echo esc_html( number_format_i18n( count( $category_terms ) ) ); ?></strong><span><?php esc_html_e( 'קטגוריות תוכן', 'justice-theme' ); ?></span></div>
				<div class="jt-html-sitemap__stat"><strong><?php echo esc_html( number_format_i18n( count( $lawyers ) ) ); ?></strong><span><?php esc_html_e( 'פרופילי עורכי דין ציבוריים', 'justice-theme' ); ?></span></div>
			</div>
		</section>

		<div class="jt-html-sitemap__inner">
			<section class="jt-html-sitemap__panel" aria-labelledby="jt-sitemap-core">
				<h2 id="jt-sitemap-core"><?php esc_html_e( 'עמודים מרכזיים', 'justice-theme' ); ?></h2>
				<nav class="jt-html-sitemap__quick-links" aria-label="<?php esc_attr_e( 'עמודים מרכזיים באתר', 'justice-theme' ); ?>">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'דף הבית', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/articles/' ) ); ?>"><?php esc_html_e( 'מאגר מאמרים משפטיים', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>"><?php esc_html_e( 'כל עורכי הדין', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/#ask-lawyer' ) ); ?>"><?php esc_html_e( 'התייעצות משפטית', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'יצירת קשר', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'אודות Jus-Tice', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/editorial-policy/' ) ); ?>"><?php esc_html_e( 'מדיניות עריכה', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/sample-terms-and-conditions-template/' ) ); ?>"><?php esc_html_e( 'תקנון ותנאי שימוש', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>"><?php esc_html_e( 'מדיניות פרטיות', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/cancellation/' ) ); ?>"><?php esc_html_e( 'ביטול עסקה ואספקת שירות', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>"><?php esc_html_e( 'הצטרפות עורכי דין', 'justice-theme' ); ?></a>
					<a href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'מסלולים לעורכי דין', 'justice-theme' ); ?></a>
				</nav>
			</section>

			<?php if ( ! empty( $practice_terms ) ) : ?>
				<section class="jt-html-sitemap__panel" aria-labelledby="jt-sitemap-practice-areas">
					<h2 id="jt-sitemap-practice-areas"><?php esc_html_e( 'תחומי התמחות', 'justice-theme' ); ?></h2>
					<?php justice_theme_html_sitemap_render_term_grid( $practice_terms ); ?>
				</section>
			<?php endif; ?>

			<?php if ( ! empty( $category_terms ) ) : ?>
				<section class="jt-html-sitemap__panel" aria-labelledby="jt-sitemap-categories">
					<h2 id="jt-sitemap-categories"><?php esc_html_e( 'קטגוריות מאמרים', 'justice-theme' ); ?></h2>
					<?php justice_theme_html_sitemap_render_term_grid( $category_terms ); ?>
				</section>
			<?php endif; ?>

			<?php if ( ! empty( $article_groups ) ) : ?>
				<section class="jt-html-sitemap__panel" aria-labelledby="jt-sitemap-articles">
					<h2 id="jt-sitemap-articles"><?php esc_html_e( 'כל המאמרים לפי נושא', 'justice-theme' ); ?></h2>
					<div class="jt-html-sitemap__topics">
						<?php foreach ( $article_groups as $group ) : ?>
							<article class="jt-html-sitemap__topic">
								<header class="jt-html-sitemap__topic-header">
									<h3>
										<?php if ( ! empty( $group['link'] ) ) : ?>
											<a href="<?php echo esc_url( $group['link'] ); ?>"><?php echo esc_html( $group['label'] ); ?></a>
										<?php else : ?>
											<?php echo esc_html( $group['label'] ); ?>
										<?php endif; ?>
									</h3>
									<span class="jt-html-sitemap__count"><?php echo esc_html( sprintf( _n( '%d מאמר', '%d מאמרים', count( $group['items'] ), 'justice-theme' ), count( $group['items'] ) ) ); ?></span>
								</header>
								<?php justice_theme_html_sitemap_render_post_list( $group['items'] ); ?>
							</article>
						<?php endforeach; ?>
					</div>
				</section>
			<?php endif; ?>

			<?php if ( ! empty( $pages ) || ! empty( $lawyers ) ) : ?>
				<section class="jt-html-sitemap__panel" aria-labelledby="jt-sitemap-more">
					<h2 id="jt-sitemap-more"><?php esc_html_e( 'עמודים ופרופילים נוספים', 'justice-theme' ); ?></h2>
					<div class="jt-html-sitemap__topics">
						<?php if ( ! empty( $pages ) ) : ?>
							<article class="jt-html-sitemap__topic">
								<header class="jt-html-sitemap__topic-header">
									<h3><?php esc_html_e( 'עמודי מידע ושירות', 'justice-theme' ); ?></h3>
									<span class="jt-html-sitemap__count"><?php echo esc_html( number_format_i18n( count( $pages ) ) ); ?></span>
								</header>
								<?php justice_theme_html_sitemap_render_post_list( $pages ); ?>
							</article>
						<?php endif; ?>
						<?php if ( ! empty( $lawyers ) ) : ?>
							<article class="jt-html-sitemap__topic">
								<header class="jt-html-sitemap__topic-header">
									<h3><?php esc_html_e( 'עורכי דין ציבוריים', 'justice-theme' ); ?></h3>
									<span class="jt-html-sitemap__count"><?php echo esc_html( number_format_i18n( count( $lawyers ) ) ); ?></span>
								</header>
								<?php justice_theme_html_sitemap_render_post_list( $lawyers ); ?>
							</article>
						<?php endif; ?>
					</div>
				</section>
			<?php endif; ?>
		</div>
	</main>
	<?php
	get_footer();
}
