/**
 * T02 engine: is the pay at least the minimum wage, month by month? (HAD-485)
 *
 * Dependency-free ES module. Every amount comes from registry.min_wage (National Insurance
 * Institute table, verified on the registry's checked_on date).
 *
 * Law: חוק שכר מינימום, התשמ"ז-1987
 *  - s.1: monthly minimum; hourly minimum = 1/186 of the monthly (BTL also publishes the
 *    hourly rate for 182 monthly hours).
 *  - s.2(א): a worker aged 18+ in a full-time job is owed at least the minimum; s.2(ב): a
 *    part-time worker is owed the proportional part.
 *  - s.3: the pay that counts is the regular day's pay (base pay, cost-of-living, fixed
 *    additions); family, seniority and shift additions, premiums, 13th salary, annual grants and
 *    expense refunds do not count.
 * Youth: תקנות שכר מינימום (נוער עובד וחניכים), התשמ"ח-1987, regs 4-6: under 16 70%, 16 75%,
 * 17 83%, apprentice 60%; hourly = monthly / 173; full time = 40 hours a week.
 */

const AGE_KEYS = { under16: 'under16', age16: 'age16', age17: 'age17', apprentice: 'apprentice' };

export function monthList(from, to) {
	const out = [];
	const [fy, fm] = from.split('-').map(Number);
	const [ty, tm] = to.split('-').map(Number);
	let y = fy; let m = fm;
	while (y < ty || (y === ty && m <= tm)) {
		out.push(`${y}-${String(m).padStart(2, '0')}`);
		m += 1; if (m > 12) { m = 1; y += 1; }
		if (out.length > 240) { break; }
	}
	return out;
}

function round2(x) { return Math.round((x + Number.EPSILON) * 100) / 100; }

export function parseMonth(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})$/);
	if (m) { return +m[2] >= 1 && +m[2] <= 12 ? `${m[1]}-${m[2].padStart(2, '0')}` : null; }
	m = raw.match(/^(\d{1,2})[./](\d{4})$/);
	if (m) { return +m[1] >= 1 && +m[1] <= 12 ? `${m[2]}-${m[1].padStart(2, '0')}` : null; }
	return null;
}

/** The row of the BTL table in force in a month (rates change on the first of a month). */
export function rowFor(minWage, monthKey) {
	let row = null;
	for (const r of minWage.rows) { if (r.from.slice(0, 7) <= monthKey) { row = r; } }
	return row;
}

/** The minimum for one month, for the chosen age group and pay type. */
export function minimumFor(minWage, monthKey, opts) {
	const row = rowFor(minWage, monthKey);
	if (!row) { return null; }
	const age = AGE_KEYS[opts.age] || 'adult';
	if (age === 'adult') {
		let divisor = opts.divisor === 186 ? 186 : 182;
		let hourly = divisor === 182 ? row.hourly_182 : row.hourly_186;
		if (hourly === null || hourly === undefined) { divisor = 186; hourly = row.hourly_186; }
		return { from: row.from, monthly: row.monthly, hourly, divisor, pct: 100, age };
	}
	const pct = minWage.youth_pct[age];
	const monthly = round2(row.monthly * pct / 100);
	const hourly = round2(monthly / minWage.youth_hours_divisor);
	return { from: row.from, monthly, hourly, divisor: minWage.youth_hours_divisor, pct, age, adultMonthly: row.monthly };
}

/**
 * input = { age, payType: 'monthly'|'hourly', from: 'YYYY-MM', to: 'YYYY-MM',
 *           pay (monthly gross that counts, or hourly rate), jobPct (monthly), hours (hourly),
 *           divisor: 182|186, overrides: { 'YYYY-MM': pay } }
 */
