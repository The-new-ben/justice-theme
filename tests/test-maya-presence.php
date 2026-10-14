<?php
/**
 * Maya Rotenberg's presence on family-law pages (HAD-510): family resolution, the expert card,
 * the top line and the structured data. Run: php tests/test-maya-presence.php
 */
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );
define( 'MINUTE_IN_SECONDS', 60 );
define( 'HOUR_IN_SECONDS', 3600 );

class WP_Post {
	public int $ID;
	public string $post_type = 'page';
	public string $post_name = '';
	public function __construct( int $id ) {
		$this->ID = $id;
	}
}

// --------------------------------------------------------------------------- state

$jt_filters  = array();
$jt_actions  = array();
$jt_page     = array( 'id' => 500, 'type' => 'articles', 'slug' => 'joint-custody-shared-parenting', 'title' => 'משמורת משותפת בישראל', 'terms' => array( 'family-law' ), 'primary' => 0, 'meta' => array() );
$jt_landing  = false;
$jt_rival    = false;
$jt_byline   = false;
$jt_terms_db = array(
	68  => array( 'slug' => 'family-law', 'parent' => 0 ),
	75  => array( 'slug' => 'inheritance', 'parent' => 68 ),
	170 => array( 'slug' => 'criminal-law', 'parent' => 0 ),
	392 => array( 'slug' => 'divorce', 'parent' => 68 ),
	635 => array( 'slug' => 'child-support', 'parent' => 392 ),
	646 => array( 'slug' => 'court-rulings', 'parent' => 0 ),
	651 => array( 'slug' => 'family-court-rulings', 'parent' => 646 ),
	714 => array( 'slug' => 'inheritance-law', 'parent' => 0 ),
);

// --------------------------------------------------------------------------- WordPress stubs

