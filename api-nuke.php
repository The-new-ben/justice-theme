<?php
/**
 * Headless Server Deep Diagnostic V4
 * Proves EXACTLY where 10.25 GB is hiding.
 */
header('Content-Type: application/json; charset=utf-8');

$expected_token = 'justice-headless-clear-99x';
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== $expected_token ) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Load WordPress to get DB access
define('ABSPATH', dirname(dirname(dirname(dirname(__FILE__)))) . '/');
require_once ABSPATH . 'wp-config.php';

$results = [];

// 1. DATABASE SIZE - the smoking gun
$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
if ($conn->connect_error) {
    $results['db_error'] = $conn->connect_error;
} else {
    // Total DB size
    $res = $conn->query("SELECT 
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS total_mb,
        ROUND(SUM(data_free) / 1024 / 1024, 2) AS overhead_mb
        FROM information_schema.TABLES 
        WHERE table_schema = '" . DB_NAME . "'");
    $row = $res->fetch_assoc();
    $results['database_total_mb'] = $row['total_mb'];
    $results['database_overhead_mb'] = $row['overhead_mb'];

    // Top 20 largest tables
    $res2 = $conn->query("SELECT 
        table_name,
        ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb,
        table_rows
        FROM information_schema.TABLES 
        WHERE table_schema = '" . DB_NAME . "'
        ORDER BY (data_length + index_length) DESC
        LIMIT 20");
    $results['largest_tables'] = [];
    while ($r = $res2->fetch_assoc()) {
        $results['largest_tables'][] = $r;
    }

    // Count post revisions
    $rev = $conn->query("SELECT COUNT(*) as cnt FROM wp_posts WHERE post_type = 'revision'");
    $r = $rev->fetch_assoc();
    $results['post_revisions_count'] = $r['cnt'];

    // Count transients
    $trans = $conn->query("SELECT COUNT(*) as cnt FROM wp_options WHERE option_name LIKE '_transient_%'");
    $r = $trans->fetch_assoc();
    $results['transients_count'] = $r['cnt'];

    $conn->close();
}

// 2. FILE SYSTEM summary (quick)
$wp_root = dirname(dirname(dirname(dirname(__FILE__))));
$results['filesystem_mb'] = round(disk_total_space($wp_root) / 1024 / 1024, 2);
$results['filesystem_free_mb'] = round(disk_free_space($wp_root) / 1024 / 1024, 2);
$results['filesystem_used_mb'] = $results['filesystem_mb'] - $results['filesystem_free_mb'];

// 3. Plugins folder size and count
$plugins_dir = $wp_root . '/wp-content/plugins';
$plugin_count = 0;
$plugins_list = [];
if (is_dir($plugins_dir)) {
    foreach (scandir($plugins_dir) as $f) {
        if ($f === '.' || $f === '..' || !is_dir($plugins_dir . '/' . $f)) continue;
        $plugin_count++;
        $plugins_list[] = $f;
    }
}
$results['plugin_folders_count'] = $plugin_count;

// 4. Theme emergency backup size
$emergency = $wp_root . '/wp-content/themes/justice-theme/justice_theme_emergency_master_2026_05_13';
if (is_dir($emergency)) {
    $size = 0;
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($emergency, RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
        $size += $file->getSize();
    }
    $results['emergency_backup_mb'] = round($size / 1024 / 1024, 2);
}

echo json_encode($results, JSON_PRETTY_PRINT);
