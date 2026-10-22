<?php
/**
 * The consumer-law wave (22.10.2026, HAD-593): three new instruments of the consumer cluster, plus the upgraded small-claims
 * tool (tviot-ktanot, whose catalog, answer, stamp and sources stay in inc/justice-tools.php).
 *
 *   [justice_tool name="bitul-iska"]       the cancellation-rights checker: sale type x product x dates x buyer x reason ->
 *                                          can you cancel, the last day, the fee, the refund and its day, the notice
 *                                          (/bitul-iska/, a new page)
 *   [justice_tool name="pitzui-tisa"]      the flight-disruption instrument of the Aviation Services Law: compensation by
 *                                          distance (the 2026 amounts), refund or alternative, assistance, exemptions, the
 *                                          war-time temporary order, the demand, the small claim
 *                                          (/law-compensation-cancellation-2012/; the law's text stays below the guide)
 *   [justice_tool name="pitzui-tzarchan"]  the consumer's remedy and compensation calculator on the cluster hub: what the
 *                                          law gives, the money owed now, s.31A exemplary damages where the law lists the
 *                                          section, the path business -> Authority -> small claim (/consumer-rights-israel/)
 *   [justice_tool_lead name="..."]         the result-first card (inc/justice-tools-rights-2a.php) accepts these names and
 *                                          tviot-ktanot too (mode="fee" on /small-claims-fee-calculator/).
 * The four instruments link to each other with the reader's numbers through each tool's own share state (#s=).
 * Every number is read from assets/data/justice-tools-registry.json (consumer_bitul, consumer_tisa, consumer_pitzui and
 * consumer_ktanot, built by tools/justice_tools_consumer_<lane>.py, and the existing small_claims, car_accident, interest and
 * cpi datasets) or from the snapshot the build renders.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_consumer_names(): array {
	return array( 'bitul-iska', 'pitzui-tisa', 'pitzui-tzarchan' );
}

/** The catalog entries, merged into justice_tools_catalog(). */
function justice_tools_consumer_catalog(): array {
	return array(
		// The consumer-law wave (22.10.2026, HAD-593): the cancellation-rights checker on the NEW page /bitul-iska/ (BLOCK).
		// Bundle: 'bitul-iska' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'bitul-engine.js', 'bitul-ui.js' )
		// (every top-level name in bitul-engine.js starts with "bt" or "BT_"; no name collides with instrument.js, dates.js or
		// sim-handoff.js: checked on the built bundle). The data island needs small_claims (the court fee for the next step and
		// the 7-year limitation date); car_accident is optional (its listed Independence days; dates.js computes them anyway).
		'bitul-iska'     => array(
			'name'      => 'בודק ביטול עסקה',
			'title'     => 'ביטול עסקה: אפשר לבטל? עד מתי, כמה דמי ביטול ומתי מקבלים את הכסף',
			'promise'   => 'לפי סוג העסקה (אינטרנט, טלפון, חנות, רוכלות, מנוי), מה שנקנה, התאריכים והקונה: היום האחרון לביטול, דמי הביטול, ההחזר והיום שבו הוא מגיע, איך מודיעים, הודעת ביטול מוכנה, וקובץ ליומן.',
			'question'  => 'אפשר לבטל את העסקה, עד מתי, וכמה כסף יחזור?',
			'page'      => '/bitul-iska/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'small_claims', 'consumer_bitul' ),
			'dataset'   => 'consumer_bitul',
			'next_text' => 'הצעד הבא: לשלוח את הודעת הביטול בדרך שהחוק מתיר, לשמור אישור משלוח, ולהכניס ליומן את היום שבו הכסף צריך לחזור',
			'primary'   => array( 'label' => 'לתרגל את השיחה עם שירות הלקוחות', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את שיחת הביטול עם שירות הלקוחות', 'topic' => 'contract-dispute', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'העסק לא החזיר את הכסף: תביעה קטנה', 'path' => '/small-claims-court-israel/' ),
				array( 'label' => 'זכויות הצרכן ופיצוי בלי הוכחת נזק', 'path' => '/consumer-rights-israel/' ),
				array( 'label' => 'הרשות להגנת הצרכן: ביטול עסקה', 'url' => 'https://www.gov.il/he/pages/returns' ),
			),
			'lawyer'      => array( 'label' => 'עורך דין לדיני חוזים וצרכנות', 'path' => '/breach-of-contract-israel/' ),
			'sticky'      => 'היום האחרון',
			// The snapshot gives the sticky as HTML ("<bdi>27.10.2026</bdi>"); 'count' keeps the money formatter away.
			'sticky_kind' => 'count',
		),
		// The consumer-law wave (22.10.2026, HAD-593): the flight-disruption instrument on /law-compensation-cancellation-2012/ (articles 5638).
		// Bundle: 'pitzui-tisa' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js as TE', 'tviot-engine.js as TV', 'tisa-engine.js', 'tisa-ui.js' )
		// (reuses limitation() of the road engine as TE: the war window of the Limitation Law and the rest-day move on the 4 years
		// of s.19; and ceilingOn() / fee() of the small-claims engine as TV; every top-level name in tisa-*.js starts with "ts"
		// or is a UI export; no name collides with instrument.js, dates.js or sim-handoff.js). The page keeps the law's text below.
		'pitzui-tisa'    => array(
			'name'      => 'פיצוי על טיסה שבוטלה או איחרה',
			'title'     => 'פיצוי על טיסה שבוטלה, איחרה או שלא הטיסו אתכם',
			'promise'   => 'מה קרה, המרחק וכמה נוסעים: הפיצוי בשקלים לפי סכומי 2026, ההחזר או הכרטיס החלופי, הסיוע לפי שעות האיחור, הפטורים והוראת השעה של המלחמה, המכתב לחברת התעופה, המועדים ליומן והתביעה הקטנה.',
			'question'  => 'כמה פיצוי מגיע על טיסה שבוטלה או איחרה לפי חוק שירותי תעופה?',
			'page'      => '/law-compensation-cancellation-2012/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'car_accident', 'small_claims', 'consumer_tisa' ),
			'dataset'   => 'consumer_tisa',
			'next_text' => 'הצעד הבא: לשלוח לחברת התעופה את הדרישה בכתב, להכניס ליומן את 21 ו-45 הימים, ולתרגל את הדיון בתביעה הקטנה',
			'primary'   => array( 'label' => 'לתרגל את הדיון בתביעה הקטנה', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הדיון בתביעה הקטנה נגד חברת התעופה', 'topic' => 'contract-dispute', 'purpose' => 'court_rehearsal' ),
			'more'      => array(
				array( 'label' => 'תביעה קטנה: הסכום, האגרה והמועדים', 'path' => '/small-claims-court-israel/' ),
				array( 'label' => 'פסק דין: פיצוי על איחור בטיסה', 'path' => '/compensation-flight-delayed/' ),
				array( 'label' => 'חוק שירותי תעופה (נוסח עדכני)', 'url' => 'https://www.nevo.co.il/law_html/law00/119611.htm' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין לתביעות צרכנות', 'path' => '/lawyers/' ),
			'sticky'    => 'הפיצוי',
		),
		// The consumer-law wave (22.10.2026, HAD-593): the consumer's remedy and compensation calculator on the hub
		// /consumer-rights-israel/ (pages 20285, BLOCK).
		// Bundle: 'pitzui-tzarchan' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'hatzmada-engine.js as HZ', 'pitzui-engine.js', 'pitzui-ui.js' )
		// (reuses the CPI and interest engine in its own scope, as HZ, for the shekel interest of ss.13(ב) and 13ד1; every
		// top-level name in pitzui-*.js starts with "pz"/"PZ" or is a UI export; no name collides with instrument.js, dates.js or
		// sim-handoff.js). The data island needs interest + cpi because HZ.compute() reads both.
		'pitzui-tzarchan' => array(
			'name'      => 'פיצוי הצרכן',
			'title'     => 'חוק הגנת הצרכן במקרה שלכם: מה מגיע, עד מתי, וכמה פיצוי',
			'promise'   => 'מה קרה, התאריכים והמחיר: מה החוק נותן (תיקון, החזר, סיום מנוי, המחיר שהוצג), הסכום שהעסק חייב עכשיו, המועדים, פיצויים לדוגמה עד המקסימום שבחוק, מכתב דרישה, והדרך מהעסק לרשות ולתביעה קטנה.',
			'question'  => 'מה מגיע לי לפי חוק הגנת הצרכן, וכמה פיצוי אפשר לדרוש?',
			'page'      => '/consumer-rights-israel/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'consumer_pitzui', 'small_claims', 'interest', 'cpi' ),
			'dataset'   => 'consumer_pitzui',
			'next_text' => 'הצעד הבא: לשלוח לעסק את מכתב הדרישה, להכניס את המועדים ליומן, ולתרגל את השיחה עם השירות לפני תביעה קטנה',
			'primary'   => array( 'label' => 'לתרגל את השיחה עם העסק', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם העסק לפני תביעה', 'topic' => 'contract-dispute', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'תביעה קטנה עם הסכומים שלכם', 'path' => '/small-claims-court-israel/' ),
				array( 'label' => 'עוד אפשר לבטל? בדיקת זכות הביטול', 'path' => '/bitul-iska/' ),
				array( 'label' => 'פנייה לרשות להגנת הצרכן (gov.il)', 'url' => 'https://www.gov.il/he/service/filing_a_complaint_to_fair_trade_authority' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין לדיני צרכנות וחוזים', 'path' => '/lawyers/' ),
			// The snapshot gives the sticky as HTML (ils of the money owed now).
			'sticky'    => 'מגיע עכשיו',
		),
	);
}

/** The answer box: one paragraph, every figure from the registry, ending with the check date. */
function justice_tools_consumer_answer( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	// bitul-iska (jt64): the answer box. One paragraph, every figure from reg.consumer_bitul (the law, the regulations).
	if ( 'bitul-iska' === $name && ! empty( $reg['consumer_bitul'] ) ) {
		$b    = $reg['consumer_bitul'];
		$text = '<strong>ביטול עסקה</strong> לפי ' . esc_html( $b['law']['he'] ) . ': בקנייה באינטרנט או בטלפון אפשר לבטל מיום העסקה ועד <bdi>' . (int) $b['distance']['days'] . '</bdi> ימים מקבלת המוצר או המסמך בכתב (' . esc_html( $b['distance']['section'] ) . '), '
			. 'ואזרח ותיק, אדם עם מוגבלות או עולה חדש עד <bdi>' . (int) $b['special']['months'] . '</bdi> חודשים כשהעסקה כללה שיחה (' . esc_html( $b['special']['distance_section'] ) . '). '
			. 'דמי הביטול: <bdi>' . (int) $b['fee']['pct'] . '%</bdi> או ' . justice_tools_money( $b['fee']['cap'], 0 ) . ', הנמוך, ובלי דמי ביטול בפגם או באיחור; הכסף חוזר בתוך <bdi>' . (int) $b['distance']['refund_days'] . '</bdi> ימים. '
			. 'בחנות: לפי רשימת המוצרים שבתקנות. נבדק ' . esc_html( justice_tools_he_date( $b['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// pitzui-tisa (jt66): the answer box. One paragraph, every figure from reg.consumer_tisa (the First Schedule as updated
	// for 2026, the 8 hours of s.1, 21 and 45 days of s.3(a), 14 days of s.6(c), the 4 years of s.19).
	if ( 'pitzui-tisa' === $name && ! empty( $reg['consumer_tisa']['amounts']['bands'] ) ) {
		$ct    = $reg['consumer_tisa'];
		$bands = $ct['amounts']['bands'];
		$text  = '<strong>חוק שירותי תעופה</strong> מזכה נוסע שטיסתו מישראל או לישראל בוטלה, או המריאה באיחור של <bdi>' . (int) $ct['defs']['cancelled_hours'] . '</bdi> שעות ומעלה, בפיצוי כספי לפי מרחק הטיסה: '
			. justice_tools_money( $bands[0]['amount'], 0 ) . ', ' . justice_tools_money( $bands[1]['amount'], 0 ) . ' או ' . justice_tools_money( $bands[2]['amount'], 0 ) . ' לנוסע (סכומי <bdi>' . (int) $ct['amounts']['year'] . '</bdi>, התוספת הראשונה), '
			. 'ובנוסף להחזר בתוך <bdi>' . (int) $ct['benefits']['refund_days'] . '</bdi> ימים או לכרטיס חלופי, לבחירתו. הפיצוי משולם בתוך <bdi>' . (int) $ct['benefits']['comp_days'] . '</bdi> ימים מפנייה בכתב; '
			. 'הודעה <bdi>' . (int) $ct['cancel']['notice_full_days'] . '</bdi> ימים מראש פוטרת ממנו. התביעה מתיישנת אחרי <bdi>' . (int) $ct['limitation']['years'] . '</bdi> שנים. נבדק ' . esc_html( justice_tools_he_date( $ct['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// pitzui-tzarchan (jt67): the answer box of the hub. One paragraph, every figure from the registry (consumer_pitzui; the
	// small-claims ceiling from small_claims). The first sentence answers "חוק הגנת הצרכן" (definition + the law's number).
	if ( 'pitzui-tzarchan' === $name && ! empty( $reg['consumer_pitzui'] ) && ! empty( $reg['small_claims']['ceiling'] ) ) {
		$cp    = $reg['consumer_pitzui'];
		$small = end( $reg['small_claims']['ceiling'] );
		$text  = '<strong>' . esc_html( $cp['law']['he'] ) . '</strong> מגן על מי שקונה מעסק לשימוש אישי, ביתי או משפחתי: אסור להטעות, חובה לגלות פגם ולהציג מחיר כולל, '
			. 'ויש בו זכויות ביטול, החזר ואחריות. ביטול מכר מרחוק: החזר בתוך <bdi>' . (int) $cp['distance']['refund_days'] . '</bdi> ימים, ודמי ביטול עד <bdi>' . (int) $cp['distance']['fee_pct'] . '%</bdi> או ' . justice_tools_money( $cp['distance']['fee_max'], 0 ) . ', הנמוך (' . esc_html( $cp['distance']['mind_section'] ) . '). '
			. 'במקרים שהחוק מונה, בית משפט רשאי לפסוק פיצויים לדוגמה בלי הוכחת נזק עד ' . justice_tools_money( $cp['comp31a']['max'], 0 ) . ' (' . esc_html( $cp['comp31a']['section'] ) . '); '
			. 'תביעה קטנה עד ' . justice_tools_money( $small['amount'], 0 ) . '. נבדק ' . esc_html( justice_tools_he_date( $cp['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '';
}

/** The data stamp in the tool's header. */
function justice_tools_consumer_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'bitul-iska' === $name ) {
		$b = $reg['consumer_bitul'] ?? array();
		return 'חוק הגנת הצרכן, נוסח ל-' . justice_tools_he_date( $b['law']['current_to'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $b['checked_on'] ?? '' );
	}
	if ( 'pitzui-tisa' === $name ) {
		$ct = $reg['consumer_tisa'] ?? array();
		return 'חוק שירותי תעופה, נוסח ל-' . justice_tools_he_date( $ct['law']['current_to'] ?? '' ) . ', סכומי ' . (int) ( $ct['amounts']['year'] ?? 0 ) . ' · נבדק ' . justice_tools_he_date( $ct['checked_on'] ?? '' );
	}
	if ( 'pitzui-tzarchan' === $name ) {
		$cp = $reg['consumer_pitzui'] ?? array();
		return 'חוק הגנת הצרכן, נוסח ל-' . justice_tools_he_date( $cp['law']['current_to'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $cp['checked_on'] ?? '' );
	}
	return 'נבדק ' . justice_tools_he_date( justice_tools_checked_on( $name ) );
}

/** Official sources used by each instrument's result. */
function justice_tools_consumer_sources( string $name ): array {
	$reg = justice_tools_registry();
	if ( 'bitul-iska' === $name ) {
		$b       = $reg['consumer_bitul'];
		$checked = justice_tools_he_date( $b['checked_on'] );
		$s       = $b['store'];
		$d       = $b['distance'];
		$sp      = $b['special'];
		$f       = $b['fee'];
		$p       = $b['psl'];
		return array(
			array( 'name' => $b['law']['he'], 'url' => $b['law']['url'], 'text' => $b['policy']['section'] . ' מדיניות החזרה בחנות; ' . $b['ongoing']['section'] . ' סיום עסקה מתמשכת בתוך ' . (int) $b['ongoing']['end_business_days'] . ' ימי עסקים (' . (int) $b['ongoing']['end_business_days_mail'] . ' בדואר רשום); ' . $b['door']['section'] . ' רוכלות ' . (int) $b['door']['days'] . ' ימים; ' . $d['section'] . ' מכר מרחוק ' . (int) $d['days'] . ' ימים; ' . $d['travel_section'] . '; ' . $sp['distance_section'] . ' ' . (int) $sp['months'] . ' חודשים; ' . $d['abroad_section'] . '; ' . $d['refund_section'] . ' החזר בתוך ' . (int) $d['refund_days'] . ' ימים ודמי ביטול ' . (int) $f['pct'] . '% או ' . (int) $f['cap'] . ' ש"ח; ' . $b['voucher']['section'] . ' שובר זיכוי; ' . $b['channels_section'] . ' דרכי ההודעה; ' . $b['comp']['section'] . ' פיצויים לדוגמה; ' . $b['mislead']['section'] . ' הטעיה. נוסח עדכני ל-' . justice_tools_he_date( $b['law']['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $b['regs']['he'], 'url' => $b['regs']['url'], 'text' => 'תקנה 1: טובין מעל ' . (int) $s['min_price'] . ' ש"ח; תקנה 2: ' . (int) $s['receipt_days'] . ' ימים מקבלת המוצר לפריטים 1 עד 6 ו-23, ' . (int) $s['nonrest_days_after'] . ' ימים שאינם ימי מנוחה לביגוד ולתכשיט עד ' . number_format( (float) $s['jewel_max'] ) . ' ש"ח, ' . (int) $s['before_service_nonrest'] . ' ימים שאינם ימי מנוחה לפני נופש או קורס; ' . $s['refund_section'] . ' החזר בתוך ' . (int) $s['refund_business_days'] . ' ימי עסקים; ' . $f['regs_section'] . ' דמי ביטול; תקנה 6 החריגים. פורסמו ' . justice_tools_he_date( $b['regs']['published'] ) . ' (' . $b['regs']['gazette_he'] . '), בתוקף מ-' . justice_tools_he_date( $b['regs']['in_force'] ) . '; נוסח עדכני ל-' . justice_tools_he_date( $b['regs']['current_to'] ) . '.' ),
			array( 'name' => $b['interpretation']['he'], 'url' => $b['interpretation']['url'], 'text' => $b['interpretation']['until_section'] . ' "עד" כולל; ' . $b['interpretation']['first_day_section'] . ' היום הראשון לא נספר; ' . $b['interpretation']['months_section'] . ' חודשים; ' . $b['interpretation']['rest_section'] . ' יום אחרון שהוא יום מנוחה.' ),
			array( 'name' => $p['he'], 'url' => $p['url'], 'text' => $p['authz_section'] . ' ביטול הרשאה לחיוב בכל עת; ' . $p['stop_section'] . ' לא יאוחר מ-' . (int) $p['stop_business_days'] . ' יום עסקים; ' . $p['charge_section'] . ' ביטול חיוב בתוך ' . (int) $p['charge_cancel_business_days'] . ' ימי עסקים; ' . $p['guaranteed_section'] . ' עצירת תשלום מובטח כשהמוצר לא סופק. נוסח בנק ישראל ל-' . justice_tools_he_date( $p['current_to'] ) . ', בתוקף מ-' . justice_tools_he_date( $p['in_force'] ) . '.' ),
			array( 'name' => $sp['amendment_he'], 'url' => $sp['url'], 'text' => 'ספר החוקים ' . justice_tools_he_date( $sp['published'] ) . ': ארבעה חודשים לאדם עם מוגבלות, לאזרח ותיק ולעולה חדש; תחילה ' . (int) $sp['in_force_days'] . ' ימים מהפרסום (' . justice_tools_he_date( $sp['in_force'] ) . ').' ),
			array( 'name' => $b['authority']['he'] . ': ביטול עסקה באינטרנט ובחנויות', 'url' => $b['authority']['page_url'], 'text' => 'איך הרשות מיישמת את הכללים בחנות ובמכר מרחוק. עודכן ' . justice_tools_he_date( $b['authority']['page_updated'] ) . ', נקרא ' . $checked . '.' ),
		);
	}
	if ( 'pitzui-tisa' === $name ) {
		$ct      = $reg['consumer_tisa'];
		$sc      = $reg['small_claims'];
		$checked = justice_tools_he_date( $ct['checked_on'] );
		$small   = end( $sc['ceiling'] );
		$bands   = $ct['amounts']['bands'];
		$w       = $ct['war'];
		$dm      = $ct['domestic'];
		$bases   = array();
		foreach ( $dm['lines'] as $l ) {
			$bases[] = number_format( (float) $l['base'] );
		}
		return array(
			array( 'name' => $ct['law']['he'], 'url' => $ct['law']['url'], 'text' => $ct['defs']['section'] . ' טיסה שבוטלה: ' . (int) $ct['defs']['cancelled_hours'] . ' שעות; ' . $ct['conditions']['section'] . ' ו' . $ct['conditions']['none_section'] . ' תנאים; ' . $ct['benefits']['refund_section'] . ' החזר בתוך ' . (int) $ct['benefits']['refund_days'] . ' ימים; ' . $ct['benefits']['comp_section'] . ' פיצוי בתוך ' . (int) $ct['benefits']['comp_days'] . ' ימים; ' . $ct['refund']['section'] . '; ' . $ct['denied']['section'] . ' סירוב להטיס; ' . $ct['cancel']['section'] . ' ביטול, הודעה מראש ופטורים; ' . $ct['delay']['section'] . ' איחור; ' . $ct['advance']['section'] . ' הקדמה; ' . $ct['downgrade']['section'] . '; ' . $ct['special']['section'] . ' מצב מיוחד; ' . $ct['exemplary']['section'] . ' פיצויים לדוגמה עד ' . number_format( (float) $ct['exemplary']['max'] ) . ' ש"ח; ' . $ct['distance']['section'] . ' מרחק; ' . $ct['amounts']['update_section'] . ' עדכון; ' . $ct['limitation']['section'] . ' ' . (int) $ct['limitation']['years'] . ' שנים. נוסח עדכני ל-' . justice_tools_he_date( $ct['law']['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => 'התוספת הראשונה לחוק: סכומי ' . (int) $ct['amounts']['year'], 'url' => $ct['amounts']['url'], 'text' => 'עד 2,000 ק"מ ' . number_format( (float) $bands[0]['amount'] ) . ' ש"ח; עד 4,500 ק"מ ' . number_format( (float) $bands[1]['amount'] ) . ' ש"ח; מעל 4,500 ק"מ ' . number_format( (float) $bands[2]['amount'] ) . ' ש"ח, לנוסע, מ-' . justice_tools_he_date( $ct['amounts']['from'] ) . '. ' . $ct['amounts']['update_he'] . '.' ),
			array( 'name' => 'מאגר החקיקה הלאומי של הכנסת: החוק ותיקוניו', 'url' => $ct['law']['knesset_url'], 'text' => 'החוק המקורי (' . $ct['law']['original_he'] . '), הוראות השעה של הקורונה (2020) ותיקון מס\' 2 והוראת שעה – חרבות ברזל (' . justice_tools_he_date( $w['published'] ) . '). נקרא ' . $checked . '.' ),
			array( 'name' => $w['he'], 'url' => $w['url'], 'text' => 'ספר החוקים ' . (int) $w['booklet'] . ', ' . justice_tools_he_date( $w['published'] ) . ', עמ\' ' . (int) $w['page'] . ': ' . $w['nocomp_section'] . ' בלי פיצוי כספי לטיסות שמועדן ב-4 תקופות; ' . $w['notice_section'] . ' ' . justice_tools_he_date( $w['notice_from'] ) . ' עד ' . justice_tools_he_date( $w['notice_to'] ) . ' עם הודעה של ' . (int) $w['notice_days'] . ' ימים; ' . $w['judgments_section'] . '; ' . $w['stopped_section'] . '.' ),
			array( 'name' => $dm['he'], 'url' => $dm['url'], 'text' => $dm['def_section'] . ' ביטול: ' . (int) $dm['cancelled_hours'] . ' שעות איחור; ' . $dm['amounts_section'] . ' סכומי בסיס ' . implode( ' / ', $bases ) . ' ש"ח; ' . $dm['update_section'] . ' עדכון שנתי. נוסח עדכני ל-' . justice_tools_he_date( $dm['current_to'] ) . '.' ),
			array( 'name' => 'חוק ההתיישנות, התשי"ח-1958', 'url' => $ct['limitation']['url'], 'text' => $ct['limitation']['war_section'] . ': ' . $ct['limitation']['war_he'] . '.' ),
			array( 'name' => $ct['rep']['law_he'], 'url' => $ct['rep']['url'], 'text' => $ct['rep']['section'] . ': ' . $ct['rep']['he'] . '.' ),
			array( 'name' => 'רשות התעופה האזרחית: נציגים לקבלת כתבי בי-דין', 'url' => $ct['court_reps']['url'], 'text' => $ct['court_reps']['he'] . '; ' . $ct['court_reps']['note_he'] . '. נקרא ' . $checked . '.' ),
			array( 'name' => 'משרד התחבורה: הודעות עדכון הסכומים', 'url' => $ct['amounts']['notices'][0]['url'], 'text' => 'הודעות לפי ' . $ct['amounts']['update_section'] . ' שפורסמו בילקוט הפרסומים (' . $ct['amounts']['notices'][0]['he'] . '; ' . $ct['amounts']['notices'][1]['he'] . ').' ),
			array( 'name' => $sc['name_he'] . ': ' . $sc['source_name'], 'url' => $sc['source_url'], 'text' => 'תקרת תביעה קטנה ' . number_format( (float) $small['amount'] ) . ' ש"ח מ-' . justice_tools_he_date( $small['from'] ) . '; האגרה ' . $sc['fee']['section'] . ': ' . (int) $sc['fee']['pct'] . '%, לפחות ' . (int) $sc['fee']['min'] . ' ש"ח.' ),
		);
	}
	if ( 'pitzui-tzarchan' === $name ) {
		$cp      = $reg['consumer_pitzui'];
		$sc      = $reg['small_claims'];
		$checked = justice_tools_he_date( $cp['checked_on'] );
		$small   = end( $sc['ceiling'] );
		$law     = $cp['law'];
		$d       = $cp['distance'];
		$c       = $cp['continuing'];
		$w       = $cp['warranty'];
		$t       = $cp['tech'];
		$s       = $cp['sanctions'];
		$a       = $cp['authority'];
		return array(
			array( 'name' => $law['he'], 'url' => $law['url'], 'text' => 'סעיף 1 (צרכן, עוסק); סעיף 2 הטעיה; סעיף 4 גילוי; סעיף 4ג מדיניות החזרה (' . (int) $cp['map']['return_policy_days'] . ' ימים); סעיף 13(ב) מקדמה וריבית שקלית; סעיף 13א עסקה לתקופה קצובה; ' . $c['end_section'] . ' סיום עסקה מתמשכת בתוך ' . (int) $c['end_business_days'] . ' ימי עסקים (' . (int) $c['end_registered_days'] . ' בדואר רשום); ' . $c['excess_section'] . ' חיוב עודף; ' . $d['section'] . ' ו-14ה מכר מרחוק: החזר בתוך ' . (int) $d['refund_days'] . ' ימים, דמי ביטול עד ' . (int) $d['fee_pct'] . '% או ' . (int) $d['fee_max'] . ' ש"ח; ' . $cp['price']['section'] . ' המחיר המחייב; ' . $t['comp_section'] . ' איחור טכנאי: ' . (int) $t['tiers'][0]['amount'] . ' או ' . (int) $t['tiers'][1]['amount'] . ' ש"ח; ' . $cp['tort']['section'] . ' עוולה; ' . $cp['comp31a']['section'] . ' פיצויים לדוגמה עד ' . number_format( (float) $cp['comp31a']['max'] ) . ' ש"ח (' . $cp['comp31a']['aggravated_section'] . ': עד ' . number_format( (float) $cp['comp31a']['max_aggravated'] ) . '); ' . $cp['mislead_cancel']['section'] . ' ביטול בשל הטעיה; ' . $law['binding_section'] . '; ' . $law['scope_section'] . '. נוסח עדכני ל-' . justice_tools_he_date( $law['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $law['he'] . ': עיצום כספי (פרק ה1)', 'url' => $law['url'], 'text' => $s['tiers']['a']['section'] . ': ' . number_format( (float) $s['tiers']['a']['corp'] ) . ' ש"ח לתאגיד, ' . number_format( (float) $s['tiers']['a']['person'] ) . ' ליחיד; ' . $s['tiers']['b']['section'] . ': ' . number_format( (float) $s['tiers']['b']['corp'] ) . ' ו-' . number_format( (float) $s['tiers']['b']['person'] ) . '; ' . $s['tiers']['b1']['section'] . ': ' . number_format( (float) $s['tiers']['b1']['corp'] ) . ' ו-' . number_format( (float) $s['tiers']['b1']['person'] ) . '; ' . $s['aggravated_section'] . ' פי 1.5; ' . $s['continuing_section'] . ' חלק החמישים ליום; ' . $s['repeat_section'] . ' מחצית; ' . $s['order_section'] . ' פי 3. ' . $s['amounts_note_he'] . '.' ),
			array( 'name' => $w['he'], 'url' => $w['url'], 'text' => 'תקנה 1: שנת אחריות, טובין במחיר מעל ' . (int) $w['min_price'] . ' ש"ח; תקנה 2 תיקון חינם; תקנה 3 חלקי חילוף; תקנה 6(ג) החלפה או השבה; תקנה 10: ' . (int) $w['home_days'] . ' ימים בבית, ' . (int) $w['station_days'] . ' בתחנת שירות, ' . (int) $w['shop_days'] . ' בנקודת המכירה, ' . (int) $w['seller_days'] . ' כשהמוכר אחראי, בלי שבתות וחגים; התוספת השנייה: יום עד 3 ימים כשהקלקול מונע שימוש; תקנה 11 טכנאי; תקנות 12-14 תעודת אחריות. ' . $w['reshumot_he'] . '; נוסח עדכני ל-' . justice_tools_he_date( $w['current_to'] ) . '.' ),
			array( 'name' => $cp['store_regs']['he'], 'url' => $cp['store_regs']['url'], 'text' => $cp['store_regs']['refund_section'] . ': החזר עד ' . (int) $cp['store_regs']['refund_business_days'] . ' ימי עסקים; ' . $cp['store_regs']['fee_section'] . ': דמי ביטול ' . (int) $cp['store_regs']['fee_pct'] . '% או ' . (int) $cp['store_regs']['fee_max'] . ' ש"ח, הנמוך; טובין מעל ' . (int) $cp['store_regs']['min_price'] . ' ש"ח. נוסח עדכני ל-' . justice_tools_he_date( $cp['store_regs']['current_to'] ) . '.' ),
			array( 'name' => 'הרשות להגנת הצרכן ולסחר הוגן: פניות הציבור', 'url' => $a['complaint_url'], 'text' => 'פנייה בטופס מקוון, ללא תשלום, אפשר בעילום שם; מצרפים ' . $a['attach_he'] . '. הדף עודכן ' . justice_tools_he_date( $a['page_updated'] ) . '.' ),
			array( 'name' => 'הרשות להגנת הצרכן ולסחר הוגן: ' . $a['report_he'], 'url' => $a['report_url'], 'text' => number_format( (float) $a['inquiries'] ) . ' פניות ציבור בשנת ' . (int) $a['report_year'] . ' (' . number_format( (float) $a['inquiries_prev'] ) . ' בשנה הקודמת); ' . (int) $a['charge_notices'] . ' הודעות על כוונת חיוב בסך ' . number_format( (float) $a['charge_amount'] ) . ' ש"ח; ' . (int) $a['warnings'] . ' התראות מנהליות.' ),
			array( 'name' => 'הרשות להגנת הצרכן: ביטול עסקה באינטרנט ובחנויות', 'url' => $a['returns_url'], 'text' => 'ההסבר הרשמי לזכויות הביטול במכר מרחוק ובחנות.' ),
			array( 'name' => $sc['name_he'], 'url' => $sc['service_url'], 'text' => 'תקרה ' . number_format( (float) $small['amount'] ) . ' ש"ח מ-' . justice_tools_he_date( $small['from'] ) . '; אגרה ' . (int) $sc['fee']['pct'] . '% מעוגלת כלפי מעלה ל-' . (int) $sc['fee']['round_up_to'] . ' ש"ח, לפחות ' . (int) $sc['fee']['min'] . ' ש"ח (' . $sc['fee']['section'] . ').' ),
			array( 'name' => $reg['interest']['regulations_he'], 'url' => $reg['interest']['regulations_url'], 'text' => 'הריבית השקלית לפי רבעון, שהכלי מוסיף לפי סעיפים 13(ב) ו-13ד1 לחוק הגנת הצרכן.' ),
		);
	}
	return array();
}

/** The page table of each instrument, rendered by the build from the registry. */
function justice_tools_consumer_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}
