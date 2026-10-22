/**
 * Wave 5 (HAD-504): severance pay, the advance notice, section 14 and the tax-exempt part, with the deadlines.
 *
 * Dependency-free ES module. Every number comes from registry.severance (and registry.min_wage for the floor), read on
 * their checked_on dates:
 *  - Entitlement: a year of work and a dismissal (Severance Pay Law s.1(א)), or a resignation the law treats as one
 *    (ss.6, 7, 8, 9, 11); a dismissal close to the end of the first year is presumed to dodge severance (s.3).
 *  - Amount: one month's salary for each year of work, and a proportional part for part of a year (s.12(א)); for a
 *    wage-paid employee also one month per year from 1.8.1983 (the 1983 regulations); never on less than the minimum
 *    wage for the job's share (s.13ב).
 *  - Section 14: pension payments replace severance only to the extent approved: the 1998 general approval makes
 *    14⅓% (6% + 8⅓%) replace 100% and 12% without the 2⅓% top-up replace 72% (s.14; the approval, items 1-3).
 *  - Notice: Advance Notice Law ss.3-4 by tenure and pay type; pay in lieu (s.6), compensation when none was given (s.7).
 *  - Tax: exempt up to one month's last salary per year of work, never above the ceiling per year (Income Tax Ordinance
 *    s.9(7א)(א); 13,750 in 2026); the Commissioner may exempt more up to that ceiling.
 *  - Deadlines: due on the last day of work, late after 15 days, +20% a month after 30 (Wage Protection Law s.20);
 *    the end-of-work certificate within 14 days (Advance Notice Law s.8(ב)); limitation 7 years.
 */

import { addDays, addMonths, parseDate, daysBetween, offRestDays } from './dates.js';

const r2 = (n) => Math.round(n * 100) / 100;
const blank = (v) => v === '' || v === undefined || v === null;
const heDay = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
export const RESIGN_CODES = ['health', 'parent', 'move', 'term', 'worse', 'retire'];

/** Full months and the remaining days from the first day of work to the last (inclusive), and the years as a decimal. */
export function serviceSpan(start, end) {
	const endEx = addDays(end, 1);
	const [sy, sm] = start.split('-').map(Number);
	const [ey, em] = endEx.split('-').map(Number);
	let months = (ey - sy) * 12 + (em - sm);
	while (months > 0 && addMonths(start, months) > endEx) { months -= 1; }
	const days = daysBetween(addMonths(start, months), endEx);
	return { months, days, years: months / 12 + days / 365, y: Math.floor(months / 12), m: months % 12 };
}

/** Advance Notice Law: s.3 (monthly salary) and s.4 (wage), by completed months of work. */
export function noticeDays(sv, payType, months) {
	const n = sv.notice;
	if (payType === 'hourly') {
		if (months < 12) { return { days: months, month: false, section: 'סעיף 4(1)' }; }
		if (months < 24) { return { days: n.wage.y2_base + Math.floor((months - 12) / 2), month: false, section: 'סעיף 4(2)' }; }
		if (months < 36) { return { days: n.wage.y3_base + Math.floor((months - 24) / 2), month: false, section: 'סעיף 4(3)' }; }
		return { days: null, month: true, section: 'סעיף 4(4)' };
	}
	if (months <= n.monthly.first_months) { return { days: months, month: false, section: 'סעיף 3(1)' }; }
	if (months < 12) { return { days: n.monthly.base_days + n.monthly.per_month * (months - n.monthly.first_months), month: false, section: 'סעיף 3(2)' }; }
	return { days: null, month: true, section: 'סעיף 3(3)' };
}

/**
 * The notice as the Ministry of Labor's published table reads ss.3-4 (gov.il guide, chapter "תקופת ההודעה המוקדמת"; the
 * labor wave, 22.10.2026): n = the month of work in which the notice is given (full months, plus one when days of a further
 * month have started). Monthly: n <= 6 -> n days (s.3(1)); 7..12 -> 6 + 2.5 for each month from the 7th (s.3(2)); 12 full
 * months or more -> a month (s.3(3)). Wage: n <= 12 -> n days (s.4(1)); 13..24 -> 14 + 1 for every two months after the
 * 13th (s.4(2)); 25..36 -> 21 + the same (s.4(3)); more than 36 months -> a month (s.4(4)). compute() uses this reading,
 * and the notice instrument (hodaa-engine.js) uses the same function, so the two pages never disagree.
 */
export function noticeByMonth(sv, payType, span) {
	const n = span.months + (span.days > 0 ? 1 : 0);
	const N = sv.notice;
	if (payType === 'hourly') {
		if (n <= 12) { return { days: n, month: false, section: 'סעיף 4(1)', n }; }
		if (n <= 24) { return { days: N.wage.y2_base + Math.floor((n - 13) / 2), month: false, section: 'סעיף 4(2)', n }; }
		if (n <= 36) { return { days: N.wage.y3_base + Math.floor((n - 25) / 2), month: false, section: 'סעיף 4(3)', n }; }
		return { days: null, month: true, section: 'סעיף 4(4)', n };
	}
	if (span.months >= 12) { return { days: null, month: true, section: 'סעיף 3(3)', n }; }
	if (n <= N.monthly.first_months) { return { days: n, month: false, section: 'סעיף 3(1)', n }; }
	return { days: N.monthly.base_days + N.monthly.per_month * (n - N.monthly.first_months), month: false, section: 'סעיף 3(2)', n };
}

