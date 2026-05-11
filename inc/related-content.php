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
 * Split manual related URLs into individual path values.
 *
 * @param string $raw Raw metadata value.
 * @return string[]
 */
function justice_theme_related_split_paths( string $raw ): array {
	return array_filter( array_map( 'trim', preg_split( '/[\r\n,|;]+/', $raw ) ?: array() ) );
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

		$paths = array_merge( $paths, justice_theme_related_split_paths( $raw ) );
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
 * Normalize content-cluster aliases into a stable editorial group.
 *
 * @param string $cluster Raw cluster value.
 * @return string
 */
function justice_theme_related_normalize_cluster( string $cluster ): string {
	$cluster = str_replace( '-', '_', sanitize_key( $cluster ) );

	$aliases = array(
		'family_law'          => 'family_divorce',
		'divorce'             => 'family_divorce',
		'criminal'            => 'criminal_law',
		'criminal_defense'    => 'criminal_law',
		'real_estate_law'     => 'real_estate',
		'property_law'        => 'real_estate',
		'malpractice'         => 'medical_malpractice',
		'medical_negligence'  => 'medical_malpractice',
		'torts'               => 'personal_injury',
		'damages'             => 'personal_injury',
		'traffic'             => 'traffic_law',
		'labor_law'           => 'employment_law',
		'work_law'            => 'employment_law',
		'wills'               => 'inheritance_wills',
		'inheritance'         => 'inheritance_wills',
		'lawyer_finder'       => 'lawyer_selection',
		'legaltech'           => 'legal_tech_business',
		'legal_tech'          => 'legal_tech_business',
		'business'            => 'business_commercial',
		'commercial_law'      => 'business_commercial',
		'international_law'   => 'international',
	);

	return $aliases[ $cluster ] ?? $cluster;
}

/**
 * Build a compact text fingerprint for cluster inference.
 *
 * @param int $post_id Post ID.
 * @return string
 */
function justice_theme_related_context_text( int $post_id ): string {
	$parts = array(
		get_post_field( 'post_name', $post_id ),
		get_permalink( $post_id ),
		get_the_title( $post_id ),
		get_post_meta( $post_id, 'content_cluster', true ),
		get_post_meta( $post_id, 'primary_keyword', true ),
		get_post_meta( $post_id, 'secondary_keywords', true ),
		get_post_meta( $post_id, 'search_intent', true ),
	);

	if ( get_the_ID() === $post_id && isset( $_SERVER['REQUEST_URI'] ) ) {
		$parts[] = sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) );
	}

	$terms = get_the_terms( $post_id, 'practice-areas' );
	if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
		foreach ( $terms as $term ) {
			$parts[] = $term->slug;
			$parts[] = $term->name;
		}
	}

	return strtolower( remove_accents( wp_strip_all_tags( implode( ' ', array_filter( array_map( 'strval', $parts ) ) ) ) ) );
}

/**
 * Return tokens that identify foreign/international legal intent.
 *
 * @return string[]
 */
function justice_theme_related_international_tokens(): array {
	return array(
		'abroad',
		'australia',
		'cyprus',
		'foreign',
		'greece',
		'greek',
		'international',
		'italian',
		'italy',
		'overseas',
		'portugal',
		'spain',
		'אוסטרליה',
		'איטליה',
		'יוון',
		'קפריסין',
	);
}

/**
 * Check whether a normalized text fingerprint contains any tokens.
 *
 * @param string   $text   Normalized text fingerprint.
 * @param string[] $tokens Tokens to look for.
 * @return bool
 */
