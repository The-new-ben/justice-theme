<?php
/**
 * Controlled release bridge for the preserved Maya Rotenberg firm profile.
 *
 * This module has one record and one public path. It gives that record a
 * single firm-profile intent, publishes the reviewed source-led copy, keeps
 * the approved commercial disclosure visible, and replaces broad legacy
 * article/service schema with the two approved page-level graph types.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Return the immutable public contract for the exact profile record.
 *
 * @return array<string,mixed>
 */
function justice_ops_maya_profile_release_contract(): array {
	return array(
		'post_id'        => 11687,
		'post_type'      => 'articles',
		'slug'           => 'family-law-lawyer-recommended-divorce-wills-inheritances',
		'path'           => '/family-law-lawyer-recommended-divorce-wills-inheritances/',
		'canonical'      => 'https://jus-tice.co.il/family-law-lawyer-recommended-divorce-wills-inheritances/',
		'h1'             => 'משרד מאיה רוטנברג בדיני משפחה: פרופיל ומקורות',
		'seo_title'      => 'משרד מאיה רוטנברג בדיני משפחה: פרופיל ומקורות | Jus-Tice',
		'description'    => 'פרופיל מקורות של משרד מאיה רוטנברג: תחומי פעילות, רישום ב-Dun’s 100, תיעוד הייצוג בבע"מ 919/15 וגילוי על הקשר המסחרי ל-Jus-Tice.',
		'source_checked' => '2026-08-02',
		'release_marker' => '2026-08-02-r1',
	);
}

/**
 * The reviewed public body. It deliberately contains no provider CTA,
 * personal licence claim, reviewer claim, customer rating, or result claim.
 */
function justice_ops_maya_profile_release_body(): string {
	return <<<'HTML'
<section class="jt-maya-profile" data-jt-maya-profile-content="2026-08-02-r1">
<p>זהו פרופיל מקורות של משרד מאיה רוטנברג. הוא מרכז מידע שניתן לבדוק במקורות ציבוריים ואינו מדרג את המשרד, ממליץ עליו או קובע התאמה למקרה מסוים.</p>
<p class="jt-maya-profile__disclosure" data-jt-commercial-disclosure="maya-rotenberg" role="note" aria-label="גילוי מסחרי"><strong>גילוי מסחרי:</strong> מאיה רוטנברג היא שותפה עסקית ולקוחה משלמת של Jus-Tice. למשרד פרופיל פרימיום וחשיפה מוגברת באתר. הקשר אינו ציון איכות, המלצה מקצועית או הבטחת התאמה או תוצאה.</p>
<h2>מה מופיע במקורות הציבוריים</h2>
<p><a href="https://rotenberglaw.co.il/about">אתר המשרד</a> מציג את השם "משרד עורכי דין מאיה רוטנברג" ומתאר משרד בתל אביב שעוסק בדיני משפחה וגירושין. <a href="https://www.duns100.co.il/%D7%9E%D7%90%D7%99%D7%94_%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92_%D7%9E%D7%A9%D7%A8%D7%93_%D7%A2%D7%95%D7%A8%D7%9B%D7%99_%D7%93%D7%99%D7%9F">פרופיל Dun’s 100</a> מציג את הישות בשם "מאיה רוטנברג משרד עורכי דין" ובקטגוריה "גירושין, דיני משפחה, ירושות וצוואות".</p>
<p>הפרטים מוצגים כאן לפי המקור שבו פורסמו. ניסוח באתר המשרד הוא הצהרה של המשרד. ניסוח בפרופיל עסקי חיצוני מוכיח מה מופיע באותו פרופיל, אך אינו מחליף אימות רשמי של כל פרט.</p>
<h2>זהות, ניהול ומיקום</h2>
<p>אתר המשרד ופרופיל Dun’s 100 מציגים משרד בתל אביב. בפרופיל Dun’s 100 מאיה רוטנברג מופיעה תחת "מנהלים" בתיאור "עו"ד ובעלים". הפרופיל הנוכחי מייחס את התיאור למקור ואינו משתמש בו כהוכחה עצמאית לסטטוס רישיון נוכחי.</p>
<p>ההפרדה חשובה: עמוד זה מתאר את המשרד כישות. פרטים אישיים כגון סטטוס מקצועי, מספר רישיון, תאריך הסמכה וניסיון של אדם שייכים לפרופיל אדם נפרד ורק לאחר בדיקה במקור רשמי עדכני.</p>
<h2>תחומי פעילות שמוזכרים בשני המקורות</h2>
<p>באתר המשרד ובפרופיל Dun’s 100 מופיעים תחומי משפחה וגירושין, צוואות וירושות, הסכמים וגישור. אתר המשרד מזכיר גם חלוקת רכוש, ענייני ילדים ומזונות. הרשימה מתארת את תחומי הפעילות שהמקורות מייחסים למשרד. היא אינה קביעה של Jus-Tice לגבי איכות השירות, היקף הניסיון או התאמה לתיק מסוים.</p>
<p>למידע כללי על סוגי עניינים והפניה לנושא המתאים, עברו אל <a href="https://jus-tice.co.il/family-law/">מידע כללי על דיני משפחה</a>. לבדיקות שכדאי לבצע מול כל מועמד, עברו אל <a href="https://jus-tice.co.il/experienced-family-law-attorney/">בדיקות לפני בחירת עורך דין</a>.</p>
<h2>תיעוד חיצוני של ייצוג בבע"מ 919/15</h2>
<p>בכותרת <a href="https://meronlaw.co.il/wp-content/uploads/2023/10/1a801bbb-6429-4d35-a4b1-0cf2ca5a487d.pdf">פסק הדין בבע"מ 919/15</a> מאיה רוטנברג וזרח רוזנבלום רשומים כבאי כוח המבקש בתיק 919/15. גם <a href="https://www.ynet.co.il/article/SycYNVqsv">תוכן שיווקי ופרסומי שפורסם ב-Ynet על פסק הדין</a> מציין כי מאיה רוטנברג ייצגה את האב באותו הליך. Ynet מסמן את העמוד כתוכן שיווקי ופרסומי, ולכן ההצהרה מובאת בשם המפרסם ולא כאימות עיתונאי עצמאי.</p>
<p>פסק הדין הוא המקור התיעודי לרשימת באי הכוח. המקורות אינם מוכיחים שיעור הצלחה, עליונות מקצועית או תוצאה צפויה בתיק אחר.</p>
<h2>הרישום ב-Dun’s 100</h2>
<p>עמוד Dun’s 100 מציג את המשרד בדירוג דיני משפחה וירושה לשנת 2026. זו עובדה על הופעת המשרד בעמוד הדירוג ובשנה המצוינת בו. Jus-Tice אינו הופך את הרישום לציון משלו ואינו מסיק ממנו שהמשרד "הטוב ביותר", "מוביל" או מתאים לכל פונה.</p>
<h2>איך המידע בפרופיל נבדק</h2>
<p>הבדיקה מפרידה בין ארבעה סוגי מקורות. אתר של המשרד משמש מקור למה שהמשרד אומר על עצמו. פרופיל עסקי חיצוני משמש מקור למה שפורסם באותו פרופיל ובמועד הבדיקה. מסמך משפטי משמש לתיעוד עובדה מוגדרת, כמו זהות באי הכוח בתיק מסוים. תוכן ממומן של מפרסם מוצג רק כהצהרה מיוחסת ולא כמקור עצמאי.</p>
<p>כאשר מקורות מציגים גרסאות שונות, הפרט אינו נבחר לפי הנוסח המחמיא יותר. הוא נשאר מחוץ לפרופיל עד שנמצא מקור מתאים שמיישב את הסתירה. זו הסיבה ששנת הקמה, ותק, גודל צוות וחלק מטענות הדירוג אינם מופיעים כאן כעובדות.</p>
<h2>מה הפרופיל אינו קובע</h2>
<p>הפרופיל אינו מפרסם כעובדה:</p>
<ol>
<li>שהמשרד מומלץ או מוביל.</li>
<li>מספר שנות ניסיון או שנת הקמה.</li>
<li>מספר תיקים, שיעור הצלחה או הבטחת תוצאה.</li>
<li>דירוגי לקוחות, ביקורות או שביעות רצון.</li>
<li>מספר אנשי צוות או זהות הצוות הנוכחי.</li>
<li>סטטוס מקצועי או מספר רישיון של אדם, משום שהעמוד מתאר את המשרד. מידע אישי כזה שייך לפרופיל אדם נפרד ולמקור הרשמי המתאים.</li>
<li>קשר של העסקה, בעלות משותפת, שליטה או קבלת פניות שלא נמסר ואושר במפורש. הקשר העסקי, התשלום, פרופיל הפרימיום והחשיפה המוגברת שאושרו מוצגים בגילוי שמעל.</li>
</ol>
<h2>מקורות ותיקונים</h2>
<p>המקורות הבאים נבדקו לצורך הפרופיל ביום 2.8.2026:</p>
<ol>
<li><a href="https://rotenberglaw.co.il/about">עמוד אודות באתר משרד מאיה רוטנברג</a>.</li>
<li><a href="https://www.duns100.co.il/%D7%9E%D7%90%D7%99%D7%94_%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92_%D7%9E%D7%A9%D7%A8%D7%93_%D7%A2%D7%95%D7%A8%D7%9B%D7%99_%D7%93%D7%99%D7%9F">פרופיל מאיה רוטנברג משרד עורכי דין ב-Dun’s 100</a>.</li>
<li><a href="https://meronlaw.co.il/wp-content/uploads/2023/10/1a801bbb-6429-4d35-a4b1-0cf2ca5a487d.pdf">עותק פסק הדין בבע"מ 919/15</a>.</li>
<li><a href="https://www.ynet.co.il/article/SycYNVqsv">תוכן שיווקי ופרסומי שפורסם ב-Ynet על הייצוג בפסק הדין</a>.</li>
</ol>
<p>בקשת תיקון לפרט בפרופיל אפשר לשלוח לכתובת <code>info@jus-tice.co.il</code> בצירוף מקור ציבורי שמראה מה יש לתקן. כתובת זו היא ערוץ תיקונים של Jus-Tice ואינה כתובת לפנייה למשרד.</p>
</section>
HTML;
}

