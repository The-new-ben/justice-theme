<?php
/**
 * Lawyer index import: the ranking-guides ingestion machine (owner order
 * 2026-07-16, collaboration mapping project).
 *
 * Admin-only REST route that swallows rows collected from public ranking
 * guides and turns each into a BASIC PUBLIC CARD (same honest pattern as
 * the existing public-index cards: unverified, free plan, claim-and-verify
 * later). Ranking data is stored in INTERNAL meta only - it is never
 * rendered on any public surface and no guide brand is ever named
 * publicly (deal presentation pending, owner order). The map feed reads
 * only what it always read: publish + approved + geocoded.
 *
 * Flow: POST rows (dry_run first) -> execute -> POST
 * /justice/v1/map/geocode-missing until drained -> feed transient clears
 * -> cards appear as quiet chips on the map.
 *
 * @package JusticeOps
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Canonical city spellings for common variants seen in ranking guides.
 */
function justice_lii_canon_city( string $city ): string {
	$city = trim( preg_replace( '/\s+/u', ' ', $city ) );

	$map = array(
		'ת"א'            => 'תל אביב',
		'ת״א'            => 'תל אביב',
		'תל-אביב'        => 'תל אביב',
		'תל אביב-יפו'    => 'תל אביב',
		'תל אביב יפו'    => 'תל אביב',
		'פ"ת'            => 'פתח תקווה',
		'פתח-תקווה'      => 'פתח תקווה',
		'פתח תקוה'       => 'פתח תקווה',
		'ראשל"צ'         => 'ראשון לציון',
		'ראשון-לציון'    => 'ראשון לציון',
		'ב"ב'            => 'בני ברק',
		'בני-ברק'        => 'בני ברק',
		'ב"ש'            => 'באר שבע',
		'באר-שבע'        => 'באר שבע',
		'י-ם'            => 'ירושלים',
		'ירושלים המערבית' => 'ירושלים',
		'רמת-גן'         => 'רמת גן',
		'כפר-סבא'        => 'כפר סבא',
		'הרצלייה'        => 'הרצליה',
		'הרצליה פיתוח'   => 'הרצליה',
	);

	return $map[ $city ] ?? $city;
}

/**
 * Map a guide's practice label onto our practice-areas taxonomy term name.
 * Exact alias table first, then a contains-match against existing terms.
 * Unmapped labels flag the row but never invent a taxonomy term.
 */
