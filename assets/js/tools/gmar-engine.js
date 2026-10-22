/**
 * The labor wave (22.10.2026): the final settlement (gmar-cheshbon, "what am I owed when I leave") on /gmar-cheshbon/.
 *
 * One set of answers feeds the sibling engines, and every money line is THEIR output, never a second implementation:
 *  - severance, section 14, the tax-exempt part, the notice length and the severance deadlines: pitzuyim-engine.js
 *    (compute, which uses the Ministry of Labor's notice table through noticeByMonth) and its deposit check (pzFundCheck);
 *  - vacation redemption: chufsha-engine.js (chRedemption; Annual Leave Law ss.3, 10, 13, 31);
 *  - recuperation owed for the period: havraa-engine.js (compute in mode 'period'), bundled in its own scope as HV;
 *  - the notice pay: the "regular wage" of the severance result (Advance Notice Law ss.1, 6, 7) for the days the law
 *    gives, the waived days or the missing days, with the same formula the severance tool uses for a month's notice;
 *  - the final salary: the month's pay for the days worked in the last month (Wage Protection Law s.9; s.10 for a wage by
 *    the hour or day), due with the month and late from the ninth day after (s.1, "the determining day").
 * Every top-level name here starts with "gm" or GM_, so the bundle (instrument, sim-handoff, dates, pitzuyim-engine,
 * chufsha-engine, havraa as HV, this file, the UI) has one scope without a collision.
 */
import { compute, pzFundCheck, RESIGN_CODES } from './pitzuyim-engine.js';
import { chRedemption, chWorkdays, chMonthEnd } from './chufsha-engine.js';
import * as HV from './havraa-engine.js';
import { addDays, addMonths, offRestDays, parseDate } from './dates.js';

const gmR2 = (n) => Math.round(n * 100) / 100;
const gmBlank = (v) => v === '' || v === undefined || v === null;
const gmHe = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
const gmN0 = (n) => Math.round(n).toLocaleString('en-US');
const gmN2 = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: Number(n) % 1 ? 2 : 0, maximumFractionDigits: 2 });
/** 5 שנים ו-7 חודשים (and the days when there are no whole months). */
export const gmSpanHe = (s) => `${s.y ? `${s.y === 1 ? 'שנה' : `${s.y} שנים`}` : ''}${s.y && s.m ? ' ו-' : ''}${s.m ? `${s.m === 1 ? 'חודש' : `${s.m} חודשים`}` : ''}${s.days ? `${s.y || s.m ? ' ו-' : ''}${s.days === 1 ? 'יום' : `${s.days} ימים`}` : ''}`;

export const GM_REASONS = ['fired', 'resign'].concat(RESIGN_CODES);

/** The answers the instrument asks, and their defaults (the example). */
export const GM_DEFAULT = {
	payType: 'monthly', salary: 12000, hourly: '', hours: '', jobPct: 100, week: 5,
	start: '2021-03-01', end: '2026-09-30', reason: 'fired', groundOk: false,
	s14: 'partial', noticeDate: '2026-08-31', noticeMode: 'worked',
	vacMode: 'compute', vacUsed: 30, vacBalance: '', hvPaid: 'years', hvAmount: '',
	lastDays: '', lastHours: '', fundBal: '', asOf: '2026-10-22',
};

/**
 * The final month: the work days of the month by the reader's week (Sunday first), the days worked up to the last day,
 * and the pay for them. Monthly: the month's salary × the days worked ÷ the month's work days, never above the salary;
 * hourly: the rate × the hours of the last month (by default the average hours in the same proportion). The law sets the
 * due day, not a method for a part of a month: a payslip that counts calendar days gives a slightly different figure.
 */
export function gmLastMonth(input, base) {
	const end = input.end;
	const monthStart = `${end.slice(0, 7)}-01`;
	const from = input.start > monthStart ? input.start : monthStart;
	const week = Number(input.week) === 6 ? 6 : 5;
	const sched = chWorkdays(monthStart, chMonthEnd(end), week);
	const byCal = chWorkdays(from, end, week);
	const worked = gmBlank(input.lastDays) ? byCal : Number(input.lastDays);
	const full = from === monthStart && end === chMonthEnd(end) && worked >= sched;
	if (input.payType === 'hourly') {
		const hours = gmBlank(input.lastHours) ? gmR2((Number(input.hours) * worked) / sched) : Number(input.lastHours);
		return { monthStart, from, sched, worked, byCal, full, hours, amount: gmR2(Number(input.hourly) * hours), base };
	}
	const salary = Number(input.salary);
	return { monthStart, from, sched, worked, byCal, full, hours: null, amount: gmR2(Math.min(salary, (salary * worked) / sched)), base };
}

