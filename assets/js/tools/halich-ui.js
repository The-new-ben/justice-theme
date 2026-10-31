/**
 * The criminal process step by step (HAD-651, the criminal hub plan's tool ג3): "ההליך הפלילי שלב אחרי שלב"
 * (halich-plili, prefix jt79) on /criminal-defense-attorney/. Pick where you are and the steps before it read as done,
 * yours is marked, the rest come next; every step carries three facts with their sections and the site's guide for it.
 * Every fact is in reg.fl_plili_halich (tools/justice_tools_fl_plili_halich.py), read in the statute text on 31.10.2026.
 */
import { esc, isoToHe, encodeState, decodeState, track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar } from './instrument.js';

export const TOOL_ID = 'halich-plili';
export const PAGE = '/criminal-defense-attorney/';
const P = 'jt79';

export function hlDefaults(reg) {
	return { step: reg.fl_plili_halich.steps[1].id };
}

export function hlCompute(reg, input) {
	const h = reg.fl_plili_halich;
	const i = Object.assign(hlDefaults(reg), input || {});
	const at = h.steps.findIndex((s) => s.id === i.step);
	if (at < 0) { return { ok: false, errors: [{ field: 'step', he: 'בחרו שלב' }], input: i }; }
	return {
		ok: true,
		input: i,
		at,
		step: h.steps[at],
		next: h.steps[at + 1] || null,
		steps: h.steps.map((s, n) => ({ ...s, state: n < at ? 'done' : (n === at ? 'now' : 'next') })),
	};
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	return `אתם בשלב ${r.at + 1} מתוך ${r.steps.length}: ${r.step.he}.${r.next ? ` הבא: ${r.next.he}.` : ''}`;
}

export function renderForm(reg, input) {
	const h = reg.fl_plili_halich;
	const i = Object.assign(hlDefaults(reg), input || {});
	const chips = h.steps.map((s) => `<label class="jtool-chip"><input type="radio" name="${P}-step" value="${esc(s.id)}"${s.id === i.step ? ' checked' : ''}><span>${esc(s.he)}</span></label>`).join('');
	return `<fieldset class="jtool-field"><legend>1. איפה אתם עכשיו</legend><div class="jtool-chips">${chips}</div><p class="jtool-error" id="${P}-step-e" role="alert"></p></fieldset>`;
}

const fact = (f) => `<li>${esc(f.he)} <a class="${P}-cite" href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.law)} ס' ${esc(f.section)}</a></li>`;

export function renderResult(reg, r, opts = {}) {
	const h = reg.fl_plili_halich;
	if (!r.ok) { return '<p class="jtool-hint">בחרו שלב.</p>'; }
	return `<div class="jtool-verdict ${P}-verdict" aria-live="polite">${opts.example ? '<p class="jtool-example">דוגמה: מעצר ודיון בהארכה. בחרו את השלב שלכם.</p>' : ''}`
		+ `<p class="${P}-sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<ul class="${P}-facts">${r.step.facts.map(fact).join('')}</ul>`
		+ `<p class="${P}-guide">המדריך לשלב: <a href="${esc(r.step.guide.path)}" data-act="guide">${esc(r.step.guide.he)}</a></p>`
		+ `<p class="${P}-reviewed">${esc(h.reviewed_he)} · נבדק ${isoToHe(h.checked_on)}</p></div>`;
}

/** The whole timeline: an ordered list, one item per step, done / now / next. */
export function timeline(reg, r) {
	const label = { done: 'עבר', now: 'אתם כאן', next: 'בהמשך' };
	const items = r.steps.map((s, n) => `<li class="${P}-step is-${s.state}"${s.state === 'now' ? ' aria-current="step"' : ''}>`
		+ `<span class="${P}-n" aria-hidden="true">${n + 1}</span><div class="${P}-body">`
		+ `<p class="${P}-title"><a href="${esc(s.guide.path)}">${esc(s.he)}</a> <span class="${P}-state">${label[s.state]}</span></p>`
		+ `<ul class="${P}-facts">${s.facts.map(fact).join('')}</ul></div></li>`).join('');
	return `<ol class="${P}-line">${items}</ol>`;
}

export function renderDetails(reg, r, opts = {}) {
	const h = reg.fl_plili_halich;
	if (!r.ok) { return ''; }
	return timeline(reg, r)
		+ `<div class="jtool-tablewrap ${P}-method"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">מקורות הציר</h3></div>${methodList(reg)}</div>`
		+ `<div class="${P}-print">${esc(printText(reg, r, opts.printedOn || h.checked_on))}</div>`;
}

export function methodList(reg) {
	return `<ol class="jtool-method-list">${reg.fl_plili_halich.method_he.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

export function printText(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	return `ההליך הפלילי (jus-tice.co.il, ${isoToHe(printedOn)}). ${verdictSentence(reg, r)} ${r.step.facts.map((f) => `${f.he} (${f.law} ס' ${f.section})`).join(' ')}`;
}

export const KEYS = ['p'];
export function stateOf(reg, input) {
	return encodeState({ p: String(Math.max(0, reg.fl_plili_halich.steps.findIndex((s) => s.id === input.step))) });
}
export function inputOf(reg, s) {
	if (!s || s.p === undefined) { return null; }
	const st = reg.fl_plili_halich.steps[Number(s.p)];
	return { step: st ? st.id : hlDefaults(reg).step };
}

export function snapshot(reg) {
	const h = reg.fl_plili_halich;
	const input = hlDefaults(reg);
	const r = hlCompute(reg, input);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input,
		total: r.steps.length,
		sticky: `<bdi>${esc(r.step.he)}</bdi>`,
		form: renderForm(reg, input),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: h.checked_on }),
		method: methodList(reg),
		sentence: verdictSentence(reg, r),
		answer: { steps: h.steps.map((s) => s.he) },
	};
}

function readForm(root) {
	const s = root.querySelector(`input[name="${P}-step"]:checked`);
	return { step: s ? s.value : '' };
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const h = reg.fl_plili_halich;
	let own = false;
	let started = false;
	const saveKey = `jtool-${TOOL_ID}`;
	track('tool_view', { tool_id: TOOL_ID });
	const run = (input, opts = {}) => {
		const r = hlCompute(reg, input);
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		if (!r.ok) { for (const e of r.errors) { const el = root.querySelector(`#${P}-${e.field}-e`); if (el) { el.textContent = e.he; } } }
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { printedOn: h.checked_on });
		if (sticky && r.ok) { sticky.innerHTML = `<bdi>${esc(r.step.he)}</bdi>`; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.input.step }); }
		return r;
	};
	const current = () => (own ? readForm(root) : hlDefaults(reg));
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
			const ok = await copyText(printText(reg, r, h.checked_on));
			toast(root, ok ? 'השלב והעובדות הועתקו.' : 'לא הצלחנו להעתיק.');
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
