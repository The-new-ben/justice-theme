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
	$status_labels   = function_exists( 'justice_theme_lawyer_supplier_statuses' ) ? justice_theme_lawyer_supplier_statuses() : array();
	$revenue_labels  = function_exists( 'justice_theme_lawyer_supplier_revenue_models' ) ? justice_theme_lawyer_supplier_revenue_models() : array();
	?>
	<table class="widefat striped">
		<thead>
			<tr>
				<th>Supplier</th>
				<th>Category</th>
				<th>Revenue model</th>
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
				$revenue      = (string) get_post_meta( $post_id, 'supplier_revenue_model', true );
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
					<td><?php echo esc_html( ( $category_labels[ $category ] ?? $category ) ?: '-' ); ?></td>
					<td><?php echo esc_html( ( $revenue_labels[ $revenue ] ?? $revenue ) ?: '-' ); ?></td>
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
