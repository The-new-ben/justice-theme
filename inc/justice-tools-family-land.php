<?php
/**
 * The family + land wave (21-22.10.2026, HAD-579): six instruments on the pages that own their words, each with its
 * official rules and 2026 figures, a picture from the subject's world, a printable summary, the dated deadlines as a
 * calendar file, the next actions, and the scenario for the jus-tice.com simulation (copied, never put in a URL).
 *
 *   [justice_tool name="agrot-rabanut"]    rabbinical-court and family-court fees side by side (/fees-rabbinical-courts/)
 *   [justice_tool name="mishmoret"]        the parenting-time planner, school holidays and the child-support link (/child-custody/)
 *   [justice_tool name="yishuv-sichsuch"]  the clock of the Family Disputes Settlement Law (/request-for-family-dispute-settlements/)
 *   [justice_tool name="yeduim-batzibur"]  the rights map of cohabiting partners (/cohabiting-couples-rights/)
 *   [justice_tool name="alut-iska"]        the all-in cost of buying or selling an apartment (/real-estate-lawyer-cost-2025/)
 *   [justice_tool name="dira-mikablan"]    the contractor purchase: index linkage, delay compensation, warranty clock (/buying-apartment-from-contractor/)
 * Every number is read from assets/data/justice-tools-registry.json (fl_<lane>, built by tools/justice_tools_fl_<lane>.py,
 * and the existing datasets they reuse) or from the snapshot the build renders. No home carries a reviewed-by line
 * (checked on the live pages, 21.10.2026).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_fl_names(): array {
	return array( 'agrot-rabanut', 'mishmoret', 'yishuv-sichsuch', 'yeduim-batzibur', 'alut-iska', 'dira-mikablan' );
}

/** The catalog entries, merged into justice_tools_catalog(). */
function justice_tools_fl_catalog(): array {
	return array(
		// The family + land wave (21.10.2026, HAD-579): the rabbinical-court fee ledger, every procedure of the Dayanim (Fees)
		// Regulations next to the same claim at the family court, on /fees-rabbinical-courts/ (pages 24506). Bundle:
		// 'agrot-rabanut' => array( 'instrument.js', 'dates.js', 'gerushin-engine.js', 'rabanut-engine.js', 'rabanut-ui.js' )
		// (the wave-4 engine supplies the dispute-request clock; every name in rabanut-*.js starts with "rb" or is a UI export).
		'agrot-rabanut'   => array(
			'name'      => 'מחשבון אגרות בית הדין הרבני',
			'title'     => 'כמה עולה כל הליך בבית הדין הרבני, ואותה תביעה בבית המשפט לענייני משפחה',
			'promise'   => 'פנקס אגרות של התיק שלכם: כל הליך לפי פרט התקנות, אגרת הפרוטוקול, הפטורים וההחזרים, איך משלמים, ולוח המועדים מהבקשה ליישוב סכסוך ועד הערעור.',
			'question'  => 'כמה עולות האגרות בבית הדין הרבני, ומה זה עולה בבית המשפט לענייני משפחה?',
			'page'      => '/fees-rabbinical-courts/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'fl_rabanut', 'divorce_cost', 'inheritance_process' ),
			'dataset'   => 'fl_rabanut',
			'next_text' => 'הצעד הבא: לשלם את האגרה לפני הגשת המסמכים, להכניס ליומן את המועדים, ולתרגל את הדיון הראשון בבית הדין',
			'primary'   => array( 'label' => 'לתרגל את הדיון בבית הדין', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הדיון בבית הדין', 'topic' => 'divorce', 'purpose' => 'court_rehearsal' ),
			'more'      => array(
				array( 'label' => 'פתיחת תיק גירושין: העלות והמועדים', 'path' => '/opening-divorce-file-rabbinical/' ),
				array( 'label' => 'בתי הדין הרבניים האזוריים', 'path' => '/regional-rabbinical-courts/' ),
				array( 'label' => 'תשלום אגרות בתי הדין הרבניים (gov.il)', 'url' => 'https://www.gov.il/he/departments/dynamiccollectors/agrot_rbc' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין גירושין', 'path' => '/divorce-lawyer/' ),
			'sticky'    => 'אגרות',
		),
		// The family + land wave (21.10.2026, HAD-579): the parenting-time planner on /child-custody/ (jt41). It reuses the
		// custody calendar's patterns (luach-engine) and the child-support engine (mezonot-engine); the vacations are the
		// Ministry of Education's for 5787 (fl_mishmoret). The page carries the theme's family-law card; the lawyer link goes
		// to the directory, never to a named office.
		'mishmoret'       => array(
			'name'        => 'מתכנן זמני שהות ומשמורת משותפת',
			'title'       => 'משמורת משותפת וזמני שהות: השנה שלכם, לילה אחרי לילה',
			'promise'     => 'בוחרים הסדר (5-2-2-5, 2-2-3, שבוע-שבוע, סופי שבוע לסירוגין) ומקבלים את 12 החודשים הקרובים: לילות ואחוזים לכל הורה, חופשות בית הספר לפי לוח משרד החינוך, כללי הגיל של כל ילד, מה זה עושה למזונות לפי בע"מ 919/15, יומן לכל הורה ותוכנית הורות להדפסה.',
			'question'    => 'כמה לילות בשנה אצל כל הורה במשמורת משותפת, ומה זה עושה למזונות?',
			'page'        => '/child-custody/',
			'category'    => 'LegalApplication',
			'data'        => array( 'registry_version', 'fl_mishmoret', 'child_support', 'divorce_agreement' ),
			'dataset'     => 'fl_mishmoret',
			'next_text'   => 'הצעד הבא: לתרגל את שיחת הגישור על תוכנית ההורות, עם הלוח, החופשות והמזונות שיצאו כאן',
			'primary'     => array( 'label' => 'לתרגל את הגישור על תוכנית ההורות', 'rehearse' => true ),
			'rehearse'    => array( 'label' => 'לתרגל את הגישור על תוכנית ההורות', 'topic' => 'divorce', 'purpose' => 'mediation' ),
			'more'        => array(
				array( 'label' => 'הסכם גירושין עם תוכנית הורות', 'path' => '/divorce-agreement/' ),
				array( 'label' => 'מחשבון מזונות ילדים', 'path' => '/child-support/' ),
				array( 'label' => 'לוח החופשות של משרד החינוך', 'url' => 'https://pop.education.gov.il/maagal_hashana/vacation-schedule/' ),
			),
			'lawyer'      => array( 'label' => 'עורכי דין לענייני משפחה לפי עיר', 'path' => '/lawyers/?area=family-law' ),
			'sticky'      => 'לילות בשנה',
			'sticky_kind' => 'count',
		),
		// The family + land wave (21.10.2026, HAD-579), lane sichsuch: the clock of a request to settle a family dispute, from
		// the filing day to the claim, in the family court and the rabbinical court (/request-for-family-dispute-settlements/,
		// articles 3510). Bundle: instrument.js + dates.js + sichsuch-fl-engine.js + sichsuch-fl-ui.js (never with
		// sichsuch-engine.js / sichsuch-ui.js, the inheritance dispute navigator). The snapshot carries 'sticky' (the stay's
		// end date, not money). The rehearse button copies the computed scenario (aiBrief) before it opens the simulation.
		'yishuv-sichsuch' => array(
			'name'      => 'השעון של בקשה ליישוב סכסוך',
			'title'     => 'בקשה ליישוב סכסוך: השעון שבחוק, מיום ההגשה ועד התביעה',
			'promise'   => 'פגישות המהו"ת, עיכוב ההליכים, 15 הימים של מי שהגיש, ההארכות והחגים שלא נספרים, החריגים, הטפסים והאגרה, בבית המשפט לענייני משפחה ובבית הדין הרבני.',
			'question'  => 'מתי נגמר עיכוב ההליכים אחרי בקשה ליישוב סכסוך, ומתי אפשר להגיש תביעה?',
			'page'      => '/request-for-family-dispute-settlements/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'divorce_cost', 'fl_sichsuch' ),
			'dataset'   => 'fl_sichsuch',
			'next_text' => 'הצעד הבא: להגיש את טופס 1, לסמן ביומן את סוף הפגישות, את סוף העיכוב ואת 15 הימים, ולתרגל את פגישת המהו"ת הראשונה',
			'primary'   => array( 'label' => 'לתרגל את פגישת המהו"ת הראשונה', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את פגישת המהו"ת הראשונה', 'topic' => 'family-law', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'יישוב סכסוך במשפחה: מה קורה ביחידת הסיוע', 'path' => '/family-dispute-resolution/' ),
				array( 'label' => 'גישור גירושין: איך מתכוננים', 'path' => '/divorce-mediation/' ),
				array( 'label' => 'הרשות השופטת: בקשה ליישוב סכסוך במשפחה', 'url' => 'https://www.gov.il/he/service/asking_for_family_dispute_settlements' ),
			),
			'lawyer'    => array( 'label' => 'עורכי דין לענייני משפחה לפי עיר', 'path' => '/lawyers/?area=family-law' ),
			'sticky'    => 'סוף העיכוב',
		),
		// The family + land wave (21.10.2026, HAD-579): the rights map for cohabiting partners, line by line (what you have,
		// what you must prove), with the proof meter of the five tests; on the thin page /cohabiting-couples-rights/ (no
		// reviewed-by line on it, checked 21.10.2026). The rehearsal follows the question in the result (separation: mediation).
		'yeduim-batzibur' => array(
			'name'        => 'מפת הזכויות של ידועים בציבור',
			'title'       => 'ידועים בציבור: מה יש לכם, ומה צריך להוכיח',
			'promise'     => 'ירושה לפי סעיף 55, קצבת שארים מהביטוח הלאומי עם הסכום, מס, ילדים, רכוש ודירה, הסכם ואישורו: כל אחת מהזכויות בשורה עם הסעיף שלה, ומד הוכחה של חמשת המבחנים שבחוק ובפסיקה.',
			'question'    => 'מה הזכויות של ידועים בציבור, ומה צריך להוכיח כדי לקבל אותן?',
			'page'        => '/cohabiting-couples-rights/',
			'category'    => 'LegalApplication',
			'data'        => array( 'registry_version', 'fl_yeduim', 'prenup', 'yerusha' ),
			'dataset'     => 'fl_yeduim',
			'next_text'   => 'הצעד הבא: להכין את המסמכים שמוכיחים את החיים המשותפים, ולתרגל את ההוכחה מול שופטת וירטואלית',
			'primary'     => array( 'label' => 'לתרגל את הוכחת הקשר', 'rehearse' => true ),
			'rehearse'    => array( 'label' => 'לתרגל את הוכחת הקשר', 'topic' => 'family-law', 'purpose' => 'court_rehearsal' ),
			'more'        => array(
				array( 'label' => 'חלוקת רכוש בין ידועים בציבור', 'path' => '/cohabitation-property-rights-for-unmarried-couples/' ),
				array( 'label' => 'מחולל הסכם, במסלול לידועים בציבור', 'path' => '/prenuptial-agreement/' ),
				array( 'label' => 'ידועים בציבור באתר הביטוח הלאומי', 'url' => 'https://www.btl.gov.il/Insurance/National%20Insurance/Pages/yeduyimBtzibur.aspx' ),
			),
			'lawyer'      => array( 'label' => 'עורך דין לענייני משפחה', 'path' => '/family-law/' ),
			'sticky'      => 'מבחני הוכחה',
			'sticky_kind' => 'count',
		),

// Bundle line for tools/build-justice-tools.mjs (TOOLS):
//	'yeduim-batzibur': ['instrument.js', 'dates.js', 'yeduim-engine.js', 'yeduim-ui.js'],
// Snapshot line: import * as yd from '../assets/js/tools/yeduim-ui.js';  ...  'yeduim-batzibur': yd.snapshot(registry),
// No top-level name of yeduim-engine.js / yeduim-ui.js collides with instrument.js or dates.js (engine helpers are yd*-prefixed).
// The shortcode on the page: [justice_tool name="yeduim-batzibur"]; page sections: [justice_tool_section name="yeduim-batzibur" part="compare"] etc.
		// The family + land wave (21.10.2026, HAD-579): the closing ledger of an apartment deal, buying or selling, on
		// /real-estate-lawyer-cost-2025/ (articles 12655, a CLASSIC article: the shortcode goes first). Bundle:
		// 'alut-iska' => array( 'instrument.js', 'rechisha-engine.js', 'iska-engine.js', 'iska-ui.js' )
		// (the wave-3 purchase-tax engine is reused as is; every name in iska-*.js starts with "ik"/"IK" or is a UI export).
		'alut-iska'       => array(
			'name'      => 'מחשבון עלות קניית דירה ומכירתה',
			'title'     => 'כמה עולה לקנות או למכור דירה: כל תשלום, מתי ולמי',
			'promise'   => 'פנקס הסגירה של העסקה: מס רכישה, שכר עורך הדין שלכם עם מע"מ, אגרות הטאבו לפי התקנות, תיווך ושמאי, המועדים שבחוק ביומן, ובמכירה קישור למחשבון מס השבח עם המספרים שלכם.',
			'question'  => 'כמה עולה עורך דין בקניית דירה או במכירתה, ומה עוד משלמים עד הרישום?',
			'page'      => '/real-estate-lawyer-cost-2025/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'fl_iska', 'purchase_tax', 'shevach' ),
			'dataset'   => 'fl_iska',
			'next_text' => 'הצעד הבא: להכניס ליומן את מועד ההצהרה והתשלום, להשוות את הצעת עורך הדין לשורות בפנקס, ולתרגל את המשא ומתן',
			'primary'   => array( 'label' => 'לתרגל את המשא ומתן', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את המשא ומתן', 'topic' => 'real-estate', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'מחשבון מס רכישה: כל המסלולים', 'path' => '/acquisition-tax-brackets-2026/' ),
				array( 'label' => 'מחשבון מס שבח במכירה', 'path' => '/land-appreciation-tax/' ),
				array( 'label' => 'הצהרה על עסקת מקרקעין (gov.il)', 'url' => 'https://www.gov.il/he/service/real-estate-tax-7000' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין מקרקעין', 'path' => '/real-estate-attorney/' ),
			'sticky'    => 'עלות',
		),
		// The family + land wave (22.10.2026, HAD-579): buying an apartment from a contractor, three clocks in one (the
		// payments and their building-input-index linkage under s.5ג, the delivery-delay compensation of s.5א in both
		// versions, the inspection and warranty periods of s.4 and the addendum) plus the Investments Law securities, on
		// /buying-apartment-from-contractor/ (articles 21300, a CLASSIC article: the shortcode goes first). Bundle:
		// 'dira-mikablan' => array( 'instrument.js', 'dates.js', 'kablan-engine.js', 'kablan-ui.js' )
		// (every top-level name in kablan-*.js starts with "kb" or is a UI export; no collision with dates.js / instrument.js).
		'dira-mikablan'   => array(
			'name'      => 'מחשבון קניית דירה מקבלן',
			'title'     => 'קניית דירה מקבלן: התשלומים וההצמדה, הפיצוי על איחור במסירה ושעון הבדק',
			'promise'   => 'לוח התשלומים מול מדד תשומות הבנייה לפי תיקון 9, הפיצוי על כל חודש איחור לפי סעיף 5א, תקופת הבדק והאחריות של כל סוג ליקוי מיום המסירה, והבטוחות שצריך לקבל על כל תשלום.',
			'question'  => 'כמה פיצוי מגיע על איחור במסירה, כמה הפרשי הצמדה למדד תשומות הבנייה, ועד מתי האחריות של הקבלן?',
			'page'      => '/buying-apartment-from-contractor/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'fl_kablan', 'small_claims' ),
			'dataset'   => 'fl_kablan',
			'next_text' => 'הצעד הבא: להכניס ליומן את סוף הבדק והאחריות, לבקש מהקבלן את הפיצוי בכתב, ולתרגל את השיחה',
			'primary'   => array( 'label' => 'לתרגל את השיחה עם הקבלן', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם הקבלן', 'topic' => 'real-estate', 'purpose' => 'court_rehearsal' ),
			'more'      => array(
				array( 'label' => 'ליקויי בנייה מקבלן: הזכויות והתביעה', 'path' => '/real-estate-developer-defect/' ),
				array( 'label' => 'תביעה קטנה: האגרה והמועדים', 'path' => '/small-claims-court-israel/' ),
				array( 'label' => 'תיקון 9 לחוק המכר (gov.il)', 'url' => 'https://www.gov.il/he/pages/9th-amendment' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין מקרקעין', 'path' => '/real-estate-attorney/' ),
			'sticky'    => 'פיצוי',
		),
	);
}

/** The answer box (40-70 words): the direct answer, its numbers, their sections and the check date. */
function justice_tools_fl_answer( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	// agrot-rabanut (jt40): the answer box. One paragraph, every figure from the registry: the wave-4 fees in divorce_cost
	// (reused), the payment method in fl_rabanut, ending with the check date.
	if ( 'agrot-rabanut' === $name && ! empty( $reg['fl_rabanut'] ) && ! empty( $reg['divorce_cost'] ) ) {
		$fl   = $reg['fl_rabanut'];
		$rb   = $reg['divorce_cost']['rabbinical'];
		$fc   = $reg['divorce_cost']['family'];
		$text = '<strong>אגרות בית הדין הרבני</strong> קבועות בתקנות הדיינים (אגרות), ומ-<bdi>' . esc_html( justice_tools_he_date( $fl['rab']['from'] ) ) . '</bdi>: תביעת גירושין ' . justice_tools_money( $rb['divorce'], 0 ) . ' ועוד ' . justice_tools_money( $rb['transcript_divorce'], 0 ) . ' אגרת פרוטוקול, אישור הסכם גירושין ' . justice_tools_money( $rb['agreement'], 0 ) . ', חלוקת רכוש ' . justice_tools_money( $rb['property'], 0 ) . ', החזקת ילדים ' . justice_tools_money( $rb['custody'], 0 ) . ' ותעודת גירושין ' . justice_tools_money( $rb['certificate'], 0 ) . ' לכל צד; מי שתובע מזונות פטור (' . esc_html( $fl['rab']['rules']['support']['section'] ) . '). '
			. 'בבית המשפט לענייני משפחה אותן תביעות: ' . justice_tools_money( $fc['property'], 0 ) . ', ' . justice_tools_money( $fc['custody'], 0 ) . ' ו-' . justice_tools_money( $fc['support'], 0 ) . '. משלמים באשראי, לפני ההגשה. נבדק ' . esc_html( justice_tools_he_date( $fl['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// mishmoret (jt41): the answer box on /child-custody/. One paragraph; every figure and section from fl_mishmoret (919/15
	// para. 3, the Capacity and Guardianship Law ss.24-25, the 2020 Family Court Procedure Regulations reg. 51(ב), the
	// Ministry of Education's 5787 calendar), ending with the check date. The first sentence answers "משמורת משותפת".
	if ( 'mishmoret' === $name && ! empty( $reg['fl_mishmoret'] ) ) {
		$mm   = $reg['fl_mishmoret'];
		$text = '<strong>משמורת משותפת</strong> היא חלוקה שווה של זמני השהות: <bdi>' . (int) $mm['ruling']['equal_nights'] . '</bdi> לילות מתוך <bdi>' . (int) $mm['ruling']['equal_of'] . '</bdi>, או <bdi>' . (int) $mm['ruling']['equal_month_nights'] . '</bdi> מתוך <bdi>' . (int) $mm['ruling']['equal_month_of'] . '</bdi> (בע"מ 919/15, ' . esc_html( $mm['ruling']['paras']['equal'] ) . '). '
			. 'אין בחוק נוסחה: ההורים מסכימים, ובית המשפט מאשר רק הסדר שלטובת הילד (' . esc_html( $mm['law']['sections']['agreement'] ) . ' לחוק הכשרות); בלי הסכם, ילדים עד גיל <bdi>' . (int) $mm['law']['tender_until'] . '</bdi> אצל האם אם אין סיבות מיוחדות (' . esc_html( $mm['law']['sections']['no_agreement'] ) . '), וילד מגיל <bdi>' . (int) $mm['child_heard']['from_age'] . '</bdi> נשמע (' . esc_html( $mm['child_heard']['sections']['age'] ) . '). '
			. 'החגים והחופש הגדול לפי לוח משרד החינוך לשנת הלימודים ' . esc_html( $mm['school_year']['he'] ) . '. נבדק ' . esc_html( justice_tools_he_date( $mm['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// yishuv-sichsuch (jt42): the answer box. One paragraph (about 60 words), every figure and section from
	// divorce_cost.disputes (re-read against the law on 21.10.2026), the two request fees of divorce_cost, and the check
	// date of fl_sichsuch. Renders: בקשה ליישוב סכסוך מגישים בטופס 1 לבית המשפט לענייני משפחה (אגרה 120 ₪) או לבית הדין
	// הרבני (119 ₪) ... 4 פגישות מהו"ת בתוך 45 ימים, ו-60 ימים (75 בהארכה) ... 15 ימים (סעיף 4). נבדק 21.10.2026.
	if ( 'yishuv-sichsuch' === $name && ! empty( $reg['fl_sichsuch'] ) && ! empty( $reg['divorce_cost'] ) ) {
		$fs   = $reg['fl_sichsuch'];
		$dc   = $reg['divorce_cost'];
		$ds   = $dc['disputes'];
		$text = '<strong>בקשה ליישוב סכסוך</strong> מגישים בטופס 1 לבית המשפט לענייני משפחה (אגרה ' . justice_tools_money( $dc['family']['request'], 0 ) . ') או לבית הדין הרבני (' . justice_tools_money( $dc['rabbinical']['request'], 0 ) . ') לפני כל תביעה במחלוקת על גירושין, מזונות, רכוש או ילדים (' . esc_html( $ds['sections']['first'] ) . '). '
			. 'אחריה באות עד <bdi>' . (int) $ds['meetings_max'] . '</bdi> פגישות מהו"ת בתוך <bdi>' . (int) $ds['meetings_days'] . '</bdi> ימים, ו-<bdi>' . (int) $ds['stay_days'] . '</bdi> ימים (<bdi>' . (int) $ds['stay_days_extended'] . '</bdi> בהארכה) שבהם אין תביעות (' . esc_html( $ds['sections']['stay'] ) . '); '
			. 'ימי החג לא נספרים. אחר כך מי שהגיש את הבקשה תובע ראשון, בתוך <bdi>' . (int) $ds['claim_days'] . '</bdi> ימים (' . esc_html( $ds['sections']['claims'] ) . '). נבדק ' . esc_html( justice_tools_he_date( $fs['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// yeduim-batzibur (jt43): the answer box. One paragraph, every figure and section from fl_yeduim (Succession Law s.55,
	// National Insurance Law s.1 and s.238, the Institute's 2026 survivors table), ending with the check date.
	if ( 'yeduim-batzibur' === $name && ! empty( $reg['fl_yeduim'] ) ) {
		$fy   = $reg['fl_yeduim'];
		$sv   = $fy['nii']['survivors'];
		$text = '<strong>ידועים בציבור</strong> הם בני זוג שחיים חיי משפחה במשק בית משותף בלי נישואין. בלי צוואה, מי שנשאר מקבל את החלק של בן זוג נשוי, אם אף אחד מהם לא היה נשוי לאחר (' . esc_html( $fy['succession']['s55'] ) . ' לחוק הירושה). '
			. 'בביטוח הלאומי, אחרי הכרה, הם כמו נשואים: קצבת שארים עם ילד ' . justice_tools_money( $sv['amounts']['kid1'], 0 ) . ' בחודש מ-' . esc_html( justice_tools_he_date( $sv['amounts_from'] ) ) . ', אחרי <bdi>' . (int) $sv['min_months'] . '</bdi> חודשים תחת קורת גג אחת (' . esc_html( $sv['section'] ) . '). '
			. 'חוק יחסי ממון לא חל עליהם. נבדק ' . esc_html( justice_tools_he_date( $fy['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}

// Rendered (21.10.2026), 61 words:
// ידועים בציבור הם בני זוג שחיים חיי משפחה במשק בית משותף בלי נישואין. בלי צוואה, מי שנשאר מקבל את החלק של בן זוג נשוי,
// אם אף אחד מהם לא היה נשוי לאחר (סעיף 55 לחוק הירושה). בביטוח הלאומי, אחרי הכרה, הם כמו נשואים: קצבת שארים עם ילד
// 2,700 ₪ בחודש מ-1.1.2026, אחרי 12 חודשים תחת קורת גג אחת (סעיף 238). חוק יחסי ממון לא חל עליהם. נבדק 21.10.2026.
	// alut-iska (jt44): the answer box. One paragraph, every figure from the registry: the Bar's non-binding tariff rule
	// (fl_iska.bar), the VAT rate (purchase_tax), the Land Registry fees (fl_iska.tabu), the 30/60 days, the check date.
	if ( 'alut-iska' === $name && ! empty( $reg['fl_iska'] ) && ! empty( $reg['purchase_tax'] ) ) {
		$fl   = $reg['fl_iska'];
		$pt   = $reg['purchase_tax'];
		$f    = $fl['tabu']['fees'];
		$text = '<strong>שכר טרחת עורך דין בקניית דירה או במכירתה</strong> לא נקבע בחוק: הוא נקבע בהסכם, והתעריף של לשכת עורכי הדין הוא המלצה שאינה מחייבת (' . esc_html( $fl['bar']['rule2_section'] ) . '). על ההצעה נוסף מע"מ <bdi>' . esc_html( $pt['vat_pct'] ) . '%</bdi>. מעבר לה משלמים מס רכישה, הערת אזהרה ' . justice_tools_money( $f['warning']['amount'], 0 ) . ', רישום מכר ' . justice_tools_money( $f['sale']['amount'], 0 ) . ' ורישום משכנתה ' . justice_tools_money( $f['mortgage']['amount'], 0 ) . '. מצהירים לרשות המסים בתוך <bdi>' . esc_html( $pt['declare_days'] ) . '</bdi> ימים ומשלמים בתוך <bdi>' . esc_html( $pt['pay_days'] ) . '</bdi>. נבדק ' . esc_html( justice_tools_he_date( $fl['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// dira-mikablan (jt45): the answer box. One paragraph, every figure from fl_kablan, ending with the check date.
	if ( 'dira-mikablan' === $name && ! empty( $reg['fl_kablan'] ) ) {
		$fl   = $reg['fl_kablan'];
		$nw   = $fl['delay']['new'];
		$lk   = $fl['linkage'];
		$w    = $fl['warranty'];
		$text = '<strong>קניית דירה מקבלן</strong> מוגנת בחוק המכר (דירות): בחוזה שנחתם מ-<bdi>' . esc_html( justice_tools_he_date( $lk['from'] ) ) . '</bdi> מותר להצמיד למדד תשומות הבנייה רק עד <bdi>' . (int) $lk['max_share_pct'] . '%</bdi> מכל תשלום, בלי <bdi>' . (int) $lk['unlinked_first_pct'] . '%</bdi> הראשונים ועד מועד המסירה שבחוזה (' . esc_html( $lk['half']['section'] ) . '). '
			. 'איחור של יותר מחודש במסירה מזכה בפיצוי בגובה דמי שכירות של דירה דומה, כפול <bdi>' . esc_html( (string) $nw['tiers'][1]['mult'] ) . '</bdi> מהחודש החמישי וכפול <bdi>' . esc_html( (string) $nw['tiers'][2]['mult'] ) . '</bdi> מהחודש ה-11 (' . esc_html( $nw['section'] ) . '). '
			. 'תקופת הבדק בין שנה לשבע שנים לפי סוג הליקוי, ועוד <bdi>' . (int) $w['warranty_years'] . '</bdi> שנות אחריות. נבדק ' . esc_html( justice_tools_he_date( $fl['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '';
}

/** The data stamp in the tool's header. */
function justice_tools_fl_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'agrot-rabanut' === $name ) {
		$fl = $reg['fl_rabanut'] ?? array();
		return 'אגרות מ-' . justice_tools_he_date( $fl['rab']['from'] ?? '' ) . ' (בית המשפט מ-' . justice_tools_he_date( $fl['fam']['from'] ?? '' ) . ') · נבדק ' . justice_tools_he_date( $fl['checked_on'] ?? '' );
	}
	// mishmoret (jt41): the header stamp, e.g. "חלוקה שווה: 7 מתוך 14 לילות · חופשות תשפ"ז · נבדק 21.10.2026".
	if ( 'mishmoret' === $name ) {
		$mm = $reg['fl_mishmoret'] ?? array();
		return 'חלוקה שווה: ' . (int) ( $mm['ruling']['equal_nights'] ?? 0 ) . ' מתוך ' . (int) ( $mm['ruling']['equal_of'] ?? 0 ) . ' לילות · חופשות ' . ( $mm['school_year']['he'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $mm['checked_on'] ?? '' );
	}
	if ( 'yishuv-sichsuch' === $name ) {
		$ds = $reg['divorce_cost']['disputes'] ?? array();
		$dc = $reg['divorce_cost'] ?? array();
		return 'עיכוב ' . (int) ( $ds['stay_days'] ?? 0 ) . ' ימים, ' . (int) ( $ds['stay_days_extended'] ?? 0 ) . ' בהארכה · אגרה ' . number_format( (float) ( $dc['family']['request'] ?? 0 ) ) . ' ₪ או ' . number_format( (float) ( $dc['rabbinical']['request'] ?? 0 ) ) . ' ₪ · נבדק ' . justice_tools_he_date( $reg['fl_sichsuch']['checked_on'] ?? '' );
	}
	// Renders: עיכוב 60 ימים, 75 בהארכה · אגרה 120 ₪ או 119 ₪ · נבדק 21.10.2026
	if ( 'yeduim-batzibur' === $name ) {
		$fy = $reg['fl_yeduim'] ?? array();
		return 'סעיף 55 · שארים ' . number_format( (float) ( $fy['nii']['survivors']['amounts']['kid1'] ?? 0 ) ) . ' ₪ עם ילד מ-' . justice_tools_he_date( $fy['nii']['survivors']['amounts_from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $fy['checked_on'] ?? '' );
	}

// Renders: סעיף 55 · שארים 2,700 ₪ עם ילד מ-1.1.2026 · נבדק 21.10.2026
	if ( 'alut-iska' === $name ) {
		$fl = $reg['fl_iska'] ?? array();
		return 'אגרות טאבו מ-' . justice_tools_he_date( $fl['tabu']['from'] ?? '' ) . ' · מע"מ ' . ( $reg['purchase_tax']['vat_pct'] ?? '' ) . '% · נבדק ' . justice_tools_he_date( $fl['checked_on'] ?? '' );
	}
	if ( 'dira-mikablan' === $name ) {
		$fl = $reg['fl_kablan'] ?? array();
		$lm = (string) ( $fl['index']['latest_month'] ?? '' );
		return 'חוק המכר בנוסח תיקון 9 · מדד תשומות הבנייה עד ' . ( $lm ? (int) substr( $lm, 5, 2 ) . '.' . substr( $lm, 0, 4 ) : '' ) . ' · נבדק ' . justice_tools_he_date( $fl['checked_on'] ?? '' );
	}
	return 'נבדק ' . justice_tools_he_date( justice_tools_checked_on( $name ) );
}

/** Official sources used by each instrument's result. */
function justice_tools_fl_sources( string $name ): array {
	$reg = justice_tools_registry();
	if ( 'agrot-rabanut' === $name ) {
		$fl      = $reg['fl_rabanut'];
		$rb      = $reg['divorce_cost']['rabbinical'];
		$fc      = $reg['divorce_cost']['family'];
		$dl      = $fl['deadlines'];
		$rr      = $fl['rab']['rules'];
		$fr      = $fl['fam']['rules'];
		$checked = justice_tools_he_date( $fl['checked_on'] );
		return array(
			array( 'name' => $fl['rab']['regulation_he'], 'url' => $fl['rab']['url'], 'text' => 'התוספת הראשונה, כל הפרטים: גירושין ' . number_format( (float) $rb['divorce'] ) . ' ₪ (פרט 4(1)(א)), רכוש ' . number_format( (float) $rb['property'] ) . ' (4(1)(ב)), תביעה כספית 1% ולא פחות מ-' . number_format( (float) $fl['rab']['pct']['money_val']['min'] ) . ' (4(1)(ד)), הסכם ' . number_format( (float) $rb['agreement'] ) . ' (4(2)), בקשה לסידור גט ' . number_format( (float) $rb['get_request'] ) . ' ו-' . number_format( (float) $rb['get_request_abroad'] ) . ' (4(3)(א)-(ב)), תעודה ' . number_format( (float) $rb['certificate'] ) . ' (4(4)(א)), החזקת ילדים ' . number_format( (float) $rb['custody'] ) . ' (7), ערעור ' . number_format( (float) $rb['appeal'] ) . ', ' . number_format( (float) $fl['rab']['fees']['appeal_leave']['amount'] ) . ', ' . number_format( (float) $fl['rab']['fees']['appeal_other']['amount'] ) . ' ו-' . number_format( (float) $fl['rab']['fees']['appeal_extend']['amount'] ) . ' (15(א)-(ד)), בקשה ליישוב סכסוך ' . number_format( (float) $rb['request'] ) . ' (19(טז)); התוספת השנייה: פרוטוקול ' . number_format( (float) $rb['transcript_divorce'] ) . ' ו-' . number_format( (float) $rb['transcript_other'] ) . '. תקנות 4, 9-12, 14, 14א, 15, 17 ו-22א. ' . $fl['rab']['indexed_he'] . '. נוסח עדכני ל-' . justice_tools_he_date( $fl['rab']['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $fl['rab']['admin_table']['he'], 'url' => $fl['rab']['admin_table']['url'], 'text' => $fl['rab']['admin_table']['version_he'] . ' (עודכן ' . justice_tools_he_date( $fl['rab']['admin_table']['updated'] ) . '): האגרות שהתוספת אינה קובעת במפורש, ושירות התשלומים גובה: כתובה או פיצוי גירושין ' . number_format( (float) $fl['rab']['admin']['ketubah']['amount'] ) . ' ₪, שינוי הסכם גירושין ' . number_format( (float) $fl['rab']['admin']['change_agreement']['amount'] ) . ', השלמה מבקשה משותפת לאישור הסכם ' . number_format( (float) $fl['rab']['admin']['agreement_topup']['amount'] ) . ', צו ירושה וצו קיום צוואה ' . number_format( (float) $fl['rab']['admin']['inheritance']['amount'] ) . ', צו הגנה 0.' ),
			array( 'name' => $fl['rab']['payment']['he'], 'url' => $fl['rab']['payment']['url'], 'text' => $fl['rab']['payment']['how_he'] . '. נבדק ' . justice_tools_he_date( $fl['rab']['payment']['checked_on'] ) . '.' ),
			array( 'name' => $fl['fam']['regulation_he'], 'url' => $fl['fam']['url'], 'text' => 'התוספת הראשונה: פרט 1א, 1% ולא פחות מ-' . number_format( (float) $fl['fam']['fees']['spouse_money']['min'] ) . ' ₪; 2א רכוש בין בני זוג ' . number_format( (float) $fc['property'] ) . '; 5 מזונות ' . number_format( (float) $fc['support'] ) . '; 6א אישור הסכם ' . number_format( (float) $fc['agreement'] ) . '; 6ב החזקת ילדים ' . number_format( (float) $fc['custody'] ) . '; 7 בקשה בכתב ' . number_format( (float) $fl['fam']['fees']['written']['amount'] ) . '; 13 בקשה ליישוב סכסוך ' . number_format( (float) $fc['request'] ) . '; התוספת השנייה: פרוטוקול ' . number_format( (float) $fc['transcript'] ) . '. תקנות 2, 3(ב), 6, 7, 8 ו-9. ' . $fl['fam']['indexed_he'] . '. בנוסח מ-' . justice_tools_he_date( $fl['fam']['from'] ) . ' (' . $fl['fam']['notice_he'] . ').' ),
			array( 'name' => 'הרשות השופטת: אגרות בבתי המשפט לענייני משפחה', 'url' => $fl['fam']['guide_url'], 'text' => 'הטבלה הרשמית בתוקף מ-' . justice_tools_he_date( $fl['fam']['from'] ) . '; ' . $fl['fam']['payment']['how_he'] . ' (' . $fl['fam']['payment']['url'] . ').' ),
			array( 'name' => $fl['appeal_court']['regulation_he'], 'url' => $fl['appeal_court']['url'], 'text' => 'ערעור על פסק דין של בית המשפט לענייני משפחה ' . number_format( (float) $fl['appeal_court']['appeal']['amount'] ) . ' ₪ (' . $fl['appeal_court']['appeal']['item'] . '); רשות ערעור על החלטת ביניים ' . number_format( (float) $fl['appeal_court']['leave']['amount'] ) . ' (' . $fl['appeal_court']['leave']['item'] . '); ערעור אחר ' . number_format( (float) $fl['appeal_court']['other']['amount'] ) . ' (' . $fl['appeal_court']['other']['item'] . '). מ-' . justice_tools_he_date( $fl['appeal_court']['from'] ) . '.' ),
			array( 'name' => $dl['rab_he'], 'url' => $dl['rab_url'], 'text' => $dl['appeal']['section'] . ': ' . $dl['appeal']['he'] . '; ' . $dl['leave']['section'] . ': ' . $dl['leave']['he'] . '; ' . $dl['cross']['section'] . ': ' . $dl['cross']['he'] . '; ' . $dl['absent']['section'] . ': ' . $dl['absent']['he'] . '; ' . $dl['venue']['section'] . ': ' . $dl['venue']['he'] . '; ' . $dl['summons']['section'] . ': ' . $dl['summons']['he'] . '. נוסח עדכני ל-' . justice_tools_he_date( $dl['rab_current_to'] ) . '.' ),
			array( 'name' => $dl['fam_appeal']['law_he'], 'url' => $dl['fam_appeal']['url'], 'text' => $dl['fam_appeal']['section'] . ': ' . $dl['fam_appeal']['he'] . '.' ),
			array( 'name' => $fl['jurisdiction']['law_he'], 'url' => $fl['jurisdiction']['url'], 'text' => $fl['jurisdiction']['exclusive_he'] . '; ' . $fl['jurisdiction']['linked_he'] . '; ' . $fl['jurisdiction']['temp_he'] . '.' ),
			array( 'name' => $reg['divorce_cost']['disputes']['law_he'], 'url' => $reg['divorce_cost']['disputes']['url'], 'text' => $reg['divorce_cost']['meetings_he'] . '. ' . $reg['divorce_cost']['abroad_he'] . '.' ),
			array( 'name' => $reg['inheritance_process']['registrar']['regulation_he'], 'url' => $reg['inheritance_process']['registrar']['url'], 'text' => 'בקשה לצו ירושה או לצו קיום אצל הרשם ' . number_format( (float) $reg['inheritance_process']['registrar']['items']['order']['amount'] ) . ' ₪, בהגשה מקוונת ' . (int) $reg['inheritance_process']['registrar']['online_pct'] . '%; ' . $fl['jurisdiction']['succession_he'] . '.' ),
		);
	}
	// mishmoret (jt41): the sources array, every url and section from fl_mishmoret (and child_support for the support rules).
	if ( 'mishmoret' === $name ) {
		$mm      = $reg['fl_mishmoret'];
		$cs      = $reg['child_support'];
		$checked = justice_tools_he_date( $mm['checked_on'] );
		$hol     = array();
		foreach ( $mm['breaks'] as $b ) {
			$hol[] = $b['he'] . ': ' . $b['text_he'];
		}
		return array(
			array( 'name' => 'משרד החינוך, חוזר מנכ"ל: הודעה 0363 (' . justice_tools_he_date( $mm['stages']['k6']['published'] ) . ')', 'url' => $mm['stages']['k6']['url'], 'text' => 'לוח החופשות והחגים בשנת הלימודים ' . $mm['school_year']['he'] . ' בגני ילדים, בבתי ספר יסודיים ובחטיבות הביניים, ' . $mm['school_year']['sector_he'] . '. סעיף 1: פתיחה ב-' . justice_tools_he_date( $mm['school_year']['first_day'] ) . ', סיום ב-' . justice_tools_he_date( $mm['stages']['k6']['last_day'] ) . ' (גנים ויסודי) וב-' . justice_tools_he_date( $mm['stages']['mid']['last_day'] ) . ' (חטיבות). סעיף 3: ' . implode( '; ', $hol ) . '. נבדק ' . $checked . '.' ),
			array( 'name' => 'משרד החינוך, חוזר מנכ"ל: הודעה 0364 (' . justice_tools_he_date( $mm['stages']['high']['published'] ) . ')', 'url' => $mm['stages']['high']['url'], 'text' => 'לוח שנת הלימודים ' . $mm['school_year']['he'] . ' בחטיבות העליונות: סוכות עד אסרו חג, והלימודים מתחדשים ב-' . justice_tools_he_date( $mm['breaks'][1]['by_stage']['high']['resume'] ) . '; סיום השנה ב-' . justice_tools_he_date( $mm['stages']['high']['last_day'] ) . '.' ),
			array( 'name' => 'משרד החינוך: לוח חופשות, חוזר מנכ"ל', 'url' => $mm['school_year']['page_url'], 'text' => 'שנת הלימודים ' . $mm['school_year']['next_he'] . ' נפתחת ב-' . justice_tools_he_date( $mm['school_year']['next_first_day'] ) . '. ' . $mm['school_year']['next_published_he'] . '. ' . $mm['school_year']['other_sectors_he'] . '.' ),
			array( 'name' => $mm['law']['he'], 'url' => $mm['law']['url'], 'text' => 'סעיף 3: קטין עד ' . (int) $mm['law']['minor_until'] . '; סעיף 14: ההורים האפוטרופסים הטבעיים; סעיף 15: תוכן האפוטרופסות והרשות להחזיק בקטין; סעיף 17: לטובת הקטין; סעיף 18(א): הסכמה, ועניין שאינו סובל דיחוי; סעיף 19: מחלוקת לבית המשפט; סעיף 24: הסכם בין הורים שחיים בנפרד, טעון אישור; סעיף 25: בלי הסכם, לפי טובת הקטין, וילדים עד גיל ' . (int) $mm['law']['tender_until'] . ' אצל אמם אם אין סיבות מיוחדות. נוסח עדכני ל-' . justice_tools_he_date( $mm['law']['current_to'] ) . '.' ),
			array( 'name' => $mm['child_heard']['he'], 'url' => $mm['child_heard']['url'], 'text' => 'פרק ב\', השתתפות ילדים: תקנה 49, זכות הילד להישמע ומשקל לפי גילו ובגרותו; תקנה 50, ההפניה ליחידת הסיוע; תקנה 51(ב), ילד בן ' . (int) $mm['child_heard']['from_age'] . ' לפחות נשמע; 51(ג), בלי ההורים; תקנה 52, בחירת הילד; תקנה 55, חיסיון; תקנה 57, שמיעה באישור הסכם. נוסח עדכני ל-' . justice_tools_he_date( $mm['child_heard']['current_to'] ) . '.' ),
			array( 'name' => $mm['welfare']['he'], 'url' => $mm['welfare']['url'], 'text' => 'סעיף 2: תסקיר של עובד סוציאלי לעניין סדרי דין; סעיף 4: התסקיר נמסר לצדדים; סעיף 5(א): חקירת העובד הסוציאלי.' ),
			array( 'name' => $mm['ruling']['he'] . ' (' . justice_tools_he_date( $mm['ruling']['date'] ) . ')', 'url' => $mm['ruling']['url'], 'text' => 'חוות דעת השופט פוגלמן, פסקה 1: משמורת משפטית ומשמורת פיזית; פסקה 2: חזקת הגיל הרך; פסקה 3: משמורת פיזית משותפת, ' . (int) $mm['ruling']['equal_nights'] . ' לילות ב-' . (int) $mm['ruling']['equal_of'] . ' ימים או ' . (int) $mm['ruling']['equal_month_nights'] . ' ב-' . (int) $mm['ruling']['equal_month_of'] . '. המזונות לפי הגיל: ' . $cs['ruling']['holding_he'] . '; עד גיל ' . (int) $cs['ages']['father_only_to'] . ' (' . $cs['ruling']['paras']['under6'] . ') ומגיל ' . (int) $cs['ages']['equal_from'] . ' (' . $cs['ruling']['paras']['over15'] . '). החישוב במנוע של מחשבון המזונות, שנבדק ב-' . justice_tools_he_date( $cs['checked_on'] ) . '.' ),
			array( 'name' => 'הרשות השופטת: ' . $mm['services']['dispute_he'], 'url' => $mm['services']['dispute_url'], 'text' => 'לפני תביעה בענייני הילדים מגישים בקשה ליישוב סכסוך ונפגשים ביחידת הסיוע.' ),
			array( 'name' => 'הרשות השופטת: ' . $mm['services']['agreement_he'], 'url' => $mm['services']['agreement_url'], 'text' => 'הסכם על זמני השהות והחזקת הילדים מקבל תוקף אחרי אישור בית המשפט (סעיף 24 לחוק הכשרות).' ),
			array( 'name' => 'משרד החינוך: לוח החופשות במעונות יום, ' . $mm['school_year']['he'], 'url' => $mm['school_year']['maonot_url'], 'text' => $mm['school_year']['maonot_he'] . '.' ),
		);
	}
	// yishuv-sichsuch (jt42): the official sources of the clock, each with the sections used and the day it was read.
	if ( 'yishuv-sichsuch' === $name ) {
		$fs      = $reg['fl_sichsuch'];
		$dc      = $reg['divorce_cost'];
		$ds      = $dc['disputes'];
		$p       = $fs['periods'];
		$checked = justice_tools_he_date( $fs['checked_on'] );
		return array(
			array( 'name' => $fs['law_he'], 'url' => $fs['law_url'], 'text' => 'סעיף 2: מה נחשב "תובענה בעניין של סכסוך משפחתי" ומה לא (גירושין בהסכמה, אישור הסכם, ירושה); 3(א): בקשה ליישוב סכסוך לפני כל תביעה, בלי טענות; 3(ב)(1): עד ' . (int) $ds['meetings_max'] . ' פגישות מהו"ת, וההזמנה כמו הזמנה לדיון; 3(ב)(3): בתוך ' . (int) $ds['meetings_days'] . ' ימים, הארכה אחת של ' . (int) $ds['extend_days'] . '; 3(ד): ' . (int) $p['notice_days'] . ' ימים להודעה; 3(ה): עיכוב של ' . (int) $ds['stay_days'] . ' או ' . (int) $ds['stay_days_extended'] . ' ימים, ותקופה נוספת בהסכמה בכתב; 3(ז): סעד דחוף או זמני בכל עת, הצו עומד ' . (int) $p['relief_months'] . ' חודשים; 3(ח1): דיווח על התייצבות; 3(ט): תוקף של פסק דין להסכם; 3(י): תביעה בלי בקשה חדשה בתוך שנה; 4: ' . (int) $ds['claim_days'] . ' ימים למי שהגיש את הבקשה; 4א: הליכים שהחוק לא חל עליהם; 6א: ימי החג שלא נספרים; 7: תחילה ' . justice_tools_he_date( $fs['start']['law'] ) . '. נוסח עדכני כולל תיקון מס\' 3 (מ-' . justice_tools_he_date( $fs['start']['amend3'] ) . '), נבדק ' . $checked . '.' ),
			array( 'name' => $fs['regs_he'], 'url' => $fs['regs_url'], 'text' => 'תקנה 2: טופס 1 לפי הסמכות המקומית; 2א: מה המזכירות מקבלת בלי בקשה; 3: ההזמנה (טופס 2) ועד ' . (int) $p['more_meetings'] . ' פגישות נוספות; 4: מי שלא התייצב; 5: הפגישה הראשונה בלי עורך דין; 6: חיסיון; 7: ההמלצה והמגשר; 8: טופס 3, ההארכה המוסכמת וההודעה על הפסקה (' . (int) $p['stop_claim_days'] . ' ימים); 9: טופס 4; 10 ו-11: סעד זמני (טופס 5), תשובה בתוך ' . (int) $p['response_days'] . ' ימים; 12 ו-13: סעד דחוף (טופס 6); 15(ב): מזונות מיום הבקשה; 16: קיצור והארכה (טופס 7). כולל התיקון מ-' . justice_tools_he_date( $fs['regs_last_amended'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $fs['interpretation_he'], 'url' => $fs['interpretation_url'], 'text' => 'סעיף 10(א): יום האירוע לא נספר; 10(ב): תקופה בחודשים או בשנים נגמרת באותו מספר יום, או ביום האחרון של החודש; 10(ג): ימי מנוחה נספרים, אלא אם הם הימים האחרונים של התקופה.' ),
			array( 'name' => $dc['family']['regulation_he'], 'url' => $dc['family']['url'], 'text' => $dc['family']['items']['request'] . ': בקשה ליישוב סכסוך ' . number_format( (float) $dc['family']['request'] ) . ' ₪, בנוסח העדכני ל-' . justice_tools_he_date( $dc['family']['current_to'] ) . '; תקנה 9: פטור מאגרה בגלל חוסר יכולת.' ),
			array( 'name' => $dc['rabbinical']['regulation_he'], 'url' => $dc['rabbinical']['url'], 'text' => $dc['rabbinical']['items']['request'] . ': בקשה ליישוב סכסוך ' . number_format( (float) $dc['rabbinical']['request'] ) . ' ₪, בנוסח העדכני ל-' . justice_tools_he_date( $dc['rabbinical']['current_to'] ) . '; תקנה 12(ב): בלי הקטנה של אגרה זו.' ),
			array( 'name' => 'הרשות השופטת: בקשה ליישוב סכסוך במשפחה', 'url' => $fs['filing']['family']['url'], 'text' => 'דרכי ההגשה לבית המשפט לענייני משפחה (מזכירות בכל בית משפט במחוז, דואר רשום עם קבלה על האגרה, נט המשפט לעורכי דין בלבד), טפסים 1, 5, 6 ו-7, ומקרים בלי בקשה. הדף עודכן ' . justice_tools_he_date( $fs['filing']['family']['updated'] ) . ', נקרא ' . $checked . '.' ),
			array( 'name' => 'בתי הדין הרבניים: פתיחת תיק ליישוב סכסוך', 'url' => $fs['filing']['rabbinical']['url'], 'text' => 'הגשה מקוונת, בדואר אלקטרוני או במזכירות; צילום תעודת זהות עם ספח ואישור תשלום; אגרה בשרת התשלומים הממשלתי; עיכוב של 60 או 75 ימים ו-15 הימים של מגיש הבקשה. הדף עודכן ' . justice_tools_he_date( $fs['filing']['rabbinical']['updated'] ) . ', נקרא ' . $checked . '.' ),
		);
	}
	// yeduim-batzibur (jt43): every official text the rights map reads, with the sections used and the date.
	if ( 'yeduim-batzibur' === $name ) {
		$fy      = $reg['fl_yeduim'];
		$sv      = $fy['nii']['survivors'];
		$am      = $sv['amounts'];
		$pn      = $reg['prenup'];
		$yr      = $reg['yerusha'];
		$nt      = $fy['notary'];
		$pr      = $fy['property'];
		$checked = justice_tools_he_date( $fy['checked_on'] );
		$c5620   = array();
		foreach ( $pn['cases'] ?? array() as $c ) {
			if ( '5620_24' === ( $c['key'] ?? '' ) ) {
				$c5620 = $c;
			}
		}
		return array(
			array( 'name' => $fy['succession']['law_he'], 'url' => $fy['succession']['url'], 'text' => 'סעיף 55 (מעין צוואה): ' . $fy['succession']['s55_he'] . '. סעיף 57(ג): ' . $fy['succession']['s57c_he'] . '. סעיף 60(א): ' . $fy['succession']['maint_deadline_he'] . '. סעיף 11: חלקו של בן זוג. סעיף 36(א): ביטול צוואה. נוסח עדכני ל-' . justice_tools_he_date( $fy['succession']['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $fy['nii']['law_he'] . ', פרק א\'', 'url' => $fy['nii']['def_url'], 'text' => $fy['nii']['def_section'] . ': ' . $fy['nii']['def_he'] . '. הנוסח המשולב באתר המוסד, נבדק ' . $checked . '.' ),
			array( 'name' => $fy['nii']['law_he'] . ', פרק י"א', 'url' => $sv['url'], 'text' => $sv['section'] . ': אלמנה, להוציא מי שהיתה אשתו פחות מ-' . (int) $sv['min_months'] . ' חודשים (מגיל ' . (int) $sv['older_age'] . ': ' . (int) $sv['min_months_older'] . ') ולא ילדה לו ילד; אלמן, כל עוד יש עמו ילד או שהכנסתו עד התקרה, להוציא אותן תקופות.' ),
			array( 'name' => $fy['nii']['law_he'] . ', פרק י"ד', 'url' => $fy['nii']['claim']['url'], 'text' => $fy['nii']['claim']['section'] . ': תביעה לגמלת כסף תוך ' . (int) $fy['nii']['claim']['months'] . ' חודשים מהיום שנוצרה העילה; ' . $fy['nii']['claim']['late_section'] . ': תביעה מאוחרת משולמת לכל היותר על ' . (int) $fy['nii']['claim']['late_back_months'] . ' החודשים שלפני הגשתה, ומענק רק לפני שחלפו ' . (int) $fy['nii']['claim']['grant_months'] . ' חודשים.' ),
			array( 'name' => 'המוסד לביטוח לאומי: ידועים בציבור', 'url' => $fy['nii']['page_url'], 'text' => $fy['nii']['status_he'] . '. ' . $fy['nii']['proactive_he'] . '. ' . $fy['nii']['form_107_he'] . '. נבדק ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: שאלון מפורט לידועים בציבור (בל/107)', 'url' => $fy['nii']['form_107_url'], 'text' => 'מה השאלון מבקש לצרף: ' . implode( '; ', $fy['nii']['documents_he'] ) . ' (' . $fy['nii']['documents_section'] . ').' ),
			array( 'name' => 'המוסד לביטוח לאומי: שאלון לידועים בציבור כשאחד מבני הזוג נפטר', 'url' => $fy['nii']['form_112_url'], 'text' => $fy['nii']['form_112_he'] . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: קצבה לאלמן ולאלמנה, סכומי הקצבה', 'url' => $sv['amounts_url'], 'text' => 'מ-' . justice_tools_he_date( $sv['amounts_from'] ) . ': בגיל 40 עד 50 בלי ילדים ' . number_format( (float) $am['age40to50'] ) . ' ₪; 50 ומעלה ' . number_format( (float) $am['age50plus'] ) . ' ₪; 80 ומעלה ' . number_format( (float) $am['age80plus'] ) . ' ₪; עם ילד ' . number_format( (float) $am['kid1'] ) . ' ₪; עם שני ילדים ' . number_format( (float) $am['kid2'] ) . ' ₪; לכל ילד נוסף ' . number_format( (float) $am['kid_extra'] ) . ' ₪; מקבלי קצבת אזרח ותיק ' . number_format( (float) $am['half_old_age'] ) . ' ₪. ' . $sv['supplements_he'] . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: אלמנה, אלמן, מענק שאירים', 'url' => $sv['widow_url'], 'text' => 'ידוע/ה בציבור שחי/ה עם הנפטר תחת קורת גג אחת ' . (int) $sv['min_months'] . ' חודשים לפחות (מגיל ' . (int) $sv['older_age'] . ': ' . (int) $sv['min_months_older'] . '); ' . $sv['widow_child_he'] . '; ' . $sv['widower_he'] . ' (התקרה: ' . number_format( (float) $sv['widower_income_cap'] ) . ' ₪ בחודש מ-' . justice_tools_he_date( $sv['widower_cap_from'] ) . '); מתחת לגיל ' . (int) $sv['grant_under_age'] . ' בלי ילדים: ' . $sv['grant_he'] . ', ' . (int) $sv['grant_pensions'] . ' קצבאות; ' . $sv['several_he'] . '.' ),
			array( 'name' => $fy['tax']['law_he'], 'url' => $fy['tax']['url'], 'text' => $fy['tax']['spouse_section'] . ': ' . $fy['tax']['spouse_he'] . '. ' . $fy['tax']['survivors_section'] . ': ' . $fy['tax']['survivors_he'] . '. ' . $fy['tax']['single_parent_section'] . ': נקודות הזיכוי של הורה במשפחה חד-הורית.' ),
			array( 'name' => 'רשות המסים: טופס 101', 'url' => $fy['tax']['form101_url'], 'text' => $fy['tax']['form101_item'] . ': ' . $fy['tax']['single_parent_he'] . '.' ),
			array( 'name' => 'רשות המסים: ' . $fy['tax']['guide_he'], 'url' => $fy['tax']['guide_url'], 'text' => 'עמוד ' . (int) $fy['tax']['guide_page'] . ': ' . $fy['tax']['family_unit_he'] . '.' ),
			array( 'name' => $fy['family_court']['law_he'], 'url' => $fy['family_court']['url'], 'text' => $fy['family_court']['section'] . ': ' . $fy['family_court']['he'] . '; ' . $fy['family_court']['paternity_section'] . ': תובענה לאבהות. נוסח עדכני ל-' . justice_tools_he_date( $fy['family_court']['current_to'] ) . '.' ),
			array( 'name' => $fy['children']['capacity_he'], 'url' => $fy['children']['capacity_url'], 'text' => $fy['children']['guardian_section'] . ': ' . $fy['children']['guardian_he'] . '.' ),
			array( 'name' => $fy['children']['maint_he'], 'url' => $fy['children']['maint_url'], 'text' => $fy['children']['maint_section'] . ': מזונות הילדים; ' . $fy['spousal']['section'] . ': מזונות בן זוג לפי הדין האישי. נוסח עדכני ל-' . justice_tools_he_date( $fy['children']['maint_current_to'] ) . '.' ),
			array( 'name' => $pr['law_he'], 'url' => $pr['law_url'], 'text' => 'החוק ואיזון המשאבים שבו חלים על נשואים' . ( $c5620 ? ' (' . $c5620['he'] . ', פסקה 20)' : '' ) . '. ' . $pn['cohab_he'] . '.' ),
			array( 'name' => $pr['ruling_he'], 'url' => $pr['ruling_url'], 'text' => $pr['applies_para'] . ': ' . $pr['applies_he'] . '; ' . $pr['test_para'] . ': ' . $pr['test_he'] . '; ' . $pr['burden_para'] . ': ' . $pr['burden_he'] . '; ' . $pr['later_para'] . ': ' . $pr['later_he'] . '. העותק באתר הממשלה, ' . (int) $pr['ruling_year'] . '.' ),
			array( 'name' => $fy['pension']['split_he'], 'url' => $fy['pension']['split_url'], 'text' => $fy['pension']['split_section'] . ': ' . $fy['pension']['split_rule_he'] . '.' ),
			array( 'name' => $nt['regulation_he'], 'url' => $nt['url'], 'text' => $nt['item_first'] . ': ' . number_format( (float) $nt['affidavit_first'] ) . ' ₪ למצהיר הראשון; ' . $nt['item_additional'] . ': ' . number_format( (float) $nt['affidavit_additional'] ) . ' ₪ לכל מצהיר נוסף; ' . $nt['fixed_he'] . '. מ-' . justice_tools_he_date( $nt['from'] ) . '.' ),
			array( 'name' => $pn['routes']['court']['fee_he'], 'url' => $pn['routes']['court']['fee_url'], 'text' => $pn['routes']['court']['fee_item'] . ': אישור הסכם, ' . number_format( (float) $pn['routes']['court']['fee'] ) . ' ₪. נבדק ' . justice_tools_he_date( $pn['checked_on'] ) . '.' ),
			array( 'name' => $yr['fees']['regulation_he'], 'url' => $yr['fees']['url'], 'text' => $yr['fees']['section'] . ': בקשה לצו ' . number_format( (float) $yr['fees']['order_fee'] ) . ' ₪ מ-' . justice_tools_he_date( $yr['fees']['from'] ) . '; בהגשה מקוונת ' . number_format( (float) $yr['payments']['online_fee'] ) . ' ₪ ועוד ' . number_format( (float) $yr['payments']['publication'] ) . ' ₪ פרסום (שירות התשלומים).' ),
		);
	}
	if ( 'alut-iska' === $name ) {
		$fl      = $reg['fl_iska'];
		$pt      = $reg['purchase_tax'];
		$sv      = $reg['shevach'];
		$f       = $fl['tabu']['fees'];
		$b       = $fl['bar'];
		$checked = justice_tools_he_date( $fl['checked_on'] );
		return array(
			array( 'name' => $fl['tabu']['regulation_he'], 'url' => $fl['tabu']['url'], 'text' => 'התוספת בנוסח ' . $fl['tabu']['notice_he'] . ', בתוקף מ-' . justice_tools_he_date( $fl['tabu']['from'] ) . ': רישום מכר ' . number_format( (float) $f['sale']['amount'] ) . ' ₪ (' . $f['sale']['item'] . '), הערת אזהרה ' . number_format( (float) $f['warning']['amount'] ) . ' (' . $f['warning']['item'] . '), מחיקתה ' . number_format( (float) $f['warning_delete']['amount'] ) . ' (' . $f['warning_delete']['item'] . '), משכנתה ' . number_format( (float) $f['mortgage']['amount'] ) . ' (' . $f['mortgage']['item'] . '), מחיקת משכנתה בפירעון ישיר לבנק פטורה (' . $f['mortgage_delete_direct']['item'] . ') ובהפקדה בלשכה ' . number_format( (float) $f['mortgage_delete_deposit']['amount'] ) . ' (' . $f['mortgage_delete_deposit']['item'] . '), נסח מקוון ' . number_format( (float) $f['extract_online']['amount'] ) . ' (' . $f['extract_online']['item'] . '). ' . $fl['tabu']['update_he'] . '; ' . $fl['tabu']['payer_he'] . '. נבדק ' . $checked . '.' ),
			array( 'name' => 'משרד המשפטים: עדכון אגרות רישום המקרקעין 2026', 'url' => $fl['tabu']['page_url'], 'text' => 'ההודעה על עדכון האגרות מ-1.1.2026 וקובץ ' . $fl['tabu']['notice_he'] . '.' ),
			array( 'name' => $pt['law_he'], 'url' => $pt['law_url'], 'text' => 'מדרגות מס הרכישה (' . $pt['tracks']['single']['section'] . ', ' . $pt['tracks']['additional']['section'] . '); הצהרת הקונה בתוך ' . $pt['declare_days'] . ' ימים (' . $pt['declare_section'] . ') והמוכר (' . $sv['deadlines']['declare_section'] . '); תשלום בתוך ' . $pt['pay_days'] . ' ימים (' . $pt['pay_section'] . '), אחר כך הצמדה וריבית (' . $pt['late_section'] . '); מקדמה של ' . $fl['advance']['pct_after'] . '% או ' . $fl['advance']['pct_before'] . '% מהמחיר (' . $fl['advance']['section'] . '), ולא כשמבקשים פטור (' . $fl['advance']['exempt_section'] . ').' ),
			array( 'name' => $pt['source_name'], 'url' => $pt['source_url'], 'text' => 'הסכומים של מדרגות מס הרכישה, קפואים עד ' . justice_tools_he_date( $pt['tracks']['single']['to'] ) . '; דירה נוספת בהוראת שעה עד ' . justice_tools_he_date( $pt['tracks']['additional']['to'] ) . '.' ),
			array( 'name' => $pt['vat_he'], 'url' => $pt['vat_url'], 'text' => 'מע"מ ' . $pt['vat_pct'] . '% מ-' . justice_tools_he_date( $pt['vat_from'] ) . ' (ק"ת 11179 מ-28.2.2024), ' . $pt['vat_prior']['pct'] . '% לפני כן; חל על שכר הטרחה ועל דמי התיווך.' ),
			array( 'name' => $b['law_he'] . ', ' . $b['law_section'], 'url' => $b['law_url'], 'text' => $b['law_text_he'] . '.' ),
			array( 'name' => $b['rules_he'], 'url' => $b['url'], 'text' => $b['rule2_he'] . '; ' . $b['vat_he'] . '. ' . $b['drafting']['item'] . ' (עריכת חוזה, לפי השווי), ' . $b['registration']['he'] . ' (' . $b['registration']['item'] . '), ' . $b['registration']['drafted_he'] . '. ' . $b['index_he'] . '.' ),
			array( 'name' => $fl['ethics']['rules_he'], 'url' => $fl['ethics']['url'], 'text' => $fl['ethics']['he'] . '.' ),
			array( 'name' => $fl['services']['declare']['he'], 'url' => $fl['services']['declare']['url'], 'text' => 'הגשת ההצהרה של הקונה ושל המוכר.' ),
		);
	}
	if ( 'dira-mikablan' === $name ) {
		$fl      = $reg['fl_kablan'];
		$checked = justice_tools_he_date( $fl['checked_on'] );
		$nw      = $fl['delay']['new'];
		$od      = $fl['delay']['old'];
		$g       = $fl['guarantee'];
		$ix      = $fl['index'];
		$lm      = (string) $ix['latest_month'];
		$items   = array();
		foreach ( $fl['warranty']['items'] as $it ) {
			$items[] = $it['short_he'] . ' ' . (int) $it['years'];
		}
		return array(
			array( 'name' => $fl['law']['he'], 'url' => $fl['law']['url'], 'text' => 'סעיף 4: תקופת בדק לפי התוספת (' . implode( ', ', $items ) . ' שנים), תקופת אחריות ' . (int) $fl['warranty']['warranty_years'] . ' שנים מתום הבדק, אי-התאמה יסודית ' . (int) $fl['warranty']['fundamental_years'] . ' שנים; סעיף 4א: הודעה תוך שנה על ליקוי גלוי; סעיף 4ב: זכות התיקון; סעיף 5א בשני נוסחים: מ-' . justice_tools_he_date( $nw['from'] ) . ' חודש ראשון בלי פיצוי, חודשים 2-4 דמי שכירות, 5-10 כפול ' . $nw['tiers'][1]['mult'] . ', מ-11 כפול ' . $nw['tiers'][2]['mult'] . '; עד ' . justice_tools_he_date( $od['to'] ) . ' אחרי 60 ימים, חודשים 1-8 כפול ' . $od['tiers'][0]['mult'] . ' ומ-9 כפול ' . $od['tiers'][1]['mult'] . '; סעיף 5ב: ריבית פיגורים אחרי ' . (int) $fl['arrears']['days'] . ' ימים; סעיף 5ג: הצמדה עד ' . (int) $fl['linkage']['max_share_pct'] . '% מכל תשלום, בלי ' . (int) $fl['linkage']['unlinked_first_pct'] . '% הראשונים, עד מועד המסירה שבחוזה; סעיפים 6ב, 6ג ו-7א(ב). נבדק ' . $checked . '.' ),
			array( 'name' => $fl['law']['amend9_page_he'], 'url' => $fl['law']['amend9_url'], 'text' => 'תיקון 9 בתוקף מ-' . justice_tools_he_date( $fl['law']['amend9_from'] ) . ' לחוזים שנחתמו מאותו יום; 20% הראשונים מהמחיר אינם צמודים; מדרגות הפיצוי על איחור. נבדק ' . $checked . '.' ),
			array( 'name' => $g['law_he'], 'url' => $g['url'], 'text' => 'סעיף 2: לא יותר מ-' . (int) $g['free_pct'] . '% מהמחיר בלי בטוחה (ערבות, פוליסה, משכנתה, הערת אזהרה או רישום); סעיף 2א1: הודעה בכתב בחתימה; סעיף 3ב: פנקס שוברים, וערבות או פוליסה תוך ' . (int) $g['days_business'] . ' ימי עסקים מכל תשלום; סעיפים 2(1) ו-3ג2: בלי רכיב המע"מ, שמוחזר מקרן; סעיפים 2א, 3, 3א, 3א1 ו-3ג. נבדק ' . $checked . '.' ),
			array( 'name' => $ix['publisher_he'] . ': ' . $ix['name_he'] . ' (סדרה ' . (int) $ix['code'] . ')', 'url' => $ix['official_calculator_url'], 'text' => 'כל חודש מינואר 2015 עד ' . (int) substr( $lm, 5, 2 ) . '.' . substr( $lm, 0, 4 ) . ' מממשק המדדים (' . $ix['source_url'] . '); בסיס יולי 2011 עד יולי 2025, בסיס יולי 2025 מאוגוסט 2025; מקדם קישור ' . $ix['chaining']['coefficient'] . '. ' . $ix['known_rule_he'] . '. נבדק ' . $checked . '.' ),
			array( 'name' => 'הרשות השופטת: הגשת תביעה קטנה', 'url' => $fl['small_claims_form_url'], 'text' => 'הגשת תביעה על פיצוי שלא שולם, עד תקרת התביעות הקטנות.' ),
		);
	}
	return array();
}

/** The page table of each instrument, rendered by the build from the registry. */
function justice_tools_fl_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}
