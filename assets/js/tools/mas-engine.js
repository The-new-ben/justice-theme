/**
 * The rights wave (21.10.2026): the income-tax engine shared by the credit-points builder (nekudot-zikui, /nekudot-zikui/)
 * and the salaried refund calculator (hechzer-mas, /guide-tax-calculator-updated-2025/).
 *
 * Dependency-free ES module (dates.js for parsing a date). Every number comes from registry.rights_tax, read on its
 * checked_on date from the Tax Authority's yearly booklets, its notices to employers and the Income Tax Ordinance:
 *  - Each tax year 2020-2026 with its own annual brackets (s.121), the surtax line (s.121ב, 3%), the credit point (s.33א)
 *    and the donation minimum and maximum (s.46). 2025-2027: the freeze law; 2026: the 20% and 31% brackets widened by
 *    the law of 31.3.2026, retroactive to 1.1.2026.
 *  - The credit points of each year: resident (s.34) and travel (s.36), woman (s.36א), children by age in two columns
 *    (s.66(ג)(4)-(5), s.40(ב)(1)-(1א)) with the 2022-2023 extra point for ages 6-12, the 2024 point for 6-17 and the
 *    toddler points of amendment 271; single-parent (s.40(ב)(2)) and sole-parent (s.40(ב)(1ב)) points; support of
 *    children who live elsewhere (s.40(ב)(2)); alimony after remarriage (s.40א); a dependent spouse when one of the
 *    couple reached retirement age or is disabled (s.37); a disabled child (s.45); discharged soldiers and national
 *    service (s.39א); new immigrants before and after amendment 262 (s.35); degrees and certificates (ss.40ג-40ה,
 *    the 2014-2022 temporary rule and the rule from 2023); combat reservists from 2026 (s.39ב).
 *  - The annual liability: brackets + surtax, minus the points (never below zero) and the donation credit (35%, from
 *    the yearly minimum, up to 30% of the income or the yearly maximum); the refund = tax withheld minus the liability,
 *    six years back (s.160(א)). Interest and linkage (s.159א) are stated, not computed.
 * The two UIs share the profile form, rendered here so both bundles carry one copy.
 */
import { parseDate } from './dates.js';

const r2t = (n) => Math.round(n * 100) / 100;
const r4t = (n) => Math.round(n * 10000) / 10000;
const blankT = (v) => v === '' || v === undefined || v === null;
const ESC_T = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escT = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC_T[c]);
const intT = (v) => (blankT(v) ? NaN : Number(v));

export const DEGREE_TYPES = ['none', 'ba', 'cert', 'med'];
export const DEGREE_HE = { none: 'אין', ba: 'תואר ראשון', cert: 'תעודת מקצוע', med: 'תואר שלישי ברפואה או ברפואת שיניים', ma: 'תואר שני' };

/** The profile a reader fills: the same in both tools. kids: [[year of birth, 1 = lives with me]]. */
export const PROFILE_DEFAULT = {
	gender: 'f', marital: 'married', kids: [], sole: false, shared: false, pays: false, spouse: false, alimony: false, disabled: 0,
	degree: 'none', degreeYear: '', degreeYears: '', degreeLater: false, ma: false, maYear: '', maYears: '', maLater: false,
	discharge: '', served: '', aliyah: '', returning: false, reserve: '',
};

export function taxYear(rt, y) { return rt.years[String(y)] || null; }
export function yearsRange(rt) { const out = []; for (let y = rt.first_year; y <= rt.current_year; y += 1) { out.push(y); } return out; }
/** The years a refund can still be asked for in the current year: the last six that ended (s.160(א)). */
export function refundYears(rt) { const out = []; for (let y = rt.current_year - rt.refund.years_back; y < rt.current_year; y += 1) { out.push(y); } return out; }
export function refundDeadline(rt, y) { return `${y + rt.refund.years_back}-12-31`; }

/** The tax on an annual income by a year's brackets: [upper limit or null, rate %]. */
export function bracketTax(brackets, income) {
	const rows = [];
	let low = 0;
	let tax = 0;
	let marginal = brackets[0][1];
	for (const [cap, rate] of brackets) {
		const top = cap === null ? Infinity : cap;
		const part = income > low ? Math.min(income, top) - low : 0;
		const t = part * rate / 100;
		if (part > 0) { marginal = rate; }
		rows.push({ from: low, to: cap, rate, part: r2t(part), tax: r2t(t) });
		tax += t;
		if (top === Infinity) { break; }
		low = top;
	}
	return { tax: r2t(tax), rows, marginal };
}

/** The year's tax before credits: the brackets and the surtax of s.121ב on the part above its line. */
export function grossTax(rt, y, income) {
	const row = taxYear(rt, y);
	const b = bracketTax(row.brackets, income);
	const over = Math.max(0, income - row.surtax.threshold);
	const surtax = r2t(over * row.surtax.pct / 100);
	return { brackets: b.rows, bracketTax: b.tax, surtax, surtaxOver: r2t(over), total: r2t(b.tax + surtax), marginal: b.marginal + (over > 0 ? row.surtax.pct : 0) };
}

