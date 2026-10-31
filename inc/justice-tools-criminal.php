<?php
/**
 * The criminal hub's first two instruments on /criminal-defense-attorney/ (HAD-651, the criminal hub plan HAD-650):
 *
 *   [justice_tool name="bchirat-orech-din-plili"]  "בחירת עורך דין פלילי": five answers (stage, offence, court district,
 *                                                   urgency, budget), the guide of the criminal pyramid for that stage
 *                                                   and offence, the profile of the lawyer the reader needs, the urgent
 *                                                   step under arrest, the questions for the first meeting, the warning
 *                                                   signs, the fee range of the stage and the directory's criminal
 *                                                   lawyers (reg.fl_plili, tools/justice_tools_fl_plili.py); it ranks no one
 *   [justice_tool name="sachar-orech-din-plili"]   "שכר טרחה של עורך דין פלילי לפי שלב": one row per stage, the published
 *                                                   market range with its sources, the Israel Bar's recommended minimum
 *                                                   and the public defender (reg.fl_plili_sachar,
 *                                                   tools/justice_tools_fl_plili_sachar.py)
 *   [justice_tool name="onshei-averot"]            "עבירות פליליות ועונשן המרבי": section, maximum, court, by family
 *                                                   (reg.fl_plili_onashim, tools/justice_tools_fl_plili_onashim.py)
 *   [justice_tool name="halich-plili"]             "ההליך הפלילי שלב אחרי שלב": seven steps, three facts each with the
 *                                                   section, the guide of each step (reg.fl_plili_halich)
 *   [justice_tool name="zchuyot-chashud"]          "הזכויות שלכם בחקירה ובמעצר": the rights card, printable
 *                                                   (reg.fl_plili_halich.rights, tools/justice_tools_fl_plili_halich.py)
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_crim_names(): array {
	return array( 'bchirat-orech-din-plili', 'sachar-orech-din-plili', 'onshei-averot', 'halich-plili', 'zchuyot-chashud' );
}

/** The catalog entries, merged into justice_tools_catalog(). */
function justice_tools_crim_catalog(): array {
	return array(
		// Bundle: 'bchirat-orech-din-plili' => array( 'instrument.js', 'plili-ui.js' ).
		'bchirat-orech-din-plili' => array(
			'name'      => 'בחירת עורך דין פלילי',
			'title'     => 'איזה עורך דין פלילי מתאים לכם: חמש שאלות, תשובה אחת',
			'promise'   => 'באיזה שלב אתם, במה החשד, באיזה מחוז, כמה דחוף ומה התקציב: הכלי מתאר את עורך הדין הפלילי שאתם צריכים, מוביל למדריך של השלב ושל העבירה, נותן את השאלות לפגישה הראשונה, את הדגלים האדומים ואת טווח שכר הטרחה, ומציג את עורכי הדין הפליליים במדריך.',
			'question'  => 'איזה עורך דין פלילי מתאים למצב שלי?',
			'page'      => '/criminal-defense-attorney/',
			'category'  => 'UtilitiesApplication',
			'data'      => array( 'registry_version', 'fl_plili', 'fl_plili_sachar' ),
			'dataset'   => 'fl_plili',
			'next_text' => 'הצעד הבא: לפגוש שניים או שלושה עורכי דין שמתאימים לפרופיל, ולשאול את אותן שאלות',
			'primary'   => array( 'label' => 'לעורכי הדין הפליליים במדריך', 'path' => '/lawyers/?area=criminal-law' ),
			'rehearse'  => array( 'label' => 'לתרגל חקירה באזהרה מול חוקר', 'topic' => 'criminal-law', 'purpose' => 'police_interrogation' ),
			'more'      => array(
				array( 'label' => 'זכויות חשוד בחקירה במשטרה', 'path' => '/police-investigation-rights/' ),
				array( 'label' => 'עורך דין מעצרים', 'path' => '/arrest-detention-lawyer-israel/' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין פלילי במדריך', 'path' => '/lawyers/?area=criminal-law' ),
			'sticky'    => 'המצב שלכם',
		),
		// Bundle: 'sachar-orech-din-plili' => array( 'instrument.js', 'sachar-plili-ui.js' ).
		'sachar-orech-din-plili'  => array(
			'name'      => 'שכר טרחה של עורך דין פלילי',
			'title'     => 'כמה עולה עורך דין פלילי: שכר טרחה לפי שלב',
			'promise'   => 'ייעוץ לפני חקירה, ליווי לחקירה, דיון מעצר, שימוע, משפט בשלום ובמחוזי, ערעור ומחיקת רישום: הטווח שמשרדים מפרסמים, המינימום שבתעריף לשכת עורכי הדין, מה כלול בכל שלב ומתי מגיע סנגור ציבורי. מקור ותאריך לכל שורה.',
			'question'  => 'כמה עולה עורך דין פלילי?',
			'page'      => '/criminal-defense-attorney/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'fl_plili_sachar' ),
			'dataset'   => 'fl_plili_sachar',
			'next_text' => 'הצעד הבא: לבקש מכל עורך דין הצעת מחיר בכתב לפי שלבים, ולהשוות אותה לשורה בטבלה',
			'primary'   => array( 'label' => 'מחיר עורך דין פלילי: המדריך', 'path' => '/criminal-law-price-list-lawyer-recommended-review-costs/' ),
			'rehearse'  => array( 'label' => 'לתרגל חקירה באזהרה מול חוקר', 'topic' => 'criminal-law', 'purpose' => 'police_interrogation' ),
			'more'      => array(
				array( 'label' => 'תעריף לשכת עורכי הדין', 'path' => '/lawyer-fees-tariff/' ),
				array( 'label' => 'זכאות לסנגוריה ציבורית', 'path' => '/eligibility-public-defender-income/' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין פלילי במדריך', 'path' => '/lawyers/?area=criminal-law' ),
			'sticky'    => 'טווח השלב',
			'sticky_kind' => 'money',
		),
		// Bundle: 'onshei-averot' => array( 'instrument.js', 'onashim-ui.js' ).
		'onshei-averot'           => array(
			'name'      => 'עבירות פליליות ועונשן',
			'title'     => 'עבירות פליליות ועונשן המרבי: הסעיף, העונש ובית המשפט',
			'promise'   => 'סמים, אלימות ואיומים, עבירות מין, מרמה והלבנת הון, מס, תעבורה ומחשבים: הסעיף, העונש המרבי כפי שהוא כתוב בחוק, ואיזה בית משפט דן בעבירה. כל שורה נבדקה בנוסח החוק.',
			'question'  => 'מה העונש המרבי על עבירה פלילית?',
			'page'      => '/criminal-defense-attorney/',
			'category'  => 'ReferenceApplication',
			'data'      => array( 'registry_version', 'fl_plili_onashim' ),
			'dataset'   => 'fl_plili_onashim',
			'next_text' => 'הצעד הבא: לבדוק עם עורך דין פלילי מה העונש הצפוי בנסיבות שלכם',
			'primary'   => array( 'label' => 'סוגי עבירות פליליות ועונשיהן', 'path' => '/criminal-offenses-lawyer-criminal-sentencing-process-arrest/' ),
			'rehearse'  => array( 'label' => 'לתרגל חקירה באזהרה מול חוקר', 'topic' => 'criminal-law', 'purpose' => 'police_interrogation' ),
			'more'      => array(
				array( 'label' => 'חוק העונשין', 'url' => 'https://he.wikisource.org/wiki/%D7%97%D7%95%D7%A7_%D7%94%D7%A2%D7%95%D7%A0%D7%A9%D7%99%D7%9F' ),
				array( 'label' => 'עבירות סמים', 'path' => '/drug-related-crime/' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין פלילי במדריך', 'path' => '/lawyers/?area=criminal-law' ),
			'sticky'    => 'עבירות בטבלה',
			'sticky_kind' => 'count',
		),
		// Bundle: 'halich-plili' => array( 'instrument.js', 'halich-ui.js' ).
		'halich-plili'            => array(
			'name'      => 'ההליך הפלילי שלב אחרי שלב',
			'title'     => 'ההליך הפלילי שלב אחרי שלב: מזימון לחקירה ועד מחיקת רישום',
			'promise'   => 'חקירה, מעצר, שימוע, כתב אישום, משפט או הסדר, ערעור ומחיקת רישום: בחרו איפה אתם, וקבלו לכל שלב שלוש עובדות מהחוק עם הסעיף, ואת המדריך לשלב.',
			'question'  => 'מה השלבים של הליך פלילי?',
			'page'      => '/criminal-defense-attorney/',
			'category'  => 'ReferenceApplication',
			'data'      => array( 'registry_version', 'fl_plili_halich' ),
			'dataset'   => 'fl_plili_halich',
			'next_text' => 'הצעד הבא: לבדוק את המועד הקרוב בשלב שלכם עם עורך דין פלילי',
			'primary'   => array( 'label' => 'זכויות חשוד בחקירה במשטרה', 'path' => '/police-investigation-rights/' ),
			'rehearse'  => array( 'label' => 'לתרגל חקירה באזהרה מול חוקר', 'topic' => 'criminal-law', 'purpose' => 'police_interrogation' ),
			'more'      => array(
				array( 'label' => 'עורך דין מעצרים', 'path' => '/arrest-detention-lawyer-israel/' ),
				array( 'label' => 'ערעור פלילי', 'path' => '/criminal-appeal/' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין פלילי במדריך', 'path' => '/lawyers/?area=criminal-law' ),
			'sticky'    => 'השלב שלכם',
		),
		// Bundle: 'zchuyot-chashud' => array( 'instrument.js', 'zchuyot-ui.js' ).
		'zchuyot-chashud'         => array(
			'name'      => 'הזכויות שלכם בחקירה ובמעצר',
			'title'     => 'הזכויות שלכם בחקירה ובמעצר: כרטיס עם הסעיפים',
			'promise'   => 'למה עוצרים אתכם, מה לא חייבים לומר, עורך דין, הודעה לקרוב, שופט בתוך 24 שעות, חקירה בשפה שלכם ותיעוד בווידאו: כל זכות עם הסעיף שלה, בכרטיס שאפשר להדפיס.',
			'question'  => 'מה הזכויות שלי בחקירה ובמעצר?',
			'page'      => '/criminal-defense-attorney/',
			'category'  => 'ReferenceApplication',
			'data'      => array( 'registry_version', 'fl_plili_halich' ),
			'dataset'   => 'fl_plili_halich',
			'next_text' => 'הצעד הבא: להתייעץ עם עורך דין פלילי לפני החקירה או מיד אחרי המעצר',
			'primary'   => array( 'label' => 'זכויות חשוד בחקירה במשטרה', 'path' => '/police-investigation-rights/' ),
			'rehearse'  => array( 'label' => 'לתרגל חקירה באזהרה מול חוקר', 'topic' => 'criminal-law', 'purpose' => 'police_interrogation' ),
			'more'      => array(
				array( 'label' => 'עורך דין מעצרים', 'path' => '/arrest-detention-lawyer-israel/' ),
				array( 'label' => 'מפת ההליך הפלילי', 'path' => '/criminal-process-map/' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין פלילי במדריך', 'path' => '/lawyers/?area=criminal-law' ),
			'sticky'    => 'זכויות',
		),
	);
}

/** The answer box, from the snapshot (the same engine the page runs). */
function justice_tools_crim_answer( string $name, string $mode = '' ): string {
	$reg  = justice_tools_registry();
	$snap = justice_tools_snapshot( $name );
	if ( 'bchirat-orech-din-plili' === $name && ! empty( $reg['fl_plili'] ) && ! empty( $snap['answer'] ) ) {
		$a = $snap['answer'];
		return '<div class="jtool-answer"><p><strong>בחירת עורך דין פלילי</strong> מתחילה בשלב שבו אתם נמצאים. לדוגמה, מי שזומן לחקירה בחשד לאלימות צריך: '
			. esc_html( $a['profile'] ) . ' הכלי נותן ' . (int) $a['ask_n'] . ' שאלות לפגישה הראשונה, ' . (int) $a['flags_n'] . ' דגלים אדומים ואת טווח שכר הטרחה של השלב. '
			. 'נבדק ' . esc_html( justice_tools_he_date( $reg['fl_plili']['checked_on'] ) ) . ' על ידי הצוות המשפטי של Justice.</p></div>';
	}
	if ( 'sachar-orech-din-plili' === $name && ! empty( $reg['fl_plili_sachar'] ) && ! empty( $snap['answer'] ) ) {
		$parts = array();
		foreach ( $snap['answer']['rows'] as $row ) {
			if ( is_numeric( $row['low'] ) && is_numeric( $row['high'] ) ) {
				$parts[] = esc_html( $row['he'] ) . ': ' . justice_tools_money( $row['low'], 0 ) . ' עד ' . justice_tools_money( $row['high'], 0 );
			}
		}
		return '<div class="jtool-answer"><p><strong>כמה עולה עורך דין פלילי?</strong> לפי הטווחים שמשרדים מפרסמים: ' . implode( '; ', array_slice( $parts, 0, 4 ) ) . '. '
			. 'תעריף לשכת עורכי הדין קובע מינימום מומלץ בלבד, והמחיר בפועל נקבע בהסכם עם המשרד. נבדק ' . esc_html( justice_tools_he_date( $reg['fl_plili_sachar']['checked_on'] ) ) . ' על ידי הצוות המשפטי של Justice.</p></div>';
	}
	if ( 'onshei-averot' === $name && ! empty( $reg['fl_plili_onashim'] ) && ! empty( $snap['answer'] ) ) {
		$parts = array();
		foreach ( array_slice( $snap['answer']['rows'], 0, 6 ) as $row ) {
			$parts[] = esc_html( $row['offence'] . ': ' . $row['max'] . ' (' . $row['law'] . ', סעיף ' . $row['section'] . ')' );
		}
		return '<div class="jtool-answer"><p><strong>העונש המרבי על עבירות נפוצות, לפי נוסח החוק:</strong> ' . implode( '; ', $parts ) . '. '
			. 'עבירה שעונשה עד שבע שנות מאסר נדונה בבית משפט השלום, וחמורה ממנה במחוזי. העונש בפועל נקבע לפי הנסיבות. נבדק ' . esc_html( justice_tools_he_date( $reg['fl_plili_onashim']['checked_on'] ) ) . ' על ידי הצוות המשפטי של Justice.</p></div>';
	}
	if ( 'halich-plili' === $name && ! empty( $reg['fl_plili_halich'] ) && ! empty( $snap['answer'] ) ) {
		return '<div class="jtool-answer"><p><strong>ההליך הפלילי שלב אחרי שלב:</strong> ' . esc_html( implode( ', ', $snap['answer']['steps'] ) ) . '. '
			. 'מי שנעצר מובא בפני שופט בתוך 24 שעות, ושופט מאריך מעצר לפני כתב אישום ב-15 ימים לכל היותר בכל פעם (חוק המעצרים, סעיפים 17 ו-29). נבדק ' . esc_html( justice_tools_he_date( $reg['fl_plili_halich']['checked_on'] ) ) . ' על ידי הצוות המשפטי של Justice.</p></div>';
	}
	if ( 'zchuyot-chashud' === $name && ! empty( $reg['fl_plili_halich'] ) && ! empty( $snap['answer'] ) ) {
		$parts = array();
		foreach ( $snap['answer']['rights'] as $right ) {
			$parts[] = esc_html( $right['he'] . ' (' . $right['law'] . ', סעיף ' . $right['section'] . ')' );
		}
		return '<div class="jtool-answer"><p><strong>הזכויות של מי שנעצר:</strong> ' . implode( '; ', $parts ) . '. נבדק ' . esc_html( justice_tools_he_date( $reg['fl_plili_halich']['checked_on'] ) ) . ' על ידי הצוות המשפטי של Justice.</p></div>';
	}
	return '';
}

/** The data stamp in the tool's header. */
function justice_tools_crim_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'bchirat-orech-din-plili' === $name ) {
		return 'לפי חוק המעצרים ומדריכי האתר · נבדק ' . justice_tools_he_date( (string) ( $reg['fl_plili']['checked_on'] ?? '' ) );
	}
	if ( 'sachar-orech-din-plili' === $name ) {
		return 'תעריף לשכת עורכי הדין ופרסומי משרדים · נבדק ' . justice_tools_he_date( (string) ( $reg['fl_plili_sachar']['checked_on'] ?? '' ) );
	}
	if ( 'onshei-averot' === $name ) {
		return 'נוסח החוק · נבדק ' . justice_tools_he_date( (string) ( $reg['fl_plili_onashim']['checked_on'] ?? '' ) );
	}
	if ( in_array( $name, array( 'halich-plili', 'zchuyot-chashud' ), true ) ) {
		return 'חוק סדר הדין הפלילי וחוק המעצרים · נבדק ' . justice_tools_he_date( (string) ( $reg['fl_plili_halich']['checked_on'] ?? '' ) );
	}
	return '';
}

/** Sources, as the registry holds them. */
function justice_tools_crim_sources( string $name ): array {
	$reg = justice_tools_registry();
	$keys = array( 'bchirat-orech-din-plili' => 'fl_plili', 'sachar-orech-din-plili' => 'fl_plili_sachar', 'onshei-averot' => 'fl_plili_onashim', 'halich-plili' => 'fl_plili_halich', 'zchuyot-chashud' => 'fl_plili_halich' );
	$key  = $keys[ $name ] ?? '';
	$out = array();
	foreach ( ( $reg[ $key ]['sources'] ?? array() ) as $s ) {
		$out[] = array( 'name' => $s['name_he'], 'url' => $s['url'], 'text' => $s['text_he'] ?? '' );
	}
	return $out;
}

/** The numbers part: the fee table prints its table in the details; the selector has none. */
function justice_tools_crim_numbers_html( string $name ): string {
	return '';
}
