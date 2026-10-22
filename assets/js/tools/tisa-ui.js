/**
 * The consumer-law wave UI (22.10.2026, HAD-593): the flight-disruption instrument of the Aviation Services Law
 * (pitzui-tisa, prefix jt66) on /law-compensation-cancellation-2012/. The picture is a departure board: the reader's flight
 * as a board row (date, distance band, status), the hours of delay as a strip with the law's thresholds as markers (2 hours:
 * food and calls; 5 hours: refund or another ticket; 8 hours: a cancelled flight and money compensation; 3 hours on a
 * domestic flight), and the compensation ladder of the First Schedule with the reader's step lit. Both have a text
 * equivalent. Under them: what the law gives (money, refund or another ticket, assistance), the exemptions as flags, the
 * dates (21 days, 45 days, 4 years) to the calendar, the demand to the airline as plain text (the names typed into it stay
 * in the page), the rights by situation, the 2026 amounts, the war-time temporary order quoted, what changed and when, the
 * scenario for the simulation and the next steps; a one-page summary prints on its own.
 */
import { tsCompute, tsBand, TS_BANDS } from './tisa-engine.js';
import { addDays, parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'pitzui-tisa';
export const PAGE = '/law-compensation-cancellation-2012/';
export const KTANOT_PAGE = '/small-claims-court-israel/';
const P = 'jt66';
const TS_SIM = (purpose) => `https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=${purpose}&topic=contract-dispute`;

/** One click to a full profile; the flight `back` days before the day it is applied. */
export const PRESETS = {
	cancel: { he: 'בוטלה ביום הטיסה · אירופה · 2 נוסעים', event: 'cancel', band: 'b2', pax: 2, back: 38, price: 1900, choice: 'refund' },
	delay9: { he: 'איחור של 9 שעות · ניו יורק · נוסע אחד', event: 'delay', hours: 9, band: 'b3', pax: 1, back: 10, choice: 'flew' },
	delay6: { he: 'איחור של 6 שעות · יוון · 2 נוסעים', event: 'delay', hours: 6, band: 'b1', pax: 2, back: 5, price: 900, choice: 'refund' },
	notice10: { he: 'בוטלה 10 ימים לפני · חלופה שנוחתת 3 שעות אחרי', event: 'cancel', band: 'b2', pax: 2, back: 20, noticeBefore: 10, offered: true, early: 1, late: 3, choice: 'alt' },
	denied: { he: 'סירוב להטיס (רישום יתר) · 4 נוסעים', event: 'denied', band: 'b1', pax: 4, back: 3, choice: 'alt', late: 5 },
};
const TS_BLANK = {
	type: 'intl', event: 'cancel', hours: '', flight: '', notice: '', band: 'b2', km: '', line: 'other', pax: 1, price: '', leg: 'one',
	pkg: false, cls: 'economy', choice: 'refund', offered: false, early: '', late: '', refusedAlt: false, exempt: 'none',
	denied: 'overbooking', securityOk: false, down: 'be', segKm: '', free: false, moved: false, noCheckin: false, foreign: false,
	order: false, demand: '', today: '',
};
/** A preset applied on a day: the flight `back` days before it. */
export function tsPreset(key, today) {
	const p = PRESETS[key];
	if (!p) { return null; }
	const flight = addDays(today, -p.back);
	return Object.assign({}, TS_BLANK, {
		event: p.event, band: p.band, pax: p.pax, hours: p.hours === undefined ? '' : p.hours, price: p.price === undefined ? '' : p.price,
		choice: p.choice, offered: Boolean(p.offered), early: p.early === undefined ? '' : p.early, late: p.late === undefined ? '' : p.late,
		flight, notice: p.noticeBefore ? addDays(flight, -p.noticeBefore) : '', today,
	});
}
export const EXAMPLE = tsPreset('cancel', '2026-10-22');

const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text || 'מקור')}</a>` : '');
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const tsIso = (text) => { const raw = String(text || '').trim(); return raw ? (parseDate(raw) || raw) : ''; };
const EVENT_HE = { cancel: 'הטיסה בוטלה', delay: 'ההמראה איחרה', denied: 'סירבו להטיס אותי', advance: 'ההמראה הוקדמה', downgrade: 'הורידו אותי במחלקה' };
const BAND_SHORT = { b1: 'עד 2,000 ק"מ', b2: '2,000 עד 4,500 ק"מ', b3: 'מעל 4,500 ק"מ' };
const LINE_HE = { eilat: 'אילת (מתל אביב או מחיפה)', north: 'עין יהב או ראש פינה (משדה דב)', other: 'קו פנים-ארצי אחר' };
const DOWN_HE = { fb: 'ממחלקה ראשונה לעסקים', be: 'מעסקים לתיירים', fe: 'מראשונה לתיירים' };
const CHOICE_HE = { refund: 'השבת התמורה (החזר כספי)', alt: 'כרטיס טיסה חלופי', flew: 'טסתי בטיסה המאחרת' };
const paxHe = (n) => (n === 1 ? 'נוסע אחד' : `${n} נוסעים`);
const lPax = (n) => (n === 1 ? 'לנוסע אחד' : `ל-${n} נוסעים`);
const hoursHe = (h) => (h === 1 ? 'שעה' : h === 2 ? 'שעתיים' : `${money(h, Number.isInteger(h) ? 0 : 1)} שעות`);
const dayHe = (n) => (n === 1 ? 'יום אחד' : `${n} ימים`);
const ASSIST_HE = { food: 'מזון ומשקאות', comms: 'שתי שיחות והודעה', hotel: 'מלון', transport: 'הסעה למלון' };

/** What happened, in a few words, for the board, the brief and the letter. */
function whatHe(r) {
	if (r.event === 'delay') { return `ההמראה איחרה ב-${hoursHe(r.hours)}${r.legalCancel ? ' (לפי החוק: טיסה שבוטלה)' : ''}`; }
	if (r.event === 'advance') { return `ההמראה הוקדמה ב-${hoursHe(r.hours)}`; }
	if (r.event === 'denied') { return 'סירבו להטיס'; }
	if (r.event === 'downgrade') { return `הורדה במחלקה, ${DOWN_HE[r.down]}`; }
	return r.noticeDays === null ? 'הטיסה בוטלה, בלי הודעה מראש' : `הטיסה בוטלה, הודעה ${dayHe(r.noticeDays)} לפני`;
}
const whereHe = (r) => (r.intl ? (r.km ? `טיסה של ${money(r.km, 0)} ק"מ (${BAND_SHORT[r.band]})` : `טיסה למרחק של ${BAND_SHORT[r.band]}`) : `טיסה פנים-ארצית, ${LINE_HE[r.line]}`);

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, TS_BLANK, input || {});
	const preset = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return /^\d{4}-\d{2}-\d{2}$/.test(i.today || '') && i.flight === addDays(i.today, -p.back) && p.event === i.event && p.band === i.band && Number(p.pax) === Number(i.pax) && i.type === 'intl'; }) || '';
	const date = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 14.9.2026" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const num = (id, label, v, ph, hint, suffix) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label>${suffix ? '<div class="jtool-input jtool-input--money">' : ''}<input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v === '' || v === undefined || v === null ? '' : v)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${suffix ? `<span class="jtool-input__suffix" aria-hidden="true">${suffix}</span></div>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const sel = (id, label, v, opts, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><select id="${P}-${id}" aria-describedby="${P}-${id}-e">${opts.map(([val, l]) => `<option value="${esc(val)}"${String(v) === val ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint">${esc(hint)}</p>` : ''}</div>`;
	const check = (name, label, on) => chip(name, '1', label, Boolean(on), 'checkbox');
	const intl = i.type !== 'domestic';
	const hoursOn = i.event === 'delay' || i.event === 'advance';
	const noticeOn = i.event === 'cancel' || i.event === 'delay' || i.event === 'advance';
	const more = Boolean(i.demand || i.leg !== 'one' || i.pkg || i.offered || i.early !== '' || i.late !== '' || i.exempt !== 'none' || i.free || i.moved || i.noCheckin || i.foreign || i.order || i.refusedAlt || i.km !== '');
	return `<fieldset class="jtool-field"><legend>מקרה נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מקרה ממלא את כל השדות לפי היום; אפשר לשנות כל שדה.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>מה קרה</legend><div class="jtool-chips">${['cancel', 'delay', 'denied', 'advance', 'downgrade'].map((e) => chip('ev', e, EVENT_HE[e], i.event === e)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>איזו טיסה</legend><div class="jtool-chips">${chip('type', 'intl', 'מישראל או לישראל', intl)}${chip('type', 'domestic', 'בתוך ישראל (פנים-ארצית)', !intl)}</div></fieldset>`
		+ `<div class="jtool-row">${date('fl', 'מועד הטיסה שבכרטיס', i.flight, 'היום שבו הטיסה הייתה אמורה להמריא')}<div data-if-hours${hoursOn ? '' : ' hidden'}>${num('hr', i.event === 'advance' ? 'בכמה שעות הוקדמה ההמראה' : 'בכמה שעות איחרה ההמראה', i.hours, 'לדוגמה: 9', 'לפי המועד שבכרטיס', 'ש\'')}</div></div>`
		+ `<div class="jtool-row" data-if-notice${noticeOn ? '' : ' hidden'}>${date('nt', 'קיבלתי הודעה על השינוי ביום', i.notice, 'ריק: לא הייתה הודעה מראש (נודע בשדה או ביום הטיסה)')}</div>`
		+ `<fieldset class="jtool-field" data-if-intl${intl ? '' : ' hidden'}><legend>מרחק הטיסה (סעיף 12: הקו הקצר ביותר על פני כדור)</legend><div class="jtool-chips">${TS_BANDS.map((b) => chip('band', b, BAND_SHORT[b], i.band === b)).join('')}</div><p class="jtool-hint">אירופה הקרובה (יוון, קפריסין, רומא) עד 2,000; רוב אירופה 2,000 עד 4,500; צפון אמריקה והמזרח הרחוק מעל 4,500. אם ידוע המרחק בק"מ, הזינו אותו למטה והוא קובע.</p></fieldset>`
		+ `<div class="jtool-row" data-if-domestic${intl ? ' hidden' : ''}>${sel('ln', 'הקו', i.line, [['eilat', LINE_HE.eilat], ['north', LINE_HE.north], ['other', LINE_HE.other]])}</div>`
		+ `<div class="jtool-row">${num('px', 'כמה נוסעים בהזמנה', i.pax, 'לדוגמה: 2', 'הפיצוי הוא לכל נוסע')}${num('pr', 'מחיר הכרטיס לנוסע', i.price === '' ? '' : money(i.price, 0), 'לא חובה', 'לחישוב ההחזר; כולל מסים ואגרות', '₪')}</div>`
		+ `<div data-if-choice${i.event === 'downgrade' ? ' hidden' : ''}><fieldset class="jtool-field"><legend>מה בחרתי</legend><div class="jtool-chips">${chip('ch', 'refund', CHOICE_HE.refund, i.choice === 'refund')}${chip('ch', 'alt', CHOICE_HE.alt, i.choice === 'alt')}<span data-if-flew${i.event === 'delay' ? '' : ' hidden'}>${chip('ch', 'flew', CHOICE_HE.flew, i.choice === 'flew')}</span></div><p class="jtool-hint">החזר או כרטיס חלופי, לבחירתכם (סעיף 6(א)(2)); הפיצוי הכספי בנוסף.</p></fieldset></div>`
		+ `<div class="jtool-row" data-if-denied${i.event === 'denied' ? '' : ' hidden'}>${sel('dn', 'הסיבה שנמסרה', i.denied, [['overbooking', 'רישום יתר (אוברבוקינג) או סיבה אחרת של החברה'], ['security', 'טעמי ביטחון'], ['health', 'מצב בריאותי'], ['documents', 'מסמכי נסיעה']])}<div class="jtool-chips ${P}-checks">${check('sec', 'הגעתי 3 שעות לפני, שיתפתי פעולה בבדיקה, והמסמכים תקינים (סעיף 5(ה))', i.securityOk)}</div></div>`
		+ `<div class="jtool-row" data-if-down${i.event === 'downgrade' ? '' : ' hidden'}>${sel('dg', 'מאיזו מחלקה לאיזו', i.down, [['fb', 'ממחלקה ראשונה למחלקת עסקים'], ['be', 'ממחלקת עסקים למחלקת תיירים'], ['fe', 'ממחלקה ראשונה למחלקת תיירים']])}${num('sk', 'מרחק הקטע שבו הורדתם (ק"מ)', i.segKm, 'רק בטיסה עם עצירת ביניים', 'עם המרחק הכולל למטה', '')}</div>`
		+ `<details class="jtool-more ${P}-more"${more ? ' open' : ''}><summary>פרטים שמשנים את התוצאה: חלופה שהוצעה, טענות החברה, הלוך ושוב, חבילה, מרחק, דרישה</summary>`
		+ `<div class="jtool-row">${num('km', 'מרחק הטיסה בק"מ', i.km, 'לא חובה', 'מנקודת המוצא ליעד הסופי; קובע את הטווח', '')}${sel('lg', 'הכרטיס', i.leg, [['one', 'כיוון אחד, או לא ידוע'], ['out', 'הלוך ושוב: הבעיה בטיסת ההלוך'], ['back', 'הלוך ושוב: הבעיה בטיסת החזור']], 'בחזור מוחזרת מחצית מחיר הכרטיס (סעיף 3(ב)(2))')}</div>`
		+ `<div class="jtool-chips ${P}-checks">${check('off', 'הוצעה לי טיסה חלופית', i.offered || i.choice === 'alt')}${check('ref', 'סירבתי לחלופה: לא הוצעה למי שטס איתי, או מסיבה ביטחונית, דתית או רפואית (סעיף 6(ד))', i.refusedAlt)}</div>`
		+ `<div class="jtool-row">${num('ea', 'החלופה ממריאה לפני המועד המקורי ב', i.early, 'שעות; 0 אם לא לפני', '', 'ש\'')}${num('la', 'החלופה נוחתת ביעד אחרי המועד המקורי ב', i.late, 'שעות', 'קובע פטור (סעיף 6(ג)) והפחתה למחצית (סעיף 6(ב))', 'ש\'')}</div>`
		+ `<div class="jtool-row">${sel('ex', 'מה חברת התעופה טוענת', i.exempt, [['none', 'לא טענה לפטור'], ['extraordinary', 'נסיבות מיוחדות שלא בשליטתה (מזג אוויר, ביטחון)'], ['strike', 'שביתה או השבתה מוגנות'], ['shabbat', 'הימנעות מחילול שבת או חג']], 'הטענה מוצגת כדגל: נטל ההוכחה עליה')}${date('dm', 'שלחתי דרישה בכתב ביום', i.demand, 'ריק: הכלי מחשב את המועדים מהיום')}</div>`
		+ `<div class="jtool-row">${check('pkg', 'הכרטיס חלק מחבילת נופש', i.pkg)}${sel('cl', 'המחלקה בכרטיס', i.cls, [['economy', 'תיירים או טיסת שכר'], ['business', 'עסקים'], ['first', 'ראשונה']], 'לחבילה בלי מחיר ידוע: המחיר לפי התוספת השלישית')}</div>`
		+ `<div class="jtool-chips ${P}-checks">${check('ci', 'לא התייצבתי לבידוק במועד', i.noCheckin)}${check('mv', 'הועברתי לטיסה אחרת והגעתי ליעד בזמן המקורי', i.moved)}${check('fr', 'הכרטיס היה חינם או בתעריף שלא פתוח לציבור', i.free)}${check('fo', 'קיבלתי פיצוי לפי דין זר (למשל התקנה האירופית)', i.foreign)}${check('or', 'הוכרז מצב מיוחד וחל צו לפי סעיף 9א על מועד הטיסה', i.order)}</div>`
		+ '</details>';
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const T = reg.consumer_tisa;
	const parts = [];
	if (r.none) {
		parts.push(`לפי ${r.none.section} לחוק שירותי תעופה אין הטבות במקרה הזה: ${r.none.he}.`);
		return parts.join(' ');
	}
	if (r.comp.due && r.event === 'downgrade') {
		parts.push(`על הורדה ${DOWN_HE[r.down]} מגיע פיצוי של ${r.downgrade.pct}% ממחיר הכרטיס: ${nis(r.total)} ${lPax(r.pax)}, בתוך ${T.benefits.downgrade_days} ימים מהטיסה (${T.downgrade.section}).`);
	} else if (r.comp.due) {
		parts.push(`מגיע פיצוי כספי של ${nis(r.perDue)} לכל נוסע${r.half ? ` (מחצית מ-${nis(r.perFull)}, כי הכרטיס החלופי נחת עד ${hoursHe(r.halfHours)} אחרי)` : ''}, ${nis(r.total)} ${lPax(r.pax)}${r.intl ? ` (${BAND_SHORT[r.band]}, ${T.amounts.year})` : ' (סכום הבסיס בתקנות)'}.`);
		if (r.disputed) { parts.push('חברת התעופה טוענת לפטור: נטל ההוכחה עליה.'); }
	} else if (r.event === 'delay' && !r.legalCancel) {
		parts.push(r.hours >= r.thresholds.food ? `על איחור של ${hoursHe(r.hours)} אין פיצוי כספי (הוא מתחיל ב-${hoursHe(r.thresholds.cancel)}), אבל מגיעים ${r.refund ? 'החזר או כרטיס חלופי, ' : ''}מזון, שתייה ושיחות.` : `על איחור של ${hoursHe(r.hours)} החוק לא נותן הטבה; היא מתחילה בשעתיים.`);
	} else if (r.comp.code === 'war_a' || r.comp.code === 'war_b') {
		parts.push(`לפי הוראת השעה (חרבות ברזל), ${r.comp.section}, אין פיצוי כספי לטיסה שמועדה ${isoToHe(r.flight)}.`);
	} else if (r.comp.code.indexOf('notice_') === 0) {
		parts.push(`ההודעה ניתנה ${dayHe(r.noticeDays)} לפני הטיסה, ולכן אין פיצוי כספי (${T.cancel.notice_section}), אם החברה תוכיח את ההודעה.`);
	} else if (r.comp.code === 'foreign') {
		parts.push(`קיבלתם פיצוי לפי דין זר, ולכן אין פיצוי מאותו סוג לפי החוק הישראלי (${T.foreign.section}).`);
	} else if (r.event === 'advance') {
		parts.push(r.comp.code === 'advance_refund' ? `על הקדמה של ${hoursHe(r.hours)} בהודעה של פחות מ-14 ימים מגיעים החזר או כרטיס חלופי, בלי פיצוי כספי.` : `על הקדמה של ${hoursHe(r.hours)}${r.comp.code === 'advance_notice' ? ' בהודעה של 14 ימים או יותר' : ''} החוק לא נותן פיצוי.`);
	} else if (r.event === 'denied') {
		parts.push(`בסירוב מטעמי ${r.denied === 'security' ? 'ביטחון' : r.denied === 'health' ? 'בריאות' : 'מסמכים'} החוק לא נותן פיצוי (${r.comp.section}).`);
	} else if (r.event === 'downgrade') {
		parts.push('כדי לחשב פיצוי על הורדה במחלקה צריך את מחיר הכרטיס.');
	}
	if (r.refund && r.refund.chosen && r.refund.amount) { parts.push(`השבת התמורה: ${nis(r.refund.amount)}, בתוך ${T.benefits.refund_days} ימים מהפנייה בכתב.`); }
	if (r.compDue) { parts.push(`הפיצוי משולם בתוך ${T.benefits.comp_days} ימים מהפנייה בכתב${r.assumedSend ? ` (אם נשלחת היום: עד ${isoToHe(r.compDue)})` : `: עד ${isoToHe(r.compDue)}`}.`); }
	parts.push(`אפשר לתבוע עד ${isoToHe(r.deadline)} (${T.limitation.section}).`);
	return parts.join(' ');
}

