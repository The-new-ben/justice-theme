<?php
/**
 * The divorce world (HAD-539): three apps that run a divorce end to end on /divorce-lawyer/, next to the five family
 * tools: the custody calendar builder, the child-support payment tracker (browser-only state) and the divorce roadmap.
 *
 * Shortcodes (placing them is an editor step, after the theme release):
 *   [justice_tool name="luach-shahut"]       the custody calendar: 2-2-3, week-week, 5-2-2-5, custom; holidays; a year of nights
 *   [justice_tool name="maakav-mezonot"]     the payment tracker: due days, CPI updates, arrears with linkage and interest, a demand letter
 *   [justice_tool name="mapat-gerushin"]     the roadmap: steps, fees, the statutory clock, progress saved in the browser
 *   [justice_tool name="gerushin" mode="lawyer" answer="only"]   the answer box alone (the instrument comes later on the page)
 * Every number is read from assets/data/justice-tools-registry.json (divorce_cost, divorce_agreement, child_support, cpi,
 * interest, property_balance) or from the snapshot the build renders from it.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_world_names(): array {
	return array( 'luach-shahut', 'maakav-mezonot', 'mapat-gerushin' );
}

/** The answer box (40-60 words): the direct answer, its numbers, their sections and the check date. */
function justice_tools_world_answer( string $name ): string {
	$reg     = justice_tools_registry();
	$checked = 'נבדק ' . esc_html( justice_tools_he_date( justice_tools_checked_on( $name ) ) ) . '.';
	$text    = '';
	if ( 'luach-shahut' === $name && ! empty( $reg['divorce_agreement'] ) ) {
		$snap = justice_tools_snapshot( 'luach-shahut' );
		$year = isset( $snap['total'] ) ? (int) $snap['total'] : 183;
		$text = '<strong>לוח זמני שהות</strong> הוא נספח להסכם הגירושין: מי לן אצל מי בכל לילה בשבועיים, ומי מקבל כל חג. '
			. 'אין בחוק נוסחה; בית המשפט מאשר הסדר רק אם הוא לטובת הילד (סעיף 24 לחוק הכשרות), ובלי הסכם ילדים עד גיל 6 אצל אמם אם אין סיבות מיוחדות (סעיף 25). '
			. 'בחלוקה שווה: <bdi>7</bdi> לילות מתוך 14, כ-<bdi>' . $year . '</bdi> בשנה. ' . $checked;
	}
	if ( 'maakav-mezonot' === $name && ! empty( $reg['child_support'] ) && ! empty( $reg['interest'] ) ) {
		$linked = justice_tools_latest_rate( $reg['interest']['linked'] );
		$text   = '<strong>מזונות שלא שולמו</strong> הם חוב פסוק: כל תשלום שאיחר צובר הפרשי הצמדה וריבית צמודה מיום הפירעון (סעיפים 1 ו-4א לחוק פסיקת ריבית והצמדה; <bdi>' . esc_html( (string) $linked['rate'] ) . '%</bdi> לשנה מ-' . esc_html( justice_tools_he_date( $linked['from'] ) ) . '). '
			. 'הסכום החודשי מתעדכן למדד בתדירות שבפסק הדין, כל <bdi>' . (int) $reg['child_support']['indexation']['every_months'] . '</bdi> חודשים בפסקי דין רבים. '
			. 'גובים דרך לשכת ההוצאה לפועל במסלול מזונות, או דרך ביטוח לאומי שמשלם במקום החייב עד הסכום שבתקנות. ' . $checked;
	}
	if ( 'mapat-gerushin' === $name && ! empty( $reg['divorce_cost'] ) ) {
		$d  = $reg['divorce_cost'];
		$rb = $d['rabbinical'];
		$fc = $d['family'];
		$ds = $d['disputes'];
		$text = '<strong>הליך גירושין</strong> מתחיל בבקשה ליישוב סכסוך (' . justice_tools_money( $rb['request'], 0 ) . ' בבית הדין הרבני, ' . justice_tools_money( $fc['request'], 0 ) . ' בבית המשפט לענייני משפחה), ואחריה עד <bdi>' . (int) $ds['meetings_max'] . '</bdi> פגישות ביחידת הסיוע בלי תשלום ו-<bdi>' . (int) $ds['stay_days'] . '</bdi> ימי עיכוב הליכים. '
			. 'בהסכמה מדלגים על זה: הסכם מאושר ב-' . justice_tools_money( $rb['agreement'], 0 ) . ' או ' . justice_tools_money( $fc['agreement'], 0 ) . ' מקבל תוקף פסק דין, הגט ניתן בבית הדין בלי אגרה, ותעודת גירושין עולה ' . justice_tools_money( $rb['certificate'], 0 ) . ' לכל צד. ' . $checked;
	}
	return '' === $text ? '' : '<div class="jtool-answer"><p>' . $text . '</p></div>';
}

