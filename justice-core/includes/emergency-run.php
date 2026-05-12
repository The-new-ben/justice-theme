<?php
/**
 * Emergency Deployment Script
 * Runs once when visiting /wp-admin/?emergency_deploy=1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_init', 'justice_emergency_deploy_run' );

function justice_emergency_deploy_run() {
	if ( ! isset( $_GET['emergency_deploy'] ) || $_GET['emergency_deploy'] !== '1' ) {
		return;
	}

	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( 'Unauthorized' );
	}

	echo '<h1>Emergency Deployment Running...</h1>';
	
	// 1. Find Maya Rotenberg
	$maya_id = null;
	$lawyers = get_posts( array(
		'post_type'      => 'justice_lawyer',
		'posts_per_page' => -1,
		'post_status'    => 'publish',
	) );
	
	foreach ( $lawyers as $l ) {
		if ( strpos( $l->post_title, 'מאיה' ) !== false || strpos( $l->post_title, 'רוטנברג' ) !== false ) {
			$maya_id = $l->ID;
			break;
		}
	}
	
	echo '<p>Maya ID: ' . ( $maya_id ? $maya_id : 'NOT FOUND' ) . '</p>';

	// 2. Find Family Law term
	$family_law_term = get_term_by( 'slug', 'family-law', 'practice-areas' );
	if ( ! $family_law_term ) {
		echo '<p>ERROR: family-law term not found!</p>';
		exit;
	}
	$family_law_term_id = $family_law_term->term_id;

	// 3. Tag all 247 articles
	echo '<h2>Tagging Articles</h2>';
	$articles = get_posts( array(
		'post_type'      => 'articles',
		'posts_per_page' => -1,
	) );

	$tagged_count = 0;
	foreach ( $articles as $article ) {
		// Only tag if it's family law related based on content master list (which means everything currently in the DB since it's only family law for now)
		wp_set_object_terms( $article->ID, array( $family_law_term_id ), 'practice-areas', true );
		if ( $maya_id ) {
			update_post_meta( $article->ID, 'article_expert_lawyer_id', $maya_id );
		}
		$tagged_count++;
	}
	
	echo "<p>Successfully tagged {$tagged_count} articles.</p>";

	// 4. Create Pillar Articles
	echo '<h2>Creating Pillar Articles</h2>';
	
	$pillars = array(
		array(
			'slug' => 'rabbinical-court-divorce-guide',
			'title' => 'בית הדין הרבני — מדריך מקיף: הליך גירושין, גט, ומה שחשוב לדעת',
			'subtopic' => 'rabbinical-court',
			'keyword' => 'בית הדין הרבני גירושין',
			'content' => 'מדריך מקיף להליך גירושין בבית הדין הרבני: שלבים, מסמכים, עלויות, וסוגיות הלכתיות. (תוכן מלא נמצא בקבצים)',
		),
		array(
			'slug' => 'property-division-divorce-guide',
			'title' => 'חלוקת רכוש בגירושין — מדריך מקיף: דירה, פנסיה, עסק ונכסים',
			'subtopic' => 'property-division',
			'keyword' => 'חלוקת רכוש בגירושין',
			'content' => 'המדריך המלא לחלוקת רכוש בגירושין בישראל: חוק יחסי ממון, דירה, פנסיה, עסק ונכסים. (תוכן מלא נמצא בקבצים)',
		),
		array(
			'slug' => 'domestic-violence-guide',
			'title' => 'אלימות במשפחה — מדריך מקיף: זכויות, צו הגנה והליכים משפטיים',
			'subtopic' => 'domestic-violence',
			'keyword' => 'אלימות במשפחה צו הגנה',
			'content' => 'מדריך מקיף לנפגעי אלימות במשפחה: צו הגנה, מקלטים, זכויות, ודרכי פעולה. (תוכן מלא נמצא בקבצים)',
		),
		array(
			'slug' => 'ketubah-guide',
			'title' => 'כתובה — המדריך המלא: משמעות משפטית, גביית כתובה וכל מה שחשוב לדעת',
			'subtopic' => 'ketubah',
			'keyword' => 'כתובה גירושין',
			'content' => 'מדריך מקיף בנושא כתובה: משמעות משפטית, גובה הסכום, תביעת כתובה בגירושין. (תוכן מלא נמצא בקבצים)',
		),
		array(
			'slug' => 'infidelity-marriage-guide',
			'title' => 'בגידה בנישואין — השלכות משפטיות, גירושין וזכויות',
			'subtopic' => 'infidelity',
			'keyword' => 'בגידה גירושין השלכות',
			'content' => 'מדריך מקיף על השלכות בגידה בנישואין: גירושין, כתובה, משמורת, ראיות וזכויות. (תוכן מלא נמצא בקבצים)',
		),
		array(
			'slug' => 'reconciliation-shalom-bayit-guide',
			'title' => 'שלום בית — מדריך משפטי: הליכים, ייעוץ זוגי והשלכות משפטיות',
			'subtopic' => 'reconciliation',
			'keyword' => 'שלום בית תביעה',
			'content' => 'מדריך מקיף על שלום בית: תביעה, ייעוץ זוגי, השלכות משפטיות ומתי לנסות. (תוכן מלא נמצא בקבצים)',
		),
	);

	foreach ( $pillars as $p ) {
		// Check if exists
		$existing = get_page_by_path( $p['slug'], OBJECT, 'articles' );
		if ( $existing ) {
			echo "<p>Skipped: {$p['title']} (already exists)</p>";
			continue;
		}

		$sub_term = get_term_by( 'slug', $p['subtopic'], 'practice-areas' );
		$term_ids = array( $family_law_term_id );
		if ( $sub_term ) {
			$term_ids[] = $sub_term->term_id;
		}

		$post_id = wp_insert_post( array(
			'post_title'   => $p['title'],
			'post_name'    => $p['slug'],
			'post_content' => $p['content'],
			'post_status'  => 'draft',
			'post_type'    => 'articles',
		) );

		if ( ! is_wp_error( $post_id ) ) {
			wp_set_object_terms( $post_id, $term_ids, 'practice-areas' );
			update_post_meta( $post_id, 'primary_keyword', $p['keyword'] );
			update_post_meta( $post_id, 'content_cluster', 'family-law' );
			if ( $maya_id ) {
				update_post_meta( $post_id, 'article_expert_lawyer_id', $maya_id );
			}
			echo "<p>Created: {$p['title']} (ID: $post_id)</p>";
		} else {
			echo "<p>Error creating {$p['title']}: " . $post_id->get_error_message() . "</p>";
		}
	}

	echo '<h2>✅ DONE!</h2>';
	echo '<p>You can close this page now.</p>';
	exit;
}
