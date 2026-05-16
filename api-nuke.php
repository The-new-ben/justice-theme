<?php
/**
 * Headless Server Nuke & Deep Scan API
 */
header('Content-Type: application/json; charset=utf-8');

$expected_token = 'justice-headless-clear-99x';
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== $expected_token ) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$wp_root = dirname(dirname(dirname(dirname(__FILE__)))); // public_html

if (isset($_GET['action']) && $_GET['action'] === 'scan_root') {
    $results = ['large_files' => []];
    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($wp_root, RecursiveDirectoryIterator::SKIP_DOTS));
    $all_files = [];
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $all_files[$file->getPathname()] = $file->getSize();
        }
    }
    arsort($all_files);
    $top_50 = array_slice($all_files, 0, 50);
    foreach ($top_50 as $path => $size) {
        $rel_path = str_replace($wp_root, '', $path);
        $results['large_files'][$rel_path] = round($size / 1024 / 1024, 2) . ' MB';
    }
    echo json_encode($results, JSON_PRETTY_PRINT);
    exit;
}

if (isset($_POST['delete_paths'])) {
    $paths = json_decode($_POST['delete_paths'], true);
    $freed = 0;
    $log = [];
    $errors = [];

    function force_delete_file($path) {
        global $freed, $log, $errors;
        if (!file_exists($path)) return;
        @chmod($path, 0777);
        $s = filesize($path);
        if (@unlink($path)) {
            $freed += $s;
            $log[] = "Deleted: $path (" . round($s/1024/1024, 2) . " MB)";
        } else {
            $error = error_get_last();
            $errors[] = "Failed to delete file $path: " . ($error ? $error['message'] : 'Unknown error');
        }
    }

    function force_delete_dir($dir) {
        global $freed, $log, $errors;
        if (!is_dir($dir)) return;
        @chmod($dir, 0777);
        $files = array_diff(scandir($dir), array('.','..'));
        foreach ($files as $file) {
            $path = "$dir/$file";
            if (is_dir($path)) {
                force_delete_dir($path);
            } else {
                force_delete_file($path);
            }
        }
        if (@rmdir($dir)) {
            $log[] = "Deleted dir: $dir";
        } else {
            $error = error_get_last();
            $errors[] = "Failed to remove dir $dir: " . ($error ? $error['message'] : 'Unknown error (might not be empty)');
        }
    }

    foreach ($paths as $rel_path) {
        $full_path = $wp_root . '/' . ltrim($rel_path, '/');
        // Ensure we don't delete public_html itself or crucial wp folders
        if ($full_path === $wp_root || strpos($full_path, $wp_root) !== 0) {
            $errors[] = "Security block: $full_path";
            continue;
        }
        if (is_dir($full_path)) {
            force_delete_dir($full_path);
        } else {
            force_delete_file($full_path);
        }
    }

    echo json_encode([
        'status' => 'success',
        'freed_mb' => round($freed / 1024 / 1024, 2),
        'log' => $log,
        'errors' => $errors
    ], JSON_PRETTY_PRINT);
    exit;
}

echo json_encode(['error' => 'No action specified']);
