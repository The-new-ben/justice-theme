( function () {
	'use strict';

	function formatCurrency( value ) {
		return new Intl.NumberFormat( 'he-IL', {
			style: 'currency',
			currency: 'ILS',
			maximumFractionDigits: 0,
		} ).format( Math.max( 0, Math.round( value ) ) );
	}

	function numberFrom( input ) {
		if ( ! input ) {
			return 0;
		}

		var value = Number( input.value );
		return Number.isFinite( value ) ? Math.max( 0, value ) : 0;
	}

	function updateCalculator( root ) {
		var currentInput = root.querySelector( '[data-btl-current]' );
		var expectedInput = root.querySelector( '[data-btl-expected]' );
		var monthsInput = root.querySelector( '[data-btl-months]' );
		var daysInput = root.querySelector( '[data-btl-days]' );
		var result = document.querySelector( '[data-btl-result]' );
		var message = document.querySelector( '#btl-lead-message' );
		var urgency = document.querySelector( '#btl-appeal-urgency' );

		if ( ! result ) {
			return;
		}

		var current = numberFrom( currentInput );
		var expected = numberFrom( expectedInput );
		var months = Math.min( 60, numberFrom( monthsInput ) );
		var days = Math.min( 365, numberFrom( daysInput ) );
		var monthlyDelta = Math.max( 0, expected - current );
		var estimatedDelta = monthlyDelta * months;
		var deadlineTone = days >= 45 ? 'דחוף לבדוק את המועד המדויק לפני פעולה נוספת.' : 'כדאי לאסוף החלטה כתובה, פרוטוקול ועדה ומסמכים רפואיים עדכניים.';

		result.innerHTML = '<strong>פער כספי משוער: ' + formatCurrency( estimatedDelta ) + '</strong><p>' + deadlineTone + '</p>';

		if ( urgency ) {
			urgency.value = days >= 45 ? 'high' : 'normal';
		}

		if ( message && ! message.dataset.userEdited ) {
			message.value = 'קיבלתי החלטה מביטוח לאומי ואני רוצה לבדוק האם יש טעם לערעור. סכום חודשי לפי החלטה: ' + current + ' ש"ח. סכום חודשי משוער לאחר תיקון: ' + expected + ' ש"ח. חודשים רטרואקטיביים לבדיקה: ' + months + '. ימים מאז קבלת ההחלטה: ' + days + '.';
		}
	}

	document.addEventListener( 'DOMContentLoaded', function () {
		var calculator = document.querySelector( '[data-btl-appeal-calculator]' );
		var message = document.querySelector( '#btl-lead-message' );

		if ( ! calculator ) {
			return;
		}

		if ( message ) {
			message.addEventListener( 'input', function () {
				message.dataset.userEdited = '1';
			} );
		}

		calculator.addEventListener( 'input', function () {
			updateCalculator( calculator );
		} );

		updateCalculator( calculator );
	} );
}() );
