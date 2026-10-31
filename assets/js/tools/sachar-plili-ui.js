/**
 * Criminal defence fees by stage (HAD-651, the criminal hub plan's tool ג2): "שכר טרחה של עורך דין פלילי לפי שלב"
 * (sachar-orech-din-plili, prefix jt77) on /criminal-defense-attorney/. One row per stage of the criminal process: what
 * the work includes, the range offices publish (the lowest published low to the highest published high, with the median
 * of the midpoints), the Israel Bar's recommended minimum where its tariff names the service, the sources and the date.
 * Pick a stage and the sentence above the table answers for it, with or without VAT. Every figure is in
 * reg.fl_plili_sachar (tools/justice_tools_fl_plili_sachar.py); illustrations, not a price quote.
 */
import { esc, ils, isoToHe, encodeState, decodeState, track, copyText, toast, shareUrl, whatsappUrl, stickyBar } from './instrument.js';

export const TOOL_ID = 'sachar-orech-din-plili';
export const PAGE = '/criminal-defense-attorney/';
const P = 'jt77';

const nis = (n) => `${Math.round(n).toLocaleString('en-US')} ₪`;

export function scDefaults(reg) {
	const t = reg.fl_plili_sachar;
	return { stage: t.default_stage, vat: true };
}

/** The engine: a stage (and VAT on or off) in, the row with its amounts out. */
export function scCompute(reg, input) {
	const t = reg.fl_plili_sachar;
	const i = Object.assign(scDefaults(reg), input || {});
	const row = t.rows.find((r) => r.id === i.stage);
	if (!row) { return { ok: false, errors: [{ field: 'stage', he: 'בחרו שלב' }], input: i }; }
	const k = 1 + t.vat_rate;
	// Market ranges are published both ways; the table keeps them as published and shows a VAT note, while the Bar's
	// minimum is before VAT and gets VAT added when the reader asks for amounts with VAT.
	const floor = row.floor ? { amount: i.vat && !row.floor.vat_included ? row.floor.amount * k : row.floor.amount, item_he: row.floor.item_he } : null;
	return {
		ok: true,
		input: i,
		row,
		low: row.low,
		high: row.high,
		mid: row.mid,
		floor,
	};
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const range = typeof r.low === 'number' ? `בדרך כלל ${nis(r.low)} עד ${nis(r.high)}${r.row.high_open ? ` ${reg.fl_plili_sachar.open_he}` : ''}` : 'אין טווח מפורסם';
	const floor = r.floor ? `; המינימום המומלץ בתעריף הלשכה: ${nis(r.floor.amount)}${r.input.vat ? ' כולל מע"מ' : ' לפני מע"מ'}` : '';
	return `${r.row.he}: ${range}${floor}.`;
}

/** The same sentence as HTML, each amount an isolated run, for the result on the page. */
export function sentenceHtml(reg, r) {
	if (!r.ok) { return ''; }
	const t = reg.fl_plili_sachar;
	const range = typeof r.low === 'number' ? `בדרך כלל ${ils(r.low, 0)} עד ${ils(r.high, 0)}${r.row.high_open ? ` ${esc(t.open_he)}` : ''}` : 'אין טווח מפורסם';
	const floor = r.floor ? `; המינימום המומלץ בתעריף הלשכה: ${ils(r.floor.amount, 0)}${r.input.vat ? ' כולל מע"מ' : ' לפני מע"מ'}` : '';
	return `${esc(r.row.he)}: ${range}${floor}.`;
}

