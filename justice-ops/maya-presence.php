<?php
/**
 * Maya Rotenberg's presence on family-law pages (HAD-510, owner order 14.10.2026).
 *
 * One module owns her expert card, the byline-level expert line and her structured data:
 * - which pages count as family law: the practice-area terms (a child term inherits its
 *   parent's family, family-court rulings count), the theme's family and prenup clusters, and
 *   pages, which carry the practice-area taxonomy from this release on;
 * - the card itself (server-rendered HTML): photo, name, her published role, facts that each
 *   carry their source, a compact tool for the page topic, key numbers from the tools registry,
 *   questions from her own profile page, and the existing contact path (the site WhatsApp intake);
 * - one line at the top of the page that names her, only where the template does not already;
 * - JSON-LD: Person and LegalService with sameAs only to her own official pages, and the page
 *   "mentions" her. reviewedBy only for a page an editor marked as reviewed (meta jt_maya_reviewed_on),
 *   never by default (review-claims switch of 14.7.2026).
 *
 * Every fact below is quoted or summarised from a page she or her office published, or from the
 * reviewed source profile on this site, and carries that link. Nothing here invents a year, a
 * rating, a review or a result.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// Identity and sources
// ---------------------------------------------------------------------------

/**
 * The public addresses of her presence. The mini-site is her profile on this site, the source
 * profile is the reviewed firm page (post 11687), the office site is her own.
 *
 * @return array<string,string>
 */
function justice_maya_urls(): array {
	$minisite = home_url( '/lawyers/advocate-maya-rotenberg/' );
	if ( function_exists( 'justice_theme_get_connected_lawyer_by_slug' ) ) {
		$lawyer = justice_theme_get_connected_lawyer_by_slug( 'advocate-maya-rotenberg' );
		if ( $lawyer instanceof WP_Post ) {
			$minisite = (string) get_permalink( $lawyer->ID );
		}
	}

	return array(
		'minisite'       => $minisite,
		'profile'        => home_url( '/family-law-lawyer-recommended-divorce-wills-inheritances/' ),
		'official'       => 'https://rotenberglaw.co.il/',
		'official_about' => 'https://rotenberglaw.co.il/about',
		'duns'           => 'https://www.duns100.co.il/%D7%9E%D7%90%D7%99%D7%94_%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92_%D7%9E%D7%A9%D7%A8%D7%93_%D7%A2%D7%95%D7%A8%D7%9B%D7%99_%D7%93%D7%99%D7%9F',
		'duns_en'        => 'https://www.duns100.co.il/en/Maya_Rotenberg_Law_Office',
		'linkedin'       => 'https://il.linkedin.com/in/maya-rotenberg-88035531',
		'judgment_91915' => 'https://meronlaw.co.il/wp-content/uploads/2023/10/1a801bbb-6429-4d35-a4b1-0cf2ca5a487d.pdf',
	);
}

/** Post ID and path of the reviewed source profile, which never carries her card. */
function justice_maya_source_profile_post_id(): int {
	return 11687;
}

/**
 * Facts the card may state. Each one is a quote or a close summary of a published page, with the
 * page it came from and the day it was checked. 'topics' lists where it leads; 'all' fits anywhere.
 *
 * @return array<string,array<string,mixed>>
 */
function justice_maya_facts(): array {
	$u = justice_maya_urls();

	return array(
		'case-91915' => array(
			'text'    => 'רשומה בכותרת פסק הדין בבע״מ 919/15 של בית המשפט העליון כבאת כוח המבקש, לצד עו״ד זרח רוזנבלום. זה פסק הדין שקבע איך מתחלקים מזונות ילדים בגילי 6 עד 15.',
			'sources' => array(
				array( 'label' => 'פסק הדין', 'url' => $u['judgment_91915'] ),
				array( 'label' => 'פרופיל המקורות', 'url' => $u['profile'] ),
			),
			'checked' => '2026-08-02',
			'topics'  => array( 'all' ),
			'lead'    => array( 'child-support', 'custody', 'spousal' ),
		),
		'duns-2026'  => array(
			'text'    => 'המשרד מופיע בדירוג Dun’s 100 לדיני משפחה וירושה לשנת 2026.',
			'sources' => array(
				array( 'label' => 'Dun’s 100', 'url' => $u['duns'] ),
			),
			'checked' => '2026-08-02',
			'topics'  => array( 'all' ),
			'lead'    => array(),
		),
		'areas'      => array(
			'text'    => 'התחומים שאתר המשרד ופרופיל Dun’s 100 מייחסים למשרד: משפחה וגירושין, צוואות וירושות, הסכמים וגישור. אתר המשרד מזכיר גם חלוקת רכוש, ענייני ילדים ומזונות.',
			'sources' => array(
				array( 'label' => 'פרופיל המקורות', 'url' => $u['profile'] ),
				array( 'label' => 'אתר המשרד', 'url' => $u['official_about'] ),
			),
			'checked' => '2026-08-02',
			'topics'  => array( 'all' ),
			'lead'    => array(),
		),
		'mediator'   => array(
			'text'    => 'אתר המשרד: עורכת דין ומגשרת, «המתמחה ביישוב סכסוכים בתחום דיני המשפחה».',
			'sources' => array(
				array( 'label' => 'אתר המשרד', 'url' => $u['official_about'] ),
			),
			'checked' => '2026-10-14',
			'topics'  => array( 'mediation', 'divorce', 'custody', 'property', 'family' ),
			'lead'    => array( 'mediation' ),
		),
		'adoption'   => array(
			'text'    => 'אתר המשרד: «חברת ועדת אימוץ ופונדקאות, לשכת עורכי הדין בשנת 2020».',
			'sources' => array(
				array( 'label' => 'אתר המשרד', 'url' => $u['official_about'] ),
			),
			'checked' => '2026-10-14',
			'topics'  => array( 'adoption' ),
			'lead'    => array( 'adoption' ),
		),
	);
}

/**
 * The facts for one topic, at most three, the ones that lead for the topic first.
 *
 * @return array<int,array<string,mixed>>
 */
function justice_maya_facts_for_topic( string $topic, bool $gated_allowed ): array {
	$lead = array();
	$rest = array();
	foreach ( justice_maya_facts() as $id => $fact ) {
		if ( ! empty( $fact['gated'] ) && ! $gated_allowed ) {
			continue;
		}
		$topics = (array) $fact['topics'];
		if ( ! in_array( 'all', $topics, true ) && ! in_array( $topic, $topics, true ) ) {
			continue;
		}
		$fact['id'] = $id;
		if ( in_array( $topic, (array) $fact['lead'], true ) ) {
			$lead[] = $fact;
		} else {
			$rest[] = $fact;
		}
	}

	return array_slice( array_merge( $lead, $rest ), 0, 3 );
}

// ---------------------------------------------------------------------------
// Which pages are family law
// ---------------------------------------------------------------------------

/**
 * Pages get the practice-area taxonomy, so a page categorised in family law gets her card like
 * an article does (owner: "every page on family law must be categorised in family law").
 */
function justice_maya_register_page_taxonomy(): void {
	if ( function_exists( 'taxonomy_exists' ) && taxonomy_exists( 'practice-areas' ) ) {
		register_taxonomy_for_object_type( 'practice-areas', 'page' );
	}
}
add_action( 'init', 'justice_maya_register_page_taxonomy', 20 );

/**
 * Pages carry the cards mesh too. On a page the family still has to resolve (a family-law term
 * or the theme's family cluster), so other pages are untouched.
 *
 * @param string[] $types Singular types.
 * @return string[]
 */
function justice_maya_singular_types( $types ): array {
	$types   = (array) $types;
	$types[] = 'page';

	return array_values( array_unique( $types ) );
}
add_filter( 'justice_cards_singular_types', 'justice_maya_singular_types' );

/** Slugs of the theme clusters that are family law (inc/content-clusters.php). */
function justice_maya_family_cluster_keys(): array {
	return array( 'family-law', 'prenup' );
}

/**
 * Family fallback for content that has no practice-area term yet: the theme's own cluster map or
 * the content_cluster meta. Terms always win; this only fills an empty answer.
 *
 * @param string[] $terms   Terms resolved by the cards module.
 * @param int      $post_id Post ID.
 * @return string[]
 */
