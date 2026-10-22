/**
 * The medical-malpractice wave (22.10.2026, HAD-594): "do I have a case" (tik-rashlanut, the case check), on
 * /what-is-medical-malpractice-definition-examples/ and /medical-malpractice-lawyer-birth-recommended/.
 *
 * Dependency-free ES module on top of dates.js and the road engine's limitation() (teuna-engine.js, imported as a namespace,
 * bundled as TE). Every rule comes from the registry: reg.malpractice_tik (the elements of negligence, Civil Wrongs Ordinance
 * ss.2, 35, 36; the burden of s.41; the estate and the dependants, ss.19, 78; informed consent, Patients' Rights Law ss.13-15
 * and the First Schedule; the record, ss.17-18; the inquiry and quality committees, ss.21-23; the rights officer, s.25; the
 * expert rule, Civil Procedure Regulations 2018 regs. 87-93; the disciplinary route, Physicians Ordinance ss.41, 44; the
 * Ministry of Health complaint services; the case law named in words with its file numbers) and reg.car_accident.limitation
 * (7 years, Limitation Law s.5(1); from 18 for a minor, s.10; the war window, s.15A; a last day on a rest day moves).
 *
 * The check never gives a verdict. It says, for each of the five elements (duty, breach, causation, damage, informed consent),
 * whether the facts the reader entered point to it ('facts'), whether it still has to be proved ('prove') or whether it is
 * missing ('missing'), what proves it and where that comes from; then who carries the burden and when it can move, the
 * expert-opinion rule, the parallel tracks (none of which stops the limitation clock), and the plain limitation date. The full
 * clock (late discovery, the 10-year cap, the dependants) is the sibling tool's job: this one links to it with the facts.
 * Every top-level helper starts with "tk": the bundle concatenates this file with instrument.js, dates.js and sim-handoff.js.
 */

import { addYears, daysBetween, parseDate, fullYears, offRestDays } from './dates.js';
import * as TE from './teuna-engine.js';

export const TK_KINDS = ['birth', 'surgery', 'diagnosis', 'anesthesia', 'medication', 'dental', 'consent'];
export const TK_PATIENTS = ['adult', 'minor', 'baby', 'mother', 'both'];
export const TK_OUTCOMES = ['permanent', 'temporary', 'progress', 'death', 'none'];
export const TK_HAVE = ['record', 'discharge', 'consent', 'second', 'opinion'];
export const TK_INFORMED = ['unknown', 'no', 'yes', 'emergency'];
export const TK_ELEMENTS = ['duty', 'breach', 'causation', 'damage', 'consent'];
export const TK_STATUS = ['facts', 'prove', 'missing'];
/** The kinds of event whose patient is usually unconscious or cannot see what is done (s.41, the first condition). */
export const TK_UNSEEN = ['surgery', 'anesthesia'];

const TK_DOCS_OF = { birth: 'מהלידה', surgery: 'מהניתוח', diagnosis: 'מתקופת האבחון', anesthesia: 'מההרדמה', medication: 'של התרופה', dental: 'מטיפול השיניים', consent: 'של ההסבר' };
const tkBlank = (v) => v === '' || v === undefined || v === null;
const tkHe = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return `${d}.${m}.${y}`; };

/** The patient options that fit the kind: a birth has a baby and a mother; anything else an adult or a minor. */
export function tkPatient(kind, patient) {
	if (kind === 'birth') { return ['baby', 'mother', 'both'].includes(patient) ? patient : 'baby'; }
	return ['adult', 'minor'].includes(patient) ? patient : 'adult';
}

/**
 * The plain limitation date of one claimant: 7 years from the event (s.5(1)), from the 18th birthday for a minor (s.10),
 * plus the war window of s.15A(a) for a period still running, moved off a rest day; the road engine's limitation() with
 * reg.car_accident. A period that ended between 7.10.2023 and the eve of Amendment 8 (s.15A(c)-(d)) is revived only unless
 * the court decides otherwise: its safe date is the plain end (moved off a rest day), and `revived` keeps the later date.
 */
