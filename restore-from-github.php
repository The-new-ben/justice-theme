<?php
/**
 * EMERGENCY RESTORE — downloads full theme ZIP from GitHub and extracts it.
 *
 * Upload this file to /wp-content/themes/justice-theme/ via uPress file manager.
 * Access it at: https://jus-tice.co.il/wp-content/themes/justice-theme/restore-from-github.php
 * DELETE THIS FILE after the site is restored.
 *
 * Does NOT load WordPress. PHP file-system only.
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: text/plain; charset=utf-8');
set_time_limit(300);

echo "=== Justice Theme — GitHub Restore ===\n\n";

$theme_dir  = rtrim(__DIR__, '/');
$zip_url    = 'https://github.com/The-new-ben/justice-theme/archive/refs/heads/main.zip';
$zip_local  = $theme_dir . '/___restore_tmp.zip';
$extract_to = $theme_dir . '/___restore_tmp_dir';

// --- Step 1: Download the ZIP ---
echo "1. Downloading theme ZIP from GitHub...\n";

$downloaded = false;

// Try cURL first (more reliable on managed hosts)
if (function_exists('curl_init')) {
    $ch = curl_init($zip_url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_TIMEOUT        => 120,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (justice-theme-restore)',
    ]);
    $data = curl_exec($ch);
    $http  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err   = curl_error($ch);
    curl_close($ch);

    if ($data && $http === 200) {
        file_put_contents($zip_local, $data);
        $downloaded = true;
        echo "   Downloaded via cURL (" . number_format(strlen($data)) . " bytes)\n";
    } else {
        echo "   cURL failed (HTTP $http, $err) — trying file_get_contents...\n";
    }
}

// Fallback: file_get_contents with stream context
if (!$downloaded) {
    $ctx = stream_context_create([
        'http' => [
            'method'          => 'GET',
            'follow_location' => 1,
            'timeout'         => 120,
            'user_agent'      => 'Mozilla/5.0 (justice-theme-restore)',
        ],
        'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
    ]);
    $data = @file_get_contents($zip_url, false, $ctx);
    if ($data) {
        file_put_contents($zip_local, $data);
        $downloaded = true;
        echo "   Downloaded via file_get_contents (" . number_format(strlen($data)) . " bytes)\n";
    } else {
        echo "   FAILED: could not download ZIP. Check allow_url_fopen or cURL.\n";
        exit(1);
    }
}

// --- Step 2: Extract the ZIP ---
echo "\n2. Extracting ZIP...\n";

if (!class_exists('ZipArchive')) {
    echo "   FAILED: ZipArchive extension not available.\n";
    unlink($zip_local);
    exit(1);
}

$zip = new ZipArchive();
if ($zip->open($zip_local) !== true) {
    echo "   FAILED: could not open ZIP file.\n";
    unlink($zip_local);
    exit(1);
}

@mkdir($extract_to, 0755, true);
$zip->extractTo($extract_to);
$zip->close();
echo "   Extracted OK.\n";

// GitHub ZIPs extract to a folder named {repo}-{branch}/
$source_dir = $extract_to . '/justice-theme-main';
if (!is_dir($source_dir)) {
    $subdirs = glob($extract_to . '/*', GLOB_ONLYDIR);
    if (count($subdirs) === 1) {
        $source_dir = $subdirs[0];
    } else {
        echo "   FAILED: could not find extracted source directory.\n";
        exit(1);
    }
}

// --- Step 3: Copy files to theme directory ---
echo "\n3. Copying files to theme directory...\n";

function copy_recursive(string $src, string $dst): int {
    $count = 0;
    if (!is_dir($dst)) {
        mkdir($dst, 0755, true);
    }
    $items = scandir($src);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $s = $src . '/' . $item;
        $d = $dst . '/' . $item;
        if (is_dir($s)) {
            $count += copy_recursive($s, $d);
        } else {
            if (copy($s, $d)) $count++;
        }
    }
    return $count;
}

$copied = copy_recursive($source_dir, $theme_dir);
echo "   Copied $copied files.\n";

// --- Step 4: Install mu-plugin safety net ---
echo "\n4. Installing PHP 8.4 mu-plugin safety net...\n";

$mu_src = $theme_dir . '/mu-plugins/php84-safety-net.php';
$wp_root = dirname(dirname(dirname($theme_dir)));
$mu_dir  = $wp_root . '/wp-content/mu-plugins';
$mu_dst  = $mu_dir . '/php84-safety-net.php';

if (file_exists($mu_src)) {
    if (!is_dir($mu_dir)) {
        mkdir($mu_dir, 0755, true);
    }
    if (copy($mu_src, $mu_dst)) {
        echo "   Installed: php84-safety-net.php\n";
    } else {
        echo "   WARNING: could not copy mu-plugin (check permissions).\n";
    }
} else {
    echo "   mu-plugin source not found — skipping.\n";
}

// --- Step 5: Cleanup ---
echo "\n5. Cleaning up temp files...\n";

unlink($zip_local);

function remove_dir(string $dir): void {
    if (!is_dir($dir)) return;
    $items = scandir($dir);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = $dir . '/' . $item;
        is_dir($path) ? remove_dir($path) : unlink($path);
    }
    rmdir($dir);
}

remove_dir($extract_to);
echo "   Temp files removed.\n";

// --- Done ---
echo "\n=== RESTORE COMPLETE ===\n";
echo "Theme files restored from GitHub main branch.\n";
echo "IMPORTANT: Delete this file (restore-from-github.php) from the server.\n";
echo "IMPORTANT: Also delete recovery.php and any other emergency scripts.\n";
