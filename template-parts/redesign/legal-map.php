<?php
/**
 * LawyerScout: the interactive 3D legal map section (homepage center).
 *
 * Renders only when the Mapbox public token is configured. The map itself
 * is click-to-load so the heavy GL library never touches first paint.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_map_token = function_exists( 'justice_theme_mapbox_public_token' ) ? justice_theme_mapbox_public_token() : '';

if ( '' === $justice_map_token ) {
	return;
}

wp_enqueue_script(
	'justice-legal-map',
	JUSTICE_THEME_URI . '/assets/js/legal-map.js',
	array(),
	JUSTICE_THEME_VERSION,
	true
);

wp_add_inline_script(
	'justice-legal-map',
	'window.JusticeMap = ' . wp_json_encode(
		array(
			'token'    => $justice_map_token,
			'endpoint' => esc_url_raw( rest_url( 'justice/v1/map/offices' ) ),
		)
	) . ';',
	'before'
);
?>

<section class="jt2-section legal-map-band" id="lawyer-scout" aria-label="<?php esc_attr_e( 'מפת עורכי הדין והשירותים המשפטיים', 'justice-theme' ); ?>">
	<div class="container">
		<div class="legal-map-head">
			<div>
				<h2><?php esc_html_e( 'LawyerScout: מפת המשפט של ישראל', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'כל משרדי עורכי הדין המאומתים, בתי המשפט והשירותים המשפטיים על מפה תלת ממדית אחת. לוחצים על נקודה ומקבלים כרטיס מלא: אימות, ביקורות אמיתיות ויצירת קשר.', 'justice-theme' ); ?></p>
			</div>
			<button type="button" class="legal-map-nearest" id="legal-map-nearest"><?php esc_html_e( 'מצאו את הקרובים אליי', 'justice-theme' ); ?></button>
		</div>
		<div class="legal-map-shell" id="legal-map">
			<button type="button" id="legal-map-load" class="legal-map-load">
				<span aria-hidden="true">&#128506;</span>
				<?php esc_html_e( 'טוען את המפה…', 'justice-theme' ); ?>
			</button>
			<div id="legal-map-canvas" class="legal-map-canvas"></div>
		</div>
		<p class="legal-map-legend">
			<span><i class="legal-map-dot legal-map-dot--lawyer"></i> <?php esc_html_e( 'עורכי דין מובילים', 'justice-theme' ); ?></span>
			<span><i class="legal-map-dot legal-map-dot--place"></i> <?php esc_html_e( 'בתי משפט, מוסדות ומשרדים מובילים', 'justice-theme' ); ?></span>
			<span><?php esc_html_e( 'מציגים משרדים שנבדקו ונמצאו בין המובילים בתחומם.', 'justice-theme' ); ?></span>
		</p>
	</div>
</section>
