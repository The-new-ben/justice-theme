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
		'qualified_lead_billing_status' => 'string',
		'qualified_lead_invoice_reference' => 'string',
		'qualified_lead_billed_at'  => 'string',
		'qualified_lead_paid_at'    => 'string',
		'qualified_lead_ready_at'   => 'string',
		'qualified_lead_billable_lawyer_ids' => 'string',
		'qualified_lead_payment_evidence_url' => 'string',
		'qualified_lead_owner_note' => 'string',
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
	$qualified_revenue = justice_theme_crm_qualified_lead_revenue_snapshot();
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
			<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:24px;">₪<?php echo esc_html( number_format_i18n( $qualified_revenue['open_value'] ) ); ?></strong>
				<span>Qualified lead billing queue</span>
				<small style="display:block;color:#646970;margin-top:4px;"><?php echo esc_html( sprintf( '%d open / %d paid', $qualified_revenue['open_count'], $qualified_revenue['paid_count'] ) ); ?></small>
			</div>
		</div>

		<?php justice_theme_crm_render_btl_supply_panel(); ?>
		<?php justice_theme_crm_render_qualified_lead_billing_queue(); ?>

		<h2>Recent legal leads</h2>
		<?php justice_theme_crm_render_table( $leads, 'justice_lead' ); ?>

		<?php justice_theme_crm_render_lawyer_sales_pipeline(); ?>
		<?php justice_theme_crm_render_supplier_pipeline(); ?>

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
						<?php $prospect_url = justice_theme_crm_prospect_from_lead_url( (int) $signal['latest_post_id'] ); ?>
						<?php if ( $prospect_url ) : ?>
							<br><a class="button button-small" style="margin-top:6px;" href="<?php echo esc_url( $prospect_url ); ?>">Create prospect</a>
						<?php endif; ?>
					</td>
					<td><?php echo esc_html( $signal['suggested_action'] ); ?></td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
	<?php justice_theme_crm_render_uncovered_recruitment_brief( $signals ); ?>
	<?php
}

function justice_theme_crm_render_lawyer_sales_pipeline(): void {
	if ( ! post_type_exists( 'justice_prospect' ) ) {
		return;
	}

	$summary   = justice_theme_crm_lawyer_prospect_summary( 250 );
	$prospects = justice_theme_crm_query_lawyer_prospects( 50 );
	$all_url   = admin_url( 'edit.php?post_type=justice_prospect' );
	$new_url   = admin_url( 'post-new.php?post_type=justice_prospect' );
	?>
	<h2 style="margin-top:28px;">Lawyer sales pipeline</h2>
	<p>Track lawyers to contact for paid coverage. This is the owner sales queue, not a public listing.</p>
	<div class="justice-crm-cards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0;">
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $summary['open_count'] ); ?></strong>
			<span>Open prospects</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( number_format_i18n( (int) $summary['open_monthly_nis'] ) ); ?> NIS</strong>
			<span>Open monthly pipeline</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $summary['hot_count'] ); ?></strong>
			<span>Hot prospects</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $summary['due_count'] ); ?></strong>
			<span>Due follow-ups</span>
		</div>
	</div>
	<p>
		<a class="button button-primary" href="<?php echo esc_url( $all_url ); ?>">Open all prospects</a>
		<a class="button" href="<?php echo esc_url( $new_url ); ?>">Add prospect</a>
	</p>
	<?php justice_theme_crm_render_lawyer_prospect_table( $prospects ); ?>
	<?php
}

function justice_theme_crm_render_btl_supply_panel(): void {
	if ( ! post_type_exists( 'justice_lawyer' ) || ! post_type_exists( 'justice_prospect' ) ) {
		return;
	}

	$btl_needles        = array( 'national-insurance', 'ביטוח לאומי', 'ערר ביטוח לאומי', 'ועדה רפואית' );
	$active_specialists = justice_theme_crm_count_active_routing_lawyers_for_area( 'national-insurance' );
	$open_prospects    = justice_theme_crm_count_open_prospects_for_area( $btl_needles );
	$verified_prospects = justice_theme_crm_count_verified_prospects_for_area( $btl_needles );
	$target            = 3;
	$coverage_gap      = max( 0, $target - $active_specialists );
	$prospect_gap      = max( 0, $target - $verified_prospects );
	$add_url           = justice_theme_crm_btl_prospect_prefill_url();
	$pipeline_url      = admin_url( 'edit.php?post_type=justice_prospect' );
	$needs_verification_url = add_query_arg( 'justice_prospect_verification_filter', 'needs', $pipeline_url );
	$ready_verification_url = add_query_arg( 'justice_prospect_verification_filter', 'ready', $pipeline_url );
	$source_pack_path       = 'project-control/btl-specialist-prospect-shortlist-2026-05-26.md';
	$source_pack_rows       = justice_theme_crm_read_btl_source_pack( 100 );
	$source_pack_progress   = justice_theme_crm_btl_source_pack_progress( $source_pack_rows );
	$billable_btl_leads     = justice_theme_crm_count_btl_billable_leads( $btl_needles, array( 'ready_to_bill', 'invoice_sent', 'paid' ) );
	$paid_btl_leads         = justice_theme_crm_count_btl_billable_leads( $btl_needles, array( 'paid' ) );
	?>
	<h2 style="margin-top:28px;">Bituach Leumi specialist supply</h2>
	<p>Owner-only coverage check for the active appeal funnel. The first goal is three specialist lawyers who can receive and pay for qualified appeal leads.</p>
	<div class="justice-crm-cards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0;">
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $active_specialists ); ?></strong>
			<span>Active routable specialists</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $open_prospects ); ?></strong>
			<span>Open Bituach Leumi prospects</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $verified_prospects ); ?></strong>
			<span>Verified prospect coverage</span>
			<small style="display:block;color:#646970;margin-top:4px;"><?php echo esc_html( sprintf( '%d still needed', $prospect_gap ) ); ?></small>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $coverage_gap ); ?></strong>
			<span>Specialists still needed</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;">₪1,490</strong>
			<span>Suggested Lead Partner target/mo</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $source_pack_progress['total'] ); ?></strong>
			<span>Source-pack candidates</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $source_pack_progress['created'] ); ?></strong>
			<span>Already in pipeline</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $source_pack_progress['remaining'] ); ?></strong>
			<span>Still to create privately</span>
		</div>
	</div>
	<p>
		<a class="button button-primary" href="<?php echo esc_url( $add_url ); ?>">Add Bituach Leumi prospect</a>
		<a class="button" href="<?php echo esc_url( $pipeline_url ); ?>">Open prospect pipeline</a>
		<a class="button" href="<?php echo esc_url( $needs_verification_url ); ?>">Needs verification</a>
		<a class="button" href="<?php echo esc_url( $ready_verification_url ); ?>">Ready for routing</a>
	</p>
	<p style="color:#646970;margin-top:-4px;">Private source shortlist for manual prospect creation: <code><?php echo esc_html( $source_pack_path ); ?></code></p>
	<?php if ( $coverage_gap > 0 ) : ?>
		<div class="notice notice-warning inline">
			<p><strong>Coverage gap:</strong> recruit <?php echo esc_html( (string) $coverage_gap ); ?> more specialist lawyer(s), then run one real test lead before treating the funnel as revenue-ready.</p>
		</div>
	<?php else : ?>
		<div class="notice notice-success inline">
			<p><strong>Coverage ready:</strong> enough specialist coverage exists for the first routing test. Run one real lead and confirm billing status.</p>
		</div>
	<?php endif; ?>
	<?php justice_theme_crm_render_btl_readiness_gate( $source_pack_progress, $verified_prospects, $active_specialists, $target, $billable_btl_leads, $paid_btl_leads ); ?>
	<?php justice_theme_crm_render_btl_activation_gap_board( $btl_needles, 'national-insurance', $target ); ?>
	<?php justice_theme_crm_render_btl_first_test_preflight( 'national-insurance', $target ); ?>
	<?php justice_theme_crm_render_btl_controlled_test_drill( $source_pack_progress, $verified_prospects, $active_specialists, $target, $billable_btl_leads, $paid_btl_leads ); ?>
	<?php justice_theme_crm_render_btl_intent_ownership_map(); ?>
	<?php justice_theme_crm_render_btl_candidate_tracker( $btl_needles ); ?>
	<?php justice_theme_crm_render_btl_next_source_actions( $source_pack_rows ); ?>
	<?php justice_theme_crm_render_btl_source_pack_candidates( $source_pack_rows ); ?>
	<?php justice_theme_crm_render_btl_outreach_pack(); ?>
	<?php
}

function justice_theme_crm_render_btl_activation_gap_board( array $needles, string $area_slug, int $target ): void {
	$active_lawyers = justice_theme_crm_query_active_routing_lawyers_for_area( $area_slug, 12 );
	$ready_prospects = array_values(
		array_filter(
			justice_theme_crm_query_prospects_for_area( $needles, 50 ),
			static function ( WP_Post $prospect ): bool {
				return function_exists( 'justice_theme_lawyer_prospect_is_verified_for_routing' )
					&& justice_theme_lawyer_prospect_is_verified_for_routing( (int) $prospect->ID );
			}
		)
	);
	$activation_gap = max( 0, $target - count( $active_lawyers ) );
	?>
	<div style="background:#fff;border:2px solid #7c3aed;border-radius:8px;padding:14px;margin:12px 0 20px;">
		<h3 style="margin-top:0;">Verified-to-routable activation gap</h3>
		<p style="margin-top:0;color:#646970;">Owner-only bridge from verified prospects to actually routable lawyer profiles. A prospect is not routable until a published lawyer profile has the right practice area, routing enabled and active/paid/trialing status.</p>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;">
			<div style="border:1px solid #dcdcde;border-radius:8px;padding:12px;background:#f8fafc;">
				<strong style="display:block;font-size:20px;"><?php echo esc_html( (string) count( $active_lawyers ) ); ?> / <?php echo esc_html( (string) $target ); ?></strong>
				<span>Published active routable lawyers</span>
				<?php if ( empty( $active_lawyers ) ) : ?>
					<div class="notice notice-warning inline" style="margin-top:10px;"><p>No active routable Bituach Leumi lawyer profile is available for real routing yet.</p></div>
				<?php else : ?>
					<ul style="margin:10px 0 0 18px;list-style:disc;">
						<?php foreach ( $active_lawyers as $lawyer ) : ?>
							<?php
							$lawyer_id = (int) $lawyer->ID;
							$status    = (string) get_post_meta( $lawyer_id, 'subscription_status', true );
							$cap       = (string) get_post_meta( $lawyer_id, 'monthly_lead_cap', true );
							$edit_url  = get_edit_post_link( $lawyer_id, '' );
							?>
							<li>
								<a href="<?php echo esc_url( $edit_url ); ?>"><?php echo esc_html( get_the_title( $lawyer_id ) ); ?></a>
								<br><small><?php echo esc_html( trim( 'subscription=' . ( $status ?: '-' ) . ' / cap=' . ( $cap ?: 'default' ) ) ); ?></small>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</div>
			<div style="border:1px solid #dcdcde;border-radius:8px;padding:12px;background:#fffaf0;">
				<strong style="display:block;font-size:20px;"><?php echo esc_html( (string) count( $ready_prospects ) ); ?></strong>
				<span>Verified prospects awaiting profile/routing activation review</span>
				<?php if ( empty( $ready_prospects ) ) : ?>
					<p style="margin:10px 0 0;color:#646970;">No verified prospects are ready to activate yet. Keep working the source pack and verification calls.</p>
				<?php else : ?>
					<ul style="margin:10px 0 0 18px;list-style:disc;">
						<?php foreach ( array_slice( $ready_prospects, 0, 6 ) as $prospect ) : ?>
							<?php
							$prospect_id = (int) $prospect->ID;
							$edit_url    = get_edit_post_link( $prospect_id, '' );
							$status      = (string) get_post_meta( $prospect_id, 'prospect_outreach_status', true );
							$fee         = absint( get_post_meta( $prospect_id, 'prospect_agreed_lead_fee_ils', true ) );
							?>
							<li>
								<a href="<?php echo esc_url( $edit_url ); ?>"><?php echo esc_html( get_the_title( $prospect_id ) ); ?></a>
								<br><small><?php echo esc_html( trim( 'status=' . ( $status ?: '-' ) . ' / fee=' . ( $fee ? number_format_i18n( $fee ) . ' NIS' : '-' ) ) ); ?></small>
							</li>
						<?php endforeach; ?>
					</ul>
				<?php endif; ?>
			</div>
		</div>
		<?php if ( $activation_gap > 0 ) : ?>
			<div class="notice notice-warning inline" style="margin-top:12px;">
				<p><strong>Activation gap:</strong> <?php echo esc_html( (string) $activation_gap ); ?> more published, paid/trialing, routing-enabled lawyer profile(s) are needed before the controlled lead test should run.</p>
			</div>
		<?php else : ?>
			<div class="notice notice-success inline" style="margin-top:12px;">
				<p><strong>Activation gate met:</strong> published routable coverage exists. Use one controlled lead and confirm invoice/payment proof before scaling.</p>
			</div>
		<?php endif; ?>
	</div>
	<?php
}

