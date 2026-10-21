/**
 * The rabbinical-court fee ledger (the family + land wave, 21.10.2026, HAD-579): what each procedure costs at the
 * rabbinical court and the same claim at the family court, side by side, before the "race of jurisdictions".
 *
 * Dependency-free ES module; every number comes from the registry:
 *  - registry.divorce_cost (wave 4, HAD-502) for the fees it already holds: divorce 4(1)(א), property 4(1)(ב), custody 7,
 *    maintenance 3 (the claimant exempt, reg. 14א), agreement 4(2), the get request 4(3)(א)-(ב), the certificate 4(4)(א),
 *    the dispute request 19(טז), the transcripts of the second schedule, the appeal 15(א); and at the family court items
 *    2א, 5, 6א, 6ב, 13 and the transcript fee. Read through the "ref" paths of registry.fl_rabanut.procedures, never copied.
 *  - registry.fl_rabanut for every other fee of the Dayanim (Fees) Regulations 1957 (Nevo, 22.1.2026), the amounts the
 *    administration's payment table charges where the schedule names none (data.gov.il 860, January 2026), the family
 *    court's other items (text from 1.7.2026), the district court's appeal items (Court Fees Regulations 2007, 1.1.2026),
 *    the refunds and exemptions, and the periods of the rabbinical procedure regulations (קלח, קלג, קכא) and of the Civil
 *    Procedure Regulations 2018 (137(א)).
 *  - registry.inheritance_process for the registrar's and the family court's inheritance fees.
 *  - The statutory clock of a dispute-settlement request is the wave-4 engine's own clock() (gerushin-engine.js), so the
 *    two tools never disagree on a day.
 * Every name here starts with "rb": the bundle concatenates instrument.js, dates.js and gerushin-engine.js into one scope.
 */
import { addDays, isRestDay, offRestDays, parseDate } from './dates.js';
import { clock } from './gerushin-engine.js';

export const RB_FORUMS = ['rabbinical', 'family'];
export const RB_GROUPS = [
	['open', 'פתיחת התיק והגירושין'],
	['linked', 'התביעות הכרוכות'],
	['get', 'הגט והתעודות'],
	['after', 'אחרי פסק הדין'],
	['status', 'נישואין ומעמד אישי'],
	['inherit', 'ירושה בבית הדין (בהסכמת כולם)'],
];
const rbR2 = (n) => Math.round(n * 100) / 100;

/** A value in the registry by its dotted path ("divorce_cost.rabbinical.divorce"); undefined when it does not resolve. */
export function rbGet(reg, path) {
	return String(path || '').split('.').reduce((o, k) => (o && typeof o === 'object' && k in o ? o[k] : undefined), reg);
}

/** The official text a path's figure is read from. */
export function rbUrlOf(reg, path) {
	const p = String(path || '');
	const fl = reg.fl_rabanut;
	if (p.startsWith('divorce_cost.rabbinical')) { return reg.divorce_cost.rabbinical.url; }
	if (p.startsWith('divorce_cost.family')) { return reg.divorce_cost.family.url; }
	if (p.startsWith('fl_rabanut.rab.admin')) { return fl.rab.admin_table.url; }
	if (p.startsWith('fl_rabanut.rab')) { return fl.rab.url; }
	if (p.startsWith('fl_rabanut.fam')) { return fl.fam.url; }
	if (p.startsWith('fl_rabanut.appeal_court')) { return fl.appeal_court.url; }
	if (p.startsWith('inheritance_process.registrar')) { return reg.inheritance_process.registrar.url; }
	if (p.startsWith('inheritance_process.family_court')) { return reg.inheritance_process.family_court.url; }
	return fl.source_url;
}

/** A percent fee: pct% of the value, never under the minimum; without a value, the minimum (min: true). */
export function rbPct(rule, value) {
	const v = Number(value);
	if (!(v > 0)) { return { amount: rule.min, min: true }; }
	return { amount: rbR2(Math.max(rule.pct * v / 100, rule.min)), min: false };
}