function justice_maya_family_fallback_terms( $terms, $post_id = 0 ): array {
	$terms   = (array) $terms;
	$post_id = (int) $post_id;
	if ( $terms || $post_id <= 0 || ! function_exists( 'justice_cards_family_map' ) ) {
		return $terms;
	}
	if ( justice_maya_source_profile_post_id() === $post_id ) {
		return $terms;
	}

	$family  = justice_cards_family_map()['family'] ?? array();
	$cluster = sanitize_key( (string) get_post_meta( $post_id, 'content_cluster', true ) );
	if ( $cluster && in_array( $cluster, justice_maya_family_cluster_keys(), true ) ) {
		return $family;
	}

	if ( function_exists( 'justice_theme_cluster_for_slug' ) ) {
		$slug = (string) get_post_field( 'post_name', $post_id );
		$hit  = justice_theme_cluster_for_slug( $slug );
		if ( is_array( $hit ) && in_array( (string) ( $hit['key'] ?? '' ), justice_maya_family_cluster_keys(), true ) ) {
			return $family;
		}
	}

	return $terms;
}
add_filter( 'justice_cards_current_terms', 'justice_maya_family_fallback_terms', 10, 2 );

// ---------------------------------------------------------------------------
// Topic of the page
// ---------------------------------------------------------------------------

/**
 * Hebrew label of every topic the card knows.
 *
 * @return array<string,string>
 */
function justice_maya_topic_labels(): array {
	return array(
		'child-support' => 'מזונות ילדים',
		'spousal'       => 'מזונות אישה',
		'custody'       => 'משמורת וזמני שהות',
		'property'      => 'רכוש ואיזון משאבים',
		'prenup'        => 'הסכם ממון',
		'rabbinical'    => 'בית הדין הרבני וגט',
		'mediation'     => 'גישור ויישוב סכסוך',
		'violence'      => 'אלימות במשפחה וצו הגנה',
		'adoption'      => 'אימוץ, אפוטרופסות ופונדקאות',
		'cohabitation'  => 'ידועים בציבור',
		'divorce'       => 'גירושין',
		'family'        => 'דיני משפחה',
	);
}

/**
 * Resolve the topic from the page's own terms, then its title and slug. Order matters: the most
 * specific topic wins ("מזונות ילדים בגירושין" is a child-support page, not a divorce page).
 */
function justice_maya_topic_for( string $title, string $slug, array $term_slugs = array() ): string {
	$term_topics = array(
		'child-support'   => 'child-support',
		'child-custody'   => 'custody',
		'rabbinical-court' => 'rabbinical',
		'prenuptial-agreement' => 'prenup',
	);
	foreach ( $term_topics as $term => $topic ) {
		if ( in_array( $term, $term_slugs, true ) ) {
			return $topic;
		}
	}

	$hay   = $title . ' ' . rawurldecode( $slug );
	$rules = array(
		'child-support' => '/מזונות\s*(?:ה?ילד|קטינ|ילדים)|מחשבון מזונות|child-support|child_support|919\/15/u',
		'spousal'       => '/מזונות\s*(?:ה?אישה|אשה|בן זוג)|spousal|alimony|מזונות/u',
		'violence'      => '/אלימות|צו הגנה|צווי הגנה|violence|protection-order|restraining/u',
		'custody'       => '/משמורת|זמני שהות|הסדרי שהות|הסדרי ראייה|הסדרי ראיה|אחריות הורית|ניכור הורי|custody|parenting|parental|abduction|relocation/u',
		'prenup'        => '/הסכם ממון|הסכמי ממון|prenup|prenuptial|matrimonial-property/u',
		'cohabitation'  => '/ידועים בציבור|ידועה בציבור|ידוע בציבור|cohabit|common-law|yeduim|unmarried/u',
		'property'      => '/רכוש|איזון משאבים|פנסיה|דירת מגורים|property|resource-balancing|pension|apartment|house-ownership/u',
		'adoption'      => '/אימוץ|פונדקאות|אפוטרופ|אבהות|adoption|adopting|surrogacy|guardian|paternity/u',
		'mediation'     => '/גישור|יישוב סכסוך|יישוב סכסוכים|mediation|dispute/u',
		'rabbinical'    => '/רבני|גט|כתובה|rabbinical|rabbinate|gett|ketubah|get-/u',
		'divorce'       => '/גירוש|גרוש|divorce/u',
	);
	foreach ( $rules as $topic => $pattern ) {
		if ( 1 === preg_match( $pattern, $hay ) ) {
			return $topic;
		}
	}

	return 'family';
}

/** Topic of a post. */
function justice_maya_post_topic( int $post_id ): string {
	$terms = function_exists( 'get_the_terms' ) ? get_the_terms( $post_id, 'practice-areas' ) : array();
	$slugs = ( $terms && ! is_wp_error( $terms ) ) ? wp_list_pluck( $terms, 'slug' ) : array();

	return justice_maya_topic_for(
		wp_strip_all_tags( (string) get_the_title( $post_id ) ),
		(string) get_post_field( 'post_name', $post_id ),
		array_map( 'strval', (array) $slugs )
	);
}

// ---------------------------------------------------------------------------
// Request context
// ---------------------------------------------------------------------------

/** A date an editor set after Maya really reviewed this page (YYYY-MM-DD), or ''. */
function justice_maya_reviewed_on( int $post_id ): string {
	$value = trim( (string) get_post_meta( $post_id, 'jt_maya_reviewed_on', true ) );

	return 1 === preg_match( '/^\d{4}-\d{2}-\d{2}$/', $value ) ? $value : '';
}

/** True when the article template's own byline already names her ("נבדק מקצועית על ידי"). */
function justice_maya_template_byline_names_her( int $post_id ): bool {
	if ( 'articles' !== get_post_type( $post_id ) || ! function_exists( 'justice_theme_article_visible_attribution' ) ) {
		return false;
	}
	$attribution = justice_theme_article_visible_attribution( $post_id );

	return false !== mb_strpos( (string) ( $attribution['name'] ?? '' ), 'רוטנברג' );
}

/**
 * Everything the card, the line and the schema need for the queried page, computed once.
 *
 * @return array<string,mixed>
 */
function justice_maya_context(): array {
	static $cache = array();

	$post_id = function_exists( 'get_queried_object_id' ) ? (int) get_queried_object_id() : 0;
	if ( isset( $cache[ $post_id ] ) ) {
		return $cache[ $post_id ];
	}

	$none = array( 'applies' => false );
	if (
		$post_id <= 0
		|| ! function_exists( 'justice_cards_current_terms' )
		|| ! is_singular( justice_cards_singular_types() )
		|| justice_maya_source_profile_post_id() === $post_id
	) {
		$cache[ $post_id ] = $none;
		return $none;
	}

	$post = get_post( $post_id );
	if (
		$post instanceof WP_Post
		&& function_exists( 'justice_theme_is_practice_landing_page' )
		&& justice_theme_is_practice_landing_page( $post )
	) {
		// Landing pages carry her featured card in their own template.
		$cache[ $post_id ] = $none;
		return $none;
	}

	$family = justice_cards_family_map()['family'] ?? array();
	$terms  = justice_cards_current_terms();
	if ( ! $terms || ! array_intersect( $terms, $family ) ) {
		$cache[ $post_id ] = $none;
		return $none;
	}

	$settings  = justice_cards_settings();
	$lawyer_id = 0;
	foreach ( justice_cards_lawyers( $terms, (int) $settings['max'] ) as $lawyer ) {
		if ( function_exists( 'justice_lawyer_owner_is_maya_profile' ) && justice_lawyer_owner_is_maya_profile( (int) $lawyer->ID ) ) {
			$lawyer_id = (int) $lawyer->ID;
			break;
		}
	}
	if ( ! $lawyer_id || ! (int) $settings['enabled'] ) {
		$cache[ $post_id ] = $none;
		return $none;
	}

	$cache[ $post_id ] = array(
		'applies'     => true,
		'post_id'     => $post_id,
		'lawyer_id'   => $lawyer_id,
		'topic'       => justice_maya_post_topic( $post_id ),
		'reviewed_on' => justice_maya_reviewed_on( $post_id ),
		'has_byline'  => justice_maya_template_byline_names_her( $post_id ),
		'tool_first'  => function_exists( 'justice_tools_article_opens_with_tool' ) && justice_tools_article_opens_with_tool( $post_id ),
	);

	return $cache[ $post_id ];
}

// ---------------------------------------------------------------------------
// Card parts
// ---------------------------------------------------------------------------

/** One outbound source chip. */
function justice_maya_source_chip( array $source ): string {
	$url      = (string) $source['url'];
	$internal = 0 === strpos( $url, home_url( '/' ) );
	$rel      = $internal ? '' : ( false !== strpos( $url, 'rotenberglaw.co.il' ) ? ' rel="sponsored noopener" target="_blank"' : ' rel="noopener" target="_blank"' );

	return '<a class="jt-maya-card__src" href="' . esc_url( $url ) . '"' . $rel . '>' . esc_html( (string) $source['label'] ) . '</a>';
}

