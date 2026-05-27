<?php
/**
 * Site header partial.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_phone        = justice_theme_option( 'justice_phone', '0525101555' );
$justice_whatsapp_url = function_exists( 'justice_theme_public_whatsapp_url' )
	? justice_theme_public_whatsapp_url( __( 'שלום, אני צריך/ה עזרה משפטית דרך Jus-Tice ואשמח לחזרה קצרה.', 'justice-theme' ) )
	: '';
$justice_topic_links = array(
	array(
		'label' => __( 'עורך דין גירושין', 'justice-theme' ),
		'url'   => justice_theme_safe_public_link( '/divorce-lawyer/', '/family-law/' ),
	),
	array(
		'label' => __( 'עורך דין פלילי', 'justice-theme' ),
		'url'   => justice_theme_safe_public_link( '/criminal-defense-attorney/', '/criminal-law/' ),
	),
	array(
		'label' => __( 'עורך דין מקרקעין', 'justice-theme' ),
		'url'   => home_url( '/practice-areas/real-estate-law/' ),
	),
	array(
		'label' => __( 'רשלנות רפואית', 'justice-theme' ),
		'url'   => home_url( '/medical-malpractice-lawyer/' ),
	),
	array(
		'label' => __( 'נזיקין ותאונות', 'justice-theme' ),
		'url'   => home_url( '/tort-lawyer/' ),
	),
	array(
		'label' => __( 'תעבורה', 'justice-theme' ),
		'url'   => justice_theme_safe_public_link( '/traffic-lawyer/', '/lawyers/?area=traffic-law' ),
	),
	array(
		'label' => __( 'עבודה', 'justice-theme' ),
		'url'   => home_url( '/practice-areas/labor-law/' ),
	),
	array(
		'label' => __( 'ירושה וצוואות', 'justice-theme' ),
		'url'   => justice_theme_safe_public_link( '/inheritance-lawyer/', '/lawyers/?area=inheritance-law' ),
	),
	array(
		'label' => __( 'אבחון משפטי חכם', 'justice-theme' ),
		'url'   => justice_theme_safe_public_link( '/legal-tools/ai-intake/', '/#ask-lawyer' ),
	),
);
?>

<header class="site-header" role="banner">
	<div class="site-header__top">
		<div class="container site-header__top-inner">
			<p class="site-header__trust">
				<?php esc_html_e( 'מידע משפטי, התאמת עורכי דין וייעוץ מעשי.', 'justice-theme' ); ?>
			</p>

			<nav class="site-header__secondary-nav" aria-label="<?php esc_attr_e( 'ניווט משני', 'justice-theme' ); ?>">
				<?php
				wp_nav_menu( array(
					'theme_location' => 'secondary',
					'container'      => false,
					'fallback_cb'    => false,
					'depth'          => 1,
				) );
				?>
			</nav>
		</div>
	</div>

	<div class="site-header__main">
		<div class="container site-header__main-inner">
			<div class="site-branding">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<a class="brand-lockup brand-lockup--justice" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Jus-Tice" dir="ltr">
						<span class="brand-lockup__icon" aria-hidden="true">
							<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/favicon-512.png' ); ?>" alt="" width="38" height="38" loading="eager" decoding="async">
						</span>
						<span class="brand-lockup__wordmark" aria-hidden="true">
							<span>Jus</span><span class="brand-lockup__red-dot"></span><span>Tice</span>
						</span>
						<span class="brand-lockup__text">
							<span class="brand-lockup__name">Jus-Tice</span>
							<span class="brand-lockup__tagline">פורטל משפטי חכם</span>
						</span>
					</a>
				<?php endif; ?>
			</div>

			<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu">
				<span class="menu-toggle__icon" aria-hidden="true"></span>
				<span class="screen-reader-text"><?php esc_html_e( 'פתיחת תפריט ניווט', 'justice-theme' ); ?></span>
			</button>

			<nav class="primary-navigation" aria-label="<?php esc_attr_e( 'ניווט ראשי', 'justice-theme' ); ?>">
				<?php
				wp_nav_menu( array(
					'theme_location' => 'primary',
					'menu_id'        => 'primary-menu',
					'container'      => false,
					'fallback_cb'    => 'justice_theme_fallback_menu',
				) );
				?>
			</nav>

			<div class="site-header__lead-actions" aria-label="<?php esc_attr_e( 'פעולות מהירות לקבלת עזרה משפטית', 'justice-theme' ); ?>">
				<?php if ( $justice_whatsapp_url ) : ?>
					<a class="site-header__whatsapp button button--whatsapp-inline" href="<?php echo esc_url( $justice_whatsapp_url ); ?>" target="_blank" rel="noopener" data-whatsapp-surface="site_header" data-lead-utm-source="site_header" data-lead-utm-medium="whatsapp" data-lead-utm-campaign="public_legal_help">
						<?php esc_html_e( 'וואטסאפ', 'justice-theme' ); ?>
					</a>
				<?php endif; ?>

				<?php if ( $justice_phone ) : ?>
					<a class="site-header__cta button button--gold" href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $justice_phone ) ); ?>">
						<?php echo esc_html( $justice_phone ); ?>
					</a>
				<?php endif; ?>
			</div>

			<div class="site-header__lawyer-actions" aria-label="<?php esc_attr_e( 'פעולות לעורכי דין', 'justice-theme' ); ?>">
				<a class="site-header__lawyer-link" href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>">
					<span class="site-header__lawyer-label-full"><?php esc_html_e( 'לעורכי דין', 'justice-theme' ); ?></span>
					<span class="site-header__lawyer-label-short"><?php esc_html_e( 'עו"ד', 'justice-theme' ); ?></span>
				</a>
				<a class="site-header__lawyer-link site-header__lawyer-link--plans" href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>">
					<span class="site-header__lawyer-label-full"><?php esc_html_e( 'מסלולים', 'justice-theme' ); ?></span>
					<span class="site-header__lawyer-label-short"><?php esc_html_e( 'תשלום', 'justice-theme' ); ?></span>
				</a>
			</div>
		</div>
	</div>

	<nav class="site-header__topic-strip" aria-label="<?php esc_attr_e( 'ניווט מהיר לתחומי משפט מרכזיים', 'justice-theme' ); ?>">
		<div class="container site-header__topic-strip-inner">
			<span class="site-header__topic-label"><?php esc_html_e( 'תחומי חיפוש מרכזיים', 'justice-theme' ); ?></span>
			<?php foreach ( $justice_topic_links as $justice_topic_link ) : ?>
				<a href="<?php echo esc_url( $justice_topic_link['url'] ); ?>"><?php echo esc_html( $justice_topic_link['label'] ); ?></a>
			<?php endforeach; ?>
		</div>
	</nav>
</header>
<?php

/**
 * Fallback menu when no menu is assigned.
 * Shows a full premium navigation auto-pulled from taxonomy where possible.
 */
