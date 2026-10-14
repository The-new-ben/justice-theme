/**
 * Wave 5 (HAD-504): a residential lease under the Fair Rental chapter of the Rental and Borrowing Law, 1971 (chapter A,
 * part 6, ss.25א-25טו, as amended to 30.9.2026), with a plain-language check of every choice against the law.
 *
 * Dependency-free ES module. Every number comes from registry.rent_contract, read on its checked_on date:
 *  - Security (s.25י(ב)): securities that cost the tenant money (cash, a bank guarantee, and since the 2026 economic plan
 *    law a guarantee from another licensed guarantor) may not exceed together the lower of the rent for a third of the
 *    term and three months' rent. A promissory note and personal guarantors cost nothing, so they are outside the cap,
 *    but every security is realised only in the cases of s.25י(ג), after notice (s.25י(ד)), and returned within 60 days
 *    (s.25י(ה)).
 *  - Repairs (s.25ח): the landlord repairs within 30 days of a demand, an urgent defect within 3; the tenant pays for
 *    damage from unreasonable use. Payments (s.25ט): what the tenant pays, and what he never pays.
 *  - Options and cancellation (ss.25יב, 25יג), the landlord's notice on a sale (s.25יא), and the scope of the part
 *    (s.25טו). s.25יד: nothing in the contract may worsen these for the tenant.
 * The generator never writes a clause the law voids: a choice against the law is shown in the check and the contract
 * carries the lawful term instead.
 */

import { addDays, addMonths, parseDate } from './dates.js';

const r2 = (n) => Math.round(n * 100) / 100;
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const blank = (v) => v === '' || v === undefined || v === null;
const numOr = (v, d) => (blank(v) ? d : Number(v));
export const PAYS = ['arnona', 'water', 'power', 'gas', 'vaad'];
export const FORBIDDEN = ['insurance', 'broker', 'systems'];
const PAY_HE = { arnona: 'ארנונה ומסים אחרים החלים על המחזיק בדירה', water: 'מים', power: 'חשמל', gas: 'גז וחימום', vaad: 'ועד הבית, לאחזקה שוטפת' };
const FORBIDDEN_HE = { insurance: 'ביטוח המבנה', broker: 'דמי תיווך למתווך שפעל מטעם המשכיר', systems: 'רכישה או השבחה של מערכות ומיתקנים קבועים (דוד, מזגן, מעלית)' };
const METHOD_HE = { transfer: 'בהעברה בנקאית לחשבון שהמשכיר יודיע עליו בכתב', checks: 'בשיקים חודשיים שהשוכר ימסור במעמד החתימה', standing: 'בהוראת קבע בבנק' };
const BL = '__________';

/** The cap of s.25י(ב): the lower of the rent for a third of the term and three months' rent. */
export function depositCap(rc, rent, months) {
	const [a, b] = rc.deposit.term_share;
	const byTerm = r2(rent * months * a / b);
	const byMonths = r2(rent * rc.deposit.months);
	return { byTerm, byMonths, cap: Math.min(byTerm, byMonths), binding: byTerm < byMonths ? 'term' : 'months' };
}

function heDate(iso) {
	if (!iso) { return BL; }
	const [y, m, d] = iso.split('-').map(Number);
	return `${d}.${m}.${y}`;
}
const sh = (n) => `${Math.round(n).toLocaleString('en-US')} ₪`;

/**
 * input = { rent, months, start (ISO or ''), payDay, method, index, option ('none'|'tenant'|'landlord'|'both'), optionMonths,
 *   optionPct, optTenantDays, optLandlordDays, exit ('none'|'tenant'|'both'|'landlord'), exitTenantDays, exitLandlordDays,
 *   replacement, cash, bank, other, note, guarantors, guarantorMax, returnDays, repairDays, urgentDays,
 *   pays {arnona, water, power, gas, vaad}, forbidden {insurance, broker, systems}, asIs, parking, storage, pets
 *   ('ask'|'yes'|'no'), smoking, relative, furniture (text), defects (text), landlord, tenant, address, city (text) }
 */
