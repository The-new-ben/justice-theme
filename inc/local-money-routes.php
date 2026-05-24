<?php
/**
 * Controlled local-money support routes.
 *
 * These routes let us publish source-audited support content quickly while the
 * CMS cleanup continues. If a real published CMS item later owns the same slug,
 * the controlled route yields to the CMS item.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return controlled local-money route configs.
 *
 * @return array<string,array<string,mixed>>
 */
function justice_theme_get_local_money_route_configs(): array {
	return array(
		'/real-estate-lawyer-modiin/' => array(
			'slug'           => 'real-estate-lawyer-modiin',
			'file'           => 'real-estate-lawyer-modiin-he.md',
			'title'          => 'עורך דין מקרקעין במודיעין: מדריך לקונים, מוכרים ובעלי דירות',
			'eyebrow'        => 'מדריך מקומי לעסקאות נדל"ן',
			'description'    => 'מה לבדוק לפני קניית דירה, מכירת דירה, חוזה מכר, אישור עירייה לטאבו, מס שבח, מס רכישה ורישום זכויות במודיעין-מכבים-רעות.',
			'canonical_path' => '/real-estate-lawyer-modiin/',
			'cluster_url'    => '/real-estate-attorney/',
			'cluster_label'  => 'עורך דין מקרקעין בישראל',
			'date_published' => '2026-05-24T00:00:00+03:00',
			'date_modified'  => '2026-05-24T00:00:00+03:00',
			'priority'       => '0.8',
		),
	);
}

/**
 * Return current normalized request path.
 */
function justice_theme_local_money_request_path(): string {
	$request_uri  = isset( $_SERVER['REQUEST_URI'] ) ? (string) wp_unslash( $_SERVER['REQUEST_URI'] ) : '';
	$request_path = (string) wp_parse_url( $request_uri, PHP_URL_PATH );

	return '/' . trim( $request_path, '/' ) . '/';
}

/**
 * Return the current local-money route config.
 */
function justice_theme_current_local_money_route_config(): ?array {
	if ( is_admin() || wp_doing_ajax() || wp_doing_cron() ) {
		return null;
	}

	$path = justice_theme_local_money_request_path();
	$map  = justice_theme_get_local_money_route_configs();

	return $map[ $path ] ?? null;
}

/**
 * Do not override a real published CMS article/page if one later exists.
 *
 * @param array $config Route config.
 */
function justice_theme_local_money_route_has_published_cms_owner( array $config ): bool {
	$slug       = sanitize_title( (string) ( $config['slug'] ?? '' ) );
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
 * Read the route Markdown file.
 *
 * @param array $config Route config.
 */
function justice_theme_read_local_money_markdown( array $config ): string {
	$file = sanitize_file_name( (string) ( $config['file'] ?? '' ) );
	if ( '' === $file ) {
		return '';
	}

	$path = JUSTICE_THEME_DIR . '/content-drafts/' . $file;
	if ( ! is_readable( $path ) ) {
		return '';
	}

	$raw = file_get_contents( $path );
	return false === $raw ? '' : $raw;
}

/**
 * Build public article HTML from the repo Markdown.
 *
 * @param string $raw Raw Markdown.
 */
function justice_theme_local_money_markdown_to_html( string $raw ): string {
	$public_raw = preg_replace( '/^#\s+.+(?:\r\n|\r|\n)?/u', '', $raw, 1 );
	$public_raw = is_string( $public_raw ) ? $public_raw : $raw;

	if ( function_exists( 'justice_theme_strip_internal_publication_note' ) ) {
		$public_raw = justice_theme_strip_internal_publication_note( $public_raw );
	}

	if ( function_exists( 'justice_theme_markdown_draft_to_html' ) ) {
		return justice_theme_markdown_draft_to_html( $public_raw );
	}

	return wp_kses_post( wpautop( esc_html( $public_raw ) ) );
}

/**
 * Mark the current route as an indexable 200 page and apply SEO metadata.
 *
 * @param array  $config Route config.
 * @param string $html Rendered HTML.
 */
function justice_theme_prepare_local_money_route_meta( array $config, string $html ): void {
	global $wp_query;

	if ( $wp_query instanceof WP_Query ) {
		$wp_query->is_404      = false;
		$wp_query->is_page     = true;
		$wp_query->is_singular = true;
	}

	status_header( 200 );

	if ( ! headers_sent() ) {
		header( 'X-Justice-Route-Guard: local-money-route', true );
	}

	$title         = trim( wp_strip_all_tags( (string) ( $config['title'] ?? '' ) ) );
	$description   = trim( wp_strip_all_tags( (string) ( $config['description'] ?? '' ) ) );
	$canonical_url = justice_theme_public_url( home_url( (string) ( $config['canonical_path'] ?? '/' ) ) );

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
			$classes[] = 'justice-local-money-page';
			return $classes;
		}
	);
	add_action(
		'wp_head',
		static function () use ( $config, $html, $canonical_url ): void {
			justice_theme_print_local_money_route_schema( $config, $html, $canonical_url );
		},
		23
	);
}

