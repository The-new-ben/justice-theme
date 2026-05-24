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

function justice_theme_paid_lawyer_plan_keys(): array {
	return array( 'pro', 'featured', 'lead_partner', 'full_service' );
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
	foreach ( justice_theme_paid_lawyer_plan_keys() as $plan_key ) {
		if ( justice_theme_plan_checkout_ready( $plan_key ) ) {
			return true;
		}
	}

	return false;
}

function justice_theme_plan_pre_checkout_url( string $plan_key ): string {
	return add_query_arg(
		array(
			'plan_interest' => $plan_key,
			'pre_checkout'  => '1',
			'payment_path'  => 'manual_invoice',
		),
		home_url( '/checkout/' )
	);
}

function justice_theme_plan_checkout_url( string $plan_key ): string {
	$product_id = justice_theme_plan_product_id( $plan_key );

	if ( $product_id && justice_theme_plan_checkout_ready( $plan_key ) ) {
		return add_query_arg( 'add-to-cart', $product_id, wc_get_checkout_url() );
	}

	if ( 'free' !== $plan_key ) {
		return justice_theme_plan_pre_checkout_url( $plan_key );
	}

	return add_query_arg(
		array(
			'plan_interest' => $plan_key,
			'pre_checkout'  => '1',
		),
		home_url( '/lawyer-registration/' )
	);
}

