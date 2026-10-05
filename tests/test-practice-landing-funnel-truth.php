<?php
declare(strict_types=1);

$template_path = dirname( __DIR__ ) . '/template-parts/content/practice-landing-page.php';
$template      = file_get_contents( $template_path );
$functions     = file_get_contents( dirname( __DIR__ ) . '/functions.php' );

if ( false === $template || false === $functions ) {
	throw new RuntimeException( 'Could not read the theme release sources.' );
}

function jt_funnel_assert( bool $condition, string $message ): void {
	if ( ! $condition ) {
		throw new RuntimeException( $message );
	}
}

jt_funnel_assert(
	1 === substr_count( $template, "justice_theme_get_practice_firms( \$term_slug, 6 )" ),
	'The approved practice-firm list must be calculated exactly once.'
);

jt_funnel_assert(
	false !== strpos( $template, '$has_area_lawyers = ! empty( $area_lawyer_posts );' ),
	'The template does not expose an approved-area-lawyer truth flag.'
);

$hero_start = strpos( $template, '<div class="legal-pillar-hero__actions">' );
$hero_end   = false === $hero_start ? false : strpos( $template, '</div>', $hero_start );
$hero_html  = false === $hero_start || false === $hero_end
	? ''
	: substr( $template, $hero_start, $hero_end - $hero_start );

jt_funnel_assert(
	false !== strpos( $hero_html, '<?php if ( $has_area_lawyers ) : ?>' ),
	'The Hero directory CTA is not guarded by approved area profiles.'
);

jt_funnel_assert(
	false !== strpos( $hero_html, 'חיפוש עורכי דין בתחום' ),
	'The guarded Hero directory CTA is missing.'
);

$bottom_start = strpos( $template, '<section class="practice-hub-cta section">' );
$bottom_html  = false === $bottom_start ? '' : substr( $template, $bottom_start );

jt_funnel_assert(
	false !== strpos( $bottom_html, '<?php if ( $has_area_lawyers ) : ?>' )
		&& false !== strpos( $bottom_html, 'חיפוש עורכי דין' ),
	'The bottom directory CTA is not guarded by approved area profiles.'
);

jt_funnel_assert(
	false !== strpos( $template, 'הפנייה נשלחת דרך Jus-Tice לצורך מיון ראשוני ובדיקת התאמה' ),
	'The lead-form transparency disclosure is missing.'
);

jt_funnel_assert(
	false !== strpos( $functions, "define( 'JUSTICE_DEPLOY_MARKER', '2026-10-05-criminal-funnel-truth-v1' );" ),
	'The criminal funnel release marker is missing.'
);

echo "practice landing funnel truth tests passed\n";
