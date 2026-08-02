<?php
/**
 * Prove that an owner-held lead exits before selection, AI, billing or mail.
 */

declare(strict_types=1);

define( 'ABSPATH', __DIR__ );

$jt_hold_updates = array();

function add_action( ...$args ): void {}
function get_post_type( int $post_id ): string { return 'justice_lead'; }
function get_post_meta( int $post_id, string $key, bool $single = false ) {
	return 'routing_hold' === $key ? '1' : '';
}
function update_post_meta( int $post_id, string $key, $value ): void {
	global $jt_hold_updates;
	$jt_hold_updates[ $key ] = $value;
}
function justice_cards_family_map(): array { throw new RuntimeException( 'candidate map must not run' ); }
function justice_cards_lawyers( $term, $limit ): array { throw new RuntimeException( 'candidate selection must not run' ); }
function justice_ai_chat( $messages, $options ): string { throw new RuntimeException( 'AI must not run' ); }
function wp_mail( ...$args ): bool { throw new RuntimeException( 'mail must not run' ); }

require_once dirname( __DIR__ ) . '/justice-ops/lead-router.php';

$result = justice_router_route_lead( 42 );

if (
	array( 'ok' => false, 'why' => 'routing is on owner hold' ) !== $result
	|| 'held_for_owner' !== ( $jt_hold_updates['lead_routing_status'] ?? '' )
) {
	fwrite( STDERR, "FAIL: held lead did not exit with the expected state\n" );
	exit( 1 );
}

fwrite( STDOUT, "PASS held lead exits before selection, AI, billing and mail\n" );
