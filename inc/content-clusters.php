<?php
/**
 * Content cluster map — the single source of truth for hub-and-spoke topology.
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * The theme already had a heuristic related-content engine (inc/related-content.php)
 * that *infers* a cluster from page text. Inference is fine as a fallback, but a real
 * ranking architecture needs a deterministic map: each money pillar (hub) and the exact
 * supporting pages (spokes) that point to it, with ONE parent per spoke
 * (anti-cannibalization) and >= 2 sibling links per spoke.
 *
 * This map is derived from the GSC-verified support-to-hub research in
 * project-control/*-support-to-hub-map-2026-05-18.csv (real clicks/impressions).
 * Boundary/hold rows (BOUNDARY_*, HOLD_*, REVIEW_BEFORE_*) from that research are
 * intentionally EXCLUDED here — they are flagged as "do not route yet" and need an
 * owner/route decision before they earn an internal link.
 *
 * HOW IT IS RENDERED (no database writes, no plugin upload)
 * ---------------------------------------------------------
 *  - Spoke pages get an automatic "part of guide -> pillar + see also siblings" block
 *    appended at render time via the_content (idempotent: it is rendered, never stored).
 *  - Breadcrumbs insert the pillar as a parent crumb: Home -> Pillar -> Spoke, so the
 *    BreadcrumbList schema reflects the real hierarchy.
 *  - Anchor text is resolved LIVE from each target's real post title (never fabricated).
 *
 * TO EDIT THE TOPOLOGY: change justice_theme_content_clusters() only. Everything else
 * reads from it.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The authoritative hub-and-spoke map.
 *
 * Each entry:
 *   'pillar'       => root slug of the money hub page (live English slug),
 *   'label'        => short Hebrew label used in the "part of guide" line,
 *   'spokes'       => list of supporting page slugs (one parent only; each appears in
 *                     exactly ONE cluster across the whole map).
 *
 * Only clean, confirmed live English slugs are listed. Hebrew-encoded and /articles/*,
 * /psakdin/* support URLs from the research exist on the site but are left out of the
 * hardcoded map to avoid brittle encoded slugs; they are still caught by the heuristic
 * related-content engine.
 *
 * @return array<string,array{pillar:string,label:string,spokes:string[]}>
 */
function justice_theme_content_clusters(): array {
	return array(
		'real-estate' => array(
			'pillar' => 'real-estate-attorney',
			'label'  => 'המדריך לעורך דין מקרקעין',
			'spokes' => array(
				'real-estate-lawyer-guide',
				'lawyer-for-buying-or-selling-a-house',
				'registration-of-real-estate-israel',
				'land-appreciation-tax',
				'real-estate-lawyer-cost-2025',
				'real-estate-appraiser',
				'marital-property-agreement',
				'spouse-property-registration-guide',
			),
		),
		'family-law' => array(
			'pillar' => 'family-law',
			'label'  => 'המדריך לדיני משפחה וגירושין',
			'spokes' => array(
				'free-divorce-agreement-template',
				'joint-custody-shared-parenting',
				'child-custody-modification',
				'divorce-costs-2025',
				'living-apart-together-legal-rights',
				'divorce-mediation-basics',
				'cohabitation-property-rights-for-unmarried-couples',
				'how-much-does-a-divorce-agreement-cost',
				'divorce-everything-you-need-to-know',
				'what-is-child-custody',
				'trusted-divorce-attorney-guide',
				'strategic-divorce-cost-planning',
				'request-for-family-dispute-settlements',
			),
		),
		'criminal-law' => array(
			'pillar' => 'criminal-defense-attorney',
			'label'  => 'המדריך לעורך דין פלילי',
			'spokes' => array(
				'sex-crime-lawyer',
				'sexual-offenses',
				'drug-related-crime',
				'how-much-will-a-criminal-defense-lawyer-cost',
				'tax-investigation-guide',
				'apply-for-police-criminal-information-certificates',
				'what-is-money-laundering',
				'economic-crimes-white-collar-lawyer',
				'famous-criminal-defense-lawyer',
				'leading-criminal-law-firm',
				'lawyer-near-me-criminal-law',
			),
		),
		'medical-malpractice' => array(
			'pillar' => 'medical-malpractice-lawyer',
			'label'  => 'המדריך לרשלנות רפואית',
			'spokes' => array(
				'what-is-medical-malpractice-definition-examples',
				'medical-malpractice-in-the-united-states',
				'medical-malpractice-common-errors-doctors-hospitals',
				'anesthesia-medical-malpractice',
				'cerebral-palsy',
				'malpractice-cerebral-palsy',
			),
		),
		'traffic-law' => array(
			'pillar' => 'traffic-lawyer',
			'label'  => 'המדריך לעורך דין תעבורה',
			'spokes' => array(
				'driving-under-the-influence',
				'dui-refusal-blood-breath-urine-test',
				'driving-under-the-influence-of-drugs',
				'driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license',
			),
		),
		'employment-law' => array(
			'pillar' => 'labor-lawyer',
			'label'  => 'המדריך לדיני עבודה',
			'spokes' => array(
				'employment-contract',
				'employer-worker-relationship',
				'israeli-labor-law',
			),
		),
		'inheritance-wills' => array(
			'pillar' => 'inheritance-lawyer',
			'label'  => 'המדריך לירושה וצוואות',
			'spokes' => array(
				'inheritance',
				'inheritance-order',
				'what-is-a-probate-order',
				'will-and-testament',
				'will-probate-objection',
				'revocation-of-a-will-and-reviving-previous-will',
				'maximize-an-inheritance',
				'international-inheritance-wills-lawyer',
			),
		),
	);
}

