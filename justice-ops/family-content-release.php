<?php
/**
 * Family and divorce content release bridge.
 *
 * The six records below were rewritten in place on 2026-08-02. Production is
 * still running an older theme that hard-codes titles, summaries and reviewer
 * claims outside post_content. This module keeps the existing URLs and makes
 * the reviewed release contract authoritative until the corrected theme is
 * deployed. It is deliberately limited to the six exact paths.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Exact public contract for the first controlled release ring.
 *
 * @return array<string,array<string,string>>
 */
function justice_ops_family_release_contracts(): array {
	return array(
		'/family-law/' => array(
			'h1'          => 'עורך דין לענייני משפחה לפי סוג ההליך',
			'seo_title'   => 'עורך דין לענייני משפחה: גירושין, מזונות ומשמורת | Jus-Tice',
			'description' => 'עורך דין לענייני משפחה מטפל בגירושין, מזונות, אחריות הורית, חלוקת רכוש והסכמים. כך מזהים את ההליך, הדחיפות והניסיון שכדאי לבדוק לפני ייצוג.',
			'canonical'   => 'https://jus-tice.co.il/family-law/',
		),
		'/divorce-lawyer/' => array(
			'h1'          => 'עורך דין גירושין: בחירת ייצוג לפי מצב והליך',
			'seo_title'   => 'עורך דין גירושין: בחירת ייצוג לפי מצב והליך | Jus-Tice',
			'description' => 'מתי צריך עורך דין גירושין, איזה ניסיון לבדוק, אילו מסמכים להכין, מה לשאול על שכר הטרחה ואיך לפעול כשיש דיון, סיכון או מחלוקת דחופה.',
			'canonical'   => 'https://jus-tice.co.il/divorce-lawyer/',
		),
		'/online-family-law-services/' => array(
			'h1'          => 'שירותים מקוונים בדיני משפחה וגירושין',
			'seo_title'   => 'שירותים מקוונים בדיני משפחה: מה אפשר לבצע אונליין | Jus-Tice',
			'description' => 'רשימת פעולות רשמיות בדיני משפחה שניתן לבצע אונליין, עם קישור ישיר, דרישות, מסמכים, אגרה אם פורסמה ותאריך בדיקה לכל שירות.',
			'canonical'   => 'https://jus-tice.co.il/online-family-law-services/',
		),
		'/experienced-family-law-attorney/' => array(
			'h1'          => 'איך לבחור עורך דין לענייני משפחה: בדיקות לפני פגישה',
			'seo_title'   => 'איך לבחור עורך דין לענייני משפחה: בדיקות לפני פגישה | Jus-Tice',
			'description' => 'רשימת בדיקות ושאלות לפגישה עם עורך דין לענייני משפחה: ניסיון מתאים, זהות המטפל, אסטרטגיה, שכר טרחה, זמינות, פרטיות וסימני אזהרה.',
			'canonical'   => 'https://jus-tice.co.il/experienced-family-law-attorney/',
		),
		'/divorce-costs-2025/' => array(
			'h1'          => 'עלויות גירושין בישראל: אגרות, שכר טרחה והוצאות נלוות',
			'seo_title'   => 'כמה עולה להתגרש? עלויות גירושין ואגרות 2026 | Jus-Tice',
			'description' => 'כמה עולה להתגרש בישראל, אילו אגרות משלמים ומה צריך להופיע בהצעת שכר טרחה. סכומי אגרות רשמיים לשנת 2026 וכלי להשוואת היקף ועלות.',
			'canonical'   => 'https://jus-tice.co.il/divorce-costs-2025/',
		),
		'/lawyer-fees-guide/' => array(
			'h1'          => 'שכר טרחה עורך דין: איך בנוי המחיר ומה לבדוק בהצעה',
			'seo_title'   => 'שכר טרחה עורך דין: מודלי חיוב ובדיקת הצעה | Jus-Tice',
			'description' => 'איך בנוי שכר טרחה של עורך דין, מה ההבדל בין מחיר קבוע, שעה ושלב, אילו הוצאות לבדוק ואיך להשוות שתי הצעות על בסיס אותו היקף עבודה.',
			'canonical'   => 'https://jus-tice.co.il/lawyer-fees-guide/',
		),
	);
}

/**
 * Return the normalized current request path.
 */
function justice_ops_family_release_request_path(): string {
	$path = (string) wp_parse_url( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), PHP_URL_PATH );
	$path = '/' . trim( $path, '/' ) . '/';

	return '//' === $path ? '/' : $path;
}

/**
 * Resolve the current release contract, if this is an allowlisted path.
 *
 * @return array<string,string>|null
 */
function justice_ops_current_family_release_contract(): ?array {
	$contracts = justice_ops_family_release_contracts();
	$path      = justice_ops_family_release_request_path();

	return $contracts[ $path ] ?? null;
}

