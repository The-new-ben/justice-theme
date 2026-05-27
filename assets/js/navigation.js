/**
 * Jus-Tice Navigation - mobile menu and dropdown support.
 * No dependencies. Vanilla JS. RTL-safe.
 */
( () => {
	const toggle = document.querySelector( '.menu-toggle' );
	const nav = document.querySelector( '.primary-navigation' );
	const mobileQuery = window.matchMedia( '(max-width: 1220px)' );

	if ( toggle && nav ) {
		const setMenuOpen = isOpen => {
			toggle.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );

			if ( mobileQuery.matches ) {
				nav.setAttribute( 'aria-hidden', isOpen ? 'false' : 'true' );
			} else {
				nav.removeAttribute( 'aria-hidden' );
			}

			document.body.classList.toggle( 'nav-is-open', isOpen );
		};

		setMenuOpen( false );

		mobileQuery.addEventListener( 'change', () => {
			setMenuOpen( false );
		} );

		toggle.addEventListener( 'click', e => {
			e.preventDefault();
			setMenuOpen( toggle.getAttribute( 'aria-expanded' ) !== 'true' );
		} );

		document.addEventListener( 'keydown', e => {
			if ( e.key === 'Escape' ) {
				setMenuOpen( false );
			}
		} );

		window.addEventListener( 'resize', () => {
			if ( document.body.classList.contains( 'nav-is-open' ) ) {
				setMenuOpen( false );
			}
		} );

		nav.addEventListener( 'click', e => {
			const target = e.target instanceof Element ? e.target : null;
			const link = target ? target.closest( 'a[href]' ) : null;

			if ( link && link.getAttribute( 'href' ) !== '#' ) {
				setMenuOpen( false );
			}
		} );

		document.addEventListener( 'click', e => {
			const target = e.target instanceof Element ? e.target : null;

			if (
				target &&
				document.body.classList.contains( 'nav-is-open' ) &&
				! nav.contains( target ) &&
				! toggle.contains( target )
			) {
				setMenuOpen( false );
			}
		} );
	}

	document
		.querySelectorAll( '.primary-navigation .menu-item-has-children > a' )
		.forEach( link => {
			link.addEventListener( 'click', e => {
				if ( ! mobileQuery.matches ) {
					return;
				}

				if ( link.getAttribute( 'href' ) === '#' ) {
					e.preventDefault();
				}

				const item = link.parentElement;

				if ( item ) {
					item.classList.toggle( 'is-open' );
				}
			} );
		} );

	document.addEventListener( 'click', e => {
		const target = e.target instanceof Element ? e.target : null;

		if ( ! target ) {
			return;
		}

		document
			.querySelectorAll( '.primary-navigation .menu-item-has-children.is-open' )
			.forEach( item => {
				if ( ! item.contains( target ) ) {
					item.classList.remove( 'is-open' );
				}
			} );
	} );
} )();
