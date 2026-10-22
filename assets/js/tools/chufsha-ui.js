/**
 * The labor wave UI (22.10.2026): annual leave and its redemption (chufsha-shnatit, prefix jt47) on
 * /annual-leave-calculator/.
 * The picture is the law's own shape: the seniority staircase of the leave table (the law's step drawn as an outline, the
 * step that applies filled: the law or the extension order, whichever is higher), with the reader's step and the next
 * step marked; under it the leave ledger of the counted years (what each year added, what was used, what is left), the
 * way a payslip's leave line reads. Every bar has its words: the figure caption and each step's label are the text
 * equivalent. Then the dates the law sets (.ics), the scenario for the simulation, the next steps and a one-page print.
 */
import { chCompute, chSeniority, chBand, CH_DEFAULT } from './chufsha-engine.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'chufsha-shnatit';
const P = 'jt47';
const CH_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=employment';

export const EXAMPLE = Object.assign({}, CH_DEFAULT);

/** One click to a full profile; each loads every field and recomputes. */
export const PROFILES = {
	left5: { he: 'חודשי, 5 שנים, עוזבים עכשיו', input: EXAMPLE },
	hourly: { he: 'שעתי, 3 ימים בשבוע, שנה וחצי', input: { start: '2025-05-01', end: '2026-10-31', week: 5, perWeek: 3, regime: 'order', payType: 'hourly', salary: '', hourly: 45, hours: 72, dayValue: '', mode: 'compute', used: 4, balance: '', workedEnd: '', scope: 'window' } },
	work10: { he: 'חודשי, 10 שנים, ממשיכים לעבוד', input: { start: '2016-03-01', end: '', week: 5, perWeek: '', regime: 'order', payType: 'monthly', salary: 15000, hourly: '', hours: '', dayValue: '', mode: 'compute', used: 30, balance: '', workedEnd: '', scope: 'window' } },
	six15: { he: '6 ימים בשבוע, 15 שנים, יתרה מהתלוש', input: { start: '2011-01-01', end: '2026-12-31', week: 6, perWeek: '', regime: 'order', payType: 'monthly', salary: 9000, hourly: '', hours: '', dayValue: '', mode: 'balance', used: '', balance: 40, workedEnd: '', scope: 'window' } },
	small: { he: 'מקום עבודה קטן, 7 שנים, רק החוק', input: { start: '2019-06-01', end: '2026-10-31', week: 5, perWeek: '', regime: 'law', payType: 'monthly', salary: 8000, hourly: '', hours: '', dayValue: '', mode: 'compute', used: 25, balance: '', workedEnd: '', scope: 'window' } },
};

