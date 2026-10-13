/**
 * Calendar helpers shared by the wave-4 engines (HAD-502): ISO days in UTC, calendar years and months, and the
 * Interpretation Law rule for a period that ends on a rest day. The rest-day logic is the one the wave-3 purchase-tax
 * engine uses (reviewed on PR 124), moved here so the new tools share one copy.
 */

const DAY = 86400000;
export const msOf = (iso) => Date.parse(`${iso}T00:00:00Z`);
export const isoOf = (t) => new Date(t).toISOString().slice(0, 10);
export function addDays(iso, n) { return isoOf(msOf(iso) + n * DAY); }
export function daysBetween(a, b) { return Math.round((msOf(b) - msOf(a)) / DAY); }

/** n months later; from the last day of a month, the last day of the target month. */
export function addMonths(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const total = y * 12 + (m - 1) + n;
	const ny = Math.floor(total / 12);
	const nm = total % 12 + 1;
	const last = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
	const endOfMonth = d === new Date(Date.UTC(y, m, 0)).getUTCDate();
	return `${String(ny).padStart(4, '0')}-${String(nm).padStart(2, '0')}-${String(endOfMonth ? last : Math.min(d, last)).padStart(2, '0')}`;
}
export function addYears(iso, n) { return addMonths(iso, 12 * n); }

/** Full years from a birth day to a day (the age "completed" on that day). */
export function fullYears(birth, on) {
	const [by, bm, bd] = birth.split('-').map(Number);
	const [y, m, d] = on.split('-').map(Number);
	return y - by - (m < bm || (m === bm && d < bd) ? 1 : 0);
}

/** 13.10.2026, 2026-10-13, 13/10/26 -> 2026-10-13; anything else -> null. */
export function parseDate(text) {
	const raw = String(text || '').trim();
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
	if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) { return null; }
	return isoOf(t);
}

/**
 * Statutory rest days (Law and Administration Ordinance s.18א(א)): Saturday, 1-2 Tishri, 10 Tishri, 15 and 22 Tishri,
 * 15 and 21 Nisan, 6 Sivan, and Independence Day (5 Iyar, moved by the statutory rule). Interpretation Law s.10(ג):
 * a period whose last day is a rest day ends on the next day that is not one. Without Intl's Hebrew calendar,
 * Saturday and the listed Independence days only.
 */
const REST_HEBREW = { Tishri: [1, 2, 10, 15, 22], Nisan: [15, 21], Sivan: [6] };
let hebrewFmt = null;
try { hebrewFmt = new Intl.DateTimeFormat('en-u-ca-hebrew', { timeZone: 'UTC', month: 'long', day: 'numeric' }); } catch (e) { hebrewFmt = null; }
const independenceCache = {};
export function independenceDay(year) {
	if (!hebrewFmt) { return null; }
	if (year in independenceCache) { return independenceCache[year]; }
	let out = null;
	for (let t = Date.UTC(year, 3, 1); t < Date.UTC(year, 5, 1); t += DAY) {
		const parts = hebrewFmt.formatToParts(new Date(t));
		if ((parts.find((p) => p.type === 'month') || {}).value === 'Iyar' && Number((parts.find((p) => p.type === 'day') || {}).value) === 5) {
			const shift = { 5: -1, 6: -2, 1: 1 }[new Date(t).getUTCDay()] || 0;
			out = isoOf(t + shift * DAY);
			break;
		}
	}
	independenceCache[year] = out;
	return out;
}
export function isRestDay(iso, extra = []) {
	const d = new Date(`${iso}T00:00:00Z`);
	if (d.getUTCDay() === 6 || (extra || []).includes(iso) || independenceDay(d.getUTCFullYear()) === iso) { return true; }
	if (!hebrewFmt) { return false; }
	const parts = hebrewFmt.formatToParts(d);
	const month = (parts.find((p) => p.type === 'month') || {}).value;
	const day = Number((parts.find((p) => p.type === 'day') || {}).value);
	return Boolean(REST_HEBREW[month] && REST_HEBREW[month].includes(day));
}
export function offRestDays(iso, extra = []) {
	let out = iso;
	for (let i = 0; i < 7 && isRestDay(out, extra); i += 1) { out = addDays(out, 1); }
	return out;
}

/**
 * Family Disputes Settlement Law s.6א(א)(1): for requests in the family courts and the rabbinical courts, these days
 * are not counted: the two days of Rosh Hashana, Yom Kippur, 14-22 Tishri and 14-21 Nisan.
 */
export function isFamilyPause(iso) {
	if (!hebrewFmt) { return false; }
	const parts = hebrewFmt.formatToParts(new Date(`${iso}T00:00:00Z`));
	const month = (parts.find((p) => p.type === 'month') || {}).value;
	const day = Number((parts.find((p) => p.type === 'day') || {}).value);
	if (month === 'Tishri') { return day === 1 || day === 2 || day === 10 || (day >= 14 && day <= 22); }
	if (month === 'Nisan') { return day >= 14 && day <= 21; }
	return false;
}
/** n days after a day, not counting the days a predicate excludes. */
export function addCountedDays(iso, n, skip) {
	let day = iso;
	let counted = 0;
	for (let guard = 0; counted < n && guard < n + 400; guard += 1) {
		day = addDays(day, 1);
		if (!skip(day)) { counted += 1; }
	}
	return day;
}
