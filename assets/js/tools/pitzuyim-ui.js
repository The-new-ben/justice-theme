/**
 * Wave 5 UI: severance pay and the advance notice (HAD-504). The service ruler shows the years of work, the part that
 * section 14 put in the pension fund and the part the employer still owes; the timeline after it shows the notice and
 * the payment deadlines of the Wage Protection Law. The table, the letter and the .ics say the same in text.
 */
import { compute, byArrangement, RESIGN_CODES, pzBase, pzFundCheck, pzChanges } from './pitzuyim-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, decodeList, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';
import { openSimulation } from './sim-handoff.js';

export const TOOL_ID = 'pitzuyim';
const P = 'jt13';

export const EXAMPLE = { payType: 'monthly', salary: 12000, hourly: '', hours: '', jobPct: '', start: '2018-03-01', end: '2026-09-30', reason: 'fired', s14: 'partial', s14Pct: '', s14From: '', noticeDate: '', noticeMode: 'worked', change: false, changeDate: '', prevPct: '', prevSalary: '', prevHours: '', prevHourly: '', manyChanges: false, unpaidExcess: '', groundOk: false, nearClaim: false, seasonal: false, otherBreaks: false, misconduct: false, commission: '' };

const S14_LABEL = { none: 'אין סעיף 14', partial: 'סעיף 14 על 72%', full: 'סעיף 14 מלא (100%)', custom: 'אחוז אחר לפי ההסכם' };
const REASON_LABEL = { health: 'בריאות', parent: 'הורות (9 חודשים)', move: 'מעבר דירה', term: 'חוזה שלא חודש', worse: 'הרעת תנאים', retire: 'גיל פרישה' };
const MARK = { bad: '✕', warn: '!', info: 'i', ok: '✓' };
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
// The labor wave (22.10.2026): the new parts (the payslip strip, the deposit check, the lead card, the scenario, the print
// summary, "what changed") use the jt49 prefix; everything above keeps jt13.
const Q = 'jt49';
const PZ_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=employment';
const PZ_STATUS = { in: 'נכנס', avg: 'ממוצע 12 חודשים', out: 'לא נכנס', check: 'לא נכנס, לבדיקה' };
const pzBlank = (v) => v === '' || v === undefined || v === null;
const pzDay = (d) => (/^\d{4}$/.test(String(d)) ? String(d) : isoToHe(d));

