<?php
/**
 * Lost visitor rescue route.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_not_found_rescue_path(): string {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = (string) wp_parse_url( $request_uri, PHP_URL_PATH );

	return '/' . trim( $request_path, '/' ) . '/';
}

function justice_theme_prepare_not_found_rescue_route(): void {
	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->is_404  = false;
		$wp_query->is_page = true;
	}

	status_header( 200 );

	if ( ! headers_sent() ) {
		header( 'X-Robots-Tag: noindex, follow', true );
		header( 'X-Justice-Route: not-found-rescue', true );
	}

	add_filter(
		'pre_get_document_title',
		static function (): string {
			return 'לא מצאתם את העמוד? | Jus-Tice';
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_title',
		static function (): string {
			return 'לא מצאתם את העמוד? | Jus-Tice';
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_metadesc',
		static function (): string {
			return 'הקישור שהגעתם ממנו אינו זמין. חפשו באתר, עברו לתחום משפטי מרכזי או השאירו פנייה מסודרת.';
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_canonical',
		static function (): string {
			return home_url( '/not-found-help/' );
		},
		PHP_INT_MAX
	);
	add_filter(
		'wpseo_robots',
		static function (): string {
			return 'noindex, follow';
		},
		PHP_INT_MAX
	);
	add_filter(
		'wp_robots',
		static function ( array $robots ): array {
			unset( $robots['index'] );
			$robots['noindex'] = true;
			$robots['follow']  = true;

			return $robots;
		},
		PHP_INT_MAX
	);
}

function justice_theme_render_not_found_rescue_route(): void {
	$links = array(
		array(
			'label' => 'עורך דין פלילי',
			'url'   => justice_theme_safe_public_link( '/criminal-defense-attorney/', '/practice-areas/criminal-law/' ),
		),
		array(
			'label' => 'דיני משפחה וגירושין',
			'url'   => justice_theme_safe_public_link( '/divorce-lawyer/', '/family-law/' ),
		),
		array(
			'label' => 'מקרקעין ונדל"ן',
			'url'   => justice_theme_safe_public_link( '/real-estate-lawyer/', '/lawyers/?area=real-estate-law' ),
		),
		array(
			'label' => 'נזיקין ותאונות',
			'url'   => justice_theme_safe_public_link( '/personal-injury-lawyer/', '/lawyers/?area=personal-injury-law' ),
		),
		array(
			'label' => 'דיני עבודה',
			'url'   => justice_theme_safe_public_link( '/employment-lawyer/', '/lawyers/?area=labor-law' ),
		),
		array(
			'label' => 'מיסים',
			'url'   => justice_theme_safe_public_link( '/tax-lawyer/', '/lawyers/?area=tax-law' ),
		),
	);

	get_header();
	?>
	<style>
		.jt-lost-page {
			background: #f6f8fb;
			color: #14213d;
		}
		.jt-lost-page__hero {
			background: linear-gradient(180deg, #ffffff 0%, #f6f8fb 100%);
			padding: clamp(46px, 7vw, 86px) 0 24px;
		}
		.jt-lost-page__inner {
			width: min(1120px, calc(100% - 32px));
			margin: 0 auto;
		}
		.jt-lost-page__eyebrow {
			margin: 0 0 10px;
			color: #c1121f;
			font-weight: 800;
		}
		.jt-lost-page h1 {
			margin: 0;
			font-size: clamp(2rem, 4vw, 3.35rem);
			line-height: 1.15;
			letter-spacing: 0;
		}
		.jt-lost-page__intro {
			max-width: 780px;
			margin: 16px 0 0;
			color: #42526b;
			font-size: 1.08rem;
			line-height: 1.75;
		}
		.jt-lost-page__grid {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(300px, 420px);
			gap: 22px;
			padding: 24px 0 72px;
			align-items: start;
		}
		.jt-lost-card {
			background: #fff;
			border: 1px solid #dde5ee;
			border-radius: 8px;
			padding: clamp(18px, 3vw, 30px);
			box-shadow: 0 8px 24px rgba(20, 33, 61, 0.06);
		}
		.jt-lost-card h2 {
			margin: 0 0 12px;
			font-size: 1.25rem;
			line-height: 1.35;
			letter-spacing: 0;
		}
		.jt-lost-links {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 10px;
			margin-top: 18px;
		}
		.jt-lost-links a {
			display: flex;
			align-items: center;
			min-height: 54px;
			border: 1px solid #dde5ee;
			border-radius: 8px;
			padding: 12px 14px;
			background: #fbfcfe;
			color: #14213d;
			font-weight: 800;
			text-decoration: none;
		}
		.jt-lost-actions {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin-top: 18px;
		}
		.jt-lost-note {
			margin-top: 16px;
			color: #5c6b80;
			font-size: 0.94rem;
			line-height: 1.7;
		}
		@media (max-width: 840px) {
			.jt-lost-page__grid,
			.jt-lost-links {
				grid-template-columns: 1fr;
			}
		}
	</style>
	<main id="primary" class="site-main jt-lost-page">
		<section class="jt-lost-page__hero">
			<div class="jt-lost-page__inner">
				<p class="jt-lost-page__eyebrow"><?php esc_html_e( 'הקישור השתנה', 'justice-theme' ); ?></p>
				<h1><?php esc_html_e( 'לא מצאתם את העמוד? נמצא את הדרך הנכונה.', 'justice-theme' ); ?></h1>
				<p class="jt-lost-page__intro"><?php esc_html_e( 'יכול להיות שהקישור ישן, שהעמוד עבר כתובת, או שהגעתם מתוצאה שכבר לא קיימת. אפשר לחפש באתר, לבחור תחום משפטי מרכזי, או להשאיר פנייה מסודרת.', 'justice-theme' ); ?></p>
			</div>
		</section>

		<div class="jt-lost-page__inner jt-lost-page__grid">
			<section class="jt-lost-card" aria-labelledby="jt-lost-search-title">
				<h2 id="jt-lost-search-title"><?php esc_html_e( 'חיפוש מהיר באתר', 'justice-theme' ); ?></h2>
				<?php get_template_part( 'template-parts/forms/search-form-legal' ); ?>

				<h2><?php esc_html_e( 'תחומים מרכזיים', 'justice-theme' ); ?></h2>
				<div class="jt-lost-links">
					<?php foreach ( $links as $link ) : ?>
						<a href="<?php echo esc_url( $link['url'] ); ?>"><?php echo esc_html( $link['label'] ); ?></a>
					<?php endforeach; ?>
				</div>

				<div class="jt-lost-actions">
					<a class="button button--gold" href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>"><?php esc_html_e( 'חיפוש עורכי דין', 'justice-theme' ); ?></a>
					<a class="button button--ghost" href="<?php echo esc_url( home_url( '/site-map/' ) ); ?>"><?php esc_html_e( 'מפת אתר', 'justice-theme' ); ?></a>
				</div>
			</section>

			<aside class="jt-lost-card" aria-labelledby="jt-lost-lead-title">
				<h2 id="jt-lost-lead-title"><?php esc_html_e( 'רוצים הכוונה לעורך דין?', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'השאירו פרטים קצרים וננסה לסווג את התחום, העיר והדחיפות כדי שהפנייה לא תלך לאיבוד.', 'justice-theme' ); ?></p>
				<?php get_template_part( 'template-parts/forms/lead-form' ); ?>
				<p class="jt-lost-note"><?php esc_html_e( 'הפנייה אינה ייעוץ משפטי ואינה יוצרת יחסי עורך דין-לקוח. במצב דחוף או עם מועד משפטי קרוב יש לפנות לעורך דין מוסמך מיד.', 'justice-theme' ); ?></p>
			</aside>
		</div>
	</main>
	<?php
	get_footer();
}

function justice_theme_maybe_render_not_found_rescue_route(): void {
	if ( '/not-found-help/' !== justice_theme_not_found_rescue_path() && '/404-help/' !== justice_theme_not_found_rescue_path() ) {
		return;
	}

	justice_theme_prepare_not_found_rescue_route();
	justice_theme_render_not_found_rescue_route();
	exit;
}
add_action( 'template_redirect', 'justice_theme_maybe_render_not_found_rescue_route', -4010 );

