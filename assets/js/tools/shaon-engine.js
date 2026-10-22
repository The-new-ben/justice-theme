/**
 * The road-accident and personal-injury wave (22.10.2026, HAD-591): the injured person's clock (shaon-nezikin, /tort-lawyer/).
 *
 * Dependency-free ES module on top of dates.js and the road engine's limitation() (teuna-engine.js, imported as a namespace,
 * bundled as TE). Every number comes from the registry: reg.car_accident (7 years, Limitation Law s.5(1); the age of 18,
 * s.10; the war window of s.15A; the Independence days; the 60 days of interim payments, Road Accident Victims Compensation
 * Law s.5(b); the fee caps; Karnit, s.12; the National Insurance deduction, s.328A), reg.small_claims (the small-claims
 * ceiling and the magistrates' court amount, Courts Law s.51(a)(2)) and reg.injury_sheon (everything else, each with its
 * section).
 *  - Who pays, by the type of injury: the compulsory insurer of the vehicle (Road law ss.2-3; the Motor Vehicle Insurance
 *    Ordinance s.3(a)(2) for the driver), Karnit (s.12), the National Insurance work-injury branch and the employer, the
 *    wrongdoer and the wrongdoer's liability insurer (Civil Wrongs Ordinance ss.23, 35, 41A; Insurance Contract Law s.68),
 *    one's own policy (Insurance Contract Law ss.22-31), the Institute's accident allowance, the student accident policy.
 *  - The first 30 days: each step with who does it, where, its source, and the date a text sets ("as soon as possible"
 *    where the text says so); the kind of each step (a legal duty, a right, a condition of a benefit, the Institute's
 *    procedure, or practical advice) is stated, never blurred.
 *  - The limitation date: 7 years from the day the cause of action arose (Limitation Law ss.5(1), 6; Civil Wrongs Ordinance
 *    s.89, applied to road accidents by s.4(a) of the road law), from the 18th birthday for a minor (s.10), from the day the
 *    damage was discovered when it was discovered later (s.89(2), s.8) but never later than 10 years from the damage
 *    (s.89(2)), without the war window (s.15A, also for a period set by another law, s.15A(e)), moved off a rest day
 *    (Interpretation Law s.10(c)). One's own policy: 3 years, or 5 for health / hospitalisation / long-term care (Insurance
 *    Contract Law s.31), with the insurer's warnings 12 and 3 months before the end (s.31A(b)).
 *  - National Insurance: 12 months to claim (s.296(a)); the injury allowance for up to 91 days; the accident allowance:
 *    the medical check within 72 hours and the claim within 90 days; the appeal deadlines from a decision's date.
 *  - Which court: the small-claims ceiling, the magistrates' court amount on the filing day, the district court above it,
 *    the regional labor court for the Institute, and the civil court for a worker's tort claim against the employer.
 *  - Medical malpractice has its own rules: the clock says so and computes nothing for it.
 * Never a verdict: every date is "by the rule of the law"; the exceptions (ss.7-9, 11, 15A(c)-(d), 18A, 19) are flags.
 * Every top-level helper starts with "sh": the bundle concatenates this file with instrument.js, dates.js and sim-handoff.js.
 */

import { addDays, addMonths, addYears, daysBetween, parseDate, offRestDays, fullYears } from './dates.js';
import * as TE from './teuna-engine.js';

export const SH_TYPES = ['road', 'work', 'both', 'other', 'malpractice'];
export const SH_SUBS = ['fall', 'assault', 'dog', 'student', 'other'];
export const SH_ROLES = ['driver', 'passenger', 'pedestrian'];
export const SH_JOBS = ['employee', 'self', 'none'];
export const SH_POLICIES = ['none', 'accident', 'health'];
export const SH_DECISIONS = ['medical', 'appeals', 'clerk'];
export const SH_KINDS = ['law', 'right', 'condition', 'procedure', 'advice'];

const shBlank = (v) => v === '' || v === undefined || v === null;
const shHe = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; };
const shR2 = (n) => Math.round(n * 100) / 100;
const shRoad = (t) => t === 'road' || t === 'both';
const shWork = (t) => t === 'work' || t === 'both';

/**
 * A limitation period of `years` from `start`: the road engine's limitation() with the period's own length (the war window
 * of s.15A applies to a period set by another law too, s.15A(e); the minor's years of s.10 only when a birth day is given),
 * moved off a rest day (Interpretation Law s.10(c)).
 */
export function shLimit(reg, start, years, birth) {
	const ca = reg.car_accident;
	const lim = Object.assign({}, ca.limitation, { years });
	return TE.limitation(Object.assign({}, ca, { limitation: lim }), start, birth || null);
}

