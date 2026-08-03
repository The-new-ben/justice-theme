<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

function add_filter( ...$args ): void {}
function add_action( ...$args ): void {}
function post_type_exists( $type ): bool {
	return true;
}

require_once dirname( __DIR__ ) . '/justice-ops/professional-cards.php';

if ( array() !== justice_cards_lawyers( array( 'real-estate' ), 2 ) ) {
	throw new RuntimeException( 'Missing public-approval helper did not fail closed.' );
}

echo "professional cards missing-approval-helper test passed\n";
