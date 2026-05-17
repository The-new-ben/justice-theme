<?php
define('WP_USE_THEMES', false);
require_once('wp-load.php');

$url = 'https://jus-tice.co.il/lahav-433/';
$request = str_replace(home_url(), '', $url);
$request = trim($request, '/');

$wp->parse_request($request);
print_r($wp->query_vars);

$query = new WP_Query($wp->query_vars);
echo "Post Count: " . $query->post_count . "\n";
if ($query->post_count > 0) {
    echo "Found Post: " . $query->posts[0]->post_title . " (Type: " . $query->posts[0]->post_type . ")\n";
} else {
    echo "No post found!\n";
}
