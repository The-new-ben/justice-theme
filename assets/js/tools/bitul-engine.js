/**
 * The consumer-law wave (22.10.2026, HAD-593): the cancellation-rights checker (bitul-iska, /bitul-iska/).
 *
 * Dependency-free ES module on top of dates.js. Every number comes from the registry: reg.consumer_bitul (the Consumer
 * Protection Law 1981, the Cancellation of Transaction Regulations 2010, the Interpretation Law 1981, the Payment Services
 * Law 2019, each value with its section) and reg.small_claims (the court fee rule and the 7-year limitation, read, never
 * repeated). The routes:
 *  - in a store (the regulations, s.14ו): the item of the schedule, the 50-shekel floor of "goods", the window by item
 *    (14 days from receipt; 2 days that are not rest days for clothing and jewellery up to 3,000; 14 days and 14 days that
 *    are not rest days before a course or a holiday; 14 days from the deal or the written contract for the continuing
 *    services; a new car until it is registered), the exceptions of reg.6, the fee of reg.5, the refund of reg.4 (7 business
 *    days); outside the list, the store's posted policy (s.4ג) and a credit voucher (s.14ז);
 *  - a presentation event (reg.2(5), item 20);
 *  - a distance sale (s.14ג): from the deal until 14 days after the later of the receipt and the written document; a
 *    service: 14 days, at least 2 days that are not rest days before a one-time service; holidays and entertainment: never
 *    within 7 days that are not rest days before it (s.14ג(ד)(2)); the exceptions of s.14ג(ד); tourism fully abroad (s.14ג2);
 *  - door-to-door (s.14): 14 days, no fee in the law, a one-time service only before it starts;
 *  - a person with a disability, a senior citizen (65+), a new immigrant (s.14ג1): 4 months for door-to-door and for a
 *    distance sale that included a conversation;
 *  - misleading (s.32): within a reasonable time, the refund in 7 days;
 *  - ending a subscription (s.13ד(ג)): 3 business days, 6 by registered mail; a gym for a fixed term (the fourth schedule,
 *    item 2): the cancellation takes effect a month after the notice, the fee formula with its caps;
 *  - the effects (s.14ה): 14 days to refund, the fee 5% or 100 shekels whichever is lower, no fee for a defect, a mismatch,
 *    a late supply or a breach, installation up to 100; the Payment Services Law for a standing order and a card charge.
 * Day counting follows the Interpretation Law: the first day is not counted (s.10(a)), months end on the same day number
 * (s.10(b)), a period whose last day is a rest day ends on the next day that is not one (s.10(c)). A "business day" is not
 * defined in the Consumer Protection Law: the engine counts Sunday to Thursday that are not rest days, and says so.
 * Never a verdict: the result is "by the rule of the law"; facts the law leaves to a court are flags.
 * Every top-level helper starts with "bt": the bundle concatenates this file with instrument.js, dates.js and sim-handoff.js.
 */

import { addDays, daysBetween, parseDate, isRestDay } from './dates.js';

export const BT_SALES = ['distance', 'store', 'door', 'event', 'ongoing'];
export const BT_BUYERS = ['regular', 'senior', 'disability', 'immigrant'];
export const BT_REASONS = ['mind', 'defect', 'mismatch', 'late', 'mislead'];
export const BT_PAYS = ['card', 'cash', 'cheque', 'debit', 'transfer'];
export const BT_CHANNELS = ['email', 'web', 'phone', 'mail', 'fax', 'store'];
export const BT_GOODS = ['electric', 'furniture', 'home', 'watch', 'water', 'sealed', 'ordered', 'clothing', 'jewelry', 'car', 'goods', 'food', 'medicine', 'perishable', 'underwear', 'custom', 'media', 'info', 'gas'];
export const BT_SERVICES = ['travel', 'abroad', 'course', 'continuing', 'gym', 'service'];
export const BT_KINDS = BT_GOODS.concat(BT_SERVICES);
export const BT_FLAGS = ['opened', 'used', 'tagOff', 'assembled', 'vouchers', 'late6', 'conversation', 'started', 'installed', 'registered', 'abroadPolicy', 'fixedTerm'];
export const BT_FAULT = ['defect', 'mismatch', 'late'];

const btBlank = (v) => v === '' || v === undefined || v === null;
const btR2 = (n) => Math.round(n * 100) / 100;
const btHe = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; };
const btPad = (n, w) => String(n).padStart(w, '0');
const btMax = (...xs) => xs.filter(Boolean).sort().pop() || null;
const btGoods = (k) => BT_GOODS.includes(k);
const btTimed = (k) => k === 'travel' || k === 'abroad' || k === 'course' || k === 'service';
const btContinuing = (k) => k === 'continuing' || k === 'gym';

/** The listed Independence days of reg.car_accident when that dataset is on the page; dates.js computes them otherwise. */
export function btExtra(reg) { return (reg && reg.car_accident && reg.car_accident.independence_days) || []; }

