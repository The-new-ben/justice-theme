/**
 * Road-accident compensation (wave 4, HAD-502): Road Accident Victims Compensation Law, 1975, and its regulations.
 *
 * Dependency-free ES module. Every number comes from registry.car_accident, read on its checked_on date:
 *  - Pain and suffering (non-pecuniary damage) under the 1976 regulations: 0.2% of the statutory maximum per day in
 *    hospital (reg. 2(א)(1)) plus 1% of the maximum per percent of permanent disability (reg. 2(א)(2)), the disability
 *    part reduced by 1% for each full year of age over 30 on the day of the accident (reg. 3); with no permanent
 *    disability and no hospital days, an agreed or awarded amount up to 10% of the maximum (reg. 2(ב)); death: 25% to
 *    the estate (reg. 4). Never above the maximum (s.4(א)(3)).
 *  - The maximum itself (s.4(א)(3), linked to the CPI by s.4(ב)) has no official publisher of its current amount, so
 *    the result is a share of the maximum; it turns into shekels only when the person enters the maximum they were
 *    given (a court decision, the insurer's letter). The tool never guesses it.
 *  - Loss of earnings (s.4(א)(1)): income above three times the average wage is not counted, the average wage being the
 *    higher of the CBS figure and the National Insurance figure on the eve of the award. Only the National Insurance
 *    figure is verified here, so the tool states the ceiling as "at least" three times it. Compensation is tax free, so
 *    losses are counted after income tax, with a tax reduction of at most 25% (s.4(א)(2)).
 *  - The lawyer's fee cap (s.16(א); Bar rules 1977, rules 2-5): 8% with no claim filed, 11% for a settlement after a
 *    claim was filed, 13% of a judgment; VAT on top (rule 5) at the 2005 VAT order's rate.
 *  - Limitation (Limitation Law ss.5(1), 10, 15א(א)): 7 years from the accident, not counting the time before age 18,
 *    and not counting 7.10.2023-6.4.2024 for a period still running then; a last day on a rest day moves to the next day
 *    (Interpretation Law s.10(ג)).
 */
import { addDays, addMonths, addYears, daysBetween, parseDate, offRestDays, fullYears } from './dates.js';

const r2 = (n) => Math.round(n * 100) / 100;
const r4 = (n) => Math.round(n * 10000) / 10000;

export const STAGES = ['none', 'settle', 'judgment'];
export const EXCLUSIONS = ['intent', 'unauthorised', 'licence', 'felony', 'uninsured', 'owner'];

/** Pain and suffering as a share (%) of the statutory maximum, with its parts. */
export function nonPecuniary(ca, input) {
	const np = ca.nonpecuniary;
	if (input.death) {
		return { kind: 'death', pct: np.death_pct, parts: [{ key: 'death', pct: np.death_pct, section: np.sections.death }] };
	}
	const days = Math.max(0, Math.floor(Number(input.days) || 0));
	const dis = Math.max(0, Number(input.disability) || 0);
	const age = Math.max(0, Math.floor(Number(input.age) || 0));
	const ageCut = age > np.age_from ? (age - np.age_from) * np.age_pct_per_year : 0;
	const hospital = r4(days * np.hospital_permille / 10);
	const disRaw = r4(dis * np.disability_pct_per_pct);
	const disability = r4(disRaw * (100 - ageCut) / 100);
	if (!days && !dis) {
		return { kind: 'other', pct: null, upTo: np.no_permanent_max_pct, parts: [], ageCut: 0 };
	}
	let pct = r4(hospital + disability);
	const capped = pct > 100;
	if (capped) { pct = 100; }
	const parts = [];
	if (days) { parts.push({ key: 'hospital', pct: hospital, days, section: np.sections.hospital }); }
	if (dis) { parts.push({ key: 'disability', pct: disability, raw: disRaw, ageCut, section: np.sections.disability, ageSection: np.sections.age }); }
	return { kind: 'formula', pct, parts, ageCut, capped };
}