function justice_lii_map_area( string $label, array $existing_terms ): string {
	$label = trim( $label );

	// Corrected 2026-07-17 against the REAL live term names (get_terms(),
	// verified via REST) - the original table (built for the v1 guide-row
	// schema, never actually executed until now) had several targets
	// backwards or stale: the live real-estate term is the compound
	// "מקרקעין | נדל\"ן", not "מקרקעין ונדל\"ן"; the live tax term is
	// "מיסים", not "מיסוי" (the old table pointed both aliases at the
	// wrong one of the pair). Verified live-term list also has
	// "קניין רוחני" (IP), "משפט מסחרי" (commercial), "דיני נזיקין" carries
	// BOTH slugs tort-law/personal-injury, "משפט מנהלי" (administrative).
	$aliases = array(
		'פלילי'                    => 'משפט פלילי',
		'דין פלילי'                => 'משפט פלילי',
		'צווארון לבן'              => 'משפט פלילי',
		'עבירות כלכליות'           => 'משפט פלילי',
		'משפחה'                    => 'דיני משפחה',
		'דיני משפחה וירושה'        => 'דיני משפחה',
		'גירושין'                  => 'דיני משפחה',
		'הסכמי ממון'               => 'דיני משפחה',
		'אפוטרופסות'               => 'דיני משפחה',
		'נדל"ן'                    => 'מקרקעין | נדל"ן',
		'מקרקעין'                  => 'מקרקעין | נדל"ן',
		'נדל"ן ותשתיות'            => 'מקרקעין | נדל"ן',
		'תכנון ובנייה'             => 'מקרקעין | נדל"ן',
		'פינוי בינוי'              => 'מקרקעין | נדל"ן',
		'נזיקין'                   => 'דיני נזיקין',
		'ביטוח ונזיקין'            => 'דיני נזיקין',
		'נזקי גוף'                 => 'דיני נזיקין',
		'רשלנות רפואית'            => 'רשלנות רפואית',
		'עבודה'                    => 'דיני עבודה',
		'דיני עבודה'               => 'דיני עבודה',
		'יחסי עבודה'               => 'דיני עבודה',
		'ירושה'                    => 'ירושה וצוואות',
		'צוואות וירושות'           => 'ירושה וצוואות',
		'עיזבונות'                 => 'ירושה וצוואות',
		'ייפוי כוח מתמשך'          => 'ירושה וצוואות',
		'תעבורה'                   => 'דיני תעבורה',
		'תאונות דרכים'             => 'דיני תעבורה',
		'מיסים'                    => 'מיסים',
		'מסים'                     => 'מיסים',
		'מיסוי'                    => 'מיסים',
		'מיסוי מקרקעין'            => 'מיסים',
		'מיסוי בינלאומי'           => 'מיסים',
		'מיסוי ישראלי'             => 'מיסים',
		'מס הכנסה'                 => 'מיסים',
		'מע"מ'                     => 'מיסים',
		'ליטיגציית מס'             => 'מיסים',
		'סימני מסחר'               => 'קניין רוחני',
		'פטנטים'                   => 'קניין רוחני',
		'זכויות יוצרים'            => 'קניין רוחני',
		'קניין רוחני'              => 'קניין רוחני',
		'תאגידים'                  => 'משפט מסחרי',
		'דיני חברות'               => 'משפט מסחרי',
		'משפט אזרחי-מסחרי'         => 'משפט מסחרי',
		'רשויות מקומיות'           => 'משפט מנהלי',
		'מכרזים'                   => 'משפט מנהלי',
		'רגולציה'                  => 'משפט מנהלי',

		// New terms created 2026-07-17 from the dry-run's area_unmapped
		// worklist (Phase 2, law-firm index expansion) - each backed by a
		// real live taxonomy term with an honest description, verified
		// rendering via taxonomy-practice-areas.php before this alias
		// table was updated to point at them.
		'התחדשות עירונית'          => 'התחדשות עירונית',
		'גישור'                    => 'גישור ובוררות',
		'בוררות'                   => 'גישור ובוררות',
		'בוררות וגישור'            => 'גישור ובוררות',
		'גישור ובוררות'            => 'גישור ובוררות',
		'הייטק'                    => 'הייטק',
		'היי-טק'                   => 'הייטק',
		'בנקאות'                   => 'בנקאות ומימון',
		'בנקאות ומימון'            => 'בנקאות ומימון',
		'מימון'                    => 'בנקאות ומימון',
		'מימון פרויקטים'           => 'בנקאות ומימון',
		'נוטריון'                  => 'נוטריון',
		'משפט אזרחי'               => 'משפט אזרחי וליטיגציה',
		'משפט אזרחי ומסחרי'        => 'משפט אזרחי וליטיגציה',
		'ליטיגציה אזרחית'          => 'משפט אזרחי וליטיגציה',
		'ליטיגציה אזרחית ומסחרית'  => 'משפט אזרחי וליטיגציה',
		'פרטיות'                   => 'הגנת הפרטיות',
		'הגנת הפרטיות'             => 'הגנת הפרטיות',
		'תשתיות'                   => 'אנרגיה ותשתיות',
		'אנרגיה ותשתיות'           => 'אנרגיה ותשתיות',
		'אנרגיה'                   => 'אנרגיה ותשתיות',

		// Found live in batch-02 real-import output 2026-07-18: these exact
		// compound labels from the source CSV don't substring-match their
		// obvious existing term (the matcher compares whole label vs whole
		// term name, not word-by-word), so firms carrying ONLY this phrasing
		// landed with zero practice-area terms at all. Mapped to the closest
		// existing term; genuinely homeless niches (e.g. "דיני זכיינות")
		// are left unmapped on purpose, per the no-invented-terms rule.
		'משפט עסקי - מסחרי'        => 'משפט מסחרי',
		'ליווי חברות ועסקים'       => 'משפט מסחרי',
		'נדל"ן על כל היבטיו'       => 'מקרקעין | נדל"ן',
		'ליטיגציה וצווארון לבן'    => 'משפט פלילי',

		// Found live in the final post-import reconciliation scan 2026-07-18
		// (all 7 batches, 232 zero-area posts cross-checked against their raw
		// source label) - same substring-matching gap as the 2.30.0 batch,
		// mapped only where an existing term is a genuinely close fit. Left
		// unmapped on purpose: one-off niches with no real home (sports law,
		// aviation law, military law, online gaming), and vague/typo labels
		// where any target would be a guess, not a fit.
		'עריכת דין בתחום המשפט המנהלי-מוניציפאלי והאזרחי' => 'משפט מנהלי',
		'משפט מוניציפאלי ומשפט אזרחי מסחרי' => 'משפט מנהלי',
		'רגולציה וציות'            => 'משפט מנהלי',
		'שירותים פיננסיים'         => 'בנקאות ומימון',
		'דיני בנקאות'              => 'בנקאות ומימון',
		'דיני סביבה'               => 'איכות סביבה',
		'מיסוי מוניציפלי'          => 'מיסים',
		'ייעוץ וייצוג בתחום המשפט והפלילי' => 'משפט פלילי',
		'גישור וניהול סכסוכים'     => 'גישור ובוררות',
		'גישור מסחרי וגישור בענייני משפחה' => 'גישור ובוררות',
		'בינה מלאכותית וטכנולוגיה' => 'הייטק',
	);

	$target = $aliases[ $label ] ?? $label;

	foreach ( $existing_terms as $term_name ) {
		if ( $term_name === $target ) {
			return $term_name;
		}
	}

	foreach ( $existing_terms as $term_name ) {
		if ( false !== mb_strpos( $term_name, $target ) || false !== mb_strpos( $target, $term_name ) ) {
			return $term_name;
		}
	}

	return '';
}

