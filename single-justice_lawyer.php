<?php
/**
 * Single lawyer profile page.
 *
 * Template: single-justice_lawyer.php
 * SEO target: "עורך דין {name}" + "{practice area} {city}"
 * Compliance: "פרופיל ממומן" badge for paid profiles.
 *
 * @package JusticeTheme
 */

get_header();

$lawyer_id  = get_the_ID();
$firm       = get_post_meta( $lawyer_id, 'firm_name', true );
$bar_num    = get_post_meta( $lawyer_id, 'bar_number', true );
$phone      = get_post_meta( $lawyer_id, 'phone', true );
$email      = get_post_meta( $lawyer_id, 'email', true );
$website    = get_post_meta( $lawyer_id, 'website', true );
$whatsapp   = get_post_meta( $lawyer_id, 'whatsapp', true );
$languages  = get_post_meta( $lawyer_id, 'languages', true );
$experience = get_post_meta( $lawyer_id, 'years_experience', true );
$license    = get_post_meta( $lawyer_id, 'license_status', true );
$plan       = get_post_meta( $lawyer_id, 'plan_type', true );
$bio_short  = get_post_meta( $lawyer_id, 'bio_short', true );
$address    = get_post_meta( $lawyer_id, 'office_address', true );
$verified   = get_post_meta( $lawyer_id, 'verification_status', true );
$is_paid    = in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true );
$routing    = get_post_meta( $lawyer_id, 'lead_routing_enabled', true );
$cities     = get_the_terms( $lawyer_id, 'city' );
$areas      = get_the_terms( $lawyer_id, 'practice-areas' );

// Track profile view — but skip:
//   - feed/REST/admin requests
//   - logged-in users (admin previews + the lawyer themselves)
//   - common bot user agents (Googlebot, Bingbot, etc.)
// This prevents inflating analytics with non-human traffic.
$justice_skip_view = is_feed() || is_admin() || is_user_logged_in();
if ( ! $justice_skip_view ) {
	$ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? strtolower( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) : '';
	$bot_signatures = array( 'bot', 'crawl', 'spider', 'slurp', 'mediapartners', 'preview', 'lighthouse', 'pagespeed', 'pingdom', 'gtmetrix' );
	foreach ( $bot_signatures as $sig ) {
		if ( $ua && false !== strpos( $ua, $sig ) ) {
			$justice_skip_view = true;
			break;
		}
	}
}
if ( ! $justice_skip_view ) {
	$views = (int) get_post_meta( $lawyer_id, 'profile_views', true );
	update_post_meta( $lawyer_id, 'profile_views', $views + 1 );
}
?>