export function kidsPeriod(rt, y) { return rt.points.kids.find((p) => p.from <= y && y <= p.to) || null; }
export function bandPts(bands, age) { const b = bands.find((x) => x[0] <= age && age <= x[1]); return b ? b[2] : 0; }

/** Months of a year that fall inside a run of months starting at (startY, startM 1-12), with a rate per segment. */
function monthsIn(y, startY, startM, segments) {
	let pts = 0;
	let months = 0;
	for (let m = 1; m <= 12; m += 1) {
		let idx = (y * 12 + m) - (startY * 12 + startM);
		if (idx < 0) { continue; }
		for (const [len, num, den] of segments) {
			if (idx < len) { pts += num / den; months += 1; break; }
			idx -= len;
		}
	}
	return { pts, months };
}

/** Combat reservists (s.39ב): points in a tax year for the days served in the year before. */
export function reservistPts(rt, y, days) {
	const rv = rt.points.reservist;
	const d = Number(days) || 0;
	if (y < rv.from_year || !rv.temp_years.includes(y) || d <= 0) { return 0; }
	if (d >= rv.base_days) { return Math.min(rv.max_pts, rv.base_pts + Math.floor((d - rv.base_days) / rv.step_days) * rv.step_pts); }
	const band = rv.temp_bands.find((b) => b[0] <= d && d <= b[1]);
	return band ? band[2] : 0;
}

/** Degree or certificate points in a tax year (ss.40ג-40ה): the 2014-2022 temporary rule, or the rule from 2023. */
export function degreePts(rt, type, done, studyYears, later, y) {
	const dg = rt.points.degree;
	if (type === 'none' || !done) { return 0; }
	if (done >= dg.temp.from && done <= dg.temp.to) {
		const first = done + 1 + (later ? 1 : 0);
		if (type === 'med') { return y === first ? dg.temp.med[0] : y === first + 1 ? dg.temp.med[1] : 0; }
		return y === first ? dg.temp[type] : 0;
	}
	if (done < dg.rule_from) { return 0; }
	const start = done + 1;
	if (type === 'med') {
		const [[a, na], [b, nb]] = dg.rule.med;
		if (y >= start && y < start + na) { return a; }
		if (y >= start + na && y < start + na + nb) { return b; }
		return 0;
	}
	const [pts, max] = dg.rule[type];
	const n = Math.min(Math.max(1, Math.floor(studyYears || max)), max);
	return y >= start && y < start + n ? pts : 0;
}

/** Reads the profile from raw values (strings from a form, numbers from a state), and lists the input errors. */
export function normalizeProfile(rt, raw) {
	const p = Object.assign({}, PROFILE_DEFAULT, raw || {});
	const errors = [];
	const cy = rt.current_year;
	p.gender = p.gender === 'm' ? 'm' : p.gender === 'f' ? 'f' : '';
	if (!p.gender) { errors.push({ field: 'gender', he: 'מגדר: לבחור אישה או גבר' }); }
	p.marital = p.marital === 'single' ? 'single' : 'married';
	const kids = Array.isArray(p.kids) ? p.kids : [];
	p.kids = [];
	kids.forEach((k, i) => {
		const rawY = Array.isArray(k) ? k[0] : k && k.y;
		if (blankT(rawY)) { return; } // a row added and not filled yet
		const y = intT(rawY);
		const home = Array.isArray(k) ? Number(k[1]) !== 0 : !(k && k.home === false);
		if (!(Number.isInteger(y) && y >= 1990 && y <= cy)) { errors.push({ field: `kid-${i}`, he: `שנת הלידה של ילד ${i + 1}: שנה בין 1990 ל-${cy}` }); return; }
		p.kids.push([y, home ? 1 : 0]);
	});
	if (kids.length > 12) { errors.push({ field: 'kids', he: 'עד 12 ילדים בחישוב' }); }
	p.disabled = blankT(p.disabled) ? 0 : Number(p.disabled);
	if (!(Number.isInteger(p.disabled) && p.disabled >= 0 && p.disabled <= 12)) { errors.push({ field: 'disabled', he: 'ילדים עם מוגבלות: מספר שלם, 0 עד 12' }); }
	p.degree = DEGREE_TYPES.includes(p.degree) ? p.degree : 'none';
	const yearField = (key, label) => {
		const v = intT(p[key]);
		if (!(Number.isInteger(v) && v >= 1990 && v <= cy)) { errors.push({ field: key, he: `${label}: שנה בין 1990 ל-${cy}` }); return ''; }
		return v;
	};
	const studyField = (key, label) => {
		if (blankT(p[key])) { return ''; }
		const v = Number(p[key]);
		if (!(Number.isInteger(v) && v >= 1 && v <= 10)) { errors.push({ field: key, he: `${label}: מספר שלם, 1 עד 10` }); return ''; }
		return v;
	};
	if (p.degree !== 'none') { p.degreeYear = yearField('degreeYear', 'שנת סיום הלימודים'); p.degreeYears = studyField('degreeYears', 'שנות הלימוד'); } else { p.degreeYear = ''; p.degreeYears = ''; p.degreeLater = false; }
	p.ma = Boolean(p.ma);
	if (p.ma) { p.maYear = yearField('maYear', 'שנת סיום התואר השני'); p.maYears = studyField('maYears', 'שנות הלימוד לתואר השני'); } else { p.maYear = ''; p.maYears = ''; p.maLater = false; }
	p.degreeLater = Boolean(p.degreeLater);
	p.maLater = Boolean(p.maLater);
	if (!blankT(p.discharge)) {
		const d = parseDate(p.discharge);
		if (!d || d < '1990-01-01' || d > `${cy}-12-31`) { errors.push({ field: 'discharge', he: 'תאריך השחרור: תאריך מלא, לדוגמה 31.8.2022' }); p.discharge = ''; } else { p.discharge = d; }
		const s = Number(p.served);
		if (!(Number.isInteger(s) && s >= 1 && s <= 60)) { errors.push({ field: 'served', he: 'חודשי שירות מלאים: מספר שלם, 1 עד 60' }); }
		p.served = Number.isInteger(s) ? s : '';
	} else { p.discharge = ''; p.served = ''; }
	if (!blankT(p.aliyah)) {
		const a = parseDate(p.aliyah);
		if (!a || a < '1990-01-01' || a > `${cy}-12-31`) { errors.push({ field: 'aliyah', he: 'תאריך העלייה: תאריך מלא, לדוגמה 15.3.2023' }); p.aliyah = ''; } else { p.aliyah = a; }
	} else { p.aliyah = ''; }
	p.returning = Boolean(p.returning);
	if (!blankT(p.reserve)) {
		const r = Number(p.reserve);
		if (!(Number.isInteger(r) && r >= 0 && r <= 366)) { errors.push({ field: 'reserve', he: 'ימי מילואים כלוחם: מספר שלם, 0 עד 366' }); }
		p.reserve = Number.isInteger(r) ? r : '';
	}
	for (const k of ['sole', 'shared', 'pays', 'spouse', 'alimony']) { p[k] = Boolean(p[k]); }
	if (p.marital === 'married') { p.sole = false; p.shared = false; } else { p.spouse = false; p.alimony = false; }
	return { p, errors };
}

