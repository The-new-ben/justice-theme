/**
 * Wave 5 UI: severance pay and the advance notice (HAD-504). The service ruler shows the years of work, the part that
 * section 14 put in the pension fund and the part the employer still owes; the timeline after it shows the notice and
 * the payment deadlines of the Wage Protection Law. The table, the letter and the .ics say the same in text.
 */
import { compute, byArrangement, RESIGN_CODES } from './pitzuyim-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'pitzuyim';
const P = 'jt13';

export const EXAMPLE = { payType: 'monthly', salary: 12000, hourly: '', hours: '', jobPct: '', start: '2018-03-01', end: '2026-09-30', reason: 'fired', s14: 'partial', s14Pct: '', s14From: '', noticeDate: '', noticeMode: 'worked', change: false, changeDate: '', prevPct: '', prevSalary: '', prevHours: '', prevHourly: '', manyChanges: false, unpaidExcess: '', groundOk: false, nearClaim: false, seasonal: false, otherBreaks: false, misconduct: false };

const S14_LABEL = { none: 'אין סעיף 14', partial: 'סעיף 14 על 72%', full: 'סעיף 14 מלא (100%)', custom: 'אחוז אחר לפי ההסכם' };
const REASON_LABEL = { health: 'בריאות', parent: 'הורות (9 חודשים)', move: 'מעבר דירה', term: 'חוזה שלא חודש', worse: 'הרעת תנאים', retire: 'גיל פרישה' };
const MARK = { bad: '✕', warn: '!', info: 'i', ok: '✓' };
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');

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
	return `<fieldset class="jtool-field"><legend>איך משולם השכר</legend><div class="jtool-chips">${chip('pt', 'monthly', 'משכורת חודשית', !hourly)}${chip('pt', 'hourly', 'לפי שעה או יום', hourly)}</div></fieldset>`
		+ `<div data-if-pay="monthly"${hourly ? ' hidden' : ''}>${moneyField('sal', 'השכר החודשי האחרון (שכר יסוד ותוספות קבועות)', input.salary, 'לדוגמה: 12,000')}</div>`
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
		+ `<p class="jtool-hint">ברוב התלושים כתוב "סעיף 14". הפרשה של 6% לפיצויים בלי השלמה של 2⅓% מכסה 72%; הפרשה של 8⅓% מכסה 100% (${esc(sv.approval.he)}).</p></fieldset>`
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
		+ ruler(r) + timeline(reg, r)
		+ (flags.length ? `<ul class="jtool-flags">${flags.map((f) => `<li><strong aria-hidden="true">${MARK[f.level]}</strong> ${esc(f.he)}</li>`).join('')}</ul>` : '');
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
		const arr = byArrangement(reg, { payType: r.payType, salary: r.monthly, hourly: r.hourly, hours: r.hours, jobPct: r.jobPct, start: r.start, end: r.end, reason: r.reason, change: r.change, changeDate: r.changeDate, prevPct: r.prevPct, prevSalary: r.prevSalary, prevHours: r.prevHours, prevHourly: r.prevHourly, unpaidExcess: r.unpaidExcess, groundOk: r.groundOk, nearClaim: r.nearClaim });
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-arr-h">אותו עובד, שלושה הסדרים</h3></div><div class="jt7-scns jt13-scns">`
			+ ['none', 'partial', 'full'].map((k) => { const v = arr[k]; const here = k === r.s14; return `<div class="jt7-scn${here ? ' jt7-scn--here' : ''}"><p>${esc(S14_LABEL[k])}${here ? ' (אתם)' : ''}</p><strong>${v ? ils(v.employer, 0) : '—'}</strong><small>${v ? (v.pct ? `המעסיק משלם; ועוד מה שנצבר בקופה, במקום ${v.pct}% מהפיצויים` : 'המעסיק משלם הכול') : ''}</small></div>`; }).join('')
			+ `</div><p class="jt7-scns__note">בלי סעיף 14 המעסיק משלם ${nis(r.severance)}. עם סעיף 14 הוא משלם פחות, ומהקופה מגיע מה שנצבר בה בפועל: ההפקדות מהשכר של כל חודש, עם התשואה או ההפסד. הקופה שלכם גם בהתפטרות, והמעסיק לא משלים תשואה שלא הושגה.</p></div>`;
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.deadlines.map((d) => `<tr><td data-th="תאריך">${esc(isoToHe(d.date))}</td><td data-th="מה">${esc(d.he)}</td><td data-th="הכלל">${cite(d.section, d.url)}</td></tr>`).join('')
		+ `</tbody></table></div></div>`;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-ltr-h">מכתב למעסיק</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="letter">העתקת המכתב</button></div></div><pre class="jtool-letter">${esc(letter(reg, r))}</pre></div>`;
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

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const kind = radio('rk', 'fired');
	const why = radio('rw', 'plain');
	return {
		payType: radio('pt', 'monthly'), salary: m('sal'), hourly: m('hr'), hours: m('hrs'), jobPct: m('job'),
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
	};
}

