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
