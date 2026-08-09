<?php
/**
 * Local contract checks for justice-ops/maya-profile-release.php.
 */

declare(strict_types=1);

define( 'ABSPATH', __DIR__ );

$jt_actions = array();
$jt_filters = array();
$jt_routes  = array();
$jt_meta    = array(
	'_yoast_wpseo_title'    => array( 'legacy title' ),
	'_yoast_wpseo_metadesc' => array( 'legacy description' ),
);
$jt_options = array();
$jt_post    = null;
$jt_singular = true;
$jt_queried_id = 11687;
$jt_fail_meta_key = '';
$jt_uuid_counter = 0;
$jt_can_edit_profile = true;
$jt_meta_write_without_evidence = false;
$jt_fail_delete_option_name = '';
$jt_wpdb_before_query = null;
$jt_cache_deletes = array();

class WP_Post {
	public $ID;
	public $post_type;
	public $post_name;
	public $post_status;
	public $post_modified_gmt;

	public function __construct() {
		$this->ID                = 11687;
		$this->post_type         = 'articles';
		$this->post_name         = 'family-law-lawyer-recommended-divorce-wills-inheritances';
		$this->post_status       = 'publish';
		$this->post_modified_gmt = '2026-08-02 01:00:00';
	}
}

class WP_Error {
	public $code;
	public $message;
	public $data;

	public function __construct( string $code, string $message, array $data = array() ) {
		$this->code    = $code;
		$this->message = $message;
		$this->data    = $data;
	}
}

class WP_REST_Request {
	private $params;

	public function __construct( array $params ) {
		$this->params = $params;
	}

	public function get_json_params(): array {
		return $this->params;
	}
}

class Justice_Maya_Profile_Test_Wpdb {
	public $options = 'wp_options';

	public function prepare( string $query, ...$args ) {
		return array( 'query' => $query, 'args' => $args );
	}

	public function query( $prepared ) {
		global $jt_options, $jt_wpdb_before_query;
		if (
			! is_array( $prepared )
			|| false === strpos( (string) ( $prepared['query'] ?? '' ), 'DELETE FROM wp_options' )
			|| 2 !== count( $prepared['args'] ?? array() )
		) {
			return false;
		}
		if ( is_callable( $jt_wpdb_before_query ) ) {
			$callback             = $jt_wpdb_before_query;
			$jt_wpdb_before_query = null;
			$callback();
		}
		$name     = (string) $prepared['args'][0];
		$expected = (string) $prepared['args'][1];
		if ( ! array_key_exists( $name, $jt_options ) || maybe_serialize( $jt_options[ $name ] ) !== $expected ) {
			return 0;
		}
		unset( $jt_options[ $name ] );
		return 1;
	}
}

$wpdb = new Justice_Maya_Profile_Test_Wpdb();

function add_action( string $hook, $callback, int $priority = 10, int $accepted_args = 1 ): void {
	global $jt_actions;
	$jt_actions[ $hook ][] = array( $callback, $priority, $accepted_args );
}

function add_filter( string $hook, $callback, int $priority = 10, int $accepted_args = 1 ): void {
	global $jt_filters;
	$jt_filters[ $hook ][] = array( $callback, $priority, $accepted_args );
}

function is_singular( $type = '' ): bool {
	global $jt_singular;
	return $jt_singular && ( '' === $type || 'articles' === $type );
}

function get_queried_object_id(): int {
	global $jt_queried_id;
	return $jt_queried_id;
}