const REGIME_HE = { order: 'החוק או צו ההרחבה, הגבוה מביניהם', law: 'רק החוק', manpower: 'עובדי קבלן כוח אדם' };
const SRC_HE = { law: 'החוק', order: 'צו ההרחבה', manpower: 'צו קבלני כוח אדם' };
const chCite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const chNis = (n) => `${money(n, Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2)} ₪`;
const chDivHe = (r) => (r.p.perWeek === r.p.week ? (r.p.week === 6 ? '25' : '21⅔') : money(r.divisor, 2));
const chMonthYear = (iso) => { const [y, m] = iso.split('-').map(Number); return `${m}.${y}`; };

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, CH_DEFAULT, input || {});
	const working = i.end === '' || i.end === null || i.end === undefined;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const text = (id, label, value, ph, hint = '', attrs = '') => `<div class="jtool-field"${attrs}><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" class="jtool-input" type="text" inputmode="${/date|start|end/.test(id) ? 'text' : 'decimal'}" autocomplete="off" value="${esc(value)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const dateVal = (v) => (v ? isoToHe(v) : '');
	return `<div class="${P}-profiles" role="group" aria-label="פרופילים מוכנים"><p class="${P}-profiles__h">בלחיצה אחת:</p><div class="jtool-chips">${Object.entries(PROFILES).map(([k, v]) => `<button type="button" class="${P}-chip" data-act="profile" data-profile="${k}">${esc(v.he)}</button>`).join('')}</div></div>`
		+ `<fieldset class="jtool-field"><legend>איפה אתם עומדים</legend><div class="jtool-chips">${chip('st', 'left', 'סיימתי או מסיים/ת לעבוד', !working)}${chip('st', 'work', 'עדיין עובד/ת שם', working)}</div></fieldset>`
		+ `<div class="jtool-row">${text('start', 'יום תחילת העבודה', dateVal(i.start), 'לדוגמה: 1.9.2021')}${text('end', 'יום העבודה האחרון', dateVal(i.end), 'לדוגמה: 31.10.2026', 'גם תאריך מתוכנן', working ? ' data-if-left hidden' : ' data-if-left')}</div>`
		+ `<fieldset class="jtool-field"><legend>שבוע העבודה במקום העבודה</legend><div class="jtool-chips">${chip('wk', '5', '5 ימים', Number(i.week) !== 6)}${chip('wk', '6', '6 ימים', Number(i.week) === 6)}</div></fieldset>`
		+ `<div class="jtool-row">${text('pw', 'כמה ימים בשבוע אתם עובדים', i.perWeek === '' ? '' : i.perWeek, Number(i.week) === 6 ? '6' : '5', 'משרה חלקית בימים: פחות ימים; בשעות: אותו מספר ימים')}</div>`
		+ `<fieldset class="jtool-field"><legend>מה חל על מקום העבודה</legend><div class="jtool-chips">${chip('rg', 'order', 'רוב המעסיקים: החוק או צו ההרחבה', i.regime !== 'law' && i.regime !== 'manpower')}${chip('rg', 'law', 'רק החוק (פחות מ-4 עובדים, הסכם קיבוצי, חברה ממשלתית או עירונית)', i.regime === 'law')}${chip('rg', 'manpower', 'מועסק/ת דרך קבלן כוח אדם', i.regime === 'manpower')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>איך משולם השכר</legend><div class="jtool-chips">${chip('pt', 'monthly', 'משכורת חודשית', i.payType !== 'hourly')}${chip('pt', 'hourly', 'לפי שעה או יום', i.payType === 'hourly')}</div></fieldset>`
		+ `<div class="jtool-row">${text('sal', 'שכר חודשי ברוטו (שכר רגיל)', i.salary, 'לדוגמה: 12,000', 'בלי שעות נוספות והחזרי הוצאות', i.payType === 'hourly' ? ' data-if-monthly hidden' : ' data-if-monthly')}${text('hr', 'שכר לשעה', i.hourly, 'לדוגמה: 45', '', i.payType === 'hourly' ? ' data-if-hourly' : ' data-if-hourly hidden')}${text('hrs', 'ממוצע שעות בחודש', i.hours, 'לדוגמה: 160', 'ברבע השנה האחרון, או ברבע המלא ביותר בשנה', i.payType === 'hourly' ? ' data-if-hourly' : ' data-if-hourly hidden')}</div>`
		+ `<fieldset class="jtool-field"><legend>מה ידוע על הימים</legend><div class="jtool-chips">${chip('md', 'compute', 'לחשב לפי החוק, פחות מה שניצלתי', i.mode !== 'balance')}${chip('md', 'balance', 'יש לי יתרה מהתלוש', i.mode === 'balance')}</div></fieldset>`
		+ `<div class="jtool-row">${text('used', 'ימי חופשה שניצלתם בשנים שנספרות', i.used, '0', 'בשנה האחרונה ובשלוש שלפניה', i.mode === 'balance' ? ' data-if-compute hidden' : ' data-if-compute')}${text('bal', 'יתרת ימי חופשה בתלוש האחרון', i.balance, 'לדוגמה: 18', 'התלוש חייב להראות את היתרה', i.mode === 'balance' ? ' data-if-balance' : ' data-if-balance hidden')}</div>`
		+ `<details class="jtool-more"${i.workedEnd !== '' || i.dayValue !== '' || i.scope === 'all' ? ' open' : ''}><summary>ימי עבודה בפועל, ערך יום מהתלוש, כל השנים</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${text('wkd', 'ימי עבודה בפועל בשנה האחרונה', i.workedEnd, 'לפי לוח השבוע', 'בלי ימי חג, מחלה, מילואים ולידה')}${text('dv', 'ערך יום חופשה מהתלוש', i.dayValue, 'לפי היחס בחוק', 'אם בתלוש רשום ערך יום, הוא גובר')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('sc', 'all', 'לספור את כל השנים, לא רק את 4 האחרונות', i.scope === 'all', 'checkbox')}</div></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const lw = reg.labor_chufsha.law;
	if (r.mode === 'temp') { return `עבודה של ${r.spanDays} ימים בלבד, לפי שעה או יום: במקום ימי חופשה מגיעה תמורת חופשה של ${r.tempPct}% לפחות מהשכר (${lw.sections.temp_pay}).`; }
	const yr = `בשנה ${r.window.to} (שנת ותק ${r.row.n}) מגיעים ${r.row.net} ימי עבודה בשבוע של ${r.p.week} ימים`;
	const money2 = `${money(r.days, Number.isInteger(r.days) ? 0 : 2)} ימים × ${chNis(r.dayValue)} = ${chNis(r.value)}`;
	const base = r.mode === 'balance' ? `לפי היתרה בתלוש: ${money2}.` : `נצברו ${r.accrued} ימים ב-${r.window.from}${r.window.from === r.window.to ? '' : ` עד ${r.window.to}`}, נוצלו ${r.used}: ${money2}.`;
	if (r.p.ended) { return `פדיון חופשה בסיום העבודה: ${base} ${yr}. משולם עם שכר חודש הסיום, עד ${isoToHe(r.dates.due)}; מ-${isoToHe(r.dates.lateFrom)} הוא שכר מולן.`; }
	return `היתרה שלכם היום: ${base} ${yr}. את החופשה של ${r.window.to} לוקחים עד ${isoToHe(r.dates.takeBy)}, אלא אם הוסכם להעביר יתרה.`;
}

