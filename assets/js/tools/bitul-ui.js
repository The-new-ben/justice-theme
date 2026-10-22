/**
 * The consumer-law wave UI (22.10.2026, HAD-593): the cancellation-rights checker (bitul-iska, prefix jt64) on /bitul-iska/.
 * The picture is the window itself: a calendar strip from the day of the deal, through the day the goods arrived, to the
 * last day to cancel, with today ruled and the rest days shaded (the law counts and skips them); and beside it a till
 * receipt where the cancellation fee is the only deduction from the price, down to the refund and the day it is due. Both
 * have a text equivalent. Under them: why (the route and the gates, each with its section), how to give notice (the ways
 * of s.14ט), the cancellation notice itself as plain text (the reader's name, ID, business and order number stay in the
 * page only: never in the share link, the saved state, analytics or the AI brief), the scenario for the simulation and the
 * next steps; the dates, the rules, what changed and when, and a one-page summary that prints on its own.
 */
import { btCompute, btBand, BT_KINDS, BT_GOODS, BT_FLAGS } from './bitul-engine.js';
import { addDays, daysBetween, parseDate, isRestDay } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'bitul-iska';
export const PAGE = '/bitul-iska/';
const P = 'jt64';
const BT_SIM = (purpose) => `https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=${purpose}&topic=contract-dispute`;
const BT_KTANOT = '/small-claims-court-israel/';
const BT_PITZUI = '/consumer-rights-israel/';

/** One click to a full profile, each relative to today: the deal so many days ago. */
export const PRESETS = {
	online: { he: 'הזמנה באתר · מכשיר חשמלי · 1,290 ₪', sale: 'distance', kind: 'electric', price: 1290, deal: 14, received: 9 },
	clothing: { he: 'בגד בחנות · נקנה אתמול', sale: 'store', kind: 'clothing', price: 349, deal: 1 },
	senior: { he: 'אזרח ותיק · עסקה בטלפון לפני חודשיים', sale: 'distance', kind: 'electric', price: 1800, deal: 60, received: 56, buyer: 'senior', conversation: true },
	gym: { he: 'מנוי שנתי למכון כושר · אחרי 3 חודשים', sale: 'ongoing', kind: 'gym', price: 3600, deal: 92, months: 12, alt: 400, fixedTerm: true },
	defect: { he: 'מוצר פגום שהוזמן באינטרנט', sale: 'distance', kind: 'electric', price: 899, deal: 10, received: 6, reason: 'defect' },
};
const BT_BLANK = { sale: 'distance', kind: 'electric', buyer: 'regular', reason: 'mind', price: '', pay: 'card', channel: 'email', deal: '', received: '', doc: '', service: '', notice: '', today: '', months: '', alt: '', charged: '' };
BT_FLAGS.forEach((k) => { BT_BLANK[k] = false; });
/** A preset applied on a day: the deal and the receipt `n` days before it. */
export function btPreset(key, today) {
	const p = PRESETS[key];
	if (!p) { return null; }
	const out = Object.assign({}, BT_BLANK, { sale: p.sale, kind: p.kind, price: p.price, buyer: p.buyer || 'regular', reason: p.reason || 'mind', today, deal: addDays(today, -p.deal), received: p.received ? addDays(today, -p.received) : '', channel: p.sale === 'store' ? 'store' : 'email' });
	if (p.conversation) { out.conversation = true; }
	if (p.fixedTerm) { out.fixedTerm = true; out.months = p.months; out.alt = p.alt; out.service = out.deal; }
	return out;
}
export const EXAMPLE = btPreset('online', '2026-10-22');

