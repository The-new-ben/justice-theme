<?php
/**
 * E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) System
 *
 * Implements Google's highest standards for YMYL legal content:
 * - Named attorney author bylines with credentials
 * - ReviewedBy schema (secondary expert review attribution)
 * - Legal source citations (Knesset, court rulings, Ministry data)
 * - Trust badge strip (bar membership, years, review count)
 * - Freshness signals (dateModified, "last updated" display)
 * - Legal disclaimer block
 * - Enhanced Article schema with all E-E-A-T fields
 * - Person schema with hasCredential, alumniOf, memberOf
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ============================================================================
// AUTHOR REGISTRY — Maps practice areas to named attorneys
// ============================================================================

/**
 * Registry of named attorney authors per practice area.
 * Used for E-E-A-T attribution across articles and pillar pages.
 *
 * @return array
 */
function justice_eeat_author_registry() {
	$home = justice_theme_public_url( home_url( '/' ) );
	return array(
		'family-law'            => array(
			'@id'        => $home . '#person-maya-rotenberg',
			'name'       => 'עו"ד מאיה רוטנברג',
			'slug'       => 'maya-rotenberg',
			'wp_post_id' => 19130,
			'title'      => 'עורכת דין - מומחית בדיני משפחה וגירושין',
			'bar_member' => 'לשכת עורכי הדין בישראל',
			'experience' => '10+',
			'areas'      => array( 'family-law', 'divorce', 'child-support', 'child-custody', 'divorce-agreement', 'divorce-mediation', 'consensual-divorce' ),
		),
		'criminal-law'          => array(
			'@id'        => $home . '#person-sharon-nahari',
			'name'       => 'עו"ד שרון נהרי',
			'slug'       => 'sharon-nahari',
			'wp_post_id' => 19309,
			'title'      => 'עורך דין פלילי - מומחה במשפט פלילי וצווארון לבן',
			'bar_member' => 'לשכת עורכי הדין בישראל',
			'experience' => '12+',
			'areas'      => array( 'criminal-law', 'criminal-defense', 'police-records', 'white-collar', 'drug-offenses' ),
		),
		'medical-malpractice'   => array(
			'@id'        => $home . '#person-editorial-team',
			'name'       => 'צוות המשפטנים של Jus-Tice',
			'slug'       => '',
			'wp_post_id' => 0,
			'title'      => 'צוות עורכי דין ומומחים משפטיים',
			'bar_member' => 'לשכת עורכי הדין בישראל',
			'experience' => '15+',
			'areas'      => array( 'medical-malpractice', 'birth-injury', 'malpractice-compensation' ),
		),
		'real-estate'           => array(
			'@id'        => $home . '#person-editorial-team',
			'name'       => 'צוות המשפטנים של Jus-Tice',
			'slug'       => '',
			'wp_post_id' => 0,
			'title'      => 'צוות עורכי דין מומחים',
			'bar_member' => 'לשכת עורכי הדין בישראל',
			'experience' => '15+',
			'areas'      => array( 'real-estate', 'real-estate-attorney' ),
		),
		'inheritance'           => array(
			'@id'        => $home . '#person-editorial-team',
			'name'       => 'צוות המשפטנים של Jus-Tice',
			'slug'       => '',
			'wp_post_id' => 0,
			'title'      => 'צוות עורכי דין מומחים',
			'bar_member' => 'לשכת עורכי הדין בישראל',
			'experience' => '15+',
			'areas'      => array( 'inheritance', 'inheritance-lawyer', 'wills' ),
		),
	);
}

/**
 * Resolve the author for the current page based on practice area meta or page slug.
 *
 * @param int $post_id Post ID.
 * @return array Author data array from registry.
 */
