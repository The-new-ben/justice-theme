<?php
/**
 * Self-writing legal encyclopedia for jus-tice.co.il.
 *
 * Ported from the production-proven nad-lan.co.il spec (2026-07): ontology
 * batches in, skeleton drafts, hourly writer against the site's own OpenAI
 * key, deterministic validation (tier word floors, style laws, clean HTML),
 * drip publishing across working hours, full status telemetry.
 *
 * Legal adaptations on top of the spec: citation law (case references only
 * from input metadata, statutes by official name and year, current position
 * dated), the site's AI-teller phrase ban enforced as a validation failure,
 * em/en dashes stripped, site-wide title anti-cannibalization at intake,
 * disclaimer rendered by the site (never written by the model), and the key
 * read from the existing JUSTICE_OPENAI_KEY mu-plugin constant.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// Data model
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	register_post_type( 'justice_term', array(
		'labels'       => array(
			'name'          => 'אנציקלופדיה משפטית',
			'singular_name' => 'ערך משפטי',
		),
		'public'       => true,
		'has_archive'  => true,
		'rewrite'      => array( 'slug' => 'encyclopedia', 'with_front' => false ),
		'menu_icon'    => 'dashicons-book-alt',
		'supports'     => array( 'title', 'editor', 'excerpt', 'custom-fields' ),
		'show_in_rest' => true,
	) );

	register_taxonomy( 'justice_term_cat', 'justice_term', array(
		'labels'       => array( 'name' => 'תחומי אנציקלופדיה' ),
		'hierarchical' => true,
		'public'       => true,
		'rewrite'      => array( 'slug' => 'encyclopedia-domain' ),
		'show_in_rest' => true,
	) );

	foreach ( array( 'name_en', 'entity_type', 'enc_domain', 'enc_priority', 'enc_related', 'enc_sources', 'enc_fail_count', 'enc_written_by', 'enc_written_words' ) as $justice_enc_meta_key ) {
		register_post_meta( 'justice_term', $justice_enc_meta_key, array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => function () {
				return current_user_can( 'edit_posts' );
			},
		) );
	}
}, 5 );

// One-shot rewrite flush per plugin version (new CPT rewrite must register).
add_action( 'init', function () {
	if ( get_option( 'justice_enc_rewrite_flushed' ) !== JUSTICE_OPS_VERSION ) {
		flush_rewrite_rules( false );
		update_option( 'justice_enc_rewrite_flushed', JUSTICE_OPS_VERSION, false );
	}
}, 20 );

function justice_enc_entity_types(): array {
	return array( 'term', 'law', 'regulation', 'ruling', 'court', 'procedure', 'role', 'person', 'organization', 'publication', 'form', 'doctrine' );
}

function justice_enc_tiers(): array {
	return array(
		1 => array( 'lo' => 800, 'hi' => 1300, 'floor' => 700 ),
		2 => array( 'lo' => 450, 'hi' => 700, 'floor' => 400 ),
		3 => array( 'lo' => 250, 'hi' => 400, 'floor' => 250 ),
	);
}

function justice_enc_openai_key(): string {
	if ( defined( 'JUSTICE_OPENAI_KEY' ) && '' !== (string) JUSTICE_OPENAI_KEY ) {
		return (string) JUSTICE_OPENAI_KEY;
	}

	return (string) get_option( 'justice_ops_openai_key', '' );
}

function justice_enc_word_count( string $html ): int {
	$text = trim( wp_strip_all_tags( $html ) );

	if ( '' === $text ) {
		return 0;
	}

	return count( preg_split( '/\s+/u', $text ) );
}

function justice_enc_teller_hits( string $html ): array {
	$hits = array();

	foreach ( array( 'חשוב לציין', 'בעידן', 'מעבר לכך', 'לסיכום', 'ראוי לציין', 'יש לזכור', 'חשוב להבין', 'חשוב לדעת', 'בשורה התחתונה', 'אין ספק', 'יתרה מכך', 'יתרה מזאת', 'זאת ועוד' ) as $phrase ) {
		if ( false !== mb_strpos( $html, $phrase ) ) {
			$hits[] = $phrase;
		}
	}

	return $hits;
}

// ---------------------------------------------------------------------------
// Drip slot algorithm (shared by intake and writer)
// ---------------------------------------------------------------------------

function justice_enc_next_drip_slot(): int {
	$per_day = max( 1, (int) get_option( 'justice_enc_per_day', 12 ) );
	$step    = (int) floor( ( 10 * HOUR_IN_SECONDS ) / $per_day );
	$tz      = wp_timezone();

	$latest = get_posts( array(
		'post_type'      => 'justice_term',
		'post_status'    => 'future',
		'posts_per_page' => 1,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'fields'         => 'ids',
	) );

	if ( $latest ) {
		$last = new DateTimeImmutable( get_post( $latest[0] )->post_date, $tz );
		$next = $last->getTimestamp() + $step;

		$next_dt = ( new DateTimeImmutable( '@' . $next ) )->setTimezone( $tz );
		if ( (int) $next_dt->format( 'H' ) >= 19 || (int) $next_dt->format( 'H' ) < 9 ) {
			$roll = $next_dt->modify( '+1 day' )->setTime( 9, 0 );
			if ( (int) $next_dt->format( 'H' ) < 9 ) {
				$roll = $next_dt->setTime( 9, 0 );
			}
			$next = $roll->getTimestamp();
		}
	} else {
		$next = time() + HOUR_IN_SECONDS;
	}

	if ( $next <= time() ) {
		$next = time() + 5 * MINUTE_IN_SECONDS;
	}

	return $next;
}

// ---------------------------------------------------------------------------
// Intake endpoint
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/glossary-intake', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => 'justice_enc_intake',
	) );

	register_rest_route( 'justice-ops/v1', '/enc-writer-status', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => 'justice_enc_status',
	) );

	register_rest_route( 'justice-ops/v1', '/enc-writer-run', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			$batch = max( 1, min( 3, (int) $request->get_param( 'batch' ) ?: 1 ) );

			return rest_ensure_response( justice_enc_writer_tick( $batch ) );
		},
	) );

	register_rest_route( 'justice-ops/v1', '/keys', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			$key = (string) $request->get_param( 'openai_key' );

			if ( strlen( $key ) < 20 ) {
				return new WP_Error( 'bad_key', 'key too short', array( 'status' => 400 ) );
			}

			update_option( 'justice_ops_openai_key', $key, false );

			return rest_ensure_response( array( 'stored' => true, 'prefix' => substr( $key, 0, 6 ), 'length' => strlen( $key ) ) );
		},
	) );
} );

/**
 * Site-wide exact-title collision check: never open an encyclopedia entry
 * on a title an existing page, post or article already owns.
 */