/** The limitation deadline. */
export function limitation(ca, accident, birth) {
	const lim = ca.limitation;
	let start = accident;
	let minor = false;
	if (birth) {
		const adult = addYears(birth, lim.adult_age);
		if (adult > accident) { start = adult; minor = true; }
	}
	const plain = addYears(start, lim.years);
	// s.15א: the days of the war window inside a period still running then are not counted.
	let added = 0;
	if (plain >= lim.war.from && start <= lim.war.to) {
		const from = start > lim.war.from ? start : lim.war.from;
		added = daysBetween(from, lim.war.to) + 1;
	}
	const raw = addDays(plain, added);
	const deadline = offRestDays(raw, ca.independence_days);
	return { start, minor, plain, added, deadline, rolled: deadline !== raw };
}

/**
 * input = { disability (% permanent), days (in hospital), age (full years on the accident day), death (bool),
 *           accident (date), birth (date, only needed when the injured person was a minor), max (NIS, optional: the
 *           statutory maximum the person was given), income (gross monthly, optional), months (months with no work at
 *           all, optional), amount (the compensation offered or awarded, optional), stage ('none' | 'settle' | 'judgment'),
 *           work (bool: on the way to or at work), excluded ([...EXCLUSIONS] that apply) }
 */
export function compute(registry, input) {
	const ca = registry.car_accident;
	const errors = [];
	const num = (v) => (v === '' || v === undefined || v === null ? null : Number(v));
	const dis = num(input.disability) ?? 0;
	const days = num(input.days) ?? 0;
	const age = num(input.age);
	const max = num(input.max);
	// A death claim has no loss of earnings of the injured person and no limitation from the accident: the fields of a
	// living claimant are ignored, so a value left in them never blocks or changes the death result (review, PR 126).
	const alive = !input.death;
	const income = alive ? num(input.income) : null;
	const months = alive ? num(input.months) : null;
	const amount = num(input.amount);
	const accident = parseDate(input.accident);
	// The birth day matters only for a minor (Limitation Law s.10): for an adult on the accident day it is ignored, so a
	// value left in a hidden field never moves the deadline (review, PR 126).
	const minorAge = alive && age !== null && age < ca.limitation.adult_age;
	const birth = input.birth && minorAge ? parseDate(input.birth) : null;
	if (!input.death) {
		if (!(dis >= 0 && dis <= 100)) { errors.push({ field: 'disability', he: 'אחוזי נכות לצמיתות: 0 עד 100' }); }
		if (!(days >= 0 && days <= 3650 && Number.isInteger(days))) { errors.push({ field: 'days', he: 'ימי אשפוז: מספר שלם, 0 ומעלה' }); }
		if (age === null || !(age >= 0 && age <= 120 && Number.isInteger(age))) { errors.push({ field: 'age', he: 'הגיל ביום התאונה, בשנים שלמות: 0 עד 120' }); }
	}
	if (!accident) { errors.push({ field: 'accident', he: 'יום התאונה לא תקין. לדוגמה: 10.3.2025' }); }
	if (input.birth && minorAge && !birth) { errors.push({ field: 'birth', he: 'תאריך הלידה לא תקין' }); }
	if (birth && accident && birth > accident) { errors.push({ field: 'birth', he: 'תאריך הלידה אחרי יום התאונה' }); } else if (birth && accident && fullYears(birth, accident) !== age) {
		// Both fields describe the age on the accident day; a contradiction is an error, never a silent choice (review, PR 126).
		errors.push({ field: 'birth', he: `לפי תאריך הלידה, הגיל ביום התאונה היה ${fullYears(birth, accident)}, ולא ${age}. תקנו אחד מהשניים.` });
	}
	if (accident && input.today && accident > input.today) { errors.push({ field: 'accident', he: 'יום התאונה אחרי היום' }); }
	if (accident && accident < ca.law_from) { errors.push({ field: 'accident', he: `החוק חל על תאונות מ-${heDate(ca.law_from)} (סעיף 23(א))` }); }
	if (max !== null && !(max > 0 && max < 1e8)) { errors.push({ field: 'max', he: 'הסכום המקסימלי: מספר חיובי' }); }
	if (income !== null && !(income >= 0 && income < 1e7)) { errors.push({ field: 'income', he: 'הכנסה חודשית: מספר חיובי' }); }
	if (months !== null && !(months >= 0 && months <= 600)) { errors.push({ field: 'months', he: 'חודשים בלי עבודה: 0 עד 600' }); }
	if (amount !== null && !(amount >= 0 && amount < 1e9)) { errors.push({ field: 'amount', he: 'סכום הפיצוי: מספר חיובי' }); }
	if (errors.length) { return { ok: false, errors }; }

	const excluded = (input.excluded || []).filter((x) => EXCLUSIONS.includes(x));
	const flags = [];
	if (excluded.length) {
		return { ok: false, outOfScope: true, excluded, errors: [{ field: 'excluded', he: `${ca.exclusions_he}. לפי מה שסימנתם, ייתכן שאין זכאות לפיצויים לפי החוק (${ca.sections.exclusions}), חוץ מהחריגים שבסעיפים 7א ו-7ב. כאן צריך עורך דין לנזקי גוף.` }] };
	}

	// 1. Pain and suffering.
	const np = nonPecuniary(ca, Object.assign({}, input, { disability: dis, days, age }));
	const npAmount = max !== null && np.pct !== null ? r2(max * np.pct / 100) : null;
	if (np.capped) { flags.push({ code: 'np_cap', he: 'הסכום לא עולה על הסכום המקסימלי (סעיף 4(א)(3)), ולכן החישוב נעצר ב-100%.' }); }

	// 2. Loss of earnings: the ceiling and the base for a month with no work at all.
	const nii = ca.earnings.nii[ca.earnings.nii.length - 1];
	const ceilingAtLeast = r2(ca.earnings.ceiling_multiple * Math.min(nii.s1, nii.s2));
	let earnings = null;
	if (income !== null && income > 0) {
		const capped = income > ceilingAtLeast;
		const lowPerMonth = r2((capped ? ceilingAtLeast : income) * (100 - ca.earnings.tax_cap_pct) / 100);
		// The base for a month with no work at all lies between 75% of the income the ceiling allows (the tax cut is at
		// most 25%) and the income itself; above the verified part of the ceiling the court decides the rest.
		const highPerMonth = r2(income);
		earnings = { income, capped, ceilingAtLeast, lowPerMonth, highPerMonth, months: months || 0,
			low: months ? r2(lowPerMonth * months) : null, high: months ? r2(highPerMonth * months) : null };
		if (capped) { flags.push({ code: 'ceiling', he: `ההכנסה שהזנתם מעל ${ceilingAtLeast.toLocaleString('en-US')} ₪. התקרה היא פי 3 מהשכר הממוצע במשק, לפי הגבוה מנתוני הלמ"ס והביטוח הלאומי ביום קביעת הפיצוי (סעיף 4(א)(1)), ולכן היא לפחות הסכום הזה ואולי יותר. ההכנסה שמעליה לא נספרת.` }); }
	}

	// 3. The lawyer's fee cap on the amount offered or awarded, at each stage, VAT on top.
	const vat = ca.fees.vat_pct;
	const stage = STAGES.includes(input.stage) ? input.stage : 'none';
	const fees = {};
	if (amount !== null && amount > 0) {
		for (const s of STAGES) {
			const pct = ca.fees.stages[s].pct;
			const fee = r2(amount * pct / 100);
			const withVat = r2(fee * (100 + vat) / 100);
			fees[s] = { pct, fee, withVat, net: r2(amount - withVat), section: ca.fees.stages[s].section };
		}
	}

	// 4. Limitation: for the injured person, from the accident (or age 18); a claim by the estate or the dependants
	// arises on the death (s.6 of the Limitation Law), so no date is computed for it.
	// A minor's period starts at 18 (s.10), so without the birth date there is no date to give: seven years from the
	// accident would be too early, and the flag below asks for the birth date instead (review, PR 126).
	const lim = input.death || (minorAge && !birth) ? null : limitation(ca, accident, birth);
	if (age !== null && age < ca.limitation.adult_age && !birth && !input.death) {
		flags.push({ code: 'minor_birth', he: 'הנפגע היה קטין ביום התאונה: הזמן עד גיל 18 לא נספר בהתיישנות (סעיף 10 לחוק ההתיישנות). הזינו תאריך לידה כדי לחשב את המועד.' });
	}
	if (input.work) { flags.push({ code: 'nii', he: ca.nii_he }); }
	if (np.kind === 'other') { flags.push({ code: 'np_other', he: `בלי נכות לצמיתות ובלי ימי אשפוז, הפיצוי על כאב וסבל הוא סכום שמוסכם או נפסק, ולא יותר מ-${ca.nonpecuniary.no_permanent_max_pct}% מהסכום המקסימלי (${ca.nonpecuniary.sections.other}).` }); }

	return {
		ok: true, np, npAmount, max, earnings, fees, stage, vat, lim, flags, amount: amount !== null && amount > 0 ? amount : null,
		accident, death: Boolean(input.death),
		figure: npAmount !== null ? npAmount : np.pct,
		figureKind: npAmount !== null ? 'nis' : np.pct !== null ? 'pct' : 'none',
	};
}

