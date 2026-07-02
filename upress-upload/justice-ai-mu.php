<?php
/**
 * Plugin Name: JUS-TICE AI connector (must-use)
 * Description: Server-side OpenAI proxy for the AI Legal Tools. Registers /wp-json/justice/v1/generate.
 *
 * WHY MU-PLUGIN: WPCode snippets do NOT run during API calls, so the AI button could not reach them.
 * Must-use plugins load on EVERY request (including the REST API), so this works reliably.
 *
 * HOW TO INSTALL (no developer, no git):
 *   1. Open your uPress panel -> File Manager (the same place you click "Pull Git" / משוך גיט).
 *   2. Go to:  wp-content/mu-plugins/   (if the folder "mu-plugins" does not exist, create it).
 *   3. Upload this file (justice-ai-mu.php) into that folder.
 *   4. Open the file in the File Manager editor and replace sk-REPLACE-WITH-YOUR-OPENAI-KEY
 *      on the line below with your real OpenAI key, then Save.
 *   That is it. The app is already wired to call this; "Enhance with AI" turns on immediately.
 *   (Alternative: instead of editing this file, add  define('JUSTICE_OPENAI_KEY','sk-...');  to wp-config.php.)
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( ! defined( 'JUSTICE_AI_MODEL' ) ) { define( 'JUSTICE_AI_MODEL', 'gpt-5.4-mini' ); }
if ( ! defined( 'JUSTICE_AI_DAILY_REQUEST_LIMIT' ) ) { define( 'JUSTICE_AI_DAILY_REQUEST_LIMIT', 30 ); }
if ( ! defined( 'JUSTICE_AI_PER_IP_DAILY_LIMIT' ) ) { define( 'JUSTICE_AI_PER_IP_DAILY_LIMIT', 3 ); }
if ( ! defined( 'JUSTICE_AI_DAILY_SPEND_LIMIT_USD' ) ) { define( 'JUSTICE_AI_DAILY_SPEND_LIMIT_USD', 1.50 ); }
if ( ! defined( 'JUSTICE_AI_MAX_INPUT_CHARS' ) ) { define( 'JUSTICE_AI_MAX_INPUT_CHARS', 9000 ); }
if ( ! defined( 'JUSTICE_AI_MAX_OUTPUT_TOKENS' ) ) { define( 'JUSTICE_AI_MAX_OUTPUT_TOKENS', 900 ); }
if ( ! defined( 'JUSTICE_AI_INPUT_USD_PER_1M' ) ) { define( 'JUSTICE_AI_INPUT_USD_PER_1M', 0.75 ); }
if ( ! defined( 'JUSTICE_AI_OUTPUT_USD_PER_1M' ) ) { define( 'JUSTICE_AI_OUTPUT_USD_PER_1M', 4.50 ); }

if ( ! function_exists( 'justice_ai_guard_error' ) ) {
function justice_ai_guard_error( $error, $status = 200, $extra = array() ) {
	return new WP_REST_Response( array_merge( array( 'error' => $error ), $extra ), $status );
}

function justice_ai_guard_get_ip_hash() {
	$ip = '';
	if ( ! empty( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) {
		$ip = (string) $_SERVER['HTTP_CF_CONNECTING_IP'];
	} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
		$parts = explode( ',', (string) $_SERVER['HTTP_X_FORWARDED_FOR'] );
		$ip = trim( $parts[0] );
	} elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
		$ip = (string) $_SERVER['REMOTE_ADDR'];
	}
	return substr( hash( 'sha256', $ip ? $ip : 'unknown' ), 0, 32 );
}

function justice_ai_guard_usage_key( $scope ) {
	return 'justice_ai_usage_' . gmdate( 'Ymd' ) . '_' . $scope;
}

function justice_ai_guard_get_usage( $key ) {
	$usage = get_transient( $key );
	if ( ! is_array( $usage ) ) {
		$usage = array(
			'requests'      => 0,
			'estimated_usd' => 0.0,
			'input_chars'   => 0,
			'output_tokens' => 0,
		);
	}
	return $usage;
}

function justice_ai_guard_set_usage( $key, $usage ) {
	set_transient( $key, $usage, 2 * DAY_IN_SECONDS );
}

function justice_ai_guard_estimate_usd( $input_chars, $output_tokens ) {
	$input_tokens = (int) ceil( max( 0, $input_chars ) / 4 );
	return ( $input_tokens / 1000000 * JUSTICE_AI_INPUT_USD_PER_1M ) + ( $output_tokens / 1000000 * JUSTICE_AI_OUTPUT_USD_PER_1M );
}

function justice_ai_guard_check_limits( $input_chars ) {
	if ( $input_chars > JUSTICE_AI_MAX_INPUT_CHARS ) {
		return justice_ai_guard_error( 'input_too_large', 413, array( 'limit' => JUSTICE_AI_MAX_INPUT_CHARS ) );
	}

	$site_key = justice_ai_guard_usage_key( 'site' );
	$ip_key   = justice_ai_guard_usage_key( 'ip_' . justice_ai_guard_get_ip_hash() );
	$site     = justice_ai_guard_get_usage( $site_key );
	$ip       = justice_ai_guard_get_usage( $ip_key );
	$estimate = justice_ai_guard_estimate_usd( $input_chars, JUSTICE_AI_MAX_OUTPUT_TOKENS );

	if ( $site['requests'] >= JUSTICE_AI_DAILY_REQUEST_LIMIT ) {
		return justice_ai_guard_error( 'daily_site_limit', 429, array( 'limit' => JUSTICE_AI_DAILY_REQUEST_LIMIT ) );
	}
	if ( $ip['requests'] >= JUSTICE_AI_PER_IP_DAILY_LIMIT ) {
		return justice_ai_guard_error( 'daily_ip_limit', 429, array( 'limit' => JUSTICE_AI_PER_IP_DAILY_LIMIT ) );
	}
	if ( (float) $site['estimated_usd'] + $estimate > JUSTICE_AI_DAILY_SPEND_LIMIT_USD ) {
		return justice_ai_guard_error( 'daily_spend_limit', 429, array( 'limit_usd' => JUSTICE_AI_DAILY_SPEND_LIMIT_USD ) );
	}
	return true;
}

function justice_ai_guard_record_usage( $input_chars, $prompt_tokens, $completion_tokens ) {
	$cost     = ( $prompt_tokens / 1000000 * JUSTICE_AI_INPUT_USD_PER_1M ) + ( $completion_tokens / 1000000 * JUSTICE_AI_OUTPUT_USD_PER_1M );
	$site_key = justice_ai_guard_usage_key( 'site' );
	$ip_key   = justice_ai_guard_usage_key( 'ip_' . justice_ai_guard_get_ip_hash() );

	foreach ( array( $site_key, $ip_key ) as $key ) {
		$usage                  = justice_ai_guard_get_usage( $key );
		$usage['requests']      = (int) $usage['requests'] + 1;
		$usage['estimated_usd'] = round( (float) $usage['estimated_usd'] + $cost, 6 );
		$usage['input_chars']   = (int) $usage['input_chars'] + $input_chars;
		$usage['output_tokens'] = (int) $usage['output_tokens'] + $completion_tokens;
		justice_ai_guard_set_usage( $key, $usage );
	}
	return $cost;
}
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice/v1', '/generate', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => function ( WP_REST_Request $req ) {

			$key = defined( 'JUSTICE_OPENAI_KEY' ) && JUSTICE_OPENAI_KEY
				? JUSTICE_OPENAI_KEY
				: 'sk-REPLACE-WITH-YOUR-OPENAI-KEY';   // <-- paste your OpenAI key here

			if ( strpos( $key, 'sk-REPLACE' ) === 0 || ! $key ) {
				return new WP_REST_Response( array( 'error' => 'no_key' ), 200 );
			}

			// light anti-abuse: only accept calls coming from the site itself
			$ref = isset( $_SERVER['HTTP_REFERER'] ) ? $_SERVER['HTTP_REFERER'] : '';
			$org = isset( $_SERVER['HTTP_ORIGIN'] ) ? $_SERVER['HTTP_ORIGIN'] : '';
			if ( strpos( $ref, 'jus-tice' ) === false && strpos( $org, 'jus-tice' ) === false ) {
				return new WP_REST_Response( array( 'error' => 'forbidden' ), 200 );
			}

			$b     = $req->get_json_params();
			if ( ! is_array( $b ) ) {
				return justice_ai_guard_error( 'invalid_json', 400 );
			}
			$tool  = isset( $b['tool'] ) ? sanitize_key( $b['tool'] ) : 'document';
			$lang  = ( isset( $b['lang'] ) && $b['lang'] === 'en' ) ? 'en' : 'he';
			$draft = isset( $b['draft'] ) ? (string) $b['draft'] : '';
			$fields = isset( $b['fields'] ) && is_array( $b['fields'] )
				? wp_json_encode( $b['fields'], JSON_UNESCAPED_UNICODE )
				: '{}';

			if ( strlen( $draft ) < 40 ) {
				return justice_ai_guard_error( 'missing_draft', 400 );
			}

			$input_chars = strlen( $draft ) + strlen( $fields );
			$limit_check = justice_ai_guard_check_limits( $input_chars );
			if ( true !== $limit_check ) {
				return $limit_check;
			}

			$sys = 'You are a senior Israeli legal editor. Rewrite, sharpen and complete the draft so it is professional, precise and consistent with Israeli law. Reply in the same language as the draft (Hebrew or English). Keep a clear structure and dignified legal language; promise no outcomes. Return only the document body.';
			$user = "Tool: {$tool}\nLanguage: {$lang}\nClient fields JSON: {$fields}\n\nDraft to improve:\n{$draft}";

			$r = wp_remote_post( 'https://api.openai.com/v1/chat/completions', array(
				'timeout' => 45,
				'headers' => array(
					'Content-Type'  => 'application/json',
					'Authorization' => 'Bearer ' . $key,
				),
				'body' => wp_json_encode( array(
					'model'                 => apply_filters( 'justice_ai_model', JUSTICE_AI_MODEL ),
					'temperature'           => 0.25,
					'max_completion_tokens' => JUSTICE_AI_MAX_OUTPUT_TOKENS,
					'messages'              => array(
						array( 'role' => 'system', 'content' => $sys ),
						array( 'role' => 'user',   'content' => $user ),
					),
				) ),
			) );

			if ( is_wp_error( $r ) ) {
				return new WP_REST_Response( array( 'error' => 'upstream' ), 200 );
			}
			$code = (int) wp_remote_retrieve_response_code( $r );
			$raw  = wp_remote_retrieve_body( $r );
			$d    = json_decode( $raw, true );
			if ( $code < 200 || $code >= 300 || ! is_array( $d ) || isset( $d['error'] ) ) {
				$message = isset( $d['error']['message'] ) ? substr( sanitize_text_field( $d['error']['message'] ), 0, 220 ) : 'OpenAI request failed';
				return new WP_REST_Response( array(
					'error'  => 'upstream',
					'status' => $code,
					'detail' => $message,
				), 200 );
			}
			$text = isset( $d['choices'][0]['message']['content'] ) ? trim( (string) $d['choices'][0]['message']['content'] ) : '';
			if ( '' === $text ) {
				return new WP_REST_Response( array( 'error' => 'upstream_empty' ), 200 );
			}
			$prompt_tokens = isset( $d['usage']['prompt_tokens'] ) ? (int) $d['usage']['prompt_tokens'] : (int) ceil( $input_chars / 4 );
			$completion_tokens = isset( $d['usage']['completion_tokens'] ) ? (int) $d['usage']['completion_tokens'] : JUSTICE_AI_MAX_OUTPUT_TOKENS;
			$cost = justice_ai_guard_record_usage( $input_chars, $prompt_tokens, $completion_tokens );
			return new WP_REST_Response( array(
				'text'  => $text,
				'usage' => array(
					'model'         => apply_filters( 'justice_ai_model', JUSTICE_AI_MODEL ),
					'estimated_usd' => round( $cost, 6 ),
				),
			), 200 );
		},
	) );
} );

/*
 * Google Places API key for the profile Google-reviews panel (theme
 * feature justice_theme_render_lawyer_google_reviews). Same pattern as
 * the OpenAI key: EITHER add to wp-config.php:
 *   define( 'JUSTICE_GOOGLE_PLACES_KEY', 'AIza-REPLACE-WITH-YOUR-KEY' );
 * OR uncomment the filter below and paste the key on the server copy of
 * this file only. Never commit a real key to the repo.
 */
// add_filter( 'justice_theme_google_places_api_key', function () {
// 	return 'AIza-REPLACE-WITH-YOUR-KEY';
// } );

/*
 * Mapbox public token (pk...) for the LawyerScout 3D map. Restrict the
 * token to jus-tice.co.il in the Mapbox dashboard. EITHER add to
 * wp-config.php:
 *   define( 'JUSTICE_MAPBOX_PUBLIC_TOKEN', 'pk.REPLACE-WITH-YOUR-TOKEN' );
 * OR uncomment the filter below on the server copy only.
 */
// add_filter( 'justice_theme_mapbox_public_token', function () {
// 	return 'pk.REPLACE-WITH-YOUR-TOKEN';
// } );
