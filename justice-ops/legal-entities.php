<?php
/**
 * The legal entity network: real WordPress pages seeded from a data
 * registry, one wave at a time.
 *
 * Each entry in a wave file becomes a published page with a clean English
 * slug (no query parameters, no dates), a Hebrew title in the language of
 * the ranking sites, verified facts with their official sources, internal
 * links up to the practice pillar and across to sibling entities, and a
 * plain link into the courtroom simulation. Pages are ordinary WP pages:
 * the owner can edit them in wp-admin, Yoast reads them, breadcrumbs and
 * templates apply as usual.
 *
 * Seeding is idempotent and guarded per wave: a wave runs once, never
 * overwrites an existing slug, and records what it did. Removing a wave
 * file later does NOT delete pages; content removal stays a human decision.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! defined( 'JUSTICE_OPS_ENTITY_BATCH' ) ) {
	define( 'JUSTICE_OPS_ENTITY_BATCH', 5 ); // Pages written per front request; a page costs about 10 seconds on the host.
}

if ( ! defined( 'JUSTICE_OPS_ENTITY_LOCK_TTL' ) ) {
	define( 'JUSTICE_OPS_ENTITY_LOCK_TTL', 3 * MINUTE_IN_SECONDS );
}

/**
 * Wave files: version-keyed so a wave runs exactly once per key.
 *
 * @return array<string,string> option key => data file path.
 */
function justice_ops_entity_waves(): array {
	$waves = array();

	foreach ( glob( __DIR__ . '/data/legal-entities/*.php' ) ?: array() as $file ) {
		$waves[ 'justice_ops_entity_wave_' . basename( $file, '.php' ) ] = $file;
	}

	return $waves;
}

/**
 * Render one entity entry to post_content HTML.
 *
 * Structure follows the language bank: a short intro, a "בקצרה" facts box
 * with sourced numbers, body sections, official sources, related links,
 * the simulation invitation, and the standing disclaimer.
 *
 * @param array $entry Entity definition.
 * @param array $wave  slug => array(post_id, entry) of the wave being seeded.
 * @return string
 */
