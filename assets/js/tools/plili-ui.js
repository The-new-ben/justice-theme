/**
 * Choosing a criminal defence lawyer (HAD-651, the criminal hub plan's tool ג1): "בחירת עורך דין פלילי"
 * (bchirat-orech-din-plili, prefix jt76) on /criminal-defense-attorney/. Five answers become the guide of the criminal
 * pyramid for that stage and offence, the profile of the lawyer the reader needs, the urgent step first under arrest, the
 * questions for the first meeting, the warning signs, the fee range of the stage from the fee table beside it
 * (reg.fl_plili_sachar) and the criminal lawyers of the site's directory. Every text is in reg.fl_plili
 * (tools/justice_tools_fl_plili.py); it ranks no one.
 */
import { esc, ils, isoToHe, encodeState, decodeState, track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar } from './instrument.js';

export const TOOL_ID = 'bchirat-orech-din-plili';
export const PAGE = '/criminal-defense-attorney/';
const P = 'jt76';

const nis = (n) => `${Math.round(n).toLocaleString('en-US')} ₪`;

/** The answers of the example the server prints: the defaults of reg.fl_plili.questions. */
export function plDefaults(reg) {
	const out = { district: '' };
	for (const q of reg.fl_plili.questions) { out[q.id] = q.default; }
	return out;
}

/** The fee rows of a stage, as the fee table holds them (empty when the table is not in the registry). */
export function stageFees(reg, stage) {
	const rows = ((reg.fl_plili_sachar || {}).rows) || [];
	return (reg.fl_plili.fee_rows[stage] || []).map((id) => rows.find((r) => r.id === id)).filter(Boolean);
}

/** The engine: the answers in, the guides, the profile, the questions, the warnings, the fees and the links out. */
export function plCompute(reg, input) {
	const b = reg.fl_plili;
	const i = Object.assign(plDefaults(reg), input || {});
	const errors = [];
	for (const q of b.questions) {
		if (!q.options.some((o) => o.v === i[q.id])) { errors.push({ field: q.id, he: 'בחרו תשובה' }); }
	}
	const district = b.districts.find((d) => d.v === i.district) || b.districts[0];
	i.district = district.v;
	if (errors.length) { return { ok: false, errors, input: i }; }
	const parts = [b.profile.stage[i.stage], b.profile.offence[i.offence]].filter(Boolean);
	const profile = `${parts.join(', ')}.`;
	const has = (when) => {
		if (when === 'all') { return true; }
		const [k, v] = when.split(':');
		return i[k] === v;
	};
	const ask = b.ask.filter((a) => has(a.when)).slice(0, 7).map((a) => a.he);
	const fees = stageFees(reg, i.stage);
	const cap = b.budget_cap[i.budget];
	const lows = fees.map((f) => f.low).filter((n) => typeof n === 'number');
	const minLow = lows.length ? Math.min(...lows) : null;
	let budgetNote = '';
	if (i.budget === 'pd') {
		budgetNote = 'pd';
	} else if (cap !== null && minLow !== null && cap < minLow) {
		budgetNote = 'below';
	}
	const dir = `${b.directory.path}?area=${b.directory.area}${district.city ? `&city=${district.city}` : ''}`;
	return {
		ok: true,
		input: i,
		profile,
		urgency: b.profile.urgency[i.urgency],
		urgent: i.stage === 'arrest' ? b.urgent : null,
		guide: b.guide[i.stage],
		offenceGuide: b.offence_guide[i.offence],
		ask,
		flags: b.red_flags.slice(),
		fees,
		budgetNote,
		district,
		dir,
	};
}

const chip = (name, value, label, checked) => `<label class="jtool-chip"><input type="radio" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;

export function renderForm(reg, input) {
	const b = reg.fl_plili;
	const i = Object.assign(plDefaults(reg), input || {});
	// The design board (HAD-651): the stage as chips, the most telling answer; the other four as menus, so the tool
	// stays short on a phone.
	const select = (id, n, label, options, value, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${n}. ${esc(label)}</label><select id="${P}-${id}" class="jtool-select">${options.map((o) => `<option value="${esc(o.v)}"${o.v === value ? ' selected' : ''}>${esc(o.he)}</option>`).join('')}</select>${hint ? `<p class="jtool-hint">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const q = (id) => b.questions.find((x) => x.id === id);
	const stage = q('stage');
	return `<fieldset class="jtool-field"><legend>1. ${esc(stage.he)}</legend><div class="jtool-chips">${stage.options.map((o) => chip('stage', o.v, o.he, i.stage === o.v)).join('')}</div><p class="jtool-error" id="${P}-stage-e" role="alert"></p></fieldset>`
		+ `<div class="${P}-menus">`
		+ select('offence', 2, q('offence').he, q('offence').options, i.offence)
		+ select('district', 3, 'מחוז בית המשפט', b.districts, i.district, 'לפי מקום האירוע או התחנה שבה נפתח התיק.')
		+ select('urgency', 4, q('urgency').he, q('urgency').options, i.urgency)
		+ select('budget', 5, q('budget').he, q('budget').options, i.budget)
		+ '</div>';
}

