/**
 * Custody calendar builder (the divorce world, HAD-539): a two-week schedule of nights, the handovers it costs the
 * children, and a whole year of nights per parent with the holidays and the summer laid over the schedule.
 *
 * Dependency-free ES module. No law sets a schedule (registry.divorce_agreement.schedule_he): the patterns are the ones
 * parents and mediators use, labelled as templates; the court approves a plan only when it serves the child (s.24 of the
 * Legal Capacity and Guardianship Law 1962). Holiday dates come from the Hebrew calendar of the running engine through
 * horut-engine (Intl, "hebrew" calendar); without it the year is counted on the schedule alone and the plan says so.
 *
 * Nights are numbered 0-13 from a Sunday. 'A' and 'B' are the two parents. A night "belongs" to the evening it starts.
 */
import { fMs, fIsoOf, fIsIso } from './family-common.js';
import { HR_PATTERNS, HR_DAYS, hrPlan } from './horut-engine.js';

/** The two-week patterns, the nights with parent A; the first four split the time equally. */
export const LU_PATTERNS = {
	two_two_three: { he: '2-2-3: שני לילות, שני לילות, שלושה, ומתחלפים כל שבוע', a: [0, 1, 4, 5, 6, 9, 10], equal: true },
	two_two_five: { he: '2-2-5-5: ימים קבועים באמצע השבוע, סופי שבוע מתחלפים', a: HR_PATTERNS.two_two_five.a, equal: true },
	week_week: { he: 'שבוע אצל כל הורה', a: HR_PATTERNS.week_week.a, equal: true },
	three_four: { he: '3-4-4-3: שלושה לילות ואז ארבעה, ומתחלפים', a: HR_PATTERNS.three_four.a, equal: true },
	weekends_2mid: { he: 'סופי שבוע לסירוגין ושתי לינות באמצע השבוע', a: HR_PATTERNS.weekends_2mid.a, equal: false },
	weekends_mid: { he: 'סופי שבוע לסירוגין ולינה אחת באמצע השבוע', a: HR_PATTERNS.weekends_mid.a, equal: false },
	weekends: { he: 'סופי שבוע לסירוגין בלבד', a: HR_PATTERNS.weekends.a, equal: false },
};
export const LU_DAYS = HR_DAYS;
const LU_DAY = 86400000;

/** The 14 nights of a pattern, or of a custom list of A-nights. */
export function luNights(pattern, custom) {
	const a = pattern === 'custom'
		? (custom || []).filter((n) => Number.isInteger(n) && n >= 0 && n < 14)
		: (LU_PATTERNS[pattern] || LU_PATTERNS.two_two_three).a;
	const set = new Set(a);
	return Array.from({ length: 14 }, (_, i) => (set.has(i) ? 'A' : 'B'));
}

/** How many times in two weeks the children move house (the night after a night with the other parent). */
export function luHandovers(nights) {
	return nights.reduce((n, x, i) => n + (x !== nights[(i + 1) % 14] ? 1 : 0), 0);
}

/** The Sunday on or before a day. */
export function luSunday(iso) {
	const dow = new Date(fMs(iso)).getUTCDay();
	return dow ? fIsoOf(fMs(iso) - dow * LU_DAY) : iso;
}

const luAdd = (iso, n) => fIsoOf(fMs(iso) + n * LU_DAY);
const luDays = (a, b) => Math.round((fMs(b) - fMs(a)) / LU_DAY);

/**
 * input = { pattern, custom (A-nights for 'custom'), start (ISO; snapped to its Sunday), holidays ('alternate' |
 *           'split' | 'none'), firstA (parent A has the first holiday of an even Hebrew year), parentA ('אבא' | 'אמא') }
 * Returns the two weeks, a year of nights (365 nights from the start), the holiday spans with who has them, the events
 * for a calendar file and the plan as text; or { ok: false, errors }.
 */