function justice_theme_crm_render_btl_first_test_preflight( string $area_slug, int $target ): void {
	$eligible_lawyers   = justice_theme_crm_query_active_routing_lawyers_for_area( $area_slug, 25 );
	$available_count    = count( $eligible_lawyers );
	$billing_blockers   = array();
	$preflight_rows     = array();
	$preflight_lines    = array(
		'Bituach Leumi first paid-lead routing preflight',
		sprintf( 'Eligible router coverage: %d/%d', $available_count, $target ),
		'',
		'Eligible lawyers:',
	);

	foreach ( $eligible_lawyers as $lawyer ) {
		$lawyer_id     = (int) $lawyer->ID;
		$cap           = function_exists( 'justice_theme_lawyer_monthly_lead_cap' ) ? justice_theme_lawyer_monthly_lead_cap( $lawyer_id, $area_slug ) : 0;
		$used          = function_exists( 'justice_theme_lawyer_monthly_routed_lead_count' ) ? justice_theme_lawyer_monthly_routed_lead_count( $lawyer_id, $area_slug ) : 0;
		$remaining     = max( 0, $cap - $used );
		$billing_email = (string) get_post_meta( $lawyer_id, 'billing_invoice_email', true );
		$contact_email = (string) get_post_meta( $lawyer_id, 'email', true );
		$billing_ready = $billing_email && is_email( $billing_email );
		$contact_ready = $billing_ready || ( $contact_email && is_email( $contact_email ) );
		$status        = (string) get_post_meta( $lawyer_id, 'subscription_status', true );
		$plan          = (string) get_post_meta( $lawyer_id, 'plan_type', true );
		$edit_url      = get_edit_post_link( $lawyer_id, '' );

		if ( ! $contact_ready ) {
			$billing_blockers[] = get_the_title( $lawyer_id ) ?: sprintf( 'Lawyer #%d', $lawyer_id );
		}

		$preflight_rows[] = array(
			'id'            => $lawyer_id,
			'title'         => get_the_title( $lawyer_id ) ?: sprintf( 'Lawyer #%d', $lawyer_id ),
			'edit_url'      => $edit_url,
			'status'        => $status ?: '-',
			'plan'          => $plan ?: '-',
			'cap'           => $cap,
			'used'          => $used,
			'remaining'     => $remaining,
			'billing_email' => $billing_email,
			'contact_email' => $contact_email,
			'billing_ready' => $contact_ready,
		);
		$preflight_lines[] = sprintf(
			'- #%d %s | plan=%s | subscription=%s | cap=%d used=%d remaining=%d | billing=%s',
			$lawyer_id,
			wp_strip_all_tags( get_the_title( $lawyer_id ) ?: sprintf( 'Lawyer #%d', $lawyer_id ) ),
			$plan ?: '-',
			$status ?: '-',
			$cap,
			$used,
			$remaining,
			$billing_email ?: ( $contact_email ?: 'missing' )
		);
	}

	if ( empty( $preflight_rows ) ) {
		$preflight_lines[] = '- No eligible lawyer currently matches the live router.';
	}

	$preflight_lines[] = '';
	$preflight_lines[] = 'Green-light rules before first paid lead:';
	$preflight_lines[] = '1. At least three eligible national-insurance lawyers are available through the live router.';
	$preflight_lines[] = '2. Each lawyer has remaining monthly lead capacity.';
	$preflight_lines[] = '3. Each lawyer has a billing/contact email before manual invoice follow-up.';
	$preflight_lines[] = '4. The first lead is consented, controlled and recorded in the qualified lead billing queue.';
	$preflight_lines[] = '5. Do not mark Paid without invoice/reference or payment evidence.';

	$copy_id    = 'justice-btl-first-test-preflight-copy';
	$gate_ready = $available_count >= $target && empty( $billing_blockers );
	?>
	<div style="background:#fff;border:2px solid #0f766e;border-radius:8px;padding:14px;margin:12px 0 20px;">
		<h3 style="margin-top:0;">First paid-lead routing preflight</h3>
		<p style="margin-top:0;color:#646970;">Owner-only check against the same live routing constraints used by the lead router: published profile, routing enabled, paid/trialing/active status and available lead capacity.</p>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:12px 0;">
			<div style="border:1px solid #dcdcde;border-radius:8px;padding:10px;<?php echo esc_attr( $available_count >= $target ? 'background:#f0fff4;border-color:#008a20;' : 'background:#fff7f7;border-color:#d63638;' ); ?>">
				<strong><?php echo esc_html( sprintf( '%d / %d', $available_count, $target ) ); ?></strong>
				<br><span>Router-eligible lawyers with capacity</span>
			</div>
			<div style="border:1px solid #dcdcde;border-radius:8px;padding:10px;<?php echo esc_attr( empty( $billing_blockers ) ? 'background:#f0fff4;border-color:#008a20;' : 'background:#fffaf0;border-color:#dba617;' ); ?>">
				<strong><?php echo esc_html( empty( $billing_blockers ) ? 'Ready' : 'Needs contact' ); ?></strong>
				<br><span>Billing/contact email coverage</span>
			</div>
			<div style="border:1px solid #dcdcde;border-radius:8px;padding:10px;<?php echo esc_attr( $gate_ready ? 'background:#f0fff4;border-color:#008a20;' : 'background:#fff7f7;border-color:#d63638;' ); ?>">
				<strong><?php echo esc_html( $gate_ready ? 'Green light' : 'Do not run yet' ); ?></strong>
				<br><span>First paid-lead test gate</span>
			</div>
		</div>
		<?php if ( $preflight_rows ) : ?>
			<table class="widefat striped" style="margin:10px 0;">
				<thead>
					<tr>
						<th>Lawyer</th>
						<th>Plan / status</th>
						<th>Monthly capacity</th>
						<th>Billing/contact</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $preflight_rows as $row ) : ?>
						<tr>
							<td><a href="<?php echo esc_url( (string) $row['edit_url'] ); ?>"><?php echo esc_html( (string) $row['title'] ); ?></a></td>
							<td><?php echo esc_html( trim( (string) $row['plan'] . ' / ' . (string) $row['status'] ) ); ?></td>
							<td><?php echo esc_html( sprintf( 'cap %d / used %d / remaining %d', (int) $row['cap'], (int) $row['used'], (int) $row['remaining'] ) ); ?></td>
							<td>
								<?php if ( $row['billing_ready'] ) : ?>
									<strong style="color:#008a20;">Available</strong><br>
									<small><?php echo esc_html( (string) ( $row['billing_email'] ?: $row['contact_email'] ) ); ?></small>
								<?php else : ?>
									<strong style="color:#d63638;">Missing</strong>
								<?php endif; ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>
		<?php if ( ! $gate_ready ) : ?>
			<div class="notice notice-warning inline">
				<p><strong>Hold the first paid lead test.</strong> Fix coverage, capacity or billing/contact details before submitting a controlled lead.</p>
			</div>
		<?php else : ?>
			<div class="notice notice-success inline">
				<p><strong>Preflight is green.</strong> Run one controlled lead only, then use the qualified lead billing queue and payment-proof gate before scaling.</p>
			</div>
		<?php endif; ?>
		<label for="<?php echo esc_attr( $copy_id ); ?>"><strong>Copyable preflight note</strong></label>
		<textarea id="<?php echo esc_attr( $copy_id ); ?>" rows="9" readonly style="width:100%;margin-top:6px;"><?php echo esc_textarea( implode( "\n", $preflight_lines ) ); ?></textarea>
		<p style="margin:6px 0 0;">
			<button type="button" class="button" data-justice-copy-target="<?php echo esc_attr( $copy_id ); ?>">Copy preflight</button>
		</p>
	</div>
	<?php
}

function justice_theme_crm_render_btl_readiness_gate( array $source_pack_progress, int $verified_prospects, int $active_specialists, int $target, int $billable_leads, int $paid_leads ): void {
	$snapshot = justice_theme_crm_btl_readiness_snapshot_from_counts( $source_pack_progress, $verified_prospects, $active_specialists, $target, $billable_leads, $paid_leads );
	$checks   = $snapshot['checks'];
	$percent  = $snapshot['percent'];
	$status   = $snapshot['status'];
	$style    = $snapshot['style'];
	?>
	<div style="border:2px solid #d63638;border-radius:8px;padding:14px;margin:12px 0 20px;<?php echo esc_attr( $style ); ?>">
		<h3 style="margin-top:0;">Bituach Leumi revenue-readiness gate</h3>
		<p style="margin-top:0;"><strong><?php echo esc_html( $status ); ?></strong> · <?php echo esc_html( (string) $percent ); ?>% complete</p>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;">
			<?php foreach ( $checks as $check ) : ?>
				<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:10px;">
					<strong style="color:<?php echo esc_attr( $check['met'] ? '#008a20' : '#b32d2e' ); ?>;"><?php echo $check['met'] ? 'Ready' : 'Blocked'; ?></strong>
					<br><span><?php echo esc_html( $check['label'] ); ?></span>
					<br><small style="color:#646970;"><?php echo esc_html( $check['detail'] ); ?></small>
				</div>
			<?php endforeach; ?>
		</div>
		<p style="margin-bottom:0;color:#646970;">Owner-only gate: do not treat this funnel as revenue-ready until verified supply and at least one controlled billable lead test are recorded.</p>
	</div>
	<?php
}

function justice_theme_crm_render_btl_controlled_test_drill( array $source_pack_progress, int $verified_prospects, int $active_specialists, int $target, int $billable_leads, int $paid_leads ): void {
	$snapshot       = justice_theme_crm_btl_readiness_snapshot_from_counts( $source_pack_progress, $verified_prospects, $active_specialists, $target, $billable_leads, $paid_leads );
	$can_start_test = $verified_prospects >= $target && $active_specialists >= $target;
	$test_url       = add_query_arg(
		array(
			'utm_source'   => 'owner_controlled_test',
			'utm_medium'   => 'justice_crm',
			'utm_campaign' => 'btl_first_billable_test',
		),
		home_url( '/national-insurance-attorney/' )
	);
	$lead_queue_url = admin_url( 'edit.php?post_type=justice_lead' );
	$ready_url      = add_query_arg( 'justice_prospect_verification_filter', 'ready', admin_url( 'edit.php?post_type=justice_prospect' ) );
	$needs_url      = add_query_arg( 'justice_prospect_verification_filter', 'needs', admin_url( 'edit.php?post_type=justice_prospect' ) );
	$drill_id       = 'justice-btl-controlled-test-drill-copy';
	$drill_steps    = justice_theme_crm_btl_controlled_test_drill_copy( $snapshot, $active_specialists, $verified_prospects, $billable_leads, $paid_leads, $test_url );
	$blocked_style  = 'background:#fff7f7;border-color:#d63638;';
	$ready_style    = 'background:#f0fff4;border-color:#008a20;';
	$waiting_style  = 'background:#fffaf0;border-color:#dba617;';
	$supply_style   = $can_start_test ? $ready_style : $blocked_style;
	$billing_style  = $billable_leads > 0 ? $ready_style : ( $can_start_test ? $waiting_style : $blocked_style );
	$payment_style  = $paid_leads > 0 ? $ready_style : $waiting_style;
	?>
	<div id="justice-btl-controlled-test-drill" style="background:#fff;border:2px solid #2271b1;border-radius:8px;padding:14px;margin:12px 0 20px;">
		<h3 style="margin-top:0;">Controlled first billable lead drill</h3>
		<p style="margin-top:0;color:#646970;">Owner-only runbook for proving the Bituach Leumi funnel with one controlled lead. Do not run it until supply is verified and routable.</p>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin:12px 0;">
			<div style="border:1px solid #dcdcde;border-radius:8px;padding:10px;<?php echo esc_attr( $supply_style ); ?>">
				<strong><?php echo esc_html( $can_start_test ? 'Ready' : 'Blocked' ); ?></strong>
				<br><span>Specialist supply gate</span>
				<br><small><?php echo esc_html( sprintf( '%d/%d verified prospects, %d/%d active routable specialists', $verified_prospects, $target, $active_specialists, $target ) ); ?></small>
			</div>
			<div style="border:1px solid #dcdcde;border-radius:8px;padding:10px;<?php echo esc_attr( $can_start_test ? $waiting_style : $blocked_style ); ?>">
				<strong><?php echo esc_html( $can_start_test ? 'Ready to test' : 'Wait' ); ?></strong>
				<br><span>Controlled intake path</span>
				<br><small><?php echo esc_html( $can_start_test ? 'Use the tagged public route for a consented controlled lead.' : 'Finish supply verification before submitting a test lead.' ); ?></small>
			</div>
			<div style="border:1px solid #dcdcde;border-radius:8px;padding:10px;<?php echo esc_attr( $billing_style ); ?>">
				<strong><?php echo esc_html( $billable_leads > 0 ? 'Recorded' : 'Waiting' ); ?></strong>
				<br><span>Billing queue proof</span>
				<br><small><?php echo esc_html( sprintf( '%d ready/invoiced/paid Bituach Leumi lead(s)', $billable_leads ) ); ?></small>
			</div>
			<div style="border:1px solid #dcdcde;border-radius:8px;padding:10px;<?php echo esc_attr( $payment_style ); ?>">
				<strong><?php echo esc_html( $paid_leads > 0 ? 'Proven' : 'Not proven' ); ?></strong>
				<br><span>Manual payment proof</span>
				<br><small><?php echo esc_html( sprintf( '%d paid Bituach Leumi lead(s)', $paid_leads ) ); ?></small>
			</div>
		</div>
		<p style="display:flex;gap:6px;flex-wrap:wrap;margin:0 0 10px;">
			<a class="button button-primary" href="<?php echo esc_url( $test_url ); ?>" target="_blank" rel="noopener">Open controlled intake route</a>
			<a class="button" href="<?php echo esc_url( $lead_queue_url ); ?>">Open lead CRM</a>
			<a class="button" href="<?php echo esc_url( $ready_url ); ?>">Ready prospects</a>
			<a class="button" href="<?php echo esc_url( $needs_url ); ?>">Needs verification</a>
		</p>
		<?php if ( ! $can_start_test ) : ?>
			<div class="notice notice-warning inline">
				<p><strong>Do not test routing yet.</strong> Create and verify the first three specialist prospects, then activate routable paid coverage before sending a real lead through the funnel.</p>
			</div>
		<?php elseif ( 0 === $billable_leads ) : ?>
			<div class="notice notice-info inline">
				<p><strong>Supply is ready for a controlled test.</strong> Use a consented test lead, then verify the lead records <code>lead_revenue_model</code>, <code>qualified_lead_billing_status</code>, <code>suggested_lead_price_ils</code> and billable lawyer IDs.</p>
			</div>
		<?php elseif ( 0 === $paid_leads ) : ?>
			<div class="notice notice-warning inline">
				<p><strong>Billing proof exists, payment proof does not.</strong> Send the manual invoice/payment link, then mark the lead paid only after evidence exists.</p>
			</div>
		<?php else : ?>
			<div class="notice notice-success inline">
				<p><strong>Revenue loop has proof.</strong> Keep the invoice reference and lead notes attached before scaling this funnel.</p>
			</div>
		<?php endif; ?>
		<label for="<?php echo esc_attr( $drill_id ); ?>"><strong>Copyable controlled-test checklist</strong></label>
		<textarea id="<?php echo esc_attr( $drill_id ); ?>" rows="10" readonly style="width:100%;margin-top:6px;"><?php echo esc_textarea( $drill_steps ); ?></textarea>
		<p style="margin:6px 0 0;">
			<button type="button" class="button" data-justice-copy-target="<?php echo esc_attr( $drill_id ); ?>">Copy test drill</button>
		</p>
	</div>
	<?php
}

