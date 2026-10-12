/**
 * T05 UI: small claims — does it fit, the fee, the deadlines, the claim's structure, rehearse (HAD-490).
 * Board: https://claude.ai/artifact/759KGxB7GDSy5NHaajW8sJ (T05-desktop, T05-360, T05-fee, States).
 * One bundle, two modes: the full instrument (/small-claims-court-israel/) and fee only
 * (/small-claims-fee-calculator/, [justice_tool name="tviot-ktanot" mode="fee"]).
 */
import { compute, fee } from './tviot-engine.js';
import {
	esc, ils, money, amount, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale,
} from './instrument.js';

export const TOOL_ID = 'tviot-ktanot';
const P = 'jt5';

export const EXAMPLE = { mode: 'full', amount: 12748, plaintiff: 'individual', remedy: 'money', assigned: false, labor: false, claimsThisYear: 0, eventDate: '2026-03-01', hearingDate: '2027-02-15', servedDate: '' };
export const EXAMPLE_FEE = { mode: 'fee', amount: 39900 };
export const FEE_EXAMPLES = [3000, 5000, 5001, 10000, 12748, 25010, 39900];

const PLAINTIFFS = { individual: 'אדם פרטי', osek: 'עוסק פטור או מורשה', company: 'חברה בע"מ', other_body: 'עמותה או שותפות' };
const CANNOT = { company: 'חברה בע"מ לא יכולה להגיש תביעה קטנה', other_body: 'עמותה או שותפות לא יכולה להגיש תביעה קטנה' };

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

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const amt = `<div class="jtool-field"><label class="jtool-label" for="${P}-amt">סכום התביעה</label><div class="jtool-input jtool-input--money"><input id="${P}-amt" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.amount ? money(input.amount, input.amount % 1 ? 2 : 0) : '')}" placeholder="לדוגמה: 12,000" aria-describedby="${P}-amt-h ${P}-amt-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>`
		+ `<p class="jtool-hint" id="${P}-amt-h">${input.mode === 'fee' ? `מעל ${money(reg.small_claims.ceiling[reg.small_claims.ceiling.length - 1].amount, 0)} ₪ זו כבר לא תביעה קטנה.` : 'בתביעה להחלפת מוצר, תיקון או ביטול עסקה: שווי המוצר או העסקה'}</p><p class="jtool-error" id="${P}-amt-e" role="alert"></p></div>`;
	if (input.mode === 'fee') {
		return amt + `<div class="jtool-field"><span class="jtool-label" id="${P}-ex-l">דוגמאות</span><div class="jtool-chips" role="group" aria-labelledby="${P}-ex-l">${[3000, 5001, 25010].map((a) => `<button class="jtool-btn" type="button" data-amount="${a}">${money(a, 0)} ₪</button>`).join('')}</div></div>`;
	}
	return amt
		+ `<fieldset class="jtool-field"><legend>מי תובע</legend><div class="jtool-chips">${Object.entries(PLAINTIFFS).map(([k, v]) => chip('pl', k, v, input.plaintiff === k)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מה מבקשים</legend><div class="jtool-chips">${chip('rm', 'money', 'כסף', input.remedy !== 'product')}${chip('rm', 'product', 'החלפה, תיקון או ביטול עסקה', input.remedy === 'product')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>שאלות קצרות</legend><div class="jtool-chips">${chip('labor', '1', 'זה סכסוך עם מעסיק', input.labor, 'checkbox')}${chip('assigned', '1', 'קניתי את החוב ממישהו (המחאה)', input.assigned, 'checkbox')}</div></fieldset>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-n">כמה תביעות קטנות הגשתם השנה באותו בית משפט</label><input id="${P}-n" type="text" inputmode="numeric" autocomplete="off" value="${esc(input.claimsThisYear ?? 0)}" aria-describedby="${P}-n-e"><p class="jtool-error" id="${P}-n-e" role="alert"></p></div>`
		+ `<details class="jtool-more"${input.eventDate || input.hearingDate || input.servedDate ? ' open' : ''}><summary>תאריכים, בשביל המועדים</summary>`
		+ `<div class="jtool-row" style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${P}-ev">מתי זה קרה</label><input id="${P}-ev" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.eventDate || ''))}" placeholder="לדוגמה: 1.3.2026" aria-describedby="${P}-ev-e"><p class="jtool-error" id="${P}-ev-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-he">מועד הדיון, אם נקבע</label><input id="${P}-he" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.hearingDate || ''))}" placeholder="לדוגמה: 15.2.2027" aria-describedby="${P}-he-e"><p class="jtool-error" id="${P}-he-e" role="alert"></p></div></div>`
		+ `<div class="jtool-field" style="margin-top:8px"><label class="jtool-label" for="${P}-sv">אתם הנתבעים? מתי קיבלתם את התביעה</label><input id="${P}-sv" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.servedDate || ''))}" placeholder="לדוגמה: 5.10.2026" aria-describedby="${P}-sv-e"><p class="jtool-error" id="${P}-sv-e" role="alert"></p></div>`
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
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${states[r.verdict]}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}תביעה של ${esc(money(r.amount, r.amount % 1 ? 2 : 0))} ₪ מ${esc(PLAINTIFFS[r.plaintiff])}</p>${figure}`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(r))}</p>`
		+ `<p class="jtool-scope">הבדיקה לפי הדין, לא לפי סיכויי התביעה. אין כאן אחוזי הצלחה: מה שקובע הוא המסמכים והעדים שלכם.</p></div>`
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ `<details class="jtool-path" open><summary>מפת ההתאמה</summary><ul class="jtool-conds">${conds}</ul></details>`;
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

