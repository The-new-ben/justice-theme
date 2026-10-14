/**
 * A parenting plan: the two-week schedule of nights and the Jewish-holiday and summer split (family wave, HAD-506).
 * Dependency-free ES module; no law sets a schedule, so the patterns are the common ones, labelled as templates.
 * Holiday dates come from the Hebrew calendar of the running JavaScript engine (Intl, "hebrew" calendar); Independence
 * Day uses the statutory shift that dates.js already implements. Without Intl's Hebrew calendar the plan lists the
 * holidays without dates.
 *
 * Nights are numbered 0-13 from a Sunday: 0-6 the first week, 7-13 the second. 'A' and 'B' are the two parents.
 */
import { fMs, fIsoOf } from './family-common.js';
import { independenceDay } from './dates.js';

const HR_A = 'A';
const HR_B = 'B';
/** Two-week patterns, as the nights with parent A ("the other parent" in most plans). */
export const HR_PATTERNS = {
	weekends: { he: 'סופי שבוע לסירוגין', a: [5, 6] },
	weekends_mid: { he: 'סופי שבוע לסירוגין ולינה אחת באמצע השבוע', a: [2, 5, 6, 9] },
	weekends_2mid: { he: 'סופי שבוע לסירוגין ושתי לינות באמצע השבוע', a: [2, 4, 5, 6, 9, 11] },
	two_two_five: { he: '2-2-5-5 (חלוקה שווה)', a: [1, 2, 5, 6, 7, 8, 9] },
	three_four: { he: '3-4-4-3 (חלוקה שווה)', a: [0, 1, 2, 7, 8, 9, 10] },
	week_week: { he: 'שבוע אצל כל הורה', a: [0, 1, 2, 3, 4, 5, 6] },
};
export const HR_DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

/** The 14 nights of a pattern (or of a custom list of A-nights). */
export function hrNights(pattern, custom) {
	const a = pattern === 'custom' ? (custom || []).filter((n) => Number.isInteger(n) && n >= 0 && n < 14) : (HR_PATTERNS[pattern] || HR_PATTERNS.weekends_mid).a;
	const set = new Set(a);
	return Array.from({ length: 14 }, (_, i) => (set.has(i) ? HR_A : HR_B));
}
export function hrCount(nights) { return nights.filter((x) => x === HR_A).length; }

