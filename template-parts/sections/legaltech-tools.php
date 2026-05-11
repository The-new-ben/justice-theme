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
			'url'   => justice_theme_safe_public_link( '/legal-tools/ai-intake/', '/#ask-lawyer' ),
			'type'  => 'AI intake',
			'price' => 'חינם / ליד',
		),
		array(
			'title' => 'מכתב התראה',
			'text'  => 'איסוף פרטים, יצירת טיוטה, בדיקת עורך דין ושליחה מסודרת ללקוח.',
			'url'   => justice_theme_safe_public_link( '/legal-tools/demand-letter/', '/#ask-lawyer' ),
			'type'  => 'Document',
			'price' => 'בתשלום',
		),
		array(
			'title' => 'הסכם משפחתי',
			'text'  => 'טיוטות להסכמים בסיסיים עם שאלון מובנה, אזהרות וסבב אישור משפטי.',
			'url'   => justice_theme_safe_public_link( '/legal-tools/family-agreement/', '/#ask-lawyer' ),
			'type'  => 'Lawyer review',
			'price' => 'בתשלום',
		),
		array(
			'title' => 'בדיקת חוזה נדל״ן',
			'text'  => 'העלאת מסמך, חילוץ סיכונים, שאלות המשך והעברה לעורך דין מקרקעין.',
			'url'   => justice_theme_safe_public_link( '/legal-tools/real-estate-contract-review/', '/#ask-lawyer' ),
			'type'  => 'Real estate',
			'price' => 'פרימיום',
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
			<a class="button button--primary" href="<?php echo esc_url( justice_theme_safe_public_link( '/legal-tools/', '/#ask-lawyer' ) ); ?>">כל הכלים</a>
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
				<a class="button button--gold" href="<?php echo esc_url( justice_theme_safe_public_link( '/legal-tools/ai-intake/', '/#ask-lawyer' ) ); ?>">התחלת אבחון</a>
			</div>

			<div class="legaltech-tools__cards">
				<?php foreach ( $tools as $tool ) : ?>
					<a class="legaltech-tool-card" href="<?php echo esc_url( $tool['url'] ); ?>">
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
