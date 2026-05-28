/**
 * Jus-Tice Navigation - mobile menu and dropdown support.
 * No dependencies. Vanilla JS. RTL-safe.
 */
( () => {
	const toggle = document.querySelector( '.menu-toggle' );
	const nav = document.querySelector( '.primary-navigation' );
	const mobileQuery = window.matchMedia( '(max-width: 1220px)' );
	let lockedScrollY = 0;
	let isScrollLocked = false;

	if ( toggle && nav ) {
		const closeSubmenus = () => {
			nav
				.querySelectorAll( '.menu-item-has-children.is-open' )
				.forEach( item => {
					item.classList.remove( 'is-open' );

					const link = item.querySelector( ':scope > a' );

					if ( link ) {
						link.setAttribute( 'aria-expanded', 'false' );
					}
				} );
		};

		const lockPageScroll = () => {
			if ( isScrollLocked ) {
				return;
			}

			lockedScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
			isScrollLocked = true;
			document.documentElement.classList.add( 'nav-is-open' );
		};

		const unlockPageScroll = () => {
			if ( ! isScrollLocked ) {
				document.documentElement.classList.remove( 'nav-is-open' );
				return;
			}

			document.documentElement.classList.remove( 'nav-is-open' );
			isScrollLocked = false;
			window.scrollTo( 0, lockedScrollY );
		};

		const setMenuOpen = isOpen => {
			toggle.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );

			if ( mobileQuery.matches ) {
				nav.setAttribute( 'aria-hidden', isOpen ? 'false' : 'true' );
			} else {
				nav.removeAttribute( 'aria-hidden' );
			}

			document.body.classList.toggle( 'nav-is-open', isOpen );

			if ( isOpen ) {
				lockPageScroll();
			} else {
				closeSubmenus();
				unlockPageScroll();
			}
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
			if ( document.body.classList.contains( 'nav-is-open' ) && ! mobileQuery.matches ) {
				setMenuOpen( false );
			}
		} );

		nav.addEventListener( 'click', e => {
			const target = e.target instanceof Element ? e.target : null;
			const link = target ? target.closest( 'a[href]' ) : null;
			const parentItem = link ? link.closest( '.menu-item-has-children' ) : null;

			if ( link && link.getAttribute( 'href' ) !== '#' && ! parentItem ) {
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
			link.setAttribute( 'aria-expanded', 'false' );

			link.addEventListener( 'click', e => {
				if ( ! mobileQuery.matches ) {
					return;
				}

				const item = link.parentElement;
				const submenu = item ? item.querySelector( ':scope > .sub-menu' ) : null;

				if ( ! item || ! submenu ) {
					return;
				}

				e.preventDefault();
				e.stopPropagation();

				const isOpen = ! item.classList.contains( 'is-open' );
				item.classList.toggle( 'is-open', isOpen );
				link.setAttribute( 'aria-expanded', isOpen ? 'true' : 'false' );
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
