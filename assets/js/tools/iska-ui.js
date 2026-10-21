/**
 * The family + land wave UI (HAD-579): the closing ledger of an apartment deal (alut-iska, prefix jt44).
 * The picture is a closing cash-flow strip: four stations of the deal (before signing, the signing day, the tax day,
 * registration or payoff), each with its payments and the running total, the tax station on its statutory date. The
 * ledger table under it is the text equivalent (caption, column headers, one row per payment with its rule and the
 * running total). Then: the lawyer's fee against the Bar's non-binding tariff, the seller's advance and the one-click
 * link into the mas-shevach tool, the dated deadlines (.ics), the scenario for the simulation and the next steps; a
 * one-page closing sheet prints on its own.
 */
import { ikCompute, ikBar, IK_TRACKS, IK_STAGES } from './iska-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'alut-iska';
const P = 'jt44';
const IK_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=real-estate';

export const EXAMPLE = { side: 'buy', price: 2400000, date: '2026-11-15', track: 'single', aliyah: '', mortgage: true, feeMode: 'pct', fee: 0.5, feeVat: false, broker: '', appraiser: '', advisor: '', other: '', early: '', payoff: 'none', buyDate: '', buyPrice: '', status: 'single', exempt: false };
/** One click to the seller's view of the same deal (the chip "מוכרים"): the example sale. */
export const SELL_EXAMPLE = { side: 'sell', price: 2400000, date: '2026-11-15', feeMode: 'pct', fee: 0.5, feeVat: false, broker: 2, appraiser: '', other: '', early: '', payoff: 'direct', buyDate: '2012-05-01', buyPrice: 1300000, status: 'qualified', exempt: false, track: 'single', aliyah: '', mortgage: false, advisor: '' };

