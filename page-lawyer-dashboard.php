<?php
/**
 * Template Name: Lawyer Dashboard
 *
 * @package JusticeTheme
 */

get_header();

if ( ! is_user_logged_in() ) :
	?>
	<section class="lawyer-dashboard lawyer-dashboard--logged-out section">
		<div class="container lawyer-dashboard__gate">
			<p class="section-header__eyebrow"><?php esc_html_e( 'אזור אישי לעורכי דין', 'justice-theme' ); ?></p>
			<h1><?php esc_html_e( 'התחברו כדי לנהל את הנוכחות שלכם ב-Jus-Tice', 'justice-theme' ); ?></h1>
			<p><?php esc_html_e( 'האזור האישי מיועד לפרופיל, לידים, תוכן, סטטוס מנוי וכלים עתידיים. פרסום ועדכונים מהותיים עוברים בדיקה לפני עלייה לאתר.', 'justice-theme' ); ?></p>
			<div class="lawyer-dashboard__actions">
				<a class="button button--gold" href="<?php echo esc_url( wp_login_url( get_permalink() ) ); ?>"><?php esc_html_e( 'התחברות', 'justice-theme' ); ?></a>
				<a class="button button--outline" href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>"><?php esc_html_e( 'הצטרפות לעורכי דין', 'justice-theme' ); ?></a>
			</div>
		</div>
	</section>
	<?php
	get_footer();
	return;
endif;

$user_id  = get_current_user_id();
$profiles = post_type_exists( 'justice_lawyer' )
	? new WP_Query( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 10,
		'orderby'        => 'modified',
		'order'          => 'DESC',
		'meta_query'     => array(
			array(
				'key'   => 'claimed_by_user_id',
				'value' => (string) $user_id,
			),
		),
	) )
	: null;

$profile_ids = array();
if ( $profiles && $profiles->have_posts() ) {
	foreach ( $profiles->posts as $profile_post ) {
		$profile_ids[] = (int) $profile_post->ID;
	}
}

$leads = ( post_type_exists( 'justice_lead' ) && $profile_ids )
	? new WP_Query( array(
		'post_type'      => 'justice_lead',
		'post_status'    => array( 'publish', 'private', 'draft', 'pending' ),
		'posts_per_page' => 8,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			array(
				'key'     => 'assigned_lawyer_id',
				'value'   => $profile_ids,
				'compare' => 'IN',
			),
		),
	) )
	: null;

$lead_count = $leads ? (int) $leads->found_posts : 0;

$content_requests = ( post_type_exists( 'articles' ) && $profile_ids )
	? new WP_Query( array(
		'post_type'      => 'articles',
		'post_status'    => array( 'publish', 'draft', 'pending', 'private' ),
		'posts_per_page' => 8,
		'orderby'        => 'date',
		'order'          => 'DESC',
		'meta_query'     => array(
			'relation' => 'AND',
			array(
				'key'   => 'content_status',
				'value' => 'lawyer_requested_draft',
			),
			array(
				'key'     => 'requested_by_lawyer_id',
				'value'   => $profile_ids,
				'compare' => 'IN',
			),
		),
	) )
	: null;

$content_request_count = $content_requests ? (int) $content_requests->found_posts : 0;
?>

