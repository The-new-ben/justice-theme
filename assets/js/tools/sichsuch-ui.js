/**
 * Inheritance-wave UI: the inheritance-dispute navigator.
 * One picture from the subject: a crossroads. The quarrel stands in the middle; each road out of it is a route the law
 * opens, with its forum, its fee and its clock on the signpost; the first road to take is lit. The same renderers write
 * the server snapshot and the live page.
 */
import { scBuild, SC_ISSUES, SC_STAGES } from './sichsuch-engine.js';
import { parseDate } from './dates.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'sichsuch-yerusha';
const P = 'jt25';
export const EXAMPLE = { issues: ['apartment', 'control'], stage: 'issued', publication: '', heirs: 3, apartment: true, minor: false, willing: 'unknown', estate: '', share: '', barRef: false };
const ISSUE_KEYS = Object.keys(SC_ISSUES);
const TIMING = { now: 'פתוח עכשיו', later: 'אחרי הפרסום', late: 'עד 6 חודשים מהחלוקה' };
const SIM = { mediation: 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=inheritance', court_rehearsal: 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=court_rehearsal&topic=inheritance', witness_prep: 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=witness_prep&topic=inheritance' };
const REHEARSE_HE = { mediation: 'לתרגל את השיחה בין היורשים', court_rehearsal: 'לתרגל את הדיון', witness_prep: 'לתרגל את העדות' };

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const toIso = (text) => { const raw = String(text || '').trim(); if (!raw) { return ''; } return parseDate(raw) || raw; };
const feeHe = (f) => (f ? `${nis(f.amount)}` : 'בלי אגרה');

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, m) {
	const issues = m.issues || [];
	return `<fieldset class="jtool-field"><legend>על מה המחלוקת (אפשר כמה)</legend><div class="jtool-chips jt25-issues">${ISSUE_KEYS.map((k) => chip('is', k, SC_ISSUES[k], issues.includes(k), 'checkbox')).join('')}</div><p class="jtool-error" id="${P}-issues-e" role="alert"></p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>איפה התיק עומד</legend><div class="jtool-chips">${Object.keys(SC_STAGES).map((k) => chip('st', k, SC_STAGES[k], (m.stage || 'before') === k)).join('')}</div></fieldset>`
		+ `<div class="jtool-row"><div class="jtool-field" data-if-published${m.stage === 'published' ? '' : ' hidden'}><label class="jtool-label" for="${P}-pub">יום הפרסום של הבקשה</label><input id="${P}-pub" type="text" inputmode="numeric" autocomplete="off" placeholder="לדוגמה 11.10.2026" value="${esc(m.publication ? isoToHe(m.publication) : '')}" aria-describedby="${P}-publication-e"><p class="jtool-error" id="${P}-publication-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-heirs">כמה יורשים</label><input id="${P}-heirs" type="text" inputmode="numeric" autocomplete="off" value="${esc(m.heirs ?? 2)}" aria-describedby="${P}-heirs-e"><p class="jtool-error" id="${P}-heirs-e" role="alert"></p></div></div>`
		+ `<fieldset class="jtool-field"><legend>היורשים מוכנים לדבר</legend><div class="jtool-chips">${chip('wl', 'yes', 'כן, רוב היורשים', m.willing === 'yes')}${chip('wl', 'unknown', 'לא יודעים', !['yes', 'no'].includes(m.willing))}${chip('wl', 'no', 'לא, יש מי שמסרב לכל מגע', m.willing === 'no')}</div></fieldset>`
		+ `<div class="jtool-chips">${chip('ap', '1', 'יש דירה או קרקע בעיזבון', m.apartment, 'checkbox')}${chip('mn', '1', 'אחד היורשים קטין או חסוי', m.minor, 'checkbox')}${chip('bar', '1', 'להראות את התעריף המינימלי המומלץ של לשכת עורכי הדין', m.barRef, 'checkbox')}</div>`
		+ `<div class="jtool-row" data-if-bar${m.barRef ? '' : ' hidden'}><div class="jtool-field"><label class="jtool-label" for="${P}-est">שווי העיזבון, בערך</label><div class="jtool-input jtool-input--money"><input id="${P}-est" type="text" inputmode="decimal" autocomplete="off" value="${esc(m.estate ? money(m.estate, 0) : '')}" placeholder="לדוגמה 3,000,000" aria-describedby="${P}-estate-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-estate-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-sh">החלק שלכם באחוזים</label><input id="${P}-sh" type="text" inputmode="decimal" autocomplete="off" value="${esc(m.share || '')}" placeholder="לדוגמה 33" aria-describedby="${P}-share-e"><p class="jtool-error" id="${P}-share-e" role="alert"></p></div></div>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const f = r.first;
	const fee = f.fee ? `, אגרה ${nis(f.fee.amount)}` : f.feeCourt ? `, אגרה ${nis(f.feeCourt.amount)} בבית המשפט` : '';
	const open = r.routes.filter((x) => x.timing === 'now').length;
	const clock = r.clock.objectionsBy ? `; התנגדות עד ${isoToHe(r.clock.objectionsBy)}` : '';
	return `${r.stageHe}: ${open} מסלולים פתוחים עכשיו. הצעד הראשון: ${f.he} (${f.where}${fee})${clock}.`;
}

/** The crossroads: the quarrel in the middle, a signpost for each route; the first route lit. */
export function crossroads(reg, r) {
	const posts = r.routes.map((x) => {
		const lit = x.key === r.first.key;
		const fee = x.fee && x.feeCourt ? `${feeHe(x.fee)} / ${feeHe(x.feeCourt)}` : feeHe(x.fee || x.feeCourt);
		return `<li class="jt25-post${lit ? ' jt25-post--first' : ''}${x.timing !== 'now' ? ' jt25-post--later' : ''}"><span class="jt25-post__tag">${esc(TIMING[x.timing] || '')}</span><p class="jt25-post__t">${esc(x.he)}</p><p class="jt25-post__where">${esc(x.where)}</p><p class="jt25-post__meta"><span>${esc(fee)}</span><span>${esc(x.clock.split(';')[0].split('.')[0])}</span></p></li>`;
	}).join('');
	return `<div class="jt25-cross"><p class="jt25-cross__center"><span>המחלוקת</span>${r.issues.map((k) => `<b>${esc(SC_ISSUES[k].split(':')[0].split(' (')[0])}</b>`).join('')}</p><ol class="jt25-posts">${posts}</ol></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const band = r.clock.band;
	const state = band === 'passed' ? 'danger' : band === 'closing' ? 'warn' : 'ok';
	const label = band === 'passed' ? 'תקופת ההתנגדויות עברה' : band === 'closing' ? `נשארו ${r.clock.daysLeft} ימים להתנגד` : band === 'open' ? `נשארו ${r.clock.daysLeft} ימים להתנגד` : r.stageHe;
	const open = r.routes.filter((x) => x.timing === 'now').length;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--${state}">${state === 'ok' ? '✓' : '!'} ${esc(label)}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה: ' : ''}מסלולים פתוחים עכשיו</p>`
		+ `<strong class="jtool-verdict__figure"><bdi>${open}</bdi> <span class="jt25-of">מתוך ${r.routes.length}</span></strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p></div>`
		+ crossroads(reg, r);
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const ip = reg.inheritance_process;
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-rt-h">המסלולים, אחד אחרי השני</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-map">העתקת המפה</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-rt-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">המסלול</th><th scope="col">איפה</th><th scope="col">אגרה</th><th scope="col">השעון</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.routes.map((x) => `<tr${x.key === r.first.key ? ' class="jt25-row--first"' : ''}><td data-th="המסלול"><strong>${esc(x.he)}</strong><br><small>${esc(x.why)}</small></td><td data-th="איפה">${esc(x.where)}</td><td data-th="אגרה">${x.fee ? `${ils(x.fee.amount, 0)}${cite(x.fee.item, x.fee.url)}` : ''}${x.fee && x.feeCourt ? '<br>' : ''}${x.feeCourt ? `${ils(x.feeCourt.amount, 0)}${cite(x.feeCourt.item, x.feeCourt.url)}` : ''}${!x.fee && !x.feeCourt ? 'בלי אגרה' : ''}</td><td data-th="השעון">${esc(x.clock)}</td><td data-th="הכלל">${esc(x.sections)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(ip.family_court.indexed_he)}; ${esc(ip.registrar.indexed_he)}.</caption></table></div></div>`;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-ev-h">מה אוספים לכל מסלול</h3></div>`
		+ r.routes.map((x) => `<details class="jtool-more"${x.key === r.first.key ? ' open' : ''}><summary>${esc(x.he)}</summary><ul class="jt25-ev">${x.evidence.map((e) => `<li>${esc(e)}</li>`).join('')}</ul><p class="jtool-hint"><a href="${esc(SIM[x.rehearse])}" target="_blank" rel="noopener" data-act="rehearse">${esc(REHEARSE_HE[x.rehearse])}</a> בסימולציה, לפני שזה קורה באמת.</p></details>`).join('')
		+ '</div>';
	if (r.barRef) {
		const b = r.barRef;
		const rows = [
			[`בקשה לצו${b.estate !== null ? ` על עיזבון של ${nis(b.estate)}` : ''}: ${reg.will_cost.bar.probate_pct}%, לפחות ${nis(reg.will_cost.bar.probate_min)}`, b.probate, b.barItems.probate],
			[`אותה בקשה כשיש התנגדות: +${reg.will_cost.bar.objection_add_pct}%`, b.objection, b.items.objection],
			['כל דיון נוסף', b.hearing, b.items.hearing],
			[`פירוק שיתוף בדירה: ${ip.bar.partition_pct}% מחלקכם${b.share !== null && b.estate !== null ? ` (${b.share}% מ-${nis(b.estate)})` : ''}, לפחות ${nis(ip.bar.partition_min)}`, b.partition, b.items.partition],
			['תביעה שאינה ניתנת להערכה בכסף (הצהרה, חשבונות)', b.nonmonetary, b.items.nonmonetary],
			['בקשת ביניים', b.interim, b.items.interim],
		];
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-bar-h">התעריף המינימלי המומלץ של לשכת עורכי הדין</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-bar-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">השירות</th><th scope="col">לפני מע"מ</th><th scope="col">עם מע"מ ${b.vatPct}%</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ rows.map(([t, v, item]) => `<tr><td data-th="השירות">${esc(t)}</td><td data-th="לפני מע&quot;מ">${ils(v, v % 1 ? 2 : 0)}</td><td data-th="עם מע&quot;מ">${ils(b.withVat(v), 0)}</td><td data-th="הכלל">${cite(item, b.url)}</td></tr>`).join('')
			+ `</tbody><caption>${esc(b.note)}.</caption></table></div></div>`;
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-fl-h">שימו לב</h3></div><ul class="jtool-flags" aria-labelledby="${P}-fl-h">${r.flags.map((f) => `<li>${esc(f.he)}${f.url ? cite('מקור', f.url) : ''}</li>`).join('')}</ul></div>`;
	return out;
}

