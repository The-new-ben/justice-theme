/**
 * Choosing a divorce lawyer (HAD-616, Ben 31.10.2026: "a tool that, as it were, searches a divorce lawyer for you"):
 * "בחירת עורך דין גירושין" (bchirat-orech-din, prefix jt74) on /divorce-lawyer/, in the chapter "איך בוחרים עורך דין
 * גירושין". Six answers become the profile of the lawyer the reader needs, the urgent step first when there is one, the
 * questions for the first meeting, the warning signs, the route to price in the divorce calculator, and the family-law
 * lawyers of the site's directory in the reader's city, the site's own family lawyer first. It holds no number: every text is in reg.fl_bchira (tools/justice_tools_fl_bchira.py).
 */
import { esc, isoToHe, encodeState, decodeState, track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar } from './instrument.js';

export const TOOL_ID = 'bchirat-orech-din';
export const PAGE = '/divorce-lawyer/';
const P = 'jt74';

/** The answers of the example the server prints: the defaults of reg.fl_bchira.questions. */
export function bcDefaults(reg) {
	const out = { city: '' };
	for (const q of reg.fl_bchira.questions) { out[q.id] = Array.isArray(q.default) ? q.default.slice() : q.default; }
	return out;
}

const listHe = (items) => (items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')}, וגם ${items[items.length - 1]}`);

/** The engine: the answers in, the profile, the questions, the warnings and the links out. */
export function bcCompute(reg, input) {
	const b = reg.fl_bchira;
	const i = Object.assign(bcDefaults(reg), input || {});
	const errors = [];
	for (const q of b.questions) {
		const allowed = q.options.map((o) => o.v);
		if (q.type === 'many') {
			i[q.id] = (Array.isArray(i[q.id]) ? i[q.id] : []).filter((v) => allowed.includes(v));
		} else if (!allowed.includes(i[q.id])) {
			errors.push({ field: q.id, he: 'בחרו תשובה' });
		}
	}
	if (errors.length) { return { ok: false, errors, input: i }; }
	const head = [b.profile.stage[i.stage]];
	if (b.profile.forum[i.forum]) { head.push(b.profile.forum[i.forum]); }
	const subjects = i.open.map((v) => b.profile.open[v]).filter(Boolean);
	const profile = `${head.join(', ')}${subjects.length ? `, ${listHe(subjects)}` : ''}.`;
	const has = (when) => {
		if (when === 'all') { return true; }
		const [k, v] = when.split(':');
		return Array.isArray(i[k]) ? i[k].includes(v) : i[k] === v;
	};
	const ask = b.ask.filter((a) => has(a.when)).slice(0, 7).map((a) => a.he);
	const homeOrKids = i.open.includes('kids') || i.open.includes('home');
	let preset = b.calc_preset[i.stage];
	if (i.stage === 'agree' && !homeOrKids) { preset = 'plain'; }
	if (i.stage === 'think' && homeOrKids) { preset = 'mediate'; }
	const city = b.cities.find((c) => c.slug === i.city) || b.cities[0];
	const dir = `${b.directory.path}?area=${b.directory.area}${city.slug ? `&city=${city.slug}` : ''}`;
	return {
		ok: true,
		input: i,
		profile,
		focus: b.profile.focus[i.focus],
		urgent: i.urgent !== 'none' ? b.urgent[i.urgent] : null,
		ask,
		flags: b.red_flags.slice(),
		preset,
		city,
		dir,
		featured: b.featured,
	};
}

const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;

export function renderForm(reg, input) {
	const b = reg.fl_bchira;
	const i = Object.assign(bcDefaults(reg), input || {});
	return b.questions.map((q, n) => {
		const opts = q.options.map((o) => (q.type === 'many'
			? chip(q.id, o.v, o.he, (i[q.id] || []).includes(o.v), 'checkbox')
			: chip(q.id, o.v, o.he, i[q.id] === o.v))).join('');
		return `<fieldset class="jtool-field"><legend>${n + 1}. ${esc(q.he)}</legend><div class="jtool-chips">${opts}</div><p class="jtool-error" id="${P}-${q.id}-e" role="alert"></p></fieldset>`;
	}).join('')
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-city">${b.questions.length + 1}. עיר</label><select id="${P}-city" class="jtool-select">${b.cities.map((c) => `<option value="${esc(c.slug)}"${c.slug === i.city ? ' selected' : ''}>${esc(c.he)}</option>`).join('')}</select><p class="jtool-hint">רק כדי להציג את עורכי הדין במדריך באזור שלכם.</p></div>`;
}

export function verdictSentence(reg, r) {
	return r.ok ? `מה אתם צריכים: ${r.profile}` : '';
}

export function renderResult(reg, r, opts = {}) {
	const b = reg.fl_bchira;
	if (!r.ok) { return '<p class="jtool-hint">בחרו תשובה בכל שאלה, והפרופיל יופיע כאן.</p>'; }
	const urgent = r.urgent ? `<div class="${P}-urgent" role="note"><strong>קודם כול:</strong> ${esc(r.urgent.he)} <a href="${esc(r.urgent.anchor)}">מה עושים במצב דחוף</a></div>` : '';
	return `<div class="jtool-verdict ${P}-verdict" aria-live="polite">${opts.example ? '<p class="jtool-example">דוגמה: מסכימים על רוב הדברים, עם ילדים ודירה. שנו את התשובות והפרופיל יתעדכן.</p>' : ''}`
		+ urgent
		+ `<div class="${P}-need"><span class="${P}-kicker">מה אתם צריכים</span><p class="${P}-profile">${esc(r.profile)}</p><p class="${P}-focus">${esc(r.focus)}.</p></div>`
		+ `<div class="${P}-ask"><h4>שאלות לפגישה הראשונה</h4><ol>${r.ask.map((a) => `<li>${esc(a)}</li>`).join('')}</ol></div>`
		+ `<p class="${P}-reviewed">${esc(b.reviewed_he)} · עודכן ${isoToHe(b.checked_on)}</p></div>`;
}

export function renderDetails(reg, r, opts = {}) {
	const b = reg.fl_bchira;
	if (!r.ok) { return ''; }
	const f = r.featured;
	return `<div class="${P}-screen"><div class="${P}-grid">`
		+ `<div class="${P}-flags"><h4>דגלים אדומים בפגישה</h4><ul>${r.flags.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`
		+ `<div class="${P}-calc"><h4>כמה זה יעלה</h4><p>מחשבון הגירושין שבעמוד מחשב את המסלול הזה: אגרות, שכר טרחה ומומחים, לכל צד.</p><a class="jtool-btn" href="#jtool-machshevon-gerushin" data-act="calc" data-preset="${esc(r.preset)}">למחשבון הגירושין, עם המצב שלכם</a></div></div>`
		+ `<div class="${P}-lawyers"><h4>עורכי דין לדיני משפחה במדריך</h4>`
		+ `<a class="${P}-featured" href="${esc(f.path)}" data-act="featured"><span class="${P}-featured__name">${esc(f.name_he)} · ${esc(f.city_he)}</span><span class="${P}-featured__label">${esc(f.label_he)}</span></a>`
		+ `<a class="${P}-dir" href="${esc(r.dir)}" data-act="lawyer">כל עורכי הדין לדיני משפחה${r.city.slug ? ` ב${esc(r.city.he)}` : ''}</a></div>`
		+ `<div class="jtool-tablewrap ${P}-method"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך הכלי בוחר</h3></div>${methodList(reg)}</div></div>`
		+ `<div class="${P}-print">${esc(printSummary(reg, r, opts.printedOn || b.checked_on))}</div>`;
}

export function methodList(reg) {
	return `<ol class="jtool-method-list">${reg.fl_bchira.method_he.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`;
}

export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	return `בחירת עורך דין גירושין (jus-tice.co.il, ${isoToHe(printedOn)}). מה אתם צריכים: ${r.profile} ${r.focus}. שאלות לפגישה: ${r.ask.join(' ')}`;
}

