/**
 * The rights wave UI (21.10.2026): maternity allowance and the birth grant (dmei-leida). The picture is the leave calendar
 * an employer and the Institute both keep: a card per week from the stop day, a cell per day (the paid days before and
 * after the birth, the extensions, the partner's days, the unpaid weeks of the job-protected leave, the 60 days of
 * protection after the return), with the birth day, the last paid day and the return marked. The tables, the checklist
 * and the .ics say the same in text.
 */
import { compute, byWage, baseMonths, monthHe, togetherCap, WHO, SENIORITY, PARTNER } from './leida-engine.js';
import { addDays, daysBetween } from './dates.js';
import {
	esc, ils, money, num, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'dmei-leida';
const P = 'jt32';

export const EXAMPLE = {
	who: 'employee', m14: 12, m22: '', sm14: '', sm22: '', wageMode: 'same', wage: 15000, wages: [], selfIncome: '', selfPrev: '',
	stop: '2026-12-01', birth: '2026-12-08', babies: 1, order: 2, seniority: 'gte12', momHosp: 0, babyHosp: 0, complex: false,
	partner: 'none', pdays: '', pwage: '', pq: true,
};

const WHO_LABEL = { employee: 'שכירה', self: 'עצמאית', both: 'גם שכירה וגם עצמאית' };
const SEN_LABEL = { lt6: 'פחות מ-6 חודשים', '6to12': '6 עד 12 חודשים', gte12: '12 חודשים ומעלה' };
const PARTNER_LABEL = { none: 'בלי', together: 'יחד עם היולדת', swap: 'במקום היולדת' };
const BABY_LABEL = { 1: 'תינוק אחד', 2: 'תאומים', 3: 'שלישייה', 4: 'רביעייה', 5: 'חמישייה' };
const ORDER_LABEL = { 1: 'ראשון', 2: 'שני', 3: 'שלישי ואילך' };
const MARK = { bad: '✕', warn: '!', info: 'i' };
const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const mn = (n) => money(n, Math.round(n * 100) % 100 ? 2 : 0);
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const dm = (iso) => { const [, m, d] = iso.split('-').map(Number); return `${d}.${m}`; };

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
const filled = (v) => !(v === '' || v === undefined || v === null || Number.isNaN(v));

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const lq = reg.rights_leida;
	const q = lq.qualify;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const field = (id, label, value, ph, mode = 'numeric') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="${mode}" autocomplete="off" value="${esc(filled(value) ? String(value) : '')}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const moneyField = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(filled(value) ? money(value, value % 1 ? 2 : 0) : '')}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const who = WHO.includes(input.who) ? input.who : 'employee';
	const emp = who !== 'self';
	const each = input.wageMode === 'each';
	const stopIso = toIso(input.stop);
	const labels = /^\d{4}-\d{2}-\d{2}$/.test(stopIso) ? baseMonths(stopIso).map(monthHe) : ['החודש הראשון', 'השני', 'השלישי', 'הרביעי', 'החמישי', 'השישי (האחרון)'];
	const wages = Array.isArray(input.wages) ? input.wages : [];
	const babies = Number(input.babies) || 1;
	const order = Number(input.order) || 1;
	const sen = SENIORITY.includes(input.seniority) ? input.seniority : 'gte12';
	const partner = PARTNER.includes(input.partner) ? input.partner : 'none';
	const m14 = Number(input.m14);
	const sm14 = Number(input.sm14);
	const open = Number(input.momHosp) > 0 || Number(input.babyHosp) > 0 || input.complex === true || partner !== 'none';
	return `<fieldset class="jtool-field"><legend>עבדת לפני הלידה</legend><div class="jtool-chips">${WHO.map((k) => chip('who', k, WHO_LABEL[k], who === k)).join('')}</div><p class="jtool-error" id="${P}-who-e" role="alert"></p></fieldset>`
		+ `<div class="jtool-row">${field('m14', `${who === 'both' ? 'כשכירה: ' : ''}בכמה מ-${q.full_window} החודשים שלפני הפסקת העבודה שולמו דמי ביטוח`, input.m14, `0 עד ${q.full_window}`)}`
		+ `<div data-if-m22${m14 >= q.full_months ? ' hidden' : ''}>${field('m22', `ובכמה מ-${q.full_alt_window} החודשים`, input.m22, 'לא חובה')}</div></div>`
		+ `<div class="jtool-row" data-if-who="both"${who === 'both' ? '' : ' hidden'}>${field('sm14', `כעצמאית: בכמה מ-${q.full_window} החודשים`, input.sm14, `0 עד ${q.full_window}`)}<div data-if-sm22${sm14 >= q.full_months ? ' hidden' : ''}>${field('sm22', `ובכמה מ-${q.full_alt_window} החודשים`, input.sm22, 'לא חובה')}</div></div>`
		+ `<p class="jtool-hint">${esc(q.partial_month_he)}. ${num(q.full_months, 0)} מתוך ${q.full_window} (או ${num(q.full_alt_months, 0)} מתוך ${q.full_alt_window}): ${num(q.full_days, 0)} ימים; ${num(q.partial_months, 0)} מתוך ${q.partial_window}: ${num(q.partial_days, 0)} ימים (${esc(q.full_section)}).</p>`
		+ `<fieldset class="jtool-field" data-if-emp${emp ? '' : ' hidden'}><legend>השכר ברוטו ב-6 החודשים שלפני חודש הפסקת העבודה</legend><div class="jtool-chips">${chip('wm', 'same', 'אותו שכר בכל החודשים', !each)}${chip('wm', 'each', 'שכר שונה בכל חודש', each)}</div>`
		+ `<div data-if-wm="same"${each ? ' hidden' : ''} style="margin-top:8px">${moneyField('wage', 'שכר חודשי ברוטו', input.wage, 'לדוגמה: 15,000')}</div>`
		+ `<div class="${P}-six" data-if-wm="each"${each ? '' : ' hidden'}>${labels.map((l, i) => `<div data-w="${i}">${moneyField(`w${i}`, l, wages[i], 'ברוטו')}</div>`).join('')}</div>`
		+ `<p class="jtool-hint">${esc(lq.base.he)} (${esc(lq.base.section)}).</p></fieldset>`
		+ `<div class="jtool-row" data-if-self${emp && who !== 'both' ? ' hidden' : ''}>${moneyField('si', 'עצמאית: ההכנסה החודשית שעליה שולמו המקדמות', input.selfIncome, 'לדוגמה: 12,000')}${moneyField('sp', 'ההכנסה השנתית בשומה של השנה הקודמת', input.selfPrev, 'לא חובה')}</div>`
		+ `<div class="jtool-row">${field('stop', 'יום הפסקת העבודה', isoToHe(stopIso), 'לדוגמה: 1.12.2026')}${field('birth', 'יום הלידה (המשוער)', isoToHe(toIso(input.birth)), 'לדוגמה: 8.12.2026')}</div>`
		+ `<fieldset class="jtool-field"><legend>בלידה הזאת</legend><div class="jtool-chips">${[1, 2, 3, 4, 5].map((n) => chip('bb', n, BABY_LABEL[n], babies === n)).join('')}</div><p class="jtool-error" id="${P}-babies-e" role="alert"></p></fieldset>`
		+ `<fieldset class="jtool-field" data-if-one${babies === 1 ? '' : ' hidden'}><legend>איזה ילד במשפחה (למענק הלידה)</legend><div class="jtool-chips">${[1, 2, 3].map((n) => chip('ord', n, ORDER_LABEL[n], order === n)).join('')}</div><p class="jtool-error" id="${P}-order-e" role="alert"></p></fieldset>`
		+ `<fieldset class="jtool-field" data-if-emp${emp ? '' : ' hidden'}><legend>כמה זמן עבדת אצל המעסיק הנוכחי</legend><div class="jtool-chips">${SENIORITY.map((k) => chip('sen', k, SEN_LABEL[k], sen === k)).join('')}</div><p class="jtool-error" id="${P}-sen-e" role="alert"></p>`
		+ `<p class="jtool-hint">${esc(lq.leave.he)} (${esc(lq.leave.section)}); ${esc(lq.leave.short_he)}.</p></fieldset>`
		+ `<details class="jtool-more"${open ? ' open' : ''}><summary>אשפוז, מוגבלות, ובן הזוג בחופשה</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${field('mh', 'ימי אשפוז של היולדת', Number(input.momHosp) ? input.momHosp : '', '0')}${field('bh', 'ימי אשפוז של התינוק', Number(input.babyHosp) ? input.babyHosp : '', '0')}</div>`
		+ `<p class="jtool-hint">${esc(lq.hosp.mother_he)}. ${esc(lq.hosp.baby_he)}.</p>`
		+ `<div class="jtool-chips">${chip('cx', '1', 'התינוק הוכר כילד עם מוגבלות מורכבת', input.complex === true, 'checkbox')}</div>`
		+ `<fieldset class="jtool-field" style="margin-top:8px"><legend>בן הזוג בחופשה</legend><div class="jtool-chips">${PARTNER.map((k) => chip('pt', k, PARTNER_LABEL[k], partner === k)).join('')}</div>`
		+ `<div data-if-partner${partner === 'none' ? ' hidden' : ''}><div class="jtool-row" style="margin-top:8px">${field('pd', 'כמה ימים בן הזוג בחופשה', input.pdays, 'לפחות 7')}${moneyField('pw', 'השכר החודשי ברוטו של בן הזוג', input.pwage, 'לדוגמה: 18,000')}</div>`
		+ `<div class="jtool-chips">${chip('pq', '1', 'לבן הזוג 10 מתוך 14 חודשי ביטוח (או 15 מתוך 22)', input.pq !== false, 'checkbox')}</div>`
		+ `<p class="jtool-hint">${esc(lq.partner.together_he)}. ${esc(lq.partner.swap_he)}.</p></div></fieldset></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const lq = reg.rights_leida;
	const grant = `מענק לידה ${nis(r.grant.amount)}.`;
	if (!r.eligible) {
		return `אין זכאות לדמי לידה: חסרים חודשי ביטוח (צריך ${lq.qualify.partial_months} מתוך ${lq.qualify.partial_window} ל-${lq.qualify.partial_days} ימים). ${grant}${r.leave ? ` תקופת הלידה וההורות קיימת גם בלי דמי לידה: עד ${isoToHe(r.leave.end)}.` : ''}`;
	}
	const parts = [`דמי לידה של ${nis(r.daily)} ליום${r.capped ? ' (המקסימום)' : ''} ל-${r.paidDays} ימים: ${nis(r.total)} ברוטו${r.partnerDays ? `, מהם ${nis(r.partnerTotal)} לבן הזוג` : ''}, בתשלום אחד.`];
	parts.push(grant);
	parts.push(`בתשלום ${isoToHe(r.paidStart)} עד ${isoToHe(r.paidEnd)}${r.leave ? `; החופשה עד ${isoToHe(r.leave.motherEnd)}, וההגנה מפיטורים עד ${isoToHe(r.leave.protectEnd)}` : ''}.`);
	return parts.join(' ');
}

/** The leave calendar: a card per week from the stop day, a cell per day. */
function calendar(reg, r) {
	const lq = reg.rights_leida;
	const kinds = {
		gap: 'לפני תחילת התשלום', pre: 'דמי לידה, לפני הלידה', paid: 'דמי לידה', ext: 'הארכה בתשלום',
		partner: r.partner === 'swap' ? 'בן הזוג, במקום היולדת' : 'בן הזוג, יחד עם היולדת', unpaid: 'חופשה בלי תשלום, המשרה שמורה',
		protect: `${lq.protect.after_days} ימי הגנה מפיטורים`,
	};
	const back = r.leave ? r.leave.back : null;
	const cards = r.weeks.map((w) => {
		const cells = w.cells.map((c) => {
			let cls = `${P}-c ${P}-c--${c.k}`;
			if (c.prot) { cls += ` ${P}-c--prot`; }
			if (c.birth) { cls += ` ${P}-c--birth`; }
			if (c.d === r.paidEnd) { cls += ` ${P}-c--end`; }
			if (c.d === back) { cls += ` ${P}-c--back`; }
			return `<i class="${cls}"></i>`;
		}).join('');
		const has = (d) => d && w.cells.some((c) => c.d === d);
		const mark = has(r.birth) ? 'לידה' : has(r.paidEnd) ? 'סוף התשלום' : has(back) ? 'חזרה' : r.leave && has(r.leave.protectEnd) ? 'סוף ההגנה' : '';
		return `<li class="${P}-wk${mark ? ` ${P}-wk--mark` : ''}"><span class="${P}-wk__n">${w.n}</span><span class="${P}-wk__d">${esc(dm(w.start))}</span><span class="${P}-wk__days" aria-hidden="true">${cells}</span>${mark ? `<span class="${P}-wk__m">${esc(mark)}</span>` : ''}</li>`;
	}).join('');
	const used = new Set();
	r.weeks.forEach((w) => w.cells.forEach((c) => used.add(c.k)));
	const legend = ['pre', 'paid', 'ext', 'partner', 'unpaid', 'protect', 'gap'].filter((k) => used.has(k)).map((k) => `<span><i class="${P}-c ${P}-c--${k}"></i>${esc(kinds[k])}</span>`).join('')
		+ `<span><i class="${P}-c ${P}-c--paid ${P}-c--birth"></i>יום הלידה</span>`;
	const label = `יומן החופשה לפי שבועות מיום הפסקת העבודה: ${r.eligible ? `דמי לידה ${isoToHe(r.paidStart)} עד ${isoToHe(r.paidEnd)}` : 'בלי דמי לידה'}${r.leave ? `, חופשה עד ${isoToHe(r.leave.motherEnd)}, הגנה עד ${isoToHe(r.leave.protectEnd)}` : ''}`;
	return `<div class="${P}-cal" role="group" aria-label="${esc(label)}"><p class="${P}-cal__h">יומן החופשה, שבוע אחרי שבוע מיום הפסקת העבודה (${esc(isoToHe(r.stop))})</p><ol class="${P}-cal__wks">${cards}</ol>`
		+ `<p class="${P}-cal__legend">${legend}</p></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const lq = reg.rights_leida;
	const state = !r.eligible ? '<p class="jtool-state jtool-state--danger">✕ אין זכאות לדמי לידה</p>' : r.tier === 'partial' ? `<p class="jtool-state jtool-state--warn">! דמי לידה חלקיים, ${lq.qualify.partial_days} ימים</p>` : `<p class="jtool-state jtool-state--ok">✓ דמי לידה מלאים, ${lq.qualify.full_days} ימים${r.extDays ? ' ועוד הארכה' : ''}</p>`;
	let out = `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}דמי לידה, סך הכול ברוטו</p>`
		+ `<strong class="jtool-verdict__figure">${ilsn(r.total)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>ליום</dt><dd>${r.eligible ? ilsn(r.daily) : '—'}</dd></div><div><dt>ימים בתשלום</dt><dd>${num(r.paidDays, 0)}</dd></div><div><dt>מענק לידה</dt><dd>${ilsn(r.grant.amount)}</dd></div><div><dt>${r.leave ? 'החזרה לעבודה' : 'היום האחרון'}</dt><dd>${r.leave ? `<bdi>${esc(isoToHe(r.leave.back))}</bdi>` : r.paidEnd ? `<bdi>${esc(isoToHe(r.paidEnd))}</bdi>` : '—'}</dd></div></dl></div>`;
	out += calendar(reg, r);
	const flags = r.flags.filter((x) => x.level !== 'info');
	if (flags.length) { out += `<ul class="jtool-flags">${flags.map((x) => `<li><strong aria-hidden="true">${MARK[x.level]}</strong> ${esc(x.he)}</li>`).join('')}</ul>`; }
	return out;
}

