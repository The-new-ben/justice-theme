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
			<?php the_post_thumbnail( 'medium', array( 'loading' => 'lazy' ) ); ?>
		<?php else : ?>
			<div class="lawyer-card__placeholder" aria-hidden="true">
				<span><?php echo esc_html( mb_substr( get_the_title(), 0, 1 ) ); ?></span>
			</div>
		<?php endif; ?>
	</a>

	<div class="lawyer-card__body">
		<div class="lawyer-card__top">
			<h3 class="lawyer-card__name">
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</h3>

			<?php if ( ! empty( $cities ) && ! is_wp_error( $cities ) ) : ?>
				<span class="lawyer-card__city">
					<?php echo esc_html( $cities[0]->name ); ?>
				</span>
			<?php endif; ?>
		</div>

		<?php if ( $firm ) : ?>
			<p class="lawyer-card__firm">
				<?php echo esc_html( $firm ); ?>
			</p>
		<?php endif; ?>

		<?php if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) : ?>
			<p class="lawyer-card__areas">
				<?php echo esc_html( implode( ', ', wp_list_pluck( array_slice( $areas, 0, 3 ), 'name' ) ) ); ?>
			</p>
		<?php endif; ?>

		<div class="lawyer-card__actions">
			<a class="button button--primary" href="<?php the_permalink(); ?>">
				צפייה בפרופיל
			</a>

			<a class="button button--outline" href="<?php echo esc_url( add_query_arg( 'lawyer_id', get_the_ID(), home_url( '/contact/' ) ) ); ?>" style="border-color: var(--color-primary); color: var(--color-primary);">
				שליחת פנייה
			</a>
		</div>
	</div>
</article>