// The share link: one letter per answer, the subjects as a bitmask.
const ONE = { stage: 's', urgent: 'u', forum: 'f', focus: 'c' };
export const KEYS = ['s', 'o', 'u', 'f', 'c', 't'];
export function stateOf(reg, input) {
	const b = reg.fl_bchira;
	const openQ = b.questions.find((q) => q.id === 'open');
	const st = {};
	for (const [id, k] of Object.entries(ONE)) {
		const q = b.questions.find((x) => x.id === id);
		st[k] = String(Math.max(0, q.options.findIndex((o) => o.v === input[id])));
	}
	st.o = String(openQ.options.reduce((m, o, n) => ((input.open || []).includes(o.v) ? m | (1 << n) : m), 0));
	st.t = input.city || '';
	return encodeState(st);
}
export function inputOf(reg, s) {
	const b = reg.fl_bchira;
	if (!s || s.s === undefined) { return null; }
	const out = bcDefaults(reg);
	for (const [id, k] of Object.entries(ONE)) {
		const q = b.questions.find((x) => x.id === id);
		const o = q.options[Number(s[k])];
		if (o) { out[id] = o.v; }
	}
	const mask = Number(s.o || 0);
	out.open = b.questions.find((q) => q.id === 'open').options.filter((o, n) => mask & (1 << n)).map((o) => o.v);
	out.city = b.cities.some((c) => c.slug === s.t) ? s.t : '';
	return out;
}

