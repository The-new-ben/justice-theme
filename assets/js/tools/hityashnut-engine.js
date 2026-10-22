/**
 * The medical-malpractice wave (22.10.2026, HAD-594): the malpractice limitation clock (shaon-refui,
 * /medical-malpractice-statute-of-limitations/).
 *
 * Dependency-free ES module on top of dates.js and the road engine's limitation() (teuna-engine.js, imported as a namespace,
 * bundled as TE: the war window of s.15A, the minor's years of s.10 when a birth day is given, the rest-day move of the
 * Interpretation Law s.10(c)). Every number comes from the registry: reg.car_accident.limitation (7 years, s.5(1); 18, s.10;
 * the war window), reg.injury_sheon (Limitation Law ss.6-9, 11, 16, the 10 years of Civil Wrongs Ordinance s.89(2), s.78,
 * the Insurance Contract Law s.31 and s.31A(b)), reg.malpractice_hityashnut (Limitation Law ss.5, 14, 15, 16 for s.11, 18, 28,
 * the publication day of Amendment 8; the Ordinance ss.19, 79; the rulings in words; the Ministry of Health tracks).
 *
 * The clock gives readings, never a verdict. Each reading is a last day with the condition it rests on:
 *  - the safe reading: 7 years from the treatment day (the earliest day the damage can have occurred; Limitation Law ss.5(1),
 *    6, Ordinance s.89(2) first limb), from 18 for a minor (s.10; settled: רע"א 4288/15), without the war window days
 *    (s.15A), moved off a rest day; the earliest of all readings that may apply is the safe day;
 *  - the damage itself discovered later (Ordinance s.89(2)): 7 years from the discovery, never later than 10 years from the
 *    damage; for a minor, whether the 10 years stop until 18 is OPEN: the strict reading (they run from the damage) comes
 *    first, the lenient one (from 18) beside it;
 *  - the damage known, its link to the treatment or the negligence discovered later (Limitation Law s.8): 7 years from the
 *    discovery and no 10-year cap (רע"א 901/07; ע"א 4275/10), only if reasonable care would not have revealed it earlier;
 *  - the parents' own claim when the patient was a minor: 7 years from the treatment (s.10 counts the plaintiff's own age);
 *  - a mental or intellectual impairment without a guardian (s.11): the time is not counted, and the period does not end
 *    before 2 years from the end of the stay (s.16);
 *  - a death: the estate's claim is the patient's own (Ordinance s.19), not ending before 1 year from the death (Limitation
 *    Law s.18; for a child who died the minor's stay does not pass to adult heirs: ע"א 9154/09); the dependants' claim
 *    (s.78) from the death, OPEN when the patient's own claim had ended before the death; s.79's six months;
 *  - a claim filed stops the clock (s.5); one dismissed so that a new one can be filed does not count the time it was
 *    pending (s.15), and the period does not end before 1 year from the dismissal (s.16);
 *  - a period that ended between 7.10.2023 and the eve of Amendment 8 (published 25.1.2024): revived by s.15A(c), unless the
 *    court decides otherwise for special reasons (s.15A(d)): the plain end is the safe reading.
 * Beside it: the patient's own insurance policy (Insurance Contract Law s.31) and the Ministry of Health tracks, none of which
 * has a deadline in the texts read or stops the court clock.
 * Every top-level helper starts with "ht": the bundle concatenates this file with instrument.js, dates.js and sim-handoff.js.
 */

import { addDays, addMonths, addYears, daysBetween, parseDate, offRestDays, fullYears } from './dates.js';
import * as TE from './teuna-engine.js';

export const HT_FOUND = ['damage', 'link'];
export const HT_POLICIES = ['none', 'accident', 'health'];
export const HT_KINDS = ['safe', 'alt', 'open'];

const htBlank = (v) => v === '' || v === undefined || v === null || v === false;
const htHe = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; };
const htMax = (a, b) => (a > b ? a : b);
const htMin = (a, b) => (a < b ? a : b);

/**
 * A limitation period of `years` from `start` (the road engine's limitation() with the period's own length: the war window
 * of s.15A also for a period set by another law, s.15A(e); the minor's years of s.10 only when a birth day is given), moved
 * off a rest day. Returns TE's fields plus `raw`, the last day before the rest-day move.
 */