function justice_ops_entity_render( array $entry, array $wave = array() ): string {
	$html = '';

	if ( ! empty( $entry['intro'] ) ) {
		$html .= '<p>' . $entry['intro'] . '</p>' . "\n\n";
	}

	if ( ! empty( $entry['facts'] ) ) {
		$html .= '<h2>בקצרה</h2>' . "\n" . '<ul>' . "\n";

		foreach ( $entry['facts'] as $fact ) {
			$line = $fact[0];

			if ( ! empty( $fact[1] ) ) {
				$label = ! empty( $fact[2] ) ? $fact[2] : 'מקור';
				$line .= ' (<a href="' . esc_url( $fact[1] ) . '" target="_blank" rel="noopener">' . esc_html( $label ) . '</a>)';
			}

			$html .= '<li>' . $line . '</li>' . "\n";
		}

		$html .= '</ul>' . "\n\n";
	}

	foreach ( (array) ( $entry['sections'] ?? array() ) as $section ) {
		$heading = $section['h'] ?? ( $section[0] ?? '' );
		$body    = $section['p'] ?? ( $section[1] ?? '' );

		if ( '' === $heading || '' === $body ) {
			continue;
		}

		// Plain paragraphs in the data stay plain: wrap each blank-line block.
		if ( false === strpos( $body, '<' ) ) {
			$body = '<p>' . implode( '</p>' . "\n" . '<p>', preg_split( '/\n\s*\n/', trim( $body ) ) ) . '</p>';
		}

		$html .= '<h2>' . esc_html( $heading ) . '</h2>' . "\n" . $body . "\n\n";
	}

	if ( ! empty( $entry['official'] ) ) {
		$html .= '<h2>מקורות רשמיים</h2>' . "\n" . '<ul>' . "\n";

		foreach ( $entry['official'] as $link ) {
			$html .= '<li><a href="' . esc_url( $link[1] ) . '" target="_blank" rel="noopener">' . esc_html( $link[0] ) . '</a></li>' . "\n";
		}

		$html .= '</ul>' . "\n\n";
	}

	$related_links = array();

	foreach ( (array) ( $entry['related'] ?? array() ) as $related_slug ) {
		if ( isset( $wave[ $related_slug ] ) ) {
			$related_links[] = '<li><a href="' . esc_url( home_url( '/' . $related_slug . '/' ) ) . '">' . esc_html( $wave[ $related_slug ][1]['title'] ) . '</a></li>';

			continue;
		}

		$related_post = get_page_by_path( $related_slug, OBJECT, array( 'page', 'post', 'articles' ) );

		if ( $related_post instanceof WP_Post && 'publish' === $related_post->post_status ) {
			$related_links[] = '<li><a href="' . esc_url( get_permalink( $related_post ) ) . '">' . esc_html( get_the_title( $related_post ) ) . '</a></li>';
		}
	}

	if ( ! empty( $entry['pillar'] ) ) {
		$pillar_post = get_page_by_path( $entry['pillar'], OBJECT, array( 'page', 'post', 'articles' ) );

		if ( $pillar_post instanceof WP_Post && 'publish' === $pillar_post->post_status ) {
			array_unshift( $related_links, '<li><a href="' . esc_url( get_permalink( $pillar_post ) ) . '">' . esc_html( get_the_title( $pillar_post ) ) . '</a></li>' );
		}
	}

	if ( $related_links ) {
		$html .= '<h2>מידע נוסף בנושא</h2>' . "\n" . '<ul>' . "\n" . implode( "\n", $related_links ) . "\n" . '</ul>' . "\n\n";
	}

	$html .= '<h2>רוצים לראות איך זה נראה בדיון?</h2>' . "\n"
		. '<p>בסימולציית בית המשפט של Jus-Tice מתארים את המקרה במשפט אחד וצופים בדיון חי עם שופטת ועורכי דין, בעברית. כלי הכנה, לא ייעוץ משפטי. <a href="' . esc_url( home_url( '/legal-simulation/' ) ) . '">להתחלת סימולציה</a>.</p>' . "\n\n";

	$html .= '<p><em>המידע בעמוד זה כללי ומעודכן למועד הכתיבה, ואינו מהווה ייעוץ משפטי. הסכומים והמועדים נלקחו מהמקורות הרשמיים המקושרים.</em></p>';

	return $html;
}

/**
 * One heavy pass per request, whether seeding or refreshing: the flag is
 * raised by whichever ran, and the other backs off until the next request.
 *
 * @param bool|null $set true raises the flag, false clears it (tests), null reads.
 * @return bool Whether a pass already ran in this request.
 */
function justice_ops_entity_request_worked( ?bool $set = null ): bool {
	static $worked = false;

	if ( null !== $set ) {
		$worked = $set;
	}

	return $worked;
}

/**
 * The seeding lock carries its own timestamp: if the transient layer fails
 * to expire it (observed on the host on 2026-09-08: a lock from a killed
 * request stayed visible for over an hour), a lock older than the TTL is
 * treated as free.
 *
 * @return bool Whether a live lock is held by another request.
 */
function justice_ops_entity_locked(): bool {
	$lock = (string) get_transient( 'justice_ops_entity_seeding' );

	if ( '' === $lock ) {
		return false;
	}

	$at = (int) substr( strrchr( $lock, '@' ) ?: '@0', 1 );

	return $at > 0 && ( time() - $at ) < JUSTICE_OPS_ENTITY_LOCK_TTL;
}

/**
 * Take the lock for this request.
 *
 * @param string $label What holds it (wave key, plus :refresh for the refresh pass).
 */
function justice_ops_entity_lock( string $label ): void {
	set_transient( 'justice_ops_entity_seeding', $label . '@' . time(), JUSTICE_OPS_ENTITY_LOCK_TTL );
}

/**
 * Seed pending waves: one-time per wave key, on a normal front request.
 */
