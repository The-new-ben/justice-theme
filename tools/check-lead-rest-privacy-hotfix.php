<?php
class WP_Error {
	public $code;
	public $message;
	public $data;

	public function __construct( $code, $message, $data ) {
		$this->code    = $code;
		$this->message = $message;
		$this->data    = $data;
	}
}

$justice_privacy_test_admin  = false;
$justice_privacy_test_filter = array();

function current_user_can( $capability ) {
	global $justice_privacy_test_admin;
	if ( 'manage_options' !== $capability ) {
		throw new RuntimeException( 'Unexpected capability.' );
	}
	return $justice_privacy_test_admin;
}

function add_filter( $hook, $callback, $priority, $args ) {
	global $justice_privacy_test_filter;
	$justice_privacy_test_filter = compact( 'hook', 'callback', 'priority', 'args' );
}

final class Justice_Privacy_Test_Request {
	private $route;

	public function __construct( $route ) {
		$this->route = $route;
	}

	public function get_route() {
		return $this->route;
	}
}

require __DIR__ . '/snippets/lead-rest-privacy-hotfix.php';

function justice_privacy_assert( $condition, $message ) {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

justice_privacy_assert( 'rest_pre_dispatch' === $justice_privacy_test_filter['hook'], 'Wrong hook.' );
justice_privacy_assert( PHP_INT_MAX === $justice_privacy_test_filter['priority'], 'Wrong priority.' );
justice_privacy_assert( 3 === $justice_privacy_test_filter['args'], 'Wrong argument count.' );

$sentinel = (object) array( 'prior' => true );
$server   = new stdClass();

$unrelated = justice_privacy_deny_public_lead_rest( $sentinel, $server, new Justice_Privacy_Test_Request( '/wp/v2/posts' ) );
justice_privacy_assert( $sentinel === $unrelated, 'Unrelated route was changed.' );

foreach ( array( '/wp/v2/justice_lead', '/wp/v2/justice_lead/24234', '/wp/v2/justice_lead/24234/autosaves' ) as $route ) {
	$result = justice_privacy_deny_public_lead_rest( null, $server, new Justice_Privacy_Test_Request( $route ) );
	justice_privacy_assert( $result instanceof WP_Error, 'Public lead route was not denied.' );
	justice_privacy_assert( 'rest_no_route' === $result->code, 'Unexpected public error code.' );
	justice_privacy_assert( 404 === $result->data['status'], 'Unexpected public status.' );
}

$justice_privacy_test_admin = true;
$admin_result = justice_privacy_deny_public_lead_rest( $sentinel, $server, new Justice_Privacy_Test_Request( '/wp/v2/justice_lead/24234' ) );
justice_privacy_assert( $sentinel === $admin_result, 'Administrator access was changed.' );

echo "PASS: lead REST privacy guard\n";
