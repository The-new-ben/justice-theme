<?php
/**
 * "How it works" — three-pathway intent routing strip.
 *
 * Sits immediately below the hero. Solves the "who is this for?" question
 * in three seconds by giving every visitor an obvious path:
 *   1. Find a lawyer (consumer)
 *   2. Read legal information (researcher)
 *   3. Join as a lawyer (B2B)
 *
 * Modeled on Avvo's three-card routing block but with stronger Hebrew
 * intent labels and explicit lawyer-facing CTA.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$lawyers_url    = get_post_type_archive_link( 'justice_lawyer' ) ?: home_url( '/lawyers/' );
$articles_url   = get_post_type_archive_link( 'articles' ) ?: home_url( '/articles/' );
$registration   = home_url( '/lawyer-registration/' );
$plans          = home_url( '/lawyer-plans/' );

$pathways = array(
	array(
		'icon'        => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="32" height="32" aria-hidden="true"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
		'eyebrow'     => __( 'למחפשים עורך דין', 'justice-theme' ),
		'title'       => __( 'מצאו עורך דין מומחה', 'justice-theme' ),
		'description' => __( 'חיפוש לפי תחום משפטי ועיר. רק פרופילים מאומתים, רישוי מלא בלשכה.', 'justice-theme' ),
		'cta_label'   => __( 'התחלת חיפוש', 'justice-theme' ),
		'cta_url'     => $lawyers_url,
		'aria'        => __( 'לעמוד חיפוש עורכי דין', 'justice-theme' ),
	),
	array(
		'icon'        => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="32" height="32" aria-hidden="true"><path d="M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4V4z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
		'eyebrow'     => __( 'למידע משפטי', 'justice-theme' ),
		'title'       => __( 'מאמרים ומדריכים', 'justice-theme' ),
		'description' => __( 'מדריכים מקצועיים בכל תחומי המשפט — גירושין, פלילי, נדל"ן, עבודה ועוד.', 'justice-theme' ),
		'cta_label'   => __( 'לספריית המאמרים', 'justice-theme' ),
		'cta_url'     => $articles_url,
		'aria'        => __( 'לעמוד המאמרים והמדריכים', 'justice-theme' ),
	),
	array(
		'icon'        => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" width="32" height="32" aria-hidden="true"><path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z"/><path d="M9 12l2 2 4-4"/></svg>',
		'eyebrow'     => __( 'לעורכי דין', 'justice-theme' ),
		'title'       => __( 'הצטרפו ל-Jus-Tice', 'justice-theme' ),
		'description' => __( 'פרופיל מקצועי, מאמרים בשמכם, פניות ממוקדות ומערכת ניהול לידים.', 'justice-theme' ),
		'cta_label'   => __( 'הצטרפות לעורכי דין', 'justice-theme' ),
		'cta_url'     => $registration,
		'aria'        => __( 'לעמוד ההצטרפות לעורכי דין', 'justice-theme' ),
	),
);
?>

<section class="how-it-works section" id="how-it-works" aria-labelledby="how-it-works-title">
	<div class="container">
		<div class="section-header section-header--center">
			<p class="section-header__eyebrow"><?php esc_html_e( 'כך זה עובד', 'justice-theme' ); ?></p>
			<h2 id="how-it-works-title"><?php esc_html_e( 'שלוש דרכים לקבל ערך מ-Jus-Tice', 'justice-theme' ); ?></h2>
		</div>

		<div class="how-it-works__grid">
			<?php foreach ( $pathways as $pathway ) : ?>
				<a class="pathway-card" href="<?php echo esc_url( $pathway['cta_url'] ); ?>" aria-label="<?php echo esc_attr( $pathway['aria'] ); ?>">
					<span class="pathway-card__icon" aria-hidden="true"><?php echo $pathway['icon']; // phpcs:ignore WordPress.Security.EscapeOutput ?></span>
					<p class="pathway-card__eyebrow"><?php echo esc_html( $pathway['eyebrow'] ); ?></p>
					<h3 class="pathway-card__title"><?php echo esc_html( $pathway['title'] ); ?></h3>
					<p class="pathway-card__desc"><?php echo esc_html( $pathway['description'] ); ?></p>
					<span class="pathway-card__cta">
						<?php echo esc_html( $pathway['cta_label'] ); ?>
						<span aria-hidden="true" class="pathway-card__arrow">›</span>
					</span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
