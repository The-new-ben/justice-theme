(function () {
	'use strict';

	function closestLabelByName(form, name) {
		var field = form.querySelector('[name="' + name + '"]');
		return field ? field.closest('label') : null;
	}

	function setStep(stepIndex, steps, navItems) {
		steps.forEach(function (step, index) {
			var isActive = index === stepIndex;
			step.hidden = !isActive;
			step.classList.toggle('is-active', isActive);
			navItems[index].classList.toggle('is-active', isActive);
			navItems[index].setAttribute('aria-current', isActive ? 'step' : 'false');
		});
	}

	function canLeaveStep(step) {
		var requiredFields = Array.prototype.slice.call(step.querySelectorAll('input[required], select[required], textarea[required]'));
		return requiredFields.every(function (field) {
			if (field.disabled || field.type === 'hidden') {
				return true;
			}

			if (!field.checkValidity()) {
				field.reportValidity();
				field.focus();
				return false;
			}

			return true;
		});
	}

	function ensureHiddenField(form, name, value, overwrite) {
		if (!value) {
			return;
		}

		var field = form.querySelector('input[name="' + name + '"]');
		if (!field) {
			field = document.createElement('input');
			field.type = 'hidden';
			field.name = name;
			form.appendChild(field);
		}

		if (overwrite || !field.value) {
			field.value = value;
		}
	}

	function readUrlAttribution() {
		var params = new URLSearchParams(window.location.search || '');
		var hash = window.location.hash ? window.location.hash.replace(/^#/, '') : '';

		if (hash) {
			if (hash.indexOf('?') !== -1) {
				hash = hash.split('?').pop();
			}

			var hashParams = new URLSearchParams(hash);
			hashParams.forEach(function (value, key) {
				if (!params.has(key)) {
					params.set(key, value);
				}
			});
		}

		var aliases = {
			source: 'utm_source',
			medium: 'utm_medium',
			campaign: 'utm_campaign',
			segment: 'outreach_segment',
			city: 'outreach_city',
			practice: 'outreach_practice'
		};

		Object.keys(aliases).forEach(function (alias) {
			if (params.has(alias) && !params.has(aliases[alias])) {
				params.set(aliases[alias], params.get(alias));
			}
		});

		return params;
	}

	function syncAttributionFields(form) {
		var params = readUrlAttribution();
		var keys = [
			'utm_source',
			'utm_medium',
			'utm_campaign',
			'utm_content',
			'utm_term',
			'outreach_segment',
			'outreach_city',
			'outreach_practice'
		];

		keys.forEach(function (key) {
			ensureHiddenField(form, key, params.get(key) || '', false);
		});

		ensureHiddenField(form, 'registration_landing_url', window.location.href, true);
		ensureHiddenField(form, 'registration_referrer_url', document.referrer || '', false);
	}

	document.addEventListener('DOMContentLoaded', function () {
		var form = document.querySelector('.lawyer-registration-form');
		if (!form || form.dataset.wizardReady) {
			return;
		}

		var grid = form.querySelector('.lawyer-registration-form__grid');
		if (!grid) {
			return;
		}

		form.dataset.wizardReady = '1';
		syncAttributionFields(form);

		var wizardConfig = [
			{
				title: 'פרטים בסיסיים',
				kicker: 'שלב 1',
				description: 'שם, משרד, מספר רישיון ופרטי קשר ישירים כדי שנוכל לבדוק התאמה ולחזור אליכם.',
				fields: ['lawyer_full_name', 'firm_name', 'bar_number', 'phone', 'email', 'whatsapp']
			},
			{
				title: 'התאמת תחום',
				kicker: 'שלב 2',
				description: 'תחום עיסוק, אזורי שירות, שפות, אתר קיים, מסלול רצוי וזמינות למענה לפניות.',
				fields: ['practice_area', 'cities_served', 'languages', 'website', 'plan_interest', 'lead_response_commitment']
			},
			{
				title: 'חומר למיני-סייט',
				kicker: 'שלב 3',
				description: 'הטקסטים שמהם נבנה פרופיל מקצועי: תיאור, כותרת, שירותים, תהליך עבודה, וידאו ושאלות נפוצות.',
				fields: ['bio_short', 'profile_headline', 'profile_services', 'profile_process', 'profile_video_url', 'profile_faqs']
			},
			{
				title: 'נכסי אמון',
				kicker: 'שלב 4',
				description: 'קישורי Google Business וביקורות עוזרים לנו לאמת נכסי מוניטין לפני הצגה או קמפיין המלצות.',
				fields: ['google_business_profile_url', 'google_review_request_url']
			},
			{
				title: 'בדיקה ושליחה',
				kicker: 'שלב 5',
				description: 'שליחה לבדיקה. שום דבר לא מתפרסם אוטומטית לפני בדיקת רישיון, התאמה, תוכן וכללי פרסום.',
				fields: []
			}
		];

		var wizard = document.createElement('div');
		wizard.className = 'lawyer-registration-wizard';
		wizard.setAttribute('aria-label', 'Lawyer onboarding wizard');

		var intro = document.createElement('div');
		intro.className = 'lawyer-registration-wizard__intro';
		intro.innerHTML = '<strong>מסלול הצטרפות חכם</strong><span>הטופס מחולק לשלבים קצרים כדי להכין פרופיל, תוכן, נכסי אמון ומסלול מסחרי בלי להציף אתכם בפרטים מיותרים.</span>';
		wizard.appendChild(intro);

		var nav = document.createElement('ol');
		nav.className = 'lawyer-registration-wizard__nav';
		wizard.appendChild(nav);

		var stepElements = [];
		var navItems = [];

		wizardConfig.forEach(function (config, index) {
			var navItem = document.createElement('li');
			navItem.innerHTML = '<span>' + config.kicker + '</span><strong>' + config.title + '</strong>';
			nav.appendChild(navItem);
			navItems.push(navItem);

			var section = document.createElement('section');
			section.className = 'lawyer-registration-wizard__step';
			section.hidden = true;
			section.innerHTML = '<div class="lawyer-registration-wizard__step-header"><span>' + config.kicker + '</span><h3>' + config.title + '</h3><p>' + config.description + '</p></div>';

			var fields = document.createElement('div');
			fields.className = 'lawyer-registration-wizard__fields';
			config.fields.forEach(function (fieldName) {
				var label = closestLabelByName(form, fieldName);
				if (label) {
					fields.appendChild(label);
				}
			});
			section.appendChild(fields);
			wizard.appendChild(section);
			stepElements.push(section);
		});

		var consent = form.querySelector('.lawyer-registration-form__consent');
		var submit = form.querySelector('button[type="submit"]');
		var finalStep = stepElements[stepElements.length - 1];
		var finalFields = finalStep.querySelector('.lawyer-registration-wizard__fields');
		if (consent) {
			finalFields.appendChild(consent);
		}
		if (submit) {
			finalFields.appendChild(submit);
		}

		var finalSummary = document.createElement('div');
		finalSummary.className = 'lawyer-registration-wizard__summary';
		finalSummary.innerHTML = '<strong>מה קורה אחרי השליחה?</strong><ul><li>נבדוק רישיון, תחום, אזורי שירות וזמינות למענה.</li><li>נכין את הפרופיל והמיני-סייט לבדיקה לפני פרסום.</li><li>אם נבחר מסלול בתשלום, נשלח הוראות תשלום או נפעיל תשלום אוטומטי רק כשהסליקה מאושרת.</li></ul>';
		finalStep.insertBefore(finalSummary, finalFields);

		stepElements.forEach(function (step, index) {
			var controls = document.createElement('div');
			controls.className = 'lawyer-registration-wizard__controls';

			if (index > 0) {
				var back = document.createElement('button');
				back.type = 'button';
				back.className = 'button button--outline';
				back.textContent = 'חזרה';
				back.addEventListener('click', function () {
					setStep(index - 1, stepElements, navItems);
				});
				controls.appendChild(back);
			}

			if (index < stepElements.length - 1) {
				var next = document.createElement('button');
				next.type = 'button';
				next.className = 'button button--gold';
				next.textContent = 'המשך';
				next.addEventListener('click', function () {
					if (canLeaveStep(step)) {
						setStep(index + 1, stepElements, navItems);
					}
				});
				controls.appendChild(next);
			}

			step.appendChild(controls);
		});

		form.insertBefore(wizard, grid);
		grid.remove();
		setStep(0, stepElements, navItems);
	});
}());
