<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

function add_action( ...$args ): void {}
function __( $text, $domain = '' ): string { return (string) $text; }
function wp_unslash( $value ) { return $value; }
function sanitize_text_field( $value ): string { return trim( strip_tags( (string) $value ) ); }
function sanitize_key( $value ): string {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) ?? '' );
}
function esc_attr( $value ): string { return htmlspecialchars( (string) $value, ENT_QUOTES, 'UTF-8' ); }
function home_url( $path = '' ): string { return 'https://jus-tice.co.il' . $path; }
function add_query_arg( array $args, string $url ): string {
	$fragment = parse_url( $url, PHP_URL_FRAGMENT );
	$base     = preg_replace( '/#.*$/', '', $url ) ?? $url;
	$joiner   = false === strpos( $base, '?' ) ? '?' : '&';
	$result   = $base . $joiner . http_build_query( $args, '', '&', PHP_QUERY_RFC3986 );

	return $fragment ? $result . '#' . $fragment : $result;
}

require_once dirname( __DIR__ ) . '/inc/product-handoff-attribution.php';
require_once dirname( __DIR__ ) . '/inc/lead-spam-guard.php';

function jt_product_handoff_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$journey = 'jf-123e4567-e89b-12d3-a456-426614174000';
jt_product_handoff_assert( $journey === justice_theme_sanitize_product_journey_id( strtoupper( $journey ) ), 'Valid opaque journey ID was not normalized.' );
jt_product_handoff_assert( '' === justice_theme_sanitize_product_journey_id( 'matter-client-0500000000' ), 'Matter or contact content passed the journey gate.' );
jt_product_handoff_assert( 'criminal-law' === justice_theme_sanitize_product_handoff_cluster( 'criminal-law' ), 'Known GSC cluster was rejected.' );
jt_product_handoff_assert( '' === justice_theme_sanitize_product_handoff_cluster( 'client-0500000000' ), 'Unknown cluster content passed the allow-list.' );
jt_product_handoff_assert( 11 === count( justice_theme_product_handoff_clusters() ), 'The product attribution vocabulary no longer matches all 11 GSC clusters.' );
$owner_map = justice_theme_product_handoff_cluster_owners();
jt_product_handoff_assert( 11 === count( array_unique( array_values( $owner_map ) ) ), 'Two product clusters share an SEO owner URL.' );
jt_product_handoff_assert( '/criminal-defense-attorney/' === justice_theme_product_handoff_owner_path( 'criminal-law' ), 'Criminal attribution received the wrong SEO owner.' );
jt_product_handoff_assert( '' === justice_theme_product_handoff_owner_path( 'client-0500000000' ), 'Unknown cluster received an SEO owner.' );
$scenario_map = justice_theme_product_handoff_cluster_scenarios();
jt_product_handoff_assert( 11 === count( $scenario_map ), 'Product scenario contract no longer covers all 11 clusters.' );
jt_product_handoff_assert( 11 === count( array_unique( array_values( $scenario_map ) ) ), 'Product scenario contract is not uniquely attributable.' );
jt_product_handoff_assert( 'investigation-rehearsal' === justice_theme_sanitize_product_handoff_scenario( 'investigation-rehearsal', 'criminal-law' ), 'Canonical criminal scenario was rejected.' );
jt_product_handoff_assert( '' === justice_theme_sanitize_product_handoff_scenario( 'mediation-preparation', 'criminal-law' ), 'A scenario crossed into the wrong cluster.' );
jt_product_handoff_assert( '' === justice_theme_sanitize_product_handoff_scenario( 'client-0500000000', 'criminal-law' ), 'User content passed the scenario allow-list.' );

$new_stages = justice_theme_product_handoff_stage_flags( 'new', 'not_started' );
jt_product_handoff_assert( ! array_filter( $new_stages ), 'A new untouched lead was counted as a downstream result.' );
$accepted_stages = justice_theme_product_handoff_stage_flags( 'accepted', 'consult_scheduled' );
jt_product_handoff_assert( $accepted_stages['qualified'] && $accepted_stages['accepted'] && ! $accepted_stages['closed'] && ! $accepted_stages['won'], 'Accepted cumulative stages are wrong.' );
$won_stages = justice_theme_product_handoff_stage_flags( 'converted', 'won' );
jt_product_handoff_assert( $won_stages['qualified'] && $won_stages['accepted'] && $won_stages['closed'] && $won_stages['won'], 'Won lead does not satisfy all cumulative stages.' );
$rejected_stages = justice_theme_product_handoff_stage_flags( 'rejected', 'not_qualified' );
jt_product_handoff_assert( ! $rejected_stages['qualified'] && ! $rejected_stages['accepted'] && $rejected_stages['closed'] && ! $rejected_stages['won'], 'Rejected lead polluted the qualified or won funnel.' );

