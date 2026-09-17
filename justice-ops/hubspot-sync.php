<?php
/**
 * HubSpot sync for site leads (owner order 2026-09-17, Linear HAD-87).
 *
 * Every justice_lead becomes a HubSpot contact (the client) plus a deal in the
 * "לידים לעורכי דין" pipeline that carries the practice family, city, urgency,
 * the assigned lawyer, the routed price and the source page. Routing status
 * changes move the deal stage (new → routed → lawyer acknowledged).
 *
 * Token-gated: nothing leaves the site until the owner pastes a HubSpot
 * Private App token on Settings → Justice HubSpot. The token is stored as a
 * WordPress option, never printed back, never logged. Idempotent per lead:
 * a lead with a hubspot_deal_id is never created twice. Failures are stored
 * on the lead (hubspot_error) and never block routing or the visitor.
 *
 * Before 2026-09-17 no code path on the site touched HubSpot at all; the CRM
 * held 770 imported lawyers and zero client leads.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_hubspot_token(): string {
	return trim( (string) get_option( 'justice_hubspot_token', '' ) );
}

function justice_hubspot_enabled(): bool {
	return '' !== justice_hubspot_token();
}

/**
 * Pipeline and stage ids. The portal's tier cannot create custom pipelines
 * (checked 2026-09-17), so the defaults use HubSpot's default deal pipeline:
 * Appointment scheduled = new lead, Qualified to buy = routed to a lawyer,
 * Presentation scheduled = lawyer acknowledged. The options page lets the
 * owner repoint them without a release once a custom pipeline exists.
 */
function justice_hubspot_setting( string $key, string $default ): string {
	$value = trim( (string) get_option( 'justice_hubspot_' . $key, '' ) );
	return '' !== $value ? $value : $default;
}

function justice_hubspot_pipeline_defaults(): array {
	return array(
		'pipeline'     => 'default',
		'stage_new'    => 'appointmentscheduled',
		'stage_routed' => 'qualifiedtobuy',
		'stage_ack'    => 'presentationscheduled',
	);
}

/**
 * One authenticated request. Returns ok/code/error/data, never throws,
 * never includes the token in the returned error text.
 */
function justice_hubspot_request( string $method, string $path, ?array $body = null ): array {
	$args = array(
		'method'  => $method,
		'timeout' => 15,
		'headers' => array(
			'Authorization' => 'Bearer ' . justice_hubspot_token(),
			'Content-Type'  => 'application/json',
		),
	);
	if ( null !== $body ) {
		$args['body'] = wp_json_encode( $body );
	}
	$res = wp_remote_request( 'https://api.hubapi.com' . $path, $args );
	if ( is_wp_error( $res ) ) {
		return array( 'ok' => false, 'code' => 0, 'error' => $res->get_error_message(), 'data' => array() );
	}
	$code = (int) wp_remote_retrieve_response_code( $res );
	$data = json_decode( (string) wp_remote_retrieve_body( $res ), true );
	$data = is_array( $data ) ? $data : array();
	$err  = '';
	if ( $code < 200 || $code >= 300 ) {
		$err = (string) ( $data['message'] ?? ( 'HTTP ' . $code ) );
	}
	return array( 'ok' => '' === $err, 'code' => $code, 'error' => mb_substr( $err, 0, 300 ), 'data' => $data );
}

function justice_hubspot_family_label( string $family ): string {
	$labels = array(
		'family'       => 'דיני משפחה',
		'criminal-law' => 'פלילי',
		'real-estate'  => 'מקרקעין',
		'nezikin'      => 'נזיקין ורשלנות רפואית',
		'labor'        => 'דיני עבודה',
		'traffic'      => 'תעבורה',
		'inheritance'  => 'ירושה',
		'tax-business' => 'מיסים ועסקים',
	);
	return $labels[ $family ] ?? ( $family ?: 'לא ידוע' );
}

/**
 * The lead as HubSpot sees it. Custom properties (justice_*) were created in
 * the portal on 2026-09-17; if a portal lacks them the sync retries with the
 * standard properties only, so a missing property never loses a lead.
 */