function justice_theme_crm_btl_controlled_test_drill_copy( array $snapshot, int $active_specialists, int $verified_prospects, int $billable_leads, int $paid_leads, string $test_url ): string {
	$lines = array(
		'Bituach Leumi controlled first billable lead drill',
		sprintf( 'Current readiness: %s (%d%% complete)', (string) ( $snapshot['status'] ?? 'Unknown' ), (int) ( $snapshot['percent'] ?? 0 ) ),
		sprintf( 'Supply: %d active routable specialists, %d verified prospects', $active_specialists, $verified_prospects ),
		sprintf( 'Billing proof: %d ready/invoiced/paid lead(s), %d paid lead(s)', $billable_leads, $paid_leads ),
		'',
		'Before test:',
		'1. Confirm 3 verified specialists and 3 active routable specialists for national-insurance.',
		'2. Confirm each routed specialist accepted manual invoice/payment handling, an agreed per-lead fee and a billing contact email.',
		'3. Confirm no public page promises outcome, ranking, lead volume or compensation.',
		'',
		'Controlled intake:',
		'4. Open: ' . esc_url_raw( $test_url ),
		'5. Submit only a consented real lead or owner-controlled test lead with valid phone/email.',
		'6. Include decision date, committee/protocol status, document status and appeal-window urgency.',
		'',
		'Proof in CRM:',
		'7. Lead area must be national-insurance.',
		'8. lead_revenue_model must be qualified_appeal_lead.',
		'9. qualified_lead_billing_status must become ready_to_bill after routing.',
		'10. suggested_lead_price_ils should be 249 unless owner changes the commercial test.',
		'11. qualified_lead_billable_lawyer_ids must contain the routed lawyer IDs.',
		'12. Send manual invoice/payment request, then mark invoice_sent/paid only with evidence.',
		'',
		'Abort if:',
		'- No verified/routable specialist coverage exists.',
		'- The lead is not consented or is not a real controlled test.',
		'- Any lawyer asks for outcome promises, exclusivity promises or guaranteed lead volume.',
		'- Payment evidence is missing.',
	);

	return implode( "\n", $lines );
}

function justice_theme_crm_render_btl_intent_ownership_map(): void {
	$rows    = justice_theme_crm_btl_intent_map_rows();
	$copy_id = 'justice-btl-intent-map-copy';
	?>
	<div id="justice-btl-intent-ownership-map" style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;margin:12px 0 20px;">
		<h3 style="margin-top:0;">Bituach Leumi intent ownership map</h3>
		<p style="margin-top:0;color:#646970;">Owner-only anti-cannibalization map for the active funnel. Use this before adding, expanding or briefing any Bituach Leumi content.</p>
		<table class="widefat striped">
			<thead>
				<tr>
					<th>Surface</th>
					<th>Owns intent</th>
					<th>Allowed work</th>
					<th>Do not do</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( $rows as $row ) : ?>
					<tr>
						<td>
							<strong><?php echo esc_html( $row['label'] ); ?></strong>
							<br><a href="<?php echo esc_url( $row['url'] ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $row['path'] ); ?></a>
						</td>
						<td><?php echo esc_html( $row['intent'] ); ?></td>
						<td><?php echo esc_html( $row['allowed'] ); ?></td>
						<td><?php echo esc_html( $row['blocked'] ); ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
		<div class="notice notice-warning inline" style="margin-top:12px;">
			<p><strong>Boundary:</strong> do not create another public Bituach Leumi page, redirect old URLs, change canonical/noindex/sitemap settings or merge calculator intent until GSC/source evidence is reviewed.</p>
		</div>
		<label for="<?php echo esc_attr( $copy_id ); ?>"><strong>Copyable publication/cannibalization note</strong></label>
		<textarea id="<?php echo esc_attr( $copy_id ); ?>" rows="8" readonly style="width:100%;margin-top:6px;"><?php echo esc_textarea( justice_theme_crm_btl_intent_map_copy( $rows ) ); ?></textarea>
		<p style="margin:6px 0 0;">
			<button type="button" class="button" data-justice-copy-target="<?php echo esc_attr( $copy_id ); ?>">Copy intent map</button>
		</p>
	</div>
	<?php
}

function justice_theme_crm_btl_intent_map_rows(): array {
	return array(
		array(
			'label'   => 'Appeal guide / tool route',
			'path'    => '/bituach-leumi-appeal-guide/',
			'url'     => home_url( '/bituach-leumi-appeal-guide/' ),
			'intent'  => 'Appeal decision, medical committee, documents, urgency and calculator-assisted intake.',
			'allowed' => 'Improve visitor guidance, FAQ, form clarity, source citations and links to lawyer directory.',
			'blocked' => 'Do not broaden into every Bituach Leumi benefit or duplicate old calculator intent.',
		),
		array(
			'label'   => 'Service-intent lawyer route',
			'path'    => '/national-insurance-attorney/',
			'url'     => home_url( '/national-insurance-attorney/' ),
			'intent'  => 'Find a Bituach Leumi lawyer for appeal-stage help and urgent routing.',
			'allowed' => 'Keep focused on choosing counsel, lead qualification and directory handoff.',
			'blocked' => 'Do not expose revenue logic or turn into a general encyclopedia article.',
		),
		array(
			'label'   => 'Lawyer directory filter',
			'path'    => '/lawyers/?area=national-insurance',
			'url'     => home_url( '/lawyers/?area=national-insurance' ),
			'intent'  => 'Browse available lawyers/professionals for national-insurance matters.',
			'allowed' => 'Improve verified supply once real specialists are approved.',
			'blocked' => 'Do not publish unverified profiles or route leads before readiness gates pass.',
		),
		array(
			'label'   => 'Old calculator URL family',
			'path'    => '/national-insurance-calculator/ and Hebrew aliases',
			'url'     => home_url( '/national-insurance-calculator/' ),
			'intent'  => 'Legacy calculator and broad payment-estimation demand.',
			'allowed' => 'Audit with GSC/source evidence before any merge or rewrite.',
			'blocked' => 'Do not redirect, canonicalize, noindex, expand or merge from this cycle.',
		),
	);
}

function justice_theme_crm_btl_intent_map_copy( array $rows ): string {
	$lines = array(
		'Bituach Leumi anti-cannibalization note',
		'Use this before publishing or updating any related page.',
		'',
	);

	foreach ( $rows as $row ) {
		$lines[] = sprintf( '%s - %s', (string) $row['path'], (string) $row['intent'] );
		$lines[] = sprintf( 'Allowed: %s', (string) $row['allowed'] );
		$lines[] = sprintf( 'Do not: %s', (string) $row['blocked'] );
		$lines[] = '';
	}

	$lines[] = 'No new public Bituach Leumi route, redirect, canonical/noindex, sitemap change or calculator merge without owner approval and GSC/source evidence.';

	return implode( "\n", $lines );
}

function justice_theme_crm_btl_readiness_snapshot(): array {
	$target               = 3;
	$needles              = array( 'national-insurance', 'ביטוח לאומי', 'ערעור ביטוח לאומי', 'ועדה רפואית' );
	$source_pack_rows     = justice_theme_crm_read_btl_source_pack( 100 );
	$source_pack_progress = justice_theme_crm_btl_source_pack_progress( $source_pack_rows );
	$verified_prospects   = justice_theme_crm_count_verified_prospects_for_area( $needles );
	$active_specialists   = justice_theme_crm_count_active_routing_lawyers_for_area( 'national-insurance' );
	$billable_leads       = justice_theme_crm_count_btl_billable_leads( $needles, array( 'ready_to_bill', 'invoice_sent', 'paid' ) );
	$paid_leads           = justice_theme_crm_count_btl_billable_leads( $needles, array( 'paid' ) );

	return justice_theme_crm_btl_readiness_snapshot_from_counts( $source_pack_progress, $verified_prospects, $active_specialists, $target, $billable_leads, $paid_leads );
}

function justice_theme_crm_btl_readiness_snapshot_from_counts( array $source_pack_progress, int $verified_prospects, int $active_specialists, int $target, int $billable_leads, int $paid_leads ): array {
	$checks = array(
		array(
			'label' => 'Source pack loaded',
			'met'   => (int) ( $source_pack_progress['total'] ?? 0 ) >= $target,
			'detail' => sprintf( '%d candidates loaded', (int) ( $source_pack_progress['total'] ?? 0 ) ),
		),
		array(
			'label' => 'Private prospects created',
			'met'   => (int) ( $source_pack_progress['created'] ?? 0 ) >= $target,
			'detail' => sprintf( '%d/%d created from source pack', (int) ( $source_pack_progress['created'] ?? 0 ), $target ),
		),
		array(
			'label' => 'Prospects verified for routing',
			'met'   => $verified_prospects >= $target,
			'detail' => sprintf( '%d/%d verified', $verified_prospects, $target ),
		),
		array(
			'label' => 'Active routable specialists',
			'met'   => $active_specialists >= $target,
			'detail' => sprintf( '%d/%d active', $active_specialists, $target ),
		),
		array(
			'label' => 'First billable Bituach Leumi test lead',
			'met'   => $billable_leads > 0,
			'detail' => sprintf( '%d recorded as ready/invoiced/paid', $billable_leads ),
		),
		array(
			'label' => 'Payment loop proven',
			'met'   => $paid_leads > 0,
			'detail' => sprintf( '%d paid Bituach Leumi lead(s)', $paid_leads ),
		),
	);
	$met_count = 0;
	foreach ( $checks as $check ) {
		if ( ! empty( $check['met'] ) ) {
			$met_count++;
		}
	}
	$total   = count( $checks );
	$percent = (int) round( ( $met_count / max( 1, $total ) ) * 100 );
	$status  = 'Not ready for paid lead routing';
	$style   = 'border-color:#d63638;background:#fff7f7;';

	if ( $met_count >= 4 && 0 === $paid_leads ) {
		$status = 'Ready for first controlled paid-lead test';
		$style  = 'border-color:#dba617;background:#fffaf0;';
	}

	if ( $paid_leads > 0 && $met_count === $total ) {
		$status = 'Revenue loop proven';
		$style  = 'border-color:#008a20;background:#f0fff4;';
	}

	return array(
		'status'    => $status,
		'style'     => $style,
		'percent'   => $percent,
		'met_count' => $met_count,
		'total'     => $total,
		'checks'    => $checks,
	);
}

function justice_theme_crm_render_btl_candidate_tracker( array $needles ): void {
	$prospects = justice_theme_crm_query_prospects_for_area( $needles, 12 );
	?>
	<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;margin:12px 0 20px;">
		<h3 style="margin-top:0;">First 3 specialist tracker</h3>
		<p style="margin-top:0;color:#646970;">Private supply tracker for the Bituach Leumi funnel. Do not route leads until a prospect shows as ready.</p>
		<?php if ( empty( $prospects ) ) : ?>
			<div class="notice notice-warning inline">
				<p><strong>No matching prospects yet.</strong> Use the Add Bituach Leumi prospect button above, then verify license/status, niche experience, response speed and manual-payment acceptance.</p>
			</div>
		<?php else : ?>
			<table class="widefat striped">
				<thead>
					<tr>
						<th>Prospect</th>
						<th>Contact</th>
						<th>Status</th>
						<th>Verification</th>
						<th>Next action</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $prospects as $prospect ) : ?>
						<?php
						$post_id       = (int) $prospect->ID;
						$firm          = (string) get_post_meta( $post_id, 'prospect_firm_name', true );
						$email         = (string) get_post_meta( $post_id, 'prospect_contact_email', true );
						$phone         = (string) get_post_meta( $post_id, 'prospect_contact_phone', true );
						$status        = (string) get_post_meta( $post_id, 'prospect_outreach_status', true );
						$next_action   = (string) get_post_meta( $post_id, 'prospect_next_action_at', true );
						$missing       = function_exists( 'justice_theme_lawyer_prospect_verification_missing' ) ? justice_theme_lawyer_prospect_verification_missing( $post_id ) : array( 'verification helper missing' );
						$status_label  = function_exists( 'justice_theme_lawyer_prospect_statuses' ) ? ( justice_theme_lawyer_prospect_statuses()[ $status ] ?? $status ) : $status;
						$edit_url      = get_edit_post_link( $post_id, '' );
						?>
						<tr>
							<td>
								<strong><a href="<?php echo esc_url( $edit_url ); ?>"><?php echo esc_html( get_the_title( $post_id ) ); ?></a></strong>
								<?php if ( $firm ) : ?>
									<br><small><?php echo esc_html( $firm ); ?></small>
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $email ) : ?>
									<a href="<?php echo esc_url( 'mailto:' . $email ); ?>"><?php echo esc_html( $email ); ?></a>
								<?php endif; ?>
								<?php if ( $email && $phone ) : ?>
									<br>
								<?php endif; ?>
								<?php if ( $phone ) : ?>
									<a href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>
								<?php endif; ?>
								<?php if ( ! $email && ! $phone ) : ?>
									<strong style="color:#b32d2e;">Missing contact</strong>
								<?php endif; ?>
							</td>
							<td><?php echo esc_html( $status_label ?: '-' ); ?></td>
							<td>
								<?php if ( empty( $missing ) ) : ?>
									<strong style="color:#008a20;">Ready for routing</strong>
								<?php else : ?>
									<strong style="color:#b32d2e;">Missing:</strong>
									<br><?php echo esc_html( implode( ', ', $missing ) ); ?>
								<?php endif; ?>
							</td>
							<td>
								<?php echo esc_html( $next_action ?: 'No date set' ); ?>
								<br><a class="button button-small" style="margin-top:6px;" href="<?php echo esc_url( $edit_url ); ?>">Open prospect</a>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php endif; ?>
	</div>
	<?php
}

