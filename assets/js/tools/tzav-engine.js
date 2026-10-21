/**
 * The request for an inheritance order or a probate order, planned for one case (the inheritance wave, 21.10.2026).
 * Invented: no Hebrew tool turns the case (will or none, who files, who the heirs are, what the estate holds) into the
 * route, the documents, the fees and the clock of the Succession Regulations in one answer.
 *
 * Dependency-free ES module. Every amount, day and section comes from registry.inheritance_process:
 *  - the route: a represented applicant files online only; an unrepresented one online or on paper; when the heirs include
 *    the deceased's siblings, nephews, grandparents, uncles or cousins the request is filed on paper only (the Custodian
 *    General's online rule); a religious court may give the order only with everyone's written consent (s.155);
 *  - the fees: the registrar's fee regulations, item 1 (597), 85% online as charged by the payments service (507), and the
 *    publication expenses of reg. 17(ג) as charged (66); the exemption of reg. 4(5);
 *  - the documents: reg. 14 (the form, the death proof, the original will, the notices to the heirs, the power of attorney),
 *    reg. 15 (death affidavits), reg. 16 (waiver affidavits), s.6(ג) (a minor's waiver), the service page (predeceased
 *    heirs, guardianship, land registration);
 *  - the clock: publication and two weeks for objections (s.67, reg. 17(א)); the original will within 7 days of an online
 *    filing (reg. 14); transfer to the family court on an objection (s.67א, reg. 20); the order when none is filed (reg. 23).
 */
import { addDays, daysBetween } from './dates.js';

export const TZ_ROUTES = ['online', 'manual', 'religious'];
const r2 = (n) => Math.round(n * 100) / 100;

/** The documents of reg. 14 and the service page that a case needs, from the registry's conditional list. */
export function tzDocuments(ip, c) {
	const on = {
		always: true,
		no_certificate: !c.certificate,
		will: c.will === 'will',
		several_heirs: c.heirs > 1,
		represented: c.filer === 'lawyer',
		renounce: c.renounce > 0,
		renounce_minor: c.renounce > 0 && c.renounceMinor,
		predeceased: c.predeceased > 0,
		minor: c.minor,
		abroad: !c.idIsrael || c.abroad,
		real_estate: c.realEstate,
	};
	return ip.documents.filter((d) => on[d.when]);
}

/**
 * input = { will ('none' | 'will'), filer ('self' | 'lawyer'), heirs (1-30), relation ('close' | 'extended'),
 *           idIsrael (bool), certificate (bool), abroad (bool: the deceased lived abroad), renounce (0-30),
 *           renounceMinor (bool), minor (bool), predeceased (0-30), realEstate (bool), religious (bool), exempt (bool),
 *           filed (ISO: the day the request is or will be filed), publication (ISO or '': the day it was published) }
 */
