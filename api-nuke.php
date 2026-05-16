<?php
/**
 * Headless Server Deep Diagnostic V4c
 * Maximum defensive coding. Shows errors if something fails.
 */
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json; charset=utf-8');

$expected_token = 'justice-headless-clear-99x';
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== $expected_token ) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$results = ['step' => 'init'];

try {
    // Parse wp-config.php for DB credentials
    $wp_root = dirname(dirname(dirname(dirname(__FILE__))));
    $config_file = $wp_root . '/wp-config.php';
    
    if (!file_exists($config_file)) {
        echo json_encode(['error' => 'wp-config.php not found at: ' . $config_file]);
        exit;
    }
    
    $config_content = file_get_contents($config_file);
    $results['step'] = 'config_loaded';
    $results['config_size'] = strlen($config_content);
    
    // Extract DB credentials with flexible regex
    preg_match("/define\s*\(\s*['\"]DB_NAME['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m1);
    preg_match("/define\s*\(\s*['\"]DB_USER['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m2);
    preg_match("/define\s*\(\s*['\"]DB_PASSWORD['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m3);
    preg_match("/define\s*\(\s*['\"]DB_HOST['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m4);
    
    $db_name = isset($m1[1]) ? $m1[1] : null;
    $db_user = isset($m2[1]) ? $m2[1] : null;
    $db_pass = isset($m3[1]) ? $m3[1] : null;
    $db_host = isset($m4[1]) ? $m4[1] : null;
    
    $results['db_name'] = $db_name;
    $results['db_host'] = $db_host;
    $results['db_user_found'] = !empty($db_user);
    $results['db_pass_found'] = !empty($db_pass);
    
    if (!$db_name || !$db_user || !$db_host) {
        echo json_encode(['error' => 'Could not parse DB credentials', 'results' => $results]);
        exit;
    }
    
    // Get table prefix
    $table_prefix = 'wp_';
    if (preg_match('/\$table_prefix\s*=\s*[\'"]([^\'"]+)[\'"]/', $config_content, $mp)) {
        $table_prefix = $mp[1];
    }
    $results['table_prefix'] = $table_prefix;
    $results['step'] = 'connecting_db';
    
    // Connect to database
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
    if ($conn->connect_error) {
        echo json_encode(['error' => 'DB connection failed: ' . $conn->connect_error, 'results' => $results]);
        exit;
    }
    $results['step'] = 'db_connected';
    
    // 1. Total DB size
    $res = $conn->query("SELECT 
        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS total_mb,
        ROUND(SUM(data_free) / 1024 / 1024, 2) AS overhead_mb,
        COUNT(*) as table_count
        FROM information_schema.TABLES 
        WHERE table_schema = '" . $conn->real_escape_string($db_name) . "'");
    if ($res) {
        $row = $res->fetch_assoc();
        $results['database_total_mb'] = $row['total_mb'];
        $results['database_overhead_mb'] = $row['overhead_mb'];
        $results['database_table_count'] = $row['table_count'];
    }
    
    // 2. Top 30 largest tables
    $res2 = $conn->query("SELECT 
        table_name,
        ROUND((data_length + index_length) / 1024 / 1024, 2) AS size_mb,
        table_rows
        FROM information_schema.TABLES 
        WHERE table_schema = '" . $conn->real_escape_string($db_name) . "'
        ORDER BY (data_length + index_length) DESC
        LIMIT 30");
    if ($res2) {
        $results['largest_tables'] = [];
        while ($r = $res2->fetch_assoc()) {
            $results['largest_tables'][] = $r;
        }
    }
    
    // 3. Post revisions
    $rev = $conn->query("SELECT COUNT(*) as cnt FROM {$table_prefix}posts WHERE post_type = 'revision'");
    if ($rev) { $results['post_revisions_count'] = $rev->fetch_assoc()['cnt']; }
    
    // 4. Transients
    $trans = $conn->query("SELECT COUNT(*) as cnt FROM {$table_prefix}options WHERE option_name LIKE '_transient_%'");
    if ($trans) { $results['transients_count'] = $trans->fetch_assoc()['cnt']; }
    
    // 5. Posts by status
    $ps = $conn->query("SELECT post_status, COUNT(*) as cnt FROM {$table_prefix}posts GROUP BY post_status");
    if ($ps) {
        $results['posts_by_status'] = [];
        while ($r = $ps->fetch_assoc()) { $results['posts_by_status'][$r['post_status']] = (int)$r['cnt']; }
    }
    
    // 6. Comments by status
    $cs = $conn->query("SELECT comment_approved, COUNT(*) as cnt FROM {$table_prefix}comments GROUP BY comment_approved");
    if ($cs) {
        $results['comments_by_status'] = [];
        while ($r = $cs->fetch_assoc()) { $results['comments_by_status'][$r['comment_approved']] = (int)$r['cnt']; }
    }
    
    // 7. Grand total
    $db_mb = (float)($results['database_total_mb'] ?? 0);
    $results['GRAND_TOTAL'] = [
        'files_mb' => 1933,
        'database_mb' => $db_mb,
        'combined_mb' => round(1933 + $db_mb, 2),
        'upress_shows_mb' => 10250,
        'gap_mb' => round(10250 - 1933 - $db_mb, 2)
    ];
    
    $conn->close();
    $results['step'] = 'complete';
    
} catch (Exception $e) {
    $results['error'] = $e->getMessage();
    $results['trace'] = $e->getTraceAsString();
}

echo json_encode($results, JSON_PRETTY_PRINT);