/**
 * Print Article, Breadcrumb and FAQ schema for a controlled local-money route.
 *
 * @param array  $config Route config.
 * @param string $html Rendered HTML.
 * @param string $canonical_url Canonical URL.
 */
function justice_theme_print_local_money_route_schema( array $config, string $html, string $canonical_url ): void {
	if ( ! function_exists( 'justice_theme_print_schema' ) ) {
		return;
	}

	$home_url = justice_theme_public_url( home_url( '/' ) );
	$author   = function_exists( 'justice_theme_authority_organization_schema' )
		? justice_theme_authority_organization_schema()
		: array(
			'@type' => 'Organization',
			'@id'   => $home_url . '#organization',
			'name'  => get_bloginfo( 'name' ) ?: 'Jus-Tice',
			'url'   => $home_url,
		);

	justice_theme_print_schema(
		array(
			'@context'         => 'https://schema.org',
			'@type'            => 'Article',
			'@id'              => esc_url_raw( $canonical_url ) . '#article',
			'headline'         => wp_strip_all_tags( (string) ( $config['title'] ?? '' ) ),
			'description'      => wp_strip_all_tags( (string) ( $config['description'] ?? '' ) ),
			'datePublished'    => (string) ( $config['date_published'] ?? gmdate( DATE_W3C ) ),
			'dateModified'     => (string) ( $config['date_modified'] ?? gmdate( DATE_W3C ) ),
			'inLanguage'       => 'he',
			'mainEntityOfPage' => esc_url_raw( $canonical_url ),
			'author'           => $author,
			'publisher'        => array(
				'@type' => 'LegalService',
				'@id'   => $home_url . '#organization',
				'name'  => get_bloginfo( 'name' ) ?: 'Jus-Tice',
				'url'   => $home_url,
			),
			'about'            => array(
				'@type' => 'Thing',
				'name'  => 'Real Estate Law in Israel',
			),
		)
	);

	justice_theme_print_breadcrumb_schema(
		array(
			array(
				'name' => get_bloginfo( 'name' ) ?: 'Jus-Tice',
				'url'  => $home_url,
			),
			array(
				'name' => (string) ( $config['cluster_label'] ?? 'מקרקעין' ),
				'url'  => home_url( (string) ( $config['cluster_url'] ?? '/real-estate-attorney/' ) ),
			),
			array(
				'name' => (string) ( $config['title'] ?? '' ),
				'url'  => $canonical_url,
			),
		)
	);

	$questions = justice_theme_local_money_route_faq_schema_items( $html );
	if ( ! empty( $questions ) ) {
		justice_theme_print_schema(
			array(
				'@context'   => 'https://schema.org',
				'@type'      => 'FAQPage',
				'mainEntity' => $questions,
			)
		);
	}
}

/**
 * Extract FAQ schema from the rendered Markdown HTML.
 *
 * @param string $html Rendered HTML.
 * @return array<int,array<string,mixed>>
 */
function justice_theme_local_money_route_faq_schema_items( string $html ): array {
	$faq_start = mb_strpos( wp_strip_all_tags( $html ), 'שאלות נפוצות' );
	if ( false === $faq_start ) {
		return array();
	}

	$questions = array();
	if ( preg_match_all( '/<h3[^>]*>(.+?)<\/h3>\s*<p>(.+?)<\/p>/us', $html, $matches, PREG_SET_ORDER ) ) {
		foreach ( $matches as $match ) {
			$question = trim( wp_strip_all_tags( $match[1] ) );
			$answer   = trim( wp_strip_all_tags( $match[2] ) );

			if ( mb_strlen( $question ) < 8 || mb_strlen( $answer ) < 20 ) {
				continue;
			}

			$questions[] = array(
				'@type'          => 'Question',
				'name'           => $question,
				'acceptedAnswer' => array(
					'@type' => 'Answer',
					'text'  => $answer,
				),
			);
		}
	}

	return array_slice( $questions, 0, 8 );
}

/**
 * Render a controlled local-money route before 404 redirect plugins can run.
 */
