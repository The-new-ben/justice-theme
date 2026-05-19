<?php
/**
 * Lightweight trust and contact routes.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return the normalized public request path.
 *
 * @return string
 */
function justice_theme_trust_route_request_path(): string {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = (string) wp_parse_url( $request_uri, PHP_URL_PATH );

	return '/' . trim( $request_path, '/' ) . '/';
}

/**
 * Get route copy and metadata for lightweight trust pages.
 *
 * @param string $path Normalized route path.
 * @return array|null
 */
function justice_theme_get_trust_route_config( string $path ): ?array {
	$configs = array(
		'/contact/' => array(
			'slug'        => 'contact',
			'title'       => __( 'יצירת קשר', 'justice-theme' ),
			'eyebrow'     => __( 'פנייה מסודרת', 'justice-theme' ),
			'description' => __( 'צרו קשר עם Jus-Tice או השאירו פנייה משפטית ראשונית. המידע נועד לסייע במיון הפנייה ואינו מהווה ייעוץ משפטי או התחייבות לייצוג.', 'justice-theme' ),
			'canonical'   => home_url( '/contact/' ),
		),
		'/about/'   => array(
			'slug'        => 'about',
			'title'       => __( 'אודות Jus-Tice', 'justice-theme' ),
			'eyebrow'     => __( 'מי אנחנו', 'justice-theme' ),
			'description' => __( 'Jus-Tice הוא פורטל משפטי בישראל שמרכז מידע, מדריכים, פסקי דין, אינדקס עורכי דין וטפסי פנייה כדי לעזור לציבור להבין נושאים משפטיים ולמצוא את הצעד הבא.', 'justice-theme' ),
			'canonical'   => home_url( '/about/' ),
		),
		'/editorial-policy/' => array(
			'slug'        => 'editorial-policy',
			'title'       => __( 'מדיניות עריכה ובדיקת תוכן', 'justice-theme' ),
			'eyebrow'     => __( 'אמון, מקורות ובקרה', 'justice-theme' ),
			'description' => __( 'כך Jus-Tice יוצר, בודק ומעדכן מידע משפטי: שקיפות לגבי מי כתב, מי בדק, אילו מקורות נשקלו, ומה גבולות המידע לפני פנייה לעורך דין.', 'justice-theme' ),
			'canonical'   => home_url( '/editorial-policy/' ),
		),
	);

	return $configs[ $path ] ?? null;
}

/**
 * Mark a virtual route as an indexable 200 page and apply SEO metadata.
 *
 * @param array $config Route config.
 */
function justice_theme_prepare_trust_route( array $config ): void {
	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->is_404  = false;
		$wp_query->is_page = true;
	}

	status_header( 200 );

	$title         = trim( wp_strip_all_tags( (string) ( $config['title'] ?? '' ) ) );
	$description   = trim( wp_strip_all_tags( (string) ( $config['description'] ?? '' ) ) );
	$canonical_url = justice_theme_public_url( (string) ( $config['canonical'] ?? home_url( '/' ) ) );

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
}

/**
 * Render the trust/contact route content.
 *
 * @param array $config Route config.
 */