export function claimText(reg, r) {
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

export function renderDetails(reg, r, compareR) {
	if (!r.ok) { return ''; }
	const sc = reg.small_claims;
	if (r.mode === 'fee') { return ''; }
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-fee-h">האגרה, שורה אחרי שורה</h3></div><ol class="jtool-steps">${feeLines(reg, r).map((l) => `<li>${l}</li>`).join('')}</ol></div>`;
	if (r.dates.length) {
		const rows = r.dates.map((d) => { const [what, src] = DATE_TEXT[d.rule](reg); return `<tr${d.past ? ' class="jtool-muted"' : ''}><td data-th="עד תאריך"><bdi>${isoToHe(d.date)}</bdi>${d.past ? ' (עבר)' : d.soon ? ' (בקרוב)' : ''}</td><td data-th="מה עושים">${esc(what)}</td><td data-th="הכלל">${src}</td></tr>`; }).join('');
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שלכם</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה עושים</th><th scope="col">הכלל</th></tr></thead><tbody>${rows}</tbody>`
			+ `<caption>החלטה שניתנה בהיעדרכם: בקשת ביטול תוך ${sc.deadlines.set_aside_days} יום (תקנה 12). ערעור: רק ברשות בית המשפט המחוזי (סעיף 64). חישוב כללי, לא ייעוץ משפטי.</caption></table></div></div>`;
	} else {
		out += `<p class="jtool-scope" id="${P}-dl-h" tabindex="-1">רוצים את המועדים? פתחו "תאריכים" בטופס והזינו את יום האירוע ומועד הדיון.</p>`;
	}
	if (compareR && compareR.ok) {
		out += `<div class="jtool-compare" data-compare><h3>מה אם: סכום אחר</h3>`
			+ `<div class="jtool-field" style="margin-bottom:12px"><label class="jtool-label" for="${P}-cmp">סכום לבדיקה בעמודה ב'</label><div class="jtool-input jtool-input--money"><input id="${P}-cmp" type="text" inputmode="decimal" autocomplete="off" data-compare-amount value="${esc(money(compareR.amount, compareR.amount % 1 ? 2 : 0))}"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div></div>`
			+ `<div data-compare-out>${renderCompareOut(r, compareR)}</div></div>`;
	}
	if (r.verdict !== 'no') {
		out += `<div class="jtool-tablewrap" data-claim><div class="jtool-tablewrap__head"><h3 id="${P}-claim-h">שלד כתב התביעה (לפי תקנה 3)</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="claim-copy">העתקת השלד</button><button class="jtool-btn" type="button" data-act="print">הדפסה</button></div></div>`
			+ `<pre class="jtool-letter">${esc(claimText(reg, r))}</pre>`
			+ `<ul class="jtool-notes"><li><strong>לאן מגישים:</strong> לבית המשפט באזור מגורי הנתבע או עסקו, או באזור שבו קרה האירוע. בתביעה על פרסום או מסחר באינטרנט: גם באזור המגורים או העסק שלכם${regCite(reg, 'תקנה 2')}</li>`
			+ `<li><strong>בהגשה מקוונת:</strong> מהמחשב בלבד, קובצי PDF עד 70 מגה, עד ${sc.online_max_plaintiffs} תובעים ו-${sc.online_max_defendants} נתבעים. <a href="${esc(sc.service_url)}" target="_blank" rel="noopener">הגשה באתר הרשות השופטת</a></li></ul></div>`;
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
	const b = Number(input.compareAmount) > 0 ? Number(input.compareAmount) : (Number(input.amount) === ceil ? Math.round(ceil / 2) : ceil);
	return Object.assign({}, input, { amount: b });
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

export function snapshot(reg) {
	const on = reg.checked_on;
	const r = compute(reg, Object.assign({}, EXAMPLE, { on }));
	const c = compute(reg, Object.assign({}, compareFor(reg, EXAMPLE), { on }));
	const f = compute(reg, Object.assign({}, EXAMPLE_FEE, { on }));
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.fee,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, c),
		method: `<ol>${feeLines(reg, r).map((l) => `<li>${l}</li>`).join('')}</ol>`,
		compare_table: feeTable(reg),
		sentence: verdictSentence(r),
		fee: {
			input: EXAMPLE_FEE,
			total: f.fee,
			form: renderForm(reg, EXAMPLE_FEE),
			result: renderResult(reg, f, { example: true }),
			details: '',
			method: `<ol>${feeLines(reg, f).map((l) => `<li>${l}</li>`).join('')}</ol>`,
			sentence: verdictSentence(f),
		},
	};
}

/* ---------------- Browser ---------------- */

function readForm(root, mode) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	const amt = parseMoney(val(`#${P}-amt`));
	if (mode === 'fee') { return { mode, amount: amt }; }
	const n = val(`#${P}-n`).trim();
	return {
		mode, amount: amt, plaintiff: checked('pl') || 'individual', remedy: checked('rm') || 'money',
		labor: Boolean(checked('labor')), assigned: Boolean(checked('assigned')), claimsThisYear: n === '' ? 0 : Number(n),
		eventDate: toIso(val(`#${P}-ev`)), hearingDate: toIso(val(`#${P}-he`)), servedDate: toIso(val(`#${P}-sv`)),
		compareAmount: parseMoney(val(`#${P}-cmp`)),
	};
}

