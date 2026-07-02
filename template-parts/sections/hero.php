<?php
/**
 * Homepage hero section — search-first centered design.
 *
 * Redesigned based on competitive analysis:
 * - Centered layout with real background image
 * - Search form is the dominant element above the fold
 * - Practice area chips integrated as quick-links below search
 * - Stats bar at the bottom for social proof
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$hero_core_practices = array(
	'family-law'          => __( 'דיני משפחה וגירושין', 'justice-theme' ),
	'criminal-law'        => __( 'משפט פלילי', 'justice-theme' ),
	'traffic-law'         => __( 'דיני תעבורה', 'justice-theme' ),
	'real-estate-law'     => __( 'מקרקעין ונדל"ן', 'justice-theme' ),
	'labor-law'           => __( 'דיני עבודה', 'justice-theme' ),
	'inheritance-law'     => __( 'ירושה וצוואות', 'justice-theme' ),
	'torts'               => __( 'נזיקין ותאונות', 'justice-theme' ),
	'medical-malpractice' => __( 'רשלנות רפואית', 'justice-theme' ),
	'tax-law'             => __( 'דיני מיסים', 'justice-theme' ),
	'debt-collection'     => __( 'חובות והוצאה לפועל', 'justice-theme' ),
);

// Major Israeli cities for dropdown
$israel_cities = array(
	'תל אביב',
	'ירושלים',
	'חיפה',
	'ראשון לציון',
	'פתח תקווה',
	'אשדוד',
	'נתניה',
	'באר שבע',
	'חולון',
	'בני ברק',
	'רמת גן',
	'אשקלון',
	'רחובות',
	'בת ים',
	'הרצליה',
	'כפר סבא',
	'מודיעין',
	'נצרת',
	'לוד',
	'רמלה',
);

$hero_whatsapp_url = function_exists( 'justice_theme_public_whatsapp_url' )
	? justice_theme_public_whatsapp_url( __( 'שלום, אני צריך/ה עזרה משפטית דרך Jus-Tice. הגעתי מדף הבית ואשמח לחזרה קצרה.', 'justice-theme' ) )
	: '';

$hero_market_signals = array(
	array(
		'label' => __( 'מסבירים את המצב במילים פשוטות', 'justice-theme' ),
		'text'  => __( 'גם אם אינכם יודעים איך קוראים לתחום המשפטי, אפשר להתחיל מתיאור קצר של הבעיה, העיר והדחיפות.', 'justice-theme' ),
	),
	array(
		'label' => __( 'מבינים מה לבדוק לפני פנייה', 'justice-theme' ),
		'text'  => __( 'המדריכים עוזרים להכין מסמכים, להבין מועדים ולנסח שאלות חשובות לפני שיחה עם עורך דין.', 'justice-theme' ),
	),
	array(
		'label' => __( 'עוברים לעורך דין רק כשזה מתאים', 'justice-theme' ),
		'text'  => __( 'אם צריך ייעוץ אישי, אפשר להשוות פרופילים או להשאיר פנייה מסודרת בלי הבטחה לתוצאה.', 'justice-theme' ),
	),
);

$hero_first_steps = array(
	array(
		'label' => __( 'כתבו מה קרה', 'justice-theme' ),
		'text'  => __( 'שורה אחת עם האירוע, הצד השני, העיר והתאריך החשוב ביותר.', 'justice-theme' ),
	),
	array(
		'label' => __( 'שמרו מסמכים', 'justice-theme' ),
		'text'  => __( 'מכתב, זימון, חוזה, החלטה, צילום או הודעה יכולים לשנות את הצעד הבא.', 'justice-theme' ),
	),
	array(
		'label' => __( 'בדקו דחיפות', 'justice-theme' ),
		'text'  => __( 'אם יש חקירה, מועד דיון, עיקול, פיטורים או דרישת תשלום, אל תחכו.', 'justice-theme' ),
	),
	array(
		'label' => __( 'בחרו מסלול', 'justice-theme' ),
		'text'  => __( 'אפשר להתחיל ממדריך, מחיפוש לפי תחום ועיר, או מפנייה לעורך דין מתאים.', 'justice-theme' ),
	),
);
?>

<section class="hero" id="hero">
	<div class="container hero__grid">
		<div class="hero__content">
			<h1 class="hero__title">
				<?php esc_html_e( 'צריכים עזרה משפטית? התחילו ממה שקרה לכם עכשיו', 'justice-theme' ); ?>
			</h1>

			<p class="hero__description">
				<?php esc_html_e( 'מכתב מהביטוח הלאומי, זימון לחקירה, סכסוך משפחתי, תאונה, פיטורים או חוזה שלא ברור לכם יכולים להרגיש כמו רגע שבו חייבים להחליט מהר. Jus-Tice נועד לעזור לכם לעצור רגע, להבין מה סוג הבעיה, אילו מסמכים כדאי להכין, מה דחוף ומה אפשר לבדוק בשקט. אפשר להתחיל בחיפוש לפי תחום ועיר, לקרוא מדריך בשפה ברורה, ורק אם צריך לעבור לפרופילים או לפנייה מסודרת לעורך דין. המידע באתר כללי ואינו ייעוץ משפטי אישי או הבטחה לתוצאה.', 'justice-theme' ); ?>
			</p>

			<figure class="hero__visual hero__visual--mobile" aria-label="<?php esc_attr_e( 'מסלול מסודר לפני פנייה משפטית', 'justice-theme' ); ?>">
				<figcaption class="hero__visual-card">
					<span><?php esc_html_e( 'מסלול מסודר לפני פנייה', 'justice-theme' ); ?></span>
					<strong><?php esc_html_e( 'תארו מה קרה, בחרו תחום ועיר, והתקדמו רק כשברור מה הצעד הבא.', 'justice-theme' ); ?></strong>
				</figcaption>
				<div class="hero__visual-proof" aria-label="<?php esc_attr_e( 'רכיבי אמון לפני השארת פנייה', 'justice-theme' ); ?>">
					<span><?php esc_html_e( 'מידע כללי', 'justice-theme' ); ?></span>
					<span><?php esc_html_e( 'בדיקת דחיפות', 'justice-theme' ); ?></span>
					<span><?php esc_html_e( 'פנייה בוואטסאפ', 'justice-theme' ); ?></span>
				</div>
			</figure>

			<form class="hero-search" role="search" method="get" action="<?php echo esc_url( get_post_type_archive_link( 'justice_lawyer' ) ?: home_url( '/lawyers/' ) ); ?>" id="hero-search-form">
				<div class="hero-search__filters">
					<div class="hero-search__field">
						<label class="screen-reader-text" for="hero-practice-area">
							<?php esc_html_e( 'תחום משפטי', 'justice-theme' ); ?>
						</label>
						<select id="hero-practice-area" name="area">
							<option value=""><?php esc_html_e( 'בחרו תחום משפטי', 'justice-theme' ); ?></option>
							<?php foreach ( $hero_core_practices as $practice_slug => $practice_label ) : ?>
								<option value="<?php echo esc_attr( $practice_slug ); ?>">
									<?php echo esc_html( $practice_label ); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</div>

					<div class="hero-search__field">
						<label class="screen-reader-text" for="hero-city">
							<?php esc_html_e( 'עיר', 'justice-theme' ); ?>
						</label>
						<select id="hero-city" name="city">
							<option value=""><?php esc_html_e( 'בחרו עיר', 'justice-theme' ); ?></option>
							<?php foreach ( $israel_cities as $city ) : ?>
								<option value="<?php echo esc_attr( $city ); ?>">
									<?php echo esc_html( $city ); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</div>
				</div>

				<div class="hero-search__actions">
					<input
						id="hero-search-input"
						type="search"
						name="keyword"
						placeholder="<?php echo esc_attr__( 'לדוגמה: חקירה במשטרה, גירושין, תאונת עבודה...', 'justice-theme' ); ?>"
						value=""
					>
					<button type="submit" class="button button--primary">
						<?php esc_html_e( 'חיפוש', 'justice-theme' ); ?>
					</button>
				</div>
			</form>

			<div class="hero__first-steps" aria-label="<?php esc_attr_e( 'מה עושים בעשר הדקות הראשונות', 'justice-theme' ); ?>">
				<div class="hero__first-steps-intro">
					<strong><?php esc_html_e( 'מה עושים בעשר הדקות הראשונות?', 'justice-theme' ); ?></strong>
					<span><?php esc_html_e( 'לפני שמחפשים עורך דין, סדרו את המקרה כך שהשיחה או החיפוש יהיו מדויקים יותר.', 'justice-theme' ); ?></span>
				</div>
				<ol>
					<?php foreach ( $hero_first_steps as $step ) : ?>
						<li>
							<strong><?php echo esc_html( $step['label'] ); ?></strong>
							<span><?php echo esc_html( $step['text'] ); ?></span>
						</li>
					<?php endforeach; ?>
				</ol>
			</div>

			<ul class="hero__market-signals" aria-label="<?php esc_attr_e( 'איך Jus-Tice עוזר לבחור עורך דין', 'justice-theme' ); ?>">
				<?php foreach ( $hero_market_signals as $signal ) : ?>
					<li>
						<strong><?php echo esc_html( $signal['label'] ); ?></strong>
						<span><?php echo esc_html( $signal['text'] ); ?></span>
					</li>
				<?php endforeach; ?>
			</ul>

			<div class="hero__ctas">
				<?php if ( $hero_whatsapp_url ) : ?>
					<a href="<?php echo esc_url( $hero_whatsapp_url ); ?>" class="button button--hero-whatsapp" target="_blank" rel="noopener" data-whatsapp-surface="homepage_hero" data-lead-utm-source="homepage_hero" data-lead-utm-medium="whatsapp" data-lead-utm-campaign="public_legal_help">
						<?php esc_html_e( 'פנייה מהירה בוואטסאפ', 'justice-theme' ); ?>
					</a>
				<?php endif; ?>
				<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" class="button button--primary">
					<?php esc_html_e( 'בדקו מה הצעד הבא', 'justice-theme' ); ?>
				</a>
				<a href="<?php echo esc_url( home_url( '/articles/' ) ); ?>" class="button button--outline" style="border-color: rgba(255,255,255,0.4); color: #fff;">
					<?php esc_html_e( 'עיינו במדריכים', 'justice-theme' ); ?>
				</a>
			</div>

			<div class="hero__lawyer-access" aria-label="<?php esc_attr_e( 'כניסה והצטרפות לעורכי דין', 'justice-theme' ); ?>">
				<span><?php esc_html_e( 'לעורכי דין:', 'justice-theme' ); ?></span>
				<a href="<?php echo esc_url( home_url( '/lawyer-dashboard/' ) ); ?>"><?php esc_html_e( 'כניסה לאזור האישי', 'justice-theme' ); ?></a>
				<a href="<?php echo esc_url( home_url( '/lawyer-plans/' ) ); ?>"><?php esc_html_e( 'מסלולי הצטרפות', 'justice-theme' ); ?></a>
			</div>

			<div class="hero__stats">
				<?php
				$total_articles = wp_count_posts( 'articles' );
				$total_count = isset( $total_articles->publish ) ? (int) $total_articles->publish : 0;
				$post_counts = wp_count_posts( 'post' );
				$total_count += isset( $post_counts->publish ) ? (int) $post_counts->publish : 0;
				$total_terms = wp_count_terms( array( 'taxonomy' => 'practice-areas' ) );
				?>
				<span class="hero__stat">
					<strong><?php echo esc_html( number_format_i18n( $total_count ) ); ?></strong>
					<?php esc_html_e( 'מאמרים משפטיים', 'justice-theme' ); ?>
				</span>
				<span class="hero__stat">
					<strong><?php echo esc_html( is_numeric( $total_terms ) ? $total_terms : 0 ); ?></strong>
					<?php esc_html_e( 'תחומי משפט', 'justice-theme' ); ?>
				</span>
				<span class="hero__stat">
					<strong><?php echo esc_html( count( $israel_cities ) ); ?></strong>
					<?php esc_html_e( 'ערים', 'justice-theme' ); ?>
				</span>
			</div>
		</div>

		<figure class="hero__visual" aria-label="<?php esc_attr_e( 'מסלול מסודר לפני פנייה משפטית', 'justice-theme' ); ?>">
			<figcaption class="hero__visual-card">
				<span><?php esc_html_e( 'מסלול מסודר לפני פנייה', 'justice-theme' ); ?></span>
				<strong><?php esc_html_e( 'תארו מה קרה, בחרו תחום ועיר, והתקדמו רק כשברור מה הצעד הבא.', 'justice-theme' ); ?></strong>
			</figcaption>
			<div class="hero__visual-proof" aria-label="<?php esc_attr_e( 'רכיבי אמון לפני השארת פנייה', 'justice-theme' ); ?>">
				<span><?php esc_html_e( 'מידע כללי', 'justice-theme' ); ?></span>
				<span><?php esc_html_e( 'בדיקת דחיפות', 'justice-theme' ); ?></span>
				<span><?php esc_html_e( 'פנייה בוואטסאפ', 'justice-theme' ); ?></span>
			</div>
		</figure>

		<?php
		// Quick-links bar — popular practice areas as chip buttons
		// Core high-intent practice areas keep the homepage search clean.
		?>
		<div class="hero__panel" aria-label="<?php esc_attr_e( 'תחומי משפט נפוצים', 'justice-theme' ); ?>">
			<h2><?php esc_html_e( 'תחומי חיפוש מרכזיים', 'justice-theme' ); ?></h2>

			<ul class="hero__quick-links">
				<?php foreach ( $hero_core_practices as $practice_slug => $practice_label ) : ?>
					<li>
						<a href="<?php echo esc_url( home_url( '/lawyers/?area=' . rawurlencode( $practice_slug ) ) ); ?>">
							<?php echo esc_html( $practice_label ); ?>
							<span><?php esc_html_e( 'בדיקה', 'justice-theme' ); ?></span>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>

			<a href="<?php echo esc_url( home_url( '/lawyers/' ) ); ?>" class="hero__panel-cta">
				<?php esc_html_e( 'כל התחומים', 'justice-theme' ); ?>
			</a>
		</div>
	</div>
</section>
