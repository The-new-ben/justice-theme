<?php
/**
 * Related content.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return public post types that may safely appear in related-content cards.
 *
 * @return string[]
 */
function justice_theme_related_post_types(): array {
	$post_types = array();

	foreach ( array( 'articles', 'page' ) as $post_type ) {
		if ( post_type_exists( $post_type ) ) {
			$post_types[] = $post_type;
		}
	}

	return $post_types ? $post_types : array( 'post' );
}

/**
 * Normalize a public URL/path into candidate WordPress slugs.
 *
 * @param string $path Public URL or path.
 * @return string[]
 */
function justice_theme_related_path_candidates( string $path ): array {
	$url_path = (string) wp_parse_url( trim( $path ), PHP_URL_PATH );
	$slug     = trim( rawurldecode( $url_path ), "/ \t\n\r\0\x0B" );

	if ( '' === $slug ) {
		return array();
	}

	$candidates = array( $slug );

	foreach ( array( 'articles/', 'article/', 'pages/' ) as $prefix ) {
		if ( 0 === strpos( $slug, $prefix ) ) {
			$candidates[] = substr( $slug, strlen( $prefix ) );
		}
	}

	$candidates[] = basename( $slug );

	return array_values( array_unique( array_filter( $candidates ) ) );
}

/**
 * Resolve a manual related URL/path to a public post ID.
 *
 * @param string $path Public URL or path.
 * @return int
 */
function justice_theme_related_post_id_from_path( string $path ): int {
	$post_types = justice_theme_related_post_types();

	foreach ( justice_theme_related_path_candidates( $path ) as $candidate ) {
		$post = get_page_by_path( $candidate, OBJECT, $post_types );
		if ( $post instanceof WP_Post && 'publish' === get_post_status( $post ) ) {
			return (int) $post->ID;
		}
	}

	return 0;
}

/**
 * Add unique IDs without exceeding the requested limit.
 *
 * @param int[] $ids Current IDs.
 * @param int[] $new_ids New IDs.
 * @param int   $exclude_id Current post ID to exclude.
 * @param int   $limit Max IDs.
 * @return int[]
 */
function justice_theme_related_merge_ids( array $ids, array $new_ids, int $exclude_id, int $limit ): array {
	foreach ( $new_ids as $new_id ) {
		$new_id = (int) $new_id;

		if ( $new_id <= 0 || $new_id === $exclude_id || in_array( $new_id, $ids, true ) ) {
			continue;
		}

		$ids[] = $new_id;

		if ( count( $ids ) >= $limit ) {
			break;
		}
	}

	return $ids;
}

/**
 * Resolve manual related URLs from article metadata.
 *
 * @param int $post_id Current post ID.
 * @return int[]
 */
function justice_theme_related_manual_ids( int $post_id ): array {
	$paths = array();

	foreach ( array( 'manual_related_urls', 'related_urls', 'parent_pillar_url' ) as $meta_key ) {
		$raw = (string) get_post_meta( $post_id, $meta_key, true );
		if ( '' === trim( $raw ) ) {
			continue;
		}

		$paths = array_merge( $paths, preg_split( '/[\r\n,]+/', $raw ) ?: array() );
	}

	$ids = array();

	foreach ( array_filter( array_map( 'trim', $paths ) ) as $path ) {
		$ids[] = justice_theme_related_post_id_from_path( $path );
	}

	return array_values( array_unique( array_filter( $ids ) ) );
}

/**
 * Query related IDs by metadata or taxonomy.
 *
 * @param array $args Query args.
 * @return int[]
 */
function justice_theme_related_query_ids( array $args ): array {
	$query = new WP_Query(
		array_merge(
			array(
				'post_status'         => 'publish',
				'posts_per_page'      => 6,
				'fields'              => 'ids',
				'ignore_sticky_posts' => true,
				'no_found_rows'       => true,
			),
			$args
		)
	);

	return array_map( 'intval', $query->posts );
}

/**
 * Collect semantic related articles.
 *
 * Priority:
 * 1. Manual editorial URLs.
 * 2. Same content_cluster metadata.
 * 3. Same practice-area taxonomy.
 *
 * @param int $post_id Current post ID.
 * @param int $limit   Max cards.
 * @return int[]
 */
