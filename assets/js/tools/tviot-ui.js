/**
 * T05 UI: small claims — does it fit, the fee, the deadlines, the claim's structure, rehearse (HAD-490).
 * Board: https://claude.ai/artifact/759KGxB7GDSy5NHaajW8sJ (T05-desktop, T05-360, T05-fee, States).
 * One bundle, two modes: the full instrument (/small-claims-court-israel/) and fee only
 * (/small-claims-fee-calculator/, [justice_tool name="tviot-ktanot" mode="fee"]).
 *
 * The consumer-law wave (22.10.2026, HAD-593, the ktanot lane, prefix jt65) adds, without changing any wave-1 export: the
 * claim against a business (claim heads -> the total against the ceiling line -> the fee as a stamp; the waiver or the
 * magistrates' court above the ceiling), the statement-of-claim outline built from the heads and the grounds (claimText
 * grows when there are heads), the case timeline from the event to the Execution Office (.ics), the documents checklist,
 * the result-first card in both modes (leadCard), quick profiles, the scenario for the jus-tice.com simulation
 * (aiBrief + openSimulation, court_rehearsal), a one-page print, "what changed and when" and the share link the sibling
 * tools use (stateLink, KEYS: parts/ktanot/STATE-KEYS.md).
 */
import { compute, fee, addDays, ktBand, KT_HEADS, KT_KINDS } from './tviot-engine.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, amount, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'tviot-ktanot';
const P = 'jt5';
const Q = 'jt65';
export const PAGE = '/small-claims-court-israel/';
export const FEE_PAGE = '/small-claims-fee-calculator/';
const KT_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=court_rehearsal&topic=contract-dispute';
// The sibling instruments of the consumer cluster (their pages; their share keys are read from their worktrees).
const KT_TISA = '/law-compensation-cancellation-2012/';
const KT_PITZUI = '/consumer-rights-israel/';
const KT_BITUL = '/bitul-iska/';

export const EXAMPLE = { mode: 'full', amount: 12748, plaintiff: 'individual', remedy: 'money', assigned: false, labor: false, claimsThisYear: 0, eventDate: '2026-03-01', hearingDate: '2027-02-15', servedDate: '' };
export const EXAMPLE_FEE = { mode: 'fee', amount: 39900 };
export const FEE_EXAMPLES = [3000, 5000, 5001, 10000, 12748, 25010, 39900];

/** The consumer wave's example: the same claim as EXAMPLE (12,748 ₪, the same dates), built from three heads against a
 * business: a fridge's price 7,990 ₪ after the repair under warranty was refused, 258 ₪ of expenses with receipts, and
 * 4,500 ₪ of compensation without proof of damage under s.31A(a)(8), after a written demand on 15.3.2026. */
export const EXAMPLE_CLAIM = Object.assign({}, EXAMPLE, { kind: 'def', heads: { price: 7990, other: 258, comp: 4500 }, compPar: '8', passengers: '', demandDate: '2026-03-15', filingDate: '', judgmentDate: '', waive: false });

const KT_BLANK = { mode: 'full', amount: '', plaintiff: 'individual', remedy: 'money', assigned: false, labor: false, claimsThisYear: 0, eventDate: '', hearingDate: '', servedDate: '', kind: 'def', heads: {}, compPar: '', passengers: '', demandDate: '', filingDate: '', judgmentDate: '', waive: false };
/** One click to a full profile: the amounts are the reader's (an example of each), the dates count back from today. */
export const PRESETS = {
	def: { he: 'מוצר פגום 1,800 ₪', kind: 'def', heads: { price: 1800 }, back: 40, demand: 12 },
	flt: { he: 'ביטול טיסה, 2 נוסעים', kind: 'flt', heads: { price: 2900 }, passengers: 2, back: 60, demand: 30 },
	sub: { he: 'מנוי שלא בוטל', kind: 'sub', heads: { price: 539.4, comp: 2000 }, compPar: '2b', back: 200, demand: 20 },
	ref: { he: 'החזר שלא שולם אחרי ביטול', kind: 'ref', heads: { price: 1200 }, back: 45, demand: 15 },
	over: { he: 'על התקרה', kind: 'def', heads: { price: 32000, repair: 6500, comp: 5000 }, compPar: '8', back: 90, demand: 30 },
};
/** A preset applied on a day: the event `back` days before it, the written demand `demand` days before it. */
export function ktPreset(key, today) {
	const p = PRESETS[key];
	if (!p) { return null; }
	const heads = Object.assign({}, p.heads);
	const total = KT_HEADS.reduce((s, h) => s + Math.round((Number(heads[h]) || 0) * 100), 0) / 100;
	return Object.assign({}, KT_BLANK, { kind: p.kind, heads, amount: total, compPar: p.compPar || '', passengers: p.passengers || '', eventDate: addDays(today, -p.back), demandDate: addDays(today, -p.demand) });
}

const PLAINTIFFS = { individual: 'אדם פרטי', osek: 'עוסק פטור או מורשה', company: 'חברה בע"מ', other_body: 'עמותה או שותפות' };
const CANNOT = { company: 'חברה בע"מ לא יכולה להגיש תביעה קטנה', other_body: 'עמותה או שותפות לא יכולה להגיש תביעה קטנה' };
const KIND_SHORT = { def: 'מוצר פגום', flt: 'טיסה', sub: 'מנוי שהמשיך לחייב', ref: 'החזר שלא שולם', sup: 'לא סופק בזמן', prc: 'מחיר גבוה מהמוצג', oth: 'מחלוקת עם עסק' };
const HEAD_SHORT = { price: 'המחיר או ההחזר', fee: 'דמי ביטול', repair: 'תיקון או החלפה', comp: 'פיצויים לדוגמה', flight: 'פיצוי טיסה', other: 'הוצאות' };
const HEAD_HINT = {
	price: 'מה ששילמתם ולא קיבלתם בחזרה',
	fee: 'דמי ביטול שנגבו מעבר למותר',
	repair: 'לפי קבלה או הצעת מחיר',
	comp: 'הסכום שאתם מבקשים; בית המשפט קובע',
	flight: 'לכל הנוסעים יחד, לפי חוק שירותי תעופה',
	other: 'משלוח, נסיעות, החלפה זמנית: עם קבלות',
};

function lawCite(reg, text) { return ` <a class="jtool-cite" href="${esc(reg.small_claims.law_url)}" target="_blank" rel="noopener">${esc(text)}</a>`; }
function regCite(reg, text) { return ` <a class="jtool-cite" href="${esc(reg.small_claims.fee.regulation_url)}" target="_blank" rel="noopener">${esc(text)}</a>`; }
function cite(href, text) { return ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>`; }

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += y >= 70 ? 1900 : 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

const ktNis = (n) => `${money(n, Math.round(Number(n) * 100) % 100 ? 2 : 0)} ₪`;
const ktHasHeads = (input) => Boolean(input && input.heads && KT_HEADS.some((h) => input.heads[h] !== undefined && input.heads[h] !== '' && input.heads[h] !== null && Number(input.heads[h]) !== 0));
const ktParLabel = (reg, code) => { const p = ((reg.consumer_ktanot || {}).exemplary || { paragraphs: [] }).paragraphs.find((x) => x.code === code); return p ? p.label : ''; };

/* ---------------- Pure renderers ---------------- */

/** The consumer wave's part of the form: quick profiles, then the claim against a business (kind, heads, the s.31A
 * paragraph, passengers, the written demand, the waiver). Only the full mode has it. */
function ktFormTop(reg, input) {
	const k = reg.consumer_ktanot;
	if (!k) { return ''; }
	const i = Object.assign({}, KT_BLANK, input || {});
	const heads = i.heads || {};
	const field = (code) => {
		const v = heads[code];
		const shown = v === undefined || v === null || v === '' ? '' : (Number.isFinite(Number(v)) ? money(Number(v), Number(v) % 1 ? 2 : 0) : String(v));
		return `<div class="jtool-field ${Q}-head ${Q}-head--${code}"${code === 'flight' ? ' data-kt-if-flt' : ''}${code === 'flight' && i.kind !== 'flt' && !shown ? ' hidden' : ''}><label class="jtool-label" for="${Q}-h-${code}"><span class="${Q}-sw ${Q}-sw--${code}" aria-hidden="true"></span>${esc(k.heads[code].he)}</label>`
			+ `<div class="jtool-input jtool-input--money"><input id="${Q}-h-${code}" type="text" inputmode="decimal" autocomplete="off" value="${esc(shown)}" placeholder="0" aria-describedby="${Q}-h-${code}-h ${Q}-h-${code}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>`
			+ `<p class="jtool-hint" id="${Q}-h-${code}-h">${esc(HEAD_HINT[code])}</p><p class="jtool-error" id="${Q}-h-${code}-e" role="alert"></p></div>`;
	};
	const pars = k.exemplary.paragraphs.map((p) => `<option value="${esc(p.code)}"${i.compPar === p.code ? ' selected' : ''}>${esc(`${p.label}: ${p.he}`)}</option>`).join('');
	const compOn = heads.comp !== undefined && heads.comp !== '' && Number(heads.comp) > 0;
	const preset = Object.keys(PRESETS).find((key) => { const p = PRESETS[key]; return p.kind === i.kind && KT_HEADS.every((h) => Number(p.heads[h] || 0) === Number(heads[h] || 0)) && String(p.passengers || '') === String(i.passengers || ''); }) || '';
	return `<fieldset class="jtool-field ${Q}-quick"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${Q}-presets">${Object.entries(PRESETS).map(([key, v]) => `<button type="button" class="${Q}-preset" data-act="kt-preset" data-preset="${key}" aria-pressed="${key === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא דוגמה מלאה, עם תאריכים לפי היום; משנים כל שדה לפי המקרה שלכם.</p></fieldset>'
		+ `<fieldset class="jtool-field ${Q}-claim"><legend>התביעה נגד העסק: ראשי התביעה</legend>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${Q}-k">מה קרה</label><select id="${Q}-k">${KT_KINDS.map((code) => `<option value="${code}"${i.kind === code ? ' selected' : ''}>${esc(k.kinds[code].he)}</option>`).join('')}</select></div>`
		+ `<div class="${Q}-heads">${KT_HEADS.map(field).join('')}</div>`
		+ `<div class="jtool-row" data-kt-if-flt${i.kind === 'flt' ? '' : ' hidden'}><div class="jtool-field"><label class="jtool-label" for="${Q}-pax">מספר הנוסעים</label><input id="${Q}-pax" type="text" inputmode="numeric" autocomplete="off" value="${esc(i.passengers ?? '')}" placeholder="לדוגמה: 2" aria-describedby="${Q}-pax-e"><p class="jtool-error" id="${Q}-pax-e" role="alert"></p></div></div>`
		+ `<div class="jtool-field" data-kt-if-comp${compOn ? '' : ' hidden'}><label class="jtool-label" for="${Q}-par">הפיצויים לדוגמה נשענים על</label><select id="${Q}-par"><option value="">בחרו פסקה בסעיף 31א(א)</option>${pars}</select><p class="jtool-hint">רק הפרות שבסעיף 31א(א) מזכות בפיצויים לדוגמה, עד ${ktNis(k.exemplary.max)}.</p></div>`
		+ `<div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${Q}-g">שלחתם לעסק דרישה בכתב? באיזה יום</label><input id="${Q}-g" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(i.demandDate || ''))}" placeholder="לדוגמה: 15.3.2026" aria-describedby="${Q}-g-h ${Q}-g-e"><p class="jtool-hint" id="${Q}-g-h">לפני פיצויים לדוגמה הדרישה חובה (סעיף 31א(ב))</p><p class="jtool-error" id="${Q}-g-e" role="alert"></p></div></div>`
		+ `<div class="jtool-chips ${Q}-waive" data-kt-if-over${i.waive ? '' : ' hidden'}><label class="jtool-chip"><input type="checkbox" id="${Q}-w" name="${Q}-w" value="1"${i.waive ? ' checked' : ''}><span>לוותר על מה שמעל התקרה ולתבוע בתביעה קטנה</span></label></div>`
		+ '</fieldset>';
}