const TRACK_HE = { single: 'דירה יחידה', additional: 'דירה נוספת', replacement: 'דירה חלופית (אמכור את הקודמת)', oleh: 'עולה חדש', disabled: 'נכה, עיוור או נפגע (תקנה 11)' };
const STATUS_HE = { single: 'דירה יחידה (אפשר שתהיה פטורה)', qualified: 'דירת מגורים אחרת', other: 'נכס שאינו דירת מגורים' };
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const ikMoney = (n) => ils(n, n % 1 ? 2 : 0);
function ikCite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const ikChip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
function ikToIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
/** A price band for the brief: "כ-2.4 מיליון ₪" (one decimal), never the exact price. */
function ikBand(price) {
	if (price >= 1000000) { return `כ-${(Math.round(price / 100000) / 10).toLocaleString('en-US')} מיליון ₪`; }
	return `כ-${money(Math.round(price / 10000) * 10000, 0)} ₪`;
}
const ikIsSell = (r) => r.side === 'sell';

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const sell = input.side === 'sell';
	const hide = (on) => (on ? '' : ' hidden');
	const moneyField = (id, label, v, hint, cls = '') => `<div class="jtool-field${cls}"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : money(v, 0))}" placeholder="0" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>${hint ? `<p class="jtool-hint">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const dateField = (id, label, v, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const pctField = (id, label, v, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v ?? '')}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">%</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const fixed = input.feeMode === 'fixed';
	const pt = reg.purchase_tax;
	return `<fieldset class="jtool-field"><legend>מה עושים</legend><div class="jtool-chips ${P}-side">${ikChip('side', 'buy', 'קונים דירה', !sell)}${ikChip('side', 'sell', 'מוכרים דירה', sell)}</div></fieldset>`
		+ `<div class="jtool-row">${moneyField('price', 'מחיר הדירה', input.price, '')}${dateField('date', 'יום החתימה על החוזה', input.date, 'לדוגמה: 15.11.2026')}</div>`
		+ `<div data-${P}-if="buy"${hide(!sell)}><fieldset class="jtool-field"><legend>מסלול מס הרכישה</legend><div class="jtool-chips">${IK_TRACKS.map((k) => ikChip('trk', k, TRACK_HE[k], (input.track || 'single') === k)).join('')}</div>`
		+ `<p class="jtool-hint">${esc(pt.couple_he)}. המסלול המלא, כולל קנייה מקבלן ודירה חלופית, במחשבון מס הרכישה.</p></fieldset>`
		+ `<div data-${P}-if="oleh"${hide(!sell && input.track === 'oleh')}>${dateField('aly', 'תאריך העלייה', input.aliyah, 'לדוגמה: 1.5.2024')}</div>`
		+ `<div class="jtool-chips">${ikChip('mtg', '1', 'לוקחים משכנתה (רישום משכנתה בטאבו)', input.mortgage, 'checkbox')}</div></div>`
		+ `<fieldset class="jtool-field"><legend>שכר הטרחה של עורך הדין: לפי ההצעה שקיבלתם</legend><div class="jtool-chips">${ikChip('fm', 'pct', 'אחוז מהמחיר', !fixed)}${ikChip('fm', 'fixed', 'סכום קבוע', fixed)}</div>`
		+ `<div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-fee">${fixed ? 'הסכום בהצעה' : 'האחוז בהצעה'}</label><div class="jtool-input${fixed ? ' jtool-input--money' : ''}"><input id="${P}-fee" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.fee === '' || input.fee === undefined ? '' : fixed ? money(input.fee, 0) : input.fee)}" placeholder="${fixed ? 'לדוגמה: 9,000' : 'לדוגמה: 0.5'}" aria-describedby="${P}-fee-h ${P}-fee-e"><span class="jtool-input__suffix" aria-hidden="true">${fixed ? '₪' : '%'}</span></div><p class="jtool-error" id="${P}-fee-e" role="alert"></p></div>`
		+ `<div class="jtool-field ${P}-end"><div class="jtool-chips">${ikChip('fv', '1', 'הסכום בהצעה כבר כולל מע"מ', input.feeVat, 'checkbox')}</div></div></div>`
		+ `<p class="jtool-hint" id="${P}-fee-h">אין שכר טרחה שנקבע בחוק לעסקת דירה; המספר בדוגמה הוא להמחשה בלבד. מע"מ ${pt.vat_pct}% מ-${isoToHe(pt.vat_from)} נוסף לסכום, אלא אם סימנתם שהוא כלול.</p></fieldset>`
		+ `<div data-${P}-if="sell"${hide(sell)}><fieldset class="jtool-field"><legend>הדירה שמוכרים: לקישור למחשבון מס השבח</legend><div class="jtool-row">${dateField('bd', 'מתי קניתם אותה', input.buyDate, 'לדוגמה: 1.5.2012')}${moneyField('bp', 'כמה שילמתם עליה', input.buyPrice, '')}</div>`
		+ `<div class="jtool-chips">${Object.keys(STATUS_HE).map((k) => ikChip('st', k, STATUS_HE[k], (input.status || 'single') === k)).join('')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${ikChip('ex', '1', 'מבקשים פטור ממס שבח לדירת מגורים מזכה', input.exempt, 'checkbox')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>המשכנתה על הדירה</legend><div class="jtool-chips">${ikChip('po', 'none', 'אין משכנתה', !['direct', 'deposit'].includes(input.payoff))}${ikChip('po', 'direct', 'נפרעת ישירות לבנק', input.payoff === 'direct')}${ikChip('po', 'deposit', 'הכסף מופקד בלשכת רישום המקרקעין', input.payoff === 'deposit')}</div></fieldset></div>`
		+ `<details class="jtool-more"${input.broker || input.appraiser || input.advisor || input.other || input.early ? ' open' : ''}><summary>עוד עלויות: תיווך, שמאי, יועץ, פירעון מוקדם</summary><div class="jtool-row" style="margin-top:8px">${pctField('brk', 'דמי תיווך (לפני מע"מ)', input.broker, '0 אם אין מתווך')}${moneyField('apr', 'שמאי', input.appraiser, '')}</div>`
		+ `<div class="jtool-row"><div data-${P}-if="buy"${hide(!sell)}>${moneyField('adv', 'יועץ משכנתאות', input.advisor, '')}</div><div data-${P}-if="sell"${hide(sell)}>${moneyField('ear', 'עמלת פירעון מוקדם', input.early, 'הסכום שבמכתב הבנק')}</div>${moneyField('oth', 'עלויות אחרות', input.other, '')}</div>`
		+ '<p class="jtool-hint">את הסכומים האלה קובעים ההצעות וההסכמים שלכם. אין להם מחיר רשמי, ולכן הכלי לא ממלא אותם.</p></details>';
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	if (ikIsSell(r)) {
		return `עלויות המכירה של דירה ב-${nis(r.price)}: ${nis(r.total)}${r.lawyer.gross ? `, מהן שכר טרחה ${nis(r.lawyer.gross)} כולל מע"מ` : ''}${r.broker.gross ? ` ותיווך ${nis(r.broker.gross)}` : ''}. בלי מס השבח: ההצהרה עד ${isoToHe(r.events[1].date)} והתשלום עד ${isoToHe(r.events[2].date)}.`;
	}
	return `קנייה של ${TRACK_HE[r.tax.track]} ב-${nis(r.price)}: מעבר למחיר עוד ${nis(r.total)}, ${r.pctOfPrice}% מהמחיר. מס רכישה ${nis(r.tax.amount)} עד ${isoToHe(r.events[2].date)}${r.lawyer.gross ? `, שכר טרחה ${nis(r.lawyer.gross)} כולל מע"מ` : ''}, ואגרות רישום ${nis(r.lines.filter((l) => l.payee === 'רישום המקרקעין').reduce((s, l) => s + l.amount, 0))}.`;
}

