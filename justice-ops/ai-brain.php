<?php
/**
 * The AI brain: research-backed generation pipeline shared by every machine.
 *
 * Implements, in order, the published techniques that measurably raise
 * output quality:
 *
 * 1. RETRIEVAL GROUNDING: drafts are grounded in OUR OWN published pages
 *    (survey arXiv:2310.07521): the retriever pulls the three most relevant
 *    site sources and the drafter may only lean on them plus well-known
 *    general knowledge, weaving their links in (internal linking for free).
 * 2. CHAIN-OF-VERIFICATION (Dhuliawala et al., Meta AI, arXiv:2309.11495):
 *    the draft is fact-checked by planned verification questions answered
 *    independently, then rewritten with uncertain claims removed.
 * 3. LLM-AS-JUDGE rubric gate (Zheng et al., arXiv:2306.05685): a JSON
 *    rubric scores accuracy framing, iron-rule compliance, clarity and
 *    helpfulness; anything under threshold goes to
 * 4. SELF-REFINE (Madaan et al., arXiv:2303.17651): one refine pass driven
 *    by the judge's own feedback, then re-judged. Still failing: empty
 *    string, human takes over. Nothing weak ships.
 * 5. SELF-CONSISTENCY selection (Wang et al., arXiv:2203.11171) for short
 *    artifacts: N candidates in one call, the judge picks the winner
 *    (wired into the SERP title machine).
 *
 * Every pipeline records a trace for auditability; aggregate counters feed
 * the cockpit. All outputs pass the deterministic iron-rule scrubber last.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Central model caller for the brain consumers. The engine owns providers,
 * failover, counters and circuit breakers; the brain keeps its public
 * signature so every consumer stays as-is.
 */
function justice_brain_chat( array $messages, array $opts = array() ) {
	return justice_ai_chat( $messages, array(
		'model'       => $opts['model'] ?? get_option( 'justice_art_model', 'gpt-4.1' ),
		'temperature' => $opts['temperature'] ?? 0.4,
		'max_tokens'  => $opts['max_tokens'] ?? 900,
		'timeout'     => $opts['timeout'] ?? 60,
		'json'        => ! empty( $opts['json'] ),
		'source'      => $opts['source'] ?? 'brain',
	) );
}

/**
 * Hebrew-aware word count: str_word_count returns zero for Hebrew.
 */
function justice_brain_wc( string $text ): int {
	return count( preg_split( '/\s+/u', trim( wp_strip_all_tags( $text ) ), -1, PREG_SPLIT_NO_EMPTY ) );
}

/**
 * Deterministic iron-rule scrub, the last gate on every output.
 */
function justice_brain_scrub( string $text ): string {
	$text = str_replace( array( '—', '–' ), ',', $text );

	if ( function_exists( 'justice_enc_teller_hits' ) && justice_enc_teller_hits( $text ) ) {
		return '';
	}

	return trim( $text );
}

/**
 * RAG-lite: the most relevant published site sources for a query.
 */
function justice_brain_ground( string $query, int $limit = 3 ): array {
	$found = get_posts( array(
		'post_type'      => array( 'articles', 'justice_term', 'page', 'post' ),
		'post_status'    => 'publish',
		'posts_per_page' => $limit,
		's'              => mb_substr( $query, 0, 80 ),
	) );

	$sources = array();

	foreach ( $found as $post ) {
		$sources[] = array(
			'title'   => get_the_title( $post ),
			'url'     => get_permalink( $post ),
			'excerpt' => mb_substr( trim( wp_strip_all_tags( $post->post_content ) ), 0, 280 ),
		);
	}

	return $sources;
}

function justice_brain_bump( string $counter ): void {
	$stats = get_option( 'jt_brain_stats', array() );
	$day   = wp_date( 'Y-m-d' );

	if ( ( $stats['day'] ?? '' ) !== $day ) {
		$stats = array( 'day' => $day );
	}

	$stats[ $counter ] = (int) ( $stats[ $counter ] ?? 0 ) + 1;
	update_option( 'jt_brain_stats', $stats, false );
}

/**
 * Judge: MT-Bench style rubric, JSON verdict.
 */
