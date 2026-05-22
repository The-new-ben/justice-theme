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

function justice_theme_article_visible_attribution( int $post_id ): array {
	$reviewer = justice_theme_authority_article_reviewer_schema( $post_id );
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