/** The data stamp in the tool's header. */
function justice_tools_world_stamp( string $name ): string {
	$reg     = justice_tools_registry();
	$checked = 'נבדק ' . justice_tools_he_date( justice_tools_checked_on( $name ) );
	if ( 'luach-shahut' === $name ) {
		return 'סעיפים 24-25 לחוק הכשרות · הלוח העברי · ' . $checked;
	}
	if ( 'maakav-mezonot' === $name ) {
		$linked = justice_tools_latest_rate( $reg['interest']['linked'] ?? array() );
		return 'ריבית צמודה ' . $linked['rate'] . '% מ-' . justice_tools_he_date( (string) $linked['from'] ) . ' · מדד ' . justice_tools_he_month( (string) ( $reg['cpi']['latest_month'] ?? '' ) ) . ' · ' . $checked;
	}
	return 'חוק להסדר התדיינויות · אגרות בית הדין ובית המשפט · ' . $checked;
}

/** Official sources used by each app's result. */
function justice_tools_world_sources( string $name ): array {
	$reg = justice_tools_registry();
	$da  = $reg['divorce_agreement'];
	$cs  = $reg['child_support'];
	$dc  = $reg['divorce_cost'];
	if ( 'luach-shahut' === $name ) {
		return array(
			array( 'name' => $da['capacity_he'], 'url' => $da['capacity_url'], 'text' => 'סעיף 24: הסכם בין הורים על אפוטרופסות, החזקת הילדים והסדרי הקשר טעון אישור בית המשפט, לפי טובת הילד; סעיף 25: בלי הסכם, וחזקת הגיל הרך.' ),
			array( 'name' => 'בית המשפט העליון, בע"מ 919/15 (19.7.2017)', 'url' => justice_tools_family_case_url( $da['cases'], '919_15' ), 'text' => 'חלוקת זמני השהות בפועל היא נתון בחישוב מזונות הילדים (ההכרעה, ופסקאות 59-60).' ),
			array( 'name' => $cs['law']['he'], 'url' => $cs['law']['url'], 'text' => 'סעיף 13: שינוי בנסיבות מאפשר לבקש שינוי של מזונות שנפסקו.' ),
			array( 'name' => 'לוח החגים', 'url' => 'https://www.gov.il/he/pages/holidays', 'text' => $da['holidays_he'] . '.' ),
		);
	}
	if ( 'maakav-mezonot' === $name ) {
		$int = $reg['interest'];
		$out = array(
			array( 'name' => $int['law_he'], 'url' => $int['law_url'], 'text' => 'סעיף 1: הפרשי הצמדה; סעיף 4א: ריבית צמודה יומית והצטרפותה לקרן; סעיף 5א: דמי פיגורים בתיק הוצאה לפועל (לא מחושבים כאן).' ),
			array( 'name' => $int['publisher_he'], 'url' => $int['source_url'], 'text' => 'שיעורי הריבית הצמודה לפי רבעון. נבדק ' . justice_tools_he_date( $int['checked_on'] ) . '.' ),
			array( 'name' => $reg['cpi']['source_name'], 'url' => $reg['cpi']['official_calculator_url'], 'text' => 'מדד המחירים לצרכן ומקדמי הקישור; המדד הידוע ביום העדכון, כמו במחשבון הלמ"ס.' ),
			array( 'name' => $cs['law']['he'], 'url' => $cs['law']['url'], 'text' => 'סעיף 11: ' . $cs['deadlines']['late_he'] . '; סעיף 13: שינוי מזונות.' ),
		);
		foreach ( $cs['indexation']['sources'] as $s ) {
			$out[] = array( 'name' => $s['he'], 'url' => $s['url'], 'text' => 'הצמדה למדד ותדירות העדכון.' );
		}
		$out[] = array( 'name' => $cs['nii']['he'], 'url' => $cs['nii']['law_url'], 'text' => 'סעיף 3: המוסד לביטוח לאומי משלם את הנמוך מבין פסק הדין לסכום שבתקנות.' );
		$out[] = array( 'name' => 'המוסד לביטוח לאומי, שיעורי דמי המזונות', 'url' => $cs['nii']['url'], 'text' => 'הסכומים מ-' . justice_tools_he_date( $cs['nii']['from'] ) . '.' );
		$out[] = array( 'name' => 'רשות האכיפה והגבייה: פתיחת תיק מזונות בהוצאה לפועל', 'url' => 'https://www.gov.il/he/service/opening_alimony_file', 'text' => 'מסלול רגיל או מסלול מזונות שבו הלשכה גובה בעצמה; ' . $cs['indexation']['form_he'] . '.' );
		return $out;
	}
	$rb = $dc['rabbinical'];
	$fc = $dc['family'];
	$ds = $dc['disputes'];
	$pb = $reg['property_balance'];
	return array(
		array( 'name' => $ds['law_he'], 'url' => $ds['url'], 'text' => $ds['sections']['first'] . ': בקשה ליישוב סכסוך לפני תביעה; ' . $ds['sections']['meetings'] . ': עד ' . (int) $ds['meetings_max'] . ' פגישות; ' . $ds['sections']['meetings_days'] . ': ' . (int) $ds['meetings_days'] . ' ימים; ' . $ds['sections']['stay'] . ': ' . (int) $ds['stay_days'] . ' או ' . (int) $ds['stay_days_extended'] . ' ימי עיכוב; ' . $ds['sections']['claims'] . ': ' . (int) $ds['claim_days'] . ' ימים למגיש הבקשה; סעיף 2: הסכם לאישור וגירושין בהסכמה אינם תובענה.' ),
		array( 'name' => $rb['regulation_he'], 'url' => $rb['url'], 'text' => 'יישוב סכסוך ' . number_format( (float) $rb['request'] ) . ' ₪ (' . $rb['items']['request'] . '); גירושין ' . number_format( (float) $rb['divorce'] ) . ' ₪ (' . $rb['items']['divorce'] . '); רכוש ' . number_format( (float) $rb['property'] ) . ' ₪; הסכם כפסק דין ' . number_format( (float) $rb['agreement'] ) . ' ₪ (' . $rb['items']['agreement'] . '); סידור גט פטור; תעודה ' . number_format( (float) $rb['certificate'] ) . ' ₪. נוסח עדכני ל-' . justice_tools_he_date( $rb['current_to'] ) . '.' ),
		array( 'name' => $fc['regulation_he'], 'url' => $fc['url'], 'text' => 'יישוב סכסוך ' . number_format( (float) $fc['request'] ) . ' ₪ (' . $fc['items']['request'] . '); אישור הסכם ' . number_format( (float) $fc['agreement'] ) . ' ₪ (' . $fc['items']['agreement'] . '); רכוש ' . number_format( (float) $fc['property'] ) . ' ₪; משמורת ' . number_format( (float) $fc['custody'] ) . ' ₪; מזונות ' . number_format( (float) $fc['support'] ) . ' ₪; פרוטוקול ' . number_format( (float) $fc['transcript'] ) . ' ₪. נוסח עדכני ל-' . justice_tools_he_date( $fc['current_to'] ) . '.' ),
		array( 'name' => $dc['bar']['rules_he'], 'url' => $dc['bar']['url'], 'text' => $dc['bar']['note_he'] . '.' ),
		array( 'name' => $da['capacity_he'], 'url' => $da['capacity_url'], 'text' => 'סעיף 24: אישור הסדרי הילדים לפי טובתם.' ),
		array( 'name' => $pb['pension_split']['law_he'], 'url' => $pb['pension_split']['url'], 'text' => 'חלוקת הפנסיה דרך הקופה: ' . $pb['pension_split']['cap_he'] . '; העברה ' . (int) $pb['pension_split']['transfer_days'] . ' ימים אחרי ההודעה.' ),
		array( 'name' => $cs['nii']['he'], 'url' => $cs['nii']['law_url'], 'text' => 'סעיף 3: תשלום מזונות דרך המוסד לביטוח לאומי כשהחייב לא משלם.' ),
		array( 'name' => 'gov.il: אישור הסכם בין בני זוג', 'url' => $da['routes']['family']['svc_url'], 'text' => 'מה מגישים: טופס 3 (הרצאת פרטים), עותק אחד, אגרה.' ),
		array( 'name' => 'gov.il: גירושין בהסכמה בבית הדין הרבני', 'url' => $da['routes']['rabbinical']['svc_url'], 'text' => 'דיון בנוכחות שני בני הזוג, ואז סידור הגט.' ),
	);
}

