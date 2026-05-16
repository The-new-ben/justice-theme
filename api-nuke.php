<?php
/**
 * Headless Plugin Cleanup API V6
 * Phase 1: Remove security threats (deactivate + delete)
 * Phase 2: Delete all inactive plugins
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

function rrmdir($dir) {
    if (!is_dir($dir)) return false;
    $files = array_diff(scandir($dir), ['.', '..']);
    foreach ($files as $file) {
        $path = $dir . '/' . $file;
        is_dir($path) ? rrmdir($path) : unlink($path);
    }
    return rmdir($dir);
}

$action = isset($_GET['action']) ? $_GET['action'] : '';
$plugins_dir = $wp_root . '/wp-content/plugins';

// ========================================
// ACTION: cleanup_phase1 — Security threats
// ========================================
if ($action === 'cleanup_phase1') {
    $log = [];
    
    // Plugins to DEACTIVATE (remove from active list) then DELETE
    $deactivate_and_delete = ['wp-file-manager', 'google-analyticator', 'jquery-updater'];
    
    // Get current active plugins
    $res = $conn->query("SELECT option_value FROM {$table_prefix}options WHERE option_name = 'active_plugins'");
    $row = $res->fetch_assoc();
    $active = unserialize($row['option_value']);
    $original_count = count($active);
    
    // Remove target plugins from active list
    $active = array_filter($active, function($plugin_path) use ($deactivate_and_delete) {
        foreach ($deactivate_and_delete as $slug) {
            if (strpos($plugin_path, $slug . '/') === 0 || $plugin_path === $slug) {
                return false; // remove
            }
        }
        return true; // keep
    });
    $active = array_values($active); // re-index
    
    // Update DB
    $new_value = serialize($active);
    $conn->query("UPDATE {$table_prefix}options SET option_value = '" . $conn->real_escape_string($new_value) . "' WHERE option_name = 'active_plugins'");
    $log[] = "Deactivated " . ($original_count - count($active)) . " security-risk plugins in DB";
    
    // Delete the folders
    foreach ($deactivate_and_delete as $slug) {
        $path = $plugins_dir . '/' . $slug;
        if (is_dir($path)) {
            rrmdir($path);
            $log[] = "DELETED: $slug (security threat removed)";
        } else {
            $log[] = "SKIPPED: $slug (not found on disk)";
        }
    }
    
    // Also delete temporary-login-without-password (inactive but dangerous)
    $danger = $plugins_dir . '/temporary-login-without-password';
    if (is_dir($danger)) {
        rrmdir($danger);
        $log[] = "DELETED: temporary-login-without-password (security risk)";
    }
    
    echo json_encode(['status' => 'Phase 1 complete', 'active_plugins_now' => count($active), 'log' => $log], JSON_PRETTY_PRINT);
    exit;
}

// ========================================
// ACTION: cleanup_phase2 — All inactive plugins
// ========================================
if ($action === 'cleanup_phase2') {
    $log = [];
    $freed_mb = 0;
    
    // Get active plugins to know what NOT to touch
    $res = $conn->query("SELECT option_value FROM {$table_prefix}options WHERE option_name = 'active_plugins'");
    $row = $res->fetch_assoc();
    $active_list = unserialize($row['option_value']);
    if (!is_array($active_list)) $active_list = [];
    
    $active_slugs = [];
    foreach ($active_list as $ap) {
        $parts = explode('/', $ap);
        $active_slugs[] = $parts[0];
    }
    
    // Scan all plugin folders
    $deleted_count = 0;
    foreach (scandir($plugins_dir) as $f) {
        if ($f === '.' || $f === '..' || !is_dir($plugins_dir . '/' . $f)) continue;
        
        // Skip if active
        if (in_array($f, $active_slugs)) continue;
        
        // This is inactive — measure size then delete
        $size = 0;
        try {
            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($plugins_dir . '/' . $f, RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
                $size += $file->getSize();
            }
        } catch (Exception $e) {}
        
        $size_mb = round($size / 1024 / 1024, 2);
        
        if (rrmdir($plugins_dir . '/' . $f)) {
            $freed_mb += $size_mb;
            $deleted_count++;
            $log[] = "DELETED: $f ($size_mb MB)";
        } else {
            $log[] = "FAILED: $f (permission denied)";
        }
    }
    
    echo json_encode([
        'status' => 'Phase 2 complete',
        'inactive_plugins_deleted' => $deleted_count,
        'space_freed_mb' => round($freed_mb, 2),
        'active_plugins_untouched' => count($active_slugs),
        'log' => $log
    ], JSON_PRETTY_PRINT);
    exit;
}

// ========================================
// ACTION: audit_plugins (kept from V5)
// ========================================
if ($action === 'audit_plugins') {
    $results = ['active' => [], 'inactive' => [], 'total_active' => 0, 'total_inactive' => 0];
    
    $res = $conn->query("SELECT option_value FROM {$table_prefix}options WHERE option_name = 'active_plugins'");
    $active_list = [];
    if ($res && $row = $res->fetch_assoc()) {
        $active_list = unserialize($row['option_value']);
        if (!is_array($active_list)) $active_list = [];
    }
    
    foreach (scandir($plugins_dir) as $f) {
        if ($f === '.' || $f === '..' || !is_dir($plugins_dir . '/' . $f)) continue;
        
        $is_active = false;
        foreach ($active_list as $ap) {
            if (strpos($ap, $f . '/') === 0 || $ap === $f) { $is_active = true; break; }
        }
        
        $size = 0;
        try {
            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($plugins_dir . '/' . $f, RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
                $size += $file->getSize();
            }
        } catch (Exception $e) {}
        
        $entry = ['name' => $f, 'size_mb' => round($size / 1024 / 1024, 2)];
        if ($is_active) { $results['active'][] = $entry; $results['total_active']++; }
        else { $results['inactive'][] = $entry; $results['total_inactive']++; }
    }
    
    usort($results['active'], function($a, $b) { return $b['size_mb'] <=> $a['size_mb']; });
    usort($results['inactive'], function($a, $b) { return $b['size_mb'] <=> $a['size_mb']; });
    
    echo json_encode($results, JSON_PRETTY_PRINT);
    exit;
}

echo json_encode(['error' => 'No action. Use: cleanup_phase1, cleanup_phase2, audit_plugins']);