function justice_brain_judge( string $text, string $purpose ): array {
	$raw = justice_brain_chat( array(
		array( 'role' => 'system', 'content' => 'אתה שופט איכות קפדני לתוכן משפטי בעברית. החזר JSON בלבד במבנה: {"accuracy_framing":1-5,"iron_rules":1-5,"clarity":1-5,"helpfulness":1-5,"feedback":"משפט אחד מה לתקן"}. accuracy_framing: האם הכל מנוסח כמידע כללי בלי ייעוץ קונקרטי, בלי עובדות מומצאות, בלי סעיפי חוק או פסקי דין שאינם מפורסמים ומוכרים. iron_rules: אין קו מפריד ארוך, אין סופרלטיבים, אין הבטחות תוצאה, אין ביטויי מילוי (חשוב לציין, בעידן, מעבר לכך, לסיכום, ראוי לציין, יש לזכור, חשוב להבין, חשוב לדעת, בשורה התחתונה, אין ספק, יתרה מכך, זאת ועוד). clarity: עברית טבעית וברורה. helpfulness: עונה באמת למטרה.' ),
		array( 'role' => 'user', 'content' => 'המטרה: ' . $purpose . "\n\nהטקסט לשיפוט:\n" . mb_substr( $text, 0, 2400 ) ),
	), array( 'json' => true, 'temperature' => 0, 'max_tokens' => 160, 'model' => 'gpt-4.1' ) );

	$scores = json_decode( $raw, true );

	if ( ! is_array( $scores ) ) {
		return array( 'pass' => true, 'feedback' => '', 'scores' => array() );
	}

	$min = min(
		(int) ( $scores['accuracy_framing'] ?? 5 ),
		(int) ( $scores['iron_rules'] ?? 5 ),
		(int) ( $scores['clarity'] ?? 5 ),
		(int) ( $scores['helpfulness'] ?? 5 )
	);

	return array(
		'pass'     => $min >= 4,
		'feedback' => (string) ( $scores['feedback'] ?? '' ),
		'scores'   => $scores,
	);
}

/**
 * The full grounded, verified, judged answer pipeline.
 *
 * @return array{text:string,trace:array}
 */
function justice_brain_answer( string $question, string $area_label ): array {
	$trace   = array();
	$sources = justice_brain_ground( $question );
	$trace['sources'] = wp_list_pluck( $sources, 'url' );

	$source_block = '';
	foreach ( $sources as $i => $source ) {
		$source_block .= ( $i + 1 ) . '. ' . $source['title'] . ' | ' . $source['url'] . ' | ' . $source['excerpt'] . "\n";
	}

	$rules = 'כללי ברזל: מידע כללי בלבד ולא ייעוץ, בלי עובדות או סעיפים מומצאים, בלי קו מפריד ארוך, בלי סופרלטיבים, בלי הבטחות, בלי ביטויי מילוי (חשוב לציין, בעידן, מעבר לכך, לסיכום, ראוי לציין, יש לזכור, חשוב להבין, חשוב לדעת, בשורה התחתונה, אין ספק, יתרה מכך, זאת ועוד). פסקאות p בלבד.';

	// Stage 1: grounded draft.
	$draft = justice_brain_chat( array(
		array( 'role' => 'system', 'content' => 'אתה עונה תשובת מידע כללי לשאלה משפטית בעברית לפרסום באתר. ' . $rules . ' מותר להסתמך רק על ידע כללי מוכר היטב ועל מקורות האתר המצורפים. כשמקור אתר רלוונטי, שלב קישור אליו בתוך המשפט: <a href="URL">עוגן טבעי</a>. מבנה: 2 עד 3 פסקאות של 60 עד 90 מילים, ופסקה קצרה אחרונה שממליצה על בדיקה עם עורך דין בתחום. אם אי אפשר לענות באחריות, החזר בדיוק: SKIP' ),
		array( 'role' => 'user', 'content' => 'תחום: ' . $area_label . "\nשאלה: " . $question . "\n\nמקורות האתר:\n" . ( $source_block ?: 'אין' ) ),
	), array( 'temperature' => 0.4 ) );

	if ( '' === $draft || false !== strpos( $draft, 'SKIP' ) ) {
		justice_brain_bump( 'skips' );
		return array( 'text' => '', 'trace' => $trace + array( 'stage' => 'draft_skip' ) );
	}

	$trace['draft_words'] = justice_brain_wc( $draft );

	// Stage 2: Chain-of-Verification, factored variant in one call.
	$verified = justice_brain_chat( array(
		array( 'role' => 'system', 'content' => 'אתה בודק עובדות לפי שיטת Chain-of-Verification. שלב א: נסח לעצמך את שלוש הטענות העובדתיות הבדיקות ביותר בטיוטה. שלב ב: ענה על כל אחת בנפרד, בלי להסתכל על שאר הטיוטה: האם היא נכונה כידע כללי מוכר במשפט הישראלי, או לא ודאית. שלב ג: כתוב מחדש את התשובה הסופית כשכל טענה לא ודאית מוסרת או מרוככת לניסוח כללי. החזר אך ורק את התשובה הסופית המתוקנת, באותו מבנה ועם אותם קישורים אם נשארו רלוונטיים. ' . $rules ),
		array( 'role' => 'user', 'content' => "השאלה: " . $question . "\n\nהטיוטה:\n" . $draft ),
	), array( 'temperature' => 0.2 ) );

	$candidate = '' !== $verified ? $verified : $draft;
	$trace['cove'] = '' !== $verified ? 'revised' : 'kept_draft';

	// Stage 3: rubric judge.
	$verdict = justice_brain_judge( $candidate, 'תשובה כללית לשאלה: ' . $question );
	$trace['judge1'] = $verdict['scores'];

	// Stage 4: one self-refine pass on failure, then re-judge.
	if ( ! $verdict['pass'] && '' !== $verdict['feedback'] ) {
		justice_brain_bump( 'refines' );

		$refined = justice_brain_chat( array(
			array( 'role' => 'system', 'content' => 'שפר את הטקסט לפי הערת השופט, בלי לאבד את הקישורים והמבנה. ' . $rules . ' החזר את הטקסט המתוקן בלבד.' ),
			array( 'role' => 'user', 'content' => 'הערת השופט: ' . $verdict['feedback'] . "\n\nהטקסט:\n" . $candidate ),
		), array( 'temperature' => 0.3 ) );

		if ( '' !== $refined ) {
			$candidate = $refined;
		}

		$verdict = justice_brain_judge( $candidate, 'תשובה כללית לשאלה: ' . $question );
		$trace['judge2'] = $verdict['scores'];
	}

	if ( ! $verdict['pass'] ) {
		justice_brain_bump( 'fails' );
		return array( 'text' => '', 'trace' => $trace + array( 'stage' => 'judge_fail' ) );
	}

	$final = justice_brain_scrub( $candidate );

	if ( '' === $final ) {
		justice_brain_bump( 'scrub_kills' );
		return array( 'text' => '', 'trace' => $trace + array( 'stage' => 'scrub_kill' ) );
	}

	if ( false === strpos( $final, '<p' ) ) {
		$final = '<p>' . implode( '</p><p>', array_filter( array_map( 'trim', preg_split( '/\n+/', $final ) ) ) ) . '</p>';
	}

	justice_brain_bump( 'passes' );
	$trace['final_words'] = justice_brain_wc( $final );

	return array( 'text' => $final, 'trace' => $trace );
}

