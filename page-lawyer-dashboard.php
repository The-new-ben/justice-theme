<?php
/**
 * Template Name: Lawyer Dashboard
 *
 * @package JusticeTheme
 */

get_header();

echo "\n" . '<!-- justice-dashboard-first-value-v1 -->' . "\n";

if ( ! is_user_logged_in() ) :
	$dashboard_permalink        = justice_theme_public_permalink( get_the_ID() );
	$dashboard_login_url        = wp_login_url( $dashboard_permalink );
	$dashboard_plans_url        = justice_theme_public_url( add_query_arg(
		array(
			'utm_source'   => 'lawyer_dashboard_gate',
			'utm_medium'   => 'personal_area',
			'utm_campaign' => 'lawyer_acquisition',
		),
		home_url( '/lawyer-plans/' )
	) );
	$dashboard_registration_url = justice_theme_public_url( add_query_arg(
		array(
			'plan_interest'    => 'pro',
			'pre_checkout'     => '1',
			'payment_path'     => 'manual_invoice',
			'utm_source'       => 'lawyer_dashboard_gate',
			'utm_medium'       => 'personal_area',
			'utm_campaign'     => 'lawyer_acquisition',
			'outreach_segment' => 'dashboard_logged_out',
		),
		home_url( '/lawyer-registration/' )
	) );
	?>
	<section class="lawyer-dashboard lawyer-dashboard--logged-out section">
		<div class="container lawyer-dashboard__gate">
			<p class="section-header__eyebrow"><?php esc_html_e( 'אזור אישי לעורכי דין', 'justice-theme' ); ?></p>
			<h1><?php esc_html_e( 'התחברו כדי לנהל את הנוכחות שלכם ב-Jus-Tice', 'justice-theme' ); ?></h1>
			<p><?php esc_html_e( 'האזור האישי מרכז את הפרופיל, הלידים, התוכן, סטטוס המנוי ובקשות השירות במקום אחד. פרסום ועדכונים מהותיים עוברים בדיקה לפני עלייה לאתר.', 'justice-theme' ); ?></p>
			<ul class="lawyer-dashboard__gate-points" aria-label="<?php esc_attr_e( 'מה מחכה באזור האישי', 'justice-theme' ); ?>">
				<li><?php esc_html_e( 'מעקב אחרי פניות ולידים שהגיעו מהאתר.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'בקשת עדכונים לפרופיל המקצועי, תחומי עיסוק ופרטי קשר בלי כניסה לוורדפרס.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'בקשות לתוכן חתום, המלצות Google וחיבור לספקים מקצועיים תחת בקרת מערכת.', 'justice-theme' ); ?></li>
			</ul>
			<div class="lawyer-dashboard__actions">
				<a class="button button--gold" href="<?php echo esc_url( $dashboard_login_url ); ?>"><?php esc_html_e( 'התחברות לאזור האישי', 'justice-theme' ); ?></a>
				<a class="button button--outline" href="<?php echo esc_url( $dashboard_plans_url ); ?>"><?php esc_html_e( 'בחירת מסלול לעורך דין', 'justice-theme' ); ?></a>
				<a class="button button--outline" href="<?php echo esc_url( $dashboard_registration_url ); ?>"><?php esc_html_e( 'בקשת הצטרפות מהירה', 'justice-theme' ); ?></a>
			</div>
			<div class="lawyer-dashboard-payment-proof-preview" data-revenue-surface="lawyer_dashboard_payment_proof_preview" data-dashboard-step="manual_invoice_to_paid_dashboard" aria-label="<?php esc_attr_e( 'מסלול חשבונית ותשלום לפני הפעלת לידים', 'justice-theme' ); ?>">
				<div class="lawyer-dashboard-payment-proof-preview__intro">
					<span><?php esc_html_e( 'מסלול תשלום מבוקר', 'justice-theme' ); ?></span>
					<h2><?php esc_html_e( 'מה יופיע באזור האישי לפני הפעלת לידים בתשלום', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'האזור האישי לא מסמן עורך דין כמשלם רק בגלל בקשת הצטרפות. הוא מציג שלבי חשבונית, קישור תשלום, אסמכתא והוכחת תשלום לפני שיוך לידים מסחריים.', 'justice-theme' ); ?></p>
				</div>
				<ol class="lawyer-dashboard-payment-proof-preview__steps">
					<li data-dashboard-state="invoice_requested">
						<strong><?php esc_html_e( 'בקשת חשבונית', 'justice-theme' ); ?></strong>
						<span><?php esc_html_e( 'המערכת שומרת מסלול, תחום, עיר ופרטי חיוב לפני שליחת דרישת תשלום.', 'justice-theme' ); ?></span>
					</li>
					<li data-dashboard-state="invoice_sent">
						<strong><?php esc_html_e( 'חשבונית או קישור נשלחו', 'justice-theme' ); ?></strong>
						<span><?php esc_html_e( 'האזור האישי מציג את הפעולה הבאה ואת מועד המעקב, בלי להציג את זה כהכנסה.', 'justice-theme' ); ?></span>
					</li>
					<li data-dashboard-state="payment_evidence_required">
						<strong><?php esc_html_e( 'נדרשת הוכחת תשלום', 'justice-theme' ); ?></strong>
						<span><?php esc_html_e( 'סטטוס משלם מופעל רק אחרי אסמכתא פרטית, תאריך תשלום ואישור בעלים.', 'justice-theme' ); ?></span>
					</li>
					<li data-dashboard-state="lead_routing_after_paid">
						<strong><?php esc_html_e( 'שיוך לידים אחרי אישור', 'justice-theme' ); ?></strong>
						<span><?php esc_html_e( 'רק לאחר אישור תשלום ניתן לחבר לידים, דוחות ערך ופעולות שימור לעורך הדין.', 'justice-theme' ); ?></span>
					</li>
				</ol>
			</div>
			<div class="lawyer-dashboard-login-preview" aria-label="<?php esc_attr_e( 'תצוגה מקדימה של האזור האישי', 'justice-theme' ); ?>">
				<article class="lawyer-dashboard-login-preview__card">
					<span><?php esc_html_e( 'פרופיל מקצועי', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'פרופיל עורך דין שנבנה להמרת תנועה מחיפוש', 'justice-theme' ); ?></strong>
					<p><?php esc_html_e( 'בקשות לעדכון כותרת, תחומי עיסוק, תהליך עבודה, וידאו ושאלות נפוצות. שינוי ציבורי עולה רק אחרי בדיקה.', 'justice-theme' ); ?></p>
				</article>
				<article class="lawyer-dashboard-login-preview__card">
					<span><?php esc_html_e( 'תשלום וחשבונית', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'הפעלה ידנית עד אישור חיוב מחזורי', 'justice-theme' ); ?></strong>
					<p><?php esc_html_e( 'האזור האישי מציג סטטוס מסלול, בקשות חשבונית ופעולת תשלום נוכחית בלי לחשוף את ניהול וורדפרס.', 'justice-theme' ); ?></p>
				</article>
				<article class="lawyer-dashboard-login-preview__card">
					<span><?php esc_html_e( 'לידים ומעקב', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'שיחות, WhatsApp ודיווח צנרת במקום אחד', 'justice-theme' ); ?></strong>
					<p><?php esc_html_e( 'לידים משויכים מופיעים עם פעולות קשר ודיווח סטטוס פשוט, כדי להראות ערך כבר אחרי השיחות הראשונות.', 'justice-theme' ); ?></p>
				</article>
				<article class="lawyer-dashboard-login-preview__card">
					<span><?php esc_html_e( 'שירות ושינויים', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'שדרוג, הורדה, ביטול, החזר ותלונה', 'justice-theme' ); ?></strong>
					<p><?php esc_html_e( 'שינויי מנוי נשמרים כבקשות שירות לבדיקת בעלים, עם דחיפות ויעד תגובה ברור.', 'justice-theme' ); ?></p>
				</article>
			</div>
		</div>
	</section>
	<?php
	get_footer();
	return;
endif;

$user_id  = get_current_user_id();
$profiles = post_type_exists( 'justice_lawyer' )
	? new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 10,
		'orderby'        => 'modified',
		'order'          => 'DESC',
		'meta_query'     => array(
			array(
				'key'   => 'claimed_by_user_id',
				'value' => (string) $user_id,
			),
		),
	) )
	: null;

$profile_ids = array();
if ( $profiles && $profiles->have_posts() ) {
	foreach ( $profiles->posts as $profile_post ) {
		$profile_ids[] = (int) $profile_post->ID;
	}
}

$leads = ( post_type_exists( 'justice_lead' ) && $profile_ids )
	? new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => 8,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			array(
				'key'     => 'assigned_lawyer_id',
				'value'   => $profile_ids,
				'compare' => 'IN',
			),
		),
	) )
	: null;

$lead_count = $leads ? (int) $leads->found_posts : 0;
$profile_views_total = 0;

foreach ( $profile_ids as $profile_id ) {
	$profile_views_total += (int) get_post_meta( $profile_id, 'profile_views', true );
}

$content_requests = ( post_type_exists( 'articles' ) && $profile_ids )
	? new WP_Query( array(
		'post_type'      => 'articles',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 8,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			'relation' => 'AND',
			array(
				'key'   => 'content_status',
				'value' => 'lawyer_requested_draft',
			),
			array(
				'key'     => 'requested_by_lawyer_id',
				'value'   => $profile_ids,
				'compare' => 'IN',
			),
		),
	) )
	: null;

