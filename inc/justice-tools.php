<?php
/**
 * The co.il tools program: the "instrument" shell, wave 1 (HAD-485): T04 (CPI linkage and the
 * Interest Adjudication Law) and T02 (minimum wage back-pay); wave 2 (HAD-490): T03 (recuperation
 * pay) and T05 (small claims: fit, fee, deadlines, claim structure, rehearsal; fee-only mode).
 *
 * Extends the legal-tools framework that already lives here: [jt_fee_calculator]
 * (inc/fee-calculator.php), the /legal-tools/ hub and its HAD-454 hero (inc/legal-tools-app.php),
 * the justice_legal_tool post type, and the justice-ops [justice_calc] family. Same idea, one level
 * up: every number is read from ONE dated registry (assets/data/justice-tools-registry.json), the
 * example result is in the server HTML, and the calculation path cites the exact section.
 *
 * Shortcodes (no page is created by this file; placing them is an editor step):
 *   [justice_tool name="hatzmada"]                       answer box + instrument
 *   [justice_tool name="sachar-minimum" answer="0"]       instrument without the answer box
 *   [justice_tool name="havraa"]                         T03, recuperation pay
 *   [justice_tool name="tviot-ktanot"]                   T05, small claims (full instrument)
 *   [justice_tool name="tviot-ktanot" mode="fee"]        T05, fee only (/small-claims-fee-calculator/)
 *   [justice_tool name="yerusha"]                        wave 3: inheritance without a will (/inheritance/)
 *   [justice_tool name="mas-rechisha"]                   wave 3: purchase tax and the full cost (/acquisition-tax-brackets-2026/)
 *   [justice_tool name="hetel-hashbacha"]                wave 3: betterment levy (/betterment-levy-israel/)
 *   [justice_tool name="tzavaa"]                         wave 4: what a will costs, signing to probate (/depositing-testament-registrar/)
 *   [justice_tool name="teunat-drachim"]                 wave 4: road-accident compensation (/israel-road-accident-compensation-law/)
 *   [justice_tool name="gerushin"]                       wave 4: what a divorce costs, and the law's clocks (/opening-divorce-file-rabbinical/)
 *   [justice_tool name="chozeh-schirut"]                 wave 5: a residential lease under the Fair Rental chapter (/online-rent-agreement/)
 *   [justice_tool name="pitzuyim"]                       wave 5: severance pay, section 14 and the notice (/severance-pay-calculator/)
 *   [justice_tool name="mas-shevach"]                    wave 5: capital gains tax on a home, and the net (/land-appreciation-tax/)
 *   [justice_tool name="luach-shahut"]                   the divorce world (HAD-539): the custody calendar (/divorce-lawyer/)
 *   [justice_tool name="maakav-mezonot"]                 the divorce world: the child-support payment tracker (/divorce-lawyer/)
 *   [justice_tool name="mapat-gerushin"]                 the divorce world: the divorce roadmap (/divorce-lawyer/)
 *   [justice_tool name="gerushin" mode="lawyer" answer="only"]   the answer box alone; the instrument prints later on the page
 *   [justice_tool_section name="hatzmada" part="method"]  part: method | numbers | compare | sources | updated
 *                                                         (add mode="fee" for the fee-only page's method)
 *   [justice_tools_index]                                 hub cards with the data stamp
 *
 * Claude Design boards: https://claude.ai/artifact/JHKhphmy9L1QbYYUk2KX4e (wave 1),
 * https://claude.ai/artifact/759KGxB7GDSy5NHaajW8sJ (wave 2), wave 3 (HAD-498): see the PR.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Read a JSON file from assets/data once per request.
 *
 * @param string $file File name under assets/data.
 * @return array
 */
function justice_tools_json( string $file ): array {
	static $cache = array();
	if ( isset( $cache[ $file ] ) ) {
		return $cache[ $file ];
	}
	$path = JUSTICE_THEME_DIR . '/assets/data/' . $file;
	$data = is_readable( $path ) ? json_decode( (string) file_get_contents( $path ), true ) : null;
	$cache[ $file ] = is_array( $data ) ? $data : array();
	return $cache[ $file ];
}

function justice_tools_registry(): array {
	return justice_tools_json( 'justice-tools-registry.json' );
}

function justice_tools_snapshots(): array {
	return justice_tools_json( 'justice-tools-snapshots.json' );
}

/**
 * The tools this file renders. Page URLs come from backlog.csv (HAD-477); the new URL for T04
 * passed url_word_audit (hatzmada 0 owners, madad 0 owners).
 */
