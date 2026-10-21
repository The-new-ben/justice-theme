/**
 * The closing ledger of an apartment deal (the family + land wave, 21.10.2026, HAD-579): every payment of buying or
 * selling an apartment, each on its date, with a running total.
 *
 * REUSE: the purchase tax, its tracks, its refusals and the buyer's 30/60-day dates come from the wave-3 engine
 * (rechisha-engine.js `compute`, called with no fees); the seller's 30/60-day dates use the same rest-day rule
 * (offRestDays) on reg.shevach.deadlines. Every amount is read from the registry:
 *  - Land Registry fees: reg.fl_iska.tabu.fees (the schedule of the Land (Fees) Regulations in force from 1.1.2026):
 *    warning note 188 (item 13(א)(1)), sale 44 (item 1), mortgage 188 (item 2(א)), mortgage deletion free when the bank
 *    is paid directly (item 2(ג)(1)) or 188 when deposited (2(ג)(2)), an online extract 18 (item 7(א2)).
 *  - VAT on a fee: reg.purchase_tax.vat_pct (18% from 1.1.2025), vat_prior (17%) for a deal signed before.
 *  - The lawyer's fee is the user's quote (a % of the price or a fixed sum, with or without VAT). The Bar's recommended
 *    minimum tariff (items 11(1) and 11(9)(ג)) is computed beside it as a reference only: rule 2 says it does not bind.
 *  - The seller's advance (s.15(ב)-(ג)): 7.5% or 15% of the price, withheld by the buyer, credited against the tax.
 * Names start with "ik" (the bundler concatenates this file with instrument.js and rechisha-engine.js).
 */
import { compute, addDays, offRestDays, parseDate } from './rechisha-engine.js';

export const IK_TRACKS = ['single', 'additional', 'replacement', 'oleh', 'disabled'];
export const IK_STAGES = ['before', 'sign', 'tax', 'close'];

const ikRound = (n) => Math.round(n * 100) / 100;

/** The VAT rate in force on a day: 18% from reg.purchase_tax.vat_from, else the prior rate. */
export function ikVatRate(reg, on) {
	const pt = reg.purchase_tax;
	return pt.vat_prior && on < pt.vat_from ? pt.vat_prior.pct : pt.vat_pct;
}

/** A fee quote: { net, vat, gross } from a % of the price or a fixed sum, with VAT added or included. */
export function ikFee(price, mode, value, rate, vatIncluded) {
	const v = Number(value) || 0;
	if (!(v > 0)) { return { net: 0, vat: 0, gross: 0 }; }
	if (mode === 'fixed' && vatIncluded) {
		const net = ikRound(v * 100 / (100 + rate));
		return { net, vat: ikRound(v - net), gross: ikRound(v) };
	}
	const net = mode === 'fixed' ? ikRound(v) : ikRound(price * v / 100);
	const vat = ikRound(net * rate / 100);
	return { net, vat, gross: ikRound(net + vat) };
}

/** The Bar's recommended minimum tariff (not binding, rule 2): contract drafting (item 11(1)) and registration
 * when the lawyer did not draft the contract (item 11(9)(ג)), before VAT. */
export function ikBar(reg, value) {
	const b = reg.fl_iska.bar;
	const d = b.drafting;
	let drafting;
	let byAgreement = false;
	if (value > d.top_from) {
		drafting = d.top_min;
		byAgreement = true;
	} else {
		let low = 0;
		let sum = 0;
		for (const [upper, rate] of d.brackets) {
			if (value <= low) { break; }
			const top = Math.min(value, upper);
			sum += (top - low) * rate / 100;
			low = upper;
		}
		drafting = ikRound(Math.max(sum, d.first_min));
	}
	const g = b.registration;
	const registration = ikRound(Math.min(value, g.threshold) * g.rate_low / 100 + Math.max(0, value - g.threshold) * g.rate_high / 100);
	return { drafting, byAgreement, registration };
}

/** The link that opens the mas-shevach tool with this sale filled in (its share state, shevach-ui.js KEYS). */
export function ikShevachState(input, saleCosts) {
	const ST = { single: 's', qualified: 'q', other: 'o' };
	const parts = [['t', ST[input.status] || 's'], ['a', input.buyDate], ['b', input.buyPrice ? Math.round(input.buyPrice) : ''], ['c', input.date], ['d', Math.round(input.price)], ['f', saleCosts ? Math.round(saleCosts) : '']];
	return parts.filter(([, v]) => v !== '' && v !== undefined && v !== null).map(([k, v]) => `${k}${String(v).replace(/[^0-9A-Za-z._~-]/g, '')}`).join('/');
}

const ikNum = (v) => (v === '' || v === undefined || v === null ? 0 : Number(v));

/**
 * input = { side: 'buy'|'sell', price, date (contract day, ISO), feeMode: 'pct'|'fixed', fee, feeVat (the quote
 *   includes VAT), broker (% of price), brokerVat, appraiser, advisor, other (sums), extract (an online extract)
 *   buy:  track (IK_TRACKS), aliyah, mortgage (a mortgage is registered)
 *   sell: status ('single'|'qualified'|'other', for the mas-shevach link), buyDate, buyPrice, early (the bank's early
 *         repayment fee, a sum), payoff ('none'|'direct'|'deposit'), exempt (a qualifying-home exemption is claimed) }
 */
