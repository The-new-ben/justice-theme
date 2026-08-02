<?php
/**
 * Contract and adversarial checks for the exact comparison-page bridge.
 */

declare(strict_types=1);

define( 'ABSPATH', __DIR__ );

$jt_comparison_inline_styles = array();
$jt_comparison_json_encode_fail = false;

function add_action( ...$args ): void {}
function add_filter( ...$args ): void {}
function apply_filters( string $tag, $value ) { return $value; }
function get_option( string $name, $default = false ) { return $default; }
function wp_parse_url( string $url, int $component = -1 ) { return parse_url( $url, $component ); }
function esc_html( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }
function esc_attr( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }
function esc_url( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }
function wp_json_encode( $value, int $flags = 0, int $depth = 512 ) {
	global $jt_comparison_json_encode_fail;
	return $jt_comparison_json_encode_fail ? false : json_encode( $value, $flags, $depth );
}
function is_admin(): bool { return false; }
function wp_add_inline_style( string $handle, string $css ): bool {
	global $jt_comparison_inline_styles;
	$jt_comparison_inline_styles[ $handle ] = $css;
	return true;
}

require_once dirname( __DIR__ ) . '/justice-ops/maya-profile-release.php';
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
		'justice_ops_comparison_control_header_meta',
		'justice_ops_comparison_schema',
		'justice_ops_comparison_control_schema',
		'justice_ops_comparison_filter_html',
	) as $function_name
) {
	$declaration_pattern = '#function\s+' . preg_quote( $function_name, '#' ) . '\s*\(#';
	jt_comparison_assert( 1 === preg_match_all( $declaration_pattern, $source ), "{$function_name} must be declared exactly once" );
}
jt_comparison_assert( false === strpos( $source, 'wp_redirect' ), 'module must not redirect' );
jt_comparison_assert( false === stripos( $source, 'noindex' ), 'module must not noindex' );
jt_comparison_assert( false === strpos( $source, "'status' => 301" ), 'module must not emit a 301' );

$contract = justice_ops_comparison_content_contract();
jt_comparison_assert( '/the-recommended-family-lawyers/' === $contract['path'], 'only the preserved comparison path may be allowlisted' );
jt_comparison_assert( 'https://jus-tice.co.il/the-recommended-family-lawyers/' === $contract['canonical'], 'canonical must self-reference the preserved URL' );
jt_comparison_assert( 'השוואת עורכי דין לענייני משפחה לפי נתונים | Jus-Tice' === $contract['seo_title'], 'SEO title must own comparison intent without asserting a recommendation' );
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

