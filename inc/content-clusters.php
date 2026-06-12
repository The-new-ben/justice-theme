<?php
/**
 * Content cluster map — the single source of truth for hub-and-spoke topology.
 *
 * Built from the live GSC pull on 2026-06-09 (16-month window: 2025-02-09 → 2026-06-09).
 * 8,064,552 impressions, 40,059 clicks (0.50% sitewide CTR), 51,548 distinct queries,
 * 8,414 cannibalized queries (16%). Source files:
 *   reports/gsc-live-2026-06-09/{pages,queries,query-page}.csv
 *   project-control/gsc-strict-2026-06-09/STRICT_CANNIBALIZATION.md
 *   project-control/gsc-strict-2026-06-09/pillars-from-gsc.json
 *
 * Rules used to pick pillars (strict):
 *   1. Pillar candidate = clean root English slug that WINS >=3 distinct cannibalized
 *      queries with >=100 total impressions.
 *   2. Winner per query = max clicks → min avg position → max impressions.
 *   3. Manual overrides applied where the GSC auto-winner is a tool/calculator or a
 *      cannibalizing page rather than the true navigational hub. Each override is
 *      documented inline.
 *
 * Rendering (no DB writes, no plugin):
 *   - Spoke pages get an automatic "part of guide → pillar + see also siblings" block
 *     appended at render time via the_content (idempotent: rendered, never stored).
 *   - Breadcrumbs insert the pillar as a parent crumb so the BreadcrumbList schema
 *     reflects the real hierarchy.
 *   - Anchor text is resolved live from each target's real post title (never invented).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The authoritative hub-and-spoke map.
 *
 * One parent per spoke (anti-cannibalization). Sibling links come from the same array.
 *
 * @return array<string,array{pillar:string,label:string,spokes:string[]}>
 */