/**
 * The notice line from the severance result r: the law's notice ("regular wage" for the days of ss.3-4: a month = the
 * month's regular wage; days = the wage × days ÷ 30, as the severance tool computes it), and who owes what:
 *  dismissal / fixed term: the employer pays the waived days (s.6(א)) or the days not given (s.7(א));
 *  resignation: the employer pays the days it waived (s.6(ב)); a worker who stopped before the end owes the days (s.7(ב)).
 */
export function gmNotice(sv, r) {
	const full = r.notice.month ? r.base : gmR2((r.base * r.notice.days) / 30);
	const fixedTerm = r.reason === 'term';
	const resigned = r.reason !== 'fired' && !fixedTerm;
	const daysPay = (d) => gmR2(Math.min(full, (r.base * d) / 30));
	const out = { full, days: 0, amount: 0, bucket: 'employer', section: '', mode: r.noticeMode, resigned, fixedTerm };
	if (fixedTerm) { return Object.assign(out, { section: 'סעיף 9 לחוק פיצויי פיטורים', kind: 'term' }); }
	if (r.noticeMode === 'none') {
		return Object.assign(out, { amount: resigned ? -full : full, bucket: resigned ? 'offset' : 'employer', section: resigned ? 'סעיף 7(ב)' : 'סעיף 7(א)', kind: 'none' });
	}
	if (r.noticeMode === 'paid') {
		return Object.assign(out, { days: r.short, amount: r.short > 0 ? daysPay(r.short) : 0, section: resigned ? 'סעיף 6(ב)' : 'סעיף 6(א)', kind: 'waived' });
	}
	if (r.short > 0) {
		return Object.assign(out, { days: r.short, amount: resigned ? -daysPay(r.short) : daysPay(r.short), bucket: resigned ? 'offset' : 'employer', section: resigned ? 'סעיף 7(ב)' : 'סעיף 7(א)', kind: 'short' });
	}
	return Object.assign(out, { section: resigned ? 'סעיף 5' : 'סעיפים 3-4', kind: 'worked' });
}

/**
 * input = GM_DEFAULT's keys: payType, salary | hourly + hours, jobPct, week (5|6), start, end (the last day of work),
 * reason ('fired' | 'resign' | one of RESIGN_CODES), groundOk (the conditions of the resignation ground hold), s14
 * ('none'|'partial'|'full'), noticeDate, noticeMode ('worked'|'paid' = the employer waived the work|'none'), vacMode
 * ('compute' = the law's days minus vacUsed | 'balance' = vacBalance from the payslip), hvPaid ('none' | 'years' = every
 * complete work year was paid | 'amount' = hvAmount), lastDays (work days in the last month; '' = by the calendar),
 * lastHours (hourly: hours in the last month), fundBal (the severance balance on the fund's report; optional), asOf.
 */
