/**
 * The rights wave 2A (22.10.2026, HAD-578): the net-salary engine (sachar-neto, /net-salary-calculator/), gross to net 2026.
 *
 * Built on the wave-1 tax engine (mas-engine.js: the 2026 brackets of the law of 31.3.2026, the surtax and every credit
 * point with its section), the wave-1 National Insurance data (registry.rights_bituach: the reduced tier 7,703, the ceiling
 * 51,910, the employee, health and employer rates by age band) and registry.rights_neto (the 2026 booklet's pension and
 * study-fund ceilings, the pension credit, overtime, travel, a second job). The month is computed the way the withholding
 * regulations say: the month's salary × 12 through the annual brackets and the surtax, less the credit points and the
 * pension credit, ÷ 12.
 * Three ways in: a monthly gross, an hourly wage × hours, or the net the reader wants (solved back to the gross).
 * Exported names are prefixed (neto*) because the bundle also carries mas-engine.js, whose compute() owns that name.
 */
import { grossTax, normalizeProfile, pointsFor, PROFILE_DEFAULT } from './mas-engine.js';

const r2n = (n) => Math.round((Number(n) + 1e-9) * 100) / 100;
const blankN = (v) => v === '' || v === undefined || v === null;
const toNumN = (v) => (blankN(v) ? NaN : Number(String(v).replace(/[,\s₪]/g, '')));

export const NETO_MODES = ['gross', 'hourly', 'net'];
export const NETO_BANDS = ['work', 'u18', 'w_ret', 'r67', 'oap'];

export const NETO_DEFAULT = {
	mode: 'gross', gross: 12000, hourly: 45, hours: 182, net: 10000, ot125: 0, ot150: 0, travel: 0, extra: 0,
	pension: true, pe: 6, pr: 6.5, ps: 6, sf: false, sfe: 2.5, sfr: 7.5, band: 'work', points: '',
	second: false, gross2: 3000, coord: false,
	profile: Object.assign({}, PROFILE_DEFAULT, { gender: 'f', marital: 'married', kids: [[2019, 1], [2023, 1]] }),
};

/** National Insurance + health of one salary, from a starting point in the tiers (s.335; the rates by age band). */
export function netoBl(rb, band, amount, from = 0, fullFromFirst = false) {
	const T = rb.tier.amount;
	const M = rb.max.amount;
	const rate = rb.employee[band] || rb.employee.work;
	const a = Math.max(0, Number(amount) || 0);
	const f = Math.max(0, Number(from) || 0);
	let reduced = Math.max(0, Math.min(f + a, T) - Math.min(f, T));
	let full = Math.max(0, Math.min(f + a, M) - Math.max(f, T));
	if (fullFromFirst) { full = Math.max(0, Math.min(a, M)); reduced = 0; }
	const p = (x, r) => r2n(x * r / 100);
	const bl = r2n(p(reduced, rate.bl[0]) + p(full, rate.bl[1]));
	const health = r2n(p(reduced, rate.health[0]) + p(full, rate.health[1]));
	const employer = r2n(p(reduced, rate.employer[0]) + p(full, rate.employer[1]));
	return { reduced: r2n(reduced), full: r2n(full), above: r2n(Math.max(0, a - reduced - full)), bl, health, employer, rate };
}

/** The pension credit of s.45א for the month (35% of the employee's deposit, up to 7% of the insured salary capped at the
 * qualifying income; the 189 ₪ minimum base). The formula is read from the law; the booklet gives the caps. */
export function netoPensionCredit(rn, base, deposit) {
	const c = rn.pension_credit;
	const room = Math.max(c.min_base_month, (c.share_pct / 100) * Math.min(Math.max(0, base), c.cap_month));
	return r2n((c.rate / 100) * Math.min(Math.max(0, deposit), room));
}

/** The employer deposits above the s.3(ה3) and s.3(ה) ceilings, which become the employee's taxable income. */
export function netoImputed(rn, pb, er, es, kb, kr) {
	const e = rn.employer_ceiling;
	const erFree = (e.tagmulim_max_pct / 100) * Math.min(pb, e.tagmulim_salary_cap);
	const esFree = Math.min(pb / 12, e.severance_month_cap);
	const krFree = (rn.study_fund.employer_pct / 100) * Math.min(kb, rn.study_fund.salary_cap);
	const erT = r2n(Math.max(0, er - erFree));
	const esT = r2n(Math.max(0, es - esFree));
	const krT = r2n(Math.max(0, kr - krFree));
	return { erT, esT, krT, total: r2n(erT + esT + krT) };
}

/** The monthly income tax on a taxable salary: × 12 through the year's brackets and surtax, ÷ 12, less the credits. */
export function netoTax(rt, year, taxable, points, credit) {
	const g = grossTax(rt, year, Math.max(0, taxable) * 12);
	const before = r2n(g.total / 12);
	const row = rt.years[String(year)];
	const pointsValue = r2n(points * row.point_month);
	const tax = r2n(Math.max(0, before - pointsValue - credit));
	return { before, pointsValue, credit, tax, marginal: g.marginal, brackets: g.brackets, surtax: r2n(g.surtax / 12) };
}

