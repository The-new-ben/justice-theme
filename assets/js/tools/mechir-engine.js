/**
 * The medical-malpractice wave (22.10.2026, HAD-594): the cost and fee estimator of a malpractice claim (alut-tviaa-refuit,
 * /medical-malpractice-cost/).
 *
 * Dependency-free ES module on top of dates.js. Every number comes from the registry: reg.small_claims (the magistrates'
 * court amount on the filing day, Courts Law s.51(a)(2); the district court above it, s.40(1)), reg.car_accident (VAT 18%,
 * the VAT rate order s.1; the road-accident fee caps 8/11/13%, which do NOT apply here; the listed Independence days for the
 * rest-day rule) and reg.malpractice_mechir (everything else, each with its section):
 *  - The court fee of a claim for bodily injury (Court Fees Regulations 2007 reg.5(a)): a FIXED fee, item 2 (magistrates) or
 *    item 9 (district); at filing only the first part, item 34 or 35 (reg.5(b)(1)); who pays the balance depends on how the
 *    claim ends: an early end before the third pre-trial session closes (reg.5(b)(2)), a claim dropped or dismissed before
 *    the evidence (5(b)(3): the plaintiff a third), a settlement before the evidence (5(b)(4): the defendant a third), a
 *    judgment for the plaintiff or a later settlement (5(b)(5): the defendant the whole fee), a judgment dismissing the
 *    claim (5(b)(7): the plaintiff the whole fee); a district claim that ends below 60% of the magistrates' amount (5(c)).
 *  - The exemption for who cannot pay (reg.14) and its 15 days for a bodily-injury claim (reg.14(b)).
 *  - Experts (Civil Procedure Regulations 2018): no official tariff for a private opinion, so only the reader's quotes are
 *    added; the counter-opinion within 60 days (reg.87(c)); the court's expert and who pays (regs.88, 92); clarification
 *    questions within 14 days (reg.91(c)); recess days are not counted (reg.179(b)): the tool shows the earliest date.
 *  - The lawyer's fee: the reader's percentage; no maximum in the texts read (Bar Association Law ss.81-82, 84(b)); VAT on top
 *    or inside; the net-to-client ledger.
 *  - Costs if the claim fails (regs.151-157), in words; legal aid (the Ministry of Justice's published table from 1.2.2026).
 * Never a verdict, never a guess: an amount the texts do not set (an expert's price, the costs a court awards) is the
 * reader's own number or words. Every top-level helper starts with "mc": the bundle concatenates this file with
 * instrument.js, dates.js and sim-handoff.js.
 */

import { addDays, parseDate, offRestDays, daysBetween } from './dates.js';

export const MC_STAGES = ['pre', 'filed', 'settled', 'judgment'];
export const MC_WHEN = ['early', 'mid', 'late'];
export const MC_OUTCOMES = ['won', 'lost'];
export const MC_VAT = ['plus', 'incl'];
export const MC_ENDINGS = ['early', 'dropped', 'settle_mid', 'won', 'lost'];

const mcBlank = (v) => v === '' || v === undefined || v === null;
const mcR2 = (n) => Math.round(n * 100) / 100;
const mcNum = (v) => (mcBlank(v) ? null : Number(v));

/** The court for a claim of `amount` on the filing day, and its fixed fee for bodily injury (reg.5(a), items 2/9, 34/35). */
export function mcCourt(reg, amount) {
	const sc = reg.small_claims;
	const f = reg.malpractice_mechir.fees;
	const a = Number(amount);
	const code = a > sc.magistrate_max ? 'district' : 'magistrate';
	const fee = f[code];
	return {
		code, amount: a, max: sc.magistrate_max, section: code === 'district' ? sc.district_section : sc.magistrate_section,
		full: fee.full, first: fee.first, fullItem: fee.full_item, firstItem: fee.first_item,
	};
}

/**
 * Who pays the court fee at each ending (reg.5(b)-(c)), for a court and the compensation the claim ends with. Amounts are
 * the schedule's 2026 amounts; the indexation the regulation adds (reg.5(b), reg.12) is not computed.
 * plaintiff = the plaintiff's total (its first part included), defendant = what the defendant pays.
 */
