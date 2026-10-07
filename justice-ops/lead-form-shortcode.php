<?php
/**
 * [justice_lead_form]: a lead form an editor can place inside any page.
 *
 * HAD-447 (2026-10-07). Until now the public lead form only rendered from PHP
 * templates (page-legal-pillar, practice landing, 404, trust routes), so money
 * pages built in the editor (the-recommended-family-lawyers,
 * inheritance-disputes-lawyer, greece-price-list, cyprus-prices) had no way to
 * take an inquiry.
 *
 * Usage:
 *   [justice_lead_form variant="family"]
 *   [justice_lead_form variant="family" topic="inheritance"]
 *   [justice_lead_form variant="abroad" country="greece"]
 *   [justice_lead_form variant="abroad" country="cyprus" topic="property"]
 *
 * Why REST and not admin-post.php: the classic handler (uje_handle_lead)
 * requires a WordPress nonce, and the spam guard requires a server timestamp
 * printed into the page. Both expire within a day, and these pages are served
 * from the page cache (Varnish), so a form pasted into a cached page would
 * start failing silently after 24 hours. This module therefore posts to a
 * small parallel REST route, the same pattern the appointment scheduler
 * (scheduler.php, /appt-book) already runs live: no nonce, a honeypot field,
 * a client-measured minimum fill time, a per-IP hourly limit and a short
 * duplicate window. The classic handler and every existing form are untouched.
 *
 * The lead lands on the same rail: a justice_lead post with the exact meta
 * keys uje_handle_lead writes (so the classifier, both routers, the CRM
 * screens and the HubSpot sync see it like any other lead), plus routing
 * fields (topic, country, budget, timing, language, request id, consent text).
 * Abroad leads are stored with routing_hold=1: they go to a partner abroad
 * that the owner picks by hand, never to the automatic Israeli-lawyer router.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const JUSTICE_LF_VERSION = '1.0.0';

// TODO(owner, HAD-447): final wording of both consent texts and of the
// referral-fee disclosure is the owner's decision. Until he approves, this
// version string is stored on every lead so the exact text can be traced.
const JUSTICE_LF_CONSENT_VERSION = 'draft-2026-10-07';

/**
 * Family-variant topics: key => [label, canonical lead area].
 *
 * @return array<string, array{0:string,1:string}>
 */
function justice_lf_family_topics(): array {
	return array(
		'divorce'         => array( 'גירושין', 'family-law' ),
		'alimony-custody' => array( 'מזונות ומשמורת', 'family-law' ),
		'agreement'       => array( 'הסכם ממון או הסכם גירושין', 'family-law' ),
		'inheritance'     => array( 'ירושה, צוואה או סכסוך ירושה', 'inheritance-law' ),
		'mediation'       => array( 'גישור', 'family-law' ),
		'other'           => array( 'אחר', 'family-law' ),
	);
}

/**
 * Abroad-variant needs: key => [label, canonical lead area].
 *
 * @return array<string, array{0:string,1:string}>
 */
function justice_lf_abroad_needs(): array {
	return array(
		'property'          => array( 'רכישת נכס', 'real-estate-law' ),
		'golden-visa'       => array( 'ויזת זהב או תושבות', 'general' ),
		'relocation'        => array( 'רילוקיישן', 'general' ),
		'tax'               => array( 'מיסוי', 'general' ),
		'citizenship'       => array( 'אזרחות או דרכון', 'general' ),
		'rental-management' => array( 'ניהול השכרה', 'real-estate-law' ),
	);
}

/**
 * @return array<string, string>
 */
function justice_lf_countries(): array {
	return array(
		'greece'   => 'יוון',
		'cyprus'   => 'קפריסין',
		'portugal' => 'פורטוגל',
	);
}

/**
 * @return array<string, string>
 */
function justice_lf_budgets(): array {
	return array(
		'upto-150' => 'עד 150 אלף אירו',
		'150-250'  => '150 עד 250 אלף אירו',
		'250-500'  => '250 עד 500 אלף אירו',
		'500-plus' => 'מעל 500 אלף אירו',
	);
}