export function gmCompute(registry, input) {
	const i = Object.assign({}, GM_DEFAULT, input || {});
	const sv = registry.severance;
	const lg = registry.labor_gmar;
	const lc = registry.labor_chufsha;
	const errors = [];
	const start = parseDate(i.start);
	const end = parseDate(i.end);
	const asOf = parseDate(i.asOf) || registry.checked_on;
	const payType = i.payType === 'hourly' ? 'hourly' : 'monthly';
	const reason = GM_REASONS.includes(i.reason) ? i.reason : 'fired';
	const s14 = ['partial', 'full'].includes(i.s14) ? i.s14 : 'none';
	const noticeMode = ['paid', 'none'].includes(i.noticeMode) ? i.noticeMode : 'worked';
	const week = Number(i.week) === 6 ? 6 : 5;
	const jobPct = gmBlank(i.jobPct) ? 100 : Number(i.jobPct);
	// The severance engine checks the dates, the pay, the scope and the notice day; its messages are the instrument's.
	const pin = {
		payType, salary: i.salary, hourly: i.hourly, hours: i.hours, jobPct, start: i.start, end: i.end, reason,
		s14, noticeDate: noticeMode === 'none' ? '' : i.noticeDate, noticeMode, groundOk: i.groundOk === true, parentOk: i.groundOk === true,
	};
	const r = compute(registry, pin);
	if (!r.ok) { errors.push(...r.errors); }
	if (noticeMode !== 'none' && gmBlank(i.noticeDate)) { errors.push({ field: 'noticeDate', he: 'יום מסירת ההודעה: תאריך מלא, או "לא ניתנה הודעה"' }); }
	if (end && start && end >= start) {
		const monthStart = `${end.slice(0, 7)}-01`;
		const sched = chWorkdays(monthStart, chMonthEnd(end), week);
		if (!gmBlank(i.lastDays) && !(Number.isInteger(Number(i.lastDays)) && Number(i.lastDays) >= 0 && Number(i.lastDays) <= sched)) { errors.push({ field: 'lastDays', he: `ימי עבודה בחודש האחרון: מספר שלם בין 0 ל-${sched} (ימי העבודה בחודש לפי שבוע של ${week} ימים)` }); }
	}
	if (payType === 'hourly' && !gmBlank(i.lastHours) && !(Number(i.lastHours) >= 0 && Number(i.lastHours) <= 400)) { errors.push({ field: 'lastHours', he: 'שעות בחודש האחרון: 0 עד 400' }); }
	if (i.vacMode === 'balance' && gmBlank(i.vacBalance)) { errors.push({ field: 'vacBalance', he: 'יתרת ימי החופשה מהתלוש: מספר, או לבחור "לחשב לפי החוק"' }); }
	if (i.hvPaid === 'amount' && !(Number(i.hvAmount) >= 0 && !gmBlank(i.hvAmount))) { errors.push({ field: 'hvAmount', he: 'כמה שולם כדמי הבראה: סכום, 0 או יותר' }); }
	if (!gmBlank(i.fundBal) && !(Number(i.fundBal) >= 0 && Number(i.fundBal) < 1e8)) { errors.push({ field: 'fundBal', he: 'יתרת הפיצויים בקופה: מספר, 0 או ריק' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = r.flags.slice();
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const lines = [];
	const line = (o) => lines.push(Object.assign({ basis: '', section: '', url: '', amount: 0, bucket: 'employer', note: '' }, o));

	// 1. The final salary.
	const last = gmLastMonth({ start, end, week, payType, salary: i.salary, hourly: i.hourly, hours: i.hours, lastDays: i.lastDays, lastHours: i.lastHours }, r.base);
	const dueSalary = chMonthEnd(end);
	const lateSalary = addDays(dueSalary, lc.wage.late_day);
	line({
		code: 'salary', he: 'שכר החודש האחרון',
		basis: payType === 'hourly' ? `${gmR2(last.hours)} שעות × ${i.hourly} ₪` : last.full ? 'חודש מלא' : `${gmN0(Number(i.salary))} ₪ × ${last.worked} ÷ ${last.sched} ימי עבודה בחודש`,
		section: payType === 'hourly' ? `${lg.wage.hourly_section} לחוק הגנת השכר` : `${lc.wage.due_section} לחוק הגנת השכר`, url: lc.wage.url, amount: last.amount,
	});
	if (r.floored) { add('warn', 'floor', 'השכר שהוזן נמוך משכר המינימום: הפיצויים ותקופת ההודעה מחושבים לפי שכר המינימום (סעיף 13ב לחוק פיצויי פיטורים), ושכר החודש האחרון כאן הוא לפי השכר שהוזן. על ההפרש בשכר עצמו אפשר לתבוע.', 'סעיף 13ב', sv.law_url); }

	// 2. The notice.
	const nt = gmNotice(sv, r);
	const nLen = r.notice.month ? 'חודש' : `${String(r.notice.days).replace('.5', '½')} ימים`;
	const nBasis = {
		term: 'חוזה לתקופה קצובה: מועד הסיום ידוע, ואין חוב הודעה לאף צד',
		none: `לא ניתנה הודעה: ${nLen} של שכר רגיל (${gmN0(r.base)} ₪ לחודש)`,
		waived: nt.days > 0 ? `המעסיק ויתר על העבודה: ${nt.days} ימים עד ${r.noticeEnd ? gmHe(r.noticeEnd) : ''} בשכר רגיל` : 'ההודעה עד היום האחרון: משולמת כשכר רגיל',
		short: `${nt.days} ימים חסרים עד סוף ההודעה (${r.noticeEnd ? gmHe(r.noticeEnd) : ''})`,
		worked: `ההודעה (${nLen}) עבדה עד היום האחרון: שולמה כשכר`,
	}[nt.kind];
	line({
		code: 'notice', he: nt.bucket === 'offset' ? 'הודעה מוקדמת שלא ניתנה: חוב לעובד כלפי המעסיק' : nt.kind === 'none' ? 'פיצוי על הודעה מוקדמת שלא ניתנה' : 'הודעה מוקדמת: תשלום במקום עבודה',
		basis: nBasis, section: `${nt.section}${nt.kind === 'term' ? '' : ' לחוק הודעה מוקדמת'}`, url: sv.notice.url, amount: nt.amount, bucket: nt.bucket,
		note: nt.bucket === 'offset' ? `המעסיק עשוי לקזז את הסכום מהשכר האחרון (${lg.wage.deduct_last_section} לחוק הגנת השכר) ומהפיצויים (${lg.wage.offset_section})` : '',
	});

	// 3. Severance and the fund (pitzuyim-engine compute + pzFundCheck).
	const fc = pzFundCheck(registry, r, { fundBal: i.fundBal });
	const extra = fc.ok && fc.gap ? fc.gap.extra : 0;
	const fundBal = gmBlank(i.fundBal) ? null : Number(i.fundBal);
	const sevYears = `${gmN0(r.base)} ₪ × ${gmSpanHe(r.span)}`;
	if (r.entitled) {
		if (s14 === 'none') {
			line({ code: 'severance', he: 'פיצויי פיטורים מהמעסיק', basis: sevYears, section: 'סעיפים 1 ו-12 לחוק פיצויי פיטורים', url: sv.law_url, amount: gmR2(r.employer + extra) });
		} else {
			line({ code: 'severance', he: 'פיצויי פיטורים: ההשלמה מהמעסיק', basis: `${sevYears} = ${gmN0(r.severance)} ₪, פחות ${r.s14Pct}% שהקופה מכסה`, section: 'סעיף 14 לחוק פיצויי פיטורים', url: sv.approval.url, amount: gmR2(r.employer + extra) });
			line({
				code: 'fund', he: 'פיצויים מהקופה (סעיף 14)', bucket: 'fund',
				basis: fundBal !== null ? 'היתרה שהוזנה מהדוח של הקופה' : `${r.s14Pct}% מהפיצויים לפי השכר הקובע; היתרה בקופה עצמה יכולה להיות שונה`,
				section: 'סעיף 14 והאישור הכללי', url: sv.approval.url, amount: fundBal !== null ? fundBal : gmR2(r.fundReplaces - extra),
			});
		}
	} else {
		line({ code: 'severance', he: 'פיצויי פיטורים מהמעסיק', basis: r.reason === 'resign' ? 'התפטרות רגילה: אין זכות לפיצויים מהמעסיק' : !r.yearOk ? 'פחות משנת עבודה' : 'עילת ההתפטרות לא אושרה בטופס', section: r.reason === 'resign' ? 'סעיף 1 לחוק פיצויי פיטורים' : !r.yearOk ? 'סעיף 1(א)' : (r.reasonRow ? r.reasonRow.section : ''), url: sv.law_url, amount: 0 });
		if (s14 !== 'none') {
			line({ code: 'fund', he: 'הכספים בקופה לפיצויים (שייכים לעובד)', bucket: 'fund', basis: fundBal !== null ? 'היתרה שהוזנה מהדוח של הקופה' : 'לפי הדוח השנתי של הקופה: הסכום לא ידוע כאן', section: 'סעיף 14 לחוק פיצויי פיטורים', url: sv.approval.url, amount: fundBal });
		}
	}

	// 4. Vacation redemption (chufsha-engine).
	const vin = { start, end, week, perWeek: '', regime: 'order', payType, salary: i.salary, hourly: i.hourly, hours: i.hours, dayValue: '', mode: i.vacMode === 'balance' ? 'balance' : 'compute', used: i.vacUsed, balance: i.vacBalance, workedEnd: '', scope: 'window' };
	const vac = chRedemption(registry, vin);
	if (vac.ok) {
		line({
			code: 'vacation', he: 'פדיון חופשה שנתית',
			basis: vac.mode === 'temp' ? `פחות מ-75 ימים רצופים: ${vac.tempPct}% מהשכר במקום ימים` : `${vac.days} ימים × ${gmN2(vac.dayValue)} ₪ ליום${vac.mode === 'balance' ? ' (היתרה בתלוש)' : ''}`,
			section: `${vac.sections.redeem} לחוק חופשה שנתית`, url: lc.law.url, amount: vac.value,
		});
	} else {
		line({ code: 'vacation', he: 'פדיון חופשה שנתית', basis: vac.errors.map((e) => e.he).join(' '), section: `${lc.law.sections.redeem} לחוק חופשה שנתית`, url: lc.law.url, amount: null });
	}

	// 5. Recuperation owed for the period (havraa-engine, mode 'period'); the price year must be published.
	const hvAsOf = end > asOf ? end : asOf;
	const hvIn = { mode: 'period', sector: 'private', start, end, asOf: hvAsOf, jobPct, paid: 0, leaves: [], lowPay: false, applyDeduction: true };
	let hv = HV.compute(registry, hvIn);
	let hvPaidSum = 0;
	if (hv.ok && hv.state !== 'not_eligible') {
		const rows = hv.rows.filter((x) => !x.barred);
		const lastRow = rows[rows.length - 1];
		if (i.hvPaid === 'years') { hvPaidSum = gmR2(hv.net - (lastRow && lastRow.fraction < 1 ? lastRow.net : 0)); }
		if (i.hvPaid === 'amount') { hvPaidSum = Number(i.hvAmount); }
		if (hvPaidSum > 0) { hv = HV.compute(registry, Object.assign({}, hvIn, { paid: hvPaidSum })); }
	}
	if (hv.ok) {
		const lastRow = hv.rows && hv.rows.length ? hv.rows[hv.rows.length - 1] : null;
		const basis = hv.state === 'not_eligible' ? 'פחות משנת עבודה: אין זכות לדמי הבראה' : i.hvPaid === 'years'
			? (lastRow && lastRow.fraction < 1 ? `השנה האחרונה, ${gmR2(lastRow.daysDue)} ימים × ${gmN2(lastRow.price)} ₪` : 'כל שנות העבודה המלאות שולמו')
			: `${gmR2(hv.daysDue)} ימים בשווי ${gmN0(hv.net)} ₪${hv.paid ? `, פחות ${gmN0(hv.paid)} ₪ ששולמו` : ''}`;
		line({ code: 'havraa', he: 'דמי הבראה', basis, section: 'צו ההרחבה, סעיף 5', url: registry.havraa.order_url, amount: hv.state === 'not_eligible' ? 0 : hv.gap });
	} else {
		line({ code: 'havraa', he: 'דמי הבראה', basis: hv.errors.map((e) => e.he).join(' '), section: 'צו ההרחבה, סעיף 5', url: registry.havraa.order_url, amount: null });
	}

	// 6. What is not paid out: sick days.
	line({ code: 'sick', he: 'ימי מחלה שלא נוצלו', basis: 'משולמים רק בעד היעדרות עקב מחלה; אין פדיון לפי החוק', section: `${lg.sick.absence_section} לחוק דמי מחלה`, url: lg.sick.url, amount: 0, bucket: 'none', note: lg.sick.agreed_he });

	// Totals.
	const sum = (b) => gmR2(lines.filter((x) => x.bucket === b && x.amount !== null).reduce((t, x) => t + x.amount, 0));
	const employerGross = sum('employer');
	const offset = sum('offset');
	const employerNow = gmR2(employerGross + offset);
	const fund = sum('fund');
	const fundUnknown = lines.some((x) => x.bucket === 'fund' && x.amount === null);
	const total = gmR2(employerNow + fund);
	const missing = lines.filter((x) => x.amount === null).map((x) => x.code);

	// Flags of the composition.
	if (fc.ok) { for (const f of fc.flags) { if (['gap', 'fund', 'cap'].includes(f.code)) { flags.push(Object.assign({ url: registry.labor_pitzuyim.order.url }, f)); } } }
	if (vac.ok) { for (const f of vac.flags) { if (['used', 'older', 'temp'].includes(f.code)) { add('info', `vac_${f.code}`, f.he, lc.law.sections.redeem, lc.law.url); } } }
	if (hv.ok) { for (const f of (hv.flags || []).filter((x) => !(i.hvPaid === 'years' && x.code === 'deduction'))) { add('info', `hv_${f.code}`, f.he, 'צו ההרחבה', registry.havraa.order_url); } }
	const ground = RESIGN_CODES.includes(r.reason) && r.reason !== 'term' && r.entitled;
	if (ground) { add('warn', 'demand', `${lg.wage.demand_he}.`, lg.wage.demand_section, lg.wage.url); }
	if (r.entitled && s14 !== 'none') { add('info', 'fund_notice', `${lg.wage.fund_notice_he}.`, lg.wage.fund_notice_section, lg.wage.url); }
	if (payType === 'hourly') { add('info', 'hourly_due', `${lg.wage.hourly_he}.`, lg.wage.hourly_section, lg.wage.url); }
	if (!last.full && payType === 'monthly' && last.worked < last.sched) { add('info', 'partial_month', `החודש האחרון חושב כחלק יחסי: ${last.worked} מתוך ${last.sched} ימי עבודה בחודש לפי שבוע של ${week} ימים. אם בתלוש מחושב לפי ימים קלנדריים, הסכום שונה מעט; הקלידו את ימי העבודה בפועל אם הם אחרים.`, lc.wage.due_section, lc.wage.url); }

	// The dates the law sets.
	const events = [];
	const ev = (key, date, he, section, url) => events.push({ key, date, he, section, url });
	ev('last', end, 'היום האחרון בעבודה', 'סעיף 2(ג) לחוק הודעה מוקדמת', sv.notice.url);
	ev('salary_due', dueSalary, payType === 'hourly' ? 'שכר החודש האחרון ופדיון החופשה: לכל המאוחר עם תום החודש (שכר שעתי: סעיף 10 יכול להקדים)' : 'שכר החודש האחרון ופדיון החופשה משולמים עם תום החודש', `${lc.wage.due_section} לחוק הגנת השכר; ${lc.law.sections.as_wage} לחוק חופשה שנתית`, lc.wage.url);
	ev('salary_late', lateSalary, 'מהיום הזה שכר שלא שולם הוא שכר מולן, ונוסף לו פיצוי הלנה', `${lc.wage.late_section} לחוק הגנת השכר`, lc.wage.url);
	for (const d of r.deadlines) {
		if (d.key === 'limit') { continue; }
		const he = d.key === 'due' && ground ? `${d.he}; בהתפטרות שדינה כפיטורים: רק אחרי דרישה בכתב שמציינת את העילה (${lg.wage.demand_section})` : d.he;
		ev(d.key, d.date, he, d.section, d.url);
	}
	if (r.entitled && s14 !== 'none') { ev('fund_notice', offRestDays(addDays(end, lg.wage.fund_notice_days)), `המעסיק מודיע לקופה בכתב שהוא מסכים לשחרר את הפיצויים (תוך ${lg.wage.fund_notice_days} ימים מהמועד לתשלום)`, `${lg.wage.fund_notice_section} לחוק הגנת השכר`, lg.wage.url); }
	ev('form161', end, 'טופס 161: המעסיק מדווח לרשות המסים על הפרישה במועד הפרישה, ומוסר עותק לעובד', 'רשות המסים, הודעה על פרישה מעבודה', lg.form_161.url);
	if (vac.ok && vac.limitation) { ev('vac_limit', vac.limitation, 'התיישנות תביעה לפי חוק חופשה שנתית (פדיון חופשה): 3 שנים', `${vac.sections.limitation} לחוק חופשה שנתית`, lc.law.url); }
	ev('limit', offRestDays(addMonths(end, 12 * sv.limitation.years)), `התיישנות תביעה לשכר, להודעה מוקדמת, לדמי הבראה${r.entitled ? ' ולפיצויים' : ''}: ${sv.limitation.years} שנים`, `${sv.limitation.section} לחוק ההתיישנות`, sv.limitation.url);
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	return {
		ok: true, input: i, payType, start, end, asOf, reason, s14, noticeMode, week, jobPct,
		r, fc, vac, hv, hvPaidSum, last, nt, lines, employerGross, offset, employerNow, fund, fundUnknown, total, missing,
		tax: { exempt: r.exempt, exemptCap: r.exemptCap, taxable: r.taxable, note: r.taxNote, ceiling: sv.tax.ceiling, section: sv.tax.section },
		events, flags, dueSalary, lateSalary,
	};
}

/** A band for analytics (never an amount). */
export function gmBand(g) {
	if (!g || !g.ok) { return 'error'; }
	const t = g.total;
	return t <= 0 ? '0' : t < 20000 ? '1-20k' : t < 60000 ? '20-60k' : t < 150000 ? '60-150k' : '150k+';
}