function is_admin(): bool { return false; }
function in_the_loop(): bool { return true; }
function is_main_query(): bool { return true; }
function wp_parse_url( string $url, int $component = -1 ) { return parse_url( $url, $component ); }
function esc_html( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }
function esc_attr( string $value ): string { return htmlspecialchars( $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' ); }
function wp_json_encode( $value, int $flags = 0 ) { return json_encode( $value, $flags ); }
function __return_empty_array(): array { return array(); }
function apply_filters( string $hook, $value ) { return $value; }
function maybe_serialize( $value ) { return is_array( $value ) || is_object( $value ) ? serialize( $value ) : $value; }
function wp_cache_delete( string $key, string $group = '' ): bool {
	global $jt_cache_deletes;
	$jt_cache_deletes[] = array( $key, $group );
	return true;
}
function current_user_can( string $capability, int $post_id = 0 ): bool {
	global $jt_can_edit_profile;
	return $jt_can_edit_profile && 'edit_post' === $capability && 11687 === $post_id;
}
function register_rest_route( string $namespace, string $route, array $args ): void {
	global $jt_routes;
	$jt_routes[ $namespace . $route ] = $args;
}
function rest_ensure_response( $value ) { return $value; }
function is_wp_error( $value ): bool { return $value instanceof WP_Error; }
function wp_generate_uuid4(): string {
	global $jt_uuid_counter;
	$jt_uuid_counter++;
	return sprintf( '00000000-0000-4000-8000-%012d', $jt_uuid_counter );
}

function get_post( int $post_id ) {
	global $jt_post;
	if ( null === $jt_post ) {
		$jt_post = new WP_Post();
	}
	return 11687 === $post_id ? $jt_post : null;
}

function get_permalink( $post ): string {
	return 'https://jus-tice.co.il/family-law-lawyer-recommended-divorce-wills-inheritances/';
}

function get_post_meta( int $post_id, string $key, bool $single = false ) {
	global $jt_meta;
	if ( 11687 !== $post_id ) {
		return $single ? '' : array();
	}
	$rows = isset( $jt_meta[ $key ] ) && is_array( $jt_meta[ $key ] ) ? array_values( $jt_meta[ $key ] ) : array();
	return $single ? ( isset( $rows[0] ) ? $rows[0] : '' ) : $rows;
}

function jt_maya_meta_mutation_allowed( int $post_id, string $key ): bool {
	global $jt_fail_meta_key, $jt_meta, $jt_meta_write_without_evidence, $jt_options;
	if ( 11687 !== $post_id ) {
		return false;
	}
	if (
		in_array( $key, array( '_yoast_wpseo_title', '_yoast_wpseo_metadesc' ), true )
		&& ! isset( $jt_options['justice_ops_maya_profile_seo_rollback_evidence'] )
	) {
		$jt_meta_write_without_evidence = true;
	}
	if ( $jt_fail_meta_key === $key ) {
		return false;
	}
	return true;
}

function update_post_meta( int $post_id, string $key, $value, $previous = '' ) {
	global $jt_meta;
	if ( ! jt_maya_meta_mutation_allowed( $post_id, $key ) ) {
		return false;
	}
	$rows = isset( $jt_meta[ $key ] ) && is_array( $jt_meta[ $key ] ) ? array_values( $jt_meta[ $key ] ) : array();
	if ( array() === $rows ) {
		$jt_meta[ $key ] = array( $value );
		return true;
	}
	if ( '' !== $previous && $rows[0] !== $previous ) {
		return false;
	}
	$jt_meta[ $key ] = array( $value );
	return true;
}

function add_post_meta( int $post_id, string $key, $value, bool $unique = false ) {
	global $jt_meta;
	if ( ! jt_maya_meta_mutation_allowed( $post_id, $key ) ) {
		return false;
	}
	$rows = isset( $jt_meta[ $key ] ) && is_array( $jt_meta[ $key ] ) ? array_values( $jt_meta[ $key ] ) : array();
	if ( $unique && array() !== $rows ) {
		return false;
	}
	$rows[]         = $value;
	$jt_meta[ $key ] = $rows;
	return true;
}

function delete_post_meta( int $post_id, string $key, $value = '' ): bool {
	global $jt_meta;
	if ( ! jt_maya_meta_mutation_allowed( $post_id, $key ) ) {
		return false;
	}
	$rows = isset( $jt_meta[ $key ] ) && is_array( $jt_meta[ $key ] ) ? array_values( $jt_meta[ $key ] ) : array();
	$kept = array_values(
		array_filter(
			$rows,
			static function ( $row ) use ( $value ): bool {
				return $row !== $value;
			}
		)
	);
	if ( count( $kept ) === count( $rows ) ) {
		return false;
	}
	if ( array() === $kept ) {
		unset( $jt_meta[ $key ] );
	} else {
		$jt_meta[ $key ] = $kept;
	}
	return true;
}

function get_option( string $name, $default = false ) {
	global $jt_options;
	return array_key_exists( $name, $jt_options ) ? $jt_options[ $name ] : $default;
}

function add_option( string $name, $value, string $deprecated = '', $autoload = null ): bool {
	global $jt_options;
	if ( array_key_exists( $name, $jt_options ) ) {
		return false;
	}
	$jt_options[ $name ] = $value;
	return true;
}

function delete_option( string $name ): bool {
	global $jt_fail_delete_option_name, $jt_options;
	if ( $jt_fail_delete_option_name === $name ) {
		return false;
	}
	if ( ! array_key_exists( $name, $jt_options ) ) {
		return false;
	}
	unset( $jt_options[ $name ] );
	return true;
}

require_once dirname( __DIR__ ) . '/justice-ops/maya-profile-release.php';

function jt_maya_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		fwrite( STDERR, "FAIL: {$message}\n" );
		exit( 1 );
	}
}

function jt_maya_schema_types( array $node ): array {
	$types = array();
	$walk  = static function ( $value ) use ( &$walk, &$types ): void {
		if ( ! is_array( $value ) ) {
			return;
		}
		if ( isset( $value['@type'] ) && is_string( $value['@type'] ) ) {
			$types[] = $value['@type'];
		}
		foreach ( $value as $child ) {
			$walk( $child );
		}
	};
	$walk( $node );
	return array_values( array_unique( $types ) );
}

function jt_maya_rollback_payload( array $evidence, array $current ): array {
	return array(
		'token'           => $evidence['token'],
		'evidence_sha256' => $evidence['evidence_sha256'],
		'expected'        => array(
			'modified_gmt'         => $evidence['modified_gmt'],
			'current_state_sha256' => $current['state_sha256'],
			'prior_state_sha256'   => $evidence['prior']['state_sha256'],
		),
	);
}

function jt_maya_finalize_payload( array $evidence, array $current ): array {
	return array(
		'post_id'         => 11687,
		'token'           => $evidence['token'],
		'evidence_sha256' => $evidence['evidence_sha256'],
		'expected'        => array(
			'modified_gmt'         => $evidence['modified_gmt'],
			'current_state_sha256' => $current['state_sha256'],
		),
	);
}

$contract = justice_ops_maya_profile_release_contract();
jt_maya_assert( 11687 === $contract['post_id'], 'contract must remain pinned to post 11687' );
jt_maya_assert( 'articles' === $contract['post_type'], 'contract must remain pinned to the articles type' );
jt_maya_assert( 'https://jus-tice.co.il' . $contract['path'] === $contract['canonical'], 'canonical must preserve the public URL' );
jt_maya_assert( '2026-08-02' === $contract['source_checked'], 'source-check date must be 2026-08-02' );

$_SERVER['REQUEST_URI'] = $contract['path'] . '?release-test=1';
jt_maya_assert( justice_ops_maya_profile_release_is_request(), 'exact path and record must match' );
$jt_options['justice_ops_maya_profile_release_enabled'] = '0';
jt_maya_assert( ! justice_ops_maya_profile_release_is_request(), 'retirement option must disable the render bridge' );
unset( $jt_options['justice_ops_maya_profile_release_enabled'] );
jt_maya_assert( $contract['seo_title'] === justice_ops_maya_profile_release_seo_title( 'old title' ), 'SEO title must be exact' );
jt_maya_assert( $contract['description'] === justice_ops_maya_profile_release_description( 'old description' ), 'meta description must be exact' );
jt_maya_assert( $contract['canonical'] === justice_ops_maya_profile_release_canonical( 'old canonical' ), 'canonical must stay self-referential' );
jt_maya_assert( $contract['h1'] === justice_ops_maya_profile_release_post_title( 'old H1', 11687 ), 'visible title must be exact' );
jt_maya_assert( 'unrelated' === justice_ops_maya_profile_release_post_title( 'unrelated', 12 ), 'unrelated post titles must remain unchanged' );

