<?php
/**
 * Lawyer card — used in featured-lawyers grid and directory archives.
 *
 * Compliance: Must show "פרופיל ממומן" label for paid profiles
 * per Israeli Bar advertising rules.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$lawyer_id   = get_the_ID();
$firm        = get_post_meta( $lawyer_id, 'firm_name', true );
$phone       = get_post_meta( $lawyer_id, 'phone', true );
$experience  = get_post_meta( $lawyer_id, 'years_experience', true );
$plan        = get_post_meta( $lawyer_id, 'plan_type', true );
$is_paid     = in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true );
$cities      = get_the_terms( $lawyer_id, 'city' );
$areas       = get_the_terms( $lawyer_id, 'practice-areas' );
?>

<article class="lawyer-card premium-card">
  <a class="lawyer-card__media" href="<?php the_permalink(); ?>">
    <?php if ( has_post_thumbnail() ) : ?>
      <?php the_post_thumbnail( 'justice-card', array( 'loading' => 'lazy' ) ); ?>
    <?php else : ?>
      <div class="lawyer-card__placeholder" aria-hidden="true">
        <span><?php echo esc_html( mb_substr( get_the_title(), 0, 1 ) ); ?></span>
      </div>
    <?php endif; ?>
  </a>

  <div class="lawyer-card__body">
    <h3 class="lawyer-card__name">
      <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
    </h3>

    <p class="lawyer-card__firm">
      <?php echo esc_html( get_post_meta( get_the_ID(), 'firm_name', true ) ); ?>
    </p>

    <p class="lawyer-card__meta">
      <?php 
	  $city_terms = get_the_terms( get_the_ID(), 'city' );
	  $area_terms = get_the_terms( get_the_ID(), 'practice-areas' );
	  
	  $city_name = ( $city_terms && ! is_wp_error( $city_terms ) ) ? $city_terms[0]->name : '';
	  $area_names = ( $area_terms && ! is_wp_error( $area_terms ) ) ? implode( ', ', wp_list_pluck( array_slice( $area_terms, 0, 2 ), 'name' ) ) : '';
	  
	  echo esc_html( $city_name );
	  if ( $city_name && $area_names ) echo ' &middot; ';
	  echo esc_html( $area_names );
	  ?>
    </p>

    <div class="lawyer-card__actions">
      <a class="button button--primary" href="<?php the_permalink(); ?>">
        צפייה בפרופיל
      </a>

      <a class="button button--ghost" href="<?php echo esc_url( add_query_arg( 'lawyer_id', get_the_ID(), home_url( '/contact/' ) ) ); ?>">
        שליחת פנייה
      </a>
    </div>
  </div>
</article>
