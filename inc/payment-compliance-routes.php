<?php
/**
 * Payment provider compliance routes.
 *
 * These lightweight public pages cover the business/legal signals required by
 * Grow/Meshulam before they approve the site for online payment clearing.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_business_name(): string {
	return trim( (string) justice_theme_option( 'justice_business_name', 'Jus-Tice Israel' ) );
}

function justice_theme_business_address(): string {
	return trim( (string) justice_theme_option( 'justice_business_address', '' ) );
}

function justice_theme_payment_compliance_path(): string {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = (string) wp_parse_url( $request_uri, PHP_URL_PATH );

	return '/' . trim( $request_path, '/' ) . '/';
}

function justice_theme_payment_compliance_config( string $path ): ?array {
	$routes = array(
		'/sample-terms-and-conditions-template/' => array(
			'slug'        => 'terms',
			'title'       => 'תקנון ותנאי שימוש',
			'eyebrow'     => 'תנאי השירות של Jus-Tice',
			'description' => 'תנאי שימוש, רכישת שירותים דיגיטליים, ביטול עסקה, אחריות, פרטיות ומגבלות שימוש באתר.',
		),
		'/terms/'                       => array(
			'redirect' => home_url( '/sample-terms-and-conditions-template/' ),
		),
		'/terms-and-conditions/'        => array(
			'redirect' => home_url( '/sample-terms-and-conditions-template/' ),
		),
		'/privacy/'                     => array(
			'slug'        => 'privacy',
			'title'       => 'מדיניות פרטיות',
			'eyebrow'     => 'שמירה על מידע אישי',
			'description' => 'איך Jus-Tice אוסף, שומר ומשתמש במידע שנמסר באתר, בטפסים, באזור האישי ובתהליך התשלום.',
		),
		'/privacy-policy/'              => array(
			'redirect' => home_url( '/privacy/' ),
		),
		'/cancellation/'                => array(
			'slug'        => 'refund',
			'title'       => 'ביטול עסקה, אספקת שירות ואחריות',
			'eyebrow'     => 'מדיניות שירותים דיגיטליים',
			'description' => 'כללי ביטול, אספקה, הפעלת מנוי, אחריות שירות ומגבלות השירותים הדיגיטליים של Jus-Tice.',
		),
		'/refund-cancellation-policy/'  => array(
			'redirect' => home_url( '/cancellation/' ),
		),
		'/checkout/'                    => array(
			'slug'        => 'checkout',
			'title'       => 'פרטי לקוח לפני תשלום',
			'eyebrow'     => 'בדיקת פרטים לפני הפעלת מסלול',
			'description' => 'עמוד איסוף פרטי לקוח ואישור תקנון לפני מעבר להרשמה, חשבונית או תשלום מאובטח.',
		),
	);

	return $routes[ $path ] ?? null;
}

function justice_theme_payment_compliance_prepare( array $config ): void {
	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->is_404  = false;
		$wp_query->is_page = true;
	}

	status_header( 200 );

	$title       = trim( wp_strip_all_tags( (string) ( $config['title'] ?? '' ) ) );
	$desc        = trim( wp_strip_all_tags( (string) ( $config['description'] ?? '' ) ) );
	$canonical   = home_url( '/' . trim( (string) ( $config['slug'] ?? '' ), '/' ) . '/' );
	$canonical   = 'terms' === ( $config['slug'] ?? '' ) ? home_url( '/sample-terms-and-conditions-template/' ) : $canonical;
	$canonical   = 'refund' === ( $config['slug'] ?? '' ) ? home_url( '/cancellation/' ) : $canonical;
	$canonical   = 'checkout' === ( $config['slug'] ?? '' ) ? home_url( '/checkout/' ) : $canonical;

	add_filter(
		'pre_get_document_title',
		static function () use ( $title ): string {
			return $title . ' | Jus-Tice';
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_title',
		static function () use ( $title ): string {
			return $title . ' | Jus-Tice';
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_metadesc',
		static function () use ( $desc ): string {
			return $desc;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_canonical',
		static function () use ( $canonical ): string {
			return $canonical;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_robots',
		static function (): string {
			return 'index, follow';
		},
		PHP_INT_MAX
	);
}

function justice_theme_payment_compliance_render_business_box(): void {
	$business_name    = justice_theme_business_name();
	$business_address = justice_theme_business_address();
	$phone            = function_exists( 'justice_theme_public_contact_number' ) ? justice_theme_public_contact_number() : '0525101555';
	$email            = justice_theme_option( 'justice_email', 'info@jus-tice.co.il' );
	?>
	<aside class="jt-compliance-card jt-compliance-card--business" aria-labelledby="jt-compliance-business-title">
		<h2 id="jt-compliance-business-title">פרטי בית העסק</h2>
		<dl class="jt-compliance-details">
			<div><dt>שם העסק</dt><dd><?php echo esc_html( $business_name ); ?></dd></div>
			<div><dt>טלפון</dt><dd dir="ltr"><?php echo esc_html( $phone ); ?></dd></div>
			<div><dt>אימייל</dt><dd><a href="<?php echo esc_url( 'mailto:' . $email ); ?>"><?php echo esc_html( $email ); ?></a></dd></div>
			<div>
				<dt>כתובת העסק</dt>
				<dd>
					<?php if ( $business_address ) : ?>
						<?php echo esc_html( $business_address ); ?>
					<?php else : ?>
						<span class="jt-compliance-warning">יש לעדכן כתובת עסק מלאה לפני שליחה חוזרת לבדיקה.</span>
					<?php endif; ?>
				</dd>
			</div>
		</dl>
	</aside>
	<?php
}

function justice_theme_payment_compliance_render_body( string $slug ): void {
	if ( 'privacy' === $slug ) {
		?>
		<section class="jt-compliance-card">
			<h2>איזה מידע נאסף</h2>
			<p>האתר עשוי לאסוף שם, טלפון, כתובת אימייל, תחום משפטי, עיר, פרטי פנייה, פרטי עורך דין, פרטי מנוי, פרטי חשבונית ונתונים טכניים הדרושים לאבטחה, תפעול, מדידה ושיפור השירות.</p>
			<h2>למה המידע משמש</h2>
			<ul>
				<li>טיפול בפניות משתמשים וחיבור ראשוני לעורכי דין מתאימים.</li>
				<li>הקמת פרופיל עורך דין, אזור אישי, מסלולי שירות ודוחות ערך.</li>
				<li>הפקת חשבוניות, טיפול בתשלומים, תמיכה ושירות לקוחות.</li>
				<li>שמירה על אבטחת האתר, מניעת ספאם ושיפור חוויית המשתמש.</li>
			</ul>
			<h2>מסירת מידע לצדדים שלישיים</h2>
			<p>מידע יימסר רק כאשר הדבר נדרש להפעלת השירות: ספקי אחסון, דיוור, סליקה, חשבוניות, אבטחה, ניתוח נתונים, עורכי דין שאליהם בחר המשתמש לפנות, או כאשר קיימת חובה חוקית.</p>
			<h2>זכויות המשתמש</h2>
			<p>ניתן לפנות אלינו כדי לבקש עיון, תיקון או מחיקה של מידע, בכפוף לחובות שמירת מסמכים, חשבוניות, אבטחה ודין.</p>
		</section>
		<?php
		return;
	}

	if ( 'refund' === $slug ) {
		?>
		<section class="jt-compliance-card">
			<h2>אספקת השירות</h2>
			<p>שירותי Jus-Tice הם שירותים דיגיטליים לעורכי דין ולציבור. לאחר אישור תשלום או חשבונית, פתיחת מסלול לעורך דין תחל בדרך כלל בתוך 3 ימי עסקים, בכפוף למסירת פרטים, בדיקת רישיון, בדיקת תוכן ואישור פרסום.</p>
			<h2>ביטול עסקה ומנוי</h2>
			<p>ניתן לבקש ביטול מנוי חודשי באמצעות פנייה בכתב לכתובת האימייל של האתר. הביטול יחול על חיובים עתידיים, בהתאם לדין ולהסכמים החלים. כאשר שירות דיגיטלי כבר הופעל, הוכן או נמסר, החזר ייבחן לפי מצב השירות בפועל והוראות הדין.</p>
			<h2>אחריות ושירות</h2>
			<p>Jus-Tice מתחייבת לספק את השירותים הדיגיטליים בזהירות סבירה, אך אינה מתחייבת לכמות פניות, דירוגים, תוצאות חיפוש, תוצאות משפטיות או תוצאות עסקיות. עורכי הדין אחראים לשירות המשפטי שהם מספקים ללקוחותיהם.</p>
			<h2>פניות שירות</h2>
			<p>פניות בנושא ביטול, חשבונית, תשלום או תקלה יישלחו דרך עמוד יצירת הקשר או לכתובת האימייל המופיעה באתר.</p>
		</section>
		<?php
		return;
	}

	if ( 'checkout' === $slug ) {
		?>
		<section class="jt-compliance-card">
			<h2>פרטים לפני תשלום או חשבונית</h2>
			<p>לפני הפעלת מסלול בתשלום, נא למלא פרטי לקוח ולאשר את התקנון. לאחר השלמת תשתית הסליקה, עמוד זה יוביל לתשלום מאובטח. עד אז ניתן להשלים הרשמה ולקבל הפעלה ידנית לאחר אישור.</p>
			<form class="jt-compliance-checkout" action="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>" method="get">
				<input type="hidden" name="pre_checkout" value="1">
				<input type="hidden" name="payment_path" value="manual_invoice">
				<input type="hidden" name="plan_interest" value="pro">
				<label>שם פרטי<input type="text" name="first_name" autocomplete="given-name" required></label>
				<label>שם משפחה<input type="text" name="last_name" autocomplete="family-name" required></label>
				<label>טלפון ללא קידומת בינלאומית<input type="tel" name="phone" autocomplete="tel-national" required></label>
				<label>מדינה<input type="text" name="country" autocomplete="country-name" value="ישראל" required></label>
				<label>אימייל<input type="email" name="email" autocomplete="email" required></label>
				<label class="jt-compliance-checkbox">
					<input type="checkbox" name="accept_terms" value="1" required>
					<span>קראתי ואני מאשר/ת את <a href="<?php echo esc_url( home_url( '/sample-terms-and-conditions-template/' ) ); ?>" target="_blank" rel="noopener">התקנון ותנאי השימוש</a>, כולל מדיניות הביטול, אספקת השירות והפרטיות.</span>
				</label>
				<button class="button button--gold" type="submit">המשך להרשמה והפעלת מסלול</button>
			</form>
		</section>
		<?php
		return;
	}
	?>
	<section class="jt-compliance-card">
		<h2>כללי שימוש באתר</h2>
		<ul>
			<li>השימוש באתר וברכישת שירותים מיועד לבני 18 ומעלה בלבד.</li>
			<li>המידע באתר הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי, חוות דעת משפטית או התחייבות לתוצאה.</li>
			<li>פנייה דרך האתר אינה יוצרת יחסי עורך דין-לקוח עד יצירת התקשרות ישירה ומפורשת עם עורך דין מתאים.</li>
			<li>אין להעלות לאתר מידע כוזב, מפר זכויות, פוגעני, סודי במיוחד או מידע שאינכם רשאים למסור.</li>
		</ul>
		<h2>שירותים בתשלום לעורכי דין</h2>
		<p>המסלולים בתשלום כוללים שירותים דיגיטליים כגון פרופיל מקצועי, מיני-סייט, חשיפה באתר, דוחות ערך, כלי מוניטין ופניות בהתאם למסלול שנבחר. כל פרסום ממומן יסומן בהתאם לכללי לשכת עורכי הדין.</p>
		<h2>מדיניות ביטול ואספקה</h2>
		<p>אספקת השירות תחל לאחר אישור התשלום או החשבונית, ובכפוף למסירת פרטים ואישור פרסום. ביטול מנוי יחול על חיובים עתידיים בהתאם לדין. לפרטים מלאים ראו <a href="<?php echo esc_url( home_url( '/cancellation/' ) ); ?>">מדיניות ביטול, אספקת שירות ואחריות</a>.</p>
		<h2>אחריות</h2>
		<p>Jus-Tice אינה מתחייבת לכמות פניות, דירוגים, מיקום בתוצאות חיפוש, תוצאה משפטית או תוצאה עסקית. האחריות לשירות משפטי מקצועי חלה על עורך הדין המספק את השירות.</p>
		<h2>פרטיות</h2>
		<p>השימוש במידע אישי נעשה לצורך הפעלת האתר, טיפול בפניות, חיוב, חשבוניות, אבטחה ושיפור השירות. לפרטים מלאים ראו <a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>">מדיניות הפרטיות</a>.</p>
	</section>
	<?php
}

function justice_theme_payment_compliance_render_page( array $config ): void {
	$slug        = (string) ( $config['slug'] ?? '' );
	$title       = (string) ( $config['title'] ?? '' );
	$eyebrow     = (string) ( $config['eyebrow'] ?? '' );
	$description = (string) ( $config['description'] ?? '' );

	get_header();
	?>
	<style>
		.jt-compliance {
			background: #f6f8fb;
			color: #14213d;
			direction: rtl;
		}
		.jt-compliance__hero,
		.jt-compliance__inner {
			width: min(1120px, calc(100% - 32px));
			margin: 0 auto;
		}
		.jt-compliance__hero {
			padding: clamp(48px, 7vw, 86px) 0 28px;
		}
		.jt-compliance__eyebrow {
			margin: 0 0 10px;
			color: #c1121f;
			font-weight: 800;
		}
		.jt-compliance h1 {
			margin: 0;
			font-size: clamp(2rem, 4vw, 3.3rem);
			line-height: 1.15;
			letter-spacing: 0;
		}
		.jt-compliance__intro {
			max-width: 780px;
			margin: 16px 0 0;
			color: #42526b;
			font-size: 1.06rem;
			line-height: 1.75;
		}
		.jt-compliance__inner {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
			gap: 22px;
			padding: 20px 0 68px;
			align-items: start;
		}
		.jt-compliance-card {
			background: #fff;
			border: 1px solid #dde5ee;
			border-radius: 8px;
			padding: clamp(18px, 3vw, 30px);
			box-shadow: 0 8px 24px rgba(20, 33, 61, 0.06);
		}
		.jt-compliance-card h2 {
			margin: 0 0 12px;
			font-size: 1.22rem;
			line-height: 1.35;
			letter-spacing: 0;
		}
		.jt-compliance-card p,
		.jt-compliance-card li,
		.jt-compliance-card dd {
			color: #42526b;
			line-height: 1.75;
		}
		.jt-compliance-details {
			display: grid;
			gap: 12px;
			margin: 0;
		}
		.jt-compliance-details div {
			border-bottom: 1px solid #edf1f6;
			padding-bottom: 10px;
		}
		.jt-compliance-details dt {
			color: #6b778c;
			font-size: 0.9rem;
			font-weight: 700;
		}
		.jt-compliance-details dd {
			margin: 4px 0 0;
			font-weight: 800;
			color: #14213d;
		}
		.jt-compliance-warning {
			color: #9f1239;
		}
		.jt-compliance-checkout {
			display: grid;
			gap: 14px;
			margin-top: 18px;
		}
		.jt-compliance-checkout label {
			display: grid;
			gap: 6px;
			font-weight: 800;
		}
		.jt-compliance-checkout input[type="text"],
		.jt-compliance-checkout input[type="tel"],
		.jt-compliance-checkout input[type="email"] {
			width: 100%;
			border: 1px solid #cfd8e3;
			border-radius: 8px;
			padding: 12px 14px;
			font: inherit;
			background: #fbfcfe;
		}
		.jt-compliance-checkbox {
			grid-template-columns: auto 1fr;
			align-items: start;
			font-weight: 700;
		}
		.jt-compliance-checkbox input {
			margin-top: 0.45em;
		}
		@media (max-width: 820px) {
			.jt-compliance__inner {
				grid-template-columns: 1fr;
			}
		}
	</style>
	<main id="primary" class="site-main jt-compliance jt-compliance--<?php echo esc_attr( $slug ); ?>">
		<section class="jt-compliance__hero">
			<p class="jt-compliance__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
			<h1><?php echo esc_html( $title ); ?></h1>
			<p class="jt-compliance__intro"><?php echo esc_html( $description ); ?></p>
		</section>
		<div class="jt-compliance__inner">
			<?php justice_theme_payment_compliance_render_body( $slug ); ?>
			<?php justice_theme_payment_compliance_render_business_box(); ?>
		</div>
	</main>
	<?php
	get_footer();
}

function justice_theme_maybe_render_payment_compliance_route(): void {
	$path   = justice_theme_payment_compliance_path();
	$config = justice_theme_payment_compliance_config( $path );

	if ( empty( $config ) ) {
		return;
	}

	if ( ! empty( $config['redirect'] ) ) {
		wp_safe_redirect( (string) $config['redirect'], 301 );
		exit;
	}

	if ( '/checkout/' === $path && class_exists( 'WooCommerce' ) && function_exists( 'wc_get_page_id' ) ) {
		$checkout_page_id = (int) wc_get_page_id( 'checkout' );
		if ( $checkout_page_id > 0 && 'publish' === get_post_status( $checkout_page_id ) ) {
			return;
		}
	}

	justice_theme_payment_compliance_prepare( $config );
	justice_theme_payment_compliance_render_page( $config );
	exit;
}
add_action( 'template_redirect', 'justice_theme_maybe_render_payment_compliance_route', -3940 );

function justice_theme_render_checkout_compliance_notice(): void {
	static $rendered = false;

	if ( $rendered ) {
		return;
	}

	if ( ! function_exists( 'is_checkout' ) || ! is_checkout() ) {
		return;
	}

	$rendered = true;

	?>
	<section class="jt-checkout-compliance" dir="rtl" style="border:1px solid #dde5ee;border-radius:8px;padding:18px;margin:18px 0;background:#fff;">
		<h2 style="margin:0 0 10px;font-size:1.2rem;">אישור תקנון ותנאי תשלום</h2>
		<p style="margin:0 0 12px;color:#42526b;line-height:1.7;">לפני ביצוע תשלום יש לקרוא ולאשר את התקנון, מדיניות הביטול, אספקת השירות, האחריות והפרטיות.</p>
		<label style="display:flex;gap:10px;align-items:flex-start;font-weight:700;">
			<input type="checkbox" name="justice_visible_terms_approval" required style="margin-top:0.35em;">
			<span>קראתי ואני מאשר/ת את <a href="<?php echo esc_url( home_url( '/sample-terms-and-conditions-template/' ) ); ?>" target="_blank" rel="noopener">התקנון ותנאי השימוש</a>, כולל <a href="<?php echo esc_url( home_url( '/cancellation/' ) ); ?>" target="_blank" rel="noopener">מדיניות הביטול ואספקת השירות</a> ואת <a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>" target="_blank" rel="noopener">מדיניות הפרטיות</a>.</span>
		</label>
	</section>
	<?php
}
add_action( 'woocommerce_before_checkout_form', 'justice_theme_render_checkout_compliance_notice', 5 );
add_action( 'woocommerce_before_checkout_billing_form', 'justice_theme_render_checkout_compliance_notice', 5 );
add_action( 'woocommerce_after_checkout_form', 'justice_theme_render_checkout_compliance_notice', 5 );
add_action( 'wp_footer', 'justice_theme_render_checkout_compliance_notice', 5 );
