<?php
/**
 * Publish notifications (owner order, 2026-07-16): an email for EVERY piece
 * of content that goes live on the site, whoever published it - the news
 * engine, the encyclopedia writer, an editor in wp-admin, or the agent
 * pipeline. The owner audits everything that reaches the public site.
 *
 * Fires on the publish TRANSITION only (not on updates to already-published
 * posts), for public post types, and never for internal types.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_publish_notify_email(): string {
	$saved = (string) get_option( 'justice_publish_notify_email', '' );

	// Default: the site's own admin address (Settings > General), which is
	// owner-controlled by definition. Override via the option if the owner
	// wants notifications elsewhere.
	return $saved ? $saved : (string) get_option( 'admin_email' );
}

add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
	if ( 'publish' !== $new_status || 'publish' === $old_status ) {
		return;
	}

	if ( ! $post instanceof WP_Post || wp_is_post_revision( $post ) || wp_is_post_autosave( $post ) ) {
		return;
	}

	$type_obj = get_post_type_object( $post->post_type );

	if ( ! $type_obj || empty( $type_obj->public ) || in_array( $post->post_type, array( 'attachment', 'justice_lead' ), true ) ) {
		return;
	}

	$who = 'מערכת (cron/engine)';

	if ( function_exists( 'wp_get_current_user' ) ) {
		$u = wp_get_current_user();

		if ( $u && $u->exists() ) {
			$who = $u->user_login;
		}
	}

	$news_source = (string) get_post_meta( $post->ID, 'news_source_name', true );

	if ( $news_source ) {
		$who .= ' | מנוע החדשות (מקור: ' . $news_source . ')';
	}

	$subject = '[Jus-Tice] פורסם: ' . wp_strip_all_tags( get_the_title( $post ) );
	$body    = "תוכן חדש עלה לאתר.\n\n"
		. 'כותרת: ' . wp_strip_all_tags( get_the_title( $post ) ) . "\n"
		. 'קישור: ' . get_permalink( $post ) . "\n"
		. 'סוג: ' . $post->post_type . "\n"
		. 'מי פרסם: ' . $who . "\n"
		. 'זמן: ' . wp_date( 'Y-m-d H:i' ) . "\n\n"
		. 'עריכה: ' . admin_url( 'post.php?post=' . $post->ID . '&action=edit' ) . "\n";

	wp_mail( justice_publish_notify_email(), $subject, $body );
}, 10, 3 );
