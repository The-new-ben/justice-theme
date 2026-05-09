<?php
/**
 * Single lawyer mini-site profile.
 *
 * @package JusticeTheme
 */

get_header();

$lawyer_id       = get_the_ID();
$firm            = get_post_meta( $lawyer_id, 'firm_name', true );
$bar_num         = get_post_meta( $lawyer_id, 'bar_number', true );
$phone           = get_post_meta( $lawyer_id, 'phone', true );
$email           = get_post_meta( $lawyer_id, 'email', true );
$website         = get_post_meta( $lawyer_id, 'website', true );
$whatsapp        = get_post_meta( $lawyer_id, 'whatsapp', true );
$languages       = get_post_meta( $lawyer_id, 'languages', true );
$experience      = get_post_meta( $lawyer_id, 'years_experience', true );
$license         = get_post_meta( $lawyer_id, 'license_status', true );
$plan            = get_post_meta( $lawyer_id, 'plan_type', true );
$bio_short       = get_post_meta( $lawyer_id, 'bio_short', true );
$address         = get_post_meta( $lawyer_id, 'office_address', true );
$verified        = get_post_meta( $lawyer_id, 'verification_status', true );
$routing         = get_post_meta( $lawyer_id, 'lead_routing_enabled', true );
$video_url       = get_post_meta( $lawyer_id, 'profile_video_url', true );
$linkedin_url    = get_post_meta( $lawyer_id, 'linkedin_url', true );
$facebook_url    = get_post_meta( $lawyer_id, 'facebook_url', true );
$instagram_url   = get_post_meta( $lawyer_id, 'instagram_url', true );
$youtube_url     = get_post_meta( $lawyer_id, 'youtube_url', true );
$review_count    = (int) get_post_meta( $lawyer_id, 'review_count', true );
$average_rating  = (float) get_post_meta( $lawyer_id, 'average_rating', true );
$cities          = get_the_terms( $lawyer_id, 'city' );
$areas           = get_the_terms( $lawyer_id, 'practice-areas' );
$is_paid         = in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true );
$is_verified     = 'verified' === $verified;
$primary_area    = ( ! empty( $areas ) && ! is_wp_error( $areas ) ) ? $areas[0] : null;
$primary_city    = ( ! empty( $cities ) && ! is_wp_error( $cities ) ) ? $cities[0] : null;
$phone_link      = $phone ? 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) : '';
$whatsapp_digits = $whatsapp ? preg_replace( '/[^0-9]/', '', $whatsapp ) : '';
$whatsapp_link   = $whatsapp_digits ? 'https://wa.me/972' . ltrim( $whatsapp_digits, '0' ) : '';

$views = (int) get_post_meta( $lawyer_id, 'profile_views', true );
update_post_meta( $lawyer_id, 'profile_views', $views + 1 );

$social_links = array_filter(
	array(
		'LinkedIn'  => $linkedin_url,
		'Facebook'  => $facebook_url,
		'Instagram' => $instagram_url,
		'YouTube'   => $youtube_url,
		'Website'   => $website,
	)
);

$related_articles = new WP_Query(
	array(
		'post_type'           => 'articles',
		'post_status'         => 'publish',
		'posts_per_page'      => 3,
		'ignore_sticky_posts' => true,
		'tax_query'           => $primary_area ? array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'term_id',
				'terms'    => $primary_area->term_id,
			),
		) : array(),
	)
);
?>

