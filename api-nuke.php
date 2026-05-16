<?php
/**
 * Headless Server Nuke & Deep Scan API V3
 */
header('Content-Type: application/json; charset=utf-8');

$expected_token = 'justice-headless-clear-99x';
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== $expected_token ) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$wp_root = dirname(dirname(dirname(dirname(__FILE__)))); // public_html
$domain_root = dirname($wp_root); // /domains/jus-tice.co.il/
$user_root = dirname(dirname($domain_root)); // /home/username/

function get_dir_size($dir) {
    if (!is_dir($dir)) return 0;
    $size = 0;
    try {
        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
            $size += $file->getSize();
        }
    } catch(Exception $e) {}
    return $size;
}

if (isset($_GET['action']) && $_GET['action'] === 'scan_everything') {
    $results = ['folders' => [], 'files_outside_public_html' => []];
    
    // Scan domain root folders
    if (is_dir($domain_root)) {
        foreach (scandir($domain_root) as $f) {
            if ($f === '.' || $f === '..') continue;
            $path = $domain_root . '/' . $f;
            if (is_dir($path)) {
                $results['folders']['DOMAIN_ROOT/' . $f] = round(get_dir_size($path) / 1024 / 1024, 2) . ' MB';
            } else {
                $s = filesize($path);
                if ($s > 1024 * 1024) { 
                    $results['files_outside_public_html']['DOMAIN_ROOT/' . $f] = round($s / 1024 / 1024, 2) . ' MB';
                }
            }
        }
    }
    
    // Scan user root folders (careful, might hit permissions issues)
    if (is_dir($user_root)) {
        foreach (scandir($user_root) as $f) {
            if ($f === '.' || $f === '..') continue;
            $path = $user_root . '/' . $f;
            if (is_dir($path)) {
                $results['folders']['USER_ROOT/' . $f] = round(get_dir_size($path) / 1024 / 1024, 2) . ' MB';
            }
        }
    }
    
    arsort($results['folders']);
    echo json_encode($results, JSON_PRETTY_PRINT);
    exit;
}

echo json_encode(['error' => 'No action specified']);
