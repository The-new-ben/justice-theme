/**
 * The divorce roadmap (the divorce world, HAD-539): from the decision to the judgment and what comes after it, as a
 * checklist whose steps, fees and dates come from the law and the registry; progress stays in the browser.
 *
 * Dependency-free ES module. Every amount and day comes from registry.divorce_cost (the fee regulations of the
 * rabbinical courts and the family court, the Family Disputes Settlement Law 2014 and its clocks, the Bar's minimum
 * tariff), registry.divorce_agreement (how an agreement is approved and by whom), registry.property_balance (the
 * pension split through the fund) and registry.child_support (indexation and the National Insurance route), through
 * the wave-4 divorce engine (gerushin-engine: compute, clock). Where the law sets no duration the step says so.
 */
import { compute, clock, ROUTES } from './gerushin-engine.js';

export const MP_ROUTES = ROUTES;
const mpHe = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d}.${m}.${y}`; };
const mpNis = (n) => `${Number(n).toLocaleString('en-US')} ₪`;

/**
 * input = { route ('agree' | 'mediate' | 'court'), forum ('rabbinical' | 'family'), children, property, pension,
 *           start (ISO: the day the first step is taken), extended, done: [step ids] }
 * Returns { ok, route, forum, phases: [{ key, he, steps: [...] }], steps (flat), fees: { total, lines, bar }, clock,
 *           progress: { done, total, pct }, text }.
 */
export function mpBuild(registry, input) {
	const dc = registry.divorce_cost;
	const da = registry.divorce_agreement;
	const pb = registry.property_balance;
	const cs = registry.child_support;
	const route = ROUTES.includes(input.route) ? input.route : 'agree';
	const forum = input.forum === 'family' ? 'family' : 'rabbinical';
	const children = Boolean(input.children);
	const property = Boolean(input.property);
	const pension = Boolean(input.pension);
	const start = input.start || dc.checked_on;
	const fees = compute(registry, { route, forum, children, property, abroad: false, certificates: 2, lawyer: 'bar', start, extended: Boolean(input.extended) });
	if (!fees.ok) { return { ok: false, errors: fees.errors }; }
	const clk = route === 'agree' ? null : clock(dc, start, Boolean(input.extended));
	const rb = dc.rabbinical;
	const fc = dc.family;
	const ds = dc.disputes;
	const fee = (amount, section, url, he) => ({ amount, section, url, he: he || '' });
	const agreementFee = forum === 'family' ? fee(fc.agreement + fc.transcript, `${fc.items.agreement}; פרוטוקול`, fc.url, 'אגרת אישור הסכם בבית המשפט לענייני משפחה ואגרת פרוטוקול') : fee(rb.agreement, rb.items.agreement, rb.url, 'אגרה לתת להסכם תוקף של פסק דין בבית הדין');
	const requestFee = forum === 'family' ? fee(fc.request, fc.items.request, fc.url, 'אגרת בקשה ליישוב סכסוך') : fee(rb.request, rb.items.request, rb.url, 'אגרת בקשה ליישוב סכסוך');
	const forumHe = forum === 'family' ? 'בית המשפט לענייני משפחה' : 'בית הדין הרבני';
	const routeSteps = da.routes[forum].steps_he;

	const phases = [];
	const phase = (key, he) => { const p = { key, he, steps: [] }; phases.push(p); return p; };
	const step = (p, s) => { p.steps.push(Object.assign({ do: [], cost: null, when: '', link: null, source: null }, s)); };

	// 1. Before anything.
	const p1 = phase('prepare', 'לפני הכול: הכנה');
	step(p1, { id: 'docs', he: 'אוספים את המסמכים', do: ['תעודת נישואין, והסכם ממון אם נחתם', 'תלושי שכר של שניכם ל-12 חודשים, דוחות בנק וכרטיסי אשראי', 'דוחות פנסיה, קרן השתלמות וקופות גמל (המסלקה הפנסיונית)', 'נסח טאבו או חוזה הדירה, ויתרת המשכנתא', 'הסכמים, פסקי דין וצווים קודמים, אם יש'], when: 'לפני הפגישה הראשונה', link: { label: 'מה להכין לפגישת הייעוץ הראשונה', hash: 'jt-choose' } });
	step(p1, { id: 'consult', he: 'ייעוץ ראשון עם עורך דין גירושין', do: ['מי יטפל בתיק ביום יום, ומי יופיע בדיונים', 'הסכם שכר טרחה בכתב, לפי שלבים', 'מה כלול ומה משולם בנפרד: אגרות, מומחים, מע"מ'], cost: { amount: null, he: 'שכר הטרחה נקבע בהסכם; התעריף המינימלי המומלץ של הלשכה מופיע במחשבון', section: dc.bar.items.get_consent, url: dc.bar.url }, when: 'לפני שנוקטים צעד', link: { label: 'מחשבון עלות עורך דין גירושין', hash: 'jtool-gerushin' } });
	step(p1, { id: 'route', he: 'בוחרים מסלול: הסכמה, גישור, יישוב סכסוך או תביעה', do: ['בהסכמה: יש הסכם או שניסוח קרוב', 'יישוב סכסוך: החוק מחייב אותו לפני תביעה במחלוקת (סעיף 3(א))', 'תביעה: רק אחרי עיכוב ההליכים, אלא בסעד דחוף'], when: 'עכשיו', link: { label: 'גישור גירושין: איך זה עובד', path: '/divorce-mediation/' }, source: { he: ds.law_he, url: ds.url } });

	// 2. The route.
	if (route === 'agree') {
		const p2 = phase('agreement', 'ההסכם');
		step(p2, { id: 'draft', he: 'מנסחים הסכם גירושין ותוכנית הורות', do: ['ילדים: משמורת, לוח לינות, חגים, חופשות', 'מזונות: סכום, יום תשלום, הצמדה למדד, הוצאות חריגות', 'רכוש: דירה, משכנתא, פנסיה, חסכונות, חובות', 'סילוק טענות הדדי'], when: 'לפי הקצב שלכם', link: { label: 'מחולל הסכם גירושין ותוכנית הורות', hash: 'jtool-heskem-gerushin' }, source: { he: da.capacity_he, url: da.capacity_url } });
		step(p2, { id: 'file', he: `מגישים לאישור: ${forumHe}`, do: [routeSteps[0]], cost: agreementFee, when: 'אחרי החתימה', source: { he: forum === 'family' ? fc.regulation_he : rb.regulation_he, url: forum === 'family' ? fc.url : rb.url } });
		step(p2, { id: 'approve', he: 'דיון ואישור: תוקף של פסק דין', do: [routeSteps[1], routeSteps[2]], when: 'החוק לא קובע משך; בלי בקשה ליישוב סכסוך (סעיף 2)', source: { he: 'חוק להסדר התדיינויות בסכסוכי משפחה, סעיף 2', url: da.disputes_url } });
	} else {
		const p2 = phase('settlement', 'יישוב סכסוך: החוק מחייב, והשעון שלו');
		step(p2, { id: 'request', he: `בקשה ליישוב סכסוך ב${forumHe}`, do: ['טופס 1 בלי טענות ובלי נימוקים: רק מי הצדדים ומה הסכסוך', 'הצד השני מקבל זימון ליחידת הסיוע'], cost: requestFee, when: clk ? `יום 0: ${mpHe(clk.start)}` : 'יום 0', source: { he: `${ds.law_he}, ${ds.sections.first}`, url: ds.url } });
		step(p2, { id: 'meetings', he: `עד ${ds.meetings_max} פגישות מהו"ת ביחידת הסיוע, בלי תשלום`, do: ['פגישות מידע, היכרות ותיאום עם עובד סוציאלי ולעיתים עם עורך דין של היחידה', 'כאן נולדים רוב ההסכמים: מתכוננים אליהן כמו לדיון'], cost: { amount: 0, he: ds.free_he, section: ds.sections.meetings, url: ds.url }, when: clk ? `עד ${mpHe(clk.meetingsBy)} (${clk.meetingsDays} ימים)` : `תוך ${ds.meetings_days} ימים`, link: { label: 'לתרגל את פגישת המהו"ת', sim: 'mediation' }, source: { he: `${ds.law_he}, ${ds.sections.meetings_days}`, url: ds.url } });
		step(p2, { id: 'stay', he: 'עיכוב הליכים: אי אפשר להגיש תביעה', do: ['אפשר לבקש סעד דחוף: צו הגנה, עיכוב יציאה, מזונות זמניים', 'אפשר לבקש לקצר או להאריך את התקופה'], when: clk ? `עד ${mpHe(clk.stayEnds)} (${clk.stayDays} ימים)` : `${ds.stay_days} ימים, או ${ds.stay_days_extended} בהארכה`, source: { he: `${ds.law_he}, ${ds.sections.stay}`, url: ds.url } });
		step(p2, { id: 'window', he: `${ds.claim_days} ימים שבהם רק מי שהגיש את הבקשה רשאי לתבוע`, do: ['בוחרים ערכאה לכל עניין: רכוש וילדים בבית המשפט או כרוכים לתביעת הגירושין בבית הדין', 'אחרי החלון גם הצד השני רשאי לתבוע'], when: clk ? `עד ${mpHe(clk.claimsBy)}` : `${ds.claim_days} ימים אחרי סוף העיכוב`, source: { he: `${ds.law_he}, ${ds.sections.claims}`, url: ds.url } });
		if (route === 'mediate') {
			const p3 = phase('agreement', 'ההסכם שנולד בגישור');
			step(p3, { id: 'draft', he: 'מנסחים הסכם גירושין ותוכנית הורות', do: ['מה שסוכם ביחידת הסיוע או אצל המגשר נכנס לטיוטה אחת: ילדים, מזונות, רכוש'], when: 'אחרי הפגישות', link: { label: 'מחולל הסכם גירושין ותוכנית הורות', hash: 'jtool-heskem-gerushin' } });
			step(p3, { id: 'file', he: `מגישים לאישור: ${forumHe}`, do: [routeSteps[0]], cost: agreementFee, when: 'אחרי החתימה', source: { he: forum === 'family' ? fc.regulation_he : rb.regulation_he, url: forum === 'family' ? fc.url : rb.url } });
			step(p3, { id: 'approve', he: 'דיון ואישור: תוקף של פסק דין', do: [routeSteps[1], routeSteps[2]], when: 'החוק לא קובע משך' });
		} else {
			const p3 = phase('claims', 'התביעות');
			step(p3, { id: 'divorce_claim', he: 'תביעת גירושין בבית הדין הרבני', do: ['עילת הגירושין וכתב התביעה', 'כריכה: רכוש וילדים אפשר לכרוך כאן'], cost: fee(rb.divorce + rb.transcript_divorce, `${rb.items.divorce}; פרוטוקול: ${rb.items.transcript_divorce}`, rb.url, 'אגרת תביעת גירושין ואגרת פרוטוקול'), when: clk ? `מ-${mpHe(clk.stayEnds)}` : 'אחרי עיכוב ההליכים', source: { he: rb.regulation_he, url: rb.url } });
			if (property) {
				step(p3, { id: 'property_claim', he: `תביעה רכושית: איזון משאבים ב${forumHe}`, do: ['רשימת כל הנכסים והחובות של שניכם, עם מסמכים', 'מועד הקרע: היום שממנו מפסיקים לצבור יחד', 'מומחים: שמאי לדירה, אקטואר לפנסיה, רואה חשבון לעסק'], cost: forum === 'family' ? fee(fc.property + fc.transcript, `${fc.items.property}; פרוטוקול`, fc.url, 'אגרת תביעה רכושית ואגרת פרוטוקול') : fee(rb.property + rb.transcript_other, `${rb.items.property}; פרוטוקול`, rb.url, 'אגרת תביעת רכוש כרוכה ואגרת פרוטוקול'), when: clk ? `מ-${mpHe(clk.stayEnds)}` : 'אחרי עיכוב ההליכים', link: { label: 'מחשבון איזון משאבים', hash: 'jtool-izun' }, source: { he: dc.property_law.law_he, url: dc.property_law.url } });
			}
			if (children) {
				step(p3, { id: 'children_claims', he: `ילדים: משמורת, זמני שהות ומזונות ב${forumHe}`, do: ['תוכנית הורות מוצעת: לינות, חגים, חופשות', 'הרצאת פרטים (טופס 3) לתביעת המזונות: הכנסות, הוצאות, צרכי הילדים', 'בבית המשפט: תסקיר של עובד סוציאלי לסדרי דין'], cost: forum === 'family' ? fee(fc.custody + fc.support + 2 * fc.transcript, `${fc.items.custody}; ${fc.items.support}; פרוטוקול`, fc.url, 'אגרות משמורת, מזונות ופרוטוקול') : fee(rb.custody + rb.transcript_other, `${rb.items.custody}; מזונות: פטור (${rb.items.support_exempt})`, rb.url, 'אגרת החזקת ילדים ופרוטוקול; המגיש תביעת מזונות פטור'), when: clk ? `מ-${mpHe(clk.stayEnds)}` : 'אחרי עיכוב ההליכים', link: { label: 'מחשבון מזונות ילדים', hash: 'jtool-mezonot' }, source: { he: cs.ruling.he, url: cs.ruling.url } });
			}
			step(p3, { id: 'hearings', he: 'דיונים, הוכחות ופסק דין', do: ['קדם משפט, תצהירים, חקירות, סיכומים', 'בכל שלב אפשר לחזור להסכם: הסדר שהושג מקבל תוקף של פסק דין'], when: 'החוק לא קובע משך להליך במחלוקת', link: { label: 'לתרגל את הדיון מול שופטת וירטואלית', sim: 'court_rehearsal' } });
		}
	}

	// 3. The get.
	const p4 = phase('get', 'הגט');
	if (forum === 'family' && route !== 'court') {
		step(p4, { id: 'get_request', he: 'בקשה לסידור גט בבית הדין הרבני', do: ['ההסכם המאושר, תעודות זהות, כתובה אם יש'], cost: fee(rb.get_request, rb.items.get_request, rb.url, 'אגרת בקשה לסידור גט'), when: 'אחרי אישור ההסכם', source: { he: rb.regulation_he, url: rb.url } });
	}
	step(p4, { id: 'get', he: 'סידור הגט: כתיבה, מסירה וקבלה בבית הדין', do: ['שני בני הזוג, עדים ובית הדין; כשאחד בחוץ לארץ, הסדר מיוחד'], cost: fee(0, rb.items.get_free, rb.url, 'סידור הגט כששני בני הזוג בארץ: פטור'), when: 'אחרי פסק הדין או אישור ההסכם', link: { label: 'פתיחת תיק גירושין בבית הדין הרבני', path: '/opening-divorce-file-rabbinical/' }, source: { he: rb.regulation_he, url: rb.url } });
	step(p4, { id: 'certificate', he: 'תעודת גירושין לכל אחד מבני הזוג', do: ['לרישום במשרד הפנים ולכל נישואין חדשים'], cost: fee(rb.certificate * 2, rb.items.certificate, rb.url, 'שתי תעודות גירושין'), when: 'אחרי הגט', source: { he: rb.regulation_he, url: rb.url } });

	// 4. After the judgment.
	const p5 = phase('after', 'אחרי פסק הדין: לבצע');
	if (pension) {
		step(p5, { id: 'pension', he: 'חלוקת הפנסיה דרך הקופה, בלי למכור אותה', do: ['מוסרים לקופה את פסק הדין עם הודעה בכתב', `הקופה רושמת הערה ומעבירה עד מחצית היתרה שבמועד הפירוד; ההעברה ${pb.pension_split.transfer_days} ימים אחרי ההודעה`], when: `${pb.pension_split.transfer_days} ימים מההודעה לקופה`, link: { label: 'חלוקת פנסיה בגירושין', path: '/divorce-pension-split/' }, source: { he: pb.pension_split.law_he, url: pb.pension_split.url } });
	}
	if (property) {
		step(p5, { id: 'home', he: 'הדירה: העברה, רכישת החלק או מכירה', do: ['רישום בטאבו או בחברה המשכנת לפי פסק הדין', 'המשכנתא: הסכמת הבנק לשינוי הלווים', 'מכירה לצורך האיזון מעוכבת עד שיש מגורים לילדים ולהורה שאיתם (סעיף 6א)'], when: 'לפי פסק הדין', link: { label: 'חלוקת רכוש בגירושין', path: '/divorce-property-division/' }, source: { he: dc.property_law.law_he, url: dc.property_law.url } });
	}
	if (children) {
		step(p5, { id: 'support', he: 'מזונות: תשלום, הצמדה למדד ומעקב', do: [`הסכום מתעדכן לפי המדד בתדירות שנקבעה; בפסקי דין רבים כל ${cs.indexation.every_months} חודשים`, 'רושמים כל תשלום; תשלום שלא הגיע: מכתב דרישה, ואז הוצאה לפועל במסלול מזונות', 'כשהחייב לא משלם: המוסד לביטוח לאומי משלם במקומו, עד הסכום שבתקנות'], when: 'כל חודש', link: { label: 'מעקב תשלומי מזונות', hash: 'jtool-maakav-mezonot' }, source: { he: cs.nii.he, url: cs.nii.law_url } });
		step(p5, { id: 'plan', he: 'תוכנית ההורות: לוח שהות, חגים ומעברים', do: ['לוח שנתי עם החגים לפי הלוח העברי והחופש הגדול', 'שינוי בנסיבות: בקשה לשינוי הסדרי שהות או מזונות (סעיף 13 לחוק המזונות)'], when: 'מתחילת השנה', link: { label: 'מחולל לוח זמני שהות', hash: 'jtool-luach-shahut' }, source: { he: cs.law.he, url: cs.law.url } });
	}
	step(p5, { id: 'docs_after', he: 'מעדכנים מסמכים: צוואה, מוטבים, ביטוחים, משרד הפנים', do: ['צוואה חדשה: גירושין אינם מבטלים צוואה קודמת מאליהם', 'מוטבים בקופות ובביטוחים, ייפויי כוח, מען'], when: 'אחרי תעודת הגירושין', link: { label: 'כמה עולה צוואה, מהחתימה ועד צו הקיום', path: '/depositing-testament-registrar/' } });

	const steps = phases.flatMap((p) => p.steps);
	const done = new Set((input.done || []).filter((id) => steps.some((s) => s.id === id)));
	steps.forEach((s) => { s.done = done.has(s.id); });
	const progress = { done: done.size, total: steps.length, pct: Math.round((done.size / steps.length) * 100) };
	const feesTotal = steps.reduce((sum, s) => sum + (s.cost && s.cost.amount ? s.cost.amount : 0), 0);
	return {
		ok: true, route, forum, children, property, pension, start, extended: Boolean(input.extended), phases, steps, progress, clock: clk,
		fees: { total: fees.total, lines: fees.lines, bar: fees.bar, stepsTotal: Math.round(feesTotal * 100) / 100 },
		text: mpText({ route, forum, phases, progress, fees }),
	};
}

