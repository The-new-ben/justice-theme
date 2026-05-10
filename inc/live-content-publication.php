<?php
/**
 * Owner-approved live publication for repo-maintained SEO clusters.
 *
 * This is intentionally narrow and idempotent. It publishes only the approved
 * family-law draft files to short English root URLs so they can be reviewed on
 * the live site after GitHub/uPress sync.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'JUSTICE_THEME_FAMILY_CLUSTER_PUBLICATION_VERSION', '2026-05-10-family-cluster-v2-public-safe' );
define( 'JUSTICE_THEME_ENABLE_AUTO_FAMILY_CLUSTER_PUBLICATION', false );

/**
 * Register SEO/AEO/GEO meta for public content pages.
 */
function justice_theme_register_publication_meta(): void {
	$fields = array(
		'content_status',
		'content_cluster',
		'primary_keyword',
		'secondary_keywords',
		'connected_lawyer_slug',
		'seo_title',
		'seo_description',
		'aeo_summary',
		'geo_summary',
		'repo_content_draft_file',
		'repo_content_draft_status',
		'repo_content_draft_word_count',
		'repo_content_source_audit',
		'justice_publication_version',
		'justice_publication_notes',
	);

	foreach ( $fields as $field ) {
		register_post_meta( 'page', $field, array(
			'show_in_rest'  => true,
			'single'        => true,
			'type'          => 'string',
			'auth_callback' => static function () {
				return current_user_can( 'edit_pages' );
			},
		) );
	}
}
add_action( 'init', 'justice_theme_register_publication_meta' );

/**
 * Publish the approved first family-law content cluster.
 */
function justice_theme_publish_owner_approved_family_cluster(): void {
	if ( ! JUSTICE_THEME_ENABLE_AUTO_FAMILY_CLUSTER_PUBLICATION ) {
		return;
	}

	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return;
	}

	if ( get_option( 'justice_family_cluster_publication_version' ) === JUSTICE_THEME_FAMILY_CLUSTER_PUBLICATION_VERSION ) {
		return;
	}

	justice_theme_run_family_cluster_publication( false );
}
add_action( 'init', 'justice_theme_publish_owner_approved_family_cluster', 40 );

/**
 * Admin-only manual publication action for cache/plugin cases where front-end
 * one-time publishing does not execute after deployment.
 */
function justice_theme_handle_family_cluster_publication_action(): void {
	if (
		! is_admin()
		|| ! current_user_can( 'manage_options' )
		|| empty( $_GET['action'] )
		|| 'justice_publish_family_cluster' !== sanitize_key( wp_unslash( $_GET['action'] ) )
	) {
		return;
	}

	check_admin_referer( 'justice_publish_family_cluster' );

	$result  = justice_theme_run_family_cluster_publication( true );
	$message = sprintf(
		'Family cluster publication finished. Published: %1$d. Blocked: %2$d.',
		count( $result['published'] ),
		count( $result['blocked'] )
	);

	wp_safe_redirect(
		add_query_arg(
			array(
				'page'                           => 'justice-content-drafts',
				'justice_family_publish_result'  => empty( $result['blocked'] ) ? 'success' : 'blocked',
				'justice_family_publish_message' => rawurlencode( $message ),
			),
			admin_url( 'tools.php' )
		)
	);
	exit;
}
add_action( 'admin_init', 'justice_theme_handle_family_cluster_publication_action' );

/**
 * Run the family cluster publication.
 *
 * @param bool $force Force rerun even if the current version is recorded.
 * @return array{published:array,blocked:array}
 */
