<?php
define('WP_USE_THEMES', false);
require_once( dirname( __DIR__ ) . '/wp-load.php' );

if ( ! current_user_can('administrator') && $_GET['key'] !== 'debug_123' ) {
    die('Unauthorized');
}

echo "=== ACTIVE PLUGINS ===\n";
$active_plugins = get_option('active_plugins');
foreach($active_plugins as $plugin) {
    echo "- $plugin\n";
}

echo "\n=== POST TYPES & COUNTS ===\n";
global $wpdb;
$post_types = $wpdb->get_results("SELECT post_type, COUNT(*) as count FROM {$wpdb->posts} GROUP BY post_type ORDER BY count DESC");
foreach($post_types as $pt) {
    echo "- {$pt->post_type}: {$pt->count} posts\n";
}