export function renderForm(reg, input) {
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const byHeads = input.mode !== 'fee' && ktHasHeads(input);
	const amt = `<div class="jtool-field"><label class="jtool-label" for="${P}-amt">סכום התביעה</label><div class="jtool-input jtool-input--money"><input id="${P}-amt" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.amount ? money(input.amount, input.amount % 1 ? 2 : 0) : '')}" placeholder="לדוגמה: 12,000" aria-describedby="${P}-amt-h ${P}-amt-e"${byHeads ? ' readonly data-kt-sum' : ''}><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>`
		+ `<p class="jtool-hint" id="${P}-amt-h">${input.mode === 'fee' ? `התקרה מ-${isoToHe(reg.small_claims.ceiling[reg.small_claims.ceiling.length - 1].from)}: ${money(reg.small_claims.ceiling[reg.small_claims.ceiling.length - 1].amount, 0)} ₪ (מתעדכנת ב-1 בינואר). מעליה זו לא תביעה קטנה.` : byHeads ? 'מחושב מראשי התביעה. כדי להזין סכום אחר, מרוקנים את ראשי התביעה.' : 'בתביעה להחלפת מוצר, תיקון או ביטול עסקה: שווי המוצר או העסקה'}</p><p class="jtool-error" id="${P}-amt-e" role="alert"></p></div>`;
	if (input.mode === 'fee') {
		return amt + `<div class="jtool-field"><span class="jtool-label" id="${P}-ex-l">דוגמאות</span><div class="jtool-chips" role="group" aria-labelledby="${P}-ex-l">${[3000, 5001, 25010].map((a) => `<button class="jtool-btn" type="button" data-amount="${a}">${money(a, 0)} ₪</button>`).join('')}</div></div>`;
	}
	const more = Boolean(input.eventDate || input.hearingDate || input.servedDate || input.filingDate || input.judgmentDate);
	return ktFormTop(reg, input) + amt
		+ `<fieldset class="jtool-field"><legend>מי תובע</legend><div class="jtool-chips">${Object.entries(PLAINTIFFS).map(([k, v]) => chip('pl', k, v, input.plaintiff === k)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מה מבקשים</legend><div class="jtool-chips">${chip('rm', 'money', 'כסף', input.remedy !== 'product')}${chip('rm', 'product', 'החלפה, תיקון או ביטול עסקה', input.remedy === 'product')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>שאלות קצרות</legend><div class="jtool-chips">${chip('labor', '1', 'זה סכסוך עם מעסיק', input.labor, 'checkbox')}${chip('assigned', '1', 'קניתי את החוב ממישהו (המחאה)', input.assigned, 'checkbox')}</div></fieldset>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-n">כמה תביעות קטנות הגשתם השנה באותו בית משפט</label><input id="${P}-n" type="text" inputmode="numeric" autocomplete="off" value="${esc(input.claimsThisYear ?? 0)}" aria-describedby="${P}-n-e"><p class="jtool-error" id="${P}-n-e" role="alert"></p></div>`
		+ `<details class="jtool-more"${more ? ' open' : ''}><summary>תאריכים, בשביל המועדים</summary>`
		+ `<div class="jtool-row" style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${P}-ev">מתי זה קרה</label><input id="${P}-ev" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.eventDate || ''))}" placeholder="לדוגמה: 1.3.2026" aria-describedby="${P}-ev-e"><p class="jtool-error" id="${P}-ev-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-he">מועד הדיון, אם נקבע</label><input id="${P}-he" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.hearingDate || ''))}" placeholder="לדוגמה: 15.2.2027" aria-describedby="${P}-he-e"><p class="jtool-error" id="${P}-he-e" role="alert"></p></div></div>`
		+ `<div class="jtool-field" style="margin-top:8px"><label class="jtool-label" for="${P}-sv">אתם הנתבעים? מתי קיבלתם את התביעה</label><input id="${P}-sv" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.servedDate || ''))}" placeholder="לדוגמה: 5.10.2026" aria-describedby="${P}-sv-e"><p class="jtool-error" id="${P}-sv-e" role="alert"></p></div>`
		+ (reg.consumer_ktanot ? `<div class="jtool-row" style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${Q}-i">יום הגשת התביעה</label><input id="${Q}-i" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.filingDate || ''))}" placeholder="לדוגמה: 1.11.2026" aria-describedby="${Q}-i-e"><p class="jtool-error" id="${Q}-i-e" role="alert"></p></div>`
			+ `<div class="jtool-field"><label class="jtool-label" for="${Q}-j">יום פסק הדין, אם ניתן</label><input id="${Q}-j" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.judgmentDate || ''))}" placeholder="לדוגמה: 15.2.2027" aria-describedby="${Q}-j-h ${Q}-j-e"><p class="jtool-hint" id="${Q}-j-h">ניתן בדיון: יום הדיון. נשלח אחר כך: היום שקיבלתם אותו</p><p class="jtool-error" id="${Q}-j-e" role="alert"></p></div></div>` : '')
		+ `</details>`;
}

const FORUM = { magistrate: 'לבית משפט השלום', district: 'לבית המשפט המחוזי' };
const forumText = (r) => FORUM[r.forum] || FORUM.magistrate;

const COND_TEXT = {
	plaintiff: (r) => (r.conds[0].met ? 'התובע יחיד (גם עוסק פטור או מורשה). חברה בע"מ לא יכולה לתבוע כאן' : `${CANNOT[r.plaintiff]}: רק יחיד`),
	amount: (r) => (r.ceilingUnknown ? `${money(r.amount, r.amount % 1 ? 2 : 0)} ₪: התקרה החדשה מ-1 בינואר עוד לא נטענה לכלי (האחרונה: ${money(r.ceiling, 0)} ₪)` : r.overCeiling ? `${money(r.amount, r.amount % 1 ? 2 : 0)} ₪ מעל התקרה של ${money(r.ceiling, 0)} ₪ (מ-${isoToHe(r.ceilingFrom)}) ב-${money(r.overBy, r.overBy % 1 ? 2 : 0)} ₪` : `${money(r.amount, r.amount % 1 ? 2 : 0)} ₪, עד ${money(r.ceiling, 0)} ₪ מ-${isoToHe(r.ceilingFrom)}`),
	remedy: (r) => (r.remedy === 'product' ? 'החלפה או תיקון של מוצר, או ביטול עסקה, בשווי עד התקרה' : 'תשלום כסף'),
	assigned: (r) => (r.conds[3].met ? 'לא מכוח זכות שהומחתה מאדם אחר' : 'תביעה מכוח זכות שהומחתה (חוב שנקנה) לא נדונה בתביעות קטנות'),
	exclusive: (r) => (r.conds[4].met ? 'לא בסמכות ייחודית של בית משפט אחר (סכסוך עובד-מעסיק: בית הדין לעבודה)' : 'סכסוך בין עובד למעסיק שייך לבית הדין האזורי לעבודה'),
	claims: (r) => (r.conds[5].met ? `לא יותר מ-5 תביעות השנה באותו בית משפט` : `${r.claims} תביעות השנה באותו בית משפט: בית המשפט רשאי להעביר את התביעה לבית משפט השלום`),
};
const COND_SEC = { s60a: 'סעיף 60(א)', s60a1: 'סעיף 60(א)(1)', s60a2: 'סעיף 60(א)(2)', s60b: 'סעיף 60(ב)' };

export function verdictSentence(r) {
	const amt = `${amount(r.amount)} ₪`;
	if (r.mode === 'fee') { return r.overCeiling ? `${amt} מעל התקרה של ${amount(r.ceiling)} ₪, ולכן זו לא תביעה קטנה: היא מוגשת ${forumText(r)}, והאגרה שם אחרת.` : `האגרה על תביעה קטנה של ${amt} היא ${amount(r.fee)} ₪${r.floor ? ' (האגרה המינימלית)' : r.rounded !== r.onePct ? ` (1% הוא ${money(r.onePct)} ₪, מעוגל כלפי מעלה)` : ''}.`; }
	if (r.verdict === 'no') {
		if (!r.conds[0].met) { return `${CANNOT[r.plaintiff]}. תביעה של ${amt} מוגשת ${forumText(r)}, בסדר דין רגיל.`; }
		if (!r.conds[4].met) { return 'סכסוך בין עובד למעסיק נדון בבית הדין האזורי לעבודה, ולא בתביעות קטנות.'; }
		if (r.overCeiling) { return `${amt} מעל התקרה של ${amount(r.ceiling)} ₪. תביעה כזאת מוגשת ${forumText(r)}, בסדר דין רגיל.`; }
		return 'תביעה מכוח זכות שהומחתה לא נדונה בתביעות קטנות.';
	}
	const feeText = `האגרה: ${amount(r.fee)} ₪${r.floor ? ' (המינימום)' : ''}.`;
	if (r.verdict === 'depends') {
		const why = [];
		if (r.ceilingUnknown) { why.push('התקרה החדשה עוד לא נטענה לכלי, ולכן בדקו אותה באתר הרשות השופטת'); }
		if (r.conds[5].met === null) { why.push('אחרי 5 תביעות בשנה באותו בית משפט, בית המשפט רשאי להעביר את התביעה'); }
		return `התביעה מתאימה בשאר התנאים, אבל ${why.join('; ')}. ${feeText}`;
	}
	return `אפשר לתבוע ${amt} בתביעות קטנות. ${feeText}`;
}

export function feeLines(reg, r) {
	const f = reg.small_claims.fee;
	return [
		`1% מסכום התביעה: <bdi>${money(r.amount, r.amount % 1 ? 2 : 0)} × 1% = ${money(r.onePct)}</bdi> ₪${regCite(reg, `${f.section}(1)`)}`,
		`מעגלים כלפי מעלה לכפולה של ${f.round_up_to} ₪: <bdi>${money(r.rounded, 0)}</bdi> ₪${regCite(reg, `${f.section}(3)`)}`,
		`לא פחות מ-${f.min} ₪: ${r.floor ? `<bdi>${f.min}</bdi> ₪, האגרה המינימלית` : `<bdi>${money(r.fee, 0)}</bdi> ₪, מעל הרצפה`}${regCite(reg, `${f.section}(2)`)}`,
		`אין כסף לאגרה? אפשר לבקש פטור בשל חוסר יכולת כלכלית${regCite(reg, 'תקנה 6(ב)')}`,
	];
}

