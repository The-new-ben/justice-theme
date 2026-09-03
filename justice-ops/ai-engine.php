<?php
/**
 * The AI engine: one door for every model call, with a loud failover.
 *
 * Owner order (2026-07-12): a quality backup AI engine that NEVER switches
 * silently. Every OpenAI call site in the plugin routes through
 * justice_ai_chat(); when the primary fails (quota, rate limit, outage) the
 * engine can fail over to Anthropic (JUSTICE_ANTHROPIC_KEY) or OpenRouter
 * (JUSTICE_OPENROUTER_KEY), and every state change mails the owner, shows on
 * the cockpit, flips the public ai-health endpoint, and trips the hourly
 * monitor. Circuit breakers cap the daily call volume (runaway or abuse
 * protection, option jt_ai_daily_cap) and a kill switch (jt_ai_paused)
 * stops all spending instantly. Per-source daily counters make every
 * consumer visible, so a future quota question has an answer in the data.
 *
 * Providers:
 * - Primary: OpenAI (JUSTICE_OPENAI_KEY), exactly as before.
 * - Fallback: Anthropic Messages API, model from jt_ai_fallback_model
 *   (default claude-opus-4-8; claude-sonnet-5 is the cost-efficient
 *   alternative). Vision input is converted from the OpenAI image_url
 *   shape to Anthropic base64 blocks, so the document desk keeps working
 *   during a failover. Sampling params are omitted (the current Claude
 *   family rejects them).
 * - Fallback alternative: OpenRouter (OpenAI-compatible passthrough),
 *   model from jt_ai_openrouter_model, default openai/<same model>.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Fallback key resolution: the wp-config constant wins, else the option
 * installed through the ai-key route. The option path exists so the owner
 * can hand the agent a key in chat and never touch a file: the agent
 * installs it over the authenticated REST route and the failover arms
 * itself on the next call.
 */
function justice_ai_key( string $provider ): string {
	if ( 'anthropic' === $provider ) {
		if ( defined( 'JUSTICE_ANTHROPIC_KEY' ) && '' !== JUSTICE_ANTHROPIC_KEY ) {
			return (string) JUSTICE_ANTHROPIC_KEY;
		}

		return (string) get_option( 'jt_ai_key_anthropic', '' );
	}

	if ( 'openrouter' === $provider ) {
		if ( defined( 'JUSTICE_OPENROUTER_KEY' ) && '' !== JUSTICE_OPENROUTER_KEY ) {
			return (string) JUSTICE_OPENROUTER_KEY;
		}

		return (string) get_option( 'jt_ai_key_openrouter', '' );
	}

	return '';
}

/**
 * Which fallback provider is configured, if any.
 */
function justice_ai_fallback_provider(): string {
	if ( '' !== justice_ai_key( 'anthropic' ) ) {
		return 'anthropic';
	}

	if ( '' !== justice_ai_key( 'openrouter' ) ) {
		return 'openrouter';
	}

	return '';
}

/**
 * Key installation without touching wp-config: POST {provider, key},
 * admin capability required, key stored unautoloaded and never echoed.
 */
add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/ai-key', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function ( $req ) {
			$provider = sanitize_key( (string) $req->get_param( 'provider' ) );
			$key      = trim( (string) $req->get_param( 'key' ) );

			if ( ! in_array( $provider, array( 'anthropic', 'openrouter' ), true ) || '' === $key ) {
				return new WP_Error( 'bad_request', 'provider (anthropic|openrouter) and key are required', array( 'status' => 400 ) );
			}

			update_option( 'jt_ai_key_' . $provider, $key, false );

			return array(
				'ok'       => true,
				'provider' => $provider,
				'fallback' => justice_ai_fallback_provider(),
				'state'    => justice_ai_state(),
			);
		},
	) );
} );

/**
 * Today's usage ledger: calls and failures per provider, calls per source.
 */