function netoNormalize(registry, raw) {
	const rt = registry.rights_tax;
	const i = Object.assign({}, NETO_DEFAULT, raw || {});
	const errors = [];
	const e = (field, he) => errors.push({ field, he });
	const mode = NETO_MODES.includes(i.mode) ? i.mode : 'gross';
	const n = (k, lo, hi, he, dflt) => { const v = blankN(i[k]) ? dflt : toNumN(i[k]); if (!(v >= lo && v <= hi)) { e(k, he); return 0; } return v; };
	const gross = mode === 'gross' ? n('gross', 0, 2000000, 'השכר החודשי ברוטו: מספר, למשל 12,000', NaN) : 0;
	const hourly = mode === 'hourly' ? n('hourly', 1, 10000, 'השכר לשעה: מספר, למשל 45', NaN) : 0;
	const hours = mode === 'hourly' ? n('hours', 1, 400, 'שעות בחודש: 1 עד 400', 182) : 0;
	const net = mode === 'net' ? n('net', 1, 2000000, 'הנטו הרצוי: מספר, למשל 10,000', NaN) : 0;
	const ot125 = n('ot125', 0, 200, 'שעות נוספות ב-125%: 0 עד 200', 0);
	const ot150 = n('ot150', 0, 200, 'שעות נוספות ב-150%: 0 עד 200', 0);
	const travel = n('travel', 0, 100000, 'החזר נסיעות: מספר, 0 אם אין', 0);
	const extra = n('extra', 0, 2000000, 'תוספות אחרות: מספר, 0 אם אין', 0);
	const pension = Boolean(i.pension);
	const pe = pension ? n('pe', 0, 10, 'הפקדת העובד לפנסיה: 0% עד 10%', 6) : 0;
	const pr = pension ? n('pr', 0, 7.5, 'הפקדת המעסיק לתגמולים: 0% עד 7.5%', 6.5) : 0;
	const ps = pension ? n('ps', 0, 8.33, 'הפקדת המעסיק לפיצויים: 0% עד 8.33%', 6) : 0;
	const sf = Boolean(i.sf);
	const sfe = sf ? n('sfe', 0, 5, 'הפקדת העובד לקרן השתלמות: 0% עד 5%', 2.5) : 0;
	const sfr = sf ? n('sfr', 0, 10, 'הפקדת המעסיק לקרן השתלמות: 0% עד 10%', 7.5) : 0;
	const band = NETO_BANDS.includes(i.band) ? i.band : 'work';
	const points = blankN(i.points) ? '' : toNumN(i.points);
	if (points !== '' && !(points >= 0 && points <= 30)) { e('points', 'נקודות זיכוי: 0 עד 30'); }
	const second = Boolean(i.second);
	const gross2 = second ? n('gross2', 0, 2000000, 'השכר במשרה השנייה: מספר', 0) : 0;
	const prof = normalizeProfile(rt, i.profile || {});
	prof.errors.forEach((x) => errors.push(x));
	return { errors, p: { mode, gross, hourly, hours, net, ot125, ot150, travel, extra, pension, pe, pr, ps, sf, sfe, sfr, band, points, second, gross2, coord: Boolean(i.coord), profile: prof.p } };
}

/** One month from a base salary S, all else as normalized. */
export function netoMonth(registry, p, S) {
	const rt = registry.rights_tax;
	const rb = registry.rights_bituach;
	const rn = registry.rights_neto;
	const year = rn.year;
	const hourlyRate = p.mode === 'hourly' ? p.hourly : S / rn.overtime.divisor;
	const ot = r2n(hourlyRate * ((rn.overtime.first_pct / 100) * p.ot125 + (rn.overtime.next_pct / 100) * p.ot150));
	const G = r2n(S + ot + p.travel + p.extra);
	const pb = p.pension ? S : 0;
	const ep = r2n(pb * p.pe / 100);
	const er = r2n(pb * p.pr / 100);
	const es = r2n(pb * p.ps / 100);
	const kb = p.sf ? S : 0;
	const ke = r2n(kb * p.sfe / 100);
	const kr = r2n(kb * p.sfr / 100);
	const imp = netoImputed(rn, pb, er, es, kb, kr);
	const taxable = r2n(G + imp.total);
	const pts = p.points !== '' ? p.points : pointsFor(rt, p.profile, year).total;
	const credit = netoPensionCredit(rn, pb, ep);
	const tax = netoTax(rt, year, taxable, pts, credit);
	const bl = netoBl(rb, p.band, taxable);
	const net = r2n(G - tax.tax - bl.bl - bl.health - ep - ke);
	const employerCost = r2n(G + er + es + kr + bl.employer);
	return { S: r2n(S), hourlyRate: r2n(hourlyRate), ot, G, pb, ep, er, es, kb, ke, kr, imp, taxable, points: pts, credit, tax, bl, net, employerCost };
}