/* ---------------- The claim against a business (jt65) ---------------- */

/** The claim ledger, the picture of the claim: the heads stacked from the start of the line, the ceiling as a rule across it,
 * the part above the ceiling hatched, the fee as a stamp; and the same as receipt rows with the ground of each head. */
export function ledger(reg, r) {
	if (!r || !r.ok || !r.claim) { return ''; }
	const c = r.claim;
	const k = reg.consumer_ktanot;
	const top = Math.max(c.total, r.ceiling) || 1;
	const pct = (n) => Math.round((n / top) * 10000) / 100;
	const segs = c.heads.map((h) => `<span class="${Q}-seg ${Q}-sw--${h.code}" style="inline-size:${pct(h.amount)}%" title="${esc(`${k.heads[h.code].he}: ${ktNis(h.amount)}`)}"></span>`).join('');
	const overPart = c.over ? `<span class="${Q}-over" style="inset-inline-start:${pct(r.ceiling)}%;inline-size:${Math.max(0, 100 - pct(r.ceiling))}%"></span>` : '';
	const ceilLine = r.ceilingUnknown ? '' : `<span class="${Q}-ceil" style="inset-inline-start:${pct(r.ceiling)}%"><b>תקרה ${esc(ktNis(r.ceiling))}</b></span>`;
	const basis = (h) => {
		const d = k.heads[h.code];
		if (h.code === 'comp') { const lbl = ktParLabel(reg, c.par); return `${lbl ? `סעיף ${lbl}` : 'סעיף 31א: בחרו פסקה'}${cite(k.exemplary.url, 'חוק הגנת הצרכן')}`; }
		if (h.code === 'price') { const g = (k.kinds[c.kind] || k.kinds.oth).grounds[0]; return `${esc(d.basis_he)}${cite(g.url, g.section)}`; }
		return `${esc(d.basis_he)}${d.section ? cite(d.url, d.section) : ''}`;
	};
	const rows = c.heads.map((h, n) => `<li class="${Q}-row"><span class="${Q}-sw ${Q}-sw--${h.code}" aria-hidden="true"></span><span class="${Q}-row__n">${n + 1}</span><span class="${Q}-row__name">${esc(k.heads[h.code].he)}</span><span class="${Q}-row__dots" aria-hidden="true"></span><bdi class="${Q}-row__amt">${money(h.amount)}</bdi><span class="${Q}-row__basis">${basis(h)}</span></li>`);
	const pending = [];
	if (c.kind === 'flt' && !c.heads.some((h) => h.code === 'flight')) {
		pending.push(`<li class="${Q}-row ${Q}-row--todo"><span class="${Q}-sw ${Q}-sw--flight" aria-hidden="true"></span><span class="${Q}-row__name">פיצוי כספי לפי חוק שירותי תעופה${c.passengers ? `, ${c.passengers} נוסעים` : ''}</span><span class="${Q}-row__dots" aria-hidden="true"></span><a class="${Q}-row__amt" href="${esc(KT_TISA)}">לחשב בכלי הטיסות</a><span class="${Q}-row__basis">לפי המרחק, ההודעה והשעות${cite(k.aviation.url, 'סעיף 6(א)(3) לחוק שירותי תעופה')}</span></li>`);
	}
	const kp = (k.kinds[c.kind] || {}).par;
	if (kp && !c.heads.some((h) => h.code === 'comp')) {
		pending.push(`<li class="${Q}-row ${Q}-row--todo"><span class="${Q}-sw ${Q}-sw--comp" aria-hidden="true"></span><span class="${Q}-row__name">אפשר להוסיף פיצויים לדוגמה</span><span class="${Q}-row__dots" aria-hidden="true"></span><span class="${Q}-row__amt">עד ${esc(ktNis(k.exemplary.max))}</span><span class="${Q}-row__basis">מקרה כזה מופיע בסעיף ${esc(ktParLabel(reg, kp))}; צריך דרישה בכתב קודם${cite(k.exemplary.url, k.exemplary.demand_section)}</span></li>`);
	}
	const tail = [`<li class="${Q}-row ${Q}-row--total"><span class="${Q}-row__name">סך ראשי התביעה</span><span class="${Q}-row__dots" aria-hidden="true"></span><bdi class="${Q}-row__amt">${money(c.total)}</bdi><span class="${Q}-row__basis">${c.over === null ? 'התקרה החדשה עוד לא נטענה' : c.over ? `מעל התקרה ב-${esc(ktNis(c.overBy))}` : `מתחת לתקרה של ${esc(ktNis(r.ceiling))}`}${lawCite(reg, 'סעיף 60(א)(1)')}</span></li>`];
	if (c.waived) {
		tail.push(`<li class="${Q}-row ${Q}-row--waive"><span class="${Q}-row__name">ויתור על מה שמעל התקרה</span><span class="${Q}-row__dots" aria-hidden="true"></span><bdi class="${Q}-row__amt">−${money(c.waived)}</bdi><span class="${Q}-row__basis">${esc(k.splitting.he)}${cite(k.splitting.url, k.splitting.section)}</span></li>`);
		tail.push(`<li class="${Q}-row ${Q}-row--total"><span class="${Q}-row__name">הסכום הנתבע</span><span class="${Q}-row__dots" aria-hidden="true"></span><bdi class="${Q}-row__amt">${money(c.claimed)}</bdi><span class="${Q}-row__basis">בדיוק התקרה</span></li>`);
	}
	const stamp = c.over && !c.waive ? `<div class="${Q}-stamp ${Q}-stamp--off" aria-hidden="true"><span>אגרת תביעה קטנה</span><strong>לא חלה</strong><small>מעל התקרה</small></div>`
		: `<div class="${Q}-stamp" aria-hidden="true"><span>אגרה</span><strong><bdi>${money(c.fee, 0)}</bdi> ₪</strong><small>${esc(reg.small_claims.fee.section)}</small></div>`;
	const sum = `ראשי התביעה: ${c.heads.map((h) => `${HEAD_SHORT[h.code]} ${ktNis(h.amount)}`).join(', ')}. סך הכול ${ktNis(c.total)}${c.over === null ? '' : c.over ? `, ${ktNis(c.overBy)} מעל התקרה של ${ktNis(r.ceiling)}` : `, מתחת לתקרה של ${ktNis(r.ceiling)}`}.${c.waived ? ` ויתור על ${ktNis(c.waived)}; נתבעים ${ktNis(c.claimed)}.` : ''} ${c.over && !c.waive ? 'אגרת תביעה קטנה לא חלה על הסכום המלא.' : `האגרה ${ktNis(c.fee)}.`}`;
	return `<figure class="${Q}-ledger"><figcaption class="${Q}-ledger__h">${esc(KIND_SHORT[c.kind] || '')}: ראשי התביעה מול התקרה</figcaption>`
		+ `<p class="jtool-visually-hidden">${esc(sum)}</p>`
		+ `<div class="${Q}-ledger__top"><div class="${Q}-bar" aria-hidden="true">${segs}${overPart}${ceilLine}</div>${stamp}</div>`
		+ `<ol class="${Q}-rows">${rows.join('')}${pending.join('')}${tail.join('')}</ol></figure>`;
}

/** Above the ceiling: the two lawful roads, each with its section and its cost. */
export function choiceBox(reg, r) {
	if (!r || !r.ok || !r.claim || !r.claim.over || r.claim.waive) { return ''; }
	const c = r.claim;
	const k = reg.consumer_ktanot;
	return `<div class="${Q}-choice"><h4>מעל התקרה: שתי דרכים</h4><div class="${Q}-choice__grid">`
		+ `<div class="${Q}-choice__opt"><p class="${Q}-choice__t">א. לוותר על ${esc(ktNis(c.overBy))} ולתבוע ${esc(ktNis(r.ceiling))}</p><p>תביעה קטנה, בלי עורך דין, דיון אחד. האגרה: <bdi>${money(c.feeIfWaived, 0)}</bdi> ₪.${regCite(reg, reg.small_claims.fee.section)} ${esc(k.splitting.quote_he)}${cite(k.splitting.url, `${k.splitting.section} ל${k.splitting.he}`)}</p>`
		+ `<button class="jtool-btn" type="button" data-act="kt-waive">לוותר על היתרה ולחשב מחדש</button></div>`
		+ `<div class="${Q}-choice__opt"><p class="${Q}-choice__t">ב. לתבוע את מלוא ${esc(ktNis(c.total))} בבית משפט השלום</p><p>בסדר דין רגיל, עם האגרה של בית משפט השלום (הכלי לא מחשב אותה). ${esc(k.courts_law.other_court_he)}.${cite(k.courts_law.url, k.courts_law.other_court_section)}${lawCite(reg, reg.small_claims.magistrate_section)}</p></div>`
		+ '</div></div>';
}

