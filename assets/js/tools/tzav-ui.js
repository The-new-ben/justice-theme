/**
 * Inheritance-wave UI: the request planner for an inheritance order or a probate order.
 * One picture from the subject: the registrar's file as a docket rail, station after station, each with the day it falls
 * on and the fee it costs, the documents listed on the first station; the route (online, paper, religious court) decides
 * which stations exist. The same renderers write the server snapshot and the live page.
 */
import { tzBuild, tzByRoute, TZ_ROUTES, TZ_ROUTE_HE } from './tzav-engine.js';
import { parseDate } from './dates.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'tzav-yerusha';
const P = 'jt23';
export const EXAMPLE = { will: 'none', filer: 'self', heirs: 3, relation: 'close', idIsrael: true, certificate: true, abroad: false, renounce: 1, renounceMinor: false, minor: false, predeceased: 0, realEstate: true, religious: false, exempt: false, filed: '2026-11-01', publication: '' };

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const toIso = (text) => { const raw = String(text || '').trim(); if (!raw) { return ''; } return parseDate(raw) || raw; };

function stepper(id, label, value, hint, max = 30) {
	return `<div class="jtool-field jt23-count"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label>`
		+ `<div class="jt6-stepper"><button class="jtool-iconbtn" type="button" data-step="${id}" data-delta="-1" aria-label="פחות: ${esc(label)}">−</button>`
		+ `<input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(value ?? 0)}" data-max="${max}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">`
		+ `<button class="jtool-iconbtn" type="button" data-step="${id}" data-delta="1" aria-label="עוד: ${esc(label)}">+</button></div>`
		+ (hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : '') + `<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}
function dateField(id, label, v, hint) {
	return `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" placeholder="לדוגמה 1.11.2026" value="${esc(v ? isoToHe(v) : '')}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, m) {
	const ip = reg.inheritance_process;
	const will = m.will === 'will';
	const special = m.renounce || m.minor || m.predeceased || m.abroad || m.certificate === false || m.idIsrael === false;
	return `<fieldset class="jtool-field"><legend>מה השאיר המנוח</legend><div class="jtool-chips">${chip('will', 'none', 'אין צוואה: מבקשים צו ירושה', !will)}${chip('will', 'will', 'יש צוואה: מבקשים צו קיום צוואה', will)}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מי מגיש</legend><div class="jtool-chips">${chip('filer', 'self', 'יורש בעצמו, בלי עורך דין', m.filer !== 'lawyer')}${chip('filer', 'lawyer', 'עורך דין בשם היורשים', m.filer === 'lawyer')}</div></fieldset>`
		+ `<div class="jtool-row">${stepper('heirs', will ? 'כמה זוכים יש בצוואה' : 'כמה יורשים יש', m.heirs, 'כולל מי שמסתלק; בן זוג, ילדים, הורים, אחים')}`
		+ `<fieldset class="jtool-field"><legend>מי היורשים</legend><div class="jtool-chips">${chip('rel', 'close', 'בן זוג, ילדים, נכדים או הורים', m.relation !== 'extended')}${chip('rel', 'extended', 'גם אחים, אחיינים, סבים או דודים', m.relation === 'extended')}</div><p class="jtool-hint">כשיש אחים, אחיינים, סבים או דודים, הרשם מקבל רק הגשה ידנית</p></fieldset></div>`
		+ `<div class="jtool-chips">${chip('re', '1', 'יש דירה או קרקע בעיזבון', m.realEstate, 'checkbox')}${chip('rl', '1', 'מגישים לבית הדין הדתי, וכולם מסכימים בכתב', m.religious, 'checkbox')}${chip('ex', '1', `פטור מאגרה: ${ip.registrar.exempt_he.split(':')[0]}`, m.exempt, 'checkbox')}</div>`
		+ `<details class="jtool-more"${special ? ' open' : ''}><summary>יורשים מיוחדים ומצבים מיוחדים</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${stepper('ren', 'כמה יורשים מסתלקים מחלקם', m.renounce)}${stepper('pre', 'כמה יורשים נפטרו אחרי המוריש', m.predeceased)}</div>`
		+ `<div class="jtool-chips">${chip('rm', '1', 'מסתלק קטין או חסוי', m.renounceMinor, 'checkbox')}${chip('mn', '1', 'יורש קטין, חסוי או נעדר', m.minor, 'checkbox')}${chip('ab', '1', 'המנוח חי בחוץ לארץ', m.abroad, 'checkbox')}${chip('nid', '1', 'למנוח לא הייתה תעודת זהות ישראלית', m.idIsrael === false, 'checkbox')}${chip('nc', '1', 'אין תעודת פטירה', m.certificate === false, 'checkbox')}</div></details>`
		+ `<div class="jtool-row">${dateField('filed', 'יום ההגשה (או היום שבו תגישו)', m.filed)}${dateField('pub', 'יום הפרסום, אם הבקשה כבר פורסמה', m.publication, 'מופיע באתר האפוטרופוס הכללי; ממנו נספרים 14 הימים')}</div>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const fee = r.lines.some((l) => l.amount === null) ? 'אגרה לפי תקנות בתי הדין' : r.exempt ? 'בלי אגרה' : `${nis(r.total)} אגרה והוצאות פרסום`;
	const clock = r.clock.objectionsBy ? `התנגדויות עד ${isoToHe(r.clock.objectionsBy)}` : `${reg.inheritance_process.days.objection} ימים להתנגדויות מיום הפרסום`;
	return `${r.orderHe}: ${r.routeHe}, ${fee}, ${r.documents.length} מסמכים לצרף, ${clock}.`;
}

/** The docket rail: every station with its day and its cost. */
export function rail(reg, r) {
	const items = r.steps.map((s, i) => {
		const cost = s.cost ? (s.cost.amount === 0 ? '<span class="jt23-st__cost jt23-st__cost--free">פטור</span>' : `<span class="jt23-st__cost">${ils(s.cost.amount, 0)}</span>`) : '';
		const when = s.when ? `<span class="jt23-st__when">${esc(s.when)}</span>` : '';
		const link = s.link ? `<a class="jt23-st__link" href="${esc(s.link.path)}">${esc(s.link.label)}</a>` : '';
		return `<li class="jt23-st"><span class="jt23-st__n" aria-hidden="true">${i + 1}</span><p class="jt23-st__t">${esc(s.he)}</p>`
			+ (when || cost ? `<span class="jt23-st__meta">${when}${cost}</span>` : '')
			+ (s.do.length ? `<ul class="jt23-st__do">${s.do.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : '')
			+ `<span class="jt23-st__foot">${link}${cite(s.section, s.url)}</span></li>`;
	}).join('');
	return `<ol class="jt23-rail" aria-label="תחנות הבקשה">${items}</ol>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const state = r.route === 'religious' ? 'warn' : 'ok';
	const figure = r.lines.some((l) => l.amount === null) ? '—' : r.exempt ? 'פטור' : ils(r.total, 0);
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--${state}">${state === 'ok' ? '✓' : '!'} ${esc(r.routeHe)}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה: ' : ''}אגרה והוצאות פרסום, כפי שנגבות</p>`
		+ `<strong class="jtool-verdict__figure">${figure}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<ul class="jtool-flags jt23-why">${r.why.map((w) => `<li>${esc(w.he)}${cite(w.section, w.url)}</li>`).join('')}</ul></div>`
		+ rail(reg, r);
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const ip = reg.inheritance_process;
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-fee-h">מה משלמים</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-fee-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.lines.map((l) => `<tr><td data-th="מה">${esc(l.he)}</td><td data-th="סכום">${l.amount === null ? '—' : l.amount === 0 ? 'פטור' : ils(l.amount, 0)}</td><td data-th="הכלל">${cite(l.section, l.url)}</td></tr>`).join('')
		+ (r.lines.some((l) => l.amount === null) ? '' : `<tr class="jtool-table__total"><td data-th="מה">סך הכול</td><td data-th="סכום">${ils(r.total, 0)}</td><td data-th="הכלל">—</td></tr>`)
		+ `</tbody><caption>${esc(ip.registrar.indexed_he)}; הסכום המקוון הוא כפי שנגבה בשירות התשלומים הממשלתי, נבדק ${esc(isoToHe(ip.registrar.payments.checked_on))}.</caption></table></div></div>`;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-doc-h">מה מצרפים לבקשה (${r.documents.length})</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ol class="jt23-docs" aria-labelledby="${P}-doc-h">${r.documents.map((d) => `<li>${esc(d.he)}${cite(d.section, d.section.indexOf('תקנה') === 0 || d.section.indexOf('סעיף') === 0 ? ip.regulations_url : ip.online_rule.url)}</li>`).join('')}</ol></div>`;
	if (r.flags.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-fl-h">שימו לב</h3></div><ul class="jtool-flags" aria-labelledby="${P}-fl-h">${r.flags.map((f) => `<li>${esc(f.he)}${f.url ? cite('מקור', f.url) : ''}</li>`).join('')}</ul></div>`;
	}
	const dates = [];
	if (r.clock.originalWillBy) { dates.push([r.clock.originalWillBy, `מסירת הצוואה המקורית לרשם (${ip.days.online_original_will} ימים מההגשה המקוונת)`, ip.regulation_sections.online]); }
	if (r.clock.objectionsBy) { dates.push([r.clock.objectionsBy, `סוף תקופת ההתנגדויות (${ip.days.objection} ימים מהפרסום)`, ip.regulation_sections.publication]); }
	if (dates.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שבתקנות</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ dates.map(([d, what, rule]) => `<tr><td data-th="עד תאריך"><bdi>${isoToHe(d)}</bdi></td><td data-th="מה">${esc(what)}</td><td data-th="הכלל">${cite(rule, ip.regulations_url)}</td></tr>`).join('')
			+ `</tbody><caption>${esc(ip.days.objection_he)}. ${r.clock.daysLeft !== null ? `נשארו ${r.clock.daysLeft} ימים.` : ''}</caption></table></div></div>`;
	}
	return out;
}

