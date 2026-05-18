<?php
/**
 * Admin settings: map plan keys → WooCommerce product IDs.
 *
 * Lets the site owner connect each lawyer plan (pro, featured, lead_partner,
 * full_service) to a WooCommerce Subscription product, without editing PHP or
 * the wp_options table by hand. The option name kept identical to the existing
 * helper `justice_theme_plan_product_id()` so the rest of the theme works
 * unchanged the moment a mapping is saved.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const JUSTICE_LAWYER_PLAN_PRODUCT_OPTION = 'justice_lawyer_plan_product_ids';

function justice_theme_lawyer_plans_admin_menu(): void {
	add_options_page(
		'Jus-Tice Lawyer Plans',
		'Lawyer Plans',
		'manage_options',
		'justice-lawyer-plans',
		'justice_theme_lawyer_plans_admin_render'
	);
}
add_action( 'admin_menu', 'justice_theme_lawyer_plans_admin_menu' );

function justice_theme_lawyer_plans_admin_register(): void {
	register_setting(
		'justice_lawyer_plans',
		JUSTICE_LAWYER_PLAN_PRODUCT_OPTION,
		array(
			'type'              => 'array',
			'sanitize_callback' => 'justice_theme_lawyer_plans_admin_sanitize',
			'default'           => array(),
		)
	);
}
add_action( 'admin_init', 'justice_theme_lawyer_plans_admin_register' );

function justice_theme_lawyer_plans_admin_sanitize( $input ): array {
	if ( ! is_array( $input ) ) {
		return array();
	}

	$allowed = array_keys( justice_theme_lawyer_plans() );
	$clean   = array();

	foreach ( $allowed as $plan_key ) {
		if ( 'free' === $plan_key ) {
			continue; // Free plan never maps to a paid product.
		}
		$value = isset( $input[ $plan_key ] ) ? absint( $input[ $plan_key ] ) : 0;
		if ( $value > 0 ) {
			$clean[ $plan_key ] = $value;
		}
	}

	return $clean;
}

function justice_theme_lawyer_plans_admin_render(): void {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$mapping        = (array) get_option( JUSTICE_LAWYER_PLAN_PRODUCT_OPTION, array() );
	$plans          = justice_theme_lawyer_plans();
	$wc_active      = function_exists( 'wc_get_product' );
	$wcs_active     = class_exists( 'WC_Subscriptions' ) || function_exists( 'wcs_get_subscription' );
	?>
	<div class="wrap">
		<h1>Jus-Tice Lawyer Plans → WooCommerce Products</h1>
		<p>Map each paid lawyer plan to a WooCommerce (Subscriptions) product. When a lawyer clicks a plan CTA on <code>/lawyer-plans/</code>, the theme appends <code>add-to-cart=&lt;product_id&gt;</code> to the WooCommerce checkout. Plans without a mapping fall back to <code>/lawyer-registration/?plan_interest=...</code>.</p>

		<table class="widefat" style="max-width:720px;margin-bottom:16px;">
			<tbody>
				<tr>
					<th>WooCommerce active</th>
					<td><?php echo $wc_active ? '<span style="color:#166534;">YES</span>' : '<span style="color:#991b1b;">NO — install &amp; activate WooCommerce</span>'; ?></td>
				</tr>
				<tr>
					<th>WooCommerce Subscriptions active</th>
					<td><?php echo $wcs_active ? '<span style="color:#166534;">YES</span>' : '<span style="color:#991b1b;">NO — install WooCommerce Subscriptions for recurring billing</span>'; ?></td>
				</tr>
				<tr>
					<th>Payment gateway recommended</th>
					<td>Meshulam-Grow (ILS, supports recurring) + Morning (Green Invoice) for auto tax-invoices.</td>
				</tr>
			</tbody>
		</table>

		<form method="post" action="options.php">
			<?php settings_fields( 'justice_lawyer_plans' ); ?>

			<table class="form-table" role="presentation">
				<tbody>
				<?php foreach ( $plans as $plan_key => $plan ) :
					if ( 'free' === $plan_key ) {
						continue;
					}
					$current = isset( $mapping[ $plan_key ] ) ? (int) $mapping[ $plan_key ] : 0;
					$product = ( $wc_active && $current ) ? wc_get_product( $current ) : null;
					?>
					<tr>
						<th scope="row">
							<label for="justice-plan-<?php echo esc_attr( $plan_key ); ?>"><?php echo esc_html( $plan['label'] ); ?></label>
							<p style="font-weight:normal;color:#646970;"><?php echo esc_html( $plan['price'] ); ?> · <?php printf( esc_html__( 'עד %d לידים בחודש', 'justice-theme' ), (int) $plan['leads_per_month'] ); ?></p>
						</th>
						<td>
							<input
								type="number"
								min="0"
								id="justice-plan-<?php echo esc_attr( $plan_key ); ?>"
								name="<?php echo esc_attr( JUSTICE_LAWYER_PLAN_PRODUCT_OPTION ); ?>[<?php echo esc_attr( $plan_key ); ?>]"
								value="<?php echo esc_attr( (string) $current ); ?>"
								style="width:120px;"
							>
							<p class="description">
								Plan key: <code><?php echo esc_html( $plan_key ); ?></code>
								<?php if ( $product ) : ?>
									· <strong><?php echo esc_html( $product->get_name() ); ?></strong>
									(<?php echo esc_html( $product->get_price_html() ?: $product->get_type() ); ?>)
								<?php elseif ( $current && $wc_active ) : ?>
									· <span style="color:#991b1b;">Product #<?php echo esc_html( (string) $current ); ?> not found in WooCommerce.</span>
								<?php endif; ?>
							</p>
						</td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>

			<?php submit_button( 'Save plan mapping' ); ?>
		</form>

		<h2>How to set up the WooCommerce products</h2>
		<ol>
			<li>Install <strong>WooCommerce</strong> + <strong>WooCommerce Subscriptions</strong>.</li>
			<li>Add the <strong>Meshulam-Grow</strong> gateway plugin (search "Grow Payments" / "Meshulam" on WordPress.org) and configure your supplier ID + API key. Enable recurring payments.</li>
			<li>For each paid plan, create a Subscription product:
				<ul style="list-style:disc;padding-right:20px;">
					<li>מיני-סייט מקצועי — ₪349 / month, no signup fee, no trial.</li>
					<li>חשיפה מוגברת — ₪749 / month.</li>
					<li>שותף לידים — ₪1,490 / month.</li>
					<li>שירות מלא — ₪2,490 / month.</li>
				</ul>
			</li>
			<li>Copy each product ID (visible in <code>Products → Edit</code>, URL contains <code>post=123</code>) into the matching field above and save.</li>
			<li>Hook up <strong>Morning (Green Invoice)</strong> via the WC plugin so every successful charge auto-issues a tax invoice.</li>
			<li>Test one signup end-to-end before going live: incognito browser, real card with ₪1 test product, refund, then publish real products.</li>
		</ol>
	</div>
	<?php
}
