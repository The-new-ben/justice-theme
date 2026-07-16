<?php
/**
 * Legal news engine for jus-tice.co.il.
 *
 * Watches Israeli news feeds hourly, routes items into the site's legal
 * families by keyword, and writes sourced, value-add news briefs with the
 * best available model. Every brief attributes and links its source
 * (nofollow), adds the legal context and practical meaning the source does
 * not have, links the family's money pillar and recent related articles,
 * and offers ONLY curated official government links. Publishing is capped
 * per day with a minimum gap so the cadence reads like an editorial desk.
 *
 * Owner controls: wp-admin -> Justice News (pause, caps, model, sources,
 * families, live log, spend estimate) and GET /justice-ops/v1/news-status.
 *
 * The theme already renders the homepage news band from the legal-news
 * category and prints NewsArticle schema with the source as citation; this
 * engine feeds that proven surface and adds the Google News sitemap at
 * /news-sitemap.xml (48 hour window per Google's spec).
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

function justice_news_default_sources(): array {
	return array(
		array( 'key' => 'lawcoil', 'name' => 'law.co.il', 'url' => 'https://www.law.co.il/rss/news/', 'enabled' => 1 ),
		array( 'key' => 'ynet', 'name' => 'ynet', 'url' => 'https://www.ynet.co.il/Integration/StoryRss2.xml', 'enabled' => 1 ),
		array( 'key' => 'globes', 'name' => 'גלובס', 'url' => 'https://www.globes.co.il/webservice/rss/rssfeeder.asmx/FeederNode?iID=829', 'enabled' => 1 ),
		array( 'key' => 'calcalist', 'name' => 'כלכליסט', 'url' => 'https://www.calcalist.co.il/GeneralRSS/0,16335,L-3772,00.xml', 'enabled' => 1 ),
	);
}

function justice_news_sources(): array {
	$saved = get_option( 'justice_news_sources', null );

	return is_array( $saved ) && $saved ? $saved : justice_news_default_sources();
}

/**
 * Family router: keyword sets mapped to the site's money families.
 */
function justice_news_families(): array {
	return array(
		'criminal'    => array( 'label' => 'פלילי', 'keywords' => array( 'פלילי', 'מעצר', 'כתב אישום', 'משטרה', 'חקירה', 'הרשעה', 'עבירה', 'שוחד', 'מרמה', 'סמים', 'רצח', 'תקיפה', 'פרקליטות' ), 'pillar' => '/criminal-defense-attorney/', 'pillar_anchor' => 'עורך דין פלילי' ),
		'family'      => array( 'label' => 'משפחה', 'keywords' => array( 'גירושין', 'מזונות', 'משמורת', 'בית הדין הרבני', 'ענייני משפחה', 'הסכם ממון', 'אפוטרופ' ), 'pillar' => '/divorce-lawyer/', 'pillar_anchor' => 'עורך דין גירושין' ),
		'real-estate' => array( 'label' => 'נדל"ן', 'keywords' => array( 'נדל"ן', 'מקרקעין', 'דירה', 'דירות', 'מס רכישה', 'מס שבח', 'תכנון ובנייה', 'קבלן', 'שכירות', 'התחדשות עירונית' ), 'pillar' => '/real-estate-attorney/', 'pillar_anchor' => 'עורך דין מקרקעין' ),
		'labor'       => array( 'label' => 'עבודה', 'keywords' => array( 'עובד', 'מעסיק', 'פיטורים', 'שכר', 'בית הדין לעבודה', 'הטרדה מינית', 'זכויות עובדים' ), 'pillar' => '/labor-lawyer/', 'pillar_anchor' => 'עורך דין דיני עבודה' ),
		'tax-business' => array( 'label' => 'מס ועסקים', 'keywords' => array( 'רשות המסים', 'מס הכנסה', 'מע"מ', 'חברה', 'חברות', 'הייטק', 'השקעה', 'משקיעים', 'חדלות פירעון', 'הוצאה לפועל' ), 'pillar' => '/types-of-lawyers-small-business/', 'pillar_anchor' => 'עורך דין לעסקים' ),
		'supreme'     => array( 'label' => 'בתי משפט', 'keywords' => array( 'בג"ץ', 'בית המשפט העליון', 'פסק דין', 'עתירה', 'שופט', 'שופטת', 'הרשות השופטת' ), 'pillar' => '/criminal-defense-attorney/', 'pillar_anchor' => 'עורך דין פלילי' ),
	);
}

