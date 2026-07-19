<?php
/**
 * Template Name: Lawyer Plans
 *
 * @package JusticeTheme
 */

get_header();

$plans = function_exists( 'justice_theme_lawyer_plans' ) ? justice_theme_lawyer_plans() : array();

$lawyer_plans_faq_schema_items = array(
	array(
		'question' => __( 'איך יודעים שהפניות איכותיות?', 'justice-theme' ),
		'answer'   => __( 'כל פנייה נשמרת עם תחום, עיר, מקור הגעה וסטטוס. המדידה עוזרת להבדיל בין חשיפה כללית לבין פניות שבאמת מתאימות לתחום העבודה שלכם.', 'justice-theme' ),
	),
	array(
		'question' => __( 'אפשר להתחיל לפני סליקה חודשית אוטומטית?', 'justice-theme' ),
		'answer'   => __( 'כן. הטופס יוצר בקשת בדיקת התאמה בלבד. אם יש התאמה, אפשר לבצע הפעלה ידנית וחשבונית לאחר אישור מסלול ותשלום.', 'justice-theme' ),
	),
	array(
		'question' => __( 'האם יש התחייבות לכמות פניות או תיקים?', 'justice-theme' ),
		'answer'   => __( 'לא. אין הבטחה לתוצאה משפטית או עסקית. המסלולים מציגים מכסת פניות מקסימלית, מדידה ודוח ערך, בכפוף לביקוש אמיתי ולכללי הפרסום.', 'justice-theme' ),
	),
	array(
		'question' => __( 'מה נדרש מעורך הדין כדי להתחיל?', 'justice-theme' ),
		'answer'   => __( 'רישיון פעיל, תחומי עיסוק ברורים, אזורי שירות, זמינות למענה וחומרי פרופיל בסיסיים. ככל שהפרופיל שלם יותר, קל יותר להפוך חשיפה לפנייה.', 'justice-theme' ),
	),
);

$plan_tracking_url = static function ( string $url, string $plan_key, string $surface ): string {
	return add_query_arg(
		array(
			'utm_source'       => 'lawyer_plans',
			'utm_medium'       => 'plan_page',
			'utm_campaign'     => 'lawyer_acquisition',
			'utm_content'      => sanitize_key( $surface . '_' . $plan_key ),
			'outreach_segment' => 'plans_page',
		),
		$url
	);
};

$manual_activation_url = static function ( string $plan_key, string $surface = 'manual_activation' ) use ( $plan_tracking_url ): string {
	if ( function_exists( 'justice_theme_plan_manual_activation_url' ) ) {
		return $plan_tracking_url( justice_theme_plan_manual_activation_url( $plan_key ), $plan_key, $surface );
	}

	$url = add_query_arg(
		array(
			'plan_interest' => $plan_key,
			'pre_checkout'  => '1',
			'payment_path'  => 'manual_invoice',
		),
		home_url( '/lawyer-registration/' )
	);

	return $plan_tracking_url( $url, $plan_key, $surface );
};

$plan_checkout_url = static function ( string $plan_key, string $surface = 'pricing_card' ) use ( $manual_activation_url, $plan_tracking_url ): string {
	if ( function_exists( 'justice_theme_plan_checkout_url' ) ) {
		return $plan_tracking_url( justice_theme_plan_checkout_url( $plan_key ), $plan_key, $surface );
	}

	return 'free' === $plan_key
		? $plan_tracking_url(
			add_query_arg(
				array(
					'plan_interest' => 'free',
					'pre_checkout'  => '1',
				),
				home_url( '/lawyer-registration/' )
			),
			$plan_key,
			$surface
		)
		: $manual_activation_url( $plan_key, $surface );
};
?>

