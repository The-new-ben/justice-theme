/**
 * The road-accident and personal-injury wave (22.10.2026, HAD-591): the work-injury journey (teunat-avoda,
 * /work-accident-guide/) under chapter 5 of the National Insurance Law [Consolidated Version] 1995.
 *
 * Dependency-free ES module on top of dates.js. Every number comes from the registry: reg.injury_avoda (the sections, the
 * Institute's 2026 maximums, the deadlines, the 1956 degree regulations) and reg.rights_btl (the basic amount and the
 * average wage of 2026). Read the dataset module tools/justice_tools_injury_avoda.py for the source of each value.
 *  - Is it a work accident: s.79 (during and because of work), the presumptions of s.80 (on the way, the meal break, a
 *    rescue, another person, the workers' committee), and the exceptions: a substantial stop or deviation on the way
 *    (s.81(a); escorting a child or the morning prayer is not one, s.81(b)), gross negligence on the way (s.81(a): unless 4
 *    weeks of incapacity, disability or death), negligence against instructions (s.82: unless 10 days, disability or death),
 *    a self-employed person not registered (s.77(a)). Flags with sections, never a verdict: the claims officer decides.
 *  - The injury allowance: the regular wage = the quarter's income ÷ 90 (s.98(a)); 75% of it a day, at most 75% of the
 *    basic amount × 5 ÷ 30 (s.97(a): 1,314.25 from 1.1.2026); at most 13 weeks, 91 days (s.92(b)); the injury day is
 *    paid by the employer (s.93(a)); the first two days after it only when the incapacity is 12 days or more (s.93(b));
 *    the first 12 entitled days are repaid by the employer (s.94(b)(1)) and not paid at all to a self-employed person
 *    (s.94(b)(2)); a reduced allowance for partial incapacity: 1/8 of the day's allowance per hour, up to 8 (s.102).
 *  - The permanent disability: below 9% nothing; a stable degree of 9% to under 20% a grant of 43 monthly pensions
 *    (s.107(a)); a stable degree of 20% or more, or a temporary one of 9% or more, a monthly pension (s.104); the 100%
 *    pension = the day's allowance × 30 (s.105(a)), 39,428 at most from 1.1.2026; a lower degree its share (s.106); reg. 15
 *    of the 1956 regulations as the committee applied it (up to half more, 19% at most when the degree is under 20%),
 *    the rounding of a pension degree up to a whole number (reg. 19a); the increased grant for an injury before 21
 *    (s.107(b), as if the income were the average wage).
 *  - The dates: the claim (12 months, s.296(a) and the Institute's pages), the appeal to the appeals committee (30 days,
 *    reg. 27(a); its reasons 30 more, reg. 28), aggravation (6 months, reg. 36(a)), reg. 17 (12 to 60 months), the labor
 *    court (60 days on the appeals committee, 12 months on a claims officer's decision; the claims committee 6 months).
 *    A deadline that falls on a rest day moves to the next day (Interpretation Law s.10(c)).
 * Every top-level helper starts with "av": the bundle concatenates this file with instrument.js, dates.js and sim-handoff.js.
 */

import { addDays, addMonths, parseDate, offRestDays } from './dates.js';

const avR2 = (n) => Math.round(n * 100) / 100;
const avBlank = (v) => v === '' || v === undefined || v === null;
const avNum = (v) => (avBlank(v) ? null : Number(String(v).replace(/[,\s₪]/g, '')));
export const avWhole = (x) => Math.abs(x - Math.round(x)) < 1e-9;
export const AV_KINDS = ['employee', 'self'];
export const AV_WHERE = ['work', 'way', 'break', 'rescue', 'other_person', 'committee'];
export const AV_ISSUES = ['deviation', 'devok', 'gross', 'breach', 'unregistered'];

/** The maximum daily allowance by the law's own formula (s.97(a)): 75% of the basic amount × 5 ÷ 30. */
export function avMaxDaily(reg) {
	const a = reg.injury_avoda.allowance;
	return avR2(reg.rights_btl.basic_amount.b1 * a.cap_multiple * a.cap_pct / 100 / a.cap_divisor);
}