function justice_theme_plan_manual_activation_url( string $plan_key ): string {
	return add_query_arg(
		array(
			'plan_interest' => $plan_key,
			'pre_checkout'  => '1',
			'payment_path'  => 'manual_invoice',
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

function justice_theme_register_lawyer_plan_payment_admin_page(): void {
	add_submenu_page(
		'justice-lawyer-onboarding',
		'Lawyer Plan Payments',
		'Plan Payments',
		'manage_options',
		'justice-lawyer-plan-payments',
		'justice_theme_render_lawyer_plan_payment_admin_page'
	);
}
add_action( 'admin_menu', 'justice_theme_register_lawyer_plan_payment_admin_page' );

function justice_theme_handle_lawyer_plan_payment_admin_save(): void {
	if ( ! isset( $_POST['justice_lawyer_plan_product_ids_nonce'] ) ) {
		return;
	}

	if (
		! current_user_can( 'manage_options' ) ||
		! wp_verify_nonce(
			sanitize_text_field( wp_unslash( $_POST['justice_lawyer_plan_product_ids_nonce'] ) ),
			'justice_lawyer_plan_product_ids'
		)
	) {
		return;
	}

	$product_ids = array();
	$posted_ids  = isset( $_POST['justice_lawyer_plan_product_ids'] ) && is_array( $_POST['justice_lawyer_plan_product_ids'] )
		? wp_unslash( $_POST['justice_lawyer_plan_product_ids'] )
		: array();

	foreach ( justice_theme_paid_lawyer_plan_keys() as $plan_key ) {
		$product_ids[ $plan_key ] = isset( $posted_ids[ $plan_key ] ) ? absint( $posted_ids[ $plan_key ] ) : 0;
	}

	update_option( 'justice_lawyer_plan_product_ids', $product_ids, false );

	add_settings_error(
		'justice_lawyer_plan_product_ids',
		'justice_lawyer_plan_product_ids_saved',
		'Lawyer plan product mapping saved.',
		'updated'
	);
}
add_action( 'admin_init', 'justice_theme_handle_lawyer_plan_payment_admin_save' );

function justice_theme_lawyer_plan_product_status( string $plan_key ): array {
	$product_id = justice_theme_plan_product_id( $plan_key );

	$status = array(
		'product_id'       => $product_id,
		'title'            => '',
		'edit_url'         => '',
		'product_type'     => '',
		'post_status'      => '',
		'is_purchasable'   => false,
		'is_subscription'  => false,
		'checkout_ready'   => justice_theme_plan_checkout_ready( $plan_key ),
		'message'          => '',
	);

	if ( ! $product_id ) {
		$status['message'] = 'Missing product ID.';
		return $status;
	}

	if ( ! function_exists( 'wc_get_product' ) ) {
		$status['message'] = 'WooCommerce product API is not available.';
		return $status;
	}

	$product = wc_get_product( $product_id );

	if ( ! $product ) {
		$status['message'] = 'Product ID was not found.';
		return $status;
	}

	$status['title']          = $product->get_name();
	$status['edit_url']       = get_edit_post_link( $product_id, '' ) ?: '';
	$status['product_type']   = $product->get_type();
	$status['post_status']    = get_post_status( $product_id ) ?: '';
	$status['is_purchasable'] = $product->is_purchasable();

	if ( class_exists( 'WC_Subscriptions_Product' ) && method_exists( 'WC_Subscriptions_Product', 'is_subscription' ) ) {
		$status['is_subscription'] = (bool) WC_Subscriptions_Product::is_subscription( $product );
	} else {
		$status['is_subscription'] = in_array( $product->get_type(), array( 'subscription', 'variable-subscription', 'subscription_variation' ), true );
	}

	if ( ! $status['is_subscription'] ) {
		$status['message'] = 'Product exists, but is not detected as a subscription product.';
	} elseif ( ! $status['is_purchasable'] ) {
		$status['message'] = 'Product exists, but is not purchasable.';
	} elseif ( ! $status['checkout_ready'] ) {
		$status['message'] = 'Product exists, but checkout readiness is still incomplete.';
	} else {
		$status['message'] = 'Ready for checkout.';
	}

	return $status;
}

function justice_theme_lawyer_plan_payment_requirement_rows(): array {
	$gateway_ids = array();

	if ( function_exists( 'WC' ) && WC() && method_exists( WC(), 'payment_gateways' ) && WC()->payment_gateways() ) {
		$available_gateways = WC()->payment_gateways()->payment_gateways();

		foreach ( $available_gateways as $gateway_id => $gateway ) {
			if ( ! empty( $gateway->enabled ) && 'yes' === $gateway->enabled ) {
				$gateway_ids[] = (string) $gateway_id;
			}
		}
	}

	return array(
		array(
			'label' => 'WooCommerce active',
			'ready' => function_exists( 'wc_get_checkout_url' ) && function_exists( 'wc_get_product' ),
			'note'  => function_exists( 'wc_get_checkout_url' ) ? 'Checkout API available.' : 'Install/activate WooCommerce before product mapping can work.',
		),
		array(
			'label' => 'WooCommerce Subscriptions active',
			'ready' => class_exists( 'WC_Subscriptions' ) || function_exists( 'wcs_get_subscriptions' ) || class_exists( 'WC_Subscriptions_Product' ),
			'note'  => 'Required for monthly recurring lawyer plans.',
		),
		array(
			'label' => 'Enabled payment gateways',
			'ready' => ! empty( $gateway_ids ),
			'note'  => empty( $gateway_ids ) ? 'No enabled gateway detected yet.' : implode( ', ', $gateway_ids ),
		),
	);
}

function justice_theme_lawyer_plan_payment_readiness_summary( array $requirement_rows ): array {
	$product_statuses = array();
	$ready_products   = 0;
	$missing_products = 0;

	foreach ( justice_theme_paid_lawyer_plan_keys() as $plan_key ) {
		$product_statuses[ $plan_key ] = justice_theme_lawyer_plan_product_status( $plan_key );

		if ( ! empty( $product_statuses[ $plan_key ]['checkout_ready'] ) ) {
			$ready_products++;
		}

		if ( empty( $product_statuses[ $plan_key ]['product_id'] ) ) {
			$missing_products++;
		}
	}

	$total_products     = count( justice_theme_paid_lawyer_plan_keys() );
	$requirements_ready = true;
	$requirement_gaps   = array();

	foreach ( $requirement_rows as $row ) {
		if ( empty( $row['ready'] ) ) {
			$requirements_ready = false;
			$requirement_gaps[] = (string) $row['label'];
		}
	}

	$automatic_ready     = $requirements_ready && $ready_products === $total_products;
	$registration_ready  = file_exists( JUSTICE_THEME_DIR . '/page-lawyer-registration.php' );
	$manual_bridge_ready = $registration_ready;
	$next_action         = 'Keep selling through manual invoices, then activate lawyers only after payment confirmation.';

	if ( $automatic_ready ) {
		$next_action = 'Automatic checkout appears ready. Run a controlled checkout smoke test before sending paid traffic.';
	} elseif ( ! $requirements_ready ) {
		$next_action = 'Finish the missing recurring-payment requirement: ' . implode( ', ', $requirement_gaps ) . '.';
	} elseif ( $missing_products > 0 ) {
		$next_action = 'Create the missing monthly subscription products and paste their IDs below.';
	} elseif ( $ready_products < $total_products ) {
		$next_action = 'Fix the mapped products that are not yet subscription/purchasable checkout products.';
	}

	return array(
		'automatic_ready'     => $automatic_ready,
		'manual_bridge_ready' => $manual_bridge_ready,
		'ready_products'      => $ready_products,
		'total_products'      => $total_products,
		'missing_products'    => $missing_products,
		'requirement_gaps'    => $requirement_gaps,
		'product_statuses'    => $product_statuses,
		'next_action'         => $next_action,
	);
}

function justice_theme_render_lawyer_plan_payment_admin_page(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'You do not have permission to manage lawyer plan payments.', 'justice-theme' ) );
	}

	$plans            = justice_theme_lawyer_plans();
	$requirement_rows = justice_theme_lawyer_plan_payment_requirement_rows();
	$readiness        = justice_theme_lawyer_plan_payment_readiness_summary( $requirement_rows );
	$invoice_queue_url = add_query_arg(
		array(
			'page'          => 'justice-lawyer-onboarding',
			'payment_queue' => 'invoice_requested',
		),
		admin_url( 'admin.php' )
	);
	$manual_signup_url = justice_theme_plan_manual_activation_url( 'lead_partner' );
	?>
	<div class="wrap">
		<h1>Lawyer Plan Payments</h1>
		<p>This screen prepares the four paid lawyer plans for WooCommerce Subscriptions and the Grow/Morning gateway. It does not charge anyone.</p>

		<?php settings_errors( 'justice_lawyer_plan_product_ids' ); ?>

		<h2>Owner Revenue Status</h2>
		<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;max-width:1180px;margin:14px 0 22px;">
			<div style="border:1px solid <?php echo $readiness['automatic_ready'] ? '#bbd7b8' : '#f0c36d'; ?>;background:<?php echo $readiness['automatic_ready'] ? '#f4fff3' : '#fffaf0'; ?>;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:18px;">Recurring checkout</strong>
				<span><?php echo $readiness['automatic_ready'] ? 'Ready for controlled smoke test' : 'Blocked'; ?></span>
			</div>
			<div style="border:1px solid <?php echo $readiness['manual_bridge_ready'] ? '#bbd7b8' : '#f4b4b4'; ?>;background:<?php echo $readiness['manual_bridge_ready'] ? '#f4fff3' : '#fff5f5'; ?>;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:18px;">Manual invoice selling</strong>
				<span><?php echo $readiness['manual_bridge_ready'] ? 'Available now' : 'Blocked'; ?></span>
			</div>
			<div style="border:1px solid #d6e4ff;background:#f7faff;border-radius:8px;padding:14px;">
				<strong style="display:block;font-size:18px;">Mapped checkout products</strong>
				<span><?php echo esc_html( number_format_i18n( $readiness['ready_products'] ) . '/' . number_format_i18n( $readiness['total_products'] ) ); ?> ready</span>
			</div>
		</div>
		<div style="max-width:1180px;border:1px solid #d6e4ff;background:#f7faff;border-radius:8px;padding:14px 16px;margin:0 0 24px;">
			<p style="margin:0 0 8px;"><strong>Next owner action:</strong> <?php echo esc_html( $readiness['next_action'] ); ?></p>
			<p style="margin:0;">
				<a class="button button-primary" href="<?php echo esc_url( $invoice_queue_url ); ?>">Open invoice queue</a>
				<a class="button" href="<?php echo esc_url( $manual_signup_url ); ?>" target="_blank" rel="noopener">Test manual paid signup</a>
			</p>
		</div>

		<h2>Activation Readiness</h2>
		<table class="widefat striped" style="max-width: 980px;">
			<thead>
				<tr>
					<th scope="col">Requirement</th>
					<th scope="col">Status</th>
					<th scope="col">Details</th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ( $requirement_rows as $row ) : ?>
					<tr>
						<td><?php echo esc_html( $row['label'] ); ?></td>
						<td><?php echo $row['ready'] ? 'Ready' : 'Missing'; ?></td>
						<td><?php echo esc_html( $row['note'] ); ?></td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>

		<form method="post" style="margin-top: 24px;">
			<?php wp_nonce_field( 'justice_lawyer_plan_product_ids', 'justice_lawyer_plan_product_ids_nonce' ); ?>
			<h2>Paid Plan Product Mapping</h2>
			<p>Create each plan as a published monthly subscription product, then paste its product ID here.</p>
			<table class="widefat striped" style="max-width: 1180px;">
				<thead>
					<tr>
						<th scope="col">Plan</th>
						<th scope="col">Public price</th>
						<th scope="col">Product ID</th>
						<th scope="col">Product status</th>
						<th scope="col">Checkout URL</th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( justice_theme_paid_lawyer_plan_keys() as $plan_key ) : ?>
						<?php
						$plan            = $plans[ $plan_key ] ?? array();
						$override        = justice_theme_lawyer_plan_public_overrides( $plan_key );
						$product_status  = justice_theme_lawyer_plan_product_status( $plan_key );
						$checkout_url    = justice_theme_plan_checkout_url( $plan_key );
						$product_details = array_filter(
							array(
								$product_status['title'],
								$product_status['product_type'] ? 'type: ' . $product_status['product_type'] : '',
								$product_status['post_status'] ? 'status: ' . $product_status['post_status'] : '',
							)
						);
						?>
						<tr>
							<td>
								<strong><?php echo esc_html( $plan['label'] ?? $plan_key ); ?></strong><br>
								<code><?php echo esc_html( $plan_key ); ?></code>
							</td>
							<td><?php echo esc_html( $override['price'] ?? ( $plan['price'] ?? '' ) ); ?></td>
							<td>
								<input
									type="number"
									min="0"
									name="justice_lawyer_plan_product_ids[<?php echo esc_attr( $plan_key ); ?>]"
									value="<?php echo esc_attr( (string) $product_status['product_id'] ); ?>"
									style="width: 120px;"
								>
							</td>
							<td>
								<strong><?php echo $product_status['checkout_ready'] ? 'Ready' : 'Not ready'; ?></strong><br>
								<?php echo esc_html( $product_status['message'] ); ?>
								<?php if ( $product_details ) : ?>
									<br><small><?php echo esc_html( implode( ' | ', $product_details ) ); ?></small>
								<?php endif; ?>
								<?php if ( $product_status['edit_url'] ) : ?>
									<br><a href="<?php echo esc_url( $product_status['edit_url'] ); ?>">Edit product</a>
								<?php endif; ?>
							</td>
							<td>
								<a href="<?php echo esc_url( $checkout_url ); ?>" target="_blank" rel="noopener">Open checkout path</a>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>

			<?php submit_button( 'Save product mapping' ); ?>
		</form>

		<h2>Post-Grow Approval Checklist</h2>
		<ol>
			<li>Create four published monthly subscription products in WooCommerce: Pro, Featured, Lead Partner, and Full Service.</li>
			<li>Use the approved prices including VAT: 349, 749, 1490, and 2490 ILS per month.</li>
			<li>Enable the Grow/Morning gateway only after account approval and gateway connection are complete.</li>
			<li>Paste the four product IDs above and verify every row says Ready.</li>
			<li>Run sandbox or controlled live smoke test before selling to the first lawyer.</li>
		</ol>
	</div>
	<?php
}
