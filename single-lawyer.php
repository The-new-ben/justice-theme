<?php
/**
 * Single lawyer profile page.
 *
 * SEO target: "עורך דין {name}" + "{practice area} {city}"
 * Compliance: Must show "פרופיל ממומן" for paid profiles.
 *
 * @package JusticeTheme
 */

get_header();

$lawyer_id  = get_the_ID();
$firm       = get_post_meta( $lawyer_id, '_justice_firm_name', true );
$bar_num    = get_post_meta( $lawyer_id, '_justice_bar_number', true );
$phone      = get_post_meta( $lawyer_id, '_justice_phone', true );
$email      = get_post_meta( $lawyer_id, '_justice_email', true );
$website    = get_post_meta( $lawyer_id, '_justice_website', true );
$whatsapp   = get_post_meta( $lawyer_id, '_justice_whatsapp', true );
$languages  = get_post_meta( $lawyer_id, '_justice_languages', true );
$experience = get_post_meta( $lawyer_id, '_justice_years_experience', true );
$license    = get_post_meta( $lawyer_id, '_justice_license_status', true );
$plan       = get_post_meta( $lawyer_id, '_justice_plan_type', true );
$is_paid    = in_array( $plan, array( 'basic', 'premium', 'elite' ), true );
$cities     = get_the_terms( $lawyer_id, 'city' );
$areas      = get_the_terms( $lawyer_id, 'practice-areas' );

// Track profile view
$views = (int) get_post_meta( $lawyer_id, '_justice_profile_views', true );
update_post_meta( $lawyer_id, '_justice_profile_views', $views + 1 );
?>

