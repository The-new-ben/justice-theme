<?php
define( 'ABSPATH', __DIR__ );
define( 'JUSTICE_THEME_URI', 'https://jus-tice.co.il/wp-content/themes/justice-theme' );
$slug = 'divorce-lawyer'; $feed = false; $active = true; $checks = 0; $queried = 1;
function add_filter( ...$args ) {}
function is_admin() { return false; }
function is_feed() { return $GLOBALS['feed']; }
function is_singular( $types ) { return true; }
function in_the_loop() { return true; }
function is_main_query() { return true; }
function justice_theme_new_look_active() { return $GLOBALS['active']; }
function get_the_ID() { return 1; }
function get_queried_object_id() { return $GLOBALS['queried']; }
function get_post_field( $field, $id ) { return $GLOBALS['slug']; }
function get_the_title( $id ) { return 'Article title'; }
function get_permalink( $id ) { return 'https://jus-tice.co.il/' . $GLOBALS['slug'] . '/'; }
function wp_strip_all_tags( $value ) { return strip_tags( $value ); }
function esc_attr( $s ) { return htmlspecialchars( $s, ENT_QUOTES ); }
function esc_url( $s ) { return htmlspecialchars( $s, ENT_QUOTES ); }
function esc_html( $s ) { return htmlspecialchars( $s, ENT_QUOTES ); }
function get_post_type( $id ) { return $GLOBALS['ptype'] ?? 'post'; }
function justice_theme_cluster_for_slug( $s ) {
	return match ( $s ) {
		'divorce-lawyer' => array( 'key' => 'family-law' ),
		'criminal-defense-attorney' => array( 'key' => 'criminal-law' ),
		default => null,
	};
}
function justice_ops_entity_waves() { return array( __DIR__ . '/../justice-ops/data/legal-entities/family-law-w1.php' ); }
function check_entry( $condition, $message ) {
	if ( ! $condition ) { throw new RuntimeException( $message ); }
	$GLOBALS['checks']++;
}
require __DIR__ . '/../inc/article-simulation-entry.php';
check_entry( str_contains( justice_theme_article_simulation_url( 'criminal-law', 'witness_prep' ), 'purpose=witness_prep' ), 'witness preparation retains its purpose' );
check_entry( str_contains( justice_theme_article_simulation_url( 'criminal-law', 'unknown' ), 'purpose=court_rehearsal' ), 'unknown purpose defaults to trial' );
$content = '<h1>Original article</h1><p>Opening paragraph.</p><p>Original body <a href="/divorce-lawyer/">Existing pillar</a></p>';
$out = justice_theme_article_simulation_entry( $content );
check_entry( 1 === substr_count( $out, 'data-hadmaia-article-entry=' ), 'one bridge' );
check_entry( 1 === substr_count( $out, '<img ' ) && str_contains( $out, '/assets/images/hadmaya/mediator.webp' ) && str_contains( $out, 'המגשרת · דמות AI' ), 'the white card: the mediator asks on divorce pages' );
check_entry( str_contains( $out, 'data-world="mediation"' ) && str_contains( $out, 'class="l3-simcard__quote"' ) && str_contains( $out, 'דמויות AI' ), 'one question, one world, the AI label' );
check_entry( str_contains( $out, 'class="l3-article-simulation__visual l3-simcard__face" href="https://jus-tice.com/#/simulation?entry=role&amp;audience=guest&amp;lang=he&amp;purpose=mediation&amp;topic=divorce"' ), 'the face opens the lead world with its topic' );
check_entry( str_contains( $out, 'purpose=mediation' ) && str_contains( $out, 'purpose=court_rehearsal' ), 'two real actions' );
check_entry( str_contains( $out, 'topic=divorce' ), 'specific divorce topic' );
check_entry( ! str_contains( $out, 'police_interrogation' ), 'no interrogation entry on family pages' );
check_entry( $out === justice_theme_article_simulation_entry( $out ), 'idempotent rendering' );
check_entry( preg_replace( '#<aside class="l3-article-simulation l3-simcard".*?</aside>#s', '', $out ) === $content, 'all original content and links untouched' );
$slug = 'criminal-defense-attorney';
$out = justice_theme_article_simulation_entry( $content );
check_entry( ! str_contains( $out, 'purpose=mediation' ) && str_contains( $out, 'topic=criminal-law' ), 'criminal trial without suggesting criminal mediation' );
check_entry( 1 === substr_count( $out, 'data-investigation-entry="live"' ), 'one live interrogation entry' );
check_entry( str_contains( $out, 'purpose=police_interrogation&amp;topic=criminal-law' ), 'criminal pages open the interrogation world' );
check_entry( str_contains( $out, 'purpose=court_rehearsal' ), 'a criminal hearing stays one tap away' );
check_entry( ! str_contains( $out, 'wa.me/' ) && ! str_contains( $out, 'data-investigation-interest' ), 'the WhatsApp pilot invitation is retired' );
foreach ( array( 'police-investigation-rights', 'consultation-before-police-questioning',
	'recording-interrogation-documentation', 'summons-interrogation-warning-rights',
	'detention-days', 'expunge-closed-cases-record', 'criminal-evidence',
	'criminal-record-deletion', 'dangerous-drugs-ordinance', 'drug-possession',
	'lahav-433', 'police-stations-israel-directory', 'posta', 'drug-offenses-criminal-lawyer' ) as $slug ) {
	$out = justice_theme_article_simulation_entry( $content );
	check_entry( 1 === substr_count( $out, 'data-hadmaia-article-entry="criminal-law"' ), $slug . ': contextual cockpit' );
	check_entry( ! str_contains( $out, 'purpose=mediation' ), $slug . ': no irrelevant criminal mediation' );
	check_entry( str_contains( $out, 'purpose=police_interrogation' ), $slug . ': opens the interrogation world' );
	check_entry( preg_replace( '#<aside class="l3-article-simulation l3-simcard".*?</aside>#s', '', $out ) === $content, $slug . ': original content intact' );
}
$slug = 'opening-divorce-file-rabbinical';
check_entry( 'divorce' === justice_theme_article_simulation_topic( 1 ), 'read the existing entity registry' );
$slug = 'family-law';
check_entry( 'family-law' === justice_theme_article_simulation_topic( 1 ), 'broad family hub remains broad' );
$slug = 'unrelated-page'; $ptype = 'page';
check_entry( $content === justice_theme_article_simulation_entry( $content ), 'a page with no legal topic gets no card' );
$ptype = 'post';
$out = justice_theme_article_simulation_entry( $content );
check_entry( str_contains( $out, 'data-hadmaia-article-entry="general"' ) && str_contains( $out, 'purpose=court_rehearsal' ) && ! str_contains( $out, 'topic=' ), 'an unmapped legal article gets the general court card, without a topic' );
$slug = 'japan-attorneys';
check_entry( $content === justice_theme_article_simulation_entry( $content ), 'foreign lawyer directories get no card' );
foreach ( array( 'apartment-divorce-price-appraisal' => 'divorce', 'work-accident-guide' => 'personal-injury', 'real-estate-italy' => 'international-real-estate',
	'wrongful-dismissal-guide' => 'employment', 'criminal-sentencing-israel' => 'criminal-law', 'landlord-rights-israel' => 'real-estate', 'finland-lawyer-guide' => '' ) as $address => $expected ) {
	check_entry( $expected === justice_theme_article_simulation_topic_from_slug( $address ), $address . ': classified by its address' );
}
$slug = 'work-accident-guide';
$out = justice_theme_article_simulation_entry( $content );
check_entry( str_contains( $out, 'data-world="witness"' ) && str_contains( $out, 'purpose=witness_prep&amp;topic=personal-injury' ), 'injury pages prepare the testimony' );
$slug = 'unrelated-page';
$slug = 'divorce-lawyer'; $feed = true;
check_entry( $content === justice_theme_article_simulation_entry( $content ), 'feeds unchanged' );
$feed = false; $active = false;
check_entry( $content === justice_theme_article_simulation_entry( $content ), 'old theme mode unchanged' );
$active = true; $queried = 2;
check_entry( $content === justice_theme_article_simulation_entry( $content ), 'secondary content never gets the primary topic' );
echo $checks . " article-entry checks passed\n";
