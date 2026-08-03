<?php
/**
 * Local contract checks for justice-ops/criminal-content-release.php.
 */

declare(strict_types=1);

define( 'ABSPATH', __DIR__ );

$GLOBALS['jt_options'] = array();

function add_action( ...$args ): void {}
function apply_filters( string $tag, $value ) { return $value; }
function get_option( string $name, $default = false ) {
	return array_key_exists( $name, $GLOBALS['jt_options'] ) ? $GLOBALS['jt_options'][ $name ] : $default;
}
function wp_parse_url( string $url, int $component = -1 ) { return parse_url( $url, $component ); }
function home_url( string $path = '' ): string { return 'https://jus-tice.co.il' . $path; }
function esc_url( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }
function esc_html( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }

require_once dirname( __DIR__ ) . '/justice-ops/criminal-content-release.php';

function jt_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		fwrite( STDERR, "FAIL: {$message}\n" );
		exit( 1 );
	}
}

$_SERVER['REQUEST_URI'] = '/criminal-defense-attorney/?test=1';
$contract = justice_ops_criminal_release_contract();

$sample = <<<'HTML'
<html><head><title>עורך דין פלילי: חקירה, מעצר וכתב אישום | Jus-Tice</title></head><body class="page">
<section class="legal-pillar-hero section"><div class="container legal-pillar-hero__grid"><div><h1>עורך דין פלילי</h1><p>זומנתם לחקירה, נעצרתם או קיבלתם כתב אישום? כך בוחרים עורך דין פלילי מומלץ: השוואת סנגורים לפי סוג העבירה, שכר טרחה וזמינות למעצר, וכל שלבי ההליך הפלילי צעד אחר צעד.</p></div><aside class="legal-pillar-hero__panel" aria-label="מסלול מהיר"><strong>עורך דין פלילי</strong><ul><li><a href="https://jus-tice.co.il/criminal-law-price-list-lawyer-recommended-review-costs/">עורך דין פלילי מחירון ושכר טרחה</a></li><li><a href="https://jus-tice.co.il/detention-days/">מעצר וימי מעצר</a></li><li><a href="https://jus-tice.co.il/drug-offenses-criminal-lawyer/">עבירות סמים</a></li><li><a href="https://jus-tice.co.il/sex-crime-lawyer/">עבירות מין</a></li><li><a href="https://jus-tice.co.il/criminal-record-expungement/">מחיקת רישום פלילי</a></li><li><a href="https://jus-tice.co.il/apply-for-police-criminal-information-certificates/">תעודת יושר</a></li></ul></aside></div></section>
<section><p>עורך דין פלילי מייעץ לחשודים לפני חקירה, מייצג עצורים ונאשמים ומטפל בהליכים.</p></section>
<section><p class="section-header__eyebrow">נבדקו ונמצאו מובילים</p><h2>משרדי עורכי דין מובילים במשפט פלילי</h2></section>
</body></html>
HTML;

$GLOBALS['jt_options']['justice_ops_criminal_release_bridge_enabled'] = '0';
$result = justice_ops_criminal_release_filter_html( $sample );

jt_assert( false !== strpos( $result, $contract['new_summary'] ), 'r2 summary must replace the legacy comparison summary' );
jt_assert( false === strpos( $result, $contract['old_summary'] ), 'legacy comparison summary must be absent' );
jt_assert( false !== strpos( $result, 'data-jt-criminal-hero="2026-08-03-r2"' ), 'r2 Hero marker must be present' );
jt_assert( false !== strpos( $result, 'data-jt-criminal-release="2026-08-03-r2"' ), 'r2 body marker must be present' );
jt_assert( false === strpos( $result, 'נבדקו ונמצאו מובילים' ), 'unsupported ranking eyebrow must be absent' );
jt_assert( false === strpos( $result, 'משרדי עורכי דין מובילים במשפט פלילי' ), 'unsupported ranking heading must be absent' );
jt_assert( false !== strpos( $result, 'משרדים בתחום הפלילי' ), 'neutral eyebrow must be present' );
jt_assert( false !== strpos( $result, 'משרדי עורכי דין במשפט פלילי' ), 'neutral heading must be present' );
jt_assert( false !== strpos( $result, '<title>עורך דין פלילי: חקירה, מעצר וכתב אישום | Jus-Tice</title>' ), 'body filter must not edit the head' );

$map_source = file_get_contents( dirname( __DIR__ ) . '/justice-ops/map-cinema.php' );
jt_assert( is_string( $map_source ), 'map module must be readable' );
jt_assert( false !== strpos( $map_source, 'סיור במפת המשרדים' ), 'neutral map control must be present in the shipping map module' );
jt_assert( false === strpos( $map_source, 'סיור אווירי מעל המשרדים המובילים' ), 'unsupported map ranking label must be absent from the shipping map module' );

foreach ( $contract['new_links'] as $path => $label ) {
	jt_assert( 1 === justice_ops_criminal_release_anchor_count( $result, $path, $label ), "new Hero link must appear once: {$path}" );
}

$GLOBALS['jt_options']['justice_ops_criminal_release_r2_enabled'] = '0';
jt_assert( false === justice_ops_criminal_release_bridge_enabled(), 'explicit r2 kill switch must disable the bridge' );
jt_assert( $sample === justice_ops_criminal_release_filter_html( $sample ), 'disabled bridge must leave HTML byte-identical' );

unset( $GLOBALS['jt_options']['justice_ops_criminal_release_r2_enabled'] );
$_SERVER['REQUEST_URI'] = '/unrelated-page/';
jt_assert( $sample === justice_ops_criminal_release_filter_html( $sample ), 'unrelated page must remain byte-identical' );

fwrite( STDOUT, "PASS criminal-content-release contract checks\n" );