function justice_enc_site_collision( string $title ): bool {
	global $wpdb;

	return (bool) $wpdb->get_var( $wpdb->prepare(
		"SELECT ID FROM {$wpdb->posts} WHERE post_title = %s AND post_type IN ('post','page','articles') AND post_status IN ('publish','future') LIMIT 1",
		$title
	) );
}

function justice_enc_find_by_title( string $title ): ?WP_Post {
	global $wpdb;

	$id = $wpdb->get_var( $wpdb->prepare(
		"SELECT ID FROM {$wpdb->posts} WHERE post_title = %s AND post_type = 'justice_term' AND post_status NOT IN ('trash','auto-draft') LIMIT 1",
		$title
	) );

	return $id ? get_post( (int) $id ) : null;
}

function justice_enc_intake( WP_REST_Request $request ) {
	$body    = $request->get_json_params();
	$entries = isset( $body['entries'] ) && is_array( $body['entries'] ) ? $body['entries'] : array();

	if ( isset( $body['per_day'] ) ) {
		update_option( 'justice_enc_per_day', max( 1, min( 48, (int) $body['per_day'] ) ), false );
	}

	$counters = array( 'created' => 0, 'scheduled' => 0, 'drafted' => 0, 'filled' => 0, 'skipped' => 0, 'site_collision' => 0, 'first_slot' => '', 'last_slot' => '' );

	foreach ( $entries as $entry ) {
		$title = sanitize_text_field( (string) ( $entry['name_he'] ?? '' ) );

		if ( '' === $title ) {
			$counters['skipped']++;
			continue;
		}

		if ( justice_enc_site_collision( $title ) ) {
			$counters['site_collision']++;
			continue;
		}

		$content  = isset( $entry['content_html'] ) ? wp_kses_post( (string) $entry['content_html'] ) : '';
		$words    = justice_enc_word_count( $content );
		$existing = justice_enc_find_by_title( $title );

		if ( $existing ) {
			$existing_words = justice_enc_word_count( $existing->post_content );

			if ( 'draft' === $existing->post_status && $existing_words < 250 && $words >= 250 ) {
				$slot = justice_enc_next_drip_slot();
				wp_update_post( array(
					'ID'            => $existing->ID,
					'post_content'  => $content,
					'post_status'   => 'future',
					'post_date'     => wp_date( 'Y-m-d H:i:s', $slot ),
					'post_date_gmt' => gmdate( 'Y-m-d H:i:s', $slot ),
					'edit_date'     => true,
				) );
				$counters['filled']++;
				$counters['last_slot'] = wp_date( 'Y-m-d H:i', $slot );
			} else {
				$counters['skipped']++;
			}

			continue;
		}

		$entity = sanitize_text_field( (string) ( $entry['entity_type'] ?? 'term' ) );
		if ( ! in_array( $entity, justice_enc_entity_types(), true ) ) {
			$entity = 'term';
		}

		$latin_slug = sanitize_title( (string) ( $entry['name_en'] ?? '' ) );

		$postarr = array(
			'post_type'    => 'justice_term',
			'post_name'    => $latin_slug ? $latin_slug : '',
			'post_title'   => $title,
			'post_excerpt' => sanitize_text_field( (string) ( $entry['def'] ?? '' ) ),
			'post_content' => $content,
			'post_status'  => 'draft',
		);

		if ( $words >= 250 ) {
			$slot                     = justice_enc_next_drip_slot();
			$postarr['post_status']   = 'future';
			$postarr['post_date']     = wp_date( 'Y-m-d H:i:s', $slot );
			$postarr['post_date_gmt'] = gmdate( 'Y-m-d H:i:s', $slot );
		}

		$pid = wp_insert_post( $postarr );

		if ( ! $pid || is_wp_error( $pid ) ) {
			$counters['skipped']++;
			continue;
		}

		update_post_meta( $pid, 'name_en', sanitize_text_field( (string) ( $entry['name_en'] ?? '' ) ) );
		update_post_meta( $pid, 'entity_type', $entity );
		update_post_meta( $pid, 'enc_domain', sanitize_text_field( (string) ( $entry['domain'] ?? '' ) ) );
		update_post_meta( $pid, 'enc_priority', (string) max( 1, min( 3, (int) ( $entry['priority'] ?? 2 ) ) ) );
		update_post_meta( $pid, 'enc_related', sanitize_text_field( (string) ( $entry['related'] ?? '' ) ) );
		update_post_meta( $pid, 'enc_sources', sanitize_text_field( (string) ( $entry['sources'] ?? '' ) ) );

		if ( ! empty( $entry['domain'] ) ) {
			wp_set_object_terms( $pid, sanitize_text_field( (string) $entry['domain'] ), 'justice_term_cat' );
		}

		$counters['created']++;

		if ( $words >= 250 ) {
			$counters['scheduled']++;
			if ( '' === $counters['first_slot'] ) {
				$counters['first_slot'] = $postarr['post_date'];
			}
			$counters['last_slot'] = $postarr['post_date'];
		} else {
			$counters['drafted']++;
		}
	}

	return rest_ensure_response( $counters );
}

// ---------------------------------------------------------------------------
// The writer
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	if ( ! wp_next_scheduled( 'justice_enc_writer_tick' ) ) {
		wp_schedule_event( time() + 600, 'hourly', 'justice_enc_writer_tick' );
	}
} );

