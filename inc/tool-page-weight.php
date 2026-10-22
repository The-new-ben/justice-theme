<?php
/**
 * Performance (HAD-588): the co.il tool pages carry plugin scripts their instruments never use.
 *
 * Measured live on 22.10.2026 (headless Chrome, 390 px, CPU x4, 1.6 Mbps, cold cache): every tool page
 * moved about 1 MB, of which about 700 KB was JavaScript. Three plugin groups ride along with no use there:
 * - jsPDF 2.5.1 (cdnjs, ~94 KB), signature_pad 4.1.7 and the 1 KB `dwp-js` starter. The starter only acts
 *   when the page holds a `<canvas id="signature">`; no tool prints one.
 * - jQuery UI core + datepicker + its Hebrew locale block. The instruments are plain JavaScript with
 *   native date inputs; only a Gravity Forms date field (shortcode or `gravityforms/form` block) needs it.
 * - Search & Filter Pro (build + chosen, printed in the head, so they block the first paint). It serves a
 *   `[searchandfilter]` form, which no tool page holds.
 * A page keeps a group whenever its own content names what the group serves (a signature canvas, a Gravity
 * Form, a datepicker, a search form), so a page that mixes a tool with one of those keeps working.
 * The Autoptimize exclusion of `assets/js/tools/dist/` is untouched: the tool bundles load exactly as before.
 *
 * Also fixes the home-page dequeue in inc/enqueue.php, which names `signature_pad` while the plugin
 * registers `signature-pad` (and `dwp-js`), so those two never left the home page.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Shortcodes that print a co.il instrument into the post body. */
function justice_theme_tool_page_shortcodes(): array {
	return array( 'justice_tool', 'justice_tool_lead', 'justice_tools_command', 'justice_tool_section', 'justice_tools_index' );
}

/** The queried post's raw content when the request is a single page/article/post that hosts a tool, else null. */
function justice_theme_tool_page_content(): ?string {
	if ( is_admin() || ! is_singular() ) {
		return null;
	}
	$post = get_queried_object();
	if ( ! $post instanceof WP_Post ) {
		return null;
	}
	$content = (string) $post->post_content;
	foreach ( justice_theme_tool_page_shortcodes() as $tag ) {
		if ( false !== strpos( $content, '[' . $tag . ' ' ) || false !== strpos( $content, '[' . $tag . ']' ) ) {
			return $content;
		}
	}
	return null;
}

/**
 * Which plugin groups this tool page can drop. A group stays when the content names what it serves.
 *
 * @return array{signature: bool, datepicker: bool, search_filter: bool}
 */
function justice_theme_tool_page_drops( string $content ): array {
	$has = static function ( array $needles ) use ( $content ): bool {
		foreach ( $needles as $needle ) {
			if ( false !== stripos( $content, $needle ) ) {
				return true;
			}
		}
		return false;
	};
	return array(
		'signature'     => ! $has( array( 'signature', 'jspdf', '[dwp', '[digital' ) ),
		'datepicker'    => ! $has( array( '[gravityform', '[gravityforms', 'wp:gravityforms/', 'datepicker' ) ),
		'search_filter' => ! $has( array( '[searchandfilter', 'search-filter' ) ),
	);
}

/** Script handles of the signature/PDF group, with both spellings of the signature pad handle. */
function justice_theme_signature_script_handles(): array {
	return array( 'jspdf', 'signature-pad', 'signature_pad', 'dwp-js' );
}

function justice_theme_dequeue_signature_scripts(): void {
	foreach ( justice_theme_signature_script_handles() as $handle ) {
		wp_dequeue_script( $handle );
	}
}

/** Datepicker + its locale; jQuery UI core too unless something still queued depends on it. */
function justice_theme_dequeue_datepicker_scripts(): void {
	$scripts = wp_scripts();
	wp_dequeue_script( 'jquery-ui-datepicker' );
	foreach ( (array) $scripts->queue as $handle ) {
		if ( 'jquery-ui-core' !== $handle && 'jquery-ui-datepicker' !== $handle && justice_theme_script_depends_on( $scripts, (string) $handle, 'jquery-ui-core' ) ) {
			return;
		}
	}
	wp_dequeue_script( 'jquery-ui-core' );
}

/** Runs at enqueue time and again just before the head and footer print (plugins enqueue late). */
function justice_theme_dequeue_tool_page_bloat(): void {
	$content = justice_theme_tool_page_content();
	if ( null === $content ) {
		return;
	}
	$drops = justice_theme_tool_page_drops( $content );
	if ( $drops['signature'] ) {
		justice_theme_dequeue_signature_scripts();
	}
	if ( $drops['datepicker'] ) {
		justice_theme_dequeue_datepicker_scripts();
	}
	if ( $drops['search_filter'] ) {
		justice_theme_dequeue_search_filter_assets();
	}
}
add_action( 'wp_enqueue_scripts', 'justice_theme_dequeue_tool_page_bloat', 1000 );
add_action( 'wp_print_scripts', 'justice_theme_dequeue_tool_page_bloat', 1 );
add_action( 'wp_print_styles', 'justice_theme_dequeue_tool_page_bloat', 1 );
add_action( 'wp_print_footer_scripts', 'justice_theme_dequeue_tool_page_bloat', 1 );

/** Home page: the signature group under the handles the plugin really registers. */
function justice_theme_dequeue_home_signature_scripts(): void {
	if ( is_admin() || ! is_front_page() ) {
		return;
	}
	justice_theme_dequeue_signature_scripts();
}
add_action( 'wp_enqueue_scripts', 'justice_theme_dequeue_home_signature_scripts', 1000 );
add_action( 'wp_print_footer_scripts', 'justice_theme_dequeue_home_signature_scripts', 1 );

/**
 * Tool pages: open the Google Fonts connections early. main.css starts with an @import of the Assistant
 * family (the Hebrew text face), so the browser learns about fonts.googleapis.com only after the main
 * stylesheet arrives and about fonts.gstatic.com one round trip later. Two preconnects remove that wait.
 */
function justice_theme_tool_page_font_preconnect(): void {
	if ( null === justice_theme_tool_page_content() ) {
		return;
	}
	echo '<link rel="preconnect" href="https://fonts.googleapis.com" data-justice-theme="tool-weight">' . "\n";
	echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin data-justice-theme="tool-weight">' . "\n";
}
add_action( 'wp_head', 'justice_theme_tool_page_font_preconnect', 1 );
