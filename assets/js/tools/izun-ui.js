/**
 * Family wave UI: property balancing (איזון משאבים), HAD-506.
 * One picture from the subject: a balance beam. Each spouse's balanced net worth is a bar; the dashed line is the middle
 * both end at; the arrow is the payment that brings them there (half the difference, s.6(ב)). The item table says the
 * same in text, each line with its section or ruling, and every disputed item (options, crypto, a home in one name)
 * is shown as a range or a second scenario, never folded into one silent number.
 */
import { computeBalance, IZ_KINDS } from './izun-engine.js';
import { parseDate } from './dates.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState,
	track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'izun';
const P = 'jt17';
const WHO = { a: "בן/בת הזוג א'", b: "בן/בת הזוג ב'", joint: 'שניכם' };
const SHORT = { a: "א'", b: "ב'", joint: 'משותף' };
const COLS = ['pension', 'hishtalmut', 'severance', 'savings', 'car', 'debt'];
const ACCRUE = ['pension', 'hishtalmut', 'severance', 'gemel'];

export const EXAMPLE = {
	marriage: '2012-06-01', breakDate: '2026-03-01', filed: '', apart: '', before1974: false, method: 'time', cryptoAt: 'today',
	home: { value: 2600000, mortgage: 900000, owner: 'joint', source: '', activeGain: '' },
	a: { pension: [520000, 80000], hishtalmut: [140000, 20000], severance: ['', ''], savings: [60000], car: [70000], debt: [30000] },
	b: { pension: [260000, 30000], hishtalmut: [90000, ''], severance: ['', ''], savings: [40000], car: [''], debt: [''] },
	others: [{ owner: 'b', kind: 'savings', value: 300000, exclude: 'inheritance', label: 'ירושה מההורים' }],
	options: [{ owner: 'a', units: 1200, price: 180, strike: 0, grant: '2024-03-01', vestStart: '2024-03-01', vestEnd: '2028-03-01', tranches: 16 }],
	crypto: [{ owner: 'b', units: 0.4, priceBreak: 240000, priceToday: 260000, where: 'exchange' }],
};

// The hi-tech page (/rsu-options-crypto/): the same family, with the options and the crypto open first.
export const EXAMPLE_HON = Object.assign({}, EXAMPLE, { others: [] });

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ` <span class="jtool-cite">${esc(text)}</span>`; }
const nis = (n) => `${money(Math.round(n), 0)} ₪`;
const v0 = (x) => (x === '' || x === undefined || x === null ? '' : x);

/** The engine's input from the form model (the same shape the share link and the snapshot use). */
export function toInput(m) {
	const items = [];
	const h = m.home || {};
	if (v0(h.value) !== '' || v0(h.mortgage) !== '' || (h.source === 'premarital' && v0(h.activeGain) !== '')) {
		items.push({ kind: 'home', main: true, owner: h.owner || 'joint', value: h.value, mortgage: h.mortgage, exclude: h.source || '', activeGain: h.source === 'premarital' ? h.activeGain : '', label: 'דירת המגורים' });
	}
	for (const o of ['a', 'b']) {
		const s = m[o] || {};
		for (const k of COLS) {
			const row = s[k] || [];
			if (v0(row[0]) === '' && v0(row[1]) === '') { continue; }
			items.push({ kind: k, owner: o, value: row[0], atMarriage: ACCRUE.includes(k) ? row[1] : '' });
		}
	}
	for (const x of m.others || []) {
		if (v0(x.value) === '') { continue; }
		items.push({ kind: IZ_KINDS.includes(x.kind) ? x.kind : 'other', owner: x.owner, value: x.value, exclude: x.exclude || '', linked: x.kind === 'debt' && Boolean(x.exclude), label: x.label || '' });
	}
	return {
		marriage: m.marriage, breakDate: m.breakDate, filed: m.filed, apart: m.apart, before1974: m.before1974,
		method: m.method, cryptoAt: m.cryptoAt, items, options: m.options || [], crypto: m.crypto || [],
	};
}

/* ---------------- Pure renderers ---------------- */

function moneyField(id, label, v, hint) {
	return `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v0(v) === '' ? '' : money(v, Number(v) % 1 ? 2 : 0))}" placeholder="0" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}
function dateField(id, label, iso, hint) {
	return `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(iso ? isoToHe(iso) : '')}" placeholder="לדוגמה: 1.6.2012" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}
