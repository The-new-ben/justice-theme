<?php
/**
 * Bituach Leumi appeal funnel.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return normalized request path for the appeal funnel.
 */
function justice_theme_btl_appeal_request_path(): string {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = (string) wp_parse_url( $request_uri, PHP_URL_PATH );

	return '/' . trim( $request_path, '/' ) . '/';
}

/**
 * Check if this request should render the Bituach Leumi appeal funnel.
 */
function justice_theme_is_btl_appeal_route(): bool {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return false;
	}

	return in_array(
		justice_theme_btl_appeal_request_path(),
		array(
			'/bituach-leumi-appeal-guide/',
			'/national-insurance-attorney/',
		),
		true
	);
}

/**
 * Return visible and schema FAQ items for the appeal funnel.
 *
 * @return array<int,array{question:string,answer:string}>
 */
function justice_theme_btl_appeal_faqs(): array {
	return array(
		array(
			'question' => 'כמה זמן יש להגיש ערעור לביטוח לאומי?',
			'answer'   => 'אין מועד אחד שמתאים לכל סוגי ההחלטות. בנכות מעבודה, למשל, הביטוח הלאומי מציין שיש לשלוח ערעור בכתב בתוך 30 ימים, ואת נימוקי הערעור אפשר למסור בתוך 60 ימים. במסלולים אחרים, כמו ערעור לבית הדין האזורי לעבודה, מופיע מועד של 60 ימים. לכן צריך לבדוק את סוג ההחלטה ואת המסמך שקיבלתם.',
		),
		array(
			'question' => 'האם המחשבון קובע אם הערעור יצליח?',
			'answer'   => 'לא. המחשבון רק מסדר את הפער הכספי המשוער ואת הדחיפות. הצלחת ערעור תלויה במסמכים רפואיים, פרוטוקול הוועדה, סוג הקצבה, סעיפי הליקוי והאפשרות להראות טעות רפואית או משפטית.',
		),
		array(
			'question' => 'אילו מסמכים כדאי להכין לפני פנייה לעורך דין?',
			'answer'   => 'כדאי להכין את החלטת הביטוח הלאומי, פרוטוקול הוועדה, מסמכים רפואיים עדכניים, אישורי עבודה או שכר אם הם רלוונטיים, וכל מסמך שמראה שינוי במצב הרפואי או התפקודי.',
		),
		array(
			'question' => 'למה לא להגיש ערעור לבד מיד?',
			'answer'   => 'לפעמים ערעור יכול לשפר את המצב, אבל במסלולים מסוימים ועדת ערר יכולה גם לבחון מחדש את הקביעה. לכן לפני פעולה כדאי להבין מה בדיוק תוקפים, מה הסיכון, ומה חסר כדי להציג את התמונה נכון.',
		),
		array(
			'question' => 'מה קורה אחרי שמשאירים פנייה דרך Jus-Tice?',
			'answer'   => 'הפנייה מסווגת כתחום ביטוח לאומי, נשמרת עם פרטי הדחיפות והפער הכספי שהזנתם, ונכנסת למסלול בדיקה כדי להתאים המשך טיפול או עורך דין רלוונטי. אין בכך התחייבות לקבל תיק או הבטחה לתוצאה.',
		),
	);
}

/**
 * Do not override a real CMS page/article if the owner later publishes one.
 */
function justice_theme_btl_appeal_route_has_published_cms_owner(): bool {
	$slug       = trim( justice_theme_btl_appeal_request_path(), '/' );
	$post_types = array( 'page', 'post' );

	if ( post_type_exists( 'articles' ) ) {
		$post_types[] = 'articles';
	}

	foreach ( $post_types as $post_type ) {
		$post = get_page_by_path( $slug, OBJECT, $post_type );
		if ( $post instanceof WP_Post && 'publish' === get_post_status( $post ) ) {
			return true;
		}
	}

	return false;
}

/**
 * Prepare route metadata.
 */
