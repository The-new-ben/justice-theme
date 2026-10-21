(function () {
	'use strict';

	var startedForms = new WeakSet();

	function getText(element) {
		return (element.textContent || element.getAttribute('aria-label') || '').trim().slice(0, 120);
	}

	function getFormAction(form) {
		var action = form.querySelector('input[name="action"]');
		return action ? action.value : '';
	}

	function getFieldValue(form, name) {
		var field = form.querySelector('[name="' + name + '"]');
		return field ? String(field.value || '').trim().slice(0, 120) : '';
	}

	function getSelectLabel(form, name) {
		var field = form.querySelector('select[name="' + name + '"]');
		var option;

		if (!field || !field.value) {
			return '';
		}

		option = field.options[field.selectedIndex];

		return option ? String(option.textContent || '').trim().slice(0, 120) : field.value;
	}

	function getFormType(form) {
		var action = getFormAction(form);

		if ('justice_lawyer_registration' === action) {
			return 'lawyer_registration';
		}

		if ('justice_submit_legal_request' === action) {
			return 'legal_tool_request';
		}

		if ('justice_submit_lead' === action) {
			if (form.closest('#lawyer-inquiry')) {
				return 'lawyer_profile_lead';
			}

			if (form.classList.contains('lead-form')) {
				return 'practice_lead';
			}

			return 'ask_lawyer';
		}

		return 'unknown';
	}

	function eventParams(extra) {
		var params = {
			page_path: window.location.pathname,
			// Query and fragment values may contain typed case/contact information.
			page_location: window.location.origin + window.location.pathname,
			page_title: document.title
		};

		Object.keys(extra || {}).forEach(function (key) {
			if (extra[key] !== '') {
				params[key] = extra[key];
			}
		});

		return params;
	}

	function sanitizedLinkUrl(href) {
		var url;

		try {
			url = new URL(href, window.location.href);
			if (['http:', 'https:', 'tel:', 'mailto:'].indexOf(url.protocol) === -1) {
				return '';
			}

			// Destination identity is useful; arbitrary query/fragment values are not.
			url.username = '';
			url.password = '';
			url.search = '';
			if (!isLeadFormAnchor(url.hash)) {
				url.hash = '';
			}

			return url.toString();
		} catch (error) {
			return '';
		}
	}

	function isLeadFormAnchor(hash) {
		return ['#ask-lawyer', '#lead-form', '#practice-lead-form', '#lawyer-inquiry'].indexOf(hash) !== -1;
	}

	function isInternalLeadFormLink(url) {
		return !!url && url.origin === window.location.origin && isLeadFormAnchor(url.hash);
	}

	function isIntakeMeasurementTest() {
		var testField = document.querySelector('input[name="justice_intake_test"]');
		return '1' === new URLSearchParams(window.location.search).get('lead_test')
			|| !!(testField && '1' === testField.value);
	}

	function track(eventName, params) {
		// Excludes explicit synthetic intake checks from this event emitter only.
		// This does not disable other analytics or change consent configuration.
		if (isIntakeMeasurementTest()) {
			return;
		}
		var payload = eventParams(params);

		if ('function' === typeof window.gtag) {
			window.gtag('event', eventName, payload);
			return;
		}

		if (Array.isArray(window.dataLayer)) {
			window.dataLayer.push(Object.assign({ event: eventName }, payload));
		}
	}

	function getAskLawyerWhatsAppAnalyticsParams(link) {
		var href = link.getAttribute('href') || '';
		var lowerHref = href.toLowerCase();
		var form;

		if (!link.closest('#ask-lawyer')) {
			return {};
		}

		if (lowerHref.indexOf('wa.me/') === -1 && lowerHref.indexOf('api.whatsapp.com') === -1) {
			return {};
		}

		form = document.querySelector('#ask-lawyer form');

		if (!form) {
			return { form_type: 'ask_lawyer_whatsapp' };
		}

		return {
			form_type: 'ask_lawyer_whatsapp',
			legal_area: getFieldValue(form, 'lead_area'),
			lead_city_present: getFieldValue(form, 'lead_city') ? 'yes' : 'no',
			lead_urgency: getFieldValue(form, 'lead_urgency'),
			lead_message_present: getFieldValue(form, 'lead_message') ? 'yes' : 'no',
			lead_phone_present: getFieldValue(form, 'lead_phone') ? 'yes' : 'no',
			lead_name_present: getFieldValue(form, 'lead_name') ? 'yes' : 'no'
		};
	}

	function setOrCreateHidden(form, name, value) {
		var field;

		if (!value) {
			return;
		}

		field = form.querySelector('input[name="' + name + '"]');

		if (!field) {
			field = document.createElement('input');
			field.type = 'hidden';
			field.name = name;
			form.appendChild(field);
		}

		field.value = value;
	}

	function getLawyerRevenueDestination(linkUrl) {
		if (!linkUrl) {
			return '';
		}

		var path = linkUrl.pathname || '/';
		path = path.replace(/\/+$/, '');
		path = path ? path + '/' : '/';

		if ('/lawyer-plans/' === path) {
			return 'lawyer_plans';
		}

		if ('/lawyer-registration/' === path) {
			return 'lawyer_registration';
		}

		if ('/lawyer-dashboard/' === path) {
			return 'lawyer_dashboard';
		}

		return '';
	}

	function getLawyerRevenueSurface(link) {
		if (link.closest('.site-header__lawyer-actions')) {
			return 'site_header';
		}

		if (link.closest('.lawyer-cta')) {
			return 'homepage_lawyer_cta';
		}

		if (link.closest('.featured-lawyers')) {
			return 'homepage_featured_lawyer';
		}

		if (link.closest('.lawyer-plans')) {
			return 'lawyer_plans_page';
		}

		if (link.closest('.site-footer')) {
			return 'site_footer';
		}

		return 'general';
	}

	function getWhatsAppSurface(link) {
		if (link.dataset && link.dataset.whatsappSurface) {
			return link.dataset.whatsappSurface;
		}

		if (link.closest('.hero')) {
			return 'homepage_hero';
		}

		if (link.closest('.site-header')) {
			return 'site_header';
		}

		if (link.closest('#ask-lawyer')) {
			return 'ask_lawyer_form';
		}

		if (link.closest('.site-footer')) {
			return 'site_footer';
		}

		if (link.closest('.whatsapp-float')) {
			return 'floating_whatsapp';
		}

		if (link.closest('.lawyer-card')) {
			return 'lawyer_card';
		}

		return 'general';
	}

	function applyLeadPrefillFromLink(link, event) {
		var form;
		var area;
		var message;
		var areaField;
		var messageField;

		if (!link || !link.dataset) {
			return false;
		}

		if (!link.dataset.leadArea && !link.dataset.leadMessage && !link.dataset.leadSourceKeyword && !link.dataset.leadSourceSurface) {
			return false;
		}

		form = document.querySelector('#ask-lawyer form');

		if (!form) {
			// An article CTA links the clean homepage anchor; its context rides
			// along in sessionStorage and fills the form on the next page.
			storeLeadContext(link, event);
			return false;
		}

		area = link.dataset.leadArea || '';
		message = link.dataset.leadMessage || '';
		areaField = form.querySelector('[name="lead_area"]');
		messageField = form.querySelector('[name="lead_message"]');

		if (area && areaField) {
			areaField.value = area;
		}

		if (message && messageField) {
			messageField.value = message;
		}

		setOrCreateHidden(form, 'source_keyword', link.dataset.leadSourceKeyword || '');
		setOrCreateHidden(form, 'lead_source_surface', link.dataset.leadSourceSurface || '');
		setOrCreateHidden(form, 'utm_source', link.dataset.leadUtmSource || '');
		setOrCreateHidden(form, 'utm_medium', link.dataset.leadUtmMedium || '');
		setOrCreateHidden(form, 'utm_campaign', link.dataset.leadUtmCampaign || '');

		return true;
	}

	var LEAD_CONTEXT_KEY = 'justice_lead_context';

	// True only for a same-site link to the homepage lead form (/#ask-lawyer):
	// a WhatsApp or profile link that also carries data-lead-* must not leave
	// context behind for an unrelated later visit.
	function linksToLeadForm(link) {
		var url;

		try {
			url = new URL(link.getAttribute('href') || '', window.location.href);
		} catch (error) {
			return false;
		}

		return url.origin === window.location.origin && '/' === url.pathname && '#ask-lawyer' === url.hash;
	}

	var LEAD_CONTEXT_MAX_AGE_MS = 10 * 60 * 1000;
	var LEAD_CONTEXT_CLEAR_AFTER_MS = 1500;

	// Context handoff between pages (the article CTA no longer carries
	// lead_area/lead_message query strings): the clicked link's data-lead-*
	// values are stored for one navigation and applied to the homepage form.
	// A Ctrl/Cmd/Shift-click opens the CTA in another tab, which inherits a
	// copy of sessionStorage at creation; this tab then clears its own copy a
	// moment later so a later homepage visit here is not attributed to the
	// article. A stored context also expires on its own.
	function storeLeadContext(link, event) {
		if (!linksToLeadForm(link)) {
			return;
		}

		var opensElsewhere = !!(event && (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || (typeof event.button === 'number' && event.button !== 0)));

		var context = {
			savedAt: Date.now(),
			leadArea: link.dataset.leadArea || '',
			leadMessage: link.dataset.leadMessage || '',
			leadSourceKeyword: link.dataset.leadSourceKeyword || '',
			leadSourceSurface: link.dataset.leadSourceSurface || ''
		};

		if (!context.leadArea && !context.leadMessage && !context.leadSourceKeyword && !context.leadSourceSurface) {
			return;
		}

		try {
			window.sessionStorage.setItem(LEAD_CONTEXT_KEY, JSON.stringify(context));
		} catch (error) {
			// Storage unavailable: the visitor still lands on the form.
			return;
		}

		if (opensElsewhere) {
			window.setTimeout(function () {
				try {
					window.sessionStorage.removeItem(LEAD_CONTEXT_KEY);
				} catch (error) {
					// Nothing to clear.
				}
			}, LEAD_CONTEXT_CLEAR_AFTER_MS);
		}
	}

	function applyStoredLeadContext() {
		var raw = null;
		var context = null;
		var carrier;

		if (!document.querySelector('#ask-lawyer form')) {
			return false;
		}

		try {
			raw = window.sessionStorage.getItem(LEAD_CONTEXT_KEY);
			window.sessionStorage.removeItem(LEAD_CONTEXT_KEY);
		} catch (error) {
			raw = null;
		}

		if (!raw) {
			return false;
		}

		try {
			context = JSON.parse(raw);
		} catch (error) {
			return false;
		}

		if (!context || typeof context !== 'object') {
			return false;
		}

		if (typeof context.savedAt !== 'number' || Date.now() - context.savedAt > LEAD_CONTEXT_MAX_AGE_MS) {
			return false;
		}

		carrier = document.createElement('a');
		carrier.dataset.leadArea = String(context.leadArea || '').slice(0, 60);
		carrier.dataset.leadMessage = String(context.leadMessage || '').slice(0, 260);
		carrier.dataset.leadSourceKeyword = String(context.leadSourceKeyword || '').slice(0, 200);
		carrier.dataset.leadSourceSurface = String(context.leadSourceSurface || '').slice(0, 60);

		return applyLeadPrefillFromLink(carrier);
	}

	// A middle-click dispatches auxclick, not click: it opens the CTA in a new
	// tab, so the context is stored for that tab the same way as a Ctrl-click.
	function handleAuxClick(event) {
		var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;

		if (!link || !link.dataset || event.button !== 1) {
			return;
		}

		if (document.querySelector('#ask-lawyer form')) {
			return;
		}

		storeLeadContext(link, event);
	}

	function applyAskLawyerWhatsAppPrefill(link) {
		if (link.getAttribute('data-investigation-interest') === 'pilot') return;
		var href = link.getAttribute('href') || '';
		var lowerHref = href.toLowerCase();
		var form;
		var messageParts;
		var url;
		var name;
		var phone;
		var area;
		var city;
		var urgency;
		var message;

		if (lowerHref.indexOf('wa.me/') === -1 && lowerHref.indexOf('api.whatsapp.com') === -1) {
			return;
		}

		// A WhatsApp link inside the intake form captures that form. Sitewide WhatsApp
		// buttons (floating CTA, mobile menu, header) capture an intake form when the
		// page has one and the visitor filled it; otherwise they keep the default prefill.
		if (link.closest('#ask-lawyer')) {
			form = document.querySelector('#ask-lawyer form');
		} else {
			form = document.querySelector('#ask-lawyer form, #lawyer-inquiry form');
		}

		if (!form) {
			return;
		}

		name = getFieldValue(form, 'lead_name');
		phone = getFieldValue(form, 'lead_phone');
		area = getSelectLabel(form, 'lead_area');
		city = getFieldValue(form, 'lead_city');
		urgency = getSelectLabel(form, 'lead_urgency');
		message = getFieldValue(form, 'lead_message');
		messageParts = ['שלום, אני רוצה לבדוק פנייה משפטית דרך Jus-Tice.'];

		if (area) {
			messageParts.push('תחום: ' + area);
		}

		if (city) {
			messageParts.push('עיר / אזור: ' + city);
		}

		if (urgency) {
			messageParts.push('דחיפות: ' + urgency);
		}

		if (message) {
			messageParts.push('תיאור קצר: ' + message);
		}

		if (name) {
			messageParts.push('שם: ' + name);
		}

		if (phone) {
			messageParts.push('טלפון: ' + phone);
		}

		try {
			url = new URL(href, window.location.href);
			url.searchParams.set('text', messageParts.join('\n'));
			link.setAttribute('href', url.toString());
		} catch (error) {
			return;
		}
	}

	function confirmStoredIntake() {
		if (isIntakeMeasurementTest() || 'function' !== typeof window.fetch || !window.justiceIntakeReceipt) {
			return;
		}
		var endpoint;
		try {
			endpoint = new URL(window.justiceIntakeReceipt.endpoint, window.location.href);
			if (endpoint.origin !== window.location.origin || endpoint.username || endpoint.password) { return; }
		} catch (error) { return; }
		window.fetch(endpoint.toString(), {
			method: 'POST', credentials: 'same-origin', cache: 'no-store', referrerPolicy: 'origin',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'X-Justice-Receipt': '1' },
			body: 'action=justice_intake_receipt&return_path=' + encodeURIComponent(window.location.pathname)
		}).then(function(response) {
			if (!response.ok) { return null; }
			return response.json();
		}).then(function(receipt) {
			if (!receipt || receipt.version !== 1 || receipt.stored !== true) { return; }
			document.querySelectorAll('[data-intake-receipt-notice]').forEach(function(notice) {
				notice.textContent = 'הפנייה נשמרה במערכת.';
			});
			if (receipt.fresh === true) {
				track('generate_lead', { form_type: 'server_confirmed_intake', confirmation_source: 'stored_receipt', measurement_version: 2 });
			}
		}).catch(function() {
			// Storage and routing do not depend on analytics. Never invent success on error.
		});
	}

	function trackSuccessFromQuery() {
		var query = new URLSearchParams(window.location.search);
		var hashQuery = new URLSearchParams((window.location.hash || '').replace(/^#/, ''));

		hashQuery.forEach(function(value, key) {
			if (!query.has(key)) {
				query.set(key, value);
			}
		});

		if ('success' === query.get('lead')) {
			confirmStoredIntake();
		}

		if ('sent' === query.get('registration')) {
			track('lawyer_signup_submit', {
				form_type: 'lawyer_registration',
				registration_result: 'sent',
				plan_interest: query.get('plan_interest') || '',
				payment_path: query.get('payment_path') || '',
				outreach_segment: query.get('outreach_segment') || '',
				outreach_city: query.get('outreach_city') || '',
				outreach_practice: query.get('outreach_practice') || '',
				utm_source: query.get('utm_source') || '',
				utm_medium: query.get('utm_medium') || '',
				utm_campaign: query.get('utm_campaign') || '',
				utm_content: query.get('utm_content') || '',
				utm_term: query.get('utm_term') || ''
			});
		}

		if ('sent' === query.get('request')) {
			track('document_request_submit', { form_type: 'legal_tool_request' });
		}
	}

	function trackFormStart(form) {
		if (startedForms.has(form)) {
			return;
		}

		startedForms.add(form);

		var action = getFormAction(form);
		var formType = getFormType(form);

		if ('justice_lawyer_registration' === action) {
			track('lawyer_signup_start', {
				form_type: formType,
				plan_interest: getFieldValue(form, 'plan_interest')
			});
			return;
		}

		if ('justice_submit_legal_request' === action) {
			track('document_request_start', { form_type: formType });
			return;
		}

		if ('justice_submit_lead' === action) {
			track('ask_lawyer_start', {
				form_type: formType,
				legal_area: getFieldValue(form, 'lead_area'),
				assigned_lawyer_id: getFieldValue(form, 'assigned_lawyer_id')
			});
		}
	}

	function trackFormSubmit(form) {
		var action = getFormAction(form);
		var formType = getFormType(form);

		if ('justice_submit_lead' === action) {
			track('lead_form_submit', {
				form_type: formType,
				legal_area: getFieldValue(form, 'lead_area'),
				lead_city_present: getFieldValue(form, 'lead_city') ? 'yes' : 'no',
				lead_urgency: getFieldValue(form, 'lead_urgency'),
				source_keyword: getFieldValue(form, 'source_keyword'),
				assigned_lawyer_id: getFieldValue(form, 'assigned_lawyer_id')
			});
			return;
		}

		if ('justice_lawyer_registration' === action) {
			trackFormStart(form);
			return;
		}

		if ('justice_submit_legal_request' === action) {
			trackFormStart(form);
		}
	}

	function handleClick(event) {
		var link = event.target.closest('a[href]');

		if (!link) {
			return;
		}

		var appliedLeadPrefill = applyLeadPrefillFromLink(link, event);

		applyAskLawyerWhatsAppPrefill(link);

		var href = link.getAttribute('href') || '';
		var lowerHref = href.toLowerCase();
		var params = {
			link_url: sanitizedLinkUrl(href),
			link_text: getText(link)
		};
		var linkUrl;
		var planInterest = '';
		var revenueDestination = '';

		try {
			linkUrl = new URL(href, window.location.href);
			planInterest = linkUrl.searchParams.get('plan_interest') || '';
			revenueDestination = getLawyerRevenueDestination(linkUrl);
		} catch (error) {
			linkUrl = null;
		}

		if (appliedLeadPrefill && linkUrl && '#ask-lawyer' === linkUrl.hash && '/' === linkUrl.pathname && '/' === window.location.pathname) {
			event.preventDefault();
			document.getElementById('ask-lawyer').scrollIntoView({ behavior: 'smooth', block: 'start' });

			if (window.history && window.history.pushState) {
				window.history.pushState(null, '', '#ask-lawyer');
			}
		}

		if (planInterest) {
			track('lawyer_plan_click', Object.assign({}, params, {
				plan_interest: planInterest
			}));
		}

		if (revenueDestination) {
			track('lawyer_revenue_click', Object.assign({}, params, {
				destination: revenueDestination,
				surface: getLawyerRevenueSurface(link),
				plan_interest: planInterest,
				payment_path: linkUrl ? (linkUrl.searchParams.get('payment_path') || '') : '',
				outreach_segment: linkUrl ? (linkUrl.searchParams.get('outreach_segment') || '') : '',
				utm_source: linkUrl ? (linkUrl.searchParams.get('utm_source') || '') : '',
				utm_medium: linkUrl ? (linkUrl.searchParams.get('utm_medium') || '') : '',
				utm_campaign: linkUrl ? (linkUrl.searchParams.get('utm_campaign') || '') : ''
			}));
		}

		if (0 === lowerHref.indexOf('tel:')) {
			track('phone_click', params);
			return;
		}

		if (lowerHref.indexOf('wa.me/') !== -1 || lowerHref.indexOf('api.whatsapp.com') !== -1 || getText(link).toLowerCase().indexOf('whatsapp') !== -1) {
			params.whatsapp_surface = getWhatsAppSurface(link);
			if (link.getAttribute('data-investigation-interest') === 'pilot') {
				track('investigation_simulation_interest', { product_intent: 'police_questioning', surface: 'criminal_article', contact_method: 'whatsapp' });
			}

			if (link.closest('#ask-lawyer')) {
				track('lead_whatsapp_intent', Object.assign({}, params, getAskLawyerWhatsAppAnalyticsParams(link)));
			}

			track('whatsapp_click', Object.assign({}, params, getAskLawyerWhatsAppAnalyticsParams(link)));
			return;
		}

		if (link.closest('.lawyer-card') && lowerHref.indexOf('#') !== 0) {
			track('lawyer_card_click', params);
			return;
		}

		if (link.closest('.justice-content-lawyer-cta') || isInternalLeadFormLink(linkUrl)) {
			track('article_cta_click', params);
			return;
		}

		if (link.closest('.legaltech-tools')) {
			track('legaltech_tool_click', Object.assign({}, params, {
				legal_area: link.dataset.leadArea || '',
				source_keyword: link.dataset.leadSourceKeyword || ''
			}));
			return;
		}

		if (link.closest('.related-content, .related-articles, .article-related')) {
			track('related_article_click', params);
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		trackSuccessFromQuery();
		applyStoredLeadContext();

		document.querySelectorAll('select[data-selected-plan]').forEach(function (select) {
			var selectedPlan = select.getAttribute('data-selected-plan');

			if (selectedPlan) {
				select.value = selectedPlan;
			}
		});

		document.addEventListener('click', handleClick, true);
		document.addEventListener('auxclick', handleAuxClick, true);

		document.querySelectorAll('form').forEach(function (form) {
			form.addEventListener('focusin', function () {
				trackFormStart(form);
			});

			form.addEventListener('submit', function () {
				trackFormSubmit(form);
			});
		});
	});
}());