$release_ledger_path = __DIR__ . '/comparison-content-release-ledger.json';
$release_ledger_raw  = file_get_contents( $release_ledger_path );
$release_ledger      = is_string( $release_ledger_raw ) ? json_decode( $release_ledger_raw, true ) : null;
jt_comparison_assert( is_array( $release_ledger ), 'tracked comparison release ledger must decode' );
jt_comparison_assert( 1 === ( $release_ledger['schema_version'] ?? 0 ), 'release ledger schema version must be exact' );
jt_comparison_assert( '2.35.4' === ( $release_ledger['release'] ?? '' ), 'release ledger must bind to 2.35.4' );
jt_comparison_assert( '/the-recommended-family-lawyers/' === ( $release_ledger['route'] ?? '' ), 'release ledger route must be exact' );
jt_comparison_assert( 'CONTROLLED_CANARY_ELIGIBLE_FACT_FIELDS_ONLY' === ( $release_ledger['release_state'] ?? '' ), 'release ledger must not overstate final publication approval' );
jt_comparison_assert( true === ( $release_ledger['editorial_reconciliation']['does_not_claim_publishable_approved'] ?? false ), 'release ledger must preserve the missing named-approval limitation' );
foreach ( array( 'named_comparison_editor', 'named_entity_verifier', 'named_legal_reviewer' ) as $unnamed_role ) {
	jt_comparison_assert( array_key_exists( $unnamed_role, $release_ledger['editorial_reconciliation'] ), "release ledger must record the omitted role: {$unnamed_role}" );
	jt_comparison_assert( null === $release_ledger['editorial_reconciliation'][ $unnamed_role ], "release ledger must not invent the omitted role: {$unnamed_role}" );
}
jt_comparison_assert( $expected_ids === ( $release_ledger['evidence_contract']['visible_candidate_ids'] ?? array() ), 'release ledger visible candidate IDs must match source order exactly' );
jt_comparison_assert( hash( 'sha256', (string) $candidate_json ) === ( $release_ledger['evidence_contract']['candidate_data_sha256'] ?? '' ), 'release ledger must bind to exact candidate evidence bytes' );
jt_comparison_assert( array( 'C001' ) === ( $release_ledger['relationship_contract']['commercial_candidate_ids'] ?? array() ), 'release ledger must identify only Maya as commercial' );
jt_comparison_assert( 12 === ( $release_ledger['relationship_contract']['noncommercial_visible_candidate_count'] ?? -1 ), 'release ledger noncommercial count must be exact' );
jt_comparison_assert( 'C005' === ( $release_ledger['evidence_contract']['excluded_candidate']['id'] ?? '' ), 'release ledger must preserve the unresolved exclusion' );

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
jt_comparison_assert( 'c56f2b4c4522d0eb19fb39edc54b7c757cfc505cf7f236a585c79ab1af75e7fb' === hash( 'sha256', $public_copy ), 'exact public comparison output changed without an explicit contract update' );
jt_comparison_assert( false !== strpos( $public_copy, 'עורכי דין מומלצים לענייני משפחה' ), 'public opening must answer family-law recommendation intent' );
jt_comparison_assert( false !== strpos( $public_copy, 'עורך דין גירושין' ), 'public opening must preserve the divorce comparison scope' );
jt_comparison_assert( 1 === substr_count( $public_copy, 'data-jt-comparison-universe="u0-2026-08-02"' ), 'public method must identify the exact U0 evidence freeze' );
foreach ( array( '1 וב־2 באוגוסט 2026', 'Google ישראל', 'ללא התאמה אישית', 'תל אביב יפו כמיקום', 'אינו מייצג את כל עורכי הדין בישראל' ) as $method_term ) {
	jt_comparison_assert( false !== strpos( $public_copy, $method_term ), "public U0 method is missing: {$method_term}" );
}
foreach ( array( 'עורך דין גירושין', 'עורך דין לענייני משפחה', 'משרד עורכי דין גירושין מומלץ', 'עורכי דין משפחה מומלצים', 'עורך דין גירושין מומלץ', 'עורכי דין גירושין מומלצים', 'עורך דין משפחה מומלץ', 'עורך דין לענייני משפחה מומלץ' ) as $query_term ) {
	jt_comparison_assert( false !== strpos( $public_copy, $query_term ), "public U0 method is missing query scope: {$query_term}" );
}
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
		'עורכי דין מובילים בדיני משפחה בישראל 2025',
		'המלצות 2026 עורך דין לענייני משפחה מומלץ',
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
$legacy_schema = '<script data-old="schema" type="application/ld+json">{"@context":"https://schema.org","@type":["Article","LegalService"],"author":{"@type":"Person","name":"Unsupported"}}</script>';
$top_reviewer = '<div class="single-article__author"><span>נבדק מקצועית על ידי עו״ד מאיה רוטנברג</span></div>';
$legacy_meta = '<div class="single-article__meta"><time datetime="2025-09-10T12:44:27+03:00">2025-09-10</time><span>4 דקות קריאה</span><span>עודכן: 2026-07-19</span></div>';
$legacy_unsafe = '<div class="legacy-wrap"><h2>עורכי דין מובילים בדיני משפחה בישראל 2025</h2><p>צמרת עורכי הדין והצלחות נוספות.</p><div><h3>מאיה רוטנברג</h3><p>הובילה את המהפכה והשיגה פסק דין.</p></div><h2>המלצות 2026 עורך דין לענייני משפחה מומלץ</h2><h3>שם לקוח ותכונה אישית</h3></div>';

$sample = '<!doctype html><html><head>' . $raw_title . $legacy_schema . '</head><body class="article" itemscope itemtype="https://schema.org/LegalService" typeof="schema:Article">'
	. $raw_style . $raw_script . $raw_textarea . $raw_template . $raw_noscript . $raw_comment
	. '<header class="single-article__header"><h1 class="single-article__title" data-old="1">כותרת ישנה</h1>'
	. $top_reviewer . $legacy_meta . '</header>'
	. '<main itemprop="mainEntity"><div class="single-article__content entry-content" data-existing="preserve-opening-tag">'
	. '<p id="legacy-opening">מאמר כללי על דיני משפחה, עלויות והליך גירושין.</p>' . $legacy_unsafe
	. '<script>const oldContent="<div>fake nested close</div>";</script>'
	. '</div><aside class="cluster-backlink"><a href="https://jus-tice.co.il/divorce-lawyer/">עמוד אב</a></aside>'
	. '<aside class="reviewer-box"><p>מידע כללי בלבד.</p></aside></main></body></html>';

$result = justice_ops_comparison_filter_html( $sample );

