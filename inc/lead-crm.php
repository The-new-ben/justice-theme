<?php
/**
 * Owner CRM overview for leads and LegalTech requests.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_crm_admin_menu(): void {
	add_menu_page(
		'Justice CRM',
		'Justice CRM',
		'edit_pages',
		'justice-crm',
		'justice_theme_render_crm_admin_page',
		'dashicons-chart-line',
		25
	);
}
add_action( 'admin_menu', 'justice_theme_crm_admin_menu' );

function justice_theme_crm_register_lead_meta(): void {
	$fields = array(
		'lead_quality_override'     => 'string',
		'coverage_status'           => 'string',
		'follow_up_status'          => 'string',
		'first_contact_at'          => 'string',
		'customer_success_note'     => 'string',
	);

	foreach ( $fields as $key => $type ) {
		register_post_meta( 'justice_lead', $key, array(
			'single'            => true,
			'type'              => $type,
			'sanitize_callback' => 'sanitize_text_field',
			'show_in_rest'      => false,
		) );
	}
}
add_action( 'init', 'justice_theme_crm_register_lead_meta' );

function justice_theme_render_crm_admin_page(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to access this page.', 'justice-theme' ) );
	}

	$lead_counts = justice_theme_crm_count_by_status( 'justice_lead', 'lead_status' );
	$coverage_counts = justice_theme_crm_count_by_status( 'justice_lead', 'coverage_status' );
	$tool_counts = post_type_exists( 'justice_legal_request' ) ? justice_theme_crm_count_by_status( 'justice_legal_request', 'status' ) : array();
	$leads       = justice_theme_crm_query_items( 'justice_lead', 15 );
	$uncovered_demand = justice_theme_crm_query_uncovered_demand( 15 );
	$requests    = post_type_exists( 'justice_legal_request' ) ? justice_theme_crm_query_items( 'justice_legal_request', 10 ) : null;
	?>
	<div class="wrap">
		<h1>Justice CRM</h1>
		<p>Operational inbox for legal leads, LegalTech requests and owner follow-up.</p>

		<?php if ( ! post_type_exists( 'justice_lead' ) ) : ?>
			<div class="notice notice-error inline">
				<p><strong>BLOCKED:</strong> `justice_lead` post type is not active. Verify the Justice plugin.</p>
			</div>
		<?php endif; ?>

		<div class="justice-crm-cards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0;">
			<?php foreach ( justice_theme_crm_status_labels() as $status => $label ) : ?>
				<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
					<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) ( $lead_counts[ $status ] ?? 0 ) ); ?></strong>
					<span><?php echo esc_html( $label ); ?></span>
				</div>
			<?php endforeach; ?>
			<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) array_sum( $tool_counts ) ); ?></strong>
				<span>LegalTech requests</span>
			</div>
		</div>

		<h2>Recent legal leads</h2>
		<?php justice_theme_crm_render_table( $leads, 'justice_lead' ); ?>

		<h2 style="margin-top:28px;">Uncovered demand queue</h2>
		<p>Leads with no clear paid coverage yet. Use this to recruit lawyers for repeated demand before manually giving away calls for free.</p>
		<div class="justice-crm-cards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0;">
			<?php foreach ( justice_theme_crm_coverage_status_labels() as $status => $label ) : ?>
				<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
					<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) ( $coverage_counts[ $status ] ?? 0 ) ); ?></strong>
					<span><?php echo esc_html( $label ); ?></span>
				</div>
			<?php endforeach; ?>
		</div>
		<?php justice_theme_crm_render_uncovered_demand_summary(); ?>
		<?php justice_theme_crm_render_table( $uncovered_demand, 'justice_lead' ); ?>
		<?php justice_theme_crm_render_uncovered_response_templates(); ?>

		<h2 style="margin-top:28px;">Recent LegalTech requests</h2>
		<?php if ( $requests ) : ?>
			<?php justice_theme_crm_render_table( $requests, 'justice_legal_request' ); ?>
		<?php else : ?>
			<div class="notice notice-info inline"><p>`justice_legal_request` is not active yet.</p></div>
		<?php endif; ?>
	</div>
	<?php
}

function justice_theme_crm_render_uncovered_demand_summary(): void {
	$signals = justice_theme_crm_uncovered_demand_summary( 200 );

	if ( empty( $signals ) ) {
		echo '<div class="notice notice-info inline"><p>No uncovered demand signals yet.</p></div>';
		return;
	}
	?>
	<table class="widefat striped" style="margin:12px 0 18px;">
		<thead>
			<tr>
				<th>Demand signal</th>
				<th>Lead count</th>
				<th>Urgent/manual</th>
				<th>Latest lead</th>
				<th>Suggested business action</th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ( array_slice( $signals, 0, 8 ) as $signal ) : ?>
				<tr>
					<td><strong><?php echo esc_html( $signal['label'] ); ?></strong></td>
					<td><?php echo esc_html( (string) $signal['count'] ); ?></td>
					<td><?php echo esc_html( (string) $signal['urgent_count'] ); ?></td>
					<td>
						<a href="<?php echo esc_url( get_edit_post_link( (int) $signal['latest_post_id'], '' ) ); ?>">
							<?php echo esc_html( $signal['latest_title'] ); ?>
						</a>
						<br><small><?php echo esc_html( $signal['latest_date'] ); ?></small>
					</td>
					<td><?php echo esc_html( $signal['suggested_action'] ); ?></td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
	<?php justice_theme_crm_render_uncovered_recruitment_brief( $signals ); ?>
	<?php
}

function justice_theme_crm_render_uncovered_recruitment_brief( array $signals ): void {
	$top_signals = array_slice( $signals, 0, 5 );
	$lines       = array(
		'Jus-Tice weekly uncovered-demand brief',
		'Generated from recent unmatched leads in Justice CRM.',
		'',
	);

	foreach ( $top_signals as $index => $signal ) {
		$lines[] = sprintf(
			'%d. %s — %d leads, %d urgent/manual. Latest: %s. Action: %s',
			$index + 1,
			$signal['label'],
			(int) $signal['count'],
			(int) $signal['urgent_count'],
			$signal['latest_date'],
			$signal['suggested_action']
		);
	}

	$lines[] = '';
	$lines[] = 'Compliance notes: use this as internal demand evidence only. Do not promise a result, do not present a lawyer as recommended without a verified basis, do not split fees, and do not send legal advice.';
	$brief   = implode( "\n", $lines );
	?>
	<div style="margin:12px 0 18px;background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:16px;">
		<h3 style="margin-top:0;">Weekly recruitment brief</h3>
		<p>Copy this into the owner workflow when recruiting lawyers for repeated uncovered demand.</p>
		<textarea readonly rows="10" style="width:100%;"><?php echo esc_textarea( $brief ); ?></textarea>
	</div>
	<?php
}

function justice_theme_crm_uncovered_demand_summary( int $limit ): array {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return array();
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => $limit,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'meta_query'     => array(
			'relation' => 'OR',
			array(
				'key'     => 'coverage_status',
				'value'   => array( 'coverage_review', 'covered_nonpaying', 'uncovered_recruit', 'urgent_manual' ),
				'compare' => 'IN',
			),
			array(
				'key'     => 'coverage_status',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'assigned_lawyer_id',
				'compare' => 'NOT EXISTS',
			),
		),
	) );

	$signals = array();
	foreach ( $query->posts as $post_id ) {
		$post_id = (int) $post_id;
		$area    = get_post_meta( $post_id, 'ai_detected_area', true ) ?: get_post_meta( $post_id, 'legal_area', true ) ?: get_post_meta( $post_id, 'lead_area', true );
		$country = get_post_meta( $post_id, 'jurisdiction', true ) ?: get_post_meta( $post_id, 'country', true ) ?: get_post_meta( $post_id, 'lead_country', true );
		$city    = get_post_meta( $post_id, 'city', true ) ?: get_post_meta( $post_id, 'lead_city', true );

		$area_label = function_exists( 'justice_theme_lead_area_label' ) ? justice_theme_lead_area_label( (string) $area ) : (string) $area;
		$area_label = $area_label ?: 'Unknown practice';
		$market     = $country ?: $city ?: 'Unknown market';
		$key        = sanitize_key( $area_label . '-' . $market );
		$label      = $area_label . ' / ' . $market;

		if ( ! isset( $signals[ $key ] ) ) {
			$signals[ $key ] = array(
				'label'            => $label,
				'count'            => 0,
				'urgent_count'     => 0,
				'latest_post_id'   => $post_id,
				'latest_timestamp' => 0,
				'latest_title'     => get_the_title( $post_id ),
				'latest_date'      => get_the_date( 'd/m/Y H:i', $post_id ),
				'suggested_action' => 'Monitor until repeated, then recruit a paid coverage partner.',
			);
		}

		$signals[ $key ]['count']++;

		$coverage_status = get_post_meta( $post_id, 'coverage_status', true );
		$urgency         = strtolower( (string) get_post_meta( $post_id, 'urgency', true ) );
		if ( 'urgent_manual' === $coverage_status || in_array( $urgency, array( 'high', 'urgent', 'דחוף' ), true ) ) {
			$signals[ $key ]['urgent_count']++;
		}

		$timestamp = (int) get_post_time( 'U', true, $post_id );
		if ( $timestamp > (int) $signals[ $key ]['latest_timestamp'] ) {
			$signals[ $key ]['latest_post_id']   = $post_id;
			$signals[ $key ]['latest_timestamp'] = $timestamp;
			$signals[ $key ]['latest_title']     = get_the_title( $post_id );
			$signals[ $key ]['latest_date']      = get_the_date( 'd/m/Y H:i', $post_id );
		}
	}

	usort(
		$signals,
		static function ( array $a, array $b ): int {
			if ( $a['count'] === $b['count'] ) {
				return $b['latest_timestamp'] <=> $a['latest_timestamp'];
			}

			return $b['count'] <=> $a['count'];
		}
	);

	foreach ( $signals as &$signal ) {
		if ( $signal['count'] >= 3 ) {
			$signal['suggested_action'] = 'Recruit a paid niche coverage partner now.';
		} elseif ( $signal['urgent_count'] > 0 ) {
			$signal['suggested_action'] = 'Manual owner review first, then recruit coverage if repeated.';
		}
	}
	unset( $signal );

	return $signals;
}

function justice_theme_crm_render_uncovered_response_templates(): void {
	$plans_url = home_url( '/lawyer-plans/' );
	$user_template = "שלום,\n\nתודה שפניתם ל-Jus-Tice. בשלב זה אין לנו כיסוי מאומת/שותף פעיל בתחום שביקשתם, ולכן איננו יכולים להפנות אתכם לעורך דין ספציפי או להציג זאת כהמלצה.\n\nנשמור את פרטי הפנייה לצורך בדיקת התאמה עתידית, ואם יימצא כיסוי מתאים נוכל לחזור אליכם בהתאם לפרטים שמסרתם.\n\nהמידע בהודעה זו הוא כללי בלבד, אינו ייעוץ משפטי ואינו יוצר יחסי עורך דין-לקוח. אם יש מועד משפטי קרוב, דחיפות, סיכון מיידי או צורך בפעולה משפטית, מומלץ לפנות בהקדם לעורך דין מוסמך בתחום הרלוונטי.\n\nצוות Jus-Tice";
	$lawyer_template = "שלום,\n\nאנחנו מזהים ב-Jus-Tice ביקוש חוזר בתחום: [תחום/מדינה/עיר]. בשלב זה אין לנו כיסוי מאומת מספיק בתחום הזה, ולכן אנחנו בוחנים פתיחת מקום לשותף מקצועי מתאים.\n\nהמודל הוא מסלול חשיפה/כיסוי חודשי ושקוף: פרופיל מקצועי, תוכן, תיעוד פניות, מכסת פניות לפי מסלול וגילוי נאות כנדרש. אין התחייבות לתוצאה, אין חלוקת שכר טרחה, וכל פרופיל ממומן יסומן כנדרש.\n\nמסלולים: Pro ₪349, Featured ₪749, Lead Partner ₪1,490, Full Service ₪2,490 לחודש כולל מע\"מ.\n\nאפשר לראות את המסלולים כאן: " . $plans_url . "\n\nאם התחום רלוונטי אליכם, נוכל להתחיל בבדיקת התאמה קצרה: רישיון, אזורי שירות, זמינות למענה, תחומי עיסוק ותוכן ראשוני לפרופיל. CTA מומלץ: לשלוח \"כן, שלחו לי בדיקת התאמה של 5 דקות\".\n\nJus-Tice";
	$touch_sequence = "רצף פנייה מומלץ לעורך דין מתאים:\n\nיום 1 — הודעת פתיחה קצרה: ביקוש קיים בתחום [תחום/עיר], בלי הבטחות ובלי לחץ. בקשו אישור לשלוח סקירה של 2 דקות.\n\nיום 3 — המשך עם הוכחת ביקוש: כמה פניות/אותות הצטברו, איזה אזור, ומה חסר במענה הקיים. CTA קטן: בדיקת התאמה של 5 דקות.\n\nיום 7 — סגירה מנומסת: הציעו מקום אחד לשותף כיסוי בתחום, קישור למסלולים, והבהירו שהפרופיל יפורסם רק אחרי בדיקת רישיון/תוכן/כללי פרסומת.\n\nלא לעשות: לא להבטיח לידים, לא להציג המלצה, לא להציע חלוקת שכר טרחה, לא לשלוח ייעוץ משפטי.";
	?>
	<div style="margin:18px 0 0;background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:16px;">
		<h3 style="margin-top:0;">Safe uncovered-demand response templates</h3>
		<p>Use these as a starting point when there is demand but no verified/paid coverage yet. Keep the message neutral: no recommendation, no legal advice, no outcome promise. The lawyer outreach script uses a small micro-offer instead of a hard sales call.</p>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;">
			<label>
				<strong>User no-match response</strong>
				<textarea readonly rows="11" style="width:100%;margin-top:6px;direction:rtl;"><?php echo esc_textarea( $user_template ); ?></textarea>
			</label>
			<label>
				<strong>Lawyer recruitment script</strong>
				<textarea readonly rows="11" style="width:100%;margin-top:6px;direction:rtl;"><?php echo esc_textarea( $lawyer_template ); ?></textarea>
			</label>
			<label>
				<strong>3-touch outreach sequence</strong>
				<textarea readonly rows="11" style="width:100%;margin-top:6px;direction:rtl;"><?php echo esc_textarea( $touch_sequence ); ?></textarea>
			</label>
		</div>
	</div>
	<?php
}

function justice_theme_crm_query_items( string $post_type, int $limit ): ?WP_Query {
	if ( ! post_type_exists( $post_type ) ) {
		return null;
	}

	return new WP_Query( array(
		'post_type'      => $post_type,
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => $limit,
		'orderby'        => 'date',
		'order'          => 'DESC',
	) );
}

function justice_theme_crm_query_uncovered_demand( int $limit ): ?WP_Query {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return null;
	}

	return new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => $limit,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			'relation' => 'OR',
			array(
				'key'     => 'coverage_status',
				'value'   => array( 'coverage_review', 'covered_nonpaying', 'uncovered_recruit', 'urgent_manual' ),
				'compare' => 'IN',
			),
			array(
				'key'     => 'coverage_status',
				'compare' => 'NOT EXISTS',
			),
			array(
				'key'     => 'assigned_lawyer_id',
				'compare' => 'NOT EXISTS',
			),
		),
	) );
}

function justice_theme_crm_count_by_status( string $post_type, string $meta_key ): array {
	if ( ! post_type_exists( $post_type ) ) {
		return array();
	}

	$query = new WP_Query( array(
		'post_type'      => $post_type,
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => 200,
		'fields'         => 'ids',
		'no_found_rows'  => true,
	) );

	$counts = array();
	foreach ( $query->posts as $post_id ) {
		$status = get_post_meta( $post_id, $meta_key, true ) ?: 'new';
		if ( ! isset( $counts[ $status ] ) ) {
			$counts[ $status ] = 0;
		}
		$counts[ $status ]++;
	}

	return $counts;
}

function justice_theme_crm_status_labels(): array {
	return array(
		'new'       => 'New',
		'qualified' => 'Qualified',
		'assigned'  => 'Assigned',
		'contacted' => 'Contacted',
		'converted' => 'Converted',
		'closed'    => 'Closed',
	);
}

function justice_theme_crm_coverage_status_labels(): array {
	return array(
		'coverage_review'  => 'Needs coverage review',
		'covered_routable' => 'Covered: routable',
		'covered_nonpaying' => 'Covered: recruit lawyer',
		'uncovered_recruit' => 'Uncovered: recruit niche',
		'unsupported'      => 'Unsupported/no match',
		'urgent_manual'    => 'Urgent manual review',
	);
}

function justice_theme_crm_coverage_badge( int $post_id ): array {
	$status = get_post_meta( $post_id, 'coverage_status', true );

	if ( ! $status ) {
		$status = (int) get_post_meta( $post_id, 'assigned_lawyer_id', true ) ? 'covered_routable' : 'coverage_review';
	}

	$labels = justice_theme_crm_coverage_status_labels();
	$styles = array(
		'covered_routable'  => 'background:#ecfdf3;color:#166534;',
		'covered_nonpaying' => 'background:#fff7ed;color:#9a3412;',
		'uncovered_recruit' => 'background:#fef3c7;color:#92400e;',
		'unsupported'      => 'background:#f1f5f9;color:#334155;',
		'urgent_manual'    => 'background:#fef2f2;color:#991b1b;',
		'coverage_review'  => 'background:#eef2ff;color:#3730a3;',
	);

	return array(
		'label' => $labels[ $status ] ?? $labels['coverage_review'],
		'style' => $styles[ $status ] ?? $styles['coverage_review'],
	);
}

function justice_theme_crm_lead_quality( int $post_id ): array {
	$manual_quality = get_post_meta( $post_id, 'lead_quality_override', true );

	if ( in_array( $manual_quality, array( 'high', 'medium', 'low' ), true ) ) {
		return justice_theme_crm_quality_badge( $manual_quality );
	}

	$phone              = get_post_meta( $post_id, 'visitor_phone', true ) ?: get_post_meta( $post_id, 'lead_phone', true );
	$email              = get_post_meta( $post_id, 'visitor_email', true ) ?: get_post_meta( $post_id, 'lead_email', true );
	$area               = get_post_meta( $post_id, 'legal_area', true ) ?: get_post_meta( $post_id, 'lead_area', true );
	$city               = get_post_meta( $post_id, 'city', true ) ?: get_post_meta( $post_id, 'lead_city', true );
	$message            = get_post_meta( $post_id, 'message', true ) ?: get_post_meta( $post_id, 'lead_message', true );
	$urgency            = strtolower( (string) get_post_meta( $post_id, 'urgency', true ) );
	$assigned_lawyer_id = (int) get_post_meta( $post_id, 'assigned_lawyer_id', true );
	$score              = 0;

	$score += $phone ? 2 : 0;
	$score += $email ? 1 : 0;
	$score += $area ? 2 : 0;
	$score += $city ? 1 : 0;
	$score += strlen( trim( (string) $message ) ) >= 40 ? 2 : 0;
	$score += $assigned_lawyer_id ? 2 : 0;
	$score += in_array( $urgency, array( 'high', 'urgent', 'דחוף' ), true ) ? 2 : 0;

	if ( $score >= 8 ) {
		return justice_theme_crm_quality_badge( 'high' );
	}

	if ( $score >= 5 ) {
		return justice_theme_crm_quality_badge( 'medium' );
	}

	return justice_theme_crm_quality_badge( 'low' );
}

function justice_theme_crm_quality_badge( string $quality ): array {
	if ( 'high' === $quality ) {
		return array( 'label' => 'High', 'style' => 'background:#ecfdf3;color:#166534;' );
	}

	if ( 'medium' === $quality ) {
		return array( 'label' => 'Medium', 'style' => 'background:#fff7ed;color:#9a3412;' );
	}

	return array( 'label' => 'Low', 'style' => 'background:#f1f5f9;color:#334155;' );
}

function justice_theme_crm_follow_up_label( int $post_id, string $status ): array {
	$manual_follow_up = get_post_meta( $post_id, 'follow_up_status', true );

	if ( $manual_follow_up ) {
		return justice_theme_crm_follow_up_badge( $manual_follow_up );
	}

	$urgency = strtolower( (string) get_post_meta( $post_id, 'urgency', true ) );

	if ( in_array( $status, array( 'converted', 'closed', 'rejected' ), true ) ) {
		return array(
			'label' => 'Closed loop',
			'style' => 'background:#f1f5f9;color:#334155;',
		);
	}

	if ( in_array( $urgency, array( 'high', 'urgent', 'דחוף' ), true ) && in_array( $status, array( 'new', 'qualified', 'assigned' ), true ) ) {
		return array(
			'label' => 'Call now',
			'style' => 'background:#fef2f2;color:#991b1b;',
		);
	}

	if ( in_array( $status, array( 'new', 'qualified', 'assigned' ), true ) ) {
		return array(
			'label' => 'Same day',
			'style' => 'background:#fff7ed;color:#9a3412;',
		);
	}

	return array(
		'label' => 'Monitor',
		'style' => 'background:#eef2ff;color:#3730a3;',
	);
}

function justice_theme_crm_follow_up_badge( string $status ): array {
	$labels = array(
		'not_started'       => 'Not started',
		'first_attempt'     => 'First attempt',
		'contacted'         => 'Contacted',
		'consult_scheduled' => 'Consult scheduled',
		'not_qualified'     => 'Not qualified',
		'won'               => 'Won',
		'lost'              => 'Lost',
	);

	$closed = in_array( $status, array( 'not_qualified', 'won', 'lost' ), true );

	return array(
		'label' => $labels[ $status ] ?? 'Monitor',
		'style' => $closed ? 'background:#f1f5f9;color:#334155;' : 'background:#eef2ff;color:#3730a3;',
	);
}

function justice_theme_crm_response_sla_badge( int $post_id, string $status ): array {
	$first_contact   = trim( (string) get_post_meta( $post_id, 'first_contact_at', true ) );
	$manual_followup = get_post_meta( $post_id, 'follow_up_status', true );
	$closed_statuses = array( 'converted', 'closed', 'rejected' );
	$contacted_steps = array( 'first_attempt', 'contacted', 'consult_scheduled', 'not_qualified', 'won', 'lost' );

	if ( $first_contact || in_array( $manual_followup, $contacted_steps, true ) ) {
		return array(
			'label' => 'Contact logged',
			'style' => 'background:#ecfdf3;color:#166534;',
		);
	}

	if ( in_array( $status, $closed_statuses, true ) ) {
		return array(
			'label' => 'Closed',
			'style' => 'background:#f1f5f9;color:#334155;',
		);
	}

	$created_at = (int) get_post_time( 'U', true, $post_id );
	if ( ! $created_at ) {
		return array(
			'label' => 'Check',
			'style' => 'background:#f1f5f9;color:#334155;',
		);
	}

	$minutes_old = max( 0, (int) floor( ( time() - $created_at ) / MINUTE_IN_SECONDS ) );
	$urgency     = strtolower( (string) get_post_meta( $post_id, 'urgency', true ) );
	$is_urgent   = in_array( $urgency, array( 'high', 'urgent', 'דחוף' ), true );

	if ( $is_urgent && $minutes_old > 15 ) {
		return array(
			'label' => 'Overdue urgent',
			'style' => 'background:#fef2f2;color:#991b1b;',
		);
	}

	if ( $is_urgent ) {
		return array(
			'label' => 'Call now',
			'style' => 'background:#fef2f2;color:#991b1b;',
		);
	}

	if ( $minutes_old <= 15 ) {
		return array(
			'label' => 'Fresh',
			'style' => 'background:#ecfdf3;color:#166534;',
		);
	}

	if ( $minutes_old <= 60 ) {
		return array(
			'label' => 'Within hour',
			'style' => 'background:#fff7ed;color:#9a3412;',
		);
	}

	if ( $minutes_old <= 240 ) {
		return array(
			'label' => 'Due today',
			'style' => 'background:#fff7ed;color:#9a3412;',
		);
	}

	return array(
		'label' => 'Overdue',
		'style' => 'background:#fef2f2;color:#991b1b;',
	);
}

function justice_theme_crm_lead_disposition_meta_box(): void {
	add_meta_box(
		'justice_theme_lead_disposition',
		'Jus-Tice Lead Disposition',
		'justice_theme_crm_render_lead_disposition_box',
		'justice_lead',
		'side',
		'high'
	);
}
add_action( 'add_meta_boxes', 'justice_theme_crm_lead_disposition_meta_box' );

function justice_theme_crm_render_lead_disposition_box( WP_Post $post ): void {
	wp_nonce_field( 'justice_theme_lead_disposition', 'justice_theme_lead_disposition_nonce' );

	$quality         = get_post_meta( $post->ID, 'lead_quality_override', true ) ?: 'auto';
	$coverage_status = get_post_meta( $post->ID, 'coverage_status', true ) ?: 'coverage_review';
	$follow_up       = get_post_meta( $post->ID, 'follow_up_status', true ) ?: 'not_started';
	$first_contact   = get_post_meta( $post->ID, 'first_contact_at', true );
	$customer_note   = get_post_meta( $post->ID, 'customer_success_note', true );
	$quality_options = array(
		'auto'   => 'Auto score',
		'high'   => 'High',
		'medium' => 'Medium',
		'low'    => 'Low',
	);
	$coverage_options = justice_theme_crm_coverage_status_labels();
	$follow_up_options = array(
		'not_started'       => 'Not started',
		'first_attempt'     => 'First attempt',
		'contacted'         => 'Contacted',
		'consult_scheduled' => 'Consult scheduled',
		'not_qualified'     => 'Not qualified',
		'won'               => 'Won',
		'lost'              => 'Lost',
	);
	?>
	<p>
		<label for="justice-lead-quality"><strong>Lead quality</strong></label>
		<select id="justice-lead-quality" name="lead_quality_override" style="width:100%;">
			<?php foreach ( $quality_options as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $quality, $value ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<p>
		<label for="justice-coverage-status"><strong>Coverage status</strong></label>
		<select id="justice-coverage-status" name="coverage_status" style="width:100%;">
			<?php foreach ( $coverage_options as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $coverage_status, $value ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<p>
		<label for="justice-follow-up-status"><strong>Follow-up status</strong></label>
		<select id="justice-follow-up-status" name="follow_up_status" style="width:100%;">
			<?php foreach ( $follow_up_options as $value => $label ) : ?>
				<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $follow_up, $value ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<p>
		<label for="justice-first-contact-at"><strong>First contact time</strong></label>
		<input id="justice-first-contact-at" type="datetime-local" name="first_contact_at" value="<?php echo esc_attr( $first_contact ); ?>" style="width:100%;">
	</p>
	<p>
		<label for="justice-customer-success-note"><strong>Customer-success note</strong></label>
		<textarea id="justice-customer-success-note" name="customer_success_note" rows="5" style="width:100%;"><?php echo esc_textarea( $customer_note ); ?></textarea>
	</p>
	<p style="color:#646970;">Owner-only operational fields for monthly value reporting. No public display.</p>
	<?php
}

function justice_theme_crm_save_lead_disposition( int $post_id ): void {
	$nonce = isset( $_POST['justice_theme_lead_disposition_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_theme_lead_disposition_nonce'] ) ) : '';

	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_theme_lead_disposition' ) ) {
		return;
	}

	if ( ! current_user_can( 'edit_post', $post_id ) || ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) ) {
		return;
	}

	$quality = isset( $_POST['lead_quality_override'] ) ? sanitize_key( wp_unslash( $_POST['lead_quality_override'] ) ) : 'auto';
	if ( ! in_array( $quality, array( 'auto', 'high', 'medium', 'low' ), true ) ) {
		$quality = 'auto';
	}

	$follow_up = isset( $_POST['follow_up_status'] ) ? sanitize_key( wp_unslash( $_POST['follow_up_status'] ) ) : 'not_started';
	if ( ! in_array( $follow_up, array( 'not_started', 'first_attempt', 'contacted', 'consult_scheduled', 'not_qualified', 'won', 'lost' ), true ) ) {
		$follow_up = 'not_started';
	}
	$contacted_steps  = array( 'first_attempt', 'contacted', 'consult_scheduled', 'not_qualified', 'won', 'lost' );
	$first_contact_at = isset( $_POST['first_contact_at'] ) ? sanitize_text_field( wp_unslash( $_POST['first_contact_at'] ) ) : '';
	if ( '' === $first_contact_at && in_array( $follow_up, $contacted_steps, true ) ) {
		$first_contact_at = current_time( 'Y-m-d\TH:i' );
	}
	$lead_status_map = array(
		'not_started'       => 'assigned',
		'first_attempt'     => 'contacted',
		'contacted'         => 'contacted',
		'consult_scheduled' => 'accepted',
		'not_qualified'     => 'rejected',
		'won'               => 'converted',
		'lost'              => 'closed',
	);

	$coverage_status = isset( $_POST['coverage_status'] ) ? sanitize_key( wp_unslash( $_POST['coverage_status'] ) ) : 'coverage_review';
	if ( ! array_key_exists( $coverage_status, justice_theme_crm_coverage_status_labels() ) ) {
		$coverage_status = 'coverage_review';
	}

	update_post_meta( $post_id, 'lead_quality_override', $quality );
	update_post_meta( $post_id, 'coverage_status', $coverage_status );
	update_post_meta( $post_id, 'follow_up_status', $follow_up );
	update_post_meta( $post_id, 'lead_status', $lead_status_map[ $follow_up ] ?? 'assigned' );
	update_post_meta( $post_id, 'first_contact_at', $first_contact_at );
	if ( 'consult_scheduled' === $follow_up && ! get_post_meta( $post_id, 'consultation_scheduled_at', true ) ) {
		update_post_meta( $post_id, 'consultation_scheduled_at', current_time( 'mysql' ) );
	}
	if ( 'won' === $follow_up && ! get_post_meta( $post_id, 'retained_at', true ) ) {
		update_post_meta( $post_id, 'retained_at', current_time( 'mysql' ) );
	}
	if ( in_array( $follow_up, array( 'not_qualified', 'lost' ), true ) && ! get_post_meta( $post_id, 'closed_at', true ) ) {
		update_post_meta( $post_id, 'closed_at', current_time( 'mysql' ) );
	}
	update_post_meta( $post_id, 'customer_success_note', isset( $_POST['customer_success_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['customer_success_note'] ) ) : '' );
}
add_action( 'save_post_justice_lead', 'justice_theme_crm_save_lead_disposition' );

function justice_theme_crm_render_table( ?WP_Query $items, string $post_type ): void {
	if ( ! $items || ! $items->have_posts() ) {
		echo '<div class="notice notice-info inline"><p>No records found.</p></div>';
		return;
	}

	$status_key = 'justice_legal_request' === $post_type ? 'status' : 'lead_status';
	?>
	<table class="widefat striped">
		<thead>
			<tr>
				<th>Name</th>
				<th>Phone</th>
				<th>Email</th>
				<th>Area / Tool</th>
				<th>Status</th>
				<th>Coverage</th>
				<th>Quality</th>
				<th>Follow-up</th>
				<th>Response SLA</th>
				<th>Source</th>
				<th>Date</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			<?php while ( $items->have_posts() ) : $items->the_post(); ?>
				<?php
				$post_id = get_the_ID();
				$name    = get_post_meta( $post_id, 'visitor_name', true ) ?: get_post_meta( $post_id, 'lead_name', true ) ?: get_the_title();
				$phone   = get_post_meta( $post_id, 'visitor_phone', true ) ?: get_post_meta( $post_id, 'lead_phone', true );
				$email   = get_post_meta( $post_id, 'visitor_email', true ) ?: get_post_meta( $post_id, 'lead_email', true );
				$phone_link = $phone && function_exists( 'justice_theme_lawyer_public_phone_link' ) ? justice_theme_lawyer_public_phone_link( (string) $phone ) : '';
				$phone_link = $phone_link ?: ( $phone ? 'tel:' . preg_replace( '/[^0-9+]/', '', (string) $phone ) : '' );
				$whatsapp_link = $phone && function_exists( 'justice_theme_lawyer_public_whatsapp_link' ) ? justice_theme_lawyer_public_whatsapp_link( (string) $phone ) : '';
				if ( $whatsapp_link ) {
					$whatsapp_link = add_query_arg(
						'text',
						sprintf(
							'שלום %s, כאן Jus-Tice. קיבלנו את הפנייה שלך ונשמח לעזור לחבר אותך לעורך דין מתאים. אפשר לשוחח עכשיו?',
							$name
						),
						$whatsapp_link
					);
				}
				$email_link = $email ? add_query_arg(
					array(
						'subject' => 'פנייתך ל-Jus-Tice',
						'body'    => sprintf( "שלום %s,\n\nקיבלנו את הפנייה שלך ב-Jus-Tice ונשמח לעזור לחבר אותך לעורך דין מתאים.\n\nבברכה,\nJus-Tice", $name ),
					),
					'mailto:' . $email
				) : '';
				$area    = get_post_meta( $post_id, 'legal_area', true ) ?: get_post_meta( $post_id, 'lead_area', true );
				$ai_area = get_post_meta( $post_id, 'ai_detected_area', true );
				$area_display = function_exists( 'justice_theme_lead_area_label' ) ? justice_theme_lead_area_label( $ai_area ?: $area ) : ( $ai_area ?: $area );
				$tool_id = (int) get_post_meta( $post_id, 'tool_id', true );
				$source  = get_post_meta( $post_id, 'source_url', true );
				$status  = get_post_meta( $post_id, $status_key, true ) ?: 'new';
				$coverage = 'justice_lead' === $post_type ? justice_theme_crm_coverage_badge( $post_id ) : array( 'label' => '-', 'style' => 'background:#f1f5f9;color:#334155;' );
				$quality = 'justice_lead' === $post_type ? justice_theme_crm_lead_quality( $post_id ) : array( 'label' => '-', 'style' => 'background:#f1f5f9;color:#334155;' );
				$follow_up = 'justice_lead' === $post_type ? justice_theme_crm_follow_up_label( $post_id, $status ) : array( 'label' => '-', 'style' => 'background:#f1f5f9;color:#334155;' );
				$response_sla = 'justice_lead' === $post_type ? justice_theme_crm_response_sla_badge( $post_id, $status ) : array( 'label' => '-', 'style' => 'background:#f1f5f9;color:#334155;' );
				?>
				<tr>
					<td><strong><?php echo esc_html( $name ); ?></strong></td>
					<td><?php echo $phone_link ? '<a href="' . esc_url( $phone_link ) . '">' . esc_html( $phone ) . '</a>' : '-'; ?></td>
					<td><?php echo $email ? '<a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>' : '-'; ?></td>
					<td><?php echo esc_html( $tool_id ? get_the_title( $tool_id ) : ( $area_display ?: '-' ) ); ?></td>
					<td><?php echo esc_html( $status ); ?></td>
					<td><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $coverage['style'] ); ?>"><?php echo esc_html( $coverage['label'] ); ?></span></td>
					<td><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $quality['style'] ); ?>"><?php echo esc_html( $quality['label'] ); ?></span></td>
					<td><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $follow_up['style'] ); ?>"><?php echo esc_html( $follow_up['label'] ); ?></span></td>
					<td><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $response_sla['style'] ); ?>"><?php echo esc_html( $response_sla['label'] ); ?></span></td>
					<td><?php echo $source ? '<a href="' . esc_url( $source ) . '" target="_blank" rel="noopener">source</a>' : '-'; ?></td>
					<td><?php echo esc_html( get_the_date( 'd/m/Y H:i', $post_id ) ); ?></td>
					<td>
						<div style="display:flex;gap:4px;flex-wrap:wrap;min-width:180px;">
							<a class="button button-primary" href="<?php echo esc_url( get_edit_post_link( $post_id, '' ) ); ?>">Open</a>
							<?php if ( $phone_link ) : ?>
								<a class="button" href="<?php echo esc_url( $phone_link ); ?>">Call</a>
							<?php endif; ?>
							<?php if ( $whatsapp_link ) : ?>
								<a class="button" href="<?php echo esc_url( $whatsapp_link ); ?>" target="_blank" rel="noopener">WhatsApp</a>
							<?php endif; ?>
							<?php if ( $email_link ) : ?>
								<a class="button" href="<?php echo esc_url( $email_link ); ?>">Email</a>
							<?php endif; ?>
						</div>
					</td>
				</tr>
			<?php endwhile; ?>
		</tbody>
	</table>
	<?php
	wp_reset_postdata();
}
