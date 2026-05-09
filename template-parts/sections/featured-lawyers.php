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

// Check if justice_lawyer CPT exists and has published entries
$has_lawyers = post_type_exists( 'justice_lawyer' ) && wp_count_posts( 'justice_lawyer' )->publish > 0;
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
			// Featured first; fallback to any published lawyer
			$lawyers_query = new WP_Query( array(
				'post_type'      => 'justice_lawyer',
				'posts_per_page' => 4,
				'post_status'    => 'publish',
				'orderby'        => 'date',
				'order'          => 'DESC',
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
			<!-- Demo cards — shown until first real lawyers are added -->
			<div class="lawyers-grid">
				<?php
				$demo_lawyers = array(
					array( 'name' => 'עו"ד דנה לוי', 'firm' => 'לוי ושות׳ עורכי דין', 'city' => 'תל אביב', 'areas' => 'דיני משפחה, גירושין', 'exp' => '12', 'initial' => 'ד' ),
					array( 'name' => 'עו"ד אבי כהן', 'firm' => 'משרד כהן ואח׳', 'city' => 'ירושלים', 'areas' => 'נזיקין, תאונות דרכים', 'exp' => '18', 'initial' => 'א' ),
					array( 'name' => 'עו"ד מיכל שרון', 'firm' => 'שרון-גלר עורכי דין', 'city' => 'חיפה', 'areas' => 'מקרקעין ונדל"ן', 'exp' => '9', 'initial' => 'מ' ),
					array( 'name' => 'עו"ד יוסי רוזן', 'firm' => 'רוזן-ברק עורכי דין', 'city' => 'ראשון לציון', 'areas' => 'משפט פלילי, תעבורה', 'exp' => '15', 'initial' => 'י' ),
				);
				foreach ( $demo_lawyers as $demo ) :
				?>
				<article class="lawyer-card premium-card" style="position:relative;">
					<span class="lawyer-card__demo-badge" style="position:absolute;top:12px;right:12px;background:rgba(178,58,72,0.1);color:#b23a48;font-size:0.72rem;font-weight:800;padding:3px 9px;border-radius:50px;border:1px solid rgba(178,58,72,0.2);">דמו</span>
					<div class="lawyer-card__media">
						<div class="lawyer-card__placeholder" aria-hidden="true">
							<span><?php echo esc_html( $demo['initial'] ); ?></span>
						</div>
					</div>
					<div class="lawyer-card__body">
						<div class="lawyer-card__top">
							<h3 class="lawyer-card__name"><?php echo esc_html( $demo['name'] ); ?></h3>
							<span class="lawyer-card__city">📍 <?php echo esc_html( $demo['city'] ); ?></span>
						</div>
						<p class="lawyer-card__firm"><?php echo esc_html( $demo['firm'] ); ?></p>
						<div class="lawyer-card__chips"><?php echo esc_html( $demo['areas'] ); ?></div>
						<div class="lawyer-card__meta">ניסיון: <?php echo esc_html( $demo['exp'] ); ?> שנה</div>
						<div class="lawyer-card__actions">
							<a class="button button--primary" href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>">צפייה בפרופיל</a>
							<a class="button button--ghost" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">שליחת פנייה</a>
						</div>
					</div>
				</article>
				<?php endforeach; ?>
			</div>
			<p style="text-align:center;margin-top:2rem;color:var(--jt-muted);font-size:0.85rem;">הכרטיסיות לעיל הן לדמיון בלבד. <a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" style="color:var(--jt-accent-red);">להצטרפות עורכי דין</a></p>
		<?php endif; ?>
	</div>
</section>