const ROUTE_HE = { agree: 'בהסכמה', mediate: 'יישוב סכסוך ואז הסכם', court: 'תביעות במחלוקת' };
export function mpRouteHe(route) { return ROUTE_HE[route] || ROUTE_HE.agree; }

/** The checklist as plain text, with the boxes ticked. */
export function mpText(r) {
	const lines = [`מפת הדרכים לגירושין, ${ROUTE_HE[r.route]} (${r.forum === 'family' ? 'בית המשפט לענייני משפחה' : 'בית הדין הרבני'}): ${r.progress.done} מתוך ${r.progress.total} שלבים בוצעו.`];
	for (const p of r.phases) {
		lines.push('', p.he);
		for (const s of p.steps) {
			lines.push(`[${s.done ? 'V' : ' '}] ${s.he}${s.when ? ` (${s.when})` : ''}${s.cost && s.cost.amount ? `: ${mpNis(s.cost.amount)}` : s.cost && s.cost.amount === 0 ? ': פטור' : ''}`);
			for (const d of s.do) { lines.push(`    - ${d}`); }
		}
	}
	lines.push('', `אגרות במסלול הזה: ${mpNis(r.fees.total)} (כולל שתי תעודות גירושין). עורך דין, לפי התעריף המינימלי המומלץ של הלשכה: לפחות ${mpNis(r.fees.bar.total)} ועוד מע"מ, לכל צד.`, 'מידע כללי, לא ייעוץ משפטי. נבנה ב-jus-tice.co.il.');
	return lines.join('\n');
}
