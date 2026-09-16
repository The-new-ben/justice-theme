/**
 * Jus-Tice new look (v3): mega menu open/close.
 * No dependencies. Vanilla JS. RTL-safe. Loads only with body.jt-look-v3.
 */
( () => {
	const panel = document.getElementById( 'l3-mega' );

	if ( ! panel ) {
		return;
	}

	const triggers = Array.from( document.querySelectorAll( '[data-l3-mega-toggle]' ) );

	const setOpen = isOpen => {
		panel.hidden = ! isOpen;
		triggers.forEach( trigger => trigger.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' ) );
		document.documentElement.classList.toggle( 'l3-mega-open', isOpen );
	};

	setOpen( false );

	triggers.forEach( trigger => {
		trigger.addEventListener( 'click', e => {
			e.preventDefault();
			setOpen( panel.hidden );
		} );
	} );

	document.addEventListener( 'keydown', e => {
		if ( e.key === 'Escape' && ! panel.hidden ) {
			setOpen( false );
		}
	} );

	document.addEventListener( 'click', e => {
		const target = e.target instanceof Element ? e.target : null;

		if ( ! target || panel.hidden ) {
			return;
		}

		if ( panel.contains( target ) || triggers.some( trigger => trigger.contains( target ) ) ) {
			return;
		}

		setOpen( false );
	} );
} )();

// Expand the existing iframe in place. Moving or recreating it would restart a case.
( () => {
	const bar = document.querySelector( '.hadmaia-entry__bar' );
	const frame = document.querySelector( 'iframe.hadmaia-entry__frame' );
	if ( ! bar || ! frame || bar.querySelector( '[data-workspace-expand]' ) ) return;
	const hebrew = document.documentElement.lang.startsWith( 'he' );
	const button = document.createElement( 'button' );
	button.type = 'button';
	button.dataset.workspaceExpand = '';
	button.textContent = hebrew ? 'הרחבת התרגול' : 'Expand workspace';
	button.setAttribute( 'aria-expanded', 'false' );
	if ( ! frame.id ) frame.id = 'hadmaya-embedded-workspace';
	button.setAttribute( 'aria-controls', frame.id );
	bar.prepend( button );
	const style = document.createElement( 'style' );
	style.textContent = `
	.hadmaia-entry__bar [data-workspace-expand]{min-height:44px;padding:10px 18px;border:1px solid #244b40;border-radius:8px;background:#244b40;color:#fff;font:inherit;font-weight:700;cursor:pointer}
	.hadmaia-entry__bar [data-workspace-expand]:focus-visible{outline:3px solid #b96c32;outline-offset:3px}
	html.hadmaya-workspace-open,html.hadmaya-workspace-open body{overflow:hidden!important}
	html.hadmaya-workspace-open [inert]{visibility:hidden!important}
	.hadmaia-entry__bar.hadmaya-workspace-bar{position:fixed!important;inset:0 0 auto!important;z-index:2147483646!important;box-sizing:border-box;display:flex!important;flex-wrap:wrap!important;justify-content:space-between!important;align-items:center!important;gap:8px!important;margin:0!important;padding:8px 12px!important;background:#f8f7f2!important;border-bottom:1px solid #cbd7d0!important;border-radius:0!important}
	.hadmaia-entry__bar.hadmaya-workspace-bar>span:not([role=status]){display:none!important}
	.hadmaia-entry__bar.hadmaya-workspace-bar a{width:auto!important;flex:0 1 auto!important;min-height:44px!important;margin:0!important;padding:10px 12px!important;font-size:13px!important}
	iframe.hadmaia-entry__frame.hadmaya-workspace-frame{position:fixed!important;inset:var(--hadmaya-workspace-bar-height,64px) 0 0!important;width:100%!important;max-width:none!important;height:calc(100dvh - var(--hadmaya-workspace-bar-height,64px))!important;min-height:0!important;margin:0!important;border:0!important;border-radius:0!important;z-index:2147483645!important;background:#f8f7f2!important}
	@supports not (height:100dvh){iframe.hadmaia-entry__frame.hadmaya-workspace-frame{height:calc(100vh - var(--hadmaya-workspace-bar-height,64px))!important}}
	`;
	document.head.appendChild( style );
	let expanded = false;
	let inerted = [];
	const resize = () => {
		if ( expanded ) frame.style.setProperty( '--hadmaya-workspace-bar-height', `${Math.ceil( bar.getBoundingClientRect().height )}px` );
	};
	// Inert only branches outside the bar/frame. Keep the live iframe in its original parent.
	const isolate = () => {
		const visit = element => {
			for ( const child of element.children ) {
				if ( child === bar || child === frame ) continue;
				if ( child.contains( bar ) || child.contains( frame ) ) visit( child );
				else if ( ! child.inert && ! [ 'SCRIPT', 'STYLE', 'LINK' ].includes( child.tagName ) ) {
					child.inert = true;
					inerted.push( child );
				}
			}
		};
		visit( document.body );
	};
	const toggle = () => {
		expanded = ! expanded;
		document.documentElement.classList.toggle( 'hadmaya-workspace-open', expanded );
		bar.classList.toggle( 'hadmaya-workspace-bar', expanded );
		frame.classList.toggle( 'hadmaya-workspace-frame', expanded );
		button.setAttribute( 'aria-expanded', String( expanded ) );
		button.textContent = expanded ? ( hebrew ? 'חזרה לעמוד' : 'Back to page' ) : ( hebrew ? 'הרחבת התרגול' : 'Expand workspace' );
		if ( expanded ) { isolate(); resize(); }
		else { inerted.forEach( element => { element.inert = false; } ); inerted = []; frame.style.removeProperty( '--hadmaya-workspace-bar-height' ); }
		button.focus( { preventScroll:true } );
	};
	button.addEventListener( 'click', toggle );
	document.addEventListener( 'keydown', event => { if ( expanded && event.key === 'Escape' ) toggle(); } );
	window.addEventListener( 'resize', resize );
	if ( typeof ResizeObserver !== 'undefined' ) new ResizeObserver( resize ).observe( bar );
} )();

/* Contextual, on-demand tour of the real product. No AI requests or page-load video. */
( () => {
	'use strict';
	// Practice archives have their own template and do not run the article filter.
	// Enhance the existing hero side column without replacing its content or links.
	const archivePanel = document.querySelector( 'body.tax-practice-areas .practice-hub-hero__panel' );
	if ( archivePanel && ! document.querySelector( '[data-hadmaia-article-entry]' ) ) {
		const topics = { 'family-law':'family-law', 'criminal-law':'criminal-law', 'real-estate-law':'real-estate',
			'traffic-law':'traffic-law', 'labor-law':'employment', 'inheritance-law':'inheritance',
			'medical-malpractice':'medical-malpractice', 'medical-malpractice-law':'medical-malpractice',
			'torts':'personal-injury', 'personal-injury-law':'personal-injury', 'tax-law':'tax', 'immigration-law':'immigration' };
		const term = Object.keys( topics ).find( key => document.body.classList.contains( 'term-' + key ) );
		if ( term ) {
			const topic = topics[ term ];
			const url = purpose => 'https://jus-tice.com/#/simulation?' + new URLSearchParams( { entry:'role', audience:'guest', lang:'he', purpose:purpose, topic:topic } );
			const column = document.createElement( 'div' );
			column.className = 'hadmaya-archive-column';
			const card = document.createElement( 'aside' );
			card.className = 'l3-article-simulation hadmaya-archive-entry';
			card.setAttribute( 'data-hadmaia-article-entry', topic );
			card.setAttribute( 'aria-label', '\u05ea\u05e8\u05d2\u05d5\u05dc \u05d4\u05de\u05e7\u05e8\u05d4 \u05e9\u05dc\u05db\u05dd' );
			card.innerHTML = '<a class="l3-article-simulation__visual" aria-label="\u05e4\u05ea\u05d9\u05d7\u05ea \u05e1\u05d9\u05de\u05d5\u05dc\u05e6\u05d9\u05d4 \u05e9\u05dc \u05d3\u05d9\u05d5\u05df"><img src="https://jus-tice.com/brand/hadmaya-cockpit-showcase-v1.webp" alt="\u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05e1\u05d9\u05de\u05d5\u05dc\u05e6\u05d9\u05d4: \u05de\u05e9\u05ea\u05ea\u05e4\u05d9\u05dd, \u05ea\u05de\u05dc\u05d5\u05dc, \u05e2\u05e8\u05d9\u05db\u05ea \u05d4\u05de\u05e7\u05e8\u05d4 \u05d5\u05d4\u05d6\u05de\u05e0\u05d4 \u05dc\u05d3\u05d9\u05d5\u05df" width="1536" height="961" loading="lazy" decoding="async"><span>Hadmaya <span aria-hidden="true">\u2197</span></span></a><div><strong>\u05d0\u05d9\u05da \u05d6\u05d4 \u05d9\u05d9\u05e9\u05de\u05e2 \u05d1\u05d3\u05d9\u05d5\u05df?</strong><p>\u05ea\u05e8\u05d2\u05dc\u05d5 \u05d0\u05ea \u05d4\u05de\u05e7\u05e8\u05d4 \u05e9\u05dc\u05db\u05dd. \u05d0\u05e4\u05e9\u05e8 \u05dc\u05d4\u05ea\u05d7\u05d9\u05dc \u05e2\u05db\u05e9\u05d9\u05d5 \u05d5\u05dc\u05d3\u05d9\u05d9\u05e7 \u05e4\u05e8\u05d8\u05d9\u05dd \u05d1\u05d4\u05de\u05e9\u05da.</p></div><div class="l3-article-simulation__actions"><a data-archive-trial>\u05ea\u05e8\u05d2\u05d5\u05dc \u05d3\u05d9\u05d5\u05df</a></div><small>\u05e1\u05d9\u05de\u05d5\u05dc\u05e6\u05d9\u05d4 \u05dc\u05d4\u05db\u05e0\u05d4, \u05dc\u05d0 \u05d9\u05d9\u05e2\u05d5\u05e5 \u05de\u05e9\u05e4\u05d8\u05d9.</small>';
			card.querySelector( '.l3-article-simulation__visual' ).href = url( 'court_rehearsal' );
			card.querySelector( '[data-archive-trial]' ).href = url( 'court_rehearsal' );
			if ( ! [ 'criminal-law', 'traffic-law', 'immigration', 'tax' ].includes( topic ) ) {
				const mediation = document.createElement( 'a' );
				mediation.className = 'l3-article-simulation__secondary'; mediation.href = url( 'mediation' );
				mediation.textContent = '\u05ea\u05e8\u05d2\u05d5\u05dc \u05d2\u05d9\u05e9\u05d5\u05e8'; card.querySelector( '.l3-article-simulation__actions' ).append( mediation );
			}
			archivePanel.before( column ); column.append( card, archivePanel );
		}
	}
	const entries = document.querySelectorAll( '[data-hadmaia-article-entry]' );
	if ( ! entries.length || document.getElementById( 'hadmaya-article-tour-style' ) ) return;
	const style = document.createElement( 'style' );
	style.id = 'hadmaya-article-tour-style';
	style.textContent = `
	body.jt-look-v3 .practice-hub-hero__grid:has(.hadmaya-archive-column){align-items:start}
	body.jt-look-v3 .hadmaya-archive-column{min-width:0;display:grid;align-content:start;gap:20px}
	body.jt-look-v3 .l3-article-simulation.hadmaya-archive-entry{margin:0;grid-template-columns:minmax(0,1fr);gap:14px;padding:20px}
	body.jt-look-v3 .hadmaya-archive-entry .l3-article-simulation__visual{grid-row:auto}
	body.jt-look-v3 .l3-article-simulation.hadmaya-archive-entry small{grid-column:1}
	body.jt-look-v3 .hadmaya-archive-column>.practice-hub-hero__panel{margin:0}
	.l3-article-simulation__actions .hadmaya-tour-button{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:46px;padding:10px 18px;border:1px solid #315a4c;border-radius:8px;background:#fffef9;color:#203e34;font:inherit;font-weight:700;line-height:1.5;cursor:pointer;white-space:normal;text-align:center}
	.hadmaya-tour-button:focus-visible,.hadmaya-tour-dialog :is(button,a):focus-visible{outline:3px solid #315a4c;outline-offset:4px}
	.hadmaya-tour-dialog{box-sizing:border-box;width:min(1100px,calc(100% - 24px));max-width:none;max-height:calc(100dvh - 24px);padding:0;border:1px solid #cad5cc;border-radius:16px;background:#fffef9;color:#203e34;font-family:inherit;overflow:auto;overscroll-behavior:contain;box-shadow:0 24px 80px #071d1ac0}
	.hadmaya-tour-dialog::backdrop{background:rgb(4 17 22 / .78)}
	.hadmaya-tour-dialog__head,.hadmaya-tour-dialog__foot{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 20px}
	.hadmaya-tour-dialog h2{margin:0;font:inherit;font-size:clamp(20px,3vw,28px);font-weight:700;color:#203e34}
	.hadmaya-tour-dialog button{min-width:44px;min-height:44px;padding:8px 12px;border:1px solid #315a4c;border-radius:8px;background:#fffef9;color:#203e34;font:inherit;cursor:pointer}
	.hadmaya-tour-dialog video{display:block;width:100%;max-height:calc(100dvh - 190px);aspect-ratio:1440/1000;object-fit:contain;background:#091c25}
	.hadmaya-tour-dialog__foot{flex-wrap:wrap;font-size:15px;line-height:1.5}
	.hadmaya-tour-dialog__foot a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:8px 16px;border-radius:8px;background:#203e34!important;color:#fffef9!important;text-decoration:none;font-weight:700}
	.hadmaya-tour-dialog__error{padding:20px;line-height:1.6}
	.hadmaya-tour-dialog__error[hidden]{display:none}
	@media(max-width:600px){.hadmaya-tour-dialog__head,.hadmaya-tour-dialog__foot{padding:12px;gap:8px}.hadmaya-tour-dialog video{max-height:calc(100dvh - 225px)}.l3-article-simulation__actions .hadmaya-tour-button{width:100%}}
	`;
	document.head.append( style );
	const dialog = document.createElement( 'dialog' );
	dialog.className = 'hadmaya-tour-dialog';
	dialog.dir = 'rtl';
	dialog.setAttribute( 'aria-labelledby', 'hadmaya-tour-title' );
	dialog.innerHTML = '<header class="hadmaya-tour-dialog__head"><h2 id="hadmaya-tour-title">\u05d4\u05d9\u05db\u05e8\u05d5\u05ea \u05e2\u05dd \u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05e1\u05d9\u05de\u05d5\u05dc\u05e6\u05d9\u05d4</h2><button type="button" data-tour-close aria-label="\u05e1\u05d2\u05d9\u05e8\u05ea \u05d4\u05e1\u05e8\u05d8\u05d5\u05df">\u05e1\u05d2\u05d9\u05e8\u05d4</button></header><div data-tour-player></div><div class="hadmaya-tour-dialog__error" hidden><p role="alert">\u05dc\u05d0 \u05e0\u05d9\u05ea\u05df \u05dc\u05d4\u05e4\u05e2\u05d9\u05dc \u05d0\u05ea \u05d4\u05e1\u05e8\u05d8\u05d5\u05df. \u05d0\u05e4\u05e9\u05e8 \u05dc\u05e0\u05e1\u05d5\u05ea \u05e9\u05d5\u05d1 \u05d0\u05d5 \u05dc\u05d4\u05de\u05e9\u05d9\u05da \u05dc\u05e1\u05d9\u05de\u05d5\u05dc\u05e6\u05d9\u05d4.</p><button type="button" data-tour-retry>\u05e0\u05d9\u05e1\u05d9\u05d5\u05df \u05e0\u05d5\u05e1\u05e3</button></div><footer class="hadmaya-tour-dialog__foot"><span>\u05e6\u05d9\u05dc\u05d5\u05dd \u05de\u05ea\u05d5\u05da \u05d4\u05de\u05e2\u05e8\u05db\u05ea \u00b7 28 \u05e9\u05e0\u05d9\u05d5\u05ea</span><a data-tour-start>\u05dc\u05ea\u05d7\u05d9\u05dc\u05ea \u05d4\u05ea\u05e8\u05d2\u05d5\u05dc</a></footer>';
	document.body.append( dialog );
	const player = dialog.querySelector( '[data-tour-player]' );
	const error = dialog.querySelector( '.hadmaya-tour-dialog__error' );
	let trigger, topic, video, previousOverflow;
	const track = name => {
		// Existing analytics only. QA stays out of customer events; no case data is collected.
		try { if ( localStorage.getItem( 'justice_product_qa' ) === '1' ) return; } catch ( ignored ) {}
		const params = { surface:'article_tour', topic:topic, video_id:'courtroom-he', page_path:location.pathname };
		if ( typeof window.gtag === 'function' ) window.gtag( 'event', name, params );
		else if ( Array.isArray( window.dataLayer ) ) window.dataLayer.push( { event:name, ...params } );
	};
	const stop = () => {
		if ( video ) { video.pause(); video.removeAttribute( 'src' ); video.load(); video.remove(); video = null; }
	};
	const play = () => {
		stop(); error.hidden = true;
		const current = document.createElement( 'video' );
		video = current;
		current.controls = true; current.playsInline = true; current.preload = 'metadata';
		current.setAttribute( 'aria-label', '\u05e1\u05d9\u05d5\u05e8 \u05de\u05e6\u05d5\u05dc\u05dd \u05d1\u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05e1\u05d9\u05de\u05d5\u05dc\u05e6\u05d9\u05d4' );
		current.poster = 'https://jus-tice.com/media/walkthrough/courtroom-he-poster.png';
		current.src = 'https://jus-tice.com/media/walkthrough/courtroom-he.webm';
		// Same captions as the existing product recording, using native cues to avoid
		// depending on cross-origin VTT headers on the separately hosted application.
		if ( typeof VTTCue !== 'undefined' ) {
			const captions = current.addTextTrack( 'captions', '\u05e2\u05d1\u05e8\u05d9\u05ea', 'he' );
			[ [ .225, 5.940, '\u05d4\u05d9\u05db\u05e8\u05d5\u05ea \u05e2\u05dd \u05de\u05e2\u05e8\u05db\u05ea \u05d4\u05e1\u05d9\u05de\u05d5\u05dc\u05e6\u05d9\u05d4' ], [ 5.940, 11.649, '\u05e1\u05d9\u05e4\u05d5\u05e8 \u05d4\u05de\u05e7\u05e8\u05d4' ], [ 11.649, 17.355, '\u05d3\u05d9\u05d5\u05e7 \u05e4\u05e8\u05d8\u05d9 \u05d4\u05de\u05e7\u05e8\u05d4' ], [ 17.355, 22.993, '\u05d4\u05d6\u05de\u05e0\u05ea \u05d4\u05e6\u05d3 \u05d4\u05e9\u05e0\u05d9 \u05dc\u05d3\u05d9\u05d5\u05df' ], [ 22.993, 28.507, '\u05de\u05e9\u05ea\u05ea\u05e4\u05d9\u05dd \u05d5\u05ea\u05de\u05dc\u05d5\u05dc' ] ].forEach( cue => captions.addCue( new VTTCue( ...cue ) ) );
			captions.mode = 'showing';
		}
		current.addEventListener( 'playing', () => track( 'simulation_tour_started' ), { once:true } );
		current.addEventListener( 'ended', () => track( 'simulation_tour_completed' ), { once:true } );
		current.addEventListener( 'error', () => { if ( video === current ) { error.hidden = false; track( 'simulation_tour_error' ); } } );
		player.append( current );
		current.play().catch( () => { /* Native play control remains usable if autoplay is denied. */ } );
	};
	dialog.querySelector( '[data-tour-close]' ).addEventListener( 'click', () => dialog.close() );
	dialog.querySelector( '[data-tour-retry]' ).addEventListener( 'click', play );
	dialog.querySelector( '[data-tour-start]' ).addEventListener( 'click', () => track( 'simulation_tour_start_clicked' ) );
	dialog.addEventListener( 'close', () => {
		stop(); document.documentElement.style.overflow = previousOverflow;
		if ( trigger?.isConnected ) trigger.focus( { preventScroll:true } );
	} );
	entries.forEach( entry => {
		const actions = entry.querySelector( '.l3-article-simulation__actions' );
		const start = entry.querySelector( '.l3-article-simulation__visual' );
		if ( ! actions || ! start ) return;
		const button = document.createElement( 'button' );
		button.type = 'button'; button.className = 'hadmaya-tour-button';
		button.innerHTML = '<span aria-hidden="true">\u25b6</span> \u05e1\u05d9\u05d5\u05e8 \u05d1\u05de\u05e2\u05e8\u05db\u05ea \u00b7 28 \u05e9\u05e0\u05d9\u05d5\u05ea';
		button.setAttribute( 'aria-haspopup', 'dialog' );
		button.addEventListener( 'click', () => {
			if ( typeof dialog.showModal !== 'function' ) { location.href = 'https://jus-tice.com/he/how-it-works/'; return; }
			trigger = button; topic = entry.getAttribute( 'data-hadmaia-article-entry' );
			dialog.querySelector( '[data-tour-start]' ).href = start.href;
			previousOverflow = document.documentElement.style.overflow;
			dialog.showModal(); document.documentElement.style.overflow = 'hidden';
			dialog.querySelector( '[data-tour-close]' ).focus();
			track( 'simulation_tour_opened' ); play();
		} );
		actions.append( button );
	} );
} )();