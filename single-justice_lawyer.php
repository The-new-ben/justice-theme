<?php
/**
 * Single lawyer mini-site profile.
 *
 * This template is CMS-driven: every rich section reads from justice_lawyer
 * fields first, and only shows a section when real content exists.
 *
 * @package JusticeTheme
 */

get_header();

$lawyer_id = get_the_ID();

$meta = static function ( $key, $default = '' ) use ( $lawyer_id ) {
	$value = get_post_meta( $lawyer_id, $key, true );
	return '' !== $value && null !== $value ? $value : $default;
};

$parse_rows = static function ( $raw ) {
	$rows = array_filter( array_map( 'trim', preg_split( '/\r\n|\r|\n/', (string) $raw ) ) );
	return array_map(
		static function ( $row ) {
			return array_map( 'trim', explode( '|', $row ) );
		},
		$rows
	);
};

$firm              = $meta( 'firm_name' );
$bar_num           = $meta( 'bar_number' );
$phone             = $meta( 'phone' );
$email             = $meta( 'email' );
$website           = $meta( 'website' );
$whatsapp          = $meta( 'whatsapp' );
$languages         = $meta( 'languages' );
$experience        = $meta( 'years_experience' );
$license           = $meta( 'license_status' );
$plan              = $meta( 'plan_type' );
$bio_short         = $meta( 'bio_short' );
$address           = $meta( 'office_address' );
$verified          = $meta( 'verification_status' );
$routing           = $meta( 'lead_routing_enabled' );
$video_url         = $meta( 'profile_video_url' );
$linkedin_url      = $meta( 'linkedin_url' );
$facebook_url      = $meta( 'facebook_url' );
$instagram_url     = $meta( 'instagram_url' );
$youtube_url       = $meta( 'youtube_url' );
$profile_headline  = $meta( 'profile_headline', get_the_title() );
$profile_subtitle  = $meta( 'profile_subheadline', $bio_short );
$approach_title    = $meta( 'profile_approach_title', 'איך מתנהל הליווי המשפטי' );
$approach          = $meta( 'profile_approach' );
$services          = $parse_rows( $meta( 'profile_services' ) );
$process_steps     = $parse_rows( $meta( 'profile_process' ) );
$credentials       = $parse_rows( $meta( 'profile_credentials' ) );
$media_items       = $parse_rows( $meta( 'profile_media_urls' ) );
$faqs              = $parse_rows( $meta( 'profile_faqs' ) );
$testimonials      = $parse_rows( $meta( 'profile_testimonials' ) );
$cta_title         = $meta( 'profile_cta_title' );
$cta_text          = $meta( 'profile_cta_text' );
$review_count      = (int) $meta( 'review_count', 0 );
$average_rating    = (float) $meta( 'average_rating', 0 );
$cities            = get_the_terms( $lawyer_id, 'city' );
$areas             = get_the_terms( $lawyer_id, 'practice-areas' );
$is_paid           = in_array( $plan, array( 'pro', 'featured', 'lead_partner', 'full_service' ), true );
$is_verified       = 'verified' === $verified;
$primary_area      = ( ! empty( $areas ) && ! is_wp_error( $areas ) ) ? $areas[0] : null;
$primary_city      = ( ! empty( $cities ) && ! is_wp_error( $cities ) ) ? $cities[0] : null;
$phone_link        = $phone ? 'tel:' . preg_replace( '/[^0-9+]/', '', $phone ) : '';
$whatsapp_digits   = $whatsapp ? preg_replace( '/[^0-9]/', '', $whatsapp ) : '';
$whatsapp_link     = $whatsapp_digits ? 'https://wa.me/972' . ltrim( $whatsapp_digits, '0' ) : '';

$views = (int) $meta( 'profile_views', 0 );
$user_agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? strtolower( sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) ) : '';
$is_countable_view = ! is_admin()
	&& ! is_user_logged_in()
	&& ! wp_doing_ajax()
	&& ! wp_doing_cron()
	&& ! is_feed()
	&& ! preg_match( '/bot|crawl|spider|slurp|facebookexternalhit|whatsapp|telegram|preview|monitor|uptime/i', $user_agent );

if ( $is_countable_view ) {
	update_post_meta( $lawyer_id, 'profile_views', $views + 1 );
}

$social_links = array_filter(
	array(
		'LinkedIn'  => $linkedin_url,
		'Facebook'  => $facebook_url,
		'Instagram' => $instagram_url,
		'YouTube'   => $youtube_url,
		'Website'   => $website,
	)
);

$lawyer_profile_slug      = get_post_field( 'post_name', $lawyer_id );
$connected_article_slugs = array_filter( array( $lawyer_profile_slug ) );

