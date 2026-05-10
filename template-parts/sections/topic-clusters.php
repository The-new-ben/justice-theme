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
	[ 'title' => 'מקרקעין',     'slug' => 'real-estate' ],
	[ 'title' => 'תעבורה',      'slug' => 'traffic-law' ],
];

$lawyers_archive = get_post_type_archive_link( 'justice_lawyer' ) ?: home_url( '/lawyers/' );
?>

<section class="topic-clusters section">
	<div class="container">
		<div class="section-header">
			<p class="section-header__eyebrow"><?php esc_html_e( 'מדריכים לפי נושא', 'justice-theme' ); ?></p>
			<h2><?php esc_html_e( 'מדריכים משפטיים לפי תחום', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'מדריכים מעשיים שיעזרו לכם להבין את הזכויות שלכם ולנווט את המערכת המשפטית.', 'justice-theme' ); ?></p>
		</div>

		<div class="clusters-grid">
			<?php foreach ( $topics as $topic ) :
				$term         = get_term_by( 'slug', $topic['slug'], 'practice-areas' );
				$cluster_link = $term && ! is_wp_error( $term ) ? get_term_link( $term ) : add_query_arg( 'area', $topic['slug'], $lawyers_archive );
				if ( is_wp_error( $cluster_link ) ) {
					$cluster_link = add_query_arg( 'area', $topic['slug'], $lawyers_archive );
				}
				?>
				<div class="cluster-card">
					<h3 class="cluster-title">
						<a href="<?php echo esc_url( $cluster_link ); ?>">
							<?php echo esc_html( $topic['title'] ); ?>
						</a>
					</h3>

					<?php
					$q = new WP_Query( array(
						'post_type'           => array( 'articles' ),
						'post_status'         => 'publish',
						'posts_per_page'      => 4,
						'ignore_sticky_posts' => true,
						'tax_query'           => array(
							array(
								'taxonomy' => 'practice-areas',
								'field'    => 'slug',
								'terms'    => $topic['slug'],
							),
						),
					) );

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
					<a class="cluster-more" href="<?php echo esc_url( $cluster_link ); ?>">
						<?php esc_html_e( 'לכל המדריכים בנושא זה', 'justice-theme' ); ?> &larr;
					</a>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