/**
 * Curated official links per family. The writer may link ONLY from here;
 * every URL is a stable government or court address.
 */
function justice_news_gov_links(): array {
	return array(
		'criminal'    => array(
			array( 'הנפקת תעודת יושר באתר השירותים הממשלתי', 'https://www.gov.il/he/service/police_certificate' ),
			array( 'אתר הרשות השופטת', 'https://www.court.gov.il' ),
		),
		'family'      => array(
			array( 'בתי הדין הרבניים', 'https://www.gov.il/he/departments/rabbinical_courts' ),
			array( 'אתר הרשות השופטת', 'https://www.court.gov.il' ),
		),
		'real-estate' => array(
			array( 'הזמנת נסח טאבו רשמי', 'https://www.gov.il/he/service/land_registration_extract' ),
			array( 'רשות מקרקעי ישראל', 'https://land.gov.il' ),
		),
		'labor'       => array(
			array( 'המוסד לביטוח לאומי', 'https://www.btl.gov.il' ),
			array( 'אתר הרשות השופטת', 'https://www.court.gov.il' ),
		),
		'tax-business' => array(
			array( 'רשות המסים בישראל', 'https://www.gov.il/he/departments/israel_tax_authority' ),
		),
		'supreme'     => array(
			array( 'אתר הרשות השופטת', 'https://www.court.gov.il' ),
		),
	);
}

// ---------------------------------------------------------------------------
// Watcher
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	if ( ! wp_next_scheduled( 'justice_news_tick' ) ) {
		wp_schedule_event( time() + 900, 'hourly', 'justice_news_tick' );
	}
} );

add_action( 'justice_news_tick', function () {
	justice_news_run( false );
} );

function justice_news_stat(): array {
	$stat  = get_option( 'justice_news_stat', array() );
	$today = wp_date( 'Y-m-d' );

	if ( ! is_array( $stat ) || ( $stat['date'] ?? '' ) !== $today ) {
		$stat = array( 'date' => $today, 'generated' => 0, 'failed' => 0 );
	}

	return $stat;
}

function justice_news_log( string $action, string $detail ): void {
	$log   = get_option( 'justice_news_log', array() );
	$log   = is_array( $log ) ? $log : array();
	$log[] = array( 'at' => wp_date( 'Y-m-d H:i' ), 'action' => $action, 'detail' => mb_substr( $detail, 0, 140 ) );

	update_option( 'justice_news_log', array_slice( $log, -40 ), false );
}