function justice_theme_run_family_cluster_publication( bool $force = false ): array {
	if ( ! $force && get_option( 'justice_family_cluster_publication_version' ) === JUSTICE_THEME_FAMILY_CLUSTER_PUBLICATION_VERSION ) {
		return get_option(
			'justice_family_cluster_publication_result',
			array(
				'published' => array(),
				'blocked'   => array(),
			)
		);
	}

	$items = justice_theme_get_owner_approved_family_cluster();
	if ( empty( $items ) ) {
		return array(
			'published' => array(),
			'blocked'   => array( 'No publication items configured.' ),
		);
	}

	$preflight = justice_theme_family_cluster_publication_preflight( $items );
	if ( ! empty( $preflight['blocked'] ) ) {
		update_option(
			'justice_family_cluster_publication_result',
			array(
				'time'      => current_time( 'mysql' ),
				'published' => array(),
				'blocked'   => $preflight['blocked'],
			),
			false
		);

		return array(
			'published' => array(),
			'blocked'   => $preflight['blocked'],
		);
	}

	$published = array();
	$blocked   = array();

	foreach ( $items as $slug => $item ) {
		$result = justice_theme_publish_family_cluster_page( $slug, $item, $items );
		if ( is_wp_error( $result ) ) {
			$blocked[] = $slug . ': ' . $result->get_error_message();
			continue;
		}

		$published[] = $slug;
	}

	update_option(
		'justice_family_cluster_publication_version',
		JUSTICE_THEME_FAMILY_CLUSTER_PUBLICATION_VERSION,
		false
	);
	update_option(
		'justice_family_cluster_publication_result',
		array(
			'time'      => current_time( 'mysql' ),
			'published' => $published,
			'blocked'   => $blocked,
		),
		false
	);

	return array(
		'published' => $published,
		'blocked'   => $blocked,
	);
}

/**
 * Get the approved publication map.
 *
 * @return array<string,array<string,string>>
 */