/** The court for a claim of `amount` on the filing day (reg.small_claims holds the amounts and the sections). */
export function shCourt(reg, amount) {
	const sc = reg.small_claims;
	const small = sc.ceiling[sc.ceiling.length - 1];
	if (shBlank(amount) || !(Number(amount) > 0)) { return { code: 'unknown', small: small.amount, smallFrom: small.from, max: sc.magistrate_max }; }
	const a = Number(amount);
	const code = a <= small.amount ? 'small' : a <= sc.magistrate_max ? 'magistrate' : 'district';
	return { code, amount: a, small: small.amount, smallFrom: small.from, max: sc.magistrate_max };
}

/**
 * input = { type (SH_TYPES), role (SH_ROLES, road), hitrun (bool: the driver unknown, uninsured, or the insurer in
 *           liquidation), sub (SH_SUBS, other), injury (date), today (date), age (full years on the injury day), birth
 *           (date, needed under 18), job (SH_JOBS), discovered (date the damage was discovered, optional), policy
 *           (SH_POLICIES), policyRight (date the right to claim under the policy arose, optional), docs (date the insurer
 *           got the claim and documents, optional), demand (date of the written demand for interim payment, road),
 *           decision (SH_DECISIONS), decisionDate (date a decision of the Institute was received), amount (the claim's
 *           estimated amount, optional) }
 */