/** The fact file: plain sentences an assistant can quote, each with its source. */
function justice_maya_facts_html( string $topic, bool $gated_allowed ): string {
	$items = '';
	foreach ( justice_maya_facts_for_topic( $topic, $gated_allowed ) as $fact ) {
		$chips = '';
		foreach ( (array) $fact['sources'] as $source ) {
			$chips .= justice_maya_source_chip( $source );
		}
		$items .= '<li class="jt-maya-card__fact" data-fact="' . esc_attr( (string) $fact['id'] ) . '"><span class="jt-maya-card__facttext">' . esc_html( (string) $fact['text'] ) . '</span>'
			. '<span class="jt-maya-card__srcs">' . $chips . '<span class="jt-maya-card__checked">נבדק ' . esc_html( justice_maya_he_date( (string) $fact['checked'] ) ) . '</span></span></li>';
	}

	return $items ? '<ol class="jt-maya-card__facts" aria-label="עובדות עם מקור">' . $items . '</ol>' : '';
}

/** 2026-10-14 to 14.10.2026. */
function justice_maya_he_date( string $iso ): string {
	$parts = array_map( 'intval', explode( '-', $iso ) );

	return 3 === count( $parts ) ? $parts[2] . '.' . $parts[1] . '.' . $parts[0] : $iso;
}

/**
 * The checklist for a topic: five things to bring to a first meeting. General preparation, no
 * numbers, no legal claims.
 *
 * @return array{title:string,items:string[],note:string}
 */
function justice_maya_checklist( string $topic ): array {
	$money = array(
		'תעודות זהות עם ספח ותעודת נישואין',
		'תלושי שכר או דוחות הכנסה של שני בני הזוג מהשנה האחרונה',
		'דפי חשבון בנק, כרטיסי אשראי והלוואות',
		'מסמכי הנכסים: נסח טאבו, משכנתא, רכב, חסכונות, פנסיה וקרן השתלמות',
		'רשימת ההוצאות החודשיות של הבית והילדים',
	);
	$lists = array(
		'custody'      => array(
			'title' => '5 דברים להכין לפני שיחה על זמני שהות',
			'items' => array(
				'לוח זמני השהות כפי שהוא היום, בשבועיים רגילים',
				'פרטי מסגרות החינוך והמרחק בין הבתים',
				'התכתבויות בין ההורים על זמנים ואיסופים',
				'מסמכים רפואיים או חינוכיים שנוגעים לילדים',
				'הצעה כתובה ללוח שהות לשנה, כולל חגים וחופשות',
			),
		),
		'property'     => array(
			'title' => '5 מסמכים להכין לפני שיחה על חלוקת הרכוש',
			'items' => array(
				'נסחי טאבו, חוזי רכישה ומסמכי משכנתא',
				'דוחות שנתיים של פנסיה, קרן השתלמות וביטוחי מנהלים',
				'דפי חשבון ותיקי השקעות של שני בני הזוג',
				'מסמכים על נכסים מלפני הנישואין, מתנות וירושות',
				'רשימת הלוואות וחובות משותפים',
			),
		),
		'prenup'       => array(
			'title' => '5 דברים להכין לפני ניסוח הסכם ממון',
			'items' => array(
				'רשימת הנכסים של כל אחד מכם היום',
				'פרטי הדירה: של מי היא, מי משלם ומה מתוכנן',
				'עסקים, מניות או אופציות',
				'ירושות ומתנות צפויות מהמשפחה',
				'תעודות זהות של שניכם',
			),
		),
		'mediation'    => array(
			'title' => '5 דברים להכין לפני גישור',
			'items' => array(
				'רשימת הנושאים שבמחלוקת ומה חשוב לכם בכל אחד',
				'נתוני הכנסות והוצאות של הבית',
				'הצעה ראשונית לזמני שהות, אם יש ילדים',
				'מסמכי הנכסים העיקריים',
				'פרטי ההליכים שכבר נפתחו, אם נפתחו',
			),
		),
		'violence'     => array(
			'title' => 'מה לתעד לפני בקשה לצו הגנה',
			'items' => array(
				'תאריך ותיאור קצר של כל אירוע',
				'הודעות, הקלטות וצילומים',
				'אישורים רפואיים, אם יש',
				'אישורי תלונה במשטרה, אם הוגשה',
				'שמות של עדים',
			),
			'note'  => 'בסכנה מיידית מתקשרים למשטרה, 100.',
		),
		'cohabitation' => array(
			'title' => '5 דברים להכין כשאתם ידועים בציבור',
			'items' => array(
				'הוכחות למגורים משותפים: חוזה שכירות, חשבונות, כתובת',
				'רשימת הנכסים של כל אחד מכם',
				'חשבונות בנק משותפים והלוואות',
				'פרטי הילדים המשותפים, אם יש',
				'הסכם קיים בין בני הזוג, אם נחתם',
			),
		),
	);
	$list = $lists[ $topic ] ?? array(
		'title' => '5 מסמכים להכין לפני פגישה על ' . ( justice_maya_topic_labels()[ $topic ] ?? 'דיני משפחה' ),
		'items' => $money,
	);
	$list['note'] = (string) ( $list['note'] ?? '' );

	return $list;
}

/** Checklist tool: server-rendered list, checkboxes count when JavaScript runs. */
function justice_maya_checklist_html( string $topic, string $wa_href, int $uid ): string {
	$list  = justice_maya_checklist( $topic );
	$items = '';
	foreach ( $list['items'] as $i => $item ) {
		$id     = 'jtmc-' . $uid . '-c' . $i;
		$items .= '<li><input type="checkbox" id="' . esc_attr( $id ) . '"><label for="' . esc_attr( $id ) . '">' . esc_html( $item ) . '</label></li>';
	}
	$prenup = '';
	if ( 'prenup' === $topic ) {
		$law    = 'https://www.nevo.co.il/law_html/law00/72138.htm';
		$prenup = '<p class="jt-maya-card__toolnote">הסכם ממון טעון אישור: של בית המשפט לענייני משפחה או בית הדין הדתי, ולפני הנישואין או בשעת עריכתם גם של נוטריון או רושם הנישואין. <a href="' . esc_url( $law ) . '" target="_blank" rel="noopener">חוק יחסי ממון, סעיף 2</a></p>';
	}

	return '<section class="jt-maya-card__tool" aria-labelledby="jtmc-' . $uid . '-t" data-jt-maya-checklist>'
		. '<p class="jt-maya-card__kicker">כלי מהיר</p>'
		. '<h3 class="jt-maya-card__tooltitle" id="jtmc-' . $uid . '-t">' . esc_html( $list['title'] ) . '</h3>'
		. '<ul class="jt-maya-card__check">' . $items . '</ul>'
		. '<p class="jt-maya-card__count" aria-live="polite" data-jt-maya-count></p>'
		. ( '' !== $list['note'] ? '<p class="jt-maya-card__toolnote jt-maya-card__toolnote--alert">' . esc_html( $list['note'] ) . '</p>' : '' )
		. $prenup
		. '<div class="jt-maya-card__toolacts"><a class="jt-maya-card__btn jt-maya-card__btn--quiet" href="' . esc_url( $wa_href ) . '" target="_blank" rel="noopener nofollow" data-jt-maya-check-wa>לעבור על הרשימה עם עו״ד רוטנברג</a></div>'
		. '</section>';
}

/** Address of the full child-support calculator (filterable for the HAD-506 calculator page). */
function justice_maya_child_support_calculator_url(): string {
	$url = home_url( '/child-support/' ) . '#' . rawurlencode( 'מחשבון-מזונות-ילדים-8211-כמה-מגיע' );

	return (string) apply_filters( 'justice_maya_child_support_calculator_url', $url );
}

/**
 * Child-support quick tool: income share against parenting-time share, the two numbers the
 * ratio method of 919/15 starts from. It computes no amount; the amount needs the children's
 * needs and housing, which the full calculator asks for.
 */