const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text || 'מקור')}</a>` : '');
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const btIso = (text) => { const raw = String(text || '').trim(); return raw ? (parseDate(raw) || raw) : ''; };
export const SALE_HE = { distance: 'באינטרנט, בטלפון או מקטלוג', store: 'בחנות', door: 'בבית, ממוכר שהגיע (רוכלות)', event: 'בכנס מכירות או באירוע הצגה', ongoing: 'לסיים מנוי או עסקה מתמשכת' };
const SALE_SHORT = { distance: 'עסקת מכר מרחוק', store: 'קנייה בחנות', door: 'עסקה ברוכלות', event: 'קנייה באירוע הצגה', ongoing: 'עסקה מתמשכת' };
export const KIND_HE = {
	electric: 'מכשיר חשמלי או אלקטרוני, טלפון', furniture: 'ריהוט', home: 'ציוד לבית ולגן', watch: 'שעון', water: 'מטהר מים או מיתקן מים',
	sealed: 'מוצר אחר באריזה מקורית סגורה', ordered: 'מוצר שהוזמן ועוד לא סופק', clothing: 'ביגוד והנעלה', jewelry: 'תכשיט', car: 'רכב חדש מיבואן',
	goods: 'מוצר אחר', food: 'מזון', medicine: 'תרופות ותוספי תזונה', perishable: 'מוצר פסיד (חיי מדף קצרים)', underwear: 'הלבשה תחתונה ובגדי ים',
	custom: 'מוצר שיוצר במיוחד לפי מידות או דרישות', media: 'מוצר שאפשר להעתיק (משחק, תוכנה, דיסק)', info: 'מידע ותוכן דיגיטלי', gas: 'גז',
	travel: 'נופש, מלון, טיסה, הופעה או בילוי (בארץ, או טיסה מישראל ואליה)', abroad: 'שירותי תיירות שכולם בחו"ל', course: 'חוג או קורס',
	continuing: 'שירות מתמשך: סלולר, אינטרנט, טלוויזיה, קוסמטיקה, מועדון', gym: 'מכון כושר או ספא', service: 'שירות חד-פעמי אחר (בעל מקצוע, ייעוץ)',
};
const BT_FAULTS = ['defect', 'mismatch', 'late'];
/** Short names for sentences (the brief, the lead card, the print). */
export const KIND_SHORT = {
	electric: 'מכשיר חשמלי', furniture: 'ריהוט', home: 'ציוד לבית', watch: 'שעון', water: 'מטהר מים', sealed: 'מוצר באריזה סגורה', ordered: 'מוצר בהזמנה',
	clothing: 'בגד או נעליים', jewelry: 'תכשיט', car: 'רכב חדש', goods: 'מוצר', food: 'מזון', medicine: 'תרופות', perishable: 'מוצר פסיד', underwear: 'הלבשה תחתונה',
	custom: 'מוצר בהזמנה אישית', media: 'מוצר שאפשר להעתיק', info: 'תוכן דיגיטלי', gas: 'גז', travel: 'נופש או בילוי', abroad: 'שירותי תיירות בחו"ל',
	course: 'חוג או קורס', continuing: 'שירות מתמשך', gym: 'מנוי למכון כושר', service: 'שירות חד-פעמי',
};
const REASON_HE = { mind: 'התחרטתי', defect: 'פגם במוצר', mismatch: 'לא כמו שתואר', late: 'לא סופק בזמן', mislead: 'הטעיה' };
const PAY_HE = { card: 'כרטיס אשראי', cash: 'מזומן', cheque: 'שיק', debit: 'הוראת קבע או הרשאה לחיוב', transfer: 'העברה בנקאית' };
const CHANNEL_HE = { email: 'דואר אלקטרוני', web: 'טופס הביטול באתר העסק', phone: 'טלפון', mail: 'דואר רשום', fax: 'פקס', store: 'בחנות, עם הקבלה' };
const CHANNEL_SEC = { phone: 'סעיף 14ט(א)(1)', mail: 'סעיף 14ט(א)(2)', email: 'סעיף 14ט(א)(3)', fax: 'סעיף 14ט(א)(4)', web: 'סעיף 14ט(א)(5)' };
const btBuyerHe = (reg, b) => { const SP = reg.consumer_bitul.special; return { regular: 'רגיל', senior: `אזרח ותיק (${SP.senior_age} ומעלה)`, disability: 'אדם עם מוגבלות', immigrant: `עולה חדש (עד ${SP.immigrant_years} שנים)` }[b]; };
const KINDS_FOR = (sale) => (sale === 'ongoing' ? ['continuing', 'gym'] : BT_KINDS);
const FLAG_HE = (reg) => ({
	opened: 'האריזה המקורית נפתחה', used: 'היה שימוש, או שהמוצר חובר לחשמל, לגז או למים', tagOff: 'תווית המחיר הוסרה', assembled: 'הריהוט הורכב בבית',
	vouchers: 'שולם בתווי קנייה, בשובר מתנה או בכרטיס נטען', late6: `ביקשתי אספקה יותר מ-${reg.consumer_bitul.store.late_delivery_months} חודשים אחרי העסקה`,
	conversation: 'בעסקה הייתה שיחה עם העסק (טלפון, צ\'אט, וידאו)', started: 'השירות כבר התחיל', installed: 'בוצעה בבית התקנה לצורך שירות',
	registered: 'הרכב כבר נרשם על שמי', abroadPolicy: 'בחרתי במדיניות הביטול של הספק בחו"ל', fixedTerm: 'מנוי לתקופה קצובה (לא פתוח)',
});
/** Which flag is relevant to an input: the form shows only those. */
export function btFlagShown(i, k) {
	const goods = BT_GOODS.includes(i.kind);
	const st = i.sale === 'store' || i.sale === 'event';
	return {
		opened: goods, used: goods, tagOff: st && i.kind === 'clothing', assembled: st && i.kind === 'furniture', vouchers: st, late6: st && goods,
		conversation: i.sale === 'distance' && i.buyer !== 'regular', started: i.sale === 'door' && !goods, installed: i.sale !== 'ongoing',
		registered: i.kind === 'car', abroadPolicy: i.sale === 'distance' && i.kind === 'abroad', fixedTerm: i.sale === 'ongoing',
	}[k];
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, BT_BLANK, input || {});
	const FH = FLAG_HE(reg);
	const preset = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return /^\d{4}-\d{2}-\d{2}$/.test(i.today || '') && i.deal === addDays(i.today, -p.deal) && p.sale === i.sale && p.kind === i.kind && String(p.price) === String(i.price) && (p.buyer || 'regular') === i.buyer && (p.reason || 'mind') === i.reason; }) || '';
	const date = (id, label, v, hint, attr) => `<div class="jtool-field"${attr || ''}><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 13.10.2026" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const amt = (id, label, v, ph, hint, attr) => `<div class="jtool-field"${attr || ''}><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v === '' || v === undefined || v === null ? '' : money(v, Number(v) % 1 ? 2 : 0))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const num = (id, label, v, ph, attr) => `<div class="jtool-field"${attr || ''}><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v === '' || v === undefined || v === null ? '' : v)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const sel = (id, label, v, opts, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><select id="${P}-${id}" aria-describedby="${P}-${id}-e">${opts.map(([val, l]) => `<option value="${esc(val)}"${String(v) === val ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint">${esc(hint)}</p>` : ''}</div>`;
	const goods = BT_GOODS.includes(i.kind);
	const timed = ['travel', 'abroad', 'course', 'service'].includes(i.kind) || i.kind === 'gym';
	const hid = (show) => (show ? '' : ' hidden');
	const kinds = KINDS_FOR(i.sale);
	const goodsOpts = kinds.filter((k) => BT_GOODS.includes(k)).map((k) => [k, KIND_HE[k]]);
	const svcOpts = kinds.filter((k) => !BT_GOODS.includes(k)).map((k) => [k, KIND_HE[k]]);
	const kindSel = `<div class="jtool-field"><label class="jtool-label" for="${P}-kind">מה קניתם</label><select id="${P}-kind" aria-describedby="${P}-kind-e">${goodsOpts.length ? `<optgroup label="מוצרים">${goodsOpts.map(([v, l]) => `<option value="${v}"${i.kind === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</optgroup>` : ''}<optgroup label="שירותים">${svcOpts.map(([v, l]) => `<option value="${v}"${i.kind === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</optgroup></select><p class="jtool-error" id="${P}-kind-e" role="alert"></p></div>`;
	const flagBoxes = BT_FLAGS.map((k) => `<span data-flag="${k}"${hid(btFlagShown(i, k))}>${chip(`f-${k}`, '1', FH[k], Boolean(i[k]), 'checkbox')}</span>`).join('');
	const more = Boolean(i.doc || i.notice || i.charged || BT_FLAGS.some((k) => i[k] && k !== 'conversation' && k !== 'fixedTerm') || i.pay !== 'card');
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא את השדות לפי היום; אפשר לשנות כל שדה.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>איך נעשתה העסקה</legend><div class="jtool-chips">${Object.keys(SALE_HE).map((s) => chip('sale', s, SALE_HE[s], i.sale === s)).join('')}</div></fieldset>`
		+ `<div class="jtool-row">${kindSel}${amt('price', 'כמה שילמתם, כולל משלוח', i.price, 'לדוגמה: 1,290', 'המחיר הכולל ששולם')}</div>`
		+ `<div class="jtool-row">${date('deal', i.sale === 'ongoing' ? 'יום ההצטרפות' : 'יום העסקה', i.deal, '')}${date('rec', 'יום קבלת המוצר', i.received, 'ריק אם עוד לא הגיע', ` data-if-goods${hid(goods && i.sale !== 'ongoing')}`)}${date('svc', i.kind === 'gym' ? 'היום הראשון במנוי' : 'יום השירות (הנסיעה, האירוע, הקורס)', i.service, '', ` data-if-timed${hid(timed)}`)}</div>`
		+ `<fieldset class="jtool-field" data-if-reason${hid(i.sale !== 'ongoing')}><legend>למה מבטלים</legend><div class="jtool-chips">${Object.keys(REASON_HE).map((r) => chip('reason', r, REASON_HE[r], i.reason === r)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מי הקונה</legend><div class="jtool-chips">${['regular', 'senior', 'disability', 'immigrant'].map((b) => chip('buyer', b, btBuyerHe(reg, b), i.buyer === b)).join('')}</div></fieldset>`
		+ `<div class="jtool-row" data-if-gym${hid(i.sale === 'ongoing' && i.kind === 'gym')}>${num('months', 'תקופת המנוי בחודשים', i.months, 'לדוגמה: 12')}${amt('alt', 'מחיר חודשי במסלול החלופי', i.alt, 'אם נמסר בכתב', 'בלי תקופת התחייבות; ריק אם לא נמסר')}</div>`
		+ `<div class="jtool-chips ${P}-checks">${flagBoxes}</div>`
		+ `<details class="jtool-more ${P}-more"${more ? ' open' : ''}><summary>פרטים שמזיזים את התוצאה: מסמך, יום ההודעה, תשלום, דרך ההודעה</summary>`
		+ `<div class="jtool-row">${date('doc', 'יום קבלת המסמך או החוזה בכתב', i.doc, 'ריק = עם המוצר או ביום העסקה')}${date('ntc', 'יום הודעת הביטול', i.notice, 'ריק = היום')}</div>`
		+ `<div class="jtool-row">${sel('pay', 'איך שילמתם', i.pay, Object.keys(PAY_HE).map((k) => [k, PAY_HE[k]]))}${sel('chan', 'איך תודיעו', i.channel, Object.keys(CHANNEL_HE).map((k) => [k, CHANNEL_HE[k]]))}</div>`
		+ `<div class="jtool-row">${amt('chg', 'דמי ביטול שהעסק כבר ניכה', i.charged, 'לא חובה', 'כדי לבדוק אם ניכו יותר מהמותר')}</div>`
		+ '</details>';
}

/** The headline of a result: the figure and its unit, for the verdict, the lead card and the sticky bar. */
export function headline(reg, r) {
	if (!r.ok) { return { fig: '—', unit: 'צריך לתקן את הקלט' }; }
	const date = (d) => `<bdi>${isoToHe(d)}</bdi>`;
	if (r.route === 'gym') { return { fig: `<bdi>${money(r.refund, 2)}</bdi> ₪`, unit: `ההחזר, והביטול נכנס לתוקף ב-${isoToHe(r.end)}`, plain: nis(r.refund) }; }
	if (r.route === 'ongoing') { return { fig: date(r.end), unit: 'החוזה מסתיים והחיובים נפסקים', plain: isoToHe(r.end) }; }
	if (r.route === 'mislead') { return { fig: date(r.refundDue), unit: 'העוסק מחזיר את כל הכסף עד היום הזה', plain: isoToHe(r.refundDue) }; }
	if (r.can === 'no') { return { fig: 'אין', unit: `זכות ביטול לפי ${r.section}`, plain: 'אין זכות ביטול' }; }
	if (r.can === 'expired') { return { fig: 'עבר', unit: `היום האחרון היה ${isoToHe(r.last)}`, plain: 'המועד עבר' }; }
	if (r.can === 'policy') { return { fig: 'מדיניות', unit: 'החנות קובעת (סעיף 4ג)', plain: 'לפי מדיניות החנות' }; }
	if (r.route === 'remedy') { return { fig: 'תרופות', unit: 'פגם או איחור: לא דרך זכות הביטול', plain: 'לפי האחריות ודיני החוזים' }; }
	if (r.can === 'open' || !r.last) { return { fig: 'פתוח', unit: r.route === 'abroadPolicy' ? 'לפי מדיניות הספק בחו"ל' : `עד ${r.special4 ? `${reg.consumer_bitul.special.months} חודשים` : `${reg.consumer_bitul.distance.days} ימים`} מקבלת המוצר`, plain: 'החלון פתוח' }; }
	return { fig: date(r.last), unit: 'היום האחרון לבטל', plain: isoToHe(r.last) };
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const parts = [];
	const B = reg.consumer_bitul;
	if (r.route === 'ongoing') {
		parts.push(`הודעה ב-${isoToHe(r.notice)}: החוזה מסתיים עד ${isoToHe(r.end)} (${r.channel === 'mail' ? B.ongoing.end_business_days_mail : B.ongoing.end_business_days} ימי עסקים, ${B.ongoing.section}), ומאז אין חיובים.`);
	} else if (r.route === 'gym') {
		parts.push(`הביטול נכנס לתוקף ב-${isoToHe(r.end)}. מתוך ${nis(r.price)}: שימוש יחסי ${nis(r.gym.used)}, דמי ביטול ${nis(r.gym.fee)}, ההחזר ${nis(r.refund)} (${B.gym.section}).`);
	} else if (r.route === 'mislead') {
		parts.push(`ביטול בשל הטעיה (${B.mislead.section}): בתוך זמן סביר, בלי דמי ביטול; ${nis(r.refund)} מוחזרים עד ${isoToHe(r.refundDue)}.`);
	} else if (r.can === 'no') {
		parts.push(r.excluded ? `${r.excluded.he}: אין זכות ביטול לפי ${r.excluded.section}.` : `אין זכות ביטול לפי ${r.section}.`);
	} else if (r.can === 'expired') {
		parts.push(`לפי ${r.section} היום האחרון לבטל היה ${isoToHe(r.last)}.`);
	} else if (r.can === 'policy') {
		parts.push('המוצר לא ברשימה של תקנות הביטול: קובעת מדיניות ההחזרה שהחנות חייבת לתלות (סעיף 4ג), ובלי שלט, חזקה שאפשר להחזיר.');
	} else if (r.route === 'remedy') {
		parts.push('פגם, אי התאמה או איחור באספקה: התיקון, ההחלפה או ההחזר הם לפי האחריות ודיני החוזים, בלי דמי ביטול.');
	} else if (r.route === 'abroadPolicy') {
		parts.push('בחרתם במדיניות הביטול של הספק בחו"ל: התנאים שלה קובעים, וההחזר אם יש בתוך 14 ימים (סעיף 14ג2).');
	} else {
		if (r.last) { parts.push(`אפשר לבטל עד ${isoToHe(r.last)} (${r.section}${r.rolled ? ', אחרי מעבר מיום מנוחה' : ''}).`); } else { parts.push(`אפשר לבטל, והחלון נסגר ${r.special4 ? B.special.months : B.distance.days} ${r.special4 ? 'חודשים' : 'ימים'} אחרי קבלת המוצר (${r.section}).`); }
		if (r.fee !== null) { parts.push(r.fee > 0 ? `דמי ביטול לכל היותר ${nis(r.fee)}, ההחזר ${nis(r.refund)}${r.refundDue ? ` עד ${isoToHe(r.refundDue)}` : ''}.` : `בלי דמי ביטול: ${nis(r.refund)} מוחזרים${r.refundDue ? ` עד ${isoToHe(r.refundDue)}` : ''}.`); }
	}
	if (r.daysLeft !== null && r.daysLeft >= 0 && r.can !== 'expired' && r.can !== 'no' && r.route !== 'mislead') { parts.push(r.daysLeft === 0 ? 'היום הוא היום האחרון.' : `נשארו ${r.daysLeft === 1 ? 'יום אחד' : `${r.daysLeft} ימים`}.`); }
	return parts.join(' ');
}

/** The window as a calendar strip (one cell a day up to 45 days; a scaled line beyond), today ruled, with a text equivalent. */
export function ribbon(reg, r) {
	if (!r.ok) { return ''; }
	const startD = r.deal;
	const endD = [r.last, r.end, r.today, r.received, r.cutoff ? r.service : null, r.refundDue].filter(Boolean).sort().pop();
	const span = Math.max(1, daysBetween(startD, endD));
	const extra = (reg.car_accident && reg.car_accident.independence_days) || [];
	// A distance or door-to-door sale may be cancelled from the day of the deal (s.14ג(ג)(1), s.14(א)(1)); a store item from its start.
	const winFrom = r.route === 'distance' || r.route === 'door' ? r.deal : r.basis || r.deal;
	const label = (d) => (d === r.deal ? 'עסקה' : d === r.received ? 'קבלה' : d === r.last ? 'אחרון' : d === r.today ? 'היום' : d === r.end ? 'סיום' : d === r.refundDue ? 'החזר' : r.cutoff && d === r.service ? 'שירות' : '');
	let body;
	if (span <= 45) {
		const cells = [];
		for (let n = 0; n <= span; n += 1) {
			const d = addDays(startD, n);
			const cls = [`${P}-c`];
			if (isRestDay(d, extra)) { cls.push(`${P}-c--rest`); }
			if (r.last && d > winFrom && d <= r.last && r.can !== 'no') { cls.push(`${P}-c--in`); }
			if (d === r.deal) { cls.push(`${P}-c--deal`); }
			if (d === r.received) { cls.push(`${P}-c--rec`); }
			if (d === r.last) { cls.push(r.can === 'expired' ? `${P}-c--gone` : `${P}-c--last`); }
			if (d === r.end || d === r.refundDue) { cls.push(`${P}-c--due`); }
			if (r.cutoff && d === r.service) { cls.push(`${P}-c--svc`); }
			if (d === r.today) { cls.push(`${P}-c--today`); }
			const l = label(d);
			cells.push(`<li class="${cls.join(' ')}" title="${esc(`${isoToHe(d)}${l ? `: ${l}` : ''}${isRestDay(d, extra) ? ' (יום מנוחה)' : ''}`)}"><b>${Number(d.slice(8))}.${Number(d.slice(5, 7))}</b><small>${esc(l)}</small></li>`);
		}
		body = `<ol class="${P}-cells" aria-hidden="true">${cells.join('')}</ol>`;
	} else {
		const pos = (d) => Math.min(100, Math.max(0, Math.round(daysBetween(startD, d) / span * 1000) / 10));
		const marks = r.events.filter((e) => e.key !== 'limit' && e.date <= endD).map((e, k) => `<span class="${P}-m ${P}-m--${e.kind}" style="inset-inline-start:${pos(e.date)}%"><i aria-hidden="true">${k + 1}</i></span>`).join('');
		const fill = r.last && r.can !== 'no' ? `<span class="${P}-bar__win" style="inset-inline-start:${pos(winFrom)}%;inline-size:${Math.max(0, pos(r.last) - pos(winFrom))}%"></span>` : '';
		const todayMark = r.today && r.today <= endD ? `<span class="${P}-m ${P}-m--today" style="inset-inline-start:${pos(r.today)}%"><i aria-hidden="true">היום</i></span>` : '';
		body = `<div class="${P}-bar" aria-hidden="true">${fill}${marks}${todayMark}</div><ol class="${P}-legend" aria-hidden="true">${r.events.filter((e) => e.key !== 'limit' && e.date <= endD).map((e, k) => `<li><i>${k + 1}</i><bdi>${isoToHe(e.date)}</bdi> ${esc(e.he)}</li>`).join('')}</ol>`;
	}
	const sum = `${SALE_SHORT[r.sale]}. ${r.events.filter((e) => e.key !== 'limit').map((e) => `${isoToHe(e.date)}: ${e.he}`).join('. ')}.${r.today ? ` היום ${isoToHe(r.today)}.` : ''}`;
	const cap = r.route === 'ongoing' || r.route === 'gym' ? `מההודעה עד הסיום: ${isoToHe(r.end)}` : r.last && r.can !== 'no' ? `חלון הביטול: ${r.basisHe ? `${r.basisHe}, ` : ''}עד ${isoToHe(r.last)}` : 'חלון הביטול';
	return `<figure class="${P}-strip"><figcaption class="${P}-strip__h">${esc(cap)}</figcaption><p class="jtool-visually-hidden">${esc(sum)}</p>${body}`
		+ `<p class="${P}-key" aria-hidden="true"><span class="${P}-k ${P}-k--in">בתוך החלון</span><span class="${P}-k ${P}-k--rest">יום מנוחה</span><span class="${P}-k ${P}-k--today">היום</span></p></figure>`;
}

/** The till receipt: the price, the fee as the only deduction (and installation if any), the refund and its day. */
export function receipt(reg, r) {
	if (!r.ok) { return ''; }
	const B = reg.consumer_bitul;
	const rows = [];
	const row = (he, v, cls) => rows.push(`<tr${cls ? ` class="${P}-r--${cls}"` : ''}><th scope="row">${esc(he)}</th><td>${v}</td></tr>`);
	if (r.route === 'gym') {
		row('התמורה לתקופה', ils(r.price));
		row(`שימוש יחסי עד ${isoToHe(r.end)} (${r.gym.usedDays} מתוך ${r.gym.totalDays} ימים)`, ils(-r.gym.used), 'minus');
		row(`דמי ביטול (${r.gym.fullMonths} חודשים × הפרש מחיר; תקרה ${r.gym.capPct}%)`, ils(-r.gym.fee), 'minus');
		row('ההחזר', ils(r.refund), 'total');
	} else if (r.refund !== null && r.fee !== null) {
		row('שולם', ils(r.price));
		row(r.fee > 0 ? `דמי ביטול: ${B.fee.pct}% או ${B.fee.cap} ₪, הנמוך` : 'דמי ביטול: אין', ils(r.fee > 0 ? -r.fee : 0), 'minus');
		if (r.install) { row(`התקנה בבית: עד ${B.fee.install_cap} ₪`, ils(-r.install), 'minus'); }
		row('ההחזר', ils(r.refund), 'total');
		if (r.excess) { row('ניכו יותר מהמותר: מגיע לכם', ils(r.excess), 'warn'); }
	} else {
		return '';
	}
	const due = r.refundDue ? `עד <bdi>${isoToHe(r.refundDue)}</bdi>` : r.route === 'door' ? 'החוק לא קובע מועד' : r.route === 'gym' ? `מ-<bdi>${isoToHe(r.end)}</bdi>` : '';
	return `<figure class="${P}-receipt"><figcaption>קבלה על הביטול</figcaption><table><tbody>${rows.join('')}</tbody></table>`
		+ `<p class="${P}-receipt__due">${due}${r.refundSection ? ` · ${esc(r.refundSection)}` : r.route === 'gym' ? ` · ${esc(B.gym.section)}` : ''}</p>`
		+ `<p class="${P}-receipt__foot">${esc(r.route === 'gym' ? B.gym.cap_he : r.fee > 0 ? `${r.feeSection}. ${B.fee.includes_he}.` : r.route === 'door' ? `${B.door.effects_section}: ${B.door.effects_he}.` : B.fee.none_he)}</p></figure>`;
}

/** The scenario for the simulation: computed facts only, never a name, an ID, an address or a business name. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const what = `${SALE_SHORT[r.sale]}: ${KIND_SHORT[r.kind]} ב-${nis(r.price)}`;
	const when = `העסקה ב-${isoToHe(r.deal)}${r.received ? `, המוצר התקבל ב-${isoToHe(r.received)}` : ''}.`;
	let law;
	if (r.route === 'ongoing') { law = ` לפי ${r.section} החוזה מסתיים עד ${isoToHe(r.end)} ואין חיובים אחרי זה.`; } else if (r.route === 'gym') { law = ` לפי ${r.section} הביטול נכנס לתוקף ב-${isoToHe(r.end)}, דמי הביטול לכל היותר ${nis(r.gym.fee)} וההחזר ${nis(r.refund)}.`; } else if (r.can === 'no' || r.can === 'expired' || r.can === 'policy') { law = ` לפי החוק ${r.can === 'expired' ? `המועד לביטול עבר ב-${isoToHe(r.last)}` : r.can === 'policy' ? 'קובעת מדיניות ההחזרה של החנות' : `אין זכות ביטול (${r.section})`}, ולכן מבקשים ביטול או זיכוי כהסכמה.`; } else {
		law = ` לפי ${r.section} אפשר לבטל${r.last ? ` עד ${isoToHe(r.last)}` : ''}; ${r.fee ? `דמי הביטול לכל היותר ${nis(r.fee)}` : 'בלי דמי ביטול'}, וההחזר ${nis(r.refund || 0)}${r.refundDue ? ` עד ${isoToHe(r.refundDue)}` : ''}.`;
	}
	return `${what}. ${when}${law} סיבת הביטול: ${REASON_HE[r.reason]}. השאלה לתרגול: השיחה עם שירות הלקוחות. איך מודיעים על הביטול ומבקשים אישור בכתב, מה עונים כשמציעים זיכוי במקום כסף או דורשים יותר דמי ביטול, ומה אומרים אם מסרבים?`;
}

/** The share link of this tool, for its siblings: '/bitul-iska/#s=<state>'. Numbers, dates and codes only. */
export function stateLink(reg, input) {
	return `${PAGE}#s=${stateOf(input)}`;
}

/**
 * The small-claims tool (tviot-ktanot) with the claim filled in, by its own keys (W\parts\ktanot\STATE-KEYS.md, published
 * 22.10.2026 21:40): k=ref (a refund not paid after a cancellation), p the refund (shekels), f a fee charged above the law,
 * v the event day (the deal), g the day of the written demand (the cancellation notice when it is in writing).
 */
export function ktanotLink(r) {
	const written = r.channel !== 'phone' && r.channel !== 'store';
	const st = { k: 'ref', p: r.excess ? '' : r.refund || '', f: r.excess || '', v: r.deal, g: written ? r.notice : '' };
	return `${BT_KTANOT}#s=${encodeState(st)}`;
}

/**
 * The remedy tool (pitzui-tzarchan) on the hub, when the business refuses, by its own keys (pitzui-ui.js KEYS and stateOf,
 * read from the pitzui lane's worktree on 22.10.2026 22:15): y the case (r a refund not paid, f a fee above the law, s a
 * subscription still charged, m misleading, d a defect, l a late supply), k where (h door-to-door, s a store by the
 * regulations, p a store's own policy; empty = distance), w b when the reason is the business's breach, a the price, d the
 * deal day, n the notice day, e the fee the business took, H the notice channel of a subscription, K s a late supply in a
 * store, l what was paid. Numbers, dates and codes only.
 */
const PZ_CH = { email: '', web: 'o', mail: 'r', phone: 'p', store: 'i', fax: 'f' };
export function pitzuiLink(r) {
	if (!r || !r.ok) { return BT_PITZUI; }
	const fault = BT_FAULTS.includes(r.reason);
	const where = r.route === 'policy' ? 'p' : r.sale === 'door' ? 'h' : r.sale === 'store' || r.sale === 'event' ? 's' : '';
	let st;
	if (r.route === 'ongoing' || r.route === 'gym') {
		st = { y: 's', n: r.notice, H: PZ_CH[r.channel] || '' };
	} else if (r.reason === 'mislead') {
		st = { y: 'm', a: r.price, d: r.deal, n: r.notice };
	} else if (r.route === 'remedy' && r.reason === 'defect') {
		st = { y: 'd', a: r.price, d: r.deal };
	} else if (r.route === 'remedy' && r.reason === 'late') {
		st = { y: 'l', K: r.sale === 'store' || r.sale === 'event' ? 's' : '', l: r.price };
	} else if (r.excess) {
		st = { y: 'f', k: where, w: fault ? 'b' : '', a: r.price, d: r.deal, n: r.notice, e: r.charged };
	} else {
		st = { y: 'r', k: where, w: fault ? 'b' : '', a: r.price, d: r.deal, n: r.notice };
	}
	return `${BT_PITZUI}#s=${encodeState(st)}`;
}

/** The "what to do now" list: the official route first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const B = reg.consumer_bitul;
	const out = [];
	const links = [];
	out.push({ he: 'הרשות להגנת הצרכן: ביטול עסקה באינטרנט ובחנויות', url: B.authority.page_url });
	if (r.can !== 'no') { out.push({ he: 'תלונה לרשות להגנת הצרכן (טופס מקוון)', url: B.authority.complaint_url }); }
	if (r.claim) { out.push({ he: 'הגשת תביעה קטנה (הרשות השופטת)', url: reg.small_claims.service_url }); }
	if (r.refund) { links.push({ path: ktanotLink(r), he: `העסק לא החזיר ${nis(r.refund)}? תביעה קטנה עם הסכום והאגרה` }); }
	links.push({ path: pitzuiLink(r), he: 'העסק מסרב? מה החוק נותן ופיצוי בלי הוכחת נזק, עם הנתונים שלכם' });
	if (r.kind === 'travel' || r.kind === 'abroad') { links.push({ path: '/law-compensation-cancellation-2012/', he: 'טיסה שבוטלה: פיצוי והחזר לפי חוק שירותי תעופה' }); }
	links.push({ path: '/demand-letter-generator/', he: 'מכתב דרישה לעסק לפני תביעה' });
	links.push({ path: '/legal-tools/?tool=consumer-cancellation', he: 'ניסוח מכתב ביטול עם עוזר מסמכים' });
	return { official: out, links: links.slice(0, 4) };
}

/** The cancellation notice as plain text. priv = { name, id, biz, order, phone } typed by the reader: page only. */
export function noticeText(reg, r, priv = {}) {
	if (!r.ok) { return ''; }
	const B = reg.consumer_bitul;
	const v = (x, ph) => (String(x || '').trim() ? String(x).trim() : `[${ph}]`);
	const L = [];
	L.push(`לכבוד: ${v(priv.biz, 'שם העסק')}`);
	L.push(`תאריך: ${isoToHe(r.notice)}`);
	L.push(`הנדון: הודעה על ביטול עסקה${priv.order ? `, הזמנה מספר ${String(priv.order).trim()}` : ', מספר הזמנה [אם יש]'}`);
	L.push('');
	const law = B.law.he;
	if (r.route === 'ongoing' || r.route === 'gym') {
		L.push(`הריני להודיע על ביטול ${r.kind === 'gym' ? 'המנוי במכון הכושר' : 'העסקה המתמשכת'} שנעשתה ביום ${isoToHe(r.deal)}.`);
		if (r.route === 'gym') {
			L.push(`לפי ${B.gym.law_section} ל${law} ו${B.gym.section} לו, הביטול נכנס לתוקף בתום חודש מיום מסירת הודעה זו, כלומר ב-${isoToHe(r.end)}. אבקש להשיב לי את הסכום ששילמתי בעד התקופה שאחרי מועד זה, בניכוי החלק היחסי עד אליו ודמי ביטול שלא יעלו על ${nis(r.gym.fee)} לפי התוספת, כלומר ${nis(r.refund)}.`);
		} else {
			L.push(`לפי ${B.ongoing.section} ל${law}, החוזה מסתיים בתוך ${r.channel === 'mail' ? B.ongoing.end_business_days_mail : B.ongoing.end_business_days} ימי עסקים ממסירת הודעה זו (עד ${isoToHe(r.end)}). אבקש להפסיק את האספקה ואת החיובים ממועד זה, ולא לחייב בעד תקופה שאחריו.`);
		}
		if (r.pay === 'debit') { L.push(`בנוסף, ההרשאה לחיוב (הוראת הקבע) מבוטלת בהודעה זו, לפי ${B.psl.authz_section} ל${B.psl.he}.`); }
	} else {
		L.push(`הריני להודיע על ביטול העסקה שנעשתה ביום ${isoToHe(r.deal)}${r.received ? ` (המוצר התקבל ביום ${isoToHe(r.received)})` : ''}, בסך ${nis(r.price)}.`);
		const basis = r.route === 'mislead' ? `${B.mislead.section} ל${law}, בשל הטעיה: [תיאור קצר של מה שהוצג ומה התברר]`
			: r.route === 'regs' ? `תקנה 2 ל${B.regs.he}${r.item ? ` (פרט ${r.item.item} לתוספת)` : ''}`
				: r.special4 && r.last === r.special4.last ? `${r.special4.section} ל${law} (${btBuyerHe(reg, r.buyer)})`
					: `${r.section} ל${law}`;
		L.push(`הביטול הוא לפי ${basis}.`);
		if (BT_FAULTS.includes(r.reason)) { L.push(`הביטול הוא בשל ${{ defect: 'פגם במוצר', mismatch: 'אי התאמה בין המוצר או השירות לבין הפרטים שנמסרו לי', late: 'אי אספקה במועד שנקבע' }[r.reason]}, ולכן לפי ${B.fee.none_section} אין לגבות דמי ביטול.`); }
		if (r.refund !== null && r.can !== 'no' && r.can !== 'expired' && r.can !== 'policy') {
			const fee = r.fee ? `, בניכוי דמי ביטול שלא יעלו על ${nis(r.fee)} (${B.fee.pct}% מהמחיר או ${B.fee.cap} ₪, הנמוך), כלומר לפחות ${nis(r.refund)}` : r.install ? `, בניכוי הוצאות התקנה שלא יעלו על ${nis(r.install)}` : ', בלי דמי ביטול';
			const due = r.route === 'regs' ? `במועד הביטול ולא יאוחר מ-${B.store.refund_business_days} ימי עסקים (${B.store.refund_section})` : r.refundDue ? `בתוך ${r.route === 'mislead' ? B.mislead.refund_days : B.distance.refund_days} ימים מיום קבלת הודעה זו, כלומר עד ${isoToHe(r.refundDue)}` : 'בהקדם';
			L.push(`אבקש להשיב לי את התמורה ששילמתי, ${nis(r.price)}${fee}, ${due}${r.pay === 'card' ? ', לבטל את החיוב בכרטיס האשראי ולמסור לי עותק מהודעת ביטול החיוב' : ', באותו אופן שבו שילמתי'}.`);
		}
		const ret = !BT_GOODS.includes(r.kind) ? '' : r.route === 'regs' ? `המוצר מוחזר בבית העסק (${B.store.branches_section})`
			: r.route === 'door' || r.route === 'mislead' || BT_FAULTS.includes(r.reason) ? `המוצר עומד לרשותכם, לאיסוף, במקום שבו נמסר לי (${r.returnSection})`
				: r.route === 'distance' ? `המוצר יוחזר למקום העסק שלכם (${r.returnSection})` : '';
		if (ret && r.can !== 'no' && r.can !== 'expired') { L.push(`${ret}.`); }
	}
	if (r.channel === 'store') {
		L.push(`ההודעה נמסרת בבית העסק, עם הוכחת הקנייה (${B.store.proof_section}).`);
	} else {
		L.push(`ההודעה נמסרת ב${CHANNEL_HE[r.channel]}, דרך שהחוק מתיר (${CHANNEL_SEC[r.channel] || B.channels_section}).`);
	}
	L.push('');
	L.push(`שם: ${v(priv.name, 'שם מלא')}`);
	L.push(`מספר זהות: ${v(priv.id, 'מספר זהות')} (${B.notice_details_section})`);
	L.push(`טלפון לחזרה: ${v(priv.phone, 'טלפון')}`);
	L.push('');
	L.push('בכבוד רב,');
	L.push(v(priv.name, 'שם מלא'));
	return L.join('\n');
}
export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const B = reg.consumer_bitul;
	const h = headline(reg, r);
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	const state = r.can === 'no' ? `<p class="jtool-state jtool-state--danger">✕ אין זכות ביטול לפי החוק: ${esc(r.section)}</p>`
		: r.can === 'expired' ? '<p class="jtool-state jtool-state--danger">! המועד לפי החוק עבר</p>'
			: r.can === 'check' || r.can === 'policy' || r.route === 'remedy' ? `<p class="jtool-state jtool-state--warn">! תלוי בפרטים: ${esc(r.section || 'ראו למטה')}</p>`
				: `<p class="jtool-state jtool-state--ok">✓ אפשר לבטל: ${esc(r.section)}</p>`;
	const rows = [];
	if (r.daysLeft !== null && r.daysLeft >= 0 && r.can !== 'expired' && r.can !== 'no') { rows.push(`<div><dt>ימים עד היום האחרון</dt><dd><bdi>${money(r.daysLeft, 0)}</bdi></dd></div>`); }
	if (r.fee !== null) { rows.push(`<div><dt>דמי ביטול מרביים</dt><dd>${ils(r.fee)}</dd></div>`); }
	if (r.refund !== null) { rows.push(`<div><dt>ההחזר</dt><dd>${ils(r.refund)}</dd></div>`); }
	if (r.refundDue) { rows.push(`<div><dt>הכסף מוחזר עד</dt><dd><bdi>${isoToHe(r.refundDue)}</bdi></dd></div>`); }
	if (r.end) { rows.push(`<div><dt>${r.route === 'gym' ? 'הביטול בתוקף מ-' : 'החיובים נפסקים עד'}</dt><dd><bdi>${isoToHe(r.end)}</bdi></dd></div>`); }
	const why = [];
	if (r.item) { why.push(`<li>${esc(`פרט ${r.item.item} לתוספת לתקנות: ${r.item.he}`)}${cite(r.section, B.regs.url)}</li>`); }
	if (r.excluded) { why.push(`<li>${esc(r.excluded.he)}${cite(r.excluded.section, r.excluded.section.indexOf('תקנה') === 0 ? B.regs.url : B.law.url)}</li>`); }
	r.flags.forEach((f) => why.push(`<li class="${P}-flag ${P}-flag--${f.level}">${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`));
	const chans = r.channels.map((c) => `<li>${esc(c.he)}${cite(c.section, B.law.url)}${c.code === r.channel ? ' <strong>(הבחירה שלכם)</strong>' : ''}</li>`).join('');
	const letter = noticeText(reg, r);
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${esc(SALE_SHORT[r.sale])}, ${esc(KIND_SHORT[r.kind])}${r.buyer !== 'regular' ? `, ${esc(btBuyerHe(reg, r.buyer))}` : ''}</p>`
		+ `<strong class="jtool-verdict__figure">${h.fig}</strong> <span class="${P}-unit">${esc(h.unit)}</span>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ `<div class="${P}-pair">${ribbon(reg, r)}${receipt(reg, r)}</div>`
		+ (why.length ? `<div class="${P}-box"><h3 class="${P}-h">למה, ומה לבדוק</h3><ul class="${P}-why">${why.join('')}</ul></div>` : '')
		+ `<div class="${P}-box"><h3 class="${P}-h">איך מודיעים על הביטול</h3><ul class="${P}-chan">${chans}</ul><p class="${P}-note">${esc(r.channels.length > 1 ? `${B.notice_details_he} (${B.notice_details_section}). שמרו אישור משלוח או צילום מסך.` : `${B.store.proof_he} (${B.store.proof_section}).`)}</p></div>`
		+ `<div class="${P}-box ${P}-letter"><h3 class="${P}-h">הודעת הביטול, מוכנה להעתקה</h3><p class="${P}-note">השם, מספר הזהות, שם העסק ומספר ההזמנה נשארים בדף הזה בלבד: הם לא נכנסים לקישור, לשמירה או לסימולציה.</p>`
		+ `<div class="jtool-row ${P}-priv"><div class="jtool-field"><label class="jtool-label" for="${P}-p-name">שם מלא</label><input id="${P}-p-name" type="text" autocomplete="name" data-${P}-priv="name"></div><div class="jtool-field"><label class="jtool-label" for="${P}-p-id">מספר זהות</label><input id="${P}-p-id" type="text" inputmode="numeric" autocomplete="off" data-${P}-priv="id"></div><div class="jtool-field"><label class="jtool-label" for="${P}-p-biz">שם העסק</label><input id="${P}-p-biz" type="text" autocomplete="organization" data-${P}-priv="biz"></div><div class="jtool-field"><label class="jtool-label" for="${P}-p-order">מספר הזמנה</label><input id="${P}-p-order" type="text" autocomplete="off" data-${P}-priv="order"></div><div class="jtool-field"><label class="jtool-label" for="${P}-p-phone">טלפון</label><input id="${P}-p-phone" type="text" inputmode="tel" autocomplete="tel" data-${P}-priv="phone"></div></div>`
		+ `<pre class="${P}-doc" data-${P}-doc tabindex="0">${esc(letter)}</pre><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-doc">העתקת ההודעה</button></div></div>`
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${BT_SIM('mediation')}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את השיחה עם שירות הלקוחות</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** The rules, one row each, with the window and the section: the page table (compare_table). */
export function rulesTable(reg) {
	const B = reg.consumer_bitul;
	const S = B.store;
	const D = B.distance;
	const H = B.door;
	const SP = B.special;
	const law = B.law.url;
	const regs = B.regs.url;
	const rows = [
		['בחנות: ריהוט, ציוד לבית, מכשירי חשמל, שעונים, מטהרי מים, אריזה סגורה, מוצר שהוזמן', `${S.receipt_days} ימים`, 'מיום קבלת המוצר; פתיחת אריזה אינה שימוש, חיבור לחשמל כן', S.receipt_section, regs],
		['בחנות: ביגוד והנעלה; תכשיט עד 3,000 ש"ח', `${S.nonrest_days_after} ימים שאינם ימי מנוחה`, 'מיום הקנייה; תווית המחיר לא הוסרה', `${S.clothing_section}, ${S.jewel_section}`, regs],
		['בחנות: נופש, נסיעה ובילוי בארץ; חוגים וקורסים', `${S.receipt_days} ימים, ולפחות ${S.before_service_nonrest} ימים שאינם ימי מנוחה לפני השירות`, 'מיום העסקה', S.service_section, regs],
		['בחנות: סלולר, אינטרנט, טלוויזיה, כושר, קוסמטיקה, מועדונים', `${S.receipt_days} ימים`, 'מיום העסקה או קבלת החוזה, המאוחר; גם אם השירות התחיל', S.continuing_section, regs],
		['בחנות: רכב חדש מיבואן', `${S.receipt_days} ימים`, 'מיום העסקה, כל עוד לא נרשם', S.car_section, regs],
		['בחנות: מוצר שלא ברשימה, או עד 50 ש"ח', 'לפי השלט בחנות', 'בלי שלט: חזקה שאפשר להחזיר; אחרי סירוב, 7 ימים', B.policy.section, law],
		['באינטרנט או בטלפון: מוצר', `${D.days} ימים`, 'מיום העסקה ועד 14 ימים מהמאוחר: קבלת המוצר או המסמך', D.goods_section, law],
		['באינטרנט או בטלפון: שירות מתמשך', `${D.days} ימים`, 'מהעסקה או מהמסמך, המאוחר; גם אם התחיל', D.service_section, law],
		['באינטרנט או בטלפון: שירות חד-פעמי', `${D.days} ימים, ולפחות ${D.service_before_nonrest} ימים שאינם ימי מנוחה לפניו`, 'מהעסקה או מהמסמך, המאוחר', D.service_section, law],
		['באינטרנט: הארחה, נסיעה, חופש או בילוי', `${D.days} ימים, לא בתוך ${D.travel_before_nonrest} ימים שאינם ימי מנוחה לפני השירות`, 'מהעסקה או מהמסמך, המאוחר', D.travel_section, law],
		['ברוכלות (מוכר שהגיע הביתה)', `${H.days} ימים`, 'מוצר: מקבלת המוצר או הפרטים; שירות חד-פעמי: רק לפני שהתחיל', H.section, law],
		['אזרח ותיק, אדם עם מוגבלות, עולה חדש', `${SP.months} חודשים`, 'ברוכלות, ובמכר מרחוק שכלל שיחה; מהמאוחר: עסקה, קבלה, מסמך', `${SP.door_section}, ${SP.distance_section}`, law],
		['הטעיה או ניצול מצוקה', 'זמן סביר', 'מהיום שנודע; ההחזר בתוך 7 ימים', B.mislead.section, law],
		['סיום עסקה מתמשכת (מנוי)', `${B.ongoing.end_business_days} ימי עסקים; ${B.ongoing.end_business_days_mail} בדואר רשום`, 'מיום מסירת ההודעה', B.ongoing.section, law],
		['מכון כושר לתקופה קצובה', `חודש; דמי ביטול עד ${B.gym.cap_pcts.join('/')}%`, 'מיום ההודעה בכתב', B.gym.section, law],
		['דמי ביטול', `${B.fee.pct}% או ${B.fee.cap} ש"ח, הנמוך`, 'אין בפגם, אי התאמה, איחור או ברוכלות', `${B.fee.law_section}; ${B.fee.regs_section}`, law],
		['החזר הכסף', `${D.refund_days} ימים; בחנות ${S.refund_business_days} ימי עסקים`, 'מיום קבלת ההודעה, באותו אמצעי תשלום', `${D.refund_section}; ${S.refund_section}`, law],
		['הוראת קבע', `עד ${B.psl.stop_business_days} יום עסקים`, 'מקבלת ההודעה בבנק; חיוב בודד: בתוך 3 ימי עסקים', `${B.psl.authz_section}-${B.psl.charge_section.replace('סעיף ', '')}`, B.psl.url],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>זכות ביטול עסקה לפי סוג העסקה: תוך כמה זמן, ומאיזה יום. ${esc(B.law.he)} (נוסח ל-${isoToHe(B.law.current_to)}), ${esc(B.regs.he)} (נוסח ל-${isoToHe(B.regs.current_to)}) ו${esc(B.psl.he)}; נבדק ${isoToHe(B.checked_on)}. יום העסקה עצמו לא נספר, ויום אחרון ביום מנוחה עובר ליום שאחריו (חוק הפרשנות, סעיף 10).</caption><thead><tr><th scope="col">העסקה</th><th scope="col">כמה זמן</th><th scope="col">מאיזה יום ובאיזה תנאי</th><th scope="col">הסעיף</th></tr></thead><tbody>`
		+ rows.map(([what, len, from, src, url]) => `<tr><td data-th="העסקה">${esc(what)}</td><td data-th="כמה זמן">${esc(len)}</td><td data-th="מאיזה יום">${esc(from)}</td><td data-th="הסעיף">${cite(src, url)}</td></tr>`).join('')
		+ '</tbody></table></div>';
}

/** What changed and when: only dates an official text sets. */
export function changesTable(reg) {
	const rows = reg.consumer_bitul.changes.slice().sort((a, b) => (a.from < b.from ? -1 : 1));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתי"><bdi>${isoToHe(x.from)}</bdi></td><td data-th="מה השתנה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section, x.url)}</td></tr>`).join('')
		+ '</tbody><caption>רק תאריכים שנוסח רשמי קובע (ספר החוקים, קובץ התקנות). שורה עתידית תלויה בכך שהשר לא ידחה את התחילה.</caption></table></div>';
}

function datesTable(reg, r) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = r.today && e.kind !== 'start' && e.date < r.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.he)}</td><td data-th="הכלל">${e.section || e.url ? cite(e.section || 'מקור רשמי', e.url) : ''}</td></tr>`; }).join('')
		+ `</tbody><caption>${esc(reg.consumer_bitul.interpretation.first_day_he)}; ${esc(reg.consumer_bitul.interpretation.rest_he)} (${esc(reg.consumer_bitul.interpretation.he)}, סעיף 10). ${esc(reg.consumer_bitul.business_day_he)}.</caption></table></div>`;
}

function methodList(reg, r) {
	const B = reg.consumer_bitul;
	const I = B.interpretation;
	const items = [];
	items.push(`${SALE_SHORT[r.sale]}, ${KIND_SHORT[r.kind]}: ${r.route === 'regs' ? `${B.regs.he}${r.item ? `, פרט ${r.item.item} לתוספת` : ''}` : r.route === 'policy' ? `מחוץ לרשימת התקנות: ${B.policy.section}` : r.route === 'excluded' ? `חריג: ${r.excluded.section}` : r.section}`);
	if (r.basis && r.last && r.route !== 'gym' && r.route !== 'ongoing') {
		items.push(`תחילת המניין: ${isoToHe(r.basis)} (${r.basisHe}); היום עצמו לא נספר (${I.first_day_section} ל${I.he})`);
		items.push(r.special4 && r.last === r.special4.last ? `${B.special.months} חודשים: ${isoToHe(r.special4.plain)} (${I.months_section})` : r.cutoff && r.last === r.cutoff ? `השירות ב-${isoToHe(r.service)}: לפחות ${r.cutoffN} ימים שאינם ימי מנוחה לפניו, ולכן עד ${isoToHe(r.cutoff)}` : `${isoToHe(r.plain)}${r.rolled ? `, יום מנוחה, ולכן ${isoToHe(r.last)} (${I.rest_section})` : ''}`);
	}
	if (r.route === 'ongoing') { items.push(`הודעה ב-${isoToHe(r.notice)} + ${r.channel === 'mail' ? B.ongoing.end_business_days_mail : B.ongoing.end_business_days} ימי עסקים = ${isoToHe(r.end)} (${B.ongoing.section}; ${B.business_day_he})`); }
	if (r.route === 'gym') {
		const G = r.gym;
		items.push(`הודעה ב-${isoToHe(r.notice)} + חודש = ${isoToHe(G.effective)}; תקופה ${r.months} חודשים, עד ${isoToHe(G.end)}`);
		items.push(`שימוש יחסי: ${nis(r.price)} × ${G.usedDays} / ${G.totalDays} ימים = ${nis(G.used)}`);
		items.push(`דמי ביטול: ${G.fullMonths} חודשים × (${G.alt === null ? 'אין מסלול חלופי בכתב' : `${nis(G.alt)} − ${nis(r.price / r.months)}`}) = ${nis(G.feeRaw)}; תקרה: הנמוך מ-${G.capPct}% (${nis(G.cap1)}, שליש ${G.third}) ומיתרת התקופה (${nis(G.remaining)}): ${nis(G.fee)}`);
		items.push(`ההחזר: ${nis(r.price)} − ${nis(G.used)} − ${nis(G.fee)} = ${nis(r.refund)}`);
	}
	if (r.fee !== null && r.route !== 'gym') { items.push(r.fee > 0 ? `דמי ביטול: ${B.fee.pct}% × ${nis(r.price)} = ${nis(r.price * B.fee.pct / 100)}, ולכל היותר ${nis(B.fee.cap)}: ${nis(r.fee)} (${r.feeSection})` : `דמי ביטול: אין (${r.feeSection})`); }
	if (r.refund !== null && r.route !== 'gym') { items.push(`ההחזר: ${nis(r.price)} − ${nis(r.fee)}${r.install ? ` − ${nis(r.install)} התקנה` : ''} = ${nis(r.refund)}${r.refundDue ? `, עד ${isoToHe(r.refundDue)} (${r.refundSection})` : ''}`); }
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

/** The one-page print: inputs, result, the computation, the dates, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const B = reg.consumer_bitul;
	return '<h3>ביטול עסקה: סיכום</h3>'
		+ `<p><strong>הנתונים:</strong> ${esc(SALE_SHORT[r.sale])}; ${esc(KIND_SHORT[r.kind])}; ${nis(r.price)}; עסקה ${isoToHe(r.deal)}${r.received ? `; קבלה ${isoToHe(r.received)}` : ''}${r.service ? `; שירות ${isoToHe(r.service)}` : ''}; ${esc(btBuyerHe(reg, r.buyer))}; ${esc(REASON_HE[r.reason])}; הודעה ${isoToHe(r.notice)} ב${esc(CHANNEL_HE[r.channel])}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p>${methodList(reg, r)}`
		+ `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.he)}`).join('; ')}.</p>`
		+ `<p><strong>מקורות:</strong> ${esc(B.law.he)}, נוסח ל-${isoToHe(B.law.current_to)}; ${esc(B.regs.he)}, נוסח ל-${isoToHe(B.regs.current_to)}; ${esc(B.interpretation.he)}; ${esc(B.psl.he)}, נוסח בנק ישראל ל-${isoToHe(B.psl.current_to)}; ${esc(B.authority.he)}, עודכן ${isoToHe(B.authority.page_updated)}. נבדק ${isoToHe(B.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חושב, צעד אחר צעד</h3></div>${methodList(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">כל המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${datesTable(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || r.today || reg.consumer_bitul.checked_on)}</div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): the example's last day (or the reader's, once they
 * change anything), the fee and the refund in one line, and a jump to the form. Same markup on the server and in the
 * browser, so the card never shifts the layout. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לבדוק את העסקה שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">ביטול עסקה</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const h = headline(reg, r);
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}${SALE_SHORT[r.sale]}, ${KIND_SHORT[r.kind]}, ${nis(r.price)}`;
	const money1 = r.refund !== null && r.route !== 'gym' ? ` דמי ביטול ${nis(r.fee)}, החזר ${nis(r.refund)}${r.refundDue ? ` עד ${isoToHe(r.refundDue)}` : ''}.` : '';
	const line = `${r.section ? `לפי ${r.section}.` : ''}${money1} הודעת ביטול מוכנה, קובץ ליומן ותרגול השיחה עם השירות.`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${h.fig}</strong><span class="jtool-lead__unit">${esc(h.unit)}</span></p><p class="jtool-lead__line">${esc(line.trim())}</p>${go}`;
}

export function snapshot(reg) {
	const r = btCompute(reg, EXAMPLE);
	const B = reg.consumer_bitul;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.refund,
		sticky: `<bdi>${isoToHe(r.last)}</bdi>`,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: EXAMPLE.today }),
		method: `<ol><li>הזמנה באתר, בלי פגישה עם המוכר: עסקת מכר מרחוק${cite(B.distance.define_section, B.law.url)}</li>`
			+ `<li>מוצר: מיום העסקה (${isoToHe(EXAMPLE.deal)}) ועד ${B.distance.days} ימים מקבלת המוצר (${isoToHe(EXAMPLE.received)}); יום הקבלה עצמו לא נספר${cite(B.distance.goods_section, B.law.url)}${cite(B.interpretation.first_day_section, B.interpretation.url)}</li>`
			+ `<li>היום האחרון: ${isoToHe(r.last)}${r.rolled ? ', אחרי מעבר מיום מנוחה' : ''}</li>`
			+ `<li>דמי ביטול: ${B.fee.pct}% מ-${nis(r.price)} = ${nis(r.fee)}, פחות מ-${nis(B.fee.cap)}${cite(B.fee.law_section, B.law.url)}</li>`
			+ `<li>ההחזר ${nis(r.refund)} בתוך ${B.distance.refund_days} ימים מקבלת ההודעה: עד ${isoToHe(r.refundDue)}${cite(B.distance.refund_section, B.law.url)}</li></ol>`,
		compare_table: rulesTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

const SA = { distance: 'd', store: 't', door: 'h', event: 'e', ongoing: 'o' };
const KI = { electric: 'el', furniture: 'fu', home: 'ho', watch: 'wt', water: 'wp', sealed: 'se', ordered: 'or', clothing: 'cl', jewelry: 'je', car: 'ca', goods: 'go', food: 'fo', medicine: 'me', perishable: 'pe', underwear: 'un', custom: 'cu', media: 'md', info: 'in', gas: 'ga', travel: 'tr', abroad: 'ab', course: 'co', continuing: 'cn', gym: 'gy', service: 'sv' };
const BU = { regular: 'r', senior: 's', disability: 'd', immigrant: 'i' };
const RE = { mind: 'm', defect: 'd', mismatch: 'x', late: 'l', mislead: 't' };
const PA = { card: 'c', cash: 'h', cheque: 'q', debit: 'd', transfer: 't' };
const CH = { email: 'e', web: 'w', phone: 'p', mail: 'm', fax: 'f', store: 's' };
const FL = { opened: 'o', used: 'u', tagOff: 't', assembled: 'a', vouchers: 'g', late6: 'l', conversation: 'c', started: 's', installed: 'i', registered: 'r', abroadPolicy: 'p', fixedTerm: 'f' };
const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
export const KEYS = ['s', 'k', 'b', 'r', 'p', 'y', 'n', 'd', 'c', 'o', 'v', 'x', 'f', 'm', 'a', 'g'];
export function stateOf(i) {
	const numOr = (v) => (v === '' || v === undefined || v === null || Number.isNaN(Number(v)) ? '' : Math.round(Number(v) * 100) / 100);
	return encodeState({
		s: SA[i.sale] || 'd', k: KI[i.kind] || 'go', b: BU[i.buyer] || 'r', r: RE[i.reason] || 'm', p: numOr(i.price), y: PA[i.pay] || 'c', n: CH[i.channel] || '',
		d: i.deal || '', c: i.sale !== 'ongoing' && BT_GOODS.includes(i.kind) ? i.received || '' : '', o: i.doc || '', v: i.service || '', x: i.notice || '',
		f: BT_FLAGS.filter((k) => i[k]).map((k) => FL[k]).join(''), m: numOr(i.months), a: numOr(i.alt), g: numOr(i.charged),
	});
}
export function inputOf(s) {
	if (!s || !s.d) { return null; }
	const num = (v) => (v === undefined || v === '' ? '' : Number(v));
	const out = Object.assign({}, BT_BLANK, {
		sale: back(SA, s.s, 'distance'), kind: back(KI, s.k, 'goods'), buyer: back(BU, s.b, 'regular'), reason: back(RE, s.r, 'mind'), price: num(s.p),
		pay: back(PA, s.y, 'card'), channel: back(CH, s.n, ''), deal: s.d, received: s.c || '', doc: s.o || '', service: s.v || '', notice: s.x || '',
		months: num(s.m), alt: num(s.a), charged: num(s.g),
	});
	if (!out.channel) { out.channel = out.sale === 'store' || out.sale === 'event' ? 'store' : 'email'; }
	const fl = String(s.f || '');
	BT_FLAGS.forEach((k) => { out[k] = fl.includes(FL[k]); });
	return out;
}

/* ---------------- Browser ---------------- */

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const amt = (id) => { const v = String(val(id)).replace(/[,\s₪]/g, ''); return v === '' ? '' : Number(v); };
	const out = {
		sale: pick('sale', 'distance'), kind: val('kind') || 'goods', buyer: pick('buyer', 'regular'), reason: pick('reason', 'mind'), price: amt('price'),
		pay: val('pay') || 'card', channel: val('chan') || '', deal: btIso(val('deal')), received: btIso(val('rec')), doc: btIso(val('doc')), service: btIso(val('svc')),
		notice: btIso(val('ntc')), today, months: amt('months'), alt: amt('alt'), charged: amt('chg'),
	};
	BT_FLAGS.forEach((k) => { out[k] = Boolean(root.querySelector(`input[name="${P}-f-${k}"]:checked`)); });
	return out;
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const B = reg.consumer_bitul;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	let last = null;
	const priv = {};
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(B.checked_on, B.refresh_every_days) || (B.next_update && today >= B.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהחוק התעדכן'); }
	}
	const ids = { deal: 'deal', received: 'rec', doc: 'doc', service: 'svc', notice: 'ntc', price: 'price', months: 'months', alt: 'alt', charged: 'chg', kind: 'kind' };
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
	const refreshDoc = () => {
		const pre = root.querySelector(`[data-${P}-doc]`);
		if (pre && last && last.ok) { pre.textContent = noticeText(reg, last, priv); }
		root.querySelectorAll(`[data-${P}-priv]`).forEach((el) => { const k = el.getAttribute(`data-${P}-priv`); if (priv[k] && el.value !== priv[k]) { el.value = priv[k]; } });
	};
	const sync = (input) => {
		const goods = BT_GOODS.includes(input.kind);
		const timed = ['travel', 'abroad', 'course', 'service', 'gym'].includes(input.kind);
		form.querySelectorAll('[data-if-goods]').forEach((el) => { el.hidden = !(goods && input.sale !== 'ongoing'); });
		form.querySelectorAll('[data-if-timed]').forEach((el) => { el.hidden = !timed; });
		form.querySelectorAll('[data-if-reason]').forEach((el) => { el.hidden = input.sale === 'ongoing'; });
		form.querySelectorAll('[data-if-gym]').forEach((el) => { el.hidden = !(input.sale === 'ongoing' && input.kind === 'gym'); });
		form.querySelectorAll('[data-flag]').forEach((el) => { el.hidden = !btFlagShown(input, el.getAttribute('data-flag')); });
		const key = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return input.deal === addDays(input.today || today, -p.deal) && p.sale === input.sale && p.kind === input.kind && String(p.price) === String(input.price) && (p.buyer || 'regular') === input.buyer && (p.reason || 'mind') === input.reason; }) || '';
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = btCompute(reg, input);
		last = r;
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { printedOn: today });
		refreshDoc();
		const h = headline(reg, r);
		if (sticky) { sticky.innerHTML = h.fig; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: btBand(r) }); }
		return r;
	};
	// A different sale type changes the list of kinds: the form is redrawn with the reader's answers.
	const current = () => readForm(root, today);
	const schedule = (ev) => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = null;
			const input = current();
			if (ev && ev.target && ev.target.name === `${P}-sale`) {
				if (!KINDS_FOR(input.sale).includes(input.kind)) { input.kind = input.sale === 'ongoing' ? 'continuing' : 'goods'; }
				input.channel = input.sale === 'store' || input.sale === 'event' ? 'store' : (input.channel === 'store' ? 'email' : input.channel);
				form.innerHTML = renderForm(reg, input);
			}
			sync(input);
			run(input);
		}, 160);
	};
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
	} else {
		last = btCompute(reg, EXAMPLE);
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	// The letter's private fields: kept in this closure only, never read by readForm, stateOf, store or track.
	result.addEventListener('input', (ev) => {
		const k = ev.target && ev.target.getAttribute && ev.target.getAttribute(`data-${P}-priv`);
		if (!k) { return; }
		priv[k] = ev.target.value;
		const pre = root.querySelector(`[data-${P}-doc]`);
		if (pre && last && last.ok) { pre.textContent = noticeText(reg, last, priv); }
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
			const input = btPreset(b.getAttribute('data-preset'), today);
			if (!input) { return; }
			own = true;
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		const input = own ? current() : Object.assign({}, EXAMPLE);
		const r = act === 'copy-doc' || act === 'rehearse' ? last : run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r && r.ok) {
			download('bitul-iska.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `ביטול עסקה: ${e.he}`, description: `${e.section || 'מקור רשמי'}. חושב ב-jus-tice.co.il לפי כלל החוק. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק תאריכים, סכומים וקודים, בלי שמות ובלי תעודת זהות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(B.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy-doc' && r && r.ok) {
			const ok = await copyText(noticeText(reg, r, priv));
			toast(root, ok ? 'ההודעה הועתקה. הדביקו אותה בדואר האלקטרוני או בטופס הביטול של העסק.' : 'לא הצלחנו להעתיק; סמנו את הטקסט והעתיקו ידנית.');
			track('tool_download', { tool_id: TOOL_ID, type: 'letter' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: btBand(r) });
			const brief = r && r.ok ? aiBrief(reg, r) : '';
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
			toast(root, 'נשמר במכשיר הזה בלבד, בלי השם ומספר הזהות. אפשר למחוק בכל רגע.');
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
