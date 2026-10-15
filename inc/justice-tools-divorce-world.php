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