/** The seniority staircase: the law's step (outline), the step that applies (fill), the reader's and the next step. */
export function staircase(reg, r) {
	if (!r.ok || r.mode === 'temp') { return ''; }
	const lc = reg.labor_chufsha;
	const last = Math.max(15, r.row.n + 1);
	const steps = [];
	for (let k = 1; k <= last; k += 1) { steps.push(chSeniority(lc, k, r.p.week, r.p.regime)); }
	const top = Math.max(...steps.map((s) => Math.max(s.net, s.lawNet)), 1);
	const next = r.nextRow;
	const cap = `מדרגות החופשה בשבוע של ${r.p.week} ימים (${REGIME_HE[r.p.regime]}): אתם בשנת ותק ${r.row.n}, ${r.row.net} ימי עבודה בשנה${r.row.src !== 'law' ? ` לפי ${SRC_HE[r.row.src]} (החוק: ${r.row.lawNet})` : ''}.${next ? ` המדרגה הבאה: שנת ותק ${next.n} (${next.year}), ${next.net} ימים.` : ' זו המדרגה העליונה.'}`;
	const li = steps.map((s) => {
		const me = s.n === r.row.n;
		const nx = next && s.n === next.n;
		return `<li class="${P}-step${me ? ` ${P}-step--me` : ''}${nx ? ` ${P}-step--next` : ''}" style="--h:${((s.net / top) * 100).toFixed(1)}%;--l:${((s.lawNet / top) * 100).toFixed(1)}%">`
			+ `<span class="${P}-step__bar" aria-hidden="true"></span>${s.lawNet !== s.net ? `<i class="${P}-step__law" aria-hidden="true"></i>` : ''}<span class="${P}-step__v" aria-hidden="true"><bdi>${s.net}</bdi></span>`
			+ `<span class="${P}-step__n" aria-hidden="true">${s.n === last && last >= 14 ? `${s.n}+` : s.n}</span>`
			+ `<span class="${P}-sr">שנת ותק ${s.n}: ${s.net} ימים${s.src !== 'law' ? ` לפי ${SRC_HE[s.src]}, ${s.lawNet} לפי החוק` : ' לפי החוק'}${me ? ' (אתם כאן)' : ''}${nx ? ' (המדרגה הבאה)' : ''}</span></li>`;
	}).join('');
	return `<figure class="${P}-stairs"><figcaption class="${P}-stairs__h">${esc(cap)}</figcaption><ol class="${P}-stairs__list">${li}</ol>`
		+ `<p class="${P}-keys" aria-hidden="true"><span><i class="${P}-k ${P}-k--fill"></i>הימים שמגיעים</span>${r.p.regime !== 'law' ? `<span><i class="${P}-k ${P}-k--law"></i>הימים לפי החוק לבדו</span>` : ''}<span><i class="${P}-k ${P}-k--me"></i>אתם</span><span class="${P}-keys__x">ציר: שנות ותק</span></p></figure>`;
}

/** The leave ledger of the counted years: what each year added, what was used, what is left. */
export function ledgerBar(reg, r) {
	if (!r.ok || r.mode === 'temp') { return ''; }
	const yrs = r.years.filter((y) => y.inWindow && !y.pre);
	const total = Math.max(r.accrued, 1);
	const used = r.mode === 'compute' ? Math.min(r.used, r.accrued) : null;
	const left = r.mode === 'compute' ? r.days : null;
	const seg = yrs.map((y) => `<span class="${P}-led__y${y.net < y.full ? ` ${P}-led__y--part` : ''}" style="flex:${Math.max(y.net, 0.0001)} 1 0"><bdi>${y.year}</bdi> <b><bdi>${y.net}</bdi></b></span>`).join('');
	const cap = r.mode === 'compute'
		? `החשבון של ${r.window.from}${r.window.from === r.window.to ? '' : `-${r.window.to}`}: נצברו ${r.accrued} ימים (${yrs.map((y) => `${y.year}: ${y.net}`).join(', ')}), נוצלו ${used}, נשארו ${left}.`
		: `לפי החוק נצברו ב-${r.window.from}${r.window.from === r.window.to ? '' : `-${r.window.to}`} ${r.accrued} ימים (${yrs.map((y) => `${y.year}: ${y.net}`).join(', ')}); בתלוש רשומה יתרה של ${r.days}. ההפרש הוא הימים שנוצלו או שהועברו.`;
	return `<figure class="${P}-led"><figcaption class="${P}-led__h">${esc(cap)}</figcaption><div class="${P}-led__bar" aria-hidden="true">${seg}${used !== null && used > 0 ? `<span class="${P}-led__used" style="width:${((used / total) * 100).toFixed(1)}%"></span>` : ''}</div>`
		+ (r.mode === 'compute' ? `<p class="${P}-keys" aria-hidden="true"><span><i class="${P}-k ${P}-k--fill"></i>נצבר לפי שנה</span><span><i class="${P}-k ${P}-k--used"></i>נוצל</span><span><i class="${P}-k ${P}-k--part"></i>שנה חלקית</span></p>` : '')
		+ `</figure>`;
}