function justice_theme_content_clusters(): array {
	return array(

		// ─── FAMILY / DIVORCE ────────────────────────────────────────────────────────
		// GSC top-impression URLs: /free-divorce-agreement-template/ (66,626 imp · 88 wins),
		// /divorce-costs-2025/ (26,464 · 47), /lawyer-divorce/ (19,620 · 12),
		// /joint-custody-shared-parenting/ (18,681 · 40), /mutual-divorce-agreement-2025/ (16,955 · 32).
		// Override: pillar = /divorce-lawyer/ (navigational hub). The tool /free-divorce-agreement-template/
		// is the top spoke, not the pillar, because it converts on transactional intent rather than nav.
		'family-law' => array(
			'pillar' => 'divorce-lawyer',
			'label'  => 'המדריך לעורך דין גירושין ודיני משפחה',
			'spokes' => array(
				'free-divorce-agreement-template',
				'divorce-costs-2025',
				'lawyer-divorce',
				'joint-custody-shared-parenting',
				'mutual-divorce-agreement-2025',
				'child-custody-modification',
				'living-apart-together-legal-rights',
				'divorce-mediation-basics',
				'cohabitation-property-rights-for-unmarried-couples',
				'how-much-does-a-divorce-agreement-cost',
				'what-is-child-custody',
				'trusted-divorce-attorney-guide',
				'strategic-divorce-cost-planning',
				'request-for-family-dispute-settlements',
				// Added 2026-06-12 from live GSC per-query cannibalization check.
				'lawyer-divorce-israel',
				'lawyer-divorce-guide-proceedings-costs-rights',
				'the-recommended-family-lawyers',
			),
		),

		// ─── CRIMINAL ────────────────────────────────────────────────────────────────
		// Pillar confirmed by GSC: /criminal-defense-attorney/ wins 149 queries · 71,554 imp.
		'criminal-law' => array(
			'pillar' => 'criminal-defense-attorney',
			'label'  => 'המדריך לעורך דין פלילי',
			'spokes' => array(
				'police-records-data-deletion',                 // 53,731 imp · 60 wins
				'drug-related-crime',                           // 41,346 imp · 35 wins
				'sex-crime-lawyer',                             // 31,331 imp · 52 wins
				'how-much-will-a-criminal-defense-lawyer-cost', // 23,678 imp · 51 wins · 162 clicks
				'drug-trafficking',                             // 16,887 imp · 28 wins
				'sexual-offenses',
				'tax-investigation-guide',
				'apply-for-police-criminal-information-certificates',
				'what-is-money-laundering',
				'economic-crimes-white-collar-lawyer',
				'famous-criminal-defense-lawyer',
				'leading-criminal-law-firm',
				'lawyer-near-me-criminal-law',
				// Added 2026-06-12 from live GSC per-query cannibalization check: these
				// pages compete with the pillar for the head terms; as mapped spokes they
				// now link INTO the hub instead of fighting it.
				'best-criminal-defence-lawyers-worldwide',
				'top-criminal-lawyer-tel-aviv',
				'criminal-defenses',
			),
		),

		// ─── REAL ESTATE ─────────────────────────────────────────────────────────────
		// Pillar confirmed by GSC: /real-estate-attorney/ wins 162 queries · 115,258 imp
		// (the strongest pillar on the whole site).
		'real-estate' => array(
			'pillar' => 'real-estate-attorney',
			'label'  => 'המדריך לעורך דין מקרקעין',
			'spokes' => array(
				'lawyer-for-buying-or-selling-a-house',  // 53,738 imp · 76 wins
				'real-estate-lawyer-guide',
				'registration-of-real-estate-israel',
				'land-appreciation-tax',
				'real-estate-lawyer-cost-2025',
				'real-estate-appraiser',
				'marital-property-agreement',
				'spouse-property-registration-guide',
			),
		),

		// ─── MEDICAL MALPRACTICE ─────────────────────────────────────────────────────
		// Override: GSC auto-winner was /medical-institute-for-road-safety/ (a marvad/road-fitness
		// page leaking into malpractice queries — textbook cannibalization). Correct pillar is
		// /medical-malpractice-lawyer/ (50 wins · 18,448 imp).
		'medical-malpractice' => array(
			'pillar' => 'medical-malpractice-lawyer',
			'label'  => 'המדריך לרשלנות רפואית',
			'spokes' => array(
				'medical-malpractice-in-the-united-states',
				'medical-malpractice-common-errors-doctors-hospitals',
				'anesthesia-medical-malpractice',
				'cerebral-palsy',
				'malpractice-cerebral-palsy',
				'what-is-medical-malpractice-definition-examples',
			),
		),

		// ─── PERSONAL INJURY ─────────────────────────────────────────────────────────
		'personal-injury' => array(
			'pillar' => 'personal-injury-law',
			'label'  => 'המדריך לנזיקין ותאונות',
			'spokes' => array(
				'punishment-for-offenses-of-causing-death-in-road-accidents',
				'israel-road-accident-compensation-law',
				'tort-lawyer',
				'how-much-does-a-lawyer-cost',
				'car-accident-auto-injury-lawyer',
			),
		),

		// ─── TRAFFIC ─────────────────────────────────────────────────────────────────
		// Override: GSC auto-winner was /japan-attorneys/ because Hebrew traffic queries leaked
		// into that page — one of the clearest cannibalization signals in the dataset. The page
		// that SHOULD rank for "עורך דין תעבורה" is /traffic-lawyer/.
		'traffic-law' => array(
			'pillar' => 'traffic-lawyer',
			'label'  => 'המדריך לעורך דין תעבורה',
			'spokes' => array(
				'speeding',
				'driving-under-the-influence',
				'dui-refusal-blood-breath-urine-test',
				'driving-under-the-influence-of-drugs',
				'driver-with-36-valid-points-or-more-will-be-disqualified-from-holding-a-drivers-license',
			),
		),

		// ─── EMPLOYMENT ──────────────────────────────────────────────────────────────
		// Override: GSC auto-winner was /immigration-lawyer/ (foreign-worker queries leaking).
		// Correct pillar is /labor-lawyer/ (27 wins · 9,829 imp). Immigration now has its own cluster.
		'employment' => array(
			'pillar' => 'labor-lawyer',
			'label'  => 'המדריך לדיני עבודה',
			'spokes' => array(
				'lawyer-fee-outlook',
				'employment-contract',
				'employer-worker-relationship',
				'israeli-labor-law',
				'uk-lawyer',
			),
		),

		// ─── INHERITANCE / WILLS ─────────────────────────────────────────────────────
		// Override: GSC auto-winner was /what-is-a-probate-order/ (informational). We set
		// /inheritance-lawyer/ as the navigational pillar; probate-order becomes top spoke.
		'inheritance' => array(
			'pillar' => 'inheritance-lawyer',
			'label'  => 'המדריך לירושה וצוואות',
			'spokes' => array(
				'what-is-a-probate-order',
				'international-inheritance-wills-lawyer',
				'will-probate-objection',
				'inheritance',
				'inheritance-order',
				'will-and-testament',
				'revocation-of-a-will-and-reviving-previous-will',
				'maximize-an-inheritance',
			),
		),

		// ─── IMMIGRATION / VISAS / PASSPORTS (new cluster surfaced by GSC) ───────────
		// Real Israeli demand: golden visa, passport restoration, relocation. Big numbers
		// the previous map missed entirely.
		'immigration' => array(
			'pillar' => 'immigration-lawyer',
			'label'  => 'המדריך להגירה, אזרחות ויזות',
			'spokes' => array(
				'german-passport',       // 20,880 imp · 33 wins
				'golden-visa',           // 13,497 imp · 47 wins
				'portugal-relocation',   //  9,071 imp · 21 wins
				'romanian-passport',     //  8,880 imp · 20 wins
				'germany-lawyers',
			),
		),

		// ─── INTERNATIONAL REAL ESTATE (new cluster surfaced by GSC) ─────────────────
		// Israelis buying property abroad — Portugal/Greece/Cyprus. ~100k+ impressions.
		'international-real-estate' => array(
			'pillar' => 'buying-property-abroad-guide',
			'label'  => 'מדריך לרכישת נכסים בחו״ל',
			'spokes' => array(
				'buying-property-in-portugal',                       // 36,218 imp · 50 wins
				'buying-property-in-greece',                         // 27,606 imp · 54 wins
				'greece-price-list',                                 // 24,740 imp · 76 wins
				'avoiding-mistakes-when-buying-property-in-cyprus',  // 22,035 imp · 63 wins
				'cyprus-lawyer',
				'portugal-lawyers',
				'italy-lawyers',
				'israel-notary-public',
			),
		),

		// ─── TAX (international + returning resident) ───────────────────────────────
		'tax' => array(
			'pillar' => 'real-estate-tax-advisor',
			'label'  => 'המדריך למיסוי בינלאומי וישראלי',
			'spokes' => array(
				'returning-resident-rights-determining-tax-rate',
				'top-global-tax-cpa-firms',
				'top-international-tax-law-firms',
				'israel-tax-authority',
				'legal-tax-saving-guide',
			),
		),
	);
}