/**
 * Return the normalized request path.
 */
function justice_ops_maya_profile_release_request_path(): string {
	$request_uri = (string) ( $_SERVER['REQUEST_URI'] ?? '' );
	$path        = function_exists( 'wp_parse_url' )
		? (string) wp_parse_url( $request_uri, PHP_URL_PATH )
		: (string) parse_url( $request_uri, PHP_URL_PATH );
	$path        = '/' . trim( $path, '/' ) . '/';

	return '//' === $path ? '/' : $path;
}

/**
 * Allow operations to retire the render bridge after the theme and database
 * carry the same reviewed contract.
 */
function justice_ops_maya_profile_release_enabled(): bool {
	$enabled = true;
	if ( function_exists( 'get_option' ) ) {
		$enabled = '0' !== (string) get_option( 'justice_ops_maya_profile_release_enabled', '1' );
	}

	return function_exists( 'apply_filters' )
		? (bool) apply_filters( 'justice_ops_maya_profile_release_enabled', $enabled )
		: $enabled;
}

/**
 * True only for the preserved path and, once queried, the preserved record.
 */
function justice_ops_maya_profile_release_is_request(): bool {
	$contract = justice_ops_maya_profile_release_contract();
	if ( ! justice_ops_maya_profile_release_enabled() ) {
		return false;
	}

	if ( $contract['path'] !== justice_ops_maya_profile_release_request_path() ) {
		return false;
	}

	if ( function_exists( 'is_singular' ) && ! is_singular( $contract['post_type'] ) ) {
		return false;
	}

	if ( function_exists( 'get_queried_object_id' ) ) {
		$queried_id = (int) get_queried_object_id();
		if ( $queried_id > 0 && (int) $contract['post_id'] !== $queried_id ) {
			return false;
		}
	}

	return true;
}

/**
 * Replace the legacy database body only in the main rendering of this record.
 *
 * @param mixed $content Existing content.
 * @return mixed
 */
function justice_ops_maya_profile_release_content( $content ) {
	if ( ! is_string( $content ) || ( function_exists( 'is_admin' ) && is_admin() ) || ! justice_ops_maya_profile_release_is_request() ) {
		return $content;
	}

	if ( function_exists( 'in_the_loop' ) && ! in_the_loop() ) {
		return $content;
	}

	if ( function_exists( 'is_main_query' ) && ! is_main_query() ) {
		return $content;
	}

	return justice_ops_maya_profile_release_body();
}
add_filter( 'the_content', 'justice_ops_maya_profile_release_content', PHP_INT_MAX );

/**
 * Keep every visible reference to this exact post on the reviewed title.
 *
 * @param mixed $title   Existing title.
 * @param int   $post_id Post ID.
 */
function justice_ops_maya_profile_release_post_title( $title, $post_id = 0 ): string {
	$contract = justice_ops_maya_profile_release_contract();

	return (int) $contract['post_id'] === (int) $post_id ? $contract['h1'] : (string) $title;
}
add_filter( 'the_title', 'justice_ops_maya_profile_release_post_title', PHP_INT_MAX, 2 );

/**
 * Exact public metadata callbacks.
 *
 * @param mixed $value Existing value.
 */
function justice_ops_maya_profile_release_seo_title( $value ): string {
	return justice_ops_maya_profile_release_is_request()
		? justice_ops_maya_profile_release_contract()['seo_title']
		: (string) $value;
}

function justice_ops_maya_profile_release_description( $value ): string {
	return justice_ops_maya_profile_release_is_request()
		? justice_ops_maya_profile_release_contract()['description']
		: (string) $value;
}

function justice_ops_maya_profile_release_canonical( $value ): string {
	return justice_ops_maya_profile_release_is_request()
		? justice_ops_maya_profile_release_contract()['canonical']
		: (string) $value;
}

/**
 * Install after legacy theme callbacks so the profile contract wins.
 */
function justice_ops_maya_profile_release_install_metadata_filters(): void {
	if ( ! justice_ops_maya_profile_release_is_request() ) {
		return;
	}

	add_filter( 'pre_get_document_title', 'justice_ops_maya_profile_release_seo_title', PHP_INT_MAX );
	add_filter( 'wpseo_title', 'justice_ops_maya_profile_release_seo_title', PHP_INT_MAX );
	add_filter( 'wpseo_opengraph_title', 'justice_ops_maya_profile_release_seo_title', PHP_INT_MAX );
	add_filter( 'wpseo_twitter_title', 'justice_ops_maya_profile_release_seo_title', PHP_INT_MAX );
	add_filter( 'aioseo_title', 'justice_ops_maya_profile_release_seo_title', PHP_INT_MAX );
	add_filter( 'wpseo_metadesc', 'justice_ops_maya_profile_release_description', PHP_INT_MAX );
	add_filter( 'wpseo_opengraph_desc', 'justice_ops_maya_profile_release_description', PHP_INT_MAX );
	add_filter( 'wpseo_twitter_description', 'justice_ops_maya_profile_release_description', PHP_INT_MAX );
	add_filter( 'aioseo_description', 'justice_ops_maya_profile_release_description', PHP_INT_MAX );
	add_filter( 'wpseo_canonical', 'justice_ops_maya_profile_release_canonical', PHP_INT_MAX );
	add_filter( 'wpseo_opengraph_url', 'justice_ops_maya_profile_release_canonical', PHP_INT_MAX );
	add_filter( 'wpseo_schema_graph', '__return_empty_array', PHP_INT_MAX );
}
add_action( 'get_header', 'justice_ops_maya_profile_release_install_metadata_filters', PHP_INT_MAX );

/**
 * Evidence-backed graph for this firm profile. The current owner contract
 * allows only WebPage, BreadcrumbList, and the breadcrumb ListItem children.
 *
 * @return array<string,mixed>
 */
function justice_ops_maya_profile_release_schema(): array {
	$contract = justice_ops_maya_profile_release_contract();

	return array(
		'@context' => 'https://schema.org',
		'@graph'   => array(
			array(
				'@type'      => 'WebPage',
				'@id'        => $contract['canonical'] . '#webpage',
				'url'        => $contract['canonical'],
				'name'       => $contract['h1'],
				'description' => $contract['description'],
				'inLanguage' => 'he-IL',
			),
			array(
				'@type'           => 'BreadcrumbList',
				'@id'             => $contract['canonical'] . '#breadcrumb',
				'itemListElement' => array(
					array(
						'@type'    => 'ListItem',
						'position' => 1,
						'name'     => 'Jus-Tice',
						'item'     => 'https://jus-tice.co.il/',
					),
					array(
						'@type'    => 'ListItem',
						'position' => 2,
						'name'     => 'דיני משפחה',
						'item'     => 'https://jus-tice.co.il/family-law/',
					),
					array(
						'@type'    => 'ListItem',
						'position' => 3,
						'name'     => $contract['h1'],
						'item'     => $contract['canonical'],
					),
				),
			),
		),
	);
}

/**
 * Remove every legacy JSON-LD block and optionally insert the controlled graph.
 */
function justice_ops_maya_profile_release_control_schema( string $html, bool $emit_controlled_graph = true ): string {
	$clean = justice_ops_maya_profile_release_remove_json_ld_scripts( $html );
	if ( ! $emit_controlled_graph ) {
		return $clean;
	}

	$options = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT;
	$json    = function_exists( 'wp_json_encode' )
		? wp_json_encode( justice_ops_maya_profile_release_schema(), $options )
		: json_encode( justice_ops_maya_profile_release_schema(), $options );

	if ( ! is_string( $json ) || '' === $json ) {
		return $clean;
	}

	$script = '<script type="application/ld+json" id="justice-maya-profile-schema">' . $json . '</script>';
	if ( false !== stripos( $clean, '</head>' ) ) {
		$inserted = preg_replace( '#</head>#i', $script . '</head>', $clean, 1 );
		return is_string( $inserted ) ? $inserted : $clean;
	}

	if ( false !== stripos( $clean, '<body' ) ) {
		$inserted = preg_replace( '#<body\b#i', $script . '<body', $clean, 1 );
		return is_string( $inserted ) ? $inserted : $clean;
	}

	return $clean;
}