function justice_theme_crm_render_btl_next_source_actions( array $rows ): void {
	$existing_sources = justice_theme_crm_btl_existing_prospect_sources();
	$next_candidates  = justice_theme_crm_btl_next_source_candidates( $rows, $existing_sources, 3 );
	$call_sheet_id    = 'justice-btl-next-call-sheet';
	?>
	<div style="background:#fff;border:2px solid #2271b1;border-radius:8px;padding:14px;margin:12px 0 20px;">
		<h3 style="margin-top:0;">Next 3 source-pack conversions</h3>
		<p style="margin-top:0;color:#646970;">Private action queue for turning sourced Bituach Leumi specialists into verified CRM prospects. These cards do not create records, send outreach or publish profiles.</p>
		<?php if ( empty( $next_candidates ) ) : ?>
			<div class="notice notice-success inline"><p>All loaded source-pack candidates already have matching private prospect source URLs. Continue verification in the prospect pipeline.</p></div>
		<?php else : ?>
			<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">
				<?php foreach ( $next_candidates as $row ) : ?>
					<?php $brief_id = 'justice-btl-next-brief-' . substr( md5( (string) ( $row['source_url'] ?? '' ) ), 0, 10 ); ?>
					<div style="border:1px solid #dcdcde;border-radius:8px;padding:12px;background:#f6f7f7;">
						<strong style="display:block;font-size:16px;"><?php echo esc_html( $row['candidate'] ?? '' ); ?></strong>
						<small style="display:block;color:#646970;margin-top:2px;"><?php echo esc_html( trim( (string) ( $row['priority'] ?? '' ) . ' / ' . (string) ( $row['geo_hint'] ?? '' ), ' /' ) ); ?></small>
						<p style="margin:8px 0;"><strong>Focus:</strong> <?php echo esc_html( $row['apparent_focus'] ?? '' ); ?></p>
						<p style="margin:8px 0;"><strong>Evidence:</strong> <?php echo esc_html( $row['source_evidence_summary'] ?? '' ); ?></p>
						<ol style="margin:8px 0 12px 20px;">
							<li>Create the private prospect draft.</li>
							<li>Open and verify the public source.</li>
							<li>Check license/status, niche fit, response time and manual-payment acceptance.</li>
							<li>Set next action date before any routing.</li>
						</ol>
						<p style="display:flex;gap:6px;flex-wrap:wrap;margin:0 0 8px;">
							<a class="button button-primary" href="<?php echo esc_url( justice_theme_crm_btl_source_candidate_prefill_url( $row ) ); ?>">Create private prospect</a>
							<?php if ( ! empty( $row['source_url'] ) ) : ?>
								<a class="button" href="<?php echo esc_url( $row['source_url'] ); ?>" target="_blank" rel="noopener">Open source</a>
							<?php endif; ?>
						</p>
						<details>
							<summary style="cursor:pointer;">Copy verification brief</summary>
							<textarea id="<?php echo esc_attr( $brief_id ); ?>" rows="7" readonly style="width:100%;margin-top:6px;"><?php echo esc_textarea( justice_theme_crm_btl_source_candidate_verification_brief( $row ) ); ?></textarea>
							<p style="margin:6px 0 0;">
								<button type="button" class="button button-small" data-justice-copy-target="<?php echo esc_attr( $brief_id ); ?>">Copy brief</button>
							</p>
						</details>
					</div>
				<?php endforeach; ?>
			</div>
			<div style="margin-top:14px;border-top:1px solid #dcdcde;padding-top:12px;">
				<label for="<?php echo esc_attr( $call_sheet_id ); ?>"><strong>Manual verification call sheet</strong></label>
				<p style="margin:4px 0 6px;color:#646970;">Copy this into a spreadsheet or working note before contacting anyone. It is private owner material and does not create records or send outreach.</p>
				<textarea id="<?php echo esc_attr( $call_sheet_id ); ?>" rows="8" readonly style="width:100%;"><?php echo esc_textarea( justice_theme_crm_btl_source_candidate_call_sheet( $next_candidates ) ); ?></textarea>
				<p style="margin:6px 0 0;">
					<button type="button" class="button" data-justice-copy-target="<?php echo esc_attr( $call_sheet_id ); ?>">Copy call sheet</button>
				</p>
			</div>
		<?php endif; ?>
	</div>
	<?php
}

function justice_theme_crm_render_btl_source_pack_candidates( ?array $rows = null ): void {
	$rows             = null === $rows ? justice_theme_crm_read_btl_source_pack( 100 ) : $rows;
	$display_rows     = array_slice( $rows, 0, 10 );
	$existing_sources = justice_theme_crm_btl_existing_prospect_sources();
	?>
	<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;margin:12px 0 20px;">
		<h3 style="margin-top:0;">Source-pack candidates</h3>
		<p style="margin-top:0;color:#646970;">Private candidate list from the repo source pack. Buttons prefill a private prospect draft; they do not create a record until the owner saves it. Rows marked as already in pipeline have a matching private prospect source URL.</p>
		<?php if ( empty( $rows ) ) : ?>
			<div class="notice notice-info inline"><p>No source-pack candidates loaded from the repo CSV.</p></div>
		<?php else : ?>
			<table class="widefat striped">
				<thead>
					<tr>
						<th>Candidate</th>
						<th>Focus</th>
						<th>Priority</th>
						<th>Evidence</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $display_rows as $row ) : ?>
						<?php
						$source_key   = justice_theme_crm_normalize_source_url( (string) ( $row['source_url'] ?? '' ) );
						$existing_ids = $source_key && ! empty( $existing_sources[ $source_key ] ) ? $existing_sources[ $source_key ] : array();
						$existing_id  = $existing_ids ? (int) $existing_ids[0] : 0;
						$brief_id     = 'justice-btl-source-brief-' . substr( md5( (string) ( $row['source_url'] ?? '' ) ), 0, 10 );
						?>
						<tr>
							<td>
								<strong><?php echo esc_html( $row['candidate'] ?? '' ); ?></strong>
								<?php if ( ! empty( $row['geo_hint'] ) ) : ?>
									<br><small><?php echo esc_html( $row['geo_hint'] ); ?></small>
								<?php endif; ?>
								<?php if ( ! empty( $row['source_url'] ) ) : ?>
									<br><a href="<?php echo esc_url( $row['source_url'] ); ?>" target="_blank" rel="noopener">Open source</a>
								<?php endif; ?>
							</td>
							<td><?php echo esc_html( $row['apparent_focus'] ?? '' ); ?></td>
							<td><?php echo esc_html( $row['priority'] ?? '' ); ?></td>
							<td><?php echo esc_html( $row['source_evidence_summary'] ?? '' ); ?></td>
							<td>
								<?php if ( $existing_id ) : ?>
									<strong style="color:#008a20;">Already in pipeline</strong>
									<br><a class="button button-small" style="margin-top:6px;" href="<?php echo esc_url( get_edit_post_link( $existing_id, '' ) ); ?>">Open private prospect</a>
								<?php else : ?>
									<a class="button button-small" href="<?php echo esc_url( justice_theme_crm_btl_source_candidate_prefill_url( $row ) ); ?>">Add private prospect</a>
								<?php endif; ?>
								<br><small><?php echo esc_html( $row['verification_status'] ?? 'not_verified' ); ?></small>
								<details style="margin-top:8px;">
									<summary style="cursor:pointer;">Verification brief</summary>
									<textarea id="<?php echo esc_attr( $brief_id ); ?>" rows="7" readonly style="width:100%;margin-top:6px;"><?php echo esc_textarea( justice_theme_crm_btl_source_candidate_verification_brief( $row ) ); ?></textarea>
									<p style="margin:6px 0 0;">
										<button type="button" class="button button-small" data-justice-copy-target="<?php echo esc_attr( $brief_id ); ?>">Copy brief</button>
									</p>
								</details>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
			<?php if ( count( $rows ) > count( $display_rows ) ) : ?>
				<p style="color:#646970;margin-bottom:0;">Showing the first <?php echo esc_html( (string) count( $display_rows ) ); ?> of <?php echo esc_html( (string) count( $rows ) ); ?> source-pack candidates, sorted by priority.</p>
			<?php endif; ?>
		<?php endif; ?>
	</div>
	<?php
}

function justice_theme_crm_normalize_source_url( string $url ): string {
	$url = esc_url_raw( trim( $url ) );
	if ( '' === $url ) {
		return '';
	}

	return strtolower( untrailingslashit( $url ) );
}

function justice_theme_crm_btl_existing_prospect_sources(): array {
	$query = justice_theme_crm_query_lawyer_prospects( 500 );
	if ( ! $query || empty( $query->posts ) ) {
		return array();
	}

	$sources = array();
	foreach ( $query->posts as $post ) {
		$post_id    = (int) $post->ID;
		$source_key = justice_theme_crm_normalize_source_url( (string) get_post_meta( $post_id, 'prospect_source_url', true ) );
		if ( '' === $source_key ) {
			continue;
		}

		if ( ! isset( $sources[ $source_key ] ) ) {
			$sources[ $source_key ] = array();
		}

		$sources[ $source_key ][] = $post_id;
	}

	return $sources;
}

function justice_theme_crm_btl_source_candidate_call_sheet( array $rows ): string {
	$headers = array(
		'candidate',
		'priority',
		'source_url',
		'focus',
		'evidence',
		'crm_action',
		'missing_before_routing',
		'next_action_date',
		'boundary',
	);
	$lines   = array( implode( "\t", $headers ) );
	$next    = wp_date( 'Y-m-d', current_time( 'timestamp' ) + DAY_IN_SECONDS );

	foreach ( $rows as $row ) {
		$lines[] = implode(
			"\t",
			array(
				justice_theme_crm_tsv_cell( (string) ( $row['candidate'] ?? '' ) ),
				justice_theme_crm_tsv_cell( (string) ( $row['priority'] ?? '' ) ),
				justice_theme_crm_tsv_cell( (string) ( $row['source_url'] ?? '' ) ),
				justice_theme_crm_tsv_cell( (string) ( $row['apparent_focus'] ?? '' ) ),
				justice_theme_crm_tsv_cell( (string) ( $row['source_evidence_summary'] ?? '' ) ),
				justice_theme_crm_tsv_cell( (string) ( $row['crm_action'] ?? '' ) ),
				justice_theme_crm_tsv_cell( (string) ( $row['missing_before_routing'] ?? 'license; active status; response SLA; payment path' ) ),
				justice_theme_crm_tsv_cell( $next ),
				justice_theme_crm_tsv_cell( 'Manual verification only. Do not publish a profile, send outreach from the site, promise outcomes, or route leads until verified.' ),
			)
		);
	}

	return implode( "\n", $lines );
}

function justice_theme_crm_tsv_cell( string $value ): string {
	return trim( preg_replace( '/[\r\n\t]+/', ' ', $value ) ?? '' );
}

function justice_theme_crm_btl_next_source_candidates( array $rows, array $existing_sources, int $limit = 3 ): array {
	$next = array();

	foreach ( $rows as $row ) {
		$source_key = justice_theme_crm_normalize_source_url( (string) ( $row['source_url'] ?? '' ) );
		if ( '' === $source_key || ! empty( $existing_sources[ $source_key ] ) ) {
			continue;
		}

		$next[] = $row;
		if ( count( $next ) >= $limit ) {
			break;
		}
	}

	return $next;
}

function justice_theme_crm_btl_source_pack_progress( array $rows ): array {
	$existing_sources = justice_theme_crm_btl_existing_prospect_sources();
	$created          = 0;

	foreach ( $rows as $row ) {
		$source_key = justice_theme_crm_normalize_source_url( (string) ( $row['source_url'] ?? '' ) );
		if ( $source_key && ! empty( $existing_sources[ $source_key ] ) ) {
			$created++;
		}
	}

	$total = count( $rows );
	return array(
		'total'     => $total,
		'created'   => $created,
		'remaining' => max( 0, $total - $created ),
	);
}

function justice_theme_crm_read_btl_source_pack( int $limit = 10 ): array {
	$path = JUSTICE_THEME_DIR . '/project-control/btl-specialist-prospect-shortlist-2026-05-26.csv';
	if ( ! is_readable( $path ) ) {
		return array();
	}

	$handle = fopen( $path, 'r' );
	if ( ! $handle ) {
		return array();
	}

	$headers = fgetcsv( $handle, 0, ',', '"', '\\' );
	if ( ! is_array( $headers ) ) {
		fclose( $handle );
		return array();
	}

	$rows = array();
	while ( ( $data = fgetcsv( $handle, 0, ',', '"', '\\' ) ) !== false ) {
		if ( count( $data ) !== count( $headers ) ) {
			continue;
		}

		$row = array_combine( $headers, $data );
		if ( empty( $row['candidate'] ) || empty( $row['source_url'] ) ) {
			continue;
		}

		$rows[] = $row;
	}
	fclose( $handle );

	usort(
		$rows,
		static function ( array $a, array $b ): int {
			$priority_order = array( 'high' => 0, 'medium' => 1, 'low' => 2 );
			$a_priority     = $priority_order[ strtolower( (string) ( $a['priority'] ?? '' ) ) ] ?? 3;
			$b_priority     = $priority_order[ strtolower( (string) ( $b['priority'] ?? '' ) ) ] ?? 3;

			if ( $a_priority !== $b_priority ) {
				return $a_priority <=> $b_priority;
			}

			return strcmp( (string) ( $a['candidate'] ?? '' ), (string) ( $b['candidate'] ?? '' ) );
		}
	);

	return array_slice( $rows, 0, $limit );
}

function justice_theme_crm_btl_source_candidate_verification_brief( array $row ): string {
	return sprintf(
		"Candidate: %s\nSource: %s\nFocus: %s\nEvidence: %s\n\nVerify before routing:\n1. Israeli Bar/license status and current active status.\n2. Real Bituach Leumi, medical committee, appeal committee or labor-court appeal experience.\n3. Same-day response commitment for urgent appeal-window cases.\n4. Acceptance of the manual invoice/payment path before automation is complete.\n5. Agreed per-lead fee, billing contact and any city, case-type or capacity limits.\n\nSuggested CRM action: %s\n\nBoundary: do not promise ranking, lead volume, compensation amount or legal outcome. Do not publish a public profile or route leads until verification is complete.",
		(string) ( $row['candidate'] ?? '' ),
		(string) ( $row['source_url'] ?? '' ),
		(string) ( $row['apparent_focus'] ?? '' ),
		(string) ( $row['source_evidence_summary'] ?? '' ),
		(string) ( $row['crm_action'] ?? '' )
	);
}

function justice_theme_crm_btl_source_candidate_prefill_url( array $row ): string {
	$is_high           = 'high' === strtolower( (string) ( $row['priority'] ?? '' ) );
	$city              = trim( (string) ( $row['geo_hint'] ?? '' ) ) ?: 'ישראל';
	$signal            = 'BTL source-pack candidate: ' . (string) ( $row['source_evidence_summary'] ?? '' );
	$note              = 'From private BTL source pack. Do not route until license/status, niche experience, same-day response and manual-payment acceptance are verified. Source action: ' . (string) ( $row['crm_action'] ?? '' );
	$verification_note = justice_theme_crm_btl_source_candidate_verification_brief( $row );
	$next_action       = wp_date( 'Y-m-d', current_time( 'timestamp' ) + DAY_IN_SECONDS );

	return add_query_arg(
		array(
			'post_type'                     => 'justice_prospect',
			'prospect_firm_name'            => (string) ( $row['candidate'] ?? '' ),
			'prospect_practice_area'        => 'ביטוח לאומי',
			'prospect_city'                 => $city,
			'prospect_target_plan'          => $is_high ? 'lead_partner' : 'featured',
			'prospect_priority'             => $is_high ? 'hot' : 'warm',
			'prospect_outreach_status'      => 'research',
			'prospect_source_url'           => (string) ( $row['source_url'] ?? '' ),
			'prospect_expected_monthly_nis' => $is_high ? '1490' : '749',
			'prospect_next_action_at'       => $next_action,
			'prospect_response_fit'         => 'not_sure',
			'prospect_demand_signal'        => substr( $signal, 0, 450 ),
			'prospect_owner_note'           => substr( $note, 0, 450 ),
			'prospect_verification_note'    => substr( $verification_note, 0, 900 ),
		),
		admin_url( 'post-new.php' )
	);
}

