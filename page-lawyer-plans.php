<?php
/**
 * Template Name: Lawyer Plans
 *
 * @package JusticeTheme
 */

get_header();

$plans = function_exists( 'justice_theme_lawyer_plans' ) ? justice_theme_lawyer_plans() : array();

$manual_activation_url = static function ( string $plan_key ): string {
	if ( function_exists( 'justice_theme_plan_manual_activation_url' ) ) {
		return justice_theme_plan_manual_activation_url( $plan_key );
	}

	return add_query_arg(
		array(
			'plan_interest' => $plan_key,
			'pre_checkout'  => '1',
			'payment_path'  => 'manual_invoice',
		),
		home_url( '/lawyer-registration/' )
	);
};

$plan_checkout_url = static function ( string $plan_key ) use ( $manual_activation_url ): string {
	if ( function_exists( 'justice_theme_plan_checkout_url' ) ) {
		return justice_theme_plan_checkout_url( $plan_key );
	}

	return 'free' === $plan_key
		? add_query_arg(
			array(
				'plan_interest' => 'free',
				'pre_checkout'  => '1',
			),
			home_url( '/lawyer-registration/' )
		)
		: $manual_activation_url( $plan_key );
};
?>

<section class="lawyer-plans-hero section">
	<div class="container lawyer-plans-hero__grid">
		<div>
			<p class="section-header__eyebrow"><?php esc_html_e( 'מסלולים לעורכי דין', 'justice-theme' ); ?></p>
			<h1><?php esc_html_e( 'מיני-סייט, תוכן, לידים וכלים במקום אחד', 'justice-theme' ); ?></h1>
			<p><?php esc_html_e( 'Jus-Tice נבנית כמערכת מסחרית לעורכי דין: פרופיל מקצועי, תוכן, חשיפה, פניות ודוחות ערך. המחירים פורסמו כדי לאפשר מכירה ושיחות לקוח ברורות; מעבר לתשלום חודשי אוטומטי ייפתח רק לאחר שהסליקה והמוצרים יהיו מאושרים ופעילים בפועל.', 'justice-theme' ); ?></p>
		</div>
		<aside>
			<strong><?php esc_html_e( 'סטטוס תשלומים', 'justice-theme' ); ?></strong>
			<p><?php esc_html_e( 'אם הסליקה החודשית עדיין לא מוכנה, הכפתורים מובילים להרשמה ובדיקת התאמה. כשהתשלום החודשי יהיה מאושר ופעיל, הכפתורים יעברו אוטומטית לתשלום מאובטח.', 'justice-theme' ); ?></p>
		</aside>
	</div>
</section>