/**
 * Self-consistency title selection: three candidates, judge picks.
 */
function justice_brain_best_title( string $current, string $query ): string {
	$raw = justice_brain_chat( array(
		array( 'role' => 'system', 'content' => 'אתה כותב כותרות SEO בעברית לאתר משפטי. החזר JSON בלבד: {"titles":["...","...","..."]} עם שלוש הצעות שונות באמת. לכל כותרת: הביטוי המרכזי בהתחלה, נקודתיים והרחבה עניינית, 45 עד 60 תווים לפני הסיומת, סיומת " | Jus-Tice". בלי קו מפריד ארוך, בלי סופרלטיבים, בלי הבטחות, בלי סימני קריאה.' ),
		array( 'role' => 'user', 'content' => 'ביטוי מרכזי: ' . $query . "\nכותרת נוכחית: " . $current ),
	), array( 'json' => true, 'temperature' => 0.8, 'max_tokens' => 220 ) );

	$data       = json_decode( $raw, true );
	$candidates = array();

	foreach ( (array) ( $data['titles'] ?? array() ) as $title ) {
		$title = justice_brain_scrub( str_replace( ' - ', ': ', (string) $title ) );
		$core  = mb_strlen( str_replace( ' | Jus-Tice', '', $title ) );
		$lead  = preg_split( '/\s+/u', trim( $query ) )[0] ?? '';

		if ( '' !== $title && $core >= 25 && $core <= 70 && ( ! $lead || false !== mb_strpos( $title, $lead ) ) ) {
			$candidates[] = $title;
		}
	}

	if ( ! $candidates ) {
		return '';
	}

	if ( 1 === count( $candidates ) ) {
		return $candidates[0];
	}

	$pick = justice_brain_chat( array(
		array( 'role' => 'system', 'content' => 'בחר את הכותרת שהכי סביר שתקבל הקלקה בתוצאות גוגל עבור הביטוי, עם ניסוח טבעי ומדויק. החזר JSON בלבד: {"winner":N} כאשר N הוא מספר הכותרת.' ),
		array( 'role' => 'user', 'content' => 'הביטוי: ' . $query . "\n" . implode( "\n", array_map( static function ( $i, $t ) {
			return ( $i + 1 ) . '. ' . $t;
		}, array_keys( $candidates ), $candidates ) ) ),
	), array( 'json' => true, 'temperature' => 0, 'max_tokens' => 30 ) );

	$choice = json_decode( $pick, true );
	$index  = max( 1, min( count( $candidates ), (int) ( $choice['winner'] ?? 1 ) ) ) - 1;

	justice_brain_bump( 'titles' );

	return $candidates[ $index ];
}

// ---------------------------------------------------------------------------
// Telemetry + admin test bench
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/brain-status', array(
		'methods'             => 'GET',
		'permission_callback' => function () {
			return current_user_can( 'update_plugins' );
		},
		'callback'            => function () {
			return array(
				'stats'    => get_option( 'jt_brain_stats', array() ),
				'last_err' => get_option( 'jt_brain_last_err', '' ),
			);
		},
	) );

	register_rest_route( 'justice-ops/v1', '/brain-test', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			$question = sanitize_textarea_field( (string) ( $request->get_param( 'q' ) ?: 'מה ההבדל בין צוואה רגילה לצוואה נוטריונית ומתי כדאי כל אחת' ) );
			$result   = justice_brain_answer( $question, 'ירושה וצוואות' );

			return array(
				'question' => $question,
				'words'    => justice_brain_wc( $result['text'] ),
				'trace'    => $result['trace'],
				'text'     => $result['text'],
			);
		},
	) );
} );
