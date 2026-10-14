<?php
/**
 * Family-law tools (HAD-506): child support after בע"מ 919/15 (with CPI linkage and the National Insurance fallback),
 * property balancing, the prenup draft generator and the divorce-agreement + parenting-plan generator.
 *
 * Shortcodes (no page is created here; placing them is an editor step, after the theme release):
 *   [justice_tool name="mezonot"]                       /child-support/
 *   [justice_tool name="mezonot" mode="madad"]          /tzmidut-mezonot/ (new page, CPI linkage of support)
 *   [justice_tool name="izun"]                          /resource-balancing/
 *   [justice_tool name="izun" mode="hon"]               /rsu-options-crypto/ (new page, options, RSU and crypto)
 *   [justice_tool name="heskem-mamon"]                  /prenuptial-agreement/
 *   [justice_tool name="heskem-gerushin"]               /divorce-agreement/
 *   [justice_tool name="heskem-gerushin" mode="horut"]  /parenting-time-arrangements/
 *   [justice_tool_section name="mezonot" part="nii"]    the National Insurance table (/bituach-leumi-alimony/)
 *   [justice_tool_section name="mezonot" part="needs"]  the needs courts set, with the judgments
 * Every number is read from assets/data/justice-tools-registry.json (datasets child_support, property_balance, prenup,
 * divorce_agreement, built by tools/justice_tools_family.py) or from the snapshot the build renders from it.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The answer box (40-60 words): the direct answer, its number, its date and its source. */
