<?php
/**
 * Ask-a-lawyer Q&A engine: every real question becomes an indexable page.
 *
 * Visitors ask on /ask-a-lawyer/ (guarded form). The machine drafts a short
 * general answer under the iron rules, but NOTHING publishes without the
 * owner's one-click approval: questions wait as pending with the draft
 * attached, exactly like the reviews queue. Published questions render with
 * QAPage schema, join the practice-areas taxonomy so the sponsored cards
 * and the router mesh pick them up automatically, and English slugs are
 * synthesized from the family plus the question id.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', function () {
	if ( post_type_exists( 'justice_question' ) ) {
		return;
	}

	register_post_type( 'justice_question', array(
		'label'               => 'שאלות משפטיות',
		'public'              => true,
		'show_ui'             => true,
		'show_in_menu'        => 'edit.php?post_type=justice_lawyer',
		'show_in_rest'        => true,
		'supports'            => array( 'title', 'editor' ),
		'taxonomies'          => array( 'practice-areas' ),
		'has_archive'         => false,
		'rewrite'             => array( 'slug' => 'q', 'with_front' => false ),
		'capability_type'     => 'post',
		'map_meta_cap'        => true,
		'exclude_from_search' => false,
	) );
}, 2 );

// Routing bridge: the theme request guard force-retypes named requests and
// 404s question singles, exactly as it did encyclopedia entries.
add_filter( 'request', function ( $query_vars ) {
	if ( isset( $query_vars['justice_question'] ) ) {
		$query_vars['post_type'] = 'justice_question';
	}

	return $query_vars;
}, 11 );

// The cards mesh treats questions like any content in the family.
add_filter( 'justice_cards_singular_types', function ( $types ) {
	$types[] = 'justice_question';
	return $types;
} );

add_action( 'init', function () {
	if ( get_option( 'justice_qa_page_v1' ) || get_page_by_path( 'ask-a-lawyer', OBJECT, 'page' ) ) {
		update_option( 'justice_qa_page_v1', 1 );
		return;
	}

	$pid = wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'שאל עורך דין: שאלה משפטית, תשובה בחינם',
		'post_name'    => 'ask-a-lawyer',
		'post_content' => '[justice_qa]',
	) );

	if ( $pid && ! is_wp_error( $pid ) ) {
		update_post_meta( $pid, 'seo_title', 'שאל עורך דין חינם: שאלות ותשובות משפטיות | Jus-Tice' );
		update_option( 'justice_qa_page_v1', 1 );
	}
} );

// ---------------------------------------------------------------------------
// Ask form + recent answers
// ---------------------------------------------------------------------------

add_shortcode( 'justice_qa', function () {
	$sent = isset( $_GET['q'] ) ? sanitize_key( wp_unslash( $_GET['q'] ) ) : '';

	$areas = '';
	foreach ( justice_brain_tree() as $key => $node ) {
		$areas .= '<option value="' . esc_attr( $key ) . '">' . esc_html( $node['label'] ) . '</option>';
	}

	$recent = get_posts( array( 'post_type' => 'justice_question', 'post_status' => 'publish', 'posts_per_page' => 10 ) );
	$list   = '';

	foreach ( $recent as $question ) {
		$list .= '<li><a href="' . esc_url( get_permalink( $question ) ) . '">' . esc_html( get_the_title( $question ) ) . '</a></li>';
	}

	return ( 'sent' === $sent ? '<div class="jt-adv__ok" style="border:1.5px solid #0a7d2f;background:#f0faf3;color:#0a5c25;border-radius:14px;padding:16px 18px;margin:18px 0;font-weight:600">השאלה התקבלה. תשובה כללית תפורסם אחרי בדיקה, ואם השארתם טלפון נחבר אתכם לעורך דין מתאים.</div>' : '' )
		. '<p>שואלים בקצרה, בלי פרטים מזהים. התשובות כלליות ואינן ייעוץ משפטי, ומתפרסמות אחרי בדיקה כדי לעזור גם לשואלים הבאים.</p>'
		. ( function_exists( 'justice_market_trust_strip' ) ? justice_market_trust_strip() : '' )
		. '<div class="jt-calc"><form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">'
		. '<input type="hidden" name="action" value="justice_qa_ask">'
		. wp_nonce_field( 'justice_qa_ask', 'jt_qa_nonce', true, false )
		. '<div class="justice-lead-guard" aria-hidden="true" style="position:absolute;inset-inline-start:-9999px"><label>Company<input type="text" name="jt_qa_company" tabindex="-1" autocomplete="off" value=""></label></div>'
		. '<input type="hidden" name="jt_qa_started_at" value="' . esc_attr( (string) time() ) . '">'
		. '<p class="jt-calc__field"><label for="qa-area">תחום</label><select id="qa-area" name="qa_area">' . $areas . '</select></p>'
		. '<p class="jt-calc__field"><label for="qa-q">השאלה (עד 300 תווים)</label><textarea id="qa-q" name="qa_question" rows="3" maxlength="300" required minlength="20"></textarea></p>'
		. '<p class="jt-calc__field"><label for="qa-phone">טלפון (לא חובה, לא מתפרסם: רק אם תרצו שעורך דין יחזור אליכם)</label><input id="qa-phone" name="qa_phone" type="tel"></p>'
		. '<button type="submit" class="jt-calc__go">שליחת השאלה</button>'
		. '</form></div>'
		. ( $list ? '<h2>שאלות אחרונות שנענו</h2><ul>' . $list . '</ul>' : '' )
		. '<style>.jt-calc{border:1.5px solid transparent;border-radius:18px;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;padding:22px;margin:20px 0;box-shadow:0 14px 32px -20px rgba(13,23,54,.32)}.jt-calc__field label{display:block;font-weight:700;color:#26324e;margin:0 0 5px}.jt-calc__field input,.jt-calc__field select,.jt-calc__field textarea{width:100%;max-width:520px;border:1px solid #ccd3e2;border-radius:10px;padding:10px;font-size:15px}.jt-calc__go{background:#14213d;color:#fff;border:0;border-radius:11px;padding:12px 28px;font-weight:800;cursor:pointer;margin-top:6px}</style>';
} );

// ---------------------------------------------------------------------------
// Intake
// ---------------------------------------------------------------------------

function justice_qa_handle_ask(): void {
	if ( empty( $_POST['jt_qa_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['jt_qa_nonce'] ) ), 'justice_qa_ask' ) ) {
		wp_die( 'Security check failed.' );
	}

	$back = wp_get_referer() ?: home_url( '/ask-a-lawyer/' );

	$honeypot = isset( $_POST['jt_qa_company'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['jt_qa_company'] ) ) ) : '';
	$started  = isset( $_POST['jt_qa_started_at'] ) ? absint( $_POST['jt_qa_started_at'] ) : 0;

	if ( '' !== $honeypot || ( $started && time() - $started >= 0 && time() - $started < 3 ) ) {
		wp_safe_redirect( add_query_arg( 'q', 'blocked', $back ) );
		exit;
	}

	$area     = sanitize_key( wp_unslash( $_POST['qa_area'] ?? 'general' ) );
	$question = sanitize_textarea_field( wp_unslash( $_POST['qa_question'] ?? '' ) );
	$phone    = sanitize_text_field( wp_unslash( $_POST['qa_phone'] ?? '' ) );

	if ( mb_strlen( $question ) < 20 ) {
		wp_safe_redirect( add_query_arg( 'q', 'short', $back ) );
		exit;
	}

	$family = function_exists( 'justice_router_area_to_family' ) ? justice_router_area_to_family( $area ) : '';

	$qid = wp_insert_post( array(
		'post_type'   => 'justice_question',
		'post_status' => 'pending',
		'post_title'  => mb_substr( $question, 0, 90 ),
		'post_name'   => 'q-' . ( $family ?: 'general' ) . '-' . wp_rand( 1000, 9999 ) . substr( (string) time(), -4 ),
	) );

	if ( ! $qid || is_wp_error( $qid ) ) {
		wp_safe_redirect( add_query_arg( 'q', 'error', $back ) );
		exit;
	}

	// A companion insert filter strips post_name on pending inserts; force it.
	if ( '' === get_post_field( 'post_name', $qid ) ) {
		wp_update_post( array( 'ID' => $qid, 'post_name' => 'q-' . ( $family ?: 'general' ) . '-' . $qid ) );
	}

	update_post_meta( $qid, 'qa_question', $question );
	update_post_meta( $qid, 'qa_area', $area );

	if ( $phone ) {
		update_post_meta( $qid, 'qa_phone', $phone );
	}

	$map = function_exists( 'justice_cards_family_map' ) ? justice_cards_family_map() : array();

	if ( $family && ! empty( $map[ $family ] ) && term_exists( $map[ $family ][0], 'practice-areas' ) ) {
		wp_set_object_terms( $qid, $map[ $family ][0], 'practice-areas' );
	}

	// Machine draft, saved as the post body but kept pending for approval.
	// The brain pipeline (grounding, verification, judge) when available.
	if ( function_exists( 'justice_brain_answer' ) ) {
		$brain = justice_brain_answer( $question, $area );
		$draft = $brain['text'];
		update_post_meta( $qid, 'qa_brain_trace', wp_slash( wp_json_encode( $brain['trace'], JSON_UNESCAPED_UNICODE ) ) );
	} else {
		$draft = justice_qa_draft_answer( $question, $area );
	}

	if ( $draft ) {
		wp_update_post( array( 'ID' => $qid, 'post_content' => $draft ) );
	}

	wp_mail(
		get_option( 'admin_email' ),
		'[Jus-Tice] שאלה חדשה ממתינה לאישור' . ( $phone ? ' (השאיר טלפון: ליד)' : '' ),
		"שאלה: " . $question . "\n\n"
		. ( $draft ? "טיוטת תשובה של המכונה מצורפת לפוסט, לעריכה ואישור.\n" : "המכונה לא הפיקה טיוטה, נדרשת תשובה ידנית.\n" )
		. ( $phone ? "טלפון השואל (לא מתפרסם): " . $phone . "\n" : '' )
		. "\nאישור ופרסום: " . admin_url( 'edit.php?post_type=justice_question&post_status=pending' )
	);

	wp_safe_redirect( add_query_arg( 'q', 'sent', $back ) );
	exit;
}
add_action( 'admin_post_justice_qa_ask', 'justice_qa_handle_ask' );
add_action( 'admin_post_nopriv_justice_qa_ask', 'justice_qa_handle_ask' );

/**
 * General-information draft under the iron rules; empty on any doubt.
 */
