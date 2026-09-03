<?php
/**
 * Compat stubs (2026-09-03): neutral replacements for functions that lived in
 * modules the owner ordered unloaded. Each returns the "nothing happened" value.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'justice_ai_chat' ) ) {
	/** AI layer removed: every caller treats '' as "no suggestion". */
	function justice_ai_chat( array $messages, array $opts = array() ): string {
		return '';
	}
}

if ( ! function_exists( 'justice_enc_word_count' ) ) {
	function justice_enc_word_count( string $html ): int {
		return (int) str_word_count( wp_strip_all_tags( $html ) );
	}
}

if ( ! function_exists( 'justice_market_rank' ) ) {
	function justice_market_rank( array $candidates ): array {
		return $candidates;
	}
}

if ( ! function_exists( 'justice_ops_content_first_target_paths' ) ) {
	function justice_ops_content_first_target_paths(): array {
		return array();
	}
}