function justice_tools_catalog(): array {
	return array(
		'hatzmada'       => array(
			'name'      => 'מחשבון הצמדה למדד וריבית',
			'title'     => 'מחשבון הצמדה למדד וריבית לפי חוק פסיקת ריבית והצמדה',
			'promise'   => 'כמה שווה היום סכום מאז, ומה בית המשפט מוסיף לו. כולל תשלומים חלקיים וטבלה לבית המשפט.',
			'question'  => 'כמה שווה היום סכום מתאריך קודם, עם הצמדה וריבית כחוק?',
			'page'      => '/hatzmada-madad/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'checked_on', 'cpi', 'interest' ),
			'next_text' => 'הצעד הבא: לצרף את הטבלה לכתב התביעה או לבקשה בהוצאה לפועל',
			'primary'   => array( 'label' => 'הורדת הטבלה לבית המשפט', 'act' => 'csv' ),
			'rehearse'  => array( 'label' => 'לתרגל את הדיון בתביעה הכספית', 'topic' => 'general', 'purpose' => 'court_rehearsal' ),
			'lawyer'    => array( 'label' => 'עורך דין ליטיגציה', 'path' => '/lawyers/' ),
			'sticky'    => 'היתרה',
		),
		'sachar-minimum' => array(
			'name'      => 'בודק שכר מינימום',
			'title'     => 'בודק שכר מינימום: קיבלתם לפחות את המינימום?',
			'promise'   => 'חודש אחרי חודש, גם כשהשכר עלה ב-1 באפריל, וכמה חסר בסך הכול.',
			'question'  => 'האם השכר שלי לא נמוך משכר המינימום, ומה הפער?',
			'page'      => '/minimum-wage-israel-2025/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'checked_on', 'min_wage' ),
			'next_text' => 'הצעד הבא: לשלוח למעסיק מכתב דרישה עם הפירוט',
			'primary'   => array( 'label' => 'הפקת מכתב דרישה', 'act' => 'letter' ),
			// Conversion to a hearing is 2 in the backlog (below 3), so no rehearsal button here.
			'rehearse'  => null,
			'more'      => array( array( 'label' => 'הצמדה וריבית לפער', 'path' => '/hatzmada-madad/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/israeli-labor-law/' ),
			'sticky'    => 'חסר',
		),
		// Wave 2 (HAD-490). Board: https://claude.ai/artifact/759KGxB7GDSy5NHaajW8sJ
		'havraa'         => array(
			'name'      => 'מחשבון דמי הבראה',
			'title'     => 'מחשבון דמי הבראה לפי צו ההרחבה',
			'promise'   => 'כמה ימים ובכמה, לשנה הזאת או לכל התקופה, כולל מה שלא שולם ומכתב דרישה.',
			'question'  => 'כמה דמי הבראה מגיעים לי, לפי ותק ואחוז משרה?',
			'page'      => '/havraa-pay-calculator/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'checked_on', 'havraa' ),
			'next_text' => 'הצעד הבא: לבדוק בתלוש של יוני עד ספטמבר שהסכום שולם, ואם לא, לשלוח למעסיק מכתב דרישה',
			'primary'   => array( 'label' => 'הפקת מכתב דרישה', 'act' => 'letter' ),
			// Conversion to a hearing is 2 in the backlog (below 3), so no rehearsal button here.
			'rehearse'  => null,
			'more'      => array( array( 'label' => 'בודק שכר מינימום', 'path' => '/minimum-wage-israel-2025/' ), array( 'label' => 'הצמדה וריבית לחוב', 'path' => '/hatzmada-madad/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/israeli-labor-law/' ),
			'sticky'    => 'מגיע',
		),
		'tviot-ktanot'   => array(
			'name'      => 'בודק תביעות קטנות ואגרה',
			'title'     => 'תביעה קטנה: אפשר? כמה אגרה? עד מתי?',
			'promise'   => 'בדיקת התאמה, האגרה בעיגול הנכון, המועדים, שלד כתב התביעה ותרגול הדיון.',
			'question'  => 'האם התביעה שלי מתאימה לתביעות קטנות, וכמה אגרה אשלם?',
			'page'      => '/small-claims-court-israel/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'checked_on', 'small_claims' ),
			'next_text' => 'הצעד הבא: לתרגל את הדיון מול שופטת וירטואלית, לפני שעומדים מולה באמת',
			// Conversion 5 (a direct hearing): the rehearsal is the primary next step, after the result.
			'primary'   => array( 'label' => 'לתרגל את הדיון בתביעה הקטנה', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הדיון בתביעה הקטנה', 'topic' => 'general', 'purpose' => 'court_rehearsal' ),
			'more'      => array( array( 'label' => 'הגשה באתר הרשות השופטת', 'url' => 'https://www.gov.il/he/service/filing_a_small_claim' ), array( 'label' => 'מחשבון הצמדה וריבית לסכום', 'path' => '/hatzmada-madad/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין ליטיגציה', 'path' => '/lawyers/' ),
			'sticky'    => 'אגרה',
			// The stage bar of a combined tool (design-spec 3, board T05-desktop): check, fee, deadlines, claim, rehearse.
			'stages'    => array( array( 'אפשר לתבוע כאן?', 'result' ), array( 'האגרה', 'jt5-fee-h' ), array( 'המועדים', 'jt5-dl-h' ), array( 'כתב התביעה', 'jt5-claim-h' ), array( 'תרגול הדיון', 'next' ) ),
			'modes'     => array(
				'fee' => array(
					'name'      => 'מחשבון אגרת תביעה קטנה',
					'title'     => 'מחשבון אגרת תביעה קטנה',
					'promise'   => 'האגרה המדויקת, עם העיגול כלפי מעלה שמחשבונים רבים שוכחים.',
					'question'  => 'כמה אגרה משלמים על תביעה קטנה?',
					'page'      => '/small-claims-fee-calculator/',
					'next_text' => 'הצעד הבא: לבדוק שהתביעה בכלל מתאימה לתביעות קטנות, ומה המועדים',
					'primary'   => array( 'label' => 'בדיקה מלאה, מועדים וכתב תביעה', 'path' => '/small-claims-court-israel/' ),
					'more'      => array(),
					'stages'    => array(),
				),
			),
		),
		// Wave 3 (HAD-498): every tool carries a teaser to the simulation (Ben, 13.10.2026).
		'yerusha'        => array(
			'name'        => 'מחשבון חלוקת ירושה ללא צוואה',
			'title'       => 'מי יורש כמה כשאין צוואה',
			'promise'     => 'בן זוג, ילדים, הורים, אחים: החלק של כל אחד לפי חוק הירושה, בשקלים, עם עץ יורשים ומה עולה צו ירושה.',
			'question'    => 'מי יורש כמה כשאין צוואה, ומה עולה צו ירושה?',
			// Placed on /succession-law-israel/, not /inheritance/: that page carries Adv. Maya Rotenberg's reviewed-by
			// line, and her review must not appear to cover a calculator she did not review (HAD-498 release, 14.10.2026).
			'page'        => '/succession-law-israel/',
			'category'    => 'LegalApplication',
			'data'        => array( 'registry_version', 'yerusha' ),
			'dataset'     => 'yerusha',
			'next_text'   => 'הצעד הבא: לתרגל את השיחה בין היורשים מול מגשר, לפני שהמחלוקת מגיעה לבית המשפט',
			'primary'     => array( 'label' => 'לתרגל שיחה בין היורשים', 'rehearse' => true ),
			'rehearse'    => array( 'label' => 'לתרגל שיחה בין היורשים', 'topic' => 'inheritance', 'purpose' => 'mediation' ),
			'more'        => array( array( 'label' => 'הגשת בקשה לצו ירושה', 'url' => 'https://www.gov.il/he/service/inheritance_order' ), array( 'label' => 'צו ירושה: המדריך', 'path' => '/inheritance-order/' ) ),
			'lawyer'      => array( 'label' => 'עורך דין לענייני ירושה', 'path' => '/inheritance-lawyer/' ),
			'sticky'      => 'יורשים',
			'sticky_kind' => 'count',
		),
		'mas-rechisha'   => array(
			'name'      => 'מחשבון מס רכישה 2026',
			'title'     => 'מס רכישה: כמה מס, וכמה כסף צריך בסך הכול',
			'promise'   => 'המס לפי המדרגות שבתוקף, ארבעה מצבים זה לצד זה, החלון למכירת הדירה הקודמת עם הארכת המלחמה, וכל עלויות הקנייה.',
			'question'  => 'כמה מס רכישה משלמים, ומה עוד עולה הקנייה?',
			'page'      => '/acquisition-tax-brackets-2026/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'purchase_tax' ),
			'dataset'   => 'purchase_tax',
			'next_text' => 'הצעד הבא: להכניס ליומן את מועדי ההצהרה, התשלום ומכירת הדירה הקודמת',
			'primary'   => array( 'label' => 'הוספת המועדים ליומן', 'act' => 'ics' ),
			// Conversion to a hearing is 2 in the backlog: the rehearsal is a secondary link, never the primary.
			'rehearse'  => array( 'label' => 'לתרגל משא ומתן על המחיר', 'topic' => 'real-estate', 'purpose' => 'mediation' ),
			'more'      => array( array( 'label' => 'הסימולטור של רשות המסים', 'url' => 'https://www.misim.gov.il/svsimurechisha/' ), array( 'label' => 'מחשבון היטל השבחה', 'path' => '/betterment-levy-israel/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין מקרקעין', 'path' => '/real-estate-attorney/' ),
			'sticky'    => 'מס',
		),
		'hetel-hashbacha' => array(
			'name'      => 'מחשבון היטל השבחה',
			'title'     => 'היטל השבחה: כמה, מתי ואיך להשיג',
			'promise'   => 'כמה היטל לפי סוג התוכנית והחלק שלכם, מה נדחה בבנייה למגורים, ושלוש הדרכים להשיג על שומה עם המועד האחרון.',
			'question'  => 'כמה היטל השבחה אשלם, ואיך משיגים על שומה?',
			'page'      => '/betterment-levy-israel/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'betterment' ),
			'dataset'   => 'betterment',
			'next_text' => 'הצעד הבא: לתרגל את הדיון בוועדת הערר, לפני שעומדים מולה',
			'primary'   => array( 'label' => 'לתרגל את הדיון בוועדת הערר', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הדיון בוועדת הערר', 'topic' => 'real-estate', 'purpose' => 'court_rehearsal' ),
			'more'      => array( array( 'label' => 'שמאי מקרקעין', 'path' => '/real-estate-appraiser/' ), array( 'label' => 'מחשבון מס רכישה', 'path' => '/acquisition-tax-brackets-2026/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין מקרקעין', 'path' => '/real-estate-attorney/' ),
			'sticky'    => 'היטל',
		),
		// Wave 4 (HAD-502): prices and costs first (Ben, 13-14.10.2026).
		'tzavaa'          => array(
			'name'      => 'מחשבון עלות צוואה',
			'title'     => 'כמה עולה צוואה, מהחתימה ועד צו הקיום',
			'promise'   => 'נוטריון, רשם או עדים: האגרות והתעריף הרשמי, ההפקדה שלרוב פטורה מאגרה, וצו הקיום שהיורשים ישלמו.',
			'question'  => 'כמה עולה לעשות צוואה, להפקיד אותה ולקבל עליה צו קיום?',
			'page'      => '/depositing-testament-registrar/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'will_cost' ),
			'dataset'   => 'will_cost',
			'next_text' => 'הצעד הבא: להדפיס את מפת העלויות ואת רשימת הדברים שלוקחים להפקדה',
			'primary'   => array( 'label' => 'הדפסת מפת העלויות', 'act' => 'print' ),
			'rehearse'  => array( 'label' => 'לתרגל את שיחת הצוואה עם המשפחה', 'topic' => 'inheritance', 'purpose' => 'mediation' ),
			'more'      => array( array( 'label' => 'מי יורש כשאין צוואה', 'path' => '/succession-law-israel/' ), array( 'label' => 'בקשה לצו קיום, האפוטרופוס הכללי', 'url' => 'https://www.gov.il/he/service/inheritance_order' ) ),
			'lawyer'    => array( 'label' => 'עורך דין לענייני ירושה', 'path' => '/inheritance-lawyer/' ),
			'sticky'    => 'היום',
		),
		'teunat-drachim'  => array(
			'name'        => 'מחשבון פיצויים בתאונת דרכים',
			'title'       => 'פיצויים בתאונת דרכים: כאב וסבל, שכר טרחה והתיישנות',
			'promise'     => 'הנוסחה שבתקנות לכאב וסבל, התקרה להפסד השתכרות, כמה עורך דין יכול לגבות מההצעה, ועד מתי אפשר לתבוע.',
			'question'    => 'כמה פיצוי מגיע על כאב וסבל, וכמה יישאר אחרי שכר הטרחה?',
			'page'        => '/israel-road-accident-compensation-law/',
			'category'    => 'LegalApplication',
			'data'        => array( 'registry_version', 'car_accident' ),
			'dataset'     => 'car_accident',
			'next_text'   => 'הצעד הבא: לתרגל את העדות ואת הבדיקה אצל המומחה הרפואי, לפני שזה קורה באמת',
			'primary'     => array( 'label' => 'לתרגל את העדות ואת הבדיקה אצל המומחה', 'rehearse' => true ),
			'rehearse'    => array( 'label' => 'לתרגל את העדות ואת הבדיקה אצל המומחה', 'topic' => 'personal-injury', 'purpose' => 'witness_prep' ),
			'more'        => array( array( 'label' => 'שכר טרחה: 8%, 11% או 13%', 'path' => '/eight-eleven-thirteen-fee-tariff/' ), array( 'label' => 'תקרת הפסד השתכרות', 'path' => '/ceiling-lost-earnings-triple-wage/' ) ),
			'lawyer'      => array( 'label' => 'עורך דין תאונות דרכים', 'path' => '/car-accident-auto-injury-lawyer/' ),
			'sticky'      => 'כאב וסבל',
			'sticky_kind' => 'pct',
		),
		// Not on /divorce-costs-2025/ (Adv. Maya Rotenberg's reviewed page, and in the HAD-447 cluster plan): on the
		// rabbinical-court file page, which the head phrase "פתיחת תיק גירושין" reaches (HAD-502).
		'gerushin'        => array(
			'name'      => 'מחשבון עלות גירושין',
			'title'     => 'כמה עולה גירושין: אגרות, עורך דין והמועדים שבחוק',
			'promise'   => 'בהסכמה, דרך יחידת הסיוע או במחלוקת: כל אגרה בבית הדין הרבני ובבית המשפט, התעריף המינימלי לעורך דין, המועדים, ומי משלם למי באיזון המשאבים.',
			'question'  => 'כמה עולה להתגרש, ומה ההבדל בין הסכמה למחלוקת?',
			'page'      => '/opening-divorce-file-rabbinical/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'divorce_cost' ),
			'dataset'   => 'divorce_cost',
			'next_text' => 'הצעד הבא: לתרגל את הגישור ואת השיחה על ההסכם, לפני הפגישה ביחידת הסיוע',
			'primary'   => array( 'label' => 'לתרגל את הגישור', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הגישור', 'topic' => 'divorce', 'purpose' => 'mediation' ),
			'more'      => array( array( 'label' => 'אגרות בית הדין הרבני', 'path' => '/fees-rabbinical-courts/' ), array( 'label' => 'הסכם גירושין: מה כולל', 'path' => '/divorce-agreement/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין לבית הדין הרבני', 'path' => '/practice-areas/rabbinical-court/' ),
			'sticky'    => 'אגרות',
			'modes'     => array(
				// HAD-532: the head term "עורך דין גירושין" (1,300 a month, DataForSEO 14.10.2026) is owned by /divorce-lawyer/.
				// Same instrument, read from the lawyer's side: the bar's minimum tariff per stage first, then the fees.
				// The price owner stays /divorce-costs-2025/; this mode links to it and does not repeat its guide.
				'lawyer' => array(
					'name'        => 'מחשבון עלות עורך דין גירושין',
					'title'       => 'כמה יעלה עורך דין גירושין, ומה עוד משלמים בדרך',
					'promise'     => 'בוחרים מסלול, בהסכמה או במחלוקת, ומקבלים את התעריף המינימלי של לשכת עורכי הדין לכל שירות, כל אגרה בבית הדין ובבית המשפט, והמועדים שבחוק.',
					'question'    => 'כמה עולה עורך דין גירושין?',
					'page'        => '/divorce-lawyer/',
					'next_text'   => 'הצעד הבא: לתרגל את הגישור ואת השיחה על ההסכם, לפני הפגישה הראשונה עם עורך הדין',
					'more'        => array( array( 'label' => 'עלויות גירושין ושכר טרחה', 'path' => '/divorce-costs-2025/' ), array( 'label' => 'פתיחת תיק גירושין: אגרות ומועדים', 'path' => '/opening-divorce-file-rabbinical/' ) ),
					'lawyer'      => array( 'label' => 'עורכי דין לענייני משפחה לפי עיר', 'path' => '/lawyers/?area=family-law' ),
					'sticky'      => 'אגרות',
					'shares_form' => true,
				),
			),
		),
		// Wave 5 (HAD-504): picked by demand (GSC 90 days and DataForSEO, 14.10.2026); each on the page that owns its words.
		'chozeh-schirut'  => array(
			'name'      => 'מחולל חוזה שכירות',
			'title'     => 'חוזה שכירות לפי חוק השכירות ההוגנת: מחולל ובדיקה',
			'promise'   => 'עונים על כמה שאלות ומקבלים חוזה שכירות מלא, כל סעיף עם הסעיף בחוק, ובדיקה של כל דרישה מול החוק: ערובה, תיקונים, תשלומים, הארכה ויציאה.',
			'question'  => 'איך עושים חוזה שכירות שעומד בחוק, וכמה ערובה מותר לבקש?',
			'page'      => '/online-rent-agreement/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'rent_contract' ),
			'dataset'   => 'rent_contract',
			'next_text' => 'הצעד הבא: לתרגל את השיחה עם בעל הדירה על הסעיפים, לפני שחותמים',
			'primary'   => array( 'label' => 'לתרגל את השיחה עם בעל הדירה', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם בעל הדירה', 'topic' => 'real-estate', 'purpose' => 'mediation' ),
			'more'      => array( array( 'label' => 'זכויות שוכר בישראל', 'path' => '/tenant-rights-israel/' ), array( 'label' => 'מה חייב להיות בחוזה שכירות', 'path' => '/rental-agreement-guide/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין מקרקעין', 'path' => '/real-estate-attorney/' ),
			'sticky'    => 'תקרת ערובה',
		),
		'pitzuyim'        => array(
			'name'      => 'מחשבון פיצויי פיטורים והודעה מוקדמת',
			'title'     => 'פיצויי פיטורים והודעה מוקדמת: כמה, ממי ועד מתי',
			'promise'   => 'שכר כפול ותק, מה הקופה מכסה בסעיף 14 ומה המעסיק משלים, כמה ימי הודעה מוקדמת, כמה פטור ממס, ומכתב למעסיק עם המועדים.',
			'question'  => 'כמה פיצויי פיטורים והודעה מוקדמת מגיעים לי?',
			'page'      => '/severance-pay-calculator/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'severance', 'min_wage' ),
			'dataset'   => 'severance',
			'next_text' => 'הצעד הבא: לתרגל את השיחה עם המעסיק, לפני השימוע או לפני שמבקשים את הכסף',
			'primary'   => array( 'label' => 'לתרגל את השיחה עם המעסיק', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה עם המעסיק', 'topic' => 'employment', 'purpose' => 'mediation' ),
			'more'      => array( array( 'label' => 'מכתב פיטורים והודעה מוקדמת', 'path' => '/notice-of-dismissal/' ), array( 'label' => 'בודק שכר מינימום', 'path' => '/minimum-wage-israel-2025/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין דיני עבודה', 'path' => '/labor-lawyer/' ),
			'sticky'    => 'פיצויים',
		),
		'mas-shevach'     => array(
			'name'      => 'מחשבון מס שבח',
			'title'     => 'מס שבח במכירת דירה: כמה מס, ומה נשאר ביד',
			'promise'   => 'פטור לדירה יחידה עם התקרה, החישוב הלינארי המוטב, הצמדה למדד כמו במחשבון הלמ"ס, כל תקופה עם השיעור שלה, ומה נשאר אחרי המס וההוצאות.',
			'question'  => 'כמה מס שבח אשלם על מכירת הדירה?',
			'page'      => '/land-appreciation-tax/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'shevach', 'cpi' ),
			'dataset'   => 'shevach',
			'next_text' => 'הצעד הבא: להכניס ליומן את ההצהרה והתשלום, 30 ו-60 ימים מיום המכירה',
			'primary'   => array( 'label' => 'הוספת המועדים ליומן', 'act' => 'ics' ),
			// Conversion to a hearing is low: the rehearsal is a secondary link, as on the purchase-tax tool.
			'rehearse'  => array( 'label' => 'לתרגל את ההשגה מול מיסוי מקרקעין', 'topic' => 'tax', 'purpose' => 'court_rehearsal' ),
			'more'      => array( array( 'label' => 'הסימולטור של רשות המסים', 'url' => 'https://www.misim.gov.il/svtsvazmitnew/FrmHadrachaRashit.aspx' ), array( 'label' => 'מחשבון מס רכישה', 'path' => '/acquisition-tax-brackets-2026/' ), array( 'label' => 'מחשבון היטל השבחה', 'path' => '/betterment-levy-israel/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין מקרקעין', 'path' => '/real-estate-attorney/' ),
			'sticky'    => 'מס שבח',
		),
		// Family law (HAD-506). Homes are pages without Adv. Maya Rotenberg's reviewed-by line: her line must never look
		// like a review of a tool she did not review. The lawyer link goes to /family-law/, the family practice page.
		'mezonot'         => array(
			'name'        => 'מחשבון מזונות ילדים',
			'title'       => 'מחשבון מזונות ילדים לפי בע"מ 919/15',
			'promise'     => 'כמה משלם כל הורה, לפי גילאי הילדים, ההכנסות והלילות; ההוצאות שמתחלקות, הצמדה למדד, הביטוח הלאומי, ומה מזיז את הסכום.',
			'question'    => 'כמה מזונות משלמים, לפי ההכנסות וזמני השהות?',
			'page'        => '/child-support/',
			'category'    => 'LegalApplication',
			'data'        => array( 'registry_version', 'child_support', 'cpi' ),
			'dataset'     => 'child_support',
			'next_text'   => 'הצעד הבא: לתרגל את שיחת הגישור על המזונות, לפני הפגישה ביחידת הסיוע',
			'primary'     => array( 'label' => 'לתרגל את הגישור על המזונות', 'rehearse' => true ),
			'rehearse'    => array( 'label' => 'לתרגל את הגישור על המזונות', 'topic' => 'divorce', 'purpose' => 'mediation' ),
			'more'        => array( array( 'label' => 'הסדרי שהות ותוכנית הורות', 'path' => '/parenting-time-arrangements/' ), array( 'label' => 'מזונות דרך ביטוח לאומי', 'path' => '/bituach-leumi-alimony/' ) ),
			'lawyer'      => array( 'label' => 'עורך דין לענייני משפחה', 'path' => '/family-law/' ),
			'sticky'      => 'מזונות',
			'sticky_kind' => 'range',
			'modes'       => array(
				'madad' => array(
					'name'      => 'מחשבון הצמדה למדד של מזונות',
					'title'     => 'עדכון מזונות למדד: כמה משלמים היום',
					'promise'   => 'הסכום שנקבע בפסק הדין או בהסכם, מעודכן לפי מדד המחירים לצרכן כל 3, 6 או 12 חודשים, עם כל עדכון ומועד העדכון הבא.',
					'question'  => 'כמה מזונות משלמים היום, אחרי ההצמדה למדד?',
					'page'      => '/tzmidut-mezonot/',
					'next_text' => 'הצעד הבא: להכניס ליומן את העדכון הבא, ולבדוק שהסכום ששולם מתאים',
					'primary'   => array( 'label' => 'העדכון הבא ביומן', 'act' => 'ics' ),
					'more'      => array( array( 'label' => 'מחשבון מזונות ילדים', 'path' => '/child-support/' ), array( 'label' => 'מחשבון הצמדה וריבית לחוב', 'path' => '/hatzmada-madad/' ) ),
					'sticky'    => 'היום',
				),
			),
		),
		'izun'            => array(
			'name'      => 'מחשבון איזון משאבים',
			'title'     => 'איזון משאבים: מי משלם למי, ולמה',
			'promise'   => 'דירה, פנסיה, קרן השתלמות, אופציות ו-RSU, קריפטו וחובות: כל נכס נכנס לאיזון או לא, עם הסעיף או פסק הדין, והטווח כשאין נוסחה.',
			'question'  => 'כמה משלם מי שצבר יותר, באיזון המשאבים?',
			'page'      => '/resource-balancing/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'property_balance' ),
			'dataset'   => 'property_balance',
			'next_text' => 'הצעד הבא: לתרגל את הדיון בתביעה הרכושית, מול שופטת וירטואלית',
			'primary'   => array( 'label' => 'לתרגל את הדיון ברכוש', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הדיון ברכוש', 'topic' => 'family-law', 'purpose' => 'court_rehearsal' ),
			'more'      => array( array( 'label' => 'חלוקת רכוש בגירושין', 'path' => '/divorce-property-division/' ), array( 'label' => 'עלות הגירושין והמועדים', 'path' => '/opening-divorce-file-rabbinical/' ) ),
			// HAD-532: a property split or a divorce agreement is a divorce lawyer's file; the one contextual head-term link on the page.
			'lawyer'    => array( 'label' => 'עורך דין גירושין', 'path' => '/divorce-lawyer/' ),
			'sticky'    => 'תשלום איזון',
			'modes'     => array(
				'hon' => array(
					'name'      => 'מחשבון אופציות, RSU וקריפטו בגירושין',
					'title'     => 'אופציות, RSU וקריפטו בגירושין: כמה מתאזן',
					'promise'   => 'כלל הזמן לאופציות ול-RSU, מנה אחרי מנה; קריפטו בשני מועדי שווי; והתשלום שיוצא מכל קריאה.',
					'question'  => 'איך מחלקים אופציות, RSU וקריפטו בגירושין?',
					'page'      => '/rsu-options-crypto/',
					'more'      => array( array( 'label' => 'מחשבון איזון משאבים מלא', 'path' => '/resource-balancing/' ), array( 'label' => 'חלוקת רכוש בגירושין', 'path' => '/divorce-property-division/' ) ),
				),
			),
		),
		'heskem-mamon'    => array(
			'name'      => 'מחולל הסכם ממון',
			'title'     => 'טיוטת הסכם ממון: לפי השלב שלכם, עם האישור והעלות',
			'promise'   => 'הפרדה רכושית, איזון עם חריגים או הסכם מדורג; סעיפי דירה, פנסיה, עסק וירושות; מי מאשר בשלב שלכם וכמה זה עולה. טקסט להעתקה.',
			'question'  => 'איך כותבים הסכם ממון, ומי מאשר אותו?',
			'page'      => '/prenuptial-agreement/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'prenup' ),
			'dataset'   => 'prenup',
			'next_text' => 'הצעד הבא: לתרגל את השיחה על ההסכם ביניכם, לפני הפגישה אצל עורך הדין',
			'primary'   => array( 'label' => 'העתקת הטיוטה', 'act' => 'copydoc' ),
			'rehearse'  => array( 'label' => 'לתרגל את השיחה על ההסכם', 'topic' => 'divorce', 'purpose' => 'mediation' ),
			'more'      => array( array( 'label' => 'הסכם ממון: המדריך המלא', 'path' => '/prenuptial-agreements-overview/' ), array( 'label' => 'איזון משאבים בלי הסכם', 'path' => '/resource-balancing/' ) ),
			'lawyer'    => array( 'label' => 'עורך דין לענייני משפחה', 'path' => '/family-law/' ),
			'sticky'    => 'האישור',
		),
		'heskem-gerushin' => array(
			'name'      => 'מחולל הסכם גירושין ותוכנית הורות',
			'title'     => 'טיוטת הסכם גירושין, עם לוח שהות וחגים',
			'promise'   => 'ילדים, לוח לינות בשבועיים, חגים לפי הלוח העברי, מזונות מהמחשבון ורכוש מאיזון המשאבים, באותו מסמך, לאישור בית המשפט או בית הדין.',
			'question'  => 'איך עושים הסכם גירושין, כולל הסדרי שהות?',
			'page'      => '/divorce-agreement/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'divorce_agreement', 'child_support', 'property_balance', 'cpi' ),
			'dataset'   => 'divorce_agreement',
			'next_text' => 'הצעד הבא: לתרגל את הגישור על ההסכם, לפני הפגישה ביחידת הסיוע או אצל המגשר',
			'primary'   => array( 'label' => 'לתרגל את הגישור על ההסכם', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את הגישור על ההסכם', 'topic' => 'divorce', 'purpose' => 'mediation' ),
			'more'      => array( array( 'label' => 'כמה עולה הגירושין', 'path' => '/opening-divorce-file-rabbinical/' ), array( 'label' => 'מחשבון מזונות ילדים', 'path' => '/child-support/' ) ),
			// HAD-532: a property split or a divorce agreement is a divorce lawyer's file; the one contextual head-term link on the page.
			'lawyer'    => array( 'label' => 'עורך דין גירושין', 'path' => '/divorce-lawyer/' ),
			'sticky'    => 'מזונות בטיוטה',
			'modes'     => array(
				'horut' => array(
					'name'      => 'מחולל תוכנית הורות והסדרי שהות',
					'title'     => 'הסדרי שהות: לוח שבועיים, חגים והסכם הורות',
					'promise'   => 'בוחרים הסדר לינות או מסמנים לילה-לילה, מחלקים את החגים לפי הלוח העברי, ומקבלים הסכם הורות לאישור בית המשפט.',
					'question'  => 'איך בונים הסדרי שהות ותוכנית הורות?',
					'page'      => '/parenting-time-arrangements/',
					'next_text' => 'הצעד הבא: לתרגל את השיחה על הסדרי השהות, לפני הפגישה עם המגשר או בבית המשפט',
					'primary'   => array( 'label' => 'לתרגל את השיחה על הסדרי השהות', 'rehearse' => true ),
					'more'      => array( array( 'label' => 'מחשבון מזונות ילדים', 'path' => '/child-support/' ), array( 'label' => 'הסכם גירושין מלא', 'path' => '/divorce-agreement/' ) ),
					'sticky'    => 'לילות',
					// Parenting time is not only divorce (separated parents, never married): keeps the family-law pillar.
					'lawyer'    => array( 'label' => 'עורך דין לענייני משפחה', 'path' => '/family-law/' ),
				),
			),
		),
		// The divorce world (HAD-539): three apps that run a divorce end to end, all on /divorce-lawyer/ next to the five
		// family tools, so the lawyer link goes to the directory and never to the page itself. The law sets no schedule
		// (divorce_agreement.schedule_he), so the calendar's patterns are templates; the tracker keeps its log in the
		// browser only; the roadmap's fees and days come from divorce_cost through the wave-4 engine.
		'luach-shahut'    => array(
			'name'        => 'מחולל לוח זמני שהות',
			'title'       => 'לוח זמני שהות: שבועיים, שנה שלמה והחגים',
			'promise'     => 'בוחרים 2-2-3, שבוע-שבוע, 5-2-2-5 או מסמנים לילה-לילה; מחלקים חגים וחופש גדול; ומקבלים לוח שבועיים, שנה שלמה של לילות לכל הורה, קובץ יומן וטקסט להסכם.',
			'question'    => 'איך בונים לוח זמני שהות, וכמה לילות בשנה אצל כל הורה?',
			'page'        => '/divorce-lawyer/',
			'category'    => 'LegalApplication',
			'data'        => array( 'registry_version', 'divorce_agreement' ),
			'dataset'     => 'divorce_agreement',
			'next_text'   => 'הצעד הבא: לתרגל את השיחה על הלוח מול ההורה השני ומגשרת, לפני הפגישה ביחידת הסיוע',
			'primary'     => array( 'label' => 'לתרגל את השיחה על זמני השהות', 'rehearse' => true ),
			'rehearse'    => array( 'label' => 'לתרגל את השיחה על זמני השהות', 'topic' => 'divorce', 'purpose' => 'mediation' ),
			'more'        => array( array( 'label' => 'הסדרי שהות ותוכנית הורות', 'path' => '/parenting-time-arrangements/' ), array( 'label' => 'מחשבון מזונות ילדים', 'path' => '/child-support/' ) ),
			'lawyer'      => array( 'label' => 'עורכי דין לענייני משפחה לפי עיר', 'path' => '/lawyers/?area=family-law' ),
			'sticky'      => 'לילות',
			'sticky_kind' => 'count',
		),
		'maakav-mezonot'  => array(
			'name'      => 'מעקב תשלומי מזונות',
			'title'     => 'מעקב מזונות: מה שולם, מה פתוח, והצמדה וריבית על הפיגור',
			'promise'   => 'רושמים את פסק הדין ואת התשלומים; הכלי מעדכן את הסכום למדד, מחשב את החוב עם הצמדה וריבית כחוק, ומנסח מכתב דרישה. הכול נשמר אצלכם בדפדפן בלבד.',
			'question'  => 'כמה מזונות חייבים לי היום, כולל הצמדה וריבית?',
			'page'      => '/divorce-lawyer/',
			'category'  => 'FinanceApplication',
			'data'      => array( 'registry_version', 'child_support', 'cpi', 'interest' ),
			'dataset'   => 'child_support',
			'next_text' => 'הצעד הבא: לשלוח את מכתב הדרישה, ואם לא שולם, לפתוח תיק מזונות בהוצאה לפועל',
			'primary'   => array( 'label' => 'העתקת מכתב הדרישה', 'act' => 'copyletter' ),
			'rehearse'  => array( 'label' => 'לתרגל את הדיון על המזונות', 'topic' => 'divorce', 'purpose' => 'court_rehearsal' ),
			'more'      => array( array( 'label' => 'פתיחת תיק מזונות בהוצאה לפועל', 'url' => 'https://www.gov.il/he/service/opening_alimony_file' ), array( 'label' => 'עדכון מזונות למדד', 'path' => '/tzmidut-mezonot/' ), array( 'label' => 'מזונות דרך ביטוח לאומי', 'path' => '/bituach-leumi-alimony/' ) ),
			'lawyer'    => array( 'label' => 'עורכי דין לענייני משפחה לפי עיר', 'path' => '/lawyers/?area=family-law' ),
			'sticky'    => 'החוב',
		),
		'mapat-gerushin'  => array(
			'name'      => 'מפת הדרכים לגירושין',
			'title'     => 'מפת הדרכים לגירושין: מההחלטה ועד פסק הדין, שלב אחרי שלב',
			'promise'   => 'בהסכמה, ביישוב סכסוך או בתביעות: כל שלב עם מה שמכינים אליו, האגרה שלו, התאריך שהחוק קובע והקישור לכלי המתאים. מסמנים מה בוצע; ההתקדמות נשמרת אצלכם.',
			'question'  => 'איך מתגרשים בישראל, שלב אחרי שלב, וכמה זמן וכסף זה לוקח?',
			'page'      => '/divorce-lawyer/',
			'category'  => 'LegalApplication',
			'data'      => array( 'registry_version', 'divorce_cost', 'divorce_agreement', 'property_balance', 'child_support' ),
			'dataset'   => 'divorce_cost',
			'next_text' => 'הצעד הבא: לתרגל את פגישת המהו"ת ביחידת הסיוע, השלב שבו רוב ההסכמים נולדים',
			'primary'   => array( 'label' => 'לתרגל את פגישת המהו"ת', 'rehearse' => true ),
			'rehearse'  => array( 'label' => 'לתרגל את פגישת המהו"ת', 'topic' => 'divorce', 'purpose' => 'mediation' ),
			'more'      => array( array( 'label' => 'בקשה ליישוב סכסוך', 'path' => '/request-for-family-dispute-settlements/' ), array( 'label' => 'פתיחת תיק גירושין בבית הדין הרבני', 'path' => '/opening-divorce-file-rabbinical/' ) ),
			'lawyer'    => array( 'label' => 'עורכי דין לענייני משפחה לפי עיר', 'path' => '/lawyers/?area=family-law' ),
			'sticky'    => 'אגרות',
		),
	);
}

/** The day a tool's own sources were checked: the wave-3 tools carry it in their dataset. */
function justice_tools_checked_on( string $name ): string {
	$reg  = justice_tools_registry();
	$tool = justice_tools_catalog()[ $name ] ?? array();
	if ( ! empty( $tool['dataset'] ) && ! empty( $reg[ $tool['dataset'] ]['checked_on'] ) ) {
		return (string) $reg[ $tool['dataset'] ]['checked_on'];
	}
	return (string) ( $reg['checked_on'] ?? '' );
}

/** "חצי" for [1, 2], "שני שלישים" for [2, 3], "רבע" for [1, 4]; otherwise n/d. */
function justice_tools_fraction_he( array $f ): string {
	$words = array( '1/2' => 'חצי', '2/3' => 'שני שלישים', '1/4' => 'רבע', '1/3' => 'שליש' );
	$key   = (int) $f[0] . '/' . (int) $f[1];
	return $words[ $key ] ?? $key;
}

/** A tool's catalog entry, with a mode's overrides applied (e.g. tviot-ktanot in fee-only mode). */
function justice_tools_tool( string $name, string $mode = '' ): array {
	$catalog = justice_tools_catalog();
	$tool    = $catalog[ $name ] ?? array();
	if ( '' !== $mode && isset( $tool['modes'][ $mode ] ) ) {
		$tool = array_merge( $tool, $tool['modes'][ $mode ] );
	}
	return $tool;
}

/** The snapshot of a tool (or of one of its modes), as built by tools/build-justice-tools.mjs. */
function justice_tools_snapshot( string $name, string $mode = '' ): array {
	$snap = justice_tools_snapshots()[ $name ] ?? array();
	if ( '' !== $mode ) {
		if ( isset( $snap[ $mode ] ) && is_array( $snap[ $mode ] ) ) {
			return $snap[ $mode ];
		}
		// A mode that only re-frames the same instrument (gerushin "lawyer", HAD-532) reuses the tool's own snapshot.
		return ! empty( justice_tools_catalog()[ $name ]['modes'][ $mode ]['shares_form'] ) ? $snap : array();
	}
	return $snap;
}

/** 1.4.2026 from 2026-04-01; 8.2026 from 2026-08. */
function justice_tools_he_date( string $iso ): string {
	$parts = array_map( 'intval', explode( '-', $iso ) );
	if ( 3 === count( $parts ) ) {
		return $parts[2] . '.' . $parts[1] . '.' . $parts[0];
	}
	return 2 === count( $parts ) ? $parts[1] . '.' . $parts[0] : $iso;
}

function justice_tools_he_month( string $key ): string {
	$months = array( 'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר' );
	list( $y, $m ) = array_map( 'intval', explode( '-', $key ) );
	return ( $months[ $m - 1 ] ?? '' ) . ' ' . $y;
}

function justice_tools_money( $n, int $digits = 2 ): string {
	return '<span class="jtool-amt"><bdi>' . number_format( (float) $n, $digits, '.', ',' ) . '</bdi> ₪</span>';
}

/** CPI value on the latest base's scale, using the CBS chaining coefficients in the registry. */
function justice_tools_cpi_chained( array $cpi, string $key ): ?float {
	$value = null;
	foreach ( $cpi['series'] as $row ) {
		if ( $row[0] === $key ) {
			$value = (float) $row[1];
			break;
		}
	}
	if ( null === $value ) {
		return null;
	}
	$factor = 1.0;
	$found  = false;
	foreach ( $cpi['bases'] as $base ) {
		if ( $key >= $base['from'] && $key <= $base['to'] ) {
			$found = true;
		}
		if ( $found && null !== $base['to_next'] ) {
			$factor *= (float) $base['to_next'];
		}
	}
	return $value / $factor;
}

function justice_tools_shift_month( string $key, int $delta ): string {
	list( $y, $m ) = array_map( 'intval', explode( '-', $key ) );
	$total = $y * 12 + ( $m - 1 ) + $delta;
	return sprintf( '%04d-%02d', intdiv( $total, 12 ), $total % 12 + 1 );
}

function justice_tools_latest_rate( array $rows ): array {
	return $rows[ count( $rows ) - 1 ] ?? array( 'from' => '', 'rate' => null );
}

/** The last private-sector havraa day price and the year it is for. */
function justice_tools_havraa_latest( array $hv ): array {
	$rates = $hv['private_rates'] ?? array();
	$last  = $rates ? $rates[ count( $rates ) - 1 ] : array( 'from' => '', 'rate' => 0 );
	return array( 'rate' => (float) $last['rate'], 'year' => substr( (string) $last['from'], 0, 4 ), 'row' => $last );
}

function justice_tools_public_rate( array $hv, int $year ): ?array {
	foreach ( $hv['public_rates'] ?? array() as $row ) {
		if ( (int) $row['year'] === $year ) {
			return $row;
		}
	}
	return null;
}

/** The small-claims ceiling in force today (the last row of the registry). */
function justice_tools_sc_ceiling( array $sc ): array {
	$rows = $sc['ceiling'] ?? array();
	return $rows ? $rows[ count( $rows ) - 1 ] : array( 'from' => '', 'amount' => 0 );
}

/** Today's civil date in Israel (Y-m-d), not the UTC date (HAD-502). Tests pin it with the JUSTICE_TOOLS_TODAY constant. */
function justice_tools_today(): string {
	if ( defined( 'JUSTICE_TOOLS_TODAY' ) ) {
		return (string) JUSTICE_TOOLS_TODAY;
	}
	try {
		return ( new DateTimeImmutable( 'now', new DateTimeZone( 'Asia/Jerusalem' ) ) )->format( 'Y-m-d' );
	} catch ( Exception $e ) {
		return gmdate( 'Y-m-d' );
	}
}

/** True once the registry's next_update date has come with no newer ceiling row (the ceiling is re-indexed each 1 January). */
function justice_tools_sc_ceiling_unknown( array $sc ): bool {
	$ceil = justice_tools_sc_ceiling( $sc );
	$next = (string) ( $sc['next_update'] ?? '' );
	return '' !== $next && justice_tools_today() >= $next && (string) $ceil['from'] < $next;
}

/** Reg. 6(a): 1% rounded UP to a multiple of 5 ₪, never below 50 ₪ (the same rule as tviot-engine.js). */
function justice_tools_sc_fee( array $sc, float $amount ): float {
	$step = (int) $sc['fee']['round_up_to'] * 100;
	$pct  = (int) round( $amount * 100 ) * (float) $sc['fee']['pct'] / 100;
	$fee  = (int) ( ceil( $pct / $step - 1e-9 ) * $step );
	return max( $fee, (int) $sc['fee']['min'] * 100 ) / 100;
}

/** The 2-3 sentence answer box (page standard A2), every number read from the registry. */
function justice_tools_answer( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'chozeh-schirut' === $name && ! empty( $reg['rent_contract'] ) ) {
		$rc   = $reg['rent_contract'];
		$snap = justice_tools_snapshot( 'chozeh-schirut' );
		$text = '<strong>חוזה שכירות לדירה</strong> נערך בכתב ומפרט גם פגמים ידועים (סעיפים 25ב ו-25ג ל' . esc_html( $rc['law_he'] ) . '). '
			. 'ערובה שעולה כסף לשוכר מוגבלת לנמוך מבין שכר הדירה לשליש מהתקופה ו-<bdi>' . (int) $rc['deposit']['months'] . '</bdi> חודשי שכירות (סעיף 25י(ב)'
			. ( isset( $snap['input']['rent'] ) ? '; בשכר דירה של ' . justice_tools_money( $snap['input']['rent'], 0 ) . ' לחודש, לשנה: ' . justice_tools_money( $snap['total'], 0 ) : '' ) . '), וחוזרת תוך <bdi>' . (int) $rc['deposit']['return_days'] . '</bdi> ימים (סעיף 25י(ה)). '
			. 'המשכיר מתקן ליקוי תוך <bdi>' . (int) $rc['repairs']['days'] . '</bdi> ימים, דחוף תוך <bdi>' . (int) $rc['repairs']['urgent_days'] . '</bdi> (סעיף 25ח(ב)). נבדק ' . esc_html( justice_tools_he_date( $rc['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'pitzuyim' === $name && ! empty( $reg['severance'] ) ) {
		$sv   = $reg['severance'];
		$text = '<strong>פיצויי פיטורים</strong> הם משכורת חודש לכל שנת עבודה, וחלק יחסי לחלק משנה, אחרי שנת עבודה אחת (סעיפים 1 ו-12 ל' . esc_html( $sv['law_he'] ) . '). '
			. 'בסעיף 14 הקופה באה במקום <bdi>' . (int) $sv['approval']['partial_pct'] . '%</bdi> או <bdi>' . (int) $sv['approval']['full_pct'] . '%</bdi> מהפיצויים (האישור הכללי). הודעה מוקדמת אחרי שנה: חודש (סעיף 3 לחוק הודעה מוקדמת). '
			. 'פטור ממס עד משכורת חודש לשנה, ולא יותר מ-' . justice_tools_money( $sv['tax']['ceiling'], 0 ) . ' לשנה ב-' . (int) $sv['tax']['year'] . ' (' . esc_html( $sv['tax']['section'] ) . ' לפקודה). נבדק ' . esc_html( justice_tools_he_date( $sv['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'mas-shevach' === $name && ! empty( $reg['shevach'] ) ) {
		$sh   = $reg['shevach'];
		$text = '<strong>מס שבח</strong> משלמים על הרווח הריאלי ממכירת דירה: <bdi>' . (int) $sh['rates']['post2012'] . '%</bdi> על החלק שמ-2012 (' . esc_html( $sh['rate_sections']['post2012'] ) . '), ושיעורים אחרים לפני כן. '
			. 'דירה יחידה שבבעלותכם <bdi>' . (int) $sh['single']['hold_months'] . '</bdi> חודשים פטורה עד ' . justice_tools_money( $sh['single']['ceiling'], 0 ) . ' (סעיפים 49ב(2) ו-49א(א1)), '
			. 'ובדירת מגורים שנקנתה לפני 2014 החלק שעד 1.1.2014 פטור (' . esc_html( $sh['rate_sections']['linear'] ) . '). מצהירים תוך <bdi>' . (int) $sh['deadlines']['declare_days'] . '</bdi> ימים (' . esc_html( $sh['deadlines']['declare_section'] ) . ') ומשלמים תוך <bdi>' . (int) $sh['deadlines']['pay_days'] . '</bdi> (' . esc_html( $sh['deadlines']['pay_section'] ) . '). נבדק ' . esc_html( justice_tools_he_date( $sh['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'yerusha' === $name && ! empty( $reg['yerusha'] ) ) {
		$y    = $reg['yerusha'];
		$text = '<strong>ירושה על פי דין</strong> חלה כשאין צוואה: בן הזוג נוטל את המיטלטלין של משק הבית ואת המכונית, ומשאר העיזבון '
			. esc_html( justice_tools_fraction_he( $y['spouse_half'] ) ) . ' אם יש ילדים או הורה, ' . esc_html( justice_tools_fraction_he( $y['spouse_two_thirds'] ) ) . ' אם יש רק אחים או סבים, והכול אם אין אף אחד מהם (סעיף 11 ל' . esc_html( $y['law_he'] ) . '). '
			. 'הילדים חולקים בשווה, וילד שנפטר לפני המוריש מוחלף בילדיו (סעיפים 13 ו-14). '
			. 'האגרה לבקשה לצו ירושה היא ' . justice_tools_money( $y['fees']['order_fee'], 0 ) . ' ב-' . esc_html( substr( (string) $y['fees']['from'], 0, 4 ) ) . ', ובהגשה מקוונת ' . justice_tools_money( $y['payments']['online_fee'], 0 ) . ', ועליה נוספות הוצאות פרסום של ' . justice_tools_money( $y['payments']['publication'], 0 ) . '. '
			. 'נבדק ' . esc_html( justice_tools_he_date( $y['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'mas-rechisha' === $name && ! empty( $reg['purchase_tax'] ) ) {
		$pt     = $reg['purchase_tax'];
		$single = $pt['tracks']['single'];
		$add    = $pt['tracks']['additional'];
		$parts  = array();
		$low    = 0;
		foreach ( $single['brackets'] as $b ) {
			$parts[] = null === $b[0] ? '<bdi>' . esc_html( (string) $b[1] ) . '%</bdi> מעל' : '<bdi>' . esc_html( (string) $b[1] ) . '%</bdi> עד ' . justice_tools_money( $b[0], 0 );
		}
		$snap = justice_tools_snapshot( 'mas-rechisha' );
		$text = '<strong>מס רכישה על דירה יחידה</strong>: ' . implode( ', ', $parts ) . '. המדרגות קפואות עד ' . esc_html( justice_tools_he_date( $single['to'] ) ) . ' (הוראת ביצוע 1/2025 של ' . esc_html( $pt['publisher_he'] ) . '). '
			. 'על דירה נוספת: <bdi>' . esc_html( (string) $add['brackets'][0][1] ) . '%</bdi> עד ' . justice_tools_money( $add['brackets'][0][0], 0 ) . ' ו-<bdi>' . esc_html( (string) $add['brackets'][1][1] ) . '%</bdi> מעל, עד ' . esc_html( justice_tools_he_date( $add['to'] ) ) . '. '
			. ( isset( $snap['input']['price'] ) ? 'על דירה יחידה של ' . justice_tools_money( $snap['input']['price'], 0 ) . ': ' . justice_tools_money( $snap['total'] ) . '. ' : '' )
			. 'נבדק ' . esc_html( justice_tools_he_date( $pt['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'hetel-hashbacha' === $name && ! empty( $reg['betterment'] ) ) {
		$b    = $reg['betterment'];
		$text = '<strong>היטל השבחה</strong> הוא ' . esc_html( justice_tools_fraction_he( $b['rates']['regular']['rate'] ) ) . ' מעליית השווי שנגרמה מתוכנית, מהקלה או משימוש חורג (' . esc_html( $b['rates']['regular']['section'] ) . ' לתוספת השלישית), ו' . esc_html( justice_tools_fraction_he( $b['rates']['pinui']['rate'] ) ) . ' בפינוי ובינוי למגורים. '
			. 'משלמים לכל המאוחר במימוש: מכירה, היתר בנייה או תחילת שימוש. '
			. 'על שומה אפשר להשיג תוך <bdi>' . (int) $b['appeal_days'] . '</bdi> ימים (על לוח שומה: שנה מהצגתו), ובחיוב של עד ' . justice_tools_money( $b['recheck_max'], 0 ) . ', כשחולקים רק על הסכום, גם לבקש מהוועדה לבחון מחדש. '
			. 'נבדק ' . esc_html( justice_tools_he_date( $b['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'tzavaa' === $name && ! empty( $reg['will_cost'] ) ) {
		$w    = $reg['will_cost'];
		$rf   = $w['registrar'];
		$nf   = $w['notary'];
		$text = '<strong>כמה עולה צוואה</strong>: בכתב יד או בעדים אין אגרה. בפני רשם לענייני ירושה ' . justice_tools_money( $rf['will_before_registrar'], 0 ) . '. בפני נוטריון ' . justice_tools_money( $nf['will_first'], 0 ) . ' לחותם הראשון ו-' . justice_tools_money( $nf['will_additional'], 0 ) . ' לכל חותם נוסף, ועוד מע"מ <bdi>' . (int) $w['vat']['pct'] . '%</bdi>. '
			. 'הפקדה אצל הרשם ' . justice_tools_money( $rf['deposit'], 0 ) . ', ופטורה כשלא הופקדה צוואה קודמת ב-<bdi>' . (int) $rf['deposit_free_years'] . '</bdi> השנים שלפני. '
			. 'אחרי הפטירה: בקשה לצו קיום ' . justice_tools_money( $rf['order'], 0 ) . ', או ' . justice_tools_money( $rf['payments']['online_fee'], 0 ) . ' בהגשה מקוונת, ועוד ' . justice_tools_money( $rf['payments']['publication'], 0 ) . ' הוצאות פרסום. התעריפים מ-' . esc_html( justice_tools_he_date( $rf['from'] ) ) . ', נבדק ' . esc_html( justice_tools_he_date( $w['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'teunat-drachim' === $name && ! empty( $reg['car_accident'] ) ) {
		$c    = $reg['car_accident'];
		$np   = $c['nonpecuniary'];
		$fs   = $c['fees']['stages'];
		$text = '<strong>פיצוי על כאב וסבל בתאונת דרכים</strong> נקבע בנוסחה שבתקנות: <bdi>' . (int) $np['disability_pct_per_pct'] . '%</bdi> מהסכום המקסימלי לכל אחוז נכות לצמיתות, פחות <bdi>' . (int) $np['age_pct_per_year'] . '%</bdi> לכל שנת גיל מעל ' . (int) $np['age_from'] . ', ועוד <bdi>' . esc_html( (string) ( $np['hospital_permille'] / 10 ) ) . '%</bdi> לכל יום אשפוז. '
			. 'עורך דין יכול לגבות עד <bdi>' . (int) $fs['none']['pct'] . '%</bdi> בלי תביעה, <bdi>' . (int) $fs['settle']['pct'] . '%</bdi> בפשרה אחרי תביעה ו-<bdi>' . (int) $fs['judgment']['pct'] . '%</bdi> בפסק דין, ועוד מע"מ. '
			. 'לא משנה מי אשם בתאונה (סעיף 2(ג)), והתביעה מתיישנת <bdi>' . (int) $c['limitation']['years'] . '</bdi> שנים מיום התאונה, ולמי שהיה קטין ביום התאונה מגיל 18 (סעיפים 5(1) ו-10 לחוק ההתיישנות). נבדק ' . esc_html( justice_tools_he_date( $c['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'gerushin' === $name && ! empty( $reg['divorce_cost'] ) ) {
		$d    = $reg['divorce_cost'];
		$rb   = $d['rabbinical'];
		$fc   = $d['family'];
		$ds   = $d['disputes'];
		if ( 'lawyer' === $mode && ! empty( $d['bar'] ) ) {
			// HAD-532: the head-term answer. Who the lawyer is, where the case runs, the bar's minimum per service with
			// its item, the free mediation-unit meetings. Every number from the dated registry, each with its source.
			$bar  = $d['bar'];
			$text = '<strong>עורך דין גירושין</strong> מייצג את אחד מבני הזוג: מנסח הסכם גירושין ומביא אותו לאישור, או מנהל את התביעות על ילדים, מזונות ורכוש בבית המשפט לענייני משפחה או בבית הדין הרבני. גט בין יהודים ניתן רק בבית הדין הרבני. '
				. 'התעריף המינימלי המומלץ של לשכת עורכי הדין, לכל צד ולפני מע"מ: ' . justice_tools_money( $bar['get_consent'], 0 ) . ' לסידור גט בהסכמה (' . esc_html( $bar['items']['get_consent'] ) . '), ' . justice_tools_money( $bar['get_contested'], 0 ) . ' לתביעה לגט בלי הסכמה (' . esc_html( $bar['items']['get_contested'] ) . ') ולא פחות מ-' . justice_tools_money( $bar['agreement_min'], 0 ) . ' לעריכת הסכם לפסק הגט (' . esc_html( $bar['items']['agreement'] ) . '). זו המלצה שאינה מחייבת, ושכר הטרחה נקבע בהסכם עם עורך הדין. '
				. 'לפני תביעה במחלוקת: עד <bdi>' . (int) $ds['meetings_max'] . '</bdi> פגישות ביחידת הסיוע בלי תשלום (' . esc_html( $ds['sections']['meetings'] ) . ' ל' . esc_html( $ds['law_he'] ) . '). נבדק ' . esc_html( justice_tools_he_date( $d['checked_on'] ) ) . '.';
			return '<div class="jtool-answer"><p>' . $text . '</p></div>';
		}
		$text = '<strong>כמה עולה גירושין</strong> באגרות: בהסכמה, בבית הדין הרבני, ' . justice_tools_money( $rb['agreement'], 0 ) . ' כדי לתת להסכם תוקף של פסק דין, סידור הגט בלי אגרה כששני בני הזוג בארץ, ו-' . justice_tools_money( $rb['certificate'], 0 ) . ' לתעודת גירושין לכל צד. '
			. 'במחלוקת: בקשה ליישוב סכסוך ' . justice_tools_money( $rb['request'], 0 ) . ' (' . justice_tools_money( $fc['request'], 0 ) . ' בבית המשפט לענייני משפחה), תביעת גירושין ' . justice_tools_money( $rb['divorce'], 0 ) . ', ותביעה רכושית ' . justice_tools_money( $rb['property'], 0 ) . ' בבית הדין או ' . justice_tools_money( $fc['property'], 0 ) . ' בבית המשפט. '
			. 'לפני תביעה: עד <bdi>' . (int) $ds['meetings_max'] . '</bdi> פגישות ביחידת הסיוע בלי תשלום, ו-<bdi>' . (int) $ds['stay_days'] . '</bdi> ימים שבהם אי אפשר לתבוע. נבדק ' . esc_html( justice_tools_he_date( $d['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( in_array( $name, justice_tools_world_names(), true ) ) {
		return justice_tools_world_answer( $name );
	}
	if ( in_array( $name, array( 'mezonot', 'izun', 'heskem-mamon', 'heskem-gerushin' ), true ) ) {
		return justice_tools_family_answer( $name, $mode );
	}
	if ( 'havraa' === $name && ! empty( $reg['havraa'] ) ) {
		$hv     = $reg['havraa'];
		$latest = justice_tools_havraa_latest( $hv );
		$days   = $hv['days'];
		$pub    = justice_tools_public_rate( $hv, (int) $latest['year'] );
		$text   = '<strong>דמי הבראה ' . esc_html( $latest['year'] ) . ' במגזר הפרטי</strong>: ' . justice_tools_money( $latest['rate'] ) . ' ליום הבראה, לפי ' . esc_html( preg_replace( '/^צו הרחבה בדבר השתתפות המעסיק בהוצאות הבראה ונופש, /', 'צו ההרחבה שפורסם ב', (string) $latest['row']['source_he'] ) ) . '. '
			. 'מספר הימים לפי ותק: <bdi>' . (int) $days[0][2] . '</bdi> בשנה הראשונה ועד <bdi>' . (int) $days[ count( $days ) - 1 ][2] . '</bdi> משנה <bdi>' . (int) $days[ count( $days ) - 1 ][0] . '</bdi>, במשרה חלקית באופן יחסי, והזכאות מתחילה רק אחרי שנת עבודה מלאה. '
			. ( $pub ? 'בשירות הציבורי ערך יום ההבראה ל-' . esc_html( $latest['year'] ) . ' הוא ' . justice_tools_money( $pub['rate'], 1 ) . ' (' . esc_html( preg_replace( '/,.*$/', '', (string) $pub['source_he'] ) ) . ', ' . esc_html( $pub['scope_he'] ) . '). ' : '' )
			. 'נבדק ' . esc_html( justice_tools_he_date( $hv['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'tviot-ktanot' === $name && ! empty( $reg['small_claims'] ) ) {
		$sc   = $reg['small_claims'];
		$ceil = justice_tools_sc_ceiling( $sc );
		$f    = $sc['fee'];
		if ( justice_tools_sc_ceiling_unknown( $sc ) ) {
			// Past the 1 January update with no new row: say what was checked, never present it as today's ceiling.
			$text = '<strong>תקרת התביעות הקטנות מתעדכנת ב-1 בינואר לפי המדד</strong>, והתקרה החדשה עוד לא נבדקה כאן. התקרה שנבדקה אחרונה: ' . justice_tools_money( $ceil['amount'], 0 ) . ' מ-' . esc_html( justice_tools_he_date( $ceil['from'] ) ) . '. '
				. 'האגרה היא <bdi>' . esc_html( (string) $f['pct'] ) . '%</bdi> מסכום התביעה, מעוגלת כלפי מעלה לכפולה של <bdi>' . (int) $f['round_up_to'] . '</bdi> ₪, ולא פחות מ-' . justice_tools_money( $f['min'], 0 ) . ' (' . esc_html( $f['section'] ) . ' לתקנות שיפוט בתביעות קטנות). '
				. 'בדקו את התקרה העדכנית באתר ' . esc_html( $sc['publisher_he'] ) . '. נבדק ' . esc_html( justice_tools_he_date( $sc['checked_on'] ) ) . '.';
			return '<div class="jtool-answer"><p>' . $text . '</p></div>';
		}
		if ( 'fee' === $mode ) {
			$example = (float) ( justice_tools_snapshot( 'tviot-ktanot' )['input']['amount'] ?? 0 );
			$text    = '<strong>אגרת תביעה קטנה</strong> היא <bdi>' . esc_html( (string) $f['pct'] ) . '%</bdi> מסכום התביעה, מעוגלת כלפי מעלה לכפולה של <bdi>' . (int) $f['round_up_to'] . '</bdi> ₪ ולא פחות מ-' . justice_tools_money( $f['min'], 0 ) . ': על ' . justice_tools_money( $example, 0 ) . ' משלמים ' . justice_tools_money( justice_tools_sc_fee( $sc, $example ), 0 )
				. ', ועל התקרה, ' . justice_tools_money( $ceil['amount'], 0 ) . ' (מ-' . esc_html( justice_tools_he_date( $ceil['from'] ) ) . '), ' . justice_tools_money( justice_tools_sc_fee( $sc, (float) $ceil['amount'] ), 0 ) . '. '
				. 'המקור: ' . esc_html( $f['section'] ) . ' ל' . esc_html( $f['regulation_he'] ) . ' ומדריך האגרות של ' . esc_html( $sc['publisher_he'] ) . '. נבדק ' . esc_html( justice_tools_he_date( $sc['checked_on'] ) ) . '.';
			return '<div class="jtool-answer"><p>' . $text . '</p></div>';
		}
		$text = '<strong>תביעה קטנה אפשר להגיש עד ' . justice_tools_money( $ceil['amount'], 0 ) . '</strong> מ-' . esc_html( justice_tools_he_date( $ceil['from'] ) ) . ' (הודעת מנהל בתי המשפט, <bdi>' . esc_html( justice_tools_he_date( $ceil['notice_date'] ) ) . '</bdi>). '
			. 'האגרה היא <bdi>' . esc_html( (string) $f['pct'] ) . '%</bdi> מסכום התביעה, מעוגלת כלפי מעלה לכפולה של <bdi>' . (int) $f['round_up_to'] . '</bdi> ₪, ולא פחות מ-' . justice_tools_money( $f['min'], 0 ) . ' (' . esc_html( $f['section'] ) . ' לתקנות שיפוט בתביעות קטנות). '
			. 'רק יחיד יכול לתבוע, כולל עוסק פטור או מורשה; חברה בע"מ לא. נבדק ' . esc_html( justice_tools_he_date( $sc['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'hatzmada' === $name && ! empty( $reg['cpi'] ) ) {
		$cpi      = $reg['cpi'];
		$latest   = $cpi['latest_month'];
		$year_ago = justice_tools_shift_month( $latest, -12 );
		$now      = justice_tools_cpi_chained( $cpi, $latest );
		$then     = justice_tools_cpi_chained( $cpi, $year_ago );
		$change   = ( $now && $then ) ? round( ( $now / $then - 1 ) * 100, 1 ) : null;
		$value    = null;
		foreach ( $cpi['series'] as $row ) {
			if ( $row[0] === $latest ) {
				$value = $row[1];
			}
		}
		$base   = end( $cpi['bases'] );
		$linked = justice_tools_latest_rate( $reg['interest']['linked'] );
		$text   = '<strong>מחשבון הצמדה למדד</strong> מחשב כמה שווה היום סכום מתאריך קודם, לפי מדד המחירים לצרכן של הלמ"ס. '
			. 'המדד האחרון שפורסם הוא מדד ' . esc_html( justice_tools_he_month( $latest ) ) . ': <bdi>' . esc_html( (string) $value ) . '</bdi> נקודות בבסיס ממוצע ' . esc_html( $base['id'] )
			. ( null !== $change ? ', שינוי של <bdi>' . esc_html( number_format( $change, 1 ) ) . '%</bdi> לעומת ' . esc_html( justice_tools_he_month( $year_ago ) ) : '' ) . '. '
			. 'על חוב שנפסק נוספת ריבית צמודה של <bdi>' . esc_html( (string) $linked['rate'] ) . '%</bdi> לשנה מ-' . esc_html( justice_tools_he_date( $linked['from'] ) ) . ' (החשב הכללי). '
			. 'נבדק ' . esc_html( justice_tools_he_date( $reg['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	if ( 'sachar-minimum' === $name && ! empty( $reg['min_wage'] ) ) {
		$mw  = $reg['min_wage'];
		$row = $mw['rows'][ count( $mw['rows'] ) - 1 ];
		$text = '<strong>שכר המינימום בישראל מ-' . esc_html( justice_tools_he_date( $row['from'] ) ) . '</strong> הוא ' . justice_tools_money( $row['monthly'] ) . ' לחודש במשרה מלאה, '
			. justice_tools_money( $row['hourly_182'] ) . ' לשעה בהיקף של 182 שעות בחודש ו-' . justice_tools_money( $row['hourly_186'] ) . ' לשעה לפי 186 שעות, '
			. justice_tools_money( $row['daily_5'] ) . ' ליום בשבוע של 5 ימים ו-' . justice_tools_money( $row['daily_6'] ) . ' בשבוע של 6 ימים. '
			. 'המקור: ' . esc_html( $mw['publisher_he'] ) . ', נבדק ' . esc_html( justice_tools_he_date( $mw['checked_on'] ) ) . '.';
		return '<div class="jtool-answer"><p>' . $text . '</p></div>';
	}
	return '';
}

function justice_tools_stamp( string $name, string $mode = '' ): string {
	$reg = justice_tools_registry();
	if ( 'chozeh-schirut' === $name ) {
		$rc = $reg['rent_contract'] ?? array();
		return 'חוק השכירות, נוסח ל-' . justice_tools_he_date( $rc['law_current_to'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $rc['checked_on'] ?? '' );
	}
	if ( 'pitzuyim' === $name ) {
		$sv = $reg['severance'] ?? array();
		return 'תקרת פטור ' . number_format( (float) ( $sv['tax']['ceiling'] ?? 0 ) ) . ' ₪ ב-' . ( $sv['tax']['year'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $sv['checked_on'] ?? '' );
	}
	if ( 'mas-shevach' === $name ) {
		$sh = $reg['shevach'] ?? array();
		return 'תקרת פטור ' . number_format( (float) ( $sh['single']['ceiling'] ?? 0 ) ) . ' ₪ עד ' . justice_tools_he_date( $sh['single']['ceiling_to'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $sh['checked_on'] ?? '' );
	}
	if ( in_array( $name, justice_tools_world_names(), true ) ) {
		return justice_tools_world_stamp( $name );
	}
	if ( in_array( $name, array( 'mezonot', 'izun', 'heskem-mamon', 'heskem-gerushin' ), true ) ) {
		return justice_tools_family_stamp( $name, $mode );
	}
	if ( 'yerusha' === $name ) {
		$y = $reg['yerusha'] ?? array();
		return 'חוק הירושה · צו ירושה ' . number_format( (float) ( $y['fees']['order_fee'] ?? 0 ) ) . ' ₪ ב-' . substr( (string) ( $y['fees']['from'] ?? '' ), 0, 4 ) . ' · נבדק ' . justice_tools_he_date( $y['checked_on'] ?? '' );
	}
	if ( 'mas-rechisha' === $name ) {
		$pt = $reg['purchase_tax'] ?? array();
		return 'מדרגות עד ' . justice_tools_he_date( $pt['tracks']['single']['to'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $pt['checked_on'] ?? '' );
	}
	if ( 'hetel-hashbacha' === $name ) {
		return 'התוספת השלישית · נבדק ' . justice_tools_he_date( $reg['betterment']['checked_on'] ?? '' );
	}
	if ( 'gerushin' === $name ) {
		if ( 'lawyer' === $mode ) {
			return 'תעריף לשכת עורכי הדין והאגרות · נבדק ' . justice_tools_he_date( $reg['divorce_cost']['checked_on'] ?? '' );
		}
		return 'אגרות בית הדין ובית המשפט 2026 · נבדק ' . justice_tools_he_date( $reg['divorce_cost']['checked_on'] ?? '' );
	}
	if ( 'tzavaa' === $name ) {
		$w = $reg['will_cost'] ?? array();
		return 'אגרות ותעריף נוטריונים מ-' . justice_tools_he_date( $w['registrar']['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $w['checked_on'] ?? '' );
	}
	if ( 'teunat-drachim' === $name ) {
		$c   = $reg['car_accident'] ?? array();
		$nii = $c['earnings']['nii'] ?? array();
		$nii = $nii ? $nii[ count( $nii ) - 1 ] : array( 'from' => '' );
		return 'תקנות 1976 · שכר ממוצע מ-' . justice_tools_he_date( $nii['from'] ) . ' · נבדק ' . justice_tools_he_date( $c['checked_on'] ?? '' );
	}
	if ( 'havraa' === $name ) {
		$latest = justice_tools_havraa_latest( $reg['havraa'] ?? array() );
		return number_format( $latest['rate'], 2 ) . ' ₪ לשנת ' . $latest['year'] . ' · נבדק ' . justice_tools_he_date( $reg['havraa']['checked_on'] ?? '' );
	}
	if ( 'tviot-ktanot' === $name ) {
		$sc   = $reg['small_claims'] ?? array();
		$ceil = justice_tools_sc_ceiling( $sc );
		if ( 'fee' === $mode ) {
			return $sc['fee']['pct'] . '% · מינימום ' . $sc['fee']['min'] . ' ₪ · נבדק ' . justice_tools_he_date( $sc['checked_on'] ?? '' );
		}
		return 'תקרה ' . number_format( (float) $ceil['amount'] ) . ' ₪ מ-' . justice_tools_he_date( $ceil['from'] ) . ' · נבדק ' . justice_tools_he_date( $sc['checked_on'] ?? '' )
			. ( justice_tools_sc_ceiling_unknown( $sc ) ? ' · ייתכן שהתקרה התעדכנה' : '' );
	}
	if ( 'hatzmada' === $name ) {
		$linked = justice_tools_latest_rate( $reg['interest']['linked'] ?? array() );
		return 'מדד ' . justice_tools_he_month( $reg['cpi']['latest_month'] ?? '' ) . ' · ריבית מ-' . justice_tools_he_date( $linked['from'] ) . ' · נבדק ' . justice_tools_he_date( $reg['checked_on'] ?? '' );
	}
	$rows = $reg['min_wage']['rows'] ?? array();
	$last = end( $rows );
	return 'בתוקף מ-' . justice_tools_he_date( $last['from'] ?? '' ) . ' · נבדק ' . justice_tools_he_date( $reg['min_wage']['checked_on'] ?? '' );
}

/** Official sources used by the tool's result (anatomy part H). */
function justice_tools_sources( string $name ): array {
	$reg = justice_tools_registry();
	if ( in_array( $name, justice_tools_world_names(), true ) ) {
		return justice_tools_world_sources( $name );
	}
	if ( in_array( $name, array( 'mezonot', 'izun', 'heskem-mamon', 'heskem-gerushin' ), true ) ) {
		return justice_tools_family_sources( $name );
	}
	$checked = justice_tools_he_date( $reg['checked_on'] ?? '' );
	if ( 'chozeh-schirut' === $name ) {
		$rc      = $reg['rent_contract'];
		$checked = justice_tools_he_date( $rc['checked_on'] );
		return array(
			array( 'name' => $rc['law_he'], 'url' => $rc['law_url'], 'text' => 'סעיפים 25א עד 25טו (חוזה שכירות למגורים) והתוספות; סעיפים 6 עד 9, 14, 16 עד 22 (חיובי הצדדים). נוסח עדכני ל-' . justice_tools_he_date( $rc['law_current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $rc['amend_2017']['he'], 'url' => $rc['amend_2017']['url'], 'text' => $rc['amend_2017']['gazette_he'] . ': הוספת סימן ו\' לפרק א\'.' ),
			array( 'name' => $rc['amend_2026']['he'], 'url' => $rc['amend_2026']['url'], 'text' => $rc['amend_2026']['gazette_he'] . ': ' . $rc['amend_2026']['what_he'] . '.' ),
			array( 'name' => $rc['guarantee_law_he'], 'url' => $rc['guarantee_law_url'], 'text' => 'ערבות לחיובי השוכר, עד הסכום שבכתב הערבות.' ),
			array( 'name' => 'הכנסת, מאגר הצעות החוק', 'url' => $rc['bill']['url'], 'text' => $rc['bill']['found_he'] . '.' ),
		);
	}
	if ( 'pitzuyim' === $name ) {
		$sv      = $reg['severance'];
		$mw      = $reg['min_wage'];
		$checked = justice_tools_he_date( $sv['checked_on'] );
		return array(
			array( 'name' => $sv['law_he'], 'url' => $sv['law_url'], 'text' => 'סעיף 1: שנת עבודה ופיטורים; 3: פיטורים סמוך לסוף השנה; 6 עד 11: התפטרות שדינה כפיטורים; 12: חודש לכל שנה; 13ב: לא פחות משכר המינימום; 14: קופה במקום פיצויים. נוסח עדכני ל-' . justice_tools_he_date( $sv['law_current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $sv['regs_he'], 'url' => $sv['regs_url'], 'text' => 'תקנה 4: השכר האחרון; 7: עבודה חלקית; 10: הפסקות שלא נספרות; 12: העתקת מגורים.' ),
			array( 'name' => $sv['wage_regs_he'], 'url' => $sv['wage_regs_url'], 'text' => 'לעובד בשכר: חודש לכל שנה מ-' . justice_tools_he_date( $sv['wage_regs_from'] ) . '.' ),
			array( 'name' => $sv['approval']['he'], 'url' => $sv['approval']['url'], 'text' => $sv['approval']['full_he'] . '; ' . $sv['approval']['partial_he'] . ' (' . $sv['approval']['gazette_he'] . ').' ),
			array( 'name' => $sv['notice']['he'], 'url' => $sv['notice']['url'], 'text' => 'סעיף 3: משכורת חודשית; 4: שכר; 5: גם בהתפטרות; 6: תשלום במקום עבודה; 7: פיצוי כשאין הודעה; 8: אישור על תקופת העבודה.' ),
			array( 'name' => $sv['late']['he'], 'url' => $sv['late']['url'], 'text' => 'סעיף 20: המועד לתשלום הפיצויים, הלנה אחרי ' . $sv['late']['grace_days'] . ' ימים, ' . $sv['late']['monthly_pct'] . '% לחודש אחרי ' . $sv['late']['linkage_to_day'] . ' ימים.' ),
			array( 'name' => $sv['tax']['source_he'], 'url' => $sv['tax']['source_url'], 'text' => 'תקרת הפטור למענק פרישה: ' . number_format( (float) $sv['tax']['ceiling'] ) . ' ₪ לכל שנת עבודה ב-' . $sv['tax']['year'] . '. ' . $sv['tax']['frozen_he'] . '.' ),
			array( 'name' => $sv['tax']['law_he'], 'url' => $sv['tax']['law_url'], 'text' => $sv['tax']['section'] . ': פטור עד משכורת חודש לכל שנה, ולא יותר מהתקרה; המנהל רשאי לפטור עודף.' ),
			array( 'name' => $mw['source_name'], 'url' => $mw['source_url'], 'text' => 'שכר המינימום לרצפה של סעיף 13ב. נבדק ' . justice_tools_he_date( $mw['checked_on'] ) . '.' ),
			array( 'name' => $sv['limitation']['he'], 'url' => $sv['limitation']['url'], 'text' => $sv['limitation']['section'] . ': ' . $sv['limitation']['years'] . ' שנים.' ),
		);
	}
	if ( 'mas-shevach' === $name ) {
		$sh      = $reg['shevach'];
		$checked = justice_tools_he_date( $sh['checked_on'] );
		return array(
			array( 'name' => $sh['law_he'], 'url' => $sh['law_url'], 'text' => 'סעיף 39: ההוצאות; 47: מדד, סכום אינפלציוני, תקופות; 48א: שיעורי המס והחישוב הלינארי; 49 עד 49ג: פטור לדירה יחידה; 73: הצהרה; 87 ו-88: השגה וערר; 90א: תשלום. נבדק ' . $checked . '.' ),
			array( 'name' => $sh['source_name'], 'url' => $sh['source_url'], 'text' => 'תקרת הפטור ' . number_format( (float) $sh['single']['ceiling'] ) . ' ₪ מ-' . justice_tools_he_date( $sh['single']['ceiling_from'] ) . ' עד ' . justice_tools_he_date( $sh['single']['ceiling_to'] ) . '; מס יסף על מכירת דירה מעל ' . number_format( (float) $sh['surtax']['threshold'] ) . ' ₪.' ),
			array( 'name' => 'רשות המסים, לוח עזר לחישוב מס הכנסה ממשכורת ל-2026', 'url' => $sh['top_rate_url'], 'text' => 'שיעור המס הגבוה בסעיף 121: ' . $sh['rates']['pre2001'] . '%; מס יסף ' . $sh['surtax']['rate'] . '% מעל ' . number_format( (float) $sh['surtax']['income_threshold'] ) . ' ₪, ועוד ' . $sh['surtax']['capital_rate'] . '% על הכנסה הונית.' ),
			array( 'name' => $reg['cpi']['source_name'], 'url' => $reg['cpi']['official_calculator_url'], 'text' => 'מדד המחירים לצרכן ומקדמי הקישור, כמו במחשבון ההצמדה של הלמ"ס.' ),
			array( 'name' => 'רשות המסים, סימולטור מס שבח', 'url' => $sh['simulator_url'], 'text' => 'החישוב הרשמי לשומה העצמית.' ),
		);
	}
	if ( 'yerusha' === $name ) {
		$y       = $reg['yerusha'];
		$checked = justice_tools_he_date( $y['checked_on'] );
		return array(
			array( 'name' => $y['law_he'], 'url' => $y['law_url'], 'text' => 'סעיף 10: מי יורש; 11: בן הזוג (המיטלטלין, חצי, שני שלישים, הדירה אחרי 3 שנות נישואין, הכול); 12: סדר העדיפות; 13: חלקים שווים; 14: ילדים במקום מי שנפטר; 17: המדינה; 55: ידועים בציבור. נוסח עדכני ל-' . justice_tools_he_date( $y['law_current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $y['fees']['regulation_he'], 'url' => $y['fees']['url'], 'text' => $y['fees']['section'] . ': ' . number_format( (float) $y['fees']['order_fee'] ) . ' ₪ לבקשה לצו ירושה מ-' . justice_tools_he_date( $y['fees']['from'] ) . ', ' . $y['fees']['online_pct'] . '% בהגשה מקוונת; ' . $y['fees']['exempt_section'] . ': פטור לבני משפחה של מי שנפטר עקב פעולות איבה או בשירות צבאי. נוסח עדכני ל-' . justice_tools_he_date( $y['fees']['current_to'] ) . '.' ),
			array( 'name' => $y['regulations_he'], 'url' => $y['regulations_url'], 'text' => $y['objection_section'] . ': פרסום הבקשה והתנגדות בתוך ' . $y['objection_he'] . '; ' . $y['publication_section'] . ': הוצאות הפרסום על המבקש, חוץ ממי שפטור מאגרה.' ),
			array( 'name' => $y['payments']['he'], 'url' => $y['payments']['url'], 'text' => 'בקשה בהגשה מקוונת ' . number_format( (float) $y['payments']['online_fee'] ) . ' ₪; הוצאות פרסום ' . number_format( (float) $y['payments']['publication'] ) . ' ₪ לבקשה. נבדק ' . justice_tools_he_date( $y['payments']['checked_on'] ) . '.' ),
			array( 'name' => $y['service_he'], 'url' => $y['service_url'], 'text' => 'הגשה מקוונת של בקשה לצו ירושה, ובקשה משולבת לרישום בטאבו. נבדק ' . $checked . '.' ),
		);
	}
	if ( 'mas-rechisha' === $name ) {
		$pt      = $reg['purchase_tax'];
		$checked = justice_tools_he_date( $pt['checked_on'] );
		$r       = $pt['replacement'];
		return array(
			array( 'name' => $pt['source_name'], 'url' => $pt['source_url'], 'text' => 'מדרגות דירה יחידה ' . justice_tools_he_date( $pt['tracks']['single']['from'] ) . ' עד ' . justice_tools_he_date( $pt['tracks']['single']['to'] ) . '; עולה, תקנה 12א. נבדק ' . $checked . '.' ),
			array( 'name' => 'רשות המסים, הודעה לציבור מ-12.10.2026: הארכת הוראת השעה למס רכישה על דירה נוספת', 'url' => $pt['tracks']['additional']['url'], 'text' => '8% עד 6,055,070 ₪ ו-10% מעל, ברכישות עד ' . justice_tools_he_date( $pt['tracks']['additional']['to'] ) . ' (כולל), לפי סעיף 38 לחוק יסוד: הכנסת; גם לכל רוכש שאינו יחיד תושב ישראל.' ),
			array( 'name' => 'רשות המסים, הוראות ביצוע מיסוי מקרקעין 2/2024 ו-1/2025', 'url' => $pt['tracks']['single']['url_2025'], 'text' => 'אותן מדרגות מ-16.1.2024, והקפאתן עד 15.1.2028.' ),
			array( 'name' => $pt['law_he'], 'url' => $pt['law_url'], 'text' => 'סעיף 9(ג1ג)(2)-(4): דירה יחידה, חלופית, תושב, רוכש אחד, חלק של שליש; 9(ג1ו): דירה נוספת; 73(ג): הצהרה תוך ' . $pt['declare_days'] . ' יום; 90א: תשלום תוך ' . $pt['pay_days'] . ' יום; 94(א): הצמדה וריבית.' ),
			array( 'name' => $pt['regulations_he'], 'url' => $pt['regulations_url'], 'text' => 'תקנה 12א: עולה (0%, 0.5%, פעם אחת, עד ' . number_format( (float) $pt['tracks']['oleh']['max_value'] ) . ' ₪); תקנה 11(א): נכה (0.5% עד ' . number_format( (float) $pt['tracks']['disabled']['cap'] ) . ' ₪, פעמיים).' ),
			array( 'name' => $r['war']['source_he'], 'url' => $r['war']['url'], 'text' => $r['war']['law_he'] . ': תקופה שנוגעת ב-' . justice_tools_he_date( $r['war']['from'] ) . ' עד ' . justice_tools_he_date( $r['war']['to'] ) . ' מוארכת ב-' . $r['war']['add_months'] . ' חודשים, ולפחות עד ' . justice_tools_he_date( $r['war']['floor'] ) . '; 18 חודשים לרכישה עד 31.5.2025, 24 חודשים מ-1.6.2025.' ),
			array( 'name' => 'רשות המסים, הוראת ביצוע מיסוי מקרקעין 2/2016', 'url' => $r['contractor_later_url'], 'text' => $r['contractor_later_he'] . '.' ),
			array( 'name' => $pt['vat_he'], 'url' => $pt['vat_url'], 'text' => 'מע"מ ' . $pt['vat_pct'] . '% על שכר טרחה ודמי תיווך, מ-' . justice_tools_he_date( $pt['vat_from'] ) . '.' ),
		);
	}
	if ( 'gerushin' === $name ) {
		$d       = $reg['divorce_cost'];
		$rb      = $d['rabbinical'];
		$fc      = $d['family'];
		$ds      = $d['disputes'];
		$checked = justice_tools_he_date( $d['checked_on'] );
		return array(
			array( 'name' => $rb['regulation_he'], 'url' => $rb['url'], 'text' => 'התוספת הראשונה: גירושין ' . number_format( (float) $rb['divorce'] ) . ' ₪ (4(1)(א)), רכוש ' . number_format( (float) $rb['property'] ) . ' ₪ (4(1)(ב)), הסכם כפסק דין ' . number_format( (float) $rb['agreement'] ) . ' ₪ (4(2)), סידור גט פטור (4(3)(ג)), תעודה ' . number_format( (float) $rb['certificate'] ) . ' ₪ (4(4)(א)), ילדים ' . number_format( (float) $rb['custody'] ) . ' ₪ (7), יישוב סכסוך ' . number_format( (float) $rb['request'] ) . ' ₪ (19(טז)); מזונות: המגיש פטור (תקנה 14א); הפחתה בסיום מוקדם (תקנה 12). נוסח עדכני ל-' . justice_tools_he_date( $rb['current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $fc['regulation_he'], 'url' => $fc['url'], 'text' => 'רכוש בין בני זוג ' . number_format( (float) $fc['property'] ) . ' ₪ (2א), מזונות ' . number_format( (float) $fc['support'] ) . ' ₪ (5), אישור הסכם ' . number_format( (float) $fc['agreement'] ) . ' ₪ (6א), ילדים ' . number_format( (float) $fc['custody'] ) . ' ₪ (6ב), יישוב סכסוך ' . number_format( (float) $fc['request'] ) . ' ₪ (13), פרוטוקול ' . number_format( (float) $fc['transcript'] ) . ' ₪; מחצית בפשרה עד קדם המשפט (תקנה 8(ב)). נוסח עדכני ל-' . justice_tools_he_date( $fc['current_to'] ) . '.' ),
			array( 'name' => $ds['law_he'], 'url' => $ds['url'], 'text' => 'סעיף 3(א): בקשה ליישוב סכסוך קודם לתביעה; 3(ב): עד ' . $ds['meetings_max'] . ' פגישות מהו"ת בתוך ' . $ds['meetings_days'] . ' ימים (הארכה של ' . $ds['extend_days'] . '); 3(ה): ' . $ds['stay_days'] . ' או ' . $ds['stay_days_extended'] . ' ימים בלי תביעות; 4: מי שהגיש את הבקשה רשאי לתבוע ראשון, בתוך ' . $ds['claim_days'] . ' ימים, ואחר כך גם הצד השני. יום אחרון שחל ביום מנוחה עובר ליום שאחריו (' . $ds['interpretation_he'] . '). ' . $ds['permanent_he'] . '.' ),
			array( 'name' => $d['property_law']['law_he'], 'url' => $d['property_law']['url'], 'text' => 'סעיף 5: מחצית שווי הנכסים, בלי ' . $d['property_law']['excluded_he'] . '; 5(ג): כולל פנסיה וחסכונות; 6: ניכוי חובות ומחצית ההפרש; 5א: איזון מוקדם; 8: יחס אחר; 14: לא לנישאים לפני 1.1.1974.' ),
			array( 'name' => $d['bar']['rules_he'], 'url' => $d['bar']['url'], 'text' => 'פרט 8: גט בהסכמה ' . number_format( (float) $d['bar']['get_consent'] ) . ' ₪, גט בלי הסכמה ' . number_format( (float) $d['bar']['get_contested'] ) . ' ₪, החזקת ילדים ' . number_format( (float) $d['bar']['custody_agreed'] ) . ' או ' . number_format( (float) $d['bar']['custody_opposed'] ) . ' ₪, הסכם לפסק הגט לפחות ' . number_format( (float) $d['bar']['agreement_min'] ) . ' ₪. ' . $d['bar']['note_he'] . '.' ),
		);
	}
	if ( 'tzavaa' === $name ) {
		$w       = $reg['will_cost'];
		$rf      = $w['registrar'];
		$nf      = $w['notary'];
		$checked = justice_tools_he_date( $w['checked_on'] );
		return array(
			array( 'name' => $w['law_he'], 'url' => $w['law_url'], 'text' => 'סעיף 18: ארבע צורות; 19: בכתב יד; 20: בעדים; 21: הפקדה; 22: בפני רשות, ו-22(ז): נוטריון כמו שופט; 8א: צוואות הדדיות; 24 ו-35: מי יכול להיות עד; 39: צו קיום; 67 ו-67א: התנגדות. נבדק ' . $checked . '.' ),
			array( 'name' => $rf['regulation_he'], 'url' => $rf['url'], 'text' => 'פרט 1: בקשה לצו קיום ' . number_format( (float) $rf['order'] ) . ' ₪; פרט 4: צוואה בפני רשם ' . number_format( (float) $rf['will_before_registrar'] ) . ' ₪; פרט 5: הפקדה ' . number_format( (float) $rf['deposit'] ) . ' ₪, ופרט 5א: פטור בלי הפקדה קודמת ב-' . $rf['deposit_free_years'] . ' שנים; תקנה 1(א): ' . $rf['online_pct'] . '% בהגשה מקוונת. בנוסח מ-' . justice_tools_he_date( $rf['from'] ) . ' (' . $rf['gazette_he'] . ').' ),
			array( 'name' => $rf['payments']['he'], 'url' => $rf['payments']['url'], 'text' => 'בקשה לצו קיום בהגשה מקוונת ' . number_format( (float) $rf['payments']['online_fee'] ) . ' ₪; הוצאות פרסום ' . number_format( (float) $rf['payments']['publication'] ) . ' ₪ לבקשה. נבדק ' . justice_tools_he_date( $rf['payments']['checked_on'] ) . '.' ),
			array( 'name' => $nf['regulation_he'], 'url' => $nf['url'], 'text' => 'פרט 4: צוואה ' . number_format( (float) $nf['will_first'] ) . ' ₪ לחותם ראשון, ' . number_format( (float) $nf['will_additional'] ) . ' ₪ לכל חותם נוסף; פרט 3(א): תרגום; פרט 9: מחוץ למשרד ' . number_format( (float) $nf['outside_first_hour'] ) . ' ₪ לשעה הראשונה ו-' . number_format( (float) $nf['outside_half_hour'] ) . ' ₪ לכל חצי שעה; פרט 10: תוספת ' . $nf['night_pct'] . '% בלילה ובימי מנוחה; תקנה 1: ועוד מע"מ. בנוסח מ-' . justice_tools_he_date( $nf['from'] ) . ' (' . $nf['gazette_he'] . ').' ),
			array( 'name' => $nf['law_he'], 'url' => $nf['law_url'], 'text' => 'נוטריון שגובה יותר מהתעריף, או פחות בלי טעם מספיק, עובר עבירת משמעת.' ),
			array( 'name' => $w['regulations_he'], 'url' => $w['regulations_url'], 'text' => 'תקנה 6: הפקדה בהתייצבות אישית; תקנה 14: הבקשה לצו קיום; תקנה 17: פרסום באתר האפוטרופוס הכללי וברשומות, הוצאות הפרסום על המבקש (הסכום בתקנות לא קבוע; ' . number_format( (float) $w['registrar']['payments']['publication'] ) . ' ₪ לבקשה בשירות התשלומים הממשלתי).' ),
			array( 'name' => $w['vat']['he'], 'url' => $w['vat']['url'], 'text' => 'מע"מ ' . $w['vat']['pct'] . '% מ-' . justice_tools_he_date( $w['vat']['from'] ) . '.' ),
		);
	}
	if ( 'teunat-drachim' === $name ) {
		$c       = $reg['car_accident'];
		$np      = $c['nonpecuniary'];
		$nii     = $c['earnings']['nii'][ count( $c['earnings']['nii'] ) - 1 ];
		$checked = justice_tools_he_date( $c['checked_on'] );
		return array(
			array( 'name' => $c['law_he'], 'url' => $c['law_url'], 'text' => 'סעיף 2(ג): אחריות מוחלטת; 4(א)(1): תקרת הכנסה פי ' . $c['earnings']['ceiling_multiple'] . ' מהשכר הממוצע; 4(א)(2): ניכוי מס עד ' . $c['earnings']['tax_cap_pct'] . '%; 4(א)(3) ו-4(ב): הסכום המקסימלי, צמוד למדד; 5: תשלומים תכופים; 6א: מומחה מטעם בית המשפט; 7: מי לא זכאי; 16(א): תקרת שכר הטרחה. נוסח עדכני ל-' . justice_tools_he_date( $c['law_current_to'] ) . ', נבדק ' . $checked . '.' ),
			array( 'name' => $c['regs_he'], 'url' => $c['regs_url'], 'text' => 'תקנה 2(א)(1): ' . $np['hospital_permille'] . ' פרומיל לכל יום אשפוז; 2(א)(2): אחוז לכל אחוז נכות; 2(ב): עד ' . $np['no_permanent_max_pct'] . '% בלי נכות; 3: אחוז פחות לכל שנה מעל גיל ' . $np['age_from'] . '; 4: ' . $np['death_pct'] . '% במוות.' ),
			array( 'name' => $c['fees']['rules_he'], 'url' => $c['fees']['rules_url'], 'text' => 'כלל 2: ' . $c['fees']['stages']['judgment']['pct'] . '% מפסק דין; כלל 3: ' . $c['fees']['stages']['settle']['pct'] . '% בפשרה אחרי תביעה; כלל 4: ' . $c['fees']['stages']['none']['pct'] . '% בלי תביעה; כלל 5: מע"מ בנוסף.' ),
			array( 'name' => $nii['source_he'], 'url' => $nii['url'], 'text' => number_format( (float) $nii['s1'] ) . ' ₪ (סעיף 1) ו-' . number_format( (float) $nii['s2'] ) . ' ₪ (סעיף 2). נבדק ' . $checked . '.' ),
			array( 'name' => $c['limitation']['he'], 'url' => $c['limitation']['url'], 'text' => 'סעיף 5(1): ' . $c['limitation']['years'] . ' שנים; סעיף 10: הזמן עד גיל 18 לא נספר; סעיף 15א: 7.10.2023 עד 6.4.2024 לא נספרים.' ),
			array( 'name' => $c['nii_law_he'], 'url' => $c['nii_law_url'], 'text' => 'ניכוי גמלאות הביטוח הלאומי מהפיצויים.' ),
		);
	}
	if ( 'hetel-hashbacha' === $name ) {
		$b       = $reg['betterment'];
		$checked = justice_tools_he_date( $b['checked_on'] );
		return array(
			array( 'name' => $b['law_he'], 'url' => $b['law_url'], 'text' => 'סעיף 3: מחצית; 3א: רבע בפינוי ובינוי; 7: תשלום במימוש; 10(א): אין רישום בלי תשלום או ערובה; 11(א): שותפים; 14: ערר תוך ' . $b['appeal_days'] . ' ימים, שמאי מכריע, בחינה מחדש עד ' . number_format( (float) $b['recheck_max'] ) . ' ₪; 19(ב): ממ"ד, תמ"א 38, חיזוק; 19(ג): עד ' . $b['residence_max_sqm'] . ' מ"ר למגורים ו-' . $b['residence_sale_years'] . ' שנים. נוסח עדכני, נבדק ' . $checked . '.' ),
		);
	}
	if ( 'havraa' === $name ) {
		$hv  = $reg['havraa'];
		$out = array(
			array( 'name' => $hv['order_he'], 'url' => $hv['order_url'], 'text' => 'סעיף 5(א): ימים לפי ותק; 5(ב): שנה ראשונה; 5(ג): משרה חלקית; 5(ד): תשלום ב' . $hv['payment_months_he'] . '; 6: היעדרויות; 7(א): ביטול הגבלת השנתיים. נבדק ' . $checked . '.' ),
		);
		foreach ( $hv['private_rates'] as $row ) {
			$out[] = array( 'name' => $row['source_he'], 'url' => $row['url'], 'text' => number_format( (float) $row['rate'], 2 ) . ' ₪ ליום הבראה, ' . $row['label_he'] . '. נבדק ' . $checked . '.' );
		}
		foreach ( $hv['deductions'] as $d ) {
			$out[] = array( 'name' => $d['law_he'] . ' (' . $d['gazette_he'] . ')', 'url' => $d['url'], 'text' => 'הקפאת המחיר, ניכוי של יום הבראה אחד ב-' . $d['year'] . ' (חצי יום לשכר עד ' . number_format( (float) $d['half_salary_max'] ) . ' ₪ ב' . $d['half_months_he'] . '), והחלק שנוכה לא משולם אחר כך: ' . $d['sections'] . '.' );
		}
		foreach ( $hv['public_rates'] as $p ) {
			$out[] = array( 'name' => $p['source_he'], 'url' => $p['url'], 'text' => 'להשוואה בלבד: ' . number_format( (float) $p['rate'], 1 ) . ' ₪ ליום ב-' . $p['year'] . ' (' . $p['scope_he'] . ').' );
		}
		$out[] = array( 'name' => $hv['limitation_he'], 'url' => $hv['limitation_url'], 'text' => $hv['limitation_years'] . ' שנות התיישנות מיום שנולדה העילה.' );
		$out[] = array( 'name' => $hv['labor_court_he'], 'url' => $hv['labor_court_url'], 'text' => 'תביעה בין עובד למעסיק מוגשת לבית הדין האזורי לעבודה.' );
		return $out;
	}
	if ( 'tviot-ktanot' === $name ) {
		$sc   = $reg['small_claims'];
		$ceil = justice_tools_sc_ceiling( $sc );
		$dl   = $sc['deadlines'];
		return array(
			array( 'name' => $ceil['source_he'], 'url' => $ceil['url'], 'text' => number_format( (float) $ceil['amount'] ) . ' ₪ מ-' . justice_tools_he_date( $ceil['from'] ) . '. נבדק ' . $checked . '.' ),
			array( 'name' => $sc['fee']['regulation_he'], 'url' => $sc['fee']['regulation_url'], 'text' => 'תקנה 2: מקום השיפוט; 3: תוכן כתב התביעה; 4(ב): כתב הגנה תוך ' . $dl['defence_days'] . ' יום; 6(א): אגרה ' . $sc['fee']['pct'] . '%, מעוגלת כלפי מעלה לכפולה של ' . $sc['fee']['round_up_to'] . ' ₪, לפחות ' . $sc['fee']['min'] . ' ₪; 7(ב1): מסירה בידי התובע ' . $dl['plaintiff_service_days_before'] . ' יום לפני הדיון; 12: ביטול החלטה תוך ' . $dl['set_aside_days'] . ' יום.' ),
			array( 'name' => $sc['law_he'], 'url' => $sc['law_url'], 'text' => 'סעיף 60: מי תובע ועל מה, ויותר מ-' . $sc['max_claims_per_year'] . ' תביעות בשנה; 63: ייצוג ברשות בית המשפט; 64: ערעור ברשות.' ),
			array( 'name' => $sc['source_name'], 'url' => $sc['source_url'], 'text' => 'מדריך האגרות: התקרה והאגרה. נבדק ' . $checked . '.' ),
			array( 'name' => 'הרשות השופטת, הגשת תביעה קטנה', 'url' => $sc['service_url'], 'text' => 'מי יכול לתבוע; בדיקת מסירה וזימון עדים ' . $dl['service_check_days_before'] . ' יום לפני הדיון; מתורגמן ' . $dl['interpreter_days_before'] . ' ימים לפני; הגשה מקוונת עד ' . $sc['online_max_plaintiffs'] . ' תובעים ו-' . $sc['online_max_defendants'] . ' נתבעים.' ),
			array( 'name' => $sc['limitation_he'], 'url' => $sc['limitation_url'], 'text' => $sc['limitation_years'] . ' שנות התיישנות מיום שנולדה העילה.' ),
			array( 'name' => $sc['labor_court_he'], 'url' => $sc['labor_court_url'], 'text' => 'סכסוך בין עובד למעסיק: בית הדין לעבודה, לא תביעות קטנות.' ),
		);
	}
	if ( 'hatzmada' === $name ) {
		$cpi = $reg['cpi'];
		$int = $reg['interest'];
		$l   = justice_tools_latest_rate( $int['linked'] );
		$s   = justice_tools_latest_rate( $int['shekel'] );
		$f   = justice_tools_latest_rate( $int['arrears_fee'] );
		return array(
			array( 'name' => $cpi['source_name'], 'url' => $cpi['official_calculator_url'], 'text' => 'מדד ' . justice_tools_he_month( $cpi['latest_month'] ) . ' ומקדמי הקישור בין הבסיסים, כפי שמחשבון ההצמדה של הלמ"ס מיישם. נבדק ' . $checked . '.' ),
			array( 'name' => $int['source_name'], 'url' => $int['source_url'], 'text' => 'ריבית צמודה ' . $l['rate'] . '%, ריבית שקלית ' . $s['rate'] . '%, דמי פיגורים ' . $f['rate'] . '%, בתוקף מ-' . justice_tools_he_date( $l['from'] ) . ', ושיעורי הרבעונים מ-1.1.2025. נבדק ' . $checked . '.' ),
			array( 'name' => $int['law_he'], 'url' => $int['law_url'], 'text' => 'סעיפים 1, 2, 4א, 5, 5א, 6 (נוסח מעודכן ל-1.1.2025, אתר בנק ישראל).' ),
			array( 'name' => 'חוק פסיקת ריבית והצמדה (תיקון מס\' 9), התשפ"ד-2023', 'url' => $int['amendment_url'], 'text' => 'סעיף 117: הוראות מעבר לסכומים מלפני 1.1.2025 (ספר החוקים 3117).' ),
			array( 'name' => $int['regulations_he'], 'url' => $int['regulations_url'], 'text' => 'הנוסחה של כל שיעור ופרסומו בכל רבעון.' ),
		);
	}
	$mw  = $reg['min_wage'];
	$row = $mw['rows'][ count( $mw['rows'] ) - 1 ];
	return array(
		array( 'name' => $mw['source_name'], 'url' => $mw['source_url'], 'text' => number_format( (float) $row['monthly'], 2 ) . ' ₪ לחודש, ' . $row['hourly_182'] . ' ₪ לשעה (182 שעות), ' . $row['hourly_186'] . ' ₪ (186 שעות), בתוקף מ-' . justice_tools_he_date( $row['from'] ) . ', וכל השורות מ-' . justice_tools_he_date( $mw['rows'][0]['from'] ) . '. נבדק ' . justice_tools_he_date( $mw['checked_on'] ) . '.' ),
		array( 'name' => $mw['law_he'], 'url' => $mw['law_url'], 'text' => 'סעיפים 1, 2, 3, 8.' ),
		array( 'name' => $mw['youth_regulations_he'], 'url' => $mw['youth_regulations_url'], 'text' => 'תקנות 4 עד 6: ' . $mw['youth_pct']['under16'] . '%, ' . $mw['youth_pct']['age16'] . '%, ' . $mw['youth_pct']['age17'] . '%, חניך ' . $mw['youth_pct']['apprentice'] . '%, לשעה חלקי ' . $mw['youth_hours_divisor'] . '.' ),
	);
}

function justice_tools_sources_html( string $name ): string {
	$items = '';
	foreach ( justice_tools_sources( $name ) as $s ) {
		$items .= '<li><a href="' . esc_url( $s['url'] ) . '" target="_blank" rel="noopener">' . esc_html( $s['name'] ) . '</a>: ' . esc_html( $s['text'] ) . '</li>';
	}
	return '<ul>' . $items . '</ul>';
}

function justice_tools_rehearse_url( array $tool ): string {
	if ( empty( $tool['rehearse'] ) ) {
		return '';
	}
	if ( function_exists( 'justice_theme_article_simulation_url' ) ) {
		return justice_theme_article_simulation_url( $tool['rehearse']['topic'], $tool['rehearse']['purpose'] );
	}
	$topic = (string) ( $tool['rehearse']['topic'] ?? '' );
	return 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=' . rawurlencode( $tool['rehearse']['purpose'] ) . ( '' !== $topic && 'general' !== $topic ? '&topic=' . rawurlencode( $topic ) : '' );
}

/** The numbered stage bar of a combined tool; each stage is a link to its part of the instrument. */
function justice_tools_stages_html( array $tool, string $id ): string {
	if ( empty( $tool['stages'] ) ) {
		return '';
	}
	$items = '';
	foreach ( $tool['stages'] as $i => $stage ) {
		$target = in_array( $stage[1], array( 'result', 'next' ), true ) ? $id . '-' . $stage[1] : $stage[1];
		$items .= '<li><a href="#' . esc_attr( $target ) . '"><span class="jtool-stages__n" aria-hidden="true">' . ( $i + 1 ) . '</span><span class="jtool-stages__t">' . esc_html( $stage[0] ) . '</span></a></li>';
	}
	return '<nav class="jtool-stages" aria-label="שלבי הכלי"><ol>' . $items . '</ol></nav>';
}

/** Enqueue the stylesheet and the tool's bundle (35 KB gzipped budget; measured in the PR). */
function justice_tools_enqueue( string $name ): void {
	$css = JUSTICE_THEME_DIR . '/assets/css/justice-tools.css';
	wp_enqueue_style( 'justice-tools', JUSTICE_THEME_URI . '/assets/css/justice-tools.css', array(), is_readable( $css ) ? (string) filemtime( $css ) : JUSTICE_THEME_VERSION );
	$js = JUSTICE_THEME_DIR . '/assets/js/tools/dist/' . $name . '.js';
	if ( is_readable( $js ) ) {
		wp_enqueue_script( 'justice-tool-' . $name, JUSTICE_THEME_URI . '/assets/js/tools/dist/' . $name . '.js', array(), (string) filemtime( $js ), true );
	}
}

/** Enqueue in the head when the page body holds a tool, so the instrument paints styled. */
function justice_tools_early_enqueue(): void {
	if ( ! is_singular() ) {
		return;
	}
	$post = get_queried_object();
	if ( ! $post instanceof WP_Post ) {
		return;
	}
	if ( preg_match_all( '/\[justice_tool\s[^\]]*name="([a-z-]+)"/', (string) $post->post_content, $m ) ) {
		foreach ( array_unique( $m[1] ) as $name ) {
			if ( isset( justice_tools_catalog()[ $name ] ) ) {
				justice_tools_enqueue( $name );
			}
		}
	}
	// The divorce command center (HAD-541) prints eight instruments from one shortcode: their bundles and the tab script.
	if ( has_shortcode( (string) $post->post_content, 'justice_tools_command' ) ) {
		justice_tools_command_enqueue();
	}
	if ( has_shortcode( (string) $post->post_content, 'justice_tools_index' ) || has_shortcode( (string) $post->post_content, 'justice_tool_section' ) ) {
		$css = JUSTICE_THEME_DIR . '/assets/css/justice-tools.css';
		wp_enqueue_style( 'justice-tools', JUSTICE_THEME_URI . '/assets/css/justice-tools.css', array(), is_readable( $css ) ? (string) filemtime( $css ) : JUSTICE_THEME_VERSION );
	}
}
add_action( 'wp_enqueue_scripts', 'justice_tools_early_enqueue', 20 );

/** WebApplication JSON-LD (page standard C4): price 0, he-IL, no review or rating markup. */
function justice_tools_webapp_schema( string $name, array $tool ): string {
	$reg = justice_tools_registry();
	$url = function_exists( 'get_permalink' ) && get_permalink() ? get_permalink() : home_url( $tool['page'] );
	$schema = array(
		'@context'            => 'https://schema.org',
		'@type'               => 'WebApplication',
		'name'                => $tool['name'],
		'url'                 => $url,
		'description'         => $tool['promise'],
		'applicationCategory' => $tool['category'],
		'operatingSystem'     => 'Any',
		'inLanguage'          => 'he-IL',
		'isAccessibleForFree' => true,
		'offers'              => array( '@type' => 'Offer', 'price' => '0', 'priceCurrency' => 'ILS' ),
		'dateModified'        => justice_tools_checked_on( $name ),
		'publisher'           => array( '@type' => 'Organization', 'name' => 'Jus-Tice', 'url' => home_url( '/' ) ),
	);
	return '<script type="application/ld+json">' . wp_json_encode( $schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG ) . '</script>';
}

/**
 * [justice_tool name="hatzmada"]: answer box + the instrument, with the example result already
 * in the server HTML. JavaScript then makes it live; without it the page still shows a real answer.
 *
 * @param array|string $atts Shortcode attributes.
 * @return string
 */
/**
 * One instrument per tool per render pass (two copies would share field ids and one share link). The guard is per
 * pass, not per request: justice-ops practice-polish pre-renders a practice landing page's body at template_redirect
 * and discards it once the theme carries the slot, so a per-request guard left the real render empty (HAD-539,
 * 15.10.2026: /divorce-lawyer/ showed the answer box and none of its eight instruments). the_content at priority 0
 * opens a new pass.
 *
 * @param string $name  Tool name; '' only resets.
 * @param bool   $reset Start a new render pass.
 * @return bool True when this name already printed in the current pass (the caller prints nothing).
 */
function justice_tools_printed( string $name, bool $reset = false ): bool {
	static $printed = array();
	if ( $reset ) {
		$printed = array();
	}
	if ( '' === $name ) {
		return false;
	}
	if ( isset( $printed[ $name ] ) ) {
		return true;
	}
	$printed[ $name ] = true;
	return false;
}

/** the_content filter, priority 0: every run of the filter is a new render pass for the instruments. */
function justice_tools_new_render_pass( $content ) {
	justice_tools_printed( '', true );
	return $content;
}
if ( function_exists( 'add_filter' ) ) {
	add_filter( 'the_content', 'justice_tools_new_render_pass', 0 );
}

function justice_tools_shortcode( $atts ): string {
	$atts    = shortcode_atts( array( 'name' => '', 'answer' => '1', 'mode' => '' ), $atts, 'justice_tool' );
	$name    = sanitize_key( (string) $atts['name'] );
	$catalog = justice_tools_catalog();
	$mode    = sanitize_key( (string) $atts['mode'] );
	if ( '' !== $mode && ! isset( $catalog[ $name ]['modes'][ $mode ] ) ) {
		$mode = '';
	}
	$snap = justice_tools_snapshot( $name, $mode );
	// answer="only": the answer box alone, for a page that opens with the answer and places the instrument further down
	// (the divorce world, HAD-539). It is not the instrument, so the same tool still prints once, later on the page.
	if ( 'only' === (string) $atts['answer'] ) {
		if ( ! isset( $catalog[ $name ] ) ) {
			return '';
		}
		$css = JUSTICE_THEME_DIR . '/assets/css/justice-tools.css';
		wp_enqueue_style( 'justice-tools', JUSTICE_THEME_URI . '/assets/css/justice-tools.css', array(), is_readable( $css ) ? (string) filemtime( $css ) : JUSTICE_THEME_VERSION );
		return justice_tools_answer( $name, $mode );
	}
	// One instrument per tool per render pass: two copies would share field ids and one share link.
	if ( ! isset( $catalog[ $name ] ) || empty( $snap['form'] ) || justice_tools_printed( $name ) ) {
		return '';
	}
	$tool = justice_tools_tool( $name, $mode );
	$reg  = justice_tools_registry();
	justice_tools_enqueue( $name );

	$data = array();
	foreach ( $tool['data'] as $key ) {
		if ( isset( $reg[ $key ] ) ) {
			$data[ $key ] = $reg[ $key ];
		}
	}
	$id       = 'jtool-' . $name;
	$rehearse = justice_tools_rehearse_url( $tool );
	$primary  = $tool['primary'];
	$more     = '';
	if ( $rehearse && empty( $primary['rehearse'] ) ) {
		$more .= '<a href="' . esc_url( $rehearse ) . '" target="_blank" rel="noopener" data-act="rehearse">' . esc_html( $tool['rehearse']['label'] ) . '</a>';
	}
	foreach ( $tool['more'] ?? array() as $link ) {
		$more .= isset( $link['url'] )
			? '<a href="' . esc_url( $link['url'] ) . '" target="_blank" rel="noopener">' . esc_html( $link['label'] ) . '</a>'
			: '<a href="' . esc_url( home_url( $link['path'] ) ) . '">' . esc_html( $link['label'] ) . '</a>';
	}
	$more .= '<a href="' . esc_url( home_url( $tool['lawyer']['path'] ) ) . '" data-act="lawyer">' . esc_html( $tool['lawyer']['label'] ) . '</a>';
	// The primary next step: an action in the tool (letter, CSV), the rehearsal, or another page.
	if ( ! empty( $primary['rehearse'] ) && $rehearse ) {
		$primary_html = '<a class="jtool-btn jtool-btn--primary" href="' . esc_url( $rehearse ) . '" target="_blank" rel="noopener" data-act="rehearse">' . esc_html( $primary['label'] ) . '</a>';
	} elseif ( isset( $primary['path'] ) ) {
		$primary_html = '<a class="jtool-btn jtool-btn--primary" href="' . esc_url( home_url( $primary['path'] ) ) . '">' . esc_html( $primary['label'] ) . '</a>';
	} else {
		$primary_html = '<button class="jtool-btn jtool-btn--primary" type="button" data-act="' . esc_attr( $primary['act'] ?? '' ) . '">' . esc_html( $primary['label'] ) . '</button>';
	}

	$actions = '<div class="jtool-actions">'
		. '<button class="jtool-btn" type="button" data-act="link">העתקת קישור (בלי פרטים אישיים)</button>'
		. '<button class="jtool-btn" type="button" data-act="whatsapp">וואטסאפ</button>'
		. '<button class="jtool-btn" type="button" data-act="copy">העתקת התוצאה</button>'
		. '<button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button>'
		. '<button class="jtool-btn" type="button" data-act="save">שמירה במכשיר הזה</button>'
		. '</div><p class="jtool-toast" data-jtool-toast role="status" aria-live="polite"></p>';

	// The tool title is a heading by role, not an <h2> tag: a plugin outside this repo inserts the page's
	// "בעמוד הזה" table of contents right before the first <h2> in the content, and with an <h2> title it
	// landed inside the tool card and pushed the form below the fold (HAD-487). The TOC now starts after the tool.
	$html  = '1' === (string) $atts['answer'] ? justice_tools_answer( $name, $mode ) : '';
	$html .= '<section class="jtool" id="' . esc_attr( $id ) . '" data-jtool="' . esc_attr( $name ) . '"' . ( '' !== $mode ? ' data-jtool-mode="' . esc_attr( $mode ) . '"' : '' ) . ' data-jtool-data="' . esc_attr( $id ) . '-data" aria-labelledby="' . esc_attr( $id ) . '-title">'
		. '<div class="jtool__head"><div><div class="jtool__title" role="heading" aria-level="2" id="' . esc_attr( $id ) . '-title">' . esc_html( $tool['title'] ) . '</div><p class="jtool__promise">' . esc_html( $tool['promise'] ) . '</p></div>'
		. '<a class="jtool-stamp" href="#' . esc_attr( $id ) . '-sources"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>' . esc_html( justice_tools_stamp( $name, $mode ) ) . '</a></div>'
		. justice_tools_stages_html( $tool, $id )
		. '<p class="jtool-scope" data-jtool-shared hidden style="margin:12px 24px 0 !important">נפתח מקישור שיתוף. התשובות נטענו מהקישור ולא נשמרו אצלנו, והחישוב רץ שוב עם הנתונים העדכניים.</p>'
		. '<p class="jtool-scope" data-jtool-saved hidden style="margin:12px 24px 0 !important">יש חישוב שמור במכשיר הזה. <button class="jtool-linkbtn" type="button" data-act="restore">לטעון אותו</button> <button class="jtool-linkbtn" type="button" data-act="clear">למחוק</button></p>'
		. '<div class="jtool__body"><div class="jtool-form" role="group" aria-label="' . esc_attr( 'הנתונים ל' . $tool['name'] ) . '" data-jtool-form>' . $snap['form'] . '</div>'
		. '<div class="jtool-result" id="' . esc_attr( $id ) . '-result" data-jtool-result>' . $snap['result'] . '</div></div>'
		. '<div class="jtool-details" data-jtool-details>' . $snap['details'] . '</div>'
		. '<div class="jtool-details">' . $actions . '</div>'
		. '<div class="jtool-next" id="' . esc_attr( $id ) . '-next"><p class="jtool-next__text">' . esc_html( $tool['next_text'] ) . '</p><div class="jtool-next__cta">'
		. $primary_html
		. '<div class="jtool-next__more">' . $more . '</div></div></div>'
		. '<details class="jtool-sources" id="' . esc_attr( $id ) . '-sources"><summary>מקורות (נבדקו ב-' . esc_html( justice_tools_he_date( justice_tools_checked_on( $name ) ) ) . ')</summary>' . justice_tools_sources_html( $name ) . '</details>'
		. '<p class="jtool-foot">מידע כללי, לא ייעוץ משפטי. מה שהקלדתם לא נשמר אצלנו. החישוב נבנה על ידי צוות Jus-Tice.</p>'
		. '<div class="jtool-sticky" data-show="0"><span>' . esc_html( $tool['sticky'] ) . '</span><strong data-jtool-sticky-figure>' . ( isset( $snap['sticky'] ) ? (string) $snap['sticky'] : ( 'count' === ( $tool['sticky_kind'] ?? '' ) ? '<bdi>' . (int) $snap['total'] . '</bdi>' : ( 'pct' === ( $tool['sticky_kind'] ?? '' ) ? '<bdi>' . esc_html( (string) round( (float) $snap['total'], 2 ) ) . '%</bdi>' : justice_tools_money( $snap['total'], in_array( $name, array( 'tviot-ktanot', 'hetel-hashbacha', 'chozeh-schirut' ), true ) ? 0 : 2 ) ) ) ) . '</strong><a href="#' . esc_attr( $id ) . '-result">פרטים</a></div>'
		. '</section>'
		. '<script type="application/json" id="' . esc_attr( $id ) . '-data">' . wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP ) . '</script>'
		. justice_tools_webapp_schema( $name, $tool );
	return $html;
}
add_shortcode( 'justice_tool', 'justice_tools_shortcode' );

/** T03 current numbers: the day price per havraa year (private, with the statutory deduction; public for comparison) and the days table. */
function justice_tools_havraa_numbers_html( array $hv ): string {
	$latest = justice_tools_havraa_latest( $hv );
	$first  = (int) $latest['year'] - (int) $hv['limitation_years'];
	$rows   = '';
	for ( $year = (int) $latest['year']; $year >= $first; $year-- ) {
		$price = null;
		foreach ( $hv['private_rates'] as $r ) {
			if ( $r['from'] <= $year . '-07-01' ) {
				$price = $r;
			}
		}
		if ( ! $price ) {
			continue;
		}
		$ded = null;
		foreach ( $hv['deductions'] as $d ) {
			if ( (int) $d['year'] === $year ) {
				$ded = $d;
			}
		}
		$pub   = justice_tools_public_rate( $hv, $year );
		$rows .= '<tr><td data-th="שנת ההבראה"><bdi>' . $year . '</bdi></td><td data-th="מגזר פרטי, ליום">' . justice_tools_money( $price['rate'] ) . '</td><td data-th="בתוקף מ">' . esc_html( $price['label_he'] ) . '</td>'
			. '<td data-th="ניכוי לפי החוק">' . ( $ded ? 'יום אחד (חצי בשכר עד ' . justice_tools_money( $ded['half_salary_max'], 0 ) . '), <a href="' . esc_url( $ded['url'] ) . '" target="_blank" rel="noopener">' . esc_html( $ded['gazette_he'] ) . '</a>' : 'אין' ) . '</td>'
			. '<td data-th="שירות ציבורי, להשוואה">' . ( $pub ? justice_tools_money( $pub['rate'], 1 ) . ' (' . esc_html( $pub['scope_he'] ) . ')' : '—' ) . '</td>'
			. '<td data-th="מקור"><a href="' . esc_url( $price['url'] ) . '" target="_blank" rel="noopener">' . esc_html( $price['source_he'] ) . '</a></td></tr>';
	}
	$days = '';
	foreach ( $hv['days'] as $band ) {
		$label = $band[0] === $band[1] ? 'שנה ' . $band[0] : ( null === $band[1] ? 'משנה ' . $band[0] . ' ואילך' : 'שנים ' . $band[0] . ' עד ' . $band[1] );
		$days .= '<tr><td data-th="שנת העבודה">' . esc_html( $label ) . '</td><td data-th="ימי הבראה"><bdi>' . (int) $band[2] . '</bdi></td><td data-th="סכום במשרה מלאה, ' . esc_attr( $latest['year'] ) . '">' . justice_tools_money( $band[2] * $latest['rate'] ) . '</td><td data-th="מקור"><a href="' . esc_url( $hv['order_url'] ) . '" target="_blank" rel="noopener">סעיף 5(א) לצו</a></td></tr>';
	}
	return '<div class="jtool-page"><h3>מחיר יום הבראה לפי שנה</h3><div class="jtool-datawrap"><table class="jtool-datatable"><caption>כל שנה לפי המחיר ב-1 ביולי שלה (חודשי התשלום: ' . esc_html( $hv['payment_months_he'] ) . '). ב-2024 וב-2025 החוק הקפיא את המחיר וחייב לנכות יום הבראה.</caption><thead><tr><th scope="col">שנת ההבראה</th><th scope="col">מגזר פרטי, ליום</th><th scope="col">בתוקף מ</th><th scope="col">ניכוי לפי החוק</th><th scope="col">שירות ציבורי, להשוואה</th><th scope="col">מקור</th></tr></thead><tbody>' . $rows . '</tbody></table></div>'
		. '<h3>ימי הבראה לפי ותק במגזר הפרטי, ושוויים ב-' . esc_html( $latest['year'] ) . '</h3><div class="jtool-datawrap"><table class="jtool-datatable"><thead><tr><th scope="col">שנת העבודה</th><th scope="col">ימי הבראה</th><th scope="col">סכום במשרה מלאה, ' . esc_html( $latest['year'] ) . '</th><th scope="col">מקור</th></tr></thead><tbody>' . $days . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול צווי ההרחבה בילקוט הפרסומים, ספר החוקים, אגף החשב הכללי ומשרד החינוך ב-' . esc_html( justice_tools_he_date( $hv['checked_on'] ) ) . '.</p></div>';
}

/** T05 current numbers: the ceiling, the fee rule and every deadline, each with its source. */
function justice_tools_sc_numbers_html( array $sc ): string {
	$ceil = justice_tools_sc_ceiling( $sc );
	$dl   = $sc['deadlines'];
	$reg  = '<a href="' . esc_url( $sc['fee']['regulation_url'] ) . '" target="_blank" rel="noopener">';
	$law  = '<a href="' . esc_url( $sc['law_url'] ) . '" target="_blank" rel="noopener">';
	$svc  = '<a href="' . esc_url( $sc['service_url'] ) . '" target="_blank" rel="noopener">';
	$from = esc_html( justice_tools_he_date( $ceil['from'] ) );
	$rows = array(
		array( 'תקרת התביעה', justice_tools_money( $ceil['amount'], 0 ), $from, '<a href="' . esc_url( $ceil['url'] ) . '" target="_blank" rel="noopener">הודעת מנהל בתי המשפט, ' . esc_html( justice_tools_he_date( $ceil['notice_date'] ) ) . '</a>' ),
		array( 'אגרה', '<bdi>' . esc_html( (string) $sc['fee']['pct'] ) . '%</bdi> מסכום התביעה', $from, $reg . 'תקנה 6(א)(1)</a>' ),
		array( 'עיגול האגרה', 'כלפי מעלה לכפולה של ' . justice_tools_money( $sc['fee']['round_up_to'], 0 ), $from, $reg . 'תקנה 6(א)(3)</a>' ),
		array( 'אגרה מינימלית', justice_tools_money( $sc['fee']['min'], 0 ), $from, $reg . 'תקנה 6(א)(2)</a>' ),
		array( 'תביעות בשנה באותו בית משפט', 'יותר מ-<bdi>' . (int) $sc['max_claims_per_year'] . '</bdi>: בית המשפט רשאי להעביר', $from, $law . 'סעיף 60(ב)</a>' ),
		array( 'כתב הגנה', '<bdi>' . (int) $dl['defence_days'] . '</bdi> יום מהמסירה', $from, $reg . 'תקנה 4(ב)</a>' ),
		array( 'בדיקת מסירה וזימון עדים', '<bdi>' . (int) $dl['service_check_days_before'] . '</bdi> יום לפני הדיון', $from, $svc . 'הרשות השופטת</a>' ),
		array( 'מסירה בידי התובע', '<bdi>' . (int) $dl['plaintiff_service_days_before'] . '</bdi> יום לפני הדיון', $from, $reg . 'תקנה 7(ב1)</a>' ),
		array( 'בקשה למתורגמן', '<bdi>' . (int) $dl['interpreter_days_before'] . '</bdi> ימים לפני הדיון', $from, $svc . 'הרשות השופטת</a>' ),
		array( 'ביטול החלטה שניתנה בהיעדר', '<bdi>' . (int) $dl['set_aside_days'] . '</bdi> יום', $from, $reg . 'תקנה 12</a>' ),
		array( 'גוף כתב התביעה', 'עד <bdi>' . (int) $sc['claim_body_max_pages'] . '</bdi> עמודים', $from, $reg . 'תקנה 3(ה)</a>' ),
		array( 'הגשה מקוונת', 'עד <bdi>' . (int) $sc['online_max_plaintiffs'] . '</bdi> תובעים ו-<bdi>' . (int) $sc['online_max_defendants'] . '</bdi> נתבעים', $from, $svc . 'הרשות השופטת</a>' ),
		array( 'התיישנות', '<bdi>' . (int) $sc['limitation_years'] . '</bdi> שנים מיום שנולדה העילה', $from, '<a href="' . esc_url( $sc['limitation_url'] ) . '" target="_blank" rel="noopener">חוק ההתיישנות, סעיפים 5(1) ו-6</a>' ),
	);
	$body = '';
	foreach ( $rows as $r ) {
		$body .= '<tr><td data-th="מה">' . esc_html( $r[0] ) . '</td><td data-th="הכלל">' . $r[1] . '</td><td data-th="נכון ל">' . $r[2] . '</td><td data-th="מקור">' . $r[3] . '</td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>הסכומים והמועדים בתביעות קטנות, מ-' . $from . '</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">נכון ל</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול הרשות השופטת, התקנות וחוק בתי המשפט ב-' . esc_html( justice_tools_he_date( $sc['checked_on'] ) ) . '. התקרה מתעדכנת ב-1 בינואר.</p></div>';
}

/** Wave 3: the shares the law sets, and the cost of the order, each with its section. */
function justice_tools_yerusha_numbers_html( array $y ): string {
	$law  = '<a href="' . esc_url( $y['law_url'] ) . '" target="_blank" rel="noopener">';
	$fee  = '<a href="' . esc_url( $y['fees']['url'] ) . '" target="_blank" rel="noopener">';
	$regs = '<a href="' . esc_url( $y['regulations_url'] ) . '" target="_blank" rel="noopener">';
	$rows = array(
		array( 'בן הזוג, כשיש ילדים (או צאצאיהם) או הורה', esc_html( justice_tools_fraction_he( $y['spouse_half'] ) ) . ' משאר העיזבון, ועוד המיטלטלין והמכונית', $law . 'סעיף 11(א)(1)</a>' ),
		array( 'בן הזוג, כשיש רק אחים (או צאצאיהם) או סבים', esc_html( justice_tools_fraction_he( $y['spouse_two_thirds'] ) ) . ' משאר העיזבון; נשואים <bdi>' . (int) $y['spouse_apartment_min_years'] . '</bdi> שנים ויותר וגרו בדירה שבעיזבון: גם כל חלקו של המוריש בדירה', $law . 'סעיף 11(א)(2)</a>' ),
		array( 'בן הזוג, כשאין אף אחד מאלה', 'כל העיזבון', $law . 'סעיף 11(ב)</a>' ),
		array( 'הילדים', 'בשווה ביניהם; ילד שנפטר לפני המוריש: ילדיו במקומו', $law . 'סעיפים 13 ו-14</a>' ),
		array( 'ההורים, כשאין ילדים', 'בשווה; הורה שנפטר: ילדיו (האחים) במקומו, אלא אם יש בן זוג וההורה האחר חי', $law . 'סעיפים 12 עד 14</a>' ),
		array( 'הסבים, כשאין ילדים, הורים ואחים', 'בשווה; סב שנפטר: צאצאיו במקומו, אלא אם יש בן זוג וסב אחר חי', $law . 'סעיפים 12 עד 14</a>' ),
		array( 'ידועים בציבור', 'כמו בן זוג נשוי, אם אף אחד מהם לא היה נשוי לאחר, ובצוואה אין הוראה אחרת', $law . 'סעיף 55</a>' ),
		array( 'אין יורש', 'המדינה', $law . 'סעיף 17</a>' ),
		array( 'אגרת בקשה לצו ירושה', justice_tools_money( $y['fees']['order_fee'], 0 ) . ' מ-' . esc_html( justice_tools_he_date( $y['fees']['from'] ) ) . '; ' . justice_tools_money( $y['payments']['online_fee'], 0 ) . ' בהגשה מקוונת (<bdi>' . (int) $y['fees']['online_pct'] . '%</bdi>)', $fee . esc_html( $y['fees']['section'] ) . '</a>' ),
		array( 'הוצאות הפרסום', justice_tools_money( $y['payments']['publication'], 0 ) . ' לבקשה, על המבקש בנוסף לאגרה; מי שפטור מאגרה פטור גם מהן', $regs . esc_html( $y['publication_section'] ) . '</a>' ),
		array( 'התנגדות לבקשה', esc_html( $y['objection_he'] ), $regs . esc_html( $y['objection_section'] ) . '</a>' ),
	);
	$body = '';
	foreach ( $rows as $r ) {
		$body .= '<tr><td data-th="מי">' . esc_html( $r[0] ) . '</td><td data-th="מה מקבל">' . $r[1] . '</td><td data-th="מקור">' . $r[2] . '</td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>חלוקת ירושה על פי דין לפי ' . esc_html( $y['law_he'] ) . '</caption><thead><tr><th scope="col">מי</th><th scope="col">מה מקבל</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול הנוסח העדכני של החוק והתקנות ב-' . esc_html( justice_tools_he_date( $y['checked_on'] ) ) . '. האגרה מתעדכנת ב-1 בינואר.</p></div>';
}

/** Wave 3: every bracket of every track, with its period and source. */
function justice_tools_rechisha_numbers_html( array $pt ): string {
	$names = array( 'single' => 'דירה יחידה (וחלופית)', 'additional' => 'דירה נוספת', 'oleh' => 'עולה חדש, תקנה 12א', 'disabled' => 'נכה, תקנה 11(א)' );
	$out   = '';
	foreach ( $names as $key => $label ) {
		$t    = $pt['tracks'][ $key ];
		$rows = '';
		$low  = 0;
		foreach ( $t['brackets'] as $b ) {
			$range = null === $b[0] ? 'מעל ' . justice_tools_money( $low, 0 ) : justice_tools_money( $low, 0 ) . ' עד ' . justice_tools_money( $b[0], 0 );
			$rows .= '<tr><td data-th="חלק השווי">' . $range . '</td><td data-th="שיעור"><bdi>' . esc_html( (string) $b[1] ) . '%</bdi></td><td data-th="בתוקף">' . esc_html( justice_tools_he_date( $t['from'] ) ) . ' עד ' . esc_html( justice_tools_he_date( $t['to'] ) ) . '</td><td data-th="מקור"><a href="' . esc_url( $t['url'] ) . '" target="_blank" rel="noopener">' . esc_html( $t['section'] ) . '</a></td></tr>';
			$low   = null === $b[0] ? $low : $b[0];
		}
		if ( 'disabled' === $key ) {
			$rows .= '<tr><td data-th="חלק השווי">יש לרוכש עוד דירה (לא חלופית)</td><td data-th="שיעור"><bdi>' . esc_html( (string) $t['flat_not_sole'] ) . '%</bdi> על כל השווי</td><td data-th="בתוקף">' . esc_html( justice_tools_he_date( $t['from'] ) ) . ' עד ' . esc_html( justice_tools_he_date( $t['to'] ) ) . '</td><td data-th="מקור"><a href="' . esc_url( $t['url'] ) . '" target="_blank" rel="noopener">תקנה 11(א)</a></td></tr>';
			$rows .= '<tr><td data-th="חלק השווי">שווי מעל ' . justice_tools_money( $t['cap'], 0 ) . '</td><td data-th="שיעור"><bdi>' . esc_html( (string) $t['flat_above_cap'] ) . '%</bdi> על כל השווי</td><td data-th="בתוקף">' . esc_html( justice_tools_he_date( $t['from'] ) ) . ' עד ' . esc_html( justice_tools_he_date( $t['to'] ) ) . '</td><td data-th="מקור"><a href="' . esc_url( $t['url'] ) . '" target="_blank" rel="noopener">תקנה 11(א)(2)</a></td></tr>';
		}
		if ( 'oleh' === $key ) {
			$rows .= '<tr><td data-th="חלק השווי">שווי מעל ' . justice_tools_money( $t['max_value'], 0 ) . '</td><td data-th="שיעור">ההטבה לא חלה</td><td data-th="בתוקף">—</td><td data-th="מקור"><a href="' . esc_url( $t['url'] ) . '" target="_blank" rel="noopener">תקנה 12א(ג)</a></td></tr>';
		}
		$out .= '<h3>' . esc_html( $label ) . '</h3><div class="jtool-datawrap"><table class="jtool-datatable"><thead><tr><th scope="col">חלק השווי</th><th scope="col">שיעור</th><th scope="col">בתוקף</th><th scope="col">מקור</th></tr></thead><tbody>' . $rows . '</tbody></table></div>';
	}
	return '<div class="jtool-page">' . $out . '<p class="jtool-updated">נבדק מול הוראות הביצוע של ' . esc_html( $pt['publisher_he'] ) . ', החוק והתקנות ב-' . esc_html( justice_tools_he_date( $pt['checked_on'] ) ) . '.</p></div>';
}

/** Wave 3: the levy's rates, deferrals and periods, each with its section. */
function justice_tools_hashbacha_numbers_html( array $b ): string {
	$law  = '<a href="' . esc_url( $b['law_url'] ) . '" target="_blank" rel="noopener">';
	$rows = array(
		array( 'שיעור ההיטל', esc_html( justice_tools_fraction_he( $b['rates']['regular']['rate'] ) ) . ' מההשבחה', $b['rates']['regular']['section'] ),
		array( 'פינוי ובינוי למגורים', esc_html( justice_tools_fraction_he( $b['rates']['pinui']['rate'] ) ) . ' מההשבחה, אלא אם הרשות קבעה אחרת לאזור', $b['rates']['pinui']['section'] . ' ו-3א(ב)' ),
		array( 'היתר לפי תמ"א 38', 'פטור; רבע על השטח שמעבר ל-2.5 קומות טיפוסיות מורחבות, אלא אם הרשות המקומית קבעה פטור או שמינית', $b['rates']['tama38']['section'] . ' ו-19(ב2)(1)' ),
		array( 'תוכנית חיזוק מפני רעידות אדמה', esc_html( justice_tools_fraction_he( $b['rates']['seismic']['rate'] ) ) . ' מההשבחה, אלא אם הרשות המקומית קבעה פטור או שמינית', $b['rates']['seismic']['section'] . ' ו-19(ב2)(1)' ),
		array( 'ממ"ד', 'פטור בשטח שנקבע לפי חוק ההתגוננות האזרחית, ומ-2025 גם בשטח הנוסף לפי סעיף 151(ג)(2) בתנאים; על שטח אחר, ההיטל הרגיל', $b['rates']['mamad']['section'] . ' ו-(9)(ג)' ),
		array( 'בנייה או הרחבה למגורים שלכם או של קרוב', 'לא משלמים בהיתר עד <bdi>' . (int) $b['residence_max_sqm'] . '</bdi> מ"ר אחרי הבנייה; מעל, באופן יחסי', $b['residence_section'] ),
		array( 'מכירת דירה כזאת', 'לא מימוש אחרי <bdi>' . (int) $b['residence_sale_years'] . '</bdi> שנות מגורים מגמר הבנייה', $b['residence_sale_section'] ),
		array( 'מתי משלמים', 'לכל המאוחר במימוש: היתר, מכירה או שימוש', $b['pay_section'] ),
		array( 'ערר על שומה', '<bdi>' . (int) $b['appeal_days'] . '</bdi> ימים מהיום שהשומה הגיעה אליכם; על לוח שומה: שנה מהיום שהוצג', $b['appeal_section'] ),
		array( 'שמאי מכריע', 'על הסכום בלבד, באותם ימים; על החלטתו ערר תוך <bdi>' . (int) $b['appraiser_appeal_days'] . '</bdi> ימים', $b['appraiser_section'] . ', ' . $b['appraiser_appeal_section'] ),
		array( 'בחינה מחדש בוועדה', 'רק על הסכום, בחיוב של עד ' . justice_tools_money( $b['recheck_max'], 0 ) . ', עם שומת שמאי; החלטה תוך <bdi>' . (int) $b['recheck_decide_days'] . '</bdi> ימים. הפחתה היא שומה מוסכמת: מסכימים תוך <bdi>' . (int) $b['recheck_reply_days'] . '</bdi> ימים, והשמאי הממשלתי הראשי רשאי לא לאשר תוך <bdi>' . (int) $b['recheck_chief_days'] . '</bdi> ימים', $b['recheck_section'] ),
		array( 'מימוש חלקי', 'משלמים עכשיו את החלק היחסי, והשאר במימוש הבא', $b['partial_section'] ),
	);
	$body = '';
	foreach ( $rows as $r ) {
		$body .= '<tr><td data-th="מה">' . esc_html( $r[0] ) . '</td><td data-th="הכלל">' . $r[1] . '</td><td data-th="מקור">' . $law . esc_html( $r[2] ) . '</a></td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>היטל השבחה לפי ' . esc_html( $b['law_he'] ) . '</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול הנוסח העדכני של התוספת השלישית ב-' . esc_html( justice_tools_he_date( $b['checked_on'] ) ) . '.</p></div>';
}

/** Wave 4: every official fee on the path of a will, with its item and source. */
function justice_tools_tzavaa_numbers_html( array $w ): string {
	$rf   = $w['registrar'];
	$nf   = $w['notary'];
	$law  = '<a href="' . esc_url( $w['law_url'] ) . '" target="_blank" rel="noopener">';
	$fee  = '<a href="' . esc_url( $rf['url'] ) . '" target="_blank" rel="noopener">';
	$nt   = '<a href="' . esc_url( $nf['url'] ) . '" target="_blank" rel="noopener">';
	$vat  = ' ועוד מע"מ <bdi>' . (int) $w['vat']['pct'] . '%</bdi>';
	$rows = array(
		array( 'צוואה בכתב יד', 'אין אגרה', $law . 'סעיף 19</a>' ),
		array( 'צוואה בעדים', 'אין אגרה; שני עדים בגירים שלא זוכים בצוואה', $law . 'סעיפים 20, 24 ו-35</a>' ),
		array( 'צוואה בפני רשם לענייני ירושה', justice_tools_money( $rf['will_before_registrar'], 0 ), $fee . esc_html( $rf['item_will'] ) . '</a>' ),
		array( 'צוואה בפני נוטריון, חותם ראשון', justice_tools_money( $nf['will_first'], 0 ) . $vat, $nt . 'פרט 4(א)</a>' ),
		array( 'כל חותם נוסף על אותה צוואה', justice_tools_money( $nf['will_additional'], 0 ) . $vat, $nt . 'פרט 4(ב)</a>' ),
		array( 'אישור נוסף לאותה צוואה באותו מעמד', justice_tools_money( $nf['will_extra_certificate'], 0 ) . $vat, $nt . 'פרט 4(ג)</a>' ),
		array( 'תרגום הצוואה בידי הנוטריון', 'מחצית מתעריף התרגום: ' . justice_tools_money( $nf['translate_first100'], 0 ) . ' ל-100 המילים הראשונות, ' . justice_tools_money( $nf['translate_per100_to1000'], 0 ) . ' לכל 100 עד 1,000, ' . justice_tools_money( $nf['translate_per100_above'], 0 ) . ' לכל 100 מעל', $nt . 'פרטים 4(ד) ו-3(א)</a>' ),
		array( 'נוטריון מחוץ למשרד', justice_tools_money( $nf['outside_first_hour'], 0 ) . ' לשעה הראשונה, ' . justice_tools_money( $nf['outside_half_hour'], 0 ) . ' לכל חצי שעה נוספת, ועוד הוצאות נסיעה', $nt . 'פרט 9</a>' ),
		array( 'בין 19:00 ל-08:00 או ביום מנוחה', 'תוספת <bdi>' . (int) $nf['night_pct'] . '%</bdi> (לא לשירות מחוץ למשרד)', $nt . 'פרט 10</a>' ),
		array( 'הפקדת צוואה אצל הרשם', justice_tools_money( $rf['deposit'], 0 ) . '; פטור כשלא הופקדה צוואה קודמת ב-<bdi>' . (int) $rf['deposit_free_years'] . '</bdi> השנים שלפני', $fee . 'פרטים 5 ו-5א</a>' ),
		array( 'בקשה לצו קיום צוואה (או צו ירושה)', justice_tools_money( $rf['order'], 0 ) . '; ' . justice_tools_money( $rf['payments']['online_fee'], 0 ) . ' בהגשה מקוונת (<bdi>' . (int) $rf['online_pct'] . '%</bdi>)', $fee . 'פרט 1, תקנה 1(א)</a>' ),
		array( 'בקשה לתיקון או ביטול צו', justice_tools_money( $rf['amend'], 0 ), $fee . esc_html( $rf['item_amend'] ) . '</a>' ),
		array( 'פרסום הבקשה', justice_tools_money( $rf['payments']['publication'], 0 ) . ' לבקשה, על המבקש', '<a href="' . esc_url( $w['regulations_url'] ) . '" target="_blank" rel="noopener">' . esc_html( $w['publication_section'] ) . '</a>; <a href="' . esc_url( $rf['payments']['url'] ) . '" target="_blank" rel="noopener">שירות התשלומים</a>' ),
	);
	$body = '';
	foreach ( $rows as $r ) {
		$body .= '<tr><td data-th="מה">' . esc_html( $r[0] ) . '</td><td data-th="כמה">' . $r[1] . '</td><td data-th="מקור">' . $r[2] . '</td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>האגרות והתעריפים בדרך של צוואה, מ-' . esc_html( justice_tools_he_date( $rf['from'] ) ) . '</caption><thead><tr><th scope="col">מה</th><th scope="col">כמה</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול הנוסח העדכני של החוק, תקנות האגרות ותקנות הנוטריונים ב-' . esc_html( justice_tools_he_date( $w['checked_on'] ) ) . '. התעריפים מתעדכנים ב-1 בינואר.</p></div>';
}

/** Wave 4: the rules of road-accident compensation, each with its section. */
function justice_tools_teuna_numbers_html( array $c ): string {
	$np   = $c['nonpecuniary'];
	$nii  = $c['earnings']['nii'][ count( $c['earnings']['nii'] ) - 1 ];
	$law  = '<a href="' . esc_url( $c['law_url'] ) . '" target="_blank" rel="noopener">';
	$regs = '<a href="' . esc_url( $c['regs_url'] ) . '" target="_blank" rel="noopener">';
	$rul  = '<a href="' . esc_url( $c['fees']['rules_url'] ) . '" target="_blank" rel="noopener">';
	$lim  = '<a href="' . esc_url( $c['limitation']['url'] ) . '" target="_blank" rel="noopener">';
	$rows = array(
		array( 'אשם', 'לא משנה מי אשם: האחריות מוחלטת', $law . 'סעיף 2(ג)</a>' ),
		array( 'כאב וסבל: ימי אשפוז', '<bdi>' . esc_html( (string) ( $np['hospital_permille'] / 10 ) ) . '%</bdi> מהסכום המקסימלי לכל יום', $regs . 'תקנה 2(א)(1)</a>' ),
		array( 'כאב וסבל: נכות לצמיתות', '<bdi>' . (int) $np['disability_pct_per_pct'] . '%</bdi> מהסכום המקסימלי לכל אחוז נכות', $regs . 'תקנה 2(א)(2)</a>' ),
		array( 'הפחתת גיל', '<bdi>' . (int) $np['age_pct_per_year'] . '%</bdi> פחות מחלק הנכות לכל שנה מעל גיל ' . (int) $np['age_from'] . ' ביום התאונה', $regs . 'תקנה 3</a>' ),
		array( 'בלי נכות ובלי אשפוז', 'סכום מוסכם או פסוק, עד <bdi>' . (int) $np['no_permanent_max_pct'] . '%</bdi> מהסכום המקסימלי', $regs . 'תקנה 2(ב)</a>' ),
		array( 'מות הנפגע', '<bdi>' . (int) $np['death_pct'] . '%</bdi> מהסכום המקסימלי, לעיזבון', $regs . 'תקנה 4</a>' ),
		array( 'הסכום המקסימלי', '100,000 לירות, צמוד למדד מיום תחילת החוק; אין מפרסם רשמי לסכום המעודכן', $law . 'סעיפים 4(א)(3) ו-4(ב)</a>' ),
		array( 'תקרת הכנסה להפסד השתכרות', 'פי <bdi>' . (int) $c['earnings']['ceiling_multiple'] . '</bdi> מהשכר הממוצע במשק (הגבוה מנתוני הלמ"ס והביטוח הלאומי); לפחות ' . justice_tools_money( $c['earnings']['ceiling_multiple'] * min( $nii['s1'], $nii['s2'] ), 0 ) . ' לחודש', $law . 'סעיף 4(א)(1)</a>' ),
		array( 'השכר הממוצע לפי הביטוח הלאומי', justice_tools_money( $nii['s1'], 0 ) . ' (סעיף 1) ו-' . justice_tools_money( $nii['s2'], 0 ) . ' (סעיף 2), מ-' . esc_html( justice_tools_he_date( $nii['from'] ) ), '<a href="' . esc_url( $nii['url'] ) . '" target="_blank" rel="noopener">ביטוח לאומי</a>' ),
		array( 'ניכוי מס', 'ההפסד נמדד אחרי מס הכנסה; ההפחתה עד <bdi>' . (int) $c['earnings']['tax_cap_pct'] . '%</bdi>', $law . 'סעיף 4(א)(2)</a>' ),
		array( 'שכר טרחה בלי תביעה', 'עד <bdi>' . (int) $c['fees']['stages']['none']['pct'] . '%</bdi> מהפיצוי, ועוד מע"מ', $law . 'סעיף 16(א)</a>; ' . $rul . 'כללים 4 ו-5</a>' ),
		array( 'שכר טרחה בפשרה אחרי תביעה', 'עד <bdi>' . (int) $c['fees']['stages']['settle']['pct'] . '%</bdi>, ועוד מע"מ', $rul . 'כללים 3 ו-5</a>' ),
		array( 'שכר טרחה בפסק דין', 'עד <bdi>' . (int) $c['fees']['stages']['judgment']['pct'] . '%</bdi>, ועוד מע"מ', $law . 'סעיף 16(א)</a>; ' . $rul . 'כללים 2 ו-5</a>' ),
		array( 'תשלומים תכופים', '<bdi>' . (int) $c['interim_days'] . '</bdi> ימים מדרישה בכתב', $law . 'סעיף 5(ב)</a>' ),
		array( 'התיישנות', '<bdi>' . (int) $c['limitation']['years'] . '</bdi> שנים; עד גיל 18 לא נספר; 7.10.2023 עד 6.4.2024 לא נספרים', $lim . 'סעיפים 5(1), 10 ו-15א</a>' ),
	);
	$body = '';
	foreach ( $rows as $r ) {
		$body .= '<tr><td data-th="מה">' . esc_html( $r[0] ) . '</td><td data-th="הכלל">' . $r[1] . '</td><td data-th="מקור">' . $r[2] . '</td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>פיצויים לנפגעי תאונות דרכים: הכללים שבחוק, בתקנות ובכללי לשכת עורכי הדין</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול הנוסח העדכני של החוק, התקנות, הכללים, חוק ההתיישנות ונתוני הביטוח הלאומי ב-' . esc_html( justice_tools_he_date( $c['checked_on'] ) ) . '.</p></div>';
}

/** Wave 4: every divorce fee and clock, with its item and source. */
function justice_tools_gerushin_numbers_html( array $d ): string {
	$rb   = $d['rabbinical'];
	$fc   = $d['family'];
	$ds   = $d['disputes'];
	$rl   = '<a href="' . esc_url( $rb['url'] ) . '" target="_blank" rel="noopener">';
	$fl   = '<a href="' . esc_url( $fc['url'] ) . '" target="_blank" rel="noopener">';
	$dl   = '<a href="' . esc_url( $ds['url'] ) . '" target="_blank" rel="noopener">';
	$rows = array(
		array( 'בקשה ליישוב סכסוך', justice_tools_money( $rb['request'], 0 ) . ' בבית הדין; ' . justice_tools_money( $fc['request'], 0 ) . ' בבית המשפט', $rl . 'פרט 19(טז)</a>; ' . $fl . 'פרט 13</a>' ),
		array( 'פגישות מהו"ת ביחידת הסיוע', 'עד <bdi>' . (int) $ds['meetings_max'] . '</bdi> פגישות, בלי תשלום, בתוך <bdi>' . (int) $ds['meetings_days'] . '</bdi> ימים (הארכה אחת של <bdi>' . (int) $ds['extend_days'] . '</bdi>)', $dl . 'סעיף 3(ב)</a>' ),
		array( 'עיכוב הליכים', '<bdi>' . (int) $ds['stay_days'] . '</bdi> ימים מהבקשה, או <bdi>' . (int) $ds['stay_days_extended'] . '</bdi>; אחריו <bdi>' . (int) $ds['claim_days'] . '</bdi> ימים שבהם רק מי שהגיש את הבקשה רשאי לתבוע, ואחר כך גם הצד השני', $dl . 'סעיפים 3(ה) ו-4</a>' ),
		array( 'הסכם גירושין כפסק דין, בבית הדין', justice_tools_money( $rb['agreement'], 0 ), $rl . 'פרט 4(2)</a>' ),
		array( 'אישור הסכם בין בני זוג, בבית המשפט', justice_tools_money( $fc['agreement'], 0 ) . ' ועוד פרוטוקול ' . justice_tools_money( $fc['transcript'], 0 ), $fl . 'פרט 6א</a>' ),
		array( 'תביעת גירושין', justice_tools_money( $rb['divorce'], 0 ) . ' ועוד פרוטוקול ' . justice_tools_money( $rb['transcript_divorce'], 0 ), $rl . 'פרט 4(1)(א)</a>' ),
		array( 'תביעה רכושית', justice_tools_money( $rb['property'], 0 ) . ' בבית הדין (כרוכה בגירושין); ' . justice_tools_money( $fc['property'], 0 ) . ' בבית המשפט', $rl . 'פרט 4(1)(ב)</a>; ' . $fl . 'פרט 2א</a>' ),
		array( 'החזקת ילדים', justice_tools_money( $rb['custody'], 0 ) . ' בבית הדין; ' . justice_tools_money( $fc['custody'], 0 ) . ' בבית המשפט', $rl . 'פרט 7</a>; ' . $fl . 'פרט 6ב</a>' ),
		array( 'מזונות', 'בבית הדין המגיש פטור; ' . justice_tools_money( $fc['support'], 0 ) . ' בבית המשפט', $rl . 'תקנה 14א</a>; ' . $fl . 'פרט 5</a>' ),
		array( 'בקשה לסידור גט', justice_tools_money( $rb['get_request'], 0 ) . '; ' . justice_tools_money( $rb['get_request_abroad'], 0 ) . ' כשאחד מבני הזוג בחוץ לארץ', $rl . 'פרט 4(3)(א)-(ב)</a>' ),
		array( 'סידור הגט כששניכם בארץ', 'פטור', $rl . 'פרט 4(3)(ג)</a>' ),
		array( 'תעודת גירושין', justice_tools_money( $rb['certificate'], 0 ) . ' לכל צד', $rl . 'פרט 4(4)(א)</a>' ),
		array( 'ערעור לבית הדין הרבני הגדול', justice_tools_money( $rb['appeal'], 0 ), $rl . 'פרט 15(א)</a>' ),
	);
	$body = '';
	foreach ( $rows as $r ) {
		$body .= '<tr><td data-th="מה">' . esc_html( $r[0] ) . '</td><td data-th="כמה">' . $r[1] . '</td><td data-th="מקור">' . $r[2] . '</td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>אגרות הגירושין והמועדים שבחוק, 2026</caption><thead><tr><th scope="col">מה</th><th scope="col">כמה</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול תקנות הדיינים (אגרות), תקנות בית המשפט לעניני משפחה (אגרות) והחוק להסדר התדיינויות בסכסוכי משפחה ב-' . esc_html( justice_tools_he_date( $d['checked_on'] ) ) . '. ' . esc_html( $rb['indexed_he'] ) . '; ' . esc_html( $fc['indexed_he'] ) . '.</p></div>';
}

/** Wave 5: the rules of a residential lease, each with its section. */
function justice_tools_schirut_numbers_html( array $rc ): string {
	$law  = '<a href="' . esc_url( $rc['law_url'] ) . '" target="_blank" rel="noopener">';
	$rows = array(
		array( 'ערובה שעולה כסף לשוכר', 'מזומן, ערבות בנקאית וערבות מחברת ביטוח או מבעל רישיון אשראי: יחד עד הנמוך מבין שכר הדירה לשליש מהתקופה ופי <bdi>' . (int) $rc['deposit']['months'] . '</bdi> משכר הדירה לחודש', $law . 'סעיף 25י(ב)</a>' ),
		array( 'מימוש הערובה', 'רק על שכר דירה שלא שולם, ליקוי שבאחריות השוכר, תשלום שוטף שלא שולם או אי פינוי, אחרי הודעה מראש', $law . 'סעיף 25י(ג)-(ד)</a>' ),
		array( 'החזרת הערובה', 'תוך <bdi>' . (int) $rc['deposit']['return_days'] . '</bdi> ימים מהשבת הדירה, עם הפירות', $law . 'סעיף 25י(ה)</a>' ),
		array( 'תיקון ליקוי', 'המשכיר, תוך <bdi>' . (int) $rc['repairs']['days'] . '</bdi> ימים מהדרישה; פגם דחוף תוך <bdi>' . (int) $rc['repairs']['urgent_days'] . '</bdi> ימים; נזק משימוש בלתי סביר: השוכר', $law . 'סעיף 25ח</a>' ),
		array( 'מה השוכר משלם', esc_html( implode( ', ', $rc['tenant_pays'] ) ), $law . 'סעיף 25ט(א)</a>' ),
		array( 'מה השוכר לא משלם', esc_html( implode( ', ', $rc['tenant_not'] ) ), $law . 'סעיף 25ט(ב)</a>' ),
		array( 'אופציה להארכה', 'של המשכיר: הודעה לפחות <bdi>' . (int) $rc['option']['landlord_days'] . '</bdi> ימים לפני הסוף ובתנאים שנקבעו מראש; של השוכר: עד <bdi>' . (int) $rc['option']['tenant_days'] . '</bdi> ימים לפני הסוף', $law . 'סעיף 25יב</a>' ),
		array( 'ביטול בלי הפרה', 'למשכיר רק אם גם לשוכר; הודעה: המשכיר <bdi>' . (int) $rc['exit']['landlord_days'] . '</bdi> ימים, השוכר <bdi>' . (int) $rc['exit']['tenant_days'] . '</bdi> ימים מראש', $law . 'סעיף 25יג</a>' ),
		array( 'מכירת הדירה', 'החוזה מחייב את הקונה, והמשכיר מודיע לשוכר בכתב לפני המסירה', $law . 'סעיפים 21(ב) ו-25יא</a>' ),
		array( 'דירה ראויה למגורים', esc_html( implode( '; ', $rc['unfit'] ) ) . ': אם אחד מאלה, הדירה לא ראויה', $law . 'סעיף 25ו, התוספת הראשונה</a>' ),
		array( 'מה חייב להיות בחוזה', esc_html( implode( '; ', $rc['schedule2'] ) ), $law . 'סעיף 25ג, התוספת השנייה</a>' ),
		array( 'מתי הסימן לא חל', 'שכירות עד <bdi>' . (int) $rc['scope']['short_months'] . '</bdi> חודשים בלי אופציה, מעל <bdi>' . (int) $rc['scope']['long_years'] . '</bdi> שנים בלי ביטול למשכיר, שכר דירה מעל ' . justice_tools_money( $rc['scope']['rent_cap'], 0 ) . ' (מתעדכן), מלון, מעונות, שכירות מוגנת', $law . 'סעיף 25טו</a>' ),
		array( 'ויתור על הזכויות', 'סעיף בחוזה שמרע עם השוכר בעניינים האלה לא תקף, חוץ מבין קרובים', $law . 'סעיפים 25יד ו-25טו(ב)</a>' ),
	);
	$body = '';
	foreach ( $rows as $r ) {
		$body .= '<tr><td data-th="מה">' . esc_html( $r[0] ) . '</td><td data-th="הכלל">' . $r[1] . '</td><td data-th="מקור">' . $r[2] . '</td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>חוזה שכירות למגורים: הכללים שבחוק השכירות והשאילה</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול הנוסח העדכני של החוק (ל-' . esc_html( justice_tools_he_date( $rc['law_current_to'] ) ) . ') ומול ספר החוקים ב-' . esc_html( justice_tools_he_date( $rc['checked_on'] ) ) . '. ' . esc_html( $rc['bill']['he'] ) . '.</p></div>';
}

/** Wave 5: severance, notice and tax, each with its section. */
function justice_tools_pitzuyim_numbers_html( array $sv ): string {
	$law  = '<a href="' . esc_url( $sv['law_url'] ) . '" target="_blank" rel="noopener">';
	$nl   = '<a href="' . esc_url( $sv['notice']['url'] ) . '" target="_blank" rel="noopener">';
	$rows = array(
		array( 'מי זכאי', 'מי שעבד שנה ברציפות ופוטר, או התפטר בנסיבות שהחוק רואה כפיטורים', $law . 'סעיפים 1, 6 עד 11</a>' ),
		array( 'כמה', 'משכורת חודש לכל שנת עבודה, וחלק יחסי לחלק משנה, לפי השכר האחרון', $law . 'סעיף 12(א)</a>' ),
		array( 'עובד לפי שעה או יום', 'גם חודש לכל שנה, מ-' . esc_html( justice_tools_he_date( $sv['wage_regs_from'] ) ), '<a href="' . esc_url( $sv['wage_regs_url'] ) . '" target="_blank" rel="noopener">תקנות 1983</a>' ),
		array( 'רצפה', 'לא פחות משכר המינימום לפי היקף המשרה', $law . 'סעיף 13ב</a>' ),
		array( 'סעיף 14', esc_html( $sv['approval']['full_he'] . '; ' . $sv['approval']['partial_he'] ), '<a href="' . esc_url( $sv['approval']['url'] ) . '" target="_blank" rel="noopener">האישור הכללי</a>' ),
		array( 'הודעה מוקדמת, משכורת חודשית', 'יום לכל חודש בחצי השנה הראשונה; אחר כך <bdi>' . (int) $sv['notice']['monthly']['base_days'] . '</bdi> ימים ועוד <bdi>2.5</bdi> לכל חודש; אחרי שנה: חודש', $nl . 'סעיף 3</a>' ),
		array( 'הודעה מוקדמת, שכר לפי שעה או יום', 'יום לכל חודש בשנה הראשונה; בשנה השנייה <bdi>' . (int) $sv['notice']['wage']['y2_base'] . '</bdi> ימים ועוד יום לכל חודשיים; בשלישית <bdi>' . (int) $sv['notice']['wage']['y3_base'] . '</bdi> ועוד יום לכל חודשיים; אחר כך חודש', $nl . 'סעיף 4</a>' ),
		array( 'פטור ממס', 'עד משכורת חודש לכל שנה, ולא יותר מ-' . justice_tools_money( $sv['tax']['ceiling'], 0 ) . ' לשנה ב-' . (int) $sv['tax']['year'], '<a href="' . esc_url( $sv['tax']['source_url'] ) . '" target="_blank" rel="noopener">רשות המסים</a>; <a href="' . esc_url( $sv['tax']['law_url'] ) . '" target="_blank" rel="noopener">' . esc_html( $sv['tax']['section'] ) . '</a>' ),
		array( 'מועד התשלום', 'ביום סיום העבודה; מולן אחרי <bdi>' . (int) $sv['late']['grace_days'] . '</bdi> ימים; אחרי <bdi>' . (int) $sv['late']['linkage_to_day'] . '</bdi> ימים עוד <bdi>' . (int) $sv['late']['monthly_pct'] . '%</bdi> לכל חודש', '<a href="' . esc_url( $sv['late']['url'] ) . '" target="_blank" rel="noopener">חוק הגנת השכר, סעיף 20</a>' ),
		array( 'אישור על תקופת העבודה', 'תוך <bdi>' . (int) $sv['notice']['cert_days'] . '</bdi> ימים מהיום האחרון, או <bdi>' . (int) $sv['notice']['cert_request_days'] . '</bdi> ימים מבקשה בכתב', $nl . 'סעיף 8(ב)</a>' ),
		array( 'התיישנות', '<bdi>' . (int) $sv['limitation']['years'] . '</bdi> שנים', '<a href="' . esc_url( $sv['limitation']['url'] ) . '" target="_blank" rel="noopener">חוק ההתיישנות, ' . esc_html( $sv['limitation']['section'] ) . '</a>' ),
	);
	$body = '';
	foreach ( $rows as $r ) {
		$body .= '<tr><td data-th="מה">' . esc_html( $r[0] ) . '</td><td data-th="הכלל">' . $r[1] . '</td><td data-th="מקור">' . $r[2] . '</td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>פיצויי פיטורים והודעה מוקדמת: הכללים והסכומים, ' . (int) $sv['tax']['year'] . '</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול החוק, התקנות, האישור הכללי ולוח העזר של רשות המסים ב-' . esc_html( justice_tools_he_date( $sv['checked_on'] ) ) . '.</p></div>';
}

/** Wave 5: the capital-gains rates, exemptions and deadlines, each with its section. */
function justice_tools_shevach_numbers_html( array $sh ): string {
	$law  = '<a href="' . esc_url( $sh['law_url'] ) . '" target="_blank" rel="noopener">';
	$ins  = '<a href="' . esc_url( $sh['source_url'] ) . '" target="_blank" rel="noopener">';
	$rows = array(
		array( 'שבח ריאלי מ-1.1.2012', '<bdi>' . (int) $sh['rates']['post2012'] . '%</bdi>', $law . 'סעיף 48א(ב)(1)</a>' ),
		array( 'שבח ריאלי מ-7.11.2001 עד 31.12.2011', 'עד <bdi>' . (int) $sh['rates']['mid'] . '%</bdi>', $law . 'סעיף 48א(ב1)</a>' ),
		array( 'שבח ריאלי עד 7.11.2001', 'השיעור הגבוה בסעיף 121: <bdi>' . (int) $sh['rates']['pre2001'] . '%</bdi> ב-2026', $law . 'סעיף 48א(ב1)</a>' ),
		array( 'אינפלציה שנצברה עד 31.12.1993', '<bdi>' . (int) $sh['rates']['inflation'] . '%</bdi>; אחר כך פטור; בחישוב הלינארי 0%', $law . 'סעיף 48א(ג)</a>' ),
		array( 'דירת מגורים מזכה שנקנתה לפני 1.1.2014', 'החלק היחסי עד 1.1.2014 פטור, השאר <bdi>' . (int) $sh['rates']['post2012'] . '%</bdi> (החישוב הלינארי המוטב)', $law . 'סעיף 48א(ב2)</a>' ),
		array( 'דירה יחידה', esc_html( $sh['single_he'] ), $law . 'סעיפים 49ב(2) ו-49ג</a>' ),
		array( 'תקרת הפטור', justice_tools_money( $sh['single']['ceiling'], 0 ) . ' מ-' . esc_html( justice_tools_he_date( $sh['single']['ceiling_from'] ) ) . ' עד ' . esc_html( justice_tools_he_date( $sh['single']['ceiling_to'] ) ) . '; מעליה החלק היחסי חייב', $law . 'סעיף 49א(א1)</a>; ' . $ins . 'הוראת ביצוע 1/2026</a>' ),
		array( 'מס יסף', 'מכירת דירה חייבת במס של יותר מ-' . justice_tools_money( $sh['surtax']['threshold'], 0 ) . ': השבח נכנס להכנסה החייבת במס יסף', $ins . 'הוראת ביצוע 1/2026</a>' ),
		array( 'הוצאות שמנכים', 'מס רכישה, עורך דין, שמאי, שיפוצים; דמי תיווך עד <bdi>' . (int) $sh['deductions']['broker_max_pct'] . '%</bdi> בקנייה ובמכירה', $law . 'סעיף 39</a>' ),
		array( 'הצהרה', '<bdi>' . (int) $sh['deadlines']['declare_days'] . '</bdi> ימים מיום המכירה', $law . 'סעיף 73(א)</a>' ),
		array( 'תשלום', '<bdi>' . (int) $sh['deadlines']['pay_days'] . '</bdi> ימים מיום המכירה', $law . 'סעיף 90א</a>' ),
		array( 'השגה וערר', 'השגה תוך <bdi>' . (int) $sh['deadlines']['objection_days'] . '</bdi> ימים מהשומה; ערר תוך <bdi>' . (int) $sh['deadlines']['appeal_days'] . '</bdi> ימים מההחלטה', $law . 'סעיפים 87 ו-88</a>' ),
	);
	$body = '';
	foreach ( $rows as $r ) {
		$body .= '<tr><td data-th="מה">' . esc_html( $r[0] ) . '</td><td data-th="הכלל">' . $r[1] . '</td><td data-th="מקור">' . $r[2] . '</td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>מס שבח במכירת דירה ביד יחיד: השיעורים, הפטורים והמועדים</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jtool-updated">נבדק מול חוק מיסוי מקרקעין, הוראת ביצוע 1/2026 ולוח העזר של רשות המסים ב-' . esc_html( justice_tools_he_date( $sh['checked_on'] ) ) . '.</p></div>';
}

/** Current-numbers table (page standard A5): every row has a value, valid-from date and source. */
function justice_tools_numbers_html( string $name ): string {
	$reg = justice_tools_registry();
	if ( 'chozeh-schirut' === $name ) {
		return justice_tools_schirut_numbers_html( $reg['rent_contract'] );
	}
	if ( 'pitzuyim' === $name ) {
		return justice_tools_pitzuyim_numbers_html( $reg['severance'] );
	}
	if ( 'mas-shevach' === $name ) {
		return justice_tools_shevach_numbers_html( $reg['shevach'] );
	}
	if ( in_array( $name, justice_tools_world_names(), true ) ) {
		return justice_tools_world_numbers_html( $name );
	}
	if ( in_array( $name, array( 'mezonot', 'izun', 'heskem-mamon', 'heskem-gerushin' ), true ) ) {
		return justice_tools_family_numbers_html( $name );
	}
	if ( 'gerushin' === $name ) {
		return justice_tools_gerushin_numbers_html( $reg['divorce_cost'] );
	}
	if ( 'tzavaa' === $name ) {
		return justice_tools_tzavaa_numbers_html( $reg['will_cost'] );
	}
	if ( 'teunat-drachim' === $name ) {
		return justice_tools_teuna_numbers_html( $reg['car_accident'] );
	}
	if ( 'yerusha' === $name ) {
		return justice_tools_yerusha_numbers_html( $reg['yerusha'] );
	}
	if ( 'mas-rechisha' === $name ) {
		return justice_tools_rechisha_numbers_html( $reg['purchase_tax'] );
	}
	if ( 'hetel-hashbacha' === $name ) {
		return justice_tools_hashbacha_numbers_html( $reg['betterment'] );
	}
	if ( 'havraa' === $name ) {
		return justice_tools_havraa_numbers_html( $reg['havraa'] );
	}
	if ( 'tviot-ktanot' === $name ) {
		return justice_tools_sc_numbers_html( $reg['small_claims'] );
	}
	if ( 'hatzmada' === $name ) {
		$cpi  = $reg['cpi'];
		$rows = '';
		$keys = array_slice( array_column( $cpi['series'], 0 ), -13 );
		$prev = null;
		foreach ( $keys as $key ) {
			$chained = justice_tools_cpi_chained( $cpi, $key );
			if ( null !== $prev ) {
				$value = '';
				foreach ( $cpi['series'] as $row ) {
					if ( $row[0] === $key ) {
						$value = $row[1];
					}
				}
				$base = '';
				foreach ( $cpi['bases'] as $b ) {
					if ( $key >= $b['from'] && $key <= $b['to'] ) {
						$base = $b['id'];
					}
				}
				$rows = '<tr><td data-th="חודש המדד">' . esc_html( justice_tools_he_month( $key ) ) . '</td><td data-th="המדד"><bdi>' . esc_html( (string) $value ) . '</bdi></td><td data-th="בסיס">ממוצע ' . esc_html( $base ) . '</td><td data-th="שינוי חודשי"><bdi>' . esc_html( number_format( ( $chained / $prev - 1 ) * 100, 1 ) ) . '%</bdi></td><td data-th="מקור"><a href="' . esc_url( $cpi['official_calculator_url'] ) . '" target="_blank" rel="noopener">' . esc_html( $cpi['publisher_he'] ) . '</a></td></tr>' . $rows;
			}
			$prev = $chained;
		}
		$int   = $reg['interest'];
		$irows = '';
		foreach ( array_reverse( array_keys( $int['linked'] ) ) as $i ) {
			$irows .= '<tr><td data-th="בתוקף מ">' . esc_html( justice_tools_he_date( $int['linked'][ $i ]['from'] ) ) . '</td><td data-th="ריבית שקלית"><bdi>' . esc_html( (string) $int['shekel'][ $i ]['rate'] ) . '%</bdi></td><td data-th="ריבית צמודה"><bdi>' . esc_html( (string) $int['linked'][ $i ]['rate'] ) . '%</bdi></td><td data-th="דמי פיגורים"><bdi>' . esc_html( (string) $int['arrears_fee'][ $i ]['rate'] ) . '%</bdi></td><td data-th="מקור"><a href="' . esc_url( $int['source_url'] ) . '" target="_blank" rel="noopener">' . esc_html( $int['publisher_he'] ) . '</a></td></tr>';
		}
		return '<div class="jtool-page"><h3>מדד המחירים לצרכן ב-12 החודשים האחרונים</h3><div class="jtool-datawrap"><table class="jtool-datatable"><thead><tr><th scope="col">חודש המדד</th><th scope="col">המדד</th><th scope="col">בסיס</th><th scope="col">שינוי חודשי</th><th scope="col">מקור</th></tr></thead><tbody>' . $rows . '</tbody></table></div>'
			. '<h3>שיעורי הריבית לפי חוק פסיקת ריבית והצמדה, לשנה</h3><div class="jtool-datawrap"><table class="jtool-datatable"><caption>ריבית שקלית וריבית צמודה: סעיף 2 לחוק. דמי פיגורים: סעיף 5א. השיעור חל מתחילת הרבעון.</caption><thead><tr><th scope="col">בתוקף מ</th><th scope="col">ריבית שקלית</th><th scope="col">ריבית צמודה</th><th scope="col">דמי פיגורים</th><th scope="col">מקור</th></tr></thead><tbody>' . $irows . '</tbody></table></div>'
			. '<p class="jtool-updated">נבדק מול הלמ"ס ומול החשב הכללי ב-' . esc_html( justice_tools_he_date( $reg['checked_on'] ) ) . '.</p></div>';
	}
	$mw    = $reg['min_wage'];
	$rows  = '';
	foreach ( array_reverse( $mw['rows'] ) as $row ) {
		$rows .= '<tr><td data-th="בתוקף מ">' . esc_html( justice_tools_he_date( $row['from'] ) ) . '</td><td data-th="לחודש">' . justice_tools_money( $row['monthly'] ) . '</td><td data-th="לשעה, 182 שעות">' . ( null === $row['hourly_182'] ? '—' : justice_tools_money( $row['hourly_182'] ) ) . '</td><td data-th="לשעה, 186 שעות">' . justice_tools_money( $row['hourly_186'] ) . '</td><td data-th="ליום, 5 ימים">' . justice_tools_money( $row['daily_5'] ) . '</td><td data-th="ליום, 6 ימים">' . justice_tools_money( $row['daily_6'] ) . '</td><td data-th="מקור"><a href="' . esc_url( $mw['source_url'] ) . '" target="_blank" rel="noopener">' . esc_html( $mw['publisher_he'] ) . '</a></td></tr>';
	}
	$last  = $mw['rows'][ count( $mw['rows'] ) - 1 ];
	$youth = '';
	$ages  = array( 'under16' => 'מתחת לגיל 16', 'age16' => 'גיל 16', 'age17' => 'גיל 17', 'apprentice' => 'חניך' );
	foreach ( $ages as $key => $label ) {
		$pct     = (int) $mw['youth_pct'][ $key ];
		$monthly = round( $last['monthly'] * $pct / 100, 2 );
		$hourly  = round( $monthly / $mw['youth_hours_divisor'], 2 );
		$youth  .= '<tr><td data-th="גיל">' . esc_html( $label ) . '</td><td data-th="משכר המינימום"><bdi>' . $pct . '%</bdi></td><td data-th="לחודש">' . justice_tools_money( $monthly ) . '</td><td data-th="לשעה">' . justice_tools_money( $hourly ) . '</td><td data-th="מקור"><a href="' . esc_url( $mw['youth_regulations_url'] ) . '" target="_blank" rel="noopener">תקנות 4 עד 6</a></td></tr>';
	}
	return '<div class="jtool-page"><h3>שכר המינימום לפי תאריך התחולה (גיל 18 ומעלה)</h3><div class="jtool-datawrap"><table class="jtool-datatable"><thead><tr><th scope="col">בתוקף מ</th><th scope="col">לחודש</th><th scope="col">לשעה, 182 שעות</th><th scope="col">לשעה, 186 שעות</th><th scope="col">ליום, 5 ימים</th><th scope="col">ליום, 6 ימים</th><th scope="col">מקור</th></tr></thead><tbody>' . $rows . '</tbody></table></div>'
		. '<h3>שכר מינימום לנוער ולחניכים מ-' . esc_html( justice_tools_he_date( $last['from'] ) ) . '</h3><div class="jtool-datawrap"><table class="jtool-datatable"><thead><tr><th scope="col">גיל</th><th scope="col">משכר המינימום</th><th scope="col">לחודש</th><th scope="col">לשעה, חלקי ' . esc_html( (string) $mw['youth_hours_divisor'] ) . '</th><th scope="col">מקור</th></tr></thead><tbody>' . $youth . '</tbody></table></div>'
		. '<p class="jtool-updated">שכר המינימום נבדק מול ' . esc_html( $mw['publisher_he'] ) . ' ב-' . esc_html( justice_tools_he_date( $mw['checked_on'] ) ) . '. השכר לנוער מחושב מהאחוז שבתקנות.</p></div>';
}

/** Comparison table (page standard A6). */
function justice_tools_compare_html( string $name ): string {
	if ( in_array( $name, array( 'yerusha', 'mas-rechisha', 'hetel-hashbacha', 'tzavaa', 'teunat-drachim', 'gerushin', 'chozeh-schirut', 'pitzuyim', 'mas-shevach', 'mezonot', 'izun', 'heskem-mamon', 'heskem-gerushin', 'luach-shahut', 'maakav-mezonot', 'mapat-gerushin' ), true ) ) {
		$snap = justice_tools_snapshot( $name );
		return '<div class="jtool-page">' . ( $snap['compare_table'] ?? '' ) . '</div>';
	}
	if ( 'tviot-ktanot' === $name ) {
		$snap = justice_tools_snapshot( 'tviot-ktanot' );
		return '<div class="jtool-page">' . ( $snap['compare_table'] ?? '' ) . '</div>';
	}
	if ( 'havraa' === $name ) {
		// Last year against this year, per seniority band: what reached the worker (after the statutory deduction) vs today.
		$hv     = justice_tools_registry()['havraa'];
		$latest = justice_tools_havraa_latest( $hv );
		$prev   = (int) $latest['year'] - 1;
		$pprice = null;
		foreach ( $hv['private_rates'] as $r ) {
			if ( $r['from'] <= $prev . '-07-01' ) {
				$pprice = (float) $r['rate'];
			}
		}
		$ded = 0;
		foreach ( $hv['deductions'] as $d ) {
			if ( (int) $d['year'] === $prev ) {
				$ded = (float) $d['days'];
			}
		}
		$body      = '';
		$prev_head = $prev . ( $ded ? ', אחרי הניכוי' : '' );
		foreach ( $hv['days'] as $band ) {
			$label = $band[0] === $band[1] ? 'שנה ' . $band[0] : ( null === $band[1] ? 'משנה ' . $band[0] : 'שנים ' . $band[0] . '-' . $band[1] );
			$a     = round( $band[2] * $pprice - $ded * $pprice, 2 );
			$b     = round( $band[2] * $latest['rate'], 2 );
			$body .= '<tr><td data-th="ותק">' . esc_html( $label ) . ' (<bdi>' . (int) $band[2] . '</bdi> ימים)</td><td data-th="' . esc_attr( $prev_head ) . '">' . justice_tools_money( $a ) . '</td><td data-th="' . esc_attr( $latest['year'] ) . '">' . justice_tools_money( $b ) . '</td><td data-th="תוספת">' . justice_tools_money( $b - $a ) . '</td></tr>';
		}
		return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>דמי הבראה במשרה מלאה: ' . $prev . ' (' . number_format( $pprice, 2 ) . ' ₪ ליום' . ( $ded ? ', פחות יום שנוכה לפי החוק' : '' ) . ') מול ' . esc_html( $latest['year'] ) . ' (' . number_format( $latest['rate'], 2 ) . ' ₪ ליום)</caption><thead><tr><th scope="col">ותק</th><th scope="col">' . esc_html( $prev_head ) . '</th><th scope="col">' . esc_html( $latest['year'] ) . '</th><th scope="col">תוספת</th></tr></thead><tbody>' . $body . '</tbody></table></div></div>';
	}
	if ( 'hatzmada' === $name ) {
		$snap = justice_tools_snapshots()['hatzmada'] ?? array();
		return '<div class="jtool-page">' . ( $snap['compare_table'] ?? '' ) . '</div>';
	}
	$rows = justice_tools_registry()['min_wage']['rows'] ?? array();
	if ( count( $rows ) < 2 ) {
		return '';
	}
	$a     = $rows[ count( $rows ) - 2 ];
	$b     = $rows[ count( $rows ) - 1 ];
	$cells = array( 'monthly' => 'לחודש', 'hourly_182' => 'לשעה, 182 שעות', 'hourly_186' => 'לשעה, 186 שעות', 'daily_5' => 'ליום, 5 ימים', 'daily_6' => 'ליום, 6 ימים' );
	$body  = '';
	foreach ( $cells as $key => $label ) {
		$change = $a[ $key ] ? ( $b[ $key ] / $a[ $key ] - 1 ) * 100 : 0;
		$body  .= '<tr><td data-th="רכיב">' . esc_html( $label ) . '</td><td data-th="מ-' . esc_attr( justice_tools_he_date( $a['from'] ) ) . '">' . justice_tools_money( $a[ $key ] ) . '</td><td data-th="מ-' . esc_attr( justice_tools_he_date( $b['from'] ) ) . '">' . justice_tools_money( $b[ $key ] ) . '</td><td data-th="תוספת">' . justice_tools_money( $b[ $key ] - $a[ $key ] ) . '</td><td data-th="שינוי"><bdi>' . esc_html( number_format( $change, 1 ) ) . '%</bdi></td></tr>';
	}
	return '<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>שכר המינימום מ-' . esc_html( justice_tools_he_date( $a['from'] ) ) . ' מול מ-' . esc_html( justice_tools_he_date( $b['from'] ) ) . '</caption><thead><tr><th scope="col">רכיב</th><th scope="col">מ-' . esc_html( justice_tools_he_date( $a['from'] ) ) . '</th><th scope="col">מ-' . esc_html( justice_tools_he_date( $b['from'] ) ) . '</th><th scope="col">תוספת</th><th scope="col">שינוי</th></tr></thead><tbody>' . $body . '</tbody></table></div></div>';
}

/**
 * [justice_tool_section name="..." part="method|numbers|compare|sources|updated"]: the page sections
 * that page-standard.txt says come from the registry, never retyped.
 *
 * @param array|string $atts Shortcode attributes.
 * @return string
 */
function justice_tools_section_shortcode( $atts ): string {
	$atts = shortcode_atts( array( 'name' => '', 'part' => '', 'mode' => '' ), $atts, 'justice_tool_section' );
	$name = sanitize_key( (string) $atts['name'] );
	if ( ! isset( justice_tools_catalog()[ $name ] ) ) {
		return '';
	}
	$mode = sanitize_key( (string) $atts['mode'] );
	$mode = isset( justice_tools_catalog()[ $name ]['modes'][ $mode ] ) ? $mode : '';
	$reg  = justice_tools_registry();
	$snap = justice_tools_snapshot( $name, $mode );
	switch ( (string) $atts['part'] ) {
		case 'method':
			return '<div class="jtool-page jtool-method"><p>לדוגמה, ' . esc_html( $snap['sentence'] ?? '' ) . ' כך הכלי מחשב את זה, שורה אחרי שורה:</p>' . ( $snap['method'] ?? '' ) . ( $snap['method_table'] ?? '' ) . '</div>';
		case 'numbers':
			return justice_tools_numbers_html( $name );
		case 'compare':
			return justice_tools_compare_html( $name );
		case 'sources':
			return '<div class="jtool-page jtool-sources-list">' . justice_tools_sources_html( $name ) . '</div>';
		case 'updated':
			return '<p class="jtool-updated">הנתונים בעמוד נבדקו מול המקורות הרשמיים ב-' . esc_html( justice_tools_he_date( justice_tools_checked_on( $name ) ) ) . '.</p>';
		case 'nii':
			// The National Insurance table of the child-support tool (HAD-506), for /bituach-leumi-alimony/.
			return 'mezonot' === $name ? justice_tools_family_nii_html() : '';
		case 'needs':
			return 'mezonot' === $name ? justice_tools_family_needs_html() : '';
	}
	return '';
}
add_shortcode( 'justice_tool_section', 'justice_tools_section_shortcode' );

/** Whether a tool page is published; true where WordPress cannot tell (tests, CLI). */
function justice_tools_page_live( string $path ): bool {
	if ( ! function_exists( 'get_page_by_path' ) ) {
		return true;
	}
	$post = get_page_by_path( trim( $path, '/' ), OBJECT, array( 'page', 'post', 'articles' ) );
	return $post && 'publish' === $post->post_status;
}

/** [justice_tools_index]: hub cards (design-spec B11) with each tool's question and data stamp. */
function justice_tools_index_shortcode(): string {
	$cards = '';
	foreach ( justice_tools_catalog() as $name => $tool ) {
		foreach ( array_merge( array( '' ), array_keys( $tool['modes'] ?? array() ) ) as $mode ) {
			$t = justice_tools_tool( $name, $mode );
			if ( '' !== $mode && ! justice_tools_page_live( (string) $t['page'] ) ) {
				continue; // A mode whose own page is not published yet (HAD-506: /tzmidut-mezonot/, /rsu-options-crypto/).
			}
			$cards .= '<a class="jtool-card" href="' . esc_url( home_url( $t['page'] ) ) . '"><strong>' . esc_html( $t['name'] ) . '</strong><span>' . esc_html( $t['question'] ) . '</span><small>' . esc_html( justice_tools_stamp( $name, $mode ) ) . '</small></a>';
		}
	}
	return '<div class="jtool-page jtool-cards">' . $cards . '</div>';
}
add_shortcode( 'justice_tools_index', 'justice_tools_index_shortcode' );

/**
 * True when a post body opens with the instrument of a known tool ([justice_tool name="..."]).
 * Whitespace, &nbsp;, HTML or block-editor comments and empty paragraphs before it do not count;
 * [justice_tool_section] is not the instrument and does not count either.
 *
 * @param string $content Raw post content.
 * @return bool
 */
function justice_tools_content_leads_with_tool( string $content ): bool {
	$head = preg_replace( '/^(?:\s|&nbsp;|\x{00A0}|<!--.*?-->|<p>(?:\s|&nbsp;|\x{00A0})*<\/p>)+/su', '', $content );
	if ( ! is_string( $head ) || ! preg_match( '/^(?:<p>\s*)?\[justice_tool\s[^\]]*\bname=["\']?([a-z-]+)/u', $head, $m ) ) {
		return false;
	}
	return isset( justice_tools_catalog()[ $m[1] ] );
}

/**
 * An article (post type "articles") whose body opens with a tool gets the compact layout in
 * single-articles.php (HAD-502): no featured image above the content, the page-style header,
 * the article column at the width the tool was built for, and the answer box kept as one short
 * paragraph. Measured on /israel-road-accident-compensation-law/ at 1280x900: the form started at
 * 1,708 px (header to 630 px, a 384 px image, a 323 px answer box in a 576 px column).
 *
 * Articles with a named topic reviewer (Maya Rotenberg on family law) are left exactly as they are.
 *
 * @param int $post_id Post ID.
 * @return bool
 */
function justice_tools_article_opens_with_tool( int $post_id ): bool {
	if ( $post_id <= 0 || 'articles' !== get_post_type( $post_id ) ) {
		return false;
	}
	if ( ! justice_tools_content_leads_with_tool( (string) get_post_field( 'post_content', $post_id ) ) ) {
		return false;
	}
	return ! ( function_exists( 'justice_theme_article_reviewer_expert_only' ) && null !== justice_theme_article_reviewer_expert_only( $post_id ) );
}

// Family law (HAD-506): answer boxes, stamps, sources and page tables of the four family tools.
require_once __DIR__ . '/justice-tools-family.php';
// The divorce world (HAD-539): the custody calendar, the payment tracker and the roadmap on /divorce-lawyer/.
require_once __DIR__ . '/justice-tools-divorce-world.php';
