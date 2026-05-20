<?php
/**
 * Template Name: Lawyer Registration
 *
 * @package JusticeTheme
 */

get_header();

$practice_terms = taxonomy_exists( 'practice-areas' )
	? get_terms( array( 'taxonomy' => 'practice-areas', 'hide_empty' => false ) )
	: array();

$core_practice_options = array(
	'family-law'          => 'דיני משפחה וגירושין',
	'criminal-law'        => 'משפט פלילי',
	'traffic-law'         => 'דיני תעבורה',
	'real-estate-law'     => 'מקרקעין ונדל"ן',
	'labor-law'           => 'דיני עבודה',
	'inheritance-law'     => 'ירושה וצוואות',
	'torts'               => 'נזיקין',
	'medical-malpractice' => 'רשלנות רפואית',
	'national-insurance'  => 'ביטוח לאומי',
	'immigration-law'     => 'הגירה ואזרחות',
);

$core_city_options = array(
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

$allowed_plan_interests = array( 'free', 'pro', 'featured', 'lead_partner', 'full_service' );
$selected_plan_interest = isset( $_GET['plan_interest'] ) ? sanitize_key( wp_unslash( $_GET['plan_interest'] ) ) : 'free';
$selected_payment_path  = isset( $_GET['payment_path'] ) ? sanitize_key( wp_unslash( $_GET['payment_path'] ) ) : '';

if ( ! in_array( $selected_plan_interest, $allowed_plan_interests, true ) ) {
	$selected_plan_interest = 'free';
}

if ( 'manual_invoice' !== $selected_payment_path ) {
	$selected_payment_path = '';
}

$registration_plans = function_exists( 'justice_theme_lawyer_plans' ) ? justice_theme_lawyer_plans() : array();
$selected_plan       = $registration_plans[ $selected_plan_interest ] ?? array();

if ( $selected_plan && function_exists( 'justice_theme_lawyer_plan_public_overrides' ) ) {
	$selected_plan_override = justice_theme_lawyer_plan_public_overrides( $selected_plan_interest );
	if ( ! empty( $selected_plan_override['price'] ) ) {
		$selected_plan['price'] = $selected_plan_override['price'];
	}
}
?>

<section class="lawyer-registration-hero section">
	<div class="container lawyer-registration-hero__grid">
		<div>
			<p class="section-header__eyebrow"><?php esc_html_e( 'לעורכי דין', 'justice-theme' ); ?></p>
			<h1><?php esc_html_e( 'בנו נוכחות דיגיטלית שמייצרת פניות, אמון ותוכן מקצועי', 'justice-theme' ); ?></h1>
			<p><?php esc_html_e( 'Jus-Tice נבנית כפלטפורמה לעורכי דין: מיני-סייט מקצועי, תוכן חתום על שמכם, פניות מסודרות, כלים משפטיים ויכולת לגדול למסלולי פרסום ולידים.', 'justice-theme' ); ?></p>
		</div>
		<aside class="lawyer-registration-hero__panel">
			<strong><?php esc_html_e( 'מה מקבלים בהמשך הדרך?', 'justice-theme' ); ?></strong>
			<ul>
				<li><?php esc_html_e( 'פרופיל עורך דין עשיר עם תחומי עיסוק, מדיה ותוכן.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'אפשרות למאמרים, מדריכים וכלים דיגיטליים סביב התחום שלכם.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'תשתית עתידית ללידים, סטטוס פניות ומסלולי תשלום.', 'justice-theme' ); ?></li>
			</ul>
		</aside>
	</div>
</section>

<section class="lawyer-registration section">
	<div class="container lawyer-registration__grid">
		<div class="lawyer-registration__content">
			<h2><?php esc_html_e( 'הרשמה ראשונית', 'justice-theme' ); ?></h2>
			<p><?php esc_html_e( 'הפרופיל לא מתפרסם אוטומטית. לאחר שליחה הוא נכנס לבדיקה, אימות ועריכה לפני עלייה לאתר.', 'justice-theme' ); ?></p>

			<?php if ( isset( $_GET['registration'] ) && 'sent' === $_GET['registration'] ) : ?>
				<div class="legaltool-request__notice"><?php esc_html_e( 'הטופס התקבל. הפרופיל ייבדק לפני פרסום.', 'justice-theme' ); ?></div>
			<?php elseif ( isset( $_GET['registration'] ) && 'blocked' === $_GET['registration'] ) : ?>
				<div class="lawyer-registration__error"><?php esc_html_e( 'מערכת פרופילי עורכי הדין אינה פעילה כרגע. נסו שוב מאוחר יותר.', 'justice-theme' ); ?></div>
			<?php elseif ( isset( $_GET['registration'] ) ) : ?>
				<div class="lawyer-registration__error"><?php esc_html_e( 'חסרים פרטים או שהשליחה נכשלה. בדקו את הטופס ונסו שוב.', 'justice-theme' ); ?></div>
			<?php endif; ?>

			<?php if ( 'manual_invoice' === $selected_payment_path ) : ?>
				<div class="legaltool-request__notice"><?php esc_html_e( 'בקשת המסלול תטופל ידנית: לאחר בדיקת התאמה נשלח חשבונית/דרישת תשלום ונפעיל את המסלול לאחר אישור תשלום.', 'justice-theme' ); ?></div>
			<?php endif; ?>

			<?php if ( $selected_plan ) : ?>
				<section class="lawyer-registration-plan-context" aria-label="<?php esc_attr_e( 'Selected plan summary', 'justice-theme' ); ?>">
					<div>
						<span><?php esc_html_e( 'המסלול שנבחר', 'justice-theme' ); ?></span>
						<strong><?php echo esc_html( $selected_plan['label'] ?? $selected_plan_interest ); ?></strong>
					</div>
					<div>
						<span><?php esc_html_e( 'מחיר', 'justice-theme' ); ?></span>
						<strong><?php echo esc_html( $selected_plan['price'] ?? '-' ); ?></strong>
					</div>
					<p><?php echo 'manual_invoice' === $selected_payment_path ? esc_html__( 'השליחה תיצור בקשת בדיקת התאמה וחשבונית ידנית. לא יתבצע חיוב אוטומטי מהטופס הזה.', 'justice-theme' ) : esc_html__( 'השליחה יוצרת פרופיל טיוטה לבדיקה. תשלום אוטומטי ייפתח רק כאשר הסליקה והמוצרים יהיו פעילים.', 'justice-theme' ); ?></p>
				</section>
			<?php endif; ?>

			<form class="lawyer-registration-form" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="justice_lawyer_registration">
				<?php if ( 'manual_invoice' === $selected_payment_path ) : ?>
					<input type="hidden" name="payment_path" value="manual_invoice">
				<?php endif; ?>
				<?php wp_nonce_field( 'justice_lawyer_registration', 'justice_lawyer_registration_nonce' ); ?>
				<p class="lawyer-registration-form__trap">
					<label>Website <input type="text" name="website_url_confirm" tabindex="-1" autocomplete="off"></label>
				</p>

				<div class="lawyer-registration-form__grid">
					<label>
						<span><?php esc_html_e( 'שם מלא', 'justice-theme' ); ?></span>
						<input type="text" name="lawyer_full_name" required autocomplete="name">
					</label>
					<label>
						<span><?php esc_html_e( 'שם משרד', 'justice-theme' ); ?></span>
						<input type="text" name="firm_name">
					</label>
					<label>
						<span><?php esc_html_e( 'מספר רישיון', 'justice-theme' ); ?></span>
						<input type="text" name="bar_number">
					</label>
					<label>
						<span><?php esc_html_e( 'תחום עיקרי', 'justice-theme' ); ?></span>
						<select name="practice_area">
							<option value=""><?php esc_html_e( 'בחרו תחום', 'justice-theme' ); ?></option>
							<?php if ( ! empty( $practice_terms ) && ! is_wp_error( $practice_terms ) ) : ?>
								<?php foreach ( $practice_terms as $term ) : ?>
									<option value="<?php echo esc_attr( $term->slug ); ?>"><?php echo esc_html( $term->name ); ?></option>
								<?php endforeach; ?>
							<?php else : ?>
								<?php foreach ( $core_practice_options as $practice_slug => $practice_label ) : ?>
									<option value="<?php echo esc_attr( $practice_slug ); ?>"><?php echo esc_html( $practice_label ); ?></option>
								<?php endforeach; ?>
							<?php endif; ?>
						</select>
					</label>
					<label>
						<span><?php esc_html_e( 'טלפון', 'justice-theme' ); ?></span>
						<input type="tel" name="phone" required autocomplete="tel">
					</label>
					<label>
						<span><?php esc_html_e( 'אימייל', 'justice-theme' ); ?></span>
						<input type="email" name="email" required autocomplete="email">
					</label>
					<label>
						<span>WhatsApp</span>
						<input type="tel" name="whatsapp">
					</label>
					<label>
						<span><?php esc_html_e( 'אתר קיים', 'justice-theme' ); ?></span>
						<input type="url" name="website" placeholder="https://">
					</label>
					<label>
						<span><?php esc_html_e( 'ערים/אזורי שירות', 'justice-theme' ); ?></span>
						<input type="text" name="cities_served" list="justice-city-options" placeholder="<?php esc_attr_e( 'תל אביב, רמת גן, ירושלים', 'justice-theme' ); ?>">
						<datalist id="justice-city-options">
							<?php foreach ( $core_city_options as $city_option ) : ?>
								<option value="<?php echo esc_attr( $city_option ); ?>"></option>
							<?php endforeach; ?>
						</datalist>
					</label>
					<label>
						<span><?php esc_html_e( 'שפות', 'justice-theme' ); ?></span>
						<input type="text" name="languages" placeholder="<?php esc_attr_e( 'עברית, אנגלית', 'justice-theme' ); ?>">
					</label>
					<label>
						<span><?php esc_html_e( 'מסלול שמעניין אותך', 'justice-theme' ); ?></span>
						<select name="plan_interest" data-selected-plan="<?php echo esc_attr( $selected_plan_interest ); ?>">
							<option value="free"><?php esc_html_e( 'פרופיל בסיסי', 'justice-theme' ); ?></option>
							<option value="pro"><?php esc_html_e( 'מיני-סייט מקצועי', 'justice-theme' ); ?></option>
							<option value="featured"><?php esc_html_e( 'חשיפה מוגברת', 'justice-theme' ); ?></option>
							<option value="lead_partner"><?php esc_html_e( 'שיתוף לידים', 'justice-theme' ); ?></option>
							<option value="full_service"><?php esc_html_e( 'שירות מלא', 'justice-theme' ); ?></option>
						</select>
					</label>
					<label>
						<span><?php esc_html_e( 'זמינות למענה לפניות', 'justice-theme' ); ?></span>
						<select name="lead_response_commitment">
							<option value=""><?php esc_html_e( 'בחרו זמינות', 'justice-theme' ); ?></option>
							<option value="within_15_min"><?php esc_html_e( 'אפשר לענות בתוך 15 דקות בשעות פעילות', 'justice-theme' ); ?></option>
							<option value="same_day"><?php esc_html_e( 'אפשר לענות באותו יום עבודה', 'justice-theme' ); ?></option>
							<option value="next_day"><?php esc_html_e( 'בדרך כלל ביום העבודה הבא', 'justice-theme' ); ?></option>
							<option value="not_sure"><?php esc_html_e( 'צריך לתאם תהליך מענה', 'justice-theme' ); ?></option>
						</select>
					</label>
					<label class="lawyer-registration-form__full">
						<span><?php esc_html_e( 'תיאור קצר', 'justice-theme' ); ?></span>
						<textarea name="bio_short" rows="5" placeholder="<?php esc_attr_e( 'ספרו בקצרה על תחומי העיסוק, ניסיון, קהל יעד ומה תרצו להציג בפרופיל.', 'justice-theme' ); ?>"></textarea>
					</label>
					<label class="lawyer-registration-form__full">
						<span><?php esc_html_e( 'כותרת שיווקית לפרופיל', 'justice-theme' ); ?></span>
						<input type="text" name="profile_headline" placeholder="<?php esc_attr_e( 'לדוגמה: ליווי אישי בהליכי גירושין, הסכמות וזמני שהות', 'justice-theme' ); ?>">
					</label>
					<label class="lawyer-registration-form__full">
						<span><?php esc_html_e( 'שירותים מרכזיים למיני-סייט', 'justice-theme' ); ?></span>
						<textarea name="profile_services" rows="4" placeholder="<?php esc_attr_e( 'כל שורה: שם השירות | הסבר קצר. לדוגמה: גירושין בהסכמה | בניית הסכם מאוזן לפני אישור בית משפט', 'justice-theme' ); ?>"></textarea>
					</label>
					<label class="lawyer-registration-form__full">
						<span><?php esc_html_e( 'איך נראה תהליך העבודה איתכם?', 'justice-theme' ); ?></span>
						<textarea name="profile_process" rows="4" placeholder="<?php esc_attr_e( 'כל שורה: שלב | מה קורה בשלב הזה. לדוגמה: שיחת אבחון | מיפוי מצב, מטרות ומסמכים חסרים', 'justice-theme' ); ?>"></textarea>
					</label>
					<label>
						<span><?php esc_html_e( 'קישור לווידאו היכרות', 'justice-theme' ); ?></span>
						<input type="url" name="profile_video_url" placeholder="https://">
					</label>
					<label class="lawyer-registration-form__full">
						<span><?php esc_html_e( 'שאלות נפוצות שתרצו לענות עליהן', 'justice-theme' ); ?></span>
						<textarea name="profile_faqs" rows="4" placeholder="<?php esc_attr_e( 'כל שורה: שאלה | תשובה קצרה. כל תשובה תיבדק לפני פרסום.', 'justice-theme' ); ?>"></textarea>
					</label>
				</div>

				<label class="lawyer-registration-form__consent">
					<input type="checkbox" name="consent" value="1" required>
					<span><?php esc_html_e( 'אני מאשר/ת יצירת פרופיל טיוטה ובדיקת הפרטים לפני פרסום. ברור לי שהפרופיל לא יפורסם אוטומטית.', 'justice-theme' ); ?></span>
				</label>

				<button class="button button--gold" type="submit"><?php esc_html_e( 'שליחת פרטים לבדיקה', 'justice-theme' ); ?></button>
			</form>
		</div>

		<aside class="lawyer-registration__side">
			<h2><?php esc_html_e( 'למה זה חשוב לעורך דין?', 'justice-theme' ); ?></h2>
			<ul>
				<li><?php esc_html_e( 'עמוד פרופיל עשיר יותר מכרטיס רגיל.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'חיבור למאמרים ותחומי מומחיות.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'אפשרות עתידית לקבל פניות מסודרות לפי תחום ועיר.', 'justice-theme' ); ?></li>
				<li><?php esc_html_e( 'תשתית לתוכן, וידאו, ביקורות מאושרות וכלים משפטיים.', 'justice-theme' ); ?></li>
			</ul>
		</aside>
	</div>
</section>

<?php get_footer(); ?>
