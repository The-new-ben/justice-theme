<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

function add_action( $tag, $callback, $priority = 10 ): void {}

require_once dirname( __DIR__ ) . '/justice-ops/legacy-redirects.php';

foreach ( justice_legacy_redirect_map() as $source => $target ) {
	if ( $source === $target ) {
		throw new RuntimeException( 'Self redirect remains: ' . $source );
	}
}

if ( '' !== justice_legacy_redirect_target( '/recommended-jus-tice-team-lawyer/' ) ) {
	throw new RuntimeException( 'The known self-loop still resolves to a redirect target.' );
}

echo "legacy redirect tests passed\n";
