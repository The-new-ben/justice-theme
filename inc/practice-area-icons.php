<?php
/**
 * Practice area icon map.
 *
 * Maps practice-area slugs to unique SVG icons for visual differentiation.
 * Used by practice-area-card.php.
 *
 * @package JusticeTheme
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Get SVG icon for a practice area by slug.
 *
 * @param string $slug Practice area term slug.
 * @return string SVG markup.
 */
function justice_get_practice_area_icon( $slug ) {
	$icons = array(
		// Family law / Divorce — document with heart accent
		'family-law'    => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M9 14.5c0-1.5 1.5-3 3-1.5 1.5-1.5 3 0 3 1.5 0 2.5-3 4.5-3 4.5s-3-2-3-4.5z"/></svg>',
		'דיני-משפחה'    => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M9 14.5c0-1.5 1.5-3 3-1.5 1.5-1.5 3 0 3 1.5 0 2.5-3 4.5-3 4.5s-3-2-3-4.5z"/></svg>',

		// Criminal law — shield and document
		'criminal-law'  => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M12 11l4 2v3.5c0 3-4 4.5-4 4.5s-4-1.5-4-4.5V13l4-2z"/></svg>',
		'פלילי'         => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M12 11l4 2v3.5c0 3-4 4.5-4 4.5s-4-1.5-4-4.5V13l4-2z"/></svg>',

		// Real estate — house on document
		'real-estate'   => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M8 15l4-3 4 3v5H8v-5z"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M12 12l-5 3.5M12 12l5 3.5"/></svg>',
		'מקרקעין'       => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M8 15l4-3 4 3v5H8v-5z"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M12 12l-5 3.5M12 12l5 3.5"/></svg>',

		// Labor law — briefcase and document
		'labor-law'     => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><rect stroke="var(--jt-accent-red)" x="8" y="14" width="8" height="5" rx="1"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M10 14v-1a2 2 0 014 0v1"/></svg>',
		'עבודה'         => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><rect stroke="var(--jt-accent-red)" x="8" y="14" width="8" height="5" rx="1"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M10 14v-1a2 2 0 014 0v1"/></svg>',

		// Torts / Damages — document with insurance check
		'torts'         => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><circle stroke="var(--jt-accent-red)" cx="12" cy="15" r="4"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M10.5 15l1 1 2-2"/></svg>',
		'נזיקין'        => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><circle stroke="var(--jt-accent-red)" cx="12" cy="15" r="4"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M10.5 15l1 1 2-2"/></svg>',

		// Traffic — document and road/car
		'traffic'       => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M9 20l1.5-7h3l1.5 7M12 13v2m0 3v2"/></svg>',
		'תעבורה'        => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M9 20l1.5-7h3l1.5 7M12 13v2m0 3v2"/></svg>',

		// Inheritance — document and seal
		'inheritance'   => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><circle stroke="var(--jt-accent-red)" cx="12" cy="14" r="3"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M10.5 16.5L9 20l3-1 3 1-1.5-3.5"/></svg>',
		'ירושה-וצוואות' => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><circle stroke="var(--jt-accent-red)" cx="12" cy="14" r="3"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M10.5 16.5L9 20l3-1 3 1-1.5-3.5"/></svg>',

		// Medical malpractice — document and medical cross
		'medical'       => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M12 12v6m-3-3h6"/></svg>',
		'רשלנות-רפואית' => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M12 12v6m-3-3h6"/></svg>',

		// Commercial law — document and trending up
		'commercial'    => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M8 17l3-3 2 2 3-3M16 13v3m0-3h-3"/></svg>',
		'מסחרי'         => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M8 17l3-3 2 2 3-3M16 13v3m0-3h-3"/></svg>',

		// Tax — document and calculator/percent
		'tax'           => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M9 13l6 6m-5.5-1.5a.5.5 0 100-1 .5.5 0 000 1zm5-3a.5.5 0 100-1 .5.5 0 000 1z"/></svg>',
		'מיסים'         => '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M9 13l6 6m-5.5-1.5a.5.5 0 100-1 .5.5 0 000 1zm5-3a.5.5 0 100-1 .5.5 0 000 1z"/></svg>',
	);

	// Try exact slug match first
	if ( isset( $icons[ $slug ] ) ) {
		return $icons[ $slug ];
	}

	// Try partial match (Hebrew slugs can vary)
	foreach ( $icons as $key => $icon ) {
		if ( strpos( $slug, $key ) !== false || strpos( $key, $slug ) !== false ) {
			return $icon;
		}
	}

	// Default fallback — document with pen
	return '<svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/><path d="M14 2v6h6"/><path stroke="var(--jt-accent-red)" stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5L9 15v3h3l4.5-4.5-3-3z"/></svg>';
}
