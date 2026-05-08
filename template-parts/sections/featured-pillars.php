<?php
/**
 * Featured pillar pages section.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$pillars = [
	[ 'title' => 'עורך דין גירושין', 'icon' => 'dashicons-admin-users', 'link' => home_url( '/family-law/divorce/' ) ],
	[ 'title' => 'עורך דין פלילי', 'icon' => 'dashicons-shield', 'link' => home_url( '/criminal-law/' ) ],
	[ 'title' => 'עורך דין תעבורה', 'icon' => 'dashicons-car', 'link' => home_url( '/traffic-law/' ) ],
	[ 'title' => 'עורך דין מקרקעין', 'icon' => 'dashicons-building', 'link' => home_url( '/real-estate-law/' ) ],
	[ 'title' => 'עורך דין דיני עבודה', 'icon' => 'dashicons-portfolio', 'link' => home_url( '/labor-law/' ) ],
	[ 'title' => 'עורך דין ירושה', 'icon' => 'dashicons-media-document', 'link' => home_url( '/family-law/inheritance/' ) ],
];
?>

<section class="featured-pillars section-padding bg-cream">
	<div class="container">
		<h2 class="section-title text-center"><?php esc_html_e( 'תחומי התמחות מרכזיים', 'justice-theme' ); ?></h2>
		
		<div class="pillars-grid">
			<?php foreach ( $pillars as $pillar ) : ?>
				<a href="<?php echo esc_url( $pillar['link'] ); ?>" class="pillar-card">
					<span class="dashicons <?php echo esc_attr( $pillar['icon'] ); ?> pillar-icon"></span>
					<h3 class="pillar-title"><?php echo esc_html( $pillar['title'] ); ?></h3>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
