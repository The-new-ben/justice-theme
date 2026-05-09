<?php
/**
 * Optional editable homepage content.
 *
 * Lets the WordPress page editor control a safe content band while the full
 * portal layout remains template-driven.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$content = get_post_field( 'post_content', get_queried_object_id() );

if ( ! $content ) {
	return;
}

$spam_pattern = '/casino|gambling|betting|poker|slots|קזינו|הימורים/i';

if ( preg_match( $spam_pattern, wp_strip_all_tags( $content ) ) ) {
	return;
}
?>

<section class="home-cms-content section">
	<div class="container">
		<div class="home-cms-content__inner entry-content">
			<?php echo apply_filters( 'the_content', $content ); ?>
		</div>
	</div>
</section>