jt_comparison_assert( false !== strpos( $result, '<h1 class="single-article__title" data-old="1">' . $contract['h1'] . '</h1>' ), 'visible H1 must change while preserving attributes' );
jt_comparison_assert( false === strpos( $result, $top_reviewer ), 'unproved top reviewer must be removed' );
jt_comparison_assert( 1 === substr_count( $result, 'data-jt-comparison-evidence-date="2026-08-02"' ), 'controlled evidence-date marker must render exactly once' );
jt_comparison_assert( false !== strpos( $result, '<span>בדיקת המקורות: 1 וב־2 באוגוסט 2026</span>' ), 'controlled evidence date must describe the exact source-check window' );
jt_comparison_assert( false === strpos( $result, '2025-09-10' ) && false === strpos( $result, '2026-07-19' ), 'legacy publication and update dates must be removed from the rendered body' );
jt_comparison_assert( false === strpos( $result, 'legacy-opening' ), 'legacy general opening must be removed' );
jt_comparison_assert( false === strpos( $result, $legacy_unsafe ), 'unsafe legacy candidate prose must be removed' );
jt_comparison_assert( false !== strpos( $result, '<div class="single-article__content entry-content" data-existing="preserve-opening-tag"><div class="jt-comparison-reset"' ), 'content-container opening tag must be preserved and new body inserted inside it' );
jt_comparison_assert( 1 === substr_count( $result, 'data-jt-comparison-content="2026-08-02-r2"' ), 'fact-only content marker must render once' );
jt_comparison_assert( 1 === substr_count( $result, 'data-jt-comparison-reset="2026-08-02-r2"' ), 'body release marker must render once' );
jt_comparison_assert( 1 === substr_count( $result, 'id="justice-family-comparison-schema"' ), 'controlled schema must render exactly once' );
jt_comparison_assert( false === strpos( $result, $legacy_schema ), 'legacy Article and LegalService JSON-LD must be removed' );
foreach ( array( 'itemscope', 'itemtype=', 'itemprop=', 'typeof=' ) as $legacy_attribute ) {
	jt_comparison_assert( false === stripos( $result, $legacy_attribute ), "legacy structured attribute remains: {$legacy_attribute}" );
}
jt_comparison_assert( false !== strpos( $result, '<aside class="cluster-backlink">' ), 'generated cluster rail outside article content must remain' );
jt_comparison_assert( false !== strpos( $result, '<aside class="reviewer-box"><p>מידע כללי בלבד.</p></aside>' ), 'claim-free legal disclaimer outside article content must remain' );

foreach ( array( $raw_title, $raw_style, $raw_script, $raw_textarea, $raw_template, $raw_noscript, $raw_comment ) as $raw_block ) {
	jt_comparison_assert( false !== strpos( $result, $raw_block ), 'raw-text element or comment outside replaced content must remain byte-identical' );
}

$schema_match = array();
jt_comparison_assert( 1 === preg_match( '#<script type="application/ld\+json" id="justice-family-comparison-schema">([\s\S]*?)</script>#', $result, $schema_match ), 'controlled schema JSON must be extractable' );
$schema = json_decode( $schema_match[1], true );
jt_comparison_assert( is_array( $schema ) && 'https://schema.org' === ( $schema['@context'] ?? '' ), 'controlled schema context must be exact' );
jt_comparison_assert( isset( $schema['@graph'] ) && is_array( $schema['@graph'] ) && 2 === count( $schema['@graph'] ), 'controlled schema graph must contain exactly two root nodes' );
$schema_json = json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
jt_comparison_assert( is_string( $schema_json ), 'controlled schema must serialize' );
foreach ( array( 'WebPage', 'BreadcrumbList', 'ListItem' ) as $allowed_type ) {
	jt_comparison_assert( false !== strpos( $schema_json, '"@type":"' . $allowed_type . '"' ), "controlled schema is missing {$allowed_type}" );
}
foreach ( array( 'Article', 'LegalService', 'Attorney', 'Person', 'Organization', 'author', 'reviewedBy', 'aggregateRating' ) as $forbidden_schema_value ) {
	jt_comparison_assert( false === strpos( $schema_json, $forbidden_schema_value ), "unsupported schema value remains: {$forbidden_schema_value}" );
}

$visible_result = $result;
$masked_blocks  = array();
$visible_result = justice_ops_comparison_protect_raw_text( $visible_result, $masked_blocks );
jt_comparison_assert( 1 === preg_match_all( '#<h1\b#i', $visible_result ), 'rendered visible HTML must contain exactly one H1' );

jt_comparison_assert( $result === justice_ops_comparison_filter_html( $result ), 'render treatment must be idempotent' );

$spoofed_schema_marker = str_replace( '</head>', '<div id="justice-family-comparison-schema"></div></head>', $sample );
$jt_comparison_json_encode_fail = true;
jt_comparison_assert( $spoofed_schema_marker === justice_ops_comparison_filter_html( $spoofed_schema_marker ), 'schema encoding failure must restore the complete original even when a non-script ID spoofs the schema marker' );
$jt_comparison_json_encode_fail = false;

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
