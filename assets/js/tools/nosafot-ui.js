/**
 * The labor-law wave UI (22.10.2026): the overtime time card (shaot-nosafot, prefix jt48) on /overtime-pay-israel/.
 * The picture is the worker's own time card (כרטיס נוכחות): the week's seven rows, each day's hours drawn as a bar from
 * the clock-in, coloured by the rate the law sets for them (regular, 125%, 150%, the weekly rest), with the day's norm
 * marked on the bar. The card is a real table (caption, row headers, a text line per day for screen readers). Under it:
 * the per-day computation with its sections, the month and the fixed-payment check, the back pay with the 7-year
 * limitation, the law's dates (.ics), what changed and when, the rules table, a one-page print, and the hand-off to the
 * jus-tice.com simulation (sim-handoff.js) for the talk with the employer.
 */
import { nsCompute, nsParseDay, nsBand, NS_DAYS, NS_SHORT, NS_DEFAULT, NS_REST } from './nosafot-engine.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'shaot-nosafot';
const P = 'jt48';
const NS_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=employment';

export const EXAMPLE = Object.assign({}, NS_DEFAULT);

/** One click to a full profile: each chip loads a whole week and recomputes. */
export const PRESETS = {
	long: { he: 'חודשי, 5 ימים, ימים ארוכים', input: {} },
	six: { he: 'שעתי, 6 ימים, עם יום שישי', input: { pay: 'hourly', hourly: 40, week: 6, days: ['08:00-17:30', '08:00-17:30', '08:00-17:30', '08:00-17:30', '08:00-17:30', '08:00-14:00', ''] } },
	night: { he: 'משמרות לילה, שכר שעתי', input: { pay: 'hourly', hourly: 45, days: ['22:00-07:00', '22:00-07:00', '22:00-07:00', '22:00-07:00', '22:00-07:00', '', ''] } },
	shabbat: { he: 'חודשי, עם עבודה בשבת', input: { salary: 10920, days: ['08:00-17:30', '08:00-17:30', '08:00-17:30', '08:00-17:30', '08:00-16:30', '', '09:00-15:30'] } },
	global: { he: 'גלובלי: האם הסכום מכסה?', input: { salary: 12740, paid: 1500, days: ['08:00-19:30', '08:00-19:30', '08:00-19:30', '08:00-19:30', '08:00-17:00', '', ''] } },
};
const nsPreset = (key) => Object.assign({}, NS_DEFAULT, PRESETS[key].input, { kind: ['', '', '', '', '', '', ''] });

