<?php
/**
 * Small live data migrations that keep Git-synced code and WordPress data aligned.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Decide whether a live data migration is allowed to run.
 *
 * Default is intentionally false. URL/profile migrations must be enabled by an
 * explicit owner-approved filter after the migration map and rollback plan exist.
 *
 * @param string $filter_name Migration-specific opt-in filter name.
 * @return bool
 */
function justice_theme_live_migration_is_enabled( string $filter_name ): bool {
	return (bool) apply_filters( $filter_name, false );
}

/**
 * Move the one verified lawyer profile to the approved English slug.
 *
 * This is deliberately narrow: it only targets Maya Rotenberg by title and only
 * changes the post_name field for the justice_lawyer CPT.
 */
function justice_theme_migrate_maya_rotenberg_slug(): void {
	if ( ! justice_theme_live_migration_is_enabled( 'justice_theme_enable_maya_slug_migration' ) ) {
		return;
	}

	if ( get_option( 'justice_theme_maya_slug_migrated_v1' ) ) {
		return;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return;
	}

	$current = get_page_by_path( 'advocate-maya-rotenberg', OBJECT, 'justice_lawyer' );
	if ( $current instanceof WP_Post ) {
		update_option( 'justice_theme_maya_slug_migrated_v1', time(), false );
		return;
	}

	$candidates = get_posts(
		array(
			'post_type'      => 'justice_lawyer',
			'post_status'    => 'any',
			's'              => 'מאיה רוטנברג',
			'posts_per_page' => 5,
		)
	);

	foreach ( $candidates as $candidate ) {
		if ( false === mb_strpos( $candidate->post_title, 'מאיה' ) || false === mb_strpos( $candidate->post_title, 'רוטנברג' ) ) {
			continue;
		}

		wp_update_post(
			array(
				'ID'        => $candidate->ID,
				'post_name' => 'advocate-maya-rotenberg',
			)
		);
		update_option( 'justice_theme_maya_slug_migrated_v1', time(), false );
		return;
	}
}
add_action( 'init', 'justice_theme_migrate_maya_rotenberg_slug', 30 );

/**
 * Redirect the old Hebrew Maya URL to the English URL after migration.
 */