$body = justice_ops_maya_profile_release_content( 'legacy body' );
jt_maya_assert( false === strpos( $body, 'legacy body' ), 'legacy mixed-intent body must be replaced' );
jt_maya_assert( false === stripos( $body, '<h1' ), 'raw controlled body must leave the single H1 to the template' );
jt_maya_assert( 1 === preg_match( '#^<section[^>]+>\s*<p>זהו פרופיל מקורות[\s\S]*?</p>\s*<p[^>]+data-jt-profile-transparency="visibility-policy"#u', $body ), 'neutral visibility note must immediately follow the opening paragraph' );
jt_maya_assert( 1 === substr_count( $body, 'data-jt-profile-transparency="visibility-policy"' ), 'visibility note must have one stable DOM hook' );
jt_maya_assert( false !== strpos( $body, 'role="note" aria-label="הבהרת נראות"' ), 'visibility note must have an accessible label' );
jt_maya_assert( false === strpos( $body, 'שותפה עסקית' ), 'partner claim must not appear in public profile copy' );
jt_maya_assert( false === strpos( $body, 'לקוחה משלמת' ), 'paying-client claim must not appear in public profile copy' );
jt_maya_assert( false === strpos( $body, 'פרופיל פרימיום' ), 'candidate-specific premium claim must not appear in public profile copy' );
jt_maya_assert( false === strpos( $body, 'data-jt-commercial-disclosure' ), 'candidate-specific commercial disclosure hook must be absent' );
foreach ( array( 'חשיפה מוגברת', 'הקשר העסקי, התשלום', 'התשלום והשותפות', 'גילוי על הקשר המסחרי ל-Jus-Tice' ) as $forbidden_relationship_copy ) {
	jt_maya_assert( false === strpos( $body, $forbidden_relationship_copy ), "candidate-specific relationship copy must be absent: {$forbidden_relationship_copy}" );
}
jt_maya_assert( false !== strpos( $body, 'תוכן שיווקי ופרסומי שפורסם ב-Ynet' ), 'Ynet must be labelled sponsored publisher content' );
jt_maya_assert( false !== strpos( $body, 'לא כאימות עיתונאי עצמאי' ), 'Ynet must not be presented as independent corroboration' );
$ynet_paragraph_match = preg_match( '#<p>[^<]*(?:<a[^>]+>[^<]+</a>[^<]*)+Ynet[^<]*לא כאימות עיתונאי עצמאי\.</p>#u', $body );
jt_maya_assert( 1 === $ynet_paragraph_match, 'Ynet label and non-independent status must appear in the linked paragraph' );
jt_maya_assert( false !== strpos( $body, 'ביום 2.8.2026' ), 'visible source-check date must be 2.8.2026' );
jt_maya_assert( false === strpos( $body, 'ביום 1.8.2026' ), 'stale source-check date must be absent' );
jt_maya_assert( false === stripos( $body, 'mailto:' ), 'provider mailto must be absent' );
jt_maya_assert( false === stripos( $body, 'wa.me' ), 'provider WhatsApp CTA must be absent' );
jt_maya_assert( 2 === substr_count( $body, 'href="https://rotenberglaw.co.il/about" rel="sponsored"' ), 'every link to the external provider property must be marked sponsored' );
jt_maya_assert( false === strpos( $body, 'href="https://rotenberglaw.co.il/about">' ), 'no unqualified external-provider link may remain' );
jt_maya_assert( false === strpos( $body, 'reviewedBy' ), 'reviewer schema claim must be absent from copy' );
jt_maya_assert( false === strpos( $body, 'מספר רישיון 32125' ), 'unverified licence number must be absent' );
jt_maya_assert( false === strpos( $body, 'לקוחות מרוצים' ), 'unverified customer claim must be absent' );
jt_maya_assert( false === strpos( $body, 'למעלה מ-20 שנות ניסיון' ), 'conflicted experience claim must be absent' );
jt_maya_assert( 0 === preg_match( '/[—–]/u', $body ), 'public copy must not contain em or en dashes' );
foreach ( array( '<script', '<style', '<iframe', ' onclick=', ' onload=', ' onerror=' ) as $forbidden_markup ) {
	jt_maya_assert( false === stripos( $body, $forbidden_markup ), "controlled body must not contain {$forbidden_markup}" );
}

$transparency_text = '';
if ( preg_match( '#<p[^>]+data-jt-profile-transparency="visibility-policy"[^>]*>([\s\S]*?)</p>#u', $body, $transparency_match ) ) {
	$transparency_text = trim( preg_replace( '/\s+/u', ' ', strip_tags( $transparency_match[1] ) ) );
}
jt_maya_assert(
	'הבהרת נראות: הופעה, מיקום והיקף חשיפה של פרופילים באתר עשויים להיות מושפעים משיקולים מסחריים ועריכתיים. הם אינם דירוג מקצועי, המלצה, הצהרה על עצמאות מסחרית או הבטחת התאמה.' === $transparency_text,
	'neutral visibility note normalized text must be exact'
);

$schema = justice_ops_maya_profile_release_schema();
$types  = jt_maya_schema_types( $schema );
sort( $types );
jt_maya_assert( array( 'BreadcrumbList', 'ListItem', 'WebPage' ) === $types, 'schema types must equal the exact current allowlist' );
jt_maya_assert( 2 === count( $schema['@graph'] ), 'schema graph must contain only WebPage and BreadcrumbList roots' );
jt_maya_assert(
	justice_ops_maya_profile_release_exact_keys( $schema['@graph'][0], array( '@type', '@id', 'url', 'name', 'description', 'inLanguage' ) ),
	'WebPage schema properties must equal the exact current allowlist'
);
jt_maya_assert(
	justice_ops_maya_profile_release_exact_keys( $schema['@graph'][1], array( '@type', '@id', 'itemListElement' ) ),
	'BreadcrumbList schema properties must equal the exact current allowlist'
);
jt_maya_assert( 3 === count( $schema['@graph'][1]['itemListElement'] ), 'breadcrumb schema must contain exactly three list items' );
foreach ( $schema['@graph'][1]['itemListElement'] as $index => $list_item ) {
	jt_maya_assert(
		justice_ops_maya_profile_release_exact_keys( $list_item, array( '@type', 'position', 'name', 'item' ) ),
		'ListItem schema properties must equal the exact current allowlist'
	);
	jt_maya_assert( $index + 1 === $list_item['position'], 'breadcrumb positions must be exact and contiguous' );
}
$schema_json = json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
foreach ( array( 'mainEntity', 'reviewedBy', 'worksFor', 'aggregateRating', 'review', 'award', 'foundingDate', 'hasCredential', 'sameAs' ) as $forbidden_property ) {
	jt_maya_assert( false === strpos( (string) $schema_json, '"' . $forbidden_property . '"' ), "schema must not claim {$forbidden_property}" );
}