<section class="lawyer-plans section">
	<div class="container">
		<section class="lawyer-plans-founder" aria-labelledby="lawyer-plans-founder-title">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'מסלול שותפי השקה', 'justice-theme' ); ?></p>
				<h2 id="lawyer-plans-founder-title"><?php esc_html_e( 'רוצים להיות מכוסים בתחום שלכם לפני שהמתחרים נכנסים?', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'המסלול מתאים לעורכי דין שיכולים לענות מהר לפניות, להשלים פרופיל מקצועי ולעבוד עם דוח ערך חודשי. ההפעלה עוברת בדיקת התאמה, רישיון וגילוי נאות לפני כל פרסום ממומן או ניתוב פניות.', 'justice-theme' ); ?></p>
			</div>
			<ol>
				<li><?php esc_html_e( 'שולחים פרטים ומסלול רצוי.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'Jus-Tice בודקת התאמה, תחום, עיר וזמינות למענה.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'אחרי אישור ותשלום, הפרופיל והדאשבורד מתחילים למדוד פניות וערך.', 'justice-theme' ); ?></li>
			</ol>
			<div class="lawyer-plans-founder__actions">
				<a class="button button--gold" href="<?php echo esc_url( $manual_activation_url( 'lead_partner' ) ); ?>"><?php esc_html_e( 'בקשת בדיקת שותף לידים', 'justice-theme' ); ?></a>
				<a class="button button--outline" href="<?php echo esc_url( $manual_activation_url( 'pro' ) ); ?>"><?php esc_html_e( 'פתיחת מיני-סייט מקצועי', 'justice-theme' ); ?></a>
			</div>
		</section>

		<section class="lawyer-plans-system" aria-labelledby="lawyer-plans-system-title">
			<div class="lawyer-plans-system__intro">
				<p class="section-header__eyebrow"><?php esc_html_e( 'מה עורך הדין מקבל בפועל', 'justice-theme' ); ?></p>
				<h2 id="lawyer-plans-system-title"><?php esc_html_e( 'מערכת מכירה ולא רק עוד כרטיס באינדקס', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'המסלול בנוי כדי שעורך הדין יראה ללקוחות מדויקים, יקבל פניות מדידות, ויוכל להבין מאיפה מגיע הערך העסקי.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-plans-system__grid">
				<article>
					<strong><?php esc_html_e( '01', 'justice-theme' ); ?></strong>
					<h3><?php esc_html_e( 'מיני-סייט עשיר', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'פרופיל עם תחומי עיסוק, שאלות נפוצות, מאמרים, מיקום וחומרי אמון שמחזקים המרה.', 'justice-theme' ); ?></p>
				</article>
				<article>
					<strong><?php esc_html_e( '02', 'justice-theme' ); ?></strong>
					<h3><?php esc_html_e( 'פניות מדידות', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'כל פנייה נרשמת עם תחום, עיר, מקור הגעה, מסלול וסטטוס כדי לבדוק איכות ולא רק כמות.', 'justice-theme' ); ?></p>
				</article>
				<article>
					<strong><?php esc_html_e( '03', 'justice-theme' ); ?></strong>
					<h3><?php esc_html_e( 'דוח ערך חודשי', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'העורך מקבל תמונה ברורה: חשיפה, קליקים, פניות, מקורות והמלצות לשיפור.', 'justice-theme' ); ?></p>
				</article>
				<article>
					<strong><?php esc_html_e( '04', 'justice-theme' ); ?></strong>
					<h3><?php esc_html_e( 'בקרה וגילוי נאות', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'אין הבטחת תוצאות, אין דירוג מזויף, וכל חשיפה ממומנת תסומן בצורה ברורה.', 'justice-theme' ); ?></p>
				</article>
			</div>
			<div class="lawyer-plans-system__actions">
				<a class="button button--gold" href="<?php echo esc_url( $manual_activation_url( 'lead_partner' ) ); ?>"><?php esc_html_e( 'בדיקת התאמה לשותפות לידים', 'justice-theme' ); ?></a>
				<a class="button button--outline" href="#lawyer-plans-pricing"><?php esc_html_e( 'השוואת מסלולים', 'justice-theme' ); ?></a>
			</div>
		</section>

		<div id="lawyer-plans-pricing" class="lawyer-plans__grid">
			<?php foreach ( $plans as $plan_key => $plan ) : ?>
				<?php
				$public_override = function_exists( 'justice_theme_lawyer_plan_public_overrides' ) ? justice_theme_lawyer_plan_public_overrides( $plan_key ) : array();

				if ( ! empty( $public_override['price'] ) ) {
					$plan['price'] = $public_override['price'];
				}

				if ( ! empty( $public_override['features_append'] ) && is_array( $public_override['features_append'] ) ) {
					$plan['features'] = array_merge( $plan['features'], $public_override['features_append'] );
				}

				$paid_plan           = 'free' !== $plan_key;
				$paid_checkout_ready = $paid_plan && function_exists( 'justice_theme_plan_checkout_ready' ) && justice_theme_plan_checkout_ready( $plan_key );
				?>
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
					<a class="button button--gold" href="<?php echo esc_url( $plan_checkout_url( $plan_key ) ); ?>">
						<?php
						if ( 'free' === $plan_key ) {
							esc_html_e( 'פתיחת פרופיל', 'justice-theme' );
						} elseif ( $paid_checkout_ready ) {
							esc_html_e( 'בחירת מסלול ותשלום', 'justice-theme' );
						} else {
							esc_html_e( 'הרשמה ובדיקת התאמה', 'justice-theme' );
						}
						?>
					</a>
					<?php if ( $paid_plan && ! $paid_checkout_ready ) : ?>
						<a class="lawyer-plan-card__manual-link" href="<?php echo esc_url( $manual_activation_url( $plan_key ) ); ?>">
							<?php esc_html_e( 'בקשת חשבונית והפעלה ידנית', 'justice-theme' ); ?>
						</a>
					<?php endif; ?>
				</article>
			<?php endforeach; ?>
		</div>

		<div class="lawyer-plans__notice">
			<h2><?php esc_html_e( 'כללי הפעלה לפני סליקה', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'כל מסלול בתשלום כפוף לבדיקה, גילוי נאות, תנאי שירות, מדיניות פרטיות וכללי לשכת עורכי הדין. אין הבטחה לתוצאה משפטית או עסקית, ופניות נכללות כחלק ממכסת המסלול בלבד.', 'justice-theme' ); ?></p>
			<p><?php esc_html_e( 'עד שהסליקה החודשית האוטומטית תאושר, אפשר לקלוט עורכי דין למסלול בתשלום דרך חשבונית והפעלה ידנית לאחר בדיקת התאמה ואישור תשלום.', 'justice-theme' ); ?></p>
		</div>

		<section class="lawyer-plans-faq" aria-labelledby="lawyer-plans-faq-title">
			<p class="section-header__eyebrow"><?php esc_html_e( 'שאלות לפני הצטרפות', 'justice-theme' ); ?></p>
			<h2 id="lawyer-plans-faq-title"><?php esc_html_e( 'מה חשוב לדעת לפני שמשאירים פרטים?', 'justice-theme' ); ?></h2>
			<div class="lawyer-plans-faq__grid">
				<details open>
					<summary><?php esc_html_e( 'איך יודעים שהפניות איכותיות?', 'justice-theme' ); ?></summary>
					<p><?php esc_html_e( 'כל פנייה נשמרת עם תחום, עיר, מקור הגעה וסטטוס. המדידה עוזרת להבדיל בין חשיפה כללית לבין פניות שבאמת מתאימות לתחום העבודה שלכם.', 'justice-theme' ); ?></p>
				</details>
				<details>
					<summary><?php esc_html_e( 'אפשר להתחיל לפני סליקה חודשית אוטומטית?', 'justice-theme' ); ?></summary>
					<p><?php esc_html_e( 'כן. הטופס יוצר בקשת בדיקת התאמה בלבד. אם יש התאמה, אפשר לבצע הפעלה ידנית וחשבונית לאחר אישור מסלול ותשלום.', 'justice-theme' ); ?></p>
				</details>
				<details>
					<summary><?php esc_html_e( 'האם יש התחייבות לכמות פניות או תיקים?', 'justice-theme' ); ?></summary>
					<p><?php esc_html_e( 'לא. אין הבטחה לתוצאה משפטית או עסקית. המסלולים מציגים מכסת פניות מקסימלית, מדידה ודוח ערך, בכפוף לביקוש אמיתי ולכללי הפרסום.', 'justice-theme' ); ?></p>
				</details>
				<details>
					<summary><?php esc_html_e( 'מה נדרש מעורך הדין כדי להתחיל?', 'justice-theme' ); ?></summary>
					<p><?php esc_html_e( 'רישיון פעיל, תחומי עיסוק ברורים, אזורי שירות, זמינות למענה וחומרי פרופיל בסיסיים. ככל שהפרופיל שלם יותר, קל יותר להפוך חשיפה לפנייה.', 'justice-theme' ); ?></p>
				</details>
			</div>
		</section>
	</div>
</section>

<?php get_footer(); ?>
