<?php
/**
 * Local contract checks for justice-ops/family-content-release.php.
 */

declare(strict_types=1);

define( 'ABSPATH', __DIR__ );

function add_action( ...$args ): void {}
function add_filter( ...$args ): void {}
function apply_filters( string $tag, $value ) { return $value; }
function get_option( string $name, $default = false ) { return $default; }
function wp_parse_url( string $url, int $component = -1 ) { return parse_url( $url, $component ); }
function esc_html( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }
function is_admin(): bool { return false; }
function wp_strip_all_tags( string $value ): string { return strip_tags( $value ); }

require_once dirname( __DIR__ ) . '/justice-ops/family-content-release.php';

function jt_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		fwrite( STDERR, "FAIL: {$message}\n" );
		exit( 1 );
	}
}

$contracts = justice_ops_family_release_contracts();
jt_assert( 6 === count( $contracts ), 'contract must contain exactly six paths' );

foreach ( $contracts as $path => $contract ) {
	jt_assert( '/' === $path[0] && '/' === substr( $path, -1 ), "path must be normalized: {$path}" );
	jt_assert( 'https://jus-tice.co.il' . $path === $contract['canonical'], "canonical must self-reference: {$path}" );
	jt_assert( '' !== trim( $contract['h1'] ), "H1 must not be empty: {$path}" );
	jt_assert( 1 === substr_count( $contract['seo_title'], 'Jus-Tice' ), "brand must appear once: {$path}" );
}

$_SERVER['REQUEST_URI'] = '/family-law/?test=1';
$sample = <<<'HTML'
<html><head><title>Old title</title></head><body class="page">
<section class="legal-pillar-hero section"><div><h1 class="old">Old H1</h1><p>Old summary</p><div class="single-article__author"><span>נבדק מקצועית על ידי מאיה רוטנברג</span></div></div></section>
<p class="eeat-reviewed-footer"><strong>נבדק על ידי מאיה רוטנברג</strong></p>
<div class="jt-premium-card"><div class="jt-premium-card__body"><a class="jt-premium-card__name">משרד אחר</a><span class="jt-premium-card__meta">משרד אחר</span><p class="jt-premium-card__bio">ביוגרפיה אחרת</p></div></div>
<div class="jt-premium-card"><div class="jt-premium-card__body"><a class="jt-premium-card__name">מאיה רוטנברג</a><span class="jt-premium-card__meta">משרד מאיה רוטנברג</span><p class="jt-premium-card__bio">מעל 20 שנה בעיסוק בלעדי</p></div></div>
<form><label class="lead-form__consent"><input type="checkbox"><span>Old consent</span></label></form>
<section class="legal-pillar-reviewed section"><div>נבדק על ידי מאיה</div></section>
</body></html>
HTML;

$result = justice_ops_family_release_filter_html( $sample );
$family = $contracts['/family-law/'];

jt_assert( false !== strpos( $result, '<h1 class="old">' . $family['h1'] . '</h1>' ), 'H1 must match the release contract' );
jt_assert( false !== strpos( $result, '<p>' . $family['description'] . '</p>' ), 'practice hero summary must match the released excerpt' );
jt_assert( false === strpos( $result, 'Old summary' ), 'legacy practice hero summary must be absent' );
jt_assert( false === strpos( $result, 'נבדק על ידי' ), 'unsupported bottom reviewer claim must be absent' );
jt_assert( false === strpos( $result, 'נבדק מקצועית' ), 'unsupported top reviewer claim must be absent' );
jt_assert( 1 === substr_count( $result, 'jt-premium-card__disclosure' ), 'commercial disclosure must appear once' );
jt_assert( false !== strpos( $result, 'משרד אחר</span><p class="jt-premium-card__bio">ביוגרפיה אחרת</p>' ), 'unrelated premium card must remain unchanged' );
jt_assert( false !== strpos( $result, 'שותפה עסקית ולקוחה משלמת' ), 'commercial relationship must be explicit' );
jt_assert( false !== strpos( $result, 'אינם מהווים דירוג איכות עצמאי' ), 'commercial placement must not imply quality ranking' );
jt_assert( false === strpos( $result, 'מעל 20 שנה בעיסוק בלעדי' ), 'unsupported legacy bio must be absent' );
jt_assert( false !== strpos( $result, 'הפרטים לא יועברו לעורך דין ללא אישור נוסף ממני' ), 'consent must describe internal-only handling' );
jt_assert( false !== strpos( $result, 'data-jt-family-release="2026-08-02-r1"' ), 'release marker must be in the body' );
jt_assert( false !== strpos( $result, '<title>Old title</title>' ), 'body filter must not edit the head' );
jt_assert( $family['seo_title'] === justice_ops_family_release_title( 'old' ), 'SEO title filter must match contract' );
jt_assert( $family['description'] === justice_ops_family_release_description( 'old' ), 'description filter must match contract' );
jt_assert( $family['canonical'] === justice_ops_family_release_canonical( 'old' ), 'canonical filter must match contract' );

$_SERVER['REQUEST_URI'] = '/unrelated-page/';
jt_assert( null === justice_ops_current_family_release_contract(), 'unrelated path must not resolve a contract' );
jt_assert( $sample === justice_ops_family_release_filter_html( $sample ), 'unrelated HTML must remain byte-identical' );

fwrite( STDOUT, "PASS family-content-release contract checks\n" );