function heDate(iso) { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; }

/* ---------------- The injury wave (22.10.2026, HAD-591): the claim beyond the formula, additive ----------------
 * Everything below reads registry.injury_teuna (tools/justice_tools_injury_teuna.py) next to registry.car_accident, and
 * leaves compute() and every export above exactly as they were. tnCompute() returns compute()'s result with a new field
 * `tn`:
 *  - who: who pays, by the injured person's place and the vehicles (ss.2(א), 3(א)-(ב), 12(א)), with the insurer lookup;
 *  - future: loss of earning capacity a month = the income the ceiling allows x the functional disability entered, the
 *    ceiling itself reduced by the same share (s.4(א)(1), end), net of tax between 75% and 100% (s.4(א)(2)), and the
 *    undiscounted total to the retirement age entered. No law or regulation sets the capitalisation rate, so no present
 *    value is computed; 40% or more opens periodic payments (Periodic Payments Regulations 1978, reg. 1);
 *  - ledger: the heads of damage with the reader's own amounts and the caps the law draws;
 *  - events: the dated steps a law sets (interim payments ss.5(ב), 5א, 5ה(ב); the experts regulations 8(א), 15(ב);
 *    the Ordinance's late-discovery bound s.89(2)), each rolled off a rest day (Interpretation Law s.10(ג));
 *  - flags: periodic payments, a limitation revived by s.15א(ג) and the court's power in s.15א(ד), the dependants.
 */