function justice_ai_usage(): array {
	$usage = get_option( 'jt_ai_usage', array() );
	$today = wp_date( 'Y-m-d' );

	if ( ! is_array( $usage ) || ( $usage['date'] ?? '' ) !== $today ) {
		$usage = array( 'date' => $today, 'providers' => array(), 'sources' => array() );
	}

	return $usage;
}

function justice_ai_bump( string $provider, string $source, bool $ok ): void {
	$usage = justice_ai_usage();

	$usage['providers'][ $provider ][ $ok ? 'ok' : 'fail' ] = (int) ( $usage['providers'][ $provider ][ $ok ? 'ok' : 'fail' ] ?? 0 ) + 1;
	$usage['sources'][ $source ] = (int) ( $usage['sources'][ $source ] ?? 0 ) + 1;

	update_option( 'jt_ai_usage', $usage, false );
}

function justice_ai_calls_today(): int {
	$usage = justice_ai_usage();
	$total = 0;

	foreach ( (array) ( $usage['providers'] ?? array() ) as $p ) {
		$total += (int) ( $p['ok'] ?? 0 ) + (int) ( $p['fail'] ?? 0 );
	}

	return $total;
}

/**
 * The engine state machine. Every transition mails the owner exactly once:
 * the whole point is that nothing here ever happens silently.
 */
function justice_ai_state(): array {
	$state = get_option( 'jt_ai_state', array() );

	return is_array( $state ) && ! empty( $state['state'] )
		? $state
		: array( 'state' => 'normal', 'provider' => 'openai', 'reason' => '', 'since' => '' );
}

function justice_ai_transition( string $new, string $provider, string $reason ): void {
	$current = justice_ai_state();

	if ( $current['state'] === $new && $current['provider'] === $provider ) {
		return;
	}

	update_option( 'jt_ai_state', array(
		'state'    => $new,
		'provider' => $provider,
		'reason'   => mb_substr( $reason, 0, 220 ),
		'since'    => wp_date( 'Y-m-d H:i' ),
	), false );

	$subjects = array(
		'failover' => '[Jus-Tice] שכבת ה-AI עברה לספק גיבוי: ' . $provider,
		'down'     => '[Jus-Tice] שכבת ה-AI מושבתת',
		'capped'   => '[Jus-Tice] שכבת ה-AI נעצרה: תקרת קריאות יומית',
		'paused'   => '[Jus-Tice] שכבת ה-AI במצב מושהה ידנית',
		'normal'   => '[Jus-Tice] שכבת ה-AI חזרה לספק הראשי',
	);

	$bodies = array(
		'failover' => "הספק הראשי (OpenAI) נכשל: {$reason}.\nהמערכת עברה אוטומטית לספק הגיבוי: {$provider} (מודל: " . justice_ai_fallback_model_label() . ").\nשום דבר לא הוחלף בשקט: זו ההודעה.\n\nפעולה מומלצת: לטעון יתרה בחשבון OpenAI, והמערכת תחזור לראשי אוטומטית.",
		'down'     => "שכבת ה-AI אינה זמינה. סיבה: {$reason}.\nלא מוגדר ספק גיבוי (אפשר להוסיף JUSTICE_ANTHROPIC_KEY או JUSTICE_OPENROUTER_KEY ב-wp-config), או שגם הגיבוי נכשל.\n\nהשפעה: עוזר ה-AI, טיוטות שאלות ותשובות, מאמרי המכונה וכותרות SERP מושהים עד לתיקון.\nפעולה: לטעון יתרה ב-OpenAI או להוסיף מפתח גיבוי.",
		'capped'   => "מספר הקריאות היומי חצה את התקרה (" . (int) get_option( 'jt_ai_daily_cap', 400 ) . ").\nזו הגנה מפני ריצה משתוללת או ניצול לרעה. הקריאות יתחדשו מחר, או שאפשר להעלות את התקרה באופציה jt_ai_daily_cap.",
		'paused'   => "מתג העצירה jt_ai_paused פעיל. אף קריאת AI לא תבוצע עד לכיבויו.",
		'normal'   => "הספק הראשי (OpenAI) שוב עונה תקין, והמערכת חזרה אליו אוטומטית.",
	);

	// 2026-09-03 owner order: AI-layer state e-mails are opt-in (jt_ai_notify_email = 1).
	if ( isset( $subjects[ $new ] ) && get_option( 'jt_ai_notify_email', 0 ) ) {
		wp_mail(
			get_option( 'admin_email' ),
			$subjects[ $new ],
			$bodies[ $new ] . "\n\nמצב חי: " . home_url( '/wp-json/justice-ops/v1/ai-health' ) . "\nקוקפיט: " . admin_url( 'admin.php?page=justice-cockpit' )
		);
	}
}