/** The departure board: the flight as a board row, the hours strip with the law's thresholds, and the compensation ladder. */
export function board(reg, r) {
	if (!r.ok) { return ''; }
	const T = reg.consumer_tisa;
	const th = r.thresholds;
	const status = r.none ? 'אין זכאות' : r.event === 'cancel' ? 'בוטלה' : r.event === 'delay' ? `איחור ${hoursHe(r.hours)}` : r.event === 'advance' ? `הוקדמה ${hoursHe(r.hours)}` : r.event === 'denied' ? 'סירוב להטיס' : 'הורדה במחלקה';
	const row = `<div class="${P}-row" aria-hidden="true"><span class="${P}-cell"><small>מועד</small><b><bdi>${isoToHe(r.flight)}</bdi></b></span><span class="${P}-cell"><small>${r.intl ? 'מרחק' : 'קו'}</small><b>${esc(r.intl ? (r.km ? `${money(r.km, 0)} ק"מ` : BAND_SHORT[r.band]) : LINE_HE[r.line])}</b></span><span class="${P}-cell"><small>נוסעים</small><b><bdi>${r.pax}</bdi></b></span><span class="${P}-cell ${P}-cell--st ${P}-st--${r.comp.due ? 'due' : 'none'}"><small>סטטוס</small><b>${esc(status)}</b></span></div>`;
	// The hours strip: 0 to 12 hours (or the delay, if longer), the thresholds as markers.
	const span = Math.max(12, Math.ceil((r.event === 'delay' || r.event === 'advance' ? r.hours : 0) + 1));
	const x = (h) => Math.round(Math.min(100, (h / span) * 100) * 10) / 10;
	const marks = [{ h: th.food, he: 'מזון ושיחות', sec: T.delay.food_section }];
	if (th.refund) { marks.push({ h: th.refund, he: 'החזר או חלופה', sec: T.delay.refund_section }); }
	marks.push({ h: th.cancel, he: 'טיסה שבוטלה: פיצוי', sec: r.intl ? T.defs.section : T.domestic.def_section });
	const fillH = r.event === 'delay' ? r.hours : r.legalCancel || r.event === 'denied' ? span : 0;
	const strip = r.event === 'downgrade' || r.event === 'advance' ? '' : `<p class="${P}-sub" aria-hidden="true">${r.event === 'delay' ? 'שעות האיחור מול הסיפים שבחוק' : 'ביטול וסירוב להטיס: כמו איחור של 8 שעות ומעלה'}</p><div class="${P}-strip" aria-hidden="true"><span class="${P}-strip__fill" style="inline-size:${x(fillH)}%"></span>${marks.map((m) => `<span class="${P}-mk${fillH >= m.h ? ` ${P}-mk--on` : ''}" style="inset-inline-start:${x(m.h)}%"><i>${hoursHe(m.h)}</i><em>${esc(m.he)}</em></span>`).join('')}</div>`;
	// The compensation ladder: the First Schedule (or the domestic base amounts), the reader's step lit.
	const steps = r.intl ? T.amounts.bands.map((b) => ({ key: b.key, he: BAND_SHORT[b.key], amount: b.amount })) : T.domestic.lines.map((l) => ({ key: l.key, he: LINE_HE[l.key], amount: l.base }));
	const top = Math.max(...steps.map((s) => s.amount));
	const mine = r.intl ? r.band : r.line;
	const ladder = r.event === 'downgrade' ? '' : `<p class="${P}-sub" aria-hidden="true">${r.intl ? `סולם הפיצוי לנוסע, ${T.amounts.year}` : 'סולם הפיצוי לנוסע בטיסה פנים-ארצית (סכומי הבסיס, 2013)'}</p><ol class="${P}-ladder" aria-hidden="true">${steps.map((s) => `<li class="${P}-step${s.key === mine ? ` ${P}-step--mine${r.comp.due ? '' : ` ${P}-step--off`}` : ''}"><span class="${P}-pole"><span class="${P}-bar" style="block-size:${Math.round((s.amount / top) * 100)}%">${s.key === mine && r.half ? `<span class="${P}-half" style="block-size:50%"></span>` : ''}</span></span><b>${esc(nis(s.amount))}</b><small>${esc(s.he)}</small></li>`).join('')}</ol>`;
	const sum = `${isoToHe(r.flight)}, ${whereHe(r)}, ${paxHe(r.pax)}: ${whatHe(r)}. `
		+ (r.event === 'downgrade' || r.event === 'advance' ? '' : `הסיפים שבחוק: ${marks.map((m) => `${hoursHe(m.h)}, ${m.he}`).join('; ')}. `)
		+ (r.event === 'downgrade' ? '' : `סולם הפיצוי: ${steps.map((s) => `${s.he} ${nis(s.amount)}`).join('; ')}. `)
		+ (r.comp.due ? `לכם: ${nis(r.perDue)} לנוסע.` : 'לכם: אין פיצוי כספי.');
	return `<figure class="${P}-board"><figcaption class="${P}-board__h">לוח היציאות: ${esc(whatHe(r))}</figcaption><p class="jtool-visually-hidden">${esc(sum)}</p>${row}${strip}${ladder}</figure>`;
}