const TL_TEXT = {
	event: (reg, r) => [`האירוע: ${(reg.consumer_ktanot.kinds[(r.claim || {}).kind] || {}).he || 'מה שקרה'}`, ''],
	demand: (reg) => ['נשלחה לעסק דרישה בכתב', cite(reg.consumer_ktanot.exemplary.url, reg.consumer_ktanot.exemplary.demand_section)],
	refund21: (reg) => [`סוף ${reg.consumer_ktanot.aviation.refund_days} הימים שבהם חברת התעופה הייתה צריכה להשיב את התמורה`, cite(reg.consumer_ktanot.aviation.url, `${reg.consumer_ktanot.aviation.refund_section} לחוק שירותי תעופה`)],
	filing: () => ['הגשת התביעה', ''],
	defence: (reg) => [`הנתבע מגיש כתב הגנה (${reg.small_claims.deadlines.defence_days} יום מהמסירה)`, regCite(reg, 'תקנה 4(ב)')],
	service_check: (reg) => [`לבדוק בנט המשפט שהנתבע קיבל את כתב התביעה (${reg.small_claims.deadlines.service_check_days_before} יום לפני הדיון)`, cite(reg.small_claims.service_url, 'הרשות השופטת')],
	witness: (reg) => [`לבקש זימון עד, אם צריך (${reg.small_claims.deadlines.witness_request_days_before} יום לפני הדיון)`, cite(reg.small_claims.service_url, 'הרשות השופטת')],
	plaintiff_service: (reg) => [`לא נמסר? התובע מוסר בעצמו (${reg.small_claims.deadlines.plaintiff_service_days_before} יום לפני הדיון)`, regCite(reg, 'תקנה 7(ב1)')],
	interpreter: (reg) => [`בקשה למתורגמן, אם צריך (${reg.small_claims.deadlines.interpreter_days_before} ימים לפני הדיון)`, cite(reg.small_claims.service_url, 'הרשות השופטת')],
	hearing: (reg) => ['הדיון. בלי עורך דין, אלא ברשות בית המשפט', lawCite(reg, 'סעיף 63(א)')],
	judgment_latest: (reg) => [`פסק הדין: בתום הדיון, ולכל המאוחר ${reg.consumer_ktanot.regs.judgment_max_days} ימים אחריו`, cite(reg.consumer_ktanot.regs.url, reg.consumer_ktanot.regs.judgment_section)],
	judgment: () => ['פסק הדין', ''],
	appeal: (reg, r, e) => [`סוף ${reg.consumer_ktanot.regs.appeal_days} הימים לבקשת רשות ערעור לבית המשפט המחוזי${e.cond ? ' (אם פסק הדין ניתן בדיון, במעמד הצדדים)' : ''}`, `${cite(reg.consumer_ktanot.regs.url, `${reg.consumer_ktanot.regs.appeal_section}, ${reg.consumer_ktanot.regs.count_section}`)}${cite(reg.consumer_ktanot.courts_law.url, reg.consumer_ktanot.courts_law.appeal_section)}`],
	execution: (reg, r, e) => [`לא שילמו? מכאן מבקשים את הטופס לפתיחת תיק בהוצאה לפועל (${reg.consumer_ktanot.execution.after_days} יום אחרי שהחייב קיבל את פסק הדין)${e.cond ? ' (אם קיבל אותו בדיון)' : ''}`, cite(reg.consumer_ktanot.execution.url, 'הרשות השופטת')],
	limitation: (reg, r, e) => [e.aviation ? `סוף ${e.years} שנות ההתיישנות לפי חוק שירותי תעופה` : `סוף ${e.years} שנות ההתיישנות מיום האירוע`, e.aviation ? cite(reg.consumer_ktanot.aviation.url, `${reg.consumer_ktanot.aviation.limitation_section} לחוק שירותי תעופה`) : cite(reg.small_claims.limitation_url, 'חוק ההתיישנות, סעיפים 5(1) ו-6')],
};
const tlText = (reg, r, e) => (TL_TEXT[e.code] ? TL_TEXT[e.code](reg, r, e) : [e.code, '']);

/** The case timeline, the second picture: every dated step from the event to the Execution Office on one line, numbered,
 * hearing in bold, steps that assume the judgment was given at the hearing dashed; the limitation is the line's far end. */
export function caseTrack(reg, r) {
	if (!r || !r.ok || !r.timeline || r.timeline.length < 2 || !reg.consumer_ktanot) { return ''; }
	const steps = r.timeline.filter((e) => e.code !== 'limitation');
	const lim = r.timeline.find((e) => e.code === 'limitation');
	const list = steps.length ? steps : r.timeline;
	const first = list[0].date;
	const last = list[list.length - 1].date;
	const span = Math.max(1, (Date.parse(`${last}T00:00:00Z`) - Date.parse(`${first}T00:00:00Z`)) / 86400000);
	const pos = (d) => Math.min(100, Math.max(0, Math.round(((Date.parse(`${d}T00:00:00Z`) - Date.parse(`${first}T00:00:00Z`)) / 86400000 / span) * 1000) / 10));
	let prev = -100;
	let lvl = 0;
	const dots = list.map((e, n) => {
		const x = pos(e.date);
		lvl = x - prev < 7 ? (lvl + 1) % 3 : 0;
		prev = x;
		return `<span class="${Q}-node ${Q}-node--${e.code}${e.cond ? ` ${Q}-node--cond` : ''}${e.past ? ` ${Q}-node--past` : ''}${lvl ? ` ${Q}-node--l${lvl}` : ''}" style="inset-inline-start:${x}%"><i>${n + 1}</i></span>`;
	}).join('');
	const today = r.on >= first && r.on <= last ? `<span class="${Q}-today" style="inset-inline-start:${pos(r.on)}%"><b>היום</b></span>` : '';
	const fill = r.on <= first ? 0 : r.on >= last ? 100 : pos(r.on);
	const legend = list.map((e, n) => { const [what, src] = tlText(reg, r, e); return `<li class="${Q}-lg${e.cond ? ` ${Q}-lg--cond` : ''}${e.past ? ` ${Q}-lg--past` : ''}${e.code === 'hearing' ? ` ${Q}-lg--hearing` : ''}"><i aria-hidden="true">${n + 1}</i><bdi>${isoToHe(e.date)}</bdi> <span>${esc(what)}</span>${src}</li>`; }).join('');
	const sum = list.map((e) => `${isoToHe(e.date)}: ${tlText(reg, r, e)[0]}`).join('. ');
	return `<figure class="${Q}-track"><figcaption class="${Q}-track__h">ציר התיק: מ-${isoToHe(first)} עד ${isoToHe(last)}</figcaption>`
		+ `<p class="jtool-visually-hidden">${esc(sum)}${lim ? `. ${esc(tlText(reg, r, lim)[0])}: ${isoToHe(lim.date)}` : ''}.</p>`
		+ `<div class="${Q}-line" aria-hidden="true"><span class="${Q}-line__fill" style="inline-size:${fill}%"></span>${dots}${today}</div>`
		+ `<ol class="${Q}-legend" aria-hidden="true">${legend}</ol>`
		+ (lim ? `<p class="${Q}-track__end">${esc(tlText(reg, r, lim)[0])}: <bdi>${isoToHe(lim.date)}</bdi>${tlText(reg, r, lim)[1]}</p>` : '')
		+ '</figure>';
}

/** The scenario for the simulation: computed facts only, never a name, an ID, an address or a business name. */
export function aiBrief(reg, r) {
	if (!r || !r.ok) { return ''; }
	const q = 'השאלה לתרגול: הדיון בבית המשפט לתביעות קטנות. איך מציגים בקצרה את מה שקרה ואת המסמכים, ואיך עונים לשופט או לשופטת על טענות הצד השני ועל חישוב הסכום?';
	if (r.mode === 'fee') {
		return `תביעה קטנה של ${ktNis(r.amount)}. האגרה ${ktNis(r.fee)} לפי תקנה 6(א) לתקנות שיפוט בתביעות קטנות: 1% מהסכום, מעוגל כלפי מעלה לכפולה של 5 ₪ ולא פחות מ-50 ₪. התקרה ${ktNis(r.ceiling)} מ-${isoToHe(r.ceilingFrom)}. ${q}`;
	}
	if (!r.claim) {
		return `תביעה קטנה של ${ktNis(r.amount)}, מוגשת בידי ${PLAINTIFFS[r.plaintiff]}. ${verdictSentence(r)} ${q}`;
	}
	const c = r.claim;
	const heads = c.heads.map((h) => `${HEAD_SHORT[h.code]} ${ktNis(h.amount)}${h.code === 'comp' && c.par ? ` לפי סעיף ${ktParLabel(reg, c.par)}` : ''}`).join(', ');
	const where = c.over === null ? '' : c.waived ? `, אחרי ויתור על ${ktNis(c.waived)} שמעל התקרה` : c.over ? `, ${ktNis(c.overBy)} מעל התקרה של ${ktNis(r.ceiling)}` : `, מתחת לתקרה של ${ktNis(r.ceiling)}`;
	const feeText = c.over && !c.waive ? '' : ` האגרה ${ktNis(c.fee)}.`;
	return `תביעה קטנה נגד עסק: ${KIND_SHORT[c.kind]}${c.passengers ? `, ${c.passengers} נוסעים` : ''}. ראשי התביעה: ${heads}. הסכום הנתבע ${ktNis(c.claimed)}${where}.${feeText}${c.demand ? ' לפני התביעה נשלחה לעסק דרישה בכתב.' : ''} ${q}`;
}

/** The share link of this tool, for its siblings: '/small-claims-court-israel/#s=<state>' (the fee page for mode 'fee'). */
export function stateLink(reg, input) {
	return `${input && input.mode === 'fee' ? FEE_PAGE : PAGE}#s=${stateOf(input || {})}`;
}

/**
 * Links out to the sibling instruments, with the reader's numbers by THEIR keys (read from their worktrees on 22.10.2026
 * 22:20): the flight tool (tisa-ui.js KEYS: f the flight day, p passengers, r the ticket price, q the written demand; its
 * inputOf needs f), the cancellation tool (bitul-ui.js KEYS: d the deal day, x the cancellation notice; its inputOf needs d)
 * and the consumer-rights hub (pitzui-ui.js KEYS: y the case, a the price, G the demand, A the s.31A amount, O the costs;
 * its inputOf needs y). The event day goes only where the sibling reads it as the same day (the flight, the deal).
 */