add_action( 'justice_enc_writer_tick', function () {
	justice_enc_writer_tick( 3 );
} );

function justice_enc_writer_stat(): array {
	$stat  = get_option( 'justice_enc_writer_stat', array() );
	$today = wp_date( 'Y-m-d' );

	if ( ! is_array( $stat ) || ( $stat['date'] ?? '' ) !== $today ) {
		$stat = array( 'date' => $today, 'generated' => 0, 'failed' => 0 );
	}

	return $stat;
}

function justice_enc_writer_tick( int $batch = 3 ): array {
	$summary = array( 'written' => array(), 'failed' => array(), 'room' => 0 );

	if ( ! (int) get_option( 'justice_enc_writer_enabled', 1 ) || '' === justice_enc_openai_key() ) {
		$summary['note'] = 'disabled or no key';

		return $summary;
	}

	$stat            = justice_enc_writer_stat();
	$daily           = max( 1, (int) get_option( 'justice_enc_writer_daily', 15 ) );
	$room            = max( 0, $daily - (int) $stat['generated'] );
	$summary['room'] = $room;

	if ( 0 === $room ) {
		return $summary;
	}

	$candidates = get_posts( array(
		'post_type'      => 'justice_term',
		'post_status'    => 'draft',
		'posts_per_page' => $batch * 2,
		'orderby'        => 'meta_value_num',
		'meta_key'       => 'enc_priority',
		'order'          => 'ASC',
		'meta_query'     => array( array( 'key' => 'entity_type', 'compare' => 'EXISTS' ) ),
		'fields'         => 'ids',
	) );

	$done = 0;

	foreach ( $candidates as $pid ) {
		if ( $done >= min( $batch, $room ) ) {
			break;
		}

		if ( (int) get_post_meta( $pid, 'enc_fail_count', true ) >= 5 ) {
			continue;
		}

		if ( justice_enc_word_count( get_post( $pid )->post_content ) >= 250 ) {
			continue;
		}

		$ok   = justice_enc_write_one( $pid );
		$stat = justice_enc_writer_stat();

		if ( $ok ) {
			$stat['generated']++;
			$summary['written'][] = $pid;
			$done++;
		} else {
			$stat['failed']++;
			$summary['failed'][] = $pid;
		}

		update_option( 'justice_enc_writer_stat', $stat, false );
	}

	return $summary;
}

function justice_enc_system_prompt( int $lo, int $hi ): string {
	return 'אתה העורך הראשי של אנציקלופדיה משפטית מקצועית בעברית באתר jus-tice.co.il, ברמה של ויקיפדיה ומעלה. הקורא הוא איש מקצוע. חוקים קשיחים: אפס עובדות מומצאות, נתון לא ודאי מושמט לחלוטין; ציטוט חוקים בשמם הרשמי ובשנתם בלבד; אזכורי פסיקה ומספרי תיקים אך ורק אם הופיעו בנתוני הקלט, לעולם אין להמציא אזכור; אם הדין השתנה לאורך השנים, ציין את המצב הנוכחי ותארך אותו; אין להשתמש בקו מפריד ארוך מכל סוג, רק מקף רגיל; אין להשתמש בביטויים: חשוב לציין, בעידן, מעבר לכך, לסיכום, ראוי לציין, יש לזכור; אין סופרלטיבים ואין הבטחות תוצאה; המונח האנגלי משולב בגוף הטקסט; HTML נקי בלבד: h2, h3, p, ul, li, table, tr, th, td; בלי h1, בלי חזרה על כותרת הערך בפתיחה, בלי פנייה לקורא, בלי סיכום שיווקי ובלי פסקת הסתייגות משפטית, האתר מוסיף אותה בעצמו. פתח ישירות בפסקת הגדרה. מבנה: הגדרה; הבסיס החוקי או הרקע; פירוט טכני עם סעיפים ומספרים היכן שהם קיימים בקלט; ההקשר הישראלי ופסיקה מרכזית אם סופקה בקלט; כיצד איש מקצוע פוגש את זה בהליך אמיתי; דוגמה מספרית או תרחיש היכן שמתאים; טעויות נפוצות; משפט סיום ענייני. נסח כותרות ביניים באופן טבעי לכל ערך, אל תעתיק את רשימת המבנה. לערכים על אנשים או ארגונים: עובדות ביוגרפיות ניטרליות עם תאריכים בלבד. אורך יעד: ' . $lo . ' עד ' . $hi . ' מילים. החזר אך ורק את גוף ה-HTML, ללא גדרות קוד.';
}

function justice_enc_user_prompt( int $pid, int $lo ): string {
	$post = get_post( $pid );

	return 'כתוב את הערך האנציקלופדי המלא עבור: "' . $post->post_title . '"'
		. ' (EN: ' . get_post_meta( $pid, 'name_en', true ) . ')'
		. ' | סוג ערך: ' . get_post_meta( $pid, 'entity_type', true )
		. ' | תחום: ' . get_post_meta( $pid, 'enc_domain', true )
		. ' | הגדרה בסיסית: ' . $post->post_excerpt
		. ' | ערכים קשורים לשילוב בטקסט: ' . get_post_meta( $pid, 'enc_related', true )
		. ' | כיווני מקורות: ' . get_post_meta( $pid, 'enc_sources', true )
		. ' | אורך חובה: לפחות ' . $lo . ' מילים.';
}

function justice_enc_call_openai( array $messages ): string {
	return justice_ai_chat( $messages, array(
		'model'       => (string) get_option( 'justice_enc_writer_model', 'gpt-4o-mini' ),
		'temperature' => 0.4,
		'max_tokens'  => 6000,
		'timeout'     => 120,
		'source'      => 'encyclopedia',
	) );
}

