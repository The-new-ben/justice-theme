<?php
/**
 * Template Name: Legal Editor Bio
 *
 * Bio page for the site's responsible legal reviewer (עו"ד בן בטש).
 * Every fact rendered here comes from justice_theme_site_legal_reviewer()
 * and the Israel Bar Association card the owner supplied. No invented claims.
 *
 * @package JusticeTheme
 */

get_header();

$reviewer   = function_exists( 'justice_theme_site_legal_reviewer' ) ? justice_theme_site_legal_reviewer() : array();
$configured = function_exists( 'justice_theme_site_legal_reviewer_is_configured' ) && justice_theme_site_legal_reviewer_is_configured();
$admitted   = isset( $reviewer['admitted'] ) ? substr( (string) $reviewer['admitted'], 0, 4 ) : '';
$registry   = (string) ( $reviewer['bar_registry_url'] ?? '' );
?>

<section class="legal-editor-bio section">
	<div class="container" style="max-width: 760px;">
		<header class="legal-editor-bio__header">
			<p class="section-header__eyebrow"><?php esc_html_e( 'העורך המשפטי של האתר', 'justice-theme' ); ?></p>
			<h1><?php echo esc_html( (string) ( $reviewer['name'] ?? get_the_title() ) ); ?></h1>
			<?php if ( '' !== (string) ( $reviewer['jobTitle'] ?? '' ) ) : ?>
				<p class="legal-editor-bio__role"><?php echo esc_html( (string) $reviewer['jobTitle'] ); ?></p>
			<?php endif; ?>
		</header>

		<div class="legal-editor-bio__facts">
			<?php if ( '' !== $admitted ) : ?>
				<p><strong><?php esc_html_e( 'הסמכה:', 'justice-theme' ); ?></strong> <?php printf( esc_html__( 'חבר לשכת עורכי הדין בישראל משנת %s', 'justice-theme' ), esc_html( $admitted ) ); ?></p>
			<?php endif; ?>
			<?php if ( '' !== (string) ( $reviewer['district'] ?? '' ) ) : ?>
				<p><strong><?php esc_html_e( 'מחוז:', 'justice-theme' ); ?></strong> <?php echo esc_html( (string) $reviewer['district'] ); ?></p>
			<?php endif; ?>
			<?php if ( '' !== $registry ) : ?>
				<p>
					<strong><?php esc_html_e( 'אימות רישיון:', 'justice-theme' ); ?></strong>
					<a href="<?php echo esc_url( $registry ); ?>" rel="noopener" target="_blank"><?php esc_html_e( 'כרטיס עורך הדין בספר עורכי הדין של לשכת עורכי הדין', 'justice-theme' ); ?></a>
				</p>
			<?php endif; ?>
		</div>

		<div class="legal-editor-bio__body">
			<?php
			// Owner-editable page content first (real CMS content wins).
			the_content();
			?>

			<h2><?php esc_html_e( 'מה תפקיד העורך המשפטי באתר?', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'Jus-Tice הוא פורטל מידע משפטי בעברית. תוכן משפטי משפיע על החלטות אמיתיות של אנשים, ולכן כל מדריך משפטי באתר עובר בקרה של עורך דין מוסמך לפני פרסום ובעדכונים מהותיים. הבקרה כוללת התאמה לדין הקיים, הסרת הבטחות תוצאה, בדיקת מקורות ראשוניים והקפדה על ניסוח זהיר שאינו ייעוץ משפטי פרטני.', 'justice-theme' ); ?></p>

			<h2><?php esc_html_e( 'תהליך העריכה', 'justice-theme' ); ?></h2>
			<ul>
				<li><?php esc_html_e( 'מחקר: בדיקת החקיקה, הפסיקה והמקורות הרשמיים הרלוונטיים לנושא.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'כתיבה ועריכה: ניסוח בעברית ברורה, ללא הבטחות וללא ניסוחים שיווקיים מטעים.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'בקרה משפטית: עורך דין מוסמך בודק את הטיוטה לפני פרסום.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'עדכון: מדריכים מתעדכנים כאשר הדין משתנה, עם תאריך עדכון גלוי.', 'justice-theme' ); ?></li>
			</ul>

			<h2><?php esc_html_e( 'גילוי נאות', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'המידע באתר הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי או תחליף לייעוץ משפטי פרטני. בתחום דיני המשפחה, תוכן ייעודי נבדק על ידי עו"ד מאיה רוטנברג, עורכת דין לענייני משפחה.', 'justice-theme' ); ?></p>
		</div>
	</div>
</section>

<?php
// Person schema for the legal editor (only when real data is configured).
if ( $configured && function_exists( 'justice_theme_site_legal_reviewer_schema' ) ) {
	$person_schema = justice_theme_site_legal_reviewer_schema();
	if ( $person_schema ) {
		$person_schema['@context']         = 'https://schema.org';
		$person_schema['mainEntityOfPage'] = justice_theme_public_permalink( get_the_ID() );
		echo '<script type="application/ld+json">' . wp_json_encode( $person_schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . '</script>';
	}
}

get_footer();