$content_request_count = $content_requests ? (int) $content_requests->found_posts : 0;
$primary_profile_id     = $profile_ids ? (int) $profile_ids[0] : 0;
$primary_completeness   = $primary_profile_id ? justice_theme_lawyer_dashboard_profile_completeness( $primary_profile_id ) : 0;
$activation_status      = $primary_profile_id ? ( get_post_meta( $primary_profile_id, 'activation_status', true ) ?: 'registered' ) : 'registered';
$subscription_status    = $primary_profile_id ? ( get_post_meta( $primary_profile_id, 'subscription_status', true ) ?: 'pending' ) : 'pending';
$growth_assets          = $primary_profile_id ? justice_theme_lawyer_dashboard_growth_assets( $primary_profile_id, $lead_count, $content_request_count, $profile_views_total ) : array();
$completed_growth_assets = count( array_filter( $growth_assets, static function ( array $asset ): bool {
	return ! empty( $asset['done'] );
} ) );
$next_growth_asset = array_values( array_filter( $growth_assets, static function ( array $asset ): bool {
	return empty( $asset['done'] ) && ! empty( $asset['action_url'] ) && ! empty( $asset['action_label'] );
} ) );
$next_growth_asset = $next_growth_asset[0] ?? null;
$first_value_steps      = array(
	array(
		'label' => __( 'פרופיל מקושר לחשבון', 'justice-theme' ),
		'done'  => (bool) $primary_profile_id,
	),
	array(
		'label' => __( 'פרופיל מוכן לבדיקה', 'justice-theme' ),
		'done'  => 70 <= $primary_completeness,
	),
	array(
		'label' => __( 'חשיפה ראשונה נמדדה', 'justice-theme' ),
		'done'  => 0 < $profile_views_total,
	),
	array(
		'label' => __( 'ליד או פנייה שויכו', 'justice-theme' ),
		'done'  => 0 < $lead_count,
	),
	array(
		'label' => __( 'תוכן או שיפור פרופיל בטיפול', 'justice-theme' ),
		'done'  => 0 < $content_request_count,
	),
);
$completed_first_value_steps = count( array_filter( $first_value_steps, static function ( array $step ): bool {
	return ! empty( $step['done'] );
} ) );
$payment_status_text = in_array( $subscription_status, array( 'active', 'paid', 'trialing' ), true )
	? __( 'תשלום פעיל לפי סטטוס המנוי.', 'justice-theme' )
	: __( 'תשלום וסליקה עדיין לא פעילים עד אישור מסחרי, חשבוניות וכללי חיוב.', 'justice-theme' );
$primary_plan_key           = $primary_profile_id ? ( get_post_meta( $primary_profile_id, 'plan_type', true ) ?: 'free' ) : 'free';
$primary_payment_path       = $primary_profile_id ? (string) get_post_meta( $primary_profile_id, 'payment_path', true ) : '';
$primary_payment_followup   = $primary_profile_id ? (string) get_post_meta( $primary_profile_id, 'payment_followup_status', true ) : '';
$primary_payment_due_at     = $primary_profile_id ? (string) get_post_meta( $primary_profile_id, 'payment_followup_due_at', true ) : '';
$primary_manual_payment_link = $primary_profile_id ? (string) get_post_meta( $primary_profile_id, 'manual_payment_link_url', true ) : '';
$primary_invoice_reference  = $primary_profile_id ? (string) get_post_meta( $primary_profile_id, 'manual_invoice_reference', true ) : '';
$service_request_options    = function_exists( 'justice_theme_lawyer_service_request_options' ) ? justice_theme_lawyer_service_request_options() : array();
$service_urgency_options    = function_exists( 'justice_theme_lawyer_service_request_urgency_options' ) ? justice_theme_lawyer_service_request_urgency_options() : array();
$latest_service_request     = $primary_profile_id ? array(
	'id'            => (string) get_post_meta( $primary_profile_id, 'latest_service_request_id', true ),
	'type'          => (string) get_post_meta( $primary_profile_id, 'latest_service_request_type', true ),
	'subject'       => (string) get_post_meta( $primary_profile_id, 'latest_service_request_subject', true ),
	'desired_plan'  => (string) get_post_meta( $primary_profile_id, 'latest_service_request_desired_plan', true ),
	'urgency'       => (string) get_post_meta( $primary_profile_id, 'latest_service_request_urgency', true ),
	'status'        => (string) get_post_meta( $primary_profile_id, 'latest_service_request_status', true ),
	'submitted_at'  => (string) get_post_meta( $primary_profile_id, 'latest_service_request_submitted_at', true ),
) : array();
$latest_service_request_sla = '';

if ( ! empty( $latest_service_request['id'] ) ) {
	$latest_service_request_sla = array(
		'urgent'     => __( 'Owner review target: today.', 'justice-theme' ),
		'this_week'  => __( 'Owner review target: within 2 business days.', 'justice-theme' ),
		'next_cycle' => __( 'Owner review target: before the next billing cycle.', 'justice-theme' ),
		'not_urgent' => __( 'Owner review target: within 5 business days.', 'justice-theme' ),
	)[ $latest_service_request['urgency'] ] ?? __( 'Owner review target: queued for manual review.', 'justice-theme' );
}

$dashboard_plan_definitions = function_exists( 'justice_theme_lawyer_plans' ) ? justice_theme_lawyer_plans() : array();
$primary_plan_label         = $dashboard_plan_definitions[ $primary_plan_key ]['label'] ?? $primary_plan_key;
$primary_paid_plan_key      = ( $primary_plan_key && 'free' !== $primary_plan_key && isset( $dashboard_plan_definitions[ $primary_plan_key ] ) ) ? $primary_plan_key : '';
$primary_payment_options    = function_exists( 'justice_theme_lawyer_payment_followup_options' ) ? justice_theme_lawyer_payment_followup_options() : array(
	'invoice_requested' => __( 'Invoice requested', 'justice-theme' ),
	'invoice_sent'      => __( 'Invoice sent', 'justice-theme' ),
	'payment_confirmed' => __( 'Payment confirmed', 'justice-theme' ),
);
$primary_payment_label      = $primary_payment_followup && isset( $primary_payment_options[ $primary_payment_followup ] )
	? $primary_payment_options[ $primary_payment_followup ]
	: ( $primary_payment_path ? __( 'Manual payment path', 'justice-theme' ) : $subscription_status );
$primary_plan_next_action   = __( 'Compare plans or request a paid activation review when you are ready to grow the profile.', 'justice-theme' );
$primary_plan_action_url    = justice_theme_public_url( home_url( '/lawyer-plans/' ) );
$primary_plan_action_label  = __( 'Compare plans', 'justice-theme' );

if ( in_array( $subscription_status, array( 'active', 'paid', 'trialing' ), true ) ) {
	$primary_plan_next_action  = __( 'Your paid plan is active. Keep the mini-site fresh and respond quickly to assigned leads.', 'justice-theme' );
	$primary_plan_action_url   = '#profile-update-request';
	$primary_plan_action_label = __( 'Request profile update', 'justice-theme' );
} elseif ( 'payment_confirmed' === $primary_payment_followup ) {
	$primary_plan_next_action  = __( 'Payment is confirmed. Jus-Tice should now finish activation, routing and first-value checks.', 'justice-theme' );
	$primary_plan_action_url   = '#content-request';
	$primary_plan_action_label = __( 'Request first content asset', 'justice-theme' );
} elseif ( 'invoice_sent' === $primary_payment_followup ) {
	$primary_plan_next_action  = __( 'Payment instructions were sent. Complete the payment so activation and lead routing can start.', 'justice-theme' );
	$primary_plan_action_url   = $primary_manual_payment_link ? $primary_manual_payment_link : justice_theme_public_url( home_url( '/lawyer-plans/' ) );
	$primary_plan_action_label = $primary_manual_payment_link ? __( 'Complete payment', 'justice-theme' ) : __( 'Review selected plan', 'justice-theme' );
} elseif ( 'invoice_requested' === $primary_payment_followup || 'manual_invoice' === $primary_payment_path ) {
	$primary_plan_next_action  = __( 'Your paid-plan request is in manual invoice review while automatic recurring checkout is pending approval.', 'justice-theme' );
	$primary_plan_action_url   = '#profile-update-request';
	$primary_plan_action_label = __( 'Prepare profile material', 'justice-theme' );
}
$dashboard_google_review_url    = $primary_profile_id ? (string) get_post_meta( $primary_profile_id, 'google_review_request_url', true ) : '';
$dashboard_google_business_url  = $primary_profile_id ? (string) get_post_meta( $primary_profile_id, 'google_business_profile_url', true ) : '';
$dashboard_review_profile_title = $primary_profile_id ? get_the_title( $primary_profile_id ) : '';
$dashboard_review_message       = '';
$dashboard_review_whatsapp_url  = '';
$dashboard_lead_stage_options   = function_exists( 'justice_theme_lawyer_dashboard_lead_stage_options' ) ? justice_theme_lawyer_dashboard_lead_stage_options() : array(
	'not_started'       => __( 'New', 'justice-theme' ),
	'first_attempt'     => __( 'First attempt', 'justice-theme' ),
	'contacted'         => __( 'Contacted', 'justice-theme' ),
	'consult_scheduled' => __( 'Consultation scheduled', 'justice-theme' ),
	'won'               => __( 'Won', 'justice-theme' ),
	'lost'              => __( 'Not fit / lost', 'justice-theme' ),
);
$dashboard_service_presets = function_exists( 'justice_theme_lawyer_dashboard_service_presets' ) ? justice_theme_lawyer_dashboard_service_presets() : array();
$dashboard_service_self_help = array(
	array(
		'title'       => __( 'Payment and invoices', 'justice-theme' ),
		'description' => __( 'Need to pay, get a link, or receive an invoice/receipt copy? Start here before sending a free-text message.', 'justice-theme' ),
		'presets'     => array( 'payment_link', 'invoice' ),
	),
	array(
		'title'       => __( 'Plan changes', 'justice-theme' ),
		'description' => __( 'Upgrade, downgrade or cancel requests are recorded with timing and desired plan so billing is not handled by memory.', 'justice-theme' ),
		'presets'     => array( 'upgrade', 'downgrade', 'cancel' ),
	),
	array(
		'title'       => __( 'Lead quality and refund review', 'justice-theme' ),
		'description' => __( 'Use a structured request when a lead was not relevant, a complaint needs review, or refund eligibility should be checked.', 'justice-theme' ),
		'presets'     => array( 'lead_quality', 'complaint', 'refund' ),
	),
);

if ( $dashboard_google_review_url ) {
	$dashboard_review_message = sprintf(
		/* translators: 1: lawyer/profile name, 2: Google review request URL. */
		__( 'Hello, this is %1$s. If you were happy with the service, I would appreciate a short Google review here: %2$s Thank you.', 'justice-theme' ),
		$dashboard_review_profile_title ?: __( 'the firm', 'justice-theme' ),
		$dashboard_google_review_url
	);
	$dashboard_review_whatsapp_url = 'https://wa.me/?text=' . rawurlencode( wp_strip_all_tags( $dashboard_review_message ) );
}

