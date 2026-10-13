/**
 * What a will costs, from signing to the probate order (wave 4, HAD-502). Invented: no Hebrew tool puts the
 * official tariffs of the whole path in one place.
 *
 * Dependency-free ES module. Every number comes from registry.will_cost, read on its checked_on date:
 *  - The four forms (Succession Law ss.18-23): handwritten (s.19) and with witnesses (s.20) carry no official
 *    fee; before an authority (s.22): before the inheritance registrar the fee regulations set item 4; a notary
 *    counts as a judge for s.22 (s.22(ז)) and charges the notary tariff, item 4, plus VAT (reg. 1), never more
 *    and, without a stated reason, never less (Notaries Law s.34(5); reg. 1א).
 *  - Mutual wills (s.8א): two wills, in one document or in two.
 *  - Deposit with the registrar (s.21, s.22(ה)): item 5 of the fee regulations, free when the testator deposited
 *    no earlier will in the 5 years before (item 5א).
 *  - After death: a request for a probate order (s.39, s.66), item 1, 85% when filed online (reg. 1(א)); the
 *    publication is on the applicant with no official amount (Succession Regulations reg. 17(ג)), so it is named
 *    and never priced; an objection moves the request to the family court (s.67א), whose fees are not computed.
 */

export const FORMS = ['handwritten', 'witnesses', 'registrar', 'notary'];

const r2 = (n) => Math.round(n * 100) / 100;

/** Notary tariff item 3(א): the translation fee by word count (first 100, each 100 up to 1,000, each 100 above). */
export function translationFee(nf, words) {
	const w = Math.max(0, Math.floor(Number(words) || 0));
	if (!w) { return 0; }
	const blocks = Math.ceil(w / 100);
	const upTo1000 = Math.min(blocks, 10);
	const above = Math.max(0, blocks - 10);
	return nf.translate_first100 + Math.max(0, upTo1000 - 1) * nf.translate_per100_to1000 + above * nf.translate_per100_above;
}

/** Notary tariff item 9(א): away from the office, from leaving to return: the first hour (or part), then each half hour (or part). */
export function outsideFee(nf, hours) {
	const h = Number(hours) || 0;
	if (h <= 0) { return 0; }
	const extraHalves = Math.max(0, Math.ceil((h - 1) * 2 - 1e-9));
	return nf.outside_first_hour + extraHalves * nf.outside_half_hour;
}

/**
 * input = { form, people (1 or 2), docs ('one' | 'two': mutual wills in one document or two), deposit (bool),
 *           recent ([bool, bool]: that testator deposited an earlier will in the last 5 years),
 *           words (notary: words in each will, when the notary translates it), foreign (notary: certificate in a
 *           language other than Arabic or English), night (notary: 19:00-08:00 or a rest day), outside (notary comes
 *           to you), hours (time away from the office), lawyer (a quote in NIS, before VAT), online (probate filed online) }
 */