function ikStageLabel(r, s) {
	const sell = ikIsSell(r);
	return {
		before: 'לפני החתימה',
		sign: 'ביום החתימה',
		tax: sell ? 'מס השבח' : 'יום תשלום המס',
		close: sell ? 'בפירעון ובמסירה' : 'ברישום בטאבו',
	}[s];
}
function ikStageDate(r, s) {
	if (s === 'sign') { return r.on; }
	if (s === 'tax') { return r.events[2].date; }
	return '';
}

/** The picture: the closing cash-flow strip. Visual only (aria-hidden); the ledger table under it says the same. */
export function strip(reg, r) {
	const max = Math.max(r.total, 1);
	let run = 0;
	const stations = IK_STAGES.map((s) => {
		const items = r.lines.filter((l) => l.stage === s);
		const sum = r.stageTotals[s];
		run += sum;
		const d = ikStageDate(r, s);
		const empty = !items.length && !(s === 'tax' && ikIsSell(r));
		const body = items.map((l) => `<li><span>${esc(l.he.replace(/ \(.*\)$/, ''))}</span><b>${nis(l.amount)}</b></li>`).join('')
			+ (s === 'tax' && ikIsSell(r) ? '<li><span>מס שבח: לפי החישוב במחשבון</span><b>?</b></li>' : '');
		return `<li class="${P}-st${empty ? ` ${P}-st--empty` : ''}" style="--${P}-h:${(Math.max(run, 0) / max * 100).toFixed(1)}%"><p class="${P}-st__when">${esc(ikStageLabel(r, s))}${d ? ` <bdi>${isoToHe(d)}</bdi>` : ''}</p>`
			+ `<ul class="${P}-st__items">${body || '<li><span>אין תשלום</span></li>'}</ul>`
			+ `<p class="${P}-st__run"><span class="${P}-st__bar" aria-hidden="true"><i></i></span>מצטבר <bdi>${money(Math.round(run * 100) / 100, run % 1 ? 2 : 0)}</bdi> ₪</p></li>`;
	}).join('');
	return `<ol class="${P}-strip" aria-hidden="true">${stations}</ol>`;
}

/** The ledger: one row per payment, its station and date, who is paid, the rule, the amount and the running total. */
export function ledger(reg, r) {
	const rows = r.lines.map((l) => {
		const d = l.date || ikStageDate(r, l.stage);
		const rule = l.official ? ikCite(l.item, l.url) : 'לפי ההצעה או ההסכם שלכם';
		const vat = l.vat ? `<small>${nis(l.net)} ועוד מע"מ ${r.vatRate}% ${nis(l.vat)}</small>` : '';
		return `<tr><td data-th="מתי">${esc(ikStageLabel(r, l.stage))}${d ? ` <bdi>${isoToHe(d)}</bdi>` : ''}</td><th scope="row">${esc(l.he)}${l.amount === 0 ? ' (פטור)' : ''}<small>למי: ${esc(l.payee)} · ${rule}</small></th><td data-th="סכום">${ikMoney(l.amount)}${vat}</td><td data-th="מצטבר">${ikMoney(l.running)}</td></tr>`;
	}).join('');
	const sum = `${r.lines.length} תשלומים, ${nis(r.total)} בסך הכול: ${nis(r.officialTotal)} לפי חוק ותקנות${r.ownTotal ? `, ${nis(r.ownTotal)} לפי ההצעות שלכם` : ''}.`;
	return `<div class="${P}-ledgerwrap"><p class="jtool-visually-hidden" id="${P}-ledger-sum">${esc(sum)}</p>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-ledger-cap" tabindex="0"><table class="${P}-ledger" aria-describedby="${P}-ledger-sum"><caption id="${P}-ledger-cap">פנקס הסגירה: כל תשלום, מתי, למי ולפי מה${ikIsSell(r) ? ' (בלי מס השבח עצמו)' : ''}</caption>`
		+ '<thead><tr><th scope="col">מתי</th><th scope="col">מה, למי ולפי מה</th><th scope="col">סכום</th><th scope="col">מצטבר</th></tr></thead>'
		+ `<tbody>${rows}</tbody><tfoot><tr class="${P}-total"><th scope="row" colspan="2">סך הכול${ikIsSell(r) ? ' עלויות המכירה' : ' מעבר למחיר הדירה'}</th><td colspan="2">${ikMoney(r.total)}</td></tr></tfoot></table></div></div>`;
}

