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
			'label'       => 'פרופיל בסיסי',
			'price'       => 'ללא תשלום',
			'badge'       => 'כניסה למערכת',
			'description' => 'פרופיל טיוטה, בדיקת התאמה ונוכחות ראשונית במדריך לאחר אישור.',
			'features'    => array(
				'עמוד פרופיל בסיסי',
				'תחומי עיסוק ופרטי קשר לאחר בדיקה',
				'אפשרות שדרוג עתידית למסלול מסחרי',
			),
		),
		'pro' => array(
			'label'       => 'מיני-סייט מקצועי',
			'price'       => 'מחיר ייקבע לאחר אישור מסחרי',
			'badge'       => 'מומלץ להשקה',
			'description' => 'עמוד עשיר לעורך דין עם ביוגרפיה, וידאו, שירותים, שאלות נפוצות ותוכן חתום.',
			'features'    => array(
				'מיני-סייט עשיר וממותג',
				'וידאו, קישורים חברתיים ותוכן מקצועי',
				'חיבור למאמרים ותחומי התמחות',
			),
		),
		'featured' => array(
			'label'       => 'חשיפה מוגברת',
			'price'       => 'מותנה במדיניות פרסום',
			'badge'       => 'חשיפה',
			'description' => 'אפשרות להצגה בולטת באזורים רלוונטיים, רק לאחר כללי גילוי נאות ואישור.',
			'features'    => array(
				'מיקום בולט באזורים רלוונטיים',
				'גילוי נאות לפרסום ממומן',
				'מדידת חשיפה ופניות',
			),
		),
		'lead_partner' => array(
			'label'       => 'שותף לידים',
			'price'       => 'לא להפעלה לפני בדיקה אתית',
			'badge'       => 'לידים',
			'description' => 'חיבור לפניות מתאימות לפי תחום ועיר, בכפוף לכללים משפטיים ואתיים.',
			'features'    => array(
				'תיבת לידים ושיוך פניות',
				'מגבלת לידים חודשית לפי מסלול',
				'מעקב סטטוס והמרות',
			),
		),
		'full_service' => array(
			'label'       => 'שירות מלא',
			'price'       => 'מסלול פרימיום',
			'badge'       => 'מלא',
			'description' => 'תפעול רחב יותר: תוכן, פרופיל, אופטימיזציה, מדידה ובניית נכס מקצועי.',
			'features'    => array(
				'ניהול תוכן ומאמרים',
				'שיפור מיני-סייט שוטף',
				'דוחות חשיפה ולידים',
			),
		),
	);
}

function justice_theme_lawyer_plan_public_overrides( string $plan_key ): array {
	$overrides = array(
		'pro'          => array(
			'price'           => '₪349 לחודש כולל מע"מ',
			'features_append' => array(
				'עד 5 פניות תואמות בחודש',
				'דוח חשיפה חודשי לעורך הדין',
			),
		),
		'featured'     => array(
			'price'           => '₪749 לחודש כולל מע"מ',
			'features_append' => array(
				'עד 15 פניות תואמות בחודש',
				'מיקום מועדף עם גילוי "פרופיל ממומן"',
			),
		),
		'lead_partner' => array(
			'price'           => '₪1,490 לחודש כולל מע"מ',
			'features_append' => array(
				'עד 40 פניות תואמות בחודש',
				'תיעדוף ניתוב לפי תחום, עיר וזמינות',
			),
		),
		'full_service' => array(
			'price'           => '₪2,490 לחודש כולל מע"מ',
			'features_append' => array(
				'עד 80 פניות תואמות בחודש',
				'ניהול תוכן, אופטימיזציה ודוח ערך חודשי',
			),
		),
	);

	return $overrides[ $plan_key ] ?? array();
}

function justice_theme_plan_product_id( string $plan_key ): int {
	$product_ids = get_option( 'justice_lawyer_plan_product_ids', array() );

	if ( ! is_array( $product_ids ) || empty( $product_ids[ $plan_key ] ) ) {
		return 0;
	}

	return absint( $product_ids[ $plan_key ] );
}

function justice_theme_plan_checkout_ready( string $plan_key ): bool {
	$product_id = justice_theme_plan_product_id( $plan_key );

	if ( ! $product_id || ! function_exists( 'wc_get_checkout_url' ) || ! function_exists( 'wc_get_product' ) ) {
		return false;
	}

	if ( ! class_exists( 'WC_Subscriptions' ) && ! function_exists( 'wcs_get_subscriptions' ) ) {
		return false;
	}

	$product = wc_get_product( $product_id );

	if ( ! $product || ! $product->is_purchasable() ) {
		return false;
	}

	return true;
}

function justice_theme_any_paid_plan_checkout_ready(): bool {
	foreach ( array( 'pro', 'featured', 'lead_partner', 'full_service' ) as $plan_key ) {
		if ( justice_theme_plan_checkout_ready( $plan_key ) ) {
			return true;
		}
	}

	return false;
}

function justice_theme_plan_checkout_url( string $plan_key ): string {
	$product_id = justice_theme_plan_product_id( $plan_key );

	if ( $product_id && justice_theme_plan_checkout_ready( $plan_key ) ) {
		return add_query_arg( 'add-to-cart', $product_id, wc_get_checkout_url() );
	}

	return add_query_arg(
		array(
			'plan_interest' => $plan_key,
			'pre_checkout'  => '1',
		),
		home_url( '/lawyer-registration/' )
	);
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
