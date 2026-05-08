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
$firm        = get_post_meta( $lawyer_id, '_justice_firm_name', true );
$phone       = get_post_meta( $lawyer_id, '_justice_phone', true );
$experience  = get_post_meta( $lawyer_id, '_justice_years_experience', true );
$plan        = get_post_meta( $lawyer_id, '_justice_plan_type', true );
$is_paid     = in_array( $plan, array( 'basic', 'premium', 'elite' ), true );
$cities      = get_the_terms( $lawyer_id, 'city' );
$areas       = get_the_terms( $lawyer_id, 'practice-areas' );
?>

<article class="lawyer-card <?php echo $is_paid ? 'lawyer-card--promoted' : ''; ?>" id="lawyer-<?php echo esc_attr( $lawyer_id ); ?>">
	<?php if ( $is_paid ) : ?>
		<span class="lawyer-card__badge"><?php esc_html_e( 'פרופיל ממומן', 'justice-theme' ); ?></span>
	<?php endif; ?>

	<a href="<?php the_permalink(); ?>" class="lawyer-card__link">
		<div class="lawyer-card__avatar">
			<?php if ( has_post_thumbnail() ) : ?>
				<?php the_post_thumbnail( 'thumbnail', array( 'class' => 'lawyer-card__photo' ) ); ?>
			<?php else : ?>
				<div class="lawyer-card__placeholder-avatar" aria-hidden="true">⚖️</div>
			<?php endif; ?>
		</div>

		<div class="lawyer-card__info">
			<h3 class="lawyer-card__name"><?php the_title(); ?></h3>

			<?php if ( $firm ) : ?>
				<p class="lawyer-card__firm"><?php echo esc_html( $firm ); ?></p>
			<?php endif; ?>

			<?php if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) : ?>
				<p class="lawyer-card__areas">
					<?php echo esc_html( implode( ', ', wp_list_pluck( array_slice( $areas, 0, 3 ), 'name' ) ) ); ?>
				</p>
			<?php endif; ?>

			<div class="lawyer-card__meta">
				<?php if ( ! empty( $cities ) && ! is_wp_error( $cities ) ) : ?>
					<span class="lawyer-card__city">📍 <?php echo esc_html( $cities[0]->name ); ?></span>
				<?php endif; ?>

				<?php if ( $experience ) : ?>
					<span class="lawyer-card__exp">
						<?php
						printf(
							esc_html__( '%d שנות ניסיון', 'justice-theme' ),
							absint( $experience )
						);
						?>
					</span>
				<?php endif; ?>
			</div>
		</div>
	</a>

	<?php if ( $phone ) : ?>
		<div class="lawyer-card__actions">
			<a href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) ); ?>" class="button button--gold lawyer-card__cta">
				<?php esc_html_e( 'חייגו עכשיו', 'justice-theme' ); ?>
			</a>
		</div>
	<?php endif; ?>
</article>
