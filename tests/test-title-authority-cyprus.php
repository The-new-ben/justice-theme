<?php
declare(strict_types=1);

define( 'ABSPATH', __DIR__ . '/' );

class WP_Post {
	public int $ID;
	public string $post_name;
	public string $post_type = 'articles';
	public string $post_title;

	public function __construct( int $id, string $slug, string $post_title ) {
		$this->ID        = $id;
		$this->post_name = $slug;
		$this->post_title = $post_title;
	}
}

$jt_title_filters = array();
$jt_title_posts   = array(
	1 => new WP_Post( 1, 'about-cyprus', 'קפריסין | דסק קפריסין' ),
	2 => new WP_Post( 2, 'buy-real-estate-cyprus', 'השקעות נדל"ן בקפריסין 2024 | ' . "\u{202B}" . 'עלויות נדל”ן קפריסין' ),
	3 => new WP_Post( 3, 'buying-property-in-greece', 'DB Greece title' ),
	4 => new WP_Post( 4, 'lawyer-for-buying-or-selling-a-house', 'DB transaction title' ),
);

function add_filter( string $tag, callable $callback, int $priority = 10, int $accepted_args = 1 ): void {
	global $jt_title_filters;
	$jt_title_filters[ $tag ][ $priority ][] = $callback;
}
function add_action( string $tag, callable $callback, int $priority = 10, int $accepted_args = 1 ): void {}
function remove_filter( ...$args ): bool {
	return true;
}
function is_singular(): bool {
	return false;
}
function get_queried_object_id(): int {
	return 0;
}
function get_post_meta( int $post_id, string $key, bool $single = false ): string {
	return '';
}
function is_admin(): bool {
	return false;
}
function in_the_loop(): bool {
	return true;
}
function is_main_query(): bool {
	return true;
}
function get_post( int $post_id ) {
	global $jt_title_posts;
	return $jt_title_posts[ $post_id ] ?? null;
}

require_once dirname( __DIR__ ) . '/justice-ops/title-authority.php';

function jt_title_cyprus_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

$money = justice_title_authority_h1_shim_money();
jt_title_cyprus_assert( 'עורך דין בקפריסין לישראלים: נדל"ן, חברות ומיסוי' === $money['about-cyprus'], 'about-cyprus legacy H1 changed before release.' );
jt_title_cyprus_assert( 'קניית דירה בקפריסין: מחירים, מיסים וליווי משפטי' === $money['buy-real-estate-cyprus'], 'buy-real-estate-cyprus legacy H1 changed before release.' );
jt_title_cyprus_assert( 'קניית דירה ביוון: מחירים, מיסים והליך הרכישה לישראלים' === $money['buying-property-in-greece'], 'Greece H1 shim changed unexpectedly.' );
jt_title_cyprus_assert( 'עורך דין לקניית דירה ומכירת דירה: ליווי, בדיקות ומחיר' === $money['lawyer-for-buying-or-selling-a-house'], 'Israeli transaction H1 shim changed unexpectedly.' );

$title_filter = $jt_title_filters['the_title'][20][0] ?? null;
jt_title_cyprus_assert( is_callable( $title_filter ), 'Title authority filter was not registered at priority 20.' );
jt_title_cyprus_assert( $money['about-cyprus'] === $title_filter( $jt_title_posts[1]->post_title, 1 ), 'Pre-write about-cyprus H1 changed.' );
jt_title_cyprus_assert( $money['buy-real-estate-cyprus'] === $title_filter( $jt_title_posts[2]->post_title, 2 ), 'Pre-write buy-real-estate-cyprus H1 changed.' );

$states = justice_title_authority_cyprus_h1_states();
$jt_title_posts[1]->post_title = $states['about-cyprus']['target_post_title'];
$jt_title_posts[2]->post_title = $states['buy-real-estate-cyprus']['target_post_title'];
jt_title_cyprus_assert( $states['about-cyprus']['target_post_title'] === $title_filter( $jt_title_posts[1]->post_title, 1 ), 'Approved about-cyprus target did not render from DB post_title.' );
jt_title_cyprus_assert( $states['buy-real-estate-cyprus']['target_post_title'] === $title_filter( $jt_title_posts[2]->post_title, 2 ), 'Approved buy-real-estate-cyprus target did not render from DB post_title.' );

$jt_title_posts[1]->post_title = $states['about-cyprus']['prior_post_title'];
$jt_title_posts[2]->post_title = $states['buy-real-estate-cyprus']['prior_post_title'];
jt_title_cyprus_assert( $money['about-cyprus'] === $title_filter( $jt_title_posts[1]->post_title, 1 ), 'Rollback did not reactivate the about-cyprus legacy H1.' );
jt_title_cyprus_assert( $money['buy-real-estate-cyprus'] === $title_filter( $jt_title_posts[2]->post_title, 2 ), 'Rollback did not reactivate the buy-real-estate-cyprus legacy H1.' );

$jt_title_posts[1]->post_title = 'Unexpected Cyprus title';
$jt_title_posts[2]->post_title = 'Unexpected purchase title';
jt_title_cyprus_assert( $money['about-cyprus'] === $title_filter( $jt_title_posts[1]->post_title, 1 ), 'Unexpected about-cyprus title did not fail closed.' );
jt_title_cyprus_assert( $money['buy-real-estate-cyprus'] === $title_filter( $jt_title_posts[2]->post_title, 2 ), 'Unexpected buy-real-estate-cyprus title did not fail closed.' );
jt_title_cyprus_assert( $money['buying-property-in-greece'] === $title_filter( 'DB Greece title', 3 ), 'Unrelated Greece shim stopped rendering byte-identically.' );
jt_title_cyprus_assert( $money['lawyer-for-buying-or-selling-a-house'] === $title_filter( 'DB transaction title', 4 ), 'Unrelated transaction shim stopped rendering byte-identically.' );

echo "title authority Cyprus tests passed\n";