/** The credit points of a normalized profile in one tax year, line by line with the section and the Form 101 item. */
export function pointsFor(rt, p, y) {
	const pt = rt.points;
	const f101 = rt.form101.items;
	const lines = [];
	const notes = [];
	const add = (key, he, pts, section, url, item) => { if (pts > 0) { lines.push({ key, he, pts: r4t(pts), section, url: url || rt.law_url, f101: item || '' }); } };
	add('resident', 'תושב/ת ישראל: 2 נקודות, ועוד רבע נקודת נסיעה', pt.resident.pts + pt.travel.pts, `${pt.resident.section} ו-36`, rt.law_url, f101.resident);
	if (p.gender === 'f') { add('woman', 'אישה', pt.woman.pts, pt.woman.section, rt.law_url, f101.woman); }
	const period = kidsPeriod(rt, y);
	const married = p.marital === 'married';
	let homeKids = 0;
	let awayKids = 0;
	const kidLines = [];
	p.kids.forEach(([by, home], i) => {
		const age = y - by;
		if (age < 0 || age > pt.kids_max_age) { return; }
		if (home) { homeKids += 1; } else { awayKids += 1; }
		const col1 = bandPts(period.col1, age);
		const col2 = bandPts(period.col2, age);
		let pts;
		let col;
		let section;
		if (married) {
			col = home && p.gender === 'f' ? 1 : 2;
			pts = col === 1 ? col1 : col2;
			section = col === 1 ? pt.kids_sections.married_woman : pt.kids_sections.married_man;
		} else if (home && p.sole) {
			col = 3; pts = col1 + col2; section = `${pt.kids_sections.single_with} ו-(1א)`;
		} else {
			col = home ? 1 : 2;
			pts = col === 1 ? col1 : col2;
			section = col === 1 ? pt.kids_sections.single_with : pt.kids_sections.single_without;
		}
		const ageHe = age === 0 ? 'בשנת הלידה' : age === 18 ? 'בשנת הבגרות (18)' : `בן/בת ${age}`;
		kidLines.push({ i, by, age, home: Boolean(home), col, pts });
		add(`kid${i}`, `ילד/ה ${i + 1}, נולד/ה ב-${by}: ${ageHe} ב-${y}${home ? '' : ', גר/ה אצל ההורה השני'}`, pts, section, period.url, col === 1 || col === 3 ? f101.kids_col1 : f101.kids_col2);
	});
	if (!married && homeKids && p.sole) { add('sole', pt.sole_parent.he, pt.sole_parent.pts, pt.sole_parent.section, rt.law_url, f101.sole_parent); }
	if (!married && homeKids && !p.sole && !p.shared) { add('single', pt.single_parent.he, pt.single_parent.pts, pt.single_parent.section, rt.law_url, f101.single_parent); }
	if (!married && homeKids && !p.sole && p.shared) { notes.push({ code: 'shared', he: 'מי שמנהל משק בית משותף עם יחיד אחר לא מקבל את נקודת המשפחה החד-הורית (סעיף 40(ב)(2)).', section: pt.single_parent.section }); }
	if (awayKids && p.pays) { add('support', pt.support.he, pt.support.pts, pt.support.section, rt.law_url, f101.support); }
	if (married && p.alimony) { add('alimony', pt.alimony.he, pt.alimony.pts, pt.alimony.section, rt.law_url, f101.alimony); }
	if (married && p.spouse) { add('spouse', pt.spouse.he, pt.spouse.pts, pt.spouse.section, rt.law_url, f101.spouse); }
	if (p.disabled > 0) { add('disabled', `${p.disabled} ${p.disabled === 1 ? 'ילד' : 'ילדים'} עם מוגבלות, 2 נקודות לכל ילד`, p.disabled * pt.disabled_child.pts, pt.disabled_child.section, rt.law_url, f101.disabled_child); }
	// Discharged soldier: the 36 months after the month of discharge.
	if (p.discharge) {
		const [dy, dm] = p.discharge.split('-').map(Number);
		const sd = pt.soldier;
		const full = p.served >= (p.gender === 'f' ? sd.min_months_woman : sd.min_months_man);
		const seg = [[sd.months, full ? sd.full_rate_num : sd.short_rate_num, full ? sd.full_rate_den : sd.short_rate_den]];
		const start = dm === 12 ? [dy + 1, 1] : [dy, dm + 1];
		const got = monthsIn(y, start[0], start[1], seg);
		add('soldier', `חייל/ת משוחרר/ת: ${got.months} חודשים ב-${y} × ${full ? '1/6' : '1/12'} נקודה`, got.pts, sd.section, sd.url, f101.soldier);
	}
	// New immigrant (or a returning minor): from the month of entry, by the schedule in force on the day of aliyah.
	if (p.aliyah) {
		const im = pt.immigrant;
		const [ay, am] = p.aliyah.split('-').map(Number);
		if (p.returning) {
			notes.push({ code: 'returning', he: im.returning_he, section: im.section });
		} else {
			const seg = p.aliyah >= im.reform_from ? im.after : im.before;
			const got = monthsIn(y, ay, am, seg);
			add('immigrant', `עולה (${p.aliyah >= im.reform_from ? 'מ-2022' : 'לפני 2022'}): ${got.months} חודשים ב-${y}`, got.pts, im.section, im.url, f101.immigrant);
		}
	}
	// Degrees and certificates.
	const dg = pt.degree;
	if (p.degree !== 'none') {
		const v = degreePts(rt, p.degree, p.degreeYear, p.degreeYears, p.degreeLater, y);
		add('degree', `${DEGREE_HE[p.degree]}, סיום ב-${p.degreeYear}`, v, dg.sections[p.degree], dg.url, f101.degree);
	}
	if (p.ma) {
		const v = degreePts(rt, 'ma', p.maYear, p.maYears, p.maLater, y);
		add('ma', `תואר שני, סיום ב-${p.maYear}`, v, dg.sections.ma, dg.url, f101.degree);
	}
	// Combat reservists (from 2026, for the days in the year before).
	if (p.reserve) {
		const v = reservistPts(rt, y, p.reserve);
		add('reservist', `מילואים כלוחם: ${p.reserve} ימים ב-${y - 1}`, v, pt.reservist.section, pt.reservist.url, f101.reservist);
		if (!v && y < pt.reservist.from_year) { notes.push({ code: 'reservist_year', he: `נקודות על שירות מילואים כלוחם ניתנות מ-${pt.reservist.from_year}, על הימים של השנה שלפני (סעיף 39ב).`, section: pt.reservist.section }); }
	}
	const total = r4t(lines.reduce((a, l) => a + l.pts, 0));
	const row = taxYear(rt, y);
	return { year: y, lines, total, notes, kidLines, monthly: r2t(total * row.point_month), value: r2t(total * row.point_year), pointMonth: row.point_month, pointYear: row.point_year };
}