function justice_eeat_resolve_author( $post_id = 0 ) {
	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}

	$registry = justice_eeat_author_registry();
	$home_url = justice_theme_public_url( home_url( '/' ) );

	// 1. Check explicit author_practice_area meta
	$meta_area = get_post_meta( $post_id, 'author_practice_area', true );
	if ( $meta_area && isset( $registry[ $meta_area ] ) ) {
		return $registry[ $meta_area ];
	}

	// 2. Check page slug against known areas
	$slug = get_post_field( 'post_name', $post_id );
	foreach ( $registry as $area => $author ) {
		foreach ( $author['areas'] as $area_slug ) {
			if ( false !== strpos( $slug, $area_slug ) ) {
				return $author;
			}
		}
	}

	// 3. Check taxonomy
	$terms = get_the_terms( $post_id, 'practice-areas' );
	if ( $terms && ! is_wp_error( $terms ) ) {
		$term_slug = $terms[0]->slug;
		foreach ( $registry as $area => $author ) {
			if ( false !== strpos( $term_slug, str_replace( '-law', '', $area ) ) ) {
				return $author;
			}
		}
	}

	// 4. Default: editorial team
	return array(
		'@id'        => $home_url . '#person-editorial-team',
		'name'       => 'צוות המשפטנים של Jus-Tice',
		'slug'       => '',
		'wp_post_id' => 0,
		'title'      => 'צוות עורכי דין ומומחים משפטיים',
		'bar_member' => 'לשכת עורכי הדין בישראל',
		'experience' => '15+',
		'areas'      => array(),
	);
}

// ============================================================================
// ENHANCED ARTICLE SCHEMA — Full E-E-A-T signals
// ============================================================================

/**
 * Output enhanced Article schema with full E-E-A-T fields.
 * Replaces the basic schema.php article schema for pillar/cluster pages.
 *
 * @param int   $post_id Post ID.
 * @param array $author  Resolved author array.
 */
function justice_eeat_article_schema( $post_id, $author ) {
	$home_url    = justice_theme_public_url( home_url( '/' ) );
	$page_url    = esc_url_raw( justice_theme_public_permalink( $post_id ) );
	$description = get_post_meta( $post_id, 'seo_description', true );
	$keywords    = get_post_meta( $post_id, 'secondary_keywords', true );
	$word_count  = str_word_count( wp_strip_all_tags( get_post_field( 'post_content', $post_id ) ) );

	// Build citations from post meta (comma-separated list of source URLs or names)
	$citations_raw = get_post_meta( $post_id, 'legal_citations', true );
	$citations     = array();
	if ( $citations_raw ) {
		foreach ( explode( "\n", $citations_raw ) as $cite ) {
			$cite = trim( $cite );
			if ( $cite ) {
				$citations[] = array(
					'@type' => 'CreativeWork',
					'name'  => $cite,
				);
			}
		}
	}

	// Person entity for the author
	$author_entity = array(
		'@type'      => 'Person',
		'@id'        => $author['@id'],
		'name'       => $author['name'],
		'jobTitle'   => $author['title'],
		'memberOf'   => array(
			'@type' => 'Organization',
			'name'  => $author['bar_member'],
			'url'   => 'https://www.israelbar.org.il/',
		),
		'worksFor'   => array(
			'@type' => 'LegalService',
			'@id'   => $home_url . '#organization',
			'name'  => 'Jus-Tice',
			'url'   => $home_url,
		),
		'knowsAbout' => $author['areas'],
	);

	// Add profile URL if author has a profile page
	if ( ! empty( $author['wp_post_id'] ) ) {
		$author_entity['url'] = esc_url_raw( justice_theme_public_permalink( $author['wp_post_id'] ) );
	}

	$schema = array(
		'@context'         => 'https://schema.org',
		'@type'            => 'LegalService', // Wraps the article for YMYL legal context
		'@id'              => $home_url . '#organization',
	);

	$article = array(
		'@context'         => 'https://schema.org',
		'@type'            => 'Article',
		'@id'              => $page_url . '#article',
		'headline'         => wp_strip_all_tags( get_the_title( $post_id ) ),
		'datePublished'    => get_the_date( DATE_W3C, $post_id ),
		'dateModified'     => get_the_modified_date( DATE_W3C, $post_id ),
		'inLanguage'       => 'he',
		'mainEntityOfPage' => $page_url,
		'wordCount'        => $word_count,
		'author'           => $author_entity,
		'reviewedBy'       => $author_entity, // Same attorney both authors and reviews
		'publisher'        => array(
			'@type' => 'LegalService',
			'@id'   => $home_url . '#organization',
			'name'  => 'Jus-Tice - פורטל משפטי ישראלי',
			'url'   => $home_url,
			'logo'  => array(
				'@type' => 'ImageObject',
				'url'   => $home_url . 'wp-content/uploads/logo.png',
			),
		),
		'about'            => array(
			'@type' => 'LegalService',
			'name'  => implode( ', ', (array) $author['areas'] ),
		),
	);

	if ( $description ) {
		$article['description'] = wp_strip_all_tags( $description );
	}
	if ( $keywords ) {
		$article['keywords'] = wp_strip_all_tags( $keywords );
	}
	if ( ! empty( $citations ) ) {
		$article['citation'] = $citations;
	}

	// Featured image
	if ( has_post_thumbnail( $post_id ) ) {
		$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), 'full' );
		if ( ! empty( $image[0] ) ) {
			$article['image'] = array(
				'@type'  => 'ImageObject',
				'url'    => esc_url_raw( $image[0] ),
				'width'  => $image[1],
				'height' => $image[2],
			);
		}
	}

	justice_theme_print_schema( $article );
}