function justice_maya_ratio_html( string $wa_href, int $uid ): string {
	$calc = justice_maya_child_support_calculator_url();
	$law  = justice_maya_urls()['judgment_91915'];
	$p    = 'jtmc-' . $uid;

	return '<section class="jt-maya-card__tool" aria-labelledby="' . $p . '-t">'
		. '<p class="jt-maya-card__kicker">כלי מהיר · 3 שדות</p>'
		. '<h3 class="jt-maya-card__tooltitle" id="' . $p . '-t">היחס שמכריע במזונות מגיל 6</h3>'
		. '<form class="jt-maya-card__ratio" action="' . esc_url( $calc ) . '" method="get" data-jt-maya-ratio novalidate>'
		. '<div class="jt-maya-card__field"><label for="' . $p . '-a">ההכנסה נטו שלך בחודש (₪)</label><input id="' . $p . '-a" type="number" inputmode="numeric" min="0" step="100" autocomplete="off" data-in="a"></div>'
		. '<div class="jt-maya-card__field"><label for="' . $p . '-b">ההכנסה נטו של ההורה השני (₪)</label><input id="' . $p . '-b" type="number" inputmode="numeric" min="0" step="100" autocomplete="off" data-in="b"></div>'
		. '<div class="jt-maya-card__field"><label for="' . $p . '-n">לילות אצלך מתוך 14</label><input id="' . $p . '-n" type="number" inputmode="numeric" min="0" max="14" step="1" autocomplete="off" data-in="n"></div>'
		. '<button type="submit" class="jt-maya-card__btn jt-maya-card__btn--solid">חשבו את היחס</button>'
		. '</form>'
		. '<div class="jt-maya-card__result" aria-live="polite" data-jt-maya-result hidden></div>'
		. '<p class="jt-maya-card__toolnote">בבע״מ 919/15 נקבע שבגילי 6 עד 15 שני ההורים חבים במזונות, והחלוקה ביניהם «על פי יכולותיהם הכלכליות היחסיות», בהתחשב בחלוקת המשמורת בפועל. <a href="' . esc_url( $law ) . '" target="_blank" rel="noopener">פסק הדין</a>. הכלי לא שומר את מה שהקלדתם.</p>'
		. '<div class="jt-maya-card__toolacts">'
		. '<a class="jt-maya-card__btn jt-maya-card__btn--solid" href="' . esc_url( $calc ) . '">למחשבון המלא, עם סכום</a>'
		. '<a class="jt-maya-card__btn jt-maya-card__btn--quiet" href="' . esc_url( $wa_href ) . '" target="_blank" rel="noopener nofollow" data-jt-maya-ratio-wa>לבדוק את זה עם עו״ד רוטנברג</a>'
		. '</div>'
		. '</section>';
}

/**
 * Key numbers for the topic, read from the theme's tools registry (the same sourced values the
 * divorce-cost tool uses). Empty when the registry is not there.
 */
function justice_maya_numbers_html( string $topic ): string {
	if ( ! function_exists( 'justice_tools_registry' ) ) {
		return '';
	}
	$reg = justice_tools_registry();
	$d   = $reg['divorce_cost'] ?? array();
	if ( empty( $d['rabbinical'] ) || empty( $d['family'] ) || empty( $d['disputes'] ) ) {
		return '';
	}
	$rb  = $d['rabbinical'];
	$fc  = $d['family'];
	$ds  = $d['disputes'];
	$nis = static function ( $n ): string {
		return '<bdi>' . esc_html( number_format( (float) $n, 0, '.', ',' ) ) . '</bdi> ₪';
	};
	$a   = static function ( string $url, string $label ): string {
		return '<a href="' . esc_url( $url ) . '" target="_blank" rel="noopener">' . esc_html( $label ) . '</a>';
	};
	$rows = array(
		'support'   => array( 'תביעת מזונות', $nis( $fc['support'] ) . ' בבית המשפט לענייני משפחה; בבית הדין הרבני המגיש פטור', $a( $fc['url'], 'פרט 5' ) . '; ' . $a( $rb['url'], 'תקנה 14א' ) ),
		'custody'   => array( 'תביעת החזקת ילדים', $nis( $fc['custody'] ) . ' בבית המשפט; ' . $nis( $rb['custody'] ) . ' בבית הדין', $a( $fc['url'], 'פרט 6ב' ) . '; ' . $a( $rb['url'], 'פרט 7' ) ),
		'divorce'   => array( 'תביעת גירושין בבית הדין הרבני', $nis( $rb['divorce'] ) . ' ועוד פרוטוקול ' . $nis( $rb['transcript_divorce'] ), $a( $rb['url'], 'פרט 4(1)(א)' ) ),
		'agreement' => array( 'אישור הסכם גירושין', $nis( $rb['agreement'] ) . ' בבית הדין; ' . $nis( $fc['agreement'] ) . ' ועוד פרוטוקול ' . $nis( $fc['transcript'] ) . ' בבית המשפט', $a( $rb['url'], 'פרט 4(2)' ) . '; ' . $a( $fc['url'], 'פרט 6א' ) ),
		'spouses'   => array( 'אישור הסכם בין בני זוג בבית המשפט', $nis( $fc['agreement'] ) . ' ועוד פרוטוקול ' . $nis( $fc['transcript'] ), $a( $fc['url'], 'פרט 6א' ) ),
		'property'  => array( 'תביעה רכושית', $nis( $rb['property'] ) . ' בבית הדין; ' . $nis( $fc['property'] ) . ' בבית המשפט', $a( $rb['url'], 'פרט 4(1)(ב)' ) . '; ' . $a( $fc['url'], 'פרט 2א' ) ),
		'request'   => array( 'בקשה ליישוב סכסוך', $nis( $rb['request'] ) . ' בבית הדין; ' . $nis( $fc['request'] ) . ' בבית המשפט', $a( $rb['url'], 'פרט 19(טז)' ) . '; ' . $a( $fc['url'], 'פרט 13' ) ),
		'mahut'     => array( 'פגישות מהו״ת ביחידת הסיוע', 'עד <bdi>' . (int) $ds['meetings_max'] . '</bdi> פגישות, בלי תשלום, בתוך <bdi>' . (int) $ds['meetings_days'] . '</bdi> ימים', $a( $ds['url'], 'סעיף 3(ב)' ) ),
		'stay'      => array( 'עיכוב הליכים אחרי הבקשה', '<bdi>' . (int) $ds['stay_days'] . '</bdi> ימים, או <bdi>' . (int) $ds['stay_days_extended'] . '</bdi> בהארכה', $a( $ds['url'], 'סעיף 3(ה)' ) ),
		'get'       => array( 'בקשה לסידור גט', $nis( $rb['get_request'] ), $a( $rb['url'], 'פרט 4(3)(א)' ) ),
	);
	$by_topic = array(
		'child-support' => array( 'support', 'request', 'mahut' ),
		'spousal'       => array( 'support', 'request', 'mahut' ),
		'custody'       => array( 'custody', 'request', 'mahut' ),
		'divorce'       => array( 'divorce', 'agreement', 'mahut' ),
		'rabbinical'    => array( 'divorce', 'get', 'agreement' ),
		'property'      => array( 'property', 'request', 'stay' ),
		'prenup'        => array( 'spouses' ),
		'cohabitation'  => array( 'spouses', 'request' ),
		'mediation'     => array( 'request', 'mahut', 'stay' ),
		'adoption'      => array( 'request', 'mahut' ),
		'family'        => array( 'request', 'mahut', 'stay' ),
	);
	if ( empty( $by_topic[ $topic ] ) ) {
		return '';
	}
	$body = '';
	foreach ( $by_topic[ $topic ] as $key ) {
		$r     = $rows[ $key ];
		$body .= '<tr><th scope="row">' . esc_html( $r[0] ) . '</th><td>' . $r[1] . '</td><td class="jt-maya-card__cite">' . $r[2] . '</td></tr>';
	}
	$checked = (string) ( $d['checked_on'] ?? '' );

	return '<details class="jt-maya-card__numbers">'
		. '<summary>מספרים מרכזיים לנושא, עם מקור (2026)</summary>'
		. '<div class="jt-maya-card__tablewrap"><table><caption class="screen-reader-text">מספרים מרכזיים: ' . esc_html( justice_maya_topic_labels()[ $topic ] ?? '' ) . '</caption>'
		. '<thead><tr><th scope="col">מה</th><th scope="col">כמה</th><th scope="col">מקור</th></tr></thead><tbody>' . $body . '</tbody></table></div>'
		. '<p class="jt-maya-card__checked">מתוך מאגר הנתונים של כלי המחשבונים באתר, נבדק מול תקנות האגרות והחוק להסדר התדיינויות בסכסוכי משפחה' . ( $checked ? ' ב-' . esc_html( justice_maya_he_date( $checked ) ) : '' ) . '.</p>'
		. '</details>';
}

/**
 * Up to two questions from her own profile page (meta profile_faqs, "question | answer" per
 * line), chosen by topic. Shown only when her profile facts are approved, like on the profile.
 *
 * @return array<int,array{0:string,1:string}>
 */