export function htLimit(reg, start, years, birth) {
	const ca = reg.car_accident;
	const lim = TE.limitation(Object.assign({}, ca, { limitation: Object.assign({}, ca.limitation, { years }) }), start, birth || null);
	return Object.assign({}, lim, { years, raw: addDays(lim.plain, lim.added) });
}

/**
 * The war window has two rules: s.15A(a) for a period still running on the eve of Amendment 8, and s.15A(c)-(d) for one that
 * ended between 7.10.2023 and that eve (revived, unless the court decides otherwise). For the second, the safe reading is the
 * plain end; the revived end is a reading with its condition.
 */
export function htWar(reg, lim) {
	const war = reg.car_accident.limitation.war;
	const eve = reg.malpractice_hityashnut.limitation.war_eve;
	const revived = Boolean(lim.added && lim.plain >= war.from && lim.plain <= eve);
	const plainOff = offRestDays(lim.plain, reg.car_accident.independence_days);
	return { revived, safe: revived ? plainOff : lim.deadline, safeRaw: revived ? lim.plain : lim.raw, revivedDeadline: revived ? lim.deadline : null };
}

/**
 * input = { treatment (date of the treatment or the act), today (date), birth (date, optional: the patient's), minor (bool:
 *           the reader says the patient was under 18, optional), discovered (date, optional), found ('damage': the damage
 *           itself was discovered late; 'link': the damage was known, its link to the treatment or the negligence was not),
 *           death (date, optional), incap (bool), incapFrom (date, optional), incapTo (date, optional), filed (date the claim
 *           was filed, optional), dismissed (date it was dismissed so that a new one can be filed, optional), policy
 *           (HT_POLICIES), policyRight (date the right under the policy arose, optional) }
 */