export function compute(registry, input) {
	const rc = registry.rent_contract;
	const errors = [];
	const rent = numOr(input.rent, NaN);
	const months = numOr(input.months, 12);
	const payDay = numOr(input.payDay, 1);
	if (!(rent > 0 && rent < 1e6)) { errors.push({ field: 'rent', he: 'דמי השכירות לחודש: מספר חיובי' }); }
	if (!(Number.isInteger(months) && months >= 1 && months <= 360)) { errors.push({ field: 'months', he: 'תקופת השכירות בחודשים: 1 עד 360' }); }
	if (!(Number.isInteger(payDay) && payDay >= 1 && payDay <= 28)) { errors.push({ field: 'payDay', he: 'יום התשלום בחודש: 1 עד 28' }); }
	const start = blank(input.start) ? '' : parseDate(input.start);
	if (start === null) { errors.push({ field: 'start', he: 'תאריך תחילה לא תקין (לדוגמה 1.11.2026)' }); }
	const money = {};
	const guarantors = numOr(input.guarantors, 0);
	if (!(Number.isInteger(guarantors) && guarantors >= 0 && guarantors <= 3)) { errors.push({ field: 'guarantors', he: 'מספר הערבים: 0 עד 3' }); }
	// The guarantee ceiling is read only with guarantors: a value left in the hidden field never blocks the lease.
	for (const k of ['cash', 'bank', 'other', 'note', 'guarantorMax']) {
		money[k] = k === 'guarantorMax' && !(guarantors > 0) ? 0 : numOr(input[k], 0);
		if (!(isNum(money[k]) && money[k] >= 0 && money[k] < 1e8)) { errors.push({ field: k, he: 'סכום: מספר חיובי או ריק' }); }
	}
	const days = {};
	const dayFields = { returnDays: rc.deposit.return_days, repairDays: rc.repairs.days, urgentDays: rc.repairs.urgent_days, optTenantDays: rc.option.tenant_days, optLandlordDays: rc.option.landlord_days, exitTenantDays: rc.exit.tenant_days, exitLandlordDays: rc.exit.landlord_days };
	for (const [k, d] of Object.entries(dayFields)) {
		days[k] = numOr(input[k], d);
		if (!(Number.isInteger(days[k]) && days[k] >= 0 && days[k] <= 365)) { errors.push({ field: k, he: 'מספר ימים: 0 עד 365' }); }
	}
	const option = ['tenant', 'landlord', 'both'].includes(input.option) ? input.option : 'none';
	const optionMonths = option === 'none' ? 0 : numOr(input.optionMonths, 12);
	if (option !== 'none' && !(Number.isInteger(optionMonths) && optionMonths >= 1 && optionMonths <= 120)) { errors.push({ field: 'optionMonths', he: 'תקופת האופציה בחודשים: 1 עד 120' }); }
	const optionPct = option === 'none' ? 0 : numOr(input.optionPct, 0);
	if (!(isNum(optionPct) && optionPct >= -50 && optionPct <= 100)) { errors.push({ field: 'optionPct', he: 'שינוי בדמי השכירות באופציה: מ-50%- עד 100%' }); }
	// Dwellings the chapter excludes by kind (s.25טו(א)(1)): a hotel or holiday flat, a hostel, assisted living, student
	// or worker housing, a protected tenancy. Their own rules apply; this lease is not for them (review, PR 128).
	if (input.excluded) { errors.push({ field: 'excl', he: 'על דירה בבית מלון או לנופש, במעון, בדיור מוגן, במעונות לסטודנטים או לעובדים, או בשכירות מוגנת, הסימן על שכירות למגורים לא חל (סעיף 25טו(א)(1)), ויש לה כללים אחרים. החוזה כאן לא מתאים לה; פנו לעורך דין.' }); }
	if (errors.length) { return { ok: false, errors }; }

	const exitChoice = ['tenant', 'both', 'landlord'].includes(input.exit) ? input.exit : 'none';
	const pays = {};
	PAYS.forEach((k) => { pays[k] = input.pays ? input.pays[k] !== false : true; });
	const forbidden = {};
	FORBIDDEN.forEach((k) => { forbidden[k] = Boolean(input.forbidden && input.forbidden[k]); });
	const cap = depositCap(rc, rent, months);
	const counted = r2(money.cash + money.bank + money.other);
	const flags = [];
	const add = (level, code, he, cites, asked, lawful) => flags.push({ level, code, he, cites, asked: asked ?? null, lawful: lawful ?? null });

	// Scope (s.25טו): the part may not apply at all.
	const applies = !((months <= rc.scope.short_months && option === 'none') || (months > rc.scope.long_years * 12 && !['both', 'landlord'].includes(exitChoice)));
	if (months <= rc.scope.short_months && option === 'none') { add('info', 'short', `שכירות של עד ${rc.scope.short_months} חודשים בלי ברירת הארכה: סימן החוזה למגורים לא חל בחובה (סעיף 25טו(א)(2)). החוזה כתוב כפי שסוכם, וההגנות שבחוק מוצגות כאן לידיעה.`, ['25טו']); }
	if (months > rc.scope.long_years * 12 && !['both', 'landlord'].includes(exitChoice)) { add('info', 'long', `שכירות של יותר מ-${rc.scope.long_years} שנים בלי זכות ביטול מוקדם למשכיר: הסימן לא חל בחובה (סעיף 25טו(א)(3)).`, ['25טו']); }
	if (rent > rc.scope.rent_cap) { add('warn', 'rent_cap', `שכר דירה של יותר מ-${sh(rc.scope.rent_cap)} לחודש: ייתכן שהסימן לא חל (סעיף 25טו(א)(4)). ${rc.scope.rent_cap_he}.`, ['25טו']); }
	const relative = Boolean(input.relative);
	const free = !applies || relative;
	const freeWhy = !applies ? 'הסימן לא חל על חוזה זה (סעיף 25טו(א))' : 'בין קרובים מותר להתנות על ההגנה הזאת (סעיף 25טו(ב))';
	const uncertain = applies && !relative && rent > rc.scope.rent_cap;
	if (input.relative) { add('info', 'relative', 'השוכר קרוב משפחה של המשכיר: מותר להתנות על ההגנות של סעיף 25יד(2) (סעיף 25טו(ב)), והחוזה כתוב כפי שסוכם. רק החובה למסור דירה ראויה למגורים (סעיף 25ו) נשארת (סעיף 25יד(1)).', ['25טו']); }

	// Security (s.25י).
	let scale = 1;
	if (free && counted > cap.cap + 0.005) {
		// Where the cap does not bind (s.25טו), the amount stays as agreed, with a note (review, PR 128).
		add('info', 'deposit_free', `${freeWhy}: הערובות (${sh(counted)}) נשארות כפי שסוכם, אף שבחוזה שהסימן חל עליו בלי ויתור התקרה היא ${sh(cap.cap)}.`, ['25טו', '25י(ב)']);
	} else if (counted > cap.cap + 0.005) {
		scale = cap.cap / counted;
		add('bad', 'deposit_over', `הערובות שעולות כסף לשוכר (${sh(counted)}) גבוהות מהתקרה ב-${sh(counted - cap.cap)}. מותר לבקש עד ${sh(cap.cap)}: הנמוך מבין דמי השכירות לשליש מהתקופה (${sh(cap.byTerm)}) ופי ${rc.deposit.months} מדמי השכירות לחודש (${sh(cap.byMonths)}).`, ['25י(ב)'], sh(counted), sh(cap.cap));
	} else if (counted > 0) {
		add('ok', 'deposit_ok', `הערובות שעולות כסף לשוכר (${sh(counted)}) בתוך התקרה של ${sh(cap.cap)}.`, ['25י(ב)']);
	}
	if (money.other > 0) { add('info', 'other_guarantor', `ערבות מחברת ביטוח או מבעל רישיון אשראי נספרת בתקרה כמו מזומן וערבות בנקאית (${rc.amend_2026.he}, ${rc.amend_2026.gazette_he}).`, ['25י(ב)']); }
	if (money.note > 0 || guarantors > 0) { add('info', 'not_counted', 'שטר חוב וערבים אינם עולים כסף לשוכר, ולכן אינם נספרים בתקרה. גם אותם מותר לממש רק במקרים שבסעיף 25י(ג), אחרי הודעה.', ['guarantee', '25י(ג)']); }
	const sec = {};
	['cash', 'bank', 'other'].forEach((k) => { sec[k] = scale < 1 ? Math.floor(money[k] * scale) : money[k]; });
	sec.note = money.note;
	const lawful = free ? Object.assign({}, days) : {
		returnDays: Math.min(days.returnDays, rc.deposit.return_days),
		repairDays: Math.min(days.repairDays, rc.repairs.days),
		urgentDays: Math.min(days.urgentDays, rc.repairs.urgent_days),
		optTenantDays: Math.min(days.optTenantDays, rc.option.tenant_days),
		optLandlordDays: Math.max(days.optLandlordDays, rc.option.landlord_days),
		exitTenantDays: Math.min(days.exitTenantDays, rc.exit.tenant_days),
		exitLandlordDays: Math.max(days.exitLandlordDays, rc.exit.landlord_days),
	};
	const anySecurity = counted > 0 || money.note > 0 || guarantors > 0;
	if (anySecurity && days.returnDays > rc.deposit.return_days) { add('bad', 'return_late', `החזרת הערובה תוך ${days.returnDays} ימים: החוק מחייב ${rc.deposit.return_days} לכל היותר מהשבת הדירה.`, ['25י(ה)', '25יד'], `${days.returnDays} ימים`, `${rc.deposit.return_days} ימים`); }
	if (days.repairDays > rc.repairs.days) { add('bad', 'repair_late', `תיקון ליקוי תוך ${days.repairDays} ימים: החוק מחייב ${rc.repairs.days} לכל היותר מהדרישה.`, ['25ח(ב)', '25יד'], `${days.repairDays} ימים`, `${rc.repairs.days} ימים`); }
	if (days.urgentDays > rc.repairs.urgent_days) { add('bad', 'urgent_late', `תיקון דחוף תוך ${days.urgentDays} ימים: החוק מחייב ${rc.repairs.urgent_days} לכל היותר.`, ['25ח(ב)', '25יד'], `${days.urgentDays} ימים`, `${rc.repairs.urgent_days} ימים`); }

	// Payments (s.25ט).
	FORBIDDEN.forEach((k) => { if (forbidden[k]) { add('bad', `pay_${k}`, `${FORBIDDEN_HE[k]}: השוכר לא משלם (סעיף 25ט(ב)). בחוזה התשלום הזה על המשכיר.`, ['25ט(ב)', '25יד'], 'על השוכר', 'על המשכיר'); } });
	if (input.asIs) { add('bad', 'as_is', 'סעיף "כמות שהיא" שבו השוכר מוותר על טענות על פגמים: בטל. המשכיר חייב למסור דירה ראויה ומתאימה למגורים, ותניה שפוטרת אותו מפגם שידע עליו בטלה (סעיפים 25ה, 25ו, 8 ו-25יד). הסעיף לא נכנס לחוזה.', ['25ו', '25יד', '8'], 'כמות שהיא', 'דירה ראויה למגורים ופגמים ידועים בכתב'); }

	// Cancellation (s.25יג) and options (s.25יב).
	let exit = exitChoice;
	if (exitChoice === 'landlord') { exit = free ? 'landlord' : 'none'; add('bad', 'exit_landlord', 'זכות ביטול למשכיר בלבד בטלה: מותר לתת אותה רק אם גם לשוכר יש זכות כזאת (סעיף 25יג(א)). בחוזה אין זכות ביטול מוקדם.', ['25יג'], 'ביטול למשכיר בלבד', 'בלי ביטול, או לשני הצדדים'); }
	if (exit === 'both' && days.exitLandlordDays < rc.exit.landlord_days) { add('bad', 'exit_landlord_days', `הודעת ביטול של המשכיר ${days.exitLandlordDays} ימים מראש: החוק מחייב לפחות ${rc.exit.landlord_days}.`, ['25יג'], `${days.exitLandlordDays} ימים`, `${rc.exit.landlord_days} ימים`); }
	if (['tenant', 'both'].includes(exit) && days.exitTenantDays > rc.exit.tenant_days) { add('bad', 'exit_tenant_days', `הודעת ביטול של השוכר ${days.exitTenantDays} ימים מראש: החוק דורש ${rc.exit.tenant_days}, ותנאי ארוך יותר מרע עם השוכר (סעיף 25יד).`, ['25יג', '25יד'], `${days.exitTenantDays} ימים`, `${rc.exit.tenant_days} ימים`); }
	if (['tenant', 'both'].includes(option) && days.optTenantDays > rc.option.tenant_days) { add('bad', 'opt_tenant_days', `השוכר נדרש להודיע על האופציה ${days.optTenantDays} ימים לפני הסוף: החוק מאפשר לו להודיע עד ${rc.option.tenant_days} ימים לפני (סעיף 25יב(ג)).`, ['25יב', '25יד'], `${days.optTenantDays} ימים`, `${rc.option.tenant_days} ימים`); }
	if (['landlord', 'both'].includes(option) && days.optLandlordDays < rc.option.landlord_days) { add('bad', 'opt_landlord_days', `המשכיר מודיע על האופציה שלו ${days.optLandlordDays} ימים לפני הסוף: החוק מחייב לפחות ${rc.option.landlord_days}, ובתנאים שנקבעו מראש (סעיף 25יב(ב)).`, ['25יב'], `${days.optLandlordDays} ימים`, `${rc.option.landlord_days} ימים`); }
	const defects = String(input.defects || '').trim();
	if (!defects) { add('info', 'no_defects', 'לא פירטתם פגמים ידועים: החוזה אומר שהמשכיר מצהיר שלא ידוע לו על פגם שאינו קל ערך. אם יש פגם ידוע, כתבו אותו, כי החוק מחייב לפרט אותו בחוזה (התוספת השנייה, פרט 7).', ['25ג']); }

	// Waivable terms (every section cited is in the chapter, and none is s.25ו, which s.25יד(1) keeps for relatives too):
	// where the parties may set them, the lease takes what was agreed and the flag is a note; above the unindexed rent line
	// the lease keeps the protection and says the chapter may not apply (review, PR 128).
	const waivable = (f) => f.cites.every((c) => /^25/.test(c) && !/^25ו/.test(c));
	flags.forEach((f) => {
		if (f.level !== 'bad' || !waivable(f)) { return; }
		if (free) { f.level = 'info'; f.he = `${freeWhy}, והחוזה כתוב כפי שסוכם. לידיעה: ${f.he}`; f.asked = null; f.lawful = null; }
		else if (uncertain) { f.level = 'warn'; f.he = `ייתכן שהסימן לא חל, כי שכר הדירה מעל ${sh(rc.scope.rent_cap)} (סעיף 25טו(א)(4)); החוזה שומר על ההגנה בכל זאת: ${f.he}`; }
	});
	const end = start ? addDays(addMonths(start, months), -1) : '';
	const optionRent = r2(rent * (100 + optionPct) / 100);
	const bad = flags.filter((f) => f.level === 'bad').length;
	const r = {
		ok: true, rent, months, start, end, payDay, method: METHOD_HE[input.method] ? input.method : 'transfer', index: Boolean(input.index),
		option, optionMonths, optionPct, optionRent, exit, replacement: input.replacement !== false,
		cap, counted, sec, guarantors, guarantorMax: money.guarantorMax, lawful, pays, forbidden,
		parking: Boolean(input.parking), storage: Boolean(input.storage), pets: ['yes', 'no'].includes(input.pets) ? input.pets : 'ask', smoking: Boolean(input.smoking),
		defects, furniture: String(input.furniture || '').trim(),
		names: { landlord: String(input.landlord || '').trim(), tenant: String(input.tenant || '').trim(), address: String(input.address || '').trim(), city: String(input.city || '').trim() },
		flags, bad, applies, free, relative, uncertain,
	};
	r.clauses = clauses(rc, r);
	r.schedule = scheduleCheck(rc, r);
	return r;
}