/**
 * Allow operations to retire the bridge without deleting code.
 */
function justice_ops_family_release_bridge_enabled(): bool {
	$enabled = true;

	if ( function_exists( 'get_option' ) ) {
		$enabled = '0' !== (string) get_option( 'justice_ops_family_release_bridge_enabled', '1' );
	}

	return (bool) apply_filters( 'justice_ops_family_release_bridge_enabled', $enabled );
}

/**
 * Lead storage and routing are a separate module so operations can retire the
 * presentation bridge without silently enabling external distribution.
 */
function justice_ops_internal_lead_hold_enabled(): bool {
	$enabled = true;

	if ( function_exists( 'get_option' ) ) {
		$enabled = '0' !== (string) get_option( 'justice_ops_internal_lead_hold_enabled', '1' );
	}

	return (bool) apply_filters( 'justice_ops_internal_lead_hold_enabled', $enabled );
}

/**
 * Install metadata filters after the legacy route has installed its own.
 */
function justice_ops_install_family_release_metadata_filters(): void {
	if ( ! justice_ops_family_release_bridge_enabled() || null === justice_ops_current_family_release_contract() ) {
		return;
	}

	add_filter( 'pre_get_document_title', 'justice_ops_family_release_title', PHP_INT_MAX );
	add_filter( 'wpseo_title', 'justice_ops_family_release_title', PHP_INT_MAX );
	add_filter( 'wpseo_opengraph_title', 'justice_ops_family_release_title', PHP_INT_MAX );
	add_filter( 'wpseo_twitter_title', 'justice_ops_family_release_title', PHP_INT_MAX );
	add_filter( 'wpseo_metadesc', 'justice_ops_family_release_description', PHP_INT_MAX );
	add_filter( 'wpseo_opengraph_desc', 'justice_ops_family_release_description', PHP_INT_MAX );
	add_filter( 'wpseo_twitter_description', 'justice_ops_family_release_description', PHP_INT_MAX );
	add_filter( 'wpseo_canonical', 'justice_ops_family_release_canonical', PHP_INT_MAX );
}
add_action( 'get_header', 'justice_ops_install_family_release_metadata_filters', PHP_INT_MAX );

/**
 * Return the controlled SEO title.
 *
 * @param mixed $title Existing title.
 */
function justice_ops_family_release_title( $title ): string {
	$contract = justice_ops_current_family_release_contract();

	return $contract ? $contract['seo_title'] : (string) $title;
}

/**
 * Return the controlled meta description.
 *
 * @param mixed $description Existing description.
 */
function justice_ops_family_release_description( $description ): string {
	$contract = justice_ops_current_family_release_contract();

	return $contract ? $contract['description'] : (string) $description;
}

/**
 * Return the controlled self-canonical.
 *
 * @param mixed $canonical Existing canonical.
 */
function justice_ops_family_release_canonical( $canonical ): string {
	$contract = justice_ops_current_family_release_contract();

	return $contract ? $contract['canonical'] : (string) $canonical;
}

/**
 * Replace the first body H1 while preserving its attributes.
 */
function justice_ops_family_release_replace_h1( string $body, string $h1 ): string {
	$replaced = preg_replace_callback(
		'#(<h1\b[^>]*>)[\s\S]*?(</h1>)#iu',
		static function ( array $match ) use ( $h1 ): string {
			return $match[1] . esc_html( $h1 ) . $match[2];
		},
		$body,
		1
	);

	return is_string( $replaced ) ? $replaced : $body;
}

/**
 * Replace the legacy practice-hero summary with the released record excerpt.
 */
function justice_ops_family_release_replace_summary( string $body, string $summary ): string {
	$replaced = preg_replace_callback(
		'#(<section\b[^>]*class=["\'][^"\']*\blegal-pillar-hero\b[^"\']*["\'][^>]*>[\s\S]*?</h1>\s*)<p\b([^>]*)>[\s\S]*?</p>#iu',
		static function ( array $match ) use ( $summary ): string {
			return $match[1] . '<p' . $match[2] . '>' . esc_html( $summary ) . '</p>';
		},
		$body,
		1
	);

	return is_string( $replaced ) ? $replaced : $body;
}

/**
 * Remove reviewer markup injected without a matching page review record.
 */
function justice_ops_family_release_strip_review_claims( string $body ): string {
	$patterns = array(
		'#<div\b[^>]*class=["\'][^"\']*\bsingle-article__author\b[^"\']*["\'][^>]*>[\s\S]*?</div>#iu',
		'#<p\b[^>]*class=["\'][^"\']*\beeat-reviewed-footer\b[^"\']*["\'][^>]*>[\s\S]*?</p>#iu',
		'#<p\b[^>]*class=["\'][^"\']*\blegal-pillar-hero__reviewed\b[^"\']*["\'][^>]*>[\s\S]*?</p>#iu',
		'#<section\b[^>]*class=["\'][^"\']*\blegal-pillar-reviewed\b[^"\']*["\'][^>]*>[\s\S]*?</section>#iu',
	);

	$clean = preg_replace( $patterns, '', $body );

	return is_string( $clean ) ? $clean : $body;
}