/** The lawyer's fee next to what the law says: the Bar's non-binding tariff and the one-lawyer rule. */
export function feeBox(reg, r) {
	const fl = reg.fl_iska;
	const b = fl.bar;
	const quote = r.lawyer.gross ? `ההצעה שלכם: ${nis(r.lawyer.net)} לפני מע"מ${r.feeMode === 'fixed' ? `, ${r.feePctOfPrice}% מהמחיר` : ''}, ${nis(r.lawyer.gross)} כולל מע"מ.` : 'לא הזנתם הצעת מחיר.';
	const draft = r.bar.byAgreement ? esc(b.drafting.top_he) : `${nis(r.bar.drafting)} ועוד מע"מ`;
	return `<div class="${P}-fee"><h4>שכר הטרחה: מה הדין קובע</h4><p>${esc(quote)}</p>`
		+ `<ul class="${P}-list"><li>אין שכר טרחה מחייב לעסקת דירה. ${esc(b.law_text_he)}${ikCite(b.law_section, b.law_url)}</li>`
		+ `<li>${esc(b.rules_he)}, להשוואה בלבד (${esc(b.rule2_he)}${ikCite(b.rule2_section, b.url)}): עריכת חוזה בשווי הזה ${draft}${ikCite(b.drafting.item, b.url)}; רישום כשעורך הדין לא ערך את החוזה ${nis(r.bar.registration)} ועוד מע"מ${ikCite(b.registration.item, b.url)}. ${esc(b.registration.drafted_he)}. ${esc(b.index_he)}.</li>`
		+ `<li>${esc(fl.ethics.he)}${ikCite(fl.ethics.section, fl.ethics.url)}</li></ul></div>`;
}

function ikSellBox(reg, r) {
	if (!ikIsSell(r)) { return ''; }
	const a = reg.fl_iska.advance;
	const adv = r.advance
		? `<p>${esc(a.he)}${ikCite(a.section, a.law_url)}. אצלכם: ${r.advance.pct}% מ-${nis(r.price)} = <strong>${nis(r.advance.amount)}</strong>${r.advance.known ? '' : ' (בלי יום הרכישה הנחנו רכישה מ-7.11.2001)'}. זה לא תשלום נוסף: הסכום מקוזז ממס השבח, והיתרה מוחזרת אחרי השומה.</p>`
		: `<p>${esc(a.exempt_he)}${ikCite(a.exempt_section, a.law_url)}.</p>`;
	const link = r.shevachLink ? `/land-appreciation-tax/#s=${r.shevachLink}` : '/land-appreciation-tax/';
	return `<div class="${P}-sell"><h4>מס השבח והמקדמה</h4>${adv}<p><a class="jtool-btn" href="${esc(link)}" data-act="shevach">לחשב את מס השבח עם המספרים האלה</a> <small>${r.shevachLink ? 'המחיר, התאריכים והוצאות המכירה עוברים למחשבון.' : 'הזינו מתי קניתם וכמה שילמתם כדי שהמספרים יעברו למחשבון.'}</small></p></div>`;
}

