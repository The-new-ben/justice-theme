<?php
/**
 * Cities grid section — major Israeli cities for lawyer search.
 *
 * Based on competitive analysis: din.co.il and Justia both have
 * location grids as primary navigation. This enables future
 * practice-area + city landing pages.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$cities = array(
	array( 'name' => 'תל אביב',       'slug' => 'tel-aviv' ),
	array( 'name' => 'ירושלים',        'slug' => 'jerusalem' ),
	array( 'name' => 'חיפה',           'slug' => 'haifa' ),
	array( 'name' => 'ראשון לציון',    'slug' => 'rishon-lezion' ),
	array( 'name' => 'פתח תקווה',      'slug' => 'petah-tikva' ),
	array( 'name' => 'אשדוד',          'slug' => 'ashdod' ),
	array( 'name' => 'נתניה',          'slug' => 'netanya' ),
	array( 'name' => 'באר שבע',        'slug' => 'beer-sheva' ),
	array( 'name' => 'רמת גן',         'slug' => 'ramat-gan' ),
	array( 'name' => 'הרצליה',         'slug' => 'herzliya' ),
	array( 'name' => 'כפר סבא',        'slug' => 'kfar-saba' ),
	array( 'name' => 'מודיעין',        'slug' => 'modiin' ),
);
?>

<section class="cities-grid section" id="cities">
	<div class="container">
		<div class="section-header section-header--center">
			<p class="section-header__eyebrow"><?php esc_html_e( 'לפי מיקום', 'justice-theme' ); ?></p>
			<h2><?php esc_html_e( 'עורכי דין לפי עיר', 'justice-theme' ); ?></h2>
		</div>

		<div class="cities-grid__list">
			<?php foreach ( $cities as $city ) : ?>
				<a href="<?php echo esc_url( home_url( '/lawyers/?city=' . $city['slug'] ) ); ?>" class="city-card">
					<span class="city-card__name"><?php echo esc_html( $city['name'] ); ?></span>
					<span class="city-card__arrow" aria-hidden="true">←</span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
