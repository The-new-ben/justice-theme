/**
 * The parenting-time planner on /child-custody/ (the family + land wave, HAD-579): the next 12 months night by night, the
 * official school vacations of the Ministry of Education laid over the two-week schedule, the age rules of the law and
 * the rulings for every child, and what the time split does to child support under בע"מ 919/15.
 *
 * Dependency-free ES module. It reuses, never copies: the two-week patterns, the handover count and the Sunday rule of the
 * custody calendar on /divorce-lawyer/ (luach-engine.js), and the child-support engine of /child-support/
 * (mezonot-engine.js: computeSupport, and its birthday helpers). What it adds: the Ministry's vacation calendar for the
 * school year 5787 by stage (registry.fl_mishmoret.breaks, notices 0363 and 0364) instead of the Hebrew-calendar
 * estimate, the year as handovers and stays per parent, the age milestones with their sections, and the money link.
 *
 * Nights are counted by the evening they start. 'A' and 'B' are the two parents; A is the parent the template counts
 * nights for. No law sets a schedule: the templates and the way a vacation is cut into nights are labelled templates
 * (registry.fl_mishmoret.template, registry.divorce_agreement.schedule_he).
 */
import { fMs, fIsoOf, fIsIso, fEntered } from './family-common.js';
import { LU_DAYS, luNights, luHandovers, luSunday } from './luach-engine.js';
import { computeSupport, mzAgeOn, mzAnniversary } from './mezonot-engine.js';

const MM_DAY = 86400000;
const mmAdd = (iso, n) => fIsoOf(fMs(iso) + n * MM_DAY);
const mmBetween = (a, b) => Math.round((fMs(b) - fMs(a)) / MM_DAY);
export function mmIsoHe(iso) { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; }

/**
 * The arrangement templates. Each one is a two-week pattern of the custody calendar (luach-engine); "weekends_eve" adds
 * one evening a week with parent A that is not a night, so it never changes the count of nights.
 */
export const MM_TEMPLATES = {
	two_two_five: { he: '5-2-2-5: ימים קבועים באמצע השבוע, וסוף שבוע ארוך לסירוגין', chip: '5-2-2-5', base: 'two_two_five' },
	two_two_three: { he: '2-2-3: שני לילות, שני לילות, שלושה, ומתחלפים כל שבוע', chip: '2-2-3', base: 'two_two_three' },
	three_four: { he: '3-4-4-3: שלושה לילות ואז ארבעה, ומתחלפים', chip: '3-4-4-3', base: 'three_four' },
	week_week: { he: 'שבוע אצל כל הורה', chip: 'שבוע-שבוע', base: 'week_week' },
	weekends_mid: { he: 'סופי שבוע לסירוגין ולינה אחת באמצע השבוע', chip: 'סופ"ש לסירוגין ולינה באמצע', base: 'weekends_mid' },
	weekends_2mid: { he: 'סופי שבוע לסירוגין ושתי לינות באמצע השבוע', chip: 'סופ"ש לסירוגין ושתי לינות', base: 'weekends_2mid' },
	weekends_eve: { he: 'סופי שבוע לסירוגין וערב אחד באמצע השבוע, בלי לינה', chip: 'סופ"ש לסירוגין וערב בלי לינה', base: 'weekends', evening: 2 },
	custom: { he: 'אחר: מסמנים 14 לילות', chip: 'אחר: מסמנים לילות', base: 'custom' },
};
export const MM_STAGES = ['k6', 'mid', 'high'];
export const MM_RULES = ['halves', 'alternate', 'none'];

/** The 14 nights of a template (custom: the A-nights the user marked). */
export function mmNights(template, custom) {
	const t = MM_TEMPLATES[template] || MM_TEMPLATES.two_two_five;
	return t.base === 'custom' ? luNights('custom', custom) : luNights(t.base);
}

/**
 * The vacations of the school year for one stage, each with its nights: from the evening of the last school day (the
 * day before the first day off) to the night before school resumes (registry.fl_mishmoret.template).
 */
export function mmBreaks(fl, stage) {
	const st = MM_STAGES.includes(stage) ? stage : 'k6';
	return fl.breaks.map((b, i) => {
		const over = (b.by_stage && b.by_stage[st]) || {};
		const off = over.off || b.off;
		const resume = over.resume || b.resume;
		const from = mmAdd(off, -1);
		const to = mmAdd(resume, -1);
		return { key: b.key, he: b.he, index: i, off, resume, from, to, nights: mmBetween(from, resume), text_he: b.text_he, section_he: b.section_he };
	});
}

