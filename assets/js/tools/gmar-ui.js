/**
 * The labor wave UI (22.10.2026): the final settlement, "what am I owed when I leave" (gmar-cheshbon, prefix jt56) on
 * /gmar-cheshbon/. The picture is the final-settlement sheet itself: the payslip of the last month as a payroll clerk
 * rules it, item / basis / section / amount, grouped into what the employer pays now, what the fund releases and what is
 * not paid out, closed by the totals. It reads at 390 px (each line folds into a labelled card) and has a one-paragraph
 * text equivalent. Under it: the dates the law sets (.ics), the computation path, the tax-exempt part, a printable claim
 * summary, a polite demand letter to copy, what changed and when, the scenario for the simulation (the settlement talk,
 * or the labour-court hearing when the employer refuses) and the next steps.
 */
import { gmCompute, gmBand, gmSpanHe, GM_DEFAULT } from './gmar-engine.js';
import { pzChanges, RESIGN_CODES } from './pitzuyim-engine.js';
import { parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'gmar-cheshbon';
const P = 'jt56';
const GM_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&topic=employment&purpose=';
const GM_REASON_HE = { fired: 'פיטורים', resign: 'התפטרות', health: 'התפטרות בגלל מצב בריאות', parent: 'התפטרות להורות (9 חודשים)', move: 'התפטרות בגלל מעבר דירה', term: 'חוזה לתקופה קצובה שלא חודש', worse: 'התפטרות בגלל הרעה מוחשית בתנאים', retire: 'התפטרות אחרי גיל הפרישה' };
const GM_S14_HE = { none: 'אין סעיף 14', partial: 'סעיף 14 על 72%', full: 'סעיף 14 מלא' };
const GM_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];

export const EXAMPLE = Object.assign({}, GM_DEFAULT);

/** One click to a full profile (each on its own fixed dates, so the figures never drift). */
export const PRESETS = {
	fired5: { he: 'פוטר אחרי 5 שנים, חודשי', input: EXAMPLE },
	resign2: { he: 'התפטר אחרי שנתיים, שעתי', input: Object.assign({}, EXAMPLE, { payType: 'hourly', salary: '', hourly: 45, hours: 160, start: '2024-10-01', end: '2026-09-30', reason: 'resign', s14: 'partial', noticeDate: '2026-09-09', vacUsed: 10, hvPaid: 'years' }) },
	worse: { he: 'התפטרות בגלל הרעה מוחשית', input: Object.assign({}, EXAMPLE, { salary: 10000, start: '2022-09-01', end: '2026-09-30', reason: 'worse', groundOk: true, s14: 'partial', noticeDate: '2026-08-31', vacUsed: 25, hvPaid: 'none' }) },
	s14full: { he: 'סעיף 14 מלא, 7 שנים', input: Object.assign({}, EXAMPLE, { salary: 15000, start: '2019-10-01', end: '2026-09-30', reason: 'fired', s14: 'full', noticeDate: '2026-08-31', noticeMode: 'paid', vacUsed: 40, hvPaid: 'years' }) },
	nonotice: { he: 'פוטר בלי הודעה, 3 שנים', input: Object.assign({}, EXAMPLE, { salary: 9000, start: '2023-09-15', end: '2026-09-15', reason: 'fired', s14: 'none', noticeDate: '', noticeMode: 'none', vacUsed: 20, hvPaid: 'none' }) },
};