/**
 * Normalized name for dedupe: quotes, honorifics and spacing collapse so
 * "עו\"ד דנה כהן" and "עורכת דין דנה כהן ושות'" meet at the same key.
 */
function justice_lii_name_key( string $name ): string {
	// Corrected 2026-07-18: found live, mid-import, on real data - the
	// source dataset itself carries near-duplicate rows for the same firm
	// ("X ושות'" vs "X ושות' משרד עורכי דין"; "X - עורכי דין" vs
	// "X- משרד עורכי דין"). The honorific strip only matched SINGULAR
	// "עורך דין"/"עורכת דין", never the plural "עורכי דין" that appears
	// in these real rows, and dash characters (hyphen/en-dash/em-dash)
	// were left in as literal characters - both differences alone were
	// enough to defeat the dedupe and create two live posts for one real
	// firm (confirmed: GBK, אביב לזר, identical address/phone/email/
	// website on both copies before this fix).
	$name = wp_specialchars_decode( $name, ENT_QUOTES );
	$name = str_replace( array( '"', '״', "'", '׳', '`', '-', '–', '—' ), ' ', $name );
	$name = preg_replace( '/\b(עוד|עורך דין|עורכת דין|עורכי דין|עו״ד|טוען רבני|טוענת רבנית|משרד|ושות|נוטריון|מגשר|מגשרת)\b/u', '', $name );
	$name = preg_replace( '/\s+/u', ' ', trim( (string) $name ) );

	return mb_strtolower( (string) $name );
}

/**
 * Existing lawyers indexed by name key, built once per request.
 */
function justice_lii_existing_index(): array {
	$index = array();

	$ids = get_posts( array(
		'post_type'      => 'justice_lawyer',
		'post_status'    => array( 'publish', 'draft', 'pending' ),
		'posts_per_page' => 2000,
		'fields'         => 'ids',
		'no_found_rows'  => true,
	) );

	foreach ( $ids as $id ) {
		$key = justice_lii_name_key( get_the_title( (int) $id ) );

		if ( '' !== $key && ! isset( $index[ $key ] ) ) {
			$index[ $key ] = (int) $id;
		}
	}

	return $index;
}