function justice_theme_get_owner_approved_family_cluster(): array {
	return array(
		'divorce-lawyer' => array(
			'file'          => 'divorce-lawyer-pillar-he.md',
			'role'          => 'pillar',
			'title'         => 'עורך דין גירושין: מדריך עומק לבחירה נכונה, תהליך, עלויות, ילדים ורכוש',
			'keyword'       => 'עורך דין גירושין',
			'cluster_label' => 'משפחה וגירושין',
			'description'   => 'מדריך עומק למי שמחפש עורך דין גירושין: שלבי התהליך, בחירת עורך דין, ילדים, מזונות, רכוש, הסכמים, גישור ופנייה מסודרת לעורך דין מתאים.',
			'aeo'           => 'העמוד עונה על שאלות מעשיות של משתמשים לפני פנייה לעורך דין גירושין: מתי לפנות, מה להכין, איך לבחור, ומה ההבדל בין הסכם, גישור והליך משפטי.',
			'geo'           => 'Jus-Tice מרכז מידע משפטי בעברית, קישורי המשך, פרופיל עורכת דין משפחה וקריאה לפנייה מסודרת בתחום גירושין ודיני משפחה בישראל.',
		),
		'consensual-divorce' => array(
			'file'          => 'consensual-divorce-supporting-he.md',
			'role'          => 'supporting',
			'title'         => 'גירושין בהסכמה: איך בונים הסכם שמחזיק לאורך זמן',
			'keyword'       => 'גירושין בהסכמה',
			'cluster_label' => 'משפחה וגירושין',
			'description'   => 'מדריך לגירושין בהסכמה: מה צריך לכלול בהסכם, איך מזהים סיכונים, מה לבדוק לפני חתימה ומתי חשוב לערב עורך דין לענייני משפחה.',
			'aeo'           => 'העמוד מסביר מתי גירושין בהסכמה מתאימים, אילו נושאים חייבים להיכלל בהסכם ומהם סימני האזהרה שמצדיקים ייעוץ משפטי.',
			'geo'           => 'עמוד תמיכה בתוך אשכול גירושין של Jus-Tice, מקושר לעמוד עורך דין גירושין, למדריכי מזונות, משמורת, גישור וחלוקת רכוש.',
		),
		'divorce-mediation' => array(
			'file'          => 'divorce-mediation-supporting-he.md',
			'role'          => 'supporting',
			'title'         => 'גישור גירושין: מתי זה נכון, איך מתכוננים ומה חשוב לבדוק',
			'keyword'       => 'גישור גירושין',
			'cluster_label' => 'משפחה וגירושין',
			'description'   => 'מדריך לגישור גירושין: התאמת המסלול, הכנה לפגישות, גבולות הגישור, סיכונים, ילדים ורכוש, והנקודה שבה כדאי לערב עורך דין.',
			'aeo'           => 'העמוד עונה על שאלות סביב התאמה לגישור, הכנה, סודיות, פערי כוח בין צדדים והבדל בין מגשר לבין ייעוץ משפטי אישי.',
			'geo'           => 'עמוד תמיכה באשכול משפחה וגירושין, עם קישור לעמוד הגירושין המרכזי ולמסלולי הסכם, מזונות, משמורת ורכוש.',
		),
		'child-support' => array(
			'file'          => 'child-support-supporting-he.md',
			'role'          => 'supporting',
			'title'         => 'מזונות ילדים: מדריך מעשי לפני הסכם, תביעה או שינוי מצב',
			'keyword'       => 'מזונות ילדים',
			'cluster_label' => 'משפחה וגירושין',
			'description'   => 'מדריך עומק בנושא מזונות ילדים: מסמכים, הוצאות, זמני שהות, מדור, שינוי נסיבות, אכיפה וסימנים שמצריכים ייעוץ משפטי.',
			'aeo'           => 'העמוד מסביר איך להתכונן לשאלת מזונות ילדים בלי להציג מחשבון מזונות מזויף או הבטחות מספריות לא מבוססות.',
			'geo'           => 'עמוד תמיכה באשכול גירושין, מחובר לעמוד עורך דין גירושין, למשמורת, גישור, הסכם וחלוקת רכוש.',
		),
		'child-custody' => array(
			'file'          => 'child-custody-supporting-he.md',
			'role'          => 'supporting',
			'title'         => 'משמורת ילדים וזמני שהות: איך מתכננים הסדר שמתאים לילדים',
			'keyword'       => 'משמורת ילדים',
			'cluster_label' => 'משפחה וגירושין',
			'description'   => 'מדריך למשמורת ילדים, אחריות הורית וזמני שהות: לוחות זמנים, חגים, תקשורת בין הורים, מעבר מקום, סיכונים ומתי לפנות לעורך דין.',
			'aeo'           => 'העמוד עונה על שאלות של הורים סביב זמני שהות, אחריות הורית, טובת הילד, אכיפה, שינוי הסדרים ומצבי דחיפות.',
			'geo'           => 'עמוד תמיכה באשכול משפחה וגירושין, מקושר לעמוד הגירושין המרכזי ולמדריכי מזונות, גישור והסכם.',
		),
		'divorce-property-division' => array(
			'file'          => 'divorce-property-division-supporting-he.md',
			'role'          => 'supporting',
			'title'         => 'חלוקת רכוש בגירושין: נכסים, חובות, דירה, פנסיה ועסק משפחתי',
			'keyword'       => 'חלוקת רכוש בגירושין',
			'cluster_label' => 'משפחה וגירושין',
			'description'   => 'מדריך לחלוקת רכוש בגירושין: מיפוי נכסים וחובות, דירה, פנסיה, עסק, מתנות, ירושות, הסכמים והכנה לפגישה עם עורך דין.',
			'aeo'           => 'העמוד מסביר אילו מסמכים צריך לאסוף, מהן נקודות הסיכון בחלוקת רכוש, ומתי נדרש ליווי משפטי או מומחה כלכלי.',
			'geo'           => 'עמוד תמיכה באשכול גירושין המחבר רכוש, מזונות, משמורת, גישור והסכמים לתמונה אחת מסודרת.',
		),
		'family-dispute-resolution' => array(
			'file'          => 'family-dispute-resolution-supporting-he.md',
			'role'          => 'supporting',
			'title'         => 'יישוב סכסוך במשפחה: מה קורה לפני תביעה ומה צריך להכין',
			'keyword'       => 'בקשה ליישוב סכסוך',
			'cluster_label' => 'משפחה וגירושין',
			'description'   => 'מדריך לתהליך יישוב סכסוך במשפחה: פתיחת הליך, הכנה לפגישה, מצבי דחיפות, קשר לגירושין בהסכמה ומתי צריך עורך דין.',
			'aeo'           => 'העמוד עונה על שאלות סביב יישוב סכסוך לפני תביעה, כולל הכנה, מסמכים, יחידות סיוע, חריגים ודחיפות.',
			'geo'           => 'עמוד תמיכה באשכול משפחה וגירושין, מחובר לעמוד הגירושין המרכזי ולמדריכי הסכם, גישור, ילדים ורכוש.',
		),
	);
}