/**
 * Add the same neutral visibility note to every featured card and remove the
 * unsupported years/exclusivity sentence emitted for Maya by the legacy theme.
 */
function justice_ops_family_release_clarify_featured_cards( string $body ): string {
	if ( false === strpos( $body, 'jt-premium-card' ) ) {
		return $body;
	}

	$safe_bio       = '<p class="jt-premium-card__bio">עורכת דין בתחום דיני המשפחה והגירושין. לפני התקשרות יש לבדוק רישיון, ניסיון והתאמה למקרה הספציפי.</p>';
	$visibility_note = '<p class="jt-card__visibility-note" data-jt-card-visibility-note="general"><strong>הבהרת נראות:</strong> הופעה, מיקום והיקף חשיפה של כרטיסים באתר עשויים להיות מושפעים משיקולים מסחריים ועריכתיים. הם אינם דירוג מקצועי, המלצה, הצהרה על עצמאות מסחרית או הבטחת התאמה.</p>';

	$updated = preg_replace_callback(
		'#<div\b[^>]*class=["\'][^"\']*\bjt-premium-card\b[^"\']*["\'][^>]*>[\s\S]*?<div\b[^>]*class=["\'][^"\']*\bjt-premium-card__body\b[^"\']*["\'][^>]*>[\s\S]*?</div>\s*</div>#iu',
		static function ( array $match ) use ( $safe_bio, $visibility_note ): string {
			$card = $match[0];
			if ( false !== strpos( $card, 'data-jt-card-visibility-note="general"' ) ) {
				return $card;
			}

			if ( false !== strpos( wp_strip_all_tags( $card ), 'מאיה רוטנברג' ) ) {
				$with_bio = preg_replace(
					'#<p\b[^>]*class=["\'][^"\']*\bjt-premium-card__bio\b[^"\']*["\'][^>]*>[\s\S]*?</p>#iu',
					$safe_bio,
					$card,
					1
				);
				if ( is_string( $with_bio ) ) {
					$card = $with_bio;
				}
			}

			$with_note = preg_replace(
				'#(<span\b[^>]*class=["\'][^"\']*\bjt-premium-card__meta\b[^"\']*["\'][^>]*>[\s\S]*?</span>)#iu',
				'$1' . $visibility_note,
				$card,
				1
			);
			if ( is_string( $with_note ) && $with_note !== $card ) {
				return $with_note;
			}

			$fallback = preg_replace(
				'#(<div\b[^>]*class=["\'][^"\']*\bjt-premium-card__body\b[^"\']*["\'][^>]*>)#iu',
				'$1' . $visibility_note,
				$card,
				1
			);

			return is_string( $fallback ) ? $fallback : $card;
		},
		$body
	);

	return is_string( $updated ) ? $updated : $body;
}

/**
 * Make the visible consent match the enforced internal-only handling state.
 */
function justice_ops_family_release_truthful_consent( string $body ): string {
	$replacement = '<span>אני מאשר/ת ל-Jus-Tice לשמור את פרטי הפנייה וליצור איתי קשר לצורך טיפול בה. הפרטים לא יועברו לעורך דין ללא אישור נוסף ממני. ידוע לי שהמידע אינו ייעוץ משפטי ואינו יוצר יחסי עורך דין ולקוח.</span>';
	$updated     = preg_replace(
		'#(<label\b[^>]*class=["\'][^"\']*\blead-form__consent\b[^"\']*["\'][^>]*>[\s\S]*?<input\b[^>]*>)[\s\S]*?(</label>)#iu',
		'$1' . $replacement . '$2',
		$body
	);

	return is_string( $updated ) ? $updated : $body;
}

/**
 * Final rendered-body compatibility pass for the six exact URLs.
 */
function justice_ops_family_release_filter_html( string $html ): string {
	if ( ! justice_ops_family_release_bridge_enabled() ) {
		return $html;
	}

	$contract = justice_ops_current_family_release_contract();
	if ( null === $contract ) {
		return $html;
	}

	$body_position = stripos( $html, '<body' );
	if ( false === $body_position ) {
		return $html;
	}

	$head = substr( $html, 0, $body_position );
	$body = substr( $html, $body_position );
	$body = justice_ops_family_release_replace_h1( $body, $contract['h1'] );
	$body = justice_ops_family_release_replace_summary( $body, $contract['description'] );
	$body = justice_ops_family_release_strip_review_claims( $body );
	$body = justice_ops_family_release_truthful_consent( $body );

	if ( in_array( justice_ops_family_release_request_path(), array( '/family-law/', '/divorce-lawyer/' ), true ) ) {
		$body = justice_ops_family_release_clarify_featured_cards( $body );
	}

	if ( false === strpos( $body, 'data-jt-family-release=' ) ) {
		$marked = preg_replace(
			'#<body\b#i',
			'<body data-jt-family-release="2026-08-02-r2"',
			$body,
			1
		);
		if ( is_string( $marked ) ) {
			$body = $marked;
		}
	}

	return $head . $body;
}

