<?php
/**
 * Admin-only importer for repo-maintained long-form content drafts.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_menu', 'justice_theme_register_content_draft_importer' );
add_action( 'admin_init', 'justice_theme_handle_content_draft_import' );
add_filter( 'manage_articles_posts_columns', 'justice_theme_add_article_review_columns' );
add_action( 'manage_articles_posts_custom_column', 'justice_theme_render_article_review_columns', 10, 2 );

function justice_theme_register_content_draft_importer(): void {
	add_management_page(
		__( 'Jus-Tice Content Drafts', 'justice-theme' ),
		__( 'Jus-Tice Content Drafts', 'justice-theme' ),
		'manage_options',
		'justice-content-drafts',
		'justice_theme_render_content_draft_importer'
	);
}

function justice_theme_add_article_review_columns( array $columns ): array {
	$updated = array();

	foreach ( $columns as $key => $label ) {
		$updated[ $key ] = $label;

		if ( 'title' === $key ) {
			$updated['justice_repo_draft']    = __( 'Repo Draft', 'justice-theme' );
			$updated['justice_content_origin'] = __( 'Content Origin', 'justice-theme' );
			$updated['justice_review_gates'] = __( 'Review Gates', 'justice-theme' );
			$updated['justice_words']        = __( 'Words', 'justice-theme' );
		}
	}

	return $updated;
}

function justice_theme_render_article_review_columns( string $column, int $post_id ): void {
	if ( 'justice_repo_draft' === $column ) {
		$file   = (string) get_post_meta( $post_id, 'repo_content_draft_file', true );
		$status = (string) get_post_meta( $post_id, 'repo_content_draft_status', true );

		if ( '' === $file ) {
			echo '&mdash;';
			return;
		}

		echo '<code>' . esc_html( $file ) . '</code>';
		if ( '' !== $status ) {
			echo '<br><small>' . esc_html( $status ) . '</small>';
		}
		return;
	}

	if ( 'justice_content_origin' === $column ) {
		$content_status = (string) get_post_meta( $post_id, 'content_status', true );
		$lawyer_id      = (int) get_post_meta( $post_id, 'requested_by_lawyer_id', true );
		$lawyer_slug    = (string) get_post_meta( $post_id, 'connected_lawyer_slug', true );
		$intent         = (string) get_post_meta( $post_id, 'lawyer_content_intent', true );

		if ( 'lawyer_requested_draft' === $content_status ) {
			echo '<strong>' . esc_html__( 'Lawyer request', 'justice-theme' ) . '</strong>';
			if ( $lawyer_id ) {
				echo '<br><a href="' . esc_url( get_edit_post_link( $lawyer_id, '' ) ) . '">' . esc_html( get_the_title( $lawyer_id ) ) . '</a>';
			} elseif ( '' !== $lawyer_slug ) {
				echo '<br><code>' . esc_html( $lawyer_slug ) . '</code>';
			}
			if ( '' !== $intent ) {
				echo '<br><small>' . esc_html( $intent ) . '</small>';
			}
			return;
		}

		if ( '' !== $content_status ) {
			echo '<code>' . esc_html( $content_status ) . '</code>';
			return;
		}

		echo '&mdash;';
		return;
	}

	if ( 'justice_review_gates' === $column ) {
		$needs_legal  = (string) get_post_meta( $post_id, 'needs_legal_review', true );
		$needs_source = (string) get_post_meta( $post_id, 'needs_browser_source_verification', true );
		$source_audit = (string) get_post_meta( $post_id, 'repo_content_source_audit', true );

		$legal_label  = '1' === $needs_legal ? __( 'Legal: NOT VERIFIED', 'justice-theme' ) : __( 'Legal: cleared/unknown', 'justice-theme' );
		$source_label = '1' === $needs_source ? __( 'Sources: NOT VERIFIED', 'justice-theme' ) : __( 'Sources: cleared/unknown', 'justice-theme' );

		echo esc_html( $legal_label ) . '<br>';
		echo esc_html( $source_label );
		if ( '' !== $source_audit ) {
			echo '<br><code>' . esc_html( $source_audit ) . '</code>';
		}
		return;
	}

	if ( 'justice_words' === $column ) {
		$word_count = (int) get_post_meta( $post_id, 'repo_content_draft_word_count', true );
		echo $word_count > 0 ? esc_html( number_format_i18n( $word_count ) ) : '&mdash;';
	}
}

function justice_theme_render_content_draft_importer(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$drafts = justice_theme_get_repo_content_drafts();
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Jus-Tice Content Drafts', 'justice-theme' ); ?></h1>
		<p><?php esc_html_e( 'Import long-form repo drafts into the articles CMS as draft-only posts. Existing non-imported content is never overwritten.', 'justice-theme' ); ?></p>

		<?php if ( ! empty( $_GET['justice_import_message'] ) ) : ?>
			<?php
			$result  = isset( $_GET['justice_import_result'] ) ? sanitize_key( wp_unslash( $_GET['justice_import_result'] ) ) : 'updated';
			$message = sanitize_text_field( rawurldecode( wp_unslash( $_GET['justice_import_message'] ) ) );
			$class   = 'success' === $result ? 'notice-success' : 'notice-warning';
			?>
			<div class="notice <?php echo esc_attr( $class ); ?>"><p><?php echo esc_html( $message ); ?></p></div>
		<?php endif; ?>

		<?php if ( ! empty( $_GET['justice_family_publish_message'] ) ) : ?>
			<?php
			$publish_result  = isset( $_GET['justice_family_publish_result'] ) ? sanitize_key( wp_unslash( $_GET['justice_family_publish_result'] ) ) : 'updated';
			$publish_message = sanitize_text_field( rawurldecode( wp_unslash( $_GET['justice_family_publish_message'] ) ) );
			$publish_class   = 'success' === $publish_result ? 'notice-success' : 'notice-warning';
			?>
			<div class="notice <?php echo esc_attr( $publish_class ); ?>"><p><?php echo esc_html( $publish_message ); ?></p></div>
		<?php endif; ?>

		<?php if ( function_exists( 'justice_theme_get_owner_approved_family_cluster' ) ) : ?>
			<?php
			$publication_result = get_option( 'justice_family_cluster_publication_result', array() );
			$publication_time   = is_array( $publication_result ) && ! empty( $publication_result['time'] ) ? $publication_result['time'] : '';
			?>
			<div class="notice notice-info">
				<p>
					<strong><?php esc_html_e( 'Owner-approved family-law cluster', 'justice-theme' ); ?></strong><br>
					<?php if ( $publication_time ) : ?>
						<?php echo esc_html( sprintf( 'Last publication run: %s', $publication_time ) ); ?>
					<?php else : ?>
						<?php esc_html_e( 'Not published by the repo publisher yet.', 'justice-theme' ); ?>
					<?php endif; ?>
				</p>
				<p>
					<a class="button button-secondary" href="<?php echo esc_url( wp_nonce_url( add_query_arg( array( 'action' => 'justice_publish_family_cluster' ), admin_url( 'tools.php?page=justice-content-drafts' ) ), 'justice_publish_family_cluster' ) ); ?>">
						<?php esc_html_e( 'Run preflight / repair existing family-law pages', 'justice-theme' ); ?>
					</a>
				</p>
				<p><small><?php esc_html_e( 'This keeps pages in place and refreshes them only with public-facing body content. Internal notes are kept in the draft internal editorial note.', 'justice-theme' ); ?></small></p>
			</div>
		<?php endif; ?>

		<?php if ( ! post_type_exists( 'articles' ) ) : ?>
			<div class="notice notice-warning"><p><?php esc_html_e( 'The articles post type is not active, so imports are blocked.', 'justice-theme' ); ?></p></div>
		<?php else : ?>
			<p>
				<a class="button button-primary" href="<?php echo esc_url( wp_nonce_url( add_query_arg( array( 'action' => 'justice_import_all_content_drafts' ), admin_url( 'tools.php?page=justice-content-drafts' ) ), 'justice_import_all_content_drafts' ) ); ?>">
					<?php esc_html_e( 'Import all repo drafts as drafts', 'justice-theme' ); ?>
				</a>
			</p>
		<?php endif; ?>

		<table class="widefat striped">
			<thead>
				<tr>
					<th><?php esc_html_e( 'File', 'justice-theme' ); ?></th>
					<th><?php esc_html_e( 'Slug', 'justice-theme' ); ?></th>
					<th><?php esc_html_e( 'Title', 'justice-theme' ); ?></th>
					<th><?php esc_html_e( 'Draft Status', 'justice-theme' ); ?></th>
					<th><?php esc_html_e( 'Words', 'justice-theme' ); ?></th>
					<th><?php esc_html_e( 'Source Audit', 'justice-theme' ); ?></th>
					<th><?php esc_html_e( 'CMS Status', 'justice-theme' ); ?></th>
					<th><?php esc_html_e( 'Action', 'justice-theme' ); ?></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( $drafts as $draft ) : ?>
					<?php
					$existing = get_page_by_path( $draft['slug'], OBJECT, 'articles' );
					$status   = $existing ? get_post_status( $existing ) : __( 'Not imported', 'justice-theme' );
					$url      = wp_nonce_url(
						add_query_arg(
							array(
								'action' => 'justice_import_content_draft',
								'file'   => rawurlencode( $draft['file'] ),
							),
							admin_url( 'tools.php?page=justice-content-drafts' )
						),
						'justice_import_content_draft_' . $draft['file']
					);
					?>
					<tr>
						<td><code><?php echo esc_html( $draft['file'] ); ?></code></td>
						<td><code><?php echo esc_html( $draft['slug'] ); ?></code></td>
						<td><?php echo esc_html( $draft['title'] ); ?></td>
						<td><code><?php echo esc_html( $draft['status'] ); ?></code></td>
						<td><?php echo esc_html( number_format_i18n( $draft['word_count'] ) ); ?></td>
						<td>
							<?php if ( $draft['source_audit'] ) : ?>
								<code><?php echo esc_html( $draft['source_audit'] ); ?></code>
							<?php else : ?>
								<span><?php esc_html_e( 'Missing', 'justice-theme' ); ?></span>
							<?php endif; ?>
						</td>
						<td><?php echo esc_html( $status ); ?></td>
						<td>
							<?php if ( post_type_exists( 'articles' ) ) : ?>
								<a class="button" href="<?php echo esc_url( $url ); ?>"><?php esc_html_e( 'Import / refresh draft', 'justice-theme' ); ?></a>
							<?php else : ?>
								<span><?php esc_html_e( 'Blocked', 'justice-theme' ); ?></span>
							<?php endif; ?>
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	</div>
	<?php
}

function justice_theme_handle_content_draft_import(): void {
	if (
		! is_admin()
		|| ! current_user_can( 'manage_options' )
		|| empty( $_GET['action'] )
	) {
		return;
	}

	if ( 'justice_import_all_content_drafts' === $_GET['action'] ) {
		check_admin_referer( 'justice_import_all_content_drafts' );

		$result = justice_theme_import_all_repo_content_drafts();
		$args   = array(
			'page'                   => 'justice-content-drafts',
			'justice_import_result'  => $result['status'],
			'justice_import_message' => rawurlencode( $result['message'] ),
		);

		wp_safe_redirect( add_query_arg( $args, admin_url( 'tools.php' ) ) );
		exit;
	}

	if ( 'justice_import_content_draft' !== $_GET['action'] || empty( $_GET['file'] ) ) {
		return;
	}

	$file = sanitize_file_name( wp_unslash( $_GET['file'] ) );
	check_admin_referer( 'justice_import_content_draft_' . $file );

	$result = justice_theme_import_repo_content_draft( $file );
	$args   = array(
		'page'                    => 'justice-content-drafts',
		'justice_import_result'   => $result['status'],
		'justice_import_message'  => rawurlencode( $result['message'] ),
	);

	wp_safe_redirect( add_query_arg( $args, admin_url( 'tools.php' ) ) );
	exit;
}

function justice_theme_import_all_repo_content_drafts(): array {
	$drafts = justice_theme_get_repo_content_drafts();
	if ( empty( $drafts ) ) {
		return array( 'status' => 'blocked', 'message' => 'No repo content drafts were found.' );
	}

	$imported = 0;
	$blocked  = 0;
	$failed   = 0;

	foreach ( $drafts as $draft ) {
		$result = justice_theme_import_repo_content_draft( $draft['file'] );

		if ( 'success' === $result['status'] ) {
			++$imported;
			continue;
		}

		if ( 'blocked' === $result['status'] ) {
			++$blocked;
			continue;
		}

		++$failed;
	}

	$status = ( 0 === $failed && 0 === $blocked ) ? 'success' : 'blocked';

	return array(
		'status'  => $status,
		'message' => sprintf(
			'Bulk import finished. Imported/refreshed: %1$d. Blocked: %2$d. Failed: %3$d. All content remains draft-only.',
			$imported,
			$blocked,
			$failed
		),
	);
}

function justice_theme_get_repo_content_drafts(): array {
	$dir = function_exists( 'justice_theme_private_path' )
		? justice_theme_private_path( 'content-drafts' )
		: JUSTICE_THEME_DIR . '/content-drafts';

	if ( ! is_dir( $dir ) ) {
		return array();
	}

	$drafts = array();
	foreach ( glob( $dir . '/*.md' ) ?: array() as $path ) {
		$raw = file_get_contents( $path );
		if ( false === $raw ) {
			continue;
		}

		$drafts[] = array(
			'file'         => basename( $path ),
			'slug'         => justice_theme_extract_content_draft_slug( $raw, basename( $path, '.md' ) ),
			'title'        => justice_theme_extract_content_draft_title( $raw ),
			'status'       => justice_theme_extract_content_draft_field( $raw, 'Status', __( 'Unknown', 'justice-theme' ) ),
			'source_audit' => justice_theme_extract_content_draft_source_audit( $raw ),
			'word_count'   => justice_theme_count_content_draft_words( $raw ),
		);
	}

	usort(
		$drafts,
		static function ( $a, $b ) {
			return strcmp( $a['slug'], $b['slug'] );
		}
	);

	return $drafts;
}

function justice_theme_import_repo_content_draft( string $file ): array {
	if ( ! post_type_exists( 'articles' ) ) {
		return array( 'status' => 'blocked', 'message' => 'articles post type is not active.' );
	}

	$path = function_exists( 'justice_theme_private_path' )
		? justice_theme_private_path( 'content-drafts/' . sanitize_file_name( $file ) )
		: JUSTICE_THEME_DIR . '/content-drafts/' . sanitize_file_name( $file );
	if ( ! is_readable( $path ) ) {
		return array( 'status' => 'failed', 'message' => 'Draft file was not found.' );
	}

	$raw = file_get_contents( $path );
	if ( false === $raw ) {
		return array( 'status' => 'failed', 'message' => 'Draft file could not be read.' );
	}

	$slug         = justice_theme_extract_content_draft_slug( $raw, basename( $file, '.md' ) );
	$title        = justice_theme_extract_content_draft_title( $raw );
	$public_raw   = function_exists( 'justice_theme_strip_internal_publication_note' ) ? justice_theme_strip_internal_publication_note( $raw ) : $raw;
	$html         = justice_theme_markdown_draft_to_html( $public_raw );
	$draft_status = justice_theme_extract_content_draft_field( $raw, 'Status', 'UNKNOWN' );
	$source_audit = justice_theme_extract_content_draft_source_audit( $raw );
	$word_count   = justice_theme_count_content_draft_words( $raw );

	$existing = get_page_by_path( $slug, OBJECT, 'articles' );
	if ( $existing ) {
		$source_file = get_post_meta( $existing->ID, 'repo_content_draft_file', true );
		if ( $source_file && $source_file !== $file ) {
			return array( 'status' => 'blocked', 'message' => 'Existing article is linked to a different repo draft.' );
		}

		if ( 'draft' !== get_post_status( $existing ) ) {
			return array( 'status' => 'blocked', 'message' => 'Existing article is not draft; manual review required before refresh.' );
		}

		$post_id = wp_update_post( array(
			'ID'           => $existing->ID,
			'post_title'   => $title,
			'post_content' => $html,
			'post_status'  => 'draft',
		), true );
	} else {
		$post_id = wp_insert_post( array(
			'post_type'    => 'articles',
			'post_status'  => 'draft',
			'post_name'    => $slug,
			'post_title'   => $title,
			'post_content' => $html,
		), true );
	}

	if ( is_wp_error( $post_id ) ) {
		return array( 'status' => 'failed', 'message' => $post_id->get_error_message() );
	}

	update_post_meta( $post_id, 'content_status', 'production_draft_from_repo' );
	update_post_meta( $post_id, 'repo_content_draft_file', $file );
	update_post_meta( $post_id, 'repo_content_draft_status', $draft_status );
	update_post_meta( $post_id, 'repo_content_draft_word_count', (string) $word_count );
	update_post_meta( $post_id, 'repo_content_source_audit', $source_audit );
	if ( function_exists( 'justice_theme_extract_internal_publication_notes' ) ) {
		update_post_meta( $post_id, 'internal_editorial_notes', justice_theme_extract_internal_publication_notes( $raw ) );
	}
	update_post_meta( $post_id, 'needs_legal_review', '1' );
	update_post_meta( $post_id, 'needs_browser_source_verification', '1' );
	update_post_meta( $post_id, 'connected_lawyer_slug', justice_theme_extract_content_draft_field( $raw, 'Connected lawyer', '' ) );
	update_post_meta( $post_id, 'content_cluster', justice_theme_extract_content_draft_field( $raw, 'Cluster', '' ) );
	update_post_meta( $post_id, 'primary_keyword', justice_theme_extract_content_draft_field( $raw, 'Primary keyword', '' ) );
	update_post_meta( $post_id, 'source_note', 'Imported from repo content-drafts. Draft only; legal/editorial review required before publication.' );

	return array( 'status' => 'success', 'message' => 'Draft imported as article ID ' . (int) $post_id . '.' );
}

function justice_theme_extract_content_draft_slug( string $raw, string $fallback ): string {
	if ( preg_match( '/^Slug target:\s*`?\/?([^`\/\r\n]+)\/?`?/mi', $raw, $matches ) ) {
		return sanitize_title( $matches[1] );
	}

	return sanitize_title( $fallback );
}

function justice_theme_extract_content_draft_title( string $raw ): string {
	if ( preg_match( '/^#\s+(.+)$/m', $raw, $matches ) ) {
		return wp_strip_all_tags( trim( $matches[1] ) );
	}

	return __( 'Untitled legal draft', 'justice-theme' );
}

function justice_theme_extract_content_draft_field( string $raw, string $field, string $fallback = '' ): string {
	$pattern = '/^' . preg_quote( $field, '/' ) . ':\s*(.+)$/mi';
	if ( preg_match( $pattern, $raw, $matches ) ) {
		return sanitize_text_field( trim( wp_strip_all_tags( $matches[1] ), "` \t\n\r\0\x0B" ) );
	}

	return $fallback;
}

function justice_theme_extract_content_draft_source_audit( string $raw ): string {
	if ( preg_match( '/Source audit:\s*`?([^`\r\n]+)`?/mi', $raw, $matches ) ) {
		return sanitize_text_field( trim( $matches[1] ) );
	}

	return '';
}

function justice_theme_count_content_draft_words( string $raw ): int {
	$raw = preg_replace( '/^#.*$/m', '', $raw );
	$raw = preg_replace( '/^[-*]\s+/m', '', $raw );
	$raw = preg_replace( '/`([^`]+)`/', '$1', $raw );
	$raw = wp_strip_all_tags( $raw );
	$raw = preg_replace( '/\s+/u', ' ', trim( $raw ) );

	if ( '' === $raw ) {
		return 0;
	}

	return count( preg_split( '/\s+/u', $raw ) ?: array() );
}

function justice_theme_markdown_draft_to_html( string $raw ): string {
	$raw   = preg_replace( '/^Slug target:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Status:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Target length:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Connected .*$/mi', '', $raw );
	$raw   = preg_replace( '/^Cluster:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Primary keyword:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Secondary keywords:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Preferred editorial terminology:.*$/mi', '', $raw );
	$raw   = preg_replace( '/^Source audit:.*$/mi', '', $raw );
	$lines = preg_split( '/\r\n|\r|\n/', trim( $raw ) );
	$html  = '';
	$list  = false;

	foreach ( $lines as $line ) {
		$line = trim( $line );
		if ( '' === $line ) {
			if ( $list ) {
				$html .= "</ul>\n";
				$list  = false;
			}
			continue;
		}

		if ( preg_match( '/^###\s+(.+)$/', $line, $matches ) ) {
			if ( $list ) {
				$html .= "</ul>\n";
				$list  = false;
			}
			$html .= '<h3>' . esc_html( $matches[1] ) . "</h3>\n";
			continue;
		}

		if ( preg_match( '/^##\s+(.+)$/', $line, $matches ) ) {
			if ( $list ) {
				$html .= "</ul>\n";
				$list  = false;
			}
			$html .= '<h2>' . esc_html( $matches[1] ) . "</h2>\n";
			continue;
		}

		if ( preg_match( '/^#\s+(.+)$/', $line, $matches ) ) {
			// The "# " line is the post title (extracted separately); skip it in the
			// body so rendered articles do not carry a duplicate in-content <h1>.
			if ( $list ) {
				$html .= "</ul>\n";
				$list  = false;
			}
			continue;
		}

		if ( 0 === strpos( $line, '- ' ) ) {
			if ( ! $list ) {
				$html .= "<ul>\n";
				$list  = true;
			}
			$html .= '<li>' . justice_theme_markdown_inline_to_html( substr( $line, 2 ) ) . "</li>\n";
			continue;
		}

		if ( $list ) {
			$html .= "</ul>\n";
			$list  = false;
		}

		$html .= '<p>' . justice_theme_markdown_inline_to_html( $line ) . "</p>\n";
	}

	if ( $list ) {
		$html .= "</ul>\n";
	}

	return wp_kses_post( $html );
}

function justice_theme_markdown_inline_to_html( string $text ): string {
	$parts = preg_split( '/(\[[^\]\r\n]+\]\((?:\/[^)\s]*|https?:\/\/(?:www\.)?jus-tice\.co\.il\/[^)\s]*)\)|`\/[^`]+`)/u', $text, -1, PREG_SPLIT_DELIM_CAPTURE );
	if ( false === $parts ) {
		return esc_html( $text );
	}

	$html = '';
	foreach ( $parts as $part ) {
		if ( preg_match( '/^\[([^\]\r\n]+)\]\((\/[^)\s]*|https?:\/\/(?:www\.)?jus-tice\.co\.il\/[^)\s]*)\)$/u', $part, $matches ) ) {
			$label = trim( wp_strip_all_tags( $matches[1] ) );
			$url   = trim( $matches[2] );

			if ( 0 === strpos( $url, '/' ) ) {
				$url = home_url( '/' . trim( $url, '/' ) . '/' );
			}

			$html .= '<a href="' . esc_url( justice_theme_public_url( $url ) ) . '">' . esc_html( $label ) . '</a>';
			continue;
		}

		if ( preg_match( '/^`(\/[^`]+)`$/u', $part, $matches ) ) {
			$path  = '/' . trim( $matches[1], '/' ) . '/';
			$html .= '<a href="' . esc_url( home_url( $path ) ) . '">' . esc_html( $path ) . '</a>';
			continue;
		}

		// Allow a safe inline subset of HTML written directly in drafts
		// (<strong>, <em>, <a href> including external authority links).
		// Everything else is stripped; the final pass below is wp_kses_post.
		$html .= wp_kses(
			$part,
			array(
				'a'      => array( 'href' => true, 'title' => true, 'rel' => true, 'target' => true ),
				'strong' => array(),
				'em'     => array(),
				'b'      => array(),
				'i'      => array(),
			)
		);
	}

	return wp_kses_post( $html );
}
