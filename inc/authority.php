<?php
/**
 * Author and reviewer authority helpers.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_authority_organization_schema(): array {
	return array(
		'@type' => 'Organization',
		'@id'   => justice_theme_public_url( home_url( '/#organization' ) ),
		'name'  => get_bloginfo( 'name' ) ?: 'Jus-Tice',
		'url'   => justice_theme_public_url( home_url( '/' ) ),
	);
}

/**
 * The site's responsible legal reviewer — a REAL licensed attorney (the site owner).
 *
 * E-E-A-T for YMYL legal content requires a named, credentialed human standing behind the
 * content. The owner is a practicing Israeli advocate, so the owner is the reviewer of record
 * for every legal article that has no more specific expert (Maya Rotenberg covers family law).
 *
 * HONESTY GUARD: returns placeholders until real data is filled in. While name or bar_number
 * is empty, justice_theme_site_legal_reviewer_is_configured() is false and NOTHING is emitted —
 * no half-built Person schema, no invented credentials, no fake sameAs. Fill the real values
 * (exactly as in the Israel Bar registry) to activate site-wide.
 *
 * @return array<string,mixed>
 */
function justice_theme_site_legal_reviewer(): array {
	return array(
		// Real data from the Israel Bar Association lawyer card (owner-supplied 2026-06-12).
		// Card: https://www.israelbar.biz/lawyer-fd/?lawyer=Cqcs/1T4N0I
		'name'             => 'עו"ד בן בטש',
		'name_en'          => 'Ben Betesh, Adv.',
		'slug'             => 'adv-ben-betesh',
		'bar_number'       => '', // not displayed on the IBA card; registry URL is the verifiable credential
		'bar_registry_url' => 'https://www.israelbar.biz/lawyer-fd/?lawyer=Cqcs/1T4N0I',
		'jobTitle'         => 'עורך דין, עורך אחראי ומבקר התוכן המשפטי של Jus-Tice',
		'admitted'         => '2000-11-30', // תאריך הסמכה per the IBA card
		'district'         => 'תל אביב',
		'law_school'       => '',
		'profile_url'      => justice_theme_public_url( home_url( '/adv-ben-betesh/' ) ),
		'same_as'          => array(
			'https://www.israelbar.biz/lawyer-fd/?lawyer=Cqcs/1T4N0I',
		),
		'knowsAbout'       => array( 'Israeli Law', 'Civil Law', 'Legal Information', 'Legal Procedure' ),
	);
}

/**
 * Whether the site legal reviewer has the minimum REAL data to be emitted.
 * Requires a name plus a verifiable credential: a bar number or a bar-registry
 * profile URL. Anything less stays silent (no fabrication).
 */
function justice_theme_site_legal_reviewer_is_configured(): bool {
	$r = justice_theme_site_legal_reviewer();
	$has_credential = '' !== trim( (string) $r['bar_number'] ) || '' !== trim( (string) ( $r['bar_registry_url'] ?? '' ) );
	return '' !== trim( (string) $r['name'] ) && $has_credential;
}

/**
 * Person schema for the site legal reviewer, or null when not configured.
 *
 * @return array<string,mixed>|null
 */
function justice_theme_site_legal_reviewer_schema(): ?array {
	if ( ! justice_theme_site_legal_reviewer_is_configured() ) {
		return null;
	}

	$r   = justice_theme_site_legal_reviewer();
	$url = '' !== trim( (string) $r['profile_url'] )
		? (string) $r['profile_url']
		: justice_theme_public_url( home_url( '/' ) );

	$credential = array(
		'@type'              => 'EducationalOccupationalCredential',
		'credentialCategory' => 'Bar admission',
		'recognizedBy'       => array(
			'@type' => 'Organization',
			'name'  => 'לשכת עורכי הדין בישראל',
			'url'   => 'https://www.israelbar.org.il',
		),
	);
	if ( '' !== trim( (string) $r['bar_number'] ) ) {
		$credential['identifier'] = (string) $r['bar_number'];
	}
	if ( '' !== trim( (string) ( $r['bar_registry_url'] ?? '' ) ) ) {
		$credential['url'] = (string) $r['bar_registry_url'];
	}
	if ( '' !== trim( (string) ( $r['admitted'] ?? '' ) ) ) {
		$credential['dateCreated'] = (string) $r['admitted'];
	}

	$person = array(
		'@type'         => 'Person',
		'@id'           => justice_theme_public_url( home_url( '/#person-legal-editor' ) ),
		'name'          => (string) $r['name'],
		'url'           => $url,
		'jobTitle'      => (string) $r['jobTitle'],
		'worksFor'      => justice_theme_authority_organization_schema(),
		'knowsAbout'    => array_values( (array) $r['knowsAbout'] ),
		'hasCredential' => $credential,
	);
	if ( '' !== trim( (string) ( $r['name_en'] ?? '' ) ) ) {
		$person['alternateName'] = (string) $r['name_en'];
	}

	$same_as = array_values( array_filter( array_map( 'strval', (array) $r['same_as'] ) ) );
	if ( ! empty( $same_as ) ) {
		$person['sameAs'] = $same_as;
	}
	if ( '' !== trim( (string) $r['law_school'] ) ) {
		$person['alumniOf'] = array(
			'@type' => 'EducationalOrganization',
			'name'  => (string) $r['law_school'],
		);
	}

	return $person;
}