function justice_qa_draft_answer( string $question, string $area ): string {
	$text = justice_ai_chat( array(
		array( 'role' => 'system', 'content' => 'אתה עונה תשובות מידע כללי לשאלות משפטיות בעברית, לפרסום באתר. חובה: מסגור כללי בלבד, בלי ייעוץ קונקרטי, בלי אחוזים וסכומים מדויקים אלא אם קבועים בחוק ומוכרים היטב, בלי שמות פסקי דין אלא אם מפורסמים מאוד, בלי הבטחות. אסור: קו מפריד ארוך, סופרלטיבים, חשוב לציין, בעידן, מעבר לכך, לסיכום, ראוי לציין, יש לזכור, חשוב להבין, חשוב לדעת, בשורה התחתונה, אין ספק, יתרה מכך, זאת ועוד. מבנה: 2 עד 3 פסקאות p של 60 עד 90 מילים, ואז פסקה אחרונה שממליצה בעדינות על בדיקה עם עורך דין בתחום. אם השאלה לא משפטית או לא ניתנת למענה אחראי, החזר בדיוק: SKIP' ),
		array( 'role' => 'user', 'content' => 'תחום: ' . $area . "\nהשאלה: " . $question ),
	), array(
		'model'       => get_option( 'justice_art_model', 'gpt-4.1' ),
		'temperature' => 0.4,
		'max_tokens'  => 700,
		'timeout'     => 45,
		'source'      => 'qa',
	) );

	if ( '' === $text ) {
		update_option( 'jt_qa_last_err', 'engine empty (ai-health has the state)', false );
		return '';
	}

	if ( false !== strpos( $text, 'SKIP' ) ) {
		update_option( 'jt_qa_last_err', 'model skipped', false );
		return '';
	}

	$text = str_replace( array( '—', '–' ), ',', $text );

	if ( function_exists( 'justice_enc_teller_hits' ) && justice_enc_teller_hits( $text ) ) {
		return '';
	}

	if ( false === strpos( $text, '<p' ) ) {
		$text = '<p>' . implode( '</p><p>', array_filter( array_map( 'trim', preg_split( '/\n+/', $text ) ) ) ) . '</p>';
	}

	return $text;
}