const gmNis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const gmIls = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const gmCite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const gmChip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const gmIso = (text) => { const raw = String(text || '').trim(); return raw ? (parseDate(raw) || raw) : ''; };
const gmSpan = (s) => gmSpanHe(s) || 'פחות מיום';
const gmWho = (g) => (g.payType === 'hourly' ? 'עובד לפי שעה' : 'עובד במשכורת חודשית');
const gmSame = (a, b) => Object.keys(GM_DEFAULT).every((k) => k === 'asOf' || String(a[k] ?? '') === String(b[k] ?? ''));

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, GM_DEFAULT, input || {});
	const preset = Object.keys(PRESETS).find((k) => gmSame(PRESETS[k].input, i)) || '';
	const date = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 30.9.2026" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const field = (id, label, v, ph, hint, suffix) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label>${suffix ? '<div class="jtool-input jtool-input--money">' : ''}<input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v === '' || v === undefined || v === null ? '' : v)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${suffix ? `<span class="jtool-input__suffix" aria-hidden="true">${suffix}</span></div>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const ground = RESIGN_CODES.includes(i.reason) && i.reason !== 'term';
	const more = Boolean(i.lastDays !== '' || i.lastHours !== '' || i.fundBal !== '');
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא את כל השדות; אפשר לשנות כל שדה, והחישוב מתעדכן מיד.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>איך העבודה הסתיימה</legend><div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-why">מי סיים ולמה</label><select id="${P}-why">`
		+ Object.entries(GM_REASON_HE).map(([v, l]) => `<option value="${v}"${i.reason === v ? ' selected' : ''}>${esc(l)}</option>`).join('')
		+ `</select><p class="jtool-hint">התפטרות מאחת הסיבות שבחוק נחשבת לפיטורים לעניין הפיצויים.</p></div></div>`
		+ `<label class="jtool-chip ${P}-ground" data-if-ground${ground ? '' : ' hidden'}><input type="checkbox" id="${P}-gok"${i.groundOk ? ' checked' : ''}><span>התנאים של הסיבה הזאת מתקיימים (מוכיחים אותם בתביעה)</span></label></fieldset>`
		+ `<fieldset class="jtool-field"><legend>איך משולם השכר</legend><div class="jtool-chips">${gmChip('pay', 'monthly', 'משכורת חודשית', i.payType !== 'hourly')}${gmChip('pay', 'hourly', 'לפי שעה או יום', i.payType === 'hourly')}</div></fieldset>`
		+ `<div class="jtool-row">${date('start', 'יום תחילת העבודה', i.start, '')}${date('end', 'היום האחרון בעבודה', i.end, 'אפשר גם יום מתוכנן')}</div>`
		+ `<div class="jtool-row" data-if-pay="monthly"${i.payType === 'hourly' ? ' hidden' : ''}>${field('sal', 'משכורת חודשית רגילה (ברוטו)', i.salary === '' ? '' : money(i.salary, 0), 'לדוגמה: 12,000', 'השכר הקובע: יסוד ותוספות קבועות', '₪')}${field('pct', 'היקף המשרה', i.jobPct, '100', 'באחוזים', '%')}</div>`
		+ `<div class="jtool-row" data-if-pay="hourly"${i.payType === 'hourly' ? '' : ' hidden'}>${field('hr', 'שכר לשעה', i.hourly, 'לדוגמה: 45', '', '₪')}${field('hrs', 'ממוצע שעות בחודש', i.hours, 'לדוגמה: 160', 'לפי התלושים האחרונים')}</div>`
		+ `<fieldset class="jtool-field"><legend>שבוע העבודה במקום העבודה</legend><div class="jtool-chips">${gmChip('week', '5', '5 ימים', Number(i.week) !== 6)}${gmChip('week', '6', '6 ימים', Number(i.week) === 6)}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>סעיף 14 (הפרשות לפיצויים בקופה)</legend><div class="jtool-chips">${gmChip('s14', 'none', 'אין / לא יודעים', i.s14 === 'none')}${gmChip('s14', 'partial', 'על 72% (6%)', i.s14 === 'partial')}${gmChip('s14', 'full', 'מלא (8⅓%)', i.s14 === 'full')}</div><p class="jtool-hint">רואים בתלוש ובהסכם העבודה; 6% לפיצויים מכסים 72%, 8⅓% מכסים הכול.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>ההודעה המוקדמת</legend><div class="jtool-chips">${gmChip('nm', 'worked', 'עבדו עד הסוף', i.noticeMode === 'worked')}${gmChip('nm', 'paid', 'המעסיק ויתר על העבודה', i.noticeMode === 'paid')}${gmChip('nm', 'none', 'לא ניתנה הודעה', i.noticeMode === 'none')}</div>`
		+ `<div class="jtool-row" data-if-notice${i.noticeMode === 'none' ? ' hidden' : ''}>${date('nd', 'יום מסירת ההודעה', i.noticeDate, 'בכתב; היום הזה לא נספר')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>חופשה שנתית</legend><div class="jtool-chips">${gmChip('vm', 'compute', 'לחשב לפי החוק', i.vacMode !== 'balance')}${gmChip('vm', 'balance', 'יש יתרה בתלוש', i.vacMode === 'balance')}</div>`
		+ `<div class="jtool-row"><div data-if-vac="compute"${i.vacMode === 'balance' ? ' hidden' : ''}>${field('vu', 'ימי חופשה שניצלתם בשנה האחרונה ובשלוש שלפניה', i.vacUsed, '0', 'ימי עבודה')}</div><div data-if-vac="balance"${i.vacMode === 'balance' ? '' : ' hidden'}>${field('vb', 'יתרת ימי החופשה בתלוש האחרון', i.vacBalance, 'לדוגמה: 12', '')}</div></div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>דמי הבראה ששולמו</legend><div class="jtool-chips">${gmChip('hp', 'years', 'על כל השנים המלאות', i.hvPaid === 'years')}${gmChip('hp', 'none', 'לא שולמו', i.hvPaid === 'none')}${gmChip('hp', 'amount', 'סכום אחר', i.hvPaid === 'amount')}</div>`
		+ `<div class="jtool-row" data-if-hv${i.hvPaid === 'amount' ? '' : ' hidden'}>${field('ha', 'כמה שולם בתקופה', i.hvAmount, '0', 'לפי התלושים', '₪')}</div></fieldset>`
		+ `<details class="jtool-more ${P}-more"${more ? ' open' : ''}><summary>החודש האחרון והקופה (לא חובה)</summary>`
		+ `<div class="jtool-row">${field('ld', 'ימי עבודה בחודש האחרון', i.lastDays, 'ריק = לפי לוח השבוע', 'עד היום האחרון')}<div data-if-pay="hourly"${i.payType === 'hourly' ? '' : ' hidden'}>${field('lh', 'שעות בחודש האחרון', i.lastHours, 'ריק = לפי הממוצע', '')}</div>${field('fb', 'יתרת הפיצויים בקופה', i.fundBal === '' ? '' : money(i.fundBal, 0), 'מהדוח השנתי', 'רכיב הפיצויים בלבד', '₪')}</div></details>`;
}

export function verdictSentence(reg, g) {
	if (!g.ok) { return ''; }
	const parts = g.lines.filter((x) => x.bucket === 'employer' && x.amount > 0).map((x) => `${x.he} ${gmNis(x.amount)}`);
	const off = g.offset ? ` פחות ${gmNis(-g.offset)} שהמעסיק עשוי לקזז על הודעה מוקדמת שלא ניתנה.` : '';
	const fund = g.fund > 0 ? ` מהקופה משתחררים עוד ${gmNis(g.fund)}${g.lines.some((x) => x.code === 'fund' && x.basis.includes('הוזנה')) ? '' : ' (לפי השכר הקובע)'}; סך הכול ${gmNis(g.total)}.` : g.fundUnknown ? ' הכספים בקופה לפיצויים שלכם, לפי הדוח של הקופה.' : '';
	return `${GM_REASON_HE[g.reason]} אחרי ${gmSpan(g.r.span)}, היום האחרון ${isoToHe(g.end)}. בגמר החשבון המעסיק משלם ${gmNis(g.employerNow)}: ${parts.join('; ') || 'אין רכיב לתשלום'}.${off}${fund}`;
}