export function luPlan(registry, input) {
	const errors = [];
	const pattern = LU_PATTERNS[input.pattern] ? input.pattern : (input.pattern === 'custom' ? 'custom' : 'two_two_three');
	if (!fIsIso(input.start)) { errors.push({ field: 'start', he: 'יום תחילת הלוח לא תקין. לדוגמה: 1.11.2026' }); }
	if (pattern === 'custom' && !(input.custom || []).length) { errors.push({ field: 'custom', he: 'בלוח "אחר" מסמנים לפחות לילה אחד אצל הורה א\'' }); }
	if (errors.length) { return { ok: false, errors }; }
	const nights = luNights(pattern, input.custom);
	const nightsA = nights.filter((x) => x === 'A').length;
	const start = luSunday(input.start);
	const rule = input.holidays === 'alternate' ? 'alternate' : input.holidays === 'none' ? 'none' : 'split';
	const firstA = input.firstA !== false;
	const parentA = input.parentA === 'אמא' ? 'אמא' : 'אבא';
	const flags = [];
	if (start !== input.start) { flags.push({ code: 'sunday', he: `הלוח מתחיל ביום ראשון, ${luIsoHe(start)}, ולא ב-${luIsoHe(input.start)}: הלילות נספרים משבוע מלא.` }); }

	// The holidays of the year ahead, allocated by the rule (horut-engine), then cut into spans of nights.
	const a = pattern === 'custom' ? input.custom : LU_PATTERNS[pattern].a;
	const plan = rule === 'none' ? { years: [] } : hrPlan({ pattern: 'custom', custom: a, from: start, holidays: rule, firstA });
	const spans = [];
	const end = luAdd(start, 365);
	for (const year of plan.years) {
		for (const h of year) {
			const parts = h.halves ? h.halves.map((x) => ({ who: x.who, from: x.from, to: x.to, half: true })) : (h.start && h.end ? [{ who: h.who, from: h.start, to: h.end, half: false }] : []);
			for (const p of parts) {
				if (p.to <= start || p.from >= end) { continue; }
				spans.push({ key: h.key, he: h.he, hebrewYear: h.hebrewYear, who: p.who, from: p.from, to: p.to, half: p.half, nights: 0, shifted: 0 });
			}
		}
	}
	if (rule !== 'none' && !spans.length) { flags.push({ code: 'no_hebrew_calendar', he: 'הלוח העברי לא זמין בדפדפן הזה: השנה נספרת לפי הלוח הקבוע בלבד, בלי החגים.' }); }

	// A year of nights, night by night: the holiday span wins over the schedule.
	const year = { from: start, to: luAdd(start, 364), a: 0, b: 0, regularA: 0, regularB: 0, holidayNights: 0, shiftedToA: 0, shiftedToB: 0 };
	const months = [];
	let month = null;
	for (let i = 0; i < 365; i += 1) {
		const iso = luAdd(start, i);
		const regular = nights[i % 14];
		let span = null;
		for (const s of spans) { if (s.from <= iso && iso < s.to) { span = s; break; } }
		const who = span ? span.who : regular;
		if (regular === 'A') { year.regularA += 1; } else { year.regularB += 1; }
		if (who === 'A') { year.a += 1; } else { year.b += 1; }
		if (span) {
			span.nights += 1;
			year.holidayNights += 1;
			if (who !== regular) { span.shifted += 1; if (who === 'A') { year.shiftedToA += 1; } else { year.shiftedToB += 1; } }
		}
		const key = iso.slice(0, 7);
		if (!month || month.key !== key) { month = { key, first: Number(iso.slice(8, 10)), days: [] }; months.push(month); }
		month.days.push({ iso, who, holiday: span ? span.key : '' });
	}
	year.aPct = Math.round((year.a / 365) * 1000) / 10;
	year.bPct = Math.round((year.b / 365) * 1000) / 10;

	const handovers = luHandovers(nights);
	const equal = nightsA === 7;
	const events = spans.map((s) => ({ date: s.from, summary: `${s.he}: הילדים אצל ${luWho(s.who, parentA)}`, description: `עד ${luIsoHe(s.to)} (${s.nights} לילות). לוח מ-jus-tice.co.il, מידע כללי.` }));
	events.unshift({ date: start, summary: `תחילת לוח השהות: ${LU_PATTERNS[pattern] ? LU_PATTERNS[pattern].he : 'לוח אישי'}`, description: `${nightsA} לילות מתוך 14 אצל ${luWho('A', parentA)}.` });
	return {
		ok: true, pattern, nights, nightsA, nightsB: 14 - nightsA, equal, handovers, start, rule, firstA, parentA, spans, year, months, events, flags,
		text: luText({ pattern, nights, nightsA, handovers, start, rule, parentA, spans, year }),
	};
}

