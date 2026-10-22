/**
 * The labor wave (22.10.2026): annual leave (chufsha-shnatit) on /annual-leave-calculator/, and the redemption the
 * final-settlement instrument (gmar-cheshbon) imports.
 *
 * Dependency-free ES module; every top-level name starts with "ch" (or CH_) so it can share one bundle scope with
 * dates.js, pitzuyim-engine.js, havraa-engine.js and the rest. Every number comes from registry.labor_chufsha:
 *  - The work year is the calendar year (Annual Leave Law s.1); the seniority of a year is the count of calendar years in
 *    which the employment existed, the first (even partial) year being 1 (the Ministry of Labor guide, chapter 2).
 *  - Days by seniority: the law's table from 1.1.2017 (s.3(א)), in gross days and in the work days of a 6-day or a 5-day
 *    week, as the Ministry prints it; the extension order on the shortened work week gives net work days, and the better
 *    of the two applies; a manpower contractor's workers have their own order (2.8.2004).
 *  - A year in which the employment lasted all twelve months: full days from 200 days actually worked, below that the
 *    proportional part by 200 (s.3(ב)); a year of part of the twelve months: by 240 (s.3(ג)); a part of a day is dropped.
 *  - A wage worker (hourly/daily) with fewer than 75 consecutive days gets no days but 4% of the wage (ss.4, 15(א)).
 *  - Redemption (s.13): the leave due and not taken, at the value of the leave pay (s.10) on the day work stopped. The
 *    value of a day: a month's pay divided by the Minimum Wage Law s.1 ratio (25 for a 6-day week, 21⅔ for a 5-day
 *    week), proportional for fewer days a week, or the reader's own payslip day value.
 *  - Dates: the leave is given in the last month of the work year or during the next one (s.6(א)); a redemption is wage
 *    (s.17), due with the month's wage (Wage Protection Law s.9) and delayed from the ninth day after (s.1); claims under
 *    the law expire after three years (s.31).
 * What the law does not state is not computed: how many past years a court redeems (the result shows the end year and the
 * three before it, and the older years apart), and the courts' conversion of the quarter's calendar-day average (s.10(ב)(2)).
 */

