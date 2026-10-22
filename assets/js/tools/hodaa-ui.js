/**
 * The labor wave UI (22.10.2026): the advance notice in both directions (hodaa-mukdemet, prefix jt46) on
 * /notice-of-dismissal/. The picture is the notice itself laid on the calendar: a ribbon of days from the day the notice
 * is handed over to the last day, each counted day numbered, the days the law keeps out of a dismissal notice (reserve
 * duty, the birth-and-parenting leave and the days after it) hatched as paused, the days that were not worked but are paid
 * marked, and the last day ruled. The ribbon has a one-sentence text equivalent. Under it: the law's table with the
 * reader's row, the dates the law sets (.ics), the vacation rule, who must not be dismissed now, what changed and when, the
 * scenario for the simulation (the dismissal hearing) and the next steps; a one-page summary prints on its own.
 */
import { hdCompute, hdBand, hdNoticeDays, HD_GATES } from './hodaa-engine.js';
import { addDays, addMonths, parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'hodaa-mukdemet';
const P = 'jt46';
const HD_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=employment';
const HD_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const HD_DOW = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];

/** One click to a full profile: the common situations, each relative to the notice date in the form. */
export const PRESETS = {
	m8: { he: 'פיטורים · חודשי · 8 חודשים', dir: 'fire', payType: 'monthly', back: 8, salary: 9000, mode: 'worked' },
	y3: { he: 'התפטרות · חודשי · 3 שנים', dir: 'resign', payType: 'monthly', back: 36, salary: 12000, mode: 'worked' },
	h18: { he: 'פיטורים · שעתי · שנה וחצי', dir: 'fire', payType: 'hourly', back: 18, hourly: 40, hours: 160, mode: 'worked' },
	h8: { he: 'התפטרות · שעתי · 8 חודשים', dir: 'resign', payType: 'hourly', back: 8, hourly: 35, hours: 120, mode: 'worked' },
	none5: { he: 'פיטורים בלי הודעה · 5 שנים', dir: 'fire', payType: 'monthly', back: 60, salary: 11000, mode: 'none' },
};
const HD_BLANK = { salary: '', hourly: '', hours: '', lastDay: '', contractDays: '', vacation: '', pauseKind: '', pauseFrom: '', pauseTo: '', gates: [] };
/** A preset applied on a notice date: exactly that many full months of work up to and including the notice day. */
export function hdPreset(key, noticeDate) {
	const p = PRESETS[key];
	if (!p) { return null; }
	return Object.assign({}, HD_BLANK, { dir: p.dir, payType: p.payType, salary: p.salary ?? '', hourly: p.hourly ?? '', hours: p.hours ?? '', mode: p.mode, noticeDate, start: addDays(addMonths(noticeDate, -p.back), 1) });
}
export const EXAMPLE = hdPreset('m8', '2026-10-22');