export function siblingLinks(reg, r) {
	if (!r || !r.ok || !r.claim) { return []; }
	const c = r.claim;
	const out = [];
	const head = (code) => (c.heads.find((h) => h.code === code) || {}).amount || '';
	const ev = (r.timeline.find((e) => e.code === 'event') || {}).date || '';
	if (c.kind === 'flt') {
		const st = ev ? encodeState({ f: ev, p: c.passengers || '', r: head('price'), q: c.demand || '' }) : '';
		out.push({ path: `${KT_TISA}${st ? `#s=${st}` : ''}`, he: c.heads.some((h) => h.code === 'flight') ? 'בדיקת פיצוי הטיסה לפי חוק שירותי תעופה' : 'לחשב את הפיצוי לטיסה לפי חוק שירותי תעופה' });
	}
	if (c.kind === 'ref' || c.heads.some((h) => h.code === 'fee')) {
		const st = ev && c.kind === 'ref' ? encodeState({ d: ev, x: c.demand || '' }) : '';
		out.push({ path: `${KT_BITUL}${st ? `#s=${st}` : ''}`, he: 'האם הביטול היה כדין, ומה מותר לנכות' });
	}
	if (c.kind !== 'flt') {
		const PZ_CASE = { def: 'd', sub: 's', ref: 'r', sup: 'l', prc: 'p' };
		const cost = Math.round(((Number(head('repair')) || 0) + (Number(head('other')) || 0)) * 100) / 100;
		const st = PZ_CASE[c.kind] ? encodeState({ y: PZ_CASE[c.kind], a: head('price'), G: c.demand || '', A: head('comp'), O: cost || '' }) : '';
		out.push({ path: `${KT_PITZUI}${st ? `#s=${st}` : ''}`, he: c.heads.some((h) => h.code === 'comp') ? 'מה החוק נותן במקרה כזה, ופיצויים ללא הוכחת נזק' : 'מה החוק נותן במקרה כזה, לפני שתובעים' });
	}
	return out;
}

/** The "what to do now" list: the official route first, then pages of this site that fit the result. */
export function nextActions(reg, r) {
	const sc = reg.small_claims;
	const k = reg.consumer_ktanot;
	const official = [{ he: 'הגשת התביעה באתר הרשות השופטת (מהמחשב)', url: sc.service_url }];
	if (k) {
		official.push({ he: 'איזה בית משפט לתביעות קטנות: הקובץ של הרשות השופטת', url: k.judiciary.court_finder_url });
		if (r && r.ok && r.timeline && r.timeline.some((e) => e.code === 'execution')) { official.push({ he: 'אחרי פסק הדין: קבלת הכסף דרך ההוצאה לפועל', url: k.execution.url }); }
		official.push({ he: 'פטור מאגרה בשל חוסר יכולת כלכלית', url: k.judiciary.exempt_url });
	}
	const links = [];
	links.push({ path: '/demand-letter-generator/', he: 'מכתב דרישה לעסק לפני התביעה' });
	for (const s of siblingLinks(reg, r)) { links.push(s); }
	links.push({ path: '/debt-collection-israel/', he: 'פסק הדין לא שולם: גבייה בהוצאה לפועל' });
	return { official, links: links.slice(0, 4) };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state ${r.outOfScope ? 'jtool-state--info' : 'jtool-state--danger'}">${r.outOfScope ? 'מחוץ לתחום של הכלי' : '✕ צריך לתקן את הקלט'}</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	if (r.mode === 'fee') {
		const state = r.ceilingUnknown ? '<p class="jtool-state jtool-state--warn">! התקרה החדשה עוד לא נטענה לכלי</p>'
			: r.overCeiling ? `<p class="jtool-state jtool-state--warn">! מעל התקרה: ${money(r.ceiling, 0)} ₪ מ-${isoToHe(r.ceilingFrom)}</p>` : `<p class="jtool-state jtool-state--info">✓ עד התקרה: ${money(r.ceiling, 0)} ₪ מ-${isoToHe(r.ceilingFrom)}</p>`;
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}אגרה על ${esc(money(r.amount, r.amount % 1 ? 2 : 0))} ₪</p>`
			+ `<strong class="jtool-verdict__figure">${ils(r.fee, 0)}</strong><p class="jtool-verdict__sentence">${esc(verdictSentence(r))}</p></div>`
			+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
			+ `<details class="jtool-path" open><summary>איך חישבנו</summary><ol>${feeLines(reg, r).map((l) => `<li>${l}</li>`).join('')}</ol></details>`;
	}
	const states = { yes: '<p class="jtool-state jtool-state--ok">✓ כן, אפשר לתבוע בתביעות קטנות</p>', no: '<p class="jtool-state jtool-state--danger">✕ לא בתביעות קטנות</p>', depends: '<p class="jtool-state jtool-state--warn">! תלוי בבית המשפט</p>' };
	const icon = { true: ['yes', '✓', 'מתקיים'], false: ['no', '✕', 'לא מתקיים'], null: ['unk', '?', 'תלוי'] };
	const conds = r.conds.map((c) => {
		const [cls, mark, word] = icon[String(c.met)];
		return `<li class="jtool-cond jtool-cond--${cls}"><span class="jtool-cond__mark" aria-hidden="true">${mark}</span><span><span class="jtool-visually-hidden">${word}: </span>${esc(COND_TEXT[c.code](r))}${lawCite(reg, COND_SEC[c.sec])}</span></li>`;
	}).join('');
	const figure = r.verdict === 'no' ? '<strong class="jtool-verdict__figure">לא מתאים</strong>' : `<strong class="jtool-verdict__figure">אגרה: ${ils(r.fee, 0)}</strong>`;
	const flagLi = (f) => `<li${f.code && f.code.indexOf('kt_') === 0 ? ` class="${Q}-flag"` : ''}>${esc(f.he)}${f.section && f.url ? cite(f.url, f.section) : ''}</li>`;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${states[r.verdict]}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}תביעה של ${esc(money(r.amount, r.amount % 1 ? 2 : 0))} ₪ מ${esc(PLAINTIFFS[r.plaintiff])}</p>${figure}`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(r))}</p>`
		+ `<p class="jtool-scope">הבדיקה לפי הדין, לא לפי סיכויי התביעה. אין כאן אחוזי הצלחה: מה שקובע הוא המסמכים והעדים שלכם.</p></div>`
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map(flagLi).join('')}</ul>` : '')
		+ ledger(reg, r)
		+ choiceBox(reg, r)
		+ `<details class="jtool-path" open><summary>מפת ההתאמה</summary><ul class="jtool-conds">${conds}</ul></details>`
		+ caseTrack(reg, r)
		+ ktBriefBlock(reg, r)
		+ ktNextBlock(reg, r);
}

function ktBriefBlock(reg, r) {
	if (!reg.consumer_ktanot) { return ''; }
	const brief = aiBrief(reg, r);
	return brief ? `<div class="${Q}-brief"><h4>התרחיש לסימולציה</h4><p data-${Q}-brief>${esc(brief)}</p><a class="jtool-btn" href="${KT_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את הדיון בתביעה הקטנה</a></div>` : '';
}

function ktNextBlock(reg, r) {
	if (!reg.consumer_ktanot) { return ''; }
	const na = nextActions(reg, r);
	return `<div class="${Q}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

const DATE_TEXT = {
	limitation: (reg) => [`סוף ${reg.small_claims.limitation_years} שנות ההתיישנות מיום האירוע`, cite(reg.small_claims.limitation_url, 'חוק ההתיישנות, סעיפים 5(1) ו-6')],
	defence: (reg) => [`הנתבע מגיש כתב הגנה (${reg.small_claims.deadlines.defence_days} יום מהמסירה)`, regCite(reg, 'תקנה 4(ב)')],
	service_check: (reg) => [`לבדוק בנט המשפט שהנתבע קיבל את כתב התביעה (${reg.small_claims.deadlines.service_check_days_before} יום לפני הדיון)`, cite(reg.small_claims.service_url, 'הרשות השופטת')],
	witness: (reg) => [`לבקש זימון עד, אם צריך (${reg.small_claims.deadlines.witness_request_days_before} יום לפני הדיון)`, cite(reg.small_claims.service_url, 'הרשות השופטת')],
	plaintiff_service: (reg) => [`לא נמסר? התובע מוסר בעצמו (${reg.small_claims.deadlines.plaintiff_service_days_before} יום לפני הדיון)`, regCite(reg, 'תקנה 7(ב1)')],
	interpreter: (reg) => [`בקשה למתורגמן, אם צריך (${reg.small_claims.deadlines.interpreter_days_before} ימים לפני הדיון)`, cite(reg.small_claims.service_url, 'הרשות השופטת')],
	hearing: (reg) => ['הדיון. בלי עורך דין, אלא ברשות בית המשפט', lawCite(reg, 'סעיף 63(א)')],
};

/** The statement-of-claim outline from the heads (reg. 3): the parties as placeholders, the facts in order, the heads with
 * their amounts, the legal grounds by section, the remedies, the documents, the witnesses, the declaration. */
export function ktClaimText(reg, r) {
	const sc = reg.small_claims;
	const k = reg.consumer_ktanot;
	const c = r.claim;
	const kind = k.kinds[c.kind] || k.kinds.oth;
	const law = 'לחוק הגנת הצרכן, התשמ"א-1981';
	const lines = ['בבית משפט לתביעות קטנות ב[עיר]', ''];
	const n = Math.max(1, c.passengers || 1);
	for (let x = 1; x <= n; x += 1) { lines.push(`התובע/ת${n > 1 ? ` ${x}` : ''}: [שם מלא], ת"ז [מספר], [כתובת מגורים], [טלפון נייד], [דואר אלקטרוני]`); }
	lines.push('הנתבע/ת: [שם העסק], [מספר חברה או עוסק], [כתובת העסק], [טלפון ודואר אלקטרוני, אם ידועים]');
	lines.push(`(${k.judiciary.osek_he}.)`);
	lines.push(`הסעד המבוקש: תשלום ${money(c.claimed)} ₪ והוצאות המשפט`);
	lines.push('', 'כתב תביעה');
	lines.push('1. מקום המעשה או המחדל: [עיר, כתובת העסק, או האתר שבו נעשתה העסקה]');
	lines.push(`2. הסעד המבוקש: תשלום ${money(c.claimed)} ₪, לפי ראשי התביעה:`);
	c.heads.forEach((h, i) => {
		const lbl = h.code === 'comp' ? `פיצויים לדוגמה לפי סעיף ${ktParLabel(reg, c.par) || '31א(א)([פסקה])'} ${law}` : h.code === 'flight' ? `פיצוי כספי לפי סעיף 6(א)(3) לחוק שירותי תעופה${c.passengers ? `, ל-${c.passengers} נוסעים` : ''}` : k.heads[h.code].he;
		lines.push(`   2.${i + 1} ${lbl}: ${money(h.amount)} ₪`);
	});
	lines.push(`   סך הכול: ${money(c.total)} ₪`);
	if (c.waived) { lines.push(`   התובע/ת מוותר/ת על ${money(c.waived)} ₪ שמעל תקרת בית המשפט לתביעות קטנות, ותובע/ת ${money(c.claimed)} ₪.`); }
	lines.push('   וכן הוצאות המשפט, לרבות האגרה ששולמה, לפי שיקול דעת בית המשפט.');
	lines.push('3. נימוקי התביעה, לפי סדר האירועים, עם תאריכים ומקומות:');
	const facts = (k.documents[kind.docs === 'aviation' ? 'facts_aviation' : 'facts_products'] || []).slice(0, 3);
	let f = 1;
	facts.forEach((t) => { lines.push(`   3.${f} [${t}]`); f += 1; });
	const ev = r.timeline.find((e) => e.code === 'event');
	lines.push(`   3.${f} ${ev ? isoToHe(ev.date) : '[תאריך]'} - [מה קרה: ${kind.he}]`); f += 1;
	if (c.demand) { lines.push(`   3.${f} ${isoToHe(c.demand)} - נשלחה לנתבע/ת דרישה בכתב (העתק מצורף)`); f += 1; }
	lines.push(`   3.${f} [מה ענה העסק, אם ענה, ומה נעשה מאז]`); f += 1;
	lines.push(`   3.${f} איך חושב הסכום: ראו סעיף 2 ואת הקבלות המצורפות.`);
	lines.push('4. העילות המשפטיות:');
	let g = 1;
	kind.grounds.forEach((gr) => { lines.push(`   4.${g} ${gr.section}: ${gr.he}.`); g += 1; });
	if (c.comp) {
		const p = k.exemplary.paragraphs.find((x) => x.code === c.par);
		lines.push(`   4.${g} סעיף ${p ? p.label : '31א(א)'} ${law}: ${p ? p.he : '[ההוראה שהופרה]'}. בית המשפט רשאי לפסוק פיצויים שאינם תלויים בנזק, עד ${money(k.exemplary.max, 0)} ₪ (${k.exemplary.aggravated_section}: עד ${money(k.exemplary.aggravated_max, 0)} ₪ בהפרה חוזרת, נמשכת או בנסיבות מחמירות).${c.demand ? ` בקשה בכתב נשלחה ב-${isoToHe(c.demand)} (${k.exemplary.demand_section}).` : ` לפני ההגשה צריך לשלוח בקשה בכתב (${k.exemplary.demand_section}).`}`);
		g += 1;
	}
	lines.push('5. המסמכים שאני מבקש/ת להסתמך עליהם (מצורפים):');
	ktDocs(reg, r).forEach((d, i) => { lines.push(`   5.${i + 1} ${d}`); });
	lines.push('6. העדים: [שם מלא, טלפון נייד, דואר אלקטרוני]');
	lines.push('7. העדפה לדיון: [באולם / בהיוועדות חזותית (תקנה 13(ב)) / הכרעה על יסוד הכתב (תקנה 13(ג))]');
	lines.push(`8. מספר התביעות הקטנות שהגשתי בשנה האחרונה: ${r.claims}`);
	lines.push('', `הצהרה: כל האמור בכתב התביעה אמת, או למיטב ידיעתי, ומקור ידיעתי: [ ] (${k.regs.attach_section}(2))`, '[חתימה]   [תאריך]', '');
	lines.push(`(שלד לפי תקנה 3 לתקנות שיפוט בתביעות קטנות (סדרי דין), התשל"ז-1976. גוף כתב התביעה: עד ${sc.claim_body_max_pages} עמודים (תקנה 3(ה)). נבנה ב-jus-tice.co.il, מידע כללי ולא ייעוץ משפטי.)`);
	return lines.join('\n');
}

export function claimText(reg, r) {
	if (r && r.claim && reg.consumer_ktanot && r.timeline) { return ktClaimText(reg, r); }
	const sc = reg.small_claims;
	const relief = r.remedy === 'product' ? `[החלפת המוצר / תיקונו / ביטול העסקה], בשווי ${money(r.amount, r.amount % 1 ? 2 : 0)} ₪` : `תשלום ${money(r.amount, r.amount % 1 ? 2 : 0)} ₪`;
	return [
		'בבית משפט לתביעות קטנות ב[עיר]',
		'',
		'התובע/ת: [שם מלא], ת"ז [מספר], [כתובת מגורים], [טלפון נייד], [דואר אלקטרוני]',
		'הנתבע/ת: [שם], ת"ז או מספר תאגיד [אם ידוע], [כתובת מגורים או עסק], [טלפון ודואר אלקטרוני, אם ידועים]',
		`הסעד המבוקש: ${relief}`,
		'',
		'כתב תביעה',
		'1. מקום המעשה או המחדל: [עיר, כתובת]',
		`2. הסעד המבוקש: ${relief}. [איך הגעתי לסכום]`,
		'3. נימוקי התביעה, לפי סדר האירועים, עם תאריכים ומקומות:',
		'   3.1 [תאריך] - [מה קרה]',
		'   3.2 [תאריך] - [מה קרה]',
		'4. המסמכים שאני מבקש/ת להסתמך עליהם (מצורפים): [חוזה, קבלות, התכתבות, תמונות]',
		'5. העדים: [שם מלא, טלפון נייד, דואר אלקטרוני]',
		'6. העדפה לדיון: [באולם / בהיוועדות חזותית / הכרעה על יסוד הכתב]',
		`7. מספר התביעות הקטנות שהגשתי בשנה האחרונה: ${r.claims}`,
		'',
		'הצהרה: כל האמור בכתב התביעה אמת, או למיטב ידיעתי, ומקור ידיעתי: [ ]',
		'[חתימה]   [תאריך]',
		'',
		`(שלד לפי תקנה 3 לתקנות שיפוט בתביעות קטנות (סדרי דין), התשל"ז-1976. גוף כתב התביעה: עד ${sc.claim_body_max_pages} עמודים. נבנה ב-jus-tice.co.il, מידע כללי ולא ייעוץ משפטי.)`,
	].join('\n');
}

/** The documents to attach, by kind (the Courts Authority's recommendations) and by what the claim asks. */
export function ktDocs(reg, r) {
	const k = reg.consumer_ktanot;
	if (!k) { return []; }
	const c = r && r.claim;
	const kind = c ? (k.kinds[c.kind] || k.kinds.oth) : k.kinds.oth;
	const list = (k.documents[kind.docs] || k.documents.other).slice();
	if (c && c.demand) { list.push('העתק הדרישה בכתב ששלחתם לעסק, ואישור השליחה'); }
	if (c && c.heads.some((h) => h.code === 'repair' || h.code === 'other')) { list.push('קבלות או הצעות מחיר לכל הוצאה ולתיקון'); }
	if (c && c.passengers > 1) { list.push('פרטי כל נוסע שתובע: שם, תעודת זהות, כרטיס הטיסה שלו'); }
	list.push('ההצהרה החתומה שבסוף כתב התביעה');
	return list;
}

function ktDocsBlock(reg, r) {
	const k = reg.consumer_ktanot;
	if (!k || !r.ok || r.verdict === 'no') { return ''; }
	const docs = ktDocs(reg, r);
	return `<div class="jtool-tablewrap ${Q}-docs"><div class="jtool-tablewrap__head"><h3 id="${Q}-docs-h">המסמכים לצרף</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ul class="${Q}-check">${docs.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>`
		+ `<ul class="jtool-notes"><li><strong>חובה לצרף:</strong> ${esc(k.regs.attach_he.join('; '))}.${cite(k.regs.url, k.regs.attach_section)} ${esc(k.regs.late_doc_he)}.</li>`
		+ `<li><strong>מספר הזהות של הנתבע:</strong> ${esc(k.documents.id_he)}.${cite(k.documents.id_url, 'הרשות השופטת')}</li>`
		+ `<li>${esc(k.documents.media_he)}.${cite(k.documents.url, 'הרשות השופטת, המלצות להגשה')}</li></ul></div>`;
}

/** Every dated step, with its rule: the timeline table (replaces the wave-1 dates table when the timeline exists). */
function ktTimelineTable(reg, r) {
	const sc = reg.small_claims;
	const rows = r.timeline.map((e) => { const [what, src] = tlText(reg, r, e); return `<tr${e.past ? ' class="jtool-muted"' : ''}><td data-th="עד תאריך"><bdi>${isoToHe(e.date)}</bdi>${e.past ? ' (עבר)' : e.soon ? ' (בקרוב)' : ''}</td><td data-th="מה עושים">${esc(what)}</td><td data-th="הכלל">${src}</td></tr>`; }).join('');
	return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שלכם</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה עושים</th><th scope="col">הכלל</th></tr></thead><tbody>${rows}</tbody>`
		+ `<caption>החלטה שניתנה בהיעדרכם: בקשת ביטול תוך ${sc.deadlines.set_aside_days} יום (תקנה 12). ${esc(reg.consumer_ktanot.regs.count_he)} (${esc(reg.consumer_ktanot.regs.count_section)}). חישוב כללי, לא ייעוץ משפטי.</caption></table></div></div>`;
}

/** What changed and when: only dated values of official texts (notices, consolidated versions, the Authority's pages). */
export function changesTable(reg) {
	const k = reg.consumer_ktanot;
	if (!k) { return ''; }
	const rows = k.changes.slice().sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${Q}-chg-h" tabindex="0"><table class="jtool-table ${Q}-chg"><thead><tr><th scope="col">מתי</th><th scope="col">מה נקבע או עודכן</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתי"><bdi>${isoToHe(x.from)}</bdi></td><td data-th="מה נקבע או עודכן">${esc(x.he)}</td><td data-th="מקור">${cite(x.url, x.src_he)}</td></tr>`).join('')
		+ `</tbody><caption>רק ערכים שפורסמו בנוסח רשמי, עם התאריך שלהם. ${esc(k.update_rule_he)}.</caption></table></div>`;
}

/** The one-page print: the inputs, the result, the ledger, the dates, the sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r || !r.ok || !reg.consumer_ktanot) { return ''; }
	const k = reg.consumer_ktanot;
	const sc = reg.small_claims;
	const c = r.claim;
	const steps = (r.timeline || []).map((e) => `${isoToHe(e.date)} ${tlText(reg, r, e)[0]}`).join('; ');
	return '<h3>תביעה קטנה: סיכום</h3>'
		+ `<p><strong>הנתונים:</strong> ${c ? `${esc(KIND_SHORT[c.kind])}; ${c.heads.map((h) => `${esc(HEAD_SHORT[h.code])} ${esc(ktNis(h.amount))}`).join(', ')}${c.passengers ? `; ${c.passengers} נוסעים` : ''}` : `סכום ${esc(ktNis(r.amount))}`}; ${esc(PLAINTIFFS[r.plaintiff])}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(r))}${c ? ` סך ראשי התביעה ${esc(ktNis(c.total))}${c.waived ? `, ויתור על ${esc(ktNis(c.waived))}` : ''}; נתבעים ${esc(ktNis(c.claimed))}.` : ''}</p>`
		+ `<p><strong>האגרה:</strong> 1% מהסכום, מעוגל כלפי מעלה לכפולה של ${sc.fee.round_up_to} ₪, לפחות ${sc.fee.min} ₪ (${esc(sc.fee.section)}): ${esc(ktNis(r.fee))}.</p>`
		+ (steps ? `<p><strong>המועדים:</strong> ${esc(steps)}.</p>` : '')
		+ `<p><strong>מקורות:</strong> ${esc(k.regs.he)}, נוסח ל-${isoToHe(k.regs.current_to)}; ${esc(k.courts_law.he)}, נוסח ל-${isoToHe(k.courts_law.current_to)}; ${esc(k.exemplary.he)}, נוסח ל-${isoToHe(k.exemplary.current_to)}; ${esc(sc.ceiling[sc.ceiling.length - 1].source_he)}; הרשות השופטת, דף ההגשה (עודכן ${isoToHe(k.judiciary.service_updated)}). נבדק ${isoToHe(k.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, compareR, opts = {}) {
	if (!r.ok) { return ''; }
	const sc = reg.small_claims;
	if (r.mode === 'fee') { return ''; }
	let out = r.verdict === 'no'
		? `<p class="jtool-scope" id="${P}-fee-h" tabindex="-1">אגרת תביעות קטנות לא חלה על תביעה שלא מוגשת שם. ${r.forum === 'district' ? 'בבית המשפט המחוזי' : 'בבית משפט השלום'} האגרה אחרת, והכלי לא מחשב אותה.</p>`
		: `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-fee-h">האגרה, שורה אחרי שורה</h3></div><ol class="jtool-steps">${feeLines(reg, r).map((l) => `<li>${l}</li>`).join('')}</ol></div>`;
	if (r.timeline && r.timeline.length && reg.consumer_ktanot) {
		out += ktTimelineTable(reg, r);
	} else if (r.dates.length) {
		const rows = r.dates.map((d) => { const [what, src] = DATE_TEXT[d.rule](reg); return `<tr${d.past ? ' class="jtool-muted"' : ''}><td data-th="עד תאריך"><bdi>${isoToHe(d.date)}</bdi>${d.past ? ' (עבר)' : d.soon ? ' (בקרוב)' : ''}</td><td data-th="מה עושים">${esc(what)}</td><td data-th="הכלל">${src}</td></tr>`; }).join('');
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שלכם</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה עושים</th><th scope="col">הכלל</th></tr></thead><tbody>${rows}</tbody>`
			+ `<caption>החלטה שניתנה בהיעדרכם: בקשת ביטול תוך ${sc.deadlines.set_aside_days} יום (תקנה 12). ערעור: רק ברשות בית המשפט המחוזי (סעיף 64). חישוב כללי, לא ייעוץ משפטי.</caption></table></div></div>`;
	} else {
		out += `<p class="jtool-scope" id="${P}-dl-h" tabindex="-1">רוצים את המועדים? פתחו "תאריכים" בטופס והזינו את יום האירוע ומועד הדיון.</p>`;
	}
	if (compareR && compareR.ok && r.verdict !== 'no') {
		out += `<div class="jtool-compare" data-compare><h3>מה אם: סכום אחר</h3>`
			+ `<div class="jtool-field" style="margin-bottom:12px"><label class="jtool-label" for="${P}-cmp">סכום לבדיקה בעמודה ב'</label><div class="jtool-input jtool-input--money"><input id="${P}-cmp" type="text" inputmode="decimal" autocomplete="off" data-compare-amount value="${esc(money(compareR.amount, compareR.amount % 1 ? 2 : 0))}"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div></div>`
			+ `<div data-compare-out>${renderCompareOut(r, compareR)}</div></div>`;
	}
	if (r.verdict !== 'no') {
		out += `<div class="jtool-tablewrap" data-claim><div class="jtool-tablewrap__head"><h3 id="${P}-claim-h">שלד כתב התביעה (לפי תקנה 3)</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="claim-copy">העתקת השלד</button><button class="jtool-btn" type="button" data-act="print">הדפסה</button></div></div>`
			+ `<pre class="jtool-letter">${esc(claimText(reg, r))}</pre>`
			+ `<ul class="jtool-notes"><li><strong>לאן מגישים:</strong> לבית המשפט באזור מגורי הנתבע או עסקו, או באזור שבו קרה האירוע. בתביעה על פרסום או מסחר באינטרנט: גם באזור המגורים או העסק שלכם${regCite(reg, 'תקנה 2')}</li>`
			+ `<li><strong>בהגשה מקוונת:</strong> מהמחשב בלבד, קובצי PDF עד 70 מגה, עד ${sc.online_max_plaintiffs} תובעים ו-${sc.online_max_defendants} נתבעים. <a href="${esc(sc.service_url)}" target="_blank" rel="noopener">הגשה באתר הרשות השופטת</a></li>`
			+ (reg.consumer_ktanot ? `<li><strong>האגרה והוצאות:</strong> ${esc(reg.consumer_ktanot.costs_he)}.${cite(reg.consumer_ktanot.regs.url, reg.consumer_ktanot.regs.powers_section)}</li>` : '')
			+ '</ul></div>';
	}
	if (reg.consumer_ktanot) {
		out += ktDocsBlock(reg, r)
			+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${Q}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
			+ `<div class="${Q}-print">${printSummary(reg, r, opts.printedOn || reg.consumer_ktanot.checked_on)}</div>`;
	}
	return out;
}

/** Column A vs column B of the what-if; re-rendered alone, so the amount field keeps its focus. */
export function renderCompareOut(r, compareR) {
	if (!compareR || !compareR.ok) { return `<p class="jtool-delta" aria-live="polite">${compareR && compareR.errors ? esc(compareR.errors.map((e) => e.he).join(' ')) : ''}</p>`; }
	const delta = Math.round((compareR.fee - r.fee) * 100) / 100;
	return `<div class="jtool-compare__grid"><div class="jtool-compare__col"><p>א. ${esc(money(r.amount, r.amount % 1 ? 2 : 0))} ₪</p><strong>${ils(r.fee, 0)}</strong></div>`
		+ `<div class="jtool-compare__col jtool-compare__col--b"><p>ב. ${esc(money(compareR.amount, compareR.amount % 1 ? 2 : 0))} ₪${compareR.overCeiling ? ', מעל התקרה' : ''}</p><strong>${compareR.overCeiling ? 'לא תביעה קטנה' : ils(compareR.fee, 0)}</strong></div></div>`
		+ `<p class="jtool-delta" aria-live="polite">${compareR.overCeiling ? `מעל ${money(compareR.ceiling, 0)} ₪ מגישים ${forumText(compareR)}.` : `ההפרש באגרה: ${ils(Math.abs(delta), 0)}.`}</p>`;
}

export function compareFor(reg, input) {
	if (input.mode === 'fee') { return null; }
	const ceil = reg.small_claims.ceiling[reg.small_claims.ceiling.length - 1].amount;
	// With claim heads, column A is the heads' total (what is claimed); column B is a plain amount, so the heads are dropped.
	const a = ktHasHeads(input) ? compute(reg, Object.assign({}, input, { on: reg.checked_on })).amount : Number(input.amount);
	const b = Number(input.compareAmount) > 0 ? Number(input.compareAmount) : (a === ceil ? Math.round(ceil / 2) : ceil);
	return Object.assign({}, input, { amount: b, heads: null });
}

/** Page section: the fee for typical amounts, from the same engine (and what a 1%-without-rounding calculator shows). */
export function feeTable(reg) {
	const rows = FEE_EXAMPLES.map((a) => {
		const f = fee(reg.small_claims, a);
		const naive = Math.max(Math.round(a * 0.01), reg.small_claims.fee.min);
		return `<tr><td data-th="סכום התביעה">${ils(a, 0)}</td><td data-th="1% מהסכום"><bdi>${money(f.onePct)}</bdi></td><td data-th="האגרה לפי תקנה 6(א)">${ils(f.fee, 0)}${f.floor ? ' (מינימום)' : ''}</td><td data-th="1% בלי עיגול">${ils(naive, 0)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>האגרה לפי סכום התביעה, מאותו מנוע. מחשבון שלא מעגל כלפי מעלה מציג פחות מהנדרש.</caption><thead><tr><th scope="col">סכום התביעה</th><th scope="col">1% מהסכום</th><th scope="col">האגרה לפי תקנה 6(א)</th><th scope="col">1% בלי עיגול</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead name="tviot-ktanot"], both modes): the example's
 * figure, or the reader's once they change anything, and a jump to the form. Same markup on the server and in the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? (r && r.mode === 'fee' ? 'לחשב אגרה על הסכום שלכם' : 'לבנות את התביעה שלכם') : 'לשנות את הנתונים'}</a>`;
	if (!r || !r.ok) {
		return `<p class="jtool-lead__label">תביעה קטנה</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r && r.errors ? r.errors.map((e) => e.he).join(' ') : '')}</p>${go}`;
	}
	const pre = opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: ';
	const f = reg.small_claims.fee;
	if (r.mode === 'fee') {
		const unit = r.overCeiling ? `מעל התקרה של ${ktNis(r.ceiling)}: לא תביעה קטנה` : `אגרה על תביעה של ${ktNis(r.amount)}`;
		const line = `1% הוא ${money(r.onePct)} ₪, מעוגל כלפי מעלה לכפולה של ${f.round_up_to} ₪ ולא פחות מ-${f.min} ₪ (${f.section} לתקנות שיפוט בתביעות קטנות). התקרה ${ktNis(r.ceiling)} מ-${isoToHe(r.ceilingFrom)}.`;
		return `<p class="jtool-lead__label">${esc(`${pre}אגרת תביעה קטנה`)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure"><bdi>${money(r.fee, 0)}</bdi> ₪</strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
	}
	const c = r.claim;
	const hearing = (r.timeline || []).find((e) => e.code === 'hearing');
	const appeal = (r.timeline || []).find((e) => e.code === 'appeal');
	const lim = (r.timeline || []).find((e) => e.code === 'limitation');
	const dates = `${hearing ? ` הדיון ${isoToHe(hearing.date)}.` : ''}${appeal ? ` רשות ערעור עד ${isoToHe(appeal.date)}${appeal.cond ? ' אם פסק הדין ניתן בדיון' : ''}.` : ''}${lim ? ` התיישנות ${isoToHe(lim.date)}.` : ''}`;
	if (c) {
		const label = `${pre}${KIND_SHORT[c.kind]}, ${c.heads.length === 1 ? 'ראש תביעה אחד' : `${c.heads.length} ראשי תביעה`}`;
		const unit = c.over === null ? 'סכום התביעה; התקרה החדשה עוד לא נטענה' : c.over && !c.waive ? `מעל התקרה ב-${ktNis(c.overBy)}: לוותר על היתרה או בית משפט השלום` : c.waived ? `נתבעים ${ktNis(c.claimed)} אחרי ויתור על ${ktNis(c.waived)}` : `סכום התביעה, מתחת לתקרה של ${ktNis(r.ceiling)}`;
		const line = `${c.over && !c.waive ? `האגרה אם מוותרים: ${ktNis(c.feeIfWaived)}.` : `האגרה: ${ktNis(c.fee)} (${f.section}).`}${dates}`;
		return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure"><bdi>${money(c.total, c.total % 1 ? 2 : 0)}</bdi> ₪</strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(line.trim())}</p>${go}`;
	}
	const unit = r.verdict === 'no' ? 'לא בתביעות קטנות' : `אגרה על תביעה של ${ktNis(r.amount)}`;
	return `<p class="jtool-lead__label">${esc(`${pre}תביעה קטנה`)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${r.verdict === 'no' ? '—' : `<bdi>${money(r.fee, 0)}</bdi> ₪`}</strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(`${verdictSentence(r)}${dates}`)}</p>${go}`;
}

export function snapshot(reg) {
	const on = reg.checked_on;
	const ex = reg.consumer_ktanot ? EXAMPLE_CLAIM : EXAMPLE;
	const r = compute(reg, Object.assign({}, ex, { on }));
	const c = compute(reg, Object.assign({}, compareFor(reg, ex), { on }));
	const f = compute(reg, Object.assign({}, EXAMPLE_FEE, { on }));
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: ex,
		total: r.fee,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, ex),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, c, { printedOn: reg.consumer_ktanot ? reg.consumer_ktanot.checked_on : on }),
		method: `<ol>${feeLines(reg, r).map((l) => `<li>${l}</li>`).join('')}</ol>`,
		compare_table: feeTable(reg),
		sentence: verdictSentence(r),
		fee: {
			input: EXAMPLE_FEE,
			total: f.fee,
			lead: leadCard(reg, f, { example: true }),
			form: renderForm(reg, EXAMPLE_FEE),
			result: renderResult(reg, f, { example: true }),
			details: '',
			method: `<ol>${feeLines(reg, f).map((l) => `<li>${l}</li>`).join('')}</ol>`,
			sentence: verdictSentence(f),
		},
	};
}