/** The scenario for the simulation: the tool's figures only, never a name or an ID. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const p = r.p;
	const pay = p.payType === 'hourly' ? 'עובד/ת לפי שעה' : 'עובד/ת במשכורת חודשית';
	if (r.mode === 'temp') {
		return `${pay} שעבד/ה ${r.spanDays} ימים בלבד אצל מעסיק אחד. לפי חוק חופשה שנתית מגיעה במקום ימי חופשה תמורת חופשה של ${r.tempPct}% לפחות מהשכר. השאלה לתרגול: השיחה עם המעסיק בסיום העבודה. איך מבקשים את תמורת החופשה, ומה עונים כשהמעסיק אומר שעובד זמני לא זכאי לכלום?`;
	}
	const when = p.ended ? `עד ${isoToHe(p.end)}` : 'ועדיין עובד/ת שם';
	const days = r.mode === 'balance' ? `בתלוש רשומה יתרה של ${r.days} ימים` : `לפי החוק${r.row.src === 'order' ? ' וצו ההרחבה' : ''} נצברו ${r.accrued} ימים ב-${r.window.from} עד ${r.window.to}, נוצלו ${r.used} ונשארו ${r.days}`;
	const q = p.ended
		? 'השאלה לתרגול: השיחה עם המעסיק על פדיון ימי החופשה בגמר החשבון. איך מציגים את החישוב, ומה עונים כשהמעסיק טוען שהימים נמחקו או נוצלו?'
		: 'השאלה לתרגול: שיחה עם המעסיק על ימי החופשה שנצברו. איך מבקשים לקבוע מועד לחופשה או להעביר יתרה לשנה הבאה, ומה עונים כשהמעסיק מסרב?';
	return `${pay}, שבוע עבודה של ${p.week} ימים, מ-${chMonthYear(p.start)} ${when} (שנת ותק ${r.row.n}). ${days}. ערך יום חופשה: ${chNis(r.dayValue)}, ובסך הכול ${chNis(r.value)}${p.ended ? `, שמשולמים עם שכר חודש הסיום` : ' אם העבודה מסתיימת היום'}. ${q}`;
}

/** "What to do now": the official service and guide, then 2-4 pages of this site. */
export function nextActions(reg, r) {
	const lc = reg.labor_chufsha;
	const official = [
		{ he: `לבדוק בתלוש את שורת החופשה: הימים שניתנו והיתרה (${lc.wage.payslip_section} לחוק הגנת השכר)`, url: lc.wage.url },
		{ he: 'המדריך של משרד העבודה: טבלת הימים לפי החוק וצו ההרחבה', url: lc.guide.ch3 },
		{ he: lc.services.complaint_he, url: lc.services.complaint_url },
	];
	const links = r.ok && r.p.ended
		? [
			{ path: '/gmar-cheshbon/', he: 'גמר חשבון: כל מה שמגיע בסיום העבודה, בטבלה אחת' },
			{ path: '/notice-of-dismissal/', he: 'הודעה מוקדמת: ימי ההודעה שמעל 14 נספרים כחופשה' },
			{ path: '/havraa-pay-calculator/', he: 'דמי הבראה: נבדקים יחד עם הפדיון' },
			{ path: '/claim-labor-court/', he: 'תביעה בבית הדין לעבודה, אם הפדיון לא שולם' },
		]
		: [
			{ path: '/vacation-days-quota/', he: 'טבלת המכסות המלאה לפי ותק' },
			{ path: '/sick-pay-accrual/', he: 'ימי מחלה: צבירה נפרדת מימי החופשה' },
			{ path: '/net-salary-calculator/', he: 'כמה נשאר נטו מדמי החופשה' },
			{ path: '/havraa-pay-calculator/', he: 'דמי הבראה לפי אותו ותק' },
		];
	return { official, links };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const lc = reg.labor_chufsha;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	const tail = `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${CH_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את השיחה עם המעסיק, עם הנתונים שלכם</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
	if (r.mode === 'temp') {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--info">שימו לב: פחות מ-${lc.law.temp_days} ימים, לפי שעה או יום</p>`
			+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}תמורת חופשה</p><strong class="jtool-verdict__figure"><bdi>${r.tempPct}%</bdi> מהשכר</strong>`
			+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p></div>`
			+ `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` + tail;
	}
	const label = r.p.ended ? 'פדיון חופשה בסיום העבודה' : 'שווי יתרת החופשה, אם העבודה מסתיימת היום';
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי חוק חופשה שנתית${r.row.src === 'order' ? ' וצו ההרחבה' : ''} · שנת ותק ${r.row.n}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${label}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.value)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>ימים לפדיון</dt><dd><bdi>${money(r.days, Number.isInteger(r.days) ? 0 : 2)}</bdi></dd></div><div><dt>ערך יום</dt><dd>${ils(r.dayValue)}</dd></div><div><dt>בשנה ${r.window.to}</dt><dd><bdi>${r.row.net}</bdi> ימים (ותק ${r.row.n})</dd></div></dl>`
		+ `<p class="jtool-scope">${r.dayMethod === 'own' ? 'ערך היום: מהתלוש, כפי שהוקלד.' : `ערך היום: ${chNis(r.p.monthPay)} חלקי ${chDivHe(r)}, היחס שבחוק שכר מינימום לשבוע של ${r.p.week} ימים${r.p.perWeek < r.p.week ? `, ביחס ל-${r.p.perWeek} ימי עבודה` : ''}.`}${chCite(lc.day_ratio.he, lc.day_ratio.url)}</p></div>`
		+ staircase(reg, r)
		+ ledgerBar(reg, r)
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ tail;
}

/** The dates the law sets for this result, as a table. */
export function deadlinesTable(reg, r, opts = {}) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = opts.today && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.what)}</td><td data-th="הכלל">${esc(e.rule)}</td></tr>`; }).join('')
		+ `</tbody><caption>רק מועדים שהחוק קובע.</caption></table></div>`;
}