/** One forum's cell of a procedure: the fee, its item, the transcript fee, and where the figure is read. */
function rbCell(reg, spec, side, ctx) {
	if (!spec) { return null; }
	const fl = reg.fl_rabanut;
	const cell = { amount: 0, item: '', url: '', src: 'regs', protocol: 0, protocolItem: '', note: spec.note_he || '', exempt: false, min: false, pctNote: null, where: '' };
	if (spec.amount0) {
		cell.item = spec.item; cell.url = side === 'rab' ? fl.rab.url : fl.fam.url;
	} else if (spec.pct_ref && !spec.ref) {
		const rule = rbGet(reg, spec.pct_ref);
		const p = rbPct(rule, ctx.value);
		Object.assign(cell, { amount: p.amount, min: p.min, item: rule.item, url: rbUrlOf(reg, spec.pct_ref) });
	} else {
		let ref = spec.ref;
		let itemRef = spec.item_ref;
		if (spec.abroad_ref && ctx.abroad) { ref = spec.abroad_ref; itemRef = spec.abroad_item_ref; }
		if (spec.topup_ref && ctx.topup) { ref = spec.topup_ref; itemRef = null; }
		const v = rbGet(reg, ref);
		if (v && typeof v === 'object') {
			Object.assign(cell, { amount: v.amount, item: v.item, src: v.src || 'regs' });
		} else {
			cell.amount = v;
			cell.item = rbGet(reg, itemRef);
		}
		cell.url = rbUrlOf(reg, ref);
		if (spec.topup_ref && ctx.topup) { cell.note = `${rbGet(reg, spec.ref)} פחות ${rbGet(reg, 'divorce_cost.rabbinical.get_request')} ששולמו על הבקשה המשותפת`; }
		if (spec.pct_ref) {
			const rule = rbGet(reg, spec.pct_ref);
			const p = rbPct(rule, ctx.value);
			cell.pctNote = { amount: p.amount, min: p.min, item: rule.item, value: Number(ctx.value) || 0 };
		}
	}
	if (spec.exempt) { cell.full = cell.amount; cell.amount = 0; cell.exempt = true; }
	if (spec.protocol && !spec.exempt) {
		cell.protocol = rbGet(reg, spec.protocol.ref);
		cell.protocolItem = rbGet(reg, spec.protocol.item_ref);
	}
	if (spec.free_days) { cell.freeDays = spec.free_days; }
	return cell;
}

const rbTotal = (cell, legalAid) => (!cell || legalAid ? 0 : rbR2(cell.amount + cell.protocol));

/**
 * input = { sel: [procedure ids], forum ('rabbinical' | 'family': where a claim both forums hear is filed),
 *           abroad (one spouse lives abroad), certificates (0-2), value (the sum of a ketubah or money claim),
 *           legalAid (represented by the Legal Aid office), reqDate, extended, judgmentDate, getDate (ISO days) }
 */
