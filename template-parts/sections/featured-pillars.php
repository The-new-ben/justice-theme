<?php
/**
 * Featured pillar pages section — premium card design with inline SVG icons.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Premium inline SVG icons — legal-themed, monochrome, consistent stroke weight.
$pillars = array(
	array(
		'title' => 'עורך דין גירושין',
		'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" aria-hidden="true"><path d="M12 3v18M3 9l4-4 5 5M21 9l-4-4-5 5"/><circle cx="7" cy="18" r="3"/><circle cx="17" cy="18" r="3"/><path d="M4 18h6M14 18h6"/></svg>',
		'desc'  => 'ייעוץ משפטי בהליכי גירושין, חלוקת רכוש ומשמורת ילדים',
		'link'  => justice_theme_safe_public_link( '/divorce-lawyer/', '/family-law/' ),
	),
	array(
		'title' => 'עורך דין פלילי',
		'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" aria-hidden="true"><path d="M12 2L3 7v6c0 5.25 3.75 10.15 9 11.25C17.25 23.15 21 18.25 21 13V7L12 2z"/></svg>',
		'desc'  => 'הגנה בפלילים, ייצוג בחקירות משטרה ובבתי משפט',
		'link'  => justice_theme_safe_public_link( '/criminal-defense-attorney/', '/criminal-law/' ),
	),
	array(
		'title' => 'עורך דין תעבורה',
		'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" aria-hidden="true"><rect x="2" y="9" width="20" height="9" rx="2"/><path d="M5 18v2M19 18v2M2 13h20M7 9l2-4h6l2 4"/></svg>',
		'desc'  => 'ביטול דוחות, עבירות נהיגה, השעיית רישיון ותאונות דרכים',
		'link'  => justice_theme_safe_public_link( '/traffic-lawyer/', '/lawyers/?area=traffic-law' ),
	),
	array(
		'title' => 'עורך דין רשלנות רפואית',
		'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" aria-hidden="true"><path d="M12 3v18M3 12h18"/><rect x="4" y="5" width="16" height="14" rx="3"/><path d="M8 9h8M8 15h8"/></svg>',
		'desc'  => 'בירור זכויות לאחר טיפול רפואי, אבחון שגוי, ניתוח או לידה',
		'link'  => home_url( '/medical-malpractice-lawyer/' ),
	),
	array(
		'title' => 'עורך דין נזיקין',
		'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" aria-hidden="true"><path d="M7 21h10M12 3v18"/><path d="M5 7h14l-3 6H8L5 7z"/><path d="M8 13l-2 4M16 13l2 4"/></svg>',
		'desc'  => 'תאונות דרכים, תאונות עבודה, פציעות ותביעות פיצויים',
		'link'  => home_url( '/tort-lawyer/' ),
	),
	array(
		'title' => 'עורך דין מקרקעין',
		'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5V21H3V10.5z"/><rect x="9" y="14" width="6" height="7"/></svg>',
		'desc'  => 'עסקאות נדל"ן, ליקויי בנייה, רישום טאבו ומיסוי מקרקעין',
		'link'  => home_url( '/practice-areas/real-estate-law/' ),
	),
	array(
		'title' => 'עורך דין דיני עבודה',
		'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 13v3M10 15h4"/></svg>',
		'desc'  => 'זכויות עובדים, פיטורים שלא כדין, הסכמי עבודה ופנסיה',
		'link'  => home_url( '/practice-areas/labor-law/' ),
	),
	array(
		'title' => 'עורך דין ירושה',
		'icon'  => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" aria-hidden="true"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z"/><path d="M14 2v6h6M9 12h6M9 16h4"/></svg>',
		'desc'  => 'צוואות, ירושות, ניהול עיזבון והתנגדויות לצוואה',
		'link'  => justice_theme_safe_public_link( '/inheritance-lawyer/', '/lawyers/?area=inheritance-law' ),
	),
);
?>

<section class="featured-pillars section">
	<div class="container">
		<div class="section-header section-header--center">
			<p class="section-header__eyebrow"><?php esc_html_e( 'תחומי התמחות', 'justice-theme' ); ?></p>
			<h2><?php esc_html_e( 'מצאו עורך דין מומחה בתחומכם', 'justice-theme' ); ?></h2>
		</div>

		<div class="pillars-grid">
			<?php foreach ( $pillars as $pillar ) : ?>
				<a href="<?php echo esc_url( $pillar['link'] ); ?>" class="pillar-card">
					<span class="pillar-icon" aria-hidden="true"><?php echo $pillar['icon']; // phpcs:ignore WordPress.Security.EscapeOutput ?></span>
					<h3 class="pillar-title"><?php echo esc_html( $pillar['title'] ); ?></h3>
					<p class="pillar-desc"><?php echo esc_html( $pillar['desc'] ); ?></p>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