/** The day's injury allowance from the quarter's income (s.97(a), s.98(a)), capped at the published maximum. */
export function avDaily(reg, quarter) {
	const a = reg.injury_avoda.allowance;
	const base = quarter / a.quarter_days;
	const raw = base * a.pct / 100;
	const capped = raw > a.max_daily;
	return { base: avR2(base), raw: avR2(raw), daily: capped ? a.max_daily : avR2(raw), capped };
}

/**
 * The days the allowance is paid for. days = the days of incapacity after the injury day (the medical certificates).
 * Within the 91 days (s.92(b)); the first two only when the incapacity is 12 days or more (s.93(b)); for a self-employed
 * person the first 12 entitled days are not paid (s.94(b)(2)). The day numbers count from the day after the injury.
 */
export function avPaidDays(reg, kind, days) {
	const a = reg.injury_avoda.allowance;
	const within = Math.min(days, a.max_days);
	const waiting = days < a.waiting_unless_days ? Math.min(a.waiting_days, within) : 0;
	const entitled = within - waiting;
	const selfFirst = kind === 'self' ? Math.min(a.first_period_days, entitled) : 0;
	const paid = entitled - selfFirst;
	return { within, waiting, entitled, selfFirst, paid, over: Math.max(0, days - a.max_days), first: paid ? waiting + selfFirst + 1 : 0, last: paid ? within : 0 };
}

/**
 * The degree that counts: the committee's degree by the criteria, plus reg. 15 when the committee applied it to a stable
 * degree (share = the increase as a percent of the degree, up to 50; under 20% the result stays at 19% at most), then the
 * rounding of a degree that entitles to a pension (reg. 19a). The kind: none / grant / pension (s.104).
 */
export function avDegree(reg, base, stable, share) {
	const R = reg.injury_avoda.regs.reg15;
	const D = reg.injury_avoda.disability;
	let value = base;
	let capped = false;
	const use = stable && share > 0;
	if (use) {
		const raw = avR2(base * (1 + share / 100));
		const cap = base < R.grant_cap_below ? R.grant_cap : 100;
		capped = raw > cap;
		value = capped ? cap : raw;
	}
	value = avR2(value);
	const pension = stable ? value >= D.pension_min : value >= D.temp_min;
	const kind = value < (stable ? D.grant_min : D.temp_min) ? 'none' : pension ? 'pension' : 'grant';
	const final = pension && !avWhole(value) ? Math.ceil(value) : value;
	return { base, stable, share: use ? share : 0, beforeRound: value, final, rounded: final !== value, capped, increase: avR2(value - base), kind };
}

/** The monthly pension for 100% (s.105(a)): the day's allowance × 30; at the daily maximum, the published monthly maximum. */
export function avFull(reg, daily) {
	const D = reg.injury_avoda.disability;
	if (daily.capped || daily.daily >= reg.injury_avoda.allowance.max_daily) { return D.max_monthly; }
	return Math.min(avR2(daily.daily * D.full_days), D.max_monthly);
}

/**
 * input = { kind ('employee'|'self'), injury (ISO), age, wage (monthly gross, the 3 months' average), quarter (the 3 months'
 *           total, optional, wins over wage), days (incapacity days after the injury day), partDays, partHours,
 *           where (AV_WHERE), road (bool), issues (AV_ISSUES[]), degree (the committee's %), stable (bool), reg15 (the
 *           increase the committee applied, % of the degree), decision (ISO, the committee decision delivered),
 *           appealDecision (ISO, the appeals committee decision delivered), rejection (ISO, a claims officer's rejection
 *           letter), tempTo (ISO, the end of a temporary degree), claimDate (ISO, the disability claim filed) }
 */
