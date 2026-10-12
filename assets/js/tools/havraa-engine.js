/**
 * T03 engine: recuperation pay (דמי הבראה) under the private-sector general extension order (HAD-490).
 *
 * Dependency-free ES module. Every number comes from registry.havraa, checked against the official
 * source on the registry's checked_on date:
 *  - Days by seniority, the first-year rule, part-time and the summer payment months: צו הרחבה בדבר
 *    השתתפות המעביד בהוצאות הבראה ונופש (ילקוט הפרסומים 7417, 8.1.2017), s.5(א)-(ד); unpaid leave is
 *    not counted, maternity leave is (s.6); the old two-year limit for leavers was deleted (s.7(א)), so
 *    the general limitation applies: 7 years (חוק ההתיישנות, s.5(1), s.6).
 *  - Day price: 378 from 2014, 418 from 1.7.2023 (י"פ 11651, s.3), 451.50 for havraa year 2026
 *    (י"פ 14863, s.3). 2024 and 2025 were frozen by law (each law's s.2(א)).
 *  - 2024 and 2025: the employer deducts one day's price from havraa paid in that year (each law's
 *    s.3(א)); half a day for a "partial-deduction worker"; the deducted part is never paid later (s.8).
 *
 * Two questions:
 *  mode "year":   how much for one havraa year, from completed years of seniority and job %.
 *  mode "period": what is owed for a stretch of work (left mid-year, or never paid), work year by
 *                 work year, valued at the price in force on the 1 July inside each work year (the
 *                 payment months are June-September, s.5(ד)); a last part-year with no 1 July inside
 *                 it is valued at the price on the last working day.
 */

const DAY = 86400000;

export function parseDate(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	let y; let mo; let d;
	if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; } else {
		m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
		if (!m) { return null; }
		d = +m[1]; mo = +m[2]; y = +m[3];
		if (y < 100) { y += y >= 70 ? 1900 : 2000; }
	}
	const t = Date.UTC(y, mo - 1, d);
	const back = new Date(t);
	if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) { return null; }
	return `${String(y).padStart(4, '0')}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const ms = (iso) => Date.parse(`${iso}T00:00:00Z`);
const iso = (t) => new Date(t).toISOString().slice(0, 10);
function round2(x) { return Math.round((x + Number.EPSILON) * 100) / 100; }
function round4(x) { return Math.round((x + Number.EPSILON) * 10000) / 10000; }

/** The same calendar day n years later; 29 February becomes 28 February in a common year. */
export function addYears(isoDate, n) {
	const [y, m, d] = isoDate.split('-').map(Number);
	const last = new Date(Date.UTC(y + n, m, 0)).getUTCDate();
	return `${String(y + n).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}