function justice_ai_fallback_model_label(): string {
	$provider = justice_ai_fallback_provider();

	if ( 'anthropic' === $provider ) {
		return (string) get_option( 'jt_ai_fallback_model', 'claude-opus-4-8' );
	}

	if ( 'openrouter' === $provider ) {
		return (string) get_option( 'jt_ai_openrouter_model', 'openai passthrough' );
	}

	return 'ללא';
}

/**
 * Classify a failed primary response for the transition reason.
 */
function justice_ai_classify( $response ): string {
	if ( is_wp_error( $response ) ) {
		return 'network: ' . $response->get_error_message();
	}

	$code = (int) wp_remote_retrieve_response_code( $response );
	$body = (string) wp_remote_retrieve_body( $response );

	if ( 429 === $code && false !== strpos( $body, 'insufficient_quota' ) ) {
		return 'quota: היתרה בחשבון OpenAI נגמרה';
	}

	if ( 429 === $code ) {
		return 'rate limit (429)';
	}

	if ( 401 === $code || 403 === $code ) {
		return 'auth (' . $code . '): המפתח נדחה';
	}

	if ( $code >= 500 ) {
		return 'server error (' . $code . ')';
	}

	return 'http ' . $code;
}

/**
 * OpenAI attempt: the primary, byte-compatible with the old call sites.
 *
 * @return array{text:string,fail:string} fail empty on success.
 */
function justice_ai_try_openai( array $messages, array $opts ): array {
	if ( ! defined( 'JUSTICE_OPENAI_KEY' ) || '' === JUSTICE_OPENAI_KEY ) {
		return array( 'text' => '', 'fail' => 'no key' );
	}

	$body = array(
		'model'       => $opts['model'],
		'messages'    => $messages,
		'temperature' => $opts['temperature'],
		'max_tokens'  => $opts['max_tokens'],
	);

	if ( ! empty( $opts['json'] ) ) {
		$body['response_format'] = array( 'type' => 'json_object' );
	}

	$last = '';

	for ( $try = 0; $try < 2; $try++ ) {
		$response = wp_remote_post( 'https://api.openai.com/v1/chat/completions', array(
			'timeout' => $opts['timeout'],
			'headers' => array( 'Authorization' => 'Bearer ' . JUSTICE_OPENAI_KEY, 'Content-Type' => 'application/json' ),
			'body'    => wp_json_encode( $body ),
		) );

		$last = justice_ai_classify( $response );

		if ( ! is_wp_error( $response ) && 200 === (int) wp_remote_retrieve_response_code( $response ) ) {
			$data = json_decode( (string) wp_remote_retrieve_body( $response ), true );
			$text = trim( (string) ( $data['choices'][0]['message']['content'] ?? '' ) );

			if ( '' !== $text ) {
				update_option( 'jt_brain_last_err', '', false );
				return array( 'text' => $text, 'fail' => '' );
			}

			$last = 'empty response';
		} else {
			update_option( 'jt_brain_last_err', mb_substr( is_wp_error( $response ) ? $response->get_error_message() : (string) wp_remote_retrieve_body( $response ), 0, 200 ), false );
		}

		// Quota and auth failures are deterministic: retrying burns time.
		if ( 0 === strpos( $last, 'quota' ) || 0 === strpos( $last, 'auth' ) ) {
			break;
		}
	}

	return array( 'text' => '', 'fail' => $last );
}