function luIsoHe(iso) { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; }
function luWho(x, parentA) { return x === 'A' ? (parentA === 'אמא' ? 'האם' : 'האב') : (parentA === 'אמא' ? 'האב' : 'האם'); }

/** The plan as plain text, for copying into an agreement draft or a message. */
export function luText(p) {
	const pa = luWho('A', p.parentA);
	const pb = luWho('B', p.parentA);
	const lines = [
		`לוח זמני שהות (${LU_PATTERNS[p.pattern] ? LU_PATTERNS[p.pattern].he : 'לוח אישי'}), מתחיל ביום ראשון ${luIsoHe(p.start)}`,
		`שבועיים: ${p.nightsA} לילות אצל ${pa}, ${14 - p.nightsA} אצל ${pb}; ${p.handovers} מעברים בין הבתים בשבועיים.`,
		`שבוע 1: ${p.nights.slice(0, 7).map((x, i) => `${LU_DAYS[i]} ${x === 'A' ? pa : pb}`).join(', ')}.`,
		`שבוע 2: ${p.nights.slice(7).map((x, i) => `${LU_DAYS[i]} ${x === 'A' ? pa : pb}`).join(', ')}.`,
		`שנה (${luIsoHe(p.year.from)} עד ${luIsoHe(p.year.to)}): ${p.year.a} לילות אצל ${pa} (${p.year.aPct}%), ${p.year.b} אצל ${pb}${p.rule === 'none' ? ', לפי הלוח הקבוע בלבד' : `, כולל ${p.year.holidayNights} לילות של חגים וחופש גדול`}.`,
	];
	if (p.spans.length) {
		lines.push('חגים וחופשות:');
		for (const s of p.spans) { lines.push(`- ${s.he}${s.half ? ' (חצי)' : ''}: ${luIsoHe(s.from)} עד ${luIsoHe(s.to)}, אצל ${luWho(s.who, p.parentA)} (${s.nights} לילות).`); }
	}
	lines.push('הסדר שהות הוא תבנית; בית המשפט מאשר אותו רק אם הוא לטובת הילד (סעיף 24 לחוק הכשרות המשפטית והאפוטרופסות). נבנה ב-jus-tice.co.il.');
	return lines.join('\n');
}

/** Page section: the patterns side by side, with nights, handovers and who they fit. */
export function luCompare() {
	const fit = {
		two_two_three: 'חלוקה שווה; אף הורה לא רחוק מהילדים יותר משלושה לילות; שישה מעברים בשבועיים',
		two_two_five: 'חלוקה שווה עם ימים קבועים באמצע השבוע; ארבעה מעברים',
		week_week: 'ילדים גדולים; מעבר אחד בשבוע',
		three_four: 'חלוקה שווה עם ימים קבועים לכל הורה',
		weekends_2mid: 'הילדים בעיקר אצל הורה אחד, קשר רציף עם השני',
		weekends_mid: 'ההסדר הנפוץ כשהילדים גרים בעיקר אצל הורה אחד',
		weekends: 'ילדים קטנים, או מרחק גדול בין הבתים',
	};
	return Object.entries(LU_PATTERNS).map(([k, v]) => ({ key: k, he: v.he, nightsA: v.a.length, handovers: luHandovers(luNights(k)), fit: fit[k] }));
}