export function compute(registry, input) {
	const mw = registry.min_wage;
	const errors = [];
	const flags = [];
	const from = parseMonth(input.from);
	const to = parseMonth(input.to);
	const payType = input.payType === 'hourly' ? 'hourly' : 'monthly';
	const pay = Number(input.pay);
	const jobPct = input.jobPct === undefined || input.jobPct === '' ? 100 : Number(input.jobPct);
	const hours = Number(input.hours);
	if (!from) { errors.push({ field: 'from', he: 'חודש ההתחלה לא תקין. לדוגמה: 1.2025' }); }
	if (!to) { errors.push({ field: 'to', he: 'חודש הסיום לא תקין. לדוגמה: 9.2026' }); }
	if (from && to && to < from) { errors.push({ field: 'to', he: 'חודש הסיום צריך להיות אחרי חודש ההתחלה' }); }
	if (!(pay > 0)) { errors.push({ field: 'pay', he: payType === 'hourly' ? 'השכר לשעה צריך להיות גדול מ-0' : 'השכר החודשי צריך להיות גדול מ-0' }); }
	if (payType === 'monthly' && !(jobPct > 0 && jobPct <= 100)) { errors.push({ field: 'jobPct', he: 'אחוז המשרה צריך להיות בין 1 ל-100' }); }
	if (payType === 'hourly' && !(hours > 0 && hours <= 400)) { errors.push({ field: 'hours', he: 'מספר השעות בחודש צריך להיות בין 1 ל-400' }); }
	if (errors.length) { return { ok: false, errors }; }
	const firstKey = mw.rows[0].from.slice(0, 7);
	if (from < firstKey) {
		return { ok: false, outOfScope: true, errors: [{ field: 'from', he: `הכלי בודק מ-${Number(firstKey.slice(5))}.${firstKey.slice(0, 4)} ואילך. לתקופה מוקדמת יותר: טבלת המוסד לביטוח לאומי.` }] };
	}
	const latest = mw.rows[mw.rows.length - 1].from.slice(0, 7);
	const [ly, lm] = latest.split('-').map(Number);
	const nextUpdate = `${ly + 1}-${String(lm).padStart(2, '0')}`;
	const months = monthList(from, to);
	if (months.length > 240) { return { ok: false, errors: [{ field: 'to', he: 'אפשר לבדוק עד 20 שנה בכל חישוב' }] }; }
	if (to >= nextUpdate) {
		flags.push({ code: 'rate_not_published', he: `שכר המינימום מ-1.${lm}.${ly + 1} עוד לא פורסם. לחודשים האלה הכלי משתמש בסכום האחרון שפורסם כרף תחתון בלבד: שכר המינימום לא יורד בעדכון (סעיף 5), ולכן הפער בפועל יכול להיות גדול יותר.` });
	}
	const rows = [];
	let gapTotal = 0;
	let dueTotal = 0;
	let paidTotal = 0;
	let monthsShort = 0;
	for (const key of months) {
		const min = minimumFor(mw, key, { age: input.age, divisor: Number(input.divisor) || 182 });
		const paidThis = input.overrides && input.overrides[key] !== undefined && input.overrides[key] !== '' ? Number(input.overrides[key]) : pay;
		let due;
		let paid;
		let rule;
		if (payType === 'monthly') {
			due = round2(min.monthly * jobPct / 100);
			paid = round2(paidThis);
			rule = jobPct === 100 ? 'monthly' : 'monthly_part';
		} else {
			due = round2(min.hourly * hours);
			paid = round2(paidThis * hours);
			rule = 'hourly';
		}
		const gap = round2(Math.max(0, due - paid));
		if (gap > 0) { monthsShort += 1; }
		gapTotal += gap; dueTotal += due; paidTotal += paid;
		rows.push({ month: key, rateFrom: min.from, monthlyMin: min.monthly, hourlyMin: min.hourly, divisor: min.divisor, due, paid, gap, rule });
	}
	const current = minimumFor(mw, to < nextUpdate ? to : latest, { age: input.age, divisor: Number(input.divisor) || 182 });
	const lastRow = rows[rows.length - 1];
	let state = 'ok';
	if (monthsShort > 0) { state = 'short'; }
	return {
		ok: true,
		state,
		age: AGE_KEYS[input.age] || 'adult',
		payType,
		gapTotal: round2(gapTotal),
		dueTotal: round2(dueTotal),
		paidTotal: round2(paidTotal),
		months: rows.length,
		monthsShort,
		lastGap: lastRow.gap,
		lastShortPct: lastRow.due > 0 ? Math.round((lastRow.gap / lastRow.due) * 1000) / 10 : 0,
		current,
		rows,
		flags,
		from, to,
	};
}
