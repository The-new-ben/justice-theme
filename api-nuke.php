<?php
/**
 * Headless Server Nuke & Deep Scan API V2
 */
header('Content-Type: application/json; charset=utf-8');

$expected_token = 'justice-headless-clear-99x';
if ( ! isset( $_GET['token'] ) || $_GET['token'] !== $expected_token ) {
    http_response_code(403);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$wp_root = dirname(dirname(dirname(dirname(__FILE__)))); // public_html

function get_dir_size($dir) {
    if (!is_dir($dir)) return 0;
    $size = 0;
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
        $size += $file->getSize();
    }
    return $size;
}

if (isset($_GET['action']) && $_GET['action'] === 'scan_folders') {
    $results = ['folders' => [], 'root_files' => []];
    
    // Top level folders
    foreach (scandir($wp_root) as $f) {
        if ($f === '.' || $f === '..') continue;
        $path = $wp_root . '/' . $f;
        if (is_dir($path)) {
            $results['folders'][$f] = round(get_dir_size($path) / 1024 / 1024, 2) . ' MB';
        } else {
            $s = filesize($path);
            if ($s > 1024 * 1024) { // Only show > 1MB files in root
                $results['root_files'][$f] = round($s / 1024 / 1024, 2) . ' MB';
            }
        }
    }
    
    // Check uploads subfolders
    $uploads = $wp_root . '/wp-content/uploads';
    if (is_dir($uploads)) {
        foreach (scandir($uploads) as $f) {
            if ($f === '.' || $f === '..') continue;
            $path = $uploads . '/' . $f;
            if (is_dir($path)) {
                $results['folders']['wp-content/uploads/' . $f] = round(get_dir_size($path) / 1024 / 1024, 2) . ' MB';
            }
        }
    }
    
    arsort($results['folders']);
    echo json_encode($results, JSON_PRETTY_PRINT);
    exit;
}

if (isset($_GET['action']) && $_GET['action'] === 'nuke_junk') {
    $freed = 0;
    $log = [];
    
    function nuke_file($path, $reason) {
        global $freed, $log;
        if (is_file($path)) {
            @chmod($path, 0777);
            $s = filesize($path);
            if (@unlink($path)) {
                $freed += $s;
                $log[] = "Nuked [$reason]: " . basename($path) . " (" . round($s/1024/1024, 2) . " MB)";
            }
        }
    }
    
    function nuke_dir($dir, $reason) {
        global $freed, $log;
        if (!is_dir($dir)) return;
        @chmod($dir, 0777);
        $size = get_dir_size($dir);
        // We will just do a simple recursive delete
        $it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
        $files = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);
        foreach($files as $file) {
            if ($file->isDir()){
                @rmdir($file->getRealPath());
            } else {
                @unlink($file->getRealPath());
            }
        }
        @rmdir($dir);
        $freed += $size;
        $log[] = "Nuked DIR [$reason]: " . basename($dir) . " (" . round($size/1024/1024, 2) . " MB)";
    }

    // 1. Root folder junk (installer files, sql, zips)
    foreach (scandir($wp_root) as $f) {
        if ($f === '.' || $f === '..') continue;
        $path = $wp_root . '/' . $f;
        if (is_file($path)) {
            if (strpos($f, 'installer') !== false || 
                strpos($f, 'backup') !== false || 
                substr($f, -4) === '.zip' || 
                substr($f, -4) === '.sql' ||
                substr($f, -4) === '.tar' ||
                substr($f, -3) === '.gz' ||
                strpos($f, 'dup-installer') !== false) {
                nuke_file($path, 'Root Backup/Installer');
            }
        } elseif (is_dir($path) && strpos($f, 'dup-installer') !== false) {
            nuke_dir($path, 'Duplicator Installer Dir');
        }
    }
    
    // 2. Emergency Backup in Theme
    $emergency_dir = $wp_root . '/wp-content/themes/justice-theme/justice_theme_emergency_master_2026_05_13';
    nuke_dir($emergency_dir, 'Old Emergency Theme Backup');
    nuke_file($emergency_dir . '.zip', 'Old Emergency Theme Backup ZIP');
    
    // 3. WP Import Export Lite exports
    $exports_dir = $wp_root . '/wp-content/uploads/wp-import-export-lite/export';
    nuke_dir($exports_dir, 'Import/Export Plugin Artifacts');
    
    // 4. Old themes (aero-index, etc)
    $themes_dir = $wp_root . '/wp-content/themes';
    $junk_themes = ['aero-index', 'generatepress', 'hello-elementor', 'jus-tice-ui', 'justice-theme1', 'rotenberg', 'twentynineteen', 'twentyseventeen', 'twentysixteen', 'twentytwentyfive'];
    foreach ($junk_themes as $jt) {
        nuke_dir($themes_dir . '/' . $jt, 'Unused Theme');
    }
    nuke_file($themes_dir . '/aero-index777.archive.zip', 'Unused Theme Archive');
    
    echo json_encode([
        'status' => 'success',
        'freed_mb' => round($freed / 1024 / 1024, 2),
        'log' => $log
    ], JSON_PRETTY_PRINT);
    exit;
}

echo json_encode(['error' => 'No action specified']);
