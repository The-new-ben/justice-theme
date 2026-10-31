/**
 * The suspect's rights card (HAD-651, the criminal hub plan's tool ג4): "הזכויות שלכם בחקירה ובמעצר" (zchuyot-chashud,
 * prefix jt80) on /criminal-defense-attorney/. Pick "questioned under caution" or "arrested" and the card shows the
 * rights that apply, each with its section; a quote from the law is marked as a quote, the rest is plain wording of the
 * section. It prints on one page. Every right is in reg.fl_plili_halich.rights (tools/justice_tools_fl_plili_halich.py).
 */
import { esc, isoToHe, encodeState, decodeState, track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar } from './instrument.js';

export const TOOL_ID = 'zchuyot-chashud';
export const PAGE = '/criminal-defense-attorney/';
const P = 'jt80';

export function zcDefaults() {
	return { mode: 'arrest' };
}

export function zcCompute(reg, input) {
	const h = reg.fl_plili_halich;
	const i = Object.assign(zcDefaults(), input || {});
	const mode = h.modes.find((m) => m.v === i.mode);
	if (!mode) { return { ok: false, errors: [{ field: 'mode', he: 'בחרו מצב' }], input: i }; }
	return { ok: true, input: i, mode, rights: h.rights.filter((x) => x.when.includes(i.mode)) };
}

export function verdictSentence(reg, r) {
	return r.ok ? `${r.mode.he}: ${r.rights.length} זכויות, כל אחת עם הסעיף שלה.` : '';
}

export function renderForm(reg, input) {
	const h = reg.fl_plili_halich;
	const i = Object.assign(zcDefaults(), input || {});
	const chips = h.modes.map((m) => `<label class="jtool-chip"><input type="radio" name="${P}-mode" value="${esc(m.v)}"${m.v === i.mode ? ' checked' : ''}><span>${esc(m.he)}</span></label>`).join('');
	return `<fieldset class="jtool-field"><legend>1. מה המצב</legend><div class="jtool-chips">${chips}</div><p class="jtool-error" id="${P}-mode-e" role="alert"></p></fieldset>`;
}

/** The card itself: one item per right, the quote or the plain wording, and the section. */
export function card(reg, r) {
	const items = r.rights.map((x) => `<li class="${P}-right${x.urgent ? ' is-urgent' : ''}"><strong class="${P}-title">${esc(x.he)}</strong>`
		+ `<span class="${P}-text">${x.quote ? `"${esc(x.text)}"` : `<span class="${P}-free">בניסוח חופשי:</span> ${esc(x.text)}`}</span>`
		+ `<a class="${P}-cite" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.law)}, ס' ${esc(x.section)}</a></li>`).join('');
	return `<ol class="${P}-card">${items}</ol>`;
}

export function renderResult(reg, r, opts = {}) {
	const h = reg.fl_plili_halich;
	if (!r.ok) { return '<p class="jtool-hint">בחרו מצב.</p>'; }
	return `<div class="jtool-verdict ${P}-verdict" aria-live="polite">${opts.example ? '<p class="jtool-example">דוגמה: מי שנעצר. אפשר לעבור לחקירה באזהרה.</p>' : ''}`
		+ `<p class="${P}-sentence">${esc(verdictSentence(reg, r))}</p>${card(reg, r)}`
		+ `<p class="jtool-hint">ציטוט מהחוק מופיע במרכאות; השאר בניסוח חופשי של הסעיף. אפשר להדפיס את הכרטיס ולשמור אותו.</p>`
		+ `<p class="${P}-reviewed">${esc(h.reviewed_he)} · נבדק ${isoToHe(h.checked_on)}</p></div>`;
}

export function renderDetails(reg, r, opts = {}) {
	const h = reg.fl_plili_halich;
	if (!r.ok) { return ''; }
	return `<p class="${P}-more"><a href="/police-investigation-rights/">זכויות חשוד בחקירה במשטרה</a> · <a href="/arrest-detention-lawyer-israel/">עורך דין מעצרים</a></p>`
		+ `<div class="${P}-print">${esc(printText(reg, r, opts.printedOn || h.checked_on))}</div>`;
}

export function methodList(reg) {
	return `<ol class="jtool-method-list">${reg.fl_plili_halich.method_he.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

export function printText(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	return `הזכויות שלכם (jus-tice.co.il, ${isoToHe(printedOn)}). ${r.mode.he}: ${r.rights.map((x) => `${x.he} (${x.law} ס' ${x.section})`).join('; ')}.`;
}

export const KEYS = ['m'];
export function stateOf(reg, input) {
	return encodeState({ m: String(Math.max(0, reg.fl_plili_halich.modes.findIndex((m) => m.v === input.mode))) });
}
export function inputOf(reg, s) {
	if (!s || s.m === undefined) { return null; }
	const m = reg.fl_plili_halich.modes[Number(s.m)];
	return { mode: m ? m.v : 'arrest' };
}

export function snapshot(reg) {
	const h = reg.fl_plili_halich;
	const input = zcDefaults();
	const r = zcCompute(reg, input);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input,
		total: r.rights.length,
		sticky: `<bdi>${r.rights.length} זכויות</bdi>`,
		form: renderForm(reg, input),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: h.checked_on }),
		method: methodList(reg),
		sentence: verdictSentence(reg, r),
		answer: { rights: r.rights.map((x) => ({ he: x.he, law: x.law, section: x.section })) },
	};
}

function readForm(root) {
	const m = root.querySelector(`input[name="${P}-mode"]:checked`);
	return { mode: m ? m.value : '' };
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
		const r = zcCompute(reg, input);
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		if (!r.ok) { for (const e of r.errors) { const el = root.querySelector(`#${P}-${e.field}-e`); if (el) { el.textContent = e.he; } } }
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { printedOn: h.checked_on });
		if (sticky && r.ok) { sticky.innerHTML = `<bdi>${r.rights.length} זכויות</bdi>`; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.input.mode }); }
		return r;
	};
	const current = () => (own ? readForm(root) : zcDefaults());
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
			window.open(whatsappUrl(`${printText(reg, r, h.checked_on)} ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(printText(reg, r, h.checked_on));
			toast(root, ok ? 'הכרטיס הועתק.' : 'לא הצלחנו להעתיק.');
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