function justice_ops_entity_seed(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || justice_ops_entity_request_worked() ) {
		return;
	}

	foreach ( justice_ops_entity_waves() as $option_key => $file ) {
		if ( get_option( $option_key ) ) {
			continue;
		}

		// A wave is seeded in small batches, one batch per front request:
		// a whole 47-page wave in one request saturated the host's PHP
		// workers (measured 2026-09-08: 10 minutes per wave, 502s for
		// visitors). The lock keeps concurrent requests from seeding the same
		// wave side by side and is short because a batch is short.
		if ( justice_ops_entity_locked() ) {
			return;
		}

		justice_ops_entity_request_worked( true );
		justice_ops_entity_lock( $option_key );

		if ( function_exists( 'set_time_limit' ) ) {
			@set_time_limit( 180 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
		}

		ignore_user_abort( true );

		$entries = include $file;

		if ( ! is_array( $entries ) ) {
			update_option( $option_key, 'skipped:bad-file', false );
			delete_transient( 'justice_ops_entity_seeding' );

			continue;
		}

		$progress = (array) get_option( $option_key . '_progress', array() );
		$progress = array_merge( array( 'created' => 0, 'skipped' => 0, 'seen' => array() ), $progress );
		$wave     = array();
		$batch    = array();

		foreach ( $entries as $entry ) {
			if ( ! empty( $entry['slug'] ) ) {
				$wave[ $entry['slug'] ] = array( 0, $entry ); // Sibling titles resolve from data, whatever the seeding order.
			}
		}

		foreach ( $entries as $entry ) {
			$slug = (string) ( $entry['slug'] ?? '' );

			if ( '' === $slug || empty( $entry['title'] ) ) {
				continue;
			}

			if ( isset( $progress['seen'][ $slug ] ) ) {
				continue;
			}

			$existing = get_page_by_path( $slug, OBJECT, array( 'page', 'post', 'articles' ) );

			if ( $existing instanceof WP_Post ) {
				// Adopt only a draft that carries this wave's own ownership
				// marker and is still empty (an interrupted run of the older
				// draft-first seeder). Anything else is a living slug.
				$ours = 'page' === $existing->post_type
					&& 'draft' === $existing->post_status
					&& '' === trim( (string) $existing->post_content )
					&& $option_key === (string) get_post_meta( $existing->ID, '_justice_ops_entity_seed', true );

				if ( ! $ours ) {
					$progress['seen'][ $slug ] = 1;
					$progress['skipped']++;

					continue;
				}

				$batch[ $slug ] = array( (int) $existing->ID, $entry );
			} else {
				$batch[ $slug ] = array( 0, $entry );
			}

			if ( count( $batch ) >= JUSTICE_OPS_ENTITY_BATCH ) {
				break;
			}
		}

		if ( ! $batch ) {
			// Nothing left to create: the wave is complete.
			update_option( $option_key, sprintf( 'done:%s created:%d skipped:%d', wp_date( 'Y-m-d H:i:s' ), (int) $progress['created'], (int) $progress['skipped'] ), false );
			update_option( $option_key . '_data', md5_file( $file ), false );
			delete_option( $option_key . '_progress' );
			delete_transient( 'justice_ops_entity_seeding' );

			return;
		}

		foreach ( $batch as $slug => $pair ) {
			list( $post_id, $entry ) = $pair;

			$fields = array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_name'    => $slug,
				'post_title'   => $entry['title'],
				'post_content' => justice_ops_entity_render( $entry, $wave ),
			);

			if ( $post_id > 0 ) {
				$fields['ID'] = $post_id;
				$result       = wp_update_post( wp_slash( $fields ), true );
			} else {
				$result = wp_insert_post( wp_slash( $fields ), true );
			}

			$progress['seen'][ $slug ] = 1;

			if ( is_wp_error( $result ) || ! $result ) {
				$progress['skipped']++;

				continue;
			}

			update_post_meta( (int) $result, '_justice_ops_entity_seed', $option_key );
			justice_ops_entity_apply_meta( (int) $result, $entry );

			$progress['created']++;
		}

		update_option( $option_key . '_progress', $progress, false );
		delete_transient( 'justice_ops_entity_seeding' );

		return;
	}
}
add_action( 'init', 'justice_ops_entity_seed', 50 );

