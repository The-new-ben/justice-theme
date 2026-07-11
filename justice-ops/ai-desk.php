<?php
/**
 * The AI Legal Desk: the one-action front door.
 *
 * Research (GSC + competitor + design agents, 2026-07) converged on a
 * single move: collapse the complex intake into one action. Describe what
 * happened, or upload a document (a photo of a contract, a ticket, a
 * letter), and within seconds get a plain-Hebrew read: what this is, the
 * points that matter, your rights, the next steps, and, if you want it, a
 * one-tap connection to a matching lawyer. This is the Rocket Lawyer
 * upload-to-human pattern, tuned for the Israeli consumer and wrapped in
 * our iron rules.
 *
 * Guardrails, on purpose: the AI is framed as general guidance, never a
 * substitute for a lawyer (the FTC order against "robot lawyer" claims is
 * the reason), and every answer ends at a human. Uploaded content is
 * analyzed in memory and never stored. The endpoint is bot-guarded and
 * rate limited. The lawyer handoff reuses the existing lead router, so a
 * desk lead is a routed, billable lead like any other, now carrying the
 * situation summary and the asker's hiring intent (the Avvo qualifier).
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Canonical practice areas the desk can route to, aligned with the family
 * labels the whole system already uses. area_key => label, hub.
 *
 * @return array<string,array{label:string,hub:string}>
 */
function justice_desk_areas(): array {
	return array(
		'family'       => array( 'label' => 'דיני משפחה וגירושין', 'hub' => '/family-law/' ),
		'criminal-law' => array( 'label' => 'פלילי', 'hub' => '/criminal-law/' ),
		'real-estate'  => array( 'label' => 'מקרקעין ונדל"ן', 'hub' => '/real-estate/' ),
		'labor'        => array( 'label' => 'דיני עבודה', 'hub' => '/israeli-labor-law/' ),
		'nezikin'      => array( 'label' => 'נזיקין ותאונות', 'hub' => '/personal-injury/' ),
		'traffic'      => array( 'label' => 'תעבורה', 'hub' => '/traffic-law/' ),
		'inheritance'  => array( 'label' => 'ירושה וצוואות', 'hub' => '/inheritance-lawyer/' ),
		'general'      => array( 'label' => 'ייעוץ משפטי כללי', 'hub' => '/legal-help/' ),
	);
}

/**
 * Client IP for the rate limiter, proxy aware but conservative.
 */
function justice_desk_ip(): string {
	$ip = (string) ( $_SERVER['REMOTE_ADDR'] ?? '' );

	if ( ! empty( $_SERVER['HTTP_CF_CONNECTING_IP'] ) ) {
		$ip = (string) $_SERVER['HTTP_CF_CONNECTING_IP'];
	} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
		$parts = explode( ',', (string) $_SERVER['HTTP_X_FORWARDED_FOR'] );
		$ip    = trim( $parts[0] );
	}

	return sanitize_text_field( $ip );
}

/**
 * Simple per-IP hourly cap. Returns true when the caller is still allowed.
 */
function justice_desk_rate_ok(): bool {
	$key   = 'jt_desk_rl_' . md5( justice_desk_ip() );
	$count = (int) get_transient( $key );

	if ( $count >= 10 ) {
		return false;
	}

	set_transient( $key, $count + 1, HOUR_IN_SECONDS );

	return true;
}

/**
 * The iron-rule system prompt shared by both modes.
 */
function justice_desk_system_prompt(): string {
	$areas = implode( ', ', array_keys( justice_desk_areas() ) );

	return 'אתה עוזר משפטי חכם באתר ישראלי למציאת עורכי דין. אתה נותן מידע משפטי כללי בעברית פשוטה וברורה, לא ייעוץ משפטי פרטני ולא חוות דעת מחייבת. '
		. 'לעולם אל תבטיח תוצאה, אל תקבע מה יקרה בבית משפט, ואל תציג את עצמך כתחליף לעורך דין. תמיד המלץ להתייעץ עם עורך דין לפני פעולה. '
		. 'אל תמציא עובדות, סעיפי חוק או מספרים שאינם מופיעים בפניה. אם חסר מידע, אמור זאת. אל תשתמש במקפים ארוכים. כתוב ענייני, מכבד וללא הבטחות שיווקיות. '
		. 'החזר תמיד JSON תקין בלבד. שדה area_key חייב להיות אחד מהערכים הבאים בדיוק: ' . $areas . '.';
}