function justice_theme_prepare_btl_appeal_route_meta(): void {
	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->is_404      = false;
		$wp_query->is_page     = true;
		$wp_query->is_singular = true;
	}

	status_header( 200 );

	if ( ! headers_sent() ) {
		header( 'X-Justice-Route-Guard: bituach-leumi-appeal-funnel', true );
	}

	$title         = 'ערעור ביטוח לאומי: בדיקת כדאיות לפני החלטה';
	$description   = 'מדריך וכלי חישוב ראשוני למי שקיבל החלטה מביטוח לאומי ורוצה להבין האם כדאי לבדוק ערעור, מסמכים חסרים ומועד פעולה.';
	$canonical_url = justice_theme_public_url( home_url( '/bituach-leumi-appeal-guide/' ) );

	add_filter(
		'pre_get_document_title',
		static function () use ( $title ): string {
			return $title . ' | Jus-Tice';
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_title',
		static function () use ( $title ): string {
			return $title . ' | Jus-Tice';
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_metadesc',
		static function () use ( $description ): string {
			return $description;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_canonical',
		static function () use ( $canonical_url ): string {
			return $canonical_url;
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_robots',
		static function (): string {
			return 'index, follow';
		},
		PHP_INT_MAX
	);
	add_filter(
		'body_class',
		static function ( array $classes ): array {
			$classes[] = 'justice-btl-appeal-funnel';
			return $classes;
		}
	);
	add_action(
		'wp_head',
		'justice_theme_print_btl_appeal_schema',
		23
	);
}

/**
 * Print conservative schema for the appeal funnel.
 */
function justice_theme_print_btl_appeal_schema(): void {
	if ( ! function_exists( 'justice_theme_print_schema' ) ) {
		return;
	}

	$home_url      = justice_theme_public_url( home_url( '/' ) );
	$canonical_url = justice_theme_public_url( home_url( '/bituach-leumi-appeal-guide/' ) );

	justice_theme_print_schema(
		array(
			'@context'         => 'https://schema.org',
			'@type'            => array( 'WebPage', 'WebApplication' ),
			'@id'              => esc_url_raw( $canonical_url ) . '#webpage',
			'name'             => 'ערעור ביטוח לאומי: בדיקת כדאיות',
			'description'      => 'כלי ראשוני לאיסוף נתונים לפני בדיקת ערעור על החלטת ביטוח לאומי.',
			'inLanguage'       => 'he',
			'url'              => esc_url_raw( $canonical_url ),
			'mainEntityOfPage' => esc_url_raw( $canonical_url ),
			'applicationCategory' => 'LegalService',
			'publisher'        => array(
				'@type' => 'LegalService',
				'@id'   => $home_url . '#organization',
				'name'  => get_bloginfo( 'name' ) ?: 'Jus-Tice',
				'url'   => $home_url,
			),
		)
	);

	$faq_entities = array();
	foreach ( justice_theme_btl_appeal_faqs() as $faq ) {
		$faq_entities[] = array(
			'@type'          => 'Question',
			'name'           => $faq['question'],
			'acceptedAnswer' => array(
				'@type' => 'Answer',
				'text'  => $faq['answer'],
			),
		);
	}

	justice_theme_print_schema(
		array(
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'@id'        => esc_url_raw( $canonical_url ) . '#faq',
			'inLanguage' => 'he',
			'mainEntity' => $faq_entities,
		)
	);
}

/**
 * Render a focused lead form for Bituach Leumi appeals.
 */
function justice_theme_render_btl_appeal_lead_form(): void {
	?>
	<form class="lead-form btl-appeal-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
		<input type="hidden" name="action" value="justice_submit_lead">
		<input type="hidden" name="lead_area" value="national-insurance">
		<input id="btl-appeal-urgency" type="hidden" name="lead_urgency" value="normal">
		<input type="hidden" name="source_keyword" value="ערעור ביטוח לאומי">
		<input type="hidden" name="utm_source" value="bituach_leumi_appeal_funnel">
		<input type="hidden" name="utm_medium" value="legaltech_calculator">
		<input type="hidden" name="utm_campaign" value="national_insurance_leads">
		<?php wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce' ); ?>
		<?php justice_theme_render_lead_spam_fields(); ?>
		<?php justice_theme_render_lead_attribution_fields(); ?>

		<div class="lead-form__grid">
			<p class="lead-form__field">
				<label for="btl-lead-name"><?php esc_html_e( 'שם מלא', 'justice-theme' ); ?></label>
				<input id="btl-lead-name" type="text" name="lead_name" required>
			</p>
			<p class="lead-form__field">
				<label for="btl-lead-phone"><?php esc_html_e( 'טלפון', 'justice-theme' ); ?></label>
				<input id="btl-lead-phone" type="tel" name="lead_phone" required>
			</p>
			<p class="lead-form__field">
				<label for="btl-lead-email"><?php esc_html_e( 'אימייל', 'justice-theme' ); ?></label>
				<input id="btl-lead-email" type="email" name="lead_email" autocomplete="email">
			</p>
			<p class="lead-form__field">
				<label for="btl-lead-city"><?php esc_html_e( 'עיר / אזור', 'justice-theme' ); ?></label>
				<input id="btl-lead-city" type="text" name="lead_city" autocomplete="address-level2">
			</p>
			<p class="lead-form__field lead-form__field--full">
				<label for="btl-lead-message"><?php esc_html_e( 'מה התקבל מביטוח לאומי?', 'justice-theme' ); ?></label>
				<textarea id="btl-lead-message" name="lead_message" rows="5" required>קיבלתי החלטה מביטוח לאומי ואני רוצה לבדוק האם יש טעם לערעור. סוג ההחלטה, אחוזים/סכום, תאריך קבלת ההחלטה ומסמכים קיימים:</textarea>
			</p>
		</div>

		<label class="lead-form__consent">
			<input type="checkbox" name="lead_consent" value="1" required>
			<span><?php esc_html_e( 'אני מאשר/ת יצירת קשר לצורך בדיקה ראשונית. ידוע לי שהמידע אינו ייעוץ משפטי ואינו יוצר יחסי עורך דין-לקוח.', 'justice-theme' ); ?></span>
		</label>

		<button class="button button--gold" type="submit"><?php esc_html_e( 'שליחת בדיקה ראשונית', 'justice-theme' ); ?></button>
	</form>
	<?php
}

/**
 * Render the route.
 */
function justice_theme_render_btl_appeal_route(): void {
	if ( ! justice_theme_is_btl_appeal_route() || justice_theme_btl_appeal_route_has_published_cms_owner() ) {
		return;
	}

	justice_theme_prepare_btl_appeal_route_meta();

	get_header();
	?>
	<main id="primary" class="site-main btl-appeal-route" dir="rtl">
		<section class="btl-appeal-hero section">
			<div class="container btl-appeal-hero__grid">
				<div>
					<p class="section-header__eyebrow"><?php esc_html_e( 'ביטוח לאומי', 'justice-theme' ); ?></p>
					<h1><?php esc_html_e( 'ערעור על החלטת ביטוח לאומי: בדיקת כדאיות לפני שהמועד נסגר', 'justice-theme' ); ?></h1>
					<p><?php esc_html_e( 'קיבלתם החלטה על נכות, אי-כושר, שירותים מיוחדים או נפגעי עבודה? לפני שמגישים ערעור חשוב להבין מה בדיוק נפסק, מה חסר במסמכים, כמה זמן נשאר לפעול ומה השווי הכלכלי האפשרי של שינוי ההחלטה.', 'justice-theme' ); ?></p>
					<div class="legal-pillar-hero__actions">
						<a class="button button--gold" href="#btl-appeal-calculator"><?php esc_html_e( 'בדיקת כדאיות ראשונית', 'justice-theme' ); ?></a>
						<a class="button button--ghost" href="<?php echo esc_url( home_url( '/lawyers/?area=national-insurance' ) ); ?>"><?php esc_html_e( 'עורכי דין ביטוח לאומי', 'justice-theme' ); ?></a>
					</div>
				</div>
				<aside class="legal-pillar-hero__panel">
					<strong><?php esc_html_e( 'מה בודקים קודם?', 'justice-theme' ); ?></strong>
					<ul>
						<li><?php esc_html_e( 'תאריך קבלת ההחלטה והמסלול המתאים', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'פער בין ההחלטה לבין המסמכים הרפואיים', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'שווי כספי אפשרי של שינוי הקביעה', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'האם נדרש עורך דין בתחום ביטוח לאומי', 'justice-theme' ); ?></li>
					</ul>
				</aside>
			</div>
		</section>

		<section class="btl-appeal-body section">
			<div class="container legal-pillar-body__grid">
				<article class="legal-pillar-content entry-content">
					<h2><?php esc_html_e( 'למה חשוב לבדוק את הערעור לפני שפועלים', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'ערעור מול ביטוח לאומי מתחיל בדרך כלל אחרי שכבר התקבלה החלטה שמשפיעה על קצבה, אחוזי נכות, אי-כושר או זכאות אחרת. לפני שמגישים ערר חשוב להבין מה בדיוק נקבע, איזה מועד חל על ההחלטה, אילו מסמכים רפואיים חסרים, והאם הפער בין ההחלטה לבין המצב בפועל מצדיק בדיקה משפטית מסודרת.', 'justice-theme' ); ?></p>

					<h2><?php esc_html_e( 'מה חשוב לדעת לפני ערעור', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'בענפי ביטוח לאומי שונים קיימים מועדים שונים. באתר הביטוח הלאומי מצוין שבנכות מעבודה את הערר יש לשלוח בתוך 30 ימים, ונימוקים ניתן למסור גם בתוך 60 ימים. בנכות כללית ובערעור לבית הדין האזורי לעבודה מופיעים מסלולים שבהם המועד הוא 60 ימים. לכן אין להסתמך על כלל אחד לכל מקרה, אלא לבדוק את סוג ההחלטה והמסמך שהתקבל.', 'justice-theme' ); ?></p>
					<p><?php esc_html_e( 'הבדיקה הראשונית אינה מבטיחה תוצאה ואינה מחליפה ייעוץ משפטי. היא עוזרת לסדר את הנתונים: אחוזים או סכומים שנקבעו, מה לדעתכם היה צריך להיקבע, כמה חודשים עשויים להיות רלוונטיים, ומה חסר כדי שעורך דין יוכל להעריך את המקרה.', 'justice-theme' ); ?></p>

					<div class="btl-appeal-proof-grid" aria-label="<?php esc_attr_e( 'בדיקות לפני ערעור ביטוח לאומי', 'justice-theme' ); ?>">
						<article>
							<strong><?php esc_html_e( 'מועד פעולה', 'justice-theme' ); ?></strong>
							<span><?php esc_html_e( 'בודקים מתי התקבלה ההחלטה, האם מדובר בערר לוועדה או בערעור לבית הדין, ומה המועד המדויק לפי המסלול.', 'justice-theme' ); ?></span>
						</article>
						<article>
							<strong><?php esc_html_e( 'פער כלכלי', 'justice-theme' ); ?></strong>
							<span><?php esc_html_e( 'בודקים אם הפער בין ההחלטה לבין התוצאה האפשרית מצדיק בדיקת מסמכים עמוקה יותר.', 'justice-theme' ); ?></span>
						</article>
						<article>
							<strong><?php esc_html_e( 'חומר רפואי', 'justice-theme' ); ?></strong>
							<span><?php esc_html_e( 'בודקים האם קיימים פרוטוקול ועדה, אבחנות, בדיקות וחוות דעת שיכולים לתמוך בטענה.', 'justice-theme' ); ?></span>
						</article>
					</div>

					<div class="btl-appeal-calculator" id="btl-appeal-calculator">
						<div>
							<p class="section-header__eyebrow"><?php esc_html_e( 'כלי בדיקה ראשוני', 'justice-theme' ); ?></p>
							<h2><?php esc_html_e( 'מחשבון שווי פער בערעור ביטוח לאומי', 'justice-theme' ); ?></h2>
							<p><?php esc_html_e( 'הכניסו סכום חודשי לפי ההחלטה, סכום חודשי שלדעתכם משקף את המצב, ומספר חודשים רטרואקטיבי משוער. המחשבון לא קובע זכאות, אלא עוזר להבין אם יש פער ששווה בדיקה.', 'justice-theme' ); ?></p>
						</div>
						<form class="btl-appeal-calculator__form" data-btl-appeal-calculator>
							<label>
								<span><?php esc_html_e( 'קצבה/תשלום חודשי לפי ההחלטה', 'justice-theme' ); ?></span>
								<input type="number" min="0" step="50" value="0" data-btl-current>
							</label>
							<label>
								<span><?php esc_html_e( 'קצבה/תשלום חודשי משוער לאחר תיקון', 'justice-theme' ); ?></span>
								<input type="number" min="0" step="50" value="0" data-btl-expected>
							</label>
							<label>
								<span><?php esc_html_e( 'חודשים רטרואקטיביים לבדיקה', 'justice-theme' ); ?></span>
								<input type="number" min="0" max="60" step="1" value="12" data-btl-months>
							</label>
							<label>
								<span><?php esc_html_e( 'כמה ימים עברו מאז שקיבלתם את ההחלטה?', 'justice-theme' ); ?></span>
								<input type="number" min="0" max="365" step="1" value="0" data-btl-days>
							</label>
						</form>
						<div class="btl-appeal-calculator__result" data-btl-result>
							<strong><?php esc_html_e( 'פער כספי משוער: ₪0', 'justice-theme' ); ?></strong>
							<p><?php esc_html_e( 'הזינו נתונים כדי לראות אם יש פער שכדאי לבדוק עם עורך דין.', 'justice-theme' ); ?></p>
						</div>
						<a class="button button--primary" href="#btl-appeal-lead"><?php esc_html_e( 'בדיקת הפער עם עורך דין', 'justice-theme' ); ?></a>
					</div>

					<h2><?php esc_html_e( 'שאלות נפוצות על ערעור ביטוח לאומי', 'justice-theme' ); ?></h2>
					<div class="btl-appeal-faq">
						<?php foreach ( justice_theme_btl_appeal_faqs() as $faq ) : ?>
							<article>
								<h3><?php echo esc_html( $faq['question'] ); ?></h3>
								<p><?php echo esc_html( $faq['answer'] ); ?></p>
							</article>
						<?php endforeach; ?>
					</div>

					<h2><?php esc_html_e( 'מקורות בדיקה רשמיים', 'justice-theme' ); ?></h2>
					<ul>
						<li><a href="https://www.btl.gov.il/benefits/vaadotRefuiyot/erurVadot/Pages/erurNechutMeavoda.aspx" target="_blank" rel="noopener">ביטוח לאומי: ערר על ועדה רפואית בנכות מעבודה</a></li>
						<li><a href="https://www.btl.gov.il/benefits/Disability/Pages/%D7%A2%D7%A8%D7%A2%D7%95%D7%A8%20%D7%A2%D7%9C%20%D7%90%D7%97%D7%95%D7%96%20%D7%94%D7%A0%D7%9B%D7%95%D7%AA%20%D7%94%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA%20%D7%93%D7%A8%D7%92%D7%AA%20%D7%90%D7%99%20%D7%94%D7%9B%D7%95%D7%A9%D7%A8%20%D7%90%D7%97%D7%A8.aspx" target="_blank" rel="noopener">ביטוח לאומי: ערעור בנכות כללית ואי-כושר</a></li>
						<li><a href="https://www.kolzchut.org.il/he/%D7%A2%D7%A8%D7%A2%D7%95%D7%A8_%D7%A2%D7%9C_%D7%94%D7%97%D7%9C%D7%98%D7%AA_%D7%95%D7%A2%D7%93%D7%94_%D7%A8%D7%A4%D7%95%D7%90%D7%99%D7%AA_%D7%9C%D7%A2%D7%A8%D7%A8%D7%99%D7%9D_%D7%A9%D7%9C_%D7%94%D7%9E%D7%95%D7%A1%D7%93_%D7%9C%D7%91%D7%99%D7%98%D7%95%D7%97_%D7%9C%D7%90%D7%95%D7%9E%D7%99" target="_blank" rel="noopener">כל זכות: ערעור על החלטת ועדה רפואית לעררים</a></li>
					</ul>
				</article>

				<aside class="legal-pillar-sidebar" id="btl-appeal-lead">
					<h2><?php esc_html_e( 'בדיקת ערעור ראשונית', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'השאירו פרטים עם תאריך ההחלטה, סוג הקצבה, הסכום או האחוזים שנקבעו, והמסמכים שיש לכם. הפנייה תסווג כביטוח לאומי ותיכנס למסלול מתאים.', 'justice-theme' ); ?></p>
					<?php justice_theme_render_btl_appeal_lead_form(); ?>
				</aside>
			</div>
		</section>
	</main>
	<?php
	get_footer();
	exit;
}
add_action( 'template_redirect', 'justice_theme_render_btl_appeal_route', -2996 );
