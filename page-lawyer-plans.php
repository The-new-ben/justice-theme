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
			<strong><?php esc_html_e( 'תשלום וחשבונית', 'justice-theme' ); ?></strong>
			<p><?php esc_html_e( 'סליקת כרטיסי אשראי וחיובים חודשיים מתבצעת באמצעות Meshulam (Grow). חשבונית מס נשלחת אוטומטית במייל. ניתן לבטל את המנוי בכל עת מהאזור האישי.', 'justice-theme' ); ?></p>
			<p><small><?php esc_html_e( 'כל המחירים כוללים מע"מ. ההצטרפות לפלטפורמה כפופה לכללי לשכת עורכי הדין (פרסומת) תשס"א-2001 ולתנאי השימוש.', 'justice-theme' ); ?></small></p>
		</aside>
	</div>
</section>

<section class="lawyer-plans section">
	<div class="container">
		<div class="lawyer-plans__grid">
			<?php foreach ( $plans as $plan_key => $plan ) :
				$leads_cap = isset( $plan['leads_per_month'] ) ? (int) $plan['leads_per_month'] : 0;
				$leads_label = 0 === $leads_cap
					? __( 'ללא ניתוב לידים', 'justice-theme' )
					: sprintf( __( 'עד %d לידים בחודש', 'justice-theme' ), $leads_cap );
			?>
				<article class="lawyer-plan-card lawyer-plan-card--<?php echo esc_attr( $plan_key ); ?>">
					<div class="lawyer-plan-card__top">
						<span><?php echo esc_html( $plan['badge'] ); ?></span>
						<h2><?php echo esc_html( $plan['label'] ); ?></h2>
						<strong><?php echo esc_html( $plan['price'] ); ?></strong>
						<p class="lawyer-plan-card__leads"><?php echo esc_html( $leads_label ); ?></p>
						<p><?php echo esc_html( $plan['description'] ); ?></p>
					</div>
					<ul>
						<?php foreach ( $plan['features'] as $feature ) : ?>
							<li><?php echo esc_html( $feature ); ?></li>
						<?php endforeach; ?>
					</ul>
					<a class="button button--gold" href="<?php echo esc_url( justice_theme_plan_checkout_url( $plan_key ) ); ?>">
						<?php echo 'free' === $plan_key ? esc_html__( 'פתיחת פרופיל חינם', 'justice-theme' ) : esc_html__( 'הצטרפות והפעלת המסלול', 'justice-theme' ); ?>
					</a>
				</article>
			<?php endforeach; ?>
		</div>

		<div class="lawyer-plans__notice">
			<h2><?php esc_html_e( 'מדיניות וגילוי נאות', 'justice-theme' ); ?></h2>
			<ul>
				<li><?php esc_html_e( 'Jus-Tice היא פלטפורמת חשיפה והפניות, איננה משווקת ייצוג משפטי ספציפי ואיננה מבטיחה תוצאות.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'במסלולי "חשיפה מוגברת" ומעלה — כל הצגה ממומנת מסומנת כ"פרופיל ממומן" בהתאם לכללי לשכת עורכי הדין.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'לידים מועברים לעורכי דין מאומתים בלבד, לאחר אישור פרופיל ואימות פרטי קשר. נפח הלידים בפועל תלוי בביקוש בתחום ובאזור הגיאוגרפי.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'ניתן לבטל את המנוי בכל עת. החיוב נעצר בתחילת המחזור הבא; לא מוחזרים תשלומים על חודשים שכבר חויבו.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'חשבונית מס/קבלה נשלחת אוטומטית במייל בכל חיוב חודשי.', 'justice-theme' ); ?></li>
			</ul>
		</div>
	</div>
</section>

<?php get_footer(); ?>
