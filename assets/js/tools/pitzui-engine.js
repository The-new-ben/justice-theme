/**
 * The consumer-law wave (22.10.2026, HAD-593): the consumer's remedy and compensation calculator (pitzui-tzarchan,
 * /consumer-rights-israel/).
 *
 * Dependency-free ES module on top of dates.js and the existing CPI and interest engine (hatzmada-engine.js, imported as a
 * namespace, bundled as HZ: the shekel interest of the Ruling of Interest and Linkage Law that ss.13(ב) and 13ד1 of the
 * Consumer Protection Law add). Every number comes from the registry: reg.consumer_pitzui (the law's sections, the warranty
 * regulations, the in-store refund rule, the sanctions), reg.small_claims (the ceiling, the fee rule, the limitation) and
 * reg.interest (the shekel rates by quarter, through HZ).
 *
 * What happened (PZ_CASES) x the dates x the price -> what the law gives (repair, replacement, refund, ending the deal, the
 * shown price), the days and the deadline dates, the money owed now, and the compensation that does not depend on damage
 * only where the law lists the section (s.31א: the law's maximum; the reader decides what to ask), or where the law fixes it
 * itself (s.18א(ד): 300 or 600 ₪ for a late technician). The path: the business (a written demand, s.31א(ב)) -> the Authority
 * (the complaint service) -> the small claim (the ceiling and the fee of reg.small_claims). The administrative sanction of
 * s.22ג is the Authority's enforcement: shown as the matching row, never as money for the reader.
 * Never a verdict: "by the rule of the law"; what the law leaves to the court ("a reasonable time", the amount within the
 * maximum) is said in words. Every top-level helper starts with "pz": the bundle concatenates this file with
 * instrument.js, dates.js and sim-handoff.js.
 */

import { addDays, addMonths, addYears, daysBetween, parseDate, isRestDay, addCountedDays, offRestDays } from './dates.js';
import * as HZ from './hatzmada-engine.js';

export const PZ_CASES = ['refund', 'fee', 'defect', 'tech', 'late', 'price', 'sub', 'excess', 'mislead'];
export const PZ_SALES = ['distance', 'door', 'store', 'policy'];
export const PZ_REASONS = ['mind', 'breach'];
export const PZ_CHANNELS = ['email', 'online', 'registered', 'phone', 'inperson', 'fax'];
export const PZ_PRODUCTS = ['fridge', 'freezer', 'stove', 'washer', 'ac', 'heater', 'oven', 'tv', 'dishwasher', 'dryer', 'other'];
export const PZ_PLACES = ['station', 'shop', 'home'];
export const PZ_SUBKINDS = ['cancel', 'ended'];
/** The channels of s.14ט(א) that are oral: they end a continuing deal, but s.31א(ב) then needs a separate written demand. */
export const PZ_ORAL = ['phone', 'inperson'];

const pzBlank = (v) => v === '' || v === undefined || v === null;
const pzR2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const pzHe = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; };
const pzNis = (n) => `${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })} ₪`;
const pzWeekday = (iso) => new Date(`${iso}T00:00:00Z`).getUTCDay();

/**
 * Business days (ימי עסקים): the law does not define them; the tool leaves out Friday, Saturday and the statutory rest
 * days, so the date it gives is the latest one (reg.consumer_pitzui.continuing.business_day_he says so on the page).
 */
export function pzBusinessDays(iso, n) {
	return addCountedDays(iso, n, (d) => isRestDay(d) || pzWeekday(d) === 5);
}
/** Days that are not Saturdays or holidays (the warranty regulations, reg.10(ד)). */
export function pzWorkDays(iso, n) {
	return addCountedDays(iso, n, (d) => isRestDay(d));
}

/** The lawful cancellation fee: 5% of the price or 100 ₪, the lower (s.14ה(ב)(1); reg.5(א) of the 2010 regulations). */
export function pzLawfulFee(pct, max, price) {
	return pzR2(Math.min(price * pct / 100, max));
}

/** Shekel interest on `amount` from `start` to `end` by the existing interest engine (reg.interest, by quarter). */
export function pzShekel(reg, amount, start, end) {
	if (!(amount > 0) || !start || !end || end <= start) { return { ok: true, interest: 0, days: 0, rows: [] }; }
	const r = HZ.compute(reg, { principal: amount, start, end, mode: 'shekel' });
	if (!r.ok) { return { ok: false, he: r.errors && r.errors[0] ? r.errors[0].he : 'שיעור הריבית לא ידוע לתאריך הזה' }; }
	return { ok: true, interest: r.interest, days: daysBetween(start, end), rows: r.rows.map((x) => ({ from: x.from, to: x.to, days: x.days, rate: x.rate, interest: x.interest })), oldLaw: r.flags.some((f) => f.code === 'old_law_period') };
}

/** The small-claims fee of reg.small_claims (reg.6(א): 1% rounded up to 5 ₪, at least 50 ₪). */
export function pzClaimFee(reg, amount) {
	const f = reg.small_claims.fee;
	if (!(amount > 0)) { return 0; }
	return Math.max(f.min, Math.ceil(amount * f.pct / 100 / f.round_up_to) * f.round_up_to);
}

/** The s.31א paragraph by its code (reg.consumer_pitzui.comp31a.paras). */
export function pzPara(reg, code) {
	return reg.consumer_pitzui.comp31a.paras.find((p) => p.code === code) || null;
}

/** The sanction row that matches the violation, with its tier's amounts. */
export function pzSanction(reg, key) {
	const s = reg.consumer_pitzui.sanctions;
	const row = s.rows.find((x) => x.case === key);
	if (!row) { return null; }
	const t = s.tiers[row.tier];
	return Object.assign({}, row, { corp: t.corp, person: t.person, tierSection: t.section });
}

