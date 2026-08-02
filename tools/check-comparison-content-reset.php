<?php
/**
 * Contract and adversarial checks for the exact comparison-page bridge.
 */

declare(strict_types=1);

define( 'ABSPATH', __DIR__ );

$jt_comparison_inline_styles = array();

function add_action( ...$args ): void {}
function add_filter( ...$args ): void {}
function apply_filters( string $tag, $value ) { return $value; }
function get_option( string $name, $default = false ) { return $default; }
function wp_parse_url( string $url, int $component = -1 ) { return parse_url( $url, $component ); }
function esc_html( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }
function esc_attr( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }
function esc_url( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }
function is_admin(): bool { return false; }
function wp_add_inline_style( string $handle, string $css ): bool {
	global $jt_comparison_inline_styles;
	$jt_comparison_inline_styles[ $handle ] = $css;
	return true;
}

require_once dirname( __DIR__ ) . '/justice-ops/comparison-content-reset.php';

function jt_comparison_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		fwrite( STDERR, "FAIL: {$message}\n" );
		exit( 1 );
	}
}

$module_path = dirname( __DIR__ ) . '/justice-ops/comparison-content-reset.php';
$source      = file_get_contents( $module_path );
jt_comparison_assert( is_string( $source ), 'module source must be readable' );
foreach (
	array(
		'justice_ops_comparison_candidates',
		'justice_ops_comparison_public_content_html',
		'justice_ops_comparison_protect_raw_text',
		'justice_ops_comparison_restore_raw_text',
		'justice_ops_comparison_replace_article_content',
		'justice_ops_comparison_filter_html',
	) as $function_name
) {
	jt_comparison_assert( 1 === substr_count( $source, 'function ' . $function_name ), "{$function_name} must be declared exactly once" );
}
jt_comparison_assert( false === strpos( $source, 'wp_redirect' ), 'module must not redirect' );
jt_comparison_assert( false === stripos( $source, 'noindex' ), 'module must not noindex' );
jt_comparison_assert( false === strpos( $source, "'status' => 301" ), 'module must not emit a 301' );

$contract = justice_ops_comparison_content_contract();
jt_comparison_assert( '/the-recommended-family-lawyers/' === $contract['path'], 'only the preserved comparison path may be allowlisted' );
jt_comparison_assert( 'https://jus-tice.co.il/the-recommended-family-lawyers/' === $contract['canonical'], 'canonical must self-reference the preserved URL' );
jt_comparison_assert( 'עורכי דין מומלצים לענייני משפחה: השוואה | Jus-Tice' === $contract['seo_title'], 'SEO title must own family-law comparison intent' );
jt_comparison_assert( 'השוואת עורכי דין לענייני משפחה וגירושין לפי נתונים' === $contract['h1'], 'H1 must state dual-scope data comparison intent' );
foreach ( array( 'רישום פעיל', 'תחומי עיסוק', 'מיקום', 'מועד קבלה', 'מתודולוגיה', 'מקורות', 'גילוי מסחרי' ) as $description_term ) {
	jt_comparison_assert( false !== strpos( $contract['description'], $description_term ), "meta description must cover {$description_term}" );
}
jt_comparison_assert( false === strpos( $contract['h1'], 'עורך דין גירושין: בחירת' ), 'H1 must not copy the service-pillar promise' );

$candidates = justice_ops_comparison_candidates();
$expected_ids = array( 'C015', 'C004', 'C003', 'C012', 'C016', 'C006', 'C013', 'C009', 'C002', 'C017', 'C001', 'C014', 'C007' );
$actual_ids   = array_map(
	static function ( array $candidate ): string {
		return (string) $candidate['id'];
	},
	$candidates
);

