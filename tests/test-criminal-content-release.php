<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

$GLOBALS['jt_test_options'] = array();

function add_action( ...$args ): void {}
function apply_filters( $tag, $value ) {
	return $value;
}
function get_option( $key, $default = false ) {
	return $GLOBALS['jt_test_options'][ $key ] ?? $default;
}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( $url, $component );
}
function home_url( $path = '' ): string {
	return 'https://jus-tice.co.il' . $path;
}
function esc_url( $value ): string {
	return (string) $value;
}
function esc_html( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}

require_once dirname( __DIR__ ) . '/justice-ops/criminal-content-release.php';

function jt_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

function jt_legacy_panel(): string {
	$contract = justice_ops_criminal_release_contract();
	$items    = '';
	foreach ( $contract['legacy_links'] as $path => $label ) {
		$items .= '<li><a href="https://jus-tice.co.il' . $path . '">' . $label . '</a></li>';
	}

	return '<aside class="legal-pillar-hero__panel" aria-label="מסלול מהיר"><strong>עורך דין פלילי</strong><ul>' . $items . '</ul></aside>';
}

$contract = justice_ops_criminal_release_contract();
$_SERVER['REQUEST_URI'] = '/criminal-defense-attorney/?acceptance=1';

$html = '<!doctype html><html><head><title>עורך דין פלילי</title></head><body class="page">'
	. '<section class="legal-pillar-hero section"><div><h1>עורך דין פלילי</h1><p>'
	. $contract['old_summary'] . '</p></div>' . jt_legacy_panel() . '</section>'
	. '<main><p>' . $contract['body_marker'] . ' ומטפל בהליך.</p>'
	. '<section><p>נבדקו ונמצאו מובילים</p><h2>משרדי עורכי דין מובילים במשפט פלילי</h2></section>'
	. '</main></body></html>';

$output = justice_ops_criminal_release_filter_html( $html );

jt_assert( $output !== $html, 'The exact approved Hero was not transformed.' );
jt_assert( false === strpos( $output, $contract['old_summary'] ), 'The legacy mixed-intent summary remained.' );
jt_assert( 1 === substr_count( $output, $contract['new_summary'] ), 'The keyword-first summary count is not one.' );
jt_assert( 1 === substr_count( $output, 'data-jt-criminal-release="2026-08-03-r2"' ), 'The release body marker is missing.' );
jt_assert( 1 === substr_count( $output, 'data-jt-criminal-hero="2026-08-03-r2"' ), 'The Hero marker is missing.' );
jt_assert( 1 === substr_count( $output, 'חקירה במשטרה: זכויות והתייעצות' ), 'Investigation link is missing.' );
jt_assert( 1 === substr_count( $output, 'מעצר: זכויות ודיון בבית המשפט' ), 'Detention link is missing.' );
jt_assert( 1 === substr_count( $output, 'כתב אישום: שלבים והגנה' ), 'Indictment link is missing.' );
jt_assert( 1 === substr_count( $output, $contract['body_marker'] ), 'Released article body was changed.' );
jt_assert( false === strpos( $output, 'נבדקו ונמצאו מובילים' ), 'The unsupported ranking eyebrow remained.' );
jt_assert( false === strpos( $output, 'משרדי עורכי דין מובילים במשפט פלילי' ), 'The unsupported ranking heading remained.' );
jt_assert( 1 === substr_count( $output, 'משרדים בתחום הפלילי' ), 'The neutral eyebrow is missing.' );
jt_assert( 1 === substr_count( $output, 'משרדי עורכי דין במשפט פלילי' ), 'The neutral heading is missing.' );

$_SERVER['REQUEST_URI'] = '/unrelated-page/';
jt_assert( $html === justice_ops_criminal_release_filter_html( $html ), 'An unrelated URL was modified.' );

$_SERVER['REQUEST_URI'] = '/criminal-defense-attorney/';
$missing_link = str_replace( '<li><a href="https://jus-tice.co.il/sex-crime-lawyer/">עבירות מין</a></li>', '', $html );
jt_assert( $missing_link === justice_ops_criminal_release_filter_html( $missing_link ), 'A changed legacy panel did not fail closed.' );

$missing_body_marker = str_replace( $contract['body_marker'], 'old article body', $html );
jt_assert( $missing_body_marker === justice_ops_criminal_release_filter_html( $missing_body_marker ), 'A stale body did not fail closed.' );

$duplicate_summary = str_replace( '</main>', '<p>' . $contract['old_summary'] . '</p></main>', $html );
jt_assert( $duplicate_summary === justice_ops_criminal_release_filter_html( $duplicate_summary ), 'A duplicate old summary did not fail closed.' );

$GLOBALS['jt_test_options']['justice_ops_criminal_release_r2_enabled'] = '0';
jt_assert( $html === justice_ops_criminal_release_filter_html( $html ), 'The disable option did not retire the bridge.' );

echo "criminal content release tests passed\n";