function justice_maya_profile_faqs( int $lawyer_id, string $topic ): array {
	$raw  = (string) get_post_meta( $lawyer_id, 'profile_faqs', true );
	$rows = array();
	foreach ( preg_split( '/\r\n|\r|\n/', $raw ) as $line ) {
		$parts = array_map( 'trim', explode( '|', (string) $line ) );
		if ( '' !== ( $parts[0] ?? '' ) && '' !== ( $parts[1] ?? '' ) ) {
			$rows[] = array( $parts[0], $parts[1] );
		}
	}
	if ( ! $rows ) {
		return array();
	}
	$want = array(
		'divorce'       => '/גירושין|גט/u',
		'rabbinical'    => '/גירושין|גט/u',
		'spousal'       => '/גירושין|מזונות/u',
		'mediation'     => '/גישור/u',
		'custody'       => '/גישור|משמורת|ילד/u',
		'child-support' => '/מזונות|גישור/u',
		'property'      => '/ממון|רכוש|גישור/u',
		'prenup'        => '/ממון/u',
		'cohabitation'  => '/ממון|ידועים/u',
		'family'        => '/גירושין|גישור/u',
	);
	$pattern = $want[ $topic ] ?? '/גישור/u';
	$picked  = array();
	foreach ( $rows as $row ) {
		if ( 1 === preg_match( $pattern, $row[0] ) ) {
			$picked[] = $row;
		}
	}
	foreach ( $rows as $row ) {
		if ( count( $picked ) >= 2 ) {
			break;
		}
		if ( ! in_array( $row, $picked, true ) && 1 === preg_match( '/פגישה/u', $row[0] ) ) {
			$picked[] = $row;
		}
	}

	return array_slice( $picked, 0, 2 );
}

/** The two questions as native disclosure widgets. */
function justice_maya_faq_html( int $lawyer_id, string $topic, string $minisite ): string {
	$faqs = justice_maya_profile_faqs( $lawyer_id, $topic );
	if ( ! $faqs ) {
		return '';
	}
	$items = '';
	foreach ( $faqs as $row ) {
		$items .= '<details class="jt-maya-card__q"><summary>' . esc_html( $row[0] ) . '</summary><p>' . esc_html( $row[1] ) . '</p></details>';
	}

	return '<div class="jt-maya-card__faq"><p class="jt-maya-card__kicker">שאלות מתוך <a href="' . esc_url( $minisite ) . '">הפרופיל של עו״ד רוטנברג</a></p>' . $items . '</div>';
}

// ---------------------------------------------------------------------------
// The card
// ---------------------------------------------------------------------------

/**
 * Render her expert card. Called by justice_cards_render() for the house profile, so the
 * placement rules of the cards module stay exactly as they are.
 */
function justice_maya_card_render( WP_Post $lawyer ): string {
	static $uid = 0;
	$uid++;

	$pid      = (int) $lawyer->ID;
	$post_id  = (int) get_the_ID();
	$topic    = $post_id ? justice_maya_post_topic( $post_id ) : 'family';
	$labels   = justice_maya_topic_labels();
	$urls     = justice_maya_urls();
	$name     = wp_strip_all_tags( (string) get_the_title( $pid ) );
	$approved = function_exists( 'justice_cards_profile_facts_are_approved' ) && justice_cards_profile_facts_are_approved( $pid );
	$tagline  = $approved ? trim( (string) get_post_meta( $pid, 'profile_subheadline', true ) ) : '';
	if ( '' === $tagline && $approved ) {
		$tagline = trim( wp_strip_all_tags( (string) get_post_field( 'post_excerpt', $pid ) ) );
	}
	$tagline = mb_substr( $tagline, 0, 190 );
	$cities  = get_the_terms( $pid, 'city' );
	$city    = ( $cities && ! is_wp_error( $cities ) ) ? (string) $cities[0]->name : '';

	$page_title = wp_strip_all_tags( (string) get_the_title() );
	$wa_message = 'שלום, אני פונה מהעמוד: ' . mb_substr( $page_title, 0, 70 ) . ' | ' . get_permalink() . ' | אשמח לשוחח עם ' . $name . '.';
	$wa_href    = function_exists( 'justice_theme_public_whatsapp_url' )
		? justice_theme_public_whatsapp_url( $wa_message )
		: 'https://wa.me/972525101555?text=' . rawurlencode( $wa_message );

	$photo = function_exists( 'justice_cards_avatar_src' ) ? justice_cards_avatar_src( $pid ) : null;
	$alt   = $name . ', עורכת דין ומגשרת בדיני משפחה וגירושין';
	if ( $photo ) {
		$avatar = '<img class="jt-maya-card__photo" src="' . esc_url( $photo['src'] ) . '"'
			. ( $photo['srcset'] ? ' srcset="' . esc_attr( $photo['srcset'] ) . '"' : '' )
			. ' alt="' . esc_attr( $alt ) . '" width="112" height="112" loading="lazy" decoding="async" style="width:112px;height:112px;aspect-ratio:1;object-fit:cover;object-position:center 25%;display:block;margin:0;border-radius:0">';
	} else {
		$avatar = '<span class="jt-maya-card__photo jt-maya-card__photo--initial" aria-hidden="true">' . esc_html( mb_substr( preg_replace( '/^עו["״]ד\s*/u', '', $name ), 0, 1 ) ) . '</span>';
	}

	$tool = 'child-support' === $topic ? justice_maya_ratio_html( $wa_href, $uid ) : justice_maya_checklist_html( $topic, $wa_href, $uid );

	$GLOBALS['justice_maya_card_rendered'] = true;

	$topic_label = $labels[ $topic ] ?? $labels['family'];
	$id_attr     = 'jt-maya-card-' . $uid;

	return '<aside class="jt-procard jt-procard--house jt-maya-card" id="' . esc_attr( $id_attr ) . '" role="complementary" aria-label="' . esc_attr( 'עורכת דין לדיני משפחה בנושא ' . $topic_label . ': ' . $name ) . '" data-card-surface="incontent" data-l="' . $pid . '" data-topic="' . esc_attr( $topic ) . '">'
		. '<div class="jt-maya-card__tab"><span class="jt-maya-card__tabfamily">דיני משפחה</span><span class="jt-maya-card__tabtopic">' . esc_html( $topic_label ) . '</span></div>'
		. '<p class="jt-maya-card__strip"><span>עו״ד בודקת התוכן המשפטי באתר</span><span>פרופיל מאומת' . ( $city ? ' · ' . esc_html( $city ) : '' ) . '</span></p>'
		. '<div class="jt-maya-card__head">'
		. '<a class="jt-maya-card__frame" href="' . esc_url( $urls['minisite'] ) . '" tabindex="-1" aria-hidden="true">' . $avatar . '</a>'
		. '<div class="jt-maya-card__who">'
		. '<p class="jt-maya-card__name"><a href="' . esc_url( $urls['minisite'] ) . '">' . esc_html( $name ) . '</a></p>'
		. '<p class="jt-maya-card__role">עורכת דין ומגשרת בדיני משפחה וגירושין' . ( $city ? ', ' . esc_html( $city ) : '' ) . '.</p>'
		. ( '' !== $tagline ? '<p class="jt-maya-card__tagline">' . esc_html( $tagline ) . '</p>' : '' )
		. '</div></div>'
		. '<div class="jt-maya-card__grid">'
		. '<div class="jt-maya-card__col jt-maya-card__col--tool">'
		. $tool
		. justice_maya_numbers_html( $topic )
		. '</div>'
		. '<div class="jt-maya-card__col jt-maya-card__col--facts">'
		. justice_maya_facts_html( $topic, $approved )
		. ( $approved ? justice_maya_faq_html( $pid, $topic, $urls['minisite'] ) : '' )
		. '</div>'
		. '</div>'
		. '<div class="jt-maya-card__actions">'
		. '<a class="jt-procard__wa jt-maya-card__btn jt-maya-card__btn--solid jt-maya-card__btn--wide" href="' . esc_url( $wa_href ) . '" target="_blank" rel="noopener nofollow" data-whatsapp-surface="procard">שיחה ישירה עם עו״ד רוטנברג</a>'
		. '<nav class="jt-maya-card__links" aria-label="עוד על עו״ד רוטנברג">'
		. '<a class="jt-procard__profile" href="' . esc_url( $urls['minisite'] ) . '">לפרופיל המלא</a>'
		. '<a href="' . esc_url( $urls['profile'] ) . '">מקורות ועובדות</a>'
		. '<a href="' . esc_url( $urls['official'] ) . '" target="_blank" rel="sponsored noopener">אתר המשרד</a>'
		. '</nav></div>'
		. '<p class="jt-maya-card__note">עו״ד מאיה רוטנברג היא עורכת דין. המידע בעמוד הוא מידע כללי ואינו ייעוץ משפטי, ואין בו הבטחה לתוצאה. הופעה ומיקום של פרופילים באתר עשויים להיות מושפעים משיקולים מסחריים ועריכתיים.</p>'
		. '</aside>';
}