<article class="lawyer-profile section" itemscope itemtype="https://schema.org/Attorney">
		<div class="container">

			<?php if ( $is_paid ) : ?>
				<span class="lawyer-profile__badge">פרופיל ממומן</span>
			<?php endif; ?>

			<div class="lawyer-profile__grid">

				<!-- Sidebar: photo + contact -->
				<aside class="lawyer-profile__sidebar">
					<div class="lawyer-profile__avatar">
						<?php if ( has_post_thumbnail() ) : ?>
							<?php the_post_thumbnail( 'medium', array( 'class' => 'lawyer-profile__photo', 'itemprop' => 'image' ) ); ?>
						<?php else : ?>
							<div class="lawyer-profile__placeholder-avatar" aria-hidden="true">
								<span><?php echo esc_html( mb_substr( get_the_title(), 0, 2 ) ); ?></span>
							</div>
						<?php endif; ?>
					</div>

					<div class="lawyer-profile__contact-card">
						<h2>פרטי התקשרות</h2>

						<?php if ( $phone ) : ?>
							<a href="<?php echo esc_url( 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) ); ?>" class="button button--gold lawyer-profile__call-btn" itemprop="telephone">
								<?php echo esc_html( $phone ); ?>
							</a>
						<?php endif; ?>

						<?php if ( $whatsapp ) : ?>
							<a href="<?php echo esc_url( 'https://wa.me/972' . ltrim( preg_replace( '/[^0-9]/', '', $whatsapp ), '0' ) ); ?>" class="button button--whatsapp" target="_blank" rel="noopener">
								שליחת וואטסאפ
							</a>
						<?php endif; ?>

						<?php if ( $email ) : ?>
							<a href="<?php echo esc_url( 'mailto:' . $email ); ?>" class="lawyer-profile__email" itemprop="email">
								<?php echo esc_html( $email ); ?>
							</a>
						<?php endif; ?>

						<?php if ( $website ) : ?>
							<a href="<?php echo esc_url( $website ); ?>" class="lawyer-profile__website" target="_blank" rel="noopener" itemprop="url">
								אתר האינטרנט
							</a>
						<?php endif; ?>

						<?php if ( $address ) : ?>
							<p class="lawyer-profile__address" itemprop="address"><?php echo esc_html( $address ); ?></p>
						<?php endif; ?>
					</div>

					<!-- Quick stats -->
					<div class="lawyer-profile__stats">
						<?php if ( $experience ) : ?>
							<div class="lawyer-profile__stat">
								<strong><?php echo esc_html( $experience ); ?></strong>
								<span>שנות ניסיון</span>
							</div>
						<?php endif; ?>

						<?php if ( $bar_num ) : ?>
							<div class="lawyer-profile__stat">
								<strong><?php echo esc_html( $bar_num ); ?></strong>
								<span>מס׳ רישיון</span>
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
									<a href="<?php echo esc_url( add_query_arg( 'area', $a->slug, get_post_type_archive_link( 'justice_lawyer' ) ) ); ?>" class="lawyer-profile__tag"><?php echo esc_html( $a->name ); ?></a>
								<?php endforeach; ?>
							</div>
						<?php endif; ?>
					</header>

					<!-- Bio -->
					<?php if ( $bio_short ) : ?>
						<div class="lawyer-profile__bio-short">
							<p><?php echo esc_html( $bio_short ); ?></p>
						</div>
					<?php endif; ?>

					<div class="lawyer-profile__bio entry-content" itemprop="description">
						<?php the_content(); ?>
					</div>

					<!-- Details table -->
					<div class="lawyer-profile__details">
						<h2>פרטים מקצועיים</h2>
						<table>
							<?php if ( ! empty( $cities ) && ! is_wp_error( $cities ) ) : ?>
								<tr>
									<th>מיקום</th>
									<td itemprop="areaServed"><?php echo esc_html( implode( ', ', wp_list_pluck( $cities, 'name' ) ) ); ?></td>
								</tr>
							<?php endif; ?>

							<?php if ( $languages ) : ?>
								<tr>
									<th>שפות</th>
									<td itemprop="knowsLanguage"><?php echo esc_html( $languages ); ?></td>
								</tr>
							<?php endif; ?>

							<?php if ( $license ) : ?>
								<tr>
									<th>סטטוס רישיון</th>
									<td>
										<?php
										$license_labels = array( 'active' => 'פעיל', 'inactive' => 'לא פעיל', 'suspended' => 'מושעה' );
										echo esc_html( isset( $license_labels[ $license ] ) ? $license_labels[ $license ] : $license );
										?>
									</td>
								</tr>
							<?php endif; ?>

							<?php if ( 'verified' === $verified ) : ?>
								<tr>
									<th>אימות</th>
									<td>פרופיל מאומת</td>
								</tr>
							<?php endif; ?>
						</table>
					</div>

					<!-- Lead capture form -->
					<?php if ( $routing ) : ?>
						<div class="lawyer-profile__inquiry">
							<h2><?php printf( 'שליחת פנייה ל%s', get_the_title() ); ?></h2>
							<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
								<input type="hidden" name="action" value="justice_submit_lead">
								<input type="hidden" name="lead_area" value="<?php echo ! empty( $areas ) ? esc_attr( $areas[0]->name ) : ''; ?>">
								<input type="hidden" name="lead_city" value="<?php echo ! empty( $cities ) ? esc_attr( $cities[0]->name ) : ''; ?>">
								<?php wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce' ); ?>

								<div class="ask-lawyer__fields">
									<div class="ask-lawyer__field">
										<label for="inquiry-name">שם מלא</label>
										<input type="text" id="inquiry-name" name="lead_name" required>
									</div>
									<div class="ask-lawyer__field">
										<label for="inquiry-phone">טלפון</label>
										<input type="tel" id="inquiry-phone" name="lead_phone" required>
									</div>
									<div class="ask-lawyer__field ask-lawyer__field--full">
										<label for="inquiry-message">תיאור קצר של הבעיה</label>
										<textarea id="inquiry-message" name="lead_message" rows="4"></textarea>
									</div>
								</div>

								<div class="ask-lawyer__consent">
									<label>
										<input type="checkbox" name="lead_consent" required>
										אני מסכים/ה לתנאי השימוש ולמדיניות הפרטיות.
									</label>
								</div>

								<button type="submit" class="button button--gold">שליחת פנייה</button>
							</form>
						</div>
					<?php endif; ?>

				</div><!-- .lawyer-profile__content -->

			</div><!-- .lawyer-profile__grid -->

		</div>
	</article>

<?php get_footer(); ?>