function justice_theme_related_text_has_any( string $text, array $tokens ): bool {
	foreach ( $tokens as $token ) {
		if ( false !== strpos( $text, $token ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Infer an editorial cluster when explicit metadata is absent.
 *
 * @param int $post_id Post ID.
 * @return string
 */
function justice_theme_related_infer_cluster( int $post_id ): string {
	$text  = justice_theme_related_context_text( $post_id );
	$cluster = justice_theme_related_normalize_cluster( (string) get_post_meta( $post_id, 'content_cluster', true ) );

	if ( 'real_estate' === $cluster && justice_theme_related_text_has_any( $text, justice_theme_related_international_tokens() ) ) {
		return 'international';
	}

	if ( $cluster ) {
		return $cluster;
	}

	$rules = array(
		'legal_tech_business' => array( 'ai-for-law-firms', 'legal-tech', 'legaltech', 'ai-intake', 'law-firms' ),
		'business_commercial' => array( 'business-license', 'company', 'commercial', 'business' ),
		'international'       => justice_theme_related_international_tokens(),
		'family_divorce'      => array( 'divorce', 'family-law', 'family_law', 'child-support', 'child-custody', 'custody', 'mediation', 'rabbinical', 'alimony', 'mutual-divorce' ),
		'criminal_law'        => array( 'criminal', 'drug-offenses', 'police-investigation', 'indictment', 'pretrial-detention', 'sex-offenses', 'white-collar', 'arrest' ),
		'real_estate'         => array( 'real-estate', 'property', 'apartment', 'rent-agreement', 'purchase-agreement', 'sale-agreement', 'land-registry', 'construction-defects', 'urban-renewal' ),
		'medical_malpractice' => array( 'medical-malpractice', 'malpractice', 'birth-malpractice', 'pregnancy-malpractice', 'diagnosis-malpractice', 'surgery-malpractice' ),
		'personal_injury'     => array( 'personal-injury', 'car-accident', 'work-accident', 'accident', 'national-insurance', 'injury', 'tort' ),
		'traffic_law'         => array( 'traffic-law', 'traffic-lawyer', 'drunk-driving', 'license-suspension', 'speeding' ),
		'employment_law'      => array( 'employment', 'labor-law', 'work-rights', 'dismissal' ),
		'inheritance_wills'   => array( 'inheritance', 'will-contest', 'probate', 'estate', 'wills' ),
		'lawyer_selection'    => array( 'find-lawyer', 'good-attorney', 'how-to-find', 'recommended-lawyer' ),
	);

	foreach ( $rules as $rule_cluster => $tokens ) {
		foreach ( $tokens as $token ) {
			if ( false !== strpos( $text, $token ) ) {
				return $rule_cluster;
			}
		}
	}

	return '';
}

/**
 * Keep taxonomy fallback related cards inside the inferred editorial cluster.
 *
 * @param int[] $candidate_ids Candidate post IDs.
 * @param int   $source_id Current post ID.
 * @return int[]
 */
function justice_theme_related_filter_cluster_candidates( array $candidate_ids, int $source_id ): array {
	$source_cluster = justice_theme_related_infer_cluster( $source_id );

	if ( ! $source_cluster ) {
		return $candidate_ids;
	}

	return array_values(
		array_filter(
			$candidate_ids,
			static function ( int $candidate_id ) use ( $source_cluster ): bool {
				return $source_cluster === justice_theme_related_infer_cluster( $candidate_id );
			}
		)
	);
}

/**
 * Return safe QA attributes for a related-content card.
 *
 * These attributes do not change public rendering, but let visual/DOM QA flag
 * off-cluster related cards after deployment.
 *
 * @param int    $source_id      Current post ID.
 * @param int    $candidate_id   Related post ID.
 * @param string $source_cluster Optional precomputed source cluster.
 * @return array<string,string>
 */
function justice_theme_related_card_data_attrs( int $source_id, int $candidate_id, string $source_cluster = '' ): array {
	$source_cluster    = $source_cluster ?: justice_theme_related_infer_cluster( $source_id );
	$candidate_cluster = justice_theme_related_infer_cluster( $candidate_id );
	$cluster_match     = 'unknown';

	if ( $source_cluster && $candidate_cluster ) {
		$cluster_match = $source_cluster === $candidate_cluster ? 'match' : 'mismatch';
	}

	return array(
		'data-related-card'           => 'true',
		'data-related-source-cluster' => $source_cluster ?: 'unknown',
		'data-related-card-cluster'   => $candidate_cluster ?: 'unknown',
		'data-related-cluster-match'  => $cluster_match,
	);
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
		justice_theme_related_filter_cluster_candidates(
			justice_theme_related_query_ids(
				array(
					'post_type'      => $post_types,
					'post__not_in'   => array_merge( array( $post_id ), $ids ),
					'posts_per_page' => 18,
					'tax_query'      => array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
						array(
							'taxonomy' => 'practice-areas',
							'field'    => 'term_id',
							'terms'    => $term_ids,
						),
					),
				)
			),
			$post_id
		),
		$post_id,
		$limit
	);

	return $ids;
}

/**
 * Return a safe fallback destination when no related article cards exist.
 *
 * @param WP_Term|null $term           Primary practice-area term.
 * @param string       $source_cluster Inferred editorial cluster.
 * @return array{url:string,label:string}|array{}
 */
function justice_theme_related_fallback_target( ?WP_Term $term, string $source_cluster = '' ): array {
	$source_cluster = justice_theme_related_normalize_cluster( $source_cluster );

	if ( $term && ! is_wp_error( $term ) ) {
		$term_link = justice_theme_public_term_link( $term );
		if ( '' !== $term_link ) {
			return array(
				'url'   => $term_link,
				'label' => sprintf( __( 'מעבר לתחום %s', 'justice-theme' ), $term->name ),
			);
		}
	}

	$cluster_targets = array(
		'lawyer_selection'    => array( '/lawyers/', __( 'מעבר למדריך עורכי הדין', 'justice-theme' ) ),
		'family_divorce'      => array( '/lawyers/?area=family-law', __( 'מצאו עורכי דין לענייני משפחה', 'justice-theme' ) ),
		'criminal_law'        => array( '/lawyers/?area=criminal-law', __( 'מצאו עורכי דין פליליים', 'justice-theme' ) ),
		'real_estate'         => array( '/lawyers/?area=real-estate-law', __( 'מצאו עורכי דין מקרקעין', 'justice-theme' ) ),
		'medical_malpractice' => array( '/lawyers/?area=medical-malpractice-law', __( 'מצאו עורכי דין רשלנות רפואית', 'justice-theme' ) ),
		'personal_injury'     => array( '/lawyers/?area=personal-injury-law', __( 'מצאו עורכי דין נזיקין', 'justice-theme' ) ),
		'traffic_law'         => array( '/lawyers/?area=traffic-law', __( 'מצאו עורכי דין תעבורה', 'justice-theme' ) ),
		'employment_law'      => array( '/lawyers/?area=employment-law', __( 'מצאו עורכי דין דיני עבודה', 'justice-theme' ) ),
		'inheritance_wills'   => array( '/lawyers/?area=inheritance-law', __( 'מצאו עורכי דין ירושה וצוואות', 'justice-theme' ) ),
	);

	if ( empty( $cluster_targets[ $source_cluster ] ) ) {
		return array();
	}

	return array(
		'url'   => justice_theme_public_url( home_url( $cluster_targets[ $source_cluster ][0] ) ),
		'label' => $cluster_targets[ $source_cluster ][1],
	);
}

/**
 * Render a compact fallback when no semantic related article exists.
 *
 * @param WP_Term|null $term           Primary practice-area term.
 * @param string       $source_cluster Inferred editorial cluster.
 */
function justice_theme_related_empty_state( ?WP_Term $term, string $source_cluster = '' ): void {
	$target = justice_theme_related_fallback_target( $term, $source_cluster );
	if ( empty( $target['url'] ) || empty( $target['label'] ) ) {
		return;
	}
	?>
	<section
		class="related-articles related-articles--fallback section"
		data-related-mode="fallback"
		data-related-source-cluster="<?php echo esc_attr( $source_cluster ?: 'unknown' ); ?>"
		data-related-card-count="0"
	>
		<div class="container">
			<div class="section-header">
				<h2><?php esc_html_e( 'עוד בנושא', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'כדי לשמור על רלוונטיות, מוצגים כאן רק קישורים הקשורים לתחום המשפטי של המדריך.', 'justice-theme' ); ?></p>
			</div>
			<a class="button button--ghost" href="<?php echo esc_url( $target['url'] ); ?>">
				<?php echo esc_html( $target['label'] ); ?>
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
	$source_cluster = justice_theme_related_infer_cluster( $post_id );

	if ( empty( $related_ids ) ) {
		justice_theme_related_empty_state( justice_theme_get_primary_practice_area( $post_id ), $source_cluster );
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
		justice_theme_related_empty_state( justice_theme_get_primary_practice_area( $post_id ), $source_cluster );
		return;
	}
	?>
	<section
		class="related-articles section"
		data-related-mode="semantic"
		data-related-source-cluster="<?php echo esc_attr( $source_cluster ?: 'unknown' ); ?>"
		data-related-card-count="<?php echo esc_attr( (string) count( $related_ids ) ); ?>"
	>
		<div class="container">
			<div class="section-header">
				<h2><?php esc_html_e( 'מדריכים משפטיים קשורים', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'נבחרו לפי קשר לנושא, לתחום המשפטי ולשלבים הבאים שכדאי להכיר.', 'justice-theme' ); ?></p>
			</div>

			<div class="article-grid article-grid--three">
				<?php
				while ( $related->have_posts() ) :
					$related->the_post();
					get_template_part(
						'template-parts/cards/article-card',
						null,
						array(
							'data_attrs' => justice_theme_related_card_data_attrs( $post_id, get_the_ID(), $source_cluster ),
						)
					);
				endwhile;
				wp_reset_postdata();
				?>
			</div>
		</div>
	</section>
	<?php
}