const CH_DAY = 86400000;
const chMs = (iso) => Date.parse(`${iso}T00:00:00Z`);
const chIso = (t) => new Date(t).toISOString().slice(0, 10);
const chBlank = (v) => v === '' || v === undefined || v === null;
const chR2 = (n) => Math.round(n * 100) / 100;
export function chAddDays(iso, n) { return chIso(chMs(iso) + n * CH_DAY); }
export function chMonthEnd(iso) {
	const [y, m] = iso.split('-').map(Number);
	return chIso(Date.UTC(y, m, 0));
}
export function chAddYears(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const last = new Date(Date.UTC(y + n, m, 0)).getUTCDate();
	return `${String(y + n).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}

/** 13.10.2026, 2026-10-13, 13/10/26 -> 2026-10-13; anything else -> null. */
export function chParseDate(text) {
	const raw = String(text ?? '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	let y; let mo; let d;
	if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; } else {
		m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
		if (!m) { return null; }
		d = +m[1]; mo = +m[2]; y = +m[3];
		if (y < 100) { y += 2000; }
	}
	const t = Date.UTC(y, mo - 1, d);
	const back = new Date(t);
	if (y < 1900 || back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) { return null; }
	return chIso(t);
}

/** Scheduled work days from one day to another, both included: the first perWeek days of the week from Sunday. */
export function chWorkdays(from, to, perWeek) {
	let n = 0;
	for (let t = chMs(from), e = chMs(to); t <= e; t += CH_DAY) {
		if (new Date(t).getUTCDay() < perWeek) { n += 1; }
	}
	return n;
}

const chRowOf = (rows, n) => rows.find((r) => n >= r.from && (r.to === null || n <= r.to)) || rows[rows.length - 1];

/**
 * The days of one seniority year: the law's gross and net days, the order's net days, and which applies.
 * regime: 'order' (the extension order on the shortened week applies: the better of law and order), 'law' (the law
 * only: e.g. a workplace of fewer than four employees), 'manpower' (a manpower contractor's worker: the better of law and
 * the 2004 order).
 */
export function chSeniority(lc, n, week, regime) {
	const col = week === 6 ? 'net6' : 'net5';
	const law = chRowOf(lc.law_table.rows, n);
	const lawNet = law[col];
	let orderNet = null;
	if (regime === 'order') { orderNet = chRowOf(lc.order_table.rows, n)[col]; }
	if (regime === 'manpower') { orderNet = chRowOf(lc.manpower_table.rows, n)[col]; }
	const useOrder = orderNet !== null && orderNet > lawNet;
	return { n, gross: law.gross, lawNet, orderNet, net: useOrder ? orderNet : lawNet, src: useOrder ? regime : 'law', section: lc.law_table.section };
}

/** The work-day divisor of a month: Minimum Wage Law s.1 (25 or 21⅔), in proportion for fewer days a week. */
export function chDivisor(lc, week, perWeek) {
	const base = week === 6 ? lc.day_ratio.w6 : lc.day_ratio.w5_num / lc.day_ratio.w5_den;
	return (base * perWeek) / week;
}

export const CH_DEFAULT = {
	start: '2021-09-01', end: '2026-10-31', asOf: '', week: 5, perWeek: '', regime: 'order', payType: 'monthly',
	salary: 12000, hourly: '', hours: '', dayValue: '', mode: 'compute', balance: '', used: 20, workedEnd: '', scope: 'window',
};

/**
 * input = { start, end ('' = still working: counted to asOf), asOf (today, ISO), week (5|6: the workplace's week, the
 *           column of the table), perWeek (1..week: the reader's own work days a week; '' = week), regime
 *           ('order'|'law'|'manpower'), payType ('monthly'|'hourly'), salary (monthly), hourly + hours (hourly: the rate
 *           and the average monthly hours of the fullest recent quarter), dayValue (optional: one leave day's value
 *           from the payslip), mode ('compute': the law's days minus the days used | 'balance': the payslip balance),
 *           used (compute: days taken in the counted years), balance (balance mode: days), workedEnd (optional: days
 *           actually worked in the last year), scope ('window': the last year and the three before it | 'all') }
 */
export function chCompute(registry, input) {
	const lc = registry.labor_chufsha;
	const lw = lc.law;
	const errors = [];
	const i = Object.assign({}, CH_DEFAULT, input || {});
	const asOf = chParseDate(i.asOf) || null;
	const start = chParseDate(i.start);
	const endGiven = !chBlank(i.end);
	const endIn = endGiven ? chParseDate(i.end) : null;
	if (!start) { errors.push({ field: 'start', he: 'יום תחילת העבודה: תאריך מלא, לדוגמה 1.9.2021' }); }
	if (endGiven && !endIn) { errors.push({ field: 'end', he: 'יום העבודה האחרון: תאריך מלא, או ריק אם עדיין עובדים' }); }
	if (!endGiven && !asOf) { errors.push({ field: 'end', he: 'יום העבודה האחרון: תאריך מלא' }); }
	const end = endIn || (!endGiven ? asOf : null);
	if (start && end && end < start) { errors.push({ field: 'end', he: endGiven ? 'יום העבודה האחרון לפני יום התחילה' : 'יום התחילה עוד לא הגיע' }); }
	if (end && end < lc.law_table.from) { errors.push({ field: 'end', he: `המחשבון מחשב לפי הטבלה שבתוקף מ-1.1.2017; שנת עבודה שהסתיימה לפני כן נספרת לפי הנוסח הקודם של סעיף 3` }); }
	const week = Number(i.week) === 6 ? 6 : 5;
	const perWeek = chBlank(i.perWeek) ? week : Number(i.perWeek);
	if (!(Number.isInteger(perWeek) && perWeek >= 1 && perWeek <= week)) { errors.push({ field: 'perWeek', he: `ימי עבודה בשבוע: 1 עד ${week}` }); }
	const regime = ['law', 'manpower'].includes(i.regime) ? i.regime : 'order';
	const payType = i.payType === 'hourly' ? 'hourly' : 'monthly';
	let monthPay = NaN;
	if (payType === 'hourly') {
		const rate = Number(i.hourly);
		const hours = Number(i.hours);
		if (!(rate > 0 && rate < 10000)) { errors.push({ field: 'hourly', he: 'שכר לשעה: מספר חיובי' }); }
		if (!(hours > 0 && hours <= 400)) { errors.push({ field: 'hours', he: 'ממוצע שעות בחודש: 1 עד 400' }); }
		monthPay = chR2(rate * hours);
	} else {
		monthPay = Number(i.salary);
		if (!(monthPay > 0 && monthPay < 1e7)) { errors.push({ field: 'salary', he: 'השכר החודשי: מספר חיובי' }); }
	}
	const ownDay = chBlank(i.dayValue) ? null : Number(i.dayValue);
	if (ownDay !== null && !(ownDay > 0 && ownDay < 1e6)) { errors.push({ field: 'dayValue', he: 'ערך יום חופשה מהתלוש: מספר חיובי, או ריק' }); }
	const mode = i.mode === 'balance' ? 'balance' : 'compute';
	const balance = chBlank(i.balance) ? NaN : Number(i.balance);
	if (mode === 'balance' && !(Number.isFinite(balance) && balance >= 0 && balance <= 1000)) { errors.push({ field: 'balance', he: 'יתרת ימי החופשה בתלוש: מספר בין 0 ל-1,000' }); }
	const used = chBlank(i.used) ? 0 : Number(i.used);
	if (mode === 'compute' && !(Number.isFinite(used) && used >= 0 && used <= 1000)) { errors.push({ field: 'used', he: 'ימים שכבר ניצלתם: מספר בין 0 ל-1,000, או ריק' }); }
	const workedEnd = chBlank(i.workedEnd) ? null : Number(i.workedEnd);
	if (workedEnd !== null && !(Number.isInteger(workedEnd) && workedEnd >= 0 && workedEnd <= 366)) { errors.push({ field: 'workedEnd', he: 'ימי עבודה בפועל בשנה האחרונה: מספר שלם בין 0 ל-366, או ריק' }); }
	const scope = i.scope === 'all' ? 'all' : 'window';
	if (errors.length) { return { ok: false, errors }; }

	const ended = endGiven;
	const p = { start, end, asOf, ended, week, perWeek, regime, payType, monthPay, ownDay, mode, balance, used, workedEnd, scope, hourly: Number(i.hourly) || null, hours: Number(i.hours) || null, salary: payType === 'monthly' ? monthPay : null };
	const flags = [];
	const sy = Number(start.slice(0, 4));
	const ey = Number(end.slice(0, 4));
	const spanDays = Math.round((chMs(end) - chMs(start)) / CH_DAY) + 1;
	// ss.4 and 15(א): a wage worker with fewer than 75 consecutive days gets 4% of the wage, not days.
	if (payType === 'hourly' && spanDays < lw.temp_days) {
		return {
			ok: true, mode: 'temp', p, years: [], row: chSeniority(lc, 1, week, regime), days: 0, dayValue: 0, value: 0,
			tempPct: lw.temp_pct, spanDays, accrued: 0, older: 0, window: { from: ey, to: ey }, divisor: chDivisor(lc, week, perWeek),
			dates: chDates(lc, p), events: chEvents(lc, p), flags: [{ code: 'temp', he: `${lw.temp_he} (${lw.sections.temp}, ${lw.sections.temp_pay}). תקופה של ${spanDays} ימים: ההיקף הוא ${lw.temp_pct}% מסך השכר של התקופה.` }],
		};
	}
	const winFrom = scope === 'all' ? sy : Math.max(sy, ey - 3);
	const years = [];
	for (let y = sy; y <= ey; y += 1) {
		const from = y === sy ? start : `${y}-01-01`;
		const to = y === ey ? end : `${y}-12-31`;
		const n = y - sy + 1;
		const fullRel = from === `${y}-01-01` && to === `${y}-12-31`;
		const threshold = fullRel ? lw.full_year_days : lw.part_year_days;
		const scheduled = chWorkdays(from, to, perWeek);
		const isLast = y === ey;
		const worked = isLast && workedEnd !== null ? workedEnd : scheduled;
		const s = chSeniority(lc, n, week, regime);
		const pre = y < Number(lc.law_table.from.slice(0, 4));
		// s.3(ב)-(ג): full days from the threshold; below it the proportional part, a part of a day dropped.
		const net = pre ? null : (worked >= threshold ? s.net : Math.floor((worked * s.net) / threshold));
		const gross = pre ? null : (worked >= threshold ? s.gross : Math.floor((worked * s.gross) / threshold));
		years.push({ year: y, n, from, to, fullRel, threshold, scheduled, worked, overridden: isLast && workedEnd !== null, full: s.net, fullGross: s.gross, lawNet: s.lawNet, orderNet: s.orderNet, src: s.src, net, gross, pre, inWindow: y >= winFrom, last: isLast });
	}
	const counted = years.filter((y) => y.inWindow && !y.pre);
	const accrued = counted.reduce((a, y) => a + y.net, 0);
	const older = years.filter((y) => !y.inWindow && !y.pre).reduce((a, y) => a + y.net, 0);
	const last = years[years.length - 1];
	const divisor = chDivisor(lc, week, perWeek);
	const dayValue = ownDay !== null ? ownDay : chR2(monthPay / divisor);
	let days;
	if (mode === 'balance') {
		days = balance;
	} else {
		days = Math.max(0, chR2(accrued - used));
		if (used > accrued) { flags.push({ code: 'used', he: `הוזנו ${used} ימים שנוצלו, יותר מ-${accrued} הימים שנצברו בשנים שנספרו: אין יתרה לפדיון לפי החישוב. אם קיבלתם ימים מעבר לחוק, הם לא נגרעים מהזכות לפי החוק.` }); }
	}
	const value = chR2(days * dayValue);
	const row = chSeniority(lc, last.n, week, regime);
	let nextRow = null;
	for (let k = last.n + 1; k <= last.n + 15; k += 1) {
		const s = chSeniority(lc, k, week, regime);
		if (s.net > row.net) { nextRow = Object.assign({ year: sy + k - 1 }, s); break; }
	}
	if (regime === 'order' && years.some((y) => y.src === 'order')) { flags.push({ code: 'order', he: `${lc.order_table.better_he}. הצו לא חל על: ${lc.order_table.excluded_he.join('; ')}. אם אחד מאלה נכון לגביכם, בחרו "רק החוק".` }); }
	if (years.some((y) => y.pre && y.inWindow)) { flags.push({ code: 'pre2017', he: `שנות העבודה לפני 2017 נספרות בוותק, אבל הימים שלהן לא מחושבים כאן: עד 30.6.2016 החוק נתן 14 ימים בכל אחת מ-4 השנים הראשונות (${lc.history.amendment.gazette_he}).` }); }
	if (mode === 'compute' && older > 0) { flags.push({ code: 'older', he: `מהשנים שלפני ${winFrom} נצברו לפי החישוב עוד ${older} ימים שלא נספרו בסכום. אין לצבור חופשה, ובהסכמה אפשר להעביר יתרה לשתי השנים הבאות בלבד (${lw.sections.carry}); תביעה לפי החוק מתיישנת אחרי ${lw.limitation_years} שנים (${lw.sections.limitation}). על מה שנשאר משנים קודמות מכריע בית הדין לעבודה (${lw.sections.dispute}).` }); }
	if (!last.overridden && last.worked < last.threshold && last.scheduled > 0) { flags.push({ code: 'worked', he: `בשנה האחרונה נספרו ${last.worked} ימי עבודה לפי לוח השבוע שלכם (כולל ימי חג), פחות מ-${last.threshold}: הימים יחסיים. אם עבדתם בפועל מספר אחר, הקלידו אותו בשדה "ימי עבודה בפועל בשנה האחרונה".` }); }
	if (perWeek < week) { flags.push({ code: 'perweek', he: `עבודה ${perWeek} ימים בשבוע במקום עבודה של ${week} ימים: ערך יום חושב בחלוקה ל-${chR2(divisor)} ימים בחודש, באותו יחס. אם בתלוש רשום ערך יום אחר, הקלידו אותו.` }); }
	if (payType === 'hourly' && ownDay === null) { flags.push({ code: 'quarter', he: `לעובד לפי שעה או יום החוק מחשב את דמי החופשה לפי השכר של רבע השנה שלפני החופשה (או רבע השנה המלא ביותר ב-12 החודשים, לבחירתכם) חלקי 90 (${lw.sections.pay_wage}). הקלידו את ממוצע השעות בחודש של אותו רבע שנה.` }); }
	const res = {
		ok: true, mode, p, years, row, nextRow, accrued, older, used: mode === 'compute' ? used : null, days, dayValue,
		dayMethod: ownDay !== null ? 'own' : 'ratio', divisor, value, window: { from: winFrom, to: ey }, flags,
	};
	res.dates = chDates(lc, p);
	res.events = chEvents(lc, p);
	return res;
}

/** The dates the law sets for this result. */
export function chDates(lc, p) {
	const y = Number(p.end.slice(0, 4));
	const out = { yearEnd: `${y}-12-31`, takeBy: `${y + 1}-12-31` };
	if (p.ended) {
		out.due = chMonthEnd(p.end);
		out.lateFrom = chAddDays(out.due, lc.wage.late_day);
		out.limitation = chAddYears(p.end, lc.law.limitation_years);
	}
	return out;
}

export function chEvents(lc, p) {
	const d = chDates(lc, p);
	const lw = lc.law;
	if (p.ended) {
		return [
			{ date: d.due, kind: 'due', what: 'פדיון החופשה משולם עם השכר של חודש הסיום', rule: `${lw.sections.redeem} ו-${lw.sections.as_wage} לחוק חופשה שנתית; ${lc.wage.due_section} לחוק הגנת השכר` },
			{ date: d.lateFrom, kind: 'late', what: 'מהיום הזה פדיון שלא שולם הוא שכר מולן', rule: `${lc.wage.late_section} לחוק הגנת השכר` },
			{ date: d.limitation, kind: 'limit', what: 'שלוש שנים מסיום העבודה: תביעה לפי חוק חופשה שנתית מתיישנת', rule: `${lw.sections.limitation} לחוק חופשה שנתית` },
		];
	}
	return [
		{ date: d.yearEnd, kind: 'yearEnd', what: `סוף שנת העבודה ${d.yearEnd.slice(0, 4)}: מכאן החופשה של השנה ניתנת בדצמבר או במהלך השנה הבאה`, rule: `${lw.sections.work_year} ו-${lw.sections.when} לחוק חופשה שנתית` },
		{ date: d.takeBy, kind: 'takeBy', what: `היום האחרון לקחת את החופשה של ${d.yearEnd.slice(0, 4)}, אלא אם הוסכם להעביר יתרה`, rule: `${lw.sections.when} ו-${lw.sections.carry} לחוק חופשה שנתית` },
	];
}

/** A band for analytics (never the amount): the days owed. */
export function chBand(r) {
	if (!r.ok) { return 'error'; }
	if (r.mode === 'temp') { return 'temp'; }
	return r.days <= 0 ? '0' : r.days <= 10 ? '1-10' : r.days <= 30 ? '11-30' : '31+';
}

/**
 * The redemption for the final-settlement instrument (gmar-cheshbon): the vacation days owed at the end of employment and
 * their value. Same input as chCompute; the end date is required (a planned last day may be in the future).
 * Returns { ok:false, errors[] } or
 * { ok:true, mode ('compute'|'balance'|'temp'), days, dayValue, value, divisor, dayMethod ('ratio'|'own'), accrued, used,
 *   older, window:{from,to}, perYear:[{year, n, net, worked, threshold, inWindow}], tempPct (temp mode only),
 *   due, lateFrom, limitation (ISO), sections:{redeem, pay, as_wage, limitation, due, late}, flags:[{code, he}] }.
 */
export function chRedemption(registry, input) {
	const lc = registry.labor_chufsha;
	if (!input || chBlank(input.end)) { return { ok: false, errors: [{ field: 'end', he: 'לחישוב פדיון צריך את יום העבודה האחרון' }] }; }
	const r = chCompute(registry, input);
	if (!r.ok) { return r; }
	return {
		ok: true, mode: r.mode, days: r.days, dayValue: r.dayValue, value: r.value, divisor: r.divisor, dayMethod: r.dayMethod || 'ratio',
		accrued: r.accrued, used: r.used, older: r.older, window: r.window, tempPct: r.tempPct || null,
		perYear: r.years.map((y) => ({ year: y.year, n: y.n, net: y.net, worked: y.worked, threshold: y.threshold, inWindow: y.inWindow })),
		due: r.dates.due, lateFrom: r.dates.lateFrom, limitation: r.dates.limitation,
		sections: { redeem: lc.law.sections.redeem, pay: lc.law.sections.pay, as_wage: lc.law.sections.as_wage, limitation: lc.law.sections.limitation, due: lc.wage.due_section, late: lc.wage.late_section },
		flags: r.flags,
	};
}
