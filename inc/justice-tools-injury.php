<?php
/**
 * The road-accident and personal-injury wave (22.10.2026, HAD-591): three new instruments of the injury cluster, plus the
 * upgraded road-accident tool (teunat-drachim, whose catalog, answer, stamp and sources stay in inc/justice-tools.php).
 *
 *   [justice_tool name="teunat-avoda"]    the work-injury journey under chapter 5 of the National Insurance Law: is it a
 *                                         work accident, the injury allowance (75%, the 2026 daily maximum, the days), the
 *                                         permanent degree -> nothing / grant / monthly pension, reg. 15, the deadlines
 *                                         (/work-accident-guide/)
 *   [justice_tool name="shiklul-nechut"]  the disability degree of the 1956 regulations: the weighting of reg. 11(ב), a
 *                                         previous condition, reg. 15 and rounding, a curated list of impairment items, and
 *                                         what the degree means for work injury, general disability and a road accident
 *                                         (/regulations-insurance-1956/; the regulations' text stays below the guide)
 *   [justice_tool name="shaon-nezikin"]   the injured person's clock: who pays, the first-30-days steps with their sources,
 *                                         the last day to sue (minors, late discovery, the war window, rest days), the policy
 *                                         limitation, the National Insurance dates, which court (/tort-lawyer/)
 *   [justice_tool_lead name="..."]        the result-first card (inc/justice-tools-rights-2a.php) accepts these names and
 *                                         teunat-drachim too.
 * The four instruments link to each other with the reader's numbers through each tool's own share state (#s=).
 * Every number is read from assets/data/justice-tools-registry.json (injury_avoda, injury_shiklul, injury_sheon and
 * injury_teuna, built by tools/justice_tools_injury_<lane>.py, and the existing car_accident, rights_btl, rights_nechut and
 * small_claims datasets) or from the snapshot the build renders.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_injury_names(): array {
	return array( 'teunat-avoda', 'shiklul-nechut', 'shaon-nezikin' );
}

/** The catalog entries, merged into justice_tools_catalog(). */
function justice_tools_injury_catalog(): array {
	return array(
		// The road-accident and personal-injury wave (22.10.2026, HAD-591): the work-injury journey, on /work-accident-guide/
		// (pages 20435). Bundle:
		// 'teunat-avoda' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'avoda-engine.js', 'avoda-ui.js' )
		// (every top-level name in avoda-*.js starts with "av" / "AV" or is a UI export; no name collides with instrument.js,
		// dates.js or sim-handoff.js: the build copy in parts/avoda checks every declaration of the concatenated scope).
		'teunat-avoda'    => array(
			'name'      => 'מחשבון תאונת עבודה',
			'title'     => 'תאונת עבודה: דמי פגיעה, מענק או קצבת נכות, והמועדים',
			'promise'   => 'מיום הפגיעה ועד המענק או הקצבה: האם זו תאונת עבודה, כמה דמי פגיעה ליום ולכמה ימים, מה משולם לפי אחוז הנכות ותקנה 15, והמועדים לתביעה ולערר ליומן.',
			'question'  => 'נפגעתי בעבודה: כמה מגיע מהביטוח הלאומי, ועד מתי מגישים?',
			'page'      => '/work-accident-guide/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'injury_avoda', 'rights_btl' ),
			'dataset'   => 'injury_avoda',
			'next_text' => 'הצעד הבא: להגיש לביטוח הלאומי את התביעה לדמי פגיעה (בל/211), להכניס ליומן את המועדים, ולתרגל את ההופעה בוועדה הרפואית',
			'primary'   => array( 'label' => 'לתרגל את הוועדה הרפואית', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את ההופעה בפני הוועדה הרפואית', 'topic' => 'personal-injury', 'purpose' => 'witness_prep' ),
			'more'      => array(
				array( 'label' => 'דמי פגיעה: השיעור והתקרה', 'path' => '/injury-allowance-2026-rates/' ),
				array( 'label' => 'מענק או קצבת נכות מעבודה', 'path' => '/grant-versus-pension-work-disability/' ),
				array( 'label' => 'הביטוח הלאומי: נפגעי עבודה (btl.gov.il)', 'url' => 'https://www.btl.gov.il/benefits/Work_Injury/Pages/default.aspx' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין לביטוח לאומי', 'path' => '/national-insurance-attorney/' ),
			// The snapshot gives the sticky as HTML (the injury allowance of the example, "13,500 ₪").
			'sticky'    => 'דמי פגיעה',
		),
		// The road-accident and personal-injury wave (22.10.2026, HAD-591): the disability degree, on /regulations-insurance-1956/
		// (articles 6048, CLASSIC; the regulations' text stays below the guide). Bundle:
		// 'shiklul-nechut' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js as TE', 'shiklul-engine.js', 'shiklul-ui.js' )
		// (the road engine is bundled in its own scope as TE, for its frozen nonPecuniary(); every top-level name in
		// shiklul-*.js starts with "sk" or is a UI export; no name collides with instrument.js, sim-handoff.js or dates.js).
		'shiklul-nechut'  => array(
			'name'      => 'מחשבון שקלול אחוזי נכות',
			'title'     => 'שקלול אחוזי נכות ותקנה 15: הדרגה לפי התקנות, ומה היא אומרת',
			'promise'   => 'לפי מספרי הסעיפים בפרוטוקול: השקלול של תקנה 11(ב), מצב קודם, תקרת הפרק, תקנה 15 ועיגול, ומה הדרגה אומרת בנפגעי עבודה, בנכות כללית ובתאונת דרכים, עם מועדי הערר ליומן.',
			'question'  => 'איך משקללים כמה אחוזי נכות, ומה מקבלים בדרגה שנקבעה?',
			'page'      => '/regulations-insurance-1956/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'injury_shiklul', 'rights_nechut', 'car_accident' ),
			'dataset'   => 'injury_shiklul',
			'next_text' => 'הצעד הבא: לבדוק את הסעיפים מול הפרוטוקול, להכניס ליומן את מועד הערר, ולתרגל את הוועדה הרפואית',
			'primary'   => array( 'label' => 'לתרגל את הוועדה הרפואית', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הוועדה הרפואית עם הפגימות שלכם', 'topic' => 'personal-injury', 'purpose' => 'witness_prep' ),
			'more'      => array(
				array( 'label' => 'מדריך תאונת עבודה ודמי פגיעה', 'path' => '/work-accident-guide/' ),
				array( 'label' => 'תקנה 15: הגדלה עד מחצית', 'path' => '/functional-disability-increase-half/' ),
				array( 'label' => 'מחשבון הנכות המשוקללת של הביטוח הלאומי', 'url' => 'https://www.btl.gov.il/benefits/Disability/Pages/chishuvDargatNehutMeshuklelet.aspx' ),
			),
			'lawyer'      => array( 'label' => 'ייצוג בוועדה רפואית', 'path' => '/representation-medical-committee-lawyer/' ),
			'sticky'      => 'דרגה',
			// The snapshot gives the sticky as HTML ("<bdi>28%</bdi>"); 'count' keeps the money formatter away.
			'sticky_kind' => 'count',
		),
		// The road-accident and personal-injury wave (22.10.2026, HAD-591): the injured person's clock on /tort-lawyer/ (articles 344).
		// Bundle: 'shaon-nezikin' => array( 'instrument.js', 'sim-handoff.js', 'dates.js', 'teuna-engine.js as TE', 'shaon-engine.js', 'shaon-ui.js' )
		// (reuses limitation() of the wave-4 road engine in its own scope, as TE: the minor's years, the war window, rest days;
		// every top-level name in shaon-*.js starts with "sh" or is a UI export; no name collides with instrument.js, dates.js
		// or sim-handoff.js). The page's lawyer intent stays: the lawyer link goes to the personal-injury pillar.
		'shaon-nezikin'  => array(
			'name'      => 'השעון של הנפגע',
			'title'     => 'אחרי תאונה או פגיעה: מי משלם, מה עושים ב-30 הימים הראשונים ועד מתי תובעים',
			'promise'   => 'לפי יום הפגיעה וסוגה: מי משלם, צעדים עם המקור והמועד של כל אחד, היום האחרון לתביעה (קטינים, גילוי מאוחר, תקופת המלחמה, יום מנוחה), התיישנות הפוליסה, מועדי הביטוח הלאומי, באיזה בית משפט, והכול ליומן.',
			'question'  => 'עד מתי אפשר להגיש תביעת נזיקין על נזק גוף, ומה עושים עכשיו?',
			'page'      => '/tort-lawyer/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'car_accident', 'small_claims', 'injury_sheon' ),
			'dataset'   => 'injury_sheon',
			'next_text' => 'הצעד הבא: להכניס ליומן את המועדים, לשמור את המסמכים מהימים הראשונים, ולתרגל את הדיון הראשון לפני שמגישים',
			'primary'   => array( 'label' => 'לתרגל את הדיון הראשון', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הדיון הראשון בבית המשפט', 'topic' => 'personal-injury', 'purpose' => 'court_rehearsal' ),
			'more'      => array(
				array( 'label' => 'מחשבון פיצויים לנפגעי תאונות דרכים', 'path' => '/israel-road-accident-compensation-law/' ),
				array( 'label' => 'תאונת עבודה: דמי פגיעה ונכות', 'path' => '/work-accident-guide/' ),
				array( 'label' => 'חוק ההתיישנות (נוסח עדכני)', 'url' => 'https://www.nevo.co.il/law_html/law00/71809.htm' ),
			),
			'lawyer'      => array( 'label' => 'עורך דין נזיקין ותאונות', 'path' => '/personal-injury-law/' ),
			'sticky'      => 'היום האחרון',
			// The snapshot gives the sticky as HTML ("<bdi>9.10.2033</bdi>"); 'count' keeps the money formatter away.
			'sticky_kind' => 'count',
		),
	);
}

/** The answer box: one paragraph, every figure from the registry, ending with the check date. */
function justice_tools_injury_answer( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	// teunat-avoda (jt61): the answer box. One paragraph, every figure from the registry: injury_avoda (the 2026 maximums,
	// the days, the thresholds, the claim period) and the check date.
	if ( 'teunat-avoda' === $name && ! empty( $reg['injury_avoda'] ) ) {
		$av   = $reg['injury_avoda'];
		$a    = $av['allowance'];
		$d    = $av['disability'];
		$text = '<strong>תאונת עבודה</strong> היא תאונה שקרתה תוך כדי העבודה ועקב העבודה, כולל בדרך לעבודה וממנה (סעיפים 79 ו-80 לחוק הביטוח הלאומי). מי שלא יכול לעבוד מקבל דמי פגיעה: <bdi>' . (int) $a['pct'] . '%</bdi> מהשכר הרגיל, עד ' . justice_tools_money( $a['max_daily'] ) . ' ליום מ-' . esc_html( justice_tools_he_date( $a['max_daily_from'] ) ) . ', לכל היותר <bdi>' . (int) $a['max_days'] . '</bdi> ימים. '
			. 'אם נשארה נכות: <bdi>' . (int) $d['grant_min'] . '%</bdi> עד פחות מ-<bdi>' . (int) $d['pension_min'] . '%</bdi> לצמיתות מענק של <bdi>' . (int) $d['grant_months'] . '</bdi> קצבאות, ו-<bdi>' . (int) $d['pension_min'] . '%</bdi> ומעלה קצבה חודשית, עד ' . justice_tools_money( $d['max_monthly'], 0 ) . ' לנכות של 100%. מגישים תביעה בתוך <bdi>' . (int) $av['deadlines']['claim_months'] . '</bdi> חודשים. נבדק ' . esc_html( justice_tools_he_date( $av['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// shiklul-nechut (jt62): the answer box. One paragraph, every figure from the registry: the Institute's example and the
	// thresholds of the law in injury_shiklul (never repeated here).
	if ( 'shiklul-nechut' === $name && ! empty( $reg['injury_shiklul'] ) ) {
		$sk   = $reg['injury_shiklul'];
		$ex   = $sk['institute']['example'];
		$law  = $sk['law'];
		$text = '<strong>שקלול אחוזי נכות</strong> לפי ' . esc_html( $sk['rules']['weighting']['section'] ) . ' ל' . esc_html( $sk['regs']['he'] ) . ': האחוז הגבוה נכנס במלואו, וכל אחוז נוסף מחושב מתוך מה שנשאר, ולכן <bdi>' . (int) $ex[0] . '%</bdi> ו-<bdi>' . (int) $ex[1] . '%</bdi> הם <bdi>' . (int) $sk['institute']['example_total'] . '%</bdi>. '
			. 'דרגה יציבה של <bdi>' . (int) $law['pension_stable_min'] . '%</bdi> ומעלה מזכה בקצבה חודשית, ומ-<bdi>' . (int) $law['grant_min'] . '%</bdi> עד פחות מ-<bdi>' . (int) $law['grant_below'] . '%</bdi> במענק של <bdi>' . (int) $law['grant_months'] . '</bdi> קצבאות; '
			. 'לפי ' . esc_html( $sk['r15']['section'] ) . ' הוועדה רשאית להגדיל דרגה יציבה עד מחצית. נבדק ' . esc_html( justice_tools_he_date( $sk['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// shaon-nezikin (jt63): the answer box. One paragraph, every figure from the registry: the 7 years, 18 and the war
	// window in car_accident.limitation (reused, never repeated), the rest in injury_sheon.
	if ( 'shaon-nezikin' === $name && ! empty( $reg['injury_sheon'] ) && ! empty( $reg['car_accident']['limitation'] ) ) {
		$sh   = $reg['injury_sheon'];
		$lim  = $reg['car_accident']['limitation'];
		$text = '<strong>תביעת נזיקין</strong> על נזק גוף, גם אחרי תאונת דרכים, מתיישנת <bdi>' . (int) $lim['years'] . '</bdi> שנים מיום הפגיעה (' . esc_html( $lim['section'] ) . ' ל' . esc_html( $lim['he'] ) . '). לקטין הן נספרות מגיל <bdi>' . (int) $lim['adult_age'] . '</bdi>; '
			. 'לנזק שהתגלה מאוחר, מיום הגילוי ולא יותר מ-<bdi>' . (int) $sh['torts']['late_cap_years'] . '</bdi> שנים מהנזק (' . esc_html( $sh['torts']['late_cap_section'] ) . ' לפקודת הנזיקין), והימים <bdi>' . esc_html( justice_tools_he_date( $lim['war']['from'] ) ) . '</bdi> עד <bdi>' . esc_html( justice_tools_he_date( $lim['war']['to'] ) ) . '</bdi> לא נספרים. '
			. 'תביעה לפי פוליסה פרטית: <bdi>' . (int) $sh['insurance']['limit_years'] . '</bdi> שנים (' . esc_html( $sh['insurance']['limit_section'] ) . ' לחוק חוזה הביטוח); לביטוח הלאומי: <bdi>' . (int) $sh['nii']['claim_months'] . '</bdi> חודשים. נבדק ' . esc_html( justice_tools_he_date( $sh['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '';
}

/** The data stamp in the tool's header. */
function justice_tools_injury_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'teunat-avoda' === $name ) {
		$av = $reg['injury_avoda'] ?? array();
		return 'חוק הביטוח הלאומי, פרק ה\' · תקרה ' . number_format( (float) ( $av['allowance']['max_daily'] ?? 0 ), 2, '.', ',' ) . ' ₪ ליום מ-' . justice_tools_he_date( $av['allowance']['max_daily_from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $av['checked_on'] ?? '' );
	}
	if ( 'shiklul-nechut' === $name ) {
		$sk = $reg['injury_shiklul'] ?? array();
		return 'תקנות קביעת דרגת נכות, נוסח ל-' . justice_tools_he_date( $sk['regs']['current_to'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $sk['checked_on'] ?? '' );
	}
	if ( 'shaon-nezikin' === $name ) {
		$sh = $reg['injury_sheon'] ?? array();
		return 'חוק ההתיישנות, נוסח ל-' . justice_tools_he_date( $sh['limitation']['current_to'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $sh['checked_on'] ?? '' );
	}
	return 'נבדק ' . justice_tools_he_date( justice_tools_checked_on( $name ) );
}

/** Official sources used by each instrument's result. */
function justice_tools_injury_sources( string $name ): array {
	$reg = justice_tools_registry();
	if ( 'teunat-avoda' === $name ) {
		$av      = $reg['injury_avoda'];
		$a       = $av['allowance'];
		$d       = $av['disability'];
		$g       = $av['regs'];
		$t       = $av['deadlines'];
		$p       = $av['pages'];
		$btl     = $reg['rights_btl'];
		$checked = justice_tools_he_date( $av['checked_on'] );
		return array(
			array( 'name' => $av['law']['he'] . ', ' . $av['law']['chapter_he'], 'url' => $av['law']['url'], 'text' => 'סעיף 75 מבוטחים; 77(א) עצמאי רשום; 79 הגדרת תאונת עבודה; 80 החזקות (בדרך, הפסקה עד 3 שעות, הצלה, אדם אחר, ועד עובדים); 81 הפסקה או סטייה, ליווי ילד ותפילת בוקר, רשלנות פושעת (4 שבועות); 82 רשלנות נגד הוראות (10 ימים); 92(ב) 13 שבועות; 93 יום הפגיעה ושני הימים הראשונים (12 ימים); 94 תקופת הזכאות הראשונה (12 ימים); 97(א) 75%, עד 75% מהסכום הבסיסי כפול 5 חלקי 30; 98 רבע השנה חלקי 90; 102 דמי פגיעה מופחתים; 104 הספים 9% ו-20%; 105-107 קצבה של 100% היא דמי הפגיעה ליום כפול 30, לפי אחוז הנכות, מענק של ' . (int) $d['grant_months'] . ' קצבאות ומענק מוגדל עד גיל 21; 110 הצמדה למדד; 112, 113, 115, 118-123, 126. הנוסח שמפרסם המוסד לביטוח לאומי, נקרא ' . $checked . '.' ),
			array( 'name' => $av['law']['he'] . ', פרק י"ד', 'url' => $av['law']['general_url'], 'text' => 'סעיף 296(א) תביעה בתוך 12 חודשים מהיום שבו נוצרה העילה; 296(ב)(1) תביעה מאוחרת: לא יותר מ-12 החודשים שלפני חודש התביעה; 302(א)(3) מקדמה; 328(א) תביעה נגד צד שלישי; 328א(ב)(2) מ-1.1.2023 הגמלה מופחתת מפיצויים לפי חוק פיצויים לנפגעי תאונות דרכים; 329 זקיפה של עד 75%. נקרא ' . $checked . '.' ),
			array( 'name' => $g['he'], 'url' => $g['url'], 'text' => 'תקנה 15(א) הגדלה של עד מחצית בדרגה יציבה, לפי המקצוע והגיל, ועד ' . (int) $g['reg15']['grant_cap'] . '% כשהדרגה פחותה מ-' . (int) $g['reg15']['grant_cap_below'] . '%; 15(ב) ירידה ניכרת בהכנסות; 16 עד 100% מ-' . (int) $g['reg16']['min'] . '%; 17 בקשה בין ' . (int) $g['reg17']['from_months'] . ' ל-' . (int) $g['reg17']['to_months'] . ' חודשים; 18א נכה נזקק עד ' . (int) $g['reg18a']['months'] . ' חודשים; 19א עיגול כלפי מעלה של דרגה שמזכה בקצבה; 20 תחולת הקביעה; 27(א) ערר בתוך ' . (int) $g['reg27']['days'] . ' יום; 28 נימוקים ' . (int) $g['reg28']['days'] . ' ימים נוספים; 36(א) החמרה אחרי ' . (int) $g['reg36']['months'] . ' חודשים. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: שיעור דמי הפגיעה ליום', 'url' => $p['ia_rate'], 'text' => $a['alt_base_he'] . '; ' . $a['max_daily_he'] . '; ' . $a['income_he'] . '; ' . $a['self_base_he'] . '; ' . $a['deductions_he'] . '. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: תקופת תשלום דמי הפגיעה', 'url' => $p['ia_period'], 'text' => 'לכל היותר 13 שבועות (91 ימים), רצופים או לא, ממחרת יום הפגיעה; את שכר יום הפגיעה משלם המעסיק; ' . $a['waiting_btl_he'] . '; ' . $a['first_period_he'] . '; לעצמאי בניכוי 12 ימי ההיעדרות הראשונים. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: הגשת תביעה לדמי פגיעה', 'url' => $p['ia_claim'], 'text' => 'בתוך 12 חודשים מיום הפגיעה; טופס ' . $av['forms']['claim']['code'] . ', הפניה ' . $av['forms']['referral']['code'] . ' (שכיר) או ' . $av['forms']['referral_self']['code'] . ' (עצמאי) ותעודה רפואית ראשונה; ' . $av['forms']['road_docs_he'] . '. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: שיעורי קצבת נכות מעבודה', 'url' => $p['wd_rates'], 'text' => $d['max_monthly_he'] . '; ' . $d['grant_he'] . '; ' . $d['young_he'] . ' (' . number_format( (float) $btl['avg_wage']['s2_benefits'], 0, '.', ',' ) . ' ש"ח מ-1.1.2026); ' . $d['pay_he'] . '. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: ערר על החלטת הוועדה הרפואית', 'url' => $p['wd_arar'], 'text' => 'ערר בכתב ובנימוקים בתוך ' . (int) $t['arar_days'] . ' יום, ועוד ' . (int) $t['reasons_days'] . ' יום לנימוקים; ' . $t['court_he'] . '. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: ועדת תביעות וערעור לבית הדין לעבודה', 'url' => $p['claims_committee'], 'text' => $t['claims_committee_he'] . '; ' . $t['labor_court_he'] . '. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: מהי פגיעה בעבודה', 'url' => $p['what_is'], 'text' => $av['accident']['btl_more_he'] . '; ליווי ילד עד גיל ' . (int) $av['accident']['deviation']['child_age'] . ' בדרך לא נחשב סטייה. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: הסכום הבסיסי והשכר הממוצע', 'url' => $btl['basic_amount']['url'], 'text' => 'סכום בסיסי 1 מ-1.1.2026: ' . number_format( (float) $btl['basic_amount']['b1'], 0, '.', ',' ) . ' ש"ח (הבסיס לתקרת דמי הפגיעה, סעיף 97(א)); השכר הממוצע לפי סעיף 2: ' . number_format( (float) $btl['avg_wage']['s2_benefits'], 0, '.', ',' ) . ' ש"ח. נבדק ' . justice_tools_he_date( $btl['checked_on'] ) . '.' ),
			array( 'name' => 'משרד העבודה: דיווח על תאונת עבודה', 'url' => $av['employer_report']['url'], 'text' => $av['employer_report']['he'] . '. הדף עודכן ' . justice_tools_he_date( $av['employer_report']['updated'] ) . ', נקרא ' . $checked . '.' ),
		);
	}
	if ( 'shiklul-nechut' === $name ) {
		$sk      = $reg['injury_shiklul'];
		$law     = $sk['law'];
		$r15     = $sk['r15'];
		$gen     = $sk['general'];
		$ap      = $sk['appeal'];
		$nc      = $reg['rights_nechut']['medical'];
		$ca      = $reg['car_accident'];
		$checked = justice_tools_he_date( $sk['checked_on'] );
		return array(
			array( 'name' => $sk['regs']['he'], 'url' => $sk['regs']['url'], 'text' => 'תקנה 11 (האחוז שבתוספת, השקלול של 11(ב), תקרת הפרק, הגפה והעין של 11(ג), איטר יד ימין 11(ו)); תקנה 14 פגימה דומה; תקנה 15 הגדלה עד מחצית, עד ' . (int) $r15['grant_cap'] . '% כשהדרגה פחותה מ-' . (int) $r15['under'] . '%; תקנות 16, 16א, 17, 18, 18א, 19, 19א (עיגול), 20, 21; תקנות 27-28 ערר בתוך ' . (int) $ap['days'] . ' ימים ועוד ' . (int) $ap['reasons_extra'] . ' לנימוקים; תקנות 36-37א; התוספת (חלק א\'), כולל הלוחות של פרטים 52(1) ו-72(1). נוסח עדכני (' . $sk['regs']['last_amend_he'] . '), נקרא ' . $checked . '.' ),
			array( 'name' => 'אותן תקנות: הנוסח המשולב של המוסד לביטוח לאומי', 'url' => $sk['regs']['btl_url'], 'text' => 'הנוסח המלא עם התוספת והערות התיקונים; ממנו הועתקו הפריטים והלוחות ונבדקו מול נבו. נקרא ' . $checked . '.' ),
			array( 'name' => $law['he'], 'url' => $law['url'], 'text' => $law['stable_section'] . ' דרגה יציבה ודרגה שאינה יציבה; ' . $law['pension_section'] . ' קצבה בדרגה יציבה של ' . (int) $law['pension_stable_min'] . '% ומעלה או זמנית של ' . (int) $law['pension_temp_min'] . '% ומעלה; ' . $law['grant_section'] . ' ו' . $law['grant_calc_section'] . ' מענק של ' . (int) $law['grant_months'] . ' קצבאות בדרגה של ' . (int) $law['grant_min'] . '% עד פחות מ-' . (int) $law['grant_below'] . '%; ' . $law['full_section'] . ' ו' . $law['partial_section'] . ' הקצבה; סעיפים 112, 113, 117, 119-124. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: דרגת נכות לצמיתות', 'url' => $sk['institute']['permanent_url'], 'text' => $sk['institute']['example_he'] . '; מצב קודם: 30% פחות 10% = 20%; דרגה זמנית לשנה לכל היותר. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: חוזר נפגעי עבודה בנושא תקנה 15', 'url' => $r15['circular_url'], 'text' => $r15['circular_he'] . '. בתוקף מ-' . justice_tools_he_date( $r15['circular_from'] ) . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: ערר על החלטת הוועדה הרפואית (נכות מעבודה)', 'url' => $ap['url'], 'text' => 'ערר בתוך ' . (int) $ap['days'] . ' ימים, עוד ' . (int) $ap['reasons_extra'] . ' ימים לנימוקים; ערעור לבית הדין לעבודה בשאלה משפטית בתוך ' . (int) $ap['court_days'] . ' ימים. נקרא ' . $checked . '.' ),
			array( 'name' => $gen['he'], 'url' => $gen['url'], 'text' => 'תקנה 2 ורשימת הליקויים (חלקים א\' ו-ד\' של התוספת לתקנות נפגעי עבודה, בלי הפריטים שבתוספת לתקנות 1984); ' . $gen['weighting_section'] . ' השקלול; ' . $gen['rounding_section'] . ' עיגול כלפי מעלה; תקנה 6 נכות זמנית עד שנתיים. הסף לקצבה: ' . (int) $nc['min'] . '%, או ' . (int) $nc['alt_min'] . '% עם ליקוי של ' . (int) $nc['single_min'] . '% (' . $nc['section'] . ' לחוק). נקרא ' . $checked . '.' ),
			array( 'name' => $ca['regs_he'], 'url' => $ca['regs_url'], 'text' => $sk['road']['tests_section'] . ': אחוזי הנכות לפי המבחנים שבתוספת לתקנות 1956; אחוז אחד מהסכום המקסימלי לכל אחוז נכות, פחות אחוז לכל שנה מעל גיל ' . (int) $ca['nonpecuniary']['age_from'] . ' (תקנה 3).' ),
			array( 'name' => $ca['law_he'], 'url' => $ca['law_url'], 'text' => $sk['road']['binding_section'] . ': ' . $sk['road']['binding_he'] . '.' ),
			array( 'name' => $sk['rehab']['he'], 'url' => $sk['rehab']['url'], 'text' => $sk['rehab']['section'] . ': שיקום מקצועי מדרגה של ' . (int) $sk['rehab']['min'] . '% לפחות. נקרא ' . $checked . '.' ),
		);
	}
	if ( 'shaon-nezikin' === $name ) {
		$sh      = $reg['injury_sheon'];
		$ca      = $reg['car_accident'];
		$sc      = $reg['small_claims'];
		$lim     = $ca['limitation'];
		$checked = justice_tools_he_date( $sh['checked_on'] );
		$small   = end( $sc['ceiling'] );
		$sl      = $sh['limitation'];
		$st      = $sh['torts'];
		$si      = $sh['insurance'];
		$sr      = $sh['road'];
		$sn      = $sh['nii'];
		return array(
			array( 'name' => $sl['he'], 'url' => $sl['url'], 'text' => $lim['section'] . ': ' . (int) $lim['years'] . ' שנים; ' . $sl['start_section'] . ' מיום שנולדה העילה; ' . $sl['misconduct_section'] . ' הטעיה ואיום; ' . $sl['late_section'] . ' התיישנות שלא מדעת; ' . $sl['admission_section'] . ' הודאה; ' . $lim['minor_section'] . ' קטין עד ' . (int) $lim['adult_age'] . '; ' . $sl['incapacity_section'] . ' ליקוי נפשי; ' . $lim['war']['section'] . ' חרבות ברזל: ' . justice_tools_he_date( $lim['war']['from'] ) . ' עד ' . justice_tools_he_date( $lim['war']['to'] ) . ' לא נספרים; ' . $sl['after_stay_section'] . '; ' . $sl['sexual_section'] . ' עד גיל ' . (int) $sl['sexual_age'] . '; ' . $sl['agreed_section'] . '. נוסח עדכני ל-' . justice_tools_he_date( $sl['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $st['he'], 'url' => $st['url'], 'text' => $st['start_section'] . ': ' . $st['damage_he'] . '; ' . $st['negligence_section'] . ' רשלנות; ' . $st['assault_section'] . ' תקיפה; ' . $st['dog_section'] . ' ו' . $st['dog_defences_section'] . ' נזק מכלב; ' . $st['crime_section'] . '; ' . $st['death_section'] . '. נוסח עדכני ל-' . justice_tools_he_date( $st['current_to'] ) . '.' ),
			array( 'name' => $si['he'], 'url' => $si['url'], 'text' => $si['notice_section'] . ' הודעה מיד; ' . $si['pay_section'] . ' תשלום בתוך ' . (int) $si['pay_days'] . ' ימים; ' . $si['limit_section'] . ': ' . (int) $si['limit_years'] . ' שנים, ' . (int) $si['limit_long_years'] . ' ב' . $si['limit_long_he'] . '; ' . $si['warn_section'] . ' התרעה ' . implode( ' ו-', array_map( 'intval', $si['warn_months'] ) ) . ' חודשים לפני הסוף; ' . $si['third_party_section'] . ' ו' . $si['liability_section'] . ' ביטוח אחריות. נוסח עדכני ל-' . justice_tools_he_date( $si['current_to'] ) . '.' ),
			array( 'name' => $sr['he'], 'url' => $sr['url'], 'text' => $sr['user_section'] . ', ' . $sr['passengers_section'] . ' ו' . $sr['outside_section'] . ' מי משלם; ' . $ca['sections']['interim'] . ' תשלום תכוף בתוך ' . (int) $ca['interim_days'] . ' ימים, ' . $sr['interim_court_section'] . ' ו' . $sr['interim_max_section'] . ' (עד ' . (int) $sr['interim_max_years'] . ' שנים); ' . $sr['binding_section'] . '; ' . $sr['exclusive_section'] . '; ' . $ca['sections']['karnit'] . ' קרנית. נוסח עדכני ל-' . justice_tools_he_date( $sr['current_to'] ) . '.' ),
			array( 'name' => $sr['driver_policy_he'], 'url' => $sr['driver_policy_url'], 'text' => $sr['driver_policy_section'] . ': ' . $sr['driver_policy_text_he'] . '.' ),
			array( 'name' => $sh['traffic']['he'], 'url' => $sh['traffic']['url'], 'text' => $sh['traffic']['section'] . ': ' . $sh['traffic']['police_he'] . '; ' . $sh['traffic']['details_section'] . ' מסירת פרטים; ' . $sh['traffic']['property_section'] . ' ' . (int) $sh['traffic']['property_hours'] . ' שעות.' ),
			array( 'name' => 'משטרת ישראל: ' . $sh['traffic']['report_he'], 'url' => $sh['traffic']['report_url'], 'text' => $sh['traffic']['report_when_he'] . '. עודכן ' . justice_tools_he_date( $sh['traffic']['report_updated'] ) . ', נקרא ' . $checked . '.' ),
			array( 'name' => $sn['he'], 'url' => $sn['claim_url'], 'text' => $sn['claim_section'] . ': ' . (int) $sn['claim_months'] . ' חודשים; ' . $sn['late_section'] . '; ' . $sn['work']['weeks_section'] . ' עד ' . (int) $sn['work']['weeks'] . ' שבועות דמי פגיעה; ' . $sn['work']['injury_day_section'] . ' יום הפגיעה; ' . $sn['work']['first_days_section'] . '. הנוסח המשולב באתר המוסד, נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: נפגעי עבודה', 'url' => $sn['work']['page_url'], 'text' => 'דמי פגיעה עד ' . (int) $sn['work']['days'] . ' ימים; טפסים ' . $sn['work']['form_employer'] . ', ' . $sn['work']['form_self'] . ', ' . $sn['work']['form_claim'] . '; ערר על ועדה רפואית ' . (int) $sn['work']['medical_appeal_days'] . ' ימים; ערעור לבית הדין ' . (int) $sn['work']['court_days'] . ' ימים. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: נפגעי תאונות (דמי תאונה)', 'url' => $sn['accident']['url'], 'text' => 'בדיקה בתוך ' . (int) $sn['accident']['exam_hours'] . ' שעות; תביעה בתוך ' . (int) $sn['accident']['claim_days'] . ' ימים; עד ' . (int) $sn['accident']['max_days'] . ' ימים; מגיל ' . (int) $sn['accident']['min_age'] . '. נקרא ' . $checked . '.' ),
			array( 'name' => 'המוסד לביטוח לאומי: ערעור על החלטות', 'url' => $sn['appeal']['court_url'], 'text' => 'ועדת תביעות (' . $sn['appeal']['committee_form'] . ') בתוך ' . (int) $sn['appeal']['committee_months'] . ' חודשים; בית הדין האזורי לעבודה בתוך ' . (int) $sn['appeal']['court_months'] . ' חודשים. נקרא ' . $checked . '.' ),
			array( 'name' => $sh['courts']['he'], 'url' => $sh['courts']['url'], 'text' => $sc['magistrate_section'] . ': בית משפט השלום עד ' . number_format( (float) $sc['magistrate_max'] ) . ' ש"ח ביום ההגשה; ' . $sh['courts']['raise_section'] . '; ' . $sc['district_section'] . ' מחוזי. תביעות קטנות עד ' . number_format( (float) $small['amount'] ) . ' ש"ח מ-' . justice_tools_he_date( $small['from'] ) . '. נוסח עדכני ל-' . justice_tools_he_date( $sh['courts']['current_to'] ) . '.' ),
			array( 'name' => $sh['courts']['labor_he'], 'url' => $sh['courts']['labor_url'], 'text' => $sh['courts']['labor_nii_section'] . ' תביעות נגד הביטוח הלאומי; ' . $sh['courts']['labor_tort_section'] . ' תביעת נזיקין נגד המעסיק אינה בסמכותו.' ),
			array( 'name' => $sh['patient']['he'], 'url' => $sh['patient']['url'], 'text' => $sh['patient']['section'] . ': ' . $sh['patient']['records_he'] . '.' ),
			array( 'name' => $sh['students']['he'], 'url' => $sh['students']['url'], 'text' => 'תקופת הביטוח ' . justice_tools_he_date( $sh['students']['from'] ) . ' עד ' . justice_tools_he_date( $sh['students']['to'] ) . '; ' . $sh['students']['excluded_he'] . '.' ),
			array( 'name' => $ca['fees']['rules_he'], 'url' => $ca['fees']['rules_url'], 'text' => 'תקרת שכר הטרחה בתאונת דרכים: ' . (int) $ca['fees']['stages']['none']['pct'] . '%, ' . (int) $ca['fees']['stages']['settle']['pct'] . '% או ' . (int) $ca['fees']['stages']['judgment']['pct'] . '% ועוד מע"מ ' . (int) $ca['fees']['vat_pct'] . '%.' ),
		);
	}
	return array();
}

/** The page table of each instrument, rendered by the build from the registry. */
function justice_tools_injury_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}