/**
 * Map a raw model area_key to a safe canonical one.
 */
function justice_desk_norm_area( string $key ): string {
	$areas = justice_desk_areas();

	return isset( $areas[ $key ] ) ? $key : 'general';
}

/**
 * Scrub every string in the payload through the iron-rule scrub, dropping
 * anything that trips the teller filter.
 *
 * @param mixed $value Nested value.
 * @return mixed
 */
function justice_desk_scrub( $value ) {
	if ( is_string( $value ) ) {
		$clean = function_exists( 'justice_brain_scrub' ) ? justice_brain_scrub( $value ) : $value;

		return '' === $clean ? $value : $clean;
	}

	if ( is_array( $value ) ) {
		return array_map( 'justice_desk_scrub', $value );
	}

	return $value;
}

/**
 * Build the WhatsApp handoff link carrying the situation.
 */
function justice_desk_wa( string $area_label, string $summary ): string {
	$msg = 'שלום, השתמשתי בעוזר המשפטי באתר בנושא ' . $area_label . '. ' . mb_substr( $summary, 0, 320 ) . ' אשמח לשוחח עם עורך דין מתאים.';

	return 'https://wa.me/972525101555?text=' . rawurlencode( $msg );
}

/**
 * REST: analyze a described situation or an uploaded document.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response
 */