/** The final-settlement sheet: the last month's payslip as the clerk rules it. */
export function sheet(reg, g) {
	if (!g.ok) { return ''; }
	const [y, m] = g.end.split('-').map(Number);
	const row = (x) => {
		const amt = x.amount === null ? '<span class="jt56-na">לא חושב</span>' : x.bucket === 'none' ? '<span class="jt56-na">לא נפדה</span>' : gmIls(x.amount);
		return `<tr class="jt56-l jt56-l--${x.bucket}"><th scope="row" data-th="רכיב">${esc(x.he)}</th><td data-th="בסיס החישוב">${esc(x.basis)}${x.note ? `<small>${esc(x.note)}</small>` : ''}</td><td data-th="סעיף">${gmCite(x.section, x.url)}</td><td data-th="סכום" class="jt56-amt">${amt}</td></tr>`;
	};
	const group = (bucket, title) => {
		const ls = g.lines.filter((x) => x.bucket === bucket);
		return ls.length ? `<tbody class="jt56-g jt56-g--${bucket}"><tr class="jt56-gh"><th colspan="4" scope="rowgroup">${esc(title)}</th></tr>${ls.map(row).join('')}</tbody>` : '';
	};
	const said = `גמר חשבון לחודש ${GM_MONTHS[m - 1]} ${y}: המעסיק משלם ${gmNis(g.employerNow)}${g.offset ? ` אחרי קיזוז של ${gmNis(-g.offset)}` : ''}${g.fund > 0 ? `, הקופה משחררת ${gmNis(g.fund)}, סך הכול ${gmNis(g.total)}` : ''}. ${g.lines.filter((x) => x.amount !== null && x.bucket !== 'none').map((x) => `${x.he}: ${gmNis(x.amount)}`).join('; ')}. ימי מחלה לא נפדים.`;
	return `<figure class="jt56-sheet"><figcaption class="jt56-sheet__h"><span>גמר חשבון · תלוש ${GM_MONTHS[m - 1]} ${y}</span><span>${esc(gmWho(g))} · ${isoToHe(g.start)} עד ${isoToHe(g.end)} · ותק ${esc(gmSpan(g.r.span))}</span></figcaption>`
		+ `<p class="jtool-visually-hidden">${esc(said)}</p>`
		+ `<table class="jt56-t" aria-hidden="true"><thead><tr><th scope="col">רכיב</th><th scope="col">בסיס החישוב</th><th scope="col">סעיף</th><th scope="col">סכום</th></tr></thead>`
		+ group('employer', 'המעסיק משלם') + group('offset', 'קיזוז אפשרי') + group('fund', 'הקופה משחררת') + group('none', 'לא משולם בסיום')
		+ `<tfoot><tr class="jt56-tot"><th scope="row" colspan="3">המעסיק משלם עכשיו</th><td class="jt56-amt">${gmIls(g.employerNow)}</td></tr>`
		+ (g.fund > 0 || g.fundUnknown ? `<tr class="jt56-tot jt56-tot--fund"><th scope="row" colspan="3">מהקופה${g.fundUnknown ? ' (לפי הדוח של הקופה)' : ''}</th><td class="jt56-amt">${g.fundUnknown ? '<span class="jt56-na">לפי הקופה</span>' : gmIls(g.fund)}</td></tr><tr class="jt56-tot jt56-tot--all"><th scope="row" colspan="3">סך הכול</th><td class="jt56-amt">${gmIls(g.total)}${g.fundUnknown ? ' +' : ''}</td></tr>` : '')
		+ '</tfoot></table>'
		+ `<p class="jt56-sheet__f">${g.tax.exempt !== null && g.r.entitled ? `הפטור ממס על הפיצויים: עד ${gmNis(g.tax.exempt)} (${esc(g.tax.section)} לפקודת מס הכנסה). ` : ''}המועד: ${isoToHe(g.dueSalary)}; מולן מ-${isoToHe(g.lateSalary)}.</p></figure>`;
}

/** The scenario for the simulation: computed facts only, never a name, an ID or an address. */
export function aiBrief(reg, g, purpose = 'mediation') {
	if (!g.ok) { return ''; }
	const items = g.lines.filter((x) => x.bucket === 'employer' && x.amount > 0).map((x) => x.he).join(', ');
	const fund = g.fund > 0 ? ` מהקופה משתחררים עוד ${gmNis(g.fund)}.` : '';
	const off = g.offset ? ` המעסיק עשוי לקזז ${gmNis(-g.offset)} על הודעה מוקדמת.` : '';
	const head = `${gmWho(g)} עם ותק של ${gmSpan(g.r.span)} סיים לעבוד ב-${isoToHe(g.end)} (${GM_REASON_HE[g.reason]}). לפי החישוב, בגמר החשבון המעסיק צריך לשלם ${gmNis(g.employerNow)}: ${items || 'אין רכיב לתשלום'}.${fund}${off}`;
	if (purpose === 'court_rehearsal') {
		return `${head} המעסיק לא שילם עד המועד. השאלה לתרגול: הדיון בבית הדין האזורי לעבודה. איך מציגים את התביעה, את התלושים ואת דרך החישוב, ומה עונים לטענת קיזוז או לטענה שהכול שולם?`;
	}
	return `${head} השאלה לתרגול: השיחה על גמר החשבון עם המעסיק. איך מציגים את הרכיבים, מבקשים פירוט בכתב, טופס 161 ואישור על תקופת העבודה, ומסכמים מועד תשלום?`;
}

