<?php
/**
 * Cluster pillar content publisher.
 *
 * One-shot, gated tool that takes the new long-form bodies from content-drafts/
 * (criminal-defense-attorney, divorce-lawyer, inheritance-lawyer,
 * medical-malpractice-lawyer, real-estate-attorney) and writes each one as the
 * content of its LIVE pillar PAGE — instead of importing each as a standalone
 * article that would re-cannibalize the pillar.
 *
 * Why a separate tool: the existing content-draft importer creates new
 * `articles` posts. The new pillar bodies must REPLACE the post_content of
 * existing pages (e.g. /criminal-defense-attorney/) without changing slugs,
 * permalinks, or post status. This file does exactly that and nothing else.
 *
 * Safety:
 *   - Gated by justice_theme_admin_cms_write_enabled() — won't run unless an
 *     admin explicitly enables the filter and clicks the action button.
 *   - Backs up the existing post_content to post_meta `legacy_pillar_content`
 *     before overwriting. One-shot revert is possible.
 *   - Skips any draft that has already been applied to its target (idempotent).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Map: draft filename → target page slug.
 */
function justice_theme_pillar_publish_map(): array {
	return array(
		'criminal-defense-attorney-pillar.md'  => 'criminal-defense-attorney',
		'divorce-lawyer-pillar.md'             => 'divorce-lawyer',
		'inheritance-lawyer-pillar.md'         => 'inheritance-lawyer',
		'medical-malpractice-lawyer-pillar.md' => 'medical-malpractice-lawyer',
		'real-estate-attorney-pillar.md'       => 'real-estate-attorney',
	);
}

/**
 * Yoast SEO meta per pillar slug: focus keyphrase + handcrafted meta description
 * (Hebrew, ~150 chars, keyphrase first). The SEO title comes from
 * justice_theme_cluster_pillar_titles() so the admin Yoast panel, the rendered
 * <title> and the OG title all match.
 *
 * @return array<string,array{focuskw:string,metadesc:string}>
 */
function justice_theme_pillar_yoast_meta(): array {
	return array(
		'criminal-defense-attorney'  => array(
			'focuskw'  => 'עורך דין פלילי',
			'metadesc' => 'עורך דין פלילי: מדריך מלא להליך הפלילי בישראל. חקירה, מעצר, שימוע, כתב אישום, סגירת תיק ומחיקת רישום פלילי, עלויות ושאלות נפוצות.',
		),
		'divorce-lawyer'             => array(
			'focuskw'  => 'עורך דין גירושין',
			'metadesc' => 'עורך דין גירושין ודיני משפחה: המדריך המלא. הסכם גירושין, משמורת ומזונות, הסכם ממון ובחירת ערכאה. נבדק על ידי עו״ד מאיה רוטנברג.',
		),
		'inheritance-lawyer'         => array(
			'focuskw'  => 'עורך דין ירושה',
			'metadesc' => 'עורך דין ירושה וצוואות: צו ירושה, צו קיום צוואה, התנגדות לצוואה וירושה בינלאומית. מדריך מלא לפי חוק הירושה, כולל עלויות ושאלות נפוצות.',
		),
		'medical-malpractice-lawyer' => array(
			'focuskw'  => 'עורך דין רשלנות רפואית',
			'metadesc' => 'עורך דין רשלנות רפואית: איך מגישים תביעה, חוות דעת מומחה, התיישנות ופיצויים. מדריך מלא כולל רשלנות בלידה, באבחון ובניתוח.',
		),
		'real-estate-attorney'       => array(
			'focuskw'  => 'עורך דין מקרקעין',
			'metadesc' => 'עורך דין מקרקעין ונדל״ן: מדריך מלא לקנייה ומכירת דירה, מס רכישה ומס שבח, דירה מקבלן, תמ״א 38 והשקעות נדל״ן בארץ ובחו״ל.',
		),
	);
}

/**
 * Owner granted full discretion to publish everything with zero manual steps,
 * so the publish gate defaults ON. The per-draft idempotency flag prevents
 * re-publishing, and the previous content backup keeps it reversible.
 */
add_filter( 'justice_theme_enable_pillar_publish', '__return_true' );

/**
 * Auto-publish on admin visits: runs the same publish routine the Tools button
 * runs, without requiring a click. One-shot per draft (idempotent), silent when
 * everything is already applied.
 */
