/**
 * The medical-malpractice wave (22.10.2026, HAD-594): the medical-records request generator (bakashat-reshuma,
 * /obtaining-medical-records-copy/).
 *
 * Dependency-free ES module on top of dates.js. Every number comes from the registry: reg.malpractice_reshuma (the Patients'
 * Rights Law 1996, the maximum-payment regulations 2019, the Ministry of Health tariff, the Director-General's circular
 * 9/2019, the Public Health (Keeping of Records) Regulations 1976, the newborn circulars 21/2005 and 42/2006, the Legal
 * Capacity and Guardianship Law) and reg.car_accident (the Independence days for the rest-day rule; the age of 18).
 *  - Who asks (the patient, a parent of a minor, a guardian, a relative holding a medical power of attorney, a relative or
 *    heir of a deceased patient, a lawyer or an expert with a waiver) x where (a hospital, an HMO, a private clinic, the IDF
 *    Medical Corps) x what (the whole file or named documents) -> the right and its section (s.18(a); the waiver of s.20(a)(1);
 *    the guardians of s.14 of the Capacity Law; the heirs' route of circular 9/2019 C.12; the Medical Corps by s.27(a)(1)),
 *    what to attach, and the exceptions (s.18(c)-(e), personal notes s.17(a), sensitive records C.14).
 *  - The cost: the maximum for a computerised copy (reg. 3(a), the schedule: 10 shekels, discs free) and for a paper copy
 *    (reg. 3(b): the Ministry's tariff, L0268 for up to 10 pages and L0269 for every 2 more), only for the people reg. 3
 *    names, only for a record created in the 5 years before the request (reg. 3(c)) and from 1.1.2011 (reg. 8(a)); the
 *    deceased patient's relative (reg. 3(d): the 6 months before the death, a request within 30 days of it); the free items
 *    (reg. 4). Who is not covered (a lawyer, an expert, an insurer) sees the tariff lines, never an invented cap.
 *  - The time to answer: none is set by a law, a regulation or the circular (C.22: each institution publishes its own).
 *  - How long a hospital keeps each document (the 1976 regulations, reg. 4 and the schedule), the earliest day any reading
 *    allows first; a state or municipal hospital (reg. 4(e)), an HMO, a clinic and the Medical Corps get words, not dates.
 * Never a verdict: the tool says what the texts give and what to attach. Every top-level helper starts with "rs": the bundle
 * concatenates this file with instrument.js, dates.js, sim-handoff.js and word-document.js.
 */

import { addDays, addMonths, addYears, parseDate, fullYears, offRestDays } from './dates.js';

export const RS_WHO = ['self', 'parent', 'guardian', 'poa', 'heir', 'rep'];
export const RS_WHERE = ['hospital', 'hmo', 'clinic', 'idf'];
export const RS_OWNER = ['other', 'state', 'unknown'];
export const RS_FORMAT = ['any', 'digital', 'paper'];
export const RS_DOCS = ['all', 'adm', 'op', 'an', 'ct', 'im', 'nu', 'co', 'lb', 'er', 'su'];
/** Who the caps of reg. 3 cover: the patient, a relative holding a power of attorney, a guardian (a parent of a minor is
 * the minor's natural guardian, Capacity Law s.14). The relative of a deceased patient is covered only inside reg. 3(d). */
export const RS_CAPPED = ['self', 'parent', 'guardian', 'poa'];

const rsBlank = (v) => v === '' || v === undefined || v === null;
const rsIso = (v) => (rsBlank(v) ? '' : parseDate(v) || null);
const rsHe = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; };
const rsMin = (list) => list.filter(Boolean).sort()[0] || null;

/** The documents of a request: the whole file stands alone; unknown codes are dropped; order as RS_DOCS. */
export function rsDocs(list) {
	const raw = Array.isArray(list) ? list : String(list || '').split(/[.,\s]+/);
	const set = new Set(raw.filter((c) => RS_DOCS.includes(c)));
	if (set.has('all')) { return ['all']; }
	return RS_DOCS.filter((c) => set.has(c));
}

