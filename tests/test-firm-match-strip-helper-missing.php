<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

function add_filter( ...$args ): void {}
function add_action( ...$args ): void {}
function get_posts( $args ): array {
	return array( 101 );
}
function justice_theme_lawyer_profile_is_public_approved( $id ): bool {
	return true;
}
function get_the_ID(): int {
	return 500;
}

require_once dirname( __DIR__ ) . '/justice-ops/firm-match-strip.php';

if ( array() !== justice_fms_pick_firms( array( 7 ) ) ) {
	throw new RuntimeException( 'Missing sponsorship truth helper did not fail closed.' );
}

echo "firm match missing-helper test passed\n";