/** The second job: 47% without coordination (and NI at the full rate from the first shekel), or the coordinated tax. */
export function netoSecond(registry, p, m) {
	const rt = registry.rights_tax;
	const rb = registry.rights_bituach;
	const rn = registry.rights_neto;
	const g2 = p.gross2;
	if (!(g2 > 0)) { return null; }
	const flatTax = r2n(g2 * rn.second_job.rate / 100 + Math.max(0, g2 - rn.second_job.surtax_month) * rt.years[String(rn.year)].surtax.pct / 100);
	const flatBl = netoBl(rb, p.band, g2, 0, true);
	const both = netoTax(rt, rn.year, m.taxable + g2, m.points, m.credit);
	const coordTax = r2n(Math.max(0, both.tax - m.tax.tax));
	const coordBl = netoBl(rb, p.band, g2, m.taxable);
	const netFlat = r2n(g2 - flatTax - flatBl.bl - flatBl.health);
	const netCoord = r2n(g2 - coordTax - coordBl.bl - coordBl.health);
	return { gross: g2, flatTax, flatBl, coordTax, coordBl, netFlat, netCoord, stuck: r2n(netCoord - netFlat), net: p.coord ? netCoord : netFlat };
}

/** Gross to net for 2026: the month, the year, the employer's cost, the raise line and the second job. */
export function computeNeto(registry, input) {
	const { errors, p } = netoNormalize(registry, input);
	if (errors.length) { return { ok: false, errors }; }
	let S = p.mode === 'hourly' ? r2n(p.hourly * p.hours) : p.gross;
	if (p.mode === 'net') {
		// The net rises with the gross: bisect the base salary that leaves the net asked for.
		let lo = 0;
		let hi = Math.max(1000, p.net * 4);
		for (let k = 0; k < 80; k += 1) {
			const mid = (lo + hi) / 2;
			if (netoMonth(registry, p, mid).net < p.net) { lo = mid; } else { hi = mid; }
		}
		S = Math.round(hi * 100) / 100;
	}
	const m = netoMonth(registry, p, S);
	const up = netoMonth(registry, Object.assign({}, p, { mode: p.mode === 'hourly' ? 'gross' : p.mode }), S + 1000);
	const keep = r2n(up.net - m.net);
	const sec = p.second ? netoSecond(registry, p, m) : null;
	const deductions = r2n(m.tax.tax + m.bl.bl + m.bl.health + m.ep + m.ke);
	const rn = registry.rights_neto;
	const mw = registry.min_wage.rows[registry.min_wage.rows.length - 1];
	const notes = [];
	if (p.mode === 'hourly' && p.hourly < mw.hourly_182) { notes.push({ key: 'minwage', he: `השכר לשעה נמוך משכר המינימום לשעה (${mw.hourly_182} ₪ מ-${mw.from.split('-').reverse().join('.')}, לפי 182 שעות)` }); }
	if (p.mode !== 'hourly' && m.S > 0 && m.S < mw.monthly) { notes.push({ key: 'minwage', he: `השכר הבסיסי נמוך משכר המינימום למשרה מלאה (${mw.monthly.toLocaleString('en-US')} ₪ מ-${mw.from.split('-').reverse().join('.')}); במשרה חלקית זה יכול להיות תקין` }); }
	if (m.imp.total > 0) { notes.push({ key: 'imputed', he: `הפקדות מעסיק מעל התקרה (${m.imp.total.toFixed(2)} ₪) נזקפו כהכנסה חייבת במס ובביטוח לאומי` }); }
	if (m.tax.before > 0 && m.tax.tax === 0) { notes.push({ key: 'zero', he: 'נקודות הזיכוי מכסות את כל המס: לא מנוכה מס הכנסה, ואת היתרה לא מקבלים בכסף' }); }
	if (p.travel > 0) { notes.push({ key: 'travel', he: `החזר נסיעות הוא הכנסה חייבת; לפי צו ההרחבה עד ${rn.travel.max_day.toFixed(2)} ₪ ליום עבודה` }); }
	return {
		ok: true, p, year: rn.year, m, keep, sec, deductions,
		gross: m.G, net: m.net, tax: m.tax.tax, bl: m.bl.bl, health: m.bl.health, pension: m.ep, study: m.ke,
		employerCost: m.employerCost, effective: m.G > 0 ? r2n((m.tax.tax + m.bl.bl + m.bl.health) / m.G * 100) : 0,
		marginal: m.tax.marginal, notes,
		yearNet: r2n(m.net * 12), yearGross: r2n(m.G * 12),
	};
}

/** The work-grant hint: kids under 19 and toddlers in the claim year, from the profile's birth years. */
export function netoKids(profile, claimYear) {
	const kids = (profile.kids || []).filter((k) => claimYear - k[0] < 19 && claimYear - k[0] >= 0);
	return { kids: kids.length, toddlers: kids.filter((k) => claimYear - k[0] < 3).length };
}

/** A band for analytics: never an amount. */
export function netoBand(r) {
	if (!r.ok) { return 'error'; }
	return r.gross < 8000 ? 'low' : r.gross < 20000 ? 'mid' : 'high';
}