export function tzBuild(registry, input) {
	const ip = registry.inheritance_process;
	const errors = [];
	const will = input.will === 'will' ? 'will' : 'none';
	const filer = input.filer === 'lawyer' ? 'lawyer' : 'self';
	const heirs = input.heirs === '' || input.heirs === undefined || input.heirs === null ? NaN : Number(input.heirs);
	const renounce = input.renounce === '' || input.renounce === undefined || input.renounce === null ? 0 : Number(input.renounce);
	const predeceased = input.predeceased === '' || input.predeceased === undefined || input.predeceased === null ? 0 : Number(input.predeceased);
	if (!(Number.isInteger(heirs) && heirs >= 1 && heirs <= 30)) { errors.push({ field: 'heirs', he: 'מספר היורשים (או הזוכים): 1 עד 30' }); }
	if (!(Number.isInteger(renounce) && renounce >= 0 && renounce <= 30)) { errors.push({ field: 'renounce', he: 'כמה מהם מסתלקים: 0 עד 30' }); }
	if (!(Number.isInteger(predeceased) && predeceased >= 0 && predeceased <= 30)) { errors.push({ field: 'predeceased', he: 'כמה מהם נפטרו אחרי המוריש: 0 עד 30' }); }
	if (Number.isInteger(heirs) && Number.isInteger(renounce) && renounce >= heirs && heirs >= 1) { errors.push({ field: 'renounce', he: 'לפחות יורש אחד נשאר: המסתלקים פחות ממספר היורשים' }); }
	const filed = /^\d{4}-\d{2}-\d{2}$/.test(String(input.filed || '')) ? input.filed : '';
	const publication = /^\d{4}-\d{2}-\d{2}$/.test(String(input.publication || '')) ? input.publication : '';
	if (input.filed && !filed) { errors.push({ field: 'filed', he: 'יום ההגשה: תאריך, לדוגמה 1.11.2026' }); }
	if (input.publication && !publication) { errors.push({ field: 'publication', he: 'יום הפרסום: תאריך, לדוגמה 20.11.2026' }); }
	if (filed && publication && publication < filed) { errors.push({ field: 'publication', he: 'הפרסום בא אחרי ההגשה: בדקו את התאריכים' }); }
	if (errors.length) { return { ok: false, errors }; }

	const c = {
		will, filer, heirs, relation: input.relation === 'extended' ? 'extended' : 'close',
		idIsrael: input.idIsrael !== false, certificate: input.certificate !== false, abroad: Boolean(input.abroad),
		renounce, renounceMinor: Boolean(input.renounceMinor), minor: Boolean(input.minor), predeceased,
		realEstate: Boolean(input.realEstate), religious: Boolean(input.religious), exempt: Boolean(input.exempt), filed, publication,
	};
	const rf = ip.registrar;
	const pay = rf.payments;
	const d = ip.days;

	// 1. The route.
	let route = 'online';
	const why = [];
	if (c.religious) {
		route = 'religious';
		why.push({ he: ip.courts.religious_he, section: ip.sections.religious_court, url: ip.law_url });
	} else if (c.relation === 'extended') {
		route = 'manual';
		why.push({ he: 'בין היורשים יש אחים, אחיינים, סבים, דודים או בני דודים של המנוח: הבקשה מוגשת ידנית בלבד, גם עם עורך דין', section: 'הנחיות האפוטרופוס הכללי', url: ip.online_rule.url });
	} else if (c.filer === 'lawyer') {
		why.push({ he: 'מייצג מגיש את הבקשה באופן מקוון בלבד', section: 'הנחיות האפוטרופוס הכללי', url: ip.online_rule.url });
	} else {
		why.push({ he: `מי שאינו מיוצג בוחר: מקוון, באגרה מופחתת של ${rf.online_pct}%, או ידני במשרדי הרשם`, section: rf.online_section, url: rf.url });
	}
	const orderHe = c.will === 'will' ? 'צו קיום צוואה' : 'צו ירושה';

	// 2. The fees as charged.
	const lines = [];
	if (route === 'religious') {
		lines.push({ key: 'order', he: `אגרת ${orderHe} בבית הדין: לפי תקנות האגרות של בתי הדין, לא מחושבת כאן`, amount: null, section: ip.sections.religious_court, url: ip.law_url });
	} else if (c.exempt) {
		lines.push({ key: 'order', he: `אגרת הבקשה ל${orderHe}: פטור (${rf.exempt_he})`, amount: 0, section: rf.exempt_section, url: rf.url });
		lines.push({ key: 'publication', he: 'הוצאות הפרסום: על חשבון הרשם הארצי כשהמבקש פטור מאגרה', amount: 0, section: ip.regulation_sections.publication_cost, url: ip.regulations_url });
	} else {
		const online = route === 'online';
		lines.push({ key: 'order', he: `אגרת הבקשה ל${orderHe}, ${online ? `בהגשה מקוונת (${rf.online_pct}% מ-${rf.items.order.amount} ₪, כפי שנגבה)` : 'בהגשה ידנית'}`, amount: online ? pay.online_fee : rf.items.order.amount, section: online ? `${rf.online_section}; שירות התשלומים` : rf.items.order.item, url: online ? pay.url : rf.url });
		lines.push({ key: 'publication', he: 'הוצאות פרסום הבקשה באתר האפוטרופוס הכללי וברשומות', amount: pay.publication, section: `${ip.regulation_sections.publication_cost}; שירות התשלומים`, url: pay.url });
	}
	const total = r2(lines.reduce((a, l) => a + (l.amount || 0), 0));

	// 3. The documents.
	const documents = tzDocuments(ip, c);

	// 4. The steps and the clock.
	const steps = [];
	const step = (s) => steps.push(Object.assign({ do: [], when: '', date: '', cost: null, section: '', url: '', link: null }, s));
	step({ id: 'docs', he: 'אוספים את המסמכים ומאמתים את העובדות בתצהיר', do: documents.map((x) => x.he), section: ip.regulation_sections.request, url: ip.regulations_url });
	if (c.heirs > 1) {
		step({ id: 'notice', he: `מודיעים לכל ${c.will === 'will' ? 'הזוכים' : 'היורשים'} על הבקשה`, do: ['מכתב בדואר רשום לכל אחד, ושומרים את אישורי המשלוח', 'או מסירה אישית, ותצהיר על המסירה'], section: ip.regulation_sections.request, url: ip.regulations_url });
	}
	if (c.renounce > 0) {
		step({ id: 'renounce', he: `${c.renounce === 1 ? 'יורש אחד מסתלק' : `${c.renounce} יורשים מסתלקים`}: תצהיר הסתלקות לכל אחד`, do: [`בכתב, לרשם, רק לטובת בן זוג, ילד או אח של המנוח או בלי נמען (${ip.sections.renounce_who})`, c.renounceMinor ? `מסתלק קטין או חסוי: אישור בית המשפט (${ip.sections.renounce_minor})` : 'מאומת בפני עורך דין'], section: ip.regulation_sections.renounce_affidavit, url: ip.regulations_url, link: { path: '/disclaimer-renouncing-share/', label: 'מחולל תצהיר ההסתלקות' } });
	}
	if (route !== 'religious') {
		step({ id: 'fee', he: c.exempt ? 'פטור מאגרה: מצרפים את האישור על הפטירה בשירות או בפעולת איבה' : `משלמים את האגרה והוצאות הפרסום: ${total.toLocaleString('en-US')} ₪`, do: c.exempt ? [] : ['בשירות התשלומים הממשלתי, או כחלק מהטופס המקוון', 'ידנית: בבנק הדואר בשובר מהלשכה'], cost: c.exempt ? { amount: 0 } : { amount: total }, section: c.exempt ? rf.exempt_section : rf.online_section, url: c.exempt ? rf.url : pay.url });
	}
	const fileHe = route === 'religious' ? 'מגישים לבית הדין, עם הסכמה בכתב של כל הנוגעים בדבר' : route === 'online' ? 'מגישים באתר האפוטרופוס הכללי, בהזדהות לאומית' : 'מגישים ידנית ללשכת הרשם שבאזורו היה מקום מושבו של המנוח';
	step({ id: 'file', he: fileHe, do: route === 'religious' ? [ip.courts.religious_he] : [c.realEstate ? ip.online_rule.tabu_he : 'בלי אגרה הבקשה לא מתקבלת (תקנה 1(ב) לתקנות האגרות)'], when: c.filed ? `יום ההגשה: ${heDate(c.filed)}` : '', date: c.filed, section: route === 'religious' ? ip.sections.religious_court : ip.regulation_sections.request, url: route === 'religious' ? ip.law_url : ip.regulations_url });
	const clock = { filed: c.filed, publication: c.publication, originalWillBy: '', objectionsBy: '', daysLeft: null };
	if (c.will === 'will' && route === 'online') {
		clock.originalWillBy = c.filed ? addDays(c.filed, d.online_original_will) : '';
		step({ id: 'original', he: `מוסרים לרשם את הצוואה המקורית בתוך ${d.online_original_will} ימים מההגשה המקוונת`, when: clock.originalWillBy ? `עד ${heDate(clock.originalWillBy)}` : `${d.online_original_will} ימים מיום ההגשה`, date: clock.originalWillBy, section: ip.regulation_sections.online, url: ip.regulations_url });
	}
	if (route !== 'religious') {
		clock.objectionsBy = c.publication ? addDays(c.publication, d.objection) : '';
		step({ id: 'publish', he: `הרשם מפרסם את הבקשה, ומי שרוצה מתנגד בתוך ${d.objection} ימים`, do: ['באתר האפוטרופוס הכללי וברשומות', 'הרשם בודק במרשם הצוואות אם יש צוואה אחרת; הזוכים בה מקבלים הודעה ו-14 ימים להתנגד (תקנה 18)', 'החוק לא קובע כמה זמן עובר מההגשה לפרסום'], when: clock.objectionsBy ? `עד ${heDate(clock.objectionsBy)}` : `${d.objection} ימים מיום הפרסום`, date: clock.objectionsBy, section: `${ip.sections.publication}; ${ip.regulation_sections.publication}`, url: ip.regulations_url });
		step({ id: 'objection', he: 'הוגשה התנגדות? הבקשה עוברת לבית המשפט לענייני משפחה', do: [`גם כשהמדינה צד, כשהיועץ המשפטי לממשלה מתערב, או כשהרשם מחליט להעביר (${ip.sections.to_court})`, `אגרת התנגדות: ${ip.family_court.items.objection.amount.toLocaleString('en-US')} ₪ (${ip.family_court.items.objection.item})`], section: ip.regulation_sections.transfer, url: ip.regulations_url, link: { path: '/will-dispute-grounds/', label: 'שעון ההתנגדות ובודק העילות' } });
		step({ id: 'order', he: `אין התנגדות: הרשם נותן את ${orderHe}`, do: ['הצו מחייב את כל העולם עד שישונה או יבוטל (סעיף 71)', c.realEstate ? 'עם הצו רושמים את היורשים בטאבו, ובבנקים מחלקים לפי הצו' : 'עם הצו הבנקים וקופות הגמל משלמים ליורשים'], section: ip.regulation_sections.order_no_objection, url: ip.regulations_url });
	} else {
		step({ id: 'order', he: `בית הדין נותן את ${orderHe}`, do: ['הצו מחייב כמו צו של הרשם (סעיף 71)'], section: ip.sections.binding, url: ip.law_url });
	}
	step({ id: 'divide', he: 'מחלקים את העיזבון: לפי הצו, או בהסכם אחר בין היורשים', do: [`הסכם חלוקה בין היורשים גובר על החלוקה שבצו, בלי בית משפט (${ip.sections.division_agreement})`, `החלוקה הראשונה בין היורשים אינה מכירה לעניין מס, כל עוד אין כסף מבחוץ (${ip.land_tax.division_not_sale} לחוק מיסוי מקרקעין)`], section: ip.sections.division_agreement, url: ip.law_url, link: { path: '/heirs-distribution-agreement/', label: 'מחולל הסכם חלוקת העיזבון' } });
	if (c.publication && input.today) { clock.daysLeft = daysBetween(input.today, clock.objectionsBy); }

	// 5. Flags.
	const flags = [];
	if (c.minor) { flags.push({ code: 'minor', he: `יורש קטין, חסוי או נעדר: מציינים זאת בבקשה; מי שמייצג אותו הוא האפוטרופוס, ופעולות בנכסיו טעונות אישור בית המשפט (${ip.capacity.minor_property} לחוק הכשרות)`, url: ip.capacity.url }); }
	if (c.predeceased > 0) { flags.push({ code: 'predeceased', he: `${c.predeceased === 1 ? 'יורש שנפטר אחרי המוריש' : `${c.predeceased} יורשים שנפטרו אחרי המוריש`}: חלקם עובר ליורשיהם, ומצרפים תעודת פטירה או את הצו שניתן בעיזבונם`, url: ip.online_rule.url }); }
	if (!c.idIsrael || c.abroad) { flags.push({ code: 'abroad', he: `מנוח בלי תעודת זהות ישראלית או שחי בחוץ לארץ: תעודת פטירה מקורית או נאמנה למקור; כשמקום מושבו היה בחוץ לארץ, מגישים לרשם שבאזורו נמצאים נכסי העיזבון, והחוק שחל על הירושה הוא חוק מקום מושבו (${ip.sections.domicile}, ${ip.sections.jurisdiction_abroad})`, url: ip.law_url }); }
	if (!c.certificate) { flags.push({ code: 'no_certificate', he: `אין תעודת פטירה: תצהירים על המוות מהמבקש ומאדם נוסף; הרשם רשאי לחקור את המצהירים (${ip.regulation_sections.death_affidavit})`, url: ip.regulations_url }); }
	if (c.will === 'will') { flags.push({ code: 'will', he: 'כל מי שמחזיק בצוואה חייב למסור אותה לרשם אחרי הפטירה; צוואה שהופקדה אצל הרשם נמצאת במרשם, ואישור ההפקדה מצורף לבקשה', url: ip.regulations_url }); }
	if (route === 'religious') { flags.push({ code: 'religious', he: 'בלי הסכמה בכתב של כולם, בית הדין אינו מוסמך, וההליך חוזר לרשם', url: ip.law_url }); }

	return {
		ok: true, will, filer, route, routeHe: TZ_ROUTE_HE[route], orderHe, why, lines, total, exempt: c.exempt, documents, steps, clock, flags,
		heirs: c.heirs, renounce: c.renounce, realEstate: c.realEstate,
	};
}

export const TZ_ROUTE_HE = { online: 'הגשה מקוונת לרשם', manual: 'הגשה ידנית לרשם', religious: 'בית הדין הדתי, בהסכמת כולם' };

function heDate(iso) { const [y, m, dd] = iso.split('-').map(Number); return `${dd}.${m}.${y}`; }

/** The three routes for the same case (fees only), for the page table. */
export function tzByRoute(registry, input) {
	const out = {};
	for (const k of TZ_ROUTES) {
		const r = tzBuild(registry, Object.assign({}, input, { religious: k === 'religious', filer: k === 'online' ? input.filer : 'self', relation: k === 'manual' ? 'extended' : 'close' }));
		out[k] = r.ok ? { total: r.total, lines: r.lines, documents: r.documents.length } : null;
	}
	return out;
}