function justice_tools_family_answer( string $name, string $mode = '' ): string {
	$reg     = justice_tools_registry();
	$checked = 'נבדק ' . esc_html( justice_tools_he_date( justice_tools_checked_on( $name ) ) ) . '.';
	$text    = '';
	if ( 'mezonot' === $name && ! empty( $reg['child_support'] ) ) {
		$cs = $reg['child_support'];
		if ( 'madad' === $mode && ! empty( $reg['cpi'] ) ) {
			$latest = (string) $reg['cpi']['latest_month'];
			$value  = '';
			foreach ( $reg['cpi']['series'] as $row ) {
				if ( $row[0] === $latest ) {
					$value = (string) $row[1];
				}
			}
			$text = '<strong>מזונות צמודים למדד</strong> מתעדכנים לפי מדד המחירים לצרכן, בתדירות שקבע פסק הדין: כל שלושה חודשים בפסקי דין רבים, פעם בחצי שנה או פעם בשנה באחרים. '
				. 'מכפילים את הסכום במדד הידוע ביום העדכון וחולקים במדד הידוע ביום פסק הדין. '
				. 'המדד האחרון שפורסם: ' . esc_html( justice_tools_he_month( $latest ) ) . ', <bdi>' . esc_html( $value ) . '</bdi> נקודות (הלמ"ס). ' . $checked;
		} else {
			$min   = PHP_INT_MAX;
			$max   = 0;
			$years = array();
			foreach ( $cs['needs']['cases'] as $c ) {
				$min     = min( $min, (int) $c['total'] );
				$max     = max( $max, (int) $c['total'] );
				$years[] = (int) substr( (string) $c['date'], 0, 4 );
			}
			$pct  = $cs['housing']['default_pct'];
			$text = '<strong>מזונות ילדים</strong> לפי בע"מ 919/15: מגיל 6 שני ההורים משלמים לפי יחס ההכנסות וחלוקת הלילות; עד גיל 6 אב יהודי נושא לבדו בצרכים ההכרחיים, '
				. 'שהעליון תיאר בכ-1,300 עד 1,400 ש"ח לילד, ועוד <bdi>' . (int) $pct[1] . '%</bdi> מהדיור לילד אחד או <bdi>' . (int) $pct[2] . '%</bdi> לשניים. '
				. 'בפסקי דין מ-' . min( $years ) . ' עד ' . max( $years ) . ' נקבעו ' . justice_tools_money( $min, 0 ) . ' עד ' . justice_tools_money( $max, 0 ) . ' לילד בלי מדור. ' . $checked;
		}
	}
	if ( 'izun' === $name && ! empty( $reg['property_balance'] ) ) {
		$pb = $reg['property_balance'];
		if ( 'hon' === $mode ) {
			$text = '<strong>אופציות ו-RSU בגירושין</strong>: אין נוסחה בחוק. בית המשפט לענייני משפחה בבאר שבע חילק אופציות שהוענקו בנישואין גם כשהבשילו אחרי מועד הקרע, '
				. 'לפי החלק מתקופת ההבשלה שעבר בנישואין ולפי השווי במימוש (תלה"מ 16405-09-19). לקריפטו לא מצאנו פסק דין שפורסם: לפי החוק השווי במועד האיזון, '
				. 'או מועד מוקדם שבית המשפט קובע (סעיף 8(3)). ' . $checked;
		} else {
			$text = '<strong>איזון משאבים</strong>: כל אחד מבני הזוג זכאי למחצית שווי הנכסים שנצברו בנישואין, כולל פנסיה, פיצויים וקרן השתלמות (סעיף 5 לחוק יחסי ממון). '
				. 'לא מתאזנים נכסים מלפני הנישואין, מתנות וירושות. מי שצבר יותר משלם לשני מחצית ההפרש, אחרי ניכוי החובות (סעיף 6). '
				. 'אפשר לבקש איזון שנה אחרי פתיחת ההליך או אחרי <bdi>' . (int) $pb['early']['apart_months'] . '</bdi> חודשי פירוד (סעיף 5א). ' . $checked;
		}
	}
	if ( 'heskem-mamon' === $name && ! empty( $reg['prenup'] ) ) {
		$r    = $reg['prenup']['routes'];
		$text = '<strong>הסכם ממון</strong> חייב להיות בכתב ולקבל אישור של בית המשפט לענייני משפחה או בית הדין הרבני (סעיפים 1-2 לחוק יחסי ממון). '
			. 'לפני החתונה אפשר אימות של נוטריון, ' . justice_tools_money( $r['notary']['fee'], 0 ) . ' ועוד מע"מ, או של רושם הנישואין. '
			. 'אחרי החתונה רק בית המשפט (אגרה ' . justice_tools_money( $r['court']['fee'], 0 ) . ') או בית הדין (' . justice_tools_money( $r['rabbinical']['fee'], 0 ) . '). '
			. 'הסכם ממון לא קובע מזונות ילדים. ' . $checked;
	}
	if ( 'heskem-gerushin' === $name && ! empty( $reg['divorce_agreement'] ) ) {
		$da = $reg['divorce_agreement'];
		if ( 'horut' === $mode ) {
			$text = '<strong>הסדרי שהות</strong> נקבעים בהסכם בין ההורים, שבית המשפט מאשר רק אם הוא לטובת הילד (סעיף 24 ל' . esc_html( $da['capacity_he'] ) . '). '
				. 'בלי הסכם בית המשפט מחליט לפי טובת הילד, וילדים עד גיל 6 יהיו אצל אמם אם אין סיבות מיוחדות (סעיף 25). '
				. 'אין בחוק נוסחה: נפוצים סופי שבוע לסירוגין עם לינה באמצע השבוע, או חלוקה שווה. ' . $checked;
		} else {
			$text = '<strong>הסכם גירושין</strong> מקבל תוקף של פסק דין באישור בית המשפט לענייני משפחה (אגרה ' . justice_tools_money( $da['routes']['family']['fee'], 0 ) . ') '
				. 'או בית הדין הרבני (' . justice_tools_money( $da['routes']['rabbinical']['fee'], 0 ) . '). ההסדרים לילדים מאושרים רק אם הם לטובתם (סעיף 24 לחוק הכשרות), '
				. 'והילד לא כבול בהסכם על מזונותיו כשטובתו לא נבחנה (בע"מ 919/15, פסקה 83). לפני אישור הסכם לא צריך בקשה ליישוב סכסוך. ' . $checked;
		}
	}
	return '' === $text ? '' : '<div class="jtool-answer"><p>' . $text . '</p></div>';
}