/** The page table of each app (the "numbers" and "compare" parts), rendered by the build from the registry. */
function justice_tools_world_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}

/**
 * The divorce command center (HAD-541): the eight instruments of /divorce-lawyer/ in ONE block with a tab bar, so the
 * tools stop filling most of the page (Ben, 15.10.2026: "group it"). Order = the order people search in: the cost, the
 * child support, the property, the agreements, then the three apps that run the months after.
 * Each entry: the tool, its mode, whether its answer box prints above it, the tab label and a one-paragraph lead.
 */
function justice_tools_command_divorce_set(): array {
	return array(
		array( 'name' => 'gerushin', 'mode' => 'lawyer', 'answer' => '0', 'tab' => 'עלות עורך דין', 'lead' => 'התעריף המינימלי של לשכת עורכי הדין לכל שירות, האגרות לפי הערכאה והמסלול שלכם, ומע״מ. זו הרצפה, לא המחיר שמשרד יגבה; הטווחים שמשרדים מפרסמים מופיעים בפרק המחירים, והפירוט המלא ב<a href="/divorce-costs-2025/">עלויות גירושין ושכר טרחה</a>.' ),
		array( 'name' => 'mezonot', 'mode' => '', 'answer' => '1', 'tab' => 'מזונות ילדים', 'lead' => 'לפי בע״מ 919/15: גילאי הילדים, הכנסת כל הורה, הדיור ומספר הלילות אצל כל אחד. התוצאה היא טווח, כי שתי שיטות חישוב מקובלות בבתי המשפט נותנות סכומים שונים, והכלי מסביר את ההבדל. המדריך: <a href="/child-support/">מזונות ילדים</a>.' ),
		array( 'name' => 'izun', 'mode' => '', 'answer' => '1', 'tab' => 'איזון משאבים', 'lead' => 'כל נכס נכנס לאיזון או יוצא ממנו עם הסעיף שלו בחוק יחסי ממון: דירה, פנסיה, קרן השתלמות, אופציות ו-RSU, קריפטו וחובות. התוצאה: מי משלם למי וכמה. המדריך: <a href="/resource-balancing/">איזון משאבים</a>.' ),
		array( 'name' => 'heskem-gerushin', 'mode' => '', 'answer' => '0', 'tab' => 'הסכם גירושין', 'lead' => 'טיוטה של שבעת הפרקים שהסכם גירושין סוגר, מאותם נתונים שהקלדתם במזונות ובאיזון, עם לוח לינות וחגים. טקסט לעריכה, לא תחליף לבדיקה של עורך דין לכל צד. איך מאשרים ובכמה: <a href="/divorce-agreement/">הסכם גירושין</a>.' ),
		array( 'name' => 'heskem-mamon', 'mode' => '', 'answer' => '0', 'tab' => 'הסכם ממון', 'lead' => 'לפני החתונה, במהלך הנישואין או כידועים בציבור: מה מפרידים, ומי מאשר את ההסכם ובכמה, נוטריון, רושם הנישואין, בית המשפט או בית הדין. המדריך: <a href="/prenuptial-agreements-overview/">הסכם ממון</a>.' ),
		array( 'name' => 'mapat-gerushin', 'mode' => '', 'answer' => '1', 'tab' => 'מפת הדרכים', 'lead' => 'בוחרים מסלול וערכאה ומקבלים את כל התחנות, מההכנה ועד אחרי פסק הדין, עם האגרה והתאריך שהחוק קובע לכל אחת. מסמנים מה בוצע, וההתקדמות נשמרת רק בדפדפן שלכם. הצעד הראשון במחלוקת: <a href="/request-for-family-dispute-settlements/">בקשה ליישוב סכסוך</a>.' ),
		array( 'name' => 'luach-shahut', 'mode' => '', 'answer' => '1', 'tab' => 'לוח זמני שהות', 'lead' => '2-2-3, שבוע-שבוע, 5-2-2-5 או לילה-לילה: שבועיים של לילות, כמה מעברים בין הבתים כל תבנית גוזרת על הילדים, ושנה שלמה עם החגים לפי הלוח העברי, כקובץ יומן וכנספח להסכם. המדריך: <a href="/parenting-time-arrangements/">הסדרי שהות</a>.' ),
		array( 'name' => 'maakav-mezonot', 'mode' => '', 'answer' => '1', 'tab' => 'מעקב תשלומים', 'lead' => 'רושמים את פסק הדין ואת מה ששולם בפועל; האפליקציה מחשבת הצמדה למדד ופיגורים עם ריבית ליום הנוכחי ומנסחת מכתב דרישה. הכול נשמר רק אצלכם. כשזה לא עוזר: <a href="/bituach-leumi-alimony/">תשלום מזונות דרך ביטוח לאומי</a>.' ),
	);
}