/** The Second Schedule (s.25ג): what the contract holds, and what is left to fill by hand. */
export function scheduleCheck(rc, r) {
	const s = rc.schedule2;
	return [
		{ item: s[0], state: r.names.address ? 'filled' : 'hand' },
		{ item: s[1], state: r.names.landlord && r.names.tenant ? 'ids' : 'hand' },
		{ item: s[2], state: r.furniture || r.parking || r.storage ? 'filled' : 'list' },
		{ item: s[3], state: 'filled' },
		{ item: s[4], state: 'filled' },
		{ item: s[5], state: 'filled' },
		{ item: s[6], state: r.defects ? 'filled' : 'declared' },
	];
}

/** The lease itself: numbered clauses, each with the sections it rests on. */
export function clauses(rc, r) {
	const n = r.names;
	const out = [];
	const c = (title, paras, cites) => out.push({ title, paras: paras.filter(Boolean), cites });
	const where = [n.address || BL, n.city].filter(Boolean).join(', ');
	const attached = [r.parking ? 'החניה' : '', r.storage ? 'המחסן' : ''].filter(Boolean).join(' ו');
	c('הצדדים', [
		`נערך ונחתם ב-${BL} ביום ${BL}.`,
		`בין: ${n.landlord || BL}, ת"ז ${BL}, מען: ${BL} (להלן: "המשכיר");`,
		`לבין: ${n.tenant || BL}, ת"ז ${BL}, מען: ${BL} (להלן: "השוכר").`,
	], ['25ב', '25ג']);
	c('הדירה', [
		`המשכיר משכיר לשוכר את הדירה ב${where}${attached ? `, לרבות ${attached} הצמודים לה` : ''} (להלן: "הדירה"), למטרת מגורים בלבד, יחד עם הריהוט והאבזרים המפורטים בנספח א'.`,
	], ['25א', '25ג', '16']);
	c('מצב הדירה ומסירתה', [
		`המשכיר ימסור את הדירה ביום ${heDate(r.start)} כשהיא ראויה ומתאימה למגורים, פנויה מכל אדם ומכל נכס שאינו מפורט בנספח א'.`,
		r.defects ? `ידוע למשכיר על הפגמים והליקויים האלה בדירה או בסביבתה: ${r.defects}. אין בכך כדי לפטור את המשכיר מתיקון פגם שאינו קל ערך לפי סעיף 7 לחוזה.` : 'המשכיר מצהיר שלא ידוע לו על פגם או ליקוי בדירה, בסביבתה או בנכס המשמש אותה, שאינו קל ערך או שגורם הפרעה של ממש לשימוש בה.',
		'במעמד המסירה ייערך פרוטוקול מסירה שייחתם בידי שני הצדדים, ובו מצב הדירה והציוד וקריאות המונים. עד המסירה ימסור המשכיר לשוכר הוראות תחזוקה ושימוש לדירה, למיתקניה ולציוד.',
	], ['25ה', '25ו', '25ז', '25ג', '8']);
	const term = r.start ? `מיום ${heDate(r.start)} עד יום ${heDate(r.end)} (כולל)` : `מיום המסירה ועד תום ${r.months} חודשים`;
	const optT = `השוכר רשאי להאריך את השכירות ב-${r.optionMonths} חודשים נוספים, בדמי שכירות של ${sh(r.optionRent)} לחודש ובשאר תנאי החוזה, אם יודיע על כך למשכיר בכתב לא יאוחר מ-${r.lawful.optTenantDays} ימים לפני תום התקופה.`;
	const optL = `המשכיר רשאי להאריך את השכירות ב-${r.optionMonths} חודשים נוספים, בדמי שכירות של ${sh(r.optionRent)} לחודש ובשאר תנאי החוזה, אם יודיע על כך לשוכר בכתב לא יאוחר מ-${r.lawful.optLandlordDays} ימים לפני תום התקופה.`;
	c('תקופת השכירות והארכתה', [
		`תקופת השכירות היא ${r.months} חודשים, ${term}.`,
		['tenant', 'both'].includes(r.option) ? optT : '',
		['landlord', 'both'].includes(r.option) ? optL : '',
		'המשכיר יודיע לשוכר זמן סביר לפני תום התקופה אם ברצונו להאריך את השכירות, ובאילו תנאים.',
	], ['25יב', '25ג']);
	c('דמי השכירות', [
		`השוכר ישלם למשכיר דמי שכירות של ${sh(r.rent)} לחודש, מראש, עד ה-${r.payDay} בכל חודש, ${METHOD_HE[r.method]}.`,
		r.index ? 'דמי השכירות צמודים למדד המחירים לצרכן שמפרסמת הלשכה המרכזית לסטטיסטיקה. מדד הבסיס הוא המדד הידוע ביום חתימת החוזה, והפרשי ההצמדה מחושבים בכל תשלום לפי המדד הידוע ביום התשלום.' : 'דמי השכירות קבועים ואינם צמודים למדד לכל תקופת השכירות.',
	], ['14', '25ג']);
	const payList = PAYS.filter((k) => r.pays[k]).map((k) => PAY_HE[k]);
	c('תשלומים נוספים', [
		payList.length ? `בנוסף לדמי השכירות ישלם השוכר, בעד תקופת השכירות בלבד: ${payList.join('; ')}. השוכר יעביר את החשבונות על שמו מיום המסירה.` : 'השוכר אינו משלם תשלומים נוספים על דמי השכירות.',
		r.free && FORBIDDEN.some((k) => r.forbidden[k]) ? `בהסכמת הצדדים ישא השוכר ב${FORBIDDEN.filter((k) => r.forbidden[k]).map((k) => FORBIDDEN_HE[k]).join(', ב')}.` : '',
		FORBIDDEN.some((k) => !(r.free && r.forbidden[k])) ? `השוכר לא יישא ב${FORBIDDEN.filter((k) => !(r.free && r.forbidden[k])).map((k) => FORBIDDEN_HE[k]).join(', ב')}, חוץ משיפור שהשוכר ביקש בעצמו. תשלומים אלה על המשכיר.` : '',
	], ['25ט(א)', '25ט(ב)', '25ג']);
	c('תיקונים', [
		'השוכר אחראי לליקוי שנגרם משימוש בלתי סביר בדירה, ויתקן אותו על חשבונו.',
		`כל ליקוי או פגם אחר שאינו קל ערך יתקן המשכיר על חשבונו בתוך זמן סביר ולא יאוחר מ-${r.lawful.repairDays} ימים מקבלת דרישה מהשוכר, ופגם שאינו מאפשר מגורים סבירים בדירה לא יאוחר מ-${r.lawful.urgentDays} ימים.`,
		'לא תיקן המשכיר במועד, רשאי השוכר לתקן ולקבל מהמשכיר את הוצאותיו הסבירות, או להפחית מדמי השכירות כל עוד הפגם לא תוקן, לפי סעיף 9 לחוק השכירות והשאילה.',
	], ['25ח(א)', '25ח(ב)', '25ח(ג)', '9']);
	c('שימוש בדירה, שינויים וביקורים', [
		'השוכר ישתמש בדירה למגורים, ישמור עליה, ולא יבצע בה שינויים בלי הסכמת המשכיר מראש ובכתב.',
		'המשכיר רשאי לבדוק את הדירה ולתקן בה בתיאום מראש של 24 שעות לפחות, בשעה סבירה ובהפרעה מעטה ככל האפשר, חוץ ממקרה חירום.',
		r.pets === 'yes' ? 'השוכר רשאי להחזיק בדירה בעלי חיים ביתיים, ויתקן על חשבונו כל נזק שייגרם מהם.' : r.pets === 'no' ? 'השוכר לא יחזיק בעלי חיים בדירה.' : 'החזקת בעלי חיים בדירה טעונה הסכמת המשכיר מראש, שלא תסורב מטעמים בלתי סבירים.',
		r.smoking ? 'לא יעשנו בתוך הדירה.' : '',
	], ['16', '16א', '17']);
	c('העברת השכירות ושוכר חלופי', [
		'השוכר לא יעביר את זכויותיו ולא ישכיר את הדירה בשכירות משנה בלי הסכמת המשכיר מראש ובכתב, והמשכיר לא יסרב מטעמים בלתי סבירים.',
		r.replacement ? 'השוכר רשאי לסיים את השכירות לפני תום התקופה אם יציע שוכר חלופי מתאים, שיקבל על עצמו את תנאי החוזה לתקופה שנותרה; המשכיר לא יסרב לו מטעמים בלתי סבירים, ומיום כניסת השוכר החלופי פוקעים חיובי השוכר לעתיד.' : '',
	], ['22']);
	c('ביטול לפני תום התקופה', [
		r.exit === 'none' ? `אין לצדדים זכות לבטל את החוזה לפני תום התקופה שלא בשל הפרתו${r.replacement ? ', חוץ מהאמור בסעיף 9 לחוזה' : ''}.` : '',
		r.exit === 'tenant' ? `השוכר רשאי לבטל את החוזה בכל עת בהודעה בכתב ${r.lawful.exitTenantDays} ימים מראש לפחות. למשכיר אין זכות ביטול שלא בשל הפרה.` : '',
		r.exit === 'landlord' ? `המשכיר רשאי לבטל את החוזה בכל עת בהודעה בכתב ${r.lawful.exitLandlordDays} ימים מראש לפחות. לשוכר אין זכות ביטול שלא בשל הפרה.` : '',
		r.exit === 'both' ? `כל צד רשאי לבטל את החוזה שלא בשל הפרתו: המשכיר בהודעה בכתב ${r.lawful.exitLandlordDays} ימים מראש לפחות, והשוכר בהודעה בכתב ${r.lawful.exitTenantDays} ימים מראש לפחות.` : '',
	], ['25יג', '25ג']);
	const items = [];
	if (r.sec.cash) { items.push(`פיקדון במזומן של ${sh(r.sec.cash)}`); }
	if (r.sec.bank) { items.push(`ערבות בנקאית של ${sh(r.sec.bank)}`); }
	if (r.sec.other) { items.push(`ערבות של ${sh(r.sec.other)} מחברת ביטוח או מבעל רישיון אשראי`); }
	if (r.sec.note) { items.push(`שטר חוב על סך ${sh(r.sec.note)}`); }
	if (r.guarantors) { items.push(`כתב ערבות של ${r.guarantors === 1 ? 'ערב אחד' : `${r.guarantors} ערבים`}, בנוסח נספח ב'`); }
	const capped = r2(r.sec.cash + r.sec.bank + r.sec.other);
	c('ערובות', items.length ? [
		`להבטחת חיוביו לפי החוזה ימסור השוכר במעמד החתימה: ${items.join('; ')}.`,
		capped && capped <= r.cap.cap + 0.005 ? `הערובות שכרוכות בהוצאה כספית לשוכר אינן עולות יחד על ${sh(r.cap.cap)}, הנמוך מבין דמי השכירות לשליש מתקופת השכירות (${sh(r.cap.byTerm)}) ופי ${rc.deposit.months} מדמי השכירות לחודש (${sh(r.cap.byMonths)}).` : '',
		'המשכיר רשאי לממש ערובה רק אם השוכר לא שילם דמי שכירות במועד, לא תיקן ליקוי שבאחריותו, לא שילם תשלום שוטף שחל עליו, או לא פינה את הדירה בתום התקופה, ורק עד גובה החוב, ואחרי שהודיע לשוכר זמן סביר מראש ואפשר לו לתקן.',
		`בתום השכירות יחזיר המשכיר לשוכר את הערובות או את יתרתן, עם פירותיהן, בתוך ${r.lawful.returnDays} ימים מהשבת הדירה לרשותו, או עד שנפרעו חובות השוכר כאמור, לפי המאוחר.`,
	] : ['השוכר אינו נדרש למסור ערובה.'], ['25י(ב)', '25י(ג)', '25י(ד)', '25י(ה)', 'guarantee']);
	c('מכירת הדירה', [
		'מכר המשכיר את הדירה, החוזה ממשיך לחייב את הקונה. המשכיר יודיע לשוכר בכתב, לפני מסירת הדירה לקונה, את פרטי הקונה ואת דרכי ההתקשרות עמו.',
	], ['21', '25יא']);
	c('סיום השכירות', [
		'בתום השכירות ישיב השוכר את הדירה פנויה מכל אדם ומכל נכס שלו, במצב שבו קיבל אותה חוץ מבלאי סביר, עם כל המפתחות, ויציג אישורים על תשלום החשבונות השוטפים עד יום הפינוי.',
	], ['20']);
	c('שכירות שאינה מוגנת', [
		'השכירות אינה מוגנת לפי חוק הגנת הדייר [נוסח משולב], התשל"ב-1972, והשוכר לא שילם ולא ישלם דמי מפתח.',
	], ['protected']);
	c('הוראות כלליות', [
		'כל שינוי בחוזה ייעשה בכתב. הודעות יישלחו בכתב למענים שבראש החוזה, או בדואר אלקטרוני שהצדדים יודיעו זה לזה. כל צד קיבל העתק חתום של החוזה.',
		r.free ? (r.applies ? 'הצדדים קרובים כהגדרתם בסעיף 25טו(ב) לחוק השכירות והשאילה, התשל"א-1971, והתנאים שבחוזה סוכמו לפיו; אין בחוזה סעיף שגורע מחובת המשכיר למסור דירה ראויה למגורים (סעיף 25ו).' : '') : 'אין בחוזה סעיף שגורע מזכויות השוכר לפי סימן ו\' לפרק א\' לחוק השכירות והשאילה, התשל"א-1971; בכל סתירה יחול החוק.',
	], ['25ב', '25יד']);
	return out;
}