export function addDays(isoDate, n) { return iso(ms(isoDate) + n * DAY); }
export function daysBetween(a, b) { return Math.round((ms(b) - ms(a)) / DAY); }
export function addMonths(isoDate, n) {
	const [y, m, d] = isoDate.split('-').map(Number);
	const total = y * 12 + (m - 1) + n;
	const ny = Math.floor(total / 12);
	const nm = total % 12;
	const last = new Date(Date.UTC(ny, nm + 1, 0)).getUTCDate();
	return `${String(ny).padStart(4, '0')}-${String(nm + 1).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}

/**
 * Months worked from `from` through `to` (inclusive), as the Ministry of Labor's examples count them:
 * whole months, plus the remaining days as a share of that month. 1.3-31.8 = 6; 1.3-15.3 = 15/31.
 */
export function monthsWorked(from, to) {
	const end = addDays(to, 1);
	let m = 0;
	while (m < 1200 && addMonths(from, m + 1) <= end) { m += 1; }
	const at = addMonths(from, m);
	const rest = daysBetween(at, end);
	const len = daysBetween(at, addMonths(at, 1));
	return m + (rest > 0 ? rest / len : 0);
}

/** Days for work year k (1 = the first year), from the order's table (s.5(א)). */
export function daysFor(table, k) {
	for (const [from, to, days] of table) {
		if (k >= from && (to === null || k <= to)) { return days; }
	}
	return null;
}

/** The private-sector day price in force on a date (rows carry their valid-from). */
export function priceOn(rates, isoDate) {
	let row = null;
	for (const r of rates) { if (r.from <= isoDate) { row = r; } }
	return row;
}

/** The statutory deduction for havraa paid in a calendar year, or null. */
export function deductionFor(havraa, year) {
	return (havraa.deductions || []).find((d) => d.year === year) || null;
}

function lastPublishedYear(havraa) {
	return Number(havraa.private_rates[havraa.private_rates.length - 1].from.slice(0, 4));
}

/**
 * The half-day deduction applies per law year: input.lowPay is either one flag for the year in question, or
 * { 2024: bool, 2025: bool } because each law has its own salary period and threshold.
 */
export function lowPayFor(lowPay, year) {
	if (lowPay && typeof lowPay === 'object') { return Boolean(lowPay[year] || lowPay[String(year)]); }
	return Boolean(lowPay);
}

/** Months of unpaid leave (חל"ת) that fall inside [from, to], from a list of { from, to } periods. */
export function leaveMonthsIn(leaves, from, to) {
	let months = 0;
	for (const l of leaves || []) {
		const a = l.from > from ? l.from : from;
		const b = l.to < to ? l.to : to;
		if (a <= b) { months += monthsWorked(a, b); }
	}
	return months;
}

/** One work year (or part of it): days, price, deduction, amount. */
function valueYear(havraa, k, from, to, fullTo, jobPct, opts) {
	const table = havraa.days;
	const full = daysFor(table, k);
	const fraction = to >= fullTo ? 1 : round4(Math.min(12, monthsWorked(from, to)) / 12);
	// Unpaid leave is not counted (the order's s.6): the year's share drops by its months, as in the Ministry's example.
	const leaveRaw = opts.leaves ? leaveMonthsIn(opts.leaves, from, to) : (k === opts.leaveYear ? opts.leaveMonths || 0 : 0);
	const leave = round4(Math.min(fraction * 12, Math.max(0, leaveRaw)));
	const share = round4((fraction * 12 - leave) / 12);
	const daysDue = round4(full * (jobPct / 100) * share);
	// The 1 July inside the work year sets the price (payment months June-September, s.5(ד)).
	const y0 = Number(from.slice(0, 4));
	let july = `${y0}-07-01`;
	if (july < from) { july = `${y0 + 1}-07-01`; }
	const valueOn = july <= to ? july : to;
	const year = Number(valueOn.slice(0, 4));
	const price = priceOn(havraa.private_rates, valueOn);
	const gross = price ? round2(daysDue * price.rate) : null;
	let deduction = 0;
	let ded = null;
	if (opts.applyDeduction !== false) {
		ded = deductionFor(havraa, year);
		if (ded && price) {
			const half = lowPayFor(opts.lowPay, year) && (!ded.half_requires_five_days || full === 5);
			deduction = round2(price.rate * (jobPct / 100) * share * (half ? 0.5 : 1) * ded.days);
		}
	}
	return {
		k, from, to, fullTo, full, fraction, leave, share, daysDue, valueOn, year, price: price ? price.rate : null,
		priceFrom: price ? price.from : null, gross, deduction, deductionYear: deduction ? year : null,
		half: Boolean(ded && deduction && lowPayFor(opts.lowPay, year) && (!ded.half_requires_five_days || full === 5)),
		net: gross === null ? null : round2(gross - deduction),
	};
}

/**
 * input (mode "year"):   { mode: 'year', sector, years, jobPct, havraaYear, leaveMonths, lowPay, applyDeduction }
 * input (mode "period"): { mode: 'period', sector, start, end, asOf, jobPct, paid, leaves: [{ from, to }], lowPay,
 *                          applyDeduction, valuation }
 *   lowPay: true/false, or { 2024: bool, 2025: bool } (each deduction law has its own low-pay test).
 *   valuation: 'july' (default) or 'latest' (every year at the latest published price: the what-if).
 */
export function compute(registry, input) {
	const hv = registry.havraa;
	const errors = [];
	const flags = [];
	const jobPct = input.jobPct === undefined || input.jobPct === '' ? 100 : Number(input.jobPct);
	if (input.sector === 'public') {
		return { ok: false, outOfScope: true, sector: 'public', errors: [{ field: 'sector', he: 'בשירות הציבורי דמי ההבראה נקבעים בהסכמים של המגזר הציבורי (ערך יום, מספר ימים ומועד תשלום שונים), ולא בצו ההרחבה שהכלי מחשב.' }] };
	}
	if (!(jobPct > 0 && jobPct <= 100)) { errors.push({ field: 'jobPct', he: 'אחוז המשרה צריך להיות בין 1 ל-100' }); }
	const last = lastPublishedYear(hv);

	if (input.mode !== 'period') {
		const years = Number(input.years);
		const year = Number(input.havraaYear) || last;
		const leaveMonths = Number(input.leaveMonths) || 0;
		if (!(Number.isInteger(years) && years >= 0 && years <= 60)) { errors.push({ field: 'years', he: 'מספר השנים המלאות צריך להיות מספר שלם בין 0 ל-60' }); }
		if (!(leaveMonths >= 0 && leaveMonths <= 12)) { errors.push({ field: 'leave', he: 'חודשי חופשה ללא תשלום: בין 0 ל-12' }); }
		if (errors.length) { return { ok: false, errors }; }
		const first = Number(hv.private_rates[0].from.slice(0, 4));
		if (year < first || year > last) {
			return { ok: false, outOfScope: true, errors: [{ field: 'year', he: year > last ? `מחיר יום ההבראה לשנת ${year} עוד לא פורסם. הכלי מחשב עד שנת ${last}.` : `הכלי מחשב משנת ${first}.` }] };
		}
		const k = years + 1;
		if (years < 1) {
			const price = priceOn(hv.private_rates, `${year}-07-01`);
			return {
				ok: true, mode: 'year', state: 'not_yet', k, year, jobPct, full: daysFor(hv.days, 1), price: price.rate, priceFrom: price.from,
				daysDue: 0, gross: 0, deduction: 0, net: 0, flags,
			};
		}
		const from = `${year}-01-01`;
		const r = valueYear(hv, k, from, `${year}-12-31`, `${year}-12-31`, jobPct, { leaveYear: k, leaveMonths, lowPay: input.lowPay, applyDeduction: input.applyDeduction });
		return Object.assign({ ok: true, mode: 'year', state: 'due', year, jobPct, flags }, r, { k });
	}

	const start = parseDate(input.start);
	const asOf = parseDate(input.asOf) || registry.checked_on;
	const end = input.end ? parseDate(input.end) : asOf;
	const paid = input.paid === undefined || input.paid === '' ? 0 : Number(input.paid);
	if (!start) { errors.push({ field: 'start', he: 'תאריך תחילת העבודה לא תקין. לדוגמה: 1.3.2021' }); }
	if (input.end && !end) { errors.push({ field: 'end', he: 'תאריך סיום העבודה לא תקין. לדוגמה: 31.8.2026' }); }
	if (start && end && end <= start) { errors.push({ field: 'end', he: 'תאריך הסיום צריך להיות אחרי תאריך ההתחלה' }); }
	if (end && end > asOf) { errors.push({ field: 'end', he: `תאריך הסיום לא יכול להיות אחרי היום (${asOf.split('-').reverse().map(Number).join('.')})` }); }
	if (!(paid >= 0)) { errors.push({ field: 'paid', he: 'הסכום ששולם צריך להיות 0 או יותר' }); }
	// Unpaid-leave periods: both dates or neither, inside the employment, in order. A half-filled row is an error.
	const leaves = [];
	(input.leaves || []).forEach((l, i) => {
		const rawFrom = String(l.from || '').trim();
		const rawTo = String(l.to || '').trim();
		if (!rawFrom && !rawTo) { return; }
		const a = parseDate(rawFrom);
		const b = parseDate(rawTo);
		if (!a || !b || b < a || (start && a < start) || (end && b > end)) {
			errors.push({ field: 'leaves', row: i, he: `תקופת חופשה ללא תשלום ${i + 1}: צריך תאריך התחלה וסיום תקינים, בתוך תקופת העבודה` });
			return;
		}
		leaves.push({ from: a, to: b, row: i });
	});
	// Overlapping periods would count the same months twice: refuse them instead of guessing which one is right.
	const sorted = [...leaves].sort((x, y) => (x.from < y.from ? -1 : x.from > y.from ? 1 : 0));
	for (let i = 1; i < sorted.length; i++) {
		if (sorted[i].from <= sorted[i - 1].to) {
			errors.push({ field: 'leaves', row: sorted[i].row, he: `תקופות החופשה ללא תשלום ${sorted[i - 1].row + 1} ו-${sorted[i].row + 1} חופפות. אחדו אותן לתקופה אחת.` });
			break;
		}
	}
	if (errors.length) { return { ok: false, errors }; }
	if (start < hv.private_rates[0].from) {
		flags.push({ code: 'before_table', he: `העבודה התחילה לפני ${Number(hv.private_rates[0].from.slice(0, 4))}. שנים מוקדמות יותר ממילא מחוץ לתקופת ההתיישנות של 7 שנים, והכלי לא מחשב אותן.` });
	}
	const lastJuly = `${last}-07-01`;
	// Work years: [start + (k-1) years, start + k years - 1 day], the last one cut at the end date.
	const rows = [];
	let k = 1;
	let from = start;
	while (from <= end && k <= 80) {
		const fullTo = addDays(addYears(start, k), -1);
		const to = fullTo < end ? fullTo : end;
		rows.push({ k, from, to, fullTo });
		k += 1;
		from = addYears(start, k - 1);
	}
	const firstYearDone = daysBetween(start, addDays(end, 1)) >= daysBetween(start, addYears(start, 1));
	if (!firstYearDone) {
		return { ok: true, mode: 'period', state: 'not_eligible', start, end, asOf, jobPct, rows: [], flags, daysDue: 0, gross: 0, deduction: 0, net: 0, paid, gap: 0 };
	}
	const limitFrom = addYears(asOf, -hv.limitation_years);
	const valued = [];
	for (const row of rows) {
		const v = valueYear(hv, row.k, row.from, row.to, row.fullTo, jobPct, { leaves, lowPay: input.lowPay, applyDeduction: input.applyDeduction });
		if (v.valueOn > lastJuly && v.valueOn.slice(0, 4) > String(last)) {
			return { ok: false, outOfScope: true, errors: [{ field: 'end', he: `מחיר יום ההבראה לשנת ${v.valueOn.slice(0, 4)} עוד לא פורסם. הכלי מחשב עד שנת ${last}.` }] };
		}
		v.barred = v.to < limitFrom;
		if (input.valuation === 'latest' && !v.barred) {
			const latest = hv.private_rates[hv.private_rates.length - 1];
			v.price = latest.rate; v.priceFrom = latest.from; v.gross = round2(v.daysDue * latest.rate);
			v.deduction = 0; v.deductionYear = null; v.half = false; v.net = v.gross;
		}
		valued.push(v);
	}
	const live = valued.filter((v) => !v.barred);
	if (valued.some((v) => v.barred)) {
		flags.push({ code: 'limitation', he: `שנות עבודה שהסתיימו לפני ${limitFrom.split('-').reverse().map(Number).join('.')} עברו את 7 שנות ההתיישנות (חוק ההתיישנות, סעיפים 5(1) ו-6), ולכן לא נכללו בסכום.` });
	}
	if (live.some((v) => v.deduction > 0)) {
		flags.push({ code: 'deduction', he: 'ב-2024 וב-2025 החוק חייב את המעסיק לנכות יום הבראה אחד מדמי ההבראה ששולמו באותה שנה ולהעביר אותו למדינה. החלק שנוכה לא משולם לעובד גם אחר כך (סעיף 8 בכל אחד מהחוקים).' });
	}
	const sum = (key) => round2(live.reduce((a, v) => a + (v[key] || 0), 0));
	const daysDue = round4(live.reduce((a, v) => a + v.daysDue, 0));
	const leaveMonths = round4(live.reduce((a, v) => a + v.leave, 0));
	const gross = sum('gross');
	const deduction = sum('deduction');
	const net = round2(gross - deduction);
	const gap = round2(Math.max(0, net - paid));
	return {
		ok: true, mode: 'period', state: gap > 0 ? 'owed' : 'paid', start, end, asOf, stillWorking: !input.end, jobPct, limitFrom,
		rows: valued, flags, daysDue, gross, deduction, net, paid, gap, overpaid: round2(Math.max(0, paid - net)), leaveMonths,
		years: live.length, valuation: input.valuation === 'latest' ? 'latest' : 'july',
	};
}
