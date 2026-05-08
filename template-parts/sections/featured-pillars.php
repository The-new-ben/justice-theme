<?php
/**
 * Featured pillar pages section — premium card design with emoji icons.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$pillars = [
	[ 'title' => 'עורך דין גירושין',    'icon' => '⚖️', 'desc' => 'ייעוץ משפטי בהליכי גירושין, חלוקת רכוש ומשמורת ילדים',     'link' => home_url( '/family-law/divorce/' ) ],
	[ 'title' => 'עורך דין פלילי',       'icon' => '🛡️', 'desc' => 'הגנה בפלילים, ייצוג בחקירות משטרה ובבתי משפט',             'link' => home_url( '/criminal-law/' ) ],
	[ 'title' => 'עורך דין תעבורה',      'icon' => '🚗', 'desc' => 'ביטול דוחות, עבירות נהיגה, השעיית רישיון ותאונות דרכים',    'link' => home_url( '/traffic-law/' ) ],
	[ 'title' => 'עורך דין מקרקעין',     'icon' => '🏠', 'desc' => 'עסקאות נדל"ן, ליקויי בנייה, רישום טאבו ומיסוי מקרקעין',   'link' => home_url( '/real-estate-law/' ) ],
	[ 'title' => 'עורך דין דיני עבודה',  'icon' => '💼', 'desc' => 'זכויות עובדים, פיטורים שלא כדין, הסכמי עבודה ופנסיה',      'link' => home_url( '/labor-law/' ) ],
	[ 'title' => 'עורך דין ירושה',       'icon' => '📜', 'desc' => 'צוואות, ירושות, ניהול עיזבון והתנגדויות לצוואה',             'link' => home_url( '/family-law/inheritance/' ) ],
];
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
					<span class="pillar-icon" aria-hidden="true"><?php echo $pillar['icon']; ?></span>
					<h3 class="pillar-title"><?php echo esc_html( $pillar['title'] ); ?></h3>
					<p class="pillar-desc"><?php echo esc_html( $pillar['desc'] ); ?></p>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