function justice_enc_clean( string $html, string $title ): string {
	$html = preg_replace( '/^```(html)?\s*/i', '', trim( $html ) );
	$html = preg_replace( '/\s*```$/', '', $html );

	// Markdown that models leak despite instructions, converted deterministically.
	$html = preg_replace( '/\*\*([^*]+)\*\*/u', '<strong>$1</strong>', $html );
	$html = str_replace( array( '**', '__' ), '', $html );
	$html = preg_replace( '/^####\s*(.+)$/mu', '<h3>$1</h3>', $html );
	$html = preg_replace( '/^###\s*(.+)$/mu', '<h3>$1</h3>', $html );
	$html = preg_replace( '/^##\s*(.+)$/mu', '<h2>$1</h2>', $html );

	// Markdown bullet lines (hyphen, en dash or bullet) become real lists.
	$html = preg_replace_callback( '/(?:^[ \t]*[-\x{2013}\x{2022}][ \t]+.+(?:\R|$))+/mu', function ( $m ) {
		$items = preg_split( '/\R/u', trim( $m[0] ) );
		$out   = '<ul>';
		foreach ( $items as $line ) {
			$line = preg_replace( '/^[ \t]*[-\x{2013}\x{2022}][ \t]+/u', '', $line );
			if ( '' !== trim( $line ) ) {
				$out .= '<li>' . trim( $line ) . '</li>';
			}
		}
		return $out . '</ul>';
	}, $html );

	// Connector-type AI tellers scrub cleanly at sentence start; validation
	// still backstops anything left.
	$html = preg_replace( '/(חשוב לציין|ראוי לציין|יש לזכור|חשוב להבין|חשוב לדעת|אין ספק)\s*(כי|ש)?\s*[,:]?\s*/u', '', $html );
	$html = preg_replace( '/(מעבר לכך|יתרה מכך|יתרה מזאת|זאת ועוד|בשורה התחתונה|לסיכום)\s*[,:]?\s*/u', '', $html );

	$html = str_replace( array( "\xE2\x80\x93", "\xE2\x80\x94" ), '-', $html );
	// A spaced hyphen mid-sentence gets re-texturized into an en dash on render.
	$html = str_replace( ' - ', ', ', $html );
	$html = preg_replace( '/^\s*<h[23][^>]*>\s*' . preg_quote( $title, '/' ) . '\s*<\/h[23]>/u', '', $html );
	// FAQ questions that arrive as bold paragraphs become h3.
	$html = preg_replace( '/<p>\s*<strong>([^<]*\?)\s*<\/strong>\s*<\/p>/u', '<h3>$1</h3>', $html );

	return wp_kses_post( $html );
}

function justice_enc_fail( int $pid, string $reason, int $words, int $floor ): bool {
	update_option( 'justice_enc_writer_last_fail', array(
		'pid'    => $pid,
		'title'  => get_the_title( $pid ),
		'reason' => $reason,
		'words'  => $words,
		'floor'  => $floor,
		'at'     => wp_date( 'Y-m-d H:i:s' ),
	), false );

	update_post_meta( $pid, 'enc_fail_count', (string) ( (int) get_post_meta( $pid, 'enc_fail_count', true ) + 1 ) );

	return false;
}

function justice_enc_write_one( int $pid ): bool {
	$priority = max( 1, min( 3, (int) get_post_meta( $pid, 'enc_priority', true ) ?: 2 ) );
	$tier     = justice_enc_tiers()[ $priority ];
	$title    = get_the_title( $pid );

	$system = array( 'role' => 'system', 'content' => justice_enc_system_prompt( $tier['lo'], $tier['hi'] ) );
	$user   = array( 'role' => 'user', 'content' => justice_enc_user_prompt( $pid, $tier['lo'] ) );

	$draft = justice_enc_clean( justice_enc_call_openai( array( $system, $user ) ), $title );
	$words = justice_enc_word_count( $draft );

	if ( 0 === $words ) {
		return justice_enc_fail( $pid, 'empty', 0, $tier['floor'] );
	}

	if ( $words < $tier['floor'] ) {
		$expanded = justice_enc_clean( justice_enc_call_openai( array(
			$system,
			$user,
			array( 'role' => 'assistant', 'content' => $draft ),
			array( 'role' => 'user', 'content' => 'הערך מכיל כרגע רק ' . $words . ' מילים והיעד הוא ' . $tier['lo'] . ' עד ' . $tier['hi'] . ' מילים. הרחב והעמק אותו: פרט את המנגנון המשפטי, הבסיס החוקי, ההקשר הישראלי, דוגמה מספרית וטעויות נפוצות ככל שחסרים, ללא מילוי סרק וללא עובדות מומצאות. החזר אך ורק את הערך המורחב המלא, אותם כללי HTML.' ),
		) ), $title );

		if ( justice_enc_word_count( $expanded ) > $words ) {
			$draft = $expanded;
			$words = justice_enc_word_count( $expanded );
		}
	}

	if ( $words < (int) floor( $tier['floor'] * 0.9 ) ) {
		return justice_enc_fail( $pid, 'floor', $words, $tier['floor'] );
	}

	$tellers = justice_enc_teller_hits( $draft );

	if ( $tellers ) {
		return justice_enc_fail( $pid, 'style:' . implode( ',', $tellers ), $words, $tier['floor'] );
	}

	$slot = justice_enc_next_drip_slot();

	$updated = wp_update_post( array(
		'ID'            => $pid,
		'post_content'  => $draft,
		'post_status'   => 'future',
		'post_date'     => wp_date( 'Y-m-d H:i:s', $slot ),
		'post_date_gmt' => gmdate( 'Y-m-d H:i:s', $slot ),
		'edit_date'     => true,
	), true );

	if ( is_wp_error( $updated ) ) {
		return justice_enc_fail( $pid, 'wp:' . $updated->get_error_code(), $words, $tier['floor'] );
	}

	update_post_meta( $pid, 'enc_written_by', 'site-writer:' . get_option( 'justice_enc_writer_model', 'gpt-4o-mini' ) );
	update_post_meta( $pid, 'enc_written_words', (string) $words );

	return true;
}

// ---------------------------------------------------------------------------
// Status endpoint
// ---------------------------------------------------------------------------