<section class="lawyer-plans-hero section">
	<div class="container lawyer-plans-hero__grid">
		<div>
			<p class="section-header__eyebrow"><?php esc_html_e( 'מסלולים לעורכי דין', 'justice-theme' ); ?></p>
			<h1><?php esc_html_e( 'פרופיל מקצועי, תוכן, לידים וכלים במקום אחד', 'justice-theme' ); ?></h1>
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
				<p><?php esc_html_e( 'המסלול מתאים לעורכי דין שיכולים לענות מהר לפניות, להשלים פרופיל מקצועי ולעבוד עם דוח ערך חודשי. ההפעלה עוברת בדיקת התאמה, רישיון וגילוי נאות לפני כל פרסום או ניתוב פניות.', 'justice-theme' ); ?></p>
			</div>
			<ol>
				<li><?php esc_html_e( 'שולחים פרטים ומסלול רצוי.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'Jus-Tice בודקת התאמה, תחום, עיר וזמינות למענה.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'אחרי אישור ותשלום, הפרופיל והדאשבורד מתחילים למדוד פניות וערך.', 'justice-theme' ); ?></li>
			</ol>
			<div class="lawyer-plans-founder__actions">
				<a class="button button--gold" href="<?php echo esc_url( $plan_checkout_url( 'lead_partner', 'founder_primary' ) ); ?>"><?php esc_html_e( 'בקשת בדיקת שותף לידים', 'justice-theme' ); ?></a>
				<a class="button button--outline" href="<?php echo esc_url( $plan_checkout_url( 'pro', 'founder_secondary' ) ); ?>"><?php esc_html_e( 'פתיחת פרופיל מקצועי מורחב', 'justice-theme' ); ?></a>
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
					<h3><?php esc_html_e( 'פרופיל מקצועי עשיר', 'justice-theme' ); ?></h3>
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
				<a class="button button--gold" href="<?php echo esc_url( $plan_checkout_url( 'lead_partner', 'system_primary' ) ); ?>"><?php esc_html_e( 'בדיקת התאמה לשותפות לידים', 'justice-theme' ); ?></a>
				<a class="button button--outline" href="#lawyer-plans-pricing"><?php esc_html_e( 'השוואת מסלולים', 'justice-theme' ); ?></a>
			</div>
		</section>

		<section class="lawyer-plans-market-proof" aria-labelledby="lawyer-plans-market-proof-title">
			<div class="lawyer-plans-market-proof__intro">
				<p class="section-header__eyebrow"><?php esc_html_e( 'מה למדנו מאינדקסים ושירותי שיווק לעורכי דין', 'justice-theme' ); ?></p>
				<h2 id="lawyer-plans-market-proof-title"><?php esc_html_e( 'עורכי דין לא קונים עוד כרטיס. הם קונים מערכת שמביאה אותם לשיחת לקוח.', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'המסר שעובד אצל פלטפורמות מובילות פשוט: להופיע מול אנשים שמחפשים עורך דין עכשיו, לבנות אמון דרך פרופיל מלא, לאפשר יצירת קשר קלה, למדוד מה עובד, ולהראות שהחשבון מנוהל אחרי ההרשמה. Jus-Tice לוקחת את זה לשוק הישראלי עם מסלול מבוקר, פניות מתועדות ואזור אישי.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-plans-market-proof__grid">
				<article>
					<span><?php esc_html_e( 'נראות בזמן כוונה', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'לא רק להיות באינדקס', 'justice-theme' ); ?></strong>
					<p><?php esc_html_e( 'הפרופיל נבנה סביב תחום, עיר, זמינות ותוכן שמסביר למה הלקוח צריך לפנות דווקא עכשיו.', 'justice-theme' ); ?></p>
				</article>
				<article>
					<span><?php esc_html_e( 'פרופיל שמוכר אמון', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'תמונה, שירותים, תהליך, שאלות ותוכן', 'justice-theme' ); ?></strong>
					<p><?php esc_html_e( 'ככל שהחשבון מלא יותר, קל יותר להפוך חיפוש אנונימי לפנייה עם הקשר משפטי ברור.', 'justice-theme' ); ?></p>
				</article>
				<article>
					<span><?php esc_html_e( 'ניהול אחרי הפנייה', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'דאשבורד, סטטוס, WhatsApp ודוח ערך', 'justice-theme' ); ?></strong>
					<p><?php esc_html_e( 'המערכת לא עוצרת בליד. עורך הדין רואה מה פתוח, מה טופל, מה דווח ומה צריך שירות או שינוי מסלול.', 'justice-theme' ); ?></p>
				</article>
			</div>
			<div class="lawyer-plans-market-proof__signup-stages">
				<strong><?php esc_html_e( 'מסלול ההצטרפות שבנינו לפי מה שעובד בשוק', 'justice-theme' ); ?></strong>
				<ol>
					<li><?php esc_html_e( 'פתיחה מהירה: שם משרד, אימייל לקבלת פניות, טלפון נייד לאימות, סיסמה ואישור תנאים.', 'justice-theme' ); ?></li>
					<li><?php esc_html_e( 'פרופיל אמון: תחומים, ערים, ניסיון, תמונה, כתובת, דרכי קשר, מאמרים והצלחות מקצועיות.', 'justice-theme' ); ?></li>
					<li><?php esc_html_e( 'מוניטין מדיד: חוות דעת, שאלות לקוחות, פניות שלא נענו ומעקב אחר איכות השירות.', 'justice-theme' ); ?></li>
					<li><?php esc_html_e( 'הפעלה עסקית: קישור תשלום אמיתי או חשבונית ידנית, דוח ערך, שדרוג, הורדה, ביטול והחזר דרך שירות מתועד.', 'justice-theme' ); ?></li>
				</ol>
			</div>
			<div class="lawyer-plans-market-proof__actions">
				<a class="button button--gold" href="<?php echo esc_url( $plan_checkout_url( 'lead_partner', 'market_proof_primary' ) ); ?>"><?php esc_html_e( 'פתיחת חשבון שותף לידים', 'justice-theme' ); ?></a>
				<a class="button button--outline" href="<?php echo esc_url( justice_theme_public_url( home_url( '/lawyer-dashboard/' ) ) ); ?>"><?php esc_html_e( 'כניסה לאזור האישי', 'justice-theme' ); ?></a>
			</div>
		</section>

		<section class="lawyer-plans-next-steps" aria-labelledby="lawyer-plans-next-steps-title">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'מה קורה אחרי בחירת מסלול', 'justice-theme' ); ?></p>
				<h2 id="lawyer-plans-next-steps-title"><?php esc_html_e( 'המסלול לא מסתיים בכפתור תשלום', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'כדי להפוך הרשמה להכנסה יציבה, עורך הדין צריך לראות מה נפתח עבורו, מתי נשלח קישור תשלום, איך מתקבלות פניות ואיך מבקשים שינוי מסלול, ביטול, החזר או חשבונית.', 'justice-theme' ); ?></p>
			</div>
			<ol>
				<li>
					<strong><?php esc_html_e( 'בדיקת התאמה', 'justice-theme' ); ?></strong>
					<span><?php esc_html_e( 'אימות רישיון, תחומי עיסוק, אזורי שירות וזמינות למענה.', 'justice-theme' ); ?></span>
				</li>
				<li>
					<strong><?php esc_html_e( 'תשלום וחשבונית', 'justice-theme' ); ?></strong>
					<span><?php esc_html_e( 'קישור Grow/Morning אמיתי או חשבונית ידנית עד לאישור סליקה חודשית.', 'justice-theme' ); ?></span>
				</li>
				<li>
					<strong><?php esc_html_e( 'אזור אישי', 'justice-theme' ); ?></strong>
					<span><?php esc_html_e( 'פרופיל, פניות, סטטוס טיפול, דוחות ערך ובקשות שירות במקום אחד.', 'justice-theme' ); ?></span>
				</li>
				<li>
					<strong><?php esc_html_e( 'שינוי או ביטול', 'justice-theme' ); ?></strong>
					<span><?php esc_html_e( 'שדרוג, הורדה, ביטול, החזר ועותק חשבונית נפתחים כבקשת שירות מתועדת.', 'justice-theme' ); ?></span>
				</li>
			</ol>
		</section>

		<section class="lawyer-plans-payment-proof" aria-labelledby="lawyer-plans-payment-proof-title" data-revenue-surface="lawyer_plans_payment_proof_path" data-payment-readiness="manual_invoice_paid_only_with_evidence">
			<div class="lawyer-plans-payment-proof__intro">
				<p class="section-header__eyebrow"><?php esc_html_e( 'הפעלה ותשלום בפועל', 'justice-theme' ); ?></p>
				<h2 id="lawyer-plans-payment-proof-title"><?php esc_html_e( 'מסלול בתשלום נפתח רק כשיש תנאים, חשבונית או קישור תשלום, והוכחת תשלום', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'כדי להימנע מהבטחות ריקות, Jus-Tice מפרידה בין בקשת מסלול, חשבונית שנשלחה ותשלום שאושר. חשבונית או קישור תשלום אינם נחשבים הכנסה עד שיש אסמכתת תשלום אמיתית.', 'justice-theme' ); ?></p>
			</div>
			<div class="lawyer-plans-payment-proof__grid">
				<article data-payment-state="terms_before_invoice">
					<strong><?php esc_html_e( '01', 'justice-theme' ); ?></strong>
					<h3><?php esc_html_e( 'מסלול ותנאים', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'בוחרים מסלול, מחיר ותקופה. לפני דרישת תשלום בודקים רישיון, תחום, אזור שירות וזמינות.', 'justice-theme' ); ?></p>
				</article>
				<article data-payment-state="billing_contact">
					<strong><?php esc_html_e( '02', 'justice-theme' ); ?></strong>
					<h3><?php esc_html_e( 'פרטי חשבונית', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'אוספים שם לחשבונית, אימייל, טלפון וכתובת. אם חסר פרט, הבקשה נשארת לבדיקת בעלים.', 'justice-theme' ); ?></p>
				</article>
				<article data-payment-state="invoice_not_paid">
					<strong><?php esc_html_e( '03', 'justice-theme' ); ?></strong>
					<h3><?php esc_html_e( 'חשבונית או קישור תשלום', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'כש-Grow/Morning או חשבונית ידנית נשלחים בפועל, הסטטוס הוא invoice_sent. זה עדיין לא paid.', 'justice-theme' ); ?></p>
				</article>
				<article data-payment-state="paid_requires_evidence">
					<strong><?php esc_html_e( '04', 'justice-theme' ); ?></strong>
					<h3><?php esc_html_e( 'paid רק עם אסמכתה', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'מסלול נספר כמשלם רק אחרי הוכחת תשלום פרטית, תאריך תשלום וחיבור לאזור האישי או לתור הלידים.', 'justice-theme' ); ?></p>
				</article>
			</div>
			<div class="lawyer-plans-payment-proof__actions">
				<a class="button button--gold" href="<?php echo esc_url( $manual_activation_url( 'lead_partner', 'payment_proof_primary' ) ); ?>"><?php esc_html_e( 'בדיקת מסלול שותף לידים', 'justice-theme' ); ?></a>
				<a class="button button--outline" href="<?php echo esc_url( $manual_activation_url( 'pro', 'payment_proof_secondary' ) ); ?>"><?php esc_html_e( 'בקשת חשבונית למסלול מקצועי', 'justice-theme' ); ?></a>
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
					<a class="button button--gold" href="<?php echo esc_url( $plan_checkout_url( $plan_key, 'pricing_card' ) ); ?>">
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
						<a class="lawyer-plan-card__manual-link" href="<?php echo esc_url( $manual_activation_url( $plan_key, 'pricing_manual_link' ) ); ?>">
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