export function checklist(reg, r) { return r.documents.map((d) => `${d.he} (${d.section})`); }

/** Page section: the three routes for the same case, side by side. */
export function compareTable(reg) {
	const by = tzByRoute(reg, EXAMPLE);
	const rows = TZ_ROUTES.map((k) => {
		const x = by[k];
		const total = !x ? '—' : x.lines.some((l) => l.amount === null) ? 'לפי תקנות בתי הדין' : ils(x.total, 0);
		const who = k === 'online' ? 'יורש בעצמו, או עורך דין (מייצג: מקוון בלבד)' : k === 'manual' ? 'יורש בעצמו; חובה כשיש אחים, אחיינים, סבים או דודים' : 'כל הנוגעים בדבר, בהסכמה בכתב';
		const clock = k === 'religious' ? 'לפי סדרי הדין של בית הדין' : `${reg.inheritance_process.days.objection} ימים להתנגדויות מהפרסום`;
		return `<tr><td data-th="המסלול">${esc(TZ_ROUTE_HE[k])}</td><td data-th="מי מגיש">${esc(who)}</td><td data-th="אגרה ופרסום">${total}</td><td data-th="השעון">${esc(clock)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>אותה בקשה (${EXAMPLE.heirs} יורשים, דירה בעיזבון) בשלושת המסלולים: האגרה כפי שנגבית בשירות התשלומים הממשלתי, ותקופת ההתנגדויות שבתקנה 17.</caption><thead><tr><th scope="col">המסלול</th><th scope="col">מי מגיש</th><th scope="col">אגרה ופרסום</th><th scope="col">השעון</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = tzBuild(reg, EXAMPLE);
	const ip = reg.inheritance_process;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.total,
		sticky: ils(r.total, 0),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>המסלול: מי שאינו מיוצג מגיש מקוון באגרה מופחתת של ${ip.registrar.online_pct}%${cite(ip.registrar.online_section, ip.registrar.url)}; כשיש אחים, אחיינים, סבים או דודים, ידנית בלבד${cite('הנחיות האפוטרופוס הכללי', ip.online_rule.url)}.</li>`
			+ `<li>האגרה: ${money(ip.registrar.items.order.amount, 0)} ₪ לבקשה${cite(ip.registrar.items.order.item, ip.registrar.url)}, ונגבית מקוון ${money(ip.registrar.payments.online_fee, 0)} ₪, ועוד הוצאות פרסום ${money(ip.registrar.payments.publication, 0)} ₪${cite(ip.regulation_sections.publication_cost, ip.regulations_url)}${cite('שירות התשלומים', ip.registrar.payments.url)}: ${money(r.total, 0)} ₪.</li>`
			+ `<li>המסמכים: ${r.documents.length} לפי המצב (תעודת פטירה, הודעה ליורשים, תצהיר הסתלקות, בקשה משולבת לטאבו)${cite(ip.regulation_sections.request, ip.regulations_url)}.</li>`
			+ `<li>השעון: פרסום, ו-${ip.days.objection} ימים להתנגדויות${cite(ip.regulation_sections.publication, ip.regulations_url)}; התנגדות מעבירה לבית המשפט לענייני משפחה${cite(ip.sections.to_court, ip.law_url)}; בלי התנגדות, הצו${cite(ip.regulation_sections.order_no_objection, ip.regulations_url)}.</li></ol>`,
		compare_table: compareTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

export function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const count = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : Number(v); };
	return {
		will: radio('will', 'none'), filer: radio('filer', 'self'), heirs: count('heirs'), relation: radio('rel', 'close'),
		idIsrael: !on('nid'), certificate: !on('nc'), abroad: on('ab'), renounce: count('ren'), renounceMinor: on('rm'), minor: on('mn'), predeceased: count('pre'),
		realEstate: on('re'), religious: on('rl'), exempt: on('ex'), filed: toIso(val(`#${P}-filed`)), publication: toIso(val(`#${P}-pub`)), today: ilToday(),
	};
}
export const stateOf = (i) => encodeState({ w: i.will === 'will' ? 1 : '', l: i.filer === 'lawyer' ? 1 : '', h: i.heirs || '', x: i.relation === 'extended' ? 1 : '', n: i.idIsrael === false ? 1 : '', c: i.certificate === false ? 1 : '', a: i.abroad ? 1 : '', r: i.renounce || '', k: i.renounceMinor ? 1 : '', m: i.minor ? 1 : '', d: i.predeceased || '', e: i.realEstate ? 1 : '', g: i.religious ? 1 : '', z: i.exempt ? 1 : '', f: i.filed || '', p: i.publication || '' });
export const KEYS = ['w', 'l', 'h', 'x', 'n', 'c', 'a', 'r', 'k', 'm', 'd', 'e', 'g', 'z', 'f', 'p'];
export function inputOf(s) {
	if (!s.h) { return null; }
	return {
		will: s.w === '1' ? 'will' : 'none', filer: s.l === '1' ? 'lawyer' : 'self', heirs: Number(s.h), relation: s.x === '1' ? 'extended' : 'close',
		idIsrael: s.n !== '1', certificate: s.c !== '1', abroad: s.a === '1', renounce: s.r ? Number(s.r) : 0, renounceMinor: s.k === '1', minor: s.m === '1', predeceased: s.d ? Number(s.d) : 0,
		realEstate: s.e === '1', religious: s.g === '1', exempt: s.z === '1', filed: s.f || '', publication: s.p || '',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const ip = reg.inheritance_process;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(ip.checked_on, ip.refresh_every_days) || (ip.next_update && today >= ip.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרות התעדכנו ב-1 בינואר'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const ids = { heirs: 'heirs', renounce: 'ren', predeceased: 'pre', filed: 'filed', publication: 'pub' };
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${ids[e.field] || e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${ids[e.field] || e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const run = (input, opts = {}) => {
		const r = tzBuild(reg, Object.assign({ today }, input));
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? (r.lines.some((l) => l.amount === null) ? '—' : ils(r.total, 0)) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.route }); }
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	} else {
		run(readForm(root), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	form.addEventListener('click', (ev) => {
		const b = ev.target.closest('[data-step]');
		if (!b) { return; }
		const input = root.querySelector(`#${P}-${b.getAttribute('data-step')}`);
		const max = Number(input.getAttribute('data-max')) || 30;
		const next = Math.max(0, Math.min(max, (Number(input.value) || 0) + Number(b.getAttribute('data-delta'))));
		input.value = String(next);
		schedule();
	});
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = tzBuild(reg, Object.assign({ today }, input));
		const link = shareUrl(stateOf(input));
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי תקנות הירושה ותקנות האגרות ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(ip.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(checklist(reg, r).map((x, i) => `${i + 1}. ${x}`).join('\n'));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'ics' && r.ok) {
			const events = [];
			if (r.clock.originalWillBy) { events.push({ date: r.clock.originalWillBy, summary: 'מסירת הצוואה המקורית לרשם לענייני ירושה', description: `${ip.days.online_original_will} ימים מההגשה המקוונת (תקנה 14). חושב ב-jus-tice.co.il.` }); }
			if (r.clock.objectionsBy) { events.push({ date: r.clock.objectionsBy, summary: `סוף תקופת ההתנגדויות לבקשה ל${r.orderHe}`, description: `${ip.days.objection} ימים מהפרסום (תקנה 17). חושב ב-jus-tice.co.il.` }); }
			if (r.clock.filed) { events.push({ date: r.clock.filed, summary: `הגשת הבקשה ל${r.orderHe}`, description: `${r.routeHe}. חושב ב-jus-tice.co.il.` }); }
			if (!events.length) { toast(root, 'מלאו את יום ההגשה או יום הפרסום כדי לקבל מועדים ליומן.'); return; }
			download('tzav-yerusha.ics', 'text/calendar;charset=utf-8', ics(events, new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.route : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, s); run(s); }
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