const tnNum = (v) => (v === '' || v === undefined || v === null ? null : Number(v));
const tnDate = (v) => (v ? parseDate(v) : null);
const tnCeil = (ca) => { const n = ca.earnings.nii[ca.earnings.nii.length - 1]; return r2(ca.earnings.ceiling_multiple * Math.min(n.s1, n.s2)); };

/** Whole calendar months from one day to a later one (0 when the second is not later). */
export function tnMonths(from, to) {
	if (!from || !to || to <= from) { return 0; }
	const [y1, m1] = from.split('-').map(Number);
	const [y2, m2] = to.split('-').map(Number);
	let n = (y2 - y1) * 12 + (m2 - m1);
	if (addMonths(from, n) > to) { n -= 1; }
	return Math.max(0, n);
}

/** Who pays: the vehicle's compulsory insurer (s.2(א)), the vehicle one rode in (s.3(א)), any of them (s.3(ב)), or Karnit (s.12). */
export function tnWho(ti, input) {
	const w = ti.who;
	const out = { lookup: { he: w.insurer_lookup_he, section: w.insurer_lookup_section, url: w.insurer_lookup_url } };
	if (input.karnit) { return Object.assign(out, { code: 'karnit', he: `קרנית, הקרן לפיצוי נפגעי תאונות דרכים: ${w.karnit_reasons_he}`, section: w.karnit_section, url: w.karnit_suit_url }); }
	if (input.role === 'in') { return Object.assign(out, input.multi ? { code: 'inside', he: w.inside_he, section: w.inside_section } : { code: 'vehicle', he: `${w.vehicle_he}: הרכב שבו נסעתם`, section: w.vehicle_section }); }
	if (input.role === 'out') { return Object.assign(out, input.multi ? { code: 'outside', he: w.outside_he, section: w.outside_section } : { code: 'vehicle', he: `${w.vehicle_he}: הרכב שפגע בכם`, section: w.vehicle_section }); }
	return Object.assign(out, { code: '', he: '', section: '' });
}