// ---------------------------------------------------------------------------
// Published question rendering: disclaimer + QAPage schema + lead routing
// ---------------------------------------------------------------------------

add_filter( 'the_content', function ( $content ) {
	if ( ! is_singular( 'justice_question' ) || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$question = (string) get_post_meta( get_the_ID(), 'qa_question', true );

	$prefix = '<div style="background:#f1f4fb;border-radius:14px;padding:16px 18px;margin-bottom:18px"><strong>השאלה:</strong> ' . esc_html( $question ?: get_the_title() ) . '</div>';
	$suffix = '<p style="color:#6a7285;font-size:13px;margin-top:18px">התשובה היא מידע כללי בלבד ואינה ייעוץ משפטי. לשאלה דומה אפשר <a href="' . esc_url( home_url( '/ask-a-lawyer/' ) ) . '">לשאול כאן</a> או לפנות בוואטסאפ מהכפתור הצף.</p>';

	return $prefix . $content . $suffix;
}, 12 );

add_action( 'wp_head', function () {
	$qo = get_queried_object();

	if ( ! $qo instanceof WP_Post || 'justice_question' !== $qo->post_type ) {
		return;
	}

	$question = (string) get_post_meta( $qo->ID, 'qa_question', true );

	echo '<script type="application/ld+json">' . wp_json_encode( array(
		'@context'   => 'https://schema.org',
		'@type'      => 'QAPage',
		'mainEntity' => array(
			'@type'          => 'Question',
			'name'           => $question ?: $qo->post_title,
			'answerCount'    => 1,
			'acceptedAnswer' => array(
				'@type' => 'Answer',
				'text'  => wp_strip_all_tags( $qo->post_content ),
			),
		),
	), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>';
}, 42 );

/**
 * Approval side effects: a published question whose asker left a phone
 * becomes a routable lead through the standard pipeline.
 */
add_action( 'transition_post_status', function ( $new, $old, $post ) {
	if ( 'publish' !== $new || 'publish' === $old || ! $post instanceof WP_Post || 'justice_question' !== $post->post_type ) {
		return;
	}

	$phone = (string) get_post_meta( $post->ID, 'qa_phone', true );

	if ( '' === $phone || get_post_meta( $post->ID, 'qa_lead_created', true ) ) {
		return;
	}

	$lead = wp_insert_post( array(
		'post_type'   => 'justice_lead',
		'post_status' => 'publish',
		'post_title'  => 'שאלה באתר: ' . mb_substr( $post->post_title, 0, 60 ),
	) );

	if ( $lead && ! is_wp_error( $lead ) ) {
		update_post_meta( $lead, 'visitor_name', 'שואל מעמוד שאלות' );
		update_post_meta( $lead, 'visitor_phone', $phone );
		update_post_meta( $lead, 'legal_area', (string) get_post_meta( $post->ID, 'qa_area', true ) );
		update_post_meta( $lead, 'message', (string) get_post_meta( $post->ID, 'qa_question', true ) );
		update_post_meta( $lead, 'urgency', 'normal' );
		update_post_meta( $lead, 'source_url', get_permalink( $post ) );
		update_post_meta( $lead, 'lead_source_surface', 'qa_engine' );
		update_post_meta( $lead, 'lead_status', 'new' );
		update_post_meta( $post->ID, 'qa_lead_created', (string) $lead );

		// The meta-hook side effect does not fire reliably inside a
		// transition context; route explicitly.
		if ( function_exists( 'justice_router_route_lead' ) ) {
			justice_router_route_lead( $lead );
		}
	}
}, 10, 3 );