export function mcEndings(reg, court, comp) {
	const f = reg.malpractice_mechir.fees;
	const mag = f.magistrate;
	const F = court.full;
	const P1 = court.first;
	const third = mcR2(F / f.third_div);
	// reg.5(c): in the district court, an award or settlement below 60% of the magistrates' amount on the filing day.
	const lowLine = mcR2(court.max * f.low_pct / 100);
	const low = court.code === 'district' && comp !== null && comp >= 0 && comp < lowLine;
	const rows = [
		{ code: 'early', plaintiff: P1, defendant: 0, section: f.early_section, low: false },
		{ code: 'dropped', plaintiff: third, defendant: 0, section: f.third_section, low: false },
		{ code: 'settle_mid', plaintiff: 0, defendant: third, section: f.defendant_third_section, low: false },
		{ code: 'won', plaintiff: 0, defendant: F, section: f.defendant_full_section, low: false },
		{ code: 'lost', plaintiff: F, defendant: 0, section: f.dismissed_section, low: false },
	];
	if (low) {
		// The defendant pays the magistrates' rate and the plaintiff completes the district fee (5(c)). For a settlement before
		// the evidence (5(b)(4)) the text does not say how a third splits: the tool reads it as a third of each (flagged).
		const won = rows.find((x) => x.code === 'won');
		won.defendant = mag.full;
		won.plaintiff = mcR2(F - mag.full);
		won.low = true;
		const mid = rows.find((x) => x.code === 'settle_mid');
		mid.defendant = mcR2(mag.full / f.third_div);
		mid.plaintiff = mcR2(third - mid.defendant);
		mid.low = true;
	}
	return { rows, F, P1, third, low, lowLine };
}

/** The ending that applies to the reader's stage, or null while the claim is open / not filed. */
export function mcEnding(stage, when, outcome) {
	if (stage === 'settled') { return when === 'early' ? 'early' : when === 'mid' ? 'settle_mid' : 'won'; }
	if (stage === 'judgment') { return outcome === 'lost' ? 'lost' : 'won'; }
	return null;
}

/** Legal aid's published income line for a household of n (the Ministry's table: the base to 3 persons, then per person). */
export function mcAidLimit(reg, n) {
	const la = reg.malpractice_mechir.legal_aid;
	const persons = Math.max(1, Math.round(Number(n) || 1));
	return la.income_base + la.per_person * Math.max(0, persons - la.base_persons);
}

/** A band for the analytics and the scenario: never the exact amount. */
export function mcBand(n) {
	const v = Number(n) || 0;
	const edges = [[250000, 'עד 250 אלף ש"ח'], [500000, 'בין 250 ל-500 אלף ש"ח'], [1000000, 'בין 500 אלף למיליון ש"ח'], [1500000, 'בין מיליון ל-1.5 מיליון ש"ח'], [2500000, 'בין 1.5 ל-2.5 מיליון ש"ח'], [5000000, 'בין 2.5 ל-5 מיליון ש"ח']];
	for (const [edge, he] of edges) { if (v <= edge) { return he; } }
	return 'מעל 5 מיליון ש"ח';
}

/**
 * input = { stage (MC_STAGES), when (MC_WHEN, settled), outcome (MC_OUTCOMES, judgment), amount (the claim's amount, the
 *           sum in the statement of claim or the planned one), comp (the expected or offered compensation, optional),
 *           feePct (the lawyer's percentage, the reader's quote, optional), vat (MC_VAT), e1, e2, e3 (expert-opinion quotes,
 *           optional), courtExpert (the reader's share of the court expert's fee, optional), filing (the filing day, or the
 *           planned one before filing, optional), defOpinion (the day the defence's medical opinion was served, optional),
 *           courtOpinion (the day the court expert's opinion was received, optional), household (persons, optional), income
 *           (the household's gross monthly income, optional; never shared), dp, dd (the disability % by each side's expert,
 *           optional, for the rehearsal), today (date) }
 */