/** The builder: the points of the chosen year, every year 2020-2026, and what to write on Form 101. */
export function computePoints(registry, input) {
	const rt = registry.rights_tax;
	const { p, errors } = normalizeProfile(rt, input);
	const y = blankT(input && input.year) ? rt.current_year : Number(input.year);
	if (!(Number.isInteger(y) && y >= rt.first_year && y <= rt.current_year)) { errors.push({ field: 'year', he: `שנת המס: ${rt.first_year} עד ${rt.current_year}` }); }
	if (errors.length) { return { ok: false, errors }; }
	const now = pointsFor(rt, p, y);
	const base = rt.points.resident.pts + rt.points.travel.pts + (p.gender === 'f' ? rt.points.woman.pts : 0);
	const refundable = refundYears(rt);
	const years = yearsRange(rt).map((yy) => {
		const r = pointsFor(rt, p, yy);
		return { year: yy, total: r.total, value: r.value, monthly: r.monthly, extra: r4t(r.total - base), refundable: refundable.includes(yy), deadline: refundable.includes(yy) ? refundDeadline(rt, yy) : '' };
	});
	const items = [];
	now.lines.forEach((l) => { if (l.f101 && !items.includes(l.f101)) { items.push(l.f101); } });
	return { ok: true, profile: p, year: y, current: y === rt.current_year, base, ...now, years, f101: items, missed: years.filter((r) => r.refundable && r.extra > 0) };
}

/* ---------------- The refund ---------------- */

