/*
 * The divorce command center (HAD-541): one block, eight tools, a tab bar. Hand-written, not built by
 * tools/build-justice-tools.mjs; it lives in dist/ because Autoptimize skips assets/js/tools/dist/.
 *
 * The server prints the bar and every panel, the first panel open and the others `hidden`, so nothing moves when this
 * script arrives. This script only switches panels:
 *   - a click on a tab, or the arrow keys / Home / End on the bar (RTL: ArrowLeft is the next tab);
 *   - any link or address hash that points inside a closed panel (#jtool-mezonot, #jtool-izun-sources, the tool map
 *     at the top of the page, the roadmap's links to other tools) opens that panel first;
 *   - a share link (#s=...) opens the panel whose tool loaded the shared answers.
 * The instruments boot on their own, hidden or not; nothing here talks to them.
 */
(function () {
	'use strict';

	function setup(root) {
		var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
		var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute('aria-controls')); });
		if (!tabs.length) { return; }

		function select(index, focus) {
			tabs.forEach(function (tab, i) {
				var on = i === index;
				tab.setAttribute('aria-selected', on ? 'true' : 'false');
				tab.tabIndex = on ? 0 : -1;
				if (panels[i]) { panels[i].hidden = !on; }
			});
			root.setAttribute('data-jt-cmd-open', tabs[index].getAttribute('data-jt-cmd-tab') || '');
			if (focus) { tabs[index].focus(); }
		}

		/** The panel index that holds the element with this id, or -1. */
		function panelOf(id) {
			if (!id) { return -1; }
			var el = document.getElementById(id);
			if (!el || !root.contains(el)) { return -1; }
			var panel = el.closest('[role="tabpanel"]');
			return panels.indexOf(panel);
		}

		tabs.forEach(function (tab, i) {
			tab.addEventListener('click', function () { select(i, false); });
			tab.addEventListener('keydown', function (e) {
				var last = tabs.length - 1;
				var next = null;
				if (e.key === 'ArrowLeft') { next = i === last ? 0 : i + 1; }
				else if (e.key === 'ArrowRight') { next = i === 0 ? last : i - 1; }
				else if (e.key === 'Home') { next = 0; }
				else if (e.key === 'End') { next = last; }
				if (next !== null) { e.preventDefault(); select(next, true); }
			});
		});

		/** Before the browser follows an in-page link, open the panel that holds its target. */
		document.addEventListener('click', function (e) {
			var link = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
			if (!link) { return; }
			var id = decodeURIComponent(link.getAttribute('href').slice(1));
			var index = panelOf(id);
			if (index < 0) { return; }
			if (panels[index].hidden) { select(index, false); }
			if (decodeURIComponent(window.location.hash.slice(1)) === id) {
				// Same hash: the browser will not scroll again, so do it here.
				e.preventDefault();
				document.getElementById(id).scrollIntoView({ block: 'start' });
			}
		}, true);

		function fromHash() {
			var hash = decodeURIComponent(window.location.hash.slice(1));
			if (!hash) { return; }
			if (hash.indexOf('s=') === 0) {
				// A share link: the tool that loaded it shows its "opened from a share link" line.
				var shared = root.querySelector('[data-jtool-shared]:not([hidden])');
				var at = shared ? panels.indexOf(shared.closest('[role="tabpanel"]')) : -1;
				if (at >= 0) { select(at, false); }
				return;
			}
			var index = panelOf(hash);
			if (index < 0) { return; }
			if (panels[index].hidden) {
				select(index, false);
				var target = document.getElementById(hash);
				if (target) { target.scrollIntoView({ block: 'start' }); }
			}
		}
		window.addEventListener('hashchange', fromHash);
		fromHash();
		// The instruments read a share link on DOMContentLoaded; look again once they have.
		window.addEventListener('load', fromHash);
	}

	function boot() {
		Array.prototype.forEach.call(document.querySelectorAll('[data-jt-cmd]'), setup);
	}
	if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
}());
