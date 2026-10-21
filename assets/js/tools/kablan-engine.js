/**
 * The contractor-purchase engine (dira-mikablan, the family + land wave, 22.10.2026, HAD-579). Pure, no DOM.
 * Three clocks of one purchase, every rule from reg.fl_kablan:
 * 1. the payments and their linkage to the residential building input index (Sale (Apartments) Law s.5ג for contracts
 *    from 7.7.2022: at most half of each payment, the first 20% of the price never, and not after the delivery date of
 *    the contract; the index is the one published last before the linkage date, CBS series 200010);
 * 2. the delivery-delay compensation of s.5א (both versions: contracts from 7.7.2022 and up to 6.7.2022), on the rent of a
 *    similar apartment the person types (the law sets no amount);
 * 3. the inspection and warranty clock of s.4 and the addendum (each kind of defect), the one-year notice of s.4א and the
 *    20 years of a fundamental non-conformity;
 * plus the securities of the Investments Law for every payment (s.2: above 7%; s.3ב(ה): 14 business days).
 * Every top-level name starts with "kb" (the bundler concatenates instrument.js + dates.js + this file + the UI).
 */
import { addDays, addMonths, addYears, daysBetween, parseDate, isRestDay } from './dates.js';

export const KB_MAX_PRICE = 100000000;
const kbRound = (n) => Math.round(n * 100) / 100;

/** The index value of a month on the July 2025 = 100 base: older months are divided by the CBS chaining coefficient. */
export function kbIndex(reg, month) {
	const ix = reg.fl_kablan.index;
	if (Object.prototype.hasOwnProperty.call(ix.series_2025, month)) { return { month, value: ix.series_2025[month], published: ix.series_2025[month], base: '2025-07' }; }
	if (Object.prototype.hasOwnProperty.call(ix.series_2011, month)) { return { month, value: ix.series_2011[month] / ix.chaining.coefficient, published: ix.series_2011[month], base: '2011-07' }; }
	return null;
}

/** The month whose index is the known one on a day: the month before last until the 15th, the last month from the 16th. */
export function kbKnownMonth(reg, iso) {
	const [y, m, d] = iso.split('-').map(Number);
	const back = d >= reg.fl_kablan.index.known_from_day ? 1 : 2;
	const total = y * 12 + (m - 1) - back;
	return `${Math.floor(total / 12)}-${String(total % 12 + 1).padStart(2, '0')}`;
}

/** The linkage ratio between two days (the index known on each); a month not yet published is reported, not guessed. */
export function kbRatio(reg, fromIso, toIso) {
	const latest = reg.fl_kablan.index.latest_month;
	const a = kbIndex(reg, kbKnownMonth(reg, fromIso));
	const wanted = kbKnownMonth(reg, toIso);
	const pending = wanted > latest;
	const b = kbIndex(reg, pending ? latest : wanted);
	if (!a || !b) { return null; }
	return { from: a, to: b, wanted, pending, ratio: b.value / a.value };
}

/** "A month or part of it": the number of months from the contract date that a day falls into (1 = within the first). */
export function kbMonthsInto(d0, d1) {
	if (d1 <= d0) { return 0; }
	let n = 1;
	while (addMonths(d0, n) < d1) { n += 1; }
	return n;
}

/** n business days after a day, counting Sunday to Thursday and skipping the statutory rest days. */
export function kbBusinessDays(iso, n) {
	let d = iso;
	let left = n;
	while (left > 0) {
		d = addDays(d, 1);
		const dow = new Date(`${d}T00:00:00Z`).getUTCDay();
		if (dow !== 5 && dow !== 6 && !isRestDay(d)) { left -= 1; }
	}
	return d;
}

const kbIso = (v) => {
	if (!v) { return ''; }
	return parseDate(v) || 'bad';
};