function justice_enc_status() {
	$stat = justice_enc_writer_stat();

	$count_meta = function ( array $args ): int {
		$q = new WP_Query( array_merge( array(
			'post_type'      => 'justice_term',
			'posts_per_page' => 1,
			'fields'         => 'ids',
		), $args ) );

		return (int) $q->found_posts;
	};

	return rest_ensure_response( array(
		'enabled'              => (int) get_option( 'justice_enc_writer_enabled', 1 ),
		'model'                => (string) get_option( 'justice_enc_writer_model', 'gpt-4o-mini' ),
		'daily_cap'            => (int) get_option( 'justice_enc_writer_daily', 15 ),
		'per_day_drip'         => (int) get_option( 'justice_enc_per_day', 12 ),
		'key_present'           => '' !== justice_enc_openai_key(),
		'today'                => $stat,
		'last_fail'            => get_option( 'justice_enc_writer_last_fail', null ),
		'stuck'                => $count_meta( array( 'post_status' => 'draft', 'meta_query' => array( array( 'key' => 'enc_fail_count', 'value' => 5, 'compare' => '>=', 'type' => 'NUMERIC' ) ) ) ),
		'skeletons_waiting'    => $count_meta( array( 'post_status' => 'draft', 'meta_query' => array( array( 'key' => 'entity_type', 'compare' => 'EXISTS' ) ) ) ),
		'scheduled_to_publish' => $count_meta( array( 'post_status' => 'future' ) ),
		'published'            => $count_meta( array( 'post_status' => 'publish' ) ),
	) );
}

// ---------------------------------------------------------------------------
// Page decorations: EN chip, disclaimer, DefinedTerm JSON-LD
// ---------------------------------------------------------------------------

add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular( 'justice_term' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$pid    = get_the_ID();
	$en     = (string) get_post_meta( $pid, 'name_en', true );
	$entity = (string) get_post_meta( $pid, 'entity_type', true );
	$chip   = '';

	if ( '' !== $en ) {
		$chip = '<p style="font-size:0.85em;opacity:0.75;margin-bottom:18px">EN: ' . esc_html( $en ) . ( $entity ? ' · ' . esc_html( $entity ) : '' ) . '</p>';
	}

	$disclaimer = '<p style="font-size:0.85em;opacity:0.75;margin-top:28px">הערך נועד למידע משפטי כללי בלבד ואינו ייעוץ משפטי. לקבלת ייעוץ בעניין קונקרטי יש לפנות לעורך דין.</p>';

	return $chip . $content . $disclaimer;
}, 8 );

add_action( 'wp_head', function () {
	if ( ! is_singular( 'justice_term' ) ) {
		return;
	}

	$pid    = get_the_ID();
	$entity = (string) get_post_meta( $pid, 'entity_type', true );
	$schema = array(
		'@context'    => 'https://schema.org',
		'@type'       => in_array( $entity, array( 'law', 'regulation' ), true ) ? 'Legislation' : 'DefinedTerm',
		'name'        => get_the_title( $pid ),
		'description' => wp_strip_all_tags( get_the_excerpt( $pid ) ),
		'url'         => get_permalink( $pid ),
		'inLanguage'  => 'he',
	);

	$en = (string) get_post_meta( $pid, 'name_en', true );

	if ( '' !== $en ) {
		$schema['alternateName'] = $en;
	}

	echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE ) . '</script>' . "\n";
} );

// ---------------------------------------------------------------------------
// Autolinker: first plain-text occurrence of published encyclopedia terms in
// site content links into the encyclopedia. Capped, boundary-safe, never
// inside anchors, headings or tags. Terms cache invalidates on publish.
// ---------------------------------------------------------------------------

function justice_enc_link_map(): array {
	$map = get_transient( 'justice_enc_link_map_v1' );

	if ( is_array( $map ) ) {
		return $map;
	}

	$map   = array();
	$terms = get_posts( array(
		'post_type'      => 'justice_term',
		'post_status'    => 'publish',
		'posts_per_page' => 500,
		'fields'         => 'ids',
	) );

	foreach ( $terms as $tid ) {
		$title = get_the_title( $tid );

		if ( mb_strlen( $title ) >= 4 ) {
			$map[ $title ] = get_permalink( $tid );
		}
	}

	uksort( $map, function ( $a, $b ) {
		return mb_strlen( $b ) <=> mb_strlen( $a );
	} );

	set_transient( 'justice_enc_link_map_v1', $map, 6 * HOUR_IN_SECONDS );

	return $map;
}

add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
	if ( 'justice_term' === $post->post_type && ( 'publish' === $new_status || 'publish' === $old_status ) ) {
		delete_transient( 'justice_enc_link_map_v1' );
	}
}, 10, 3 );

add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular( array( 'articles', 'post', 'page', 'justice_term' ) ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$map = justice_enc_link_map();

	if ( ! $map ) {
		return $content;
	}

	$current_title = get_the_title();
	$parts         = preg_split( '/(<a\b[^>]*>.*?<\/a>|<h[1-6][^>]*>.*?<\/h[1-6]>|<[^>]+>)/isu', $content, -1, PREG_SPLIT_DELIM_CAPTURE );

	if ( ! is_array( $parts ) ) {
		return $content;
	}

	$links = 0;

	foreach ( $map as $term => $url ) {
		if ( $links >= 4 ) {
			break;
		}

		if ( $term === $current_title || false !== strpos( $content, esc_url( $url ) ) ) {
			continue;
		}

		$pattern = '/(?<![\p{L}\p{N}"\x{05F3}\x{05F4}])' . preg_quote( $term, '/' ) . '(?![\p{L}\p{N}"\x{05F3}\x{05F4}])/u';

		foreach ( $parts as $i => $part ) {
			if ( $i % 2 === 1 || '' === trim( $part ) ) {
				continue;
			}

			$replaced = preg_replace( $pattern, '<a class="justice-enc-link" href="' . esc_url( $url ) . '">' . $term . '</a>', $part, 1, $hits );

			if ( $hits ) {
				$parts[ $i ] = $replaced;
				$links++;
				break;
			}
		}
	}

	return $links ? implode( '', $parts ) : $content;
}, 14 );