/**
 * Yoast meta plus the render fingerprint that lets a later refresh tell an
 * untouched seeded page from one the owner has edited.
 *
 * @param int   $post_id Page id.
 * @param array $entry   Entity definition.
 */
function justice_ops_entity_apply_meta( int $post_id, array $entry ): void {
	if ( ! empty( $entry['seo_title'] ) ) {
		update_post_meta( $post_id, '_yoast_wpseo_title', $entry['seo_title'] );
	}

	if ( ! empty( $entry['seo_desc'] ) ) {
		update_post_meta( $post_id, '_yoast_wpseo_metadesc', $entry['seo_desc'] );
	}

	update_post_meta( $post_id, '_justice_ops_entity_hash', md5( (string) get_post_field( 'post_content', $post_id ) ) );
}

/**
 * Refresh pass: when a wave's data file changes after it was seeded (a fixed
 * source link, a richer section, a corrected number), re-render the pages of
 * that wave that nobody has edited since seeding. A page the owner touched in
 * wp-admin is left exactly as he left it: the test is the render fingerprint
 * stored at seed time, or for pages seeded before fingerprints existed, a
 * post_modified stamp that is still inside the seeding minute.
 */
function justice_ops_entity_refresh(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() || justice_ops_entity_request_worked() ) {
		return;
	}

	foreach ( justice_ops_entity_waves() as $option_key => $file ) {
		$state = (string) get_option( $option_key );

		if ( 0 !== strpos( $state, 'done:' ) ) {
			continue; // Not seeded yet; the seeder owns it.
		}

		$data_hash = md5_file( $file );

		if ( get_option( $option_key . '_data' ) === $data_hash ) {
			continue;
		}

		if ( justice_ops_entity_locked() || get_transient( $option_key . '_retry_after' ) ) {
			return;
		}

		justice_ops_entity_request_worked( true );
		justice_ops_entity_lock( $option_key . ':refresh' );

		if ( function_exists( 'set_time_limit' ) ) {
			@set_time_limit( 180 ); // phpcs:ignore WordPress.PHP.NoSilencedErrors.Discouraged
		}

		ignore_user_abort( true );

		$entries = include $file;

		if ( ! is_array( $entries ) ) {
			delete_transient( 'justice_ops_entity_seeding' );

			continue;
		}

		// Same batching as the seeder: a few pages per request, progress kept
		// in an option, restarted from scratch if the data changes mid-way.
		$progress = (array) get_option( $option_key . '_refresh_progress', array() );

		if ( ( $progress['hash'] ?? '' ) !== $data_hash ) {
			$progress = array( 'hash' => $data_hash, 'seen' => array(), 'refreshed' => 0, 'kept' => 0, 'failed' => 0 );
		}

		$seeded_at = strtotime( substr( $state, 5, 19 ) . ' ' . wp_timezone_string() ) ?: 0;
		$wave      = array();

		foreach ( $entries as $entry ) {
			if ( ! empty( $entry['slug'] ) ) {
				$wave[ $entry['slug'] ] = array( 0, $entry );
			}
		}

		$updates = 0;
		$pending = 0;

		foreach ( $entries as $entry ) {
			$slug = (string) ( $entry['slug'] ?? '' );

			if ( '' === $slug || empty( $entry['title'] ) || isset( $progress['seen'][ $slug ] ) ) {
				continue;
			}

			if ( $updates >= JUSTICE_OPS_ENTITY_BATCH ) {
				$pending++;

				break;
			}

			$page = get_page_by_path( $slug, OBJECT, 'page' );

			if ( ! ( $page instanceof WP_Post ) || 'publish' !== $page->post_status ) {
				$progress['seen'][ $slug ] = 1;
				$progress['kept']++;

				continue;
			}

			$stored    = (string) get_post_meta( $page->ID, '_justice_ops_entity_hash', true );
			$untouched = '' !== $stored
				? hash_equals( $stored, md5( (string) $page->post_content ) )
				: ( $seeded_at > 0 && strtotime( $page->post_modified_gmt . ' UTC' ) <= $seeded_at + 5 * MINUTE_IN_SECONDS );

			$progress['seen'][ $slug ] = 1;

			if ( ! $untouched ) {
				$progress['kept']++;

				continue;
			}

			$result = wp_update_post( wp_slash( array(
				'ID'           => $page->ID,
				'post_title'   => $entry['title'],
				'post_content' => justice_ops_entity_render( $entry, $wave ),
			) ), true );

			$updates++;

			if ( is_wp_error( $result ) ) {
				$progress['failed']++;

				continue;
			}

			justice_ops_entity_apply_meta( $page->ID, $entry );

			$progress['refreshed']++;
		}

		if ( $pending > 0 ) {
			update_option( $option_key . '_refresh_progress', $progress, false );
			delete_transient( 'justice_ops_entity_seeding' );

			return;
		}

		// Every entry was seen: the data hash advances only when every
		// intended update landed; otherwise the wave stays due and is
		// retried after a pause, so a transient failure is neither lost nor
		// retried on every request.
		if ( 0 === (int) $progress['failed'] ) {
			update_option( $option_key . '_data', $data_hash, false );
		} else {
			set_transient( $option_key . '_retry_after', (int) $progress['failed'], HOUR_IN_SECONDS );
		}

		update_option( $option_key . '_refresh', sprintf( 'done:%s refreshed:%d kept:%d failed:%d', wp_date( 'Y-m-d H:i:s' ), (int) $progress['refreshed'], (int) $progress['kept'], (int) $progress['failed'] ), false );
		delete_option( $option_key . '_refresh_progress' );
		delete_transient( 'justice_ops_entity_seeding' );

		return;
	}
}
add_action( 'init', 'justice_ops_entity_refresh', 51 );