/* ----------------------------------------------------------------------- *
 *   Pure helpers — read the map, resolve live data, render the block.     *
 * ----------------------------------------------------------------------- */

function justice_theme_cluster_post_slug( int $post_id ): string {
	return strtolower( trim( (string) get_post_field( 'post_name', $post_id ) ) );
}

function justice_theme_cluster_for_slug( string $slug ): ?array {
	$slug = strtolower( trim( $slug ) );
	if ( '' === $slug ) {
		return null;
	}
	foreach ( justice_theme_content_clusters() as $key => $c ) {
		if ( $c['pillar'] === $slug ) {
			return array_merge( $c, array( 'key' => $key, 'role' => 'pillar' ) );
		}
		if ( in_array( $slug, $c['spokes'], true ) ) {
			return array_merge( $c, array( 'key' => $key, 'role' => 'spoke' ) );
		}
	}
	return null;
}

function justice_theme_cluster_resolve_target( string $slug ): ?array {
	$slug = strtolower( trim( $slug ) );
	if ( '' === $slug ) {
		return null;
	}
	$pts = array();
	foreach ( array( 'articles', 'page', 'post' ) as $pt ) {
		if ( post_type_exists( $pt ) ) {
			$pts[] = $pt;
		}
	}
	if ( empty( $pts ) ) {
		$pts = array( 'post' );
	}
	$post = get_page_by_path( $slug, OBJECT, $pts );
	if ( $post instanceof WP_Post && 'publish' === get_post_status( $post ) ) {
		$url = function_exists( 'justice_theme_public_permalink' )
			? justice_theme_public_permalink( $post->ID )
			: get_permalink( $post->ID );
		return array( 'url' => (string) $url, 'title' => get_the_title( $post->ID ) );
	}
	return null;
}

