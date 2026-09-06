(function () {
	'use strict';

	function setLink(id, path) {
		var link = document.getElementById(id);
		if (!link || !path) {
			return;
		}
		var current = link.getAttribute('href') || '';
		if (current && current !== '#') {
			return;
		}
		link.setAttribute('href', path);
	}

	function wireHomepageAiLinks() {
		setLink(
			'ai-sim-continue',
			'/legal-simulation/?utm_source=homepage&utm_medium=ai_center&utm_campaign=court_arena_continue'
		);
		setLink('ai-sim-lawyers', '/lawyers/');
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', wireHomepageAiLinks);
	} else {
		wireHomepageAiLinks();
	}
})();
