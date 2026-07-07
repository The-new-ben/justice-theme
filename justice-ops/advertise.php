<?php
/**
 * Self-serve advertiser funnel: sell placements without the owner.
 *
 * /advertise/ renders the plan tiers and an application form. An application
 * creates a DRAFT justice_lawyer profile tagged advertiser_application and
 * mails the owner an approval link plus a prefilled WhatsApp reply to the
 * applicant. Approval (one admin action) publishes the profile, sets
 * priority_score by plan and starts the 30 day cycle; the existing card and
 * hub machinery picks the lawyer up instantly. A daily watchdog zeroes the
 * score of lapsed plans and mails the owner, so placement never runs unpaid.
 *
 * Payment runs in manual mode (instructions from options: transfer, bit,
 * WhatsApp) until the owner picks a processor; the plan/renewal lifecycle is
 * processor-agnostic by design.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_adv_plans(): array {
	return apply_filters( 'justice_adv_plans', array(
		'listing' => array(
			'label'  => 'רישום במדריך',
			'price'  => (int) get_option( 'justice_adv_price_listing', 0 ),
			'score'  => 0,
			'points' => array( 'פרופיל מאומת במדריך עורכי הדין', 'הופעה בתוצאות החיפוש הפנימי ובמפה', 'קבלת פניות מהאינדקס' ),
		),
		'featured' => array(
			'label'  => 'כרטיס מקודם',
			'price'  => (int) get_option( 'justice_adv_price_featured', 490 ),
			'score'  => 50,
			'points' => array( 'כל מה שברישום במדריך', 'כרטיס ממומן בתוך המאמרים בתחום שלכם', 'קדימות בעמודי התחום', 'דוח ביצועים חודשי: חשיפות ולחיצות' ),
		),
		'premium' => array(
			'label'  => 'חבילת פרימיום',
			'price'  => (int) get_option( 'justice_adv_price_premium', 990 ),
			'score'  => 100,
			'points' => array( 'כל מה שבכרטיס מקודם', 'מיקום ראשון בתחום, עד שלושה תחומים', 'מיני אתר מלא: וידאו, שאלות נפוצות, מפה ולידים ישירים', 'עדיפות בניתוב פניות מהטפסים' ),
		),
	) );
}

// ---------------------------------------------------------------------------
// The /advertise/ page
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	if ( get_option( 'justice_adv_page_id' ) ) {
		return;
	}

	$existing = get_page_by_path( 'advertise', OBJECT, 'page' );

	if ( $existing instanceof WP_Post ) {
		update_option( 'justice_adv_page_id', $existing->ID );
		return;
	}

	$page_id = wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'פרסום לעורכי דין: כרטיס מקודם ומיני אתר',
		'post_name'    => 'advertise',
		'post_content' => '[justice_advertise]',
	) );

	if ( $page_id && ! is_wp_error( $page_id ) ) {
		update_option( 'justice_adv_page_id', $page_id );
		update_post_meta( $page_id, 'seo_title', 'פרסום לעורכי דין: הצטרפות למדריך ולכרטיסים הממומנים | Jus-Tice' );
	}
} );

add_shortcode( 'justice_advertise', function () {
	$plans = justice_adv_plans();
	$sent  = isset( $_GET['adv'] ) ? sanitize_key( wp_unslash( $_GET['adv'] ) ) : '';

	ob_start();

	echo '<style>
	.jt-adv{max-width:1040px;margin:0 auto}
	.jt-adv__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:18px;margin:26px 0}
	.jt-adv__plan{border:1.5px solid transparent;border-radius:20px;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;box-shadow:0 16px 38px -22px rgba(13,23,54,.3);padding:24px 22px;display:flex;flex-direction:column}
	.jt-adv__plan h3{margin:0 0 4px;color:#14213d;font-size:20px}
	.jt-adv__price{font-size:26px;font-weight:800;color:#14213d;margin:2px 0 12px}
	.jt-adv__price small{font-size:13px;color:#6a7285;font-weight:600}
	.jt-adv__plan ul{margin:0 0 16px;padding-inline-start:18px;color:#3d4660;font-size:14.5px;line-height:1.7}
	.jt-adv__plan .jt-adv__cta{margin-top:auto;text-align:center;background:#14213d;color:#fff;border-radius:12px;padding:12px;font-weight:800;text-decoration:none}
	.jt-adv__plan .jt-adv__cta:hover{opacity:.93;color:#fff}
	.jt-adv__form{border:1px solid #e2e5ee;border-radius:18px;padding:24px;background:#f8fafd;margin-top:10px}
	.jt-adv__form .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
	.jt-adv__form label{font-weight:700;font-size:13.5px;color:#26324e;display:block;margin-bottom:4px}
	.jt-adv__form input,.jt-adv__form select,.jt-adv__form textarea{width:100%;border:1px solid #ccd3e2;border-radius:10px;padding:10px;font-size:15px;background:#fff}
	.jt-adv__form button{background:linear-gradient(180deg,#2ade70,#1fb355);border:0;color:#fff;font-weight:800;font-size:16px;border-radius:12px;padding:13px 26px;cursor:pointer;margin-top:14px}
	.jt-adv__ok{border:1.5px solid #0a7d2f;background:#f0faf3;color:#0a5c25;border-radius:14px;padding:16px 18px;margin:18px 0;font-weight:600}
	</style>';

	echo '<div class="jt-adv">';

	if ( 'sent' === $sent ) {
		echo '<div class="jt-adv__ok">הבקשה התקבלה. נחזור אליכם באותו יום עסקים עם אישור והנחיות תשלום. אפשר לזרז בוואטסאפ מהכפתור הצף.</div>';
	}

	echo '<div class="jt-adv__grid">';

	foreach ( $plans as $key => $plan ) {
		echo '<div class="jt-adv__plan"><h3>' . esc_html( $plan['label'] ) . '</h3>';
		echo '<p class="jt-adv__price">' . ( $plan['price'] > 0 ? number_format_i18n( $plan['price'] ) . ' ₪ <small>לחודש, לפני מעמ</small>' : 'ללא עלות' ) . '</p><ul>';
		foreach ( $plan['points'] as $point ) {
			echo '<li>' . esc_html( $point ) . '</li>';
		}
		echo '</ul><a class="jt-adv__cta" href="#jt-adv-form" data-plan="' . esc_attr( $key ) . '" onclick="document.getElementById(\'jt-adv-plan\').value=this.dataset.plan">בחירת מסלול</a></div>';
	}

	echo '</div>';

	echo '<div class="jt-adv__form" id="jt-adv-form"><h2 style="margin-top:0">טופס הצטרפות</h2>
	<form method="post" action="' . esc_url( admin_url( 'admin-post.php' ) ) . '">
	<input type="hidden" name="action" value="justice_advertise_apply">
	' . wp_nonce_field( 'justice_advertise_apply', 'jt_adv_nonce', true, false ) . '
	<div class="justice-lead-guard" aria-hidden="true" style="position:absolute;inset-inline-start:-9999px"><label>Company<input type="text" name="jt_adv_company" tabindex="-1" autocomplete="off" value=""></label></div>
	<input type="hidden" name="jt_adv_started_at" value="' . esc_attr( (string) time() ) . '">
	<div class="grid">
	<p><label for="adv-name">שם מלא</label><input id="adv-name" name="adv_name" type="text" required></p>
	<p><label for="adv-firm">שם המשרד</label><input id="adv-firm" name="adv_firm" type="text"></p>
	<p><label for="adv-license">מספר רישיון</label><input id="adv-license" name="adv_license" type="text" required></p>
	<p><label for="adv-phone">טלפון נייד</label><input id="adv-phone" name="adv_phone" type="tel" required></p>
	<p><label for="adv-email">אימייל</label><input id="adv-email" name="adv_email" type="email" required></p>
	<p><label for="adv-city">עיר המשרד</label><input id="adv-city" name="adv_city" type="text" required></p>
	<p><label for="jt-adv-plan">מסלול</label><select id="jt-adv-plan" name="adv_plan">';

	foreach ( $plans as $key => $plan ) {
		echo '<option value="' . esc_attr( $key ) . '">' . esc_html( $plan['label'] ) . '</option>';
	}

	echo '</select></p>
	<p><label for="adv-area">תחום עיקרי</label><select id="adv-area" name="adv_area">';

	foreach ( justice_cards_family_map() as $family => $slugs ) {
		$term = get_term_by( 'slug', $slugs[0], 'practice-areas' );
		echo '<option value="' . esc_attr( $slugs[0] ) . '">' . esc_html( $term ? $term->name : $family ) . '</option>';
	}

	echo '</select></p>
	</div>
	<p style="margin-top:12px"><label for="adv-notes">הערות</label><textarea id="adv-notes" name="adv_notes" rows="3"></textarea></p>
	<button type="submit">שליחת בקשת הצטרפות</button>
	<p style="font-size:12.5px;color:#6a7285;margin-top:10px">שליחת הטופס אינה כרוכה בתשלום. הפרופיל עולה לאוויר רק אחרי אימות רישיון ואישור.</p>
	</form></div></div>';

	return (string) ob_get_clean();
} );

// ---------------------------------------------------------------------------
// Application intake
// ---------------------------------------------------------------------------

function justice_adv_handle_apply(): void {
	if ( empty( $_POST['jt_adv_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['jt_adv_nonce'] ) ), 'justice_advertise_apply' ) ) {
		wp_die( 'Security check failed.' );
	}

	$back = wp_get_referer() ?: home_url( '/advertise/' );

	// Honeypot + bot floor, same doctrine as the lead guard.
	$honeypot = isset( $_POST['jt_adv_company'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['jt_adv_company'] ) ) ) : '';
	$started  = isset( $_POST['jt_adv_started_at'] ) ? absint( $_POST['jt_adv_started_at'] ) : 0;

	if ( '' !== $honeypot || ( $started && time() - $started >= 0 && time() - $started < 3 ) ) {
		wp_safe_redirect( add_query_arg( 'adv', 'blocked', $back ) );
		exit;
	}

	$name    = sanitize_text_field( wp_unslash( $_POST['adv_name'] ?? '' ) );
	$firm    = sanitize_text_field( wp_unslash( $_POST['adv_firm'] ?? '' ) );
	$license = sanitize_text_field( wp_unslash( $_POST['adv_license'] ?? '' ) );
	$phone   = sanitize_text_field( wp_unslash( $_POST['adv_phone'] ?? '' ) );
	$email   = sanitize_email( wp_unslash( $_POST['adv_email'] ?? '' ) );
	$city    = sanitize_text_field( wp_unslash( $_POST['adv_city'] ?? '' ) );
	$plan    = sanitize_key( wp_unslash( $_POST['adv_plan'] ?? 'featured' ) );
	$area    = sanitize_title( wp_unslash( $_POST['adv_area'] ?? '' ) );
	$notes   = sanitize_textarea_field( wp_unslash( $_POST['adv_notes'] ?? '' ) );

	if ( '' === $name || '' === $phone || '' === $license ) {
		wp_safe_redirect( add_query_arg( 'adv', 'missing', $back ) );
		exit;
	}

	$plans = justice_adv_plans();
	$plan  = isset( $plans[ $plan ] ) ? $plan : 'featured';

	$profile_id = wp_insert_post( array(
		'post_type'   => 'justice_lawyer',
		'post_status' => 'draft',
		'post_title'  => 'עו"ד ' . $name,
	) );

	if ( ! $profile_id || is_wp_error( $profile_id ) ) {
		wp_safe_redirect( add_query_arg( 'adv', 'error', $back ) );
		exit;
	}

	$stamp = wp_date( 'Y-m-d H:i' );

	update_post_meta( $profile_id, 'phone', $phone );
	update_post_meta( $profile_id, 'email', $email );
	update_post_meta( $profile_id, 'license_number', $license );
	update_post_meta( $profile_id, 'office_name', $firm );
	update_post_meta( $profile_id, 'source_type', 'advertiser_application' );
	update_post_meta( $profile_id, 'plan_type', $plan );
	update_post_meta( $profile_id, 'requested_city', $city );
	update_post_meta( $profile_id, 'internal_notes', $stamp . ' ADVERTISER_APPLICATION: plan ' . $plan . ', area ' . $area . ', city ' . $city . ( $notes ? ', notes: ' . $notes : '' ) );

	if ( $area && term_exists( $area, 'practice-areas' ) ) {
		wp_set_object_terms( $profile_id, $area, 'practice-areas' );
	}

	$owner_mail = get_option( 'admin_email' );
	$wa_reply   = 'https://wa.me/' . preg_replace( '/\D+/', '', '972' . ltrim( $phone, '0' ) ) . '?text=' . rawurlencode( 'שלום ' . $name . ', קיבלנו את בקשת ההצטרפות שלך לאתר Jus-Tice במסלול ' . $plans[ $plan ]['label'] . '. נשמח לתאם הפעלה.' );

	wp_mail(
		$owner_mail,
		'[Jus-Tice] בקשת פרסום חדשה: ' . $name . ' (' . $plans[ $plan ]['label'] . ')',
		"בקשת הצטרפות חדשה מטופס הפרסום:\n\n"
		. 'שם: ' . $name . "\n"
		. 'משרד: ' . $firm . "\n"
		. 'רישיון: ' . $license . "\n"
		. 'טלפון: ' . $phone . "\n"
		. 'אימייל: ' . $email . "\n"
		. 'עיר: ' . $city . "\n"
		. 'מסלול: ' . $plans[ $plan ]['label'] . ' (' . $plans[ $plan ]['price'] . " ש\"ח)\n"
		. 'תחום: ' . $area . "\n\n"
		. 'אישור והפעלה: ' . admin_url( 'edit.php?post_type=justice_lawyer&page=justice-advertise' ) . "\n"
		. 'תשובה מהירה בוואטסאפ: ' . $wa_reply
	);

	wp_safe_redirect( add_query_arg( 'adv', 'sent', $back . '#jt-adv-form' ) );
	exit;
}
add_action( 'admin_post_justice_advertise_apply', 'justice_adv_handle_apply' );
add_action( 'admin_post_nopriv_justice_advertise_apply', 'justice_adv_handle_apply' );

// ---------------------------------------------------------------------------
// Approval, lifecycle, watchdog
// ---------------------------------------------------------------------------

/**
 * Activate a plan on a profile: publish, score, gate fields, renewal date.
 */