/** A business day: Sunday to Thursday, not a rest day (the Consumer Protection Law does not define the term). */
export function btIsBiz(iso, extra) {
	const wd = new Date(`${iso}T00:00:00Z`).getUTCDay();
	return wd !== 5 && wd !== 6 && !isRestDay(iso, extra);
}
/** Interpretation Law s.10(c): a last day that is a rest day moves to the next day that is not one. */
export function btRoll(iso, extra) {
	let out = iso;
	for (let i = 0; i < 10 && isRestDay(out, extra); i += 1) { out = addDays(out, 1); }
	return out;
}
/** A period of n days from a day (Interpretation Law s.10(a): that day is not counted; s.10(c): a rest-day end moves on). */
export function btDays(iso, n, extra) {
	const plain = addDays(iso, n);
	const last = btRoll(plain, extra);
	return { plain, last, rolled: last !== plain };
}
/** Interpretation Law s.10(b): n months after a day end on the same day number, or on the last day of a shorter month. */
export function btAddMonths(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const total = y * 12 + (m - 1) + n;
	const ny = Math.floor(total / 12);
	const nm = (total % 12) + 1;
	const last = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
	return `${btPad(ny, 4)}-${btPad(nm, 2)}-${btPad(Math.min(d, last), 2)}`;
}
/** Whole months from a to b by the s.10(b) rule (a partial month is not counted). */
export function btMonthsBetween(a, b) {
	let n = 0;
	while (n < 1200 && btAddMonths(a, n + 1) <= b) { n += 1; }
	return n;
}
/** The n-th day after iso that is not a rest day ("until the end of two days after it that are not rest days"). */
export function btNonRestAfter(iso, n, extra) {
	let day = iso;
	let c = 0;
	for (let g = 0; c < n && g < n + 90; g += 1) { day = addDays(day, 1); if (!isRestDay(day, extra)) { c += 1; } }
	return day;
}
/** The last day on which at least n days that are not rest days remain before the service day (both days not counted). */
export function btCutoff(service, n, extra) {
	let day = service;
	let c = 0;
	for (let g = 0; c < n && g < n + 90; g += 1) { day = addDays(day, -1); if (!isRestDay(day, extra)) { c += 1; } }
	return addDays(day, -1);
}
/** The n-th business day after iso (the day itself not counted). */
export function btAddBiz(iso, n, extra) {
	let day = iso;
	let c = 0;
	for (let g = 0; c < n && g < n + 90; g += 1) { day = addDays(day, 1); if (btIsBiz(day, extra)) { c += 1; } }
	return day;
}
/** The fee of s.14ה(ב)(1) and reg.5(a): pct of the price or the cap, whichever is lower. */
export function btFee(reg, price) {
	const F = reg.consumer_bitul.fee;
	return btR2(Math.min(Number(price) * F.pct / 100, F.cap));
}
/** The small-claims court fee for an amount (reg.small_claims.fee: pct, rounded up to a step, with a minimum). */
export function btCourtFee(reg, amount) {
	const f = reg.small_claims.fee;
	const raw = Math.ceil((Number(amount) * f.pct / 100) / f.round_up_to - 1e-9) * f.round_up_to;
	return Math.max(f.min, raw);
}

/**
 * The fourth schedule, item 2: a gym for a fixed term. price = the whole consideration (incl. registration), months = the
 * term, start = the first day of use, notice = the day the written notice was given, alt = the monthly price of the
 * alternative (open-ended) track if it was disclosed in writing before the deal (else null).
 */
export function btGym(reg, price, months, start, notice, alt) {
	const G = reg.consumer_bitul.gym;
	const end = btAddMonths(start, months);
	let effective = btAddMonths(notice, G.effect_months);
	if (effective > end) { effective = end; }
	const total = Math.max(1, daysBetween(start, end));
	const usedDays = Math.min(total, Math.max(0, daysBetween(start, effective)));
	const used = btR2(price * usedDays / total);
	const monthly = btR2(price / months);
	const fullMonths = btMonthsBetween(start, effective);
	const diff = alt !== null && alt > price / months ? alt - price / months : 0;
	const feeRaw = btR2(fullMonths * diff);
	const elapsed = Math.max(0, daysBetween(start, notice)) / total;
	const third = elapsed < 1 / 3 ? 0 : elapsed < 2 / 3 ? 1 : 2;
	const capPct = G.cap_pcts[third];
	const cap1 = btR2(price * capPct / 100);
	const remaining = btR2(price * (total - usedDays) / total);
	const fee = btR2(Math.min(feeRaw, cap1, remaining));
	return { end, effective, usedDays, totalDays: total, used, monthly, fullMonths, alt, feeRaw, third: third + 1, capPct, cap1, remaining, fee, refund: btR2(Math.max(0, price - used - fee)) };
}

/**
 * input = { sale (BT_SALES), kind (BT_KINDS), buyer (BT_BUYERS), reason (BT_REASONS), price (shekels paid, incl. delivery),
 *           pay (BT_PAYS), channel (BT_CHANNELS), deal (date of the deal), received (goods received), doc (the written
 *           document / contract received), service (the day the service is due, or the gym's first day), notice (the day the
 *           cancellation notice is given; empty = today), today, months (a gym's fixed term), alt (the alternative monthly
 *           price), charged (the fee the business deducted, optional), and the flags of BT_FLAGS (true / false) }
 */
