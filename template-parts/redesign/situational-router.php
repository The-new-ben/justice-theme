<?php
/**
 * Situational router - "מה קרה לכם עכשיו?" per Homepage.dc.html.
 *
 * Six situation cards, each with a real guide link, a real directory
 * link and related-guide cross-links (validated via
 * justice_theme_safe_public_link so nothing points at an unpublished
 * slug).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_situation_icons = array(
	'shield'    => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7 3v5.5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z"/></svg>',
	'heart'     => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19s-7-4.35-7-9.5C5 6.6 7.1 5 9.2 5c1.2 0 2.3.55 2.8 1.5C12.5 5.55 13.6 5 14.8 5 16.9 5 19 6.6 19 9.5 19 14.65 12 19 12 19z"/></svg>',
	'house'     => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5"/><path d="M6.5 10v9.5h11V10"/><path d="M10 19.5v-5.5h4v5.5"/></svg>',
	'briefcase' => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8.5h16v10a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 18.5v-10z"/><path d="M9 8.5V6.8A1.8 1.8 0 0110.8 5h2.4A1.8 1.8 0 0115 6.8v1.7"/><path d="M4 13h16"/></svg>',
	'cross'     => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 8.5v7M8.5 12h7"/></svg>',
	'warning'   => '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4 21 19H3z"/><path d="M12 10v4"/><circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none"/></svg>',
);

$justice_situations = array(
	array(
		'icon'         => 'shield',
		'tag'          => __( 'דחוף ורגיש', 'justice-theme' ),
		'title'        => __( 'זימון לחקירה, מעצר או חשד פלילי', 'justice-theme' ),
		'desc'         => __( 'חשוב להבין מה מותר לומר, מתי לבקש עורך דין ואילו מסמכים לשמור.', 'justice-theme' ),
		'guide_url'    => justice_theme_safe_public_link( '/criminal-defense-attorney/', '/lawyers/?area=criminal-law' ),
		'lawyers_url'  => home_url( '/lawyers/?area=criminal-law' ),
		'lawyer_label' => __( 'לחפש עורך דין פלילי', 'justice-theme' ),
		'related'      => array(
			array( __( 'אלימות במשפחה: צו הגנה, זכויות ועונשים', 'justice-theme' ), justice_theme_safe_public_link( '/domestic-violence/', '/criminal-defense-attorney/' ) ),
			array( __( 'שימוע לפני כתב אישום: זכויות והכנה', 'justice-theme' ), justice_theme_safe_public_link( '/hearing-before-indictment/', '/criminal-defense-attorney/' ) ),
		),
	),
	array(
		'icon'         => 'heart',
		'tag'          => __( 'משפחה וילדים', 'justice-theme' ),
		'title'        => __( 'גירושין, משמורת, מזונות או הסכם משפחתי', 'justice-theme' ),
		'desc'         => __( 'ההחלטות הראשונות משפיעות על כסף, ילדים ושגרה יומיומית.', 'justice-theme' ),
		'guide_url'    => justice_theme_safe_public_link( '/divorce-lawyer/', '/family-law/' ),
		'lawyers_url'  => home_url( '/lawyers/?area=family-law' ),
		'lawyer_label' => __( 'לחפש עורך דין גירושין', 'justice-theme' ),
		'related'      => array(
			array( __( 'משמורת ילדים: איך נקבעת ומה חשוב', 'justice-theme' ), justice_theme_safe_public_link( '/child-custody/', '/family-law/' ) ),
			array( __( 'מזונות אישה: זכאות, חישוב ותביעה', 'justice-theme' ), justice_theme_safe_public_link( '/alimony-israel/', '/family-law/' ) ),
		),
	),
	array(
		'icon'         => 'house',
		'tag'          => __( 'כסף ונכס', 'justice-theme' ),
		'title'        => __( 'קנייה או מכירת דירה, חוזה, טאבו או ליקויי בנייה', 'justice-theme' ),
		'desc'         => __( 'טעות אחת בחוזה, במסים או ברישום יכולה לעלות הרבה.', 'justice-theme' ),
		'guide_url'    => justice_theme_safe_public_link( '/real-estate-attorney/', '/practice-areas/real-estate-law/' ),
		'lawyers_url'  => home_url( '/lawyers/?area=real-estate-law' ),
		'lawyer_label' => __( 'לחפש עורך דין מקרקעין', 'justice-theme' ),
		'related'      => array(
			array( __( 'עלות עורך דין מקרקעין: מחירון מעודכן', 'justice-theme' ), justice_theme_safe_public_link( '/real-estate-lawyer-cost-2025/', '/real-estate-attorney/' ) ),
			array( __( 'הסכם שכירות: מה בודקים לפני חתימה', 'justice-theme' ), justice_theme_safe_public_link( '/rental-agreement/', '/real-estate-attorney/' ) ),
		),
	),
	array(
		'icon'         => 'briefcase',
		'tag'          => __( 'עבודה ופרנסה', 'justice-theme' ),
		'title'        => __( 'פיטורים, שימוע, שכר או חוזה עבודה', 'justice-theme' ),
		'desc'         => __( 'כדאי להבין אילו זכויות יש לכם לפני שמגיבים בלחץ.', 'justice-theme' ),
		'guide_url'    => home_url( '/practice-areas/labor-law/' ),
		'lawyers_url'  => home_url( '/lawyers/?area=labor-law' ),
		'lawyer_label' => __( 'לחפש עורך דין דיני עבודה', 'justice-theme' ),
		'related'      => array(
			array( __( 'חוזה עבודה: סעיפים שחייבים לבדוק', 'justice-theme' ), justice_theme_safe_public_link( '/employment-contract/', '/practice-areas/labor-law/' ) ),
			array( __( 'יחסי עובד ומעסיק: זכויות בסיום העסקה', 'justice-theme' ), justice_theme_safe_public_link( '/employer-worker-relationship/', '/practice-areas/labor-law/' ) ),
		),
	),
	array(
		'icon'         => 'cross',
		'tag'          => __( 'נזק ופיצוי', 'justice-theme' ),
		'title'        => __( 'תאונה, פגיעה, ביטוח לאומי או רשלנות רפואית', 'justice-theme' ),
		'desc'         => __( 'למסמכים הרפואיים ולמועדים יש משמעות ישירה על גובה הפיצוי.', 'justice-theme' ),
		'guide_url'    => justice_theme_safe_public_link( '/medical-malpractice-lawyer/', '/tort-lawyer/' ),
		'lawyers_url'  => home_url( '/lawyers/?area=torts' ),
		'lawyer_label' => __( 'לחפש עורך דין נזיקין', 'justice-theme' ),
		'related'      => array(
			array( __( 'מהי רשלנות רפואית: הגדרה ודוגמאות', 'justice-theme' ), justice_theme_safe_public_link( '/what-is-medical-malpractice-definition-examples/', '/medical-malpractice-lawyer/' ) ),
			array( __( 'ערעור על החלטת ביטוח לאומי', 'justice-theme' ), justice_theme_safe_public_link( '/bituach-leumi-appeal-guide/', '/tort-lawyer/' ) ),
		),
	),
	array(
		'icon'         => 'warning',
		'tag'          => __( 'חובות והוצאה לפועל', 'justice-theme' ),
		'title'        => __( 'עיקול, אזהרה, חובות או הליכי גבייה', 'justice-theme' ),
		'desc'         => __( 'יש בדרך כלל מועד תגובה. אל תחכו עד הרגע האחרון.', 'justice-theme' ),
		'guide_url'    => home_url( '/articles/' ),
		'lawyers_url'  => home_url( '/lawyers/?area=debt-collection' ),
		'lawyer_label' => __( 'לחפש עורך דין הוצאה לפועל', 'justice-theme' ),
		'related'      => array(
			array( __( 'איך מגישים תביעה בבית משפט', 'justice-theme' ), justice_theme_safe_public_link( '/filing-a-lawsuit-how-to-sue/', '/articles/' ) ),
			array( __( 'כמה עולה עורך דין: מדריך שכר טרחה', 'justice-theme' ), justice_theme_safe_public_link( '/how-much-will-a-criminal-defense-lawyer-cost/', '/articles/' ) ),
		),
	),
);
?>

<section class="jt2-section jt2-section--tint" id="situations">
	<div class="jt2-section__inner">
		<span class="jt2-eyebrow"><?php esc_html_e( 'עזרה משפטית לפי מצב', 'justice-theme' ); ?></span>
		<h2 class="jt2-h2"><?php esc_html_e( 'מה קרה לכם עכשיו?', 'justice-theme' ); ?></h2>
		<p class="jt2-sub"><?php esc_html_e( 'בחרו את המצב הקרוב למה שאתם עוברים. כל כרטיס מוביל למדריך, למאמרים קשורים ולעורכי דין רלוונטיים.', 'justice-theme' ); ?></p>

		<div class="jt2-situations">
			<?php foreach ( $justice_situations as $justice_situation ) : ?>
				<div class="jt2-situation">
					<div class="jt2-situation__top">
						<span class="jt2-situation__icon"><?php echo $justice_situation_icons[ $justice_situation['icon'] ]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
						<span class="jt2-badge jt2-badge--navy"><?php echo esc_html( $justice_situation['tag'] ); ?></span>
					</div>
					<h3><?php echo esc_html( $justice_situation['title'] ); ?></h3>
					<p><?php echo esc_html( $justice_situation['desc'] ); ?></p>
					<div class="jt2-situation__links">
						<a href="<?php echo esc_url( $justice_situation['guide_url'] ); ?>"><?php esc_html_e( 'להבין את הנושא', 'justice-theme' ); ?></a>
						<a href="<?php echo esc_url( $justice_situation['lawyers_url'] ); ?>"><?php echo esc_html( $justice_situation['lawyer_label'] ); ?> ←</a>
					</div>
					<div class="jt2-situation__related">
						<span><?php esc_html_e( 'מדריכים קשורים', 'justice-theme' ); ?></span>
						<?php foreach ( $justice_situation['related'] as $justice_related ) : ?>
							<a href="<?php echo esc_url( $justice_related[1] ); ?>">→ <?php echo esc_html( $justice_related[0] ); ?></a>
						<?php endforeach; ?>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