export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	if (ikIsSell(r)) {
		return `מוכרים דירה ${ikBand(r.price)}${r.advance ? `; הקונה אמור להעביר לרשות המסים מקדמה של ${r.advance.pct}% מהמחיר` : '; מבקשים פטור ממס שבח'}. עלויות המכירה, בלי מס השבח: ${nis(r.total)}. הצהרת המוכר לרשות המסים עד ${isoToHe(r.events[1].date)} והתשלום עד ${isoToHe(r.events[2].date)}. השאלה לתרגול: משא ומתן עם הקונה על המחיר ועל לוח התשלומים. איך מגינים על המחיר, ומה מסכימים לגבי המקדמה והמועד של המסירה?`;
	}
	return `קונים ${TRACK_HE[r.tax.track]} ${ikBand(r.price)}. מעבר למחיר: ${nis(r.total)}, מהם מס רכישה ${nis(r.tax.amount)}${r.lawyer.gross ? ` ושכר טרחת עורך דין ${nis(r.lawyer.gross)} כולל מע"מ` : ''}. ההצהרה לרשות המסים עד ${isoToHe(r.events[1].date)} והתשלום עד ${isoToHe(r.events[2].date)}. השאלה לתרגול: משא ומתן עם עורך הדין על שכר הטרחה. מה כלול בהצעה (בדיקת זכויות, חוזה, דיווח, רישום), ואיך מבקשים הנחה או תשלום לפי שלבים?`;
}

/** The "what to do now" list: the official service with its date, then 2-4 pages of this site. */
export function nextActions(reg, r) {
	const fl = reg.fl_iska;
	const s = fl.services;
	const out = [
		{ he: `${s.declare.he}: עד ${isoToHe(r.events[1].date)}`, url: s.declare.url, rule: r.events[1].rule },
		{ he: `${s.extract.he}, לפני החתימה: ${nis(fl.tabu.fees.extract_online.amount)} מקוון`, url: s.extract.url, rule: fl.tabu.fees.extract_online.item },
	];
	if (ikIsSell(r)) {
		out.push({ he: 'שומה עצמית של מס שבח ברשות המסים', url: reg.shevach.service_url });
	} else {
		out.push({ he: 'הסימולטור של רשות המסים לבדיקת מס הרכישה', url: reg.purchase_tax.simulator_url });
		out.push({ he: s.register.he, url: s.register.url });
	}
	const links = ikIsSell(r)
		? [{ path: r.shevachLink ? `/land-appreciation-tax/#s=${r.shevachLink}` : '/land-appreciation-tax/', he: 'כמה מס שבח: החישוב עם המספרים שלכם' }, { path: '/betterment-levy-israel/', he: 'היטל השבחה: מתי משלמים אותו במכירה' }, { path: '/tabu-registration-fees-2026/', he: 'כל אגרות הטאבו' }, { path: '/real-estate-attorney/', he: 'עורך דין מקרקעין: מה בודקים לפני שבוחרים' }]
		: [{ path: '/acquisition-tax-brackets-2026/', he: 'מס רכישה: כל המסלולים והמדרגות' }, { path: '/buying-apartment-guide-comprehensive/', he: 'המדריך לקניית דירה, צעד אחר צעד' }, { path: '/tabu-registration-fees-2026/', he: 'כל אגרות הטאבו' }, { path: '/real-estate-attorney/', he: 'עורך דין מקרקעין: מה בודקים לפני שבוחרים' }];
	return { official: out, links };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const fl = reg.fl_iska;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי חוק מיסוי מקרקעין ותקנות האגרות בתוקף מ-${isoToHe(fl.tabu.from)}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${ikIsSell(r) ? 'כמה עולה המכירה, בלי מס השבח' : 'כמה עולה הקנייה מעבר למחיר הדירה'}</p>`
		+ `<strong class="jtool-verdict__figure">${ikMoney(r.total)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<p class="jtool-scope">${nis(r.officialTotal)} מזה נקבעים בחוק ובתקנות${r.ownTotal ? `, ו-${nis(r.ownTotal)} לפי ההצעות שהזנתם` : ''}. אגרות הטאבו מתעדכנות ב-${isoToHe(fl.next_update)}.</p></div>`
		+ strip(reg, r)
		+ ledger(reg, r)
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ ikSellBox(reg, r)
		+ feeBox(reg, r)
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${IK_SIM}" target="_blank" rel="noopener" data-act="rehearse">להעתיק ולתרגל את המשא ומתן</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a>${x.rule ? ` (${esc(x.rule)})` : ''}</li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

export function deadlinesTable(reg, r, opts = {}) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = opts.today && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="עד תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.what)}</td><td data-th="הכלל">${e.url ? ikCite(e.rule, e.url) : esc(e.rule)}</td></tr>`; }).join('')
		+ `</tbody><caption>${esc(reg.purchase_tax.rest_day_he)}. לרישום בטאבו אין מועד בחוק: הוא אחרי תשלום המסים והאישורים.</caption></table></div>`;
}

