<?php
/**
 * Lawyer plan definitions and safe WooCommerce mapping helpers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_lawyer_plans(): array {
	return array(
		'free' => array(
			'label'             => 'פרופיל בסיסי',
			'price'             => 'ללא תשלום',
			'price_monthly_ils' => 0,
			'leads_per_month'   => 0,
			'badge'             => 'כניסה למערכת',
			'description'       => 'פרופיל טיוטה, בדיקת התאמה ונוכחות ראשונית במדריך לאחר אישור.',
			'features'          => array(
				'עמוד פרופיל בסיסי לאחר אישור',
				'תחומי עיסוק ופרטי קשר ציבוריים',
				'ללא קבלת לידים מהמערכת',
				'אפשרות שדרוג בכל עת',
			),
		),
		'pro' => array(
			'label'             => 'מיני-סייט מקצועי',
			'price'             => '₪349 לחודש',
			'price_monthly_ils' => 349,
			'leads_per_month'   => 5,
			'badge'             => 'מומלץ להשקה',
			'description'       => 'עמוד עשיר לעורך דין עם ביוגרפיה, וידאו, שירותים, שאלות נפוצות ותוכן חתום.',
			'features'          => array(
				'מיני-סייט עשיר וממותג',
				'תמונה, וידאו, שירותים, תהליך עבודה ושאלות נפוצות',
				'עד 5 לידים תואמים בחודש',
				'חיבור למאמרים ותחומי התמחות',
				'מעקב צפיות בדשבורד האישי',
				'דוח חשיפה חודשי',
			),
		),
		'featured' => array(
			'label'             => 'חשיפה מוגברת',
			'price'             => '₪749 לחודש',
			'price_monthly_ils' => 749,
			'leads_per_month'   => 15,
			'badge'             => 'חשיפה',
			'description'       => 'מיני-סייט מקצועי + הצגה מועדפת בעמודי תחום ועיר, עם גילוי נאות "ממומן".',
			'features'          => array(
				'כל מה שכלול במיני-סייט מקצועי',
				'מיקום מועדף בעמודי תחום ועיר רלוונטיים',
				'תווית "פרופיל ממומן" עם גילוי נאות',
				'עד 15 לידים תואמים בחודש',
				'אנליטיקת קליקים, שיחות וטפסים',
				'תמיכת WhatsApp / phone tracking',
			),
		),
		'lead_partner' => array(
			'label'             => 'שותף לידים',
			'price'             => '₪1,490 לחודש',
			'price_monthly_ils' => 1490,
			'leads_per_month'   => 40,
			'badge'             => 'לידים',
			'description'       => 'מסלול מבוסס לידים: כל מה שכלול ב"חשיפה מוגברת" + נפח לידים גבוה ותעדוף בניתוב.',
			'features'          => array(
				'כל מה שכלול ב"חשיפה מוגברת"',
				'עד 40 לידים תואמים בחודש',
				'תעדוף ראשון בניתוב לפי תחום + עיר',
				'התראת WhatsApp / SMS על ליד חדש',
				'SLA מענה ראשוני 60 דקות',
				'דוח לידים חודשי עם סטטוס המרה',
			),
		),
		'full_service' => array(
			'label'             => 'שירות מלא',
			'price'             => '₪2,490 לחודש',
			'price_monthly_ils' => 2490,
			'leads_per_month'   => 80,
			'badge'             => 'מלא',
			'description'       => 'תפעול מקיף: תוכן חתום, אופטימיזציה, וידאו, ניהול מוניטין ודוחות מתקדמים.',
			'features'          => array(
				'כל מה שכלול ב"שותף לידים"',
				'עד 80 לידים תואמים בחודש',
				'2 מאמרים חתומים בחודש על ידי צוות עריכה',
				'אופטימיזציית מיני-סייט שוטפת',
				'ניהול קישור Google Reviews ופרופיל מאומת',
				'דוח חודשי מקיף: SEO, לידים, חשיפה והמלצה לפעולה',
				'מנהל הצלחת לקוח אחראי',
			),
		),
	);
}

/**
 * Leads-per-month cap for a given plan key.
 * Returns 0 for free / unknown plans (no automated lead routing).
 */
function justice_theme_plan_leads_per_month( string $plan_key ): int {
	$plans = justice_theme_lawyer_plans();
	if ( ! isset( $plans[ $plan_key ]['leads_per_month'] ) ) {
		return 0;
	}
	return (int) $plans[ $plan_key ]['leads_per_month'];
}

/**
 * Monthly price in ILS for a given plan key. 0 for free / unknown.
 */
function justice_theme_plan_price_monthly_ils( string $plan_key ): int {
	$plans = justice_theme_lawyer_plans();
	if ( ! isset( $plans[ $plan_key ]['price_monthly_ils'] ) ) {
		return 0;
	}
	return (int) $plans[ $plan_key ]['price_monthly_ils'];
}

function justice_theme_plan_product_id( string $plan_key ): int {
	$product_ids = get_option( 'justice_lawyer_plan_product_ids', array() );

	if ( ! is_array( $product_ids ) || empty( $product_ids[ $plan_key ] ) ) {
		return 0;
	}

	return absint( $product_ids[ $plan_key ] );
}

function justice_theme_plan_checkout_url( string $plan_key ): string {
	$product_id = justice_theme_plan_product_id( $plan_key );

	// Free plan always points at registration.
	if ( 'free' === $plan_key ) {
		return add_query_arg( 'plan_interest', $plan_key, home_url( '/lawyer-registration/' ) );
	}

	// Paid plan with WooCommerce wired: only send a user to checkout if they
	// are logged in AND already have a linked justice_lawyer profile. This
	// prevents the "lawyer paid but no profile exists" orphan that the bridge
	// would otherwise fail to connect.
	if ( $product_id && function_exists( 'wc_get_checkout_url' ) ) {
		$user_has_profile = false;

		if ( is_user_logged_in() && function_exists( 'justice_theme_lawyer_profile_for_user' ) ) {
			$user_has_profile = (bool) justice_theme_lawyer_profile_for_user( get_current_user_id() );
		}

		if ( $user_has_profile ) {
			return add_query_arg( 'add-to-cart', $product_id, wc_get_checkout_url() );
		}

		// Send to registration first, carrying the plan intent. After magic-
		// link login the lawyer can come back to /lawyer-plans/ and the
		// checkout link will resolve correctly because the profile exists.
		return add_query_arg(
			array(
				'plan_interest' => $plan_key,
				'pre_checkout'  => '1',
			),
			home_url( '/lawyer-registration/' )
		);
	}

	// No product mapped yet → registration fallback (existing behaviour).
	return add_query_arg( 'plan_interest', $plan_key, home_url( '/lawyer-registration/' ) );
}

function justice_theme_seed_lawyer_plans_page(): void {
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_lawyer_plans_page_seed' ) || get_option( 'justice_lawyer_plans_page_seeded_v1' ) ) {
		return;
	}

	if ( get_page_by_path( 'lawyer-plans', OBJECT, 'page' ) ) {
		update_option( 'justice_lawyer_plans_page_seeded_v1', 1, false );
		return;
	}

	wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_name'    => 'lawyer-plans',
		'post_title'   => 'מסלולים לעורכי דין',
		'post_content' => '',
		'meta_input'   => array(
			'_wp_page_template' => 'page-lawyer-plans.php',
		),
	) );

	update_option( 'justice_lawyer_plans_page_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_lawyer_plans_page' );