/** The data stamp in the tool's header. */
function justice_tools_family_stamp( string $name, string $mode = '' ): string {
	$reg     = justice_tools_registry();
	$checked = 'נבדק ' . justice_tools_he_date( justice_tools_checked_on( $name ) );
	if ( 'mezonot' === $name ) {
		return 'madad' === $mode
			? 'מדד ' . justice_tools_he_month( (string) ( $reg['cpi']['latest_month'] ?? '' ) ) . ' · ' . $checked
			: 'בע"מ 919/15 · ביטוח לאומי מ-' . justice_tools_he_date( (string) ( $reg['child_support']['nii']['from'] ?? '' ) ) . ' · ' . $checked;
	}
	if ( 'izun' === $name ) {
		return 'חוק יחסי ממון ופסיקת העליון · ' . $checked;
	}
	if ( 'heskem-mamon' === $name ) {
		return 'נוטריון ' . number_format( (float) ( $reg['prenup']['routes']['notary']['fee'] ?? 0 ) ) . ' ₪ + מע"מ מ-' . justice_tools_he_date( (string) ( $reg['prenup']['routes']['notary']['fee_from'] ?? '' ) ) . ' · ' . $checked;
	}
	return 'סעיפים 24-25 לחוק הכשרות · אגרות בית המשפט ובית הדין · ' . $checked;
}

