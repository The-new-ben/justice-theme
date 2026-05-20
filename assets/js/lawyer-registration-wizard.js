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

		var wizardConfig = [
			{
				title: 'Basics',
				kicker: 'Step 1',
				description: 'Name, firm, license and direct contact details.',
				fields: ['lawyer_full_name', 'firm_name', 'bar_number', 'phone', 'email', 'whatsapp']
			},
			{
				title: 'Practice fit',
				kicker: 'Step 2',
				description: 'Practice area, locations, languages, website, plan interest and response availability.',
				fields: ['practice_area', 'cities_served', 'languages', 'website', 'plan_interest', 'lead_response_commitment']
			},
			{
				title: 'Mini-site material',
				kicker: 'Step 3',
				description: 'The material that becomes the lawyer profile, services, process, video and FAQs.',
				fields: ['bio_short', 'profile_headline', 'profile_services', 'profile_process', 'profile_video_url', 'profile_faqs']
			},
			{
				title: 'Review',
				kicker: 'Step 4',
				description: 'Submit for owner review. Nothing goes public before license and ethics review.',
				fields: []
			}
		];

		var wizard = document.createElement('div');
		wizard.className = 'lawyer-registration-wizard';
		wizard.setAttribute('aria-label', 'Lawyer onboarding wizard');

		var intro = document.createElement('div');
		intro.className = 'lawyer-registration-wizard__intro';
		intro.innerHTML = '<strong>Smart onboarding path</strong><span>The form is split into a guided flow so the lawyer understands what to prepare. AI drafting can be connected behind this flow later without changing the business process.</span>';
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

		stepElements.forEach(function (step, index) {
			var controls = document.createElement('div');
			controls.className = 'lawyer-registration-wizard__controls';

			if (index > 0) {
				var back = document.createElement('button');
				back.type = 'button';
				back.className = 'button button--outline';
				back.textContent = 'Back';
				back.addEventListener('click', function () {
					setStep(index - 1, stepElements, navItems);
				});
				controls.appendChild(back);
			}

			if (index < stepElements.length - 1) {
				var next = document.createElement('button');
				next.type = 'button';
				next.className = 'button button--gold';
				next.textContent = 'Next';
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