function justice_hubspot_lead_snapshot( int $lead_id ): array {
	$area   = (string) get_post_meta( $lead_id, 'legal_area', true );
	$family = function_exists( 'justice_router_area_to_family' ) ? justice_router_area_to_family( $area ) : '';
	$lawyer = (int) get_post_meta( $lead_id, 'assigned_lawyer_id', true );
	$source = (string) get_post_meta( $lead_id, 'source_url', true );
	if ( '' === $source ) {
		$source = (string) get_post_meta( $lead_id, 'lead_source_surface', true );
	}
	return array(
		'name'     => sanitize_text_field( (string) get_post_meta( $lead_id, 'visitor_name', true ) ),
		'phone'    => sanitize_text_field( (string) get_post_meta( $lead_id, 'visitor_phone', true ) ),
		'email'    => sanitize_email( (string) get_post_meta( $lead_id, 'visitor_email', true ) ),
		'city'     => sanitize_text_field( (string) get_post_meta( $lead_id, 'city', true ) ),
		'urgency'  => sanitize_text_field( (string) get_post_meta( $lead_id, 'urgency', true ) ),
		'message'  => wp_strip_all_tags( (string) get_post_meta( $lead_id, 'message', true ) ),
		'family'   => $family,
		'area'     => $area,
		'lawyer'   => $lawyer > 0 ? wp_strip_all_tags( get_the_title( $lawyer ) ) : '',
		'price'    => (string) get_post_meta( $lead_id, 'lead_price_ils', true ),
		'status'   => (string) get_post_meta( $lead_id, 'lead_routing_status', true ),
		'routed'   => (string) get_post_meta( $lead_id, 'lead_routed_at', true ),
		'acked'    => (string) get_post_meta( $lead_id, 'lead_ack_at', true ),
		'source'   => $source,
		'created'  => (string) get_post_field( 'post_date', $lead_id ),
	);
}

/**
 * Contact upsert. HubSpot dedupes contacts by email only; a 409 on create
 * carries the existing id, which is then updated in place.
 */
function justice_hubspot_contact_for_lead( int $lead_id, array $s ): array {
	$existing = (string) get_post_meta( $lead_id, 'hubspot_contact_id', true );
	if ( '' !== $existing ) {
		return array( 'ok' => true, 'id' => $existing, 'error' => '' );
	}
	if ( '' === $s['name'] && '' === $s['phone'] && '' === $s['email'] ) {
		return array( 'ok' => false, 'id' => '', 'error' => 'lead has no name, phone or email' );
	}

	$standard = array(
		'firstname'      => $s['name'] ?: 'פונה מהאתר',
		'phone'          => $s['phone'],
		'lifecyclestage' => 'lead',
		'hs_lead_status' => 'NEW',
	);
	if ( '' !== $s['email'] ) {
		$standard['email'] = $s['email'];
	}
	$custom = array(
		'justice_lead_id'         => (string) $lead_id,
		'justice_practice_family' => justice_hubspot_family_label( $s['family'] ),
		'justice_city'            => $s['city'],
		'justice_urgency'         => $s['urgency'],
		'justice_assigned_lawyer' => $s['lawyer'],
		'justice_source_page'     => $s['source'],
	);

	foreach ( array( $standard + $custom, $standard ) as $props ) {
		$r = justice_hubspot_request( 'POST', '/crm/v3/objects/contacts', array( 'properties' => $props ) );
		if ( $r['ok'] && ! empty( $r['data']['id'] ) ) {
			return array( 'ok' => true, 'id' => (string) $r['data']['id'], 'error' => '' );
		}
		if ( 409 === $r['code'] && preg_match( '/Existing ID:\s*(\d+)/', $r['error'], $m ) ) {
			$id = $m[1];
			justice_hubspot_request( 'PATCH', '/crm/v3/objects/contacts/' . $id, array( 'properties' => $props ) );
			return array( 'ok' => true, 'id' => $id, 'error' => '' );
		}
		if ( 400 !== $r['code'] || false === stripos( $r['error'], 'propert' ) ) {
			return array( 'ok' => false, 'id' => '', 'error' => $r['error'] );
		}
		// 400 on a property: fall through to the standard-only attempt.
	}
	return array( 'ok' => false, 'id' => '', 'error' => isset( $r ) ? $r['error'] : 'unknown' );
}

function justice_hubspot_stage_for_status( array $s ): string {
	$d = justice_hubspot_pipeline_defaults();
	if ( '' !== $s['acked'] ) {
		return justice_hubspot_setting( 'stage_ack', $d['stage_ack'] );
	}
	if ( 'routed' === $s['status'] ) {
		return justice_hubspot_setting( 'stage_routed', $d['stage_routed'] );
	}
	return justice_hubspot_setting( 'stage_new', $d['stage_new'] );
}