export function renderForm(reg, input) {
	const t = reg.fl_plili_sachar;
	const i = Object.assign(scDefaults(reg), input || {});
	const opts = t.rows.map((r) => `<label class="jtool-chip"><input type="radio" name="${P}-stage" value="${esc(r.id)}"${r.id === i.stage ? ' checked' : ''}><span>${esc(r.short_he)}</span></label>`).join('');
	return `<fieldset class="jtool-field"><legend>1. באיזה שלב</legend><div class="jtool-chips">${opts}</div><p class="jtool-error" id="${P}-stage-e" role="alert"></p></fieldset>`
		+ `<div class="jtool-field"><label class="jtool-check"><input type="checkbox" id="${P}-vat"${i.vat ? ' checked' : ''}> <span>המינימום של הלשכה כולל מע"מ (${Math.round(t.vat_rate * 100)}%)</span></label></div>`;
}

export function renderResult(reg, r, opts = {}) {
	const t = reg.fl_plili_sachar;
	if (!r.ok) { return '<p class="jtool-hint">בחרו שלב.</p>'; }
	const mid = typeof r.mid === 'number' ? `<p class="${P}-mid">אמצע הטווחים שמתפרסמים: ${ils(r.mid, 0)}, לפי ${r.row.n} מקורות.</p>` : '';
	return `<div class="jtool-verdict ${P}-verdict" aria-live="polite">${opts.example ? `<p class="jtool-example">דוגמה: ${esc(r.row.he)}. בחרו שלב אחר והשורה תתעדכן.</p>` : ''}`
		+ `<p class="${P}-sentence">${sentenceHtml(reg, r)}</p>${mid}`
		+ `<p class="${P}-includes"><strong>מה כלול:</strong> ${esc(r.row.includes_he)}</p>`
		+ `<p class="jtool-hint">${esc(t.disclaimer_he)}</p>`
		+ `<p class="${P}-reviewed">${esc(t.reviewed_he)} · נבדק ${isoToHe(t.checked_on)}</p></div>`;
}

/** The full table: every stage, the market range, the Bar's minimum, the sources and the date. */
export function feeTable(reg, r) {
	const t = reg.fl_plili_sachar;
	const body = t.rows.map((row) => {
		const range = typeof row.low === 'number' ? `${ils(row.low, 0)} עד ${ils(row.high, 0)}${row.high_open ? ` ${esc(t.open_he)}` : ''}` : 'אין טווח מפורסם';
		const floor = row.floor ? `${ils(row.floor.amount, 0)}${row.floor.vat_included ? '' : ' + מע"מ'}` : '—';
		const src = row.sources.slice(0, 3).map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener nofollow"><bdi>${esc(s.publisher)}</bdi></a>`).join(', ')
			+ (row.sources.length > 3 ? ` ועוד ${row.sources.length - 3}` : '')
			+ (row.floor ? `${row.sources.length ? '; ' : ''}<a href="${esc(t.bar.url)}" target="_blank" rel="noopener">${esc(t.bar.short_he)}</a>` : '');
		const on = r && r.ok && r.row.id === row.id ? ' class="is-on"' : '';
		return `<tr${on}><th scope="row" data-th="שלב">${esc(row.he)}</th><td data-th="טווח אופייני">${range}</td><td data-th="מינימום לפי תעריף הלשכה">${floor}</td><td data-th="מקור">${src || '—'}</td><td data-th="נבדק">${isoToHe(row.checked_on || t.checked_on)}</td></tr>`;
	}).join('');
	const pd = `<tr class="${P}-pd"><th scope="row" data-th="שלב">${esc(t.public_defender.he)}</th><td data-th="מי זכאי" colspan="2">${esc(t.public_defender.text_he)} <a href="${esc(t.public_defender.path)}">${esc(t.public_defender.link_he)}</a></td><td data-th="מקור"><a href="${esc(t.public_defender.url)}" target="_blank" rel="noopener">${esc(t.public_defender.source_he)}</a></td><td data-th="נבדק">${isoToHe(t.checked_on)}</td></tr>`;
	return `<div class="jtool-tablewrap ${P}-tablewrap"><table class="jtool-table jtool-datatable ${P}-table"><caption>${esc(t.caption_he)}</caption>`
		+ '<thead><tr><th scope="col">שלב</th><th scope="col">טווח אופייני</th><th scope="col">מינימום לפי תעריף הלשכה</th><th scope="col">מקור</th><th scope="col">נבדק</th></tr></thead>'
		+ `<tbody>${body}${pd}</tbody></table></div>`
		+ `<p class="jtool-hint">${esc(t.vat_he)} <a href="${esc(t.tariff_page.path)}">${esc(t.tariff_page.he)}</a></p>`;
}