function justice_theme_crm_render_btl_outreach_pack(): void {
	$templates = justice_theme_crm_btl_outreach_templates();
	?>
	<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;margin:12px 0 20px;">
		<h3 style="margin-top:0;">Bituach Leumi recruitment packet</h3>
		<p style="margin-top:0;color:#646970;">Copy-ready owner scripts for recruiting the first three specialist lawyers. Manual use only; nothing is sent from this screen.</p>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;">
			<?php foreach ( $templates as $key => $template ) : ?>
				<div>
					<label for="justice-btl-template-<?php echo esc_attr( $key ); ?>"><strong><?php echo esc_html( $template['label'] ); ?></strong></label>
					<textarea id="justice-btl-template-<?php echo esc_attr( $key ); ?>" rows="8" readonly style="width:100%;margin-top:6px;"><?php echo esc_textarea( $template['body'] ); ?></textarea>
					<p style="margin:6px 0 0;">
						<button type="button" class="button" data-justice-copy-target="justice-btl-template-<?php echo esc_attr( $key ); ?>">Copy</button>
					</p>
				</div>
			<?php endforeach; ?>
		</div>
		<h4>Qualification checklist before routing leads</h4>
		<ul style="list-style:disc;margin-inline-start:20px;">
			<li>Verify Israeli Bar license and current professional status.</li>
			<li>Confirm real experience with Bituach Leumi appeals, medical committees or labor-court appeals.</li>
			<li>Confirm response speed for urgent appeal-window cases.</li>
			<li>Confirm willingness to use manual invoice/payment path until Grow/Meshulam is fully active.</li>
			<li>Do not promise rankings, lead volume, case outcomes or compensation amounts.</li>
		</ul>
	</div>
	<script>
		(function () {
			document.addEventListener('click', function (event) {
				var button = event.target.closest('[data-justice-copy-target]');
				if (!button || !navigator.clipboard) {
					return;
				}

				var target = document.getElementById(button.getAttribute('data-justice-copy-target'));
				if (!target) {
					return;
				}

				navigator.clipboard.writeText(target.value).then(function () {
					var previous = button.textContent;
					button.textContent = 'Copied';
					setTimeout(function () {
						button.textContent = previous;
					}, 1200);
				});
			});
		}());
	</script>
	<?php
}

function justice_theme_crm_btl_outreach_templates(): array {
	return array(
		'initial' => array(
			'label' => 'Initial specialist outreach',
			'body'  => "שלום [שם עורך/ת הדין],\n\nאני פונה מ-Jus-Tice. אנחנו מפעילים מסלול ממוקד לפניות של אנשים שקיבלו החלטה מביטוח לאומי ורוצים להבין אם נכון לבדוק ערעור, מסמכים חסרים או מועד פעולה.\n\nאנחנו מחפשים כעת מספר מצומצם של עורכי דין שמתמחים בביטוח לאומי, ועדות רפואיות או ערעורים לבית הדין לעבודה, ושיכולים להגיב בזמן סביר לפניות דחופות.\n\nחשוב לי לדייק: אין התחייבות לכמות לידים, אין הבטחה לתוצאה משפטית, ואין שימוש בטענות של \"מומלץ\" או \"הכי טוב\". בשלב הראשון מדובר בבדיקת התאמה ובמסלול ידני ושקוף.\n\nאם זה רלוונטי, אשמח לשוחח 10 דקות ולבדוק התאמה ראשונית.\n\nבברכה,\nJus-Tice",
		),
		'qualification' => array(
			'label' => 'Qualification questions',
			'body'  => "שאלות בדיקה לפני הפעלת מסלול ביטוח לאומי:\n\n1. באילו סוגי תיקים בביטוח לאומי אתם מטפלים בפועל?\n2. האם אתם מטפלים בעררים על ועדות רפואיות, נכות מעבודה, נכות כללית או ערעורים לבית הדין לעבודה?\n3. מה זמן התגובה שלכם לפנייה שבה המועד לערעור קרוב?\n4. האם אתם מוכנים לקבל פניות בשלב ראשון במסלול ידני, עם חשבונית/קישור תשלום ידני עד שהאוטומציה מלאה?\n5. האם יש אזורים בארץ או סוגי תיקים שאינכם מקבלים?\n6. האם ניתן לאמת רישיון, פרופיל מקצועי ותחומי התמחות לפני הפעלת הפניות?",
		),
	);
}

function justice_theme_crm_count_active_routing_lawyers_for_area( string $area_slug ): int {
	return count( justice_theme_crm_query_active_routing_lawyers_for_area( $area_slug, 100 ) );
}

function justice_theme_crm_query_active_routing_lawyers_for_area( string $area_slug, int $limit = 25 ): array {
	if ( ! taxonomy_exists( 'practice-areas' ) ) {
		return array();
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => 'publish',
		'posts_per_page' => $limit,
		'no_found_rows'  => true,
		'tax_query'      => array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'slug',
				'terms'    => $area_slug,
			),
		),
		'meta_query'     => array(
			'relation' => 'AND',
			array(
				'key'   => 'lead_routing_enabled',
				'value' => '1',
			),
			array(
				'key'     => 'subscription_status',
				'value'   => function_exists( 'justice_theme_paid_routing_subscription_statuses' ) ? justice_theme_paid_routing_subscription_statuses() : array( 'active', 'paid', 'trialing' ),
				'compare' => 'IN',
			),
		),
	) );

	$posts = $query->posts ?: array();
	if ( function_exists( 'justice_theme_lawyer_can_receive_routed_lead' ) ) {
		$posts = array_values(
			array_filter(
				$posts,
				static function ( WP_Post $post ) use ( $area_slug ): bool {
					return justice_theme_lawyer_can_receive_routed_lead( (int) $post->ID, $area_slug );
				}
			)
		);
	}

	return array_slice( $posts, 0, $limit );
}

function justice_theme_crm_count_open_prospects_for_area( array $needles ): int {
	$query = justice_theme_crm_query_lawyer_prospects( 250 );
	if ( ! $query || empty( $query->posts ) ) {
		return 0;
	}

	$count           = 0;
	$closed_statuses = array( 'won', 'lost' );

	foreach ( $query->posts as $post ) {
		$post_id = (int) $post->ID;
		$status  = (string) get_post_meta( $post_id, 'prospect_outreach_status', true );
		if ( in_array( $status, $closed_statuses, true ) ) {
			continue;
		}

		$haystack = strtolower(
			get_the_title( $post_id ) . ' ' .
			(string) get_post_meta( $post_id, 'prospect_practice_area', true ) . ' ' .
			(string) get_post_meta( $post_id, 'prospect_demand_signal', true ) . ' ' .
			(string) get_post_meta( $post_id, 'prospect_owner_note', true )
		);

		foreach ( $needles as $needle ) {
			if ( false !== strpos( $haystack, strtolower( (string) $needle ) ) ) {
				$count++;
				break;
			}
		}
	}

	return $count;
}

function justice_theme_crm_query_prospects_for_area( array $needles, int $limit = 12 ): array {
	$query = justice_theme_crm_query_lawyer_prospects( 250 );
	if ( ! $query || empty( $query->posts ) ) {
		return array();
	}

	$matches         = array();
	$closed_statuses = array( 'lost' );

	foreach ( $query->posts as $post ) {
		$post_id = (int) $post->ID;
		$status  = (string) get_post_meta( $post_id, 'prospect_outreach_status', true );
		if ( in_array( $status, $closed_statuses, true ) ) {
			continue;
		}

		$haystack = strtolower(
			get_the_title( $post_id ) . ' ' .
			(string) get_post_meta( $post_id, 'prospect_practice_area', true ) . ' ' .
			(string) get_post_meta( $post_id, 'prospect_demand_signal', true ) . ' ' .
			(string) get_post_meta( $post_id, 'prospect_owner_note', true )
		);

		foreach ( $needles as $needle ) {
			if ( false !== strpos( $haystack, strtolower( (string) $needle ) ) ) {
				$matches[] = $post;
				break;
			}
		}
	}

	usort(
		$matches,
		static function ( WP_Post $a, WP_Post $b ): int {
			$a_ready = function_exists( 'justice_theme_lawyer_prospect_is_verified_for_routing' ) && justice_theme_lawyer_prospect_is_verified_for_routing( (int) $a->ID );
			$b_ready = function_exists( 'justice_theme_lawyer_prospect_is_verified_for_routing' ) && justice_theme_lawyer_prospect_is_verified_for_routing( (int) $b->ID );

			if ( $a_ready !== $b_ready ) {
				return $a_ready ? -1 : 1;
			}

			return strcmp( (string) $b->post_modified_gmt, (string) $a->post_modified_gmt );
		}
	);

	return array_slice( $matches, 0, $limit );
}

function justice_theme_crm_count_verified_prospects_for_area( array $needles ): int {
	$query = justice_theme_crm_query_lawyer_prospects( 250 );
	if ( ! $query || empty( $query->posts ) ) {
		return 0;
	}

	$count           = 0;
	$closed_statuses = array( 'lost' );

	foreach ( $query->posts as $post ) {
		$post_id = (int) $post->ID;
		$status  = (string) get_post_meta( $post_id, 'prospect_outreach_status', true );
		if ( in_array( $status, $closed_statuses, true ) ) {
			continue;
		}

		$haystack = strtolower(
			get_the_title( $post_id ) . ' ' .
			(string) get_post_meta( $post_id, 'prospect_practice_area', true ) . ' ' .
			(string) get_post_meta( $post_id, 'prospect_demand_signal', true ) . ' ' .
			(string) get_post_meta( $post_id, 'prospect_owner_note', true )
		);

		$matches_area = false;
		foreach ( $needles as $needle ) {
			if ( false !== strpos( $haystack, strtolower( (string) $needle ) ) ) {
				$matches_area = true;
				break;
			}
		}

		if ( ! $matches_area ) {
			continue;
		}

		if ( function_exists( 'justice_theme_lawyer_prospect_is_verified_for_routing' ) && ! justice_theme_lawyer_prospect_is_verified_for_routing( $post_id ) ) {
			continue;
		}

		$count++;
	}

	return $count;
}

function justice_theme_crm_count_btl_billable_leads( array $needles, array $billing_statuses ): int {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return 0;
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => 250,
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'meta_query'     => array(
			array(
				'key'     => 'lead_revenue_model',
				'compare' => 'EXISTS',
			),
		),
	) );

	$count = 0;
	foreach ( $query->posts ?: array() as $post_id ) {
		$post_id = (int) $post_id;
		$status  = (string) get_post_meta( $post_id, 'qualified_lead_billing_status', true );
		if ( ! in_array( $status, $billing_statuses, true ) ) {
			continue;
		}

		$haystack = strtolower(
			get_the_title( $post_id ) . ' ' .
			(string) get_post_meta( $post_id, 'legal_area', true ) . ' ' .
			(string) get_post_meta( $post_id, 'lead_area', true ) . ' ' .
			(string) get_post_meta( $post_id, 'ai_detected_area', true ) . ' ' .
			(string) get_post_meta( $post_id, 'message', true ) . ' ' .
			(string) get_post_meta( $post_id, 'qualified_lead_owner_note', true )
		);

		foreach ( $needles as $needle ) {
			if ( false !== strpos( $haystack, strtolower( (string) $needle ) ) ) {
				$count++;
				break;
			}
		}
	}

	return $count;
}

function justice_theme_crm_btl_prospect_prefill_url(): string {
	return add_query_arg(
		array(
			'post_type'                     => 'justice_prospect',
			'prospect_practice_area'        => 'ביטוח לאומי',
			'prospect_city'                 => 'ישראל',
			'prospect_target_plan'          => 'lead_partner',
			'prospect_priority'             => 'hot',
			'prospect_outreach_status'      => 'research',
			'prospect_expected_monthly_nis' => '1490',
			'prospect_demand_signal'        => 'Bituach Leumi appeal funnel: need three specialist lawyers for qualified appeal leads before first revenue test.',
			'prospect_owner_note'           => 'Validate Israeli Bar license, Bituach Leumi appeal experience, response time and willingness to accept manual invoice/payment path before routing qualified leads.',
		),
		admin_url( 'post-new.php' )
	);
}

function justice_theme_crm_lawyer_prospect_summary( int $limit ): array {
	$summary = array(
		'open_count'       => 0,
		'open_monthly_nis' => 0,
		'hot_count'        => 0,
		'due_count'        => 0,
	);

	$query = justice_theme_crm_query_lawyer_prospects( $limit );
	if ( ! $query || ! $query->have_posts() ) {
		return $summary;
	}

	$closed_statuses = array( 'won', 'lost' );
	$today           = current_time( 'Y-m-d' );

	foreach ( $query->posts as $post ) {
		$post_id  = (int) $post->ID;
		$status   = (string) get_post_meta( $post_id, 'prospect_outreach_status', true );
		$priority = (string) get_post_meta( $post_id, 'prospect_priority', true );
		$next     = (string) get_post_meta( $post_id, 'prospect_next_action_at', true );

		if ( ! in_array( $status, $closed_statuses, true ) ) {
			$summary['open_count']++;
			$summary['open_monthly_nis'] += (int) get_post_meta( $post_id, 'prospect_expected_monthly_nis', true );
		}

		if ( 'hot' === $priority && ! in_array( $status, $closed_statuses, true ) ) {
			$summary['hot_count']++;
		}

		if ( $next && $next <= $today && ! in_array( $status, $closed_statuses, true ) ) {
			$summary['due_count']++;
		}
	}

	wp_reset_postdata();

	return $summary;
}

function justice_theme_crm_query_lawyer_prospects( int $limit ): ?WP_Query {
	if ( ! post_type_exists( 'justice_prospect' ) ) {
		return null;
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_prospect',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => $limit,
		'orderby'        => 'modified',
		'order'          => 'DESC',
		'no_found_rows'  => true,
	) );

	if ( empty( $query->posts ) ) {
		return $query;
	}

	$today = current_time( 'Y-m-d' );
	$rank  = array(
		'hot'    => 0,
		'warm'   => 1,
		'cold'   => 2,
		'parked' => 3,
	);

	usort(
		$query->posts,
		static function ( WP_Post $a, WP_Post $b ) use ( $today, $rank ): int {
			$a_status = (string) get_post_meta( $a->ID, 'prospect_outreach_status', true );
			$b_status = (string) get_post_meta( $b->ID, 'prospect_outreach_status', true );
			$a_next   = (string) get_post_meta( $a->ID, 'prospect_next_action_at', true );
			$b_next   = (string) get_post_meta( $b->ID, 'prospect_next_action_at', true );
			$a_due    = $a_next && $a_next <= $today && ! in_array( $a_status, array( 'won', 'lost' ), true );
			$b_due    = $b_next && $b_next <= $today && ! in_array( $b_status, array( 'won', 'lost' ), true );

			if ( $a_due !== $b_due ) {
				return $a_due ? -1 : 1;
			}

			$a_priority = $rank[ (string) get_post_meta( $a->ID, 'prospect_priority', true ) ] ?? 2;
			$b_priority = $rank[ (string) get_post_meta( $b->ID, 'prospect_priority', true ) ] ?? 2;
			if ( $a_priority !== $b_priority ) {
				return $a_priority <=> $b_priority;
			}

			$a_value = (int) get_post_meta( $a->ID, 'prospect_expected_monthly_nis', true );
			$b_value = (int) get_post_meta( $b->ID, 'prospect_expected_monthly_nis', true );
			if ( $a_value !== $b_value ) {
				return $b_value <=> $a_value;
			}

			return strcmp( (string) $a_next, (string) $b_next );
		}
	);

	return $query;
}