/**
 * Timing choices per variant: key => [label, classic urgency value].
 *
 * @return array<string, array{0:string,1:string}>
 */
function justice_lf_timings( string $variant ): array {
	if ( 'abroad' === $variant ) {
		return array(
			'3-months' => array( 'בתוך 3 חודשים', 'normal' ),
			'1-year'   => array( 'בתוך שנה', 'low' ),
			'browsing' => array( 'רק בודק/ת בינתיים', 'low' ),
		);
	}

	return array(
		'this-week'  => array( 'השבוע', 'high' ),
		'this-month' => array( 'החודש', 'normal' ),
		'browsing'   => array( 'רק בודק/ת בינתיים', 'low' ),
	);
}

/**
 * @return array<string, string>
 */
function justice_lf_languages(): array {
	return array(
		'he' => 'עברית',
		'en' => 'English',
		'ru' => 'Русский',
		'fr' => 'Français',
	);
}

/**
 * The consent sentence shown next to the checkbox. The server stores this
 * exact text on the lead (never a client-sent copy).
 */
function justice_lf_consent_text( string $variant, string $country = '' ): string {
	if ( 'abroad' === $variant ) {
		$countries = justice_lf_countries();
		$where     = isset( $countries[ $country ] ) ? ' ב' . $countries[ $country ] : '';

		return 'אני מסכים/ה שהפרטים שלי יועברו לשותף אחד שעובד עם Jus-Tice' . $where . ', כדי שיחזור אליי עם הצעה. ידוע לי שהאתר עשוי לקבל דמי הפניה מהשותף.';
	}

	return 'אני מסכים/ה שהפרטים שלי יועברו לעורך דין שעובד עם Jus-Tice, כדי שיחזור אליי בעניין הזה. ידוע לי שהאתר עשוי לקבל תשלום על הפנייה, ושהמידע באתר אינו ייעוץ משפטי.';
}

/**
 * Normalize shortcode/request input to a known variant.
 */
function justice_lf_variant( string $value ): string {
	return 'abroad' === sanitize_key( $value ) ? 'abroad' : 'family';
}

/**
 * The page keyword for attribution, from page meta only (never from the query
 * string: the rendered page is cached and shared by every visitor).
 */
function justice_lf_page_keyword( int $post_id ): string {
	if ( ! $post_id ) {
		return '';
	}

	foreach ( array( 'primary_keyword', 'top_keyword', 'target_keyword' ) as $meta_key ) {
		$value = get_post_meta( $post_id, $meta_key, true );
		if ( is_string( $value ) && '' !== trim( $value ) ) {
			return sanitize_text_field( $value );
		}
	}

	return sanitize_text_field( get_the_title( $post_id ) );
}

/**
 * Print a <select> with a placeholder.
 *
 * @param array<string, string> $options key => label.
 */
function justice_lf_select( string $id, string $name, string $label, array $options, string $selected, bool $required ): string {
	$html  = '<p class="lead-form__field">';
	$html .= '<label for="' . esc_attr( $id ) . '">' . esc_html( $label ) . ( $required ? '' : ' <span class="jlf__opt">(רשות)</span>' ) . '</label>';
	$html .= '<select id="' . esc_attr( $id ) . '" name="' . esc_attr( $name ) . '"' . ( $required ? ' required' : '' ) . '>';
	$html .= '<option value=""' . ( '' === $selected ? ' selected' : '' ) . '>בחרו</option>';

	foreach ( $options as $value => $text ) {
		$html .= '<option value="' . esc_attr( $value ) . '"' . ( $selected === $value ? ' selected' : '' ) . '>' . esc_html( $text ) . '</option>';
	}

	return $html . '</select></p>';
}

/**
 * Render the shortcode.
 *
 * @param array<string, string>|string $atts Shortcode attributes.
 */
