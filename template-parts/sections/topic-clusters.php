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

<section class="topic-clusters section-padding">
	<div class="container">
		<h2 class="section-title text-center"><?php esc_html_e( 'מדריכים משפטיים לפי נושאים', 'justice-theme' ); ?></h2>
		
		<div class="clusters-grid">
			<?php foreach ( $topics as $topic ) : ?>
				<div class="cluster-card">
					<h3 class="cluster-title">
						<a href="<?php echo esc_url( home_url( '/' . $topic['slug'] . '/' ) ); ?>">
							<?php echo esc_html( $topic['title'] ); ?>
						</a>
					</h3>
					
					<?php
					$args = array(
						'post_type'      => 'post', // Assuming converted to post
						'posts_per_page' => 4,
						'category_name'  => $topic['slug'],
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