/** One month after a day, by the Interpretation Law s.10(ב): the same day number, or the last day of a shorter month. */
export function monthLater(iso) {
	const [y, m, d] = iso.split('-').map(Number);
	const ny = m === 12 ? y + 1 : y;
	const nm = m === 12 ? 1 : m + 1;
	const last = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
	return `${ny}-${String(nm).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}

/** The minimum-wage row in force on a day (registry.min_wage). */
export function minWageOn(mw, day) {
	let row = null;
	for (const r of mw.rows) { if (r.from <= day) { row = r; } }
	return row;
}

/**
 * input = { payType ('monthly'|'hourly'), salary, hourly, hours, jobPct, start, end, reason ('fired'|'resign'|one of
 *           RESIGN_CODES), s14 ('none'|'full'|'partial'|'custom'), s14Pct, s14From, noticeDate, noticeMode
 *           ('worked'|'paid'|'none'), change (the job scope or the pay changed once), changeDate, prevPct and
 *           prevSalary (monthly: the scope before, the pay before a cut), prevHours and prevHourly (hourly: the hours
 *           before, the rate before a cut), manyChanges (more than one), unpaidExcess (days of unpaid leave above 14 in
 *           each work year, summed: reg. 10(3)) }
 */
export function compute(registry, input) {
	const sv = registry.severance;
	const mw = registry.min_wage;
	const errors = [];
	const payType = input.payType === 'hourly' ? 'hourly' : 'monthly';
	const start = parseDate(input.start);
	const end = parseDate(input.end);
	if (!start) { errors.push({ field: 'start', he: 'יום תחילת העבודה: תאריך מלא, לדוגמה 1.3.2018' }); }
	if (!end) { errors.push({ field: 'end', he: 'יום העבודה האחרון: תאריך מלא' }); }
	if (start && end && end < start) { errors.push({ field: 'end', he: 'יום העבודה האחרון לפני יום התחילה' }); }
	let monthly = NaN;
	let hourly = null;
	let hours = null;
	if (payType === 'hourly') {
		hourly = Number(input.hourly);
		hours = Number(input.hours);
		if (!(hourly > 0 && hourly < 10000)) { errors.push({ field: 'hourly', he: 'שכר לשעה: מספר חיובי' }); }
		if (!(hours > 0 && hours <= 400)) { errors.push({ field: 'hours', he: 'ממוצע שעות בחודש: 1 עד 400' }); }
		monthly = r2(hourly * hours);
	} else {
		monthly = Number(input.salary);
		if (!(monthly > 0 && monthly < 1e7)) { errors.push({ field: 'salary', he: 'השכר החודשי האחרון: מספר חיובי' }); }
	}
	// Commissions or output-based pay count at their average over the 12 months before the end (reg. 9) (review, PR 128).
	const commission = blank(input.commission) ? 0 : Number(input.commission);
	if (!(Number.isFinite(commission) && commission >= 0 && commission < 1e7)) { errors.push({ field: 'commission', he: 'ממוצע העמלות: מספר חיובי, 0 או ריק' }); } else if (commission > 0 && Number.isFinite(monthly)) { monthly = r2(monthly + commission); }
	const jobPct = blank(input.jobPct) ? 100 : Number(input.jobPct);
	if (!(jobPct > 0 && jobPct <= 100)) { errors.push({ field: 'jobPct', he: 'היקף המשרה: 1% עד 100%' }); }
	const s14 = ['full', 'partial', 'custom'].includes(input.s14) ? input.s14 : 'none';
	const s14Pct = s14 === 'full' ? sv.approval.full_pct : s14 === 'partial' ? sv.approval.partial_pct : s14 === 'custom' ? Number(input.s14Pct) : 0;
	if (s14 === 'custom' && !(s14Pct > 0 && s14Pct <= 100)) { errors.push({ field: 's14Pct', he: 'שיעור הכיסוי לפי ההסכם: 1% עד 100%' }); }
	const s14From = s14 === 'none' || blank(input.s14From) ? start : parseDate(input.s14From);
	if (s14 !== 'none' && !blank(input.s14From) && !s14From) { errors.push({ field: 's14From', he: 'תחילת ההפרשות לפי סעיף 14: תאריך מלא' }); }
	if (s14 !== 'none' && s14From && end && s14From > end) { errors.push({ field: 's14From', he: 'תחילת ההפרשות לפי סעיף 14 לפני היום האחרון בעבודה' }); }
	// One change of scope or pay (calculation regulations 7 and 8): each period on its own salary. More than one change is
	// not computed (review, PR 128).
	const change = Boolean(input.change);
	const changeDate = change ? parseDate(input.changeDate) : null;
	const monthlyChange = change && payType === 'monthly';
	const hourlyChange = change && payType === 'hourly';
	const prevPct = monthlyChange && !blank(input.prevPct) ? Number(input.prevPct) : jobPct;
	const prevSalary = monthlyChange && !blank(input.prevSalary) ? Number(input.prevSalary) : null;
	const prevHours = hourlyChange ? Number(input.prevHours) : null;
	const prevHourly = hourlyChange && !blank(input.prevHourly) ? Number(input.prevHourly) : null;
	if (hourlyChange && !(prevHours > 0 && prevHours <= 400)) { errors.push({ field: 'prevHours', he: 'ממוצע השעות בחודש לפני השינוי: 1 עד 400' }); }
	if (hourlyChange && prevHourly !== null && !(prevHourly > 0 && prevHourly < 10000)) { errors.push({ field: 'prevHourly', he: 'השכר לשעה לפני השינוי: מספר חיובי או ריק' }); }
	// Unpaid leave above 14 days in a work year is not counted (reg. 10(3)); the person sums the excess of each year.
	const unpaidExcess = blank(input.unpaidExcess) ? 0 : Number(input.unpaidExcess);
	if (!(Number.isFinite(unpaidExcess) && unpaidExcess >= 0 && unpaidExcess < 36500)) { errors.push({ field: 'unpaidExcess', he: 'ימי חופשה ללא תשלום: מספר ימים, 0 או ריק' }); }
	if (start && end && end >= start && unpaidExcess > 0 && unpaidExcess >= daysBetween(start, addDays(end, 1))) { errors.push({ field: 'unpaidExcess', he: 'ימי החופשה ללא תשלום ארוכים מתקופת העבודה כולה: בדקו את המספר' }); }
	// The leave belongs to one of the periods; with a change the tool would have to know which (review, PR 128).
	// Likewise with s.14 from a date inside the work: the leave may fall before or after the deposits began.
	if (unpaidExcess > 0 && s14 !== 'none' && s14From && start && s14From > start) { errors.push({ field: 'unpaidExcess', he: 'חופשה ללא תשלום יחד עם הפרשות לפי סעיף 14 שהתחילו באמצע העבודה: הימים מנוכים מהתקופה שבה היו, לפני ההפרשות או אחריהן. את השילוב המחשבון לא מחשב; חשבו כל תקופה בנפרד, או פנו לעורך דין.' }); }
	if (change && unpaidExcess > 0) { errors.push({ field: 'unpaidExcess', he: 'חופשה ללא תשלום יחד עם שינוי בהיקף המשרה או בשכר: הימים מנוכים מהתקופה שבה היו, לפי השכר שלה. את השילוב המחשבון לא מחשב; חשבו כל תקופה בנפרד, או פנו לעורך דין.' }); }
	if (change && input.manyChanges) { errors.push({ field: 'change', he: 'יותר משינוי אחד בהיקף המשרה או בשכר: כל תקופה מחושבת לפי ההיקף והשכר שלה (תקנות 7 ו-8 לתקנות החישוב). המחשבון מחשב שינוי אחד בלבד; את החישוב לכמה תקופות עושים לפי התלושים, עם עורך דין או רואה חשבון.' }); }
	if (change && !changeDate) { errors.push({ field: 'changeDate', he: 'מאיזה יום חל השינוי: תאריך מלא' }); }
	if (change && changeDate && start && end && (changeDate <= start || changeDate > end)) { errors.push({ field: 'changeDate', he: 'יום השינוי אחרי יום התחילה ועד היום האחרון' }); }
	if (monthlyChange && !(prevPct > 0 && prevPct <= 100)) { errors.push({ field: 'prevPct', he: 'היקף המשרה לפני השינוי: 1% עד 100%' }); }
	if (monthlyChange && prevSalary !== null && !(prevSalary > 0 && prevSalary < 1e7)) { errors.push({ field: 'prevSalary', he: 'השכר לפני השינוי: מספר חיובי או ריק' }); }
	// A wage worker's service before 1.8.1983 earns two weeks a year (s.12(א)); the tool does not split it (review, PR 128).
	if (payType === 'hourly' && start && start < sv.wage_regs_from) { errors.push({ field: 'start', he: 'לעובד לפי שעה או יום, תקופת העבודה שלפני 1.8.1983 מזכה בשכר שבועיים לשנה בלבד (סעיף 12(א)). את החישוב לתקופה כזאת המחשבון לא עושה; פנו לעורך דין או לרואה חשבון.' }); }
	// With no notice given, a date left in the field is ignored (review, PR 128).
	// Other grounds the law deems a dismissal (s.11(ב)-(ו) and more: seasonal work, enlistment or national service, a
	// shelter, an elected office, ...) each have their own conditions; the tool does not check them (review, PR 128).
	// A dismissal for serious misconduct may lose severance in whole or part by a collective agreement (s.16) or a ruling
	// of the labour court (s.17); the tool does not judge that (review, PR 128).
	if (input.misconduct && (input.reason === 'fired' || input.reason === 'term' || blank(input.reason))) { errors.push({ field: 'misconduct', he: 'פיטורים בנסיבות משמעתיות חמורות: לפי הסכם קיבוצי, או בהחלטת בית הדין לעבודה בענף שאין בו הסכם, אפשר לשלול את הפיצויים כולם או חלקם (סעיפים 16 ו-17). את זה המחשבון לא קובע; פנו לעורך דין.' }); }
	if (input.seasonal) { errors.push({ field: 'seasonal', he: 'לעובד עונתי הזכות לפיצויים והתקופה שלהם נקבעות לפי עונות העבודה (סעיף 1 לחוק פיצויי פיטורים), לא לפי שנה רצופה. את החישוב הזה המחשבון לא עושה; פנו לעורך דין או למדריך של משרד העבודה.' }); }
	if (input.otherBreaks) { errors.push({ field: 'breaks', he: 'הפסקות נוספות שלא נספרות בחישוב (שירות צבאי, שירות חלקי מעל 120 יום, מחלה או תאונה בלי תשלום מעבר לימי המחלה, ועוד בתקנה 10): את ניכוין המחשבון לא מחשב; חשבו לפי התקופות, או פנו לעורך דין.' }); }
	if (input.reason === 'other_ground') { errors.push({ field: 'reason', he: 'התפטרות מסיבה אחרת שהחוק רואה כפיטורים (למשל גיוס לשירות סדיר, שירות לאומי או אזרחי, שהייה במקלט לנשים מוכות, בחירה לראש רשות מקומית, עבודה עונתית, סעיף 11(ב)-(ו) ועוד): לכל סיבה תנאים משלה. את התנאים האלה המחשבון לא בודק; פנו לעורך דין או למדריך של משרד העבודה.' }); }
	const noticeDate = blank(input.noticeDate) || input.noticeMode === 'none' ? null : parseDate(input.noticeDate);
	if (!blank(input.noticeDate) && input.noticeMode !== 'none' && !noticeDate) { errors.push({ field: 'noticeDate', he: 'יום מסירת ההודעה: תאריך מלא' }); }
	if (noticeDate && end && start && (noticeDate > end || noticeDate < start)) { errors.push({ field: 'noticeDate', he: 'ההודעה ניתנה בין יום התחילה ליום העבודה האחרון' }); }
	if (errors.length) { return { ok: false, errors }; }

	const span = serviceSpan(start, end);
	const reason = input.reason === 'resign' || RESIGN_CODES.includes(input.reason) ? input.reason : 'fired';
	const reasonRow = sv.reasons.find((x) => x.code === reason) || null;
	// A parent's resignation counts as a dismissal only under the s.7 conditions, which the person confirms (review, PR 128).
	// Every resignation the law treats as a dismissal (ss.6-8, 11) depends on facts the person confirms; a fixed term (s.9)
	// is confirmed by its own choice (review, PR 128).
	const ground = RESIGN_CODES.includes(reason) && reason !== 'term';
	const groundOk = !ground || input.groundOk === true || (reason === 'parent' && input.parentOk === true);
	const entitledByReason = reason !== 'resign' && groundOk;
	const flags = [];
	const add = (level, code, he, section) => flags.push({ level, code, he, section: section || '' });

	// The salary the severance is computed on: never below the minimum wage for the job's share (s.13ב).
	const mwRow = minWageOn(mw, end);
	if (!mwRow) { return { ok: false, errors: [{ field: 'end', he: `סיום עבודה לפני ${heDay(mw.rows[0].from)}: שכר המינימום של אותה תקופה לא נמצא במחשבון, ולכן אי אפשר לבדוק את רצפת השכר (סעיף 13ב). את החישוב לתקופה כזאת עושים לפי התלושים, עם עורך דין או רואה חשבון.` }] }; }
	let base = monthly;
	let floored = false;
	if (mwRow) {
		const floorMonthly = r2(mwRow.monthly * jobPct / 100);
		if (payType === 'monthly' && monthly < floorMonthly - 0.005) { base = floorMonthly; floored = true; }
		// Rows before April 2018 hold the hourly rate on a 186-hour month (review, PR 128).
		const mwHour = mwRow.hourly_182 ?? mwRow.hourly_186;
		// The floor applies to the whole pay, commissions included (review, PR 128).
		if (payType === 'hourly' && mwHour && monthly < r2(mwHour * hours) - 0.005) { base = r2(mwHour * hours); floored = true; }
		if (floored) { add('warn', 'min_wage', `השכר שהזנתם נמוך משכר המינימום (${payType === 'hourly' ? `${mwHour} ₪ לשעה` : `${mwRow.monthly.toLocaleString('en-US')} ₪ לחודש במשרה מלאה`}, מ-${heDay(mwRow.from)}). הפיצויים מחושבים לפי שכר המינימום (סעיף 13ב), וגם על ההפרש בשכר עצמו אפשר לתבוע.`, 'סעיף 13ב'); }
	}
	const yearOk = span.months >= sv.min_months;
	// s.3: a dismissal shortly before the end of the first year is presumed made to dodge severance and does not impair
	// the right unless the employer proves otherwise. The tool treats the last two months of the year as "shortly before"
	// and computes the proportional amount as a conditional entitlement (review, PR 128).
	// A fixed term not renewed counts as a dismissal (s.9), so the presumption covers it too (review, PR 128).
	// "Shortly before" is a question of fact: the last two months are taken as such, and an earlier dismissal counts when
	// the person says it was close to the year's end and meant to avoid severance (review, PR 128).
	const dismissed = reason === 'fired' || reason === 'term';
	const nearYear = !yearOk && dismissed && (span.months >= sv.min_months - 2 || input.nearClaim === true);
	const conditional = nearYear;
	const entitled = (yearOk || nearYear) && entitledByReason;
	// The periods of work and the salary of each: reg. 7 (a change of scope: the last salary, proportional to the scope of
	// each period) and reg. 8 (a pay cut: the period before it on the salary before it).
	// For a wage worker the scope is the hours: the earlier period on the current hourly rate times the earlier hours.
	// The commission average is kept apart from the fixed pay and added to each period as it is (review, PR 128): the
	// fixed pay scales with the scope (reg. 7) or is the pre-cut pay (reg. 8).
	// The entered commission stays apart also when the total was raised to the floor (review, PR 128).
	const comm = Math.min(commission, base);
	const fte = (base - comm) * 100 / jobPct;
	const rate = payType === 'hourly' ? (base - comm) / hours : null;
	const reg7 = hourlyChange ? r2(rate * prevHours + comm) : r2(fte * prevPct / 100 + comm);
	// A pre-cut period keeps the entered commission average even when today's total was raised to the floor.
	const cut = hourlyChange ? prevHourly !== null && prevHourly > rate : monthlyChange && prevSalary !== null && prevSalary + commission > reg7;
	const prevBase = !change ? base : cut ? (hourlyChange ? r2(prevHourly * prevHours + commission) : r2(prevSalary + commission)) : reg7;
	const pctNow = payType === 'hourly' ? 100 : jobPct;
	const periods = change
		? [{ from: start, to: addDays(changeDate, -1), salary: prevBase, pct: payType === 'hourly' ? (100 * prevHours) / hours : prevPct }, { from: changeDate, to: end, salary: base, pct: pctNow }]
		: [{ from: start, to: end, salary: base, pct: pctNow }];
	const yearsOf = (a, b) => (a > b ? 0 : serviceSpan(a, b).years);
	// Uncounted unpaid leave shortens the service the amount is computed on, spread over the periods in proportion.
	const leaveFactor = unpaidExcess > 0 ? Math.max(0, (span.years - unpaidExcess / 365) / span.years) : 1;
	const countedYears = span.years * leaveFactor;
	const sevFrom = (from) => periods.reduce((t, p) => t + p.salary * yearsOf(from > p.from ? from : p.from, p.to), 0) * leaveFactor;
	const severance = entitled ? r2(sevFrom(start)) : 0;
	const scopeText = (p, h) => (payType === 'hourly' ? `${h} שעות בחודש` : `${p}% משרה`);
	if (change) { add('info', 'change', `חושב לפי שתי תקופות (${cut ? 'תקנה 8: הפחתת שכר' : 'תקנה 7: שינוי בהיקף המשרה'}): עד ${heDay(periods[0].to)} לפי ${Math.round(prevBase).toLocaleString('en-US')} ₪ לחודש (${scopeText(prevPct, prevHours)}), ומ-${heDay(changeDate)} לפי ${Math.round(base).toLocaleString('en-US')} ₪ (${scopeText(jobPct, hours)}).`, cut ? 'תקנה 8' : 'תקנה 7'); }
	if (unpaidExcess > 0) { add('info', 'leave', `${unpaidExcess} ימי חופשה ללא תשלום, מעבר ל-14 בשנת עבודה, לא נספרים בחישוב הפיצויים (תקנה 10(3)): התקופה לחישוב ${countedYears.toFixed(2)} שנים במקום ${span.years.toFixed(2)}. חופשת לידה שמשולמים עליה דמי לידה נספרת.`, 'תקנה 10(3)'); }
	if (!yearOk && !nearYear && dismissed) { add('info', 'near_year_ask', 'אם הפיטורים היו סמוך לסוף השנה הראשונה, החוק מניח שנעשו כדי לחמוק מפיצויים (סעיף 3). אם זה המצב, סמנו זאת בטופס, והסכום יחושב בכפוף לכך.', 'סעיף 3'); }
	if (!yearOk && !nearYear) { add('bad', 'under_year', `עבדתם פחות משנה (${span.months} חודשים ו-${span.days} ימים): אין זכות לפיצויי פיטורים לפי החוק (סעיף 1(א)). ההודעה המוקדמת מגיעה בכל מקרה.`, 'סעיף 1(א)'); }
	if (nearYear) { add('warn', 'near_year', `פוטרתם אחרי ${span.months} חודשים, סמוך לסוף השנה הראשונה: חזקה שהפיטורים נעשו כדי לחמוק מפיצויים, והם לא פוגעים בזכות אלא אם המעסיק יוכיח אחרת (סעיף 3). הסכום כאן יחסי לתקופה שעבדתם.`, 'סעיף 3'); }
	if (reason === 'resign') { add('info', 'resign', 'בהתפטרות רגילה אין זכות לפיצויים מהמעסיק. כספים שהופרשו לפיצויים לפי סעיף 14 שייכים לכם גם בהתפטרות.', 'סעיף 14'); }
	if (!groundOk && reason === 'parent') { add('bad', 'parent_unconfirmed', `התפטרות של הורה נחשבת לפיטורים רק בתנאי סעיף 7: ${reasonRow.conditions_he}. סמנו שהתנאים מתקיימים כדי לחשב פיצויים.`, 'סעיף 7'); }
	if (!groundOk && reason !== 'parent') { add('bad', 'ground_unconfirmed', `התפטרות נחשבת לפיטורים רק כשמתקיימים התנאים של ${reasonRow.section}: ${reasonRow.conditions_he || reasonRow.he}. בתביעה מוכיחים אותם. סמנו שהם מתקיימים כדי לחשב פיצויים.`, reasonRow.section); }
	if (reason === 'term') { add('info', 'term_as_fired', `חוזה לתקופה קצובה שהסתיים בלי הצעה לחדש אותו 3 חודשים לפני הסוף נחשב לפיטורים (${reasonRow.section}).`, reasonRow.section); }
	if (reasonRow && groundOk && reason !== 'term') { add('info', 'resign_as_fired', `התפטרות שדינה כפיטורים: ${reasonRow.he} (${reasonRow.section}). בתביעה מוכיחים את הנסיבות, ובחלק מהמקרים צריך להודיע למעסיק מראש על הסיבה.`, reasonRow.section); }


	// Section 14.
	let coveredYears = 0;
	if (s14 !== 'none' && entitled) {
		const from = s14From > start ? s14From : start;
		coveredYears = from > end ? 0 : serviceSpan(from, end).years;
	}
	// The severance for the period of the deposits, on the law's salary; the fund replaces s14Pct of it. What the fund
	// actually holds (deposits on each month's pay, plus returns) is not known here and is never shown as an amount
	// (review, PR 128).
	const coveredSev = s14 !== 'none' && entitled ? r2(sevFrom(s14From > start ? s14From : start)) : 0;
	const fundReplaces = entitled ? r2(coveredSev * s14Pct / 100) : 0;
	// Without a right to severance the fund is still the worker's; its balance is unknown here, never zero (review, PR 128).
	const fundUnknown = !entitled && s14 !== 'none';
	const employer = r2(severance - fundReplaces);
	if (s14 !== 'none') { add('info', 's14', `לפי סעיף 14 הכספים בקופה באים במקום ${s14Pct}% מהפיצויים בעד התקופה שבה הופרשו, ושייכים לכם בכל מקרה. אם ההפרשות היו משכר נמוך מהשכר האמיתי, על ההפרש מגיעה השלמה (סעיף 3 לאישור הכללי).`, 'סעיף 14'); }

	// Advance notice.
	const at = noticeDate || end;
	// The month of work in which the notice is given counts once it has started (the Ministry's table; noticeByMonth).
	const noticeSpan = serviceSpan(start, at);
	const workedToNotice = noticeSpan.months;
	const notice = noticeByMonth(sv, payType, noticeSpan);
	// Interpretation Law s.10: a period in days does not count the day of the notice (10(א)); a month ends on the same day
	// number in the next month, or on its last day when it has no such day (10(ב)).
	const noticeEnd = noticeDate ? (notice.month ? monthLater(noticeDate) : addDays(noticeDate, Math.ceil(notice.days))) : null;
	const short = noticeDate && end < noticeEnd ? daysBetween(end, noticeEnd) : 0;
	const inLieu = payType === 'monthly' ? (notice.month ? base : r2(base * notice.days / 30)) : null;
	const noticeMode = ['paid', 'none'].includes(input.noticeMode) ? input.noticeMode : 'worked';
	// Who owes whom depends on who ended the work: the employer who dismissed without notice pays (s.7(א)); a worker who
	// resigned and stopped working without notice owes the employer the same sum (s.7(ב)) (review, PR 128).
	// A fixed-term contract that ended without renewal is not the worker's resignation (s.9): no notice debt either way.
	const fixedTerm = reason === 'term';
	const resigned = reason !== 'fired' && !fixedTerm;
	const amt = inLieu !== null ? `, כאן ${Math.round(inLieu).toLocaleString('en-US')} ₪` : '';
	if (noticeMode === 'none' && fixedTerm) { add('info', 'no_notice_term', 'חוזה לתקופה קצובה שהסתיים ולא חודש: יום הסיום ידוע מראש, והעובד לא חייב למעסיק הודעה מוקדמת; לעניין הפיצויים הסיום נחשב לפיטורים (סעיף 9 לחוק פיצויי פיטורים).', 'סעיף 9'); }
	if (noticeMode === 'none' && !fixedTerm) {
		if (resigned) { add('warn', 'no_notice', `התפטרתם בלי הודעה מוקדמת: החוק מחייב את העובד לשלם למעסיק פיצוי בגובה השכר הרגיל לתקופת ההודעה (סעיף 7(ב))${amt}, והמעסיק עשוי לקזז אותו.`, 'סעיף 7(ב)'); } else { add('warn', 'no_notice', `לא ניתנה הודעה מוקדמת: המעסיק משלם פיצוי בגובה השכר הרגיל לתקופת ההודעה (סעיף 7(א))${amt}.`, 'סעיף 7(א)'); }
	}
	// A shortfall is claimed only when the notice was worked; when it was paid instead of work, the payment should cover
	// the days to the end of the statutory period (s.6), which the tool cannot see (review, PR 128).
	if (short && noticeMode === 'paid' && !fixedTerm) { add('info', 'paid_notice', `שילמו לכם במקום עבודה בתקופת ההודעה: התשלום צריך לכסות את השכר הרגיל עד ${heDay(noticeEnd)}, סוף התקופה שבחוק (סעיף 6). בדקו בתלוש שכולם שולמו.`, 'סעיף 6'); }
	if (short && noticeMode === 'worked' && !fixedTerm) { add('warn', 'short_notice', `ההודעה ניתנה ב-${heDay(noticeDate)}, ותקופת ההודעה שבחוק מסתיימת ב-${heDay(noticeEnd)}: חסרים ${short} ימים עד היום האחרון שהזנתם. ${resigned ? 'עובד שהפסיק לעבוד לפני סוף ההודעה חייב למעסיק את השכר הרגיל בעד הימים החסרים (סעיף 7(ב)), אלא אם המעסיק ויתר עליהם (סעיף 6(ב)).' : 'עליהם מגיע פיצוי בגובה השכר הרגיל (סעיף 7(א)).'}`, resigned ? 'סעיף 7(ב)' : 'סעיף 7(א)'); }

	// Tax: one month's last salary per year, never above the ceiling per year (s.9(7א)(א)).
	// The ceiling is the one of the tax year of the grant: the registry holds 2025-2027 (frozen at 13,750); for an end of
	// work in another year the tool gives no tax split (review, PR 128).
	// With s.14 the grant is the fund's balance plus the completion, so only the exempt ceiling is known (taxNote 'fund').
	const tax = sv.tax;
	// The grant may lawfully be paid up to 15 days after the end (Wage Protection Law s.20); if that can cross into a year
	// outside the window, the split is not given (review, PR 128).
	const taxKnown = end >= tax.from && addDays(end, sv.late.grace_days) <= tax.to;
	const perYear = Math.min(base, tax.ceiling);
	// A fund exists whenever s.14 applied, also on a resignation: its balance is unknown, so only the ceiling is.
	const withFund = s14 !== 'none';
	// The ceiling is the final monthly salary times the whole service (s.9(7א)(א)); when the final salary was for part-time
	// work, the full-time years count on the full-time salary (s.9(7א)(ד)). Pay cuts (reg. 8) do not change it (review,
	// PR 128).
	// Every earlier period with a higher scope than the final one counts on the final salary for that scope (Form 161).
	// For a wage worker the scope is the hours relative to the final hours, on the final rate (review, PR 128).
	const capRef = payType === 'hourly' ? base - comm : fte;
	const exemptCap = taxKnown ? r2(periods.reduce((t, p) => t + Math.min(p.pct > pctNow ? r2(capRef * p.pct / 100 + comm) : base, tax.ceiling) * yearsOf(p.from, p.to), 0)) : null;
	const exempt = !taxKnown ? null : withFund ? exemptCap : Math.min(severance, exemptCap);
	const taxable = !taxKnown || withFund ? null : r2(severance - exempt);
	const taxNote = !taxKnown ? 'year' : withFund ? 'fund' : '';
	const ceilingTotal = taxKnown ? r2(tax.ceiling * span.years) : null;
	if (!taxKnown && severance > 0) { add('info', 'tax_year', `תקרת הפטור ממס נקבעת לפי שנת המס שבה משולם המענק. במחשבון יש את התקרה של ${tax.from.slice(0, 4)} עד ${tax.to.slice(0, 4)} (${tax.ceiling.toLocaleString('en-US')} ₪ לשנת עבודה); לסיום עבודה ב-${end.slice(0, 4)} בדקו את התקרה בלוח העזר של רשות המסים לאותה שנה. החלק הפטור לא חושב.`, tax.section); }
	if (taxKnown && taxable > 0 && base < tax.ceiling) { add('info', 'commissioner', `מעל משכורת חודש לכל שנה, פקיד השומה רשאי לפטור עוד, עד ${tax.ceiling.toLocaleString('en-US')} ₪ לכל שנת עבודה (${ceilingTotal.toLocaleString('en-US')} ₪ אצלכם).`, tax.section); }

	// Deadlines (Wage Protection Law s.20; Advance Notice Law s.8(ב); Limitation Law s.5(1)).
	const late = sv.late;
	const deadlines = [
		{ key: 'due', date: end, he: 'המועד לתשלום הפיצויים: יום סיום יחסי העבודה', section: `${late.section}(א)(1)`, url: late.url },
		// A period that ends on a rest day runs to the next day (Interpretation Law s.10(ג)) (review, PR 128).
		{ key: 'grace', date: offRestDays(addDays(end, late.grace_days)), he: `היום ה-${late.grace_days}: עד אז אין פיצוי הלנה`, section: `${late.section}(ב)`, url: late.url },
		{ key: 'twenty', date: offRestDays(addDays(end, late.linkage_to_day)), he: `מהיום ה-${late.grace_days + 1} ועד ה-${late.linkage_to_day}: הפרשי הצמדה; אחרי היום ה-${late.linkage_to_day}: עוד ${late.monthly_pct}% לכל חודש של איחור (בית הדין רשאי להפחית)`, section: `${late.section}(ב)`, url: late.url },
		{ key: 'cert', date: offRestDays(addDays(end, sv.notice.cert_days)), he: `אישור בכתב על תחילת העבודה וסיומה: לכל המאוחר ${sv.notice.cert_days} ימים מהיום האחרון; בקשה בכתב מקדימה את המועד ל-${sv.notice.cert_request_days} ימים ממנה`, section: 'סעיף 8(ב) לחוק הודעה מוקדמת', url: sv.notice.url },
		{ key: 'limit', date: offRestDays(addMonths(end, 12 * sv.limitation.years)), he: `התיישנות תביעה לפיצויים: ${sv.limitation.years} שנים`, section: `${sv.limitation.section} לחוק ההתיישנות`, url: sv.limitation.url },
	].filter((d) => entitled || d.key === 'cert'); // no severance due: only the certificate (review, PR 128)

	return {
		ok: true, payType, monthly, base, floored, hourly, hours, jobPct, start, end, span, reason, reasonRow, entitled, yearOk, conditional,
		severance, s14, s14Pct, s14From, coveredYears, coveredSev, fundReplaces, fundUnknown, employer,
		change, changeDate, prevPct, prevSalary, prevHours, prevHourly, prevBase, cut, periods, taxNote, unpaidExcess, countedYears,
		groundOk, nearClaim: input.nearClaim === true, commission,
		// s.11(ה): on retirement the employer may credit provident-fund money meant for severance, even outside s.14.
		retireCredit: reason === 'retire' && entitled,
		notice, workedToNotice, noticeDate, noticeEnd, short, inLieu, noticeMode,
		exempt, taxable, exemptCap, ceilingTotal, perYear, deadlines, flags, mwRow,
	};
}

/** The same employee under each section-14 arrangement, for the side-by-side. */
export function byArrangement(registry, input) {
	const out = {};
	for (const k of ['none', 'partial', 'full']) {
		// The deposit period stays the user's own, so the card marked as theirs matches the main result (review, PR 128).
		const r = compute(registry, Object.assign({}, input, { s14: k }));
		out[k] = r.ok ? { employer: r.employer, pct: r.s14Pct, total: r.severance } : null;
	}
	return out;
}

/* ---------------- The labor wave (22.10.2026): the severance salary from the payslip, and the pension-deposit check ----------------
 * Additive only: compute(), serviceSpan(), noticeDays(), monthLater(), minWageOn() and RESIGN_CODES above are frozen (other
 * tools import them). Every number below comes from registry.labor_pitzuyim (the 1964 calculation regulations, reg. 1; the
 * comprehensive pension extension order, consolidated 2011, ss.6-9), registry.rights_neto.pension (the rates from
 * 1.1.2017), registry.rights_btl.avg_wage (the order's ceiling) and registry.severance.
 */

/**
 * Reg. 1 of the 1964 regulations: the payslip lines (monthly amounts) -> the severance salary.
 * parts = { base, seniority, col, family, dept, commission, overtime, travel, havraa, bonus, benefit, other }.
 * Returns { ok, any, rows[{code, he, status, section, rule_he, amount}], fixed (reg. 1), avg (reg. 9), out, check, base,
 * payslip } or { ok:false, errors }. status: in (counted), avg (the 12-month average, reg. 9), out (not in reg. 1(א)),
 * check (a fixed payment under another name: not counted; the labour court decides).
 */
export function pzBase(registry, parts) {
	const lp = registry.labor_pitzuyim;
	const errors = [];
	const rows = [];
	const sum = { in: 0, avg: 0, out: 0, check: 0 };
	for (const c of lp.components) {
		const raw = parts ? parts[c.code] : '';
		if (blank(raw)) { continue; }
		const v = Number(raw);
		if (!(Number.isFinite(v) && v >= 0 && v < 1e7)) { errors.push({ field: `pz-${c.code}`, he: `${c.he}: סכום חודשי חיובי, 0 או ריק` }); continue; }
		if (v === 0) { continue; }
		rows.push({ code: c.code, he: c.he, status: c.status, section: c.section, rule_he: c.rule_he, amount: v });
		sum[c.status] += v;
	}
	const any = rows.length > 0;
	if (!errors.length && any && !(sum.in > 0)) { errors.push({ field: 'pz-base', he: 'שכר יסוד: חובה כשממלאים את רכיבי התלוש (תקנה 1(א)(1))' }); }
	if (errors.length) { return { ok: false, errors }; }
	return { ok: true, any, rows, fixed: r2(sum.in), avg: r2(sum.avg), out: r2(sum.out), check: r2(sum.check), base: r2(sum.in + sum.avg), payslip: r2(sum.in + sum.avg + sum.out + sum.check) };
}

/** The pension order's deposit rates on a day (percent of the insured salary): s.6(ד) of the order to 2016, the 2016
 * increase order from 1.1.2017 (registry.rights_neto.pension). null before 1.1.2008. */
export function pzOrderRate(registry, day) {
	const lp = registry.labor_pitzuyim;
	const pn = registry.rights_neto.pension;
	if (day >= pn.from) { return { from: pn.from, employer: pn.employer_pct, employee: pn.employee_pct, severance: pn.severance_pct, section: lp.increase_2016.gazette_he }; }
	let row = null;
	for (const x of lp.order.rows) { if (x.from <= day) { row = x; } }
	return row ? { from: row.from, employer: row.employer, employee: row.employee, severance: row.severance, section: lp.order.rows_section } : null;
}

/** The share of a year's severance that a deposit rate replaces (s.7 of the order; the 1998 approval: 6% -> 72%, the full
 * rate (8⅓%, the order writes 8.33%) -> 100%): a month's salary a year is 1/12 of the year's pay. */
export function pzCoverPct(rate, full) {
	return rate >= full ? 100 : r2(rate * 12);
}

/** The periods of the deposit schedule between two days, each with the order's severance rate. */
function pzSegments(registry, from, to) {
	const lp = registry.labor_pitzuyim;
	const marks = [...lp.order.rows.map((x) => x.from), registry.rights_neto.pension.from].filter((d) => d > from && d <= to).sort();
	const out = [];
	let a = from;
	for (const m of [...marks, addDays(to, 1)]) {
		const b = addDays(m, -1);
		if (b >= a) { const rt = pzOrderRate(registry, a); if (rt) { out.push({ from: a, to: b, rate: rt.severance, years: serviceSpan(a, b).years }); } }
		a = m;
	}
	return out;
}

/**
 * The section-14 and pension-deposit check on a computed result r (from compute()).
 * input = { depWage (the salary the deposits were made on; empty = the law's salary), fundBal (the severance balance on the
 * fund's annual report; optional), orderRates (true: the deposits followed the order's rising rates from 2008) }.
 * Returns { ok, wage, depWage, capWage, avgWage, rates, monthly, mandatory, from, months, gap, order, fund, flags } or
 * { ok:false, errors }. It never states what the fund holds: only what the rates put in it, without returns.
 */
export function pzFundCheck(registry, r, input = {}) {
	if (!r || !r.ok) { return { ok: false, errors: [] }; }
	const lp = registry.labor_pitzuyim;
	const pn = registry.rights_neto.pension;
	const avgWage = registry.rights_btl.avg_wage.s2_benefits;
	const full = lp.order.full_rate;
	const errors = [];
	const depWage = blank(input.depWage) ? null : Number(input.depWage);
	const fundBal = blank(input.fundBal) ? null : Number(input.fundBal);
	if (depWage !== null && !(Number.isFinite(depWage) && depWage > 0 && depWage < 1e7)) { errors.push({ field: 'depWage', he: 'השכר שממנו הופרש: מספר חיובי או ריק' }); }
	if (fundBal !== null && !(Number.isFinite(fundBal) && fundBal >= 0 && fundBal < 1e8)) { errors.push({ field: 'fundBal', he: 'יתרת הפיצויים בקופה: מספר, 0 או ריק' }); }
	if (errors.length) { return { ok: false, errors }; }
	const flags = [];
	const add = (level, code, he, section) => flags.push({ level, code, he, section: section || '' });
	const n0 = (x) => Math.round(x).toLocaleString('en-US');
	// The deposit wage: what the payslip deposits on; the s.14 cover reaches at most the law's salary (s.6(ב) of the order).
	const wage = depWage === null ? r.base : depWage;
	const capWage = Math.min(wage, avgWage);
	const isFull = r.s14 === 'full';
	const sevRate = isFull ? full : pn.severance_pct;
	const completion = isFull ? 0 : r2(full - pn.severance_pct);
	const rates = { employee: pn.employee_pct, employer: pn.employer_pct, severance: sevRate, completion, full };
	const monthly = { employee: r2(wage * pn.employee_pct / 100), employer: r2(wage * pn.employer_pct / 100), severance: r2(wage * sevRate / 100), completion: r2(wage * completion / 100) };
	monthly.total = r2(monthly.employer + monthly.severance + monthly.completion);
	const mandatory = { wage: capWage, employee: r2(capWage * pn.employee_pct / 100), employer: r2(capWage * pn.employer_pct / 100), severance: r2(capWage * pn.severance_pct / 100) };
	if (wage > avgWage) { add('info', 'cap', `חובת ההפרשה לפי צו הפנסיה חלה עד השכר הממוצע במשק (${n0(avgWage)} ₪ מ-${heDay(registry.rights_btl.from)}). מעל זה ההפרשה לפי ההסכם, ועל פיצויים שלא הופרשו המעסיק אחראי לפי החוק.`, lp.order.cap_section); }
	// The deposit period: from the s.14 start, or (the order's route without s.14) from 1.1.2008 or the first day of work.
	const order = input.orderRates === true && !isFull;
	// Without s.14 the reader may give the first deposit day (the order's waiting period, s.6(ה), delays it).
	const depFrom = r.s14 === 'none' && order && !blank(input.depFrom) ? parseDate(input.depFrom) : null;
	if (r.s14 === 'none' && order && !blank(input.depFrom) && (!depFrom || depFrom < r.start || depFrom > r.end)) { return { ok: false, errors: [{ field: 'depFrom', he: 'יום תחילת ההפרשות: תאריך מלא, בין יום התחילה ליום העבודה האחרון' }] }; }
	const orderFrom = depFrom || r.start;
	const from = r.s14 !== 'none' ? (r.s14From > r.start ? r.s14From : r.start) : order ? (orderFrom > lp.order.first_from ? orderFrom : lp.order.first_from) : null;
	if (order && r.s14 === 'none' && !depFrom && r.entitled) { add('info', 'waiting', `${pn.wait_he} (סעיף 6(ה) לצו). בעד החודשים שלא הופרש בהם, המעסיק משלם פיצויים מלאים: הזינו את היום שבו התחילו ההפרשות.`, '6(ה)'); }
	const span = from && from <= r.end ? serviceSpan(from, r.end) : null;
	const months = span ? r2(span.months + (span.days * 12) / 365) : 0;
	const simple = !r.change && !(r.unpaidExcess > 0);
	// A deposit wage below the law's salary: s.14 replaces severance only for the salary deposited (s.7 of the order); the
	// employer owes the full severance on the rest of the salary for that period.
	let gap = null;
	if (r.entitled && r.s14 !== 'none' && !order && depWage !== null && wage < r.base - 0.005) {
		if (simple) {
			const extra = r2(r.coveredSev * (1 - wage / r.base) * r.s14Pct / 100);
			gap = { wage, base: r.base, short: r2(r.base - wage), extra, employer: r2(r.employer + extra) };
			add('warn', 'gap', `ההפרשות היו מ-${n0(wage)} ₪, פחות מהשכר הקובע (${n0(r.base)} ₪). על ההפרש סעיף 14 לא חל, והמעסיק משלים עוד ${n0(extra)} ₪ (סעיף 7 לצו).`, lp.order.cover_section);
		} else {
			add('info', 'gap_periods', 'ההפרשות היו משכר נמוך מהשכר הקובע, והיה שינוי בשכר או חופשה ללא תשלום: את ההשלמה על ההפרש מחשבים לפי כל תקופה בנפרד (סעיף 7 לצו).', lp.order.cover_section);
		}
	}
	// The order's route: each period replaced at its rate (2008: 0.834% -> 10.01% of that year's severance; from 2014: 6% -> 72%).
	let orderRes = null;
	if (order && r.entitled && from && from <= r.end) {
		if (!simple) {
			add('info', 'order_periods', 'הפרשות לפי שיעורי הצו יחד עם שינוי בשכר או חופשה ללא תשלום: את הכיסוי מחשבים לפי כל תקופה בנפרד.', lp.order.cover_section);
		} else {
			const first = lp.order.first_from;
			const segs = pzSegments(registry, from < first ? first : from, r.end);
			const ratio = Math.min(1, wage / r.base);
			const rows = segs.map((s) => { const cover = pzCoverPct(s.rate, full); const sev = r2(r.base * s.years); return { from: s.from, to: s.to, rate: s.rate, cover, years: s.years, sev, replaced: r2(sev * ratio * cover / 100) }; });
			// Before 1.1.2008 the order did not exist: deposits of that time (s.14 chosen) count at the arrangement's own share.
			if (r.s14 !== 'none' && from < first) {
				const to = addDays(first, -1) < r.end ? addDays(first, -1) : r.end;
				const years = serviceSpan(from, to).years;
				const sev = r2(r.base * years);
				rows.unshift({ from, to, rate: null, cover: r.s14Pct, years, sev, replaced: r2(sev * ratio * r.s14Pct / 100) });
			}
			const replaced = r2(rows.reduce((t, x) => t + x.replaced, 0));
			const sevCovered = r2(rows.reduce((t, x) => t + x.sev, 0));
			orderRes = { rows, replaced, sevCovered, coverPct: sevCovered ? r2(replaced * 100 / sevCovered) : 0, employer: r2(r.severance - replaced) };
			add('info', 'order', `לפי שיעורי צו הפנסיה, ההפרשות לפיצויים מכסות ${orderRes.coverPct}% מהפיצויים בעד תקופת ההפרשות, והמעסיק משלים ${n0(orderRes.employer)} ₪ (סעיף 7 לצו).`, lp.order.cover_section);
		}
	}
	if (r.s14 === 'none' && !order && r.entitled && r.end >= lp.order.first_from) { add('info', 'order_s7', 'אם המעסיק הפריש לכם לפיצויים לפי צו הפנסיה, ההפרשות באות במקום פיצויים בשיעור שהופרש (6% במקום 72%), בעד השכר והתקופות שבעדם הופרשו (סעיף 7 לצו). בדקו בתלוש ובדוח השנתי של הקופה, ובחרו את ההסדר שמתאים.', lp.order.cover_section); }
	// The fund balance against what the rates put in, without returns or fees: a check, never a verdict.
	let fund = null;
	if (fundBal !== null && from && months > 0) {
		const segs = order ? pzSegments(registry, from, r.end) : [{ rate: sevRate, years: months / 12 }];
		const deposits = r2(segs.reduce((t, s) => t + (wage * s.rate / 100) * s.years * 12, 0));
		const diff = r2(fundBal - deposits);
		const low = diff < -0.1 * deposits;
		fund = { bal: fundBal, deposits, diff, pct: deposits ? r2(fundBal * 100 / deposits) : 0, low };
		add(low ? 'warn' : 'info', 'fund', low
			? `היתרה בקופה (${n0(fundBal)} ₪) נמוכה ביותר מ-10% מההפקדות שהשיעורים מחייבים על השכר הזה (${n0(deposits)} ₪, בלי תשואה). אפשר שחסרות הפקדות, שהשכר היה נמוך יותר בעבר או שהקופה הפסידה: בדקו בדוחות השנתיים. על הפקדות שחסרות סעיף 14 לא חל (סעיף 7 לצו).`
			: `היתרה בקופה (${n0(fundBal)} ₪) לעומת ההפקדות שהשיעורים מחייבים על השכר הזה (${n0(deposits)} ₪, בלי תשואה): ההפרש (${n0(diff)} ₪) יכול לבוא מתשואה, מדמי ניהול או משכר שהשתנה.`, lp.order.cover_section);
	}
	return { ok: true, wage, depWage, capWage, avgWage, rates, monthly, mandatory, from, months, gap, order: orderRes, fund, flags };
}

/** "What changed and when": the published values behind the instrument, dated. */
export function pzChanges(registry) {
	const sv = registry.severance;
	const lp = registry.labor_pitzuyim;
	const pn = registry.rights_neto.pension;
	const aw = registry.rights_btl.avg_wage;
	const rows = [{ date: '1998', he: `האישור הכללי לפי סעיף 14: הפרשה של 8⅓% לפיצויים במקום ${sv.approval.full_pct}% מהם; 6% בלי השלמה במקום ${sv.approval.partial_pct}%`, src: sv.approval.gazette_he, url: sv.approval.url }];
	for (const x of lp.order.rows) { rows.push({ date: x.from, he: `צו הפנסיה: לפיצויים ${x.severance}%, תגמולי מעסיק ${x.employer}%, עובד ${x.employee}% (כיסוי ${pzCoverPct(x.severance, lp.order.full_rate)}% מהפיצויים)`, src: `${lp.order.rows_section}, ${lp.order.gazette_he}`, url: lp.order.url }); }
	rows.push({ date: pn.from, he: `לפיצויים ${pn.severance_pct}%, תגמולי מעסיק ${pn.employer_pct}%, עובד ${pn.employee_pct}%; השלמה לפי בחירת המעסיק עד ${lp.order.full_rate}%`, src: `${lp.increase_2016.he}, ${lp.increase_2016.gazette_he}`, url: lp.increase_2016.source_url });
	rows.push({ date: sv.tax.from, he: `תקרת הפטור ממס על פיצויים: ${sv.tax.ceiling.toLocaleString('en-US')} ₪ לכל שנת עבודה, בלי עדכון עד ${sv.tax.to.slice(0, 4)}`, src: `${sv.tax.section}; ${sv.tax.frozen_he}`, url: sv.tax.source_url });
	rows.push({ date: registry.rights_btl.from, he: `השכר הממוצע במשק (סעיף 2 לחוק הביטוח הלאומי): ${aw.s2_benefits.toLocaleString('en-US')} ₪, עד אליו חלה חובת ההפרשה לפי הצו`, src: lp.order.cap_section, url: aw.url });
	for (const x of registry.min_wage.rows.slice(-3)) { rows.push({ date: x.from, he: `שכר המינימום: ${x.monthly.toLocaleString('en-US')} ₪ לחודש, הרצפה של שכר הפיצויים (סעיף 13ב)`, src: registry.min_wage.law_he, url: registry.min_wage.source_url }); }
	return rows.sort((a, b) => String(a.date).localeCompare(String(b.date)));
}