export function checklist(reg, r) {
	const lq = reg.rights_leida;
	const c = lq.claim;
	const out = [];
	if (r.who !== 'self') {
		out.push({ he: `${c.employer_he}`, section: `טופס ${c.employer_form}`, url: c.url });
		out.push({ he: c.sms_he, section: 'איך להגיש תביעה', url: c.url });
	}
	out.push({ he: `אם דמי הלידה לא שולמו אוטומטית: תביעה מקוונת, טופס ${c.form} (${c.online_he}), לכל המאוחר ${c.deadline_months} חודשים מהפסקת העבודה`, section: `טופס ${c.form}`, url: c.form_url });
	c.auto_he.forEach((x, i) => { if ((i === 0 && r.who !== 'employee') || i === 1) { out.push({ he: x, section: 'תביעה אוטומטית', url: c.url }); } });
	c.docs_he.forEach((x, i) => { if (i === 0 || i === 2 || i === 5 || (i === 1 && r.wageMode === 'each')) { out.push({ he: x, section: 'המסמכים לתביעה', url: c.gov_url }); } });
	if (r.partnerDays) { out.push({ he: `בן הזוג מגיש תביעה לדמי לידה לאב, טופס ${lq.partner.form}, אחרי שהפסיק לעבוד; ${lq.partner.notify_he}`, section: `טופס ${lq.partner.form}`, url: lq.partner.claim_url }); }
	if (r.hospExt || r.complexExt) { out.push({ he: lq.hosp.claim_he, section: lq.hosp.section, url: lq.hosp.url }); }
	out.push({ he: `מענק הלידה: ${lq.grant.paid_he}`, section: lq.grant.section, url: lq.grant.claim_url });
	if (r.leave) { out.push({ he: `להודיע למעסיק על יום החזרה (${isoToHe(r.leave.back)}); ${lq.protect.after_he}`, section: lq.protect.after_section, url: lq.protect.url }); }
	return out;
}
export function checklistText(reg, r) { return checklist(reg, r).map((x, i) => `${i + 1}. ${x.he} (${x.section})`).join('\n'); }

