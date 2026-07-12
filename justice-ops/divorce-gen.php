<?php
/**
 * Divorce agreement generator, v1: the owner's "every money page is an
 * application" rule applied to the strongest near-win page. The visitor
 * answers seven questions (every one has a sane default, so even zero
 * typing yields a document), the generator assembles a personalized
 * agreement skeleton from the same clause bank the article teaches, and
 * shows a real preview: the opening sections in full, the rest named
 * but locked.
 *
 * Monetization is explicit and honest: the preview is free, the full
 * editable document plus a basic fit check is paid (price in the
 * jt_divorce_gen_price option). v1 collects the order as a routed lead
 * on the existing lead rail (same nonce, honeypot and timing guard as
 * every other surface) and payment is settled manually in WhatsApp,
 * exactly like the advertiser funnel does until a processor is chosen.
 * No claim of instant checkout is made anywhere in the copy.
 *
 * Deliberately zero AI dependency: assembly is deterministic template
 * work, so the tool keeps working while the AI engine is down and costs
 * nothing per use. The AI fit-check layer can ride on top once the
 * engine is back.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_divorce_gen_price(): string {
	return (string) get_option( 'jt_divorce_gen_price', '149' );
}

add_shortcode( 'justice_divorce_gen', function () {
	$price = justice_divorce_gen_price();

	ob_start();
	?>
	<div class="jt-dg" id="jt-dg">
		<div class="jt-dg__head">
			<h3 class="jt-dg__h">מחולל הסכם גירושין אישי</h3>
			<p class="jt-dg__sub">שבע שאלות קצרות, וכולן עם ברירת מחדל: אפשר פשוט ללחוץ ולראות. התצוגה המקדימה חינם, ואף פרט לא נשמר לפני שאתם מחליטים.</p>
		</div>

		<div class="jt-dg__form">
			<div class="jt-dg__row">
				<label for="jt-dg-a">שם צד א'</label>
				<input type="text" id="jt-dg-a" placeholder="לדוגמה: דנה כהן" maxlength="60">
			</div>
			<div class="jt-dg__row">
				<label for="jt-dg-b">שם צד ב'</label>
				<input type="text" id="jt-dg-b" placeholder="לדוגמה: יואב כהן" maxlength="60">
			</div>
			<div class="jt-dg__row">
				<label for="jt-dg-kids">ילדים משותפים מתחת לגיל 18</label>
				<select id="jt-dg-kids">
					<option value="0">אין</option>
					<option value="1" selected>ילד אחד</option>
					<option value="2">שני ילדים</option>
					<option value="3">שלושה או יותר</option>
				</select>
			</div>
			<div class="jt-dg__row">
				<label for="jt-dg-home">דירת מגורים</label>
				<select id="jt-dg-home">
					<option value="none">אין דירה בבעלות</option>
					<option value="sell" selected>דירה בבעלות, תימכר</option>
					<option value="keep">דירה בבעלות, צד אחד רוכש את חלקו של השני</option>
					<option value="rent">גרים בשכירות</option>
				</select>
			</div>
			<div class="jt-dg__row">
				<label for="jt-dg-pension">פנסיה וזכויות סוציאליות</label>
				<select id="jt-dg-pension">
					<option value="split" selected>חלוקה של הזכויות מתקופת החיים המשותפים</option>
					<option value="each">כל צד שומר על הזכויות שלו</option>
				</select>
			</div>
			<div class="jt-dg__row">
				<label for="jt-dg-split">חלוקת הוצאות חריגות לילדים</label>
				<select id="jt-dg-split">
					<option value="50" selected>חצי חצי</option>
					<option value="60">60 / 40</option>
					<option value="70">70 / 30</option>
				</select>
			</div>
			<div class="jt-dg__row">
				<label for="jt-dg-court">איפה תרצו לאשר את ההסכם</label>
				<select id="jt-dg-court">
					<option value="family" selected>בית המשפט לענייני משפחה</option>
					<option value="rabbinical">בית הדין הרבני</option>
					<option value="undecided">עוד לא החלטנו</option>
				</select>
			</div>
			<button type="button" class="jt-dg__go" id="jt-dg-go">הצגת ההסכם שלי</button>
		</div>

		<div class="jt-dg__result" id="jt-dg-result" hidden>
			<div class="jt-dg__doc" id="jt-dg-doc"></div>
			<div class="jt-dg__locked">
				<p class="jt-dg__locked-h">בגרסה המלאה, מותאם לתשובות שלכם:</p>
				<ul id="jt-dg-locked-list"></ul>
			</div>
			<div class="jt-dg__pay">
				<p class="jt-dg__price"><strong>המסמך המלא לעריכה חופשית: <?php echo esc_html( $price ); ?> ₪</strong></p>
				<p class="jt-dg__pay-sub">כולל את כל הסעיפים מותאמים לתשובות שלכם, קובץ פתוח לעריכה, ובדיקת התאמה בסיסית של נציג. התשלום מוסדר מול נציג בוואטסאפ אחרי השליחה, ורק אז נשלח המסמך.</p>
				<form class="jt-dg__lead" method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
					<input type="hidden" name="action" value="justice_submit_lead">
					<input type="hidden" name="lead_source_surface" value="divorce_gen">
					<?php echo wp_nonce_field( 'justice_submit_lead', 'justice_lead_nonce', true, false ); // phpcs:ignore WordPress.Security.EscapeOutput ?>
					<div class="justice-lead-guard" aria-hidden="true" style="position:absolute;inset-inline-start:-9999px"><label>Company<input type="text" name="justice_lead_company" tabindex="-1" autocomplete="off"></label></div>
					<input type="hidden" name="justice_lead_started_at" value="<?php echo esc_attr( (string) time() ); ?>">
					<input type="hidden" name="lead_area" value="family-law">
					<input type="hidden" name="lead_urgency" value="normal">
					<input type="hidden" name="lead_message" id="jt-dg-lead-msg" value="">
					<div class="jt-dg__lead-grid">
						<label class="screen-reader-text" for="jt-dg-name">שם מלא</label>
						<input type="text" id="jt-dg-name" name="lead_name" placeholder="שם מלא" required maxlength="60">
						<label class="screen-reader-text" for="jt-dg-phone">טלפון</label>
						<input type="tel" id="jt-dg-phone" name="lead_phone" placeholder="טלפון" required maxlength="20">
						<button type="submit">קבלת המסמך המלא</button>
					</div>
				</form>
			</div>
			<p class="jt-dg__disc">המחולל מרכיב נוסח בסיסי לפי התשובות שלכם והוא מידע כללי בלבד, לא ייעוץ משפטי. הסכם גירושין מקבל תוקף רק לאחר אישור בערכאה מוסמכת, ובכל מצב מורכב נכון להתייעץ עם עורך דין.</p>
		</div>
	</div>
	<?php
	return (string) ob_get_clean();
} );

add_action( 'wp_head', function () {
	if ( false === strpos( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), 'free-divorce-agreement-template' ) ) {
		return;
	}

	echo '<style id="jt-dg-css">'
		. '.jt-dg{background:#f7f9fd;border:1px solid #dbe3f0;border-radius:16px;padding:24px;margin:26px 0}'
		. '.jt-dg__h{font-size:22px;color:#14213d;margin:0 0 6px}'
		. '.jt-dg__sub{font-size:14.5px;color:#44506b;margin:0 0 18px;line-height:1.55}'
		. '.jt-dg__form{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}'
		. '.jt-dg__row label{display:block;font-size:13px;font-weight:700;color:#14213d;margin:0 0 4px}'
		. '.jt-dg__row input,.jt-dg__row select{width:100%;border:1px solid #cbd6e8;border-radius:10px;padding:10px 12px;font:inherit;font-size:14.5px;color:#14213d;background:#fff}'
		. '.jt-dg__go{grid-column:1/-1;background:linear-gradient(90deg,#e7c765,#d9b654);color:#14213d;border:0;border-radius:12px;padding:13px;font-weight:800;font-size:16px;cursor:pointer}'
		. '.jt-dg__doc{background:#fff;border:1px solid #dbe3f0;border-radius:12px;padding:22px;margin:18px 0 0;line-height:1.75;font-size:15px;color:#1d2740;white-space:pre-wrap}'
		. '.jt-dg__locked{background:linear-gradient(180deg,rgba(255,255,255,.65),#eef2fa);border:1px dashed #b8c6de;border-radius:12px;padding:16px 20px;margin:14px 0 0}'
		. '.jt-dg__locked-h{font-weight:800;color:#14213d;margin:0 0 8px;font-size:14.5px}'
		. '.jt-dg__locked ul{margin:0;padding-inline-start:20px;color:#44506b;font-size:14px;line-height:1.9}'
		. '.jt-dg__locked li{list-style:none;position:relative;padding-inline-start:18px}'
		. '.jt-dg__locked li:before{content:"•";position:absolute;inset-inline-start:0;color:#b8933f;font-weight:800}'
		. '.jt-dg__pay{margin:16px 0 0;text-align:center}'
		. '.jt-dg__price{font-size:18px;color:#14213d;margin:0 0 6px}'
		. '.jt-dg__pay-sub{font-size:13.5px;color:#44506b;margin:0 auto 12px;max-width:60ch;line-height:1.55}'
		. '.jt-dg__lead-grid{display:flex;gap:8px;max-width:560px;margin:0 auto;flex-wrap:wrap}'
		. '.jt-dg__lead-grid input{flex:1;min-width:140px;border:1px solid #cbd6e8;border-radius:10px;padding:11px 12px;font:inherit;font-size:14.5px}'
		. '.jt-dg__lead-grid button{background:#14213d;color:#e7c765;border:0;border-radius:10px;padding:11px 22px;font-weight:800;font-size:15px;cursor:pointer}'
		. '.jt-dg__disc{font-size:12.5px;color:#6b7690;margin:14px 0 0;line-height:1.5}'
		. '@media (max-width:560px){.jt-dg{padding:16px}}'
		. '</style>';
}, 8 );

add_action( 'wp_footer', function () {
	if ( false === strpos( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), 'free-divorce-agreement-template' ) ) {
		return;
	}
	?>
	<script id="jt-dg-js">
	(function () {
		var root = document.getElementById('jt-dg');
		if (!root) { return; }
		var go = document.getElementById('jt-dg-go');
		go.addEventListener('click', function () {
			var v = function (id, fb) { var el = document.getElementById(id); var x = (el.value || '').trim(); return x || fb; };
			var a = v('jt-dg-a', 'צד א\''), b = v('jt-dg-b', 'צד ב\'');
			var kids = document.getElementById('jt-dg-kids').value;
			var home = document.getElementById('jt-dg-home').value;
			var pension = document.getElementById('jt-dg-pension').value;
			var split = document.getElementById('jt-dg-split').value;
			var court = document.getElementById('jt-dg-court').value;

			var courtTxt = court === 'rabbinical' ? 'בית הדין הרבני האזורי' : 'בית המשפט לענייני משפחה';
			var kidsTxt = kids === '0' ? 'ולצדדים אין ילדים קטינים משותפים' : 'ומנישואיהם נולדו ' + (kids === '1' ? 'קטין אחד' : (kids === '2' ? 'שני קטינים' : 'שלושה קטינים או יותר'));

			var doc = 'הסכם גירושין\n\nשנערך ונחתם ביום ____\n\nבין: ' + a + ' (להלן: "צד א\'")\nובין: ' + b + ' (להלן: "צד ב\'")\n\n'
				+ 'הואיל והצדדים נישאו זה לזו כדין, ' + kidsTxt + ', והואיל והצדדים החליטו להיפרד ולהסדיר בהסכמה מלאה את כלל העניינים האישיים, ההוריים, הכלכליים והרכושיים הנובעים מן הפרידה, מוסכם בזה כדלקמן:\n\n'
				+ '1. הצהרת הצדדים והגט\nהצדדים מצהירים כי הם מבקשים להתגרש זה מזו בהסכמה, ויפעלו במשותף ובתום לב לסידור הגט בבית הדין הרבני המוסמך.\n\n'
				+ '2. אישור ההסכם\nהצדדים יגישו הסכם זה לאישור ' + courtTxt + ', לשם קבלת תוקף של פסק דין.';

			if (kids !== '0') {
				doc += '\n\n3. זמני שהות (תמצית)\nהקטינים ישהו עם שני ההורים לפי חלוקה שתפורט בנספח זמני השהות, לרבות חגים, חופשות ומנגנון שינויים בכתב.'
					+ '\n\n4. הוצאות חריגות (תמצית)\nהוצאות חינוך ורפואה חריגות יחולקו ביחס של ' + split + '% / ' + (100 - parseInt(split, 10)) + '%, כנגד אסמכתאות ובתוך 14 ימים מדרישה.';
			}

			document.getElementById('jt-dg-doc').textContent = doc;

			var locked = [
				'סעיף מזונות ילדים מלא, כולל מדור, מועדי תשלום והצמדה',
				'חלוקת רכוש מלאה: חשבונות, חסכונות, רכב ותכולה, עם נספחים',
				home === 'none' || home === 'rent' ? 'הסדרת השכירות, הערבויות והמעבר' : 'סעיף דירת המגורים והמשכנתה: לוח זמנים, ' + (home === 'sell' ? 'מכירה וחלוקת תמורה' : 'רכישת חלקו של הצד השני'),
				pension === 'split' ? 'איזון פנסיה וזכויות סוציאליות עם מנגנון ביצוע וטפסים' : 'הפרדת זכויות סוציאליות וניסוח הוויתור ההדדי',
				'חובות, הלוואות וערבויות, כולל סעיף שיפוי',
				'כתובה, סילוק תביעות הדדי וסמכות שיפוט',
				'מנגנון יישוב מחלוקות עתידיות'
			];
			var ul = document.getElementById('jt-dg-locked-list');
			ul.innerHTML = '';
			locked.forEach(function (t) { var li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });

			document.getElementById('jt-dg-lead-msg').value = 'הזמנת מסמך מלא ממחולל הסכם הגירושין. פרטים: ילדים=' + kids + ', דירה=' + home + ', פנסיה=' + pension + ', הוצאות=' + split + '%, ערכאה=' + court + '. מחיר שהוצג: <?php echo esc_js( justice_divorce_gen_price() ); ?> ש"ח, גבייה מול נציג.';

			var res = document.getElementById('jt-dg-result');
			res.hidden = false;
			res.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	})();
	</script>
	<?php
}, 24 );