export function btCompute(reg, input) {
	const B = reg.consumer_bitul;
	const ex = btExtra(reg);
	const errors = [];
	const sale = BT_SALES.includes(input.sale) ? input.sale : 'distance';
	let kind = BT_KINDS.includes(input.kind) ? input.kind : 'goods';
	if (sale === 'ongoing' && !btContinuing(kind)) { kind = 'continuing'; }
	const buyer = BT_BUYERS.includes(input.buyer) ? input.buyer : 'regular';
	const reason = sale === 'ongoing' ? 'mind' : (BT_REASONS.includes(input.reason) ? input.reason : 'mind');
	const pay = BT_PAYS.includes(input.pay) ? input.pay : 'card';
	const channel = BT_CHANNELS.includes(input.channel) ? input.channel : (sale === 'store' || sale === 'event' ? 'store' : 'email');
	const f = {};
	BT_FLAGS.forEach((k) => { f[k] = Boolean(input[k]); });
	const today = parseDate(input.today);
	if (!today) { errors.push({ field: 'today', he: 'חסר תאריך היום' }); }
	const deal = parseDate(input.deal);
	if (!deal) { errors.push({ field: 'deal', he: 'יום העסקה: תאריך מלא, לדוגמה 8.10.2026' }); }
	if (deal && today && deal > today) { errors.push({ field: 'deal', he: 'יום העסקה אחרי היום' }); }
	const date = (field, label, opts = {}) => {
		if (btBlank(input[field])) { return null; }
		const d = parseDate(input[field]);
		if (!d) { errors.push({ field, he: `${label}: תאריך לא תקין. לדוגמה: 13.10.2026` }); return null; }
		if (deal && d < deal) { errors.push({ field, he: `${label}: לפני יום העסקה` }); return null; }
		if (!opts.future && today && d > today) { errors.push({ field, he: `${label}: אחרי היום` }); return null; }
		return d;
	};
	const goods = btGoods(kind);
	const received = goods && sale !== 'ongoing' ? date('received', 'יום קבלת המוצר') : null;
	const doc = date('doc', 'יום קבלת המסמך או החוזה בכתב');
	const needService = btTimed(kind) && sale !== 'ongoing';
	const service = needService || kind === 'gym' ? date('service', kind === 'gym' ? 'היום הראשון במנוי' : 'יום השירות', { future: true }) : null;
	const mustService = (sale === 'distance' && btTimed(kind)) || (sale === 'store' && (kind === 'travel' || kind === 'course')) || (sale === 'event' && btTimed(kind) && kind !== 'abroad');
	if (mustService && btBlank(input.service)) { errors.push({ field: 'service', he: 'יום השירות (הנסיעה, האירוע, הקורס): תאריך מלא' }); }
	const notice = date('notice', 'יום הודעת הביטול', { future: true }) || today;
	const price = btBlank(input.price) ? NaN : Number(input.price);
	if (!(price > 0 && price < 1e8)) { errors.push({ field: 'price', he: 'המחיר ששולם: סכום חיובי בשקלים' }); }
	const gymTerm = sale === 'ongoing' && kind === 'gym' && f.fixedTerm;
	const months = btBlank(input.months) ? null : Number(input.months);
	if (gymTerm && !(Number.isInteger(months) && months >= 1 && months <= 120)) { errors.push({ field: 'months', he: 'תקופת המנוי בחודשים: מספר שלם, 1 עד 120' }); }
	const alt = btBlank(input.alt) ? null : Number(input.alt);
	if (alt !== null && !(alt >= 0 && alt < 1e7)) { errors.push({ field: 'alt', he: 'המחיר החודשי במסלול החלופי: מספר חיובי, או ריק' }); }
	const charged = btBlank(input.charged) ? null : Number(input.charged);
	if (charged !== null && !(charged >= 0 && charged < 1e8)) { errors.push({ field: 'charged', he: 'דמי הביטול שנוכו: מספר חיובי, או ריק' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const LAW = B.law.url;
	const REGS = B.regs.url;
	const S = B.store;
	const D = B.distance;
	const H = B.door;
	const SP = B.special;
	const fault = BT_FAULT.includes(reason);
	const special = buyer !== 'regular';

	let route = '';
	let can = 'yes';
	let last = null;
	let plain = null;
	let rolled = false;
	let basis = null;
	let basisHe = '';
	let section = '';
	let sectionUrl = LAW;
	let cutoff = null;
	let cutoffN = 0;
	let feeRule = 'pct';
	let feeSection = B.fee.law_section;
	let refundDue = null;
	let refundHe = '';
	let refundSection = '';
	let returnHe = '';
	let returnSection = '';
	let installSection = B.fee.install_law_section;
	let item = null;
	let excluded = null;
	let special4 = null;
	let gym = null;
	let end = null;
	const setWindow = (from, n, he) => { const w = btDays(from, n, ex); basis = from; basisHe = he; plain = w.plain; last = w.last; rolled = w.rolled; };
	const applyCutoff = (n) => {
		cutoff = btCutoff(service, n, ex);
		cutoffN = n;
		if (!last || cutoff < last) { last = cutoff; plain = cutoff; rolled = false; }
	};
	const hit = (list, code) => list.find((x) => x.code === code);

	if (reason === 'mislead') {
		// s.32: within a reasonable time from learning of the misleading; the refund in 7 days.
		route = 'mislead';
		section = B.mislead.section;
		feeRule = 'none';
		feeSection = B.mislead.refund_section;
		const w = btDays(notice, B.mislead.refund_days, ex);
		refundDue = w.last;
		refundHe = B.mislead.refund_he;
		refundSection = B.mislead.refund_section;
		returnHe = 'הצרכן מעמיד את הנכס לרשות העוסק במקום שבו נמסר לו';
		returnSection = B.mislead.refund_section;
		const regular = btCompute(reg, Object.assign({}, input, { reason: 'mind' }));
		if (regular.ok && regular.last && regular.can !== 'no') { add('info', 'regular', `בנוסף, לפי כלל הביטול הרגיל של עסקה כזאת אפשר לבטל עד ${btHe(regular.last)} (${regular.section}), גם בלי להוכיח הטעיה.`, regular.section, LAW); }
		add('warn', 'reasonable', `${B.mislead.he}. החוק לא קובע מספר ימים: "זמן סביר" נבחן לפי הנסיבות, ולכן כדאי לשלוח את ההודעה מיד.`, B.mislead.section, LAW);
	} else if (sale === 'ongoing') {
		section = B.ongoing.section;
		const n = channel === 'mail' ? B.ongoing.end_business_days_mail : B.ongoing.end_business_days;
		end = btAddBiz(notice, n, ex);
		feeRule = 'contract';
		if (gymTerm) {
			route = 'gym';
			section = B.gym.section;
			const start = service || deal;
			gym = btGym(reg, price, months, start, notice, alt);
			end = gym.effective;
			add('info', 'gym_written', `${B.gym.written_he} (${B.gym.section}).`, B.gym.section, LAW);
			if (channel === 'phone') { add('warn', 'gym_phone', 'במכון כושר לתקופה קצובה הביטול נעשה בהודעה בכתב: דואר אלקטרוני, דואר רשום או פקס, ולא רק בטלפון.', B.gym.section, LAW); }
			if (alt === null) { add('info', 'gym_alt', 'לא הוזן מחיר חודשי במסלול חלופי: אם העוסק לא מסר אותו בכתב לפני ההתקשרות, הוא לא רשאי לגבות דמי ביטול כלל, רק את החלק היחסי עד שהביטול נכנס לתוקף.', B.gym.section, LAW); }
			add('info', 'gym_month', 'הנוסחה סופרת חודשים שלמים מתחילת המנוי ועד שהביטול נכנס לתוקף; את החלק היחסי הכלי מחשב לפי ימים. החוק לא קובע איך נספר חודש חלקי.', B.gym.section, LAW);
		} else {
			route = 'ongoing';
			if (f.fixedTerm) { can = 'check'; add('info', 'fixed', `${B.ongoing.disclosure_he} (${B.ongoing.disclosure_section}); ${B.ongoing.fixed_term_he} (${B.ongoing.fixed_term_section}).`, B.ongoing.disclosure_section, LAW); }
		}
		add('info', 'end', `${B.ongoing.he} (${B.ongoing.section}). ${B.business_day_he}.`, B.ongoing.section, LAW);
		if (daysBetween(btMax(deal, doc), notice) <= D.days) { add('info', 'fresh', `העסקה נעשתה לפני ${daysBetween(deal, notice)} ימים: ייתכן שעוד חלה זכות הביטול של 14 הימים (בעסקה מרחוק ${D.service_section}; בחנות ${S.continuing_section} לתקנות). בחרו את סוג העסקה כדי לבדוק.`, D.service_section, LAW); }
	} else if (sale === 'store' || sale === 'event') {
		section = sale === 'event' ? S.event_section : '';
		sectionUrl = REGS;
		feeSection = B.fee.regs_section;
		installSection = B.fee.install_regs_section;
		const exceptCode = (kind === 'food' || kind === 'medicine' || kind === 'perishable' || kind === 'underwear' || kind === 'custom' || kind === 'info' || kind === 'gas' || kind === 'abroad') ? kind
			: kind === 'media' && f.opened ? 'media'
				: kind === 'jewelry' && price > S.jewel_max ? 'jewel_high'
					: kind === 'furniture' && f.assembled ? 'assembled' : '';
		if (fault) {
			route = 'remedy';
			can = 'check';
			feeRule = 'none';
			add('warn', 'remedy_store', `התקנות עוסקות בהחזרה שלא בגלל פגם. מוצר פגום, שלא תאם את מה שהובטח או שלא סופק בזמן: התיקון, ההחלפה או ההחזר הם לפי האחריות, חוק המכר ודיני החוזים, ובלי דמי ביטול. את זה בודק הכלי של זכויות הצרכן.`, '', LAW);
		} else if (exceptCode) {
			route = 'excluded';
			can = 'no';
			excluded = hit(S.exceptions, exceptCode);
			section = excluded.section;
		} else if (f.vouchers) {
			route = 'excluded';
			can = 'no';
			excluded = { code: 'vouchers', section: S.vouchers_section, he: S.vouchers_he };
			section = S.vouchers_section;
		} else if (f.late6 && received) {
			route = 'excluded';
			can = 'no';
			excluded = { code: 'late6', section: S.late6_section, he: S.late6_he };
			section = S.late6_section;
		} else if (sale === 'event') {
			route = 'regs';
			item = { item: S.event_item, he: S.event_he };
			if (goods) {
				if (!received) { can = 'open'; basisHe = 'מיום קבלת המוצר'; } else { setWindow(received, S.receipt_days, 'מיום קבלת המוצר'); }
			} else if (btContinuing(kind)) {
				setWindow(btMax(deal, doc), S.receipt_days, doc && doc > deal ? 'מיום קבלת החוזה בכתב' : 'מיום העסקה');
			} else {
				setWindow(deal, S.receipt_days, 'מיום העסקה');
				if (service) { applyCutoff(S.event_before_service_nonrest); }
			}
		} else if (goods && price <= S.min_price) {
			route = 'policy';
			can = 'policy';
			add('info', 'min', `מוצר שמחירו ${S.min_price} ש"ח או פחות אינו "טובין" לפי התקנות (${S.min_section}), ולכן קובעת מדיניות ההחזרה של החנות.`, S.min_section, REGS);
		} else if (!S.items[kind] || (kind === 'sealed' && f.opened)) {
			route = 'policy';
			can = 'policy';
			if (kind === 'sealed' && f.opened) { add('info', 'opened', 'מוצר באריזה מקורית נכלל ברשימה רק כל עוד האריזה לא נפתחה (פרט 4 לתוספת).', S.receipt_section, REGS); }
		} else {
			route = 'regs';
			item = S.items[kind];
			if (item.rule === 'receipt') {
				section = S.receipt_section;
				if (!received) { can = 'open'; basisHe = 'מיום קבלת המוצר'; } else { setWindow(received, S.receipt_days, 'מיום קבלת המוצר'); }
				if (f.used) { can = 'no'; add('danger', 'used', item.open_ok ? `${S.open_ok_he} (${S.open_ok_section}).` : `${S.condition_he} (${S.condition_section}).`, S.condition_section, REGS); }
			} else if (item.rule === 'two_days') {
				section = kind === 'clothing' ? S.clothing_section : S.jewel_section;
				basis = deal;
				basisHe = 'מיום הקנייה';
				last = btNonRestAfter(deal, S.nonrest_days_after, ex);
				plain = last;
				if (kind === 'clothing' && f.tagOff) { can = 'no'; add('danger', 'tag', 'תווית המחיר הוסרה: בביגוד ובהנעלה הזכות חלה רק אם התווית, אם הייתה, לא הוסרה.', S.clothing_section, REGS); }
				if (f.used) { can = 'no'; add('danger', 'used', `${S.condition_he} (${S.condition_section}).`, S.condition_section, REGS); }
			} else if (item.rule === 'before_service') {
				section = S.service_section;
				setWindow(deal, S.receipt_days, 'מיום העסקה');
				if (service) { applyCutoff(S.before_service_nonrest); }
			} else if (item.rule === 'deal_doc') {
				section = S.continuing_section;
				setWindow(btMax(deal, doc), S.receipt_days, doc && doc > deal ? 'מיום קבלת החוזה בכתב' : 'מיום העסקה');
			} else if (item.rule === 'car') {
				section = S.car_section;
				setWindow(deal, S.receipt_days, 'מיום העסקה');
				if (f.registered) { can = 'no'; add('danger', 'registered', 'הרכב כבר נרשם על שם הקונה: לפי התקנות הזכות חלה רק כל עוד לא נרשם.', S.car_section, REGS); }
			}
		}
		if (route === 'policy') {
			section = B.policy.section;
			sectionUrl = LAW;
			add('info', 'policy', `${B.policy.sign_he} (${B.policy.section}). ${B.policy.refused_he} (${B.policy.refused_section}).`, B.policy.section, LAW);
			add('info', 'voucher', `${B.voucher.he} (${B.voucher.section}).`, B.voucher.section, LAW);
		}
		if (route === 'excluded') { add('info', 'voucher', `${B.voucher.he} (${B.voucher.section}).`, B.voucher.section, LAW); }
		if (route === 'regs') {
			refundSection = S.refund_section;
			refundHe = S.refund_he;
			refundDue = btAddBiz(notice, S.refund_business_days, ex);
			returnHe = `${S.branches_he}; ${S.proof_he}`;
			returnSection = S.branches_section;
			if (pay === 'card') { add('info', 'clearing', `${B.fee.clearing_he} (${B.fee.clearing_section}).`, B.fee.clearing_section, REGS); }
			if (btContinuing(kind)) { add('info', 'proportional', `עסקה מתמשכת שהתחילה: משלמים את התמורה היחסית בעבור השימוש (${S.proportional_section}). ${S.continuing_card_he} (${S.continuing_card_section}).`, S.proportional_section, REGS); }
			if (special) { add('info', 'not_store', `${SP.not_store_he} (${SP.distance_section}).`, SP.door_section, LAW); }
		}
	} else if (sale === 'distance' || sale === 'door') {
		const isDoor = sale === 'door';
		const P = isDoor ? H : D;
		const exceptCode = isDoor ? (kind === 'perishable' ? 'perishable' : '')
			: (kind === 'perishable' || kind === 'info' || kind === 'custom') ? kind : kind === 'media' && f.opened ? 'media' : '';
		if (exceptCode && !fault) {
			route = 'excluded';
			can = 'no';
			excluded = isDoor ? { code: 'perishable', section: H.perishable_section, he: 'טובין פסידים' } : hit(D.exceptions, exceptCode);
			section = excluded.section;
		} else if (exceptCode && fault) {
			route = 'remedy';
			can = 'check';
			feeRule = 'none';
			add('warn', 'remedy_except', `זכות הביטול של ${P.section} לא חלה על ${isDoor ? 'טובין פסידים' : hit(D.exceptions, exceptCode).he}, אבל מוצר פגום, שלא תאם או שלא סופק בזמן מזכה בתרופות לפי דיני החוזים ובלי דמי ביטול. את זה בודק הכלי של זכויות הצרכן.`, '', LAW);
		} else {
			route = isDoor ? 'door' : 'distance';
			if (kind === 'food') { can = 'check'; add('warn', 'food', `מזון: אם הוא "טובין פסידים", אין זכות ביטול (${isDoor ? H.perishable_section : 'סעיף 14ג(ד)(1)'}); מזון שאינו פסיד, הזכות הרגילה.`, isDoor ? H.perishable_section : 'סעיף 14ג(ד)(1)', LAW); }
			if (goods) {
				section = P.goods_section;
				const base = btMax(received, doc && received ? doc : null);
				if (!received) { can = can === 'check' ? 'check' : 'open'; basisHe = 'מיום קבלת המוצר'; } else { setWindow(base, P.days, doc && doc > received ? 'מיום קבלת המסמך בכתב' : 'מיום קבלת המוצר'); }
				if (!doc) { add('info', 'doc', isDoor ? 'אם לא קיבלתם את הפרטים שהעוסק חייב למסור ברוכלות (סעיף 14(ד)), 14 הימים נמנים רק מיום שקיבלתם אותם.' : `${D.doc_he} (${D.doc_section}). אם לא קיבלתם מסמך כזה, 14 הימים עוד לא התחילו.`, isDoor ? 'סעיף 14(ד)' : D.doc_section, LAW); }
			} else {
				section = P.service_section;
				setWindow(btMax(deal, doc), P.days, doc && doc > deal ? 'מיום קבלת המסמך בכתב' : 'מיום העסקה');
				if (!btContinuing(kind)) {
					if (isDoor) {
						if (f.started) { can = 'no'; add('danger', 'started', `ברוכלות, שירות שאינו מתמשך מבטלים רק אם עוד לא התחיל (${H.service_section}).`, H.service_section, LAW); }
					} else if (kind === 'travel' || kind === 'abroad') {
						if (service) { applyCutoff(D.travel_before_nonrest); }
						section = D.travel_section;
					} else if (service) {
						applyCutoff(D.service_before_nonrest);
					}
				} else if (!isDoor) {
					add('info', 'proportional', `${D.proportional_he} (${D.proportional_section}).`, D.proportional_section, LAW);
				}
				if (kind === 'abroad' && !isDoor) {
					add('info', 'abroad', `${D.abroad_he} (${D.abroad_section}). ${D.abroad_flight_he}.`, D.abroad_section, LAW);
					if (f.abroadPolicy) { route = 'abroadPolicy'; can = 'check'; section = D.abroad_section; last = null; plain = null; rolled = false; cutoff = null; basis = null; add('warn', 'abroad_policy', 'בחרתם במדיניות הביטול של נותן השירות בחו"ל: התנאים שלה קובעים אם ומתי אפשר לבטל ובכמה; אם היא כוללת החזר, העוסק משיב אותו במועדי סעיף 14ה (14 ימים).', D.abroad_section, LAW); }
				}
			}
			if (special) {
				const ok = isDoor || f.conversation;
				if (!ok) {
					add('warn', 'no_talk', `${SP.conversation_he} (${SP.distance_section}). בלי שיחה חלים 14 הימים הרגילים.`, SP.distance_section, LAW);
				} else {
					const base4 = btMax(deal, goods ? received : null, doc);
					const plain4 = btAddMonths(base4, SP.months);
					const last4 = btRoll(plain4, ex);
					special4 = { base: base4, plain: plain4, last: last4, section: isDoor ? SP.door_section : SP.distance_section, pending: goods && !received };
					if (cutoff && last4 > cutoff) { special4.last = cutoff; special4.cut = true; }
					if (special4.pending) {
						can = can === 'check' ? 'check' : 'open';
						basisHe = 'מיום קבלת המוצר';
					} else if (!last || special4.last > last) {
						last = special4.last; plain = special4.cut ? cutoff : plain4; rolled = !special4.cut && last4 !== plain4; basis = base4; basisHe = 'מהמאוחר מבין יום העסקה, קבלת המוצר וקבלת המסמך';
						section = special4.section;
					}
					add('info', 'special', `${{ senior: `אזרח ותיק (מגיל ${SP.senior_age})`, disability: 'אדם עם מוגבלות', immigrant: `עולה חדש (עד ${SP.immigrant_years} שנים מתעודת העולה)` }[buyer]}: ${SP.months} חודשים (${special4.section}, ${SP.amendment_he}, לעסקאות מ-${btHe(SP.in_force)}). ${SP.proof_he} (${SP.proof_section}).`, special4.section, SP.url);
					if (isDoor && f.started && !btContinuing(kind) && !goods) { add('info', 'special_started', 'שירות חד-פעמי שכבר התחיל ברוכלות: אם ארבעת החודשים חלים עליו זו שאלה לעורך דין; הכלי לא מכריע.', SP.door_section, LAW); }
					if (!isDoor && kind === 'service') { add('info', 'special_once', 'בשירות חד-פעמי שכבר ניתן, אם אפשר עוד לבטל בתוך ארבעת החודשים זו שאלה לעורך דין; הכלי מציג את ארבעת החודשים כלשון החוק.', SP.distance_section, LAW); }
				}
			}
			if (route !== 'abroadPolicy') { if (fault) { feeRule = 'none'; } }
			if (isDoor) {
				feeRule = 'none';
				feeSection = H.effects_section;
				installSection = B.fee.install_door_section;
				refundHe = H.effects_he;
				refundSection = H.effects_section;
				returnHe = 'הצרכן מעמיד את הנכס לרשות העוסק במקום שבו נמסר לו';
				returnSection = H.effects_section;
				add('info', 'door_days', `${H.refund_days_he}; עוסק שלא השיב את מה שקיבל חשוף לפיצויים לדוגמה (${B.comp.door}).`, H.effects_section, LAW);
			} else {
				feeSection = fault ? B.fee.none_section : B.fee.law_section;
				refundDue = btDays(notice, D.refund_days, ex).last;
				refundHe = D.refund_he;
				refundSection = D.refund_section;
				returnHe = fault ? D.collect_he : D.return_he;
				returnSection = fault ? D.collect_section : D.return_section;
				if (channel === 'mail') { add('info', 'mail', '14 הימים להחזר נמנים מיום שהעוסק קיבל את ההודעה; בדואר רשום זה יום המסירה, לא יום השליחה.', D.refund_section, LAW); }
				if (f.used && goods) { add('info', 'used_distance', `במכר מרחוק החוק לא דורש שהמוצר לא היה בשימוש; ${B.fee.damage_he} (${B.fee.damage_section}).`, B.fee.damage_section, LAW); }
			}
		}
		if (route === 'excluded' || route === 'remedy') { refundDue = null; }
	}

	// The window against the notice day and today.
	let expired = false;
	if (cutoff && basis && cutoff < basis && can !== 'no') { can = 'no'; add('danger', 'too_close', `העסקה נעשתה פחות מ-${cutoffN} ימים שאינם ימי מנוחה לפני השירות, ולכן אין חלון לביטול לפי החוק.`, section, sectionUrl); }
	if (last && can !== 'no' && (route === 'regs' || route === 'distance' || route === 'door')) {
		if (notice > last) { expired = true; can = 'expired'; }
	}
	if (expired) { add('danger', 'expired', `לפי כלל החוק היום האחרון היה ${btHe(last)}. אחריו אפשר לבקש ביטול לפי מדיניות העסק או החוזה, או לטעון לפגם, אי התאמה או הטעיה.`, section, sectionUrl); }
	if (rolled) { add('info', 'rest', `${btHe(plain)} הוא יום מנוחה, ולכן היום האחרון עובר ל-${btHe(last)} (${B.interpretation.rest_section} ל${B.interpretation.he}).`, B.interpretation.rest_section, B.interpretation.url); }
	if (cutoff && last === cutoff && can !== 'no') { add('info', 'cutoff', `השירות ב-${btHe(service)}: צריך לבטל כש${cutoffN === 1 ? 'נשאר יום' : `נשארים לפחות ${cutoffN} ימים`} שאינם ימי מנוחה לפניו, כלומר עד ${btHe(cutoff)} (לא סופרים את יום ההודעה ואת יום השירות).`, section, sectionUrl); }

	// Money: the fee, the installation, the refund.
	const ok = can === 'yes' || can === 'open' || can === 'check';
	if (!ok) { refundDue = null; }
	let fee = null;
	let install = 0;
	let refund = null;
	if (route === 'gym') {
		fee = gym.fee;
		refund = gym.refund;
	} else if (ok && route !== 'ongoing' && route !== 'policy' && route !== 'abroadPolicy') {
		fee = feeRule === 'pct' ? btFee(reg, price) : 0;
		install = f.installed ? Math.min(B.fee.install_cap, price - fee) : 0;
		refund = btR2(Math.max(0, price - fee - install));
	}
	const excess = charged !== null && fee !== null ? btR2(Math.max(0, charged - fee)) : null;
	if (excess) { add('warn', 'excess', `נוכו ${charged} ש"ח, והחוק מתיר לכל היותר ${fee} ש"ח: ההפרש מגיע לכם.`, feeSection, LAW); }
	if (fee !== null && feeRule === 'pct' && route !== 'gym') { add('info', 'fee_includes', `${B.fee.includes_he} (${B.fee.includes_section}).`, B.fee.includes_section, LAW); }
	if (f.installed && ok && route !== 'ongoing' && route !== 'gym') { add('info', 'install', `${B.fee.install_he} (${installSection}).`, installSection, LAW); }

	// Payment means: the card charge, a standing order (the Payment Services Law).
	const P2 = B.psl;
	const psl = {};
	if (pay === 'debit') {
		psl.relayBy = btAddBiz(notice, P2.relay_business_days, ex);
		psl.stopBy = btAddBiz(notice, P2.stop_business_days, ex);
		add('info', 'debit', `${P2.authz_he} (${P2.authz_section}); ${P2.stop_he} (${P2.stop_section}). ${P2.charge_he} (${P2.charge_section}). ${P2.business_day_he}.`, P2.authz_section, P2.url);
	}
	if (pay === 'card' && reason === 'late') { add('info', 'card_late', `${P2.guaranteed_he} (${P2.guaranteed_section} ל${P2.he}).`, P2.guaranteed_section, P2.url); }
	if (pay === 'card' && (route === 'distance' || route === 'mislead')) { add('info', 'card', 'בתשלום בכרטיס: העוסק מבטל את החיוב ומוסר עותק מהודעת ביטול החיוב (סעיף 14ה).', D.refund_section, LAW); }

	// Compensation without proof of damage, when the business does not do what the law says (the pitzui tool computes it).
	const compSection = route === 'door' ? B.comp.door : route === 'distance' ? B.comp.distance : route === 'ongoing' || route === 'gym' ? B.comp.ongoing : route === 'abroadPolicy' ? B.comp.abroad : route === 'policy' ? B.comp.policy : '';
	if (compSection) { add('info', 'comp', `עוסק שלא מקיים את הביטול חשוף לפיצויים לדוגמה בלי הוכחת נזק, עד ${B.comp.max.toLocaleString('en-US')} ש"ח לכל הפרה (${compSection}); ${B.comp.demand_he} (${B.comp.demand_section}).`, compSection, LAW); }

	// The channels to give notice.
	let channels;
	if (route === 'regs' || route === 'policy') {
		channels = [{ code: 'store', he: B.store_channel_he, section: B.store_channel_section }];
	} else if (route === 'gym') {
		channels = B.channels.filter((c) => c.code !== 'phone' && c.code !== 'web');
	} else {
		channels = B.channels.slice();
	}

	// Every dated event, for the ribbon, the .ics and the dates table.
	const events = [];
	const ev = (key, d, kindE, he, sec, url) => { if (d) { events.push({ key, date: d, kind: kindE, he, section: sec || '', url: url || '' }); } };
	ev('deal', deal, 'start', 'יום העסקה', '', '');
	if (received) { ev('received', received, 'start', 'קבלת המוצר', '', ''); }
	if (doc && doc !== deal && doc !== received) { ev('doc', doc, 'start', 'קבלת המסמך או החוזה בכתב', '', ''); }
	if (route === 'gym') { ev('start', service || deal, 'start', 'תחילת המנוי', '', ''); }
	if (notice && notice !== deal) { ev('notice', notice, 'start', 'הודעת הביטול', B.channels_section, LAW); }
	if (last && !expired && can !== 'no') { ev('last', last, 'deadline', `היום האחרון לביטול לפי ${section}${special4 && last === special4.last ? ' (ארבעה חודשים)' : ''}`, section, sectionUrl); }
	if (last && expired) { ev('last', last, 'limit', `היום האחרון לביטול לפי ${section} (עבר)`, section, sectionUrl); }
	if (cutoff && service) { ev('service', service, 'info', 'יום השירות', '', ''); }
	if (refundDue && ok) { ev('refund', refundDue, 'deadline', `העוסק מחזיר את הכסף עד היום הזה (${refundSection})`, refundSection, route === 'regs' ? REGS : LAW); }
	if (end && (route === 'ongoing' || route === 'gym')) { ev('end', end, 'deadline', route === 'gym' ? `הביטול נכנס לתוקף: חודש מההודעה (${B.gym.section})` : `החוזה מסתיים והחיובים נפסקים (${B.ongoing.section}; ${channel === 'mail' ? B.ongoing.end_business_days_mail : B.ongoing.end_business_days} ימי עסקים)`, route === 'gym' ? B.gym.section : B.ongoing.section, LAW); }
	if (psl.stopBy) { ev('psl_stop', psl.stopBy, 'info', `הוראת הקבע: ההרשאה מבוטלת לכל המאוחר יום עסקים אחד אחרי שהבנק קיבל את ההודעה (${P2.stop_section})`, P2.stop_section, P2.url); }
	if (refundDue && ok && reg.small_claims) {
		const limit = btAddMonths(refundDue, 12 * reg.small_claims.limitation_years);
		ev('limit', limit, 'limit', `התיישנות לפי כלל החוק: ${reg.small_claims.limitation_years} שנים מהיום שבו היה צריך להחזיר את הכסף`, reg.small_claims.limitation_he, reg.small_claims.limitation_url);
	}
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	const daysLeft = last && today ? daysBetween(today, last) : null;
	const claim = refund !== null && refund > 0 && reg.small_claims ? { amount: refund, fee: btCourtFee(reg, refund), ceiling: reg.small_claims.ceiling[reg.small_claims.ceiling.length - 1].amount } : null;
	return {
		ok: true, sale, kind, buyer, reason, pay, channel, flagsIn: f, price, deal, received, doc, service, notice, today,
		route, can, last, plain, rolled, basis, basisHe, section, sectionUrl, cutoff, cutoffN, expired, item, excluded, special4,
		feeRule, feeSection, fee, install, installSection, refund, refundDue, refundHe, refundSection, returnHe, returnSection,
		charged, excess, gym, end, psl, channels, flags, events, daysLeft, claim, months, alt,
	};
}

/** The analytics band: the route and the state, never a date or an amount. */
export function btBand(r) {
	if (!r || !r.ok) { return 'error'; }
	return `${r.route}-${r.can}`;
}
