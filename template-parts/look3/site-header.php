<?php
/**
 * Site header, new look (v3). Rendered only when the new look is active.
 *
 * 64px navy bar: brand, code-defined nav (language-bank labels), phone,
 * WhatsApp, hamburger. 40px topics bar underneath: "כל תחומי העיסוק"
 * mega trigger, head-term links, "אבחון משפטי ראשוני".
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_phone        = justice_theme_option( 'justice_phone', '0525101555' );
$justice_phone_href   = 'tel:' . preg_replace( '/[^0-9+]/', '', $justice_phone );
$justice_whatsapp_url = function_exists( 'justice_theme_public_whatsapp_url' )
	? justice_theme_public_whatsapp_url( __( 'שלום, אני צריך/ה עזרה משפטית דרך Jus-Tice ואשמח לחזרה קצרה.', 'justice-theme' ) )
	: '';

$justice_nav_items = justice_theme_look3_nav_items();

// Practice routes may isolate the topics bar to their own ecosystem.
$justice_topic_links = isset( $GLOBALS['justice_practice_scope'] ) && is_array( $GLOBALS['justice_practice_scope'] ) && ! empty( $GLOBALS['justice_practice_scope'] )
	? $GLOBALS['justice_practice_scope']
	: justice_theme_look3_topics( 7 );

$justice_mega_html = justice_theme_look3_mega_menu_html();
?>

<header class="site-header l3-header" role="banner">
	<div class="l3-header__main">
		<a class="l3-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Jus-Tice">
			<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/favicon-512.png' ); ?>" alt="" width="30" height="30" loading="eager" decoding="async">
			<span dir="ltr">Jus-Tice</span>
		</a>

		<nav class="primary-navigation l3-nav" aria-label="<?php esc_attr_e( 'ניווט ראשי', 'justice-theme' ); ?>">
			<ul id="primary-menu" class="menu">
				<?php foreach ( $justice_nav_items as $justice_nav_item ) : ?>
					<?php if ( ! empty( $justice_nav_item['mega'] ) && '' !== $justice_mega_html ) : ?>
						<li class="l3-nav__mega-item">
							<?php justice_theme_look3_mega_trigger( $justice_nav_item['label'], 'l3-nav__mega-trigger' ); ?>
							<a class="l3-nav__mega-fallback" href="<?php echo esc_url( $justice_nav_item['url'] ); ?>"><?php echo esc_html( $justice_nav_item['label'] ); ?></a>
						</li>
					<?php else : ?>
						<li><a href="<?php echo esc_url( $justice_nav_item['url'] ); ?>"><?php echo esc_html( $justice_nav_item['label'] ); ?></a></li>
					<?php endif; ?>
				<?php endforeach; ?>
				<li class="l3-nav__phone"><a href="<?php echo esc_url( $justice_phone_href ); ?>" dir="ltr"><?php echo esc_html( $justice_phone ); ?></a></li>
			</ul>
		</nav>

		<div class="l3-header__actions">
			<?php if ( $justice_phone ) : ?>
				<a class="l3-header__phone" href="<?php echo esc_url( $justice_phone_href ); ?>" dir="ltr"><?php echo esc_html( $justice_phone ); ?></a>
			<?php endif; ?>
			<?php if ( $justice_whatsapp_url ) : ?>
				<a class="l3-header__whatsapp" href="<?php echo esc_url( $justice_whatsapp_url ); ?>" target="_blank" rel="noopener" data-whatsapp-surface="site_header" data-lead-utm-source="site_header" data-lead-utm-medium="whatsapp" data-lead-utm-campaign="public_legal_help">
					<?php esc_html_e( 'וואטסאפ', 'justice-theme' ); ?>
				</a>
			<?php endif; ?>
			<button class="menu-toggle l3-header__toggle" type="button" aria-expanded="false" aria-controls="primary-menu">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16"></path><path d="M4 12h16"></path><path d="M4 17h16"></path></svg>
				<span class="screen-reader-text"><?php esc_html_e( 'פתיחת תפריט ניווט', 'justice-theme' ); ?></span>
			</button>
		</div>
	</div>

	<div class="l3-topics" aria-label="<?php esc_attr_e( 'תחומי עיסוק מרכזיים', 'justice-theme' ); ?>">
		<?php if ( '' !== $justice_mega_html ) : ?>
			<?php justice_theme_look3_mega_trigger( __( 'כל תחומי העיסוק', 'justice-theme' ), 'l3-topics__all' ); ?>
		<?php endif; ?>
		<?php foreach ( $justice_topic_links as $justice_topic_link ) : ?>
			<a class="l3-topics__link" href="<?php echo esc_url( $justice_topic_link['url'] ); ?>"><?php echo esc_html( $justice_topic_link['label'] ); ?></a>
		<?php endforeach; ?>
		<a class="l3-topics__triage" href="<?php echo esc_url( justice_theme_look3_triage_url() ); ?>"><?php esc_html_e( 'אבחון משפטי ראשוני', 'justice-theme' ); ?></a>
	</div>

	<?php echo $justice_mega_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- built from escaped parts in justice_theme_look3_mega_menu_html(). ?>
</header>
