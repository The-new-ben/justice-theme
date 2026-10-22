<?php
/**
 * The medical-malpractice wave (22.10.2026, HAD-594): four instruments of the malpractice cluster.
 *
 *   [justice_tool name="tik-rashlanut"]      "do I have a case": the five elements (duty, breach, causation, damage,
 *                                            informed consent) by the reader's facts, what proves each, the burden notes,
 *                                            the expert opinion of reg. 87, the evidence to gather, the parallel tracks and
 *                                            the plain last day to sue (/what-is-medical-malpractice-definition-examples/;
 *                                            also embedded on /medical-malpractice-lawyer-birth-recommended/)
 *   [justice_tool name="bakashat-reshuma"]   the medical-records request: who may ask, the section, the maximum payment by the
 *                                            regulations and the Ministry's tariff, retention periods, and a ready letter
 *                                            (Word, print, copy) (/obtaining-medical-records-copy/)
 *   [justice_tool name="shaon-refui"]        the malpractice limitation clock: 7 years from the cause of action, late
 *                                            discovery, the 10-year cap of s.89(2), a minor, incapacity, death, the war
 *                                            window and rest days (/medical-malpractice-statute-of-limitations/)
 *   [justice_tool name="alut-tviaa-refuit"]  the cost of a claim: which court, the court fee and who pays it at each ending,
 *                                            expert opinions, the lawyer's fee with VAT, the net to the family, legal aid
 *                                            (/medical-malpractice-cost/)
 *   [justice_tool_lead name="..."]           the result-first card (inc/justice-tools-rights-2a.php) accepts these names.
 * The four instruments link to each other with the reader's facts through each tool's own share state (#s=), and each
 * hands the computed facts to the jus-tice.com simulation for an expert-witness cross-examination rehearsal
 * (topic medical-malpractice, purpose witness_prep). Every number is read from assets/data/justice-tools-registry.json
 * (malpractice_tik, malpractice_reshuma, malpractice_hityashnut and malpractice_mechir, built by
 * tools/justice_tools_malpractice_<lane>.py, and the existing car_accident, injury_sheon and small_claims datasets) or from
 * the snapshot the build renders.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_malpractice_names(): array {
	return array( 'tik-rashlanut', 'bakashat-reshuma', 'shaon-refui', 'alut-tviaa-refuit' );
}

/** The catalog entries, merged into justice_tools_catalog(). */
function justice_tools_malpractice_catalog(): array {
	return array(
		// The medical-malpractice wave (22.10.2026, HAD-594): the case check on /what-is-medical-malpractice-definition-examples/
		// (articles 9648); the integrator also embeds it on /medical-malpractice-lawyer-birth-recommended/ (articles 11834, see
		// parts/tik/birth-page.html).
		// Bundle: 'tik-rashlanut' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js as TE', 'tik-engine.js', 'tik-ui.js' )
		// (reuses limitation() of the wave-4 road engine in its own scope, as TE: 7 years, from 18 for a minor, the war window, rest
		// days; every top-level name in tik-*.js starts with "tk"/"TK" or is a UI export; no name collides with instrument.js,
		// dates.js or sim-handoff.js; checked on the built bundle: 124 top-level names, no duplicate).
		'tik-rashlanut'  => array(
			'name'      => 'בדיקת תיק רשלנות רפואית',
			'title'     => 'יש לי תיק? חמשת היסודות של רשלנות רפואית, מה מוכיח כל אחד ומה חסר',
			'promise'   => 'לפי מה שקרה (לידה, ניתוח, אבחון, הרדמה, תרופה, שיניים או רק ההסבר): אילו יסודות העובדות כבר מראות, מה צריך להוכיח ובמה, מתי הנטל עובר לרופא, איזו חוות דעת חובה לצרף, אילו מסמכים לבקש, המסלולים במקביל לתביעה והיום האחרון לתביעה.',
			'question'  => 'איך מוכיחים רשלנות רפואית, ומה עוד חסר בתיק?',
			'page'      => '/what-is-medical-malpractice-definition-examples/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'car_accident', 'malpractice_tik' ),
			'dataset'   => 'malpractice_tik',
			'next_text' => 'הצעד הבא: לבקש את התיק הרפואי, לבדוק את היום האחרון לתביעה, ולתרגל חקירה נגדית של המומחה הרפואי של הצד השני',
			'primary'   => array( 'label' => 'לתרגל חקירה נגדית של המומחה', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל חקירה נגדית של המומחה הרפואי מטעם בית החולים', 'topic' => 'medical-malpractice', 'purpose' => 'witness_prep' ),
			'more'      => array(
				array( 'label' => 'מכתב לקבלת התיק הרפואי', 'path' => '/obtaining-medical-records-copy/' ),
				array( 'label' => 'השעון: התיישנות ברשלנות רפואית', 'path' => '/medical-malpractice-statute-of-limitations/' ),
				array( 'label' => 'חוק זכויות החולה (נוסח עדכני)', 'url' => 'https://www.nevo.co.il/law_html/law00/71833.htm' ),
			),
			'lawyer'      => array( 'label' => 'עורך דין רשלנות רפואית', 'path' => '/medical-malpractice-lawyer/' ),
			'sticky'      => 'יסודות שהעובדות מראות',
			// The snapshot gives the sticky as HTML ("<bdi>2</bdi> מתוך 5"); 'count' keeps the money formatter away.
			'sticky_kind' => 'count',
		),
		// The medical-malpractice wave (22.10.2026, HAD-594): the medical-records request generator on
		// /obtaining-medical-records-copy/ (pages 24774, CLASSIC).
		// Bundle: 'bakashat-reshuma' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'word-document.js', 'reshuma-engine.js', 'reshuma-ui.js' )
		// (the letter is written as Word in the page through word-document.js, as the rental-contract generator does; every
		// top-level name in reshuma-*.js starts with "rs" or is a UI export; no name collides with instrument.js, dates.js,
		// sim-handoff.js or word-document.js). The data island needs car_accident for the Independence days (the rest-day rule
		// of reg. 3(d)'s 30 days) and the age of 18 of the Limitation Law s.10.
		'bakashat-reshuma' => array(
			'name'      => 'בקשת התיק הרפואי',
			'title'     => 'קבלת העתק רשומה רפואית: הזכות, העלות והמכתב מוכן',
			'promise'   => 'מי מבקש, ממי ומה: הסעיף שנותן את הזכות, התשלום המרבי לפי התקנות והתעריפון, מה מצרפים, מה ניתן בלי תשלום, כמה זמן בית החולים שומר כל מסמך, ומכתב בקשה מוכן להורדה, להדפסה או להעתקה.',
			'question'  => 'איך מקבלים העתק מהתיק הרפואי, מי רשאי לבקש, וכמה מותר לגבות על זה?',
			'page'      => '/obtaining-medical-records-copy/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'car_accident', 'malpractice_reshuma' ),
			'dataset'   => 'malpractice_reshuma',
			'next_text' => 'הצעד הבא: לשלוח את המכתב למוסד, לבקש לשמור את הרשומה המקורית, ולבדוק שכל המסמכים הגיעו',
			'primary'   => array( 'label' => 'לתרגל חקירה נגדית של המומחה', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל חקירה נגדית של המומחה הרפואי מטעם בית החולים', 'topic' => 'medical-malpractice', 'purpose' => 'witness_prep' ),
			'more'      => array(
				array( 'label' => 'עד מתי אפשר לתבוע על רשלנות רפואית', 'path' => '/medical-malpractice-statute-of-limitations/' ),
				array( 'label' => 'נזק ראייתי: כשחסר מסמך ברשומה', 'path' => '/evidentiary-damage-records/' ),
				array( 'label' => 'תקנות התשלום המרבי בעד העתק רשומה רפואית (נוסח עדכני)', 'url' => 'https://www.nevo.co.il/law_html/law00/159312.htm' ),
			),
			'lawyer'      => array( 'label' => 'עורך דין רשלנות רפואית', 'path' => '/medical-malpractice-lawyer/' ),
			'sticky'      => 'התשלום המרבי',
			// The snapshot gives the sticky as HTML ("<bdi>10 ₪</bdi>"); 'count' keeps the money formatter away.
			'sticky_kind' => 'count',
		),
		// The medical-malpractice wave (22.10.2026, HAD-594): the malpractice limitation clock on
		// /medical-malpractice-statute-of-limitations/ (articles 21757).
		// Bundle: 'shaon-refui' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js as TE', 'hityashnut-engine.js', 'hityashnut-ui.js' )
		// (reuses limitation() of the wave-4 road engine in its own scope, as TE: the minor's years, the war window, rest days;
		// every top-level helper in hityashnut-*.js starts with "ht" or is a UI export; no name collides with instrument.js,
		// dates.js or sim-handoff.js).
		'shaon-refui'  => array(
			'name'      => 'שעון ההתיישנות ברשלנות רפואית',
			'title'     => 'רשלנות רפואית: עד מתי אפשר להגיש תביעה, לפי יום הטיפול שלכם',
			'promise'   => 'לפי יום הטיפול: היום האחרון הבטוח, והמועדים שתלויים בתנאי (גילוי מאוחר של הנזק או של הקשר לטיפול, קטין, ליקוי, פטירה, תביעה שנמחקה), עם תקרת 10 השנים, תקופת המלחמה וימי המנוחה; מה אמר בית המשפט העליון; המסלולים שלא עוצרים את השעון; והכול ליומן.',
			'question'  => 'עד מתי אפשר להגיש תביעת רשלנות רפואית, וממתי סופרים?',
			'page'      => '/medical-malpractice-statute-of-limitations/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'car_accident', 'injury_sheon', 'malpractice_hityashnut' ),
			'dataset'   => 'malpractice_hityashnut',
			'next_text' => 'הצעד הבא: להזמין את התיק הרפואי, להכניס ליומן את היום הבטוח, ולתרגל את החקירה הנגדית של המומחה על מועד הגילוי',
			'primary'   => array( 'label' => 'לתרגל חקירה נגדית של המומחה', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל חקירה נגדית של המומחה הרפואי על מועד הגילוי', 'topic' => 'medical-malpractice', 'purpose' => 'witness_prep' ),
			'more'      => array(
				array( 'label' => 'מכתב בקשה לתיק הרפואי', 'path' => '/obtaining-medical-records-copy/' ),
				array( 'label' => 'האם יש עילה: חמשת היסודות', 'path' => '/what-is-medical-malpractice-definition-examples/' ),
				array( 'label' => 'חוק ההתיישנות (נוסח עדכני)', 'url' => 'https://www.nevo.co.il/law_html/law00/71809.htm' ),
			),
			'lawyer'      => array( 'label' => 'עורך דין רשלנות רפואית', 'path' => '/medical-malpractice-lawyer/' ),
			'sticky'      => 'היום הבטוח',
			// The snapshot gives the sticky as HTML ("<bdi>11.7.2028</bdi>"); 'count' keeps the money formatter away.
			'sticky_kind' => 'count',
		),
		// The medical-malpractice wave (22.10.2026, HAD-594): the cost and fee estimator of a malpractice claim on
		// /medical-malpractice-cost/ (pages 20334, BLOCK page). Bundle: 'alut-tviaa-refuit' => array( 'instrument.js',
		// 'sim-handoff.js', 'dates.js', 'mechir-engine.js', 'mechir-ui.js' ) (no other engine; every top-level name in mechir-*.js
		// starts with "mc" or is a UI export; no name collides with instrument.js, dates.js or sim-handoff.js).
		// The snapshot gives the sticky as HTML (the net with its ₪ span), so no sticky_kind is needed.
		'alut-tviaa-refuit' => array(
			'name'      => 'כמה עולה תביעת רשלנות רפואית',
			'title'     => 'כמה עולה תביעת רשלנות רפואית: אגרה, חוות דעת, שכר טרחה ומה נשאר לכם',
			'promise'   => 'לפי סכום התביעה, הפיצוי והצעת שכר הטרחה שלכם: באיזה בית משפט, האגרה ומי משלם אותה בכל סיום, חוות הדעת, מע"מ, מה נשאר מהפיצוי, מה עולה תביעה שנדחית, סיוע משפטי ופטור מאגרה, והמועדים ליומן.',
			'question'  => 'כמה עולה תביעת רשלנות רפואית, וכמה נשאר מהפיצוי?',
			'page'      => '/medical-malpractice-cost/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'small_claims', 'car_accident', 'malpractice_mechir' ),
			'dataset'   => 'malpractice_mechir',
			'next_text' => 'הצעד הבא: לבדוק את ההסכם עם עורך הדין (על מה מחושב האחוז ומי מממן את חוות הדעת), ולתרגל את החקירה הנגדית של המומחה מטעם בית החולים',
			'primary'   => array( 'label' => 'לתרגל חקירה נגדית של המומחה', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל חקירה נגדית של המומחה הרפואי מטעם בית החולים', 'topic' => 'medical-malpractice', 'purpose' => 'witness_prep' ),
			'more'      => array(
				array( 'label' => 'האם יש תביעת רשלנות רפואית: מה צריך להוכיח', 'path' => '/what-is-medical-malpractice-definition-examples/' ),
				array( 'label' => 'שעון ההתיישנות ברשלנות רפואית', 'path' => '/medical-malpractice-statute-of-limitations/' ),
				array( 'label' => 'תקנות בתי המשפט (אגרות), נוסח עדכני', 'url' => 'https://www.nevo.co.il/law_html/law00/74160.htm' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין רשלנות רפואית', 'path' => '/medical-malpractice-lawyer/' ),
			'sticky'    => 'נשאר לכם',
		),
	);
}

/** The answer box: one paragraph, every figure from the registry, ending with the check date. */
function justice_tools_malpractice_answer( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	// tik-rashlanut (jt68): the answer box. One paragraph, every rule from the registry: the sections in malpractice_tik, the
	// 7 years and the age of 18 in car_accident.limitation (reused, never repeated).
	if ( 'tik-rashlanut' === $name && ! empty( $reg['malpractice_tik'] ) && ! empty( $reg['car_accident']['limitation'] ) ) {
		$t    = $reg['malpractice_tik'];
		$lim  = $reg['car_accident']['limitation'];
		$text = '<strong>רשלנות רפואית</strong> היא טיפול שסטה ממה שמטפל סביר ומיומן היה עושה וגרם נזק (' . esc_html( $t['torts']['negligence_section'] ) . ' ו' . esc_html( $t['torts']['duty_section'] ) . ' לפקודת הנזיקין). '
			. 'מוכיחים חובת זהירות, הפרה, נזק וקשר סיבתי, ולפעמים הפרה של חובת ההסבר (' . esc_html( $t['patient']['consent_section'] ) . ' לחוק זכויות החולה). '
			. 'את ההפרה ואת הקשר מוכיחים בחוות דעת של מומחה שמצורפת לתביעה (' . esc_html( $t['procedure']['expert_section'] ) . '), ורשומה חסרה יכולה להעביר את הנטל לנתבע. '
			. 'התביעה מתיישנת אחרי <bdi>' . (int) $lim['years'] . '</bdi> שנים, ולקטין מגיל <bdi>' . (int) $lim['adult_age'] . '</bdi>. נבדק ' . esc_html( justice_tools_he_date( $t['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// bakashat-reshuma (jt69): the answer box. One paragraph, every figure from reg.malpractice_reshuma: the right (s.18(a)),
	// the 10 shekels of reg. 3(a), the 5 years of reg. 3(c), the tariff's L0268 and its effective day, reg. 4(b), circular C.22.
	if ( 'bakashat-reshuma' === $name && ! empty( $reg['malpractice_reshuma'] ) ) {
		$m    = $reg['malpractice_reshuma'];
		$r    = $m['regs'];
		$t    = $m['tariff'];
		$text = '<strong>קבלת תיק רפואי</strong> היא זכות: לפי ' . esc_html( $m['law']['right_section'] ) . ' ל' . esc_html( $m['law']['he'] ) . ', מטופל זכאי לקבל העתק מהרשומה הרפואית שלו. '
			. 'העתק ממוחשב של רשומה מ-<bdi>' . (int) $r['years'] . '</bdi> השנים האחרונות עולה לכל היותר ' . justice_tools_money( $r['computerised_max'], 0 ) . ' לבקשה (' . esc_html( $r['sections']['computerised'] ) . '), '
			. 'ועל נייר לכל היותר לפי תעריפון משרד הבריאות: ' . justice_tools_money( $t['items']['L0268']['amount'], 0 ) . ' ל-<bdi>' . (int) $t['items']['L0268']['pages'] . '</bdi> עמודים מ-' . esc_html( justice_tools_he_date( $t['from'] ) ) . '. '
			. 'הגשת הבקשה בלי תשלום (' . esc_html( $r['sections']['filing'] ) . '), ואין בחוק מספר ימים למענה. נבדק ' . esc_html( justice_tools_he_date( $m['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// shaon-refui (jt70): the answer box. One paragraph, every figure from the registry: the 7 years, 18 and the war window in
	// car_accident.limitation (reused, never repeated), the 10 years of s.89(2) and s.8 in injury_sheon, the rest in
	// malpractice_hityashnut.
	if ( 'shaon-refui' === $name && ! empty( $reg['malpractice_hityashnut'] ) && ! empty( $reg['injury_sheon'] ) && ! empty( $reg['car_accident']['limitation'] ) ) {
		$mh   = $reg['malpractice_hityashnut'];
		$sh   = $reg['injury_sheon'];
		$lim  = $reg['car_accident']['limitation'];
		$text = '<strong>התיישנות ברשלנות רפואית</strong> היא <bdi>' . (int) $lim['years'] . '</bdi> שנים מהיום שבו אירע הנזק (' . esc_html( $lim['section'] ) . ' ל' . esc_html( $lim['he'] ) . ' ו' . esc_html( $sh['torts']['late_cap_section'] ) . ' לפקודת הנזיקין). '
			. 'נזק שהתגלה מאוחר: מיום הגילוי, אבל לא יותר מ-<bdi>' . (int) $sh['torts']['late_cap_years'] . '</bdi> שנים מהנזק; קשר לטיפול שהתברר מאוחר: ' . esc_html( $sh['limitation']['late_section'] ) . ', בלי תקרה. '
			. 'לקטין סופרים מגיל <bdi>' . (int) $lim['adult_age'] . '</bdi>, כלומר עד גיל <bdi>' . ( (int) $lim['adult_age'] + (int) $lim['years'] ) . '</bdi>. רק הגשת תביעה לבית המשפט עוצרת את השעון (' . esc_html( $mh['limitation']['filed_section'] ) . '). נבדק ' . esc_html( justice_tools_he_date( $mh['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// alut-tviaa-refuit (jt71): the answer box. One paragraph, every figure from the registry: the fixed fee and its first part
	// (malpractice_mechir.fees, reg.5), the magistrates' amount (small_claims, Courts Law s.51(a)(2)), VAT (car_accident.fees).
	if ( 'alut-tviaa-refuit' === $name && ! empty( $reg['malpractice_mechir'] ) && ! empty( $reg['small_claims'] ) && ! empty( $reg['car_accident']['fees'] ) ) {
		$mc   = $reg['malpractice_mechir'];
		$f    = $mc['fees'];
		$text = '<strong>תביעת רשלנות רפואית</strong> היא תביעה על נזק גוף, ולכן האגרה בה קבועה ולא אחוז מהסכום (' . esc_html( $f['rule_section'] ) . ' לתקנות האגרות): ' . justice_tools_money( $f['magistrate']['full'], 0 ) . ' בבית משפט השלום, תביעה עד ' . justice_tools_money( $reg['small_claims']['magistrate_max'], 0 ) . ', ובהגשה רק ' . justice_tools_money( $f['magistrate']['first'], 0 ) . '; במחוזי ' . justice_tools_money( $f['district']['full'], 0 ) . '. '
			. 'לחוות דעת רפואית אין מחירון רשמי, ולשכר טרחה ברשלנות רפואית אין תקרה בחוק; עליו נוסף מע"מ של <bdi>' . (int) $reg['car_accident']['fees']['vat_pct'] . '%</bdi>. נבדק ' . esc_html( justice_tools_he_date( $mc['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '';
}

/** The data stamp in the tool's header. */
function justice_tools_malpractice_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'tik-rashlanut' === $name ) {
		$t = $reg['malpractice_tik'] ?? array();
		return 'תקנות סדר הדין, נוסח ל-' . justice_tools_he_date( $t['procedure']['current_to'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $t['checked_on'] ?? '' );
	}
	if ( 'bakashat-reshuma' === $name ) {
		$m = $reg['malpractice_reshuma'] ?? array();
		return 'תעריפון משרד הבריאות מ-' . justice_tools_he_date( $m['tariff']['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $m['checked_on'] ?? '' );
	}
	if ( 'shaon-refui' === $name ) {
		$mh = $reg['malpractice_hityashnut'] ?? array();
		return 'חוק ההתיישנות, נוסח ל-' . justice_tools_he_date( $mh['limitation']['current_to'] ?? '' ) . ' · פסקי דין של העליון · נבדק ' . justice_tools_he_date( $mh['checked_on'] ?? '' );
	}
	if ( 'alut-tviaa-refuit' === $name ) {
		$mc = $reg['malpractice_mechir'] ?? array();
		return 'תקנות האגרות, הסכומים מ-' . justice_tools_he_date( $mc['fees']['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $mc['checked_on'] ?? '' );
	}
	return 'נבדק ' . justice_tools_he_date( justice_tools_checked_on( $name ) );
}

/** Official sources used by each instrument's result. */
function justice_tools_malpractice_sources( string $name ): array {
	$reg = justice_tools_registry();
	if ( 'tik-rashlanut' === $name ) {
		$t       = $reg['malpractice_tik'];
		$lim     = $reg['car_accident']['limitation'];
		$checked = justice_tools_he_date( $t['checked_on'] );
		$to      = $t['torts'];
		$pa      = $t['patient'];
		$pr      = $t['procedure'];
		$di      = $t['discipline'];
		$tr      = $t['tracks'];
		$cl      = $t['caselaw'];
		return array(
			array( 'name' => $to['he'], 'url' => $to['url'], 'text' => $to['negligence_section'] . ' התרשלות ורשלנות; ' . $to['duty_section'] . ' חובת הזהירות; ' . $to['damage_section'] . ' הגדרת נזק; ' . $to['res_ipsa_section'] . ' הדבר מעיד על עצמו (שלושה תנאים); ' . $to['estate_section'] . ' העיזבון; ' . $to['dependants_section'] . ' התלויים; ' . $to['late_section'] . ' נזק שהתגלה מאוחר. נוסח עדכני ל-' . justice_tools_he_date( $to['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $pa['he'], 'url' => $pa['url'], 'text' => $pa['consent_section'] . ' הסכמה מדעת; ' . $pa['written_section'] . ' הסכמה בכתב ל' . $pa['schedule_he'] . '; ' . $pa['emergency_section'] . ' חירום; ' . $pa['record_section'] . ' חובת הרשומה; ' . $pa['access_section'] . ' עותק מהרשומה; ' . $pa['inquiry_section'] . ' ועדת בדיקה; ' . $pa['quality_section'] . ' ועדת בקרה ואיכות; ' . $pa['officer_section'] . ' האחראי לזכויות המטופל. נוסח עדכני ל-' . justice_tools_he_date( $pa['current_to'] ) . '.' ),
			array( 'name' => $pr['he'], 'url' => $pr['url'], 'text' => $pr['expert_section'] . ': ' . $pr['expert_he'] . '; ' . $pr['exempt_section'] . ' פטור; ' . $pr['counter_section'] . ' חוות דעת נגדית בתוך ' . (int) $pr['counter_days'] . ' ימים; ' . $pr['court_expert_section'] . ' ו' . $pr['agreed_section'] . ' מומחה מטעם בית המשפט; ' . $pr['questions_section'] . ' שאלות הבהרה בתוך ' . (int) $pr['questions_days'] . ' ימים; ' . $pr['sanction_section'] . '. נוסח עדכני ל-' . justice_tools_he_date( $pr['current_to'] ) . '.' ),
			array( 'name' => $lim['he'], 'url' => $lim['url'], 'text' => $lim['section'] . ': ' . (int) $lim['years'] . ' שנים; ' . $lim['minor_section'] . ' קטין מגיל ' . (int) $lim['adult_age'] . '; ' . $lim['war']['section'] . ': ' . justice_tools_he_date( $lim['war']['from'] ) . ' עד ' . justice_tools_he_date( $lim['war']['to'] ) . ' לא נספרים; ' . $lim['interpretation_he'] . ' יום מנוחה.' ),
			array( 'name' => $di['he'], 'url' => $di['url'], 'text' => $di['section'] . ': ' . $di['he_rule'] . '; ' . $di['grounds_he'] . '; ' . $di['hearing_section'] . '. לרופא שיניים: ' . $di['dentist_section'] . ' ל' . $di['dentist_he'] . '. נוסח עדכני ל-' . justice_tools_he_date( $di['current_to'] ) . '.' ),
			array( 'name' => 'משרד הבריאות: הגשת תלונה על בעלי מקצועות רפואיים', 'url' => $tr['complaint_url'], 'text' => $tr['complaint_he'] . '. עודכן ' . justice_tools_he_date( $tr['complaint_updated'] ) . ', נקרא ' . $checked . '.' ),
			array( 'name' => 'משרד הבריאות: קבילה לפי חוק ביטוח בריאות ממלכתי', 'url' => $tr['nhi_url'], 'text' => $tr['nhi_he'] . '; ' . $tr['no_extension_he'] . ' (' . $tr['nhi_sections'] . '). עודכן ' . justice_tools_he_date( $tr['nhi_updated'] ) . '.' ),
			array( 'name' => $cl['comptroller_he'], 'url' => $cl['comptroller_url'], 'text' => $cl['evidentiary_he'] . ' (' . $cl['evidentiary_file'] . '); פגיעה באוטונומיה: ' . implode( ', ', $cl['autonomy_files'] ) . '; ' . $cl['outside_basket_file'] . '. פסקי הדין מתוארים במילים, בלי חישוב.' ),
			array( 'name' => 'בית המשפט העליון: פסקי דין', 'url' => $cl['court_url'], 'text' => $cl['evidentiary_file'] . ' ' . $cl['evidentiary_parties'] . '; ' . $cl['chance_file'] . ' ' . $cl['chance_parties'] . ' (' . (int) $cl['chance_year'] . '): שאלה פתוחה לפי הנסיבות.' ),
		);
	}
	if ( 'bakashat-reshuma' === $name ) {
		$m       = $reg['malpractice_reshuma'];
		$checked = justice_tools_he_date( $m['checked_on'] );
		$l       = $m['law'];
		$r       = $m['regs'];
		$rs      = $r['sections'];
		$t       = $m['tariff'];
		$c       = $m['circular'];
		$cs      = $c['sections'];
		$k       = $m['retention'];
		$n       = $k['newborn'];
		$cap     = $m['capacity'];
		return array(
			array( 'name' => $l['he'], 'url' => $l['url'], 'text' => $l['record_section'] . ' חובת התיעוד; ' . $l['keep_section'] . ' שמירה לפי כל דין; ' . $l['right_section'] . ' הזכות לקבל מידע מהרשומה, כולל העתק; ' . $l['withhold_section'] . ' עד (ה) מידע שעלול לגרום נזק חמור וועדת האתיקה; ' . $l['secrecy_section'] . ' סודיות; ' . $l['disclose_section'] . ' מסירה לאחר בהסכמה; ' . $l['objection_section'] . ' השגה על ממצאים שלא תועדו; ' . $l['officer_section'] . ' הממונה על זכויות המטופל; ' . $l['idf_section'] . ' חיל הרפואה; ' . $l['penalty_section'] . ' עבירה. נוסח עדכני ל-' . justice_tools_he_date( $l['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $r['he'], 'url' => $r['url'], 'text' => $r['kt_he'] . ', פורסמו ' . justice_tools_he_date( $r['published'] ) . '. ' . $rs['computerised'] . ' והתוספת: העתק ממוחשב עד ' . (int) $r['computerised_max'] . ' ₪ לבקשה, תקליטור נוסף ' . (int) $r['extra_disc'] . ' ₪; ' . $rs['paper'] . ' (מ-' . justice_tools_he_date( $r['paper_from'] ) . '): על נייר לפי תעריפון משרד הבריאות; ' . $rs['five'] . ': רשומה מ-' . (int) $r['years'] . ' השנים שלפני הבקשה; ' . $rs['deceased'] . ': קרוב של מי שנפטר, ' . (int) $r['deceased_months'] . ' חודשים, ' . (int) $r['deceased_days'] . ' ימים; ' . 'תקנה 4(א)-(ה): מה שבלי תשלום; ' . $rs['applies'] . ': רשומה מ-' . justice_tools_he_date( $r['applies_from'] ) . '. נוסח עדכני ל-' . justice_tools_he_date( $r['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $t['he'] . ' (' . $t['column_he'] . ')', 'url' => $t['url'], 'text' => 'מ-' . justice_tools_he_date( $t['from'] ) . ': L0268 ' . $t['items']['L0268']['he'] . ' ' . (int) $t['items']['L0268']['amount'] . ' ₪; L0269 ' . $t['items']['L0269']['he'] . ' ' . (int) $t['items']['L0269']['amount'] . ' ₪; L9413 ' . $t['items']['L9413']['he'] . ' ' . (int) $t['items']['L9413']['amount'] . ' ₪; L6498 ' . (int) $t['items']['L6498']['amount'] . ' ₪, L6499 ' . (int) $t['items']['L6499']['amount'] . ' ₪. ' . $t['scope_he'] . '. נבדק ' . $checked . '.' ),
			array( 'name' => $c['he'], 'url' => $c['page_url'], 'text' => 'בתוקף מ-' . justice_tools_he_date( $c['from'] ) . ', עודכן ' . justice_tools_he_date( $c['updated'] ) . '. ' . $cs['who'] . ' מי מקבל; ' . $cs['waiver'] . ' כתב ויתור על סודיות; ' . $cs['guardian'] . ' אפוטרופוס; ' . $cs['deceased'] . ' יורשים; ' . $cs['sensitive'] . ' מידע חסוי ביותר; ' . $cs['minor'] . ' קטין; ' . $cs['original'] . ' אין מסירת מקור; ' . $cs['publish'] . ' כל מוסד מפרסם את זמן המענה ואת התעריפים. נבדק ' . $checked . '.' ),
			array( 'name' => $k['he'], 'url' => $k['url'], 'text' => $k['section'] . ': תיק אשפוז ' . (int) $k['rows']['1']['years'] . ' שנים מהאשפוז האחרון (בלי גליון סיכום ' . (int) $k['rows']['1']['no_summary_years'] . ', או ' . (int) $k['rows']['1']['death_years'] . ' אחרי הפטירה); גליון סיכום ' . (int) $k['rows']['3']['years'] . '; חדר מיון ' . (int) $k['rows']['6']['years'] . '; צילומי רנטגן ' . (int) $k['rows']['13']['years'] . '; ' . $k['state_section'] . ': לא חל על בית חולים ממשלתי או עירוני. נוסח עדכני ל-' . justice_tools_he_date( $k['current_to'] ) . '.' ),
			array( 'name' => $n['he'], 'url' => $n['url'], 'text' => $n['rule_he'] . '. ' . $n['mother_he'] . ': ' . $n['mother_rule_he'] . '.' ),
			array( 'name' => $cap['he'], 'url' => $cap['url'], 'text' => $cap['minor_section'] . ': קטין עד גיל ' . (int) $cap['minor_age'] . '; ' . $cap['parents_section'] . ': ' . $cap['parents_he'] . '. נוסח עדכני ל-' . justice_tools_he_date( $cap['current_to'] ) . '.' ),
			array( 'name' => $m['complaints']['commission_he'], 'url' => $m['complaints']['commission_url'], 'text' => 'תלונה על מוסד או על קופה שלא נענו; ' . $m['complaints']['nhi_he'] . '. נבדק ' . $checked . '.' ),
		);
	}
	if ( 'shaon-refui' === $name ) {
		$mh      = $reg['malpractice_hityashnut'];
		$sh      = $reg['injury_sheon'];
		$lim     = $reg['car_accident']['limitation'];
		$checked = justice_tools_he_date( $mh['checked_on'] );
		$ml      = $mh['limitation'];
		$mt      = $mh['torts'];
		$sl      = $sh['limitation'];
		$st      = $sh['torts'];
		$si      = $sh['insurance'];
		$out     = array(
			array( 'name' => $ml['he'], 'url' => $ml['url'], 'text' => $ml['filed_section'] . ' ו' . $lim['section'] . ': ' . (int) $lim['years'] . ' שנים לתביעה שלא הוגשה; ' . $sl['start_section'] . ' מיום שנולדה העילה; ' . $sl['misconduct_section'] . ' הטעיה, כולל הסתרת עובדה; ' . $sl['late_section'] . ' התיישנות שלא מדעת; ' . $sl['admission_section'] . ' הודאה; ' . $lim['minor_section'] . ' קטין עד ' . (int) $lim['adult_age'] . '; ' . $sl['incapacity_section'] . ' ליקוי נפשי או שכלי; ' . $ml['abroad_section'] . '; ' . $ml['dismissed_section'] . ' תובענה שנדחתה; ' . $lim['war']['section'] . ' חרבות ברזל: ' . justice_tools_he_date( $lim['war']['from'] ) . ' עד ' . justice_tools_he_date( $lim['war']['to'] ) . ' לא נספרים; ' . $ml['after_stay_section'] . ' שנה, ושנתיים אחרי ליקוי; ' . $ml['inheritance_section'] . ' שנה מהירושה; ' . $ml['state_section'] . ' המדינה. נוסח עדכני ל-' . justice_tools_he_date( $ml['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => 'חוק ההתיישנות (תיקון מס\' 8 – חרבות ברזל), התשפ"ד-2024', 'url' => $ml['war_published_url'], 'text' => 'ספר החוקים 3151, פורסם ב-' . justice_tools_he_date( $ml['war_published'] ) . ': סעיף 15א, ותקופה שהסתיימה לפני הפרסום (סעיף 15א(ג)-(ד)).' ),
			array( 'name' => $mt['he'], 'url' => $mt['url'], 'text' => $mt['estate_section'] . ' העיזבון; ' . $mt['dependants_section'] . ' התלויים; ' . $mt['who_files_section'] . ' ' . (int) $mt['who_files_months'] . ' חודשים; ' . $st['late_cap_section'] . ': ' . $st['damage_he'] . '. נוסח חדש מ-' . justice_tools_he_date( $mt['from'] ) . ', נוסח עדכני ל-' . justice_tools_he_date( $mt['current_to'] ) . '.' ),
			array( 'name' => $si['he'], 'url' => $si['url'], 'text' => $si['limit_section'] . ': ' . (int) $si['limit_years'] . ' שנים, ' . (int) $si['limit_long_years'] . ' ב' . $si['limit_long_he'] . '; ' . $si['warn_section'] . ' התרעה ' . implode( ' ו-', array_map( 'intval', $si['warn_months'] ) ) . ' חודשים לפני הסוף.' ),
		);
		foreach ( $mh['case_law'] as $c ) {
			$out[] = array( 'name' => 'בית המשפט העליון, ' . $c['file'] . ' ' . $c['name_he'] . ' (' . justice_tools_he_date( $c['date'] ) . ')', 'url' => $c['url'], 'text' => $c['point_he'] . ( 'open' === $c['status'] ? ' (שאלה פתוחה)' : '' ) . '.' );
		}
		foreach ( $mh['tracks'] as $t ) {
			$out[] = array( 'name' => 'משרד הבריאות: ' . $t['he'], 'url' => $t['url'], 'text' => ( $t['section'] ? $t['section'] . '; ' : '' ) . $t['deadline_he'] . '; לא עוצר את שעון ההתיישנות.' );
		}
		$out[] = array( 'name' => $mh['bill_2004']['he'], 'url' => $mh['bill_2004']['url'], 'text' => $mh['bill_2004']['what_he'] . '. ' . $mh['bill_2004']['status_he'] . '.' );
		return $out;
	}
	if ( 'alut-tviaa-refuit' === $name ) {
		$mc      = $reg['malpractice_mechir'];
		$sc      = $reg['small_claims'];
		$cf      = $reg['car_accident']['fees'];
		$checked = justice_tools_he_date( $mc['checked_on'] );
		$f       = $mc['fees'];
		$x       = $mc['experts'];
		$fe      = $mc['fee'];
		$co      = $mc['costs'];
		$la      = $mc['legal_aid'];
		return array(
			array( 'name' => $f['he'], 'url' => $f['url'], 'text' => $f['definition_section'] . ' תביעה לפיצויים בשל נזק גוף; ' . $f['rule_section'] . ': פרט 2 (' . number_format( (int) $f['magistrate']['full'] ) . ' ש"ח) ופרט 9 (' . number_format( (int) $f['district']['full'] ) . ' ש"ח); ' . $f['first_section'] . ': פרט 34 (' . number_format( (int) $f['magistrate']['first'] ) . ') ופרט 35 (' . number_format( (int) $f['district']['first'] ) . '); ' . $f['early_section'] . ', ' . $f['third_section'] . ', ' . $f['defendant_third_section'] . ', ' . $f['defendant_full_section'] . ', ' . $f['waive_section'] . ', ' . $f['dismissed_section'] . ' מי משלם את היתרה; ' . $f['low_section'] . ' (' . (int) $f['low_pct'] . '%); ' . $f['update_section'] . ' עדכון ב-1 בינואר; ' . $f['index_section'] . '; ' . $f['exempt']['section'] . ' פטור (' . (int) $f['exempt']['request_days'] . ' ימים); ' . $f['exempt']['legal_aid_section'] . '. נוסח עדכני ל-' . justice_tools_he_date( $f['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $f['notice_he'], 'url' => $f['notice_url'], 'text' => 'נוסח התוספת מ-' . justice_tools_he_date( $f['from'] ) . ', לפי תקנה 11 (מדד נובמבר 2025 לעומת נובמבר 2024). ' . $f['guide_he'] . ': ' . $f['guide_url'] . '.' ),
			array( 'name' => $x['he'], 'url' => $x['url'], 'text' => $x['attach_section'] . ' חוות דעת רפואית לכתב הטענות; ' . $x['counter_section'] . ' חוות דעת נגדית בתוך ' . (int) $x['counter_days'] . ' ימים; ' . $x['postpone_section'] . '; ' . $x['court_section'] . ' מומחה מטעם בית המשפט; ' . $x['court_due_section'] . ' (' . (int) $x['court_due_days'] . ' ימים); ' . $x['questions_section'] . ' (' . (int) $x['questions_days'] . ' ימים); ' . $x['pay_section'] . ', ' . $x['deposit_section'] . ', ' . $x['fail_section'] . ' מי משלם את המומחה; ' . $x['missing_section'] . '; ' . $x['count_section'] . ' מניין הימים; ' . $co['award_section'] . ', ' . $co['tariff_section'] . ', ' . $co['vat_section'] . ', ' . $co['factors_section'] . ', ' . $co['expenses_section'] . ', ' . $co['security_section'] . ' הוצאות. בתוקף מ-' . justice_tools_he_date( $x['from'] ) . '; נוסח עדכני ל-' . justice_tools_he_date( $x['current_to'] ) . '.' ),
			array( 'name' => $mc['court']['he'], 'url' => $mc['court']['url'], 'text' => $sc['magistrate_section'] . ': תביעה אזרחית עד ' . number_format( (int) $sc['magistrate_max'] ) . ' ש"ח ביום ההגשה בבית משפט השלום; ' . $sc['district_section'] . ': מעליו, בית המשפט המחוזי. נוסח עדכני ל-' . justice_tools_he_date( $mc['court']['current_to'] ) . '.' ),
			array( 'name' => $fe['bar_he'], 'url' => $fe['bar_url'], 'text' => $fe['minimum_section'] . ' תעריף מינימלי (המלצה); ' . $fe['max_section'] . ' תעריף מקסימלי רק לשירותים שנקבעו; ' . $fe['excessive_section'] . ' שכר מופרז שתלוי בתוצאה; ' . $fe['separate_section'] . ' הפרדה בין שכר להוצאות; ' . $fe['refund_section'] . ' החזר. לא נמצאה תקרה לתביעת רשלנות רפואית.' ),
			array( 'name' => $fe['ethics_he'], 'url' => $fe['ethics_url'], 'text' => $fe['pct_section'] . ' שכר טרחה באחוזים; ' . $fe['expenses_section'] . ' אחריות אישית להוצאות עדים ומשפט.' ),
			array( 'name' => 'חוק פיצויים לנפגעי תאונות דרכים, התשל"ה-1975', 'url' => $fe['road_url'], 'text' => $fe['road_section'] . ' וכללי הלשכה מ-1977: ' . (int) $reg['car_accident']['fees']['stages']['none']['pct'] . '%, ' . (int) $reg['car_accident']['fees']['stages']['settle']['pct'] . '%, ' . (int) $reg['car_accident']['fees']['stages']['judgment']['pct'] . '%, רק לתביעות לפי החוק, לא לרשלנות רפואית.' ),
			array( 'name' => $cf['vat_he'], 'url' => $cf['vat_url'], 'text' => 'מע"מ ' . (int) $cf['vat_pct'] . '% על שכר הטרחה, מ-1.1.2025.' ),
			array( 'name' => $la['regs_he'], 'url' => $la['regs_url'], 'text' => $la['matters_section'] . ' עניינים כספיים לרבות נזיקין; ' . $la['means_section'] . ' מבחן הכנסה (' . (int) $la['income_pct'] . '%, ועוד ' . (int) $la['extra_pct'] . '% לנפש) ורכוש; ' . $la['participation_section'] . ' אגרת השתתפות ' . (int) $la['participation_low'] . ' או ' . (int) $la['participation_high'] . ' ש"ח מ-' . justice_tools_he_date( $la['participation_from'] ) . '; ' . $la['advance_section'] . ' מקדמה ' . (int) $la['advance'] . ' ש"ח; ' . $la['repay_section'] . ' החזר הוצאות מפסק דין. ' . $la['law_he'] . ': ' . $la['merits_section'] . ', ' . $la['awarded_section'] . '.' ),
			array( 'name' => $la['table_he'], 'url' => $la['table_url'], 'text' => 'הכנסה עד ' . number_format( (int) $la['income_base'] ) . ' ש"ח ל-1 עד ' . (int) $la['base_persons'] . ' נפשות, ועוד ' . number_format( (int) $la['per_person'] ) . ' ש"ח לכל נפש; רכוש עד ' . number_format( (int) $la['property_max'] ) . ' ש"ח; שכר ממוצע ' . number_format( (int) $la['avg_wage'] ) . ' ש"ח. ' . $la['service_he'] . ' (עודכן ' . justice_tools_he_date( $la['service_updated'] ) . '): ' . $la['service_url'] . '.' ),
		);
	}
	return array();
}

/** The page table of each instrument, rendered by the build from the registry. */
function justice_tools_malpractice_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}