/** The scenario for the simulation: computed facts only, never a name, a flight number or an airline. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const T = reg.consumer_tisa;
	const money1 = r.comp.due ? `לפי חוק שירותי תעופה מגיע פיצוי כספי של ${nis(r.perDue)} לכל נוסע, ${nis(r.total)} בסך הכול` : 'לפי חוק שירותי תעופה לא מגיע כאן פיצוי כספי';
	const ref = r.refund && r.refund.chosen && r.refund.amount ? `, ועוד השבת תמורה של ${nis(r.refund.amount)} בתוך ${T.benefits.refund_days} ימים מהפנייה בכתב` : '';
	const claim = r.disputed ? 'חברת התעופה טוענת לפטור ולא שילמה.' : 'חברת התעופה לא שילמה אחרי פנייה בכתב.';
	return `${whereHe(r)}, ${paxHe(r.pax)}, מועד הטיסה ${isoToHe(r.flight)}: ${whatHe(r)}. ${money1}${ref}. ${claim} השאלה לתרגול: הדיון בבית המשפט לתביעות קטנות נגד חברת התעופה. איך מציגים את הכרטיס, ההודעה על השינוי והפנייה בכתב, ואיך עונים לטענה של נסיבות מיוחדות או של הודעה מראש?`;
}

/* ---------------- Share state ---------------- */

