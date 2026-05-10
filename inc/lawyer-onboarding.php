<?php
/**
 * Lawyer self-registration funnel.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_handle_lawyer_registration(): void {
	if ( ! isset( $_POST['justice_lawyer_registration_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['justice_lawyer_registration_nonce'] ) ), 'justice_lawyer_registration' ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'failed', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	if ( ! empty( $_POST['website_url_confirm'] ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'sent', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'blocked', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	$name       = isset( $_POST['lawyer_full_name'] ) ? sanitize_text_field( wp_unslash( $_POST['lawyer_full_name'] ) ) : '';
	$firm       = isset( $_POST['firm_name'] ) ? sanitize_text_field( wp_unslash( $_POST['firm_name'] ) ) : '';
	$bar_number = isset( $_POST['bar_number'] ) ? sanitize_text_field( wp_unslash( $_POST['bar_number'] ) ) : '';
	$phone      = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';
	$email      = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$whatsapp   = isset( $_POST['whatsapp'] ) ? sanitize_text_field( wp_unslash( $_POST['whatsapp'] ) ) : '';
	$website    = isset( $_POST['website'] ) ? esc_url_raw( wp_unslash( $_POST['website'] ) ) : '';
	$languages  = isset( $_POST['languages'] ) ? sanitize_text_field( wp_unslash( $_POST['languages'] ) ) : '';
	$cities     = isset( $_POST['cities_served'] ) ? sanitize_text_field( wp_unslash( $_POST['cities_served'] ) ) : '';
	$bio        = isset( $_POST['bio_short'] ) ? sanitize_textarea_field( wp_unslash( $_POST['bio_short'] ) ) : '';
	$headline   = isset( $_POST['profile_headline'] ) ? sanitize_text_field( wp_unslash( $_POST['profile_headline'] ) ) : '';
	$services   = isset( $_POST['profile_services'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_services'] ) ) : '';
	$process    = isset( $_POST['profile_process'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_process'] ) ) : '';
	$video_url  = isset( $_POST['profile_video_url'] ) ? esc_url_raw( wp_unslash( $_POST['profile_video_url'] ) ) : '';
	$faqs       = isset( $_POST['profile_faqs'] ) ? sanitize_textarea_field( wp_unslash( $_POST['profile_faqs'] ) ) : '';
	$area       = isset( $_POST['practice_area'] ) ? sanitize_key( wp_unslash( $_POST['practice_area'] ) ) : '';
	$plan       = isset( $_POST['plan_interest'] ) ? sanitize_key( wp_unslash( $_POST['plan_interest'] ) ) : 'free';

	if ( ! $name || ! $phone || ! $email || empty( $_POST['consent'] ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'missing', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	$post_id = wp_insert_post( array(
		'post_type'    => 'justice_lawyer',
		'post_status'  => 'draft',
		'post_title'   => $name,
		'post_excerpt' => $bio,
		'post_content' => $bio,
	) );

	if ( ! $post_id || is_wp_error( $post_id ) ) {
		wp_safe_redirect( add_query_arg( 'registration', 'failed', home_url( '/lawyer-registration/' ) ) );
		exit;
	}

	$meta = array(
		'lawyer_full_name'     => $name,
		'firm_name'            => $firm,
		'bar_number'           => $bar_number,
		'phone'                => $phone,
		'email'                => $email,
		'whatsapp'             => $whatsapp,
		'website'              => $website,
		'languages'            => $languages,
		'cities_served'        => $cities,
		'bio_short'            => $bio,
		'profile_headline'     => $headline,
		'profile_subheadline'  => $bio,
		'profile_services'     => $services,
		'profile_process'      => $process,
		'profile_video_url'    => $video_url,
		'profile_faqs'         => $faqs,
		'plan_type'            => in_array( $plan, array( 'free', 'pro', 'featured', 'lead_partner', 'full_service' ), true ) ? $plan : 'free',
		'subscription_status'  => 'pending',
		'verification_status'  => 'pending',
		'profile_status'       => 'pending',
		'claimed_by_user_id'   => is_user_logged_in() ? get_current_user_id() : 0,
		'source_type'          => 'registration',
		'lead_routing_enabled' => false,
		'internal_notes'       => 'Self-registration submission. Review license, identity, content, ethics and commercial plan before publishing.',
	);

	foreach ( $meta as $key => $value ) {
		update_post_meta( $post_id, $key, $value );
	}

	if ( $area && taxonomy_exists( 'practice-areas' ) ) {
		wp_set_object_terms( $post_id, $area, 'practice-areas', false );
	}

	justice_theme_assign_registration_city_terms( $post_id, $cities );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_registration', 'New lawyer registration draft: ' . $name );
	}

	justice_theme_notify_lawyer_registration( $post_id, $meta );

	wp_safe_redirect( add_query_arg( 'registration', 'sent', home_url( '/lawyer-registration/' ) ) );
	exit;
}
add_action( 'admin_post_justice_lawyer_registration', 'justice_theme_handle_lawyer_registration' );
add_action( 'admin_post_nopriv_justice_lawyer_registration', 'justice_theme_handle_lawyer_registration' );

function justice_theme_assign_registration_city_terms( int $post_id, string $cities ): void {
	if ( ! taxonomy_exists( 'city' ) || '' === trim( $cities ) ) {
		return;
	}

	$city_map = array(
		'תל אביב'     => 'tel-aviv',
		'ת"א'         => 'tel-aviv',
		'תל-אביב'     => 'tel-aviv',
		'ירושלים'     => 'jerusalem',
		'חיפה'         => 'haifa',
		'ראשון לציון' => 'rishon-lezion',
		'פתח תקווה'   => 'petah-tikva',
		'אשדוד'       => 'ashdod',
		'נתניה'       => 'netanya',
		'באר שבע'     => 'beer-sheva',
		'חולון'       => 'holon',
		'בני ברק'     => 'bnei-brak',
		'רמת גן'      => 'ramat-gan',
		'אשקלון'      => 'ashkelon',
		'רחובות'      => 'rehovot',
		'בת ים'       => 'bat-yam',
		'הרצליה'      => 'herzliya',
		'כפר סבא'     => 'kfar-saba',
		'מודיעין'     => 'modiin',
		'נצרת'        => 'nazareth',
		'לוד'          => 'lod',
		'רמלה'        => 'ramla',
	);

	$parts = preg_split( '/[,،;|]+/u', $cities ) ?: array();
	$slugs = array();

	foreach ( $parts as $part ) {
		$city = trim( $part );
		if ( '' === $city ) {
			continue;
		}

		$slug = $city_map[ $city ] ?? sanitize_title( $city );
		$term = get_term_by( 'slug', $slug, 'city' );

		if ( ! $term && isset( $city_map[ $city ] ) ) {
			$inserted = wp_insert_term( $city, 'city', array( 'slug' => $slug ) );
			if ( ! is_wp_error( $inserted ) ) {
				$term = get_term_by( 'id', (int) $inserted['term_id'], 'city' );
			}
		}

		if ( $term && ! is_wp_error( $term ) ) {
			$slugs[] = $term->slug;
		}
	}

	if ( ! empty( $slugs ) ) {
		wp_set_object_terms( $post_id, array_values( array_unique( $slugs ) ), 'city', false );
	}
}

function justice_theme_notify_lawyer_registration( int $post_id, array $meta ): void {
	$admin_email = get_option( 'admin_email' );

	if ( ! $admin_email || ! is_email( $admin_email ) ) {
		return;
	}

	$subject = 'New lawyer registration pending review';
	$message = sprintf(
		"New lawyer registration draft is waiting for review.\n\nName: %s\nFirm: %s\nPhone: %s\nEmail: %s\nPlan interest: %s\nHeadline: %s\nVideo: %s\n\nReview: %s",
		$meta['lawyer_full_name'] ?: '-',
		$meta['firm_name'] ?: '-',
		$meta['phone'] ?: '-',
		$meta['email'] ?: '-',
		$meta['plan_type'] ?: '-',
		$meta['profile_headline'] ?: '-',
		$meta['profile_video_url'] ?: '-',
		admin_url( 'post.php?post=' . $post_id . '&action=edit' )
	);

	wp_mail( $admin_email, $subject, $message );
}

function justice_theme_seed_lawyer_registration_page(): void {
	if ( ! current_user_can( 'manage_options' ) || get_option( 'justice_lawyer_registration_page_seeded_v1' ) ) {
		return;
	}

	if ( get_page_by_path( 'lawyer-registration', OBJECT, 'page' ) ) {
		update_option( 'justice_lawyer_registration_page_seeded_v1', 1, false );
		return;
	}

	wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_name'    => 'lawyer-registration',
		'post_title'   => 'הצטרפות עורכי דין',
		'post_content' => '',
		'meta_input'   => array(
			'_wp_page_template' => 'page-lawyer-registration.php',
		),
	) );

	update_option( 'justice_lawyer_registration_page_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_lawyer_registration_page' );

function justice_theme_lawyer_onboarding_admin_menu(): void {
	add_menu_page(
		'Lawyer Onboarding',
		'Lawyer Onboarding',
		'edit_pages',
		'justice-lawyer-onboarding',
		'justice_theme_render_lawyer_onboarding_admin_page',
		'dashicons-businessperson',
		26
	);
}
add_action( 'admin_menu', 'justice_theme_lawyer_onboarding_admin_menu' );

function justice_theme_append_lawyer_internal_note( int $post_id, string $note ): void {
	$existing = trim( (string) get_post_meta( $post_id, 'internal_notes', true ) );
	$entry    = sprintf( '[%s] %s', current_time( 'mysql' ), $note );

	update_post_meta( $post_id, 'internal_notes', trim( $existing . "\n" . $entry ) );
}

function justice_theme_apply_lawyer_profile_update(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to apply this update.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_apply_lawyer_profile_update_' . $post_id );

	$field_map = array(
		'pending_profile_headline'  => 'profile_headline',
		'pending_profile_services'  => 'profile_services',
		'pending_profile_process'   => 'profile_process',
		'pending_profile_video_url' => 'profile_video_url',
		'pending_profile_faqs'      => 'profile_faqs',
	);

	foreach ( $field_map as $pending_key => $public_key ) {
		$value = get_post_meta( $post_id, $pending_key, true );
		if ( '' !== trim( (string) $value ) ) {
			update_post_meta( $post_id, $public_key, $value );
		}
		delete_post_meta( $post_id, $pending_key );
	}

	delete_post_meta( $post_id, 'pending_profile_review' );
	delete_post_meta( $post_id, 'pending_profile_submitted_at' );
	update_post_meta( $post_id, 'profile_status', 'update_applied_pending_final_review' );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner applied staged mini-site update; final public review still required.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_profile_update_applied', 'Applied pending lawyer profile update: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'profile_update', 'applied', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_apply_lawyer_profile_update', 'justice_theme_apply_lawyer_profile_update' );

function justice_theme_discard_lawyer_profile_update(): void {
	$post_id = isset( $_GET['lawyer_id'] ) ? absint( $_GET['lawyer_id'] ) : 0;

	if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
		wp_die( esc_html__( 'You do not have permission to discard this update.', 'justice-theme' ) );
	}

	check_admin_referer( 'justice_discard_lawyer_profile_update_' . $post_id );

	$pending_keys = array(
		'pending_profile_headline',
		'pending_profile_services',
		'pending_profile_process',
		'pending_profile_video_url',
		'pending_profile_faqs',
		'pending_profile_review',
		'pending_profile_submitted_at',
	);

	foreach ( $pending_keys as $key ) {
		delete_post_meta( $post_id, $key );
	}

	update_post_meta( $post_id, 'profile_status', 'update_rejected_no_public_change' );
	justice_theme_append_lawyer_internal_note( $post_id, 'Owner discarded staged mini-site update; public profile fields were not changed.' );

	if ( function_exists( 'uje_log' ) ) {
		uje_log( 'lawyer_profile_update_discarded', 'Discarded pending lawyer profile update: ' . get_the_title( $post_id ) );
	}

	wp_safe_redirect( add_query_arg( 'profile_update', 'discarded', admin_url( 'admin.php?page=justice-lawyer-onboarding' ) ) );
	exit;
}
add_action( 'admin_post_justice_discard_lawyer_profile_update', 'justice_theme_discard_lawyer_profile_update' );

function justice_theme_render_lawyer_onboarding_admin_page(): void {
	if ( ! current_user_can( 'edit_pages' ) ) {
		wp_die( esc_html__( 'You do not have permission to access this page.', 'justice-theme' ) );
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		?>
		<div class="wrap">
			<h1>Lawyer Onboarding</h1>
			<p><strong>BLOCKED:</strong> `justice_lawyer` post type is not active. Verify the Justice plugin.</p>
		</div>
		<?php
		return;
	}

	$pending = new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 50,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			'relation' => 'OR',
			array(
				'key'   => 'source_type',
				'value' => 'registration',
			),
			array(
				'key'   => 'pending_profile_review',
				'value' => '1',
			),
		),
	) );
	?>
	<div class="wrap">
		<h1>Lawyer Onboarding</h1>
		<p>Pending lawyer self-registration submissions and staged profile update requests. Review identity, license, claims, practice areas, public content and commercial plan before publishing or applying updates.</p>
		<?php if ( isset( $_GET['profile_update'] ) && 'applied' === $_GET['profile_update'] ) : ?>
			<div class="notice notice-success is-dismissible"><p>Pending mini-site update applied. Review the full profile before final public approval.</p></div>
		<?php elseif ( isset( $_GET['profile_update'] ) && 'discarded' === $_GET['profile_update'] ) : ?>
			<div class="notice notice-warning is-dismissible"><p>Pending mini-site update discarded. Public profile fields were not changed.</p></div>
		<?php endif; ?>

		<?php if ( $pending->have_posts() ) : ?>
			<table class="widefat striped">
				<thead>
					<tr>
						<th>Name</th>
						<th>Firm</th>
						<th>Phone</th>
						<th>Email</th>
						<th>Plan</th>
						<th>Mini-site Content</th>
						<th>Pending Update</th>
						<th>Recent Notes</th>
						<th>Status</th>
						<th>Submitted</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<?php while ( $pending->have_posts() ) : $pending->the_post(); ?>
						<?php
						$post_id = get_the_ID();
						$status  = get_post_meta( $post_id, 'profile_status', true ) ?: get_post_status( $post_id );
						$has_pending_update = '1' === (string) get_post_meta( $post_id, 'pending_profile_review', true );
						$mini_fields = array(
							'Headline' => get_post_meta( $post_id, 'profile_headline', true ),
							'Services' => get_post_meta( $post_id, 'profile_services', true ),
							'Process'  => get_post_meta( $post_id, 'profile_process', true ),
							'Video'    => get_post_meta( $post_id, 'profile_video_url', true ),
							'FAQ'      => get_post_meta( $post_id, 'profile_faqs', true ),
						);
						$pending_fields = array(
							'Headline' => get_post_meta( $post_id, 'pending_profile_headline', true ),
							'Services' => get_post_meta( $post_id, 'pending_profile_services', true ),
							'Process'  => get_post_meta( $post_id, 'pending_profile_process', true ),
							'Video'    => get_post_meta( $post_id, 'pending_profile_video_url', true ),
							'FAQ'      => get_post_meta( $post_id, 'pending_profile_faqs', true ),
						);
						$internal_notes = trim( (string) get_post_meta( $post_id, 'internal_notes', true ) );
						$recent_notes   = array_slice( array_filter( array_map( 'trim', explode( "\n", $internal_notes ) ) ), -3 );
						?>
						<tr>
							<td><strong><?php echo esc_html( get_the_title() ); ?></strong></td>
							<td><?php echo esc_html( get_post_meta( $post_id, 'firm_name', true ) ?: '-' ); ?></td>
							<td><?php echo esc_html( get_post_meta( $post_id, 'phone', true ) ?: '-' ); ?></td>
							<td><?php echo esc_html( get_post_meta( $post_id, 'email', true ) ?: '-' ); ?></td>
							<td><?php echo esc_html( get_post_meta( $post_id, 'plan_type', true ) ?: '-' ); ?></td>
							<td>
								<?php if ( $has_pending_update ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:#fff3cd;color:#7a4b00;font-size:12px;">Pending update review</span>
								<?php endif; ?>
								<?php foreach ( $mini_fields as $label => $value ) : ?>
									<span style="display:inline-block;margin:0 0 4px 4px;padding:2px 7px;border-radius:999px;background:<?php echo $value ? '#e7f7ed' : '#f1f1f1'; ?>;color:<?php echo $value ? '#17643a' : '#666'; ?>;font-size:12px;">
										<?php echo esc_html( $label . ': ' . ( $value ? 'YES' : 'NO' ) ); ?>
									</span>
								<?php endforeach; ?>
							</td>
							<td>
								<?php if ( $has_pending_update ) : ?>
									<?php foreach ( $pending_fields as $label => $value ) : ?>
										<?php if ( $value ) : ?>
											<p style="margin:0 0 6px;"><strong><?php echo esc_html( $label ); ?>:</strong> <?php echo esc_html( wp_html_excerpt( (string) $value, 120, '...' ) ); ?></p>
										<?php endif; ?>
									<?php endforeach; ?>
								<?php else : ?>
									-
								<?php endif; ?>
							</td>
							<td>
								<?php if ( $recent_notes ) : ?>
									<?php foreach ( $recent_notes as $note ) : ?>
										<p style="margin:0 0 6px;"><?php echo esc_html( wp_html_excerpt( $note, 140, '...' ) ); ?></p>
									<?php endforeach; ?>
								<?php else : ?>
									-
								<?php endif; ?>
							</td>
							<td><?php echo esc_html( $status ); ?></td>
							<td><?php echo esc_html( get_the_date() ); ?></td>
							<td>
								<a class="button button-primary" href="<?php echo esc_url( get_edit_post_link( $post_id, '' ) ); ?>">Review</a>
								<?php if ( $has_pending_update ) : ?>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_apply_lawyer_profile_update&lawyer_id=' . $post_id ), 'justice_apply_lawyer_profile_update_' . $post_id ) ); ?>">Apply pending update</a>
									<a class="button" href="<?php echo esc_url( wp_nonce_url( admin_url( 'admin-post.php?action=justice_discard_lawyer_profile_update&lawyer_id=' . $post_id ), 'justice_discard_lawyer_profile_update_' . $post_id ) ); ?>">Discard pending update</a>
								<?php endif; ?>
							</td>
						</tr>
					<?php endwhile; ?>
				</tbody>
			</table>
			<?php wp_reset_postdata(); ?>
		<?php else : ?>
			<div class="notice notice-info inline">
				<p>No pending lawyer self-registration drafts found.</p>
			</div>
		<?php endif; ?>
	</div>
	<?php
}
