<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

$jt_product_report_meta = array(
	1 => array(
		'product_journey_id'                    => 'jf-123e4567-e89b-12d3-a456-426614174001',
		'product_origin_cluster'                 => 'criminal-law',
		'product_origin_scenario'                => 'investigation-rehearsal',
		'product_handoff_source'                 => 'juris-arena',
		'consent'                                => '1',
		'lead_status'                            => 'accepted',
		'follow_up_status'                       => 'consult_scheduled',
		'qualified_lead_billing_status'          => 'not_ready',
		'qualified_lead_payment_evidence_url'    => '',
		'suggested_lead_price_ils'               => '0',
	),
	2 => array(
		'product_journey_id'                    => 'jf-123e4567-e89b-12d3-a456-426614174002',
		'product_origin_cluster'                 => 'criminal-law',
		'product_origin_scenario'                => 'investigation-rehearsal',
		'product_handoff_source'                 => 'juris-arena',
		'consent'                                => '1',
		'lead_status'                            => 'converted',
		'follow_up_status'                       => 'won',
		'qualified_lead_billing_status'          => 'paid',
		'qualified_lead_payment_evidence_url'    => 'https://payments.example/evidence/2',
		'suggested_lead_price_ils'               => '500',
	),
	3 => array(
		'product_journey_id'                    => 'jf-123e4567-e89b-12d3-a456-426614174003',
		'product_origin_cluster'                 => 'not-an-allowed-cluster',
		'product_origin_scenario'                => 'client-0500000000',
		'product_handoff_source'                 => 'juris-arena',
		'consent'                                => '1',
		'lead_status'                            => 'new',
		'follow_up_status'                       => 'not_started',
		'qualified_lead_billing_status'          => 'paid',
		'qualified_lead_payment_evidence_url'    => '',
		'suggested_lead_price_ils'               => '900',
	),
	4 => array(
		'product_journey_id'                    => 'matter-client-0500000000',
		'product_origin_cluster'                 => 'family-law',
		'product_handoff_source'                 => 'juris-arena',
		'consent'                                => '1',
		'lead_status'                            => 'converted',
		'follow_up_status'                       => 'won',
		'qualified_lead_billing_status'          => 'paid',
		'qualified_lead_payment_evidence_url'    => 'https://payments.example/evidence/4',
		'suggested_lead_price_ils'               => '1000',
	),
	5 => array(
		'product_journey_id'                    => 'jf-123e4567-e89b-12d3-a456-426614174005',
		'product_origin_cluster'                 => 'family-law',
		'product_handoff_source'                 => 'juris-arena',
		'consent'                                => '0',
		'lead_status'                            => 'converted',
		'follow_up_status'                       => 'won',
		'qualified_lead_billing_status'          => 'paid',
		'qualified_lead_payment_evidence_url'    => 'https://payments.example/evidence/5',
		'suggested_lead_price_ils'               => '1000',
	),
);

function add_action( ...$args ): void {}
function add_filter( ...$args ): void {}
function __( $text, $domain = '' ): string { return (string) $text; }
function wp_unslash( $value ) { return $value; }
function sanitize_text_field( $value ): string { return trim( strip_tags( (string) $value ) ); }
function sanitize_key( $value ): string {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) ?? '' );
}
function absint( $value ): int { return abs( (int) $value ); }
function post_type_exists( $post_type ): bool { return 'justice_lead' === $post_type; }
function get_post_meta( $post_id, $key = '', $single = false ) {
	global $jt_product_report_meta;

	if ( '' === $key ) {
		return $jt_product_report_meta[ (int) $post_id ] ?? array();
	}

	return $jt_product_report_meta[ (int) $post_id ][ (string) $key ] ?? '';
}

class WP_Query {
	/** @var int[] */
	public $posts;

	public function __construct( array $args = array() ) {
		global $jt_product_report_meta;

		$this->posts = array();
		foreach ( $jt_product_report_meta as $post_id => $meta ) {
			if ( 'juris-arena' === ( $meta['product_handoff_source'] ?? '' ) ) {
				$this->posts[] = (int) $post_id;
			}
		}
	}
}

require_once dirname( __DIR__ ) . '/inc/product-handoff-attribution.php';
require_once dirname( __DIR__ ) . '/inc/lead-crm.php';

function jt_product_report_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$snapshot = justice_theme_crm_product_handoff_snapshot();

jt_product_report_assert( 3 === $snapshot['submitted'], 'Invalid or unconsented journeys polluted submitted leads.' );
jt_product_report_assert( 2 === $snapshot['qualified'], 'Qualified count does not follow CRM disposition.' );
jt_product_report_assert( 2 === $snapshot['accepted'], 'Accepted count does not follow CRM disposition.' );
jt_product_report_assert( 1 === $snapshot['closed'], 'Closed count does not follow cumulative funnel rules.' );
jt_product_report_assert( 1 === $snapshot['won'], 'Won count does not follow CRM disposition.' );
jt_product_report_assert( 1 === $snapshot['collected_count'], 'Paid leads without evidence polluted collected revenue.' );
jt_product_report_assert( 500 === $snapshot['collected_value'], 'Collected revenue does not equal evidence-backed value.' );
jt_product_report_assert( 12 === count( $snapshot['by_cluster'] ), 'Report must expose 11 fixed clusters plus Unattributed.' );
jt_product_report_assert( 12 === count( $snapshot['by_scenario'] ), 'Scenario report must expose 11 fixed scenarios plus Unattributed.' );

$criminal = $snapshot['by_cluster']['criminal-law'];
jt_product_report_assert( '/criminal-defense-attorney/' === $criminal['owner_path'], 'Criminal row has the wrong canonical owner.' );
jt_product_report_assert( 2 === $criminal['submitted'], 'Criminal submitted count is wrong.' );
jt_product_report_assert( 2 === $criminal['qualified'], 'Criminal qualified count is wrong.' );
jt_product_report_assert( 1 === $criminal['won'], 'Criminal won count is wrong.' );
jt_product_report_assert( 500 === $criminal['collected_value'], 'Criminal collected value is wrong.' );

$criminal_scenario = $snapshot['by_scenario']['investigation-rehearsal'];
jt_product_report_assert( 'criminal-law' === $criminal_scenario['cluster'], 'Criminal scenario has the wrong cluster.' );
jt_product_report_assert( 2 === $criminal_scenario['submitted'], 'Criminal scenario submitted count is wrong.' );
jt_product_report_assert( 1 === $criminal_scenario['won'], 'Criminal scenario won count is wrong.' );
jt_product_report_assert( 500 === $criminal_scenario['collected_value'], 'Criminal scenario collected value is wrong.' );

$unattributed = $snapshot['by_cluster']['unattributed'];
jt_product_report_assert( '' === $unattributed['owner_path'], 'Unattributed traffic was assigned an SEO owner.' );
jt_product_report_assert( 1 === $unattributed['submitted'], 'Unknown cluster was not isolated as Unattributed.' );
jt_product_report_assert( 0 === $snapshot['by_cluster']['family-law']['submitted'], 'Rejected journeys polluted a valid cluster.' );

echo "product handoff report tests passed\n";