/**
 * Publish one root SEO page from a repo draft.
 *
 * @param string $slug Slug.
 * @param array  $item Item config.
 * @param array  $all_items All cluster items.
 * @return int|WP_Error
 */
function justice_theme_publish_family_cluster_page( string $slug, array $item, array $all_items ) {
	$file = sanitize_file_name( $item['file'] ?? '' );
	$path = JUSTICE_THEME_DIR . '/content-drafts/' . $file;

	if ( '' === $file || ! is_readable( $path ) ) {
		return new WP_Error( 'missing_draft', 'Draft file is missing: ' . $file );
	}

	$raw = file_get_contents( $path );
	if ( false === $raw ) {
		return new WP_Error( 'unreadable_draft', 'Draft file could not be read: ' . $file );
	}

	$title        = $item['title'] ?: justice_theme_extract_content_draft_title( $raw );
	$word_count   = function_exists( 'justice_theme_count_content_draft_words' ) ? justice_theme_count_content_draft_words( $raw ) : 0;
	$draft_status = function_exists( 'justice_theme_extract_content_draft_field' ) ? justice_theme_extract_content_draft_field( $raw, 'Status', '' ) : '';
	$source_audit = function_exists( 'justice_theme_extract_content_draft_source_audit' ) ? justice_theme_extract_content_draft_source_audit( $raw ) : '';
	$html         = justice_theme_prepare_family_cluster_html( $raw, $slug, $item, $all_items );
	$topics       = justice_theme_build_family_cluster_topics_meta( $slug, $all_items );
	$existing     = get_page_by_path( $slug, OBJECT, 'page' );

	$meta = array(
		'_wp_page_template'           => 'page-legal-pillar.php',
		'pillar_keyword'              => $item['keyword'],
		'pillar_cluster'              => $item['cluster_label'],
		'pillar_summary'              => $item['description'],
		'pillar_lawyer_area'          => 'family-law',
		'pillar_legaltech_url'        => '/legal-tools/ai-intake/',
		'pillar_supporting_topics'    => $topics,
		'content_status'              => 'owner_approved_live_review',
		'content_cluster'             => 'family-law',
		'primary_keyword'             => $item['keyword'],
		'secondary_keywords'          => justice_theme_build_family_cluster_secondary_keywords( $slug, $all_items ),
		'connected_lawyer_slug'       => 'advocate-maya-rotenberg',
		'seo_title'                   => justice_theme_publication_trim_text( $title . ' | Jus-Tice', 68 ),
		'seo_description'             => $item['description'],
		'aeo_summary'                 => $item['aeo'],
		'geo_summary'                 => $item['geo'],
		'repo_content_draft_file'     => $file,
		'repo_content_draft_status'   => $draft_status,
		'repo_content_draft_word_count' => (string) $word_count,
		'repo_content_source_audit'   => $source_audit,
		'justice_publication_version' => JUSTICE_THEME_FAMILY_CLUSTER_PUBLICATION_VERSION,
		'justice_publication_notes'   => 'Published from repo after owner approved live review. Hebrew content with short English slug. Review on live site and refine in CMS as needed.',
	);

	if ( $existing ) {
		if ( ! get_post_meta( $existing->ID, 'justice_pre_publication_backup_content_v1', true ) ) {
			update_post_meta( $existing->ID, 'justice_pre_publication_backup_content_v1', $existing->post_content );
			update_post_meta( $existing->ID, 'justice_pre_publication_backup_title_v1', $existing->post_title );
			update_post_meta( $existing->ID, 'justice_pre_publication_backup_status_v1', $existing->post_status );
		}

		$post_id = wp_update_post( array(
			'ID'           => $existing->ID,
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_name'    => $slug,
			'post_title'   => $title,
			'post_excerpt' => $item['description'],
			'post_content' => $html,
		), true );
	} else {
		$post_id = wp_insert_post( array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_name'    => $slug,
			'post_title'   => $title,
			'post_excerpt' => $item['description'],
			'post_content' => $html,
		), true );
	}

	if ( is_wp_error( $post_id ) ) {
		return $post_id;
	}

	foreach ( $meta as $key => $value ) {
		update_post_meta( (int) $post_id, $key, $value );
	}

	return (int) $post_id;
}