function justice_theme_fallback_menu() {
	$practice_terms = get_terms( array(
		'taxonomy'   => 'practice-areas',
		'hide_empty' => false,
		'number'     => 10,
		'orderby'    => 'count',
		'order'      => 'DESC',
	) );
	?>
	<ul id="primary-menu" class="menu">
		<li class="menu-item"><a href="<?php echo esc_url( home_url( '/' ) ); ?>">עמוד הבית</a></li>

		<li class="menu-item menu-item-has-children">
			<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>">עורכי דין</a>
		</li>

		<li class="menu-item menu-item-has-children">
			<a href="#">תחומי משפט</a>
			<?php if ( ! empty( $practice_terms ) && ! is_wp_error( $practice_terms ) ) : ?>
				<ul class="sub-menu">
					<?php foreach ( $practice_terms as $term ) : ?>
						<li class="menu-item">
							<a href="<?php echo esc_url( justice_theme_public_term_link( $term ) ); ?>">
								<?php echo esc_html( $term->name ); ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php else : ?>
				<ul class="sub-menu">
					<li class="menu-item"><a href="<?php echo esc_url( home_url( '/lawyers/?area=family-law' ) ); ?>">משפחה וגירושין</a></li>
					<li class="menu-item"><a href="<?php echo esc_url( home_url( '/lawyers/?area=criminal-law' ) ); ?>">משפט פלילי</a></li>
					<li class="menu-item"><a href="<?php echo esc_url( home_url( '/lawyers/?area=real-estate-law' ) ); ?>">מקרקעין ונדל"ן</a></li>
					<li class="menu-item"><a href="<?php echo esc_url( home_url( '/lawyers/?area=labor-law' ) ); ?>">דיני עבודה</a></li>
					<li class="menu-item"><a href="<?php echo esc_url( home_url( '/lawyers/?area=personal-injury-law' ) ); ?>">נזיקין ותאונות</a></li>
					<li class="menu-item"><a href="<?php echo esc_url( home_url( '/lawyers/?area=traffic-law' ) ); ?>">תעבורה</a></li>
					<li class="menu-item"><a href="<?php echo esc_url( home_url( '/lawyers/?area=inheritance-law' ) ); ?>">ירושה וצוואות</a></li>
					<li class="menu-item"><a href="<?php echo esc_url( home_url( '/lawyers/?area=tax-law' ) ); ?>">מיסים</a></li>
				</ul>
			<?php endif; ?>
		</li>

		<li class="menu-item"><a href="<?php echo esc_url( home_url( '/articles/' ) ); ?>">מאמרים משפטיים</a></li>
		<li class="menu-item"><a href="<?php echo esc_url( justice_theme_safe_public_link( '/legal-tools/', '/#ask-lawyer' ) ); ?>">כלים משפטיים</a></li>
		<li class="menu-item"><a href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>">הצטרפות עורכי דין</a></li>
		<li class="menu-item menu-item--cta"><a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>">מצאו עורך דין</a></li>
	</ul>
	<?php
}
