/**
 * Criminal offences and their maximum penalties (HAD-651, the criminal hub plan's tool ג5): "עבירות פליליות ועונשן
 * המרבי" (onshei-averot, prefix jt78) on /criminal-defense-attorney/. Pick a family of offences and the table shows each
 * offence, its section, the maximum penalty as the statute states it, the court that hears it by the seven-year rule, the
 * site's guide and the statute itself. Every row is in reg.fl_plili_onashim (tools/justice_tools_fl_plili_onashim.py),
 * read in the consolidated statute text on 31.10.2026.
 */
import { esc, isoToHe, encodeState, decodeState, track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar } from './instrument.js';

export const TOOL_ID = 'onshei-averot';
export const PAGE = '/criminal-defense-attorney/';
const P = 'jt78';

export function oaDefaults() {
	return { family: 'all' };
}

/** The engine: a family in, its rows, the heaviest maximum and the courts out. */
export function oaCompute(reg, input) {
	const o = reg.fl_plili_onashim;
	const i = Object.assign(oaDefaults(), input || {});
	if (!o.families.some((f) => f.v === i.family)) { return { ok: false, errors: [{ field: 'family', he: 'בחרו סוג עבירה' }], input: i }; }
	const rows = o.rows.filter((r) => i.family === 'all' || r.family === i.family);
	const withYears = rows.filter((r) => typeof r.max_years === 'number');
	const top = withYears.reduce((m, r) => (!m || r.max_years > m.max_years ? r : m), null);
	return {
		ok: true,
		input: i,
		family: o.families.find((f) => f.v === i.family),
		rows,
		top,
		district: rows.filter((r) => r.court_he === 'מחוזי').length,
		guide: i.family !== 'all' ? o.guide[i.family] : null,
	};
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const head = r.input.family === 'all' ? `${r.rows.length} עבירות נפוצות בטבלה` : `${r.family.he}: ${r.rows.length} עבירות בטבלה`;
	const top = r.top ? `; העונש המרבי החמור ביותר: ${r.top.max_short_he}, ב${r.top.offence_he}` : '';
	return `${head}${top}.`;
}

export function renderForm(reg, input) {
	const o = reg.fl_plili_onashim;
	const i = Object.assign(oaDefaults(), input || {});
	const chips = o.families.map((f) => `<label class="jtool-chip"><input type="radio" name="${P}-family" value="${esc(f.v)}"${f.v === i.family ? ' checked' : ''}><span>${esc(f.he)}</span></label>`).join('');
	return `<fieldset class="jtool-field"><legend>1. איזו עבירה</legend><div class="jtool-chips">${chips}</div><p class="jtool-error" id="${P}-family-e" role="alert"></p></fieldset>`;
}

export function renderResult(reg, r, opts = {}) {
	const o = reg.fl_plili_onashim;
	if (!r.ok) { return '<p class="jtool-hint">בחרו סוג עבירה.</p>'; }
	const court = r.district ? `${r.district} מהן נדונות בבית המשפט המחוזי, השאר בבית משפט השלום.` : 'כולן נדונות בבית משפט השלום.';
	const guide = r.guide ? `<p class="${P}-guide">המדריך: <a href="${esc(r.guide.path)}" data-act="guide">${esc(r.guide.he)}</a></p>` : '';
	return `<div class="jtool-verdict ${P}-verdict" aria-live="polite">${opts.example ? '<p class="jtool-example">כל העבירות בטבלה. בחרו סוג עבירה כדי לצמצם.</p>' : ''}`
		+ `<p class="${P}-sentence">${esc(verdictSentence(reg, r))}</p><p class="${P}-court">${esc(court)}</p>${guide}`
		+ `<p class="jtool-hint">העונש בטבלה הוא המרבי שבחוק. העונש בפועל נקבע לפי הנסיבות, ולרוב הוא נמוך בהרבה.</p>`
		+ `<p class="${P}-reviewed">${esc(o.reviewed_he)} · נבדק ${isoToHe(o.checked_on)}</p></div>`;
}

