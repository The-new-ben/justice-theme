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

	function replaceExactText(from, to) {
		var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
		var node;
		while ((node = walker.nextNode())) {
			if ((node.nodeValue || '').trim() === from) {
				node.nodeValue = node.nodeValue.replace(from, to);
			}
		}
	}

	function cleanPublicStatusCopy() {
		document.querySelectorAll('.lawyer-card__status--inactive').forEach(function (node) {
			node.textContent = 'פרופיל בסיסי';
		});
		replaceExactText(
			'פרטים בסיסיים מוצגים בזהירות, בלי עובדות לימודים, ניסיון או תמונה שלא נבדקו.',
			'פרטים בסיסיים מוצגים בצורה תמציתית, עם דגש על תחום, אזור ודרך יצירת קשר.'
		);
		replaceExactText(
			'ביקורות, מדיה ותוכן מקצועי נכנסים רק אחרי מקור ברור ואישור מתאים.',
			'פרופיל מורחב יכול לכלול ביקורות, מדיה ותוכן מקצועי שמחזקים אמון.'
		);
		replaceExactText(
			'עורכי דין ואנשי מקצוע ✓ פרופילים נבדקים לפני הצגה ✓ ללא הבטחת תוצאה או דירוג ✓ שקיפות מלאה לגבי שיתופי פעולה ומסלולים בתשלום',
			'עורכי דין ואנשי מקצוע ✓ פרטים לפי תחום ואזור ✓ ללא הבטחת תוצאה או דירוג ✓ שקיפות מלאה לגבי שיתופי פעולה ומסלולים בתשלום'
		);
	}

	function runBridge() {
		wireHomepageAiLinks();
		cleanPublicStatusCopy();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', runBridge);
	} else {
		runBridge();
	}
})();
