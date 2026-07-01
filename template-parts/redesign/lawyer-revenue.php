<?php
/**
 * Lawyer revenue strip per Homepage.dc.html.
 *
 * Prices come from the real plan engine (justice_theme_lawyer_plans +
 * public overrides), never hardcoded, so the homepage can't drift from
 * the plans page.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_plan_rows = array();

if ( function_exists( 'justice_theme_lawyer_plans' ) ) {
	$justice_all_plans = justice_theme_lawyer_plans();

	foreach ( array( 'free', 'pro', 'featured' ) as $justice_plan_key ) {
		if ( ! isset( $justice_all_plans[ $justice_plan_key ] ) ) {
			continue;
		}

		$justice_plan  = $justice_all_plans[ $justice_plan_key ];
		$justice_price = (string) $justice_plan['price'];

		if ( function_exists( 'justice_theme_lawyer_plan_public_overrides' ) ) {
			$justice_override = justice_theme_lawyer_plan_public_overrides( $justice_plan_key );
			if ( ! empty( $justice_override['price'] ) ) {
				$justice_price = (string) $justice_override['price'];
			}
		}

		$justice_plan_rows[] = array(
			'key'   => $justice_plan_key,
			'label' => (string) $justice_plan['label'],
			'price' => $justice_price,
		);
	}
}

$justice_registration_url = add_query_arg(
	array(
		'source'        => 'homepage_revenue_strip',
		'plan_interest' => 'featured',
	),
	home_url( '/lawyer-registration/' )
);
?>

<section class="jt2-section" id="for-lawyers">
	<div class="jt2-section__inner">
		<div class="jt2-revenue">
			<div class="jt2-revenue__grid">
				<div>
					<span class="jt2-eyebrow"><?php esc_html_e( 'לעורכי דין ומשרדים', 'justice-theme' ); ?></span>
					<h2><?php esc_html_e( 'לקוחות מחפשים עורך דין עכשיו. תנו להם למצוא חשבון מקצועי, לא רק שם ברשימה.', 'justice-theme' ); ?></h2>
					<p class="jt2-revenue__lead"><?php esc_html_e( 'פניות מגיעות אל הפלטפורמה דרך חיפוש, מדריכים וגם דרך כלי ה-AI, ומנותבות לפי תחום, עיר וזמינות. כרטיס בסיסי נכנס לאינדקס לאחר בדיקה; פרופיל משלם מקבל נראות, תוכן ופניות מסודרות.', 'justice-theme' ); ?></p>
					<div class="jt2-revenue__flow">
						<span><?php esc_html_e( '1. פתיחה', 'justice-theme' ); ?></span>
						<span><?php esc_html_e( '2. פרופיל', 'justice-theme' ); ?></span>
						<span><?php esc_html_e( '3. פניות', 'justice-theme' ); ?></span>
						<span><?php esc_html_e( '4. מסלול', 'justice-theme' ); ?></span>
					</div>
					<div class="jt2-revenue__ctas">
						<a class="button button--primary" href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'השוואת מסלולים ←', 'justice-theme' ); ?></a>
						<a class="button button--ghost" href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>"><?php esc_html_e( 'צפייה באינדקס', 'justice-theme' ); ?></a>
					</div>
				</div>
				<div class="jt2-plans">
					<?php foreach ( $justice_plan_rows as $justice_plan_row ) : ?>
						<a class="jt2-plan<?php echo 'featured' === $justice_plan_row['key'] ? ' jt2-plan--highlight' : ''; ?>" href="<?php echo esc_url( add_query_arg( 'plan_interest', $justice_plan_row['key'], home_url( '/lawyer-plans/' ) ) ); ?>">
							<strong><?php echo esc_html( $justice_plan_row['label'] ); ?></strong>
							<span><?php echo esc_html( $justice_plan_row['price'] ); ?></span>
						</a>
					<?php endforeach; ?>
					<div class="jt2-plans__scarcity"><?php esc_html_e( 'מקומות חשיפה מוגברת מוגבלים בכל תחום ועיר, לשמירה על ערך הפניות', 'justice-theme' ); ?></div>
					<a class="jt2-plan" href="<?php echo esc_url( $justice_registration_url ); ?>">
						<strong><?php esc_html_e( 'פתיחת פרופיל עכשיו', 'justice-theme' ); ?></strong>
						<span><?php esc_html_e( 'ללא התחייבות', 'justice-theme' ); ?></span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
