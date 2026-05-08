<?php
/**
 * Legal guides by topic section.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$topics = [
	[ 'title' => 'דיני משפחה', 'slug' => 'family-law' ],
	[ 'title' => 'משפט פלילי', 'slug' => 'criminal-law' ],
	[ 'title' => 'מקרקעין', 'slug' => 'real-estate-law' ],
	[ 'title' => 'תעבורה', 'slug' => 'traffic-law' ],
];
?>

<section class="topic-clusters section">
	<div class="container">
		<div class="section-header">
			<p class="section-header__eyebrow"><?php esc_html_e( 'מדריכים לפי נושא', 'justice-theme' ); ?></p>
			<h2><?php esc_html_e( 'מדריכים משפטיים לפי תחום', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'מדריכים מעשיים שיעזרו לכם להבין את הזכויות שלכם ולנווט את המערכת המשפטית.', 'justice-theme' ); ?></p>
		</div>
		
		<div class="clusters-grid">
			<?php foreach ( $topics as $topic ) : ?>
				<div class="cluster-card">
					<h3 class="cluster-title">
						<a href="<?php echo esc_url( home_url( '/' . $topic['slug'] . '/' ) ); ?>">
							<?php echo esc_html( $topic['title'] ); ?>
						</a>
					</h3>
					
					<?php
					// Try practice-areas taxonomy first
					$args = array(
						'post_type'      => array( 'articles', 'post' ),
						'posts_per_page' => 4,
						'tax_query'      => array(
							'relation' => 'OR',
							array(
								'taxonomy' => 'practice-areas',
								'field'    => 'slug',
								'terms'    => $topic['slug'],
							),
							array(
								'taxonomy' => 'category',
								'field'    => 'slug',
								'terms'    => $topic['slug'],
							),
						),
					);
					
					$q = new WP_Query( $args );
					
					if ( $q->have_posts() ) :
						echo '<ul class="cluster-links">';
						while ( $q->have_posts() ) : $q->the_post();
							echo '<li><a href="' . esc_url( get_permalink() ) . '">' . esc_html( get_the_title() ) . '</a></li>';
						endwhile;
						echo '</ul>';
						wp_reset_postdata();
					else:
						echo '<p class="cluster-empty">' . esc_html__( 'בקרוב יעלו מדריכים בנושא זה.', 'justice-theme' ) . '</p>';
					endif;
					?>
					<a class="cluster-more" href="<?php echo esc_url( home_url( '/' . $topic['slug'] . '/' ) ); ?>">
						<?php esc_html_e( 'לכל המדריכים בנושא זה', 'justice-theme' ); ?> &larr;
					</a>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