export function snapshot(reg) {
	const input = bcDefaults(reg);
	const r = bcCompute(reg, input);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input,
		total: 0,
		sticky: `<bdi>${esc(reg.fl_bchira.questions[0].options.find((o) => o.v === input.stage).he)}</bdi>`,
		form: renderForm(reg, input),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: reg.fl_bchira.checked_on }),
		method: methodList(reg),
		sentence: verdictSentence(reg, r),
		answer: { profile: r.profile, ask_n: r.ask.length, flags_n: r.flags.length },
	};
}

function readForm(root, reg) {
	const b = reg.fl_bchira;
	const out = { city: (root.querySelector(`#${P}-city`) || {}).value || '' };
	for (const q of b.questions) {
		const checked = [...root.querySelectorAll(`input[name="${P}-${q.id}"]:checked`)].map((x) => x.value);
		out[q.id] = q.type === 'many' ? checked : (checked[0] || '');
	}
	return out;
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const b = reg.fl_bchira;
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	track('tool_view', { tool_id: TOOL_ID });
	const run = (input, opts = {}) => {
		const r = bcCompute(reg, input);
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		if (!r.ok) { for (const e of r.errors) { const el = root.querySelector(`#${P}-${e.field}-e`); if (el) { el.textContent = e.he; } } }
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky && r.ok) { sticky.innerHTML = `<bdi>${esc(b.questions[0].options.find((o) => o.v === r.input.stage).he)}</bdi>`; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: `${r.input.stage}-${r.input.forum}` }); }
		return r;
	};
	const current = () => (own ? readForm(root, reg) : bcDefaults(reg));
	const apply = (input) => { own = true; form.innerHTML = renderForm(reg, input); return run(input); };
	const changed = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		run(readForm(root, reg));
	};
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = shareOwner === TOOL_ID ? inputOf(reg, decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (parsed) {
		apply(parsed);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
	}
	if (store.get(saveKey) && !parsed) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('change', changed);
	root.addEventListener('click', async (ev) => {
		const el = ev.target.closest('[data-act]');
		if (!el) { return; }
		const act = el.getAttribute('data-act');
		const input = current();
		if (act === 'calc') {
			// The calculator is on the same page: open it on the route this situation means, then let the anchor scroll.
			const btn = document.querySelector(`#jtool-machshevon-gerushin [data-act="preset"][data-preset="${el.getAttribute('data-preset')}"]`);
			if (btn) { btn.click(); }
			track('tool_next', { tool_id: TOOL_ID, band: el.getAttribute('data-preset') });
			return;
		}
		if (act === 'featured' || act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID, band: act });
			return;
		}
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(reg, input))}/@${TOOL_ID}`;
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק הבחירות שלכם, בלי שמות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`בחירת עורך דין גירושין: ${r.profile} · jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(printSummary(reg, r, b.checked_on));
			toast(root, ok ? 'הפרופיל והשאלות הועתקו.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(reg, input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(reg, decodeState(store.get(saveKey) || '', KEYS));
			if (s) { apply(s); }
		} else if (act === 'clear') {
			store.clear(saveKey);
			toast(root, 'נמחק מהמכשיר.');
		}
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