/** The "what to do now" list: the official route first, then the pages of this site that fit the result. */
export function nextActions(reg, g) {
	const lg = reg.labor_gmar;
	const out = [
		{ he: `לבקש מהמעסיק את גמר החשבון בכתב, עם תלוש החודש האחרון, ${lg.form_161.he} והאישור על תקופת העבודה`, url: lg.form_161.url },
		{ he: `${lg.ministry.complaint_he}: ${lg.ministry.complaint_note_he}`, url: lg.ministry.complaint_url },
		{ he: lg.ministry.topic_he, url: lg.ministry.topic_url },
	];
	const links = [];
	if (g.ok && g.r.entitled) { links.push({ path: '/severance-pay-calculator/', he: 'הפיצויים לפרטים: השכר הקובע, סעיף 14 וההפקדות בקופה' }); }
	if (g.ok && RESIGN_CODES.includes(g.reason) && g.reason !== 'term') { links.push({ path: '/resignation-deemed-dismissal/', he: 'מתי התפטרות נחשבת לפיטורים, ומה מוכיחים' }); }
	if (g.ok && g.reason === 'fired') { links.push({ path: '/unemployment-benefits-eligibility/', he: 'דמי אבטלה: הרישום בשירות התעסוקה והזכאות' }); }
	links.push({ path: '/claim-labor-court/', he: 'אם לא שילמו: תביעה בבית הדין לעבודה' });
	links.push({ path: '/tofes-161/', he: 'טופס 161: מה ממלאים ומה בוחרים לגבי הפיצויים' });
	return { official: out, links: links.slice(0, 4) };
}

/** A polite demand letter built from the ledger: placeholders for every name, never personal details. */
export function letter(reg, g, today) {
	if (!g.ok) { return ''; }
	const lg = reg.labor_gmar;
	const sv = reg.severance;
	const pay = g.lines.filter((x) => x.bucket === 'employer' && x.amount > 0);
	const lines = [
		`[תאריך: ${isoToHe(today || g.asOf)}]`, 'לכבוד', '[שם המעסיק]', '[כתובת המעסיק]', '',
		'הנדון: דרישה לתשלום גמר חשבון', '',
		`1. עבדתי אצלכם מ-${isoToHe(g.start)} עד ${isoToHe(g.end)}, ${g.payType === 'hourly' ? 'לפי שעה' : 'במשכורת חודשית'}. העבודה הסתיימה ב${GM_REASON_HE[g.reason]}.`,
		'2. לפי החישוב שלי, אלה הסכומים שמגיעים לי בגמר החשבון:',
		...pay.map((x) => `   - ${x.he}: ${gmNis(x.amount)} (${x.section})`),
		...(g.offset ? [`   - בניכוי הודעה מוקדמת שלא ניתנה: ${gmNis(-g.offset)} (סעיף 7(ב) לחוק הודעה מוקדמת)`] : []),
		`   סך הכול לתשלום מכם: ${gmNis(g.employerNow)}.`,
	];
	let n = 3;
	if (g.s14 !== 'none') { lines.push(`${n}. אבקש לשחרר לי את כספי הפיצויים שבקופה, ולהודיע לקופה בכתב על הסכמתכם לתשלום (${lg.wage.fund_notice_section} לחוק הגנת השכר).`); n += 1; }
	lines.push(`${n}. אבקש למסור לי ${lg.form_161.he} ואישור בכתב על תקופת העבודה (סעיף 8 לחוק הודעה מוקדמת).`); n += 1;
	lines.push(`${n}. השכר ופדיון החופשה משולמים עם תום החודש (${reg.labor_chufsha.wage.due_section} לחוק הגנת השכר)${g.r.entitled ? `, והפיצויים ביום סיום העבודה; פיצויים שלא שולמו תוך ${sv.late.grace_days} ימים הם פיצויים מולנים (${sv.late.section} לחוק הגנת השכר)` : ''}.`); n += 1;
	lines.push(`${n}. אם החישוב שלכם שונה, אבקש לקבל אותו בכתב, עם התלושים, תוך 14 ימים.`);
	lines.push('', 'בכבוד רב,', '[שם העובד]');
	return lines.join('\n');
}