function justice_hubspot_deal_properties( int $lead_id, array $s ): array {
	$d     = justice_hubspot_pipeline_defaults();
	$title = 'ליד ' . justice_hubspot_family_label( $s['family'] ) . ': ' . ( $s['name'] ?: 'פונה מהאתר' );
	if ( '' !== $s['lawyer'] ) {
		$title .= ' → ' . $s['lawyer'];
	}
	$lines = array(
		'ליד באתר: #' . $lead_id . ' (' . $s['created'] . ')',
		'תחום: ' . justice_hubspot_family_label( $s['family'] ) . ( $s['area'] ? ' (' . $s['area'] . ')' : '' ),
		'עיר: ' . ( $s['city'] ?: 'לא צוינה' ),
		'דחיפות: ' . ( $s['urgency'] ?: 'לא צוינה' ),
		'סטטוס ניתוב: ' . ( $s['status'] ?: 'לא נותב' ) . ( $s['routed'] ? ' ב-' . $s['routed'] : '' ),
		'עורך דין: ' . ( $s['lawyer'] ?: 'לא הוקצה' ) . ( $s['acked'] ? ' (אישר קבלה ב-' . $s['acked'] . ')' : '' ),
		'עמוד מקור: ' . ( $s['source'] ?: 'לא ידוע' ),
	);
	if ( '' !== $s['message'] ) {
		$lines[] = 'הודעה: ' . mb_substr( $s['message'], 0, 1500 );
	}
	$props = array(
		'dealname'    => mb_substr( $title, 0, 200 ),
		'pipeline'    => justice_hubspot_setting( 'pipeline', $d['pipeline'] ),
		'dealstage'   => justice_hubspot_stage_for_status( $s ),
		'description' => implode( "\n", $lines ),
	);
	if ( '' !== $s['price'] && is_numeric( $s['price'] ) ) {
		$props['amount'] = $s['price'];
	}
	return $props;
}

/**
 * Create or update the deal for one lead. Safe to call repeatedly.
 */
function justice_hubspot_sync_lead( int $lead_id ): array {
	if ( ! justice_hubspot_enabled() || 'justice_lead' !== get_post_type( $lead_id ) ) {
		return array( 'ok' => false, 'error' => 'disabled or not a lead' );
	}
	$s       = justice_hubspot_lead_snapshot( $lead_id );
	$contact = justice_hubspot_contact_for_lead( $lead_id, $s );
	if ( ! $contact['ok'] ) {
		update_post_meta( $lead_id, 'hubspot_error', wp_date( 'Y-m-d H:i' ) . ' contact: ' . $contact['error'] );
		return array( 'ok' => false, 'error' => $contact['error'] );
	}
	update_post_meta( $lead_id, 'hubspot_contact_id', $contact['id'] );

	$props   = justice_hubspot_deal_properties( $lead_id, $s );
	$deal_id = (string) get_post_meta( $lead_id, 'hubspot_deal_id', true );

	if ( '' !== $deal_id ) {
		$r = justice_hubspot_request( 'PATCH', '/crm/v3/objects/deals/' . $deal_id, array( 'properties' => $props ) );
	} else {
		$r = justice_hubspot_request( 'POST', '/crm/v3/objects/deals', array(
			'properties'   => $props,
			'associations' => array(
				array(
					'to'    => array( 'id' => $contact['id'] ),
					'types' => array( array( 'associationCategory' => 'HUBSPOT_DEFINED', 'associationTypeId' => 3 ) ),
				),
			),
		) );
		if ( $r['ok'] && ! empty( $r['data']['id'] ) ) {
			$deal_id = (string) $r['data']['id'];
			update_post_meta( $lead_id, 'hubspot_deal_id', $deal_id );
		}
	}

	if ( ! $r['ok'] ) {
		update_post_meta( $lead_id, 'hubspot_error', wp_date( 'Y-m-d H:i' ) . ' deal: ' . $r['error'] );
		return array( 'ok' => false, 'error' => $r['error'] );
	}
	update_post_meta( $lead_id, 'hubspot_synced_at', wp_date( 'Y-m-d H:i' ) );
	delete_post_meta( $lead_id, 'hubspot_error' );
	return array( 'ok' => true, 'deal' => $deal_id, 'contact' => $contact['id'] );
}

/**
 * Live triggers: the router stamps lead_routing_status on every new lead
 * (routed or not) and lead_ack_at when the lawyer taps the acknowledge link.
 * Runs after the meta write, so the snapshot sees the final state.
 */
