<?php
/**
 * Headless Server Cleanup API
 * Designed to be triggered by AI agent via read_url_content tool.
 */
header('Content-Type: application/json; charset=utf-8');

// Simple security token to prevent unauthorized execution
$expected_token = 'justice-headless-clear-99x';
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== $expected_token ) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$theme_dir = dirname(__FILE__);
$themes_dir = dirname($theme_dir);
$wp_content = dirname($themes_dir);

$freed_bytes = 0;
$log = [];

/**
 * Recursively delete a directory
 */
function delete_dir($dir) {
    global $freed_bytes, $log;
    if (!is_dir($dir)) return false;
    
    $size = 0;
    $files = array_diff(scandir($dir), array('.','..'));
    foreach ($files as $file) {
        $path = "$dir/$file";
        if (is_dir($path)) {
            delete_dir($path);
        } else {
            $s = filesize($path);
            if (unlink($path)) {
                $size += $s;
            }
        }
    }
    if (rmdir($dir)) {
        $freed_bytes += $size;
        $log[] = "Deleted DIR: " . basename($dir) . " (" . round($size / 1024 / 1024, 2) . " MB)";
        return true;
    }
    return false;
}

/**
 * Delete a file
 */
function delete_file($path) {
    global $freed_bytes, $log;
    if (is_file($path)) {
        $s = filesize($path);
        if (unlink($path)) {
            $freed_bytes += $s;
            $log[] = "Deleted FILE: " . basename($path) . " (" . round($s / 1024 / 1024, 2) . " MB)";
            return true;
        }
    }
    return false;
}

// Optional: Delete a specific path
if (isset($_GET['delete'])) {
    $target = base64_decode($_GET['delete']);
    // Security check: Must be inside wp-content
    if (strpos($target, $wp_content) === 0) {
        if (is_dir($target)) {
            delete_dir($target);
        } else {
            delete_file($target);
        }
    } else {
        $log[] = "Security blocking deletion outside wp-content: $target";
    }
    
    echo json_encode([
        'status' => 'success',
        'total_megabytes_freed' => round($freed_bytes / 1024 / 1024, 2),
        'actions' => $log
    ]);
    exit;
}

// 1. Clear UpdraftPlus Local Backups
$updraft_dir = $wp_content . '/updraft';
if (is_dir($updraft_dir)) {
    $files = array_diff(scandir($updraft_dir), array('.','..', 'index.php', '.htaccess', 'web.config'));
    foreach ($files as $f) {
        delete_file($updraft_dir . '/' . $f);
    }
}

// 2. Clear Debug Log
delete_file($wp_content . '/debug.log');

// 3. Delete emergency backups left in themes dir
delete_dir($themes_dir . '/justice_theme_emergency_master_2026_05_13');
delete_file($themes_dir . '/justice_theme_emergency_master_2026_05_13.zip');

// 4. Delete old default themes (we only need justice-theme)
$default_themes = ['twentytwenty', 'twentytwentyone', 'twentytwentytwo', 'twentytwentythree', 'twentytwentyfour', 'justice-theme-backup', 'justice-theme-broken'];
foreach ($default_themes as $dt) {
    delete_dir($themes_dir . '/' . $dt);
}

// 5. Delete recovery scripts inside justice-theme
$recovery_scripts = ['recovery.php', 'emergency-recovery.php', 'fix.php', 'server-cleanup.php', 'restore-from-github.php'];
foreach ($recovery_scripts as $rs) {
    delete_file($theme_dir . '/' . $rs);
}

echo json_encode([
    'status' => 'success',
    'total_megabytes_freed' => round($freed_bytes / 1024 / 1024, 2),
    'actions' => $log
]);