export function mcCompute(reg, input) {
	const m = reg.malpractice_mechir;
	const ca = reg.car_accident;
	const errors = [];
	const stage = MC_STAGES.includes(input.stage) ? input.stage : 'pre';
	const when = MC_WHEN.includes(input.when) ? input.when : 'early';
	const outcome = MC_OUTCOMES.includes(input.outcome) ? input.outcome : 'won';
	const vat = MC_VAT.includes(input.vat) ? input.vat : 'plus';
	const today = parseDate(input.today);
	const money = (field, label, opts = {}) => {
		if (mcBlank(input[field])) {
			if (opts.required) { errors.push({ field, he: `${label}: סכום בשקלים, לדוגמה 1,200,000` }); }
			return null;
		}
		const v = Number(input[field]);
		if (!(v >= 0 && v < 1e10) || (opts.positive && !(v > 0))) { errors.push({ field, he: `${label}: מספר חיובי${opts.required ? '' : ', או ריק'}` }); return null; }
		return v;
	};
	const amount = money('amount', 'סכום התביעה', { required: true, positive: true });
	const comp = stage === 'judgment' && outcome === 'lost' ? null : money('comp', 'הפיצוי הצפוי או המוצע');
	const feePct = mcNum(input.feePct);
	if (feePct !== null && !(feePct >= 0 && feePct <= 100)) { errors.push({ field: 'feePct', he: 'אחוז שכר הטרחה: בין 0 ל-100' }); }
	const experts = ['e1', 'e2', 'e3'].map((k, i) => ({ key: k, n: i + 1, v: money(k, `חוות דעת ${i + 1}`) })).filter((x) => x.v !== null && x.v > 0);
	const courtExpert = money('courtExpert', 'חלקכם בשכר המומחה של בית המשפט');
	const date = (field, label, opts = {}) => {
		if (mcBlank(input[field])) { return null; }
		const d = parseDate(input[field]);
		if (!d) { errors.push({ field, he: `${label}: תאריך לא תקין. לדוגמה: 15.10.2026` }); return null; }
		if (opts.notFuture && today && d > today) { errors.push({ field, he: `${label}: אחרי היום` }); return null; }
		if (opts.after && d < opts.after) { errors.push({ field, he: `${label}: לפני יום הגשת התביעה` }); return null; }
		return d;
	};
	const filing = date('filing', stage === 'pre' ? 'יום ההגשה המתוכנן' : 'יום הגשת התביעה', { notFuture: stage !== 'pre' });
	const defOpinion = stage === 'pre' ? null : date('defOpinion', 'יום המצאת חוות הדעת של הנתבע', { notFuture: true, after: filing });
	const courtOpinion = stage === 'pre' ? null : date('courtOpinion', 'יום קבלת חוות הדעת של מומחה בית המשפט', { notFuture: true, after: filing });
	const household = mcNum(input.household);
	if (household !== null && !(Number.isInteger(household) && household >= 1 && household <= 20)) { errors.push({ field: 'household', he: 'מספר הנפשות: מספר שלם בין 1 ל-20' }); }
	const income = money('income', 'ההכנסה החודשית של משק הבית');
	const dp = mcNum(input.dp);
	const dd = mcNum(input.dd);
	for (const [field, v] of [['dp', dp], ['dd', dd]]) {
		if (v !== null && !(v >= 0 && v <= 100)) { errors.push({ field, he: 'אחוז הנכות: בין 0 ל-100' }); }
	}
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	const f = m.fees;
	const ex = m.experts;
	const fe = m.fee;
	const la = m.legal_aid;
	const vatPct = ca.fees.vat_pct;

	// 1. The court and the fee.
	const court = mcCourt(reg, amount);
	const end = mcEnding(stage, when, outcome);
	const en = mcEndings(reg, court, comp);
	let courtFee = 0;
	let courtFeeHe = '';
	if (stage === 'pre') {
		courtFeeHe = `עוד לא הוגשה תביעה: אין אגרה. בהגשה משלמים ${court.first.toLocaleString('en-US')} ש"ח (${court.firstItem}, ${f.first_section})`;
	} else if (stage === 'filed') {
		courtFee = court.first;
		courtFeeHe = `שולם בהגשה (${court.firstItem}, ${f.first_section}). חוזר אליכם אם התביעה מסתיימת בפסק דין לטובתכם או בפשרה אחרי ישיבת קדם המשפט השלישית`;
	} else {
		const row = en.rows.find((x) => x.code === end);
		courtFee = row.plaintiff;
		courtFeeHe = { early: `החלק הראשון שולם ואין יתרה (${f.early_section})`, settle_mid: `הנתבע משלם שליש מהאגרה ומחזיר לכם את מה ששילמתם (${f.defendant_third_section})`, won: `הנתבע משלם את האגרה ומחזיר לכם את מה ששילמתם (${f.defendant_full_section})`, lost: `התביעה נדחתה: אתם משלמים את מלוא האגרה (${f.dismissed_section})` }[end];
		if (row.low) { courtFeeHe = `תביעה במחוזי שהסתיימה מתחת ל-${f.low_pct}% מסכום הסמכות של השלום: הנתבע משלם לפי שיעור השלום ואתם משלימים (${f.low_section})`; }
	}
	if (en.low && (end === 'won' || end === 'settle_mid')) {
		add('warn', 'district_low', `${f.low_he} (${f.low_section}). כאן: הפיצוי נמוך מ-${en.lowLine.toLocaleString('en-US')} ש"ח, ולכן חלקכם באגרה ${courtFee.toLocaleString('en-US', { maximumFractionDigits: 2 })} ש"ח.${end === 'settle_mid' ? ' בפשרה לפני שמיעת הראיות התקנה לא אומרת במפורש איך השליש מתחלק: הכלי מחשב שליש מכל צד, ומזכירות בית המשפט קובעת.' : ''}`, f.low_section, f.url);
	}
	if (stage === 'settled' && when !== 'early') { add('info', 'mediation', `${f.waive_he} (${f.waive_section}).`, f.waive_section, f.url); }
	if (stage !== 'pre') { add('info', 'index', `לסכומים מתווספים הפרשי הצמדה למדד מיום התשלום (${f.dismissed_section}, ${f.index_section}); הכלי מציג את סכומי 2026 בלי ההצמדה.`, f.index_section, f.url); }

	// 2. The lawyer's fee and VAT (the reader's own quote).
	const hasComp = comp !== null && comp > 0;
	let fee = 0;
	let feeVat = 0;
	if (hasComp && feePct !== null && feePct > 0) {
		const gross = mcR2(comp * feePct / 100);
		if (vat === 'plus') {
			fee = gross;
			feeVat = mcR2(gross * vatPct / 100);
		} else {
			fee = mcR2(gross * 100 / (100 + vatPct));
			feeVat = mcR2(gross - fee);
		}
	}
	add('info', 'no_cap', `${fe.cap_he}. ${fe.excessive_he} (${fe.excessive_section} ל${fe.bar_he}).`, fe.excessive_section, fe.bar_url);
	add('info', 'road_cap', `${fe.road_he}.`, fe.road_section, fe.road_url);

	// 3. Experts: the reader's quotes only (no official tariff).
	const expertsTotal = mcR2(experts.reduce((s, x) => s + x.v, 0));
	const courtExpertV = courtExpert || 0;

	// 4. The ledger: compensation down to the net, or the cost of losing.
	const lost = stage === 'judgment' && outcome === 'lost';
	const lines = [];
	if (hasComp) {
		if (fee) { lines.push({ code: 'fee', v: fee, he: `שכר טרחה (${feePct}% ${vat === 'plus' ? 'ועוד מע"מ' : 'כולל מע"מ'})`, who: 'לעורך הדין', when: 'מהפיצוי, כשהוא משולם' }); }
		if (feeVat) { lines.push({ code: 'vat', v: feeVat, he: `מע"מ ${vatPct}% על שכר הטרחה`, who: 'לעורך הדין, שמעביר למדינה', when: 'עם שכר הטרחה' }); }
	}
	experts.forEach((x) => lines.push({ code: `expert${x.n}`, v: x.v, he: `חוות דעת רפואית ${x.n} (ההצעה שלכם)`, who: 'למומחה', when: 'לפני ההגשה: מצרפים לכתב התביעה' }));
	if (courtExpertV) { lines.push({ code: 'court_expert', v: courtExpertV, he: 'חלקכם בשכר המומחה של בית המשפט', who: 'למומחה, לפי החלטת בית המשפט', when: 'כשבית המשפט מורה' }); }
	if (courtFee) { lines.push({ code: 'court_fee', v: courtFee, he: 'אגרת בית המשפט (החלק שלכם)', who: 'לקופת בית המשפט', when: stage === 'filed' ? 'בהגשה' : 'לפי סיום ההליך' }); }
	const deductions = mcR2(lines.reduce((s, x) => s + x.v, 0));
	const net = hasComp ? mcR2(comp - deductions) : null;
	const outOfPocket = mcR2(expertsTotal + courtExpertV + courtFee);
	if (hasComp && net < 0) { add('danger', 'negative', 'לפי המספרים שהזנתם, העלויות גבוהות מהפיצוי: מה שנשאר לכם שלילי.', '', ''); }
	if (hasComp && comp > amount) { add('warn', 'comp_over', 'הפיצוי שהזנתם גבוה מסכום התביעה. בדקו את שני המספרים.', '', ''); }

	// 5. If the claim fails: the plaintiff's whole fee (reg.5(b)(7)) and its own experts; the defendant's costs are the
	// court's decision (regs.151-153), never a number here.
	const failCost = mcR2(court.full + expertsTotal + courtExpertV);

	// 6. Legal aid: the Ministry's table (from 1.2.2026), the reader's household and income when given.
	const persons = household || la.base_persons;
	const aidLimit = mcAidLimit(reg, persons);
	const aid = { persons, limit: aidLimit, half: mcR2(aidLimit / 2), property: la.property_max, income, status: 'unknown', participation: null };
	if (income !== null) {
		aid.status = income <= aidLimit ? 'within' : 'above';
		aid.participation = income <= aid.half ? la.participation_low : la.participation_high;
	}

	// 7. Dates a regulation sets (the earliest date: recess days are not deducted, reg.179(b)); a rest day moves the last
	// day forward (Interpretation Law s.10(c)).
	const events = [];
	const ev = (key, d, kind, he, section, url) => { if (d) { events.push({ key, date: d, kind, he, section: section || '', url: url || '' }); } };
	const rest = (d) => offRestDays(d, ca.independence_days);
	if (filing) {
		const planned = stage === 'pre';
		ev('filing', filing, 'pay', `${planned ? 'הגשה מתוכננת' : 'הגשת התביעה'}: משלמים את החלק הראשון של האגרה, ${court.first.toLocaleString('en-US')} ש"ח (${court.firstItem})`, f.first_section, f.url);
		ev('exempt', rest(addDays(filing, f.exempt.request_days)), 'deadline', `בקשה לפטור מאגרה למי שאין ביכולתו לשלם: לא יאוחר מ-${f.exempt.request_days} ימים מהמועד שנקבע לתשלום`, f.exempt.request_section, f.url);
	}
	if (defOpinion) {
		ev('def_opinion', defOpinion, 'start', 'הומצאה חוות הדעת הרפואית של הנתבע', ex.counter_section, ex.url);
		ev('counter', rest(addDays(defOpinion, ex.counter_days)), 'deadline', `חוות דעת נגדית: בתוך ${ex.counter_days} ימים מההמצאה, אלא אם בית המשפט קבע אחרת`, ex.counter_section, ex.url);
	}
	if (courtOpinion) {
		ev('court_opinion', courtOpinion, 'start', 'התקבלה חוות הדעת של המומחה מטעם בית המשפט', ex.questions_section, ex.url);
		ev('questions', rest(addDays(courtOpinion, ex.questions_days)), 'deadline', `בקשה לשלוח למומחה שאלות הבהרה: לא יאוחר מ-${ex.questions_days} ימים מקבלת חוות הדעת`, ex.questions_section, ex.url);
	}
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	if (defOpinion || courtOpinion) { add('info', 'recess', `${ex.count_he} (${ex.count_section}).`, ex.count_section, ex.url); }
	if (filing && stage !== 'pre' && today && daysBetween(filing, today) > f.exempt.request_days) { add('info', 'exempt_passed', `עברו יותר מ-${f.exempt.request_days} ימים מההגשה, ולכן המועד לבקש פטור מהחלק הראשון של האגרה עבר. ליתרה, שמשולמת בסוף ההליך, ה-${f.exempt.request_days} ימים נספרים מהמועד שנקבע לתשלומה (${f.exempt.request_section}).`, f.exempt.request_section, f.url); }

	// 8. The rehearsal: the gap between the two experts.
	const gap = dp !== null && dd !== null ? mcR2(Math.abs(dp - dd)) : null;

	return {
		ok: true, stage, when, outcome, vat, today, amount, comp, hasComp, feePct, fee, feeVat, vatPct, experts, expertsTotal,
		courtExpert: courtExpertV, court, end, endings: en, courtFee, courtFeeHe, lines, deductions, net, outOfPocket, lost, failCost,
		aid, events, filing, defOpinion, courtOpinion, dp, dd, gap, flags,
		feeShare: hasComp && fee ? mcR2((fee + feeVat) / comp * 100) : 0,
		netShare: hasComp ? mcR2(net / comp * 100) : null,
	};
}

/** The analytics band: the court and the stage, never an amount or a date. */
export function mcBandOf(r) {
	if (!r || !r.ok) { return 'error'; }
	return `${r.court.code}-${r.stage}${r.end ? `-${r.end}` : ''}`;
}