/* ---------------- Share state (keys: parts/ktanot/STATE-KEYS.md) ---------------- */

const PL_CODE = { individual: 'i', osek: 'o', company: 'c', other_body: 'b' };
const HEAD_KEY = { price: 'p', fee: 'f', repair: 'q', comp: 'c', flight: 'y', other: 'o' };
const PAR_OK = /^(1|1a|2|2a|2b|2b1|2c|3|4|4a|4b|5|6|7|8)$/;
const ktNum = (v) => (v === undefined || v === null || v === '' || !Number.isFinite(Number(v)) || Number(v) === 0 ? '' : Math.round(Number(v) * 100) / 100);
export const KEYS = ['a', 't', 'r', 'l', 'x', 'n', 'v', 'h', 's', 'k', 'p', 'f', 'q', 'c', 'u', 'y', 'e', 'o', 'g', 'w', 'i', 'j'];
export function stateOf(i) {
	if (i.mode === 'fee') { return encodeState({ a: i.amount }); }
	const heads = i.heads || {};
	const has = ktHasHeads(i);
	const sum = has ? KT_HEADS.reduce((s, h) => s + Math.round((Number(heads[h]) || 0) * 100), 0) / 100 : i.amount;
	const st = {
		a: sum, t: PL_CODE[i.plaintiff] || 'i', r: i.remedy === 'product' ? 'p' : '', l: i.labor ? 1 : '', x: i.assigned ? 1 : '',
		n: i.claimsThisYear || '', v: i.eventDate, h: i.hearingDate, s: i.servedDate,
	};
	if (has) { st.k = KT_KINDS.includes(i.kind) ? i.kind : 'oth'; }
	for (const h of KT_HEADS) { st[HEAD_KEY[h]] = ktNum(heads[h]); }
	st.u = PAR_OK.test(String(i.compPar || '')) ? i.compPar : '';
	st.e = Number.isInteger(Number(i.passengers)) && Number(i.passengers) > 0 ? Number(i.passengers) : '';
	st.g = i.demandDate || '';
	st.w = i.waive ? 1 : '';
	st.i = i.filingDate || '';
	st.j = i.judgmentDate || '';
	return encodeState(st);
}
export function inputOf(s, mode) {
	const has = KT_HEADS.some((h) => s[HEAD_KEY[h]] !== undefined && s[HEAD_KEY[h]] !== '' && Number(s[HEAD_KEY[h]]) > 0);
	if (!s.a && !has) { return null; }
	if (mode === 'fee') { return s.a ? { mode, amount: Number(s.a) } : null; }
	const pl = Object.keys(PL_CODE).find((k) => PL_CODE[k] === s.t) || 'individual';
	const heads = {};
	for (const h of KT_HEADS) { const v = s[HEAD_KEY[h]]; if (v !== undefined && v !== '' && Number.isFinite(Number(v))) { heads[h] = Number(v); } }
	const total = KT_HEADS.reduce((t, h) => t + Math.round((Number(heads[h]) || 0) * 100), 0) / 100;
	return {
		mode, amount: has ? total : Number(s.a), plaintiff: pl, remedy: s.r === 'p' ? 'product' : 'money', labor: s.l === '1', assigned: s.x === '1', claimsThisYear: Number(s.n) || 0, eventDate: s.v || '', hearingDate: s.h || '', servedDate: s.s || '',
		kind: KT_KINDS.includes(s.k) ? s.k : (has ? 'oth' : 'def'), heads, compPar: PAR_OK.test(s.u || '') ? s.u : '', passengers: s.e && Number(s.e) > 0 ? Number(s.e) : '',
		demandDate: s.g || '', filingDate: s.i || '', judgmentDate: s.j || '', waive: s.w === '1',
	};
}