/**
 * Verify public-publication gates before anything can be written live.
 *
 * @param array $items Publication map.
 * @return array{blocked:array}
 */
function justice_theme_family_cluster_publication_preflight( array $items ): array {
	$blocked = array();
	$review  = justice_theme_read_publication_cannibalization_statuses();

	foreach ( $items as $slug => $item ) {
		$status = $review[ $slug ]['status'] ?? '';
		$action = $review[ $slug ]['recommended_action'] ?? '';

		if ( ! in_array( $status, array( 'APPROVED_FOR_PUBLICATION', 'APPROVED_FOR_UPDATE', 'APPROVED_FOR_MERGE' ), true ) ) {
			$blocked[] = $slug . ': publication-cannibalization-check.csv status is not approved (' . ( $status ?: 'missing' ) . ').';
			continue;
		}

		if ( in_array( $action, array( 'DO_NOT_PUBLISH_DUPLICATE', 'NEEDS_OWNER_REVIEW' ), true ) ) {
			$blocked[] = $slug . ': recommended action blocks publication (' . $action . ').';
			continue;
		}

		$file = sanitize_file_name( $item['file'] ?? '' );
		$path = JUSTICE_THEME_DIR . '/content-drafts/' . $file;
		if ( ! is_readable( $path ) ) {
			$blocked[] = $slug . ': draft file is missing.';
			continue;
		}

		$raw = file_get_contents( $path );
		if ( false === $raw ) {
			$blocked[] = $slug . ': draft file could not be read.';
			continue;
		}

		$public_raw = justice_theme_strip_internal_publication_note( $raw );
		$markers    = justice_theme_detect_public_content_internal_markers( $public_raw );
		if ( ! empty( $markers ) ) {
			$blocked[] = $slug . ': public-content safety markers remain: ' . implode( ', ', array_slice( $markers, 0, 4 ) );
		}
	}

	return array( 'blocked' => $blocked );
}

/**
 * Read approved publication statuses from project-control.
 *
 * @return array<string,array<string,string>>
 */
function justice_theme_read_publication_cannibalization_statuses(): array {
	$path = JUSTICE_THEME_DIR . '/project-control/publication-cannibalization-check.csv';
	if ( ! is_readable( $path ) ) {
		return array();
	}

	$handle = fopen( $path, 'r' );
	if ( ! $handle ) {
		return array();
	}

	$headers = fgetcsv( $handle );
	if ( empty( $headers ) ) {
		fclose( $handle );
		return array();
	}

	$rows = array();
	while ( false !== ( $row = fgetcsv( $handle ) ) ) {
		$record = array();
		foreach ( $headers as $index => $header ) {
			$record[ $header ] = $row[ $index ] ?? '';
		}

		$slug = sanitize_title( $record['proposed_slug'] ?? '' );
		if ( $slug ) {
			$rows[ $slug ] = $record;
		}
	}

	fclose( $handle );

	return $rows;
}