$lead_pipeline = array(
	'new'          => array(
		'label'    => __( 'New', 'justice-theme' ),
		'statuses' => array( 'new', 'assigned', 'qualified', 'pending', 'not_started', '' ),
		'count'    => 0,
		'latest'   => '',
	),
	'response'     => array(
		'label'    => __( 'First response', 'justice-theme' ),
		'statuses' => array( 'first_attempt', 'contacted', 'in_progress' ),
		'count'    => 0,
		'latest'   => '',
	),
	'consultation' => array(
		'label'    => __( 'Consultation', 'justice-theme' ),
		'statuses' => array( 'consult_scheduled', 'consultation_scheduled', 'meeting_scheduled', 'pending_retainer' ),
		'count'    => 0,
		'latest'   => '',
	),
	'won'          => array(
		'label'    => __( 'Won', 'justice-theme' ),
		'statuses' => array( 'won', 'converted', 'closed', 'retained' ),
		'count'    => 0,
		'latest'   => '',
	),
	'not_fit'      => array(
		'label'    => __( 'Not fit', 'justice-theme' ),
		'statuses' => array( 'lost', 'not_qualified', 'rejected', 'spam' ),
		'count'    => 0,
		'latest'   => '',
	),
);
$lead_response_needed_count = 0;
$lead_response_overdue_count = 0;
$lead_value_now             = current_datetime();
$lead_value_month_start     = $lead_value_now->modify( 'first day of this month' )->setTime( 0, 0, 0 )->getTimestamp();
$lead_value_month_end       = $lead_value_now->getTimestamp();
$lead_value_window_label    = date_i18n( 'F Y', $lead_value_month_end );
$lead_value_metrics         = array(
	'assigned'       => 0,
	'first_response' => 0,
	'consultations'  => 0,
	'retained'       => 0,
	'closed'         => 0,
);
$lead_value_metric_ids      = ( post_type_exists( 'justice_lead' ) && $profile_ids )
	? get_posts( array(
		'post_type'      => 'justice_lead',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => 200,
		'fields'         => 'ids',
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			array(
				'key'     => 'assigned_lawyer_id',
				'value'   => $profile_ids,
				'compare' => 'IN',
			),
		),
	) )
	: array();
$lead_value_in_window       = static function ( $timestamp ) use ( $lead_value_month_start, $lead_value_month_end ): bool {
	if ( ! $timestamp ) {
		return false;
	}

	if ( ! is_numeric( $timestamp ) ) {
		$timestamp = strtotime( (string) $timestamp );
	}

	$timestamp = (int) $timestamp;
	return $timestamp >= $lead_value_month_start && $timestamp <= $lead_value_month_end;
};

foreach ( $lead_value_metric_ids as $lead_metric_id ) {
	$lead_metric_id = (int) $lead_metric_id;
	if ( $lead_value_in_window( get_post_time( 'U', true, $lead_metric_id ) ) ) {
		$lead_value_metrics['assigned']++;
	}
	if ( $lead_value_in_window( get_post_meta( $lead_metric_id, 'first_contact_at', true ) ) ) {
		$lead_value_metrics['first_response']++;
	}
	if ( $lead_value_in_window( get_post_meta( $lead_metric_id, 'consultation_scheduled_at', true ) ) ) {
		$lead_value_metrics['consultations']++;
	}
	if ( $lead_value_in_window( get_post_meta( $lead_metric_id, 'retained_at', true ) ) ) {
		$lead_value_metrics['retained']++;
	}
	if ( $lead_value_in_window( get_post_meta( $lead_metric_id, 'closed_at', true ) ) ) {
		$lead_value_metrics['closed']++;
	}
}

if ( $leads && $leads->posts ) {
	foreach ( $leads->posts as $lead_post ) {
		$lead_stage_status = sanitize_key( (string) ( get_post_meta( $lead_post->ID, 'follow_up_status', true ) ?: get_post_meta( $lead_post->ID, 'lead_status', true ) ) );
		$lead_created_at   = (int) get_post_time( 'U', true, $lead_post->ID );
		$lead_minutes_old  = $lead_created_at ? max( 0, (int) floor( ( time() - $lead_created_at ) / MINUTE_IN_SECONDS ) ) : 0;
		if ( in_array( $lead_stage_status, array( '', 'new', 'assigned', 'qualified', 'pending', 'not_started' ), true ) ) {
			$lead_response_needed_count++;
			if ( $lead_minutes_old > 15 ) {
				$lead_response_overdue_count++;
			}
		}

		$lead_stage_key    = 'new';
		foreach ( $lead_pipeline as $stage_key => $stage ) {
			if ( in_array( $lead_stage_status, $stage['statuses'], true ) ) {
				$lead_stage_key = $stage_key;
				break;
			}
		}

		$lead_pipeline[ $lead_stage_key ]['count']++;
		if ( '' === $lead_pipeline[ $lead_stage_key ]['latest'] ) {
			$lead_pipeline[ $lead_stage_key ]['latest'] = get_the_title( $lead_post );
		}
	}
}

$dashboard_priority_lead = null;
if ( $leads && $leads->posts ) {
	foreach ( $leads->posts as $lead_post ) {
		$lead_id            = (int) $lead_post->ID;
		$lead_stage_status = sanitize_key( (string) ( get_post_meta( $lead_id, 'follow_up_status', true ) ?: get_post_meta( $lead_id, 'lead_status', true ) ?: 'not_started' ) );
		if ( ! array_key_exists( $lead_stage_status, $dashboard_lead_stage_options ) && in_array( $lead_stage_status, array( 'new', 'assigned', 'qualified', 'pending', '' ), true ) ) {
			$lead_stage_status = 'not_started';
		}

		$lead_created_at  = (int) get_post_time( 'U', true, $lead_id );
		$lead_minutes_old = $lead_created_at ? max( 0, (int) floor( ( time() - $lead_created_at ) / MINUTE_IN_SECONDS ) ) : 0;
		$is_open_stage    = in_array( $lead_stage_status, array( 'not_started', 'new', 'assigned', 'qualified', 'pending', '' ), true );
		$is_working_stage = in_array( $lead_stage_status, array( 'first_attempt', 'contacted', 'consult_scheduled' ), true );

		if ( ! $is_open_stage && ! $is_working_stage && null !== $dashboard_priority_lead ) {
			continue;
		}

		$lead_name          = get_post_meta( $lead_id, 'visitor_name', true ) ?: get_the_title( $lead_id );
		$lead_phone         = (string) ( get_post_meta( $lead_id, 'visitor_phone', true ) ?: get_post_meta( $lead_id, 'lead_phone', true ) );
		$lead_email         = (string) ( get_post_meta( $lead_id, 'visitor_email', true ) ?: get_post_meta( $lead_id, 'lead_email', true ) );
		$lead_phone_link    = $lead_phone && function_exists( 'justice_theme_lawyer_public_phone_link' ) ? justice_theme_lawyer_public_phone_link( $lead_phone ) : '';
		$lead_phone_link    = $lead_phone_link ?: ( $lead_phone ? 'tel:' . preg_replace( '/[^0-9+]/', '', $lead_phone ) : '' );
		$lead_whatsapp_link = $lead_phone && function_exists( 'justice_theme_lawyer_public_whatsapp_link' ) ? justice_theme_lawyer_public_whatsapp_link( $lead_phone ) : '';
		if ( $lead_whatsapp_link ) {
			$lead_whatsapp_link = add_query_arg(
				'text',
				sprintf(
					'שלום %s, קיבלתי את הפנייה שלך דרך Jus-Tice ואשמח לבדוק איך אפשר לעזור.',
					$lead_name
				),
				$lead_whatsapp_link
			);
		}
		$lead_email_link = $lead_email ? add_query_arg(
			array(
				'subject' => 'פנייתך דרך Jus-Tice',
				'body'    => sprintf( "שלום %s,\n\nקיבלתי את הפנייה שלך דרך Jus-Tice ואשמח לבדוק איך אפשר לעזור.\n\nבברכה,\n%s", $lead_name, $dashboard_review_profile_title ?: get_bloginfo( 'name' ) ),
			),
			'mailto:' . $lead_email
		) : '';

		$dashboard_priority_lead = array(
			'id'            => $lead_id,
			'name'          => $lead_name,
			'area'          => get_post_meta( $lead_id, 'legal_area', true ) ?: get_post_meta( $lead_id, 'lead_area', true ) ?: '-',
			'stage'         => $dashboard_lead_stage_options[ $lead_stage_status ] ?? $lead_stage_status,
			'next_action'   => $is_open_stage ? ( $lead_minutes_old > 15 ? __( 'Call now - overdue', 'justice-theme' ) : __( 'Call within 15 minutes', 'justice-theme' ) ) : __( 'Continue follow-up', 'justice-theme' ),
			'minutes_old'   => $lead_minutes_old,
			'phone_link'    => $lead_phone_link,
			'whatsapp_link' => $lead_whatsapp_link,
			'email_link'    => $lead_email_link,
			'date'          => get_the_date( '', $lead_id ),
		);

		if ( $is_open_stage ) {
			break;
		}
	}
}

$dashboard_add_profile_url = justice_theme_public_url( add_query_arg(
	array(
		'plan_interest'    => 'pro',
		'pre_checkout'     => '1',
		'payment_path'     => 'manual_invoice',
		'utm_source'       => 'lawyer_dashboard',
		'utm_medium'       => 'personal_area',
		'utm_campaign'     => 'lawyer_activation',
		'utm_content'      => 'hero_add_profile',
		'outreach_segment' => 'dashboard_logged_in',
	),
	home_url( '/lawyer-registration/' )
) );
$dashboard_empty_registration_url = justice_theme_public_url( add_query_arg(
	array(
		'plan_interest'    => 'pro',
		'pre_checkout'     => '1',
		'payment_path'     => 'manual_invoice',
		'utm_source'       => 'lawyer_dashboard',
		'utm_medium'       => 'personal_area',
		'utm_campaign'     => 'lawyer_activation',
		'utm_content'      => 'empty_state_primary',
		'outreach_segment' => 'dashboard_logged_in_empty',
	),
	home_url( '/lawyer-registration/' )
) );
$dashboard_empty_plans_url = justice_theme_public_url( add_query_arg(
	array(
		'utm_source'       => 'lawyer_dashboard',
		'utm_medium'       => 'personal_area',
		'utm_campaign'     => 'lawyer_activation',
		'utm_content'      => 'empty_state_compare_plans',
		'outreach_segment' => 'dashboard_logged_in_empty',
	),
	home_url( '/lawyer-plans/' )
) );
?>