const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const cash = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const hrs = (h) => `<bdi>${Number(h || 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}</bdi>`;
const hrsT = (h) => Number(h || 0).toLocaleString('en-US', { maximumFractionDigits: 2 });
const clock = (m) => { const t = ((m % 1440) + 1440) % 1440; return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`; };
const heMonth = (key) => { const [y, m] = String(key).split('-').map(Number); return m ? `${m}.${y}` : ''; };
const nsChip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const nsText = (id, label, value, ph, hint = '', mode = 'decimal') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" class="jtool-input" type="text" inputmode="${mode}" autocomplete="off" value="${esc(value)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
const restName = (rest) => NS_DAYS[NS_REST[rest] ?? 6];

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, NS_DEFAULT, input || {});
	const ln = reg.labor_nosafot;
	const ot = reg.rights_neto.overtime;
	const presetKey = Object.keys(PRESETS).find((k) => JSON.stringify(nsPreset(k).days) === JSON.stringify(i.days) && (k === 'long' ? i.pay === 'monthly' && Number(i.salary) === NS_DEFAULT.salary : true)) || '';
	const restIdx = NS_REST[i.rest] ?? 6;
	const rows = NS_DAYS.map((name, d) => {
		const k = (i.kind || [])[d] || '';
		return `<div class="${P}-slot${d === restIdx ? ` ${P}-slot--rest` : ''}" data-${P}-slot="${d}"><label class="${P}-slot__day" for="${P}-d${d}"><span aria-hidden="true">${NS_SHORT[d]}</span><span class="jtool-visually-hidden">יום ${name}</span><small data-${P}-restlabel="${d}">${d === restIdx ? 'מנוחה' : ''}</small></label>`
			+ `<input id="${P}-d${d}" class="${P}-slot__in" type="text" inputmode="text" autocomplete="off" dir="ltr" value="${esc((i.days || [])[d] || '')}" placeholder="—" aria-describedby="${P}-d${d}-e">`
			+ `<select id="${P}-k${d}" class="${P}-slot__kind" aria-label="סוג היום, ${name}"><option value=""${k === '' ? ' selected' : ''}>רגיל</option><option value="night"${k === 'night' ? ' selected' : ''}>לילה</option><option value="eve"${k === 'eve' ? ' selected' : ''}>ערב חג</option></select>`
			+ `<p class="jtool-error ${P}-slot__err" id="${P}-d${d}-e" role="alert"></p></div>`;
	}).join('');
	return `<fieldset class="jtool-field"><legend>פרופיל מוכן בלחיצה</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === presetKey ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>איך משלמים לכם</legend><div class="jtool-chips">${nsChip('pay', 'monthly', 'שכר חודשי', i.pay !== 'hourly')}${nsChip('pay', 'hourly', 'שכר לפי שעה', i.pay === 'hourly')}</div><p class="jtool-error" id="${P}-pay-e" role="alert"></p></fieldset>`
		+ `<div class="jtool-row" data-if-monthly${i.pay === 'hourly' ? ' hidden' : ''}>${nsText('salary', 'שכר חודשי ברוטו (₪)', i.salary, 'לדוגמה: 9,100', 'השכר הרגיל, כולל כל התוספות הקבועות (סעיף 18)')}${nsText('mh', 'שעות בחודש לפי החוזה', i.monthHours === '' || i.monthHours === undefined ? ot.divisor : i.monthHours, String(ot.divisor), `משרה מלאה: ${ot.divisor} (צו ההרחבה)`)}</div>`
		+ `<div class="jtool-row" data-if-hourly${i.pay === 'hourly' ? '' : ' hidden'}>${nsText('hourly', 'שכר לשעה (₪)', i.hourly, 'לדוגמה: 45', 'השכר הרגיל לשעה, כולל התוספות (סעיף 18)')}</div>`
		+ `<fieldset class="jtool-field"><legend>שבוע העבודה במקום העבודה</legend><div class="jtool-chips">${nsChip('week', '5', '5 ימים', Number(i.week) !== 6)}${nsChip('week', '6', '6 ימים', Number(i.week) === 6)}</div>`
		+ `<div class="jtool-row ${P}-weekrow"><div class="jtool-field" data-if-five${Number(i.week) === 6 ? ' hidden' : ''}><label class="jtool-label" for="${P}-short">היום המקוצר (${hrsT(ln.five.short)} שעות)</label><select id="${P}-short">${NS_DAYS.slice(0, 6).map((n, d) => `<option value="${d}"${Number(i.shortDay) === d ? ' selected' : ''}>${esc(n)}</option>`).join('')}</select></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-rest">יום המנוחה השבועית</label><select id="${P}-rest">${Object.keys(NS_REST).map((k) => `<option value="${k}"${i.rest === k ? ' selected' : ''}>${esc(NS_DAYS[NS_REST[k]])}</option>`).join('')}</select></div></div></fieldset>`
		+ `<fieldset class="jtool-field ${P}-card"><legend>כרטיס הנוכחות: שבוע אחד</legend><p class="jtool-hint">בכל יום: שעת כניסה ויציאה (07:30-19:00, גם אחרי חצות: 22:00-06:00) או מספר השעות נטו (9.5). שעות לילה מזוהות לבד מהטווח.</p>`
		+ `<div class="${P}-slots">${rows}</div></fieldset>`
		+ `<div class="jtool-row">${nsText('brk', 'הפסקה שיצאתם אליה (דקות ביום)', i.brk, '30', 'יורדת מכל יום של 6 שעות ומעלה שהוזן כטווח; הפסקה שבה נדרשתם להישאר נספרת כעבודה (סעיף 20(ג))', 'numeric')}${nsText('weeks', 'כמה שבועות כאלה בחודש', i.weeks, '4', 'לפי מה שעבדתם בפועל באותו חודש')}</div>`
		+ `<details class="jtool-more"${i.paid || Number(i.months) !== NS_DEFAULT.months || i.youth ? ' open' : ''}><summary>מה שולם, בדיקה לאחור, עובד צעיר</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${nsText('paid', 'שולם בחודש על שעות נוספות (₪)', i.paid || '', '0', 'הסכום בתלוש לשעות נוספות, גם "גלובלי"; 0 אם לא שולם', 'numeric')}${nsText('months', 'כמה חודשים לבדוק לאחור', i.months, '12', `עד ${reg.severance.limitation.years} שנים (התיישנות)`, 'numeric')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${nsChip('youth', '1', 'העובד/ת מתחת לגיל 18', Boolean(i.youth), 'checkbox')}</div></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const w = r.week;
	const head = `לפי כרטיס הנוכחות: ${hrsT(w.ot)} שעות נוספות בשבוע (${hrsT(w.h125)} ב-125%, ${hrsT(w.h150)} ב-150%)${w.rest ? ` ו-${hrsT(w.rest)} שעות במנוחה השבועית (150%)` : ''}.`;
	const body = r.p.pay === 'monthly'
		? ` בשכר שעה של ${nis(r.rate)} מגיעים ${nis(r.pay.extra)} בשבוע מעבר לשכר החודשי, ${nis(r.month.extra)} בחודש של ${hrsT(r.p.weeks)} שבועות.`
		: ` בשכר של ${nis(r.rate)} לשעה מגיעים ${nis(r.pay.total)} בשבוע (${nis(r.pay.reg)} לשעות הרגילות ו-${nis(r.pay.extra)} גמול), ${nis(r.month.total)} בחודש של ${hrsT(r.p.weeks)} שבועות.`;
	let gap = '';
	if (r.month.extra > 0) {
		if (!r.p.paid) { gap = r.back.months ? ` אם הגמול לא שולם: חסרים ${nis(r.month.gap)} בחודש, ${nis(r.back.amount)} על ${r.back.months} חודשים.` : ''; } else if (r.month.covered) { gap = ` הסכום ששולם (${nis(r.p.paid)}) מכסה את הגמול המחושב לחודש.`; } else { gap = ` שולמו ${nis(r.p.paid)}: חסרים ${nis(r.month.gap)} בחודש${r.back.months ? `, ${nis(r.back.amount)} על ${r.back.months} חודשים` : ''}.`; }
	}
	return head + body + gap;
}

/** The picture: the week's time card, each day's hours coloured by their rate, the day's norm marked. */
export function timeCard(reg, r) {
	if (!r.ok) { return ''; }
	const top = Math.max(12, ...r.days.map((d) => d.hours));
	const pctW = (h) => `${Math.max(0, (100 * h) / top).toFixed(2)}%`;
	const rows = r.days.map((d) => {
		const io = d.range ? `<bdi>${clock(d.start)}–${clock(d.end)}</bdi>` : (d.hours ? 'שעות נטו' : '—');
		let segs = '';
		let say;
		if (!d.hours) {
			say = d.rest ? 'יום המנוחה השבועית, לא עבדו' : 'לא עבדו';
		} else if (d.rest) {
			segs = `<span class="${P}-seg ${P}-seg--rest" style="width:${pctW(d.hRest)}"></span>`;
			say = `${hrsT(d.hRest)} שעות במנוחה השבועית, 150%`;
		} else {
			segs = `<span class="${P}-seg ${P}-seg--reg" style="width:${pctW(d.reg)}"></span>`
				+ (d.h125 ? `<span class="${P}-seg ${P}-seg--125" style="width:${pctW(d.h125)}"></span>` : '')
				+ (d.h150 ? `<span class="${P}-seg ${P}-seg--150" style="width:${pctW(d.h150)}"></span>` : '')
				+ `<i class="${P}-norm" style="inset-inline-start:${pctW(d.norm)}"></i>`;
			say = `${hrsT(d.hours)} שעות: ${hrsT(d.reg)} רגילות, ${hrsT(d.h125)} ב-125%, ${hrsT(d.h150)} ב-150%; התקן ${hrsT(d.norm)} (${d.why})`;
		}
		const tag = d.hours && d.night ? `<em class="${P}-tag">לילה</em>` : d.hours && d.kind === 'eve' ? `<em class="${P}-tag">ערב חג</em>` : d.rest ? `<em class="${P}-tag ${P}-tag--rest">מנוחה</em>` : '';
		return `<tr${d.rest ? ` class="${P}-row--rest"` : ''}><th scope="row"><span aria-hidden="true">${NS_SHORT[d.i]}</span><span class="jtool-visually-hidden">${esc(NS_DAYS[d.i])}</span></th><td class="${P}-io">${io}${tag}</td>`
			+ `<td class="${P}-barcell"><span class="${P}-bar" aria-hidden="true">${segs}</span><span class="jtool-visually-hidden">${esc(say)}</span></td><td class="${P}-tot">${d.hours ? hrs(d.hours) : ''}</td></tr>`;
	}).join('');
	const w = r.week;
	return `<figure class="${P}-clock"><table class="${P}-cardt"><caption>כרטיס הנוכחות של השבוע, לפי שיעור התשלום<small>הקו בכל שורה: התקן היומי (${r.p.week === 5 ? `${hrsT(reg.labor_nosafot.five.day)}, ביום המקוצר ${hrsT(reg.labor_nosafot.five.short)}` : `${hrsT(reg.labor_nosafot.day.regular)}`}; בלילה ובערב מנוחה או חג ${hrsT(reg.labor_nosafot.day.short)}). מעבר ל-${hrsT(reg.rights_neto.overtime.week_hours)} שעות רגילות בשבוע: שעות נוספות.</small></caption>`
		+ `<thead><tr><th scope="col">יום</th><th scope="col">כניסה–יציאה</th><th scope="col">השעות</th><th scope="col">סה"כ</th></tr></thead><tbody>${rows}</tbody>`
		+ `<tfoot><tr><th scope="row">שבוע</th><td colspan="2">${hrs(w.reg)} רגילות · ${hrs(w.h125)} ב-125% · ${hrs(w.h150)} ב-150%${w.rest ? ` · ${hrs(w.rest)} במנוחה` : ''}</td><td class="${P}-tot">${hrs(w.total)}</td></tr></tfoot></table>`
		+ `<p class="${P}-keys" aria-hidden="true"><span><i class="${P}-k ${P}-seg--reg"></i>רגילות 100%</span><span><i class="${P}-k ${P}-seg--125"></i>125%</span><span><i class="${P}-k ${P}-seg--150"></i>150%</span><span><i class="${P}-k ${P}-seg--rest"></i>מנוחה שבועית 150%</span></p></figure>`;
}