$sample = <<<'HTML'
<html itemscope itemtype="https://schema.org/Article" typeof="Article"><head>
<script type="application/ld+json">{"@type":"Article","publisher":{"@type":"LegalService"}}</script>
<script TYPE='application/ld+json'>{"@type":"WebSite"}</script>
<script>window.keepMe = true;</script>
</head><body class="single" itemscope itemtype="https://schema.org/Article" typeof="LegalService"><h1 class="entry-title" itemprop="headline">Legacy H1</h1>
<div class="single-article__author">נבדק מקצועית על ידי אדם לא מאומת</div>
<main property="author"><section data-jt-maya-profile-content="2026-08-02-r2">Profile body</section></main>
</body></html>
HTML;

$rendered = justice_ops_maya_profile_release_filter_html( $sample );
jt_maya_assert( 1 === substr_count( $rendered, 'type="application/ld+json"' ), 'final HTML must contain exactly one JSON-LD script' );
jt_maya_assert( false === strpos( $rendered, '"@type":"Article"' ), 'legacy Article schema must be absent' );
jt_maya_assert( false === strpos( $rendered, '"@type":"LegalService"' ), 'legacy LegalService schema must be absent' );
jt_maya_assert( false === strpos( $rendered, '"@type":"WebSite"' ), 'legacy WebSite schema must be absent' );
jt_maya_assert( false !== strpos( $rendered, 'window.keepMe = true' ), 'non-schema scripts must remain unchanged' );
jt_maya_assert( false !== strpos( $rendered, '<h1 class="entry-title">' . $contract['h1'] . '</h1>' ), 'rendered H1 must match the contract' );
jt_maya_assert( false === strpos( $rendered, 'נבדק מקצועית' ), 'unsupported visible reviewer claim must be absent' );
foreach ( array( 'itemscope', 'itemtype=', 'itemprop=', 'typeof=', 'property="author"' ) as $structured_attribute ) {
	jt_maya_assert( false === strpos( $rendered, $structured_attribute ), "unsupported body structured attribute must be absent: {$structured_attribute}" );
}
jt_maya_assert( false !== strpos( $rendered, 'data-jt-maya-profile-release="2026-08-02-r2"' ), 'release marker must be present' );
$rendered_schema_match = preg_match( '#<script type="application/ld\+json" id="justice-maya-profile-schema">([\s\S]*?)</script>#u', $rendered, $rendered_schema_parts );
jt_maya_assert( 1 === $rendered_schema_match, 'controlled JSON-LD script must be extractable' );
$rendered_schema = json_decode( $rendered_schema_parts[1], true );
jt_maya_assert( is_array( $rendered_schema ), 'controlled JSON-LD must parse successfully' );
jt_maya_assert( $schema === $rendered_schema, 'rendered JSON-LD must equal the reviewed schema contract' );

$json_ld_adversarial = <<<'HTML'
<html><head>
<!-- keep <script type="application/ld+json">{"comment":"visible"}</script> -->
<textarea>keep <script type="application/ld+json">{"textarea":"visible"}</script></textarea>
<script>const keep = "<script type='application/ld+json'>{script text}</script>";</script>
<script data-expression="1 > 0" type="application/ld+json">{"legacyQuoted":"Article"}</script>
<script TYPE = ' application/ld+json ' data-expression="2 > 1">{"legacySpaced":"WebSite"}</script>
</head><body>Profile</body></html>
HTML;
$json_ld_clean = justice_ops_maya_profile_release_remove_json_ld_scripts( $json_ld_adversarial );
foreach (
	array(
		'<!-- keep <script type="application/ld+json">{"comment":"visible"}</script> -->',
		'<textarea>keep <script type="application/ld+json">{"textarea":"visible"}</script></textarea>',
		'<script>const keep = "<script type=\'application/ld+json\'>{script text}</script>";</script>',
	) as $preserved_json_ld_text
) {
	jt_maya_assert( false !== strpos( $json_ld_clean, $preserved_json_ld_text ), 'JSON-LD cleanup must preserve non-schema raw text and comments exactly' );
}
jt_maya_assert( false === strpos( $json_ld_clean, 'legacyQuoted' ), 'quote-aware JSON-LD cleanup must remove a script after an attribute containing >' );
jt_maya_assert( false === strpos( $json_ld_clean, 'legacySpaced' ), 'JSON-LD cleanup must normalize the actual type attribute value' );

$adversarial_markup = <<<'HTML'
<html itemscope><head><meta property="og:title" content="Keep"><script>const fakeClose = "</script-not-real><body property='fake'><span itemprop='fake'>"; const itemprop = "headline";</script><title>Read about property and itemprop</title></head>
<body about="legacy"><script>const property = 1; const about = 2; const itemprop = "<span itemprop='x'>";</script>
<style>.about .property{display:block}</style><textarea>about property itemprop</textarea>
<p>Read about property resource prefix itemprop without mutation.</p>
<!-- keep property="author" and itemprop="headline" byte-identical -->
<div data-copy="property=author itemprop=headline" data-expression="1 > 0" property="author" itemprop="headline">Profile</div></body></html>
HTML;
$adversarial_clean = justice_ops_maya_profile_release_strip_body_structured_attributes( $adversarial_markup );
foreach (
	array(
		'<script>const fakeClose = "</script-not-real><body property=\'fake\'><span itemprop=\'fake\'>"; const itemprop = "headline";</script>',
		'<script>const property = 1; const about = 2; const itemprop = "<span itemprop=\'x\'>";</script>',
		'<style>.about .property{display:block}</style>',
		'<textarea>about property itemprop</textarea>',
		'<title>Read about property and itemprop</title>',
		'<p>Read about property resource prefix itemprop without mutation.</p>',
		'<!-- keep property="author" and itemprop="headline" byte-identical -->',
		'<meta property="og:title" content="Keep">',
		'data-copy="property=author itemprop=headline"',
		'data-expression="1 > 0"',
	) as $preserved_markup
) {
	jt_maya_assert(
		false !== strpos( $adversarial_clean, $preserved_markup ),
		'tag-scoped sanitization must preserve script, style, text, comments, head Open Graph, and unrelated attributes: ' . $preserved_markup
	);
}
jt_maya_assert( false === strpos( $adversarial_clean, '<html itemscope' ), 'actual html itemscope must be removed' );
jt_maya_assert( false === strpos( $adversarial_clean, '<body about=' ), 'actual body about attribute must be removed' );
jt_maya_assert(
	false !== strpos( $adversarial_clean, '<div data-copy="property=author itemprop=headline" data-expression="1 > 0">Profile</div>' ),
	'only the actual div property and itemprop attributes may be removed'
);