// ============================================================================
// PERSON SCHEMA — Full entity for each named attorney
// ============================================================================

/**
 * Output standalone Person schema blocks for each attorney.
 * Runs on front page to pre-declare entities for cross-page linking.
 */
function justice_eeat_person_entities_schema() {
	if ( ! is_front_page() ) {
		return;
	}

	$registry = justice_eeat_author_registry();
	$home_url = justice_theme_public_url( home_url( '/' ) );

	$persons = array();
	$seen    = array();

	foreach ( $registry as $area => $author ) {
		if ( empty( $author['wp_post_id'] ) || isset( $seen[ $author['@id'] ] ) ) {
			continue;
		}
		$seen[ $author['@id'] ] = true;

		$person = array(
			'@type'      => 'Person',
			'@id'        => $author['@id'],
			'name'       => $author['name'],
			'jobTitle'   => $author['title'],
			'inLanguage' => 'he',
			'memberOf'   => array(
				array(
					'@type' => 'Organization',
					'name'  => $author['bar_member'],
					'url'   => 'https://www.israelbar.org.il/',
				),
				array(
					'@type' => 'LegalService',
					'@id'   => $home_url . '#organization',
				),
			),
			'knowsAbout'  => $author['areas'],
			'hasCredential' => array(
				'@type'       => 'EducationalOccupationalCredential',
				'name'        => 'רישיון עריכת דין - ישראל',
				'description' => 'חבר/ה בלשכת עורכי הדין בישראל',
				'recognizedBy' => array(
					'@type' => 'Organization',
					'name'  => 'לשכת עורכי הדין בישראל',
					'url'   => 'https://www.israelbar.org.il/',
				),
			),
		);

		if ( $author['wp_post_id'] ) {
			$person['url'] = esc_url_raw( justice_theme_public_permalink( $author['wp_post_id'] ) );
		}

		$persons[] = $person;
	}

	if ( ! empty( $persons ) ) {
		justice_theme_print_schema( array(
			'@context' => 'https://schema.org',
			'@graph'   => $persons,
		) );
	}
}
add_action( 'wp_head', 'justice_eeat_person_entities_schema', 25 );

// ============================================================================
// AUTHOR BYLINE TEMPLATE — Visible to users + Google
// ============================================================================

/**
 * Render the author byline strip above article content.
 * This visible attribution is a critical E-E-A-T signal.
 *
 * @param int   $post_id Post ID.
 * @param array $author  Resolved author data.
 */