/** The one-page closing sheet: inputs, result, the computation path, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const fl = reg.fl_iska;
	const path = r.lines.map((l) => `<li>${esc(l.he)}: ${nis(l.amount)}${l.official ? ` (${esc(l.item)})` : l.vat ? ` (${nis(l.net)} ועוד מע"מ ${r.vatRate}%)` : ''}; מצטבר ${nis(l.running)}</li>`).join('');
	const inputs = ikIsSell(r)
		? `מכירה ב-${nis(r.price)}, חתימה ב-${isoToHe(r.on)}.`
		: `קנייה של ${TRACK_HE[r.tax.track]} ב-${nis(r.price)}, חתימה ב-${isoToHe(r.on)}.`;
	return `<h3>${ikIsSell(r) ? 'דף הסגירה של המכירה' : 'דף הסגירה של הקנייה'}</h3>`
		+ `<p><strong>הנתונים:</strong> ${esc(inputs)}</p>`
		+ `<p><strong>התוצאה:</strong> ${nis(r.total)}${ikIsSell(r) ? ' עלויות המכירה, בלי מס השבח' : ' מעבר למחיר הדירה'}.</p>`
		+ `<p><strong>דרך החישוב:</strong></p><ol>${path}</ol>`
		+ (r.advance ? `<p><strong>מקדמה:</strong> ${r.advance.pct}% מהמחיר, ${nis(r.advance.amount)} (${esc(r.advance.section)}).</p>` : '')
		+ `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.what)} (${esc(e.rule)})`).join('; ')}.</p>`
		+ `<p><strong>מקורות:</strong> ${esc(fl.tabu.regulation_he)} בנוסח ${esc(fl.tabu.notice_he)}, בתוקף מ-${isoToHe(fl.tabu.from)}; ${esc(reg.purchase_tax.law_he)}; ${esc(reg.purchase_tax.vat_he)}; ${esc(fl.bar.rules_he)} (לא מחייב), בנוסח ל-${isoToHe(fl.bar.current_to)}. נבדק ${isoToHe(fl.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const fl = reg.fl_iska;
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שהחוק קובע</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>${deadlinesTable(reg, r, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-who-h">מי משלם את אגרות הטאבו</h3></div><p>${esc(fl.tabu.payer_he)}${ikCite(fl.tabu.payer_section, fl.tabu.url)}. ${esc(fl.tabu.update_he)}${ikCite(fl.tabu.update_section, fl.tabu.url)}.</p></div>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || fl.checked_on)}</div>`;
}

/** Page section: the Land Registry fees of a deal (2026) and the Bar's non-binding tariff at sample prices. */
export function compareTable(reg) {
	const fl = reg.fl_iska;
	const f = fl.tabu.fees;
	const rows = ['extract_online', 'extract_counter', 'warning', 'warning_delete', 'sale', 'mortgage', 'mortgage_delete_direct', 'mortgage_delete_deposit']
		.map((k) => `<tr><td data-th="הפעולה">${esc(f[k].he)}</td><td data-th="פרט">${esc(f[k].item)}</td><td data-th="אגרה">${f[k].amount ? nis(f[k].amount) : 'פטור'}</td></tr>`).join('');
	const prices = [1500000, 2000000, 2500000, 3000000, 3500000];
	const bars = prices.map((p) => { const b = ikBar(reg, p); return `<tr><td data-th="שווי הדירה">${nis(p)}</td><td data-th="עריכת חוזה">${nis(b.drafting)}</td><td data-th="רישום בלבד">${nis(b.registration)}</td></tr>`; }).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>אגרות רישום המקרקעין בעסקת דירה, בתוקף מ-${isoToHe(fl.tabu.from)} (${esc(fl.tabu.regulation_he)}, ${esc(fl.tabu.notice_he)})</caption><thead><tr><th scope="col">הפעולה</th><th scope="col">פרט</th><th scope="col">אגרה</th></tr></thead><tbody>${rows}</tbody></table></div>`
		+ `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>התעריף המינימלי המומלץ של לשכת עורכי הדין, לפני מע"מ: המלצה שאינה מחייבת (${esc(fl.bar.rule2_section)}). ${esc(fl.bar.drafting.item)} ו-${esc(fl.bar.registration.item)}, בנוסח ל-${isoToHe(fl.bar.current_to)}</caption><thead><tr><th scope="col">שווי הדירה</th><th scope="col">עריכת חוזה</th><th scope="col">רישום בלבד</th></tr></thead><tbody>${bars}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = ikCompute(reg, EXAMPLE);
	const fl = reg.fl_iska;
	const f = fl.tabu.fees;
	const pt = reg.purchase_tax;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.total,
		sticky: r.total,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>מס רכישה על ${TRACK_HE[r.tax.track]} ב-${nis(r.price)}: ${r.tax.lines.map((l) => `${l.rate}% על ${nis(l.part)}`).join(', ')} = ${nis(r.tax.amount)}${ikCite(r.tax.section, pt.law_url)}</li>`
			+ `<li>שכר טרחה לפי ההצעה: ${EXAMPLE.fee}% מ-${nis(r.price)} = ${nis(r.lawyer.net)}, ועוד מע"מ ${r.vatRate}% = ${nis(r.lawyer.gross)}${ikCite(pt.vat_he, pt.vat_url)}</li>`
			+ `<li>אגרות רישום המקרקעין: נסח מקוון ${nis(f.extract_online.amount)}${ikCite(f.extract_online.item, fl.tabu.url)}, הערת אזהרה ${nis(f.warning.amount)}${ikCite(f.warning.item, fl.tabu.url)}, רישום משכנתה ${nis(f.mortgage.amount)}${ikCite(f.mortgage.item, fl.tabu.url)}, רישום המכר ${nis(f.sale.amount)}${ikCite(f.sale.item, fl.tabu.url)}</li>`
			+ `<li>המועדים: הצהרה בתוך ${pt.declare_days} ימים${ikCite(pt.declare_section, pt.law_url)}, תשלום בתוך ${pt.pay_days} ימים${ikCite(pt.pay_section, pt.law_url)}; יום שחל במנוחה עובר ליום שאחריו</li>`
			+ `<li>סך הכול מעבר למחיר: ${nis(r.total)}</li></ol>`,
		compare_table: compareTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

const IK_TRACK_CODE = { single: 's', additional: 'a', replacement: 'r', oleh: 'o', disabled: 'd' };
const IK_STATUS_CODE = { single: 's', qualified: 'q', other: 'o' };
export const KEYS = ['s', 'p', 'd', 't', 'a', 'm', 'f', 'v', 'i', 'k', 'r', 'y', 'o', 'e', 'x', 'u', 'q', 'z', 'w'];
const ikNumOrEmpty = (v) => (v === '' || v === undefined || v === null || Number.isNaN(Number(v)) ? '' : Number(v));
export const stateOf = (i) => encodeState({
	s: i.side === 'sell' ? 's' : 'b', p: i.price ? Math.round(i.price) : '', d: i.date || '', t: i.side === 'sell' ? '' : IK_TRACK_CODE[i.track] || 's',
	a: i.side !== 'sell' && i.track === 'oleh' ? i.aliyah || '' : '', m: i.side !== 'sell' && i.mortgage ? 1 : '', f: i.feeMode === 'fixed' ? 'f' : '',
	v: ikNumOrEmpty(i.fee), i: i.feeVat ? 1 : '', k: ikNumOrEmpty(i.broker), r: ikNumOrEmpty(i.appraiser), y: i.side === 'sell' ? '' : ikNumOrEmpty(i.advisor),
	o: ikNumOrEmpty(i.other), e: i.side === 'sell' ? ikNumOrEmpty(i.early) : '', x: i.side === 'sell' ? ({ direct: 'd', deposit: 'p' }[i.payoff] || '') : '',
	u: i.side === 'sell' ? i.buyDate || '' : '', q: i.side === 'sell' ? ikNumOrEmpty(i.buyPrice) : '', z: i.side === 'sell' ? IK_STATUS_CODE[i.status] || 's' : '', w: i.side === 'sell' && i.exempt ? 1 : '',
});
export function inputOf(s) {
	if (!s.p || !s.d) { return null; }
	const n = (v) => (v === undefined || v === '' ? '' : Number(v));
	const sell = s.s === 's';
	return {
		side: sell ? 'sell' : 'buy', price: Number(s.p), date: s.d, track: Object.keys(IK_TRACK_CODE).find((k) => IK_TRACK_CODE[k] === s.t) || 'single',
		aliyah: s.a || '', mortgage: s.m === '1', feeMode: s.f === 'f' ? 'fixed' : 'pct', fee: n(s.v), feeVat: s.i === '1', broker: n(s.k), appraiser: n(s.r),
		advisor: n(s.y), other: n(s.o), early: n(s.e), payoff: { d: 'direct', p: 'deposit' }[s.x] || 'none', buyDate: s.u || '', buyPrice: n(s.q),
		status: Object.keys(IK_STATUS_CODE).find((k) => IK_STATUS_CODE[k] === s.z) || 'single', exempt: s.w === '1',
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const pick = (name, dflt) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || dflt;
	const amt = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const dec = (id) => { const v = val(`#${P}-${id}`).trim().replace(/[%\s]/g, ''); return v === '' ? '' : Number(v); };
	const feeMode = pick('fm', 'pct');
	return {
		side: pick('side', 'buy'), price: amt('price'), date: ikToIso(val(`#${P}-date`)), track: pick('trk', 'single'), aliyah: ikToIso(val(`#${P}-aly`)),
		mortgage: on('mtg'), feeMode, fee: feeMode === 'fixed' ? amt('fee') : dec('fee'), feeVat: on('fv'), broker: dec('brk'), appraiser: amt('apr'),
		advisor: amt('adv'), other: amt('oth'), early: amt('ear'), payoff: pick('po', 'none'), buyDate: ikToIso(val(`#${P}-bd`)), buyPrice: amt('bp'),
		status: pick('st', 'single'), exempt: on('ex'),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const fl = reg.fl_iska;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	let lastMode = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(fl.checked_on, fl.refresh_every_days) || (fl.next_update && today >= fl.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרות התעדכנו'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const ids = { price: 'price', date: 'date', fee: 'fee', broker: 'brk', appraiser: 'apr', advisor: 'adv', other: 'oth', early: 'ear', buyDate: 'bd', buyPrice: 'bp', aliyah: 'aly' };
		for (const e of r.errors) {
			const id = ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	// Show the fields of the chosen side and track; the fee box switches its suffix with the fee mode.
	const sync = (input) => {
		form.querySelectorAll(`[data-${P}-if]`).forEach((el) => {
			const want = el.getAttribute(`data-${P}-if`);
			el.hidden = want === 'oleh' ? !(input.side === 'buy' && input.track === 'oleh') : want !== input.side;
		});
		if (lastMode !== null && lastMode !== input.feeMode) { form.innerHTML = renderForm(reg, Object.assign(input, { fee: '' })); }
		lastMode = input.feeMode;
	};
	const run = (input, opts = {}) => {
		const r = ikCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.total, 0) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: `${r.side}-${r.price < 1500000 ? 'u15' : r.price < 3000000 ? '15-30' : 'o30'}` }); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = readForm(root); sync(input); run(input); }, 160);
	};
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	}
	lastMode = (fromHash || EXAMPLE).feeMode;
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', (ev) => {
		const t = ev.target;
		// One click on "מוכרים" before any typing shows the example sale, already computed.
		if (t && t.name === `${P}-side` && !started && !fromHash) {
			started = true;
			track('tool_start', { tool_id: TOOL_ID });
			const input = t.value === 'sell' ? Object.assign({}, SELL_EXAMPLE) : Object.assign({}, EXAMPLE);
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			return;
		}
		schedule();
	});
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		const input = readForm(root);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok) {
			download('alut-iska.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `${r.side === 'sell' ? 'מכירת דירה' : 'קניית דירה'}: ${e.what}`, description: `${e.rule}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(fl.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief goes to the clipboard and the link opens as is.
			if (r.ok) { copyText(aiBrief(reg, r)); }
			toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.side : 'error' });
		} else if (act === 'shevach') {
			track('tool_next_click', { tool_id: TOOL_ID, band: 'shevach' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, s); sync(s); run(s); }
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