export function verdictSentence(reg, r) {
	return r.ok ? `מה אתם צריכים: ${r.profile}` : '';
}

/** The fee lines of the stage: the market range and the Bar's minimum, each as the fee table holds it. */
export function feeLines(reg, r) {
	const t = reg.fl_plili_sachar;
	if (!t || !r.fees.length) { return ''; }
	// Each amount is its own isolated run (ils), so "2,000 ₪ עד 8,000 ₪" keeps its order in a right-to-left line.
	const rows = r.fees.map((f) => {
		const range = typeof f.low === 'number' && typeof f.high === 'number' ? `${ils(f.low, 0)} עד ${ils(f.high, 0)}${f.high_open ? ` ${esc(t.open_he)}` : ''}` : 'אין טווח מפורסם';
		const floor = f.floor ? ` · מינימום לפי תעריף הלשכה: ${ils(f.floor.amount, 0)}${f.floor.vat_included ? '' : ' לפני מע"מ'}` : '';
		return `<li><strong>${esc(f.he)}:</strong> ${range}${floor}</li>`;
	}).join('');
	return `<ul class="${P}-fees">${rows}</ul><p class="jtool-hint">${esc(t.vat_he)} <a href="#jtool-sachar-orech-din-plili">לטבלת שכר הטרחה המלאה</a></p>`;
}

export function renderResult(reg, r, opts = {}) {
	const b = reg.fl_plili;
	if (!r.ok) { return '<p class="jtool-hint">בחרו תשובה בכל שאלה, והפרופיל יופיע כאן.</p>'; }
	const urgent = r.urgent ? `<div class="${P}-urgent" role="note"><strong>קודם כול:</strong> ${esc(r.urgent.he)} <span class="${P}-law">(${esc(r.urgent.law_he)})</span> <a href="${esc(r.urgent.anchor)}">${esc(b.guide.arrest.he)}</a></div>` : '';
	const pd = r.budgetNote === 'pd'
		? `<p class="${P}-budget"><strong>סנגוריה ציבורית:</strong> מי שאין לו אפשרות לשלם, ובמצבים שהחוק קובע גם בלי קשר להכנסה, זכאי לייצוג מהסנגוריה הציבורית. <a href="${esc(b.public_defender.path)}">${esc(b.public_defender.he)}</a></p>`
		: (r.budgetNote === 'below' ? `<p class="${P}-budget">התקציב שבחרתם נמוך מהטווח הנפוץ לשלב הזה. שאלו על תשלום לפי שלבים, ובדקו <a href="${esc(b.public_defender.path)}">${esc(b.public_defender.he)}</a>.</p>` : '');
	return `<div class="jtool-verdict ${P}-verdict" aria-live="polite">${opts.example ? '<p class="jtool-example">דוגמה: זימון לחקירה בחשד לאלימות. שנו את התשובות והפרופיל יתעדכן.</p>' : ''}`
		+ urgent
		+ `<div class="${P}-need"><span class="${P}-kicker">מה אתם צריכים</span><p class="${P}-profile">${esc(r.profile)}</p><p class="${P}-focus">${esc(r.urgency)}.</p></div>`
		+ `<p class="${P}-guides">להמשך: <a href="${esc(r.guide.path)}" data-act="guide">${esc(r.guide.he)}</a> · <a href="${esc(r.offenceGuide.path)}" data-act="guide">${esc(r.offenceGuide.he)}</a></p>`
		+ `<div class="${P}-feebox"><h4>כמה זה עולה בשלב הזה</h4>${feeLines(reg, r) || `<p><a href="#jtool-sachar-orech-din-plili">לטבלת שכר הטרחה</a></p>`}${pd}</div>`
		+ `<div class="${P}-ask"><h4>שאלות לפגישה הראשונה</h4><ol>${r.ask.map((a) => `<li>${esc(a)}</li>`).join('')}</ol></div>`
		+ `<p class="${P}-reviewed">${esc(b.reviewed_he)} · עודכן ${isoToHe(b.checked_on)}</p></div>`;
}