/**
 * Find the closing bracket for one HTML tag without treating a bracket inside
 * a quoted attribute value as the end of the tag.
 *
 * @return int|false
 */
function justice_ops_maya_profile_release_tag_end( string $html, int $start ) {
	$length = strlen( $html );
	$quote  = '';
	for ( $index = $start + 1; $index < $length; $index++ ) {
		$character = $html[ $index ];
		if ( '' !== $quote ) {
			if ( $character === $quote ) {
				$quote = '';
			}
			continue;
		}
		if ( '"' === $character || "'" === $character ) {
			$quote = $character;
			continue;
		}
		if ( '>' === $character ) {
			return $index;
		}
	}

	return false;
}

/**
 * Find the next real raw-text closing tag, not just a matching name prefix.
 * For example, </script-not-real> remains script data.
 *
 * @return int|false
 */
function justice_ops_maya_profile_release_raw_closing_tag_position( string $html, string $tag_name, int $offset ) {
	$needle = '</' . strtolower( $tag_name );
	$length = strlen( $html );
	$cursor = $offset;
	while ( $cursor < $length ) {
		$candidate = stripos( $html, $needle, $cursor );
		if ( false === $candidate ) {
			return false;
		}
		$boundary_index = $candidate + strlen( $needle );
		if ( $boundary_index < $length ) {
			$boundary = $html[ $boundary_index ];
			if ( '>' === $boundary || '/' === $boundary || ctype_space( $boundary ) ) {
				$tag_end = justice_ops_maya_profile_release_tag_end( $html, $candidate );
				if ( false !== $tag_end ) {
					return $candidate;
				}
				return false;
			}
		}
		$cursor = $boundary_index;
	}

	return false;
}

/**
 * Parse actual attributes from one opening tag without interpreting bytes in
 * quoted values as markup.
 *
 * @return array<string,string|null>
 */
function justice_ops_maya_profile_release_opening_tag_attributes( string $tag ): array {
	if ( 1 !== preg_match( '#^<[A-Za-z][A-Za-z0-9:_-]*#', $tag, $tag_name_match ) ) {
		return array();
	}

	$attributes = array();
	$length     = strlen( $tag );
	$cursor     = strlen( $tag_name_match[0] );
	while ( $cursor < $length ) {
		while ( $cursor < $length && ctype_space( $tag[ $cursor ] ) ) {
			$cursor++;
		}
		if (
			$cursor >= $length
			|| '>' === $tag[ $cursor ]
			|| ( '/' === $tag[ $cursor ] && $cursor + 1 < $length && '>' === $tag[ $cursor + 1 ] )
		) {
			break;
		}

		$name_start = $cursor;
		while (
			$cursor < $length
			&& ! ctype_space( $tag[ $cursor ] )
			&& ! in_array( $tag[ $cursor ], array( '=', '/', '>' ), true )
		) {
			$cursor++;
		}
		if ( $cursor === $name_start ) {
			break;
		}

		$name      = strtolower( substr( $tag, $name_start, $cursor - $name_start ) );
		$lookahead = $cursor;
		while ( $lookahead < $length && ctype_space( $tag[ $lookahead ] ) ) {
			$lookahead++;
		}
		$value = null;
		if ( $lookahead < $length && '=' === $tag[ $lookahead ] ) {
			$lookahead++;
			while ( $lookahead < $length && ctype_space( $tag[ $lookahead ] ) ) {
				$lookahead++;
			}
			$value_start = $lookahead;
			if ( $lookahead < $length && ( '"' === $tag[ $lookahead ] || "'" === $tag[ $lookahead ] ) ) {
				$quote       = $tag[ $lookahead ];
				$value_start = ++$lookahead;
				while ( $lookahead < $length && $quote !== $tag[ $lookahead ] ) {
					$lookahead++;
				}
				$value = substr( $tag, $value_start, $lookahead - $value_start );
				if ( $lookahead < $length ) {
					$lookahead++;
				}
			} else {
				while ( $lookahead < $length && ! ctype_space( $tag[ $lookahead ] ) && '>' !== $tag[ $lookahead ] ) {
					$lookahead++;
				}
				$value = substr( $tag, $value_start, $lookahead - $value_start );
			}
			$cursor = $lookahead;
		}
		if ( ! array_key_exists( $name, $attributes ) ) {
			$attributes[ $name ] = $value;
		}
	}

	return $attributes;
}

/**
 * Remove only real JSON-LD script elements. Comments, textarea/title/style
 * data, ordinary scripts, and quoted attribute contents remain byte-identical.
 */
function justice_ops_maya_profile_release_remove_json_ld_scripts( string $html ): string {
	$length = strlen( $html );
	$cursor = 0;
	$output = '';
	while ( $cursor < $length ) {
		$tag_start = strpos( $html, '<', $cursor );
		if ( false === $tag_start ) {
			$output .= substr( $html, $cursor );
			break;
		}
		$output .= substr( $html, $cursor, $tag_start - $cursor );

		if ( 0 === substr_compare( $html, '<!--', $tag_start, 4 ) ) {
			$comment_end = strpos( $html, '-->', $tag_start + 4 );
			if ( false === $comment_end ) {
				$output .= substr( $html, $tag_start );
				break;
			}
			$output .= substr( $html, $tag_start, $comment_end + 3 - $tag_start );
			$cursor  = $comment_end + 3;
			continue;
		}

		$tag_end = justice_ops_maya_profile_release_tag_end( $html, $tag_start );
		if ( false === $tag_end ) {
			$output .= substr( $html, $tag_start );
			break;
		}
		$tag      = substr( $html, $tag_start, $tag_end + 1 - $tag_start );
		$tag_name = '';
		if ( 1 === preg_match( '#^<([A-Za-z][A-Za-z0-9:_-]*)\b#', $tag, $tag_match ) ) {
			$tag_name = strtolower( $tag_match[1] );
		}
		$cursor = $tag_end + 1;

		if ( in_array( $tag_name, array( 'script', 'style', 'textarea', 'title' ), true ) ) {
			$raw_end = justice_ops_maya_profile_release_raw_closing_tag_position( $html, $tag_name, $cursor );
			if ( false === $raw_end ) {
				$output .= $tag . substr( $html, $cursor );
				break;
			}
			$raw_tag_end = justice_ops_maya_profile_release_tag_end( $html, $raw_end );
			if ( false === $raw_tag_end ) {
				$output .= $tag . substr( $html, $cursor );
				break;
			}

			$attributes = 'script' === $tag_name
				? justice_ops_maya_profile_release_opening_tag_attributes( $tag )
				: array();
			$is_json_ld = isset( $attributes['type'] )
				&& is_string( $attributes['type'] )
				&& 'application/ld+json' === strtolower( trim( $attributes['type'] ) );
			if ( ! $is_json_ld ) {
				$output .= $tag . substr( $html, $cursor, $raw_tag_end + 1 - $cursor );
			}
			$cursor = $raw_tag_end + 1;
			continue;
		}

		$output .= $tag;
	}

	return $output;
}

/**
 * Remove selected attributes from one opening tag without examining bytes
 * inside another attribute's quoted or unquoted value.
 *
 * @param array<string,bool> $attribute_lookup Lowercase attribute names.
 */
function justice_ops_maya_profile_release_strip_opening_tag_attributes( string $tag, array $attribute_lookup ): string {
	if ( 1 !== preg_match( '#^<[A-Za-z][A-Za-z0-9:_-]*#', $tag, $tag_name_match ) ) {
		return $tag;
	}

	$length = strlen( $tag );
	$cursor = strlen( $tag_name_match[0] );
	$output = substr( $tag, 0, $cursor );
	while ( $cursor < $length ) {
		$separator_start = $cursor;
		while ( $cursor < $length && ctype_space( $tag[ $cursor ] ) ) {
			$cursor++;
		}
		$separator = substr( $tag, $separator_start, $cursor - $separator_start );

		if (
			$cursor >= $length
			|| '>' === $tag[ $cursor ]
			|| ( '/' === $tag[ $cursor ] && $cursor + 1 < $length && '>' === $tag[ $cursor + 1 ] )
		) {
			$output .= $separator . substr( $tag, $cursor );
			break;
		}

		$name_start = $cursor;
		while (
			$cursor < $length
			&& ! ctype_space( $tag[ $cursor ] )
			&& ! in_array( $tag[ $cursor ], array( '=', '/', '>' ), true )
		) {
			$cursor++;
		}
		if ( $cursor === $name_start ) {
			// Preserve malformed markup instead of guessing at its boundaries.
			$output .= $separator . substr( $tag, $cursor );
			break;
		}

		$name_end      = $cursor;
		$attribute_end = $name_end;
		$lookahead     = $name_end;
		while ( $lookahead < $length && ctype_space( $tag[ $lookahead ] ) ) {
			$lookahead++;
		}
		if ( $lookahead < $length && '=' === $tag[ $lookahead ] ) {
			$lookahead++;
			while ( $lookahead < $length && ctype_space( $tag[ $lookahead ] ) ) {
				$lookahead++;
			}
			if ( $lookahead < $length && ( '"' === $tag[ $lookahead ] || "'" === $tag[ $lookahead ] ) ) {
				$quote = $tag[ $lookahead ];
				$lookahead++;
				while ( $lookahead < $length && $quote !== $tag[ $lookahead ] ) {
					$lookahead++;
				}
				if ( $lookahead < $length ) {
					$lookahead++;
				}
			} else {
				while ( $lookahead < $length && ! ctype_space( $tag[ $lookahead ] ) && '>' !== $tag[ $lookahead ] ) {
					$lookahead++;
				}
			}
			$attribute_end = $lookahead;
		}

		$attribute_name = strtolower( substr( $tag, $name_start, $name_end - $name_start ) );
		if ( ! isset( $attribute_lookup[ $attribute_name ] ) ) {
			$output .= $separator . substr( $tag, $name_start, $attribute_end - $name_start );
		}
		$cursor = $attribute_end;
	}

	return $output;
}