function justice_theme_render_trust_route_page( array $config ): void {
	$slug    = (string) ( $config['slug'] ?? '' );
	$title   = (string) ( $config['title'] ?? '' );
	$eyebrow = (string) ( $config['eyebrow'] ?? '' );
	$intro   = (string) ( $config['description'] ?? '' );
	$phone   = function_exists( 'justice_theme_public_contact_number' ) ? justice_theme_public_contact_number() : '0525101555';
	$email   = justice_theme_option( 'justice_email', 'info@jus-tice.co.il' );

	get_header();
	?>
	<style>
		.jt-trust-page {
			background: #f6f8fb;
			color: #14213d;
		}
		.jt-trust-page__hero {
			padding: clamp(54px, 8vw, 92px) 0 34px;
			background: linear-gradient(180deg, #ffffff 0%, #f6f8fb 100%);
		}
		.jt-trust-page__hero-inner,
		.jt-trust-page__inner {
			width: min(1120px, calc(100% - 32px));
			margin: 0 auto;
		}
		.jt-trust-page__eyebrow {
			margin: 0 0 10px;
			color: #c1121f;
			font-weight: 800;
		}
		.jt-trust-page h1 {
			margin: 0;
			font-size: clamp(2rem, 4vw, 3.4rem);
			line-height: 1.15;
			letter-spacing: 0;
		}
		.jt-trust-page__intro {
			max-width: 780px;
			margin: 18px 0 0;
			color: #42526b;
			font-size: 1.08rem;
			line-height: 1.75;
		}
		.jt-trust-page__inner {
			padding: 24px 0 70px;
			display: grid;
			gap: 22px;
		}
		.jt-trust-grid {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(280px, 390px);
			gap: 22px;
			align-items: start;
		}
		.jt-trust-panel {
			background: #fff;
			border: 1px solid #dde5ee;
			border-radius: 8px;
			padding: clamp(18px, 3vw, 30px);
			box-shadow: 0 8px 24px rgba(20, 33, 61, 0.06);
		}
		.jt-trust-panel h2,
		.jt-trust-panel h3 {
			margin: 0 0 12px;
			font-size: 1.25rem;
			line-height: 1.35;
			letter-spacing: 0;
		}
		.jt-trust-panel p,
		.jt-trust-panel li {
			color: #42526b;
			line-height: 1.75;
		}
		.jt-trust-list {
			margin: 0;
			padding-inline-start: 20px;
		}
		.jt-trust-actions,
		.jt-trust-links {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 18px;
		}
		.jt-trust-contact-cards {
			display: grid;
			gap: 12px;
		}
		.jt-trust-contact-cards a {
			display: block;
			border: 1px solid #dde5ee;
			border-radius: 8px;
			padding: 14px 16px;
			color: #14213d;
			text-decoration: none;
			background: #fbfcfe;
			font-weight: 800;
		}
		.jt-trust-contact-cards span {
			display: block;
			color: #6b778c;
			font-weight: 600;
			font-size: 0.9rem;
			margin-bottom: 4px;
		}
		.jt-trust-disclaimer {
			font-size: 0.94rem;
			color: #5c6b80;
			border-top: 1px solid #edf1f6;
			margin-top: 18px;
			padding-top: 14px;
		}
		@media (max-width: 820px) {
			.jt-trust-grid {
				grid-template-columns: 1fr;
			}
		}
	</style>

	<main id="primary" class="site-main jt-trust-page jt-trust-page--<?php echo esc_attr( $slug ); ?>">
		<section class="jt-trust-page__hero">
			<div class="jt-trust-page__hero-inner">
				<p class="jt-trust-page__eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
				<h1><?php echo esc_html( $title ); ?></h1>
				<p class="jt-trust-page__intro"><?php echo esc_html( $intro ); ?></p>
			</div>
		</section>

		<div class="jt-trust-page__inner">
			<?php if ( 'contact' === $slug ) : ?>
				<div class="jt-trust-grid">
					<section class="jt-trust-panel" aria-labelledby="jt-contact-form-title">
						<h2 id="jt-contact-form-title"><?php esc_html_e( 'השארת פנייה', 'justice-theme' ); ?></h2>
						<p><?php esc_html_e( 'כדי שנוכל להבין את הנושא, העיר ורמת הדחיפות, מלאו את הטופס בקצרה. אין לשלוח מידע סודי במיוחד לפני שנוצר קשר ישיר עם עורך דין מתאים.', 'justice-theme' ); ?></p>
						<?php get_template_part( 'template-parts/forms/lead-form' ); ?>
					</section>

					<aside class="jt-trust-panel" aria-labelledby="jt-contact-direct-title">
						<h2 id="jt-contact-direct-title"><?php esc_html_e( 'פרטי קשר', 'justice-theme' ); ?></h2>
						<div class="jt-trust-contact-cards">
							<a href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) ); ?>">
								<span><?php esc_html_e( 'טלפון', 'justice-theme' ); ?></span>
								<span dir="ltr"><?php echo esc_html( $phone ); ?></span>
							</a>
							<a href="<?php echo esc_url( 'mailto:' . $email ); ?>">
								<span><?php esc_html_e( 'אימייל', 'justice-theme' ); ?></span>
								<?php echo esc_html( $email ); ?>
							</a>
							<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>">
								<span><?php esc_html_e( 'אינדקס', 'justice-theme' ); ?></span>
								<?php esc_html_e( 'חיפוש עורכי דין לפי תחום', 'justice-theme' ); ?>
							</a>
						</div>
						<p class="jt-trust-disclaimer"><?php esc_html_e( 'הפנייה אינה יוצרת יחסי עורך דין-לקוח. במצב דחוף, מועד משפטי קרוב או סיכון מיידי, יש לפנות לעורך דין מוסמך בהקדם.', 'justice-theme' ); ?></p>
					</aside>
				</div>
			<?php elseif ( 'editorial-policy' === $slug ) : ?>
				<div class="jt-trust-grid">
					<section class="jt-trust-panel" aria-labelledby="jt-editorial-process-title">
						<h2 id="jt-editorial-process-title"><?php esc_html_e( 'איך אנחנו בונים תוכן משפטי', 'justice-theme' ); ?></h2>
						<p><?php esc_html_e( 'התוכן ב-Jus-Tice נועד להסביר מושגים, אפשרויות ושאלות נפוצות לציבור הרחב. הוא אינו מחליף ייעוץ משפטי אישי, אינו מבטיח תוצאה, ואינו יוצר יחסי עורך דין-לקוח.', 'justice-theme' ); ?></p>
						<ul class="jt-trust-list">
							<li><?php esc_html_e( 'כל עמוד צריך לשרת שאלה אמיתית של משתמש: מה קרה, מה המשמעות, אילו מסמכים כדאי להכין, ומה כדאי לשאול עורך דין.', 'justice-theme' ); ?></li>
							<li><?php esc_html_e( 'כאשר מופיע עורך דין ככותב או כבודק, נדרש קשר מקצועי ברור בין אותו אדם לבין תחום המאמר, לצד עמוד זהות או פרופיל שניתן לבדוק.', 'justice-theme' ); ?></li>
							<li><?php esc_html_e( 'מאמרים ללא בודק משפטי מאומת מוצגים כתוכן מערכת של Jus-Tice, ולא כמאמר אישי של עורך דין ספציפי.', 'justice-theme' ); ?></li>
							<li><?php esc_html_e( 'תוכן ממומן או פרופיל ממומן יסומן באופן גלוי כאשר הוא חלק ממסלול חשיפה בתשלום.', 'justice-theme' ); ?></li>
						</ul>
					</section>

					<aside class="jt-trust-panel" aria-labelledby="jt-editorial-review-title">
						<h2 id="jt-editorial-review-title"><?php esc_html_e( 'בדיקה, תיקונים ועדכונים', 'justice-theme' ); ?></h2>
						<p><?php esc_html_e( 'אנחנו בודקים תוכן מול מקורות משפטיים זמינים, שומרים על ניסוח זהיר, ומעדכנים עמודים כאשר מתגלה טעות, שינוי מהותי או צורך בהבהרה.', 'justice-theme' ); ?></p>
						<p><?php esc_html_e( 'אם מצאתם טעות, ניסוח לא ברור או ייחוס מקצועי שדורש בדיקה, פנו אלינו עם כתובת העמוד וההערה. תיקונים מהותיים מקבלים עדיפות.', 'justice-theme' ); ?></p>
						<div class="jt-trust-links">
							<a class="button button--ghost" href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'אודות Jus-Tice', 'justice-theme' ); ?></a>
							<a class="button button--ghost" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'דיווח על תיקון', 'justice-theme' ); ?></a>
							<a class="button button--ghost" href="<?php echo esc_url( home_url( '/site-map/' ) ); ?>"><?php esc_html_e( 'מפת אתר', 'justice-theme' ); ?></a>
						</div>
						<p class="jt-trust-disclaimer"><?php esc_html_e( 'במצב דחוף, מועד משפטי קרוב או סיכון מיידי, אין להסתמך על מידע כללי באתר ויש לפנות לעורך דין מוסמך בהקדם.', 'justice-theme' ); ?></p>
					</aside>
				</div>
			<?php else : ?>
				<div class="jt-trust-grid">
					<section class="jt-trust-panel" aria-labelledby="jt-about-who-title">
						<h2 id="jt-about-who-title"><?php esc_html_e( 'מה Jus-Tice עושה', 'justice-theme' ); ?></h2>
						<p><?php esc_html_e( 'Jus-Tice מחבר בין שלושה צרכים: מידע משפטי נגיש לציבור, ניווט לפי תחומי משפט, ופנייה מסודרת לעורכי דין כאשר יש צורך בבדיקה פרטנית.', 'justice-theme' ); ?></p>
						<ul class="jt-trust-list">
							<li><?php esc_html_e( 'מדריכים ומאמרים משפטיים לפי תחום ונושא.', 'justice-theme' ); ?></li>
							<li><?php esc_html_e( 'אינדקס עורכי דין ופרופילים ציבוריים כאשר יש מידע מאומת לפרסום.', 'justice-theme' ); ?></li>
							<li><?php esc_html_e( 'טפסי פנייה שמסייעים להבין תחום, עיר, דחיפות ורקע ראשוני.', 'justice-theme' ); ?></li>
						</ul>
						<div class="jt-trust-actions">
							<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'יצירת קשר', 'justice-theme' ); ?></a>
							<a class="button button--ghost" href="<?php echo esc_url( home_url( '/site-map/' ) ); ?>"><?php esc_html_e( 'מפת אתר', 'justice-theme' ); ?></a>
						</div>
					</section>

					<aside class="jt-trust-panel" aria-labelledby="jt-about-trust-title">
						<h2 id="jt-about-trust-title"><?php esc_html_e( 'גבולות ואחריות', 'justice-theme' ); ?></h2>
						<p><?php esc_html_e( 'המידע באתר הוא מידע כללי בלבד. הוא אינו מחליף ייעוץ משפטי, אינו מבטיח תוצאה, ואינו יוצר יחסי עורך דין-לקוח.', 'justice-theme' ); ?></p>
						<p><?php esc_html_e( 'המטרה היא לעזור להבין מושגים, מסלולים ושאלות שכדאי להכין לפני פנייה מקצועית.', 'justice-theme' ); ?></p>
						<div class="jt-trust-links">
							<a class="button button--ghost" href="<?php echo esc_url( home_url( '/articles/' ) ); ?>"><?php esc_html_e( 'מאמרים משפטיים', 'justice-theme' ); ?></a>
							<a class="button button--ghost" href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>"><?php esc_html_e( 'עורכי דין', 'justice-theme' ); ?></a>
						</div>
					</aside>
				</div>
			<?php endif; ?>
		</div>
	</main>
	<?php
	get_footer();
}

/**
 * Serve lightweight trust pages before redirect helpers can convert them to 404s.
 */
function justice_theme_maybe_render_trust_route(): void {
	$config = justice_theme_get_trust_route_config( justice_theme_trust_route_request_path() );

	if ( empty( $config ) ) {
		return;
	}

	justice_theme_prepare_trust_route( $config );
	justice_theme_render_trust_route_page( $config );
	exit;
}
add_action( 'template_redirect', 'justice_theme_maybe_render_trust_route', -3950 );
