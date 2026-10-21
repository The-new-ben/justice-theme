<?php
/**
 * The inheritance wave (21.10.2026): five instruments for the process after a death, each on the page that owns its words.
 *
 * Shortcodes (placing them is an editor step, after the theme release):
 *   [justice_tool name="tzav-yerusha"]                   the request planner: route, documents, fees, clock (/inheritance-order/)
 *   [justice_tool name="tzav-yerusha" mode="kiyum"]      the same instrument read from the will's side (/what-is-a-probate-order/)
 *   [justice_tool name="histalkut"]                      the waiver-affidavit generator (/disclaimer-renouncing-share/)
 *   [justice_tool name="sichsuch-yerusha"]               the dispute navigator (/inheritance-dispute/)
 *   [justice_tool name="sichsuch-yerusha" mode="lawyer"] the navigator on the lawyer's guide (/inheritance-disputes-lawyer/)
 *   [justice_tool name="heskem-yorshim"]                 the heirs' agreement generator with the equalization ledger (/heirs-distribution-agreement/)
 *   [justice_tool name="hitnagdut"]                      the objection clock and grounds checker (/will-dispute-grounds/)
 * Every number is read from assets/data/justice-tools-registry.json (inheritance_process, built by
 * tools/justice_tools_inheritance.py; will_cost for the notary and Bar tariffs) or from the snapshot the build renders.
 *
 * Homes are pages without Adv. Maya Rotenberg's reviewed-by line, so her review never looks like a review of a tool she did
 * not review (the HAD-498 rule); the lawyer link goes to /inheritance-lawyer/.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** The tools this file answers for. */
function justice_tools_inheritance_names(): array {
	return array( 'tzav-yerusha', 'histalkut', 'sichsuch-yerusha', 'heskem-yorshim', 'hitnagdut' );
}