function justice_lf_render( $atts ): string {
	static $instance = 0;
	++$instance;

	$atts = shortcode_atts(
		array(
			'variant' => 'family',
			'country' => '',
			'topic'   => '',
			'title'   => '',
		),
		is_array( $atts ) ? $atts : array(),
		'justice_lead_form'
	);

	$variant   = justice_lf_variant( (string) $atts['variant'] );
	$countries = justice_lf_countries();
	$country   = sanitize_key( (string) $atts['country'] );
	$country   = isset( $countries[ $country ] ) ? $country : '';
	$topics    = 'abroad' === $variant ? justice_lf_abroad_needs() : justice_lf_family_topics();
	$topic     = sanitize_key( (string) $atts['topic'] );
	$topic     = isset( $topics[ $topic ] ) ? $topic : '';
	$post_id   = (int) get_queried_object_id();
	$p         = 'jlf' . $instance . '-';

	if ( '' !== trim( (string) $atts['title'] ) ) {
		$title = sanitize_text_field( (string) $atts['title'] );
	} elseif ( 'abroad' === $variant ) {
		$title = $country ? 'קבלו הצעה מותאמת ל' . $countries[ $country ] : 'קבלו הצעה מותאמת';
	} elseif ( 'inheritance' === $topic ) {
		$title = 'רוצים שעורך דין לענייני ירושה יחזור אליכם?';
	} else {
		$title = 'רוצים שעורך דין לענייני משפחה יחזור אליכם?';
	}

	$topic_labels = array();
	foreach ( $topics as $key => $row ) {
		$topic_labels[ $key ] = $row[0];
	}

	$timing_labels = array();
	foreach ( justice_lf_timings( $variant ) as $key => $row ) {
		$timing_labels[ $key ] = $row[0];
	}

	ob_start();
	?>
	<div class="jlf" dir="rtl" data-jlf-variant="<?php echo esc_attr( $variant ); ?>">
		<?php // A styled paragraph, not a heading: placing the form must not change the page outline. ?>
		<p class="jlf__title"><?php echo esc_html( $title ); ?></p>
		<form class="lead-form jlf__form" method="post" action="<?php echo esc_url( rest_url( 'justice-ops/v1/lead-form' ) ); ?>" novalidate>
			<input type="hidden" name="variant" value="<?php echo esc_attr( $variant ); ?>">
			<input type="hidden" name="page_id" value="<?php echo esc_attr( (string) $post_id ); ?>">
			<input type="hidden" name="page_language" value="<?php echo esc_attr( function_exists( 'pll_current_language' ) ? (string) pll_current_language() : (string) get_locale() ); ?>">
			<input type="hidden" name="source_keyword" value="<?php echo esc_attr( justice_lf_page_keyword( $post_id ) ); ?>">
			<input type="hidden" name="jlf_el" value="">
			<div class="justice-lead-guard" aria-hidden="true">
				<label for="<?php echo esc_attr( $p . 'company' ); ?>">Company</label>
				<input id="<?php echo esc_attr( $p . 'company' ); ?>" type="text" name="justice_lead_company" value="" tabindex="-1" autocomplete="off">
			</div>

			<div class="lead-form__grid jlf__grid">
				<?php
				if ( 'abroad' === $variant ) {
					echo justice_lf_select( $p . 'country', 'lead_country', 'מדינה', $countries, $country, true ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped inside.
					echo justice_lf_select( $p . 'topic', 'lead_topic', 'מה אתם צריכים', $topic_labels, $topic, true ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo justice_lf_select( $p . 'budget', 'lead_budget', 'תקציב', justice_lf_budgets(), '', false ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo justice_lf_select( $p . 'timing', 'lead_timing', 'מתי', $timing_labels, '', false ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				} else {
					echo justice_lf_select( $p . 'topic', 'lead_topic', 'נושא', $topic_labels, $topic, true ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo justice_lf_select( $p . 'timing', 'lead_timing', 'מתי זה רלוונטי', $timing_labels, '', false ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				?>
				<p class="lead-form__field">
					<label for="<?php echo esc_attr( $p . 'name' ); ?>">שם</label>
					<input id="<?php echo esc_attr( $p . 'name' ); ?>" type="text" name="lead_name" autocomplete="name" maxlength="80" required>
				</p>
				<p class="lead-form__field">
					<label for="<?php echo esc_attr( $p . 'phone' ); ?>"><?php echo 'abroad' === $variant ? 'טלפון (וואטסאפ)' : 'טלפון'; ?></label>
					<input id="<?php echo esc_attr( $p . 'phone' ); ?>" type="tel" name="lead_phone" autocomplete="tel" inputmode="tel" dir="ltr" maxlength="20" required>
				</p>
				<p class="lead-form__field">
					<label for="<?php echo esc_attr( $p . 'email' ); ?>">אימייל <span class="jlf__opt">(רשות)</span></label>
					<input id="<?php echo esc_attr( $p . 'email' ); ?>" type="email" name="lead_email" autocomplete="email" dir="ltr" maxlength="120">
				</p>
				<?php
				if ( 'abroad' === $variant ) {
					echo justice_lf_select( $p . 'lang', 'preferred_language', 'שפה מועדפת לשיחה', justice_lf_languages(), 'he', false ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				?>
			</div>

			<label class="lead-form__consent jlf__consent" for="<?php echo esc_attr( $p . 'consent' ); ?>">
				<input id="<?php echo esc_attr( $p . 'consent' ); ?>" type="checkbox" name="lead_consent" value="1" required>
				<span class="jlf__consent-text"><?php echo esc_html( justice_lf_consent_text( $variant, $country ) ); ?>
				<?php
				$privacy_url = function_exists( 'get_privacy_policy_url' ) ? get_privacy_policy_url() : '';
				if ( $privacy_url ) {
					echo ' <a href="' . esc_url( $privacy_url ) . '">מדיניות הפרטיות</a>';
				}
				?>
				</span>
			</label>

			<p class="jlf__status" role="status" aria-live="polite"></p>
			<button class="button button--gold jlf__submit" type="submit"><?php echo 'abroad' === $variant ? 'שליחה וקבלת הצעה' : 'שליחת פנייה'; ?></button>
			<noscript><p class="jlf__status">כדי לשלוח את הטופס צריך להפעיל JavaScript בדפדפן.</p></noscript>
		</form>
	</div>
	<?php
	$html = (string) ob_get_clean();

	return $html . justice_lf_assets_once();
}
add_shortcode( 'justice_lead_form', 'justice_lf_render' );

/**
 * Inline CSS and JS, printed once per page (the module ships inside the ops
 * plugin, so it cannot rely on a theme stylesheet release).
 */
function justice_lf_assets_once(): string {
	static $printed = false;
	if ( $printed ) {
		return '';
	}
	$printed = true;

	$css = '.jlf{margin:1.5rem 0;padding:1rem;border:1px solid var(--jt-border,#e3dccd);border-radius:12px;background:#fff}'
		. '.jlf__title{margin:0 0 .75rem;font-size:1.15rem;font-weight:800;line-height:1.4}'
		. '.jlf .lead-form__grid{display:grid;grid-template-columns:1fr;gap:.75rem}'
		. '.jlf .lead-form__field{display:grid;gap:.3rem;margin:0}'
		. '.jlf label{color:var(--jt-muted,#4a4a4a);font-weight:700}'
		. '.jlf input[type=text],.jlf input[type=tel],.jlf input[type=email],.jlf select{width:100%;min-height:48px;border:1px solid var(--jt-border,#cfc6b4);border-radius:8px;padding:.7rem;font:inherit;font-size:16px;background:#fff;box-sizing:border-box}'
		. '.jlf input[dir=ltr]{text-align:right}'
		. '.jlf [aria-invalid=true]{border-color:#b42318;outline:2px solid rgba(180,35,24,.2)}'
		. '.jlf__opt{font-weight:400;font-size:.85em}'
		. '.jlf__consent{display:grid;grid-template-columns:auto 1fr;gap:.55rem;align-items:start;margin:.9rem 0;font-size:.9rem;line-height:1.55;font-weight:400}'
		. '.jlf__consent input{width:20px;height:20px;margin-top:.15rem}'
		. '.jlf__submit{width:100%}'
		. '.jlf__status{margin:.5rem 0;font-weight:700}'
		. '.jlf__status:empty{display:none}'
		. '.jlf__status--error{color:#b42318}'
		. '.jlf__done{margin:0;font-weight:700;line-height:1.6}'
		. '@media (min-width:640px){.jlf{padding:1.25rem 1.5rem}.jlf .lead-form__grid{grid-template-columns:repeat(2,minmax(0,1fr))}.jlf__submit{width:auto}}';

	$js = <<<'JS'
(function(){
  var shown = Date.now();
  function msg(form, text, isError){
    var s = form.querySelector('.jlf__status');
    if (!s) { return; }
    s.textContent = text;
    s.classList.toggle('jlf__status--error', !!isError);
  }
  function invalid(form){
    var bad = null;
    form.querySelectorAll('[required]').forEach(function(el){
      var ok = el.type === 'checkbox' ? el.checked : el.value.trim() !== '';
      if (ok && el.name === 'lead_phone') { ok = el.value.replace(/[^0-9]/g, '').length >= 9; }
      if (ok && el.type === 'email' && el.value) { ok = /.+@.+\..+/.test(el.value); }
      el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (!ok && !bad) { bad = el; }
    });
    var em = form.querySelector('input[type=email]');
    if (em && em.value && !/.+@.+\..+/.test(em.value)) { em.setAttribute('aria-invalid', 'true'); bad = bad || em; }
    return bad;
  }
  document.addEventListener('submit', function(e){
    var form = e.target;
    if (!form.classList || !form.classList.contains('jlf__form')) { return; }
    e.preventDefault();
    var bad = invalid(form);
    if (bad) {
      msg(form, bad.type === 'checkbox' ? 'כדי לשלוח צריך לסמן את תיבת ההסכמה.' : 'בדקו את השדות המסומנים (שם, טלפון תקין ונושא).', true);
      bad.focus();
      return;
    }
    var btn = form.querySelector('.jlf__submit');
    if (btn) { btn.disabled = true; }
    form.querySelector('[name=jlf_el]').value = String(Date.now() - shown);
    var data = new FormData(form);
    data.append('page_url', location.href.split('#')[0]);
    var q = new URLSearchParams(location.search);
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){ if (q.get(k)) { data.append(k, q.get(k)); } });
    msg(form, 'שולח...', false);
    fetch(form.action, { method: 'POST', body: data, credentials: 'omit', headers: { 'X-Justice-Lead-Form': '1' } })
      .then(function(r){ return r.json().then(function(j){ return { ok: r.ok, j: j }; }); })
      .then(function(res){
        if (res.ok && res.j && res.j.ok) {
          var wrap = form.parentNode;
          var done = document.createElement('p');
          done.className = 'jlf__done';
          done.setAttribute('role', 'status');
          done.textContent = 'קיבלנו את הפרטים, תודה. נחזור אליכם בהקדם.';
          form.replaceWith(done);
          done.setAttribute('tabindex', '-1');
          done.focus();
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: 'generate_lead', lead_form: 'justice_lead_form', lead_variant: wrap.getAttribute('data-jlf-variant') || '', lead_topic: data.get('lead_topic') || '', lead_country: data.get('lead_country') || '' });
          return;
        }
        msg(form, (res.j && res.j.message) ? res.j.message : 'השליחה לא הצליחה. נסו שוב בעוד רגע.', true);
        if (btn) { btn.disabled = false; }
      })
      .catch(function(){
        msg(form, 'השליחה לא הצליחה. בדקו את החיבור ונסו שוב.', true);
        if (btn) { btn.disabled = false; }
      });
  });
})();
JS;

	return '<style id="justice-lead-form-css">' . $css . '</style><script id="justice-lead-form-js">' . $js . '</script>';
}

/**
 * Client IP for the rate limit. REMOTE_ADDR only: forwarded headers are
 * client-controlled and would let a bot rotate its own key.
 */
function justice_lf_client_ip(): string {
	return sanitize_text_field( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) );
}

/**
 * Accept only a page URL on this site.
 */
function justice_lf_safe_page_url( string $url ): string {
	$url  = esc_url_raw( $url );
	$home = wp_parse_url( home_url( '/' ), PHP_URL_HOST );
	$host = wp_parse_url( $url, PHP_URL_HOST );

	return ( $url && $home && $host && strtolower( (string) $host ) === strtolower( (string) $home ) ) ? $url : '';
}

/**
 * Where the notification goes: the verified lead mailbox when the owner set
 * one (justice_ops_verified_lead_mailbox), otherwise the site admin email,
 * which is where uje_handle_lead sends today.
 */
function justice_lf_notify_to(): string {
	$mailbox = sanitize_email( (string) get_option( 'justice_ops_verified_lead_mailbox', '' ) );

	return ( $mailbox && is_email( $mailbox ) ) ? $mailbox : (string) get_option( 'admin_email' );
}

/**
 * REST: POST /wp-json/justice-ops/v1/lead-form
 *
 * @return array<string,mixed>|WP_Error
 */
function justice_lf_submit( WP_REST_Request $req ) {
	// 1. Honeypot: a bot filled the hidden field. Answer like a success so
	// it learns nothing, store nothing.
	if ( '' !== trim( (string) $req->get_param( 'justice_lead_company' ) ) ) {
		return array( 'ok' => true );
	}

	// 2. Minimum fill time, measured in the browser (no clock comparison, so
	// a visitor with a wrong clock is never blocked). Also proves JS ran.
	$elapsed = (int) $req->get_param( 'jlf_el' );
	if ( $elapsed < 3000 ) {
		return new WP_Error( 'jlf_fast', 'הטופס נשלח מהר מדי. נסו שוב בעוד רגע.', array( 'status' => 400 ) );
	}

	// 3. Rate limit per IP per clock hour.
	$ip_key = 'jt_lf_ip_' . md5( justice_lf_client_ip() . '|' . wp_date( 'YmdH' ) );
	$count  = (int) get_transient( $ip_key );
	if ( $count >= 6 ) {
		return new WP_Error( 'jlf_limit', 'נשלחו יותר מדי פניות מהחיבור הזה. אפשר לנסות שוב בעוד שעה.', array( 'status' => 429 ) );
	}

	// 4. Validate on the server.
	$variant   = justice_lf_variant( (string) $req->get_param( 'variant' ) );
	$topics    = 'abroad' === $variant ? justice_lf_abroad_needs() : justice_lf_family_topics();
	$timings   = justice_lf_timings( $variant );
	$countries = justice_lf_countries();

	$name     = sanitize_text_field( (string) $req->get_param( 'lead_name' ) );
	$name     = function_exists( 'mb_substr' ) ? mb_substr( $name, 0, 80 ) : substr( $name, 0, 80 );
	$phone    = preg_replace( '/[^0-9+]/', '', (string) $req->get_param( 'lead_phone' ) );
	$digits   = preg_replace( '/[^0-9]/', '', $phone );
	$email    = sanitize_email( (string) $req->get_param( 'lead_email' ) );
	$topic    = sanitize_key( (string) $req->get_param( 'lead_topic' ) );
	$timing   = sanitize_key( (string) $req->get_param( 'lead_timing' ) );
	$country  = sanitize_key( (string) $req->get_param( 'lead_country' ) );
	$budget   = sanitize_key( (string) $req->get_param( 'lead_budget' ) );
	$language = sanitize_key( (string) $req->get_param( 'preferred_language' ) );
	$consent  = '1' === (string) $req->get_param( 'lead_consent' );

	if ( '' === $name || strlen( $digits ) < 9 || strlen( $digits ) > 15 ) {
		return new WP_Error( 'jlf_fields', 'צריך שם וטלפון תקין.', array( 'status' => 400 ) );
	}
	if ( ! isset( $topics[ $topic ] ) ) {
		return new WP_Error( 'jlf_topic', 'בחרו נושא מהרשימה.', array( 'status' => 400 ) );
	}
	if ( 'abroad' === $variant && ! isset( $countries[ $country ] ) ) {
		return new WP_Error( 'jlf_country', 'בחרו מדינה.', array( 'status' => 400 ) );
	}
	if ( ! $consent ) {
		return new WP_Error( 'jlf_consent', 'כדי לשלוח צריך לסמן את תיבת ההסכמה.', array( 'status' => 400 ) );
	}
	if ( '' !== (string) $req->get_param( 'lead_email' ) && ! is_email( $email ) ) {
		return new WP_Error( 'jlf_email', 'כתובת האימייל לא תקינה. אפשר גם להשאיר אותה ריקה.', array( 'status' => 400 ) );
	}

	$timing   = isset( $timings[ $timing ] ) ? $timing : '';
	$country  = 'abroad' === $variant ? $country : '';
	$budget   = ( 'abroad' === $variant && isset( justice_lf_budgets()[ $budget ] ) ) ? $budget : '';
	$language = isset( justice_lf_languages()[ $language ] ) ? $language : ( 'abroad' === $variant ? 'he' : '' );

	// 5. Same person, same request, within 10 minutes: one lead, not two.
	$dup_key = 'jt_lf_dup_' . md5( $digits . '|' . $variant . '|' . $topic . '|' . $country );
	if ( get_transient( $dup_key ) ) {
		return array( 'ok' => true, 'duplicate' => true );
	}

	$topic_label   = $topics[ $topic ][0];
	$area          = $topics[ $topic ][1];
	$urgency       = $timing ? $timings[ $timing ][1] : 'normal';
	$timing_label  = $timing ? $timings[ $timing ][0] : '';
	$country_label = $country ? $countries[ $country ] : '';
	$budget_label  = $budget ? justice_lf_budgets()[ $budget ] : '';
	$lang_label    = $language ? justice_lf_languages()[ $language ] : '';
	$surface       = 'abroad' === $variant ? 'abroad_quote_form' : 'family_topic_form';
	$page_url      = justice_lf_safe_page_url( (string) $req->get_param( 'page_url' ) );
	$page_url      = $page_url ?: justice_lf_safe_page_url( (string) $req->get_header( 'referer' ) );
	$request_uuid  = wp_generate_uuid4();
	$consent_text  = justice_lf_consent_text( $variant, $country );

	$summary = array_filter(
		array(
			$country_label ? 'מדינה: ' . $country_label : '',
			'נושא: ' . $topic_label,
			$budget_label ? 'תקציב: ' . $budget_label : '',
			$timing_label ? 'מתי: ' . $timing_label : '',
			$lang_label ? 'שפה מועדפת: ' . $lang_label : '',
		)
	);
	$message = implode( "\n", $summary );

	$lead_id = wp_insert_post(
		array(
			'post_type'   => 'justice_lead',
			'post_title'  => sprintf( '%s — %s', $name, $country_label ? $country_label . ': ' . $topic_label : $topic_label ),
			'post_status' => 'publish',
		)
	);

	if ( ! $lead_id || is_wp_error( $lead_id ) ) {
		return new WP_Error( 'jlf_save', 'לא הצלחנו לשמור את הפנייה. נסו שוב.', array( 'status' => 500 ) );
	}

	// Routing fields first. For abroad leads routing_hold must exist before
	// legal_area / lead_status are written, because both routers fire on
	// those meta writes and both respect routing_hold.
	$routing_meta = array(
		'lead_form_variant'   => $variant,
		'lead_form_version'   => JUSTICE_LF_VERSION,
		'lead_topic'          => $topic,
		'lead_topic_label'    => $topic_label,
		'lead_country'        => $country,
		'lead_budget'         => $budget,
		'lead_timing'         => $timing,
		'preferred_language'  => $language,
		'lead_page_language'  => sanitize_text_field( (string) $req->get_param( 'page_language' ) ),
		'lead_page_id'        => (string) absint( $req->get_param( 'page_id' ) ),
		'request_uuid'        => $request_uuid,
		'consent_text'        => $consent_text,
		'consent_version'     => JUSTICE_LF_CONSENT_VERSION,
		'consent_at'          => gmdate( 'c' ),
	);

	if ( 'abroad' === $variant ) {
		$routing_meta['routing_hold']  = '1';
		$routing_meta['routing_notes'] = 'Abroad quote lead (' . $country . '). Owner picks ONE approved partner by hand; attribution window 180 days from consent_at. Record partner and date in Notion "צינור כסף".';
	}

	foreach ( $routing_meta as $key => $value ) {
		update_post_meta( $lead_id, $key, $value );
	}

	// The canonical lead fields, same keys and same order as uje_handle_lead.
	$source_channel = function_exists( 'justice_theme_public_lead_source_channel' )
		? justice_theme_public_lead_source_channel( $surface )
		: 'public_site_form';
	$owner_next     = 'abroad' === $variant
		? 'Abroad quote lead: call or WhatsApp in the preferred language, confirm the need, then hand to ONE approved partner in ' . $country . '. Do not mark paid without payment evidence.'
		: ( function_exists( 'justice_theme_public_lead_revenue_next_step' )
			? justice_theme_public_lead_revenue_next_step( $surface )
			: 'Review this public lead quickly, call or WhatsApp the visitor, confirm legal area and consent, then assign only to a paid/approved lawyer path. Do not mark paid without payment evidence.' );

	$meta = array(
		'visitor_name'                  => $name,
		'visitor_phone'                 => $phone,
		'visitor_email'                 => $email,
		'legal_area'                    => $area,
		'city'                          => '',
		'message'                       => $message,
		'urgency'                       => $urgency,
		'lead_status'                   => 'new',
		'follow_up_status'              => 'not_started',
		'coverage_status'               => 'coverage_review',
		'consent'                       => '1',
		'consent_status'                => 'explicit_site_form_consent',
		'source_url'                    => $page_url,
		'source_page_url'               => $page_url,
		'source_keyword'                => sanitize_text_field( (string) $req->get_param( 'source_keyword' ) ),
		'source_channel'                => $source_channel,
		'source_system'                 => 'justice_public_site',
		'lead_source_surface'           => $surface,
		'product_intent'                => '',
		'lead_revenue_model'            => 'public_intake_review',
		'qualified_lead_billing_status' => 'not_ready',
		'lead_revenue_notes'            => 'Public site lead from [justice_lead_form]. Qualify need, consent, coverage and partner commercial terms before billing.',
		'owner_revenue_next_step'       => $owner_next,
		'assigned_lawyer_id'            => 0,
	);

	foreach ( $meta as $key => $value ) {
		update_post_meta( $lead_id, $key, $value );
	}

	foreach ( array( 'utm_source', 'utm_campaign', 'utm_medium', 'utm_content' ) as $utm ) {
		$value = sanitize_text_field( (string) $req->get_param( $utm ) );
		if ( '' !== $value ) {
			update_post_meta( $lead_id, $utm, $value );
		}
	}

	set_transient( $ip_key, $count + 1, HOUR_IN_SECONDS );
	set_transient( $dup_key, 1, 10 * MINUTE_IN_SECONDS );

	// Notification, same shape as uje_handle_lead plus the routing lines.
	$subject = sprintf( 'ליד חדש: %s — %s', $name, $country_label ? $country_label . ': ' . $topic_label : $topic_label );
	$body    = sprintf(
		"שם: %s\nטלפון: %s\nאימייל: %s\n%s\n\nתיבת הסכמה: סומנה (%s)\nנוסח: %s\n\nמזהה פנייה: %s\nמקור: %s",
		$name,
		$phone,
		$email ?: '-',
		$message,
		JUSTICE_LF_CONSENT_VERSION,
		$consent_text,
		$request_uuid,
		$page_url ?: '-'
	);
	if ( 'abroad' === $variant ) {
		$body .= "\n\nהפנייה לא נותבה אוטומטית (routing_hold). יש לבחור שותף אחד ב" . $country_label . ' ולרשום ב"צינור כסף".';
	}
	wp_mail( justice_lf_notify_to(), $subject, $body );

	return array(
		'ok'      => true,
		'request' => $request_uuid,
	);
}

add_action(
	'rest_api_init',
	static function (): void {
		register_rest_route(
			'justice-ops/v1',
			'/lead-form',
			array(
				'methods'             => 'POST',
				// Public form on cached pages: no nonce by design (see header).
				'permission_callback' => '__return_true',
				'callback'            => 'justice_lf_submit',
			)
		);
	}
);
