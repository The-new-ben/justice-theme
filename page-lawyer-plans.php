<?php
/**
 * Template Name: Lawyer Plans
 *
 * @package JusticeTheme
 */

get_header();

$plans = function_exists( 'justice_theme_lawyer_plans' ) ? justice_theme_lawyer_plans() : array();
?>

<section class="lawyer-plans-hero section">
	<div class="container lawyer-plans-hero__grid">
		<div>
			<p class="section-header__eyebrow"><?php esc_html_e( 'מסלולים לעורכי דין', 'justice-theme' ); ?></p>
			<h1><?php esc_html_e( 'מיני-סייט, תוכן, לידים וכלים במקום אחד', 'justice-theme' ); ?></h1>
			<p><?php esc_html_e( 'המסלולים נועדו להפוך את Jus-Tice למערכת עצמאית ככל האפשר: עורך דין מצטרף, בונה נכס דיגיטלי, מקבל תוכן ופניות, ורואה נתונים באזור האישי. תשלומים חיים יופעלו רק אחרי הגדרת מוצרים, חשבוניות וכללי פרסום/אתיקה.', 'justice-theme' ); ?></p>
		</div>
		<aside>
			<strong><?php esc_html_e( 'סטטוס תשלומים', 'justice-theme' ); ?></strong>
			<p><?php esc_html_e( 'WooCommerce נתמך כיעד אינטגרציה, אבל אם מוצרי מסלול לא מוגדרים עדיין, הכפתורים מובילים להרשמה ובדיקת התאמה.', 'justice-theme' ); ?></p>
		</aside>
	</div>
</section>

<section class="lawyer-plans section">
	<div class="container">
		<div class="lawyer-plans__grid">
			<?php foreach ( $plans as $plan_key => $plan ) : ?>
				<article class="lawyer-plan-card lawyer-plan-card--<?php echo esc_attr( $plan_key ); ?>">
					<div class="lawyer-plan-card__top">
						<span><?php echo esc_html( $plan['badge'] ); ?></span>
						<h2><?php echo esc_html( $plan['label'] ); ?></h2>
						<strong><?php echo esc_html( $plan['price'] ); ?></strong>
						<p><?php echo esc_html( $plan['description'] ); ?></p>
					</div>
					<ul>
						<?php foreach ( $plan['features'] as $feature ) : ?>
							<li><?php echo esc_html( $feature ); ?></li>
						<?php endforeach; ?>
					</ul>
					<a class="button button--gold" href="<?php echo esc_url( justice_theme_plan_checkout_url( $plan_key ) ); ?>">
						<?php echo 'free' === $plan_key ? esc_html__( 'פתיחת פרופיל', 'justice-theme' ) : esc_html__( 'בחירת מסלול', 'justice-theme' ); ?>
					</a>
				</article>
			<?php endforeach; ?>
		</div>

		<div class="lawyer-plans__notice">
			<h2><?php esc_html_e( 'כללי הפעלה לפני סליקה', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'אין להפעיל תשלום אוטומטי למסלולי פרסום, דירוג או לידים לפני בדיקת מדיניות פרסום לעורכי דין, גילוי נאות, תנאי שירות, חשבוניות, החזרים ומדיניות פרטיות. המסלול הטכני מוכן למיפוי מוצרי WooCommerce, אבל הפעלה מסחרית דורשת אישור.', 'justice-theme' ); ?></p>
		</div>
	</div>
</section>

<?php get_footer(); ?>