/**
 * The wiring layer (owner order 2026-09-07): every entity page carries a
 * clean hierarchy line up to its money pillar, and every pillar carries a
 * practical-information hub listing its wave entities. All links are plain
 * paths, no parameters; only pages that exist render. The layered,
 * everything-clickable model follows kolzchut; outbound links stay
 * official-only (that lives in the wave data, not here).
 */

/**
 * Reverse index over every wave file: slug => entry, pillar => entries.
 *
 * @return array{by_slug:array<string,array>,by_pillar:array<string,array<int,array>>}
 */
function justice_ops_entity_index(): array {
	static $index = null;

	if ( null !== $index ) {
		return $index;
	}

	$index = array(
		'by_slug'   => array(),
		'by_pillar' => array(),
	);

	foreach ( justice_ops_entity_waves() as $file ) {
		$entries = include $file;

		if ( ! is_array( $entries ) ) {
			continue;
		}

		foreach ( $entries as $entry ) {
			if ( empty( $entry['slug'] ) || empty( $entry['title'] ) ) {
				continue;
			}

			$index['by_slug'][ $entry['slug'] ] = $entry;

			if ( ! empty( $entry['pillar'] ) ) {
				$index['by_pillar'][ $entry['pillar'] ][] = $entry;
			}
		}
	}

	return $index;
}

/**
 * The slug of the page being served. The queried object first; on the
 * theme's controlled practice routes (where the main query is re-typed and
 * the queried object is not the page) the single-segment request path.
 *
 * @return string
 */
function justice_ops_entity_current_slug(): string {
	if ( is_admin() || is_feed() || is_archive() || is_search() || is_home() ) {
		return '';
	}

	$queried = get_queried_object();

	if ( $queried instanceof WP_Post && ! empty( $queried->post_name ) ) {
		return $queried->post_name;
	}

	$path = strtolower( trim( (string) wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH ), '/' ) );

	return ( '' !== $path && false === strpos( $path, '/' ) && preg_match( '/^[a-z0-9-]+$/', $path ) ) ? $path : '';
}

/**
 * The pillar page of an entity, when it is live.
 *
 * @param array $entry Entity definition.
 * @return WP_Post|null
 */
