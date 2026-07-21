<?php
/**
 * Single article template.
 *
 * @package JusticeTheme
 */

get_header();

while ( have_posts() ) :
	the_post();

	$primary_term      = justice_theme_get_primary_practice_area();
	$connected_lawyer  = '';
	$connected_slug    = (string) get_post_meta( get_the_ID(), 'connected_lawyer_slug', true );
	$needs_legal       = '1' === (string) get_post_meta( get_the_ID(), 'needs_legal_review', true );
	$needs_sources     = '1' === (string) get_post_meta( get_the_ID(), 'needs_browser_source_verification', true );
	$source_audit      = (string) get_post_meta( get_the_ID(), 'repo_content_source_audit', true );
	$draft_word_count  = (int) get_post_meta( get_the_ID(), 'repo_content_draft_word_count', true );
	$repo_draft_status = (string) get_post_meta( get_the_ID(), 'repo_content_draft_status', true );
	$content_cluster   = sanitize_key( trim( (string) get_post_meta( get_the_ID(), 'content_cluster', true ), '`' ) );
	$primary_keyword   = (string) get_post_meta( get_the_ID(), 'primary_keyword', true );
	$current_slug      = get_post_field( 'post_name', get_the_ID() );
	$is_lawyer_selection_guide = 'find-lawyer-how-to-find-good-attorney' === $current_slug;
	$show_internal_review_status = current_user_can( 'edit_post', get_the_ID() );
	$article_contextual_cta = function_exists( 'justice_theme_get_contextual_article_lead_cta' )
		? justice_theme_get_contextual_article_lead_cta( get_the_ID(), $primary_term )
		: array(
			'url'    => home_url( '/#ask-lawyer' ),
			'title'  => __( 'צריכים בדיקה אישית אחרי הקריאה?', 'justice-theme' ),
			'text'   => __( 'אם אחרי הקריאה נשארה שאלה, אפשר להשאיר פנייה קצרה עם התחום, העיר והדחיפות.', 'justice-theme' ),
			'button' => __( 'שליחת פנייה עם הקשר מהמאמר', 'justice-theme' ),
		);
	$family_links      = array(
		'divorce-lawyer'             => __( 'עורך דין גירושין', 'justice-theme' ),
		'consensual-divorce'         => __( 'גירושין בהסכמה', 'justice-theme' ),
		'divorce-mediation'          => __( 'גישור גירושין', 'justice-theme' ),
		'child-support'              => __( 'מזונות ילדים', 'justice-theme' ),
		'child-custody'              => __( 'זמני שהות ומשמורת', 'justice-theme' ),
		'divorce-property-division'  => __( 'חלוקת רכוש בגירושין', 'justice-theme' ),
	);

	if ( $connected_slug && function_exists( 'justice_theme_get_connected_lawyer_by_slug' ) ) {
		$connected_lawyer = justice_theme_get_connected_lawyer_by_slug( $connected_slug );
	}

	$has_connected_lawyer        = $connected_lawyer instanceof WP_Post;
	$has_cluster_nav             = 'family-law' === $content_cluster;
	$has_internal_sidebar_status = $show_internal_review_status && ( $draft_word_count || $repo_draft_status );
	$has_unique_sidebar_content  = $has_connected_lawyer || $has_cluster_nav || $has_internal_sidebar_status;
	$layout_classes              = array( 'container', 'single-article__layout' );
	$sidebar_classes             = array( 'single-article__sidebar' );

	if ( ! $has_unique_sidebar_content ) {
		$layout_classes[]  = 'single-article__layout--no-sidebar';
		$sidebar_classes[] = 'single-article__sidebar--duplicate-cta-only';
	}
	?>

	<?php
	// Upper-fold conversion strip (owner law 2026-07-21): whoever lands on a
	// content page sees the path to a lawyer immediately. The cinema map
	// lazy-loads near the viewport, so it never blocks reading.
	$justice_fold_term_name = $primary_term instanceof WP_Term
		? trim( str_replace( array( 'עורכי דין דיני ', 'עורכי דין ', 'דיני ' ), '', $primary_term->name ) )
		: '';
	?>
	<article <?php post_class( 'single-article premium-card' ); ?> style="background: var(--jt-surface); border: none; box-shadow: none;">
		<header class="single-article__header glass-panel" style="max-width: 900px; margin: 40px auto 3rem; padding: 3rem 2rem; text-align: center; border-radius: var(--jt-radius-lg);">
			<div class="container container--narrow">
				<?php if ( $primary_term ) : 
					$clean_name = str_replace( array( 'עורכי דין דיני ', 'עורכי דין ', 'דיני ', 'ותאונות' ), array( '', '', '', '' ), $primary_term->name );
				?>
					<a class="single-article__term" href="<?php echo esc_url( justice_theme_public_term_link( $primary_term ) ); ?>" style="display: inline-block; margin-bottom: 1.2rem; font-size: 0.95rem; background: rgba(95, 126, 168, 0.1); color: var(--jt-accent); padding: 0.4rem 1.2rem; border-radius: 50px; font-weight: 800; text-decoration: none;">
						<?php echo esc_html( trim( $clean_name ) ); ?>
					</a>
				<?php endif; ?>

				<h1 class="single-article__title" style="font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 1.5rem; line-height: 1.25; color: var(--jt-primary-deep); letter-spacing: -0.5px;">
					<?php the_title(); ?>
				</h1>

				<?php
				$article_attribution = function_exists( 'justice_theme_article_visible_attribution' )
					? justice_theme_article_visible_attribution( get_the_ID() )
					: array(
						'label' => __( 'נערך על ידי', 'justice-theme' ),
						'name'  => get_bloginfo( 'name' ),
						'url'   => home_url( '/' ),
					);
				?>
				<div class="single-article__author" style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 0.8rem; font-size: 1rem; color: var(--jt-primary-deep); font-weight: 700;">
					<span aria-hidden="true" style="font-size: 1.2rem;">&#9878;</span>
					<span>
						<?php echo esc_html( $article_attribution['label'] ); ?>
						<a href="<?php echo esc_url( $article_attribution['url'] ); ?>" style="color: inherit;">
							<?php echo esc_html( $article_attribution['name'] ); ?>
						</a>
					</span>
				</div>

				<div class="single-article__meta" style="display: flex; justify-content: center; gap: 1.5rem; color: var(--jt-muted); font-size: 0.95rem; font-weight: 600;">
					<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>">
						<?php echo esc_html( get_the_date() ); ?>
					</time>

					<span><?php echo esc_html( justice_theme_reading_time() ); ?></span>

					<span>
						<?php
						printf(
							/* translators: %s: modified date. */
							esc_html__( 'עודכן: %s', 'justice-theme' ),
							esc_html( get_the_modified_date() )
						);
						?>
					</span>
				</div>
			</div>
		</header>

		<?php if ( function_exists( 'justice_cinema_block' ) ) : ?>
			<section class="single-article__fold" aria-label="מציאת עורך דין">
				<div class="single-article__fold-cta">
					<strong><?php echo esc_html( $justice_fold_term_name ? 'צריכים עורך דין ' . $justice_fold_term_name . '?' : 'צריכים עורך דין מתאים?' ); ?></strong>
					<a class="button button--gold" href="<?php echo esc_url( $article_contextual_cta['url'] ); ?>"><?php esc_html_e( 'השארת פנייה קצרה', 'justice-theme' ); ?></a>
					<a class="button button--ghost" href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>"><?php esc_html_e( 'חיפוש עורך דין לפי תחום ועיר', 'justice-theme' ); ?></a>
				</div>
				<?php echo justice_cinema_block( false ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</section>
		<?php endif; ?>


		<?php if ( apply_filters( 'justice_theme_show_article_intent_panel', false, get_the_ID() ) ) : ?>
		<section class="article-intent-panel" aria-label="<?php esc_attr_e( 'מה חשוב להבין לפני קריאת המדריך', 'justice-theme' ); ?>">
			<div class="article-intent-panel__item">
				<strong><?php esc_html_e( 'מה הבעיה עכשיו?', 'justice-theme' ); ?></strong>
				<span><?php esc_html_e( 'התחילו מהעובדות, הדחיפות והמסמכים שיש בידיכם. מדריך טוב צריך לעזור להבין את המצב לפני שיחה עם עורך דין.', 'justice-theme' ); ?></span>
			</div>
			<div class="article-intent-panel__item">
				<strong><?php esc_html_e( 'מתי פונים לעורך דין?', 'justice-theme' ); ?></strong>
				<span><?php esc_html_e( 'כאשר יש סיכון כספי, משפחתי, פלילי, חוזי או מועד קרוב, אל תסתפקו בקריאה כללית. קבלו בדיקה מקצועית מותאמת.', 'justice-theme' ); ?></span>
			</div>
			<div class="article-intent-panel__item">
				<strong><?php esc_html_e( 'איך Jus-Tice עוזר?', 'justice-theme' ); ?></strong>
				<span><?php esc_html_e( 'אנחנו מחברים בין מדריכים, תחומי משפט, עורכי דין וטופסי פנייה כדי להפוך חיפוש מבולבל למסלול פעולה ברור יותר.', 'justice-theme' ); ?></span>
			</div>
		</section>

		<?php endif; ?>
		<?php if ( $is_lawyer_selection_guide ) : ?>
			<section class="lawyer-selection-integrated-panel" aria-label="<?php esc_attr_e( 'מסלול בחירת עורך דין', 'justice-theme' ); ?>">
				<div class="container">
					<div class="lawyer-selection-integrated-panel__header">
						<span><?php esc_html_e( 'מדריך בחירה מחובר לאינדקס', 'justice-theme' ); ?></span>
						<h2><?php esc_html_e( 'כך בודקים עורך דין לפני שמשאירים פנייה', 'justice-theme' ); ?></h2>
						<p><?php esc_html_e( 'המסלול הזה משלב את מה שעובד באינדקסים חזקים: חיפוש לפי תחום ואזור, קריאת פרופיל מקצועי, סימון פרטים מאומתים, ורק אז פנייה קצרה עם הקשר ברור. בלי דירוג מומצא ובלי עובדות שלא נבדקו.', 'justice-theme' ); ?></p>
					</div>
					<div class="lawyer-selection-integrated-panel__grid">
						<article>
							<strong><?php esc_html_e( '1. התאמה משפטית', 'justice-theme' ); ?></strong>
							<span><?php esc_html_e( 'בחרו תחום מדויק: גירושין ודיני משפחה יחד, מקרקעין ומיסוי מקרקעין יחד, או פלילי לפי סוג ההליך. כך לא מפצלים איתותי SEO ולא שולחים את הפנייה לאדם הלא נכון.', 'justice-theme' ); ?></span>
						</article>
						<article>
							<strong><?php esc_html_e( '2. סימני אמון', 'justice-theme' ); ?></strong>
							<span><?php esc_html_e( 'בדקו האם יש תמונה אמיתית, עיר פעילות, שפות, תחומי עיסוק, מאמרים מחוברים וביקורות מאומתות. אם פרט לא אומת, הוא צריך להופיע בזהירות או לא להופיע בכלל.', 'justice-theme' ); ?></span>
						</article>
						<article>
							<strong><?php esc_html_e( '3. פנייה קצרה וחכמה', 'justice-theme' ); ?></strong>
							<span><?php esc_html_e( 'פנייה טובה כוללת עיר, דחיפות, תחום משפטי ותיאור עובדתי קצר. זה מעלה את הסיכוי לקבל תגובה רלוונטית ומונע בזבוז זמן גם לגולש וגם לבעל המקצוע.', 'justice-theme' ); ?></span>
						</article>
					</div>
					<div class="lawyer-selection-integrated-panel__actions">
						<a class="button button--primary" href="<?php echo esc_url( get_post_type_archive_link( 'justice_lawyer' ) ); ?>"><?php esc_html_e( 'מעבר למדריך עורכי הדין', 'justice-theme' ); ?></a>
						<a class="button button--ghost" href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'לעורכי דין: עדכון או קידום פרופיל', 'justice-theme' ); ?></a>
					</div>
				</div>
			</section>
		<?php endif; ?>
		<div class="<?php echo esc_attr( implode( ' ', $layout_classes ) ); ?>">
			
			<div class="single-article__main">
				<?php if ( has_post_thumbnail() ) : ?>
					<figure class="single-article__image" style="border-radius: var(--radius-md); overflow: hidden; margin-bottom: 3rem; box-shadow: var(--shadow-soft);">
						<?php the_post_thumbnail( 'justice-hero', array( 'style' => 'width: 100%; height: auto;' ) ); ?>
					</figure>
				<?php endif; ?>

				<?php if ( $show_internal_review_status && ( $needs_legal || $needs_sources ) ) : ?>
					<section class="article-review-status" style="margin-bottom: 2rem; padding: 1.5rem; background: #fff8eb; border: 1px solid rgba(182, 126, 48, 0.35); border-radius: var(--radius-md);">
						<h2 style="font-size: 1.1rem; margin: 0 0 0.75rem; color: var(--color-primary);"><?php esc_html_e( 'סטטוס בדיקה לפני פרסום', 'justice-theme' ); ?></h2>
						<ul style="margin: 0; padding-inline-start: 1.2rem; color: var(--color-muted);">
							<?php if ( $needs_legal ) : ?>
								<li><?php esc_html_e( 'NOT VERIFIED: נדרשת בדיקה משפטית לפני פרסום.', 'justice-theme' ); ?></li>
							<?php endif; ?>
							<?php if ( $needs_sources ) : ?>
								<li><?php esc_html_e( 'NOT VERIFIED: נדרשת בדיקת מקורות ידנית לפני פרסום.', 'justice-theme' ); ?></li>
							<?php endif; ?>
							<?php if ( $source_audit ) : ?>
								<li><?php echo esc_html( sprintf( __( 'Source audit: %s', 'justice-theme' ), $source_audit ) ); ?></li>
							<?php endif; ?>
						</ul>
					</section>
				<?php endif; ?>

				<div class="single-article__content entry-content">
					<?php the_content(); ?>
				</div>

				<section class="editorial-note" style="margin-top: 4rem; padding: 2rem; background: rgba(82, 114, 178, 0.05); border-radius: var(--radius-md); border-right: 4px solid var(--color-accent);">
					<h2 style="font-size: 1.2rem; color: var(--color-primary); margin-bottom: 0.5rem;"><?php esc_html_e( 'הערת מערכת', 'justice-theme' ); ?></h2>
					<p style="margin: 0; color: var(--color-muted); font-size: 0.95rem;">
						<?php esc_html_e( 'מדריך זה נועד לספק מידע משפטי כללי בלבד. אינו מהווה תחליף לייעוץ משפטי אישי מעורך דין מוסמך.', 'justice-theme' ); ?>
					</p>
				</section>

				<section class="single-article__lead-cta" aria-label="<?php esc_attr_e( 'פנייה בהקשר למאמר', 'justice-theme' ); ?>">
					<h2><?php echo esc_html( $article_contextual_cta['title'] ); ?></h2>
					<p><?php echo esc_html( $article_contextual_cta['text'] ); ?></p>
					<a class="button button--primary" href="<?php echo esc_url( $article_contextual_cta['url'] ); ?>">
						<?php echo esc_html( $article_contextual_cta['button'] ); ?>
					</a>
				</section>
			</div>
			
			<?php if ( $has_unique_sidebar_content ) : ?>
			<aside class="<?php echo esc_attr( implode( ' ', $sidebar_classes ) ); ?>" role="complementary">
				<div class="sticky-box" style="position: sticky; top: 2rem; padding: 2rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);">
					<?php if ( $has_connected_lawyer ) : ?>
					<div class="single-article__sidebar-lead-card">
						<?php
						$firm     = get_post_meta( $connected_lawyer->ID, 'firm_name', true );
						$headline = get_post_meta( $connected_lawyer->ID, 'profile_headline', true );
						?>
						<h2 style="font-size: 1.25rem; color: var(--color-primary-deep); margin-bottom: 1rem;"><?php esc_html_e( 'פרופיל מקצועי מחובר למדריך', 'justice-theme' ); ?></h2>
						<div style="display: flex; align-items: center; gap: 0.9rem; margin-bottom: 1rem;">
							<?php if ( has_post_thumbnail( $connected_lawyer->ID ) ) : ?>
								<?php echo get_the_post_thumbnail( $connected_lawyer->ID, 'thumbnail', array( 'style' => 'width: 58px; height: 58px; border-radius: 50%; object-fit: cover;' ) ); ?>
							<?php else : ?>
								<span style="display: inline-flex; align-items: center; justify-content: center; width: 58px; height: 58px; border-radius: 50%; background: rgba(82,114,178,0.12); color: var(--color-primary); font-weight: 800;">
									<?php echo esc_html( mb_substr( get_the_title( $connected_lawyer ), 0, 2 ) ); ?>
								</span>
							<?php endif; ?>
							<div>
								<strong style="display: block; color: var(--color-primary-deep);"><?php echo esc_html( get_the_title( $connected_lawyer ) ); ?></strong>
								<?php if ( $firm ) : ?>
									<small style="color: var(--color-muted);"><?php echo esc_html( $firm ); ?></small>
								<?php endif; ?>
							</div>
						</div>
						<?php if ( $headline ) : ?>
							<p style="color: var(--color-muted); margin-bottom: 1.5rem;"><?php echo esc_html( wp_trim_words( $headline, 24, '...' ) ); ?></p>
						<?php else : ?>
							<p style="color: var(--color-muted); margin-bottom: 1.5rem;"><?php esc_html_e( 'פרופיל מקצועי עם מאמרים, פרטי קשר וטופס פנייה מובנה.', 'justice-theme' ); ?></p>
						<?php endif; ?>
						<a class="button button--primary" href="<?php echo esc_url( justice_theme_public_permalink( $connected_lawyer->ID ) ); ?>" style="width: 100%; text-align: center; margin-bottom: 0.75rem;">
							<?php esc_html_e( 'מעבר לפרופיל', 'justice-theme' ); ?>
						</a>
					</div>
					<?php endif; ?>

					<?php if ( $has_cluster_nav ) : ?>
						<section class="article-cluster-nav">
							<h2><?php esc_html_e( 'אשכול דיני משפחה', 'justice-theme' ); ?></h2>
							<?php if ( $primary_keyword ) : ?>
								<p class="article-cluster-nav__keyword">
									<?php echo esc_html( sprintf( __( 'מילת מפתח בעמוד זה: %s', 'justice-theme' ), trim( $primary_keyword, '` ' ) ) ); ?>
								</p>
							<?php endif; ?>
							<nav aria-label="<?php esc_attr_e( 'קישורי אשכול דיני משפחה', 'justice-theme' ); ?>">
								<ul class="article-cluster-nav__list">
									<?php foreach ( $family_links as $slug => $label ) : ?>
										<li>
											<a
												class="article-cluster-nav__link<?php echo $current_slug === $slug ? ' is-current' : ''; ?>"
												href="<?php echo esc_url( justice_theme_public_url( home_url( '/' . $slug . '/' ) ) ); ?>"
												<?php echo $current_slug === $slug ? 'aria-current="page"' : ''; ?>
											>
												<span><?php echo esc_html( $label ); ?></span>
												<span class="article-cluster-nav__arrow" aria-hidden="true">←</span>
											</a>
										</li>
									<?php endforeach; ?>
								</ul>
							</nav>
						</section>
					<?php endif; ?>

					<?php if ( $show_internal_review_status && ( $draft_word_count || $repo_draft_status ) ) : ?>
						<hr style="border: 0; border-top: 1px solid var(--color-border); margin: 1.5rem 0;">
						<p style="font-size: 0.85rem; color: var(--color-muted); margin: 0;">
							<?php if ( $draft_word_count ) : ?>
								<?php echo esc_html( sprintf( __( 'טיוטת עומק: %s מילים.', 'justice-theme' ), number_format_i18n( $draft_word_count ) ) ); ?>
							<?php endif; ?>
							<?php if ( $repo_draft_status ) : ?>
								<br><?php echo esc_html( $repo_draft_status ); ?>
							<?php endif; ?>
						</p>
					<?php endif; ?>
				</div>
			</aside>
			<?php endif; ?>
		</div>
	</article>

	<div style="background: var(--color-bg); padding: 4rem 0;">
		<div class="container">
			<?php
			if ( function_exists( 'justice_theme_related_articles' ) ) {
				justice_theme_related_articles( get_the_ID() );
			}
			?>
		</div>
	</div>

<?php endwhile;

get_footer();