function justice_eeat_render_author_byline( $post_id, $author ) {
	$modified_date  = get_the_modified_date( 'j F Y', $post_id );
	$published_date = get_the_date( 'j F Y', $post_id );
	$author_url     = '';

	if ( ! empty( $author['wp_post_id'] ) ) {
		$author_url = justice_theme_public_permalink( $author['wp_post_id'] );
	}

	$avatar_html = '';
	if ( ! empty( $author['wp_post_id'] ) ) {
		$thumb_id = get_post_thumbnail_id( $author['wp_post_id'] );
		if ( $thumb_id ) {
			$avatar_html = wp_get_attachment_image( $thumb_id, array( 60, 60 ), false, array(
				'class' => 'eeat-byline__avatar',
				'alt'   => esc_attr( $author['name'] ),
			) );
		}
	}

	if ( ! $avatar_html ) {
		// Fallback: initials avatar
		$initials    = '';
		$name_parts  = explode( ' ', $author['name'] );
		foreach ( $name_parts as $part ) {
			$clean = trim( str_replace( array( 'עו"ד', "עו'ד" ), '', $part ) );
			if ( $clean ) {
				$initials .= mb_substr( $clean, 0, 1 );
			}
			if ( mb_strlen( $initials ) >= 2 ) {
				break;
			}
		}
		$avatar_html = '<div class="eeat-byline__initials" aria-hidden="true">' . esc_html( $initials ) . '</div>';
	}
	?>
	<div class="eeat-byline" itemscope itemtype="https://schema.org/Person" itemprop="author">
		<div class="eeat-byline__avatar-wrap">
			<?php
			if ( $author_url ) {
				echo '<a href="' . esc_url( $author_url ) . '" class="eeat-byline__avatar-link" itemprop="url">' . $avatar_html . '</a>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			} else {
				echo $avatar_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			}
			?>
		</div>
		<div class="eeat-byline__info">
			<div class="eeat-byline__name-row">
				<span class="eeat-byline__label"><?php esc_html_e( 'נכתב ונסקר על ידי:', 'justice-theme' ); ?></span>
				<?php if ( $author_url ) : ?>
					<a href="<?php echo esc_url( $author_url ); ?>" class="eeat-byline__name" itemprop="name"><?php echo esc_html( $author['name'] ); ?></a>
				<?php else : ?>
					<span class="eeat-byline__name" itemprop="name"><?php echo esc_html( $author['name'] ); ?></span>
				<?php endif; ?>
			</div>
			<div class="eeat-byline__credentials">
				<span class="eeat-byline__title" itemprop="jobTitle"><?php echo esc_html( $author['title'] ); ?></span>
				<span class="eeat-byline__separator" aria-hidden="true">|</span>
				<span class="eeat-byline__bar"><?php echo esc_html( $author['bar_member'] ); ?></span>
				<span class="eeat-byline__separator" aria-hidden="true">|</span>
				<span class="eeat-byline__experience"><?php echo esc_html( $author['experience'] ); ?> <?php esc_html_e( 'שנות ניסיון', 'justice-theme' ); ?></span>
			</div>
			<div class="eeat-byline__dates">
				<time class="eeat-byline__published" datetime="<?php echo esc_attr( get_the_date( DATE_W3C, $post_id ) ); ?>">
					<?php printf( esc_html__( 'פורסם: %s', 'justice-theme' ), esc_html( $published_date ) ); ?>
				</time>
				<?php if ( $published_date !== $modified_date ) : ?>
					<span class="eeat-byline__separator" aria-hidden="true">|</span>
					<time class="eeat-byline__updated" datetime="<?php echo esc_attr( get_the_modified_date( DATE_W3C, $post_id ) ); ?>">
						<strong><?php printf( esc_html__( 'עודכן לאחרונה: %s', 'justice-theme' ), esc_html( $modified_date ) ); ?></strong>
					</time>
				<?php endif; ?>
			</div>
		</div>
		<div class="eeat-byline__trust-badges">
			<div class="eeat-byline__badge" title="<?php esc_attr_e( 'מאמר זה נסקר על ידי עורך דין מוסמך', 'justice-theme' ); ?>">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
				</svg>
				<?php esc_html_e( 'נסקר על ידי עו"ד', 'justice-theme' ); ?>
			</div>
			<div class="eeat-byline__badge" title="<?php esc_attr_e( 'מידע מבוסס על חקיקה ופסיקה ישראלית עדכנית', 'justice-theme' ); ?>">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
					<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
				</svg>
				<?php esc_html_e( 'מבוסס חקיקה ישראלית', 'justice-theme' ); ?>
			</div>
		</div>
	</div>
	<?php
}

// ============================================================================
// LEGAL DISCLAIMER BLOCK — Required for YMYL trust
// ============================================================================

/**
 * Render the legal disclaimer block below article content.
 */
function justice_eeat_render_legal_disclaimer() {
	?>
	<div class="eeat-disclaimer" role="note" aria-label="<?php esc_attr_e( 'הצהרת כתב ויתור משפטי', 'justice-theme' ); ?>">
		<div class="eeat-disclaimer__icon" aria-hidden="true">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
			</svg>
		</div>
		<div class="eeat-disclaimer__text">
			<strong><?php esc_html_e( 'הצהרה משפטית:', 'justice-theme' ); ?></strong>
			<?php esc_html_e( 'המידע במאמר זה הוא למטרות מידע כללי בלבד ואינו מהווה ייעוץ משפטי. כל מקרה שונה בנסיבותיו ובפרטיו. מומלץ להתייעץ עם עורך דין מוסמך לפני קבלת כל החלטה משפטית. Jus-Tice פורטל משפטי ישראלי — מחבר בין ציבור לעורכי דין מוסמכים.', 'justice-theme' ); ?>
		</div>
	</div>
	<?php
}