/** One refund row as entered from Form 106: year, salary (158/172), tax (042), months, the points the employer gave. */
function normalizeRow(rt, raw, i, seen) {
	const errors = [];
	const f = (k) => `${k}-${i}`;
	const y = intT(raw.y);
	const years = refundYears(rt);
	if (!(Number.isInteger(y) && years.includes(y))) { errors.push({ field: f('y'), he: `שנת המס: ${years[0]} עד ${years[years.length - 1]} (שש השנים האחרונות, סעיף 160)` }); }
	if (Number.isInteger(y) && seen.includes(y)) { errors.push({ field: f('y'), he: `השנה ${y} כבר ברשימה: מחברים את טופסי 106 של אותה שנה לשורה אחת` }); }
	// A year listed and not filled yet (e.g. sent here from the builder): waits for the Form 106 figures, no error.
	if (blankT(raw.income) && blankT(raw.tax)) { return { errors, row: { i, y, pending: true } }; }
	const money = (k, label) => {
		if (blankT(raw[k])) { return 0; }
		const v = Number(raw[k]);
		if (!(Number.isFinite(v) && v >= 0 && v < 1e8)) { errors.push({ field: f(k), he: `${label}: מספר חיובי או 0` }); return 0; }
		return v;
	};
	const income = money('income', 'ההכנסה החייבת (שדה 158/172)');
	const tax = money('tax', 'המס שנוכה (שדה 042)');
	const months = blankT(raw.months) ? 12 : Number(raw.months);
	if (!(Number.isInteger(months) && months >= 0 && months <= 12)) { errors.push({ field: f('months'), he: 'חודשי עבודה: מספר שלם, 0 עד 12' }); }
	if (months === 0 && income > 0) { errors.push({ field: f('months'), he: 'יש הכנסה בשנה הזאת: חודשי העבודה 1 עד 12' }); }
	const emp = blankT(raw.emp) ? null : Number(raw.emp);
	if (emp !== null && !(Number.isFinite(emp) && emp >= 0 && emp <= 40)) { errors.push({ field: f('emp'), he: 'הנקודות שהמעסיק נתן (טופס 106, חלק ג, סעיף 16): 0 עד 40' }); }
	const pts = blankT(raw.pts) ? null : Number(raw.pts);
	if (pts !== null && !(Number.isFinite(pts) && pts >= 0 && pts <= 40)) { errors.push({ field: f('pts'), he: 'הנקודות שמגיעות לכם: 0 עד 40' }); }
	const jobs = blankT(raw.jobs) ? 1 : Number(raw.jobs);
	if (!(Number.isInteger(jobs) && jobs >= 1 && jobs <= 9)) { errors.push({ field: f('jobs'), he: 'מספר המעסיקים: 1 עד 9' }); }
	return {
		errors,
		row: { i, y, income, tax, months, emp, pts, jobs, coord: Boolean(raw.coord), don: money('don', 'תרומות (שדה 037/237)'), life: money('life', 'ביטוח חיים (שדה 036/081)'), pen: money('pen', 'קופת גמל לקצבה בהפקדה עצמית') },
	};
}