/**
 * Remove an allowlisted set of structured-data attributes from actual opening
 * tags only. Comments, visible text, and raw script/style/textarea/title data
 * remain byte-identical.
 *
 * @param array<int,string> $attributes Attribute names.
 */
function justice_ops_maya_profile_release_strip_tag_attributes( string $html, array $attributes ): string {
	if ( array() === $attributes || false === strpos( $html, '<' ) ) {
		return $html;
	}

	$attribute_lookup = array_fill_keys( array_map( 'strtolower', $attributes ), true );
	$length = strlen( $html );
	$cursor = 0;
	$output = '';
	while ( $cursor < $length ) {
		$tag_start = strpos( $html, '<', $cursor );
		if ( false === $tag_start ) {
			$output .= substr( $html, $cursor );
			break;
		}
		$output .= substr( $html, $cursor, $tag_start - $cursor );

		if ( 0 === substr_compare( $html, '<!--', $tag_start, 4 ) ) {
			$comment_end = strpos( $html, '-->', $tag_start + 4 );
			if ( false === $comment_end ) {
				$output .= substr( $html, $tag_start );
				break;
			}
			$output .= substr( $html, $tag_start, $comment_end + 3 - $tag_start );
			$cursor  = $comment_end + 3;
			continue;
		}

		$tag_end = justice_ops_maya_profile_release_tag_end( $html, $tag_start );
		if ( false === $tag_end ) {
			$output .= substr( $html, $tag_start );
			break;
		}

		$tag        = substr( $html, $tag_start, $tag_end + 1 - $tag_start );
		$is_opening = 1 === preg_match( '#^<[A-Za-z][A-Za-z0-9:_-]*\b#', $tag );
		$tag_name    = '';
		if ( $is_opening && 1 === preg_match( '#^<([A-Za-z][A-Za-z0-9:_-]*)\b#', $tag, $tag_match ) ) {
			$tag_name = strtolower( $tag_match[1] );
			$tag      = justice_ops_maya_profile_release_strip_opening_tag_attributes( $tag, $attribute_lookup );
		}

		$output .= $tag;
		$cursor  = $tag_end + 1;

		if (
			in_array( $tag_name, array( 'script', 'style', 'textarea', 'title' ), true )
			&& 1 !== preg_match( '#/\s*>$#', $tag )
		) {
			$raw_end = justice_ops_maya_profile_release_raw_closing_tag_position( $html, $tag_name, $cursor );
			if ( false === $raw_end ) {
				$output .= substr( $html, $cursor );
				break;
			}
			$output .= substr( $html, $cursor, $raw_end - $cursor );
			$cursor  = $raw_end;
		}
	}

	return $output;
}

/**
 * Find one real opening tag while ignoring comments and raw-text element data.
 *
 * @return int|false
 */
function justice_ops_maya_profile_release_opening_tag_position( string $html, string $wanted_tag ) {
	$wanted_tag = strtolower( $wanted_tag );
	$length     = strlen( $html );
	$cursor     = 0;
	while ( $cursor < $length ) {
		$tag_start = strpos( $html, '<', $cursor );
		if ( false === $tag_start ) {
			return false;
		}
		if ( 0 === substr_compare( $html, '<!--', $tag_start, 4 ) ) {
			$comment_end = strpos( $html, '-->', $tag_start + 4 );
			if ( false === $comment_end ) {
				return false;
			}
			$cursor = $comment_end + 3;
			continue;
		}

		$tag_end = justice_ops_maya_profile_release_tag_end( $html, $tag_start );
		if ( false === $tag_end ) {
			return false;
		}
		$tag      = substr( $html, $tag_start, $tag_end + 1 - $tag_start );
		$tag_name = '';
		if ( 1 === preg_match( '#^<([A-Za-z][A-Za-z0-9:_-]*)\b#', $tag, $tag_match ) ) {
			$tag_name = strtolower( $tag_match[1] );
			if ( $wanted_tag === $tag_name ) {
				return $tag_start;
			}
		}
		$cursor = $tag_end + 1;

		if (
			in_array( $tag_name, array( 'script', 'style', 'textarea', 'title' ), true )
			&& 1 !== preg_match( '#/\s*>$#', $tag )
		) {
			$raw_end = justice_ops_maya_profile_release_raw_closing_tag_position( $html, $tag_name, $cursor );
			if ( false === $raw_end ) {
				return false;
			}
			$cursor = $raw_end;
		}
	}

	return false;
}

/**
 * Remove legacy Microdata everywhere and body-level RDFa on the controlled
 * profile. Open Graph property attributes in the head remain untouched.
 */
function justice_ops_maya_profile_release_strip_body_structured_attributes( string $html ): string {
	$html = justice_ops_maya_profile_release_strip_tag_attributes(
		$html,
		array( 'itemscope', 'itemprop', 'itemtype', 'itemid', 'itemref', 'vocab', 'typeof' )
	);

	$body_position = justice_ops_maya_profile_release_opening_tag_position( $html, 'body' );
	if ( false === $body_position ) {
		return $html;
	}

	$head = substr( $html, 0, $body_position );
	$body = substr( $html, $body_position );
	$body = justice_ops_maya_profile_release_strip_tag_attributes(
		$body,
		array( 'property', 'resource', 'prefix', 'about' )
	);

	return $head . $body;
}

/**
 * Final exact-page guard for H1, unsupported attribution, schema, and marker.
 */
function justice_ops_maya_profile_release_filter_html( string $html ): string {
	if ( ! justice_ops_maya_profile_release_is_request() ) {
		return $html;
	}

	$contract               = justice_ops_maya_profile_release_contract();
	$controlled_body_marker = 'data-jt-maya-profile-content="' . $contract['release_marker'] . '"';
	$has_controlled_body    = false !== strpos( $html, $controlled_body_marker );
	$updated                = preg_replace_callback(
		'#(<h1\b[^>]*>)[\s\S]*?(</h1>)#iu',
		static function ( array $match ) use ( $contract ): string {
			return $match[1] . esc_html( $contract['h1'] ) . $match[2];
		},
		$html,
		1
	);
	if ( is_string( $updated ) ) {
		$html = $updated;
	}

	$updated = preg_replace(
		array(
			'#<div\b[^>]*class=["\'][^"\']*\bsingle-article__author\b[^"\']*["\'][^>]*>[\s\S]*?</div>#iu',
			'#<p\b[^>]*class=["\'][^"\']*\beeat-reviewed-footer\b[^"\']*["\'][^>]*>[\s\S]*?</p>#iu',
			'#<section\b[^>]*class=["\'][^"\']*\blegal-pillar-reviewed\b[^"\']*["\'][^>]*>[\s\S]*?</section>#iu',
		),
		'',
		$html
	);
	if ( is_string( $updated ) ) {
		$html = $updated;
	}

	$html = justice_ops_maya_profile_release_strip_body_structured_attributes( $html );
	$html = justice_ops_maya_profile_release_control_schema( $html, $has_controlled_body );

	if ( $has_controlled_body && false === strpos( $html, 'data-jt-maya-profile-release=' ) ) {
		$marked = preg_replace(
			'#<body\b#i',
			'<body data-jt-maya-profile-release="' . esc_attr( $contract['release_marker'] ) . '"',
			$html,
			1
		);
		if ( is_string( $marked ) ) {
			$html = $marked;
		}
	}

	return $html;
}

add_action(
	'template_redirect',
	static function (): void {
		if ( ( function_exists( 'is_admin' ) && is_admin() ) || ! justice_ops_maya_profile_release_is_request() ) {
			return;
		}

		ob_start( 'justice_ops_maya_profile_release_filter_html' );
	},
	-1999999
);