/** The scenario for the simulation: computed facts only (the salary as a band), ending with the question to rehearse. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const w = r.week;
	const low = Math.floor(r.p.salary / 1000) * 1000;
	const who = r.p.pay === 'monthly' ? `עובד/ת בשכר חודשי של ${money(low, 0)} עד ${money(low + 1000, 0)} ₪ ברוטו` : `עובד/ת בשכר של ${nis(r.rate)} לשעה`;
	const paid = r.p.paid ? `המעסיק משלם ${nis(r.p.paid)} בחודש על שעות נוספות` : 'השעות הנוספות לא שולמו';
	const gap = r.month.gap > 0 && r.back.months ? ` הפער על ${r.back.months} חודשים: ${nis(r.back.amount)}.` : '';
	return `${who}, שבוע עבודה של ${r.p.week} ימים. לפי כרטיס הנוכחות, בשבוע רגיל ${hrsT(w.h125)} שעות ב-125% ו-${hrsT(w.h150)} שעות ב-150%${w.rest ? `, ועוד ${hrsT(w.rest)} שעות במנוחה השבועית` : ''}. לפי חוק שעות עבודה ומנוחה מגיעים ${nis(r.month.extra)} בחודש של ${hrsT(r.p.weeks)} שבועות; ${paid}.${gap} השאלה לתרגול: השיחה עם המעסיק על תשלום השעות הנוספות. איך מציגים את דוח הנוכחות ואת החישוב, ומה עונים כשהמעסיק אומר שהשכר כבר כולל שעות נוספות?`;
}

/** "What to do now": the official route and 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const ln = reg.labor_nosafot;
	const official = [
		{ he: `לבדוק בתלוש של ${heMonth(r.dates.thisMonth)} (משולם עד ${isoToHe(r.dates.due)}) שהשעות הנוספות מופיעות כרכיב נפרד, עם מספר השעות והסכום`, rule: ln.global.slip_section, url: ln.wage_law_url },
		{ he: 'לבקש מהמעסיק את דוח הנוכחות: הוא חייב לנהל פנקס שעות עבודה', rule: ln.register.section, url: ln.law_url },
		{ he: `${ln.complaint.he}`, url: ln.complaint.url },
	];
	const links = [];
	if (r.month.gap > 0) { links.push({ path: '/claim-labor-court/', he: 'תביעה בבית הדין לעבודה: איך מגישים' }); }
	if (r.week.rest) { links.push({ path: '/weekly-rest-holiday-pay/', he: 'עבודה במנוחה השבועית ובחגים: מה מגיע' }); }
	if (r.flags.some((f) => f.level === 'danger' && /מינימום/.test(f.he))) { links.push({ path: '/minimum-wage-israel-2025/', he: 'בודק שכר המינימום, חודש אחר חודש' }); }
	links.push({ path: '/net-salary-calculator/', he: 'כמה נשאר נטו מהגמול: מחשבון שכר נטו' });
	links.push({ path: '/payslip-requirements/', he: 'מה חייב להופיע בתלוש השכר' });
	links.push({ path: '/gmar-cheshbon/', he: 'גמר חשבון: מה מגיע כשמסיימים לעבוד' });
	return { official, links: links.slice(0, 4) };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const ln = reg.labor_nosafot;
	const ot = reg.rights_neto.overtime;
	const w = r.week;
	const na = nextActions(reg, r);
	const brief = aiBrief(reg, r);
	const state = r.flags.some((f) => f.level === 'danger') ? 'warn' : 'ok';
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--${state}">${state === 'ok' ? '✓' : '!'} לפי חוק שעות עבודה ומנוחה ושבוע של ${hrsT(ot.week_hours)} שעות</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}גמול שעות נוספות ומנוחה לחודש${r.p.pay === 'monthly' ? ', מעבר לשכר החודשי' : ''}</p>`
		+ `<strong class="jtool-verdict__figure">${cash(r.month.extra)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>שכר שעה</dt><dd>${cash(r.rate)}${r.p.pay === 'monthly' ? ` <small>(÷ ${hrsT(r.p.monthHours)})</small>` : ''}</dd></div><div><dt>125%</dt><dd>${hrs(w.h125)} ש׳ · ${cash(r.pay.p125)}</dd></div><div><dt>150%</dt><dd>${hrs(w.h150)} ש׳ · ${cash(r.pay.p150)}</dd></div>${w.rest ? `<div><dt>מנוחה 150%</dt><dd>${hrs(w.rest)} ש׳ · ${cash(r.pay.pRest)}</dd></div>` : ''}</dl>`
		+ `<p class="jtool-scope">${esc(ln.count.he)} (${esc(ln.count.section)}). ${esc(ln.pay.he)}${cite(ln.pay.section, ln.law_url)}</p></div>`
		+ timeCard(reg, r)
		+ (r.flags.length ? `<ul class="jtool-flags ${P}-flags">${r.flags.map((f) => `<li class="${P}-flag--${f.level}">${esc(f.he)}${cite(f.section, f.url)}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${NS_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את השיחה עם המעסיק</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a>` : esc(x.he)}${x.rule ? ` (${esc(x.rule)})` : ''}</li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** The computation of every day, with the rule behind each number. */