export function tkLimit(reg, event, birth) {
	const lim = TE.limitation(reg.car_accident, event, birth || null);
	const rv = reg.malpractice_tik && reg.malpractice_tik.war_revival;
	const war = reg.car_accident.limitation.war;
	if (!rv || !lim.added || lim.plain < war.from || lim.plain > rv.eve) { return Object.assign({}, lim, { revived: null }); }
	const safe = offRestDays(lim.plain, reg.car_accident.independence_days);
	return Object.assign({}, lim, { added: 0, raw: lim.plain, deadline: safe, rolled: safe !== lim.plain, revived: lim.deadline });
}

/**
 * input = { kind (TK_KINDS), patient (TK_PATIENTS: a birth: baby | mother | both; otherwise adult | minor), event (the day of
 *           the treatment or the birth), birth (the patient's birth day: only for a minor; a baby's is the event day), today,
 *           outcome (TK_OUTCOMES), have ([...TK_HAVE]: what the reader already holds), informed (TK_INFORMED: was the reader told
 *           the risks and the alternatives before), unaware (bool: under anesthesia or otherwise unable to know what was done),
 *           missing (bool: part of the record is missing or was not given), discovered (the day the damage or its link to the
 *           treatment became known, optional) }
 */
export function tkCompute(reg, input) {
	const T = reg.malpractice_tik;
	const ca = reg.car_accident;
	const errors = [];
	const kind = TK_KINDS.includes(input.kind) ? input.kind : 'surgery';
	const patient = tkPatient(kind, input.patient);
	const outcome = TK_OUTCOMES.includes(input.outcome) ? input.outcome : 'permanent';
	const informed = TK_INFORMED.includes(input.informed) ? input.informed : 'unknown';
	const have = TK_HAVE.filter((h) => (input.have || []).includes(h));
	const today = parseDate(input.today);
	const event = parseDate(input.event);
	if (!event) { errors.push({ field: 'event', he: `${kind === 'birth' ? 'יום הלידה' : 'יום הטיפול'}: תאריך מלא, לדוגמה 10.6.2025` }); }
	if (event && today && event > today) { errors.push({ field: 'event', he: `${kind === 'birth' ? 'יום הלידה' : 'יום הטיפול'} אחרי היום` }); }
	let birth = null;
	if (patient === 'minor' && !tkBlank(input.birth)) {
		birth = parseDate(input.birth);
		if (!birth) { errors.push({ field: 'birth', he: 'תאריך הלידה לא תקין. לדוגמה: 3.2.2012' }); } else if (event && birth > event) {
			errors.push({ field: 'birth', he: 'תאריך הלידה אחרי יום הטיפול' });
		} else if (event && fullYears(birth, event) >= ca.limitation.adult_age) {
			errors.push({ field: 'birth', he: `לפי תאריך הלידה, ביום הטיפול כבר מלאו ${ca.limitation.adult_age}: בחרו "בגיר" או תקנו את התאריך` });
		}
	}
	let discovered = null;
	if (!tkBlank(input.discovered)) {
		discovered = parseDate(input.discovered);
		if (!discovered) { errors.push({ field: 'discovered', he: 'יום הגילוי: תאריך לא תקין' }); } else if (event && discovered < event) {
			errors.push({ field: 'discovered', he: 'יום הגילוי לפני יום הטיפול' });
		} else if (today && discovered > today) { errors.push({ field: 'discovered', he: 'יום הגילוי אחרי היום' }); }
	}
	if (errors.length) { return { ok: false, errors }; }

	const P = T.patient;
	const O = T.torts;
	const C = T.procedure;
	const L = T.caselaw;
	const K = T.kinds[kind];
	const hasOpinion = have.includes('opinion');
	const unaware = Boolean(input.unaware);
	const missing = Boolean(input.missing);
	const bodily = outcome !== 'none';
	const consentOnly = kind === 'consent';

	// 1. The five elements. Each: status, why (the facts behind the status), proves (what proves it), the section.
	const el = [];
	const add = (code, status, why, proves, section, url, notes) => el.push({ code, status, why, proves, section, url, notes: notes || [] });

	// Duty of care (s.36): a carer who treats a patient owes it (Patients' Rights Law s.2 names the carers).
	const holds = have.includes('record') || have.includes('discharge');
	const act = kind === 'birth' ? 'הלידה התנהלה בטיפול של צוות רפואי' : kind === 'consent' ? 'קיבלתם טיפול רפואי ממטפל או ממוסד רפואי' : `קיבלתם טיפול רפואי (${K.he}) ממטפל או ממוסד רפואי`;
	add('duty', 'facts', `${act}, ולכן חלה חובת זהירות כלפיכם (${O.duty_section} לפקודה; ${P.carer_section} לחוק זכויות החולה מונה את המטפלים)`,
		[holds ? 'מכתב השחרור או הרשומה שבידיכם מראים שטופלתם' : 'מסמך שמראה שטופלתם: מכתב שחרור, סיכום ביקור, הפניה או קבלה'], O.duty_section, O.url);

	// Breach (s.35): a deviation from what a reasonable, competent carer would do in the same circumstances.
	if (consentOnly) {
		add('breach', 'missing', 'לא סימנתם טענה שהטיפול עצמו בוצע לא כראוי: הטענה היא על ההסבר לפני הטיפול, וזה היסוד החמישי', ['אם יש גם טענה על הטיפול עצמו: חוות דעת של מומחה'], O.negligence_section, O.url);
	} else {
		const notes = [];
		if (have.includes('second') && !hasOpinion) { notes.push('רופא אחר שאמר שהייתה טעות נותן כיוון לבדיקה, אבל לא מחליף חוות דעת של מומחה שמצורפת לתביעה'); }
		if (missing) { notes.push('חלק מהרשומה חסר: ראו למטה את הנזק הראייתי, שיכול להעביר את הנטל'); }
		if (unaware || TK_UNSEEN.includes(kind)) { notes.push(`${O.res_ipsa_section} ("הדבר מעיד על עצמו") יכול להעביר את הנטל, רק אם שלושת התנאים שלו מתקיימים: ראו למטה`); }
		add('breach', hasOpinion ? 'facts' : 'prove', hasOpinion
			? 'יש בידיכם חוות דעת של מומחה שקובעת סטייה מהרמה של מטפל סביר; בבית המשפט עוד צריך להוכיח אותה'
			: `צריך להראות שהמטפל סטה ממה שמטפל סביר ומיומן היה עושה באותן נסיבות (${O.negligence_section}); תוצאה קשה לבדה לא מוכיחה סטייה`,
		[`חוות דעת של מומחה בתחום: ${K.expert_he} (${C.expert_section})`, 'הרשומה המלאה מאותו יום: מה נבדק, מתי ומה הוחלט'], O.negligence_section, O.url, notes);
	}

	// Causation: that the deviation (or the missing explanation) caused the damage, more likely than not.
	if (!bodily) {
		add('causation', 'missing', consentOnly
			? 'לא סימנתם נזק גופני: בטענה על ההסבר בלבד אין קשר סיבתי לנזק גופני להוכיח, ונשארת השאלה של פגיעה באוטונומיה (ביסוד החמישי)'
			: 'לא סימנתם נזק, ולכן אין עדיין קשר סיבתי להוכיח', ['אם יתגלה נזק: חוות דעת שמסבירה איך הטיפול גרם לו'], O.negligence_section, O.url);
	} else {
		const notes = [];
		if (outcome === 'progress' || kind === 'diagnosis') { notes.push(`${L.chance_he} (${L.chance_file}, ${L.chance_parties}). עורך דין בודק איך זה חל על המקרה`); }
		if (kind === 'birth') { notes.push('בתיק לידה המומחים בודקים מתי נגרמה הפגיעה: בהיריון, בלידה או אחריה'); }
		if (consentOnly) { notes.push('בטענה על ההסבר: כדי לקבל פיצוי על הנזק הגופני צריך להראות שאילו קיבלתם את המידע, הייתם מסרבים לטיפול'); }
		add('causation', hasOpinion ? 'facts' : 'prove', hasOpinion
			? 'חוות הדעת שבידיכם צריכה לקשור בין הטיפול לנזק: אם היא עושה זאת, העובדות מצביעות על הקשר'
			: 'צריך להראות שהנזק נגרם בגלל הסטייה, ולא בגלל המחלה עצמה או סיבוך שהיה קורה גם בטיפול סביר; ההוכחה לפי מאזן ההסתברויות',
		[`חוות דעת של מומחה שמסבירה מה היה קורה בטיפול סביר (${C.expert_section})`, 'הרשומה לפני הטיפול ואחריו, כדי להראות את השינוי'], O.negligence_section, O.url, notes);
	}

	// Damage (s.2): loss of life, of bodily welfare and the like. Without damage there is no tort of negligence (s.35, end).
	const DMG = { permanent: 'פגיעה קבועה או נכות', temporary: 'פגיעה זמנית: טיפול, אשפוז או ניתוח נוסף', progress: 'מחלה שהתקדמה או סיכויים שנפגעו', death: 'מוות' };
	if (bodily) {
		const notes = [];
		if (outcome === 'death') { notes.push(`העיזבון ממשיך את התביעה של המטופל (${O.estate_section}), ובן הזוג, ההורים והילדים תובעים גם בעצמם (${O.dependants_section}); למועד של התלויים יש כלל משלו, והשעון מחשב אותו`); }
		add('damage', 'facts', `סימנתם ${DMG[outcome]}: זה נזק כמשמעותו בפקודה (${O.damage_section})`,
			[outcome === 'permanent' ? 'קביעת נכות של מומחה, ומסמכי הטיפול וההשתכרות' : outcome === 'death' ? 'תעודת הפטירה, סיכום האשפוז האחרון ומסמכי התלות הכלכלית' : 'מסמכי הטיפול הנוסף, אישורי מחלה, קבלות ותלושי שכר'], O.damage_section, O.url, notes);
	} else if (consentOnly) {
		add('damage', 'prove', `${L.autonomy_he} (${L.autonomy_files.join(', ')})`, ['רשימה שלכם של מה שלא הוסבר ומה הייתם מחליטים', 'טופס ההסכמה ודף ההסבר'], O.damage_section, L.comptroller_url);
	} else {
		add('damage', 'missing', `לא סימנתם נזק. עוולת הרשלנות קיימת רק כשנגרם נזק (${O.negligence_section}); אם נזק יתגלה בהמשך, ההתיישנות יכולה להימנות מיום הגילוי (${O.late_section})`, ['מסמכים רפואיים על כל נזק שמתגלה'], O.damage_section, O.url);
	}

	// Informed consent (Patients' Rights Law ss.13-15).
	const written = kind === 'surgery' ? `; לניתוח ההסכמה בכתב, עם תמצית ההסבר (${P.written_section}, ${P.schedule_section})` : kind === 'birth' ? `; לניתוח קיסרי, כמו לכל ניתוח, ההסכמה בכתב (${P.written_section}, ${P.schedule_section})` : '';
	if (informed === 'no') {
		add('consent', 'facts', `לפי מה שסימנתם, לא הוסברו לכם הסיכונים או החלופות לפני הטיפול: החוק דורש הסבר סביר ומוקדם (${P.consent_section})`,
			['רשימה שלכם של מה לא הוסבר, מתי ומי נכח', 'טופס ההסכמה: מה כתוב בו ומתי נחתם'], P.consent_section, P.url,
			[`${L.autonomy_he} (${L.autonomy_files.join(', ')})`, bodily ? 'לפיצוי על הנזק הגופני צריך להראות גם שאילו קיבלתם את המידע, הייתם מסרבים לטיפול' : '']);
	} else if (informed === 'unknown') {
		add('consent', 'prove', `לא ידוע מה הוסבר. ההסבר צריך לכלול את האבחנה, מהות הטיפול, הסיכונים והחלופות (${P.consent_section})${written}`,
			['טופס ההסכמה ודף ההסבר מהרשומה', 'מה אתם זוכרים מהשיחה לפני הטיפול'], P.consent_section, P.url);
	} else if (informed === 'emergency') {
		add('consent', 'prove', `טיפול דחוף בלי הסכמה מותר רק כשבגלל החירום אי אפשר היה לקבל אותה (${P.emergency_section}); אם זה כך, אין כאן טענה`,
			['הרשומה מזמן החירום: מה היה המצב ומי החליט'], P.emergency_section, P.url);
	} else {
		add('consent', 'missing', 'לפי מה שסימנתם, הסבירו לכם את הסיכונים והחלופות לפני הטיפול: מכאן לא עולה טענה. מה שקובע הוא תוכן ההסבר, לא רק החתימה',
			['אם יש ספק: טופס ההסכמה ודף ההסבר'], P.consent_section, P.url);
	}
	el.forEach((e) => { e.notes = e.notes.filter(Boolean); });

	// 2. Who carries the burden, and when it can move. Words and file numbers only; never a verdict.
	const burden = [];
	burden.push({ code: 'rule', level: 'info', he: 'ככלל מי שתובע מוכיח את כל היסודות, לפי מאזן ההסתברויות: סביר יותר שכן מאשר שלא', section: O.negligence_section, url: O.url });
	if (missing) {
		burden.push({ code: 'evidentiary', level: 'ok', he: `${L.evidentiary_he}. החובה לתעד את הטיפול ברשומה קבועה בחוק (${P.record_section} לחוק זכויות החולה), והכלל נקבע בפסיקה (${L.evidentiary_file}, ${L.evidentiary_parties}, ${L.evidentiary_year})`, section: L.evidentiary_file, url: L.comptroller_url });
	} else {
		burden.push({ code: 'evidentiary_check', level: 'info', he: `אם יתברר שחלק מהרשומה חסר (למשל רצועת ניטור, דוח ניתוח או גיליון): ${L.evidentiary_he} (${L.evidentiary_file})`, section: L.evidentiary_file, url: L.comptroller_url });
	}
	if (unaware || TK_UNSEEN.includes(kind)) {
		burden.push({ code: 'res_ipsa', level: unaware ? 'ok' : 'info', he: `${O.res_ipsa_he} (${O.res_ipsa_section} לפקודה): ${O.res_ipsa_conditions_he.map((c, i) => `${i + 1}. ${c}`).join('; ')}. בית המשפט בודק כל תנאי; הכלל לא חל אוטומטית${unaware ? '. סימנתם שלא יכולתם לדעת מה נעשה (למשל בהרדמה): זה התנאי הראשון' : ''}`, section: O.res_ipsa_section, url: O.url });
	}
	if (informed === 'no' || informed === 'unknown' || consentOnly) {
		burden.push({ code: 'autonomy', level: 'info', he: `${L.autonomy_he} (${L.autonomy_files.join(', ')}: ${L.autonomy_parties})`, section: L.autonomy_files[0], url: L.comptroller_url });
	}
	if (kind === 'diagnosis' || outcome === 'progress') {
		burden.push({ code: 'chance', level: 'warn', he: `${L.chance_he} (${L.chance_file}, ${L.chance_parties}, ${L.chance_year}); זו שאלה פתוחה לפי הנסיבות, ועורך דין בודק אותה`, section: L.chance_file, url: L.court_url });
	}
	if (kind === 'diagnosis' || kind === 'birth') {
		burden.push({ code: 'basket', level: 'info', he: `${L.outside_basket_he} (${L.outside_basket_file})`, section: L.outside_basket_file, url: L.comptroller_url });
	}

	// 3. The expert-opinion rule (Civil Procedure Regulations 2018).
	const expert = {
		field: K.expert_he, section: C.expert_section, he: C.expert_he, url: C.url, have: hasOpinion,
		rows: [
			{ section: C.exempt_section, he: C.exempt_he },
			{ section: C.sanction_section, he: C.sanction_he },
			{ section: C.exam_section, he: C.exam_he },
			{ section: C.counter_section, he: C.counter_he },
			{ section: C.court_expert_section, he: C.court_expert_he },
			{ section: C.agreed_section, he: C.agreed_he },
			{ section: C.questions_section, he: C.questions_he },
		],
	};

	// 4. The evidence to gather, with where each comes from. kind: 'law' (a right or a duty the law sets) or 'advice'.
	const evidence = [];
	const ev = (code, he, from, have2, kindOf, section, url) => evidence.push({ code, he, from, have: Boolean(have2), kind: kindOf, section: section || '', url: url || '' });
	ev('record', 'הרשומה הרפואית המלאה של הטיפול', 'המוסד שטיפל (מחלקת הרשומות הרפואיות של בית החולים, הקופה או המרפאה); זכות לקבל עותק', have.includes('record'), 'law', P.access_section, P.url);
	ev('discharge', 'מכתב השחרור וסיכומי הביקור', 'נמסר בשחרור או בביקור; עותק נוסף מהרשומה', have.includes('discharge'), 'advice');
	ev('kind', `המסמכים ${TK_DOCS_OF[kind]}: ${K.docs_he.join('; ')}`, 'חלק מהרשומה: מבקשים אותם במפורש בבקשה לעותק, כי בקשה כללית לא תמיד כוללת אותם', have.includes('record'), 'law', P.record_section, P.url);
	evidence[evidence.length - 1].docs = K.docs_he.slice();
	ev('consent', 'טופס ההסכמה ודף ההסבר', `מהרשומה; ל${P.schedule_he} ההסכמה בכתב`, have.includes('consent'), 'law', P.written_section, P.url);
	ev('damage', bodily ? 'מסמכי הנזק: אישורי מחלה, קביעות נכות, קבלות ותלושי שכר' : 'מסמכים על כל נזק שמתגלה', 'הרופאים המטפלים, הביטוח הלאומי, המעסיק, וקבלות שלכם', false, 'advice');
	ev('opinion', `חוות דעת של מומחה: ${K.expert_he}`, 'מומחה רפואי שאתם או עורך הדין פונים אליו; מצרפים אותה לכתב התביעה', hasOpinion, 'law', C.expert_section, C.url);
	if (have.includes('second') && !hasOpinion) { ev('second', 'דעה של רופא אחר שבדק אתכם', 'רופא שבדק אחרי הטיפול: שומרים את הסיכום שלו', true, 'advice'); }
	ev('diary', 'יומן: מה קרה, מתי, מה נאמר ומי נכח', 'אתם: כותבים עכשיו, כשהזיכרון טרי, בלי להשלים מה שלא זוכרים', false, 'advice');

	// 5. The parallel tracks. None of them is a claim, and none stops the limitation clock.
	const R = T.tracks;
	const D = T.discipline;
	const tracks = [
		{ code: 'complaint', title: 'תלונה למשרד הבריאות', he: R.complaint_he, rule: `טלפון ${R.complaint_phone}; עודכן ${tkHe(R.complaint_updated)}`, section: '', url: R.complaint_url },
		{ code: 'officer', title: 'האחראי לזכויות המטופל במוסד', he: `${P.officer_he}`, rule: P.officer_section, section: P.officer_section, url: P.url },
		{ code: 'inquiry', title: 'ועדת בדיקה', he: `${P.inquiry_he}. ${P.inquiry_findings_he}`, rule: `${P.inquiry_section}; ${P.inquiry_findings_section}`, section: P.inquiry_section, url: P.url },
		{ code: 'quality', title: 'ועדת בקרה ואיכות', he: `${P.quality_he}; ${P.objection_he} (${P.objection_section})`, rule: P.quality_section, section: P.quality_section, url: P.url },
		{ code: 'discipline', title: 'הליך משמעתי נגד המטפל', he: `${D.he_rule}; ${D.grounds_he}. ${D.hearing_he} (${D.hearing_section}). ${D.no_money_he}${kind === 'dental' ? `. לרופא שיניים: ${D.dentist_section} ל${D.dentist_he}; ${D.dentist_basis}` : ''}`, rule: kind === 'dental' ? `${D.section}; ${D.dentist_section} לפקודת רופאי השיניים` : D.section, section: D.section, url: D.url },
		{ code: 'nhi', title: 'קבילה על קופת החולים', he: R.nhi_he, rule: `${R.nhi_sections}; ${R.nhi_free_he}`, section: '', url: R.nhi_url },
	];

	// 6. The plain limitation date of each claimant (the full rule is the clock's).
	const people = [];
	const lim = (who, b) => { const l = tkLimit(reg, event, b); people.push(Object.assign({ who }, l, { adult: b ? addYears(b, ca.limitation.adult_age) : null })); };
	let minorNoBirth = false;
	if (patient === 'baby' || patient === 'both') { lim('baby', event); }
	if (patient === 'mother' || patient === 'both') { lim('mother', null); }
	if (patient === 'adult') { lim('patient', null); }
	if (patient === 'minor') { if (birth) { lim('patient', birth); } else { minorNoBirth = true; } }
	const deadline = people.length ? people.map((p) => p.deadline).sort()[0] : null;

	const flags = [];
	const flag = (level, code, he, section, url) => flags.push({ level, code, he, section: section || '', url: url || '' });
	if (minorNoBirth) { flag('warn', 'minor_birth', `קטין ביום הטיפול: הזמן עד גיל ${ca.limitation.adult_age} לא נספר (${ca.limitation.minor_section} לחוק ההתיישנות). הזינו תאריך לידה כדי לחשב את היום האחרון.`, ca.limitation.minor_section, ca.limitation.url); }
	const expired = Boolean(deadline && today && deadline < today);
	if (expired) { flag('danger', 'expired', `לפי הכלל הפשוט, היום האחרון (${tkHe(deadline)}) כבר עבר. יש חריגים: גילוי מאוחר, הודאה בכתב, ליקוי נפשי ועוד. השעון בודק אותם, ועורך דין מכריע.`, ca.limitation.section, ca.limitation.url); }
	if (discovered && discovered > event) { flag('info', 'late', `הנזק או הקשר שלו לטיפול התגלו ב-${tkHe(discovered)}: ההתיישנות יכולה להימנות מיום הגילוי, עם תקרה של 10 שנים מיום הנזק (${O.late_section} לפקודה). השעון מחשב את זה.`, O.late_section, O.url); }
	if (patient === 'both') { flag('info', 'two', 'לתינוק ולאם יש מועדים נפרדים: התביעה של התינוק נמנית מגיל 18, ושל האם מיום הלידה.', ca.limitation.minor_section, ca.limitation.url); }
	if (outcome === 'death') { flag('info', 'death', `מוות: העיזבון ממשיך את התביעה (${O.estate_section}) והתלויים תובעים בעצמם (${O.dependants_section}). המועד של התלויים נמנה אחרת: השעון מחשב.`, O.dependants_section, O.url); }
	if (!bodily && !consentOnly) { flag('warn', 'no_damage', 'בלי נזק אין עוולת רשלנות. אם יתגלה נזק, חוזרים לבדיקה עם יום הגילוי.', O.negligence_section, O.url); }
	const added = people.reduce((s, p) => Math.max(s, p.added || 0), 0);
	if (added) { flag('info', 'war', `${added} ימים מתוך ${tkHe(ca.limitation.war.from)} עד ${tkHe(ca.limitation.war.to)} לא נספרים (${ca.limitation.war.section} לחוק ההתיישנות), ולכן היום האחרון נדחה.`, ca.limitation.war.section, ca.limitation.url); }
	const revived = people.find((p) => p.revived);
	if (revived) { const rv = reg.malpractice_tik.war_revival; flag('warn', 'war_revived', `שבע השנים הסתיימו ב-${tkHe(revived.plain)}. ${rv.he}: עד ${tkHe(revived.revived)} רק אם בית המשפט לא יחליט אחרת.`, rv.section, rv.url); }

	const counts = { facts: 0, prove: 0, missing: 0 };
	el.forEach((e) => { counts[e.status] += 1; });
	return {
		ok: true, kind, patient, outcome, informed, have, unaware, missing, event, birth, discovered, today, bodily,
		elements: el, counts, figure: counts.facts, burden, expert, evidence, tracks, people, deadline, expired, flags,
		daysLeft: deadline && today ? daysBetween(today, deadline) : null,
		daysSince: today ? daysBetween(event, today) : null,
	};
}

/** The analytics band: the kind and the three counts, never a date or a word the reader typed. */
export function tkBand(r) {
	if (!r || !r.ok) { return 'error'; }
	return `${r.kind}-${r.counts.facts}${r.counts.prove}${r.counts.missing}`;
}