/** The catalog entries, merged into justice_tools_catalog(). */
function justice_tools_inheritance_catalog(): array {
	return array(
		'tzav-yerusha'     => array(
			'name'      => 'מתכנן הבקשה לצו ירושה',
			'title'     => 'בקשה לצו ירושה או לצו קיום צוואה: המסלול, המסמכים, האגרה והשעון',
			'promise'   => 'עונים על המצב שלכם, עם או בלי צוואה, מי מגיש ומי היורשים, ומקבלים את מסלול ההגשה, את רשימת המסמכים לפי תקנה 14, את האגרה כפי שנגבית, ואת המועדים: 7 ימים לצוואה המקורית, 14 ימים להתנגדויות.',
			'question'  => 'איך מגישים בקשה לצו ירושה, מה מצרפים, כמה משלמים וכמה זמן זה לוקח?',
			'page'      => '/inheritance-order/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'inheritance_process' ),
			'dataset'   => 'inheritance_process',
			'next_text' => 'הצעד הבא: להכניס ליומן את יום ההגשה, את מסירת הצוואה המקורית ואת סוף תקופת ההתנגדויות',
			'primary'   => array( 'label' => 'הוספת המועדים ליומן', 'act' => 'ics' ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה בין היורשים', 'topic' => 'inheritance', 'purpose' => 'mediation' ),
			'more'      => array( array( 'label' => 'הגשה מקוונת באתר האפוטרופוס הכללי', 'url' => 'https://www.gov.il/he/service/inheritance_order' ), array( 'label' => 'מי יורש כמה כשאין צוואה', 'path' => '/succession-law-israel/' ), array( 'label' => 'תצהיר הסתלקות: המחולל', 'path' => '/disclaimer-renouncing-share/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין לענייני ירושה', 'path' => '/inheritance-lawyer/' ),
			'sticky'    => 'אגרה ופרסום',
			'modes'     => array(
				'kiyum' => array(
					'name'        => 'מתכנן הבקשה לצו קיום צוואה',
					'title'       => 'בקשה לצו קיום צוואה: המסלול, המסמכים, האגרה והשעון',
					'promise'     => 'מסמנים שיש צוואה ומקבלים את מסלול ההגשה, את המסמכים (הצוואה המקורית בתוך 7 ימים מהגשה מקוונת, הודעה לזוכים, ייפוי כוח), את האגרה כפי שנגבית, ו-14 הימים להתנגדויות.',
					'question'    => 'איך מגישים בקשה לצו קיום צוואה, ומה קורה אם מישהו מתנגד?',
					'page'        => '/what-is-a-probate-order/',
					'more'        => array( array( 'label' => 'הגשה מקוונת באתר האפוטרופוס הכללי', 'url' => 'https://www.gov.il/he/service/probate-order' ), array( 'label' => 'כמה עולה צוואה, מהחתימה ועד צו הקיום', 'path' => '/depositing-testament-registrar/' ), array( 'label' => 'התנגדות לצוואה: שעון ועילות', 'path' => '/will-dispute-grounds/' ) ),
					'shares_form' => true,
				),
			),
		),
		'sichsuch-yerusha' => array(
			'name'        => 'ניווט סכסוך ירושה',
			'title'       => 'סכסוך ירושה: המסלול הנכון, הערכאה, האגרה והשעון',
			'promise'     => 'מסמנים על מה רבים ואיפה התיק עומד, ומקבלים את המסלולים שהחוק פותח עכשיו: התנגדות, תיקון צו, מנהל עיזבון, פירוק שיתוף, תביעה למזונות או הסכם, כל אחד עם הערכאה, האגרה, המועד והראיות שאוספים אליו.',
			'question'    => 'מה עושים בסכסוך ירושה, לאן פונים, וכמה זה עולה?',
			'page'        => '/inheritance-dispute/',
			'category'    => 'LegalApplication',
			'data'        => array( 'registry_version', 'inheritance_process', 'will_cost' ),
			'dataset'     => 'inheritance_process',
			'next_text'   => 'הצעד הבא: לתרגל את השיחה בין היורשים מול מגשר, לפני שהמחלוקת מגיעה לבית המשפט',
			'primary'     => array( 'label' => 'לתרגל את השיחה בין היורשים', 'rehearse' => true ),
			'rehearse'    => array( 'label' => 'לתרגל את השיחה בין היורשים', 'topic' => 'inheritance', 'purpose' => 'mediation' ),
			'more'        => array( array( 'label' => 'התנגדות לצוואה: שעון ועילות', 'path' => '/will-dispute-grounds/' ), array( 'label' => 'הסכם חלוקת עיזבון: המחולל', 'path' => '/heirs-distribution-agreement/' ), array( 'label' => 'הרשם לענייני ירושה', 'url' => 'https://www.gov.il/he/service/inheritance_order' ) ),
			'lawyer'      => array( 'label' => 'עורך דין לסכסוכי ירושה', 'path' => '/inheritance-lawyer/' ),
			'sticky'      => 'מסלולים',
			'sticky_kind' => 'count',
			'modes'       => array(
				'lawyer' => array(
					'name'        => 'ניווט סכסוך ירושה: לפני שפונים לעורך דין',
					'title'       => 'סכסוכי ירושה: איזה הליך מתאים לכם, מה הוא עולה ומה אוספים אליו',
					'promise'     => 'לפני הפגישה הראשונה עם עורך דין: המסלולים שפתוחים בשלב שבו התיק עומד, האגרה של כל אחד אצל הרשם ובבית המשפט, התעריף המינימלי המומלץ של הלשכה, והראיות שמביאים לפגישה.',
					'question'    => 'איזה הליך מתאים לסכסוך הירושה שלנו, ומה נביא לעורך הדין?',
					'page'        => '/inheritance-disputes-lawyer/',
					'shares_form' => true,
				),
			),
		),
		// The inheritance wave (21.10.2026): the waiver-of-inheritance affidavit generator (jt24), /disclaimer-renouncing-share/.
		'histalkut'       => array(
			'name'        => 'מחולל תצהיר הסתלקות מירושה',
			'title'       => 'תצהיר הסתלקות מירושה: למי מותר, באיזה שלב, ומה הנוסח',
			'promise'     => 'השער של סעיף 6: לטובת מי מותר להסתלק, מה קורה אחרי שניתן צו, מה זה עולה, והתצהיר עצמו עם הסעיפים, מוכן להשלמה ולחתימה בפני עורך דין.',
			'question'    => 'איך מוותרים על חלק בירושה, לטובת מי מותר, ומה כותבים בתצהיר?',
			'page'        => '/disclaimer-renouncing-share/',
			'category'    => 'LegalApplication',
			'data'        => array( 'registry_version', 'inheritance_process', 'will_cost' ),
			'dataset'     => 'inheritance_process',
			'next_text'   => 'הצעד הבא: להעתיק את התצהיר, למלא את הסוגריים המרובעים ולחתום בפני עורך דין',
			'primary'     => array( 'label' => 'העתקת התצהיר', 'act' => 'copy-doc' ),
			'rehearse'    => array( 'label' => 'לתרגל את השיחה במשפחה על החלוקה', 'topic' => 'inheritance', 'purpose' => 'mediation' ),
			'more'        => array( array( 'label' => 'בקשה לצו ירושה: המתכנן', 'path' => '/inheritance-order/' ), array( 'label' => 'מי יורש כמה', 'path' => '/succession-law-israel/' ), array( 'label' => 'בקשה לצו ירושה, האפוטרופוס הכללי', 'url' => 'https://www.gov.il/he/service/inheritance_order' ) ),
			'lawyer'      => array( 'label' => 'עורך דין לענייני ירושה', 'path' => '/inheritance-lawyer/' ),
			'sticky'      => 'מסתלקים מ',
			'sticky_kind' => 'text',
		),
		// The inheritance wave (21.10.2026): the objection clock and grounds checker (/will-dispute-grounds/).
		'hitnagdut'       => array(
			'name'        => 'שעון ההתנגדות לצוואה',
			'title'       => 'התנגדות לצוואה: כמה ימים נשארו, על איזו עילה, ומה כותבים',
			'promise'     => 'שעון 14 הימים מיום הפרסום, העילות שבחוק מול הראיות שבידכם, האגרה, ושלד כתב ההתנגדות עם הסעיף של כל עילה. ואחרי שהצו ניתן: מסלול התיקון.',
			'question'    => 'עד מתי מגישים התנגדות לצו קיום צוואה, על איזו עילה, וכמה זה עולה?',
			'page'        => '/will-dispute-grounds/',
			'category'    => 'LegalApplication',
			'data'        => array( 'registry_version', 'inheritance_process', 'will_cost' ),
			'dataset'     => 'inheritance_process',
			'next_text'   => 'הצעד הבא: להוסיף את המועד האחרון ליומן, ולתרגל את הדיון בהתנגדות לפני שעומדים בו',
			'primary'     => array( 'label' => 'הוספת המועד ליומן', 'act' => 'ics' ),
			'rehearse'    => array( 'label' => 'לתרגל את הדיון בהתנגדות', 'topic' => 'inheritance', 'purpose' => 'court_rehearsal' ),
			'more'        => array(
				array( 'label' => 'התנגדות לצוואה: ההליך המלא', 'path' => '/will-probate-objection/' ),
				array( 'label' => 'צו ירושה: המדריך', 'path' => '/inheritance-order/' ),
				array( 'label' => 'תשלום אגרת ההתנגדות', 'url' => 'https://ecom.gov.il/counterspa/home/9/1/inheritanceRegistar?language=he' ),
			),
			'lawyer'      => array( 'label' => 'עורך דין לענייני ירושה', 'path' => '/inheritance-lawyer/' ),
			'sticky'      => 'ימים להתנגדות',
			'sticky_kind' => 'count',
		),
		// The inheritance wave (21.10.2026): the heirs' distribution agreement with the equalization ledger (/heirs-distribution-agreement/).
		'heskem-yorshim'  => array(
			'name'      => 'מחולל הסכם חלוקת עיזבון',
			'title'     => 'הסכם חלוקת עיזבון בין יורשים: המאזן, תשלומי האיזון והטיוטה',
			'promise'   => 'מי מקבל יותר מחלקו ומי פחות, כמה מאזנים מכספי העיזבון בלי מס, וכמה מגיע מכסף פרטי ונחשב מכירה (סעיף 5(ג)(4)); וההסכם עצמו, סעיף אחרי סעיף, בלי בית משפט.',
			'question'  => 'איך מחלקים עיזבון אחרת מהצו בלי מס ובלי בית משפט, וכמה כל יורש משלם או מקבל?',
			'page'      => '/heirs-distribution-agreement/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'inheritance_process', 'will_cost' ),
			'dataset'   => 'inheritance_process',
			'next_text' => 'הצעד הבא: להעתיק את ההסכם, להשלים את הפרטים שבסוגריים, ולתרגל את שיחת החלוקה לפני שיושבים עם שאר היורשים',
			'primary'   => array( 'label' => 'העתקת ההסכם', 'act' => 'copy-doc' ),
			'rehearse'  => array( 'label' => 'לתרגל את שיחת החלוקה בין היורשים', 'topic' => 'inheritance', 'purpose' => 'mediation' ),
			'more'      => array(
				array( 'label' => 'צו ירושה: המדריך', 'path' => '/inheritance-order/' ),
				array( 'label' => 'מחשבון מס שבח', 'path' => '/land-appreciation-tax/' ),
				array( 'label' => 'מחשבון מס רכישה', 'path' => '/acquisition-tax-brackets-2026/' ),
			),
			'lawyer'    => array( 'label' => 'עורך דין לענייני ירושה', 'path' => '/inheritance-lawyer/' ),
			'sticky'    => 'איזון',
		),
	);
}

/** The answer box (40-70 words): the direct answer, its numbers, their sections and the check date. */
function justice_tools_inheritance_answer( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	$ip  = $reg['inheritance_process'] ?? array();
	if ( empty( $ip ) ) {
		return '';
	}
	$checked = 'נבדק ' . esc_html( justice_tools_he_date( $ip['checked_on'] ) ) . '.';
	$rf      = $ip['registrar'];
	$fc      = $ip['family_court'];
	$text    = '';
	if ( 'tzav-yerusha' === $name ) {
		$order = 'kiyum' === $mode ? 'צו קיום צוואה' : 'צו ירושה';
		$text  = '<strong>בקשה ל' . $order . '</strong> מוגשת לרשם לענייני ירושה באגרה של ' . justice_tools_money( $rf['items']['order']['amount'], 0 ) . ' (' . esc_html( $rf['items']['order']['item'] ) . '), ובהגשה מקוונת <bdi>' . (int) $rf['online_pct'] . '%</bdi>, שנגבים ' . justice_tools_money( $rf['payments']['online_fee'], 0 ) . ', ועוד הוצאות פרסום של ' . justice_tools_money( $rf['payments']['publication'], 0 ) . ' (תקנה 17(ג)). '
			. 'מצרפים תעודת פטירה, ' . ( 'kiyum' === $mode ? 'את הצוואה המקורית (בתוך <bdi>' . (int) $ip['days']['online_original_will'] . '</bdi> ימים מהגשה מקוונת), ' : '' ) . 'אישור על הודעה לכל היורשים ותצהיר הסתלקות של מי שמוותר (תקנה 14). '
			. 'הרשם מפרסם את הבקשה, ומי שרוצה מתנגד בתוך <bdi>' . (int) $ip['days']['objection'] . '</bdi> ימים (סעיף 67; תקנה 17(א)); התנגדות מעבירה את התיק לבית המשפט לענייני משפחה (סעיף 67א). ' . $checked;
	}
	if ( 'sichsuch-yerusha' === $name ) {
		$text = '<strong>סכסוך ירושה</strong> נפתר באחד מכמה מסלולים, לפי השלב: עד שהצו ניתן, התנגדות לרשם בתוך <bdi>' . (int) $ip['days']['objection'] . '</bdi> ימים מהפרסום, באגרה של ' . justice_tools_money( $fc['items']['objection']['amount'], 0 ) . ' בבית המשפט לענייני משפחה (סעיפים 67 ו-67א); אחרי הצו, בקשה לתיקון או לביטול על עובדות חדשות (סעיף 72), ' . justice_tools_money( $rf['items']['amend']['amount'], 0 ) . ' אצל הרשם. '
			. 'כשיורש אחד מחזיק בנכסים: מנהל עיזבון (סעיף 78), ' . justice_tools_money( $rf['items']['manager']['amount'], 0 ) . ' אצל הרשם בהסכמת כולם או ' . justice_tools_money( $fc['items']['manager']['amount'], 0 ) . ' בבית המשפט. דירה משותפת: פירוק שיתוף (סעיף 37 לחוק המקרקעין). '
			. 'וכל עוד העיזבון לא חולק, הסכם בין היורשים גובר על הצו בלי בית משפט (סעיף 110). ' . $checked;
	}
	// histalkut (jt24): the answer box. One paragraph, every figure from the registry. $checked is the shared
	// 'נבדק <date>.' string of the answer function (justice_tools_checked_on( $name ) → inheritance_process.checked_on).
	if ( 'histalkut' === $name && ! empty( $reg['inheritance_process'] ) && ! empty( $reg['will_cost'] ) ) {
		$ip   = $reg['inheritance_process'];
		$nf   = $reg['will_cost']['notary'];
		$text = '<strong>הסתלקות מירושה</strong> היא הודעה בכתב לרשם לענייני ירושה, אחרי הפטירה וכל עוד העיזבון לא חולק (' . esc_html( $ip['sections']['renounce'] ) . ' לחוק הירושה): מוותרים על החלק, כולו או מקצתו, בתצהיר מאומת (' . esc_html( $ip['regulation_sections']['renounce_affidavit'] ) . '). '
			. 'הסתלקות מכוונת מותרת רק לטובת בן הזוג, ילד או אח של המנוח (' . esc_html( $ip['sections']['renounce_who'] ) . '); לכל אדם אחר זו העברה, לא הסתלקות. '
			. 'לתצהיר אין אגרה; אימות אצל נוטריון ' . justice_tools_money( $nf['affidavit_first'], 0 ) . ' ועוד מע"מ <bdi>' . (int) $reg['will_cost']['vat']['pct'] . '%</bdi>, ואחרי שניתן צו מבקשים גם לתקן אותו, ' . justice_tools_money( $ip['registrar']['items']['amend']['amount'], 0 ) . '. ' . $checked;
	}
	if ( 'hitnagdut' === $name && ! empty( $reg['inheritance_process'] ) ) {
		$ip   = $reg['inheritance_process'];
		$fc   = $ip['family_court'];
		$rg   = $ip['registrar'];
		$text = '<strong>התנגדות לצוואה</strong> מגישים לרשם לענייני ירושה בתוך <bdi>' . (int) $ip['days']['objection'] . '</bdi> ימים מיום פרסום הבקשה באתר האפוטרופוס הכללי וברשומות, או יותר אם הרשם קבע (' . esc_html( $ip['sections']['publication'] ) . '; ' . esc_html( $ip['regulation_sections']['publication'] ) . '), והיא נדונה בבית המשפט לענייני משפחה (' . esc_html( $ip['sections']['to_court'] ) . '). '
			. 'האגרה ' . justice_tools_money( $fc['items']['objection']['amount'], 0 ) . '. העילות שבחוק: כשרות המצווה, השפעה בלתי הוגנת, זוכה שערך או העיד, פגם בצורה, צוואה מאוחרת; לכל אחת סעיף וראיה. '
			. 'אחרי שהצו ניתן מבקשים תיקון או ביטול (' . esc_html( $ip['sections']['amend'] ) . '): ' . justice_tools_money( $rg['items']['amend']['amount'], 0 ) . ' אצל הרשם או ' . justice_tools_money( $fc['items']['amend']['amount'], 0 ) . ' בבית המשפט. נבדק ' . esc_html( justice_tools_he_date( $ip['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'heskem-yorshim' === $name && ! empty( $reg['inheritance_process'] ) ) {
		$ip   = $reg['inheritance_process'];
		$lt   = $ip['land_tax'];
		$text = '<strong>הסכם חלוקת עיזבון</strong> מאפשר ליורשים לחלק את הנכסים אחרת מהצו, בהסכמה ובלי בית משפט (' . esc_html( $ip['sections']['division_agreement'] ) . ' לחוק הירושה). '
			. 'חלוקה ראשונה אינה מכירה כל עוד האיזון משולם מכספי העיזבון (' . esc_html( $lt['division_not_sale'] ) . ' לחוק מיסוי מקרקעין); כסף פרטי שיורש מוסיף הוא מכירה: מס רכישה למשלם, מס שבח למקבל. '
			. 'אישור בית משפט רק כשיש קטין או חסוי (' . esc_html( $ip['capacity']['minor_property'] ) . ' לחוק הכשרות). '
			. 'רישום בטאבו: ' . justice_tools_money( $ip['bar']['registration_per_unit'], 0 ) . ' ליחידה לפי תעריף הלשכה, לפני מע"מ. נבדק ' . esc_html( justice_tools_he_date( $ip['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '' === $text ? '' : '<div class="jtool-answer"><p>' . $text . '</p></div>';
}

/** The data stamp in the tool's header. */
function justice_tools_inheritance_stamp( string $name, string $mode = '' ): string {
	$reg     = justice_tools_registry();
	$ip      = $reg['inheritance_process'] ?? array();
	$checked = 'נבדק ' . justice_tools_he_date( $ip['checked_on'] ?? '' );
	if ( 'tzav-yerusha' === $name ) {
		return 'אגרה ' . number_format( (float) ( $ip['registrar']['items']['order']['amount'] ?? 0 ) ) . ' ₪ מ-' . justice_tools_he_date( $ip['registrar']['from'] ?? '' ) . ' · ' . (int) ( $ip['days']['objection'] ?? 0 ) . ' ימים להתנגדות · ' . $checked;
	}
	if ( 'sichsuch-yerusha' === $name ) {
		return 'אגרות הרשם ובית המשפט מ-' . justice_tools_he_date( $ip['family_court']['current_to'] ?? '' ) . ( 'lawyer' === $mode ? ' · תעריף הלשכה 2026' : '' ) . ' · ' . $checked;
	}
	if ( 'histalkut' === $name ) {
		$ip = $reg['inheritance_process'] ?? array();
		$nf = $reg['will_cost']['notary'] ?? array();
		return 'סעיף 6 לחוק הירושה · נוטריון ' . number_format( (float) ( $nf['affidavit_first'] ?? 0 ) ) . ' ₪ + מע"מ מ-' . justice_tools_he_date( $nf['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $ip['checked_on'] ?? '' );
	}
	if ( 'hitnagdut' === $name ) {
		$ip = $reg['inheritance_process'] ?? array();
		return 'אגרת התנגדות ' . number_format( (float) ( $ip['family_court']['items']['objection']['amount'] ?? 0 ) ) . ' ₪ מ-' . justice_tools_he_date( $ip['family_court']['current_to'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $ip['checked_on'] ?? '' );
	}
	if ( 'heskem-yorshim' === $name ) {
		$ip = $reg['inheritance_process'] ?? array();
		return ( $ip['land_tax']['division_not_sale'] ?? '' ) . ' לחוק מיסוי מקרקעין: חלוקה ראשונה אינה מכירה · רישום בטאבו ' . number_format( (float) ( $ip['bar']['registration_per_unit'] ?? 0 ) ) . ' ₪ ליחידה · נבדק ' . justice_tools_he_date( $ip['checked_on'] ?? '' );
	}
	return 'חוק הירושה ותקנותיו · ' . $checked;
}

/** Official sources used by each instrument's result. */
function justice_tools_inheritance_sources( string $name ): array {
	$reg     = justice_tools_registry();
	$ip      = $reg['inheritance_process'];
	$rf      = $ip['registrar'];
	$fc      = $ip['family_court'];
	$checked = justice_tools_he_date( $ip['checked_on'] );
	$law     = array( 'name' => $ip['law_he'], 'url' => $ip['law_url'], 'text' => '' );
	$regs    = array( 'name' => $ip['regulations_he'], 'url' => $ip['regulations_url'], 'text' => '' );
	$fees    = array( 'name' => $rf['regulation_he'], 'url' => $rf['url'], 'text' => $rf['items']['order']['item'] . ': ' . number_format( (float) $rf['items']['order']['amount'] ) . ' ₪ לבקשה לצו ירושה או צו קיום; פרט 2: תיקון או ביטול צו ' . number_format( (float) $rf['items']['amend']['amount'] ) . ' ₪; פרט 3: מינוי מנהל עיזבון ' . number_format( (float) $rf['items']['manager']['amount'] ) . ' ₪; תקנה 1(א): ' . (int) $rf['online_pct'] . '% בהגשה מקוונת; תקנה 4(5): פטור לבני משפחה של מי שנפטר בפעולות איבה או בשירות צבאי. בנוסח מ-' . justice_tools_he_date( $rf['from'] ) . ' (' . $rf['gazette_he'] . ').' );
	$pay     = array( 'name' => $rf['payments']['he'], 'url' => $rf['payments']['url'], 'text' => 'בקשה בהגשה מקוונת ' . number_format( (float) $rf['payments']['online_fee'] ) . ' ₪; הוצאות פרסום ' . number_format( (float) $rf['payments']['publication'] ) . ' ₪ לבקשה. נבדק ' . justice_tools_he_date( $rf['payments']['checked_on'] ) . '.' );
	$court   = array( 'name' => $fc['regulation_he'], 'url' => $fc['url'], 'text' => $fc['items']['objection']['item'] . ': התנגדות ' . number_format( (float) $fc['items']['objection']['amount'] ) . ' ₪; פרט 4א: תיקון או ביטול צו ' . number_format( (float) $fc['items']['amend']['amount'] ) . ' ₪; פרט 4ב: מינוי מנהל עיזבון ' . number_format( (float) $fc['items']['manager']['amount'] ) . ' ₪; פרט 2: תביעה בענייני רכוש שאינה לסכום קצוב ' . number_format( (float) $fc['items']['property']['amount'] ) . ' ₪; פרט 6: כל תביעה אחרת ' . number_format( (float) $fc['items']['other']['amount'] ) . ' ₪. נוסח ל-' . justice_tools_he_date( $fc['current_to'] ) . '; ' . $fc['indexed_he'] . '.' );
	$svc     = array( 'name' => $ip['service_he'], 'url' => $ip['online_rule']['url'], 'text' => $ip['online_rule']['he'] . '. ' . $ip['online_rule']['tabu_he'] . '. נבדק ' . $checked . '.' );
	if ( 'tzav-yerusha' === $name ) {
		$law['text']  = 'סעיף 6: הסתלקות; 66: הצהרה על זכויות היורשים בצו; 67: פרסום והזמנה להתנגדויות; 67א: העברה לבית המשפט; 71: הצו מחייב; 136 ו-137: מנוח שמקום מושבו בחוץ לארץ; 155: בית דין דתי בהסכמת כולם בכתב. נוסח עדכני ל-' . justice_tools_he_date( $ip['law_current_to'] ) . ', נבדק ' . $checked . '.';
		$regs['text'] = 'תקנה 14: הטופס, תעודת הפטירה, הצוואה המקורית (בהגשה מקוונת בתוך ' . (int) $ip['days']['online_original_will'] . ' ימים), ההודעה ליורשים, ייפוי הכוח; 15: תצהירי מוות; 16: תצהיר הסתלקות; 17: פרסום, ' . (int) $ip['days']['objection'] . ' ימים להתנגדות, הוצאות הפרסום על המבקש; 18: צוואה אחרת במרשם; 20: העברה לבית המשפט; 23: הצו כשאין התנגדות.';
		return array( $law, $regs, $fees, $pay, $svc, array( 'name' => $ip['capacity']['law_he'], 'url' => $ip['capacity']['url'], 'text' => $ip['capacity']['he'] . '.' ) );
	}
	if ( 'sichsuch-yerusha' === $name ) {
		$bar          = $reg['will_cost']['bar'];
		$law['text']  = 'סעיפים 56 עד 65: מזונות מן העיזבון, ו-60: המועד; 67 ו-67א: התנגדות והעברה לבית המשפט; 72: תיקון וביטול צו; 73: קונה בתום לב; 78 ו-79: מנהל עיזבון; 110 ו-111: חלוקה בהסכם או בצו; 121 ו-122: ניהול העיזבון בידי היורשים; 151: בית המשפט לענייני משפחה; 155: בית דין דתי בהסכמה. נבדק ' . $checked . '.';
		$regs['text'] = 'תקנה 17: ' . (int) $ip['days']['objection'] . ' ימים להתנגדות; 19: תוכן ההתנגדות; 20 ו-21: ההעברה והצדדים; 27: תיקון וביטול, ' . (int) $ip['days']['amend_response'] . ' ימים לתשובה; 28: תובענה למזונות; 31 עד 45: מנהל עיזבון.';
		return array(
			$law,
			$regs,
			$court,
			$fees,
			array( 'name' => $ip['land_law']['law_he'], 'url' => $ip['land_law']['url'], 'text' => $ip['land_law']['partition_he'] . '; סעיף 40א: דירת מגורים של בני זוג.' ),
			array( 'name' => $ip['land_tax']['law_he'], 'url' => $ip['land_tax']['url'], 'text' => $ip['land_tax']['inheritance_not_sale'] . ': הורשה אינה מכירה; ' . $ip['land_tax']['division_not_sale'] . ': ' . $ip['land_tax']['division_he'] . '.' ),
			array( 'name' => $ip['limitation']['law_he'], 'url' => $ip['limitation']['url'], 'text' => $ip['limitation']['he'] . '.' ),
			array( 'name' => 'חוק בתי המשפט [נוסח משולב], התשמ"ד-1984', 'url' => $ip['courts']['mediation_url'], 'text' => 'סעיף 79ג: העברה לגישור בהסכמת בעלי הדין.' ),
			array( 'name' => $ip['capacity']['law_he'], 'url' => $ip['capacity']['url'], 'text' => $ip['capacity']['he'] . '.' ),
			array( 'name' => $bar['rules_he'], 'url' => $bar['url'], 'text' => 'פרט 4.א(4): בקשה לצו ' . $bar['probate_pct'] . '% מהעיזבון ולפחות ' . number_format( (float) $bar['probate_min'] ) . ' ₪, בהתנגדות +' . (int) $bar['objection_add_pct'] . '%, דיון נוסף ' . number_format( (float) $ip['bar']['hearing'] ) . ' ₪; פרט 3(ב): פירוק שיתוף ' . $ip['bar']['partition_pct'] . '% מחלק הלקוח ולפחות ' . number_format( (float) $ip['bar']['partition_min'] ) . ' ₪, תביעה שאינה ניתנת להערכה ' . number_format( (float) $ip['bar']['nonmonetary'] ) . ' ₪, בקשת ביניים ' . number_format( (float) $ip['bar']['interim'] ) . ' ₪. ' . $bar['note_he'] . '.' ),
		);
	}
	if ( 'histalkut' === $name ) {
		$ip      = $reg['inheritance_process'];
		$rf      = $ip['registrar'];
		$nf      = $reg['will_cost']['notary'];
		$lt      = $ip['land_tax'];
		$checked = justice_tools_he_date( $ip['checked_on'] );
		return array(
			array( 'name' => $ip['law_he'], 'url' => $ip['law_url'], 'text' => 'סעיף 6(א): הסתלקות אחרי הפטירה וכל עוד העיזבון לא חולק, בהודעה בכתב לרשם, מהחלק כולו או מקצתו או ממנה שבצוואה; 6(ב): המסתלק כאילו לא היה יורש מלכתחילה, והסתלקות מכוונת רק לטובת בן הזוג, ילד או אח של המוריש; 6(ג): קטין ופסול דין באישור בית המשפט; 6(ד): הסתלקות על תנאי בטלה; 7: העברת החלק בהסכם בכתב, ו-7(ג): מי שהעביר או שיעבד איבד את הזכות להסתלק; 67א: העברה לבית המשפט; 72: תיקון וביטול צו. נוסח עדכני ל-' . justice_tools_he_date( $ip['law_current_to'] ) . '; נבדק ' . $checked . '.' ),
			array( 'name' => $ip['regulations_he'], 'url' => $ip['regulations_url'], 'text' => 'תקנה 16: ההסתלקות מוגשת בתצהיר שמפרט את החלק ואת הנהנה, עם אישור בית המשפט כשהמסתלק קטין או שמונה לו אפוטרופוס; תקנה 14: הבקשה לצו; תקנה 27: בקשה לתיקון או לביטול צו, ו-' . (int) $ip['days']['amend_response'] . ' ימים לתשובת היורשים.' ),
			array( 'name' => $rf['regulation_he'], 'url' => $rf['url'], 'text' => 'אין בתוספת פרט אגרה לתצהיר הסתלקות; ' . $rf['items']['amend']['item'] . ': ' . $rf['items']['amend']['he'] . ' ' . number_format( (float) $rf['items']['amend']['amount'] ) . ' ₪. בנוסח מ-' . justice_tools_he_date( $rf['from'] ) . ' (' . $rf['gazette_he'] . ').' ),
			array( 'name' => $nf['regulation_he'], 'url' => $nf['url'], 'text' => $ip['notary']['item'] . ': אימות תצהיר ' . number_format( (float) $nf['affidavit_first'] ) . ' ₪ לחותם ראשון ו-' . number_format( (float) $nf['affidavit_additional'] ) . ' ₪ לכל חותם נוסף; תקנה 1: ועוד מע"מ. בנוסח מ-' . justice_tools_he_date( $nf['from'] ) . ' (' . $nf['gazette_he'] . ').' ),
			array( 'name' => $reg['will_cost']['vat']['he'], 'url' => $reg['will_cost']['vat']['url'], 'text' => 'מע"מ ' . $reg['will_cost']['vat']['pct'] . '% מ-' . justice_tools_he_date( $reg['will_cost']['vat']['from'] ) . '.' ),
			array( 'name' => 'פקודת הראיות [נוסח חדש], התשל"א-1971', 'url' => $ip['evidence_url'], 'text' => $ip['evidence_he'] . '.' ),
			array( 'name' => $lt['law_he'], 'url' => $lt['url'], 'text' => $lt['inheritance_not_sale'] . ': הורשה אינה מכירה; ' . $lt['gift_he'] . '.' ),
			array( 'name' => $ip['capacity']['law_he'], 'url' => $ip['capacity']['url'], 'text' => $ip['capacity']['he'] . '.' ),
			array( 'name' => $ip['service_he'], 'url' => $ip['service_url'], 'text' => $ip['online_rule']['he'] . '.' ),
		);
	}
	if ( 'hitnagdut' === $name ) {
		$ip      = $reg['inheritance_process'];
		$fc      = $ip['family_court'];
		$rg      = $ip['registrar'];
		$bar     = $reg['will_cost']['bar'];
		$checked = justice_tools_he_date( $ip['checked_on'] );
		return array(
			array( 'name' => $ip['law_he'], 'url' => $ip['law_url'], 'text' => 'סעיף 67: פרסום הבקשה והזמנת התנגדויות; 67א: ההתנגדות נדונה בבית המשפט לענייני משפחה; 66: הצו; 72: תיקון או ביטול צו שניתן; 73: הגנה על מי שקנה בתום לב; 155: בית דין דתי רק בהסכמת כל הנוגעים בדבר. העילות: 26 (כשרות), 30(א) (אונס, איום, השפעה בלתי הוגנת, תחבולה, תרמית) ו-31, 30(ב) (טעות), 35 (זוכה שערך או העיד), 19 עד 23 ו-25 (צורה), 36 (ביטול וצוואה מאוחרת), 8א (צוואות הדדיות), 33 (הוראה סתומה), 34 (הוראה בלתי חוקית) ו-38 (בטלות חלקית). נבדק ' . $checked . '.' ),
			array( 'name' => $ip['regulations_he'], 'url' => $ip['regulations_url'], 'text' => 'תקנה 17(א): הרשם מפרסם ומזמין התנגדויות בתוך ' . (int) $ip['days']['objection'] . ' ימים מיום הפרסום, או יותר אם קבע, ורשאי להאריך; תקנה 18: ' . (int) $ip['days']['other_will_notice'] . ' ימים למי שזוכה בצוואה אחרת שבמרשם; תקנה 19: תוכן ההתנגדות; תקנות 20 ו-21: ההעברה לבית המשפט, המבקש תובע והמתנגד נתבע; תקנה 27: ' . (int) $ip['days']['amend_response'] . ' ימים ליורשים לתשובה על בקשה לתיקון או לביטול צו.' ),
			array( 'name' => $fc['regulation_he'], 'url' => $fc['url'], 'text' => $fc['items']['objection']['item'] . ': ' . $fc['items']['objection']['he'] . ' ' . number_format( (float) $fc['items']['objection']['amount'] ) . ' ₪; ' . $fc['items']['amend']['item'] . ': ' . $fc['items']['amend']['he'] . ' ' . number_format( (float) $fc['items']['amend']['amount'] ) . ' ₪. ' . $fc['indexed_he'] . '. בנוסח מ-' . justice_tools_he_date( $fc['current_to'] ) . '.' ),
			array( 'name' => $rg['regulation_he'], 'url' => $rg['url'], 'text' => $rg['items']['amend']['item'] . ': ' . $rg['items']['amend']['he'] . ' ' . number_format( (float) $rg['items']['amend']['amount'] ) . ' ₪. ' . $rg['indexed_he'] . '. בנוסח מ-' . justice_tools_he_date( $rg['from'] ) . ' (' . $rg['gazette_he'] . ').' ),
			array( 'name' => $rg['payments']['he'], 'url' => $rg['payments']['url'], 'text' => 'תשלום האגרות לשירותי הרשם לענייני ירושה. נבדק ' . justice_tools_he_date( $rg['payments']['checked_on'] ) . '.' ),
			array( 'name' => $bar['rules_he'], 'url' => $bar['url'], 'text' => 'פרט 4.א(4): בקשה לצו ירושה או לצו קיום ' . $bar['probate_pct'] . '% מערך העיזבון, לא פחות מ-' . number_format( (float) $bar['probate_min'] ) . ' ₪; עם התנגדות תוספת של ' . (int) $bar['objection_add_pct'] . '%; לכל דיון נוסף ' . number_format( (float) $ip['bar']['hearing'] ) . ' ₪. ' . $bar['note_he'] . '. נוסח ל-' . justice_tools_he_date( $bar['current_to'] ) . '.' ),
			array( 'name' => 'חוק בתי המשפט [נוסח משולב], התשמ"ד-1984', 'url' => $ip['courts']['mediation_url'], 'text' => $ip['courts']['mediation_he'] . '.' ),
			array( 'name' => 'פקודת הראיות [נוסח חדש], התשל"א-1971', 'url' => $ip['evidence_url'], 'text' => $ip['evidence_he'] . '.' ),
			array( 'name' => $reg['will_cost']['vat']['he'], 'url' => $reg['will_cost']['vat']['url'], 'text' => 'מע"מ ' . $reg['will_cost']['vat']['pct'] . '% מ-' . justice_tools_he_date( $reg['will_cost']['vat']['from'] ) . ', על התעריף המומלץ של הלשכה.' ),
		);
	}
	if ( 'heskem-yorshim' === $name ) {
		$ip      = $reg['inheritance_process'];
		$sc      = $ip['sections'];
		$lt      = $ip['land_tax'];
		$cp      = $ip['capacity'];
		$bar     = $ip['bar'];
		$checked = justice_tools_he_date( $ip['checked_on'] );
		return array(
			array( 'name' => $ip['law_he'], 'url' => $ip['law_url'], 'text' => $sc['division_agreement'] . ': היורשים רשאים לחלק את נכסי העיזבון ביניהם בהסכם; ' . $sc['division_court'] . ': בלי הסכם, בצו בית משפט, ואז חלים הכללים הכפויים (' . $sc['division_rules'] . '); ' . $sc['agreement_in_life_void'] . ': הסכם בדבר ירושתו של אדם שנעשה בחייו בטל, ולכן ההסכם נערך אחרי הפטירה; ' . $sc['no_manager'] . ' ו-' . str_replace( 'סעיף ', '', $sc['heirs_together'] ) . ': בלי מנהל עיזבון היורשים מנהלים ומחלקים את העיזבון יחד; ' . $sc['family_court'] . ': בית המשפט לענייני משפחה. נוסח עדכני ל-' . justice_tools_he_date( $ip['law_current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $lt['law_he'], 'url' => $lt['url'], 'text' => $lt['inheritance_not_sale'] . ': הורשה אינה מכירה; ' . $lt['division_not_sale'] . ': ' . $lt['division_he'] . ', לפני רישום הצו או אחריו; תמורה מכסף פרטי של יורש הופכת את החלק שנקנה בה למכירה (מס רכישה למשלם, מס שבח למקבל); ' . $lt['inherited_home'] . ': ' . $lt['inherited_home_he'] . '.' ),
			array( 'name' => $cp['law_he'], 'url' => $cp['url'], 'text' => $cp['he'] . '. בלי קטין או חסוי, ההסכם לא טעון אישור של בית משפט ולא של הרשם.' ),
			array( 'name' => $bar['rules_he'], 'url' => $bar['url'], 'text' => $bar['items']['registration'] . ': רישום המקרקעין על שם היורשים ' . number_format( (float) $bar['registration_per_unit'] ) . ' ₪ ליחידת מקרקעין, כשלא עורך הדין שהוציא את הצו רושם (אז אין תעריף נוסף). ' . $bar['note_he'] . '. אין בתעריף פרט לעריכת הסכם חלוקה, ולכן הכלי לא מציג מחיר לעורך הדין. נוסח ל-' . justice_tools_he_date( $bar['current_to'] ) . '.' ),
			array( 'name' => 'חוק בתי המשפט [נוסח משולב], התשמ"ד-1984', 'url' => $ip['courts']['mediation_url'], 'text' => $ip['courts']['mediation_he'] . '; ' . $ip['courts']['family_he'] . '.' ),
			array( 'name' => $ip['land_law']['law_he'], 'url' => $ip['land_law']['url'], 'text' => 'כשאין הסכם על דירה משותפת: ' . $ip['land_law']['partition_he'] . '.' ),
			array( 'name' => $ip['service_he'], 'url' => $ip['service_url'], 'text' => $ip['online_rule']['tabu_he'] . '. ' . $ip['online_rule']['he'] . '. נבדק ' . $checked . '.' ),
			array( 'name' => $reg['will_cost']['vat']['he'], 'url' => $reg['will_cost']['vat']['url'], 'text' => 'מע"מ ' . $reg['will_cost']['vat']['pct'] . '% מ-' . justice_tools_he_date( $reg['will_cost']['vat']['from'] ) . ', על התעריף המומלץ של הלשכה.' ),
		);
	}
	return array( $law, $regs, $fees, $pay );
}

/** The page table of each instrument (the "numbers" and "compare" parts), rendered by the build from the registry. */
function justice_tools_inheritance_numbers_html( string $name ): string {
	$snap = justice_tools_snapshot( $name );
	return isset( $snap['compare_table'] ) ? '<div class="jtool-page">' . (string) $snap['compare_table'] . '</div>' : '';
}
