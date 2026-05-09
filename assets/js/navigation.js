/**
 * Jus-Tice Navigation — Premium mobile menu + dropdown support.
 * No dependencies. Vanilla JS. RTL-safe.
 */
( () => {
  // ── Mobile hamburger ──────────────────────────────────────
  const toggle = document.querySelector( '.menu-toggle' );
  const nav    = document.querySelector( '.primary-navigation' );

  if ( toggle && nav ) {
    toggle.addEventListener( 'click', () => {
      const isOpen = toggle.getAttribute( 'aria-expanded' ) === 'true';
      toggle.setAttribute( 'aria-expanded', String( ! isOpen ) );
      document.body.classList.toggle( 'nav-is-open', ! isOpen );
    } );

    document.addEventListener( 'keydown', e => {
      if ( e.key === 'Escape' ) {
        toggle.setAttribute( 'aria-expanded', 'false' );
        document.body.classList.remove( 'nav-is-open' );
      }
    } );
  }

  // ── Mobile sub-menu accordion ─────────────────────────────
  // On small screens, tapping a parent item toggles children open
  if ( window.innerWidth <= 768 ) {
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