/** What changed and when: only values the sibling datasets already hold, each with its source. */
export function changesRows(reg) {
	const rows = pzChanges(reg).map((x) => ({ date: x.date, he: x.he, src: x.src, url: x.url }));
	const am = reg.labor_chufsha.history.amendment;
	const t = reg.labor_chufsha.law_table.rows[0];
	const b = reg.labor_chufsha.history.before.rows[0];
	rows.push({ date: am.from, he: `חופשה שנתית: ${t.gross} ימים בכל אחת מ-${t.to} השנים הראשונות (${t.net5} ימי עבודה בשבוע של 5), במקום ${b.gross} ימים בכל אחת מ-${b.to} השנים הראשונות`, src: am.gazette_he, url: am.url });
	for (const x of reg.havraa.private_rates) { rows.push({ date: x.from, he: `יום הבראה במגזר הפרטי: ${money(x.rate, x.rate % 1 ? 2 : 0)} ₪ (${x.label_he})`, src: x.source_he, url: x.url }); }
	for (const x of reg.havraa.freezes || []) { rows.push({ date: `${x.year}`, he: `דמי ההבראה הוקפאו ב-${x.year}, ונוכה יום הבראה אחד`, src: `${x.law_he}, ${x.section}`, url: x.url }); }
	return rows.sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

function changesTable(reg) {
	const day = (d) => (/^\d{4}$/.test(String(d)) ? String(d) : isoToHe(d));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ changesRows(reg).map((x) => `<tr><td data-th="מתי"><bdi>${esc(day(x.date))}</bdi></td><td data-th="מה השתנה">${esc(x.he)}</td><td data-th="מקור">${gmCite(x.src, x.url)}</td></tr>`).join('')
		+ '</tbody><caption>רק ערכים שפורסמו בנוסח רשמי, עם התאריך שלהם.</caption></table></div>';
}

function datesTable(reg, g, opts = {}) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ g.events.map((e) => { const past = opts.today && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.he)}</td><td data-th="הכלל">${gmCite(e.section, e.url)}</td></tr>`; }).join('')
		+ '</tbody><caption>רק מועדים שחוק או רשות קובעים. מועד שנופל ביום מנוחה עובר ליום שאחריו (חוק הפרשנות, סעיף 10(ג)). לדמי אבטלה אין מועד בחוק לגמר החשבון: נרשמים בשירות התעסוקה סמוך לסיום.</caption></table></div>';
}

function methodList(reg, g) {
	const r = g.r;
	const sv = reg.severance;
	const items = [];
	items.push(`ותק: מ-${isoToHe(g.start)} עד ${isoToHe(g.end)} = ${gmSpan(r.span)} (${r.span.years.toFixed(4)} שנים); השכר הקובע ${gmNis(r.base)}${r.floored ? ', לפי שכר המינימום (סעיף 13ב)' : ''}`);
	items.push(g.last.full ? `שכר החודש האחרון: חודש מלא, ${gmNis(g.last.amount)}` : g.payType === 'hourly' ? `שכר החודש האחרון: ${g.last.hours} שעות × ${money(Number(g.input.hourly), 2)} ₪ = ${gmNis(g.last.amount)}` : `שכר החודש האחרון: ${gmNis(Number(g.input.salary))} × ${g.last.worked} ÷ ${g.last.sched} ימי עבודה = ${gmNis(g.last.amount)}`);
	items.push(`הודעה מוקדמת: ${r.notice.month ? 'חודש' : `${r.notice.days} ימים`} (${r.notice.section}, הטבלה של משרד העבודה); השכר הרגיל בעדה ${gmNis(g.nt.full)}${g.nt.days ? `; ${g.nt.days} ימים × ${gmNis(r.base)} ÷ 30, לכל היותר ההודעה כולה` : ''}: ${gmNis(g.nt.amount)} (${g.nt.section})`);
	if (r.entitled) { items.push(`פיצויים: ${gmNis(r.base)} × ${r.span.years.toFixed(4)} = ${gmNis(r.severance)} (סעיף 12)${g.s14 !== 'none' ? `; הקופה מכסה ${r.s14Pct}% = ${gmNis(r.fundReplaces)}, המעסיק משלים ${gmNis(r.employer)}${g.fc.ok && g.fc.gap ? ` ועוד ${gmNis(g.fc.gap.extra)} על השכר שלא הופרש ממנו` : ''} (סעיף 14)` : ''}`); } else { items.push(`פיצויים: אין זכות מהמעסיק (${r.reason === 'resign' ? 'התפטרות רגילה' : !r.yearOk ? 'פחות משנה' : 'העילה לא אושרה'})${g.s14 !== 'none' ? '; הכספים בקופה שייכים לעובד' : ''}`); }
	items.push(g.vac.ok ? `פדיון חופשה: ${g.vac.mode === 'balance' ? `${g.vac.days} ימים מהתלוש` : `${g.vac.accrued} ימים שנצברו ב-${g.vac.window.from} עד ${g.vac.window.to}, פחות ${g.vac.used} שנוצלו = ${g.vac.days}`} × ${money(g.vac.dayValue, 2)} ₪ (משכורת ÷ ${money(g.vac.divisor, 2)}) = ${gmNis(g.vac.value)} (מחשבון החופשה השנתית, סעיפים 10 ו-13)` : 'פדיון חופשה: לא חושב');
	items.push(g.hv.ok ? (g.hv.state === 'not_eligible' ? 'דמי הבראה: פחות משנת עבודה, אין זכות' : `דמי הבראה: ${money(g.hv.daysDue, 2)} ימים בשווי ${gmNis(g.hv.net)}${g.hv.paid ? `, פחות ${gmNis(g.hv.paid)} ששולמו` : ''} = ${gmNis(g.hv.gap)} (מחשבון דמי ההבראה, כל שנת עבודה במחיר של 1 ביולי שבה)`) : 'דמי הבראה: לא חושבו');
	if (r.entitled && g.tax.exempt !== null) { items.push(`פטור ממס: משכורת חודש לכל שנה, עד ${money(g.tax.ceiling, 0)} ₪ לשנה: ${gmNis(g.tax.exempt)} (${sv.tax.section})${g.tax.taxable ? `; החלק החייב ${gmNis(g.tax.taxable)}` : ''}`); }
	items.push(`סך הכול: המעסיק ${gmNis(g.employerNow)}${g.fund ? ` + הקופה ${gmNis(g.fund)} = ${gmNis(g.total)}` : ''}`);
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

/** The printable claim summary: the ledger, the dates, the sources with their dates, the day it was prepared. */
export function printSummary(reg, g, printedOn) {
	if (!g.ok) { return ''; }
	const lg = reg.labor_gmar;
	const sv = reg.severance;
	const lc = reg.labor_chufsha;
	return `<h3>גמר חשבון: סיכום לדרישה או לתביעה</h3>`
		+ `<p><strong>הנתונים:</strong> ${esc(GM_REASON_HE[g.reason])}; ${esc(gmWho(g))}; ${isoToHe(g.start)} עד ${isoToHe(g.end)}; ${esc(GM_S14_HE[g.s14])}; שבוע של ${g.week} ימים.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, g))}</p>`
		+ `<table class="${P}-pt"><thead><tr><th>רכיב</th><th>בסיס</th><th>סעיף</th><th>סכום</th></tr></thead><tbody>${g.lines.map((x) => `<tr><td>${esc(x.he)}</td><td>${esc(x.basis)}</td><td>${esc(x.section)}</td><td>${x.amount === null ? 'לא חושב' : x.bucket === 'none' ? 'לא נפדה' : esc(gmNis(x.amount))}</td></tr>`).join('')}</tbody></table>`
		+ `<p><strong>דרך החישוב:</strong></p>${methodList(reg, g)}`
		+ `<p><strong>מועדים:</strong> ${g.events.map((e) => `${isoToHe(e.date)} ${esc(e.he)}`).join('; ')}.</p>`
		+ `<p><strong>מקורות:</strong> ${esc(sv.law_he)}; ${esc(sv.notice.he)}; ${esc(lc.law.he)}, נוסח ל-${isoToHe(lc.law.current_to)}; ${esc(reg.havraa.order_he)}; ${esc(lg.wage.he)}, נוסח ל-${isoToHe(lg.wage.current_to)}; ${esc(lg.sick.he)}; ${esc(sv.tax.law_he)}, ${esc(sv.tax.section)}; ${esc(sv.limitation.he)}; רשות המסים, ${esc(lg.form_161.he)}. נבדק ${isoToHe(lg.checked_on)}.</p>`
		+ `<p>הוכן ב-${isoToHe(printedOn)} ב-jus-tice.co.il, לשיחה עם המעסיק, לבית הדין לעבודה או לעורך דין. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderResult(reg, g, opts = {}) {
	if (!g.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${g.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const na = nextActions(reg, g);
	const brief = aiBrief(reg, g, 'mediation');
	const state = g.employerNow > 0 ? `<p class="jtool-state jtool-state--ok">✓ גמר חשבון לפי החוקים, רכיב אחר רכיב</p>` : '<p class="jtool-state jtool-state--info">i לפי הנתונים אין סכום לתשלום מהמעסיק</p>';
	const rows = [];
	if (g.fund > 0 || g.fundUnknown) { rows.push(`<div><dt>מהקופה (סעיף 14)</dt><dd>${g.fundUnknown ? 'לפי הדוח של הקופה' : gmIls(g.fund)}</dd></div>`); }
	if (g.fund > 0) { rows.push(`<div><dt>סך הכול</dt><dd>${gmIls(g.total)}</dd></div>`); }
	if (g.offset) { rows.push(`<div><dt>קיזוז אפשרי (הודעה)</dt><dd>${gmIls(g.offset)}</dd></div>`); }
	rows.push(`<div><dt>מועד התשלום</dt><dd><bdi>${isoToHe(g.dueSalary)}</bdi></dd></div>`);
	const flags = g.flags;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}המעסיק משלם בגמר החשבון</p>`
		+ `<strong class="jtool-verdict__figure">${gmIls(g.employerNow)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, g))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ sheet(reg, g)
		+ (flags.length ? `<ul class="jtool-flags ${P}-flags">${flags.map((f) => `<li class="${P}-flag ${P}-flag--${f.level === 'bad' ? 'danger' : f.level}">${esc(f.he)}${f.section ? gmCite(f.section, f.url) : ''}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><div class="jtool-actions"><a class="jtool-btn" href="${GM_SIM}mediation" target="_blank" rel="noopener" data-act="rehearse" data-purpose="mediation">לתרגל את שיחת גמר החשבון</a><a class="jtool-btn ${P}-btn2" href="${GM_SIM}court_rehearsal" target="_blank" rel="noopener" data-act="rehearse" data-purpose="court_rehearsal">אם לא שילמו: לתרגל את הדיון בבית הדין</a></div></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

export function renderDetails(reg, g, opts = {}) {
	if (!g.ok) { return ''; }
	const lg = reg.labor_gmar;
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שהחוק קובע</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום לתביעה</button><button class="jtool-btn" type="button" data-act="copy-doc">העתקה כמכתב למעסיק</button></div></div>${datesTable(reg, g, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חושב, רכיב אחר רכיב</h3></div>${methodList(reg, g)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-x-h">מה לא משולם, ומה אסור לנכות</h3></div><ul class="${P}-list">`
		+ `<li>${esc(lg.sick.absence_he)}.${gmCite(`${lg.sick.absence_section} לחוק דמי מחלה`, lg.sick.url)} ${esc(lg.sick.agreed_he)}.${gmCite(lg.sick.agreed_section, lg.sick.url)}</li>`
		+ `<li>${esc(lg.sick.no_dismissal_he)}.${gmCite(lg.sick.no_dismissal_section, lg.sick.url)}</li>`
		+ `<li>${esc(lg.wage.deduct_he)}.${gmCite(`${lg.wage.deduct_section} לחוק הגנת השכר`, lg.wage.url)} ${esc(lg.wage.deduct_last_he)}.${gmCite(lg.wage.deduct_last_section, lg.wage.url)}</li>`
		+ `<li>${esc(lg.form_161.when_he)}; ${esc(lg.form_161.to_he)}. ${esc(lg.form_161.worker_he)}.${gmCite('רשות המסים', lg.form_161.url)}</li></ul></div>`
		+ `<details class="jtool-more ${P}-letter"><summary>המכתב למעסיק (טיוטה להעתקה)</summary><pre class="${P}-pre">${esc(letter(reg, g, opts.today))}</pre></details>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
		+ `</div><div class="${P}-print">${printSummary(reg, g, opts.printedOn || opts.today || lg.checked_on)}</div>`;
}

/** Page section: what goes into a final settlement, with the law, the due day and the limitation of each item. */
export function itemsTable(reg) {
	const sv = reg.severance;
	const lc = reg.labor_chufsha;
	const lg = reg.labor_gmar;
	const rows = [
		['שכר החודש האחרון', `${lc.wage.due_section} (${lg.wage.hourly_section} לשכר לפי שעה) לחוק הגנת השכר`, 'עם תום החודש; מולן מהיום התשיעי שאחריו', `${sv.limitation.years} שנים`],
		['הודעה מוקדמת: תשלום במקום עבודה או פיצוי', 'סעיפים 6 ו-7 לחוק הודעה מוקדמת', 'בגמר החשבון', `${sv.limitation.years} שנים`],
		['פיצויי פיטורים', 'סעיפים 1, 12 ו-14 לחוק פיצויי פיטורים', `ביום סיום העבודה; מולנים אחרי ${sv.late.grace_days} ימים (${sv.late.section} לחוק הגנת השכר)`, `${sv.limitation.years} שנים`],
		['פדיון חופשה שנתית', `${lc.law.sections.redeem} לחוק חופשה שנתית`, 'עם שכר החודש האחרון', `3 שנים (${lc.law.sections.limitation})`],
		['דמי הבראה', 'צו ההרחבה, סעיף 5', 'בסיום, על החלק היחסי של השנה', `${sv.limitation.years} שנים`],
		['ימי מחלה', `${lg.sick.absence_section} לחוק דמי מחלה`, 'לא נפדים בסיום לפי החוק', '-'],
		['אישור על תקופת העבודה', 'סעיף 8 לחוק הודעה מוקדמת', `תוך ${sv.notice.cert_days} ימים (${sv.notice.cert_request_days} מבקשה בכתב)`, '-'],
		['טופס 161', 'רשות המסים', 'במועד הפרישה', '-'],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מה נכנס לגמר חשבון, לפי איזה חוק, מתי משלמים ומתי מתיישנת התביעה (נבדק ${isoToHe(lg.checked_on)})</caption><thead><tr><th scope="col">רכיב</th><th scope="col">החוק</th><th scope="col">מתי משלמים</th><th scope="col">התיישנות</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="רכיב">${esc(x[0])}</td><td data-th="החוק">${esc(x[1])}</td><td data-th="מתי משלמים">${esc(x[2])}</td><td data-th="התיישנות">${esc(x[3])}</td></tr>`).join('')
		+ '</tbody></table></div>';
}

/** The result-first card at the top of the page ([justice_tool_lead]). Same markup on the server and in the browser. */
export function leadCard(reg, g, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הנתונים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!g.ok) {
		return `<p class="jtool-lead__label">גמר חשבון</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(g.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}${GM_REASON_HE[g.reason]}, ${g.payType === 'hourly' ? 'שעתי' : 'חודשי'}, ${gmSpan(g.r.span)} ותק`;
	const line = `המעסיק משלם בגמר החשבון${g.fund > 0 ? `; מהקופה עוד ${gmNis(g.fund)}, סך הכול ${gmNis(g.total)}` : ''}. מועד התשלום ${isoToHe(g.dueSalary)}; ימי מחלה לא נפדים.`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${gmIls(g.employerNow)}</strong><span class="jtool-lead__unit">מהמעסיק · עד ${isoToHe(g.dueSalary)}</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const g = gmCompute(reg, EXAMPLE);
	const sv = reg.severance;
	const lc = reg.labor_chufsha;
	const lg = reg.labor_gmar;
	const ln = (c) => g.lines.find((x) => x.code === c);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: g.employerNow,
		sticky: gmIls(g.employerNow),
		lead: leadCard(reg, g, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, g, { example: true }),
		details: renderDetails(reg, g, { today: EXAMPLE.asOf, printedOn: EXAMPLE.asOf }),
		method: `<ol><li>שכר החודש האחרון: ${gmNis(ln('salary').amount)}, משולם עם תום החודש${gmCite(`${lc.wage.due_section} לחוק הגנת השכר`, lc.wage.url)}</li>`
			+ `<li>פיצויים: ${gmNis(g.r.base)} × ${g.r.span.years.toFixed(2)} שנים = ${gmNis(g.r.severance)}; הקופה מכסה ${g.r.s14Pct}% (${gmNis(g.r.fundReplaces)}), המעסיק משלים ${gmNis(g.r.employer)}${gmCite('סעיף 14', sv.approval.url)}</li>`
			+ `<li>פדיון חופשה: ${g.vac.days} ימים × ${money(g.vac.dayValue, 2)} ₪ = ${gmNis(g.vac.value)}${gmCite(`${lc.law.sections.redeem} לחוק חופשה שנתית`, lc.law.url)}</li>`
			+ `<li>דמי הבראה על החלק של השנה האחרונה: ${gmNis(ln('havraa').amount)}${gmCite('צו ההרחבה', reg.havraa.order_url)}</li>`
			+ `<li>ימי מחלה לא נפדים${gmCite(`${lg.sick.absence_section} לחוק דמי מחלה`, lg.sick.url)}; סך הכול מהמעסיק ${gmNis(g.employerNow)}, ומהקופה ${gmNis(g.fund)}</li></ol>`,
		compare_table: itemsTable(reg),
		sentence: verdictSentence(reg, g),
	};
}

/* ---------------- Share state ---------------- */

const GM_RS = { fired: 'f', resign: 'r', health: 'h', parent: 'p', move: 'm', term: 't', worse: 'w', retire: 'x' };
const GM_RS_OF = Object.fromEntries(Object.entries(GM_RS).map(([k, v]) => [v, k]));
export const KEYS = ['t', 'w', 'h', 'o', 'j', 'k', 's', 'e', 'r', 'g', 'f', 'n', 'm', 'v', 'u', 'b', 'p', 'a', 'd', 'l', 'q'];
export function stateOf(i) {
	return encodeState({
		t: i.payType === 'hourly' ? 'h' : 'm', w: i.payType === 'hourly' ? '' : i.salary, h: i.payType === 'hourly' ? i.hourly : '', o: i.payType === 'hourly' ? i.hours : '',
		j: Number(i.jobPct) === 100 ? '' : i.jobPct, k: Number(i.week) === 6 ? 6 : 5, s: i.start || '', e: i.end || '', r: GM_RS[i.reason] || 'f', g: i.groundOk ? 1 : '',
		f: { none: 'n', partial: 'p', full: 'f' }[i.s14] || 'n', n: i.noticeMode === 'none' ? '' : i.noticeDate, m: { worked: 'w', paid: 'p', none: 'n' }[i.noticeMode] || 'w',
		v: i.vacMode === 'balance' ? 'b' : 'c', u: i.vacMode === 'balance' ? '' : i.vacUsed, b: i.vacMode === 'balance' ? i.vacBalance : '',
		p: { years: 'y', none: 'n', amount: 'a' }[i.hvPaid] || 'y', a: i.hvPaid === 'amount' ? i.hvAmount : '', d: i.lastDays, l: i.payType === 'hourly' ? i.lastHours : '', q: i.fundBal,
	});
}
export function inputOf(s) {
	if (!s || !s.s || !s.e) { return null; }
	const n = (v) => (v === undefined || v === '' ? '' : Number(v));
	return Object.assign({}, GM_DEFAULT, {
		payType: s.t === 'h' ? 'hourly' : 'monthly', salary: n(s.w), hourly: n(s.h), hours: n(s.o), jobPct: s.j ? Number(s.j) : 100, week: Number(s.k) === 6 ? 6 : 5,
		start: s.s, end: s.e, reason: GM_RS_OF[s.r] || 'fired', groundOk: s.g === '1', s14: { n: 'none', p: 'partial', f: 'full' }[s.f] || 'none',
		noticeDate: s.n || '', noticeMode: { w: 'worked', p: 'paid', n: 'none' }[s.m] || 'worked', vacMode: s.v === 'b' ? 'balance' : 'compute',
		vacUsed: n(s.u), vacBalance: n(s.b), hvPaid: { y: 'years', n: 'none', a: 'amount' }[s.p] || 'years', hvAmount: n(s.a),
		lastDays: n(s.d), lastHours: n(s.l), fundBal: n(s.q),
	});
}

/* ---------------- Browser ---------------- */

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const amt = (id) => { const v = String(val(id)).replace(/[,\s₪%]/g, ''); return v === '' ? '' : Number(v); };
	const gok = root.querySelector(`#${P}-gok`);
	return Object.assign({}, GM_DEFAULT, {
		payType: pick('pay', 'monthly'), salary: amt('sal'), jobPct: amt('pct') === '' ? 100 : amt('pct'), hourly: amt('hr'), hours: amt('hrs'), week: Number(pick('week', '5')),
		start: gmIso(val('start')), end: gmIso(val('end')), reason: val('why') || 'fired', groundOk: Boolean(gok && gok.checked),
		s14: pick('s14', 'none'), noticeMode: pick('nm', 'worked'), noticeDate: gmIso(val('nd')), vacMode: pick('vm', 'compute'), vacUsed: amt('vu'), vacBalance: amt('vb'),
		hvPaid: pick('hp', 'years'), hvAmount: amt('ha'), lastDays: amt('ld'), lastHours: amt('lh'), fundBal: amt('fb'), asOf: today,
	});
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const lg = reg.labor_gmar;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(lg.checked_on, lg.refresh_every_days) || (lg.next_update && today >= lg.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהחוק התעדכן'); }
	}
	const ids = { start: 'start', end: 'end', salary: 'sal', jobPct: 'pct', hourly: 'hr', hours: 'hrs', noticeDate: 'nd', vacBalance: 'vb', vacUsed: 'vu', used: 'vu', balance: 'vb', hvAmount: 'ha', lastDays: 'ld', lastHours: 'lh', fundBal: 'fb', reason: 'why', paid: 'ha' };
	const showErrors = (g) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (g.ok) { return; }
		for (const e of g.errors) {
			const id = ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = (input) => {
		form.querySelectorAll('[data-if-pay]').forEach((el) => { el.hidden = el.getAttribute('data-if-pay') !== input.payType; });
		form.querySelectorAll('[data-if-vac]').forEach((el) => { el.hidden = el.getAttribute('data-if-vac') !== input.vacMode; });
		form.querySelectorAll('[data-if-notice]').forEach((el) => { el.hidden = input.noticeMode === 'none'; });
		form.querySelectorAll('[data-if-hv]').forEach((el) => { el.hidden = input.hvPaid !== 'amount'; });
		form.querySelectorAll('[data-if-ground]').forEach((el) => { el.hidden = !(RESIGN_CODES.includes(input.reason) && input.reason !== 'term'); });
		const key = Object.keys(PRESETS).find((k) => gmSame(PRESETS[k].input, input)) || '';
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const g = gmCompute(reg, input);
		showErrors(g);
		result.innerHTML = renderResult(reg, g);
		details.innerHTML = renderDetails(reg, g, { today, printedOn: today });
		if (sticky) { sticky.innerHTML = g.ok ? gmIls(g.employerNow) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, g, { example: !own }); }
		if (g.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: gmBand(g) }); }
		return g;
	};
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = readForm(root, today); sync(input); run(input); }, 160);
	};
	// A share link names its tool (/@gmar-cheshbon); on a page with several tools only this tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (fromHash) {
		own = true;
		const input = Object.assign({}, fromHash, { asOf: today });
		form.innerHTML = renderForm(reg, input);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync(input);
		run(input, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector(`.${P}-preset`);
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
			const p = PRESETS[b.getAttribute('data-preset')];
			if (!p) { return; }
			own = true;
			const input = Object.assign({}, p.input, { asOf: today });
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		const input = own ? readForm(root, today) : Object.assign({}, EXAMPLE);
		const g = own ? run(input, { silent: true }) : gmCompute(reg, input);
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && g.ok) {
			download('gmar-cheshbon.ics', 'text/calendar;charset=utf-8', ics(g.events.map((e) => ({ date: e.date, summary: `גמר חשבון: ${e.he}`, description: `${e.section}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'copy-doc' && g.ok) {
			const ok = await copyText(letter(reg, g, today));
			toast(root, ok ? 'המכתב הועתק. השלימו את השמות במקומות המסומנים בסוגריים.' : 'לא הצלחנו להעתיק.');
			track('tool_download', { tool_id: TOOL_ID, type: 'letter' });
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && g.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, g)} · חושב ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && g.ok) {
			const ok = await copyText(`${verdictSentence(reg, g)} (חושב ב-jus-tice.co.il, ${isoToHe(lg.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			const purpose = b.getAttribute('data-purpose') === 'court_rehearsal' ? 'court_rehearsal' : 'mediation';
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: purpose });
			const brief = g.ok ? aiBrief(reg, g, purpose) : '';
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
			if (s) { own = true; const input2 = Object.assign({}, s, { asOf: today }); form.innerHTML = renderForm(reg, input2); sync(input2); run(input2); }
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