/** The plain text of the lease, for the copy button (with or without the sections). */
export function contractText(rc, r, withSources = false) {
	const lines = ['חוזה שכירות למגורים', ''];
	r.clauses.forEach((cl, i) => {
		lines.push(`${i + 1}. ${cl.title}${withSources ? ` [${cl.cites.map((k) => citeLabel(k)).join('; ')}]` : ''}`);
		cl.paras.forEach((p, j) => lines.push(cl.paras.length > 1 ? `${i + 1}.${j + 1} ${p}` : p));
		lines.push('');
	});
	lines.push(`המשכיר: ${BL}        השוכר: ${BL}`, '');
	lines.push('נספח א\': הריהוט והאבזרים בדירה');
	(r.furniture ? r.furniture.split(/\n|,|;/).map((x) => x.trim()).filter(Boolean) : [BL, BL, BL]).forEach((x, i) => lines.push(`${i + 1}. ${x}`));
	if (r.guarantors) {
		lines.push('', 'נספח ב\': כתב ערבות');
		lines.push(`אנו החתומים מטה ערבים, יחד ולחוד, לקיום חיובי השוכר לפי חוזה השכירות לדירה ב${[r.names.address || BL, r.names.city].filter(Boolean).join(', ')}, עד סכום של ${r.guarantorMax ? sh(r.guarantorMax) : `${BL} ₪`}.`);
		for (let i = 1; i <= r.guarantors; i += 1) { lines.push(`${i}. שם: ${BL} ת"ז: ${BL} מען: ${BL} חתימה: ${BL}`); }
	}
	if (withSources) { lines.push('', `לפי ${rc.law_he}, נוסח עדכני ל-${heDate(rc.law_current_to)}.`); }
	return lines.join('\n');
}

/** "סעיף 25ח(ב)" for a section key; the named keys for the other laws. */
export function citeLabel(key) {
	if (key === 'protected') { return 'חוק הגנת הדייר'; }
	if (key === 'guarantee') { return 'חוק הערבות'; }
	return `סעיף ${key}`;
}