add_action( 'rest_api_init', function () {
	register_rest_route( 'justice-ops/v1', '/lawyer-index-import', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => 'justice_lii_import',
	) );

	register_rest_route( 'justice-ops/v1', '/lawyer-index-import-v2', array(
		'methods'             => 'POST',
		'permission_callback' => function () {
			return current_user_can( 'manage_options' );
		},
		'callback'            => 'justice_lii_import_v2',
	) );
} );

/**
 * The importer. Body: {dry_run: bool, rows: [...]}. Row fields:
 * full_name*, entity_type (firm|person), practice_areas* (array or ';'
 * string of guide labels), office_address*, city*, phone, website,
 * guide_code* (G1|G2|G3 - internal codes, never brand names in public
 * output), guide_practice_label, rank_tier (1-4), rank_label_raw,
 * rank_year*, source_url*, notes.
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response
 */
function justice_lii_import( WP_REST_Request $request ) {
	$body    = $request->get_json_params();
	$rows    = is_array( $body['rows'] ?? null ) ? $body['rows'] : array();
	$dry_run = ! empty( $body['dry_run'] );

	if ( ! $rows ) {
		return new WP_REST_Response( array( 'error' => 'no_rows' ), 400 );
	}

	if ( count( $rows ) > 200 ) {
		return new WP_REST_Response( array( 'error' => 'max_200_rows_per_call' ), 400 );
	}

	$term_objs = get_terms( array( 'taxonomy' => 'practice-areas', 'hide_empty' => false ) );
	$terms     = array();

	if ( is_array( $term_objs ) ) {
		foreach ( $term_objs as $t ) {
			$terms[] = $t->name;
		}
	}

	$existing = justice_lii_existing_index();
	$guides   = array( 'G1', 'G2', 'G3' );
	$report   = array();
	$created  = 0;
	$updated  = 0;
	$skipped  = 0;

	foreach ( $rows as $i => $row ) {
		$r = array(
			'row'    => $i,
			'name'   => trim( (string) ( $row['full_name'] ?? '' ) ),
			'action' => '',
			'flags'  => array(),
		);

		$name    = $r['name'];
		$city    = justice_lii_canon_city( (string) ( $row['city'] ?? '' ) );
		$address = trim( preg_replace( '/\s+/u', ' ', (string) ( $row['office_address'] ?? '' ) ) );
		$guide   = strtoupper( trim( (string) ( $row['guide_code'] ?? '' ) ) );
		$year    = (int) ( $row['rank_year'] ?? 0 );
		$source  = esc_url_raw( (string) ( $row['source_url'] ?? '' ) );
		$tier    = (int) ( $row['rank_tier'] ?? 0 );

		$areas_in = $row['practice_areas'] ?? array();

		if ( is_string( $areas_in ) ) {
			$areas_in = array_filter( array_map( 'trim', explode( ';', $areas_in ) ) );
		}

		// Validation gate: facts only, all of them present.
		if ( '' === $name ) { $r['flags'][] = 'missing_name'; }
		if ( '' === $city ) { $r['flags'][] = 'missing_city'; }
		if ( '' === $address ) { $r['flags'][] = 'missing_address'; }
		if ( ! $areas_in ) { $r['flags'][] = 'missing_areas'; }
		if ( ! in_array( $guide, $guides, true ) ) { $r['flags'][] = 'bad_guide_code'; }
		if ( $year < 2020 || $year > 2030 ) { $r['flags'][] = 'bad_year'; }
		if ( '' === $source ) { $r['flags'][] = 'missing_source_url'; }
		if ( false !== stripos( implode( ' ', (array) $row ), 'TODO-VERIFY' ) ) { $r['flags'][] = 'has_todo_verify'; }

		if ( $r['flags'] ) {
			$r['action'] = 'skip';
			$skipped++;
			$report[] = $r;
			continue;
		}

		$mapped = array();
		foreach ( $areas_in as $label ) {
			$m = justice_lii_map_area( (string) $label, $terms );
			if ( '' !== $m ) {
				$mapped[ $m ] = true;
			} else {
				$r['flags'][] = 'area_unmapped:' . $label;
			}
		}
		$mapped = array_keys( $mapped );

		$key         = justice_lii_name_key( $name );
		$existing_id = $existing[ $key ] ?? 0;
		$r['action'] = $existing_id ? 'update' : 'create';

		if ( $dry_run ) {
			$r['matched_id'] = $existing_id;
			$r['areas']      = $mapped;
			$r['city']       = $city;
			$report[]        = $r;
			$existing_id ? $updated++ : $created++;
			continue;
		}

		$area_line = $mapped ? implode( ', ', array_slice( $mapped, 0, 2 ) ) : 'משפט';
		$bio       = 'כרטיס מקצועי בסיסי ציבורי לא מאומת בתחום ' . $area_line
			. '. המידע הוכן ממקור פומבי לצורך תביעת הכרטיס והמשך אימות מול בעל המקצוע.';

		if ( $existing_id ) {
			$post_id = $existing_id;

			// Fill only what is missing - never overwrite a claimed or
			// richer profile, never touch plan/verification state.
			if ( '' === (string) get_post_meta( $post_id, 'office_address', true ) ) {
				update_post_meta( $post_id, 'office_address', $address );
				delete_post_meta( $post_id, 'office_lat' );
				delete_post_meta( $post_id, 'office_lng' );
			}
			$updated++;
		} else {
			$post_id = wp_insert_post( array(
				'post_type'    => 'justice_lawyer',
				'post_status'  => 'publish',
				'post_title'   => $name,
				'post_content' => $bio,
			), true );

			if ( is_wp_error( $post_id ) ) {
				$r['action']  = 'error';
				$r['flags'][] = $post_id->get_error_message();
				$skipped++;
				$report[] = $r;
				continue;
			}

			update_post_meta( $post_id, 'lawyer_full_name', $name );
			update_post_meta( $post_id, 'firm_name', $name );
			update_post_meta( $post_id, 'bio_short', $bio );
			update_post_meta( $post_id, 'office_address', $address );
			update_post_meta( $post_id, 'phone', sanitize_text_field( (string) ( $row['phone'] ?? '' ) ) );
			update_post_meta( $post_id, 'website', esc_url_raw( (string) ( $row['website'] ?? '' ) ) );
			update_post_meta( $post_id, 'entity_type', 'firm' === ( $row['entity_type'] ?? '' ) ? 'firm' : 'person' );
			// license_status intentionally NOT written: 'unknown' is not a fact,
			// and the profile template prints whatever lands here (owner report
			// 2026-07-18: raw "unknown" rendered on every imported profile).
			update_post_meta( $post_id, 'plan_type', 'free' );
			update_post_meta( $post_id, 'profile_status', 'public' );
			update_post_meta( $post_id, 'subscription_status', 'inactive' );
			update_post_meta( $post_id, 'verification_status', 'unverified' );
			update_post_meta( $post_id, 'source_type', 'public_ranking_index' );
			update_post_meta( $post_id, 'source_url', $source );
			update_post_meta( $post_id, 'internal_notes', 'PUBLIC_BASIC_CARD | source=ranking_guide:' . $guide . ' | rank internal only, never public | do_not_copy_reviews_or_photos | claim_and_verify_flow' );
			update_post_meta( $post_id, 'priority_score', (string) max( 5, 40 - 10 * max( 1, min( 4, $tier ?: 4 ) ) ) );

			$existing[ $key ] = (int) $post_id;
			$created++;
		}

		// Taxonomies: append, never replace (a claimed profile's own terms win).
		if ( $mapped ) {
			wp_set_object_terms( $post_id, $mapped, 'practice-areas', true );
		}
		if ( '' !== $city ) {
			wp_set_object_terms( $post_id, array( $city ), 'city', true );
		}

		// Ranking record: INTERNAL meta only. Multiple guides/areas/years
		// stack as separate entries; nothing renders them publicly.
		$entry = array(
			'guide' => $guide,
			'tier'  => $tier,
			'label' => sanitize_text_field( (string) ( $row['rank_label_raw'] ?? '' ) ),
			'area'  => sanitize_text_field( (string) ( $row['guide_practice_label'] ?? '' ) ),
			'year'  => $year,
		);
		$already = array_filter( (array) get_post_meta( $post_id, 'jt_rank_entry' ), function ( $e ) use ( $entry ) {
			return is_array( $e ) && $e['guide'] === $entry['guide'] && $e['area'] === $entry['area'] && (int) $e['year'] === (int) $entry['year'];
		} );

		if ( ! $already ) {
			add_post_meta( $post_id, 'jt_rank_entry', $entry );
		}

		$r['post_id'] = (int) $post_id;
		$report[]     = $r;
	}

	if ( ! $dry_run ) {
		if ( function_exists( 'justice_ops_purge_map_feed_cache' ) ) {
			justice_ops_purge_map_feed_cache();
		} else {
			delete_transient( 'justice_map_geojson_v1' );
			delete_transient( 'justice_map_geojson_v2' );
		}
	}

	return new WP_REST_Response( array(
		'dry_run' => $dry_run,
		'created' => $created,
		'updated' => $updated,
		'skipped' => $skipped,
		'rows'    => $report,
	), 200 );
}