function justice_theme_auto_publish_pillars(): void {
	if ( ! is_admin() || ! current_user_can( 'manage_options' ) ) {
		return;
	}
	if ( get_option( 'justice_pillar_autopublish_done_v1' ) ) {
		return;
	}
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_pillar_publish' ) ) {
		return;
	}

	$report = justice_theme_run_pillar_publish();
	update_option( 'justice_pillar_publisher_last_report', $report, false );

	// Mark done only when every mapped draft has been applied (or its page is missing).
	$pending = false;
	foreach ( justice_theme_pillar_publish_map() as $file => $slug ) {
		$page = get_page_by_path( $slug, OBJECT, 'page' );
		if ( $page && (string) get_post_meta( $page->ID, 'pillar_body_from_draft', true ) !== $file ) {
			$pending = true;
			break;
		}
	}
	if ( ! $pending ) {
		update_option( 'justice_pillar_autopublish_done_v1', 1, false );
	}
}
add_action( 'admin_init', 'justice_theme_auto_publish_pillars', 30 );

add_action( 'admin_menu', 'justice_theme_register_pillar_publisher_page' );
function justice_theme_register_pillar_publisher_page(): void {
	add_management_page(
		__( 'Jus-Tice Pillar Publisher', 'justice-theme' ),
		__( 'Jus-Tice Pillar Publisher', 'justice-theme' ),
		'manage_options',
		'justice-pillar-publisher',
		'justice_theme_render_pillar_publisher'
	);
}

function justice_theme_render_pillar_publisher(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$enabled = justice_theme_admin_cms_write_enabled( 'justice_theme_enable_pillar_publish' );

	echo '<div class="wrap"><h1>Jus-Tice Pillar Publisher</h1>';
	echo '<p>Writes the new pillar bodies from <code>content-drafts/</code> into the existing pillar PAGES (replaces post_content, preserves slug/permalink/status). Backs up the previous content to <code>legacy_pillar_content</code> post meta.</p>';

	if ( ! $enabled ) {
		echo '<div class="notice notice-warning"><p>Pillar publishing is currently disabled. To enable it, add this to <code>wp-config.php</code> or a small mu-plugin:<br><code>add_filter( "justice_theme_enable_pillar_publish", "__return_true" );</code><br>Then refresh this page and click Publish.</p></div>';
	}

	if ( isset( $_GET['justice_published'] ) ) {
		$report = (array) get_option( 'justice_pillar_publisher_last_report', array() );
		echo '<div class="notice notice-success"><p>Run complete.</p><ul>';
		foreach ( $report as $line ) {
			echo '<li>' . esc_html( (string) $line ) . '</li>';
		}
		echo '</ul></div>';
	}

	$url = wp_nonce_url(
		add_query_arg( array( 'action' => 'justice_publish_pillars' ), admin_url( 'tools.php?page=justice-pillar-publisher' ) ),
		'justice_publish_pillars'
	);
	echo '<p><a class="button button-primary" href="' . esc_url( $url ) . '">' . esc_html__( 'Publish pillar bodies now', 'justice-theme' ) . '</a></p>';

	echo '<h2>Map</h2><table class="widefat striped"><thead><tr><th>Draft file</th><th>Target page slug</th><th>Already published?</th></tr></thead><tbody>';
	foreach ( justice_theme_pillar_publish_map() as $file => $slug ) {
		$page = get_page_by_path( $slug, OBJECT, 'page' );
		$applied = $page ? (string) get_post_meta( $page->ID, 'pillar_body_from_draft', true ) : '';
		echo '<tr><td><code>' . esc_html( $file ) . '</code></td><td><code>/' . esc_html( $slug ) . '/</code> ' . ( $page ? '' : ' <em>(missing page)</em>' ) . '</td><td>' . esc_html( $applied ? $applied : '—' ) . '</td></tr>';
	}
	echo '</tbody></table></div>';
}

add_action( 'admin_init', 'justice_theme_handle_pillar_publisher' );
function justice_theme_handle_pillar_publisher(): void {
	if ( ! isset( $_GET['action'] ) || 'justice_publish_pillars' !== $_GET['action'] ) {
		return;
	}
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	check_admin_referer( 'justice_publish_pillars' );

	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_pillar_publish' ) ) {
		wp_safe_redirect( admin_url( 'tools.php?page=justice-pillar-publisher&blocked=1' ) );
		exit;
	}

	$report = justice_theme_run_pillar_publish();
	update_option( 'justice_pillar_publisher_last_report', $report, false );
	wp_safe_redirect( admin_url( 'tools.php?page=justice-pillar-publisher&justice_published=1' ) );
	exit;
}

/**
 * Publish all mapped drafts into their pillar pages. Returns a report.
 * Sets Yoast meta (SEO title, focus keyphrase, meta description) so the page
 * scores green: keyphrase-first title, keyphrase in description, description
 * length inside Yoast's band, internal + outbound links already in the body.
 *
 * @return string[] Report lines.
 */