export function shCompute(reg, input) {
	const ca = reg.car_accident;
	const sh = reg.injury_sheon;
	const errors = [];
	const type = SH_TYPES.includes(input.type) ? input.type : 'road';
	if (type === 'malpractice') {
		return { ok: false, outOfScope: true, type, errors: [{ field: 'type', he: sh.malpractice_he }] };
	}
	const role = SH_ROLES.includes(input.role) ? input.role : 'passenger';
	const sub = SH_SUBS.includes(input.sub) ? input.sub : 'fall';
	const job = SH_JOBS.includes(input.job) ? input.job : 'employee';
	const policy = sub === 'student' && type === 'other' ? 'accident' : (SH_POLICIES.includes(input.policy) ? input.policy : 'none');
	const injury = parseDate(input.injury);
	const today = parseDate(input.today);
	const date = (field, label) => {
		if (shBlank(input[field])) { return null; }
		const d = parseDate(input[field]);
		if (!d) { errors.push({ field, he: `${label}: תאריך לא תקין. לדוגמה: 8.10.2026` }); return null; }
		if (injury && d < injury) { errors.push({ field, he: `${label}: לפני יום הפגיעה` }); return null; }
		if (today && d > today) { errors.push({ field, he: `${label}: אחרי היום` }); return null; }
		return d;
	};
	if (!injury) { errors.push({ field: 'injury', he: 'יום הפגיעה: תאריך מלא, לדוגמה 8.10.2026' }); }
	if (injury && today && injury > today) { errors.push({ field: 'injury', he: 'יום הפגיעה אחרי היום' }); }
	if (injury && shRoad(type) && injury < ca.law_from) { errors.push({ field: 'injury', he: `חוק הפיצויים חל על תאונות מ-${shHe(ca.law_from)}` }); }
	const age = shBlank(input.age) ? null : Number(input.age);
	if (age === null || !(Number.isInteger(age) && age >= 0 && age <= 120)) { errors.push({ field: 'age', he: 'הגיל ביום הפגיעה, בשנים שלמות: 0 עד 120' }); }
	const minor = age !== null && age < ca.limitation.adult_age;
	// The birth day matters only for a minor (s.10); for an adult a value left in a hidden field is ignored.
	let birth = null;
	if (minor && !shBlank(input.birth)) {
		birth = parseDate(input.birth);
		if (!birth) { errors.push({ field: 'birth', he: 'תאריך הלידה לא תקין' }); } else if (injury && birth > injury) {
			errors.push({ field: 'birth', he: 'תאריך הלידה אחרי יום הפגיעה' });
		} else if (injury && fullYears(birth, injury) !== age) {
			errors.push({ field: 'birth', he: `לפי תאריך הלידה, הגיל ביום הפגיעה היה ${fullYears(birth, injury)}, ולא ${age}. תקנו אחד מהשניים.` });
		}
	}
	const discovered = date('discovered', 'יום גילוי הנזק');
	const policyRight = policy !== 'none' ? date('policyRight', 'היום שבו קמה הזכות לפי הפוליסה') : null;
	const docs = policy !== 'none' ? date('docs', 'היום שבו המבטח קיבל את התביעה והמסמכים') : null;
	const demand = shRoad(type) ? date('demand', 'יום הדרישה בכתב לתשלום תכוף') : null;
	const decision = SH_DECISIONS.includes(input.decision) ? input.decision : '';
	const decisionDate = decision ? date('decisionDate', 'יום קבלת ההחלטה') : null;
	if (decision && shBlank(input.decisionDate)) { errors.push({ field: 'decisionDate', he: 'יום קבלת ההחלטה: תאריך מלא' }); }
	const amount = shBlank(input.amount) ? null : Number(input.amount);
	if (amount !== null && !(amount >= 0 && amount < 1e10)) { errors.push({ field: 'amount', he: 'סכום התביעה: מספר חיובי, או ריק' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const L = sh.limitation;
	const T = sh.torts;
	const I = sh.insurance;
	const R = sh.road;
	const N = sh.nii;
	const lawUrl = ca.limitation.url;

	// 1. The limitation of the claim for the bodily injury: the road insurer (road, both), the employer (work), the wrongdoer.
	const late = Boolean(discovered && discovered > injury);
	const start = late ? discovered : injury;
	let lim = null;
	let cap = null;
	let deadline = null;
	if (minor && !birth) {
		add('warn', 'minor_birth', `הנפגע היה קטין ביום הפגיעה: הזמן עד גיל ${ca.limitation.adult_age} לא נספר בהתיישנות (${ca.limitation.minor_section} לחוק ההתיישנות). הזינו תאריך לידה כדי לחשב את היום האחרון.`, ca.limitation.minor_section, lawUrl);
	} else {
		lim = shLimit(reg, start, ca.limitation.years, minor ? birth : null);
		deadline = lim.deadline;
		if (late) {
			cap = shLimit(reg, injury, T.late_cap_years, null);
			if (cap.deadline < deadline) { deadline = cap.deadline; }
		}
	}
	const capped = Boolean(cap && deadline === cap.deadline);
	if (late) {
		add('info', 'late', `הנזק התגלה ב-${shHe(discovered)}, אחרי יום הפגיעה: ההתיישנות נמנית מיום הגילוי (${T.late_cap_section} לפקודת הנזיקין; ${L.late_section} לחוק ההתיישנות), אבל התביעה מתיישנת בכל מקרה ${T.late_cap_years} שנים מיום אירוע הנזק${cap ? ` (${shHe(cap.deadline)})` : ''}. אם התגלית מאוחרת או לא, זו שאלה שבית המשפט מכריע בה.`, T.late_cap_section, T.url);
		if (minor) { add('info', 'late_minor', `קטין שנזקו התגלה מאוחר: אם גם 10 השנים של ${T.late_cap_section} לא נמנות עד גיל 18 זו שאלה לעורך דין; הכלי מחשב אותן מיום הפגיעה.`, T.late_cap_section, T.url); }
	}
	if (lim && lim.minor) { add('info', 'minor', `הנפגע היה בן ${age} ביום הפגיעה: שבע השנים נמנות מיום הולדתו ה-${ca.limitation.adult_age} (${shHe(lim.start)}), ${ca.limitation.minor_section} לחוק ההתיישנות.`, ca.limitation.minor_section, lawUrl); }
	if (lim && lim.added) { add('info', 'war', `${lim.added} ימים מתוך התקופה ${shHe(ca.limitation.war.from)} עד ${shHe(ca.limitation.war.to)} לא נספרים (${ca.limitation.war.section} לחוק ההתיישנות, חרבות ברזל), ולכן היום האחרון נדחה.`, ca.limitation.war.section, lawUrl); }
	if (lim && lim.plain >= ca.limitation.war.from && lim.plain <= ca.limitation.war.to) { add('warn', 'war_ended', `שבע השנים היו מסתיימות ב-${shHe(lim.plain)}, בתוך תקופת המלחמה: ${L.war_ended_he} (${L.war_ended_section}).`, L.war_ended_section, lawUrl); }
	if (lim && lim.added && deadline && deadline < addYears(ca.limitation.war.to, L.after_stay_years)) { add('info', 'after_stay', `${L.after_stay_he} (${L.after_stay_section}); אם הכלל חל גם על עיכוב המלחמה, עורך דין בודק.`, L.after_stay_section, lawUrl); }
	if (lim && lim.rolled) { add('info', 'rest', `${shHe(capped ? cap.plain : lim.plain)} חל ביום מנוחה, ולכן היום האחרון עובר ל-${shHe(deadline)} (${ca.limitation.interpretation_he}).`, ca.limitation.interpretation_he, lawUrl); }
	const expired = Boolean(deadline && today && deadline < today);
	if (expired) { add('danger', 'expired', `לפי כלל החוק, היום האחרון (${shHe(deadline)}) כבר עבר. יש חריגים: הטעיה, איום או ניצול מצוקה (${L.misconduct_section}), הודאה בכתב או תשלום של חלק (${L.admission_section}), ליקוי נפשי בלי אפוטרופוס (${L.incapacity_section}), גילוי מאוחר (${L.late_section}). כאן צריך עורך דין.`, L.misconduct_section, lawUrl); }
	if (type === 'other' && sub === 'assault') { add('info', 'sexual', `${L.sexual_he} (${L.sexual_section}). הכלי לא מחשב את המועד הזה.`, L.sexual_section, lawUrl); }

	// 2. One's own insurance policy (Insurance Contract Law s.31) and the student policy.
	let pol = null;
	if (policy !== 'none') {
		const years = policy === 'health' ? I.limit_long_years : I.limit_years;
		const pStart = policyRight || injury;
		const pl = shLimit(reg, pStart, years, null);
		const warns = I.warn_months.map((m) => ({ months: m, date: addMonths(pl.deadline, -m) }));
		pol = { kind: policy, years, start: pStart, fromRight: Boolean(policyRight), deadline: pl.deadline, added: pl.added, rolled: pl.rolled, warns, payBy: docs ? addDays(docs, I.pay_days) : null, docs };
		if (minor) { add('info', 'policy_minor', `ההתיישנות של ${I.limit_section} לחוק חוזה הביטוח נמנית מיום מקרה הביטוח; אם הזמן עד גיל 18 נספר בה, עורך דין בודק. הכלי לא דוחה אותה.`, I.limit_section, I.url); }
	}

	// 3. Who pays.
	const pays = [];
	const pay = (code, role2, he, section, url) => pays.push({ code, role: role2, he, section: section || '', url: url || '' });
	if (shRoad(type)) {
		if (input.hitrun) {
			pay('karnit', 'primary', `${ca.karnit_he}.`, ca.sections.karnit, ca.law_url);
		} else if (role === 'driver') {
			pay('own_vehicle', 'primary', `מבטח החובה של הרכב שבו נהגתם: ${R.driver_policy_text_he} (${R.driver_policy_section} ל${R.driver_policy_he}), בלי קשר לאשם.`, R.driver_policy_section, R.driver_policy_url);
		} else if (role === 'passenger') {
			pay('vehicle', 'primary', `מבטח החובה של הרכב שבו נסעתם: ${R.passengers_he} (${R.passengers_section}), בלי קשר לאשם.`, R.passengers_section, R.url);
		} else {
			pay('hitting', 'primary', `מבטח החובה של הרכב שפגע בכם: ${R.user_he}. ${R.outside_he} (${R.outside_section}).`, R.user_section, R.url);
		}
		if (!input.hitrun) { pay('karnit', 'check', `אם הנהג לא ידוע, לרכב אין ביטוח או המבטח בפירוק: ${ca.karnit_he}.`, ca.sections.karnit, ca.law_url); }
		pay('hmo', 'also', `${R.health_he}.`, R.health_section, R.url);
		pay('exclusive', 'check', `${R.exclusive_he} (${R.exclusive_section}).`, R.exclusive_section, R.url);
		pay('excluded', 'check', `${ca.exclusions_he} (${ca.sections.exclusions}). אם אחד מאלה קרה, צריך עורך דין.`, ca.sections.exclusions, ca.law_url);
	}
	if (shWork(type)) {
		pay('nii_work', 'primary', `הביטוח הלאומי, ביטוח נפגעי עבודה: דמי פגיעה עד ${N.work.days} ימים (${N.work.weeks} שבועות, ${N.work.weeks_section}), ואם נשארה נכות, מענק או קצבה לפי הוועדה הרפואית.`, N.work.weeks_section, N.work.page_url);
		if (job === 'employee') { pay('employer_day', 'also', `המעסיק: ${N.work.injury_day_he} (${N.work.injury_day_section}).`, N.work.injury_day_section, N.work.url); }
		if (job === 'employee') { pay('employer_tort', 'check', `אם הפגיעה נגרמה ברשלנות המעסיק: תביעת נזיקין נגדו (ונגד מבטח האחריות שלו) בבית המשפט האזרחי. ${sh.courts.labor_tort_he} (${sh.courts.labor_tort_section} ל${sh.courts.labor_he}).`, sh.courts.labor_tort_section, sh.courts.labor_url); }
	}
	if (type === 'both') { pay('deduct', 'also', `${ca.nii_he}.`, ca.nii_law_he, ca.nii_law_url); }
	if (type === 'other') {
		if (sub === 'dog') { pay('dog_owner', 'primary', `בעל הכלב: ${T.dog_he} (${T.dog_section}); ${T.dog_defences_he} (${T.dog_defences_section}).`, T.dog_section, T.url); } else if (sub === 'assault') {
			pay('assailant', 'primary', `מי שתקף: ${T.assault_he} (${T.assault_section}); ${T.crime_he} (${T.crime_section}).`, T.assault_section, T.url);
		} else if (sub === 'student') {
			pay('student_policy', 'primary', `${sh.students.he}: ${sh.students.who_he}. ${sh.students.excluded_he}.`, '', sh.students.url);
			pay('wrongdoer', 'check', `אם מישהו התרשל (בית הספר, הרשות, בעל המקום): תביעת נזיקין לפי ${T.negligence_section} לפקודת הנזיקין, בנוסף לפוליסה.`, T.negligence_section, T.url);
		} else {
			pay('wrongdoer', 'primary', `מי שהתרשל (בעל המקום, העסק, הרשות): ${T.negligence_he} (${T.negligence_section}). הפיצוי לפי מה שמוכח, אין טבלה בחוק.`, T.negligence_section, T.url);
		}
		if (sub !== 'student') { pay('liability_insurer', 'also', `מבטח האחריות של מי שגרם לנזק: ${I.third_party_he} (${I.third_party_section}).`, I.third_party_section, I.url); }
		if (age !== null && age >= N.accident.min_age) { pay('nii_accident', 'also', `הביטוח הלאומי, דמי תאונה: ${N.accident.who_he}. ${N.accident.max_he}.`, '', N.accident.url); }
	}
	if (policy !== 'none' && !(type === 'other' && sub === 'student')) { pay('own_policy', 'also', `הפוליסה הפרטית שלכם (${policy === 'health' ? I.limit_long_he : 'ביטוח תאונות אישיות'}): ${I.notice_he} (${I.notice_section}); ${I.pay_he} (${I.pay_section}).`, I.notice_section, I.url); }

	// 4. The first 30 days, step by step. kind: law | right | condition | procedure | advice.
	const steps = [];
	// A step's `due` is either the day to start (the injury day) or a deadline the text sets (`deadline: true`).
	const step = (code, kind, he, due, dueHe, section, url) => steps.push({ code, kind, he, due: due || null, dueHe: dueHe || '', section: section || '', url: url || '', deadline: Boolean(due && due !== injury) });
	step('treat', 'advice', 'לקבל טיפול רפואי, ולשמור מהיום הראשון כל מסמך: דוח מד"א, חדר מיון, מכתב שחרור, סיכומי ביקור והפניות', injury, 'מיד', '', '');
	if (type === 'other' && sub !== 'student' && age !== null && age >= N.accident.min_age) {
		step('exam72', 'condition', `בדיקה רפואית בתוך ${N.accident.exam_hours} שעות משעת התאונה: תנאי לדמי תאונה בביטוח הלאומי (${N.accident.exam_he})`, addDays(injury, N.accident.exam_hours / 24), `עד ${N.accident.exam_hours} שעות`, '', N.accident.conditions_url);
	}
	if (shRoad(type) && role === 'driver') { step('driver', 'law', `נוהג שמעורב בתאונה עם נפגע: ${sh.traffic.stop_he}; ${sh.traffic.police_he}`, injury, 'מיד ככל האפשר', sh.traffic.police_section, sh.traffic.url); }
	if (shRoad(type)) {
		step('details', 'law', `לקבל את פרטי הנהג האחר והרכב ואת תעודת הביטוח: ${sh.traffic.details_he}`, injury, 'במקום התאונה', sh.traffic.details_section, sh.traffic.url);
		step('police', 'advice', `${sh.traffic.report_he}: ${sh.traffic.report_when_he}. ${sh.traffic.report_why_he}; ${sh.traffic.report_medical_he}. האישור נשלח בדרך כלל בתוך ${sh.traffic.report_days} ימי עבודה`, injury, 'בימים הראשונים', '', sh.traffic.report_url);
		if (input.hitrun) { step('karnit', 'right', `תביעה לקרנית: ${ca.karnit_he}`, null, 'בתוך תקופת ההתיישנות', ca.sections.karnit, ca.law_url); }
		step('demand', 'right', `דרישה בכתב למבטח (או לקרנית) לתשלום תכוף של הוצאות הריפוי ושל תשלומים חודשיים למחיה: ${ca.interim_he}; אחרי ${ca.interim_days} ימים בלי תשלום אפשר לבקש מבית משפט השלום (${R.interim_court_section})`, demand ? addDays(demand, ca.interim_days) : null, demand ? `המבטח משלם עד ${shHe(addDays(demand, ca.interim_days))}` : `${ca.interim_days} ימים מהדרישה`, ca.sections.interim, ca.law_url);
	}
	if (shWork(type)) {
		step('employer', 'procedure', `לדווח למעסיק ולבקש הפניה לטיפול רפואי: ${N.work.forms_he}`, injury, 'מיד', '', N.work.page_url);
		step('nii_claim', 'law', `תביעה לדמי פגיעה בביטוח הלאומי (טופס ${N.work.form_claim}): ${N.claim_he} (${N.claim_section}); ${N.work.days_he}`, offRestDays(addMonths(injury, N.claim_months), ca.independence_days), `עד ${N.claim_months} חודשים`, N.claim_section, N.claim_url);
	}
	if (type === 'other' && sub !== 'student' && age !== null && age >= N.accident.min_age) {
		step('accident_claim', 'procedure', `תביעה לדמי תאונה בביטוח הלאומי: ${N.accident.claim_he}. ${N.accident.not_with_he}`, addDays(injury, N.accident.claim_days), `עד ${N.accident.claim_days} ימים`, '', N.accident.claim_url);
	}
	if (type === 'other' && sub === 'student') { step('student', 'procedure', `${sh.students.he}: ${sh.students.claim_he}. ${sh.students.excluded_he}`, injury, 'מיד', '', sh.students.url); }
	if (policy !== 'none') {
		step('notice', 'law', `הודעה לחברת הביטוח על המקרה: ${I.notice_he}; ${I.docs_he} (${I.docs_section}). ${I.late_he} (${I.late_section})`, injury, 'מיד לאחר שנודע', I.notice_section, I.url);
	}
	if (type === 'other' && sub !== 'student') {
		step('wrongdoer', 'right', `לבקש בכתב ממי שאחראי (בעל המקום, העסק, הרשות${sub === 'dog' ? ', בעל הכלב' : ''}) את פרטי חברת הביטוח שלו: ${I.third_party_he} (${I.third_party_section})`, null, 'בימים הראשונים', I.third_party_section, I.url);
	}
	if (type === 'other' && (sub === 'fall' || sub === 'other')) { step('scene', 'advice', 'לתעד את המקום ואת מה שגרם לפגיעה (מדרגה, רצפה רטובה, בור, ציוד): תמונות, שמות עדים, ובקשה בכתב מבעל המקום לשמור את צילומי האבטחה', injury, 'בימים הראשונים', '', ''); }
	if (type === 'other' && sub === 'dog') { step('dog', 'law', `בעל הכלב אחראי גם בלי רשלנות (${T.dog_section}); לרשום את פרטי הבעלים והכלב, ולשמור את תיעוד הטיפול`, injury, 'ביום הנשיכה', T.dog_section, T.url); }
	if (type === 'other' && sub === 'assault') { step('assault', 'advice', `תלונה במשטרה על התקיפה. ${T.crime_he} (${T.crime_section})`, injury, 'מיד', T.crime_section, T.url); }
	step('records', 'right', `לבקש העתק של הרשומה הרפואית: ${sh.patient.records_he} (${sh.patient.section} ל${sh.patient.he})`, null, 'בכל עת', sh.patient.section, sh.patient.url);
	step('evidence', 'advice', 'לשמור קבלות על כל הוצאה (תרופות, נסיעות, עזרה בבית), תמונות מהמקום, שמות עדים, ויומן קצר של כאב ותפקוד מהימים הראשונים', null, 'מהיום הראשון', '', '');
	step('nosign', 'advice', 'לא לחתום על כתב ויתור, הסדר או "סילוק סופי" לפני שבודקים את המועדים, את ראשי הנזק ואת שכר הטרחה שהחוק מתיר', null, 'לפני כל חתימה', '', '');
	if (shRoad(type)) {
		step('lawyer', 'law', `להתייעץ עם עורך דין נזיקין לפני ההגשה: בתאונת דרכים שכר הטרחה מוגבל בחוק ל-${ca.fees.stages.none.pct}% בלי תביעה, ${ca.fees.stages.settle.pct}% בפשרה אחרי תביעה ו-${ca.fees.stages.judgment.pct}% מפסק דין, ועוד מע"מ; ${ca.fees.refund_he}`, null, 'לפני ההגשה', ca.sections.fee, ca.law_url);
	} else if (shWork(type)) {
		step('lawyer', 'law', `לפני ייצוג בתביעה לביטוח הלאומי: ${N.fee_he}`, null, 'לפני ההגשה', '', N.fee_url);
	} else {
		step('lawyer', 'advice', 'להתייעץ עם עורך דין נזיקין לפני ההגשה, ולבקש את הצעת שכר הטרחה בכתב לפני שמתחילים', null, 'לפני ההגשה', '', '');
	}
	step('calendar', 'advice', 'להכניס ליומן את כל המועדים שלמטה (קובץ .ics), כולל היום האחרון לתביעה, ולשמור את הקישור לחישוב', null, 'עכשיו', '', '');

	// 5. Every dated event the texts set, for the ribbon, the .ics and the dates table.
	const events = [];
	const ev = (key, d, kind, he, section, url) => { if (d) { events.push({ key, date: d, kind, he, section: section || '', url: url || '' }); } };
	ev('injury', injury, 'start', 'יום הפגיעה', '', '');
	if (type === 'other' && sub !== 'student' && age !== null && age >= N.accident.min_age) {
		ev('exam72', addDays(injury, N.accident.exam_hours / 24), 'condition', `דמי תאונה: הבדיקה הרפואית בתוך ${N.accident.exam_hours} שעות משעת התאונה (לכל המאוחר באותה שעה ביום הזה)`, '', N.accident.conditions_url);
		ev('accident_claim', addDays(injury, N.accident.claim_days), 'deadline', `דמי תאונה: התביעה בתוך ${N.accident.claim_days} ימים מיום התאונה`, '', N.accident.claim_url);
	}
	if (shRoad(type)) {
		if (demand) {
			ev('demand', demand, 'start', 'נשלחה דרישה בכתב לתשלום תכוף', ca.sections.interim, ca.law_url);
			ev('interim_due', addDays(demand, ca.interim_days), 'deadline', `תשלום תכוף: המבטח משלם בתוך ${ca.interim_days} ימים מהדרישה; אחרי זה אפשר לבקש מבית משפט השלום, ובאיחור נוספים הפרשי הצמדה וריבית של ${R.interim_late_pct}% לשנה (${R.interim_late_section})`, `${ca.sections.interim}, ${R.interim_court_section}`, ca.law_url);
		}
		ev('interim_max', addYears(injury, R.interim_max_years), 'info', `תשלום תכוף: ${R.interim_max_he}`, R.interim_max_section, R.url);
	}
	if (shWork(type)) {
		ev('allowance_end', addDays(injury, N.work.days), 'info', `דמי פגיעה: סוף ${N.work.days} הימים מיום הפגיעה (אם יש אישורים רפואיים לתקופה ארוכה יותר, מגישים תביעה לנכות מעבודה)`, N.work.weeks_section, N.work.page_url);
		ev('nii_claim', offRestDays(addMonths(injury, N.claim_months), ca.independence_days), 'deadline', `ביטוח לאומי: התביעה לדמי פגיעה ולגמלת נכות מעבודה בתוך ${N.claim_months} חודשים (${N.claim_section}); אחרי זה משולמים לכל היותר ${N.late_months} החודשים שלפני ההגשה (${N.late_section})`, N.claim_section, N.claim_url);
	}
	let dec = null;
	if (decision && decisionDate) {
		if (decision === 'medical') {
			dec = { kind: decision, date: decisionDate, items: [{ key: 'appeal_medical', date: offRestDays(addDays(decisionDate, N.work.medical_appeal_days), ca.independence_days), he: `ערר לוועדה הרפואית לעררים: ${N.work.medical_appeal_he}`, url: N.work.medical_appeal_url }] };
		} else if (decision === 'appeals') {
			dec = { kind: decision, date: decisionDate, items: [{ key: 'appeal_court', date: offRestDays(addDays(decisionDate, N.work.court_days), ca.independence_days), he: N.work.court_he, url: N.work.medical_appeal_url }] };
		} else {
			dec = { kind: decision, date: decisionDate, items: [
				{ key: 'appeal_committee', date: offRestDays(addMonths(decisionDate, N.appeal.committee_months), ca.independence_days), he: N.appeal.committee_he, url: N.appeal.committee_url },
				{ key: 'appeal_labor', date: offRestDays(addMonths(decisionDate, N.appeal.court_months), ca.independence_days), he: N.appeal.court_he, url: N.appeal.court_url },
			] };
		}
		ev('decision', decisionDate, 'start', 'התקבלה החלטה של הביטוח הלאומי', '', '');
		dec.items.forEach((x) => ev(x.key, x.date, 'deadline', x.he, '', x.url));
		if (decision !== 'clerk' && !shWork(type)) { add('info', 'decision_type', 'מועדי הערר לוועדה הרפואית ולבית הדין שבכלי הם של נפגעי עבודה; בהחלטה בענף אחר בדקו את המועד שכתוב במכתב.', '', N.work.medical_appeal_url); }
	}
	if (pol) {
		pol.warns.forEach((w) => ev(`policy_warn_${w.months}`, w.date, 'info', `חברת הביטוח צריכה להתריע בכתב: ${w.months} חודשים לפני סוף ההתיישנות של הפוליסה (${I.warn_section}), אם הודעתם לה על המקרה`, I.warn_section, I.url));
		if (pol.payBy) { ev('policy_pay', pol.payBy, 'deadline', `הפוליסה: התגמולים משולמים בתוך ${I.pay_days} ימים מהיום שבו היו בידי המבטח המידע והמסמכים (${I.pay_section})`, I.pay_section, I.url); }
		ev('policy_limit', pol.deadline, 'limit', `התיישנות התביעה לפי הפוליסה: ${pol.years} שנים ${pol.fromRight ? 'מהיום שבו קמה הזכות לתבוע לפי תנאי הפוליסה' : 'מיום מקרה הביטוח'} (${I.limit_section}); ${I.limit_not_stopped_he}`, I.limit_section, I.url);
	}
	if (late) { ev('discovered', discovered, 'start', 'יום גילוי הנזק', T.late_cap_section, T.url); }
	if (lim && lim.minor) { ev('adult', lim.start, 'start', `יום ההולדת ה-${ca.limitation.adult_age}: מכאן נמנות שבע השנים`, ca.limitation.minor_section, lawUrl); }
	if (deadline) {
		const who = shRoad(type) ? 'נגד מבטח החובה (או קרנית) על נזק הגוף' : type === 'work' ? 'נגד המעסיק או אחר שגרם לפגיעה ברשלנות (לא נגד הביטוח הלאומי)' : 'נגד מי שגרם לנזק ומבטח האחריות שלו';
		ev('limit', deadline, 'limit', `היום האחרון להגשת תביעה ${who} לפי כלל החוק: ${capped ? `${T.late_cap_years} שנים מיום אירוע הנזק (${T.late_cap_section})` : `${ca.limitation.years} שנים${lim.minor ? ` מגיל ${ca.limitation.adult_age}` : late ? ' מיום הגילוי' : ' מיום הפגיעה'}`}`, capped ? T.late_cap_section : ca.limitation.section, capped ? T.url : lawUrl);
	}
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	// 6. Which court, and the fee caps of the road law.
	const court = shCourt(reg, amount);
	const fees = [];
	if (shRoad(type) && amount !== null && amount > 0) {
		for (const s of TE.STAGES) {
			const f = ca.fees.stages[s];
			const fee = shR2(amount * f.pct / 100);
			fees.push({ stage: s, pct: f.pct, fee, withVat: shR2(fee * (100 + ca.fees.vat_pct) / 100), section: f.section, he: f.he });
		}
	}

	// 7. Flags that belong to the type.
	if (type === 'both') { add('warn', 'binding', `${R.binding_he} (${R.binding_section}). לכן הוועדה הרפואית של הביטוח הלאומי חשובה גם לתביעה נגד מבטח הרכב.`, R.binding_section, R.url); }
	if (type === 'work' && job === 'self') { add('info', 'self', `עצמאי: ההפניה לטיפול בטופס ${N.work.form_self}; דמי הפגיעה והמועדים כמו לשכיר.`, '', N.work.page_url); }
	if (type === 'other' && sub !== 'student' && age !== null && age < N.accident.min_age) { add('info', 'accident_age', `דמי תאונה בביטוח הלאומי משולמים מגיל ${N.accident.min_age} עד גיל הפרישה; לקטין אין דמי תאונה.`, '', N.accident.conditions_url); }
	if (type === 'other' && sub !== 'student' && job === 'none') { add('info', 'accident_nonworker', `מי שאינו עובד מקבל דמי תאונה מהיום ה-${N.accident.nonworker_from_day} שאחרי התאונה, ורק אם מאושפז או מרותק לבית; שכיר ועצמאי מהיום ה-${N.accident.worker_from_day}.`, '', N.accident.days_url); }
	if (pol && !pol.fromRight && policy !== 'none') { add('info', 'policy_disability', `${I.limit_disability_he} (${I.limit_section}). אם יש לכם תאריך כזה, הזינו אותו.`, I.limit_section, I.url); }

	const daysSince = today ? daysBetween(injury, today) : null;
	const daysLeft = today && deadline ? daysBetween(today, deadline) : null;
	const first30 = addDays(injury, 30);
	return {
		ok: true, type, role, sub, job, policy, hitrun: Boolean(input.hitrun), injury, today, age, minor, birth, discovered, late,
		lim, cap, capped, deadline, expired, pol, demand, dec, pays, steps, events, court, fees, amount, flags, daysSince, daysLeft, first30,
		inFirst30: daysSince !== null && daysSince <= 30,
	};
}

/** The analytics band: type and the stage of the clock, never a date or an amount. */
export function shBand(r) {
	if (!r || !r.ok) { return r && r.outOfScope ? 'malpractice' : 'error'; }
	const stage = r.expired ? 'expired' : r.inFirst30 ? 'first30' : r.daysLeft !== null && r.daysLeft < 365 ? 'last-year' : 'running';
	return `${r.type}-${stage}`;
}