/* ---------------- Browser ---------------- */

function readForm(root, mode) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	const amt = parseMoney(val(`#${P}-amt`));
	if (mode === 'fee') { return { mode, amount: amt }; }
	const n = val(`#${P}-n`).trim();
	const heads = {};
	for (const h of KT_HEADS) { const v = val(`#${Q}-h-${h}`).trim(); if (v !== '') { heads[h] = parseMoney(v); } }
	const pax = val(`#${Q}-pax`).trim();
	return {
		mode, amount: amt, plaintiff: checked('pl') || 'individual', remedy: checked('rm') || 'money',
		labor: Boolean(checked('labor')), assigned: Boolean(checked('assigned')), claimsThisYear: n === '' ? 0 : Number(n),
		eventDate: toIso(val(`#${P}-ev`)), hearingDate: toIso(val(`#${P}-he`)), servedDate: toIso(val(`#${P}-sv`)),
		compareAmount: parseMoney(val(`#${P}-cmp`)),
		kind: val(`#${Q}-k`) || 'def', heads, compPar: val(`#${Q}-par`), passengers: pax === '' ? '' : Number(pax),
		demandDate: toIso(val(`#${Q}-g`)), filingDate: toIso(val(`#${Q}-i`)), judgmentDate: toIso(val(`#${Q}-j`)),
		waive: Boolean(root.querySelector(`#${Q}-w:checked`)),
	};
}