// ---------------------------------------------------------------------------
// The line near the top
// ---------------------------------------------------------------------------

/** The one-line expert mention for the top of the content. */
function justice_maya_line_html( array $ctx ): string {
	$urls = justice_maya_urls();
	$name = 'עו״ד מאיה רוטנברג';
	if ( ! empty( $ctx['reviewed_on'] ) ) {
		$lead = 'נבדק על ידי';
		$tail = '<span class="jt-maya-line__date"> · ' . esc_html( justice_maya_he_date( (string) $ctx['reviewed_on'] ) ) . '</span>';
	} else {
		$lead = 'עורכת דין לדיני משפחה בנושא זה:';
		$tail = '';
	}

	return '<p class="jt-maya-line"><span class="jt-maya-line__mark" aria-hidden="true">§</span><span class="jt-maya-line__lead">' . esc_html( $lead ) . '</span> '
		. '<a href="' . esc_url( $urls['minisite'] ) . '">' . esc_html( $name ) . '</a>' . $tail
		. '<span class="jt-maya-line__sep" aria-hidden="true"> · </span><a class="jt-maya-line__jump" href="#jt-maya-card-1">כלי מהיר ושאלות</a></p>';
}

/**
 * Prepend the line where the card rendered and the page does not already name her at the top.
 * Tool-first articles keep their tool as the first thing on the page (HAD-502).
 *
 * @param mixed $content Content.
 * @return mixed
 */
function justice_maya_line_filter( $content ) {
	if (
		! is_string( $content )
		|| ! function_exists( 'justice_cards_is_public_main_content_request' )
		|| ! in_the_loop()
		|| ! is_main_query()
		|| ! justice_cards_is_public_main_content_request()
		|| false === strpos( $content, 'jt-maya-card' )
		|| false !== strpos( $content, 'jt-maya-line' )
	) {
		return $content;
	}
	$ctx = justice_maya_context();
	if ( empty( $ctx['applies'] ) || ! empty( $ctx['tool_first'] ) ) {
		return $content;
	}
	if ( ! empty( $ctx['has_byline'] ) ) {
		return $content;
	}

	return justice_maya_line_html( $ctx ) . $content;
}
add_filter( 'the_content', 'justice_maya_line_filter', 18 );

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------

/**
 * Her graph: Person and LegalService with the same @ids her own site and her profile page use,
 * plus the page node that mentions her and the topic it is about.
 *
 * @return array<string,mixed>
 */
function justice_maya_schema( array $ctx ): array {
	$urls      = justice_maya_urls();
	$person_id = trailingslashit( $urls['minisite'] ) . '#person';
	$firm_id   = 'https://rotenberglaw.co.il/#firm';
	$topic     = (string) ( $ctx['topic'] ?? 'family' );
	$labels    = justice_maya_topic_labels();
	$knows     = array( 'דיני משפחה', 'גירושין', 'מזונות ילדים', 'משמורת ילדים', 'חלוקת רכוש', 'הסכם ממון', 'גישור משפחתי', 'צוואות וירושות' );
	$image     = '';
	if ( ! empty( $ctx['lawyer_id'] ) && function_exists( 'justice_cards_avatar_src' ) ) {
		$photo = justice_cards_avatar_src( (int) $ctx['lawyer_id'] );
		$image = $photo ? (string) $photo['src'] : '';
	}

	$person = array(
		'@type'           => 'Person',
		'@id'             => $person_id,
		'name'            => 'מאיה רוטנברג',
		'alternateName'   => array( 'עו״ד מאיה רוטנברג', 'Maya Rotenberg' ),
		'honorificPrefix' => 'עו״ד',
		'jobTitle'        => 'עורכת דין ומגשרת בדיני משפחה',
		'description'     => 'עורכת דין ומגשרת בדיני משפחה וגירושין בתל אביב. רשומה בכותרת פסק הדין בבע״מ 919/15 של בית המשפט העליון כבאת כוח המבקש.',
		'url'             => $urls['minisite'],
		'knowsAbout'      => $knows,
		'worksFor'        => array( '@id' => $firm_id ),
		'sameAs'          => array( $urls['official_about'], $urls['linkedin'] ),
		'subjectOf'       => array(
			'@type' => 'WebPage',
			'url'   => $urls['profile'],
			'name'  => 'משרד מאיה רוטנברג בדיני משפחה: פרופיל ומקורות',
		),
	);
	if ( '' !== $image ) {
		$person['image'] = $image;
	}

	$firm = array(
		'@type'         => 'LegalService',
		'@id'           => $firm_id,
		'name'          => 'משרד עורכי דין מאיה רוטנברג',
		'alternateName' => 'Maya Rotenberg Divorce & Family Law Office',
		'url'           => $urls['official'],
		'telephone'     => '+972-3-616-1535',
		'address'       => array(
			'@type'           => 'PostalAddress',
			'streetAddress'   => 'רח׳ ראול ולנברג 18, מגדל C, רמת החייל',
			'addressLocality' => 'תל אביב-יפו',
			'postalCode'      => '6971915',
			'addressCountry'  => 'IL',
		),
		'areaServed'    => array( '@type' => 'Country', 'name' => 'ישראל' ),
		'founder'       => array( '@id' => $person_id ),
		'knowsAbout'    => $knows,
		'sameAs'        => array( $urls['duns'], $urls['duns_en'] ),
	);

	$page_url = (string) get_permalink( (int) $ctx['post_id'] );
	$page     = array(
		'@type'    => 'WebPage',
		'@id'      => $page_url,
		'url'      => $page_url,
		'about'    => array_values( array_unique( array(
			array( '@type' => 'Thing', 'name' => $labels[ $topic ] ?? $labels['family'] ),
			array( '@type' => 'Thing', 'name' => 'דיני משפחה' ),
		), SORT_REGULAR ) ),
		'mentions' => array( '@id' => $person_id ),
	);
	if ( ! empty( $ctx['reviewed_on'] ) ) {
		$page['reviewedBy']   = array( '@id' => $person_id );
		$page['lastReviewed'] = (string) $ctx['reviewed_on'];
	}

	return array(
		'@context' => 'https://schema.org',
		'@graph'   => array( $page, $person, $firm ),
	);
}