function justice_theme_crm_render_lawyer_prospect_table( ?WP_Query $prospects ): void {
	if ( ! $prospects || ! $prospects->have_posts() ) {
		echo '<div class="notice notice-info inline"><p>No lawyer prospects yet. Use the Prospect button on an uncovered lead to create the first one.</p></div>';
		return;
	}

	$status_labels   = function_exists( 'justice_theme_lawyer_prospect_statuses' ) ? justice_theme_lawyer_prospect_statuses() : array();
	$priority_labels = function_exists( 'justice_theme_lawyer_prospect_priorities' ) ? justice_theme_lawyer_prospect_priorities() : array();
	$plan_labels     = function_exists( 'justice_theme_lawyer_prospect_plan_options' ) ? justice_theme_lawyer_prospect_plan_options() : array();
	?>
	<table class="widefat striped">
		<thead>
			<tr>
				<th>Prospect</th>
				<th>Area / market</th>
				<th>Target plan</th>
				<th>Priority</th>
				<th>Status</th>
				<th>Expected/mo</th>
				<th>Next action</th>
				<th>Source lead</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ( array_slice( $prospects->posts, 0, 12 ) as $post ) : ?>
				<?php
				$post_id     = (int) $post->ID;
				$area        = (string) get_post_meta( $post_id, 'prospect_practice_area', true );
				$city        = (string) get_post_meta( $post_id, 'prospect_city', true );
				$plan        = (string) get_post_meta( $post_id, 'prospect_target_plan', true );
				$priority    = (string) get_post_meta( $post_id, 'prospect_priority', true );
				$status      = (string) get_post_meta( $post_id, 'prospect_outreach_status', true );
				$next        = (string) get_post_meta( $post_id, 'prospect_next_action_at', true );
				$source_lead = (int) get_post_meta( $post_id, 'prospect_source_lead_id', true );
				?>
				<tr>
					<td><strong><?php echo esc_html( get_the_title( $post_id ) ?: '(untitled)' ); ?></strong></td>
					<td><?php echo esc_html( trim( $area . ' / ' . $city, ' /' ) ?: '-' ); ?></td>
					<td><?php echo esc_html( ( $plan_labels[ $plan ] ?? $plan ) ?: '-' ); ?></td>
					<td><?php echo esc_html( ( $priority_labels[ $priority ] ?? $priority ) ?: '-' ); ?></td>
					<td><?php echo esc_html( ( $status_labels[ $status ] ?? $status ) ?: '-' ); ?></td>
					<td><?php echo esc_html( number_format_i18n( (int) get_post_meta( $post_id, 'prospect_expected_monthly_nis', true ) ) ); ?> NIS</td>
					<td><?php echo esc_html( $next ?: '-' ); ?></td>
					<td>
						<?php if ( $source_lead ) : ?>
							<a href="<?php echo esc_url( get_edit_post_link( $source_lead, '' ) ); ?>">#<?php echo esc_html( (string) $source_lead ); ?></a>
						<?php else : ?>
							-
						<?php endif; ?>
					</td>
					<td>
						<div style="display:flex;gap:4px;flex-wrap:wrap;min-width:150px;">
							<a class="button" href="<?php echo esc_url( get_edit_post_link( $post_id, '' ) ); ?>">Open</a>
							<?php if ( function_exists( 'justice_theme_lawyer_prospect_quick_action_url' ) ) : ?>
								<a class="button" href="<?php echo esc_url( justice_theme_lawyer_prospect_quick_action_url( $post_id, 'contacted' ) ); ?>">Contacted</a>
								<a class="button" href="<?php echo esc_url( justice_theme_lawyer_prospect_quick_action_url( $post_id, 'follow_up' ) ); ?>">Follow-up</a>
							<?php endif; ?>
						</div>
					</td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
	<?php
	wp_reset_postdata();
}

function justice_theme_crm_render_supplier_pipeline(): void {
	if ( ! post_type_exists( 'justice_supplier' ) ) {
		return;
	}

	$summary   = justice_theme_crm_supplier_summary( 250 );
	$suppliers = justice_theme_crm_query_suppliers( 50 );
	$all_url   = admin_url( 'edit.php?post_type=justice_supplier' );
	$new_url   = admin_url( 'post-new.php?post_type=justice_supplier' );
	?>
	<h2 style="margin-top:28px;">Supplier marketplace pipeline</h2>
	<p>Track lawyer-facing suppliers and service providers that can become listing, lead-fee, affiliate or sponsorship revenue.</p>
	<div class="justice-crm-cards" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0;">
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $summary['open_count'] ); ?></strong>
			<span>Open suppliers</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $summary['outreach_ready_count'] ); ?></strong>
			<span>Outreach ready</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $summary['approved_count'] ); ?></strong>
			<span>Approved partners</span>
		</div>
		<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
			<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $summary['commercial_model_count'] ); ?></strong>
			<span>Revenue model set</span>
		</div>
	</div>
	<p>
		<a class="button button-primary" href="<?php echo esc_url( $all_url ); ?>">Open all suppliers</a>
		<a class="button" href="<?php echo esc_url( $new_url ); ?>">Add supplier</a>
	</p>
	<?php justice_theme_crm_render_supplier_table( $suppliers ); ?>
	<?php
}

function justice_theme_crm_supplier_summary( int $limit ): array {
	$summary = array(
		'open_count'             => 0,
		'outreach_ready_count'   => 0,
		'approved_count'         => 0,
		'commercial_model_count' => 0,
	);

	$query = justice_theme_crm_query_suppliers( $limit );
	if ( ! $query || ! $query->have_posts() ) {
		return $summary;
	}

	$commercial_models = array( 'monthly_listing', 'lead_fee', 'affiliate', 'sponsorship' );

	foreach ( $query->posts as $post ) {
		$post_id = (int) $post->ID;
		$status  = (string) get_post_meta( $post_id, 'supplier_partnership_status', true );
		$revenue = (string) get_post_meta( $post_id, 'supplier_revenue_model', true );

		if ( 'rejected' !== $status ) {
			$summary['open_count']++;
		}

		if ( 'outreach' === $status ) {
			$summary['outreach_ready_count']++;
		}

		if ( 'approved' === $status ) {
			$summary['approved_count']++;
		}

		if ( in_array( $revenue, $commercial_models, true ) ) {
			$summary['commercial_model_count']++;
		}
	}

	wp_reset_postdata();

	return $summary;
}

function justice_theme_crm_query_suppliers( int $limit ): ?WP_Query {
	if ( ! post_type_exists( 'justice_supplier' ) ) {
		return null;
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_supplier',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => $limit,
		'orderby'        => 'modified',
		'order'          => 'DESC',
		'no_found_rows'  => true,
	) );

	if ( empty( $query->posts ) ) {
		return $query;
	}

	$status_rank = array(
		'outreach'    => 0,
		'negotiating' => 1,
		'contacted'   => 2,
		'research'    => 3,
		'approved'    => 4,
		'rejected'    => 5,
	);
	$priority_rank = array(
		'high'   => 0,
		'medium' => 1,
		'low'    => 2,
	);
	$revenue_rank = array(
		'monthly_listing' => 0,
		'lead_fee'        => 1,
		'affiliate'       => 2,
		'sponsorship'     => 3,
		'barter'          => 4,
		'unknown'         => 5,
	);

	usort(
		$query->posts,
		static function ( WP_Post $a, WP_Post $b ) use ( $status_rank, $priority_rank, $revenue_rank ): int {
			$a_status = $status_rank[ (string) get_post_meta( $a->ID, 'supplier_partnership_status', true ) ] ?? 3;
			$b_status = $status_rank[ (string) get_post_meta( $b->ID, 'supplier_partnership_status', true ) ] ?? 3;
			if ( $a_status !== $b_status ) {
				return $a_status <=> $b_status;
			}

			$a_priority = $priority_rank[ (string) get_post_meta( $a->ID, 'supplier_priority', true ) ] ?? 1;
			$b_priority = $priority_rank[ (string) get_post_meta( $b->ID, 'supplier_priority', true ) ] ?? 1;
			if ( $a_priority !== $b_priority ) {
				return $a_priority <=> $b_priority;
			}

			$a_revenue = $revenue_rank[ (string) get_post_meta( $a->ID, 'supplier_revenue_model', true ) ] ?? 5;
			$b_revenue = $revenue_rank[ (string) get_post_meta( $b->ID, 'supplier_revenue_model', true ) ] ?? 5;
			if ( $a_revenue !== $b_revenue ) {
				return $a_revenue <=> $b_revenue;
			}

			return strcmp( (string) $b->post_modified, (string) $a->post_modified );
		}
	);

	return $query;
}

function justice_theme_crm_render_supplier_table( ?WP_Query $suppliers ): void {
	if ( ! $suppliers || ! $suppliers->have_posts() ) {
		echo '<div class="notice notice-info inline"><p>No suppliers yet. Add researched vendors here before any public supplier marketplace is exposed.</p></div>';
		return;
	}

	$category_labels = function_exists( 'justice_theme_lawyer_supplier_categories' ) ? justice_theme_lawyer_supplier_categories() : array();
	$type_labels     = function_exists( 'justice_theme_lawyer_supplier_provider_types' ) ? justice_theme_lawyer_supplier_provider_types() : array();
	$status_labels   = function_exists( 'justice_theme_lawyer_supplier_statuses' ) ? justice_theme_lawyer_supplier_statuses() : array();
	$revenue_labels  = function_exists( 'justice_theme_lawyer_supplier_revenue_models' ) ? justice_theme_lawyer_supplier_revenue_models() : array();
	$bid_labels      = function_exists( 'justice_theme_lawyer_supplier_bid_models' ) ? justice_theme_lawyer_supplier_bid_models() : array();
	?>
	<table class="widefat striped">
		<thead>
			<tr>
				<th>Supplier</th>
				<th>Provider type</th>
				<th>Category</th>
				<th>Revenue model</th>
				<th>Bid model / floor</th>
				<th>Priority</th>
				<th>Status</th>
				<th>Service area</th>
				<th>Contact</th>
				<th>Source</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ( array_slice( $suppliers->posts, 0, 12 ) as $post ) : ?>
				<?php
				$post_id      = (int) $post->ID;
				$category     = (string) get_post_meta( $post_id, 'supplier_category', true );
				$type         = (string) get_post_meta( $post_id, 'supplier_provider_type', true );
				$revenue      = (string) get_post_meta( $post_id, 'supplier_revenue_model', true );
				$bid_model    = (string) get_post_meta( $post_id, 'supplier_bid_model', true );
				$min_price    = absint( get_post_meta( $post_id, 'supplier_min_price_ils', true ) );
				$priority     = (string) get_post_meta( $post_id, 'supplier_priority', true );
				$status       = (string) get_post_meta( $post_id, 'supplier_partnership_status', true );
				$service_area = (string) get_post_meta( $post_id, 'supplier_service_area', true );
				$contact_name = (string) get_post_meta( $post_id, 'supplier_contact_name', true );
				$phone        = (string) get_post_meta( $post_id, 'supplier_contact_phone', true );
				$email        = (string) get_post_meta( $post_id, 'supplier_contact_email', true );
				$website      = (string) get_post_meta( $post_id, 'supplier_website', true );
				$source       = (string) get_post_meta( $post_id, 'supplier_source_url', true );
				?>
				<tr>
					<td><strong><?php echo esc_html( get_the_title( $post_id ) ?: '(untitled)' ); ?></strong></td>
					<td><?php echo esc_html( ( $type_labels[ $type ] ?? $type ) ?: '-' ); ?></td>
					<td><?php echo esc_html( ( $category_labels[ $category ] ?? $category ) ?: '-' ); ?></td>
					<td><?php echo esc_html( ( $revenue_labels[ $revenue ] ?? $revenue ) ?: '-' ); ?></td>
					<td>
						<?php echo esc_html( ( $bid_labels[ $bid_model ] ?? $bid_model ) ?: '-' ); ?>
						<?php if ( $min_price ) : ?>
							<br><small><?php echo esc_html( number_format_i18n( $min_price ) ); ?> NIS floor</small>
						<?php endif; ?>
					</td>
					<td><?php echo esc_html( $priority ?: '-' ); ?></td>
					<td><?php echo esc_html( ( $status_labels[ $status ] ?? $status ) ?: '-' ); ?></td>
					<td><?php echo esc_html( $service_area ?: '-' ); ?></td>
					<td>
						<?php echo esc_html( $contact_name ?: '-' ); ?>
						<?php if ( $phone ) : ?>
							<br><a href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>
						<?php endif; ?>
						<?php if ( $email ) : ?>
							<br><a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a>
						<?php endif; ?>
					</td>
					<td>
						<?php if ( $source ) : ?>
							<a href="<?php echo esc_url( $source ); ?>" target="_blank" rel="noopener">source</a>
						<?php else : ?>
							-
						<?php endif; ?>
					</td>
					<td>
						<div style="display:flex;gap:4px;flex-wrap:wrap;min-width:150px;">
							<a class="button" href="<?php echo esc_url( get_edit_post_link( $post_id, '' ) ); ?>">Open</a>
							<?php if ( $website ) : ?>
								<a class="button" href="<?php echo esc_url( $website ); ?>" target="_blank" rel="noopener">Website</a>
							<?php endif; ?>
						</div>
					</td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
	<?php
	wp_reset_postdata();
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

/**
 * Snapshot qualified lead revenue that is waiting to be billed or already paid.
 *
 * @return array{open_count:int,open_value:int,paid_count:int,paid_value:int}
 */
function justice_theme_crm_qualified_lead_revenue_snapshot(): array {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return array(
			'open_count' => 0,
			'open_value' => 0,
			'paid_count' => 0,
			'paid_value' => 0,
		);
	}

	$query = new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => 200,
		'fields'         => 'ids',
		'no_found_rows'  => true,
		'meta_query'     => array(
			array(
				'key'     => 'lead_revenue_model',
				'compare' => 'EXISTS',
			),
		),
	) );

	$snapshot = array(
		'open_count' => 0,
		'open_value' => 0,
		'paid_count' => 0,
		'paid_value' => 0,
	);

	foreach ( $query->posts ?: array() as $post_id ) {
		$status = (string) get_post_meta( (int) $post_id, 'qualified_lead_billing_status', true );
		$price  = absint( get_post_meta( (int) $post_id, 'suggested_lead_price_ils', true ) );

		if ( in_array( $status, array( 'ready_to_bill', 'invoice_sent' ), true ) ) {
			$snapshot['open_count']++;
			$snapshot['open_value'] += $price;
		}

		if ( 'paid' === $status ) {
			$snapshot['paid_count']++;
			$snapshot['paid_value'] += $price;
		}
	}

	return $snapshot;
}

