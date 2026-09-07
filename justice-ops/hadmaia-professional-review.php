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

function justice_ops_hadmaia_bridge_html( array $product ): string {
	$primary_url = add_query_arg(
		array(
			'lead_source_surface' => 'hadmaia_professional_review',
			'product_intent'      => $product['product_intent'],
			'utm_source'          => 'jus-tice.com',
			'utm_medium'          => 'product_handoff',
			'utm_campaign'        => 'professional_review',
			'source_keyword'      => $product['source_keyword'],
		),
		home_url( '/' )
	) . '#ask-lawyer';

	$whatsapp_text = 'שלום, ' . $product['lead_message'];
	$whatsapp_url  = 'https://wa.me/972525101555?text=' . rawurlencode( $whatsapp_text );

	return '<section class="hadmaia-review-bridge" aria-label="המשך מסימולציה לבדיקה מקצועית">'
		. '<div class="hadmaia-review-bridge__copy">'
		. '<span class="hadmaia-review-bridge__eyebrow">הגעתם מסימולציית Hadmaia</span>'
		. '<h2>' . esc_html( $product['headline'] ) . '</h2>'
		. '<p>' . esc_html( $product['body'] ) . '</p>'
		. '<div class="hadmaia-review-bridge__chips" aria-label="מה אפשר לבדוק עכשיו">'
		. '<span>בדיקת סיכונים</span>'
		. '<span>הכנה לשיחה</span>'
		. '<span>חיבור לגורם מתאים</span>'
		. '</div>'
		. '</div>'
		. '<div class="hadmaia-review-bridge__actions">'
		. '<a class="button button--primary" href="' . esc_url( $primary_url ) . '">השארת פנייה מסודרת</a>'
		. '<a class="button button--whatsapp-inline" target="_blank" rel="noopener" href="' . esc_url( $whatsapp_url ) . '">המשך בוואטסאפ</a>'
		. '</div>'
		. '</section>';
}

add_action( 'template_redirect', function (): void {
	$request_path = trim( (string) ( $GLOBALS['wp']->request ?? '' ), '/' );
	if ( is_admin() || 'lawyers' !== $request_path ) {
		return;
	}

	$product = justice_ops_hadmaia_current_product();
	if ( empty( $product['product_intent'] ) ) {
		return;
	}

	ob_start( function ( string $html ) use ( $product ): string {
		if ( false !== strpos( $html, 'hadmaia-review-bridge' ) ) {
			return $html;
		}

		$bridge = justice_ops_hadmaia_bridge_html( $product );
		$needle = '<div class="directory-guidance"';
		if ( false !== strpos( $html, $needle ) ) {
			return str_replace( $needle, $bridge . $needle, $html );
		}

		$needle = '<main id="primary"';
		return str_replace( $needle, $bridge . $needle, $html );
	} );
}, 1 );

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
		'.hadmaia-review-bridge{position:relative;z-index:10050;isolation:isolate;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) minmax(16rem,auto);gap:clamp(1rem,2.5vw,2rem);align-items:start;margin:0 0 clamp(2rem,5vw,3.5rem);padding:clamp(1.35rem,3.4vw,2.35rem);padding-block-end:clamp(4.5rem,7vw,5.75rem);border:1px solid rgba(15,39,76,.16);border-radius:28px;background:radial-gradient(circle at 18% 0%,rgba(34,211,238,.18),transparent 34%),linear-gradient(135deg,#fffaf2 0%,#f4f8fd 54%,#ffffff 100%);box-shadow:0 22px 60px rgba(15,39,76,.13),inset 0 1px 0 rgba(255,255,255,.78)}.hadmaia-review-bridge:before{content:"";position:absolute;inset:auto -10% -45% 42%;height:10rem;border-radius:999px;background:rgba(15,39,76,.08);filter:blur(34px);z-index:-1}.hadmaia-review-bridge__eyebrow{display:inline-flex;align-items:center;gap:.45rem;margin-bottom:.7rem;padding:.35rem .7rem;border:1px solid rgba(182,83,67,.2);border-radius:999px;background:rgba(255,255,255,.68);color:#a14537;font-size:.78rem;font-weight:900;letter-spacing:.03em}.hadmaia-review-bridge__eyebrow:before{content:"";width:.5rem;height:.5rem;border-radius:50%;background:#1f8f6b;box-shadow:0 0 0 5px rgba(31,143,107,.12)}.hadmaia-review-bridge__copy h2{margin:0 0 .6rem;color:#0f274c;font-size:clamp(1.45rem,2.55vw,2.15rem);line-height:1.2;letter-spacing:-.02em}.hadmaia-review-bridge__copy p{max-width:46rem;margin:0;color:#334155;font-size:1.02rem;line-height:1.75}.hadmaia-review-bridge__chips{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}.hadmaia-review-bridge__chips span{padding:.45rem .7rem;border:1px solid rgba(15,39,76,.12);border-radius:999px;background:rgba(255,255,255,.62);color:#18365f;font-size:.86rem;font-weight:800}.hadmaia-review-bridge__actions{position:relative;z-index:2;display:flex;flex-direction:column;gap:.75rem;justify-content:flex-start;align-items:stretch}.hadmaia-review-bridge__actions .button{width:100%;min-width:12.5rem;padding:.9rem 1.1rem;border-radius:999px;text-align:center;white-space:nowrap;box-shadow:0 10px 24px rgba(15,39,76,.12)}.hadmaia-review-bridge__actions .button--whatsapp-inline{background:#25d366!important;color:#062c18!important;border-color:#25d366!important}@media(max-width:880px){.hadmaia-review-bridge{grid-template-columns:1fr;padding-bottom:calc(clamp(1.35rem,3.4vw,2.35rem) + 5.5rem)}.hadmaia-review-bridge__actions{display:grid;grid-template-columns:1fr 1fr}.hadmaia-review-bridge__actions .button{min-width:0;white-space:normal}}@media(max-width:560px){.hadmaia-review-bridge{border-radius:22px;margin-bottom:5.5rem}.hadmaia-review-bridge__actions{grid-template-columns:1fr}.hadmaia-review-bridge__copy p{font-size:.98rem}.hadmaia-review-bridge__chips span{font-size:.82rem}}'
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
