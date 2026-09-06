<?php
/**
 * Site footer, new look (v3). Rendered only when the new look is active.
 *
 * Five hairline columns on deep navy: lawyers by practice area, lawyers by
 * city, agreements and forms, important information, quick navigation.
 * Then the disclaimer, the legal links and the business details.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_phone      = justice_theme_option( 'justice_phone', '0525101555' );
$justice_phone_href = 'tel:' . preg_replace( '/[^0-9+]/', '', $justice_phone );
$justice_email      = justice_theme_option( 'justice_email', 'info@jus-tice.co.il' );
$justice_address    = function_exists( 'justice_theme_business_address' )
	? justice_theme_business_address()
	: justice_theme_option( 'justice_business_address', 'רחוב ראול ולנברג 18, מתחם CU, מגדל C, קומה 2, תל אביב-יפו' );

$justice_directory  = justice_theme_look3_directory_url();
$justice_topics     = justice_theme_look3_topics( 8 );
$justice_cities     = justice_theme_look3_cities( 8 );
$justice_tools      = justice_theme_look3_tools( 5 );
$justice_simulation = justice_theme_look3_resolve( array( 'legal-simulation' ), 'https://jus-tice.com/' );
$justice_choose     = justice_theme_look3_resolve( array( 'find-lawyer-how-to-find-good-attorney' ), '/articles/' );
$justice_tariff     = justice_theme_look3_resolve( array( 'lawyer-fees-tariff' ), '/articles/' );

if ( ! $justice_cities ) {
	foreach ( array( 'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'ראשון לציון' ) as $justice_city_name ) {
		$justice_cities[] = array(
			'city'  => $justice_city_name,
			'label' => $justice_city_name,
			'url'   => add_query_arg( 'city', $justice_city_name, $justice_directory ),
		);
	}
}

$justice_footer_legal = array(
	array( __( 'תנאי שימוש', 'justice-theme' ), home_url( '/sample-terms-and-conditions-template/' ) ),
	array( __( 'מדיניות פרטיות', 'justice-theme' ), home_url( '/privacy/' ) ),
	array( __( 'הצהרת נגישות', 'justice-theme' ), home_url( '/accessibility/' ) ),
	array( __( 'ביטול ואספקה', 'justice-theme' ), home_url( '/cancellation/' ) ),
	array( __( 'מדיניות עריכה', 'justice-theme' ), home_url( '/editorial-policy/' ) ),
);
?>

<footer class="site-footer l3-footer" role="contentinfo">
	<div class="l3-footer__grid">
		<section class="l3-footer__col">
			<h2 class="l3-footer__title"><?php esc_html_e( 'עורכי דין לפי תחום', 'justice-theme' ); ?></h2>
			<?php foreach ( $justice_topics as $justice_topic ) : ?>
				<a href="<?php echo esc_url( $justice_topic['url'] ); ?>"><?php echo esc_html( $justice_topic['label'] ); ?></a>
			<?php endforeach; ?>
		</section>

		<section class="l3-footer__col">
			<h2 class="l3-footer__title"><?php esc_html_e( 'עורכי דין לפי עיר', 'justice-theme' ); ?></h2>
			<?php foreach ( $justice_cities as $justice_city ) : ?>
				<a href="<?php echo esc_url( $justice_city['url'] ); ?>"><?php echo esc_html( $justice_city['city'] ); ?></a>
			<?php endforeach; ?>
			<a href="<?php echo esc_url( $justice_directory ); ?>"><?php esc_html_e( 'חיפוש לפי תחום ועיר', 'justice-theme' ); ?></a>
		</section>

		<section class="l3-footer__col">
			<h2 class="l3-footer__title"><?php esc_html_e( 'הסכמים וטפסים', 'justice-theme' ); ?></h2>
			<?php foreach ( $justice_tools as $justice_tool ) : ?>
				<a href="<?php echo esc_url( $justice_tool['url'] ); ?>"><?php echo esc_html( $justice_tool['title'] ); ?></a>
			<?php endforeach; ?>
			<a href="<?php echo esc_url( justice_theme_look3_triage_url() ); ?>"><?php esc_html_e( 'אבחון משפטי ראשוני', 'justice-theme' ); ?></a>
			<?php if ( $justice_simulation ) : ?>
				<a href="<?php echo esc_url( $justice_simulation['url'] ); ?>"><?php esc_html_e( 'סימולציית בית משפט', 'justice-theme' ); ?></a>
			<?php endif; ?>
		</section>

		<section class="l3-footer__col">
			<h2 class="l3-footer__title"><?php esc_html_e( 'מידע חשוב', 'justice-theme' ); ?></h2>
			<a href="<?php echo esc_url( home_url( '/articles/' ) ); ?>"><?php esc_html_e( 'לכל המאמרים', 'justice-theme' ); ?></a>
			<?php if ( $justice_choose ) : ?>
				<a href="<?php echo esc_url( $justice_choose['url'] ); ?>"><?php esc_html_e( 'איך בוחרים עורך דין', 'justice-theme' ); ?></a>
			<?php endif; ?>
			<?php if ( $justice_tariff ) : ?>
				<a href="<?php echo esc_url( $justice_tariff['url'] ); ?>"><?php esc_html_e( 'שכר טרחה ומחירונים', 'justice-theme' ); ?></a>
			<?php endif; ?>
			<a href="<?php echo esc_url( home_url( '/#ask-lawyer' ) ); ?>"><?php esc_html_e( 'ייעוץ משפטי', 'justice-theme' ); ?></a>
			<a href="<?php echo esc_url( home_url( '/site-map/' ) ); ?>"><?php esc_html_e( 'מפת אתר', 'justice-theme' ); ?></a>
		</section>

		<section class="l3-footer__col">
			<h2 class="l3-footer__title"><?php esc_html_e( 'ניווט מהיר', 'justice-theme' ); ?></h2>
			<a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'אודות', 'justice-theme' ); ?></a>
			<a href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>"><?php esc_html_e( 'לעורכי דין: הצטרפות', 'justice-theme' ); ?></a>
			<a href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'מסלולים לעורכי דין', 'justice-theme' ); ?></a>
			<a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'יצירת קשר', 'justice-theme' ); ?></a>
			<?php if ( $justice_phone ) : ?>
				<a class="l3-footer__phone" href="<?php echo esc_url( $justice_phone_href ); ?>" dir="ltr"><?php echo esc_html( $justice_phone ); ?></a>
			<?php endif; ?>
			<?php if ( $justice_email ) : ?>
				<a href="mailto:<?php echo esc_attr( $justice_email ); ?>" dir="ltr"><?php echo esc_html( $justice_email ); ?></a>
			<?php endif; ?>
		</section>
	</div>

	<div class="l3-footer__bottom">
		<p class="l3-footer__disclaimer"><?php esc_html_e( 'המידע המופיע באתר Jus-Tice הינו מידע כללי בלבד ואינו מהווה ייעוץ משפטי מכל סוג שהוא. קבלת החלטות על סמך המידע באתר היא באחריות המשתמש בלבד. בכל מקרה של סוגיה משפטית יש להתייעץ עם עורך דין מוסמך. הסימולציה היא כלי הכנה ואינה הליך משפטי או ראיה.', 'justice-theme' ); ?></p>
		<?php if ( $justice_address ) : ?>
			<p class="l3-footer__address"><?php esc_html_e( 'כתובת בית עסק:', 'justice-theme' ); ?> <?php echo esc_html( $justice_address ); ?></p>
		<?php endif; ?>
		<div class="l3-footer__legal">
			<div class="l3-footer__legal-links">
				<?php foreach ( $justice_footer_legal as $justice_footer_legal_link ) : ?>
					<a href="<?php echo esc_url( $justice_footer_legal_link[1] ); ?>"><?php echo esc_html( $justice_footer_legal_link[0] ); ?></a>
				<?php endforeach; ?>
			</div>
			<span class="l3-footer__brand" dir="ltr">Jus-Tice &copy; <?php echo esc_html( gmdate( 'Y' ) ); ?></span>
		</div>
	</div>
</footer>