<?php
if ( function_exists( 'justice_theme_print_schema' ) && ! empty( $lawyer_plans_faq_schema_items ) ) {
	$lawyer_plans_faq_questions = array();

	foreach ( $lawyer_plans_faq_schema_items as $faq_item ) {
		$question = isset( $faq_item['question'] ) ? trim( wp_strip_all_tags( $faq_item['question'] ) ) : '';
		$answer   = isset( $faq_item['answer'] ) ? trim( wp_strip_all_tags( $faq_item['answer'] ) ) : '';

		if ( '' === $question || '' === $answer ) {
			continue;
		}

		$lawyer_plans_faq_questions[] = array(
			'@type'          => 'Question',
			'name'           => $question,
			'acceptedAnswer' => array(
				'@type' => 'Answer',
				'text'  => $answer,
			),
		);
	}

	if ( ! empty( $lawyer_plans_faq_questions ) ) {
		justice_theme_print_schema(
			array(
				'@context'   => 'https://schema.org',
				'@type'      => 'FAQPage',
				'@id'        => justice_theme_public_url( home_url( '/lawyer-plans/#lawyer-plans-faq-schema' ) ),
				'mainEntity' => $lawyer_plans_faq_questions,
			)
		);
	}
}
?>

<?php get_footer(); ?>
