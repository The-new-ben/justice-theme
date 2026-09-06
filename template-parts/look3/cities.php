<?php
/**
 * Lawyers by city, new look (v3): only published city pages.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_cities = justice_theme_look3_cities( 10 );

if ( count( $justice_cities ) < 3 ) {
	return;
}
?>

<section class="l3-section l3-cities" id="cities">
	<div class="l3-section__inner">
		<h2 class="l3-h2 l3-h2--small"><?php esc_html_e( 'עורכי דין לפי עיר', 'justice-theme' ); ?></h2>
		<div class="l3-chips">
			<?php foreach ( $justice_cities as $justice_city ) : ?>
				<a class="l3-chip" href="<?php echo esc_url( $justice_city['url'] ); ?>"><?php echo esc_html( $justice_city['label'] ); ?></a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