<section class="lawyer-dashboard section">
	<div class="container">
		<header class="lawyer-dashboard__hero">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'אזור אישי לעורכי דין', 'justice-theme' ); ?></p>
				<h1><?php esc_html_e( 'מרכז השליטה לנוכחות, תוכן ולידים', 'justice-theme' ); ?></h1>
				<p><?php esc_html_e( 'זהו MVP ראשון: צפייה בפרופיל המקושר, סטטוס מסחרי, לידים משויכים ומשימות לשיפור המיני-סייט. עריכה עצמאית, תשלומים ו-AI Console יתווספו בשלבים מבוקרים.', 'justice-theme' ); ?></p>
			</div>
			<a class="button button--gold" href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>"><?php esc_html_e( 'פתיחת פרופיל נוסף', 'justice-theme' ); ?></a>
		</header>

		<?php if ( ! $profiles || ! $profiles->have_posts() ) : ?>
			<div class="lawyer-dashboard__empty">
				<h2><?php esc_html_e( 'עדיין אין פרופיל מקושר לחשבון הזה', 'justice-theme' ); ?></h2>
				<p><?php esc_html_e( 'אפשר לשלוח בקשת הצטרפות, או לבקש מצוות האתר לקשר פרופיל קיים לחשבון המשתמש שלכם. פרופיל לא עולה לאוויר בלי בדיקה ואישור.', 'justice-theme' ); ?></p>
				<a class="button button--gold" href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>"><?php esc_html_e( 'שליחת בקשת הצטרפות', 'justice-theme' ); ?></a>
			</div>
		<?php else : ?>
			<div class="lawyer-dashboard__summary">
				<div>
					<strong><?php echo esc_html( (string) $content_request_count ); ?></strong>
					<span><?php esc_html_e( 'בקשות תוכן', 'justice-theme' ); ?></span>
				</div>
				<div>
					<strong><?php echo esc_html( (string) count( $profile_ids ) ); ?></strong>
					<span><?php esc_html_e( 'פרופילים מקושרים', 'justice-theme' ); ?></span>
				</div>
				<div>
					<strong><?php echo esc_html( (string) $lead_count ); ?></strong>
					<span><?php esc_html_e( 'לידים משויכים', 'justice-theme' ); ?></span>
				</div>
				<div>
					<strong><?php esc_html_e( 'בקרוב', 'justice-theme' ); ?></strong>
					<span><?php esc_html_e( 'תשלומים ו-AI Console', 'justice-theme' ); ?></span>
				</div>
			</div>

			<div class="lawyer-dashboard__grid">
				<div class="lawyer-dashboard__main">
					<?php if ( isset( $_GET['content_request'] ) && 'sent' === $_GET['content_request'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'בקשת התוכן התקבלה כטיוטה ותיבדק לפני כל פרסום.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['content_request'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'בקשת התוכן לא נשלחה. בדקו שנבחר פרופיל ושנושא המאמר מולא.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<h2><?php esc_html_e( 'הפרופילים שלי', 'justice-theme' ); ?></h2>
					<?php if ( isset( $_GET['profile_update'] ) && 'sent' === $_GET['profile_update'] ) : ?>
						<div class="legaltool-request__notice"><?php esc_html_e( 'בקשת עדכון המיני-סייט נשמרה לבדיקה. שום שינוי ציבורי לא יפורסם לפני אישור.', 'justice-theme' ); ?></div>
					<?php elseif ( isset( $_GET['profile_update'] ) ) : ?>
						<div class="lawyer-registration__error"><?php esc_html_e( 'בקשת עדכון הפרופיל לא נשלחה. בדקו שנבחר פרופיל מקושר.', 'justice-theme' ); ?></div>
					<?php endif; ?>

					<?php while ( $profiles->have_posts() ) : $profiles->the_post(); ?>
						<?php
						$post_id      = get_the_ID();
						$plan         = get_post_meta( $post_id, 'plan_type', true ) ?: 'free';
						$subscription = get_post_meta( $post_id, 'subscription_status', true ) ?: 'inactive';
						$verification = get_post_meta( $post_id, 'verification_status', true ) ?: 'unverified';
						$profile_url  = get_permalink( $post_id );
						$completeness = justice_theme_lawyer_dashboard_profile_completeness( $post_id );
						?>
						<article class="lawyer-dashboard-profile">
							<div>
								<h3><?php the_title(); ?></h3>
								<p><?php echo esc_html( get_post_meta( $post_id, 'firm_name', true ) ?: get_the_excerpt() ); ?></p>
							</div>
							<dl>
								<div><dt><?php esc_html_e( 'מסלול', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $plan ); ?></dd></div>
								<div><dt><?php esc_html_e( 'מנוי', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $subscription ); ?></dd></div>
								<div><dt><?php esc_html_e( 'אימות', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $verification ); ?></dd></div>
								<div><dt><?php esc_html_e( 'שלמות פרופיל', 'justice-theme' ); ?></dt><dd><?php echo esc_html( $completeness . '%' ); ?></dd></div>
							</dl>
							<div class="lawyer-dashboard-profile__actions">
								<a class="button button--outline" href="<?php echo esc_url( $profile_url ); ?>"><?php esc_html_e( 'צפייה בפרופיל', 'justice-theme' ); ?></a>
								<a class="button button--gold" href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'שדרוג מסלול', 'justice-theme' ); ?></a>
							</div>
						</article>
					<?php endwhile; wp_reset_postdata(); ?>

					<section class="lawyer-dashboard-content-request">
						<h2><?php esc_html_e( 'בקשת עדכון למיני-סייט', 'justice-theme' ); ?></h2>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'שלחו נוסח חדש לכותרת, שירותים, תהליך עבודה, וידאו או שאלות נפוצות. העדכון נשמר לבדיקה בלבד ולא משנה את הפרופיל הציבורי עד אישור.', 'justice-theme' ); ?></p>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_lawyer_profile_update_request">
							<?php wp_nonce_field( 'justice_lawyer_profile_update', 'justice_lawyer_profile_update_nonce' ); ?>

							<label for="profile-update-profile"><?php esc_html_e( 'פרופיל מחובר', 'justice-theme' ); ?></label>
							<select id="profile-update-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="profile-headline"><?php esc_html_e( 'כותרת ראשית מוצעת', 'justice-theme' ); ?></label>
							<input id="profile-headline" type="text" name="profile_headline">

							<label for="profile-services"><?php esc_html_e( 'שירותים מרכזיים', 'justice-theme' ); ?></label>
							<textarea id="profile-services" name="profile_services" rows="4"></textarea>

							<label for="profile-process"><?php esc_html_e( 'איך נראה תהליך העבודה איתכם?', 'justice-theme' ); ?></label>
							<textarea id="profile-process" name="profile_process" rows="4"></textarea>

							<label for="profile-video-url"><?php esc_html_e( 'קישור וידאו', 'justice-theme' ); ?></label>
							<input id="profile-video-url" type="url" name="profile_video_url">

							<label for="profile-faqs"><?php esc_html_e( 'שאלות נפוצות שתרצו שיופיעו בפרופיל', 'justice-theme' ); ?></label>
							<textarea id="profile-faqs" name="profile_faqs" rows="4"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'שליחת בקשת עדכון', 'justice-theme' ); ?></button>
						</form>
					</section>

					<h2><?php esc_html_e( 'לידים אחרונים', 'justice-theme' ); ?></h2>
					<?php if ( $leads && $leads->have_posts() ) : ?>
						<div class="lawyer-dashboard-leads">
							<?php while ( $leads->have_posts() ) : $leads->the_post(); ?>
								<?php $lead_id = get_the_ID(); ?>
								<article>
									<strong><?php echo esc_html( get_post_meta( $lead_id, 'visitor_name', true ) ?: get_the_title() ); ?></strong>
									<span><?php echo esc_html( get_post_meta( $lead_id, 'legal_area', true ) ?: get_post_meta( $lead_id, 'lead_area', true ) ?: '-' ); ?></span>
									<span><?php echo esc_html( get_post_meta( $lead_id, 'lead_status', true ) ?: 'new' ); ?></span>
									<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
								</article>
							<?php endwhile; wp_reset_postdata(); ?>
						</div>
					<?php else : ?>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'אין עדיין לידים משויכים לפרופיל הזה.', 'justice-theme' ); ?></p>
					<?php endif; ?>

					<h2><?php esc_html_e( 'בקשות תוכן ומאמרים', 'justice-theme' ); ?></h2>
					<?php if ( $content_requests && $content_requests->have_posts() ) : ?>
						<div class="lawyer-dashboard-content-list">
							<?php while ( $content_requests->have_posts() ) : $content_requests->the_post(); ?>
								<?php
								$request_id    = get_the_ID();
								$request_state = get_post_status( $request_id );
								$needs_legal   = (string) get_post_meta( $request_id, 'needs_legal_review', true );
								$needs_source  = (string) get_post_meta( $request_id, 'needs_browser_source_verification', true );
								$intent        = (string) get_post_meta( $request_id, 'lawyer_content_intent', true );
								$audience      = (string) get_post_meta( $request_id, 'lawyer_content_audience', true );
								?>
								<article>
									<div>
										<strong><?php the_title(); ?></strong>
										<?php if ( '' !== $intent || '' !== $audience ) : ?>
											<p><?php echo esc_html( trim( $intent . ' ' . $audience ) ); ?></p>
										<?php endif; ?>
									</div>
									<span><?php echo esc_html( $request_state ); ?></span>
									<span><?php echo '1' === $needs_legal ? esc_html__( 'בדיקה משפטית', 'justice-theme' ) : esc_html__( 'עבר בדיקה משפטית', 'justice-theme' ); ?></span>
									<span><?php echo '1' === $needs_source ? esc_html__( 'בדיקת מקורות', 'justice-theme' ) : esc_html__( 'מקורות נבדקו', 'justice-theme' ); ?></span>
									<time datetime="<?php echo esc_attr( get_the_date( DATE_W3C ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
								</article>
							<?php endwhile; wp_reset_postdata(); ?>
						</div>
					<?php else : ?>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'אין עדיין בקשות תוכן לפרופיל הזה. אפשר לשלוח רעיון למאמר חתום דרך הטופס הבא.', 'justice-theme' ); ?></p>
					<?php endif; ?>

					<section class="lawyer-dashboard-content-request">
						<h2><?php esc_html_e( 'בקשת מאמר חתום', 'justice-theme' ); ?></h2>
						<p class="lawyer-dashboard__muted"><?php esc_html_e( 'שלחו רעיון למאמר או מדריך. הבקשה נשמרת כטיוטה בלבד ותעבור עריכה, בדיקת מקורות ובדיקה משפטית לפני פרסום.', 'justice-theme' ); ?></p>
						<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ask-lawyer__form">
							<input type="hidden" name="action" value="justice_lawyer_content_request">
							<?php wp_nonce_field( 'justice_lawyer_content_request', 'justice_lawyer_content_request_nonce' ); ?>

							<label for="content-profile"><?php esc_html_e( 'פרופיל מחובר', 'justice-theme' ); ?></label>
							<select id="content-profile" name="lawyer_profile_id" required>
								<?php foreach ( $profile_ids as $profile_id ) : ?>
									<option value="<?php echo esc_attr( $profile_id ); ?>"><?php echo esc_html( get_the_title( $profile_id ) ); ?></option>
								<?php endforeach; ?>
							</select>

							<label for="content-topic"><?php esc_html_e( 'נושא המאמר', 'justice-theme' ); ?></label>
							<input id="content-topic" type="text" name="content_topic" required placeholder="<?php esc_attr_e( 'לדוגמה: איך מתכוננים להסכם גירושין בהסכמה', 'justice-theme' ); ?>">

							<label for="content-intent"><?php esc_html_e( 'מטרת התוכן', 'justice-theme' ); ?></label>
							<input id="content-intent" type="text" name="content_intent" placeholder="<?php esc_attr_e( 'מידע ללקוחות, שאלות נפוצות, חיזוק תחום מומחיות, הכנה לפגישה', 'justice-theme' ); ?>">

							<label for="content-audience"><?php esc_html_e( 'קהל יעד', 'justice-theme' ); ?></label>
							<input id="content-audience" type="text" name="content_audience" placeholder="<?php esc_attr_e( 'לדוגמה: הורים לפני פרידה, בעלי דירות, חשודים לפני חקירה', 'justice-theme' ); ?>">

							<label for="content-notes"><?php esc_html_e( 'נקודות שחשוב לכלול', 'justice-theme' ); ?></label>
							<textarea id="content-notes" name="content_notes" rows="4"></textarea>

							<button type="submit" class="button button--gold"><?php esc_html_e( 'שליחת בקשת תוכן', 'justice-theme' ); ?></button>
						</form>
					</section>
				</div>

				<aside class="lawyer-dashboard__side">
					<h2><?php esc_html_e( 'מה יעלה את הערך של המיני-סייט?', 'justice-theme' ); ?></h2>
					<ul>
						<li><?php esc_html_e( 'תמונה מקצועית, לוגו משרד וביוגרפיה ממוקדת.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'וידאו קצר שמסביר את הגישה המקצועית.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'מאמרים חתומים לפי תחומי מומחיות.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'שאלות נפוצות, תהליך עבודה והסבר על זמינות.', 'justice-theme' ); ?></li>
						<li><?php esc_html_e( 'ביקורות מאושרות בלבד וללא טענות דירוג לא מבוססות.', 'justice-theme' ); ?></li>
					</ul>
					<div class="lawyer-dashboard__roadmap">
						<strong><?php esc_html_e( 'בשלבים הבאים', 'justice-theme' ); ?></strong>
						<p><?php esc_html_e( 'עריכת פרופיל עצמאית, בקשות תוכן, סליקת מנוי, תיבת לידים, AI Console ודוחות חשיפה.', 'justice-theme' ); ?></p>
					</div>
				</aside>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php
get_footer();
