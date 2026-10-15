/**
 * Divorce-world UI: the custody calendar builder (HAD-539).
 * One picture from the subject: the two weeks night by night (every night a button in "custom"), and the whole year
 * as a calendar of 365 nights, month under month, in the two inks of the family wave: navy = parent A, teal = parent
 * B; a holiday night carries a dot. Nothing warm, nothing decorative.
 */
import { LU_PATTERNS, LU_DAYS, luPlan, luCompare } from './luach-engine.js';
import {
	esc, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, ilToday,
} from './instrument.js';

export const TOOL_ID = 'luach-shahut';
const P = 'jt20';
export const EXAMPLE = { pattern: 'two_two_three', custom: [], start: '2026-11-01', holidays: 'split', firstA: true, parentA: 'אבא' };
const RULE_HE = { alternate: 'חג לכל הורה לסירוגין, והתור מתהפך כל שנה', split: 'חגים ארוכים חצי-חצי, הקצרים לסירוגין', none: 'בלי חגים: הלוח הקבוע בלבד' };
const HE_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const who = (x, parentA) => (x === 'A' ? (parentA === 'אמא' ? 'האם' : 'האב') : (parentA === 'אמא' ? 'האב' : 'האם'));
const short = (x, parentA) => (who(x, parentA) === 'האב' ? 'אב' : 'אם');

function luToIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, m) {
	const da = reg.divorce_agreement;
	return `<fieldset class="jtool-field"><legend>הורה א' הוא</legend><div class="jtool-chips">${chip('pa', 'אבא', 'אבא', m.parentA !== 'אמא')}${chip('pa', 'אמא', 'אמא', m.parentA === 'אמא')}</div></fieldset>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-pat">הסדר הלינות בשבועיים</label><select id="${P}-pat">${Object.entries(LU_PATTERNS).map(([k, v]) => `<option value="${k}"${m.pattern === k ? ' selected' : ''}>${esc(v.he)}</option>`).join('')}<option value="custom"${m.pattern === 'custom' ? ' selected' : ''}>אחר: לוחצים על הלילות בלוח</option></select><p class="jtool-hint">${esc(da.schedule_he)}.</p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-start">השבוע הראשון מתחיל ביום ראשון</label><input id="${P}-start" type="text" inputmode="numeric" autocomplete="off" value="${esc(m.start ? isoToHe(m.start) : '')}" placeholder="לדוגמה: 1.11.2026" aria-describedby="${P}-start-e"><p class="jtool-error" id="${P}-start-e" role="alert"></p></div>`
		+ `<fieldset class="jtool-field"><legend>חגים וחופש גדול</legend><div class="jtool-chips">${chip('ho', 'split', 'חגים ארוכים חצי-חצי, הקצרים לסירוגין', m.holidays !== 'alternate' && m.holidays !== 'none')}${chip('ho', 'alternate', 'חג שלם לכל הורה לסירוגין, גם החופש הגדול', m.holidays === 'alternate')}${chip('ho', 'none', 'בלי חגים, רק הלוח', m.holidays === 'none')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('fa', '1', "בשנה זוגית מתחילים אצל הורה א'", m.firstA !== false, 'checkbox')}</div><p class="jtool-hint">${esc(da.holidays_he)}.</p></fieldset>`;
}

/** The two weeks, night by night; in "custom" every night is a button that switches the parent. */
export function calendar(m, nights) {
	const custom = m.pattern === 'custom';
	const cell = (x, i) => {
		const label = `${LU_DAYS[i % 7]}, שבוע ${i < 7 ? 1 : 2}: ${who(x, m.parentA)}`;
		return custom
			? `<button type="button" class="jt19-night jt19-night--${x.toLowerCase()}" data-night="${i}" aria-pressed="${x === 'A'}" aria-label="${esc(label)}">${esc(short(x, m.parentA))}</button>`
			: `<span class="jt19-night jt19-night--${x.toLowerCase()}" role="img" aria-label="${esc(label)}">${esc(short(x, m.parentA))}</span>`;
	};
	return `<div class="jt19-cal" role="group" aria-label="לוח שבועיים: איפה הילדים לנים">`
		+ `<div class="jt19-cal__days" aria-hidden="true"><span></span>${LU_DAYS.map((d) => `<span>${esc(d)}</span>`).join('')}</div>`
		+ [0, 1].map((w) => `<div class="jt19-cal__week"><span class="jt19-cal__w">שבוע ${w + 1}</span>${nights.slice(w * 7, w * 7 + 7).map((x, i) => cell(x, w * 7 + i)).join('')}</div>`).join('')
		+ `<p class="jt19-cal__legend"><span><i class="jt19-k jt19-k--a"></i>${esc(who('A', m.parentA))}: ${nights.filter((x) => x === 'A').length} לילות</span><span><i class="jt19-k jt19-k--b"></i>${esc(who('B', m.parentA))}: ${nights.filter((x) => x === 'B').length} לילות</span></p></div>`;
}

