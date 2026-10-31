<?php
/**
 * The divorce world's two newer instruments on /divorce-lawyer/ (HAD-616, Ben 31.10.2026):
 *
 *   [justice_tool name="bchirat-orech-din"]  "בחירת עורך דין גירושין": six answers, the profile of the lawyer the reader
 *                                             needs, the questions for the first meeting, the warning signs, the route
 *                                             in the divorce calculator and the directory's family lawyers by city
 *                                             (reg.fl_bchira, tools/justice_tools_fl_bchira.py); it ranks no one
 *   [justice_tool name="netunei-gerushin"]   "נתוני גירושין בישראל": seventy years of the official series by community,
 *                                             six measures, one year against another, the breakdowns (age, city,
 *                                             district, the rabbinical courts' claims) and the rabbinical courts'
 *                                             counts by year (reg.fl_netunim, tools/justice_tools_fl_netunim.py)
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_dguide_names(): array {
	return array( 'bchirat-orech-din', 'netunei-gerushin' );
}

/** The catalog entries, merged into justice_tools_catalog(). */
function justice_tools_dguide_catalog(): array {
	return array(
		// Bundle: 'bchirat-orech-din' => array( 'instrument.js', 'bchira-ui.js' ).
		'bchirat-orech-din' => array(
			'name'      => 'בחירת עורך דין גירושין',
			'title'     => 'איזה עורך דין גירושין מתאים לכם: שש שאלות, פרופיל אחד',
			'promise'   => 'איפה זה עומד, מה פתוח ביניכם, מה דחוף ובאיזו ערכאה: הכלי מתאר את עורך הדין שאתם צריכים, נותן את השאלות לפגישה הראשונה ואת הדגלים האדומים, מחבר למחשבון הגירושין ומציג את עורכי הדין לדיני משפחה במדריך לפי עיר.',
			'question'  => 'איזה עורך דין גירושין מתאים למצב שלי?',
			'page'      => '/divorce-lawyer/',
			'category'  => 'UtilitiesApplication',
			'data'      => array( 'registry_version', 'fl_bchira' ),
			'dataset'   => 'fl_bchira',
			'next_text' => 'הצעד הבא: לקבוע פגישת ייעוץ עם שניים או שלושה עורכי דין שמתאימים לפרופיל, ולשאול את אותן שאלות',
			'primary'   => array( 'label' => 'למדריך עורכי הדין לדיני משפחה', 'path' => '/lawyers/?area=family-law' ),
			'rehearse'  => array( 'label' => 'לתרגל את הפגישה הראשונה עם עורך הדין', 'topic' => 'divorce', 'purpose' => 'consult' ),
			'more'      => array(
				array( 'label' => 'מחשבון גירושין ומחירון גירושין', 'path' => '/divorce-lawyer/#machshevon-gerushin' ),
				array( 'label' => 'כללי האתיקה של עורכי הדין', 'url' => 'https://www.nevo.co.il/law_html/law00/4415.htm' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין גירושין במדריך', 'path' => '/lawyers/?area=family-law' ),
			'sticky'    => 'המצב שלכם',
		),
		// Bundle: 'netunei-gerushin' => array( 'instrument.js', 'netunim-ui.js' ).
		'netunei-gerushin'  => array(
			'name'      => 'נתוני גירושין בישראל',
			'title'     => 'נתוני גירושין בישראל: כמה מתגרשים, לפי שנה, עדה וגיל',
			'promise'   => 'כל השנים מאז 1955 לפי הלשכה המרכזית לסטטיסטיקה: זוגות שהתגרשו, שיעור לכל 1,000 תושבים ולכל 1,000 נשואים, גירושין מול חתונות והגיל בגירושין, לפי עדה; שנה מול שנה, פילוח לפי גיל, עיר ומחוז, ומה קורה לתביעות בבית הדין הרבני. כל מספר עם הלוח שלו.',
			'question'  => 'כמה זוגות מתגרשים בישראל בשנה?',
			'page'      => '/divorce-lawyer/',
			'category'  => 'ReferenceApplication',
			'data'      => array( 'registry_version', 'fl_netunim' ),
			'dataset'   => 'fl_netunim',
			'next_text' => 'הצעד הבא: לבדוק מה המסלול שלכם עולה, במחשבון הגירושין שבעמוד',
			'primary'   => array( 'label' => 'למחשבון הגירושין', 'path' => '/divorce-lawyer/#machshevon-gerushin' ),
			'rehearse'  => array( 'label' => 'לתרגל שיחת גישור על הגירושין', 'topic' => 'divorce', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'הלשכה המרכזית לסטטיסטיקה: השנתון הסטטיסטי 2026, פרק 2', 'url' => 'https://www.cbs.gov.il/he/publications/DocLib/2026/2.ShnatonPopulation/st02_20.xlsx' ),
				array( 'label' => 'סרבנות גט: מה עושים', 'path' => '/refusal-of-get/' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין גירושין במדריך', 'path' => '/lawyers/?area=family-law' ),
			'sticky'    => 'זוגות שהתגרשו',
			'sticky_kind' => 'count',
		),
	);
}

/** The answer box: the example's profile, from the snapshot (the same engine the page runs). */
function justice_tools_dguide_answer( string $name, string $mode = '' ): string {
	$reg  = justice_tools_registry();
	$snap = justice_tools_snapshot( $name );
	if ( 'bchirat-orech-din' === $name && ! empty( $reg['fl_bchira'] ) && ! empty( $snap['answer'] ) ) {
		$a = $snap['answer'];
		return '<div class="jtool-answer"><p><strong>בחירת עורך דין גירושין</strong> מתחילה במצב שלכם, לא בשם של משרד. לדוגמה, כשמסכימים על רוב הדברים ויש ילדים ודירה: '
			. esc_html( $a['profile'] ) . ' הכלי נותן ' . (int) $a['ask_n'] . ' שאלות לפגישה הראשונה ו-' . (int) $a['flags_n'] . ' דגלים אדומים. '
			. 'נבדק ' . esc_html( justice_tools_he_date( $reg['fl_bchira']['checked_on'] ) ) . ' על ידי הצוות המשפטי של Justice.</p></div>';
	}
	if ( 'netunei-gerushin' === $name && ! empty( $reg['fl_netunim'] ) && ! empty( $snap['answer'] ) ) {
		$a = $snap['answer'];
		return '<div class="jtool-answer"><p><strong>נתוני גירושין בישראל:</strong> בשנת ' . (int) $a['year'] . ' התגרשו בישראל ' . justice_tools_money( $a['count'], 0 ) . ' זוגות, הגבוה ביותר מאז 1955 (השיא הקודם: ' . justice_tools_money( $a['peak_prev']['value'], 0 ) . ' ב-' . (int) $a['peak_prev']['year'] . '), מול ' . justice_tools_money( $a['marriages'], 0 ) . ' חתונות. '
			. 'זה <bdi>' . esc_html( (string) $a['rate'] ) . '</bdi> לכל 1,000 תושבים ו-<bdi>' . esc_html( (string) $a['married'] ) . '</bdi> לכל 1,000 נשואים, לפי הלשכה המרכזית לסטטיסטיקה. '
			. 'בבתי הדין הרבניים התגרשו ב-' . (int) $a['rb_year']['year'] . ' ' . justice_tools_money( $a['rb_year']['couples'], 0 ) . ' זוגות. נבדק ' . esc_html( justice_tools_he_date( $reg['fl_netunim']['checked_on'] ) ) . ' על ידי הצוות המשפטי של Justice.</p></div>';
	}
	return '';
}

/** The data stamp in the tool's header. */
function justice_tools_dguide_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'bchirat-orech-din' === $name ) {
		return 'לפי הטבלה שבעמוד וכללי האתיקה · נבדק ' . justice_tools_he_date( (string) ( $reg['fl_bchira']['checked_on'] ?? '' ) );
	}
	if ( 'netunei-gerushin' === $name ) {
		return 'הלמ"ס, השנתון הסטטיסטי 2026 · בתי הדין הרבניים · נבדק ' . justice_tools_he_date( (string) ( $reg['fl_netunim']['checked_on'] ?? '' ) );
	}
	return '';
}

/** Sources, as the registry holds them. */
function justice_tools_dguide_sources( string $name ): array {
	$reg = justice_tools_registry();
	$key = 'bchirat-orech-din' === $name ? 'fl_bchira' : ( 'netunei-gerushin' === $name ? 'fl_netunim' : '' );
	$out = array();
	foreach ( ( $reg[ $key ]['sources'] ?? array() ) as $s ) {
		$out[] = array( 'name' => $s['name_he'], 'url' => $s['url'], 'text' => $s['text_he'] ?? ( 'פורסם ' . $s['published'] . '.' ) );
	}
	return $out;
}

/** The numbers part: the chooser has none. */
function justice_tools_dguide_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}