/**
 * Convert a draft into public-safe page HTML and add cluster links.
 *
 * @param string $raw Raw Markdown.
 * @param string $slug Current slug.
 * @param array  $item Item config.
 * @param array  $all_items All cluster items.
 * @return string
 */
function justice_theme_prepare_family_cluster_html( string $raw, string $slug, array $item, array $all_items ): string {
	$raw = justice_theme_strip_internal_publication_note( $raw );
	$markers = justice_theme_detect_public_content_internal_markers( $raw );
	if ( ! empty( $markers ) ) {
		return '';
	}

	$html = function_exists( 'justice_theme_markdown_draft_to_html' )
		? justice_theme_markdown_draft_to_html( $raw )
		: wpautop( esc_html( $raw ) );

	$cluster_links = justice_theme_render_family_cluster_links_html( $slug, $all_items );
	$disclaimer    = '<div class="justice-public-disclaimer"><strong>חשוב לדעת:</strong> המידע בעמוד הוא מידע כללי בלבד, אינו ייעוץ משפטי ואינו מחליף בדיקה פרטנית של עורך דין מוסמך. לפני קבלת החלטה משפטית יש להתייעץ עם גורם מקצועי מתאים.</div>';
	$lawyer_cta    = '<div class="justice-content-lawyer-cta"><h2>רוצים להבין איזה מסלול מתאים למקרה שלכם?</h2><p>אפשר להשאיר פנייה מסודרת דרך Jus-Tice. הפנייה תעזור לסווג את תחום הבעיה, הדחיפות והמסמכים הרלוונטיים לפני שיחה עם עורך דין.</p><p><a class="button button--gold" href="#lead-form">השארת פנייה משפטית מסודרת</a> <a class="button button--ghost" href="' . esc_url( home_url( '/lawyers/?area=family-law' ) ) . '">עורכי דין בתחום משפחה</a></p></div>';

	return wp_kses_post( $cluster_links . $html . $lawyer_cta . $disclaimer );
}

/**
 * Strip internal editor-only "before publication" blocks from public content.
 *
 * @param string $raw Raw Markdown.
 * @return string
 */
function justice_theme_strip_internal_publication_note( string $raw ): string {
	$lines      = preg_split( '/\r\n|\r|\n/', $raw );
	$kept       = array();
	$skip_block = false;

	foreach ( $lines as $line ) {
		if ( preg_match( '/^##\s+(.+)$/u', $line, $matches ) ) {
			$heading    = trim( wp_strip_all_tags( $matches[1] ) );
			$skip_block = justice_theme_is_internal_publication_heading( $heading );
			if ( $skip_block ) {
				continue;
			}
		}

		if ( $skip_block ) {
			continue;
		}

		if ( justice_theme_is_internal_publication_line( $line ) ) {
			continue;
		}

		$kept[] = $line;
	}

	return implode( "\n", $kept );
}

/**
 * Determine whether a Markdown section is internal-only.
 *
 * @param string $heading Heading.
 * @return bool
 */