function numField(id, label, v, hint) {
	return `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v0(v))}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}
function select(id, label, options, value) {
	return `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><select id="${P}-${id}">${options.map(([v, t]) => `<option value="${esc(v)}"${String(value) === String(v) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></div>`;
}

function sideColumn(reg, o, s) {
	const pb = reg.property_balance;
	const row = (k, accr) => {
		const r = s[k] || [];
		const label = k === 'debt' ? 'חובות (לא משכנתא)' : pb.kinds[k].he;
		return `<div class="jt17-acc">${moneyField(`${o}-${k}`, label, r[0])}${accr ? moneyField(`${o}-${k}-m`, 'מתוך זה, ביום הנישואין', r[1]) : ''}</div>`;
	};
	return `<div class="jt17-side"><p class="jt9-col__h">${esc(WHO[o])}</p>${COLS.map((k) => row(k, ACCRUE.includes(k))).join('')}</div>`;
}

function otherRow(x, i) {
	const kinds = [['savings', 'חיסכון או כסף'], ['home', 'נדל"ן נוסף'], ['car', 'רכב'], ['business', 'עסק'], ['other', 'נכס אחר'], ['debt', 'חוב']];
	const excl = [['', 'נכנס לאיזון'], ['premarital', 'היה לפני הנישואין'], ['gift', 'מתנה'], ['inheritance', 'ירושה'], ['nii', 'גמלה או פיצוי נזק גוף'], ['agreed', 'הסכמנו בכתב לא לאזן']];
	return `<li class="jtool-rep__row jt17-other" data-other="${i}">`
		+ select(`ot-${i}-owner`, 'של מי', [['a', WHO.a], ['b', WHO.b], ['joint', WHO.joint]], x.owner || 'a')
		+ select(`ot-${i}-kind`, 'מה', kinds, x.kind || 'savings')
		+ moneyField(`ot-${i}-value`, 'שווי', x.value)
		+ select(`ot-${i}-excl`, 'לאיזון?', excl, x.exclude || '')
		+ `<button class="jtool-iconbtn" type="button" data-remove-other="${i}" aria-label="מחיקת שורה ${i + 1}">✕</button></li>`;
}

export function renderForm(reg, m) {
	const pb = reg.property_balance;
	const h = m.home || {};
	const opt = (m.options && m.options[0]) || {};
	const cr = (m.crypto && m.crypto[0]) || {};
	return `<div class="jtool-row">${dateField('marriage', 'תאריך הנישואין', m.marriage)}${dateField('break', 'מועד הקרע', m.breakDate, 'בדרך כלל היום שבו הפסקתם לנהל קופה משותפת')}</div>`
		+ `<fieldset class="jtool-field jt17-home"><legend>דירת המגורים</legend><div class="jtool-row">${moneyField('h-value', 'שווי הדירה היום', h.value)}${moneyField('h-mort', 'יתרת המשכנתא', h.mortgage)}</div>`
		+ `<div class="jtool-row">${select('h-owner', 'רשומה על שם', [['joint', 'שנינו'], ['a', "רק א'"], ['b', "רק ב'"]], h.owner || 'joint')}${select('h-source', 'איך הגיעה', [['', 'נקנתה בנישואין'], ['premarital', 'הייתה לפני הנישואין'], ['gift', 'מתנה בנישואין'], ['inheritance', 'ירושה בנישואין']], h.source || '')}</div>`
		+ `<div data-if-active${h.source === 'premarital' ? '' : ' hidden'}>${moneyField('h-active', 'עליית ערך שנוצרה במאמץ בנישואין (שיפוץ, בנייה)', h.activeGain, 'נכנסת לאיזון; עליית ערך מהשוק לבד לא (בע"מ 3462/23)')}</div></fieldset>`
		+ `<div class="jt17-sides">${sideColumn(reg, 'a', m.a || {})}${sideColumn(reg, 'b', m.b || {})}</div>`
		+ `<p class="jtool-hint">פנסיה, השתלמות ופיצויים: את היתרה של היום, ובשורה השנייה כמה היה ביום הנישואין (מופיע בדוח השנתי של הקופה). רק מה שנצבר אחרי הנישואין מתאזן (סעיפים 5(א)(1) ו-5(ג)).</p>`
		+ `<details class="jtool-more"${(m.others || []).length ? ' open' : ''}><summary>נכסים נוספים, ירושות ומתנות</summary><ul class="jtool-rep" data-others>${(m.others || []).map(otherRow).join('')}</ul><button class="jtool-linkbtn" type="button" data-add-other>+ עוד נכס</button></details>`
		+ `<details class="jtool-more"${opt.units ? ' open' : ''}><summary>אופציות ו-RSU</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${select('op-owner', 'הוענקו ל', [['a', WHO.a], ['b', WHO.b]], opt.owner || 'a')}${numField('op-units', 'כמה יחידות הוענקו', opt.units)}</div>`
		+ `<div class="jtool-row">${moneyField('op-price', 'מחיר ליחידה היום', opt.price)}${moneyField('op-strike', 'מחיר מימוש (ב-RSU: 0)', opt.strike)}</div>`
		+ `<div class="jtool-row">${dateField('op-grant', 'יום ההענקה', opt.grant)}${numField('op-tr', 'במכמה מנות שוות מבשילות', opt.tranches, 'למשל 4 שנתיות או 16 רבעוניות')}</div>`
		+ `<div class="jtool-row">${dateField('op-vs', 'תחילת ההבשלה', opt.vestStart)}${dateField('op-ve', 'סוף ההבשלה', opt.vestEnd)}</div>`
		+ `<fieldset class="jtool-field"><legend>הגישה לשורת הסיכום</legend><div class="jtool-chips">${[['time', 'כלל הזמן'], ['vested', 'רק מה שהבשיל'], ['granted', 'כל מה שהוענק']].map(([v, t]) => `<label class="jtool-chip"><input type="radio" name="${P}-method" value="${v}"${(m.method || 'time') === v ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('')}</div></fieldset></details>`
		+ `<details class="jtool-more"${cr.units ? ' open' : ''}><summary>קריפטו</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${select('cr-owner', 'של מי', [['a', WHO.a], ['b', WHO.b]], cr.owner || 'b')}${numField('cr-units', 'כמה יחידות', cr.units)}</div>`
		+ `<div class="jtool-row">${moneyField('cr-pb', 'מחיר ליחידה במועד הקרע', cr.priceBreak)}${moneyField('cr-pt', 'מחיר ליחידה היום', cr.priceToday)}</div>`
		+ `<div class="jtool-row">${select('cr-where', 'איפה מוחזק', [['exchange', 'בבורסה (Exchange)'], ['wallet', 'בארנק פרטי']], cr.where || 'exchange')}<fieldset class="jtool-field"><legend>שווי בשורת הסיכום</legend><div class="jtool-chips">${[['today', 'היום'], ['break', 'במועד הקרע']].map(([v, t]) => `<label class="jtool-chip"><input type="radio" name="${P}-cat" value="${v}"${(m.cryptoAt || 'today') === v ? ' checked' : ''}><span>${esc(t)}</span></label>`).join('')}</div></fieldset></div></details>`
		+ `<details class="jtool-more"${m.filed || m.apart ? ' open' : ''}><summary>איזון לפני הגירושין ונישואין לפני 1974</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${dateField('filed', 'יום פתיחת תביעת הגירושין או התביעה הרכושית', m.filed)}${dateField('apart', 'מאיזה יום אתם חיים בנפרד', m.apart, 'גם תחת אותה קורת גג')}</div>`
		+ `<div class="jtool-chips"><label class="jtool-chip"><input type="checkbox" name="${P}-pre" value="1"${m.before1974 ? ' checked' : ''}><span>נישאנו לפני 1.1.1974</span></label></div>`
		+ `<p class="jtool-hint">${esc(pb.early.shorten_he)}.</p></details>`;
}

function payerText(r) {
	if (!r.payer) { return 'אין תשלום: השווי המאוזן של שניכם שווה'; }
	return `${r.payer === 'a' ? WHO.a : WHO.b} משלם/ת ל${r.payer === 'a' ? WHO.b : WHO.a}`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const lead = r.payer ? `${payerText(r)} ${nis(r.pay)}: מחצית ההפרש בין ${nis(Math.max(r.a.net, r.b.net))} ל-${nis(Math.min(r.a.net, r.b.net))} (סעיף 6(ב)).` : `${payerText(r)}.`;
	const rng = r.range.min !== r.range.max ? ` לפי הגישות לאופציות ולמועד השווי של הקריפטו, ההפרש נע בין ${rangeText(r.range.min)} ל-${rangeText(r.range.max)}.` : '';
	const sh = r.sharedHome ? ` אם יוכח שיתוף ספציפי בדירה, הדירה של שניכם חצי-חצי, ובנוסף ${r.sharedHome.payer ? `${r.sharedHome.payer === 'a' ? "א'" : "ב'"} משלם/ת ${nis(r.sharedHome.pay)}` : 'אין תשלום'}.` : '';
	return lead + rng + sh;
}
function rangeText(diff) {
	if (Math.abs(diff) < 0.005) { return 'אפס'; }
	return `${diff > 0 ? "א' משלם/ת" : "ב' משלם/ת"} ${nis(Math.abs(diff) / 2)}`;
}

/** The balance beam: both nets as bars on one scale, the middle line, and the transfer. */
function beam(r) {
	const max = Math.max(1, Math.abs(r.a.net), Math.abs(r.b.net));
	const w = (x) => Math.max(0, Math.round((Math.max(0, x) / max) * 1000) / 10);
	const mid = (r.a.net + r.b.net) / 2;
	const bar = (o, s) => `<div class="jt17-bar"><span class="jt17-bar__who">${esc(SHORT[o])}</span><span class="jt17-bar__track"><i class="jt17-bar__fill jt17-bar__fill--${o}" style="width:${w(s.net)}%"></i><i class="jt17-bar__mid" style="inset-inline-start:${w(mid)}%" aria-hidden="true"></i></span><bdi class="jt17-bar__v">${esc(nis(s.net))}</bdi></div>`;
	return `<figure class="jt17-beam" aria-label="השווי המאוזן של כל אחד והאמצע שאליו מגיעים"><div class="jt17-beam__bars">${bar('a', r.a)}${bar('b', r.b)}</div>`
		+ `<figcaption>הקו המקווקו הוא האמצע, ${esc(nis(mid))}. ${r.payer ? `התשלום: ${esc(nis(r.pay))} מ${r.payer === 'a' ? "א' ל-ב'" : "ב' ל-א'"}.` : 'אין העברה.'}</figcaption></figure>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state ${r.outOfScope ? 'jtool-state--info' : 'jtool-state--danger'}">${r.outOfScope ? 'מחוץ לתחום של הכלי' : '✕ צריך לתקן את הקלט'}</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const ranged = r.range.min !== r.range.max;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי חוק יחסי ממון ופסיקת העליון</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${esc(payerText(r))}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.pay, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ (ranged ? `<p class="jtool-scope">הטווח: ${esc(rangeText(r.range.min))} עד ${esc(rangeText(r.range.max))}. הסכום הגדול מוצג למעלה לפי ${esc(r.method === 'time' ? 'כלל הזמן' : r.method === 'vested' ? 'מה שהבשיל' : 'כל מה שהוענק')}${r.crypto.length ? ` ושווי הקריפטו ${r.cryptoAt === 'break' ? 'במועד הקרע' : 'היום'}` : ''}.</p>` : '')
		+ `</div>`
		+ beam(r)
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '');
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const pb = reg.property_balance;
	const caseUrl = (key) => ((pb.cases.find((c) => c.key === key) || {}).url || pb.law_url);
	const sourceLink = (sec) => {
		if (/3462\/23/.test(sec)) { return cite(sec, caseUrl('3462_23')); }
		if (/16405/.test(sec)) { return cite(sec, caseUrl('bs_16405')); }
		if (/^סעיף/.test(sec)) { return cite(sec, pb.law_url); }
		return cite(sec, '');
	};
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-items-h">כל נכס: נכנס לאיזון או לא, ולמה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-items-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">של מי</th><th scope="col">מה</th><th scope="col">שווי</th><th scope="col">לאיזון</th><th scope="col">למה</th></tr></thead><tbody>`
		+ r.lines.map((l) => `<tr${l.inBalance ? '' : ' class="jtool-muted"'}><td data-th="של מי">${esc(SHORT[l.owner] || '')}</td><td data-th="מה">${esc(l.label)}${l.estimate ? ' (אומדן)' : ''}</td><td data-th="שווי">${ils(l.value, 0)}</td><td data-th="לאיזון">${l.counted ? ils(l.counted, 0) : 'לא'}</td><td data-th="למה">${esc(l.why)}${sourceLink(l.section)}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="של מי">${"א'"}</td><td data-th="מה">נכסים לאיזון פחות חובות</td><td data-th="שווי">${ils(r.a.balanced, 0)} − ${ils(r.a.debts, 0)}</td><td data-th="לאיזון">${ils(r.a.net, 0)}</td><td data-th="למה">סעיף 6(א)</td></tr>`
		+ `<tr class="jtool-table__total"><td data-th="של מי">${"ב'"}</td><td data-th="מה">נכסים לאיזון פחות חובות</td><td data-th="שווי">${ils(r.b.balanced, 0)} − ${ils(r.b.debts, 0)}</td><td data-th="לאיזון">${ils(r.b.net, 0)}</td><td data-th="למה">סעיף 6(א)</td></tr></tbody>`
		+ `<caption>${esc(payerText(r))}${r.payer ? ` ${esc(nis(r.pay))}: מחצית ההפרש (סעיף 6(ב)), בכסף או בעין` : ''}. איזון הוא חיוב כספי ואינו משנה את הרישום (בע"מ 5620/24, פסקה 20).</caption></table></div></div>`;
	if (r.options.length) {
		const o = r.options[0];
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-opt-h">אופציות ו-RSU: שלוש קריאות</h3></div>`
			+ `<div class="jt7-scns jt17-scns">${['vested', 'time', 'granted'].map((k) => `<div class="jt7-scn${r.method === k ? ' jt7-scn--here' : ''}"><p>${esc(k === 'vested' ? 'רק מה שהבשיל עד מועד הקרע' : k === 'time' ? 'כלל הזמן' : 'כל מה שהוענק בנישואין')}</p><strong>${ils(o.balanced[k], 0)}</strong><small>${esc(o.units_by[k].toLocaleString('en-US', { maximumFractionDigits: 1 }))} יחידות לאיזון; ${esc(pb.options.methods[k].source_short)}</small></div>`).join('')}</div>`
			+ `<p class="jt7-scns__note">${esc(pb.options.valuation_he)}. ${esc(pb.options.tax_he)}.</p>`
			+ `<div class="jtool-scroll" role="region" aria-label="מנות ההבשלה" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מבשילה ב</th><th scope="col">יחידות</th><th scope="col">חלק בנישואין</th><th scope="col">הבשילה עד הקרע</th></tr></thead><tbody>`
			+ o.rows.map((t) => `<tr><td data-th="מבשילה ב"><bdi>${isoToHe(t.vest)}</bdi></td><td data-th="יחידות"><bdi>${t.units.toLocaleString('en-US', { maximumFractionDigits: 2 })}</bdi></td><td data-th="חלק בנישואין"><bdi>${Math.round(t.frac * 100)}%</bdi></td><td data-th="הבשילה עד הקרע">${t.vested ? 'כן' : 'לא'}</td></tr>`).join('')
			+ `</tbody><caption>כלל הזמן: החלק מתקופת ההבשלה של כל מנה (מיום ההענקה עד יום ההבשלה) שעבר בנישואין ועד מועד הקרע.${cite('תלה"מ 16405-09-19', caseUrl('bs_16405'))}</caption></table></div></div>`;
	}
	if (r.crypto.length) {
		const c = r.crypto[0];
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-cry-h">קריפטו: שני מועדי שווי</h3></div>`
			+ `<div class="jt7-scns jt10-fees"><div class="jt7-scn${r.cryptoAt === 'break' ? ' jt7-scn--here' : ''}"><p>במועד הקרע</p><strong>${ils(c.atBreak, 0)}</strong><small>${esc(pb.crypto.at_break_he)}</small></div><div class="jt7-scn${r.cryptoAt === 'today' ? ' jt7-scn--here' : ''}"><p>היום</p><strong>${ils(c.today, 0)}</strong><small>${esc(pb.crypto.at_today_he)}</small></div><div class="jt7-scn"><p>ההבדל בתשלום</p><strong>${ils(Math.abs(c.today - c.atBreak) / 2, 0)}</strong><small>מחצית ההפרש בין שני המועדים</small></div></div></div>`;
	}
	if (r.variants.length > 1) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-var-h">אותה משפחה, כל הקריאות</h3></div><div class="jtool-scroll" role="region" aria-labelledby="${P}-var-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">אופציות</th><th scope="col">קריפטו</th><th scope="col">התוצאה</th></tr></thead><tbody>`
			+ r.variants.map((v) => `<tr${v.method === r.method && v.cryptoAt === r.cryptoAt ? ' class="jtool-table__total"' : ''}><td data-th="אופציות">${esc(v.method === 'time' ? 'כלל הזמן' : v.method === 'vested' ? 'מה שהבשיל' : 'כל מה שהוענק')}</td><td data-th="קריפטו">${r.crypto.length ? esc(v.cryptoAt === 'break' ? 'מועד הקרע' : 'היום') : '—'}</td><td data-th="התוצאה">${esc(rangeText(v.diff))}</td></tr>`).join('')
			+ `</tbody></table></div></div>`;
	}
	const pens = r.lines.some((l) => l.kind === 'pension' && l.counted > 0);
	if (pens || r.early.length) {
		const ps = pb.pension_split;
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-next-h">מה עושים עם התוצאה</h3></div><ol class="jtool-steps">`
			+ (pens ? `<li>פנסיה מתחלקת דרך הקופה: מגישים לה את פסק הדין והעתק תעודת זהות, בדואר רשום או במסירה אישית; הקופה קולטת תוך ${ps.intake_business_days} ימי עסקים, רושמת הערה תוך ${ps.register_business_days}, ומעבירה ${ps.transfer_days} ימים אחרי ההודעה, ${esc(ps.cap_he)}.${cite('חוק החלוקה, סעיפים 3, 4, 6', ps.url)}${cite('התקנות', ps.regs_url)}</li>` : '')
			+ r.early.map((e) => `<li>אפשר לבקש איזון עוד לפני הגירושין מ-<bdi>${isoToHe(e.date)}</bdi> (${esc(e.key === 'filed' ? 'שנה מפתיחת ההליך' : '9 חודשי פירוד מתוך שנה')}).${cite(e.section, pb.law_url)}</li>`).join('')
			+ `<li>${esc(pb.break_he)}.${cite('תלה"מ 23952-08-19', caseUrl('jlm_23952'))}</li></ol></div>`;
	}
	return out
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3>מה לבדוק עם עורך דין</h3></div><ul class="jtool-notes">${reg.property_balance.lawyer_he.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
}

/** Page section: three families, the same law (the comparison table of the page). */
export function compareTable(reg) {
	const fams = [
		{ he: 'דירה משותפת, פנסיות שונות', m: Object.assign({}, EXAMPLE, { options: [], crypto: [], others: [] }) },
		{ he: 'כמו למעלה, ועוד RSU לבן הזוג א\'', m: Object.assign({}, EXAMPLE, { crypto: [], others: [] }) },
		{ he: 'הדירה הייתה של א\' לפני הנישואין', m: Object.assign({}, EXAMPLE, { options: [], crypto: [], others: [], home: { value: 2600000, mortgage: 0, owner: 'a', source: 'premarital', activeGain: '' } }) },
	];
	const rows = fams.map((f) => {
		const r = computeBalance(reg, toInput(f.m));
		return `<tr><td data-th="המשפחה">${esc(f.he)}</td><td data-th="מי משלם">${esc(r.ok ? payerText(r) : '')}</td><td data-th="כמה">${r.ok ? ils(r.pay, 0) : '—'}</td><td data-th="אם יוכח שיתוף בדירה (הדירה חצי-חצי, ועוד)">${r.ok && r.sharedHome ? ils(r.sharedHome.pay, 0) : '—'}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מאותו מנוע של הכלי, תאריכי הנישואין והקרע: 1.6.2012 ו-1.3.2026</caption><thead><tr><th scope="col">המשפחה</th><th scope="col">מי משלם</th><th scope="col">כמה</th><th scope="col">אם יוכח שיתוף בדירה (הדירה חצי-חצי, ועוד)</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the rules of property balancing, each with its section or ruling (the "numbers" part). */
export function numbersTable(reg) {
	const pb = reg.property_balance;
	const c = (key) => pb.cases.find((x) => x.key === key) || { url: pb.law_url, he: '', para_he: '', holding_he: '' };
	const law = (sec) => cite(sec, pb.law_url);
	const ruling = (key) => cite(`${c(key).he}, ${c(key).para_he}`, c(key).url);
	const ps = pb.pension_split;
	const rows = [
		['מה מתאזן', 'כל הנכסים שנצברו מיום הנישואין ועד מועד האיזון, על שם מי שלא יהיו רשומים', law('סעיף 5(א)')],
		['פנסיה, פיצויים, קרן השתלמות', 'נכללים באיזון, רק החלק שנצבר בנישואין', law('סעיף 5(ג)')],
		['מה לא מתאזן', 'נכסים מלפני הנישואין, מתנות, ירושות, גמלת ביטוח לאומי, פיצוי על נזק גוף, ומה שהסכמתם בכתב', law('סעיף 5(א)(1)-(3)')],
		['חובות', 'כל אחד מנכה את החובות שלו; אין שיתוף כללי בחובות אישיים', law('סעיף 6(א)') + ruling('6839_19')],
		['כמה משלמים', 'מי ששווה יותר משלם לשני מחצית ההפרש בין שווי הנכסים נטו', law('סעיף 6(ב)')],
		['מתי אפשר לבקש', `שנה אחרי פתיחת הליך, או ${pb.early.apart_months} חודשי פירוד מתוך ${pb.early.window_months}; אפשר מוקדם יותר בצו הגנה או אלימות`, law('סעיף 5א')],
		['מועד הקרע', 'בדרך כלל היום שבו הפסקתם לנהל קופה משותפת; החוק עצמו לא מגדיר אותו', ruling('jlm_23952') + law('סעיף 8(3)')],
		['דירה על שם אחד', 'אין חזקת שיתוף; שיתוף ספציפי דורש "דבר מה נוסף"', ruling('1398_11') + ruling('5620_24')],
		['נכס מלפני הנישואין שעלה בערכו', 'עליית ערך אקטיבית (מעבודה ומשאבים משותפים) מתאזנת; עלייה פסיבית לא', ruling('3462_23')],
		['אופציות ו-RSU', 'מה שהוענק בנישואין, לפי החלק מתקופת ההבשלה שעבר בנישואין, ולפי השווי במימוש', ruling('bs_16405')],
		['חלוקת פנסיה בפועל', `הקופה פותחת חשבון נפרד, עד מחצית היתרה במועד הפירוד, והעברה ${ps.transfer_days} ימים אחרי ההודעה`, cite('חוק 2014, סעיף 3(2)', ps.url)],
		['נישאו לפני 1.1.1974', 'הסדר איזון המשאבים לא חל; חל הדין שקדם לחוק', law('סעיף 14')],
		['סטייה מחצי-חצי', 'בנסיבות מיוחדות בית המשפט רשאי לקבוע יחס אחר, להחריג נכסים או להקדים את מועד השווי', law('סעיף 8')],
	];
	return `<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>איזון משאבים: הכללים, כל שורה עם המקור</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map(([a, b, x]) => `<tr><td data-th="מה">${esc(a)}</td><td data-th="הכלל">${esc(b)}</td><td data-th="מקור">${x}</td></tr>`).join('')
		+ `</tbody></table></div><p class="jtool-updated">נבדק מול החוק בנבו ופסקי הדין באתר בית המשפט העליון ב-${esc(isoToHe(pb.checked_on))}.</p></div>`;
}

/** The figure in the sticky bar. */
export function stickyFigure(r) { return r.ok ? ils(r.pay, 0) : '—'; }

export function snapshot(reg) {
	const r = computeBalance(reg, toInput(EXAMPLE));
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.pay,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>שמים כל נכס של כל אחד, כולל פנסיה, השתלמות, פיצויים וחסכונות${cite('סעיפים 5(א) ו-5(ג)', reg.property_balance.law_url)}</li>`
			+ `<li>מוציאים את מה שלא מתאזן: מה שהיה לפני הנישואין, מתנות, ירושות, גמלאות ופיצוי נזק גוף, ומה שהסכמתם בכתב${cite('סעיף 5(א)', reg.property_balance.law_url)}</li>`
			+ `<li>מנכים מכל אחד את החובות שלו, חוץ מחובות על נכס שלא מתאזן${cite('סעיף 6(א)', reg.property_balance.law_url)}</li>`
			+ `<li>מי ששווה יותר נותן לשני מחצית ההפרש: ${esc(payerText(r))}${r.payer ? ` ${esc(nis(r.pay))}` : ''}${cite('סעיף 6(ב)', reg.property_balance.law_url)}</li>`
			+ `<li>אופציות, קריפטו ודירה על שם אחד מוצגים כטווח או כתרחיש נוסף, כי אין להם נוסחה בחוק.</li></ol>`,
		compare_table: compareTable(reg),
		numbers: numbersTable(reg),
		sticky: stickyFigure(r),
		sentence: verdictSentence(reg, r),
		hon: honSnapshot(reg),
	};
}

/** Mode "hon": options, RSUs and crypto first; the method and the comparison are about them. */
function honSnapshot(reg) {
	const r = computeBalance(reg, toInput(EXAMPLE_HON));
	const o = r.options[0];
	const c = r.crypto[0];
	const pb = reg.property_balance;
	const caseUrl = (key) => ((pb.cases.find((x) => x.key === key) || {}).url || pb.law_url);
	return {
		input: EXAMPLE_HON, total: r.pay, sticky: stickyFigure(r),
		form: renderForm(reg, EXAMPLE_HON), result: renderResult(reg, r, { example: true }), details: renderDetails(reg, r),
		method: `<ol><li>אופציות ו-RSU שהוענקו בנישואין: כל מנה לפי החלק מתקופת ההבשלה שלה שעבר עד מועד הקרע (כלל הזמן)${cite('תלה"מ 16405-09-19, פסקה 23', caseUrl('bs_16405'))}</li>`
			+ `<li>בדוגמה: ${esc(o ? `${o.units.toLocaleString('en-US')} יחידות; כלל הזמן ${money(o.balanced.time, 0)} ₪, רק מה שהבשיל ${money(o.balanced.vested, 0)} ₪, כל מה שהוענק ${money(o.balanced.granted, 0)} ₪` : '')}</li>`
			+ `<li>השווי: בבאר שבע לפי מועד המימוש בפועל, והעליון לא התערב${cite('בע"מ 7482/18', caseUrl('7482_18'))}</li>`
			+ `<li>קריפטו: ${esc(c ? `במועד הקרע ${money(c.atBreak, 0)} ₪, היום ${money(c.today, 0)} ₪` : '')}. החוק: שווי במועד האיזון, או מועד מוקדם שבית המשפט קובע${cite('סעיף 8(3)', pb.law_url)}</li></ol>`,
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readModel(root) {
	const val = (id) => ((root.querySelector(`#${P}-${id}`) || {}).value || '').trim();
	const m$ = (id) => { const v = val(id); return v === '' ? '' : parseMoney(v); };
	const d$ = (id) => { const v = val(id); return v === '' ? '' : (parseDate(v) || v); };
	const n$ = (id) => { const v = val(id).replace(/,/g, ''); return v === '' ? '' : (Number.isFinite(Number(v)) ? Number(v) : NaN); };
	const side = (o) => Object.fromEntries(COLS.map((k) => [k, [m$(`${o}-${k}`), ACCRUE.includes(k) ? m$(`${o}-${k}-m`) : '']]));
	const others = [...root.querySelectorAll('[data-other]')].map((li) => {
		const i = li.getAttribute('data-other');
		return { owner: val(`ot-${i}-owner`) || 'a', kind: val(`ot-${i}-kind`) || 'savings', value: m$(`ot-${i}-value`), exclude: val(`ot-${i}-excl`) };
	});
	const units = n$('op-units');
	const cunits = n$('cr-units');
	return {
		marriage: d$('marriage'), breakDate: d$('break'), filed: d$('filed'), apart: d$('apart'),
		before1974: Boolean(root.querySelector(`input[name="${P}-pre"]:checked`)),
		method: (root.querySelector(`input[name="${P}-method"]:checked`) || {}).value || 'time',
		cryptoAt: (root.querySelector(`input[name="${P}-cat"]:checked`) || {}).value || 'today',
		home: { value: m$('h-value'), mortgage: m$('h-mort'), owner: val('h-owner') || 'joint', source: val('h-source'), activeGain: m$('h-active') },
		a: side('a'), b: side('b'), others,
		options: [units, m$('op-price'), d$('op-grant'), d$('op-vs'), d$('op-ve'), n$('op-tr')].every((x) => x === '') ? [] : [{ owner: val('op-owner') || 'a', units, price: m$('op-price'), strike: m$('op-strike') === '' ? 0 : m$('op-strike'), grant: d$('op-grant'), vestStart: d$('op-vs'), vestEnd: d$('op-ve'), tranches: n$('op-tr') }],
		crypto: [cunits, m$('cr-pb'), m$('cr-pt')].every((x) => x === '') ? [] : [{ owner: val('cr-owner') || 'b', units: cunits, priceBreak: m$('cr-pb'), priceToday: m$('cr-pt'), where: val('cr-where') || 'exchange' }],
	};
}

/* Share link: dates and amounts only, in the fragment. */
const ov = (v) => (v === '' || v === undefined || v === null ? -1 : v);
export const stateOf = (m) => encodeState({
	m: m.marriage, k: m.breakDate, f: m.filed, s: m.apart, q: m.before1974 ? 1 : '', t: m.method === 'time' ? '' : m.method, c: m.cryptoAt === 'today' ? '' : 'b',
	h: [[ov(m.home.value), m.home.mortgage || 0], [{ joint: 0, a: 1, b: 2 }[m.home.owner] || 0, { '': 0, premarital: 1, gift: 2, inheritance: 3 }[m.home.source] || 0], [m.home.activeGain || 0, 0]],
	a: COLS.map((k) => [ov(m.a[k][0]), ov(m.a[k][1])]), b: COLS.map((k) => [ov(m.b[k][0]), ov(m.b[k][1])]),
	o: m.options.length ? [[{ a: 1, b: 2 }[m.options[0].owner] || 1, m.options[0].units], [ov(m.options[0].price), m.options[0].strike || 0], [(m.options[0].grant || '').replace(/-/g, ''), (m.options[0].vestStart || '').replace(/-/g, '')], [(m.options[0].vestEnd || '').replace(/-/g, ''), ov(m.options[0].tranches)]] : '',
	x: m.crypto.length ? [[{ a: 1, b: 2 }[m.crypto[0].owner] || 2, m.crypto[0].units], [ov(m.crypto[0].priceBreak), ov(m.crypto[0].priceToday)], [m.crypto[0].where === 'wallet' ? 1 : 0, 0]] : '',
	e: m.others.length ? m.others.map((x) => [`${{ a: 1, b: 2, joint: 3 }[x.owner] || 1}${['savings', 'home', 'car', 'business', 'other', 'debt'].indexOf(x.kind) + 1}${['', 'premarital', 'gift', 'inheritance', 'nii', 'agreed'].indexOf(x.exclude || '')}`, ov(x.value)]) : '',
});
const KEYS = ['m', 'k', 'f', 's', 'q', 't', 'c', 'h', 'a', 'b', 'o', 'x', 'e'];
const ymd = (x) => (/^\d{8}$/.test(x) ? `${x.slice(0, 4)}-${x.slice(4, 6)}-${x.slice(6, 8)}` : '');
export function modelOf(s) {
	if (!s.m || !s.k) { return null; }
	const pairs = (txt) => String(txt || '').split('~').map((p) => p.split('_'));
	const num = (x) => (x === undefined || x === '' || x === '0' ? '' : Number(x));
	const h = pairs(s.h);
	const zo = (x) => (x === undefined || x === '' || x === '-1' ? '' : Number(x));
	const side = (txt) => { const p = pairs(txt); return Object.fromEntries(COLS.map((k, i) => [k, [zo((p[i] || [])[0]), zo((p[i] || [])[1])]])); };
	const o = s.o ? pairs(s.o) : null;
	const x = s.x ? pairs(s.x) : null;
	return {
		marriage: s.m, breakDate: s.k, filed: s.f || '', apart: s.s || '', before1974: s.q === '1', method: s.t || 'time', cryptoAt: s.c === 'b' ? 'break' : 'today',
		home: { value: zo(h[0] && h[0][0]), mortgage: num(h[0] && h[0][1]), owner: ['joint', 'a', 'b'][Number(h[1] && h[1][0]) || 0], source: ['', 'premarital', 'gift', 'inheritance'][Number(h[1] && h[1][1]) || 0], activeGain: num(h[2] && h[2][0]) },
		a: side(s.a), b: side(s.b),
		others: s.e ? pairs(s.e).map(([code, v]) => ({ owner: ['a', 'b', 'joint'][Number(code[0]) - 1] || 'a', kind: ['savings', 'home', 'car', 'business', 'other', 'debt'][Number(code[1]) - 1] || 'savings', exclude: ['', 'premarital', 'gift', 'inheritance', 'nii', 'agreed'][Number(code[2])] || '', value: zo(v) })) : [],
		options: o ? [{ owner: o[0][0] === '2' ? 'b' : 'a', units: Number(o[0][1]), price: zo(o[1][0]), strike: Number(o[1][1]) || 0, grant: ymd(o[2][0]), vestStart: ymd(o[2][1]), vestEnd: ymd(o[3][0]), tranches: zo(o[3][1]) }] : [],
		crypto: x ? [{ owner: x[0][0] === '1' ? 'a' : 'b', units: Number(x[0][1]), priceBreak: zo(x[1][0]), priceToday: zo(x[1][1]), where: x[2][0] === '1' ? 'wallet' : 'exchange' }] : [],
	};
}


export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const pb = reg.property_balance;
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(pb.checked_on, pb.refresh_every_days)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהפסיקה התעדכנה'); }
	}
	const ids = { marriage: 'marriage', breakDate: 'break', filed: 'filed', apart: 'apart' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok || r.outOfScope) { return; }
		for (const e of r.errors) {
			let id = ids[e.field];
			const om = /^opt-0-(\w+)$/.exec(e.field);
			if (om) { id = { units: 'op-units', price: 'op-price', strike: 'op-strike', tranches: 'op-tr', grant: 'op-grant', vestStart: 'op-vs', vestEnd: 'op-ve' }[om[1]]; }
			const cm = /^cry-0-(\w+)$/.exec(e.field);
			if (cm) { id = { units: 'cr-units', priceBreak: 'cr-pb', priceToday: 'cr-pt' }[cm[1]]; }
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const src = (root.querySelector(`#${P}-h-source`) || {}).value;
		form.querySelectorAll('[data-if-active]').forEach((el) => { el.hidden = src !== 'premarital'; });
	};
	const run = (m, opts = {}) => {
		const r = computeBalance(reg, toInput(m));
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = stickyFigure(r); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.payer ? (r.pay > 500000 ? 'large' : 'some') : 'none' }); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readModel(root)); }, 180);
	};
	const fromHash = modelOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const add = ev.target.closest('[data-add-other]');
		const rm = ev.target.closest('[data-remove-other]');
		if (add || rm) {
			const m = readModel(root);
			if (add) { m.others.push({ owner: 'a', kind: 'savings', value: '', exclude: '' }); } else { m.others.splice(Number(rm.getAttribute('data-remove-other')), 1); }
			form.innerHTML = renderForm(reg, m);
			form.querySelectorAll('details').forEach((d) => { if (d.querySelector('[data-others]')) { d.open = true; } });
			sync();
			run(m);
			const last = form.querySelector('[data-other]:last-child select');
			if (add && last) { last.focus(); }
			return;
		}
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		const m = readModel(root);
		const r = run(m, { silent: true });
		const link = shareUrl(stateOf(m));
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if ((act === 'link' || act === 'save') && !r.ok) {
			// A link or a saved copy of answers the tool rejects would come back as different answers (review, PR 130).
			toast(root, 'יש שדה שצריך לתקן. תקנו אותו, ואז אפשר לשתף או לשמור.');
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק תאריכים וסכומים, בלי שמות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק יחסי ממון ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const lines = r.lines.map((l) => `${SHORT[l.owner] || ''} | ${l.label} | ${money(l.value, 0)} ₪ | לאיזון: ${l.counted ? `${money(l.counted, 0)} ₪` : 'לא'} | ${l.section}`);
			const ok = await copyText(`${verdictSentence(reg, r)}\n\n${lines.join('\n')}\n\n(חושב ב-jus-tice.co.il, ${isoToHe(pb.checked_on)}. מידע כללי, לא ייעוץ משפטי.)`);
			toast(root, ok ? 'התוצאה והטבלה הועתקו.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? 'ok' : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(m));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = modelOf(decodeState(store.get(saveKey) || '', KEYS));
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
