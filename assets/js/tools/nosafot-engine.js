/**
 * The labor-law wave (22.10.2026): the overtime time card (shaot-nosafot) on /overtime-pay-israel/.
 *
 * One week of a time card (start-end or hours, per day) is measured against the Hours of Work and Rest Law the way the
 * Ministry of Labor's 2018 directive counts it: per day first, then per week, never per month. Each day has its norm
 * (s.2: 8 hours, 7 at night, on the day before the weekly rest and before a holiday; a 5-day week: 8.6 hours and one
 * fixed shortened day of 7.6, from the 2018 extension order as the Ministry's legal department states it). Hours above
 * the day's norm are overtime; the regular hours are then added up in the order of the week, and whatever passes 42 is
 * overtime of the day it falls in. In each day the first two overtime hours are 125% and the rest 150% (s.16(א)); hours
 * on the weekly rest are 150% (s.17(א)(1)). The rates, the 42 hours, the 182-hour divisor, 12 hours a day and 16 overtime
 * hours a week are read from rights_neto.overtime; the minimum wage from min_wage; the 7 years from severance.limitation;
 * the rest from labor_nosafot. The week becomes a month with the reader's own number of weeks (no factor is assumed),
 * a fixed overtime payment is checked against it, and the gap is carried back over the months the reader names, up to
 * what the 7-year limitation still allows. Pure; dates.js only.
 */
import { addDays, addMonths, addYears } from './dates.js';

/** Sunday..Saturday, the order the week is counted in. */
export const NS_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
export const NS_SHORT = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
/** The weekly rest day the worker keeps (s.7(ב)): Saturday, or for a worker who is not Jewish, Sunday or Friday. */
export const NS_REST = { sat: 6, sun: 0, fri: 5 };

export const NS_DEFAULT = {
	pay: 'monthly', salary: 9100, hourly: 50, monthHours: 182, week: 5, rest: 'sat', shortDay: 4,
	days: ['07:30-19:00', '08:00-18:30', '08:00-18:30', '08:00-17:00', '08:00-16:00', '', ''],
	kind: ['', '', '', '', '', '', ''], brk: 30, weeks: 4, paid: 0, months: 12, youth: false, asOf: '2026-10-22',
};

const nsR2 = (x) => Math.round((Number(x) + Number.EPSILON) * 100) / 100;
const nsNum = (v) => (v === '' || v === null || v === undefined ? NaN : Number(String(v).replace(/[,\s₪]/g, '')));

/**
 * One day's entry: "08:00-17:30", "8-17", "0800-1730", "22:00-06:00" (past midnight), or hours "9.5" / "9:30".
 * Returns { ok, empty, hours, start, end } in minutes from the day's midnight (end may pass 24:00), or { ok:false }.
 */
export function nsParseDay(text) {
	const raw = String(text ?? '').trim().replace(/[–—−]/g, '-').replace(/\s+/g, '');
	if (!raw) { return { ok: true, empty: true, hours: 0 }; }
	let m = raw.match(/^(\d{1,2})(?::?(\d{2}))?-(\d{1,2})(?::?(\d{2}))?$/);
	if (m) {
		const h1 = +m[1]; const m1 = +(m[2] || 0); const h2 = +m[3]; const m2 = +(m[4] || 0);
		if (h1 > 23 || h2 > 24 || m1 > 59 || m2 > 59 || (h2 === 24 && m2 > 0)) { return { ok: false }; }
		const start = h1 * 60 + m1;
		let end = h2 * 60 + m2;
		if (end === start) { return { ok: false, same: true }; }
		if (end < start) { end += 1440; }
		return { ok: true, empty: false, hours: nsR2((end - start) / 60), start, end };
	}
	m = raw.match(/^(\d{1,2}):(\d{2})$/);
	if (m && +m[2] < 60) { return { ok: true, empty: false, hours: nsR2(+m[1] + +m[2] / 60) }; }
	if (/^\d{1,2}(\.\d+)?$/.test(raw)) { return { ok: true, empty: false, hours: nsR2(Number(raw)) }; }
	return { ok: false };
}

/** Hours of a range that fall between 22:00 and 06:00 (s.1, "night work"): the windows of the previous, same and next night. */
export function nsNightHours(start, end) {
	let mins = 0;
	for (const [a, b] of [[-120, 360], [1320, 1800], [2760, 3240]]) {
		mins += Math.max(0, Math.min(end, b) - Math.max(start, a));
	}
	return nsR2(mins / 60);
}

/** The minimum wage row in force on a day (min_wage.rows, by "from"). */
export function nsMinRow(mw, day) {
	let row = null;
	for (const r of mw.rows) { if (r.from <= day) { row = r; } }
	return row;
}

