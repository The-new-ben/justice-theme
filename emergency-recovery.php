<?php
/**
 * EMERGENCY RECOVERY — Standalone DB fix. Does NOT load WordPress.
 * Reads wp-config.php for DB credentials, connects directly, clears recovery mode.
 *
 * DELETE THIS FILE after recovery!
 */

error_reporting( E_ALL );
ini_set( 'display_errors', '1' );
header( 'Content-Type: text/html; charset=utf-8' );

// Find wp-config.php
$config_paths = array(
	__DIR__ . '/../../../wp-config.php',
	__DIR__ . '/../../../../wp-config.php',
	'/var/www/html/wp-config.php',
	'/home/admin/public_html/wp-config.php',
);

$config_file = null;
foreach ( $config_paths as $p ) {
	if ( file_exists( $p ) ) {
		$config_file = $p;
		break;
	}
}

if ( ! $config_file ) {
	echo '<h1>ERROR</h1><p>wp-config.php not found. Tried:</p><ul>';
	foreach ( $config_paths as $p ) {
		echo '<li>' . htmlspecialchars( realpath( dirname( $p ) ) . '/' . basename( $p ) ) . '</li>';
	}
	echo '</ul>';
	exit;
}

// Parse DB credentials from wp-config.php without executing it
$config_content = file_get_contents( $config_file );

function extract_define( $content, $name ) {
	// Match: define( 'NAME', 'value' );
	if ( preg_match( "/define\s*\(\s*['\"]" . preg_quote( $name, '/' ) . "['\"]\s*,\s*['\"]([^'\"]*)['\"]/" , $content, $m ) ) {
		return $m[1];
	}
	return null;
}

$db_name = extract_define( $config_content, 'DB_NAME' );
$db_user = extract_define( $config_content, 'DB_USER' );
$db_pass = extract_define( $config_content, 'DB_PASSWORD' );
$db_host = extract_define( $config_content, 'DB_HOST' );

// Get table prefix
$table_prefix = 'wp_';
if ( preg_match( '/\$table_prefix\s*=\s*[\'"]([^\'"]+)[\'"]/', $config_content, $m ) ) {
	$table_prefix = $m[1];
}

if ( ! $db_name || ! $db_user ) {
	echo '<h1>ERROR</h1><p>Could not parse DB credentials from wp-config.php</p>';
	echo '<p>DB_NAME=' . htmlspecialchars( $db_name ?? 'NULL' ) . '</p>';
	echo '<p>DB_HOST=' . htmlspecialchars( $db_host ?? 'NULL' ) . '</p>';
	exit;
}

// Connect to database
$mysqli = new mysqli( $db_host ?: 'localhost', $db_user, $db_pass, $db_name );

if ( $mysqli->connect_error ) {
	echo '<h1>DB Connection Failed</h1>';
	echo '<p>' . htmlspecialchars( $mysqli->connect_error ) . '</p>';
	exit;
}

$mysqli->set_charset( 'utf8mb4' );
$options_table = $mysqli->real_escape_string( $table_prefix . 'options' );

echo '<h1 dir="rtl">Emergency Recovery Tool</h1>';
echo '<p>Connected to DB: ' . htmlspecialchars( $db_name ) . ' @ ' . htmlspecialchars( $db_host ) . '</p>';
echo '<p>Table prefix: ' . htmlspecialchars( $table_prefix ) . '</p>';
echo '<hr>';

$cleared = array();

// 1. Clear paused extensions (plugins)
$result = $mysqli->query( "SELECT option_value FROM `{$options_table}` WHERE option_name = 'paused_extensions_plugins'" );
if ( $result && $row = $result->fetch_assoc() ) {
	echo '<p>Found paused plugins: <code>' . htmlspecialchars( substr( $row['option_value'], 0, 200 ) ) . '</code></p>';
	$mysqli->query( "DELETE FROM `{$options_table}` WHERE option_name = 'paused_extensions_plugins'" );
	$cleared[] = 'paused_extensions_plugins';
}

// 2. Clear paused extensions (themes)
$result = $mysqli->query( "SELECT option_value FROM `{$options_table}` WHERE option_name = 'paused_extensions_themes'" );
if ( $result && $row = $result->fetch_assoc() ) {
	echo '<p>Found paused themes: <code>' . htmlspecialchars( substr( $row['option_value'], 0, 200 ) ) . '</code></p>';
	$mysqli->query( "DELETE FROM `{$options_table}` WHERE option_name = 'paused_extensions_themes'" );
	$cleared[] = 'paused_extensions_themes';
}

// 3. Clear recovery mode email timestamp
$mysqli->query( "DELETE FROM `{$options_table}` WHERE option_name = 'recovery_mode_email_last_sent'" );
$cleared[] = 'recovery_mode_email_last_sent';

// 4. Clear recovery keys
$result = $mysqli->query( "DELETE FROM `{$options_table}` WHERE option_name LIKE 'recovery_keys_%'" );
$cleared[] = 'recovery_keys (' . $mysqli->affected_rows . ' rows)';

// 5. Clear transients related to recovery/errors
$mysqli->query( "DELETE FROM `{$options_table}` WHERE option_name LIKE '_transient_wp_fatal_error%'" );
$mysqli->query( "DELETE FROM `{$options_table}` WHERE option_name LIKE '_transient_timeout_wp_fatal_error%'" );
$cleared[] = 'fatal_error_transients';

// 6. Show active theme for debugging
$result = $mysqli->query( "SELECT option_value FROM `{$options_table}` WHERE option_name = 'template'" );
if ( $result && $row = $result->fetch_assoc() ) {
	echo '<p>Active theme (template): <strong>' . htmlspecialchars( $row['option_value'] ) . '</strong></p>';
}
$result = $mysqli->query( "SELECT option_value FROM `{$options_table}` WHERE option_name = 'stylesheet'" );
if ( $result && $row = $result->fetch_assoc() ) {
	echo '<p>Active theme (stylesheet): <strong>' . htmlspecialchars( $row['option_value'] ) . '</strong></p>';
}

// 7. Show active plugins for debugging
$result = $mysqli->query( "SELECT option_value FROM `{$options_table}` WHERE option_name = 'active_plugins'" );
if ( $result && $row = $result->fetch_assoc() ) {
	echo '<p>Active plugins: <code>' . htmlspecialchars( substr( $row['option_value'], 0, 500 ) ) . '</code></p>';
}

echo '<hr>';
echo '<h2 style="color:green;">Cleared:</h2><ul>';
foreach ( $cleared as $item ) {
	echo '<li>' . htmlspecialchars( $item ) . '</li>';
}
echo '</ul>';

echo '<h2>Next steps:</h2>';
echo '<ol>';
echo '<li><a href="/" target="_blank">Try loading the site</a></li>';
echo '<li><a href="/wp-admin/" target="_blank">Try wp-admin</a></li>';
echo '<li>If still broken, the error is NOT recovery mode — check the PHP error log</li>';
echo '</ol>';
echo '<hr><p style="color:red;font-weight:bold;">DELETE this file after recovery!</p>';

$mysqli->close();