/** Loss of earning capacity: a month and the undiscounted total to the retirement age entered (s.4(א)(1)-(2)). */
export function tnFuture(registry, input, base) {
	const ca = registry.car_accident;
	const ti = registry.injury_teuna;
	const income = tnNum(input.income);
	const f = tnNum(input.functional);
	if (input.death || !(income > 0) || !(f > 0)) { return null; }
	const ceil = base.earnings ? base.earnings.ceilingAtLeast : tnCeil(ca);
	const counted = Math.min(income, ceil);
	const reducedCap = r2(ceil * f / 100);
	const gross = r2(counted * f / 100);
	const low = r2(gross * (100 - ca.earnings.tax_cap_pct) / 100);
	const high = r2(income * f / 100);
	const retire = tnNum(input.retire);
	const today = input.today || ti.checked_on;
	let end = null;
	let months = null;
	let exact = false;
	if (retire !== null) {
		// The birth day is known only for a minor (the form asks for it there); otherwise the age on the accident day in
		// full years gives the latest day the retirement age can fall on.
		const birth = input.birth && base.lim && base.lim.minor ? input.birth : null;
		end = birth ? addYears(birth, retire) : addYears(base.accident, retire - Number(input.age));
		exact = Boolean(birth);
		months = tnMonths(today, end);
	}
	return {
		income, f, ceil, counted, reducedCap, gross, low, high, capped: income > ceil, retire, end, exact, months,
		totalLow: months !== null ? r2(low * months) : null, totalHigh: months !== null ? r2(high * months) : null,
		periodic: f >= ti.future.periodic_threshold_pct, past: retire !== null && months === 0,
	};
}

/** The heads of damage with the reader's amounts and the cap the law draws for each (null where it draws none). */
export function tnLedger(registry, input, base, future) {
	const ca = registry.car_accident;
	const ti = registry.injury_teuna;
	const rows = [];
	for (const h of ti.heads) {
		if (base.death && h.code !== 'nonpec') { continue; }
		const row = { code: h.code, he: h.he, section: h.section, rule: h.rule };
		if (h.code === 'nonpec') {
			Object.assign(row, { kind: base.np.pct === null ? 'upto' : 'pct', pct: base.np.pct, upTo: base.np.upTo ?? null, amount: base.npAmount, cap: { pct: 100, he: 'הסכום המקסימלי', section: ca.nonpecuniary.max_section } });
		} else if (h.code === 'past') {
			const e = base.earnings;
			Object.assign(row, { kind: e ? 'month' : 'empty', perMonth: e ? e.income : null, months: e ? e.months : 0, low: e && e.months ? e.low : null, high: e && e.months ? e.high : null, cap: { amount: e ? e.ceilingAtLeast : tnCeil(ca), he: 'ההכנסה המרבית לחודש, לפחות', section: ca.earnings.section } });
		} else if (h.code === 'future') {
			Object.assign(row, { kind: future ? 'month' : 'empty', perMonth: future ? future.gross : null, months: future ? future.months : null, low: future ? future.totalLow : null, high: future ? future.totalHigh : null, cap: future ? { amount: future.reducedCap, he: `ההכנסה המרבית × ${future.f}%`, section: ti.earnings.partial_section } : null });
		} else {
			const v = tnNum(input[h.code]);
			Object.assign(row, { kind: v > 0 ? 'amount' : 'empty', amount: v > 0 ? v : null, low: v > 0 ? v : null, high: v > 0 ? v : null, cap: null });
		}
		rows.push(row);
	}
	const low = r2(rows.reduce((s, x) => s + (x.code === 'nonpec' ? (x.amount || 0) : (x.low || 0)), 0));
	const high = r2(rows.reduce((s, x) => s + (x.code === 'nonpec' ? (x.amount || 0) : (x.high || 0)), 0));
	return { rows, low, high, nonpecOpen: base.npAmount === null && base.np.pct !== null ? base.np.pct : null };
}