/**
 * Resolve the current singular post's root slug.
 *
 * @param int $post_id Post ID.
 * @return string Lower-case slug, or '' if unavailable.
 */
function justice_theme_cluster_post_slug( int $post_id ): string {
	$slug = (string) get_post_field( 'post_name', $post_id );
	return strtolower( trim( $slug ) );
}

/**
 * Find the cluster entry that owns a given slug (as pillar OR spoke).
 *
 * @param string $slug Page slug.
 * @return array{key:string,pillar:string,label:string,spokes:string[],role:string}|null
 */
function justice_theme_cluster_for_slug( string $slug ): ?array {
	$slug = strtolower( trim( $slug ) );
	if ( '' === $slug ) {
		return null;
	}

	foreach ( justice_theme_content_clusters() as $key => $cluster ) {
		if ( $cluster['pillar'] === $slug ) {
			return array(
				'key'    => $key,
				'pillar' => $cluster['pillar'],
				'label'  => $cluster['label'],
				'spokes' => $cluster['spokes'],
				'role'   => 'pillar',
			);
		}

		if ( in_array( $slug, $cluster['spokes'], true ) ) {
			return array(
				'key'    => $key,
				'pillar' => $cluster['pillar'],
				'label'  => $cluster['label'],
				'spokes' => $cluster['spokes'],
				'role'   => 'spoke',
			);
		}
	}

	return null;
}

/**
 * Resolve a root slug to a live {url,title} pair, across articles + pages.
 *
 * Title is read from the real published post so anchor text is never fabricated.
 *
 * @param string $slug Page slug.
 * @return array{url:string,title:string}|null
 */
function justice_theme_cluster_resolve_target( string $slug ): ?array {
	$slug = strtolower( trim( $slug ) );
	if ( '' === $slug ) {
		return null;
	}

	$post_types = function_exists( 'justice_theme_related_post_types' )
		? justice_theme_related_post_types()
		: array( 'page', 'articles', 'post' );

	$post = get_page_by_path( $slug, OBJECT, $post_types );

	if ( $post instanceof WP_Post && 'publish' === get_post_status( $post ) ) {
		$url = function_exists( 'justice_theme_public_permalink' )
			? justice_theme_public_permalink( $post->ID )
			: get_permalink( $post->ID );

		return array(
			'url'   => (string) $url,
			'title' => get_the_title( $post->ID ),
		);
	}

	// Fallback: the slug routes at site root even if it is not a standard post
	// (some money hubs are template routes). Use the slug-built URL with no title.
	return null;
}

/**
 * Build a pillar breadcrumb crumb for a singular post, if it belongs to a cluster.
 *
 * Returns null for pillars themselves (they sit directly under Home) and for posts
 * outside the map.
 *
 * @param int $post_id Post ID.
 * @return array{name:string,url:string}|null
 */
