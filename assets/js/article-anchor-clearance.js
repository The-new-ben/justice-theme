/**
 * Keep native article fragment destinations below the theme's sticky masthead.
 * The existing Code Snippets jt-nav-toc and Ops jt-toc remain the TOC owners.
 * No link interception, history rewriting, focus changes or extra navigation.
 */
( () => {
	'use strict';
	const header = document.querySelector( '.site-header' );
	const links = document.querySelectorAll( '.jt-nav-toc a[href^="#"], .jt-toc a[href^="#"]' );
	if ( ! header || ! links.length ) {
		return;
	}
	const targets = new Map();
	const fromHash = hash => {
		try {
			return document.getElementById( decodeURIComponent( hash.slice( 1 ) ) );
		} catch ( error ) {
			return null;
		}
	};
	links.forEach( link => {
		const target = fromHash( link.getAttribute( 'href' ) );
		// Do not change forms, tools, menus or arbitrary fragment destinations.
		if ( target && /^H[2-6]$/.test( target.tagName ) && ! targets.has( target ) ) {
			targets.set( target, parseFloat( getComputedStyle( target ).scrollMarginTop ) || 0 );
		}
	} );
	if ( ! targets.size ) {
		return;
	}
	const clearance = () => {
		const style = getComputedStyle( header );
		if ( ! /^(sticky|fixed)$/.test( style.position ) || style.display === 'none' ) {
			return 0;
		}
		const height = header.getBoundingClientRect().height;
		return height ? Math.max( 0, height + ( parseFloat( style.top ) || 0 ) ) + 12 : 0;
	};
	const refresh = () => {
		// WordPress already reserves admin-bar space with root scroll-padding.
		const padding = parseFloat( getComputedStyle( document.documentElement ).scrollPaddingTop ) || 0;
		const margin = Math.max( 0, clearance() - padding );
		targets.forEach( ( original, target ) => {
			target.style.scrollMarginTop = Math.ceil( Math.max( original, margin ) ) + 'px';
		} );
	};
	refresh();
	window.addEventListener( 'resize', refresh, { passive: true } );
	if ( typeof ResizeObserver !== 'undefined' ) {
		const observer = new ResizeObserver( refresh );
		observer.observe( header );
	}
	// Refresh before the browser performs its native fragment navigation.
	links.forEach( link => link.addEventListener( 'click', refresh ) );
	let interacted = false;
	const stopInitialCorrection = () => { interacted = true; };
	[ 'pointerdown', 'keydown', 'wheel', 'touchstart' ].forEach( type => {
		window.addEventListener( type, stopInitialCorrection, { once: true, passive: true } );
	} );
	const correctInitialFragment = () => {
		refresh();
		const target = fromHash( window.location.hash );
		if ( interacted || ! targets.has( target ) ) {
			return;
		}
		const top = target.getBoundingClientRect().top;
		// A hash may have been positioned before this footer script loaded.
		// Never pull a reader back from a restored scroll position elsewhere.
		if ( top >= -1 && top < clearance() ) {
			target.scrollIntoView( { block: 'start', behavior: 'instant' } );
		}
	};
	if ( document.readyState === 'complete' ) {
		correctInitialFragment();
	} else {
		window.addEventListener( 'load', correctInitialFragment, { once: true } );
	}
} )();
