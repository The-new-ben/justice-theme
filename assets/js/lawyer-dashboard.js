( function () {
	'use strict';

	function setFieldValue( selector, value ) {
		var field = document.querySelector( selector );
		if ( ! field || value === undefined || value === null ) {
			return;
		}

		field.value = value;
		field.dispatchEvent( new Event( 'change', { bubbles: true } ) );
	}

	function focusServiceDesk() {
		var section = document.getElementById( 'service-request' );
		var details = document.getElementById( 'service-request-message' );

		if ( section ) {
			section.scrollIntoView( { behavior: 'smooth', block: 'start' } );
		}

		window.setTimeout( function () {
			if ( details ) {
				details.focus();
			}
		}, 300 );
	}

	document.addEventListener( 'click', function ( event ) {
		var trigger = event.target.closest( '[data-service-request-preset]' );
		if ( ! trigger ) {
			return;
		}

		event.preventDefault();

		setFieldValue( '#service-request-type', trigger.dataset.requestType || 'other' );
		setFieldValue( '#service-request-urgency', trigger.dataset.requestUrgency || 'this_week' );
		setFieldValue( '#service-request-desired-plan', trigger.dataset.requestPlan || '' );
		setFieldValue( '#service-request-subject', trigger.dataset.requestSubject || '' );
		setFieldValue( '#service-request-message', trigger.dataset.requestMessage || '' );

		focusServiceDesk();
	} );
}() );
