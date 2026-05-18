<?php
/**
 * Admin-only unserved demand ledger.
 *
 * Unserved demand means a real user asked for a lawyer category or country
 * where Jus-Tice does not yet have a paying/routing partner. These records
 * stay inside the existing justice_lead CRM so owner calls become measurable
 * demand and lawyer-recruitment proof instead of disappearing into memory.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_unserved_demand_register_meta(): void {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return;
	}

	$fields = array(
		'service_status',
		'requested_area_raw',
		'requested_country',
		'requested_city',
		'requested_language',
		'matter_urgency',
		'lead_source_channel',
		'source_landing_url',
		'consent_to_follow_up',
		'unserved_reason',
		'follow_up_deadline',
		'owner_next_action',
		'recruitment_priority',
		'revenue_status',
		'source_type',
	);

	foreach ( $fields as $key ) {
		register_post_meta(
			'justice_lead',
			$key,
			array(
				'single'            => true,
				'type'              => 'string',
				'sanitize_callback' => 'sanitize_text_field',
				'show_in_rest'      => false,
			)
		);
	}
}
add_action( 'init', 'justice_theme_unserved_demand_register_meta', 12 );

function justice_theme_unserved_demand_admin_menu(): void {
	add_submenu_page(
		'justice-crm',
		'Unserved Demand',
		'Unserved Demand',
		'edit_pages',
		'justice-unserved-demand',
		'justice_theme_render_unserved_demand_admin_page'
	);
}
add_action( 'admin_menu', 'justice_theme_unserved_demand_admin_menu', 20 );

function justice_theme_render_unserved_demand_admin_page(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to access this page.', 'justice-theme' ) );
	}

	$created = isset( $_GET['created'] ) ? absint( $_GET['created'] ) : 0;
	$stats   = justice_theme_unserved_demand_stats();
	$leads   = justice_theme_unserved_demand_query( 20 );
	?>
	<div class="wrap">
		<h1>Unserved Demand</h1>
		<p>Owner-only ledger for calls and requests where Jus-Tice has user demand but no matching paying/routing lawyer yet.</p>

		<?php if ( $created ) : ?>
			<div class="notice notice-success is-dismissible">
				<p>Unserved lead logged. <a href="<?php echo esc_url( get_edit_post_link( $created, '' ) ); ?>">Open the lead record</a>.</p>
			</div>
		<?php endif; ?>

		<?php if ( ! post_type_exists( 'justice_lead' ) ) : ?>
			<div class="notice notice-error inline">
				<p><strong>Blocked:</strong> the <code>justice_lead</code> post type is not active. The ledger cannot create records yet.</p>
			</div>
			<?php return; ?>
		<?php endif; ?>

		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:18px 0;">
			<?php foreach ( $stats as $label => $value ) : ?>
				<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:14px;">
					<strong style="display:block;font-size:24px;"><?php echo esc_html( (string) $value ); ?></strong>
					<span><?php echo esc_html( $label ); ?></span>
				</div>
			<?php endforeach; ?>
		</div>

		<p>
			<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_export_unserved_demand' ), 'justice_export_unserved_demand' ) ); ?>">Export CSV</a>
		</p>

		<h2>Partner Recruitment Proof</h2>
		<p>Use this table when contacting lawyers: it shows where Jus-Tice already has demand but no paying/routing partner.</p>
		<?php justice_theme_unserved_demand_render_recruitment_summary(); ?>

		<div style="display:grid;grid-template-columns:minmax(280px,420px) 1fr;gap:24px;align-items:start;">
			<div style="background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:16px;">
				<h2 style="margin-top:0;">Quick Log Phone Lead</h2>
				<?php justice_theme_unserved_demand_render_quick_log_form(); ?>
			</div>

			<div>
				<h2>Recent Unserved Demand</h2>
				<?php justice_theme_unserved_demand_render_table( $leads ); ?>
			</div>
		</div>
	</div>
	<?php
}

function justice_theme_unserved_demand_render_quick_log_form(): void {
	$action = admin_url( 'admin-post.php' );
	?>
	<form method="post" action="<?php echo esc_url( $action ); ?>">
		<input type="hidden" name="action" value="justice_log_unserved_lead">
		<?php wp_nonce_field( 'justice_log_unserved_lead', 'justice_log_unserved_lead_nonce' ); ?>

		<p>
			<label for="unserved-name"><strong>Caller name</strong></label>
			<input id="unserved-name" name="visitor_name" type="text" class="regular-text" style="width:100%;" placeholder="Optional if unknown">
		</p>
		<p>
			<label for="unserved-phone"><strong>Phone</strong></label>
			<input id="unserved-phone" name="visitor_phone" type="tel" class="regular-text" style="width:100%;" required>
		</p>
		<p>
			<label for="unserved-email"><strong>Email / WhatsApp</strong></label>
			<input id="unserved-email" name="visitor_email" type="text" class="regular-text" style="width:100%;" placeholder="Optional">
		</p>
		<p>
			<label for="unserved-area"><strong>Requested area</strong></label>
			<input id="unserved-area" name="requested_area_raw" type="text" class="regular-text" style="width:100%;" placeholder="Example: Thailand lawyer" required>
		</p>
		<p>
			<label for="unserved-country"><strong>Country / jurisdiction</strong></label>
			<input id="unserved-country" name="requested_country" type="text" class="regular-text" style="width:100%;" placeholder="Example: Thailand">
		</p>
		<p>
			<label for="unserved-urgency"><strong>Urgency</strong></label>
			<select id="unserved-urgency" name="matter_urgency" style="width:100%;">
				<option value="normal">Normal</option>
				<option value="high">High / today</option>
				<option value="low">Low / research</option>
			</select>
		</p>
		<p>
			<label for="unserved-source"><strong>Landing page / source</strong></label>
			<input id="unserved-source" name="source_landing_url" type="url" class="regular-text" style="width:100%;" placeholder="Optional URL">
		</p>
		<p>
			<label for="unserved-summary"><strong>One-sentence summary</strong></label>
			<textarea id="unserved-summary" name="message" rows="4" style="width:100%;" required></textarea>
		</p>
		<p>
			<label>
				<input type="checkbox" name="consent_to_follow_up" value="yes">
				Caller agreed to follow-up
			</label>
		</p>
		<p>
			<label for="unserved-action"><strong>Owner next action</strong></label>
			<input id="unserved-action" name="owner_next_action" type="text" class="regular-text" style="width:100%;" value="Recruit matching lawyer / follow up caller">
		</p>
		<p>
			<button type="submit" class="button button-primary">Log Unserved Lead</button>
		</p>
	</form>
	<?php
}

function justice_theme_handle_unserved_lead_log(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to log leads.', 'justice-theme' ) );
	}

	$nonce = isset( $_POST['justice_log_unserved_lead_nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['justice_log_unserved_lead_nonce'] ) ) : '';
	if ( ! $nonce || ! wp_verify_nonce( $nonce, 'justice_log_unserved_lead' ) ) {
		wp_die( esc_html__( 'Security check failed.', 'justice-theme' ) );
	}

	if ( ! post_type_exists( 'justice_lead' ) ) {
		wp_die( esc_html__( 'justice_lead post type is not active.', 'justice-theme' ) );
	}

	$name             = isset( $_POST['visitor_name'] ) ? sanitize_text_field( wp_unslash( $_POST['visitor_name'] ) ) : '';
	$phone            = isset( $_POST['visitor_phone'] ) ? sanitize_text_field( wp_unslash( $_POST['visitor_phone'] ) ) : '';
	$email            = isset( $_POST['visitor_email'] ) ? sanitize_text_field( wp_unslash( $_POST['visitor_email'] ) ) : '';
	$requested_area   = isset( $_POST['requested_area_raw'] ) ? sanitize_text_field( wp_unslash( $_POST['requested_area_raw'] ) ) : '';
	$country          = isset( $_POST['requested_country'] ) ? sanitize_text_field( wp_unslash( $_POST['requested_country'] ) ) : '';
	$urgency          = isset( $_POST['matter_urgency'] ) ? sanitize_key( wp_unslash( $_POST['matter_urgency'] ) ) : 'normal';
	$source_url       = isset( $_POST['source_landing_url'] ) ? esc_url_raw( wp_unslash( $_POST['source_landing_url'] ) ) : '';
	$message          = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';
	$owner_action     = isset( $_POST['owner_next_action'] ) ? sanitize_text_field( wp_unslash( $_POST['owner_next_action'] ) ) : '';
	$consent          = isset( $_POST['consent_to_follow_up'] ) ? 'yes' : 'no';
	$allowed_urgency  = array( 'low', 'normal', 'high' );

	if ( ! in_array( $urgency, $allowed_urgency, true ) ) {
		$urgency = 'normal';
	}

	if ( '' === $phone || '' === $requested_area || '' === $message ) {
		wp_die( esc_html__( 'Phone, requested area and summary are required.', 'justice-theme' ) );
	}

	$title_bits = array_filter( array( $name ?: 'Unknown caller', $requested_area, $country ) );
	$post_id    = wp_insert_post(
		array(
			'post_type'    => 'justice_lead',
			'post_status'  => 'private',
			'post_title'   => 'Unserved: ' . implode( ' - ', $title_bits ),
			'post_content' => $message,
		),
		true
	);

	if ( is_wp_error( $post_id ) || ! $post_id ) {
		wp_die( esc_html__( 'Could not create the unserved lead record.', 'justice-theme' ) );
	}

	$meta = array(
		'visitor_name'         => $name,
		'visitor_phone'        => $phone,
		'visitor_email'        => is_email( $email ) ? $email : '',
		'message'              => $message,
		'requested_area_raw'   => $requested_area,
		'requested_country'    => $country,
		'matter_urgency'       => $urgency,
		'urgency'              => $urgency,
		'lead_source_channel'  => 'phone',
		'source_landing_url'   => $source_url,
		'source_url'           => $source_url,
		'consent_to_follow_up' => $consent,
		'service_status'       => 'unserved',
		'lead_status'          => 'unserved',
		'unserved_reason'      => 'no_partner',
		'owner_next_action'    => $owner_action,
		'recruitment_priority' => 'review',
		'revenue_status'       => 'partner_recruitment_open',
		'source_type'          => 'owner_phone_log',
		'follow_up_deadline'   => justice_theme_unserved_follow_up_deadline( $urgency ),
		'routing_notes'        => 'Owner logged phone demand where no matching paying/routing lawyer exists yet.',
	);

	foreach ( $meta as $key => $value ) {
		update_post_meta( $post_id, $key, $value );
	}

	wp_safe_redirect(
		add_query_arg(
			array(
				'page'    => 'justice-unserved-demand',
				'created' => $post_id,
			),
			admin_url( 'admin.php' )
		)
	);
	exit;
}
add_action( 'admin_post_justice_log_unserved_lead', 'justice_theme_handle_unserved_lead_log' );

function justice_theme_mark_lead_unserved( int $lead_id, string $reason = 'no_partner', string $notes = '' ): void {
	if ( ! $lead_id || 'justice_lead' !== get_post_type( $lead_id ) ) {
		return;
	}

	$urgency = get_post_meta( $lead_id, 'urgency', true ) ?: get_post_meta( $lead_id, 'matter_urgency', true ) ?: 'normal';

	update_post_meta( $lead_id, 'service_status', 'unserved' );
	update_post_meta( $lead_id, 'lead_status', 'unserved' );
	update_post_meta( $lead_id, 'unserved_reason', sanitize_key( $reason ) ?: 'no_partner' );
	update_post_meta( $lead_id, 'revenue_status', 'partner_recruitment_open' );
	update_post_meta( $lead_id, 'recruitment_priority', 'review' );
	update_post_meta( $lead_id, 'follow_up_deadline', justice_theme_unserved_follow_up_deadline( (string) $urgency ) );

	if ( $notes ) {
		update_post_meta( $lead_id, 'routing_notes', sanitize_text_field( $notes ) );
	}
}

function justice_theme_unserved_follow_up_deadline( string $urgency ): string {
	$timestamp = 'high' === $urgency ? time() + HOUR_IN_SECONDS : strtotime( 'tomorrow 17:00' );

	if ( ! $timestamp ) {
		$timestamp = time() + DAY_IN_SECONDS;
	}

	return wp_date( 'Y-m-d H:i:s', $timestamp );
}

function justice_theme_unserved_demand_query( int $limit ): WP_Query {
	return new WP_Query(
		array(
			'post_type'      => 'justice_lead',
			'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
			'posts_per_page' => $limit,
			'orderby'        => 'date',
			'order'          => 'DESC',
			'meta_query'     => array(
				array(
					'key'   => 'service_status',
					'value' => 'unserved',
				),
			),
		)
	);
}

function justice_theme_unserved_demand_stats(): array {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return array(
			'Unserved total' => 0,
			'This month'     => 0,
			'High urgency'   => 0,
			'Partner gaps'   => 0,
		);
	}

	$query = justice_theme_unserved_demand_query( 200 );
	$month = gmdate( 'Y-m' );
	$areas = array();
	$total = 0;
	$this_month = 0;
	$urgent = 0;

	foreach ( $query->posts as $post_item ) {
		$post_id = $post_item instanceof WP_Post ? $post_item->ID : (int) $post_item;
		$total++;
		$post_month = get_the_date( 'Y-m', $post_id );
		if ( $month === $post_month ) {
			$this_month++;
		}

		$urgency = get_post_meta( $post_id, 'matter_urgency', true ) ?: get_post_meta( $post_id, 'urgency', true );
		if ( 'high' === $urgency ) {
			$urgent++;
		}

		$area = get_post_meta( $post_id, 'requested_area_raw', true ) ?: get_post_meta( $post_id, 'legal_area', true ) ?: 'unknown';
		$areas[ $area ] = true;
	}

	wp_reset_postdata();

	return array(
		'Unserved total' => $total,
		'This month'     => $this_month,
		'High urgency'   => $urgent,
		'Partner gaps'   => count( $areas ),
	);
}

function justice_theme_unserved_demand_summary_rows(): array {
	if ( ! post_type_exists( 'justice_lead' ) ) {
		return array();
	}

	$query = justice_theme_unserved_demand_query( 200 );
	$rows  = array();

	foreach ( $query->posts as $post_item ) {
		$post_id = $post_item instanceof WP_Post ? $post_item->ID : (int) $post_item;
		$demand  = get_post_meta( $post_id, 'requested_area_raw', true ) ?: get_post_meta( $post_id, 'legal_area', true ) ?: 'unknown';
		$country = get_post_meta( $post_id, 'requested_country', true ) ?: 'unknown';
		$key     = sanitize_key( $demand . '-' . $country );

		if ( ! isset( $rows[ $key ] ) ) {
			$rows[ $key ] = array(
				'demand'       => $demand,
				'country'      => $country,
				'count'        => 0,
				'high_urgency' => 0,
				'latest'       => '',
				'sources'      => array(),
			);
		}

		$rows[ $key ]['count']++;

		$urgency = get_post_meta( $post_id, 'matter_urgency', true ) ?: get_post_meta( $post_id, 'urgency', true );
		if ( 'high' === $urgency ) {
			$rows[ $key ]['high_urgency']++;
		}

		$date = get_the_date( 'Y-m-d', $post_id );
		if ( ! $rows[ $key ]['latest'] || $date > $rows[ $key ]['latest'] ) {
			$rows[ $key ]['latest'] = $date;
		}

		$source = get_post_meta( $post_id, 'lead_source_channel', true ) ?: 'unknown';
		if ( ! isset( $rows[ $key ]['sources'][ $source ] ) ) {
			$rows[ $key ]['sources'][ $source ] = 0;
		}
		$rows[ $key ]['sources'][ $source ]++;
	}

	wp_reset_postdata();

	usort(
		$rows,
		static function ( array $a, array $b ): int {
			if ( $a['count'] === $b['count'] ) {
				return strcmp( $b['latest'], $a['latest'] );
			}

			return $b['count'] <=> $a['count'];
		}
	);

	return array_slice( $rows, 0, 10 );
}

function justice_theme_unserved_demand_render_recruitment_summary(): void {
	$rows = justice_theme_unserved_demand_summary_rows();

	if ( empty( $rows ) ) {
		echo '<div class="notice notice-info inline"><p>No recruitment proof yet. Log the next unserved phone call to start building evidence.</p></div>';
		return;
	}
	?>
	<table class="widefat striped" style="margin-bottom:24px;">
		<thead>
			<tr>
				<th>Demand</th>
				<th>Country</th>
				<th>Requests</th>
				<th>High urgency</th>
				<th>Sources</th>
				<th>Latest</th>
				<th>Sales line</th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ( $rows as $row ) : ?>
				<?php
				$sources = array();
				foreach ( $row['sources'] as $source => $count ) {
					$sources[] = $source . ' x' . $count;
				}
				$sales_line = sprintf(
					'Jus-Tice already received %d request(s) for %s%s and has no active partner yet.',
					(int) $row['count'],
					$row['demand'],
					'unknown' !== $row['country'] ? ' / ' . $row['country'] : ''
				);
				?>
				<tr>
					<td><?php echo esc_html( $row['demand'] ); ?></td>
					<td><?php echo esc_html( $row['country'] ); ?></td>
					<td><?php echo esc_html( (string) $row['count'] ); ?></td>
					<td><?php echo esc_html( (string) $row['high_urgency'] ); ?></td>
					<td><?php echo esc_html( implode( ', ', $sources ) ); ?></td>
					<td><?php echo esc_html( $row['latest'] ?: '-' ); ?></td>
					<td><?php echo esc_html( $sales_line ); ?></td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
	<?php
}

function justice_theme_unserved_demand_render_table( WP_Query $leads ): void {
	if ( ! $leads->have_posts() ) {
		echo '<div class="notice notice-info inline"><p>No unserved demand logged yet.</p></div>';
		return;
	}
	?>
	<table class="widefat striped">
		<thead>
			<tr>
				<th>Caller</th>
				<th>Phone</th>
				<th>Demand</th>
				<th>Country</th>
				<th>Urgency</th>
				<th>Follow-up</th>
				<th>Revenue status</th>
				<th>Date</th>
				<th>Action</th>
			</tr>
		</thead>
		<tbody>
			<?php while ( $leads->have_posts() ) : $leads->the_post(); ?>
				<?php
				$post_id = get_the_ID();
				$name    = get_post_meta( $post_id, 'visitor_name', true ) ?: get_the_title();
				$phone   = get_post_meta( $post_id, 'visitor_phone', true );
				$demand  = get_post_meta( $post_id, 'requested_area_raw', true ) ?: get_post_meta( $post_id, 'legal_area', true ) ?: '-';
				$country = get_post_meta( $post_id, 'requested_country', true ) ?: '-';
				$urgency = get_post_meta( $post_id, 'matter_urgency', true ) ?: get_post_meta( $post_id, 'urgency', true ) ?: 'normal';
				$follow  = get_post_meta( $post_id, 'follow_up_deadline', true ) ?: '-';
				$revenue = get_post_meta( $post_id, 'revenue_status', true ) ?: 'none';
				?>
				<tr>
					<td><strong><?php echo esc_html( $name ); ?></strong></td>
					<td><?php echo $phone ? '<a href="tel:' . esc_attr( preg_replace( '/[^0-9+]/', '', $phone ) ) . '">' . esc_html( $phone ) . '</a>' : '-'; ?></td>
					<td><?php echo esc_html( $demand ); ?></td>
					<td><?php echo esc_html( $country ); ?></td>
					<td><?php echo esc_html( $urgency ); ?></td>
					<td><?php echo esc_html( $follow ); ?></td>
					<td><?php echo esc_html( $revenue ); ?></td>
					<td><?php echo esc_html( get_the_date( 'd/m/Y H:i', $post_id ) ); ?></td>
					<td><a class="button button-primary" href="<?php echo esc_url( get_edit_post_link( $post_id, '' ) ); ?>">Open</a></td>
				</tr>
			<?php endwhile; ?>
		</tbody>
	</table>
	<?php
	wp_reset_postdata();
}

function justice_theme_export_unserved_demand_csv(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to export leads.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_export_unserved_demand' );

	$leads = justice_theme_unserved_demand_query( 500 );
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename=jus-tice-unserved-demand-' . gmdate( 'Y-m-d' ) . '.csv' );

	$output = fopen( 'php://output', 'w' );
	if ( ! $output ) {
		exit;
	}

	fputcsv( $output, array( 'id', 'date', 'caller', 'phone', 'email', 'demand', 'country', 'urgency', 'source', 'follow_up_deadline', 'revenue_status', 'summary' ) );

	foreach ( $leads->posts as $post_item ) {
		$post_id = $post_item instanceof WP_Post ? $post_item->ID : (int) $post_item;
		fputcsv(
			$output,
			array(
				$post_id,
				get_the_date( 'c', $post_id ),
				get_post_meta( $post_id, 'visitor_name', true ),
				get_post_meta( $post_id, 'visitor_phone', true ),
				get_post_meta( $post_id, 'visitor_email', true ),
				get_post_meta( $post_id, 'requested_area_raw', true ) ?: get_post_meta( $post_id, 'legal_area', true ),
				get_post_meta( $post_id, 'requested_country', true ),
				get_post_meta( $post_id, 'matter_urgency', true ) ?: get_post_meta( $post_id, 'urgency', true ),
				get_post_meta( $post_id, 'source_landing_url', true ) ?: get_post_meta( $post_id, 'source_url', true ),
				get_post_meta( $post_id, 'follow_up_deadline', true ),
				get_post_meta( $post_id, 'revenue_status', true ),
				get_post_meta( $post_id, 'message', true ) ?: get_post_field( 'post_content', $post_id ),
			)
		);
	}

	fclose( $output );
	exit;
}
add_action( 'admin_post_justice_export_unserved_demand', 'justice_theme_export_unserved_demand_csv' );
