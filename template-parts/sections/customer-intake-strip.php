<?php
/**
 * Homepage customer intake strip.
 *
 * A practical bridge between search intent and lead capture for visitors who
 * arrive stressed, unsure which practice area fits, or ready to compare lawyers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$intake_cards = array(
	array(
		'label'       => __( 'יש לי בעיה דחופה ואני לא יודע מאיפה להתחיל', 'justice-theme' ),
		'description' => __( 'כתבו בקצרה מה קרה, באיזו עיר מדובר והאם יש מועד קרוב כמו דיון, שימוע, חקירה, תשלום או מכתב אזהרה. כך קל יותר להבין אם צריך מדריך, עורך דין או בדיקה נוספת לפני פעולה.', 'justice-theme' ),
		'url'         => '#ask-lawyer',
		'action'      => __( 'שליחת פנייה', 'justice-theme' ),
	),
	array(
		'label'       => __( 'אני רוצה להבין את הזכויות והאפשרויות שלי', 'justice-theme' ),
		'description' => __( 'עברו למדריכים לפי נושא משפטי וקראו מה בדרך כלל בודקים, אילו מסמכים מכינים, מה עלול להיות דחוף ואילו שאלות כדאי לשאול לפני שמשלמים על ייעוץ או ייצוג.', 'justice-theme' ),
		'url'         => home_url( '/articles/' ),
		'action'      => __( 'קריאת מדריכים', 'justice-theme' ),
	),
	array(
		'label'       => __( 'אני מוכן להשוות עורכי דין בצורה מסודרת', 'justice-theme' ),
		'description' => __( 'חפשו לפי תחום ועיר, קראו פרופילים ותוכן מקצועי, בדקו התאמה לשאלה שלכם, ואז פנו רק למי שנראה רלוונטי. אין צורך להתחייב לפני שמבינים את המסלול והעלות.', 'justice-theme' ),
		'url'         => home_url( '/lawyers/' ),
		'action'      => __( 'חיפוש עורכי דין', 'justice-theme' ),
	),
);

$customer_handoff_whatsapp_url = function_exists( 'justice_theme_public_whatsapp_url' )
	? justice_theme_public_whatsapp_url( __( 'שלום, אני צריך/ה עזרה משפטית. הגעתי ממסלול הלקוח בדף הבית של Jus-Tice. הנושא בקצרה: ', 'justice-theme' ) )
	: '';

$customer_handoff_steps = array(
	__( 'מזהים תחום, עיר ודחיפות לפי מה שכתבתם.', 'justice-theme' ),
	__( 'בודקים אם נכון להתחיל ממדריך, מחיפוש עורך דין או משיחה קצרה.', 'justice-theme' ),
	__( 'אם צריך עורך דין, מכינים פנייה מסודרת כדי שהשיחה הראשונה תהיה ממוקדת יותר.', 'justice-theme' ),
);

$customer_status_path = array(
	array(
		'label' => __( 'מקור', 'justice-theme' ),
		'text'  => __( 'הפנייה נשמרת עם העמוד או הכפתור שממנו התחלתם.', 'justice-theme' ),
	),
	array(
		'label' => __( 'הסכמה', 'justice-theme' ),
		'text'  => __( 'פרטים מועברים הלאה רק אחרי שיש אישור מתאים להמשך טיפול.', 'justice-theme' ),
	),
	array(
		'label' => __( 'ניסיון ראשון', 'justice-theme' ),
		'text'  => __( 'המטרה היא לחזור מהר, להבין תחום, עיר ודחיפות, ואז להחליט אם נדרש חיבור מקצועי.', 'justice-theme' ),
	),
	array(
		'label' => __( 'התאמה', 'justice-theme' ),
		'text'  => __( 'חיבור לעורך דין או ספק נעשה לפי התאמה ויכולת טיפול, לא רק לפי שם ברשימה.', 'justice-theme' ),
	),
);
?>

<section class="customer-intake-strip" aria-labelledby="customer-intake-title">
	<div class="container">
		<div class="customer-intake-strip__header">
			<p class="section-header__eyebrow"><?php esc_html_e( 'מסלול מהיר ללקוח', 'justice-theme' ); ?></p>
			<h2 id="customer-intake-title"><?php esc_html_e( 'שלושה מסלולים ברורים לפי רמת הדחיפות שלכם', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'לא כל שאלה משפטית מתחילה באותו מקום. לפעמים צריך לקרוא ולהבין, לפעמים להשוות עורכי דין, ולפעמים להשאיר פנייה קצרה כדי שמישהו יבחן לאיזה תחום הבעיה שייכת.', 'justice-theme' ); ?></p>
		</div>

		<div class="customer-intake-strip__grid">
			<?php foreach ( $intake_cards as $index => $card ) : ?>
				<article class="customer-intake-card">
					<span class="customer-intake-card__number"><?php echo esc_html( (string) ( $index + 1 ) ); ?></span>
					<h3><?php echo esc_html( $card['label'] ); ?></h3>
					<p><?php echo esc_html( $card['description'] ); ?></p>
					<a href="<?php echo esc_url( $card['url'] ); ?>"><?php echo esc_html( $card['action'] ); ?></a>
				</article>
			<?php endforeach; ?>
		</div>

		<div class="customer-intake-strip__handoff" aria-label="<?php esc_attr_e( 'מה קורה אחרי השארת פנייה', 'justice-theme' ); ?>">
			<div>
				<p class="customer-intake-strip__handoff-label"><?php esc_html_e( 'מה קורה אחרי הפנייה?', 'justice-theme' ); ?></p>
				<ol>
					<?php foreach ( $customer_handoff_steps as $handoff_step ) : ?>
						<li><?php echo esc_html( $handoff_step ); ?></li>
					<?php endforeach; ?>
				</ol>

				<div class="customer-intake-strip__status-path" data-revenue-surface="homepage_customer_status_path">
					<?php foreach ( $customer_status_path as $status_item ) : ?>
						<div>
							<strong><?php echo esc_html( $status_item['label'] ); ?></strong>
							<span><?php echo esc_html( $status_item['text'] ); ?></span>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
			<div class="customer-intake-strip__handoff-actions">
				<a class="button button--primary" href="<?php echo esc_url( home_url( '/#ask-lawyer' ) ); ?>" data-lead-source-surface="homepage_customer_handoff" data-lead-utm-source="homepage_customer_handoff" data-lead-utm-medium="handoff_cta" data-lead-utm-campaign="public_legal_help">
					<?php esc_html_e( 'להשאיר פנייה מסודרת', 'justice-theme' ); ?>
				</a>
				<?php if ( $customer_handoff_whatsapp_url ) : ?>
					<a class="button button--outline customer-intake-strip__whatsapp" href="<?php echo esc_url( $customer_handoff_whatsapp_url ); ?>" target="_blank" rel="noopener" data-whatsapp-surface="homepage_customer_handoff" data-lead-utm-source="homepage_customer_handoff" data-lead-utm-medium="whatsapp" data-lead-utm-campaign="public_legal_help">
						<?php esc_html_e( 'וואטסאפ מהיר', 'justice-theme' ); ?>
					</a>
				<?php endif; ?>
			</div>
		</div>
	</div>
</section>