/** The delivery-delay compensation of s.5א, month by month. */
export function kbDelay(reg, regime, contractDate, endDate, rent, excused) {
	const dl = reg.fl_kablan.delay[regime];
	const out = { regime, months: 0, rows: [], total: 0, compMonths: 0, started: false, excused, startDate: '', firstPay: '' };
	if (!contractDate || !endDate || endDate <= contractDate) { return out; }
	out.days = daysBetween(contractDate, endDate);
	out.months = kbMonthsInto(contractDate, endDate);
	out.startDate = regime === 'new' ? addMonths(contractDate, dl.grace_months) : addDays(contractDate, dl.grace_days);
	out.started = endDate > out.startDate;
	if (!out.started || excused) { return out; }
	const first = regime === 'new' ? dl.grace_months + 1 : 1;
	for (let k = first; k <= out.months; k += 1) {
		const tier = dl.tiers.find((t) => k >= t.from_month && (t.to_month === null || k <= t.to_month));
		let pay = addMonths(contractDate, k);
		if (regime === 'old' && k <= 2) { pay = addDays(contractDate, dl.grace_days); }
		const amount = rent > 0 ? kbRound(rent * tier.mult) : 0;
		out.rows.push({ k, from: addMonths(contractDate, k - 1), to: addMonths(contractDate, k), mult: tier.mult, item: tier.item, amount, pay, partial: k === out.months && addMonths(contractDate, k) > endDate });
	}
	out.compMonths = out.rows.length;
	out.total = kbRound(out.rows.reduce((s, r) => s + r.amount, 0));
	out.firstPay = out.rows.length ? out.rows[0].pay : '';
	return out;
}

/** The payments: amounts, the unlinked first 20%, the linked part, the linkage date and the linkage difference. */
export function kbPayments(reg, input, regime, today) {
	const fl = reg.fl_kablan;
	const lk = fl.linkage;
	const price = input.price;
	const share = Number(input.linkShare);
	const rows = input.payments.map((p, i) => ({ i, pct: Number(p.pct), date: p.date })).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.i - b.i));
	const free20 = regime === 'new' ? price * lk.unlinked_first_pct / 100 : 0;
	const free7 = price * fl.guarantee.free_pct / 100;
	const baseIso = input.baseMonth ? null : input.signDate;
	const wantedBase = input.baseMonth || kbKnownMonth(reg, input.signDate);
	// Signing in the future: the base index is not published yet; the latest one stands in, and the result says so.
	const basePending = wantedBase > fl.index.latest_month;
	const baseMonth = basePending ? fl.index.latest_month : wantedBase;
	const base = kbIndex(reg, baseMonth);
	let cum = 0;
	const out = rows.map((r) => {
		const amount = kbRound(price * r.pct / 100);
		const unlinked = Math.max(0, Math.min(amount, free20 - cum));
		const secured = Math.max(0, Math.min(amount, cum + amount - free7));
		cum += amount;
		const linked = kbRound(Math.max(0, Math.min(amount * share / 100, amount - unlinked)));
		const capDate = regime === 'new' && !input.excused && r.date > input.deliveryDate ? input.deliveryDate : r.date;
		const wanted = kbKnownMonth(reg, capDate);
		const pending = wanted > fl.index.latest_month;
		const at = kbIndex(reg, pending ? fl.index.latest_month : wanted);
		const ratio = base && at ? at.value / base.value : 1;
		const diff = linked && base && at ? Math.round(linked * (ratio - 1)) : 0;
		return {
			n: r.i + 1, pct: r.pct, date: r.date, amount, unlinked: kbRound(unlinked), linked, capDate, capped: capDate !== r.date,
			indexMonth: wanted, indexUsed: at ? at.month : '', pending, ratio, diff, past: r.date <= today,
			secured: kbRound(secured), guaranteeBy: secured > 0 ? kbBusinessDays(r.date, fl.guarantee.days_business) : '',
		};
	});
	const total = kbRound(out.reduce((s, r) => s + r.amount, 0));
	const linkedTotal = kbRound(out.reduce((s, r) => s + r.linked, 0));
	const diffTotal = out.reduce((s, r) => s + r.diff, 0);
	const diffKnown = out.filter((r) => !r.pending).reduce((s, r) => s + r.diff, 0);
	// The index line: every published month from the base month to the last month the linkage can reach.
	const lastCap = out.reduce((m, r) => (r.capDate > m ? r.capDate : m), input.signDate);
	const endMonth = kbKnownMonth(reg, lastCap) > fl.index.latest_month ? fl.index.latest_month : kbKnownMonth(reg, lastCap);
	const line = [];
	if (base) {
		let [y, m] = baseMonth.split('-').map(Number);
		for (let guard = 0; guard < 400; guard += 1) {
			const key = `${y}-${String(m).padStart(2, '0')}`;
			if (key > endMonth) { break; }
			const v = kbIndex(reg, key);
			if (v) { line.push({ month: key, change: (v.value / base.value - 1) * 100 }); }
			m += 1; if (m > 12) { m = 1; y += 1; }
		}
	}
	return { rows: out, total, linkedTotal, diffTotal, diffKnown, base, baseMonth, wantedBase, basePending, baseIso, line, maxLinkedPct: price ? kbRound(linkedTotal / price * 100) : 0 };
}

