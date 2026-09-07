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
		$html .= '<h2>' . esc_html( $section[0] ) . '</h2>' . "\n" . $section[1] . "\n\n";
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
 * Seed pending waves: one-time per wave key, on a normal front request.
 */
function justice_ops_entity_seed(): void {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}

	foreach ( justice_ops_entity_waves() as $option_key => $file ) {
		if ( get_option( $option_key ) ) {
			continue;
		}

		$entries = include $file;

		if ( ! is_array( $entries ) ) {
			update_option( $option_key, 'skipped:bad-file', false );

			continue;
		}

		$created = 0;
		$skipped = 0;
		$made    = array();

		// Pass 1: create every page first, so cross-links between wave
		// siblings resolve when the content renders in pass 2.
		foreach ( $entries as $entry ) {
			if ( empty( $entry['slug'] ) || empty( $entry['title'] ) ) {
				$skipped++;

				continue;
			}

			if ( get_page_by_path( $entry['slug'], OBJECT, array( 'page', 'post', 'articles' ) ) ) {
				$skipped++;

				continue; // Never overwrite a living slug.
			}

			$post_id = wp_insert_post( wp_slash( array(
				'post_type'    => 'page',
				'post_status'  => 'draft',
				'post_name'    => $entry['slug'],
				'post_title'   => $entry['title'],
				'post_content' => '',
			) ), true );

			if ( is_wp_error( $post_id ) || ! $post_id ) {
				$skipped++;

				continue;
			}

			$made[ $entry['slug'] ] = array( (int) $post_id, $entry );
		}

		// Pass 2: render (drafts resolve via the id map) and publish.
		foreach ( $made as $slug => $pair ) {
			list( $post_id, $entry ) = $pair;

			$result = wp_update_post( wp_slash( array(
				'ID'           => $post_id,
				'post_status'  => 'publish',
				'post_name'    => $slug,
				'post_content' => justice_ops_entity_render( $entry, $made ),
			) ), true );

			if ( is_wp_error( $result ) ) {
				$skipped++;

				continue;
			}

			if ( ! empty( $entry['seo_title'] ) ) {
				update_post_meta( $post_id, '_yoast_wpseo_title', $entry['seo_title'] );
			}

			if ( ! empty( $entry['seo_desc'] ) ) {
				update_post_meta( $post_id, '_yoast_wpseo_metadesc', $entry['seo_desc'] );
			}

			$created++;
		}

		update_option( $option_key, sprintf( 'done:%s created:%d skipped:%d', wp_date( 'Y-m-d H:i:s' ), $created, $skipped ), false );
	}
}
add_action( 'init', 'justice_ops_entity_seed', 50 );

// Status route: GET /wp-json/justice-ops/v1/entity-waves
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/entity-waves', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$status = array();

			foreach ( justice_ops_entity_waves() as $option_key => $file ) {
				$status[ basename( $file, '.php' ) ] = (string) get_option( $option_key, 'pending' );
			}

			return $status;
		},
	) );
} );