$uncontrolled_sample = str_replace( ' data-jt-maya-profile-content="2026-08-02-r2"', '', $sample );
$uncontrolled_result = justice_ops_maya_profile_release_filter_html( $uncontrolled_sample );
jt_maya_assert( false === strpos( $uncontrolled_result, 'application/ld+json' ), 'legacy schema must be removed when the controlled body marker is missing' );
jt_maya_assert( false === strpos( $uncontrolled_result, 'data-jt-maya-profile-release=' ), 'release marker must not claim success when controlled content is missing' );

$_SERVER['REQUEST_URI'] = '/unrelated-page/';
jt_maya_assert( ! justice_ops_maya_profile_release_is_request(), 'unrelated path must not match' );
jt_maya_assert( 'unchanged body' === justice_ops_maya_profile_release_content( 'unchanged body' ), 'unrelated body must remain byte-identical' );
jt_maya_assert( $sample === justice_ops_maya_profile_release_filter_html( $sample ), 'unrelated HTML must remain byte-identical' );

$_SERVER['REQUEST_URI'] = $contract['path'];
$jt_queried_id          = 999;
jt_maya_assert( ! justice_ops_maya_profile_release_is_request(), 'path collision with another queried record must fail closed' );
$jt_queried_id = 11687;

foreach ( $jt_actions['rest_api_init'] as $rest_registration ) {
	call_user_func( $rest_registration[0] );
}
jt_maya_assert( isset( $jt_routes['justice-ops/v1/maya-profile-seo'] ), 'forward metadata route must be registered' );
jt_maya_assert( isset( $jt_routes['justice-ops/v1/maya-profile-seo-rollback'] ), 'successful-write rollback route must be registered' );
jt_maya_assert( isset( $jt_routes['justice-ops/v1/maya-profile-seo-finalize'] ), 'successful-write finalize route must be registered' );
jt_maya_assert( 'POST' === $jt_routes['justice-ops/v1/maya-profile-seo-rollback']['methods'], 'rollback route must accept POST only' );
jt_maya_assert( 'POST' === $jt_routes['justice-ops/v1/maya-profile-seo-finalize']['methods'], 'finalize route must accept POST only' );
jt_maya_assert( true === call_user_func( $jt_routes['justice-ops/v1/maya-profile-seo-rollback']['permission_callback'] ), 'rollback route must require exact post edit capability' );
jt_maya_assert( true === call_user_func( $jt_routes['justice-ops/v1/maya-profile-seo-finalize']['permission_callback'] ), 'finalize route must require exact post edit capability' );
$jt_can_edit_profile = false;
jt_maya_assert( false === call_user_func( $jt_routes['justice-ops/v1/maya-profile-seo-rollback']['permission_callback'] ), 'rollback route must deny a user without profile edit capability' );
jt_maya_assert( false === call_user_func( $jt_routes['justice-ops/v1/maya-profile-seo-finalize']['permission_callback'] ), 'finalize route must deny a user without profile edit capability' );
foreach ( $jt_routes['justice-ops/v1/maya-profile-seo'] as $forward_handler ) {
	jt_maya_assert( false === call_user_func( $forward_handler['permission_callback'] ), 'forward metadata route must deny a user without profile edit capability' );
}
$jt_can_edit_profile = true;

$lock_name = justice_ops_maya_profile_release_lock_name();
$expired_lock = array( 'token' => 'expired-token', 'expires_at' => time() - 1 );
$jt_options[ $lock_name ] = $expired_lock;
$recovered_lock_token = justice_ops_maya_profile_release_acquire_lock();
jt_maya_assert( is_string( $recovered_lock_token ), 'an unchanged expired lock must be replaced atomically' );
jt_maya_assert( $recovered_lock_token === $jt_options[ $lock_name ]['token'], 'expired-lock replacement must store the returned token' );
jt_maya_assert( in_array( array( $lock_name, 'options' ), $jt_cache_deletes, true ), 'exact SQL deletion must clear the option cache' );
justice_ops_maya_profile_release_release_lock( $recovered_lock_token );
jt_maya_assert( ! array_key_exists( $lock_name, $jt_options ), 'the exact owned lock must be released' );

$newer_lock = array( 'token' => 'newer-token', 'expires_at' => time() + 120 );
$jt_options[ $lock_name ] = $expired_lock;
$jt_wpdb_before_query = static function () use ( $lock_name, $newer_lock ): void {
	global $jt_options;
	$jt_options[ $lock_name ] = $newer_lock;
};
$raced_acquire = justice_ops_maya_profile_release_acquire_lock();
jt_maya_assert( $raced_acquire instanceof WP_Error && 'maya_profile_locked' === $raced_acquire->code, 'changed stale-lock state must fail closed' );
jt_maya_assert( $newer_lock === $jt_options[ $lock_name ], 'stale-lock recovery must not delete a concurrently acquired lock' );

$owned_lock = array( 'token' => 'owned-token', 'expires_at' => time() + 120 );
$jt_options[ $lock_name ] = $owned_lock;
$jt_wpdb_before_query = static function () use ( $lock_name, $newer_lock ): void {
	global $jt_options;
	$jt_options[ $lock_name ] = $newer_lock;
};
justice_ops_maya_profile_release_release_lock( 'owned-token' );
jt_maya_assert( $newer_lock === $jt_options[ $lock_name ], 'lock release must not delete a newer concurrent owner' );
unset( $jt_options[ $lock_name ] );

$before = justice_ops_maya_profile_release_stored_seo();
$get    = justice_ops_maya_profile_release_rest_get();
jt_maya_assert( 11687 === $get['post_id'], 'admin readback must remain pinned to post 11687' );
jt_maya_assert( $before['title_sha256'] === $get['current']['title_sha256'], 'admin readback must expose the exact title hash' );
jt_maya_assert( null === $get['rollback'], 'initial readback must have no pending rollback evidence' );