const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const daysHe = (n) => (n === 1 ? 'יום אחד' : `${n} ימים`);
const hdMon = (n) => (n === 1 ? 'חודש אחד' : `${n} חודשים`);
const tenureHe = (s) => `${s.months >= 12 ? `${s.y === 1 ? 'שנה' : `${s.y} שנים`}${s.m ? ` ו-${hdMon(s.m)}` : ''}` : hdMon(s.months)}${s.days ? ` ו-${s.days === 1 ? 'יום אחד' : `${s.days} ימים`}` : ''}`;
const lengthHe = (r) => (r.useContract ? `${r.contractDays} ימים` : r.stat.month ? 'חודש' : daysHe(r.stat.days));
const dirHe = (r) => (r.dir === 'fire' ? 'לפיטורים' : 'להתפטרות');
const hdIso = (text) => { const raw = String(text || '').trim(); return raw ? (parseDate(raw) || raw) : ''; };

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, HD_BLANK, input || {});
	const preset = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return p.dir === i.dir && p.payType === i.payType && p.mode === i.mode && /^\d{4}-\d{2}-\d{2}$/.test(i.noticeDate || '') && i.start === addDays(addMonths(i.noticeDate, -p.back), 1) && String(p.salary ?? '') === String(i.salary ?? '') && String(p.hourly ?? '') === String(i.hourly ?? ''); }) || '';
	const date = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 1.2.2026" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const num = (id, label, v, ph, hint, suffix) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label>${suffix ? '<div class="jtool-input jtool-input--money">' : ''}<input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v === '' || v === undefined || v === null ? '' : v)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${suffix ? `<span class="jtool-input__suffix" aria-hidden="true">${suffix}</span></div>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const gates = Array.isArray(i.gates) ? i.gates : [];
	const gateLabels = { pregnant: 'היריון', leave: 'בתקופת לידה והורות', after_leave: 'עד 60 ימים אחרי חופשת הלידה', unpaid_after: 'חופשה ללא תשלום או הנקה אחרי הלידה', fertility: 'טיפולי פוריות', shelter: 'שהייה במקלט לנשים מוכות', miscarriage: 'היעדרות אחרי הפלה', reserve: 'עכשיו בשירות מילואים', reserve_after: 'עד 30 ימים אחרי מילואים', partner: 'בן/בת הזוג במילואים, ויש ילד' };
	const special = Boolean(i.contractDays || i.vacation || i.pauseKind || gates.length);
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא את כל השדות לפי יום ההודעה שבטופס; אפשר לשנות כל שדה.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>מי נותן את ההודעה</legend><div class="jtool-chips">${chip('dir', 'fire', 'פיטורים: המעסיק מודיע', i.dir !== 'resign')}${chip('dir', 'resign', 'התפטרות: העובד מודיע', i.dir === 'resign')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>איך משולם השכר</legend><div class="jtool-chips">${chip('pay', 'monthly', 'משכורת חודשית', i.payType !== 'hourly')}${chip('pay', 'hourly', 'לפי שעה או יום', i.payType === 'hourly')}</div><p class="jtool-hint">החוק מבחין בין עובד במשכורת לעובד בשכר (סעיף 1).</p></fieldset>`
		+ `<div class="jtool-row">${date('start', 'יום תחילת העבודה', i.start, '')}${date('nd', 'יום מסירת ההודעה', i.noticeDate, 'ההודעה ניתנת בכתב; היום הזה לא נספר')}</div>`
		+ `<div class="jtool-row" data-if-pay="monthly"${i.payType === 'hourly' ? ' hidden' : ''}>${num('sal', 'משכורת חודשית רגילה (ברוטו)', i.salary === '' ? '' : money(i.salary, 0), 'לא חובה', 'לחישוב השכר בעד תקופת ההודעה', '₪')}</div>`
		+ `<div class="jtool-row" data-if-pay="hourly"${i.payType === 'hourly' ? '' : ' hidden'}>${num('hr', 'שכר לשעה', i.hourly, 'לא חובה', '', '₪')}${num('hrs', 'ממוצע שעות בחודש', i.hours, 'לדוגמה: 160', 'לפי התלושים האחרונים')}</div>`
		+ `<fieldset class="jtool-field"><legend>מה קרה בפועל בתקופת ההודעה</legend><div class="jtool-chips">${chip('mode', 'worked', 'עובדים עד היום האחרון', i.mode === 'worked' || !i.mode)}${chip('mode', 'waived', 'המעסיק ויתר על העבודה ומשלם', i.mode === 'waived')}${chip('mode', 'none', 'העבודה נגמרה בלי הודעה', i.mode === 'none')}${chip('mode', 'short', 'העבודה נגמרה לפני הסוף', i.mode === 'short')}</div></fieldset>`
		+ `<div class="jtool-row" data-if-short${i.mode === 'short' ? '' : ' hidden'}>${date('last', 'היום האחרון שבו עבדתם בפועל', i.lastDay, '')}</div>`
		+ `<details class="jtool-more ${P}-special"${special ? ' open' : ''}><summary>מצבים מיוחדים: חוזה, חופשה, מילואים, היריון</summary>`
		+ `<div class="jtool-row">${num('con', 'ימי הודעה לפי החוזה או ההסכם הקיבוצי', i.contractDays, 'ריק = לפי החוק', 'בפיטורים, אם ארוכה מהחוק (סעיף 12); בהתפטרות החוזה לא מאריך')}${num('vac', 'ימי חופשה שתוכננו בתוך ההודעה', i.vacation, '0', 'בפיטורים נבדק מול כלל 14 הימים')}</div>`
		+ `<div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-pk">תקופה שלא נספרת בהודעת פיטורים</label><select id="${P}-pk" aria-describedby="${P}-pause-e">`
		+ [['', 'אין'], ['reserve', 'שירות מילואים בתוך ההודעה'], ['partner', 'שירות מילואים של בן/בת הזוג (הוראת שעה)'], ['leave', 'תקופת לידה והורות'], ['shelter', 'שהייה במקלט לנשים מוכות'], ['miscarriage', 'היעדרות אחרי הפלה']].map(([v, l]) => `<option value="${v}"${i.pauseKind === v ? ' selected' : ''}>${esc(l)}</option>`).join('')
		+ `</select><p class="jtool-error" id="${P}-pause-e" role="alert"></p></div>${date('pf', 'מתאריך', i.pauseFrom, '')}${date('pt', 'עד תאריך', i.pauseTo, '')}</div>`
		+ `<fieldset class="jtool-field"><legend>מה נכון עכשיו (נבדק מול ההגנות מפיטורים)</legend><div class="jtool-chips ${P}-gates">${HD_GATES.map((g) => chip('g', g, gateLabels[g], gates.includes(g), 'checkbox')).join('')}</div></fieldset></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const who = r.dir === 'fire' ? 'המעסיק נותן לעובד' : 'העובד נותן למעסיק';
	const why = r.useContract ? `לפי החוזה (${r.contractDays} ימים, יותר מהחוק)` : `לפי ${r.stat.section} לחוק הודעה מוקדמת${r.dir === 'resign' ? ' (ובהתפטרות: סעיף 5)' : ''}`;
	const pay = r.periodPay !== null ? ` השכר הרגיל בעד התקופה: ${nis(r.periodPay)}.` : '';
	const owed = r.owed !== null && r.owedBy ? ` ${r.owedBy === 'employer' ? 'המעסיק משלם לעובד' : 'העובד חייב למעסיק'} ${nis(r.owed)} (${r.paySection}).` : '';
	const pause = r.paused ? ` ${r.paused} ימים לא נספרו, ולכן ההודעה מסתיימת מאוחר יותר.` : '';
	return `עבדתם ${tenureHe(r.span)} עד יום ההודעה. ${why}, ${who} הודעה של ${lengthHe(r)}: מ-${isoToHe(r.noticeDate)} עד ${isoToHe(r.end)}, היום האחרון.${pause}${pay}${owed}`;
}

/** The calendar ribbon: the notice day, every day of the notice, the paused and the missing days, the last day. */
export function ribbon(reg, r) {
	if (!r.ok) { return ''; }
	const cells = [];
	const label = { counted: 'נספר', pause: 'לא נספר', missing: 'לא עבדו, משולם', waived: 'ויתור, משולם' };
	cells.push(`<li class="${P}-d ${P}-d--notice"><span class="${P}-d__m">${HD_MONTHS[Number(r.noticeDate.slice(5, 7)) - 1]}</span><b>${Number(r.noticeDate.slice(8))}</b><small>ההודעה</small></li>`);
	let n = 0;
	for (let i = 0; i < r.ribbon.length; i += 1) {
		const c = r.ribbon[i];
		let j = i;
		if (c.kind === 'pause') { while (j + 1 < r.ribbon.length && r.ribbon[j + 1].kind === 'pause') { j += 1; } }
		const run = j - i + 1;
		if (c.kind === 'pause' && run > 7) {
			cells.push(`<li class="${P}-d ${P}-d--pause ${P}-d--run"><b>${run}</b><small>ימים לא נספרים: ${isoToHe(c.date)} עד ${isoToHe(r.ribbon[j].date)}</small></li>`);
			i = j;
			continue;
		}
		if (c.kind !== 'pause') { n += 1; }
		const d = Number(c.date.slice(8));
		const last = c.date === r.end;
		const dow = HD_DOW[new Date(`${c.date}T00:00:00Z`).getUTCDay()];
		cells.push(`<li class="${P}-d ${P}-d--${c.kind}${last ? ` ${P}-d--last` : ''}" title="${esc(`${isoToHe(c.date)}, יום ${dow}: ${label[c.kind]}`)}">${d === 1 ? `<span class="${P}-d__m">${HD_MONTHS[Number(c.date.slice(5, 7)) - 1]}</span>` : ''}<b>${d}</b><small>${c.kind === 'pause' ? 'עצירה' : last ? 'אחרון' : n}</small></li>`);
	}
	const parts = [`${r.counted} ימים נספרים מ-${isoToHe(r.noticeDate)} (יום ההודעה לא נספר) עד ${isoToHe(r.end)}`];
	if (r.paused) { parts.push(`${r.paused} ימים לא נספרים (${r.win.section})`); }
	if (r.missing.days) { parts.push(`${r.missing.days} ימים אחרי ${isoToHe(r.endWork)} לא עבדו ומשולמים`); }
	if (r.mode === 'waived') { parts.push('המעסיק ויתר על העבודה, והימים משולמים'); }
	const sum = `${parts.join('; ')}.`;
	const keys = [['counted', r.mode === 'waived' ? 'ויתור: לא עובדים, מקבלים שכר' : 'יום הודעה שנספר'], ['pause', 'לא נספר (תקופה מוגנת)'], ['missing', 'לא עבדו: משולם לפי סעיף 7']]
		.filter(([k]) => (k === 'counted') || r.ribbon.some((c) => c.kind === k)).map(([k, t]) => `<span><i class="${P}-k ${P}-k--${k === 'counted' && r.mode === 'waived' ? 'waived' : k}" aria-hidden="true"></i>${esc(t)}</span>`).join('');
	return `<figure class="${P}-ribbon"><figcaption class="${P}-ribbon__h">ההודעה על לוח השנה: ${esc(lengthHe(r))}${r.paused ? `, ועוד ${r.paused} ימים עצורים` : ''}</figcaption>`
		+ `<p class="jtool-visually-hidden">${esc(sum)}</p><ol class="${P}-days" aria-hidden="true">${cells.join('')}</ol>`
		+ `<p class="${P}-keys">${keys}</p></figure>`;
}

/** The scenario for the simulation: computed facts only, never a name, an ID or an address. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const who = r.payType === 'hourly' ? 'עובד לפי שעה' : 'עובד במשכורת חודשית';
	const pay = r.periodPay !== null ? ` השכר הרגיל לתקופת ההודעה: ${nis(r.periodPay)}.` : '';
	const gate = r.gates.length && r.dir === 'fire' ? ` יש נסיבה שמגבילה פיטורים (${r.gates.map((g) => g.section).join(', ')}).` : '';
	if (r.dir === 'fire') {
		return `${who} עם ותק של ${tenureHe(r.span)} מקבל הודעה מוקדמת לפיטורים ב-${isoToHe(r.noticeDate)}. לפי ${r.stat.section} לחוק הודעה מוקדמת ההודעה היא ${lengthHe(r)}, עד ${isoToHe(r.end)}.${pay}${gate} השאלה לתרגול: השימוע לפני הפיטורים. איך מציגים את הטענות, מבקשים את הנימוקים והמסמכים מראש, ומוודאים שההודעה, השכר והאישור על סיום העבודה יינתנו כחוק?`;
	}
	return `${who} עם ותק של ${tenureHe(r.span)} מתפטר ונותן הודעה מוקדמת ב-${isoToHe(r.noticeDate)}. לפי ${r.stat.section} וסעיף 5 לחוק הודעה מוקדמת ההודעה היא ${lengthHe(r)}, עד ${isoToHe(r.end)}.${pay} השאלה לתרגול: השיחה עם המעסיק על סיום העבודה. איך מבקשים לקצר את ההודעה או לקבל במקומה תשלום, ואיך מסכמים בכתב את התשלומים והאישור על סיום העבודה?`;
}

/** The "what to do now" list: the official route first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const lh = reg.labor_hodaa;
	const out = [];
	if (r.dir === 'fire') { out.push({ he: `לבקש שימוע לפני ההחלטה, עם הנימוקים והמסמכים מראש: ${lh.hearing.rights_he}`, url: lh.hearing.url }); }
	if (r.gates.some((g) => g.url === lh.women.permit_url) && r.dir === 'fire') { out.push({ he: `פיטורים בתקופה מוגנת לפי חוק עבודת נשים: רק בהיתר. ${lh.women.permit_he}`, url: lh.women.permit_url }); }
	if (r.gates.some((g) => g.url === lh.reserve.url) && r.dir === 'fire') { out.push({ he: `פיטורים בזמן מילואים ואחריהם: רק בהיתר מ${lh.reserve.committee_he} (${lh.reserve.during_section})`, url: lh.reserve.url }); }
	out.push({ he: `לבקש בכתב את האישור על תחילת העבודה וסיומה (${lh.law.sections.cert}): המעסיק נותן אותו בתוך ${reg.severance.notice.cert_request_days} ימים מהבקשה`, url: lh.law.url });
	if (r.severanceDue || r.dir === 'resign') { out.push({ he: `${lh.form_161.he}: ${lh.form_161.from_he}`, url: lh.form_161.url }); }
	out.push({ he: 'המדריך של משרד העבודה להודעה מוקדמת', url: lh.guide.url });
	const links = [];
	if (r.dir === 'fire') { links.push({ path: '/severance-pay-calculator/', he: 'כמה פיצויי פיטורים מגיעים, ומה הקופה מכסה' }); links.push({ path: '/hearing-before-dismissal/', he: 'שימוע לפני פיטורים: איך מתכוננים' }); }
	if (r.dir === 'resign') { links.push({ path: '/resignation-deemed-dismissal/', he: 'מתי התפטרות נחשבת לפיטורים ומזכה בפיצויים' }); }
	if (r.gates.some((g) => ['pregnant', 'leave', 'after_leave', 'unpaid_after', 'fertility'].includes(g.code))) { links.push({ path: '/pregnancy-dismissal-permit/', he: 'היתר לפיטורים בהיריון: מה בודקים' }); }
	if (r.gates.some((g) => ['reserve', 'reserve_after', 'partner'].includes(g.code))) { links.push({ path: '/miluim-dismissal-protection/', he: 'הגנה מפיטורים במילואים ואחריהם' }); }
	links.push({ path: '/gmar-cheshbon/', he: 'גמר חשבון: מה עוד משלמים בסיום העבודה' });
	if (r.dir === 'fire') { links.push({ path: '/unemployment-benefits-eligibility/', he: 'דמי אבטלה אחרי הפיטורים' }); }
	return { official: out, links: links.slice(0, 4) };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const lh = reg.labor_hodaa;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	const state = r.blocked ? `<p class="jtool-state jtool-state--danger">! ייתכן שאסור לפטר עכשיו בלי היתר: בדקו את ההגנות למטה</p>` : `<p class="jtool-state jtool-state--ok">✓ לפי חוק הודעה מוקדמת, ${esc(r.useContract ? lh.law.sections.rights : r.stat.section)}</p>`;
	const fig = r.useContract ? `<bdi>${r.contractDays}</bdi> ימים` : r.stat.month ? 'חודש' : `<bdi>${String(r.stat.days)}</bdi> ${r.stat.days === 1 ? 'יום' : 'ימים'}`;
	const rows = [`<div><dt>היום האחרון</dt><dd><bdi>${isoToHe(r.end)}</bdi></dd></div>`, `<div><dt>ותק ביום ההודעה</dt><dd>${esc(tenureHe(r.span))}</dd></div>`];
	if (r.periodPay !== null) { rows.push(`<div><dt>השכר הרגיל בעד התקופה</dt><dd>${ils(r.periodPay)}</dd></div>`); }
	if (r.owed !== null && r.owedBy) { rows.push(`<div><dt>${r.owedBy === 'employer' ? 'המעסיק משלם לעובד' : 'העובד חייב למעסיק'}</dt><dd>${ils(r.owed)}</dd></div>`); }
	if (r.endWork < r.end) { rows.push(`<div><dt>העבודה הסתיימה בפועל</dt><dd><bdi>${isoToHe(r.endWork)}</bdi></dd></div>`); }
	const flags = r.gates.concat(r.flags);
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}הודעה מוקדמת ${dirHe(r)}, ${r.payType === 'hourly' ? 'עובד לפי שעה או יום' : 'עובד במשכורת חודשית'}</p>`
		+ `<strong class="jtool-verdict__figure">${fig}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ ribbon(reg, r)
		+ (flags.length ? `<ul class="jtool-flags ${P}-flags">${flags.map((f) => `<li class="${P}-flag ${P}-flag--${f.level}">${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${HD_SIM}" target="_blank" rel="noopener" data-act="rehearse">${r.dir === 'fire' ? 'לתרגל את השימוע עם הנתונים שלכם' : 'לתרגל את השיחה עם המעסיק'}</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** The law's table with the reader's row marked: both pay types, the tiers from reg.severance.notice. */
export function tiersTable(reg, r) {
	const n = reg.severance.notice;
	const lh = reg.labor_hodaa;
	const rows = [
		['monthly', 'סעיף 3(1)', `חודשים 1 עד ${n.monthly.first_months}`, 'יום אחד לכל חודש עבודה'],
		['monthly', 'סעיף 3(2)', `מהחודש ה-${n.monthly.first_months + 1} עד תום השנה`, `${n.monthly.base_days} ימים, ועוד ${n.monthly.per_month} ימים לכל חודש מהחודש ה-${n.monthly.first_months + 1}`],
		['monthly', 'סעיף 3(3)', 'אחרי שנה', 'חודש'],
		['hourly', 'סעיף 4(1)', 'השנה הראשונה', 'יום אחד לכל חודש עבודה'],
		['hourly', 'סעיף 4(2)', 'השנה השנייה', `${n.wage.y2_base} ימים, ועוד יום לכל שני חודשים בשנה הזאת`],
		['hourly', 'סעיף 4(3)', 'השנה השלישית', `${n.wage.y3_base} ימים, ועוד יום לכל שני חודשים בשנה הזאת`],
		['hourly', 'סעיף 4(4)', 'אחרי שלוש שנים', 'חודש'],
	];
	const mine = (row) => r && r.ok && row[0] === r.payType && row[1] === r.stat.section;
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-law-h" tabindex="0"><table class="jtool-table ${P}-tiers"><thead><tr><th scope="col">סוג העובד</th><th scope="col">ותק ביום ההודעה</th><th scope="col">ימי הודעה</th><th scope="col">סעיף</th></tr></thead><tbody>`
		+ rows.map((row) => `<tr${mine(row) ? ` class="${P}-mine"` : ''}><td data-th="סוג העובד">${row[0] === 'monthly' ? 'משכורת חודשית' : 'לפי שעה או יום'}${mine(row) ? ' <strong>(אתם)</strong>' : ''}</td><td data-th="ותק ביום ההודעה">${esc(row[2])}</td><td data-th="ימי הודעה">${esc(row[3])}</td><td data-th="סעיף">${cite(row[1], lh.law.url)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(lh.law.he)}, נוסח עדכני ל-${isoToHe(lh.law.current_to)}. ${esc(lh.law.resign_he)} (${esc(lh.law.sections.resign)}).</caption></table></div>`;
}

/** What changed and when: only values an official text dates. */
export function changesTable(reg) {
	const lh = reg.labor_hodaa;
	const n = reg.severance.notice;
	const rows = [
		{ when: '2001', what: `חוק הודעה מוקדמת נכנס לתוקף (ה-1 בחודש שאחרי פרסומו): ${n.monthly.base_days} ימים ועוד ${n.monthly.per_month} לחודש בשנה הראשונה למשכורת חודשית, ${n.wage.y2_base} ו-${n.wage.y3_base} ימים בשנים השנייה והשלישית לעובד בשכר, וחודש אחרי זה`, src: `${lh.law.sections.start}; הנוסח העדכני ל-${isoToHe(lh.law.current_to)} באותן מדרגות`, url: lh.law.url },
		{ when: '2001', what: `הקנס על מעסיק שלא נתן אישור על תקופת העבודה בתוך ${n.cert_days} ימים (${n.cert_request_days} מבקשה בכתב) חל שישה חודשים אחרי תחילת החוק`, src: `${lh.law.sections.cert_late} ו${lh.law.sections.start}`, url: lh.law.url },
		{ when: isoToHe(lh.form_161.from), what: lh.form_161.from_he, src: 'רשות המסים', url: lh.form_161.url },
		{ when: isoToHe(lh.women.unpaid_2026.from), what: lh.women.unpaid_2026.he, src: `${lh.women.unpaid_2026.section} לחוק עבודת נשים`, url: lh.women.url },
		{ when: isoToHe(lh.reserve.partner_from), what: `${lh.reserve.partner_he.split(':')[0]}: אסור לפטר בתקופת השירות ו-${lh.reserve.partner_after_days} ימים אחריה בלי היתר (${lh.reserve.partner_temp_he})`, src: `${lh.reserve.partner_section} לחוק החיילים המשוחררים`, url: lh.reserve.partner_temp_url },
	];
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתי"><bdi>${esc(x.when)}</bdi></td><td data-th="מה השתנה">${esc(x.what)}</td><td data-th="מקור">${cite(x.src, x.url)}</td></tr>`).join('')
		+ '</tbody><caption>רק ערכים שפורסמו בנוסח רשמי, עם התאריך שלהם.</caption></table></div>';
}

function datesTable(reg, r, opts = {}) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = opts.today && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.he)}</td><td data-th="הכלל">${cite(e.section, e.url)}</td></tr>`; }).join('')
		+ '</tbody><caption>רק מועדים שחוק קובע. מועד שנופל ביום מנוחה עובר ליום שאחריו (חוק הפרשנות, סעיף 10(ג)).</caption></table></div>';
}

function methodList(reg, r) {
	const lh = reg.labor_hodaa;
	const n = reg.severance.notice;
	const items = [];
	const k = r.stat.n;
	items.push(`ותק ביום ההודעה: מ-${isoToHe(r.start)} עד ${isoToHe(r.noticeDate)} = ${tenureHe(r.span)}; ההודעה ניתנת בחודש העבודה ה-${k} (חודש שהתחיל נספר, כמו בטבלה של משרד העבודה)`);
	if (r.stat.month) { items.push(`${r.payType === 'hourly' ? 'יותר מ-36 חודשי עבודה' : '12 חודשים מלאים או יותר'}: חודש (${r.stat.section})`); } else if (r.payType === 'monthly') {
		items.push(k <= n.monthly.first_months ? `${k} × יום = ${r.stat.days} ימים (${r.stat.section})` : `${n.monthly.base_days} + ${n.monthly.per_month} × ${k - n.monthly.first_months} = ${r.stat.days} ימים (${r.stat.section})`);
	} else {
		items.push(k <= 12 ? `${k} × יום = ${r.stat.days} ימים (${r.stat.section})` : `${k <= 24 ? n.wage.y2_base : n.wage.y3_base} + ${Math.floor((k - (k <= 24 ? 13 : 25)) / 2)} (יום לכל שני חודשים) = ${r.stat.days} ימים (${r.stat.section})`);
	}
	if (r.dir === 'resign') { items.push(`התפטרות: אותן מדרגות (${lh.law.sections.resign})`); }
	if (r.useContract) { items.push(`החוזה קובע ${r.contractDays} ימים, יותר מ-${r.statCal} שבחוק: לפי החוזה (${lh.law.sections.rights})`); }
	items.push(`הספירה בלוח: יום ההודעה לא נספר; ${r.stat.month && !r.useContract ? 'חודש מסתיים באותו מספר יום בחודש הבא' : `${r.frac ? `חצי יום מעוגל ליום שלם בלוח (${Math.ceil(r.stat.days)} ימים), ובשכר נספר חצי` : 'כל יום קלנדרי נספר'}`}: ${isoToHe(r.end)}${r.paused ? `, אחרי ${r.paused} ימים שלא נספרו (${r.win.section})` : ''}`);
	if (r.periodPay !== null) { items.push(r.fullMonth ? `השכר הרגיל בעד חודש הודעה: משכורת חודש אחת, ${nis(r.periodPay)}` : `השכר הרגיל בעד ${r.counted} ימים: כל יום כחלק מהחודש שלו (משכורת ÷ ימי החודש), סך הכול ${nis(r.periodPay)}${r.payType === 'hourly' ? `; משכורת = ${money(r.hourly, 2)} ₪ × ${money(r.hours, 0)} שעות` : ''}`); }
	if (r.owed !== null && r.owedBy) { items.push(`${r.owedBy === 'employer' ? 'המעסיק משלם' : 'העובד חייב'} ${nis(r.owed)} (${r.paySection})`); }
	if (r.dir === 'fire') { items.push(`חופשה בתוך ההודעה: מתוך ${r.counted} ימים, עד ${r.vacation.allowed} יכולים להיחשב חופשה (${lh.leave.section})`); }
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

/** The one-page print: inputs, result, the computation path, the dates, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const lh = reg.labor_hodaa;
	return `<h3>הודעה מוקדמת ${dirHe(r)}: סיכום</h3>`
		+ `<p><strong>הנתונים:</strong> ${r.dir === 'fire' ? 'פיטורים' : 'התפטרות'}; ${r.payType === 'hourly' ? 'עובד לפי שעה או יום' : 'משכורת חודשית'}; תחילת עבודה ${isoToHe(r.start)}; ההודעה ניתנה ${isoToHe(r.noticeDate)}${r.monthly !== null ? `; שכר ${nis(r.monthly)} לחודש` : ''}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p>${methodList(reg, r)}`
		+ `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.he)}`).join('; ')}.</p>`
		+ (r.gates.length ? `<p><strong>הגנות מפיטורים שסומנו:</strong> ${r.gates.map((g) => esc(g.section)).join('; ')}.</p>` : '')
		+ `<p><strong>מקורות:</strong> ${esc(lh.law.he)}, נוסח ל-${isoToHe(lh.law.current_to)}; ${esc(lh.leave.he)}, נוסח ל-${isoToHe(lh.leave.current_to)}; ${esc(lh.women.he)}, נוסח ל-${isoToHe(lh.women.current_to)}; ${esc(lh.reserve.he)}, נוסח ל-${isoToHe(lh.reserve.current_to)}; ${esc(reg.severance.late.he)}; ${esc(reg.severance.limitation.he)}. נבדק ${isoToHe(lh.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const lh = reg.labor_hodaa;
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חושב, צעד אחר צעד</h3></div>${methodList(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שהחוק קובע</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${datesTable(reg, r, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-law-h">טבלת ההודעה המוקדמת בחוק</h3></div>${tiersTable(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-vac-h">חופשה בתוך ההודעה, ומה עוד נשאר בתוקף</h3></div><ul class="${P}-list">`
		+ `<li>${esc(lh.leave.rule_he)}.${cite(`${lh.leave.section} לחוק חופשה שנתית`, lh.leave.url)}</li>`
		+ `<li>${esc(lh.leave.redeem_he)}.${cite(`${lh.leave.redeem_section} לחוק חופשה שנתית`, lh.leave.url)}</li>`
		+ `<li>${esc(lh.law.written_he)}.${cite(lh.law.sections.written, lh.law.url)}</li>`
		+ `<li>${esc(lh.law.waive_he)}.${cite(`${lh.law.sections.waive_fire}, ${lh.law.sections.waive_resign}`, lh.law.url)}</li>`
		+ `<li>${esc(lh.law.exceptions_he)}.${cite(lh.law.sections.exceptions, lh.law.url)}</li>`
		+ `<li>${esc(lh.law.rights_he)}.${cite(lh.law.sections.rights, lh.law.url)}</li></ul></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-g-h">מי מוגן מפיטורים עכשיו</h3></div><ul class="${P}-list">`
		+ `<li>${esc(reg.rights_leida.protect.pregnancy_he)}.${cite(reg.rights_leida.protect.pregnancy_section, lh.women.url)}</li>`
		+ lh.women.gates.filter((g) => g.code !== 'pregnant').map((g) => `<li>${esc(g.he)}.${cite(g.section, lh.women.url)}</li>`).join('')
		+ `<li>${esc(lh.reserve.during_he)}.${cite(lh.reserve.during_section, lh.reserve.url)}</li>`
		+ `<li>${esc(lh.reserve.partner_he)} (${esc(lh.reserve.partner_temp_he)}).${cite(lh.reserve.partner_section, lh.reserve.url)}</li>`
		+ `<li>${esc(lh.women.compensation_he)}.${cite(lh.women.compensation_section, lh.women.url)} ${esc(lh.reserve.compensation_he)}.${cite(lh.reserve.compensation_section, lh.reserve.url)}</li></ul></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || lh.checked_on)}</div>`;
}