/** The year: twelve rows of nights, a holiday night with a dot. */
export function yearGrid(r) {
	const rows = r.months.map((mo) => {
		const [y, mm] = mo.key.split('-').map(Number);
		const pad = Array.from({ length: mo.first - 1 }, () => '<i class="jt20-d jt20-d--pad" aria-hidden="true"></i>').join('');
		const cells = mo.days.map((d) => `<i class="jt20-d jt20-d--${d.who.toLowerCase()}${d.holiday ? ' jt20-d--h' : ''}" title="${esc(isoToHe(d.iso))}: ${esc(who(d.who, r.parentA))}${d.holiday ? ' (חג או חופשה)' : ''}"></i>`).join('');
		return `<div class="jt20-row"><span class="jt20-row__m">${esc(HE_MONTHS[mm - 1])} ${y}</span><span class="jt20-row__d">${pad}${cells}</span></div>`;
	}).join('');
	return `<figure class="jt20-year" role="img" aria-label="השנה בלילות: ${r.year.a} לילות אצל ${esc(who('A', r.parentA))}, ${r.year.b} אצל ${esc(who('B', r.parentA))}"><p class="jt20-year__h">השנה בלילות, מ-${esc(isoToHe(r.year.from))} עד ${esc(isoToHe(r.year.to))}</p>${rows}`
		+ `<figcaption><span><i class="jt19-k jt19-k--a"></i>${esc(who('A', r.parentA))}: <bdi>${r.year.a}</bdi> לילות (<bdi>${r.year.aPct}%</bdi>)</span> <span><i class="jt19-k jt19-k--b"></i>${esc(who('B', r.parentA))}: <bdi>${r.year.b}</bdi> לילות</span>${r.rule !== 'none' ? ` <span><i class="jt19-k jt20-k--h"></i>לילה של חג או חופשה: <bdi>${r.year.holidayNights}</bdi></span>` : ''}</figcaption></figure>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const pa = who('A', r.parentA);
	const pb = who('B', r.parentA);
	return `${r.nightsA} לילות מתוך 14 אצל ${pa} ו-${14 - r.nightsA} אצל ${pb}, ${r.handovers} מעברים בין הבתים בשבועיים. בשנה שמתחילה ב-${isoToHe(r.year.from)}: ${r.year.a} לילות אצל ${pa} (${r.year.aPct}%) ו-${r.year.b} אצל ${pb}${r.rule === 'none' ? ', לפי הלוח הקבוע בלבד' : `; ${RULE_HE[r.rule]}, ${r.year.shiftedToA + r.year.shiftedToB} לילות עברו מהלוח הקבוע להורה השני בגלל חגים וחופשות`}.`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ ${r.equal ? 'חלוקה שווה של הלילות' : 'הילדים בעיקר אצל הורה אחד'}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה: ' : ''}לילות בשנה אצל ${esc(who('A', r.parentA))}</p>`
		+ `<strong class="jtool-verdict__figure"><bdi>${r.year.a}</bdi> / <bdi>365</bdi></strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<p class="jtool-scope">מספר הלילות משנה את המזונות: במחשבון המזונות מקלידים ${r.nightsA} לילות מתוך 14.</p></div>`
		+ calendar(r.input || opts.input || { pattern: r.pattern, parentA: r.parentA }, r.nights)
		+ yearGrid(r)
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '');
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const pa = who('A', r.parentA);
	const pb = who('B', r.parentA);
	let out = '';
	if (r.spans.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-hol-h">חגים וחופשות בשנה הקרובה: אצל מי</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הורדה ליומן (.ics)</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-hol-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">החג</th><th scope="col">מתי</th><th scope="col">לילות</th><th scope="col">אצל מי</th><th scope="col">שינוי מהלוח</th></tr></thead><tbody>`
			+ r.spans.map((s) => `<tr><td data-th="החג">${esc(s.he)}${s.half ? ' (חצי)' : ''}</td><td data-th="מתי"><bdi>${isoToHe(s.from)}</bdi> עד <bdi>${isoToHe(s.to)}</bdi></td><td data-th="לילות"><bdi>${s.nights}</bdi></td><td data-th="אצל מי">${esc(who(s.who, r.parentA))}</td><td data-th="שינוי מהלוח">${s.shifted ? `<bdi>${s.shifted}</bdi> לילות שהיו אצל ${esc(who(s.who === 'A' ? 'B' : 'A', r.parentA))}` : 'כמו בלוח'}</td></tr>`).join('')
			+ `</tbody><caption>${esc(reg.divorce_agreement.holidays_he)}. ${esc(RULE_HE[r.rule])}.</caption></table></div></div>`;
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-year-h">השנה במספרים</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-year-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">${esc(pa)}</th><th scope="col">${esc(pb)}</th></tr></thead><tbody>`
		+ `<tr><td data-th="מה">לילות לפי הלוח הקבוע</td><td data-th="${esc(pa)}"><bdi>${r.year.regularA}</bdi></td><td data-th="${esc(pb)}"><bdi>${r.year.regularB}</bdi></td></tr>`
		+ (r.rule !== 'none' ? `<tr><td data-th="מה">לילות שעברו בגלל חגים וחופשות</td><td data-th="${esc(pa)}"><bdi>+${r.year.shiftedToA}</bdi> / <bdi>−${r.year.shiftedToB}</bdi></td><td data-th="${esc(pb)}"><bdi>+${r.year.shiftedToB}</bdi> / <bdi>−${r.year.shiftedToA}</bdi></td></tr>` : '')
		+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול בשנה</td><td data-th="${esc(pa)}"><bdi>${r.year.a}</bdi> (<bdi>${r.year.aPct}%</bdi>)</td><td data-th="${esc(pb)}"><bdi>${r.year.b}</bdi> (<bdi>${r.year.bPct}%</bdi>)</td></tr>`
		+ `</tbody><caption>מעברים בין הבתים בשבועיים: ${r.handovers}. לילה נספר לפי הערב שבו הוא מתחיל.</caption></table></div></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-text-h">הלוח כטקסט, להסכם או להודעה</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copytext">העתקת הטקסט</button></div></div><pre class="jtool-letter" role="region" aria-labelledby="${P}-text-h" tabindex="0">${esc(r.text)}</pre></div>`;
	return out;
}

/** Page section: the patterns side by side. */
export function compareTable() {
	const rows = luCompare().map((c) => `<tr><td data-th="ההסדר">${esc(c.he)}</td><td data-th="לילות אצל הורה א'"><bdi>${c.nightsA}</bdi> מתוך 14</td><td data-th="מעברים בשבועיים"><bdi>${c.handovers}</bdi></td><td data-th="למי מתאים">${esc(c.fit)}</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הסדרי לינה נפוצים בשבועיים (תבניות; בית המשפט מאשר לפי טובת הילד, סעיף 24 לחוק הכשרות)</caption><thead><tr><th scope="col">ההסדר</th><th scope="col">לילות אצל הורה א'</th><th scope="col">מעברים בשבועיים</th><th scope="col">למי מתאים</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = luPlan(reg, EXAMPLE);
	r.input = EXAMPLE;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.year.a,
		sticky: `<bdi>${r.nightsA}</bdi>/14`,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true, input: EXAMPLE }),
		details: renderDetails(reg, r),
		method: `<ol><li>הלוח: ${esc(LU_PATTERNS[EXAMPLE.pattern].he)}: ${r.nightsA} לילות מתוך 14 אצל ${esc(who('A', EXAMPLE.parentA))}, ${r.handovers} מעברים בשבועיים.</li>`
			+ `<li>השנה: 365 לילות מיום ראשון ${isoToHe(r.year.from)}; לפי הלוח הקבוע ${r.year.regularA} אצל ${esc(who('A', EXAMPLE.parentA))} ו-${r.year.regularB} אצל ${esc(who('B', EXAMPLE.parentA))} (26 מחזורים של שבועיים ועוד לילה אחד).</li>`
			+ `<li>החגים לפי הלוח העברי של השנה, ${esc(RULE_HE[r.rule])}: ${r.year.holidayNights} לילות של חגים וחופש גדול, ומהם ${r.year.shiftedToA + r.year.shiftedToB} עברו להורה שלא היה אמור ללון איתם לפי הלוח.</li>`
			+ `<li>סך הכול: ${r.year.a} לילות אצל ${esc(who('A', EXAMPLE.parentA))} (${r.year.aPct}%) ו-${r.year.b} אצל ${esc(who('B', EXAMPLE.parentA))}.</li></ol>`,
		compare_table: compareTable(),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root, custom) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	return {
		parentA: checked('pa') === 'אמא' ? 'אמא' : 'אבא',
		pattern: val(`#${P}-pat`) || 'two_two_three',
		custom: custom.slice(),
		start: luToIso(val(`#${P}-start`)),
		holidays: checked('ho') || 'split',
		firstA: Boolean(root.querySelector(`input[name="${P}-fa"]:checked`)),
	};
}

