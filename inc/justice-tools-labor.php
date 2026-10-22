<?php
/**
 * The labor-law wave (22.10.2026): four instruments of the labor cluster, plus the upgraded severance tool (whose catalog,
 * answer, stamp and sources stay in inc/justice-tools.php).
 *
 *   [justice_tool name="hodaa-mukdemet"]   the advance notice in both directions: days by tenure and pay type (as the
 *                                          Ministry of Labor's table reads ss.3-4), the calendar to the last day, pay in
 *                                          lieu or compensation, the protected periods, the dates (/notice-of-dismissal/)
 *   [justice_tool name="chufsha-shnatit"]  annual leave by seniority (the law and the shortened-week extension order),
 *                                          part year and part time, the value of a day, the redemption (/annual-leave-calculator/)
 *   [justice_tool name="shaot-nosafot"]    a week's time card -> regular, 125%, 150% and the weekly rest, night shifts,
 *                                          a fixed overtime payment checked, the back pay and the limitation (/overtime-pay-israel/)
 *   [justice_tool name="gmar-cheshbon"]    the final settlement: the last salary, notice, severance and section 14, vacation
 *                                          redemption, recuperation, on one settlement sheet with the dates (/gmar-cheshbon/)
 *   [justice_tool_lead name="..."]         the result-first card (inc/justice-tools-rights-2a.php) accepts these names too.
 * Every number is read from assets/data/justice-tools-registry.json (labor_hodaa, labor_chufsha, labor_nosafot,
 * labor_pitzuyim, labor_gmar, built by tools/justice_tools_labor_<lane>.py, and the existing severance, havraa, min_wage
 * and rights_* datasets) or from the snapshot the build renders.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_labor_names(): array {
	return array( 'hodaa-mukdemet', 'chufsha-shnatit', 'shaot-nosafot', 'gmar-cheshbon' );
}

/** The catalog entries, merged into justice_tools_catalog(). */
function justice_tools_labor_catalog(): array {
	return array(
		// The labor wave (22.10.2026): the advance notice in both directions, on /notice-of-dismissal/ (articles 2196). Bundle:
		// 'hodaa-mukdemet' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'pitzuyim-engine.js', 'hodaa-engine.js', 'hodaa-ui.js' )
		// (reuses serviceSpan and monthLater of the wave-5 severance engine; every top-level name in hodaa-*.js starts with "hd"
		// or is a UI export; no name collides with instrument.js, dates.js, sim-handoff.js or pitzuyim-engine.js).
		'hodaa-mukdemet'  => array(
			'name'      => 'מחשבון הודעה מוקדמת',
			'title'     => 'הודעה מוקדמת לפיטורים ולהתפטרות: כמה ימים, עד איזה יום וכמה שכר',
			'promise'   => 'לפי סוג השכר והוותק, בשני הכיוונים: ימי ההודעה על לוח השנה עד היום האחרון, השכר בעד התקופה או הפיצוי כשלא ניתנה, חופשה בתוך ההודעה, מי מוגן מפיטורים עכשיו, והמועדים ליומן.',
			'question'  => 'כמה ימי הודעה מוקדמת מגיעים לי, ועד איזה יום?',
			'page'      => '/notice-of-dismissal/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'labor_hodaa', 'severance', 'rights_leida' ),
			'dataset'   => 'labor_hodaa',
			'next_text' => 'הצעד הבא: לבדוק שההודעה בכתב ובה היום האחרון, להכניס ליומן את המועדים, ולתרגל את השימוע או את השיחה עם המעסיק',
			'primary'   => array( 'label' => 'לתרגל את השימוע', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את השימוע לפני הפיטורים', 'topic' => 'employment', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'מחשבון פיצויי פיטורים', 'path' => '/severance-pay-calculator/' ),
				array( 'label' => 'גמר חשבון: מה עוד משלמים בסיום', 'path' => '/gmar-cheshbon/' ),
				array( 'label' => 'המדריך של משרד העבודה (gov.il)', 'url' => 'https://www.gov.il/he/departments/guides/notice-of-dismissal-and-resignation' ),
			),
			'lawyer'      => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/labor-lawyer/' ),
			'sticky'      => 'הודעה',
			// The snapshot gives the sticky as HTML ("<bdi>11</bdi> ימים", or "חודש"); 'count' keeps the money formatter away.
			'sticky_kind' => 'count',
		),
		// The labor wave (22.10.2026): annual leave and its redemption, on /annual-leave-calculator/ (pages 21334). Bundle:
		// 'chufsha-shnatit' => array( 'instrument.js', 'sim-handoff.js', 'chufsha-engine.js', 'chufsha-ui.js' )
		// (the engine imports nothing; every top-level name in chufsha-engine.js starts with "ch"/"CH_", so gmar-cheshbon can
		// bundle it next to dates.js, pitzuyim-engine.js and havraa-engine.js; no name collides with instrument.js or sim-handoff.js).
		'chufsha-shnatit' => array(
			'name'      => 'מחשבון ימי חופשה ופדיון חופשה',
			'title'     => 'חופשה שנתית ופדיון: כמה ימים, כמה שווים ועד מתי',
			'promise'   => 'לפי הוותק ושבוע של 5 או 6 ימים: הימים לפי החוק וצו ההרחבה (הגבוה מביניהם), שנה חלקית ומשרה חלקית לפי כלל 200/240, מה נצבר השנה, ערך יום חופשה, הפדיון בסיום העבודה עם המועדים, ומדרגות הוותק שלכם.',
			'question'  => 'כמה ימי חופשה מגיעים לי לפי הוותק, וכמה פדיון אקבל כשאעזוב?',
			'page'      => '/annual-leave-calculator/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'labor_chufsha' ),
			'dataset'   => 'labor_chufsha',
			'next_text' => 'הצעד הבא: להשוות לשורת החופשה בתלוש, להכניס ליומן את מועד התשלום, ולתרגל את השיחה עם המעסיק על הפדיון',
			'primary'   => array( 'label' => 'לתרגל את השיחה על הפדיון', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם המעסיק על פדיון החופשה', 'topic' => 'employment', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'גמר חשבון: כל מה שמגיע בסיום', 'path' => '/gmar-cheshbon/' ),
				array( 'label' => 'מכסות החופשה לפי ותק', 'path' => '/vacation-days-quota/' ),
				array( 'label' => 'המדריך של משרד העבודה (gov.il)', 'url' => 'https://www.gov.il/he/Departments/Guides/annual-vacations' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/labor-lawyer/' ),
			'sticky'    => 'פדיון',
		),
		// The labor-law wave (22.10.2026): the overtime time card on /overtime-pay-israel/ (pages 20391, BLOCK page). One week
		// of in/out times -> regular, 125%, 150% and the weekly rest, per day and per week as the Ministry counts it, the
		// month by the reader's own number of weeks, a fixed ("global") payment checked against it, the back pay with the
		// 7-year limitation, and the Wage Protection Law's dates. Bundle:
		// 'shaot-nosafot' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'nosafot-engine.js', 'nosafot-ui.js' )
		// (every top-level name in nosafot-engine.js starts with "ns"/"NS_"; the UI names do not collide with dates.js or
		// sim-handoff.js; checked on the built bundle: no duplicate top-level declaration).
		'shaot-nosafot'   => array(
			'name'      => 'מחשבון שעות נוספות',
			'title'     => 'מחשבון שעות נוספות: כרטיס הנוכחות מול החוק',
			'promise'   => 'שבוע אחד של שעות כניסה ויציאה, ומיד: כמה שעות רגילות, כמה ב-125%, כמה ב-150% ובמנוחה השבועית, לפי יום ולפי שבוע; משמרות לילה ושבוע של 5 או 6 ימים; כמה בחודש, האם "גלובלי" מכסה, וכמה מגיע לאחור עד ההתיישנות.',
			'question'  => 'כמה שעות נוספות מגיעות לי, ובכמה?',
			'page'      => '/overtime-pay-israel/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'labor_nosafot', 'rights_neto', 'min_wage', 'severance' ),
			'dataset'   => 'labor_nosafot',
			'next_text' => 'הצעד הבא: להשוות לתלוש ולדוח הנוכחות, ואם יש פער, לתרגל את השיחה עם המעסיק לפני שמבקשים את ההפרש',
			'primary'   => array( 'label' => 'לתרגל את השיחה עם המעסיק', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם המעסיק', 'topic' => 'employment', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'מחשבון שכר נטו: כמה נשאר מהגמול', 'path' => '/net-salary-calculator/' ),
				array( 'label' => 'תביעה בבית הדין לעבודה', 'path' => '/claim-labor-court/' ),
				array( 'label' => 'תלונה למשרד העבודה (gov.il)', 'url' => 'https://www.gov.il/he/service/work-rights-violation-complaints' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/labor-lawyer/' ),
			'sticky'    => 'בחודש',
		),
		// The labor wave (22.10.2026): the final settlement, "what am I owed when I leave", on /gmar-cheshbon/ (pages 24685).
		// Bundle (the recuperation engine in its own scope, see part() in tools/build-justice-tools.mjs):
		// 'gmar-cheshbon' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'pitzuyim-engine.js', 'havraa-engine.js as HV', 'chufsha-engine.js', 'gmar-engine.js', 'gmar-ui.js' )
		// (every money line is a sibling engine's own output: pitzuyim compute + pzFundCheck, chufsha chRedemption, havraa
		// compute in mode 'period'; every top-level name in gmar-*.js starts with "gm"/GM_ or is a UI export; checked: no
		// duplicate top-level name in the bundle).
		'gmar-cheshbon'  => array(
			'name'      => 'מחשבון גמר חשבון',
			'title'     => 'גמר חשבון: כל מה שמגיע בסיום העבודה, רכיב אחר רכיב',
			'promise'   => 'שאלון אחד: שכר החודש האחרון, הודעה מוקדמת, פיצויים וסעיף 14, פדיון חופשה ודמי הבראה, על תלוש של גמר חשבון; מה המעסיק משלם ומה הקופה משחררת, המועדים ליומן, סיכום להדפסה ומכתב דרישה.',
			'question'  => 'מה מגיע לי בגמר החשבון כשאני עוזב את העבודה?',
			'page'      => '/gmar-cheshbon/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'severance', 'min_wage', 'havraa', 'labor_chufsha', 'labor_pitzuyim', 'labor_gmar', 'rights_neto', 'rights_btl' ),
			'dataset'   => 'labor_gmar',
			'next_text' => 'הצעד הבא: לבקש את גמר החשבון בכתב עם טופס 161, להכניס ליומן את המועדים, ולתרגל את השיחה עם המעסיק',
			'primary'   => array( 'label' => 'לתרגל את שיחת גמר החשבון', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את שיחת גמר החשבון עם המעסיק', 'topic' => 'employment', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'מחשבון פיצויי פיטורים', 'path' => '/severance-pay-calculator/' ),
				array( 'label' => 'תביעה בבית הדין לעבודה', 'path' => '/claim-labor-court/' ),
				array( 'label' => 'משרד העבודה: פיטורים וסיום העסקה (gov.il)', 'url' => 'https://www.gov.il/he/departments/topics/termination-of-employment/govil-landing-page' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/labor-lawyer/' ),
			'sticky'    => 'גמר חשבון',
		),
	);
}

/** The answer box (40-70 words): the direct answer, its numbers, their sections and the check date. */
function justice_tools_labor_answer( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	// hodaa-mukdemet (jt46): the answer box. One paragraph, every figure from the registry: the tiers in severance.notice
	// (reused, never repeated), the sections and the check date in labor_hodaa.
	if ( 'hodaa-mukdemet' === $name && ! empty( $reg['labor_hodaa'] ) && ! empty( $reg['severance']['notice'] ) ) {
		$lh   = $reg['labor_hodaa'];
		$n    = $reg['severance']['notice'];
		$text = '<strong>הודעה מוקדמת</strong> לפי ' . esc_html( $lh['law']['he'] ) . ': בשכר חודשי, יום לכל חודש עבודה ב-<bdi>' . (int) $n['monthly']['first_months'] . '</bdi> החודשים הראשונים, אחר כך <bdi>' . (int) $n['monthly']['base_days'] . '</bdi> ימים ועוד <bdi>' . esc_html( (string) $n['monthly']['per_month'] ) . '</bdi> לכל חודש עד תום השנה, ואחרי שנה חודש. '
			. 'בשכר שעתי או יומי: יום לכל חודש בשנה הראשונה, <bdi>' . (int) $n['wage']['y2_base'] . '</bdi> ו-<bdi>' . (int) $n['wage']['y3_base'] . '</bdi> ימים ועוד יום לכל שני חודשים בשנים השנייה והשלישית, ואחר כך חודש. '
			. 'אותן מדרגות חלות בהתפטרות (' . esc_html( $lh['law']['sections']['resign'] ) . '), ויום ההודעה לא נספר. נבדק ' . esc_html( justice_tools_he_date( $lh['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// chufsha-shnatit (jt47): the answer box on /annual-leave-calculator/. One paragraph; every figure from labor_chufsha (the
	// s.3(א) table from 1.1.2017 and the Ministry's work-day columns, the extension order's 5-day rows from seniority 6 and 9,
	// 200/240, s.13) and the example from the snapshot; ends with the check date. The first sentence answers
	// "ימי חופשה לפי ותק" with the law's number.
	if ( 'chufsha-shnatit' === $name && ! empty( $reg['labor_chufsha'] ) ) {
		$lc   = $reg['labor_chufsha'];
		$lt   = $lc['law_table']['rows'];
		$ot   = $lc['order_table']['rows'];
		$lw   = $lc['law'];
		$top  = end( $lt );
		$snap = justice_tools_snapshot( 'chufsha-shnatit' );
		$text = '<strong>ימי חופשה לפי ותק</strong> נקבעים בסעיף 3 לחוק חופשה שנתית: מ-' . esc_html( justice_tools_he_date( $lc['law_table']['from'] ) ) . ' <bdi>' . (int) $lt[0]['gross'] . '</bdi> ימים בכל אחת מ-5 השנים הראשונות (<bdi>' . (int) $lt[0]['net5'] . '</bdi> ימי עבודה בשבוע של 5 ימים), <bdi>' . (int) $lt[1]['gross'] . '</bdi> בשנה השישית, <bdi>' . (int) $lt[2]['gross'] . '</bdi> בשביעית ועד <bdi>' . (int) $top['gross'] . '</bdi>. '
			. 'צו ההרחבה נותן בשבוע של 5 ימים <bdi>' . (int) $ot[3]['net5'] . '</bdi> ימים משנה ' . (int) $ot[3]['from'] . ' ו-<bdi>' . (int) $ot[4]['net5'] . '</bdi> משנה ' . (int) $ot[4]['from'] . ', והגבוה מביניהם קובע. שנה חלקית: לפי <bdi>' . (int) $lw['full_year_days'] . '</bdi> או <bdi>' . (int) $lw['part_year_days'] . '</bdi> ימי עבודה. '
			. 'בסיום העבודה משלמים פדיון (' . esc_html( $lw['sections']['redeem'] ) . '); בדוגמה שבמחשבון ' . justice_tools_money( (float) ( $snap['total'] ?? 0 ) ) . '. נבדק ' . esc_html( justice_tools_he_date( $lc['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// shaot-nosafot (jt48): the answer box. One paragraph, every figure from the registry: the rates, 42 hours, 182, 12 and
	// 16 from rights_neto.overtime (reused), the day norms from labor_nosafot, the example from the snapshot; ends with the
	// check date. Renders (22.10.2026): "שעות נוספות הן ... 8.6 ... 7.6 ... 42 ... 125% ... 150% ... 182 ... 1,320 ₪ ...".
	if ( 'shaot-nosafot' === $name && ! empty( $reg['labor_nosafot'] ) && ! empty( $reg['rights_neto'] ) ) {
		$ln   = $reg['labor_nosafot'];
		$ot   = $reg['rights_neto']['overtime'];
		$snap = justice_tools_snapshot( 'shaot-nosafot' );
		$text = '<strong>שעות נוספות</strong> הן השעות שמעבר ליום העבודה (<bdi>' . esc_html( (string) $ln['five']['day'] ) . '</bdi> שעות בשבוע של 5 ימים, ביום המקוצר <bdi>' . esc_html( (string) $ln['five']['short'] ) . '</bdi>, בלילה <bdi>' . (int) $ln['day']['short'] . '</bdi>) או מעבר ל-<bdi>' . (int) $ot['week_hours'] . '</bdi> שעות בשבוע. לפי ' . esc_html( $ln['pay']['section'] ) . ' לחוק שעות עבודה ומנוחה משלמים <bdi>' . (int) $ot['first_pct'] . '%</bdi> על שתי השעות הראשונות ביום ו-<bdi>' . (int) $ot['next_pct'] . '%</bdi> מהשלישית, ובמנוחה השבועית <bdi>' . (int) $ot['rest_pct'] . '%</bdi>; שכר השעה של עובד חודשי הוא השכר חלקי <bdi>' . (int) $ot['divisor'] . '</bdi>. '
			. 'בדוגמה שבמחשבון (שכר חודשי של ' . justice_tools_money( (float) ( $snap['input']['salary'] ?? 0 ), 0 ) . ', שבוע של 5 ימים) מגיעים ' . justice_tools_money( (float) ( $snap['total'] ?? 0 ), 0 ) . ' בחודש. נבדק ' . esc_html( justice_tools_he_date( $ln['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// gmar-cheshbon (jt56): the answer box. One paragraph, every figure from the registry: the due day and the ninth-day
	// rule (labor_chufsha.wage), the severance late days, the certificate days and the limitation (severance), the vacation
	// limitation section (labor_chufsha), the sick-pay rule (labor_gmar).
	if ( 'gmar-cheshbon' === $name && ! empty( $reg['labor_gmar'] ) && ! empty( $reg['severance'] ) && ! empty( $reg['labor_chufsha'] ) ) {
		$lg   = $reg['labor_gmar'];
		$sv   = $reg['severance'];
		$lc   = $reg['labor_chufsha'];
		$text = '<strong>גמר חשבון</strong> הוא התשלום הסופי בסיום העבודה: שכר החודש האחרון עם תום החודש (' . esc_html( $lc['wage']['due_section'] ) . ' לחוק הגנת השכר; מולן מהיום ה-<bdi>' . (int) $lc['wage']['late_day'] . '</bdi> שאחריו), הודעה מוקדמת, פיצויי פיטורים (מולנים אחרי <bdi>' . (int) $sv['late']['grace_days'] . '</bdi> ימים), פדיון חופשה ודמי הבראה. '
			. 'ימי מחלה לא נפדים (' . esc_html( $lg['sick']['absence_section'] ) . ' לחוק דמי מחלה). אישור על תקופת העבודה ניתן תוך <bdi>' . (int) $sv['notice']['cert_days'] . '</bdi> ימים. '
			. 'תביעה מתיישנת אחרי <bdi>' . (int) $sv['limitation']['years'] . '</bdi> שנים, ופדיון חופשה אחרי 3 (' . esc_html( $lc['law']['sections']['limitation'] ) . ' לחוק חופשה שנתית). נבדק ' . esc_html( justice_tools_he_date( $lg['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '';
}

/** The data stamp in the tool's header. */
function justice_tools_labor_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'hodaa-mukdemet' === $name ) {
		$lh = $reg['labor_hodaa'] ?? array();
		return 'חוק הודעה מוקדמת, נוסח ל-' . justice_tools_he_date( $lh['law']['current_to'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $lh['checked_on'] ?? '' );
	}
	// chufsha-shnatit (jt47): the header stamp. Renders: 16 ימים בשנים 1-5 מ-1.1.2017 · נבדק 22.10.2026
	if ( 'chufsha-shnatit' === $name ) {
		$lc = $reg['labor_chufsha'] ?? array();
		return (int) ( $lc['law_table']['rows'][0]['gross'] ?? 0 ) . ' ימים בשנים 1-5 מ-' . justice_tools_he_date( $lc['law_table']['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $lc['checked_on'] ?? '' );
	}
	if ( 'shaot-nosafot' === $name ) {
		$ln = $reg['labor_nosafot'] ?? array();
		$ot = $reg['rights_neto']['overtime'] ?? array();
		return (int) ( $ot['week_hours'] ?? 0 ) . ' שעות בשבוע מ-' . justice_tools_he_date( $ln['order']['from'] ?? '' ) . ' · שכר שעה לפי ' . (int) ( $ot['divisor'] ?? 0 ) . ' · נבדק ' . justice_tools_he_date( $ln['checked_on'] ?? '' );
	}
	// Renders: 42 שעות בשבוע מ-1.4.2018 · שכר שעה לפי 182 · נבדק 22.10.2026
	if ( 'gmar-cheshbon' === $name ) {
		$lg   = $reg['labor_gmar'] ?? array();
		$hv   = $reg['havraa']['private_rates'] ?? array();
		$last = $hv ? end( $hv ) : array();
		return 'חוק הגנת השכר, נוסח ל-' . justice_tools_he_date( $lg['wage']['current_to'] ?? '' ) . ( $last ? ' · יום הבראה ' . number_format( (float) $last['rate'], 2, '.', ',' ) . ' ₪' : '' ) . ' · נבדק ' . justice_tools_he_date( $lg['checked_on'] ?? '' );
	}
	return 'נבדק ' . justice_tools_he_date( justice_tools_checked_on( $name ) );
}

/** Official sources used by each instrument's result. */
function justice_tools_labor_sources( string $name ): array {
	$reg = justice_tools_registry();
	if ( 'hodaa-mukdemet' === $name ) {
		$lh      = $reg['labor_hodaa'];
		$sv      = $reg['severance'];
		$n       = $sv['notice'];
		$checked = justice_tools_he_date( $lh['checked_on'] );
		$fert    = 0;
		foreach ( $lh['women']['gates'] as $g ) {
			if ( 'fertility' === $g['code'] ) {
				$fert = (int) $g['days_after'];
			}
		}
		return array(
			array( 'name' => $lh['law']['he'], 'url' => $lh['law']['url'], 'text' => 'סעיף 2(ג) הודעה בכתב עם יום ההוצאה ויום הכניסה לתוקף; סעיף 3 משכורת חודשית: יום לחודש ב-' . (int) $n['monthly']['first_months'] . ' החודשים הראשונים, ' . (int) $n['monthly']['base_days'] . ' ועוד ' . $n['monthly']['per_month'] . ' לכל חודש עד תום השנה, חודש אחרי שנה; סעיף 4 שכר: יום לחודש בשנה הראשונה, ' . (int) $n['wage']['y2_base'] . ' ו-' . (int) $n['wage']['y3_base'] . ' ועוד יום לכל שני חודשים, חודש אחרי שלוש שנים; סעיף 5 התפטרות; סעיפים 6 ו-7 ויתור ופיצוי; סעיף 8(ב) אישור על תקופת העבודה בתוך ' . (int) $n['cert_days'] . ' ימים (' . (int) $n['cert_request_days'] . ' מבקשה בכתב); סעיפים 10 ו-12. נוסח עדכני ל-' . justice_tools_he_date( $lh['law']['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $lh['guide']['he'], 'url' => $lh['guide']['url'], 'text' => 'פרק "תקופת ההודעה המוקדמת": הטבלה לעובד בשכר לפי חודש העבודה (חודש 12: ' . (int) $lh['guide']['wage_table'][11] . ' ימים, 13: ' . (int) $lh['guide']['wage_table'][12] . ', 24: ' . (int) $lh['guide']['wage_table'][23] . ', 25: ' . (int) $lh['guide']['wage_table'][24] . ', 36: ' . (int) $lh['guide']['wage_table'][35] . ', יותר מ-36: חודש); ' . $lh['guide']['monthly_max_he'] . '. פורסם ' . justice_tools_he_date( $lh['guide']['published'] ) . ', נקרא ' . $checked . '.' ),
			array( 'name' => $lh['leave']['he'], 'url' => $lh['leave']['url'], 'text' => $lh['leave']['section'] . ': ' . $lh['leave']['rule_he'] . '; ' . $lh['leave']['redeem_section'] . ' פדיון חופשה. נוסח עדכני ל-' . justice_tools_he_date( $lh['leave']['current_to'] ) . '.' ),
			array( 'name' => $lh['women']['he'], 'url' => $lh['women']['url'], 'text' => 'סעיף 9: היריון אחרי ' . (int) $reg['rights_leida']['protect']['pregnancy_months'] . ' חודשים (9(א)), תקופת לידה והורות ו-' . (int) $reg['rights_leida']['protect']['after_days'] . ' ימים אחריה (9(ג)(1), (1א)), חופשה ללא תשלום והנקה (9(ג)(2)), מקלט (9(ד)), טיפולי פוריות ' . $fert . ' ימים (9(ה)), הפלה (9(ו)); 9(ג)(3) התקופות לא באות במניין ימי ההודעה; 9(ג)(2ג) מ-' . justice_tools_he_date( $lh['women']['unpaid_2026']['from'] ) . '; 13א(ב)(1) פיצוי של ' . (int) $lh['women']['compensation_pct'] . '%. נוסח עדכני ל-' . justice_tools_he_date( $lh['women']['current_to'] ) . '.' ),
			array( 'name' => $lh['women']['permit_he'], 'url' => $lh['women']['permit_url'], 'text' => 'השירות שבו מעסיק מבקש היתר לפיטורים לפי חוק עבודת נשים; היתר לא נדרש בהיריון לפני 6 חודשי העסקה. נקרא ' . $checked . '.' ),
			array( 'name' => $lh['reserve']['he'], 'url' => $lh['reserve']['url'], 'text' => 'סעיף 41א: אסור לפטר בשל מילואים; בזמן השירות ו-' . (int) $lh['reserve']['after_days'] . ' ימים אחרי שירות של יותר מיומיים רצופים רק בהיתר מוועדת התעסוקה; 41א(ג) התקופות לא באות במניין ימי ההודעה; 41א2(ה) בן או בת זוג של משרת במילואים עם ילד: ' . (int) $lh['reserve']['partner_after_days'] . ' ימים אחרי השירות (' . $lh['reserve']['partner_temp_he'] . '); סעיף 21(ג)(2) פיצויים. נוסח עדכני ל-' . justice_tools_he_date( $lh['reserve']['current_to'] ) . '.' ),
			array( 'name' => $lh['hearing']['he'], 'url' => $lh['hearing']['url'], 'text' => $lh['hearing']['duty_he'] . '. פורסם ' . justice_tools_he_date( $lh['hearing']['published'] ) . '.' ),
			array( 'name' => $sv['late']['he'], 'url' => $sv['late']['url'], 'text' => $sv['late']['section'] . ': פיצויי פיטורים ביום סיום העבודה; פיצוי הלנה אחרי היום ה-' . (int) $sv['late']['grace_days'] . ', ועוד ' . (int) $sv['late']['monthly_pct'] . '% לחודש אחרי היום ה-' . (int) $sv['late']['linkage_to_day'] . '.' ),
			array( 'name' => $sv['limitation']['he'], 'url' => $sv['limitation']['url'], 'text' => $sv['limitation']['section'] . ': ' . (int) $sv['limitation']['years'] . ' שנים.' ),
			array( 'name' => $lh['form_161']['he'], 'url' => $lh['form_161']['url'], 'text' => $lh['form_161']['from_he'] . '.' ),
		);
	}
	// chufsha-shnatit (jt47): the sources, every url and section from labor_chufsha.
	if ( 'chufsha-shnatit' === $name && ! empty( $reg['labor_chufsha'] ) ) {
		$lc      = $reg['labor_chufsha'];
		$lw      = $lc['law'];
		$am      = $lc['history']['amendment'];
		$top     = end( $lc['law_table']['rows'] );
		$checked = justice_tools_he_date( $lc['checked_on'] );
		return array(
			array( 'name' => $lw['he'], 'url' => $lw['url'], 'text' => 'סעיף 1 (שנת עבודה קלנדרית), סעיף 3(א) (' . (int) $lc['law_table']['rows'][0]['gross'] . ' ימים בשנים 1-5 ועד ' . (int) $top['gross'] . '), 3(ב) ו-3(ג) (' . (int) $lw['full_year_days'] . ' ו-' . (int) $lw['part_year_days'] . ' ימי עבודה), 4 ו-15(א) (פחות מ-' . (int) $lw['temp_days'] . ' ימים: ' . (int) $lw['temp_pct'] . '%), 5, 6, 7, 8, 9, 10, 11, 13 (פדיון), 14(ב), 17, 31 (התיישנות ' . (int) $lw['limitation_years'] . ' שנים). נוסח עדכני ל-' . justice_tools_he_date( $lw['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $am['he'], 'url' => $am['url'], 'text' => $am['gazette_he'] . ': ' . $am['change_he'] . '; ' . $am['temp_he'] . '.' ),
			array( 'name' => $lc['guide']['he'], 'url' => $lc['guide']['ch3'], 'text' => 'פורסם ' . justice_tools_he_date( $lc['guide']['published'] ) . ': טבלת החוק מ-' . justice_tools_he_date( $lc['law_table']['from'] ) . ' בימי לוח ובימי עבודה (6 ו-5 ימים), ' . $lc['order_table']['he'] . ' (' . $lc['order_table']['better_he'] . '), ' . $lc['manpower_table']['he'] . ', דוגמאות 200/240, ודמי חופשה ופדיון. נבדק ' . $checked . '.' ),
			array( 'name' => $lc['day_ratio']['he'], 'url' => $lc['day_ratio']['url'], 'text' => 'שכר מינימום יומי: החלק ה-' . (int) $lc['day_ratio']['w6'] . ' של החודש בשבוע של 6 ימים, החלק ה-' . $lc['day_ratio']['w5_he'] . ' בשבוע של 5 ימים. ' . $lc['day_ratio']['note_he'] . '.' ),
			array( 'name' => $lc['wage']['he'], 'url' => $lc['wage']['url'], 'text' => $lc['wage']['due_section'] . ': ' . $lc['wage']['due_he'] . '; ' . $lc['wage']['late_section'] . ': ' . $lc['wage']['late_he'] . '; ' . $lc['wage']['payslip_section'] . ': ' . $lc['wage']['payslip_he'] . '.' ),
			array( 'name' => $lc['history']['before']['he'], 'url' => $lc['history']['before']['url'], 'text' => 'נוסח החוק באתר המוסד לביטוח לאומי (תיקונים עד התשע"ג): ' . (int) $lc['history']['before']['rows'][0]['gross'] . ' ימים בשנים 1-4, ' . (int) $lc['history']['before']['rows'][1]['gross'] . ' בשנה החמישית.' ),
			array( 'name' => $lc['extended']['he'], 'url' => $lc['extended']['url'], 'text' => $lc['extended']['text_he'] . '.' ),
		);
	}
	if ( 'shaot-nosafot' === $name && ! empty( $reg['labor_nosafot'] ) ) {
		$ln      = $reg['labor_nosafot'];
		$ot      = $reg['rights_neto']['overtime'];
		$mw      = $reg['min_wage'];
		$lim     = $reg['severance']['limitation'];
		$last    = end( $mw['rows'] );
		$checked = justice_tools_he_date( $ln['checked_on'] );
		return array(
			array( 'name' => $ln['law_he'], 'url' => $ln['law_url'], 'text' => 'סעיף 1 (שעות נוספות; עבודת לילה: ' . (int) $ln['night']['min_hours'] . ' שעות לפחות בין ' . $ln['night']['from'] . ' ל-' . $ln['night']['to'] . '), 2 (יום של ' . (int) $ln['day']['regular'] . ' שעות, ' . (int) $ln['day']['short'] . ' בלילה ובערב מנוחה או חג), 3 (' . (int) $ln['law_week']['hours'] . ' שעות), 7 (מנוחה של ' . (int) $ln['rest']['hours'] . ' שעות), 9 ו-12 (היתר לעבודה במנוחה), 16 (' . (int) $ot['first_pct'] . '% ו-' . (int) $ot['next_pct'] . '%), 17 (' . (int) $ot['rest_pct'] . '%), 18 (השכר הרגיל), 20 ו-21 (הפסקות), 22 (לילה במשמרות), 25 (פנקס שעות), 30 (מי שהחוק לא חל עליו). נוסח עדכני ל-' . justice_tools_he_date( $ln['law_current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $ln['order_he'], 'url' => $ln['order_url'], 'text' => 'הסכם קיבוצי ' . $ln['order']['agreement'] . '; פורסם ' . justice_tools_he_date( $ln['order']['published'] ) . ', בתוקף מ-' . justice_tools_he_date( $ln['order']['from'] ) . ': ' . (int) $ot['week_hours'] . ' שעות בשבוע ויום מקוצר (' . $ln['order']['section'] . '); שכר השעה לפי ' . (int) $ot['divisor'] . ' שעות בחודש (' . $ln['order']['divisor_section'] . ').' ),
			array( 'name' => $ln['review_he'], 'url' => $ln['review_url'], 'text' => 'עמ\' 13: ההיתר הכללי מ-' . justice_tools_he_date( $ln['permit']['published'] ) . ' (' . $ln['permit']['gazette_he'] . '): עד ' . (int) $ot['max_day'] . ' שעות ביום כולל שעות נוספות, עד ' . (int) $ot['max_week_overtime'] . ' שעות נוספות בשבוע, עובד לילה עד ' . (int) $ln['permit']['night_week'] . ' שעות בשבוע. עמ\' 23: יום של ' . $ln['five']['day'] . ' שעות ויום מקוצר של ' . $ln['five']['short'] . ' לפי צו ההרחבה.' ),
			array( 'name' => $ln['directive_he'], 'url' => $ln['directive_url'], 'text' => $ln['count']['he'] . '. ' . $ln['regular']['min_he'] . '.' ),
			array( 'name' => $ln['divisor_he'], 'url' => $ln['divisor_url'], 'text' => 'ערך השעה לפי ' . (int) $ot['divisor'] . ' שעות מ-' . justice_tools_he_date( $ln['order']['from'] ) . ', ולפני כן לפי 186 (צו ההרחבה מ-1996).' ),
			array( 'name' => $ln['wage_law_he'], 'url' => $ln['wage_law_url'], 'text' => 'סעיפים 1 ו-9 (המועד והיום הקובע: ' . (int) $ln['pay_day']['after_days'] . ' ימים אחרי המועד), 10 (שכר לפי שעה), 5 (שכר כולל), 17 ו-17א (פיצוי הלנת שכר, שנה), 24 (תלוש), 26ב (נטל ההוכחה: ' . (int) $ln['burden']['week'] . ' שעות נוספות בשבוע, ' . (int) $ln['burden']['month'] . ' בחודש). נוסח עדכני ל-' . justice_tools_he_date( $ln['wage_law_current_to'] ) . '.' ),
			array( 'name' => $lim['he'], 'url' => $lim['url'], 'text' => $lim['section'] . ' ו-6: ' . (int) $lim['years'] . ' שנים מהיום שבו נולדה העילה.' ),
			array( 'name' => $mw['source_name'], 'url' => $mw['source_url'], 'text' => 'שכר המינימום לשעה מ-' . justice_tools_he_date( $last['from'] ) . ': ' . number_format( (float) $last['hourly_182'], 2 ) . ' ₪ (לפי 182 שעות), ' . number_format( (float) $last['monthly'], 2 ) . ' ₪ לחודש.' ),
			array( 'name' => $ln['youth_law_he'], 'url' => $ln['youth_law_url'], 'text' => $ln['youth']['he'] . ' (' . $ln['youth']['section'] . ').' ),
		);
	}
	if ( 'gmar-cheshbon' === $name ) {
		$lg      = $reg['labor_gmar'];
		$sv      = $reg['severance'];
		$lc      = $reg['labor_chufsha'];
		$hv      = $reg['havraa'];
		$checked = justice_tools_he_date( $lg['checked_on'] );
		$rates   = $hv['private_rates'];
		$rate    = end( $rates );
		return array(
			array( 'name' => $lg['wage']['he'], 'url' => $lg['wage']['url'], 'text' => $lc['wage']['due_section'] . ' שכר חודשי עם תום החודש; ' . $lg['wage']['hourly_section'] . ' שכר לפי שעה או יום; סעיף 1 "היום הקובע": היום ה-' . (int) $lc['wage']['late_day'] . ' שאחרי המועד; ' . $sv['late']['section'] . '(ב) פיצויים מולנים אחרי ' . (int) $sv['late']['grace_days'] . ' ימים, ' . (int) $sv['late']['monthly_pct'] . '% לחודש אחרי היום ה-' . (int) $sv['late']['linkage_to_day'] . '; ' . $lg['wage']['demand_section'] . ' דרישה בכתב; ' . $lg['wage']['fund_notice_section'] . ' הודעה לקופה תוך ' . (int) $lg['wage']['fund_notice_days'] . ' ימים; ' . $lg['wage']['deduct_section'] . ' ו-' . $lg['wage']['deduct_last_section'] . ' ניכויים. נוסח ל-' . justice_tools_he_date( $lg['wage']['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $sv['law_he'], 'url' => $sv['law_url'], 'text' => 'סעיף 1 זכאות אחרי שנה; סעיפים 6-11 התפטרות שדינה פיטורים; סעיף 12 משכורת חודש לכל שנה; סעיף 14 והאישור הכללי (' . $sv['approval']['gazette_he'] . '): ' . (int) $sv['approval']['partial_pct'] . '% או ' . (int) $sv['approval']['full_pct'] . '%. נוסח ל-' . justice_tools_he_date( $sv['law_current_to'] ) . '.' ),
			array( 'name' => $sv['notice']['he'], 'url' => $sv['notice']['url'], 'text' => 'סעיפים 3-5 תקופת ההודעה; סעיף 6 ויתור על העבודה בתשלום; סעיף 7 פיצוי כשלא ניתנה הודעה; סעיף 8 אישור על תקופת העבודה תוך ' . (int) $sv['notice']['cert_days'] . ' ימים (' . (int) $sv['notice']['cert_request_days'] . ' מבקשה בכתב). נוסח ל-' . justice_tools_he_date( $sv['notice']['current_to'] ) . '.' ),
			array( 'name' => $lc['law']['he'], 'url' => $lc['law']['url'], 'text' => $lc['law']['sections']['length'] . ' ימי החופשה לפי ותק; ' . $lc['law']['sections']['pay'] . ' דמי החופשה; ' . $lc['law']['sections']['redeem'] . ' פדיון בסיום; ' . $lc['law']['sections']['limitation'] . ' התיישנות 3 שנים. נוסח ל-' . justice_tools_he_date( $lc['law']['current_to'] ) . '.' ),
			array( 'name' => $hv['order_he'], 'url' => $hv['order_url'], 'text' => 'סעיף 5: ימי הבראה לפי ותק, חלק יחסי למשרה ולשנה; מחיר יום במגזר הפרטי ' . number_format( (float) $rate['rate'], 2, '.', ',' ) . ' ₪ (' . $rate['label_he'] . '; ' . $rate['source_he'] . ').' ),
			array( 'name' => $lg['sick']['he'], 'url' => $lg['sick']['url'], 'text' => $lg['sick']['absence_section'] . ' דמי מחלה רק בעד היעדרות עקב מחלה; ' . $lg['sick']['accrual_section'] . ' יום וחצי לחודש, עד ' . (int) $lg['sick']['accrual_max_days'] . ' ימים; ' . $lg['sick']['no_dismissal_section'] . ' איסור פיטורים בימי מחלה; ' . $lg['sick']['agreed_section'] . ' תנאים מוסכמים. נוסח ל-' . justice_tools_he_date( $lg['sick']['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => 'רשות המסים: ' . $lg['form_161']['he'], 'url' => $lg['form_161']['url'], 'text' => $lg['form_161']['when_he'] . '; ' . $lg['form_161']['to_he'] . '. נקרא ' . $checked . '.' ),
			array( 'name' => $sv['tax']['source_he'], 'url' => $sv['tax']['source_url'], 'text' => $sv['tax']['section'] . ' לפקודת מס הכנסה: פטור עד משכורת חודש לכל שנת עבודה, ולא יותר מ-' . number_format( (float) $sv['tax']['ceiling'], 0, '.', ',' ) . ' ₪ לשנה; ' . $sv['tax']['frozen_he'] . '.' ),
			array( 'name' => $sv['limitation']['he'], 'url' => $sv['limitation']['url'], 'text' => $sv['limitation']['section'] . ': ' . (int) $sv['limitation']['years'] . ' שנים.' ),
			array( 'name' => $lg['ministry']['topic_he'], 'url' => $lg['ministry']['topic_url'], 'text' => 'השירותים של משרד העבודה בסיום העסקה, וביניהם ' . $lg['ministry']['complaint_he'] . '. נקרא ' . $checked . '.' ),
		);
	}
	return array();
}

/** The page table of each instrument, rendered by the build from the registry. */
function justice_tools_labor_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}
