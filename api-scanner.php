<?php
/**
 * Headless Server Scanner API
 * Designed to be triggered by AI agent to find disk bloat.
 */
header('Content-Type: application/json; charset=utf-8');

$expected_token = 'justice-headless-clear-99x';
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== $expected_token ) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$wp_content = dirname(dirname(dirname(__FILE__)));
$wp_root = dirname($wp_content);

$results = [
    'wp_content_dirs' => [],
    'themes_dirs' => [],
    'large_files' => []
];

function get_dir_size($dir) {
    if (!is_dir($dir)) return 0;
    $size = 0;
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
        $size += $file->getSize();
    }
    return $size;
}

// 1. Scan wp-content subdirectories
if (is_dir($wp_content)) {
    foreach (scandir($wp_content) as $f) {
        if ($f === '.' || $f === '..') continue;
        $path = $wp_content . '/' . $f;
        if (is_dir($path)) {
            $results['wp_content_dirs'][$f] = round(get_dir_size($path) / 1024 / 1024, 2) . ' MB';
        }
    }
}

// 2. Scan themes subdirectories
$themes_dir = $wp_content . '/themes';
if (is_dir($themes_dir)) {
    foreach (scandir($themes_dir) as $f) {
        if ($f === '.' || $f === '..') continue;
        $path = $themes_dir . '/' . $f;
        if (is_dir($path)) {
            $results['themes_dirs'][$f] = round(get_dir_size($path) / 1024 / 1024, 2) . ' MB';
        }
    }
}

// 3. Find 20 largest files in wp-content
$all_files = [];
try {
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($wp_content, RecursiveDirectoryIterator::SKIP_DOTS));
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $all_files[$file->getPathname()] = $file->getSize();
        }
    }
    arsort($all_files);
    $top_20 = array_slice($all_files, 0, 20);
    foreach ($top_20 as $path => $size) {
        // Obfuscate full path slightly for security
        $rel_path = str_replace($wp_root, '', $path);
        $results['large_files'][$rel_path] = round($size / 1024 / 1024, 2) . ' MB';
    }
} catch (Exception $e) {
    $results['error'] = 'Could not complete deep file scan: ' . $e->getMessage();
}

echo json_encode($results, JSON_PRETTY_PRINT);
