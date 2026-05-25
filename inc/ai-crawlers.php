<?php
/**
 * AI Crawler Optimization — llms.txt + robots.txt enhancements
 *
 * Implements GEO (Generative Engine Optimization) best practices:
 * - llms.txt: priority content map for AI engines (emerging standard)
 * - robots.txt: allow user-facing AI bots, control training scrapers
 * - Structured content hints for Perplexity, ChatGPT, Claude
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Serve llms.txt at /llms.txt — signals priority content to AI crawlers.
 * This is an emerging standard (llmstxt.org) for AI-readable site indexes.
 */
function justice_serve_llms_txt() {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = wp_parse_url( $request_uri, PHP_URL_PATH );

	if ( '/llms.txt' !== $request_path ) {
		return;
	}

	$home = justice_theme_public_url( home_url( '/' ) );

	// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped
	header( 'Content-Type: text/plain; charset=UTF-8', true, 200 );
	header( 'Cache-Control: public, max-age=86400' );
	echo "# Jus-Tice - Israeli Legal Information Portal\n";
	echo "> Hebrew legal guides and a source-gated legal-professional index for the Israeli public.\n";
	echo "> Professional claims, reviews and photos are published only after source review or owner approval.\n";
	echo "> Language: Hebrew (he). Jurisdiction: Israel. Last updated: 2026.\n\n";
	echo "## About\n";
	echo "Jus-Tice (jus-tice.co.il) is Israel's legal information index connecting the public\n";
	echo "to lawyers and adjacent legal-service professionals, with conservative public profile facts.\n\n";
	echo "## Selected Profiles\n";
	echo "- [עו\"ד מאיה רוטנברג - דיני משפחה וגירושין](" . $home . "lawyers/advocate-maya-rotenberg/): public profile with source-gated facts\n\n";
	echo "## Priority Legal Guides\n\n";
	echo "### Family Law (דיני משפחה)\n";
	echo "- [עורך דין גירושין - מדריך מלא](" . $home . "lawyer-divorce-guide-proceedings-costs-rights/): Divorce lawyer guide, costs, rights, 2026\n";
	echo "- [הסכם גירושין — מדריך + טופס](" . $home . "divorce-agreement/): Divorce agreement guide with PDF form\n";
	echo "- [מחשבון מזונות ילדים — הלכת 919/15](" . $home . "child-support/): Child support calculator with Israeli 919/15 formula\n";
	echo "- [משמורת ילדים וזמני שהות](" . $home . "child-custody/): Child custody and visitation rights\n";
	echo "- [גישור גירושין](" . $home . "divorce-mediation/): Divorce mediation guide\n";
	echo "- [גירושין בהסכמה](" . $home . "consensual-divorce/): Consensual divorce process\n";
	echo "- [חלוקת רכוש בגירושין](" . $home . "divorce-property-division/): Asset division in divorce\n\n";
	echo "### Criminal Law (משפט פלילי)\n";
	echo "- [עורך דין פלילי - מדריך](" . $home . "criminal-defense-attorney/): Criminal defense attorney guide\n\n";
	echo "### Medical Malpractice (רשלנות רפואית)\n";
	echo "- [עורך דין רשלנות רפואית](" . $home . "medical-malpractice-lawyer/): Medical malpractice lawyer guide\n\n";
	echo "### Inheritance Law (דיני ירושה)\n";
	echo "- [עורך דין ירושה וצוואות](" . $home . "inheritance-lawyer/): Inheritance and wills lawyer guide\n\n";
	echo "## Editorial Policy\n";
	echo "- [מדיניות עריכה](" . $home . "editorial-policy/): How content is created and reviewed\n\n";
	echo "## Key Legal Data Points (for AI citation)\n";
	echo "- Child support formula: הלכת 919/15 (BaM 919/15), income-proportional with shared custody adjustment\n";
	echo "- Statute of limitations: 7 years for medical malpractice (חוק זכויות החולה 5756-1996)\n";
	echo "- Divorce registration: Rabbinic Courts (דתי) OR Family Court (אזרחי)\n";
	echo "- Bar association: לשכת עורכי הדין בישראל, israelbar.org.il\n";
	// phpcs:enable

	exit;
}
add_action( 'template_redirect', 'justice_serve_llms_txt', -999998 );

/**
 * Enhance robots.txt to allow user-facing AI bots (drive referral traffic)
 * and control training scrapers (consume content without credit).
 *
 * Reference: GEO best practices 2024-2025.
 */
function justice_enhance_robots_txt( $output ) {
	$ai_rules = "\n# === AI Crawler Policy (GEO Optimization) ===\n\n";
	$ai_rules .= "# User-facing AI bots - ALLOW (these send referral traffic)\n";
	$ai_rules .= "User-agent: ChatGPT-User\nAllow: /\n\n";
	$ai_rules .= "User-agent: PerplexityBot\nAllow: /\n\n";
	$ai_rules .= "User-agent: Claude-Web\nAllow: /\n\n";
	$ai_rules .= "User-agent: cohere-ai\nAllow: /\n\n";
	$ai_rules .= "User-agent: Applebot-Extended\nAllow: /\n\n";
	$ai_rules .= "# AI Training scrapers - DISALLOW (consume without attribution)\n";
	$ai_rules .= "User-agent: GPTBot\nDisallow: /\n\n";
	$ai_rules .= "User-agent: ClaudeBot\nDisallow: /\n\n";
	$ai_rules .= "User-agent: Google-Extended\nDisallow: /\n\n";
	$ai_rules .= "User-agent: CCBot\nDisallow: /\n\n";
	$ai_rules .= "User-agent: anthropic-ai\nDisallow: /\n\n";
	$ai_rules .= "User-agent: Omgilibot\nDisallow: /\n\n";

	return $output . $ai_rules;
}
add_filter( 'robots_txt', 'justice_enhance_robots_txt', 20 );