function justice_desk_analyze( WP_REST_Request $request ) {
	// Bot floor: honeypot must be empty, and at least 2s of dwell.
	if ( '' !== trim( (string) $request->get_param( 'hp' ) ) ) {
		return new WP_REST_Response( array( 'error' => 'blocked' ), 200 );
	}

	$t0 = (int) $request->get_param( 't0' );

	if ( $t0 > 0 && ( time() - $t0 ) < 2 ) {
		return new WP_REST_Response( array( 'error' => 'too_fast' ), 200 );
	}

	if ( ! justice_desk_rate_ok() ) {
		return new WP_REST_Response( array( 'error' => 'rate', 'message' => 'בדקתם כמה פניות. נסו שוב בעוד זמן קצר או פנו ישירות לעורך דין.' ), 200 );
	}

	if ( ! function_exists( 'justice_brain_chat' ) ) {
		return new WP_REST_Response( array( 'error' => 'unavailable' ), 200 );
	}

	$mode  = 'document' === $request->get_param( 'mode' ) ? 'document' : 'describe';
	$text  = trim( (string) $request->get_param( 'text' ) );
	$image = (string) $request->get_param( 'image' );
	$text  = mb_substr( $text, 0, 8000 );

	if ( 'describe' === $mode && mb_strlen( $text ) < 8 ) {
		return new WP_REST_Response( array( 'error' => 'short', 'message' => 'ספרו קצת יותר על מה שקרה כדי שנוכל לעזור.' ), 200 );
	}

	if ( 'document' === $mode && '' === $image && mb_strlen( $text ) < 20 ) {
		return new WP_REST_Response( array( 'error' => 'no_doc', 'message' => 'העלו תמונה של המסמך או הדביקו את הטקסט שלו.' ), 200 );
	}

	$areas_list = array();

	foreach ( justice_desk_areas() as $k => $a ) {
		$areas_list[] = $k . ' (' . $a['label'] . ')';
	}

	$areas_hint = implode( ', ', $areas_list );

	if ( 'describe' === $mode ) {
		$user_prompt = 'תיאור המצב מהמשתמש: "' . $text . '"\n\n'
			. 'החזר JSON עם השדות: '
			. 'area_key (אחד מ: ' . $areas_hint . '), '
			. 'headline (כותרת קצרה של הנושא, עד 8 מילים), '
			. 'summary (2-3 משפטים שמסבירים במה מדובר), '
			. 'points (מערך של 2-4 נקודות מפתch שחשוב שהמשתמש יבין), '
			. 'rights (מערך של 1-3 זכויות או אפשרויות כלליות), '
			. 'steps (מערך של 2-4 צעדים מעשיים לצעד הבא), '
			. 'ask_lawyer (מערך של 2-3 שאלות טובות לשאול עורך דין). '
			. 'הכל בעברית פשוטה, מידע כללי בלבד.';

		$messages = array(
			array( 'role' => 'system', 'content' => justice_desk_system_prompt() ),
			array( 'role' => 'user', 'content' => str_replace( '\n', "\n", $user_prompt ) ),
		);
	} else {
		$instruction = 'זהו מסמך שמשתמש העלה (או הדביק את הטקסט שלו). קרא אותו ונתח אותו למשתמש הדיוט. '
			. ( '' !== $text ? 'טקסט המסמך: "' . $text . '". ' : '' )
			. 'החזר JSON עם השדות: '
			. 'doc_type (סוג המסמך בעברית, למשל חוזה שכירות, הסכם גירושין, כתב תביעה, דוח תנועה), '
			. 'area_key (אחד מ: ' . $areas_hint . '), '
			. 'headline (כותרת קצרה), '
			. 'summary (2-3 משפטים: מה המסמך הזה ומה המשמעות שלו), '
			. 'points (מערך 2-5 נקודות מרכזיות מתוך המסמך), '
			. 'watch (מערך 1-4 דברים לשים לב אליהם או סעיפים שכדאי לבדוק, בלי לקבוע שהם בעייתיים), '
			. 'rights (מערך 1-3 זכויות או אפשרויות כלליות), '
			. 'steps (מערך 2-4 צעדים מעשיים). '
			. 'אם לא ניתן לקרוא את המסמך, החזר summary שמסביר זאת ומבקש תמונה ברורה יותר. הכל בעברית פשוטה, מידע כללי בלבד.';

		if ( '' !== $image && 0 === strpos( $image, 'data:image' ) ) {
			$content = array(
				array( 'type' => 'text', 'text' => $instruction ),
				array( 'type' => 'image_url', 'image_url' => array( 'url' => $image ) ),
			);
		} else {
			$content = $instruction;
		}

		$messages = array(
			array( 'role' => 'system', 'content' => justice_desk_system_prompt() ),
			array( 'role' => 'user', 'content' => $content ),
		);
	}

	$raw = justice_brain_chat( $messages, array( 'json' => true, 'temperature' => 0.3, 'max_tokens' => 900, 'timeout' => 60 ) );

	if ( '' === $raw ) {
		return new WP_REST_Response( array( 'error' => 'brain', 'message' => 'לא הצלחנו לנתח כרגע. נסו שוב, או פנו ישירות לעורך דין.' ), 200 );
	}

	$data = json_decode( $raw, true );

	if ( ! is_array( $data ) ) {
		return new WP_REST_Response( array( 'error' => 'parse', 'message' => 'לא הצלחנו לנתח כרגע. נסו שוב.' ), 200 );
	}

	$area_key   = justice_desk_norm_area( (string) ( $data['area_key'] ?? 'general' ) );
	$areas      = justice_desk_areas();
	$area_label = $areas[ $area_key ]['label'];
	$hub        = $areas[ $area_key ]['hub'];

	$out = justice_desk_scrub( array(
		'mode'       => $mode,
		'doc_type'   => (string) ( $data['doc_type'] ?? '' ),
		'headline'   => (string) ( $data['headline'] ?? $area_label ),
		'summary'    => (string) ( $data['summary'] ?? '' ),
		'points'     => array_values( array_filter( (array) ( $data['points'] ?? array() ), 'is_string' ) ),
		'watch'      => array_values( array_filter( (array) ( $data['watch'] ?? array() ), 'is_string' ) ),
		'rights'     => array_values( array_filter( (array) ( $data['rights'] ?? array() ), 'is_string' ) ),
		'steps'      => array_values( array_filter( (array) ( $data['steps'] ?? array() ), 'is_string' ) ),
		'ask_lawyer' => array_values( array_filter( (array) ( $data['ask_lawyer'] ?? array() ), 'is_string' ) ),
	) );

	$out['area_key']   = $area_key;
	$out['area_label'] = $area_label;
	$out['hub']        = home_url( $hub );
	$out['wa']         = justice_desk_wa( $area_label, (string) $out['summary'] );

	return new WP_REST_Response( $out, 200 );
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/ai-desk', array(
		'methods'             => 'POST',
		'permission_callback' => '__return_true',
		'callback'            => 'justice_desk_analyze',
		'args'                => array(
			'mode'  => array( 'sanitize_callback' => 'sanitize_text_field' ),
			'text'  => array(),
			'image' => array(),
			'hp'    => array(),
			't0'    => array( 'sanitize_callback' => 'absint' ),
		),
	) );
} );