export function ikCompute(reg, input) {
	const fl = reg.fl_iska;
	const t = fl.tabu.fees;
	const side = input.side === 'sell' ? 'sell' : 'buy';
	const errors = [];
	const price = Number(input.price);
	const on = parseDate(input.date);
	if (!(price > 0)) { errors.push({ field: 'price', he: 'מחיר הדירה צריך להיות גדול מ-0' }); }
	if (price > 1e10) { errors.push({ field: 'price', he: 'המחיר גדול מדי לבדיקה' }); }
	if (!on) { errors.push({ field: 'date', he: 'יום החתימה לא תקין. לדוגמה: 1.12.2026' }); }
	const feeMode = input.feeMode === 'fixed' ? 'fixed' : 'pct';
	const fee = ikNum(input.fee);
	if (feeMode === 'pct' && !(fee >= 0 && fee <= 10)) { errors.push({ field: 'fee', he: 'שכר הטרחה באחוזים: 0 עד 10' }); }
	if (feeMode === 'fixed' && !(fee >= 0 && fee < 1e7)) { errors.push({ field: 'fee', he: 'שכר הטרחה בשקלים: מספר חיובי' }); }
	const broker = ikNum(input.broker);
	if (!(broker >= 0 && broker <= 10)) { errors.push({ field: 'broker', he: 'דמי התיווך באחוזים: 0 עד 10' }); }
	for (const k of ['appraiser', 'advisor', 'other', 'early']) {
		const v = ikNum(input[k]);
		if (!(v >= 0 && v < 1e8)) { errors.push({ field: k, he: 'הסכום צריך להיות מספר חיובי' }); }
	}
	let buyDate = null;
	if (side === 'sell' && input.buyDate) {
		buyDate = parseDate(input.buyDate);
		if (!buyDate) { errors.push({ field: 'buyDate', he: 'יום הרכישה לא תקין. לדוגמה: 1.6.2010' }); }
		else if (on && buyDate > on) { errors.push({ field: 'buyDate', he: 'יום הרכישה צריך להיות לפני יום המכירה' }); }
	}
	if (side === 'sell' && !(ikNum(input.buyPrice) >= 0 && ikNum(input.buyPrice) < 1e10)) { errors.push({ field: 'buyPrice', he: 'מחיר הרכישה: מספר חיובי' }); }
	if (errors.length) { return { ok: false, errors }; }

	const vatRate = ikVatRate(reg, on);
	const lawyer = ikFee(price, feeMode, fee, vatRate, Boolean(input.feeVat));
	const brokerFee = ikFee(price, 'pct', broker, vatRate, false);
	const flags = [];
	const lines = [];
	const add = (line) => { if (line.amount > 0 || line.always) { lines.push(line); } };
	const tabu = (key, stage, extra = {}) => Object.assign({ id: key, he: t[key].he, amount: t[key].amount, item: t[key].item, url: fl.tabu.url, payee: 'רישום המקרקעין', stage, official: true }, extra);
	const own = (id, he, amount, stage, payee, extra = {}) => Object.assign({ id, he, amount: ikRound(amount), stage, payee, own: true }, extra);
	let tax = null;
	let events = [];
	let shevachLink = '';
	let advance = null;

	if (side === 'buy') {
		const track = IK_TRACKS.includes(input.track) ? input.track : 'single';
		const rq = compute(reg, { price, date: on, track, aliyah: input.aliyah || '', lawyerPct: 0, brokerPct: 0, other: 0 });
		if (!rq.ok) { return { ok: false, outOfScope: Boolean(rq.outOfScope), errors: rq.errors.map((e) => ({ field: e.field === 'aliyah' ? 'aliyah' : e.field === 'price' ? 'price' : 'date', he: e.he })) }; }
		tax = { amount: rq.tax, track, section: rq.section, effective: rq.effective, lines: rq.lines, scenarios: rq.scenarios, replacement: rq.replacement };
		rq.flags.filter((f) => !f.soft).forEach((f) => flags.push(f));
		if (input.extract !== false) { add(tabu('extract_online', 'before')); }
		add(own('lawyer', 'שכר טרחת עורך הדין (לפי ההצעה שלכם)', lawyer.gross, 'sign', 'עורך הדין', { net: lawyer.net, vat: lawyer.vat }));
		add(own('broker', 'דמי תיווך (לפי הזמנת התיווך)', brokerFee.gross, 'sign', 'המתווך', { net: brokerFee.net, vat: brokerFee.vat }));
		add(own('appraiser', 'שמאי', ikNum(input.appraiser), 'sign', 'השמאי'));
		add(own('advisor', 'יועץ משכנתאות', ikNum(input.advisor), 'sign', 'היועץ'));
		add(own('other', 'עלויות אחרות (בדק בית, הובלה)', ikNum(input.other), 'sign', 'נותני השירות'));
		add(tabu('warning', 'sign'));
		add({ id: 'tax', he: 'מס רכישה', amount: rq.tax, stage: 'tax', date: rq.pay, payee: 'רשות המסים', official: true, item: rq.section, url: reg.purchase_tax.law_url, always: true });
		if (input.mortgage) { add(tabu('mortgage', 'close')); }
		add(tabu('sale', 'close'));
		events = [
			{ date: on, kind: 'sign', what: 'חתימת החוזה ובקשה לרישום הערת אזהרה', rule: `${t.warning.item} לתקנות המקרקעין (אגרות)` },
			{ date: rq.declare, kind: 'declare', what: 'הגשת ההצהרה לרשות המסים (מיסוי מקרקעין)', rule: `${reg.purchase_tax.declare_section} לחוק מיסוי מקרקעין`, url: reg.purchase_tax.law_url },
			{ date: rq.pay, kind: 'pay', what: 'תשלום מס הרכישה; אחר כך הצמדה וריבית', rule: `${reg.purchase_tax.pay_section} ו${reg.purchase_tax.late_section}`, url: reg.purchase_tax.law_url },
		];
		if (track === 'replacement' && rq.replacement && rq.replacement.ok) {
			events.push({ date: rq.replacement.deadline, kind: 'replacement', what: 'המועד האחרון למכור את הדירה הקודמת (דירה חלופית)', rule: reg.purchase_tax.replacement.section, url: reg.purchase_tax.law_url });
		}
	} else {
		const sv = reg.shevach;
		const d = sv.deadlines;
		const payoff = ['direct', 'deposit'].includes(input.payoff) ? input.payoff : 'none';
		add(own('lawyer', 'שכר טרחת עורך הדין (לפי ההצעה שלכם)', lawyer.gross, 'sign', 'עורך הדין', { net: lawyer.net, vat: lawyer.vat }));
		add(own('broker', 'דמי תיווך (לפי הזמנת התיווך)', brokerFee.gross, 'sign', 'המתווך', { net: brokerFee.net, vat: brokerFee.vat }));
		add(own('appraiser', 'שמאי', ikNum(input.appraiser), 'sign', 'השמאי'));
		add(own('other', 'עלויות אחרות', ikNum(input.other), 'sign', 'נותני השירות'));
		add(own('early', 'עמלת פירעון מוקדם של המשכנתה (לפי הבנק)', ikNum(input.early), 'close', 'הבנק'));
		if (payoff === 'direct') { add(tabu('mortgage_delete_direct', 'close', { always: true })); }
		if (payoff === 'deposit') { add(tabu('mortgage_delete_deposit', 'close')); }
		const declare = offRestDays(addDays(on, d.declare_days), sv.independence_days);
		const pay = offRestDays(addDays(on, d.pay_days), sv.independence_days);
		events = [
			{ date: on, kind: 'sign', what: 'חתימת החוזה', rule: 'החוזה' },
			{ date: declare, kind: 'declare', what: 'הגשת הצהרת המוכר לרשות המסים (מס שבח)', rule: `${d.declare_section} לחוק מיסוי מקרקעין`, url: sv.law_url },
			{ date: pay, kind: 'pay', what: 'תשלום מס השבח, אם יש; אחר כך הצמדה וריבית', rule: `${d.pay_section} לחוק מיסוי מקרקעין`, url: sv.law_url },
		];
		const saleCosts = lawyer.gross + brokerFee.gross + ikNum(input.appraiser);
		shevachLink = buyDate ? ikShevachState({ status: input.status, buyDate, buyPrice: ikNum(input.buyPrice), date: on, price }, saleCosts) : '';
		const a = fl.advance;
		if (!input.exempt) {
			const pctA = buyDate ? (buyDate < a.cutoff ? a.pct_before : a.pct_after) : a.pct_after;
			advance = { pct: pctA, amount: ikRound(price * pctA / 100), known: Boolean(buyDate), section: a.section };
		}
		tax = { shevachSaleCosts: ikRound(saleCosts) };
	}

	const order = (l) => IK_STAGES.indexOf(l.stage);
	lines.sort((x, y) => order(x) - order(y));
	let run = 0;
	lines.forEach((l) => { run = ikRound(run + l.amount); l.running = run; });
	const total = run;
	const officialTotal = ikRound(lines.filter((l) => l.official).reduce((s, l) => s + l.amount, 0));
	const ownTotal = ikRound(lines.filter((l) => l.own).reduce((s, l) => s + l.amount, 0));
	const stageTotals = {};
	IK_STAGES.forEach((s) => { stageTotals[s] = ikRound(lines.filter((l) => l.stage === s).reduce((a, l) => a + l.amount, 0)); });
	const bar = ikBar(reg, price);
	const feePctOfPrice = price ? Math.round(lawyer.net / price * 10000) / 100 : 0;
	return {
		ok: true, side, price, on, vatRate, lawyer, broker: brokerFee, lines, total, officialTotal, ownTotal, stageTotals,
		tax, events, flags, bar, feePctOfPrice, shevachLink, advance, feeMode,
		pctOfPrice: price ? Math.round(total / price * 10000) / 100 : 0,
	};
}
