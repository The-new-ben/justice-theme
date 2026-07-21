<?php
/**
 * Site header partial - redesign (SiteHeader.dc.html).
 *
 * Navy bar: brand, pill nav (CMS menu), phone, WhatsApp CTA, hamburger
 * below 920px. Topic bar underneath with the money-keyword links.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'justice_theme_fallback_menu' ) ) {
	/**
	 * Primary-menu fallback when no CMS menu is assigned. The old header
	 * referenced this callback without defining it anywhere, which was a
	 * latent fatal the moment the menu assignment disappears.
	 *
	 * @param array $args wp_nav_menu args (uses items_wrap and menu_id).
	 */
	function justice_theme_fallback_menu( $args = array() ) {
		$items = array(
			array( __( 'עמוד הבית', 'justice-theme' ), home_url( '/' ) ),
			array( __( 'עורכי דין', 'justice-theme' ), home_url( '/lawyers/' ) ),
			array( __( 'כלי AI משפטיים', 'justice-theme' ), home_url( '/legal-tools/' ) ),
			array( __( 'מאמרים', 'justice-theme' ), home_url( '/articles/' ) ),
			array( __( 'לעורכי דין', 'justice-theme' ), home_url( '/lawyer-plans/' ) ),
		);

		$list = '';
		foreach ( $items as $item ) {
			$list .= '<li><a href="' . esc_url( $item[1] ) . '">' . esc_html( $item[0] ) . '</a></li>';
		}

		$wrap    = isset( $args['items_wrap'] ) ? $args['items_wrap'] : '<ul id="%1$s" class="%2$s">%3$s</ul>';
		$menu_id = isset( $args['menu_id'] ) ? $args['menu_id'] : 'primary-menu';

		echo sprintf( $wrap, esc_attr( $menu_id ), 'menu', $list ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}

$justice_phone        = justice_theme_option( 'justice_phone', '0525101555' );
$justice_phone_href   = 'tel:' . preg_replace( '/[^0-9+]/', '', $justice_phone );
$justice_whatsapp_url = function_exists( 'justice_theme_public_whatsapp_url' )
	? justice_theme_public_whatsapp_url( __( 'שלום, אני צריך/ה עזרה משפטית דרך Jus-Tice ואשמח לחזרה קצרה.', 'justice-theme' ) )
	: '';

// Practice routes can isolate the topics bar to their own ecosystem
// (measured winner pattern: #1-#3 for רשלנות רפואית carry 0-3 off-topic
// practice anchors sitewide; cross-practice anchors dilute the pillar).
$justice_practice_scope = isset( $GLOBALS['justice_practice_scope'] ) && is_array( $GLOBALS['justice_practice_scope'] )
	? $GLOBALS['justice_practice_scope']
	: null;

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
		'label' => __( 'עורך דין רשלנות רפואית', 'justice-theme' ),
		'url'   => home_url( '/medical-malpractice-lawyer/' ),
	),
	array(
		'label' => __( 'עורך דין נזיקין ותאונות', 'justice-theme' ),
		'url'   => home_url( '/tort-lawyer/' ),
	),
	array(
		'label' => __( 'עורך דין תעבורה', 'justice-theme' ),
		'url'   => justice_theme_safe_public_link( '/traffic-lawyer/', '/lawyers/?area=traffic-law' ),
	),
	array(
		'label' => __( 'עורך דין דיני עבודה', 'justice-theme' ),
		'url'   => home_url( '/labor-lawyer/' ),
	),
	array(
		'label' => __( 'עורך דין ירושה וצוואות', 'justice-theme' ),
		'url'   => justice_theme_safe_public_link( '/inheritance-lawyer/', '/lawyers/?area=inheritance-law' ),
	),
	array(
		'label' => __( 'אבחון משפטי חכם', 'justice-theme' ),
		'url'   => justice_theme_safe_public_link( '/legal-tools/ai-intake/', '/legal-tools/' ),
	),
);

if ( null !== $justice_practice_scope && ! empty( $justice_practice_scope ) ) {
	$justice_topic_links = $justice_practice_scope;
}
?>

<header class="site-header jt2-header" role="banner">
	<div class="jt2-header__main">
		<a class="jt2-header__brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Jus-Tice">
			<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/favicon-512.png' ); ?>" alt="" width="36" height="36" loading="eager" decoding="async">
			<span dir="ltr">
				<span class="jt2-header__brand-name">Jus</span><span class="jt2-header__brand-dot"></span><span class="jt2-header__brand-name">Tice</span>
			</span>
		</a>

		<nav class="primary-navigation" aria-label="<?php esc_attr_e( 'ניווט ראשי', 'justice-theme' ); ?>">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'menu_id'        => 'primary-menu',
					'container'      => false,
					'fallback_cb'    => 'justice_theme_fallback_menu',
					'depth'          => 1,
					'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s<li class="jt2-nav-phone"><a href="' . esc_url( $justice_phone_href ) . '">' . esc_html( $justice_phone ) . '</a></li></ul>',
				)
			);
			?>
		</nav>

		<div class="jt2-header__actions">
			<?php if ( $justice_phone ) : ?>
				<a class="jt2-header__phone" href="<?php echo esc_url( $justice_phone_href ); ?>" dir="ltr"><?php echo esc_html( $justice_phone ); ?></a>
			<?php endif; ?>
			<?php if ( $justice_whatsapp_url ) : ?>
				<a class="jt2-header__whatsapp" href="<?php echo esc_url( $justice_whatsapp_url ); ?>" target="_blank" rel="noopener" data-whatsapp-surface="site_header" data-lead-utm-source="site_header" data-lead-utm-medium="whatsapp" data-lead-utm-campaign="public_legal_help">
					<?php esc_html_e( 'וואטסאפ', 'justice-theme' ); ?>
				</a>
			<?php endif; ?>
			<button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-menu">
				<span aria-hidden="true">&#9776;</span>
				<span class="screen-reader-text"><?php esc_html_e( 'פתיחת תפריט ניווט', 'justice-theme' ); ?></span>
			</button>
		</div>
	</div>

	<div class="jt2-header__topics" aria-label="<?php esc_attr_e( 'תחומי חיפוש מרכזיים', 'justice-theme' ); ?>">
		<span class="jt2-header__topics-label"><?php esc_html_e( 'תחומי חיפוש מרכזיים', 'justice-theme' ); ?></span>
		<div class="jt2-mega-wrap">
			<button type="button" class="jt2-mega-trigger" aria-haspopup="true" aria-controls="jt2-mega"><?php esc_html_e( 'כל תחומי המשפט', 'justice-theme' ); ?> <span aria-hidden="true">&#9662;</span></button>
			<?php echo wp_kses_post( function_exists( 'justice_theme_mega_menu_html' ) ? justice_theme_mega_menu_html() : '' ); ?>
		</div>
		<?php foreach ( $justice_topic_links as $justice_topic_link ) : ?>
			<a href="<?php echo esc_url( $justice_topic_link['url'] ); ?>"><?php echo esc_html( $justice_topic_link['label'] ); ?></a>
		<?php endforeach; ?>
	</div>
</header>
