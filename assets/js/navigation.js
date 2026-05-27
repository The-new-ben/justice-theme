/**
 * Jus-Tice Navigation — Premium mobile menu + dropdown support.
 * No dependencies. Vanilla JS. RTL-safe.
 */
( () => {
  // ── Mobile hamburger ──────────────────────────────────────
  const toggle = document.querySelector( '.menu-toggle' );
  const nav    = document.querySelector( '.primary-navigation' );

  if ( toggle && nav ) {
    const rememberTogglePosition = () => {
      const rect = toggle.getBoundingClientRect();
      document.documentElement.style.setProperty( '--jt-menu-toggle-top', `${ Math.round( rect.top ) }px` );
      document.documentElement.style.setProperty( '--jt-menu-toggle-left', `${ Math.round( rect.left ) }px` );
      document.documentElement.style.setProperty( '--jt-menu-toggle-width', `${ Math.round( rect.width ) }px` );
      document.documentElement.style.setProperty( '--jt-menu-toggle-height', `${ Math.round( rect.height ) }px` );
    };

    const clearTogglePosition = () => {
      document.documentElement.style.removeProperty( '--jt-menu-toggle-top' );
      document.documentElement.style.removeProperty( '--jt-menu-toggle-left' );
      document.documentElement.style.removeProperty( '--jt-menu-toggle-width' );
      document.documentElement.style.removeProperty( '--jt-menu-toggle-height' );
    };

    const closeMenu = () => {
      toggle.setAttribute( 'aria-expanded', 'false' );
      document.body.classList.remove( 'nav-is-open' );
      clearTogglePosition();
    };

    toggle.addEventListener( 'click', () => {
      const isOpen = toggle.getAttribute( 'aria-expanded' ) === 'true';

      if ( isOpen ) {
        closeMenu();
        return;
      }

      rememberTogglePosition();
      toggle.setAttribute( 'aria-expanded', 'true' );
      document.body.classList.add( 'nav-is-open' );
    } );

    document.addEventListener( 'keydown', e => {
      if ( e.key === 'Escape' ) {
        closeMenu();
      }
    } );

    window.addEventListener( 'resize', () => {
      if ( document.body.classList.contains( 'nav-is-open' ) ) {
        closeMenu();
      }
    } );
  }

  // ── Mobile sub-menu accordion ─────────────────────────────
  // On small screens, tapping a parent item toggles children open
  if ( window.innerWidth <= 1220 ) {
    const parents = document.querySelectorAll(
      '.primary-navigation .menu-item-has-children > a'
    );

    parents.forEach( link => {
      link.addEventListener( 'click', e => {
        // Only intercept if it links to "#" (placeholder)
        if ( link.getAttribute( 'href' ) === '#' ) {
          e.preventDefault();
        }
        const li = link.parentElement;
        li.classList.toggle( 'is-open' );
      } );
    } );
  }

  // ── Close menu when clicking outside ─────────────────────
  document.addEventListener( 'click', e => {
    if (
      document.body.classList.contains( 'nav-is-open' ) &&
      ! nav.contains( e.target ) &&
      ! toggle.contains( e.target )
    ) {
      toggle.setAttribute( 'aria-expanded', 'false' );
      document.body.classList.remove( 'nav-is-open' );
      document.documentElement.style.removeProperty( '--jt-menu-toggle-top' );
      document.documentElement.style.removeProperty( '--jt-menu-toggle-left' );
      document.documentElement.style.removeProperty( '--jt-menu-toggle-width' );
      document.documentElement.style.removeProperty( '--jt-menu-toggle-height' );
    }
  } );

  // ── Desktop: close dropdowns on outside click ─────────────
  document.addEventListener( 'click', e => {
    const openParents = document.querySelectorAll(
      '.primary-navigation .menu-item-has-children.is-open'
    );
    openParents.forEach( li => {
      if ( ! li.contains( e.target ) ) {
        li.classList.remove( 'is-open' );
      }
    } );
  } );
} )();
