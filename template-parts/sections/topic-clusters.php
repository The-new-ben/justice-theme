<?php
/**
 * Legal guides by topic section.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$topics = array(
	array(
		'title' => 'דיני משפחה',
		'slug'  => 'family-law',
		'url'   => justice_theme_safe_public_link( '/family-lawyer/', '/family-law/' ),
		'links' => array(
			array( 'label' => 'עורך דין גירושין', 'url' => '/divorce-lawyer/' ),
			array( 'label' => 'גירושין בהסכמה', 'url' => '/consensual-divorce/' ),
			array( 'label' => 'גישור גירושין', 'url' => '/divorce-mediation/' ),
			array( 'label' => 'מזונות ילדים', 'url' => '/child-support/' ),
			array( 'label' => 'משמורת ילדים', 'url' => '/child-custody/' ),
			array( 'label' => 'חלוקת רכוש בגירושין', 'url' => '/divorce-property-division/' ),
			array( 'label' => 'יישוב סכסוך במשפחה', 'url' => '/family-dispute-resolution/' ),
		),
	),
	array(
		'title' => 'משפט פלילי',
		'slug'  => 'criminal-law',
		'url'   => justice_theme_safe_public_link( '/criminal-lawyer/', '/criminal-law/' ),
		'links' => array(),
	),
	array(
		'title' => 'מקרקעין',
		'slug'  => 'real-estate-law',
		'url'   => justice_theme_safe_public_link( '/real-estate-lawyer/', '/lawyers/?area=real-estate-law' ),
		'links' => array(),
	),
	array(
		'title' => 'תעבורה',
		'slug'  => 'traffic-law',
		'url'   => justice_theme_safe_public_link( '/traffic-lawyer/', '/lawyers/?area=traffic-law' ),
		'links' => array(),
	),
);
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
				<?php $topic_url = $topic['url'] ?? home_url( '/' . $topic['slug'] . '/' ); ?>
				<div class="cluster-card">
					<h3 class="cluster-title">
						<a href="<?php echo esc_url( $topic_url ); ?>">
							<?php echo esc_html( $topic['title'] ); ?>
						</a>
					</h3>
					
					<?php
					$static_links = is_array( $topic['links'] ?? null ) ? $topic['links'] : array();

					if ( ! empty( $static_links ) ) :
						echo '<ul class="cluster-links">';
						foreach ( $static_links as $link ) {
							$label = $link['label'] ?? '';
							$url   = $link['url'] ?? '';
							if ( '' === $label || '' === $url ) {
								continue;
							}
							echo '<li><a href="' . esc_url( justice_theme_safe_public_link( $url, $topic_url ) ) . '">' . esc_html( $label ) . '</a></li>';
						}
						echo '</ul>';
					else :
					// Try practice-areas taxonomy first.
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
					endif;
					?>
					<a class="cluster-more" href="<?php echo esc_url( $topic_url ); ?>">
						<?php esc_html_e( 'לכל המדריכים בנושא זה', 'justice-theme' ); ?> &larr;
					</a>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