function justice_theme_crm_render_qualified_lead_billing_queue(): void {
	$queue = justice_theme_crm_query_qualified_lead_billing_queue( 12 );
	?>
	<h2 style="margin-top:28px;">Qualified lead billing queue</h2>
	<p>Owner-only queue for billable leads that should be invoiced or followed up manually while Grow/Meshulam is not fully active.</p>
	<?php if ( ! $queue || ! $queue->have_posts() ) : ?>
		<div class="notice notice-info inline"><p>No qualified leads are waiting for billing.</p></div>
		<?php return; ?>
	<?php endif; ?>
	<table class="widefat striped" style="margin:12px 0 20px;">
		<thead>
			<tr>
				<th>Lead</th>
				<th>Area</th>
				<th>Billing</th>
				<th>Billable lawyer(s)</th>
				<th>Ready / invoice</th>
				<th>Next owner action</th>
			</tr>
		</thead>
		<tbody>
			<?php while ( $queue->have_posts() ) : $queue->the_post(); ?>
				<?php
				$post_id       = get_the_ID();
				$name          = get_post_meta( $post_id, 'visitor_name', true ) ?: get_post_meta( $post_id, 'lead_name', true ) ?: get_the_title();
				$phone         = get_post_meta( $post_id, 'visitor_phone', true ) ?: get_post_meta( $post_id, 'lead_phone', true );
				$email         = get_post_meta( $post_id, 'visitor_email', true ) ?: get_post_meta( $post_id, 'lead_email', true );
				$area          = get_post_meta( $post_id, 'legal_area', true ) ?: get_post_meta( $post_id, 'lead_area', true );
				$area_display  = function_exists( 'justice_theme_lead_area_label' ) ? justice_theme_lead_area_label( (string) $area ) : (string) $area;
				$billing       = justice_theme_crm_qualified_lead_billing_badge( $post_id );
				$ready_at      = (string) get_post_meta( $post_id, 'qualified_lead_ready_at', true );
				$billed_at     = (string) get_post_meta( $post_id, 'qualified_lead_billed_at', true );
				$paid_at       = (string) get_post_meta( $post_id, 'qualified_lead_paid_at', true );
				$invoice_ref   = (string) get_post_meta( $post_id, 'qualified_lead_invoice_reference', true );
				$evidence_url  = (string) get_post_meta( $post_id, 'qualified_lead_payment_evidence_url', true );
				$lawyer_ids    = justice_theme_crm_parse_id_list( (string) get_post_meta( $post_id, 'qualified_lead_billable_lawyer_ids', true ) );
				$lawyer_labels = justice_theme_crm_lawyer_link_labels( $lawyer_ids );
				$lawyer_actions = justice_theme_crm_billable_lawyer_contact_actions( $lawyer_ids, $post_id );
				$invoice_packet_id = 'justice-qualified-lead-invoice-packet-' . $post_id;
				$invoice_packet    = justice_theme_crm_qualified_lead_invoice_packet( $post_id, $lawyer_ids );
				$edit_url      = get_edit_post_link( $post_id, '' );
				$phone_link    = $phone ? 'tel:' . preg_replace( '/[^0-9+]/', '', (string) $phone ) : '';
				?>
				<tr>
					<td>
						<strong><?php echo esc_html( $name ); ?></strong>
						<?php if ( $phone ) : ?>
							<br><a href="<?php echo esc_url( $phone_link ); ?>"><?php echo esc_html( $phone ); ?></a>
						<?php endif; ?>
						<?php if ( $email ) : ?>
							<br><a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a>
						<?php endif; ?>
					</td>
					<td><?php echo esc_html( $area_display ?: '-' ); ?></td>
					<td>
						<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $billing['style'] ); ?>"><?php echo esc_html( $billing['label'] ); ?></span>
						<?php if ( ! empty( $billing['detail'] ) ) : ?>
							<small style="display:block;color:#646970;margin-top:3px;"><?php echo esc_html( $billing['detail'] ); ?></small>
						<?php endif; ?>
					</td>
					<td>
						<?php if ( $lawyer_labels ) : ?>
							<?php echo wp_kses_post( implode( '<br>', $lawyer_labels ) ); ?>
						<?php else : ?>
							<span style="color:#646970;">Not linked yet</span>
						<?php endif; ?>
					</td>
					<td>
						<?php if ( $ready_at ) : ?>
							<strong>Ready:</strong> <?php echo esc_html( $ready_at ); ?><br>
						<?php endif; ?>
						<?php if ( $billed_at ) : ?>
							<strong>Invoice sent:</strong> <?php echo esc_html( $billed_at ); ?><br>
						<?php endif; ?>
						<?php if ( $paid_at ) : ?>
							<strong>Paid:</strong> <?php echo esc_html( $paid_at ); ?><br>
						<?php endif; ?>
						<?php if ( $invoice_ref ) : ?>
							<small><?php echo esc_html( $invoice_ref ); ?></small><br>
						<?php endif; ?>
						<?php if ( $evidence_url ) : ?>
							<a href="<?php echo esc_url( $evidence_url ); ?>" target="_blank" rel="noopener">Payment proof</a>
						<?php endif; ?>
					</td>
					<td>
						<a class="button button-primary" href="<?php echo esc_url( $edit_url ); ?>">Open billing fields</a>
						<?php if ( $lawyer_actions ) : ?>
							<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px;">
								<?php foreach ( $lawyer_actions as $action ) : ?>
									<a class="button" href="<?php echo esc_url( $action['url'] ); ?>"<?php echo ! empty( $action['external'] ) ? ' target="_blank" rel="noopener"' : ''; ?>><?php echo esc_html( $action['label'] ); ?></a>
								<?php endforeach; ?>
							</div>
						<?php endif; ?>
						<p style="margin:6px 0 0;color:#646970;">Set status to Invoice sent / Paid after the manual payment link or invoice is handled.</p>
						<?php if ( $invoice_packet ) : ?>
							<details style="margin-top:8px;">
								<summary style="cursor:pointer;font-weight:600;">Copy invoice/request packet</summary>
								<textarea id="<?php echo esc_attr( $invoice_packet_id ); ?>" rows="8" readonly style="width:100%;margin-top:6px;"><?php echo esc_textarea( $invoice_packet ); ?></textarea>
								<p style="margin:6px 0 0;">
									<button type="button" class="button" data-justice-copy-target="<?php echo esc_attr( $invoice_packet_id ); ?>">Copy packet</button>
								</p>
							</details>
						<?php endif; ?>
					</td>
				</tr>
			<?php endwhile; ?>
		</tbody>
	</table>
	<?php
	wp_reset_postdata();
}

function justice_theme_crm_query_qualified_lead_billing_queue( int $limit ): ?WP_Query {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return null;
	}

	return new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => $limit,
		'orderby'        => 'modified',
		'order'          => 'DESC',
		'no_found_rows'  => true,
		'meta_query'     => array(
			'relation' => 'AND',
			array(
				'key'     => 'lead_revenue_model',
				'compare' => 'EXISTS',
			),
			array(
				'key'     => 'qualified_lead_billing_status',
				'value'   => array( 'ready_to_bill', 'invoice_sent' ),
				'compare' => 'IN',
			),
		),
	) );
}

function justice_theme_crm_parse_id_list( string $value ): array {
	$ids = array_filter( array_map( 'absint', preg_split( '/[,\\s]+/', $value ) ?: array() ) );

	return array_values( array_unique( $ids ) );
}

function justice_theme_crm_lawyer_link_labels( array $lawyer_ids ): array {
	$labels = array();

	foreach ( $lawyer_ids as $lawyer_id ) {
		if ( 'justice_lawyer' !== get_post_type( $lawyer_id ) ) {
			continue;
		}

		$title = get_the_title( $lawyer_id ) ?: sprintf( 'Lawyer #%d', $lawyer_id );
		$url   = get_edit_post_link( $lawyer_id, '' );
		if ( $url ) {
			$labels[] = '<a href="' . esc_url( $url ) . '">' . esc_html( $title ) . '</a>';
		} else {
			$labels[] = esc_html( $title );
		}
	}

	return $labels;
}

function justice_theme_crm_billable_lawyer_contact_actions( array $lawyer_ids, int $lead_id ): array {
	$actions = array();
	$price   = absint( get_post_meta( $lead_id, 'suggested_lead_price_ils', true ) );
	$lead    = get_post( $lead_id );

	if ( ! $lead instanceof WP_Post ) {
		return $actions;
	}

	$lead_name = get_post_meta( $lead_id, 'visitor_name', true ) ?: get_post_meta( $lead_id, 'lead_name', true ) ?: get_the_title( $lead_id );
	$area      = get_post_meta( $lead_id, 'legal_area', true ) ?: get_post_meta( $lead_id, 'lead_area', true );
	$area_name = function_exists( 'justice_theme_lead_area_label' ) ? justice_theme_lead_area_label( (string) $area ) : (string) $area;
	$subject   = sprintf( 'Jus-Tice: qualified lead billing - %s', $area_name ?: 'legal lead' );
	$price_row = $price ? sprintf( "Suggested lead price: ₪%s\n", number_format_i18n( $price ) ) : '';

	foreach ( $lawyer_ids as $lawyer_id ) {
		if ( 'justice_lawyer' !== get_post_type( $lawyer_id ) ) {
			continue;
		}

		$lawyer_name = get_the_title( $lawyer_id ) ?: sprintf( 'Lawyer #%d', $lawyer_id );
		$email       = (string) get_post_meta( $lawyer_id, 'email', true );
		$whatsapp    = (string) ( get_post_meta( $lawyer_id, 'whatsapp', true ) ?: get_post_meta( $lawyer_id, 'phone', true ) );
		$message     = sprintf(
			"שלום %s,\n\nפנייה מוסמכת בתחום %s סומנה כמוכנה לחיוב ב-Jus-Tice.\nשם הפונה: %s\n%s\nנא לאשר קבלה ולעדכן אם לשלוח חשבונית/קישור תשלום ידני.\n\nאין התחייבות לתוצאה משפטית ואין הבטחת הצלחה ללקוח.\nJus-Tice",
			$lawyer_name,
			$area_name ?: 'משפט',
			$lead_name,
			$price_row
		);

		if ( $email && is_email( $email ) ) {
			$actions[] = array(
				'label'    => sprintf( 'Email %s', wp_html_excerpt( $lawyer_name, 18, '...' ) ),
				'url'      => add_query_arg(
					array(
						'subject' => $subject,
						'body'    => $message,
					),
					'mailto:' . $email
				),
				'external' => false,
			);
		}

		if ( $whatsapp ) {
			$wa_url = function_exists( 'justice_theme_lawyer_public_whatsapp_link' )
				? justice_theme_lawyer_public_whatsapp_link( $whatsapp )
				: 'https://wa.me/' . preg_replace( '/[^0-9]/', '', $whatsapp );

			if ( $wa_url ) {
				$actions[] = array(
					'label'    => sprintf( 'WhatsApp %s', wp_html_excerpt( $lawyer_name, 14, '...' ) ),
					'url'      => add_query_arg( 'text', $message, $wa_url ),
					'external' => true,
				);
			}
		}
	}

	return $actions;
}

