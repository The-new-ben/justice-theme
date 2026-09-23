<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'JUSTICE_THEME_URI', 'https://jus-tice.co.il/wp-content/themes/justice-theme' );
define( 'JUSTICE_THEME_DIR', dirname( __DIR__ ) );

$jt_state = array( 'admin' => false, 'feed' => false, 'front' => false, 'main' => true, 'singular' => true,
	'id' => 12987, 'queried' => 12987, 'look' => true );

function add_filter( $tag, $callback, $priority = 10 ): void {}
function add_action( $tag, $callback, $priority = 10 ): void {}
function apply_filters( $tag, $value ) { return $value; }
function is_admin(): bool { global $jt_state; return $jt_state['admin']; }
function is_feed(): bool { global $jt_state; return $jt_state['feed']; }
function is_front_page(): bool { global $jt_state; return $jt_state['front']; }
function is_main_query(): bool { global $jt_state; return $jt_state['main']; }
function is_singular( $types = '' ): bool { global $jt_state; return $jt_state['singular']; }
function get_the_ID(): int { global $jt_state; return $jt_state['id']; }
function get_queried_object_id(): int { global $jt_state; return $jt_state['queried']; }
function justice_theme_new_look_active(): bool { global $jt_state; return $jt_state['look']; }
function esc_url( $url ) { return $url; }
require_once dirname( __DIR__ ) . '/inc/hadmaya-film-card.php';

$body = '<p>גוף המאמר.</p><div class="jt-answer"><p>תשובה.</p></div>';
$out  = justice_theme_film_card( $body );
if ( 0 !== strpos( $out, $body ) ) {
	throw new RuntimeException( 'The film card must come after the article body, never inside or before it.' );
}
if ( 1 !== substr_count( $out, 'data-hadmaya-film' ) ) {
	throw new RuntimeException( 'Exactly one film card was expected.' );
}
foreach ( array( '<iframe', '<video', 'autoplay', '<script' ) as $heavy ) {
	if ( false !== stripos( $out, $heavy ) ) {
		throw new RuntimeException( 'The film card must stay quiet; found ' . $heavy );
	}
}
if ( false === strpos( $out, 'loading="lazy"' ) || false === strpos( $out, 'https://jus-tice.com/he/how-it-works/' ) ) {
	throw new RuntimeException( 'The card needs a lazy poster and a link to the Hebrew film page.' );
}
if ( justice_theme_film_card( $out ) !== $out ) {
	throw new RuntimeException( 'The film card was added twice.' );
}
foreach ( array( 'front' => true, 'look' => false, 'admin' => true, 'feed' => true, 'singular' => false, 'queried' => 1 ) as $key => $value ) {
	$saved = $jt_state[ $key ];
	$jt_state[ $key ] = $value;
	if ( justice_theme_film_card( $body ) !== $body ) {
		throw new RuntimeException( 'The card must not appear when ' . $key . ' is ' . var_export( $value, true ) );
	}
	$jt_state[ $key ] = $saved;
}
echo "hadmaya film card: ok\n";
