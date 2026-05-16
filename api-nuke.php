<?php
/**
 * Headless Server Deep Diagnostic V4b
 * Reads DB creds from wp-config without bootstrapping WP.
 */
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', 0);
error_reporting(0);

$expected_token = 'justice-headless-clear-99x';
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== $expected_token ) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Parse wp-config.php for DB credentials without loading WordPress
$wp_root = dirname(dirname(dirname(dirname(__FILE__))));
$config_file = $wp_root . '/wp-config.php';
$config_content = file_get_contents($config_file);

function extract_define($name, $content) {
    if (preg_match("/define\s*\(\s*['\"]" . preg_quote($name) . "['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $content, $m)) {
        return $m[1];
    }
    return null;
}

$db_name = extract_define('DB_NAME', $config_content);
$db_user = extract_define('DB_USER', $config_content);
$db_pass = extract_define('DB_PASSWORD', $config_content);
$db_host = extract_define('DB_HOST', $config_content);
$table_prefix = 'wp_';
if (preg_match('/\$table_prefix\s*=\s*[\'"]([^\'"]+)[\'"]/', $config_content, $m)) {
    $table_prefix = $m[1];
}

$results = [
    'db_name' => $db_name,
    'table_prefix' => $table_prefix
];

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    $results['db_error'] = $conn->connect_error;
    echo json_encode($results, JSON_PRETTY_PRINT);
    exit;
}

// 1. Total DB size
$res = $conn->query("SELECT 
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS total_mb,
    ROUND(SUM(data_free) / 1024 / 1024, 2) AS overhead_mb,
    COUNT(*) as table_count
    FROM information_schema.TABLES 
    WHERE table_schema = '" . $conn->real_escape_string($db_name) . "'");
$row = $res->fetch_assoc();
$results['database_total_mb'] = $row['total_mb'];
$results['database_overhead_mb'] = $row['overhead_mb'];
$results['database_table_count'] = $row['table_count'];

// 2. Top 30 largest tables
$res2 = $conn->query("SELECT 
    table_name,
    ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb,
    ROUND(data_free / 1024 / 1024, 2) AS overhead_mb,
    table_rows
    FROM information_schema.TABLES 
    WHERE table_schema = '" . $conn->real_escape_string($db_name) . "'
    ORDER BY (data_length + index_length) DESC
    LIMIT 30");
$results['largest_tables'] = [];
while ($r = $res2->fetch_assoc()) {
    $results['largest_tables'][] = $r;
}

// 3. Post revisions count
$rev = $conn->query("SELECT COUNT(*) as cnt FROM {$table_prefix}posts WHERE post_type = 'revision'");
if ($rev) {
    $r = $rev->fetch_assoc();
    $results['post_revisions_count'] = $r['cnt'];
}

// 4. Transients count
$trans = $conn->query("SELECT COUNT(*) as cnt FROM {$table_prefix}options WHERE option_name LIKE '_transient_%'");
if ($trans) {
    $r = $trans->fetch_assoc();
    $results['transients_count'] = $r['cnt'];
}

// 5. Auto-draft and trash posts
$trash = $conn->query("SELECT post_status, COUNT(*) as cnt FROM {$table_prefix}posts GROUP BY post_status");
if ($trash) {
    $results['posts_by_status'] = [];
    while ($r = $trash->fetch_assoc()) {
        $results['posts_by_status'][$r['post_status']] = (int)$r['cnt'];
    }
}

// 6. Spam/trash comments
$comments = $conn->query("SELECT comment_approved, COUNT(*) as cnt FROM {$table_prefix}comments GROUP BY comment_approved");
if ($comments) {
    $results['comments_by_status'] = [];
    while ($r = $comments->fetch_assoc()) {
        $results['comments_by_status'][$r['comment_approved']] = (int)$r['cnt'];
    }
}

// 7. File system summary
$results['filesystem_total_mb'] = round(disk_total_space($wp_root) / 1024 / 1024, 2);
$results['filesystem_free_mb'] = round(disk_free_space($wp_root) / 1024 / 1024, 2);
$results['filesystem_used_by_site_mb'] = 1933; // from previous confirmed scan

// 8. GRAND TOTAL
$results['GRAND_TOTAL_EXPLANATION'] = [
    'files_mb' => 1933,
    'database_mb' => (float)$row['total_mb'],
    'combined_mb' => 1933 + (float)$row['total_mb'],
    'upress_shows_mb' => 10250
];

$conn->close();
echo json_encode($results, JSON_PRETTY_PRINT);
