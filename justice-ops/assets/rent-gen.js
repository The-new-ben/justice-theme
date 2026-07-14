/**
 * Rent agreement builder v2 - guided wizard over the existing contract text.
 *
 * Design contract (research-backed, sources in project-control):
 * 3-5 inputs per step; always-visible progress; live preview; autosave to
 * localStorage with resume; unfilled blanks stay click-to-edit in the final
 * document so nothing blocks completion. Monetization is scaffolded behind
 * JT_RENT_CFG.monetize and renders nothing while false.
 */
(function () {
	'use strict';

	var app = document.getElementById('jt-rent-app');
	var src = document.getElementById('jt-rent-doc-src');
	if (!app || !src) { return; }

	var CFG = window.JT_RENT_CFG || { monetize: false, wa: '#', sched: '/' };
	var LS = 'jtRentV2';

	/* Wizard model: canonical fields -> contract token ids (data-f spans). */
	var STEPS = [
		{ id: 'parties', title: 'הצדדים', fields: [
			{ k: 'landlord', label: 'שם המשכיר (בעל הדירה)', map: ['f01', 'f19'], auto: 'name' },
			{ k: 'landlordId', label: 'ת"ז המשכיר', map: ['f02', 'f20'], inputmode: 'numeric' },
			{ k: 'tenant', label: 'שם השוכר', map: ['f06', 'f21'], auto: 'name' },
			{ k: 'tenantId', label: 'ת"ז השוכר', map: ['f07', 'f22'], inputmode: 'numeric' }
		] },
		{ id: 'property', title: 'הנכס', fields: [
			{ k: 'street', label: 'רחוב', map: ['f09', 'f24'] },
			{ k: 'houseNum', label: 'מספר בית', map: ['f10', 'f25'], size: 'half', inputmode: 'numeric' },
			{ k: 'aptNum', label: 'מספר דירה', map: ['f08', 'f23'], size: 'half', inputmode: 'numeric' },
			{ k: 'city', label: 'עיר', map: ['f11', 'f26'] },
			{ k: 'area', label: 'שטח במ"ר (לא חובה)', map: ['f12'], size: 'half', inputmode: 'numeric', optional: true },
			{ k: 'parking', label: 'חניה', type: 'toggle', opt: 'parking', more: [ { k: 'parkingNum', label: 'מספרי חניה', map: ['f27'] } ] },
			{ k: 'storage', label: 'מחסן', type: 'toggle', opt: 'storage', more: [ { k: 'storageNum', label: 'מספר מחסן', map: ['f29'], size: 'half' } ] }
		] },
		{ id: 'term', title: 'תקופה', fields: [
			{ k: 'dateFrom', label: 'תחילת שכירות', type: 'date', map: ['f13'] },
			{ k: 'dateTo', label: 'סיום שכירות', type: 'date', map: ['f14'], hint: 'נקבע אוטומטית לשנה, אפשר לשנות' },
			{ k: 'option', label: 'אופציה לשנה נוספת', type: 'toggle' }
		] },
		{ id: 'money', title: 'תשלום', fields: [
			{ k: 'rent', label: 'שכר דירה חודשי בש"ח', map: ['f15'], inputmode: 'numeric' },
			{ k: 'optionRent', label: 'שכ"ד בתקופת האופציה (אם שונה)', map: ['f16'], inputmode: 'numeric', optional: true, showIf: 'option' }
		] },
		{ id: 'guarantee', title: 'בטחונות', fields: [
			{ k: 'guarantors', label: 'כתב ערבות (ערבים)', type: 'toggle', more: [
				{ k: 'g1', label: 'ערב 1: שם מלא', map: ['f49'] },
				{ k: 'g1id', label: 'ערב 1: ת"ז', map: ['f50'], size: 'half', inputmode: 'numeric' },
				{ k: 'g2', label: 'ערב 2: שם מלא (לא חובה)', map: ['f51'], optional: true },
				{ k: 'g2id', label: 'ערב 2: ת"ז', map: ['f52'], size: 'half', inputmode: 'numeric', optional: true }
			] }
		] },
		{ id: 'signing', title: 'חתימה', fields: [
			{ k: 'signCity', label: 'עיר החתימה', map: ['f17'] },
			{ k: 'signDate', label: 'תאריך חתימה', type: 'date', map: ['f18'] }
		] }
	];

	var state = { step: 0, v: {}, eq: [] };
	try { var saved = JSON.parse(localStorage.getItem(LS) || 'null'); if (saved && saved.v) { state = saved; } } catch (e) {}

	function save() { try { localStorage.setItem(LS, JSON.stringify(state)); } catch (e) {} }
	function val(k) { return (state.v[k] || '').toString().trim(); }
	function el(t, cls, html) { var e = document.createElement(t); if (cls) { e.className = cls; } if (html !== undefined) { e.innerHTML = html; } return e; }
	function heDate(iso) {
		if (!iso) { return ''; }
		var p = iso.split('-');
		return p.length === 3 ? p[2] + '.' + p[1] + '.' + p[0] : iso;
	}

	/* ---------- document rendering ---------- */
	var doc = el('div', 'jtr-doc');
	doc.innerHTML = src.innerHTML;

	function tokenTargets() {
		var m = {};
		doc.querySelectorAll('.jtr-f').forEach(function (s) { (m[s.getAttribute('data-f')] = m[s.getAttribute('data-f')] || []).push(s); });
		return m;
	}
	var T = tokenTargets();

	function renderDoc() {
		STEPS.forEach(function (st) {
			st.fields.forEach(function (f) { applyField(f); (f.more || []).forEach(applyField); });
		});
		doc.querySelectorAll('.jtr-opt').forEach(function (seg) {
			var on = !!state.v[seg.getAttribute('data-opt')];
			seg.style.display = on ? '' : 'none';
		});
		var eqBody = doc.querySelector('.jtr-eq-rows');
		if (eqBody) {
			eqBody.innerHTML = state.eq.length
				? state.eq.map(function (r) { return '<tr><td>' + esc(r.n) + '</td><td>' + esc(r.q) + '</td></tr>'; }).join('')
				: '<tr><td colspan="2">- ללא פריטים -</td></tr>';
		}
		var ga = doc.querySelector('[data-appendix="guarantee"]');
		if (ga) { ga.style.display = state.v.guarantors ? '' : 'none'; }
	}

	function applyField(f) {
		if (!f.map) { return; }
		var raw = val(f.k);
		var out = raw;
		if (f.type === 'date') { out = heDate(raw); }
		if ((f.k === 'rent' || f.k === 'optionRent') && raw) { out = Number(raw).toLocaleString('he-IL'); }
		f.map.forEach(function (tok) {
			(T[tok] || []).forEach(function (span) {
				if (out) { span.textContent = out; span.classList.add('jtr-f--set'); span.removeAttribute('contenteditable'); }
				else if (!span.classList.contains('jtr-f--manual')) { span.innerHTML = '&#8288;____&#8288;'; span.classList.remove('jtr-f--set'); }
			});
		});
	}

	function esc(s) { return (s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

	/* prepare appendix hooks inside the raw contract text */
	(function prepDoc() {
		doc.querySelectorAll('h2').forEach(function (h) {
			if (h.textContent.indexOf('כתב ערבות') > -1) {
				var wrap = el('div'); wrap.setAttribute('data-appendix', 'guarantee');
				var n = h; var group = [];
				while (n) { var nx = n.nextSibling; group.push(n); n = nx; }
				h.parentNode.appendChild(wrap); group.forEach(function (g) { wrap.appendChild(g); });
			}
			if (h.textContent.indexOf('רשימת ציוד') > -1) {
				var t = el('table', 'jtr-eq'); t.innerHTML = '<thead><tr><th>פריט</th><th>כמות</th></tr></thead><tbody class="jtr-eq-rows"></tbody>';
				var sib = h.nextElementSibling;
				while (sib && sib.tagName !== 'H2') { var rm = sib; sib = sib.nextElementSibling; if (rm.querySelector && (rm.querySelector('.jtr-f') || rm.tagName === 'TABLE')) { rm.remove(); } }
				h.parentNode.insertBefore(t, h.nextSibling);
			}
		});
		T = tokenTargets();
	})();

	/* ---------- UI shell ---------- */
	var shell = el('div', 'jtr');
	shell.innerHTML =
		'<div class="jtr-head"><div class="jtr-head__t">בניית חוזה שכירות</div><div class="jtr-head__s">6 שלבים קצרים - המסמך נבנה תוך כדי</div>' +
		'<div class="jtr-prog" role="progressbar" aria-valuemin="0" aria-valuemax="100"><span class="jtr-prog__bar"></span></div><ol class="jtr-crumbs"></ol></div>' +
		'<div class="jtr-body"><div class="jtr-form"></div><div class="jtr-preview"><div class="jtr-preview__label">תצוגה חיה של החוזה</div><div class="jtr-preview__paper"></div></div></div>' +
		'<div class="jtr-nav"><button type="button" class="jtr-btn jtr-btn--ghost" data-act="back">חזרה</button>' +
		'<button type="button" class="jtr-btn jtr-btn--main" data-act="next">המשך</button></div>' +
		'<button type="button" class="jtr-peek" aria-label="הצגת המסמך">המסמך <span class="jtr-peek__n"></span></button>';
	app.appendChild(shell);
	shell.querySelector('.jtr-preview__paper').appendChild(doc);

	var formBox = shell.querySelector('.jtr-form');
	var crumbs = shell.querySelector('.jtr-crumbs');
	var TOTAL = STEPS.length + 1;

	function renderCrumbs() {
		crumbs.innerHTML = '';
		STEPS.concat([{ title: 'מסמך' }]).forEach(function (s, i) {
			var li = el('li', 'jtr-crumbs__i' + (i === state.step ? ' is-cur' : i < state.step ? ' is-done' : ''), esc(s.title));
			if (i < state.step) { li.onclick = function () { state.step = i; render(); }; }
			crumbs.appendChild(li);
		});
		var pct = Math.round(100 * state.step / (TOTAL - 1));
		shell.querySelector('.jtr-prog__bar').style.width = pct + '%';
		shell.querySelector('.jtr-prog').setAttribute('aria-valuenow', String(pct));
	}

	function fieldRow(f) {
		var row = el('div', 'jtr-field' + (f.size === 'half' ? ' jtr-field--half' : ''));
		if (f.type === 'toggle') {
			row.className = 'jtr-toggle';
			row.innerHTML = '<label class="jtr-toggle__l"><input type="checkbox" ' + (state.v[f.k] ? 'checked' : '') + '><span class="jtr-toggle__pill"></span><span>' + esc(f.label) + '</span></label><div class="jtr-toggle__more"></div>';
			var more = row.querySelector('.jtr-toggle__more');
			function renderMore() {
				more.innerHTML = '';
				if (state.v[f.k]) { (f.more || []).forEach(function (mf) { more.appendChild(fieldRow(mf)); }); }
			}
			row.querySelector('input').onchange = function () { state.v[f.k] = this.checked; if (f.opt) { state.v[f.opt] = this.checked; } save(); renderMore(); renderDoc(); };
			renderMore();
			return row;
		}
		var id = 'jtr-' + f.k;
		row.innerHTML = '<label for="' + id + '">' + esc(f.label) + (f.optional ? ' <em>אופציונלי</em>' : '') + '</label>' +
			'<input id="' + id + '" type="' + (f.type === 'date' ? 'date' : 'text') + '"' +
			(f.inputmode ? ' inputmode="' + f.inputmode + '"' : '') + (f.auto ? ' autocomplete="' + f.auto + '"' : '') +
			' value="' + esc(val(f.k)) + '">' + (f.hint ? '<small>' + esc(f.hint) + '</small>' : '');
		row.querySelector('input').addEventListener('input', function () {
			state.v[f.k] = this.value;
			if (f.k === 'dateFrom' && this.value && !val('dateTo')) {
				var d = new Date(this.value); d.setFullYear(d.getFullYear() + 1); d.setDate(d.getDate() - 1);
				state.v.dateTo = d.toISOString().slice(0, 10);
				var dt = document.getElementById('jtr-dateTo'); if (dt) { dt.value = state.v.dateTo; }
			}
			save(); renderDoc();
		});
		return row;
	}

	function renderEqEditor() {
		var box = el('div', 'jtr-eqed');
		box.innerHTML = '<div class="jtr-field"><label>נספח ציוד: מה נשאר בדירה? (לא חובה)</label></div><div class="jtr-eqed__rows"></div><button type="button" class="jtr-btn jtr-btn--ghost jtr-eqed__add">+ הוספת פריט</button>';
		var rows = box.querySelector('.jtr-eqed__rows');
		function draw() {
			rows.innerHTML = '';
			state.eq.forEach(function (r, i) {
				var line = el('div', 'jtr-eqed__row');
				line.innerHTML = '<input type="text" placeholder="פריט (מקרר, מזגן...)" value="' + esc(r.n) + '"><input type="text" inputmode="numeric" placeholder="כמות" value="' + esc(r.q) + '"><button type="button" aria-label="הסרה">&times;</button>';
				var ins = line.querySelectorAll('input');
				ins[0].oninput = function () { r.n = this.value; save(); renderDoc(); };
				ins[1].oninput = function () { r.q = this.value; save(); renderDoc(); };
				line.querySelector('button').onclick = function () { state.eq.splice(i, 1); save(); draw(); renderDoc(); };
				rows.appendChild(line);
			});
		}
		box.querySelector('.jtr-eqed__add').onclick = function () { state.eq.push({ n: '', q: '1' }); save(); draw(); };
		draw();
		return box;
	}

	function missingCount() {
		var n = 0;
		doc.querySelectorAll('.jtr-f').forEach(function (s) {
			if (!s.classList.contains('jtr-f--set') && !s.classList.contains('jtr-f--manual') && s.offsetParent !== null) { n++; }
		});
		return n;
	}

	function renderReview() {
		formBox.innerHTML = '';
		var head = el('div', 'jtr-review-head');
		var miss = missingCount();
		head.innerHTML = '<h3>החוזה מוכן</h3><p>' + (miss ? 'נשארו <strong>' + miss + '</strong> שדות ריקים - אפשר ללחוץ עליהם במסמך ולהשלים ישירות, או לחזור לשלבים.' : 'כל השדות מולאו. עברו על המסמך ואז הדפיסו או הורידו.') + '</p>';
		formBox.appendChild(head);

		var acts = el('div', 'jtr-acts');
		acts.innerHTML =
			'<button type="button" class="jtr-btn jtr-btn--main" data-a="print">הדפסה / PDF</button>' +
			'<button type="button" class="jtr-btn" data-a="word">הורדה ל-Word</button>' +
			'<button type="button" class="jtr-btn" data-a="copy">העתקת הטקסט</button>' +
			'<a class="jtr-btn jtr-btn--wa" target="_blank" rel="noopener nofollow" data-a="wa">בדיקת עורך דין בוואטסאפ</a>' +
			'<a class="jtr-btn jtr-btn--ghost" href="' + esc(CFG.sched) + '">קביעת פגישה עם עורך דין</a>';
		formBox.appendChild(acts);

		if (CFG.monetize) {
			var pm = el('div', 'jtr-premium');
			pm.innerHTML = '<div class="jtr-premium__t">שירותים בתשלום</div>' +
				'<button type="button" class="jtr-btn" data-premium="review-sla">בדיקת עו"ד תוך 24 שעות</button>' +
				'<button type="button" class="jtr-btn" data-premium="esign">חתימה דיגיטלית</button>' +
				'<button type="button" class="jtr-btn" data-premium="clause">ניסוח סעיף מותאם</button>';
			formBox.appendChild(pm);
		}

		doc.querySelectorAll('.jtr-f:not(.jtr-f--set)').forEach(function (s) {
			s.setAttribute('contenteditable', 'true');
			s.addEventListener('input', function () { s.classList.add('jtr-f--manual'); });
		});

		acts.addEventListener('click', function (ev) {
			var a = ev.target.getAttribute && ev.target.getAttribute('data-a');
			if (!a) { return; }
			if (a === 'print') { printDoc(); }
			if (a === 'copy') { copyDoc(ev.target); }
			if (a === 'word') { wordDoc(); }
		});
		var wa = acts.querySelector('[data-a="wa"]');
		wa.href = CFG.wa + '?text=' + encodeURIComponent('שלום, בניתי חוזה שכירות במחולל של Jus-Tice ואשמח שעורך דין יעבור עליו לפני חתימה. הנכס: ' + val('street') + ' ' + val('houseNum') + ', ' + val('city') + '. שכ"ד: ' + val('rent') + ' ש"ח.');
	}

	function docHTML() {
		return '<html dir="rtl" lang="he"><head><meta charset="utf-8"><title>הסכם שכירות</title><style>body{font-family:"David","Times New Roman",serif;line-height:1.65;color:#111;max-width:19cm;margin:0 auto;padding:1cm}h1,h2{text-align:center}h2{font-size:16px;margin:18px 0 8px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #999;padding:6px}@page{size:A4;margin:2cm}</style></head><body>' + doc.innerHTML + '</body></html>';
	}
	function printDoc() {
		var w = window.open('', '_blank');
		w.document.write(docHTML()); w.document.close();
		setTimeout(function () { w.focus(); w.print(); }, 350);
	}
	function copyDoc(btn) {
		var t = doc.innerText;
		(navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { btn.textContent = 'הועתק ✓'; })
			.catch(function () { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); btn.textContent = 'הועתק ✓'; });
	}
	function wordDoc() {
		var blob = new Blob(['﻿' + docHTML()], { type: 'application/msword' });
		var a = document.createElement('a');
		a.href = URL.createObjectURL(blob); a.download = 'rent-agreement-jus-tice.doc';
		document.body.appendChild(a); a.click(); a.remove();
	}

	function render() {
		renderCrumbs(); renderDoc(); save();
		shell.classList.toggle('is-review', state.step === STEPS.length);
		if (state.step === STEPS.length) { renderReview(); }
		else {
			var st = STEPS[state.step];
			formBox.innerHTML = '<h3 class="jtr-step-title">' + esc(st.title) + '</h3>';
			st.fields.forEach(function (f) {
				if (f.showIf && !state.v[f.showIf]) { return; }
				formBox.appendChild(fieldRow(f));
			});
			if (st.id === 'guarantee') { formBox.appendChild(renderEqEditor()); }
		}
		shell.querySelector('[data-act="back"]').style.visibility = state.step ? 'visible' : 'hidden';
		shell.querySelector('[data-act="next"]').textContent = state.step >= STEPS.length - 1 ? (state.step === STEPS.length ? 'חזרה לעריכה' : 'לסיום ולמסמך') : 'המשך';
		window.scrollTo({ top: app.getBoundingClientRect().top + window.pageYOffset - 80, behavior: 'smooth' });
	}

	shell.querySelector('.jtr-nav').addEventListener('click', function (ev) {
		var act = ev.target.getAttribute && ev.target.getAttribute('data-act');
		if (act === 'next') { state.step = state.step === STEPS.length ? STEPS.length - 1 : Math.min(state.step + 1, STEPS.length); render(); }
		if (act === 'back') { state.step = Math.max(0, state.step - 1); render(); }
	});
	shell.querySelector('.jtr-peek').onclick = function () { shell.classList.toggle('is-peek'); };
	setInterval(function () { var n = missingCount(); shell.querySelector('.jtr-peek__n').textContent = n ? '(' + n + ' חסרים)' : '✓'; }, 800);

	if (state.v && Object.keys(state.v).length && state.step > 0) {
		var bar = el('div', 'jtr-resume', 'נמצאה טיוטה שמורה מהביקור הקודם. <button type="button">להמשיך ממנה</button> <button type="button" data-r="reset">להתחיל מחדש</button>');
		bar.addEventListener('click', function (ev) {
			if (ev.target.tagName !== 'BUTTON') { return; }
			if (ev.target.getAttribute('data-r') === 'reset') { state = { step: 0, v: {}, eq: [] }; save(); }
			bar.remove(); render();
		});
		app.insertBefore(bar, shell);
	}

	render();
})();