function justice_theme_authority_verified_people(): array {
	return array(
		'advocate-maya-rotenberg' => array(
			'name'              => 'עו״ד מאיה רוטנברג',
			'fallback_url'      => justice_theme_public_url( home_url( '/lawyers/advocate-maya-rotenberg/' ) ),
			'jobTitle'          => 'עורכת דין לענייני משפחה',
			'practice_clusters' => array( 'family-law' ),
			'knowsAbout'        => array(
				'Family Law',
				'Divorce',
				'Child Custody',
				'Child Support',
				'Prenuptial Agreements',
			),
		),
	);
}

function justice_theme_authority_verified_person_slug_for_post( int $post_id ): string {
	if ( ! $post_id || 'justice_lawyer' !== get_post_type( $post_id ) ) {
		return '';
	}

	$people = justice_theme_authority_verified_people();
	$slug   = sanitize_title( (string) get_post_field( 'post_name', $post_id ) );

	if ( $slug && ! empty( $people[ $slug ] ) ) {
		return $slug;
	}

	$title = get_the_title( $post_id );

	if (
		! empty( $people['advocate-maya-rotenberg'] )
		&& false !== mb_strpos( $title, rawurldecode( '%D7%9E%D7%90%D7%99%D7%94' ) )
		&& false !== mb_strpos( $title, rawurldecode( '%D7%A8%D7%95%D7%98%D7%A0%D7%91%D7%A8%D7%92' ) )
	) {
		return 'advocate-maya-rotenberg';
	}

	return '';
}

function justice_theme_authority_get_verified_person_schema( string $slug ): ?array {
	$slug   = sanitize_title( $slug );
	$people = justice_theme_authority_verified_people();

	if ( empty( $people[ $slug ] ) ) {
		return null;
	}

	$person = $people[ $slug ];
	$url    = (string) $person['fallback_url'];

	if ( function_exists( 'justice_theme_get_connected_lawyer_by_slug' ) ) {
		$lawyer = justice_theme_get_connected_lawyer_by_slug( $slug );
		if ( $lawyer instanceof WP_Post ) {
			$url = justice_theme_public_permalink( (int) $lawyer->ID );
		}
	}

	return array(
		'@type'      => 'Person',
		'@id'        => trailingslashit( $url ) . '#person',
		'name'       => (string) $person['name'],
		'url'        => $url,
		'jobTitle'   => (string) $person['jobTitle'],
		'worksFor'   => justice_theme_authority_organization_schema(),
		'knowsAbout' => array_values( (array) $person['knowsAbout'] ),
	);
}

function justice_theme_authority_article_cluster( int $post_id ): string {
	$cluster = sanitize_key( (string) get_post_meta( $post_id, 'content_cluster', true ) );
	if ( $cluster ) {
		return $cluster;
	}

	$terms = get_the_terms( $post_id, 'practice-areas' );
	if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) {
		$first = array_shift( $terms );
		return sanitize_key( (string) $first->slug );
	}

	return '';
}

function justice_theme_authority_article_reviewer_schema( int $post_id ): ?array {
	$connected_slug = sanitize_title( (string) get_post_meta( $post_id, 'connected_lawyer_slug', true ) );
	if ( ! $connected_slug ) {
		return null;
	}

	$people = justice_theme_authority_verified_people();
	if ( empty( $people[ $connected_slug ] ) ) {
		return null;
	}

	$cluster          = justice_theme_authority_article_cluster( $post_id );
	$allowed_clusters = array_map( 'sanitize_key', (array) $people[ $connected_slug ]['practice_clusters'] );
	if ( $cluster && ! in_array( $cluster, $allowed_clusters, true ) ) {
		return null;
	}

	return justice_theme_authority_get_verified_person_schema( $connected_slug );
}

/**
 * Reviewer for an article with a site-wide fallback to the owner (responsible attorney).
 *
 * Order: a verified topic expert connected to the article (e.g. Maya for family law) →
 * else the site legal reviewer (the owner) if configured → else null. This is what puts a
 * named, credentialed human on every YMYL article without fabricating anything: the fallback
 * only fires when real owner data exists.
 *
 * @param int $post_id Article ID.
 * @return array<string,mixed>|null
 */
function justice_theme_article_reviewer_with_fallback( int $post_id ): ?array {
	$expert = justice_theme_article_reviewer_expert_only( $post_id );
	if ( $expert ) {
		return $expert;
	}

	return justice_theme_site_legal_reviewer_schema();
}

/**
 * Topic-expert reviewer only (no owner fallback). Used for the TOP byline so the
 * owner appears only in the bottom reviewer box, per owner instruction.
 *
 * Order: expert explicitly connected to the article → cluster default expert
 * (family-law articles default to Maya Rotenberg, the verified family-law
 * authority, even without an explicit connection) → null.
 *
 * @param int $post_id Article ID.
 * @return array<string,mixed>|null
 */