/** Enqueue the stylesheet, the eight bundles and the tab script in the head (the early enqueue calls this). */
function justice_tools_command_enqueue(): void {
	foreach ( justice_tools_command_divorce_set() as $entry ) {
		justice_tools_enqueue( $entry['name'] );
	}
	$js = JUSTICE_THEME_DIR . '/assets/js/tools/dist/jt-command.js';
	if ( is_readable( $js ) ) {
		wp_enqueue_script( 'justice-tools-command', JUSTICE_THEME_URI . '/assets/js/tools/dist/jt-command.js', array(), (string) filemtime( $js ), true );
	}
}

/**
 * [justice_tools_command]: the tab bar and the eight panels, all server-rendered. The first panel is open and the
 * others carry `hidden`, so nothing moves when the script arrives and every instrument (and its WebApplication block)
 * is in the HTML. Tabs are <button role="tab">; assets/js/tools/dist/jt-command.js switches them (click, arrow keys,
 * Home/End) and opens the tab of any #jtool-<name> anchor: the tool map at the top, the roadmap's links, a share link.
 * A tool the catalog does not hold, or one already printed in this render pass, is left out with its tab.
 */
function justice_tools_command_shortcode( $atts = array() ): string {
	$catalog = justice_tools_catalog();
	$tabs    = '';
	$panels  = '';
	$n       = 0;
	foreach ( justice_tools_command_divorce_set() as $entry ) {
		$name = $entry['name'];
		if ( ! isset( $catalog[ $name ] ) ) {
			continue;
		}
		$tool = justice_tools_shortcode( array( 'name' => $name, 'mode' => $entry['mode'], 'answer' => $entry['answer'] ) );
		if ( '' === $tool ) {
			continue;
		}
		$n++;
		$open    = 1 === $n;
		$app     = in_array( $name, justice_tools_world_names(), true );
		$tab_id  = 'jt-cmd-tab-' . $name;
		$pane_id = 'jt-cmd-panel-' . $name;
		$tabs   .= '<button type="button" class="jt-cmd__tab' . ( $app ? ' jt-cmd__tab--app' : '' ) . '" role="tab" id="' . esc_attr( $tab_id ) . '" aria-controls="' . esc_attr( $pane_id ) . '" aria-selected="' . ( $open ? 'true' : 'false' ) . '" tabindex="' . ( $open ? '0' : '-1' ) . '" data-jt-cmd-tab="' . esc_attr( $name ) . '">'
			. '<span class="jt-cmd__n" aria-hidden="true">' . $n . '</span><span class="jt-cmd__label">' . esc_html( $entry['tab'] ) . '</span></button>';
		$panels .= '<div class="jt-cmd__panel" role="tabpanel" id="' . esc_attr( $pane_id ) . '" aria-labelledby="' . esc_attr( $tab_id ) . '" data-jt-cmd-panel="' . esc_attr( $name ) . '"' . ( $open ? '' : ' hidden' ) . '>'
			. '<p class="jt-cmd__lead">' . $entry['lead'] . '</p>' . $tool . '</div>';
	}
	if ( 0 === $n ) {
		return '';
	}
	justice_tools_command_enqueue();
	return '<div class="jt-cmd" data-jt-cmd><div class="jt-cmd__bar" role="tablist" aria-label="מרכז הפיקוד של הגירושין: ' . $n . ' כלים">' . $tabs . '</div>' . $panels . '</div>';
}
if ( function_exists( 'add_shortcode' ) ) {
	add_shortcode( 'justice_tools_command', 'justice_tools_command_shortcode' );
}
