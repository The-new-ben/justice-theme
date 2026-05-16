<?php
/**
 * URL Export API V7
 * Exports all posts/pages with their slugs for Hebrew→English migration
 */
ini_set('display_errors', 1);
error_reporting(E_ALL);
set_time_limit(120);
header('Content-Type: application/json; charset=utf-8');

$expected_token = 'justice-headless-clear-99x';
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== $expected_token ) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$wp_root = dirname(dirname(dirname(dirname(__FILE__))));
$config_content = file_get_contents($wp_root . '/wp-config.php');

preg_match("/define\s*\(\s*['\"]DB_NAME['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m1);
preg_match("/define\s*\(\s*['\"]DB_USER['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m2);
preg_match("/define\s*\(\s*['\"]DB_PASSWORD['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m3);
preg_match("/define\s*\(\s*['\"]DB_HOST['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $config_content, $m4);
$table_prefix = 'wp_';
if (preg_match('/\$table_prefix\s*=\s*[\'"]([^\'"]+)[\'"]/', $config_content, $mp)) {
    $table_prefix = $mp[1];
}

$conn = new mysqli($m4[1], $m2[1], $m3[1], $m1[1]);
if ($conn->connect_error) {
    echo json_encode(['error' => 'DB connection failed']);
    exit;
}
$conn->set_charset('utf8mb4');

$action = isset($_GET['action']) ? $_GET['action'] : '';

// ========================================
// ACTION: export_slugs — Get ALL posts with slugs
// ========================================
if ($action === 'export_slugs') {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 0;
    $limit = 200;
    $offset = $page * $limit;
    
    // Get posts that have Hebrew characters in slug OR are published content
    $sql = "SELECT ID, post_name, post_title, post_type, post_status 
            FROM {$table_prefix}posts 
            WHERE post_status IN ('publish', 'draft', 'private')
            AND post_type IN ('post', 'page', 'articles', 'justice_lawyer')
            ORDER BY post_type, ID
            LIMIT $limit OFFSET $offset";
    
    $res = $conn->query($sql);
    $posts = [];
    $hebrew_count = 0;
    $english_count = 0;
    
    while ($row = $res->fetch_assoc()) {
        $has_hebrew = preg_match('/[\x{0590}-\x{05FF}]/u', urldecode($row['post_name']));
        $needs_translation = $has_hebrew || preg_match('/%d7%/i', $row['post_name']);
        
        $posts[] = [
            'id' => (int)$row['ID'],
            'slug' => $row['post_name'],
            'title' => $row['post_title'],
            'type' => $row['post_type'],
            'status' => $row['post_status'],
            'needs_translation' => $needs_translation
        ];
        
        if ($needs_translation) $hebrew_count++;
        else $english_count++;
    }
    
    // Get total count
    $total_res = $conn->query("SELECT COUNT(*) as cnt FROM {$table_prefix}posts 
        WHERE post_status IN ('publish', 'draft', 'private')
        AND post_type IN ('post', 'page', 'articles', 'justice_lawyer')");
    $total = $total_res->fetch_assoc()['cnt'];
    
    echo json_encode([
        'page' => $page,
        'per_page' => $limit,
        'total_posts' => (int)$total,
        'total_pages' => ceil($total / $limit),
        'this_page_count' => count($posts),
        'hebrew_slugs' => $hebrew_count,
        'english_slugs' => $english_count,
        'posts' => $posts
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

// ========================================
// ACTION: check_duplicates — Find existing duplicate slugs
// ========================================
if ($action === 'check_duplicates') {
    $sql = "SELECT post_name, GROUP_CONCAT(ID) as ids, COUNT(*) as cnt,
            GROUP_CONCAT(post_type) as types, GROUP_CONCAT(post_status) as statuses
            FROM {$table_prefix}posts 
            WHERE post_name != '' AND post_status != 'auto-draft'
            GROUP BY post_name 
            HAVING cnt > 1
            ORDER BY cnt DESC
            LIMIT 100";
    
    $res = $conn->query($sql);
    $dupes = [];
    while ($row = $res->fetch_assoc()) {
        $dupes[] = $row;
    }
    
    echo json_encode([
        'duplicate_slugs_found' => count($dupes),
        'duplicates' => $dupes
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['error' => 'Use: export_slugs&page=0, check_duplicates']);
