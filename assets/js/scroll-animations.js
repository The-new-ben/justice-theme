/**
 * Jus-Tice scroll animations & sticky header.
 * Phase D — visual polish.
 *
 * @package JusticeTheme
 */
(function () {
  'use strict';

  /* ── Sticky header on scroll ─────────────────────────────── */
  var header = document.querySelector('.site-header');
  if (header) {
    var scrollThreshold = 80;
    var lastScrollY = 0;

    function handleHeaderScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > scrollThreshold) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
      lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  /* ── Section fade-in on scroll ───────────────────────────── */
  if ('IntersectionObserver' in window) {
    var sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
      section.setAttribute('data-animate', '');
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ── Animated stat counters ──────────────────────────────── */
  function animateCounter(el) {
    var target = parseInt(el.textContent.replace(/[^0-9]/g, ''), 10);
    if (isNaN(target) || target === 0) return;

    var duration = 1600;
    var startTime = null;
    var formatted = el.textContent.indexOf(',') !== -1;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      /* Ease out cubic */
      var easedProgress = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(easedProgress * target);
      el.textContent = formatted
        ? current.toLocaleString('he-IL')
        : current.toString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatted
          ? target.toLocaleString('he-IL')
          : target.toString();
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var statEls = document.querySelectorAll(
      '.hero__stat strong, .trust-section__number'
    );
    if (statEls.length) {
      var statsObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              statsObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      statEls.forEach(function (el) {
        statsObserver.observe(el);
      });
    }
  }
})();