$request = new WP_REST_Request(
	array(
		'expected' => array(
			'modified_gmt' => '2026-08-02 01:00:00',
			'state_sha256' => $before['state_sha256'],
		),
	)
);
$write = justice_ops_maya_profile_release_rest_update( $request );
jt_maya_assert( ! is_wp_error( $write ), 'exact compare-and-set metadata write must succeed' );
jt_maya_assert( $contract['seo_title'] === $write['current']['title'], 'stored Yoast title must match the contract' );
jt_maya_assert( $contract['description'] === $write['current']['description'], 'stored Yoast description must match the contract' );
jt_maya_assert( is_array( $write['rollback'] ), 'successful write must return durable prior-state evidence' );
$forward_evidence = $write['rollback'];
jt_maya_assert( $before['title'] === $forward_evidence['prior']['title'], 'rollback evidence must contain the exact prior title' );
jt_maya_assert( $before['description'] === $forward_evidence['prior']['description'], 'rollback evidence must contain the exact prior description' );
jt_maya_assert( $forward_evidence['evidence_sha256'] === justice_ops_maya_profile_release_evidence_hash( $forward_evidence ), 'rollback evidence must be self-hash-bound' );
jt_maya_assert( $forward_evidence === $jt_options['justice_ops_maya_profile_seo_rollback_evidence'], 'rollback evidence must persist before release acceptance' );
jt_maya_assert( ! array_key_exists( 'justice_ops_maya_profile_seo_write_lock', $jt_options ), 'write lock must be released' );

$stale_request = new WP_REST_Request(
	array(
		'expected' => array(
			'modified_gmt' => '2026-08-02 01:00:00',
			'state_sha256' => $before['state_sha256'],
		),
	)
);
$stale = justice_ops_maya_profile_release_rest_update( $stale_request );
jt_maya_assert( $stale instanceof WP_Error && 'maya_profile_state_conflict' === $stale->code, 'stale hash write must fail closed' );
jt_maya_assert( ! array_key_exists( 'justice_ops_maya_profile_seo_write_lock', $jt_options ), 'write lock must be released after conflict' );

$rollback_payload = array(
	'token'           => $forward_evidence['token'],
	'evidence_sha256' => $forward_evidence['evidence_sha256'],
	'expected'        => array(
		'modified_gmt'        => $forward_evidence['modified_gmt'],
		'current_state_sha256'=> $forward_evidence['target']['state_sha256'],
		'prior_state_sha256'  => $forward_evidence['prior']['state_sha256'],
	),
);
$tampered_payload                    = $rollback_payload;
$tampered_payload['evidence_sha256'] = str_repeat( '0', 64 );
$tampered = justice_ops_maya_profile_release_rest_rollback( new WP_REST_Request( $tampered_payload ) );
jt_maya_assert( $tampered instanceof WP_Error && 'maya_profile_rollback_evidence_mismatch' === $tampered->code, 'tampered rollback evidence hash must fail closed' );
jt_maya_assert( $contract['seo_title'] === justice_ops_maya_profile_release_stored_seo()['title'], 'tampered rollback must not change metadata' );
jt_maya_assert( isset( $jt_options['justice_ops_maya_profile_seo_rollback_evidence'] ), 'tampered rollback must preserve recovery evidence' );

$jt_post->post_modified_gmt = '2026-08-02 01:00:01';
$drifted = justice_ops_maya_profile_release_rest_rollback( new WP_REST_Request( $rollback_payload ) );
jt_maya_assert( $drifted instanceof WP_Error && 'maya_profile_rollback_state_conflict' === $drifted->code, 'post drift must block rollback before a write' );
$jt_post->post_modified_gmt = '2026-08-02 01:00:00';

$rolled_back = justice_ops_maya_profile_release_rest_rollback( new WP_REST_Request( $rollback_payload ) );
jt_maya_assert( ! is_wp_error( $rolled_back ) && true === $rolled_back['rolled_back'], 'hash-locked successful-write rollback must succeed' );
jt_maya_assert( $before === $rolled_back['current'], 'successful rollback must restore both exact prior values and hashes' );
jt_maya_assert( ! isset( $jt_options['justice_ops_maya_profile_seo_rollback_evidence'] ), 'successful rollback must consume prior-state evidence' );
jt_maya_assert( ! array_key_exists( 'justice_ops_maya_profile_seo_write_lock', $jt_options ), 'rollback lock must be released' );
$replay = justice_ops_maya_profile_release_rest_rollback( new WP_REST_Request( $rollback_payload ) );
jt_maya_assert( $replay instanceof WP_Error && 'maya_profile_rollback_evidence_missing' === $replay->code, 'consumed rollback evidence must not be replayable' );

$jt_meta = array(
	'_yoast_wpseo_title'    => array( 'rollback title' ),
	'_yoast_wpseo_metadesc' => array( 'rollback description' ),
);
$rollback_before  = justice_ops_maya_profile_release_stored_seo();
$jt_fail_meta_key = '_yoast_wpseo_metadesc';
$partial_request  = new WP_REST_Request(
	array(
		'expected' => array(
			'modified_gmt' => '2026-08-02 01:00:00',
			'state_sha256' => $rollback_before['state_sha256'],
		),
	)
);
$partial_result   = justice_ops_maya_profile_release_rest_update( $partial_request );
$jt_fail_meta_key = '';
$rollback_after   = justice_ops_maya_profile_release_stored_seo();
jt_maya_assert( $partial_result instanceof WP_Error && 'maya_profile_write_failed' === $partial_result->code, 'partial stored-meta failure must return a rollback error' );
jt_maya_assert( $rollback_before === $rollback_after, 'partial stored-meta failure must restore both prior values exactly' );
jt_maya_assert( ! isset( $jt_options['justice_ops_maya_profile_seo_rollback_evidence'] ), 'fully compensated forward failure must remove unused evidence' );
jt_maya_assert( ! array_key_exists( 'justice_ops_maya_profile_seo_write_lock', $jt_options ), 'write lock must be released after partial failure rollback' );