function justice_theme_cluster_pillar_crumb( int $post_id ): ?array {
	$c = justice_theme_cluster_for_slug( justice_theme_cluster_post_slug( $post_id ) );
	if ( ! $c || 'spoke' !== $c['role'] ) {
		return null;
	}

	// Only emit a crumb when the pillar resolves to a LIVE published page.
	// A slug-built fallback URL would 404 when the pillar page does not exist
	// (e.g. planned-but-unbuilt hubs) — never link to a dead URL.
	$p = justice_theme_cluster_resolve_target( $c['pillar'] );
	if ( ! $p ) {
		return null;
	}

	return array(
		'name' => $p['title'],
		'url'  => $p['url'],
	);
}

function justice_theme_cluster_siblings( string $slug, int $limit = 3 ): array {
	$c = justice_theme_cluster_for_slug( $slug );
	if ( ! $c || 'spoke' !== $c['role'] ) {
		return array();
	}
	$siblings = array_values( array_filter( $c['spokes'], static function ( string $s ) use ( $slug ): bool {
		return $s !== strtolower( trim( $slug ) );
	} ) );
	return array_slice( $siblings, 0, max( 0, $limit ) );
}

function justice_theme_render_cluster_backlink( int $post_id ): string {
	$slug = justice_theme_cluster_post_slug( $post_id );
	$c    = justice_theme_cluster_for_slug( $slug );
	if ( ! $c || 'spoke' !== $c['role'] ) {
		return '';
	}

	// Resolve the pillar to a LIVE page only; a slug-built URL could 404 when the
	// hub page has not been created yet. With no live pillar we still show resolving
	// siblings, but never a dead parent link.
	$p = justice_theme_cluster_resolve_target( $c['pillar'] );

	$sib_links = array();
	foreach ( justice_theme_cluster_siblings( $slug, 3 ) as $s ) {
		$r = justice_theme_cluster_resolve_target( $s );
		if ( $r ) {
			$sib_links[] = sprintf( '<a href="%s">%s</a>', esc_url( $r['url'] ), esc_html( $r['title'] ) );
		}
	}

	// Nothing resolvable at all: emit nothing rather than an empty frame.
	if ( ! $p && empty( $sib_links ) ) {
		return '';
	}

	ob_start();
	?>
	<aside class="cluster-backlink" data-cluster="<?php echo esc_attr( $c['key'] ); ?>" aria-label="<?php esc_attr_e( 'ניווט באשכול התוכן', 'justice-theme' ); ?>">
		<?php if ( $p ) : ?>
			<p class="cluster-backlink__parent">
				<strong><?php esc_html_e( 'חלק מהמדריך:', 'justice-theme' ); ?></strong>
				<a href="<?php echo esc_url( $p['url'] ); ?>"><?php echo esc_html( $p['title'] ); ?></a>
			</p>
		<?php endif; ?>
		<?php if ( ! empty( $sib_links ) ) : ?>
			<p class="cluster-backlink__siblings">
				<strong><?php esc_html_e( 'ראו גם באותו נושא:', 'justice-theme' ); ?></strong>
				<?php echo wp_kses_post( implode( ' · ', $sib_links ) ); ?>
			</p>
		<?php endif; ?>
	</aside>
	<?php
	return (string) ob_get_clean();
}

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

