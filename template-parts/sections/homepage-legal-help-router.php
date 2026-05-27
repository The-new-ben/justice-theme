<?php
/**
 * Homepage legal help router.
 *
 * A public-first bridge from stressful legal situations to useful guides,
 * lawyer search, and intake without changing the full lawyer-selection guide.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$legal_help_routes = array(
	array(
		'kicker'      => __( 'דחוף ורגיש', 'justice-theme' ),
		'title'       => __( 'זימון לחקירה, מעצר או חשד פלילי', 'justice-theme' ),
		'description' => __( 'במצב פלילי לא כדאי להתחיל מניחושים. חשוב להבין מה מותר לומר, מתי לבקש עורך דין, אילו מסמכים לשמור ואיך להימנע מטעות שתלווה את התיק בהמשך.', 'justice-theme' ),
		'steps'       => array(
			__( 'רשמו תאריכים, שמות גורמים ומסמכים שקיבלתם.', 'justice-theme' ),
			__( 'קראו מדריך בסיסי לפני שיחה או פגישה.', 'justice-theme' ),
			__( 'חפשו עורך דין פלילי לפי עיר וזמינות.', 'justice-theme' ),
		),
		'lead_area'   => 'criminal-law',
		'guide_url'   => justice_theme_safe_public_link( '/criminal-defense-attorney/', '/lawyers/?area=criminal-law' ),
		'lawyers_url' => home_url( '/lawyers/?area=criminal-law' ),
	),
	array(
		'kicker'      => __( 'משפחה וילדים', 'justice-theme' ),
		'title'       => __( 'גירושין, משמורת, מזונות או הסכם משפחתי', 'justice-theme' ),
		'description' => __( 'בתיקי משפחה ההחלטות הראשונות משפיעות על כסף, ילדים ושגרה יומיומית. לפני שבוחרים עורך דין כדאי להבין את המסלול, את המסמכים ואת השאלות שצריך לשאול.', 'justice-theme' ),
		'steps'       => array(
			__( 'הכינו ציר זמן קצר של האירועים וההסכמות.', 'justice-theme' ),
			__( 'בדקו אם יש דחיפות סביב ילדים, רכוש או צווי ביניים.', 'justice-theme' ),
			__( 'השוו פרופילים בתחום משפחה באזור הרלוונטי.', 'justice-theme' ),
		),
		'lead_area'   => 'family-law',
		'guide_url'   => justice_theme_safe_public_link( '/divorce-lawyer/', '/family-law/' ),
		'lawyers_url' => home_url( '/lawyers/?area=family-law' ),
	),
	array(
		'kicker'      => __( 'כסף ונכס', 'justice-theme' ),
		'title'       => __( 'קנייה או מכירת דירה, חוזה, טאבו או ליקויי בנייה', 'justice-theme' ),
		'description' => __( 'עסקת מקרקעין נראית לפעמים טכנית, אבל טעות אחת בחוזה, במסים או ברישום יכולה לעלות הרבה. התחילו בבדיקת הסיכון המרכזי ורק אחר כך עברו לאיש מקצוע מתאים.', 'justice-theme' ),
		'steps'       => array(
			__( 'רכזו חוזה, נסח טאבו, תכתובות ומועדי תשלום.', 'justice-theme' ),
			__( 'בדקו אם מדובר בעסקה, סכסוך או ליקוי לאחר מסירה.', 'justice-theme' ),
			__( 'חפשו עורך דין מקרקעין לפי עיר וסוג עסקה.', 'justice-theme' ),
		),
		'lead_area'   => 'real-estate-law',
		'guide_url'   => home_url( '/practice-areas/real-estate-law/' ),
		'lawyers_url' => home_url( '/lawyers/?area=real-estate-law' ),
	),
	array(
		'kicker'      => __( 'עבודה ופרנסה', 'justice-theme' ),
		'title'       => __( 'פיטורים, שימוע, שכר, הטרדה או חוזה עבודה', 'justice-theme' ),
		'description' => __( 'כשמקום העבודה מעורב, חשוב לא לפעול מתוך לחץ. כדאי להבין אילו זכויות יש לכם, מה אסור למעסיק לעשות, ואילו ראיות או מסמכים כדאי לשמור לפני פנייה.', 'justice-theme' ),
		'steps'       => array(
			__( 'שמרו תלושי שכר, הודעות, זימון לשימוע וחוזה עבודה.', 'justice-theme' ),
			__( 'בדקו אם יש מועד קרוב שדורש תגובה מהירה.', 'justice-theme' ),
			__( 'עברו למדריכי דיני עבודה או לפרופילים בתחום.', 'justice-theme' ),
		),
		'lead_area'   => 'labor-law',
		'guide_url'   => home_url( '/practice-areas/labor-law/' ),
		'lawyers_url' => home_url( '/lawyers/?area=labor-law' ),
	),
	array(
		'kicker'      => __( 'נזק ופיצוי', 'justice-theme' ),
		'title'       => __( 'תאונה, פגיעה, ביטוח לאומי או רשלנות רפואית', 'justice-theme' ),
		'description' => __( 'בתיקי נזק ופיצוי יש משמעות למסמכים רפואיים, מועדים, טפסים ותיעוד. לפני שמוותרים או חותמים, כדאי להבין מי הגוף שמולכם ומהו המסלול הנכון.', 'justice-theme' ),
		'steps'       => array(
			__( 'אספו מסמכים רפואיים, אישורי מחלה ותמונות מהאירוע.', 'justice-theme' ),
			__( 'בדקו אם מדובר בתאונת עבודה, תאונת דרכים או רשלנות.', 'justice-theme' ),
			__( 'חפשו מידע או עורך דין לפי סוג הפגיעה.', 'justice-theme' ),
		),
		'lead_area'   => 'personal-injury-law',
		'guide_url'   => justice_theme_safe_public_link( '/national-insurance/', '/lawyers/?area=personal-injury-law' ),
		'lawyers_url' => home_url( '/lawyers/?area=personal-injury-law' ),
	),
	array(
		'kicker'      => __( 'חובות והוצאה לפועל', 'justice-theme' ),
		'title'       => __( 'עיקול, אזהרה, חובות, חדלות פירעון או גבייה', 'justice-theme' ),
		'description' => __( 'כשמגיע מכתב אזהרה או עיקול, אנשים רבים דוחים את הטיפול מרוב לחץ. דווקא כאן חשוב להבין את המועד, את הסכום, את הגוף הפועל ואת האפשרויות לעצירת נזק.', 'justice-theme' ),
		'steps'       => array(
			__( 'צלמו את האזהרה, מספר התיק והסכומים שמופיעים בה.', 'justice-theme' ),
			__( 'בדקו אם יש הגבלת זמן לתגובה או בקשה דחופה.', 'justice-theme' ),
			__( 'עברו למידע או לפרופילים בתחום חובות והוצאה לפועל.', 'justice-theme' ),
		),
		'lead_area'   => 'general',
		'guide_url'   => home_url( '/articles/' ),
		'lawyers_url' => home_url( '/lawyers/?area=debt-collection' ),
	),
);
?>

<section class="homepage-legal-help-router section" id="legal-help-router" aria-labelledby="legal-help-router-title">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'עזרה משפטית לפי מצב', 'justice-theme' ); ?></p>
				<h2 id="legal-help-router-title"><?php esc_html_e( 'מה קרה לכם עכשיו, ומה כדאי לבדוק לפני שפונים לעורך דין?', 'justice-theme' ); ?></h2>
				<p class="section-header__desc"><?php esc_html_e( 'במקום להתחיל מרשימת שמות, התחילו מהבעיה. בחרו מצב קרוב למה שקורה לכם, קראו מה להכין, עברו למדריך מתאים ורק אז השוו עורכי דין רלוונטיים. המידע באתר כללי ואינו מחליף ייעוץ משפטי אישי.', 'justice-theme' ); ?></p>
			</div>
			<a class="section-header__link button button--primary" href="<?php echo esc_url( home_url( '/articles/' ) ); ?>"><?php esc_html_e( 'כל המדריכים', 'justice-theme' ); ?></a>
		</div>

		<div class="homepage-legal-help-router__grid">
			<?php foreach ( $legal_help_routes as $route ) : ?>
				<?php
				$route_topic_title = wp_strip_all_tags( $route['title'] );
				$route_intake_url  = function_exists( 'justice_theme_ask_lawyer_fallback_url' )
					? justice_theme_ask_lawyer_fallback_url(
						array(
							'lead_area'           => $route['lead_area'],
							'lead_message'        => $route_topic_title,
							'lead_source_surface' => 'homepage_legal_help_router',
							'source_keyword'      => $route_topic_title,
							'utm_source'          => 'homepage_legal_help_router',
							'utm_medium'          => 'situation_card',
							'utm_campaign'        => 'public_legal_help',
						)
					)
					: home_url( '/#ask-lawyer' );
				?>
				<article class="legal-help-route-card">
					<p class="legal-help-route-card__kicker"><?php echo esc_html( $route['kicker'] ); ?></p>
					<h3><?php echo esc_html( $route['title'] ); ?></h3>
					<p><?php echo esc_html( $route['description'] ); ?></p>
					<ul>
						<?php foreach ( $route['steps'] as $step ) : ?>
							<li><?php echo esc_html( $step ); ?></li>
						<?php endforeach; ?>
					</ul>
					<div class="legal-help-route-card__actions">
						<a class="button button--gold" href="<?php echo esc_url( $route['guide_url'] ); ?>"><?php esc_html_e( 'להבין את הנושא', 'justice-theme' ); ?></a>
						<a class="button button--ghost" href="<?php echo esc_url( $route['lawyers_url'] ); ?>"><?php esc_html_e( 'לחפש עורך דין', 'justice-theme' ); ?></a>
						<a class="button button--outline legal-help-route-card__intake" href="<?php echo esc_url( $route_intake_url ); ?>"
							data-lead-area="<?php echo esc_attr( $route['lead_area'] ); ?>"
							data-lead-message="<?php echo esc_attr( $route_topic_title ); ?>"
							data-lead-source-keyword="<?php echo esc_attr( $route_topic_title ); ?>"
							data-lead-source-surface="homepage_legal_help_router"
							data-lead-utm-source="homepage_legal_help_router"
							data-lead-utm-medium="situation_card"
							data-lead-utm-campaign="public_legal_help"><?php esc_html_e( 'שליחת פנייה בנושא', 'justice-theme' ); ?></a>
					</div>
				</article>
			<?php endforeach; ?>
		</div>

		<div class="homepage-legal-help-router__note">
			<strong><?php esc_html_e( 'לא בטוחים באיזה תחום לבחור?', 'justice-theme' ); ?></strong>
			<span><?php esc_html_e( 'אפשר להתחיל בפנייה כללית עם תיאור קצר. נבדוק את התחום, העיר והדחיפות, ונכוון למסלול המתאים בלי להציג זאת כהמלצה או הבטחה לתוצאה.', 'justice-theme' ); ?></span>
			<a href="<?php echo esc_url( home_url( '/#ask-lawyer' ) ); ?>"><?php esc_html_e( 'שליחת פנייה מסודרת', 'justice-theme' ); ?></a>
		</div>
	</div>
</section>