const nsMonthKey = (iso) => iso.slice(0, 7);
const nsMonthEnd = (key) => addDays(addMonths(`${key}-01`, 1), -1);
const nsHeMonth = (key) => { const [y, m] = key.split('-').map(Number); return `${m}.${y}`; };

/** The day's norm (s.2, the 5-day week of the order) and why. */
export function nsNorm(reg, p, i, kind) {
	const ln = reg.labor_nosafot;
	const eveOfRest = i === (NS_REST[p.rest] + 6) % 7;
	let norm;
	let why;
	if (p.week === 5) {
		norm = i === p.shortDay ? ln.five.short : ln.five.day;
		why = i === p.shortDay ? 'היום המקוצר' : 'שבוע של 5 ימים';
	} else {
		norm = ln.day.regular;
		why = 'יום עבודה';
	}
	const shortBy = kind === 'night' ? 'עבודת לילה' : kind === 'eve' ? 'ערב חג' : eveOfRest ? 'ערב המנוחה השבועית' : '';
	if (shortBy && ln.day.short < norm) { norm = ln.day.short; why = shortBy; }
	return { norm, why, eveOfRest };
}

/** Validates and normalises the input; errors name their field. */
export function nsNormalize(reg, input) {
	const i = Object.assign({}, NS_DEFAULT, input || {});
	const errors = [];
	const pay = i.pay === 'hourly' ? 'hourly' : i.pay === 'monthly' ? 'monthly' : '';
	if (!pay) { errors.push({ field: 'pay', he: 'בחרו שכר חודשי או שכר לפי שעה.' }); }
	const salary = nsNum(i.salary);
	const hourly = nsNum(i.hourly);
	const monthHours = nsNum(i.monthHours === '' ? 182 : i.monthHours);
	const divisor = reg.rights_neto.overtime.divisor;
	if (pay === 'monthly') {
		if (!(salary > 0) || salary > 1000000) { errors.push({ field: 'salary', he: 'שכר חודשי ברוטו: מספר חיובי עד 1,000,000 ₪.' }); }
		if (!(monthHours > 0) || monthHours > divisor) { errors.push({ field: 'monthHours', he: `שעות בחודש לפי החוזה: 1 עד ${divisor} (משרה מלאה: ${divisor}, לפי צו ההרחבה).` }); }
	}
	if (pay === 'hourly' && (!(hourly > 0) || hourly > 10000)) { errors.push({ field: 'hourly', he: 'שכר לשעה: מספר חיובי עד 10,000 ₪.' }); }
	const week = Number(i.week) === 6 ? 6 : 5;
	const rest = Object.prototype.hasOwnProperty.call(NS_REST, i.rest) ? i.rest : 'sat';
	const shortDay = Number.isInteger(Number(i.shortDay)) && Number(i.shortDay) >= 0 && Number(i.shortDay) <= 6 ? Number(i.shortDay) : 4;
	const brk = i.brk === '' || i.brk === undefined ? 0 : nsNum(i.brk);
	if (!(brk >= 0) || brk > 180) { errors.push({ field: 'brk', he: 'הפסקה שלא נספרת: 0 עד 180 דקות ביום.' }); }
	const days = [];
	const raw = Array.isArray(i.days) ? i.days : [];
	const kinds = Array.isArray(i.kind) ? i.kind : [];
	for (let d = 0; d < 7; d++) {
		const parsed = nsParseDay(raw[d]);
		if (!parsed.ok) {
			errors.push({ field: `d${d}`, he: parsed.same ? `יום ${NS_DAYS[d]}: שעת היציאה זהה לשעת הכניסה.` : `יום ${NS_DAYS[d]}: כתבו טווח (08:00-17:00) או מספר שעות (9.5).` });
			days.push({ i: d, text: String(raw[d] ?? ''), hours: 0, empty: true, kind: '' });
			continue;
		}
		let hours = parsed.hours;
		// The break the worker left for comes off a day given as a range of 6 hours or more (s.20(א) requires one there).
		if (!parsed.empty && parsed.start !== undefined && brk > 0 && hours >= reg.labor_nosafot.break.min_day) { hours = nsR2(Math.max(0, hours - brk / 60)); }
		if (hours > 24) { errors.push({ field: `d${d}`, he: `יום ${NS_DAYS[d]}: יותר מ-24 שעות.` }); }
		const kind = kinds[d] === 'night' || kinds[d] === 'eve' ? kinds[d] : '';
		days.push({ i: d, text: String(raw[d] ?? '').trim(), hours, empty: parsed.empty, start: parsed.start, end: parsed.end, range: parsed.start !== undefined, kind });
	}
	if (!errors.some((e) => e.field.startsWith('d')) && days.every((d) => d.empty || !d.hours)) { errors.push({ field: 'd0', he: 'הזינו לפחות יום עבודה אחד בכרטיס.' }); }
	const weeks = nsNum(i.weeks);
	if (!(weeks > 0) || weeks > 5) { errors.push({ field: 'weeks', he: 'שבועות כאלה בחודש: יותר מ-0 ועד 5.' }); }
	const paid = i.paid === '' || i.paid === undefined || i.paid === null ? 0 : nsNum(i.paid);
	if (!(paid >= 0) || paid > 1000000) { errors.push({ field: 'paid', he: 'הסכום ששולם על שעות נוספות: 0 ומעלה.' }); }
	const months = i.months === '' || i.months === undefined || i.months === null ? 0 : nsNum(i.months);
	if (!(months >= 0) || months > 240 || !Number.isInteger(months)) { errors.push({ field: 'months', he: 'חודשים לבדיקה לאחור: מספר שלם מ-0 עד 240.' }); }
	const asOf = /^\d{4}-\d{2}-\d{2}$/.test(String(i.asOf || '')) ? i.asOf : NS_DEFAULT.asOf;
	return {
		errors,
		p: { pay, salary, hourly, monthHours: pay === 'monthly' ? monthHours : '', week, rest, shortDay, brk, days, weeks, paid, months, youth: Boolean(i.youth), asOf },
	};
}