function justice_news_collect_candidates(): array {
	include_once ABSPATH . WPINC . '/feed.php';

	$families   = justice_news_families();
	$fam_toggle = get_option( 'justice_news_family_toggle', array() );
	$seen       = get_option( 'justice_news_seen', array() );
	$seen       = is_array( $seen ) ? $seen : array();
	$candidates = array();
	$health     = get_option( 'justice_news_source_health', array() );

	foreach ( justice_news_sources() as $source ) {
		if ( empty( $source['enabled'] ) ) {
			continue;
		}

		$feed = fetch_feed( $source['url'] );

		if ( is_wp_error( $feed ) ) {
			$health[ $source['key'] ] = array( 'ok' => 0, 'at' => wp_date( 'H:i' ), 'note' => $feed->get_error_code() );
			continue;
		}

		$health[ $source['key'] ] = array( 'ok' => 1, 'at' => wp_date( 'H:i' ), 'note' => $feed->get_item_quantity() . ' items' );

		foreach ( $feed->get_items( 0, 20 ) as $item ) {
			$link  = (string) $item->get_permalink();
			$title = wp_strip_all_tags( (string) $item->get_title() );
			$hash  = md5( $link );

			if ( '' === $link || '' === $title || isset( $seen[ $hash ] ) ) {
				continue;
			}

			$desc = wp_strip_all_tags( (string) $item->get_description() );
			$text = $title . ' ' . $desc;

			// Topical focus gate: a legal keyword alone let world-crime items
			// through (a German case, a Venezuela item) and they ranked for
			// irrelevant terms, diluting the site's legal-Israel focus. Items
			// must now also carry an Israel anchor.
			if ( get_option( 'justice_news_require_il', 1 ) ) {
				$il = false;

				foreach ( array( 'ישראל', 'הישראלי', 'בית המשפט', 'בית הדין', 'בג"ץ', 'המשטרה', 'משטרת', 'פרקליטות', 'הכנסת', 'ח"כ', 'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'הרבני' ) as $anchor ) {
					if ( false !== mb_strpos( $text, $anchor ) ) {
						$il = true;
						break;
					}
				}

				if ( ! $il ) {
					$seen[ $hash ] = time();
					continue;
				}
			}

			// Legal-core gate (2026-07-16, owner order): an Israel anchor is not
			// enough - a Venezuela diplomacy item with the word "Israel" sailed
			// through and landed in the real-estate category. The item must be
			// LEGAL news: at least one legal-core term in title or description.
			$legal_core = array( 'בית המשפט', 'בית הדין', 'בג"ץ', 'עתירה', 'פסק דין', 'כתב אישום', 'מעצר', 'הרשעה', 'זיכוי', 'חקירה', 'פרקליטות', 'עורך דין', 'עורכי דין', 'תביעה', 'תובענה', 'חוק ', 'הצעת חוק', 'חקיקה', 'רגולצי', 'משפטי', 'משפט', 'עבירה', 'ערעור', 'צו ', 'היועץ המשפטי' );
			$is_legal   = false;

			foreach ( $legal_core as $lk ) {
				if ( false !== mb_strpos( $text, $lk ) ) {
					$is_legal = true;
					break;
				}
			}

			if ( ! $is_legal ) {
				$seen[ $hash ] = time();
				continue;
			}

			$best_family = '';
			$best_score  = 0;
			$best_title  = false;

			foreach ( $families as $fkey => $family ) {
				if ( isset( $fam_toggle[ $fkey ] ) && ! $fam_toggle[ $fkey ] ) {
					continue;
				}

				$score     = 0;
				$title_hit = false;

				foreach ( $family['keywords'] as $kw ) {
					if ( false !== mb_strpos( $title, $kw ) ) {
						$score    += 3;
						$title_hit = true;
					} elseif ( false !== mb_strpos( $desc, $kw ) ) {
						$score += 1;
					}
				}

				if ( $score > $best_score ) {
					$best_score  = $score;
					$best_family = $fkey;
					$best_title  = $title_hit;
				}
			}

			$seen[ $hash ] = time();

			// A family match must come from the HEADLINE, not a stray word in
			// the teaser, and clear a higher bar than before (was 3).
			if ( ! $best_title || $best_score < 4 ) {
				continue;
			}

			// Real-estate demands a hard property keyword in the headline -
			// this family mislabeled a diplomacy story and buried it in the
			// property category, which is exactly the SEO damage we ban.
			if ( 'real-estate' === $best_family ) {
				$hard_re = false;

				foreach ( array( 'נדל"ן', 'מקרקעין', 'דירה', 'דירות', 'מס רכישה', 'מס שבח', 'שכירות', 'התחדשות עירונית', 'קבלן', 'תכנון ובנייה', 'משכנתא' ) as $rk ) {
					if ( false !== mb_strpos( $title, $rk ) ) {
						$hard_re = true;
						break;
					}
				}

				if ( ! $hard_re ) {
					continue;
				}
			}

			if ( true ) {
				$candidates[] = array(
					'title'  => $title,
					'desc'   => mb_substr( $desc, 0, 600 ),
					'link'   => $link,
					'outlet' => $source['name'],
					'family' => $best_family,
					'score'  => $best_score,
				);
			}
		}
	}

	if ( count( $seen ) > 800 ) {
		asort( $seen );
		$seen = array_slice( $seen, -800, null, true );
	}

	update_option( 'justice_news_seen', $seen, false );
	update_option( 'justice_news_source_health', $health, false );

	usort( $candidates, function ( $a, $b ) {
		return $b['score'] <=> $a['score'];
	} );

	return $candidates;
}

function justice_news_run( bool $forced ): array {
	$out = array( 'published' => array(), 'note' => '' );

	if ( ! (int) get_option( 'justice_news_enabled', 1 ) && ! $forced ) {
		$out['note'] = 'paused';

		return $out;
	}

	if ( '' === justice_enc_openai_key() ) {
		$out['note'] = 'no key';

		return $out;
	}

	$stat  = justice_news_stat();
	$daily = max( 1, (int) get_option( 'justice_news_daily', 3 ) );

	if ( ! $forced && $stat['generated'] >= $daily ) {
		$out['note'] = 'daily cap reached';

		return $out;
	}

	// Editorial-desk cadence: minimum two hours between briefs.
	$latest_news = get_posts( array(
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'posts_per_page' => 1,
		'category_name'  => 'legal-news',
		'fields'         => 'ids',
	) );

	if ( ! $forced && $latest_news && ( time() - get_post_time( 'U', true, $latest_news[0] ) ) < 2 * HOUR_IN_SECONDS ) {
		$out['note'] = 'gap guard';

		return $out;
	}

	$candidates = justice_news_collect_candidates();

	if ( ! $candidates ) {
		$out['note'] = 'no candidates';
		justice_news_log( 'tick', 'no relevant items this hour' );

		return $out;
	}

	$item = $candidates[0];
	$pid  = justice_news_write_brief( $item );

	$stat = justice_news_stat();

	if ( $pid ) {
		$stat['generated']++;
		$out['published'][] = $pid;
		justice_news_log( 'published', $item['title'] . ' | ' . $item['outlet'] );
	} else {
		$stat['failed']++;
		justice_news_log( 'failed', $item['title'] . ' | ' . (string) ( get_option( 'justice_news_last_fail' )['reason'] ?? '' ) );
	}

	update_option( 'justice_news_stat', $stat, false );

	return $out;
}

// ---------------------------------------------------------------------------
// Writer
// ---------------------------------------------------------------------------

function justice_news_call_openai( array $messages ): string {
	return justice_ai_chat( $messages, array(
		'model'       => (string) get_option( 'justice_news_model', 'gpt-4.1' ),
		'temperature' => 0.35,
		'max_tokens'  => 4000,
		'timeout'     => 150,
		'source'      => 'news',
	) );
}

function justice_news_fail( string $reason, string $title ): int {
	update_option( 'justice_news_last_fail', array( 'reason' => $reason, 'title' => mb_substr( $title, 0, 90 ), 'at' => wp_date( 'Y-m-d H:i' ) ), false );

	return 0;
}

function justice_news_write_brief( array $item ): int {
	$families = justice_news_families();
	$family   = $families[ $item['family'] ] ?? reset( $families );
	$gov      = justice_news_gov_links()[ $item['family'] ] ?? array();

	$related = get_posts( array(
		'post_type'      => 'articles',
		'post_status'    => 'publish',
		'posts_per_page' => 2,
		'orderby'        => 'date',
		'order'          => 'DESC',
		's'              => $family['keywords'][0],
		'fields'         => 'ids',
	) );

	$allowed_links   = array();
	$allowed_links[] = 'המקור: ' . $item['outlet'] . ' => ' . $item['link'];
	$allowed_links[] = $family['pillar_anchor'] . ' => ' . home_url( $family['pillar'] );

	foreach ( $related as $rid ) {
		$allowed_links[] = get_the_title( $rid ) . ' => ' . get_permalink( $rid );
	}

	foreach ( $gov as $g ) {
		$allowed_links[] = $g[0] . ' => ' . $g[1];
	}

	$system = 'אתה עורך חדשות משפטיות בכיר בדסק החדשות של jus-tice.co.il. אתה כותב תמצית חדשותית מקצועית בעברית שמוסיפה ערך אמיתי מעבר לדיווח המקורי: ההקשר המשפטי והמשמעות המעשית לציבור. חוקים קשיחים: אתה מסתמך אך ורק על העובדות שבפריט המקור שסופק לך, בלי להוסיף פרטים עובדתיים שאינם בו; ייחוס חובה בפסקה הראשונה בנוסח לפי דיווח ב[שם המקור]; אין לקבוע אשמה של איש, על חשוד או נאשם כותבים לכאורה; חוקים בשמם הרשמי בלבד; אין קו מפריד ארוך, רק מקף רגיל; אסור Markdown מכל סוג: בלי כוכביות ובלי מקפים בתחילת שורה; אין להשתמש בביטויים: חשוב לציין, בעידן, מעבר לכך, לסיכום, ראוי לציין, יש לזכור, חשוב להבין, חשוב לדעת, בשורה התחתונה, אין ספק, יתרה מכך, זאת ועוד; אין סופרלטיבים; HTML נקי בלבד: p, h2, h3, ul, li, strong, וקישורי a אך ורק מהרשימה שסופקה, כל קישור מהרשימה מופיע פעם אחת לכל היותר. מבנה: פסקת פתיחה עם הדיווח והייחוס; h2 ההקשר המשפטי עם החוק הרלוונטי; h2 מה זה אומר בפועל עם המשמעות המעשית לאזרח או לעסק; h2 קישורים שימושיים עם רשימת ul של הקישורים הרשמיים והמדריכים שסופקו; משפט סיום ענייני. אורך: 350 עד 600 מילים. אל תחזור על כותרת הידיעה.';

	$user = 'פריט המקור: כותרת: "' . $item['title'] . '" | תקציר: "' . $item['desc'] . '" | מקור: ' . $item['outlet']
		. ' | תחום: ' . $family['label']
		. ' | קישורים מותרים (עוגן => כתובת): ' . implode( ' | ', $allowed_links )
		. ' | כתוב את התמצית המלאה עכשיו.';

	$body  = justice_enc_clean( justice_news_call_openai( array(
		array( 'role' => 'system', 'content' => $system ),
		array( 'role' => 'user', 'content' => $user ),
	) ), $item['title'] );
	$words = justice_enc_word_count( $body );

	if ( $words < 250 ) {
		return justice_news_fail( 'short:' . $words, $item['title'] );
	}

	if ( false === strpos( $body, $item['link'] ) && false === mb_strpos( $body, $item['outlet'] ) ) {
		return justice_news_fail( 'no-attribution', $item['title'] );
	}

	$tellers = justice_enc_teller_hits( $body );

	if ( $tellers ) {
		return justice_news_fail( 'style:' . implode( ',', $tellers ), $item['title'] );
	}

	if ( false !== strpos( $body, '**' ) || preg_match( '/^[ \t]*-[ \t]/mu', $body ) ) {
		return justice_news_fail( 'markdown', $item['title'] );
	}

	// Duplicate guard (2026-07-16): the same wire item must never publish
	// twice - identical briefs went out three times on July 2. Check both
	// the source URL meta and an identical title in the last 14 days.
	$dupe = get_posts( array(
		'post_type'      => 'post',
		'post_status'    => array( 'publish', 'draft' ),
		'posts_per_page' => 1,
		'meta_key'       => 'news_source_url',
		'meta_value'     => esc_url_raw( $item['link'] ),
		'fields'         => 'ids',
	) );

	if ( ! $dupe ) {
		$dupe = get_posts( array(
			'post_type'      => 'post',
			'post_status'    => array( 'publish', 'draft' ),
			'posts_per_page' => 1,
			'title'          => mb_substr( $item['title'], 0, 108 ),
			'date_query'     => array( array( 'after' => '14 days ago' ) ),
			'fields'         => 'ids',
		) );
	}

	if ( $dupe ) {
		return justice_news_fail( 'duplicate', $item['title'] );
	}

	// Headline: source-anchored, trimmed for Top Stories (110 char cap),
	// dash hygiene applied (source headlines carry em/en dashes).
	$headline = mb_substr( $item['title'], 0, 108 );
	$headline = preg_replace( '/(?<=[\w"\x{0590}-\x{05FF}])[\x{2013}\x{2014}](?=[\w\x{0590}-\x{05FF}])/u', '-', $headline );
	$headline = str_replace( array( ' — ', ' – ' ), ': ', $headline );
	$headline = preg_replace( '/\s*[\x{2013}\x{2014}]\s*/u', ': ', $headline );

	$source_line = '<p class="legal-news-source">מקור הדיווח: <a href="' . esc_url( $item['link'] ) . '" target="_blank" rel="noopener nofollow">' . esc_html( $item['outlet'] ) . '</a>. הסיכום כאן הוא תמצית חדשותית בתוספת הקשר משפטי ואינו ייעוץ משפטי.</p>';

	$cat_id = function_exists( 'justice_theme_legal_news_category_id' ) ? justice_theme_legal_news_category_id() : 0;

	$pid = wp_insert_post( array(
		'post_type'     => 'post',
		'post_status'   => 'publish',
		'post_title'    => $headline,
		'post_name'     => sanitize_title( $item['family'] . '-legal-news-' . wp_date( 'Y-m-d' ) . '-' . substr( md5( $item['link'] ), 0, 6 ) ),
		'post_content'  => $body . $source_line,
		'post_excerpt'  => mb_substr( wp_strip_all_tags( $item['desc'] ?: $item['title'] ), 0, 155 ),
		'post_category' => $cat_id ? array( $cat_id ) : array(),
	) );

	if ( ! $pid || is_wp_error( $pid ) ) {
		return justice_news_fail( 'wp-insert', $item['title'] );
	}

	update_post_meta( $pid, 'news_source_url', esc_url_raw( $item['link'] ) );
	update_post_meta( $pid, 'news_source_name', sanitize_text_field( $item['outlet'] ) );
	update_post_meta( $pid, 'news_family', sanitize_text_field( $item['family'] ) );
	update_post_meta( $pid, '_yoast_wpseo_title', $headline . ' | Jus-Tice' );
	update_post_meta( $pid, '_yoast_wpseo_metadesc', mb_substr( wp_strip_all_tags( $item['desc'] ?: $headline ), 0, 155 ) );

	// 2026-07-16: the old full autoptimizeCache::clearall() here wiped every
	// compiled CSS aggregate on EVERY news publish, so visitors in that
	// window got raw unstyled pages (the "exposed code" the owner caught).
	// Targeted purge instead: only the new post and the homepage.
	foreach ( array( get_permalink( $pid ), home_url( '/' ) ) as $purge_url ) {
		wp_remote_request( $purge_url, array( 'method' => 'PURGE', 'timeout' => 5, 'blocking' => false ) );
	}

	return (int) $pid;
}

// ---------------------------------------------------------------------------
// Google News sitemap: /news-sitemap.xml (48h window)
// ---------------------------------------------------------------------------

add_action( 'init', function () {
	add_rewrite_rule( '^sitemap-news\.xml$', 'index.php?justice_news_sitemap=1', 'top' );
}, 6 );

add_filter( 'query_vars', function ( $vars ) {
	$vars[] = 'justice_news_sitemap';

	return $vars;
} );

add_action( 'template_redirect', function () {
	if ( ! get_query_var( 'justice_news_sitemap' ) ) {
		return;
	}

	$posts = get_posts( array(
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'posts_per_page' => 100,
		'category_name'  => 'legal-news',
		'date_query'     => array( array( 'after' => '48 hours ago' ) ),
	) );

	header( 'Content-Type: application/xml; charset=UTF-8' );
	echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
	echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">' . "\n";

	foreach ( $posts as $post ) {
		echo "<url><loc>" . esc_url( get_permalink( $post ) ) . "</loc><news:news><news:publication><news:name>Jus-Tice</news:name><news:language>he</news:language></news:publication><news:publication_date>" . esc_html( get_the_date( DATE_W3C, $post ) ) . "</news:publication_date><news:title>" . esc_html( wp_strip_all_tags( $post->post_title ) ) . "</news:title></news:news></url>\n";
	}

	echo '</urlset>';
	exit;
} );

// ---------------------------------------------------------------------------
// REST: status + run
// ---------------------------------------------------------------------------

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/news-status', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			return rest_ensure_response( array(
				'enabled'   => (int) get_option( 'justice_news_enabled', 1 ),
				'daily_cap' => (int) get_option( 'justice_news_daily', 3 ),
				'model'     => (string) get_option( 'justice_news_model', 'gpt-4.1' ),
				'today'     => justice_news_stat(),
				'last_fail' => get_option( 'justice_news_last_fail', null ),
				'sources'   => get_option( 'justice_news_source_health', array() ),
				'log_tail'  => array_slice( (array) get_option( 'justice_news_log', array() ), -5 ),
			) );
		},
	) );

	register_rest_route( 'justice-ops/v1', '/news-run', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => function () {
			return rest_ensure_response( justice_news_run( true ) );
		},
	) );
} );

