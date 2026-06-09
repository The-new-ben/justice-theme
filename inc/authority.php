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
		'name'        => '', // e.g. 'עו״ד ישראל ישראלי' — exactly as in ספר עורכי הדין
		'slug'        => 'legal-editor',
		'bar_number'  => '', // real license number from israelbar.org.il
		'jobTitle'    => 'עורך דין, עורך ומבקר תוכן משפטי',
		'admitted'    => '', // year admitted, e.g. '2009'
		'law_school'  => '', // e.g. 'אוניברסיטת תל אביב, הפקולטה למשפטים'
		'profile_url' => '', // author bio page, e.g. home_url('/legal-editor/')
		'same_as'     => array(), // REAL urls only: israelbar.org.il profile + real LinkedIn
		'knowsAbout'  => array( 'Israeli Law', 'Legal Information', 'Civil Procedure' ),
	);
}

/**
 * Whether the site legal reviewer has the minimum real data to be emitted.
 * Requires both a name and a bar number — anything less stays silent (no fabrication).
 */
function justice_theme_site_legal_reviewer_is_configured(): bool {
	$r = justice_theme_site_legal_reviewer();
	return '' !== trim( (string) $r['name'] ) && '' !== trim( (string) $r['bar_number'] );
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

	$person = array(
		'@type'         => 'Person',
		'@id'           => justice_theme_public_url( home_url( '/#person-legal-editor' ) ),
		'name'          => (string) $r['name'],
		'url'           => $url,
		'jobTitle'      => (string) $r['jobTitle'],
		'worksFor'      => justice_theme_authority_organization_schema(),
		'knowsAbout'    => array_values( (array) $r['knowsAbout'] ),
		'hasCredential' => array(
			'@type'              => 'EducationalOccupationalCredential',
			'credentialCategory' => 'Bar admission',
			'identifier'         => (string) $r['bar_number'],
			'recognizedBy'       => array(
				'@type' => 'Organization',
				'name'  => 'לשכת עורכי הדין בישראל',
				'url'   => 'https://www.israelbar.org.il',
			),
		),
	);

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
	$expert = justice_theme_authority_article_reviewer_schema( $post_id );
	if ( $expert ) {
		return $expert;
	}

	return justice_theme_site_legal_reviewer_schema();
}

function justice_theme_article_visible_attribution( int $post_id ): array {
	$reviewer = justice_theme_article_reviewer_with_fallback( $post_id );
	if ( $reviewer ) {
		return array(
			'label' => 'נבדק משפטית על ידי',
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