function justice_theme_is_internal_publication_heading( string $heading ): bool {
	$patterns = array(
		'לפני פרסום',
		'לפני פירסום',
		'סטטוס',
		'פעולות המשך',
		'קניבליזציה',
		'קניבל',
		'מבנה CMS',
		'גרסת CMS',
		'מערכת Jus-Tice',
		'תפקיד Jus-Tice',
		'איך Jus-Tice',
		'קלוט ליד',
		'לקלוט ליד',
		'CRM',
		'LegalTech',
		'מדדי הצלחה',
		'שערי בדיקה',
		'חסמי פרסום',
		'קישורים פנימיים נדרשים',
		'קישורים פנימיים מתוכננים',
		'מקורות ראשוניים',
		'מקורות ותחרות',
		'מיני-סייט',
		'mini-site',
		'publication',
		'pre-publication',
		'source audit',
	);

	foreach ( $patterns as $pattern ) {
		if ( false !== stripos( $heading, $pattern ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Determine whether one line is internal-only.
 *
 * @param string $line Line.
 * @return bool
 */
function justice_theme_is_internal_publication_line( string $line ): bool {
	$patterns = array(
		'NOT VERIFIED',
		'VERIFIED:',
		'BLOCKED:',
		'READY NEXT',
		'PARTIAL:',
		'Next action',
		'project-control/',
		'Source audit:',
		'Legal review',
		'source review',
		'GSC',
		'Tools > Jus-Tice',
	);

	foreach ( $patterns as $pattern ) {
		if ( false !== stripos( $line, $pattern ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Find internal markers that must never reach public article content.
 *
 * @param string $content Content.
 * @return array
 */
function justice_theme_detect_public_content_internal_markers( string $content ): array {
	$markers = array();
	$patterns = array(
		'NOT VERIFIED',
		'BLOCKED:',
		'READY NEXT',
		'project-control/',
		'Source audit:',
		'סטטוס לפני פרסום',
		'פעולות המשך לפני פרסום',
		'חסמי פרסום',
		'מבנה CMS',
		'גרסת CMS',
		'CRM',
		'GSC',
		'קניבליזציה',
		'מדדי הצלחה לעמוד',
	);

	foreach ( $patterns as $pattern ) {
		if ( false !== stripos( $content, $pattern ) ) {
			$markers[] = $pattern;
		}
	}

	return array_values( array_unique( $markers ) );
}

/**
 * Render a public cluster link module.
 *
 * @param string $current_slug Current slug.
 * @param array  $all_items Cluster items.
 * @return string
 */
function justice_theme_render_family_cluster_links_html( string $current_slug, array $all_items ): string {
	$links = '';

	foreach ( $all_items as $slug => $item ) {
		if ( $slug === $current_slug ) {
			continue;
		}

		$links .= '<a href="' . esc_url( home_url( '/' . $slug . '/' ) ) . '"><span>' . esc_html( $item['keyword'] ) . '</span><small>' . esc_html( 'מדריך קשור' ) . '</small></a>';
	}

	return '<nav class="justice-public-cluster" aria-label="אשכול תוכן משפחה וגירושין"><strong>מסלול קריאה באשכול משפחה וגירושין</strong><div>' . $links . '</div></nav>';
}

/**
 * Build the Legal Pillar Page topics meta from cluster items.
 *
 * @param string $current_slug Current slug.
 * @param array  $all_items Cluster items.
 * @return string
 */
function justice_theme_build_family_cluster_topics_meta( string $current_slug, array $all_items ): string {
	$topics = array();

	foreach ( $all_items as $slug => $item ) {
		if ( $slug === $current_slug ) {
			continue;
		}

		$topics[] = $item['keyword'] . ' | /' . $slug . '/';
	}

	return implode( "\n", $topics );
}

/**
 * Build secondary-keyword meta from sibling topics.
 *
 * @param string $current_slug Current slug.
 * @param array  $all_items Cluster items.
 * @return string
 */
function justice_theme_build_family_cluster_secondary_keywords( string $current_slug, array $all_items ): string {
	$keywords = array();

	foreach ( $all_items as $slug => $item ) {
		if ( $slug !== $current_slug ) {
			$keywords[] = $item['keyword'];
		}
	}

	return implode( ', ', $keywords );
}

/**
 * Trim text without requiring mbstring.
 *
 * @param string $text Text.
 * @param int    $length Length.
 * @return string
 */
function justice_theme_publication_trim_text( string $text, int $length ): string {
	if ( function_exists( 'mb_substr' ) ) {
		return mb_substr( $text, 0, $length );
	}

	return substr( $text, 0, $length );
}