/**
 * The paper copy by the tariff (reg. 3(b)): L0268 for up to 10 pages, then L0269 for every 2 more pages. An odd last page is
 * counted as a pair (the tariff names a price for "every 2 more pages" and says nothing of one page): the result is a maximum.
 */
export function rsPaper(reg, pages) {
	const it = reg.malpractice_reshuma.tariff.items;
	const base = it.L0268.amount;
	const n = rsBlank(pages) ? null : Number(pages);
	if (n === null || n <= it.L0268.pages) { return { base, extraPairs: 0, extra: 0, total: base, pages: n }; }
	const extraPairs = Math.ceil((n - it.L0268.pages) / it.L0269.per_pages);
	const extra = extraPairs * it.L0269.amount;
	return { base, extraPairs, extra, total: base + extra, pages: n };
}

/**
 * Reg. 3(d): one relative of a deceased patient pays at most what a guardian pays, for the treatments of the 6 months
 * before the death, when the request is filed within 30 days of the death. The last day moves off a rest day
 * (Interpretation Law s.10(c), as reg.car_accident.limitation applies it).
 */
export function rsDeceased(reg, death, treated, today) {
	const R = reg.malpractice_reshuma.regs;
	const ca = reg.car_accident;
	const plainEnd = addDays(death, R.deceased_days);
	const end = offRestDays(plainEnd, (ca && ca.independence_days) || []);
	const from = addMonths(death, -R.deceased_months);
	const inWindow = today <= end;
	const covers = treated >= from && treated <= death;
	return { plainEnd, end, rolled: end !== plainEnd, from, inWindow, covers, capped: inWindow && covers };
}

/**
 * The earliest day the 1976 regulations allow a hospital to destroy a row of the schedule, from the day of the treatment
 * (the regulation counts from the last hospitalisation, treatment or entry: a later one only moves it later). Row 1 has two
 * readings: 20 years with a summary sheet; without one, 25 years or 7 years after the death, the earlier. Row 13: 10 years
 * or 7 years after the death, the earlier. The earliest of the readings is the safe date.
 */
export function rsRow(reg, n, treated, death) {
	const row = reg.malpractice_reshuma.retention.rows[n];
	if (!row) { return null; }
	const readings = [{ he: `${row.years} שנים${row.after_he ? ` ${row.after_he}` : ''}`, date: addYears(treated, row.years) }];
	if (row.no_summary_years) {
		const noSummary = [addYears(treated, row.no_summary_years)];
		if (death && row.death_years) { noSummary.push(addYears(death, row.death_years)); }
		readings.push({ he: `בלי גליון סיכום מחלה: ${row.no_summary_years} שנים${death ? `, או ${row.death_years} שנים אחרי הפטירה, המוקדם` : ''}`, date: rsMin(noSummary) });
	} else if (death && row.death_years) {
		readings.push({ he: `${row.death_years} שנים אחרי הפטירה, אם מוקדם יותר`, date: addYears(death, row.death_years) });
	}
	return { n, he: row.he, years: row.years, readings, date: rsMin(readings.map((x) => x.date)) };
}

/** The retention of each requested document in a hospital, the earliest row first, and the earliest of them all. */
export function rsRetention(reg, docs, treated, death) {
	const D = reg.malpractice_reshuma.documents;
	const items = docs.map((code) => {
		const rows = D[code].rows.map((n) => rsRow(reg, n, treated, death)).filter(Boolean).sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
		return { code, he: D[code].he, unnamed: Boolean(D[code].unnamed), rows, earliest: rows.length ? rows[0].date : null };
	});
	return { items, earliest: rsMin(items.map((x) => x.earliest)) };
}

function rsErr(field, he) { return { field, he }; }

