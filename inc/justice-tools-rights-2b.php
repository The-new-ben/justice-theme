<?php
/**
 * The rights wave 2B (22.10.2026, HAD-585): old age, reserve duty, children and income support, each on the page that owns
 * its words.
 *
 *   [justice_tool name="kitzbat-zikna"]       the old-age pension and the retirement age (/elder-law-israel/)
 *   [justice_tool name="tagmulei-miluim"]     reserve-duty pay, the IDF's 2026 grants and the dismissal protection
 *                                             (/miluim-dismissal-protection/)
 *   [justice_tool name="kitzbat-yeladim"]     the child allowance and the savings for every child (/kitzbat-yeladim/)
 *   [justice_tool name="havtachat-hachnasa"]  income support: the gates of the law, the amount, the work-income staircase
 *                                             (/havtachat-hachnasa/)
 * Every number is read from assets/data/justice-tools-registry.json (rights_btl and rights_<lane>, built by
 * tools/justice_tools_rights_<lane>.py) or from the snapshot the build renders. inc/justice-tools-rights.php merges these
 * functions into its own (names, catalog, answer, stamp, sources), so inc/justice-tools.php needs no change. The result-first
 * card ([justice_tool_lead]) and the simulation hand-off (sim-handoff.js) are the wave-2A ones.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_rights2b_names(): array {
	return array( 'kitzbat-zikna', 'tagmulei-miluim', 'kitzbat-yeladim', 'havtachat-hachnasa' );
}

/** The catalog entries, merged into justice_tools_rights_catalog(). */
function justice_tools_rights2b_catalog(): array {
	return array(
		// Rights wave 2B (22.10.2026, HAD-585): the old-age pension and the retirement-age clock, from the birth date to 80
		// (/elder-law-israel/, pages 20400). Reads rights_btl (basic amount 3, the average wage of section 2) and rights_zikna.
		'kitzbat-zikna' => array(
			'name'      => 'מחשבון קצבת זקנה וגיל פרישה 2026',
			'title'     => 'קצבת זקנה וגיל הפרישה: מתי, כמה, ומה עושה מבחן ההכנסות עד גיל 70',
			'promise'   => 'גיל הפרישה לפי חודש הלידה (גם ההדרגה לנשים), תקופת האכשרה, הקצבה לפי המשפחה עם תוספות הוותק, התלויים והדחייה, מבחן ההכנסות שקל אחרי שקל, מענק המעבר לילידות 1960 עד 1966, והמועדים ליומן.',
			'question'  => 'מתי אגיע לגיל הפרישה, כמה קצבת זקנה אקבל, ומה קורה אם אמשיך לעבוד?',
			'page'      => '/elder-law-israel/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_zikna' ),
			'dataset'   => 'rights_zikna',
			'next_text' => 'הצעד הבא: להכניס ליומן את גיל הפרישה ואת גיל 70, להגיש תביעה בזמן כדי לא לאבד חודשים, ולהתכונן לשיחה עם פקיד התביעות',
			'primary'   => array( 'label' => 'הוספת המועדים ליומן', 'act' => 'ics' ),
			// The rehearsal is the claims interview (the income between the retirement age and 70, the waiver and the deferral,
			// the insured periods); after a rejection the result switches to the appeal at the regional labour court.
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם פקיד התביעות', 'topic' => 'general', 'purpose' => 'witness_prep' ),
			'more'      => array(
				array( 'label' => 'ערר וערעור על החלטות הביטוח הלאומי', 'path' => '/bituach-leumi-appeal-guide/' ),
				array( 'label' => 'זכויות פנסיה: מה עוד מגיע', 'path' => '/pension-rights-israel/' ),
				array( 'label' => 'אזרח ותיק באתר הביטוח הלאומי', 'url' => 'https://www.btl.gov.il/benefits/old_age/Pages/default.aspx' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין לביטוח לאומי', 'path' => '/national-insurance-attorney/' ),
			'sticky'    => 'קצבה לחודש',
		),
		// Rights guide wave 2B (21.10.2026): reserve-duty pay, the IDF's 2026 grants and the dismissal protection, from the service
		// dates to the last protected day (/miluim-dismissal-protection/, pages 24688). Reads rights_tax for the s.39ב points.
		'tagmulei-miluim' => array(
			'name'      => 'מחשבון תגמולי מילואים 2026',
			'title'     => 'תגמולי מילואים 2026: כמה ליום ובסך הכול, מי משלם, אילו מענקים, ועד מתי אסור לפטר',
			'promise'   => 'שכיר, עצמאי, סטודנט או בלי עבודה: הבסיס של 3 החודשים מול המינימום והמקסימום, תוספת ה-40%, הפיצוי לעצמאי, מי משלם ומתי, מענקי צה"ל ל-2026 לפי מדרג, נקודות הזיכוי בשנה הבאה, ויומן ההגנה מפיטורים עד היום האחרון.',
			'question'  => 'כמה תגמולי מילואים אקבל, מי משלם אותם, ועד מתי אסור לפטר אותי?',
			'page'      => '/miluim-dismissal-protection/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_miluim', 'rights_tax' ),
			'dataset'   => 'rights_miluim',
			'next_text' => 'הצעד הבא: לבדוק בתלוש או באזור האישי שהתגמול שולם, ולהכניס ליומן את היום האחרון של ההגנה מפיטורים',
			'primary'   => array( 'label' => 'הוספת המועדים ליומן', 'act' => 'ics' ),
			// The rehearsal: the Employment Committee hearing when the employer dismisses after the reserve duty.
			'rehearse'  => array( 'label' => 'לתרגל את הדיון בוועדת התעסוקה', 'topic' => 'employment', 'purpose' => 'court_rehearsal' ),
			'more'      => array(
				array( 'label' => 'הליך שימוע לפני פיטורים', 'path' => '/hearing-before-dismissal/' ),
				array( 'label' => 'בונה נקודות זיכוי', 'path' => '/nekudot-zikui/' ),
				array( 'label' => 'מילואים באתר הביטוח הלאומי', 'url' => 'https://www.btl.gov.il/benefits/Reserve_Service/Pages/default.aspx' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/labor-lawyer/' ),
			'sticky'    => 'תגמול מילואים',
		),
		// Rights wave 2B (21.10.2026): the child allowance and the savings plan for every child, child by child until the youngest turns 18 (/kitzbat-yeladim/, a new page).
		'kitzbat-yeladim' => array(
			'name'      => 'מחשבון קצבת ילדים וחיסכון לכל ילד 2026',
			'title'     => 'קצבת ילדים וחיסכון לכל ילד: כמה לכל ילד, מה משתנה כשהבכור בן 18, וכמה יופקד עד גיל 18',
			'promise'   => 'הסכום לכל ילד לפי המקום שלו במניין, הקצבה של המשפחה חודש אחרי חודש עד שהצעיר בן 18, התוספת לילד השלישי והרביעי, מענק הלימודים, וההפקדות והמענקים בחיסכון של כל ילד, עם המועדים ליומן.',
			'question'  => 'כמה קצבת ילדים אקבל, ומה יקרה כשהילד הגדול יגיע לגיל 18?',
			'page'      => '/kitzbat-yeladim/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_yeladim' ),
			'dataset'   => 'rights_yeladim',
			'next_text' => 'הצעד הבא: לבדוק שהקצבה משולמת בעד כל ילד, לבחור קופה ומסלול לחיסכון של כל ילד, ולהכניס ליומן את סוף הקצבה ואת מועדי המענקים',
			'primary'   => array( 'label' => 'הוספת המועדים ליומן', 'act' => 'ics' ),
			// The rehearsal is the separation talk: who receives the allowance (the mother, unless agreed or ruled otherwise)
			// and who decides on the savings fund and track.
			'rehearse'  => array( 'label' => 'לתרגל את השיחה על הקצבה והחיסכון אחרי פרידה', 'topic' => 'family-law', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'מחשבון מזונות ילדים', 'path' => '/child-support/' ),
				array( 'label' => 'נקודות זיכוי בעד ילדים', 'path' => '/nekudot-zikui/' ),
				array( 'label' => 'קצבת ילדים באתר הביטוח הלאומי', 'url' => 'https://www.btl.gov.il/benefits/children/Pages/default.aspx' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין לענייני משפחה', 'path' => '/family-law/' ),
			'sticky'    => 'קצבת ילדים לחודש',
		),
		// The rights wave 2B (21.10.2026): income support, from the gates of the law to the benefit and the clock (/havtachat-hachnasa/).
		'havtachat-hachnasa' => array(
			'name'      => 'מחשבון הבטחת הכנסה 2026',
			'title'     => 'הבטחת הכנסה: תנאי הזכאות, הסכום, וכמה נשאר מכל שקל של עבודה',
			'promise'   => 'סולם התנאים של החוק (תושבות, גיל, שירות התעסוקה, רכב, חסכונות והכנסה), הקצבה המלאה לפי המשפחה והגיל, ההכנסה שנחשבת שורה אחרי שורה, ועד מתי להגיש כדי לא לאבד חודש.',
			'question'  => 'כמה הבטחת הכנסה מגיעה לי, ומה קורה לקצבה כשעובדים?',
			'page'      => '/havtachat-hachnasa/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_tax', 'rights_havtacha' ),
			'dataset'   => 'rights_havtacha',
			'next_text' => 'הצעד הבא: להירשם בשירות התעסוקה, להגיש את התביעה עוד החודש כדי לא לאבד אותו, ולהתכונן לבירור אצל פקיד התביעות',
			// The rehearsal is the interview with the claims officer or the investigator (the car, a partner, the income), or the
			// appeal at the regional labour court; the result names which one fits.
			'primary'   => array( 'label' => 'לתרגל את הבירור אצל פקיד התביעות', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הבירור אצל פקיד התביעות', 'topic' => 'general', 'purpose' => 'witness_prep' ),
			'more'      => array(
				array( 'label' => 'ערר וערעור על החלטות הביטוח הלאומי', 'path' => '/bituach-leumi-appeal-guide/' ),
				array( 'label' => 'דמי אבטלה: תנאי הזכאות', 'path' => '/unemployment-benefits-eligibility/' ),
				array( 'label' => 'הבטחת הכנסה באתר הביטוח הלאומי', 'url' => 'https://www.btl.gov.il/benefits/Income_support/Pages/default.aspx' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין לביטוח לאומי', 'path' => '/national-insurance-attorney/' ),
			'sticky'    => 'לחודש',
		),
	);
}

/** The answer box (40-70 words): the direct answer, its numbers, their sections and the check date. */
function justice_tools_rights2b_answer( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	// kitzbat-zikna (jt50): the answer box. One paragraph, every figure and section from rights_zikna (the Institute's 2026
	// table, chapter 11 of the National Insurance Law and its tables, the Retirement Age Law), ending with the check date.
	if ( 'kitzbat-zikna' === $name && ! empty( $reg['rights_zikna'] ) ) {
		$zk   = $reg['rights_zikna'];
		$am   = $zk['amounts'];
		$it   = $zk['income_test'];
		$ag   = $zk['ages'];
		$text = '<strong>קצבת זקנה</strong> (קצבת אזרח ותיק) היא קצבה חודשית מהביטוח הלאומי: ב-<bdi>' . esc_html( substr( $zk['from'], 0, 4 ) ) . '</bdi> ' . justice_tools_money( $am['basic'], 0 ) . ' ליחיד ו-' . justice_tools_money( $am['published']['couple'], 0 ) . ' לזוג, ועוד <bdi>' . (int) $zk['seniority']['pct_per_year'] . '%</bdi> לכל שנת ביטוח עד <bdi>' . (int) $zk['seniority']['max_pct'] . '%</bdi> (' . esc_html( $am['section'] ) . ', ' . esc_html( $zk['seniority']['section'] ) . '). '
			. 'היא משולמת מגיל הפרישה, <bdi>' . (int) $ag['men_now'] . '</bdi> לגבר ו-<bdi>' . (int) $ag['women_now_from'] . '</bdi> עד <bdi>' . (int) $ag['women_now_to'] . '</bdi> לאישה לפי חודש הלידה, כשההכנסה מעבודה עד ' . justice_tools_money( $it['single'], 0 ) . ' ליחיד (' . esc_html( $it['section'] ) . '), ומגיל <bdi>' . (int) $ag['men_eligibility'] . '</bdi> בלי מבחן הכנסות. נבדק ' . esc_html( justice_tools_he_date( $zk['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// tagmulei-miluim (jt51): the answer box. One paragraph, every figure and section from rights_miluim (the Institute's 2026
	// figures, chapter 12 of the National Insurance Law, the Discharged Soldiers Law), ending with the check date.
	if ( 'tagmulei-miluim' === $name && ! empty( $reg['rights_miluim'] ) ) {
		$ml   = $reg['rights_miluim'];
		$p    = $ml['pay'];
		$pr   = $ml['protect'];
		$text = '<strong>תגמולי מילואים</strong> משלם הביטוח הלאומי בעד כל יום שירות: ההכנסה ב-<bdi>' . (int) $p['quarter_months'] . '</bdi> החודשים שלפני חודש השירות חלקי <bdi>' . (int) $p['quarter_divisor'] . '</bdi>, לא פחות מ-' . justice_tools_money( $p['min_daily'] ) . ' ולא יותר מ-' . justice_tools_money( $p['max_daily'] ) . ' ליום ב-<bdi>' . esc_html( substr( $ml['from'], 0, 4 ) ) . '</bdi> (סעיפים 270 ו-273 לחוק). '
			. 'כל שבוע משולם כ-<bdi>' . (int) $ml['addition']['week'] . '</bdi> ימים, ושארית קטנה מ-<bdi>' . (int) $ml['addition']['six'] . '</bdi> ימים כפול <bdi>' . esc_html( (string) $ml['addition']['factor'] ) . '</bdi>. שכיר בשכר חודשי מקבל דרך המעסיק. '
			. 'אסור לפטר בזמן השירות, ובשירות של יותר מיומיים גם <bdi>' . (int) $pr['after_days'] . '</bdi> ימים אחריו, בלי היתר (' . esc_html( $pr['after_section'] ) . ' לחוק החיילים המשוחררים). נבדק ' . esc_html( justice_tools_he_date( $ml['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// kitzbat-yeladim (jt52): the answer box. One paragraph, every figure and section from rights_btl (basic amount 2) and
	// rights_yeladim (the Institute's children pages, chapter 4 of the National Insurance Law), ending with the check date.
	if ( 'kitzbat-yeladim' === $name && ! empty( $reg['rights_yeladim'] ) && ! empty( $reg['rights_btl'] ) ) {
		$yl   = $reg['rights_yeladim'];
		$b    = $reg['rights_btl']['basic_amount'];
		$al   = $yl['allowance'];
		$text = '<strong>קצבת ילדים</strong> היא קצבה חודשית שהביטוח הלאומי משלם ב-<bdi>' . (int) $al['pay_day'] . '</bdi> בכל חודש בעד כל ילד עד גיל <bdi>' . (int) $al['end_age'] . '</bdi>, בלי קשר להכנסה: ב-<bdi>' . esc_html( substr( $yl['from'], 0, 4 ) ) . '</bdi> ' . justice_tools_money( $b['b2_child_first_fifth'], 0 ) . ' לילד הראשון ולחמישי ואילך, ו-' . justice_tools_money( $b['b2_child_second_to_fourth'], 0 ) . ' לשני, לשלישי ולרביעי (' . esc_html( $al['section'] ) . '). '
			. 'מעבר לקצבה מופקדים ' . justice_tools_money( $yl['savings']['monthly'], 0 ) . ' בחודש לחיסכון על שם כל ילד; למקבלי הבטחת הכנסה, מזונות או השלמת הכנסה, עוד ' . justice_tools_money( $yl['supplement']['amount'], 0 ) . ' לילד השלישי ולרביעי (' . esc_html( $yl['supplement']['section'] ) . '). נבדק ' . esc_html( justice_tools_he_date( $yl['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// havtachat-hachnasa (jt53): the answer box. One paragraph, every figure and section from rights_havtacha (the Institute's
	// 2026 table, the Income Support Law and its regulations), ending with the check date.
	if ( 'havtachat-hachnasa' === $name && ! empty( $reg['rights_havtacha'] ) ) {
		$hv   = $reg['rights_havtacha'];
		$amt  = $hv['amounts'];
		$wk   = $hv['work'];
		$text = '<strong>הבטחת הכנסה</strong> היא קצבה חודשית מהביטוח הלאומי למי שאין לו הכנסה או שהכנסתו נמוכה: ב-<bdi>' . esc_html( substr( $hv['from'], 0, 4 ) ) . '</bdi> ' . justice_tools_money( $amt['b']['single'], 0 ) . ' ליחיד מתחת לגיל <bdi>' . (int) $hv['age']['older_from'] . '</bdi> ועד ' . justice_tools_money( $amt['b']['parent2'], 0 ) . ' להורה יחיד עם שני ילדים, ומגיל <bdi>' . (int) $hv['age']['older_from'] . '</bdi> מ-' . justice_tools_money( $amt['c']['single'], 0 ) . ' (' . esc_html( $amt['section'] ) . '). '
			. 'מההכנסה מעבודה רק חלק נחשב: ליחיד ' . justice_tools_money( $wk['first']['b']['single'], 0 ) . ' לא נחשבים, ומהיתרה <bdi>' . esc_html( (string) $wk['counted_pct']['b']['single'] ) . '%</bdi> (' . esc_html( $wk['section_b'] ) . '). '
			. 'התנאים: מגיל <bdi>' . (int) $hv['age']['min'] . '</bdi>, תושבות, התייצבות בשירות התעסוקה ורכב עד ' . justice_tools_money( $hv['car']['limit'], 0 ) . '. נבדק ' . esc_html( justice_tools_he_date( $hv['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '';
}

/** The data stamp in the tool's header. */
function justice_tools_rights2b_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	// Renders: יחיד 1,838 ₪, זוג 2,762 ₪ מ-1.1.2026 · נבדק 21.10.2026
	if ( 'kitzbat-zikna' === $name ) {
		$zk = $reg['rights_zikna'] ?? array();
		return 'יחיד ' . number_format( (float) ( $zk['amounts']['basic'] ?? 0 ) ) . ' ₪, זוג ' . number_format( (float) ( $zk['amounts']['published']['couple'] ?? 0 ) ) . ' ₪ מ-' . justice_tools_he_date( $zk['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $zk['checked_on'] ?? '' );
	}
	if ( 'tagmulei-miluim' === $name ) {
		$ml = $reg['rights_miluim'] ?? array();
		return 'מינימום ' . number_format( (float) ( $ml['pay']['min_daily'] ?? 0 ), 2 ) . ' · מקסימום ' . number_format( (float) ( $ml['pay']['max_daily'] ?? 0 ), 2 ) . ' ₪ ליום מ-' . justice_tools_he_date( $ml['pay']['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $ml['checked_on'] ?? '' );
	}
	if ( 'kitzbat-yeladim' === $name ) {
		$b  = $reg['rights_btl']['basic_amount'] ?? array();
		$yl = $reg['rights_yeladim'] ?? array();
		return number_format( (float) ( $b['b2_child_first_fifth'] ?? 0 ) ) . ' / ' . number_format( (float) ( $b['b2_child_second_to_fourth'] ?? 0 ) ) . ' ₪ לילד מ-' . justice_tools_he_date( $yl['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $yl['checked_on'] ?? '' );
	}
	// Renders: 173 / 219 ₪ לילד מ-1.1.2026 · נבדק 21.10.2026
	if ( 'havtachat-hachnasa' === $name ) {
		$hv = $reg['rights_havtacha'] ?? array();
		return 'יחיד ' . number_format( (float) ( $hv['amounts']['b']['single'] ?? 0 ) ) . ' ₪, מגיל ' . (int) ( $hv['age']['older_from'] ?? 0 ) . ' ' . number_format( (float) ( $hv['amounts']['c']['single'] ?? 0 ) ) . ' ₪ מ-' . justice_tools_he_date( $hv['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $hv['checked_on'] ?? '' );
	}
	return 'נבדק ' . justice_tools_he_date( justice_tools_checked_on( $name ) );
}

/** Official sources used by each instrument's result. */
function justice_tools_rights2b_sources( string $name ): array {
	$reg = justice_tools_registry();
	if ( 'kitzbat-zikna' === $name ) {
		$zk      = $reg['rights_zikna'];
		$btl     = $reg['rights_btl'];
		$pg      = $zk['pages'];
		$am      = $zk['amounts'];
		$it      = $zk['income_test'];
		$sp      = $zk['spouse'];
		$gr      = $zk['grant'];
		$checked = justice_tools_he_date( $zk['checked_on'] );
		$from    = justice_tools_he_date( $zk['from'] );
		$rates   = array();
		foreach ( $gr['rates'] as $year => $rate ) {
			$rates[] = $year . ': ' . number_format( (float) $rate );
		}
		$sup = $zk['supplement']['table']['to70'];
		return array(
			array( 'name' => $zk['law_he'], 'url' => $zk['law_url'], 'text' => 'סעיף 240: מי מבוטח; 244(א): קצבה של ' . esc_html( (string) $am['pct']['basic'] ) . '% מהסכום הבסיסי; 244(ב): ' . esc_html( (string) $am['pct']['spouse'] ) . '% לבן זוג תלוי ו-' . esc_html( (string) $am['pct']['child'] ) . '% לכל אחד משני הילדים הראשונים; 245(א): הגיל, 70 או גיל הפרישה כשההכנסה עד ההכנסה המרבית; 245(ב): קצבה פחות ' . (int) $it['deduct_pct'] . '% מההכנסה שמעל ההכנסה המרבית, ולא פחות מ-' . (int) $it['min_partial_pct'] . '% מהקצבה הבסיסית; 245(ג): הכנסה מקצבה לא נחשבת; 246: תקופת אכשרה, ' . (int) $zk['achshara']['last10_months'] . ' חודשים בתוך 10 שנים או ' . (int) $zk['achshara']['total_months'] . ' חודשים, והפטור לאישה; 247: התלויים; 247א: ' . esc_html( (string) $am['pct']['basic80'] ) . '% מגיל ' . (int) $am['from80'] . '; 248: תוספת ותק, ' . (int) $zk['seniority']['pct_per_year'] . '% לשנה עד ' . (int) $zk['seniority']['max_pct'] . '%; 249: תוספת דחייה, ' . (int) $zk['deferral']['pct_per_year'] . '% לשנה, ו-' . (int) $zk['deferral']['nine_months'] . ' חודשים כשנה; 269א: מענק המעבר. הנוסח המשולב באתר המוסד, נבדק ' . $checked . '.' ),
			array( 'name' => 'חוק הביטוח הלאומי: הלוחות א1, ט ו-ט1; פרק א\', הגדרת "גיל הפרישה"', 'url' => $zk['tables_url'], 'text' => 'לוח א1, חלק א\': גיל הפרישה לפי חודש הלידה (גבר ' . (int) $zk['ages']['men_now'] . ' מילידי מאי 1942; אישה עד דצמבר 1955), ולילידות 1956 ואילך לפי חוק גיל פרישה; חלק ד\': גיל הזכאות לאישה, ' . (int) $zk['ages']['men_eligibility'] . ' מילידות מאי 1950; לוח ט, פרט 1: ' . (int) $sp['limit_pct'] . '% מהשכר הממוצע, ' . number_format( (float) $sp['income_limit'] ) . ' ₪, הכנסת בן הזוג התלוי; לוח ט1: ההכנסה המרבית, ' . esc_html( (string) $it['max_pct']['none'] ) . '% ו-' . esc_html( (string) $it['max_pct']['one'] ) . '% מהשכר הממוצע ועוד ' . esc_html( (string) $it['max_pct']['each'] ) . '% לכל תלוי נוסף.' ),
			array( 'name' => $zk['retirement_law_he'], 'url' => $zk['retirement_law_url'], 'text' => 'סעיף 3: גיל הפרישה 67 לגבר ו-65 לאישה; 6(2): אישה שנולדה עד דצמבר 1969 לפי חלק ב\' בתוספת, מ-62 (ילידות מאי 1947 עד 1959) ועד 64 ו-9 חודשים (ילידות 1969). נוסח עדכני (נבו).' ),
			array( 'name' => 'הביטוח הלאומי: סכומי הקצבה לפי המצב המשפחתי', 'url' => $am['url'], 'text' => 'מ-' . $from . ': יחיד ' . number_format( (float) $am['published']['single'] ) . ' ₪, מגיל 80 ' . number_format( (float) $am['published']['single80'] ) . ' ₪; זוג ' . number_format( (float) $am['published']['couple'] ) . ' ₪, מגיל 80 ' . number_format( (float) $am['published']['couple80'] ) . ' ₪; יחיד וילד ' . number_format( (float) $am['published']['single_child'] ) . ' ₪; זוג וילד ' . number_format( (float) $am['published']['couple_child'] ) . ' ₪; יחיד ו-2 ילדים ' . number_format( (float) $am['published']['single_children'] ) . ' ₪; זוג ו-2 ילדים ' . number_format( (float) $am['published']['couple_children'] ) . ' ₪. ' . $am['both_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: גיל הפרישה וגיל הזכאות', 'url' => $pg['retirement'], 'text' => $zk['ages']['he'] . '. ' . $zk['ages']['women_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: מבחן הכנסות וקצבה חלקית', 'url' => $it['work_url'], 'text' => 'מ-' . $from . ': מעבודה, קצבה מלאה עד ' . number_format( (float) $it['single'] ) . ' ₪ ליחיד ו-' . number_format( (float) $it['couple'] ) . ' ₪ לזוג, ואין קצבה מעל ' . number_format( (float) $it['end_single'] ) . ' ו-' . number_format( (float) $it['end_couple'] ) . ' ₪; שלא מעבודה ' . number_format( (float) $it['other']['single'][0] ) . ' עד ' . number_format( (float) $it['other']['single'][1] ) . ' ₪ ליחיד, ' . number_format( (float) $it['other']['couple'][0] ) . ' עד ' . number_format( (float) $it['other']['couple'][1] ) . ' ₪ לזוג; הקצבה החלקית המזערית ' . number_format( (float) $it['min_partial'] ) . ' ₪. ' . $it['excluded_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תוספת ותק ותוספת דחיית קצבה', 'url' => $zk['seniority']['url'], 'text' => $zk['seniority']['he'] . '. ' . $zk['deferral']['he'] . '. ' . $zk['deferral']['other_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תוספת עבור בן זוג וילדים, והגדרות', 'url' => $am['dependants_url'], 'text' => 'מ-' . $from . ': בן או בת זוג ' . number_format( (float) $am['spouse'] ) . ' ₪, ילד ' . number_format( (float) $am['child'] ) . ' ₪ (עד ' . (int) $am['max_children'] . '). ' . $sp['wife_he'] . '. ' . $sp['husband_he'] . '. ' . $sp['child_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תקופת אכשרה לגבר ולאישה', 'url' => $zk['achshara']['woman_url'], 'text' => $zk['achshara']['he'] . '. ' . $zk['achshara']['exempt_he'] . '. ' . $zk['achshara']['basic70_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: מענק מעבר לנשים בגיל 62', 'url' => $gr['url'], 'text' => $gr['he'] . '; לחודש לפי שנת הלידה: ' . implode( ', ', $rates ) . ' ₪; ' . $gr['rate_he'] . '; ' . $gr['deadline_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: השלמת הכנסה לקצבת אזרח ותיק', 'url' => $zk['supplement']['amounts_url'], 'text' => 'מ-' . $from . ', עד גיל 70, כולל הקצבה: יחיד ' . number_format( (float) $sup['single'] ) . ' ₪, זוג ' . number_format( (float) $sup['couple'] ) . ' ₪.' ),
			array( 'name' => 'הביטוח הלאומי: הגשת התביעה, תשלום הקצבה וניכויים', 'url' => $zk['claim']['url'], 'text' => $zk['claim']['retro_he'] . '. ' . $zk['claim']['pay_he'] . '; ' . $zk['claim']['first_he'] . '. ' . $zk['health']['he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: ערעור על החלטה', 'url' => $zk['appeal']['court_url'], 'text' => $zk['appeal']['he'] . '.' ),
			array( 'name' => 'חוק העונשין, ' . $zk['penal']['section'], 'url' => $zk['penal']['url'], 'text' => $zk['penal']['he'] . '.' ),
			array( 'name' => $btl['name_he'], 'url' => $btl['basic_amount']['url'], 'text' => 'סכום בסיסי 3 מ-' . justice_tools_he_date( $btl['from'] ) . ': ' . number_format( (float) $btl['basic_amount']['b3'] ) . ' ₪, שממנו נגזרת הקצבה; השכר הממוצע לפי סעיף 2: ' . number_format( (float) $btl['avg_wage']['s2_benefits'] ) . ' ₪, שממנו נגזרת ההכנסה המרבית.' ),
		);
	}
	if ( 'tagmulei-miluim' === $name ) {
		$ml      = $reg['rights_miluim'];
		$btl     = $reg['rights_btl'];
		$pg      = $ml['pages'];
		$p       = $ml['pay'];
		$pr      = $ml['protect'];
		$ord     = $pr['order'];
		$g       = $ml['grants'];
		$checked = justice_tools_he_date( $ml['checked_on'] );
		$from    = justice_tools_he_date( $ml['from'] );
		$rates   = static function ( array $r ): string {
			return implode( ' / ', array_map( function ( $n ) { return number_format( (float) $n ); }, array_values( $r ) ) );
		};
		return array(
			array( 'name' => $ml['law_he'], 'url' => $ml['law_url'], 'text' => 'סעיף 270: התגמול המרבי, הסכום הבסיסי כפול ' . (int) $p['max_mult'] . ' חלקי ' . (int) $p['divisor_month'] . ', והתגמול המזערי, ' . (int) $p['min_pct'] . '% מהסכום הבסיסי חלקי ' . (int) $p['divisor_month'] . '; 271(א): שבוע של ' . (int) $ml['addition']['week'] . ' ימים, שארית של ' . (int) $ml['addition']['six'] . ' כ-' . (int) $ml['addition']['six_paid'] . ', שארית קטנה כפול ' . $ml['addition']['factor'] . '; 271(ב): שירות חצי יומי; 272: שיעור התגמול לעובד, לעצמאי ולמי שלא עובד, ולמובטל לא פחות מדמי האבטלה; 273(א): ' . (int) $p['quarter_months'] . ' החודשים שלפני חודש השירות חלקי ' . (int) $p['quarter_divisor'] . ', כל חודש לפחות ' . (int) $p['month_floor_pct'] . '% מהסכום הבסיסי; 273(ב): פחות מ-' . (int) $p['short_days'] . ' ימי עבודה, 3 מתוך 6 חודשים; 274(א): מי שהפסיק לעבוד; 274ב: שירות נוסף בתקופת חירום, עלייה עד ' . (int) $ml['emergency']['raise_pct'] . '%; 276 ו-280: המעסיק משלם ומקבל את התגמול; 279: שירות נוסף בתוך ' . (int) $ml['drag']['days'] . ' ימים. הנוסח המשולב באתר המוסד, נבדק ' . $checked . '.' ),
			array( 'name' => 'חוק הביטוח הלאומי, פרק י"ד: סעיף 296; פרק א\': הגדרת "גמלה"', 'url' => $ml['claim']['url'], 'text' => $ml['claim']['he'] . '. הגדרת "גמלה" בסעיף 1 כוללת גמלה לפי פרק י"ב.' ),
			array( 'name' => $pr['law_he'], 'url' => $pr['law_url'], 'text' => 'סעיף 20(ג): ארבעת חברי ועדת התעסוקה; 21: התביעה, ' . $pr['remedy']['he'] . '; 23(א): ערעור בתוך ' . (int) $pr['appeal']['days'] . ' ימים; 41א(א1): פיטורים בשל שירות מילואים בטלים; 41א(ב): ' . $pr['during_he'] . ', ו' . $pr['after_he'] . '; 41א(ג): ' . $pr['notice_he'] . '; 41א(ה): ' . $pr['contract_he'] . '; 41א1: קנס; 41א2: ' . $pr['spouse']['he'] . '. נוסח עדכני (נבו), נבדק ' . $checked . '.' ),
			array( 'name' => 'צו הרחבה להסכם קיבוצי בעניין משרתי המילואים ובני זוגם, ילקוט הפרסומים 14498', 'url' => $ord['url'], 'text' => 'פורסם ' . justice_tools_he_date( $ord['published'] ) . ', בתוקף מ-' . justice_tools_he_date( $ord['from'] ) . ' לתקופה בלתי קצובה. ' . $ord['section'] . ': ' . $ord['ext_he'] . '; ' . $ord['unpaid_section'] . ': ' . $ord['unpaid_he'] . '; ' . $ord['committee_section'] . ': ' . $ord['committee_he'] . '; ' . $ord['spouse_section'] . ': ' . $ord['spouse_he'] . '.' ),
			array( 'name' => 'הצו הקודם, ילקוט הפרסומים 12159', 'url' => $ord['prev']['url'], 'text' => $ord['prev']['he'] . '.' ),
			array( 'name' => $pr['equal']['law_he'], 'url' => $pr['equal']['law_url'], 'text' => $pr['equal']['section'] . ': ' . $pr['equal']['he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: סכום התגמול', 'url' => $pg['amount'], 'text' => 'מ-' . $from . ': מינימום ' . number_format( (float) $p['min_daily'], 2 ) . ' ₪ ליום (' . number_format( (float) $p['min_month'] ) . ' לחודש), מקסימום ' . number_format( (float) $p['max_daily'], 2 ) . ' ₪ ליום (' . number_format( (float) $p['max_month'] ) . ' לחודש); ' . $p['includes_he'] . '; ' . $ml['addition']['he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תשלום התגמול לפי סוגי זכאים', 'url' => $pg['by_status'], 'text' => $ml['payer']['employer_he'] . '; ' . $ml['payer']['institute_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: אופן הגשת התביעה וניכויים', 'url' => $pg['claim'], 'text' => $ml['payer']['personal_he'] . '; ' . $ml['self']['auto_he'] . '; ' . $ml['deductions']['he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: פיצוי לעובד עצמאי', 'url' => $pg['self_comp'], 'text' => $ml['self']['he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: השינוי בחישוב מ-1.5.2025', 'url' => $pg['change_2025'], 'text' => $ml['emergency']['page_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: משרתים במילואים בתקופת המלחמה', 'url' => $pg['war'], 'text' => $ml['addition']['war_he'] . '.' ),
			array( 'name' => 'אתר המילואים של צה"ל: מדיניות תגמולים, מענקים והטבות לשנת ' . (int) $g['year'], 'url' => $g['url'], 'text' => 'החלטת הממשלה מ-' . justice_tools_he_date( $g['decision'] ) . ', לפי מדרג (א\'+ / א\' / ב\' / ג\' / ד\' / ה\'): תגמול מיוחד מהיום ה-' . (int) $g['special']['from_day'] . ', ' . $rates( $g['special']['rates'] ) . ' ₪ ליום, משולם ' . justice_tools_he_date( $g['special']['paid_on'] ) . '; הוצאות אישיות מ-' . (int) $g['personal']['min_days'] . ' ימים, ' . $rates( $g['personal']['rates'] ) . ' ₪ ליום; משפחה מוגדל, ' . $rates( $g['family']['rates'] ) . ' ₪ ליום; כלכלת הבית ' . $rates( $g['household']['amounts'] ) . ' ₪; משפחה מיוחדת ' . number_format( (float) $g['special_family']['amount'] ) . ' ₪; שובר נופש וארנק דיגיטלי. ' . $g['budget_he'] . '.' ),
			array( 'name' => 'אתר המילואים של צה"ל: מדיניות 2025 ותגמולים', 'url' => $g['prev_url'], 'text' => 'הסכומים של 2025 לפי מערך (לוחם / הגמ"ר / יתר): תגמול מיוחד ' . implode( ' / ', $g['prev2025']['special'] ) . ' ₪ ליום; ' . $g['additional_2025']['he'] . '.' ),
			array( 'name' => 'אתר המילואים של צה"ל: ייצוג משפטי ונקודות זיכוי', 'url' => $pr['legal_aid_url'], 'text' => $pr['legal_aid_he'] . '; ' . $ml['tax']['he'] . '.' ),
			array( 'name' => $btl['name_he'], 'url' => $btl['basic_amount']['url'], 'text' => 'סכום בסיסי 3 מ-' . justice_tools_he_date( $btl['from'] ) . ': ' . number_format( (float) $btl['basic_amount']['b3'] ) . ' ₪; ממנו המקסימום והמינימום של התגמול. השכר הממוצע לפי סעיף 1: ' . number_format( (float) $btl['avg_wage']['s1_benefits'] ) . ' ₪, ובוועדת התעסוקה פיצוי של לפחות פי ' . (int) $pr['remedy']['avg_mult'] . ' ממנו.' ),
		);
	}
	if ( 'kitzbat-yeladim' === $name ) {
		$yl      = $reg['rights_yeladim'];
		$btl     = $reg['rights_btl'];
		$b       = $btl['basic_amount'];
		$al      = $yl['allowance'];
		$sp      = $yl['supplement'];
		$sg      = $yl['study'];
		$sv      = $yl['savings'];
		$pg      = $yl['pages'];
		$checked = justice_tools_he_date( $yl['checked_on'] );
		$from    = justice_tools_he_date( $yl['from'] );
		$hist    = array();
		foreach ( $yl['history']['rows'] as $row ) {
			$hist[] = 'מ-' . justice_tools_he_date( $row['from'] ) . ': ' . (int) $row['first_fifth'] . ' / ' . (int) $row['second_to_fourth'] . ' ₪';
		}
		return array(
			array( 'name' => $yl['law_he'], 'url' => $yl['law_url'], 'text' => 'סעיף 65: "ילד" - נמצא בישראל ולא מלאו לו ' . (int) $al['end_age'] . ', ויציאה עד ' . (int) $al['abroad_months'] . ' חודשים לא נחשבת; 68(א): הקצבה בעד כל ילד שבמניין שווה לסכום הבסיסי הקבוע לגביו; 68(ב): סכום נפרד לילד רביעי ואילך שנולד לפני ' . justice_tools_he_date( $yl['legacy']['born_before'] ) . ' (כל ילד כזה כבר מעל ' . (int) $al['end_age'] . '); 68(ג): תוספת של ' . (int) $sp['pct_of_income_support'] . '% מהסכום הבסיסי לעניין הבטחת הכנסה לילד השלישי והרביעי; 69: מקבל הקצבה; 72: מ-1 בחודש למי שנולד עד ה-' . (int) $al['start_cutoff_day'] . ', עד סוף החודש שבו נפסקה הזכאות, ' . (int) $al['alive_days'] . ' ימי חיים, ' . (int) $al['death_months'] . ' חודשים אחרי פטירה; 73: פטור ממס; 74: מענק לימודים, ' . esc_html( (string) $sg['pct_of_basic'] ) . '% מהסכום הבסיסי; 74ב-74ה: חיסכון ארוך טווח לילד, המענקים, ברירת המחדל וגיל הפדיון. הנוסח המשולב באתר המוסד, נבדק ' . $checked . '.' ),
			array( 'name' => 'חוק הביטוח הלאומי, פרק א: סעיף 1, הגדרת "הסכום הבסיסי"', 'url' => $yl['law_general_url'], 'text' => 'פסקה (2): בעד הילד הראשון והחמישי ואילך במניין, בעד השני, השלישי והרביעי, ולעניין הבטחת הכנסה והתוספת לפי סעיף 68(ג); העדכון ב-1 בינואר לפי המדד, וב-1.1.2025 הסכומים לא עודכנו.' ),
			array( 'name' => 'הביטוח הלאומי: סכום קצבת הילדים', 'url' => $pg['rates'], 'text' => 'מ-' . $from . ': ראשון ' . (int) $b['b2_child_first_fifth'] . ' ₪, שני עד רביעי ' . (int) $b['b2_child_second_to_fourth'] . ' ₪, חמישי ואילך ' . (int) $b['b2_child_first_fifth'] . ' ₪; ' . $sp['he'] . '; ' . $al['debt_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תנאי הזכאות ותקופת הזכאות', 'url' => $pg['period'], 'text' => $al['start_he'] . '; ' . $al['end_he'] . '; ' . $al['alive_he'] . '; ' . $al['death_he'] . '; ' . $al['abroad_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: למי משולמת הקצבה', 'url' => $pg['whom'], 'text' => $yl['payee']['he'] . '; ' . $yl['payee']['agree_he'] . '; ' . $yl['payee']['split_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: איך להגיש תביעה לקצבת ילדים', 'url' => $pg['claim'], 'text' => $yl['claim']['auto_he'] . '; ' . $yl['claim']['claim_he'] . '; ' . $yl['claim']['deadline_he'] . '; ' . $yl['claim']['adoption_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תכנית חיסכון לכל ילד, סכום החיסכון', 'url' => $sv['url'], 'text' => 'מ-' . justice_tools_he_date( $sv['from'] ) . ': ' . (int) $sv['monthly'] . ' ₪ בחודש, ועוד ' . (int) $sv['parent_add'] . ' ₪ מהקצבה בבחירת ההורים; ' . $sv['grant_old_he'] . '; ' . $sv['grant_new_he'] . '; ' . $sv['grant_21_he'] . '; ' . $sv['fees_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: פתיחת תכנית חיסכון לילד שנולד', 'url' => $sv['new_url'], 'text' => $sv['default_he'] . '; ' . $sv['report_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: משיכה של כספי החיסכון', 'url' => $sv['withdraw_url'], 'text' => $sv['withdraw_he'] . '; ' . $sv['medical_he'] . '; ' . $sv['tax_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: מענק לימודים, סכום המענק ומי זכאי', 'url' => $sg['amount_url'], 'text' => 'שנת הלימודים ' . $sg['school_year_he'] . ': ' . number_format( (float) $sg['amount'] ) . ' ₪ לכל ילד שנולד ' . justice_tools_he_date( $sg['born_from'] ) . ' עד ' . justice_tools_he_date( $sg['born_to'] ) . ', ב-' . justice_tools_he_date( $sg['pay_date'] ) . '; ' . $sg['prev']['school_year_he'] . ': ' . number_format( (float) $sg['prev']['amount'] ) . ' ₪; ' . $sg['who_he'] . '; ' . $sg['claim_he'] . '.' ),
			array( 'name' => $btl['name_he'], 'url' => $yl['history']['url'], 'text' => 'סכום בסיסי 2 לילד ' . implode( '; ', $hist ) . '; מ-' . justice_tools_he_date( $btl['from'] ) . ': ' . (int) $b['b2_child_first_fifth'] . ' / ' . (int) $b['b2_child_second_to_fourth'] . ' ₪, ולעניין הבטחת הכנסה ' . (int) $b['b2_income_support'] . ' ₪; סכום בסיסי 3: ' . number_format( (float) $b['b3'] ) . ' ₪, שממנו מענק הלימודים.' ),
		);
	}
	if ( 'havtachat-hachnasa' === $name ) {
		$hv      = $reg['rights_havtacha'];
		$btl     = $reg['rights_btl'];
		$pg      = $hv['pages'];
		$amt     = $hv['amounts'];
		$wk      = $hv['work'];
		$cr      = $hv['car'];
		$ck      = $hv['clock'];
		$checked = justice_tools_he_date( $hv['checked_on'] );
		$from    = justice_tools_he_date( $hv['from'] );
		$names   = array( 'single' => 'יחיד', 'couple' => 'זוג', 'couple1' => 'זוג וילד', 'couple2' => 'זוג ו-2 ילדים ומעלה', 'parent1' => 'הורה יחיד וילד', 'parent2' => 'הורה יחיד ו-2 ילדים ומעלה' );
		$rows    = array();
		foreach ( $names as $k => $he ) {
			$rows[] = $he . ': ' . number_format( (float) $amt['b'][ $k ] ) . ' ₪ עד ' . ( (int) $hv['age']['older_from'] - 1 ) . ', ' . number_format( (float) $amt['c'][ $k ] ) . ' ₪ מ-' . (int) $hv['age']['older_from'] . ', ' . number_format( (float) $amt['young'][ $k ] ) . ' ₪ לבני ' . (int) $hv['age']['min'] . ' עד ' . (int) $hv['age']['young_to'] . ' שמתייצבים';
		}
		$det = array();
		foreach ( $hv['determining']['rules'] as $k => $d ) {
			$det[] = $names[ $k ] . ' ' . esc_html( (string) ( $d['pct'] + $d['uplift'] ) ) . '%';
		}
		return array(
			array( 'name' => $hv['law_he'], 'url' => $hv['law_url'], 'text' => 'סעיף 2: תנאי הזכאות, תושבות ' . (int) $hv['residence']['months'] . ' חודשים רצופים (2(ב)) ובני ' . (int) $hv['age']['min'] . ' עד ' . (int) $hv['age']['young_to'] . ' (2(ה)); 3: מי שאינו זכאי (שירות סדיר, קיבוץ, תלמידים); 3א: סירוב לעבודה מתאימה; 4: זכאות בני זוג; 5: הקצבה לפי התוספת השנייה (טור ב\' עד ' . ( (int) $hv['age']['older_from'] - 1 ) . ', טור ג\' מ-' . (int) $hv['age']['older_from'] . '), קצבה פחות ההכנסה (5(ב)), ' . (int) $amt['young_law_min_pct'] . '% עד ' . (int) $amt['young_law_max_pct'] . '% לבני ' . (int) $hv['age']['min'] . ' עד ' . (int) $hv['age']['young_to'] . ' (5(ה)(3)), ותוספת ' . esc_html( (string) $hv['women']['pct'] ) . '% לאישה מגיל ' . (int) $hv['women']['from_age'] . ' (5(ז)); 6: גמלה אחת לבני זוג; 7: הסכום הקובע; 8: לא משולם סכום של פחות מ-' . (int) $hv['min_pay'] . ' ש"ח; 9 ו-9א: הכנסה, נכס ורכב; 12 ו-12א: הניכויים מהכנסה מעבודה; 14(א): תשלום מחודש התביעה; התוספת השנייה והשלישית. הנוסח המשולב באתר המוסד, נבדק ' . $checked . '.' ),
			array( 'name' => $hv['regs_he'], 'url' => $hv['regs_url'], 'text' => 'תקנה 1א: זכאות מתחת לגיל ' . (int) $hv['age']['min'] . '; תקנה 9: הסכומים הקובעים (' . implode( ', ', $det ) . ' מהשכר הממוצע, או נקודות זיכוי, הגבוה); תקנה 10: הכנסה מנכס לפי שיעור הריבית (' . esc_html( (string) $hv['assets']['interest_pct'] ) . '% מ-' . justice_tools_he_date( $hv['assets']['interest_from'] ) . ') ורכב: ' . (int) $cr['rate_pct'] . '% משווי הרכב מעל ' . number_format( (float) $cr['credit_worker'] ) . ' ₪ ("עובד") או ' . number_format( (float) $cr['credit_other'] ) . ' ₪; תקנה 10ב: רכב ששוויו עולה על ' . number_format( (float) $cr['limit'] ) . ' ₪; תקנה 12: סדר הניכויים (קודם הפנסיה).' ),
			array( 'name' => 'הביטוח הלאומי: סכום הקצבה, הבטחת הכנסה', 'url' => $amt['url'], 'text' => 'מ-' . $from . ': ' . implode( '; ', $rows ) . '. ' . $hv['women']['he'] . '. ' . $hv['deductions']['health_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: חישוב הקצבה לפי הכנסה מעבודה', 'url' => $wk['url'], 'text' => 'מ-' . $from . ': עד ' . (int) $hv['age']['older_from'] . ' לא נחשבים ' . number_format( (float) $wk['first']['b']['single'] ) . ' ₪ ליחיד ו-' . number_format( (float) $wk['first']['b']['family'] ) . ' ₪ למשפחה, ומהיתרה ' . esc_html( (string) $wk['counted_pct']['b']['single'] ) . '%, ' . esc_html( (string) $wk['counted_pct']['b']['couple1'] ) . '% או ' . esc_html( (string) $wk['counted_pct']['b']['couple2'] ) . '%; מגיל ' . (int) $hv['age']['older_from'] . ' ' . number_format( (float) $wk['first']['c']['single'] ) . ' ו-' . number_format( (float) $wk['first']['c']['family'] ) . ' ₪, ומהיתרה ' . esc_html( (string) $wk['counted_pct']['c'] ) . '%; הורה יחיד: ' . (int) $wk['parent']['low_pct'] . '% עד ' . number_format( (float) $wk['parent']['band'] ) . ' ₪ ו-' . (int) $wk['parent']['high_pct'] . '% מעליו. ' . $wk['example_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: חישוב ההכנסות והשפעתן על סכום הקצבה', 'url' => $wk['income_url'], 'text' => $hv['other_income']['he'] . '. ' . $hv['other_income']['excluded_he'] . '. ' . $cr['rule_he'] . '. ' . $hv['assets']['he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: תנאי הזכאות להבטחת הכנסה', 'url' => $pg['eligibility'], 'text' => 'תושבות, גיל ' . (int) $hv['age']['min'] . ' (בנסיבות מיוחדות ' . (int) $hv['age']['special_min'] . ', הורה בכל גיל), הכנסה, רכב, התייצבות בשירות התעסוקה ולימודים. ' . $hv['exclusions']['parent_study_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: זכאות למי שבבעלותו רכב', 'url' => $cr['url'], 'text' => $cr['over_he'] . ': ' . implode( '; ', $cr['exceptions_he'] ) . '. ' . $cr['three_months_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: רישום והתייצבות, ופטור מהתייצבות', 'url' => $hv['employment']['url'], 'text' => $hv['employment']['he'] . '. ' . $hv['employment']['fulltime_he'] . '. ' . $hv['employment']['refuse_he'] . '. קבוצות הפטור: ' . implode( ', ', $hv['employment']['groups_he'] ) . '.' ),
			array( 'name' => 'הביטוח הלאומי: איך מגישים תביעה, ותקופת הזכאות', 'url' => $ck['claim_url'], 'text' => 'טופס ' . esc_html( $hv['claim']['form'] ) . ', מקוון או ידני. ' . $ck['retro_he'] . '. ' . $ck['pay_he'] . '. ' . $ck['changes_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: שימוע למקבל הבטחת הכנסה', 'url' => $ck['hearing_url'], 'text' => $ck['hearing_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: ערעור לבית הדין לעבודה', 'url' => $ck['appeal_url'], 'text' => $ck['appeal_he'] . '.' ),
			array( 'name' => 'הביטוח הלאומי: גיל הפרישה', 'url' => $pg['retirement'], 'text' => 'גבר ' . (int) $hv['age']['men_retirement'] . '; ' . $hv['age']['women_he'] . '. ' . $hv['age']['retirement_he'] . '.' ),
			array( 'name' => $btl['name_he'], 'url' => $btl['basic_amount']['url'], 'text' => 'סכום בסיסי 3 מ-' . justice_tools_he_date( $btl['from'] ) . ': ' . number_format( (float) $btl['basic_amount']['b3'] ) . ' ₪, שממנו נגזרת הבטחת ההכנסה; נקודת הקצבה בהבטחת הכנסה (סכום בסיסי 2): ' . number_format( (float) $btl['basic_amount']['b2_income_support'] ) . ' ₪; השכר הממוצע לפי סעיף 2: ' . number_format( (float) $btl['avg_wage']['s2_benefits'] ) . ' ₪, שממנו נגזרים הניכויים והסכומים הקובעים.' ),
		);
	}
	return array();
}
