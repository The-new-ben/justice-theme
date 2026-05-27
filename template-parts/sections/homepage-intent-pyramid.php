<?php
/**
 * Homepage money-intent pyramid.
 *
 * Connects broad homepage searches to high-value practice hubs, lawyer filters,
 * lead intake, and CMS articles using crawlable links.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$home_intent_article_query = static function ( string $slug, int $limit = 2 ): array {
	$post_types = array_values( array_filter( array( 'articles', 'post' ), 'post_type_exists' ) );

	if ( empty( $post_types ) ) {
		return array();
	}

	$tax_query = array( 'relation' => 'OR' );

	if ( taxonomy_exists( 'practice-areas' ) ) {
		$tax_query[] = array(
			'taxonomy' => 'practice-areas',
			'field'    => 'slug',
			'terms'    => $slug,
		);
	}

	if ( taxonomy_exists( 'category' ) ) {
		$tax_query[] = array(
			'taxonomy' => 'category',
			'field'    => 'slug',
			'terms'    => $slug,
		);
	}

	if ( count( $tax_query ) < 2 ) {
		return array();
	}

	return get_posts(
		array(
			'post_type'           => $post_types,
			'post_status'         => 'publish',
			'posts_per_page'      => $limit,
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true,
			'tax_query'           => $tax_query, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
		)
	);
};

$home_intent_fallback_links = static function ( array $fallbacks, string $default_url ): array {
	$links = array();
	$seen  = array();

	foreach ( $fallbacks as $fallback ) {
		$label = isset( $fallback['label'] ) ? (string) $fallback['label'] : '';
		$path  = isset( $fallback['url'] ) ? (string) $fallback['url'] : '';

		if ( '' === $label || '' === $path || ! justice_theme_public_path_is_published( $path ) ) {
			continue;
		}

		$url = justice_theme_safe_public_link( $path, $default_url );

		if ( isset( $seen[ $url ] ) ) {
			continue;
		}

		$seen[ $url ] = true;
		$links[]      = array(
			'label' => $label,
			'url'   => $url,
		);
	}

	return $links;
};

$home_intent_schema_item = static function ( array $intent, int $position ): array {
	return array(
		'@type'    => 'ListItem',
		'position' => $position,
		'item'     => array(
			'@type'       => 'WebPage',
			'@id'         => esc_url_raw( $intent['guide_url'] ),
			'url'         => esc_url_raw( $intent['guide_url'] ),
			'name'        => wp_strip_all_tags( (string) $intent['title'] ),
			'description' => wp_strip_all_tags( (string) $intent['intent'] ),
		),
	);
};

$home_intent_links = array(
	array(
		'title'       => __( 'עורך דין פלילי', 'justice-theme' ),
		'intent'      => __( 'חקירה, מעצר, כתב אישום, מחיקת רישום פלילי או עבירות רכוש וסמים.', 'justice-theme' ),
		'slug'        => 'criminal-law',
		'priority'    => __( 'דחוף', 'justice-theme' ),
		'guide_url'   => justice_theme_safe_public_link( '/criminal-defense-attorney/', '/lawyers/?area=criminal-law' ),
		'lawyers_url' => home_url( '/lawyers/?area=criminal-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'מחיקת רישום פלילי', 'justice-theme' ), 'url' => '/criminal-record-deletion/' ),
			array( 'label' => __( 'עבירות סמים', 'justice-theme' ), 'url' => '/drug-crimes/' ),
			array( 'label' => __( 'גניבה מחנות', 'justice-theme' ), 'url' => '/shoplifting-defense/' ),
		),
	),
	array(
		'title'       => __( 'עורך דין משפחה וגירושין', 'justice-theme' ),
		'intent'      => __( 'גירושין, משמורת ילדים, מזונות, חלוקת רכוש, צוואות והסכמי ממון.', 'justice-theme' ),
		'slug'        => 'family-law',
		'priority'    => __( 'גבוה', 'justice-theme' ),
		'guide_url'   => justice_theme_safe_public_link( '/divorce-lawyer/', '/family-law/' ),
		'lawyers_url' => home_url( '/lawyers/?area=family-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'מחשבון מזונות ילדים', 'justice-theme' ), 'url' => '/child-support-calculator-2023/' ),
			array( 'label' => __( 'משמורת ילדים', 'justice-theme' ), 'url' => '/child-custody/' ),
			array( 'label' => __( 'גישור גירושין', 'justice-theme' ), 'url' => '/divorce-mediation/' ),
		),
	),
	array(
		'title'       => __( 'עורך דין מקרקעין', 'justice-theme' ),
		'intent'      => __( 'קניית דירה, מכירת נכס, חוזה מכר, טאבו, ליקויי בנייה ומיסוי מקרקעין.', 'justice-theme' ),
		'slug'        => 'real-estate-law',
		'priority'    => __( 'כסף גדול', 'justice-theme' ),
		'guide_url'   => home_url( '/practice-areas/real-estate-law/' ),
		'lawyers_url' => home_url( '/lawyers/?area=real-estate-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'חוזה מכר דירה', 'justice-theme' ), 'url' => '/real-estate-contract-review/' ),
			array( 'label' => __( 'ליקויי בנייה', 'justice-theme' ), 'url' => '/construction-defects/' ),
			array( 'label' => __( 'מס שבח ורכישה', 'justice-theme' ), 'url' => '/real-estate-tax/' ),
		),
	),
	array(
		'title'       => __( 'עורך דין רשלנות רפואית', 'justice-theme' ),
		'intent'      => __( 'אבחון שגוי, ניתוח, לידה, טיפול רפואי או נזק רפואי שמצריך בדיקה מקצועית.', 'justice-theme' ),
		'slug'        => 'medical-malpractice-law',
		'priority'    => __( 'תביעה מורכבת', 'justice-theme' ),
		'guide_url'   => home_url( '/medical-malpractice-lawyer/' ),
		'lawyers_url' => home_url( '/lawyers/?area=medical-malpractice-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'מהי רשלנות רפואית', 'justice-theme' ), 'url' => '/what-is-medical-malpractice-definition-examples/' ),
			array( 'label' => __( 'רשלנות בניתוח', 'justice-theme' ), 'url' => '/surgical-errors-medical-malpractice/' ),
			array( 'label' => __( 'פגיעות לידה', 'justice-theme' ), 'url' => '/birth-injury/' ),
		),
	),
	array(
		'title'       => __( 'עורך דין דיני עבודה', 'justice-theme' ),
		'intent'      => __( 'פיטורים, שימוע, זכויות עובדים, חוזה עבודה, שעות נוספות ופנסיה.', 'justice-theme' ),
		'slug'        => 'labor-law',
		'priority'    => __( 'מתמשך', 'justice-theme' ),
		'guide_url'   => home_url( '/practice-areas/labor-law/' ),
		'lawyers_url' => home_url( '/lawyers/?area=labor-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'זכויות עובדים', 'justice-theme' ), 'url' => '/employee-rights/' ),
			array( 'label' => __( 'פיטורים שלא כדין', 'justice-theme' ), 'url' => '/wrongful-termination/' ),
			array( 'label' => __( 'הסכם עבודה', 'justice-theme' ), 'url' => '/employment-agreement/' ),
		),
	),
	array(
		'title'       => __( 'עורך דין נזיקין ותאונות', 'justice-theme' ),
		'intent'      => __( 'תאונת דרכים, תאונת עבודה, פציעה, ביטוח לאומי או תביעת פיצויים.', 'justice-theme' ),
		'slug'        => 'personal-injury-law',
		'priority'    => __( 'פיצוי', 'justice-theme' ),
		'guide_url'   => home_url( '/tort-lawyer/' ),
		'lawyers_url' => home_url( '/lawyers/?area=personal-injury-law' ),
		'fallbacks'   => array(
			array( 'label' => __( 'תאונת דרכים', 'justice-theme' ), 'url' => '/car-accident-lawyer/' ),
			array( 'label' => __( 'תאונת עבודה', 'justice-theme' ), 'url' => '/work-accident/' ),
			array( 'label' => __( 'ביטוח לאומי', 'justice-theme' ), 'url' => '/national-insurance/' ),
		),
	),
);

$home_situation_routes = array(
	array(
		'title' => __( 'קיבלתם מכתב או דרישת תשלום', 'justice-theme' ),
		'text'  => __( 'התחילו מהתאריך האחרון לתגובה, מי שלח את המסמך ומה מבקשים מכם לעשות.', 'justice-theme' ),
		'url'   => home_url( '/lawyers/' ),
	),
	array(
		'title' => __( 'זומנתם לחקירה או להליך פלילי', 'justice-theme' ),
		'text'  => __( 'רשמו מי הזמין, מתי, באיזה נושא, והימנעו מניחושים לפני שמבינים את הזכויות.', 'justice-theme' ),
		'url'   => justice_theme_safe_public_link( '/criminal-defense-attorney/', '/lawyers/?area=criminal-law' ),
	),
	array(
		'title' => __( 'יש בעיה בעבודה', 'justice-theme' ),
		'text'  => __( 'אספו תלושי שכר, חוזה, זימון לשימוע, הודעות ומועדים לפני פנייה מסודרת.', 'justice-theme' ),
		'url'   => home_url( '/lawyers/?area=labor-law' ),
	),
	array(
		'title' => __( 'המשפחה או הזוגיות הסתבכו', 'justice-theme' ),
		'text'  => __( 'כתבו מה דחוף עכשיו: ילדים, מזונות, רכוש, צוואה, אלימות או הסכם שצריך לבדוק.', 'justice-theme' ),
		'url'   => justice_theme_safe_public_link( '/divorce-lawyer/', '/family-law/' ),
	),
	array(
		'title' => __( 'חוב, עיקול או הוצאה לפועל', 'justice-theme' ),
		'text'  => __( 'בדקו מספר תיק, סכום, מועד אחרון ומי פתח את ההליך לפני בחירת מסלול טיפול.', 'justice-theme' ),
		'url'   => home_url( '/lawyers/?area=debt-collection' ),
	),
	array(
		'title' => __( 'פציעה, ביטוח או ביטוח לאומי', 'justice-theme' ),
		'text'  => __( 'שמרו אישורים רפואיים, תאריכים, תלושי שכר והודעות מהמוסד או מחברת הביטוח.', 'justice-theme' ),
		'url'   => home_url( '/lawyers/?area=personal-injury-law' ),
	),
);

$home_intent_prepare_notes = array(
	'criminal-law'            => array(
		'prepare'      => __( 'לפני שיחה, רשמו מי פנה אליכם, באיזה נושא, האם נמסר זימון, והאם כבר נאמרו דברים לחוקר או לצד אחר.', 'justice-theme' ),
		'when_to_call' => __( 'אם יש חקירה, מעצר, צו, כתב אישום או חשש לפגיעה בזכויות, כדאי לפנות מהר ולא להסתפק בקריאה כללית.', 'justice-theme' ),
	),
	'family-law'              => array(
		'prepare'      => __( 'כדאי להכין תאריכים מרכזיים, פרטי ילדים, הסכמים קיימים, מסמכי רכוש והחלטות קודמות אם יש.', 'justice-theme' ),
		'when_to_call' => __( 'אם יש אלימות, חשש להברחת רכוש, שינוי חד במשמורת או הליך שכבר נפתח, רצוי לבדוק ייעוץ אישי בהקדם.', 'justice-theme' ),
	),
	'real-estate-law'         => array(
		'prepare'      => __( 'אספו טיוטת חוזה, נסח טאבו, פרטי נכס, לוחות זמנים, תשלומים שכבר נקבעו ושאלות על מס או רישום.', 'justice-theme' ),
		'when_to_call' => __( 'לפני חתימה, העברת כסף, התחייבות לקבלן או טיפול בליקוי משמעותי, עדיף לעצור ולבדוק את המסמכים.', 'justice-theme' ),
	),
	'medical-malpractice-law' => array(
		'prepare'      => __( 'שמרו סיכומי ביקור, תוצאות בדיקות, מכתבי שחרור, צילומים, תאריכים ושמות מוסדות טיפוליים.', 'justice-theme' ),
		'when_to_call' => __( 'אם נגרם נזק מתמשך או יש חשד לאבחון שגוי, איחור בטיפול או הסבר חסר, כדאי לבדוק מסלול מקצועי.', 'justice-theme' ),
	),
	'labor-law'               => array(
		'prepare'      => __( 'הכינו תלושי שכר, חוזה, הודעות מהמעסיק, זימון לשימוע, רישום שעות וכל מסמך על פיטורים או זכויות.', 'justice-theme' ),
		'when_to_call' => __( 'אם יש שימוע קרוב, פיטורים, אי תשלום, הרעה בתנאים או לחץ לחתום, אל תחכו לסוף התהליך.', 'justice-theme' ),
	),
	'personal-injury-law'     => array(
		'prepare'      => __( 'שמרו אישורים רפואיים, תמונות, פרטי עדים, דיווח למשטרה או למעסיק, ומכתבים מביטוח לאומי או חברת ביטוח.', 'justice-theme' ),
		'when_to_call' => __( 'אם יש נכות, אובדן הכנסה, סירוב ביטוח או מועד להגשת תביעה, כדאי לקבל הכוונה לפני מילוי טפסים.', 'justice-theme' ),
	),
);
?>

<section class="homepage-intent-pyramid section" id="homepage-intent-pyramid" aria-labelledby="homepage-intent-pyramid-title">
	<div class="container">
		<div class="section-header section-header--split">
			<div>
				<p class="section-header__eyebrow"><?php esc_html_e( 'חיפוש משפטי לפי כוונה', 'justice-theme' ); ?></p>
				<h2 id="homepage-intent-pyramid-title"><?php esc_html_e( 'התחילו מהבעיה המשפטית, ואז עברו למדריך או לעורך דין', 'justice-theme' ); ?></h2>
				<p class="section-header__desc"><?php esc_html_e( 'העמוד הראשי מחבר בין מצבים נפוצים לבין מסלולי פעולה ברורים: מדריך מקצועי, בדיקת מסמכים ראשונית, פרופילים בתחום ופנייה מסודרת. המטרה היא לעזור לכם להבין את האפשרויות לפני שמקבלים החלטה או מוסרים פרטים אישיים.', 'justice-theme' ); ?></p>
			</div>

			<a class="section-header__link button button--primary" href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>"><?php esc_html_e( 'חיפוש עורכי דין', 'justice-theme' ); ?></a>
		</div>

		<div class="homepage-situation-router" aria-label="<?php esc_attr_e( 'בחירה לפי מצב משפטי', 'justice-theme' ); ?>">
			<div class="homepage-situation-router__intro">
				<p class="section-header__eyebrow"><?php esc_html_e( 'לא חייבים לדעת את שם התחום', 'justice-theme' ); ?></p>
				<h3><?php esc_html_e( 'בחרו לפי מה שקרה לכם עכשיו', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'אנשים רבים מגיעים עם מכתב, זימון, חוב, פציעה או סכסוך ולא עם הגדרה משפטית. התחילו מהמצב, קראו מה להכין, ואז החליטו אם צריך מדריך או עורך דין.', 'justice-theme' ); ?></p>
			</div>
			<div class="homepage-situation-router__grid">
				<?php foreach ( $home_situation_routes as $route ) : ?>
					<a class="homepage-situation-card" href="<?php echo esc_url( $route['url'] ); ?>">
						<strong><?php echo esc_html( $route['title'] ); ?></strong>
						<span><?php echo esc_html( $route['text'] ); ?></span>
					</a>
				<?php endforeach; ?>
			</div>
		</div>

		<div class="homepage-intent-pyramid__grid">
			<?php foreach ( $home_intent_links as $intent ) : ?>
				<?php
				$related_posts  = $home_intent_article_query( $intent['slug'] );
				$related_count  = count( $related_posts );
				$directory_url  = $intent['lawyers_url'];
				$primary_url    = $intent['guide_url'];
				$fallback_links = $home_intent_fallback_links( $intent['fallbacks'], $primary_url );
				$prepare_note   = $home_intent_prepare_notes[ $intent['slug'] ] ?? null;
				?>
				<article class="homepage-intent-card">
					<div class="homepage-intent-card__top">
						<span class="homepage-intent-card__priority"><?php echo esc_html( $intent['priority'] ); ?></span>
						<h3><a href="<?php echo esc_url( $primary_url ); ?>"><?php echo esc_html( $intent['title'] ); ?></a></h3>
					</div>

					<p class="homepage-intent-card__intent"><?php echo esc_html( $intent['intent'] ); ?></p>

					<?php if ( ! empty( $prepare_note ) ) : ?>
						<div class="homepage-intent-card__prep">
							<p><strong><?php esc_html_e( 'מה להכין:', 'justice-theme' ); ?></strong> <?php echo esc_html( $prepare_note['prepare'] ); ?></p>
							<p><strong><?php esc_html_e( 'מתי לפנות מהר:', 'justice-theme' ); ?></strong> <?php echo esc_html( $prepare_note['when_to_call'] ); ?></p>
						</div>
					<?php endif; ?>

					<div class="homepage-intent-card__actions">
						<a class="button button--gold" href="<?php echo esc_url( $primary_url ); ?>"><?php esc_html_e( 'קריאת מדריך', 'justice-theme' ); ?></a>
						<a class="button button--ghost" href="<?php echo esc_url( $directory_url ); ?>"><?php esc_html_e( 'פרופילים בתחום', 'justice-theme' ); ?></a>
					</div>

					<div class="homepage-intent-card__links" aria-label="<?php esc_attr_e( 'מדריכים קשורים', 'justice-theme' ); ?>">
						<strong><?php esc_html_e( 'מדריכים קשורים', 'justice-theme' ); ?></strong>
						<ul>
							<?php if ( $related_count > 0 ) : ?>
								<?php foreach ( $related_posts as $related_post ) : ?>
									<li><a href="<?php echo esc_url( justice_theme_public_permalink( (int) $related_post->ID ) ); ?>"><?php echo esc_html( get_the_title( $related_post ) ); ?></a></li>
								<?php endforeach; ?>
							<?php elseif ( ! empty( $fallback_links ) ) : ?>
								<?php foreach ( $fallback_links as $fallback ) : ?>
									<li><a href="<?php echo esc_url( $fallback['url'] ); ?>"><?php echo esc_html( $fallback['label'] ); ?></a></li>
								<?php endforeach; ?>
							<?php else : ?>
								<li><a href="<?php echo esc_url( $directory_url ); ?>"><?php esc_html_e( 'חיפוש פרופילים בתחום זה', 'justice-theme' ); ?></a></li>
							<?php endif; ?>
						</ul>
					</div>
				</article>
			<?php endforeach; ?>
		</div>

		<div class="homepage-intent-pyramid__lawyer-path">
			<div>
				<p class="homepage-intent-pyramid__label"><?php esc_html_e( 'למשרדי עורכי דין', 'justice-theme' ); ?></p>
				<h3><?php esc_html_e( 'פרופיל, פניות ואזור אישי במקום אחד', 'justice-theme' ); ?></h3>
				<p><?php esc_html_e( 'עורך דין יכול להתחיל בהרשמה, לבחור מסלול חשיפה ולנהל פרטי פרופיל ופניות באזור האישי. הפעלה מלאה מתבצעת לאחר אישור הפרופיל והגדרת מסלול התשלום.', 'justice-theme' ); ?></p>
			</div>
			<div class="homepage-intent-pyramid__lawyer-actions">
				<a class="button button--primary" href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'מסלולי עורכי דין', 'justice-theme' ); ?></a>
				<a class="button button--ghost" href="<?php echo esc_url( home_url( '/lawyer-registration/' ) ); ?>"><?php esc_html_e( 'פתיחת פרופיל', 'justice-theme' ); ?></a>
				<a class="button button--ghost" href="<?php echo esc_url( home_url( '/lawyer-dashboard/' ) ); ?>"><?php esc_html_e( 'כניסה לאזור אישי', 'justice-theme' ); ?></a>
			</div>
		</div>

		<p class="homepage-intent-pyramid__trust-note">
			<?php esc_html_e( 'המידע באתר נועד לעזור להבין את הצעד הבא ולהגיע לשיחה מסודרת יותר. הוא כללי ואינו מחליף ייעוץ משפטי אישי מעורך דין שמכיר את פרטי המקרה.', 'justice-theme' ); ?>
		</p>
	</div>
</section>

<?php
if ( function_exists( 'justice_theme_print_schema' ) ) {
	$home_intent_schema_items = array();

	foreach ( array_values( $home_intent_links ) as $home_intent_position => $home_intent_item ) {
		$home_intent_schema_items[] = $home_intent_schema_item( $home_intent_item, $home_intent_position + 1 );
	}

	justice_theme_print_schema(
		array(
			'@context'        => 'https://schema.org',
			'@type'           => 'ItemList',
			'@id'             => esc_url_raw( home_url( '/#homepage-intent-pyramid' ) ),
			'name'            => wp_strip_all_tags( __( 'מסלולי חיפוש משפטיים מרכזיים', 'justice-theme' ) ),
			'description'     => wp_strip_all_tags( __( 'תחומי משפט מרכזיים שמחברים בין מדריכים, פרופילים ופנייה משפטית מסודרת.', 'justice-theme' ) ),
			'numberOfItems'   => count( $home_intent_schema_items ),
			'itemListElement' => $home_intent_schema_items,
		)
	);
}
?>
