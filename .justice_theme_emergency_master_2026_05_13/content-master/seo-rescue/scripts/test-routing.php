<?php
require_once( 'wp-load.php' );

$wp->parse_request( 'lahav-433' );
$query = new WP_Query( $wp->query_vars );
echo "Query vars for 'lahav-433':\n";
print_r( $wp->query_vars );
echo "\nMatched rule:\n";
print_r( $wp->matched_rule );
echo "\nMatched query:\n";
print_r( $wp->matched_query );
