<?php
/**
 * Legal calculators suite: the highest-intent traffic asset class.
 *
 * Four calculators built ONLY on stable statutory formulas (severance,
 * recuperation pay, annual leave, small claims fee). Rates that update
 * yearly live in options with a visible "as of" date so nothing goes
 * silently stale; the monitor warns when a dated rate ages past a year.
 * Every calculator ends in a WhatsApp CTA that carries the computed result,
 * so the lead arrives pre-qualified. Pages auto-create with English slugs.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_calc_registry(): array {
	return array(
		'severance-pay-calculator' => array(
			'title'    => 'מחשבון פיצויי פיטורים: חישוב לפי שכר וותק',
			'seo'      => 'מחשבון פיצויי פיטורים: חישוב מהיר לפי חוק | Jus-Tice',
			'h1'       => 'מחשבון פיצויי פיטורים',
			'intro'    => '<p><strong>מחשבון פיצויי פיטורים</strong> מחשב את הפיצוי הבסיסי לפי הנוסחה שבחוק פיצויי פיטורים: שכר חודשי אחרון כפול שנות הוותק, כולל חלקי שנה. התוצאה היא נקודת פתיחה לבדיקה, לא תחליף לבדיקת תלושים מלאה: רכיבי שכר, סעיף 14, השלמות והפרשות משנים את התמונה.</p>',
			'fields'   => array(
				array( 'id' => 'salary', 'label' => 'שכר חודשי אחרון (ברוטו)', 'type' => 'number', 'min' => 1 ),
				array( 'id' => 'years', 'label' => 'שנות ותק', 'type' => 'number', 'min' => 0, 'step' => '0.1' ),
			),
			'formula'  => 'var r=salary*years; out="פיצויי פיטורים משוערים: "+fmt(r)+" ₪";',
			'faq'      => array(
				array( 'q' => 'איך מחושבים פיצויי פיטורים לפי החוק', 'a' => 'הנוסחה הבסיסית היא שכר חודשי אחרון כפול מספר שנות העבודה אצל אותו מעסיק, כולל חלק יחסי עבור חלקי שנה. רכיבי השכר הקובעים הם שכר היסוד ותוספות קבועות.' ),
				array( 'q' => 'מה זה סעיף 14 ואיך הוא משפיע', 'a' => 'כשחל סעיף 14 לחוק, ההפרשות החודשיות לפיצויים באות במקום חלק מהפיצוי או כולו. במקרה כזה הסכום שנצבר בקופה הוא הפיצוי, גם אם הוא שונה מתוצאת הנוסחה.' ),
				array( 'q' => 'האם מגיעים פיצויים גם בהתפטרות', 'a' => 'ככלל הזכות קמה בפיטורים, אך החוק מכיר במצבים של התפטרות בדין מפוטר, למשל הרעת תנאים מוחשית או מעבר מקום מגורים בנסיבות מסוימות. כל מקרה נבחן לגופו.' ),
			),
			'links'    => array( array( 'a' => 'עורך דין דיני עבודה', 'u' => '/israeli-labor-law/' ) ),
			'wa'       => 'שלום, חישבתי במחשבון פיצויי הפיטורים ואשמח לבדיקה של עורך דין דיני עבודה.',
		),
		'havraa-pay-calculator' => array(
			'title'    => 'מחשבון דמי הבראה: כמה ימים ומה הסכום',
			'seo'      => 'מחשבון דמי הבראה: ימי זכאות וסכום לפי ותק | Jus-Tice',
			'h1'       => 'מחשבון דמי הבראה',
			'intro'    => '<p><strong>מחשבון דמי הבראה</strong> מחשב את מספר ימי ההבראה לפי הוותק במגזר הפרטי ואת הסכום לפי תעריף היום המעודכן. עובד זכאי לדמי הבראה אחרי שנת עבודה ראשונה, והתעריף מתעדכן מעת לעת בצו הרחבה.</p>',
			'fields'   => array(
				array( 'id' => 'years', 'label' => 'שנות ותק (שנים מלאות)', 'type' => 'number', 'min' => 0 ),
				array( 'id' => 'part', 'label' => 'אחוז משרה', 'type' => 'number', 'min' => 1, 'max' => 100, 'value' => 100 ),
			),
			'formula'  => 'var d=years<1?0:(years<2?5:(years<4?6:(years<11?7:(years<16?8:(years<20?9:10)))));var r=d*RATE*(part/100);out=years<1?"הזכאות קמה אחרי שנת עבודה מלאה":"ימי הבראה: "+d+" | סכום משוער: "+fmt(r)+" ₪ (לפי תעריף "+RATE+" ₪ ליום, "+RATE_AS_OF+")";',
			'faq'      => array(
				array( 'q' => 'כמה ימי הבראה מגיעים לפי ותק', 'a' => 'במגזר הפרטי: 5 ימים בשנה הראשונה, 6 ימים בשנים השנייה והשלישית, 7 ימים בשנים הרביעית עד העשירית, 8 ימים בשנים 11 עד 15, 9 ימים בשנים 16 עד 19, ו-10 ימים משנה 20 ואילך.' ),
				array( 'q' => 'מתי משולמים דמי הבראה', 'a' => 'בדרך כלל בתשלום שנתי אחד בחודשי הקיץ, אך אפשר לשלם גם בפריסה חודשית אם הדבר נקבע בהסכם. עובד שסיים עבודה זכאי לחלק היחסי.' ),
				array( 'q' => 'מה התעריף ליום הבראה', 'a' => 'התעריף במגזר הפרטי נקבע בצו הרחבה ומתעדכן מעת לעת. הסכום במחשבון מוצג עם תאריך העדכון שלו, וכדאי לוודא מול התעריף העדכני במועד התשלום.' ),
			),
			'links'    => array( array( 'a' => 'עורך דין דיני עבודה', 'u' => '/israeli-labor-law/' ) ),
			'wa'       => 'שלום, חישבתי דמי הבראה במחשבון ואשמח לבדיקת זכאות מלאה.',
		),
		'annual-leave-calculator' => array(
			'title'    => 'מחשבון ימי חופשה שנתית לפי ותק',
			'seo'      => 'מחשבון ימי חופשה שנתית: הזכאות לפי חוק | Jus-Tice',
			'h1'       => 'מחשבון ימי חופשה שנתית',
			'intro'    => '<p><strong>מחשבון ימי החופשה</strong> מציג את הזכאות השנתית לפי חוק חופשה שנתית לעובד במשרה מלאה, שישה ימי עבודה בשבוע או חמישה. הזכאות גדלה עם הוותק, וימי החופשה שלא נוצלו נבחנים לפי כללי הצבירה בחוק.</p>',
			'fields'   => array(
				array( 'id' => 'years', 'label' => 'שנות ותק', 'type' => 'number', 'min' => 1 ),
				array( 'id' => 'week', 'label' => 'ימי עבודה בשבוע', 'type' => 'select', 'options' => array( '5' => '5 ימים', '6' => '6 ימים' ) ),
			),
			'formula'  => 'var t6=[14,14,14,14,14,16,18,19,20,21,22,23,24,25,26,27,28];var t5=[12,12,12,12,12,14,15,16,17,18,19,20,20,20,20,20,20];var i=Math.min(Math.max(Math.floor(years),1),17)-1;var d=(week=="6"?t6[i]:t5[i]);out="ימי הזכאות השנתית: "+d+" ימים (ברוטו, כולל ימי מנוחה לפי שיטת החישוב)";',
			'faq'      => array(
				array( 'q' => 'כמה ימי חופשה מגיעים בשנים הראשונות', 'a' => 'בחמש השנים הראשונות הזכאות לפי החוק היא 14 ימים ברוטו לעובד שישה ימים בשבוע, שהם 12 ימי עבודה בפועל לעובד חמישה ימים. מהשנה השישית הזכאות עולה בהדרגה.' ),
				array( 'q' => 'האם אפשר לצבור ימי חופשה', 'a' => 'החוק מתיר ניצול של לפחות שבעה ימים רצופים בשנה ומאפשר בהסכמה לצרף את היתרה לשתי השנים הבאות. מדיניות צבירה רחבה יותר נקבעת אצל המעסיק.' ),
				array( 'q' => 'מה קורה עם חופשה שלא נוצלה בסיום עבודה', 'a' => 'בסיום יחסי העבודה משולם פדיון חופשה עבור הימים שנצברו ולא נוצלו, לפי ערך יום עבודה של העובד.' ),
			),
			'links'    => array( array( 'a' => 'עורך דין דיני עבודה', 'u' => '/israeli-labor-law/' ) ),
			'wa'       => 'שלום, בדקתי זכאות ימי חופשה במחשבון ואשמח לבדיקה של עורך דין.',
		),
		'small-claims-fee-calculator' => array(
			'title'    => 'מחשבון אגרת תביעות קטנות',
			'seo'      => 'מחשבון אגרת תביעות קטנות: כמה משלמים על הגשה | Jus-Tice',
			'h1'       => 'מחשבון אגרת תביעות קטנות',
			'intro'    => '<p><strong>מחשבון אגרת התביעות הקטנות</strong> מחשב את האגרה לפי אחוז מסכום התביעה עם רצפת מינימום, כפי שנהוג בבתי המשפט לתביעות קטנות. הסכומים מוצגים עם תאריך העדכון שלהם.</p>',
			'fields'   => array(
				array( 'id' => 'amount', 'label' => 'סכום התביעה (₪)', 'type' => 'number', 'min' => 1 ),
			),
			'formula'  => 'var r=Math.max(amount*FEE_PCT/100,FEE_MIN);out="אגרה משוערת: "+fmt(r)+" ₪ ("+FEE_PCT+"% מסכום התביעה, מינימום "+FEE_MIN+" ₪, "+RATE_AS_OF+")";',
			'faq'      => array(
				array( 'q' => 'כמה עולה להגיש תביעה קטנה', 'a' => 'האגרה נגזרת כאחוז מסכום התביעה עם סכום מינימום, לפי תקנות האגרות. את הסכום המדויק מציג גם מחשבון בית המשפט בעת ההגשה המקוונת.' ),
				array( 'q' => 'מה תקרת הסכום בתביעות קטנות', 'a' => 'תקרת התביעה בבית משפט לתביעות קטנות מתעדכנת מעת לעת. תביעה מעל התקרה מוגשת לבית משפט השלום בהליך רגיל.' ),
				array( 'q' => 'האם צריך עורך דין בתביעה קטנה', 'a' => 'ייצוג עורך דין בדיון עצמו אינו מותר בתביעות קטנות אלא ברשות מיוחדת, אבל ייעוץ מקדים על ניסוח כתב התביעה והראיות מותר ויכול לשפר משמעותית את התיק.' ),
			),
			'links'    => array( array( 'a' => 'המדריך לתביעות קטנות', 'u' => '/small-claims/' ) ),
			'wa'       => 'שלום, אני מתכונן לתביעה קטנה ואשמח לייעוץ מקדים על כתב התביעה.',
		),
	);
}

function justice_calc_rates(): array {
	return array(
		'RATE'       => (float) get_option( 'justice_calc_havraa_rate', 418 ),
		'RATE_AS_OF' => (string) get_option( 'justice_calc_rates_asof', 'מעודכן ל-2023, ניתן לעדכון בהגדרות' ),
		'FEE_PCT'    => (float) get_option( 'justice_calc_fee_pct', 1 ),
		'FEE_MIN'    => (float) get_option( 'justice_calc_fee_min', 50 ),
	);
}

// Auto-create the pages + index once.
add_action( 'init', function () {
	if ( get_option( 'justice_calc_pages_v1' ) ) {
		return;
	}

	foreach ( justice_calc_registry() as $slug => $calc ) {
		if ( ! get_page_by_path( $slug, OBJECT, 'page' ) ) {
			$pid = wp_insert_post( array(
				'post_type'    => 'page',
				'post_status'  => 'publish',
				'post_title'   => $calc['title'],
				'post_name'    => $slug,
				'post_content' => '[justice_calc id="' . $slug . '"]',
			) );
			if ( $pid && ! is_wp_error( $pid ) ) {
				update_post_meta( $pid, 'seo_title', $calc['seo'] );
			}
		}
	}

	if ( ! get_page_by_path( 'legal-calculators', OBJECT, 'page' ) ) {
		$pid = wp_insert_post( array(
			'post_type'    => 'page',
			'post_status'  => 'publish',
			'post_title'   => 'מחשבונים משפטיים: זכויות עבודה ואגרות',
			'post_name'    => 'legal-calculators',
			'post_content' => '[justice_calc_index]',
		) );
		if ( $pid && ! is_wp_error( $pid ) ) {
			update_post_meta( $pid, 'seo_title', 'מחשבונים משפטיים: פיצויים, הבראה, חופשה ואגרות | Jus-Tice' );
		}
	}

	update_option( 'justice_calc_pages_v1', 1 );
} );

add_shortcode( 'justice_calc_index', function () {
	$out = '<div class="jt-calc-grid">';
	foreach ( justice_calc_registry() as $slug => $calc ) {
		$out .= '<a class="jt-calc-tile" href="' . esc_url( home_url( '/' . $slug . '/' ) ) . '"><strong>' . esc_html( $calc['h1'] ) . '</strong><span>חישוב מיידי, בלי הרשמה</span></a>';
	}
	return $out . '</div><style>.jt-calc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px;margin:20px 0}.jt-calc-tile{display:block;border:1.5px solid transparent;border-radius:16px;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;padding:18px;box-shadow:0 12px 28px -18px rgba(13,23,54,.3);text-decoration:none}.jt-calc-tile strong{display:block;color:#14213d;font-size:16.5px;margin-bottom:4px}.jt-calc-tile span{color:#6a7285;font-size:13px}</style>';
} );

add_shortcode( 'justice_calc', function ( $atts ) {
	$atts = shortcode_atts( array( 'id' => '' ), $atts );
	$reg  = justice_calc_registry();

	if ( ! isset( $reg[ $atts['id'] ] ) ) {
		return '';
	}

	$calc  = $reg[ $atts['id'] ];
	$rates = justice_calc_rates();

	$fields = '';
	foreach ( $calc['fields'] as $f ) {
		$fields .= '<p class="jt-calc__field"><label for="jtc-' . esc_attr( $f['id'] ) . '">' . esc_html( $f['label'] ) . '</label>';
		if ( 'select' === $f['type'] ) {
			$fields .= '<select id="jtc-' . esc_attr( $f['id'] ) . '">';
			foreach ( $f['options'] as $v => $l ) {
				$fields .= '<option value="' . esc_attr( $v ) . '">' . esc_html( $l ) . '</option>';
			}
			$fields .= '</select>';
		} else {
			$fields .= '<input id="jtc-' . esc_attr( $f['id'] ) . '" type="number" inputmode="decimal" min="' . esc_attr( (string) ( $f['min'] ?? 0 ) ) . '"' . ( isset( $f['step'] ) ? ' step="' . esc_attr( $f['step'] ) . '"' : '' ) . ( isset( $f['value'] ) ? ' value="' . esc_attr( (string) $f['value'] ) . '"' : '' ) . '>';
		}
		$fields .= '</p>';
	}

	$vars = '';
	foreach ( $calc['fields'] as $f ) {
		$vars .= 'var ' . $f['id'] . '=' . ( 'select' === $f['type'] ? 'document.getElementById("jtc-' . $f['id'] . '").value;' : 'parseFloat(document.getElementById("jtc-' . $f['id'] . '").value)||0;' );
	}

	$consts = '';
	foreach ( $rates as $k => $v ) {
		$consts .= 'var ' . $k . '=' . ( is_numeric( $v ) ? $v : '"' . esc_js( (string) $v ) . '"' ) . ';';
	}

	$faq = '';
	foreach ( $calc['faq'] as $item ) {
		$faq .= '<h3>' . esc_html( $item['q'] ) . '</h3><p>' . esc_html( $item['a'] ) . '</p>';
	}

	$links = '';
	foreach ( $calc['links'] as $l ) {
		$links .= '<a href="' . esc_url( home_url( $l['u'] ) ) . '">' . esc_html( $l['a'] ) . '</a> ';
	}

	$wa_base = 'https://wa.me/972525101555?text=';

	return $calc['intro']
		. '<div class="jt-calc" id="jt-calc">'
		. $fields
		. '<button type="button" class="jt-calc__go" onclick="jtCalc()">חישוב</button>'
		. '<div class="jt-calc__result" id="jtc-result" hidden></div>'
		. '<a class="jt-calc__wa" id="jtc-wa" href="' . esc_url( $wa_base . rawurlencode( $calc['wa'] ) ) . '" target="_blank" rel="noopener nofollow" hidden>המשך עם עורך דין בוואטסאפ</a>'
		. '</div>'
		. '<script>function fmt(n){return Math.round(n).toLocaleString("he-IL")}function jtCalc(){' . $consts . $vars . 'var out="";' . $calc['formula']
		. 'var r=document.getElementById("jtc-result");r.textContent=out;r.hidden=false;var w=document.getElementById("jtc-wa");w.href="' . $wa_base . '"+encodeURIComponent(' . wp_json_encode( $calc['wa'] . ' תוצאת החישוב: ' ) . '+out);w.hidden=false;}</script>'
		. '<style>.jt-calc{border:1.5px solid transparent;border-radius:18px;background:linear-gradient(#fff,#fff) padding-box,linear-gradient(135deg,#e7c765,#14213d 75%) border-box;padding:22px;margin:20px 0;box-shadow:0 14px 32px -20px rgba(13,23,54,.32)}.jt-calc__field label{display:block;font-weight:700;color:#26324e;margin:0 0 5px}.jt-calc__field input,.jt-calc__field select{width:100%;max-width:340px;border:1px solid #ccd3e2;border-radius:10px;padding:10px;font-size:16px}.jt-calc__go{background:#14213d;color:#fff;border:0;border-radius:11px;padding:12px 30px;font-weight:800;font-size:15.5px;cursor:pointer;margin-top:6px}.jt-calc__result{margin-top:14px;background:#f7f2e7;border-radius:12px;padding:14px 16px;font-weight:800;color:#14213d;font-size:17px}.jt-calc__wa{display:inline-block;margin-top:12px;background:linear-gradient(180deg,#2ade70,#1fb355);color:#fff;border-radius:11px;padding:12px 22px;font-weight:800;text-decoration:none}</style>'
		. '<p class="jt-calc__note" style="color:#6a7285;font-size:13px">החישוב כללי ואינו ייעוץ משפטי. ' . esc_html( $rates['RATE_AS_OF'] ) . '.</p>'
		. '<h2>שאלות נפוצות</h2>' . $faq
		. '<p>להעמקה: ' . $links . '</p>';
} );
