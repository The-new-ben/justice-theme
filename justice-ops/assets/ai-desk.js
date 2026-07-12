/* Jus-Tice AI Legal Desk.
   One action: describe a situation or upload a document (a phone photo of a
   contract, a ticket, a letter), get a plain-Hebrew read within seconds, and
   a one-tap connection to a matching lawyer. The image is downscaled in the
   browser before it leaves the device (lighter payload, faster, and only
   what is needed to read the page is sent). Nothing is stored. The result is
   announced through an aria-live region and the whole flow is keyboard
   operable. Framed as general guidance that always ends at a human. */
(function () {
	'use strict';

	var CFG = window.JT_DESK || {};
	var root = document.getElementById('jt-ai-desk');

	if (!root || !CFG.endpoint) { return; }

	var mode = 'describe';
	var imageData = '';
	var t0 = Math.floor(Date.now() / 1000);

	function $(sel) { return root.querySelector(sel); }
	function esc(s) {
		return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
			return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
		});
	}

	// ---- mode tabs ----
	var tabs = root.querySelectorAll('.jtad__mode');
	tabs.forEach(function (t) {
		t.addEventListener('click', function () {
			mode = t.dataset.mode;
			tabs.forEach(function (x) {
				var on = x === t;
				x.classList.toggle('is-on', on);
				x.setAttribute('aria-selected', on ? 'true' : 'false');
			});
			$('#jtad-pane-describe').hidden = mode !== 'describe';
			$('#jtad-pane-document').hidden = mode !== 'document';
		});
	});

	// ---- example chips fill the box ----
	root.querySelectorAll('.jtad__chip').forEach(function (c) {
		c.addEventListener('click', function () {
			var ta = $('#jtad-text');
			ta.value = c.dataset.ex;
			ta.focus();
		});
	});

	// ---- document upload with in-browser downscale ----
	var fileInput = $('#jtad-file');
	var drop = $('#jtad-drop');
	var preview = $('#jtad-preview');

	function downscale(file, cb) {
		var reader = new FileReader();
		reader.onload = function (e) {
			var img = new Image();
			img.onload = function () {
				var max = 1600;
				var w = img.width, h = img.height;
				if (w > max || h > max) {
					if (w > h) { h = Math.round(h * max / w); w = max; }
					else { w = Math.round(w * max / h); h = max; }
				}
				var cv = document.createElement('canvas');
				cv.width = w; cv.height = h;
				cv.getContext('2d').drawImage(img, 0, 0, w, h);
				try { cb(cv.toDataURL('image/jpeg', 0.82)); }
				catch (err) { cb(e.target.result); }
			};
			img.onerror = function () { cb(''); };
			img.src = e.target.result;
		};
		reader.onerror = function () { cb(''); };
		reader.readAsDataURL(file);
	}

	function handleFile(file) {
		if (!file || file.type.indexOf('image') !== 0) {
			showError('אפשר להעלות תמונה של המסמך. אם יש לכם קובץ אחר, הדביקו את הטקסט בתיבה.');
			return;
		}
		downscale(file, function (data) {
			if (!data) { showError('לא הצלחנו לקרוא את הקובץ. נסו תמונה אחרת.'); return; }
			imageData = data;
			preview.hidden = false;
			preview.innerHTML = '<img src="' + esc(data) + '" alt="תצוגה מקדימה של המסמך שהועלה">'
				+ '<button type="button" class="jtad__rm" id="jtad-rm">הסרת התמונה</button>';
			$('#jtad-rm').addEventListener('click', function () {
				imageData = '';
				preview.hidden = true;
				preview.innerHTML = '';
				fileInput.value = '';
			});
		});
	}

	if (fileInput) {
		fileInput.addEventListener('change', function () { if (fileInput.files[0]) { handleFile(fileInput.files[0]); } });
	}
	if (drop) {
		drop.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); } });
		['dragover', 'dragenter'].forEach(function (ev) {
			drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-drag'); });
		});
		['dragleave', 'drop'].forEach(function (ev) {
			drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-drag'); });
		});
		drop.addEventListener('drop', function (e) { if (e.dataTransfer.files[0]) { handleFile(e.dataTransfer.files[0]); } });
	}

	// ---- analyze ----
	var result = $('#jtad-result');
	var go = $('#jtad-go');

	function showError(msg) {
		result.hidden = false;
		result.innerHTML = '<div class="jtad__err">' + esc(msg) + '</div>';
	}

	function loading() {
		result.hidden = false;
		result.innerHTML = '<div class="jtad__load"><span class="jtad__spin" aria-hidden="true"></span><span>קוראים ומנתחים את הפנייה שלכם. רגע אחד.</span></div>';
	}

	function list(title, items, cls, dot) {
		if (!items || !items.length) { return ''; }
		var lis = items.map(function (it) { return '<li>' + esc(it) + '</li>'; }).join('');
		return '<div class="jtad__sec ' + cls + '"><h4><span class="jtad__dot"></span>' + esc(title) + '</h4><ul>' + lis + '</ul></div>';
	}

	function render(d) {
		var h = '<div class="jtad__rcard" role="region" aria-label="הכיוון המשפטי שלכם">';
		if (d.doc_type) { h += '<span class="jtad__rtype">' + esc(d.doc_type) + '</span>'; }
		h += '<h3 class="jtad__rh">' + esc(d.headline || d.area_label) + '</h3>';
		if (d.summary) { h += '<p class="jtad__rsum">' + esc(d.summary) + '</p>'; }
		h += list('מה חשוב להבין', d.points, 'jtad__sec--points');
		h += list('שווה לשים לב', d.watch, 'jtad__sec--watch');
		h += list('הזכויות והאפשרויות שלכם', d.rights, 'jtad__sec--rights');
		h += list('הצעדים הבאים', d.steps, 'jtad__sec--steps');
		h += list('שאלות טובות לעורך דין', d.ask_lawyer, 'jtad__sec--ask');

		h += '<div class="jtad__cta">'
			+ '<a class="jtad__cta-wa" href="' + esc(d.wa) + '" target="_blank" rel="noopener nofollow">שליחה בוואטסאפ</a>'
			+ '<button type="button" class="jtad__cta-lead" id="jtad-open-lead">חיבור לעורך דין מתאים</button>'
			+ '</div>';
		if (d.hub) { h += '<a class="jtad__cta-hub" href="' + esc(d.hub) + '">מדריך והרחבה בנושא ' + esc(d.area_label) + ' ←</a>'; }
		h += '<p class="jtad__disc">התשובה נוצרה בעזרת בינה מלאכותית והיא מידע כללי בלבד, לא ייעוץ משפטי ולא תחליף לעורך דין. לפני כל פעולה כדאי להתייעץ עם עורך דין. הפנייה והמסמך לא נשמרים.</p>';
		h += '</div>';

		result.hidden = false;
		result.innerHTML = h;

		// wire the handoff form with this result's context; lead_area is the
		// router-vocabulary key so the lead actually routes to a lawyer
		var lead = $('#jtad-lead');
		$('#jtad-lead-area').value = d.lead_area || d.area_key || 'general';
		$('#jtad-lead-msg').value = (d.area_label ? ('נושא: ' + d.area_label + '. ') : '') + (d.summary || '').slice(0, 400);

		$('#jtad-open-lead').addEventListener('click', function () {
			lead.hidden = false;
			lead.scrollIntoView({ behavior: 'smooth', block: 'start' });
			$('#jtad-name').focus();
		});
	}

	function analyze() {
		var text = mode === 'describe' ? $('#jtad-text').value.trim() : $('#jtad-doctext').value.trim();

		if (mode === 'describe' && text.length < 8) { showError('ספרו קצת יותר על מה שקרה כדי שנוכל לעזור.'); $('#jtad-text').focus(); return; }
		if (mode === 'document' && !imageData && text.length < 20) { showError('העלו תמונה של המסמך או הדביקו את הטקסט שלו.'); return; }

		go.classList.add('is-busy');
		go.disabled = true;
		loading();

		var payload = {
			mode: mode,
			text: text,
			image: mode === 'document' ? imageData : '',
			hp: $('#jtad-hp').value,
			t0: t0
		};

		fetch(CFG.endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		}).then(function (r) { return r.json(); }).then(function (d) {
			go.classList.remove('is-busy');
			go.disabled = false;
			if (!d || d.error) {
				showError((d && d.message) ? d.message : 'לא הצלחנו לנתח כרגע. נסו שוב, או פנו ישירות לעורך דין בוואטסאפ.');
				return;
			}
			render(d);
		}).catch(function () {
			go.classList.remove('is-busy');
			go.disabled = false;
			showError('משהו השתבש בחיבור. נסו שוב בעוד רגע.');
		});
	}

	go.addEventListener('click', analyze);

	// ---- handoff pills ----
	function pillGroup(sel, attr, target) {
		var group = root.querySelectorAll(sel + ' .jtad__pill');
		group.forEach(function (p) {
			p.addEventListener('click', function () {
				group.forEach(function (x) { x.classList.remove('is-on'); });
				p.classList.add('is-on');
				if (target) { $(target).value = p.dataset[attr]; }
			});
		});
	}
	pillGroup('.jtad__intent', 'intent', null);
	pillGroup('.jtad__urg', 'urg', '#jtad-lead-urg');

	// fold the chosen intent into the message on submit so the lawyer sees it
	var leadForm = $('#jtad-lead');
	if (leadForm) {
		leadForm.addEventListener('submit', function () {
			var intentEl = root.querySelector('.jtad__intent .jtad__pill.is-on');
			var intent = intentEl ? intentEl.dataset.intent : '';
			var msgEl = $('#jtad-lead-msg');
			if (intent && msgEl.value.indexOf(intent) === -1) { msgEl.value = msgEl.value + ' | ' + intent; }
		});
	}
})();