export function renderDetails(reg, r, opts = {}) {
	const t = reg.fl_plili_sachar;
	return feeTable(reg, r)
		+ `<div class="jtool-tablewrap ${P}-method"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך נבנתה הטבלה</h3></div>${methodList(reg)}</div>`
		+ `<div class="${P}-print">${esc(printText(reg, r, opts.printedOn || t.checked_on))}</div>`;
}

export function methodList(reg) {
	return `<ol class="jtool-method-list">${reg.fl_plili_sachar.method_he.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

export function printText(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	return `שכר טרחה של עורך דין פלילי (jus-tice.co.il, ${isoToHe(printedOn)}). ${verdictSentence(reg, r)}`;
}

export const KEYS = ['s', 'v'];
export function stateOf(reg, input) {
	const t = reg.fl_plili_sachar;
	return encodeState({ s: String(Math.max(0, t.rows.findIndex((x) => x.id === input.stage))), v: input.vat ? '1' : '0' });
}
export function inputOf(reg, s) {
	const t = reg.fl_plili_sachar;
	if (!s || s.s === undefined) { return null; }
	const row = t.rows[Number(s.s)];
	return { stage: row ? row.id : t.default_stage, vat: s.v !== '0' };
}

export function snapshot(reg) {
	const t = reg.fl_plili_sachar;
	const input = scDefaults(reg);
	const r = scCompute(reg, input);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input,
		total: r.ok && typeof r.mid === 'number' ? r.mid : 0,
		sticky: `<bdi>${esc(r.ok && typeof r.low === 'number' ? `${nis(r.low)}–${nis(r.high)}` : '')}</bdi>`,
		form: renderForm(reg, input),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: t.checked_on }),
		method: methodList(reg),
		sentence: verdictSentence(reg, r),
		answer: { rows: t.rows.map((x) => ({ id: x.id, he: x.he, low: x.low, high: x.high, mid: x.mid, n: x.n, floor: x.floor ? x.floor.amount : null })) },
	};
}

function readForm(root) {
	const st = root.querySelector(`input[name="${P}-stage"]:checked`);
	const vat = root.querySelector(`#${P}-vat`);
	return { stage: st ? st.value : '', vat: vat ? vat.checked : true };
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const t = reg.fl_plili_sachar;
	let own = false;
	let started = false;
	track('tool_view', { tool_id: TOOL_ID });
	const run = (input, opts = {}) => {
		const r = scCompute(reg, input);
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		if (!r.ok) { for (const e of r.errors) { const el = root.querySelector(`#${P}-${e.field}-e`); if (el) { el.textContent = e.he; } } }
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { printedOn: t.checked_on });
		if (sticky && r.ok && typeof r.low === 'number') { sticky.innerHTML = `<bdi>${esc(`${nis(r.low)}–${nis(r.high)}`)}</bdi>`; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.input.stage }); }
		return r;
	};
	const current = () => (own ? readForm(root) : scDefaults(reg));
	const apply = (input) => { own = true; form.innerHTML = renderForm(reg, input); return run(input); };
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = shareOwner === TOOL_ID ? inputOf(reg, decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (parsed) {
		apply(parsed);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
	}
	form.addEventListener('change', () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		run(readForm(root));
	});
	root.addEventListener('click', async (ev) => {
		const el = ev.target.closest('[data-act]');
		if (!el) { return; }
		const act = el.getAttribute('data-act');
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
			const ok = await copyText(printText(reg, r, t.checked_on));
			toast(root, ok ? 'השורה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		}
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