<article class="lawyer-mini-site" itemscope itemtype="https://schema.org/Attorney">
	<section class="lawyer-mini-hero">
		<div class="container lawyer-mini-hero__grid">
			<div class="lawyer-mini-hero__content">
				<div class="lawyer-mini-hero__kicker">
					<span>מיני-סייט משפטי</span>
					<?php if ( $is_verified ) : ?>
						<strong>פרופיל מאומת</strong>
					<?php endif; ?>
					<?php if ( $is_paid ) : ?>
						<strong>פרופיל ממומן</strong>
					<?php endif; ?>
				</div>

				<h1 itemprop="name"><?php the_title(); ?></h1>

				<?php if ( $firm ) : ?>
					<p class="lawyer-mini-hero__firm" itemprop="worksFor"><?php echo esc_html( $firm ); ?></p>
				<?php endif; ?>

				<?php if ( $bio_short ) : ?>
					<p class="lawyer-mini-hero__summary"><?php echo esc_html( $bio_short ); ?></p>
				<?php endif; ?>

				<div class="lawyer-mini-hero__actions">
					<?php if ( $phone_link ) : ?>
						<a class="button button--primary" href="<?php echo esc_url( $phone_link ); ?>" itemprop="telephone">שיחה לעורך הדין</a>
					<?php endif; ?>
					<?php if ( $whatsapp_link ) : ?>
						<a class="button button--ghost" href="<?php echo esc_url( $whatsapp_link ); ?>" target="_blank" rel="noopener">WhatsApp</a>
					<?php endif; ?>
					<a class="button button--gold" href="#lawyer-inquiry">שליחת פנייה</a>
				</div>
			</div>

			<aside class="lawyer-mini-hero__panel" aria-label="פרטי עורך הדין">
				<div class="lawyer-mini-hero__photo">
					<?php if ( has_post_thumbnail() ) : ?>
						<?php the_post_thumbnail( 'large', array( 'itemprop' => 'image' ) ); ?>
					<?php else : ?>
						<div class="lawyer-mini-hero__initials" aria-hidden="true"><?php echo esc_html( mb_substr( get_the_title(), 0, 2 ) ); ?></div>
					<?php endif; ?>
				</div>

				<div class="lawyer-mini-hero__facts">
					<?php if ( $primary_area ) : ?>
						<span><?php echo esc_html( $primary_area->name ); ?></span>
					<?php endif; ?>
					<?php if ( $primary_city ) : ?>
						<span><?php echo esc_html( $primary_city->name ); ?></span>
					<?php endif; ?>
					<?php if ( $languages ) : ?>
						<span><?php echo esc_html( $languages ); ?></span>
					<?php endif; ?>
				</div>
			</aside>
		</div>
	</section>

	<section class="section lawyer-mini-proof">
		<div class="container lawyer-mini-proof__grid">
			<div class="lawyer-mini-proof__item">
				<strong><?php echo $experience ? esc_html( $experience ) : '—'; ?></strong>
				<span>שנות ניסיון</span>
			</div>
			<div class="lawyer-mini-proof__item">
				<strong><?php echo $bar_num ? esc_html( $bar_num ) : '—'; ?></strong>
				<span>מספר רישיון</span>
			</div>
			<div class="lawyer-mini-proof__item">
				<strong><?php echo $is_verified ? 'מאומת' : 'לא מאומת'; ?></strong>
				<span>סטטוס פרופיל</span>
			</div>
			<div class="lawyer-mini-proof__item">
				<strong><?php echo ( $review_count > 0 && $average_rating > 0 ) ? esc_html( number_format_i18n( $average_rating, 1 ) ) : 'בקרוב'; ?></strong>
				<span>ביקורות לקוחות</span>
			</div>
		</div>
	</section>

	<section class="section lawyer-mini-body">
		<div class="container lawyer-mini-body__grid">
			<main class="lawyer-mini-body__main">
				<section class="lawyer-mini-panel">
					<h2>על עורך הדין</h2>
					<div class="entry-content" itemprop="description">
						<?php the_content(); ?>
					</div>
				</section>

				<?php if ( $video_url ) : ?>
					<section class="lawyer-mini-panel lawyer-mini-video">
						<h2>וידאו היכרות</h2>
						<div class="lawyer-mini-video__frame">
							<?php echo wp_oembed_get( esc_url( $video_url ) ) ?: '<a href="' . esc_url( $video_url ) . '" target="_blank" rel="noopener">צפייה בווידאו</a>'; ?>
						</div>
					</section>
				<?php endif; ?>

				<?php if ( ! empty( $areas ) && ! is_wp_error( $areas ) ) : ?>
					<section class="lawyer-mini-panel">
						<h2>תחומי טיפול</h2>
						<div class="lawyer-mini-tags">
							<?php foreach ( $areas as $area ) : ?>
								<a href="<?php echo esc_url( get_term_link( $area ) ); ?>"><?php echo esc_html( $area->name ); ?></a>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>

				<section class="lawyer-mini-panel">
					<h2>מאמרים ותוכן מקצועי</h2>
					<?php if ( $related_articles->have_posts() ) : ?>
						<div class="lawyer-mini-articles">
							<?php while ( $related_articles->have_posts() ) : ?>
								<?php $related_articles->the_post(); ?>
								<a class="lawyer-mini-article" href="<?php the_permalink(); ?>">
									<span><?php echo esc_html( get_the_date() ); ?></span>
									<strong><?php the_title(); ?></strong>
								</a>
							<?php endwhile; ?>
						</div>
						<?php wp_reset_postdata(); ?>
					<?php else : ?>
						<p class="lawyer-mini-muted">כאן יוצגו מאמרים חתומים, מדריכים ועדכונים מקצועיים של עורך הדין לאחר חיבור התוכן במערכת.</p>
					<?php endif; ?>
				</section>

				<section class="lawyer-mini-panel">
					<h2>ביקורות והמלצות</h2>
					<?php if ( $review_count > 0 && $average_rating > 0 ) : ?>
						<p class="lawyer-mini-rating"><?php echo esc_html( number_format_i18n( $average_rating, 1 ) ); ?> מתוך 5 על בסיס <?php echo esc_html( number_format_i18n( $review_count ) ); ?> ביקורות.</p>
					<?php else : ?>
						<p class="lawyer-mini-muted">ביקורות לקוחות יוצגו רק לאחר אימות, בקרה ואישור פרסום.</p>
					<?php endif; ?>
				</section>
			</main>

			<aside class="lawyer-mini-body__aside">
				<section class="lawyer-mini-contact" id="lawyer-inquiry">
					<h2>פנייה דיסקרטית</h2>
					<p>השאירו פרטים ונעביר את הפנייה בצורה מסודרת לפי תחום, עיר ודחיפות.</p>

					<?php if ( $routing ) : ?>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_submit_lead">
							<input type="hidden" name="lead_area" value="<?php echo $primary_area ? esc_attr( $primary_area->name ) : ''; ?>">
							<input type="hidden" name="lead_city" value="<?php echo $primary_city ? esc_attr( $primary_city->name ) : ''; ?>">
							<input type="hidden" name="assigned_lawyer_id" value="<?php echo esc_attr( $lawyer_id ); ?>">
							<?php wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce' ); ?>

							<label for="inquiry-name">שם מלא</label>
							<input type="text" id="inquiry-name" name="lead_name" required>

							<label for="inquiry-phone">טלפון</label>
							<input type="tel" id="inquiry-phone" name="lead_phone" required>

							<label for="inquiry-message">תיאור קצר</label>
							<textarea id="inquiry-message" name="lead_message" rows="4"></textarea>

							<label class="lawyer-mini-consent">
								<input type="checkbox" name="lead_consent" required>
								<span>אני מסכים/ה להעברת הפנייה לצורך יצירת קשר. אין באמור ייעוץ משפטי.</span>
							</label>

							<button type="submit" class="button button--primary">שליחת פנייה</button>
						</form>
					<?php else : ?>
						<p class="lawyer-mini-muted">ניתוב לידים עדיין לא הופעל לפרופיל זה.</p>
					<?php endif; ?>
				</section>

				<section class="lawyer-mini-sidebox">
					<h2>פרטים מקצועיים</h2>
					<dl>
						<?php if ( $address ) : ?>
							<dt>כתובת משרד</dt>
							<dd itemprop="address"><?php echo esc_html( $address ); ?></dd>
						<?php endif; ?>
						<?php if ( $license ) : ?>
							<dt>סטטוס רישיון</dt>
							<dd><?php echo esc_html( $license ); ?></dd>
						<?php endif; ?>
						<?php if ( $email ) : ?>
							<dt>אימייל</dt>
							<dd><a href="<?php echo esc_url( 'mailto:' . $email ); ?>" itemprop="email"><?php echo esc_html( $email ); ?></a></dd>
						<?php endif; ?>
					</dl>
				</section>

				<?php if ( ! empty( $social_links ) ) : ?>
					<section class="lawyer-mini-sidebox">
						<h2>נוכחות דיגיטלית</h2>
						<div class="lawyer-mini-social">
							<?php foreach ( $social_links as $label => $url ) : ?>
								<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $label ); ?></a>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>
			</aside>
		</div>
	</section>
</article>

<?php get_footer(); ?>