let hrFmt = null;
try { hrFmt = new Intl.DateTimeFormat('en-u-ca-hebrew', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { hrFmt = null; }
function hrParts(iso) {
	const parts = hrFmt.formatToParts(new Date(fMs(iso)));
	const get = (t) => (parts.find((p) => p.type === t) || {}).value;
	return { month: get('month'), day: Number(get('day')), year: Number(get('year')) };
}
/** The Gregorian day of a Hebrew date (month name as Intl prints it), searched from `from` for up to 400 days. */
function hrFind(from, month, day, months) {
	if (!hrFmt) { return null; }
	const names = months || [month];
	for (let t = fMs(from), i = 0; i < 400; i += 1, t += 86400000) {
		const p = hrParts(fIsoOf(t));
		if (names.includes(p.month) && p.day === day) { return fIsoOf(t); }
	}
	return null;
}
const hrAdd = (iso, n) => fIsoOf(fMs(iso) + n * 86400000);

/**
 * The holidays of the Hebrew year that starts on or after `from` (Rosh Hashana to the summer vacation), with the evening
 * the holiday starts and the day it ends. The summer vacation dates are the school calendar's usual 1.7-31.8.
 */
export function hrHolidays(from) {
	const rh = hrFind(from, 'Tishri', 1);
	return hrYear(rh);
}

/** The Rosh Hashana on or before a day (the Hebrew year the day is in). */
export function hrYearStart(iso) {
	if (!hrFmt) { return null; }
	for (let t = fMs(iso), i = 0; i < 400; i += 1, t -= 86400000) {
		const p = hrParts(fIsoOf(t));
		if (p.month === 'Tishri' && p.day === 1) { return fIsoOf(t); }
	}
	return null;
}

function hrYear(rh) {
	if (!rh) { return []; }
	const y = Number(rh.slice(0, 4));
	const ny = y + 1;
	const purim = hrFind(rh, null, 14, ['Adar', 'Adar II']);
	const pesach = hrFind(rh, 'Nisan', 15);
	const shavuot = hrFind(rh, 'Sivan', 6);
	const hanukkah = hrFind(rh, 'Kislev', 25);
	const indep = independenceDay(ny);
	const list = [
		{ key: 'rh', he: 'ראש השנה', start: hrAdd(rh, -1), end: hrAdd(rh, 1), split: false },
		{ key: 'yk', he: 'יום כיפור', start: hrAdd(rh, 8), end: hrAdd(rh, 9), split: false },
		{ key: 'sukkot', he: 'סוכות ושמחת תורה', start: hrAdd(rh, 13), end: hrAdd(rh, 21), split: true },
		{ key: 'hanukkah', he: 'חנוכה', start: hanukkah ? hrAdd(hanukkah, -1) : null, end: hanukkah ? hrAdd(hanukkah, 7) : null, split: true },
		{ key: 'purim', he: 'פורים', start: purim ? hrAdd(purim, -1) : null, end: purim, split: false },
		{ key: 'pesach', he: 'פסח (ליל הסדר ועד שביעי של פסח)', start: pesach ? hrAdd(pesach, -1) : null, end: pesach ? hrAdd(pesach, 6) : null, split: true },
		{ key: 'indep', he: 'יום העצמאות', start: indep ? hrAdd(indep, -1) : null, end: indep, split: false },
		{ key: 'shavuot', he: 'שבועות', start: shavuot ? hrAdd(shavuot, -1) : null, end: shavuot, split: false },
		{ key: 'summer', he: 'חופש גדול', start: `${ny}-07-01`, end: `${ny}-08-31`, split: true },
	];
	return list.map((h) => Object.assign({ hebrewYear: hrParts(rh).year }, h));
}

/**
 * Who has each holiday. 'alternate': the holidays go to the parents in turn (Rosh Hashana to one, Yom Kippur to the
 * other, and so on) and the order flips every Hebrew year, so each parent has every holiday every other year.
 * 'split': a long holiday (Sukkot, Hanukkah, Pesach, the summer) is cut in two halves that also flip every year; the
 * one-day holidays alternate as above. `firstA`: parent A has the first holiday in an even Hebrew year.
 */
export function hrAllocate(holidays, rule, firstA) {
	return holidays.map((h, i) => {
		const even = (h.hebrewYear + i) % 2 === 0;
		const aFirst = firstA ? even : !even;
		if (rule === 'split' && h.split && h.start && h.end) {
			const days = Math.round((fMs(h.end) - fMs(h.start)) / 86400000);
			const mid = hrAdd(h.start, Math.ceil(days / 2));
			return Object.assign({}, h, { halves: [{ who: aFirst ? HR_A : HR_B, from: h.start, to: mid }, { who: aFirst ? HR_B : HR_A, from: mid, to: h.end }] });
		}
		return Object.assign({}, h, { who: aFirst ? HR_A : HR_B });
	});
}

/** A plan: the nights, the count for the child-support tool, and two years of holidays from `from`. */
export function hrPlan(input) {
	const nights = hrNights(input.pattern, input.custom);
	const from = input.from;
	// This Hebrew year from today on, then the whole next year.
	const start = hrYearStart(from);
	const rule = input.holidays === 'split' ? 'split' : 'alternate';
	const firstA = input.firstA !== false;
	// Allocate on the whole Hebrew year, so the turns flip the same way every year, and only then drop what has passed.
	const y1 = start ? hrAllocate(hrYear(start), rule, firstA).filter((h) => !h.end || h.end >= from) : [];
	const y2 = start ? hrAllocate(hrHolidays(hrAdd(start, 30)), rule, firstA) : [];
	// Between the end of the summer and Rosh Hashana nothing is left of this year: show the two years ahead instead.
	const y3 = !y1.length && y2.length ? hrAllocate(hrHolidays(hrAdd(y2[0].end, 30)), rule, firstA) : [];
	return {
		pattern: HR_PATTERNS[input.pattern] ? input.pattern : (input.pattern === 'custom' ? 'custom' : 'weekends_mid'),
		nights, nightsA: hrCount(nights),
		years: [y1, y2, y3].filter((y) => y.length).slice(0, 2),
		rule,
	};
}