function justice_theme_render_local_money_route(): void {
	$config = justice_theme_current_local_money_route_config();
	if ( null === $config || justice_theme_local_money_route_has_published_cms_owner( $config ) ) {
		return;
	}

	$raw = justice_theme_read_local_money_markdown( $config );
	if ( '' === trim( $raw ) ) {
		return;
	}

	$html       = justice_theme_local_money_markdown_to_html( $raw );
	$word_count = function_exists( 'justice_theme_count_content_draft_words' )
		? justice_theme_count_content_draft_words( $raw )
		: str_word_count( wp_strip_all_tags( $raw ) );

	justice_theme_prepare_local_money_route_meta( $config, $html );

	get_header();
	?>
	<style>
		.jt-local-money-route {
			background: #f6f8fb;
			color: #14213d;
		}
		.jt-local-money-route__hero {
			padding: clamp(52px, 7vw, 86px) 0 30px;
			background: linear-gradient(180deg, #ffffff 0%, #f6f8fb 100%);
		}
		.jt-local-money-route__inner,
		.jt-local-money-route__hero-inner {
			width: min(1120px, calc(100% - 32px));
			margin: 0 auto;
		}
		.jt-local-money-route__eyebrow {
			margin: 0 0 10px;
			color: #c1121f;
			font-weight: 900;
		}
		.jt-local-money-route h1 {
			max-width: 900px;
			margin: 0;
			font-size: clamp(2rem, 4vw, 3.35rem);
			line-height: 1.14;
			letter-spacing: 0;
		}
		.jt-local-money-route__intro {
			max-width: 820px;
			margin: 18px 0 0;
			color: #42526b;
			font-size: 1.08rem;
			line-height: 1.78;
		}
		.jt-local-money-route__facts {
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			margin: 22px 0 0;
			padding: 0;
			list-style: none;
		}
		.jt-local-money-route__facts li {
			border: 1px solid rgba(20,33,61,0.1);
			border-radius: 999px;
			padding: 8px 12px;
			background: #fff;
			color: #344563;
			font-weight: 800;
			font-size: 0.9rem;
		}
		.jt-local-money-route__inner {
			display: grid;
			grid-template-columns: minmax(0, 1fr) minmax(290px, 370px);
			gap: 24px;
			align-items: start;
			padding: 28px 0 76px;
		}
		.jt-local-money-route__content,
		.jt-local-money-route__aside-card {
			background: #fff;
			border: 1px solid #dde5ee;
			border-radius: 8px;
			box-shadow: 0 10px 24px rgba(20,33,61,0.06);
		}
		.jt-local-money-route__content {
			padding: clamp(20px, 3vw, 34px);
		}
		.jt-local-money-route__content h2 {
			margin: 34px 0 12px;
			font-size: clamp(1.42rem, 2vw, 2rem);
			line-height: 1.32;
			letter-spacing: 0;
		}
		.jt-local-money-route__content h2:first-child {
			margin-top: 0;
		}
		.jt-local-money-route__content h3 {
			margin: 24px 0 10px;
			font-size: 1.16rem;
			line-height: 1.38;
			letter-spacing: 0;
		}
		.jt-local-money-route__content p,
		.jt-local-money-route__content li {
			color: #42526b;
			font-size: 1.02rem;
			line-height: 1.82;
		}
		.jt-local-money-route__content a {
			color: #b91c1c;
			font-weight: 800;
		}
		.jt-local-money-route__content ul {
			padding-inline-start: 1.25rem;
		}
		.jt-local-money-route__aside {
			position: sticky;
			top: 128px;
			display: grid;
			gap: 16px;
		}
		.jt-local-money-route__aside-card {
			padding: 20px;
		}
		.jt-local-money-route__aside-card h2,
		.jt-local-money-route__aside-card h3 {
			margin: 0 0 10px;
			font-size: 1.22rem;
			line-height: 1.35;
			letter-spacing: 0;
		}
		.jt-local-money-route__aside-card p {
			color: #42526b;
			line-height: 1.7;
		}
		.jt-local-money-route__actions {
			display: grid;
			gap: 10px;
			margin-top: 14px;
		}
		.jt-local-money-route__note {
			margin-top: 28px;
			padding-top: 18px;
			border-top: 1px solid #edf1f6;
			color: #5c6b80;
			font-size: 0.94rem;
		}
		@media (max-width: 900px) {
			.jt-local-money-route__inner {
				grid-template-columns: 1fr;
			}
			.jt-local-money-route__aside {
				position: static;
			}
		}
	</style>

	<main id="primary" class="site-main jt-local-money-route" dir="rtl">
		<section class="jt-local-money-route__hero" aria-labelledby="jt-local-money-route-title">
			<div class="jt-local-money-route__hero-inner">
				<p class="jt-local-money-route__eyebrow"><?php echo esc_html( (string) ( $config['eyebrow'] ?? '' ) ); ?></p>
				<h1 id="jt-local-money-route-title"><?php echo esc_html( (string) ( $config['title'] ?? '' ) ); ?></h1>
				<p class="jt-local-money-route__intro"><?php echo esc_html( (string) ( $config['description'] ?? '' ) ); ?></p>
				<ul class="jt-local-money-route__facts" aria-label="<?php esc_attr_e( 'בדיקות תוכן', 'justice-theme' ); ?>">
					<li><?php echo esc_html( number_format_i18n( (int) $word_count ) ); ?>+ <?php esc_html_e( 'מילים', 'justice-theme' ); ?></li>
					<li><?php esc_html_e( 'מקורות רשמיים', 'justice-theme' ); ?></li>
					<li><?php esc_html_e( 'קישור לאשכול מקרקעין', 'justice-theme' ); ?></li>
				</ul>
			</div>
		</section>

		<div class="jt-local-money-route__inner">
			<article class="jt-local-money-route__content" aria-label="<?php echo esc_attr( (string) ( $config['title'] ?? '' ) ); ?>">
				<?php echo wp_kses_post( $html ); ?>
				<p class="jt-local-money-route__note"><?php esc_html_e( 'המידע במדריך כללי בלבד ואינו מחליף ייעוץ משפטי, ייעוץ מס, ייעוץ שמאי או בדיקה פרטנית של מסמכי העסקה.', 'justice-theme' ); ?></p>
			</article>

			<aside class="jt-local-money-route__aside" aria-label="<?php esc_attr_e( 'פעולות המשך', 'justice-theme' ); ?>">
				<section class="jt-local-money-route__aside-card">
					<h2><?php esc_html_e( 'צריכים עורך דין מקרקעין?', 'justice-theme' ); ?></h2>
					<p><?php esc_html_e( 'השאירו פרטים קצרים וננתב את הפנייה לפי תחום, עיר ודחיפות. אל תשלחו מידע רגיש במיוחד לפני שנוצר קשר ישיר עם עורך דין.', 'justice-theme' ); ?></p>
					<div class="jt-local-money-route__actions">
						<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/?area=real-estate-law&city=modiin&source=real-estate-lawyer-modiin' ) ); ?>"><?php esc_html_e( 'השארת פנייה', 'justice-theme' ); ?></a>
						<a class="button button--outline" href="<?php echo esc_url( home_url( (string) ( $config['cluster_url'] ?? '/real-estate-attorney/' ) ) ); ?>"><?php esc_html_e( 'מדריך מקרקעין מרכזי', 'justice-theme' ); ?></a>
					</div>
				</section>

				<section class="jt-local-money-route__aside-card">
					<h3><?php esc_html_e( 'לעורכי דין במקרקעין', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'אם אתם מקבלים עסקאות נדל"ן באזור מודיעין, אפשר להצטרף למסלול פרופיל, תוכן ופניות מדידות.', 'justice-theme' ); ?></p>
					<div class="jt-local-money-route__actions">
						<a class="button button--gold" href="<?php echo esc_url( home_url( '/lawyer-plans/?practice=real-estate-law&city=modiin' ) ); ?>"><?php esc_html_e( 'מסלולים לעורכי דין', 'justice-theme' ); ?></a>
						<a class="button button--outline" href="<?php echo esc_url( home_url( '/lawyer-registration/?practice=real-estate-law&city=modiin' ) ); ?>"><?php esc_html_e( 'פתיחת פרופיל', 'justice-theme' ); ?></a>
					</div>
				</section>
			</aside>
		</div>
	</main>
	<?php
	get_footer();
	exit;
}
add_action( 'template_redirect', 'justice_theme_render_local_money_route', -999999 );

/**
 * Expose route URLs to the custom REST sitemap.
 *
 * @return array<int,array<string,string>>
 */
function justice_theme_local_money_route_sitemap_entries(): array {
	$entries = array();

	foreach ( justice_theme_get_local_money_route_configs() as $config ) {
		if ( justice_theme_local_money_route_has_published_cms_owner( $config ) ) {
			continue;
		}

		if ( '' === justice_theme_read_local_money_markdown( $config ) ) {
			continue;
		}

		$entries[] = array(
			'loc'        => justice_theme_public_url( home_url( (string) ( $config['canonical_path'] ?? '/' ) ) ),
			'priority'   => (string) ( $config['priority'] ?? '0.7' ),
			'changefreq' => 'monthly',
			'lastmod'    => (string) ( $config['date_modified'] ?? gmdate( 'Y-m-d\TH:i:s+00:00' ) ),
		);
	}

	return $entries;
}