/**
 * input = { case (PZ_CASES), today, date (the deal / purchase / payment day), price, demand (the day a written demand was
 *   sent, optional), comp (the s.31א amount the reader asks, optional), cost (other expenses with receipts, optional),
 *   refund / fee / mislead: sale (PZ_SALES), reason (PZ_REASONS), notice (the day the business got the cancellation notice),
 *     refunded (returned so far), fee (the fee kept), sign ('no' when no return-policy sign was shown), learned, place;
 *   defect: product (PZ_PRODUCTS), place (PZ_PLACES, other goods), delivery, call, blocks, seller, fixed, failed, nocert;
 *   tech: visit (the day), wait (hours after the agreed hour), phone (the phone-wait breach);
 *   late: sale, agreed (the agreed supply day), paid (the advance), supplied (optional);
 *   price: shown, charged, qty;
 *   sub: subkind (PZ_SUBKINDS), notice, channel (PZ_CHANNELS), later (a later end the reader asked for), end (the fixed
 *     period's end), monthly, charges;
 *   excess: excess (the amount), charged (the day charged), claimed (the day the reader complained) }
 */
export function pzCompute(reg, input) {
	const R = reg.consumer_pitzui;
	const errors = [];
	const kase = PZ_CASES.includes(input.case) ? input.case : 'refund';
	const today = parseDate(input.today);
	if (!today) { errors.push({ field: 'today', he: 'היום: תאריך לא תקין' }); }
	const date = (field, label, opts = {}) => {
		if (pzBlank(input[field])) {
			if (opts.required) { errors.push({ field, he: `${label}: תאריך מלא, לדוגמה 1.10.2026` }); }
			return null;
		}
		const d = parseDate(input[field]);
		if (!d) { errors.push({ field, he: `${label}: תאריך לא תקין. לדוגמה: 1.10.2026` }); return null; }
		if (today && d > today && !opts.future) { errors.push({ field, he: `${label}: אחרי היום` }); return null; }
		if (opts.after && d < opts.after) { errors.push({ field, he: `${label}: לפני ${opts.afterHe}` }); return null; }
		return d;
	};
	const money = (field, label, opts = {}) => {
		if (pzBlank(input[field])) {
			if (opts.required) { errors.push({ field, he: `${label}: סכום בשקלים, לדוגמה 1,800` }); }
			return opts.required ? null : 0;
		}
		const v = Number(input[field]);
		if (!(Number.isFinite(v) && v >= 0 && v < 1e9) || (opts.positive && !(v > 0))) { errors.push({ field, he: `${label}: ${opts.positive ? 'סכום חיובי' : 'סכום חיובי או 0'}` }); return null; }
		return pzR2(v);
	};
	const dealDay = date('date', 'יום העסקה');
	const price = ['tech', 'excess', 'sub'].includes(kase) ? money('price', 'המחיר') : money('price', 'המחיר ששילמתם', { required: kase !== 'price', positive: kase !== 'price' });
	const demand = date('demand', 'יום הדרישה בכתב');
	const comp = money('comp', 'הפיצויים לדוגמה שתבקשו');
	const cost = money('cost', 'הוצאות עם קבלות');
	if (comp && comp > R.comp31a.max_aggravated) { errors.push({ field: 'comp', he: `הפיצויים לדוגמה: עד ${pzNis(R.comp31a.max_aggravated)} גם בנסיבות של סעיף 31א(ג)` }); }
	// Case-specific inputs, read only for the case (a value left in a hidden field is ignored).
	const x = {};
	if (kase === 'refund' || kase === 'fee' || kase === 'mislead') {
		x.sale = kase === 'mislead' ? 'mislead' : (PZ_SALES.includes(input.sale) ? input.sale : 'distance');
		x.reason = PZ_REASONS.includes(input.reason) ? input.reason : 'mind';
		x.notice = date('notice', kase === 'mislead' ? 'יום הודעת הביטול' : 'היום שבו העסק קיבל את הודעת הביטול', { required: true, after: dealDay, afterHe: 'יום העסקה' });
		if (kase === 'fee') {
			x.fee = money('fee', 'דמי הביטול שנגבו', { required: true });
			if (x.fee !== null && price !== null && x.fee > price) { errors.push({ field: 'fee', he: 'דמי הביטול גבוהים מהמחיר' }); }
		} else {
			x.refunded = money('refunded', 'מה שהוחזר עד היום');
			if (x.refunded !== null && price !== null && x.refunded > price) { errors.push({ field: 'refunded', he: 'ההחזר גבוה מהמחיר' }); }
		}
		x.sign = input.sign === 'no' ? 'no' : 'yes';
		if (kase === 'mislead') { x.learned = date('learned', 'היום שבו נודע על ההטעיה', { after: dealDay, afterHe: 'יום העסקה' }); x.place = Boolean(input.place); }
	} else if (kase === 'defect') {
		x.product = PZ_PRODUCTS.includes(input.product) ? input.product : 'other';
		x.place = PZ_PLACES.includes(input.place) ? input.place : 'station';
		x.delivery = date('delivery', 'יום המסירה או ההתקנה', { required: true, after: dealDay, afterHe: 'יום העסקה' });
		x.call = date('call', 'היום שבו ביקשתם תיקון או מסרתם לתחנה', { required: true, after: x.delivery, afterHe: 'יום המסירה' });
		x.fixed = date('fixed', 'יום התיקון', { after: x.call, afterHe: 'יום הקריאה' });
		x.blocks = Boolean(input.blocks);
		x.seller = Boolean(input.seller);
		x.failed = Boolean(input.failed);
		x.nocert = Boolean(input.nocert);
	} else if (kase === 'tech') {
		x.visit = date('visit', 'יום הביקור שתואם', { required: true });
		if (pzBlank(input.wait)) { errors.push({ field: 'wait', he: 'כמה שעות אחרי השעה שתואמה הטכנאי הגיע (או עד שוויתרתם)' }); } else {
			const w = Number(input.wait);
			if (!(Number.isFinite(w) && w >= 0 && w <= 24)) { errors.push({ field: 'wait', he: 'שעות האיחור: 0 עד 24' }); } else { x.wait = w; }
		}
		x.phone = Boolean(input.phone);
	} else if (kase === 'late') {
		x.sale = input.sale === 'store' ? 'store' : 'distance';
		x.agreed = date('agreed', 'מועד ההספקה שהוסכם', { future: true, after: dealDay, afterHe: 'יום התשלום' });
		x.paid = money('paid', 'המקדמה ששולמה');
		if (!x.paid && price) { x.paid = price; }
		x.supplied = date('supplied', 'יום ההספקה בפועל', { after: dealDay, afterHe: 'יום התשלום' });
		if (!dealDay) { errors.push({ field: 'date', he: 'יום התשלום: תאריך מלא' }); }
	} else if (kase === 'price') {
		x.shown = money('shown', 'המחיר שהוצג על המוצר', { required: true, positive: true });
		x.charged = money('charged', 'המחיר שחויב בקופה', { required: true, positive: true });
		const q = pzBlank(input.qty) ? 1 : Number(input.qty);
		if (!(Number.isInteger(q) && q >= 1 && q <= 1000)) { errors.push({ field: 'qty', he: 'כמות: מספר שלם, 1 עד 1,000' }); } else { x.qty = q; }
		if (x.shown && x.charged && x.charged <= x.shown) { errors.push({ field: 'charged', he: 'המחיר בקופה לא גבוה מהמחיר שהוצג: אין חיוב יתר' }); }
	} else if (kase === 'sub') {
		x.subkind = input.subkind === 'ended' ? 'ended' : 'cancel';
		x.channel = PZ_CHANNELS.includes(input.channel) ? input.channel : 'email';
		if (x.subkind === 'cancel') {
			x.notice = date('notice', 'יום מסירת הודעת הביטול', { required: true });
			x.later = date('later', 'המועד המאוחר שביקשתם', { future: true, after: x.notice, afterHe: 'יום ההודעה' });
		} else {
			x.end = date('end', 'מועד סיום העסקה לתקופה קצובה', { required: true });
		}
		x.monthly = money('monthly', 'סכום כל חיוב', { required: true, positive: true });
		const n = pzBlank(input.charges) ? 0 : Number(input.charges);
		if (!(Number.isInteger(n) && n >= 0 && n <= 120)) { errors.push({ field: 'charges', he: 'מספר החיובים אחרי הסיום: 0 עד 120' }); } else { x.charges = n; }
	} else if (kase === 'excess') {
		x.excess = money('excess', 'הסכום העודף', { required: true, positive: true });
		x.charged = date('charged', 'יום החיוב העודף', { required: true });
		x.claimed = date('claimed', 'היום שבו פניתם לעסק', { required: true, after: x.charged, afterHe: 'יום החיוב' });
	}
	if (errors.length) { return { ok: false, case: kase, errors }; }

	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const gives = [];
	const give = (code, he, section, url, due, dueHe) => gives.push({ code, he, section: section || '', url: url || '', due: due || null, dueHe: dueHe || '' });
	const lines = [];
	const line = (code, he, amount, section, url, kind) => { if (amount > 0) { lines.push({ code, he, amount: pzR2(amount), section: section || '', url: url || '', kind: kind || 'owed' }); } };
	const events = [];
	const ev = (key, d, kind, he, section, url) => { if (d) { events.push({ key, date: d, kind, he, section: section || '', url: url || '' }); } };
	const law = R.law.url;
	let para = null;
	let sanctionKey = null;
	let due = null;
	let dueHe = '';
	let lead = null;
	let event = dealDay;

	/* ---------- refund / fee / misleading: the money after a cancellation ---------- */
	if (kase === 'refund' || kase === 'fee' || kase === 'mislead') {
		const D = R.distance;
		const S = R.store_regs;
		let fee = 0;
		let feeSection = '';
		if (kase === 'mislead') {
			due = addDays(x.notice, R.mislead_cancel.refund_days);
			dueHe = `${R.mislead_cancel.refund_days} ימים מיום שהעסק קיבל את הודעת הביטול`;
			give('cancel', R.mislead_cancel.he, R.mislead_cancel.section, law);
			give('refund', R.mislead_cancel.refund_he, R.mislead_cancel.refund_section, law, due, dueHe);
			give('tort', R.tort.he, R.tort.section, law);
			sanctionKey = 'mislead';
			if (x.place) { para = '1a'; }
			if (!x.place) { add('info', 'no31a', `הטעיה כשלעצמה לא מנויה בסעיף 31א: פיצויים לדוגמה יש רק כשההטעיה הייתה במקום ההספקה והעסק לא סיפק למקום שהוסכם (פסקה 1א). על הנזק עצמו: פיצוי לפי מה שמוכח (${R.tort.section}).`, R.comp31a.section, law); }
			if (x.learned) { ev('learned', x.learned, 'start', 'נודע על ההטעיה: מכאן "זמן סביר" לביטול (החוק לא קובע מספר ימים)', R.mislead_cancel.section, law); }
			add('info', 'reasonable', `החוק נותן לבטל "בתוך זמן סביר" מהיום שנודע על ההטעיה (${R.mislead_cancel.section}): אין בו מספר ימים, ובית המשפט מכריע.`, R.mislead_cancel.section, law);
		} else if (x.sale === 'distance') {
			if (x.reason === 'breach') {
				feeSection = D.breach_section;
				give('refund', D.breach_he, D.breach_section, law, addDays(x.notice, D.refund_days), `${D.refund_days} ימים מקבלת ההודעה`);
			} else {
				fee = pzLawfulFee(D.fee_pct, D.fee_max, price);
				feeSection = D.mind_section;
				give('refund', D.mind_he, D.mind_section, law, addDays(x.notice, D.refund_days), `${D.refund_days} ימים מקבלת ההודעה`);
			}
			due = addDays(x.notice, D.refund_days);
			dueHe = `${D.refund_days} ימים מיום שהעסק קיבל את הודעת הביטול`;
			para = '4';
			sanctionKey = 'distance';
			add('info', 'fee_def', `${D.fee_def_he} (${D.fee_def_section}): כל אלה יחד לא עולים על דמי הביטול המותרים.`, D.fee_def_section, law);
		} else if (x.sale === 'door') {
			give('refund', D.door_refund_he, D.door_refund_section, law);
			para = '3';
			sanctionKey = 'door';
			add('info', 'door_days', 'בעסקת רוכלות (מכירה בבית הצרכן או מחוץ לבית עסק) החוק קובע שהעוסק משיב את התמורה, אבל לא קובע לכך מספר ימים; דמי ביטול אין, והוצאות התקנה בבית עד 100 ₪.', D.door_refund_section, law);
		} else if (x.sale === 'store') {
			fee = pzLawfulFee(S.fee_pct, S.fee_max, price);
			feeSection = S.fee_section;
			due = pzBusinessDays(x.notice, S.refund_business_days);
			dueHe = `${S.refund_business_days} ימי עסקים מיום הביטול`;
			give('refund', S.refund_he, S.refund_section, S.url, due, dueHe);
			sanctionKey = 'store';
			add('info', 'store_no31a', `ביטול בחנות לפי תקנות ביטול עסקה (${S.law_section}) לא מנוי בסעיף 31א: אין פיצויים לדוגמה על אי ההחזר, אבל אפשר לתבוע את ההחזר עצמו, והרשות רשאית להטיל עיצום.`, R.comp31a.section, law);
			add('info', 'card_fee', `${S.card_fee_he} (${S.card_fee_section}).`, S.card_fee_section, S.url);
			add('info', 'business_day', `${R.continuing.business_day_he}.`, S.refund_section, S.url);
			if (price <= S.min_price) { add('warn', 'store_min', `תקנות ביטול עסקה חלות על טובין שהמחיר ששולם בעדם עולה על ${S.min_price} ₪.`, 'תקנה 1', S.url); }
			if (x.reason === 'breach') { add('info', 'store_breach', 'התקנות נותנות זכות לבטל בלי סיבה. מוצר פגום או שלא תאם את ההזמנה: זכויות האחריות (תקנות האחריות והשירות) ודיני החוזים, בלי דמי ביטול.', S.law_section, S.url); }
		} else {
			// The return-policy sign of s.4ג: the business did not follow its own policy, or showed none.
			give('refund', R.map.return_policy_he, R.map.return_policy_section, law, null, '');
			para = x.sign === 'no' ? '2' : '1';
			sanctionKey = 'policy';
			ev('policy_return', addDays(x.notice, R.map.return_policy_days), 'deadline', `היום האחרון להחזיר את המוצר אחרי הסירוב: ${R.map.return_policy_days} ימים (${R.map.return_policy_section}(ב))`, R.map.return_policy_section, law);
		}
		const kept = kase === 'fee' ? x.fee : pzR2(price - (x.refunded || 0));
		const lawful = Math.min(fee, kept);
		if (fee) { line('fee_ok', `דמי ביטול שמותר לגבות: ${D.fee_pct}% מ-${pzNis(price)} או ${pzNis(D.fee_max)}, הנמוך`, fee, feeSection, x.sale === 'store' ? S.url : law, 'info'); }
		const owed = pzR2(Math.max(0, kept - fee));
		if (kase === 'fee') {
			line('fee_back', `דמי ביטול שנגבו מעבר למותר (${pzNis(x.fee)} פחות ${pzNis(fee)})`, owed, feeSection || R.distance.door_refund_section, x.sale === 'store' ? S.url : law);
			if (x.sale === 'distance' && x.reason === 'breach') { add('warn', 'no_fee', `ביטול בגלל פגם, אי התאמה, איחור או הפרה: אסור לגבות דמי ביטול בכלל (${D.breach_section}).`, D.breach_section, law); }
		} else {
			line('refund', kase === 'mislead' ? 'התמורה שהעסק צריך להשיב' : `ההחזר שעוד לא הגיע${fee ? ' (אחרי דמי הביטול המותרים)' : ''}`, owed, kase === 'mislead' ? R.mislead_cancel.refund_section : (feeSection || R.distance.door_refund_section), x.sale === 'store' ? S.url : law);
		}
		x.kept = kept; x.lawfulFee = fee; x.lawful = lawful; x.owedRefund = owed;
		ev('notice', x.notice, 'start', kase === 'mislead' ? 'נמסרה הודעת ביטול בשל הטעיה' : 'העסק קיבל את הודעת הביטול', '', '');
		if (due) { ev('due', due, 'deadline', `העסק משיב את הכסף לכל המאוחר: ${dueHe}`, kase === 'mislead' ? R.mislead_cancel.refund_section : x.sale === 'store' ? S.refund_section : R.distance.mind_section, x.sale === 'store' ? S.url : law); }
		event = x.notice;
	}

	/* ---------- defect under warranty ---------- */
	let W = null;
	if (kase === 'defect') {
		const Wr = R.warranty;
		const home = Wr.home.find((h) => h.code === x.product) || null;
		const where = home ? 'home' : x.place;
		const end = addYears(x.delivery, Wr.years);
		const inWarranty = x.call <= end;
		let days;
		let rule;
		let ruleSection;
		if (x.seller) {
			days = Wr.seller_days; rule = `${Wr.seller_days} ימים (שלושה שבועות): העוסק שמכר, כשאי אפשר לאתר את היצרן`; ruleSection = Wr.seller_section;
		} else if (home && x.blocks && home.days) {
			days = home.days; rule = `${home.days === 1 ? 'יום אחד' : home.days === 2 ? 'יומיים' : `${home.days} ימים`} מהקריאה (${home.he}, כשהקלקול מונע את השימוש העיקרי)`; ruleSection = Wr.schedule_section;
		} else if (where === 'home') {
			days = Wr.home_days; rule = `שבוע (${Wr.home_days} ימים) מהקריאה, תיקון בבית`; ruleSection = Wr.days_section;
		} else if (where === 'shop') {
			days = Wr.shop_days; rule = `שבועיים (${Wr.shop_days} ימים) מהמסירה בנקודת המכירה`; ruleSection = Wr.days_section;
		} else {
			days = Wr.station_days; rule = `${Wr.station_days} ימים מהמסירה לתחנת השירות`; ruleSection = Wr.days_section;
		}
		const repairBy = pzWorkDays(x.call, days);
		const done = x.fixed || null;
		const lateRepair = done ? done > repairBy : today > repairBy;
		let parts = null;
		if (price > Wr.parts_price) { parts = addYears(end, Wr.parts_extra_years); }
		if (x.product === 'stove') { parts = addYears(x.delivery, 7); }
		W = { home: Boolean(home), where, end, inWarranty, days, rule, ruleSection, repairBy, done, lateRepair, parts, product: x.product, productHe: home ? home.he : 'מוצר חשמל, אלקטרוניקה או גז', partsUntilWarranty: !parts };
		due = repairBy;
		dueHe = rule;
		if (price <= Wr.min_price) { add('warn', 'cheap', `תקנות האחריות חלות על ${Wr.goods_he}, כשהמחיר לצרכן גבוה מ-${Wr.min_price} ₪. במחיר נמוך יותר חלות זכויות החוק הכלליות (גילוי, הטעיה) ודיני החוזים.`, Wr.goods_section, Wr.url); }
		if (!inWarranty) {
			add('warn', 'out', `הקלקול התגלה אחרי תום שנת האחריות (${pzHe(end)}): התקנות לא מחייבות תיקון חינם. בדקו אם בתעודת האחריות יש אחריות ארוכה יותר (תקנה 15).`, Wr.period_section, Wr.url);
		} else {
			give('repair', Wr.repair_he, Wr.repair_section, Wr.url, repairBy, rule);
			give('confirm', 'אחרי תיקון או החלפה: אישור בכתב על מהות התיקון', Wr.confirm_section, Wr.url);
			give('restore', Wr.restore_he, Wr.restore_section, Wr.url);
			give('parts', Wr.parts_he, Wr.parts_section, Wr.url, parts || end, parts ? (x.product === 'stove' ? 'כיריים: 7 שנים מהמסירה, לפי התוספת הראשונה' : `מחיר מעל ${Wr.parts_price} ₪: שנה אחרי תום האחריות`) : 'עד תום האחריות');
			if (lateRepair) {
				para = '8';
				add('danger', 'late_repair', `${done ? `התיקון הושלם ב-${pzHe(done)}` : `היום ${pzHe(today)}`}, אחרי היום האחרון לתיקון (${pzHe(repairBy)}): לפי כלל התקנות היצרן לא עמד בזמן. זו הפרה של סעיף 18א שמנויה בסעיף 31א(א)(8).`, Wr.days_section, Wr.url);
			}
			if (x.failed) { add('warn', 'failed', `התיקון לא החזיר את המוצר למצבו: ${Wr.restore_he} (${Wr.restore_section}). אם היצרן בוחר להשיב את התמורה: ${pzNis(price)}.`, Wr.restore_section, Wr.url); }
			add('info', 'rest', `${Wr.rest_he} (${Wr.rest_section}).`, Wr.rest_section, Wr.url);
			add('info', 'tech11', `${Wr.tech_he} (${Wr.tech_section}).`, Wr.tech_section, Wr.url);
			add('info', 'pay8', `${Wr.pay_he} (${Wr.pay_section}).`, Wr.pay_section, Wr.url);
		}
		if (x.nocert) { para = para || '7'; add('warn', 'nocert', `לא נמסרה תעודת אחריות: ${Wr.cert_he} (${Wr.cert_section}); אי מסירתה מנויה בסעיף 31א(א)(7).`, Wr.cert_section, Wr.url); }
		if (x.product === 'heater' && x.blocks) { add('info', 'heater', 'תנור הסקה דירתי מופיע ברשימת התיקון בבית, אבל בנוסח המאוחד אין לצדו זמן תיקון: הכלי מחשב שבוע מהקריאה (תקנה 10(א)).', Wr.schedule_section, Wr.url); }
		if (!x.product || x.product === 'other') { add('info', 'parts_schedule', `${Wr.parts_schedule_he}.`, Wr.parts_section, Wr.url); }
		if (x.seller && price <= Wr.seller_price) { add('warn', 'seller_price', `העוסק שמכר נושא בחובות היצרן כשאי אפשר לאתר אותו רק בטובין במחיר מעל ${Wr.seller_price} ₪ (${Wr.seller_rule_section}).`, Wr.seller_rule_section, Wr.url); }
		line('cost', 'הוצאות שהוצאתם בגלל ההפרה (עם קבלות; פיצוי לפי מה שמוכח)', cost, R.tort.section, law, 'claim');
		sanctionKey = 'defect';
		ev('delivery', x.delivery, 'start', 'מסירת המוצר: מכאן שנת האחריות', Wr.start_section, Wr.url);
		ev('call', x.call, 'start', 'קריאה לתיקון או מסירה לתחנת השירות', Wr.days_section, Wr.url);
		if (inWarranty) { ev('repair_by', repairBy, 'deadline', `היום האחרון להשלים את התיקון: ${rule}`, ruleSection, Wr.url); }
		if (done) { ev('fixed', done, 'start', 'התיקון הושלם', '', ''); }
		ev('warranty_end', end, 'info', `סוף שנת האחריות לפי התקנות (שנה מהמסירה)`, Wr.period_section, Wr.url);
		if (parts) { ev('parts_end', parts, 'info', 'סוף החובה לספק חלקי חילוף', Wr.parts_section, Wr.url); }
		event = x.delivery;
	}

	/* ---------- the technician did not come on time (s.18א(ג)-(ד)) ---------- */
	let T = null;
	if (kase === 'tech') {
		const Tr = R.tech;
		const over = Math.max(0, x.wait - Tr.wait_hours);
		let amount = 0;
		for (const tier of Tr.tiers) { if (over >= tier.over_wait_hours) { amount = tier.amount; } }
		T = { wait: x.wait, over, amount, phone: x.phone };
		give('wait', `זמן ההמתנה לנותן השירות לא עולה על ${Tr.wait_hours} שעות מעבר לשעה שתואמה`, Tr.wait_section, law);
		give('comp', `פיצוי בלי הוכחת נזק: ${pzNis(Tr.tiers[0].amount)} אחרי ${Tr.tiers[0].over_wait_hours} שעות מעבר לזמן ההמתנה, ${pzNis(Tr.tiers[1].amount)} אחרי ${Tr.tiers[1].over_wait_hours} שעות`, Tr.comp_section, law);
		line('tech', `איחור של ${x.wait} שעות מהשעה שתואמה (${over} מעבר לשעתיים)`, amount, Tr.comp_section, law);
		if (x.phone) { line('tech_phone', Tr.phone_he, Tr.phone_amount, Tr.phone_section, law); }
		if (!amount && !x.phone) { add('info', 'tech_none', `האיחור (${x.wait} שעות) לא עובר את ${Tr.wait_hours + Tr.tiers[0].over_wait_hours} השעות שמהן החוק נותן פיצוי.`, Tr.comp_section, law); }
		add('info', 'tech_offer', `${Tr.offer_he} (${Tr.offer_section}).`, Tr.offer_section, law);
		add('info', 'tech_except', `${Tr.except_he} (${Tr.except_section}).`, Tr.except_section, law);
		add('info', 'tech_who', `החובה חלה על ${Tr.who_he}; ${Tr.window_he} (${Tr.window_section}).`, Tr.section, law);
		add('info', 'tech_repeat', `${R.warranty.tech_he} (${R.warranty.tech_section}).`, R.warranty.tech_section, R.warranty.url);
		ev('visit', x.visit, 'start', 'יום הביקור שתואם', Tr.section, law);
		event = x.visit;
	}

	/* ---------- not supplied on time ---------- */
	let L = null;
	if (kase === 'late') {
		const A = R.advance;
		const end = x.supplied || today;
		let interest = null;
		let trigger = null;
		if (x.agreed) {
			trigger = addDays(x.agreed, A.late_weeks * 7);
			if (end > trigger) { interest = pzShekel(reg, x.paid, x.agreed, end); }
		} else {
			trigger = addMonths(dealDay, A.no_date_months);
			add('info', 'no_date', `לא הוסכם מועד הספקה: החובה לשלם ריבית קמה אם לא סופק בתוך ${A.no_date_months} חודשים מיום התשלום (${pzHe(trigger)}), אבל הסעיף מונה את הריבית "מהיום שהוסכם", ולכן בלי מועד מוסכם הכלי לא מחשב אותה.`, A.section, law);
		}
		L = { agreed: x.agreed, trigger, end, supplied: x.supplied, paid: x.paid, interest, owedInterest: Boolean(interest && interest.ok && interest.interest > 0) };
		give('interest', A.he, A.section, law, trigger, x.agreed ? `שבועיים אחרי המועד שהוסכם` : `חודשיים מיום התשלום`);
		if (interest && interest.ok) {
			line('interest', `ריבית שקלית על ${pzNis(x.paid)} מ-${pzHe(x.agreed)} עד ${x.supplied ? 'יום ההספקה' : 'היום'} (${interest.days} ימים)`, interest.interest, A.section, reg.interest.regulations_url);
		} else if (interest && !interest.ok) {
			add('warn', 'rates', interest.he, A.section, reg.interest.source_url);
		} else if (x.agreed && end <= trigger) {
			add('info', 'not_yet', `עד ${pzHe(trigger)} (שבועיים אחרי המועד שהוסכם) העסק לא חייב ריבית; אם לא יסופק עד אז, הריבית נמנית מ-${pzHe(x.agreed)}.`, A.section, law);
		}
		add('info', 'double', `${A.double_he} (${A.double_section}).`, A.double_section, law);
		if (x.sale === 'distance') {
			give('cancel', `${R.distance.breach_he}. במכר מרחוק אפשר לבטל עד 14 ימים מקבלת המוצר, ולכן כל עוד לא סופק אפשר לבטל`, R.distance.breach_section, law);
			add('info', 'cancel_then', 'ביטלתם והכסף לא הוחזר בתוך 14 ימים: בחרו "ביטלתי וההחזר לא הגיע"; שם מגיעים גם פיצויים לדוגמה (סעיף 31א(א)(4)).', R.distance.breach_section, law);
		} else {
			add('info', 'store_late', 'בעסקה בחנות החוק לא קובע זכות ביטול מיוחדת בגלל איחור; חלים דיני החוזים (הפרת חוזה: אכיפה או ביטול אחרי ארכה), ואם הוצג מועד הספקה לא נכון: הטעיה (סעיף 2(א)(3)) וביטול לפי סעיף 32.', R.map.supply_date_section, law);
		}
		add('info', 'late_no31a', 'איחור בהספקה כשלעצמו לא מנוי בסעיף 31א; פיצויים לדוגמה יש אחרי ביטול מכר מרחוק שלא הוחזר (פסקה 4), או כשהעסק הטעה במקום ההספקה ולא סיפק למקום שהוסכם (פסקה 1א).', R.comp31a.section, law);
		sanctionKey = 'mislead';
		ev('paid', dealDay, 'start', 'שולמה המקדמה', '', '');
		if (x.agreed) { ev('agreed', x.agreed, 'start', 'מועד ההספקה שהוסכם', A.section, law); }
		ev('trigger', trigger, 'deadline', x.agreed ? 'שבועיים אחרי המועד: מכאן העסק חייב ריבית מהמועד שהוסכם' : 'חודשיים מהתשלום בלי מועד מוסכם', A.section, law);
		if (x.supplied) { ev('supplied', x.supplied, 'start', 'סופק בפועל', '', ''); }
		event = x.agreed || dealDay;
	}

	/* ---------- charged above the shown price ---------- */
	if (kase === 'price') {
		const P = R.price;
		const over = pzR2((x.charged - x.shown) * x.qty);
		give('price', P.he, P.section, law);
		line('price', `${x.qty > 1 ? `${x.qty} יחידות × ` : ''}(${pzNis(x.charged)} פחות ${pzNis(x.shown)})`, over, P.section, law);
		para = '5';
		sanctionKey = 'price';
		add('info', 'total', `${R.map.total_price_he} (${R.map.total_price_section}).`, R.map.total_price_section, law);
		add('info', 'repeat9', `בהצגת מחיר ובחיוב מעל המחיר המחייב, "הפרה חוזרת" לעניין העיצום היא בתוך ${R.sanctions.repeat_price_months} חודשים (${R.sanctions.repeat_section}).`, R.sanctions.repeat_section, law);
		ev('purchase', dealDay, 'start', 'יום הקנייה', '', '');
	}

	/* ---------- a subscription not ended / a fixed period that ended ---------- */
	let Sb = null;
	if (kase === 'sub') {
		const C = R.continuing;
		let end;
		if (x.subkind === 'cancel') {
			const n = x.channel === 'registered' ? C.end_registered_days : C.end_business_days;
			end = pzBusinessDays(x.notice, n);
			if (x.later && x.later > end) { end = x.later; }
			give('end', C.end_he, C.end_section, law, end, x.later && x.later === end ? 'המועד שביקשתם' : `${n} ימי עסקים מ${x.channel === 'registered' ? 'המסירה לדואר' : 'מסירת ההודעה'}`);
			para = '2b';
			sanctionKey = 'sub';
			add('info', 'business_day', `${C.business_day_he}.`, C.end_section, law);
			add('info', 'exception', `${C.exception_he} (${C.exception_section}).`, C.exception_section, law);
			ev('notice', x.notice, 'start', x.channel === 'registered' ? 'הודעת הביטול נמסרה לדואר הרשום' : 'נמסרה הודעת ביטול', R.map.ways_section, law);
			event = x.notice;
		} else {
			end = x.end;
			give('end', C.fixed_he, C.fixed_section, law, end, 'מועד הסיום שבחוזה');
			give('notice', `בתקופת ההודעה (${C.fixed_notice_from_days} עד ${C.fixed_notice_to_days} ימים לפני הסיום) העוסק מודיע על מועד הסיום, וגם במסרון ${C.fixed_sms_days} ימים לפניו`, C.fixed_notice_section, law, addDays(end, -C.fixed_sms_days), `${C.fixed_sms_days} ימים לפני הסיום`);
			para = '2a';
			sanctionKey = 'fixed';
			ev('fixed_notice_from', addDays(end, -C.fixed_notice_from_days), 'info', `תחילת תקופת ההודעה (${C.fixed_notice_from_days} ימים לפני הסיום)`, C.fixed_notice_section, law);
			ev('sms', addDays(end, -C.fixed_sms_days), 'info', `המסרון על מועד הסיום (${C.fixed_sms_days} ימים לפני)`, C.fixed_notice_section, law);
			event = end;
		}
		Sb = { kind: x.subkind, end, channel: x.channel, oral: PZ_ORAL.includes(x.channel), monthly: x.monthly, charges: x.charges };
		line('charges', `${x.charges} חיובים של ${pzNis(x.monthly)} אחרי ${pzHe(end)}`, x.monthly * x.charges, x.subkind === 'cancel' ? C.end_section : C.fixed_section, law);
		if (!x.charges) { add('info', 'no_charges', 'עוד לא היה חיוב אחרי מועד הסיום: אם יהיה, הוא נגבה בניגוד לחוק.', C.end_section, law); }
		ev('end', end, 'deadline', x.subkind === 'cancel' ? 'החוזה מסתיים: מכאן אסור לספק ולחייב' : 'סוף העסקה לתקופה קצובה: מכאן אסור לחייב', x.subkind === 'cancel' ? C.end_section : C.fixed_section, law);
		due = end;
		dueHe = x.subkind === 'cancel' ? 'סיום החוזה' : 'סוף התקופה';
	}

	/* ---------- an excess charge in a continuing deal (s.13ד1) ---------- */
	let Ex = null;
	if (kase === 'excess') {
		const C = R.continuing;
		const check = pzBusinessDays(x.claimed, C.excess_check_days);
		const refundBy = pzBusinessDays(check, C.excess_refund_days);
		const answer = pzBusinessDays(x.claimed, C.excess_answer_days);
		const interest = pzShekel(reg, x.excess, x.charged, today);
		Ex = { check, refundBy, answer, interest };
		give('check', `העסק בודק את הטענה בתוך ${C.excess_check_days} ימי עסקים`, C.excess_section, law, check, `${C.excess_check_days} ימי עסקים מהפנייה`);
		give('refund', `מצא שגבה ביתר: משיב בתוך ${C.excess_refund_days} ימי עסקים, עם ריבית שקלית מיום הגבייה ו-${C.excess_expenses} ₪ להוצאות`, C.excess_section, law, refundBy, `${C.excess_refund_days} ימי עסקים אחרי הבדיקה`);
		give('answer', `תשובה מנומקת בכתב בתוך ${C.excess_answer_days} ימי עסקים`, `${C.excess_section}(ב)`, law, answer, `${C.excess_answer_days} ימי עסקים מהפנייה`);
		line('excess', 'הסכום העודף', x.excess, C.excess_section, law);
		if (interest.ok) { line('excess_interest', `ריבית שקלית מ-${pzHe(x.charged)} עד היום (${interest.days} ימים)`, interest.interest, C.excess_section, reg.interest.regulations_url); } else { add('warn', 'rates', interest.he, C.excess_section, reg.interest.source_url); }
		line('excess_expenses', `תשלום בשל הוצאות הצרכן (${C.excess_expenses_note_he})`, C.excess_expenses, `${C.excess_section}(א)(2)`, law);
		para = '2b1';
		sanctionKey = 'excess';
		add('info', 'business_day', `${C.business_day_he}.`, C.excess_section, law);
		add('info', 'small', `סכום החזר נמוך מ-50 ₪ העסק רשאי לזכות בחיוב הבא, אם הודעת התשלום נשלחת בתוך 30 ימים מתום הבדיקה (${C.excess_section}(א)(2)).`, C.excess_section, law);
		ev('charged', x.charged, 'start', 'החיוב העודף', '', '');
		ev('claimed', x.claimed, 'start', 'פניתם לעסק בטענה על חיוב עודף', C.excess_section, law);
		ev('check', check, 'deadline', `העסק מסיים לבדוק (${C.excess_check_days} ימי עסקים)`, C.excess_section, law);
		ev('refund_by', refundBy, 'deadline', `ההחזר עם ריבית ו-${C.excess_expenses} ₪ (${C.excess_refund_days} ימי עסקים אחרי הבדיקה)`, C.excess_section, law);
		ev('answer', answer, 'deadline', `תשובה בכתב (${C.excess_answer_days} ימי עסקים מהפנייה)`, `${C.excess_section}(ב)`, law);
		due = refundBy;
		dueHe = `${C.excess_check_days} + ${C.excess_refund_days} ימי עסקים מהפנייה`;
		event = x.charged;
	}

	if (cost && kase !== 'defect') { line('cost', 'הוצאות שהוצאתם בגלל ההפרה (עם קבלות; פיצוי לפי מה שמוכח)', cost, R.tort.section, law, 'claim'); }

	/* ---------- s.31א: where the law lists the paragraph, the law's maximum; the reader decides what to ask ---------- */
	const C31 = R.comp31a;
	let c31 = null;
	if (para) {
		const p = pzPara(reg, para);
		const auto = (para === '4') || (para === '2b' && Sb && !Sb.oral);
		const demandOk = Boolean(demand) || auto;
		c31 = { para, paraHe: p.he, text: p.text, ref: p.ref, max: C31.max, maxAggravated: C31.max_aggravated, demandOk, auto, asked: comp || 0, overMax: Boolean(comp && comp > C31.max) };
		if (!demandOk) { add('warn', 'demand', `לפני תביעה לפיצויים לדוגמה צריך לשלוח לעסק בקשה בכתב, גם בדואר אלקטרוני (${C31.demand_section}). המכתב למטה הוא הבקשה הזאת.`, C31.demand_section, law); }
		if (para === '2b' && Sb && Sb.oral) { add('info', 'oral', `${C31.demand_2b_he} (${C31.demand_section}).`, C31.demand_section, law); }
		if (comp && comp > C31.max) { add('warn', 'over_max', `ביקשתם ${pzNis(comp)}: מעל ${pzNis(C31.max)} רק בהפרה חוזרת, נמשכת או בנסיבות מחמירות (${C31.aggravated_section}).`, C31.aggravated_section, law); }
	} else {
		add('info', 'no_para', `המקרה הזה לא מנוי בסעיף 31א, ולכן אין בו פיצויים לדוגמה; מגיע מה שהחוק נותן למעלה, ופיצוי על נזק שמוכח (${R.tort.section}).`, C31.section, law);
	}

	/* ---------- the totals, the path and the dates ---------- */
	const owed = pzR2(lines.filter((l) => l.kind === 'owed').reduce((s, l) => s + l.amount, 0));
	const claimExtra = pzR2(lines.filter((l) => l.kind === 'claim').reduce((s, l) => s + l.amount, 0));
	const claim = pzR2(owed + claimExtra + (c31 && comp ? comp : 0));
	const sc = reg.small_claims;
	const ceiling = sc.ceiling[sc.ceiling.length - 1];
	// Days late: only where `due` is the business's own deadline to pay or repair (not the end of a subscription).
	const late = due && today > due && ['refund', 'fee', 'mislead', 'excess', 'defect'].includes(kase) && (owed > 0 || (W && W.lateRepair && !W.done)) ? daysBetween(due, today) : 0;
	const limitation = event ? offRestDays(addYears(event, sc.limitation_years)) : null;
	if (demand) { ev('demand', demand, 'start', `נשלחה לעסק דרישה בכתב${c31 ? ` (${C31.demand_section})` : ''}`, c31 ? C31.demand_section : '', law); }
	if (limitation) { ev('limit', limitation, 'limit', `התיישנות התביעה: ${sc.limitation_years} שנים מיום האירוע (${sc.limitation_he})`, sc.limitation_he, sc.limitation_url); }
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	const path = [
		{ step: 'business', he: 'העסק', what: 'דרישה בכתב (דואר אלקטרוני, דואר רשום או טופס באתר העסק), עם הסעיפים והסכום', date: demand || today, due: due || null, duePast: Boolean(due && due < today), section: c31 ? C31.demand_section : '' },
		{ step: 'authority', he: 'הרשות להגנת הצרכן', what: `פנייה בטופס המקוון, ללא תשלום (${R.authority.topics_he})`, url: R.authority.complaint_url },
		{ step: 'court', he: 'תביעה קטנה', what: `עד ${pzNis(ceiling.amount)}; אגרה ${pzNis(pzClaimFee(reg, claim))} על ${pzNis(claim)}`, url: sc.service_url, fee: pzClaimFee(reg, claim), claim, overCeiling: claim > ceiling.amount },
	];
	if (claim > ceiling.amount) { add('warn', 'ceiling', `סכום התביעה (${pzNis(claim)}) מעל התקרה בתביעות קטנות (${pzNis(ceiling.amount)} מ-${pzHe(ceiling.from)}): לוותר על היתרה או לתבוע בבית משפט השלום.`, '', sc.service_url); }
	const sanction = sanctionKey ? pzSanction(reg, sanctionKey) : null;
	if (owed > 0) { lead = { kind: 'money', value: owed }; } else if (due) { lead = { kind: 'date', value: due }; } else { lead = { kind: 'none', value: null }; }
	return {
		ok: true, case: kase, today, date: dealDay, price, demand, comp, cost, x, gives, lines, owed, claimExtra, claim, c31, flags, events,
		due, dueHe, late, path, sanction, lead, warranty: W, tech: T, supply: L, sub: Sb, excess: Ex, limitation, event,
	};
}

/** The analytics band: the case and the money band, never an amount or a date. */
export function pzBand(r) {
	if (!r || !r.ok) { return 'error'; }
	const b = r.owed <= 0 ? 'none' : r.owed < 500 ? 'under500' : r.owed < 5000 ? '500-5000' : '5000plus';
	return `${r.case}-${b}`;
}