/**
 * Who has each vacation. The vacations take turns in the order of the school year: the first (Rosh Hashana) goes to
 * parent A when firstA, the next to B, and so on. 'halves': a vacation of at least template.long_from_nights nights is cut
 * in two, the parent whose turn it is takes the first (longer) half; a short one goes whole to that parent. 'alternate':
 * every vacation whole to the parent whose turn it is, the summer in halves. 'none': the two-week schedule runs on.
 */
export function mmAllocate(fl, breaks, rule, firstA) {
	const longFrom = fl.template.long_from_nights;
	return breaks.map((b) => {
		const lead = (b.index % 2 === 0) === (firstA !== false) ? 'A' : 'B';
		const other = lead === 'A' ? 'B' : 'A';
		if (rule === 'none') { return Object.assign({}, b, { lead: null, split: false, parts: [] }); }
		const halve = (rule === 'halves' && b.nights >= longFrom) || (rule === 'alternate' && b.key === 'summer');
		if (!halve) { return Object.assign({}, b, { lead, split: false, parts: [{ who: lead, from: b.from, to: b.to, nights: b.nights }] }); }
		const first = Math.ceil(b.nights / 2);
		const mid = mmAdd(b.from, first);
		return Object.assign({}, b, {
			lead, split: true,
			parts: [{ who: lead, from: b.from, to: mmAdd(mid, -1), nights: first }, { who: other, from: mid, to: b.to, nights: b.nights - first }],
		});
	});
}

/** The age rules of one child on a day: tender years (s.25), hearing the child (reg. 51(ב)), the support bracket (919/15). */
export function mmAgeRules(reg, birth, on) {
	const fl = reg.fl_mishmoret;
	const cs = reg.child_support;
	const age = mzAgeOn(birth, on);
	const minor = age < fl.law.minor_until;
	const tender = age < fl.law.tender_until;
	const heard = age >= fl.child_heard.from_age;
	const bracket = !minor ? 'adult' : age < cs.ages.father_only_to ? 'under6' : age < cs.ages.equal_from ? '6to15' : '15to18';
	return { age, minor, tender, heard, bracket };
}

/** The birthdays that change a rule, from `from` on: 6 (s.25, reg. 51(ב), 919/15), 15 (919/15), 18 (s.3). */
export function mmMilestones(reg, birth, from) {
	const fl = reg.fl_mishmoret;
	const cs = reg.child_support;
	const list = [];
	const at = (years) => mzAnniversary(birth, years);
	const six = fl.law.tender_until;
	if (at(six) > from) { list.push({ years: six, date: at(six), key: 'six' }); }
	if (at(cs.ages.equal_from) > from) { list.push({ years: cs.ages.equal_from, date: at(cs.ages.equal_from), key: 'fifteen' }); }
	if (at(fl.law.minor_until) > from) { list.push({ years: fl.law.minor_until, date: at(fl.law.minor_until), key: 'adult' }); }
	return list;
}

/**
 * input = {
 *   parentA: 'אבא'|'אמא'      who parent A is (A is the parent the template counts nights for)
 *   children: [ISO births]
 *   template, custom           the arrangement (MM_TEMPLATES) and, for 'custom', the A-nights 0-13
 *   start                      ISO; the plan starts on that day's Sunday and runs 365 nights
 *   stage: 'k6'|'mid'|'high'   which school calendar the children follow
 *   holidays: 'halves'|'alternate'|'none', firstA (A has the first vacation of the school year)
 *   incomeA, incomeB, housingA, housingB   optional: the money link (blank incomes: no support figure)
 * }
 * Returns the year, the vacations, the handovers and stays, the age rules and milestones, the support band; or
 * { ok: false, errors }.
 */