export function compute(registry, input) {
	const wc = registry.will_cost;
	const errors = [];
	const form = FORMS.includes(input.form) ? input.form : 'notary';
	const people = Number(input.people) === 2 ? 2 : 1;
	const docs = people === 2 && input.docs === 'two' ? 'two' : 'one';
	const lawyer = input.lawyer === '' || input.lawyer === undefined || input.lawyer === null ? 0 : Number(input.lawyer);
	const words = input.words === '' || input.words === undefined || input.words === null ? 0 : Number(input.words);
	const hours = input.hours === '' || input.hours === undefined || input.hours === null ? 0 : Number(input.hours);
	if (!(lawyer >= 0 && lawyer < 1e7)) { errors.push({ field: 'lawyer', he: 'שכר הטרחה בשקלים: מספר חיובי' }); }
	if (form === 'notary' && !(words >= 0 && words <= 100000 && Number.isFinite(words))) { errors.push({ field: 'words', he: 'מספר המילים: 0 עד 100,000' }); }
	if (form === 'notary' && input.outside && !(hours > 0 && hours <= 24)) { errors.push({ field: 'hours', he: 'כמה זמן הנוטריון מחוץ למשרד, מהיציאה ועד החזרה: בין רבע שעה ל-24 שעות' }); }
	if (errors.length) { return { ok: false, errors }; }

	const vatPct = wc.vat.pct;
	const withVat = (n) => r2(n * (100 + vatPct) / 100);
	const nf = wc.notary;
	const rf = wc.registrar;
	const now = [];
	const flags = [];

	// 1. Making the will.
	if (form === 'handwritten' || form === 'witnesses') {
		now.push({ key: 'make', he: form === 'handwritten' ? 'צוואה בכתב יד: אין אגרה ואין תעריף רשמי' : 'צוואה בעדים: אין אגרה ואין תעריף רשמי', amount: 0, section: form === 'handwritten' ? wc.sections.handwritten : wc.sections.witnesses, url: wc.law_url });
		if (form === 'witnesses') { flags.push({ code: 'witness', he: wc.witness_he }); }
		if (form === 'handwritten') { flags.push({ code: 'hand', he: wc.handwritten_he }); }
	} else if (form === 'registrar') {
		now.push({ key: 'make', he: `עשיית צוואה בפני רשם לענייני ירושה${people === 2 ? ', לכל אחד משני המצווים (צוואות הדדיות הן שתי צוואות, סעיף 8א)' : ''}`, amount: rf.will_before_registrar * people, unit: rf.will_before_registrar, count: people, section: rf.item_will, url: rf.url });
	} else {
		// Notary, item 4: the first signer, each additional signer on the same will; two documents are two wills.
		const perDoc = docs === 'two' ? [1, 1] : [people];
		let base = 0;
		perDoc.forEach((signers) => { base += nf.will_first + Math.max(0, signers - 1) * nf.will_additional; });
		const translate = words > 0 ? perDoc.length * translationFee(nf, words) / 2 : 0;
		// Item 10: +50% on items 1-8 and 11 between 19:00 and 08:00 or on a rest day, except an action under item 9
		// (the notary away from the office), which has its own fee.
		const night = input.night && !input.outside ? (base + translate) * nf.night_pct / 100 : 0;
		const foreign = input.foreign ? perDoc.length * nf.foreign_language : 0;
		const outside = input.outside ? outsideFee(nf, hours) : 0;
		now.push({ key: 'make', he: people === 1 ? 'אישור צוואה בפני נוטריון, חותם אחד' : docs === 'one' ? 'צוואות הדדיות במסמך אחד: חותם ראשון וחותם נוסף' : 'צוואות הדדיות בשני מסמכים: חותם ראשון בכל מסמך', amount: base, section: nf.item_will, url: nf.url, vat: true });
		if (translate) { now.push({ key: 'translate', he: `תרגום הצוואה בידי הנוטריון (${words.toLocaleString('en-US')} מילים${perDoc.length === 2 ? ', בכל מסמך' : ''}): מחצית תעריף התרגום`, amount: r2(translate), section: nf.item_will_translate, url: nf.url, vat: true }); }
		if (foreign) { now.push({ key: 'foreign', he: 'האישור בשפה זרה שאינה ערבית או אנגלית', amount: foreign, section: nf.item_foreign, url: nf.url, vat: true }); }
		if (night) { now.push({ key: 'night', he: `בין 19:00 ל-08:00 או ביום מנוחה: תוספת ${nf.night_pct}%`, amount: r2(night), section: nf.item_night, url: nf.url, vat: true }); }
		if (outside) { now.push({ key: 'outside', he: `הנוטריון מגיע אליכם (${hours.toLocaleString('en-US')} שעות מהיציאה ועד החזרה), בלי הוצאות הנסיעה`, amount: outside, section: nf.item_outside, url: nf.url, vat: true }); }
		flags.push({ code: 'notary_fixed', he: wc.notary_fixed_he });
		if (input.outside) { flags.push({ code: 'travel', he: 'הוצאות הנסיעה של הנוטריון משולמות בנוסף, ואין להן סכום בתקנות (פרט 9(א)). כשכמה אנשים מקבלים שירות באותו מקום ובאותו זמן, הן מתחלקות ביניהם (פרט 9(ב)).' }); }
	}
	// 2. Deposit with the registrar (optional), per testator.
	if (input.deposit) {
		const recent = Array.isArray(input.recent) ? input.recent : [input.recent, false];
		for (let i = 0; i < people; i += 1) {
			const paid = Boolean(recent[i]);
			now.push({ key: `deposit${i}`, he: `הפקדת הצוואה אצל הרשם${people === 2 ? (i === 0 ? ', המצווה הראשון' : ', המצווה השני') : ''}${paid ? ': הופקדה צוואה קודמת ב-5 השנים האחרונות' : ': אין הפקדה קודמת ב-5 השנים האחרונות, ולכן פטור'}`, amount: paid ? rf.deposit : 0, section: paid ? rf.item_deposit : rf.item_deposit_free, url: rf.url });
		}
		flags.push({ code: 'deposit_in_person', he: wc.deposit_in_person_he });
	}
	// 3. A lawyer, if the person has a quote (the tool never suggests a price).
	if (lawyer > 0) {
		now.push({ key: 'lawyer', he: `שכר טרחת עורך דין לפי ההצעה שקיבלתם${input.lawyerVat === false ? '' : `, כולל מע"מ ${vatPct}%`}`, amount: lawyer, section: '', url: '', vat: input.lawyerVat !== false, quote: true });
	}

	const nowTotal = r2(now.reduce((a, l) => a + (l.vat ? withVat(l.amount) : l.amount), 0));
	const vatOnly = r2(now.reduce((a, l) => a + (l.vat ? withVat(l.amount) - l.amount : 0), 0));

	// 4. After death: the heirs ask for a probate order, one request for each testator.
	const online = input.online !== false;
	const probateEach = online ? r2(rf.order * rf.online_pct / 100) : rf.order;
	const later = [{ key: 'probate', he: `בקשה לצו קיום צוואה${online ? `, בהגשה מקוונת (${rf.online_pct}% מהאגרה)` : ', בהגשה רגילה'}${people === 2 ? ', לכל אחד מהמצווים' : ''}`, amount: r2(probateEach * people), unit: probateEach, count: people, section: online ? `${rf.item_order}; ${rf.online_section}` : rf.item_order, url: rf.url }];
	const laterTotal = r2(later.reduce((a, l) => a + l.amount, 0));

	return {
		ok: true, form, people, docs, vatPct, now, nowTotal, vatOnly, later, laterTotal, total: r2(nowTotal + laterTotal),
		probateEach, online, flags,
		deposit: Boolean(input.deposit),
		free: now.filter((l) => l.amount === 0).length,
	};
}

/** The same choices in every form, for the side-by-side (fees only, no lawyer, no extras). */
export function byForm(registry, input) {
	const out = {};
	for (const f of FORMS) {
		const r = compute(registry, Object.assign({}, input, { form: f, lawyer: 0, words: 0, outside: false, night: false, foreign: false }));
		out[f] = r.ok ? { now: r.nowTotal, later: r.laterTotal } : null;
	}
	return out;
}