/** The request: the right, what to attach, the cost, the free items, the time to answer, the retention, the flags, the dates. */
export function rsCompute(reg, input) {
	const M = reg.malpractice_reshuma;
	const L = M.law;
	const R = M.regs;
	const T = M.tariff;
	const C = M.circular;
	const K = M.retention;
	const errors = [];
	const i = input || {};
	const who = RS_WHO.includes(i.who) ? i.who : 'self';
	const where = RS_WHERE.includes(i.where) ? i.where : 'hospital';
	const owner = where === 'hospital' ? (RS_OWNER.includes(i.owner) ? i.owner : 'unknown') : '';
	const format = RS_FORMAT.includes(i.format) ? i.format : 'any';
	const docs = rsDocs(i.docs);
	const missing = rsDocs(i.missing).filter((c) => c !== 'all');
	const today = parseDate(i.today) || '2026-10-22';
	const treated = rsIso(i.treated);
	const birth = rsIso(i.birth);
	const death = rsIso(i.death);
	if (!docs.length && !missing.length) { errors.push(rsErr('docs', 'צריך לבחור לפחות מסמך אחד, או את התיק כולו.')); }
	if (treated === '') { errors.push(rsErr('treated', 'צריך את יום הטיפול (גם תאריך משוער מספיק).')); }
	else if (treated === null) { errors.push(rsErr('treated', 'התאריך לא תקין. כותבים יום.חודש.שנה, למשל 10.3.2025.')); }
	else if (treated > today) { errors.push(rsErr('treated', 'יום הטיפול אחרי היום. בודקים את השנה.')); }
	if (birth === null) { errors.push(rsErr('birth', 'תאריך הלידה לא תקין.')); }
	else if (birth && treated && birth > treated) { errors.push(rsErr('birth', 'תאריך הלידה אחרי יום הטיפול.')); }
	if (death === null) { errors.push(rsErr('death', 'תאריך הפטירה לא תקין.')); }
	else if (death && treated && death < treated) { errors.push(rsErr('death', 'תאריך הפטירה לפני יום הטיפול.')); }
	else if (death && death > today) { errors.push(rsErr('death', 'תאריך הפטירה אחרי היום.')); }
	let pages = '';
	if (!rsBlank(i.pages)) {
		const n = Number(String(i.pages).replace(/[,\s]/g, ''));
		if (!Number.isInteger(n) || n < 0 || n > 100000) { errors.push(rsErr('pages', 'מספר העמודים צריך להיות מספר שלם, 0 או יותר.')); } else { pages = n; }
	}
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const flag = (code, level, he, section, url) => flags.push({ code, level, he, section: section || '', url: url || '' });
	const ageNow = birth ? fullYears(birth, today) : null;
	const ageAtTreat = birth ? fullYears(birth, treated) : null;
	const adultAge = M.capacity.minor_age;
	const adultNow = who === 'parent' && ageNow !== null && ageNow >= adultAge;
	const followup = missing.length > 0;
	const regsApply = treated >= R.applies_from;
	const fiveFrom = addYears(today, -R.years);
	const within5 = treated >= fiveFrom;
	const dec = who === 'heir' && death ? rsDeceased(reg, death, treated, today) : null;

	// The right and what to attach, by who asks. A parent of a patient who is an adult today asks with the patient's own
	// waiver, like a representative (Codex review of PR 172): the letter, the basis and the attachments follow `asWho`.
	const asWho = adultNow ? 'rep' : who;
	const basis = [];
	const attach = [];
	const lawRight = { he: L.right_he, section: L.right_section, url: L.url };
	if (asWho === 'self') {
		basis.push(lawRight);
		attach.push(C.self_he);
	} else if (asWho === 'parent') {
		basis.push(lawRight, { he: M.capacity.parents_he, section: `${M.capacity.parents_section} ל${M.capacity.he}`, url: M.capacity.url }, { he: C.minor_he, section: `${C.sections.minor} ל${C.short_he}`, url: C.url });
		attach.push('תעודה מזהה של ההורה, עם הספח שבו רשום הילד', 'אם ההורים פרודים: אין צורך בחתימת ההורה השני, אלא אם ידוע שהוא מתנגד');
	} else if (asWho === 'guardian') {
		basis.push(lawRight, { he: C.guardian_he, section: `${C.sections.guardian} ל${C.short_he}`, url: C.url });
		attach.push('צו המינוי של בית המשפט, בתוקף (מקור או העתק מאושר)', 'תעודה מזהה של האפוטרופוס');
	} else if (asWho === 'poa') {
		basis.push(lawRight, { he: C.rep_he, section: `${C.sections.rep} ל${C.short_he}`, url: C.url });
		attach.push('ייפוי הכוח (רפואי או מתמשך לעניינים אישיים)', 'כתב ויתור על סודיות רפואית חתום בידי המטופל', 'תעודה מזהה של מיופה הכוח');
	} else if (asWho === 'heir') {
		basis.push({ he: C.deceased_he, section: `${C.sections.deceased} ל${C.short_he}`, url: C.url });
		attach.push('צו ירושה או צו קיום צוואה שבו המבקש רשום כיורש, או צו בית משפט, או תצהיר מאומת בפני עורך דין', 'תעודת פטירה', 'תעודה מזהה של המבקש');
	} else {
		basis.push({ he: L.disclose_he, section: L.disclose_section, url: L.url }, { he: C.rep_he, section: `${C.sections.rep} ל${C.short_he}`, url: C.url });
		attach.push('כתב ויתור על סודיות רפואית, מקורי או העתק מאושר, חתום בעט בידי המטופל ובפני עד', 'ייפוי כוח מהמטופל, אם הוויתור ניתן לטובת אחר', 'תעודה מזהה של הפונה');
	}
	if (where === 'idf') {
		basis.push({ he: L.idf_he, section: L.idf_section, url: L.url });
	}

	// Who the caps cover.
	let capped = RS_CAPPED.includes(who) && !adultNow;
	if (dec) { capped = dec.capped; }
	const capReasons = [];
	if (!regsApply) { capReasons.push(`הרשומה נוצרה לפני ${rsHe(R.applies_from)}: התקנות חלות רק על רשומה שנוצרה מאז (${R.sections.applies})`); }
	else if (!within5) { capReasons.push(`הרשומה נוצרה לפני ${rsHe(fiveFrom)}, יותר מ-${R.years} שנים לפני הבקשה: התשלום המרבי חל רק על ${R.years} השנים האחרונות (${R.sections.five})`); }
	if (who === 'rep') { capReasons.push(`התשלום המרבי חל רק על ${R.capped_he} (${R.sections.computerised}); בקשה של עורך דין או מומחה אינה ביניהם`); }
	if (adultNow) { capReasons.push(`המטופל בן ${ageNow} היום: ההורה כבר אינו האפוטרופוס, וצריך כתב ויתור על סודיות מהמטופל עצמו`); }
	if (who === 'heir' && !death) { capReasons.push('בלי תאריך הפטירה אי אפשר לבדוק את חלון 30 הימים של תקנה 3(ד)'); }
	if (dec && !dec.capped) {
		if (!dec.inWindow) { capReasons.push(`עברו יותר מ-${R.deceased_days} ימים מהפטירה (היום האחרון היה ${rsHe(dec.end)}) (${R.sections.deceased})`); }
		if (!dec.covers) { capReasons.push(`הטיפול לא היה בששת החודשים שלפני הפטירה (מ-${rsHe(dec.from)}) (${R.sections.deceased})`); }
	}
	const isCapped = capped && regsApply && within5;
	const relativeFree = ['self', 'parent', 'guardian', 'poa', 'heir'].includes(who) && !adultNow;
	const free = regsApply && relativeFree ? R.free.filter((f) => f.code !== 'rx' || who !== 'heir') : [];

	// The cost lines.
	const it = T.items;
	const lines = [];
	const paper = rsPaper(reg, pages);
	const showDigital = format !== 'paper';
	const showPaper = format !== 'digital';
	if (isCapped) {
		if (showDigital) { lines.push({ code: 'computerised', he: R.computerised_he, amount: R.computerised_max, kind: 'max', section: `${R.sections.computerised} ו${R.sections.schedule}, פרט 1`, url: R.url }); }
		if (showDigital) { lines.push({ code: 'disc', he: 'כל תקליטור נוסף', amount: R.extra_disc, kind: 'max', section: `${R.sections.schedule}, פרט 2`, url: R.url }); }
		if (showPaper) {
			lines.push({ code: 'paper', he: `העתק רשומה שאינה ממוחשבת: ${it.L0268.he}`, amount: it.L0268.amount, kind: 'max', section: `${R.sections.paper}; תעריפון, L0268`, url: T.file_url });
			lines.push({ code: 'pages', he: `${it.L0269.he}${paper.extraPairs ? ` (${paper.pages} עמודים: ${paper.extraPairs} זוגות נוספים)` : ''}`, amount: paper.extraPairs ? paper.extra : it.L0269.amount, kind: paper.extraPairs ? 'max' : 'each', section: `${R.sections.paper}; תעריפון, L0269`, url: T.file_url });
		}
	} else {
		lines.push({ code: 'printout', he: it.L9413.he, amount: it.L9413.amount, kind: 'tariff', section: 'תעריפון, L9413', url: T.file_url });
		lines.push({ code: 'paper', he: it.L0268.he, amount: it.L0268.amount, kind: 'tariff', section: 'תעריפון, L0268', url: T.file_url });
		lines.push({ code: 'pages', he: it.L0269.he, amount: paper.extraPairs ? paper.extra : it.L0269.amount, kind: paper.extraPairs ? 'tariff' : 'each', section: 'תעריפון, L0269', url: T.file_url });
	}
	const imaging = docs.includes('im') || docs.includes('all');
	if (imaging && (showPaper || !isCapped)) {
		lines.push({ code: 'films', he: `${it.L6498.he}; ${it.L6499.he}: ${it.L6499.amount} ₪`, amount: it.L6498.amount, kind: 'info', section: 'תעריפון, L6498-L6499', url: T.file_url });
	}
	const digitalMax = isCapped && showDigital ? R.computerised_max : null;
	const paperMax = isCapped && showPaper ? paper.total : null;
	const lead = digitalMax !== null ? { amount: digitalMax, kind: 'digital' } : paperMax !== null ? { amount: paperMax, kind: 'paper' } : { amount: it.L0268.amount, kind: 'tariff' };

	// Each document: free once at the end of the treatment (reg. 4(c)) or part of the request.
	const docItems = (docs.length ? docs : []).map((code) => {
		const d = M.documents[code];
		let cost = 'request';
		if (relativeFree && regsApply && d.free === 'summary') { cost = 'free_once'; }
		if (relativeFree && regsApply && code === 'lb') { cost = 'free_if_out'; }
		return { code, he: d.he, cost };
	});

	// Retention: the 1976 regulations bind a hospital that is not a state or municipal one (reg. 4(e)).
	let retention = null;
	const retDocs = Array.from(new Set([...docs, ...missing]));
	if (where === 'hospital' && owner !== 'state' && retDocs.length) {
		retention = rsRetention(reg, retDocs, treated, death || '');
	}

	// Flags: every rule the texts state for this request, as words with the section; never a verdict.
	if (followup) {
		flag('missing', 'warn', `בהעתק שהתקבל חסרים מסמכים: ${missing.map((c) => M.documents[c].he).join(', ')}. ${L.record_he.split(';')[0]} (${L.record_section}), והמוסד אחראי לשמירת הרשומה (${L.keep_section}); הפרת החובה היא עבירה (${L.penalty_section}). מבקשים בכתב להשלים, או אישור בכתב שהמסמך לא קיים ולמה`, L.record_section, L.url);
	}
	if (!regsApply) { flag('before2011', 'warn', `הרשומה נוצרה לפני ${rsHe(R.applies_from)}: תקנות התשלום המרבי לא חלות עליה, גם לא הפטורים. המחיר לפי המוסד; מבקשים הצעת מחיר בכתב לפני התשלום`, R.sections.applies, R.url); }
	else if (!within5) { flag('older5', 'warn', `הרשומה נוצרה יותר מ-${R.years} שנים לפני הבקשה: אין עליה תשלום מרבי בתקנות (${R.sections.five}). הפטורים של ${R.sections.free} עדיין חלים`, R.sections.five, R.url); }
	if (who === 'rep') {
		flag('rep_cap', 'info', `התשלום המרבי לא חל על בקשה של עורך דין או מומחה. כשהמטופל עצמו מבקש ומעביר את ההעתק, חלה התקרה. ${R.insurer_he} (${R.sections.definitions})`, R.sections.computerised, R.url);
		flag('waiver_date', 'info', `${C.waiver_check_he} (${C.sections.waiver_date})`, C.sections.waiver_date, C.url);
	}
	if (adultNow) { flag('adult_now', 'danger', `המטופל בן ${ageNow}: מגיל ${adultAge} הוא בגיר (${M.capacity.minor_section} ל${M.capacity.he}) וההורה אינו האפוטרופוס שלו. ההורה פונה עם כתב ויתור על סודיות שהמטופל חתם עליו (${L.disclose_section})`, L.disclose_section, L.url); }
	if (who === 'self' && ageNow !== null && ageNow < adultAge) { flag('minor_self', 'info', `המטופל בן ${ageNow}: עד גיל ${adultAge} אחד ההורים מבקש בשמו (${C.sections.minor})`, C.sections.minor, C.url); }
	if (who === 'heir') {
		if (!death) { flag('heir_death', 'warn', 'חסר תאריך הפטירה: בלעדיו אי אפשר לחשב את חלון 30 הימים של תקנה 3(ד).', R.sections.deceased, R.url); }
		else if (dec.capped) { flag('heir_window', 'ok', `${R.deceased_he}. היום האחרון להגיש: ${rsHe(dec.end)}${dec.rolled ? ' (אחרי מעבר מיום מנוחה)' : ''}`, R.sections.deceased, R.url); }
		flag('heir_court', 'info', C.deceased_court_he, C.sections.deceased, C.url);
	}
	if (where === 'hospital' && owner === 'state') { flag('state', 'warn', `${K.state_he} (${K.state_section}). ${C.retention_he}: התקופות שם לא נבדקו כאן`, K.state_section, K.url); }
	if (where === 'hospital' && owner === 'unknown') { flag('owner_unknown', 'info', `אם זה בית חולים ממשלתי או עירוני, התקופות של תקנות השמירה לא חלות עליו (${K.state_section}); בבית חולים אחר הן חלות כפי שמוצג`, K.state_section, K.url); }
	if (where !== 'hospital') { flag('no_period', 'info', `תקנות השמירה חלות על ${K.scope_he}. ל${where === 'hmo' ? 'קופת חולים' : where === 'clinic' ? 'מרפאה פרטית' : 'חיל הרפואה'} לא נמצאה בטקסטים שנקראו תקופת שמירה במספר; ${L.keep_he} (${L.keep_section})`, L.keep_section, L.url); }
	if (where === 'idf') { flag('idf', 'info', `${L.idf_he} (${L.idf_section}). התקנות מחריגות במפורש רק את שירות בתי הסוהר (${R.sections.prisons}); בקשו אישור בכתב של המחיר`, L.idf_section, L.url); }
	if (where === 'clinic') { flag('clinic', 'info', `כל הרשומה אצל מטפל עצמאי היא יחידה אחת לתשלום (${R.sections.unit}(א)(4))`, R.sections.unit, R.url); }
	if (where === 'hmo') { flag('hmo_unit', 'info', `${R.unit_he} (${R.sections.unit})`, R.sections.unit, R.url); }
	if (retention && retention.items.some((x) => x.unnamed)) { flag('ctg', 'warn', 'רישומי המוניטור בלידה לא מופיעים בשמם בתוספת לתקנות: אם הם בתיק, 20 שנה (פרט 1); אם הם נשמרים כתרשים נפרד, אפשר לטעון לפרט 14 או 15 (10 שנים או שנתיים). מבקשים אותם עכשיו', K.section, K.url); }
	if (docs.includes('ct') || docs.includes('all') || missing.includes('ct')) {
		if (who === 'parent' || docs.includes('ct') || missing.includes('ct')) { flag('newborn', 'info', `${K.newborn.rule_he}. ${K.newborn.mother_rule_he}`, 'חוזרי מינהל הרפואה 21/2005 ו-42/2006', K.newborn.url); }
	}
	if (birth && ageAtTreat !== null && ageAtTreat < adultAge && retention) {
		const eighteen = addYears(birth, adultAge);
		const early = retention.items.filter((x) => x.earliest && x.earliest < eighteen);
		if (early.length) { flag('before18', 'danger', `לפי התקנות מותר לבער את ${early.map((x) => x.he).join(', ')} כבר לפני ${rsHe(eighteen)}, היום שבו המטופל בן ${adultAge} ומתחילה להיספר ההתיישנות (${reg.car_accident.limitation.minor_section} לחוק ההתיישנות). מבקשים העתק עכשיו ומבקשים לשמור את המקור`, reg.car_accident.limitation.minor_section, reg.car_accident.limitation.url); }
	}
	if (retention && retention.earliest && retention.earliest < today) { flag('past', 'danger', `לפי התקנות כבר מותר לבער חלק מהמסמכים (מ-${rsHe(retention.earliest)}). ייתכן שהם עוד שמורים: רופא רשאי להורות לשמור יותר (${K.doctor_section}). מבקשים בכתב לאשר מה קיים`, K.doctor_section, K.url); }
	flag('withhold', 'info', `${L.withhold_he}; ${L.ethics_he} (${L.ethics_section})`, L.withhold_section, L.url);
	flag('notes', 'info', 'תרשומת אישית של המטפל אינה חלק מהרשומה הרפואית, ולכן אינה נמסרת', L.record_section, L.url);
	if (who === 'rep' || docs.includes('all')) { flag('sensitive', 'info', C.sensitive_he, C.sections.sensitive, C.url); }
	flag('original', 'info', C.original_he, C.sections.original, C.url);

	// The dates a text sets (for the calendar).
	const events = [];
	if (dec && dec.capped) { events.push({ key: 'deceased', date: dec.end, he: `היום האחרון לבקשה של קרוב במחיר המרבי (${R.sections.deceased})`, section: R.sections.deceased, url: R.url }); }
	if (retention) {
		retention.items.forEach((x) => {
			if (x.earliest && x.earliest >= today) { events.push({ key: `keep_${x.code}`, date: x.earliest, he: `מותר לבער את ${x.he} (המועד המוקדם ביותר)`, section: `${K.section}, פרט ${x.rows[0].n}`, url: K.url }); }
		});
	}
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

	return {
		ok: true, who, where, owner, format, docs, missing, followup, today, treated, birth, death, pages,
		ageNow, ageAtTreat, adultNow, asWho, regsApply, within5, fiveFrom, dec, capped: isCapped, capReasons,
		basis, attach, free, lines, paper, digitalMax, paperMax, lead, docItems, retention, flags, events,
		response: M.response,
		start: addDays(R.published, R.start_days),
	};
}

/** A band for analytics: who asks and whether a cap applies. Never a date, a name or an amount. */
export function rsBand(r) {
	if (!r || !r.ok) { return 'error'; }
	return `${r.who}-${r.where}-${r.capped ? 'cap' : 'nocap'}${r.followup ? '-gap' : ''}`;
}