/** The dated steps a law sets for this claim, each rolled off a rest day (Interpretation Law s.10(ג)). */
export function tnEvents(registry, input, base) {
	const ca = registry.car_accident;
	const ti = registry.injury_teuna;
	const off = (d) => offRestDays(d, ca.independence_days);
	const ev = [];
	const demand = tnDate(input.demand);
	if (demand && !base.death) {
		const due = off(addDays(demand, ca.interim_days));
		ev.push({ code: 'interim_due', date: due, he: `תשלום תכוף: ${ca.interim_days} ימים מקבלת הדרישה בכתב (${heDate(demand)}); ממועד זה, אם לא שולם, ריבית צמודה של ${ti.interim.late_pct}% לשנה (${ti.interim.late_section})`, section: ca.sections.interim, url: ca.law_url });
		ev.push({ code: 'interim_court', date: addDays(due, 1), he: 'מהיום הזה, אם לא שולם: בקשה לתשלום תכוף לבית משפט השלום', section: ti.interim.court_section, url: ca.law_url });
	}
	if (base.accident && !base.death && (demand || tnNum(input.medical) > 0 || tnNum(input.help) > 0)) {
		ev.push({ code: 'interim_max', date: addYears(base.accident, ti.interim.max_years), he: 'תום שנתיים מהתאונה: בית המשפט לא פוסק תשלום תכוף לתקופה ארוכה מזו, אלא מטעמים שיירשמו', section: ti.interim.max_section, url: ca.law_url });
	}
	const notice = tnDate(input.expertNotice);
	if (notice) { ev.push({ code: 'expert_docs', date: off(addDays(notice, ti.expert.docs_days)), he: `מומחה בית המשפט: ${ti.expert.docs_days} ימים מההודעה על המינוי (${heDate(notice)}) לשלוח לו ולבעלי הדין את כל המסמכים הרפואיים, בלי חוות דעת`, section: ti.expert.docs_section, url: ti.expert.url }); }
	const opinion = tnDate(input.opinion);
	if (opinion) { ev.push({ code: 'expert_questions', date: off(addDays(opinion, ti.expert.questions_days)), he: `שאלות הבהרה בכתב למומחה: ${ti.expert.questions_days} ימים מקבלת חוות הדעת (${heDate(opinion)})`, section: ti.expert.questions_section, url: ti.expert.url }); }
	if (input.late && base.accident && !base.death) {
		ev.push({ code: 'discovery', date: off(addYears(base.accident, ti.ordinance.discovery_years)), he: `נזק שהתגלה מאוחר: התביעה מתיישנת אם לא הוגשה תוך ${ti.ordinance.discovery_years} שנים מיום הנזק (חישוב פשוט, בלי הימים שסעיף 15א אולי מוסיף)`, section: `${ti.ordinance.discovery_section} לפקודת הנזיקין`, url: ti.ordinance.url });
	}
	return ev.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/** compute() and the claim beyond it; errors of the new fields join compute()'s errors. */
export function tnCompute(registry, input) {
	const ca = registry.car_accident;
	const ti = registry.injury_teuna;
	const base = compute(registry, input);
	const errors = [];
	const alive = !input.death;
	const f = alive ? tnNum(input.functional) : null;
	const retire = alive ? tnNum(input.retire) : null;
	if (f !== null && !(f >= 0 && f <= 100)) { errors.push({ field: 'functional', he: 'נכות תפקודית: 0 עד 100' }); }
	if (retire !== null && !(Number.isInteger(retire) && retire >= 15 && retire <= 90)) { errors.push({ field: 'retire', he: 'גיל סיום ההפסד: מספר שלם, 15 עד 90' }); } else if (retire !== null && tnNum(input.age) !== null && retire <= Number(input.age)) { errors.push({ field: 'retire', he: 'גיל סיום ההפסד צריך להיות גבוה מהגיל ביום התאונה' }); }
	for (const k of ['medical', 'help', 'travel']) {
		const v = alive ? tnNum(input[k]) : null;
		if (v !== null && !(v >= 0 && v < 1e8)) { errors.push({ field: k, he: 'סכום: מספר חיובי' }); }
	}
	const accident = parseDate(input.accident);
	for (const k of ['demand', 'expertNotice', 'opinion']) {
		if (!input[k] || (k === 'demand' && !alive)) { continue; }
		const d = parseDate(input[k]);
		if (!d) { errors.push({ field: k, he: 'תאריך לא תקין. לדוגמה: 1.6.2025' }); } else if (accident && d < accident) { errors.push({ field: k, he: 'התאריך לפני יום התאונה' }); } else if (input.today && d > input.today) { errors.push({ field: k, he: 'התאריך אחרי היום' }); }
	}
	if (!base.ok) { return Object.assign({}, base, { errors: base.errors.concat(errors) }); }
	if (errors.length) { return { ok: false, errors }; }
	const clean = Object.assign({}, input, { functional: f, retire, medical: alive ? input.medical : '', help: alive ? input.help : '', travel: alive ? input.travel : '', demand: alive ? input.demand : '' });
	const who = tnWho(ti, input);
	const future = tnFuture(registry, clean, base);
	const ledger = tnLedger(registry, clean, base, future);
	const events = tnEvents(registry, clean, base);
	const flags = [];
	if (future && future.periodic) { flags.push({ code: 'periodic', he: `${ti.future.periodic_rule_he}.`, section: `${ti.future.periodic_section} ל${ti.future.periodic_he}`, url: ti.future.periodic_url }); }
	if (future && future.past) { flags.push({ code: 'retire_past', he: 'לפי הגיל שהזנתם, גיל סיום ההפסד כבר עבר: אין חודשים עתידיים לחשב.' }); }
	if (base.lim && base.lim.plain >= ca.limitation.war.from && base.lim.plain <= ca.limitation.war.to) {
		flags.push({ code: 'war_revive', he: `שבע השנים הסתיימו בתוך חלון המלחמה: ${ti.limitation.revive_he} (${ti.limitation.revive_section}). ${ti.limitation.court_he}.`, section: ti.limitation.court_section, url: ti.limitation.url });
	}
	if (base.death) { flags.push({ code: 'dependants', he: 'בנוסף לכאב וסבל לעיזבון, התלויים (בן או בת זוג, הורה, ילד) תובעים את הפסד הממון שלהם בגלל המוות; הכלי לא מחשב אותו.', section: 'סעיף 78 לפקודת הנזיקין', url: ti.ordinance.url }); }
	return Object.assign({}, base, { tn: { who, future, ledger, events, flags, late: Boolean(input.late), age: alive ? tnNum(input.age) : null, days: alive ? tnNum(input.days) : null, work: Boolean(input.work) } });
}
