<?php
/**
 * Site footer partial - redesign (SiteFooter.dc.html).
 *
 * Deep-navy footer: about + contact, practice areas, quick nav, quick
 * contact CTAs, four trust-path cards, legal bar, floating WhatsApp.
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

$justice_lawyers_archive = get_post_type_archive_link( 'justice_lawyer' ) ?: home_url( '/lawyers/' );

$justice_footer_whatsapp_url = function_exists( 'justice_theme_public_whatsapp_url' )
	? justice_theme_public_whatsapp_url( __( 'שלום, אני צריך/ה עזרה משפטית דרך Jus-Tice. הגעתי מהאתר ואשמח לחזרה.', 'justice-theme' ) )
	: '';

$justice_footer_areas = array(
	array( __( 'דיני משפחה וגירושין', 'justice-theme' ), home_url( '/family-law/' ) ),
	array( __( 'משפט פלילי', 'justice-theme' ), home_url( '/criminal-defense-attorney/' ) ),
	array( __( 'מקרקעין ונדל"ן', 'justice-theme' ), home_url( '/practice-areas/real-estate-law/' ) ),
	array( __( 'רשלנות רפואית', 'justice-theme' ), home_url( '/medical-malpractice-lawyer/' ) ),
	array( __( 'נזיקין ותאונות', 'justice-theme' ), home_url( '/tort-lawyer/' ) ),
	array( __( 'דיני עבודה', 'justice-theme' ), home_url( '/practice-areas/labor-law/' ) ),
);

$justice_footer_nav = array(
	array( __( 'מאגר מאמרים', 'justice-theme' ), home_url( '/articles/' ) ),
	array( __( 'כל עורכי הדין', 'justice-theme' ), $justice_lawyers_archive ),
	array( __( 'כלי AI משפטיים', 'justice-theme' ), home_url( '/legal-tools/' ) ),
	array( __( 'התייעצות משפטית', 'justice-theme' ), home_url( '/#ask-lawyer' ) ),
	array( __( 'אודות Jus-Tice', 'justice-theme' ), home_url( '/about/' ) ),
	array( __( 'מדיניות עריכה', 'justice-theme' ), home_url( '/editorial-policy/' ) ),
	array( __( 'מפת אתר', 'justice-theme' ), home_url( '/site-map/' ) ),
);

$justice_footer_cities = array(
	array( __( 'תל אביב', 'justice-theme' ), add_query_arg( 'city', 'תל אביב', $justice_lawyers_archive ) ),
	array( __( 'ירושלים', 'justice-theme' ), add_query_arg( 'city', 'ירושלים', $justice_lawyers_archive ) ),
	array( __( 'חיפה', 'justice-theme' ), add_query_arg( 'city', 'חיפה', $justice_lawyers_archive ) ),
	array( __( 'באר שבע', 'justice-theme' ), add_query_arg( 'city', 'באר שבע', $justice_lawyers_archive ) ),
	array( __( 'ראשון לציון', 'justice-theme' ), add_query_arg( 'city', 'ראשון לציון', $justice_lawyers_archive ) ),
);

$justice_footer_legal = array(
	array( __( 'תנאי שימוש', 'justice-theme' ), home_url( '/sample-terms-and-conditions-template/' ) ),
	array( __( 'מדיניות פרטיות', 'justice-theme' ), home_url( '/privacy/' ) ),
	array( __( 'ביטול ואספקה', 'justice-theme' ), home_url( '/cancellation/' ) ),
	array( __( 'מדיניות עריכה', 'justice-theme' ), home_url( '/editorial-policy/' ) ),
	array( __( 'הצהרת נגישות', 'justice-theme' ), home_url( '/accessibility/' ) ),
	array( __( 'יצירת קשר', 'justice-theme' ), home_url( '/contact/' ) ),
);
?>

<footer class="site-footer jt2-footer" role="contentinfo">
	<div class="jt2-footer__grid">
		<section>
			<div class="jt2-footer__brand">
				<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/favicon-512.png' ); ?>" alt="" width="34" height="34" loading="lazy" decoding="async">
				<span dir="ltr">
					<span class="jt2-footer__brand-name">Jus</span><span class="jt2-header__brand-dot"></span><span class="jt2-footer__brand-name">Tice</span>
				</span>
			</div>
			<p class="jt2-footer__about"><?php esc_html_e( 'פורטל משפטי מתקדם המציע מידע מקצועי, מדריכים, וחיבור ישיר לעורכי דין מתאימים בישראל, הכל בממשק אחד.', 'justice-theme' ); ?></p>
			<div class="jt2-footer__contact">
				<?php if ( $justice_phone ) : ?>
					<a href="<?php echo esc_url( $justice_phone_href ); ?>">&#9742; <span dir="ltr"><?php echo esc_html( $justice_phone ); ?></span></a>
				<?php endif; ?>
				<?php if ( $justice_email ) : ?>
					<a href="mailto:<?php echo esc_attr( $justice_email ); ?>">&#9993; <?php echo esc_html( $justice_email ); ?></a>
				<?php endif; ?>
			</div>
			<?php if ( $justice_address ) : ?>
				<p class="jt2-footer__address"><strong><?php esc_html_e( 'כתובת בית עסק:', 'justice-theme' ); ?></strong> <?php echo esc_html( $justice_address ); ?></p>
			<?php endif; ?>
		</section>

		<section>
			<h3><?php esc_html_e( 'תחומי התמחות', 'justice-theme' ); ?></h3>
			<div class="jt2-footer__col">
				<?php foreach ( $justice_footer_areas as $justice_footer_area ) : ?>
					<a href="<?php echo esc_url( $justice_footer_area[1] ); ?>"><?php echo esc_html( $justice_footer_area[0] ); ?></a>
				<?php endforeach; ?>
			</div>
		</section>

		<section>
			<h3><?php esc_html_e( 'ניווט מהיר', 'justice-theme' ); ?></h3>
			<div class="jt2-footer__col">
				<?php foreach ( $justice_footer_nav as $justice_footer_link ) : ?>
					<a href="<?php echo esc_url( $justice_footer_link[1] ); ?>"><?php echo esc_html( $justice_footer_link[0] ); ?></a>
				<?php endforeach; ?>
				<a class="jt2-footer__join" href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>"><?php esc_html_e( 'הצטרפות עורכי דין ←', 'justice-theme' ); ?></a>
			</div>
		</section>

		<section class="jt2-footer__quick">
			<h3><?php esc_html_e( 'פנייה מהירה', 'justice-theme' ); ?></h3>
			<p><?php esc_html_e( 'התחילו מתיאור קצר. נבדוק תחום, עיר ודחיפות, בלי הבטחה לתוצאה.', 'justice-theme' ); ?></p>
			<div class="jt2-footer__quick-ctas">
				<?php if ( $justice_footer_whatsapp_url ) : ?>
					<a class="is-whatsapp" href="<?php echo esc_url( $justice_footer_whatsapp_url ); ?>" target="_blank" rel="noopener" data-whatsapp-surface="site_footer" data-lead-utm-source="site_footer" data-lead-utm-medium="whatsapp" data-lead-utm-campaign="public_legal_help"><?php esc_html_e( 'שליחת וואטסאפ', 'justice-theme' ); ?></a>
				<?php endif; ?>
				<a class="is-form" href="<?php echo esc_url( home_url( '/#ask-lawyer' ) ); ?>"><?php esc_html_e( 'טופס פנייה', 'justice-theme' ); ?></a>
				<a class="is-plans" href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'מסלולים לעורכי דין', 'justice-theme' ); ?></a>
			</div>
		</section>
	</div>

	<div class="jt2-footer__cards">
		<div class="jt2-footer__card">
			<span class="jt2-footer__card-eyebrow"><?php esc_html_e( 'אחרי שהשארתם פנייה', 'justice-theme' ); ?></span>
			<strong><?php esc_html_e( 'בודקים תחום, עיר ודחיפות לפני שממשיכים', 'justice-theme' ); ?></strong>
			<p><?php esc_html_e( 'בלי להציג מידע כללי כייעוץ אישי או הבטחה לתוצאה.', 'justice-theme' ); ?></p>
		</div>
		<div class="jt2-footer__card">
			<span class="jt2-footer__card-eyebrow"><?php esc_html_e( 'חיפוש לפי עיר', 'justice-theme' ); ?></span>
			<strong><?php esc_html_e( 'מתחילים קרוב למקום שצריך', 'justice-theme' ); ?></strong>
			<div class="jt2-footer__cities">
				<?php foreach ( $justice_footer_cities as $justice_footer_city ) : ?>
					<a href="<?php echo esc_url( $justice_footer_city[1] ); ?>"><?php echo esc_html( $justice_footer_city[0] ); ?></a>
				<?php endforeach; ?>
			</div>
		</div>
		<div class="jt2-footer__card">
			<span class="jt2-footer__card-eyebrow"><?php esc_html_e( 'לעורכי דין', 'justice-theme' ); ?></span>
			<strong><?php esc_html_e( 'פרופיל, מסלולים ואזור אישי', 'justice-theme' ); ?></strong>
			<div class="jt2-footer__card-links">
				<a href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>"><?php esc_html_e( 'פתיחת פרופיל', 'justice-theme' ); ?></a>
				<a href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'מסלולי הצטרפות', 'justice-theme' ); ?></a>
				<a href="<?php echo esc_url( home_url( '/lawyer-dashboard/' ) ); ?>"><?php esc_html_e( 'אזור אישי', 'justice-theme' ); ?></a>
			</div>
		</div>
		<div class="jt2-footer__card jt2-footer__card--hot">
			<span class="jt2-footer__card-eyebrow"><?php esc_html_e( 'פנייה מהירה', 'justice-theme' ); ?></span>
			<strong><?php esc_html_e( 'מועד קרוב? עדיף להתחיל עכשיו', 'justice-theme' ); ?></strong>
			<?php if ( $justice_footer_whatsapp_url ) : ?>
				<a class="jt2-footer__card-cta" href="<?php echo esc_url( $justice_footer_whatsapp_url ); ?>" target="_blank" rel="noopener" data-whatsapp-surface="site_footer" data-lead-utm-source="site_footer_urgent" data-lead-utm-medium="whatsapp" data-lead-utm-campaign="public_legal_help"><?php esc_html_e( 'וואטסאפ ←', 'justice-theme' ); ?></a>
			<?php endif; ?>
		</div>
	</div>

	<div class="jt2-footer__legal">
		<div class="jt2-footer__legal-links">
			<?php foreach ( $justice_footer_legal as $justice_footer_legal_link ) : ?>
				<a href="<?php echo esc_url( $justice_footer_legal_link[1] ); ?>"><?php echo esc_html( $justice_footer_legal_link[0] ); ?></a>
			<?php endforeach; ?>
		</div>
		<p class="jt2-footer__disclaimer"><?php esc_html_e( 'המידע המופיע באתר Jus-Tice הינו מידע כללי בלבד ואינו מהווה ייעוץ משפטי מכל סוג שהוא. קבלת החלטות על סמך המידע באתר היא באחריות המשתמש בלבד. בכל מקרה של סוגיה משפטית יש להתייעץ עם עורך דין מוסמך.', 'justice-theme' ); ?></p>
		<p class="jt2-footer__disclaimer">&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'כל הזכויות שמורות.', 'justice-theme' ); ?></p>
	</div>
</footer>

<?php
/*
 * Retired 2026-07-18 (owner screenshot: this float stacked on the AI pill
 * in the same bottom-left corner on every non-home page). The site already
 * carries two non-floating WhatsApp entry points - .jt2-header__whatsapp
 * in the nav and the quick-contact card above in this same footer - so a
 * third, floating one was genuine duplicate weight, not a missing surface.
 * It had already been hidden via CSS site-wide once (justice-ops/tools-
 * discovery.php), but a higher-specificity body:not(.home) rule in
 * premium-pass-4.css silently defeated that hide rule on every page except
 * the homepage the whole time. Per floating-elements-discipline Law 3,
 * duplicates die in code, not CSS - deleting the render here closes off
 * that whole class of regression for good, rather than leaving hidden
 * dead weight for a third specificity war to find later.
 */