add_action(
	'wp_head',
	static function (): void {
		if ( ! justice_ops_maya_profile_release_is_request() ) {
			return;
		}
		?>
		<style id="justice-maya-profile-release-css">
		.jt-maya-profile__disclosure{display:block;margin:1rem 0 1.4rem;padding:1rem 1.1rem;border:2px solid #9a741b;border-radius:10px;background:#fff8dc;color:#2f2818;line-height:1.65;visibility:visible;opacity:1}
		.jt-maya-profile__disclosure strong{font-weight:800}
		</style>
		<?php
	},
	1000
);

/**
 * Fixed option names for the metadata lock and exact prior-state evidence.
 */
function justice_ops_maya_profile_release_lock_name(): string {
	return 'justice_ops_maya_profile_seo_write_lock';
}

function justice_ops_maya_profile_release_rollback_name(): string {
	return 'justice_ops_maya_profile_seo_rollback_evidence';
}

/**
 * True when an array has exactly the reviewed key set.
 *
 * @param array<mixed>      $value Array under review.
 * @param array<int,string> $keys  Required keys.
 */
function justice_ops_maya_profile_release_exact_keys( array $value, array $keys ): bool {
	$actual = array_keys( $value );
	sort( $actual );
	sort( $keys );

	return $actual === $keys;
}

/**
 * Exact field, existence, cardinality, and digest keys for both Yoast values.
 *
 * @return array<int,string>
 */
function justice_ops_maya_profile_release_seo_state_keys(): array {
	return array(
		'title',
		'description',
		'title_exists',
		'description_exists',
		'title_row_count',
		'description_row_count',
		'title_sha256',
		'description_sha256',
		'state_sha256',
	);
}

/**
 * Hash an exact SEO state after removing its self-referential digest.
 */
function justice_ops_maya_profile_release_seo_state_hash( array $state ): string {
	unset( $state['state_sha256'] );
	$options = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
	$json    = function_exists( 'wp_json_encode' )
		? wp_json_encode( $state, $options )
		: json_encode( $state, $options );

	return is_string( $json ) ? hash( 'sha256', $json ) : '';
}

/**
 * Build a snapshot that distinguishes absent metadata from an empty value.
 * More than one row is represented for diagnosis but rejected for mutation.
 *
 * @param array<int,mixed> $title_rows       Raw title rows.
 * @param array<int,mixed> $description_rows Raw description rows.
 * @return array<string,mixed>
 */
function justice_ops_maya_profile_release_build_seo_state( array $title_rows, array $description_rows ): array {
	$title_rows       = array_values( $title_rows );
	$description_rows = array_values( $description_rows );
	$title            = isset( $title_rows[0] ) ? (string) $title_rows[0] : '';
	$description      = isset( $description_rows[0] ) ? (string) $description_rows[0] : '';
	$state            = array(
		'title'                    => $title,
		'description'              => $description,
		'title_exists'             => 0 < count( $title_rows ),
		'description_exists'       => 0 < count( $description_rows ),
		'title_row_count'          => count( $title_rows ),
		'description_row_count'    => count( $description_rows ),
		'title_sha256'             => hash( 'sha256', $title ),
		'description_sha256'       => hash( 'sha256', $description ),
	);
	$state['state_sha256'] = justice_ops_maya_profile_release_seo_state_hash( $state );

	return $state;
}

/**
 * True only for a complete state with zero or one row per controlled key.
 */
function justice_ops_maya_profile_release_seo_state_is_supported( array $state ): bool {
	if ( ! justice_ops_maya_profile_release_exact_keys( $state, justice_ops_maya_profile_release_seo_state_keys() ) ) {
		return false;
	}
	if (
		! is_string( $state['title'] )
		|| ! is_string( $state['description'] )
		|| ! is_bool( $state['title_exists'] )
		|| ! is_bool( $state['description_exists'] )
		|| ! is_int( $state['title_row_count'] )
		|| ! is_int( $state['description_row_count'] )
		|| ! in_array( $state['title_row_count'], array( 0, 1 ), true )
		|| ! in_array( $state['description_row_count'], array( 0, 1 ), true )
		|| $state['title_exists'] !== ( 1 === $state['title_row_count'] )
		|| $state['description_exists'] !== ( 1 === $state['description_row_count'] )
		|| ( ! $state['title_exists'] && '' !== $state['title'] )
		|| ( ! $state['description_exists'] && '' !== $state['description'] )
	) {
		return false;
	}
	foreach ( array( 'title_sha256', 'description_sha256', 'state_sha256' ) as $hash_key ) {
		if ( ! is_string( $state[ $hash_key ] ) || 1 !== preg_match( '/^[a-f0-9]{64}$/', $state[ $hash_key ] ) ) {
			return false;
		}
	}

	return hash_equals( hash( 'sha256', $state['title'] ), $state['title_sha256'] )
		&& hash_equals( hash( 'sha256', $state['description'] ), $state['description_sha256'] )
		&& hash_equals( justice_ops_maya_profile_release_seo_state_hash( $state ), $state['state_sha256'] );
}

/**
 * Exact reviewed target state: one row per controlled key.
 *
 * @return array<string,mixed>
 */
function justice_ops_maya_profile_release_target_seo_state(): array {
	$contract = justice_ops_maya_profile_release_contract();

	return justice_ops_maya_profile_release_build_seo_state(
		array( $contract['seo_title'] ),
		array( $contract['description'] )
	);
}

/**
 * Hash evidence with stable JSON after removing the self-referential digest.
 */
function justice_ops_maya_profile_release_evidence_hash( array $evidence ): string {
	unset( $evidence['evidence_sha256'] );
	$options = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES;
	$json    = function_exists( 'wp_json_encode' )
		? wp_json_encode( $evidence, $options )
		: json_encode( $evidence, $options );

	return is_string( $json ) ? hash( 'sha256', $json ) : '';
}

/**
 * Build the durable evidence record before the first forward metadata write.
 *
 * @param array<string,mixed> $prior Prior stored metadata state.
 * @return array<string,mixed>
 */
function justice_ops_maya_profile_release_build_evidence( WP_Post $post, array $prior, string $token ): array {
	$contract = justice_ops_maya_profile_release_contract();
	$evidence = array(
		'schema_version' => 1,
		'kind'           => 'maya-profile-seo-exact-prior-state',
		'token'          => $token,
		'post_id'        => $contract['post_id'],
		'post_type'      => $contract['post_type'],
		'slug'           => $contract['slug'],
		'canonical'      => $contract['canonical'],
		'modified_gmt'   => (string) $post->post_modified_gmt,
		'release_marker' => $contract['release_marker'],
		'created_at_gmt' => gmdate( 'c' ),
		'prior'          => $prior,
		'target'         => justice_ops_maya_profile_release_target_seo_state(),
	);
	$evidence['evidence_sha256'] = justice_ops_maya_profile_release_evidence_hash( $evidence );

	return $evidence;
}

/**
 * Validate durable rollback evidence before exposing or acting on it.
 *
 * @param mixed $value Stored option value.
 * @return array<string,mixed>|WP_Error|null
 */
function justice_ops_maya_profile_release_validate_evidence( $value ) {
	if ( null === $value || false === $value ) {
		return null;
	}
	$top_keys = array(
		'schema_version',
		'kind',
		'token',
		'post_id',
		'post_type',
		'slug',
		'canonical',
		'modified_gmt',
		'release_marker',
		'created_at_gmt',
		'prior',
		'target',
		'evidence_sha256',
	);
	if ( ! is_array( $value ) || ! justice_ops_maya_profile_release_exact_keys( $value, $top_keys ) ) {
		return new WP_Error( 'maya_profile_rollback_evidence_invalid', 'Stored rollback evidence has an invalid shape.', array( 'status' => 500 ) );
	}

	$contract = justice_ops_maya_profile_release_contract();
	if (
		1 !== $value['schema_version']
		|| 'maya-profile-seo-exact-prior-state' !== $value['kind']
		|| (int) $contract['post_id'] !== (int) $value['post_id']
		|| $contract['post_type'] !== $value['post_type']
		|| $contract['slug'] !== $value['slug']
		|| $contract['canonical'] !== $value['canonical']
		|| $contract['release_marker'] !== $value['release_marker']
		|| ! is_string( $value['modified_gmt'] )
		|| '' === $value['modified_gmt']
		|| ! is_string( $value['created_at_gmt'] )
		|| '' === $value['created_at_gmt']
		|| ! is_string( $value['token'] )
		|| 1 !== preg_match( '/^[a-f0-9-]{36}$/i', $value['token'] )
	) {
		return new WP_Error( 'maya_profile_rollback_evidence_invalid', 'Stored rollback evidence is not bound to the controlled record.', array( 'status' => 500 ) );
	}

	if (
		! is_array( $value['prior'] )
		|| ! is_array( $value['target'] )
		|| ! justice_ops_maya_profile_release_seo_state_is_supported( $value['prior'] )
		|| ! justice_ops_maya_profile_release_seo_state_is_supported( $value['target'] )
	) {
		return new WP_Error( 'maya_profile_rollback_evidence_invalid', 'Stored rollback evidence fields are invalid.', array( 'status' => 500 ) );
	}

	foreach ( array( $value['evidence_sha256'] ) as $digest ) {
		if ( ! is_string( $digest ) || 1 !== preg_match( '/^[a-f0-9]{64}$/', $digest ) ) {
			return new WP_Error( 'maya_profile_rollback_evidence_invalid', 'Stored rollback evidence contains an invalid digest.', array( 'status' => 500 ) );
		}
	}
	if (
		! hash_equals( justice_ops_maya_profile_release_target_seo_state()['state_sha256'], $value['target']['state_sha256'] )
		|| ! hash_equals( justice_ops_maya_profile_release_evidence_hash( $value ), $value['evidence_sha256'] )
	) {
		return new WP_Error( 'maya_profile_rollback_evidence_invalid', 'Stored rollback evidence failed exact hash validation.', array( 'status' => 500 ) );
	}

	return $value;
}

/**
 * Read and validate any durable successful-write rollback evidence.
 *
 * @return array<string,mixed>|WP_Error|null
 */
function justice_ops_maya_profile_release_rollback_evidence() {
	return justice_ops_maya_profile_release_validate_evidence(
		get_option( justice_ops_maya_profile_release_rollback_name(), null )
	);
}

/**
 * Acquire and release the exact metadata operation lock.
 *
 * @return string|WP_Error
 */
function justice_ops_maya_profile_release_acquire_lock() {
	$lock_name  = justice_ops_maya_profile_release_lock_name();
	$lock_token = wp_generate_uuid4();
	$existing   = get_option( $lock_name, null );
	if ( is_array( $existing ) && isset( $existing['expires_at'] ) && (int) $existing['expires_at'] < time() ) {
		delete_option( $lock_name );
	}
	if ( ! add_option( $lock_name, array( 'token' => $lock_token, 'expires_at' => time() + 120 ), '', 'no' ) ) {
		return new WP_Error( 'maya_profile_locked', 'Another Maya profile metadata operation is active.', array( 'status' => 409 ) );
	}

	return $lock_token;
}

function justice_ops_maya_profile_release_release_lock( string $lock_token ): void {
	$lock_name = justice_ops_maya_profile_release_lock_name();
	$held      = get_option( $lock_name, null );
	if ( is_array( $held ) && isset( $held['token'] ) && hash_equals( $lock_token, (string) $held['token'] ) ) {
		delete_option( $lock_name );
	}
}

/**
 * Read the two approved stored Yoast fields for the exact record.
 *
 * @return array<string,mixed>
 */
function justice_ops_maya_profile_release_stored_seo(): array {
	$contract         = justice_ops_maya_profile_release_contract();
	$title_rows       = get_post_meta( $contract['post_id'], '_yoast_wpseo_title', false );
	$description_rows = get_post_meta( $contract['post_id'], '_yoast_wpseo_metadesc', false );

	return justice_ops_maya_profile_release_build_seo_state(
		is_array( $title_rows ) ? $title_rows : array(),
		is_array( $description_rows ) ? $description_rows : array()
	);
}

/**
 * Confirm the immutable WordPress identity before any stored-meta operation.
 *
 * @return true|WP_Error
 */
function justice_ops_maya_profile_release_validate_record() {
	$contract = justice_ops_maya_profile_release_contract();
	$post     = get_post( $contract['post_id'] );

	if ( ! ( $post instanceof WP_Post ) ) {
		return new WP_Error( 'maya_profile_missing', 'The controlled Maya profile record does not exist.', array( 'status' => 409 ) );
	}

	if (
		(int) $contract['post_id'] !== (int) $post->ID
		|| $contract['post_type'] !== $post->post_type
		|| $contract['slug'] !== $post->post_name
		|| 'publish' !== $post->post_status
	) {
		return new WP_Error( 'maya_profile_identity_mismatch', 'The controlled Maya profile identity changed.', array( 'status' => 409 ) );
	}

	if ( function_exists( 'get_permalink' ) && $contract['canonical'] !== (string) get_permalink( $post ) ) {
		return new WP_Error( 'maya_profile_url_mismatch', 'The controlled Maya profile URL changed.', array( 'status' => 409 ) );
	}

	return true;
}

/**
 * Admin-only readback for deterministic CAS planning.
 */
function justice_ops_maya_profile_release_rest_get() {
	$valid = justice_ops_maya_profile_release_validate_record();
	if ( is_wp_error( $valid ) ) {
		return $valid;
	}
	$rollback = justice_ops_maya_profile_release_rollback_evidence();
	if ( is_wp_error( $rollback ) ) {
		return $rollback;
	}

	$contract = justice_ops_maya_profile_release_contract();
	$post     = get_post( $contract['post_id'] );

	return rest_ensure_response(
		array(
			'post_id'      => $contract['post_id'],
			'slug'         => $contract['slug'],
			'modified_gmt' => (string) $post->post_modified_gmt,
			'current'      => justice_ops_maya_profile_release_stored_seo(),
			'target'       => justice_ops_maya_profile_release_target_seo_state(),
			'rollback'     => $rollback,
		)
	);
}

/**
 * True when one field in a complete state equals the same field in another.
 *
 * @param array<string,mixed> $left  First complete state.
 * @param array<string,mixed> $right Second complete state.
 */
function justice_ops_maya_profile_release_seo_field_matches( array $left, array $right, string $field ): bool {
	return $left[ $field ] === $right[ $field ]
		&& $left[ $field . '_exists' ] === $right[ $field . '_exists' ]
		&& $left[ $field . '_row_count' ] === $right[ $field . '_row_count' ]
		&& hash_equals( $left[ $field . '_sha256' ], $right[ $field . '_sha256' ] );
}

/**
 * True when one field is represented by no metadata row.
 *
 * @param array<string,mixed> $state Complete state.
 */
function justice_ops_maya_profile_release_seo_field_is_absent( array $state, string $field ): bool {
	return false === $state[ $field . '_exists' ]
		&& 0 === $state[ $field . '_row_count' ]
		&& '' === $state[ $field ];
}

/**
 * Move one metadata field to an exact target. The current field may equal the
 * source, target, or the absent intermediate produced while replacing an
 * existing empty value through WordPress metadata APIs.
 *
 * @param array<string,mixed> $from Expected source state.
 * @param array<string,mixed> $to   Desired state.
 */
function justice_ops_maya_profile_release_transition_seo_field( array $from, array $to, string $field, string $meta_key ): bool {
	$contract = justice_ops_maya_profile_release_contract();
	$current  = justice_ops_maya_profile_release_stored_seo();
	if ( ! justice_ops_maya_profile_release_seo_state_is_supported( $current ) ) {
		return false;
	}
	if ( justice_ops_maya_profile_release_seo_field_matches( $current, $to, $field ) ) {
		return true;
	}

	$recoverable_absent = justice_ops_maya_profile_release_seo_field_is_absent( $current, $field )
		&& $from[ $field . '_exists' ]
		&& $to[ $field . '_exists' ]
		&& ( '' === $from[ $field ] || '' === $to[ $field ] );
	if ( ! $recoverable_absent && ! justice_ops_maya_profile_release_seo_field_matches( $current, $from, $field ) ) {
		return false;
	}

	$from_exists = $current[ $field . '_exists' ];
	$to_exists   = $to[ $field . '_exists' ];
	if ( ! $from_exists && ! $to_exists ) {
		return true;
	}
	if ( ! $from_exists && $to_exists ) {
		add_post_meta( $contract['post_id'], $meta_key, $to[ $field ], true );
	} elseif ( $from_exists && ! $to_exists ) {
		delete_post_meta( $contract['post_id'], $meta_key, $current[ $field ] );
	} elseif ( '' === $current[ $field ] && '' !== $to[ $field ] ) {
		// update_post_meta() cannot compare-and-set an existing empty value.
		if ( ! delete_post_meta( $contract['post_id'], $meta_key, '' ) ) {
			return false;
		}
		add_post_meta( $contract['post_id'], $meta_key, $to[ $field ], true );
	} else {
		update_post_meta( $contract['post_id'], $meta_key, $to[ $field ], $current[ $field ] );
	}

	$readback = justice_ops_maya_profile_release_stored_seo();

	return justice_ops_maya_profile_release_seo_state_is_supported( $readback )
		&& justice_ops_maya_profile_release_seo_field_matches( $readback, $to, $field );
}

/**
 * Move both fields between exact states with field-level crash recovery.
 * A field already at the desired value is left untouched.
 *
 * @param array<string,mixed> $from Expected source state.
 * @param array<string,mixed> $to   Desired state.
 */
function justice_ops_maya_profile_release_transition_stored_seo( array $from, array $to ): bool {
	if (
		! justice_ops_maya_profile_release_seo_state_is_supported( $from )
		|| ! justice_ops_maya_profile_release_seo_state_is_supported( $to )
	) {
		return false;
	}
	$mapping = array(
		'title'       => '_yoast_wpseo_title',
		'description' => '_yoast_wpseo_metadesc',
	);
	foreach ( $mapping as $field => $meta_key ) {
		if ( ! justice_ops_maya_profile_release_transition_seo_field( $from, $to, $field, $meta_key ) ) {
			return false;
		}
	}
	$readback = justice_ops_maya_profile_release_stored_seo();

	return justice_ops_maya_profile_release_seo_state_is_supported( $readback )
		&& hash_equals( $to['state_sha256'], $readback['state_sha256'] );
}

/**
 * Restore both prior fields after a failed forward two-field update.
 *
 * @param array<string,mixed> $prior Exact prior state.
 */
function justice_ops_maya_profile_release_restore_stored_seo( array $prior ): bool {

	return justice_ops_maya_profile_release_transition_stored_seo(
		justice_ops_maya_profile_release_target_seo_state(),
		$prior
	);
}

/**
 * Write only the two contract values, with identity, modified-time, hash,
 * locking, exact readback, and compensating rollback guards.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function justice_ops_maya_profile_release_rest_update( WP_REST_Request $request ) {
	$valid = justice_ops_maya_profile_release_validate_record();
	if ( is_wp_error( $valid ) ) {
		return $valid;
	}

	$params   = $request->get_json_params();
	$expected = is_array( $params ) && justice_ops_maya_profile_release_exact_keys( $params, array( 'expected' ) ) && isset( $params['expected'] ) && is_array( $params['expected'] ) ? $params['expected'] : array();
	if ( ! justice_ops_maya_profile_release_exact_keys( $expected, array( 'modified_gmt', 'state_sha256' ) ) ) {
		return new WP_Error( 'maya_profile_expected_state_required', 'Exact expected state is required.', array( 'status' => 400 ) );
	}
	foreach ( array( 'modified_gmt', 'state_sha256' ) as $required ) {
		if ( ! isset( $expected[ $required ] ) || ! is_string( $expected[ $required ] ) || '' === $expected[ $required ] ) {
			return new WP_Error( 'maya_profile_expected_state_required', 'Exact expected state is required.', array( 'status' => 400 ) );
		}
	}

	if ( 1 !== preg_match( '/^[a-f0-9]{64}$/', $expected['state_sha256'] ) ) {
		return new WP_Error( 'maya_profile_invalid_hash', 'Expected state hash must be a lowercase SHA-256 value.', array( 'status' => 400 ) );
	}

	$lock_token = justice_ops_maya_profile_release_acquire_lock();
	if ( is_wp_error( $lock_token ) ) {
		return $lock_token;
	}

	try {
		$contract = justice_ops_maya_profile_release_contract();
		$post     = get_post( $contract['post_id'] );
		$current  = justice_ops_maya_profile_release_stored_seo();
		if ( ! justice_ops_maya_profile_release_seo_state_is_supported( $current ) ) {
			return new WP_Error( 'maya_profile_metadata_cardinality_invalid', 'Each controlled Yoast key must have zero or one metadata row.', array( 'status' => 409 ) );
		}

		if (
			$expected['modified_gmt'] !== (string) $post->post_modified_gmt
			|| ! hash_equals( $expected['state_sha256'], $current['state_sha256'] )
		) {
			return new WP_Error( 'maya_profile_state_conflict', 'The Maya profile changed after planning. Refresh before writing.', array( 'status' => 409 ) );
		}

		$target  = justice_ops_maya_profile_release_target_seo_state();
		$pending = justice_ops_maya_profile_release_rollback_evidence();
		if ( is_wp_error( $pending ) ) {
			return $pending;
		}

		if ( hash_equals( $current['state_sha256'], $target['state_sha256'] ) ) {
			return rest_ensure_response(
				array(
					'updated'      => false,
					'post_id'      => $contract['post_id'],
					'modified_gmt' => (string) $post->post_modified_gmt,
					'current'      => $current,
					'rollback'     => $pending,
				)
			);
		}
		if ( is_array( $pending ) ) {
			return new WP_Error( 'maya_profile_rollback_pending', 'A prior successful-write rollback record must be resolved before another metadata write.', array( 'status' => 409 ) );
		}

		$evidence_token = wp_generate_uuid4();
		$evidence       = justice_ops_maya_profile_release_build_evidence(
			$post,
			$current,
			$evidence_token
		);
		if ( '' === $evidence['evidence_sha256'] || ! add_option( justice_ops_maya_profile_release_rollback_name(), $evidence, '', 'no' ) ) {
			return new WP_Error( 'maya_profile_rollback_evidence_write_failed', 'Exact prior-state evidence could not be persisted before the metadata write.', array( 'status' => 500 ) );
		}

		$updated  = justice_ops_maya_profile_release_transition_stored_seo( $current, $target );
		$readback = justice_ops_maya_profile_release_stored_seo();
		if ( ! $updated || ! hash_equals( $target['state_sha256'], $readback['state_sha256'] ) ) {
			$rolled_back = justice_ops_maya_profile_release_restore_stored_seo( $current );
			if ( $rolled_back ) {
				delete_option( justice_ops_maya_profile_release_rollback_name() );
			}
			return new WP_Error(
				$rolled_back ? 'maya_profile_write_failed' : 'maya_profile_rollback_failed',
				$rolled_back ? 'Stored metadata readback failed and the prior values were restored.' : 'Stored metadata readback and rollback both failed.',
				array(
					'status'          => 500,
					'evidence_sha256' => $evidence['evidence_sha256'],
				)
			);
		}

		return rest_ensure_response(
			array(
				'updated'      => true,
				'post_id'      => $contract['post_id'],
				'modified_gmt' => (string) $post->post_modified_gmt,
				'current'      => $readback,
				'rollback'     => $evidence,
			)
		);
	} finally {
		justice_ops_maya_profile_release_release_lock( $lock_token );
	}
}

/**
 * Restore the exact successful-write prior state using only server-held
 * evidence, an exact token, and hashes for both current and prior values.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function justice_ops_maya_profile_release_rest_rollback( WP_REST_Request $request ) {
	$valid = justice_ops_maya_profile_release_validate_record();
	if ( is_wp_error( $valid ) ) {
		return $valid;
	}

	$params        = $request->get_json_params();
	$expected_keys = array( 'modified_gmt', 'current_state_sha256', 'prior_state_sha256' );
	if (
		! is_array( $params )
		|| ! justice_ops_maya_profile_release_exact_keys( $params, array( 'token', 'evidence_sha256', 'expected' ) )
		|| ! isset( $params['token'], $params['evidence_sha256'], $params['expected'] )
		|| ! is_string( $params['token'] )
		|| ! is_string( $params['evidence_sha256'] )
		|| ! is_array( $params['expected'] )
		|| ! justice_ops_maya_profile_release_exact_keys( $params['expected'], $expected_keys )
	) {
		return new WP_Error( 'maya_profile_rollback_request_invalid', 'Exact rollback token, evidence digest, and expected states are required.', array( 'status' => 400 ) );
	}
	$expected = $params['expected'];
	if (
		1 !== preg_match( '/^[a-f0-9-]{36}$/i', $params['token'] )
		|| 1 !== preg_match( '/^[a-f0-9]{64}$/', $params['evidence_sha256'] )
		|| ! is_string( $expected['modified_gmt'] )
		|| '' === $expected['modified_gmt']
	) {
		return new WP_Error( 'maya_profile_rollback_request_invalid', 'Rollback identity or modified time is invalid.', array( 'status' => 400 ) );
	}
	foreach ( array( 'current_state_sha256', 'prior_state_sha256' ) as $hash_key ) {
		if ( ! is_string( $expected[ $hash_key ] ) || 1 !== preg_match( '/^[a-f0-9]{64}$/', $expected[ $hash_key ] ) ) {
			return new WP_Error( 'maya_profile_rollback_request_invalid', 'Rollback hashes must be lowercase SHA-256 values.', array( 'status' => 400 ) );
		}
	}

	$lock_token = justice_ops_maya_profile_release_acquire_lock();
	if ( is_wp_error( $lock_token ) ) {
		return $lock_token;
	}

	try {
		$evidence = justice_ops_maya_profile_release_rollback_evidence();
		if ( is_wp_error( $evidence ) ) {
			return $evidence;
		}
		if ( ! is_array( $evidence ) ) {
			return new WP_Error( 'maya_profile_rollback_evidence_missing', 'No successful-write rollback evidence exists.', array( 'status' => 409 ) );
		}
		if (
			! hash_equals( $evidence['token'], $params['token'] )
			|| ! hash_equals( $evidence['evidence_sha256'], $params['evidence_sha256'] )
			|| ! hash_equals( $evidence['prior']['state_sha256'], $expected['prior_state_sha256'] )
		) {
			return new WP_Error( 'maya_profile_rollback_evidence_mismatch', 'Rollback request does not match the exact successful-write evidence.', array( 'status' => 409 ) );
		}

		$contract = justice_ops_maya_profile_release_contract();
		$post     = get_post( $contract['post_id'] );
		$current  = justice_ops_maya_profile_release_stored_seo();
		if ( ! justice_ops_maya_profile_release_seo_state_is_supported( $current ) ) {
			return new WP_Error( 'maya_profile_rollback_state_conflict', 'Current metadata has unsupported cardinality.', array( 'status' => 409 ) );
		}
		if (
			$evidence['modified_gmt'] !== (string) $post->post_modified_gmt
			|| $expected['modified_gmt'] !== (string) $post->post_modified_gmt
			|| ! hash_equals( $expected['current_state_sha256'], $current['state_sha256'] )
		) {
			return new WP_Error( 'maya_profile_rollback_state_conflict', 'Current metadata or post state no longer matches the successful write.', array( 'status' => 409 ) );
		}

		$target = $evidence['target'];
		$prior  = $evidence['prior'];
		foreach ( array( 'title', 'description' ) as $field ) {
			if (
				! justice_ops_maya_profile_release_seo_field_matches( $current, $target, $field )
				&& ! justice_ops_maya_profile_release_seo_field_matches( $current, $prior, $field )
				&& ! (
					justice_ops_maya_profile_release_seo_field_is_absent( $current, $field )
					&& $target[ $field . '_exists' ]
					&& $prior[ $field . '_exists' ]
					&& ( '' === $target[ $field ] || '' === $prior[ $field ] )
				)
			) {
				return new WP_Error( 'maya_profile_rollback_state_conflict', 'Current metadata is outside the exact prior-to-target transition.', array( 'status' => 409 ) );
			}
		}
		if ( ! justice_ops_maya_profile_release_transition_stored_seo( $target, $prior ) ) {
			$forward_restored = justice_ops_maya_profile_release_transition_stored_seo( $prior, $target );
			return new WP_Error(
				$forward_restored ? 'maya_profile_rollback_write_failed' : 'maya_profile_rollback_recovery_failed',
				$forward_restored ? 'Rollback write failed and the reviewed forward values were restored.' : 'Rollback write and forward-state recovery both failed.',
				array(
					'status'          => 500,
					'evidence_sha256' => $evidence['evidence_sha256'],
				)
			);
		}

		$readback = justice_ops_maya_profile_release_stored_seo();
		if ( ! delete_option( justice_ops_maya_profile_release_rollback_name() ) ) {
			return new WP_Error(
				'maya_profile_rollback_evidence_cleanup_failed',
				'Prior metadata was restored but the consumed rollback evidence could not be removed.',
				array(
					'status'          => 500,
					'rolled_back'     => true,
					'evidence_sha256' => $evidence['evidence_sha256'],
				)
			);
		}

		return rest_ensure_response(
			array(
				'rolled_back'      => true,
				'post_id'          => $contract['post_id'],
				'modified_gmt'     => (string) $post->post_modified_gmt,
				'current'          => $readback,
				'evidence_sha256'  => $evidence['evidence_sha256'],
				'evidence_consumed'=> true,
			)
		);
	} finally {
		justice_ops_maya_profile_release_release_lock( $lock_token );
	}
}

/**
 * Consume successful-write rollback evidence after independent acceptance.
 * This does not change metadata. It finalizes only the exact reviewed target
 * state bound to the server-held evidence and current post revision.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response|WP_Error
 */
function justice_ops_maya_profile_release_rest_finalize( WP_REST_Request $request ) {
	$valid = justice_ops_maya_profile_release_validate_record();
	if ( is_wp_error( $valid ) ) {
		return $valid;
	}

	$params        = $request->get_json_params();
	$expected_keys = array( 'modified_gmt', 'current_state_sha256' );
	if (
		! is_array( $params )
		|| ! justice_ops_maya_profile_release_exact_keys( $params, array( 'post_id', 'token', 'evidence_sha256', 'expected' ) )
		|| ! isset( $params['post_id'], $params['token'], $params['evidence_sha256'], $params['expected'] )
		|| ! is_int( $params['post_id'] )
		|| ! is_string( $params['token'] )
		|| ! is_string( $params['evidence_sha256'] )
		|| ! is_array( $params['expected'] )
		|| ! justice_ops_maya_profile_release_exact_keys( $params['expected'], $expected_keys )
	) {
		return new WP_Error( 'maya_profile_finalize_request_invalid', 'Exact post, evidence identity, and expected target state are required.', array( 'status' => 400 ) );
	}
	$expected = $params['expected'];
	$contract = justice_ops_maya_profile_release_contract();
	if (
		$params['post_id'] !== $contract['post_id']
		|| 1 !== preg_match( '/^[a-f0-9-]{36}$/i', $params['token'] )
		|| 1 !== preg_match( '/^[a-f0-9]{64}$/', $params['evidence_sha256'] )
		|| ! isset( $expected['modified_gmt'], $expected['current_state_sha256'] )
		|| ! is_string( $expected['modified_gmt'] )
		|| '' === $expected['modified_gmt']
		|| ! is_string( $expected['current_state_sha256'] )
		|| 1 !== preg_match( '/^[a-f0-9]{64}$/', $expected['current_state_sha256'] )
	) {
		return new WP_Error( 'maya_profile_finalize_request_invalid', 'Finalize identity, modified time, or target hash is invalid.', array( 'status' => 400 ) );
	}

	$lock_token = justice_ops_maya_profile_release_acquire_lock();
	if ( is_wp_error( $lock_token ) ) {
		return $lock_token;
	}

	try {
		$valid = justice_ops_maya_profile_release_validate_record();
		if ( is_wp_error( $valid ) ) {
			return $valid;
		}
		$evidence = justice_ops_maya_profile_release_rollback_evidence();
		if ( is_wp_error( $evidence ) ) {
			return $evidence;
		}
		if ( ! is_array( $evidence ) ) {
			return new WP_Error( 'maya_profile_finalize_evidence_missing', 'No successful-write rollback evidence exists.', array( 'status' => 409 ) );
		}
		if (
			$params['post_id'] !== $evidence['post_id']
			|| ! hash_equals( $evidence['token'], $params['token'] )
			|| ! hash_equals( $evidence['evidence_sha256'], $params['evidence_sha256'] )
			|| ! hash_equals( $evidence['target']['state_sha256'], $expected['current_state_sha256'] )
		) {
			return new WP_Error( 'maya_profile_finalize_evidence_mismatch', 'Finalize request does not match the exact successful-write evidence.', array( 'status' => 409 ) );
		}

		$post    = get_post( $contract['post_id'] );
		$current = justice_ops_maya_profile_release_stored_seo();
		if (
			! justice_ops_maya_profile_release_seo_state_is_supported( $current )
			|| $evidence['modified_gmt'] !== (string) $post->post_modified_gmt
			|| $expected['modified_gmt'] !== (string) $post->post_modified_gmt
			|| ! hash_equals( $expected['current_state_sha256'], $current['state_sha256'] )
		) {
			return new WP_Error( 'maya_profile_finalize_state_conflict', 'Current metadata or post state no longer matches the accepted target.', array( 'status' => 409 ) );
		}

		if ( ! delete_option( justice_ops_maya_profile_release_rollback_name() ) ) {
			return new WP_Error(
				'maya_profile_finalize_evidence_cleanup_failed',
				'Accepted metadata was unchanged but rollback evidence could not be finalized.',
				array(
					'status'          => 500,
					'evidence_sha256' => $evidence['evidence_sha256'],
				)
			);
		}
		if ( null !== get_option( justice_ops_maya_profile_release_rollback_name(), null ) ) {
			return new WP_Error(
				'maya_profile_finalize_evidence_cleanup_failed',
				'Rollback evidence still exists after finalization.',
				array(
					'status'          => 500,
					'evidence_sha256' => $evidence['evidence_sha256'],
				)
			);
		}

		return rest_ensure_response(
			array(
				'finalized'         => true,
				'post_id'           => $contract['post_id'],
				'modified_gmt'      => (string) $post->post_modified_gmt,
				'current'           => $current,
				'evidence_sha256'   => $evidence['evidence_sha256'],
				'evidence_consumed' => true,
			)
		);
	} finally {
		justice_ops_maya_profile_release_release_lock( $lock_token );
	}
}

add_action(
	'rest_api_init',
	static function (): void {
		$permission = static function (): bool {
			return current_user_can( 'edit_post', justice_ops_maya_profile_release_contract()['post_id'] );
		};

		register_rest_route(
			'justice-ops/v1',
			'/maya-profile-seo',
			array(
				array(
					'methods'             => 'GET',
					'permission_callback' => $permission,
					'callback'            => 'justice_ops_maya_profile_release_rest_get',
				),
				array(
					'methods'             => 'POST',
					'permission_callback' => $permission,
					'callback'            => 'justice_ops_maya_profile_release_rest_update',
				),
			)
		);
		register_rest_route(
			'justice-ops/v1',
			'/maya-profile-seo-rollback',
			array(
				'methods'             => 'POST',
				'permission_callback' => $permission,
				'callback'            => 'justice_ops_maya_profile_release_rest_rollback',
			)
		);
		register_rest_route(
			'justice-ops/v1',
			'/maya-profile-seo-finalize',
			array(
				'methods'             => 'POST',
				'permission_callback' => $permission,
				'callback'            => 'justice_ops_maya_profile_release_rest_finalize',
			)
		);
	}
);