function justice_theme_crm_qualified_lead_invoice_packet( int $lead_id, array $lawyer_ids ): string {
	$lead = get_post( $lead_id );

	if ( ! $lead instanceof WP_Post ) {
		return '';
	}

	$lead_name     = get_post_meta( $lead_id, 'visitor_name', true ) ?: get_post_meta( $lead_id, 'lead_name', true ) ?: get_the_title( $lead_id );
	$area          = get_post_meta( $lead_id, 'legal_area', true ) ?: get_post_meta( $lead_id, 'lead_area', true );
	$area_name     = function_exists( 'justice_theme_lead_area_label' ) ? justice_theme_lead_area_label( (string) $area ) : (string) $area;
	$revenue_model = (string) get_post_meta( $lead_id, 'lead_revenue_model', true );
	$status        = (string) get_post_meta( $lead_id, 'qualified_lead_billing_status', true );
	$status        = $status ?: 'not_ready';
	$status_labels = justice_theme_crm_qualified_lead_billing_labels();
	$price         = absint( get_post_meta( $lead_id, 'suggested_lead_price_ils', true ) );
	$invoice_ref   = (string) get_post_meta( $lead_id, 'qualified_lead_invoice_reference', true );
	$evidence_url  = (string) get_post_meta( $lead_id, 'qualified_lead_payment_evidence_url', true );
	$lawyer_rows   = array();

	foreach ( $lawyer_ids as $lawyer_id ) {
		if ( 'justice_lawyer' !== get_post_type( $lawyer_id ) ) {
			continue;
		}

		$lawyer_name   = get_the_title( $lawyer_id ) ?: sprintf( 'Lawyer #%d', $lawyer_id );
		$billing_email = (string) get_post_meta( $lawyer_id, 'billing_invoice_email', true );
		$email         = (string) get_post_meta( $lawyer_id, 'email', true );
		$phone         = (string) ( get_post_meta( $lawyer_id, 'whatsapp', true ) ?: get_post_meta( $lawyer_id, 'phone', true ) );
		$contact_bits  = array();

		if ( $billing_email && is_email( $billing_email ) ) {
			$contact_bits[] = 'billing ' . $billing_email;
		} elseif ( $email && is_email( $email ) ) {
			$contact_bits[] = 'email ' . $email;
		}

		if ( $phone ) {
			$contact_bits[] = 'phone ' . $phone;
		}

		$lawyer_rows[] = sprintf(
			'- #%d %s%s',
			$lawyer_id,
			wp_strip_all_tags( $lawyer_name ),
			$contact_bits ? ' (' . implode( ', ', $contact_bits ) . ')' : ' (billing contact not recorded)'
		);
	}

	if ( ! $lawyer_rows ) {
		$lawyer_rows[] = '- No billable lawyer ID is linked yet; do not invoice until this is fixed.';
	}

	$lines = array(
		'Jus-Tice qualified lead invoice/request packet',
		'Internal owner packet. Send only after the routed lawyer accepted the fee, terms and billing contact requirements.',
		'',
		sprintf( 'Lead: #%d - %s', $lead_id, wp_strip_all_tags( (string) $lead_name ) ),
		'Area: ' . ( $area_name ? wp_strip_all_tags( (string) $area_name ) : '-' ),
		'Billing status: ' . ( $status_labels[ $status ] ?? $status_labels['not_ready'] ),
		'Revenue model: ' . ( $revenue_model ?: '-' ),
		'Agreed/suggested lead fee: ' . ( $price ? number_format_i18n( $price ) . ' NIS' : 'not recorded - do not invoice yet' ),
		'',
		'Billable lawyer(s):',
		implode( "\n", $lawyer_rows ),
		'',
		'Owner handoff steps:',
		'1. Confirm the routed lawyer accepted qualified-lead terms before this lead was sent.',
		'2. Send a manual invoice/payment request for the fee above to the recorded billing contact.',
		'3. Save the invoice/payment reference on this lead before moving it to Invoice sent.',
		'4. Mark Paid only after an invoice/reference or payment evidence URL exists.',
		'5. Keep all client and lawyer notes in the CRM; do not promise outcome, ranking, exclusivity or lead volume.',
	);

	if ( $invoice_ref ) {
		$lines[] = '';
		$lines[] = 'Existing invoice/reference: ' . $invoice_ref;
	}

	if ( $evidence_url ) {
		$lines[] = 'Existing payment proof URL: ' . esc_url_raw( $evidence_url );
	}

	return implode( "\n", $lines );
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
	$lawyer_note     = get_post_meta( $post->ID, 'latest_lawyer_follow_up_note', true );
	$lawyer_update   = get_post_meta( $post->ID, 'latest_lawyer_stage_update_at', true );
	$revenue_model   = get_post_meta( $post->ID, 'lead_revenue_model', true );
	$suggested_price = get_post_meta( $post->ID, 'suggested_lead_price_ils', true );
	$revenue_notes   = get_post_meta( $post->ID, 'lead_revenue_notes', true );
	$billing_status  = get_post_meta( $post->ID, 'qualified_lead_billing_status', true ) ?: 'not_ready';
	$invoice_ref     = get_post_meta( $post->ID, 'qualified_lead_invoice_reference', true );
	$evidence_url    = get_post_meta( $post->ID, 'qualified_lead_payment_evidence_url', true );
	$billed_at       = get_post_meta( $post->ID, 'qualified_lead_billed_at', true );
	$paid_at         = get_post_meta( $post->ID, 'qualified_lead_paid_at', true );
	$billing_note    = get_post_meta( $post->ID, 'qualified_lead_owner_note', true );
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
	$billing_options = justice_theme_crm_qualified_lead_billing_labels();
	if ( ! array_key_exists( $billing_status, $billing_options ) ) {
		$billing_status = 'not_ready';
	}
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
	<?php if ( $revenue_model || $suggested_price ) : ?>
		<div style="border:1px solid #dcdcde;border-radius:4px;background:#fff;padding:8px;margin:10px 0;">
			<strong style="display:block;margin-bottom:6px;">Qualified lead billing</strong>
			<p style="margin:0 0 8px;color:#646970;">
				Model: <?php echo esc_html( $revenue_model ?: 'manual' ); ?>
				<?php if ( $revenue_notes ) : ?>
					<br><?php echo esc_html( $revenue_notes ); ?>
				<?php endif; ?>
			</p>
			<p>
				<label for="justice-qualified-lead-billing-status"><strong>Billing status</strong></label>
				<select id="justice-qualified-lead-billing-status" name="qualified_lead_billing_status" style="width:100%;">
					<?php foreach ( $billing_options as $value => $label ) : ?>
						<option value="<?php echo esc_attr( $value ); ?>" <?php selected( $billing_status, $value ); ?>><?php echo esc_html( $label ); ?></option>
					<?php endforeach; ?>
				</select>
			</p>
			<p>
				<label for="justice-suggested-lead-price-ils"><strong>Suggested price ILS</strong></label>
				<input id="justice-suggested-lead-price-ils" type="number" min="0" name="suggested_lead_price_ils" value="<?php echo esc_attr( $suggested_price ); ?>" style="width:100%;">
			</p>
			<p>
				<label for="justice-qualified-lead-invoice-reference"><strong>Invoice/payment reference</strong></label>
				<input id="justice-qualified-lead-invoice-reference" type="text" name="qualified_lead_invoice_reference" value="<?php echo esc_attr( $invoice_ref ); ?>" style="width:100%;" placeholder="Morning/Grow invoice, payment link, or owner note">
			</p>
			<p>
				<label for="justice-qualified-lead-payment-evidence-url"><strong>Payment evidence URL</strong></label>
				<input id="justice-qualified-lead-payment-evidence-url" type="url" name="qualified_lead_payment_evidence_url" value="<?php echo esc_attr( $evidence_url ); ?>" style="width:100%;" placeholder="Private invoice receipt, bank/payment proof, or owner evidence URL">
			</p>
			<div style="border:1px solid #dcdcde;border-radius:4px;background:#f6f7f7;padding:8px;margin:8px 0;">
				<strong style="display:block;margin-bottom:4px;">Payment proof gate</strong>
				<small style="display:block;color:#646970;">A lead should be marked Paid only after an invoice/reference or evidence URL exists. If Paid is saved without proof, the status is held at Invoice sent.</small>
			</div>
			<?php if ( $billed_at || $paid_at ) : ?>
				<p style="margin:0 0 8px;color:#646970;">
					<?php if ( $billed_at ) : ?>Billed: <?php echo esc_html( $billed_at ); ?><br><?php endif; ?>
					<?php if ( $paid_at ) : ?>Paid: <?php echo esc_html( $paid_at ); ?><?php endif; ?>
				</p>
			<?php endif; ?>
			<p>
				<label for="justice-qualified-lead-owner-note"><strong>Billing owner note</strong></label>
				<textarea id="justice-qualified-lead-owner-note" name="qualified_lead_owner_note" rows="3" style="width:100%;"><?php echo esc_textarea( $billing_note ); ?></textarea>
			</p>
		</div>
	<?php endif; ?>
	<?php if ( $lawyer_note || $lawyer_update ) : ?>
		<div style="border:1px solid #dcdcde;border-radius:4px;background:#f6f7f7;padding:8px;margin:10px 0;">
			<strong style="display:block;margin-bottom:4px;">Latest lawyer report</strong>
			<?php if ( $lawyer_note ) : ?>
				<p style="margin:0 0 6px;"><?php echo esc_html( $lawyer_note ); ?></p>
			<?php endif; ?>
			<?php if ( $lawyer_update ) : ?>
				<p style="margin:0;color:#646970;">Updated: <?php echo esc_html( $lawyer_update ); ?></p>
			<?php endif; ?>
		</div>
	<?php endif; ?>
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

	$billing_options = justice_theme_crm_qualified_lead_billing_labels();
	$billing_status  = isset( $_POST['qualified_lead_billing_status'] ) ? sanitize_key( wp_unslash( $_POST['qualified_lead_billing_status'] ) ) : 'not_ready';
	if ( ! array_key_exists( $billing_status, $billing_options ) ) {
		$billing_status = 'not_ready';
	}

	$previous_billing_status = (string) get_post_meta( $post_id, 'qualified_lead_billing_status', true );
	$invoice_reference       = isset( $_POST['qualified_lead_invoice_reference'] ) ? sanitize_text_field( wp_unslash( $_POST['qualified_lead_invoice_reference'] ) ) : '';
	$payment_evidence_url    = isset( $_POST['qualified_lead_payment_evidence_url'] ) ? esc_url_raw( wp_unslash( $_POST['qualified_lead_payment_evidence_url'] ) ) : '';
	$owner_note              = isset( $_POST['qualified_lead_owner_note'] ) ? sanitize_textarea_field( wp_unslash( $_POST['qualified_lead_owner_note'] ) ) : '';
	if ( 'paid' === $billing_status && '' === $invoice_reference && '' === $payment_evidence_url ) {
		$billing_status = 'invoice_sent';
		$owner_note     = trim( $owner_note . "\nPayment status was held at Invoice sent because Paid requires an invoice/payment reference or payment evidence URL." );
	}

	update_post_meta( $post_id, 'qualified_lead_billing_status', $billing_status );
	update_post_meta( $post_id, 'suggested_lead_price_ils', isset( $_POST['suggested_lead_price_ils'] ) ? (string) absint( wp_unslash( $_POST['suggested_lead_price_ils'] ) ) : '' );
	update_post_meta( $post_id, 'qualified_lead_invoice_reference', $invoice_reference );
	update_post_meta( $post_id, 'qualified_lead_payment_evidence_url', $payment_evidence_url );
	update_post_meta( $post_id, 'qualified_lead_owner_note', $owner_note );

	if ( 'invoice_sent' === $billing_status && 'invoice_sent' !== $previous_billing_status && ! get_post_meta( $post_id, 'qualified_lead_billed_at', true ) ) {
		update_post_meta( $post_id, 'qualified_lead_billed_at', current_time( 'mysql' ) );
	}

	if ( 'paid' === $billing_status && 'paid' !== $previous_billing_status && ! get_post_meta( $post_id, 'qualified_lead_paid_at', true ) ) {
		if ( ! get_post_meta( $post_id, 'qualified_lead_billed_at', true ) ) {
			update_post_meta( $post_id, 'qualified_lead_billed_at', current_time( 'mysql' ) );
		}
		update_post_meta( $post_id, 'qualified_lead_paid_at', current_time( 'mysql' ) );
	}
}

function justice_theme_crm_qualified_lead_billing_labels(): array {
	return array(
		'not_ready'     => 'Not ready',
		'ready_to_bill' => 'Ready to bill',
		'invoice_sent'  => 'Invoice sent',
		'paid'          => 'Paid',
		'disputed'      => 'Disputed',
		'waived'        => 'Waived',
	);
}
add_action( 'save_post_justice_lead', 'justice_theme_crm_save_lead_disposition' );

function justice_theme_crm_qualified_lead_billing_badge( int $post_id ): array {
	$revenue_model = (string) get_post_meta( $post_id, 'lead_revenue_model', true );
	if ( '' === $revenue_model ) {
		return array(
			'label'  => '-',
			'style'  => 'background:#f1f5f9;color:#334155;',
			'detail' => '',
		);
	}

	$status = (string) get_post_meta( $post_id, 'qualified_lead_billing_status', true );
	$status = $status ?: 'not_ready';
	$labels = justice_theme_crm_qualified_lead_billing_labels();
	$label  = $labels[ $status ] ?? $labels['not_ready'];
	$price  = absint( get_post_meta( $post_id, 'suggested_lead_price_ils', true ) );

	$styles = array(
		'not_ready'     => 'background:#fef3c7;color:#92400e;',
		'ready_to_bill' => 'background:#dcfce7;color:#166534;',
		'invoice_sent'  => 'background:#dbeafe;color:#1e40af;',
		'paid'          => 'background:#ecfdf5;color:#047857;',
		'disputed'      => 'background:#fee2e2;color:#991b1b;',
		'waived'        => 'background:#f1f5f9;color:#475569;',
	);

	return array(
		'label'  => $price ? sprintf( '%s - ₪%s', $label, number_format_i18n( $price ) ) : $label,
		'style'  => $styles[ $status ] ?? $styles['not_ready'],
		'detail' => str_replace( '_', ' ', $revenue_model ),
	);
}

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
				<th>Billing</th>
				<th>Response SLA</th>
				<th>Lawyer report</th>
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
				$billing = 'justice_lead' === $post_type ? justice_theme_crm_qualified_lead_billing_badge( $post_id ) : array( 'label' => '-', 'style' => 'background:#f1f5f9;color:#334155;', 'detail' => '' );
				$response_sla = 'justice_lead' === $post_type ? justice_theme_crm_response_sla_badge( $post_id, $status ) : array( 'label' => '-', 'style' => 'background:#f1f5f9;color:#334155;' );
				$prospect_url = 'justice_lead' === $post_type ? justice_theme_crm_prospect_from_lead_url( $post_id ) : '';
				$lawyer_report = 'justice_lead' === $post_type ? (string) get_post_meta( $post_id, 'latest_lawyer_follow_up_note', true ) : '';
				$lawyer_report_at = 'justice_lead' === $post_type ? (string) get_post_meta( $post_id, 'latest_lawyer_stage_update_at', true ) : '';
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
					<td>
						<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $billing['style'] ); ?>"><?php echo esc_html( $billing['label'] ); ?></span>
						<?php if ( ! empty( $billing['detail'] ) ) : ?>
							<small style="display:block;color:#646970;margin-top:3px;"><?php echo esc_html( $billing['detail'] ); ?></small>
						<?php endif; ?>
					</td>
					<td><span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:12px;<?php echo esc_attr( $response_sla['style'] ); ?>"><?php echo esc_html( $response_sla['label'] ); ?></span></td>
					<td>
						<?php if ( $lawyer_report || $lawyer_report_at ) : ?>
							<span style="display:block;max-width:220px;"><?php echo esc_html( wp_html_excerpt( $lawyer_report ?: 'Stage updated by lawyer', 110, '...' ) ); ?></span>
							<?php if ( $lawyer_report_at ) : ?>
								<small style="color:#646970;"><?php echo esc_html( $lawyer_report_at ); ?></small>
							<?php endif; ?>
						<?php else : ?>
							<span style="color:#646970;">-</span>
						<?php endif; ?>
					</td>
					<td><?php echo $source ? '<a href="' . esc_url( $source ) . '" target="_blank" rel="noopener">source</a>' : '-'; ?></td>
					<td><?php echo esc_html( get_the_date( 'd/m/Y H:i', $post_id ) ); ?></td>
					<td>
						<div style="display:flex;gap:4px;flex-wrap:wrap;min-width:180px;">
							<a class="button button-primary" href="<?php echo esc_url( get_edit_post_link( $post_id, '' ) ); ?>">Open</a>
							<?php if ( $prospect_url ) : ?>
								<a class="button" href="<?php echo esc_url( $prospect_url ); ?>">Prospect</a>
							<?php endif; ?>
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

function justice_theme_crm_prospect_from_lead_url( int $post_id ): string {
	if ( ! post_type_exists( 'justice_prospect' ) || 'justice_lead' !== get_post_type( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return '';
	}

	$url = add_query_arg(
		array(
			'post_type' => 'justice_prospect',
			'from_lead' => $post_id,
		),
		admin_url( 'post-new.php' )
	);

	return wp_nonce_url( $url, 'justice_create_prospect_from_lead_' . $post_id, 'justice_prospect_from_lead_nonce' );
}