/** Year by year: the seniority, the days counted, the threshold, the days and where they come from. */
export function yearsTable(reg, r) {
	const lc = reg.labor_chufsha;
	const rows = r.years.map((y) => `<tr${y.inWindow ? '' : ' class="jtool-muted"'}><td data-th="שנה"><bdi>${y.year}</bdi></td><td data-th="ותק"><bdi>${y.n}</bdi></td><td data-th="תקופה"><bdi>${isoToHe(y.from)}</bdi>-<bdi>${isoToHe(y.to)}</bdi></td>`
		+ `<td data-th="ימי עבודה">${y.pre ? '—' : `<bdi>${y.worked}</bdi>${y.overridden ? ' (הוקלד)' : ''} מתוך <bdi>${y.threshold}</bdi>`}</td>`
		+ `<td data-th="ימי חופשה">${y.pre ? 'לפני 2017' : `<bdi>${y.net}</bdi>${y.net < y.full ? ` מתוך <bdi>${y.full}</bdi>` : ''}`}</td><td data-th="לפי">${y.pre ? '—' : esc(SRC_HE[y.src])}</td><td data-th="נספר">${y.inWindow ? 'כן' : 'לא'}</td></tr>`).join('');
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-yr-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">שנה</th><th scope="col">ותק</th><th scope="col">תקופה</th><th scope="col">ימי עבודה</th><th scope="col">ימי חופשה</th><th scope="col">לפי</th><th scope="col">נספר</th></tr></thead><tbody>${rows}</tbody>`
		+ `<caption>שנה שבה העבודה נמשכה כל 12 החודשים: מלוא הימים מ-${lc.law.full_year_days} ימי עבודה, ומתחת לזה חלק יחסי (${lc.law.sections.full_year}); שנה חלקית: לפי ${lc.law.part_year_days} (${lc.law.sections.part_year}). ${lc.law.fraction_he}. ימי העבודה נספרו לפי לוח השבוע, כולל ימי חג.</caption></table></div>`;
}

/** What changed and when: the published s.3(א) values over time. */
export function historyTable(reg) {
	const h = reg.labor_chufsha.history;
	const lt = reg.labor_chufsha.law_table.rows;
	const b = h.before.rows;
	const val = (rows, n) => (rows.find((x) => n >= x.from && (x.to === null || n <= x.to)) || {}).gross;
	const line = (label, a, c) => `<tr><th scope="row">${esc(label)}</th><td data-th="${esc(h.before.he)}">${a}</td><td data-th="1.7.2016-31.12.2016">${c}</td><td data-th="מ-1.1.2017">${esc(String(val(lt, Number(label.split('-')[0]))))}</td></tr>`;
	const tbody = line('1-4', String(val(b, 1)), String(h.amendment.temp_days)) + line('5', String(val(b, 5)), String(val(b, 5))) + line('6', String(val(b, 6)), String(val(b, 6))) + line('7', String(val(b, 7)), String(val(b, 7)));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-hist-h" tabindex="0"><table class="jtool-table ${P}-hist"><thead><tr><th scope="col">שנת ותק</th><th scope="col">${esc(h.before.he)}</th><th scope="col">1.7.2016-31.12.2016</th><th scope="col">מ-1.1.2017</th></tr></thead><tbody>${tbody}`
		+ `<tr><th scope="row">8 ואילך</th><td colspan="3">${esc(h.before.after_he)} (ללא שינוי)</td></tr></tbody>`
		+ `<caption>ימי חופשה ברוטו לפי סעיף 3(א). ${esc(h.amendment.he)}, ${esc(h.amendment.gazette_he)}: ${esc(h.amendment.change_he)}; ${esc(h.amendment.temp_he)}. ${esc(h.order_he)}: טבלה נפרדת לעובדי קבלן כוח אדם.</caption></table></div>`;
}

