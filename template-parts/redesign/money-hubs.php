<?php
/**
 * Money hubs band: the most competitive keyword families, linked from the
 * homepage with exact-match anchors so the strongest page on the site
 * passes its signal to every money hub. Every target is a live URL; dead
 * slugs are skipped at render (never ship a homepage 404).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$justice_money_hubs = array(
	array( 'anchor' => 'עורך דין גירושין', 'desc' => 'הסכמה, סכסוך, משמורת ורכוש', 'slug' => 'divorce-lawyer' ),
	array( 'anchor' => 'עורך דין פלילי', 'desc' => 'חקירה, מעצר וכתב אישום', 'slug' => 'criminal-defense-attorney' ),
	array( 'anchor' => 'דירוג עורכי דין פליליים', 'desc' => 'קריטריונים שקופים והשוואה', 'slug' => 'criminal-lawyers-rating' ),
	array( 'anchor' => 'עורך דין מקרקעין', 'desc' => 'קנייה, מכירה ומיסוי דירה', 'slug' => 'real-estate-attorney' ),
	array( 'anchor' => 'עורך דין רשלנות רפואית', 'desc' => 'בדיקת תיק והוכחת התרשלות', 'slug' => 'medical-malpractice-lawyer' ),
	array( 'anchor' => 'עורך דין תעבורה', 'desc' => 'שלילה, נקודות ושכרות', 'slug' => 'traffic-lawyer' ),
	array( 'anchor' => 'עורך דין דיני עבודה', 'desc' => 'פיטורים, שימוע וזכויות', 'slug' => 'labor-lawyer' ),
	array( 'anchor' => 'עורך דין ירושה וצוואות', 'desc' => 'צו ירושה והתנגדויות', 'slug' => 'inheritance-lawyer' ),
	array( 'anchor' => 'עורך דין עסקי לעסקים קטנים', 'desc' => 'הקמה, חוזים ושותפויות', 'slug' => 'types-of-lawyers-small-business' ),
	array( 'anchor' => 'עורך דין עבירות סמים', 'desc' => 'החזקה, שימוש וסחר', 'slug' => 'drug-related-crime' ),
	array( 'anchor' => 'עורך דין בארצות הברית', 'desc' => 'ייצוג ישראלים בארה"ב', 'slug' => 'usa-lawyers' ),
	array( 'anchor' => 'קניית דירה בקפריסין', 'desc' => 'מחירים, מיסים וליווי משפטי', 'slug' => 'buy-real-estate-cyprus' ),
	array( 'anchor' => 'השקעות נדל"ן ביוון', 'desc' => 'תשואות, אזורים וסיכונים', 'slug' => 'investing-in-greece-real-estate' ),
);

$justice_money_links = array();

foreach ( $justice_money_hubs as $justice_hub ) {
	$justice_hub_post = get_page_by_path( $justice_hub['slug'], OBJECT, array( 'page', 'post', 'articles' ) );

	if ( ! $justice_hub_post || 'publish' !== $justice_hub_post->post_status ) {
		continue;
	}

	$justice_hub['url'] = function_exists( 'justice_theme_public_permalink' )
		? justice_theme_public_permalink( $justice_hub_post->ID )
		: get_permalink( $justice_hub_post );

	$justice_money_links[] = $justice_hub;
}

if ( count( $justice_money_links ) < 4 ) {
	return;
}
?>

<section class="jt2-section money-hubs" aria-label="<?php esc_attr_e( 'תחומי המשפט המבוקשים ביותר', 'justice-theme' ); ?>">
	<div class="container">
		<div class="section-header">
			<p class="section-header__eyebrow"><?php esc_html_e( 'המדריכים המבוקשים עכשיו', 'justice-theme' ); ?></p>
			<h2><?php esc_html_e( 'תחומי המשפט שהכי מחפשים בישראל', 'justice-theme' ); ?></h2>
		</div>
		<div class="money-hubs__grid">
			<?php foreach ( $justice_money_links as $justice_hub ) : ?>
				<a class="money-hubs__card" href="<?php echo esc_url( $justice_hub['url'] ); ?>">
					<strong><?php echo esc_html( $justice_hub['anchor'] ); ?></strong>
					<span><?php echo esc_html( $justice_hub['desc'] ); ?></span>
				</a>
			<?php endforeach; ?>
		</div>
	</div>
</section>