const stateOf = (m) => encodeState({ p: m.pattern, n: m.pattern === 'custom' ? m.custom.join('.') : '', s: m.start, h: m.holidays === 'alternate' ? 'a' : m.holidays === 'none' ? 'n' : '', f: m.firstA === false ? 0 : '', a: m.parentA === 'אמא' ? 'm' : '' });
const KEYS = ['p', 'n', 's', 'h', 'f', 'a'];
function modelOf(s) {
	if (!s.p && !s.s) { return null; }
	return {
		pattern: LU_PATTERNS[s.p] ? s.p : (s.p === 'custom' ? 'custom' : 'two_two_three'),
		custom: s.n ? String(s.n).split('.').filter(Boolean).map(Number) : [],
		start: s.s || '', holidays: s.h === 'a' ? 'alternate' : s.h === 'n' ? 'none' : 'split', firstA: s.f !== '0', parentA: s.a === 'm' ? 'אמא' : 'אבא',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const saveKey = `jtool-${TOOL_ID}`;
	const today = ilToday();
	let custom = [];
	let started = false;
	let timer = null;
	let last = null;
	track('tool_view', { tool_id: TOOL_ID });
	// The live page starts on the coming Sunday, unless a shared link or a saved plan says otherwise.
	const nextSunday = (() => { const d = new Date(`${today}T00:00:00Z`); const add = (7 - d.getUTCDay()) % 7; return new Date(d.getTime() + add * 86400000).toISOString().slice(0, 10); })();
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const run = (m, opts = {}) => {
		if (m.pattern !== 'custom' && LU_PATTERNS[m.pattern]) { custom = LU_PATTERNS[m.pattern].a.slice(); }
		const r = luPlan(reg, m);
		r.input = m;
		showErrors(r);
		result.innerHTML = renderResult(reg, r, { input: m });
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? `<bdi>${r.nightsA}</bdi>/14` : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.equal ? 'equal' : 'primary' }); }
		last = r;
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root, custom)); }, 160);
	};
	const fromHash = modelOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		custom = fromHash.custom.slice();
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	} else {
		// A fresh visit starts on the coming Sunday, and the year is recomputed from it (the server HTML holds the
		// example's start; Codex review, PR 137).
		const startField = root.querySelector(`#${P}-start`);
		if (startField) { startField.value = isoToHe(nextSunday); }
		run(readForm(root, custom), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', (ev) => {
		// Switching to "custom" starts from the nights of the schedule that was on screen.
		if (ev.target && ev.target.id === `${P}-pat` && ev.target.value === 'custom' && last && last.ok) { custom = last.nights.map((x, i) => (x === 'A' ? i : -1)).filter((i) => i >= 0); }
		schedule();
	});
	root.addEventListener('click', async (ev) => {
		const night = ev.target.closest('button[data-night]');
		if (night) {
			const i = Number(night.getAttribute('data-night'));
			custom = custom.includes(i) ? custom.filter((x) => x !== i) : custom.concat(i).sort((a, b) => a - b);
			if (timer) { clearTimeout(timer); timer = null; }
			run(readForm(root, custom));
			const again = root.querySelector(`button[data-night="${i}"]`);
			if (again) { again.focus(); }
			return;
		}
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		const m = readForm(root, custom);
		const r = run(m, { silent: true });
		const link = shareUrl(stateOf(m));
		if (act === 'ics' && r.ok) {
			download('luach-shahut.ics', 'text/calendar;charset=utf-8', ics(r.events, new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'copytext' && r.ok) {
			const ok = await copyText(r.text);
			toast(root, ok ? 'הלוח הועתק כטקסט.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות או פרטים מזהים.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · לוח שהות מ-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (נבנה ב-jus-tice.co.il)`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.pattern : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(m));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = modelOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { custom = s.custom.slice(); form.innerHTML = renderForm(reg, s); run(s); }
		} else if (act === 'clear') {
			store.clear(saveKey);
			toast(root, 'נמחק מהמכשיר.');
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