/** The week, the month, the gap and the dates. */
export function nsCompute(reg, input) {
	const { errors, p } = nsNormalize(reg, input);
	if (errors.length) { return { ok: false, errors }; }
	const ln = reg.labor_nosafot;
	const ot = reg.rights_neto.overtime;
	const restIdx = NS_REST[p.rest];
	const cap = ot.week_hours;
	const first = ot.first_hours;
	let cum = 0;
	const days = p.days.map((d) => {
		const nightH = d.range ? nsNightHours(d.start, d.end) : 0;
		const autoNight = d.range && nightH >= ln.night.min_hours;
		const kind = autoNight ? 'night' : d.kind;
		const { norm, why, eveOfRest } = nsNorm(reg, p, d.i, kind);
		const out = Object.assign({}, d, { kind, night: kind === 'night', autoNight, nightH, norm, why, eveOfRest, rest: d.i === restIdx, reg: 0, dailyOt: 0, weeklyOt: 0, ot: 0, h125: 0, h150: 0, hRest: 0, restOver: 0 });
		if (!d.hours) { return out; }
		if (out.rest) {
			out.hRest = d.hours;
			out.restOver = nsR2(Math.max(0, d.hours - norm));
			return out;
		}
		out.dailyOt = nsR2(Math.max(0, d.hours - norm));
		const regPart = nsR2(d.hours - out.dailyOt);
		const room = nsR2(Math.max(0, cap - cum));
		out.reg = nsR2(Math.min(regPart, room));
		out.weeklyOt = nsR2(regPart - out.reg);
		cum = nsR2(cum + out.reg);
		out.ot = nsR2(out.dailyOt + out.weeklyOt);
		out.h125 = nsR2(Math.min(first, out.ot));
		out.h150 = nsR2(out.ot - out.h125);
		return out;
	});
	const sum = (k) => nsR2(days.reduce((s, d) => s + d[k], 0));
	const wk = { reg: sum('reg'), h125: sum('h125'), h150: sum('h150'), rest: sum('hRest'), restOver: sum('restOver'), dailyOt: sum('dailyOt'), weeklyOt: sum('weeklyOt'), total: sum('hours') };
	wk.ot = nsR2(wk.h125 + wk.h150);
	const rate = p.pay === 'monthly' ? p.salary / p.monthHours : p.hourly;
	const r125 = ot.first_pct / 100;
	const r150 = ot.next_pct / 100;
	const rRest = ot.rest_pct / 100;
	// Amounts are kept exact until the end and rounded to the agora once, so the month is never a sum of rounded weeks.
	const raw = { reg: rate * wk.reg, p125: rate * r125 * wk.h125, p150: rate * r150 * wk.h150, pRest: rate * rRest * wk.rest };
	raw.extra = raw.p125 + raw.p150 + raw.pRest;
	const pay = { reg: nsR2(raw.reg), p125: nsR2(raw.p125), p150: nsR2(raw.p150), pRest: nsR2(raw.pRest), extra: nsR2(raw.extra), total: nsR2(raw.reg + raw.extra) };
	const month = { weeks: p.weeks, extra: nsR2(raw.extra * p.weeks), total: p.pay === 'hourly' ? nsR2((raw.reg + raw.extra) * p.weeks) : nsR2(p.salary + raw.extra * p.weeks), paid: p.paid };
	month.gap = nsR2(month.extra - p.paid);
	month.covered = month.gap <= 0;
	// Back pay: the last `months` full months before the month of asOf; each month's wage falls due at its end (s.9) and
	// stays claimable 7 years from then (Limitation Law s.5(1), s.6).
	const years = reg.severance.limitation.years;
	const thisKey = nsMonthKey(p.asOf);
	const counted = [];
	for (let k = 1; k <= p.months; k++) {
		const key = nsMonthKey(addMonths(`${thisKey}-01`, -k));
		const due = nsMonthEnd(key);
		const lapse = addYears(due, years);
		if (lapse >= p.asOf) { counted.push({ key, due, lapse }); }
	}
	const oldest = counted.length ? counted[counted.length - 1] : null;
	const latest = counted.length ? counted[0] : null;
	const back = {
		asked: p.months, months: counted.length, expired: p.months - counted.length, amount: nsR2(Math.max(0, month.gap) * counted.length),
		oldest: oldest ? oldest.key : '', oldestLapse: oldest ? oldest.lapse : '', latest: latest ? latest.key : '',
		latestDetermining: latest ? addDays(latest.due, ln.pay_day.after_days) : '',
	};
	back.compLimit = latest ? addYears(back.latestDetermining, ln.delay.comp_years) : '';
	const due = nsMonthEnd(thisKey);
	const dates = { thisMonth: thisKey, due, determining: addDays(due, ln.pay_day.after_days) };
	const events = [
		{ date: dates.due, kind: 'pay', what: `מועד תשלום השכר של ${nsHeMonth(thisKey)}, כולל גמול השעות הנוספות`, rule: ln.pay_day.section, url: ln.wage_law_url },
		{ date: dates.determining, kind: 'determining', what: `היום הקובע: שכר ${nsHeMonth(thisKey)} שלא שולם עד היום הוא שכר מולן`, rule: ln.pay_day.section, url: ln.wage_law_url },
	];
	if (back.amount > 0 && back.compLimit) {
		events.push({ date: back.compLimit, kind: 'comp', what: `שנה מהיום הקובע של שכר ${nsHeMonth(back.latest)}: עד אז מגישים תביעה לפיצוי הלנת שכר עליו (אם השכר שולם באיחור: תוך 60 ימים מיום התשלום, המוקדם מביניהם)`, rule: ln.delay.limit_section, url: ln.wage_law_url });
	}
	if (back.amount > 0 && oldest) {
		events.push({ date: oldest.lapse, kind: 'lapse', what: `השכר של ${nsHeMonth(oldest.key)}, החודש המוקדם בבדיקה, מתיישן`, rule: ln.limitation.section, url: ln.limitation_url });
	}
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	// The minimum wage on asOf: the regular wage is never below it (the 2018 directive).
	const mrow = nsMinRow(reg.min_wage, p.asOf);
	const minHour = mrow ? (mrow.hourly_182 || mrow.hourly_186) : 0;
	const flags = nsFlags(reg, p, days, wk, rate, minHour);
	return { ok: true, p, days, week: wk, rate: nsR2(rate), rateExact: rate, pay, month, back, dates, events, flags, minHour, minFrom: mrow ? mrow.from : '', restIdx };
}