<section class="lawyer-dashboard section">
	<div class="container">
		<header class="lawyer-dashboard__hero">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'אזור אישי לעורכי דין', 'justice-theme' ); ?></p>
				<h1><?php esc_html_e( 'מרכז השליטה לנוכחות, תוכן ולידים', 'justice-theme' ); ?></h1>
				<p><?php esc_html_e( 'זהו MVP ראשון: צפייה בפרופיל המקושר, סטטוס מסחרי, לידים משויכים ומשימות לשיפור הפרופיל המקצועי. עריכה עצמאית, תשלומים ו-AI Console יתווספו בשלבים מבוקרים.', 'justice-theme' ); ?></p>
			</div>
			<a class="button button--gold" href="<?php echo esc_url( $dashboard_add_profile_url ); ?>"><?php esc_html_e( 'פתיחת פרופיל נוסף', 'justice-theme' ); ?></a>
		</header>

		<?php if ( ! $profiles || ! $profiles->have_posts() ) : ?>
			<div class="lawyer-dashboard__empty">
				<h2><?php esc_html_e( 'עדיין אין פרופיל מקושר לחשבון הזה', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'החשבון פעיל, אבל עדיין לא מחובר לפרופיל עורך דין. כדי להתחיל לקבל ערך צריך בקשת פרופיל, בדיקת רישיון, מסלול מסחרי והפעלה ידנית לפני כל פרסום.', 'justice-theme' ); ?></p>
				<ul class="lawyer-dashboard__empty-steps">
					<li><?php esc_html_e( 'שולחים בקשת פרופיל עם תחום, עיר, רישיון וחומרי משרד.', 'justice-theme' ); ?></li>
					<li><?php esc_html_e( 'Jus-Tice בודקת התאמה, פרסום, תשלום ידני וחיבור לחשבון.', 'justice-theme' ); ?></li>
					<li><?php esc_html_e( 'אחרי אישור, האזור האישי מציג לידים, תוכן, המלצות ודוח ערך.', 'justice-theme' ); ?></li>
				</ul>
				<div class="lawyer-dashboard__actions">
					<a class="button button--gold" href="<?php echo esc_url( $dashboard_empty_registration_url ); ?>"><?php esc_html_e( 'בקשת פרופיל ומסלול', 'justice-theme' ); ?></a>
					<a class="button button--outline" href="<?php echo esc_url( $dashboard_empty_plans_url ); ?>"><?php esc_html_e( 'השוואת מסלולים', 'justice-theme' ); ?></a>
				</div>
			</div>
		<?php else : ?>
			<div class="lawyer-dashboard__summary">
				<div>
					<strong><?php echo esc_html( (string) $content_request_count ); ?></strong>
					<span><?php esc_html_e( 'בקשות תוכן', 'justice-theme' ); ?></span>
				</div>
				<div>
					<strong><?php echo esc_html( (string) count( $profile_ids ) ); ?></strong>
					<span><?php esc_html_e( 'פרופילים מקושרים', 'justice-theme' ); ?></span>
				</div>
				<div>
					<strong><?php echo esc_html( (string) $lead_count ); ?></strong>
					<span><?php esc_html_e( 'לידים משויכים', 'justice-theme' ); ?></span>
				</div>
				<div>
					<strong><?php echo esc_html( (string) $profile_views_total ); ?></strong>
					<span><?php esc_html_e( 'צפיות בפרופיל', 'justice-theme' ); ?></span>
				</div>
			</div>

			<section class="lawyer-dashboard-plan-status" aria-labelledby="lawyer-dashboard-plan-status-title">
				<div>
					<p class="section-header__eyebrow"><?php esc_html_e( 'Plan and payment', 'justice-theme' ); ?></p>
					<h2 id="lawyer-dashboard-plan-status-title"><?php esc_html_e( 'Where your commercial activation stands', 'justice-theme' ); ?></h2>
					<p><?php echo esc_html( $primary_plan_next_action ); ?></p>
				</div>
				<dl>
					<div>
						<dt><?php esc_html_e( 'Selected plan', 'justice-theme' ); ?></dt>
						<dd><?php echo esc_html( $primary_plan_label ); ?></dd>
					</div>
					<div>
						<dt><?php esc_html_e( 'Payment stage', 'justice-theme' ); ?></dt>
						<dd><?php echo esc_html( $primary_payment_label ); ?></dd>
					</div>
					<div>
						<dt><?php esc_html_e( 'Activation', 'justice-theme' ); ?></dt>
						<dd><?php echo esc_html( $activation_status ); ?></dd>
					</div>
					<?php if ( $primary_payment_due_at ) : ?>
						<div>
							<dt><?php esc_html_e( 'Follow-up due', 'justice-theme' ); ?></dt>
							<dd><?php echo esc_html( mysql2date( get_option( 'date_format' ), $primary_payment_due_at ) ); ?></dd>
						</div>
					<?php endif; ?>
					<?php if ( $primary_invoice_reference ) : ?>
						<div>
							<dt><?php esc_html_e( 'Payment reference', 'justice-theme' ); ?></dt>
							<dd><?php echo esc_html( $primary_invoice_reference ); ?></dd>
						</div>
					<?php endif; ?>
				</dl>
				<a class="button button--gold<?php echo $primary_manual_payment_link ? ' lawyer-dashboard-plan-status__payment-link' : ''; ?>" href="<?php echo esc_url( $primary_plan_action_url ); ?>"<?php echo $primary_manual_payment_link ? ' target="_blank" rel="noopener noreferrer"' : ''; ?>><?php echo esc_html( $primary_plan_action_label ); ?></a>
			</section>

			<section class="lawyer-dashboard-command-center" aria-labelledby="lawyer-dashboard-command-center-title">
				<div class="lawyer-dashboard-command-center__header">
					<div>
						<p class="section-header__eyebrow"><?php esc_html_e( 'Customer success command center', 'justice-theme' ); ?></p>
						<h2 id="lawyer-dashboard-command-center-title"><?php esc_html_e( 'Payment, leads and service in one place', 'justice-theme' ); ?></h2>
						<p><?php esc_html_e( 'Use this during the real customer journey: pay when a real link exists, contact assigned leads, and submit upgrade, downgrade, cancellation, refund, invoice or complaint requests into the service desk.', 'justice-theme' ); ?></p>
					</div>
				</div>
				<div class="lawyer-dashboard-command-center__grid">
					<article class="lawyer-dashboard-command-card">
						<strong><?php esc_html_e( 'Payment action', 'justice-theme' ); ?></strong>
						<span><?php echo esc_html( $primary_payment_label ); ?></span>
						<p><?php echo esc_html( $primary_manual_payment_link ? __( 'A real payment link is attached to this account. Open it to complete payment in the provider page.', 'justice-theme' ) : __( 'No real payment link is attached yet. Request it here, then the owner creates the Grow/Morning link and saves it on the lawyer record.', 'justice-theme' ) ); ?></p>
						<?php if ( $primary_manual_payment_link ) : ?>
							<a class="button button--gold lawyer-dashboard-command-card__pay" href="<?php echo esc_url( $primary_manual_payment_link ); ?>" target="_blank" rel="noopener noreferrer"><?php esc_html_e( 'Pay now', 'justice-theme' ); ?></a>
						<?php elseif ( isset( $dashboard_service_presets['payment_link'] ) ) : ?>
							<?php
							$payment_preset = $dashboard_service_presets['payment_link'];
							if ( empty( $payment_preset['desired_plan'] ) && $primary_paid_plan_key ) {
								$payment_preset['desired_plan'] = $primary_paid_plan_key;
							}
							?>
							<button type="button" class="button button--gold" data-service-request-preset="payment_link" data-request-type="<?php echo esc_attr( $payment_preset['type'] ); ?>" data-request-urgency="<?php echo esc_attr( $payment_preset['urgency'] ); ?>" data-request-plan="<?php echo esc_attr( $payment_preset['desired_plan'] ); ?>" data-request-subject="<?php echo esc_attr( $payment_preset['subject'] ); ?>" data-request-message="<?php echo esc_attr( $payment_preset['message'] ); ?>"><?php echo esc_html( $payment_preset['label'] ); ?></button>
						<?php endif; ?>
					</article>

					<article class="lawyer-dashboard-command-card lawyer-dashboard-command-card--lead">
						<strong><?php esc_html_e( 'Lead to handle now', 'justice-theme' ); ?></strong>
						<?php if ( $dashboard_priority_lead ) : ?>
							<span><?php echo esc_html( $dashboard_priority_lead['name'] ); ?></span>
							<p><?php echo esc_html( $dashboard_priority_lead['area'] . ' - ' . $dashboard_priority_lead['stage'] . ' - ' . $dashboard_priority_lead['next_action'] ); ?></p>
							<div class="lawyer-dashboard-command-card__actions">
								<?php if ( $dashboard_priority_lead['phone_link'] ) : ?>
									<a class="button" href="<?php echo esc_url( $dashboard_priority_lead['phone_link'] ); ?>"><?php esc_html_e( 'Call', 'justice-theme' ); ?></a>
								<?php endif; ?>
								<?php if ( $dashboard_priority_lead['whatsapp_link'] ) : ?>
									<a class="button" href="<?php echo esc_url( $dashboard_priority_lead['whatsapp_link'] ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'WhatsApp', 'justice-theme' ); ?></a>
								<?php endif; ?>
								<?php if ( $dashboard_priority_lead['email_link'] ) : ?>
									<a class="button" href="<?php echo esc_url( $dashboard_priority_lead['email_link'] ); ?>"><?php esc_html_e( 'Email', 'justice-theme' ); ?></a>
								<?php endif; ?>
							</div>
							<small><?php printf( esc_html__( 'Lead #%1$s from %2$s', 'justice-theme' ), esc_html( (string) $dashboard_priority_lead['id'] ), esc_html( $dashboard_priority_lead['date'] ) ); ?></small>
						<?php else : ?>
							<span><?php esc_html_e( 'No assigned lead waiting', 'justice-theme' ); ?></span>
							<p><?php esc_html_e( 'When a real lead is assigned, the call, WhatsApp, email and follow-up controls appear here without exposing unassigned leads.', 'justice-theme' ); ?></p>
						<?php endif; ?>
					</article>

					<article class="lawyer-dashboard-command-card lawyer-dashboard-command-card--support">
						<strong><?php esc_html_e( 'Guided support assistant', 'justice-theme' ); ?></strong>
						<span><?php esc_html_e( 'Real request, owner-reviewed action', 'justice-theme' ); ?></span>
						<p><?php esc_html_e( 'Choose a scenario and the service desk will be prefilled. Nothing is changed or refunded until the request is submitted and reviewed.', 'justice-theme' ); ?></p>
						<?php if ( ! empty( $latest_service_request['id'] ) ) : ?>
							<dl class="lawyer-dashboard-command-card__status" aria-label="<?php esc_attr_e( 'Latest service request status', 'justice-theme' ); ?>">
								<div>
									<dt><?php esc_html_e( 'Latest', 'justice-theme' ); ?></dt>
									<dd><?php echo esc_html( $service_request_options[ $latest_service_request['type'] ] ?? $latest_service_request['type'] ); ?></dd>
								</div>
								<div>
									<dt><?php esc_html_e( 'Status', 'justice-theme' ); ?></dt>
									<dd><?php echo esc_html( $latest_service_request['status'] ?: 'open' ); ?></dd>
								</div>
								<?php if ( $latest_service_request_sla ) : ?>
									<div>
										<dt><?php esc_html_e( 'Response', 'justice-theme' ); ?></dt>
										<dd><?php echo esc_html( $latest_service_request_sla ); ?></dd>
									</div>
								<?php endif; ?>
							</dl>
						<?php endif; ?>
						<div class="lawyer-dashboard-command-card__actions">
							<?php foreach ( array( 'upgrade', 'downgrade', 'cancel', 'refund', 'invoice', 'lead_quality', 'complaint' ) as $preset_key ) : ?>
								<?php if ( empty( $dashboard_service_presets[ $preset_key ] ) ) { continue; } ?>
								<?php $preset = $dashboard_service_presets[ $preset_key ]; ?>
								<button type="button" class="button" data-service-request-preset="<?php echo esc_attr( $preset_key ); ?>" data-request-type="<?php echo esc_attr( $preset['type'] ); ?>" data-request-urgency="<?php echo esc_attr( $preset['urgency'] ); ?>" data-request-plan="<?php echo esc_attr( $preset['desired_plan'] ); ?>" data-request-subject="<?php echo esc_attr( $preset['subject'] ); ?>" data-request-message="<?php echo esc_attr( $preset['message'] ); ?>"><?php echo esc_html( $preset['label'] ); ?></button>
							<?php endforeach; ?>
						</div>
					</article>
				</div>
			</section>

			<section class="lawyer-dashboard__first-value" aria-labelledby="lawyer-dashboard-first-value-title">
				<div>
					<p class="section-header__eyebrow"><?php esc_html_e( 'מדד ערך ראשון', 'justice-theme' ); ?></p>
					<h2 id="lawyer-dashboard-first-value-title"><?php esc_html_e( 'מה כבר מתקדם בדרך לליד משלם?', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'כאן רואים את הדרך מהצטרפות לערך אמיתי: פרופיל מוכן, חשיפה, פניות, תוכן וסטטוס תשלום. הנתונים מוצגים רק כשיש מקור אמיתי, בלי הבטחות דירוג או לידים לא מאומתים.', 'justice-theme' ); ?></p>
				</div>
				<div class="lawyer-dashboard__first-value-meter">
					<strong><?php echo esc_html( $completed_first_value_steps . '/' . count( $first_value_steps ) ); ?></strong>
					<span><?php esc_html_e( 'שלבי ערך שהושלמו', 'justice-theme' ); ?></span>
				</div>
				<ul class="lawyer-dashboard__first-value-list">
					<?php foreach ( $first_value_steps as $step ) : ?>
						<li class="<?php echo esc_attr( $step['done'] ? 'is-complete' : 'is-pending' ); ?>">
							<span><?php echo $step['done'] ? esc_html__( 'בוצע', 'justice-theme' ) : esc_html__( 'בטיפול', 'justice-theme' ); ?></span>
							<?php echo esc_html( $step['label'] ); ?>
						</li>
					<?php endforeach; ?>
				</ul>
				<div class="lawyer-dashboard__first-value-note">
					<strong><?php esc_html_e( 'סטטוס הפעלה', 'justice-theme' ); ?></strong>
					<span><?php echo esc_html( $activation_status ); ?></span>
					<strong><?php esc_html_e( 'תשלום', 'justice-theme' ); ?></strong>
					<span><?php echo esc_html( $payment_status_text ); ?></span>
				</div>
			</section>

			<div class="lawyer-dashboard__grid">
				<div class="lawyer-dashboard__main">
					<?php if ( isset( $_GET['review_campaign'] ) && 'sent' === $_GET['review_campaign'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'Review campaign request saved. Nothing will be sent to clients until owner review and lawyer approval.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['review_campaign'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'Review campaign request was not saved. Please choose a linked profile.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<?php if ( isset( $_GET['supplier_request'] ) && 'sent' === $_GET['supplier_request'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'Supplier/service request saved. Jus-Tice will match it only after owner review and supplier quality check.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['supplier_request'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'Supplier/service request was not saved. Please choose a linked profile.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<?php if ( isset( $_GET['service_request'] ) && 'sent' === $_GET['service_request'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'Service request saved. Jus-Tice will review billing, plan, refund, cancellation or support requests before taking account action.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['service_request'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'Service request was not saved. Please choose a linked profile and describe the request.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<?php if ( isset( $_GET['lead_stage'] ) && 'updated' === $_GET['lead_stage'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'Lead stage updated. The pipeline and first-response tracking will refresh from this status.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['lead_stage'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'Lead stage was not updated. Only assigned leads can be changed from this dashboard.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<?php if ( isset( $_GET['content_request'] ) && 'sent' === $_GET['content_request'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'בקשת התוכן התקבלה כטיוטה ותיבדק לפני כל פרסום.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['content_request'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'בקשת התוכן לא נשלחה. בדקו שנבחר פרופיל ושנושא המאמר מולא.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<h2><?php esc_html_e( 'הפרופילים שלי', 'justice-theme' ); ?></h2>
					<?php if ( isset( $_GET['profile_update'] ) && 'sent' === $_GET['profile_update'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'בקשת עדכון הפרופיל המקצועי נשמרה לבדיקה. שום שינוי ציבורי לא יפורסם לפני אישור.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['profile_update'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'בקשת עדכון הפרופיל לא נשלחה. בדקו שנבחר פרופיל מקושר.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<?php while ( $profiles->have_posts() ) : $profiles->the_post(); ?>
						<?php
						$post_id      = get_the_ID();
						$plan         = get_post_meta( $post_id, 'plan_type', true ) ?: 'free';
						$subscription = get_post_meta( $post_id, 'subscription_status', true ) ?: 'inactive';
						$verification = get_post_meta( $post_id, 'verification_status', true ) ?: 'unverified';
						$profile_url  = justice_theme_public_permalink( $post_id );
						$completeness = justice_theme_lawyer_dashboard_profile_completeness( $post_id );
						?>
						<article class="lawyer-dashboard-profile">
							<div>
								<h3><?php the_title(); ?></h3>
								<p><?php echo esc_html( get_post_meta( $post_id, 'firm_name', true ) ?: get_the_excerpt() ); ?></p>
							</div>
							<dl>
								<div><dt><?php esc_html_e( 'מסלול', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $plan ); ?></dd></div>
								<div><dt><?php esc_html_e( 'מנוי', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $subscription ); ?></dd></div>
								<div><dt><?php esc_html_e( 'אימות', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $verification ); ?></dd></div>
								<div><dt><?php esc_html_e( 'שלמות פרופיל', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $completeness . '%' ); ?></dd></div>
							</dl>
							<div class="lawyer-dashboard-profile__actions">
								<a class="button button--outline" href="<?php echo esc_url( $profile_url ); ?>"><?php esc_html_e( 'צפייה בפרופיל', 'justice-theme' ); ?></a>
								<a class="button button--gold" href="<?php echo esc_url( justice_theme_public_url( home_url( '/lawyer-plans/' ) ) ); ?>"><?php esc_html_e( 'שדרוג מסלול', 'justice-theme' ); ?></a>
							</div>
						</article>
					<?php endwhile; wp_reset_postdata(); ?>

					<section class="lawyer-dashboard-growth" aria-labelledby="lawyer-dashboard-growth-title">
						<div class="lawyer-dashboard-growth__header">
							<div>
								<p class="section-header__eyebrow"><?php esc_html_e( 'Reputation and authority cockpit', 'justice-theme' ); ?></p>
								<h2 id="lawyer-dashboard-growth-title"><?php esc_html_e( 'What makes this profile sell?', 'justice-theme' ); ?></h2>
								<p class="lawyer-dashboard__muted"><?php esc_html_e( 'Inspired by leading lawyer platforms: claimed profile, real photo, external proof, fresh reviews, practical FAQs, content, exposure and leads. We track only real signals.', 'justice-theme' ); ?></p>
							</div>
							<div class="lawyer-dashboard-growth__score">
								<strong><?php echo esc_html( $completed_growth_assets . '/' . count( $growth_assets ) ); ?></strong>
								<span><?php esc_html_e( 'growth assets ready', 'justice-theme' ); ?></span>
							</div>
						</div>
						<?php if ( $next_growth_asset ) : ?>
							<div class="lawyer-dashboard-growth__next">
								<div>
									<strong><?php esc_html_e( 'Next best action', 'justice-theme' ); ?></strong>
									<span><?php echo esc_html( $next_growth_asset['label'] ); ?></span>
								</div>
								<a class="button button--gold" href="<?php echo esc_url( $next_growth_asset['action_url'] ); ?>"><?php echo esc_html( $next_growth_asset['action_label'] ); ?></a>
							</div>
						<?php endif; ?>
						<?php if ( $growth_assets ) : ?>
							<ul class="lawyer-dashboard-growth__assets">
								<?php foreach ( $growth_assets as $asset ) : ?>
									<li class="<?php echo esc_attr( $asset['done'] ? 'is-complete' : 'is-pending' ); ?>">
										<strong><?php echo esc_html( $asset['label'] ); ?></strong>
										<span><?php echo esc_html( $asset['why'] ); ?></span>
										<?php if ( empty( $asset['done'] ) && ! empty( $asset['action_url'] ) && ! empty( $asset['action_label'] ) ) : ?>
											<a href="<?php echo esc_url( $asset['action_url'] ); ?>"><?php echo esc_html( $asset['action_label'] ); ?></a>
										<?php endif; ?>
									</li>
								<?php endforeach; ?>
							</ul>
						<?php endif; ?>
					</section>

					<section class="lawyer-dashboard-content-request" id="profile-update-request">
						<h2><?php esc_html_e( 'בקשת עדכון לפרופיל המקצועי', 'justice-theme' ); ?></h2>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'שלחו נוסח חדש לכותרת, שירותים, תהליך עבודה, וידאו או שאלות נפוצות. העדכון נשמר לבדיקה בלבד ולא משנה את הפרופיל הציבורי עד אישור.', 'justice-theme' ); ?></p>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_lawyer_profile_update_request">
							<?php wp_nonce_field( 'justice_lawyer_profile_update', 'justice_lawyer_profile_update_nonce' ); ?>

							<label for="profile-update-profile"><?php esc_html_e( 'פרופיל מחובר', 'justice-theme' ); ?></label>
							<select id="profile-update-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="profile-headline"><?php esc_html_e( 'כותרת ראשית מוצעת', 'justice-theme' ); ?></label>
							<input id="profile-headline" type="text" name="profile_headline">

							<label for="profile-bar-number"><?php esc_html_e( 'Bar license number', 'justice-theme' ); ?></label>
							<input id="profile-bar-number" type="text" name="profile_bar_number" inputmode="numeric">

							<label for="profile-website"><?php esc_html_e( 'Website or external proof link', 'justice-theme' ); ?></label>
							<input id="profile-website" type="url" name="profile_website">

							<label for="profile-services"><?php esc_html_e( 'שירותים מרכזיים', 'justice-theme' ); ?></label>
							<textarea id="profile-services" name="profile_services" rows="4"></textarea>

							<label for="profile-process"><?php esc_html_e( 'איך נראה תהליך העבודה איתכם?', 'justice-theme' ); ?></label>
							<textarea id="profile-process" name="profile_process" rows="4"></textarea>

							<label for="profile-video-url"><?php esc_html_e( 'קישור וידאו', 'justice-theme' ); ?></label>
							<input id="profile-video-url" type="url" name="profile_video_url">

							<label for="profile-faqs"><?php esc_html_e( 'שאלות נפוצות שתרצו שיופיעו בפרופיל', 'justice-theme' ); ?></label>
							<textarea id="profile-faqs" name="profile_faqs" rows="4"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'שליחת בקשת עדכון', 'justice-theme' ); ?></button>
						</form>
					</section>

					<section class="lawyer-dashboard-content-request" id="review-campaign-request">
						<h2><?php esc_html_e( 'Google reviews and recommendations', 'justice-theme' ); ?></h2>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'Ask Jus-Tice to prepare a review campaign. This does not send messages yet. The owner reviews the request, verifies the Google Business review link, and only then sends approved client requests.', 'justice-theme' ); ?></p>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_lawyer_review_campaign_request">
							<?php wp_nonce_field( 'justice_lawyer_review_campaign', 'justice_lawyer_review_campaign_nonce' ); ?>

							<label for="review-profile"><?php esc_html_e( 'Linked profile', 'justice-theme' ); ?></label>
							<select id="review-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="review-client-group"><?php esc_html_e( 'Who should receive the first request?', 'justice-theme' ); ?></label>
							<input id="review-client-group" type="text" name="review_client_group" placeholder="<?php esc_attr_e( 'Example: clients from the last 90 days after closed matters', 'justice-theme' ); ?>">

							<label for="review-google-business-profile-url"><?php esc_html_e( 'Google Business profile URL', 'justice-theme' ); ?></label>
							<input id="review-google-business-profile-url" type="url" name="google_business_profile_url" value="<?php echo esc_attr( $dashboard_google_business_url ); ?>" placeholder="<?php esc_attr_e( 'Paste the public Google Maps / Business profile link', 'justice-theme' ); ?>">

							<label for="review-google-request-url"><?php esc_html_e( 'Google review request URL', 'justice-theme' ); ?></label>
							<input id="review-google-request-url" type="url" name="google_review_request_url" value="<?php echo esc_attr( $dashboard_google_review_url ); ?>" placeholder="<?php esc_attr_e( 'Example: https://search.google.com/local/writereview?placeid=...', 'justice-theme' ); ?>">

							<label for="review-google-place-id"><?php esc_html_e( 'Google Place ID', 'justice-theme' ); ?></label>
							<input id="review-google-place-id" type="text" name="google_place_id" value="<?php echo esc_attr( $primary_profile_id ? (string) get_post_meta( $primary_profile_id, 'google_place_id', true ) : '' ); ?>" placeholder="<?php esc_attr_e( 'Optional: ChIJ...', 'justice-theme' ); ?>">

							<label for="review-campaign-notes"><?php esc_html_e( 'Notes for the owner', 'justice-theme' ); ?></label>
							<textarea id="review-campaign-notes" name="review_campaign_notes" rows="4" placeholder="<?php esc_attr_e( 'Add Google Business link, preferred wording, or sensitive cases to avoid.', 'justice-theme' ); ?>"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'Request review campaign setup', 'justice-theme' ); ?></button>
						</form>

						<div class="lawyer-dashboard-review-kit">
							<h3><?php esc_html_e( 'Fast review request kit', 'justice-theme' ); ?></h3>
							<?php if ( $dashboard_google_review_url ) : ?>
								<p class="lawyer-dashboard__muted"><?php esc_html_e( 'Use this with real clients only, after the matter or a meaningful service moment. Do not offer discounts, gifts, or pressure for a positive review.', 'justice-theme' ); ?></p>
								<textarea readonly rows="4" onclick="this.select()"><?php echo esc_textarea( $dashboard_review_message ); ?></textarea>
								<div class="lawyer-dashboard-review-kit__actions">
									<a class="button button--gold" href="<?php echo esc_url( $dashboard_review_whatsapp_url ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Open WhatsApp message', 'justice-theme' ); ?></a>
									<a class="button button--outline" href="<?php echo esc_url( $dashboard_google_review_url ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'Open Google review link', 'justice-theme' ); ?></a>
									<?php if ( $dashboard_google_business_url ) : ?>
										<a class="button button--outline" href="<?php echo esc_url( $dashboard_google_business_url ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'View Google profile', 'justice-theme' ); ?></a>
									<?php endif; ?>
								</div>
							<?php else : ?>
								<p class="lawyer-dashboard__muted"><?php esc_html_e( 'Add your Google review request URL above first. In Google Business Profile, open Reviews, choose Get more reviews, copy the link, paste it here, and submit.', 'justice-theme' ); ?></p>
							<?php endif; ?>
						</div>
					</section>

					<section class="lawyer-dashboard-content-request" id="supplier-request">
						<h2><?php esc_html_e( 'Vetted services for your firm', 'justice-theme' ); ?></h2>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'Tell Jus-Tice what professional supplier you need. We use these requests to match lawyers with checked providers and to build partner offers inside the platform. Nothing is sent to a supplier before owner review.', 'justice-theme' ); ?></p>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_lawyer_supplier_request">
							<?php wp_nonce_field( 'justice_lawyer_supplier_request', 'justice_lawyer_supplier_request_nonce' ); ?>

							<label for="supplier-profile"><?php esc_html_e( 'Linked profile', 'justice-theme' ); ?></label>
							<select id="supplier-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="supplier-category"><?php esc_html_e( 'Service needed', 'justice-theme' ); ?></label>
							<select id="supplier-category" name="supplier_category" required>
								<?php
								$supplier_categories = function_exists( 'justice_theme_lawyer_supplier_categories' ) ? justice_theme_lawyer_supplier_categories() : array( 'other' => __( 'Other', 'justice-theme' ) );
								foreach ( $supplier_categories as $category_key => $category_label ) :
									?>
									<option value="<?php echo esc_attr( $category_key ); ?>"><?php echo esc_html( $category_label ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="supplier-urgency"><?php esc_html_e( 'Urgency', 'justice-theme' ); ?></label>
							<select id="supplier-urgency" name="supplier_urgency">
								<option value="urgent"><?php esc_html_e( 'Urgent', 'justice-theme' ); ?></option>
								<option value="this_month"><?php esc_html_e( 'This month', 'justice-theme' ); ?></option>
								<option value="researching"><?php esc_html_e( 'Researching options', 'justice-theme' ); ?></option>
								<option value="not_sure"><?php esc_html_e( 'Not sure yet', 'justice-theme' ); ?></option>
							</select>

							<label for="supplier-request-notes"><?php esc_html_e( 'What do you need?', 'justice-theme' ); ?></label>
							<textarea id="supplier-request-notes" name="supplier_request_notes" rows="4" placeholder="<?php esc_attr_e( 'Example: certified translation for court documents, shared office room in Tel Aviv, video production, expert witness, CRM setup.', 'justice-theme' ); ?>"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'Request matched provider', 'justice-theme' ); ?></button>
						</form>
					</section>

					<section class="lawyer-dashboard-service-request" id="service-request">
						<div class="lawyer-dashboard-service-request__header">
							<div>
								<p class="section-header__eyebrow"><?php esc_html_e( 'Service desk', 'justice-theme' ); ?></p>
								<h2><?php esc_html_e( 'Billing, plan and support requests', 'justice-theme' ); ?></h2>
								<p class="lawyer-dashboard__muted"><?php esc_html_e( 'Use this for upgrade, downgrade, cancellation, refund, invoice, lead-quality, complaint or technical support scenarios. Requests are saved to the profile and sent to Jus-Tice for owner review before account or payment action.', 'justice-theme' ); ?></p>
							</div>
							<?php if ( ! empty( $latest_service_request['id'] ) ) : ?>
								<dl class="lawyer-dashboard-service-request__latest">
									<div>
										<dt><?php esc_html_e( 'Latest request', 'justice-theme' ); ?></dt>
										<dd><?php echo esc_html( $latest_service_request['id'] ); ?></dd>
									</div>
									<div>
										<dt><?php esc_html_e( 'Type', 'justice-theme' ); ?></dt>
										<dd><?php echo esc_html( $service_request_options[ $latest_service_request['type'] ] ?? $latest_service_request['type'] ); ?></dd>
									</div>
									<div>
										<dt><?php esc_html_e( 'Status', 'justice-theme' ); ?></dt>
										<dd><?php echo esc_html( $latest_service_request['status'] ?: 'open' ); ?></dd>
									</div>
									<?php if ( $latest_service_request_sla ) : ?>
										<div>
											<dt><?php esc_html_e( 'Next response', 'justice-theme' ); ?></dt>
											<dd><?php echo esc_html( $latest_service_request_sla ); ?></dd>
										</div>
									<?php endif; ?>
									<?php if ( ! empty( $latest_service_request['submitted_at'] ) ) : ?>
										<div>
											<dt><?php esc_html_e( 'Submitted', 'justice-theme' ); ?></dt>
											<dd><?php echo esc_html( mysql2date( get_option( 'date_format' ), $latest_service_request['submitted_at'] ) ); ?></dd>
										</div>
									<?php endif; ?>
								</dl>
							<?php endif; ?>
						</div>
						<div class="lawyer-dashboard-service-request__self-help" aria-label="<?php esc_attr_e( 'Guided service request shortcuts', 'justice-theme' ); ?>">
							<?php foreach ( $dashboard_service_self_help as $self_help_group ) : ?>
								<article>
									<strong><?php echo esc_html( $self_help_group['title'] ); ?></strong>
									<p><?php echo esc_html( $self_help_group['description'] ); ?></p>
									<div>
										<?php foreach ( $self_help_group['presets'] as $preset_key ) : ?>
											<?php
											if ( empty( $dashboard_service_presets[ $preset_key ] ) ) {
												continue;
											}
											$preset = $dashboard_service_presets[ $preset_key ];
											?>
											<button type="button" class="button" data-service-request-preset="<?php echo esc_attr( $preset_key ); ?>" data-request-type="<?php echo esc_attr( $preset['type'] ); ?>" data-request-urgency="<?php echo esc_attr( $preset['urgency'] ); ?>" data-request-plan="<?php echo esc_attr( $preset['desired_plan'] ); ?>" data-request-subject="<?php echo esc_attr( $preset['subject'] ); ?>" data-request-message="<?php echo esc_attr( $preset['message'] ); ?>"><?php echo esc_html( $preset['label'] ); ?></button>
										<?php endforeach; ?>
									</div>
								</article>
							<?php endforeach; ?>
						</div>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form lawyer-dashboard-service-request__form">
							<input type="hidden" name="action" value="justice_lawyer_service_request">
							<?php wp_nonce_field( 'justice_lawyer_service_request', 'justice_lawyer_service_request_nonce' ); ?>

							<label for="service-profile"><?php esc_html_e( 'Linked profile', 'justice-theme' ); ?></label>
							<select id="service-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="service-request-type"><?php esc_html_e( 'Request type', 'justice-theme' ); ?></label>
							<select id="service-request-type" name="service_request_type" required>
								<?php foreach ( $service_request_options as $type_key => $type_label ) : ?>
									<option value="<?php echo esc_attr( $type_key ); ?>"><?php echo esc_html( $type_label ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="service-request-urgency"><?php esc_html_e( 'Urgency', 'justice-theme' ); ?></label>
							<select id="service-request-urgency" name="service_request_urgency">
								<?php foreach ( $service_urgency_options as $urgency_key => $urgency_label ) : ?>
									<option value="<?php echo esc_attr( $urgency_key ); ?>"><?php echo esc_html( $urgency_label ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="service-request-desired-plan"><?php esc_html_e( 'Desired plan after this request', 'justice-theme' ); ?></label>
							<select id="service-request-desired-plan" name="service_request_desired_plan">
								<option value=""><?php esc_html_e( 'No plan change', 'justice-theme' ); ?></option>
								<?php foreach ( $dashboard_plan_definitions as $plan_key => $plan_definition ) : ?>
									<option value="<?php echo esc_attr( $plan_key ); ?>"><?php echo esc_html( $plan_definition['label'] ?? $plan_key ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="service-request-subject"><?php esc_html_e( 'Short subject', 'justice-theme' ); ?></label>
							<input id="service-request-subject" type="text" name="service_request_subject" required placeholder="<?php esc_attr_e( 'Example: I want to downgrade before next billing cycle', 'justice-theme' ); ?>">

							<label for="service-request-message"><?php esc_html_e( 'Details for Jus-Tice', 'justice-theme' ); ?></label>
							<textarea id="service-request-message" name="service_request_message" rows="5" required placeholder="<?php esc_attr_e( 'Describe the payment, invoice, refund, cancellation, lead-quality or support issue. Include dates, lead names or invoice reference when relevant.', 'justice-theme' ); ?>"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'Send service request', 'justice-theme' ); ?></button>
						</form>
					</section>

					<section class="lawyer-dashboard-pipeline" aria-labelledby="lawyer-dashboard-pipeline-title">
						<div class="lawyer-dashboard-pipeline__header">
							<div>
								<p class="section-header__eyebrow"><?php esc_html_e( 'Lead pipeline', 'justice-theme' ); ?></p>
								<h2 id="lawyer-dashboard-pipeline-title"><?php esc_html_e( 'Where your leads stand now', 'justice-theme' ); ?></h2>
							</div>
							<span><?php printf( esc_html__( '%1$s assigned leads · %2$s need response · %3$s overdue', 'justice-theme' ), esc_html( (string) $lead_count ), esc_html( (string) $lead_response_needed_count ), esc_html( (string) $lead_response_overdue_count ) ); ?></span>
						</div>
						<div class="lawyer-dashboard-pipeline__stages">
							<?php foreach ( $lead_pipeline as $stage ) : ?>
								<article>
									<strong><?php echo esc_html( (string) $stage['count'] ); ?></strong>
									<span><?php echo esc_html( $stage['label'] ); ?></span>
									<small><?php echo $stage['latest'] ? esc_html( $stage['latest'] ) : esc_html__( 'No leads in this stage', 'justice-theme' ); ?></small>
								</article>
							<?php endforeach; ?>
						</div>
					</section>

					<section class="lawyer-dashboard-value-snapshot" aria-labelledby="lawyer-dashboard-value-snapshot-title">
						<div class="lawyer-dashboard-pipeline__header">
							<div>
								<p class="section-header__eyebrow"><?php esc_html_e( 'Monthly value snapshot', 'justice-theme' ); ?></p>
								<h2 id="lawyer-dashboard-value-snapshot-title"><?php printf( esc_html__( 'What Jus-Tice created in %s', 'justice-theme' ), esc_html( $lead_value_window_label ) ); ?></h2>
							</div>
							<span><?php esc_html_e( 'Visible proof for your next report', 'justice-theme' ); ?></span>
						</div>
						<div class="lawyer-dashboard-value-snapshot__grid">
							<article>
								<strong><?php echo esc_html( (string) $lead_value_metrics['assigned'] ); ?></strong>
								<span><?php esc_html_e( 'Assigned leads', 'justice-theme' ); ?></span>
							</article>
							<article>
								<strong><?php echo esc_html( (string) $lead_value_metrics['first_response'] ); ?></strong>
								<span><?php esc_html_e( 'First responses', 'justice-theme' ); ?></span>
							</article>
							<article>
								<strong><?php echo esc_html( (string) $lead_value_metrics['consultations'] ); ?></strong>
								<span><?php esc_html_e( 'Consultations set', 'justice-theme' ); ?></span>
							</article>
							<article>
								<strong><?php echo esc_html( (string) $lead_value_metrics['retained'] ); ?></strong>
								<span><?php esc_html_e( 'Clients retained', 'justice-theme' ); ?></span>
							</article>
							<article>
								<strong><?php echo esc_html( (string) $lead_value_metrics['closed'] ); ?></strong>
								<span><?php esc_html_e( 'Closed / not fit', 'justice-theme' ); ?></span>
							</article>
						</div>
					</section>

					<h2><?php esc_html_e( 'Recent leads', 'justice-theme' ); ?></h2>
					<?php if ( $leads && $leads->have_posts() ) : ?>
						<div class="lawyer-dashboard-leads">
							<?php while ( $leads->have_posts() ) : $leads->the_post(); ?>
								<?php
								$lead_id             = get_the_ID();
								$lead_name           = get_post_meta( $lead_id, 'visitor_name', true ) ?: get_the_title();
								$lead_phone          = (string) ( get_post_meta( $lead_id, 'visitor_phone', true ) ?: get_post_meta( $lead_id, 'lead_phone', true ) );
								$lead_email          = (string) ( get_post_meta( $lead_id, 'visitor_email', true ) ?: get_post_meta( $lead_id, 'lead_email', true ) );
								$lead_phone_link     = $lead_phone && function_exists( 'justice_theme_lawyer_public_phone_link' ) ? justice_theme_lawyer_public_phone_link( $lead_phone ) : '';
								$lead_phone_link     = $lead_phone_link ?: ( $lead_phone ? 'tel:' . preg_replace( '/[^0-9+]/', '', $lead_phone ) : '' );
								$lead_whatsapp_link  = $lead_phone && function_exists( 'justice_theme_lawyer_public_whatsapp_link' ) ? justice_theme_lawyer_public_whatsapp_link( $lead_phone ) : '';
								if ( $lead_whatsapp_link ) {
									$lead_whatsapp_link = add_query_arg(
										'text',
										sprintf(
											'שלום %s, קיבלתי את הפנייה שלך דרך Jus-Tice ואשמח לבדוק איך אפשר לעזור.',
											$lead_name
										),
										$lead_whatsapp_link
									);
								}
								$lead_email_link = $lead_email ? add_query_arg(
									array(
										'subject' => 'פנייתך דרך Jus-Tice',
										'body'    => sprintf( "שלום %s,\n\nקיבלתי את הפנייה שלך דרך Jus-Tice ואשמח לבדוק איך אפשר לעזור.\n\nבברכה,\n%s", $lead_name, $dashboard_review_profile_title ?: get_bloginfo( 'name' ) ),
									),
									'mailto:' . $lead_email
								) : '';
								$current_lead_stage  = sanitize_key( (string) ( get_post_meta( $lead_id, 'follow_up_status', true ) ?: get_post_meta( $lead_id, 'lead_status', true ) ?: 'not_started' ) );
								$latest_lead_note     = (string) get_post_meta( $lead_id, 'latest_lawyer_follow_up_note', true );
								$latest_lead_update   = (string) get_post_meta( $lead_id, 'latest_lawyer_stage_update_at', true );
								if ( ! array_key_exists( $current_lead_stage, $dashboard_lead_stage_options ) && in_array( $current_lead_stage, array( 'new', 'assigned', 'qualified', 'pending', '' ), true ) ) {
									$current_lead_stage = 'not_started';
								}
								$current_stage_label = $dashboard_lead_stage_options[ $current_lead_stage ] ?? ( get_post_meta( $lead_id, 'lead_status', true ) ?: 'new' );
								$lead_created_at     = (int) get_post_time( 'U', true, $lead_id );
								$lead_minutes_old    = $lead_created_at ? max( 0, (int) floor( ( time() - $lead_created_at ) / MINUTE_IN_SECONDS ) ) : 0;
								$lead_next_action    = __( 'Track', 'justice-theme' );
								$lead_action_class   = 'is-muted';
								if ( in_array( $current_lead_stage, array( 'not_started', 'new', 'assigned', 'qualified', 'pending', '' ), true ) ) {
									$lead_next_action  = $lead_minutes_old > 15 ? __( 'Call now - overdue', 'justice-theme' ) : __( 'Call within 15 min', 'justice-theme' );
									$lead_action_class = $lead_minutes_old > 15 ? 'is-urgent' : 'is-fresh';
								} elseif ( in_array( $current_lead_stage, array( 'first_attempt', 'contacted' ), true ) ) {
									$lead_next_action  = __( 'Follow up / book consult', 'justice-theme' );
									$lead_action_class = 'is-working';
								} elseif ( 'consult_scheduled' === $current_lead_stage ) {
									$lead_next_action  = __( 'Prepare consultation', 'justice-theme' );
									$lead_action_class = 'is-working';
								} elseif ( 'won' === $current_lead_stage ) {
									$lead_next_action = __( 'Client retained', 'justice-theme' );
								} elseif ( 'lost' === $current_lead_stage ) {
									$lead_next_action = __( 'Closed', 'justice-theme' );
								}
								?>
								<article>
									<strong><?php echo esc_html( $lead_name ); ?></strong>
									<span><?php echo esc_html( get_post_meta( $lead_id, 'legal_area', true ) ?: get_post_meta( $lead_id, 'lead_area', true ) ?: '-' ); ?></span>
									<span>
										<?php echo esc_html( $current_stage_label ); ?>
										<small class="lawyer-dashboard-leads__next-action <?php echo esc_attr( $lead_action_class ); ?>"><?php echo esc_html( $lead_next_action ); ?></small>
									</span>
									<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
									<div class="lawyer-dashboard-leads__contact">
										<?php if ( $lead_phone_link ) : ?>
											<a class="button" href="<?php echo esc_url( $lead_phone_link ); ?>"><?php esc_html_e( 'Call', 'justice-theme' ); ?></a>
										<?php endif; ?>
										<?php if ( $lead_whatsapp_link ) : ?>
											<a class="button" href="<?php echo esc_url( $lead_whatsapp_link ); ?>" target="_blank" rel="noopener"><?php esc_html_e( 'WhatsApp', 'justice-theme' ); ?></a>
										<?php endif; ?>
										<?php if ( $lead_email_link ) : ?>
											<a class="button" href="<?php echo esc_url( $lead_email_link ); ?>"><?php esc_html_e( 'Email', 'justice-theme' ); ?></a>
										<?php endif; ?>
										<?php if ( ! $lead_phone_link && ! $lead_email_link ) : ?>
											<span><?php esc_html_e( 'No contact shown', 'justice-theme' ); ?></span>
										<?php endif; ?>
									</div>
									<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="lawyer-dashboard-leads__stage-form">
										<input type="hidden" name="action" value="justice_lawyer_lead_stage_update">
										<input type="hidden" name="lead_id" value="<?php echo esc_attr( $lead_id ); ?>">
										<?php wp_nonce_field( 'justice_lawyer_lead_stage_update', 'justice_lawyer_lead_stage_nonce' ); ?>
										<label class="screen-reader-text" for="lead-stage-<?php echo esc_attr( $lead_id ); ?>"><?php esc_html_e( 'Update lead stage', 'justice-theme' ); ?></label>
										<select id="lead-stage-<?php echo esc_attr( $lead_id ); ?>" name="lead_stage">
											<?php foreach ( $dashboard_lead_stage_options as $stage_key => $stage_label ) : ?>
												<option value="<?php echo esc_attr( $stage_key ); ?>" <?php selected( $current_lead_stage, $stage_key ); ?>><?php echo esc_html( $stage_label ); ?></option>
											<?php endforeach; ?>
										</select>
										<label class="screen-reader-text" for="lead-follow-up-note-<?php echo esc_attr( $lead_id ); ?>"><?php esc_html_e( 'Lead follow-up note', 'justice-theme' ); ?></label>
										<textarea id="lead-follow-up-note-<?php echo esc_attr( $lead_id ); ?>" name="lead_follow_up_note" rows="2" placeholder="<?php esc_attr_e( 'מה קרה בשיחה? לדוגמה: נקבעה שיחת ייעוץ למחר / לא מתאים / צריך מעקב.', 'justice-theme' ); ?>"></textarea>
										<button type="submit" class="button"><?php esc_html_e( 'Update', 'justice-theme' ); ?></button>
									</form>
									<?php if ( $latest_lead_note || $latest_lead_update ) : ?>
										<p class="lawyer-dashboard-leads__last-note">
											<?php if ( $latest_lead_note ) : ?>
												<strong><?php esc_html_e( 'Latest report:', 'justice-theme' ); ?></strong>
												<?php echo esc_html( $latest_lead_note ); ?>
											<?php endif; ?>
											<?php if ( $latest_lead_update ) : ?>
												<small><?php printf( esc_html__( 'Updated: %s', 'justice-theme' ), esc_html( $latest_lead_update ) ); ?></small>
											<?php endif; ?>
										</p>
									<?php endif; ?>
								</article>
							<?php endwhile; wp_reset_postdata(); ?>
						</div>
					<?php else : ?>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'אין עדיין לידים משויכים לפרופיל הזה.', 'justice-theme' ); ?></p>
					<?php endif; ?>

					<h2><?php esc_html_e( 'בקשות תוכן ומאמרים', 'justice-theme' ); ?></h2>
					<?php if ( $content_requests && $content_requests->have_posts() ) : ?>
						<div class="lawyer-dashboard-content-list">
							<?php while ( $content_requests->have_posts() ) : $content_requests->the_post(); ?>
								<?php
								$request_id    = get_the_ID();
								$request_state = get_post_status( $request_id );
								$needs_legal   = (string) get_post_meta( $request_id, 'needs_legal_review', true );
								$needs_source  = (string) get_post_meta( $request_id, 'needs_browser_source_verification', true );
								$intent        = (string) get_post_meta( $request_id, 'lawyer_content_intent', true );
								$audience      = (string) get_post_meta( $request_id, 'lawyer_content_audience', true );
								?>
								<article>
									<div>
										<strong><?php the_title(); ?></strong>
										<?php if ( '' !== $intent || '' !== $audience ) : ?>
											<p><?php echo esc_html( trim( $intent . ' ' . $audience ) ); ?></p>
										<?php endif; ?>
									</div>
									<span><?php echo esc_html( $request_state ); ?></span>
									<span><?php echo '1' === $needs_legal ? esc_html__( 'בדיקה משפטית', 'justice-theme' ) : esc_html__( 'עבר בדיקה משפטית', 'justice-theme' ); ?></span>
									<span><?php echo '1' === $needs_source ? esc_html__( 'בדיקת מקורות', 'justice-theme' ) : esc_html__( 'מקורות נבדקו', 'justice-theme' ); ?></span>
									<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
								</article>
							<?php endwhile; wp_reset_postdata(); ?>
						</div>
					<?php else : ?>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'אין עדיין בקשות תוכן לפרופיל הזה. אפשר לשלוח רעיון למאמר חתום דרך הטופס הבא.', 'justice-theme' ); ?></p>
					<?php endif; ?>

					<section class="lawyer-dashboard-content-request" id="content-request">
						<h2><?php esc_html_e( 'בקשת מאמר חתום', 'justice-theme' ); ?></h2>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'שלחו רעיון למאמר או מדריך. הבקשה נשמרת כטיוטה בלבד ותעבור עריכה, בדיקת מקורות ובדיקה משפטית לפני פרסום.', 'justice-theme' ); ?></p>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_lawyer_content_request">
							<?php wp_nonce_field( 'justice_lawyer_content_request', 'justice_lawyer_content_request_nonce' ); ?>

							<label for="content-profile"><?php esc_html_e( 'פרופיל מחובר', 'justice-theme' ); ?></label>
							<select id="content-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="content-topic"><?php esc_html_e( 'נושא המאמר', 'justice-theme' ); ?></label>
							<input id="content-topic" type="text" name="content_topic" required placeholder="<?php esc_attr_e( 'לדוגמה: איך מתכוננים להסכם גירושין בהסכמה', 'justice-theme' ); ?>">

							<label for="content-intent"><?php esc_html_e( 'מטרת התוכן', 'justice-theme' ); ?></label>
							<input id="content-intent" type="text" name="content_intent" placeholder="<?php esc_attr_e( 'מידע ללקוחות, שאלות נפוצות, חיזוק תחום מומחיות, הכנה לפגישה', 'justice-theme' ); ?>">

							<label for="content-audience"><?php esc_html_e( 'קהל יעד', 'justice-theme' ); ?></label>
							<input id="content-audience" type="text" name="content_audience" placeholder="<?php esc_attr_e( 'לדוגמה: הורים לפני פרידה, בעלי דירות, חשודים לפני חקירה', 'justice-theme' ); ?>">

							<label for="content-notes"><?php esc_html_e( 'נקודות שחשוב לכלול', 'justice-theme' ); ?></label>
							<textarea id="content-notes" name="content_notes" rows="4"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'שליחת בקשת תוכן', 'justice-theme' ); ?></button>
						</form>
					</section>
				</div>

				<aside class="lawyer-dashboard__side">
					<section class="lawyer-dashboard__roadmap">
						<h2><?php esc_html_e( 'דוח ערך חודשי', 'justice-theme' ); ?></h2>
						<p><?php esc_html_e( 'המטרה של האזור האישי היא להראות לעורך הדין מה הפלטפורמה יצרה בפועל: חשיפה, פניות, תוכן ופעולות המשך.', 'justice-theme' ); ?></p>
						<ul>
							<li><?php printf( esc_html__( 'צפיות בפרופיל: %s', 'justice-theme' ), esc_html( (string) $profile_views_total ) ); ?></li>
							<li><?php printf( esc_html__( 'לידים משויכים: %s', 'justice-theme' ), esc_html( (string) $lead_count ) ); ?></li>
							<li><?php printf( esc_html__( 'בקשות תוכן בטיפול: %s', 'justice-theme' ), esc_html( (string) $content_request_count ) ); ?></li>
							<li><?php esc_html_e( 'שיחות, WhatsApp, קליקים ונתוני GSC יוצגו לאחר אימות GA4/GSC.', 'justice-theme' ); ?></li>
						</ul>
					</section>

					<h2><?php esc_html_e( 'מה יעלה את הערך של הפרופיל המקצועי?', 'justice-theme' ); ?></h2>
					<ul>
						<li><?php esc_html_e( 'תמונה מקצועית, לוגו משרד וביוגרפיה ממוקדת.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'וידאו קצר שמסביר את הגישה המקצועית.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'מאמרים חתומים לפי תחומי מומחיות.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'שאלות נפוצות, תהליך עבודה והסבר על זמינות.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'ביקורות מאושרות בלבד וללא טענות דירוג לא מבוססות.', 'justice-theme' ); ?></li>
					</ul>
					<div class="lawyer-dashboard__roadmap">
						<strong><?php esc_html_e( 'בשלבים הבאים', 'justice-theme' ); ?></strong>
						<p><?php esc_html_e( 'עריכת פרופיל עצמאית, בקשות תוכן, סליקת מנוי, תיבת לידים, AI Console ודוחות חשיפה.', 'justice-theme' ); ?></p>
					</div>
				</aside>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
