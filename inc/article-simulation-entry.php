<?php
/** Contextual product entry. Read-only rendering; no content or SEO writes. */
if ( ! defined( 'ABSPATH' ) ) { exit; }

function justice_theme_article_simulation_topic( int $post_id ): string {
	$slug = (string) get_post_field( 'post_name', $post_id );
	$cluster = function_exists( 'justice_theme_cluster_for_slug' ) ? justice_theme_cluster_for_slug( $slug ) : null;
	$key = $cluster['key'] ?? '';
	// Published criminal guides predate the entity-wave registry. Classify their
	// simulation context only; do not change keyword ownership or content links.
	if ( ! $key && in_array( $slug, array(
		'police-investigation-rights', 'consultation-before-police-questioning',
		'recording-interrogation-documentation', 'summons-interrogation-warning-rights',
		'detention-days', 'expunge-closed-cases-record', 'criminal-evidence',
		'criminal-record-deletion', 'dangerous-drugs-ordinance', 'drug-possession',
	), true ) ) { $key = 'criminal-law'; }
	if ( ! $key && 'family-law' === $slug ) { $key = 'family-law'; }
	// Read Claude's registry without changing files, seeded pages, or relationships.
	if ( ! $key && function_exists( 'justice_ops_entity_waves' ) ) {
		static $entity_pillars = null;
		if ( null === $entity_pillars ) {
			$entity_pillars = array();
			foreach ( justice_ops_entity_waves() as $file ) {
				$entries = include $file;
				foreach ( (array) $entries as $entry ) {
					if ( ! empty( $entry['slug'] ) && ! empty( $entry['pillar'] ) ) {
						$entity_pillars[ $entry['slug'] ] = $entry['pillar'];
					}
				}
			}
		}
		$pillar = $entity_pillars[ $slug ] ?? '';
		if ( $pillar && function_exists( 'justice_theme_cluster_for_slug' ) ) {
			$cluster = justice_theme_cluster_for_slug( $pillar );
			$key = $cluster['key'] ?? ( 'family-law' === $pillar ? 'family-law' : '' );
		}
	}
	if ( ! $key && function_exists( 'justice_theme_get_primary_practice_area' ) ) {
		$term = justice_theme_get_primary_practice_area( $post_id );
		$aliases = array( 'family-law' => 'family-law', 'criminal-law' => 'criminal-law',
			'real-estate-law' => 'real-estate', 'traffic-law' => 'traffic-law', 'labor-law' => 'employment',
			'inheritance-law' => 'inheritance', 'medical-malpractice' => 'medical-malpractice',
			'medical-malpractice-law' => 'medical-malpractice', 'torts' => 'personal-injury',
			'personal-injury-law' => 'personal-injury', 'tax-law' => 'tax', 'immigration-law' => 'immigration' );
		$key = $term && ! is_wp_error( $term ) ? ( $aliases[ $term->slug ] ?? '' ) : '';
	}
	if ( 'family-law' === $key && false !== strpos( $slug, 'divorce' ) ) { return 'divorce'; }
	return in_array( $key, array( 'family-law', 'criminal-law', 'real-estate', 'medical-malpractice',
		'personal-injury', 'traffic-law', 'employment', 'inheritance', 'immigration', 'international-real-estate', 'tax' ), true ) ? $key : '';
}

function justice_theme_article_simulation_url( string $topic, string $purpose ): string {
	$purpose = in_array( $purpose, array( 'court_rehearsal', 'mediation', 'witness_prep' ), true ) ? $purpose : 'court_rehearsal';
	$params = array( 'entry' => 'role', 'audience' => 'guest', 'lang' => 'he',
		'purpose' => $purpose, 'topic' => $topic );
	return 'https://jus-tice.com/#/simulation?' . http_build_query( $params, '', '&', PHP_QUERY_RFC3986 );
}

function justice_theme_article_simulation_entry( string $content ): string {
	$post_id = (int) get_the_ID();
	// Practice landing templates render their queried page body outside WP's loop.
	// Accept that one page, never a related card or secondary query.
	if ( is_admin() || is_feed() || ! is_singular( array( 'post', 'page', 'articles' ) ) || ! is_main_query()
		|| $post_id !== (int) get_queried_object_id()
		|| ! function_exists( 'justice_theme_new_look_active' ) || ! justice_theme_new_look_active()
		|| false !== strpos( $content, 'data-hadmaia-article-entry' ) ) { return $content; }
	$topic = justice_theme_article_simulation_topic( $post_id );
	if ( ! $topic ) { return $content; }
	$mediation = ! in_array( $topic, array( 'criminal-law', 'traffic-law', 'immigration', 'tax' ), true );
	$block = '<aside class="l3-article-simulation" data-hadmaia-article-entry="' . esc_attr( $topic ) . '" aria-label="תרגול המקרה שלכם">'
		. '<a class="l3-article-simulation__visual" href="' . esc_url( justice_theme_article_simulation_url( $topic, 'court_rehearsal' ) ) . '" aria-label="פתיחת סימולציה של דיון"><img src="https://jus-tice.com/brand/hadmaya-cockpit-showcase-v1.webp" alt="מערכת הסימולציה: משתתפים, תמלול, עריכת המקרה והזמנה לדיון" width="1536" height="961" loading="lazy" decoding="async"><span>Hadmaya <span aria-hidden="true">↗</span></span></a>'
		. '<div><strong>איך זה יישמע בדיון?</strong><p>תרגלו את המקרה שלכם. אפשר להתחיל עכשיו, לדייק פרטים בהמשך ולהזמין את הצד השני להצטרף.</p></div>'
		. '<div class="l3-article-simulation__actions"><a href="' . esc_url( justice_theme_article_simulation_url( $topic, 'court_rehearsal' ) ) . '">תרגול דיון</a>';
	if ( $mediation ) {
		$block .= '<a class="l3-article-simulation__secondary" href="' . esc_url( justice_theme_article_simulation_url( $topic, 'mediation' ) ) . '">תרגול גישור</a>';
	}
	if ( 'criminal-law' === $topic ) {
		$message = "שלום, אני מתעניין/ת בפיילוט של סימולציית חקירה במשטרה.\nהגעתי מהעמוד: "
			. wp_strip_all_tags( get_the_title( $post_id ) ) . "\n" . get_permalink( $post_id );
		$block .= '<p class="l3-investigation-interest">רוצים להתכונן לחקירה במשטרה? דברו איתנו על השתתפות בפיילוט.</p>'
			. '<a class="l3-article-simulation__secondary" data-investigation-interest="pilot" data-whatsapp-surface="investigation_simulation_interest" href="'
			. esc_url( 'https://wa.me/972525101555?text=' . rawurlencode( $message ) )
			. '" target="_blank" rel="noopener noreferrer">פנייה לגבי סימולציית חקירה</a>';
	}
	$block .= '</div><small>סימולציה להכנה, לא ייעוץ משפטי.</small></aside>';
	// Preserve the article and Claude's contextual links exactly. Insert after its opening paragraph.
	$end = stripos( $content, '</p>' );
	return false === $end ? $content . $block : substr_replace( $content, $block, $end + 4, 0 );
}
add_filter( 'the_content', 'justice_theme_article_simulation_entry', 30 );