function add_filter( $tag, $callback, $priority = 10, $args = 1 ): void {
	global $jt_filters;
	$jt_filters[ $tag ][ $priority ][] = $callback;
}
function add_action( $tag, $callback, $priority = 10, $args = 1 ): void {
	global $jt_actions;
	$jt_actions[ $tag ][ $priority ][] = $callback;
}
function apply_filters( $tag, $value, ...$args ) {
	global $jt_filters;
	if ( empty( $jt_filters[ $tag ] ) ) {
		return $value;
	}
	ksort( $jt_filters[ $tag ] );
	foreach ( $jt_filters[ $tag ] as $callbacks ) {
		foreach ( $callbacks as $cb ) {
			$value = $cb( $value, ...$args );
		}
	}
	return $value;
}
function get_option( $key, $default = false ) {
	return $default;
}
function sanitize_key( $value ): string {
	return strtolower( preg_replace( '/[^a-z0-9_\-]/', '', (string) $value ) );
}
function sanitize_title( $value ): string {
	return sanitize_key( $value );
}
function sanitize_hex_color( $c ) {
	return $c;
}
function wp_json_encode( $value, $options = 0 ) {
	return json_encode( $value, $options ?: ( JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) );
}
function home_url( $path = '/' ): string {
	return 'https://jus-tice.co.il' . $path;
}
function trailingslashit( $s ): string {
	return rtrim( (string) $s, '/' ) . '/';
}
function post_type_exists( $type ): bool {
	return 'justice_lawyer' === $type;
}
function taxonomy_exists( $tax ): bool {
	return 'practice-areas' === $tax;
}
$jt_registered_for = array();
function register_taxonomy_for_object_type( $tax, $type ): bool {
	global $jt_registered_for;
	$jt_registered_for[] = $tax . ':' . $type;
	return true;
}
function get_posts( $args ): array {
	if ( 'justice_lawyer' !== ( $args['post_type'] ?? '' ) ) {
		return array();
	}
	global $jt_rival;
	$pool = $jt_rival ? array( 888, 777 ) : array( 777 );
	if ( isset( $args['post__in'] ) ) {
		$want = array_map( 'intval', (array) $args['post__in'] );
		return array_values( array_map( static fn( $id ) => new WP_Post( $id ), array_intersect( $pool, $want ) ) );
	}
	return 0 === (int) ( $args['offset'] ?? 0 ) ? array_map( static fn( $id ) => new WP_Post( $id ), $pool ) : array();
}
function get_post( $id ) {
	global $jt_page;
	$p            = new WP_Post( (int) $id );
	$p->post_type = $jt_page['type'];
	$p->post_name = $jt_page['slug'];
	return $p;
}
function get_post_type( $id ) {
	global $jt_page;
	return 777 === (int) $id ? 'justice_lawyer' : $jt_page['type'];
}
function get_post_status( $id ) {
	return 'publish';
}
function get_post_meta( $id, $key, $single = false ) {
	global $jt_page;
	if ( 777 === (int) $id ) {
		$meta = array(
			'subscription_status'        => 'active',
			'plan_type'                  => 'featured',
			'profile_fact_review_status' => 'approved',
			'profile_subheadline'        => 'שורת פתיחה מהפרופיל.',
			'profile_faqs'               => "כמה זמן נמשך הליך גירושין בהסכמה? | תשובה א.\nמה עדיף, גישור או בית משפט? | תשובה ב.\nהאם הסכם ממון משתלם גם לזוגות צעירים? | תשובה ג.\nמה קורה בפגישה הראשונה? | תשובה ד.",
		);
		return $meta[ $key ] ?? '';
	}
	if ( 888 === (int) $id ) {
		$rival = array( 'subscription_status' => 'active', 'plan_type' => 'featured', 'priority_score' => '900' );
		return $rival[ $key ] ?? '';
	}
	if ( '_yoast_wpseo_primary_practice-areas' === $key ) {
		return (string) $jt_page['primary'];
	}
	return $jt_page['meta'][ $key ] ?? '';
}
function get_post_field( $field, $id ) {
	global $jt_page;
	if ( 'post_name' === $field ) {
		return 777 === (int) $id ? 'advocate-maya-rotenberg' : $jt_page['slug'];
	}
	return '';
}
function get_the_ID(): int {
	global $jt_page;
	return $jt_page['id'];
}
function get_queried_object_id(): int {
	global $jt_page;
	return $jt_page['id'];
}
function get_the_title( $id = 0 ): string {
	global $jt_page;
	return 777 === (int) $id ? 'עו"ד מאיה רוטנברג' : $jt_page['title'];
}
function get_permalink( $id = 0 ): string {
	global $jt_page;
	if ( 777 === (int) $id ) {
		return 'https://jus-tice.co.il/lawyers/advocate-maya-rotenberg/';
	}
	return 'https://jus-tice.co.il/' . $jt_page['slug'] . '/';
}
function get_the_terms( $id, $taxonomy ) {
	global $jt_page, $jt_terms_db;
	if ( 'city' === $taxonomy ) {
		return array( (object) array( 'term_id' => 9, 'slug' => 'tel-aviv', 'name' => 'תל אביב' ) );
	}
	if ( 777 === (int) $id ) {
		return array( (object) array( 'term_id' => 68, 'slug' => 'family-law', 'name' => 'דיני משפחה' ) );
	}
	$out = array();
	foreach ( $jt_page['terms'] as $slug ) {
		foreach ( $jt_terms_db as $tid => $t ) {
			if ( $t['slug'] === $slug ) {
				$out[] = (object) array( 'term_id' => $tid, 'slug' => $slug, 'name' => $slug );
			}
		}
	}
	return $out ?: false;
}
function get_ancestors( $id, $tax, $type = '' ): array {
	global $jt_terms_db;
	$out = array();
	$p   = $jt_terms_db[ (int) $id ]['parent'] ?? 0;
	while ( $p ) {
		$out[] = $p;
		$p     = $jt_terms_db[ $p ]['parent'] ?? 0;
	}
	return $out;
}
function get_term( $id, $tax = '' ) {
	global $jt_terms_db;
	return isset( $jt_terms_db[ (int) $id ] ) ? (object) array( 'term_id' => (int) $id, 'slug' => $jt_terms_db[ (int) $id ]['slug'] ) : null;
}
function wp_list_pluck( $list, $field ): array {
	return array_map( static fn( $item ) => $item->{$field}, (array) $list );
}
function wp_get_post_categories( $id, $args = array() ): array {
	return array();
}
function is_wp_error( $value ): bool {
	return false;
}
function get_post_thumbnail_id( $id ): int {
	return 0;
}
function wp_get_attachment_image_src( $a, $s ) {
	return false;
}
function get_transient( $key ) {
	return false;
}
function set_transient( $key, $value, $ttl ): bool {
	return true;
}
function wp_strip_all_tags( $value ): string {
	return trim( strip_tags( (string) $value ) );
}
function justice_theme_public_whatsapp_url( $message ): string {
	return 'https://wa.me/972525101555?text=' . rawurlencode( (string) $message );
}
function esc_url( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES, 'UTF-8' );
}
function esc_html( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}
function esc_attr( $value ): string {
	return htmlspecialchars( (string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8' );
}
function number_format_i18n( $number, $decimals = 0 ): string {
	return number_format( (float) $number, (int) $decimals );
}
function is_singular( $type = null ): bool {
	global $jt_page;
	return is_array( $type ) ? in_array( $jt_page['type'], $type, true ) : ( null === $type || $jt_page['type'] === $type );
}
function in_the_loop(): bool {
	return true;
}
function is_main_query(): bool {
	return true;
}
function is_feed(): bool {
	return false;
}
function is_preview(): bool {
	return false;
}
function wp_is_json_request(): bool {
	return false;
}
function is_embed(): bool {
	return false;
}
function is_admin(): bool {
	return false;
}
function wp_parse_url( $url, $component = -1 ) {
	return parse_url( (string) $url, $component );
}
function wp_date( $format ): string {
	return '12026';
}
function justice_enc_word_count( $content ): int {
	return count( array_filter( (array) preg_split( '/\s+/u', trim( strip_tags( (string) $content ) ) ) ) );
}
// Theme helpers the module reads.
function justice_theme_lawyer_profile_is_public_approved( $id ): bool {
	return in_array( (int) $id, array( 777, 888 ), true );
}
function justice_theme_lawyer_has_public_sponsored_placement( $id ): bool {
	return in_array( (int) $id, array( 777, 888 ), true );
}
function justice_lawyer_owner_is_maya_profile( int $id ): bool {
	return 777 === $id;
}
function justice_theme_get_connected_lawyer_by_slug( string $slug ) {
	return 'advocate-maya-rotenberg' === $slug ? new WP_Post( 777 ) : null;
}
function justice_theme_is_practice_landing_page( $post ): bool {
	global $jt_landing;
	return $jt_landing;
}
function justice_theme_article_visible_attribution( int $id ): array {
	global $jt_byline;
	return $jt_byline ? array( 'label' => 'נבדק מקצועית על ידי', 'name' => 'עו״ד מאיה רוטנברג', 'url' => '/x/' ) : array( 'label' => 'נערך על ידי', 'name' => 'Jus-Tice', 'url' => '/' );
}
function justice_theme_cluster_for_slug( string $slug ): ?array {
	$family = array( 'divorce-lawyer', 'family-law-haifa', 'family-law-statistics-2025' );
	$prenup = array( 'prenuptial-agreement', 'prenup-attorney' );
	if ( in_array( $slug, $family, true ) ) {
		return array( 'key' => 'family-law', 'role' => 'spoke' );
	}
	if ( in_array( $slug, $prenup, true ) ) {
		return array( 'key' => 'prenup', 'role' => 'spoke' );
	}
	if ( 'criminal-defense-attorney' === $slug ) {
		return array( 'key' => 'criminal-law', 'role' => 'pillar' );
	}
	return null;
}
function justice_tools_registry(): array {
	return json_decode( (string) file_get_contents( dirname( __DIR__ ) . '/assets/data/justice-tools-registry.json' ), true );
}

require_once dirname( __DIR__ ) . '/justice-ops/professional-cards.php';
require_once dirname( __DIR__ ) . '/justice-ops/maya-presence.php';

$jt_checks = 0;
function jt_maya_assert( bool $condition, string $message ): void {
	global $jt_checks;
	$jt_checks++;
	if ( ! $condition ) {
		fwrite( STDERR, "FAIL: $message\n" );
		exit( 1 );
	}
}
function jt_set_page( array $page ): void {
	global $jt_page;
	$jt_page = array_merge( array( 'id' => 500, 'type' => 'articles', 'slug' => 'x', 'title' => 'x', 'terms' => array(), 'primary' => 0, 'meta' => array() ), $page );
}
function jt_reset_context(): void {
	// justice_maya_context() caches per queried ID; tests vary the ID instead of the cache.
}

// --------------------------------------------------------------------------- 1. family resolution

$family = justice_cards_family_map()['family'];
jt_maya_assert( in_array( 'family-court-rulings', $family, true ), 'family-court-rulings is not in the family' );
jt_maya_assert( in_array( 'prenuptial-agreement', $family, true ), 'prenuptial-agreement is not in the family' );

jt_set_page( array( 'id' => 601, 'terms' => array( 'family-court-rulings' ) ) );
jt_maya_assert( $family === justice_cards_current_terms(), 'a family-court ruling does not resolve to the family' );

jt_set_page( array( 'id' => 602, 'terms' => array( 'inheritance' ) ) );
jt_maya_assert( $family === justice_cards_current_terms(), 'a child term of family-law does not inherit the family' );

jt_set_page( array( 'id' => 603, 'terms' => array( 'child-support' ) ) );
jt_maya_assert( $family === justice_cards_current_terms(), 'child-support (two levels under family-law) does not resolve' );

jt_set_page( array( 'id' => 604, 'terms' => array( 'family-law', 'criminal-law' ) ) );
jt_maya_assert( justice_cards_family_map()['criminal-law'] === justice_cards_current_terms(), 'a tie no longer keeps the map order' );

jt_set_page( array( 'id' => 605, 'terms' => array( 'family-law', 'criminal-law' ), 'primary' => 68 ) );
jt_maya_assert( $family === justice_cards_current_terms(), 'the Yoast primary term does not decide' );

jt_set_page( array( 'id' => 6051, 'terms' => array( 'inheritance', 'criminal-law' ) ) );
jt_maya_assert( justice_cards_family_map()['criminal-law'] === justice_cards_current_terms(), 'an unlisted family child tied with criminal no longer keeps the map order' );

jt_set_page( array( 'id' => 6052, 'terms' => array( 'inheritance', 'criminal-law' ), 'primary' => 75 ) );
jt_maya_assert( $family === justice_cards_current_terms(), 'a primary term that is an unlisted child of family-law does not decide' );

jt_set_page( array( 'id' => 606, 'terms' => array( 'criminal-law', 'divorce' ) ) );
jt_maya_assert( $family === justice_cards_current_terms(), 'divorce plus its ancestor does not outweigh one criminal term' );

jt_set_page( array( 'id' => 607, 'terms' => array( 'inheritance-law', 'family-court-rulings' ) ) );
jt_maya_assert( $family === justice_cards_current_terms(), 'a family-court inheritance ruling does not reach the family' );

jt_set_page( array( 'id' => 608, 'type' => 'page', 'slug' => 'family-law-haifa', 'terms' => array() ) );
jt_maya_assert( $family === justice_cards_current_terms(), 'a page in the theme family cluster does not resolve' );

jt_set_page( array( 'id' => 609, 'type' => 'page', 'slug' => 'prenuptial-agreement', 'terms' => array() ) );
jt_maya_assert( $family === justice_cards_current_terms(), 'a page in the prenup cluster does not resolve' );

jt_set_page( array( 'id' => 610, 'type' => 'page', 'slug' => 'criminal-defense-attorney', 'terms' => array() ) );
jt_maya_assert( array() === justice_cards_current_terms(), 'a criminal cluster page was pulled into the family' );

jt_set_page( array( 'id' => 611, 'type' => 'page', 'slug' => 'about-us', 'terms' => array() ) );
jt_maya_assert( array() === justice_cards_current_terms(), 'an unrelated page was pulled into the family' );

jt_set_page( array( 'id' => 612, 'type' => 'page', 'slug' => 'any-page', 'terms' => array(), 'meta' => array( 'content_cluster' => 'family-law' ) ) );
jt_maya_assert( $family === justice_cards_current_terms(), 'content_cluster meta does not resolve' );

jt_set_page( array( 'id' => 11687, 'slug' => 'family-law-lawyer-recommended-divorce-wills-inheritances', 'terms' => array() ) );
jt_maya_assert( array() === justice_cards_current_terms(), 'her own source profile was given a card family' );

jt_maya_assert( in_array( 'page', justice_cards_singular_types(), true ), 'pages are not in the cards mesh' );
justice_maya_register_page_taxonomy();
jt_maya_assert( in_array( 'practice-areas:page', $jt_registered_for, true ), 'pages did not get the practice-area taxonomy' );

// --------------------------------------------------------------------------- 2. topic

$topics = array(
	array( 'מחשבון מזונות ילדים: הלכת 919/15 + מדריך מלא', 'child-support', array(), 'child-support' ),
	array( 'מזונות אישה בגירושין', 'alimony-israel', array(), 'spousal' ),
	array( 'משמורת משותפת בישראל', 'joint-custody-shared-parenting', array( 'family-law' ), 'custody' ),
	array( 'הסכם גירושין: מדריך מלא', 'divorce-agreement', array(), 'divorce' ),
	array( 'הסכם ממון: המדריך המלא', 'prenuptial-agreements-overview', array(), 'prenup' ),
	array( 'סרבנות גט', 'refusal-of-get', array(), 'rabbinical' ),
	array( 'בקשה לצו הגנה', 'order-protection-request', array(), 'violence' ),
	array( 'יישוב סכסוך במשפחה', 'family-dispute-resolution', array(), 'mediation' ),
	array( 'אימוץ ילד בישראל', 'adopting-child-israel', array(), 'adoption' ),
	array( 'ידועים בציבור: זכויות', 'yeduim-batzibur', array(), 'cohabitation' ),
	array( 'איזון משאבים', 'resource-balancing', array(), 'property' ),
	array( 'דיני משפחה בחיפה', 'family-law-haifa', array( 'family-law' ), 'family' ),
	array( 'פסק דין', 'decision1', array( 'child-support' ), 'child-support' ),
);
foreach ( $topics as $t ) {
	jt_maya_assert( $t[3] === justice_maya_topic_for( $t[0], $t[1], $t[2] ), 'topic of "' . $t[0] . '" is ' . justice_maya_topic_for( $t[0], $t[1], $t[2] ) . ', expected ' . $t[3] );
}

// --------------------------------------------------------------------------- 3. the card

jt_set_page( array( 'id' => 700, 'type' => 'page', 'slug' => 'child-support', 'title' => 'מחשבון מזונות ילדים: הלכת 919/15', 'terms' => array( 'child-support' ) ) );
$card = justice_cards_render( new WP_Post( 777 ) );
jt_maya_assert( false !== strpos( $card, 'class="jt-procard jt-procard--house jt-maya-card"' ), 'the house card is not her expert card' );
jt_maya_assert( false !== strpos( $card, 'data-l="777"' ) && false !== strpos( $card, 'data-card-surface="incontent"' ), 'analytics hooks are gone' );
jt_maya_assert( false !== strpos( $card, 'jt-procard__wa' ) && false !== strpos( $card, 'jt-procard__profile' ), 'the WhatsApp and profile hooks are gone' );
jt_maya_assert( false !== strpos( $card, 'https://wa.me/972525101555?text=' ), 'the existing contact path (site WhatsApp intake) is not used' );
jt_maya_assert( false !== strpos( $card, 'href="https://jus-tice.co.il/lawyers/advocate-maya-rotenberg/"' ), 'no link to her mini-site' );
jt_maya_assert( false !== strpos( $card, 'href="https://jus-tice.co.il/family-law-lawyer-recommended-divorce-wills-inheritances/"' ), 'no link to her source profile' );
jt_maya_assert( 1 === preg_match( '#href="https://rotenberglaw\.co\.il/" target="_blank" rel="sponsored noopener"#', $card ), 'no sponsored link to her office site' );
jt_maya_assert( false !== strpos( $card, 'היא עורכת דין' ) && false !== strpos( $card, 'אינו ייעוץ משפטי' ) && false !== strpos( $card, 'אין בו הבטחה לתוצאה' ), 'lawyer / not-advice / no-promise note is missing' );
jt_maya_assert( false === strpos( $card, 'מקודם' ), 'the editorial house card carries a sponsored label' );
foreach ( array( '★', 'aggregateRating', 'ביקורות', 'דירוג לקוחות', 'שיעור הצלחה', 'הטוב ביותר', 'מומחית' ) as $banned ) {
	jt_maya_assert( false === mb_strpos( $card, $banned ), 'the card carries an unsupported claim: ' . $banned );
}
jt_maya_assert( false !== strpos( $card, 'עו״ד בודקת התוכן המשפטי באתר' ), 'the owner-ordered house label changed' );
jt_maya_assert( false !== strpos( $card, 'שורת פתיחה מהפרופיל.' ), 'her profile line is not shown as written' );
preg_match_all( '#<li class="jt-maya-card__fact"[\s\S]*?</li>#u', $card, $facts );
jt_maya_assert( count( $facts[0] ) >= 2 && count( $facts[0] ) <= 3, 'the card shows ' . count( $facts[0] ) . ' facts' );
foreach ( $facts[0] as $fact ) {
	jt_maya_assert( false !== strpos( $fact, 'class="jt-maya-card__src" href="https://' ), 'a fact has no source link: ' . strip_tags( $fact ) );
	jt_maya_assert( false !== strpos( $fact, 'נבדק ' ), 'a fact has no checked date' );
}
jt_maya_assert( false !== strpos( $facts[0][0], '919/15' ), 'on child support the 919/15 fact does not lead' );
jt_maya_assert( 1 === preg_match( '#<img class="jt-maya-card__photo"[^>]* alt="עו&quot;ד מאיה רוטנברג, עורכת דין ומגשרת בדיני משפחה וגירושין"#u', $card ) || false !== strpos( $card, 'jt-maya-card__photo--initial' ), 'photo alt text is not descriptive' );
// Child-support tool: three fields, no names (nothing typed reaches a URL), link to the calculator.
jt_maya_assert( false !== strpos( $card, 'data-jt-maya-ratio' ), 'child support does not get the ratio tool' );
jt_maya_assert( 3 === preg_match_all( '#<input id="jtmc-\d+-[abn]" type="number"#', $card ), 'the quick tool does not have three fields' );
jt_maya_assert( 0 === preg_match( '#<input[^>]* name=#', $card ), 'a tool field has a name, so its value could reach a URL' );
jt_maya_assert( false !== strpos( $card, 'https://jus-tice.co.il/child-support/#' ), 'the quick tool does not link the full calculator' );
jt_maya_assert( false !== strpos( $card, 'לבדוק את זה עם עו״ד רוטנברג' ), 'no "check it with Maya" action' );
// Key numbers: rows with their source.
jt_maya_assert( false !== strpos( $card, 'jt-maya-card__numbers' ) && false !== strpos( $card, 'nevo.co.il' ), 'key numbers or their sources are missing' );
jt_maya_assert( 1 === preg_match( '#<th scope="row">תביעת מזונות</th><td><bdi>\d{3}</bdi> ₪#u', $card ), 'the child-support fee row is not from the registry' );
// FAQ from her own profile page.
jt_maya_assert( false !== strpos( $card, 'מה עדיף, גישור או בית משפט?' ), 'the profile question for the topic is missing' );
jt_maya_assert( false === strpos( $card, 'האם הסכם ממון משתלם' ), 'an off-topic profile question was chosen' );

jt_set_page( array( 'id' => 701, 'type' => 'page', 'slug' => 'divorce-agreement', 'title' => 'הסכם גירושין: מדריך מלא', 'terms' => array() ) );
$card = justice_maya_card_render( new WP_Post( 777 ) );
jt_maya_assert( false !== strpos( $card, 'data-jt-maya-checklist' ) && 5 === substr_count( $card, 'type="checkbox"' ), 'divorce does not get the five-document checklist' );
jt_maya_assert( false !== strpos( $card, 'כמה זמן נמשך הליך גירושין בהסכמה?' ), 'the divorce question from her profile is missing' );
jt_maya_assert( false !== strpos( $card, 'פרט 4(1)(א)' ), 'the divorce fee row lost its regulation item' );

jt_set_page( array( 'id' => 702, 'type' => 'page', 'slug' => 'prenuptial-agreement', 'title' => 'הסכם ממון', 'terms' => array() ) );
$card = justice_maya_card_render( new WP_Post( 777 ) );
jt_maya_assert( false !== strpos( $card, 'חוק יחסי ממון, סעיף 2' ), 'the prenup approval rule has no source' );

// --------------------------------------------------------------------------- 4. placement and the top line

jt_set_page( array( 'id' => 703, 'type' => 'page', 'slug' => 'divorce-agreement', 'title' => 'הסכם גירושין: מדריך מלא', 'terms' => array( 'divorce' ) ) );
$body = '<p>' . str_repeat( 'מילה ', 520 ) . '</p><h2>א</h2><p>טקסט</p><h2>ב</h2><p>טקסט</p>';
$out  = justice_cards_filter_content( $body );
jt_maya_assert( 1 === substr_count( $out, 'jt-maya-card"' ), 'a family page did not get exactly one card' );
jt_maya_assert( strpos( $out, 'jt-maya-card"' ) > strpos( $out, '<h2>א</h2>' ) && strpos( $out, 'jt-maya-card"' ) < strpos( $out, '<h2>ב</h2>' ), 'the placement rule changed' );
$jt_byline = false;
$lined     = justice_maya_line_filter( $out );
jt_maya_assert( 0 === strpos( $lined, '<p class="jt-maya-line">' ), 'the top line is missing on a page without her byline' );
jt_maya_assert( false !== strpos( $lined, 'עורכת דין לדיני משפחה בנושא זה:' ) && false === strpos( substr( $lined, 0, 400 ), 'נבדק' ), 'the unreviewed line claims a review' );
jt_maya_assert( $lined === justice_maya_line_filter( $lined ), 'the line was added twice' );

jt_set_page( array( 'id' => 704, 'type' => 'articles', 'slug' => 'joint-custody-shared-parenting', 'title' => 'משמורת משותפת', 'terms' => array( 'family-law' ) ) );
$jt_byline = true;
$out       = justice_cards_filter_content( $body );
jt_maya_assert( $out === justice_maya_line_filter( $out ), 'a second line was added where the byline already names her' );
$jt_byline = false;

jt_set_page( array( 'id' => 705, 'type' => 'page', 'slug' => 'divorce-agreement', 'title' => 'הסכם גירושין', 'terms' => array( 'divorce' ), 'meta' => array( 'jt_maya_reviewed_on' => '2026-10-20' ) ) );
$out = justice_maya_line_filter( justice_cards_filter_content( $body ) );
jt_maya_assert( false !== strpos( $out, 'נבדק על ידי' ) && false !== strpos( $out, '20.10.2026' ), 'a reviewed page does not say reviewed with the date' );

jt_set_page( array( 'id' => 706, 'type' => 'page', 'slug' => 'about-us', 'title' => 'אודות', 'terms' => array() ) );
jt_maya_assert( $body === justice_cards_filter_content( $body ), 'a non-family page got a card' );

$jt_landing = true;
jt_set_page( array( 'id' => 707, 'type' => 'page', 'slug' => 'divorce-lawyer', 'title' => 'עורך דין גירושין', 'terms' => array() ) );
jt_maya_assert( false === justice_maya_context()['applies'], 'a landing page with her featured card got the presence context' );
$jt_landing = false;

// --------------------------------------------------------------------------- 5. structured data

jt_set_page( array( 'id' => 708, 'type' => 'page', 'slug' => 'child-support', 'title' => 'מזונות ילדים', 'terms' => array( 'child-support' ) ) );
$ctx = justice_maya_context();
jt_maya_assert( true === $ctx['applies'] && 777 === $ctx['lawyer_id'] && 'child-support' === $ctx['topic'], 'context did not resolve for a family page' );
$schema = justice_maya_schema( $ctx );
$json   = wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP );
jt_maya_assert( is_string( $json ) && is_array( json_decode( $json, true ) ), 'the graph does not encode' );
$nodes = array();
foreach ( $schema['@graph'] as $node ) {
	$nodes[ $node['@type'] ] = $node;
}
$person = $nodes['Person'];
$firm   = $nodes['LegalService'];
jt_maya_assert( 'https://jus-tice.co.il/lawyers/advocate-maya-rotenberg/#person' === $person['@id'], 'Person @id differs from her profile page' );
jt_maya_assert( 'https://rotenberglaw.co.il/#firm' === $firm['@id'], 'LegalService @id differs from her office site' );
foreach ( array( 'name', 'jobTitle', 'url', 'knowsAbout', 'worksFor', 'sameAs', 'description' ) as $field ) {
	jt_maya_assert( ! empty( $person[ $field ] ), 'Person lacks ' . $field );
}
foreach ( array( 'name', 'url', 'address', 'telephone', 'founder' ) as $field ) {
	jt_maya_assert( ! empty( $firm[ $field ] ), 'LegalService lacks ' . $field );
}
foreach ( array_merge( $person['sameAs'], $firm['sameAs'] ) as $same ) {
	$host = (string) parse_url( $same, PHP_URL_HOST );
	jt_maya_assert( in_array( $host, array( 'rotenberglaw.co.il', 'il.linkedin.com', 'www.duns100.co.il' ), true ), 'sameAs points outside her official pages: ' . $same );
}
jt_maya_assert( 'https://jus-tice.co.il/child-support/' === $nodes['WebPage']['@id'] && '#person' === substr( $nodes['WebPage']['mentions']['@id'], -7 ), 'the page does not mention her' );
jt_maya_assert( ! isset( $nodes['WebPage']['reviewedBy'] ) && false === strpos( $json, 'reviewedBy' ), 'reviewedBy without a recorded review' );
foreach ( array( 'aggregateRating', 'Review', 'ratingValue', 'award' ) as $banned ) {
	jt_maya_assert( false === strpos( $json, $banned ), 'the graph carries ' . $banned );
}
jt_set_page( array( 'id' => 709, 'type' => 'page', 'slug' => 'child-support', 'title' => 'מזונות ילדים', 'terms' => array( 'child-support' ), 'meta' => array( 'jt_maya_reviewed_on' => '2026-10-20' ) ) );
$schema = justice_maya_schema( justice_maya_context() );
jt_maya_assert( '2026-10-20' === $schema['@graph'][0]['lastReviewed'] && isset( $schema['@graph'][0]['reviewedBy']['@id'] ), 'a recorded review is not in the graph' );

$jt_rival = true;
jt_set_page( array( 'id' => 711, 'type' => 'page', 'slug' => 'child-support', 'title' => 'מזונות ילדים', 'terms' => array( 'child-support' ) ) );
jt_maya_assert( false === justice_maya_context()['applies'], 'her graph applies although another lawyer holds the first (always placed) card' );
jt_maya_assert( true === justice_maya_context()['styles'], 'her styles are not printed when her card can take the second slot' );
ob_start();
justice_maya_head();
$second = (string) ob_get_clean();
jt_maya_assert( false !== strpos( $second, 'id="jt-maya-card-css"' ) && false === strpos( $second, 'jt-maya-presence-schema' ), 'second-slot page: styles without the graph expected' );
$jt_rival = false;
jt_set_page( array( 'id' => 712, 'type' => 'page', 'slug' => 'child-support', 'title' => 'מזונות ילדים', 'terms' => array( 'child-support' ) ) );
jt_maya_assert( true === justice_maya_context()['applies'], 'her graph does not apply when she holds the first card' );

// --------------------------------------------------------------------------- 6. styles

$css = justice_maya_css();
jt_maya_assert( false !== strpos( $css, '.jt-procard.jt-maya-card.jt-maya-card' ) && false === strpos( $css, '%S%' ), 'card styles are not scoped' );
foreach ( array( 'Frank Ruhl', 'Inter', 'Space Grotesk', 'linear-gradient', '#fffefa', '#254c43', 'gold', 'cream', 'serif' ) as $banned ) {
	jt_maya_assert( 0 === preg_match( '/(?<![a-z-])' . preg_quote( $banned, '/' ) . '(?![a-z])/i', $css ), 'the card styles use a banned default: ' . $banned );
}
jt_maya_assert( false !== strpos( (string) file_get_contents( dirname( __DIR__ ) . '/justice-ops/maya-presence.php' ), 'Why not the default look' ), 'the palette note is missing' );
ob_start();
justice_maya_head();
$head = (string) ob_get_clean();
jt_maya_assert( false !== strpos( $head, 'id="jt-maya-presence-schema"' ) && false !== strpos( $head, 'id="jt-maya-card-css"' ), 'head output missing on a family page' );
jt_set_page( array( 'id' => 710, 'type' => 'page', 'slug' => 'about-us', 'title' => 'אודות', 'terms' => array() ) );
ob_start();
justice_maya_head();
jt_maya_assert( '' === (string) ob_get_clean(), 'head output printed on a non-family page' );

echo 'maya presence: ' . $jt_checks . " checks passed\n";