const RS = { fired: 'f', resign: 'r', health: 'h', parent: 'p', move: 'm', term: 't', worse: 'w', retire: 'x', other_ground: 'g' };
const S14 = { none: 'n', partial: 'p', full: 'f', custom: 'c' };
const NM = { worked: 'w', paid: 'p', none: 'n' };
const stateOf = (i) => encodeState({ t: i.payType === 'hourly' ? 'h' : '', w: i.salary || '', h: i.hourly || '', o: i.hours || '', j: i.jobPct || '', s: i.start, e: i.end, r: RS[i.reason] || 'f', f: S14[i.s14] || 'n', p: i.s14Pct || '', d: i.s14From || '', n: i.noticeDate || '', m: NM[i.noticeMode] || 'w', c: i.change ? 1 : '', a: i.change ? i.changeDate : '', b: i.change ? i.prevPct : '', g: i.change ? i.prevSalary : '', k: i.change && i.manyChanges ? 1 : '', x: i.change ? i.prevHours : '', y: i.change ? i.prevHourly : '', u: i.unpaidExcess || '', z: i.groundOk || i.parentOk ? 1 : '', q: i.nearClaim ? 1 : '', v: i.seasonal ? 1 : '', i: i.otherBreaks ? 1 : '', l: i.misconduct ? 1 : '' });
const KEYS = ['t', 'w', 'h', 'o', 'j', 's', 'e', 'r', 'f', 'p', 'd', 'n', 'm', 'c', 'a', 'b', 'g', 'k', 'x', 'y', 'u', 'z', 'q', 'v', 'i', 'l'];
function inputOf(s) {
	if (!s.s || !s.e) { return null; }
	const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
	return {
		payType: s.t === 'h' ? 'hourly' : 'monthly', salary: s.w ? Number(s.w) : '', hourly: s.h ? Number(s.h) : '', hours: s.o ? Number(s.o) : '', jobPct: s.j ? Number(s.j) : '',
		start: s.s, end: s.e, reason: back(RS, s.r, 'fired'), s14: back(S14, s.f, 'none'), s14Pct: s.p ? Number(s.p) : '', s14From: s.d || '', noticeDate: s.n || '', noticeMode: back(NM, s.m, 'worked'),
		change: s.c === '1', changeDate: s.c === '1' ? (s.a || '') : '', prevPct: s.c === '1' && s.b ? Number(s.b) : '', prevSalary: s.c === '1' && s.g ? Number(s.g) : '', manyChanges: s.c === '1' && s.k === '1',
		prevHours: s.c === '1' && s.x ? Number(s.x) : '', prevHourly: s.c === '1' && s.y ? Number(s.y) : '', unpaidExcess: s.u ? Number(s.u) : '', groundOk: s.z === '1', nearClaim: s.q === '1', seasonal: s.v === '1', otherBreaks: s.i === '1', misconduct: s.l === '1',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
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
	const ids = { salary: 'sal', hourly: 'hr', hours: 'hrs', jobPct: 'job', start: 'start', end: 'end', s14Pct: 's14p', s14From: 's14f', noticeDate: 'nd', changeDate: 'chd', prevPct: 'pp', prevSalary: 'ps', prevHours: 'ph', prevHourly: 'phr', unpaidExcess: 'ul' };
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
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? ilsn(r.severance) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.entitled ? (r.s14 === 'none' ? 'employer' : 's14') : 'none' }); }
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
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			download('pitzuyim.ics', 'text/calendar;charset=utf-8', ics(r.deadlines.filter((d) => d.key !== 'limit').map((d) => ({ date: d.date, summary: `פיצויי פיטורים: ${d.he}` })), new Date().toISOString()));
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
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok && r.entitled ? 'entitled' : 'other' });
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