const PL_CODE = { individual: 'i', osek: 'o', company: 'c', other_body: 'b' };
const stateOf = (i) => encodeState(i.mode === 'fee' ? { a: i.amount } : {
	a: i.amount, t: PL_CODE[i.plaintiff] || 'i', r: i.remedy === 'product' ? 'p' : '', l: i.labor ? 1 : '', x: i.assigned ? 1 : '',
	n: i.claimsThisYear || '', v: i.eventDate, h: i.hearingDate, s: i.servedDate,
});
function inputOf(s, mode) {
	if (!s.a) { return null; }
	if (mode === 'fee') { return { mode, amount: Number(s.a) }; }
	const pl = Object.keys(PL_CODE).find((k) => PL_CODE[k] === s.t) || 'individual';
	return { mode, amount: Number(s.a), plaintiff: pl, remedy: s.r === 'p' ? 'product' : 'money', labor: s.l === '1', assigned: s.x === '1', claimsThisYear: Number(s.n) || 0, eventDate: s.v || '', hearingDate: s.h || '', servedDate: s.s || '' };
}
const KEYS = ['a', 't', 'r', 'l', 'x', 'n', 'v', 'h', 's'];

export function mount(root, reg) {
	const mode = root.getAttribute('data-jtool-mode') === 'fee' ? 'fee' : 'full';
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const today = new Date().toISOString().slice(0, 10);
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
		const map = { amount: 'amt', claims: 'n', event: 'ev', hearing: 'he', served: 'sv' };
		for (const e of r.errors) {
			const key = map[e.field];
			const box = key && root.querySelector(`#${P}-${key}-e`);
			if (box) { box.textContent = e.he; }
			const f = key && root.querySelector(`#${P}-${key}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const run = (input, opts = {}) => {
		const full = Object.assign({}, input, { on: today });
		const r = compute(reg, full);
		const c = r.ok && mode === 'full' ? compute(reg, Object.assign({}, compareFor(reg, input), { on: today })) : null;
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, c);
		if (sticky) { sticky.innerHTML = r.ok && r.verdict !== 'no' && !(mode === 'fee' && r.overCeiling) ? ils(r.fee, 0) : '—'; }
		last = { r, input };
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: mode === 'fee' ? (r.overCeiling ? 'over_ceiling' : 'fee') : r.verdict }); }
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID, type: mode }); }
		clearTimeout(timer);
		timer = setTimeout(() => run(readForm(root, mode)), 160);
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
	// The what-if amount updates only column B, so the field never loses focus while typing.
	let cmpTimer = null;
	let cmpTracked = false;
	details.addEventListener('input', (ev) => {
		if (!ev.target.matches('[data-compare-amount]') || !last || !last.r.ok) { return; }
		clearTimeout(cmpTimer);
		cmpTimer = setTimeout(() => {
			const out = details.querySelector('[data-compare-out]');
			const c = compute(reg, Object.assign({}, last.input, { amount: parseMoney(ev.target.value), on: today }));
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
		const input = readForm(root, mode);
		const r = last ? last.r : compute(reg, Object.assign({}, input, { on: today }));
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok && r.dates && r.dates.length) {
			const events = r.dates.filter((d) => !d.past).map((d) => ({ date: d.date, summary: `תביעה קטנה: ${DATE_TEXT[d.rule](reg)[0]}` }));
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
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? (r.verdict || 'fee') : 'error' });
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
