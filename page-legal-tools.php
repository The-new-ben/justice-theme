<?php
/**
 * AI legal document tools - gated generator hub at /legal-tools/.
 *
 * Auto-applied by WordPress's page-{slug}.php template hierarchy for the
 * page whose slug is "legal-tools" - no admin/template-picker action
 * needed for this to go live after a deploy.
 *
 * @package JusticeTheme
 */

get_header();
?>

<div class="justice-ai-app" id="justice-ai-app" dir="rtl">

	<section class="hero">
		<div class="hero-copy">
			<span class="eyebrow"><?php esc_html_e( 'כלים להכנת מסמכים משפטיים', 'justice-theme' ); ?></span>
			<h1><?php esc_html_e( 'מכינים טיוטה משפטית מסודרת לפני בדיקת עורך דין', 'justice-theme' ); ?></h1>
			<p class="sub"><?php esc_html_e( 'בחרו נושא, מלאו שאלון קצר וקבלו מסמך ראשוני בעברית או באנגלית. הטיוטה הבסיסית נוצרת מיד בלי הרשמה. שדרוג עם AI, העתקה, הדפסה והורדה פתוחים אחרי פרטי קשר קצרים.', 'justice-theme' ); ?></p>
			<div class="stats">
				<div class="stat"><b id="statTools">50</b><span><?php esc_html_e( 'כלים משפטיים', 'justice-theme' ); ?></span></div>
				<div class="stat"><b id="statLive">50</b><span><?php esc_html_e( 'מוכנים לשימוש', 'justice-theme' ); ?></span></div>
				<div class="stat"><b>2</b><span><?php esc_html_e( 'עברית ואנגלית', 'justice-theme' ); ?></span></div>
			</div>
			<div class="trust-strip">
				<div class="trust"><span><b><?php esc_html_e( 'טיוטה חינם, בלי הרשמה', 'justice-theme' ); ?></b><span><?php esc_html_e( 'מתחילים מיד, ללא תשלום וללא כרטיס אשראי', 'justice-theme' ); ?></span></span></div>
				<div class="trust"><span><b><?php esc_html_e( 'לא תחליף לייעוץ', 'justice-theme' ); ?></b><span><?php esc_html_e( 'מסמך שמיועד לבדיקה והשלמה על ידי עורך דין', 'justice-theme' ); ?></span></span></div>
				<div class="trust"><span><b><?php esc_html_e( 'שאלון לפי נושא', 'justice-theme' ); ?></b><span><?php esc_html_e( 'רק הפרטים הנדרשים למסמך הספציפי', 'justice-theme' ); ?></span></span></div>
			</div>
		</div>
		<figure class="hero-media">
			<img src="<?php echo esc_url( JUSTICE_THEME_URI . '/assets/images/guide-hero.jpg' ); ?>" alt="<?php esc_attr_e( 'הכנת מסמך משפטי במחשב לפני בדיקת עורך דין', 'justice-theme' ); ?>" loading="eager" width="430" height="330">
			<figcaption><b><?php esc_html_e( 'מתחילים מהעובדות והמסמכים', 'justice-theme' ); ?></b><span><?php esc_html_e( 'הטיוטה עוזרת להגיע מסודרים לשיחה או לבדיקה משפטית.', 'justice-theme' ); ?></span></figcaption>
		</figure>
	</section>

	<div class="toolbar">
		<div class="search">
			<input id="search" type="search" placeholder="<?php esc_attr_e( 'חיפוש מסמך או מצב משפטי…', 'justice-theme' ); ?>" autocomplete="off">
		</div>
		<button type="button" class="lang" id="langBtn" aria-label="<?php esc_attr_e( 'החלפת שפה', 'justice-theme' ); ?>">
			<span id="langLabel">EN</span>
		</button>
		<div class="cats" id="cats"></div>
	</div>

	<div class="wrap"><div id="grid" class="grid"></div></div>

	<div class="scrim" id="scrim"></div>
	<aside class="sheet" id="sheet" aria-modal="true" role="dialog"></aside>
	<div class="toast" id="toast"></div>

</div>

<?php
get_footer();
