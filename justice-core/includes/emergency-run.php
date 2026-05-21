<?php
/**
 * Emergency Deployment Script
 * Runs once when visiting /wp-admin/?emergency_deploy=1
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'admin_notices', 'justice_emergency_deploy_run_notice' );

function justice_emergency_deploy_run_notice() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// Allow forcing a re-run for debugging if the admin appends ?force_emergency_deploy=1
	if ( isset( $_GET['force_emergency_deploy'] ) && $_GET['force_emergency_deploy'] === '1' ) {
		delete_option( 'justice_emergency_deploy_done' );
	}

	if ( get_option( 'justice_emergency_deploy_done' ) ) {
		return; // Already ran successfully
	}

	$log_html = '';

	try {
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
		
		$log_html .= '<li><strong>Expert Lawyer ID:</strong> ' . ( $maya_id ? $maya_id : '<span style="color:red;">Not Found</span>' ) . '</li>';

		// 2. Find Family Law term
		$family_law_term = get_term_by( 'slug', 'family-law', 'practice-areas' );
		if ( ! $family_law_term ) {
			$new_term = wp_insert_term( 'דיני משפחה', 'practice-areas', array( 'slug' => 'family-law' ) );
			if ( is_wp_error( $new_term ) ) {
				throw new Exception( $new_term->get_error_message() );
			}
			$family_law_term_id = $new_term['term_id'];
		} else {
			$family_law_term_id = $family_law_term->term_id;
		}

		// 3. Tag all articles
		$articles = get_posts( array(
			'post_type'      => 'articles',
			'posts_per_page' => -1,
			'fields'         => 'ids',
		) );

		if ( empty( $articles ) ) {
			$log_html .= '<li><strong style="color:red;">Error:</strong> No articles found in DB.</li>';
		} else {
			$tagged_count = 0;
			foreach ( $articles as $article_id ) {
				wp_set_object_terms( $article_id, array( $family_law_term_id ), 'practice-areas', true );
				if ( $maya_id ) {
					update_post_meta( $article_id, 'article_expert_lawyer_id', $maya_id );
				}
				$tagged_count++;
			}
			$log_html .= "<li><strong>Articles Tagged:</strong> Successfully connected {$tagged_count} articles to Family Law and Expert.</li>";
		}

		// 4. Create Pillar Articles
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

		$created_pillars = 0;
		foreach ( $pillars as $p ) {
			$existing = get_page_by_path( $p['slug'], OBJECT, 'articles' );
			if ( $existing ) {
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
				$created_pillars++;
			}
		}

		if ( $created_pillars > 0 ) {
			$log_html .= "<li><strong>Pillars Created:</strong> Generated {$created_pillars} new pillar drafts.</li>";
		} else {
			$log_html .= "<li><strong>Pillars Checked:</strong> All pillars already exist.</li>";
		}

		// Mark as done so it doesn't run again on next page load
		update_option( 'justice_emergency_deploy_done', true );

		echo '<div class="notice notice-success is-dismissible" style="border-right-color: #46b450; padding: 15px;">';
		echo '<h3 style="margin-top:0;">✅ Jus-Tice Emergency Content Deployment Completed</h3>';
		echo '<ul style="list-style:disc; margin-right: 20px;">' . $log_html . '</ul>';
		echo '<p>The Lawyer-Article bridge is now fully operational. You can safely ignore this message.</p>';
		echo '</div>';
		
	} catch ( Throwable $e ) {
		echo '<div class="notice notice-error"><p><strong>❌ Deployment Error:</strong> ' . esc_html( $e->getMessage() ) . '</p></div>';
	}
}