jt_comparison_assert( $expected_ids === $actual_ids, 'candidate cards must use deterministic official-surname order' );
jt_comparison_assert( 13 === count( $candidates ), 'exactly thirteen verified records must be visible' );
jt_comparison_assert( ! in_array( 'C005', $actual_ids, true ), 'unresolved C005 must be excluded' );
$candidate_json = json_encode( $candidates, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
jt_comparison_assert( is_string( $candidate_json ), 'candidate evidence must serialize deterministically' );
jt_comparison_assert( 'de97cfdadec5095ead8a8ec98241231abb18180e71a05f7a824c14fb2d36ab47' === hash( 'sha256', (string) $candidate_json ), 'candidate evidence fields or ordering changed without an explicit contract update' );

$commercial_ids = array();
foreach ( $candidates as $candidate ) {
	jt_comparison_assert( preg_match( '#^https://www\.israelbar\.biz/lawyer-fd/\?lawyer=#', (string) $candidate['source'] ) === 1, 'every visible card must link to one official Bar record' );
	jt_comparison_assert( false !== strpos( (string) $candidate['status'], 'פעילה' ) || false !== strpos( (string) $candidate['status'], 'פעילים' ), 'every visible card must state its active-source match' );
	jt_comparison_assert( false !== strpos( (string) $candidate['practice'], 'דיני משפחה' ), 'every visible card must have Bar-listed family practice' );
	jt_comparison_assert( '' !== trim( (string) $candidate['admission'] ), 'admission date must be present' );
	jt_comparison_assert( '' !== trim( (string) $candidate['office'] ), 'official office must be present' );
	jt_comparison_assert( '' !== trim( (string) $candidate['checked'] ), 'source check date must be present' );
	if ( ! empty( $candidate['commercial'] ) ) {
		$commercial_ids[] = (string) $candidate['id'];
	}
}
jt_comparison_assert( array( 'C001' ) === $commercial_ids, 'Maya must be the only commercial candidate' );

$public_copy = justice_ops_comparison_public_content_html();
jt_comparison_assert( '21f8696a473afa55893bac7b5f30e36b552910b205b3ee8977838db03aef652b' === hash( 'sha256', $public_copy ), 'exact public comparison output changed without an explicit contract update' );
jt_comparison_assert( false !== strpos( $public_copy, 'עורכי דין מומלצים לענייני משפחה' ), 'public opening must answer family-law recommendation intent' );
jt_comparison_assert( false !== strpos( $public_copy, 'עורך דין גירושין' ), 'public opening must preserve the divorce comparison scope' );
jt_comparison_assert( false === strpos( $public_copy, '—' ), 'public copy must not contain an em dash' );
foreach ( array( 'בעולם הדינמי של היום', 'לסיכום ניתן לומר', 'חשוב לציין כי', 'צלילה מעמיקה' ) as $telltale ) {
	jt_comparison_assert( false === strpos( $public_copy, $telltale ), "public copy contains prohibited phrase: {$telltale}" );
}
foreach (
	array(
		'https://jus-tice.co.il/divorce-lawyer/',
		'https://jus-tice.co.il/experienced-family-law-attorney/',
		'https://jus-tice.co.il/family-law/',
		'https://jus-tice.co.il/divorce-costs-2025/',
		'https://jus-tice.co.il/lawyer-fees-guide/',
	) as $role_url
) {
	jt_comparison_assert( 1 === substr_count( $public_copy, $role_url ), "role link must appear exactly once: {$role_url}" );
}

jt_comparison_assert( 13 === substr_count( $public_copy, '<article class="jt-comparison-card' ), 'public comparison must render exactly thirteen fact cards' );
jt_comparison_assert( 13 === substr_count( $public_copy, 'כרטיס לשכת עורכי הדין' ), 'every card must expose its official source' );
jt_comparison_assert( 12 === substr_count( $public_copy, 'אין למועמד או למועמדת קשר מסחרי' ), 'every non-Maya card must disclose no commercial relationship' );
jt_comparison_assert( 1 === substr_count( $public_copy, 'data-jt-candidate="C001"' ), 'Maya must render once' );
jt_comparison_assert( 1 === substr_count( $public_copy, 'class="jt-comparison-card is-commercial"' ), 'only Maya may receive commercial styling' );
jt_comparison_assert( false !== strpos( $public_copy, 'שותפה עסקית ולקוחה משלמת' ), 'Maya relationship must be stated exactly' );
jt_comparison_assert( false !== strpos( $public_copy, 'פרופיל פרימיום בעל חשיפה מוגברת' ), 'Maya premium visibility must be stated beside her card' );
jt_comparison_assert( false === strpos( $public_copy, 'C005' ) && false === strpos( $public_copy, 'אפרים קוליו' ), 'unresolved candidate must not leak into public output' );

foreach (
	array(
		'צמרת עורכי הדין',
		'הובילה את המהפכה',
		'השיגה פסק דין',
		'הצלחות נוספות',
		'מומחיות ייחודית',
		'שירות לקוחות כערך אסטרטגי',
		'נבדק מקצועית על ידי',
		'AggregateRating',
		'reviewRating',
	) as $unsupported
) {
	jt_comparison_assert( false === strpos( $public_copy, $unsupported ), "unsupported claim leaked into public output: {$unsupported}" );
}

$_SERVER['REQUEST_URI'] = '/the-recommended-family-lawyers/?source=test';

$raw_title = '<title>כותרת עם <h1 class="single-article__title">כותרת מזויפת</h1></title>';
$raw_style = '<style>.x:after{content:"</stylex><h1 class=single-article__title>לא לשנות</h1>"}</style>';
$raw_script = '<script>const fake="</scriptx><h1 class=single-article__title>לא לשנות</h1><div class=single-article__author>לא למחוק</div>";</script>';
$raw_textarea = '<textarea><h1 class="single-article__title">לא לשנות</h1></textarea>';
$raw_template = '<template><h1 class="single-article__title">לא לשנות</h1><div>תבנית</div></template>';
$raw_noscript = '<noscript><h1 class="single-article__title">לא לשנות</h1></noscript>';
$raw_comment = '<!-- <h1 class="single-article__title">לא לשנות</h1><div class="single-article__author">לא למחוק הערה</div> -->';
$top_reviewer = '<div class="single-article__author"><span>נבדק מקצועית על ידי עו״ד מאיה רוטנברג</span></div>';
$legacy_unsafe = '<div class="legacy-wrap"><p>צמרת עורכי הדין והצלחות נוספות.</p><div><h3>מאיה רוטנברג</h3><p>הובילה את המהפכה והשיגה פסק דין.</p></div><h3>שם לקוח ותכונה אישית</h3></div>';

$sample = '<!doctype html><html><head>' . $raw_title . '</head><body class="article">'
	. $raw_style . $raw_script . $raw_textarea . $raw_template . $raw_noscript . $raw_comment
	. '<header class="single-article__header"><h1 class="single-article__title" data-old="1">כותרת ישנה</h1>'
	. $top_reviewer . '<div class="single-article__meta">2026-07-19</div></header>'
	. '<main><div class="single-article__content entry-content" data-existing="preserve-opening-tag">'
	. '<p id="legacy-opening">מאמר כללי על דיני משפחה, עלויות והליך גירושין.</p>' . $legacy_unsafe
	. '<script>const oldContent="<div>fake nested close</div>";</script>'
	. '</div><aside class="cluster-backlink"><a href="https://jus-tice.co.il/divorce-lawyer/">עמוד אב</a></aside>'
	. '<aside class="reviewer-box"><p>מידע כללי בלבד.</p></aside></main></body></html>';

$result = justice_ops_comparison_filter_html( $sample );

jt_comparison_assert( false !== strpos( $result, '<h1 class="single-article__title" data-old="1">' . $contract['h1'] . '</h1>' ), 'visible H1 must change while preserving attributes' );
jt_comparison_assert( false === strpos( $result, $top_reviewer ), 'unproved top reviewer must be removed' );
jt_comparison_assert( false === strpos( $result, 'legacy-opening' ), 'legacy general opening must be removed' );
jt_comparison_assert( false === strpos( $result, $legacy_unsafe ), 'unsafe legacy candidate prose must be removed' );
jt_comparison_assert( false !== strpos( $result, '<div class="single-article__content entry-content" data-existing="preserve-opening-tag"><div class="jt-comparison-reset"' ), 'content-container opening tag must be preserved and new body inserted inside it' );
jt_comparison_assert( 1 === substr_count( $result, 'data-jt-comparison-content="2026-08-02-r2"' ), 'fact-only content marker must render once' );
jt_comparison_assert( 1 === substr_count( $result, 'data-jt-comparison-reset="2026-08-02-r2"' ), 'body release marker must render once' );
jt_comparison_assert( false !== strpos( $result, '<aside class="cluster-backlink">' ), 'generated cluster rail outside article content must remain' );
jt_comparison_assert( false !== strpos( $result, '<aside class="reviewer-box"><p>מידע כללי בלבד.</p></aside>' ), 'claim-free legal disclaimer outside article content must remain' );

foreach ( array( $raw_title, $raw_style, $raw_script, $raw_textarea, $raw_template, $raw_noscript, $raw_comment ) as $raw_block ) {
	jt_comparison_assert( false !== strpos( $result, $raw_block ), 'raw-text element or comment outside replaced content must remain byte-identical' );
}

$visible_result = $result;
$masked_blocks  = array();
$visible_result = justice_ops_comparison_protect_raw_text( $visible_result, $masked_blocks );
jt_comparison_assert( 1 === preg_match_all( '#<h1\b#i', $visible_result ), 'rendered visible HTML must contain exactly one H1' );

jt_comparison_assert( $result === justice_ops_comparison_filter_html( $result ), 'render treatment must be idempotent' );
jt_comparison_assert( $contract['seo_title'] === justice_ops_comparison_title( 'old title' ), 'SEO title filter must return contract value on target' );
jt_comparison_assert( $contract['description'] === justice_ops_comparison_description( 'old description' ), 'description filter must return contract value on target' );
jt_comparison_assert( $contract['canonical'] === justice_ops_comparison_canonical( 'old canonical' ), 'canonical filter must return contract value on target' );

justice_ops_comparison_enqueue_styles();
jt_comparison_assert( isset( $jt_comparison_inline_styles['justice-ops-relevance'] ), 'target page styles must attach to the existing versioned handle' );
jt_comparison_assert( false !== strpos( $jt_comparison_inline_styles['justice-ops-relevance'], '.jt-comparison-card.is-commercial' ), 'commercial candidate style must be present' );

$missing_container = '<html><body><header><h1 class="single-article__title">Old</h1>' . $top_reviewer . '</header></body></html>';
jt_comparison_assert( $missing_container === justice_ops_comparison_filter_html( $missing_container ), 'missing content container must fail closed without partial mutation' );

$_SERVER['REQUEST_URI'] = '/divorce-lawyer/';
jt_comparison_assert( false === justice_ops_comparison_is_target(), 'service pillar must not enter comparison bridge' );
jt_comparison_assert( $sample === justice_ops_comparison_filter_html( $sample ), 'service pillar HTML must remain byte-identical' );
jt_comparison_assert( 'old title' === justice_ops_comparison_title( 'old title' ), 'service pillar title must remain unchanged' );

$_SERVER['REQUEST_URI'] = '/unrelated-page/';
jt_comparison_assert( $sample === justice_ops_comparison_filter_html( $sample ), 'unrelated HTML must remain byte-identical' );

fwrite( STDOUT, "PASS comparison-content-reset contract and adversarial checks\n" );