const TY = { intl: 'i', domestic: 'd' };
const EV = { cancel: 'c', delay: 'l', denied: 'd', advance: 'a', downgrade: 'g' };
const BA = { b1: '1', b2: '2', b3: '3' };
const LI = { eilat: 'e', north: 'n', other: 'o' };
const LG = { one: '', out: 'o', back: 'b' };
const CH = { refund: 'r', alt: 'a', flew: 'f' };
const EX = { none: '', extraordinary: 'x', strike: 's', shabbat: 'h' };
const DN = { overbooking: 'o', security: 's', health: 'h', documents: 'x' };
const CL = { economy: 'e', business: 'b', first: 'f' };
const FL = { free: 'f', moved: 'm', noCheckin: 'c', foreign: 'o', order: 'z', refusedAlt: 'r' };
const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v && v !== '') || d;
const numOr = (v) => (v === '' || v === undefined || v === null ? '' : Number(v));
export const KEYS = ['t', 'e', 'h', 'f', 'n', 'b', 'k', 'l', 'p', 'r', 'w', 'c', 'a', 'j', 'x', 's', 'd', 'y', 'g', 'm', 'v', 'u', 'q'];
export function stateOf(i) {
	const intl = i.type !== 'domestic';
	const hrs = i.event === 'delay' || i.event === 'advance';
	const flags = Object.keys(FL).filter((k) => i[k]).map((k) => FL[k]).join('');
	return encodeState({
		t: TY[i.type] || 'i', e: EV[i.event] || 'c', h: hrs ? numOr(i.hours) : '', f: i.flight || '', n: i.notice || '',
		b: intl ? BA[i.band] || '2' : '', k: intl ? numOr(i.km) : '', l: intl ? '' : LI[i.line] || 'o', p: numOr(i.pax), r: numOr(i.price),
		w: LG[i.leg] || '', c: i.event === 'downgrade' ? '' : CH[i.choice] || 'r', a: i.offered ? 1 : '', j: numOr(i.early), x: numOr(i.late),
		s: EX[i.exempt] || '', d: i.event === 'denied' ? DN[i.denied] || 'o' : '', y: i.event === 'denied' && i.securityOk ? 1 : '',
		g: i.event === 'downgrade' ? i.down || 'be' : '', m: i.event === 'downgrade' ? numOr(i.segKm) : '', v: i.pkg ? CL[i.cls] || 'e' : '',
		u: flags, q: i.demand || '',
	});
}
export function inputOf(s) {
	if (!s || !s.f) { return null; }
	const u = s.u || '';
	const flags = {};
	Object.keys(FL).forEach((k) => { flags[k] = u.indexOf(FL[k]) !== -1; });
	return Object.assign({}, TS_BLANK, flags, {
		type: back(TY, s.t, 'intl'), event: back(EV, s.e, 'cancel'), hours: numOr(s.h), flight: s.f, notice: s.n || '',
		band: back(BA, s.b, 'b2'), km: numOr(s.k), line: back(LI, s.l, 'other'), pax: s.p ? Number(s.p) : 1, price: numOr(s.r),
		leg: back(LG, s.w, 'one'), choice: back(CH, s.c, 'refund'), offered: s.a === '1', early: numOr(s.j), late: numOr(s.x),
		exempt: back(EX, s.s, 'none'), denied: back(DN, s.d, 'overbooking'), securityOk: s.y === '1', down: ['fb', 'be', 'fe'].includes(s.g) ? s.g : 'be',
		segKm: numOr(s.m), pkg: Boolean(s.v), cls: back(CL, s.v, 'economy'), demand: s.q || '',
	});
}

/** The share link of this tool, for its siblings: '/law-compensation-cancellation-2012/#s=<state>'. Numbers and codes only. */
export function stateLink(reg, input) {
	return `${PAGE}#s=${stateOf(input)}`;
}

/**
 * The small-claims tool (tviot-ktanot) with the reader's heads filled in, by its own keys (W\parts\ktanot\STATE-KEYS.md,
 * published 22.10.2026 21:40): k=flt the case kind, y the flight compensation of all passengers, e the passengers, p the
 * ticket refund not paid, v the flight day (the cause of action), g the day of the written demand. Numbers and dates only.
 */
export function ktanotLink(r) {
	const refund = r.refund && r.refund.chosen && r.refund.amount ? r.refund.amount : '';
	return `${KTANOT_PAGE}#s=${encodeState({ k: 'flt', y: r.total > 0 ? r.total : '', e: r.pax, p: refund, v: r.flight, g: r.demand || '' })}`;
}

