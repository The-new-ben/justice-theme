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
			page_location: window.location.href.split('#')[0],
			page_title: document.title
		};

		Object.keys(extra || {}).forEach(function (key) {
			if (extra[key] !== '') {
				params[key] = extra[key];
			}
		});

		return params;
	}

	function track(eventName, params) {
		var payload = eventParams(params);

		if ('function' === typeof window.gtag) {
			window.gtag('event', eventName, payload);
			return;
		}

		if (Array.isArray(window.dataLayer)) {
			window.dataLayer.push(Object.assign({ event: eventName }, payload));
		}
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

	function applyLeadPrefillFromLink(link) {
		var form;
		var area;
		var message;
		var areaField;
		var messageField;

		if (!link || !link.dataset) {
			return false;
		}

		if (!link.dataset.leadArea && !link.dataset.leadMessage && !link.dataset.leadSourceKeyword) {
			return false;
		}

		form = document.querySelector('#ask-lawyer form');

		if (!form) {
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
		setOrCreateHidden(form, 'utm_source', link.dataset.leadUtmSource || '');
		setOrCreateHidden(form, 'utm_medium', link.dataset.leadUtmMedium || '');
		setOrCreateHidden(form, 'utm_campaign', link.dataset.leadUtmCampaign || '');

		return true;
	}

	function trackSuccessFromQuery() {
		var query = new URLSearchParams(window.location.search);

		if ('success' === query.get('lead')) {
			track('generate_lead', { form_type: 'lead_redirect_success' });
		}

		if ('sent' === query.get('registration')) {
			track('lawyer_signup_submit', {
				form_type: 'lawyer_registration',
				plan_interest: query.get('plan_interest') || ''
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

		var appliedLeadPrefill = applyLeadPrefillFromLink(link);

		var href = link.getAttribute('href') || '';
		var lowerHref = href.toLowerCase();
		var params = {
			link_url: href,
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
			track('whatsapp_click', params);
			return;
		}

		if (link.closest('.lawyer-card') && lowerHref.indexOf('#') !== 0) {
			track('lawyer_card_click', params);
			return;
		}

		if (link.closest('.justice-content-lawyer-cta') || '#lead-form' === href || '#practice-lead-form' === href || '#lawyer-inquiry' === href) {
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

		document.querySelectorAll('select[data-selected-plan]').forEach(function (select) {
			var selectedPlan = select.getAttribute('data-selected-plan');

			if (selectedPlan) {
				select.value = selectedPlan;
			}
		});

		document.addEventListener('click', handleClick, true);

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