/**
 * v2 importer: the 13-column full-index schema (owner order 2026-07-17,
 * law-firm index expansion, Phase 1). Unlike v1 (guide-row-per-category,
 * one row per firm x category x guide), this schema is one row per FIRM
 * with a rank_entries[] array already rejoined offline against
 * rankings-latest.csv (see project-control/lawyer-index/ - that file
 * never touches this server; the rejoin happens locally and rank_entries
 * arrives pre-stripped to internal-only fields). Reuses every helper from
 * the v1 importer above (city canon, area alias map, name-key dedupe) -
 * only the row shape and publish policy differ.
 *
 * Row fields: full_name* (verbatim join key, never mutated), entity_type
 * (defaults 'firm'), office_address, city, phone, website, email,
 * practice_areas (array OR '|'-delimited string - NOT ';', the guide
 * export's real delimiter), firm_size_lawyers, founded_year, branches,
 * short_description, address_source_url, notes,
 * rank_entries[] ({guide, tier, label, area, year}).
 *
 * @param WP_REST_Request $request Request.
 * @return WP_REST_Response
 */
function justice_lii_import_v2( WP_REST_Request $request ) {
	$body    = $request->get_json_params();
	$rows    = is_array( $body['rows'] ?? null ) ? $body['rows'] : array();
	$dry_run = ! empty( $body['dry_run'] );

	if ( ! $rows ) {
		return new WP_REST_Response( array( 'error' => 'no_rows' ), 400 );
	}

	if ( count( $rows ) > 200 ) {
		return new WP_REST_Response( array( 'error' => 'max_200_rows_per_call' ), 400 );
	}

	$term_objs = get_terms( array( 'taxonomy' => 'practice-areas', 'hide_empty' => false ) );
	$terms     = array();

	if ( is_array( $term_objs ) ) {
		foreach ( $term_objs as $t ) {
			$terms[] = $t->name;
		}
	}

	$existing = justice_lii_existing_index();
	$report   = array();
	$created  = 0;
	$updated  = 0;
	$skipped  = 0;
	$drafted  = 0;

	foreach ( $rows as $i => $row ) {
		$r = array(
			'row'    => $i,
			'name'   => trim( (string) ( $row['full_name'] ?? '' ) ),
			'action' => '',
			'flags'  => array(),
		);

		$name = $r['name'];

		if ( '' === $name ) {
			$r['flags'][] = 'missing_name';
			$r['action']  = 'skip';
			$skipped++;
			$report[] = $r;
			continue;
		}

		if ( false !== stripos( implode( ' ', array_map( 'strval', array_filter( $row, 'is_scalar' ) ) ), 'TODO-VERIFY' ) ) {
			$r['flags'][] = 'has_todo_verify';
			$r['action']  = 'skip';
			$skipped++;
			$report[] = $r;
			continue;
		}

		$city    = justice_lii_canon_city( (string) ( $row['city'] ?? '' ) );
		$address = trim( preg_replace( '/\s+/u', ' ', (string) ( $row['office_address'] ?? '' ) ) );
		$phone   = sanitize_text_field( (string) ( $row['phone'] ?? '' ) );
		$website = esc_url_raw( (string) ( $row['website'] ?? '' ) );
		$email   = sanitize_email( (string) ( $row['email'] ?? '' ) );
		$size    = (int) ( $row['firm_size_lawyers'] ?? 0 );
		$founded = (int) ( $row['founded_year'] ?? 0 );
		$branches = trim( (string) ( $row['branches'] ?? '' ) );
		$desc    = trim( wp_strip_all_tags( (string) ( $row['short_description'] ?? '' ) ) );
		$addr_src = esc_url_raw( (string) ( $row['address_source_url'] ?? '' ) );
		$notes   = sanitize_text_field( (string) ( $row['notes'] ?? '' ) );

		$areas_in = $row['practice_areas'] ?? array();

		if ( is_string( $areas_in ) ) {
			$areas_in = array_filter( array_map( 'trim', explode( '|', $areas_in ) ) );
		} else {
			$areas_in = array_filter( array_map( 'trim', array_map( 'strval', (array) $areas_in ) ) );
		}

		$mapped = array();
		foreach ( $areas_in as $label ) {
			$m = justice_lii_map_area( (string) $label, $terms );
			if ( '' !== $m ) {
				$mapped[ $m ] = true;
			} else {
				$r['flags'][] = 'area_unmapped:' . $label;
			}
		}
		$mapped = array_keys( $mapped );

		// Publish/draft threshold: a name alone (the 141 pure "not found"
		// placeholder rows) is not a public record. Any one real field
		// beyond the name earns a real, publishable directory card. Checked
		// against the RAW practice_areas presence (areas_in), not just
		// successfully-mapped taxonomy terms - an unmapped-but-present
		// practice area still proves real research happened on this row.
		$has_real_field = '' !== $address || '' !== $phone || '' !== $website
			|| '' !== $email || ! empty( $areas_in ) || '' !== $desc;

		$key         = justice_lii_name_key( $name );
		$existing_id = $existing[ $key ] ?? 0;
		$r['action'] = $existing_id ? 'update' : ( $has_real_field ? 'create_publish' : 'create_draft' );
		$r['city']   = $city;
		$r['areas']  = $mapped;

		if ( $dry_run ) {
			$r['matched_id'] = $existing_id;
			$report[]        = $r;
			if ( $existing_id ) {
				$updated++;
			} elseif ( $has_real_field ) {
				$created++;
			} else {
				$drafted++;
			}
			continue;
		}

		$rank_entries = is_array( $row['rank_entries'] ?? null ) ? $row['rank_entries'] : array();

		if ( $existing_id ) {
			$post_id = $existing_id;

			// Enrichment only: never overwrite a field that already has a
			// value - a claimed or richer profile's own data always wins.
			$fill = array(
				'office_address'     => $address,
				'phone'              => $phone,
				'website'            => $website,
				'email'              => $email,
				'firm_size_lawyers'  => $size ?: '',
				'founded_year'       => $founded ?: '',
				'branches'           => $branches,
				'address_source_url' => $addr_src,
			);

			foreach ( $fill as $meta_key => $value ) {
				if ( '' === (string) $value ) {
					continue;
				}
				if ( '' === (string) get_post_meta( $post_id, $meta_key, true ) ) {
					update_post_meta( $post_id, $meta_key, $value );
					if ( 'office_address' === $meta_key ) {
						delete_post_meta( $post_id, 'office_lat' );
						delete_post_meta( $post_id, 'office_lng' );
					}
				}
			}

			if ( '' === (string) get_post_meta( $post_id, 'bio_short', true ) && '' !== $desc ) {
				update_post_meta( $post_id, 'bio_short', $desc );
			}

			$updated++;
		} else {
			$area_line = $mapped ? implode( ', ', array_slice( $mapped, 0, 2 ) ) : 'משפט';
			$bio       = '' !== $desc
				? $desc
				: 'כרטיס מקצועי בסיסי ציבורי לא מאומת בתחום ' . $area_line
					. '. המידע הוכן ממקור פומבי לצורך תביעת הכרטיס והמשך אימות מול בעל המקצוע.';

			$post_id = wp_insert_post( array(
				'post_type'    => 'justice_lawyer',
				'post_status'  => $has_real_field ? 'publish' : 'draft',
				'post_title'   => $name,
				'post_content' => $bio,
			), true );

			if ( is_wp_error( $post_id ) ) {
				$r['action']  = 'error';
				$r['flags'][] = $post_id->get_error_message();
				$skipped++;
				$report[] = $r;
				continue;
			}

			update_post_meta( $post_id, 'lawyer_full_name', $name );
			update_post_meta( $post_id, 'firm_name', $name );
			update_post_meta( $post_id, 'bio_short', $bio );
			update_post_meta( $post_id, 'office_address', $address );
			update_post_meta( $post_id, 'phone', $phone );
			update_post_meta( $post_id, 'website', $website );
			update_post_meta( $post_id, 'email', $email );
			update_post_meta( $post_id, 'entity_type', 'firm' );
			update_post_meta( $post_id, 'firm_size_lawyers', $size );
			update_post_meta( $post_id, 'founded_year', $founded );
			update_post_meta( $post_id, 'branches', $branches );
			update_post_meta( $post_id, 'address_source_url', $addr_src );
			update_post_meta( $post_id, 'source_notes', $notes );
			// license_status intentionally NOT written: 'unknown' is not a fact,
			// and the profile template prints whatever lands here (owner report
			// 2026-07-18: raw "unknown" rendered on every imported profile).
			update_post_meta( $post_id, 'plan_type', 'free' );
			update_post_meta( $post_id, 'profile_status', $has_real_field ? 'public' : 'pending' );
			update_post_meta( $post_id, 'subscription_status', 'inactive' );
			update_post_meta( $post_id, 'verification_status', 'unverified' );
			update_post_meta( $post_id, 'source_type', 'public_ranking_index' );
			// source_url mirrors address_source_url (the existing admin
			// meta box and approval-gate scaffolding read this exact key)
			// but the two can legitimately differ - a firm's general
			// "how we found this record" source vs. the citation for its
			// specific address - so both are kept.
			update_post_meta( $post_id, 'source_url', $addr_src );
			update_post_meta( $post_id, 'internal_notes', 'PUBLIC_BASIC_CARD | source=law_firm_full_index_2026_07 | rank internal only, never public | do_not_copy_reviews_or_photos | claim_and_verify_flow' );
			// Hard rule (owner order): internal ranking data must never
			// produce ANY nonzero public ordering advantage, even
			// invisibly. Only a paid-plan activation may move this.
			update_post_meta( $post_id, 'priority_score', 0 );

			$existing[ $key ] = (int) $post_id;
			$has_real_field ? $created++ : $drafted++;
		}

		if ( $mapped ) {
			wp_set_object_terms( $post_id, $mapped, 'practice-areas', true );
		}
		if ( '' !== $city ) {
			wp_set_object_terms( $post_id, array( $city ), 'city', true );
		}

		foreach ( $rank_entries as $entry ) {
			if ( ! is_array( $entry ) || empty( $entry['guide'] ) ) {
				continue;
			}

			$clean = array(
				'guide' => sanitize_text_field( (string) $entry['guide'] ),
				'tier'  => (int) ( $entry['tier'] ?? 0 ),
				'label' => sanitize_text_field( (string) ( $entry['label'] ?? '' ) ),
				'area'  => sanitize_text_field( (string) ( $entry['area'] ?? '' ) ),
				'year'  => (int) ( $entry['year'] ?? 0 ),
			);

			$already = array_filter( (array) get_post_meta( $post_id, 'jt_rank_entry' ), function ( $e ) use ( $clean ) {
				return is_array( $e ) && ( $e['guide'] ?? '' ) === $clean['guide'] && ( $e['area'] ?? '' ) === $clean['area'] && (int) ( $e['year'] ?? 0 ) === $clean['year'];
			} );

			if ( ! $already ) {
				add_post_meta( $post_id, 'jt_rank_entry', $clean );
			}
		}

		$r['post_id'] = (int) $post_id;
		$report[]     = $r;
	}

	if ( ! $dry_run ) {
		if ( function_exists( 'justice_ops_purge_map_feed_cache' ) ) {
			justice_ops_purge_map_feed_cache();
		} else {
			delete_transient( 'justice_map_geojson_v1' );
			delete_transient( 'justice_map_geojson_v2' );
		}
	}

	return new WP_REST_Response( array(
		'dry_run' => $dry_run,
		'created' => $created,
		'drafted' => $drafted,
		'updated' => $updated,
		'skipped' => $skipped,
		'rows'    => $report,
	), 200 );
}