// ============================================================================
// LEGAL SOURCES CITATION BLOCK — Visible source attribution
// ============================================================================

/**
 * Render legal sources citation block.
 * Cites the key Israeli laws and data sources referenced in the content.
 *
 * @param array $sources Array of source arrays with 'name', 'url' (optional), 'type'.
 */
function justice_eeat_render_sources( $sources ) {
	if ( empty( $sources ) ) {
		return;
	}
	?>
	<div class="eeat-sources">
		<h3 class="eeat-sources__title">
			<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
				<path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
			</svg>
			<?php esc_html_e( 'מקורות ועיון נוסף', 'justice-theme' ); ?>
		</h3>
		<ul class="eeat-sources__list">
			<?php foreach ( $sources as $source ) : ?>
				<li class="eeat-sources__item">
					<?php if ( ! empty( $source['type'] ) ) : ?>
						<span class="eeat-sources__type"><?php echo esc_html( $source['type'] ); ?></span>
					<?php endif; ?>
					<?php if ( ! empty( $source['url'] ) ) : ?>
						<a href="<?php echo esc_url( $source['url'] ); ?>" rel="noopener noreferrer nofollow" target="_blank" class="eeat-sources__link">
							<?php echo esc_html( $source['name'] ); ?>
							<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="eeat-sources__external">
								<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3"/>
							</svg>
						</a>
					<?php else : ?>
						<span><?php echo esc_html( $source['name'] ); ?></span>
					<?php endif; ?>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
	<?php
}

// ============================================================================
// PRACTICE AREA DEFAULT SOURCES — Per-area legal citation defaults
// ============================================================================

/**
 * Return default legal sources per practice area for citation blocks.
 *
 * @param string $area Practice area slug.
 * @return array
 */
function justice_eeat_default_sources( $area ) {
	$sources_map = array(
		'family-law'          => array(
			array( 'type' => 'חוק', 'name' => 'חוק יחסי ממון בין בני זוג, תשל"ג-1973', 'url' => 'https://www.nevo.co.il/law_html/law01/065_001.htm' ),
			array( 'type' => 'חוק', 'name' => 'חוק הכשרות המשפטית והאפוטרופסות, תשכ"ב-1962', 'url' => 'https://www.nevo.co.il/law_html/law01/056_001.htm' ),
			array( 'type' => 'חוק', 'name' => 'חוק לתיקון דיני המשפחה (מזונות), תשי"ט-1959', 'url' => 'https://www.nevo.co.il/law_html/law01/080_001.htm' ),
			array( 'type' => 'פסיקה', 'name' => 'בע"מ 919/15 - הלכת מזונות הילדים', 'url' => '' ),
			array( 'type' => 'מקור', 'name' => 'הנהלת בתי המשפט - נתוני תיקי משפחה', 'url' => 'https://www.gov.il/he/departments/ministry_of_justice' ),
		),
		'criminal-law'        => array(
			array( 'type' => 'חוק', 'name' => 'חוק העונשין, תשל"ז-1977', 'url' => 'https://www.nevo.co.il/law_html/law01/073_001.htm' ),
			array( 'type' => 'חוק', 'name' => 'חוק סדר הדין הפלילי [נוסח משולב], תשמ"ב-1982', 'url' => 'https://www.nevo.co.il/law_html/law01/075_001.htm' ),
			array( 'type' => 'חוק', 'name' => 'חוק המרשם הפלילי ותקנת השבים, תשמ"א-1981', 'url' => 'https://www.nevo.co.il/law_html/law01/071_001.htm' ),
			array( 'type' => 'מקור', 'name' => 'דוח השנתי - פרקליטות המדינה', 'url' => 'https://www.gov.il/he/departments/state_attorney' ),
		),
		'medical-malpractice' => array(
			array( 'type' => 'חוק', 'name' => 'חוק זכויות החולה, תשנ"ו-1996', 'url' => 'https://www.nevo.co.il/law_html/law01/134_001.htm' ),
			array( 'type' => 'חוק', 'name' => 'פקודת הנזיקין [נוסח חדש]', 'url' => 'https://www.nevo.co.il/law_html/law01/062_001.htm' ),
			array( 'type' => 'חוק', 'name' => 'חוק הגנת הצרכן, תשמ"א-1981', 'url' => '' ),
			array( 'type' => 'מקור', 'name' => 'משרד הבריאות - נתוני אירועים חריגים בבתי חולים', 'url' => 'https://www.gov.il/he/departments/ministry_of_health' ),
			array( 'type' => 'מקור', 'name' => 'הנהלת בתי המשפט - פסיקה ברשלנות רפואית', 'url' => 'https://www.nevo.co.il' ),
		),
		'real-estate'         => array(
			array( 'type' => 'חוק', 'name' => 'חוק המכר (דירות), תשל"ג-1973', 'url' => 'https://www.nevo.co.il/law_html/law01/065_002.htm' ),
			array( 'type' => 'חוק', 'name' => 'חוק מיסוי מקרקעין (שבח ורכישה), תשכ"ג-1963', 'url' => 'https://www.nevo.co.il/law_html/law01/060_001.htm' ),
			array( 'type' => 'חוק', 'name' => 'חוק המקרקעין, תשכ"ט-1969', 'url' => 'https://www.nevo.co.il/law_html/law01/069_001.htm' ),
			array( 'type' => 'מקור', 'name' => 'רשות המסים - מדריך מס רכישה', 'url' => 'https://taxes.gov.il' ),
		),
		'inheritance'         => array(
			array( 'type' => 'חוק', 'name' => 'חוק הירושה, תשכ"ה-1965', 'url' => 'https://www.nevo.co.il/law_html/law01/065_003.htm' ),
			array( 'type' => 'מקור', 'name' => 'רשם הירושות - משרד המשפטים', 'url' => 'https://www.gov.il/he/departments/topics/inheritance' ),
		),
	);

	return $sources_map[ $area ] ?? array();
}