export function mapText(reg, r) {
	return r.routes.map((x, i) => `${i + 1}. ${x.he}: ${x.where}. אגרה: ${x.fee ? nis(x.fee.amount) : ''}${x.fee && x.feeCourt ? ' / ' : ''}${x.feeCourt ? nis(x.feeCourt.amount) : ''}${!x.fee && !x.feeCourt ? 'אין' : ''}. השעון: ${x.clock}. (${x.sections})`).join('\n');
}

/** Page section: the four stages, which routes each one keeps open (same quarrel: a flat and a will in doubt). */
export function compareTable(reg) {
	const rows = Object.keys(SC_STAGES).map((st) => {
		const x = scBuild(reg, { issues: ['will', 'apartment'], stage: st, heirs: 3, apartment: true, willing: 'unknown' });
		const open = x.routes.filter((q) => q.timing === 'now').map((q) => q.he);
		return `<tr><td data-th="השלב">${esc(SC_STAGES[st])}</td><td data-th="פתוח עכשיו">${open.map((h) => esc(h)).join('; ')}</td><td data-th="הצעד הראשון">${esc(x.first.he)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>אותו סכסוך (צוואה שמפקפקים בה ודירה משותפת, שלושה יורשים) בארבעת השלבים של התיק: מה עוד אפשר לעשות בכל שלב, ומה הצעד הראשון כשלא ידוע אם היורשים מוכנים לדבר.</caption><thead><tr><th scope="col">השלב</th><th scope="col">פתוח עכשיו</th><th scope="col">הצעד הראשון</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = scBuild(reg, EXAMPLE);
	const ip = reg.inheritance_process;
	const open = r.routes.filter((x) => x.timing === 'now').length;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: open,
		sticky: `<bdi>${open}</bdi>`,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>המחלוקת (דירה משותפת, יורש ששולט בכסף) פותחת מסלולים: הסכם בין היורשים${cite(ip.sections.division_agreement, ip.law_url)}, גישור${cite('סעיף 79ג לחוק בתי המשפט', ip.courts.mediation_url)}, פירוק שיתוף${cite(ip.land_law.partition_right, ip.land_law.url)}, מנהל עיזבון${cite(ip.sections.manager, ip.law_url)}, ותביעה להצהרה ולחשבונות${cite(ip.sections.heirs_together, ip.law_url)}.</li>`
			+ `<li>השלב (הצו ניתן, העיזבון טרם חולק) סוגר את ההתנגדות${cite(ip.sections.publication, ip.law_url)} ופותח תיקון או ביטול של הצו${cite(ip.sections.amend, ip.law_url)}.</li>`
			+ `<li>האגרות: מנהל עיזבון ${money(ip.registrar.items.manager.amount, 0)} ₪ אצל הרשם${cite(ip.registrar.items.manager.item, ip.registrar.url)} או ${money(ip.family_court.items.manager.amount, 0)} ₪ בבית המשפט${cite(ip.family_court.items.manager.item, ip.family_court.url)}; תביעה בענייני רכוש ${money(ip.family_court.items.property.amount, 0)} ₪${cite(ip.family_court.items.property.item, ip.family_court.url)}.</li>`
			+ `<li>הצעד הראשון: כשלא ידוע אם היורשים מוכנים לדבר, גישור לפני כל תביעה; כשיש מי שמסרב לכל מגע, המסלול המשפטי הראשון שפתוח.</li></ol>`,
		compare_table: compareTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

export function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const issues = Array.from(root.querySelectorAll(`input[name="${P}-is"]:checked`)).map((e) => e.value);
	const h = val(`#${P}-heirs`).trim();
	const sh = val(`#${P}-sh`).trim();
	return {
		issues, stage: radio('st', 'before'), publication: toIso(val(`#${P}-pub`)), heirs: h === '' ? '' : Number(h), apartment: on('ap'), minor: on('mn'),
		willing: radio('wl', 'unknown'), barRef: on('bar'), estate: !on('bar') || val(`#${P}-est`).trim() === '' ? '' : parseMoney(val(`#${P}-est`)), share: !on('bar') || sh === '' ? '' : Number(sh), today: ilToday(),
	};
}
export const stateOf = (i) => encodeState({ i: (i.issues || []).map((k) => ISSUE_KEYS.indexOf(k)).filter((n) => n >= 0).join('.'), s: i.stage || 'before', p: i.publication || '', h: i.heirs || '', a: i.apartment ? 1 : '', m: i.minor ? 1 : '', w: i.willing === 'yes' ? 1 : i.willing === 'no' ? 2 : '', b: i.barRef ? 1 : '', e: i.estate || '', r: i.share || '' });
export const KEYS = ['i', 's', 'p', 'h', 'a', 'm', 'w', 'b', 'e', 'r'];
export function inputOf(s) {
	if (s.i === undefined) { return null; }
	return {
		issues: String(s.i).split('.').filter((x) => x !== '').map((n) => ISSUE_KEYS[Number(n)]).filter(Boolean), stage: SC_STAGES[s.s] ? s.s : 'before', publication: s.p || '', heirs: s.h ? Number(s.h) : 2,
		apartment: s.a === '1', minor: s.m === '1', willing: s.w === '1' ? 'yes' : s.w === '2' ? 'no' : 'unknown', barRef: s.b === '1', estate: s.e ? Number(s.e) : '', share: s.r ? Number(s.r) : '',
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
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרות התעדכנו'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const ids = { publication: 'pub', estate: 'est', share: 'sh', heirs: 'heirs' };
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${ids[e.field] || e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const st = (root.querySelector(`input[name="${P}-st"]:checked`) || {}).value || 'before';
		form.querySelectorAll('[data-if-published]').forEach((el) => { el.hidden = st !== 'published'; });
		form.querySelectorAll('[data-if-bar]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-bar"]:checked`); });
	};
	const run = (input, opts = {}) => {
		const r = scBuild(reg, Object.assign({ today }, input));
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? `<bdi>${r.routes.filter((x) => x.timing === 'now').length}</bdi>` : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.first.key }); }
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(fromHash, { silent: true });
	} else {
		sync();
		run(readForm(root), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = scBuild(reg, Object.assign({ today }, input));
		const link = shareUrl(stateOf(input));
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק הירושה ותקנות האגרות ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(ip.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy-map' && r.ok) {
			const ok = await copyText(mapText(reg, r));
			toast(root, ok ? 'המפה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'ics' && r.ok) {
			if (!r.clock.objectionsBy) { toast(root, 'כשהבקשה פורסמה, מלאו את יום הפרסום כדי לקבל את המועד ליומן.'); return; }
			download('hitnagdut.ics', 'text/calendar;charset=utf-8', ics([{ date: r.clock.objectionsBy, summary: 'סוף תקופת ההתנגדויות לבקשה לצו', description: `${ip.days.objection} ימים מהפרסום (תקנה 17). חושב ב-jus-tice.co.il.` }], new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.first.key : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, s); sync(); run(s); }
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