<main id="primary" class="site-main">

	<article class="lawyer-profile section" itemscope itemtype="https://schema.org/Attorney">
		<div class="container">

			<?php if ( $is_paid ) : ?>
				<span class="lawyer-profile__badge"><?php esc_html_e( 'פרופיל ממומן', 'justice-theme' ); ?></span>
			<?php endif; ?>

			<div class="lawyer-profile__grid">

				<!-- Sidebar: photo + contact -->
				<aside class="lawyer-profile__sidebar">
					<div class="lawyer-profile__avatar">
						<?php if ( has_post_thumbnail() ) : ?>
							<?php the_post_thumbnail( 'medium', array( 'class' => 'lawyer-profile__photo', 'itemprop' => 'image' ) ); ?>
						<?php else : ?>
							<div class="lawyer-profile__placeholder-avatar" aria-hidden="true">⚖️</div>
						<?php endif; ?>
					</div>

					<div class="lawyer-profile__contact-card">
						<h2><?php esc_html_e( 'פרטי התקשרות', 'justice-theme' ); ?></h2>

						<?php if ( $phone ) : ?>
							<a href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) ); ?>" class="button button--gold lawyer-profile__call-btn" itemprop="telephone">
								📞 <?php echo esc_html( $phone ); ?>
							</a>
						<?php endif; ?>

						<?php if ( $whatsapp ) : ?>
							<a href="<?php echo esc_url( 'https://wa.me/972' . ltrim( preg_replace( '/[^0-9]/', '', $whatsapp ), '0' ) ); ?>" class="button button--whatsapp" target="_blank" rel="noopener">
								💬 <?php esc_html_e( 'שליחת וואטסאפ', 'justice-theme' ); ?>
							</a>
						<?php endif; ?>

						<?php if ( $email ) : ?>
							<a href="<?php echo esc_url( 'mailto:' . $email ); ?>" class="lawyer-profile__email" itemprop="email">
								✉️ <?php echo esc_html( $email ); ?>
							</a>
						<?php endif; ?>

						<?php if ( $website ) : ?>
							<a href="<?php echo esc_url( $website ); ?>" class="lawyer-profile__website" target="_blank" rel="noopener" itemprop="url">
								🌐 <?php esc_html_e( 'אתר האינטרנט', 'justice-theme' ); ?>
							</a>
						<?php endif; ?>
					</div>

					<!-- Quick stats -->
					<div class="lawyer-profile__stats">
						<?php if ( $experience ) : ?>
							<div class="lawyer-profile__stat">
								<strong><?php echo esc_html( $experience ); ?></strong>
								<span><?php esc_html_e( 'שנות ניסיון', 'justice-theme' ); ?></span>
							</div>
						<?php endif; ?>

						<?php if ( $bar_num ) : ?>
							<div class="lawyer-profile__stat">
								<strong><?php echo esc_html( $bar_num ); ?></strong>
								<span><?php esc_html_e( 'מס׳ רישיון', 'justice-theme' ); ?></span>
							</div>
						<?php endif; ?>
					</div>
				</aside>

				<!-- Main content -->
				<div class="lawyer-profile__content">
					<header class="lawyer-profile__header">
						<h1 itemprop="name"><?php the_title(); ?></h1>

						<?php if ( $firm ) : ?>
							<p class="lawyer-profile__firm" itemprop="worksFor"><?php echo esc_html( $firm ); ?></p>
						<?php endif; ?>

						<?php if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) : ?>
							<div class="lawyer-profile__tags">
								<?php foreach ( $areas as $a ) : ?>
									<a href="<?php echo esc_url( get_term_link( $a ) ); ?>" class="lawyer-profile__tag"><?php echo esc_html( $a->name ); ?></a>
								<?php endforeach; ?>
							</div>
						<?php endif; ?>
					</header>

					<!-- Bio -->
					<div class="lawyer-profile__bio entry-content" itemprop="description">
						<?php the_content(); ?>
					</div>

					<!-- Details table -->
					<div class="lawyer-profile__details">
						<h2><?php esc_html_e( 'פרטים מקצועיים', 'justice-theme' ); ?></h2>
						<table>
							<?php if ( ! empty( $cities ) && ! is_wp_error( $cities ) ) : ?>
								<tr>
									<th><?php esc_html_e( 'מיקום', 'justice-theme' ); ?></th>
									<td itemprop="areaServed"><?php echo esc_html( implode( ', ', wp_list_pluck( $cities, 'name' ) ) ); ?></td>
								</tr>
							<?php endif; ?>

							<?php if ( $languages ) : ?>
								<tr>
									<th><?php esc_html_e( 'שפות', 'justice-theme' ); ?></th>
									<td itemprop="knowsLanguage"><?php echo esc_html( $languages ); ?></td>
								</tr>
							<?php endif; ?>

							<?php if ( $license ) : ?>
								<tr>
									<th><?php esc_html_e( 'סטטוס רישיון', 'justice-theme' ); ?></th>
									<td>
										<?php
										$license_labels = array( 'active' => '✅ פעיל', 'inactive' => '❌ לא פעיל', 'suspended' => '⚠️ מושעה' );
										echo esc_html( isset( $license_labels[ $license ] ) ? $license_labels[ $license ] : $license );
										?>
									</td>
								</tr>
							<?php endif; ?>
						</table>
					</div>

					<!-- Lead capture form specific to this lawyer -->
					<?php if ( get_post_meta( $lawyer_id, '_justice_lead_routing', true ) ) : ?>
						<div class="lawyer-profile__inquiry">
							<h2><?php printf( esc_html__( 'שליחת פנייה ל%s', 'justice-theme' ), get_the_title() ); ?></h2>
							<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
								<input type="hidden" name="action" value="justice_submit_lead">
								<input type="hidden" name="lead_area" value="<?php echo ! empty( $areas ) ? esc_attr( $areas[0]->name ) : ''; ?>">
								<input type="hidden" name="lead_city" value="<?php echo ! empty( $cities ) ? esc_attr( $cities[0]->name ) : ''; ?>">
								<?php wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce' ); ?>

								<div class="ask-lawyer__fields">
									<div class="ask-lawyer__field">
										<label for="inquiry-name"><?php esc_html_e( 'שם מלא', 'justice-theme' ); ?></label>
										<input type="text" id="inquiry-name" name="lead_name" required>
									</div>
									<div class="ask-lawyer__field">
										<label for="inquiry-phone"><?php esc_html_e( 'טלפון', 'justice-theme' ); ?></label>
										<input type="tel" id="inquiry-phone" name="lead_phone" required>
									</div>
									<div class="ask-lawyer__field ask-lawyer__field--full">
										<label for="inquiry-message"><?php esc_html_e( 'תיאור קצר של הבעיה', 'justice-theme' ); ?></label>
										<textarea id="inquiry-message" name="lead_message" rows="4"></textarea>
									</div>
								</div>

								<div class="ask-lawyer__consent">
									<label>
										<input type="checkbox" name="lead_consent" required>
										<?php esc_html_e( 'אני מסכים/ה לתנאי השימוש ולמדיניות הפרטיות.', 'justice-theme' ); ?>
									</label>
								</div>

								<button type="submit" class="button button--gold"><?php esc_html_e( 'שליחת פנייה', 'justice-theme' ); ?></button>
							</form>
						</div>
					<?php endif; ?>

				</div><!-- .lawyer-profile__content -->

			</div><!-- .lawyer-profile__grid -->

		</div>
	</article>

</main>

<?php get_footer(); ?>