/** The one-page print: inputs, result, the computation path, the dates, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const lc = reg.labor_chufsha;
	const p = r.p;
	const path = r.mode === 'temp' ? `<li>${esc(lc.law.temp_he)}</li>` : r.years.filter((y) => y.inWindow && !y.pre).map((y) => `<li>${y.year} (ותק ${y.n}): ${y.worked} ימי עבודה מתוך ${y.threshold}: ${y.net} ימים${y.net < y.full ? ` (חלק יחסי מ-${y.full})` : ''}, לפי ${SRC_HE[y.src]}</li>`).join('')
		+ (r.mode === 'compute' ? `<li>נצברו ${r.accrued}, נוצלו ${r.used}: נשארו ${r.days} ימים</li>` : `<li>יתרה בתלוש: ${r.days} ימים</li>`)
		+ `<li>${r.days} × ${chNis(r.dayValue)} = ${chNis(r.value)}</li>`;
	return `<h3>חופשה שנתית ופדיון: סיכום</h3>`
		+ `<p><strong>הנתונים:</strong> ${p.payType === 'hourly' ? `לפי שעה, ${chNis(p.hourly)} לשעה, ${p.hours} שעות בחודש` : `משכורת חודשית ${chNis(p.monthPay)}`}; שבוע של ${p.week} ימים${p.perWeek < p.week ? `, עבודה ${p.perWeek} ימים בשבוע` : ''}; ${REGIME_HE[p.regime]}; מ-${isoToHe(p.start)} ${p.ended ? `עד ${isoToHe(p.end)}` : `ועד היום (${isoToHe(p.end)})`}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p><ol>${path}</ol>`
		+ `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.what)} (${esc(e.rule)})`).join('; ')}.</p>`
		+ `<p><strong>מקורות:</strong> ${esc(lc.law.he)}, נוסח ל-${isoToHe(lc.law.current_to)}, סעיפים 3, 10, 13, 17, 31; ${esc(lc.guide.he)}; ${esc(lc.day_ratio.he)}; ${esc(lc.wage.he)}, ${esc(lc.wage.due_section)} ו-${esc(lc.wage.late_section)}. נבדק ${isoToHe(lc.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const lc = reg.labor_chufsha;
	const lw = lc.law;
	let out = `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שהחוק קובע</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>${deadlinesTable(reg, r, opts)}</div>`;
	if (r.mode !== 'temp') { out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-yr-h">שנה אחרי שנה</h3></div>${yearsTable(reg, r)}</div>`; }
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-hist-h">מה השתנה ומתי</h3></div>${historyTable(reg)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-rules-h">הכללים שהמחשבון מפעיל</h3></div><ul class="${P}-rules">`
		+ [
			[lw.work_year_he, lw.sections.work_year],
			[lw.gross_he, lw.sections.length],
			[lw.when_he, lw.sections.when],
			[lw.own_day_he, lw.sections.own_day],
			[lw.carry_he, lw.sections.carry],
			[lw.split_he, lw.sections.split],
			[`את תאריך תחילת החופשה קובעים לפחות ${lw.start_notice_days} ימים מראש`, lw.sections.start_notice],
			[`לא נספרים כימי חופשה: ${lw.not_counted_he.join('; ')}`, lw.sections.not_counted],
			[lw.pay_monthly_he, lw.sections.pay_monthly],
			[lw.pay_wage_he, lw.sections.pay_wage],
			[lw.pay_due_he, lw.sections.pay_due],
			[lw.redeem_he, lw.sections.redeem],
			[lw.as_wage_he, lw.sections.as_wage],
			[lw.dispute_he, lw.sections.dispute],
			[lw.limitation_he, lw.sections.limitation],
		].map(([t, s]) => `<li>${esc(t)}.${chCite(s, lw.url)}</li>`).join('')
		+ `<li>${esc(lc.extended.text_he)}.${chCite(lc.extended.he, lc.extended.url)}</li><li>${esc(lc.guide.minimum_he)}.${chCite('משרד העבודה', lc.guide.url)}</li></ul></div>`
		+ `</div>`;
	out += `<div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || lc.checked_on)}</div>`;
	return out;
}

/** Page section: the law's table (gross and net), the extension order and the manpower order, from the registry. */
export function compareTable(reg) {
	const lc = reg.labor_chufsha;
	const span = (x) => (x.to === null ? `${x.from} ואילך` : x.from === x.to ? `${x.from}` : `${x.from}-${x.to}`);
	const law = lc.law_table.rows.map((x) => `<tr><td data-th="שנות ותק"><bdi>${span(x)}</bdi></td><td data-th="ימים ברוטו (החוק)"><bdi>${x.gross}</bdi></td><td data-th="ימי עבודה, שבוע של 6"><bdi>${x.net6}</bdi></td><td data-th="ימי עבודה, שבוע של 5"><bdi>${x.net5}</bdi></td></tr>`).join('');
	const ord = lc.order_table.rows.map((x) => `<tr><td data-th="שנות ותק"><bdi>${span(x)}</bdi></td><td data-th="צו ההרחבה, שבוע של 6"><bdi>${x.net6}</bdi></td><td data-th="צו ההרחבה, שבוע של 5"><bdi>${x.net5}</bdi></td><td data-th="מה שמגיע בשבוע של 5"><bdi>${chSeniority(lc, x.from, 5, 'order').net}</bdi>${x.to !== x.from ? '+' : ''}</td></tr>`).join('');
	const mp = lc.manpower_table.rows.map((x) => `<tr><td data-th="שנות ותק"><bdi>${span(x)}</bdi></td><td data-th="שבוע של 6"><bdi>${x.net6}</bdi></td><td data-th="שבוע של 5"><bdi>${x.net5}</bdi></td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(lc.law_table.he)} (${esc(lc.law_table.section)}), כפי שמשרד העבודה מפרסם: ימים ברוטו (כולל מנוחה שבועית) וימי העבודה שבתוכם</caption><thead><tr><th scope="col">שנות ותק</th><th scope="col">ימים ברוטו (החוק)</th><th scope="col">ימי עבודה, שבוע של 6</th><th scope="col">ימי עבודה, שבוע של 5</th></tr></thead><tbody>${law}</tbody></table></div>`
		+ `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(lc.order_table.he)}: ימי עבודה נטו. ${esc(lc.order_table.better_he)}</caption><thead><tr><th scope="col">שנות ותק</th><th scope="col">צו ההרחבה, שבוע של 6</th><th scope="col">צו ההרחבה, שבוע של 5</th><th scope="col">מה שמגיע בשבוע של 5</th></tr></thead><tbody>${ord}</tbody></table></div>`
		+ `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(lc.manpower_table.he)}: ימי עבודה נטו לעובדי קבלן כוח אדם</caption><thead><tr><th scope="col">שנות ותק</th><th scope="col">שבוע של 6</th><th scope="col">שבוע של 5</th></tr></thead><tbody>${mp}</tbody></table></div>`;
}

/** The result-first card ([justice_tool_lead]): the computed redemption of the example (or of the reader's own answers
 * once they change anything), one line of why, and a jump to the form. Same markup on the server and in the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הנתונים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">חופשה שנתית ופדיון</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	if (r.mode === 'temp') {
		return `<p class="jtool-lead__label">${opts.example ? 'דוגמה מחושבת: ' : ''}תמורת חופשה</p><p class="jtool-lead__row"><strong class="jtool-lead__figure"><bdi>${r.tempPct}%</bdi></strong><span class="jtool-lead__unit">מהשכר</span></p><p class="jtool-lead__line">${esc(verdictSentence(reg, r))}</p>${go}`;
	}
	const p = r.p;
	const label = `${opts.example ? 'דוגמה מחושבת: ' : ''}${p.ended ? 'פדיון חופשה בסיום העבודה' : 'שווי יתרת החופשה היום'}`;
	const who = `${p.payType === 'hourly' ? 'לפי שעה' : 'משכורת חודשית'}, שבוע של ${p.week} ימים, מ-${isoToHe(p.start)} עד ${isoToHe(p.end)}, שנת ותק ${r.row.n}: ${r.row.net} ימים בשנה.`;
	const due = p.ended ? ` משולם עם שכר חודש הסיום, עד ${isoToHe(r.dates.due)}.` : ` את ימי ${r.window.to} לוקחים עד ${isoToHe(r.dates.takeBy)}.`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${ils(r.value)}</strong><span class="jtool-lead__unit"><bdi>${money(r.days, Number.isInteger(r.days) ? 0 : 2)}</bdi> ימים × ${ils(r.dayValue)}</span></p>`
		+ `<p class="jtool-lead__line">${esc(who + due)}</p>${go}`;
}

export function snapshot(reg) {
	const lc = reg.labor_chufsha;
	const r = chCompute(reg, EXAMPLE);
	const yrs = r.years.filter((y) => y.inWindow);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.value,
		sticky: ils(r.value),
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: lc.checked_on }),
		method: `<ol><li>שנת עבודה היא שנה קלנדרית, והוותק נספר בשנים הקלנדריות שבהן התקיימה העבודה: ${isoToHe(EXAMPLE.start)} עד ${isoToHe(EXAMPLE.end)} הן 6 שנות ותק${chCite(lc.law.sections.work_year, lc.law.url)}</li>`
			+ yrs.map((y) => `<li>${y.year} (ותק ${y.n}): ${y.fullRel ? 'כל השנה' : 'חלק מהשנה'}, ${y.worked} ימי עבודה ${y.worked >= y.threshold ? `(לפחות ${y.threshold}): ${y.net} ימים` : `מתוך ${y.threshold}: ${y.worked} × ${y.full} ÷ ${y.threshold} = ${y.net} ימים (בלי חלקי יום)`}, לפי ${SRC_HE[y.src]}${chCite(y.fullRel ? lc.law.sections.full_year : lc.law.sections.part_year, lc.law.url)}</li>`).join('')
			+ `<li>נצברו ${r.accrued} ימים, נוצלו ${r.used}: נשארו ${r.days}${chCite(lc.law.sections.redeem, lc.law.url)}</li>`
			+ `<li>ערך יום: ${money(EXAMPLE.salary, 0)} ₪ ÷ 21⅔ = ${money(r.dayValue)} ₪${chCite(lc.day_ratio.he, lc.day_ratio.url)}</li>`
			+ `<li>${r.days} × ${money(r.dayValue)} ₪ = ${money(r.value)} ₪, משולם עם שכר אוקטובר, עד ${isoToHe(r.dates.due)}${chCite(`${lc.wage.due_section} לחוק הגנת השכר`, lc.wage.url)}</li></ol>`,
		compare_table: compareTable(reg) + historyTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

export function stateOf(i) {
	return encodeState({
		s: i.start, e: i.end || '', w: Number(i.week) === 6 ? 6 : 5, d: i.perWeek === '' ? '' : i.perWeek, g: i.regime === 'law' ? 'l' : i.regime === 'manpower' ? 'm' : '',
		t: i.payType === 'hourly' ? 'h' : '', a: i.payType === 'hourly' ? '' : i.salary, h: i.payType === 'hourly' ? i.hourly : '', o: i.payType === 'hourly' ? i.hours : '',
		v: i.dayValue, b: i.mode === 'balance' ? i.balance : '', u: i.mode === 'balance' ? '' : i.used, k: i.workedEnd, c: i.scope === 'all' ? 'a' : '',
	});
}
export const KEYS = ['s', 'e', 'w', 'd', 'g', 't', 'a', 'h', 'o', 'v', 'b', 'u', 'k', 'c'];
export function inputOf(s) {
	if (!s || !s.s) { return null; }
	const n = (v) => (v === undefined || v === '' ? '' : Number(v));
	return {
		start: s.s, end: s.e || '', week: s.w === '6' ? 6 : 5, perWeek: n(s.d), regime: s.g === 'l' ? 'law' : s.g === 'm' ? 'manpower' : 'order',
		payType: s.t === 'h' ? 'hourly' : 'monthly', salary: n(s.a), hourly: n(s.h), hours: n(s.o), dayValue: n(s.v),
		mode: s.b !== undefined ? 'balance' : 'compute', balance: n(s.b), used: n(s.u), workedEnd: n(s.k), scope: s.c === 'a' ? 'all' : 'window',
	};
}

function chHeToIso(text) {
	const raw = String(text || '').trim();
	const m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	const y = m[3].length === 2 ? `20${m[3]}` : m[3];
	return `${y}-${String(m[2]).padStart(2, '0')}-${String(m[1]).padStart(2, '0')}`;
}

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const num = (id) => { const v = String(val(id)).replace(/[,\s₪]/g, ''); return v === '' ? '' : Number(v); };
	const working = pick('st', 'left') === 'work';
	const payType = pick('pt', 'monthly');
	const mode = pick('md', 'compute');
	return {
		start: chHeToIso(val('start')), end: working ? '' : chHeToIso(val('end')), asOf: today, week: Number(pick('wk', '5')), perWeek: num('pw'),
		regime: pick('rg', 'order'), payType, salary: payType === 'hourly' ? '' : num('sal'), hourly: payType === 'hourly' ? num('hr') : '', hours: payType === 'hourly' ? num('hrs') : '',
		dayValue: num('dv'), mode, used: mode === 'balance' ? '' : num('used'), balance: mode === 'balance' ? num('bal') : '', workedEnd: num('wkd'),
		scope: root.querySelector(`input[name="${P}-sc"]:checked`) ? 'all' : 'window',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const lc = reg.labor_chufsha;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(lc.checked_on, lc.refresh_every_days) || (lc.next_update && today >= lc.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהטבלה התעדכנה'); }
	}
	const ids = { start: 'start', end: 'end', perWeek: 'pw', salary: 'sal', hourly: 'hr', hours: 'hrs', dayValue: 'dv', balance: 'bal', used: 'used', workedEnd: 'wkd' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const id = ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const pick = (name, d) => (form.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
		const working = pick('st', 'left') === 'work';
		const hourly = pick('pt', 'monthly') === 'hourly';
		const balance = pick('md', 'compute') === 'balance';
		form.querySelectorAll('[data-if-left]').forEach((el) => { el.hidden = working; });
		form.querySelectorAll('[data-if-monthly]').forEach((el) => { el.hidden = hourly; });
		form.querySelectorAll('[data-if-hourly]').forEach((el) => { el.hidden = !hourly; });
		form.querySelectorAll('[data-if-compute]').forEach((el) => { el.hidden = balance; });
		form.querySelectorAll('[data-if-balance]').forEach((el) => { el.hidden = !balance; });
	};
	const run = (input, opts = {}) => {
		const r = chCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.value) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: chBand(r) }); }
		return r;
	};
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root, today)); }, 160);
	};
	// A share link names its tool (/@chufsha-shnatit); on a page with several tools only that tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(readForm(root, today), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector(`.${P}-chip, input:not([type="radio"]):not([type="checkbox"])`);
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
		if (act === 'profile') {
			const pr = PROFILES[b.getAttribute('data-profile')];
			if (!pr) { return; }
			own = true;
			form.innerHTML = renderForm(reg, pr.input);
			sync();
			run(readForm(root, today));
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-profile') });
			return;
		}
		const input = readForm(root, today);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok) {
			download('chufsha-shnatit.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `חופשה שנתית: ${e.what}`, description: `${e.rule}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק חופשה שנתית ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(lc.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: chBand(r) });
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