/** Print the graph and the card styles in the head of a page that carries her card. */
function justice_maya_head(): void {
	$ctx = justice_maya_context();
	if ( empty( $ctx['applies'] ) ) {
		return;
	}
	$json = wp_json_encode( justice_maya_schema( $ctx ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP );
	if ( is_string( $json ) && '' !== $json ) {
		echo '<script type="application/ld+json" id="jt-maya-presence-schema">' . $json . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput
	}
	echo justice_maya_css(); // phpcs:ignore WordPress.Security.EscapeOutput
}
add_action( 'wp_head', 'justice_maya_head', 100 );

// ---------------------------------------------------------------------------
// Styles and the small script
// ---------------------------------------------------------------------------

/**
 * Card styles.
 *
 * Palette: chambers aubergine #3b1533 (name, tab, primary action), seal rose #b4234f (focus,
 * numbering, kickers, the § mark), file-jacket slate #eef1f5 (tool panel), rule #d5dae3, ink
 * #15171c and #474e5c on white paper. Faces: Heebo, which the site already self-hosts (no extra
 * request), with the system monospace only for the fact numbers.
 * Why not the default look: no cream, beige, brown, gold or serif on cream, no gradient wash and no
 * soft rounded card; the form is a family-court file (index tab, docket strip, numbered fact lines,
 * citation chips) and it is the only element on the page in these colours.
 *
 * Every selector starts with a tripled class (S below): the theme's article rules
 * (body.jt-look-v3 .entry-content a / p / h3) would otherwise repaint the card.
 */
function justice_maya_css(): string {
	$css = <<<'CSS'
%S%{--mc-plum:#3b1533;--mc-plum-2:#5b2450;--mc-rose:#b4234f;--mc-slate:#eef1f5;--mc-rule:#d5dae3;--mc-ink:#15171c;--mc-ink-2:#474e5c;--mc-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;container-type:inline-size;position:relative;isolation:auto;margin:44px 0 36px;padding:0;background:#fff;border:1px solid var(--mc-rule);border-top:0;border-radius:0 0 10px 10px;box-shadow:0 1px 0 rgba(21,23,28,.04),0 18px 40px -28px rgba(59,21,51,.45);overflow:visible;font-family:Heebo,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;font-size:16px;line-height:1.6;color:var(--mc-ink);text-align:start;transition:none}
%S%::before{display:none}
@media(hover:hover){%S%:hover{transform:none;box-shadow:0 1px 0 rgba(21,23,28,.04),0 18px 40px -28px rgba(59,21,51,.45)}}
%S% p{margin:0;color:inherit;line-height:1.6}
%S% a{color:var(--mc-plum)!important;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px}
%S% a:hover{color:var(--mc-rose)!important}
%S% a:focus-visible,%S% button:focus-visible,%S% input:focus-visible,%S% summary:focus-visible{outline:3px solid var(--mc-rose);outline-offset:2px}
%S% .jt-maya-card__tab{display:flex;align-items:stretch;justify-content:space-between;background:var(--mc-plum);color:#fff;border-radius:10px 10px 0 0;margin:0 -1px;font-size:13.5px;font-weight:800;letter-spacing:.01em;line-height:1.3}
%S% .jt-maya-card__tabfamily{padding:9px 18px;padding-inline-end:30px;background:var(--mc-rose);border-start-start-radius:10px;clip-path:polygon(0 0,100% 0,100% 100%,14px 100%)}
%S% .jt-maya-card__tabtopic{padding:9px 18px;align-self:center}
%S% .jt-maya-card__strip{display:flex;flex-wrap:wrap;gap:2px 14px;justify-content:space-between;padding:8px 20px;border-bottom:1px solid var(--mc-rule);font-size:12.5px;font-weight:600;color:var(--mc-ink-2)}
%S% .jt-maya-card__head{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:start;padding:20px 20px 4px}
%S% .jt-maya-card__frame{display:block;position:relative;padding:5px;background:#fff;border:1px solid var(--mc-rule);box-shadow:4px 4px 0 var(--mc-slate);text-decoration:none}
%S% .jt-maya-card__frame::after{content:"";position:absolute;inset-block-start:-7px;inset-inline-start:50%;width:26px;height:10px;margin-inline-start:-13px;background:var(--mc-plum);border-radius:2px}
%S% .jt-maya-card__photo{display:block;width:104px!important;height:104px!important;max-width:none}
%S% .jt-maya-card__photo--initial{display:flex!important;align-items:center;justify-content:center;background:var(--mc-plum);color:#fff;font-size:40px;font-weight:800}
%S% .jt-maya-card__who{min-width:0;display:flex;flex-direction:column;gap:6px}
%S% .jt-maya-card__name{font-size:27px;line-height:1.15;font-weight:800;letter-spacing:-.01em}
%S% .jt-maya-card__name a{color:var(--mc-plum)!important;text-decoration:none}
%S% .jt-maya-card__name a:hover{text-decoration:underline}
%S% .jt-maya-card__role{font-size:16.5px;font-weight:700;color:var(--mc-ink)}
%S% .jt-maya-card__tagline{font-size:15px;color:var(--mc-ink-2);line-height:1.6}
%S% .jt-maya-card__grid{display:grid;grid-template-columns:1fr;gap:0 22px;padding:0 20px}
%S% .jt-maya-card__facts{list-style:none;counter-reset:mcfact;margin:14px 0 0;padding:0}
%S% .jt-maya-card__fact{counter-increment:mcfact;position:relative;display:block;margin:0;padding:11px 0;padding-inline-start:38px;border-top:1px solid var(--mc-rule);font-size:15px;line-height:1.6}
%S% .jt-maya-card__fact::before{content:counter(mcfact,decimal-leading-zero);position:absolute;inset-inline-start:0;top:12px;font-family:var(--mc-mono);font-size:13px;font-weight:700;color:var(--mc-rose)}
%S% .jt-maya-card__facttext{display:block}
%S% .jt-maya-card__srcs{display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center;margin-top:7px}
%S% a.jt-maya-card__src{display:inline-flex;align-items:center;min-height:30px;padding:2px 10px;font-size:13px;font-weight:700;color:var(--mc-plum)!important;background:var(--mc-slate);border:1px solid var(--mc-rule);border-radius:3px;text-decoration:none}
%S% a.jt-maya-card__src:hover{border-color:var(--mc-plum)}
%S% .jt-maya-card__checked{font-size:12.5px;color:var(--mc-ink-2)}
%S% .jt-maya-card__tool{margin:14px 0 0;padding:16px;background:var(--mc-slate);border:1px solid var(--mc-rule);border-radius:6px}
%S% p.jt-maya-card__kicker{margin:0 0 2px;font-size:12.5px;font-weight:800;letter-spacing:.02em;color:var(--mc-rose)}
%S% h3.jt-maya-card__tooltitle{margin:0 0 10px;padding:0;border:0;font-family:inherit;font-size:19px;line-height:1.3;font-weight:800;color:var(--mc-ink)}
%S% .jt-maya-card__check{list-style:none;margin:0;padding:0;display:grid;gap:0}
%S% .jt-maya-card__check li{display:flex;gap:10px;align-items:flex-start;margin:0;padding:7px 0;border-bottom:1px dashed var(--mc-rule)}
%S% .jt-maya-card__check li:last-child{border-bottom:0}
%S% .jt-maya-card__check input{flex:none;width:24px;height:24px;margin:1px 0 0;accent-color:var(--mc-plum)}
%S% .jt-maya-card__check label{font-size:15px;line-height:1.5;cursor:pointer}
%S% p.jt-maya-card__count{font-size:13.5px;font-weight:700;color:var(--mc-plum);min-height:1.2em;margin-top:4px}
%S% .jt-maya-card__ratio{display:grid;grid-template-columns:1fr;gap:10px}
%S% .jt-maya-card__field{display:flex;flex-direction:column;gap:3px;min-width:0}
%S% .jt-maya-card__field label{font-size:14px;font-weight:700;color:var(--mc-ink);line-height:1.35}
%S% .jt-maya-card__field input{width:100%;min-height:46px;box-sizing:border-box;margin:0;padding:8px 12px;border:1px solid #8a93a3;border-radius:4px;background:#fff;font:inherit;font-size:17px;color:var(--mc-ink)}
%S% .jt-maya-card__result{margin-top:12px;padding:12px 14px;background:#fff;border:1px solid var(--mc-rule);border-radius:4px;font-size:15px}
%S% .jt-maya-card__bars{display:grid;gap:8px;margin:0 0 8px}
%S% p.jt-maya-card__bar{display:grid;grid-template-columns:8.6em 1fr 3.2em;gap:8px;align-items:center;font-size:14px;margin:0}
%S% .jt-maya-card__bar span:nth-child(2){position:relative;height:10px;background:var(--mc-slate);border-radius:2px;overflow:hidden}
%S% .jt-maya-card__bar i{position:absolute;inset-block:0;inset-inline-start:0;background:var(--mc-plum);border-radius:2px}
%S% .jt-maya-card__bar--time i{background:var(--mc-rose)}
%S% .jt-maya-card__bar b{font-family:var(--mc-mono);font-size:14px;text-align:end}
%S% p.jt-maya-card__toolnote{font-size:13.5px;color:var(--mc-ink-2);margin-top:10px;line-height:1.55}
%S% p.jt-maya-card__toolnote--alert{color:var(--mc-rose);font-weight:800}
%S% .jt-maya-card__toolacts{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
%S% .jt-maya-card__btn{display:inline-flex;align-items:center;justify-content:center;flex:1 1 auto;min-height:46px;padding:10px 16px;border-radius:4px;font:inherit;font-size:15px;font-weight:800;line-height:1.25;text-decoration:none!important;cursor:pointer;text-align:center;box-shadow:none;transform:none;gap:0}
%S% .jt-maya-card__btn--solid,%S% a.jt-maya-card__btn--solid{background:var(--mc-plum);color:#fff!important;border:1px solid var(--mc-plum)}
%S% .jt-maya-card__btn--solid:hover,%S% a.jt-maya-card__btn--solid:hover{background:var(--mc-plum-2);color:#fff!important}
%S% a.jt-maya-card__btn--quiet{background:#fff;color:var(--mc-plum)!important;border:1px solid var(--mc-plum)}
%S% a.jt-maya-card__btn--quiet:hover{background:var(--mc-plum);color:#fff!important}
%S% .jt-maya-card__numbers{margin:12px 0 0;border:1px solid var(--mc-rule);border-radius:6px;background:#fff}
%S% .jt-maya-card__numbers summary,%S% .jt-maya-card__q summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:46px;padding:8px 14px;font-weight:800;font-size:15px;line-height:1.35}
%S% .jt-maya-card__numbers summary::-webkit-details-marker,%S% .jt-maya-card__q summary::-webkit-details-marker{display:none}
%S% .jt-maya-card__numbers summary::after,%S% .jt-maya-card__q summary::after{content:"+";flex:none;font-family:var(--mc-mono);font-size:20px;font-weight:700;color:var(--mc-rose)}
%S% .jt-maya-card__numbers[open] summary::after,%S% .jt-maya-card__q[open] summary::after{content:"−"}
%S% .jt-maya-card__tablewrap{padding:0 14px}
%S% .jt-maya-card__numbers table{width:100%;border-collapse:collapse;font-size:14px;margin:0;border:0;display:table}
%S% .jt-maya-card__numbers thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
%S% .jt-maya-card__numbers tr{display:grid;grid-template-columns:1fr;gap:2px;padding:9px 0;border-top:1px solid var(--mc-rule);background:none}
%S% .jt-maya-card__numbers th,%S% .jt-maya-card__numbers td{display:block;padding:0;border:0;text-align:start;background:none;font-size:14.5px;line-height:1.5}
%S% .jt-maya-card__numbers tbody th{font-weight:800;color:var(--mc-ink)}
%S% .jt-maya-card__numbers .jt-maya-card__cite{font-size:13px;color:var(--mc-ink-2)}
%S% .jt-maya-card__numbers p.jt-maya-card__checked{padding:6px 14px 12px;line-height:1.5}
%S% .screen-reader-text{position:absolute!important;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
%S% .jt-maya-card__faq{margin:10px 0 0}
%S% .jt-maya-card__q{border-top:1px solid var(--mc-rule)}
%S% .jt-maya-card__q summary{padding-inline:0;font-weight:700}
%S% .jt-maya-card__q p{padding:0 0 12px;color:var(--mc-ink-2);font-size:15px}
%S% .jt-maya-card__actions{display:flex;flex-wrap:wrap;align-items:center;gap:8px 20px;margin:18px 20px 0;padding-top:16px;border-top:2px solid var(--mc-plum)}
%S% a.jt-procard__wa{flex:1 1 260px;min-height:52px;font-size:16px;background:var(--mc-plum);color:#fff!important;border:1px solid var(--mc-plum);border-radius:4px}
%S% a.jt-procard__wa:hover{background:var(--mc-plum-2);color:#fff!important;box-shadow:none;transform:none}
%S% .jt-maya-card__links{display:flex;flex-wrap:wrap;gap:0 18px;justify-content:center;flex:1 1 260px}
%S% .jt-maya-card__links a{display:inline-flex;align-items:center;flex:none;min-height:44px;padding:0;border:0;border-radius:0;background:none;box-shadow:none;font-weight:700;font-size:15px;text-decoration:underline!important}
%S% .jt-maya-card__links a:hover{background:none}
%S% p.jt-maya-card__note{margin:14px 20px 0;padding:12px 0 16px;border-top:1px solid var(--mc-rule);font-size:13px;color:var(--mc-ink-2);line-height:1.55}
@container (min-width:660px){%S% .jt-maya-card__grid{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);align-items:start}%S% .jt-maya-card__col--facts .jt-maya-card__facts{margin-top:14px}}
@media(max-width:640px){%S%{margin:36px 0 28px;border-radius:0 0 8px 8px}%S% .jt-maya-card__tab{border-radius:8px 8px 0 0;font-size:13px}%S% .jt-maya-card__tabfamily{border-start-start-radius:8px}%S% .jt-maya-card__strip{padding:7px 14px}%S% .jt-maya-card__head{gap:14px;padding:16px 14px 2px}%S% .jt-maya-card__photo{width:80px!important;height:80px!important}%S% .jt-maya-card__name{font-size:23px}%S% .jt-maya-card__role{font-size:15.5px}%S% .jt-maya-card__tagline{grid-column:1/-1}%S% .jt-maya-card__grid{padding:0 14px}%S% .jt-maya-card__tool{padding:14px 12px}%S% .jt-maya-card__actions{margin-inline:14px}%S% p.jt-maya-card__note{margin-inline:14px}%S% p.jt-maya-card__bar{grid-template-columns:7.4em 1fr 3em}}
@media(prefers-reduced-motion:reduce){%S% *{transition:none!important}}
@media print{%S% .jt-maya-card__tool,%S% .jt-maya-card__actions{display:none}}
%L%{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 6px;margin:0 0 22px;padding:8px 0 10px;border-bottom:1px solid #d5dae3;font-family:Heebo,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;font-size:15.5px;line-height:1.5;color:#15171c}
%L% .jt-maya-line__mark{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-weight:700;color:#b4234f}
%L% .jt-maya-line__lead{color:#474e5c;font-weight:600}
%L% a{color:#3b1533!important;font-weight:800;text-decoration:underline;text-underline-offset:3px}
%L% a.jt-maya-line__jump{font-weight:600}
%L% a:focus-visible{outline:3px solid #b4234f;outline-offset:2px}
CSS;

	$css = str_replace(
		array( '%S%', '%L%' ),
		array( '.jt-procard.jt-maya-card.jt-maya-card', 'p.jt-maya-line.jt-maya-line' ),
		$css
	);

	return '<style id="jt-maya-card-css">' . preg_replace( '/\n+/', '', $css ) . '</style>';
}

/** The tool script: ES5, no storage, no network. Printed only where the card rendered. */
function justice_maya_footer_script(): void {
	if ( empty( $GLOBALS['justice_maya_card_rendered'] ) ) {
		return;
	}
	?>
<script id="jt-maya-card-js">(function(){var cards=document.querySelectorAll('.jt-maya-card');for(var i=0;i<cards.length;i++){wire(cards[i]);}
function num(el){var v=parseFloat(String(el&&el.value||'').replace(/[^0-9.]/g,''));return isNaN(v)?NaN:v;}
function pct(x){return Math.round(x*100);}
function setWa(a,text){if(!a)return;try{var u=new URL(a.href);var base=u.searchParams.get('text')||'';a.href=u.origin+u.pathname+'?text='+encodeURIComponent(base+' '+text);}catch(e){}}
function wire(card){var form=card.querySelector('[data-jt-maya-ratio]');if(form){var out=card.querySelector('[data-jt-maya-result]');var wa=card.querySelector('[data-jt-maya-ratio-wa]');var waBase=wa?wa.href:'';form.addEventListener('submit',function(ev){ev.preventDefault();var a=num(form.querySelector('[data-in=a]')),b=num(form.querySelector('[data-in=b]')),n=num(form.querySelector('[data-in=n]'));if(isNaN(a)||isNaN(b)||isNaN(n)||a<0||b<0||a+b<=0||n<0||n>14){out.hidden=false;out.innerHTML='<p>כדי לחשב, מלאו את שלושת השדות: שתי הכנסות ומספר לילות בין 0 ל-14.</p>';return;}
var inc=a/(a+b),time=n/14,gap=pct(inc)-pct(time);var line=gap>0?'חלקך בהכנסות גדול מחלקך בזמני השהות ב-'+gap+' נקודות.':(gap<0?'חלקך בזמני השהות גדול מחלקך בהכנסות ב-'+(-gap)+' נקודות.':'חלקך בהכנסות שווה לחלקך בזמני השהות.');
out.hidden=false;out.innerHTML='<div class="jt-maya-card__bars"><p class="jt-maya-card__bar"><span>חלקך בהכנסות</span><span><i style="width:'+pct(inc)+'%"></i></span><b>'+pct(inc)+'%</b></p><p class="jt-maya-card__bar jt-maya-card__bar--time"><span>חלקך בשהות ('+n+'/14)</span><span><i style="width:'+pct(time)+'%"></i></span><b>'+pct(time)+'%</b></p></div><p><strong>'+line+'</strong> בשיטת היחסים שבתי המשפט מיישמים מגיל 6, הפער הזה, כפול צורכי הילדים והמדור, הוא הבסיס לחישוב. הסכום עצמו במחשבון המלא.</p>';
if(wa){wa.href=waBase;setWa(wa,'(בכלי המהיר: '+pct(inc)+'% מההכנסות, '+pct(time)+'% מזמני השהות)');}});}
var list=card.querySelector('[data-jt-maya-checklist]');if(list){var boxes=list.querySelectorAll('input[type=checkbox]');var count=list.querySelector('[data-jt-maya-count]');var update=function(){var c=0;for(var j=0;j<boxes.length;j++){if(boxes[j].checked)c++;}count.textContent=c?c+' מתוך '+boxes.length+' מוכנים':'';};list.addEventListener('change',update);}}})();</script>
	<?php
}
add_action( 'wp_footer', 'justice_maya_footer_script', 30 );