function justice_adv_activate( int $profile_id, string $plan_key ): array {
	$plans = justice_adv_plans();

	if ( ! isset( $plans[ $plan_key ] ) || 'justice_lawyer' !== get_post_type( $profile_id ) ) {
		return array( 'ok' => false, 'why' => 'bad plan or profile' );
	}

	$plan = $plans[ $plan_key ];

	wp_update_post( array( 'ID' => $profile_id, 'post_status' => 'publish' ) );
	update_post_meta( $profile_id, 'plan_type', $plan_key );
	update_post_meta( $profile_id, 'profile_status', 'active' );
	update_post_meta( $profile_id, 'subscription_status', 'active' );
	update_post_meta( $profile_id, 'priority_score', (string) $plan['score'] );
	update_post_meta( $profile_id, 'plan_started_at', wp_date( 'Y-m-d' ) );
	update_post_meta( $profile_id, 'plan_renews_at', wp_date( 'Y-m-d', time() + 30 * DAY_IN_SECONDS ) );

	$notes = (string) get_post_meta( $profile_id, 'internal_notes', true );
	update_post_meta( $profile_id, 'internal_notes', $notes . "\n" . wp_date( 'Y-m-d H:i' ) . ' PLAN_ACTIVATED: ' . $plan_key . ', score ' . $plan['score'] );

	return array( 'ok' => true, 'score' => $plan['score'], 'renews' => (string) get_post_meta( $profile_id, 'plan_renews_at', true ) );
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/advertiser-activate', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			return justice_adv_activate( (int) $request->get_param( 'id' ), sanitize_key( (string) $request->get_param( 'plan' ) ) );
		},
	) );
} );