/** The table of the chosen family: offence, section, maximum, court, guide and the statute. */
export function offenceTable(reg, r) {
	const o = reg.fl_plili_onashim;
	const body = r.rows.map((row) => {
		const guide = o.guide[row.family];
		return `<tr><th scope="row" data-th="העבירה">${esc(row.offence_he)}</th>`
			+ `<td data-th="הסעיף"><span class="${P}-cite">${esc(row.law_he)} ס' ${esc(row.section)}</span></td>`
			+ `<td data-th="עונש מרבי">${esc(row.max_short_he)}</td>`
			+ `<td data-th="בית משפט">${esc(row.court_he || '—')}</td>`
			+ `<td data-th="המדריך">${guide ? `<a href="${esc(guide.path)}">${esc(guide.he)}</a>` : '—'}</td>`
			+ `<td data-th="נוסח החוק"><a href="${esc(row.url)}" target="_blank" rel="noopener">לנוסח</a></td></tr>`;
	}).join('');
	return `<div class="jtool-tablewrap ${P}-tablewrap"><table class="jtool-table jtool-datatable ${P}-table"><caption>${esc(o.caption_he)}</caption>`
		+ '<thead><tr><th scope="col">העבירה</th><th scope="col">הסעיף</th><th scope="col">עונש מרבי</th><th scope="col">בית משפט</th><th scope="col">המדריך</th><th scope="col">נוסח החוק</th></tr></thead>'
		+ `<tbody>${body}</tbody></table></div>`
		+ `<p class="jtool-hint">${esc(o.court_rule_he)} <a href="${esc(o.court_url)}" target="_blank" rel="noopener">חוק בתי המשפט, סעיפים 40 ו-51</a></p>`;
}

export function renderDetails(reg, r, opts = {}) {
	const o = reg.fl_plili_onashim;
	if (!r.ok) { return ''; }
	return offenceTable(reg, r)
		+ `<div class="jtool-tablewrap ${P}-method"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך נבנתה הטבלה</h3></div>${methodList(reg)}</div>`
		+ `<div class="${P}-print">${esc(printText(reg, r, opts.printedOn || o.checked_on))}</div>`;
}

export function methodList(reg) {
	return `<ol class="jtool-method-list">${reg.fl_plili_onashim.method_he.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

export function printText(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	return `עבירות פליליות ועונשן המרבי (jus-tice.co.il, ${isoToHe(printedOn)}). ${r.rows.map((x) => `${x.offence_he}: ${x.law_he} ס' ${x.section}, ${x.max_short_he}.`).join(' ')}`;
}

export const KEYS = ['f'];
export function stateOf(reg, input) {
	return encodeState({ f: String(Math.max(0, reg.fl_plili_onashim.families.findIndex((x) => x.v === input.family))) });
}
export function inputOf(reg, s) {
	if (!s || s.f === undefined) { return null; }
	const f = reg.fl_plili_onashim.families[Number(s.f)];
	return { family: f ? f.v : 'all' };
}

export function snapshot(reg) {
	const o = reg.fl_plili_onashim;
	const input = oaDefaults();
	const r = oaCompute(reg, input);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input,
		total: r.rows.length,
		sticky: `<bdi>${r.rows.length} עבירות</bdi>`,
		form: renderForm(reg, input),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: o.checked_on }),
		method: methodList(reg),
		sentence: verdictSentence(reg, r),
		answer: { n: r.rows.length, top: r.top ? { offence: r.top.offence_he, max: r.top.max_short_he } : null, rows: o.rows.map((x) => ({ offence: x.offence_he, law: x.law_he, section: x.section, max: x.max_short_he, court: x.court_he })) },
	};
}

function readForm(root) {
	const f = root.querySelector(`input[name="${P}-family"]:checked`);
	return { family: f ? f.value : '' };
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const o = reg.fl_plili_onashim;
	let own = false;
	let started = false;
	const saveKey = `jtool-${TOOL_ID}`;
	track('tool_view', { tool_id: TOOL_ID });
	const run = (input, opts = {}) => {
		const r = oaCompute(reg, input);
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		if (!r.ok) { for (const e of r.errors) { const el = root.querySelector(`#${P}-${e.field}-e`); if (el) { el.textContent = e.he; } } }
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { printedOn: o.checked_on });
		if (sticky && r.ok) { sticky.innerHTML = `<bdi>${r.rows.length} עבירות</bdi>`; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.input.family }); }
		return r;
	};
	const current = () => (own ? readForm(root) : oaDefaults());
	const apply = (input) => { own = true; form.innerHTML = renderForm(reg, input); return run(input); };
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = shareOwner === TOOL_ID ? inputOf(reg, decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (parsed) {
		apply(parsed);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
	}
	if (store.get(saveKey) && !parsed) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('change', () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		run(readForm(root));
	});
	root.addEventListener('click', async (ev) => {
		const el = ev.target.closest('[data-act]');
		if (!el) { return; }
		const act = el.getAttribute('data-act');
		if (act === 'guide') { track('tool_next', { tool_id: TOOL_ID, band: 'guide' }); return; }
		const input = current();
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(reg, input))}/@${TOOL_ID}`;
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(printText(reg, r, o.checked_on));
			toast(root, ok ? 'הטבלה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(reg, input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const saved = inputOf(reg, decodeState(store.get(saveKey) || '', KEYS));
			if (saved) { apply(saved); }
		} else if (act === 'clear') {
			store.clear(saveKey);
			toast(root, 'נמחק מהמכשיר.');
		}
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
