<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

$jt_title_actions = array();

function add_action( $tag, $callback, $priority = 10 ): void {
	global $jt_title_actions;
	$jt_title_actions[ $tag ][ $priority ] = $callback;
}
function wp_strip_all_tags( $value ): string {
	return strip_tags( (string) $value );
}
function wp_json_encode( $value, $flags = 0 ) {
	return json_encode( $value, $flags );
}
function is_admin(): bool {
	return false;
}
function is_feed(): bool {
	return false;
}
function wp_is_json_request(): bool {
	return false;
}
function wp_get_document_title(): string {
	return 'מחירי דירות בקפריסין 2026 | Jus-Tice';
}

require_once dirname( __DIR__ ) . '/justice-ops/title-stability.php';

function jt_title_stability_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$script = justice_ops_title_stability_script( '<b>מחירי דירות בקפריסין 2026</b> | Jus-Tice' );
jt_title_stability_assert( false !== strpos( $script, 'מחירי דירות בקפריסין 2026 | Jus-Tice' ), 'Canonical server title was not captured.' );
jt_title_stability_assert( false !== strpos( $script, 'הודעה חדשה|הודעות חדשות|new message|new messages' ), 'Narrow chat-notification matcher is missing.' );
jt_title_stability_assert( false !== strpos( $script, 'current!==canonical&&notice.test(current)' ), 'Restore is not gated by the notification matcher.' );
jt_title_stability_assert( false !== strpos( $script, 'MutationObserver' ), 'Late title mutations are not observed.' );
jt_title_stability_assert( false === strpos( $script, 'Tawk_API.hideWidget' ) && false === strpos( $script, 'document.title=' . 'current' ), 'Chat or legitimate title changes are being broadly patched.' );
jt_title_stability_assert( 'justice_ops_title_stability_print' === ( $jt_title_actions['wp_head'][2] ?? '' ), 'Safeguard was not registered before normal third-party scripts.' );
jt_title_stability_assert( '' === justice_ops_title_stability_script( '   ' ), 'Empty title did not fail closed.' );

echo "title stability tests passed\n";