function justice_theme_article_reviewer_expert_only( int $post_id ): ?array {
	$expert = justice_theme_authority_article_reviewer_schema( $post_id );
	if ( $expert ) {
		return $expert;
	}

	$cluster = justice_theme_authority_article_cluster( $post_id );
	if ( '' === $cluster ) {
		return null;
	}

	foreach ( justice_theme_authority_verified_people() as $slug => $person ) {
		$clusters = array_map( 'sanitize_key', (array) $person['practice_clusters'] );
		if ( in_array( $cluster, $clusters, true ) ) {
			return justice_theme_authority_get_verified_person_schema( $slug );
		}
	}

	return null;
}

function justice_theme_article_visible_attribution( int $post_id ): array {
	// TOP byline: topic expert only (Maya on family law). The site legal reviewer
	// (the owner) is deliberately NOT shown here; he appears in the bottom
	// reviewer box rendered by justice_theme_append_reviewer_box().
	$reviewer = justice_theme_article_reviewer_expert_only( $post_id );
	if ( $reviewer ) {
		return array(
			'label' => 'נבדק מקצועית על ידי',
			'name'  => (string) $reviewer['name'],
			'url'   => (string) $reviewer['url'],
		);
	}

	$organization = justice_theme_authority_organization_schema();

	return array(
		'label' => 'נערך על ידי',
		'name'  => (string) $organization['name'],
		'url'   => (string) $organization['url'],
	);
}

/**
 * Bottom-of-article reviewer box. This is where the site legal reviewer (the
 * owner) is shown: end of the article, not the top, per owner instruction.
 *
 * Renders for singular articles/posts and mapped cluster pages, main query only.
 * Shows whoever the full reviewer chain resolves (family-law → Maya; everything
 * else → the owner once configured; nothing when nobody real resolves).
 *
 * @param string $content Post content.
 * @return string
 */
function justice_theme_append_reviewer_box( string $content ): string {
	if ( is_admin() || ! is_singular() || ! in_the_loop() || ! is_main_query() ) {
		return $content;
	}

	$post_id  = (int) get_the_ID();
	$reviewer = justice_theme_article_reviewer_with_fallback( $post_id );
	if ( ! $reviewer ) {
		return $content;
	}

	$r        = justice_theme_site_legal_reviewer();
	$is_owner = isset( $reviewer['@id'] ) && false !== strpos( (string) $reviewer['@id'], '#person-legal-editor' );

	$line = $is_owner && '' !== trim( (string) ( $r['admitted'] ?? '' ) )
		? sprintf( 'חבר לשכת עורכי הדין בישראל משנת %s.', substr( (string) $r['admitted'], 0, 4 ) )
		: '';

	ob_start();
	?>
	<aside class="reviewer-box" aria-label="<?php esc_attr_e( 'ביקורת משפטית', 'justice-theme' ); ?>">
		<p class="reviewer-box__line">
			<strong><?php esc_html_e( 'נבדק משפטית על ידי', 'justice-theme' ); ?></strong>
			<a href="<?php echo esc_url( (string) $reviewer['url'] ); ?>"><?php echo esc_html( (string) $reviewer['name'] ); ?></a>
			<?php if ( '' !== $line ) : ?>
				<span class="reviewer-box__cred"><?php echo esc_html( $line ); ?></span>
			<?php endif; ?>
		</p>
		<p class="reviewer-box__note"><?php esc_html_e( 'המידע באתר הוא מידע כללי ואינו מהווה ייעוץ משפטי. לפני פעולה משפטית יש להתייעץ עם עורך דין.', 'justice-theme' ); ?></p>
	</aside>
	<?php
	return $content . (string) ob_get_clean();
}
add_filter( 'the_content', 'justice_theme_append_reviewer_box', 24 );

/**
 * Seed the legal-editor bio page into the CMS (real WordPress page, not a
 * virtual route), following the theme's gated seeding pattern. Runs once when
 * an admin enables the filter; safe to leave enabled (idempotent).
 */
function justice_theme_seed_legal_editor_page(): void {
	if ( ! justice_theme_admin_cms_write_enabled( 'justice_theme_enable_legal_editor_page_seed' ) || get_option( 'justice_legal_editor_page_seeded_v1' ) ) {
		return;
	}

	if ( get_page_by_path( 'adv-ben-betesh', OBJECT, 'page' ) ) {
		update_option( 'justice_legal_editor_page_seeded_v1', 1, false );
		return;
	}

	wp_insert_post( array(
		'post_type'    => 'page',
		'post_status'  => 'publish',
		'post_name'    => 'adv-ben-betesh',
		'post_title'   => 'עו"ד בן בטש',
		'post_content' => '',
		'meta_input'   => array(
			'_wp_page_template' => 'page-legal-editor.php',
		),
	) );

	update_option( 'justice_legal_editor_page_seeded_v1', 1, false );
}
add_action( 'admin_init', 'justice_theme_seed_legal_editor_page' );