export function dayTable(reg, r) {
	const ln = reg.labor_nosafot;
	const body = r.days.filter((d) => d.hours).map((d) => `<tr><th scope="row">${esc(NS_DAYS[d.i])}</th><td data-th="שעות">${hrs(d.hours)}</td><td data-th="התקן">${d.rest ? 'מנוחה שבועית' : `${hrs(d.norm)} <small>(${esc(d.why)})</small>`}</td>`
		+ `<td data-th="מעבר ליום">${d.rest ? '—' : hrs(d.dailyOt)}</td><td data-th="מעבר ל-42">${d.rest ? '—' : hrs(d.weeklyOt)}</td><td data-th="125%">${hrs(d.h125)}</td><td data-th="150%">${hrs(d.rest ? d.hRest : d.h150)}${d.rest ? ' <small>(מנוחה)</small>' : ''}</td></tr>`).join('');
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-days-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">יום</th><th scope="col">שעות</th><th scope="col">התקן</th><th scope="col">מעבר ליום</th><th scope="col">מעבר ל-42</th><th scope="col">125%</th><th scope="col">150%</th></tr></thead><tbody>${body}</tbody>`
		+ `<caption>התקן היומי: ${esc(ln.day.section)}${r.p.week === 5 ? ` ו${esc(ln.five.section)}` : ''}; לילה: ${esc(ln.night.section)}. השעות שמעבר ל-${hrsT(reg.rights_neto.overtime.week_hours)} נספרות ביום שבו נעבדו, ובכל יום שתי השעות הנוספות הראשונות ב-125% (${esc(ln.pay.section)}).</caption></table></div>`;
}