export function htCompute(reg, input) {
	const ca = reg.car_accident;
	const L0 = ca.limitation;
	const sh = reg.injury_sheon;
	const mh = reg.malpractice_hityashnut;
	const SL = sh.limitation;
	const ST = sh.torts;
	const ML = mh.limitation;
	const MT = mh.torts;
	const I = sh.insurance;
	const off = (d) => offRestDays(d, ca.independence_days);
	const errors = [];
	const today = parseDate(input.today);
	const treatment = parseDate(input.treatment);
	if (!treatment) { errors.push({ field: 'treatment', he: 'יום הטיפול: תאריך מלא, לדוגמה 10.1.2021' }); }
	if (treatment && today && treatment > today) { errors.push({ field: 'treatment', he: 'יום הטיפול אחרי היום' }); }
	const date = (field, label, from, fromLabel) => {
		if (htBlank(input[field])) { return null; }
		const d = parseDate(input[field]);
		if (!d) { errors.push({ field, he: `${label}: תאריך לא תקין. לדוגמה: 5.9.2023` }); return null; }
		if (from && d < from) { errors.push({ field, he: `${label}: לפני ${fromLabel}` }); return null; }
		if (today && d > today) { errors.push({ field, he: `${label}: אחרי היום` }); return null; }
		return d;
	};
	let birth = null;
	if (!htBlank(input.birth)) {
		birth = parseDate(input.birth);
		if (!birth) { errors.push({ field: 'birth', he: 'תאריך הלידה לא תקין' }); } else if (treatment && birth > treatment) { errors.push({ field: 'birth', he: 'תאריך הלידה אחרי יום הטיפול. בפגיעה בלידה, שני התאריכים זהים.' }); birth = null; }
	}
	const discovered = date('discovered', 'יום הגילוי', treatment, 'יום הטיפול');
	const death = date('death', 'יום הפטירה', treatment, 'יום הטיפול');
	const incap = Boolean(input.incap);
	const incapFrom = incap ? date('incapFrom', 'תחילת הליקוי', treatment, 'יום הטיפול') : null;
	const incapTo = incap ? date('incapTo', 'סוף הליקוי', incapFrom || treatment, incapFrom ? 'תחילת הליקוי' : 'יום הטיפול') : null;
	const filed = date('filed', 'יום הגשת התביעה', treatment, 'יום הטיפול');
	const dismissed = filed ? date('dismissed', 'יום הדחייה', filed, 'יום ההגשה') : null;
	if (!filed && !htBlank(input.dismissed)) { errors.push({ field: 'dismissed', he: 'יום הדחייה: קודם יום הגשת התביעה' }); }
	const policy = HT_POLICIES.includes(input.policy) ? input.policy : 'none';
	const policyRight = policy !== 'none' ? date('policyRight', 'היום שבו קמה הזכות לפי הפוליסה', treatment, 'יום הטיפול') : null;
	const found = HT_FOUND.includes(input.found) ? input.found : 'damage';
	if (errors.length) { return { ok: false, errors }; }

	const minor = Boolean(birth && fullYears(birth, treatment) < L0.adult_age);
	const minorNoBirth = Boolean(input.minor) && !birth;
	const adult18 = birth ? addYears(birth, L0.adult_age) : null;
	// A child who died before 18: the minor's stay does not pass to adult heirs (ע"א 9154/09), so the patient's readings are
	// counted without it (the strict reading) and Hendel J.'s reading stands beside them.
	const diedMinor = Boolean(minor && death && death < adult18);
	const pBirth = minor && !diedMinor ? birth : null;
	const late = Boolean(discovered && discovered > treatment);
	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const readings = [];
	const reading = (o) => { const x = Object.assign({ who: 'patient', start: null, raw: null, plain: null, added: 0, rolled: false, deadline: null, section: '', url: '', cases: [], cond: '' }, o); readings.push(x); return x; };

	// 1. The safe reading: 7 years from the treatment day (from 18 for a minor).
	const base = htLimit(reg, treatment, L0.years, pBirth);
	const bw = htWar(reg, base);
	const safe = reading({ code: 'base', kind: 'safe', start: base.start, plain: base.plain, added: bw.revived ? 0 : base.added, raw: bw.safeRaw, deadline: bw.safe, rolled: bw.safe !== bw.safeRaw,
		he: pBirth ? `${L0.years} שנים מיום ההולדת ה-${L0.adult_age}` : `${L0.years} שנים מיום הטיפול`,
		cond: pBirth ? `קטין ביום הטיפול: הזמן עד גיל ${L0.adult_age} לא נספר (${L0.minor_section}), גם כשהעילה נולדה ביום הלידה` : 'אם הנזק אירע ביום הטיפול והיה אפשר לדעת עליו: זה הכלל, בלי תנאים',
		section: pBirth ? `${L0.section} ו${L0.minor_section} לחוק ההתיישנות` : `${L0.section} ו${SL.start_section} לחוק ההתיישנות; ${ST.late_cap_section} רישא לפקודת הנזיקין`, url: L0.url, cases: pBirth ? ['minor_25'] : [] });
	if (bw.revived) {
		reading({ code: 'war_revived', kind: 'alt', start: base.start, plain: base.plain, added: base.added, raw: base.raw, deadline: bw.revivedDeadline, rolled: base.rolled,
			he: `${L0.years} שנים ועוד ${base.added} ימי המלחמה`, cond: `${SL.war_ended_he} (${SL.war_ended_section})`, section: SL.war_ended_section, url: L0.url });
	}

	// 2. Late discovery: the damage itself (s.89(2), the 10-year cap) or its link to the treatment (s.8, no cap).
	let cap = null;
	let capLenient = null;
	let capBeforeDiscovery = false;
	if (late) {
		const fromDisc = htLimit(reg, discovered, L0.years, pBirth);
		if (found === 'damage') {
			cap = htLimit(reg, treatment, ST.late_cap_years, null);
			const capped = cap.deadline < fromDisc.deadline;
			capBeforeDiscovery = cap.deadline < discovered;
			reading({ code: 'damage_late', kind: pBirth && capped ? 'open' : 'alt', start: fromDisc.start, plain: capped ? cap.plain : fromDisc.plain, added: capped ? cap.added : fromDisc.added, raw: capped ? cap.raw : fromDisc.raw, deadline: capped ? cap.deadline : fromDisc.deadline, rolled: capped ? cap.rolled : fromDisc.rolled, capped,
				he: capped ? `${ST.late_cap_years} שנים מיום הנזק (התקרה)` : `${L0.years} שנים מיום הגילוי${fromDisc.minor ? ` (מגיל ${L0.adult_age})` : ''}`,
				cond: `אם יוכח שהנזק עצמו לא התגלה ביום שאירע, ושגם בזהירות סבירה לא היה מתגלה קודם: מיום הגילוי, ולא יותר מ-${ST.late_cap_years} שנים מיום הנזק${pBirth && capped ? '. אם התקרה רצה גם בזמן הקטינות, זו שאלה פתוחה: זו הקריאה המחמירה' : ''}`,
				section: `${ST.late_cap_section} לפקודת הנזיקין`, url: ST.url, cases: pBirth && capped ? ['s8_vs_89', 'minor_cap'] : ['s8_vs_89', 'objective'] });
			if (pBirth) {
				capLenient = htLimit(reg, treatment, ST.late_cap_years, birth);
				const lenCapped = capLenient.deadline < fromDisc.deadline;
				const lenient = lenCapped ? capLenient : fromDisc;
				if (lenient.deadline !== (capped ? cap.deadline : fromDisc.deadline)) {
					reading({ code: 'damage_late_minor', kind: 'open', start: fromDisc.start, plain: lenient.plain, added: lenient.added, raw: lenient.raw, deadline: lenient.deadline, rolled: lenient.rolled, capped: lenCapped,
						he: lenCapped ? `${ST.late_cap_years} שנים מגיל ${L0.adult_age} (התקרה)` : `${L0.years} שנים מגיל ${L0.adult_age}`,
						cond: `הקריאה המקילה של השאלה הפתוחה: אם גם ${ST.late_cap_years} השנים של התקרה לא נמנות עד גיל ${L0.adult_age} (${L0.minor_section} לחוק ההתיישנות)`,
						section: `${ST.late_cap_section} לפקודת הנזיקין; ${L0.minor_section} לחוק ההתיישנות`, url: ST.url, cases: ['minor_cap', 's8_vs_89_origin'] });
				}
			}
			if (capBeforeDiscovery) { add('danger', 'cap_before', `התקרה של ${ST.late_cap_years} שנים מיום הנזק הסתיימה ב-${htHe(cap.deadline)}, לפני יום הגילוי (${htHe(discovered)}). אם מה שלא היה ידוע הוא הקשר לטיפול או הרשלנות, ולא הנזק עצמו, חל ${SL.late_section} בלי תקרה: סמנו זאת למעלה.`, ST.late_cap_section, ST.url); }
		} else {
			reading({ code: 'link_late', kind: 'alt', start: fromDisc.start, plain: fromDisc.plain, added: fromDisc.added, raw: fromDisc.raw, deadline: fromDisc.deadline, rolled: fromDisc.rolled,
				he: `${L0.years} שנים מהיום שבו התברר הקשר${fromDisc.minor ? ` (מגיל ${L0.adult_age})` : ''}`,
				cond: `אם יוכח שהנזק היה ידוע אבל הקשר לטיפול או הרשלנות נעלמו מסיבות שלא היו תלויות במטופל, ושגם בזהירות סבירה לא היו מתגלים קודם (${SL.late_section}). בלי תקרה של ${ST.late_cap_years} שנים. "קצה חוט" ראשון כבר מתחיל את המרוץ, וההמתנה לחוות דעת לא דוחה אותו`,
				section: `${SL.late_section} לחוק ההתיישנות`, url: L0.url, cases: ['s8_vs_89', 'no_cap_link', 'objective', 'expert'] });
		}
	}

	// 3. The parents' own claim when the patient was a minor: their own 7 years from the treatment.
	let parents = null;
	if (minor && !death) {
		const pl = htLimit(reg, treatment, L0.years, null);
		const pw = htWar(reg, pl);
		parents = reading({ code: 'parents', kind: 'safe', who: 'parents', start: treatment, plain: pl.plain, added: pw.revived ? 0 : pl.added, raw: pw.safeRaw, deadline: pw.safe, rolled: pw.safe !== pw.safeRaw,
			he: `תביעת ההורים על נזקם שלהם: ${L0.years} שנים מיום הטיפול`, cond: `עיכוב הקטינות נמנה לפי גיל התובע (${L0.minor_section}); ההורים בגירים, ולכן התביעה שלהם על ההוצאות והנזק שלהם, וגם "הולדה בעוולה", לא מחכה לגיל ${L0.adult_age}`,
			section: `${L0.minor_section} לחוק ההתיישנות`, url: L0.url, cases: ['minor_25'] });
	}

	// 4. A mental or intellectual impairment without a guardian (s.11): the time is not counted; at least 2 years after (s.16).
	if (incap) {
		if (incapTo) {
			const from = htMax(incapFrom || treatment, safe.start);
			if (incapTo >= from && from <= safe.raw) {
				const to = htMin(incapTo, safe.raw);
				let extra = daysBetween(from, to) + 1;
				if (safe.added) {
					const w0 = htMax(from, L0.war.from);
					const w1 = htMin(to, L0.war.to);
					if (w1 >= w0) { extra -= daysBetween(w0, w1) + 1; }
				}
				// s.16 is a period too: the war window of s.15A applies to it when it was running then (htLimit).
				const floor = htLimit(reg, incapTo, ML.incapacity_floor_years, null).raw;
				const raw = htMax(addDays(safe.raw, extra), floor);
				reading({ code: 'incapacity', kind: 'alt', start: safe.start, plain: safe.plain, added: safe.added, raw, deadline: off(raw), rolled: off(raw) !== raw, extra, floor,
					he: `ועוד ${extra} ימי הליקוי שלא נספרים`, cond: `אם בית המשפט ימצא שהמטופל לא היה מסוגל לדאוג לענייניו בגלל ליקוי נפשי או שכלי ולא היה לו אפוטרופוס (עם אפוטרופוס: עד שנודעו לאפוטרופוס העובדות); ולא לפני ${ML.incapacity_floor_years} שנים מסוף הליקוי`,
					section: `${SL.incapacity_section} ו${ML.after_stay_section} לחוק ההתיישנות`, url: L0.url, cases: ['estate_minor'] });
			} else {
				add('info', 'incap_outside', `הליקוי שהזנתם לא חופף לתקופה שבה השעון רץ, ולכן הוא לא משנה את המועד (${SL.incapacity_section}).`, SL.incapacity_section, L0.url);
			}
		} else {
			reading({ code: 'incapacity', kind: 'open', start: safe.start, deadline: null,
				he: 'השעון לא רץ כל עוד הליקוי נמשך', cond: `${SL.incapacity_he}; כשהליקוי נגמר (או מתמנה אפוטרופוס שיודע את העובדות), נשארות לפחות ${ML.incapacity_floor_years} שנים. הזינו את יום הסיום כדי לחשב`,
				section: `${SL.incapacity_section} ו${ML.after_stay_section} לחוק ההתיישנות`, url: L0.url });
		}
	}

	// 5. A death: the estate (Ordinance s.19, Limitation Law s.18) and the dependants (s.78, s.79).
	let dependants = null;
	let ownEndedBeforeDeath = false;
	if (death) {
		const fl = htLimit(reg, death, ML.inheritance_years, null);
		ownEndedBeforeDeath = !diedMinor && safe.deadline < death;
		// s.18: a right that passed by inheritance does not end before a year from the death. For a child who died, the
		// child's own clock had not started (s.10), so the year applies even when 7 years from the treatment have passed.
		for (const x of readings) {
			if (x.who !== 'patient' || !x.deadline || (!diedMinor && x.deadline < death)) { continue; }
			if (fl.raw > x.raw) { Object.assign(x, { plain: fl.plain, added: fl.added, raw: fl.raw, deadline: fl.deadline, rolled: fl.rolled, floor: 'death', he: `${x.he}, ולפחות שנה מהפטירה` }); }
		}
		if (diedMinor) {
			Object.assign(safe, { he: `עיזבון של ילד: ${safe.he}`, cond: `עיכוב הקטינות לא עובר ליורשים בגירים (ע"א 9154/09), ולכן נספר מיום הטיפול; לפי ${ML.inheritance_section} לחוק ההתיישנות, לא פחות משנה מהפטירה. זו הקריאה המחמירה`,
				section: `${MT.estate_section} לפקודת הנזיקין; ${ML.inheritance_section} לחוק ההתיישנות`, url: MT.url, cases: ['estate_minor'] });
			const hd = htLimit(reg, death, L0.years, null);
			reading({ code: 'estate_hendel', kind: 'open', start: death, plain: hd.plain, added: hd.added, raw: hd.raw, deadline: hd.deadline, rolled: hd.rolled,
				he: `עיזבון של ילד: ${L0.years} שנים מהפטירה`, cond: 'ההצעה של השופט הנדל, שהשופט מלצר הצטרף להערותיו: היורשים מקבלים את התקופה שנותרה לילד, עד 7 שנים מהפטירה ולא פחות משנה',
				section: `${ML.inheritance_section} לחוק ההתיישנות`, url: MT.url, cases: ['estate_minor'] });
		} else {
			Object.assign(safe, { cond: `התביעה של המטופל עוברת לעיזבון (${MT.estate_section} לפקודת הנזיקין) באותו מועד, ולא פחות משנה מהפטירה (${ML.inheritance_section} לחוק ההתיישנות)`,
				section: `${safe.section}; ${MT.estate_section} לפקודת הנזיקין; ${ML.inheritance_section} לחוק ההתיישנות` });
		}
		const dl = htLimit(reg, death, L0.years, null);
		dependants = reading({ code: 'dependants', kind: ownEndedBeforeDeath ? 'open' : 'safe', who: 'dependants', start: death, plain: dl.plain, added: dl.added, raw: dl.raw, deadline: dl.deadline, rolled: dl.rolled,
			he: `תביעת התלויים: ${L0.years} שנים מיום הפטירה`, cond: ownEndedBeforeDeath ? 'תביעת המטופל עצמו התיישנה לפני הפטירה: אם לתלויים נשארה תביעה, זו שאלה פתוחה' : `בן הזוג, ההורה והילד תובעים את הפסד הממון שלהם בגלל המוות (${MT.dependants_section}); העילה שלהם נולדת ביום המוות`,
			section: `${MT.dependants_section} לפקודת הנזיקין`, url: MT.url, cases: ['dependants', 'death_known'] });
		if (ownEndedBeforeDeath) { add('warn', 'own_ended', `לפי הכלל, התביעה של המטופל עצמו הסתיימה ב-${htHe(safe.deadline)}, לפני הפטירה: לעיזבון לא נשארה תביעה, אלא אם חל חריג (גילוי מאוחר, ${SL.misconduct_section}, ${SL.admission_section}, ${SL.incapacity_section}). לתלויים: שאלה פתוחה (רע"א 901/07).`, MT.dependants_section, MT.url); }
		add('info', 'dependant_minor', `תלוי שהוא קטין: לפי דעה אחת בפסיקה, גם לו הזמן עד גיל ${L0.adult_age} לא נספר; הכלי מחשב את הקריאה המחמירה, מיום הפטירה.`, L0.minor_section, L0.url);
	}

	// 6. The safe day is the earliest reading that may apply (a minor's strict cap can be earlier than the 25th birthday).
	const dated = readings.filter((x) => x.deadline && x.who === 'patient');
	let lead = safe;
	for (const x of dated) { if (x.code === 'damage_late' && x.deadline < lead.deadline) { lead = x; } }
	if (lead !== safe) {
		// The strict cap of a minor came first: the 25th-birthday reading now holds only if the damage was knowable at once.
		Object.assign(safe, { kind: 'alt', cond: `אם הנזק היה ניתן לגילוי כבר ביום הטיפול: ${safe.cond}` });
	}
	const alts = readings.filter((x) => x !== lead && x.who === 'patient' && x.deadline).sort((a, b) => (a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0));
	const later = alts.filter((x) => x.deadline > lead.deadline);

	// 7. A claim filed (s.5) and one dismissed so that a new one can be filed (ss.15-16).
	let filedStatus = '';
	if (filed) {
		if (filed <= lead.deadline) { filedStatus = 'ok'; } else if (readings.some((x) => x.deadline && x.deadline >= filed)) { filedStatus = 'alt'; } else { filedStatus = 'late'; }
		if (dismissed) {
			const pend = daysBetween(filed, dismissed);
			const fl = htLimit(reg, dismissed, ML.after_dismissal_years, null);
			for (const x of readings) {
				if (!x.deadline || x.raw < filed) { continue; }
				const moved = addDays(x.raw, pend);
				if (fl.raw > moved) {
					Object.assign(x, { pending: pend, plain: fl.plain, added: fl.added, raw: fl.raw, deadline: fl.deadline, rolled: fl.rolled, floor: 'dismissed', he: `${x.he}; אחרי הדחייה, לפחות שנה ממנה` });
				} else {
					Object.assign(x, { pending: pend, raw: moved, deadline: off(moved), rolled: off(moved) !== moved, he: `${x.he}, ועוד ${pend} ימים שהתביעה הייתה תלויה` });
				}
			}
			add('info', 'dismissed', `התביעה הוגשה ב-${htHe(filed)} ונדחתה ב-${htHe(dismissed)}: ${ML.dismissed_he} (${ML.dismissed_section}), ולא פחות משנה מהדחייה (${ML.after_stay_section}). זה חל רק כשהדחייה מאפשרת תביעה חדשה, למשל מחיקה, ולא דחייה לגופו של עניין.`, ML.dismissed_section, L0.url);
		}
	}

	// 8. Flags that explain the safe day.
	if (minorNoBirth) { add('warn', 'minor_birth', `סימנתם שהמטופל היה קטין: הזינו תאריך לידה. עד אז הכלי מחשב ${L0.years} שנים מיום הטיפול, שזה המועד המוקדם ביותר.`, L0.minor_section, L0.url); }
	if (parents) { add('warn', 'parents', `התביעה של הילד עצמו נמשכת עד ${htHe(safe.deadline)}, אבל התביעה של ההורים על הנזק וההוצאות שלהם מתיישנת כבר ב-${htHe(parents.deadline)}.`, L0.minor_section, L0.url); }
	if (safe.added) { add('info', 'war', `${safe.added} ימים מתוך ${htHe(L0.war.from)} עד ${htHe(L0.war.to)} לא נספרים (${L0.war.section} לחוק ההתיישנות, חרבות ברזל): הכלל חל על כל תביעה אזרחית שתקופתה עוד רצה, ולכן היום האחרון נדחה.`, L0.war.section, L0.url); }
	if (bw.revived) { add('warn', 'war_revived', `שבע השנים הסתיימו ב-${htHe(base.plain)}, אחרי 7.10.2023 ולפני שהתיקון פורסם (${htHe(ML.war_published)}): ${SL.war_ended_he}. לכן המועד הבטוח הוא הסיום המקורי, וההארכה מותנית.`, SL.war_ended_section, L0.url); }
	if (lead.rolled) { add('info', 'rest', `${htHe(lead.raw)} חל ביום מנוחה, ולכן היום האחרון עובר ל-${htHe(lead.deadline)} (${L0.interpretation_he}).`, L0.interpretation_he, L0.url); }
	if (late && found === 'damage' && pBirth && lead.code === 'damage_late') { add('warn', 'minor_cap', `${mh.open.minor_cap_he}.`, ST.late_cap_section, ST.url); }
	if (late && found === 'damage' && !capBeforeDiscovery) { add('info', 'late_damage', `גילוי מאוחר של הנזק: ${ST.damage_he} (${ST.late_cap_section}). אם מה שלא היה ידוע הוא הקשר לטיפול, ולא הנזק, חל ${SL.late_section} בלי תקרה.`, ST.late_cap_section, ST.url); }
	if (!late) { add('info', 'damage_day', 'אם הנזק עצמו אירע אחרי הטיפול (למשל סיבוך שהופיע אחר כך), שבע השנים נספרות מהיום שבו אירע. הכלי סופר מיום הטיפול, שהוא המוקדם ביותר.', ST.late_cap_section, ST.url); }
	// A claim on file stops the clock (s.5); after a dismissal that allows a new claim, it runs again (s.15).
	const leadEnd = filed && !dismissed ? null : lead.deadline;
	const expired = Boolean(leadEnd && today && leadEnd < today);
	const openLater = later.filter((x) => x.deadline >= today);
	if (expired) {
		add('danger', 'expired', `לפי הקריאה הבטוחה, היום האחרון (${htHe(lead.deadline)}) כבר עבר.${openLater.length ? ` נשארו מועדים מותנים (ראו למטה).` : ''} יש חריגים: הטעיה ביודעין, כולל הסתרת עובדה (${SL.misconduct_section}), הודאה בכתב או תשלום של חלק (${SL.admission_section}), ליקוי נפשי בלי אפוטרופוס (${SL.incapacity_section}), גילוי מאוחר (${SL.late_section}). כאן צריך עורך דין, מהר.`, SL.misconduct_section, L0.url);
	}
	add('info', 'state', `${ML.state_he} (${ML.state_section}).`, ML.state_section, L0.url);

	// 9. One's own insurance policy (Insurance Contract Law s.31), as the injured person's clock does it.
	let pol = null;
	if (policy !== 'none') {
		const years = policy === 'health' ? I.limit_long_years : I.limit_years;
		const pStart = policyRight || treatment;
		const pl = htLimit(reg, pStart, years, null);
		pol = { kind: policy, years, start: pStart, fromRight: Boolean(policyRight), deadline: pl.deadline, added: pl.added, rolled: pl.rolled, warns: I.warn_months.map((m) => ({ months: m, date: addMonths(pl.deadline, -m) })) };
		if (minor) { add('info', 'policy_minor', `ההתיישנות של ${I.limit_section} לחוק חוזה הביטוח נמנית מיום מקרה הביטוח; אם הזמן עד גיל 18 נספר בה, עורך דין בודק. הכלי לא דוחה אותה.`, I.limit_section, I.url); }
	}

	// 10. Every dated event, for the ribbon, the .ics and the dates table.
	const events = [];
	const ev = (key, d, kind, he, section, url) => { if (d) { events.push({ key, date: d, kind, he, section: section || '', url: url || '' }); } };
	ev('treatment', treatment, 'start', 'יום הטיפול', '', '');
	if (late) { ev('discovered', discovered, 'start', found === 'damage' ? 'יום גילוי הנזק' : 'היום שבו התברר הקשר לטיפול', found === 'damage' ? ST.late_cap_section : SL.late_section, found === 'damage' ? ST.url : L0.url); }
	if (minor) { ev('adult', adult18, 'start', `יום ההולדת ה-${L0.adult_age}: מכאן נספרות שבע השנים של המטופל`, L0.minor_section, L0.url); }
	if (incap && incapTo) { ev('incap_end', incapTo, 'start', 'סוף הליקוי, או מינוי אפוטרופוס שידע את העובדות', SL.incapacity_section, L0.url); }
	if (death) {
		ev('death', death, 'start', 'יום הפטירה', '', '');
		ev('who_files', addMonths(death, MT.who_files_months), 'info', `${MT.who_files_months} חודשים מהפטירה: מכאן כל תלוי רשאי להגיש את תביעת התלויים בשם כולם (${MT.who_files_section})`, MT.who_files_section, MT.url);
	}
	if (filed) { ev('filed', filed, 'start', 'הוגשה תביעה: השעון נעצר', ML.filed_section, L0.url); }
	if (dismissed) { ev('dismissed', dismissed, 'start', 'התביעה נדחתה כך שאפשר להגיש חדשה', ML.dismissed_section, L0.url); }
	if (cap && cap.deadline !== (readings.find((x) => x.code === 'damage_late') || {}).deadline) { ev('cap', cap.deadline, 'cap', `תקרת ${ST.late_cap_years} השנים מיום הנזק (${ST.late_cap_section})`, ST.late_cap_section, ST.url); }
	const who = { patient: death ? 'העיזבון' : 'המטופל', parents: 'ההורים', dependants: 'התלויים' };
	for (const x of readings) {
		if (!x.deadline) { continue; }
		const label = x === lead ? 'היום האחרון הבטוח' : x.kind === 'open' ? 'מועד לפי שאלה פתוחה' : x.kind === 'safe' ? 'היום האחרון' : 'מועד מותנה';
		ev(`r_${x.code}`, x.deadline, x === lead ? 'limit' : x.kind === 'safe' ? 'limit2' : x.kind, `${label} לתביעה של ${who[x.who]}: ${x.he}`, x.section, x.url);
	}
	if (pol) {
		pol.warns.forEach((w) => ev(`policy_warn_${w.months}`, w.date, 'info', `חברת הביטוח צריכה להתריע בכתב ${w.months} חודשים לפני סוף ההתיישנות של הפוליסה (${I.warn_section}), אם הודעתם לה על המקרה`, I.warn_section, I.url));
		ev('policy_limit', pol.deadline, 'policy', `התיישנות התביעה לפי הפוליסה הפרטית: ${pol.years} שנים ${pol.fromRight ? 'מהיום שבו קמה הזכות' : 'מיום מקרה הביטוח'} (${I.limit_section}); ${I.limit_not_stopped_he}`, I.limit_section, I.url);
	}
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	const daysLeft = today && leadEnd ? daysBetween(today, leadEnd) : null;
	const daysSince = today ? daysBetween(treatment, today) : null;
	const status = filed && !dismissed ? (filedStatus === 'ok' ? 'filed' : filedStatus === 'alt' ? 'filed-alt' : 'filed-late') : expired ? (openLater.length ? 'expired-safe' : 'expired') : daysLeft !== null && daysLeft < 365 ? 'last-year' : 'running';
	return {
		ok: true, treatment, today, birth, minor, pMinor: Boolean(pBirth), minorNoBirth, adult18, discovered, late, found, death, diedMinor, incap, incapFrom, incapTo, filed, dismissed, filedStatus,
		policy, pol, readings, lead, later, parents, dependants, cap, capLenient, capBeforeDiscovery, ownEndedBeforeDeath, flags, events, expired, daysLeft, daysSince, status,
		tracks: mh.tracks,
	};
}

/** The analytics band: who and the stage of the clock, never a date. */
export function htBand(r) {
	if (!r || !r.ok) { return 'error'; }
	return `${r.death ? 'death' : r.minor ? 'minor' : 'adult'}-${r.status}`;
}