$second_write = justice_ops_maya_profile_release_rest_update( $partial_request );
jt_maya_assert( ! is_wp_error( $second_write ), 'second exact forward write must prepare rollback-failure testing' );
$second_evidence = $second_write['rollback'];
$second_payload  = array(
	'token'           => $second_evidence['token'],
	'evidence_sha256' => $second_evidence['evidence_sha256'],
	'expected'        => array(
		'modified_gmt'        => $second_evidence['modified_gmt'],
		'current_state_sha256'=> $second_evidence['target']['state_sha256'],
		'prior_state_sha256'  => $second_evidence['prior']['state_sha256'],
	),
);
$jt_fail_meta_key       = '_yoast_wpseo_metadesc';
$failed_rollback        = justice_ops_maya_profile_release_rest_rollback( new WP_REST_Request( $second_payload ) );
$jt_fail_meta_key       = '';
$after_failed_rollback  = justice_ops_maya_profile_release_stored_seo();
jt_maya_assert( $failed_rollback instanceof WP_Error && 'maya_profile_rollback_write_failed' === $failed_rollback->code, 'partial rollback failure must report forward-state recovery' );
jt_maya_assert( $contract['seo_title'] === $after_failed_rollback['title'] && $contract['description'] === $after_failed_rollback['description'], 'partial rollback failure must restore the reviewed forward state' );
jt_maya_assert( $second_evidence === $jt_options['justice_ops_maya_profile_seo_rollback_evidence'], 'failed rollback must retain exact recovery evidence' );
$second_rollback = justice_ops_maya_profile_release_rest_rollback( new WP_REST_Request( $second_payload ) );
jt_maya_assert( ! is_wp_error( $second_rollback ) && $rollback_before === $second_rollback['current'], 'retry after a compensated rollback failure must restore the exact prior state' );
jt_maya_assert( ! array_key_exists( 'justice_ops_maya_profile_seo_write_lock', $jt_options ), 'all rollback paths must release the operation lock' );

$jt_meta = array(
	'_yoast_wpseo_title'    => array( 'duplicate one', 'duplicate two' ),
	'_yoast_wpseo_metadesc' => array( 'one description' ),
);
$duplicate_state   = justice_ops_maya_profile_release_stored_seo();
$duplicate_request = new WP_REST_Request(
	array(
		'expected' => array(
			'modified_gmt' => '2026-08-02 01:00:00',
			'state_sha256' => $duplicate_state['state_sha256'],
		),
	)
);
$duplicate_result = justice_ops_maya_profile_release_rest_update( $duplicate_request );
jt_maya_assert( $duplicate_result instanceof WP_Error && 'maya_profile_metadata_cardinality_invalid' === $duplicate_result->code, 'duplicate Yoast rows must fail before a mutation' );
jt_maya_assert( ! isset( $jt_options['justice_ops_maya_profile_seo_rollback_evidence'] ), 'unsupported cardinality must not create rollback evidence' );

$jt_meta       = array();
$absent_before = justice_ops_maya_profile_release_stored_seo();
jt_maya_assert( false === $absent_before['title_exists'] && false === $absent_before['description_exists'], 'absent prior keys must be represented explicitly' );
$absent_write = justice_ops_maya_profile_release_rest_update(
	new WP_REST_Request(
		array(
			'expected' => array(
				'modified_gmt' => '2026-08-02 01:00:00',
				'state_sha256' => $absent_before['state_sha256'],
			),
		)
	)
);
jt_maya_assert( ! is_wp_error( $absent_write ), 'forward write from absent Yoast keys must succeed with exact evidence' );
jt_maya_assert( false === $absent_write['rollback']['prior']['title_exists'] && 0 === $absent_write['rollback']['prior']['title_row_count'], 'evidence must preserve absent title state' );
$absent_rollback = justice_ops_maya_profile_release_rest_rollback(
	new WP_REST_Request( jt_maya_rollback_payload( $absent_write['rollback'], $absent_write['current'] ) )
);
jt_maya_assert( ! is_wp_error( $absent_rollback ) && $absent_before === $absent_rollback['current'], 'rollback must restore absent keys, not create empty rows' );
jt_maya_assert( ! array_key_exists( '_yoast_wpseo_title', $jt_meta ) && ! array_key_exists( '_yoast_wpseo_metadesc', $jt_meta ), 'absent-key rollback must physically remove both metadata keys' );

$jt_meta = array(
	'_yoast_wpseo_title'    => array( 'crash prior title' ),
	'_yoast_wpseo_metadesc' => array( 'crash prior description' ),
);
$crash_prior = justice_ops_maya_profile_release_stored_seo();
$crash_write = justice_ops_maya_profile_release_rest_update(
	new WP_REST_Request(
		array(
			'expected' => array(
				'modified_gmt' => '2026-08-02 01:00:00',
				'state_sha256' => $crash_prior['state_sha256'],
			),
		)
	)
);
jt_maya_assert( ! is_wp_error( $crash_write ), 'crash-recovery setup write must succeed' );
$jt_meta['_yoast_wpseo_metadesc'] = array( $crash_prior['description'] );
$mixed_state = justice_ops_maya_profile_release_stored_seo();
jt_maya_assert( $mixed_state['state_sha256'] !== $crash_prior['state_sha256'] && $mixed_state['state_sha256'] !== $crash_write['current']['state_sha256'], 'test setup must create a real mixed forward state' );
$crash_rollback = justice_ops_maya_profile_release_rest_rollback(
	new WP_REST_Request( jt_maya_rollback_payload( $crash_write['rollback'], $mixed_state ) )
);
jt_maya_assert( ! is_wp_error( $crash_rollback ) && $crash_prior === $crash_rollback['current'], 'rollback must recover a crash between the two metadata writes' );
jt_maya_assert( ! isset( $jt_options['justice_ops_maya_profile_seo_rollback_evidence'] ), 'mixed-state recovery must consume evidence after exact restoration' );