function justice_ops_entity_pillar_post( array $entry ): ?WP_Post {
	if ( empty( $entry['pillar'] ) ) {
		return null;
	}

	$pillar_post = get_page_by_path( $entry['pillar'], OBJECT, array( 'page', 'post', 'articles' ) );

	return ( $pillar_post instanceof WP_Post && 'publish' === $pillar_post->post_status ) ? $pillar_post : null;
}

/**
 * Which of a pillar's entity slugs are live published pages: one query per
 * pillar per request instead of one lookup per entity.
 *
 * @param string $pillar Pillar slug.
 * @return array<string,bool> slug => true.
 */
function justice_ops_entity_live_slugs( string $pillar ): array {
	static $cache = array();

	if ( isset( $cache[ $pillar ] ) ) {
		return $cache[ $pillar ];
	}

	global $wpdb;

	$index = justice_ops_entity_index();
	$slugs = array_values( array_unique( wp_list_pluck( $index['by_pillar'][ $pillar ] ?? array(), 'slug' ) ) );
	$live  = array();

	if ( $slugs ) {
		$placeholders = implode( ',', array_fill( 0, count( $slugs ), '%s' ) );
		$found        = $wpdb->get_col( $wpdb->prepare( "SELECT post_name FROM {$wpdb->posts} WHERE post_type = 'page' AND post_status = 'publish' AND post_name IN ($placeholders)", $slugs ) ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared

		foreach ( (array) $found as $name ) {
			$live[ (string) $name ] = true;
		}
	}

	$cache[ $pillar ] = $live;

	return $live;
}

/**
 * Design contract for the theme (Astra's redesign lane): these two template
 * functions, the shortcode and the filters below are the public surface.
 * A template that places the hub or the hierarchy line itself calls the
 * function where the design wants it and turns the automatic placement
 * off with add_filter( 'justice_ops_entity_auto_wire', '__return_false' ).
 * The markup passes through 'justice_ops_entity_hub_html' and
 * 'justice_ops_entity_crumb_html' so the design can restyle or rebuild it.
 */

/**
 * The live entities of a pillar as plain data (slug, title, description, url).
 *
 * @param string $pillar Pillar slug.
 * @param int    $limit  Cap.
 * @return array<int,array{slug:string,title:string,description:string,url:string}>
 */
function justice_ops_entity_items( string $pillar, int $limit = 30 ): array {
	$index = justice_ops_entity_index();

	if ( empty( $index['by_pillar'][ $pillar ] ) ) {
		return array();
	}

	$live  = justice_ops_entity_live_slugs( $pillar );
	$items = array();

	foreach ( $index['by_pillar'][ $pillar ] as $entry ) {
		if ( count( $items ) >= $limit ) {
			break;
		}

		if ( empty( $live[ $entry['slug'] ] ) ) {
			continue; // Only pages that were actually seeded.
		}

		$items[] = array(
			'slug'        => $entry['slug'],
			'title'       => $entry['title'],
			'description' => (string) ( $entry['seo_desc'] ?? '' ),
			'url'         => home_url( '/' . $entry['slug'] . '/' ),
		);
	}

	return $items;
}

/**
 * The practical-information hub of a pillar. Empty string below 3 live items.
 *
 * @param string $pillar Pillar slug (defaults to the page being served).
 * @param string $title  Heading.
 * @return string
 */
function justice_ops_entity_hub_html( string $pillar = '', string $title = 'מידע מעשי בנושא: אגרות, טפסים, מוסדות וחוקים' ): string {
	$pillar = '' !== $pillar ? $pillar : justice_ops_entity_current_slug();
	$items  = justice_ops_entity_items( $pillar );

	if ( count( $items ) < 3 ) {
		return '';
	}

	$list = '';

	foreach ( $items as $item ) {
		$list .= '<li><a href="' . esc_url( $item['url'] ) . '">' . esc_html( $item['title'] ) . '</a></li>';
	}

	$html = '<section class="jt-entity-hub"><h2>' . esc_html( $title ) . '</h2><ul>' . $list . '</ul></section>';

	return (string) apply_filters( 'justice_ops_entity_hub_html', $html, $pillar, $items );
}

/**
 * The hierarchy line of an entity page: home, pillar, page.
 *
 * @param string $slug Entity slug (defaults to the page being served).
 * @return string Empty when the slug is not an entity.
 */
function justice_ops_entity_crumb_html( string $slug = '' ): string {
	$slug  = '' !== $slug ? $slug : justice_ops_entity_current_slug();
	$index = justice_ops_entity_index();

	if ( ! isset( $index['by_slug'][ $slug ] ) ) {
		return '';
	}

	$entry       = $index['by_slug'][ $slug ];
	$pieces      = array( '<a href="' . esc_url( home_url( '/' ) ) . '">דף הבית</a>' );
	$pillar_post = justice_ops_entity_pillar_post( $entry );

	if ( $pillar_post ) {
		$pieces[] = '<a href="' . esc_url( get_permalink( $pillar_post ) ) . '">' . esc_html( get_the_title( $pillar_post ) ) . '</a>';
	}

	$pieces[] = '<span>' . esc_html( $entry['title'] ) . '</span>';

	$html = '<nav class="jt-entity-crumb" aria-label="מיקום בהיררכיה">' . implode( ' <span aria-hidden="true">&#8250;</span> ', $pieces ) . '</nav>';

	return (string) apply_filters( 'justice_ops_entity_crumb_html', $html, $slug, $entry );
}

add_shortcode( 'justice_entity_hub', function ( $atts ) {
	$atts = shortcode_atts( array( 'pillar' => '', 'title' => 'מידע מעשי בנושא: אגרות, טפסים, מוסדות וחוקים' ), (array) $atts, 'justice_entity_hub' );

	return justice_ops_entity_hub_html( (string) $atts['pillar'], (string) $atts['title'] );
} );

add_filter( 'the_content', function ( $content ) {
	// No in_the_loop() test on purpose: the theme's practice-landing part
	// (the divorce, criminal and malpractice pillars) applies the_content to
	// the page's raw body outside the loop, and that is exactly where the hub
	// has to appear. Secondary loops never pass is_main_query().
	if ( ! is_main_query() || ! is_string( $content ) || ! apply_filters( 'justice_ops_entity_auto_wire', true ) ) {
		return $content;
	}

	$slug = justice_ops_entity_current_slug();

	if ( '' === $slug ) {
		return $content;
	}

	$index = justice_ops_entity_index();

	// Entity page: a hierarchy line up to the money pillar.
	if ( isset( $index['by_slug'][ $slug ] ) && false === strpos( $content, 'jt-entity-crumb' ) ) {
		$content = justice_ops_entity_crumb_html( $slug ) . $content;
	}

	// Pillar page: the practical-information hub of its entities.
	if ( isset( $index['by_pillar'][ $slug ] ) && false === strpos( $content, 'jt-entity-hub' ) ) {
		$content .= justice_ops_entity_hub_html( $slug );
	}

	return $content;
}, 28 );

/**
 * Yoast breadcrumbs (and therefore its BreadcrumbList schema) get the pillar
 * between the home link and the entity, so the hierarchy Google reads matches
 * the one the reader sees.
 */
add_filter( 'wpseo_breadcrumb_links', function ( $links ) {
	if ( ! is_array( $links ) || count( $links ) < 2 ) {
		return $links;
	}

	$slug  = justice_ops_entity_current_slug();
	$index = justice_ops_entity_index();

	if ( '' === $slug || ! isset( $index['by_slug'][ $slug ] ) ) {
		return $links;
	}

	$pillar_post = justice_ops_entity_pillar_post( $index['by_slug'][ $slug ] );

	if ( ! $pillar_post ) {
		return $links;
	}

	$pillar_url = get_permalink( $pillar_post );

	foreach ( $links as $link ) {
		if ( is_array( $link ) && isset( $link['url'] ) && untrailingslashit( (string) $link['url'] ) === untrailingslashit( (string) $pillar_url ) ) {
			return $links; // Already there.
		}
	}

	array_splice( $links, count( $links ) - 1, 0, array( array(
		'url'  => $pillar_url,
		'text' => get_the_title( $pillar_post ),
	) ) );

	return $links;
} );

add_action( 'wp_head', function () {
	$slug = justice_ops_entity_current_slug();

	if ( '' === $slug ) {
		return;
	}

	$index = justice_ops_entity_index();

	if ( ! isset( $index['by_slug'][ $slug ] ) && ! isset( $index['by_pillar'][ $slug ] ) ) {
		return;
	}

	echo '<style id="jt-entity-wiring-css">'
		. '.jt-entity-crumb{margin:0 0 18px;font-size:13px;color:#5b6780}'
		. '.jt-entity-crumb a{color:#5b6780;text-decoration:none}'
		. '.jt-entity-crumb a:hover{color:#14213d}'
		. '.jt-entity-hub{margin:34px 0;padding:22px 24px;background:#f7f9fd;border:1px solid #e3e8f2;border-radius:16px}'
		. '.jt-entity-hub h2{margin:0 0 14px;font-size:19px;color:#14213d}'
		. '.jt-entity-hub ul{margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:8px 22px}'
		. '.jt-entity-hub li{padding-inline-start:18px;position:relative}'
		. '.jt-entity-hub li::before{content:"\\2190";position:absolute;inset-inline-start:0;color:#c99a2e}'
		. '.jt-entity-hub a{color:#14213d;text-decoration:none;line-height:1.9}'
		. '.jt-entity-hub a:hover{border-bottom:1px solid #c99a2e}'
		. '</style>';
}, 45 );

// Data route for the design and the React app: GET /wp-json/justice-ops/v1/entities?pillar=<slug>
// (or no pillar: the map of every pillar to its live entity count).
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/entities', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'args'                => array(
			'pillar' => array( 'type' => 'string', 'sanitize_callback' => 'sanitize_title' ),
		),
		'callback'            => function ( $request ) {
			$pillar = (string) $request->get_param( 'pillar' );

			if ( '' !== $pillar ) {
				return array(
					'pillar' => $pillar,
					'url'    => home_url( '/' . $pillar . '/' ),
					'items'  => justice_ops_entity_items( $pillar, 100 ),
				);
			}

			$map = array();

			foreach ( array_keys( justice_ops_entity_index()['by_pillar'] ) as $slug ) {
				$map[ $slug ] = count( justice_ops_entity_items( $slug, 100 ) );
			}

			return $map;
		},
	) );
} );