/** The month, the fixed payment, the back pay and the limitation. */
export function moneyTable(reg, r) {
	const ln = reg.labor_nosafot;
	const rows = [
		['גמול לשבוע', `${cash(r.pay.p125)} + ${cash(r.pay.p150)}${r.week.rest ? ` + ${cash(r.pay.pRest)}` : ''} = ${cash(r.pay.extra)}`, cite(ln.pay.section, ln.law_url) + (r.week.rest ? cite(ln.rest_pay.section, ln.law_url) : '')],
		[`לחודש (${hrsT(r.p.weeks)} שבועות)`, cash(r.month.extra), ''],
		['שולם בחודש על שעות נוספות', cash(r.p.paid), cite(ln.global.section, ln.wage_law_url)],
		['ההפרש לחודש', r.month.gap > 0 ? `<strong>${cash(r.month.gap)}</strong>` : `אין (${cash(-r.month.gap)} מעבר לחישוב)`, ''],
		[`על ${r.back.months} חודשים${r.back.oldest ? ` (${heMonth(r.back.oldest)} עד ${heMonth(r.back.latest)})` : ''}`, r.month.gap > 0 ? `<strong>${cash(r.back.amount)}</strong>` : '—', cite(ln.limitation.section, ln.limitation_url)],
	];
	if (r.back.expired > 0) { rows.push([`${r.back.expired} חודשים מוקדמים יותר`, 'התיישנו', cite(ln.limitation.section, ln.limitation_url)]); }
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-money-h" tabindex="0"><table class="jtool-table"><tbody>${rows.map((x) => `<tr><th scope="row">${esc(x[0])}</th><td data-th="סכום">${x[1]}</td><td data-th="מקור">${x[2]}</td></tr>`).join('')}</tbody>`
		+ `<caption>${esc(ln.global.he)}. ${esc(ln.delay.he)} (${esc(ln.delay.section)}); הסכומים כאן בלי הפיצוי הזה ובלי הצמדה.</caption></table></div>`;
}

export function datesTable(reg, r, opts = {}) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = opts.today && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.what)}</td><td data-th="הכלל">${cite(e.rule, e.url)}</td></tr>`; }).join('')
		+ `</tbody><caption>רק תאריכים שהחוק קובע: מועד השכר והיום הקובע (חוק הגנת השכר), שנה לפיצוי הלנת שכר, ${reg.severance.limitation.years} שנים להתיישנות.</caption></table></div>`;
}

/** What changed and when: only values the law and the Ministry published, with the minimum hourly wage by date. */
export function historyTable(reg) {
	const ln = reg.labor_nosafot;
	const law = ln.history.map((h) => ({ from: h.from, he: h.he, rule: h.section, url: h.url }));
	const mw = reg.min_wage;
	const wage = mw.rows.filter((x) => x.from >= '2017-01-01').map((x) => ({ from: x.from, he: `שכר מינימום לשעה: ${x.hourly_182 ? `${money(x.hourly_182)} ₪ (÷ 182)` : `${money(x.hourly_186)} ₪ (÷ 186)`}, לחודש ${money(x.monthly)} ₪`, rule: 'חוק שכר מינימום', url: mw.source_url }));
	const all = law.concat(wage).sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-hist-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתאריך</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ all.map((x) => `<tr><td data-th="מתאריך"><bdi>${isoToHe(x.from)}</bdi></td><td data-th="מה השתנה">${esc(x.he)}</td><td data-th="מקור">${cite(x.rule, x.url)}</td></tr>`).join('')
		+ `</tbody><caption>הערכים שפורסמו בחוק, בצווי ההרחבה ובהודעות משרד העבודה. שכר המינימום משתנה ב-1 באפריל.</caption></table></div>`;
}

/** The one-page print: inputs, result, the computation path, the dates, the sources with their dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const ln = reg.labor_nosafot;
	const ot = reg.rights_neto.overtime;
	const w = r.week;
	const days = r.days.filter((d) => d.hours).map((d) => `<li>${esc(NS_DAYS[d.i])}: ${d.range ? `${clock(d.start)}–${clock(d.end)}, ` : ''}${hrsT(d.hours)} שעות${d.rest ? ' במנוחה השבועית (150%)' : `; התקן ${hrsT(d.norm)} (${esc(d.why)}); ${hrsT(d.h125)} ב-125%, ${hrsT(d.h150)} ב-150%`}</li>`).join('');
	return `<h3>שעות נוספות: סיכום החישוב</h3>`
		+ `<p><strong>הנתונים:</strong> ${r.p.pay === 'monthly' ? `שכר חודשי ${nis(r.p.salary)} ל-${hrsT(r.p.monthHours)} שעות` : `שכר לשעה ${nis(r.p.hourly)}`}; שבוע של ${r.p.week} ימים; מנוחה שבועית ביום ${esc(restName(r.p.rest))}; ${hrsT(r.p.weeks)} שבועות בחודש; שולם על שעות נוספות ${nis(r.p.paid)} בחודש.</p>`
		+ `<p><strong>כרטיס הנוכחות:</strong></p><ol>${days}</ol>`
		+ `<p><strong>התוצאה:</strong> ${hrsT(w.h125)} שעות × ${nis(r.rate)} × ${ot.first_pct}% + ${hrsT(w.h150)} × ${ot.next_pct}%${w.rest ? ` + ${hrsT(w.rest)} × ${ot.rest_pct}%` : ''} = ${nis(r.pay.extra)} בשבוע; ${nis(r.month.extra)} בחודש${r.month.gap > 0 ? `; חסרים ${nis(r.month.gap)} בחודש, ${nis(r.back.amount)} על ${r.back.months} חודשים` : ''}.</p>`
		+ `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.what)}`).join('; ')}.</p>`
		+ (r.flags.length ? `<p><strong>לתשומת לב:</strong> ${r.flags.map((f) => esc(f.he)).join('; ')}.</p>` : '')
		+ `<p><strong>מקורות:</strong> ${esc(ln.law_he)} (${esc(ln.pay.section)}, ${esc(ln.rest_pay.section)}, ${esc(ln.day.section)}), נוסח עדכני ל-${isoToHe(ln.law_current_to)}; ${esc(ln.order_he)}; ${esc(ln.review_he)}; ${esc(ln.directive_he)}; ${esc(ln.wage_law_he)}. נבדק ${isoToHe(ln.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const ln = reg.labor_nosafot;
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-days-h">איך חושב כל יום</h3></div>${dayTable(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-money-h">החודש, מה ששולם, ובדיקה לאחור</h3></div>${moneyTable(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">התאריכים שהחוק קובע</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">התאריכים ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">סיכום להדפסה</button></div></div>${datesTable(reg, r, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-hist-h">מה השתנה ומתי</h3></div>${historyTable(reg)}</div>`
		+ `<p class="${P}-note">${esc(ln.excluded.he)} (${esc(ln.excluded.section)}); ${esc(ln.excluded.dispute_he)} (${esc(ln.excluded.dispute_section)}). ${esc(ln.pay.rest_off_he)} (${esc(ln.pay.rest_off_section)}).${r.p.pay === 'hourly' ? ` ${esc(ln.pay_day.hourly_he)} (${esc(ln.pay_day.hourly_section)}).` : ''}</p>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || ln.checked_on)}</div>`;
}