/** Official sources used by each family tool. */
function justice_tools_family_sources( string $name ): array {
	$reg = justice_tools_registry();
	if ( 'mezonot' === $name ) {
		$cs  = $reg['child_support'];
		$out = array(
			array( 'name' => $cs['ruling']['he'] . ' (' . justice_tools_he_date( $cs['ruling']['date'] ) . ')', 'url' => $cs['ruling']['url'], 'text' => 'ההכרעה: גילאי 6-15; חוות דעת השופט פוגלמן, פסקאות 13-14 (עד גיל 6), 20 ו-29(ד) (15-18), 22 (צרכים הכרחיים ומדור), 59-60 (הוצאות תלויות שהות), 83 (הילד לא כבול); חוות דעת השופטת ברק-ארז, פסקאות 53, 55 ו-61.' ),
			array( 'name' => $cs['law']['he'], 'url' => $cs['law']['url'], 'text' => 'סעיפים 1, 3, 3א, 10, 11, 12(א) ו-13, בנוסח עדכני ל-' . justice_tools_he_date( $cs['law']['current_to'] ) . '.' ),
			array( 'name' => $cs['methods']['ratio']['source_he'], 'url' => $cs['methods']['ratio']['url'], 'text' => 'שיטת היחסים. עותק שפורסם, לא במאגר הרשמי.' ),
		);
		foreach ( $cs['needs']['cases'] as $c ) {
			$out[] = array( 'name' => $c['he'] . ' (' . justice_tools_he_date( $c['date'] ) . ')', 'url' => $c['url'], 'text' => 'צרכים ' . number_format( (float) $c['total'] ) . ' ₪ לילד בלי מדור' . ( '' !== (string) $c['housing_he'] ? '; מדור ' . $c['housing_he'] : '' ) . '.' );
		}
		$out[] = array( 'name' => $cs['service']['source_he'], 'url' => $cs['service']['url'], 'text' => 'שליש בתקופת שירות חובה, מגיל 18 או סיום התיכון.' );
		foreach ( $cs['indexation']['sources'] as $s ) {
			$out[] = array( 'name' => $s['he'], 'url' => $s['url'], 'text' => 'הצמדה למדד ותדירות העדכון.' );
		}
		$out[] = array( 'name' => $cs['deadlines']['appeal_source_he'], 'url' => $cs['deadlines']['appeal_url'], 'text' => 'ערעור תוך ' . (int) $cs['deadlines']['appeal_days'] . ' ימים (תקנה 45).' );
		$out[] = array( 'name' => 'בית הדין הרבני הגדול, תיק 1163727/2 (25.5.2022)', 'url' => $cs['rabbinical_url'], 'text' => 'בע"מ 919/15 אינו מחייב את בתי הדין הרבניים.' );
		$out[] = array( 'name' => $cs['nii']['he'], 'url' => $cs['nii']['law_url'], 'text' => 'סעיף 3: הסכום שבפסק הדין או שבתקנות, הנמוך מביניהם.' );
		foreach ( $cs['nii']['sources'] as $s ) {
			$out[] = array( 'name' => $s['he'], 'url' => $s['url'], 'text' => 'נבדק ' . justice_tools_he_date( $cs['checked_on'] ) . '.' );
		}
		return $out;
	}
	if ( 'izun' === $name ) {
		$pb  = $reg['property_balance'];
		$out = array(
			array( 'name' => $pb['law_he'], 'url' => $pb['law_url'], 'text' => 'סעיפים 3, 5, 5א, 6, 6א, 7, 8, 9, 11 ו-14, בנוסח עדכני ל-' . justice_tools_he_date( $pb['law_current_to'] ) . '.' ),
			array( 'name' => $pb['pension_split']['law_he'], 'url' => $pb['pension_split']['url'], 'text' => 'סעיפים 2, 3(2), 4, 6: חשבון נפרד, עד מחצית היתרה במועד הפירוד, העברה ' . (int) $pb['pension_split']['transfer_days'] . ' ימים אחרי ההודעה.' ),
			array( 'name' => $pb['pension_split']['regs_he'], 'url' => $pb['pension_split']['regs_url'], 'text' => 'תקנות 2-6: פסק הדין, צילום תעודת זהות, קליטה ורישום הערה.' ),
		);
		foreach ( $pb['cases'] as $c ) {
			$out[] = array( 'name' => $c['he'] . ' (' . justice_tools_he_date( $c['date'] ) . ')', 'url' => $c['url'], 'text' => $c['para_he'] . ': ' . $c['holding_he'] . '.' );
		}
		return $out;
	}
	if ( 'heskem-mamon' === $name ) {
		$pn = $reg['prenup'];
		return array(
			array( 'name' => $pn['law_he'], 'url' => $pn['law_url'], 'text' => 'סעיפים 1, 2(א)-(ג1), 3(א), 5(א)(3), 5(ב) ו-15.' ),
			array( 'name' => $pn['routes']['notary']['fee_he'], 'url' => $pn['routes']['notary']['fee_url'], 'text' => 'פרט 11(א): ' . number_format( (float) $pn['routes']['notary']['fee'] ) . ' ₪ לאימות; פרט 11(ב): ' . number_format( (float) $pn['routes']['notary']['fee_copy'] ) . ' ₪ לכל עותק נוסף; ועוד מע"מ ' . (int) $pn['vat']['pct'] . '%. בנוסח מ-' . justice_tools_he_date( $pn['routes']['notary']['fee_from'] ) . '.' ),
			array( 'name' => $pn['routes']['court']['fee_he'], 'url' => $pn['routes']['court']['fee_url'], 'text' => 'פרט 6א: ' . number_format( (float) $pn['routes']['court']['fee'] ) . ' ₪ לאישור הסכם בין בני זוג.' ),
			array( 'name' => $pn['routes']['rabbinical']['fee_he'], 'url' => $pn['routes']['rabbinical']['fee_url'], 'text' => 'פרט 4(2): ' . number_format( (float) $pn['routes']['rabbinical']['fee'] ) . ' ₪.' ),
			array( 'name' => $pn['procedure']['he'], 'url' => $pn['procedure']['url'], 'text' => 'סעיף 89: אימות בידי רושם הנישואין, ולא אחרי הנישואין.' ),
			array( 'name' => $pn['maint_law']['he'], 'url' => $pn['maint_law']['url'], 'text' => 'סעיף 12(א): הסכם על מזונות קטין לא קושר אותו בלי אישור בית המשפט.' ),
			array( 'name' => 'בית המשפט העליון, בע"מ 5620/24 (30.6.2025)', 'url' => justice_tools_family_case_url( $pn['cases'], '5620_24' ), 'text' => 'פסקאות 20 ו-28: החוק חל על נשואים; הסכם שלא אושר אבל נהגו לפיו.' ),
		);
	}
	$da = $reg['divorce_agreement'];
	return array(
		array( 'name' => $da['capacity_he'], 'url' => $da['capacity_url'], 'text' => 'סעיפים 24-25, בנוסח עדכני ל-19.1.2026.' ),
		array( 'name' => $da['maint_law']['he'], 'url' => $da['maint_law']['url'], 'text' => 'סעיף 12(א).' ),
		array( 'name' => 'בית המשפט העליון, בע"מ 919/15 (19.7.2017)', 'url' => justice_tools_family_case_url( $da['cases'], '919_15' ), 'text' => 'פסקאות 83 ו-140: הילד לא כבול בהסכם הוריו כשטובתו לא נבחנה.' ),
		array( 'name' => $da['prop_law']['he'], 'url' => $da['prop_law']['url'], 'text' => 'סעיפים 2(ד) ו-6(ב).' ),
		array( 'name' => $da['pension_law']['he'], 'url' => $da['pension_law']['url'], 'text' => 'חלוקת הפנסיה דרך הקופה.' ),
		array( 'name' => 'החוק להסדר התדיינויות בסכסוכי משפחה, התשע"ה-2014', 'url' => $da['disputes_url'], 'text' => 'סעיף 2: בקשה לאישור הסכם אינה תובענה.' ),
		array( 'name' => $da['routes']['family']['fee_he'], 'url' => $da['routes']['family']['fee_url'], 'text' => 'פרט 6א: ' . number_format( (float) $da['routes']['family']['fee'] ) . ' ₪.' ),
		array( 'name' => $da['routes']['rabbinical']['fee_he'], 'url' => $da['routes']['rabbinical']['fee_url'], 'text' => 'פרט 4(2): ' . number_format( (float) $da['routes']['rabbinical']['fee'] ) . ' ₪.' ),
		array( 'name' => 'gov.il: אישור הסכם בין בני זוג', 'url' => $da['routes']['family']['svc_url'], 'text' => 'מה מגישים: טופס 3 (הרצאת פרטים), עותק אחד, אגרה.' ),
		array( 'name' => 'gov.il: גירושין בהסכמה בבית הדין הרבני', 'url' => $da['routes']['rabbinical']['svc_url'], 'text' => 'דיון בנוכחות שני בני הזוג.' ),
	);
}

/** The URL of a case in a registry case list, by its key. */
function justice_tools_family_case_url( array $cases, string $key ): string {
	foreach ( $cases as $c ) {
		if ( isset( $c['key'] ) && $key === $c['key'] ) {
			return (string) $c['url'];
		}
	}
	return '';
}

/** The current rules and numbers of each family tool, rendered by the build from the registry. */
function justice_tools_family_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['numbers'] ) ? (string) $snap['numbers'] : '';
}

function justice_tools_family_nii_html(): string {
	$snap = justice_tools_snapshot( 'mezonot' );
	return isset( $snap['nii_table'] ) ? (string) $snap['nii_table'] : '';
}

function justice_tools_family_needs_html(): string {
	$snap = justice_tools_snapshot( 'mezonot' );
	return isset( $snap['needs_table'] ) ? (string) $snap['needs_table'] : '';
}