export function rbCompute(registry, input) {
	const fl = registry.fl_rabanut;
	const dc = registry.divorce_cost;
	const rb = dc.rabbinical;
	const errors = [];
	const known = fl.procedures.map((p) => p.id);
	const sel = (Array.isArray(input.sel) ? input.sel : []).filter((id) => known.includes(id));
	if (!sel.length) { errors.push({ field: 'sel', he: 'בחרו לפחות הליך אחד' }); }
	const forum = input.forum === 'family' ? 'family' : 'rabbinical';
	const certificates = input.certificates === undefined || input.certificates === '' ? 2 : Number(input.certificates);
	if (!(Number.isInteger(certificates) && certificates >= 0 && certificates <= 2)) { errors.push({ field: 'certificates', he: 'תעודות גירושין: 0, 1 או 2' }); }
	const value = input.value === '' || input.value === undefined || input.value === null ? '' : Number(input.value);
	if (value !== '' && !(value >= 0 && value < 1e10)) { errors.push({ field: 'value', he: 'סכום התביעה: מספר חיובי' }); }
	const dates = {};
	for (const k of ['reqDate', 'judgmentDate', 'getDate']) {
		if (input[k]) {
			const iso = parseDate(input[k]);
			if (!iso) { errors.push({ field: k, he: 'תאריך לא תקין. לדוגמה: 1.11.2026' }); } else { dates[k] = iso; }
		}
	}
	if (errors.length) { return { ok: false, errors }; }

	const abroad = Boolean(input.abroad);
	const legalAid = Boolean(input.legalAid);
	const isDivorce = sel.includes('div') || sel.includes('joint');
	const ctx = { abroad, value, topup: sel.includes('joint') };
	const flags = [];
	const lines = [];
	for (const p of fl.procedures) {
		if (!sel.includes(p.id)) { continue; }
		// The Family Disputes Settlement Law does not apply when a party's domicile is abroad (s.4א(1)): no request.
		if (p.id === 'req' && abroad) { continue; }
		const rab = rbCell(registry, p.rab, 'rab', Object.assign({}, ctx, { topup: p.id === 'agree' && ctx.topup }));
		const fam = rbCell(registry, p.fam, 'fam', ctx);
		const both = Boolean(rab && fam);
		const chosen = !fam ? 'rab' : !rab ? 'fam' : (forum === 'family' ? 'fam' : 'rab');
		// In the family route an agreement approved by the court still needs the get request at the rabbinical court,
		// which the joint request line carries; the top-up applies only to an agreement approved at the rabbinical court.
		const inRab = rab ? rbTotal(rab, legalAid) : rbTotal(fam, legalAid);
		// A procedure the family court prices by the subject of the claim (a change of an agreement) or for which no item
		// was found (an extension of the appeal time) is left out of the family route's total, never guessed.
		const famUnknown = Boolean(p.fam_unknown);
		const inFam = famUnknown ? 0 : (fam ? rbTotal(fam, legalAid) : rbTotal(rab, legalAid));
		lines.push({ id: p.id, he: p.he, group: p.group, rab, fam, both, chosen, naHe: p.na_he || '', refundable: Boolean(p.refundable), inRab, inFam, famUnknown });
		if (famUnknown) { flags.push({ code: 'fam_unknown', he: `${p.he}: ${p.na_he}. לא נכלל בסך של מסלול בית המשפט`, section: '' }); }
	}
	// An agreement alone, without a divorce claim or a joint request: the get is arranged at the rabbinical court. When the
	// agreement is approved there, the get follows in the same file; in the family route a get request is still needed.
	if (sel.includes('agree') && !sel.includes('joint') && !sel.includes('div')) {
		const amount = abroad ? rb.get_request_abroad : rb.get_request;
		const item = abroad ? rb.items.get_request_abroad : rb.items.get_request;
		lines.push({ id: 'getreq', he: 'בקשה לסידור גט בבית הדין, אחרי אישור ההסכם בבית המשפט', group: 'get', rab: null,
			fam: { amount, item, url: rb.url, src: 'regs', protocol: 0, protocolItem: '', note: 'משולמת בבית הדין הרבני', exempt: false, min: false, pctNote: null, where: 'rab' },
			both: false, chosen: forum === 'family' ? 'fam' : 'none', naHe: 'בהסכם שבית הדין מאשר, הגט מסודר באותו תיק', refundable: false,
			inRab: 0, inFam: legalAid ? 0 : amount, implied: true });
		flags.push({ code: 'get_request', he: dc.get_request_he, section: rb.items.get_request });
	}
	if (isDivorce || sel.includes('agree')) {
		lines.push({ id: 'get', he: abroad ? 'סידור הגט: הוצאות של הסדר מיוחד משולמות בנוסף, כשצריך' : 'סידור הגט עצמו, כששני בני הזוג בארץ', group: 'get',
			rab: { amount: 0, item: abroad ? rb.items.get_special : rb.items.get_free, url: rb.url, src: 'regs', protocol: 0, protocolItem: '', note: '', exempt: true, full: 0, min: false, pctNote: null, where: '' },
			fam: null, both: false, chosen: 'rab', naHe: 'הגט ניתן רק בבית הדין הרבני', refundable: false, inRab: 0, inFam: 0 });
		if (certificates) {
			const c = rb.certificate * certificates;
			lines.push({ id: 'certs', he: certificates === 2 ? 'תעודת גירושין לכל אחד מבני הזוג' : 'תעודת גירושין', group: 'get', count: certificates,
				rab: { amount: c, unit: rb.certificate, item: rb.items.certificate, url: rb.url, src: 'regs', protocol: 0, protocolItem: '', note: '', exempt: false, min: false, pctNote: null, where: '' },
				fam: null, both: false, chosen: 'rab', naHe: 'התעודה ניתנת בבית הדין הרבני', refundable: false, inRab: legalAid ? 0 : c, inFam: legalAid ? 0 : c });
		}
	}
	const sum = (k) => rbR2(lines.reduce((a, l) => a + l[k], 0));
	const totals = { rab: sum('inRab'), fam: sum('inFam') };
	totals.chosen = forum === 'family' ? totals.fam : totals.rab;
	totals.diff = rbR2(totals.fam - totals.rab);
	// What both routes pay anyway (the rabbinical court only: the divorce claim, the get, the certificates...).
	totals.shared = rbR2(lines.filter((l) => !l.both && !l.implied && !l.famUnknown).reduce((a, l) => a + l.inRab, 0));
	// Where the money goes on the chosen route.
	const byForum = { rab: 0, fam: 0 };
	for (const l of lines) {
		const amt = forum === 'family' ? l.inFam : l.inRab;
		const at = l.implied ? 'rab' : (forum === 'family' && l.fam ? 'fam' : 'rab');
		byForum[at] += amt;
	}
	byForum.rab = rbR2(byForum.rab); byForum.fam = rbR2(byForum.fam);

	// Refunds: the rabbinical court's reg. 12 (50% before evidence, 25% after; not the dispute request, 12(ב)); the family
	// court's reg. 8(ב) (half on a compromise up to the pre-trial), on the claims of the chosen route.
	const rr = fl.rab.rules;
	const fr = fl.fam.rules;
	const refundBase = { rab: 0, fam: 0 };
	for (const l of lines) {
		if (!l.refundable || legalAid) { continue; }
		const side = l.both ? (forum === 'family' ? 'fam' : 'rab') : 'rab';
		const cell = side === 'fam' ? l.fam : l.rab;
		refundBase[side] += rbTotal(cell, false);
	}
	const refunds = {
		rabBase: rbR2(refundBase.rab), famBase: rbR2(refundBase.fam),
		rabEarly: rbR2(refundBase.rab * (100 - rr.refund_early.pct) / 100), rabLate: rbR2(refundBase.rab * (100 - rr.refund_late.pct) / 100),
		famHalf: rbR2(refundBase.fam * (100 - fr.refund_half.pct) / 100),
	};

	// Flags: the hard cases the texts state.
	if (legalAid) { flags.push({ code: 'legal_aid', he: `${rr.legal_aid.he} (${rr.legal_aid.section}); בבית המשפט: ${fr.legal_aid.section}`, section: rr.legal_aid.section }); }
	if (abroad && sel.includes('req')) { flags.push({ code: 'abroad', he: dc.abroad_he, section: 'סעיף 4א(1)' }); }
	if (abroad && sel.includes('joint')) { flags.push({ code: 'abroad_get', he: `בקשה לסידור גט כשאחד מבני הזוג בחוץ לארץ: ${rb.get_request_abroad} ₪ (${rb.items.get_request_abroad})`, section: rb.items.get_request_abroad }); }
	if (sel.includes('sup')) { flags.push({ code: 'support', he: dc.support_he, section: rr.support.section }); }
	if (sel.includes('sup') && sel.includes('div')) { flags.push({ code: 'linked_support', he: `${fl.jurisdiction.temp_he} (${fl.jurisdiction.law_he})`, section: 'סעיף 3' }); }
	if (sel.includes('ketubah')) {
		const rule = fl.rab.pct.money_val;
		const p = rbPct(rule, value);
		flags.push({ code: 'ketubah', he: value === '' ? `בפתיחת התיק נגבים ${fl.rab.admin.ketubah.amount} ₪. לפי ${rule.item}: ${rule.he}; הקלידו את סכום הכתובה לחישוב` : `לפי ${rule.item}: 1% מ-${Number(value).toLocaleString('en-US')} ₪ הוא ${p.amount.toLocaleString('en-US')} ₪${p.min ? ' (המינימום)' : ''}; בפתיחת התיק נגבים ${fl.rab.admin.ketubah.amount} ₪, ובית הדין רשאי להעריך את השווי ולגבות הפרש (${rr.value.section})`, section: rule.item });
	}
	if (sel.includes('agree') && sel.includes('joint')) { flags.push({ code: 'topup', he: `פתחתם בבקשה משותפת (${rb.get_request} ₪) ומבקשים גם אישור הסכם: משלימים ${fl.rab.admin.agreement_topup.amount} ₪ עד ${rb.agreement} ₪ (טבלת ההנהלה)`, section: rb.items.agreement }); }
	const claims = lines.filter((l) => l.refundable).length;
	if (claims >= 2) { flags.push({ code: 'each', he: `${rr.each_claim.he} (${rr.each_claim.section}); בבית המשפט: ${fr.each_claim.he} (${fr.each_claim.section})`, section: rr.each_claim.section }); }
	if (sel.some((id) => id.startsWith('inh'))) { flags.push({ code: 'succession', he: `${fl.jurisdiction.succession_he}. אצל הרשם לענייני ירושה, בהגשה מקוונת: ${registry.inheritance_process.registrar.online_pct}% מהאגרה (${registry.inheritance_process.registrar.online_section})`, section: 'סעיף 155' }); }
	if (sel.includes('protect')) { flags.push({ code: 'protect', he: `${fr.matters.he} (${fr.matters.section}); בבית הדין הרבני אגרת צו הגנה היא 0 ₪ בטבלת ההנהלה`, section: fr.matters.section }); }
	if (sel.includes('absent')) { flags.push({ code: 'absent', he: fl.deadlines.absent_free.he, section: fl.deadlines.absent_free.section }); }
	if (sel.includes('appeal') || sel.includes('leave')) { flags.push({ code: 'repeat', he: rr.repeat_appeal.he, section: rr.repeat_appeal.section }); }

	// The dated outputs: the dispute request's statutory clock (the wave-4 engine), the appeal periods, the 90 days.
	const dl = fl.deadlines;
	const events = [];
	const ev = (date, what, rule, url, kind, extra = {}) => { events.push(Object.assign({ date, what, rule, url, kind }, extra)); };
	let clk = null;
	if (sel.includes('req') && !abroad && dates.reqDate) {
		clk = clock(dc, dates.reqDate, input.extended);
		const reqFee = forum === 'family' ? dc.family.request : rb.request;
		ev(dates.reqDate, `הגשת הבקשה ליישוב סכסוך; האגרה (${reqFee} ₪) משולמת לפני ההגשה`, forum === 'family' ? `${fr.pay_first.section}; ${dc.family.items.request}` : `${rr.pay_first.section}; ${rb.items.request}`, forum === 'family' ? dc.family.url : rb.url, 'pay');
		ev(clk.meetingsBy, `סוף התקופה לפגישות המהו"ת ביחידת הסיוע (${clk.meetingsDays} ימים, בלי תשלום)`, `${dc.disputes.sections.meetings}, ${dc.disputes.sections.meetings_days}`, dc.disputes.url, 'law');
		ev(clk.stayEnds, 'סוף עיכוב ההליכים: מעכשיו אפשר להגיש את התביעות, ואגרת כל תביעה משולמת לפני הגשתה', dc.disputes.sections.stay, dc.disputes.url, 'pay');
		ev(clk.claimsBy, `סוף ${clk.claimDays} הימים שבהם רק מי שהגיש את הבקשה רשאי לתבוע ראשון`, dc.disputes.sections.claims, dc.disputes.url, 'law');
	}
	const restNote = (iso) => (isRestDay(iso) ? 'חל ביום מנוחה' : '');
	if (dates.judgmentDate) {
		const j = dates.judgmentDate;
		const rabClaims = sel.some((id) => ['div', 'agree', 'shalom', 'mored', 'appeal', 'leave', 'appeal_other'].includes(id)) || forum === 'rabbinical';
		if (rabClaims) {
			const a = addDays(j, dl.appeal.days);
			ev(a, `ערעור לבית הדין הרבני הגדול: היום ה-${dl.appeal.days} (אגרה ${rb.appeal} ₪, ${rb.items.appeal})`, dl.appeal.section, dl.rab_url, 'appeal', { rest: restNote(a) });
			const l = addDays(j, dl.leave.days);
			ev(l, `בקשת רשות ערעור על החלטת ביניים: היום ה-${dl.leave.days} (אגרה ${fl.rab.fees.appeal_leave.amount} ₪)`, dl.leave.section, dl.rab_url, 'appeal', { rest: restNote(l) });
		}
		if (forum === 'family' && lines.some((x) => x.both && x.chosen === 'fam')) {
			const raw = addDays(j, dl.fam_appeal.days);
			const moved = offRestDays(raw);
			ev(moved, `ערעור לבית המשפט המחוזי על פסק הדין של בית המשפט לענייני משפחה: ${dl.fam_appeal.days} ימים מההמצאה (אגרה ${fl.appeal_court.appeal.amount} ₪, ${fl.appeal_court.appeal.item})${moved !== raw ? `; היום האחרון חל ביום מנוחה ועבר ליום שאחריו (${dc.disputes.interpretation_he})` : ''}`, `${dl.fam_appeal.section} ל${dl.fam_appeal.law_he}`, dl.fam_appeal.url, 'appeal');
		}
		if (sel.includes('absent')) {
			const f = addDays(j, dl.absent_free.days);
			ev(f, `בקשה לביטול פסק דין שניתן בהיעדר: עד היום ה-${dl.absent_free.days} מההודעה, בלי אגרה`, dl.absent_free.section, fl.rab.url, 'pay', { rest: restNote(f) });
			const c = addDays(j, dl.absent.days);
			ev(c, `בקשה לביטול פסק דין שניתן בהיעדר: היום ה-${dl.absent.days} מהמסירה`, dl.absent.section, dl.rab_url, 'law', { rest: restNote(c) });
		}
	}
	if (dates.getDate) {
		const g = addDays(dates.getDate, dl.permit_90.days);
		ev(g, `סוף ${dl.permit_90.days} הימים מהגט: נישואין עד היום הזה מחייבים בקשה להיתר (${fl.rab.fees.permit_90.amount} ₪)`, dl.permit_90.section, fl.rab.url, 'law');
	}
	events.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
	if (events.some((e) => e.rest)) { flags.push({ code: 'rest', he: `מועד שחל בשבת או בחג מסומן. ${dc.disputes.interpretation_he}: תקופה שהיום האחרון שלה יום מנוחה מסתיימת ביום שאחריו; כדי לא להסתכן, הגישו לפניו`, section: dc.disputes.interpretation_he }); }

	return {
		ok: true, forum, sel, abroad, legalAid, certificates, value, lines, totals, byForum, refunds, flags, events, clock: clk, dates,
		isDivorce, claims,
	};
}

/** The same selection in both forums, for the comparison line (and the snapshot's table). */
export function rbBoth(registry, input) {
	const a = rbCompute(registry, Object.assign({}, input, { forum: 'rabbinical' }));
	const b = rbCompute(registry, Object.assign({}, input, { forum: 'family' }));
	return a.ok && b.ok ? { rabbinical: a.totals.chosen, family: b.totals.chosen } : null;
}