/**
 * Admin screen: applications queue + active advertisers.
 */
add_action( 'admin_menu', function () {
	add_submenu_page( 'edit.php?post_type=justice_lawyer', 'Justice Advertise', 'Justice Advertise', 'manage_options', 'justice-advertise', function () {
		if ( isset( $_GET['activate'], $_GET['plan'], $_GET['_wpnonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ), 'jt_adv_activate' ) ) {
			$done = justice_adv_activate( absint( $_GET['activate'] ), sanitize_key( wp_unslash( $_GET['plan'] ) ) );
			echo '<div class="notice notice-' . ( $done['ok'] ? 'success' : 'error' ) . '"><p>' . ( $done['ok'] ? 'הפרופיל הופעל. ציון: ' . (int) $done['score'] . ', חידוש: ' . esc_html( $done['renews'] ) : esc_html( $done['why'] ) ) . '</p></div>';
		}

		$apps = get_posts( array(
			'post_type'   => 'justice_lawyer',
			'post_status' => 'draft',
			'numberposts' => 50,
			'meta_key'    => 'source_type',
			'meta_value'  => 'advertiser_application',
		) );

		echo '<div class="wrap"><h1>Justice Advertise</h1><h2>בקשות ממתינות</h2>';

		if ( ! $apps ) {
			echo '<p>אין בקשות ממתינות.</p>';
		} else {
			echo '<table class="widefat striped"><thead><tr><th>שם</th><th>טלפון</th><th>רישיון</th><th>מסלול מבוקש</th><th>הפעלה</th></tr></thead><tbody>';
			foreach ( $apps as $app ) {
				$plan = (string) get_post_meta( $app->ID, 'plan_type', true );
				echo '<tr><td><a href="' . esc_url( get_edit_post_link( $app->ID ) ) . '">' . esc_html( get_the_title( $app->ID ) ) . '</a></td>';
				echo '<td>' . esc_html( (string) get_post_meta( $app->ID, 'phone', true ) ) . '</td>';
				echo '<td>' . esc_html( (string) get_post_meta( $app->ID, 'license_number', true ) ) . '</td>';
				echo '<td>' . esc_html( $plan ) . '</td><td>';
				foreach ( array_keys( justice_adv_plans() ) as $pk ) {
					echo '<a class="button' . ( $pk === $plan ? ' button-primary' : '' ) . '" style="margin-inline-end:6px" href="' . esc_url( wp_nonce_url( add_query_arg( array( 'activate' => $app->ID, 'plan' => $pk ) ), 'jt_adv_activate' ) ) . '">' . esc_html( $pk ) . '</a>';
				}
				echo '</td></tr>';
			}
			echo '</tbody></table>';
		}

		$active = get_posts( array(
			'post_type'   => 'justice_lawyer',
			'post_status' => 'publish',
			'numberposts' => 100,
			'meta_query'  => array( array( 'key' => 'plan_renews_at', 'compare' => 'EXISTS' ) ),
		) );

		echo '<h2 style="margin-top:30px">מנויים פעילים</h2>';

		if ( ! $active ) {
			echo '<p>אין מנויים עם מחזור חידוש עדיין.</p>';
		} else {
			echo '<table class="widefat striped"><thead><tr><th>שם</th><th>מסלול</th><th>ציון</th><th>חידוש</th><th>פעולה</th></tr></thead><tbody>';
			foreach ( $active as $adv ) {
				$renews = (string) get_post_meta( $adv->ID, 'plan_renews_at', true );
				$lapsed = $renews && $renews < wp_date( 'Y-m-d' );
				echo '<tr' . ( $lapsed ? ' style="background:#fdecec"' : '' ) . '><td>' . esc_html( get_the_title( $adv->ID ) ) . '</td>';
				echo '<td>' . esc_html( (string) get_post_meta( $adv->ID, 'plan_type', true ) ) . '</td>';
				echo '<td>' . esc_html( (string) get_post_meta( $adv->ID, 'priority_score', true ) ) . '</td>';
				echo '<td>' . esc_html( $renews ) . ( $lapsed ? ' (פג)' : '' ) . '</td>';
				echo '<td><a class="button" href="' . esc_url( wp_nonce_url( add_query_arg( array( 'activate' => $adv->ID, 'plan' => (string) get_post_meta( $adv->ID, 'plan_type', true ) ) ), 'jt_adv_activate' ) ) . '">חידוש 30 יום</a></td></tr>';
			}
			echo '</tbody></table>';
		}

		echo '<h2 style="margin-top:30px">הנחיות תשלום (מוצגות למצטרפים)</h2><p>עריכה: Settings > Justice Cards. מצב תשלום נוכחי: ידני (העברה / ביט / וואטסאפ). חיבור סליקה אוטומטי יתווסף כשתיבחר חברת סליקה.</p></div>';
	} );
} );

/**
 * Daily watchdog: lapsed plans lose their score, owner gets one mail per
 * profile per lapse. Rides the hourly monitor tick at 07:00 local.
 */
add_action( 'justice_monitor_tick', function () {
	if ( 7 !== (int) wp_date( 'H' ) ) {
		return;
	}

	$today  = wp_date( 'Y-m-d' );
	$lapsed = get_posts( array(
		'post_type'   => 'justice_lawyer',
		'post_status' => 'publish',
		'numberposts' => 50,
		'meta_query'  => array(
			array( 'key' => 'plan_renews_at', 'value' => wp_date( 'Y-m-d', time() - 3 * DAY_IN_SECONDS ), 'compare' => '<' ),
			array( 'key' => 'priority_score', 'value' => '0', 'compare' => '>' ),
		),
	) );

	foreach ( $lapsed as $profile ) {
		update_post_meta( $profile->ID, 'priority_score', '0' );
		update_post_meta( $profile->ID, 'subscription_status', 'lapsed' );

		$notes = (string) get_post_meta( $profile->ID, 'internal_notes', true );
		update_post_meta( $profile->ID, 'internal_notes', $notes . "\n" . $today . ' PLAN_LAPSED: score zeroed by watchdog' );

		wp_mail(
			get_option( 'admin_email' ),
			'[Jus-Tice] מנוי פרסום פג: ' . get_the_title( $profile->ID ),
			'תאריך החידוש עבר לפני יותר משלושה ימים. הציון אופס והכרטיס ירד מהמאמרים. חידוש מהיר: ' . admin_url( 'edit.php?post_type=justice_lawyer&page=justice-advertise' )
		);
	}
} );