export function compute(reg, input) {
	const av = reg.injury_avoda;
	const A = av.allowance;
	const D = av.disability;
	const G = av.regs;
	const L = av.law.sections;
	const T = av.deadlines;
	const errors = [];
	const kind = input.kind === 'self' ? 'self' : 'employee';
	const injury = parseDate(input.injury);
	if (!injury) { errors.push({ field: 'injury', he: 'יום הפגיעה: תאריך מלא, לדוגמה 2.3.2026' }); }
	const age = avNum(input.age);
	if (age !== null && !(Number.isInteger(age) && age >= 13 && age <= 99)) { errors.push({ field: 'age', he: 'הגיל ביום הפגיעה: מספר שלם, 13 עד 99, או ריק' }); }
	const wage = avNum(input.wage);
	if (wage !== null && !(wage > 0 && wage < 1e7)) { errors.push({ field: 'wage', he: 'השכר החודשי: מספר חיובי, או ריק' }); }
	const quarterIn = avNum(input.quarter);
	if (quarterIn !== null && !(quarterIn > 0 && quarterIn < 3e7)) { errors.push({ field: 'quarter', he: 'ההכנסה ב-3 החודשים: מספר חיובי, או ריק' }); }
	const days = avBlank(input.days) ? 0 : Number(input.days);
	if (!(Number.isInteger(days) && days >= 0 && days <= 3650)) { errors.push({ field: 'days', he: 'ימי אי-כושר: מספר שלם, 0 עד 3650' }); }
	const partDays = avBlank(input.partDays) ? 0 : Number(input.partDays);
	const partHours = avBlank(input.partHours) ? 0 : Number(input.partHours);
	if (!(Number.isInteger(partDays) && partDays >= 0 && partDays <= 365)) { errors.push({ field: 'partDays', he: 'ימי אי-כושר חלקי: מספר שלם, או ריק' }); }
	if (partDays > 0 && !(partHours > 0 && partHours <= 24)) { errors.push({ field: 'partHours', he: 'שעות אי-כושר ביום: מספר חיובי' }); }
	const degree = avNum(input.degree);
	if (degree !== null && !(degree >= 0 && degree <= 100)) { errors.push({ field: 'degree', he: 'אחוז הנכות: 0 עד 100, או ריק' }); }
	const share = avNum(input.reg15);
	if (share !== null && !(share >= 0 && share <= G.reg15.max_share)) { errors.push({ field: 'reg15', he: `תקנה 15: הגדלה של עד ${G.reg15.max_share}% מהדרגה (עד מחצית)` }); }
	const dateOf = (field, label) => {
		if (avBlank(input[field])) { return null; }
		const d = parseDate(input[field]);
		if (!d) { errors.push({ field, he: `${label}: תאריך מלא, או ריק` }); }
		return d;
	};
	const decision = dateOf('decision', 'יום קבלת החלטת הוועדה הרפואית');
	const appealDecision = dateOf('appealDecision', 'יום קבלת החלטת הוועדה לעררים');
	const rejection = dateOf('rejection', 'תאריך מכתב הדחייה');
	const tempTo = dateOf('tempTo', 'סוף הדרגה הזמנית');
	const claimDate = dateOf('claimDate', 'יום הגשת התביעה לנכות');
	if (injury && decision && decision < injury) { errors.push({ field: 'decision', he: 'החלטת הוועדה לפני יום הפגיעה' }); }
	if (decision && appealDecision && appealDecision < decision) { errors.push({ field: 'appealDecision', he: 'החלטת הוועדה לעררים לפני החלטת הוועדה הרפואית' }); }
	if (injury && claimDate && claimDate < injury) { errors.push({ field: 'claimDate', he: 'התביעה לפני יום הפגיעה' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const where = AV_WHERE.includes(input.where) ? input.where : 'work';
	const issues = Array.isArray(input.issues) ? input.issues.filter((x) => AV_ISSUES.includes(x)) : [];
	const stable = input.stable !== false && input.stable !== 'temp';
	const road = Boolean(input.road);

	// 1. Is it a work accident: the presumption, then the exceptions the law states, each with its threshold.
	const circ = av.accident.circumstances.find((c) => c.code === where);
	const acc = { where, circ, status: 'yes', reasons: [] };
	const no = (code, he, section) => { acc.status = 'no'; acc.reasons.push({ code, he, section }); add('danger', code, he, section, av.law.url); };
	if (kind === 'self' && (where === 'break' || where === 'committee')) { acc.status = 'check'; add('warn', 'employee_only', `החזקה של ${circ.section} נכתבה למבוטח שהוא עובד שכיר; לעובד עצמאי בודקים לפי ההגדרה הכללית (${L.definitions}: תוך כדי העיסוק במשלח היד ועקב העיסוק בו).`, circ.section, av.law.url); }
	if (kind === 'self' && issues.includes('unregistered')) { no('unregistered', `${av.accident.self_registered.he} (${av.accident.self_registered.section}). ${av.accident.self_registered.btl_he}.`, av.accident.self_registered.section); }
	const dv = av.accident.deviation;
	if (where === 'way' && issues.includes('deviation')) {
		if (issues.includes('devok')) { add('ok', 'deviation_ok', `${dv.ok_he} (${dv.ok_section}).`, dv.ok_section, av.law.url); } else { no('deviation', `${dv.he} (${dv.section}).`, dv.section); }
	}
	const permanentDisability = degree !== null && degree > 0;
	const gr = av.accident.gross;
	if (where === 'way' && issues.includes('gross')) {
		if (days >= gr.min_days || permanentDisability) { add('info', 'gross_ok', `${gr.he}: ${days >= gr.min_days ? `כאן ${days} ימי אי-כושר, ${gr.min_days} לפחות` : 'כאן נקבעה נכות'}, ולכן החריג לא חל.`, gr.section, av.law.url); } else { no('gross', `${gr.he}: כאן ${days} ימי אי-כושר, פחות מ-${gr.min_days}.`, gr.section); }
	}
	const br = av.accident.breach;
	if (issues.includes('breach')) {
		if (days >= br.min_days || permanentDisability) { add('info', 'breach_ok', `${br.he}: ${days >= br.min_days ? `כאן ${days} ימי אי-כושר, ${br.min_days} לפחות` : 'כאן נקבעה נכות'}, ולכן החריג לא חל.`, br.section, av.law.url); } else { no('breach', `${br.he}: כאן ${days} ימי אי-כושר, פחות מ-${br.min_days}.`, br.section); }
	}
	if (acc.status === 'yes') { add('ok', 'presumption', `${circ.he}: לפי ${circ.section} התאונה נחשבת תאונת עבודה, אם לא הוכח אחרת. את ההחלטה נותן פקיד התביעות בביטוח הלאומי.`, circ.section, av.pages.what_is); }

	// 2. The injury allowance.
	const quarter = quarterIn !== null ? quarterIn : wage !== null ? avR2(wage * 3) : null;
	const daily = quarter !== null ? avDaily(reg, quarter) : null;
	const pd = avPaidDays(reg, kind, days);
	const allowance = daily ? avR2(daily.daily * pd.paid) : null;
	const partUse = Math.min(partDays, A.max_days);
	const partHoursUse = Math.min(partHours, A.partial_hours);
	// s.102 pays the reduced allowance "notwithstanding s.92" with its own 13 weeks (s.102(ג)); it does not say whether the
	// unpaid days of s.93(ב) (the 2 days after the injury when the incapacity is under 12 days) and of s.94(ב)(2) (a
	// self-employed person's first 12 entitled days) fall on reduced days too. When the full-incapacity days have not used
	// them up, the reduced allowance is shown as a range: `low` if those days are unpaid, `amount` if they are paid
	// (PR 170 review). Never one number the law does not state.
	let partial = null;
	if (partDays > 0) {
		const waitAll = days + partUse < A.waiting_unless_days ? A.waiting_days : 0;
		const waitLeft = Math.max(0, waitAll - pd.waiting);
		const selfLeft = kind === 'self' ? Math.max(0, A.first_period_days - pd.selfFirst) : 0;
		const unclear = Math.min(partUse, waitLeft + selfLeft);
		const perDay = daily ? avR2(daily.daily / A.partial_hours * partHoursUse) : null;
		partial = { days: partDays, used: partUse, hours: partHours, hoursUsed: partHoursUse, perDay, amount: perDay !== null ? avR2(perDay * partUse) : null,
			unclear, waitLeft, selfLeft, low: perDay !== null ? avR2(perDay * (partUse - unclear)) : null };
	}
	const allowanceEnd = injury ? addDays(injury, pd.within) : null;
	if (kind === 'employee') { add('info', 'injury_day', `${A.injury_day_he} (${A.injury_day_section}).`, A.injury_day_section, av.pages.ia_period); }
	if (days > 0 && days < A.waiting_unless_days) { add('info', 'waiting', `${days} ימי אי-כושר, פחות מ-${A.waiting_unless_days}: בעד ${pd.waiting === 1 ? 'היום הראשון' : 'שני הימים הראשונים'} שאחרי יום הפגיעה לא משולמים דמי פגיעה (${A.waiting_section}). ${A.waiting_btl_he}.`, A.waiting_section, av.pages.ia_period); }
	if (days === A.waiting_unless_days) { add('info', 'waiting_edge', `בדיוק ${days} ימי אי-כושר: לפי החוק ("${A.waiting_unless_days} ימים לפחות", ${A.waiting_section}) משולמים גם שני הימים הראשונים. דף הביטוח הלאומי כותב "יותר מ-${A.waiting_unless_days} יום"; החוק גובר, וכדאי לבדוק את ההחלטה.`, A.waiting_section, av.law.url); }
	if (kind === 'employee' && pd.entitled > 0) { add('info', 'first_period', `${A.first_period_he} (${A.first_period_section}).`, A.first_period_section, av.pages.ia_period); }
	if (kind === 'self') { add(pd.selfFirst ? 'warn' : 'info', 'self_first', `${A.self_first_he} (${A.self_first_section})${pd.selfFirst ? `: כאן ${pd.selfFirst} ימים לא משולמים` : ''}. ${A.self_base_he}.`, A.self_first_section, av.pages.ia_period); }
	if (pd.over > 0) { add('warn', 'over91', `${days} ימי אי-כושר: דמי פגיעה משולמים לכל היותר ${A.max_weeks} שבועות, ${A.max_days} ימים (${A.max_section}). אחרי היום ה-${A.max_days}, או כשנשארה נכות, מגישים תביעה לקביעת דרגת נכות מעבודה (${av.forms.disability.code}).${kind === 'self' ? ` לעצמאי: דף הביטוח הלאומי סופר ${A.max_days} ימים מהיום שאחרי הפגיעה ומנכה את ${A.first_period_days} הראשונים; אם כך, משולמים ${pd.paid} ימים.` : ''}`, A.max_section, av.pages.ia_period); }
	if (daily && daily.capped) { add('info', 'capped', `${A.pct}% מהשכר הרגיל (${daily.raw.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₪ ליום) גבוה מהמקסימום: דמי הפגיעה הם ${A.max_daily.toLocaleString('en-US', { minimumFractionDigits: 2 })} ₪ ליום (${A.section}, מ-${A.max_daily_from.split('-').reverse().map(Number).join('.')}).`, A.section, A.max_daily_url); }
	if (partial && partHours > A.partial_hours) { add('info', 'partial_hours', `דמי פגיעה מופחתים משולמים עד ${A.partial_hours} שעות ביום (${A.partial_section}): חושבו ${A.partial_hours} שעות.`, A.partial_section, av.pages.ia_rate); }
	if (partial && partDays > A.max_days) { add('info', 'partial_days', `דמי פגיעה מופחתים: לא יותר מ-${A.partial_max_weeks} שבועות בשל פגיעה אחת (${A.partial_section}(ג)): חושבו ${A.max_days} ימים.`, A.partial_section, av.law.url); }
	if (partial && partial.unclear > 0) {
		const which = [partial.waitLeft ? `${partial.waitLeft === 1 ? 'יום ההמתנה' : `${partial.waitLeft} ימי ההמתנה`} של ${A.waiting_section} (אי-הכושר כולו קצר מ-${A.waiting_unless_days} ימים)` : '', partial.selfLeft ? `${partial.selfLeft} הימים שנותרו מ-${A.first_period_days} הימים הראשונים של עצמאי (${A.self_first_section})` : ''].filter(Boolean).join(' ועוד ');
		add('warn', 'partial_waiting', `דמי פגיעה מופחתים: ${A.partial_section} משלם אותם "על אף הוראות סעיף 92", ואינו אומר אם ${which} חלים גם עליהם. לכן מוצג טווח: ${partial.low !== null ? `${avMoney(partial.low)} ₪ אם ${partial.unclear} הימים הראשונים של אי-הכושר החלקי לא משולמים, ועד ${avMoney(partial.amount)} ₪ אם כן` : `${partial.unclear} מהימים אולי לא משולמים`}. את הסכום קובע פקיד התביעות.`, A.partial_section, av.law.url);
	}
	if (injury && injury < A.max_daily_from) { add('warn', 'old_year', `הפגיעה לפני ${A.max_daily_from.split('-').reverse().map(Number).join('.')}: הסכומים כאן לפי המקסימום והשכר הממוצע של 2026. בפגיעה קודמת הביטוח הלאומי משתמש בערכים שהיו בתוקף אז, וקצבת הנכות מתעדכנת ב-1 בינואר לפי המדד (${D.index_section}); את הסכום המדויק נותן פקיד התביעות.`, D.index_section, av.law.url); }
	if (kind === 'employee' && days > av.employer_report.days_over) { add('info', 'employer_report', `${av.employer_report.he}.`, 'פקודת התאונות ומחלות משלח יד (הודעה), 1945', av.employer_report.url); }

	// 3. The disability: degree -> nothing, a grant or a monthly pension.
	let deg = null;
	let full = null;
	let monthly = null;
	let grant = null;
	let young = null;
	if (degree !== null) {
		deg = avDegree(reg, degree, stable, share || 0);
		if (daily) { full = avFull(reg, daily); monthly = avR2(full * deg.final / 100); }
		if (deg.kind === 'grant' && monthly !== null) { grant = avR2(monthly * D.grant_months); }
		if (deg.kind === 'grant' && age !== null && age < D.young_age) {
			const avg = reg.rights_btl.avg_wage.s2_benefits;
			const youngFull = avR2(avg * A.pct / 100 / A.quarter_days * 3 * D.full_days);
			const useYoung = full === null || youngFull > full;
			young = { avg, full: youngFull, monthly: avR2(youngFull * deg.final / 100), grant: avR2(avR2(youngFull * deg.final / 100) * D.grant_months), applies: useYoung };
			if (useYoung) { grant = young.grant; }
			add(useYoung ? 'ok' : 'info', 'young', `${D.young_he} (${D.young_section}; ${avMoney(avg)} ₪ מ-1.1.2026). ${useYoung ? `כאן המענק המוגדל: ${avMoney(young.grant)} ₪.` : 'כאן השכר עצמו גבוה יותר, והמענק לפי השכר.'}`, D.young_section, D.max_monthly_url);
		}
		if (share && !stable) { add('info', 'reg15_temp', `תקנה 15 חלה על דרגה יציבה (לצמיתות) בלבד: בדרגה זמנית ההגדלה לא חושבה (${G.reg15.section}).`, G.reg15.section, G.url); }
		if (deg.share) { add(deg.capped ? 'warn' : 'info', 'reg15', `${G.reg15.he} (${G.reg15.section}): ${deg.base}% ועוד ${deg.share}% מהם = ${deg.capped ? `${avR2(deg.base * (1 + deg.share / 100))}%, ומאחר שהדרגה לפי המבחנים פחותה מ-${G.reg15.grant_cap_below}%, התוצאה ${G.reg15.grant_cap}% בלבד` : `${deg.beforeRound}%`}. ${G.reg15.cond_he}.`, G.reg15.section, G.url); }
		if (deg.rounded) { add('info', 'rounded', `${G.reg19a.he} (${G.reg19a.section}): ${deg.beforeRound}% → ${deg.final}%.`, G.reg19a.section, G.url); }
		if (deg.kind === 'none') { add('info', 'below', `דרגה ${stable ? 'יציבה' : 'זמנית'} של ${deg.final}%, פחות מ-${stable ? D.grant_min : D.temp_min}%: לא משולם מענק ולא קצבה (${D.entitle_section}). אפשר לערור על ההחלטה בתוך ${G.reg27.days} יום (${G.reg27.section}), ואחרי ${G.reg36.months} חודשים לבקש קביעה מחדש בהחמרה (${G.reg36.section}).`, D.entitle_section, D.max_monthly_url); }
		if (deg.kind === 'grant') { add('info', 'grant', `${D.grant_he} (${D.grant_section}). ${D.grant_then_pension_he} (${D.grant_then_pension_section}).`, D.grant_section, D.max_monthly_url); }
		if (deg.kind === 'pension') { add('info', 'pension', `${stable ? `דרגה יציבה של ${D.pension_min}% ומעלה` : `דרגה זמנית של ${D.temp_min}% ומעלה`}: קצבה חודשית (${D.entitle_section}, ${D.pension_section}). ${D.pay_he}; ${D.income_he}.`, D.entitle_section, D.max_monthly_url); }
		if (!stable && deg.kind === 'pension') { add('info', 'temporary', `${D.temporary_he} (${D.temporary_section}).`, D.temporary_section, av.law.url); }
		if (!stable && deg.final < 100 && full !== null) { add('info', 'needy', `${G.reg18a.he} (${G.reg18a.section}): כאן ${avMoney(full)} ₪ לחודש לתקופה כזו. ${G.reg18a.btl_he}.`, G.reg18a.section, av.pages.wd_needy); }
		if (stable && degree >= G.reg16.min && deg.final < 100) { add('info', 'reg16', `${G.reg16.he} (${G.reg16.section})${full !== null ? `: קצבה של 100% היא ${avMoney(full)} ₪ לחודש` : ''}.`, G.reg16.section, G.url); }
		if (stable && deg.final >= D.special_alt_min) { add('info', 'special', `${D.special_he} (${D.special_section}).`, D.special_section, av.pages.wd_special); }
		if (stable && deg.final >= D.certificate_min) { add('info', 'certificate', `${D.certificate_he} (${D.certificate_section}). ${D.capitalise_he} (${D.capitalise_section}).`, D.certificate_section, D.max_monthly_url); }
		if (age !== null && age < D.young_age && deg.kind === 'pension') { add('info', 'young_pension', `${D.young_pension_he} (${D.young_pension_section}); השיעורים לא מפורסמים בדף, ולכן לא חושבו.`, D.young_pension_section, av.law.url); }
	}
	// A claim filed after the 12 months the Institute's pages name.
	const claimBy = injury ? offRestDays(addMonths(injury, T.claim_months)) : null;
	if (claimDate && claimBy && claimDate > claimBy) {
		const per = deg && deg.kind === 'grant' && monthly !== null ? ` במענק: לכל חודש מתום ${D.late_months} החודשים שמהחודש שבו נוצרו התנאים ועד חודש הגשת התביעה, המענק פוחת בקצבה חודשית אחת, ${avMoney(young && young.applies ? young.monthly : monthly)} ₪ (${D.grant_section}; את חודש התחלת הדרגה קובעת הוועדה, ${G.reg20.section}).` : '';
		add('warn', 'late', `התביעה הוגשה ב-${avHeDate(claimDate)}, אחרי ${avHeDate(claimBy)}: ${T.late_he} (${T.late_section}).${per}`, T.late_section, av.law.general_url);
	}

	// 4. Road accident: both laws, and the deduction from the road-law damages.
	if (road) {
		add('info', 'road', `${where === 'way' ? `תאונת דרכים בדרך לעבודה או ממנה היא גם תאונת עבודה (${L.way})` : 'תאונת דרכים בזמן העבודה היא גם תאונת עבודה'} וגם תאונה לפי חוק פיצויים לנפגעי תאונות דרכים. ${av.road.deduct_he} (${av.road.deduct_section}). ${av.forms.road_docs_he}.`, av.road.deduct_section, av.road.url);
	}

	// 5. The dates the law and the Institute set. A deadline on a rest day moves to the next day (Interpretation Law s.10(c)).
	const events = [];
	const ev = (key, date, he, section, url, deadline = true) => { if (date) { events.push({ key, date: deadline ? offRestDays(date) : date, he, section, url, deadline }); } };
	ev('injury', injury, kind === 'employee' ? 'יום הפגיעה: המעסיק משלם את שכר היום' : 'יום הפגיעה', kind === 'employee' ? A.injury_day_section : L.definitions, av.law.url, false);
	if (pd.paid > 0) { ev('ia_from', addDays(injury, pd.first), `היום הראשון שבעדו משולמים דמי פגיעה (יום ${pd.first} אחרי הפגיעה)`, kind === 'self' ? A.self_first_section : A.waiting_section, av.pages.ia_period, false); }
	if (pd.within > 0) { ev('ia_end', allowanceEnd, pd.over ? `היום ה-${A.max_days}: סוף תקופת דמי הפגיעה; מגישים תביעה לנכות מעבודה (${av.forms.disability.code})` : `סוף ימי אי-הכושר שהוזנו (יום ${pd.within}); נשארה נכות? תביעה לנכות מעבודה (${av.forms.disability.code})`, A.max_section, av.pages.ia_period, false); }
	ev('claim', claimBy && addMonths(injury, T.claim_months), `המועד האחרון להגיש תביעות לדמי פגיעה (${av.forms.claim.code}) ולגמלת נכות מעבודה (${av.forms.disability.code}): ${T.claim_months} חודשים מיום הפגיעה`, T.claim_section, av.pages.ia_claim);
	if (decision) {
		ev('arar', addDays(decision, G.reg27.days), `ערר על החלטת הוועדה הרפואית: ${G.reg27.days} יום מקבלת ההחלטה`, G.reg27.section, av.pages.wd_arar);
		ev('reasons', addDays(offRestDays(addDays(decision, G.reg27.days)), G.reg28.days), `ערר שהוגש בלי נימוקים: עד היום הזה מגישים את הנימוקים (${G.reg28.days} ימים נוספים)`, G.reg28.section, av.pages.wd_arar);
		ev('aggravation', addMonths(decision, G.reg36.months), `מהיום הזה אפשר לבקש קביעה מחדש בגלל החמרה (${G.reg36.months} חודשים מהקביעה)`, G.reg36.section, av.pages.wd_recheck, false);
		if (deg && stable && deg.final >= G.reg17.min) {
			ev('reg17_from', addMonths(decision, G.reg17.from_months), `נפתח החלון לבקשה לפי תקנה 15 בשל ירידה בהכנסות (${G.reg17.from_months} חודשים)`, G.reg17.section, G.url, false);
			ev('reg17_to', addMonths(decision, G.reg17.to_months), `נסגר החלון לבקשה לפי תקנה 17 (${G.reg17.to_months} חודשים מהקביעה)`, G.reg17.section, G.url);
		}
	}
	if (appealDecision) { ev('court', addDays(appealDecision, T.court_days), `ערעור לבית הדין האזורי לעבודה על החלטת הוועדה לעררים, בשאלה משפטית בלבד: ${T.court_days} יום`, T.court_section, av.pages.wd_arar); }
	if (rejection) {
		ev('claims_committee', addMonths(rejection, T.claims_committee_months), `פנייה לוועדת התביעות (${av.forms.claims_committee.code}): ${T.claims_committee_months} חודשים ממכתב הדחייה`, 'דף הביטוח הלאומי', av.pages.claims_committee);
		ev('labor_court', addMonths(rejection, T.labor_court_months), `תביעה לבית הדין האזורי לעבודה על הדחייה: ${T.labor_court_months} חודשים`, 'דף הביטוח הלאומי', av.pages.labor_court);
	}
	if (tempTo) { ev('temp_end', tempTo, 'סוף הדרגה הזמנית שקבעה הוועדה: לפני כן הוועדה דנה מחדש', D.temporary_section, av.law.url, false); }
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	const benefit = deg ? deg.kind : null;
	return {
		ok: true, kind, injury, age, wage, quarter, quarterFromTotal: quarterIn !== null, daily, days, pd, allowance, allowanceEnd, partial,
		where, road, issues, accident: acc, degree: deg, full, monthly, grant, young, benefit, stable, decision, appealDecision, rejection,
		tempTo, claimDate, claimBy, events, flags,
	};
}

function avMoney(n) { return Number(n).toLocaleString('en-US', { minimumFractionDigits: avWhole(n) ? 0 : 2, maximumFractionDigits: 2 }); }
function avHeDate(iso) { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; }

/** The analytics band: kind, benefit and an incapacity band only, never a date or an amount. */
export function avBand(r) {
	if (!r || !r.ok) { return 'error'; }
	const len = r.days < 12 ? 'short' : r.days <= 91 ? 'mid' : 'long';
	return `${r.kind}-${r.benefit || 'none'}-${len}${r.road ? '-road' : ''}`;
}