/**
 * Anthropic Messages attempt: system extracted to the top level, vision
 * converted from OpenAI image_url data URIs to base64 blocks, sampling
 * omitted, JSON enforced through the system text.
 */
function justice_ai_try_anthropic( array $messages, array $opts ): array {
	$system = '';
	$conv   = array();

	foreach ( $messages as $m ) {
		$role    = (string) ( $m['role'] ?? 'user' );
		$content = $m['content'] ?? '';

		if ( 'system' === $role ) {
			$system .= ( '' === $system ? '' : "\n" ) . ( is_string( $content ) ? $content : '' );
			continue;
		}

		if ( is_array( $content ) ) {
			$blocks = array();

			foreach ( $content as $part ) {
				if ( isset( $part['type'] ) && 'text' === $part['type'] ) {
					$blocks[] = array( 'type' => 'text', 'text' => (string) $part['text'] );
				} elseif ( isset( $part['type'] ) && 'image_url' === $part['type'] ) {
					$url = (string) ( $part['image_url']['url'] ?? '' );

					if ( preg_match( '#^data:(image/[a-z+]+);base64,(.+)$#s', $url, $m2 ) ) {
						$blocks[] = array(
							'type'   => 'image',
							'source' => array( 'type' => 'base64', 'media_type' => $m2[1], 'data' => $m2[2] ),
						);
					}
				}
			}

			$conv[] = array( 'role' => 'assistant' === $role ? 'assistant' : 'user', 'content' => $blocks );
		} else {
			$conv[] = array( 'role' => 'assistant' === $role ? 'assistant' : 'user', 'content' => (string) $content );
		}
	}

	if ( ! empty( $opts['json'] ) ) {
		$system .= "\nהחזר אך ורק JSON תקין, בלי טקסט לפני או אחרי.";
	}

	$body = array(
		'model'      => (string) get_option( 'jt_ai_fallback_model', 'claude-opus-4-8' ),
		'max_tokens' => min( 8192, max( 256, (int) $opts['max_tokens'] ) ),
		'messages'   => $conv,
	);

	if ( '' !== $system ) {
		$body['system'] = $system;
	}

	$response = wp_remote_post( 'https://api.anthropic.com/v1/messages', array(
		'timeout' => max( 60, (int) $opts['timeout'] ),
		'headers' => array(
			'x-api-key'         => justice_ai_key( 'anthropic' ),
			'anthropic-version' => '2023-06-01',
			'Content-Type'      => 'application/json',
		),
		'body'    => wp_json_encode( $body ),
	) );

	if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
		return array( 'text' => '', 'fail' => justice_ai_classify( $response ) );
	}

	$data = json_decode( (string) wp_remote_retrieve_body( $response ), true );

	if ( 'refusal' === (string) ( $data['stop_reason'] ?? '' ) ) {
		return array( 'text' => '', 'fail' => 'refusal' );
	}

	$text = '';

	foreach ( (array) ( $data['content'] ?? array() ) as $block ) {
		if ( isset( $block['type'] ) && 'text' === $block['type'] ) {
			$text .= (string) $block['text'];
		}
	}

	$text = trim( $text );

	return '' !== $text
		? array( 'text' => $text, 'fail' => '' )
		: array( 'text' => '', 'fail' => 'empty response' );
}

/**
 * OpenRouter attempt: OpenAI-compatible passthrough with one key for many
 * models. Default model mirrors the requested OpenAI model.
 */