/** One click to a full profile: each chip loads every answer and recomputes. */
export const PROFILES = {
	example: { he: 'חודשי, 8 שנים, פוטר, סעיף 14 על 72%', input: EXAMPLE },
	hourly: { he: 'שעתי, 3 שנים, פוטר', input: Object.assign({}, EXAMPLE, { payType: 'hourly', salary: '', hourly: 45, hours: 160, start: '2023-10-01', end: '2026-09-30', s14: 'none' }) },
	resign: { he: 'חודשי, התפטר, סעיף 14 מלא', input: Object.assign({}, EXAMPLE, { salary: 15000, start: '2019-01-01', reason: 'resign', s14: 'full' }) },
	veteran: { he: 'ותיק מ-2009, הפרשות לפי צו הפנסיה', input: Object.assign({}, EXAMPLE, { salary: 14000, start: '2009-01-01', s14: 'none', orderRates: true, depFrom: '2009-07-01' }) },
	near: { he: 'פוטר אחרי 11 חודשים', input: Object.assign({}, EXAMPLE, { salary: 9000, start: '2025-11-01', s14: 'none' }) },
};

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
const spanText = (s) => `${s.y ? `${s.y} שנים` : ''}${s.y && (s.m || s.days) ? ', ' : ''}${s.m ? `${s.m} חודשים` : ''}${s.m && s.days ? ' ו-' : ''}${s.days ? `${s.days} ימים` : ''}` || '0 ימים';
const noticeText = (n) => (n.month ? 'חודש' : n.days === 1 ? 'יום אחד' : n.days === 0 ? 'אין (פחות מחודש עבודה)' : `${String(n.days).replace('.5', '½')} ימים`);
// A fixed term that ended: the end day was known in advance, so no notice is presented as owed (review, PR 128).
const r2u = (n) => Math.round(n * 100) / 100;
const nText = (r) => (r.reason === 'term' ? 'לא נדרשת בדרך כלל: מועד הסיום ידוע מראש' : noticeText(r.notice));

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const sv = reg.severance;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const dateField = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(value || ''))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const moneyField = (id, label, value, ph, suffix = '₪') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(value === '' || value === undefined || value === null ? '' : money(value, value % 1 ? 2 : 0))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">${esc(suffix)}</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const hourly = input.payType === 'hourly';
	// A fixed term that ended is its own ending, not a resignation (review, PR 128).
	const kind = input.reason === 'fired' ? 'fired' : input.reason === 'term' ? 'term' : 'resign'; // other_ground is a resignation
	const resign = kind === 'resign';
	const why = (RESIGN_CODES.includes(input.reason) && input.reason !== 'term') || input.reason === 'other_ground' ? input.reason : 'plain';
	const s14 = input.s14 || 'none';
	// The labor wave: the quick profiles, the payslip picker (reg. 1) and the deposit-check fields (jt49).
	const lp = reg.labor_pitzuyim;
	const quick = `<div class="${Q}-quick" role="group" aria-label="פרופילים מוכנים: לחיצה אחת ממלאת הכול ומחשבת"><span class="${Q}-quick__h">בלחיצה אחת</span>${Object.entries(PROFILES).map(([k, p]) => `<button type="button" class="${Q}-quick__chip" data-act="profile" data-profile="${k}">${esc(p.he)}</button>`).join('')}</div>`;
	const parts = input.parts || {};
	const pickOpen = Object.values(parts).some((v) => !pzBlank(v));
	const pick = !lp ? '' : `<details class="jtool-more ${Q}-pick" data-if-pay="monthly"${hourly ? ' hidden' : ''}${pickOpen ? ' open' : ''}><summary>מהתלוש: איזה רכיב נכנס לשכר הקובע (תקנה 1)</summary>`
		+ `<p class="jtool-hint">ממלאים את הסכומים החודשיים מהתלוש האחרון. לפיצויים נכנסים רק הרכיבים שבתקנה 1 לתקנות החישוב, ועמלות לפי הממוצע של 12 החודשים האחרונים (תקנה 9). כשממלאים כאן, השכר והעמלות שלמעלה מתעדכנים לבד.</p>`
		+ `<div class="${Q}-pick__grid">${lp.components.map((c) => `<div class="jtool-field ${Q}-pick__f"><label class="jtool-label" for="${P}-pz-${c.code}">${esc(c.he)} <span class="${Q}-tag ${Q}-tag--${c.status}">${esc(PZ_STATUS[c.status])}</span></label><div class="jtool-input jtool-input--money"><input id="${P}-pz-${c.code}" data-pz="${c.code}" type="text" inputmode="decimal" autocomplete="off" value="${esc(pzBlank(parts[c.code]) ? '' : money(parts[c.code], parts[c.code] % 1 ? 2 : 0))}" placeholder="0" aria-describedby="${P}-pz-${c.code}-r ${P}-pz-${c.code}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="${Q}-pick__rule" id="${P}-pz-${c.code}-r">${esc(c.section)}: ${esc(c.rule_he)}</p><p class="jtool-error" id="${P}-pz-${c.code}-e" role="alert"></p></div>`).join('')}</div>`
		+ `<p class="jtool-hint">${esc(lp.regs.plain_section)}: ${esc(lp.regs.plain_he)}. ${esc(lp.regs.one_job_section)}: ${esc(lp.regs.one_job_he)}. ${esc(lp.regs.temp_section)}: ${esc(lp.regs.temp_he)}.</p></details>`;
	const fundOpen = !pzBlank(input.depWage) || !pzBlank(input.fundBal) || input.orderRates;
	const fundf = !lp ? '' : `<details class="jtool-more ${Q}-fundf"${fundOpen ? ' open' : ''}><summary>בדיקת ההפרשות לפיצויים בקופה</summary><div class="jtool-row" style="margin-top:8px">${moneyField('dw', 'השכר שממנו הפרישו לפנסיה (בתלוש או בדוח השנתי)', input.depWage, 'ריק = השכר הקובע')}${moneyField('fb', 'יתרת הפיצויים בקופה, מהדוח השנתי (לא חובה)', input.fundBal, 'לא חובה')}</div>`
		+ `<div class="jtool-chips">${chip('ord', '1', 'ההפרשות היו לפי צו הפנסיה, בשיעורים שעלו בהדרגה מ-2008 עד 2014', input.orderRates, 'checkbox')}</div>`
		+ `<div data-if-order${input.orderRates && s14 === 'none' ? '' : ' hidden'}>${dateField('df', 'מתי התחילו ההפרשות לפנסיה (ריק = יום תחילת העבודה)', input.depFrom, 'לדוגמה: 1.7.2009')}</div>`
		+ `<p class="jtool-hint">${esc(lp.order.cover_section)}: ${esc(lp.order.cover_he)}.</p></details>`;
	return quick + `<fieldset class="jtool-field"><legend>איך משולם השכר</legend><div class="jtool-chips">${chip('pt', 'monthly', 'משכורת חודשית', !hourly)}${chip('pt', 'hourly', 'לפי שעה או יום', hourly)}</div></fieldset>`
		+ `<div data-if-pay="monthly"${hourly ? ' hidden' : ''}>${moneyField('sal', 'השכר החודשי האחרון (שכר יסוד ותוספות קבועות)', input.salary, 'לדוגמה: 12,000')}</div>`
		+ `${moneyField('com', 'ממוצע חודשי של עמלות או תשלום לפי תפוקה, ב-12 החודשים האחרונים (אם יש)', input.commission, '0')}<p class="jtool-hint">החלק בשכר שמשולם לפי מכירות או תפוקה נכנס לפי הממוצע של 12 החודשים שלפני הסיום (תקנה 9).</p>`
		+ pick
		+ `<div class="jtool-row" data-if-pay="hourly"${hourly ? '' : ' hidden'}>${moneyField('hr', 'שכר לשעה', input.hourly, 'לדוגמה: 45')}${moneyField('hrs', 'ממוצע שעות בחודש', input.hours, 'לדוגמה: 160', 'שעות')}</div>`
		+ `<div class="jtool-row">${dateField('start', 'יום תחילת העבודה', input.start, 'לדוגמה: 1.3.2018')}${dateField('end', 'יום העבודה האחרון', input.end, 'לדוגמה: 30.9.2026')}</div>`
		+ `<fieldset class="jtool-field"><legend>איך העבודה הסתיימה</legend><div class="jtool-chips">${chip('rk', 'fired', 'פוטרתי', kind === 'fired')}${chip('rk', 'resign', 'התפטרתי', resign)}${chip('rk', 'term', 'חוזה לתקופה קצובה הסתיים, ולא הוצע לי לחדש אותו 3 חודשים לפני הסוף', kind === 'term')}</div>`
		+ `<p class="jtool-hint" data-if-term${kind === 'term' ? '' : ' hidden'}>אם המעסיק הציע לחדש את החוזה לפחות 3 חודשים לפני סופו וסירבתם, זו התפטרות ולא פיטורים (סעיף 9): בחרו "התפטרתי".</p>`
		+ `<div class="jtool-chips" data-if-dismissal${kind === 'resign' ? ' hidden' : ''} style="margin-top:8px">${chip('ny', '1', 'עבדתי פחות משנה, והפיטורים היו סמוך לסוף השנה הראשונה (סעיף 3)', input.nearClaim, 'checkbox')}${chip('mis', '1', 'הפיטורים היו בגלל טענה להתנהגות חמורה (משמעתיים)', input.misconduct, 'checkbox')}</div><p class="jtool-error" id="${P}-misconduct-e" role="alert"></p>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('sea', '1', 'עבדתי בעבודה עונתית', input.seasonal, 'checkbox')}</div><p class="jtool-error" id="${P}-seasonal-e" role="alert"></p>`
		+ `<div class="jtool-chips" data-if-resign${resign ? '' : ' hidden'} style="margin-top:8px" role="group" aria-label="סיבת ההתפטרות">${chip('rw', 'plain', 'התפטרות רגילה', why === 'plain')}${RESIGN_CODES.filter((k) => k !== 'term').map((k) => chip('rw', k, REASON_LABEL[k], why === k)).join('')}</div>`
		+ `<div data-if-ground${resign && why !== 'plain' ? '' : ' hidden'} style="margin-top:8px"><div class="jtool-chips">${chip('po', '1', 'התנאים של הסיבה הזאת מתקיימים אצלי', input.groundOk || input.parentOk, 'checkbox')}</div>`
		+ sv.reasons.filter((x) => x.code !== 'term').map((x) => `<p class="jtool-hint" data-ground-hint="${x.code}"${why === x.code ? '' : ' hidden'}>${esc(x.section)}: ${esc(x.conditions_he || x.he)}.</p>`).join('') + '</div>'
		+ `<div class="jtool-chips" data-if-resign${resign ? '' : ' hidden'} style="margin-top:6px">${chip('rw', 'other_ground', 'סיבה אחרת שבחוק (גיוס, שירות לאומי, מקלט, בחירה לרשות מקומית, עבודה עונתית)', input.reason === 'other_ground')}</div><p class="jtool-error" id="${P}-reason-e" role="alert"></p>`
		+ `<p class="jtool-hint">התפטרות מהסיבות האלה נחשבת לפיטורים (סעיפים 6, 7, 8 ו-11 לחוק פיצויי פיטורים), וכך גם חוזה לתקופה קצובה שלא חודש (סעיף 9).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>הפרשות לפנסיה במקום פיצויים (סעיף 14)</legend><div class="jtool-chips">${['none', 'partial', 'full', 'custom'].map((k) => chip('s14', k, S14_LABEL[k], s14 === k)).join('')}</div>`
		+ `<div class="jtool-row" data-if-s14${s14 === 'none' ? ' hidden' : ''} style="margin-top:8px"><div class="jtool-field" data-if-custom${s14 === 'custom' ? '' : ' hidden'}><label class="jtool-label" for="${P}-s14p">אחוז הכיסוי לפי ההסכם</label><div class="jtool-input"><input id="${P}-s14p" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.s14Pct ?? '')}" placeholder="לדוגמה: 72" aria-describedby="${P}-s14Pct-e"><span class="jtool-input__suffix" aria-hidden="true">%</span></div><p class="jtool-error" id="${P}-s14Pct-e" role="alert"></p></div>${dateField('s14f', 'מתי התחילו ההפרשות (ריק = מתחילת העבודה)', input.s14From, 'לא חובה')}</div>`
		+ `<p class="jtool-hint">ברוב התלושים כתוב "סעיף 14". הפרשה של 6% לפיצויים בלי השלמה של 2⅓% מכסה 72%; הפרשה של 8⅓% מכסה 100% (${esc(sv.approval.he)}).</p>${fundf}</fieldset>`
		+ `<details class="jtool-more"${input.noticeDate || (input.noticeMode && input.noticeMode !== 'worked') ? ' open' : ''}><summary>ההודעה המוקדמת</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${dateField('nd', 'יום מסירת ההודעה בכתב', input.noticeDate, 'לא חובה')}<div class="jtool-field"><span class="jtool-label">מה קרה בתקופת ההודעה</span><div class="jtool-chips">${chip('nm', 'worked', 'עבדתי', (input.noticeMode || 'worked') === 'worked')}${chip('nm', 'paid', 'שילמו בלי עבודה', input.noticeMode === 'paid')}${chip('nm', 'none', 'לא ניתנה הודעה', input.noticeMode === 'none')}</div></div></div></details>`
		+ `<details class="jtool-more"${input.jobPct || input.change || input.unpaidExcess ? ' open' : ''}><summary>היקף משרה, שינויים בשכר וחופשה ללא תשלום</summary><div class="jtool-field" style="margin-top:8px"><label class="jtool-label" for="${P}-job">אחוז משרה היום</label><div class="jtool-input"><input id="${P}-job" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.jobPct ?? '')}" placeholder="100" aria-describedby="${P}-jobPct-e"><span class="jtool-input__suffix" aria-hidden="true">%</span></div><p class="jtool-error" id="${P}-jobPct-e" role="alert"></p></div>`
		+ `<div class="jtool-chips">${chip('chg', '1', 'היקף המשרה או השכר השתנו במהלך העבודה', input.change, 'checkbox')}</div>`
		+ `<div data-if-change${input.change ? '' : ' hidden'} style="margin-top:8px"><div class="jtool-row">${dateField('chd', 'מאיזה יום חל השינוי', input.changeDate, 'לדוגמה: 1.1.2022')}<div class="jtool-field" data-if-pay="monthly"${hourly ? ' hidden' : ''}><label class="jtool-label" for="${P}-pp">היקף המשרה לפני השינוי</label><div class="jtool-input"><input id="${P}-pp" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.prevPct ?? '')}" placeholder="לדוגמה: 50" aria-describedby="${P}-prevPct-e"><span class="jtool-input__suffix" aria-hidden="true">%</span></div><p class="jtool-error" id="${P}-prevPct-e" role="alert"></p></div>`
		+ `<div data-if-pay="hourly"${hourly ? '' : ' hidden'}>${moneyField('ph', 'ממוצע שעות בחודש לפני השינוי', input.prevHours, 'לדוגמה: 80', 'שעות')}</div></div>`
		+ `<div data-if-pay="monthly"${hourly ? ' hidden' : ''}>${moneyField('ps', 'השכר לפני השינוי, אם השכר הופחת', input.prevSalary, 'לא חובה')}</div><div data-if-pay="hourly"${hourly ? '' : ' hidden'}>${moneyField('phr', 'השכר לשעה לפני השינוי, אם הופחת', input.prevHourly, 'לא חובה')}</div>`
		+ `<div class="jtool-chips">${chip('many', '1', 'היה יותר משינוי אחד', input.manyChanges, 'checkbox')}</div>`
		+ `<p class="jtool-hint">כל תקופה מחושבת לפי היקף המשרה שלה, על השכר האחרון (תקנה 7); לעובד לפי שעה, לפי השעות של אותה תקופה. אם השכר הופחת, התקופה שלפני ההפחתה לפי השכר שלפניה (תקנה 8).</p><p class="jtool-error" id="${P}-change-e" role="alert"></p></div>`
		+ `<div style="margin-top:8px">${moneyField('ul', 'ימי חופשה ללא תשלום מעבר ל-14 בכל שנת עבודה (סך הכול)', input.unpaidExcess, '0', 'ימים')}<p class="jtool-hint">בכל שנת עבודה סופרים רק את הימים שמעבר ל-14, ומחברים. לדוגמה: חופשה ללא תשלום של 90 ימים בשנה אחת היא 76 ימים. חופשת לידה עם דמי לידה לא נכנסת (תקנה 10(3)).</p>`
		+ `<div class="jtool-chips">${chip('brk', '1', 'היו הפסקות אחרות שלא נספרות (שירות צבאי, מחלה או תאונה בלי תשלום, תקנה 10)', input.otherBreaks, 'checkbox')}</div><p class="jtool-error" id="${P}-breaks-e" role="alert"></p></div></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	if (!r.entitled) {
		return `${spanText(r.span)} עבודה${r.reason === 'resign' ? ' והתפטרות רגילה' : ''}: אין פיצויי פיטורים מהמעסיק${r.s14 !== 'none' ? ', אבל הכספים שהופרשו לפיצויים בקופה שלכם' : ''}. הודעה מוקדמת: ${nText(r)}.`;
	}
	const parts = [r.change ? `${nis(r.prevBase)} לחודש עד השינוי ו-${nis(r.base)} מאז, על ${spanText(r.span)}: ${nis(r.severance)}.` : r.unpaidExcess ? `${nis(r.base)} × ${money(r.countedYears, 2)} שנים (${spanText(r.span)} בניכוי ${r.unpaidExcess} ימי חופשה ללא תשלום) = ${nis(r.severance)}.` : `${nis(r.base)} × ${spanText(r.span)} = ${nis(r.severance)}.`];
	if (r.change && r.unpaidExcess) { parts.push(`בניכוי ${r.unpaidExcess} ימי חופשה ללא תשלום (תקנה 10(3)).`); }
	if (r.s14 !== 'none') { parts.push(`בעד התקופה שבה הופרש לפיצויים, מה שנצבר בקופה בא במקום ${r.s14Pct}% מהפיצויים, והמעסיק משלים ${r.retireCredit ? 'את ההפרש' : nis(r.employer)}.`); }
	if (r.retireCredit) { parts.push('המעסיק רשאי לזקוף על חשבון הפיצויים כספים שהפריש לפיצויים בקופת גמל (סעיף 11(ה)), ולכן הוא משלם רק את ההפרש.'); }
	parts.push(`הודעה מוקדמת: ${nText(r)}.`);
	if (r.taxNote === 'year') { parts.push('החלק הפטור ממס לא חושב: תקרת הפטור לשנה זו אינה במחשבון.'); } else if (r.taxNote === 'fund') { parts.push(`פטור ממס עד ${nis(r.exempt)}; מה שמעבר לזה, לפי מה שנצבר בקופה, חייב במס.`); } else { parts.push(r.taxable > 0 ? `פטור ממס עד ${nis(r.exempt)}; ${nis(r.taxable)} חייבים במס.` : 'כל הסכום פטור ממס.'); }
	return parts.join(' ');
}

/** The service ruler: one segment per year of work; the part section 14 covers is hatched in teal. */
function ruler(r) {
	const years = Math.max(r.span.years, 1 / 12);
	const ticks = [];
	for (let y = 1; y < years; y += 1) { ticks.push(`<i class="jt13-tick" style="inset-inline-start:${((y / years) * 100).toFixed(2)}%"></i>`); }
	const coveredPct = r.entitled && r.s14 !== 'none' ? Math.min(100, (r.coveredYears / years) * 100) : 0;
	return `<div class="jt13-ruler" role="img" aria-label="${esc(`${spanText(r.span)} עבודה${coveredPct ? `; סעיף 14 על ${r.s14Pct}% מ-${coveredPct.toFixed(0)}% מהתקופה` : ''}`)}">`
		+ `<p class="jt13-ruler__h">תקופת העבודה: ${esc(spanText(r.span))}</p>`
		+ `<div class="jt13-ruler__bar"><span class="jt13-ruler__fund" style="width:${coveredPct.toFixed(2)}%;height:${r.s14Pct}%"></span>${ticks.join('')}</div>`
		+ `<div class="jt13-ruler__ends"><span>${esc(isoToHe(r.start))}</span><span>${esc(isoToHe(r.end))}</span></div>`
		+ `<p class="jt13-ruler__legend"><span><i class="jt13-k jt13-k--emp"></i>המעסיק משלם</span>${coveredPct ? `<span><i class="jt13-k jt13-k--fund"></i>הקופה במקום ${r.s14Pct}% (סעיף 14)</span>` : ''}</p></div>`;
}

function timeline(reg, r) {
	const sv = reg.severance;
	const dl = r.deadlines.filter((d) => ['due', 'grace', 'twenty', 'cert'].includes(d.key));
	return `<ol class="jt13-time" aria-label="המועדים אחרי סיום העבודה">${dl.map((d, i) => `<li class="jt13-time__st${i === 0 ? ' jt13-time__st--due' : ''}"><span class="jt13-time__d">${esc(isoToHe(d.date))}</span><span class="jt13-time__t">${esc({ due: 'הפיצויים צריכים להיות בחשבון', grace: `עד היום ה-${sv.late.grace_days}: בלי פיצוי הלנה`, twenty: `אחרי היום ה-${sv.late.linkage_to_day}: עוד ${sv.late.monthly_pct}% לחודש`, cert: 'אישור על תקופת העבודה' }[d.key])}</span></li>`).join('')}</ol>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const flags = r.flags.filter((f) => f.code !== 's14');
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">`
		+ (r.entitled ? (r.conditional ? '<p class="jtool-state jtool-state--warn">! מגיעים פיצויים, אלא אם המעסיק יוכיח אחרת (סעיף 3)</p>' : '<p class="jtool-state jtool-state--ok">✓ מגיעים פיצויי פיטורים</p>') : '<p class="jtool-state jtool-state--warn">! אין זכות לפיצויים מהמעסיק</p>')
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}פיצויי פיטורים לפי החוק</p>`
		+ `<strong class="jtool-verdict__figure">${ilsn(r.severance)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>המעסיק משלם</dt><dd>${r.retireCredit ? 'הפיצויים, פחות כספי הפיצויים בקופה' : ilsn(r.employer)}</dd></div>${r.s14 !== 'none' && r.entitled ? '<div><dt>ועוד, מהקופה</dt><dd>מה שנצבר</dd></div>' : ''}${r.fundUnknown ? '<div><dt>בקופה (סעיף 14)</dt><dd>מה שנצבר, שלכם</dd></div>' : ''}<div><dt>הודעה מוקדמת</dt><dd>${esc(nText(r))}</dd></div><div><dt>פטור ממס</dt><dd>${r.exempt === null ? 'לא חושב' : `${r.taxNote === 'fund' ? 'עד ' : ''}${ilsn(r.exempt)}`}</dd></div></dl></div>`
		+ ruler(r) + payStrip(reg, r) + timeline(reg, r)
		+ (flags.length ? `<ul class="jtool-flags">${flags.map((f) => `<li><strong aria-hidden="true">${MARK[f.level]}</strong> ${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ briefBlock(reg, r);
}

export function deadlines(reg, r) {
	return r.ok ? r.deadlines : [];
}

export function letter(reg, r) {
	const sv = reg.severance;
	const lines = ['לכבוד', '__________ (המעסיק)', '', 'הנדון: תשלום פיצויי פיטורים והודעה מוקדמת', '',
		`עבדתי אצלכם מיום ${isoToHe(r.start)} עד יום ${isoToHe(r.end)} (${spanText(r.span)}), ושכרי האחרון היה ${nis(r.base)} לחודש.`,
		r.entitled ? (r.s14 !== 'none'
			? `לפי סעיף 12 לחוק פיצויי פיטורים, התשכ"ג-1963, פיצויי הפיטורים לפי שכרי הם ${nis(r.severance)}. בעד התקופה שבה הופרשו כספים לפיצויים, הכספים שנצברו בקופה באים במקום ${r.s14Pct}% מהפיצויים (סעיף 14). אני מבקש לשחרר לי את כל הכספים שנצברו לפיצויים בקופה, ולשלם לי את ההשלמה${r.retireCredit ? ', בניכוי כספי פיצויים נוספים שהפרשתם לקופת גמל ונזקפים על חשבונה (סעיף 11(ה))' : ` של ${nis(r.employer)}`}.`
			: `לפי סעיף 12 לחוק פיצויי פיטורים, התשכ"ג-1963, מגיעים לי פיצויי פיטורים של ${nis(r.severance)}.${r.retireCredit ? ' ככל שהפרשתם כספים לפיצויים בקופת גמל, הם נזקפים על חשבונם (סעיף 11(ה)); אבקש לשחרר לי אותם ולשלם לי את ההפרש.' : ''}`) : null,
		r.noticeMode === 'none' && r.reason === 'fired' ? `לא ניתנה לי הודעה מוקדמת כחוק (${noticeText(r.notice)}), ולכן מגיע לי פיצוי בגובה השכר הרגיל לתקופה זו (סעיף 7(א) לחוק הודעה מוקדמת לפיטורים ולהתפטרות).` : null,
		r.short && r.noticeMode === 'worked' && r.reason === 'fired' ? `ההודעה המוקדמת שקיבלתי הסתיימה ${r.short} ימים לפני המועד שבחוק (${noticeText(r.notice)}), ולכן מגיע לי השכר הרגיל בעד ימים אלה (סעיפים 6 ו-7(א) לחוק הודעה מוקדמת לפיטורים ולהתפטרות).` : null,
		r.entitled ? `המועד לתשלום הפיצויים הוא יום סיום העבודה. פיצויים שלא שולמו תוך ${sv.late.grace_days} ימים מולנים, ואחרי היום ה-${sv.late.linkage_to_day} נוסף פיצוי הלנה של ${sv.late.monthly_pct}% לכל חודש (סעיף 20 לחוק הגנת השכר, התשי"ח-1958).` : null,
		'כמו כן אבקש אישור בכתב על תקופת העבודה (סעיף 8 לחוק הודעה מוקדמת) וטופס 161.', '',
		'בכבוד רב,', '__________'];
	return lines.filter((x) => x !== null).join(String.fromCharCode(10));
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const sv = reg.severance;
	const rows = [
		['השכר לחישוב', ilsn(r.base), r.floored ? `שכר המינימום: ${cite('סעיף 13ב', sv.law_url)}` : `השכר האחרון${cite('תקנה 4', sv.regs_url)}`],
		...(r.change ? [[`השכר לתקופה עד ${isoToHe(r.periods[0].to)}`, ilsn(r.prevBase), r.cut ? `השכר שלפני ההפחתה${cite('תקנה 8', sv.regs_url)}` : `השכר האחרון לפי היקף המשרה (${r.payType === 'hourly' ? `${r.prevHours} שעות בחודש` : `${r.prevPct}%`})${cite('תקנה 7', sv.regs_url)}`]] : []),
		['תקופת העבודה', `${esc(spanText(r.span))}${r.unpaidExcess ? `, בניכוי ${r.unpaidExcess} ימי חופשה ללא תשלום: ${money(r.countedYears, 2)} שנים` : ''}`, `חלק משנה מזכה באופן יחסי${cite('סעיף 12(א)', sv.law_url)}${r.unpaidExcess ? cite('תקנה 10(3)', sv.regs_url) : ''}`],
		['פיצויי פיטורים', ilsn(r.severance), r.entitled ? `חודש לכל שנה${cite('סעיף 12(א)', sv.law_url)}${r.conditional ? cite('סעיף 3: פיטורים סמוך לסוף השנה', sv.law_url) : ''}${r.payType === 'hourly' ? cite('תקנות 1983', sv.wage_regs_url) : ''}` : `אין זכות${cite(r.yearOk ? 'סעיף 1(א): פיטורים' : 'סעיף 1(א): שנת עבודה', sv.law_url)}`],
	];
	if (r.s14 !== 'none') {
		if (!r.fundUnknown) { rows.push(['פיצויים בעד תקופת ההפרשות', ilsn(r.coveredSev), cite('סעיף 12(א)', sv.law_url)]); }
		rows.push([r.fundUnknown ? 'בקופה, לפי סעיף 14' : `מהקופה, במקום ${r.s14Pct}% מהם`, 'מה שנצבר (לפי הדוח השנתי), שייך לכם', `${cite('סעיף 14', sv.law_url)}${cite('האישור הכללי', sv.approval.url)}`]);
		rows.push(['השלמה מהמעסיק', r.retireCredit ? 'ההפרש' : ilsn(r.employer), r.fundUnknown ? 'אין: אין זכות לפיצויים מהמעסיק' : r.retireCredit ? `גם כספים לפיצויים שלא לפי סעיף 14 נזקפים${cite('סעיף 11(ה)', sv.law_url)}` : 'ההפרש']);
	}
	if (r.retireCredit && r.s14 === 'none') { rows.push(['כספי פיצויים בקופת גמל', 'נזקפים על חשבון הפיצויים', `גם בלי סעיף 14${cite('סעיף 11(ה)', sv.law_url)}`]); }
	rows.push(['הודעה מוקדמת', `${esc(nText(r))}${r.inLieu !== null && r.reason !== 'term' ? ` (${nis(r.inLieu)} אם משלמים במקום עבודה${r.notice.month ? '' : ', לפי 30 ימים בחודש'})` : ''}`, cite(`${r.notice.section} לחוק הודעה מוקדמת`, sv.notice.url)]);
	if (r.taxNote === 'fund') {
		rows.push(['פטור ממס', `עד ${ilsn(r.exempt)}`, `משכורת חודש לשנה, עד ${money(sv.tax.ceiling, 0)} ₪ לשנה ב-${sv.tax.year}${cite(sv.tax.section, sv.tax.law_url)}${cite('לוח העזר 2026', sv.tax.source_url)}`]);
		rows.push(['חייב במס', 'מה שמעבר לפטור', 'תלוי במה שנצבר בקופה']);
	} else if (r.exempt === null) {
		rows.push(['פטור ממס', 'לא חושב', `התקרה של ${esc(sv.tax.from.slice(0, 4))} עד ${esc(sv.tax.to.slice(0, 4))} בלבד (${money(sv.tax.ceiling, 0)} ₪ לשנה)${cite(sv.tax.section, sv.tax.law_url)}`]);
	} else {
		rows.push(['פטור ממס', ilsn(r.exempt), `משכורת חודש לשנה, עד ${money(sv.tax.ceiling, 0)} ₪ לשנה ב-${sv.tax.year}${cite(sv.tax.section, sv.tax.law_url)}${cite('לוח העזר 2026', sv.tax.source_url)}`]);
		rows.push(['חייב במס', ilsn(r.taxable), r.taxable ? 'לפי מדרגות המס' : '—']);
	}
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-calc-h">כמה, על מה, ולפי איזה סעיף</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-calc-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([a, b, c]) => `<tr><td data-th="מה">${esc(a)}</td><td data-th="סכום">${b}</td><td data-th="הכלל">${c}</td></tr>`).join('')
		+ `</tbody><caption>הפיצויים על השכר האחרון; לעבודה במשרה חלקית בחלק מהתקופה, כל תקופה לפי חלקיות המשרה בה (תקנה 7). חופשה ללא תשלום מעל 14 ימים בשנה לא נספרת (תקנה 10).</caption></table></div></div>`;
	if (r.entitled && !r.retireCredit) {
		const arr = byArrangement(reg, { payType: r.payType, salary: r2u(r.monthly - (r.commission || 0)), commission: r.commission, hourly: r.hourly, hours: r.hours, jobPct: r.jobPct, start: r.start, end: r.end, reason: r.reason, change: r.change, changeDate: r.changeDate, prevPct: r.prevPct, prevSalary: r.prevSalary, prevHours: r.prevHours, prevHourly: r.prevHourly, unpaidExcess: r.unpaidExcess, groundOk: r.groundOk, nearClaim: r.nearClaim, s14From: r.s14 !== 'none' ? r.s14From : '' });
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-arr-h">אותו עובד, שלושה הסדרים</h3></div><div class="jt7-scns jt13-scns">`
			+ ['none', 'partial', 'full'].map((k) => { const v = arr[k]; const here = k === r.s14; return `<div class="jt7-scn${here ? ' jt7-scn--here' : ''}"><p>${esc(S14_LABEL[k])}${here ? ' (אתם)' : ''}</p><strong>${v ? ils(v.employer, 0) : '—'}</strong><small>${v ? (v.pct ? `המעסיק משלם; ועוד מה שנצבר בקופה, במקום ${v.pct}% מהפיצויים` : 'המעסיק משלם הכול') : ''}</small></div>`; }).join('')
			+ `</div><p class="jt7-scns__note">בלי סעיף 14 המעסיק משלם ${nis(r.severance)}. עם סעיף 14 הוא משלם פחות, ומהקופה מגיע מה שנצבר בה בפועל: ההפקדות מהשכר של כל חודש, עם התשואה או ההפסד. הקופה שלכם גם בהתפטרות, והמעסיק לא משלים תשואה שלא הושגה.</p></div>`;
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.deadlines.map((d) => `<tr><td data-th="תאריך">${esc(isoToHe(d.date))}</td><td data-th="מה">${esc(d.he)}</td><td data-th="הכלל">${cite(d.section, d.url)}</td></tr>`).join('')
		+ `</tbody></table></div></div>`;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-ltr-h">מכתב למעסיק</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="letter">העתקת המכתב</button></div></div><pre class="jtool-letter">${esc(letter(reg, r))}</pre></div>`;
	out += pzDetails(reg, r);
	return out;
}

/** Page section: the notice by tenure and pay type, from the same engine. */
export function noticeTable(reg) {
	const sv = reg.severance;
	const points = [1, 3, 6, 7, 9, 11, 12, 18, 24, 30, 36];
	const label = (m) => (m === 1 ? 'חודש' : m < 12 ? `${m} חודשים` : m === 12 ? 'שנה' : m < 24 ? `שנה ו-${m - 12} חודשים` : m === 24 ? 'שנתיים' : m < 36 ? `שנתיים ו-${m - 24} חודשים` : '3 שנים ומעלה');
	const rows = points.map((m) => {
		const a = compute(reg, { payType: 'monthly', salary: 10000, start: '2020-01-01', end: '2030-12-31', noticeDate: monthAdd('2020-01-01', m) });
		const b = compute(reg, { payType: 'hourly', hourly: 50, hours: 160, start: '2020-01-01', end: '2030-12-31', noticeDate: monthAdd('2020-01-01', m) });
		return `<tr><td data-th="ותק ביום ההודעה">${esc(label(m))}</td><td data-th="משכורת חודשית">${esc(noticeText(a.notice))}</td><td data-th="שכר לפי שעה או יום">${esc(noticeText(b.notice))}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הודעה מוקדמת לפיטורים או להתפטרות לפי ${esc(sv.notice.he)}, סעיפים 3 עד 5</caption><thead><tr><th scope="col">ותק ביום ההודעה</th><th scope="col">משכורת חודשית</th><th scope="col">שכר לפי שעה או יום</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}
function monthAdd(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const t = y * 12 + (m - 1) + n;
	return `${Math.floor(t / 12)}-${String(t % 12 + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const sv = reg.severance;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.severance,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>תקופת העבודה מ-${isoToHe(r.start)} עד ${isoToHe(r.end)}: ${r.span.months} חודשים, ${money(r.span.years, 4)} שנים${cite('סעיף 12(א)', sv.law_url)}</li>`
			+ `<li>פיצויים: ${money(r.base, 0)} ₪ × ${money(r.span.years, 4)} = ${money(r.severance)} ₪${cite('סעיף 12(א)', sv.law_url)}</li>`
			+ `<li>סעיף 14 על ${r.s14Pct}%: מה שנצבר בקופה בא במקום ${r.s14Pct}% מהפיצויים לתקופת ההפרשות, והמעסיק משלים ${money(r.employer)} ₪${cite('האישור הכללי', sv.approval.url)}</li>`
			+ `<li>הודעה מוקדמת אחרי שנה: חודש${cite('סעיף 3(3) לחוק הודעה מוקדמת', sv.notice.url)}</li>`
			+ `<li>פטור ממס: משכורת חודש לשנה (עד ${money(sv.tax.ceiling, 0)} ₪) × ${money(r.span.years, 4)} = ${money(r.exemptCap)} ₪ פטורים${cite(sv.tax.section, sv.tax.law_url)}</li></ol>`,
		compare_table: noticeTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- The labor wave (22.10.2026, jt49): payslip strip, deposit check, lead card, scenario, print ---------------- */

/** The payslip strip: each line of the last payslip, in (counted for severance), by the 12-month average, or out (not in
 * reg. 1 of the 1964 regulations). Without the picker: the salary entered, and the lines the regulation leaves out. */
export function payStrip(reg, r) {
	const lp = reg.labor_pitzuyim;
	if (!lp || !r.ok) { return ''; }
	const pz = r.pzIn && r.pzIn.parts && r.payType === 'monthly' ? pzBase(reg, r.pzIn.parts) : null;
	const own = Boolean(pz && pz.ok && pz.any);
	const comm = r.commission || 0;
	const segs = own ? pz.rows.map((x) => ({ he: x.he, amount: x.amount, status: x.status, section: x.section }))
		: [{ he: r.payType === 'hourly' ? 'שכר לשעה כפול השעות בחודש' : 'שכר יסוד ותוספות קבועות', amount: r2u(r.monthly - comm), status: 'in', section: 'תקנה 1(א)' }].concat(comm ? [{ he: 'עמלות או תפוקה (ממוצע)', amount: comm, status: 'avg', section: 'תקנה 9' }] : []);
	const payslip = segs.reduce((t, x) => t + x.amount, 0);
	const counted = segs.filter((x) => x.status === 'in' || x.status === 'avg').reduce((t, x) => t + x.amount, 0);
	const outs = lp.components.filter((c) => (c.status === 'out' || c.status === 'check') && !segs.some((x) => x.he === c.he)).map((c) => c.he);
	const bar = segs.map((x) => `<span class="${Q}-strip__seg ${Q}-strip__seg--${x.status}" style="flex-grow:${Math.max(1, Math.round(x.amount))}" title="${esc(`${x.he}: ${money(x.amount, 0)} ₪, ${PZ_STATUS[x.status]}`)}"></span>`).join('');
	const label = `השכר הקובע לפיצויים: ${money(r.base, r.base % 1 ? 2 : 0)} ₪${own ? ` מתוך ${money(payslip, payslip % 1 ? 2 : 0)} ₪ בתלוש` : ''}`;
	return `<div class="${Q}-strip" role="group" aria-label="${esc(label)}"><p class="${Q}-strip__h">${esc(label)}${r.floored ? ' (הועלה לשכר המינימום, סעיף 13ב)' : ''}</p>`
		+ `<div class="${Q}-strip__bar" aria-hidden="true">${bar}</div>`
		+ `<ul class="${Q}-strip__list">${segs.map((x) => `<li class="${Q}-strip__li ${Q}-strip__li--${x.status}"><span>${esc(x.he)}</span><bdi>${money(x.amount, x.amount % 1 ? 2 : 0)} ₪</bdi><small>${esc(PZ_STATUS[x.status])} · ${esc(x.section)}</small></li>`).join('')}</ul>`
		+ (outs.length ? `<p class="${Q}-strip__out">לא נכנסים לשכר הקובע (לא ברשימה של תקנה 1(א)): ${esc(outs.join(', '))}.${cite('תקנה 1', lp.regs.url)}</p>` : '')
		+ (own && counted < payslip ? `<p class="${Q}-strip__out">מתוך התלוש, ${money(payslip - counted, 0)} ₪ לא נכנסים לחישוב.</p>` : '') + '</div>';
}

/** The scenario for the simulation: the computed facts only (no names, no ID), ending with the question to rehearse. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const who = r.payType === 'hourly' ? 'עובד/ת בשכר לפי שעה' : 'עובד/ת במשכורת חודשית';
	const how = r.reason === 'fired' ? 'פוטר/ה' : r.reason === 'term' ? 'החוזה לתקופה קצובה הסתיים ולא חודש' : r.reason === 'resign' ? 'התפטר/ה התפטרות רגילה' : 'התפטר/ה מסיבה שהחוק רואה כפיטורים';
	const head = `${who}, שכר קובע ${money(r.base, 0)} ₪, ${spanText(r.span)} אצל אותו מעסיק; ${how}.`;
	if (!r.entitled) {
		return `${head} לפי החישוב אין פיצויי פיטורים מהמעסיק${r.s14 !== 'none' ? ', אבל הכספים שהופרשו לפיצויים בקופה שייכים לעובד/ת (סעיף 14)' : ''}. הודעה מוקדמת: ${nText(r)}. השאלה לתרגול: השיחה עם המעסיק לפני הסיום: איך מבקשים בכתב את שחרור הכספים בקופה, את האישור על תקופת העבודה ואת טופס 161, ומה עונים אם המעסיק מסרב?`;
	}
	const s14 = r.s14 !== 'none' ? ` סעיף 14 על ${r.s14Pct}%: מה שנצבר בקופה בא במקום חלק מהפיצויים, ו${r.retireCredit ? 'המעסיק משלים את ההפרש' : `המעסיק משלים ${money(r.employer, 0)} ₪`}.` : ' המעסיק משלם את כל הסכום.';
	const due = r.deadlines.find((d) => d.key === 'grace');
	return `${head} לפי חוק פיצויי פיטורים מגיעים ${money(r.severance, 0)} ₪.${s14} הודעה מוקדמת: ${nText(r)}.${due ? ` בלי פיצויי הלנה עד ${isoToHe(due.date)}.` : ''} השאלה לתרגול: השיחה עם המעסיק או השימוע: איך מציגים את החישוב, ומה עונים אם המעסיק טוען שהקופה מכסה הכול או שהשכר הקובע נמוך יותר?`;
}

/** "What to do now": the official services, the next legal date, and 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const lp = reg.labor_pitzuyim;
	if (!lp || !r.ok) { return { official: [], links: [] }; }
	const sv = lp.services;
	const official = [{ he: sv.form_161.he, url: sv.form_161.url }];
	const next = r.deadlines.find((d) => d.key === 'grace') || r.deadlines.find((d) => d.key === 'cert');
	if (next) { official.push({ he: `המועד הבא: ${isoToHe(next.date)}, ${next.he}`, rule: next.section }); }
	official.push({ he: sv.complaint.he, url: sv.complaint.url });
	if (r.entitled) { official.push({ he: sv.court.he, url: sv.court.url }); }
	const links = [];
	links.push({ path: '/gmar-cheshbon/', he: 'גמר חשבון: כל מה שמגיע בסיום העבודה, במקום אחד' });
	if (r.s14 !== 'none') { links.push({ path: '/hafrashot-pensia/', he: 'הפרשות לפנסיה: מה צריך להופיע בתלוש' }); }
	if (r.reason !== 'fired' && r.reason !== 'term') { links.push({ path: '/resignation-deemed-dismissal/', he: 'התפטרות שדינה כפיטורים: מתי מגיעים פיצויים' }); } else { links.push({ path: '/unemployment-benefits-eligibility/', he: 'דמי אבטלה אחרי פיטורים: זכאות וסכום' }); }
	links.push({ path: '/notice-of-dismissal/', he: 'הודעה מוקדמת: כמה ימים, ומה אם לא ניתנה' });
	return { official, links: links.slice(0, 4) };
}

function briefBlock(reg, r) {
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	if (!brief) { return ''; }
	return `<div class="${Q}-brief"><h4>התרחיש לסימולציה</h4><p data-${Q}-brief>${esc(brief)}</p><a class="jtool-btn" href="${PZ_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את השיחה עם המעסיק</a></div>`
		+ `<div class="${Q}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a>` : esc(x.he)}${x.rule ? ` (${esc(x.rule)})` : ''}</li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** The deposit check: what the payslip should carry each month, the s.14 cover, a short deposit wage, the order's rates and
 * the fund balance against the deposits (without returns). Never a computed fund balance. */
export function fundBlock(reg, r, fc) {
	const lp = reg.labor_pitzuyim;
	if (!lp || !r.ok) { return ''; }
	const head = `<div class="jtool-tablewrap ${Q}-fund"><div class="jtool-tablewrap__head"><h3 id="${Q}-fund-h">ההפרשות לפיצויים: מה צריך להופיע בתלוש</h3></div>`;
	if (!fc.ok) { return `${head}<p class="jtool-error">${esc(fc.errors.map((e) => e.he).join(' '))}</p></div>`; }
	const pn = reg.rights_neto.pension;
	const m = fc.monthly;
	const rows = [
		[`לפיצויים (חלק המעסיק), ${fc.rates.severance}%`, m.severance, `${cite(lp.order.rows_section, lp.order.url)}${r.s14 === 'full' ? cite('השלמה עד 8.33%', lp.order.url) : ''}`],
		...(fc.rates.completion ? [[`השלמה לפיצויים עד ${fc.rates.full}% (לפי בחירת המעסיק)`, m.completion, cite(lp.order.completion_section, lp.order.url)]] : []),
		[`תגמולים (חלק המעסיק), ${fc.rates.employer}%`, m.employer, cite(pn.section, pn.url)],
		[`תגמולים (חלק העובד, מנוכה מהשכר), ${fc.rates.employee}%`, m.employee, cite(pn.section, pn.url)],
	];
	let out = head + `<div class="jtool-scroll" role="region" aria-labelledby="${Q}-fund-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">שורה בתלוש</th><th scope="col">בחודש</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([a, b, c]) => `<tr><td data-th="שורה בתלוש">${esc(a)}</td><td data-th="בחודש">${ils(b, b % 1 ? 2 : 0)}</td><td data-th="הכלל">${c}</td></tr>`).join('')
		+ `</tbody><caption>על שכר של ${money(fc.wage, fc.wage % 1 ? 2 : 0)} ₪ בחודש. החובה לפי הצו: על השכר עד השכר הממוצע במשק (${money(fc.avgWage, 0)} ₪), כלומר לפחות ${money(fc.mandatory.severance, fc.mandatory.severance % 1 ? 2 : 0)} ₪ לפיצויים בחודש (${esc(lp.order.cap_section)}).</caption></table></div>`;
	const cover = r.s14 === 'none' ? (fc.order ? `לפי שיעורי הצו: ${fc.order.coverPct}%` : 'אין (בחרתם: אין סעיף 14)') : `${r.s14Pct}% מהפיצויים בעד תקופת ההפרשות`;
	out += `<dl class="jtool-breakdown ${Q}-fund__dl"><div><dt>הקופה באה במקום</dt><dd>${esc(cover)}</dd></div>`
		+ (fc.gap ? `<div><dt>ההפרשות היו משכר נמוך ב-</dt><dd>${ils(fc.gap.short, 0)}</dd></div><div><dt>המעסיק משלים, עם ההפרש</dt><dd>${ils(fc.gap.employer, 0)}</dd></div>` : '')
		+ (fc.order ? `<div><dt>המעסיק משלים, לפי שיעורי הצו</dt><dd>${ils(fc.order.employer, 0)}</dd></div>` : '')
		+ (fc.fund ? `<div><dt>ההפקדות לפי השיעורים, בלי תשואה</dt><dd>${ils(fc.fund.deposits, 0)}</dd></div><div><dt>היתרה שהזנתם</dt><dd>${ils(fc.fund.bal, 0)} (${money(fc.fund.pct, 0)}%)</dd></div>` : '')
		+ '</dl>';
	if (fc.order) {
		out += `<div class="jtool-scroll" role="region" aria-label="הכיסוי לפי שיעורי צו הפנסיה" tabindex="0"><table class="jtool-table ${Q}-order"><thead><tr><th scope="col">תקופה</th><th scope="col">לפיצויים</th><th scope="col">הקופה במקום</th><th scope="col">פיצויים לתקופה</th><th scope="col">מכוסה</th></tr></thead><tbody>`
			+ fc.order.rows.map((x) => `<tr><td data-th="תקופה">${esc(isoToHe(x.from))} עד ${esc(isoToHe(x.to))}</td><td data-th="לפיצויים">${x.rate === null ? 'לפני הצו: לפי ההסדר' : `${money(x.rate, 2)}%`}</td><td data-th="הקופה במקום">${money(x.cover, 2)}%</td><td data-th="פיצויים לתקופה">${ils(x.sev, 0)}</td><td data-th="מכוסה">${ils(x.replaced, 0)}</td></tr>`).join('')
			+ `</tbody><caption>הפיצויים לכל תקופה לפי השכר האחרון; הקופה באה במקומם בשיעור שהופרש מתוך 8⅓% (${esc(lp.order.cover_section)}). ${esc(lp.order.gazette_he)}.</caption></table></div>`;
	}
	if (fc.flags.length) { out += `<ul class="jtool-flags">${fc.flags.map((f) => `<li><strong aria-hidden="true">${MARK[f.level]}</strong> ${esc(f.he)}</li>`).join('')}</ul>`; }
	return `${out}<p class="jtool-hint">${esc(lp.order.return_he)} (${esc(lp.order.return_section)}). ${esc(lp.law.s26_he)} (${esc(lp.law.s26_section)}).</p></div>`;
}

/** "What changed and when": a dated table of the published values only. */
export function changesTable(reg) {
	if (!reg.labor_pitzuyim) { return ''; }
	const rows = pzChanges(reg);
	return `<div class="jtool-tablewrap ${Q}-chg"><div class="jtool-tablewrap__head"><h3 id="${Q}-chg-h">מה השתנה ומתי</h3></div><div class="jtool-scroll" role="region" aria-labelledby="${Q}-chg-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מאז</th><th scope="col">מה נקבע</th><th scope="col">המקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מאז"><bdi>${esc(pzDay(x.date))}</bdi></td><td data-th="מה נקבע">${esc(x.he)}</td><td data-th="המקור">${cite(x.src, x.url)}</td></tr>`).join('')
		+ `</tbody><caption>רק ערכים שפורסמו ברשומות, בחוק או באתרי הממשלה. נבדק ${esc(isoToHe(reg.labor_pitzuyim.checked_on))}.</caption></table></div></div>`;
}

/** The one-page print: the inputs, the result, the computation path, the dates, the sources with dates, the day printed. */
export function printSummary(reg, r, fc, printedOn) {
	if (!r.ok) { return ''; }
	const sv = reg.severance;
	const lp = reg.labor_pitzuyim;
	const day = printedOn || (lp ? lp.checked_on : sv.checked_on);
	const how = r.reason === 'fired' ? 'פיטורים' : r.reason === 'term' ? 'חוזה לתקופה קצובה שלא חודש' : r.reason === 'resign' ? 'התפטרות' : 'התפטרות שדינה כפיטורים';
	return `<h3>פיצויי פיטורים והודעה מוקדמת: סיכום</h3>`
		+ `<p><strong>הנתונים:</strong> ${r.payType === 'hourly' ? `${money(r.hourly, 2)} ₪ לשעה × ${money(r.hours, 0)} שעות בחודש` : `שכר ${money(r.monthly, 0)} ₪ לחודש`}${r.jobPct !== 100 ? `, ${money(r.jobPct, 0)}% משרה` : ''}; מ-${isoToHe(r.start)} עד ${isoToHe(r.end)} (${esc(spanText(r.span))}); ${how}; ${esc(S14_LABEL[r.s14])}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p><ol><li>השכר הקובע: ${money(r.base, r.base % 1 ? 2 : 0)} ₪ (תקנות 1 ו-4${r.floored ? '; רצפת שכר המינימום, סעיף 13ב' : ''})</li><li>${!r.entitled ? 'אין זכות לפיצויים מהמעסיק (סעיף 1(א))' : r.change ? `פיצויים לפי שתי תקופות (תקנות 7 ו-8): ${money(r.severance)} ₪` : `פיצויים: ${money(r.base, 0)} ₪ × ${money(r.countedYears, 4)} שנים = ${money(r.severance)} ₪ (סעיף 12(א))`}</li>`
		+ (r.s14 !== 'none' && r.entitled ? `<li>סעיף 14 על ${r.s14Pct}%: המעסיק משלים ${r.retireCredit ? 'את ההפרש' : `${money(r.employer)} ₪`}, ועוד מה שנצבר בקופה (${esc(sv.approval.gazette_he)})</li>` : '')
		+ (fc && fc.ok ? `<li>בתלוש בכל חודש: ${money(fc.monthly.severance)} ₪ לפיצויים (${fc.rates.severance}%), ${money(fc.monthly.employer)} ₪ תגמולי מעסיק, ${money(fc.monthly.employee)} ₪ תגמולי עובד</li>` : '')
		+ (fc && fc.ok && fc.gap ? `<li>ההפרשות היו משכר נמוך ב-${money(fc.gap.short, 0)} ₪: המעסיק משלים ${money(fc.gap.employer, 0)} ₪ (סעיף 7 לצו)</li>` : '')
		+ (fc && fc.ok && fc.order ? `<li>לפי שיעורי צו הפנסיה: הקופה מכסה ${fc.order.coverPct}% מהפיצויים לתקופה; המעסיק משלים ${money(fc.order.employer, 0)} ₪</li>` : '')
		+ `<li>הודעה מוקדמת: ${esc(nText(r))} (${esc(r.notice.section)} לחוק הודעה מוקדמת)</li>`
		+ `<li>פטור ממס: ${r.exempt === null ? 'לא חושב' : `${r.taxNote === 'fund' ? 'עד ' : ''}${money(r.exempt)} ₪`} (${esc(sv.tax.section)})</li></ol>`
		+ (r.deadlines.length ? `<p><strong>מועדים:</strong> ${r.deadlines.map((d) => `${isoToHe(d.date)} ${esc(d.he)}`).join('; ')}.</p>` : '')
		+ `<p><strong>מקורות:</strong> ${esc(sv.law_he)}; ${esc(sv.regs_he)}; ${esc(sv.notice.he)}; ${esc(sv.late.he)}, ${esc(sv.late.section)}; ${esc(sv.approval.he)} (${esc(sv.approval.gazette_he)})${lp ? `; ${esc(lp.order.he)} (${esc(lp.order.gazette_he)})` : ''}. נבדק ${isoToHe(sv.checked_on)}${lp ? ` ו-${isoToHe(lp.checked_on)}` : ''}.</p>`
		+ `<p>הודפס ב-${isoToHe(day)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

function pzDetails(reg, r) {
	if (!reg.labor_pitzuyim || !reg.rights_neto || !reg.rights_btl || !r.ok) { return ''; }
	const fc = pzFundCheck(reg, r, r.pzIn || {});
	return fundBlock(reg, r, fc) + changesTable(reg)
		+ `<div class="${Q}-printbar"><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום (עמוד אחד)</button></div>`
		+ `<div class="${Q}-print">${printSummary(reg, r, fc, r.pzIn && r.pzIn.printedOn)}</div>`;
}

/** Every dated output of the result for the calendar: the payment day, the late-payment marks, the certificate, the
 * limitation, and the end of the notice period when a notice day was given. */
export function icsEvents(reg, r) {
	if (!r.ok) { return []; }
	const ev = r.deadlines.map((d) => ({ date: d.date, summary: `פיצויי פיטורים: ${d.he}`, description: `${d.section}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` }));
	if (r.noticeDate && r.noticeEnd && r.reason !== 'term') { ev.unshift({ date: r.noticeEnd, summary: 'הודעה מוקדמת: סוף התקופה שבחוק', description: `${r.notice.section} לחוק הודעה מוקדמת לפיטורים ולהתפטרות. חושב ב-jus-tice.co.il.` }); }
	return ev;
}

/** The result-first card at the top of the page ([justice_tool_lead]): the example's severance (or the reader's once they
 * change anything), one line of why, and a jump to the form. Same markup on the server and in the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הנתונים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">פיצויי פיטורים</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}פיצויי פיטורים לפי החוק`;
	const unit = !r.entitled ? '' : r.s14 === 'none' ? 'המעסיק משלם הכול' : r.retireCredit ? 'המעסיק משלים את ההפרש, ועוד מה שנצבר בקופה' : `המעסיק משלים ${nis(r.employer)}, ועוד מה שנצבר בקופה`;
	const grace = r.deadlines.find((d) => d.key === 'grace');
	const line = `${nis(r.base)} לחודש × ${spanText(r.span)}${r.conditional ? ' (סעיף 3)' : ''}. הודעה מוקדמת: ${nText(r)}.${grace ? ` בלי פיצויי הלנה עד ${isoToHe(grace.date)}.` : ''}`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${r.entitled ? ilsn(r.severance) : 'אין פיצויים מהמעסיק'}</strong>${unit ? `<span class="jtool-lead__unit">${esc(unit)}</span>` : ''}</p>`
		+ `<p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

/* ---------------- Browser ---------------- */

/** The payslip picker's amounts (reg. 1), as typed. */
function pzParts(root) {
	const out = {};
	root.querySelectorAll('[data-pz]').forEach((el) => { const v = String(el.value || '').trim(); if (v !== '') { out[el.getAttribute('data-pz')] = parseMoney(v); } });
	return out;
}

function readForm(root, reg) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const kind = radio('rk', 'fired');
	const why = radio('rw', 'plain');
	const input = {
		payType: radio('pt', 'monthly'), salary: m('sal'), commission: m('com'), hourly: m('hr'), hours: m('hrs'), jobPct: m('job'),
		start: toIso(val(`#${P}-start`)), end: toIso(val(`#${P}-end`)),
		reason: kind === 'fired' ? 'fired' : kind === 'term' ? 'term' : (why === 'plain' || why === 'term' ? 'resign' : why === 'other_ground' ? 'other_ground' : why),
		groundOk: kind === 'resign' && why !== 'plain' && why !== 'other_ground' && Boolean(root.querySelector(`input[name="${P}-po"]:checked`)),
		nearClaim: kind !== 'resign' && Boolean(root.querySelector(`input[name="${P}-ny"]:checked`)),
		misconduct: kind !== 'resign' && Boolean(root.querySelector(`input[name="${P}-mis"]:checked`)),
		seasonal: Boolean(root.querySelector(`input[name="${P}-sea"]:checked`)), otherBreaks: Boolean(root.querySelector(`input[name="${P}-brk"]:checked`)),
		s14: radio('s14', 'none'), s14Pct: m('s14p'), s14From: toIso(val(`#${P}-s14f`)),
		noticeDate: toIso(val(`#${P}-nd`)), noticeMode: radio('nm', 'worked'),
		change: Boolean(root.querySelector(`input[name="${P}-chg"]:checked`)),
		changeDate: toIso(val(`#${P}-chd`)), prevPct: m('pp'), prevSalary: m('ps'), prevHours: m('ph'), prevHourly: m('phr'), manyChanges: Boolean(root.querySelector(`input[name="${P}-many"]:checked`)),
		unpaidExcess: m('ul'),
		parts: pzParts(root), depWage: m('dw'), fundBal: m('fb'), orderRates: Boolean(root.querySelector(`input[name="${P}-ord"]:checked`)), depFrom: toIso(val(`#${P}-df`)),
	};
	// The picker, when filled, is the salary: reg. 1 components as the salary, reg. 9 as the commission average.
	if (reg && reg.labor_pitzuyim && input.payType === 'monthly') {
		const pz = pzBase(reg, input.parts);
		if (pz.ok && pz.any) { input.salary = pz.fixed; input.commission = pz.avg || ''; }
	}
	return input;
}

const RS = { fired: 'f', resign: 'r', health: 'h', parent: 'p', move: 'm', term: 't', worse: 'w', retire: 'x', other_ground: 'g' };
const S14 = { none: 'n', partial: 'p', full: 'f', custom: 'c' };
const NM = { worked: 'w', paid: 'p', none: 'n' };
const pzList = (parts) => Object.entries(parts || {}).filter(([, v]) => Number.isFinite(Number(v)) && Number(v) > 0).map(([k, v]) => [k, String(v)]);
export const stateOf = (i) => encodeState({ t: i.payType === 'hourly' ? 'h' : '', w: i.salary || '', h: i.hourly || '', o: i.hours || '', j: i.jobPct || '', s: i.start, e: i.end, r: RS[i.reason] || 'f', f: S14[i.s14] || 'n', p: i.s14Pct || '', d: i.s14From || '', n: i.noticeDate || '', m: NM[i.noticeMode] || 'w', c: i.change ? 1 : '', a: i.change ? i.changeDate : '', b: i.change ? i.prevPct : '', g: i.change ? i.prevSalary : '', k: i.change && i.manyChanges ? 1 : '', x: i.change ? i.prevHours : '', y: i.change ? i.prevHourly : '', u: i.unpaidExcess || '', z: i.groundOk || i.parentOk ? 1 : '', q: i.nearClaim ? 1 : '', v: i.seasonal ? 1 : '', i: i.otherBreaks ? 1 : '', l: i.misconduct ? 1 : '', C: i.commission || '', P: pzList(i.parts), W: i.depWage || '', B: i.fundBal || '', O: i.orderRates ? 1 : '', F: i.orderRates ? (i.depFrom || '') : '' });
export const KEYS = ['t', 'w', 'h', 'o', 'j', 's', 'e', 'r', 'f', 'p', 'd', 'n', 'm', 'c', 'a', 'b', 'g', 'k', 'x', 'y', 'u', 'z', 'q', 'v', 'i', 'l', 'C', 'P', 'W', 'B', 'O', 'F'];
export function inputOf(s) {
	if (!s.s || !s.e) { return null; }
	const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
	return {
		payType: s.t === 'h' ? 'hourly' : 'monthly', salary: s.w ? Number(s.w) : '', hourly: s.h ? Number(s.h) : '', hours: s.o ? Number(s.o) : '', jobPct: s.j ? Number(s.j) : '',
		start: s.s, end: s.e, reason: back(RS, s.r, 'fired'), s14: back(S14, s.f, 'none'), s14Pct: s.p ? Number(s.p) : '', s14From: s.d || '', noticeDate: s.n || '', noticeMode: back(NM, s.m, 'worked'),
		change: s.c === '1', changeDate: s.c === '1' ? (s.a || '') : '', prevPct: s.c === '1' && s.b ? Number(s.b) : '', prevSalary: s.c === '1' && s.g ? Number(s.g) : '', manyChanges: s.c === '1' && s.k === '1',
		prevHours: s.c === '1' && s.x ? Number(s.x) : '', prevHourly: s.c === '1' && s.y ? Number(s.y) : '', unpaidExcess: s.u ? Number(s.u) : '', groundOk: s.z === '1', nearClaim: s.q === '1', seasonal: s.v === '1', otherBreaks: s.i === '1', misconduct: s.l === '1', commission: s.C ? Number(s.C) : '',
		parts: Object.fromEntries(decodeList(s.P).map(([k, v]) => [k, Number(v)])), depWage: s.W ? Number(s.W) : '', fundBal: s.B ? Number(s.B) : '', orderRates: s.O === '1', depFrom: s.O === '1' ? (s.F || '') : '',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = typeof document !== 'undefined' ? document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`) : null;
	let own = false;
	const sv = reg.severance;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(sv.checked_on, sv.refresh_every_days) || (sv.next_update && today >= sv.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שתקרת הפטור התעדכנה'); }
	}
	const ids = { salary: 'sal', hourly: 'hr', hours: 'hrs', jobPct: 'job', start: 'start', end: 'end', s14Pct: 's14p', s14From: 's14f', noticeDate: 'nd', changeDate: 'chd', prevPct: 'pp', prevSalary: 'ps', prevHours: 'ph', prevHourly: 'phr', unpaidExcess: 'ul', commission: 'com', depWage: 'dw', fundBal: 'fb', depFrom: 'df' };
	// The picker's and the deposit check's own errors (reg. 1; the order's check), after the engine's.
	const showPz = (input, r) => {
		if (!reg.labor_pitzuyim) { return; }
		const errs = [];
		const pz = pzBase(reg, input.parts || {});
		if (!pz.ok) { errs.push(...pz.errors); }
		if (r.ok && reg.rights_neto && reg.rights_btl) { const fc = pzFundCheck(reg, r, r.pzIn || {}); if (!fc.ok) { errs.push(...fc.errors); } }
		for (const e of errs) {
			const id = ids[e.field] || e.field;
			const box = root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${ids[e.field] || e.field}-e`) || root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${ids[e.field] || e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const pt = (root.querySelector(`input[name="${P}-pt"]:checked`) || {}).value || 'monthly';
		form.querySelectorAll('[data-if-pay]').forEach((el) => { el.hidden = el.getAttribute('data-if-pay') !== pt; });
		const rk = (root.querySelector(`input[name="${P}-rk"]:checked`) || {}).value || 'fired';
		form.querySelectorAll('[data-if-resign]').forEach((el) => { el.hidden = rk !== 'resign'; });
		form.querySelectorAll('[data-if-term]').forEach((el) => { el.hidden = rk !== 'term'; });
		form.querySelectorAll('[data-if-dismissal]').forEach((el) => { el.hidden = rk === 'resign'; });
		const rw = (root.querySelector(`input[name="${P}-rw"]:checked`) || {}).value || 'plain';
		form.querySelectorAll('[data-if-ground]').forEach((el) => { el.hidden = !(rk === 'resign' && rw !== 'plain' && rw !== 'other_ground'); });
		form.querySelectorAll('[data-ground-hint]').forEach((el) => { el.hidden = el.getAttribute('data-ground-hint') !== rw; });
		const s14 = (root.querySelector(`input[name="${P}-s14"]:checked`) || {}).value || 'none';
		form.querySelectorAll('[data-if-s14]').forEach((el) => { el.hidden = s14 === 'none'; });
		form.querySelectorAll('[data-if-custom]').forEach((el) => { el.hidden = s14 !== 'custom'; });
		form.querySelectorAll('[data-if-change]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-chg"]:checked`); });
		form.querySelectorAll('[data-if-order]').forEach((el) => { el.hidden = !(root.querySelector(`input[name="${P}-ord"]:checked`) && s14 === 'none'); });
		// The picker fills the salary and the commission average and locks them while it is in use.
		if (reg.labor_pitzuyim) {
			const pz = pzBase(reg, pzParts(root));
			const active = pz.ok && pz.any && pt === 'monthly';
			const sal = root.querySelector(`#${P}-sal`);
			const com = root.querySelector(`#${P}-com`);
			if (sal) { sal.readOnly = active; if (active) { sal.value = money(pz.fixed, pz.fixed % 1 ? 2 : 0); } }
			if (com) { com.readOnly = active; if (active) { com.value = pz.avg ? money(pz.avg, pz.avg % 1 ? 2 : 0) : ''; } }
		}
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		if (r.ok) { r.pzIn = { parts: input.parts || {}, depWage: input.depWage, fundBal: input.fundBal, orderRates: input.orderRates === true, depFrom: input.depFrom, printedOn: today }; }
		showErrors(r);
		showPz(input, r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? ilsn(r.severance) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.entitled ? (r.s14 === 'none' ? 'employer' : 's14') : 'none' }); }
	};
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root, reg)); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	// The lead card's jump: to the form, first field focused (the page anchor is the fallback without the script).
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector('input:not([type="radio"]):not([type="checkbox"])');
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
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root, reg), { silent: true }); }
		const input = readForm(root, reg);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'profile') {
			const key = b.getAttribute('data-profile');
			const pr = PROFILES[key];
			if (pr) { own = true; form.innerHTML = renderForm(reg, pr.input); sync(); run(pr.input); track('tool_profile', { tool_id: TOOL_ID, band: key }); }
		} else if (act === 'ics' && r.ok) {
			download('pitzuyim.ics', 'text/calendar;charset=utf-8', ics(icsEvents(reg, r), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'letter' && r.ok) {
			const ok = await copyText(letter(reg, r));
			toast(root, ok ? 'המכתב הועתק.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק פיצויי פיטורים ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(sv.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the scenario travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok && r.entitled ? 'entitled' : 'other' });
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
