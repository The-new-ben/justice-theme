<?php
/** Premium visual bridge for Jus-Tice. */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wp_enqueue_scripts', function () {
	wp_enqueue_style(
		'justice-ops-new-look-bridge',
		plugins_url( 'assets/new-look-bridge.css', __FILE__ ),
		array(),
		JUSTICE_OPS_VERSION
	);

	wp_enqueue_script(
		'justice-ops-new-look-bridge',
		plugins_url( 'assets/new-look-bridge.js', __FILE__ ),
		array(),
		JUSTICE_OPS_VERSION,
		true
	);
}, 40 );

add_filter( 'body_class', function ( array $classes ): array {
	$classes[] = 'jt-premium-bridge';

	if ( is_front_page() ) {
		$classes[] = 'jt-premium-home';
	}

	if ( is_page( 'legal-simulation' ) ) {
		$classes[] = 'jt-premium-simulation';
	}

	return $classes;
} );

add_action( 'template_redirect', function (): void {
	if ( is_admin() || wp_doing_ajax() || wp_is_json_request() ) {
		return;
	}

	$request_uri           = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';
	$is_lawyer_public_page = false !== strpos( $request_uri, '/lawyer-plans/' ) || false !== strpos( $request_uri, '/lawyer-registration/' );

	if ( ! $is_lawyer_public_page ) {
		return;
	}

	ob_start( static function ( string $html ): string {
		$replacements = array();
		$replacements[ base64_decode( '16HXnNeZ16fXlCDXldeU157Xldem16jXmdedINeZ15TXmdeVINee15DXldep16jXmdedINeV16TXoteZ15zXmdedINeR16TXldei15wu' ) ] = base64_decode( '157Xodec15XXnNeZINeU15TXpteY16jXpNeV16og157XmdeV16LXk9eZ150g15zXoteV16jXm9eZINeT15nXnyDXqdeo15XXpteZ150g15zXlNem15nXkiDXqdeZ16jXldeqINee16fXpteV16LXmSwg15zXp9eR15wg16TXoNeZ15XXqiDXqNec15XXldeg15jXmdeV16og15XXnNeU16nXqtec15Eg15HXntei16jXm9eqINeT15nXkteZ15jXnNeZ16og157Xqten15PXnteqLg==' );
		$replacements[ base64_decode( '16HXmNeY15XXoSDXqtec15XXnNeZ150=' ) ] = base64_decode( '157Xodec15XXnCDXlNem15jXqNek15XXqg==' );
		$replacements[ base64_decode( '15DXnSDXlNeh15zXmden15Qg15TXl9eV15PXqden15nXqiDXoteT15nXmdefINec15Ag157Xldeb16DXlCwg15TXm9ek16rXldeo15nXnSDXmdeX15bXmdeo15Ug15DXqiDXlNee16nXqtee16kg15zXotee15XXkyDXmdem15nXqNeqINen16nXqCDXnteh15XXk9eoLg==' ) ] = base64_decode( '15TXm9ek16rXldeo15nXnSDXnteV15HXmdec15nXnSDXnNeR15PXmden16og15TXqteQ157XlCwg15TXqdeQ16jXqiDXpNee16jXmNeZ150g15XXlNee16nXmiDXnteh15XXk9eoINee15XXnCDXlNem15XXldeqLg==' );
		$replacements[ base64_decode( '15DXnSDXlNeh15zXmden15Qg16LXk9eZ15nXnyDXnNeQINek16LXmdec15QsINeU15vXpNeq15XXqCDXmdeX15bXmdeoINec16LXnteV15Mg15nXpteZ16jXqiDXp9ep16gg157XodeV15PXqC4=' ) ] = base64_decode( '15TXm9ek16rXldeoINee15XXkdeZ15wg15zXlNep15DXqNeqINek16jXmNeZ150g15XXlNee16nXmiDXnteh15XXk9eoINee15XXnCDXlNem15XXldeqLg==' );
		$replacements['Jus-Tice נבנית כמערכת מסחרית לעורכי דין: פרופיל מקצועי, תוכן, חשיפה, פניות ודוחות ערך. המחירים פורסמו כדי לאפשר מכירה ושיחות לקוח ברורות; מעבר לתשלום חודשי אוטומטי ייפתח רק לאחר שהסליקה והמוצרים יהיו מאושרים ופעילים בפועל.'] = 'Jus-Tice מחברת עורכי דין לחשיפה מקצועית, פרופיל איכותי, פניות רלוונטיות וכלים דיגיטליים שמרכזים את הפעילות במקום אחד.';
		$replacements['סטטוס תשלומים'] = 'מסלול הצטרפות';
		$replacements['אם הסליקה החודשית עדיין לא מוכנה, הכפתורים מובילים להרשמה ובדיקת התאמה. כשהתשלום החודשי יהיה מאושר ופעיל, הכפתורים יעברו אוטומטית לתשלום מאובטח.'] = 'הכפתורים מובילים להרשמה, בדיקת התאמה והמשך מסודר מול הצוות.';
		$replacements['תשלום אוטומטי ייפתח רק כאשר הסליקה והמוצרים יהיו פעילים.'] = 'ההצטרפות מתחילה בבדיקת התאמה והמשך מסודר מול הצוות.';

		$html = str_replace( array_keys( $replacements ), array_values( $replacements ), $html );

		$html = preg_replace( '#<meta\s+name=["\']robots["\']\s+content=["\'][^"\']*noindex[^"\']*["\']\s*/?>#i', '', $html ) ?? $html;
		$html = preg_replace( '#<meta\s+content=["\'][^"\']*noindex[^"\']*["\']\s+name=["\']robots["\']\s*/?>#i', '', $html ) ?? $html;

		return $html;
	} );
}, 0 );