$_GET = array(
	'source'       => 'juris-arena',
	'journey_id'   => $journey,
	'cluster'      => 'criminal-law',
	'scenario'     => 'investigation-rehearsal',
	'utm_source'   => 'jus-tice.com',
	'utm_medium'   => 'product_handoff',
	'utm_campaign' => 'professional_review',
);

jt_product_handoff_assert( justice_theme_is_current_juris_handoff(), 'Valid JURIS handoff was not recognized.' );
$profile_url = justice_theme_append_current_product_handoff_args( 'https://jus-tice.co.il/lawyers/example/' );
jt_product_handoff_assert( false !== strpos( $profile_url, 'journey_id=' . rawurlencode( $journey ) ), 'Profile navigation lost the opaque journey.' );
jt_product_handoff_assert( false !== strpos( $profile_url, 'cluster=criminal-law' ), 'Profile navigation lost the allow-listed cluster.' );
jt_product_handoff_assert( false !== strpos( $profile_url, 'scenario=investigation-rehearsal' ), 'Profile navigation lost the allow-listed scenario.' );
jt_product_handoff_assert( false === strpos( $profile_url, 'matter' ), 'A Matter dimension appeared in the public handoff.' );

$_GET['utm_campaign'] = 'client-0500000000';
$_GET['source_keyword'] = 'juris-professional-review';
$canonical_url        = justice_theme_append_current_product_handoff_args( 'https://jus-tice.co.il/lawyers/example/' );
jt_product_handoff_assert( false !== strpos( $canonical_url, 'utm_campaign=professional_review' ), 'Product UTM was not canonicalized.' );
jt_product_handoff_assert( false === strpos( $canonical_url, '0500000000' ), 'User-controlled UTM content leaked into the product handoff.' );
ob_start();
justice_theme_render_lead_attribution_fields();
$hidden_fields = (string) ob_get_clean();
jt_product_handoff_assert( false !== strpos( $hidden_fields, 'name="utm_campaign" value="professional_review"' ), 'Lead form did not canonicalize the product campaign.' );
jt_product_handoff_assert( false !== strpos( $hidden_fields, 'name="product_origin_scenario" value="investigation-rehearsal"' ), 'Lead form lost the canonical product scenario.' );
jt_product_handoff_assert( false === strpos( $hidden_fields, '0500000000' ), 'User-controlled UTM content leaked into hidden lead fields.' );

$lead_url = justice_theme_ask_lawyer_fallback_url(
	array_merge(
		justice_theme_current_product_handoff_args(),
		array( 'lead_area' => 'criminal-law' )
	)
);
jt_product_handoff_assert( false !== strpos( $lead_url, 'lead_source_surface=juris_professional_review' ), 'Lead form lost the product source surface.' );
jt_product_handoff_assert( false !== strpos( $lead_url, 'lead_area=criminal-law' ), 'Lead form lost the safe legal-area prefill.' );
jt_product_handoff_assert( false !== strpos( $lead_url, 'scenario=investigation-rehearsal' ), 'Lead form URL lost the canonical scenario.' );
jt_product_handoff_assert( str_ends_with( $lead_url, '#ask-lawyer' ), 'Product CTA no longer lands on the consented lead form.' );

$_GET['source'] = 'spoofed';
jt_product_handoff_assert( ! justice_theme_is_current_juris_handoff(), 'Journey ID without the exact product source was trusted.' );
jt_product_handoff_assert( array() === justice_theme_current_product_handoff_args(), 'Spoofed source retained product attribution.' );

$core_source = file_get_contents( dirname( __DIR__ ) . '/justice-core/includes/lead-submissions.php' );
jt_product_handoff_assert( false !== strpos( $core_source, "'product_journey_id'" ), 'Lead handler does not register the product journey.' );
jt_product_handoff_assert( false !== strpos( $core_source, "'product_origin_scenario'" ), 'Lead handler does not register the product scenario.' );
jt_product_handoff_assert( false !== strpos( $core_source, "'justice_juris_handoff'" ), 'Lead handler does not stamp the product source system.' );

echo "product handoff attribution tests passed\n";
