(function () {
	'use strict';

	var allowed = [ 'court_rehearsal', 'mediation', 'witness_prep', 'case_review' ];

	function readConfig() {
		var node = document.getElementById( 'justice-ops-hadmaia-review-config' );
		if ( node && node.textContent ) {
			try {
				return JSON.parse( node.textContent );
			} catch ( err ) {
				return {};
			}
		}

		return window.JusticeHadmaiaReview || {};
	}

	function hidden( form, name, value ) {
		var field;
		if ( ! form ) {
			return;
		}

		field = form.querySelector( '[name="' + name + '"]' );
		if ( ! field ) {
			field = document.createElement( 'input' );
			field.type = 'hidden';
			field.name = name;
			form.appendChild( field );
		}
		field.value = value || '';
	}

	function applyForms( cfg ) {
		document.querySelectorAll( '#ask-lawyer form,.ask-lawyer__form,#lawyer-inquiry form' ).forEach( function ( form ) {
			var msg;
			hidden( form, 'product_intent', cfg.intent );
			hidden( form, 'lead_source_surface', 'hadmaia_professional_review' );
			hidden( form, 'utm_source', 'jus-tice.com' );
			hidden( form, 'utm_medium', 'product_handoff' );
			hidden( form, 'utm_campaign', 'professional_review' );
			hidden( form, 'utm_content', cfg.intent );
			hidden( form, 'source_keyword', cfg.sourceKeyword || '' );
			msg = form.querySelector( '[name="lead_message"],[name="message"]' );
			if ( msg && ! msg.value && cfg.leadMessage ) {
				msg.value = cfg.leadMessage;
			}
		} );
	}

	function renderBridge( cfg ) {
		var target;
		var bridge;
		if ( ! /\/lawyers\/?/.test( window.location.pathname ) || document.querySelector( '.hadmaia-review-bridge' ) ) {
			return;
		}

		target = document.querySelector( '.directory-guidance' ) || document.querySelector( '.lawyer-directory .container' ) || document.querySelector( 'main' );
		if ( ! target || ! target.parentNode ) {
			return;
		}

		bridge = document.createElement( 'section' );
		bridge.className = 'hadmaia-review-bridge';
		bridge.setAttribute( 'aria-label', 'המשך מסימולציה לבדיקה מקצועית' );
		bridge.innerHTML = '<div class="hadmaia-review-bridge__copy"><span>הגעתם מסימולציית Hadmaia</span><h2></h2><p></p></div><div class="hadmaia-review-bridge__actions"><a class="button button--primary" href="/#ask-lawyer">השארת פנייה מסודרת</a><a class="button button--whatsapp-inline" target="_blank" rel="noopener">המשך בוואטסאפ</a></div>';
		bridge.querySelector( 'h2' ).textContent = cfg.headline || '';
		bridge.querySelector( 'p' ).textContent = cfg.body || '';
		bridge.querySelector( '.button--primary' ).href = '/?lead_source_surface=hadmaia_professional_review&product_intent=' + encodeURIComponent( cfg.intent ) + '&utm_source=jus-tice.com&utm_medium=product_handoff&utm_campaign=professional_review&source_keyword=' + encodeURIComponent( cfg.sourceKeyword || '' ) + '#ask-lawyer';
		bridge.querySelector( '.button--whatsapp-inline' ).href = cfg.whatsappUrl || 'https://wa.me/972525101555';
		target.parentNode.insertBefore( bridge, target );
	}

	function run() {
		var cfg = readConfig();
		if ( ! cfg.intent || allowed.indexOf( cfg.intent ) === -1 ) {
			return;
		}
		applyForms( cfg );
		renderBridge( cfg );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', run );
	} else {
		run();
	}
}() );
