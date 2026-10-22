<?php
/**
 * The rights-guide wave (21.10.2026, HAD-574): six instruments for the rights people ask about most, each on the page that
 * owns its words. The Israeli counterpart of the jus-tice.com US rights guide: the official rule, the 2026 figure with its
 * source and effective date, the hard cases, and the next action.
 *
 * Shortcodes (placing them is an editor step, after the theme release):
 *   [justice_tool name="dmei-bituach"]     National Insurance and health contributions (/national-insurance-calculator/)
 *   [justice_tool name="nekudot-zikui"]    the credit-points builder, 2020-2026 (/nekudot-zikui/)
 *   [justice_tool name="hechzer-mas"]      the salaried tax refund, 2020-2025, form 135 (/guide-tax-calculator-updated-2025/)
 *   [justice_tool name="dmei-avtala"]      unemployment benefit, from the gate to the last payment (/unemployment-benefits-eligibility/)
 *   [justice_tool name="dmei-leida"]       maternity allowance and the birth grant (/maternity-allowance/)
 *   [justice_tool name="kitzbat-nechut"]   the general disability pension with work income (/general-disability-pension-2026/)
 * Every number is read from assets/data/justice-tools-registry.json (rights_btl and rights_<lane>, built by
 * tools/justice_tools_rights.py and tools/justice_tools_rights_<lane>.py) or from the snapshot the build renders.
 * None of the homes carries a reviewed-by line (checked on the live pages, 21.10.2026).
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_rights_names(): array {
	// Wave 2A (HAD-578): the work grant and the net salary, in inc/justice-tools-rights-2a.php. Wave 2B (HAD-585): old age,
	// reserve duty, children and income support, in inc/justice-tools-rights-2b.php.
	return array_merge( array( 'dmei-bituach', 'nekudot-zikui', 'hechzer-mas', 'dmei-avtala', 'dmei-leida', 'kitzbat-nechut' ), justice_tools_rights2a_names(), justice_tools_rights2b_names() );
}

/** The catalog entries, merged into justice_tools_catalog(). */
function justice_tools_rights_catalog(): array {
	return array_merge( array(
		// The rights wave (21.10.2026): National Insurance and health contributions, every status and age, the employer's share,
		// several employers and the refund, the self-employed base and advance (/national-insurance-calculator/).
		'dmei-bituach'    => array(
			'name'      => 'מחשבון דמי ביטוח לאומי ובריאות',
			'title'     => 'דמי ביטוח לאומי ובריאות 2026: כמה מנכים, כמה המעסיק משלם, וכמה משלם עצמאי',
			'promise'   => 'שכיר, עצמאי, שניהם, פנסיה מוקדמת או בלי עבודה: שתי המדרגות והתקרה של 2026, שורות הניכוי בתלוש, חלק המעסיק ועלות השכר, ההפרש כשיש כמה מעסיקים ואיך מבקשים אותו בחזרה, והמקדמה של העצמאי עם מועדי התשלום.',
			'question'  => 'כמה דמי ביטוח לאומי ובריאות מנכים ממני בחודש, וכמה משלם המעסיק?',
			'page'      => '/national-insurance-calculator/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_bituach' ),
			'dataset'   => 'rights_bituach',
			'next_text' => 'הצעד הבא: להשוות לשורות "ביטוח לאומי" ו"ביטוח בריאות" בתלוש, ולתרגל את השיחה עם המעסיק לפני שמבקשים לתקן',
			'primary'   => array( 'label' => 'לתרגל את השיחה עם המעסיק על התלוש', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם המעסיק על התלוש', 'topic' => 'employment', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'עצמאי ופרילנסר: המדריך', 'path' => '/self-employed-and-freelancer/' ),
				array( 'label' => 'מחשבון פיצויי פיטורים', 'path' => '/severance-pay-calculator/' ),
				array( 'label' => 'שיעורי דמי ביטוח באתר הביטוח הלאומי', 'url' => 'https://www.btl.gov.il/Insurance/Rates/Pages/default.aspx' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין לביטוח לאומי', 'path' => '/national-insurance-attorney/' ),
			'sticky'    => 'בחודש',
		),
		// The rights wave (21.10.2026), tax lane: the credit-points builder. Every point of every year 2020-2026 with its
		// section, its value, what to write on Form 101, and the years a refund can still be asked for (/nekudot-zikui/).
		// Bundle: instrument.js + dates.js + mas-engine.js + zikui-ui.js. The snapshot carries 'sticky' (the points, not money).
		'nekudot-zikui'   => array(
			'name'      => 'בונה נקודות זיכוי',
			'title'     => 'נקודות זיכוי: כמה מגיעות לכם, כמה הן שוות, ומה לכתוב בטופס 101',
			'promise'   => 'לפי מגדר, ילדים, תואר, שירות, מילואים ועלייה; לכל שנה מ-2020 עד 2026, כל נקודה עם הסעיף שלה, ואיפה נשארו נקודות שאפשר לבקש עליהן החזר.',
			'question'  => 'כמה נקודות זיכוי מגיעות לי, וכמה הן שוות בחודש?',
			'page'      => '/nekudot-zikui/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_tax' ),
			'dataset'   => 'rights_tax',
			'next_text' => 'הצעד הבא: לבדוק בטופס 106 כמה נקודות המעסיק נתן בכל שנה, ועל מה שחסר לבקש החזר',
			// The JS rewrites every link to the refund page so it carries the reader's profile in the hash.
			'primary'   => array( 'label' => 'לחשב את ההחזר על השנים שעברו', 'path' => '/guide-tax-calculator-updated-2025/' ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם פקיד השומה', 'topic' => 'tax', 'purpose' => 'court_rehearsal' ),
			'more'      => array(
				array( 'label' => 'רשות המסים: מה עושים מולה', 'path' => '/israel-tax-authority/' ),
				array( 'label' => 'הסימולטור של רשות המסים', 'url' => 'https://secapp.taxes.gov.il/srsimulatorNZ/#/simulator' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין מסים', 'path' => '/tax-lawyer/' ),
			'sticky'    => 'נקודות',
		),
		// The rights wave (21.10.2026), tax lane: the salaried refund calculator. Form 106 of each year 2020-2025, each with
		// its own brackets and points, the donations credit, two employers, Form 135 and the deadlines
		// (/guide-tax-calculator-updated-2025/, replacing the dead 'tax-calculator' and 'tax-refund-calc' blocks).
		// Bundle: instrument.js + dates.js + mas-engine.js + hechzer-ui.js.
		'hechzer-mas'     => array(
			'name'      => 'מחשבון החזר מס לשכירים',
			'title'     => 'החזר מס לשכירים: כמה מגיע לכם על 2020 עד 2025',
			'promise'   => 'מטופס 106 של כל שנה: המס לפי המדרגות והנקודות של אותה שנה, תרומות, שני מעסיקים וחלק משנה, כמה מגיע בחזרה, ואיך מגישים טופס 135 עד המועד.',
			'question'  => 'האם מגיע לי החזר מס, וכמה?',
			'page'      => '/guide-tax-calculator-updated-2025/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_tax' ),
			'dataset'   => 'rights_tax',
			'next_text' => 'הצעד הבא: להגיש טופס 135 באזור האישי ברשות המסים, עם טופסי 106 והקבלות, לפני המועד של כל שנה',
			'primary'   => array( 'label' => 'המועדים ליומן', 'act' => 'ics' ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם פקיד השומה', 'topic' => 'tax', 'purpose' => 'court_rehearsal' ),
			'more'      => array(
				array( 'label' => 'בונה נקודות הזיכוי', 'path' => '/nekudot-zikui/' ),
				array( 'label' => 'רשות המסים: מה עושים מולה', 'path' => '/israel-tax-authority/' ),
				array( 'label' => 'הגשת טופס 135 באתר רשות המסים', 'url' => 'https://secapp.taxes.gov.il/srbksOpentik/#/mainPage' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין מסים', 'path' => '/tax-lawyer/' ),
			'sticky'    => 'החזר',
		),
		// The rights wave (21.10.2026): unemployment benefit, from the eligibility gate to the last payment (/unemployment-benefits-eligibility/).
		'dmei-avtala'     => array(
			'name'      => 'מחשבון דמי אבטלה 2026',
			'title'     => 'מחשבון דמי אבטלה: זכאות, סכום ליום ולחודש, כמה ימים ומתי התשלום האחרון',
			'promise'   => 'תנאי הזכאות, השכר היומי לפי 6 החודשים והמדרגות שבחוק, התקרה ב-125 הימים הראשונים ואחריהם, הימים לפי גיל ותלויים, ימי ההמתנה, ויומן תשלומים מיום הרישום ועד התשלום האחרון.',
			'question'  => 'כמה דמי אבטלה אקבל, לכמה ימים, ומתי יגיע התשלום האחרון?',
			'page'      => '/unemployment-benefits-eligibility/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_avtala', 'min_wage' ),
			'dataset'   => 'rights_avtala',
			'next_text' => 'הצעד הבא: להירשם בשירות התעסוקה היום, ולהכניס ליומן את ההתייצבות בלשכה, את הגשת התביעה ואת מועדי התשלום',
			'primary'   => array( 'label' => 'הוספת המועדים ליומן', 'act' => 'ics' ),
			// Conversion to a hearing is low: the rehearsal is the talk with the employer about the termination letter and form 100.
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם המעסיק על מכתב הסיום וטופס 100', 'topic' => 'employment', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'ענף האבטלה בביטוח הלאומי', 'path' => '/avtala-bituach-leumi/' ),
				array( 'label' => 'התפטרות בדין מפוטר: העילות', 'path' => '/resignation-deemed-dismissal/' ),
				array( 'label' => 'מחשבון דמי האבטלה של הביטוח הלאומי', 'url' => 'https://www.btl.gov.il/Simulators/Pages/AvtalaCalcNew.aspx' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/labor-lawyer/' ),
			'sticky'    => 'ליום',
		),
		// The rights wave (21.10.2026): maternity allowance and the birth grant, from the qualifying months to the end of the dismissal protection (/maternity-allowance/, a new page).
		'dmei-leida'      => array(
			'name'      => 'מחשבון דמי לידה ומענק לידה 2026',
			'title'     => 'מחשבון דמי לידה ומענק לידה: כמה ליום ובסך הכול, כמה שבועות, ומתי חוזרים לעבודה',
			'promise'   => 'תנאי הזכאות ל-105 או ל-56 ימים, השכר לפי 3 או 6 החודשים עד המקסימום, תאומים ואשפוז, בן הזוג בחופשה, מענק הלידה לפי הילד במשפחה, ויומן החופשה מהיום שמפסיקים לעבוד ועד סוף ההגנה מפיטורים.',
			'question'  => 'כמה דמי לידה אקבל, לכמה שבועות, וכמה מענק לידה?',
			'page'      => '/maternity-allowance/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_leida' ),
			'dataset'   => 'rights_leida',
			'next_text' => 'הצעד הבא: לבקש מהמעסיק לשדר טופס 100, ולהכניס ליומן את סוף התשלום, את יום החזרה ואת סוף 60 ימי ההגנה',
			'primary'   => array( 'label' => 'הוספת המועדים ליומן', 'act' => 'ics' ),
			// Conversion to a hearing is low: the rehearsal is the talk with the employer about the leave and the return.
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם המעסיק על החופשה והחזרה', 'topic' => 'employment', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'זכויות עובדת בהיריון', 'path' => '/employment-rights-pregnancy/' ),
				array( 'label' => 'היתר לפיטורי עובדת בהיריון', 'path' => '/pregnancy-dismissal-permit/' ),
				array( 'label' => 'דמי לידה באתר הביטוח הלאומי', 'url' => 'https://www.btl.gov.il/benefits/maternity/Childbirth_Allowance/Pages/default.aspx' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/labor-lawyer/' ),
			'sticky'    => 'דמי לידה',
		),
		// The rights wave (21.10.2026): the general disability pension with work income, from the gate to the appeal (/general-disability-pension-2026/).
		'kitzbat-nechut'  => array(
			'name'      => 'מחשבון קצבת נכות כללית 2026',
			'title'     => 'קצבת נכות כללית: זכאות, סכום לפי דרגה, עבודה וקצבה, והמועדים',
			'promise'   => 'תנאי הזכאות (נכות רפואית ודרגת אי-כושר), הקצבה לפי הדרגה עם התוספות לבן הזוג ולילדים, כמה נשאר מכל שקל כשעובדים, וכל המועדים מהיום שבו הפסקתם לעבוד ועד הערר.',
			'question'  => 'כמה קצבת נכות אקבל, וכמה אפשר לעבוד ולהמשיך לקבל אותה?',
			'page'      => '/general-disability-pension-2026/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_nechut' ),
			'dataset'   => 'rights_nechut',
			'next_text' => 'הצעד הבא: להגיש את התביעה עם המסמכים הרפואיים, להכניס ליומן את מועד הערר, ולהתכונן לוועדה הרפואית',
			// The rehearsal is the medical committee: what to say about the complaints, the daily functioning and the work.
			'primary'   => array( 'label' => 'לתרגל את הוועדה הרפואית', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הוועדה הרפואית', 'topic' => 'general', 'purpose' => 'witness_prep' ),
			'more'      => array(
				array( 'label' => 'איך תובעים נכות כללית', 'path' => '/claiming-disability-social-security/' ),
				array( 'label' => 'ערר וערעור על החלטות הביטוח הלאומי', 'path' => '/bituach-leumi-appeal-guide/' ),
				array( 'label' => 'נכות כללית באתר הביטוח הלאומי', 'url' => 'https://www.btl.gov.il/benefits/Disability/Pages/default.aspx' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין לביטוח לאומי', 'path' => '/national-insurance-attorney/' ),
			'sticky'    => 'לחודש',
		),
	), justice_tools_rights2a_catalog(), justice_tools_rights2b_catalog() );
}

/** The answer box (40-70 words): the direct answer, its numbers, their sections and the check date. */
function justice_tools_rights_answer( string $name, string $mode = '' ): string {
	if ( in_array( $name, justice_tools_rights2a_names(), true ) ) {
		return justice_tools_rights2a_answer( $name, $mode );
	}
	if ( in_array( $name, justice_tools_rights2b_names(), true ) ) {
		return justice_tools_rights2b_answer( $name, $mode );
	}
	$reg = justice_tools_registry();
	// dmei-bituach (jt28): the answer box. One paragraph, every figure from rights_bituach; the employee and self-employed
	// totals are the sums of the published National Insurance and health rates (1.04 + 3.23, 7 + 5.17; 4.47 + 3.23, 12.83 + 5.17).
	if ( 'dmei-bituach' === $name && ! empty( $reg['rights_bituach'] ) ) {
		$bt   = $reg['rights_bituach'];
		$ew   = $bt['employee']['work'];
		$sw   = $bt['self']['work'];
		$text = '<strong>דמי ביטוח לאומי ובריאות</strong> לשכיר ב-' . (int) $bt['year'] . ': <bdi>' . round( $ew['bl'][0] + $ew['health'][0], 2 ) . '%</bdi> מהשכר עד המדרגה המופחתת, ' . justice_tools_money( $bt['tier']['amount'], 0 ) . ', ו-<bdi>' . round( $ew['bl'][1] + $ew['health'][1], 2 ) . '%</bdi> מהחלק שמעליה ועד ההכנסה המרבית, ' . justice_tools_money( $bt['max']['amount'], 0 ) . '. '
			. 'המעסיק מוסיף <bdi>' . $ew['employer'][0] . '%</bdi> ו-<bdi>' . $ew['employer'][1] . '%</bdi>. '
			. 'עצמאי משלם <bdi>' . round( $sw['bl'][0] + $sw['health'][0], 2 ) . '%</bdi> ו-<bdi>' . round( $sw['bl'][1] + $sw['health'][1], 2 ) . '%</bdi> על ההכנסה אחרי ניכוי <bdi>' . (int) $bt['self']['deduct_pct'] . '%</bdi> מדמי הביטוח הלאומי, ולא פחות מהכנסה של ' . justice_tools_money( $bt['min_self']['amount'], 0 ) . '. '
			. 'מי שלא עובד ואין לו הכנסות משלם ' . justice_tools_money( $bt['none']['total'], 0 ) . ' בחודש. נבדק ' . esc_html( justice_tools_he_date( $bt['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// nekudot-zikui (jt29): the answer box. One paragraph, every figure from rights_tax: the point of the current year
	// (s.33א), resident and travel (ss.34, 36), woman (s.36א), the children table of the current period (age 1-2 and
	// 6-17 in both columns), the degree rule from 2023 (s.40ג) and the six years of s.160.
	if ( 'nekudot-zikui' === $name && ! empty( $reg['rights_tax'] ) ) {
		$rt     = $reg['rights_tax'];
		$cy     = (int) $rt['current_year'];
		$yr     = $rt['years'][ (string) $cy ];
		$pt     = $rt['points'];
		$period = array();
		foreach ( $pt['kids'] as $k ) {
			if ( (int) $k['from'] <= $cy && $cy <= (int) $k['to'] ) {
				$period = $k;
			}
		}
		$band = static function ( array $bands, int $age ): string {
			foreach ( $bands as $b ) {
				if ( $b[0] <= $age && $age <= $b[1] ) {
					return (string) $b[2];
				}
			}
			return '0';
		};
		$ba   = $pt['degree']['rule']['ba'];
		$text = '<strong>נקודת זיכוי</strong> מורידה מהמס ' . justice_tools_money( $yr['point_month'], 0 ) . ' בחודש ב-<bdi>' . $cy . '</bdi>, ' . justice_tools_money( $yr['point_year'], 0 ) . ' בשנה (' . esc_html( $rt['point_section'] ) . '). '
			. 'תושב/ת ישראל מקבל/ת <bdi>' . esc_html( (string) ( $pt['resident']['pts'] + $pt['travel']['pts'] ) ) . '</bdi> נקודות ואישה עוד <bdi>' . esc_html( (string) $pt['woman']['pts'] ) . '</bdi>; '
			. 'לכל הורה לילד בגיל שנה או שנתיים <bdi>' . esc_html( $band( $period['col1'], 1 ) ) . '</bdi> נקודות, ובגיל 6 עד 17 לאם <bdi>' . esc_html( $band( $period['col1'], 6 ) ) . '</bdi> ולאב <bdi>' . esc_html( $band( $period['col2'], 6 ) ) . '</bdi>; '
			. 'תואר ראשון: נקודה לכל שנת לימודים, עד <bdi>' . (int) $ba[1] . '</bdi> שנים (' . esc_html( $pt['degree']['sections']['ba'] ) . '). '
			. 'נקודות שלא נוצלו מבקשים בחזרה עד <bdi>' . (int) $rt['refund']['years_back'] . '</bdi> שנים אחורה (' . esc_html( $rt['refund']['section'] ) . '). נבדק ' . esc_html( justice_tools_he_date( $rt['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// hechzer-mas (jt30): the answer box. One paragraph, every figure from rights_tax: the six open years and the first
	// deadline (s.160(א)), the Form 106 field of the tax withheld, the point of the last closed year (s.33א), the
	// donation rate (s.46) and the interest rate of s.159א.
	if ( 'hechzer-mas' === $name && ! empty( $reg['rights_tax'] ) ) {
		$rt    = $reg['rights_tax'];
		$cy    = (int) $rt['current_year'];
		$back  = (int) $rt['refund']['years_back'];
		$first = $cy - $back;
		$last  = $cy - 1;
		$yr    = $rt['years'][ (string) $last ];
		$text  = '<strong>החזר מס לשכירים</strong> מבקשים בטופס 135 עד <bdi>' . $back . '</bdi> שנים אחרי שנת המס: ב-<bdi>' . $cy . '</bdi> על <bdi>' . $first . '</bdi> עד <bdi>' . $last . '</bdi>, ועל <bdi>' . $first . '</bdi> עד <bdi>31.12.' . $cy . '</bdi> (' . esc_html( $rt['refund']['section'] ) . '). '
			. 'ההחזר הוא המס שנוכה (טופס 106, שדה <bdi>' . esc_html( $rt['form106']['fields']['tax']['field'] ) . '</bdi>) פחות המס לפי המדרגות והנקודות של אותה שנה; ב-<bdi>' . $last . '</bdi> נקודה שווה ' . justice_tools_money( $yr['point_year'], 0 ) . ' בשנה. '
			. 'מחזירים בעיקר על חלק משנה בעבודה, שני מעסיקים בלי תיאום, נקודות שלא נוצלו ותרומות (<bdi>' . (int) $rt['donation']['pct'] . '%</bdi>), עם הפרשי הצמדה ו-<bdi>' . (int) $rt['refund']['interest']['pct'] . '%</bdi> ריבית לשנה. נבדק ' . esc_html( justice_tools_he_date( $rt['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// dmei-avtala (jt31): the answer box. One paragraph, every figure and section from rights_avtala (the Institute's 2026
	// figures and chapter 7 of the National Insurance Law), ending with the check date.
	if ( 'dmei-avtala' === $name && ! empty( $reg['rights_avtala'] ) ) {
		$av    = $reg['rights_avtala'];
		$bands = $av['days']['bands'];
		$text  = '<strong>דמי אבטלה</strong> משלם הביטוח הלאומי לשכיר בגיל <bdi>' . (int) $av['age']['min'] . '</bdi> עד <bdi>' . (int) $av['age']['max'] . '</bdi> שעבד <bdi>' . (int) $av['qualify']['months'] . '</bdi> מתוך <bdi>' . (int) $av['qualify']['window_months'] . '</bdi> החודשים שלפני הרישום בשירות התעסוקה (' . esc_html( $av['age']['section'] ) . ' ו' . esc_html( $av['qualify']['section'] ) . ' לחוק): '
			. 'עד ' . justice_tools_money( $av['cap']['first'] ) . ' ליום ב-<bdi>' . (int) $av['cap']['first_days'] . '</bdi> ימי התשלום הראשונים ו-' . justice_tools_money( $av['cap']['after'] ) . ' אחריהם (' . esc_html( $av['cap']['section'] ) . '), לפי השכר ב-<bdi>' . (int) $av['base']['months'] . '</bdi> החודשים חלקי <bdi>' . (int) $av['base']['divisor'] . '</bdi>. '
			. 'מקבלים <bdi>' . (int) $bands[0]['few'] . '</bdi> עד <bdi>' . (int) $bands[ count( $bands ) - 1 ]['many'] . '</bdi> ימים לפי גיל ותלויים (לנשים שנולדו מ-<bdi>' . esc_html( justice_tools_he_date( $av['women']['born_from'] ) ) . '</bdi>, מגיל <bdi>' . (int) $av['women']['from_age'] . '</bdi>: <bdi>' . (int) $av['women']['days'] . '</bdi>), '
			. 'ומי שהתפטר בלי הצדקה ממתין <bdi>' . (int) $av['resign']['wait_days'] . '</bdi> ימים (' . esc_html( $av['resign']['section'] ) . '). נבדק ' . esc_html( justice_tools_he_date( $av['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// dmei-leida (jt32): the answer box. One paragraph, every figure and section from rights_leida (the Institute's 2026
	// figures, chapter 3 of the National Insurance Law), ending with the check date.
	if ( 'dmei-leida' === $name && ! empty( $reg['rights_leida'] ) ) {
		$lq   = $reg['rights_leida'];
		$q    = $lq['qualify'];
		$text = '<strong>דמי לידה</strong> משלם הביטוח הלאומי ליולדת שהפסיקה לעבוד לרגל הלידה, לפי השכר שלה ועד ' . justice_tools_money( $lq['max']['daily'] ) . ' ליום ב-<bdi>' . esc_html( substr( $lq['from'], 0, 4 ) ) . '</bdi> (' . esc_html( $lq['max']['section'] ) . ' לחוק): '
			. '<bdi>' . (int) $q['full_days'] . '</bdi> ימים למי ששולמו בעדה דמי ביטוח <bdi>' . (int) $q['full_months'] . '</bdi> מתוך <bdi>' . (int) $q['full_window'] . '</bdi> החודשים שלפני הפסקת העבודה (או <bdi>' . (int) $q['full_alt_months'] . '</bdi> מתוך <bdi>' . (int) $q['full_alt_window'] . '</bdi>), ו-<bdi>' . (int) $q['partial_days'] . '</bdi> ימים ל-<bdi>' . (int) $q['partial_months'] . '</bdi> מתוך <bdi>' . (int) $q['partial_window'] . '</bdi> (' . esc_html( $q['full_section'] ) . ' ו-' . esc_html( str_replace( 'סעיף ', '', $q['partial_section'] ) ) . '). '
			. 'השכר: <bdi>' . (int) $lq['base']['months_short'] . '</bdi> החודשים חלקי <bdi>' . (int) $lq['base']['divisor_short'] . '</bdi>, או <bdi>' . (int) $lq['base']['months_long'] . '</bdi> חלקי <bdi>' . (int) $lq['base']['divisor_long'] . '</bdi>, הגבוה. '
			. 'מענק הלידה: ' . justice_tools_money( $lq['grant']['first'], 0 ) . ' לילד הראשון, ' . justice_tools_money( $lq['grant']['second'], 0 ) . ' לשני. נבדק ' . esc_html( justice_tools_he_date( $lq['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// kitzbat-nechut (jt33): the answer box. One paragraph, every figure and section from rights_nechut (the Institute's 2026
	// table and chapter 9 of the National Insurance Law), ending with the check date.
	if ( 'kitzbat-nechut' === $name && ! empty( $reg['rights_nechut'] ) ) {
		$nc   = $reg['rights_nechut'];
		$amt  = $nc['pension']['amounts'];
		$md   = $nc['medical'];
		$sums = array();
		$degs = array();
		foreach ( array_reverse( $nc['degree']['levels'] ) as $d ) {
			if ( 100 !== (int) $d ) {
				$sums[] = $amt[ (string) $d ]['pension'];
				$degs[] = '<bdi>' . (int) $d . '%</bdi>';
			}
		}
		$last_sum = justice_tools_money( array_pop( $sums ), 0 );
		$sums     = array_map( function ( $n ) { return '<bdi>' . number_format( (float) $n ) . '</bdi>'; }, $sums );
		$last_deg = array_pop( $degs );
		$text     = '<strong>קצבת נכות כללית</strong> היא קצבה חודשית מהביטוח הלאומי: ב-<bdi>' . esc_html( substr( $nc['from'], 0, 4 ) ) . '</bdi> ' . justice_tools_money( $amt['100']['pension'], 0 ) . ' בדרגה מלאה, ו-' . implode( ', ', $sums ) . ' או ' . $last_sum . ' בדרגות ' . implode( ', ', $degs ) . ' ו-' . $last_deg . ' (' . esc_html( $nc['pension']['section'] ) . ' ו' . esc_html( $nc['pension']['partial_section'] ) . '). '
			. 'משולמת מגיל <bdi>' . (int) $nc['age']['min'] . '</bdi> עד גיל הפרישה למי שאיבד <bdi>' . (int) $nc['degree']['min_loss'] . '%</bdi> מכושרו להשתכר, בנכות רפואית של <bdi>' . (int) $md['min'] . '%</bdi>, או <bdi>' . (int) $md['alt_min'] . '%</bdi> עם ליקוי של <bdi>' . (int) $md['single_min'] . '%</bdi> (' . esc_html( $md['section'] ) . '). '
			. 'לבן זוג ' . justice_tools_money( $amt['100']['spouse'], 0 ) . ' ולכל אחד משני ילדים ' . justice_tools_money( $amt['100']['child'], 0 ) . '; מי שעובד ממשיך לקבל לפי ' . esc_html( $nc['work']['tiers_section'] ) . '. נבדק ' . esc_html( justice_tools_he_date( $nc['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '';
}

/** The data stamp in the tool's header. */
function justice_tools_rights_stamp( string $name, string $mode = '' ): string {
	if ( in_array( $name, justice_tools_rights2a_names(), true ) ) {
		return justice_tools_rights2a_stamp( $name, $mode );
	}
	if ( in_array( $name, justice_tools_rights2b_names(), true ) ) {
		return justice_tools_rights2b_stamp( $name, $mode );
	}
	$reg = justice_tools_registry();
	if ( 'dmei-bituach' === $name ) {
		$bt = $reg['rights_bituach'] ?? array();
		return 'מדרגה ' . number_format( (float) ( $bt['tier']['amount'] ?? 0 ) ) . ' ₪ · תקרה ' . number_format( (float) ( $bt['max']['amount'] ?? 0 ) ) . ' ₪ מ-' . justice_tools_he_date( $bt['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $bt['checked_on'] ?? '' );
	}
	if ( 'nekudot-zikui' === $name ) {
		$rt = $reg['rights_tax'] ?? array();
		$cy = (string) ( $rt['current_year'] ?? '' );
		return 'נקודת זיכוי ' . number_format( (float) ( $rt['years'][ $cy ]['point_month'] ?? 0 ) ) . ' ₪ לחודש ב-' . $cy . ' · נבדק ' . justice_tools_he_date( $rt['checked_on'] ?? '' );
	}
	// Renders: נקודת זיכוי 242 ₪ לחודש ב-2026 · נבדק 21.10.2026
	if ( 'hechzer-mas' === $name ) {
		$rt   = $reg['rights_tax'] ?? array();
		$cy   = (int) ( $rt['current_year'] ?? 0 );
		$back = (int) ( $rt['refund']['years_back'] ?? 0 );
		return 'החזר על ' . ( $cy - $back ) . ' עד ' . ( $cy - 1 ) . ' · ' . ( $cy - $back ) . ' עד 31.12.' . $cy . ' · נבדק ' . justice_tools_he_date( $rt['checked_on'] ?? '' );
	}
	// Renders: החזר על 2020 עד 2025 · 2020 עד 31.12.2026 · נבדק 21.10.2026
	if ( 'dmei-avtala' === $name ) {
		$av = $reg['rights_avtala'] ?? array();
		return 'תקרה ' . number_format( (float) ( $av['cap']['first'] ?? 0 ), 2 ) . ' ₪ ליום מ-' . justice_tools_he_date( $av['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $av['checked_on'] ?? '' );
	}
	if ( 'dmei-leida' === $name ) {
		$lq = $reg['rights_leida'] ?? array();
		return 'מקסימום ' . number_format( (float) ( $lq['max']['daily'] ?? 0 ), 2 ) . ' ₪ ליום מ-' . justice_tools_he_date( $lq['max']['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $lq['checked_on'] ?? '' );
	}
	if ( 'kitzbat-nechut' === $name ) {
		$nc = $reg['rights_nechut'] ?? array();
		return 'קצבה מלאה ' . number_format( (float) ( $nc['pension']['amounts']['100']['pension'] ?? 0 ) ) . ' ₪ מ-' . justice_tools_he_date( $nc['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $nc['checked_on'] ?? '' );
	}
	return 'נבדק ' . justice_tools_he_date( justice_tools_checked_on( $name ) );
}

/** Official sources used by each instrument's result. */
function justice_tools_rights_sources( string $name ): array {
	if ( in_array( $name, justice_tools_rights2a_names(), true ) ) {
		return justice_tools_rights2a_sources( $name );
	}
	if ( in_array( $name, justice_tools_rights2b_names(), true ) ) {
		return justice_tools_rights2b_sources( $name );
	}
	$reg = justice_tools_registry();
	if ( 'dmei-bituach' === $name ) {
		$bt      = $reg['rights_bituach'];
		$btl     = $reg['rights_btl'];
		$co      = $bt['coordination'];
		$ew      = $bt['employee']['work'];
		$sw      = $bt['self'];
		$checked = justice_tools_he_date( $bt['checked_on'] );
		$from    = justice_tools_he_date( $bt['from'] );
		$wlast   = $bt['retirement']['women'][ count( $bt['retirement']['women'] ) - 1 ];
		return array(
			array( 'name' => $bt['law_he'] . ', פרק ט"ו: דמי ביטוח', 'url' => $bt['law_url'], 'text' => $bt['tier']['section'] . ': ' . $bt['tier']['he'] . ' (' . $bt['tier']['amendment_he'] . '); ב-' . (int) $bt['year'] . ': ' . number_format( (float) $bt['tier']['amount'] ) . ' ₪. סעיף 342(ב), (ד) ו-(ה): כמה מעסיקים, וההפרש מול "מעסיק אחד" מוחזר או נגבה; 342(ו): שכיר שהוא גם עצמאי; 345(ב)(1)(א): ההכנסה של עצמאי אחרי ניכוי דמי הביטוח לפי סעיף 47א לפקודה; 345ב: פנסיה מוקדמת; 348: ההכנסה המרבית, ההכנסה המזערית וההכנסה שלא נספרת. נבדק ' . $checked . '.' ),
			array( 'name' => $bt['law_he'] . ', הלוחות', 'url' => $bt['law_tables_url'], 'text' => 'לוח י"א: ההכנסה המרבית לעובד ולעובד עצמאי היא הסכום הבסיסי כפול ' . (int) $bt['max']['times'] . ' (' . number_format( (float) $bt['max']['basic_amount'] ) . ' × ' . (int) $bt['max']['times'] . ' = ' . number_format( (float) $bt['max']['amount'] ) . ' ₪); ההכנסה המזערית לעצמאי ' . (int) $bt['min_self']['pct'] . '% מהשכר הממוצע (' . number_format( (float) $bt['min_self']['amount'] ) . ' ₪); ' . $bt['min_self']['lower_he'] . '.' ),
			array( 'name' => $bt['law_he'] . ', פרק א׳', 'url' => $bt['law_ch1_url'], 'text' => $bt['min_self']['definition_section'] . ': ' . $bt['min_self']['definition_he'] . '. השכר הממוצע לפי סעיף 2 מ-' . $from . ': ' . number_format( (float) $btl['avg_wage']['s2_contributions'] ) . ' ₪; הסכום הבסיסי 3: ' . number_format( (float) $btl['basic_amount']['b3'] ) . ' ₪.' ),
			array( 'name' => 'הביטוח הלאומי: שיעורי דמי ביטוח לעובדים שכירים', 'url' => $bt['employee']['url'], 'text' => $bt['employee']['rates_from_he'] . '. העובד: ' . $ew['bl'][0] . '% ו-' . $ew['bl'][1] . '% ביטוח לאומי, ' . $ew['health'][0] . '% ו-' . $ew['health'][1] . '% בריאות; המעסיק ' . $ew['employer'][0] . '% ו-' . $ew['employer'][1] . '%; ושורות לפי גיל: מתחת ל-18, מגיל הפרישה ועד 70 בלי קצבה, מקבלי קצבת אזרח ותיק, מקבלי קצבת נכות עם אישור שנתי.' ),
			array( 'name' => 'הביטוח הלאומי: שיעורי דמי ביטוח לעצמאים, ודוגמת החישוב', 'url' => $sw['url'], 'text' => 'מ-' . $from . ': ' . $sw['work']['bl'][0] . '% ו-' . $sw['work']['bl'][1] . '% ביטוח לאומי, ' . $sw['work']['health'][0] . '% ו-' . $sw['work']['health'][1] . '% בריאות; מגיל הפרישה בלי קצבה ' . $sw['ret']['total'][0] . '% ו-' . $sw['ret']['total'][1] . '% יחד; מתחת ל-18 או עם קצבת אזרח ותיק ' . $sw['u18']['bl'][0] . '% ו-' . $sw['u18']['bl'][1] . '%. הנוסחה לבסיס אחרי ניכוי ' . (int) $sw['deduct_pct'] . '% ודוגמה של ' . number_format( (float) $sw['example']['monthly_income'] ) . ' ₪ בחודש: בדף "דוגמה לחישוב דמי ביטוח לעובד עצמאי".' ),
			array( 'name' => 'פקודת מס הכנסה [נוסח חדש]', 'url' => $sw['deduct_url'], 'text' => $sw['deduct_section'] . ': יחיד ששילם דמי ביטוח לאומי בשל הכנסה שאינה הכנסת עבודה רשאי לנכות ' . (int) $sw['deduct_pct'] . '% מהסכום ששילם (דמי ביטוח בריאות אינם בכלל).' ),
			array( 'name' => 'הביטוח הלאומי: פנסיה מוקדמת, מי שלא עובד, סטודנטים', 'url' => $bt['pension']['url'], 'text' => 'פנסיה מוקדמת: ' . $bt['pension']['bl'][0] . '% ו-' . $bt['pension']['bl'][1] . '% ביטוח לאומי, ' . $bt['pension']['health'][0] . '% ו-' . $bt['pension']['health'][1] . '% בריאות; מי שלא עובד ואין לו הכנסות: ' . (int) $bt['none']['bl'] . ' + ' . (int) $bt['none']['health'] . ' = ' . (int) $bt['none']['total'] . ' ₪ בחודש; סטודנט: ' . (int) $bt['student']['total'] . ' ₪; הכנסה שלא מעבודה: ' . $bt['none']['passive']['bl'][0] . '% ו-' . $bt['none']['passive']['bl'][1] . '% ועוד ' . $bt['none']['passive']['health'][0] . '% בריאות, אחרי ' . number_format( (float) $bt['passive_exempt']['amount'] ) . ' ₪ שלא נספרים. מ-' . $from . '.' ),
			array( 'name' => 'הביטוח הלאומי: שיעורי דמי ביטוח בריאות', 'url' => $bt['employee']['health_url'], 'text' => 'שכיר ועצמאי: ' . $ew['health'][0] . '% עד המדרגה ו-' . $ew['health'][1] . '% מעליה; מקבלי קצבת אזרח ותיק: ' . (int) $bt['oap_health']['single'] . ' ₪ ליחיד, ' . (int) $bt['oap_health']['with_supplement'] . ' ₪ עם השלמת הכנסה, ' . (int) $bt['oap_health']['couple'] . ' ₪ לזוג, מנוכים מהקצבה.' ),
			array( 'name' => 'הביטוח הלאומי: תיאום דמי ביטוח והחזר על שנים קודמות', 'url' => $co['refund_url'], 'text' => 'מתי צריך תיאום, מי המעסיק העיקרי, וההחזר עד ' . (int) $co['refund_years'] . ' שנים אחורה: באופן מקוון, או טופס ' . $co['form_low']['number'] . ' (' . $co['form_low']['when_he'] . ') וטופס ' . $co['form_max']['number'] . ' (' . $co['form_max']['when_he'] . ').' ),
			array( 'name' => 'הביטוח הלאומי: לוח מועדי הדיווח והתשלום, ותיקון מקדמות', 'url' => $bt['dues']['url'], 'text' => $bt['dues']['he'] . ', לכל חודש ב-' . (int) $bt['year'] . '; בהוראת קבע החיוב ב-' . (int) $bt['dues']['standing_order_day'] . ' בחודש. ' . $bt['advance_fix']['he'] . ' (טופס ' . $bt['advance_fix']['form'] . '): ' . $bt['advance_fix']['rule_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: גיל הפרישה', 'url' => $bt['retirement']['url'], 'text' => 'גבר ' . (int) $bt['retirement']['men'][0] . '; אישה לפי חודש הלידה, כמו בטבלה (ילידות אחרי ' . justice_tools_he_date( $wlast[0] ) . ': ' . (int) $bt['retirement']['women_after'][0] . '); גיל הזכאות לקצבת אזרח ותיק בלי מבחן הכנסות ' . (int) $bt['retirement']['entitlement_age'] . '. נבדק ' . $checked . '.' ),
		);
	}
	// nekudot-zikui (jt29): the official sources, every text built from rights_tax.
	if ( 'nekudot-zikui' === $name ) {
		$rt      = $reg['rights_tax'];
		$pt      = $rt['points'];
		$checked = justice_tools_he_date( $rt['checked_on'] );
		$values  = array();
		foreach ( $rt['years'] as $y => $row ) {
			$values[] = $y . ': ' . number_format( (float) $row['point_month'] ) . ' ₪ לחודש';
		}
		$kids = $pt['kids'];
		// One column of a children table in words: "שנת הלידה 1.5; גיל 1 עד 5: 2.5; ...", straight from the bands.
		$col = static function ( array $bands ): string {
			$out = array();
			foreach ( $bands as $b ) {
				$age   = 0 === (int) $b[0] && 0 === (int) $b[1] ? 'שנת הלידה' : ( (int) $b[0] === (int) $b[1] ? 'גיל ' . (int) $b[0] : 'גיל ' . (int) $b[0] . ' עד ' . (int) $b[1] );
				$out[] = $age . ': ' . $b[2];
			}
			return implode( '; ', $out );
		};
		return array(
			array( 'name' => $rt['law_he'], 'url' => $rt['law_url'], 'text' => 'סעיף 33א: נקודת זיכוי; 34: תושב (2); 35: עולה; 36: נסיעה (¼); 36א: אישה (½); 37: בן זוג שכלכלתו על היחיד המוטב; 39א: חייל משוחרר; 39ב: מילואים כלוחם; 40(ב): משפחה חד-הורית, הורה יחיד והורה החי בנפרד; 40א: מזונות לבן הזוג לשעבר; 40ג עד 40ה: תואר ותעודת מקצוע; 45: ילד עם מוגבלות; 66(ג)(4)-(5): ילדים בחישוב נפרד. נוסח עדכני ל-' . justice_tools_he_date( $rt['law_current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $rt['source_name'], 'url' => $rt['source_url'], 'text' => 'שווי נקודת הזיכוי בכל שנה: ' . implode( '; ', $values ) . '. ' . $rt['freeze']['he'] . '.' ),
			array( 'name' => 'רשות המסים, הודעה למעסיקים 18.5.2022: הגדלת נקודות זיכוי להורים (הוראת שעה)', 'url' => $kids[0]['url'], 'text' => (int) $kids[0]['from'] . ' עד ' . (int) $kids[0]['to'] . ', לאישה נשואה ולהורה שהילדים אצלו: ' . $col( $kids[0]['col1'] ) . '. לגבר נשוי ולהורה שהילדים לא אצלו: ' . $col( $kids[0]['col2'] ) . '.' ),
			array( 'name' => 'רשות המסים, הודעה 3.1.2024: חוק הגדלת נקודות זיכוי להורים במס הכנסה, התשפ"ג-2023', 'url' => $kids[1]['url'], 'text' => $kids[1]['source_he'] . '. ' . (int) $kids[1]['from'] . ' עד ' . (int) $kids[1]['to'] . ': ' . $col( $kids[1]['col1'] ) . ' / ' . $col( $kids[1]['col2'] ) . '.' ),
			array( 'name' => 'רשות המסים, הודעה 26.3.2024: חוק סיוע להורים לילדים עד גיל שלוש (תיקוני חקיקה), התשפ"ד-2024', 'url' => $kids[2]['url'], 'text' => $kids[2]['source_he'] . '. מ-' . (int) $kids[2]['from'] . ': ' . $col( $kids[2]['col1'] ) . ' / ' . $col( $kids[2]['col2'] ) . '.' ),
			array( 'name' => 'רשות המסים, הודעה 21.7.2022: נקודות זיכוי לעולה, תיקון 262', 'url' => $pt['immigrant']['url'], 'text' => $pt['immigrant']['he'] . '.' ),
			array( 'name' => 'רשות המסים, הודעה 16.12.2025: סעיף 39ב, מילואים כלוחם', 'url' => $pt['reservist']['url'], 'text' => $pt['reservist']['he'] . '.' ),
			array( 'name' => 'רשות המסים, "דע זכויותיך" לשנת המס 2025, פרק ד', 'url' => $rt['guide_url'], 'text' => 'טבלת הילדים בשתי העמודות, הורה יחיד (כפל נקודות), משפחה חד-הורית, השתתפות בכלכלת ילדים, ילד עם מוגבלות, עולה וקטין חוזר, חייל משוחרר ושירות לאומי, ' . $pt['degree']['rule_he'] . '.' ),
			array( 'name' => 'טופס 101 לשנת המס ' . (int) $rt['form101']['year'], 'url' => $rt['form101']['url'], 'text' => 'חלק ח, סעיפים 1 עד 16: הנקודות שמבקשים מהמעסיק; חלק ג: הילדים; חלק ה: נקודות ומדרגות אצל מעסיק אחד. ' . $rt['form101']['when_he'] . '.' ),
			array( 'name' => 'רשות המסים: עריכת תיאום מס באופן מקוון, וטופס 116', 'url' => $rt['coordination']['service_url'], 'text' => $rt['coordination']['he'] . '. ' . $rt['coordination']['current_year_only_he'] . '.' ),
		);
	}
	// hechzer-mas (jt30): the official sources, every text built from rights_tax.
	if ( 'hechzer-mas' === $name ) {
		$rt      = $reg['rights_tax'];
		$checked = justice_tools_he_date( $rt['checked_on'] );
		$lines   = array();
		foreach ( $rt['years'] as $y => $row ) {
			$caps = array();
			$top  = 0;
			foreach ( $row['brackets'] as $b ) {
				if ( null !== $b[0] ) {
					$caps[] = (int) $b[1] . '% עד ' . number_format( (float) $b[0] );
				} else {
					$top = (int) $b[1];
				}
			}
			$lines[] = $y . ': ' . implode( ', ', $caps ) . ', ' . $top . '% מעל; מס נוסף ' . (int) $row['surtax']['pct'] . '% מעל ' . number_format( (float) $row['surtax']['threshold'] ) . '; נקודה ' . number_format( (float) $row['point_year'] ) . ' ₪ בשנה; תרומה מעל ' . number_format( (float) $row['donation']['min'] ) . ' ₪';
		}
		$f       = $rt['form106']['fields'];
		$y26     = $rt['years'][ (string) $rt['current_year'] ];
		return array(
			array( 'name' => $rt['law_he'], 'url' => $rt['law_url'], 'text' => 'סעיף 121: המדרגות; 121ב: מס נוסף; 33א: נקודת זיכוי, מקוזזת כנגד המס; 45א: ביטוח חיים (25%) וקופת גמל לקצבה (35%) עד התקרות; 46: תרומה למוסד ציבורי (' . (int) $rt['donation']['pct'] . '%, עד ' . (int) $rt['donation']['income_cap_pct'] . '% מההכנסה החייבת או התקרה, הנמוך); 159א: הפרשי הצמדה וריבית של ' . (int) $rt['refund']['interest']['pct'] . '% לשנה; 160(א): דוח עד שש שנים אחרי שנת המס. נוסח עדכני ל-' . justice_tools_he_date( $rt['law_current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $rt['source_name'], 'url' => $rt['source_url'], 'text' => 'המדרגות השנתיות, המס הנוסף, שווי הנקודה והמינימום לתרומה, כל שנה מלוח העזר שלה: ' . implode( ' | ', $lines ) . '.' ),
			array( 'name' => 'רשות המסים, הודעה 30.3.2026: ריווח מדרגות מס הכנסה', 'url' => $y26['change_url'], 'text' => $y26['change_he'] . '.' ),
			array( 'name' => 'חוק ההתייעלות הכלכלית (הקפאת עדכוני מס ומס יסף), התשפ"ה-2024', 'url' => $rt['freeze']['url'], 'text' => $rt['freeze']['he'] . ' (' . $rt['freeze']['law_he'] . ').' ),
			array( 'name' => 'טופס 106: אישור על משכורת וניכוי מס', 'url' => $rt['form106']['url'], 'text' => $f['salary']['where'] . ' (שדה ' . $f['salary']['field'] . '); ' . $f['tax']['where'] . ' (שדה ' . $f['tax']['field'] . '); ' . $f['donations']['where'] . ' (שדה ' . $f['donations']['field'] . '); ' . $f['life']['where'] . ' (שדה ' . $f['life']['field'] . '); ' . $f['points']['where'] . '; ' . $f['months']['where'] . '.' ),
			array( 'name' => 'טופס 135: דוח שנתי מקוצר למי שמבקש החזר', 'url' => $rt['refund']['form_url'], 'text' => 'השדות שבהם רושמים את נתוני טופס 106: משכורת ' . $f['salary']['field'] . ', מס שנוכה ' . $f['tax']['field'] . ', תרומות ' . $f['donations']['field'] . ', ביטוח חיים ' . $f['life']['field'] . '. ' . $rt['form106']['two_fields_he'] . '.' ),
			array( 'name' => 'רשות המסים: בקשה להחזר מס (טופס 135)', 'url' => $rt['refund']['service_url'], 'text' => $rt['refund']['he'] . '. הגשה מקוונת מלאה דרך האזור האישי, או ידנית במשרד פקיד השומה; המסמכים לצירוף ותשלום ההחזר לחשבון הבנק. נבדק ' . $checked . '.' ),
			array( 'name' => 'רשות המסים: עריכת תיאום מס באופן מקוון, וטופס 116', 'url' => $rt['coordination']['service_url'], 'text' => $rt['coordination']['he'] . '. ' . $rt['coordination']['current_year_only_he'] . '.' ),
			array( 'name' => 'רשות המסים, "דע זכויותיך" לשנת המס 2025', 'url' => $rt['guide_url'], 'text' => 'הסבר לכל שדה בדוח השנתי, נקודות הזיכוי של כל מצב, תרומות, ביטוח חיים וקופת גמל.' ),
		);
	}
	if ( 'dmei-avtala' === $name ) {
		$av      = $reg['rights_avtala'];
		$btl     = $reg['rights_btl'];
		$pg      = $av['pages'];
		$checked = justice_tools_he_date( $av['checked_on'] );
		$from    = justice_tools_he_date( $av['from'] );
		$bands   = array();
		foreach ( $av['days']['bands'] as $b ) {
			$bands[] = (int) $b['from'] . ' עד ' . (int) $b['to'] . ': ' . (int) $b['few'] . ' ימים, עם ' . (int) $av['days']['dependents_many'] . ' תלויים ומעלה ' . (int) $b['many'];
		}
		return array(
			array( 'name' => $av['law_he'], 'url' => $av['law_url'], 'text' => 'סעיף 158: מבוטח והתאריך הקובע (ה-1 בחודש שבו התחילה האבטלה); 160(א): גיל ' . (int) $av['age']['min'] . ' עד הגיל שבלוח א1; 161(א): ' . (int) $av['qualify']['months'] . ' חודשים קלנדריים עם דמי ביטוח אבטלה, ולו יום אחד בחודש, ב-' . (int) $av['qualify']['window_months'] . ' החודשים שלפני התאריך הקובע; 166(ב): ' . (int) $av['resign']['wait_days'] . ' ימים אחרי הפסקת עבודה מרצון בלי הצדקה; 166(ד) ו-171(א1): סירוב לעבודה מתאימה; 167: השיעור והתקרות; 170: השכר היומי הממוצע; 171: הימים המרביים; 171א: מובטל חוזר מתחת לגיל ' . (int) $av['repeat']['under_age'] . '; 172: ' . (int) $av['waiting']['days'] . ' ימי המתנה בכל ' . (int) $av['waiting']['every_months'] . ' חודשים. הנוסח המשולב באתר המוסד, נבדק ' . $checked . '.' ),
			array( 'name' => 'חוק הביטוח הלאומי, הלוחות', 'url' => $av['schedules_url'], 'text' => 'לוח א1, חלק ב\': הגיל המרבי לביטוח אבטלה, ' . (int) $av['age']['max'] . '; לוח ז\': הסכום היומי הבסיסי (הסכום הבסיסי חלקי 25) והמדרגות, ' . implode( '/', array_map( function ( $t ) { return (int) $t['pct']; }, $av['rates']['tiers'] ) ) . '% ומתחת לגיל ' . (int) $av['rates']['young_under'] . ' ' . implode( '/', array_map( function ( $t ) { return (int) $t['pct_young']; }, $av['rates']['tiers'] ) ) . '%.' ),
			array( 'name' => 'הביטוח הלאומי: איך מחשבים את דמי האבטלה', 'url' => $pg['calc'], 'text' => 'ההכנסה ב-' . (int) $av['base']['months'] . ' החודשים שלפני חודש הרישום חלקי ' . (int) $av['base']['divisor'] . '; הסכום היומי הבסיסי ' . number_format( (float) $av['rates']['basic_daily'] ) . ' ₪ מ-' . justice_tools_he_date( $av['rates']['basic_from'] ) . '; ניכויים: מס הכנסה, דמי ביטוח לאומי מינימליים ' . (int) $av['deductions']['ni_min'] . ' ₪ ודמי ביטוח בריאות.' ),
			array( 'name' => 'הביטוח הלאומי: סכום הקצבה', 'url' => $pg['sum'], 'text' => 'הטבלאות לשנת ' . substr( $av['from'], 0, 4 ) . ' לפי שכר ולפי גיל, לחודש של ' . (int) $av['month']['table_days'] . ' ימים; התקרה ' . number_format( (float) $av['cap']['first'], 2 ) . ' ₪ ליום ב-' . (int) $av['cap']['first_days'] . ' ימי התשלום הראשונים ו-' . number_format( (float) $av['cap']['after'], 2 ) . ' ₪ מהיום ה-' . ( (int) $av['cap']['first_days'] + 1 ) . ', מ-' . $from . '.' ),
			array( 'name' => 'הביטוח הלאומי: כמה זמן אפשר לקבל דמי אבטלה', 'url' => $pg['days'], 'text' => implode( '; ', $bands ) . '. מי נחשב תלוי, ותקרת הכנסה של בן זוג תלוי ' . number_format( (float) $av['days']['dependent_income_max'] ) . ' ₪ מ-' . $from . '. ' . $av['days']['window_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תנאי הזכאות', 'url' => $pg['conditions'], 'text' => 'תושבות, גיל, הפסקת עבודה, התייצבות בשירות התעסוקה (בלשכה בתוך ' . (int) $av['register']['office_days'] . ' יום מהרישום באתר) ותקופת אכשרה; ' . $av['qualify']['partial_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: סיבות להפסקת עבודה', 'url' => $pg['reasons'], 'text' => 'פיטורים וסיום חוזה: מהיום הראשון לרישום; התפטרות בלי הצדקה: אחרי ' . (int) $av['resign']['wait_days'] . ' ימים; הסיבות המוצדקות; חל"ת ביוזמת המעסיק של ' . (int) $av['leave']['min_days'] . ' יום לפחות.' ),
			array( 'name' => 'הביטוח הלאומי: תשלום הקצבה ומספר ימי העבודה האפשריים', 'url' => $pg['pay'], 'text' => 'תשלום ב-' . (int) $av['pay']['day_of_month'] . ' לחודש עבור החודש הקודם; ' . (int) $av['waiting']['days'] . ' ימי האבטלה הראשונים בכל ' . (int) $av['waiting']['every_months'] . ' חודשים לא משולמים ולא יורדים מהמכסה; ' . $av['month']['paid_weekdays_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: מובטל חוזר', 'url' => $pg['repeat'], 'text' => $av['repeat']['he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: נשים מובטלות בגילאי ' . (int) $av['women']['from_age'] . ' עד ' . (int) $av['age']['max'], 'url' => $pg['women'], 'text' => $av['women']['he'] . ' (' . $av['women']['section_57'] . ', ' . $av['women']['section_60'] . ', ' . $av['women']['cap_section'] . ').' ),
			array( 'name' => 'הביטוח הלאומי: איך מגישים תביעה', 'url' => $pg['submit'], 'text' => 'טופס ' . $av['claim']['form'] . ' באתר; ' . $av['claim']['deadline_he'] . '; ' . $av['claim']['employer_he'] . '.' ),
			array( 'name' => $btl['name_he'], 'url' => $btl['source_url'], 'text' => 'השכר הממוצע לפי סעיף 2 מ-' . justice_tools_he_date( $btl['from'] ) . ': ' . number_format( (float) $btl['avg_wage']['s2_benefits'] ) . ' ₪; ממנו התקרה, ' . number_format( (float) $btl['avg_wage']['s2_benefits'] ) . ' חלקי ' . (int) $av['cap']['wage_divisor'] . '.' ),
			array( 'name' => 'שירות התעסוקה: דמי אבטלה', 'url' => $av['register']['taasuka_guide_url'], 'text' => $av['register']['start_he'] . '.' ),
		);
	}
	if ( 'dmei-leida' === $name ) {
		$lq      = $reg['rights_leida'];
		$btl     = $reg['rights_btl'];
		$pg      = $lq['pages'];
		$q       = $lq['qualify'];
		$g       = $lq['grant'];
		$h       = $lq['hosp'];
		$p       = $lq['partner'];
		$checked = justice_tools_he_date( $lq['checked_on'] );
		$from    = justice_tools_he_date( $lq['from'] );
		$ma      = array();
		foreach ( $lq['multi_allowance']['rows'] as $row ) {
			$ma[] = (int) $row['kids'] . ' ילדים: ' . implode( ' / ', array_map( function ( $n ) { return number_format( (float) $n ); }, $row['amounts'] ) ) . ' ₪';
		}
		return array(
			array( 'name' => $lq['law_he'], 'url' => $lq['law_url'], 'text' => 'סעיף 39: לידה אחרי 22 שבועות; 44: מענק לידה, ' . (int) $g['pct_first'] . '%/' . (int) $g['pct_second'] . '%/' . (int) $g['pct_third'] . '% מהסכום הבסיסי, לתאומים ' . (int) $g['pct_twins'] . '% ולכל ילד נוסף ' . (int) $g['pct_extra'] . '%; 45: קצבת לידה; 49: דמי לידה לבן הזוג; 50(א): ' . (int) $q['full_weeks'] . ' שבועות ב-' . (int) $q['full_months'] . ' מתוך ' . (int) $q['full_window'] . ' חודשים או ' . (int) $q['full_alt_months'] . ' מתוך ' . (int) $q['full_alt_window'] . ', ' . (int) $q['partial_weeks'] . ' שבועות ב-' . (int) $q['partial_months'] . ' מתוך ' . (int) $q['partial_window'] . '; 50(ב): התקופות שנחשבות; 51: ההארכות (ילד נוסף, אשפוז, מוגבלות מורכבת מ-' . justice_tools_he_date( $lq['complex']['from'] ) . '); 52: תחילת התקופה; 53: שכר העבודה הרגיל עד הסכום הבסיסי כפול ' . (int) $lq['max']['b1_mult'] . ' חלקי ' . (int) $lq['max']['divisor'] . ', וניכוי מס ודמי ביטוח; 54: ' . (int) $lq['base']['months_short'] . ' חודשים חלקי ' . (int) $lq['base']['divisor_short'] . ' או ' . (int) $lq['base']['months_long'] . ' חלקי ' . (int) $lq['base']['divisor_long'] . ', הגבוה, ולעצמאית לפי המקדמות או השנה הקודמת. הנוסח המשולב באתר המוסד, נבדק ' . $checked . '.' ),
			array( 'name' => 'חוק הביטוח הלאומי, פרק י"ד: סעיף 296', 'url' => $lq['claims_law_url'], 'text' => 'תביעה לגמלת כסף מגישים בתוך ' . (int) $lq['claim']['deadline_months'] . ' חודשים מהיום שבו נוצרה העילה; תביעה מאוחרת משולמת רק בעד 12 החודשים שלפני הגשתה.' ),
			array( 'name' => $lq['work_law_he'], 'url' => $lq['work_law_url'], 'text' => 'סעיף 6(ב): תקופת לידה והורות של ' . (int) $lq['leave']['weeks'] . ' שבועות, עד ' . (int) $lq['leave']['before_max_weeks'] . ' לפני הלידה, ו-' . (int) $lq['leave']['short_weeks'] . ' למי שעבדה פחות מ-' . (int) $lq['leave']['seniority_months'] . ' חודשים אצל אותו מעסיק; 6(ב1), 6(ג), 6(ד), 6(ד2), 6(ד3): ההארכות; 6(ח): בן הזוג; 7(ג)(3): שעת הורות ' . (int) $lq['parent_hour']['months'] . ' חודשים; 7(ד)(1): היעדרות ללא תשלום עד ' . (int) $lq['unpaid']['max_months'] . ' חודשים מהלידה; 9(א): היתר לפיטורים בהיריון אחרי ' . (int) $lq['protect']['pregnancy_months'] . ' חודשים; 9(ג)(1) ו-(1א): איסור פיטורים בתקופת הלידה וההורות ו-' . (int) $lq['protect']['after_days'] . ' ימים אחריה. נבדק ' . $checked . '.' ),
			array( 'name' => 'הביטוח הלאומי: סכום דמי הלידה', 'url' => $pg['amount'], 'text' => 'עד ' . number_format( (float) $lq['max']['daily'], 2 ) . ' ₪ ליום מ-' . justice_tools_he_date( $lq['max']['from'] ) . '; ' . $lq['base']['he'] . '; ' . $lq['deductions']['he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תנאי הזכאות לדמי לידה', 'url' => $pg['conditions'], 'text' => (int) $q['full_months'] . ' מתוך ' . (int) $q['full_window'] . ' חודשים (או ' . (int) $q['full_alt_months'] . ' מתוך ' . (int) $q['full_alt_window'] . '): ' . (int) $q['full_days'] . ' ימים; ' . (int) $q['partial_months'] . ' מתוך ' . (int) $q['partial_window'] . ': ' . (int) $q['partial_days'] . ' ימים; ' . $q['partial_month_he'] . '; ' . $q['self_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תקופת הזכאות לדמי לידה', 'url' => $pg['period'], 'text' => $lq['start']['he'] . '; ' . $lq['multiple']['he'] . '; ' . $h['mother_he'] . '; ' . $h['baby_he'] . '; ' . $lq['complex']['he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: איך להגיש תביעה לדמי לידה', 'url' => $pg['claim'], 'text' => $lq['claim']['employer_he'] . '; טופס ' . $lq['claim']['form'] . ' באתר (' . $lq['claim']['online_he'] . '); ' . $lq['claim']['deadline_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: דמי לידה לאב', 'url' => $pg['father_period'], 'text' => $p['together_he'] . '; ' . $p['swap_he'] . '; ' . $p['partial_he'] . '; ' . $p['qualify_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: סכום מענק הלידה', 'url' => $pg['grant_amount'], 'text' => $g['he'] . '. ' . $g['paid_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: קצבת לידה רב-עוברית', 'url' => $pg['multiple'], 'text' => 'מ-' . $from . ', לחודשים 1-3 / 4-6 / 7-9 / 10-12 / 13-20: ' . implode( '; ', $ma ) . '.' ),
			array( 'name' => 'הביטוח הלאומי: מימון הוצאות אשפוז היולדת', 'url' => $pg['hospital'], 'text' => $lq['hospital']['he'] . '.' ),
			array( 'name' => 'gov.il: תביעה לתשלום דמי לידה', 'url' => $pg['gov_service'], 'text' => 'החישוב לשכירה, לעצמאית ולשתיהן; ההארכות; הגשה לא לפני ' . (int) $lq['claim']['earliest_weeks_before'] . ' שבועות לפני הלידה המשוערת ולא יאוחר מ-' . (int) $lq['claim']['deadline_months'] . ' חודשים. נבדק ' . $checked . '.' ),
			array( 'name' => $btl['name_he'], 'url' => $btl['basic_amount']['url'], 'text' => 'סכום בסיסי 1 מ-' . justice_tools_he_date( $btl['from'] ) . ': ' . number_format( (float) $btl['basic_amount']['b1'] ) . ' ₪; ממנו המקסימום, ' . number_format( (float) $btl['basic_amount']['b1'] ) . ' × ' . (int) $lq['max']['b1_mult'] . ' ÷ ' . (int) $lq['max']['divisor'] . ', ומענקי הלידה.' ),
		);
	}
	if ( 'kitzbat-nechut' === $name ) {
		$nc      = $reg['rights_nechut'];
		$btl     = $reg['rights_btl'];
		$pg      = $nc['pages'];
		$amt     = $nc['pension']['amounts'];
		$wk      = $nc['work'];
		$checked = justice_tools_he_date( $nc['checked_on'] );
		$from    = justice_tools_he_date( $nc['from'] );
		$rows    = array();
		foreach ( array_reverse( $nc['degree']['levels'] ) as $d ) {
			$a      = $amt[ (string) $d ];
			$rows[] = 'דרגה ' . (int) $d . '%: ' . number_format( (float) $a['pension'] ) . ' ₪, לכל ילד ' . number_format( (float) $a['child'] ) . ' ₪, לבן זוג ' . number_format( (float) $a['spouse'] ) . ' ₪';
		}
		$tiers = array();
		foreach ( $wk['tiers'] as $t ) {
			$tiers[] = $t['he'] . ': ' . (int) $t['rate'] . '%';
		}
		$cross = array();
		foreach ( $wk['crossover'] as $d => $w ) {
			$cross[] = number_format( (float) $w ) . ' ₪ בדרגה ' . (int) $d . '%';
		}
		$full = (int) max( $nc['degree']['levels'] );
		return array(
			array( 'name' => $nc['law_he'], 'url' => $nc['law_url'], 'text' => 'סעיף 195: "מבוטח" (מגיל ' . (int) $nc['age']['min'] . ' עד גיל הפרישה), "נכה" (אובדן ' . (int) $nc['degree']['min_loss'] . '% מהכושר להשתכר, והכנסה מעבודה עד ' . (int) $wk['new_claim_pct'] . '% מהשכר הממוצע ' . (int) $wk['new_claim_days'] . ' ימים), "עקרת בית", "התאריך הקובע" (לא לפני ' . (int) $nc['clock']['det_back_months'] . ' החודשים שלפני התביעה); 196: הזכות בתום ' . (int) $nc['clock']['wait_days'] . ' ימים, ומהיום ה-' . (int) $nc['clock']['early_from_day'] . ' בדרגה ' . $full . '% ל-' . (int) $nc['clock']['early_min_months'] . ' חודשים; 200: הקצבה המלאה (' . esc_html( (string) $nc['pension']['total_pct_of_basic'] ) . '% מהסכום הבסיסי) ותוספות התלויים; 201: קצבה חלקית, ותוספות מלאות בהכנסה מעל ' . (int) $wk['full_add_pct'] . '% מהשכר הממוצע; 202: ניכוי הכנסות, ומינימום של ' . esc_html( (string) $wk['min_pct_of_basic'] ) . '% מהסכום הבסיסי; 207: הדיון בתביעה; 208: ' . (int) $nc['medical']['min'] . '% נכות רפואית, או ' . (int) $nc['medical']['alt_min'] . '% עם ליקוי יחיד של ' . (int) $nc['medical']['single_min'] . '%; 209: הדרגות ושמירת הדרגה; 210: דרגה זמנית; 211 ו-213: ערר וערעור. הנוסח המשולב באתר המוסד, נבדק ' . $checked . '.' ),
			array( 'name' => 'חוק הביטוח הלאומי, פרק י"ד: גמלאות, הוראות כלליות', 'url' => $nc['general_law_url'], 'text' => 'סעיף 296(ב)(1): תביעה מאוחרת משולמת לכל היותר בעד ' . (int) $nc['clock']['retro_months'] . ' החודשים שקדמו לחודש שבו הוגשה.' ),
			array( 'name' => 'חוק הביטוח הלאומי, הלוחות', 'url' => $nc['schedules_url'], 'text' => 'לוח ח1 (שיעורי הניכוי מקצבה חודשית מלאה): ' . implode( '; ', $tiers ) . '. לוח ט, פרט 1: הכנסה מרבית של בן זוג תלוי, ' . (int) $nc['dependents']['spouse_income_pct'] . '% מהשכר הממוצע.' ),
			array( 'name' => 'הביטוח הלאומי: סכום הקצבה, נכות כללית', 'url' => $pg['sum'], 'text' => 'מ-' . $from . ': ' . implode( '; ', $rows ) . '. בן זוג שהכנסתו עד ' . number_format( (float) $nc['dependents']['spouse_income_max'] ) . ' ₪ ואינו מקבל קצבה; שני הילדים הראשונים; הכנסה שלא מעבודה מעל ' . number_format( (float) $nc['other_income']['disregard'] ) . ' ₪ מקטינה רק את מה שמעל הקצבה המלאה.' ),
			array( 'name' => 'הביטוח הלאומי: לעבוד ולקבל קצבת נכות', 'url' => $pg['work'], 'text' => 'תביעה ראשונה: הכנסה מעבודה נמוכה מ-' . number_format( (float) $wk['new_claim_max'] ) . ' ₪; הדרגה נשמרת כשעובדים, והקצבה חוזרת בלי ועדה כשההכנסה יורדת; הטבות נלוות ' . (int) $wk['benefits_months'] . ' חודשים; תוספות מלאות בהכנסה מעל ' . number_format( (float) $wk['full_add_from'] ) . ' ₪. ארבע הטבלאות לפי דרגה: בדרגה מלאה הקצבה לא יורדת עד ' . number_format( (float) $wk['free_upto'] ) . ' ₪; בדרגה חלקית עד ' . implode( ', ', $cross ) . '.' ),
			array( 'name' => 'הביטוח הלאומי: תנאי זכאות לקצבת נכות', 'url' => $pg['conditions'], 'text' => 'תושבות, גיל ' . (int) $nc['age']['min'] . ' עד גיל הפרישה, הכנסה מעבודה, נכות רפואית ודרגת אי-כושר של ' . implode( ', ', array_map( 'intval', $nc['degree']['levels'] ) ) . '%; מסלול עקרת בית.' ),
			array( 'name' => 'הביטוח הלאומי: קצבת נכות לעקרת בית', 'url' => $pg['homemaker_conditions'], 'text' => $nc['homemaker']['def_he'] . '; נכות רפואית של ' . (int) $nc['medical']['homemaker_min'] . '% לפחות; ' . $nc['dependents']['homemaker_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: קביעת אחוז הנכות הרפואית', 'url' => $pg['medical'], 'text' => $nc['medical']['weighted_he'] . '. ' . $nc['medical']['filtered_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תשלום הקצבה', 'url' => $pg['pay'], 'text' => 'הקצבה מהיום ה-' . ( (int) $nc['clock']['wait_days'] + 1 ) . ' לקביעת דרגת אי-הכושר; תשלום רטרואקטיבי עד ' . (int) $nc['clock']['retro_months'] . ' חודשים; ' . $nc['clock']['early_he'] . '; ' . $nc['clock']['pay_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: ערעור על אחוז הנכות הרפואית ועל דרגת אי-הכושר', 'url' => $pg['appeal'], 'text' => $nc['appeal']['medical_he'] . '; ' . $nc['appeal']['degree_he'] . '; ' . $nc['appeal']['court_he'] . '; ' . $nc['appeal']['other_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: בדיקה מחדש', 'url' => $pg['recheck'], 'text' => $nc['recheck']['he'] . '. ' . $nc['recheck']['income_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: אופן הגשת התביעה', 'url' => $pg['submit'], 'text' => 'טופס ' . $nc['claim']['form'] . ' מקוון, או בטלפון ' . $nc['claim']['phone'] . '; המסמכים הרפואיים, תלושי השכר והכנסות שלא מעבודה; ' . $nc['claim']['prep_he'] . '.' ),
			array( 'name' => $btl['name_he'], 'url' => $btl['basic_amount']['url'], 'text' => 'סכום בסיסי 4 מ-' . justice_tools_he_date( $btl['from'] ) . ': ' . number_format( (float) $btl['basic_amount']['b4'] ) . ' ₪, שממנו נגזרת קצבת הנכות הכללית; השכר הממוצע לפי סעיף 2: ' . number_format( (float) $btl['avg_wage']['s2_benefits'] ) . ' ₪, שממנו נגזרים ספי ההכנסה.' ),
		);
	}
	return array();
}

/** The page table of each instrument (the "numbers" and "compare" parts), rendered by the build from the registry. */
function justice_tools_rights_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}

// The rights wave 2A (22.10.2026, HAD-578) and 2B (22.10.2026, HAD-585).
require_once __DIR__ . '/justice-tools-rights-2a.php';
require_once __DIR__ . '/justice-tools-rights-2b.php';