export function compute(registry, input) {
	const fl = registry.fl_mishmoret;
	const cs = registry.child_support;
	const errors = [];
	const template = MM_TEMPLATES[input.template] ? input.template : 'two_two_five';
	const custom = (input.custom || []).filter((n) => Number.isInteger(n) && n >= 0 && n < 14);
	if (!fIsIso(input.start)) { errors.push({ field: 'start', he: 'יום תחילת הלוח לא תקין. לדוגמה: 1.11.2026' }); }
	if (template === 'custom' && !custom.length) { errors.push({ field: 'custom', he: 'בהסדר "אחר" מסמנים לפחות לילה אחד אצל הורה א\'' }); }
	const births = (input.children || []).filter((b) => fEntered(b));
	if (!births.length) { errors.push({ field: 'children', he: 'צריך לפחות ילד אחד עם תאריך לידה' }); }
	if (births.length > cs.max_children) { errors.push({ field: 'children', he: `עד ${cs.max_children} ילדים` }); }
	births.forEach((b, i) => {
		if (!fIsIso(b)) { errors.push({ field: `child-${i}`, he: 'תאריך לידה לא תקין. לדוגמה: 1.3.2019' }); } else if (fIsIso(input.start) && b > input.start) { errors.push({ field: `child-${i}`, he: 'תאריך הלידה אחרי תחילת הלוח' }); }
	});
	const money = {};
	for (const k of ['incomeA', 'incomeB', 'housingA', 'housingB']) {
		const v = input[k];
		if (!fEntered(v)) { money[k] = null; continue; }
		const n = Number(v);
		if (!(n >= 0 && n < 1e9)) { errors.push({ field: k, he: 'סכום: מספר חיובי' }); money[k] = null; } else { money[k] = n; }
	}
	if (!errors.length && births.every((b) => mzAgeOn(b, input.start) >= fl.law.minor_until)) { errors.push({ field: 'children', he: 'כל הילדים כבר בני 18 ומעלה: אין זמני שהות לקבוע (סעיף 3 לחוק הכשרות)' }); }
	if (errors.length) { return { ok: false, errors }; }

	const parentA = input.parentA === 'אמא' ? 'אמא' : 'אבא';
	const stage = MM_STAGES.includes(input.stage) ? input.stage : 'k6';
	const rule = MM_RULES.includes(input.holidays) ? input.holidays : 'halves';
	const firstA = input.firstA !== false;
	const nights = mmNights(template, custom);
	const nightsA = nights.filter((x) => x === 'A').length;
	const start = luSunday(input.start);
	const end = mmAdd(start, 364);
	const flags = [];
	if (start !== input.start) { flags.push({ code: 'sunday', he: `הלוח מתחיל ביום ראשון, ${mmIsoHe(start)}, ולא ב-${mmIsoHe(input.start)}: הלילות נספרים משבוע מלא.` }); }

	// The vacations of the school year, allocated on the whole year (so the turns never depend on the start day).
	const breaks = mmAllocate(fl, mmBreaks(fl, stage), rule, firstA);
	const yearFirst = fl.school_year.first_day;
	const yearEnd = fl.school_year.next_first_day;

	// 365 nights: the vacation part wins over the two-week schedule.
	const days = [];
	const year = { from: start, to: end, a: 0, b: 0, regularA: 0, regularB: 0, holidayNights: 0, shiftedToA: 0, shiftedToB: 0, before: 0, after: 0 };
	for (let i = 0; i < 365; i += 1) {
		const iso = mmAdd(start, i);
		const regular = nights[i % 14];
		let part = null;
		let brk = null;
		for (const b of breaks) {
			if (b.from <= iso && iso <= b.to) {
				brk = b;
				part = b.parts.find((p) => p.from <= iso && iso <= p.to) || null;
				break;
			}
		}
		const who = part ? part.who : regular;
		if (regular === 'A') { year.regularA += 1; } else { year.regularB += 1; }
		if (who === 'A') { year.a += 1; } else { year.b += 1; }
		if (brk) { year.holidayNights += 1; }
		if (part && who !== regular) { if (who === 'A') { year.shiftedToA += 1; } else { year.shiftedToB += 1; } }
		if (iso < yearFirst) { year.before += 1; } else if (iso >= yearEnd) { year.after += 1; }
		days.push({ iso, who, regular, hol: brk ? brk.key : '', handover: i > 0 && days[i - 1].who !== who });
	}
	year.aPct = Math.round((year.a / 365) * 1000) / 10;
	year.bPct = Math.round((year.b / 365) * 1000) / 10;
	// The time split in the terms of the child-support tool: nights of 14 (919/15, para. 3: 7 of 14 is equal).
	const nights14 = Math.round((year.a * 14) / 365);

	// Handovers (the day the children move) and stays (a run of nights in one home).
	const handovers = days.filter((d) => d.handover).map((d) => ({ date: d.iso, to: d.who }));
	const stays = [];
	for (const d of days) {
		const last = stays[stays.length - 1];
		if (last && last.who === d.who) { last.to = d.iso; last.nights += 1; } else { stays.push({ who: d.who, from: d.iso, to: d.iso, nights: 1 }); }
	}
	// The weekly evening of the "weekends_eve" template: with A on a night that is B's, outside the vacations.
	const evening = MM_TEMPLATES[template].evening;
	const evenings = evening === undefined ? [] : days.filter((d) => new Date(fMs(d.iso)).getUTCDay() === evening && d.who === 'B' && (!d.hol || rule === 'none')).map((d) => d.iso);

	// Months for the picture.
	const months = [];
	for (const d of days) {
		const key = d.iso.slice(0, 7);
		let mo = months[months.length - 1];
		if (!mo || mo.key !== key) { mo = { key, first: Number(d.iso.slice(8, 10)), days: [], a: 0, b: 0, hol: [] }; months.push(mo); }
		mo.days.push(d);
		if (d.who === 'A') { mo.a += 1; } else { mo.b += 1; }
		if (d.hol && !mo.hol.includes(d.hol)) { mo.hol.push(d.hol); }
	}

	// The vacations inside the 12 months, with the nights each one moves away from the two-week schedule.
	const inWindow = breaks.filter((b) => b.to >= start && b.from <= end).map((b) => {
		let shifted = 0;
		let n = 0;
		for (const d of days) { if (d.hol === b.key) { n += 1; if (d.who !== d.regular) { shifted += 1; } } }
		return Object.assign({}, b, { inWindow: n, shifted });
	});
	if (year.after) {
		flags.push({ code: 'unpublished', he: `${fl.school_year.next_published_he}. לכן ${year.after} הלילות האחרונים של הלוח, מ-${mmIsoHe(year.after === 365 ? start : yearEnd)}, נספרים לפי הלוח הקבוע בלבד.` });
	}
	if (year.before) {
		flags.push({ code: 'before', he: `הכלי מחזיק את לוח החופשות של שנת הלימודים ${fl.school_year.he} בלבד, מ-${mmIsoHe(yearFirst)}: ${year.before} הלילות שלפני כן נספרים לפי הלוח הקבוע.` });
	}
	if (rule === 'none') { flags.push({ code: 'norule', he: 'בלי חלוקת חופשות: בכל החופשות הלוח הקבוע ממשיך.' }); }

	// Every child: the rules on the first day, and the birthdays that change them.
	const kids = births.map((b, idx) => Object.assign({ idx, birth: b }, mmAgeRules(registry, b, start), { milestones: mmMilestones(registry, b, start) }));
	const anyTender = kids.some((k) => k.minor && k.tender);
	const anyHeard = kids.some((k) => k.minor && k.heard);
	if (kids.some((k) => !k.minor)) { flags.push({ code: 'adult', he: 'ילד בן 18 ומעלה אינו קטין (סעיף 3 לחוק הכשרות): הלוח והכללים חלים על הקטינים בלבד.' }); }

	// The money link: the same family in the child-support engine, at this split and at three common ones.
	const fatherSide = parentA === 'אמא' ? 'B' : 'A';
	let support = null;
	const minors = births.filter((b) => mzAgeOn(b, start) < fl.law.minor_until);
	if (money.incomeA !== null || money.incomeB !== null) {
		const base = { incomeA: money.incomeA || 0, incomeB: money.incomeB || 0, housingA: money.housingA || 0, housingB: money.housingB || 0, children: births, father: fatherSide, law: 'jewish', asOf: start };
		const here = computeSupport(registry, Object.assign({}, base, { nightsA: nights14 }));
		const points = [...new Set([2, 4, 7, nights14])].sort((x, y) => x - y);
		const table = points.map((n) => {
			const r = computeSupport(registry, Object.assign({}, base, { nightsA: n }));
			return { nightsA: n, ok: r.ok, payer: r.ok ? r.payer : null, low: r.ok ? r.low : 0, high: r.ok ? r.high : 0, mine: n === nights14 };
		});
		support = { ok: here.ok, result: here, errors: here.ok ? [] : here.errors, nights14, table, input: Object.assign({}, base, { nightsA: nights14 }), minors: minors.length };
	}

	return {
		ok: true, input, template, custom, parentA, stage, rule, firstA, start, end, nights, nightsA, nightsB: 14 - nightsA,
		handovers14: luHandovers(nights), year, nights14, equal: nights14 === fl.ruling.equal_nights,
		days, months, breaks: inWindow, allBreaks: breaks, handovers, stays, evenings, kids, anyTender, anyHeard, support, flags,
	};
}

/** The templates side by side for the page: nights of 14, handovers, and (with the example family) the support band. */
export function mmCompare(registry, family) {
	return Object.keys(MM_TEMPLATES).filter((k) => k !== 'custom').map((k) => {
		const nights = mmNights(k);
		const nightsA = nights.filter((x) => x === 'A').length;
		const r = family ? computeSupport(registry, Object.assign({}, family, { nightsA })) : null;
		return { key: k, he: MM_TEMPLATES[k].he, nightsA, handovers: luHandovers(nights), evening: MM_TEMPLATES[k].evening !== undefined, support: r && r.ok ? { payer: r.payer, low: r.low, high: r.high } : null };
	});
}

/** The two-week board's day names, from the custody calendar. */
export const MM_DAYS = LU_DAYS;