function justice_theme_cluster_pillar_crumb( int $post_id ): ?array {
	$cluster = justice_theme_cluster_for_slug( justice_theme_cluster_post_slug( $post_id ) );

	if ( ! $cluster || 'spoke' !== $cluster['role'] ) {
		return null;
	}

	$pillar = justice_theme_cluster_resolve_target( $cluster['pillar'] );
	$url    = $pillar['url'] ?? justice_theme_public_url( home_url( '/' . $cluster['pillar'] . '/' ) );
	$name   = $pillar['title'] ?? $cluster['label'];

	return array(
		'name' => $name,
		'url'  => $url,
	);
}

/**
 * Pick sibling spokes for a given spoke slug (same cluster, excluding self).
 *
 * @param string $slug  Current spoke slug.
 * @param int    $limit Max siblings.
 * @return string[] Sibling slugs.
 */
function justice_theme_cluster_siblings( string $slug, int $limit = 3 ): array {
	$cluster = justice_theme_cluster_for_slug( $slug );
	if ( ! $cluster || 'spoke' !== $cluster['role'] ) {
		return array();
	}

	$siblings = array_values(
		array_filter(
			$cluster['spokes'],
			static function ( string $s ) use ( $slug ): bool {
				return $s !== strtolower( trim( $slug ) );
			}
		)
	);

	return array_slice( $siblings, 0, max( 0, $limit ) );
}

/**
 * Render the spoke -> pillar + siblings internal-link block.
 *
 * Mirrors the proven nad-lan "spoke backlink" pattern, but rendered from the map
 * (deterministic) instead of stored in post content. Only outputs links that resolve
 * to live published posts.
 *
 * @param int $post_id Spoke post ID.
 * @return string HTML, or '' when nothing resolves.
 */
function justice_theme_render_cluster_backlink( int $post_id ): string {
	$slug    = justice_theme_cluster_post_slug( $post_id );
	$cluster = justice_theme_cluster_for_slug( $slug );

	if ( ! $cluster || 'spoke' !== $cluster['role'] ) {
		return '';
	}

	$pillar = justice_theme_cluster_resolve_target( $cluster['pillar'] );
	if ( ! $pillar ) {
		// Pillar not resolvable as a standard post; still link to its root URL.
		$pillar = array(
			'url'   => justice_theme_public_url( home_url( '/' . $cluster['pillar'] . '/' ) ),
			'title' => $cluster['label'],
		);
	}

	$sibling_links = array();
	foreach ( justice_theme_cluster_siblings( $slug, 3 ) as $sibling_slug ) {
		$resolved = justice_theme_cluster_resolve_target( $sibling_slug );
		if ( $resolved ) {
			$sibling_links[] = sprintf(
				'<a href="%s">%s</a>',
				esc_url( $resolved['url'] ),
				esc_html( $resolved['title'] )
			);
		}
	}

	ob_start();
	?>
	<aside class="cluster-backlink" data-cluster="<?php echo esc_attr( $cluster['key'] ); ?>" aria-label="<?php esc_attr_e( 'ניווט באשכול התוכן', 'justice-theme' ); ?>">
		<p class="cluster-backlink__parent">
			<strong><?php esc_html_e( 'חלק מהמדריך:', 'justice-theme' ); ?></strong>
			<a href="<?php echo esc_url( $pillar['url'] ); ?>"><?php echo esc_html( $pillar['title'] ); ?></a>
		</p>
		<?php if ( ! empty( $sibling_links ) ) : ?>
			<p class="cluster-backlink__siblings">
				<strong><?php esc_html_e( 'ראו גם באותו נושא:', 'justice-theme' ); ?></strong>
				<?php echo wp_kses_post( implode( ' · ', $sibling_links ) ); ?>
			</p>
		<?php endif; ?>
	</aside>
	<?php
	return (string) ob_get_clean();
}

/**
 * Append the spoke backlink block to the content of mapped spoke pages.
 *
 * Guarded so it only runs on the public main singular query — never in admin, feeds,
 * REST, or secondary loops. Idempotent because the block is rendered, not stored.
 *
 * @param string $content Post content.
 * @return string
 */
function justice_theme_append_cluster_backlink( string $content ): string {
	if ( is_admin() || ! is_singular() || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$block = justice_theme_render_cluster_backlink( get_the_ID() );
	if ( '' === $block ) {
		return $content;
	}

	return $content . $block;
}
add_filter( 'the_content', 'justice_theme_append_cluster_backlink', 20 );