function justice_theme_get_related_article_ids( int $post_id, int $limit = 3 ): array {
	$limit      = max( 1, $limit );
	$post_types = justice_theme_related_post_types();
	$ids        = array();

	$ids = justice_theme_related_merge_ids( $ids, justice_theme_related_manual_ids( $post_id ), $post_id, $limit );

	if ( count( $ids ) >= $limit ) {
		return $ids;
	}

	$cluster = sanitize_key( (string) get_post_meta( $post_id, 'content_cluster', true ) );
	if ( $cluster ) {
		$ids = justice_theme_related_merge_ids(
			$ids,
			justice_theme_related_query_ids(
				array(
					'post_type'    => $post_types,
					'post__not_in' => array_merge( array( $post_id ), $ids ),
					'meta_query'   => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
						array(
							'key'     => 'content_cluster',
							'value'   => $cluster,
							'compare' => '=',
						),
					),
				)
			),
			$post_id,
			$limit
		);
	}

	if ( count( $ids ) >= $limit ) {
		return $ids;
	}

	$terms = get_the_terms( $post_id, 'practice-areas' );
	if ( empty( $terms ) || is_wp_error( $terms ) ) {
		return $ids;
	}

	$term_ids = wp_list_pluck( $terms, 'term_id' );
	$ids      = justice_theme_related_merge_ids(
		$ids,
		justice_theme_related_query_ids(
			array(
				'post_type'    => $post_types,
				'post__not_in' => array_merge( array( $post_id ), $ids ),
				'tax_query'   => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
					array(
						'taxonomy' => 'practice-areas',
						'field'    => 'term_id',
						'terms'    => $term_ids,
					),
				),
			)
		),
		$post_id,
		$limit
	);

	return $ids;
}

/**
 * Render a compact fallback when no semantic related article exists.
 *
 * @param WP_Term|null $term Primary practice-area term.
 */
function justice_theme_related_empty_state( ?WP_Term $term ): void {
	if ( ! $term || is_wp_error( $term ) ) {
		return;
	}

	$term_link = get_term_link( $term );
	if ( is_wp_error( $term_link ) ) {
		return;
	}
	?>
	<section class="related-articles related-articles--fallback section">
		<div class="container">
			<div class="section-header">
				<h2><?php esc_html_e( 'עוד בנושא', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'כדי לשמור על רלוונטיות, מוצגים כאן רק קישורים הקשורים לתחום המשפטי של המדריך.', 'justice-theme' ); ?></p>
			</div>
			<a class="button button--ghost" href="<?php echo esc_url( $term_link ); ?>">
				<?php echo esc_html( sprintf( __( 'מעבר לתחום %s', 'justice-theme' ), $term->name ) ); ?>
			</a>
		</div>
	</section>
	<?php
}

/**
 * Render related articles by semantic relevance.
 *
 * @param int $post_id Current post ID.
 */
function justice_theme_related_articles( $post_id ) {
	$post_id     = (int) $post_id;
	$related_ids = justice_theme_get_related_article_ids( $post_id, 3 );

	if ( empty( $related_ids ) ) {
		justice_theme_related_empty_state( justice_theme_get_primary_practice_area( $post_id ) );
		return;
	}

	$related = new WP_Query(
		array(
			'post_type'           => justice_theme_related_post_types(),
			'post_status'         => 'publish',
			'posts_per_page'      => count( $related_ids ),
			'post__in'            => $related_ids,
			'orderby'             => 'post__in',
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
		)
	);

	if ( ! $related->have_posts() ) {
		justice_theme_related_empty_state( justice_theme_get_primary_practice_area( $post_id ) );
		return;
	}
	?>
	<section class="related-articles section" data-related-mode="semantic">
		<div class="container">
			<div class="section-header">
				<h2><?php esc_html_e( 'מדריכים משפטיים קשורים', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'נבחרו לפי קשר לנושא, לתחום המשפטי ולשלבים הבאים שכדאי להכיר.', 'justice-theme' ); ?></p>
			</div>

			<div class="article-grid article-grid--three">
				<?php
				while ( $related->have_posts() ) :
					$related->the_post();
					get_template_part( 'template-parts/cards/article-card' );
				endwhile;
				wp_reset_postdata();
				?>
			</div>
		</div>
	</section>
	<?php
}
