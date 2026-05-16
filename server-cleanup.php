<?php
/**
 * Server cleanup script — run once via uPress file manager then DELETE THIS FILE.
 *
 * 1. Deletes recovery/emergency scripts (security risk)
 * 2. Copies the mu-plugin safety net to wp-content/mu-plugins/
 * 3. Reports disk usage of known space-wasters
 */

header('Content-Type: text/plain; charset=utf-8');
echo "=== Jus-Tice Server Cleanup ===\n\n";

$theme_dir = dirname(__FILE__);
$wp_root   = dirname(dirname(dirname($theme_dir)));

// 1. Delete dangerous recovery scripts
echo "--- Deleting recovery scripts ---\n";
$danger_files = array(
    $theme_dir . '/recovery.php',
    $theme_dir . '/emergency-recovery.php',
    $theme_dir . '/fix.php',
);

foreach ($danger_files as $f) {
    if (file_exists($f)) {
        if (unlink($f)) {
            echo "DELETED: " . basename($f) . "\n";
        } else {
            echo "FAILED to delete: " . basename($f) . "\n";
        }
    } else {
        echo "Already gone: " . basename($f) . "\n";
    }
}

// 2. Copy mu-plugin to wp-content/mu-plugins/
echo "\n--- Installing mu-plugin safety net ---\n";
$mu_source = $theme_dir . '/mu-plugins/php84-safety-net.php';
$mu_target_dir = $wp_root . '/wp-content/mu-plugins';
$mu_target = $mu_target_dir . '/php84-safety-net.php';

if (!is_dir($mu_target_dir)) {
    mkdir($mu_target_dir, 0755, true);
    echo "Created mu-plugins directory\n";
}

if (file_exists($mu_source)) {
    if (copy($mu_source, $mu_target)) {
        echo "INSTALLED: php84-safety-net.php -> wp-content/mu-plugins/\n";
    } else {
        echo "FAILED to copy mu-plugin\n";
    }
} else {
    echo "Source mu-plugin not found in theme. Pull from Git first.\n";
}

// 3. Check existing mu-plugins
echo "\n--- Current mu-plugins ---\n";
if (is_dir($mu_target_dir)) {
    foreach (glob($mu_target_dir . '/*.php') as $f) {
        echo "  " . basename($f) . " (" . number_format(filesize($f)) . " bytes)\n";
    }
}

// 4. Report disk space wasters
echo "\n--- Disk space report ---\n";

function dir_size($dir) {
    $size = 0;
    if (!is_dir($dir)) return 0;
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS)) as $f) {
        $size += $f->getSize();
    }
    return $size;
}

function format_mb($bytes) {
    return number_format($bytes / 1024 / 1024, 1) . ' MB';
}

$space_checks = array(
    'Updraft backups'    => $wp_root . '/wp-content/updraft',
    'Debug log'          => $wp_root . '/wp-content/debug.log',
    'Emergency folder'   => $theme_dir . '/justice_theme_emergency_master_2026_05_13',
    'Uploads directory'  => $wp_root . '/wp-content/uploads',
);

foreach ($space_checks as $label => $path) {
    if (is_dir($path)) {
        $s = dir_size($path);
        echo "  $label: " . format_mb($s) . "\n";
    } elseif (is_file($path)) {
        echo "  $label: " . format_mb(filesize($path)) . "\n";
    } else {
        echo "  $label: not found\n";
    }
}

// Count unused themes
echo "\n--- Installed themes ---\n";
$themes_dir = dirname($theme_dir);
foreach (glob($themes_dir . '/*', GLOB_ONLYDIR) as $t) {
    $name = basename($t);
    $s = dir_size($t);
    $active = ($name === 'justice-theme') ? ' [ACTIVE]' : ' (can delete)';
    echo "  $name: " . format_mb($s) . $active . "\n";
}

echo "\n=== Done. DELETE THIS FILE NOW! ===\n";
echo "URL: " . $_SERVER['REQUEST_URI'] . "\n";
