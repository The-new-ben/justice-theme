<?php
/**
 * AI tools strip (navy band) per Homepage.dc.html.
 *
 * Six real tools deep-linking into the gated generator at /legal-tools/
 * (the app supports ?tool= deep links), each with a lawyer cross-link:
 * the content ↔ tool ↔ lawyer mesh from the strategy doc.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_tools_hub = justice_theme_safe_public_link( '/legal-tools/', '/#ask-lawyer' );

$justice_ai_tools = array(
	array(
		'type'        => __( 'חדש · AI', 'justice-theme' ),
		'badge'       => 'ai',
		'title'       => __( 'סימולציית בית משפט: CourtAI Arena', 'justice-theme' ),
		'desc'        => __( 'דיון מדומה מלא על המקרה שלכם: פתיחות, חקירות, מוצגים והכרעה מנומקת לפי הראיות.', 'justice-theme' ),
		'url'         => add_query_arg( 'tool', 'court-arena', $justice_tools_hub ),
		'cross_url'   => home_url( '/lawyers/' ),
		'cross_label' => __( 'עורכי דין לפי תחום ועיר', 'justice-theme' ),
	),
	array(
		'type'        => __( 'חדש · AI', 'justice-theme' ),
		'badge'       => 'ai',
		'title'       => __( 'סימולציית הכנה לדיון', 'justice-theme' ),
		'desc'        => __( 'שאלות צפויות מהשופט, טיעוני הצד השני ורשימת הכנה, לפי המקרה שלכם.', 'justice-theme' ),
		'url'         => add_query_arg( 'tool', 'hearing-simulation', $justice_tools_hub ),
		'cross_url'   => home_url( '/lawyers/' ),
		'cross_label' => __( 'עורכי דין לפי תחום ועיר', 'justice-theme' ),
	),
	array(
		'type'        => __( 'חדש · AI', 'justice-theme' ),
		'badge'       => 'ai',
		'title'       => __( 'הערכת עלות עורך דין', 'justice-theme' ),
		'desc'        => __( 'טווחי שכר טרחה צפויים לפי תחום ומורכבות, לפי הנתונים שמפורסמים באתר.', 'justice-theme' ),
		'url'         => add_query_arg( 'tool', 'cost-estimator', $justice_tools_hub ),
		'cross_url'   => home_url( '/lawyers/' ),
		'cross_label' => __( 'להשוואת הצעות בתחום', 'justice-theme' ),
	),
	array(
		'type'        => __( 'טיוטה חינם', 'justice-theme' ),
		'badge'       => 'free',
		'title'       => __( 'הסכם גירושין', 'justice-theme' ),
		'desc'        => __( 'רכוש, מזונות והוצאות לפני בדיקה משפטית.', 'justice-theme' ),
		'url'         => add_query_arg( 'tool', 'divorce-settlement', $justice_tools_hub ),
		'cross_url'   => home_url( '/lawyers/?area=family-law' ),
		'cross_label' => __( 'עורכי דין גירושין', 'justice-theme' ),
	),
	array(
		'type'        => __( 'טיוטה חינם', 'justice-theme' ),
		'badge'       => 'free',
		'title'       => __( 'בדיקת חוזה נדל"ן', 'justice-theme' ),
		'desc'        => __( 'ריכוז סעיפים ונקודות סיכון לפני חתימה.', 'justice-theme' ),
		'url'         => add_query_arg( 'tool', 'residential-lease', $justice_tools_hub ),
		'cross_url'   => home_url( '/lawyers/?area=real-estate-law' ),
		'cross_label' => __( 'עורכי דין מקרקעין', 'justice-theme' ),
	),
	array(
		'type'        => __( 'שאלון חכם', 'justice-theme' ),
		'badge'       => 'ai',
		'title'       => __( 'אבחון משפטי ראשוני', 'justice-theme' ),
		'desc'        => __( 'שאלון קצר שמסדר עובדות, מסמכים חסרים והצעד הבא.', 'justice-theme' ),
		'url'         => justice_theme_safe_public_link( '/legal-tools/ai-intake/', '/legal-tools/' ),
		'cross_url'   => home_url( '/lawyers/' ),
		'cross_label' => __( 'איך ההתאמה עובדת', 'justice-theme' ),
	),
);
?>

<section class="jt2-section jt2-section--navy jt2-ai" id="ai-tools">
	<div class="jt2-section__inner">
		<span class="jt2-eyebrow"><?php esc_html_e( 'כלי AI משפטיים', 'justice-theme' ); ?></span>
		<h2 class="jt2-h2"><?php esc_html_e( 'מתחילים מהעובדות, מקבלים טיוטה תוך דקות', 'justice-theme' ); ?></h2>
		<p class="jt2-sub"><?php esc_html_e( 'הטיוטה הבסיסית נוצרת מיד, ללא תשלום וללא הרשמה. שדרוג עם AI, הדפסה והורדה נפתחים אחרי פרטי קשר קצרים. כל כלי מציע גם קישור ישיר לעורכי דין בתחום הרלוונטי.', 'justice-theme' ); ?></p>

		<div class="jt2-ai__grid">
			<?php foreach ( $justice_ai_tools as $justice_ai_tool ) : ?>
				<div class="jt2-ai__card">
					<span class="jt2-badge jt2-badge--<?php echo esc_attr( $justice_ai_tool['badge'] ); ?>"><?php echo esc_html( $justice_ai_tool['type'] ); ?></span>
					<h4><a href="<?php echo esc_url( $justice_ai_tool['url'] ); ?>" style="color:inherit;text-decoration:none" data-lead-source-keyword="<?php echo esc_attr( $justice_ai_tool['title'] ); ?>" data-lead-utm-source="homepage" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="legaltech_tools"><?php echo esc_html( $justice_ai_tool['title'] ); ?></a></h4>
					<p><?php echo esc_html( $justice_ai_tool['desc'] ); ?></p>
					<a class="jt2-ai__cross" href="<?php echo esc_url( $justice_ai_tool['cross_url'] ); ?>">↗ <?php echo esc_html( $justice_ai_tool['cross_label'] ); ?></a>
				</div>
			<?php endforeach; ?>
		</div>

		<a class="jt2-ai__all" href="<?php echo esc_url( $justice_tools_hub ); ?>" data-lead-source-keyword="כלים משפטיים" data-lead-utm-source="homepage" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="legaltech_tools"><?php esc_html_e( 'לכל 50 הכלים ←', 'justice-theme' ); ?></a>
	</div>
</section>
