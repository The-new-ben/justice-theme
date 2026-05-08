<?php
/**
 * Featured lawyers section — placeholder for directory launch.
 *
 * Shows placeholder lawyer cards with CTA to join.
 * Will be replaced with real data once Lawyer CPT is registered.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Check if lawyer CPT exists and has entries
$has_lawyers = post_type_exists( 'lawyer' ) && wp_count_posts( 'lawyer' )->publish > 0;
?>

<section class="featured-lawyers section" id="featured-lawyers">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'עורכי דין מומחים', 'justice-theme' ); ?></p>
				<h2><?php esc_html_e( 'עורכי דין בולטים', 'justice-theme' ); ?></h2>
			</div>
			<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" class="button button--gold">
				<?php esc_html_e( 'לכל עורכי הדין', 'justice-theme' ); ?>
			</a>
		</div>

		<?php if ( $has_lawyers ) : ?>
			<?php
			$lawyers_query = new WP_Query( array(
				'post_type'      => 'lawyer',
				'posts_per_page' => 4,
				'meta_key'       => '_justice_featured',
				'meta_value'     => '1',
				'orderby'        => 'rand',
			) );

			if ( $lawyers_query->have_posts() ) :
			?>
				<div class="lawyers-grid">
					<?php
					while ( $lawyers_query->have_posts() ) :
						$lawyers_query->the_post();
						get_template_part( 'template-parts/cards/lawyer-card' );
					endwhile;
					wp_reset_postdata();
					?>
				</div>
			<?php endif; ?>

		<?php else : ?>
			<!-- Placeholder state until lawyers register -->
			<div class="featured-lawyers__coming">
				<div class="featured-lawyers__message">
					<p class="featured-lawyers__icon" aria-hidden="true">⚖️</p>
					<h3><?php esc_html_e( 'מדריך עורכי הדין בבנייה', 'justice-theme' ); ?></h3>
					<p><?php esc_html_e( 'בקרוב תוכלו לחפש ולמצוא עורכי דין מומחים לפי תחום, עיר וניסיון. עורכי דין — הצטרפו עכשיו והיו מהראשונים במדריך.', 'justice-theme' ); ?></p>
					<a href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>" class="button button--gold">
						<?php esc_html_e( 'הצטרפות למדריך', 'justice-theme' ); ?>
					</a>
				</div>
			</div>
		<?php endif; ?>
	</div>
</section>