// ============================================================================
// HOOK INTO CONTENT OUTPUT
// ============================================================================

/**
 * Inject E-E-A-T byline and schema into singular legal pages.
 * Fires on the_content filter for articles, posts, and pages with legal content.
 *
 * @param string $content Post content.
 * @return string Modified content with E-E-A-T elements.
 */
function justice_eeat_inject_content_signals( $content ) {
	if ( ! is_singular() || is_admin() ) {
		return $content;
	}

	$post_id = get_the_ID();

	// Only fire on pages/articles with substantial content (legal pillar/cluster pages)
	$is_legal_page = is_singular( array( 'post', 'articles', 'page' ) ) && strlen( $content ) > 2000;
	$has_legal_meta = get_post_meta( $post_id, 'pillar_keyword', true ) || get_post_meta( $post_id, 'author_practice_area', true );

	if ( ! $is_legal_page && ! $has_legal_meta ) {
		return $content;
	}

	$author   = justice_eeat_resolve_author( $post_id );
	$slug     = get_post_field( 'post_name', $post_id );
	$area     = get_post_meta( $post_id, 'author_practice_area', true );
	if ( ! $area ) {
		// Guess from slug
		if ( strpos( $slug, 'divorce' ) !== false || strpos( $slug, 'family' ) !== false || strpos( $slug, 'child' ) !== false ) {
			$area = 'family-law';
		} elseif ( strpos( $slug, 'criminal' ) !== false || strpos( $slug, 'police' ) !== false ) {
			$area = 'criminal-law';
		} elseif ( strpos( $slug, 'medical' ) !== false || strpos( $slug, 'malpractice' ) !== false ) {
			$area = 'medical-malpractice';
		} elseif ( strpos( $slug, 'real-estate' ) !== false ) {
			$area = 'real-estate';
		} elseif ( strpos( $slug, 'inheritance' ) !== false || strpos( $slug, 'will' ) !== false ) {
			$area = 'inheritance';
		}
	}

	// Build byline HTML
	ob_start();
	justice_eeat_render_author_byline( $post_id, $author );
	$byline_html = ob_get_clean();

	// Build disclaimer HTML
	ob_start();
	justice_eeat_render_legal_disclaimer();
	$disclaimer_html = ob_get_clean();

	// Build sources HTML
	$sources = justice_eeat_default_sources( $area );
	ob_start();
	justice_eeat_render_sources( $sources );
	$sources_html = ob_get_clean();

	// Output enhanced schema
	justice_eeat_article_schema( $post_id, $author );

	return $byline_html . $content . $disclaimer_html . $sources_html;
}
add_filter( 'the_content', 'justice_eeat_inject_content_signals', 15 );