// ---------------------------------------------------------------------------
// Routing bridge: the theme's justice_theme_modify_request_for_articles
// (inc/routing-guards.php, priority 10) force-retypes any named request to
// page/post/articles, which 404s encyclopedia singles. Until the theme fix
// is pulled, restore the post type for justice_term requests right after it.
// ---------------------------------------------------------------------------

add_filter( 'request', function ( $query_vars ) {
	if ( isset( $query_vars['justice_term'] ) ) {
		$query_vars['post_type'] = 'justice_term';
	}

	return $query_vars;
}, 11 );

// ---------------------------------------------------------------------------
// SPOKE ARTICLES LANE: long-form money articles (1,500-2,200 words, floor
// 1,300 in code) written into the existing articles CPT from pre-approved
// briefs, one per day, meshed to their pillar with in-body links. English
// slugs only; collision-checked at intake.
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/article-intake', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			global $wpdb;
			$body    = $request->get_json_params();
			$entries = isset( $body['entries'] ) && is_array( $body['entries'] ) ? $body['entries'] : array();
			$out     = array( 'created' => 0, 'skipped' => 0, 'collision' => 0 );

			foreach ( $entries as $entry ) {
				$title = sanitize_text_field( (string) ( $entry['title'] ?? '' ) );
				$slug  = sanitize_title( (string) ( $entry['slug'] ?? '' ) );

				if ( '' === $title || '' === $slug || preg_match( '/[^a-z0-9\-]/', $slug ) ) {
					$out['skipped']++;
					continue;
				}

				$exists = $wpdb->get_var( $wpdb->prepare(
					"SELECT ID FROM {$wpdb->posts} WHERE ( post_name = %s OR post_title = %s ) AND post_type IN ('post','page','articles') AND post_status NOT IN ('trash','auto-draft') LIMIT 1",
					$slug,
					$title
				) );

				if ( $exists ) {
					$existing_post = get_post( (int) $exists );

					if ( $existing_post && 'articles' === $existing_post->post_type && 'draft' === $existing_post->post_status
						&& justice_enc_word_count( $existing_post->post_content ) < 300 ) {
						update_post_meta( $existing_post->ID, 'spoke_brief', wp_slash( wp_json_encode( $entry, JSON_UNESCAPED_UNICODE ) ) );
						update_post_meta( $existing_post->ID, 'enc_fail_count', '0' );
						$out['repaired'] = ( $out['repaired'] ?? 0 ) + 1;
						continue;
					}

					$out['collision']++;
					continue;
				}

				$pid = wp_insert_post( array(
					'post_type'    => 'articles',
					'post_title'   => $title,
					'post_name'    => $slug,
					'post_status'  => 'draft',
					'post_excerpt' => sanitize_text_field( (string) ( $entry['description'] ?? '' ) ),
				) );

				if ( ! $pid || is_wp_error( $pid ) ) {
					$out['skipped']++;
					continue;
				}

				update_post_meta( $pid, 'spoke_brief', wp_slash( wp_json_encode( $entry, JSON_UNESCAPED_UNICODE ) ) );
				update_post_meta( $pid, 'enc_fail_count', '0' );
				$out['created']++;
			}

			return rest_ensure_response( $out );
		},
	) );

	register_rest_route( 'justice-ops/v1', '/article-writer-run', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			$pid = (int) $request->get_param( 'pid' );

			if ( $pid ) {
				return rest_ensure_response( array( 'pid' => $pid, 'ok' => justice_art_write_one( $pid, true ) ) );
			}

			return rest_ensure_response( justice_art_writer_tick( true ) );
		},
	) );
} );

function justice_art_stat(): array {
	$stat  = get_option( 'justice_art_writer_stat', array() );
	$today = wp_date( 'Y-m-d' );

	if ( ! is_array( $stat ) || ( $stat['date'] ?? '' ) !== $today ) {
		$stat = array( 'date' => $today, 'generated' => 0, 'failed' => 0 );
	}

	return $stat;
}

function justice_art_next_slot(): int {
	$tz     = wp_timezone();
	$latest = get_posts( array(
		'post_type'      => 'articles',
		'post_status'    => 'future',
		'posts_per_page' => 1,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'fields'         => 'ids',
		'meta_query'     => array( array( 'key' => 'spoke_brief', 'compare' => 'EXISTS' ) ),
	) );

	if ( $latest ) {
		$last = new DateTimeImmutable( get_post( $latest[0] )->post_date, $tz );
		$next = $last->modify( '+1 day' )->setTime( 10, 7 )->getTimestamp();
	} else {
		$next = ( new DateTimeImmutable( 'now', $tz ) )->modify( '+1 day' )->setTime( 10, 7 )->getTimestamp();
	}

	if ( $next <= time() ) {
		$next = time() + 10 * MINUTE_IN_SECONDS;
	}

	return $next;
}

add_action( 'justice_enc_writer_tick', function () {
	justice_art_writer_tick( false );
}, 20 );

function justice_art_writer_tick( bool $forced ): array {
	$summary = array( 'written' => array(), 'failed' => array() );

	if ( '' === justice_enc_openai_key() ) {
		return $summary;
	}

	$stat  = justice_art_stat();
	$daily = max( 1, (int) get_option( 'justice_art_daily', 1 ) );

	if ( ! $forced && $stat['generated'] >= $daily ) {
		return $summary;
	}

	$candidates = get_posts( array(
		'post_type'      => 'articles',
		'post_status'    => 'draft',
		'posts_per_page' => 3,
		'orderby'        => 'date',
		'order'          => 'ASC',
		'meta_query'     => array( array( 'key' => 'spoke_brief', 'compare' => 'EXISTS' ) ),
		'fields'         => 'ids',
	) );

	foreach ( $candidates as $pid ) {
		if ( (int) get_post_meta( $pid, 'enc_fail_count', true ) >= 5 ) {
			continue;
		}

		if ( justice_enc_word_count( get_post( $pid )->post_content ) >= 300 ) {
			continue;
		}

		$ok   = justice_art_write_one( $pid );
		$stat = justice_art_stat();

		if ( $ok ) {
			$stat['generated']++;
			$summary['written'][] = $pid;
		} else {
			$stat['failed']++;
			$summary['failed'][] = $pid;
		}

		update_option( 'justice_art_writer_stat', $stat, false );
		break;
	}

	return $summary;
}