function justice_hubspot_on_meta( $meta_id, $post_id, $meta_key ): void {
	if ( ! in_array( $meta_key, array( 'lead_routing_status', 'lead_ack_at' ), true ) ) {
		return;
	}
	$post_id = (int) $post_id;
	if ( 'justice_lead' !== get_post_type( $post_id ) || ! justice_hubspot_enabled() ) {
		return;
	}
	justice_hubspot_sync_lead( $post_id );
}
add_action( 'added_post_meta', 'justice_hubspot_on_meta', 20, 3 );
add_action( 'updated_post_meta', 'justice_hubspot_on_meta', 20, 3 );

/**
 * Backfill: the leads that existed before the sync, oldest first, 25 per run.
 */
function justice_hubspot_backfill( int $limit = 25 ): array {
	$q = new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => 'any',
		'posts_per_page' => max( 1, min( 100, $limit ) ),
		'orderby'        => 'date',
		'order'          => 'ASC',
		'fields'         => 'ids',
		'meta_query'     => array( array( 'key' => 'hubspot_deal_id', 'compare' => 'NOT EXISTS' ) ),
	) );
	$done = 0; $failed = 0; $last = '';
	foreach ( $q->posts as $id ) {
		$r = justice_hubspot_sync_lead( (int) $id );
		if ( $r['ok'] ) { $done++; } else { $failed++; $last = $r['error']; }
	}
	return array( 'done' => $done, 'failed' => $failed, 'remaining' => max( 0, (int) $q->found_posts - count( $q->posts ) ), 'last_error' => $last );
}

/* ----------------------------------------------------------------------- *
 *   Settings → Justice HubSpot                                             *
 * ----------------------------------------------------------------------- */

add_action( 'admin_menu', function () {
	add_options_page( 'Justice HubSpot', 'Justice HubSpot', 'manage_options', 'justice-hubspot', 'justice_hubspot_settings_page' );
} );

add_action( 'admin_init', function () {
	// An empty submission keeps the stored token; the field never echoes it back.
	register_setting( 'justice_hubspot', 'justice_hubspot_token', array(
		'sanitize_callback' => function ( $value ) {
			$value = sanitize_text_field( (string) $value );
			return '' === $value ? (string) get_option( 'justice_hubspot_token', '' ) : $value;
		},
	) );
	foreach ( array( 'pipeline', 'stage_new', 'stage_routed', 'stage_ack' ) as $key ) {
		register_setting( 'justice_hubspot', 'justice_hubspot_' . $key, array( 'sanitize_callback' => 'sanitize_text_field' ) );
	}
} );

add_action( 'admin_post_justice_hubspot_backfill', function () {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'forbidden' );
	}
	check_admin_referer( 'justice_hubspot_backfill' );
	$r = justice_hubspot_enabled() ? justice_hubspot_backfill( 25 ) : array( 'done' => 0, 'failed' => 0, 'remaining' => 0, 'last_error' => 'אין מפתח' );
	set_transient( 'justice_hubspot_last_backfill', $r, 10 * MINUTE_IN_SECONDS );
	wp_safe_redirect( admin_url( 'options-general.php?page=justice-hubspot&backfill=1' ) );
	exit;
} );

add_action( 'admin_post_justice_hubspot_disconnect', function () {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'forbidden' );
	}
	check_admin_referer( 'justice_hubspot_disconnect' );
	delete_option( 'justice_hubspot_token' );
	wp_safe_redirect( admin_url( 'options-general.php?page=justice-hubspot&disconnected=1' ) );
	exit;
} );