add_action(
	'template_redirect',
	static function (): void {
		if ( is_admin() || ! justice_ops_family_release_bridge_enabled() || null === justice_ops_current_family_release_contract() ) {
			return;
		}

		ob_start( 'justice_ops_family_release_filter_html' );
	},
	-2000000
);

/**
 * Keep every accepted lead in the internal CRM and stop external distribution
 * until the owner supplies one verified mailbox and enables it explicitly.
 */
add_action(
	'save_post_justice_lead',
	static function ( int $post_id ): void {
		if ( ! justice_ops_internal_lead_hold_enabled() || wp_is_post_revision( $post_id ) ) {
			return;
		}

		update_post_meta( $post_id, 'routing_hold', '1' );
		update_post_meta( $post_id, 'routing_method', 'internal_only_owner_hold' );
		update_post_meta( $post_id, 'routing_notes', 'Stored once in the internal CRM. No lawyer distribution or email is enabled until one verified recipient is configured.' );
	},
	1
);

/**
 * Some handlers add lead_status before save_post fires. Stamp the same hold
 * first so the legacy meta-driven router cannot race the save_post guard.
 *
 * @param int    $meta_id    Metadata row ID.
 * @param int    $post_id    Lead post ID.
 * @param string $meta_key   Metadata key.
 * @param mixed  $meta_value Metadata value.
 */
function justice_ops_family_release_hold_new_lead_meta( $meta_id, $post_id, $meta_key, $meta_value ): void {
	if ( ! justice_ops_internal_lead_hold_enabled() || 'lead_status' !== $meta_key || 'new' !== $meta_value || 'justice_lead' !== get_post_type( (int) $post_id ) ) {
		return;
	}

	update_post_meta( (int) $post_id, 'routing_hold', '1' );
	update_post_meta( (int) $post_id, 'routing_method', 'internal_only_owner_hold' );
}
add_action( 'added_post_meta', 'justice_ops_family_release_hold_new_lead_meta', 1, 4 );
add_action( 'updated_post_meta', 'justice_ops_family_release_hold_new_lead_meta', 1, 4 );

/**
 * Route the one allowed notification to a verified mailbox, or suppress mail
 * while the mailbox option is empty. The lead record is still stored once.
 *
 * @param array<string,mixed> $args wp_mail arguments.
 * @return array<string,mixed>
 */
add_filter(
	'wp_mail',
	static function ( array $args ): array {
		if ( ! justice_ops_internal_lead_hold_enabled() ) {
			return $args;
		}

		$action = isset( $_POST['action'] ) ? sanitize_key( wp_unslash( $_POST['action'] ) ) : '';
		if ( 'justice_submit_lead' !== $action ) {
			return $args;
		}

		$mailbox = sanitize_email( (string) get_option( 'justice_ops_verified_lead_mailbox', '' ) );
		if ( $mailbox && is_email( $mailbox ) ) {
			$args['to'] = array( $mailbox );
		}

		return $args;
	},
	PHP_INT_MAX
);

add_filter(
	'pre_wp_mail',
	static function ( $return, array $args ) {
		if ( ! justice_ops_internal_lead_hold_enabled() ) {
			return $return;
		}

		$action = isset( $_POST['action'] ) ? sanitize_key( wp_unslash( $_POST['action'] ) ) : '';
		if ( 'justice_submit_lead' !== $action ) {
			return $return;
		}

		$mailbox = sanitize_email( (string) get_option( 'justice_ops_verified_lead_mailbox', '' ) );

		return $mailbox && is_email( $mailbox ) ? $return : false;
	},
	PHP_INT_MAX,
	2
);

add_action(
	'wp_head',
	static function (): void {
		if ( ! justice_ops_family_release_bridge_enabled() || null === justice_ops_current_family_release_contract() ) {
			return;
		}
		?>
		<style id="justice-family-release-css">
		.jt-card__visibility-note{display:block;margin:.45rem 0 .65rem;padding:.65rem .75rem;border:1px solid #c49e3c;background:#fff8dd;color:#332b16;font-size:.86rem;line-height:1.55;border-radius:8px}
		</style>
		<?php
	},
	1000
);