/** One tax year: the liability with that year's brackets and points, the donation credit, the refund and the reasons. */
export function refundYear(rt, p, row) {
	const yr = taxYear(rt, row.y);
	const fromProfile = pointsFor(rt, p, row.y);
	const points = row.pts === null ? fromProfile.total : row.pts;
	const gross = grossTax(rt, row.y, row.income);
	const ptsValue = r2t(points * yr.point_year);
	const ptsCredit = Math.min(gross.total, ptsValue);
	const unused = r2t(ptsValue - ptsCredit);
	const dn = rt.donation;
	const donEligible = row.don > yr.donation.min ? r2t(Math.min(row.don, row.income * dn.income_cap_pct / 100, yr.donation.max)) : 0;
	const donCredit = r2t(donEligible * dn.pct / 100);
	const donApplied = r2t(Math.min(donCredit, Math.max(0, gross.total - ptsCredit)));
	const liability = r2t(Math.max(0, gross.total - ptsCredit - donApplied));
	const diff = r2t(row.tax - liability);
	const reasons = [];
	const reason = (code, he, section, url) => reasons.push({ code, he, section: section || '', url: url || rt.law_url });
	if (row.income === 0 && row.tax === 0) { reason('none', 'לא הייתה הכנסה ממשכורת בשנה הזאת: אין מס ואין החזר.', ''); }
	if (row.months > 0 && row.months < 12 && row.income > 0) { reason('partial', `עבדתם ${row.months} חודשים: המעסיק נותן נקודות ומדרגות רק לחודשי העבודה, והחישוב השנתי מביא בחשבון את כל השנה.`, rt.brackets_section, yr.url); }
	if (row.jobs > 1 && !row.coord) { reason('twojobs', `${row.jobs} מעסיקים בלי תיאום מס: מי שלא קיבל את טופס 101 עם הנקודות מנכה מס מרבי, והשנה נסגרת רק בחישוב השנתי.`, 'טופס 101, הערות 7 ו-8', rt.form101.url); }
	if (row.emp !== null && points > row.emp + 0.001) { reason('points', `מגיעות לכם ${fmtPts(points)} נקודות, והמעסיק נתן ${fmtPts(row.emp)}: ההפרש, ${fmtPts(r4t(points - row.emp))} נקודות, שווה עד ${fmtNis(r2t((points - row.emp) * yr.point_year))} בשנה.`, rt.point_section, yr.url); }
	if (donApplied > 0) { reason('donations', `תרומות של ${fmtNis(row.don)}: זיכוי של ${dn.pct}%${donEligible < row.don ? ` על ${fmtNis(donEligible)} (התקרה)` : ''}, ${fmtNis(donApplied)}.`, dn.section, yr.url); }
	if (row.don > 0 && row.don <= yr.donation.min) { reason('don_min', `תרומות של ${fmtNis(row.don)} לא עוברות את המינימום של ${row.y}, ${fmtNis(yr.donation.min)}: אין זיכוי.`, dn.section, yr.url); }
	if (unused > 0 && row.income > 0) { reason('unused', `הנקודות שוות ${fmtNis(ptsValue)}, יותר מהמס (${fmtNis(gross.total)}): המס יורד ל-0, והיתרה לא מוחזרת. אין מס שלילי.`, rt.point_section, yr.url); }
	if (gross.surtax > 0) { reason('surtax', `מס נוסף של ${yr.surtax.pct}% על ${fmtNis(gross.surtaxOver)}, החלק שמעל ${fmtNis(yr.surtax.threshold)}.`, rt.surtax_section, yr.url); }
	if (yr.change_ages && p.kids.some(([by]) => row.y - by >= yr.change_ages[0] && row.y - by <= yr.change_ages[1])) { reason('change', `${yr.change_he}. אם המעסיק לא תיקן את התלושים, ההפרש מוחזר כאן.`, '', yr.change_url); }
	const insuranceUpTo = r2t(row.life * rt.insurance.life_pct / 100 + row.pen * rt.insurance.pension_pct / 100);
	return {
		y: row.y, i: row.i, income: row.income, tax: row.tax, months: row.months, emp: row.emp, jobs: row.jobs, coord: row.coord,
		points, pointsSource: row.pts === null ? 'profile' : 'manual', pointsLines: fromProfile.lines, pointYear: yr.point_year,
		gross, ptsValue, ptsCredit: r2t(ptsCredit), unused,
		donation: { amount: row.don, eligible: donEligible, credit: donCredit, applied: donApplied, min: yr.donation.min, max: yr.donation.max },
		liability, refund: diff > 0 ? diff : 0, owe: diff < 0 ? r2t(-diff) : 0, reasons,
		insuranceUpTo, life: row.life, pen: row.pen, deadline: refundDeadline(rt, row.y), source: yr.url,
	};
}

/** The refund calculator: every year entered, the total, and the deadlines. */
export function computeRefund(registry, input) {
	const rt = registry.rights_tax;
	const { p, errors } = normalizeProfile(rt, input);
	const rawRows = Array.isArray(input && input.rows) ? input.rows : [];
	if (!rawRows.length) { errors.push({ field: 'rows', he: 'לפחות שנת מס אחת' }); }
	if (rawRows.length > refundYears(rt).length) { errors.push({ field: 'rows', he: `עד ${refundYears(rt).length} שנים` }); }
	const rows = [];
	const seen = [];
	rawRows.forEach((raw, i) => {
		const n = normalizeRow(rt, raw || {}, i, seen);
		errors.push(...n.errors);
		if (Number.isInteger(n.row.y)) { seen.push(n.row.y); }
		rows.push(n.row);
	});
	if (errors.length) { return { ok: false, errors }; }
	const pending = rows.filter((row) => row.pending).map((row) => row.y).sort();
	const years = rows.filter((row) => !row.pending).map((row) => refundYear(rt, p, row)).sort((a, b) => a.y - b.y);
	const total = r2t(years.reduce((a, r) => a + r.refund, 0));
	const owe = r2t(years.reduce((a, r) => a + r.owe, 0));
	const deadlines = years.filter((r) => r.refund > 0).map((r) => ({ y: r.y, date: r.deadline }));
	return { ok: true, profile: p, years, pending, total, owe, deadlines, withRefund: years.filter((r) => r.refund > 0).length };
}

/** The contract's single entry point: the refund when the input carries rows, the points otherwise. */
export function compute(registry, input) {
	return input && Array.isArray(input.rows) ? computeRefund(registry, input) : computePoints(registry, input);
}

/* ---------------- Text helpers the two UIs share ---------------- */

export function fmtPts(n) {
	const v = r4t(Number(n) || 0);
	return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100);
}
export function fmtNis(n) {
	const v = r2t(Number(n) || 0);
	return `${v.toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 })} ₪`;
}
export function ageBand(age) { return age === 0 ? 'שנת הלידה' : age === 18 ? '18' : String(age); }

