<?php
/**
 * Rule-based lead classification foundation.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function justice_theme_classify_lead_on_save( int $post_id, WP_Post $post, bool $update ): void {
	if ( wp_is_post_revision( $post_id ) || 'justice_lead' !== $post->post_type ) {
		return;
	}

	$message = (string) get_post_meta( $post_id, 'message', true );
	$area    = (string) get_post_meta( $post_id, 'legal_area', true );
	$city    = (string) get_post_meta( $post_id, 'city', true );
	$text    = trim( $post->post_title . ' ' . $area . ' ' . $city . ' ' . $message );
	$hash    = md5( $text );

	if ( get_post_meta( $post_id, 'ai_classification_hash', true ) === $hash ) {
		return;
	}

	$result = justice_theme_rule_based_lead_classification( $text, $area, $message );

	update_post_meta( $post_id, 'ai_classification_status', 'rule_based_v1' );
	update_post_meta( $post_id, 'ai_classification_hash', $hash );
	update_post_meta( $post_id, 'ai_detected_area', $result['area'] );
	update_post_meta( $post_id, 'ai_detected_urgency', $result['urgency'] );
	update_post_meta( $post_id, 'ai_summary', $result['summary'] );
	update_post_meta( $post_id, 'routing_notes', $result['routing_notes'] );

	if ( $result['area'] && ( ! $area || $result['area'] !== $area ) ) {
		update_post_meta( $post_id, 'legal_area', $result['area'] );
	}

	if ( ! get_post_meta( $post_id, 'urgency', true ) && $result['urgency'] ) {
		update_post_meta( $post_id, 'urgency', $result['urgency'] );
	}
}
add_action( 'save_post_justice_lead', 'justice_theme_classify_lead_on_save', 20, 3 );

function justice_theme_rule_based_lead_classification( string $text, string $area, string $message ): array {
	$normalized_area = justice_theme_normalize_lead_area( $area );
	$lower_text      = function_exists( 'mb_strtolower' ) ? mb_strtolower( $text, 'UTF-8' ) : strtolower( $text );

	$area_rules = array(
		'family-law' => array( 'גירוש', 'משמורת', 'מזונות', 'הסכם ממון', 'כתובה', 'משפחה', 'divorce', 'custody' ),
		'criminal-law' => array( 'חקירה', 'מעצר', 'כתב אישום', 'פלילי', 'משטרה', 'סמים', 'criminal', 'indictment' ),
		'traffic-law' => array( 'תעבורה', 'דוח', 'שלילה', 'רישיון', 'שכרות', 'נהיגה', 'traffic', 'dui' ),
		'real-estate-law' => array( 'דירה', 'מקרקעין', 'טאבו', 'חוזה מכר', 'נדלן', 'ליקויי בנייה', 'apartment', 'real estate' ),
		'labor-law' => array( 'פיטורים', 'שימוע', 'עבודה', 'שכר', 'מעסיק', 'עובד', 'employment', 'salary' ),
		'personal-injury-law' => array( 'נזיק', 'תאונה', 'פציעה', 'נזק גוף', 'פיצוי', 'injury', 'accident' ),
		'medical-malpractice-law' => array( 'רשלנות רפואית', 'לידה', 'הריון', 'אבחון', 'ניתוח', 'medical malpractice' ),
		'inheritance-law' => array( 'ירושה', 'צוואה', 'עיזבון', 'התנגדות לצוואה', 'inheritance', 'will' ),
		'national-insurance' => array( 'ביטוח לאומי', 'נכות', 'ועדה רפואית', 'קצבה', 'national insurance' ),
	);

	if ( ! $normalized_area || 'general' === $normalized_area ) {
		foreach ( $area_rules as $candidate_area => $keywords ) {
			foreach ( $keywords as $keyword ) {
				if ( false !== strpos( $lower_text, function_exists( 'mb_strtolower' ) ? mb_strtolower( $keyword, 'UTF-8' ) : strtolower( $keyword ) ) ) {
					$normalized_area = $candidate_area;
					break 2;
				}
			}
		}
	}

	$urgency = 'normal';
	foreach ( array( 'דחוף', 'היום', 'מחר', 'מעצר', 'חקירה עכשיו', 'צו', 'שימוע מחר', 'urgent', 'today', 'arrest' ) as $urgent_keyword ) {
		$needle = function_exists( 'mb_strtolower' ) ? mb_strtolower( $urgent_keyword, 'UTF-8' ) : strtolower( $urgent_keyword );
		if ( false !== strpos( $lower_text, $needle ) ) {
			$urgency = 'high';
			break;
		}
	}

	$clean_message = trim( preg_replace( '/\s+/', ' ', wp_strip_all_tags( $message ?: $text ) ) );
	$summary      = function_exists( 'mb_substr' ) ? mb_substr( $clean_message, 0, 220, 'UTF-8' ) : substr( $clean_message, 0, 220 );

	return array(
		'area'          => $normalized_area ?: 'general',
		'urgency'       => $urgency,
		'summary'       => $summary ?: 'Lead received without detailed message.',
		'routing_notes' => sprintf(
			'Rule-based classification. Area: %s. Urgency: %s. Review manually before assigning to a lawyer.',
			$normalized_area ?: 'general',
			$urgency
		),
	);
}

function justice_theme_normalize_lead_area( string $area ): string {
	$raw = trim( $area );

	if ( '' === $raw ) {
		return '';
	}

	if ( in_array( $raw, array( 'אחר', 'לא בטוח' ), true ) ) {
		return 'general';
	}

	$map = array(
		'family'                  => 'family-law',
		'family-law'              => 'family-law',
		'criminal'                => 'criminal-law',
		'criminal-law'            => 'criminal-law',
		'traffic'                 => 'traffic-law',
		'traffic-law'             => 'traffic-law',
		'real_estate'             => 'real-estate-law',
		'real-estate'             => 'real-estate-law',
		'real-estate-law'         => 'real-estate-law',
		'labor'                   => 'labor-law',
		'employment'              => 'labor-law',
		'employment-law'          => 'labor-law',
		'labor-law'               => 'labor-law',
		'damages'                 => 'personal-injury-law',
		'tort'                    => 'personal-injury-law',
		'torts'                   => 'personal-injury-law',
		'personal-injury'         => 'personal-injury-law',
		'personal-injury-law'     => 'personal-injury-law',
		'medical'                 => 'medical-malpractice-law',
		'medical_malpractice'     => 'medical-malpractice-law',
		'medical-malpractice'     => 'medical-malpractice-law',
		'medical-malpractice-law' => 'medical-malpractice-law',
		'inheritance'             => 'inheritance-law',
		'inheritance-law'         => 'inheritance-law',
		'other'                   => 'general',
		'general'                 => 'general',
	);

	$key = sanitize_key( $raw );

	return $map[ $key ] ?? $key;
}

function justice_theme_lead_area_label( string $area ): string {
	$labels = array(
		'family-law'              => 'דיני משפחה',
		'criminal-law'            => 'משפט פלילי',
		'traffic-law'             => 'דיני תעבורה',
		'real-estate-law'         => 'מקרקעין ונדל״ן',
		'labor-law'               => 'דיני עבודה',
		'personal-injury-law'     => 'נזיקין ותאונות',
		'medical-malpractice-law' => 'רשלנות רפואית',
		'inheritance-law'         => 'ירושה וצוואות',
		'national-insurance'      => 'ביטוח לאומי',
		'general'                 => 'כללי / לא בטוח',
	);

	$normalized_area = justice_theme_normalize_lead_area( $area );

	return $labels[ $normalized_area ] ?? $area;
}