if ( false !== mb_strpos( get_the_title( $lawyer_id ), 'מאיה' ) && false !== mb_strpos( get_the_title( $lawyer_id ), 'רוטנברג' ) ) {
	$connected_article_slugs[] = 'advocate-maya-rotenberg';
}

$connected_article_slugs = array_values( array_unique( array_map( 'sanitize_title', $connected_article_slugs ) ) );
$connected_article_meta_values = $connected_article_slugs;

foreach ( $connected_article_slugs as $connected_article_slug ) {
	$connected_article_meta_values[] = '`' . $connected_article_slug . '`';
}

$connected_articles_args = array(
	'post_type'           => 'articles',
	'post_status'         => 'publish',
	'posts_per_page'      => 4,
	'ignore_sticky_posts' => true,
	'meta_query'          => array(
		array(
			'key'     => 'connected_lawyer_slug',
			'value'   => array_values( array_unique( $connected_article_meta_values ) ),
			'compare' => 'IN',
		),
	),
);

$related_articles = new WP_Query( $connected_articles_args );

if ( ! $related_articles->have_posts() && $primary_area ) {
	$related_articles = new WP_Query( array(
		'post_type'           => 'articles',
		'post_status'         => 'publish',
		'posts_per_page'      => 4,
		'ignore_sticky_posts' => true,
		'tax_query'           => array(
			array(
				'taxonomy' => 'practice-areas',
				'field'    => 'term_id',
				'terms'    => $primary_area->term_id,
			),
		),
	) );
}
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

				<h1 itemprop="name"><?php echo esc_html( $profile_headline ); ?></h1>

				<?php if ( $firm ) : ?>
					<p class="lawyer-mini-hero__firm" itemprop="worksFor"><?php echo esc_html( $firm ); ?></p>
				<?php endif; ?>

				<?php if ( $profile_subtitle ) : ?>
					<p class="lawyer-mini-hero__summary"><?php echo esc_html( $profile_subtitle ); ?></p>
				<?php endif; ?>

				<div class="lawyer-mini-hero__actions">
					<?php if ( $phone_link ) : ?>
						<a class="button button--primary" href="<?php echo esc_url( $phone_link ); ?>" itemprop="telephone">שיחה לעורכת הדין</a>
					<?php endif; ?>
					<?php if ( $whatsapp_link ) : ?>
						<a class="button button--ghost" href="<?php echo esc_url( $whatsapp_link ); ?>" target="_blank" rel="noopener">WhatsApp</a>
					<?php endif; ?>
					<a class="button button--gold" href="#lawyer-inquiry">שליחת פנייה</a>
				</div>
			</div>

			<aside class="lawyer-mini-hero__panel" aria-label="פרטי עורכת הדין">
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
				<strong><?php echo $experience ? esc_html( $experience ) : '-'; ?></strong>
				<span>שנות ניסיון</span>
			</div>
			<div class="lawyer-mini-proof__item">
				<strong><?php echo $bar_num ? esc_html( $bar_num ) : '-'; ?></strong>
				<span>מספר רישיון</span>
			</div>
			<div class="lawyer-mini-proof__item">
				<strong><?php echo $is_verified ? 'מאומת' : 'לא מאומת'; ?></strong>
				<span>סטטוס פרופיל</span>
			</div>
			<div class="lawyer-mini-proof__item">
				<strong><?php echo ( $review_count > 0 && $average_rating > 0 ) ? esc_html( number_format_i18n( $average_rating, 1 ) ) : 'בקרוב'; ?></strong>
				<span>ביקורות מאושרות</span>
			</div>
		</div>
	</section>

	<section class="section lawyer-mini-body">
		<div class="container lawyer-mini-body__grid">
			<main class="lawyer-mini-body__main">
				<section class="lawyer-mini-panel">
					<h2>על עורכת הדין</h2>
					<div class="entry-content" itemprop="description">
						<?php the_content(); ?>
					</div>
				</section>

				<?php if ( $approach || ! empty( $process_steps ) ) : ?>
					<section class="lawyer-mini-panel lawyer-mini-editorial">
						<h2><?php echo esc_html( $approach_title ); ?></h2>
						<?php if ( $approach ) : ?>
							<div class="entry-content"><?php echo wp_kses_post( wpautop( $approach ) ); ?></div>
						<?php endif; ?>
						<?php if ( ! empty( $process_steps ) ) : ?>
							<div class="lawyer-mini-steps">
								<?php foreach ( $process_steps as $index => $row ) : ?>
									<div class="lawyer-mini-step">
										<span><?php echo esc_html( $index + 1 ); ?></span>
										<strong><?php echo esc_html( $row[0] ?? '' ); ?></strong>
										<?php if ( ! empty( $row[1] ) ) : ?>
											<p><?php echo esc_html( $row[1] ); ?></p>
										<?php endif; ?>
									</div>
								<?php endforeach; ?>
							</div>
						<?php endif; ?>
					</section>
				<?php endif; ?>

				<?php if ( ! empty( $services ) ) : ?>
					<section class="lawyer-mini-panel">
						<h2>שירותים משפטיים מרכזיים</h2>
						<div class="lawyer-mini-service-grid">
							<?php foreach ( $services as $row ) : ?>
								<article class="lawyer-mini-service">
									<strong><?php echo esc_html( $row[0] ?? '' ); ?></strong>
									<?php if ( ! empty( $row[1] ) ) : ?>
										<p><?php echo esc_html( $row[1] ); ?></p>
									<?php endif; ?>
								</article>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>

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
					<h2>מאמרים חתומים ותוכן מקצועי</h2>
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
						<p class="lawyer-mini-muted">כאן יוצגו מאמרים, מדריכים ועדכונים מקצועיים שחוברו לפרופיל דרך שדה CMS ייעודי. התוכן יעלה רק לאחר בדיקה משפטית ועריכת מקורות.</p>
					<?php endif; ?>
				</section>

				<?php if ( ! empty( $media_items ) ) : ?>
					<section class="lawyer-mini-panel">
						<h2>וידאו, הופעות ועדכונים</h2>
						<div class="lawyer-mini-media-list">
							<?php foreach ( $media_items as $row ) : ?>
								<a class="lawyer-mini-media-item" href="<?php echo esc_url( $row[1] ?? $row[0] ?? '' ); ?>" target="_blank" rel="noopener">
									<strong><?php echo esc_html( $row[0] ?? '' ); ?></strong>
									<?php if ( ! empty( $row[2] ) ) : ?>
										<span><?php echo esc_html( $row[2] ); ?></span>
									<?php endif; ?>
								</a>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>

				<section class="lawyer-mini-panel">
					<h2>ביקורות והמלצות</h2>
					<?php if ( $review_count > 0 && $average_rating > 0 ) : ?>
						<p class="lawyer-mini-rating"><?php echo esc_html( number_format_i18n( $average_rating, 1 ) ); ?> מתוך 5 על בסיס <?php echo esc_html( number_format_i18n( $review_count ) ); ?> ביקורות מאושרות.</p>
					<?php else : ?>
						<p class="lawyer-mini-muted">ביקורות לקוחות יוצגו רק לאחר אימות, בקרה ואישור פרסום.</p>
					<?php endif; ?>
					<?php if ( ! empty( $testimonials ) ) : ?>
						<div class="lawyer-mini-testimonials">
							<?php foreach ( $testimonials as $row ) : ?>
								<figure>
									<blockquote><?php echo esc_html( $row[0] ?? '' ); ?></blockquote>
									<?php if ( ! empty( $row[1] ) ) : ?>
										<figcaption><?php echo esc_html( $row[1] ); ?></figcaption>
									<?php endif; ?>
								</figure>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
				</section>

				<?php if ( ! empty( $faqs ) ) : ?>
					<section class="lawyer-mini-panel">
						<h2>שאלות נפוצות</h2>
						<div class="lawyer-mini-faqs">
							<?php foreach ( $faqs as $row ) : ?>
								<details>
									<summary><?php echo esc_html( $row[0] ?? '' ); ?></summary>
									<?php if ( ! empty( $row[1] ) ) : ?>
										<p><?php echo esc_html( $row[1] ); ?></p>
									<?php endif; ?>
								</details>
							<?php endforeach; ?>
						</div>
					</section>
				<?php endif; ?>

				<?php if ( $cta_title || $cta_text ) : ?>
					<section class="lawyer-mini-panel lawyer-mini-final-cta">
						<h2><?php echo esc_html( $cta_title ?: 'רוצים לבדוק את הצעד הבא?' ); ?></h2>
						<?php if ( $cta_text ) : ?>
							<p><?php echo esc_html( $cta_text ); ?></p>
						<?php endif; ?>
						<a class="button button--primary" href="#lawyer-inquiry">השארת פרטים</a>
					</section>
				<?php endif; ?>
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

				<?php if ( ! empty( $credentials ) ) : ?>
					<section class="lawyer-mini-sidebox">
						<h2>הסמכות וניסיון</h2>
						<ul class="lawyer-mini-credential-list">
							<?php foreach ( $credentials as $row ) : ?>
								<li>
									<strong><?php echo esc_html( $row[0] ?? '' ); ?></strong>
									<?php if ( ! empty( $row[1] ) ) : ?>
										<span><?php echo esc_html( $row[1] ); ?></span>
									<?php endif; ?>
								</li>
							<?php endforeach; ?>
						</ul>
					</section>
				<?php endif; ?>

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
