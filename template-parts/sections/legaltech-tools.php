<?php
/**
 * LegalTech tools and document automation gateway.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$tools = array();

$legaltech_fallback_url = static function ( string $tool_slug ): string {
	return home_url( '/legal-tools/?tool=' . rawurlencode( $tool_slug ) );
};

$legaltech_all_tools_url = justice_theme_safe_public_link( '/legal-tools/', '/#ask-lawyer' );

if ( post_type_exists( 'justice_legal_tool' ) ) {
	$tool_query = new WP_Query(
		array(
			'post_type'      => 'justice_legal_tool',
			'post_status'    => 'publish',
			'posts_per_page' => 6,
			'orderby'        => 'menu_order',
			'order'          => 'ASC',
		)
	);

	if ( $tool_query->have_posts() ) {
		while ( $tool_query->have_posts() ) {
			$tool_query->the_post();
			$tools[] = array(
				'title' => get_the_title(),
				'text'  => get_the_excerpt() ?: wp_trim_words( wp_strip_all_tags( get_the_content() ), 24 ),
				'url'   => justice_theme_public_permalink( get_the_ID() ),
				'type'  => get_post_meta( get_the_ID(), 'tool_type', true ),
				'price' => get_post_meta( get_the_ID(), 'starting_price', true ),
				'area'  => get_post_meta( get_the_ID(), 'target_practice_area', true ) ?: 'general',
				'message' => sprintf( 'אני רוצה להתחיל תהליך עבור %s. הרקע בקצרה: ', get_the_title() ),
				'keyword' => get_the_title(),
			);
		}
		wp_reset_postdata();
	}
}

if ( empty( $tools ) ) {
	$tools = array(
		array(
			'title' => 'אבחון משפטי ראשוני',
			'text'  => 'שאלון קצר שמסדר את העובדות, המסמכים החסרים והשלב הבא לפני פנייה לעורך דין.',
			'url'   => $legaltech_all_tools_url,
			'type'  => 'שאלון',
			'price' => 'ללא תשלום בתקופת ההרצה',
			'area'  => 'general',
			'message' => 'אני רוצה אבחון משפטי ראשוני. הנושא הוא: ',
			'keyword' => 'אבחון משפטי ראשוני',
		),
		array(
			'title' => 'מכתב התראה',
			'text'  => 'הכנת טיוטת מכתב דרישה עם פרטי הצדדים, עובדות, דרישה כספית ומועד לתגובה.',
			'url'   => $legaltech_fallback_url( 'demand-letter' ),
			'type'  => 'מסמך',
			'price' => 'טיוטה חינם',
			'area'  => 'general',
			'message' => 'אני רוצה להכין או לבדוק מכתב התראה. הרקע בקצרה: ',
			'keyword' => 'מכתב התראה',
		),
		array(
			'title' => 'הסכם גירושין',
			'text'  => 'טיוטה להסדרת רכוש, חובות, מזונות, הוצאות וזמני שהות, לפני בדיקה ואישור משפטי.',
			'url'   => $legaltech_fallback_url( 'divorce-settlement' ),
			'type'  => 'משפחה',
			'price' => 'טיוטה חינם',
			'area'  => 'family-law',
			'message' => 'אני רוצה להכין או לבדוק הסכם גירושין. הרקע בקצרה: ',
			'keyword' => 'הסכם גירושין',
		),
		array(
			'title' => 'בדיקת חוזה נדל״ן',
			'text'  => 'ריכוז סעיפים לבדיקה, שאלות לעורך הדין ונקודות סיכון לפני חתימה.',
			'url'   => $legaltech_fallback_url( 'residential-lease' ),
			'type'  => 'מקרקעין',
			'price' => 'טיוטה חינם',
			'area'  => 'real-estate-law',
			'message' => 'אני רוצה לבדוק חוזה נדל״ן או מסמך עסקה. הרקע בקצרה: ',
			'keyword' => 'בדיקת חוזה נדלן',
		),
	);
}

$has_btl_appeal_tool = false;
foreach ( $tools as $tool ) {
	if ( ! empty( $tool['area'] ) && 'national-insurance' === $tool['area'] ) {
		$has_btl_appeal_tool = true;
		break;
	}
}

if ( ! $has_btl_appeal_tool ) {
	array_unshift(
		$tools,
		array(
			'title'   => 'מחשבון ערעור ביטוח לאומי',
			'text'    => 'בדיקת פער כספי, דחיפות ומסמכים לפני פנייה לעורך דין בתחום ביטוח לאומי.',
			'url'     => home_url( '/bituach-leumi-appeal-guide/' ),
			'type'    => 'Appeal calculator',
			'price'   => 'בדיקה ראשונית',
			'area'    => 'national-insurance',
			'message' => 'אני רוצה לבדוק ערעור על החלטת ביטוח לאומי. הרקע בקצרה: ',
			'keyword' => 'ערעור ביטוח לאומי',
		)
	);

	$tools = array_slice( $tools, 0, 6 );
}
?>

<section class="legaltech-tools section" id="legaltech-tools">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow">כלי AI משפטיים, בינה מלאכותית שעובדת בשבילכם</p>
				<h2>מנסים בחינם, בלי הרשמה. ממשיכים לטיוטה מלאה כשרוצים.</h2>
				<p>בוחרים נושא, ממלאים שאלון קצר ומקבלים טיוטה ראשונית מיד, בעברית או באנגלית, ללא תשלום וללא הרשמה. שדרוג עם AI, הדפסה והורדה פתוחים אחרי פרטי קשר קצרים.</p>
			</div>
			<a class="button button--primary" href="<?php echo esc_url( $legaltech_all_tools_url ); ?>" data-lead-source-keyword="כלים משפטיים" data-lead-utm-source="homepage" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="legaltech_tools">לכל 50 הכלים</a>
		</div>

		<div class="legaltech-tools__grid">
			<div class="legaltech-tools__console">
				<span class="legaltech-tools__label">50 כלים מוכנים, ללא תשלום לניסיון</span>
				<h3>מתחילים מהעובדות, מקבלים מסמך שאפשר לבדוק.</h3>
				<div class="legaltech-chat">
					<p><strong>בחירה:</strong> הסכם גירושין, חוזה דירה, מכתב התראה או תביעה קטנה.</p>
					<p><strong>שאלון:</strong> הצדדים, העובדות, הסכומים, מועדים ומסמכים חסרים.</p>
					<p><strong>תוצאה:</strong> טיוטה מסודרת, ואפשר גם לצרף מסמך קיים לבדיקת עורך דין.</p>
				</div>
				<a class="button button--gold" href="<?php echo esc_url( $legaltech_all_tools_url ); ?>" data-lead-area="general" data-lead-message="אני רוצה להכין טיוטה משפטית. הנושא הוא: " data-lead-source-keyword="כלים להכנת מסמכים משפטיים" data-lead-utm-source="homepage" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="legaltech_tools">פתיחת הכלים בחינם</a>
			</div>

			<div class="legaltech-tools__cards">
				<?php foreach ( $tools as $tool ) : ?>
					<a class="legaltech-tool-card" href="<?php echo esc_url( $tool['url'] ); ?>" data-lead-area="<?php echo esc_attr( $tool['area'] ?? '' ); ?>" data-lead-message="<?php echo esc_attr( $tool['message'] ?? '' ); ?>" data-lead-source-keyword="<?php echo esc_attr( $tool['keyword'] ?? $tool['title'] ); ?>" data-lead-utm-source="homepage" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="legaltech_tools">
						<span><?php echo esc_html( $tool['type'] ?: 'Tool' ); ?></span>
						<strong><?php echo esc_html( $tool['title'] ); ?></strong>
						<p><?php echo esc_html( $tool['text'] ); ?></p>
						<em><?php echo esc_html( $tool['price'] ?: 'בהכנה' ); ?></em>
					</a>
				<?php endforeach; ?>
			</div>
		</div>
	</div>
</section>
