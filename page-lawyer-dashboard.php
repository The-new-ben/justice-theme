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
					<h2><?php esc_html_e( 'הפרופילים שלי', 'justice-theme' ); ?></h2>
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
								<a class="button button--gold" href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'בקשת עדכון', 'justice-theme' ); ?></a>
							</div>
						</article>
					<?php endwhile; wp_reset_postdata(); ?>

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