function justice_ai_try_openrouter( array $messages, array $opts ): array {
	$model = (string) get_option( 'jt_ai_openrouter_model', '' );

	if ( '' === $model ) {
		$model = 'openai/' . $opts['model'];
	}

	$body = array(
		'model'      => $model,
		'messages'   => $messages,
		'max_tokens' => $opts['max_tokens'],
	);

	// The current Claude family rejects sampling params; keep them only for
	// non-Anthropic slugs.
	if ( 0 !== strpos( $model, 'anthropic/' ) ) {
		$body['temperature'] = $opts['temperature'];
	}

	if ( ! empty( $opts['json'] ) ) {
		$body['response_format'] = array( 'type' => 'json_object' );
	}

	$response = wp_remote_post( 'https://openrouter.ai/api/v1/chat/completions', array(
		'timeout' => max( 60, (int) $opts['timeout'] ),
		'headers' => array(
			'Authorization' => 'Bearer ' . justice_ai_key( 'openrouter' ),
			'Content-Type'  => 'application/json',
			'HTTP-Referer'  => home_url( '/' ),
			'X-Title'       => 'Jus-Tice',
		),
		'body'    => wp_json_encode( $body ),
	) );

	if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
		return array( 'text' => '', 'fail' => justice_ai_classify( $response ) );
	}

	$data = json_decode( (string) wp_remote_retrieve_body( $response ), true );
	$text = trim( (string) ( $data['choices'][0]['message']['content'] ?? '' ) );

	return '' !== $text
		? array( 'text' => $text, 'fail' => '' )
		: array( 'text' => '', 'fail' => 'empty response' );
}

/**
 * The one door. Every model call in the plugin goes through here.
 *
 * @param array $messages OpenAI-shaped chat messages.
 * @param array $opts     model, temperature, max_tokens, timeout, json, source.
 * @return string Model text, or '' on failure (never fails loudly to users).
 */
function justice_ai_chat( array $messages, array $opts = array() ): string {
	$opts = array_merge( array(
		'model'       => (string) get_option( 'justice_art_model', 'gpt-4.1' ),
		'temperature' => 0.4,
		'max_tokens'  => 900,
		'timeout'     => 60,
		'json'        => false,
		'source'      => 'core',
	), $opts );

	// Kill switch: no call leaves the building.
	if ( get_option( 'jt_ai_paused' ) ) {
		justice_ai_transition( 'paused', 'none', 'מתג עצירה ידני' );
		return '';
	}

	// Daily circuit breaker.
	$cap = (int) get_option( 'jt_ai_daily_cap', 400 );

	if ( $cap > 0 && justice_ai_calls_today() >= $cap ) {
		justice_ai_transition( 'capped', 'none', 'תקרת קריאות יומית' );
		return '';
	}

	$primary = justice_ai_try_openai( $messages, $opts );
	justice_ai_bump( 'openai', $opts['source'], '' === $primary['fail'] );

	if ( '' === $primary['fail'] ) {
		if ( 'normal' !== justice_ai_state()['state'] ) {
			justice_ai_transition( 'normal', 'openai', 'primary recovered' );
		}

		return $primary['text'];
	}

	$provider = justice_ai_fallback_provider();

	if ( '' === $provider ) {
		justice_ai_transition( 'down', 'none', $primary['fail'] );
		return '';
	}

	$fallback = 'anthropic' === $provider
		? justice_ai_try_anthropic( $messages, $opts )
		: justice_ai_try_openrouter( $messages, $opts );

	justice_ai_bump( $provider, $opts['source'], '' === $fallback['fail'] );

	if ( '' === $fallback['fail'] ) {
		justice_ai_transition( 'failover', $provider, $primary['fail'] );
		return $fallback['text'];
	}

	justice_ai_transition( 'down', $provider, 'ראשי: ' . $primary['fail'] . ' | גיבוי: ' . $fallback['fail'] );

	return '';
}

/**
 * Public health surface: state, provider, today's counters. No secrets.
 */
function justice_ai_health(): array {
	$state = justice_ai_state();
	$usage = justice_ai_usage();

	return array(
		'ok'                  => 'normal' === $state['state'],
		'state'               => $state['state'],
		'provider'            => $state['provider'],
		'reason'              => $state['reason'],
		'since'               => $state['since'],
		'fallback_configured' => '' !== justice_ai_fallback_provider(),
		'fallback_provider'   => justice_ai_fallback_provider(),
		'daily_cap'           => (int) get_option( 'jt_ai_daily_cap', 400 ),
		'today'               => $usage,
	);
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/ai-health', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => 'justice_ai_health',
	) );
} );
