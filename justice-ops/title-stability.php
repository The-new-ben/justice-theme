<?php
/**
 * Preserve the canonical server title when a chat notification overwrites it.
 *
 * Tawk may replace document.title with a notification counter after load. The
 * observer below restores only tightly matched chat-notification titles. It
 * does not patch document.title, block chat, or undo other legitimate changes.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Build the small title-stability script for one server-rendered title.
 */
function justice_ops_title_stability_script( string $canonical_title ): string {
	$canonical_title = trim( wp_strip_all_tags( $canonical_title ) );
	if ( '' === $canonical_title ) {
		return '';
	}

	$encoded = wp_json_encode(
		$canonical_title,
		JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
	);
	if ( ! is_string( $encoded ) || '' === $encoded ) {
		return '';
	}

	return '<script id="jt-title-stability" data-jt-title-stability="2026-08-03-r1">'
		. '(function(){"use strict";var canonical=' . $encoded . ';'
		. 'var notice=/^(?:(?:\\(\\d+\\)|\\d+)\\s*)?(?:הודעה חדשה|הודעות חדשות|new message|new messages)(?:\\s*\\d+)?$/iu;'
		. 'function restore(){var current=(document.title||"").trim();if(current!==canonical&&notice.test(current)){document.title=canonical;}}'
		. 'function watch(){restore();if(!document.head||typeof MutationObserver!=="function"){return;}'
		. 'new MutationObserver(restore).observe(document.head,{subtree:true,childList:true,characterData:true});}'
		. 'if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",watch,{once:true});}else{watch();}'
		. '}());</script>';
}

/**
 * Print before third-party chat bootstrap while deriving truth server-side.
 */
function justice_ops_title_stability_print(): void {
	if (
		is_admin()
		|| is_feed()
		|| ( defined( 'REST_REQUEST' ) && REST_REQUEST )
		|| ( function_exists( 'wp_is_json_request' ) && wp_is_json_request() )
	) {
		return;
	}

	$title = function_exists( 'wp_get_document_title' ) ? wp_get_document_title() : '';
	echo justice_ops_title_stability_script( (string) $title ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
}
add_action( 'wp_head', 'justice_ops_title_stability_print', 2 );