export function renderDetails(reg, r, opts = {}) {
	const b = reg.fl_plili;
	if (!r.ok) { return ''; }
	const court = r.district.court_he ? `<p class="${P}-court">התיק שלכם יתנהל כנראה ב${esc(r.district.court_he)}.</p>` : '';
	return `<div class="${P}-screen"><div class="${P}-grid">`
		+ `<div class="${P}-flags"><h4>דגלים אדומים בפגישה</h4><ul>${r.flags.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`
		+ `<div class="${P}-lawyers"><h4>עורכי דין פליליים במדריך</h4>${court}`
		+ `<a class="${P}-dir" href="${esc(r.dir)}" data-act="lawyer">עורכי הדין למשפט פלילי${r.district.city ? ` ב${esc(r.district.he)}` : ' בכל הארץ'}</a>`
		+ `<p class="${P}-more"><a href="${esc(b.choose.path)}">${esc(b.choose.he)}</a> · <a href="${esc(b.rating.path)}">${esc(b.rating.he)}</a></p></div></div>`
		+ `<div class="jtool-tablewrap ${P}-method"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך הכלי בוחר</h3></div>${methodList(reg)}</div></div>`
		+ `<div class="${P}-print">${esc(printSummary(reg, r, opts.printedOn || b.checked_on))}</div>`;
}

export function methodList(reg) {
	return `<ol class="jtool-method-list">${reg.fl_plili.method_he.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`;
}

export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	return `בחירת עורך דין פלילי (jus-tice.co.il, ${isoToHe(printedOn)}). מה אתם צריכים: ${r.profile} ${r.urgency}. שאלות לפגישה: ${r.ask.join(' ')}`;
}

// The share link: one digit per answer, the district by its code.
const ONE = { stage: 's', offence: 'o', urgency: 'u', budget: 'b' };
export const KEYS = ['s', 'o', 'u', 'b', 'd'];
export function stateOf(reg, input) {
	const b = reg.fl_plili;
	const st = {};
	for (const [id, k] of Object.entries(ONE)) {
		const q = b.questions.find((x) => x.id === id);
		st[k] = String(Math.max(0, q.options.findIndex((o) => o.v === input[id])));
	}
	st.d = input.district || '';
	return encodeState(st);
}
export function inputOf(reg, s) {
	const b = reg.fl_plili;
	if (!s || s.s === undefined) { return null; }
	const out = plDefaults(reg);
	for (const [id, k] of Object.entries(ONE)) {
		const q = b.questions.find((x) => x.id === id);
		const o = q.options[Number(s[k])];
		if (o) { out[id] = o.v; }
	}
	out.district = b.districts.some((d) => d.v === s.d) ? s.d : '';
	return out;
}

export function snapshot(reg) {
	const input = plDefaults(reg);
	const r = plCompute(reg, input);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input,
		total: 0,
		sticky: `<bdi>${esc(reg.fl_plili.questions[0].options.find((o) => o.v === input.stage).he)}</bdi>`,
		form: renderForm(reg, input),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: reg.fl_plili.checked_on }),
		method: methodList(reg),
		sentence: verdictSentence(reg, r),
		answer: { profile: r.profile, ask_n: r.ask.length, flags_n: r.flags.length, fees: r.fees.map((f) => ({ he: f.he, low: f.low, high: f.high })) },
	};
}

function readForm(root, reg) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const stage = root.querySelector(`input[name="${P}-stage"]:checked`);
	return { stage: stage ? stage.value : '', offence: val('offence'), district: val('district'), urgency: val('urgency'), budget: val('budget') };
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const b = reg.fl_plili;
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	track('tool_view', { tool_id: TOOL_ID });
	const run = (input, opts = {}) => {
		const r = plCompute(reg, input);
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		if (!r.ok) { for (const e of r.errors) { const el = root.querySelector(`#${P}-${e.field}-e`); if (el) { el.textContent = e.he; } } }
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky && r.ok) { sticky.innerHTML = `<bdi>${esc(b.questions[0].options.find((o) => o.v === r.input.stage).he)}</bdi>`; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: `${r.input.stage}-${r.input.offence}` }); }
		return r;
	};
	const current = () => (own ? readForm(root, reg) : plDefaults(reg));
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
		if (act === 'guide' || act === 'lawyer') {
			track('tool_next', { tool_id: TOOL_ID, band: act });
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
			window.open(whatsappUrl(`בחירת עורך דין פלילי: ${r.profile} · jus-tice.co.il ${link}`), '_blank', 'noopener');
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