function justice_theme_redirect_old_maya_rotenberg_slug(): void {
	$redirect_enabled = (bool) apply_filters( 'justice_theme_enable_maya_slug_redirect', false );

	if ( ! $redirect_enabled ) {
		return;
	}

	$path = isset( $_SERVER['REQUEST_URI'] ) ? rawurldecode( (string) wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';

	if ( false === mb_strpos( $path, '/lawyers/' ) || false === mb_strpos( $path, 'מאיה' ) || false === mb_strpos( $path, 'רוטנברג' ) ) {
		return;
	}

	wp_safe_redirect( home_url( '/lawyers/advocate-maya-rotenberg/' ), 301 );
	exit;
}
add_action( 'template_redirect', 'justice_theme_redirect_old_maya_rotenberg_slug', 1 );

/**
 * Bootstrap the verified Maya Rotenberg profile with rich CMS mini-site fields.
 *
 * The migration is intentionally conservative:
 * - targets only the verified Maya Rotenberg lawyer profile;
 * - writes only empty fields;
 * - does not invent bar/license numbers, ratings, reviews, photos or payments;
 * - keeps owner-editable CMS fields as the source of truth after first fill.
 */
function justice_theme_bootstrap_maya_rotenberg_minisite(): void {
	if ( ! justice_theme_live_migration_is_enabled( 'justice_theme_enable_maya_minisite_bootstrap' ) ) {
		return;
	}

	if ( get_option( 'justice_theme_maya_minisite_bootstrapped_v1' ) ) {
		return;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return;
	}

	$profile = get_page_by_path( 'advocate-maya-rotenberg', OBJECT, 'justice_lawyer' );

	if ( ! $profile instanceof WP_Post ) {
		$candidates = get_posts(
			array(
				'post_type'      => 'justice_lawyer',
				'post_status'    => 'any',
				's'              => 'מאיה רוטנברג',
				'posts_per_page' => 5,
			)
		);

		foreach ( $candidates as $candidate ) {
			if ( false !== mb_strpos( $candidate->post_title, 'מאיה' ) && false !== mb_strpos( $candidate->post_title, 'רוטנברג' ) ) {
				$profile = $candidate;
				break;
			}
		}
	}

	if ( ! $profile instanceof WP_Post ) {
		return;
	}

	$post_id = (int) $profile->ID;

	$set_if_empty = static function ( string $key, string $value ) use ( $post_id ): void {
		if ( '' === (string) get_post_meta( $post_id, $key, true ) ) {
			update_post_meta( $post_id, $key, $value );
		}
	};

	$set_if_empty( 'lawyer_full_name', 'עו"ד מאיה רוטנברג' );
	$set_if_empty( 'firm_name', 'משרד מאיה רוטנברג - דיני משפחה' );
	$set_if_empty( 'profile_headline', 'עו"ד מאיה רוטנברג - דיני משפחה, גירושין ויישוב סכסוכים' );
	$set_if_empty( 'profile_subheadline', 'ליווי משפטי זהיר ומסודר בענייני משפחה, גירושין, זמני שהות, מזונות, הסכמים וחלוקת רכוש, עם דגש על בהירות, תיעוד וקבלת החלטות אחראית.' );
	$set_if_empty( 'bio_short', 'עורכת דין בתחום דיני המשפחה והגירושין, עם דגש על ליווי אישי, סדר בתהליך והכנה נכונה לפני כל צעד משפטי.' );
	$set_if_empty( 'profile_approach_title', 'שיטת העבודה: להבין, לארגן ולפעול בזהירות' );
	$set_if_empty(
		'profile_approach',
		"הליך משפחתי טוב מתחיל בהבנת התמונה המלאה: ילדים, רכוש, הכנסות, מסמכים, רמת דחיפות והאפשרות להגיע להסכמות.\n\nהפרופיל המקצועי של עו\"ד מאיה רוטנברג נועד לעזור למבקרים להגיע לשיחה ראשונה כשהם מסודרים יותר: מה הבעיה, מה כבר נעשה, אילו מסמכים קיימים ומה דורש בדיקה משפטית פרטנית.\n\nהמידע באתר הוא כללי ואינו תחליף לייעוץ משפטי. מטרתו ליצור הכנה טובה יותר ולחבר בין תוכן, שאלון פנייה ופרופיל מקצועי אחד."
	);
	$set_if_empty(
		'profile_services',
		"גירושין ופרידה | בדיקת אפשרויות פעולה, מסלול הסכמות או ניהול מחלוקת, והכנת רשימת נושאים לטיפול.\nגירושין בהסכמה | מיפוי הסכמות, ילדים, רכוש, מזונות ומסמכים לפני אישור הסכם.\nזמני שהות ומשמורת | בחינת צרכי הילדים, מסגרות, מרחקים, תקשורת הורית ודחיפות.\nמזונות ילדים | איסוף נתוני הכנסה, הוצאות, זמני שהות ומסמכים רלוונטיים לבדיקה.\nחלוקת רכוש | מיפוי דירה, חשבונות, זכויות פנסיוניות, חובות, עסק או נכסים נוספים.\nיישוב סכסוך במשפחה | הכנה לפגישות, הבנת שלבים, זיהוי סיכונים ובניית תיעוד ראשוני."
	);
	$set_if_empty(
		'profile_process',
		"שיחת אבחון ראשונית | הבנת המצב, הדחיפות, הצדדים המעורבים והמסמכים הקיימים.\nמיפוי משפטי ועובדתי | סידור הנושאים לפי ילדים, רכוש, מזונות, הסכמים וסיכונים מיידיים.\nבחירת מסלול פעולה | בדיקה האם מתאים לנסות הסכמות, גישור, בדיקת הסכם או הליך משפטי.\nהכנת מסמכים ופנייה | איסוף נתונים חסרים והכנת פנייה מסודרת שמאפשרת טיפול יעיל יותר.\nמעקב ועדכון | התאמת הצעדים לפי תגובת הצד השני, החלטות ביניים או שינוי נסיבות."
	);
	$set_if_empty(
		'profile_credentials',
		"דיני משפחה וגירושין | ליווי בסוגיות פרידה, הסכמים, ילדים ורכוש.\nגישה מסודרת למסמכים | דגש על תיעוד, הכנה וקבלת החלטות לפי עובדות.\nתוכן מקצועי מחובר לפרופיל | מאמרים ומדריכים יופיעו לאחר בדיקה משפטית ועריכת מקורות."
	);
	$set_if_empty(
		'profile_faqs',
		"מתי כדאי לפנות לעורכת דין משפחה? | כאשר יש ילדים, רכוש, מזונות, הסכם, חשש מדחיפות או חוסר ודאות לגבי הצעד הבא.\nהאם האתר נותן ייעוץ משפטי? | לא. המידע באתר כללי בלבד. פנייה דרך האתר מאפשרת להעביר פרטים מסודרים לבדיקה מקצועית.\nמה כדאי להכין לפני שיחה? | מסמכים קיימים, פרטי ילדים, הכנסות, הוצאות, נכסים, הסכמים קודמים ותיאור קצר של מה שכבר קרה.\nהאם אפשר להתחיל גם כשאין עדיין הליך פתוח? | כן. פעמים רבות שיחה מוקדמת עוזרת להבין מסלולים, סיכונים ומסמכים חשובים לפני פעולה."
	);
	$set_if_empty( 'profile_cta_title', 'רוצים להבין את הצעד הבא בדיני משפחה?' );
	$set_if_empty( 'profile_cta_text', 'השאירו פנייה מסודרת עם תחום, עיר, דחיפות ותיאור קצר. המטרה היא להגיע לשיחה מקצועית עם תמונת מצב ברורה יותר.' );

	if ( '' === (string) get_post_meta( $post_id, 'verification_status', true ) ) {
		update_post_meta( $post_id, 'verification_status', 'verified' );
	}

	if ( '' === (string) get_post_meta( $post_id, 'featured_on_front', true ) ) {
		update_post_meta( $post_id, 'featured_on_front', '1' );
	}

	if ( '' === (string) get_post_meta( $post_id, 'lead_routing_enabled', true ) ) {
		update_post_meta( $post_id, 'lead_routing_enabled', '1' );
	}

	$notes = (string) get_post_meta( $post_id, 'internal_notes', true );
	if ( false === strpos( $notes, 'MAYA_MINISITE_BOOTSTRAP_V1' ) ) {
		$notes = trim( $notes . "\n" . gmdate( 'Y-m-d H:i:s' ) . ' MAYA_MINISITE_BOOTSTRAP_V1: CMS mini-site fields filled by theme migration where empty; review in wp-admin before marketing.' );
		update_post_meta( $post_id, 'internal_notes', $notes );
	}

	if ( taxonomy_exists( 'practice-areas' ) ) {
		if ( ! term_exists( 'family-law', 'practice-areas' ) ) {
			wp_insert_term( 'דיני משפחה', 'practice-areas', array( 'slug' => 'family-law' ) );
		}
		wp_set_object_terms( $post_id, 'family-law', 'practice-areas', true );
	}

	if ( taxonomy_exists( 'city' ) && empty( get_the_terms( $post_id, 'city' ) ) ) {
		if ( ! term_exists( 'tel-aviv', 'city' ) ) {
			wp_insert_term( 'תל אביב', 'city', array( 'slug' => 'tel-aviv' ) );
		}
		wp_set_object_terms( $post_id, 'tel-aviv', 'city', true );
	}

	update_option( 'justice_theme_maya_minisite_bootstrapped_v1', time(), false );
}
add_action( 'init', 'justice_theme_bootstrap_maya_rotenberg_minisite', 35 );

/**
 * Add public-source transparency to the Maya Rotenberg mini-site.
 *
 * This is a separate migration from the main mini-site bootstrap so it can run
 * on already-bootstrapped live installs. It stores source references in editable
 * profile meta and does not add unreviewed awards, ratings, reviews or case claims.
 */
function justice_theme_bootstrap_maya_rotenberg_public_sources(): void {
	if ( ! justice_theme_live_migration_is_enabled( 'justice_theme_enable_maya_public_sources_bootstrap' ) ) {
		return;
	}

	if ( get_option( 'justice_theme_maya_public_sources_bootstrapped_v1' ) ) {
		return;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return;
	}

	$profile = get_page_by_path( 'advocate-maya-rotenberg', OBJECT, 'justice_lawyer' );

	if ( ! $profile instanceof WP_Post ) {
		$candidates = get_posts(
			array(
				'post_type'      => 'justice_lawyer',
				'post_status'    => 'any',
				's'              => 'מאיה רוטנברג',
				'posts_per_page' => 5,
			)
		);

		foreach ( $candidates as $candidate ) {
			if ( false !== mb_strpos( $candidate->post_title, 'מאיה' ) && false !== mb_strpos( $candidate->post_title, 'רוטנברג' ) ) {
				$profile = $candidate;
				break;
			}
		}
	}

	if ( ! $profile instanceof WP_Post ) {
		return;
	}

	$post_id = (int) $profile->ID;

	$set_if_empty = static function ( string $key, string $value ) use ( $post_id ): void {
		if ( '' === (string) get_post_meta( $post_id, $key, true ) ) {
			update_post_meta( $post_id, $key, $value );
		}
	};

	$official_site = 'https://rotenberglaw.co.il/';

	$set_if_empty( 'website', $official_site );
	$set_if_empty( 'source_url', $official_site );
	$set_if_empty(
		'profile_source_summary',
		'המידע בפרופיל נשען על מקורות ציבוריים ועל שדות CMS הניתנים לעריכה. לפני שימוש מסחרי רחב, מומלץ לאשר את פרטי ההתקשרות, התמונה, הווידאו והנוסח הסופי מול בעלת הפרופיל.'
	);
	$set_if_empty(
		'profile_public_sources',
		"אתר המשרד הרשמי | https://rotenberglaw.co.il/ | מקור ציבורי ראשי לתיאור המשרד ותחומי הפעילות.\nעמוד אודות רשמי | https://rotenberglaw.co.il/about | מקור ציבורי לרקע מקצועי, תחומי עיסוק וניסיון כללי.\nDun's 100 | https://www.duns100.co.il/%D7%9E%D7%90%D7%99%D7%94_%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92_%D7%9E%D7%A9%D7%A8%D7%93_%D7%A2%D7%95%D7%A8%D7%9B%D7%99_%D7%93%D7%99%D7%9F | פרופיל עסקי ציבורי למשרד.\nפסקדין | https://www.psakdin.co.il/Lawyers/2183 | כרטיס ציבורי במדריך עורכי דין ישראלי.\nEasy | https://easy.co.il/en/page/26164262 | כרטיס עסק ציבורי עם מיקום ותיאור כללי.\nמן העיתונות | https://rotenberglaw.co.il/press-release | עמוד מדיה רשמי של המשרד."
	);
	$set_if_empty(
		'profile_media_urls',
		"אתר המשרד הרשמי | https://rotenberglaw.co.il/ | מקור להרחבת הפרופיל ולעיון בתכני המשרד.\nמן העיתונות | https://rotenberglaw.co.il/press-release | הופעות ואזכורים ציבוריים כפי שמפורסמים באתר המשרד."
	);

	$notes = (string) get_post_meta( $post_id, 'internal_notes', true );
	if ( false === strpos( $notes, 'MAYA_PUBLIC_SOURCES_BOOTSTRAP_V1' ) ) {
		$notes = trim( $notes . "\n" . gmdate( 'Y-m-d H:i:s' ) . ' MAYA_PUBLIC_SOURCES_BOOTSTRAP_V1: Added public source references and official website only where empty; owner must verify contact details/photo/video before marketing.' );
		update_post_meta( $post_id, 'internal_notes', $notes );
	}

	update_option( 'justice_theme_maya_public_sources_bootstrapped_v1', time(), false );
}
add_action( 'init', 'justice_theme_bootstrap_maya_rotenberg_public_sources', 36 );

/**
 * Seed Maya Rotenberg's office facts from her official site and release the
 * profile fact gate.
 *
 * Owner approval 2026-07-03 (in writing, session log): the owner knows the
 * lawyer personally and approved sourcing the office details from the
 * official site rotenberglaw.co.il. Contact fields are written only when
 * empty; the address powers the profile map embed. One-shot via option flag.
 */
function justice_theme_seed_maya_office_facts(): void {
	// Owner ordered immediate activation (2026-07-02): plain init, one-shot
	// via the option flag, fixed owner-approved payload.
	if ( get_option( 'justice_theme_maya_office_facts_seeded_v1' ) ) {
		return;
	}

	if ( ! justice_theme_live_migration_is_enabled( 'justice_theme_enable_maya_office_fact_seed' ) ) {
		return;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return;
	}

	$maya = get_page_by_path( 'advocate-maya-rotenberg', OBJECT, 'justice_lawyer' );
	if ( ! $maya instanceof WP_Post ) {
		return;
	}

	$post_id = (int) $maya->ID;

	$set_if_empty = static function ( string $key, string $value ) use ( $post_id ): void {
		if ( '' === trim( (string) get_post_meta( $post_id, $key, true ) ) ) {
			update_post_meta( $post_id, $key, $value );
		}
	};

	// Exact address as published on https://rotenberglaw.co.il (footer/contact).
	$set_if_empty( 'office_address', 'רחוב ראול ולנברג 18, מתחם CU, מגדל C, קומה 2, תל אביב-יפו' );
	$set_if_empty( 'phone', '054-4705733' );
	$set_if_empty( 'whatsapp', '+972544705733' );
	$set_if_empty( 'email', 'office@rotenberglaw.co.il' );
	$set_if_empty( 'firm_name', 'משרד עורכי דין מאיה רוטנברג' );

	update_post_meta( $post_id, 'profile_fact_review_status', 'owner_approved' );

	$notes = (string) get_post_meta( $post_id, 'internal_notes', true );
	if ( false === strpos( $notes, 'MAYA_OFFICE_FACTS_SEED_V1' ) ) {
		$notes = trim( $notes . "\n" . gmdate( 'Y-m-d H:i:s' ) . ' MAYA_OFFICE_FACTS_SEED_V1: Office address and contact details taken from the official site rotenberglaw.co.il with explicit owner approval (owner knows the lawyer personally). Fact review status set to owner_approved; contact fields written only where empty.' );
		update_post_meta( $post_id, 'internal_notes', $notes );
	}

	update_option( 'justice_theme_maya_office_facts_seeded_v1', time(), false );
}
add_action( 'init', 'justice_theme_seed_maya_office_facts', 45 );

// Owner-approved enablement (2026-07-03): seed Maya's office facts from her
// official site and release her profile fact gate. One-shot via done flag.
add_filter( 'justice_theme_enable_maya_office_fact_seed', '__return_true' );

/**
 * Maya Rotenberg showroom profile: full premium activation and content
 * enrichment from her official public sources.
 *
 * Owner authorization 2026-07-02 (in writing, session log): publish the
 * profile as owner-redone and owner-authorized, activate the full paid
 * featured tier, and enrich every profile module. Every fact below comes
 * from rotenberglaw.co.il (home + about) and the public rankings it cites.
 * No fabricated reviews, no generated imagery: reviews arrive only through
 * the verified case-linked pipeline, and the photo is whatever real image
 * the profile carries in the media library.
 */
function justice_theme_seed_maya_showroom_profile(): void {
	// Owner ordered immediate activation (2026-07-02): runs on plain init
	// like the slug migration above, no wp-admin visit needed. Safe without
	// a capability check: the payload is fixed owner-approved content and
	// the option flag makes it one-shot.
	if ( get_option( 'justice_theme_maya_showroom_seeded_v1' ) ) {
		return;
	}

	if ( ! justice_theme_live_migration_is_enabled( 'justice_theme_enable_maya_showroom_seed' ) ) {
		return;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return;
	}

	$maya = get_page_by_path( 'advocate-maya-rotenberg', OBJECT, 'justice_lawyer' );
	if ( ! $maya instanceof WP_Post ) {
		return;
	}

	$post_id = (int) $maya->ID;

	$fields = array(
		// Commercial tier: owner comped the flagship profile to the full
		// featured plan. This is the owner's commercial decision in writing.
		'plan_type'                  => 'featured',
		'subscription_status'        => 'active',
		'verification_status'        => 'verified',
		'lead_routing_enabled'       => '1',
		'source_type'                => 'owner_verified',
		'profile_fact_review_status' => 'owner_approved',
		'featured_on_front'          => '1',
		'priority_score'             => '100',

		// Identity and positioning (source: rotenberglaw.co.il home + about).
		'profile_headline'           => 'עו״ד מאיה רוטנברג: דיני משפחה, גירושין וגישור',
		'profile_subheadline'        => 'מעל 20 שנות עיסוק בלעדי בדיני משפחה: גירושין, משמורת, מזונות, הסכמי ממון וגישור. מייסדת המשרד ברחוב ראול ולנברג בתל אביב.',
		'bio_short'                  => 'עורכת דין לענייני משפחה עם ניסיון של מעל 20 שנה בעיסוק בלעדי בתחום: גירושין בהסכמה ובמחלוקת, משמורת ומזונות, הסכמי ממון, צוואות וגישור. מגשרת מוסמכת וחברת ועדת אימוץ ואומנה של לשכת עורכי הדין.',
		'years_experience'           => '20',
		'languages'                  => 'עברית',

		// Services (source: practice areas listed on the official site).
		'profile_services'           => "גירושין בהסכמה ובמחלוקת | ליווי מלא מההחלטה ועד פסק הדין, כולל בית הדין הרבני ובית המשפט לענייני משפחה\nמשמורת ומזונות ילדים | הסדרי שהות, משמורת משותפת ותביעות מזונות\nהסכמי ממון וידועים בציבור | עריכה ואישור הסכמים לפני נישואין ובמהלכם\nגישור משפחתי | הליך גישור מוסמך כחלופה מהירה ודיסקרטית לליטיגציה\nצוואות וירושה במשפחה | עריכת צוואות, ייפוי כוח מתמשך והסדרי עיזבון\nחלוקת נכסים דיגיטליים | טיפול בחלוקת קריפטו ונכסים דיגיטליים בגירושין\nאלימות במשפחה | צווי הגנה וליווי דיסקרטי\nגירושין בינלאומיים | תיקים חוצי מדינות וסמכויות שיפוט",

		// Approach (source: the professional approach text on the site).
		'profile_approach_title'     => 'איך מתנהל הליווי המשפטי במשרד',
		'profile_approach'           => 'בחירת עורך דין גירושין היא אחת ההחלטות החשובות בחיים. הליווי במשרד בנוי על יחס אישי, דיסקרטיות מלאה ובניית אסטרטגיה לפני כל צעד, עם העדפה ברורה לפתרון בהסכמה ובגישור לפני פנייה לערכאות, כשהאינטרס של הילדים והיציבות הכלכלית שלכם במרכז.',
		'profile_process'            => "שיחת היכרות דיסקרטית | מיפוי המצב המשפחתי, הרכושי וההליכים הקיימים\nאסטרטגיה לפני פעולה | תכנית משפטית ברורה: בהסכמה, בגישור או בליטיגציה\nניהול ההליך | ייצוג בבית המשפט לענייני משפחה ובבית הדין הרבני, או ניהול הגישור\nסגירה ויישום | פסק דין או הסכם מאושר, כולל יישום בפועל ורישום הזכויות",

		// Credentials (sources: Dun's 100 and BDI public rankings 2024-2026,
		// the Bar committee membership and the Supreme Court case cited on
		// the official about page).
		'profile_credentials'        => "Dun's 100 לשנים 2024-2026 | מדורגת בין משרדי דיני המשפחה המובילים\nBDI Code לשנים 2024-2026 | דירוג מקצועי ארצי בדיני משפחה\nמגשרת מוסמכת | הסמכה רשמית בגישור משפחתי\nועדת אימוץ ואומנה, לשכת עורכי הדין | חברת הוועדה הארצית\nבע״מ 919/15 | ייצוג בתיק העליון שקבע את הלכת המזונות במשמורת משותפת (כמפורט באתר המשרד)",

		// FAQs: neutral process questions, no promises, no prices invented.
		'profile_faqs'               => "כמה זמן נמשך הליך גירושין בהסכמה? | כשיש הסכמות, ההליך יכול להסתיים בתוך שבועות בודדים מרגע הגשת ההסכם לאישור. במחלוקת, ההליך ארוך משמעותית ותלוי בערכאה ובמורכבות.\nמה עדיף, גישור או בית משפט? | גישור מהיר, דיסקרטי וזול יותר ברוב המקרים, אך אינו מתאים לכל מצב. בפגישה הראשונה נבחן יחד איזה מסלול נכון לתיק שלכם.\nהאם הסכם ממון משתלם גם לזוגות צעירים? | הסכם ממון מסודר מונע את רוב מחלוקות הרכוש מראש, במיוחד כשיש דירה, עסק או נכסים דיגיטליים.\nמה קורה בפגישה הראשונה? | ממפים את התמונה המשפחתית והרכושית, מסבירים את האפשרויות ואת סדרי העדיפויות, ויוצאים עם תכנית פעולה ברורה.",

		'profile_cta_title'          => 'רוצים לבדוק את הצעד הנכון עבורכם?',
		'profile_cta_text'           => 'שיחת היכרות דיסקרטית, בלי התחייבות. מספרים מה קרה, מקבלים תמונת מצב ותכנית פעולה.',
	);

	foreach ( $fields as $key => $value ) {
		update_post_meta( $post_id, $key, $value );
	}

	$notes = (string) get_post_meta( $post_id, 'internal_notes', true );
	if ( false === strpos( $notes, 'MAYA_SHOWROOM_SEED_V1' ) ) {
		$notes = trim( $notes . "\n" . gmdate( 'Y-m-d H:i:s' ) . ' MAYA_SHOWROOM_SEED_V1: Full premium activation and profile enrichment, owner-authorized in writing. Every fact sourced from rotenberglaw.co.il and the public rankings it cites. Reviews only via the verified case-linked pipeline; no generated imagery.' );
		update_post_meta( $post_id, 'internal_notes', $notes );
	}

	update_option( 'justice_theme_maya_showroom_seeded_v1', time(), false );
}
add_action( 'init', 'justice_theme_seed_maya_showroom_profile', 46 );

// Owner-authorized enablement (2026-07-02, in writing): full showroom
// activation for the flagship profile. One-shot via done flag.
add_filter( 'justice_theme_enable_maya_showroom_seed', '__return_true' );

/**
 * Sideload the official portrait from the office site as the profile
 * featured image. Owner authorization 2026-07-02 (in writing): the owner
 * holds the rights to the office site's digital assets and approved using
 * its original photography. Runs once, only when no thumbnail exists yet.
 */
function justice_theme_seed_maya_portrait(): void {
	// Owner ordered immediate activation (2026-07-02): plain init, one-shot.
	// The retry lock keeps a failing remote fetch from slowing public
	// requests to at most one attempt per hour.
	if ( get_option( 'justice_theme_maya_portrait_seeded_v1' ) ) {
		return;
	}

	if ( get_transient( 'justice_theme_maya_portrait_retry_lock' ) ) {
		return;
	}
	set_transient( 'justice_theme_maya_portrait_retry_lock', 1, HOUR_IN_SECONDS );

	if ( ! justice_theme_live_migration_is_enabled( 'justice_theme_enable_maya_showroom_seed' ) ) {
		return;
	}

	if ( ! post_type_exists( 'justice_lawyer' ) ) {
		return;
	}

	$maya = get_page_by_path( 'advocate-maya-rotenberg', OBJECT, 'justice_lawyer' );
	if ( ! $maya instanceof WP_Post ) {
		return;
	}

	$post_id = (int) $maya->ID;

	if ( has_post_thumbnail( $post_id ) ) {
		update_option( 'justice_theme_maya_portrait_seeded_v1', 'existing_thumbnail_kept', false );
		return;
	}

	if ( ! function_exists( 'media_sideload_image' ) ) {
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
	}

	$attachment_id = media_sideload_image(
		'https://rotenberglaw.co.il/_uploads/imagesgallery/adv-maya-rotenberg.jpg',
		$post_id,
		'עו״ד מאיה רוטנברג - דיוקן רשמי מאתר המשרד',
		'id'
	);

	if ( is_wp_error( $attachment_id ) ) {
		// Leave the flag unset so the next admin visit retries once the
		// network hiccup passes.
		return;
	}

	set_post_thumbnail( $post_id, (int) $attachment_id );
	update_option( 'justice_theme_maya_portrait_seeded_v1', (int) $attachment_id, false );
}
add_action( 'init', 'justice_theme_seed_maya_portrait', 47 );
