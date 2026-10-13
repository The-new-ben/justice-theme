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
import { addDays, addYears, daysBetween, parseDate, offRestDays } from './dates.js';

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
	const income = num(input.income);
	const months = num(input.months);
	const amount = num(input.amount);
	const accident = parseDate(input.accident);
	const birth = input.birth ? parseDate(input.birth) : null;
	if (!input.death) {
		if (!(dis >= 0 && dis <= 100)) { errors.push({ field: 'disability', he: 'אחוזי נכות לצמיתות: 0 עד 100' }); }
		if (!(days >= 0 && days <= 3650 && Number.isInteger(days))) { errors.push({ field: 'days', he: 'ימי אשפוז: מספר שלם, 0 ומעלה' }); }
		if (age === null || !(age >= 0 && age <= 120 && Number.isInteger(age))) { errors.push({ field: 'age', he: 'הגיל ביום התאונה, בשנים שלמות: 0 עד 120' }); }
	}
	if (!accident) { errors.push({ field: 'accident', he: 'יום התאונה לא תקין. לדוגמה: 10.3.2025' }); }
	if (input.birth && !birth) { errors.push({ field: 'birth', he: 'תאריך הלידה לא תקין' }); }
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
	const lim = input.death ? null : limitation(ca, accident, birth);
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