/** Page section: every month of the first three years, both pay types, from the law's tiers. */
export function monthTable(reg) {
	const sv = reg.severance;
	const lh = reg.labor_hodaa;
	const rows = [];
	const cell = (x) => (x.month ? 'חודש' : `${x.days} ${x.days === 1 ? 'יום' : 'ימים'}`);
	for (let n = 1; n <= 37; n += 1) {
		// The n-th month of work: n − 1 full months and some days (the 37th: more than 36 months).
		const span = { months: n - 1, days: 1 };
		const a = hdNoticeDays(sv, 'monthly', span);
		const b = hdNoticeDays(sv, 'hourly', span);
		rows.push(`<tr><td data-th="חודש העבודה שבו ניתנת ההודעה"><bdi>${n === 37 ? 'יותר מ-36' : n}</bdi></td><td data-th="משכורת חודשית">${n > 12 ? 'חודש' : cell(a)} <small>(${esc(n > 12 ? 'סעיף 3(3)' : a.section)})</small></td><td data-th="לפי שעה או יום">${cell(b)} <small>(${esc(b.section)})</small></td></tr>`);
	}
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>ימי הודעה מוקדמת לפי חודש העבודה שבו ניתנת ההודעה, לפיטורים ולהתפטרות (סעיפים 3, 4 ו-5 ל${esc(lh.law.he)}, נוסח ל-${isoToHe(lh.law.current_to)}), כמו בטבלה של משרד העבודה: חודש שהתחיל נספר; במשכורת חודשית, אחרי 12 חודשים מלאים: חודש. חוזה או הסכם קיבוצי יכולים לקבוע יותר.</caption><thead><tr><th scope="col">חודש העבודה שבו ניתנת ההודעה</th><th scope="col">משכורת חודשית</th><th scope="col">לפי שעה או יום</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): the notice of the example (or of the reader once
 * they change anything), the last day and the pay in one line, and a jump to the form. Same markup on the server and in
 * the browser, so the card never shifts the layout. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הנתונים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">הודעה מוקדמת</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}הודעה מוקדמת ${dirHe(r)}, ${r.payType === 'hourly' ? 'לפי שעה' : 'משכורת חודשית'}, ${tenureHe(r.span)} ותק`;
	const fig = r.useContract ? `<bdi>${r.contractDays}</bdi>` : r.stat.month ? 'חודש' : `<bdi>${String(r.stat.days)}</bdi>`;
	const unit = r.useContract || !r.stat.month ? `${r.stat.days === 1 && !r.useContract ? 'יום' : 'ימים'} · עד ${isoToHe(r.end)}` : `עד ${isoToHe(r.end)}`;
	const line = `${r.useContract ? 'לפי החוזה' : `לפי ${r.stat.section} לחוק הודעה מוקדמת`}; יום ההודעה לא נספר.${r.periodPay !== null ? ` השכר בעד התקופה: ${nis(r.periodPay)}.` : ''}${r.blocked ? ' סומנה הגנה מפיטורים: ייתכן שנדרש היתר.' : ''}`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${fig}</strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const r = hdCompute(reg, EXAMPLE);
	const lh = reg.labor_hodaa;
	const n = reg.severance.notice;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.stat.days,
		sticky: `<bdi>${r.stat.days}</bdi> ימים`,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>ותק ביום ההודעה: מ-${isoToHe(EXAMPLE.start)} עד ${isoToHe(EXAMPLE.noticeDate)}, ${r.months} חודשים: ההודעה ניתנת בחודש העבודה ה-${r.stat.n}${cite('הטבלה של משרד העבודה', lh.guide.url)}</li>`
			+ `<li>משכורת חודשית, מהחודש ה-${n.monthly.first_months + 1}: ${n.monthly.base_days} + ${n.monthly.per_month} × ${r.stat.n - n.monthly.first_months} = ${r.stat.days} ימים${cite(r.stat.section, lh.law.url)}</li>`
			+ `<li>יום ההודעה לא נספר: ${r.stat.days} ימים מ-${isoToHe(EXAMPLE.noticeDate)}, היום האחרון ${isoToHe(r.end)}${cite(lh.law.sections.written, lh.law.url)}</li>`
			+ `<li>השכר הרגיל בעד התקופה: כל יום כחלק מהחודש שלו, ${money(EXAMPLE.salary, 0)} ₪ לחודש: ${nis(r.periodPay)}${cite(`${lh.law.sections.waive_fire}, ${lh.law.sections.none_fire}`, lh.law.url)}</li>`
			+ `<li>חופשה בתוך הודעת פיטורים נחשבת רק מעבר ל-${lh.leave.free_days} ימים: כאן ${r.vacation.allowed} ימים${cite(lh.leave.section, lh.leave.url)}</li></ol>`,
		compare_table: monthTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

const MODE_CODE = { worked: 'w', waived: 'v', none: 'n', short: 's' };
const MODE_OF = { w: 'worked', v: 'waived', n: 'none', s: 'short' };
export const KEYS = ['d', 'p', 's', 'n', 'w', 'h', 'o', 'm', 'l', 'c', 'v', 'k', 'a', 'b', 'g'];
export function stateOf(i) {
	return encodeState({
		d: i.dir === 'resign' ? 'r' : 'f', p: i.payType === 'hourly' ? 'h' : 'm', s: i.start || '', n: i.noticeDate || '',
		w: i.payType === 'hourly' || i.salary === '' || i.salary === undefined ? '' : Math.round(Number(i.salary)),
		h: i.payType === 'hourly' ? i.hourly : '', o: i.payType === 'hourly' ? i.hours : '', m: MODE_CODE[i.mode] || 'w',
		l: i.mode === 'short' ? i.lastDay : '', c: i.contractDays, v: i.vacation, k: i.pauseKind || '',
		a: i.pauseKind ? i.pauseFrom : '', b: i.pauseKind ? i.pauseTo : '', g: (i.gates || []).join('.'),
	});
}
export function inputOf(s) {
	if (!s || !s.s || !s.n) { return null; }
	const num = (v) => (v === undefined || v === '' ? '' : Number(v));
	return Object.assign({}, HD_BLANK, {
		dir: s.d === 'r' ? 'resign' : 'fire', payType: s.p === 'h' ? 'hourly' : 'monthly', start: s.s, noticeDate: s.n,
		salary: num(s.w), hourly: num(s.h), hours: num(s.o), mode: MODE_OF[s.m] || 'worked', lastDay: s.l || '',
		contractDays: num(s.c), vacation: num(s.v), pauseKind: s.k || '', pauseFrom: s.a || '', pauseTo: s.b || '',
		gates: s.g ? String(s.g).split('.').filter((g) => HD_GATES.includes(g)) : [],
	});
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const amt = (id) => { const v = String(val(id)).replace(/[,\s₪]/g, ''); return v === '' ? '' : Number(v); };
	return {
		dir: pick('dir', 'fire'), payType: pick('pay', 'monthly'), start: hdIso(val('start')), noticeDate: hdIso(val('nd')),
		salary: amt('sal'), hourly: amt('hr'), hours: amt('hrs'), mode: pick('mode', 'worked'), lastDay: hdIso(val('last')),
		contractDays: amt('con'), vacation: amt('vac'), pauseKind: val('pk'), pauseFrom: hdIso(val('pf')), pauseTo: hdIso(val('pt')),
		gates: [...root.querySelectorAll(`input[name="${P}-g"]:checked`)].map((x) => x.value),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const lh = reg.labor_hodaa;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let ndTouched = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(lh.checked_on, lh.refresh_every_days) || (lh.next_update && today >= lh.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהחוק התעדכן'); }
	}
	const ids = { start: 'start', noticeDate: 'nd', salary: 'sal', hourly: 'hr', hours: 'hrs', lastDay: 'last', contractDays: 'con', vacation: 'vac', pause: 'pause' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const id = ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id === 'pause' ? 'pk' : id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = (input) => {
		form.querySelectorAll('[data-if-pay]').forEach((el) => { el.hidden = el.getAttribute('data-if-pay') !== input.payType; });
		form.querySelectorAll('[data-if-short]').forEach((el) => { el.hidden = input.mode !== 'short'; });
		const key = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return p.dir === input.dir && p.payType === input.payType && p.mode === input.mode && /^\d{4}-\d{2}-\d{2}$/.test(input.noticeDate || '') && input.start === addDays(addMonths(input.noticeDate, -p.back), 1); }) || '';
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = hdCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? (r.stat.month && !r.useContract ? 'חודש' : `<bdi>${r.useContract ? r.contractDays : r.stat.days}</bdi> ימים`) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: hdBand(r) }); }
		return r;
	};
	// The example keeps its own notice day; the reader's first change moves it to today, unless they set it themselves.
	const current = () => {
		const nd = root.querySelector(`#${P}-nd`);
		if (nd && !ndTouched && hdIso(nd.value) === EXAMPLE.noticeDate) { nd.value = isoToHe(today); }
		return readForm(root);
	};
	const schedule = (ev) => {
		own = true;
		if (ev && ev.target && ev.target.id === `${P}-nd`) { ndTouched = true; }
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = current(); sync(input); run(input); }, 160);
	};
	// A share link names its tool (/@hodaa-mukdemet); on a page with several tools only this tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (fromHash) {
		own = true;
		ndTouched = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync(fromHash);
		run(fromHash, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
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
			const nd = hdIso((root.querySelector(`#${P}-nd`) || {}).value);
			const day = ndTouched && /^\d{4}-\d{2}-\d{2}$/.test(nd) ? nd : today;
			const input = hdPreset(b.getAttribute('data-preset'), day);
			if (!input) { return; }
			own = true;
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		const input = own ? current() : readForm(root);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok) {
			download('hodaa-mukdemet.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `הודעה מוקדמת: ${e.he}`, description: `${e.section}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק הודעה מוקדמת ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(lh.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: hdBand(r) });
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
			if (s) { own = true; ndTouched = true; form.innerHTML = renderForm(reg, s); sync(s); run(s); }
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
