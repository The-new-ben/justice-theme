<?php
/**
 * The rights wave 2A (22.10.2026, HAD-578): the two highest-demand rights after wave 1, each on its own new page.
 *
 *   [justice_tool name="maanak-avoda"]  the work grant ("מס הכנסה שלילי"): eligibility, the 2025 amount by every rule of the
 *                                       law, the grant curve, the payment calendar and the deadline (/maanak-avoda/)
 *   [justice_tool name="sachar-neto"]   gross to net 2026: tax with every credit point, National Insurance and health,
 *                                       pension and study fund with their ceilings, overtime, a second job, the employer's
 *                                       cost, and net to gross (/net-salary-calculator/)
 * Every number is read from assets/data/justice-tools-registry.json (rights_maanak, rights_neto, and the wave-1 rights_tax
 * and rights_bituach), built by tools/justice_tools_rights_maanak.py and tools/justice_tools_rights_neto.py, or from the
 * snapshot the build renders. inc/justice-tools-rights.php merges these functions into its own (names, catalog, answer,
 * stamp, sources, numbers), so inc/justice-tools.php needs no change.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_rights2a_names(): array {
	return array( 'maanak-avoda', 'sachar-neto' );
}

/** The catalog entries, merged into justice_tools_rights_catalog(). */
function justice_tools_rights2a_catalog(): array {
	return array(
		// The work grant (jt44): every rule of the law for tax year 2025, the 2024 bands, the payment calendar (/maanak-avoda/).
		'maanak-avoda' => array(
			'name'      => 'מחשבון מענק עבודה (מס הכנסה שלילי)',
			'title'     => 'מענק עבודה: האם מגיע לכם, כמה, ומתי ישולם',
			'promise'   => 'לפי חוק מענק עבודה ומדריך רשות המסים: גיל, ילדים ופעוטות, הורה יחיד, בן/בת זוג, פנסיה, נכס נוסף ועובדת מגיל 60; הסכום לחודש ולשנה, איפה אתם על עקומת המענק, לוח התשלומים לפי מועד ההגשה והמועד האחרון.',
			'question'  => 'האם מגיע לי מענק עבודה, וכמה?',
			'page'      => '/maanak-avoda/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_maanak' ),
			'dataset'   => 'rights_maanak',
			'next_text' => 'הצעד הבא: להגיש בקשה באזור האישי ברשות המסים לפני המועד, ולהכניס ליומן את מועדי התשלום',
			'primary'   => array( 'label' => 'מועדי ההגשה והתשלום ליומן', 'act' => 'ics' ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם פקיד השומה, עם הנתונים שלכם', 'topic' => 'tax', 'purpose' => 'court_rehearsal' ),
			'more'      => array(
				array( 'label' => 'מחשבון שכר נטו 2026', 'path' => '/net-salary-calculator/' ),
				array( 'label' => 'החזר מס לשכירים', 'path' => '/guide-tax-calculator-updated-2025/' ),
				array( 'label' => 'הגשת הבקשה באתר רשות המסים', 'url' => 'https://secapp.taxes.gov.il/gmMhsBakasha/' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין מסים', 'path' => '/tax-lawyer/' ),
			'sticky'    => 'לשנה',
		),
		// Gross to net 2026 (jt45), on the wave-1 tax engine and National Insurance data (/net-salary-calculator/).
		'sachar-neto'  => array(
			'name'      => 'מחשבון שכר נטו 2026',
			'title'     => 'מחשבון שכר נטו 2026: מברוטו לנטו, שורה אחר שורה',
			'promise'   => 'מס הכנסה לפי המדרגות של 2026 וכל נקודות הזיכוי, ביטוח לאומי ובריאות, פנסיה וקרן השתלמות עם התקרות, שעות נוספות, נסיעות ומשרה שנייה; עלות המעסיק, כמה נשאר מכל העלאה, וגם מנטו לברוטו ומשכר לשעה.',
			'question'  => 'כמה נטו יישאר לי מהברוטו?',
			'page'      => '/net-salary-calculator/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'rights_btl', 'rights_tax', 'rights_bituach', 'rights_neto', 'rights_maanak', 'min_wage' ),
			'dataset'   => 'rights_neto',
			'next_text' => 'הצעד הבא: להשוות לתלוש, ואם יש פער, לתרגל את השיחה עם המעסיק לפני שמבקשים תיקון',
			'primary'   => array( 'label' => 'לתרגל את השיחה עם המעסיק, עם התלוש המחושב', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם המעסיק, עם התלוש המחושב', 'topic' => 'employment', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'מענק עבודה: בדיקת זכאות', 'path' => '/maanak-avoda/' ),
				array( 'label' => 'נקודות זיכוי', 'path' => '/nekudot-zikui/' ),
				array( 'label' => 'מחשבון דמי ביטוח לאומי', 'path' => '/national-insurance-calculator/' ),
				array( 'label' => 'תיאום מס באתר רשות המסים', 'url' => 'https://www.gov.il/he/service/tax-coordination-online' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/labor-lawyer/' ),
			'sticky'    => 'נטו',
		),
	);
}

/** The answer box (40-70 words): the direct answer, its numbers, their sections and the check date. */
function justice_tools_rights2a_answer( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	// maanak-avoda (jt44): the 2025 maxima, the age rule, the deadline and the payments, all from rights_maanak.
	if ( 'maanak-avoda' === $name && ! empty( $reg['rights_maanak'] ) ) {
		$rm   = $reg['rights_maanak'];
		$y    = $rm['years']['2025'];
		$k12  = $y['regular']['k12'];
		$k3   = $y['regular']['k3'];
		$pct  = (float) $rm['parent_pct'] / 100;
		$text = '<strong>מענק עבודה</strong> (מס הכנסה שלילי) הוא תשלום מרשות המסים לעובדים ולעצמאים בשכר נמוך: הורים מגיל <bdi>' . (int) $rm['age']['with_kids'] . '</bdi> ומי שאין לו ילדים מגיל <bdi>' . (int) $rm['age']['no_kids'] . '</bdi>. על שנת המס 2025 ההורה מקבל עד ' . justice_tools_money( $k12['max'] * $pct, 0 ) . ' לחודש (ילד אחד או שניים) או ' . justice_tools_money( $k3['max'] * $pct, 0 ) . ' (שלושה ומעלה), ועוד עד ' . justice_tools_money( $y['toddler']['max'], 0 ) . ' לכל פעוט, '
			. 'כשההכנסה החודשית הממוצעת בין ' . justice_tools_money( $k12['floor'], 0 ) . ' ל-' . justice_tools_money( $k12['published_top'], 0 ) . ' (הורה יחיד: עד ' . justice_tools_money( $y['single']['k3']['ceiling'], 0 ) . '). מגישים באזור האישי עד <bdi>' . esc_html( justice_tools_he_date( $y['deadline_online'] ) ) . '</bdi>, והכסף מגיע בתשלומים. נבדק ' . esc_html( justice_tools_he_date( $rm['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	// sachar-neto (jt45): the 2026 point, the first brackets, National Insurance + health and the pension, from the registry.
	if ( 'sachar-neto' === $name && ! empty( $reg['rights_neto'] ) && ! empty( $reg['rights_tax'] ) && ! empty( $reg['rights_bituach'] ) ) {
		$rn   = $reg['rights_neto'];
		$rt   = $reg['rights_tax'];
		$bt   = $reg['rights_bituach'];
		$yr   = $rt['years'][ (string) $rn['year'] ];
		$ew   = $bt['employee']['work'];
		$snap = justice_tools_snapshot( 'sachar-neto' );
		$text = '<strong>שכר נטו</strong> הוא הברוטו פחות מס הכנסה, ביטוח לאומי, ביטוח בריאות וההפקדות של העובד לפנסיה ולקרן השתלמות. ב-' . (int) $rn['year'] . ' מס ההכנסה מתחיל ב-<bdi>' . (int) $yr['brackets'][0][1] . '%</bdi> ועולה עד <bdi>' . (int) $yr['brackets'][ count( $yr['brackets'] ) - 1 ][1] . '%</bdi>, וכל נקודת זיכוי מורידה ' . justice_tools_money( $yr['point_month'], 0 ) . ' בחודש; ביטוח לאומי ובריאות: <bdi>' . round( $ew['bl'][0] + $ew['health'][0], 2 ) . '%</bdi> עד ' . justice_tools_money( $bt['tier']['amount'], 0 ) . ' ו-<bdi>' . round( $ew['bl'][1] + $ew['health'][1], 2 ) . '%</bdi> מעליהם; פנסיה: <bdi>' . (float) $rn['pension']['employee_pct'] . '%</bdi>. '
			. 'מ-12,000 ₪ ברוטו (אישה, בלי ילדים) נשארים כ-' . justice_tools_money( (float) ( $snap['total'] ?? 0 ), 0 ) . ' נטו. נבדק ' . esc_html( justice_tools_he_date( $rn['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '';
}

/** The data stamp in the tool's header. */
function justice_tools_rights2a_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'maanak-avoda' === $name ) {
		$rm = $reg['rights_maanak'] ?? array();
		return 'שנת המס 2025 · הגשה עד ' . justice_tools_he_date( $rm['years']['2025']['deadline_online'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $rm['checked_on'] ?? '' );
	}
	// Renders: שנת המס 2025 · הגשה עד 31.12.2027 · נבדק 21.10.2026
	if ( 'sachar-neto' === $name ) {
		$rn = $reg['rights_neto'] ?? array();
		$rt = $reg['rights_tax'] ?? array();
		return 'מדרגות ' . (int) ( $rn['year'] ?? 0 ) . ' · נקודת זיכוי ' . number_format( (float) ( $rt['years'][ (string) ( $rn['year'] ?? '' ) ]['point_month'] ?? 0 ) ) . ' ₪ · נבדק ' . justice_tools_he_date( $rn['checked_on'] ?? '' );
	}
	// Renders: מדרגות 2026 · נקודת זיכוי 242 ₪ · נבדק 21.10.2026
	return 'נבדק ' . justice_tools_he_date( justice_tools_checked_on( $name ) );
}

/** Official sources used by each instrument's result. */
function justice_tools_rights2a_sources( string $name ): array {
	$reg = justice_tools_registry();
	if ( 'maanak-avoda' === $name && ! empty( $reg['rights_maanak'] ) ) {
		$rm      = $reg['rights_maanak'];
		$y       = $rm['years']['2025'];
		$y4      = $rm['years']['2024'];
		$checked = justice_tools_he_date( $rm['checked_on'] );
		return array(
			array( 'name' => $rm['law_he'], 'url' => $rm['law_url'], 'text' => 'הנוסח העדכני, עם ' . $rm['notice_he'] . '. סעיפים 1 ו-2 (גיל, חודשי עבודה, הסכומים לפי מספר הילדים), 3 (נכס מקרקעין, 20 ₪), 4 (הכנסה נוספת), 5 (הכנסת בן הזוג), 6א (150% להורה), 6ב (הורה יחיד), 6ב1 ו-6ב2 (פעוטות), 6ה (עובדת מגיל 60), 7 (המועד), 9 עד 12 (החלטה, השגה, ערעור, תשלומים), 16 (המענק אינו הכנסה). נבדק ' . $checked . '.' ),
			array( 'name' => 'רשות המסים: מדריך מענק עבודה לשנת המס 2025', 'url' => $y['guide_url'], 'text' => $y['index_he'] . '. ' . $y['max_year_he'] . '; ' . $y['deadline_he'] . '.' ),
			array( 'name' => 'רשות המסים: מדריך מענק עבודה לשנת המס 2024', 'url' => $y4['guide_url'], 'text' => $y4['index_he'] . '. ' . $y4['inner_he'] . '. המקסימום ' . number_format( (float) $y4['max_year'] ) . ' ₪ בשנה; ' . $y4['deadline_he'] . '.' ),
			array( 'name' => 'רשות המסים: הגשת בקשה מקוונת למענק עבודה', 'url' => $rm['service_url'], 'text' => $rm['requires_he'] . '. ' . $rm['post_he'] . '.' ),
			array( 'name' => 'רשות המסים: מענק עבודה, הודעה על התשלום השני לשנת 2025', 'url' => $rm['press_sep_url'], 'text' => $y['paid_he'] . '.' ),
			array( 'name' => 'רשות המסים: הסימולטור הרשמי לחישוב מענק עבודה', 'url' => $rm['simulator_url'], 'text' => 'לשנות המס 2025 ו-2024. בסתירה בין הסימולטור לחוק, החוק גובר.' ),
		);
	}
	if ( 'sachar-neto' === $name && ! empty( $reg['rights_neto'] ) ) {
		$rn      = $reg['rights_neto'];
		$rt      = $reg['rights_tax'];
		$bt      = $reg['rights_bituach'];
		$yr      = $rt['years'][ (string) $rn['year'] ];
		$checked = justice_tools_he_date( $rn['checked_on'] );
		return array(
			array( 'name' => 'רשות המסים: לוח עזר לחישוב מס הכנסה ממשכורת ' . (int) $rn['year'], 'url' => $rn['booklet_url'], 'text' => $yr['source_he'] . '. ' . ( $yr['change_he'] ?? '' ) . '. נקודת זיכוי ' . number_format( (float) $yr['point_month'] ) . ' ₪ לחודש; תקרת הכנסה מזכה לזיכוי פנסיה ' . number_format( (float) $rn['pension_credit']['cap_month'] ) . ' ₪; תקרת תגמולי מעסיק ' . number_format( (float) $rn['employer_ceiling']['tagmulim_salary_cap'] ) . ' ₪; פיצויים ' . number_format( (float) $rn['employer_ceiling']['severance_year_cap'] ) . ' ₪ בשנה; קרן השתלמות ' . number_format( (float) $rn['study_fund']['salary_cap'] ) . ' ₪. נבדק ' . $checked . '.' ),
			array( 'name' => 'פקודת מס הכנסה', 'url' => $rn['ordinance_url'], 'text' => 'סעיף 121 (המדרגות) ו-121ב (מס יסף); 33א (נקודת זיכוי); ' . $rn['pension_credit']['section'] . '; ' . $rn['employer_ceiling']['section'] . '; ' . $rn['study_fund']['section'] . '.' ),
			array( 'name' => 'תקנות מס הכנסה (ניכוי ממשכורת ומשכר עבודה), התשנ"ג-1993', 'url' => $rn['withholding_url'], 'text' => $rn['method']['he'] . '. ' . $rn['second_job']['he'] . ' (' . $rn['second_job']['section'] . ').' ),
			array( 'name' => 'הביטוח הלאומי: שיעורי דמי ביטוח לעובדים שכירים', 'url' => $bt['employee']['url'], 'text' => $bt['employee']['rates_from_he'] . '. מדרגה מופחתת ' . number_format( (float) $bt['tier']['amount'] ) . ' ₪, הכנסה מרבית ' . number_format( (float) $bt['max']['amount'] ) . ' ₪. ' . $rn['second_job']['bl_he'] . '.' ),
			array( 'name' => 'חוק שעות עבודה ומנוחה וצו ההרחבה לקיצור שבוע העבודה', 'url' => $rn['overtime']['url'], 'text' => $rn['overtime']['he'] . ' (' . $rn['overtime']['section'] . ').' ),
			array( 'name' => 'צו ההרחבה לביטוח פנסיוני מקיף במשק', 'url' => $rn['pension']['url'], 'text' => $rn['pension']['he'] . '. ' . $rn['pension']['cap_he'] . '. ' . $rn['pension']['wait_he'] . '.' ),
			array( 'name' => 'צו ההרחבה בדבר השתתפות המעביד בהוצאות נסיעה', 'url' => $rn['travel']['url'], 'text' => $rn['travel']['he'] . '.' ),
		);
	}
	return array();
}

/** The page table of each instrument, rendered by the build from the registry. */
function justice_tools_rights2a_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}

/**
 * The result-first card ([justice_tool_lead name="maanak-avoda"]): placed as the first block of the page, right under the
 * title, so the computed example is on the first screen at 390 and 1280. It holds the server snapshot's numbers; the
 * tool's script on the same page rewrites it with the reader's own result and turns its link into a jump to the form.
 */
function justice_tools_rights2a_lead_shortcode( $atts ): string {
	$atts = shortcode_atts( array( 'name' => '' ), $atts, 'justice_tool_lead' );
	$name = sanitize_key( (string) $atts['name'] );
	// The family + land wave (HAD-579) uses the same card on its pages where the tool starts low on a phone.
	$fl = function_exists( 'justice_tools_fl_names' ) && in_array( $name, justice_tools_fl_names(), true );
	// The rights wave 2B (HAD-585) puts it on its four pages too.
	$b2 = function_exists( 'justice_tools_rights2b_names' ) && in_array( $name, justice_tools_rights2b_names(), true );
	if ( ! $fl && ! $b2 && ! in_array( $name, justice_tools_rights2a_names(), true ) ) {
		return '';
	}
	$snap = justice_tools_snapshot( $name );
	if ( empty( $snap['lead'] ) ) {
		return '';
	}
	justice_tools_enqueue( $name );
	return '<div class="jtool-page jtool-lead" data-jtool-lead="' . esc_attr( $name ) . '" id="jtool-' . esc_attr( $name ) . '-lead">' . $snap['lead'] . '</div>';
}
add_shortcode( 'justice_tool_lead', 'justice_tools_rights2a_lead_shortcode' );