function justice_art_system_prompt(): string {
	return 'אתה כותב תוכן משפטי בכיר של jus-tice.co.il, כותב מאמר עומק מקצועי בעברית לקהל של לקוחות פוטנציאליים. חוקים קשיחים: אפס עובדות מומצאות, נתון לא ודאי מושמט לחלוטין, לעולם אל תכתוב סימון כמו VERIFY; חוקים מצוטטים בשמם הרשמי ובשנתם בלבד; אין להמציא פסקי דין או מספרי תיקים; אין קו מפריד ארוך מכל סוג, רק מקף רגיל; אין להשתמש בביטויים: חשוב לציין, בעידן, מעבר לכך, לסיכום, ראוי לציין, יש לזכור; אין סופרלטיבים ואין הבטחות תוצאה; אין פנייה בגוף שני רבים מוגזמת ואין שיווק ריק; HTML נקי בלבד: p, h2, h3, ul, li, table, tr, th, td, וקישורי a אך ורק לכתובות שסופקו לך; בלי h1 ובלי חזרה על הכותרת. פתח בפסקה שעונה ישירות לשאלת החיפוש ומכילה את מילת המפתח במשפט הראשון. עקוב אחרי שלד הכותרות שסופק ונסח אותן טבעי. שלב את הקישורים שסופקו בתוך הטקסט במקומות רלוונטיים, עם טקסט העוגן שניתן. כלול טבלה אחת לפחות היכן שמתאים ושאלות נפוצות של 4 עד 6 שאלות אמיתיות עם תשובות קצרות לקראת הסוף בכותרות h3. סיים במשפט ענייני, לא בסיכום שיווקי ולא בפסקת הסתייגות. אורך חובה: 1500 עד 2200 מילים.';
}