/** Page section: every rule the card is measured against, from the registry, with its source. */
export function compareTable(reg) {
	const ln = reg.labor_nosafot;
	const ot = reg.rights_neto.overtime;
	const rows = [
		['יום עבודה', `${hrsT(ln.day.regular)} שעות; בלילה, בערב המנוחה השבועית ובערב חג ${hrsT(ln.day.short)}`, ln.day.section, ln.law_url],
		['שבוע של 5 ימים', `${hrsT(ln.five.day)} שעות ביום, יום מקוצר אחד ${hrsT(ln.five.short)}`, ln.five.section, ln.review_url],
		['שבוע עבודה', `${hrsT(ot.week_hours)} שעות (בחוק: ${ln.law_week.hours}) מ-${isoToHe(ln.order.from)}`, ln.order.section, ln.order_url],
		['עבודת לילה', `לפחות ${ln.night.min_hours} שעות בין ${ln.night.from} ל-${ln.night.to}`, ln.night.section, ln.law_url],
		['שתי השעות הנוספות הראשונות ביום', `${ot.first_pct}%`, ln.pay.section, ln.law_url],
		['מהשעה הנוספת השלישית', `${ot.next_pct}%`, ln.pay.section, ln.law_url],
		['שעות במנוחה השבועית', `${ot.rest_pct}%`, ln.rest_pay.section, ln.law_url],
		['שכר שעה לעובד חודשי', `השכר החודשי ÷ ${ot.divisor}`, ln.order.divisor_section, ln.order_url],
		['תקרה ליום', `${ot.max_day} שעות כולל שעות נוספות`, ln.permit.section, ln.review_url],
		['תקרה לשבוע', `${ot.max_week_overtime} שעות נוספות; עובד לילה: ${ln.permit.night_week} שעות בשבוע`, ln.permit.section, ln.review_url],
		['מנוחה שבועית', `${ln.rest.hours} שעות רצופות`, ln.rest.section, ln.law_url],
		['הפסקה', `${ln.break.minutes} דקות ביום של ${ln.break.min_day} שעות ומעלה`, ln.break.section, ln.law_url],
		['בין יום ליום', `${ln.gap.hours} שעות לפחות`, ln.gap.section, ln.law_url],
		['נטל ההוכחה בלי דוח נוכחות', `על המעסיק, עד ${ln.burden.week} שעות נוספות בשבוע או ${ln.burden.month} בחודש`, ln.burden.section, ln.wage_law_url],
		['שכר "כולל שעות נוספות"', 'נחשב לשכר רגיל בלבד', ln.global.section, ln.wage_law_url],
		['התיישנות', `${reg.severance.limitation.years} שנים`, ln.limitation.section, ln.limitation_url],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הכללים שכרטיס הנוכחות נמדד מולם. ${esc(ln.law_he)}, נוסח עדכני ל-${isoToHe(ln.law_current_to)}; נבדק ${isoToHe(ln.checked_on)}.</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מה">${esc(x[0])}</td><td data-th="הכלל">${esc(x[1])}</td><td data-th="מקור"><a href="${esc(x[3])}" target="_blank" rel="noopener">${esc(x[2])}</a></td></tr>`).join('')
		+ `</tbody></table></div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): same markup on the server and in the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי השעות שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">גמול שעות נוספות</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const w = r.week;
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}גמול שעות נוספות לחודש`;
	const who = r.p.pay === 'monthly' ? `שכר חודשי ${nis(r.p.salary)} (${nis(r.rate)} לשעה)` : `${nis(r.rate)} לשעה`;
	const gap = r.month.gap > 0 && r.back.months ? ` ${r.p.paid ? `שולמו ${nis(r.p.paid)}; ` : 'אם לא שולם: '}${nis(r.back.amount)} על ${r.back.months} חודשים.` : (r.p.paid && r.month.covered ? ' הסכום ששולם מכסה את החישוב.' : '');
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${cash(r.month.extra)}</strong><span class="jtool-lead__unit">בחודש${r.p.pay === 'monthly' ? ', מעבר לשכר' : ''} · ${nis(r.pay.extra)} בשבוע</span></p>`
		+ `<p class="jtool-lead__line">${esc(`${who}, שבוע של ${r.p.week} ימים: ${hrsT(w.h125)} שעות ב-125% ו-${hrsT(w.h150)} ב-150%${w.rest ? `, ${hrsT(w.rest)} במנוחה` : ''}, ${hrsT(r.p.weeks)} שבועות בחודש.${gap}`)}</p>${go}`;
}

export function snapshot(reg) {
	const r = nsCompute(reg, EXAMPLE);
	const ln = reg.labor_nosafot;
	const ot = reg.rights_neto.overtime;
	const d0 = r.days[0];
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.month.extra,
		sticky: cash(r.month.extra),
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { today: EXAMPLE.asOf, printedOn: EXAMPLE.asOf }),
		method: `<ol><li>שכר שעה: ${nis(EXAMPLE.salary)} ÷ ${ot.divisor} = ${nis(r.rate)}${cite(ln.order.divisor_section, ln.order_url)}</li>`
			+ `<li>שבוע של 5 ימים: התקן ${hrsT(ln.five.day)} שעות ביום, ביום המקוצר ${hrsT(ln.five.short)}${cite(ln.five.section, ln.review_url)}</li>`
			+ `<li>יום ראשון: ${hrsT(d0.hours)} שעות נטו (07:30 עד 19:00, פחות ${EXAMPLE.brk} דקות הפסקה); ${hrsT(d0.dailyOt)} מעבר לתקן: ${hrsT(d0.h125)} ב-${ot.first_pct}% ו-${hrsT(d0.h150)} ב-${ot.next_pct}%${cite(ln.pay.section, ln.law_url)}</li>`
			+ `<li>בשבוע: ${hrsT(r.week.reg)} שעות רגילות (לא מעבר ל-${ot.week_hours}), ${hrsT(r.week.h125)} ב-125%, ${hrsT(r.week.h150)} ב-150%${cite(ln.count.section, ln.directive_url)}</li>`
			+ `<li>${hrsT(r.week.h125)} × ${money(r.rate)} × 1.25 + ${hrsT(r.week.h150)} × ${money(r.rate)} × 1.5 = ${nis(r.pay.extra)} בשבוע; × ${EXAMPLE.weeks} שבועות = ${nis(r.month.extra)} בחודש</li>`
			+ `<li>אם לא שולם: ${nis(r.month.gap)} × ${r.back.months} חודשים = ${nis(r.back.amount)}; החודש המוקדם (${heMonth(r.back.oldest)}) מתיישן ב-${isoToHe(r.back.oldestLapse)}${cite(ln.limitation.section, ln.limitation_url)}</li></ol>`,
		compare_table: compareTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

/** A day as a token: "0730-1900" for a range, "9.5" for hours, "n" for none (the link never carries free text). */
function dayToken(text) {
	const d = nsParseDay(text);
	if (!d.ok || d.empty) { return 'n'; }
	if (d.start !== undefined) { return `${clock(d.start).replace(':', '')}-${clock(d.end).replace(':', '')}`; }
	return String(d.hours);
}
const KIND_CODE = { '': '0', night: 'n', eve: 'e' };
export const KEYS = ['t', 's', 'h', 'o', 'w', 'r', 'q', 'd', 'k', 'b', 'e', 'p', 'm', 'y'];
export function stateOf(i) {
	const kinds = (i.kind || []).map((k) => KIND_CODE[k] || '0').join('').padEnd(7, '0');
	return encodeState({
		t: i.pay === 'hourly' ? 'h' : 'm', s: i.pay === 'hourly' ? '' : i.salary, h: i.pay === 'hourly' ? i.hourly : '',
		o: i.pay === 'hourly' || Number(i.monthHours) === 182 || i.monthHours === '' ? '' : i.monthHours,
		w: Number(i.week) === 6 ? 6 : 5, r: { sat: 's', sun: 'u', fri: 'f' }[i.rest] || 's', q: i.shortDay,
		d: (i.days || []).slice(0, 7).map(dayToken).join('~'), k: /[ne]/.test(kinds) ? kinds : '',
		b: i.brk, e: i.weeks, p: i.paid || '', m: i.months, y: i.youth ? 1 : '',
	});
}
export function inputOf(s) {
	if (!s || !s.d) { return null; }
	const n = (v, d) => (v === undefined || v === '' ? d : Number(v));
	const days = String(s.d).split('~').slice(0, 7).map((x) => (x === 'n' ? '' : x));
	while (days.length < 7) { days.push(''); }
	const kinds = String(s.k || '').padEnd(7, '0').slice(0, 7).split('').map((c) => (c === 'n' ? 'night' : c === 'e' ? 'eve' : ''));
	return {
		pay: s.t === 'h' ? 'hourly' : 'monthly', salary: n(s.s, NS_DEFAULT.salary), hourly: n(s.h, NS_DEFAULT.hourly), monthHours: n(s.o, 182),
		week: s.w === '6' ? 6 : 5, rest: { s: 'sat', u: 'sun', f: 'fri' }[s.r] || 'sat', shortDay: n(s.q, 4), days, kind: kinds,
		brk: n(s.b, 0), weeks: n(s.e, 4), paid: n(s.p, 0), months: n(s.m, 0), youth: s.y === '1', asOf: NS_DEFAULT.asOf,
	};
}

/* ---------------- Browser ---------------- */

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value ?? '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const num = (id) => { const v = String(val(id)).replace(/[,\s₪]/g, ''); return v === '' ? '' : Number(v); };
	return {
		pay: pick('pay', 'monthly'), salary: num('salary'), hourly: num('hourly'), monthHours: num('mh'),
		week: Number(pick('week', '5')), rest: val('rest') || 'sat', shortDay: Number(val('short') || 4),
		days: NS_DAYS.map((x, d) => val(`d${d}`)), kind: NS_DAYS.map((x, d) => val(`k${d}`)),
		brk: num('brk'), weeks: num('weeks'), paid: num('paid'), months: num('months'),
		youth: Boolean(root.querySelector(`input[name="${P}-youth"]:checked`)), asOf: today,
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const ln = reg.labor_nosafot;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(ln.checked_on, ln.refresh_every_days) || (ln.next_update && today >= ln.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן ששכר המינימום התעדכן'); }
	}
	const ids = { salary: 'salary', hourly: 'hourly', monthHours: 'mh', brk: 'brk', weeks: 'weeks', paid: 'paid', months: 'months', pay: 'pay' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const id = ids[e.field] || e.field;
			const box = root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const pay = (root.querySelector(`input[name="${P}-pay"]:checked`) || {}).value || 'monthly';
		form.querySelectorAll('[data-if-monthly]').forEach((el) => { el.hidden = pay !== 'monthly'; });
		form.querySelectorAll('[data-if-hourly]').forEach((el) => { el.hidden = pay !== 'hourly'; });
		const week = (root.querySelector(`input[name="${P}-week"]:checked`) || {}).value || '5';
		form.querySelectorAll('[data-if-five]').forEach((el) => { el.hidden = week !== '5'; });
		const rest = NS_REST[(root.querySelector(`#${P}-rest`) || {}).value || 'sat'];
		form.querySelectorAll(`[data-${P}-slot]`).forEach((el) => { el.classList.toggle(`${P}-slot--rest`, Number(el.getAttribute(`data-${P}-slot`)) === rest); });
		form.querySelectorAll(`[data-${P}-restlabel]`).forEach((el) => { el.textContent = Number(el.getAttribute(`data-${P}-restlabel`)) === rest ? 'מנוחה' : ''; });
	};
	const run = (input, opts = {}) => {
		const r = nsCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? cash(r.month.extra) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: nsBand(r) }); }
		return r;
	};
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root, today)); }, 160);
	};
	// A share link names its tool (/@shaot-nosafot); on a page with several tools only that tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
	}
	sync();
	run(readForm(root, today), { silent: true });
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector(`#${P}-d0`);
			if (first) { setTimeout(() => first.focus({ preventScroll: true }), 350); }
			track('tool_lead_click', { tool_id: TOOL_ID });
		});
	}
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'preset') {
			const key = b.getAttribute('data-preset');
			if (!PRESETS[key]) { return; }
			own = true;
			form.innerHTML = renderForm(reg, nsPreset(key));
			sync();
			run(readForm(root, today));
			track('tool_preset', { tool_id: TOOL_ID, band: key });
			return;
		}
		const input = readForm(root, today);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok) {
			download('shaot-nosafot.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `שעות נוספות: ${e.what}`, description: `${e.rule}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק שעות עבודה ומנוחה ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(ln.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: nsBand(r) });
			const brief = r.ok ? aiBrief(reg, r) : '';
			const purpose = (/purpose=([a-z_]+)/.exec(b.getAttribute('href') || '') || [])[1] || 'mediation';
			if (brief && openSimulation(brief, purpose, b.getAttribute('href'))) {
				ev.preventDefault();
				toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.');
			} else {
				if (brief) { copyText(brief); }
				toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			}
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { own = true; form.innerHTML = renderForm(reg, s); sync(); run(readForm(root, today), { silent: true }); }
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
