<?php
/**
 * The medical-malpractice claim checker: the malpractice vertical's
 * embedded application, built from the Part-A product spec of the deep
 * research. Six short questions return a conservative direction, an
 * early limitation estimate, a four-element map (duty, breach, damage,
 * causation), a document checklist by event type, next steps, and the
 * legal sources used. No name, phone or upload is collected before the
 * result, because the input is sensitive medical information.
 *
 * All logic is deterministic and runs in the browser (no AI dependency,
 * no per-use cost). The limitation engine is intentionally conservative:
 * it shows the EARLIEST date that might apply as a warning, states its
 * assumptions, never says "you can still sue", and flags anything that
 * needs a human (abroad, minors, multiple institutions, the special
 * tolling window). Risk is never shown by color alone: every state
 * carries text and an icon.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_mp_on_page(): bool {
	return false !== strpos( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), 'medical-malpractice' );
}

add_shortcode( 'justice_malpractice_checker', function () {
	$opt = function ( $v, $l ) {
		return '<option value="' . esc_attr( $v ) . '">' . esc_html( $l ) . '</option>';
	};

	$events = array(
		'diagnosis' => 'איחור או טעות באבחון',
		'treatment' => 'טיפול או תרופה',
		'surgery'   => 'ניתוח או הרדמה',
		'birth'     => 'היריון או לידה',
		'dental'    => 'טיפול שיניים',
		'aesthetic' => 'הליך אסתטי',
		'consent'   => 'היעדר הסכמה מדעת',
		'other'     => 'מקרה אחר',
	);

	$ev_html = '';
	foreach ( $events as $v => $l ) {
		$ev_html .= $opt( $v, $l );
	}

	ob_start();
	?>
	<div class="jt-mp" id="jt-mp">
		<div class="jt-mp__head">
			<svg class="jt-mp__glyph" width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-7-4.35-7-10a4.5 4.5 0 018-2.8A4.5 4.5 0 0119 11c0 5.65-7 10-7 10Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 11h2V9h2v2h2v2h-2v2h-2v-2H9z" fill="currentColor"/></svg>
			<div>
				<h3 class="jt-mp__h">בודק עילה ראשוני לרשלנות רפואית</h3>
				<p class="jt-mp__sub">שש שאלות קצרות מחזירות כיוון, מועד התיישנות משוער, רשימת מסמכים והצעד הבא. אין צורך להזין שם או טלפון כדי לקבל את התוצאה.</p>
			</div>
		</div>

		<div class="jt-mp__body">
			<form id="jt-mp-form">
				<div class="jt-mp__q"><label for="mp-event">1. מה קרה?</label>
					<select id="mp-event"><option value="">בחרו סוג אירוע</option><?php echo $ev_html; // phpcs:ignore ?></select></div>

				<div class="jt-mp__q"><label for="mp-treat">2. מתי היה הטיפול? (חודש ושנה מספיקים)</label>
					<input type="month" id="mp-treat"></div>

				<div class="jt-mp__q"><label for="mp-discover">מתי התגלה הנזק? (אם מאוחר יותר, לא חובה)</label>
					<input type="month" id="mp-discover"></div>

				<div class="jt-mp__q"><label for="mp-where">3. איפה טיפלו?</label>
					<select id="mp-where"><?php
						echo $opt( 'hospital', 'בית חולים' ) . $opt( 'kupa', 'קופת חולים' ) . $opt( 'private', 'מרפאה פרטית' ) . $opt( 'dental', 'מרפאת שיניים' ) . $opt( 'aesthetic', 'מרכז אסתטי' ) . $opt( 'other', 'גורם אחר' ); // phpcs:ignore
					?></select>
					<label class="jt-mp__inline"><input type="checkbox" id="mp-abroad"> הטיפול היה בחו"ל</label>
				</div>

				<div class="jt-mp__q"><label for="mp-damage">4. מה הנזק?</label>
					<select id="mp-damage"><?php
						echo $opt( 'unknown', 'עדיין לא ברור' ) . $opt( 'temporary', 'נזק חולף' ) . $opt( 'ongoing', 'טיפול מתמשך' ) . $opt( 'disability', 'נכות' ) . $opt( 'function', 'ירידה בתפקוד' ) . $opt( 'economic', 'הפסד כלכלי' ) . $opt( 'death', 'פטירה' ) . $opt( 'none', 'לא נגרם נזק גופני ידוע' ); // phpcs:ignore
					?></select></div>

				<div class="jt-mp__q"><label>5. אילו מסמכים כבר יש בידיכם? (אפשר לסמן כמה)</label>
					<div class="jt-mp__checks" id="mp-docs">
						<label><input type="checkbox" value="summary"> סיכום אשפוז</label>
						<label><input type="checkbox" value="full"> תיק רפואי מלא</label>
						<label><input type="checkbox" value="tests"> בדיקות</label>
						<label><input type="checkbox" value="imaging"> הדמיה</label>
						<label><input type="checkbox" value="consent"> טופס הסכמה</label>
						<label><input type="checkbox" value="opinion"> חוות דעת</label>
						<label><input type="checkbox" value="none"> אין מסמכים</label>
					</div></div>

				<div class="jt-mp__q"><label for="mp-claimant">6. מי הנפגע?</label>
					<select id="mp-claimant"><?php
						echo $opt( 'patient', 'המטופל עצמו' ) . $opt( 'parent', 'הורה של הנפגע' ) . $opt( 'heir', 'יורש' ) . $opt( 'dependent', 'תלוי' ); // phpcs:ignore
					?></select>
					<label class="jt-mp__birth" for="mp-birth">תאריך לידה של הנפגע (לבדיקת קטינות)</label>
					<input type="month" id="mp-birth">
				</div>

				<button type="submit" id="mp-go">קבלת הכיוון</button>
				<p class="jt-mp__priv">המידע נשאר בדפדפן שלכם ומשמש רק לחישוב. אין להזין שם, טלפון או מספר זהות בשלב זה.</p>
			</form>

			<div id="mp-result" hidden aria-live="polite"></div>
		</div>
	</div>
	<?php
	return (string) ob_get_clean();
} );

add_action( 'wp_head', function () {
	if ( ! justice_mp_on_page() ) {
		return;
	}

	echo '<style id="jt-mp-css">'
		. '.jt-mp{--mp-navy:#14213d;--mp-band:#1b2f55;--mp-gold:#e7c765;--mp-ink:#1d2740;--mp-mut:#5b6780;--mp-line:#dbe3f0;--mp-teal:#2f6f6a;--mp-amber:#b5892b;--mp-red:#a2402f;background:#fff;border:1px solid var(--mp-line);border-radius:18px;margin:30px 0;overflow:hidden;box-shadow:0 18px 44px -30px rgba(10,18,38,.45)}'
		. '.jt-mp__head{display:flex;gap:14px;align-items:flex-start;background:linear-gradient(120deg,var(--mp-navy),var(--mp-band) 70%);padding:20px 24px}'
		. '.jt-mp__glyph{color:var(--mp-gold);flex:none;margin-top:2px}'
		. '.jt-mp__h{font-size:20px;color:#fff;margin:0;letter-spacing:-.01em}'
		. '.jt-mp__sub{font-size:13.5px;color:#c6d0e4;margin:5px 0 0;line-height:1.55;max-width:66ch}'
		. '.jt-mp__body{padding:20px 24px 24px;background:#f7f9fd}'
		. '.jt-mp__q{margin:0 0 15px}'
		. '.jt-mp__q>label{display:block;font-size:13.5px;font-weight:800;color:var(--mp-ink);margin:0 0 6px}'
		. '.jt-mp__q select,.jt-mp__q input[type=month]{width:100%;border:1px solid #cbd6e8;border-radius:10px;padding:10px 12px;font:inherit;font-size:14.5px;color:var(--mp-ink);background:#fff}'
		. '.jt-mp__q select:focus,.jt-mp__q input:focus{outline:none;border-color:var(--mp-gold);box-shadow:0 0 0 3px rgba(231,199,101,.35)}'
		. '.jt-mp__inline{display:flex;align-items:center;gap:7px;font-size:13.5px;color:var(--mp-mut);font-weight:600;margin:8px 0 0}'
		. '.jt-mp__birth{display:block;font-size:12.5px;font-weight:600;color:var(--mp-mut);margin:8px 0 4px}'
		. '.jt-mp__checks{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px}'
		. '.jt-mp__checks label{display:flex;align-items:center;gap:7px;font-size:13.5px;color:var(--mp-ink);background:#fff;border:1px solid #cbd6e8;border-radius:9px;padding:8px 10px;cursor:pointer}'
		. '#mp-go{background:linear-gradient(90deg,var(--mp-gold),#d9b654);color:var(--mp-navy);border:0;border-radius:12px;padding:13px 28px;font-weight:800;font-size:15.5px;cursor:pointer;width:100%;transition:transform .12s ease}'
		. '#mp-go:hover{transform:translateY(-1px)}'
		. '.jt-mp__priv{font-size:12px;color:var(--mp-mut);margin:10px 0 0;text-align:center}'
		. '#mp-result{margin:4px 0 0}'
		. '.jt-mp__dir{display:flex;gap:12px;align-items:flex-start;border-radius:14px;padding:16px 18px;margin:0 0 16px;border:1px solid}'
		. '.jt-mp__dir svg{flex:none;margin-top:2px}'
		. '.jt-mp__dir--go{background:#eef6f4;border-color:#a9cdc7;color:#123f3a}'
		. '.jt-mp__dir--info{background:#fbf4e6;border-color:#e6cd8f;color:#6b4e12}'
		. '.jt-mp__dir--none{background:#f3f4f6;border-color:#cfd6e0;color:#2a3446}'
		. '.jt-mp__dir b{display:block;font-size:16px;margin:0 0 3px}'
		. '.jt-mp__dir span{font-size:13.5px;line-height:1.55}'
		. '.jt-mp__lim{background:#fff;border:1px solid var(--mp-line);border-inline-start:4px solid var(--mp-gold);border-radius:12px;padding:14px 16px;margin:0 0 16px}'
		. '.jt-mp__lim h4{margin:0 0 4px;font-size:14.5px;color:var(--mp-ink)}'
		. '.jt-mp__lim .mp-date{font-size:19px;font-weight:800;color:var(--mp-navy);font-variant-numeric:tabular-nums}'
		. '.jt-mp__conf{display:inline-block;font-size:12px;font-weight:800;border-radius:999px;padding:2px 10px;margin-inline-start:8px}'
		. '.jt-mp__conf--low{background:#f6e0dc;color:#7a2e21}.jt-mp__conf--mid{background:#f6ecd2;color:#6b4e12}.jt-mp__conf--hi{background:#dff0e6;color:#14532d}'
		. '.jt-mp__assume{font-size:12.5px;color:var(--mp-mut);margin:8px 0 0;line-height:1.6}'
		. '.jt-mp__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin:0 0 16px}'
		. '.jt-mp__el{background:#fff;border:1px solid var(--mp-line);border-radius:12px;padding:13px 15px}'
		. '.jt-mp__el .mp-el-h{display:flex;align-items:center;gap:6px;font-weight:800;font-size:13.5px;color:var(--mp-ink);margin:0 0 4px}'
		. '.jt-mp__el .mp-tag{font-size:11.5px;font-weight:800;border-radius:6px;padding:1px 7px}'
		. '.mp-tag--ok{background:#dff0e6;color:#14532d}.mp-tag--part{background:#f6ecd2;color:#6b4e12}.mp-tag--no{background:#f3f4f6;color:#55607a}'
		. '.jt-mp__el p{font-size:12.5px;color:var(--mp-mut);margin:0;line-height:1.5}'
		. '.jt-mp__sec{background:#fff;border:1px solid var(--mp-line);border-radius:12px;padding:14px 16px;margin:0 0 14px}'
		. '.jt-mp__sec h4{margin:0 0 8px;font-size:14.5px;color:var(--mp-ink)}'
		. '.jt-mp__sec ul{margin:0;padding-inline-start:20px;font-size:13.5px;color:#3b465e;line-height:1.75}'
		. '.jt-mp__sec--avoid{border-inline-start:4px solid var(--mp-red)}'
		. '.jt-mp__cta{display:flex;flex-wrap:wrap;gap:10px;margin:4px 0 0}'
		. '.jt-mp__cta a{border-radius:12px;padding:12px 20px;font-weight:800;font-size:14.5px;text-decoration:none}'
		. '.jt-mp__cta .mp-primary{background:var(--mp-navy);color:var(--mp-gold)}'
		. '.jt-mp__cta .mp-second{background:#fff;border:1px solid #cbd6e8;color:var(--mp-navy)}'
		. '.jt-mp__disc{font-size:12px;color:var(--mp-mut);margin:14px 0 0;line-height:1.5}'
		. '@media(max-width:560px){.jt-mp__head{padding:16px}.jt-mp__body{padding:14px 16px 18px}}'
		. '@media(prefers-reduced-motion:reduce){#mp-go{transition:none}#mp-go:hover{transform:none}}'
		. '</style>';
}, 8 );

add_action( 'wp_footer', function () {
	if ( ! justice_mp_on_page() ) {
		return;
	}

	$ai   = esc_js( home_url( '/legal-ai-desk/#doc' ) );
	$law  = esc_js( home_url( '/medical-malpractice-lawyer/' ) );
	?>
	<script id="jt-mp-js">
	(function () {
		var root = document.getElementById('jt-mp');
		if (!root) { return; }
		var form = document.getElementById('jt-mp-form');
		var out = document.getElementById('mp-result');

		function parseMonth(v) { if (!v) { return null; } var p = v.split('-'); return { y: +p[0], m: +p[1] }; }
		function addYears(d, n) { return { y: d.y + n, m: d.m }; }
		function fmt(d) { return (d.m < 10 ? '0' + d.m : d.m) + '/' + d.y; }
		function cmp(a, b) { return a.y !== b.y ? a.y - b.y : a.m - b.m; }
		var ICON = {
			go: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M8 12.2l2.6 2.6L16 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
			info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M12 11v5M12 8h.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
			none: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7"/><path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
		};

		var DOCS = {
			birth: ['ניטור עוברי מלא', 'גיליון לידה', 'דוח ניתוח קיסרי אם היה', 'גיליון הרדמה', 'תיק היילוד וציוני אפגר', 'מכתבי שחרור של האם והיילוד'],
			diagnosis: ['הפניות לבדיקות', 'תוצאות בדיקות מעבדה', 'קובצי הדמיה מקוריים ולא רק פענוח', 'סיכומי ביקור', 'מעקב אחר תוצאות חריגות'],
			surgery: ['דוח ניתוח', 'גיליון הרדמה', 'טופס הסכמה מדעת', 'מדדים וניטור', 'סיכום אשפוז'],
			dental: ['צילומים מקוריים לפני ואחרי', 'תוכנית טיפול', 'כרטיס טיפולים', 'טופסי הסכמה', 'חשבוניות ותיעוד טיפול תיקון'],
			aesthetic: ['תמונות לפני ואחרי עם תאריכים', 'תכנון ההליך', 'טופס הסכמה מדעת', 'דוח פעולה', 'תיעוד סיבוכים וביקורות'],
			treatment: ['רשומת מרשמים ומינונים', 'סיכום ביקור', 'תוצאות מעקב', 'תיעוד תגובה לטיפול'],
			consent: ['טופס ההסכמה שנחתם', 'חומרי הסבר שנמסרו', 'רישום השיחה בתיק', 'תיעוד החלופות שהוצגו'],
			other: ['סיכום אשפוז או ביקור', 'תיק רפואי מלא', 'תוצאות בדיקות והדמיה']
		};

		function limitation(ev) {
			var treat = parseMonth(document.getElementById('mp-treat').value);
			var disc = parseMonth(document.getElementById('mp-discover').value);
			var birth = parseMonth(document.getElementById('mp-birth').value);
			var claimant = document.getElementById('mp-claimant').value;
			var abroad = document.getElementById('mp-abroad').checked;
			var A = [];

			if (abroad) {
				return { html: 'הכלי בנוי לדין הישראלי. בטיפול בחו"ל נדרשת בדיקה נפרדת של סמכות השיפוט והדין החל.', conf: '', cls: 'low', assume: [] };
			}
			if (!treat) {
				return { html: 'לא ניתן להעריך מועד בלי תאריך טיפול. הזינו לפחות חודש ושנה של הטיפול.', conf: 'ודאות נמוכה', cls: 'low', assume: [] };
			}

			// Minor claimant (the patient), event before 18: the minor's own
			// claim clock does not run until 18, so the estimate is birth + 25.
			var minorNote = null;
			if (claimant === 'patient' && birth) {
				var ageAtEvent = (treat.y - birth.y) + (treat.m - birth.m) / 12;
				if (ageAtEvent < 18) {
					var to25 = addYears(birth, 25);
					A.push('הנפגע היה קטין במועד האירוע, לכן החישוב מתייחס לתביעת הקטין ומגיע עד גיל 25 בקירוב.');
					A.push('מועד זה אינו חל אוטומטית על תביעה עצמאית של הורה, שנבדקת לפי ההורה.');
					return { html: 'עד <span class="mp-date">' + fmt(to25) + '</span> בקירוב, לתביעת הקטין', conf: 'ודאות בינונית', cls: 'mid', assume: A };
				}
			}

			// Adult: base is event + 7 years. If a later discovery date was
			// given, show discovery + 7 against a 10-year long-stop from the
			// event, and warn on the earlier of the two.
			var base = addYears(treat, 7);
			A.push('חושב מתאריך הטיפול בתוספת שבע שנים, כמועד מוקדם ושמרני.');
			var shown = base, conf = 'ודאות בינונית', cls = 'mid';

			if (disc && cmp(disc, treat) > 0) {
				var discPlus = addYears(disc, 7);
				var longStop = addYears(treat, 10);
				var late = cmp(discPlus, longStop) < 0 ? discPlus : longStop;
				A.push('הזנתם מועד גילוי מאוחר. מוצג גם מסלול גילוי, בכפוף למחסום אפשרי של עשר שנים ממועד הנזק.');
				A.push('נבחר המועד המוקדם מבין בסיס שבע השנים לבין מסלול הגילוי, כאזהרה.');
				shown = cmp(base, late) < 0 ? base : late;
				conf = 'ודאות נמוכה';
				cls = 'low';
			}

			// Flag the special tolling window rather than computing it.
			if ((shown.y === 2023 || shown.y === 2024 || shown.y === 2025 || shown.y === 2026 || (treat.y <= 2024 && base.y >= 2023))) {
				A.push('ייתכן שחל הסדר מיוחד בדבר אי-מניית תקופה סביב סוף 2023 ותחילת 2024. דרושה בדיקה פרטנית של תחולתו על המקרה.');
			}

			return { html: 'המועד המוקדם שעלול לחול הוא סביב <span class="mp-date">' + fmt(shown) + '</span>', conf: conf, cls: cls, assume: A };
		}

		function fourElements(ev, damage, docs) {
			function el(name, tag, tagCls, note) {
				return '<div class="jt-mp__el"><div class="mp-el-h">' + name + ' <span class="mp-tag ' + tagCls + '">' + tag + '</span></div><p>' + note + '</p></div>';
			}
			var where = document.getElementById('mp-where').value;
			var duty = (where && where !== 'other')
				? el('חובת זהירות', 'קיים כיוון', 'mp-tag--ok', 'תואר גורם מטפל, כך שסביר שקיימת חובת זהירות. הזהות המדויקת של הנתבע נקבעת לפי הרשומה.')
				: el('חובת זהירות', 'לא ברור', 'mp-tag--part', 'צריך לזהות מי בדיוק טיפל ובאיזה מוסד, כדי לבסס חובת זהירות ולזהות נתבע.');

			var breach = ev
				? el('הפרת החובה', 'טענה לבדיקה', 'mp-tag--part', 'תיארתם סוג אירוע. האם הייתה סטייה מרמת הטיפול הסבירה נבדק על ידי מומחה לפי הרשומה והמועד.')
				: el('הפרת החובה', 'לא זוהתה', 'mp-tag--no', 'לא נבחר סוג אירוע קונקרטי. בלי טענה שאפשר לבדוק, אין יסוד הפרה.');

			var dmgOk = ['disability', 'death', 'function', 'ongoing', 'economic'].indexOf(damage) > -1;
			var damageEl = damage === 'none'
				? el('נזק', 'לא זוהה', 'mp-tag--no', 'ללא נזק בר תביעה בדרך כלל אין עילת נזיקין, גם אם הייתה טעות.')
				: (dmgOk
					? el('נזק', 'נטען', 'mp-tag--ok', 'תואר נזק אפשרי. עוצמתו וראשי הנזק נקבעים לפי תיעוד רפואי ותפקודי.')
					: el('נזק', 'דורש תיעוד', 'mp-tag--part', 'הנזק עדיין לא מוגדר. נדרש תיעוד רפואי כדי לבסס יסוד נזק.'));

			var caus = (ev && damage !== 'none')
				? el('קשר סיבתי', 'דורש מומחה', 'mp-tag--part', 'הקשר בין האירוע לנזק נבחן בחוות דעת רפואית, לא לפי סמיכות זמנים בלבד.')
				: el('קשר סיבתי', 'לא נבדק', 'mp-tag--no', 'בלי אירוע ונזק מוגדרים אי אפשר לבחון קשר סיבתי.');

			return '<div class="jt-mp__grid">' + duty + breach + damageEl + caus + '</div>';
		}

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			var ev = document.getElementById('mp-event').value;
			var damage = document.getElementById('mp-damage').value;
			var docs = Array.prototype.map.call(document.querySelectorAll('#mp-docs input:checked'), function (c) { return c.value; });

			// Direction
			var dir;
			if (damage === 'none') {
				dir = { cls: 'none', ic: ICON.none, h: 'לא זוהתה בשלב זה תביעת נזק טיפוסית', s: 'לא תואר נזק בר תביעה. אפשר עדיין לפנות בתלונה מערכתית, אך זה מסלול נפרד מתביעת פיצויים.' };
			} else if (!ev || !document.getElementById('mp-treat').value || docs.indexOf('none') > -1 || docs.length === 0) {
				dir = { cls: 'info', ic: ICON.info, h: 'נדרש מידע נוסף', s: 'חסרים סוג אירוע, תאריך או מסמכים. השלב הבא הוא לאסוף את הרשומה המלאה ולסמן מה חסר.' };
			} else {
				dir = { cls: 'go', ic: ICON.go, h: 'יש בסיס לבדיקה מקצועית', s: 'תיארתם טיפול, טענה אפשרית ונזק. הקשר הסיבתי עדיין דורש בדיקת מומחה, אך שווה להעביר את החומר לבדיקה.' };
			}

			var lim = limitation(ev);
			var confHtml = lim.conf ? '<span class="jt-mp__conf jt-mp__conf--' + lim.cls + '">' + lim.conf + '</span>' : '';
			var assumeHtml = lim.assume.length ? '<p class="jt-mp__assume">ההנחות בחישוב: ' + lim.assume.join(' ') + '</p>' : '';

			var docList = (DOCS[ev] || DOCS.other).map(function (d) { return '<li>' + d + '</li>'; }).join('');

			var steps = [
				'רשמו ציר זמן בעמוד אחד: תסמין ראשון, כל ביקור, כל בדיקה, מועד ההחמרה ומועד גילוי הנזק.',
				'בקשו את הרשומה הרפואית המלאה מכל מוסד, ולא רק סיכום שחרור. שמרו עותק ותאריך קבלה.',
				lim.cls === 'low' ? 'בדקו את מועד ההתיישנות עם עורך דין בהקדם, כי המועד עלול להיות קרוב.' : 'העבירו את הציר והמסמכים לבדיקה ראשונית לפני חיפוש מומחה.'
			];

			var html = '<div class="jt-mp__dir jt-mp__dir--' + dir.cls + '">' + dir.ic + '<div><b>' + dir.h + '</b><span>' + dir.s + '</span></div></div>'
				+ '<div class="jt-mp__lim"><h4>מועד התיישנות משוער' + confHtml + '</h4><div>' + lim.html + '</div>' + assumeHtml
				+ '<p class="jt-mp__assume">זהו אומדן זהירות בלבד. מועד ההתיישנות המדויק נקבע רק לאחר עיון ברשומה, ולעולם אין להסתמך עליו בלי בדיקת עורך דין.</p></div>'
				+ '<h4 style="margin:0 0 8px;color:#14213d;font-size:15px">מפת ארבעת יסודות העילה</h4>'
				+ fourElements(ev, damage, docs)
				+ '<div class="jt-mp__sec"><h4>מסמכים שכדאי לאסוף עכשיו</h4><ul>' + docList + '</ul></div>'
				+ '<div class="jt-mp__sec"><h4>שלוש הפעולות הקרובות</h4><ul>' + steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul></div>'
				+ '<div class="jt-mp__sec jt-mp__sec--avoid"><h4>מה לא לעשות</h4><ul><li>לא להמתין לתשובת תלונה במקום לבדוק את מועד ההתיישנות.</li><li>לא למסור את העותק היחיד של מסמך מקורי.</li><li>לא לערוך או למחוק קובצי הדמיה או תכתובות.</li><li>לא להניח שטופס הסכמה חתום סוגר את הבדיקה.</li></ul></div>'
				+ '<div class="jt-mp__cta"><a class="mp-primary" href="' + '<?php echo $ai; // phpcs:ignore ?>' + '">בדיקת מסמך רפואי בעוזר ה-AI</a><a class="mp-second" href="' + '<?php echo $law; // phpcs:ignore ?>' + '">מעבר לעורכי דין לרשלנות רפואית</a></div>'
				+ '<p class="jt-mp__disc">התוצאה היא הערכת כיוון המבוססת על התשובות שלכם, לפי כללי חוק ההתיישנות, פקודת הנזיקין וחוק זכויות החולה. היא אינה חוות דעת רפואית או משפטית ואינה קובעת שהייתה רשלנות. בכל מקרה אישי נדרשת בדיקה של הרשומה בידי עורך דין ומומחה רפואי.</p>';

			out.hidden = false;
			out.innerHTML = html;
			out.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	})();
	</script>
	<?php
}, 24 );