function justice_art_write_one( int $pid, bool $preserve_status = false ): bool {
	$brief = json_decode( (string) get_post_meta( $pid, 'spoke_brief', true ), true );

	if ( ! is_array( $brief ) ) {
		return justice_enc_fail( $pid, 'no-brief', 0, 1300 );
	}

	$links = array();
	if ( ! empty( $brief['pillar_url'] ) ) {
		$links[] = $brief['pillar_anchor'] . ' => ' . $brief['pillar_url'];
	}
	foreach ( (array) ( $brief['siblings'] ?? array() ) as $sib ) {
		$links[] = $sib['anchor'] . ' => ' . $sib['url'];
	}

	foreach ( (array) ( $brief['gov_links'] ?? array() ) as $gov ) {
		$links[] = $gov[0] . ' => ' . $gov[1];
	}

	$user = 'כתוב את המאמר המלא: "' . get_the_title( $pid ) . '"'
		. ' | מילת מפתח ראשית: ' . ( $brief['keyword'] ?? '' )
		. ' | ביטויים משניים לשילוב: ' . ( $brief['secondary'] ?? '' )
		. ' | שלד כותרות H2 (עקוב אחריו): ' . implode( ' ; ', (array) ( $brief['outline'] ?? array() ) )
		. ' | קישורים לשילוב בגוף הטקסט (עוגן => כתובת): ' . implode( ' | ', $links )
		. ' | כיווני מקורות: ' . ( $brief['sources'] ?? '' )
		. ' | אורך חובה: לפחות 1500 מילים.';

	$system  = array( 'role' => 'system', 'content' => justice_art_system_prompt() );
	$umsg    = array( 'role' => 'user', 'content' => $user );
	$outline = (array) ( $brief['outline'] ?? array() );
	$parts   = array();

	$opening = justice_enc_clean( justice_art_call_openai( array(
		$system,
		$umsg,
		array( 'role' => 'user', 'content' => 'כתוב אך ורק את פסקת הפתיחה של המאמר: 120 עד 180 מילים שעונות ישירות לשאלת החיפוש, מילת המפתח במשפט הראשון, ושילוב קישור אחד בתוך הטקסט: <a href="' . ( $brief['pillar_url'] ?? '' ) . '">' . ( $brief['pillar_anchor'] ?? '' ) . '</a>. בלי כותרת, בלי h2, רק פסקאות p.' ),
	) ), get_the_title( $pid ) );

	if ( '' === trim( wp_strip_all_tags( $opening ) ) ) {
		return justice_enc_fail( $pid, 'empty-opening', 0, 1300 );
	}

	$parts[] = $opening;

	foreach ( $outline as $section ) {
		if ( false !== mb_stripos( $section, 'שאלות נפוצות' ) ) {
			continue;
		}

		$wants_table = (bool) preg_match( '/עלו|מדרג|טבל|השווא|כמה|שלב/u', $section );
		$ask = 'כתוב אך ורק את גוף הסעיף שכותרתו: "' . $section . '". 160 עד 260 מילים. פורמט מחייב: אך ורק תגיות HTML של p, ul, li, strong. אסור Markdown מכל סוג: בלי כוכביות, בלי מקפים בתחילת שורה, בלי סולמיות. בלי לכתוב את הכותרת עצמה ובלי h2.';
		if ( $wants_table ) {
			$ask .= ' אם מתאים, כלול טבלת HTML קצרה (table, tr, th, td).';
		}

		$body = justice_enc_clean( justice_art_call_openai( array( $system, $umsg, array( 'role' => 'user', 'content' => $ask ) ) ), get_the_title( $pid ) );

		if ( '' !== trim( wp_strip_all_tags( $body ) ) ) {
			$parts[] = '<h2>' . esc_html( $section ) . '</h2>' . $body;
		}
	}

	$faq = justice_enc_clean( justice_art_call_openai( array(
		$system,
		$umsg,
		array( 'role' => 'user', 'content' => 'כתוב אך ורק את בלוק השאלות הנפוצות: 5 שאלות אמיתיות שאנשים שואלים על הנושא. פורמט מחייב לכל שאלה: <h3>השאלה</h3> ואז <p>תשובה של 40 עד 70 מילים</p>. אסור Markdown, אסור כוכביות, אסור מקפים בתחילת שורה. בסוף משפט סיום ענייני אחד בפסקת p.' ),
	) ), get_the_title( $pid ) );

	if ( '' !== trim( wp_strip_all_tags( $faq ) ) ) {
		$parts[] = '<h2>שאלות נפוצות</h2>' . $faq;
	}

	$draft = implode( "\n", $parts );
	$words = justice_enc_word_count( $draft );

	if ( 0 === $words ) {
		return justice_enc_fail( $pid, 'empty', 0, 1300 );
	}

	$expand_pass = 0;
	while ( $words < 1300 && $expand_pass < 2 ) {
		$expand_pass++;
		$expanded = justice_enc_clean( justice_art_call_openai( array(
			$system,
			$umsg,
			array( 'role' => 'assistant', 'content' => $draft ),
			array( 'role' => 'user', 'content' => 'המאמר מכיל כרגע רק ' . $words . ' מילים והיעד הוא 1500 עד 2200. הרחב והעמק: פרט הליכים שלב אחר שלב, הוסף טבלה רלוונטית, הרחב את השאלות הנפוצות והוסף את הסעיפים החסרים מהשלד, ללא מילוי סרק וללא עובדות מומצאות. החזר את המאמר המלא בלבד, אותם כללים.' ),
		) ), get_the_title( $pid ) );

		if ( justice_enc_word_count( $expanded ) > $words ) {
			$draft = $expanded;
			$words = justice_enc_word_count( $expanded );
		}
	}

	if ( $words < 1170 ) {
		return justice_enc_fail( $pid, 'floor', $words, 1300 );
	}

	// Brain judge gate (arXiv 2306.05685): the rubric must pass before an
	// article ships; a failing draft goes back through the retry path.
	if ( function_exists( 'justice_brain_judge' ) ) {
		$verdict = justice_brain_judge( mb_substr( wp_strip_all_tags( $draft ), 0, 2400 ), 'מאמר משפטי ארוך בנושא: ' . get_the_title( $pid ) );

		if ( empty( $verdict['pass'] ) ) {
			return justice_enc_fail( $pid, 'judge', $words, 1300 );
		}
	}

	if ( false !== stripos( $draft, 'VERIFY' ) ) {
		return justice_enc_fail( $pid, 'verify-left', $words, 1300 );
	}

	$tellers = justice_enc_teller_hits( $draft );

	if ( $tellers ) {
		return justice_enc_fail( $pid, 'style:' . implode( ',', $tellers ), $words, 1300 );
	}

	if ( false !== strpos( $draft, '**' ) || preg_match( '/^[ \t]*-[ \t]/mu', $draft ) ) {
		return justice_enc_fail( $pid, 'markdown-residue', $words, 1300 );
	}

	$missing = '';
	if ( ! empty( $brief['pillar_url'] ) && false === strpos( $draft, $brief['pillar_url'] ) ) {
		$missing .= '<li><a href="' . esc_url( $brief['pillar_url'] ) . '">' . esc_html( $brief['pillar_anchor'] ) . '</a></li>';
	}
	foreach ( (array) ( $brief['siblings'] ?? array() ) as $sib ) {
		if ( false === strpos( $draft, $sib['url'] ) ) {
			$missing .= '<li><a href="' . esc_url( $sib['url'] ) . '">' . esc_html( $sib['anchor'] ) . '</a></li>';
		}
	}
	if ( '' !== $missing ) {
		$draft .= '<h2>מדריכים קשורים</h2><ul>' . $missing . '</ul>';
	}

	if ( $preserve_status ) {
		$updated = wp_update_post( array(
			'ID'           => $pid,
			'post_content' => $draft,
		), true );
	} else {
		$slot    = justice_art_next_slot();
		$updated = wp_update_post( array(
			'ID'            => $pid,
			'post_content'  => $draft,
			'post_status'   => 'future',
			'post_date'     => wp_date( 'Y-m-d H:i:s', $slot ),
			'post_date_gmt' => gmdate( 'Y-m-d H:i:s', $slot ),
			'edit_date'     => true,
		), true );
	}

	if ( is_wp_error( $updated ) ) {
		return justice_enc_fail( $pid, 'wp:' . $updated->get_error_code(), $words, 1300 );
	}

	if ( ! empty( $brief['seo_title'] ) ) {
		update_post_meta( $pid, '_yoast_wpseo_title', sanitize_text_field( $brief['seo_title'] ) );
	}
	if ( ! empty( $brief['description'] ) ) {
		update_post_meta( $pid, '_yoast_wpseo_metadesc', sanitize_text_field( $brief['description'] ) );
	}
	if ( ! empty( $brief['keyword'] ) ) {
		update_post_meta( $pid, '_yoast_wpseo_focuskw', sanitize_text_field( $brief['keyword'] ) );
	}
	if ( ! empty( $brief['category'] ) ) {
		$term = get_term_by( 'slug', sanitize_title( $brief['category'] ), 'category' );
		if ( $term ) {
			wp_set_object_terms( $pid, (int) $term->term_id, 'category' );
		}
	}

	update_post_meta( $pid, 'enc_written_by', 'site-writer:' . get_option( 'justice_enc_writer_model', 'gpt-4o-mini' ) );
	update_post_meta( $pid, 'enc_written_words', (string) $words );

	return true;
}

function justice_art_call_openai( array $messages ): string {
	return justice_ai_chat( $messages, array(
		'model'       => (string) get_option( 'justice_art_model', 'gpt-4o' ),
		'temperature' => 0.4,
		'max_tokens'  => 10000,
		'timeout'     => 180,
		'source'      => 'articles',
	) );
}