/**
 * The desk widget. Server-renders the shell, the mode tabs, the input
 * surfaces and the (hidden) handoff form with a real lead nonce; the JS
 * asset drives the analysis and reveals the result.
 */
add_shortcode( 'justice_ai_desk', function ( $atts ) {
	$atts    = shortcode_atts( array( 'compact' => '0' ), $atts );
	$compact = '1' === (string) $atts['compact'];
	$trust   = ( ! $compact && function_exists( 'justice_market_trust_strip' ) ) ? justice_market_trust_strip() : '';

	$examples = array(
		'קיבלתי דוח תנועה על מהירות ואני רוצה לדעת אם כדאי לערער',
		'המעסיק פיטר אותי בלי שימוע, מה הזכויות שלי',
		'חתמתי על חוזה שכירות ויש סעיף שלא הבנתי',
	);

	$chips = '';

	foreach ( $examples as $ex ) {
		$chips .= '<button type="button" class="jtad__chip" data-ex="' . esc_attr( $ex ) . '">' . esc_html( $ex ) . '</button>';
	}

	ob_start();
	?>
	<section class="jtad<?php echo $compact ? ' jtad--compact' : ''; ?>" id="jt-ai-desk" dir="rtl">
		<div class="jtad__intro">
			<span class="jtad__eyebrow">עוזר משפטי חכם</span>
			<h2 class="jtad__h">קבלו כיוון משפטי מיידי</h2>
			<p class="jtad__sub">ספרו מה קרה או העלו מסמך. תוך שניות תקבלו הסבר בעברית פשוטה, הנקודות שחשובות, הזכויות שלכם והצעד הבא. אם תרצו, נחבר אתכם לעורך דין מתאים.</p>
		</div>
		<?php echo $trust; // phpcs:ignore WordPress.Security.EscapeOutput ?>
		<div class="jtad__card">
			<div class="jtad__modes" role="tablist" aria-label="בחירת אופן הפנייה">
				<button type="button" class="jtad__mode is-on" role="tab" aria-selected="true" data-mode="describe" id="jtad-tab-describe" aria-controls="jtad-pane-describe"><span aria-hidden="true">✍️</span> ספרו מה קרה</button>
				<button type="button" class="jtad__mode" role="tab" aria-selected="false" data-mode="document" id="jtad-tab-document" aria-controls="jtad-pane-document"><span aria-hidden="true">📄</span> העלו מסמך</button>
			</div>

			<div class="jtad__pane" id="jtad-pane-describe" role="tabpanel" aria-labelledby="jtad-tab-describe">
				<label class="jtad__label" for="jtad-text">מה קרה?</label>
				<textarea id="jtad-text" class="jtad__text" rows="4" placeholder="לדוגמה: קיבלתי מכתב התראה לפני תביעה בנוגע לחוב, ואני לא בטוח מה לעשות" maxlength="8000"></textarea>
				<div class="jtad__chips" aria-label="דוגמאות">
					<?php echo $chips; // phpcs:ignore WordPress.Security.EscapeOutput ?>
				</div>
			</div>

			<div class="jtad__pane" id="jtad-pane-document" role="tabpanel" aria-labelledby="jtad-tab-document" hidden>
				<div class="jtad__drop" id="jtad-drop" tabindex="0" role="button" aria-label="העלאת תמונה של המסמך">
					<span class="jtad__drop-ico" aria-hidden="true">⬆️</span>
					<strong>גררו לכאן תמונה של המסמך</strong>
					<span class="jtad__drop-sub">או צלמו / בחרו קובץ. אפשר גם להדביק את הטקסט למטה.</span>
					<input type="file" id="jtad-file" accept="image/*" capture="environment" class="jtad__file">
				</div>
				<div class="jtad__preview" id="jtad-preview" hidden></div>
				<label class="jtad__label" for="jtad-doctext">או הדביקו את טקסט המסמך</label>
				<textarea id="jtad-doctext" class="jtad__text" rows="3" placeholder="הדביקו כאן את תוכן המסמך" maxlength="8000"></textarea>
			</div>

			<div class="jtad-guard" aria-hidden="true"><label>Company<input type="text" id="jtad-hp" tabindex="-1" autocomplete="off"></label></div>
			<button type="button" class="jtad__go" id="jtad-go">קבלת כיוון משפטי</button>
			<p class="jtad__legal"><span aria-hidden="true">🔒</span> בלי הרשמה, המסמך לא נשמר. זהו מידע כללי בעזרת בינה מלאכותית עם פיקוח מקצועי, ואינו תחליף לייעוץ משפטי.</p>
		</div>

		<div class="jtad__result" id="jtad-result" aria-live="polite" hidden></div>

		<form class="jtad__lead" id="jtad-lead" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" hidden>
			<input type="hidden" name="action" value="justice_submit_lead">
			<input type="hidden" name="lead_source_surface" value="ai_desk">
			<?php echo wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce', true, false ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			<div class="justice-lead-guard" aria-hidden="true" style="position:absolute;inset-inline-start:-9999px"><label>Company<input type="text" name="justice_lead_company" tabindex="-1" autocomplete="off"></label></div>
			<input type="hidden" name="justice_lead_started_at" value="<?php echo esc_attr( (string) time() ); ?>">
			<input type="hidden" name="lead_area" id="jtad-lead-area" value="general">
			<input type="hidden" name="lead_urgency" id="jtad-lead-urg" value="normal">
			<input type="hidden" name="lead_message" id="jtad-lead-msg" value="">
			<h3 class="jtad__lead-h">להמשך עם עורך דין מתאים</h3>
			<div class="jtad__intent" role="group" aria-label="מה מתאים לכם">
				<button type="button" class="jtad__pill is-on" data-intent="מעוניין להתקדם עם עורך דין">רוצה עורך דין</button>
				<button type="button" class="jtad__pill" data-intent="בשלב בדיקה, רוצה להבין אפשרויות">בשלב בדיקה</button>
			</div>
			<div class="jtad__urg" role="group" aria-label="דחיפות">
				<button type="button" class="jtad__pill is-on" data-urg="דחוף, ימים">דחוף</button>
				<button type="button" class="jtad__pill" data-urg="בשבועות הקרובים">קרוב</button>
				<button type="button" class="jtad__pill" data-urg="ללא לחץ זמן">ללא לחץ</button>
			</div>
			<p><label for="jtad-name">שם מלא</label><input type="text" id="jtad-name" name="lead_name" required></p>
			<p><label for="jtad-phone">טלפון</label><input type="tel" id="jtad-phone" name="lead_phone" required></p>
			<p><label for="jtad-city">עיר (לא חובה)</label><input type="text" id="jtad-city" name="lead_city"></p>
			<button type="submit" class="jtad__send">שליחת הפנייה</button>
		</form>
	</section>
	<?php
	return (string) ob_get_clean();
} );