$jt_meta = array(
	'_yoast_wpseo_title'    => array( '' ),
	'_yoast_wpseo_metadesc' => array( 'empty-value prior description' ),
);
$empty_prior = justice_ops_maya_profile_release_stored_seo();
$empty_write = justice_ops_maya_profile_release_rest_update(
	new WP_REST_Request(
		array(
			'expected' => array(
				'modified_gmt' => '2026-08-02 01:00:00',
				'state_sha256' => $empty_prior['state_sha256'],
			),
		)
	)
);
jt_maya_assert( ! is_wp_error( $empty_write ), 'forward write from an existing empty title row must succeed' );
unset( $jt_meta['_yoast_wpseo_title'] );
$empty_intermediate = justice_ops_maya_profile_release_stored_seo();
$empty_rollback = justice_ops_maya_profile_release_rest_rollback(
	new WP_REST_Request( jt_maya_rollback_payload( $empty_write['rollback'], $empty_intermediate ) )
);
jt_maya_assert( ! is_wp_error( $empty_rollback ) && $empty_prior === $empty_rollback['current'], 'rollback must recover the absent intermediate of an empty-value replacement' );
jt_maya_assert( array( '' ) === $jt_meta['_yoast_wpseo_title'], 'existing empty metadata must be restored as one existing empty row' );

$jt_meta = array(
	'_yoast_wpseo_title'    => array( 'finalize prior title' ),
	'_yoast_wpseo_metadesc' => array( 'finalize prior description' ),
);
$finalize_prior = justice_ops_maya_profile_release_stored_seo();
$finalize_write = justice_ops_maya_profile_release_rest_update(
	new WP_REST_Request(
		array(
			'expected' => array(
				'modified_gmt' => '2026-08-02 01:00:00',
				'state_sha256' => $finalize_prior['state_sha256'],
			),
		)
	)
);
jt_maya_assert( ! is_wp_error( $finalize_write ), 'finalize setup write must succeed with durable evidence' );
$finalize_payload = jt_maya_finalize_payload( $finalize_write['rollback'], $finalize_write['current'] );

$wrong_post_payload            = $finalize_payload;
$wrong_post_payload['post_id'] = 11688;
$wrong_post = justice_ops_maya_profile_release_rest_finalize( new WP_REST_Request( $wrong_post_payload ) );
jt_maya_assert( $wrong_post instanceof WP_Error && 'maya_profile_finalize_request_invalid' === $wrong_post->code, 'finalize must reject a tampered post ID before locking' );

$tampered_finalize                    = $finalize_payload;
$tampered_finalize['evidence_sha256'] = str_repeat( '0', 64 );
$tampered_finalize_result = justice_ops_maya_profile_release_rest_finalize( new WP_REST_Request( $tampered_finalize ) );
jt_maya_assert( $tampered_finalize_result instanceof WP_Error && 'maya_profile_finalize_evidence_mismatch' === $tampered_finalize_result->code, 'finalize must reject a tampered evidence digest' );
jt_maya_assert( $finalize_write['rollback'] === $jt_options['justice_ops_maya_profile_seo_rollback_evidence'], 'tampered finalize must retain exact rollback evidence' );

$tampered_state = $finalize_payload;
$tampered_state['expected']['current_state_sha256'] = str_repeat( '0', 64 );
$tampered_state_result = justice_ops_maya_profile_release_rest_finalize( new WP_REST_Request( $tampered_state ) );
jt_maya_assert( $tampered_state_result instanceof WP_Error && 'maya_profile_finalize_evidence_mismatch' === $tampered_state_result->code, 'finalize must reject a tampered accepted-state digest' );

$jt_post->post_modified_gmt = '2026-08-02 01:00:01';
$drifted_finalize = justice_ops_maya_profile_release_rest_finalize( new WP_REST_Request( $finalize_payload ) );
jt_maya_assert( $drifted_finalize instanceof WP_Error && 'maya_profile_finalize_state_conflict' === $drifted_finalize->code, 'post revision drift must block finalize' );
$jt_post->post_modified_gmt = '2026-08-02 01:00:00';

$jt_fail_delete_option_name = 'justice_ops_maya_profile_seo_rollback_evidence';
$failed_finalize = justice_ops_maya_profile_release_rest_finalize( new WP_REST_Request( $finalize_payload ) );
$jt_fail_delete_option_name = '';
jt_maya_assert( $failed_finalize instanceof WP_Error && 'maya_profile_finalize_evidence_cleanup_failed' === $failed_finalize->code, 'failed evidence deletion must fail finalization without changing metadata' );
jt_maya_assert( $finalize_write['current'] === justice_ops_maya_profile_release_stored_seo(), 'failed finalize must leave the accepted target metadata unchanged' );
jt_maya_assert( isset( $jt_options['justice_ops_maya_profile_seo_rollback_evidence'] ), 'failed finalize must retain rollback evidence for retry' );
jt_maya_assert( ! array_key_exists( 'justice_ops_maya_profile_seo_write_lock', $jt_options ), 'failed finalize must release the operation lock' );

$finalized = justice_ops_maya_profile_release_rest_finalize( new WP_REST_Request( $finalize_payload ) );
jt_maya_assert( ! is_wp_error( $finalized ) && true === $finalized['finalized'], 'exact accepted target must finalize successfully' );
jt_maya_assert( true === $finalized['evidence_consumed'] && ! isset( $jt_options['justice_ops_maya_profile_seo_rollback_evidence'] ), 'successful finalize must consume rollback evidence exactly once' );
jt_maya_assert( $finalize_write['current'] === $finalized['current'], 'finalize must not mutate accepted target metadata' );
$finalize_replay = justice_ops_maya_profile_release_rest_finalize( new WP_REST_Request( $finalize_payload ) );
jt_maya_assert( $finalize_replay instanceof WP_Error && 'maya_profile_finalize_evidence_missing' === $finalize_replay->code, 'finalize replay must fail after evidence consumption' );
jt_maya_assert( ! array_key_exists( 'justice_ops_maya_profile_seo_write_lock', $jt_options ), 'all finalize paths must release the operation lock' );
jt_maya_assert( false === $jt_meta_write_without_evidence, 'every Yoast metadata mutation must occur only after durable prior-state evidence exists' );

fwrite( STDOUT, "PASS maya-profile-release contract checks\n" );
fwrite(
	STDOUT,
	'MAYA_PROFILE_HASHES ' . json_encode(
		array(
			'title_raw_sha256'   => hash( 'sha256', $contract['h1'] ),
			'content_raw_sha256' => hash( 'sha256', $body ),
			'excerpt_raw_sha256' => hash( 'sha256', $contract['description'] ),
			'seo_title_sha256'   => hash( 'sha256', $contract['seo_title'] ),
			'body_bytes'         => strlen( $body ),
		),
		JSON_UNESCAPED_SLASHES
	) . "\n"
);
