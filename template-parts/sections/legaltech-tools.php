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
	return justice_theme_safe_public_link( '/legal-tools/' . $tool_slug . '/', '/#ask-lawyer' );
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
			'title' => 'צ׳אט אבחון משפטי',
			'text'  => 'שיחה מונחית שמזהה תחום, דחיפות, עיר, מסמכים חסרים והתאמה לעורך דין.',
			'url'   => $legaltech_fallback_url( 'ai-intake' ),
			'type'  => 'AI intake',
			'price' => 'חינם / ליד',
			'area'  => 'general',
			'message' => 'אני רוצה אבחון משפטי ראשוני. הנושא הוא: ',
			'keyword' => 'אבחון משפטי חכם',
		),
		array(
			'title' => 'מכתב התראה',
			'text'  => 'איסוף פרטים, יצירת טיוטה, בדיקת עורך דין ושליחה מסודרת ללקוח.',
			'url'   => $legaltech_fallback_url( 'demand-letter' ),
			'type'  => 'Document',
			'price' => 'בתשלום',
			'area'  => 'general',
			'message' => 'אני רוצה להכין או לבדוק מכתב התראה. הרקע בקצרה: ',
			'keyword' => 'מכתב התראה',
		),
		array(
			'title' => 'הסכם משפחתי',
			'text'  => 'טיוטות להסכמים בסיסיים עם שאלון מובנה, אזהרות וסבב אישור משפטי.',
			'url'   => $legaltech_fallback_url( 'family-agreement' ),
			'type'  => 'Lawyer review',
			'price' => 'בתשלום',
			'area'  => 'family-law',
			'message' => 'אני רוצה להכין או לבדוק הסכם משפחתי. הרקע בקצרה: ',
			'keyword' => 'הסכם משפחתי',
		),
		array(
			'title' => 'בדיקת חוזה נדל״ן',
			'text'  => 'העלאת מסמך, חילוץ סיכונים, שאלות המשך והעברה לעורך דין מקרקעין.',
			'url'   => $legaltech_fallback_url( 'real-estate-contract-review' ),
			'type'  => 'Real estate',
			'price' => 'פרימיום',
			'area'  => 'real-estate-law',
			'message' => 'אני רוצה לבדוק חוזה נדל״ן או מסמך עסקה. הרקע בקצרה: ',
			'keyword' => 'בדיקת חוזה נדלן',
		),
	);
}
?>

<section class="legaltech-tools section" id="legaltech-tools">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow">LegalTech</p>
				<h2>מסמכים, סימולציות וצ׳אט משפטי עם עורך דין בלופ</h2>
				<p>המשתמש מתחיל בשיחה או כלי, המערכת בונה טיוטה ופרופיל מקרה, ועורך דין יכול לתת את הטאץ׳ הסופי.</p>
			</div>
			<a class="button button--primary" href="<?php echo esc_url( $legaltech_all_tools_url ); ?>" data-lead-source-keyword="כלים משפטיים" data-lead-utm-source="homepage" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="legaltech_tools">כל הכלים</a>
		</div>

		<div class="legaltech-tools__grid">
			<div class="legaltech-tools__console">
				<span class="legaltech-tools__label">AI Console</span>
				<h3>ספרו מה קרה. המערכת תבנה מסלול.</h3>
				<div class="legaltech-chat">
					<p><strong>המערכת:</strong> באיזה תחום מדובר?</p>
					<p><strong>משתמש:</strong> הסכם גירושין / חוזה דירה / מכתב התראה</p>
					<p><strong>המערכת:</strong> ניצור שאלון, טיוטה, סיכום לעורך דין והצעת מחיר.</p>
				</div>
				<a class="button button--gold" href="<?php echo esc_url( $legaltech_fallback_url( 'ai-intake' ) ); ?>" data-lead-area="general" data-lead-message="אני רוצה אבחון משפטי ראשוני. הנושא הוא: " data-lead-source-keyword="אבחון משפטי חכם" data-lead-utm-source="homepage" data-lead-utm-medium="legaltech_gateway" data-lead-utm-campaign="legaltech_tools">התחלת אבחון</a>
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