/** The inspection and warranty clock from the delivery day. */
export function kbWarranty(reg, d0, today) {
	const w = reg.fl_kablan.warranty;
	const left = (iso) => daysBetween(today, iso);
	const items = w.items.map((it) => {
		const inspEnd = addYears(d0, it.years);
		const warrEnd = addYears(inspEnd, w.warranty_years);
		return { n: it.n, he: it.he, short_he: it.short_he || it.he, years: it.years, item: it.item, inspEnd, warrEnd, inspLeft: left(inspEnd), warrLeft: left(warrEnd) };
	});
	const visible = addYears(d0, w.visible_years);
	const fundamental = addYears(d0, w.fundamental_years);
	const ends = [{ date: visible, kind: 'visible', he: 'הודעה על ליקוי שאפשר היה לגלות במסירה', rule: w.visible.section }];
	items.forEach((it) => {
		ends.push({ date: it.inspEnd, kind: 'insp', n: it.n, he: `סוף תקופת הבדק: ${it.he}`, rule: `${it.item}; ${w.inspection.section}` });
		ends.push({ date: it.warrEnd, kind: 'warr', n: it.n, he: `סוף תקופת האחריות: ${it.he}`, rule: w.warranty.section });
	});
	ends.push({ date: fundamental, kind: 'fund', he: 'סוף 20 השנים לאי-התאמה יסודית', rule: w.fundamental.section });
	const future = ends.filter((e) => e.date >= today).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	const nearestDate = future.length ? future[0].date : '';
	const nearest = future.filter((e) => e.date === nearestDate);
	return { d0, items, visible, fundamental, ends, nearest, nearestDate, nearestLeft: nearestDate ? left(nearestDate) : null, elapsedDays: daysBetween(d0, today) };
}