/** Every limit and rule the week touches, with its section; level: danger | warn | info. */
export function nsFlags(reg, p, days, wk, rate, minHour) {
	const ln = reg.labor_nosafot;
	const ot = reg.rights_neto.overtime;
	const f = [];
	const name = (d) => NS_DAYS[d.i];
	if (minHour && rate + 1e-9 < minHour) {
		f.push({ level: 'danger', he: `שכר השעה (${nsR2(rate)} ₪) נמוך משכר המינימום לשעה (${minHour} ₪): ${ln.regular.min_he}`, section: ln.regular.min_section, url: ln.directive_url });
	}
	const long = days.filter((d) => d.hours > ot.max_day);
	if (long.length) { f.push({ level: 'warn', he: `${long.map(name).join(', ')}: יותר מ-${ot.max_day} שעות ביום, מעבר למה שההיתר הכללי מתיר`, section: ln.permit.section, url: ln.review_url }); }
	if (wk.ot > ot.max_week_overtime) { f.push({ level: 'warn', he: `${wk.ot} שעות נוספות בשבוע: יותר מ-${ot.max_week_overtime}, מעבר למה שההיתר הכללי מתיר`, section: ln.permit.section, url: ln.review_url }); }
	const anyNight = days.some((d) => d.hours && d.night);
	if (anyNight && wk.total > ln.permit.night_week) { f.push({ level: 'warn', he: `עבודת לילה ו-${wk.total} שעות בשבוע: יותר מ-${ln.permit.night_week} שעות כולל שעות נוספות`, section: ln.permit.section, url: ln.review_url }); }
	// s.21: 8 hours between one working day and the next (only where both days have start and end times).
	for (let d = 0; d < 7; d++) {
		const a = days[d];
		const b = days[(d + 1) % 7];
		if (d === 6 || !a.range || !b.range || !a.hours || !b.hours) { continue; }
		const gap = (b.start + 1440 - a.end) / 60;
		if (gap < ln.gap.hours) { f.push({ level: 'warn', he: `בין ${name(a)} ל${name(b)} יש ${nsR2(Math.max(0, gap))} שעות מנוחה בלבד: ${ln.gap.he}`, section: ln.gap.section, url: ln.law_url }); }
	}
	if (p.brk < ln.break.minutes && days.some((d) => d.hours >= ln.break.min_day)) { f.push({ level: 'info', he: `${p.brk ? `ההפסקה שהוזנה (${p.brk} דקות) קצרה מ-${ln.break.minutes}` : 'לא הוזנה הפסקה'}: ${ln.break.he}`, section: ln.break.section, url: ln.law_url }); }
	// A shift that starts the day before the weekly rest and runs past midnight is counted on the day it starts; the
	// hours after midnight fall on the rest day, where s.17 pays 150% if they were inside the worker's 36-hour rest.
	const into = days.find((d) => d.eveOfRest && !d.rest && d.range && d.hours && d.end > 1440);
	if (into) { f.push({ level: 'info', he: `המשמרת של יום ${name(into)} נמשכת ${nsR2((into.end - 1440) / 60)} שעות לתוך יום ${NS_DAYS[(into.i + 1) % 7]}. היא נספרת כאן ביום שבו התחילה; שעות שהיו בתוך המנוחה השבועית מזכות ב-150%: אפשר להקליד אותן בשורת יום המנוחה`, section: ln.rest_pay.section, url: ln.law_url }); }
	const restDay = days.find((d) => d.rest && d.hours);
	if (restDay) {
		f.push({ level: 'warn', he: `עבודה ביום ${name(restDay)}, יום המנוחה השבועית: ${ln.rest.permit_he}; ${ln.rest.he}`, section: `${ln.rest.permit_section}; ${ln.rest.section}`, url: ln.law_url });
		if (restDay.restOver > 0) { f.push({ level: 'info', he: `${restDay.restOver} שעות ביום המנוחה מעבר ליום עבודה רגיל: ${ln.rest_pay.combined_he}`, section: ln.rest_pay.section, url: ln.law_url }); }
	}
	if (anyNight) { f.push({ level: 'info', he: ln.night_shift.he, section: ln.night_shift.section, url: ln.law_url }); }
	if (wk.ot > 0) { f.push({ level: 'info', he: `${ln.burden.he}${wk.ot > ln.burden.week ? ` (כאן ${wk.ot} שעות בשבוע: החזקה מכסה ${ln.burden.week} מהן)` : ''}`, section: ln.burden.section, url: ln.wage_law_url }); }
	if (p.youth) {
		const yt = ln.youth;
		const over = days.filter((d) => !d.rest && d.hours > yt.day);
		const night = days.some((d) => d.hours && (d.night || d.nightH > 0));
		const parts = [];
		if (over.length) { parts.push(`${over.map(name).join(', ')} מעל ${yt.day} שעות`); }
		if (wk.total - wk.rest > yt.week) { parts.push(`${nsR2(wk.total - wk.rest)} שעות בשבוע, מעל ${yt.week}`); }
		if (restDay) { parts.push('עבודה במנוחה השבועית'); }
		if (night) { parts.push('שעות בלילה'); }
		f.push({ level: parts.length ? 'danger' : 'info', he: `${parts.length ? `${parts.join('; ')}: ` : ''}${yt.he}`, section: yt.section, url: ln.youth_law_url });
	}
	return f;
}

/** A band for analytics: overtime hours in the week, never an amount. */
export function nsBand(r) {
	if (!r.ok) { return 'error'; }
	const h = r.week.ot + r.week.rest;
	return h === 0 ? '0' : h <= 5 ? '1-5' : h <= 10 ? '6-10' : h <= 16 ? '11-16' : '17+';
}
