<?php
/**
 * Hadmaia product handoff bridge for the public Justice lead path.
 *
 * Keeps case details out of URLs and leads while preserving the product intent:
 * court rehearsal, mediation, witness preparation or case review.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_ops_hadmaia_product_intents(): array {
	return array(
		'court_rehearsal' => array(
			'label'          => 'Court rehearsal',
			'headline'       => 'להמשיך מסימולציית דיון לבדיקה מקצועית',
			'body'           => 'אפשר להשאיר פנייה קצרה, לציין תחום ועיר, ולקבל כיוון לגבי עורך דין מתאים לבדיקת ההכנה.',
			'lead_message'   => 'סיימתי סימולציית דיון ב-Hadmaia ואשמח לבדיקה מקצועית.',
			'source_keyword' => 'בדיקה מקצועית אחרי סימולציית דיון',
		),
		'mediation'       => array(
			'label'          => 'Mediation',
			'headline'       => 'להמשיך מסימולציית גישור לבדיקה מקצועית',
			'body'           => 'אפשר לבדוק את נקודות ההסכמה, הסיכונים והצעד הבא עם גורם מקצועי מתאים.',
			'lead_message'   => 'סיימתי סימולציית גישור ב-Hadmaia ואשמח לבדיקה מקצועית.',
			'source_keyword' => 'בדיקה מקצועית אחרי סימולציית גישור',
		),
		'witness_prep'    => array(
			'label'          => 'Witness preparation',
			'headline'       => 'להמשיך מהכנת עדות לבדיקה מקצועית',
			'body'           => 'אפשר להעביר פנייה מסודרת כדי להבין אילו נקודות בעדות כדאי לחדד לפני שיחה עם עורך דין.',
			'lead_message'   => 'סיימתי הכנת עדות ב-Hadmaia ואשמח לבדיקה מקצועית.',
			'source_keyword' => 'בדיקה מקצועית אחרי הכנת עדות',
		),
		'case_review'     => array(
			'label'          => 'Case review',
			'headline'       => 'להמשיך מבדיקת סיכויים לבדיקה מקצועית',
			'body'           => 'אפשר להשאיר פנייה קצרה כדי לסדר את החוזקות, החולשות והמסמכים לפני המשך טיפול.',
			'lead_message'   => 'סיימתי בדיקת סיכויים ב-Hadmaia ואשמח לבדיקה מקצועית.',
			'source_keyword' => 'בדיקה מקצועית אחרי בדיקת סיכויים',
		),
	);
}

function justice_ops_hadmaia_normalize_product_intent( string $intent ): string {
	$intent = sanitize_key( $intent );

	return array_key_exists( $intent, justice_ops_hadmaia_product_intents() ) ? $intent : '';
}

function justice_ops_hadmaia_current_product(): array {
	foreach ( array( 'product_intent', 'utm_content' ) as $key ) {
		if ( empty( $_GET[ $key ] ) ) {
			continue;
		}

		$intent = justice_ops_hadmaia_normalize_product_intent( (string) wp_unslash( $_GET[ $key ] ) );
		if ( '' === $intent ) {
			continue;
		}

		$product                   = justice_ops_hadmaia_product_intents()[ $intent ];
		$product['product_intent'] = $intent;
		return $product;
	}

	return array();
}

add_action( 'init', function (): void {
	register_post_meta( 'justice_lead', 'product_intent', array(
		'single'            => true,
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_text_field',
		'show_in_rest'      => false,
	) );
	register_post_meta( 'justice_lead', 'utm_content', array(
		'single'            => true,
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_text_field',
		'show_in_rest'      => false,
	) );
} );

add_action( 'wp_enqueue_scripts', function (): void {
	$product = justice_ops_hadmaia_current_product();
	if ( empty( $product['product_intent'] ) ) {
		return;
	}

	$whatsapp_text = 'שלום, ' . $product['lead_message'];
	$config        = array(
		'intent'        => $product['product_intent'],
		'headline'      => $product['headline'],
		'body'          => $product['body'],
		'leadMessage'   => $product['lead_message'],
		'sourceKeyword' => $product['source_keyword'],
		'whatsappUrl'   => 'https://wa.me/972525101555?text=' . rawurlencode( $whatsapp_text ),
	);

	wp_register_style( 'justice-ops-hadmaia-review', false, array(), JUSTICE_OPS_VERSION );
	wp_enqueue_style( 'justice-ops-hadmaia-review' );
	wp_add_inline_style(
		'justice-ops-hadmaia-review',
		'.hadmaia-review-bridge{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:1.5rem;align-items:center;margin:0 0 2rem;padding:clamp(1.25rem,3vw,2rem);border:1px solid rgba(15,39,76,.14);border-radius:18px;background:linear-gradient(135deg,#f8fafc 0%,#eef4fb 52%,#fff 100%);box-shadow:0 18px 48px rgba(15,39,76,.1)}.hadmaia-review-bridge__copy span{display:inline-flex;margin-bottom:.55rem;color:#b65343;font-size:.78rem;font-weight:800;letter-spacing:.04em}.hadmaia-review-bridge__copy h2{margin:0 0 .55rem;color:#0f274c;font-size:clamp(1.35rem,2.4vw,2rem);line-height:1.25}.hadmaia-review-bridge__copy p{margin:0;color:#334155;font-size:1rem;line-height:1.7}.hadmaia-review-bridge__actions{display:flex;flex-wrap:wrap;gap:.75rem;justify-content:flex-end}.hadmaia-review-bridge__actions .button{white-space:nowrap}@media(max-width:760px){.hadmaia-review-bridge{grid-template-columns:1fr}.hadmaia-review-bridge__actions{justify-content:stretch}.hadmaia-review-bridge__actions .button{width:100%;text-align:center}}'
	);

	wp_enqueue_script(
		'justice-ops-hadmaia-review',
		plugins_url( 'assets/hadmaia-review.js', __FILE__ ),
		array(),
		JUSTICE_OPS_VERSION,
		true
	);

	add_action( 'wp_footer', function () use ( $config ): void {
		?>
		<script type="application/json" id="justice-ops-hadmaia-review-config">
		<?php echo wp_json_encode( $config, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT ); ?>
		</script>
		<?php
	}, 5 );
}, 75 );

add_action( 'save_post_justice_lead', function ( int $post_id, WP_Post $post, bool $update ): void {
	unset( $post, $update );

	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}

	$intent = '';
	if ( isset( $_POST['product_intent'] ) ) {
		$intent = justice_ops_hadmaia_normalize_product_intent( (string) wp_unslash( $_POST['product_intent'] ) );
	}
	if ( '' === $intent ) {
		$current = justice_ops_hadmaia_normalize_product_intent( (string) get_post_meta( $post_id, 'product_intent', true ) );
		if ( '' === $current ) {
			return;
		}
		$intent = $current;
	}

	$product = justice_ops_hadmaia_product_intents()[ $intent ];
	update_post_meta( $post_id, 'product_intent', $intent );
	update_post_meta( $post_id, 'lead_source_surface', 'hadmaia_professional_review' );
	update_post_meta( $post_id, 'source_channel', 'hadmaia_professional_review' );
	update_post_meta( $post_id, 'lead_revenue_model', 'hadmaia_professional_review' );
	if ( '' === (string) get_post_meta( $post_id, 'source_keyword', true ) ) {
		update_post_meta( $post_id, 'source_keyword', $product['source_keyword'] );
	}
	if ( '' === (string) get_post_meta( $post_id, 'owner_revenue_next_step', true ) ) {
		update_post_meta( $post_id, 'owner_revenue_next_step', 'Hadmaia professional-review request: call or WhatsApp the visitor, confirm the simulation purpose and legal area, then decide whether to sell a paid review, mediation preparation, witness preparation or lawyer handoff.' );
	}
	if ( '' === (string) get_post_meta( $post_id, 'lead_revenue_notes', true ) ) {
		update_post_meta( $post_id, 'lead_revenue_notes', 'Hadmaia professional-review lead. Confirm consent, legal area and whether the visitor wants a paid review, preparation session, mediation path or lawyer handoff.' );
	}
}, 20, 3 );