/** The leave in text: every stretch of the calendar with its dates and its rule. */
export function periods(reg, r) {
	const lq = reg.rights_leida;
	const out = [];
	const seg = (from, to, he, section, url) => { if (from && to && from <= to) { out.push({ from, to, he, section, url }); } };
	const lv = lq.leave;
	if (r.eligible) {
		if (r.stop < r.paidStart) { seg(r.stop, addDays(r.paidStart, -1), 'הפסקת לעבוד, אבל דמי הלידה עוד לא התחילו', lq.start.section, lq.start.url); }
		const baseEnd = addDays(r.paidStart, r.baseDays - 1);
		const motherEnd = r.partnerStart ? addDays(r.partnerStart, -1) : r.paidEnd;
		seg(r.paidStart, baseEnd < motherEnd ? baseEnd : motherEnd, `דמי לידה ליולדת, ${nis(r.daily)} ליום`, r.tier === 'full' ? lq.qualify.full_section : lq.qualify.partial_section, lq.pages.amount);
		if (r.extDays) { seg(addDays(baseEnd, 1), motherEnd, `הארכה בתשלום${r.multipleExt ? `, ${r.babies} תינוקות` : ''}${r.hospExt ? ', אשפוז' : ''}${r.complexExt ? ', מוגבלות מורכבת' : ''}`, r.multipleExt ? lq.multiple.section : lq.hosp.section, lq.pages.period); }
		if (r.partnerStart) { seg(r.partnerStart, r.paidEnd, `בן הזוג ${r.partner === 'swap' ? 'במקום היולדת' : 'יחד עם היולדת'}, ${nis(r.partnerDaily)} ליום`, r.partner === 'swap' ? lq.partner.section : lq.partner.together_section, lq.partner.url); }
	}
	if (r.leave) {
		seg(r.eligible ? addDays(r.paidEnd, 1) : r.leave.start, r.leave.motherEnd, 'חופשה בלי תשלום, המשרה שמורה ואסור לפטר', r.leave.weeks === lv.weeks ? lv.section : lv.short_section, lv.url);
		seg(r.leave.back, r.leave.protectEnd, `${lq.protect.after_days} ימים אחרי החזרה: פיטורים רק בהיתר`, lq.protect.after_section, lq.protect.url);
	}
	return out;
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const lq = reg.rights_leida;
	const btl = reg.rights_btl;
	const b = lq.base;
	const bm = r.baseMonths;
	let out = '';
	// 1. The calculation, line by line.
	const rows = [];
	if (r.emp) {
		rows.push([`השכר ב-3 החודשים (${esc(monthHe(bm[3]))} עד ${esc(monthHe(bm[5]))})`, ilsn(r.emp.sumShort), `החודשים המלאים שלפני חודש הפסקת העבודה${cite(b.section, lq.law_url)}`]);
		rows.push([`<bdi>${mn(r.emp.sumShort)} ÷ ${b.divisor_short}</bdi>`, ilsn(r.emp.short), `ליום${r.emp.basis === 'short' ? ', הגבוה' : ''}`]);
		rows.push([`השכר ב-6 החודשים (${esc(monthHe(bm[0]))} עד ${esc(monthHe(bm[5]))})`, ilsn(r.emp.sumLong), `החלופה${cite('סכום דמי הלידה', b.url)}`]);
		rows.push([`<bdi>${mn(r.emp.sumLong)} ÷ ${b.divisor_long}</bdi>`, ilsn(r.emp.long), `ליום${r.emp.basis === 'long' ? ', הגבוה' : ''}`]);
	}
	if (r.self) {
		rows.push([`עצמאית: <bdi>${mn(r.selfIncome)} × ${b.months_short} = ${mn(r.self.quarter)}</bdi>`, ilsn(r.self.quarter), `ההכנסה של המקדמות ברבע השנה${cite(b.self_section, lq.law_url)}`]);
		rows.push([`<bdi>${mn(r.self.quarter)} ÷ ${b.divisor_short}</bdi>`, ilsn(r.self.short), `ליום${r.self.basis === 'short' ? ', הגבוה' : ''}`]);
		if (r.self.prev !== null) { rows.push([`השומה הקודמת: <bdi>${mn(r.selfPrev)} ÷ ${b.self_quarters} ÷ ${b.divisor_short}</bdi>`, ilsn(r.self.prev), `רבע שנה בשנה הקודמת${r.self.basis === 'prev' ? ', הגבוה' : ''}${cite(b.self_section, lq.law_url)}`]); }
	}
	if (r.who === 'both') { rows.push(['סך שתי ההכנסות ליום', ilsn(r.rawBoth), `רק מעבודה שעומדת בתנאי${cite('תביעה לתשלום דמי לידה', lq.qualify.both_url)}`]); }
	rows.push(['המקסימום ליום', ilsn(r.max), `<bdi>${money(btl.basic_amount.b1, 0)} × ${lq.max.b1_mult} ÷ ${lq.max.divisor}</bdi>, הסכום הבסיסי${cite(lq.max.section, lq.law_url)}${cite('סכום דמי הלידה', lq.max.url)}`]);
	if (r.eligible) {
		rows.push(['דמי לידה ליום', ilsn(r.daily), r.capped ? 'המקסימום' : 'לפי ההכנסה']);
		if (r.split) { rows.push([`ליום, מיום ${r.shortDays + 1}`, ilsn(r.dailyLong), `רק העבודה עם ${lq.qualify.full_days} הימים${cite(lq.qualify.full_section, lq.qualify.url)}`]); }
		rows.push(['ימים', num(r.baseDays, 0), `${r.tier === 'full' ? `${lq.qualify.full_weeks} שבועות` : `${lq.qualify.partial_weeks} שבועות`}${cite(r.tier === 'full' ? lq.qualify.full_section : lq.qualify.partial_section, lq.qualify.period_url)}`]);
		if (r.multipleExt) { rows.push([`עוד ${r.babies - 1} ${r.babies - 1 === 1 ? 'תינוק' : 'תינוקות'} בלידה`, `+${num(r.multipleExt, 0)}`, `${r.tier === 'full' ? 3 : 2} שבועות לכל תינוק נוסף${cite(lq.multiple.section, lq.multiple.url)}`]); }
		if (r.momExt) { rows.push([`אשפוז היולדת, ${r.momHosp} ימים`, `+${num(r.momExt, 0)}`, `עד ${r.tier === 'full' ? lq.hosp.mother_full : lq.hosp.mother_partial} ימים${cite(lq.hosp.section, lq.hosp.url)}`]); }
		if (r.babyExt) { rows.push([`אשפוז התינוק, ${r.babyHosp} ימים`, `+${num(r.babyExt, 0)}`, `עד ${r.tier === 'full' ? lq.hosp.baby_full : lq.hosp.baby_partial} ימים${cite(lq.hosp.section, lq.hosp.gov_url)}`]); }
		if (r.momExt + r.babyExt > r.hospExt) { rows.push(['תקרת הארכות האשפוז', `−${num(r.momExt + r.babyExt - r.hospExt, 0)}`, `יחד עד ${r.tier === 'full' ? lq.hosp.total_full : lq.hosp.total_partial} ימים${cite(lq.hosp.section, lq.law_url)}`]); }
		if (r.complexExt) { rows.push(['מוגבלות מורכבת', `+${num(r.complexExt, 0)}`, `כל ההארכות יחד עד ${lq.complex.total_max_days} ימים${cite(lq.complex.section, lq.complex.url)}`]); }
		if (r.partnerDays) {
			rows.push([`בן הזוג: <bdi>${mn(r.pwage)} × ${b.months_short} ÷ ${b.divisor_short}</bdi>`, ilsn(r.partnerDaily), `לפי השכר שלו${cite('סכום דמי הלידה לאב', lq.partner.amount_url)}`]);
			rows.push([`בן הזוג: <bdi>${money(r.partnerDaily)} × ${r.partnerDays}</bdi>`, ilsn(r.partnerTotal), `${r.partner === 'swap' ? 'במקום היולדת' : 'יחד עם היולדת'}${cite(r.partner === 'swap' ? lq.partner.section : lq.partner.together_section, lq.law_url)}`]);
		}
		rows.push([r.split ? `היולדת: <bdi>${money(r.daily)} × ${Math.min(r.motherDays, r.shortDays)} + ${money(r.dailyLong)} × ${Math.max(0, r.motherDays - r.shortDays)}</bdi>` : `היולדת: <bdi>${money(r.daily)} × ${r.motherDays}</bdi>`, ilsn(r.motherTotal), `${r.motherDays} ימים`]);
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-calc-h">כמה, על מה, ולפי איזה סעיף</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-calc-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([x, y, z]) => `<tr><td data-th="מה">${x}</td><td data-th="סכום">${y}</td><td data-th="הכלל">${z}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול דמי לידה, ${num(r.paidDays, 0)} ימים</td><td data-th="סכום">${ilsn(r.total)}</td><td data-th="הכלל">ברוטו, בתשלום אחד</td></tr>`
		+ `</tbody><caption>${esc(lq.deductions.he)} (${esc(lq.deductions.section)}). הסכומים מ-${esc(isoToHe(lq.from))}.</caption></table></div></div>`;
	// 2. The gate.
	const gates = [];
	const roleGate = (label, Q, m14, m22) => gates.push({ ok: Q.tier !== 'none', he: `${label}${m14} מתוך ${lq.qualify.full_window} חודשים${m22 !== '' && m22 !== undefined ? `, ${m22} מתוך ${lq.qualify.full_alt_window}` : ''}: ${Q.tier === 'full' ? `${lq.qualify.full_days} ימים` : Q.tier === 'partial' ? `${lq.qualify.partial_days} ימים` : 'לא מספיק'}`, section: Q.section, url: lq.qualify.url });
	if (r.empQ) { roleGate(r.who === 'both' ? 'כשכירה: ' : '', r.empQ, r.m14, r.m22); }
	if (r.selfQ) { roleGate(r.who === 'both' ? 'כעצמאית: ' : 'עצמאית: ', r.selfQ, r.who === 'both' ? r.sm14 : r.m14, r.who === 'both' ? r.sm22 : r.m22); }
	gates.push({ ok: true, he: `${lq.qualify.stop_he}: הפסקת ב-${isoToHe(r.stop)}, הלידה ב-${isoToHe(r.birth)}`, section: 'סעיף 49(א)', url: lq.qualify.url });
	gates.push({ ok: true, he: lq.qualify.birth_he, section: 'סעיף 39', url: lq.qualify.url });
	if (r.partner !== 'none') { gates.push({ ok: r.pq && r.eligible, he: lq.partner.qualify_he, section: lq.partner.section, url: lq.partner.conditions_url }); }
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-gate-h">תנאי הזכאות</h3></div><ul class="${P}-gate">`
		+ gates.map((g) => `<li class="${P}-gate__i ${P}-gate__i--${g.ok ? 'ok' : 'no'}"><strong aria-hidden="true">${g.ok ? '✓' : '✕'}</strong> ${esc(g.he)}${cite(g.section, g.url)}</li>`).join('')
		+ `</ul></div>`;
	// 3. The leave, stretch by stretch.
	const segs = periods(reg, r);
	if (segs.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-per-h">החופשה, קטע אחרי קטע</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-per-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מ</th><th scope="col">עד</th><th scope="col">ימים</th><th scope="col">מה</th></tr></thead><tbody>`
			+ segs.map((s) => `<tr><td data-th="מ"><bdi>${esc(isoToHe(s.from))}</bdi></td><td data-th="עד"><bdi>${esc(isoToHe(s.to))}</bdi></td><td data-th="ימים">${num(daysBetween(s.from, s.to) + 1, 0)}</td><td data-th="מה">${esc(s.he)}${cite(s.section, s.url)}</td></tr>`).join('')
			+ `</tbody>${r.leave ? `<caption>${esc(lq.leave.he)}. ${esc(lq.parent_hour.he)}, עד ${esc(isoToHe(r.leave.hourEnd))}.</caption>` : ''}</table></div></div>`;
	}
	// 4. The dates to keep.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ r.deadlines.map((x) => `<tr><td data-th="תאריך"><bdi>${esc(isoToHe(x.date))}</bdi></td><td data-th="מה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section || 'המוסד לביטוח לאומי', x.url)}</td></tr>`).join('')
		+ `</tbody></table></div></div>`;
	// 5. The grant, and who pays what.
	const h = lq.hospital;
	const pays = [
		[`מענק לידה (${esc(r.babies === 1 ? `ילד ${ORDER_LABEL[r.order]}` : BABY_LABEL[r.babies])})`, ilsn(r.grant.amount), `ליולדת, <bdi>${r.grant.pct}%</bdi> מהסכום הבסיסי${cite(lq.grant.section, lq.grant.url)}`],
		['מענק אשפוז', ilsn(h.amount), `לבית החולים, לא ליולדת; מ-${esc(isoToHe(h.from))}${cite(h.section, h.url)}`],
		[`תוספת לפג עד ${money(h.premature_grams, 0)} גרם`, ilsn(h.premature), `לבית החולים, אחרי ${h.premature_icu_days} ימים לפחות בטיפול נמרץ יילודים${cite('מימון הוצאות האשפוז', h.url)}`],
	];
	if (r.multi) {
		r.multi.parts.forEach((x) => { pays.push([`קצבת לידה, חודש ${x.from} עד ${x.to}`, `${ilsn(x.amount)} × ${x.months}`, `לחודש, ל-${esc(BABY_LABEL[Math.min(r.babies, 5)])}${cite(lq.multi_allowance.section, lq.multi_allowance.url)}`]); });
		pays.push([`קצבת לידה, ${lq.multi_allowance.months} חודשים`, ilsn(r.multi.total), 'לפי טבלת המוסד, כשכל הילדים בחיים']);
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-pay-h">מענק הלידה, ומי מקבל מה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-pay-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">למי</th></tr></thead><tbody>`
		+ pays.map(([x, y, z]) => `<tr><td data-th="מה">${x}</td><td data-th="סכום">${y}</td><td data-th="למי">${z}</td></tr>`).join('')
		+ `</tbody><caption>${esc(lq.grant.paid_he)}. ${esc(lq.grant.family_he)}.</caption></table></div></div>`;
	// 6. What to do now.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">מה עושים עכשיו, ומה מצרפים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ol class="${P}-list">${checklist(reg, r).map((x) => `<li>${esc(x.he)}${cite(x.section, x.url)}</li>`).join('')}</ol></div>`;
	const info = r.flags.filter((x) => x.level === 'info');
	if (info.length) { out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-info-h">עוד לפני שמגישים</h3></div><ul class="${P}-info">${info.map((x) => `<li>${esc(x.he)}</li>`).join('')}</ul></div>`; }
	return out;
}

/** Page section: the amount by monthly wage, from the same engine. */
export function wageTable(reg) {
	const lq = reg.rights_leida;
	const q = lq.qualify;
	const list = [6000, 8000, 10000, 12000, 15000, 20000, 30000, 52570];
	const rows = byWage(reg, EXAMPLE, list).map((x) => `<tr><td data-th="שכר חודשי ברוטו">${ilsn(x.wage)}</td><td data-th="ליום">${ilsn(x.daily)}${x.daily >= lq.max.daily ? ' (מקסימום)' : ''}</td><td data-th="${q.full_weeks} שבועות">${ilsn(x.full)}</td><td data-th="${q.partial_weeks} שבועות">${ilsn(x.partial)}</td><td data-th="תאומים, ${q.full_weeks + 3} שבועות">${ilsn(x.twins)}</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>דמי לידה ברוטו לפי שכר קבוע ב-6 החודשים, מ-${esc(isoToHe(lq.from))}: ליום, ל-${q.full_days} ימים, ל-${q.partial_days} ימים ולתאומים (${q.full_days + lq.multiple.full_extra_days} ימים). המקסימום ${esc(nis(lq.max.daily))} ליום (${esc(lq.max.section)}).</caption><thead><tr><th scope="col">שכר חודשי ברוטו</th><th scope="col">ליום</th><th scope="col">${q.full_weeks} שבועות</th><th scope="col">${q.partial_weeks} שבועות</th><th scope="col">תאומים, ${q.full_weeks + 3} שבועות</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the birth grant by birth order and multiples, and the period by tier and babies. */
export function grantTable(reg) {
	const lq = reg.rights_leida;
	const g = lq.grant;
	const rows = [['הילד הראשון', g.first, g.pct_first], ['הילד השני', g.second, g.pct_second], ['הילד השלישי ואילך', g.third_plus, g.pct_third], ['תאומים', g.twins, g.pct_twins], ['שלישייה', g.triplets, g.pct_triplets], ['כל ילד נוסף בלידה', g.each_extra, g.pct_extra]]
		.map(([a, n, pc]) => `<tr><td data-th="בעד">${esc(a)}</td><td data-th="מענק הלידה">${ilsn(n)}</td><td data-th="מהסכום הבסיסי"><bdi>${pc}%</bdi></td><td data-th="מקור">${cite(g.section, g.url)}</td></tr>`).join('');
	const q = lq.qualify;
	const per = [1, 2, 3].map((n) => `<tr><td data-th="בלידה">${esc(BABY_LABEL[n])}</td><td data-th="דמי לידה מלאים">${num(q.full_weeks + (n - 1) * 3, 0)} שבועות (${num(q.full_days + (n - 1) * lq.multiple.full_extra_days, 0)} ימים)</td><td data-th="דמי לידה חלקיים">${num(q.partial_weeks + (n - 1) * 2, 0)} שבועות (${num(q.partial_days + (n - 1) * lq.multiple.partial_extra_days, 0)} ימים)</td><td data-th="מקור">${cite(n === 1 ? q.full_section : lq.multiple.section, lq.multiple.url)}</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מענק הלידה מ-${esc(isoToHe(lq.from))}, לפי מספר הילדים במשפחה (${esc(g.section)}). ${esc(g.paid_he)}.</caption><thead><tr><th scope="col">בעד</th><th scope="col">מענק הלידה</th><th scope="col">מהסכום הבסיסי</th><th scope="col">מקור</th></tr></thead><tbody>${rows}</tbody></table></div>`
		+ `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>כמה שבועות דמי לידה: ${num(q.full_months, 0)} מתוך ${q.full_window} חודשי ביטוח (או ${num(q.full_alt_months, 0)} מתוך ${q.full_alt_window}) למלאים, ${num(q.partial_months, 0)} מתוך ${q.partial_window} לחלקיים; אשפוז ומוגבלות מורכבת מאריכים עוד.</caption><thead><tr><th scope="col">בלידה</th><th scope="col">דמי לידה מלאים</th><th scope="col">דמי לידה חלקיים</th><th scope="col">מקור</th></tr></thead><tbody>${per}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const lq = reg.rights_leida;
	const btl = reg.rights_btl;
	const b = lq.base;
	const bm = r.baseMonths;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.total,
		sticky: ilsn(r.total),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>תנאי הזכאות: שכירה, ${r.m14} מתוך ${lq.qualify.full_window} חודשי ביטוח לפני הפסקת העבודה ב-${isoToHe(r.stop)}, ולכן ${r.baseDays} ימים (${lq.qualify.full_weeks} שבועות)${cite(lq.qualify.full_section, lq.law_url)}${cite('תנאי הזכאות', lq.qualify.url)}</li>`
			+ `<li>הבסיס: השכר ב-3 החודשים ${monthHe(bm[3])} עד ${monthHe(bm[5])}, <bdi>${money(r.emp.sumShort, 0)} ÷ ${b.divisor_short} = ${money(r.emp.short)}</bdi> ₪, מול 6 החודשים, <bdi>${money(r.emp.sumLong, 0)} ÷ ${b.divisor_long} = ${money(r.emp.long)}</bdi> ₪; הגבוה ${money(r.daily)} ₪ ליום${cite(b.section, lq.law_url)}${cite('סכום דמי הלידה', b.url)}</li>`
			+ `<li>המקסימום: <bdi>${money(btl.basic_amount.b1, 0)} × ${lq.max.b1_mult} ÷ ${lq.max.divisor} = ${money(lq.max.daily)}</bdi> ₪ ליום מ-${isoToHe(lq.max.from)}; ${money(r.daily)} ₪ מתחתיו${cite(lq.max.section, lq.law_url)}</li>`
			+ `<li>התקופה: מיום הפסקת העבודה, ${isoToHe(r.paidStart)}, שבוע לפני הלידה (לא יותר מ-${lq.start.before_full} ימים לפניה), ${r.paidDays} ימים עד ${isoToHe(r.paidEnd)}${cite(lq.start.section, lq.law_url)}</li>`
			+ `<li>הסכום: <bdi>${money(r.daily)} × ${r.paidDays} = ${money(r.total)}</bdi> ₪ ברוטו, בתשלום אחד; מנוכים מס הכנסה, ביטוח לאומי וביטוח בריאות${cite(lq.deductions.section, lq.law_url)}</li>`
			+ `<li>מענק הלידה לילד השני: <bdi>${lq.grant.pct_second}% × ${money(btl.basic_amount.b1, 0)} = ${money(r.grant.amount, 0)}</bdi> ₪, אוטומטית בתוך חודש${cite(lq.grant.section, lq.law_url)}${cite('סכום המענק', lq.grant.url)}</li>`
			+ `<li>החופשה: ${lq.leave.weeks} שבועות מ-${isoToHe(r.leave.start)} עד ${isoToHe(r.leave.end)}, ו-${lq.protect.after_days} ימי הגנה מפיטורים עד ${isoToHe(r.leave.protectEnd)}${cite(lq.leave.section, lq.work_law_url)}${cite(lq.protect.after_section, lq.work_law_url)}</li></ol>`,
		compare_table: wageTable(reg) + grantTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

export function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const int = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : (/^\d+$/.test(v) ? Number(v) : NaN); };
	return {
		who: radio('who', 'employee'), m14: int('m14'), m22: int('m22'), sm14: int('sm14'), sm22: int('sm22'),
		wageMode: radio('wm', 'same'), wage: m('wage'), wages: [0, 1, 2, 3, 4, 5].map((i) => m(`w${i}`)), selfIncome: m('si'), selfPrev: m('sp'),
		stop: toIso(val(`#${P}-stop`)), birth: toIso(val(`#${P}-birth`)), babies: Number(radio('bb', '1')), order: Number(radio('ord', '1')),
		seniority: radio('sen', 'gte12'), momHosp: int('mh'), babyHosp: int('bh'), complex: on('cx'),
		partner: radio('pt', 'none'), pdays: int('pd'), pwage: m('pw'), pq: on('pq'),
	};
}

const WM = { employee: 'e', self: 's', both: 'b' };
const SM = { lt6: 'a', '6to12': 'b', gte12: 'c' };
const PM = { none: 'n', together: 't', swap: 's' };
const keyOf = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
const n2 = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : String(v));
export function stateOf(i) {
	const each = i.wageMode === 'each';
	const self = i.who === 'self' || i.who === 'both';
	const emp = i.who !== 'self';
	const pt = PM[i.partner] && i.partner !== 'none';
	return encodeState({
		k: WM[i.who] || 'e', m: n2(i.m14), n: n2(i.m22), o: i.who === 'both' ? n2(i.sm14) : '', q: i.who === 'both' ? n2(i.sm22) : '',
		w: emp && !each ? n2(i.wage) : '', x: emp && each ? (i.wages || []).map(n2).join('~') : '',
		i: self ? n2(i.selfIncome) : '', y: self ? n2(i.selfPrev) : '',
		s: i.stop, b: i.birth, c: Number(i.babies) > 1 ? i.babies : '', r: Number(i.babies) === 1 ? i.order : '', e: emp ? SM[i.seniority] : '',
		h: Number(i.momHosp) ? i.momHosp : '', j: Number(i.babyHosp) ? i.babyHosp : '', z: i.complex ? 1 : '',
		p: pt ? PM[i.partner] : '', d: pt ? n2(i.pdays) : '', v: pt ? n2(i.pwage) : '', u: pt && i.pq === false ? 0 : '',
	});
}
export const KEYS = ['k', 'm', 'n', 'o', 'q', 'w', 'x', 'i', 'y', 's', 'b', 'c', 'r', 'e', 'h', 'j', 'z', 'p', 'd', 'v', 'u'];
export function inputOf(s) {
	if (!s.s || !s.b || s.m === undefined) { return null; }
	const num1 = (v) => (v === undefined || v === '' ? '' : Number(v));
	const each = Boolean(s.x);
	const who = keyOf(WM, s.k, 'employee');
	const babies = s.c ? Number(s.c) : 1;
	return {
		who, m14: num1(s.m), m22: num1(s.n), sm14: num1(s.o), sm22: num1(s.q),
		wageMode: each ? 'each' : 'same', wage: each ? '' : num1(s.w), wages: each ? s.x.split('~').map((v) => (v === '' ? '' : Number(v))) : [],
		selfIncome: num1(s.i), selfPrev: num1(s.y), stop: s.s, birth: s.b, babies, order: s.r ? Number(s.r) : 1,
		seniority: keyOf(SM, s.e, 'gte12'), momHosp: s.h ? Number(s.h) : 0, babyHosp: s.j ? Number(s.j) : 0, complex: s.z === '1',
		partner: keyOf(PM, s.p, 'none'), pdays: num1(s.d), pwage: num1(s.v), pq: s.u !== '0',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lq = reg.rights_leida;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(lq.checked_on, lq.refresh_every_days) || (lq.next_update && today >= lq.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהסכומים התעדכנו ב-1 בינואר'); }
	}
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
	const sync = () => {
		const who = (root.querySelector(`input[name="${P}-who"]:checked`) || {}).value || 'employee';
		form.querySelectorAll('[data-if-emp]').forEach((el) => { el.hidden = who === 'self'; });
		form.querySelectorAll('[data-if-self]').forEach((el) => { el.hidden = who === 'employee'; });
		form.querySelectorAll('[data-if-who]').forEach((el) => { el.hidden = el.getAttribute('data-if-who') !== who; });
		const v14 = Number((root.querySelector(`#${P}-m14`) || {}).value);
		form.querySelectorAll('[data-if-m22]').forEach((el) => { el.hidden = v14 >= lq.qualify.full_months; });
		const s14 = Number((root.querySelector(`#${P}-sm14`) || {}).value);
		form.querySelectorAll('[data-if-sm22]').forEach((el) => { el.hidden = s14 >= lq.qualify.full_months; });
		const wm = (root.querySelector(`input[name="${P}-wm"]:checked`) || {}).value || 'same';
		form.querySelectorAll('[data-if-wm]').forEach((el) => { el.hidden = el.getAttribute('data-if-wm') !== wm; });
		const bb = Number((root.querySelector(`input[name="${P}-bb"]:checked`) || {}).value || 1);
		form.querySelectorAll('[data-if-one]').forEach((el) => { el.hidden = bb !== 1; });
		const pt = (root.querySelector(`input[name="${P}-pt"]:checked`) || {}).value || 'none';
		form.querySelectorAll('[data-if-partner]').forEach((el) => { el.hidden = pt === 'none'; });
		const pd = root.querySelector(`#${P}-pd`);
		if (pd && pt === 'together') { pd.setAttribute('placeholder', `7 עד ${togetherCap(lq, bb)}`); }
		const stopIso = toIso((root.querySelector(`#${P}-stop`) || {}).value || '');
		if (/^\d{4}-\d{2}-\d{2}$/.test(stopIso)) {
			const names = baseMonths(stopIso).map(monthHe);
			form.querySelectorAll('[data-w]').forEach((el) => { const l = el.querySelector('label'); if (l) { l.textContent = names[Number(el.getAttribute('data-w'))]; } });
		}
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? ilsn(r.total) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.status }); }
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
		run(fromHash, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const btn = ev.target.closest('[data-act]');
		if (!btn) { return; }
		const act = btn.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			download('dmei-leida.ics', 'text/calendar;charset=utf-8', ics(r.deadlines.map((d) => ({ date: d.date, summary: `דמי לידה: ${d.he}` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(checklistText(reg, r));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק הביטוח הלאומי ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(lq.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.status : 'error' });
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