function justice_hubspot_settings_page(): void {
	$d       = justice_hubspot_pipeline_defaults();
	$synced  = (int) ( new WP_Query( array( 'post_type' => 'justice_lead', 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids', 'meta_query' => array( array( 'key' => 'hubspot_deal_id', 'compare' => 'EXISTS' ) ) ) ) )->found_posts;
	$total   = (int) ( new WP_Query( array( 'post_type' => 'justice_lead', 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids' ) ) )->found_posts;
	$errors  = (int) ( new WP_Query( array( 'post_type' => 'justice_lead', 'post_status' => 'any', 'posts_per_page' => 1, 'fields' => 'ids', 'meta_query' => array( array( 'key' => 'hubspot_error', 'compare' => 'EXISTS' ) ) ) ) )->found_posts;
	$last    = get_transient( 'justice_hubspot_last_backfill' );
	?>
	<div class="wrap" dir="rtl">
		<h1>Justice HubSpot</h1>
		<p>כל פנייה באתר נשמרת כליד ומסונכרנת ל-HubSpot כאיש קשר (הפונה) ועסקה במשפך המכירות עם עורך הדין שקיבל אותה, התחום, העיר והעמוד שממנו הגיעה. שום דבר לא נשלח בלי מפתח.</p>
		<p><strong>מצב:</strong> <?php echo justice_hubspot_enabled() ? 'מחובר (מפתח שמור)' : 'לא מחובר, אין מפתח'; ?> · לידים באתר: <?php echo esc_html( (string) $total ); ?> · מסונכרנים: <?php echo esc_html( (string) $synced ); ?> · עם שגיאה: <?php echo esc_html( (string) $errors ); ?></p>
		<?php if ( is_array( $last ) && isset( $_GET['backfill'] ) ) : ?>
			<div class="notice notice-info"><p>סבב סנכרון: <?php echo esc_html( (string) $last['done'] ); ?> הצליחו, <?php echo esc_html( (string) $last['failed'] ); ?> נכשלו, נשארו <?php echo esc_html( (string) $last['remaining'] ); ?>.<?php echo $last['last_error'] ? ' שגיאה אחרונה: ' . esc_html( $last['last_error'] ) : ''; ?></p></div>
		<?php endif; ?>
		<form method="post" action="options.php">
			<?php settings_fields( 'justice_hubspot' ); ?>
			<table class="form-table" role="presentation">
				<tr><th scope="row"><label for="justice_hubspot_token">מפתח Private App</label></th>
					<td><input type="password" id="justice_hubspot_token" name="justice_hubspot_token" value="" class="regular-text" autocomplete="new-password" placeholder="<?php echo justice_hubspot_enabled() ? 'שמור. הדבק מפתח חדש רק כדי להחליף' : 'pat-eu1-…'; ?>">
					<p class="description">HubSpot → Settings → Integrations → Private Apps. הרשאות נדרשות: crm.objects.contacts (read+write), crm.objects.deals (read+write). המפתח נשמר באתר בלבד ולא מוצג שוב.</p></td></tr>
				<tr><th scope="row"><label for="justice_hubspot_pipeline">מזהה משפך</label></th>
					<td><input type="text" id="justice_hubspot_pipeline" name="justice_hubspot_pipeline" value="<?php echo esc_attr( (string) get_option( 'justice_hubspot_pipeline', '' ) ); ?>" class="regular-text" placeholder="<?php echo esc_attr( $d['pipeline'] ); ?>"></td></tr>
				<tr><th scope="row">מזהי שלבים</th>
					<td>
						<label>ליד חדש <input type="text" name="justice_hubspot_stage_new" value="<?php echo esc_attr( (string) get_option( 'justice_hubspot_stage_new', '' ) ); ?>" placeholder="<?php echo esc_attr( $d['stage_new'] ); ?>"></label><br>
						<label>נותב לעורך דין <input type="text" name="justice_hubspot_stage_routed" value="<?php echo esc_attr( (string) get_option( 'justice_hubspot_stage_routed', '' ) ); ?>" placeholder="<?php echo esc_attr( $d['stage_routed'] ); ?>"></label><br>
						<label>עורך הדין אישר קבלה <input type="text" name="justice_hubspot_stage_ack" value="<?php echo esc_attr( (string) get_option( 'justice_hubspot_stage_ack', '' ) ); ?>" placeholder="<?php echo esc_attr( $d['stage_ack'] ); ?>"></label>
						<p class="description">ריק = המשפך הראשי של HubSpot: Appointment scheduled = ליד חדש, Qualified to buy = נותב לעורך דין, Presentation scheduled = עורך הדין אישר קבלה.</p>
					</td></tr>
			</table>
			<?php submit_button( 'שמירה' ); ?>
		</form>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-top:1em">
			<?php wp_nonce_field( 'justice_hubspot_backfill' ); ?>
			<input type="hidden" name="action" value="justice_hubspot_backfill">
			<?php submit_button( 'סנכרן 25 לידים קיימים שעוד לא עלו', 'secondary', 'submit', false, justice_hubspot_enabled() ? array() : array( 'disabled' => 'disabled' ) ); ?>
		</form>
		<?php if ( justice_hubspot_enabled() ) : ?>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-top:1em">
			<?php wp_nonce_field( 'justice_hubspot_disconnect' ); ?>
			<input type="hidden" name="action" value="justice_hubspot_disconnect">
			<?php submit_button( 'ניתוק (מחיקת המפתח)', 'delete', 'submit', false ); ?>
		</form>
		<?php endif; ?>
	</div>
	<?php
}