/** The profile fields, shared by both forms (prefix = the tool's CSS prefix). No name, ID or employer field. */
export function profileForm(prefix, rt, input, opts = {}) {
	const P = prefix;
	const p = Object.assign({}, PROFILE_DEFAULT, input || {});
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${escT(value)}"${checked ? ' checked' : ''}><span>${escT(label)}</span></label>`;
	const text = (id, label, value, ph, mode = 'numeric', hint = '') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${escT(label)}</label><input id="${P}-${id}" type="text" inputmode="${mode}" autocomplete="off" value="${escT(value)}" placeholder="${escT(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint">${escT(hint)}</p>` : ''}</div>`;
	const heDate = (iso) => { if (!iso) { return ''; } const parts = String(iso).split('-').map(Number); return parts.length === 3 && parts[2] ? `${parts[2]}.${parts[1]}.${parts[0]}` : String(iso); };
	const married = p.marital !== 'single';
	const kids = Array.isArray(p.kids) ? p.kids : [];
	const kidRow = (k, i) => `<li class="jtool-rep__row ${P}-kid" data-kid="${i}"><div class="jtool-field"><label class="jtool-label" for="${P}-kid-${i}">ילד/ה ${i + 1}: שנת לידה</label><input id="${P}-kid-${i}" type="text" inputmode="numeric" autocomplete="off" maxlength="4" value="${escT(k[0])}" placeholder="לדוגמה: 2019" aria-describedby="${P}-kid-${i}-e"><p class="jtool-error" id="${P}-kid-${i}-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><span class="jtool-label">גר/ה</span><div class="jtool-chips">${chip(`home-${i}`, '1', 'איתי', Number(k[1]) !== 0)}${chip(`home-${i}`, '0', 'אצל ההורה השני', Number(k[1]) === 0)}</div></div>`
		+ `<button class="jtool-iconbtn" type="button" data-act="kid-del" data-kid-del="${i}" aria-label="להסיר את ילד/ה ${i + 1}">✕</button></li>`;
	return `<fieldset class="jtool-field"><legend>מי אתם</legend><div class="jtool-chips">${chip('g', 'f', 'אישה', p.gender === 'f')}${chip('g', 'm', 'גבר', p.gender === 'm')}</div><p class="jtool-error" id="${P}-gender-e" role="alert"></p>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('ms', 'married', 'נשוי/אה וגרים יחד', married)}${chip('ms', 'single', 'לא נשוי/אה: רווק/ה, גרוש/ה, אלמן/ה, פרוד/ה', !married)}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>ילדים עד גיל 18</legend><ol class="jtool-rep" data-kids>${kids.map(kidRow).join('')}</ol><p class="jtool-error" id="${P}-kids-e" role="alert"></p>`
		+ `<button class="jtool-linkbtn" type="button" data-act="kid-add">+ להוסיף ילד/ה</button>`
		+ `<div class="jtool-chips" data-if-single${married ? ' hidden' : ''} style="margin-top:8px">${chip('sole', '1', 'הורה יחיד: ההורה השני נפטר או לא רשום', p.sole, 'checkbox')}${chip('shared', '1', 'אני מנהל/ת משק בית משותף עם בן/בת זוג', p.shared, 'checkbox')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('pays', '1', 'אני משלם/ת מזונות לילדים שגרים אצל ההורה השני', p.pays, 'checkbox')}</div>`
		+ `<p class="jtool-hint">${escT(rt.points.kids_move_he)}.</p></fieldset>`
		+ `<details class="jtool-more"${p.degree !== 'none' || p.ma ? ' open' : ''}${opts.openDegree ? ' open' : ''}><summary>תואר או תעודת מקצוע</summary>`
		+ `<div class="jtool-chips" style="margin-top:8px">${DEGREE_TYPES.map((k) => chip('dg', k, DEGREE_HE[k], p.degree === k)).join('')}</div>`
		+ `<div class="jtool-row" data-if-degree${p.degree === 'none' ? ' hidden' : ''} style="margin-top:8px">${text('dgy', 'שנת סיום הלימודים', p.degreeYear, 'לדוגמה: 2024')}${text('dgn', 'כמה שנות לימוד', p.degreeYears, 'ריק = המקסימום')}</div>`
		+ `<div class="jtool-chips" data-if-degree${p.degree === 'none' ? ' hidden' : ''} style="margin-top:8px">${chip('dgl', '1', 'סיימתי עד 2022 ובחרתי לקבל את הנקודה שנה אחר כך', p.degreeLater, 'checkbox')}${chip('ma', '1', 'גם תואר שני', p.ma, 'checkbox')}</div>`
		+ `<div class="jtool-row" data-if-ma${p.ma ? '' : ' hidden'} style="margin-top:8px">${text('may', 'שנת סיום התואר השני', p.maYear, 'לדוגמה: 2025')}${text('man', 'שנות לימוד לתואר השני', p.maYears, 'ריק = 2')}</div>`
		+ `<p class="jtool-hint">${escT(rt.points.degree.rule_he)}. ${escT(rt.points.degree.temp_he)}.</p></details>`
		+ `<details class="jtool-more"${p.discharge || p.aliyah || p.reserve ? ' open' : ''}><summary>שירות צבאי או לאומי, מילואים, עלייה</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${text('dis', 'תאריך השחרור', heDate(p.discharge), 'לדוגמה: 31.8.2024')}${text('srv', 'חודשי שירות מלאים', p.served, 'לדוגמה: 32')}</div>`
		+ `<p class="jtool-hint">${escT(rt.points.soldier.he)}.</p>`
		+ `${text('res', 'ימי מילואים כלוחם בשנה הקודמת (לפי אישור צה"ל)', p.reserve, '0', 'numeric', rt.points.reservist.he)}`
		+ `<div class="jtool-row" style="margin-top:8px">${text('aly', 'תאריך העלייה', heDate(p.aliyah), 'לדוגמה: 15.3.2023')}<div class="jtool-field"><span class="jtool-label">מעמד</span><div class="jtool-chips">${chip('ret', '0', 'עולה או קטין חוזר', !p.returning)}${chip('ret', '1', 'תושב חוזר', p.returning)}</div></div></div>`
		+ `<p class="jtool-hint">${escT(rt.points.immigrant.he)}.</p></details>`
		+ `<details class="jtool-more"${p.disabled || p.spouse || p.alimony ? ' open' : ''}><summary>ילד עם מוגבלות, בן/בת זוג, מזונות</summary>`
		+ `<div style="margin-top:8px">${text('dsb', 'ילדים עם מוגבלות שבגינם מגיעה גמלת ילד נכה', p.disabled || '', '0', 'numeric', rt.points.disabled_child.he)}</div>`
		+ `<div class="jtool-chips" data-if-married${married ? '' : ' hidden'} style="margin-top:8px">${chip('sp', '1', 'בן/בת הזוג בלי הכנסה, ואחד מאיתנו בגיל פרישה או נכה או עיוור', p.spouse, 'checkbox')}${chip('al', '1', 'נישאתי שוב ואני משלם/ת מזונות לבן/בת הזוג לשעבר', p.alimony, 'checkbox')}</div></details>`;
}