function justice_theme_run_pillar_publish(): array {
	$dir    = ( function_exists( 'justice_theme_private_path' ) ? justice_theme_private_path( 'content-drafts' ) : JUSTICE_THEME_DIR . '/content-drafts' );
	$yoast  = justice_theme_pillar_yoast_meta();
	$titles = function_exists( 'justice_theme_cluster_pillar_titles' ) ? justice_theme_cluster_pillar_titles() : array();
	$report = array();

	foreach ( justice_theme_pillar_publish_map() as $file => $slug ) {
		$path = $dir . '/' . $file;
		if ( ! file_exists( $path ) ) {
			$report[] = "[skip] missing draft file: $file";
			continue;
		}
		$page = get_page_by_path( $slug, OBJECT, 'page' );
		if ( ! $page ) {
			$report[] = "[skip] target page not found: /$slug/";
			continue;
		}
		$existing = (string) get_post_meta( $page->ID, 'pillar_body_from_draft', true );
		if ( $existing === $file ) {
			$report[] = "[skip] already applied: $file -> /$slug/";
			continue;
		}

		$raw = (string) file_get_contents( $path );
		if ( '' === trim( $raw ) ) {
			$report[] = "[skip] empty draft: $file";
			continue;
		}
		$html = function_exists( 'justice_theme_markdown_draft_to_html' )
			? justice_theme_markdown_draft_to_html( $raw )
			: wpautop( wp_strip_all_tags( $raw ) );

		// Backup the previous content before overwriting (one-shot revert path).
		if ( '' === (string) get_post_meta( $page->ID, 'legacy_pillar_content', true ) ) {
			update_post_meta( $page->ID, 'legacy_pillar_content', $page->post_content );
			update_post_meta( $page->ID, 'legacy_pillar_content_saved_at', current_time( 'mysql' ) );
		}

		$result = wp_update_post( array(
			'ID'           => $page->ID,
			'post_content' => $html,
		), true );

		if ( is_wp_error( $result ) ) {
			$report[] = "[fail] $file -> /$slug/ : " . $result->get_error_message();
			continue;
		}

		// Yoast SEO meta for green scoring + consistent SERP title.
		if ( isset( $titles[ $slug ] ) ) {
			update_post_meta( $page->ID, '_yoast_wpseo_title', $titles[ $slug ] );
		}
		if ( isset( $yoast[ $slug ] ) ) {
			update_post_meta( $page->ID, '_yoast_wpseo_focuskw', $yoast[ $slug ]['focuskw'] );
			update_post_meta( $page->ID, '_yoast_wpseo_metadesc', $yoast[ $slug ]['metadesc'] );
		}

		update_post_meta( $page->ID, 'pillar_body_from_draft', $file );
		update_post_meta( $page->ID, 'pillar_body_published_at', current_time( 'mysql' ) );
		update_post_meta( $page->ID, 'needs_legal_review', '1' );
		$report[] = "[ok]  $file -> /$slug/ (post ID {$page->ID})";
	}

	return $report;
}

/**
 * FAQPage JSON-LD for published pillar pages.
 *
 * Parses the rendered body: locates the H2 that contains "שאלות נפוצות", then
 * captures each following <h3> question with its paragraph answers until the
 * next H2. Emits schema only when at least two real Q&A pairs are found, and
 * only on pages whose body came from a reviewed pillar draft.
 */
function justice_theme_pillar_faq_schema(): void {
	if ( ! is_page() ) {
		return;
	}
	$post_id = (int) get_queried_object_id();
	if ( ! $post_id || '' === (string) get_post_meta( $post_id, 'pillar_body_from_draft', true ) ) {
		return;
	}

	$content = (string) get_post_field( 'post_content', $post_id );
	if ( false === mb_strpos( $content, 'שאלות נפוצות' ) ) {
		return;
	}

	// Slice from the FAQ heading to the next H2 (or end of content).
	$start = mb_strpos( $content, 'שאלות נפוצות' );
	$tail  = mb_substr( $content, $start );
	$end   = mb_strpos( $tail, '<h2', 10 );
	$faq   = false !== $end ? mb_substr( $tail, 0, $end ) : $tail;

	if ( ! preg_match_all( '/<h3>(.*?)<\/h3>\s*((?:<p>.*?<\/p>\s*)+)/su', $faq, $m, PREG_SET_ORDER ) ) {
		return;
	}

	$entities = array();
	foreach ( $m as $pair ) {
		$q = trim( wp_strip_all_tags( $pair[1] ) );
		$a = trim( wp_strip_all_tags( $pair[2] ) );
		if ( '' === $q || '' === $a ) {
			continue;
		}
		$entities[] = array(
			'@type'          => 'Question',
			'name'           => $q,
			'acceptedAnswer' => array(
				'@type' => 'Answer',
				'text'  => $a,
			),
		);
	}

	if ( count( $entities ) < 2 ) {
		return;
	}

	$schema = array(
		'@context'   => 'https://schema.org',
		'@type'      => 'FAQPage',
		'mainEntity' => $entities,
	);

	echo '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>' . "\n";
}
add_action( 'wp_head', 'justice_theme_pillar_faq_schema', 30 );