/* ----------------------------------------------------------------------- *
 *   Navigation + footer items — ONE source so menu, footer, breadcrumbs   *
 *   and spoke links all reflect the same cluster map automatically.       *
 * ----------------------------------------------------------------------- */

/**
 * Short Hebrew label + directory-area fallback per cluster.
 * The area slug is used to build a /lawyers/?area=… URL that always exists,
 * so a cluster whose pillar page is not live still links somewhere real
 * (never a 404 / "evil URL").
 *
 * @return array<string,array{label:string,area:string}>
 */
function justice_theme_cluster_nav_meta(): array {
	return array(
		'family-law'               => array( 'label' => 'דיני משפחה וגירושין', 'area' => 'family-law' ),
		'criminal-law'             => array( 'label' => 'משפט פלילי', 'area' => 'criminal-law' ),
		'real-estate'              => array( 'label' => 'מקרקעין ונדל״ן', 'area' => 'real-estate-law' ),
		'medical-malpractice'      => array( 'label' => 'רשלנות רפואית', 'area' => 'medical-malpractice-law' ),
		'personal-injury'          => array( 'label' => 'נזיקין ותאונות', 'area' => 'personal-injury-law' ),
		'traffic-law'              => array( 'label' => 'דיני תעבורה', 'area' => 'traffic-law' ),
		'employment'               => array( 'label' => 'דיני עבודה', 'area' => 'labor-law' ),
		'inheritance'              => array( 'label' => 'ירושה וצוואות', 'area' => 'inheritance-law' ),
		'immigration'              => array( 'label' => 'הגירה ואזרחות', 'area' => 'immigration-law' ),
		'international-real-estate' => array( 'label' => 'נדל״ן בחו״ל', 'area' => 'real-estate-law' ),
		'tax'                      => array( 'label' => 'מיסוי', 'area' => 'tax-law' ),
	);
}

/**
 * Resolved, deduplicated nav items for every cluster pillar.
 * URL priority: live pillar permalink → /lawyers/?area=… fallback → skip (no 404).
 *
 * @return array<int,array{key:string,label:string,url:string,is_pillar:bool}>
 */
function justice_theme_cluster_nav_items(): array {
	$meta  = justice_theme_cluster_nav_meta();
	$items = array();

	foreach ( justice_theme_content_clusters() as $key => $c ) {
		$label = isset( $meta[ $key ]['label'] ) ? $meta[ $key ]['label'] : $c['label'];
		$area  = isset( $meta[ $key ]['area'] ) ? $meta[ $key ]['area'] : '';

		$resolved = justice_theme_cluster_resolve_target( $c['pillar'] );

		if ( $resolved ) {
			$url       = $resolved['url'];
			$is_pillar = true;
		} elseif ( '' !== $area ) {
			$base = (string) get_post_type_archive_link( 'justice_lawyer' );
			if ( ! $base ) {
				$base = home_url( '/lawyers/' );
			}
			$url       = function_exists( 'justice_theme_public_url' )
				? justice_theme_public_url( add_query_arg( 'area', $area, $base ) )
				: add_query_arg( 'area', $area, $base );
			$is_pillar = false;
		} else {
			continue; // No live pillar and no directory fallback: do not emit a broken link.
		}

		$items[] = array(
			'key'       => $key,
			'label'     => $label,
			'url'       => $url,
			'is_pillar' => $is_pillar,
		);
	}

	return $items;
}