export function kbCompute(reg, raw) {
	const fl = reg.fl_kablan;
	const today = raw.today || fl.checked_on;
	const errors = [];
	const price = Number(raw.price);
	if (!Number.isFinite(price) || price <= 0) { errors.push({ field: 'price', he: 'נא להקליד את מחיר הדירה בחוזה, בשקלים.' }); } else if (price > KB_MAX_PRICE) { errors.push({ field: 'price', he: 'המחיר גבוה מ-100 מיליון ₪: נא לבדוק את הספרות.' }); }
	const signDate = kbIso(raw.signDate);
	const deliveryDate = kbIso(raw.deliveryDate);
	const actualDate = kbIso(raw.actualDate);
	if (!signDate || signDate === 'bad') { errors.push({ field: 'signDate', he: 'נא להקליד את יום החתימה על החוזה (למשל 1.3.2023).' }); }
	if (!deliveryDate || deliveryDate === 'bad') { errors.push({ field: 'deliveryDate', he: 'נא להקליד את מועד המסירה שבחוזה.' }); } else if (signDate && signDate !== 'bad' && deliveryDate <= signDate) { errors.push({ field: 'deliveryDate', he: 'מועד המסירה שבחוזה צריך להיות אחרי יום החתימה.' }); }
	if (actualDate === 'bad') { errors.push({ field: 'actualDate', he: 'התאריך של המסירה בפועל לא תקין.' }); } else if (actualDate && signDate && signDate !== 'bad' && actualDate <= signDate) { errors.push({ field: 'actualDate', he: 'המסירה בפועל צריכה להיות אחרי יום החתימה.' }); }
	const rent = raw.rent === '' || raw.rent === undefined || raw.rent === null ? 0 : Number(raw.rent);
	if (!Number.isFinite(rent) || rent < 0 || rent > 1000000) { errors.push({ field: 'rent', he: 'שכר הדירה החודשי של דירה דומה לא תקין.' }); }
	const regime = signDate && signDate !== 'bad' && signDate < fl.linkage.from ? 'old' : 'new';
	const share = Number(raw.linkShare);
	if (!Number.isFinite(share) || share < 0 || share > 100) { errors.push({ field: 'linkShare', he: 'החלק הצמוד צריך להיות בין 0% ל-100%.' }); } else if (regime === 'new' && share > fl.linkage.max_share_pct) { errors.push({ field: 'linkShare', he: `בחוזה מ-7.7.2022 מותר להצמיד עד ${fl.linkage.max_share_pct}% מכל תשלום (${fl.linkage.half.section}).` }); }
	const pays = Array.isArray(raw.payments) ? raw.payments : [];
	const payments = [];
	let pctSum = 0;
	pays.forEach((p, i) => {
		const pct = Number(p.pct);
		const date = kbIso(p.date);
		if (!Number.isFinite(pct) || pct <= 0 || pct > 100) { errors.push({ field: `pay${i}`, he: `תשלום ${i + 1}: האחוז צריך להיות בין 0 ל-100.` }); return; }
		if (!date || date === 'bad') { errors.push({ field: `pay${i}`, he: `תשלום ${i + 1}: נא להקליד תאריך.` }); return; }
		if (signDate && signDate !== 'bad' && date < signDate) { errors.push({ field: `pay${i}`, he: `תשלום ${i + 1}: התאריך לפני יום החתימה.` }); return; }
		pctSum += pct;
		payments.push({ pct, date });
	});
	if (!pays.length) { errors.push({ field: 'pay0', he: 'נא להקליד לפחות תשלום אחד.' }); } else if (payments.length === pays.length && Math.abs(pctSum - 100) > 0.001) { errors.push({ field: 'paysum', he: `סכום התשלומים ${kbRound(pctSum)}% ולא 100%: נא לתקן את האחוזים.` }); }
	if (raw.baseMonth && (!/^\d{4}-\d{2}$/.test(raw.baseMonth) || !kbIndex(reg, raw.baseMonth))) { errors.push({ field: 'baseMonth', he: 'אין מדד שפורסם לחודש הבסיס הזה (הנתונים מינואר 2015).' }); }
	if (!errors.length && !raw.baseMonth && kbKnownMonth(reg, signDate) <= fl.index.latest_month && !kbIndex(reg, kbKnownMonth(reg, signDate))) { errors.push({ field: 'signDate', he: 'אין בכלי מדד לחודש הבסיס של חוזה כזה (הנתונים מינואר 2015); נא לבחור חודש בסיס.' }); }
	if (errors.length) { return { ok: false, errors }; }

	const excused = Boolean(raw.excused);
	const input = { price, signDate, deliveryDate, actualDate, rent, linkShare: share, payments, baseMonth: raw.baseMonth || '', excused, today };
	const delivered = Boolean(actualDate) && actualDate <= today;
	const stage = today < signDate ? 'signing' : delivered ? 'after' : 'waiting';
	// The delay runs to the delivery day; with no day typed and the contract date passed, it runs to today (accrued).
	const delayEnd = actualDate || (today > deliveryDate ? today : '');
	const delay = kbDelay(reg, regime, deliveryDate, delayEnd, rent, excused);
	delay.toToday = !actualDate && today > deliveryDate;
	delay.expected = Boolean(actualDate) && actualDate > today;
	delay.paidByToday = kbRound(delay.rows.filter((r) => r.pay <= today).reduce((s, r) => s + r.amount, 0));
	const pay = kbPayments(reg, input, regime, today);
	const d0 = actualDate || deliveryDate;
	const warranty = kbWarranty(reg, d0, today);
	warranty.fromContract = !actualDate;

	const events = [];
	pay.rows.forEach((r) => {
		if (r.date >= today) { events.push({ date: r.date, kind: 'pay', what: `תשלום ${r.n} לקבלן: ${r.pct}% מהמחיר`, rule: 'לוח התשלומים שבחוזה' }); }
		if (r.guaranteeBy && r.guaranteeBy >= today) { events.push({ date: r.guaranteeBy, kind: 'guar', what: `הערבות או הפוליסה על תשלום ${r.n} צריכה להגיע`, rule: fl.guarantee.per_payment.section }); }
	});
	if (delay.started && !excused) {
		const dl = fl.delay[regime];
		if (regime === 'new') {
			events.push({ date: delay.startDate, kind: 'delay', what: 'חלף חודש מהמועד שבחוזה: מכאן הפיצוי על האיחור', rule: dl.rule.section });
			dl.tiers.slice(1).forEach((t) => { const d = addMonths(deliveryDate, t.from_month - 1); if (d < delayEnd) { events.push({ date: d, kind: 'delay', what: `הפיצוי עולה לדמי שכירות כפול ${t.mult}`, rule: t.item }); } });
		} else {
			events.push({ date: delay.startDate, kind: 'delay', what: 'חלפו 60 ימים מהמועד שבחוזה: הפיצוי מגיע מהיום הראשון', rule: dl.rule.section });
			const d = addMonths(deliveryDate, dl.tiers[1].from_month - 1);
			if (d < delayEnd) { events.push({ date: d, kind: 'delay', what: `הפיצוי יורד לדמי שכירות כפול ${dl.tiers[1].mult}`, rule: dl.tiers[1].item }); }
		}
		const seen = new Set();
		delay.rows.forEach((r) => { if (r.pay >= today && !seen.has(r.pay)) { seen.add(r.pay); events.push({ date: r.pay, kind: 'comp', what: `מועד תשלום הפיצוי על חודש האיחור ${r.k}`, rule: dl.pay.section }); } });
	}
	warranty.ends.forEach((e) => { if (e.date >= today) { events.push({ date: e.date, kind: e.kind, what: e.he, rule: e.rule }); } });
	const future = events.filter((e) => e.date >= today).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	events.length = 0;
	events.push(...future);

	const flags = [];
	if (regime === 'old') { flags.push({ he: `החוזה נחתם לפני 7.7.2022: חלים פיצויי האיחור בנוסח הקודם של סעיף 5א, וההצמדה נקבעת בחוזה (${fl.law.amend9_section}).` }); }
	if (pay.rows.some((r) => r.capped)) { flags.push({ he: `תשלום שמועדו אחרי מועד המסירה שבחוזה צמוד רק עד מועד המסירה שבחוזה (${fl.linkage.until.section}).` }); }
	if (pay.rows.some((r) => r.pending)) { flags.push({ he: `המדד שיחול על חלק מהתשלומים עוד לא פורסם: ההפרש מחושב לפי המדד האחרון שפורסם (${Number(fl.index.latest_month.slice(5))}.${fl.index.latest_month.slice(0, 4)}) ויתעדכן ביום התשלום.` }); }
	if (pay.basePending) { flags.push({ he: `המדד הבסיסי (של ${Number(pay.wantedBase.slice(5))}.${pay.wantedBase.slice(0, 4)}) עוד לא פורסם: עד שיפורסם, החישוב לפי המדד האחרון שפורסם (${fl.linkage.index_def.section}).` }); }
	if (excused) { flags.push({ he: `סימנתם שהאיחור נגרם רק בגלל הקונה או בנסיבות של סיכול: אין פיצוי לפי הסעיף (${fl.delay[regime].except.section}), ובחוזה מ-7.7.2022 גם תקרת ההצמדה במועד המסירה לא חלה (${fl.linkage.until.section}).` }); }
	if (delay.started && !excused && !(rent > 0)) { flags.push({ he: 'הקלידו את שכר הדירה החודשי של דירה דומה כדי לראות את סכום הפיצוי. החוק לא קובע סכום.' }); }

	return { ok: true, input, today, regime, stage, delivered, delay, pay, warranty, events, flags };
}

export const compute = kbCompute;