/** The "what to do now" list: the official sources first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const T = reg.consumer_tisa;
	const out = [];
	const links = [];
	out.push({ he: `${T.law.short_he}, נוסח עדכני: סעיפים 3 ו-6 (מה מגיע ותוך כמה ימים)`, url: T.law.url });
	out.push({ he: 'רשות התעופה האזרחית: נציגי חברות תעופה זרות לקבלת כתבי בי-דין', url: T.court_reps.url });
	if (r.court) { out.push({ he: 'הרשות השופטת: הגשת תביעה קטנה', url: reg.small_claims.service_url }); }
	if (r.court) { links.push({ path: ktanotLink(r), he: `תביעה קטנה עם הסכום שלכם: ${nis(r.claim)}, האגרה והמועדים` }); }
	links.push({ path: '/compensation-flight-delayed/', he: 'פסק דין: פיצוי על איחור בטיסה בתביעה קטנה' });
	if (r.disputed && r.exempt === 'extraordinary') { links.push({ path: '/force-majeure/', he: 'כוח עליון ונסיבות מיוחדות: מה צריך להוכיח' }); }
	if (r.refund && r.refund.chosen) { links.push({ path: '/airline-bankruptcy-travel-agency-refund/', he: 'החזר כספי דרך סוכן הנסיעות כשהחברה לא משלמת' }); }
	links.push({ path: '/consumer-rights-israel/', he: 'חוק הגנת הצרכן: הזכויות שלכם מול עסק' });
	return { official: out, links: links.slice(0, 4) };
}

/** The demand to the airline, as plain text. `fields` are typed in the page only (never in the state, the store or the brief). */
export function letterText(reg, r, fields = {}, dateIso) {
	if (!r.ok) { return ''; }
	const T = reg.consumer_tisa;
	const f = (k, ph) => (String(fields[k] || '').trim() || ph);
	const lines = [];
	const items = [];
	if (r.comp.due && r.event !== 'downgrade') { items.push(`פיצוי כספי לפי התוספת הראשונה לחוק: ${nis(r.perDue)} לנוסע × ${r.pax} = ${nis(r.total)}${r.intl ? ` (${BAND_SHORT[r.band]})` : ''}, בתוך ${T.benefits.comp_days} ימים מיום פנייה זו (${T.benefits.comp_section}), ${T.benefits.comp_how_he}.`); }
	if (r.event === 'downgrade' && r.downgrade && r.downgrade.amount) { items.push(`פיצוי בשל העברה ${DOWN_HE[r.down]}: ${r.downgrade.pct}% ממחיר הכרטיס, ${nis(r.downgrade.amount)}, בתוך ${T.benefits.downgrade_days} ימים ממועד הטיסה (${T.benefits.downgrade_section} והתוספת השנייה).`); }
	if (r.refund && r.refund.chosen) { items.push(`השבת התמורה ששולמה בעד ${r.pax === 1 ? 'הכרטיס' : 'הכרטיסים'}, כולל אגרות, היטלים ומסים${r.refund.amount ? `: ${nis(r.refund.amount)}` : ''}, בתוך ${T.benefits.refund_days} ימים מיום פנייה זו (${T.benefits.refund_section}${r.refund.leg === 'back' ? `, ${T.refund.return_section}` : ''}).`); }
	if (r.alt && r.choice === 'alt' && !r.comp.due) { items.push(`כרטיס טיסה חלופי ליעד הסופי בתנאים דומים ככל האפשר (${T.benefits.alt_section}).`); }
	if (r.assistance.length) { items.push(`שירותי הסיוע שבסעיף 3(א)(1) (${r.assistance.map((a) => ASSIST_HE[a.code]).join(', ')}): ככל שלא ניתנו, ההוצאות שנגרמו מפורטות בקבלות המצורפות.`); }
	lines.push('לכבוד', f('airline', '[שם חברת התעופה]'), 'שירות לקוחות / מחלקת תביעות', '');
	lines.push(`תאריך: ${isoToHe(dateIso || r.today)}`, '');
	lines.push(`הנדון: דרישה לפי ${T.law.he}`, `טיסה ${f('flightNo', '[מספר הטיסה]')} מיום ${isoToHe(r.flight)}, הזמנה ${f('booking', '[מספר ההזמנה]')}`, '');
	lines.push(`1. ${r.pax === 1 ? 'אני הנוסע/ת' : `אנחנו ${r.pax} הנוסעים`} בטיסה שבנדון. ${whatHe(r)}.${r.notice ? ` ההודעה על השינוי נמסרה ביום ${isoToHe(r.notice)}.` : ''}`);
	if (items.length) {
		lines.push(`2. לפי ${r.comp.section || T.benefits.section} לחוק, ${r.pax === 1 ? 'אני זכאי/ת' : 'אנחנו זכאים'} ל:`);
		items.forEach((x, k) => lines.push(`   ${String.fromCharCode(1488 + k)}. ${x}`));
	} else {
		lines.push(`2. ${r.pax === 1 ? 'אבקש' : 'נבקש'} לקבל את המסמך שמפרט את זכויותינו לפי החוק (${T.inform.doc_section}).`);
	}
	lines.push(`3. חובת ההוכחה בדבר מתן הודעה על ביטול הטיסה מוטלת על המפעיל (${T.cancel.burden_section}); טענה לנסיבות מיוחדות, לשביתה או לשמירת שבת טעונה הוכחה (${T.cancel.exempt_section}).`);
	lines.push(`4. אין להתנות על הוראות החוק אלא לטובת הנוסע (${T.no_waiver.section}); תשלום בשובר או באמצעי אחר רק בהסכמה מפורשת בכתב (${T.benefits.comp_section}).`);
	lines.push(`5. אם הסכום לא ישולם במועד, ${r.pax === 1 ? 'אשקול' : 'נשקול'} תביעה, לרבות פיצויים לדוגמה לפי ${T.exemplary.section} לחוק (עד ${nis(T.exemplary.max)} לנוסע). תקופת ההתיישנות: ${T.limitation.years} שנים (${T.limitation.section}).`);
	lines.push('', 'פרטים להעברה: [פרטי חשבון להעברה]', '', 'בכבוד רב,', f('name', '[שם הנוסע/ת]'), f('contact', '[טלפון או דואר אלקטרוני]'), '');
	lines.push('מצורפים: כרטיס הטיסה ואישור ההזמנה, ההודעה על השינוי, קבלות על הוצאות.');
	return lines.join('\n');
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const T = reg.consumer_tisa;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	const state = r.none ? '<p class="jtool-state jtool-state--danger">✕ לפי סעיף 2 אין הטבות</p>'
		: r.expired ? '<p class="jtool-state jtool-state--danger">! עברו 4 שנים מהטיסה: בדקו את החריגים</p>'
			: r.disputed ? `<p class="jtool-state jtool-state--warn">! מגיע אם החברה לא תוכיח את הפטור (${esc(T.cancel.exempt_section)})</p>`
				: r.comp.due ? `<p class="jtool-state jtool-state--ok">✓ לפי ${esc(r.comp.section)} לחוק שירותי תעופה</p>`
					: '<p class="jtool-state jtool-state--info">i אין פיצוי כספי במקרה הזה; ראו מה כן מגיע</p>';
	const fig = r.comp.due ? ils(r.total, Math.round(r.total * 100) % 100 ? 2 : 0) : r.refund && r.refund.amount ? ils(r.refund.amount, 0) : '<bdi>0</bdi> ₪';
	const label = r.comp.due ? `${opts.example ? 'דוגמה מחושבת: ' : ''}פיצוי כספי ${lPax(r.pax)}` : r.refund && r.refund.amount ? `${opts.example ? 'דוגמה מחושבת: ' : ''}השבת התמורה (אין פיצוי כספי)` : `${opts.example ? 'דוגמה מחושבת: ' : ''}פיצוי כספי`;
	const rows = [];
	if (r.comp.due && r.event !== 'downgrade') { rows.push(`<div><dt>לנוסע</dt><dd>${ils(r.perDue, Math.round(r.perDue * 100) % 100 ? 2 : 0)}</dd></div>`); }
	if (r.refund && r.refund.chosen && r.refund.amount) { rows.push(`<div><dt>השבת התמורה</dt><dd>${ils(r.refund.amount, 0)}</dd></div>`); }
	if (r.compDue) { rows.push(`<div><dt>תשלום הפיצוי עד</dt><dd><bdi>${isoToHe(r.compDue)}</bdi></dd></div>`); }
	if (r.refundDue) { rows.push(`<div><dt>ההחזר עד</dt><dd><bdi>${isoToHe(r.refundDue)}</bdi></dd></div>`); }
	rows.push(`<div><dt>אפשר לתבוע עד</dt><dd><bdi>${isoToHe(r.deadline)}</bdi></dd></div>`);
	const gets = [];
	if (r.comp.due) { gets.push(`<li class="${P}-get ${P}-get--due"><span class="${P}-kind">פיצוי כספי</span> ${esc(r.event === 'downgrade' ? `${r.downgrade.pct}% ממחיר הכרטיס, ${nis(r.total)}` : `${nis(r.perDue)} לנוסע × ${r.pax} = ${nis(r.total)}`)}${cite(r.comp.section, T.law.url)}</li>`); } else if (!r.none) {
		gets.push(`<li class="${P}-get ${P}-get--no"><span class="${P}-kind">פיצוי כספי</span> לא מגיע כאן${r.comp.section ? cite(r.comp.section, r.comp.code.indexOf('war') === 0 ? T.war.url : T.law.url) : ''}</li>`);
	}
	if (r.refund) { gets.push(`<li class="${P}-get ${P}-get--due"><span class="${P}-kind">החזר או חלופה</span> ${esc(r.alt ? 'לבחירתכם: השבת התמורה או כרטיס חלופי' : 'השבת התמורה')}${r.refund.chosen && r.refund.amount ? esc(`; ההחזר שלכם ${nis(r.refund.amount)}${r.refund.leg === 'back' ? ' (מחצית, טיסת החזור)' : ''}`) : ''}${r.choice === 'flew' ? esc('; טסתם בטיסה המאחרת, ולכן אין החזר') : ''}${cite(r.refund.section, T.law.url)}</li>`); }
	if (r.assistance.length) { gets.push(`<li class="${P}-get ${P}-get--due"><span class="${P}-kind">שירותי סיוע</span> ${esc(r.assistance.map((a) => `${ASSIST_HE[a.code]}${a.cond && a.code === 'hotel' ? ' (אם צריך לינה)' : ''}`).join(', '))}${cite(T.benefits.assistance_section, T.law.url)}</li>`); }
	if (r.event === 'downgrade') { gets.push(`<li class="${P}-get"><span class="${P}-kind">שדרוג</span> ${esc(T.downgrade.up_he)}${cite(T.downgrade.up_section, T.law.url)}</li>`); }
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${esc(label)}</p>`
		+ `<strong class="jtool-verdict__figure">${fig}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ board(reg, r)
		+ `<div class="${P}-box"><h3 class="${P}-h">מה מגיע לכם לפי החוק</h3><ul class="${P}-gets">${gets.join('')}</ul></div>`
		+ (r.flags.length ? `<ul class="jtool-flags ${P}-flags">${r.flags.map((f) => `<li class="${P}-flag ${P}-flag--${f.level}">${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${TS_SIM('court_rehearsal')}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את הדיון בתביעה הקטנה</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** The rights by situation (the page table, compare_table). */
export function rightsTable(reg) {
	const T = reg.consumer_tisa;
	const a = T.amounts.bands;
	const comp = `${nis(a[0].amount)} / ${nis(a[1].amount)} / ${nis(a[2].amount)} לנוסע`;
	const rows = [
		['הטיסה בוטלה', 'מזון, שיחות, מלון והסעה לפי הצורך', 'לבחירתכם', `${comp}, אלא אם הודעה מראש או פטור`, `${T.cancel.section}`],
		[`איחור של ${T.delay.food_hours} שעות לפחות`, 'מזון, שתייה ושיחות', '—', '—', T.delay.food_section],
		[`איחור של ${T.delay.refund_hours} עד ${T.defs.cancelled_hours} שעות`, 'מזון ושיחות; לינה אם החלופה למחרת', 'לבחירתכם', '—', T.delay.refund_section],
		[`איחור של ${T.defs.cancelled_hours} שעות ומעלה`, 'כמו ביטול', 'לבחירתכם', comp, `${T.defs.section}, ${T.cancel.section}`],
		['סירוב להטיס (רישום יתר)', 'כמו ביטול', 'לבחירתכם', `${comp}; בלי פטור הודעה מראש`, T.denied.section],
		[`הקדמה ביותר מ-${T.advance.refund_over_hours} עד ${T.advance.comp_over_hours} שעות, הודעה פחות מ-${T.advance.notice_days} ימים`, '—', 'לבחירתכם', '—', T.advance.refund_section],
		[`הקדמה ביותר מ-${T.advance.comp_over_hours} שעות, הודעה פחות מ-${T.advance.notice_days} ימים`, '—', 'לבחירתכם', comp, T.advance.comp_section],
		['הורדה במחלקה', '—', '—', `${T.downgrade.rows.map((x) => `${x.pct}%`).join(' / ')} מהמחיר`, T.downgrade.section],
		[`טיסה פנים-ארצית (ביטול = ${T.domestic.cancelled_hours} שעות איחור)`, 'כמו ביטול', 'לבחירתכם', `${T.domestic.lines.map((l) => nis(l.base)).join(' / ')} (סכומי בסיס, 2013)`, `${T.domestic_rule.section}; ${T.domestic.amounts_section}`],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מה מגיע לפי חוק שירותי תעופה, לפי מה שקרה: שירותי סיוע, השבת תמורה או כרטיס חלופי, ופיצוי כספי לפי מרחק (עד 2,000 / עד 4,500 / מעל 4,500 ק"מ). סכומי ${T.amounts.year} בנוסח העדכני ל-${isoToHe(T.law.current_to)}; נבדק ${isoToHe(T.checked_on)}.</caption><thead><tr><th scope="col">מה קרה</th><th scope="col">שירותי סיוע</th><th scope="col">החזר או כרטיס חלופי</th><th scope="col">פיצוי כספי</th><th scope="col">הסעיף</th></tr></thead><tbody>`
		+ rows.map(([what, help, ref, money1, sec]) => `<tr><td data-th="מה קרה">${esc(what)}</td><td data-th="שירותי סיוע">${esc(help)}</td><td data-th="החזר או חלופה">${esc(ref)}</td><td data-th="פיצוי כספי">${esc(money1)}</td><td data-th="הסעיף">${cite(sec, sec.indexOf('תקנה') !== -1 ? T.domestic.url : T.law.url)}</td></tr>`).join('')
		+ '</tbody></table></div>';
}

/** The schedules: the First (2026 and the 2012 base), the Second (percent) and the Third (package prices), the halving hours. */
export function amountsTable(reg, r) {
	const T = reg.consumer_tisa;
	const mine = r && r.ok && r.intl ? r.band : '';
	const one = `<div class="jtool-scroll" role="region" aria-labelledby="${P}-am-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">מרחק הטיסה</th><th scope="col">פיצוי לנוסע, ${T.amounts.year}</th><th scope="col">בחוק המקורי (2012)</th><th scope="col">מחצית מותרת אם החלופה נוחתת עד</th></tr></thead><tbody>`
		+ T.amounts.bands.map((b, k) => `<tr${b.key === mine ? ` class="${P}-mine"` : ''}><td data-th="מרחק">${esc(b.he)}${b.key === mine ? ' <strong>(הטיסה שלכם)</strong>' : ''}</td><td data-th="${T.amounts.year}">${ils(b.amount, 0)}</td><td data-th="2012">${ils(b.base, 0)}</td><td data-th="מחצית">${esc(`ביטול: ${hoursHe(T.cancel.half_hours[k])}; סירוב: ${hoursHe(T.denied.half_hours[k])}`)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(T.amounts.source_he)}${cite(T.amounts.section, T.amounts.url)}. ${esc(T.amounts.update_he)} (${esc(T.amounts.update_section)}). ההפחתה למחצית: ${esc(T.cancel.half_section)} ו${esc(T.denied.half_section)}. פיצויים לדוגמה בבית המשפט: עד ${esc(nis(T.exemplary.max))} (${esc(T.exemplary.section)}).</caption></table></div>`;
	const two = `<div class="jtool-scroll" role="region" aria-labelledby="${P}-am-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">ההעברה</th><th scope="col">שיעור ממחיר הכרטיס</th></tr></thead><tbody>`
		+ T.downgrade.rows.map((x) => `<tr><td data-th="ההעברה">${esc(x.he)}</td><td data-th="שיעור"><bdi>${x.pct}%</bdi></td></tr>`).join('')
		+ `</tbody><caption>התוספת השנייה: פיצוי על הורדה במחלקה, בתוך ${T.benefits.downgrade_days} ימים ממועד הטיסה${cite(T.downgrade.section, T.law.url)}. ${esc(T.downgrade.segment_he)}.</caption></table></div>`;
	const pk = T.package.rows;
	const three = `<div class="jtool-scroll" role="region" aria-labelledby="${P}-am-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">סוג הטיסה והמחלקה</th><th scope="col">עד 2,000 ק"מ</th><th scope="col">עד 4,500 ק"מ</th><th scope="col">מעל 4,500 ק"מ</th></tr></thead><tbody>`
		+ ['economy', 'business', 'first'].map((c) => `<tr><td data-th="סוג">${esc(pk[c].he)}</td>${pk[c].prices.map((v, k) => `<td data-th="${esc(['עד 2,000', 'עד 4,500', 'מעל 4,500'][k])}">${ils(v, 0)}</td>`).join('')}</tr>`).join('')
		+ `</tbody><caption>התוספת השלישית: ${esc(T.package.he)}, בנוסח העדכני; משמש להחזר ולפיצוי על הורדה במחלקה כשהכרטיס חלק מחבילת נופש ולא הוכח מחיר אחר${cite(T.package.section, T.law.url)}.</caption></table></div>`;
	return one + two + three;
}

/** The war-time temporary order, quoted (SH 3372), with the windows the tool checks. */
export function warTable(reg) {
	const W = reg.consumer_tisa.war;
	const rows = W.nocomp.map((p) => [`${isoToHe(p.from)} עד ${isoToHe(p.to)}`, 'אין פיצוי כספי בביטול או בהקדמה', W.nocomp_section]);
	rows.push([`${isoToHe(W.notice_from)} עד ${isoToHe(W.notice_to)}`, `אין פיצוי כספי אם המפעיל הוכיח הודעה ${W.notice_days} ימים לפחות לפני הטיסה`, W.notice_section]);
	rows.push(['מ-11.2.2025, כל עוד ההכרזה מ-7.10.2023 בתוקף', 'מפעיל שהפסיק לטוס לישראל מציע כרטיס חלופי גם מנקודת מוצא או ליעד אחרים', W.stopped_section]);
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-war-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">מועד הטיסה שבכרטיס</th><th scope="col">מה הוראת השעה קובעת</th><th scope="col">סעיף</th></tr></thead><tbody>`
		+ rows.map(([when, what, sec]) => `<tr><td data-th="מועד"><bdi>${esc(when)}</bdi></td><td data-th="מה נקבע">${esc(what)}</td><td data-th="סעיף">${cite(sec, W.url)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(W.he)}, ספר החוקים ${W.booklet}, ${isoToHe(W.published)}, עמ' ${W.page}. ${esc(W.keeps_he)}. ${esc(W.judgments_he)} (${esc(W.judgments_section)}).</caption></table></div>`
		+ `<blockquote class="${P}-quote"><p>"${esc(W.nocomp_quote_he)}".</p><footer>${esc(W.nocomp_section)}${cite('ספר החוקים', W.url)}</footer></blockquote>`;
}

/** What changed and when: only values an official text dates. */
export function changesTable(reg) {
	const T = reg.consumer_tisa;
	const rows = T.changes.slice().sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתי"><bdi>${isoToHe(x.from)}</bdi></td><td data-th="מה השתנה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section, x.url)}</td></tr>`).join('')
		+ `</tbody><caption>רק מה שפורסם בנוסח רשמי, עם התאריך שלו. רשימת התיקונים: מאגר החקיקה הלאומי של הכנסת${cite('החוק ותיקוניו', T.law.knesset_url)}.</caption></table></div>`;
}

function datesTable(reg, r) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הסעיף</th></tr></thead><tbody>`
		+ r.events.map((e) => `<tr><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi></td><td data-th="מה">${esc(e.he)}</td><td data-th="הסעיף">${e.section ? cite(e.section, e.url) : ''}</td></tr>`).join('')
		+ `</tbody><caption>מועד שנופל ביום מנוחה עובר ליום שאחריו (${esc(reg.car_accident.limitation.interpretation_he)}).${r.assumedSend ? ' הימים 21 ו-45 נספרים כאן מהיום, כאילו הדרישה נשלחת היום.' : ''}</caption></table></div>`;
}

function methodList(reg, r) {
	const T = reg.consumer_tisa;
	const items = [];
	items.push(`${whatHe(r)}, ${whereHe(r)}, מועד הטיסה ${isoToHe(r.flight)}`);
	if (r.none) {
		items.push(`${r.none.he}: אין הטבות (${r.none.section})`);
	} else {
		if (r.event === 'delay') { items.push(r.legalCancel ? `איחור של ${hoursHe(r.hours)} הוא "טיסה שבוטלה" (${r.intl ? `${T.defs.section}: ${T.defs.cancelled_hours} שעות` : `${T.domestic.def_section}: ${T.domestic.cancelled_hours} שעות`})` : `איחור של ${hoursHe(r.hours)}: ${r.hours >= T.delay.refund_hours && r.intl ? T.delay.refund_he : r.hours >= T.delay.food_hours ? T.delay.food_he : 'פחות משעתיים, אין הטבה'}`); }
		if (r.notc && r.notc.tier !== 'none') { items.push(`הודעה ${dayHe(r.noticeDays)} לפני הטיסה: ${r.notc.exempt ? 'פוטרת מפיצוי' : 'לא פוטרת מפיצוי'} (${T.cancel.notice_section})`); }
		if (r.war) { items.push(`הוראת השעה, ${r.war.section}: ${r.war.code === 'b_short' ? 'לא חלה כי ההודעה קצרה מ-3 ימים' : 'אין פיצוי כספי'}`); }
		if (r.comp.due && r.event !== 'downgrade') { items.push(`${r.intl ? `התוספת הראשונה, ${BAND_SHORT[r.band]}` : `${T.domestic.amounts_section}, ${LINE_HE[r.line]}`}: ${nis(r.perFull)} לנוסע${r.half ? `; מחצית, ${nis(r.perDue)}, כי החלופה נחתה עד ${hoursHe(r.halfHours)} אחרי` : ''}; × ${r.pax} = ${nis(r.total)}`); }
		if (r.event === 'downgrade' && r.downgrade) { items.push(`${r.downgrade.he}: ${r.downgrade.pct}%${r.downgrade.basePer ? ` × ${nis(r.downgrade.basePer)}${r.downgrade.ratio !== 1 ? ` × ${money(r.downgrade.ratio, 3)}` : ''} × ${r.pax} = ${nis(r.downgrade.amount)}` : ': חסר מחיר'}`); }
		if (r.refund && r.refund.chosen) { items.push(`השבת התמורה: ${r.refund.basePer ? `${nis(r.refund.basePer)}${r.refund.factor !== 1 ? ' × 50%' : ''} × ${r.pax} = ${nis(r.refund.amount)}${r.refund.basis === 'package' ? ' (התוספת השלישית)' : ''}` : 'כל מה ששולם, כולל מסים'} (${r.refund.section})`); }
	}
	items.push(`${T.limitation.years} שנים מהטיסה (${T.limitation.section})${r.lim.added ? `, ועוד ${r.lim.added} ימי מלחמה (${T.limitation.war_section})` : ''}${r.lim.rolled ? ', מעבר מיום מנוחה' : ''}: ${isoToHe(r.deadline)}`);
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

/** The letter box: the page-only fields, the text, and the copy button. */
function letterBox(reg, r, fields, dateIso) {
	const field = (id, label, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-lt-${id}">${esc(label)}</label><input id="${P}-lt-${id}" type="text" autocomplete="off" data-ts-letter="${id}" value="${esc(fields[id] || '')}" placeholder="${esc(ph)}"></div>`;
	return `<div class="${P}-letter"><p class="jtool-hint">הפרטים האלה נכנסים רק למכתב שבדף: הם לא נשמרים, לא נכנסים לקישור ולא נשלחים לשום מקום.</p>`
		+ `<div class="jtool-row">${field('name', 'השם במכתב', 'שם הנוסע/ת')}${field('airline', 'חברת התעופה', 'השם כפי שבכרטיס')}</div>`
		+ `<div class="jtool-row">${field('flightNo', 'מספר הטיסה', 'לדוגמה: אותיות ומספר')}${field('booking', 'מספר ההזמנה', 'מהכרטיס')}${field('contact', 'טלפון או דואר אלקטרוני', 'לתשובה')}</div>`
		+ `<pre class="${P}-doc" data-ts-letter-text>${esc(letterText(reg, r, fields, dateIso))}</pre></div>`;
}

/** The one-page print: inputs, result, the computation path, dates, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const T = reg.consumer_tisa;
	return '<h3>פיצוי לפי חוק שירותי תעופה: סיכום</h3>'
		+ `<p><strong>הנתונים:</strong> ${esc(whatHe(r))}; ${esc(whereHe(r))}; מועד הטיסה ${isoToHe(r.flight)}; ${esc(paxHe(r.pax))}${r.price ? `; מחיר לנוסע ${esc(nis(r.price))}` : ''}${r.choice ? `; בחירה: ${esc(CHOICE_HE[r.choice])}` : ''}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p>${methodList(reg, r)}`
		+ `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.he)}`).join('; ')}.</p>`
		+ `<p><strong>מקורות:</strong> ${esc(T.law.he)}, נוסח עדכני ל-${isoToHe(T.law.current_to)} (סכומי ${T.amounts.year}); ${esc(T.war.he)}, ספר החוקים ${T.war.booklet}; ${esc(T.domestic.he)}; חוק ההתיישנות, ${esc(T.limitation.war_section)}. נבדק ${isoToHe(T.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חושב, צעד אחר צעד</h3></div>${methodList(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-lt-h">הדרישה לחברת התעופה</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-doc">העתקת המכתב</button></div></div>${letterBox(reg, r, opts.letter || {}, opts.printedOn || r.today)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${datesTable(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-am-h">הסכומים בתוספות לחוק</h3></div>${amountsTable(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-war-h">הוראת השעה של המלחמה</h3></div>${warTable(reg)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || r.today || reg.consumer_tisa.checked_on)}</div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): the compensation of the example (or of the reader once
 * they change anything), with the refund and the law in one line, and a jump to the form. Same markup on the server and in
 * the browser, so the card never shifts the layout. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הטיסה שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">פיצוי על טיסה שבוטלה או איחרה</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const T = reg.consumer_tisa;
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}${whatHe(r)}, ${whereHe(r)}`;
	const amt = r.comp.due ? r.total : r.refund && r.refund.amount ? r.refund.amount : 0;
	const fig = `<bdi>${money(amt, Math.round(amt * 100) % 100 ? 2 : 0)}</bdi> ₪`;
	const unit = r.comp.due ? `פיצוי כספי ${lPax(r.pax)}` : r.refund && r.refund.amount ? 'השבת התמורה, בלי פיצוי כספי' : 'אין פיצוי כספי במקרה הזה';
	const line = `${r.comp.due && r.event !== 'downgrade' ? `${nis(r.perDue)} לנוסע לפי ${r.comp.section} ו${r.intl ? `התוספת הראשונה (${T.amounts.year})` : 'התקנות'}. ` : ''}${r.refund && r.refund.chosen && r.refund.amount && r.comp.due ? `ועוד השבת ${nis(r.refund.amount)} בתוך ${T.benefits.refund_days} ימים. ` : ''}אפשר לתבוע עד ${isoToHe(r.deadline)}.`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${fig}</strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const r = tsCompute(reg, EXAMPLE);
	const T = reg.consumer_tisa;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.total,
		sticky: ils(r.total, 0),
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: EXAMPLE.today }),
		method: `<ol><li>טיסה מישראל או לישראל שבוטלה ביום הטיסה, בלי הודעה מראש: שירותי סיוע, החזר או כרטיס חלופי, ופיצוי כספי${cite(T.cancel.rights_section, T.law.url)}</li>`
			+ `<li>מרחק של יותר מ-2,000 ועד 4,500 ק"מ: ${nis(r.perFull)} לנוסע, סכום ${T.amounts.year}${cite(T.amounts.section, T.amounts.url)}</li>`
			+ `<li>${r.pax} נוסעים: ${nis(r.total)}, בתוך ${T.benefits.comp_days} ימים מהפנייה בכתב${cite(T.benefits.comp_section, T.law.url)}</li>`
			+ `<li>השבת התמורה, ${nis(EXAMPLE.price)} × ${r.pax} = ${nis(r.refund.amount)}, בתוך ${T.benefits.refund_days} ימים${cite(T.benefits.refund_section, T.law.url)}</li>`
			+ `<li>התיישנות: ${T.limitation.years} שנים מ-${isoToHe(r.flight)}: ${isoToHe(r.lim.plain)}${r.lim.rolled ? `, יום מנוחה, ולכן ${isoToHe(r.deadline)}` : ''}${cite(T.limitation.section, T.law.url)}</li></ol>`,
		compare_table: rightsTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const amt = (id) => { const v = String(val(id)).replace(/[,\s₪]/g, ''); return v === '' ? '' : Number(v); };
	return {
		type: pick('type', 'intl'), event: pick('ev', 'cancel'), hours: amt('hr'), flight: tsIso(val('fl')), notice: tsIso(val('nt')),
		band: pick('band', 'b2'), km: amt('km'), line: val('ln') || 'other', pax: amt('px'), price: amt('pr'), leg: val('lg') || 'one',
		pkg: on('pkg'), cls: val('cl') || 'economy', choice: pick('ch', 'refund'), offered: on('off'), early: amt('ea'), late: amt('la'),
		refusedAlt: on('ref'), exempt: val('ex') || 'none', denied: val('dn') || 'overbooking', securityOk: on('sec'), down: val('dg') || 'be',
		segKm: amt('sk'), free: on('fr'), moved: on('mv'), noCheckin: on('ci'), foreign: on('fo'), order: on('or'), demand: tsIso(val('dm')), today,
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const T = reg.consumer_tisa;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	// The letter's names stay in this closure only: never in the hash, the store, analytics or the brief.
	const letter = {};
	let own = false;
	let started = false;
	let timer = null;
	let last = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(T.checked_on, T.refresh_every_days) || (T.next_update && today >= T.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהסכומים התעדכנו'); }
	}
	const ids = { flight: 'fl', hours: 'hr', notice: 'nt', km: 'km', pax: 'px', price: 'pr', early: 'ea', late: 'la', segKm: 'sk', demand: 'dm' };
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
	const sync = (input) => {
		const intl = input.type !== 'domestic';
		const show = (sel, yes) => form.querySelectorAll(sel).forEach((el) => { el.hidden = !yes; });
		show('[data-if-hours]', input.event === 'delay' || input.event === 'advance');
		show('[data-if-notice]', input.event === 'cancel' || input.event === 'delay' || input.event === 'advance');
		show('[data-if-intl]', intl);
		show('[data-if-domestic]', !intl);
		show('[data-if-choice]', input.event !== 'downgrade');
		show('[data-if-flew]', input.event === 'delay');
		show('[data-if-denied]', input.event === 'denied');
		show('[data-if-down]', input.event === 'downgrade');
		const hl = form.querySelector(`label[for="${P}-hr"]`);
		if (hl) { hl.textContent = input.event === 'advance' ? 'בכמה שעות הוקדמה ההמראה' : 'בכמה שעות איחרה ההמראה'; }
		const key = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return input.flight === addDays(input.today || today, -p.back) && p.event === input.event && p.band === input.band && Number(p.pax) === Number(input.pax) && intl; }) || '';
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = tsCompute(reg, input);
		last = r;
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { printedOn: today, letter });
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.comp.due ? r.total : 0, 0) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: tsBand(r) }); }
		return r;
	};
	// The example keeps its own "today"; the reader's first change moves the dates to today.
	const current = () => readForm(root, today);
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = current(); sync(input); run(input); }, 160);
	};
	// A share link may name its tool (/@pitzui-tisa); on a page with several tools only this tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	const fromHash = parsed ? Object.assign(parsed, { today }) : null;
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync(fromHash);
		run(fromHash, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	// The letter's own fields: they rewrite the letter text in place and nothing else.
	details.addEventListener('input', (ev) => {
		const el = ev.target.closest('[data-ts-letter]');
		if (!el) { return; }
		letter[el.getAttribute('data-ts-letter')] = el.value;
		const pre = details.querySelector('[data-ts-letter-text]');
		const r = last || tsCompute(reg, own ? current() : EXAMPLE);
		if (pre && r.ok) { pre.textContent = letterText(reg, r, letter, today); }
	});
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector(`.${P}-preset, input:not([type="radio"]):not([type="checkbox"])`);
			if (first) { setTimeout(() => first.focus({ preventScroll: true }), 350); }
			track('tool_lead_click', { tool_id: TOOL_ID });
		});
	}
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'preset') {
			const input = tsPreset(b.getAttribute('data-preset'), today);
			if (!input) { return; }
			own = true;
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		const input = own ? current() : Object.assign({}, EXAMPLE);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok) {
			const evs = r.events.filter((e) => e.kind !== 'start');
			download('pitzui-tisa.ics', 'text/calendar;charset=utf-8', ics(evs.map((e) => ({ date: e.date, summary: `טיסה: ${e.he}`, description: `${e.section || 'חוק שירותי תעופה'}. חושב ב-jus-tice.co.il לפי החוק; מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'copy-doc' && r.ok) {
			const ok = await copyText(letterText(reg, r, letter, today));
			toast(root, ok ? 'המכתב הועתק. השלימו את הפרטים שבסוגריים לפני השליחה.' : 'לא הצלחנו להעתיק.');
			track('tool_download', { tool_id: TOOL_ID, type: 'letter' });
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק תאריכים, מספרים וקודים, בלי שמות ובלי מספר הזמנה.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(T.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: tsBand(r) });
			const brief = r.ok ? aiBrief(reg, r) : '';
			const purpose = (/purpose=([a-z_]+)/.exec(b.getAttribute('href') || '') || [])[1] || 'court_rehearsal';
			if (brief && openSimulation(brief, purpose, b.getAttribute('href'))) {
				ev.preventDefault();
				toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.');
			} else {
				if (brief) { copyText(brief); }
				toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			}
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד, בלי הפרטים של המכתב. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { own = true; s.today = today; form.innerHTML = renderForm(reg, s); sync(s); run(s); }
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