/** The profile from a form, through an accessor: val(id) for a text field, on(name) for a checked box, pick(name) for a radio. */
export function readProfile(val, on, pick, kidCount) {
	const kids = [];
	for (let i = 0; i < kidCount; i += 1) {
		const y = String(val(`kid-${i}`) || '').trim();
		kids.push([/^\d+$/.test(y) ? Number(y) : y, pick(`home-${i}`, '1') === '0' ? 0 : 1]);
	}
	const num = (id) => { const v = String(val(id) || '').trim().replace(/,/g, ''); return v === '' ? '' : Number(v); };
	return {
		gender: pick('g', 'f'), marital: pick('ms', 'married'), kids, sole: on('sole'), shared: on('shared'), pays: on('pays'),
		spouse: on('sp'), alimony: on('al'), disabled: num('dsb'),
		degree: pick('dg', 'none'), degreeYear: num('dgy'), degreeYears: num('dgn'), degreeLater: on('dgl'), ma: on('ma'), maYear: num('may'), maYears: num('man'), maLater: false,
		discharge: String(val('dis') || '').trim(), served: num('srv'), aliyah: String(val('aly') || '').trim(), returning: pick('ret', '0') === '1', reserve: num('res'),
	};
}

/** Profile fields <-> the share state (letters A-Z; the tools use lower case for their own fields). */
export function profileState(p) {
	const n = (v) => (blankT(v) ? '' : String(v));
	return {
		G: p.gender === 'm' ? 'm' : 'f', M: p.marital === 'single' ? 's' : '', K: (p.kids || []).filter((k) => /^\d{4}$/.test(String(k[0]))).map((k) => [k[0], Number(k[1]) ? 1 : 0]),
		S: p.sole ? 1 : '', H: p.shared ? 1 : '', Y: p.pays ? 1 : '', W: p.spouse ? 1 : '', A: p.alimony ? 1 : '', D: p.disabled ? p.disabled : '',
		T: p.degree && p.degree !== 'none' ? p.degree : '', E: n(p.degreeYear), N: n(p.degreeYears), L: p.degreeLater ? 1 : '',
		Q: p.ma ? 1 : '', R: n(p.maYear), U: n(p.maYears), X: p.discharge ? String(p.discharge).replace(/-/g, '') : '', V: n(p.served),
		O: p.aliyah ? String(p.aliyah).replace(/-/g, '') : '', B: p.returning ? 1 : '', F: n(p.reserve),
	};
}
export const PROFILE_KEYS = ['G', 'M', 'K', 'S', 'H', 'Y', 'W', 'A', 'D', 'T', 'E', 'N', 'L', 'Q', 'R', 'U', 'X', 'V', 'O', 'B', 'F'];
export function profileFromState(s) {
	const iso = (v) => (/^\d{8}$/.test(v || '') ? `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}` : '');
	const kids = String(s.K || '').split('~').filter(Boolean).map((x) => x.split('_')).filter((x) => x.length === 2 && /^\d{4}$/.test(x[0])).map((x) => [Number(x[0]), x[1] === '0' ? 0 : 1]);
	const num = (v) => (v === undefined || v === '' ? '' : Number(v));
	return {
		gender: s.G === 'm' ? 'm' : 'f', marital: s.M === 's' ? 'single' : 'married', kids, sole: s.S === '1', shared: s.H === '1', pays: s.Y === '1',
		spouse: s.W === '1', alimony: s.A === '1', disabled: s.D ? Number(s.D) : 0,
		degree: DEGREE_TYPES.includes(s.T) ? s.T : 'none', degreeYear: num(s.E), degreeYears: num(s.N), degreeLater: s.L === '1',
		ma: s.Q === '1', maYear: num(s.R), maYears: num(s.U), maLater: false,
		discharge: iso(s.X), served: num(s.V), aliyah: iso(s.O), returning: s.B === '1', reserve: num(s.F),
	};
}