// ---------------------------------------------------------------------------
// Admin control panel: wp-admin -> Justice News
// ---------------------------------------------------------------------------

add_action( 'admin_menu', function () {
	add_menu_page( 'Justice News', 'Justice News', 'manage_options', 'justice-news', 'justice_news_admin_page', 'dashicons-megaphone', 58 );
} );

add_action( 'admin_post_justice_news_save', function () {
	if ( ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'justice_news_save' ) ) {
		wp_die( 'denied' );
	}

	update_option( 'justice_news_enabled', isset( $_POST['news_enabled'] ) ? 1 : 0, false );
	update_option( 'justice_news_daily', max( 1, min( 10, (int) ( $_POST['news_daily'] ?? 3 ) ) ), false );
	update_option( 'justice_news_model', sanitize_text_field( (string) ( $_POST['news_model'] ?? 'gpt-4.1' ) ), false );

	$sources = justice_news_sources();
	foreach ( $sources as &$source ) {
		$source['enabled'] = isset( $_POST[ 'src_' . $source['key'] ] ) ? 1 : 0;
	}
	unset( $source );
	update_option( 'justice_news_sources', $sources, false );

	$toggle = array();
	foreach ( array_keys( justice_news_families() ) as $fkey ) {
		$toggle[ $fkey ] = isset( $_POST[ 'fam_' . $fkey ] ) ? 1 : 0;
	}
	update_option( 'justice_news_family_toggle', $toggle, false );

	justice_news_log( 'settings', 'saved from admin' );
	wp_safe_redirect( admin_url( 'admin.php?page=justice-news&saved=1' ) );
	exit;
} );