export function mount(root, reg) {
	const mode = root.getAttribute('data-jtool-mode') === 'fee' ? 'fee' : 'full';
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const today = ilToday(); // the Israel civil date, not UTC (HAD-502)
	const sc = reg.small_claims;
	const saveKey = `jtool-${TOOL_ID}-${mode}`;
	let last = null;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID, type: mode });
	if (isStale(sc.checked_on, sc.refresh_every_days) || (sc.next_update && today >= sc.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהנתונים התעדכנו'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const map = { amount: `${P}-amt`, claims: `${P}-n`, event: `${P}-ev`, hearing: `${P}-he`, served: `${P}-sv`, demand: `${Q}-g`, filing: `${Q}-i`, judgment: `${Q}-j`, passengers: `${Q}-pax` };
		for (const h of KT_HEADS) { map[`head_${h}`] = `${Q}-h-${h}`; }
		for (const e of r.errors) {
			const id = map[e.field];
			const box = id && root.querySelector(`#${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	// The heads drive the amount field: it shows their total and is read-only while any head has a value.
	const sync = (input, r) => {
		if (mode === 'fee') { return; }
		const amt = root.querySelector(`#${P}-amt`);
		const has = ktHasHeads(input);
		if (amt) {
			if (has && r && r.ok && r.claim) { amt.value = money(r.claim.total, r.claim.total % 1 ? 2 : 0); }
			if (has) { amt.setAttribute('readonly', ''); amt.setAttribute('data-kt-sum', ''); } else if (amt.hasAttribute('data-kt-sum')) { amt.removeAttribute('readonly'); amt.removeAttribute('data-kt-sum'); }
		}
		form.querySelectorAll('[data-kt-if-flt]').forEach((el) => { el.hidden = input.kind !== 'flt' && !(el.querySelector('input') && el.querySelector('input').value); });
		form.querySelectorAll('[data-kt-if-comp]').forEach((el) => { el.hidden = !(input.heads && Number(input.heads.comp) > 0); });
		form.querySelectorAll('[data-kt-if-over]').forEach((el) => { el.hidden = !(r && r.ok && r.claim && (r.claim.over || r.claim.waive)); });
		const key = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return p.kind === input.kind && KT_HEADS.every((h) => Number(p.heads[h] || 0) === Number((input.heads || {})[h] || 0)); }) || '';
		form.querySelectorAll(`.${Q}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const full = Object.assign({}, input, { on: today });
		const r = compute(reg, full);
		const c = r.ok && mode === 'full' ? compute(reg, Object.assign({}, compareFor(reg, input), { on: today })) : null;
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, c, { printedOn: today });
		sync(input, r);
		if (sticky) { sticky.innerHTML = r.ok && r.verdict !== 'no' && !(mode === 'fee' && r.overCeiling) ? ils(r.fee, 0) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r); }
		last = { r, input };
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: mode === 'fee' ? (r.overCeiling ? 'over_ceiling' : 'fee') : ktBand(r) }); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID, type: mode }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root, mode)); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS), mode);
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
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
			const first = form.querySelector(`.${Q}-preset, #${P}-amt`);
			if (first) { setTimeout(() => first.focus({ preventScroll: true }), 350); }
			track('tool_lead_click', { tool_id: TOOL_ID });
		});
	}
	// The what-if amount updates only column B, so the field never loses focus while typing.
	let cmpTimer = null;
	let cmpTracked = false;
	details.addEventListener('input', (ev) => {
		if (!ev.target.matches('[data-compare-amount]') || !last || !last.r.ok) { return; }
		clearTimeout(cmpTimer);
		cmpTimer = setTimeout(() => {
			const out = details.querySelector('[data-compare-out]');
			const c = compute(reg, Object.assign({}, last.input, { amount: parseMoney(ev.target.value), heads: null, on: today }));
			if (out) { out.innerHTML = renderCompareOut(last.r, c); }
			if (!cmpTracked) { cmpTracked = true; track('tool_compare', { tool_id: TOOL_ID }); }
		}, 200);
	});
	root.addEventListener('click', async (ev) => {
		const ex = ev.target.closest('[data-amount]');
		if (ex) { const f = root.querySelector(`#${P}-amt`); if (f) { f.value = money(Number(ex.getAttribute('data-amount')), 0); schedule(); } return; }
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (act === 'kt-preset') {
			const input = ktPreset(b.getAttribute('data-preset'), today);
			if (!input) { return; }
			clearTimeout(timer); timer = null;
			form.innerHTML = renderForm(reg, input);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		if (act === 'kt-waive') {
			const w = root.querySelector(`#${Q}-w`);
			if (w) { w.checked = true; }
			clearTimeout(timer); timer = null;
			run(readForm(root, mode));
			track('tool_waive', { tool_id: TOOL_ID });
			return;
		}
		// Wave 4 (HAD-502): run a pending debounce now and act on a fresh compute, never the last debounced result.
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root, mode), { silent: true }); }
		const input = readForm(root, mode);
		const r = compute(reg, Object.assign({}, input, { on: today }));
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok && ((r.timeline && r.timeline.length) || (r.dates && r.dates.length))) {
			const events = r.timeline && r.timeline.length && reg.consumer_ktanot
				? r.timeline.filter((e) => !e.past && e.code !== 'event').map((e) => ({ date: e.date, summary: `תביעה קטנה: ${tlText(reg, r, e)[0]}`, description: 'חושב ב-jus-tice.co.il לפי תקנות שיפוט בתביעות קטנות, חוק בתי המשפט ודפי הרשות השופטת. מידע כללי, לא ייעוץ משפטי.' }))
				: r.dates.filter((d) => !d.past).map((d) => ({ date: d.date, summary: `תביעה קטנה: ${DATE_TEXT[d.rule](reg)[0]}` }));
			download('tviot-ktanot.ics', 'text/calendar;charset=utf-8', ics(events, new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(r)} · חושב ב-jus-tice.co.il לפי תקנות שיפוט בתביעות קטנות (נתונים מ-${isoToHe(r.ceilingFrom)}) ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(r)} (חושב ב-jus-tice.co.il, ${isoToHe(sc.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'claim-copy' && r.ok && r.mode === 'full') {
			const ok = await copyText(claimText(reg, r));
			toast(root, ok ? 'השלד הועתק. השלימו את הפרטים לפני ההגשה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(ktDocs(reg, r).map((d) => `- ${d}`).join('\n'));
			toast(root, ok ? 'רשימת המסמכים הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'list' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? ktBand(r) : 'error' });
			const brief = r.ok ? aiBrief(reg, r) : '';
			if (brief && openSimulation(brief, 'court_rehearsal', b.getAttribute('href') || KT_SIM)) {
				ev.preventDefault();
				toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.');
			} else if (brief) {
				copyText(brief);
				toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			}
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS), mode);
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