// Status route: GET /wp-json/justice-ops/v1/entity-waves
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/entity-waves', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$status = array();

			foreach ( justice_ops_entity_waves() as $option_key => $file ) {
				$name            = basename( $file, '.php' );
				$status[ $name ] = (string) get_option( $option_key, 'pending' );
				$refresh         = (string) get_option( $option_key . '_refresh', '' );

				if ( '' !== $refresh ) {
					$status[ $name . ' refresh' ] = $refresh;
				}

				$status[ $name . ' data' ] = ( get_option( $option_key . '_data' ) === md5_file( $file ) ) ? 'current' : 'pending';

				foreach ( array( '_progress' => ' seeding', '_refresh_progress' => ' refreshing' ) as $suffix => $label ) {
					$progress = get_option( $option_key . $suffix );

					if ( is_array( $progress ) ) {
						$status[ $name . $label ] = sprintf( 'seen:%d created:%d refreshed:%d kept:%d skipped:%d failed:%d', count( (array) ( $progress['seen'] ?? array() ) ), (int) ( $progress['created'] ?? 0 ), (int) ( $progress['refreshed'] ?? 0 ), (int) ( $progress['kept'] ?? 0 ), (int) ( $progress['skipped'] ?? 0 ), (int) ( $progress['failed'] ?? 0 ) );
					}
				}
			}

			$lock           = (string) get_transient( 'justice_ops_entity_seeding' );
			$status['lock'] = ( '' !== $lock && justice_ops_entity_locked() ) ? $lock : ( '' !== $lock ? $lock . ' (stale, ignored)' : 'free' );

			return $status;
		},
	) );
} );