add_action( 'wp_enqueue_scripts', function () {
	$qo = get_queried_object();
	$on = ( $qo instanceof WP_Post ) && (
		false !== strpos( (string) $qo->post_content, '[justice_ai_desk' ) ||
		in_array( $qo->post_name, array( 'legal-ai-desk', 'legal-help', 'legal-documents', 'legal-calculators' ), true )
	);

	if ( ! apply_filters( 'justice_desk_enqueue', $on ) ) {
		return;
	}

	wp_register_script( 'justice-ai-desk', plugins_url( 'assets/ai-desk.js', __FILE__ ), array(), JUSTICE_OPS_VERSION, true );
	wp_localize_script( 'justice-ai-desk', 'JT_DESK', array( 'endpoint' => rest_url( 'justice-ops/v1/ai-desk' ) ) );
	wp_enqueue_script( 'justice-ai-desk' );
} );

add_action( 'wp_head', function () {
	$qo = get_queried_object();
	$on = ( $qo instanceof WP_Post ) && (
		false !== strpos( (string) $qo->post_content, '[justice_ai_desk' ) ||
		in_array( $qo->post_name, array( 'legal-ai-desk', 'legal-help', 'legal-documents', 'legal-calculators' ), true )
	);

	if ( ! apply_filters( 'justice_desk_enqueue', $on ) ) {
		return;
	}

	echo '<style id="jtad-css">'
		. '.jtad{--nv:#0f1e3d;--nv2:#16294d;--gold:#e7c765;--ink:#14213d;--soft:#5a6579;--line:#e3e8f2;--ok:#1fb355;max-width:760px;margin:34px auto;font-family:inherit}'
		. '.jtad__eyebrow{display:inline-block;font-size:12.5px;font-weight:800;letter-spacing:.14em;color:#9a7b1e;text-transform:uppercase;margin-bottom:8px}'
		. '.jtad__h{font-size:clamp(24px,4.4vw,34px);line-height:1.12;color:var(--ink);margin:0 0 8px;letter-spacing:-.01em;text-wrap:balance}'
		. '.jtad__sub{color:var(--soft);font-size:16px;line-height:1.6;margin:0 0 18px;max-width:60ch}'
		. '.jtad__card{background:linear-gradient(180deg,#fff,#f9fbfe);border:1px solid var(--line);border-radius:22px;padding:20px;box-shadow:0 30px 60px -34px rgba(13,23,54,.4)}'
		. '.jtad__modes{display:flex;gap:8px;background:#eef2f9;border-radius:14px;padding:5px;margin-bottom:16px}'
		. '.jtad__mode{flex:1;border:0;background:transparent;border-radius:10px;padding:11px 10px;font-size:15px;font-weight:800;color:var(--soft);cursor:pointer;transition:all .15s}'
		. '.jtad__mode.is-on{background:var(--nv);color:#fff;box-shadow:0 8px 20px -10px rgba(15,30,61,.6)}'
		. '.jtad__label{display:block;font-weight:800;color:var(--ink);font-size:14.5px;margin:0 0 7px}'
		. '.jtad__text{width:100%;border:1.5px solid #d7deec;border-radius:14px;padding:14px;font:inherit;font-size:16px;line-height:1.55;resize:vertical;background:#fff;color:var(--ink)}'
		. '.jtad__text:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 4px rgba(231,199,101,.28)}'
		. '.jtad__chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px}'
		. '.jtad__chip{background:#f2f5fb;border:1px solid #dde3ef;border-radius:999px;padding:8px 13px;font-size:13px;color:#3b475f;cursor:pointer;text-align:start;max-width:100%;line-height:1.35}'
		. '.jtad__chip:hover{border-color:var(--gold);background:#fffdf5}'
		. '.jtad__drop{position:relative;display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center;border:2px dashed #c7d0e2;border-radius:16px;padding:26px 18px;background:#fbfcfe;color:var(--ink);cursor:pointer;transition:all .15s}'
		. '.jtad__drop:hover,.jtad__drop.is-drag{border-color:var(--gold);background:#fffdf5}'
		. '.jtad__drop:focus-visible{outline:3px solid var(--gold);outline-offset:2px}'
		. '.jtad__drop-ico{font-size:26px}'
		. '.jtad__drop strong{font-size:15.5px}'
		. '.jtad__drop-sub{font-size:13px;color:var(--soft)}'
		. '.jtad__file{position:absolute;inset:0;opacity:0;cursor:pointer}'
		. '.jtad__preview{margin:12px 0}'
		. '.jtad__preview img{max-width:100%;max-height:220px;border-radius:12px;border:1px solid var(--line)}'
		. '.jtad__preview .jtad__rm{margin-top:6px;background:#fff;border:1px solid var(--line);border-radius:8px;padding:5px 12px;font-size:12.5px;cursor:pointer;color:var(--soft)}'
		. '.jtad #jtad-pane-document .jtad__label{margin-top:14px}'
		. '.jtad-guard{position:absolute;inset-inline-start:-9999px}'
		. '.jtad__go{width:100%;margin-top:16px;background:linear-gradient(90deg,#14213d,#22345c);color:#fff;border:0;border-radius:14px;padding:16px;font-size:16.5px;font-weight:800;cursor:pointer;box-shadow:0 16px 34px -16px rgba(15,30,61,.7);transition:transform .1s}'
		. '.jtad__go:hover{transform:translateY(-1px)}.jtad__go:active{transform:translateY(0)}'
		. '.jtad__go.is-busy{opacity:.7;cursor:progress}'
		. '.jtad__go:focus-visible{outline:3px solid var(--gold);outline-offset:2px}'
		. '.jtad__legal{font-size:12.5px;color:#8a93a6;margin:12px 2px 0;line-height:1.5}'
		. '.jtad__result{margin-top:18px}'
		. '.jtad__rcard{background:#fff;border:1px solid var(--line);border-radius:18px;padding:22px;box-shadow:0 24px 50px -30px rgba(13,23,54,.4);animation:jtadIn .3s ease}'
		. '@keyframes jtadIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'
		. '.jtad__rtype{display:inline-block;background:#eef2f9;color:#3b475f;font-size:12px;font-weight:800;border-radius:999px;padding:4px 11px;margin-bottom:9px}'
		. '.jtad__rh{font-size:20px;color:var(--ink);margin:0 0 8px;line-height:1.2}'
		. '.jtad__rsum{color:#3b475f;font-size:15.5px;line-height:1.6;margin:0 0 16px}'
		. '.jtad__sec{margin:0 0 15px}'
		. '.jtad__sec h4{font-size:13px;font-weight:800;letter-spacing:.03em;color:var(--nv);margin:0 0 8px;display:flex;align-items:center;gap:7px}'
		. '.jtad__sec h4 .jtad__dot{width:8px;height:8px;border-radius:50%;background:var(--gold)}'
		. '.jtad__sec.jtad__sec--watch h4 .jtad__dot{background:#e0a92e}'
		. '.jtad__sec ul{margin:0;padding-inline-start:2px;list-style:none;display:flex;flex-direction:column;gap:7px}'
		. '.jtad__sec li{position:relative;padding-inline-start:22px;color:#3b475f;font-size:14.5px;line-height:1.5}'
		. '.jtad__sec li::before{content:"";position:absolute;inset-inline-start:4px;top:8px;width:7px;height:7px;border-radius:50%;background:#cfd7e6}'
		. '.jtad__sec--steps li::before{background:var(--ok)}'
		. '.jtad__sec--watch li::before{background:#e0a92e}'
		. '.jtad__cta{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px;padding-top:16px;border-top:1px solid var(--line)}'
		. '.jtad__cta-wa{flex:1;min-width:150px;text-align:center;background:#1fb355;color:#fff;border-radius:12px;padding:13px;font-weight:800;font-size:15px;text-decoration:none}'
		. '.jtad__cta-lead{flex:1;min-width:150px;text-align:center;background:var(--nv);color:#fff;border:0;border-radius:12px;padding:13px;font-weight:800;font-size:15px;cursor:pointer}'
		. '.jtad__cta-hub{display:inline-block;margin-top:11px;color:#7c6519;font-weight:700;font-size:13.5px;text-decoration:none}'
		. '.jtad__disc{font-size:12px;color:#98a1b3;margin:12px 0 0;line-height:1.5}'
		. '.jtad__lead{background:linear-gradient(180deg,#0f1e3d,#16294d);color:#fff;border-radius:18px;padding:22px;margin-top:16px;animation:jtadIn .3s ease}'
		. '.jtad__lead-h{margin:0 0 14px;font-size:18px;color:#fff}'
		. '.jtad__intent,.jtad__urg{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px}'
		. '.jtad__pill{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.2);color:#dce3f1;border-radius:999px;padding:8px 15px;font-size:13.5px;font-weight:700;cursor:pointer;transition:all .12s}'
		. '.jtad__pill.is-on{background:var(--gold);border-color:var(--gold);color:#14213d}'
		. '.jtad__lead label{display:block;font-size:13px;font-weight:700;color:#c3ccdd;margin:10px 0 5px}'
		. '.jtad__lead input{width:100%;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.06);border-radius:11px;padding:12px;font:inherit;font-size:16px;color:#fff}'
		. '.jtad__lead input:focus{outline:none;border-color:var(--gold);box-shadow:0 0 0 3px rgba(231,199,101,.3)}'
		. '.jtad__send{width:100%;margin-top:16px;background:var(--gold);color:#14213d;border:0;border-radius:12px;padding:15px;font-size:16px;font-weight:800;cursor:pointer}'
		. '.jtad__err{background:#fff5f5;border:1px solid #f3c9c9;color:#a13939;border-radius:12px;padding:14px;font-size:14.5px}'
		. '.jtad__load{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--line);border-radius:16px;padding:20px;color:var(--soft);font-size:15px}'
		. '.jtad__spin{width:22px;height:22px;border:3px solid #e3e8f2;border-top-color:var(--gold);border-radius:50%;animation:jtadSpin .8s linear infinite;flex:none}'
		. '@keyframes jtadSpin{to{transform:rotate(360deg)}}'
		. '@media(max-width:640px){.jtad__card{padding:16px;border-radius:18px}.jtad{margin:24px auto}}'
		. '@media(prefers-reduced-motion:reduce){.jtad__rcard,.jtad__lead{animation:none}.jtad__spin{animation-duration:1.6s}}'
		. '</style>';
}, 8 );

/**
 * Auto-create the flagship desk page.
 */
add_action( 'init', function () {
	if ( get_option( 'justice_desk_page_v1' ) ) {
		return;
	}

	if ( get_page_by_path( 'legal-ai-desk', OBJECT, 'page' ) ) {
		update_option( 'justice_desk_page_v1', 1 );
		return;
	}

	$pid = wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_title'   => 'עזרה משפטית מיידית: תיאור המצב או העלאת מסמך',
		'post_name'    => 'legal-ai-desk',
		'post_content' => '[justice_ai_desk]',
	) );

	if ( $pid && ! is_wp_error( $pid ) ) {
		update_post_meta( $pid, 'seo_title', 'עזרה משפטית מיידית עם AI: הסבר, זכויות וצעדים | Jus-Tice' );
		update_post_meta( $pid, 'seo_description', 'ספרו מה קרה או העלו מסמך וקבלו תוך שניות הסבר בעברית פשוטה, הזכויות שלכם והצעד הבא, עם אפשרות לחיבור לעורך דין מתאים. מידע כללי, לא ייעוץ משפטי.' );
		update_option( 'justice_desk_page_v1', 1 );
	}
} );