add_action( 'admin_post_justice_news_run', function () {
	if ( ! current_user_can( 'manage_options' ) || ! check_admin_referer( 'justice_news_run' ) ) {
		wp_die( 'denied' );
	}

	$result = justice_news_run( true );
	wp_safe_redirect( admin_url( 'admin.php?page=justice-news&ran=' . count( $result['published'] ) ) );
	exit;
} );

function justice_news_admin_page(): void {
	$enabled = (int) get_option( 'justice_news_enabled', 1 );
	$stat    = justice_news_stat();
	$toggle  = get_option( 'justice_news_family_toggle', array() );
	$health  = get_option( 'justice_news_source_health', array() );
	$log     = array_reverse( (array) get_option( 'justice_news_log', array() ) );
	$spend   = round( ( (int) $stat['generated'] ) * 0.03, 2 );
	?>
	<div class="wrap" style="max-width:860px">
		<h1>Justice News, מנוע החדשות</h1>
		<p style="font-size:14px">
			סטטוס: <strong style="color:<?php echo $enabled ? '#0a7d2f' : '#b32d2e'; ?>"><?php echo $enabled ? 'פעיל' : 'מושהה'; ?></strong>
			| היום: <?php echo (int) $stat['generated']; ?> פורסמו, <?php echo (int) $stat['failed']; ?> נכשלו
			| הוצאה משוערת היום: $<?php echo esc_html( (string) $spend ); ?>
		</p>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<?php wp_nonce_field( 'justice_news_save' ); ?>
			<input type="hidden" name="action" value="justice_news_save" />

			<table class="form-table">
				<tr><th>המנוע פועל</th><td><label><input type="checkbox" name="news_enabled" <?php checked( $enabled, 1 ); ?> /> כבה כדי להשהות את כל המנוע (נכנס לתוקף בטיק הבא)</label></td></tr>
				<tr><th>תקרה יומית</th><td><input type="number" name="news_daily" min="1" max="10" value="<?php echo (int) get_option( 'justice_news_daily', 3 ); ?>" /> תמציות ביום</td></tr>
				<tr><th>מודל</th><td><input type="text" name="news_model" value="<?php echo esc_attr( (string) get_option( 'justice_news_model', 'gpt-4.1' ) ); ?>" /></td></tr>
				<tr><th>מקורות</th><td>
					<?php foreach ( justice_news_sources() as $source ) :
						$h = $health[ $source['key'] ] ?? null; ?>
						<label style="display:block;margin-bottom:4px">
							<input type="checkbox" name="src_<?php echo esc_attr( $source['key'] ); ?>" <?php checked( ! empty( $source['enabled'] ) ); ?> />
							<?php echo esc_html( $source['name'] ); ?>
							<?php if ( $h ) : ?>
								<span style="color:<?php echo ! empty( $h['ok'] ) ? '#0a7d2f' : '#b32d2e'; ?>">(<?php echo esc_html( ( ! empty( $h['ok'] ) ? 'תקין ' : 'שגיאה ' ) . $h['at'] . ' ' . $h['note'] ); ?>)</span>
							<?php endif; ?>
						</label>
					<?php endforeach; ?>
				</td></tr>
				<tr><th>תחומים</th><td>
					<?php foreach ( justice_news_families() as $fkey => $family ) : ?>
						<label style="margin-inline-end:14px"><input type="checkbox" name="fam_<?php echo esc_attr( $fkey ); ?>" <?php checked( ! isset( $toggle[ $fkey ] ) || $toggle[ $fkey ] ); ?> /> <?php echo esc_html( $family['label'] ); ?></label>
					<?php endforeach; ?>
				</td></tr>
			</table>

			<p><button class="button button-primary">שמירת הגדרות</button></p>
		</form>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="margin-bottom:24px">
			<?php wp_nonce_field( 'justice_news_run' ); ?>
			<input type="hidden" name="action" value="justice_news_run" />
			<button class="button">הרצה ידנית עכשיו</button>
			<a class="button" href="<?php echo esc_url( home_url( '/sitemap-news.xml' ) ); ?>" target="_blank">news-sitemap.xml</a>
			<a class="button" href="<?php echo esc_url( home_url( '/wp-json/justice-ops/v1/news-status' ) ); ?>" target="_blank">סטטוס JSON</a>
		</form>

		<h2>יומן אחרון</h2>
		<table class="widefat striped">
			<thead><tr><th>זמן</th><th>פעולה</th><th>פרטים</th></tr></thead>
			<tbody>
			<?php foreach ( array_slice( $log, 0, 20 ) as $row ) : ?>
				<tr><td><?php echo esc_html( $row['at'] ); ?></td><td><?php echo esc_html( $row['action'] ); ?></td><td><?php echo esc_html( $row['detail'] ); ?></td></tr>
			<?php endforeach; ?>
			</tbody>
		</table>
	</div>
	<?php
}
