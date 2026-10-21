/**
 * The waiver-of-inheritance affidavit generator (תצהיר הסתלקות מירושה), the inheritance wave (21.10.2026).
 * Invented: no Hebrew page runs the gate of s.6 (who may receive a directed waiver, at which stage, with whose approval)
 * before it hands out the text, and none prices the verification from the tariff.
 *
 * Dependency-free ES module. Every rule comes from registry.inheritance_process (the Succession Law and the Succession
 * Regulations), every amount from registry.will_cost (the notary tariff and VAT) and registry.inheritance_process.registrar:
 *  - s.6(א): after the death and as long as the estate is not divided, an heir may waive all or part of the share, or of a
 *    bequest under a will, by a written notice to the registrar (or to the court once the file moved there, s.67א).
 *  - s.6(ב): the renouncer is treated, to the extent waived, as never having been an heir; a directed waiver exists only in
 *    favour of the deceased's spouse, child or sibling. In favour of anyone else it is a transfer of the share (s.7): a gift,
 *    and a gift of land is a "sale" under the Land Taxation Law (s.1), while inheritance itself is not (s.4).
 *  - s.6(ג): a minor or a person declared legally incapacitated waives only with the court's approval; s.6(ד): a
 *    conditional waiver is void; s.7(ג): a share already transferred, pledged or attached can no longer be waived.
 *  - Reg. 16: the waiver is filed as an affidavit stating the share waived and the beneficiary, with the court's approval
 *    attached when needed; an affidavit is signed before a lawyer, notary, judge or registrar after a warning (Evidence
 *    Ordinance s.15). Before a notary: tariff item 7, first signer and each additional signer, plus VAT.
 *  - After an order was issued (and before division) the waiver changes the shares: a request to amend the order (s.72,
 *    reg. 27), the registrar's fee item 2, and 14 days for the heirs to respond.
 */

export const BASIS = ['law', 'will'];
export const RELATIONS = ['child', 'spouse', 'sibling', 'parent', 'grandchild', 'other'];
export const SCOPES = ['all', 'part', 'bequest'];
export const KINDS = ['general', 'spouse', 'child', 'sibling', 'other'];
export const WHO = ['adult', 'minor', 'guardian'];
export const STAGES = ['before', 'filed', 'ordered', 'divided'];
export const VERIFY = ['lawyer', 'notary'];
export const GENDERS = ['f', 'm'];

const r2 = (n) => Math.round(n * 100) / 100;
const blank = (x) => x === '' || x === undefined || x === null;

/** The renouncer's relation to the deceased, as a noun and as a possessive for the affidavit ("בתו של המנוח/ה"). */
export const RELATION_HE = {
	child: { f: 'בת', m: 'בן', of: { f: 'בתו', m: 'בנו' } },
	spouse: { f: 'בת זוג', m: 'בן זוג', of: { f: 'בת זוגו', m: 'בן זוגו' } },
	sibling: { f: 'אחות', m: 'אח', of: { f: 'אחותו', m: 'אחיו' } },
	parent: { f: 'אם', m: 'אב', of: { f: 'אמו', m: 'אביו' } },
	grandchild: { f: 'נכדה', m: 'נכד', of: { f: 'נכדתו', m: 'נכדו' } },
	other: { f: 'קרובה אחרת', m: 'קרוב אחר', of: { f: '[הקרבה למנוח/ה]', m: '[הקרבה למנוח/ה]' } },
};

/** The beneficiary of a directed waiver: the three the law allows (s.6(ב)), and "another person", which is not a waiver. */
export const KIND_HE = {
	general: { label: 'סתמית: לכל היורשים', to: 'שאר היורשים, לפי חלקיהם', doc: '' },
	spouse: { label: 'בן/בת הזוג של המנוח/ה', to: 'בן/בת הזוג של המנוח/ה', doc: 'בן/בת זוגו של המנוח/ה' },
	child: { label: 'ילד/ה של המנוח/ה', to: 'ילד/ה של המנוח/ה', doc: 'ילדו/ילדתו של המנוח/ה' },
	sibling: { label: 'אח/ות של המנוח/ה', to: 'אח/ות של המנוח/ה', doc: 'אחיו/אחותו של המנוח/ה' },
	other: { label: 'אדם אחר', to: 'אדם אחר', doc: '' },
};

export const STAGE_HE = {
	before: 'לפני שהוגשה בקשה לצו',
	filed: 'הבקשה הוגשה וטרם ניתן צו',
	ordered: 'ניתן צו וטרם חולק העיזבון',
	divided: 'העיזבון כבר חולק',
};

export const WHO_HE = { adult: 'בגיר/ה', minor: 'קטין/ה', guardian: 'מי שמונה לו/לה אפוטרופוס' };

/** Gendered words of the affidavit, chosen once by the declarant's gender. */
const G = {
	f: { signed: 'החתומה מטה', liable: 'אהיה צפויה', declare: 'מצהירה', heir: 'יורשת', bene: 'זוכה', waive: 'מסתלקת', was: 'הייתי יורשת', declarant: 'המצהירה', title: 'גב\'', appeared: 'הופיעה', identified: 'שזיהתה את עצמה', warned: 'הזהרתיה', must: 'עליה', willBe: 'תהיה צפויה', does: 'תעשה', confirmed: 'אישרה', her: 'הצהרתה', signedIt: 'חתמה' },
	m: { signed: 'החתום מטה', liable: 'אהיה צפוי', declare: 'מצהיר', heir: 'יורש', bene: 'זוכה', waive: 'מסתלק', was: 'הייתי יורש', declarant: 'המצהיר', title: 'מר', appeared: 'הופיע', identified: 'שזיהה את עצמו', warned: 'הזהרתיו', must: 'עליו', willBe: 'יהיה צפוי', does: 'יעשה', confirmed: 'אישר', her: 'הצהרתו', signedIt: 'חתם' },
};

/** "הכול", "40%" or "מנה": the scope as the sticky bar and the picture say it. */
export function scopeText(r) {
	if (r.scope === 'part') { return `${r.pct}%`; }
	return r.scope === 'bequest' ? 'מנה' : 'הכול';
}

/**
 * input = { basis: 'law' | 'will', relation, scope: 'all' | 'part' | 'bequest', pct (1-99 when part), bequest (free text,
 *           never shared), kind: 'general' | 'spouse' | 'child' | 'sibling' | 'other', who: 'adult' | 'minor' | 'guardian',
 *           stage: 'before' | 'filed' | 'ordered' | 'divided', conditional (bool), verify: 'lawyer' | 'notary',
 *           signers (1-4, notary), gender: 'f' | 'm', estate (optional), sharePct (optional: the renouncer's share) }
 */
export function compute(registry, input) {
	const ip = registry.inheritance_process;
	const wc = registry.will_cost;
	const S = ip.sections;
	const R = ip.regulation_sections;
	const errors = [];
	const basis = BASIS.includes(input.basis) ? input.basis : 'law';
	const relation = RELATIONS.includes(input.relation) ? input.relation : 'child';
	const scope = SCOPES.includes(input.scope) ? input.scope : 'all';
	const kind = KINDS.includes(input.kind) ? input.kind : 'general';
	const who = WHO.includes(input.who) ? input.who : 'adult';
	const stage = STAGES.includes(input.stage) ? input.stage : 'before';
	const verify = VERIFY.includes(input.verify) ? input.verify : 'lawyer';
	const gender = GENDERS.includes(input.gender) ? input.gender : 'f';
	const conditional = Boolean(input.conditional);
	const bequest = String(input.bequest || '').trim();
	const pct = scope === 'part' ? (blank(input.pct) ? NaN : Number(input.pct)) : null;
	const signers = verify === 'notary' ? (blank(input.signers) ? 1 : Number(input.signers)) : 1;
	const estate = blank(input.estate) ? null : Number(input.estate);
	const sharePct = blank(input.sharePct) ? null : Number(input.sharePct);

	if (scope === 'part' && !(Number.isFinite(pct) && pct >= 1 && pct <= 99)) { errors.push({ field: 'pct', he: 'איזה אחוז מהחלק: מספר בין 1 ל-99' }); }
	if (scope === 'bequest' && basis !== 'will') { errors.push({ field: 'scope', he: 'מנה מסוימת יש רק בצוואה; בירושה על פי דין מסתלקים מהחלק, כולו או מקצתו' }); }
	if (relation === 'spouse' && kind === 'spouse') { errors.push({ field: 'kind', he: 'בן הזוג לא מסתלק לטובת עצמו: בחרו הסתלקות סתמית, או לטובת ילד או אח של המנוח/ה' }); }
	if (!(Number.isInteger(signers) && signers >= 1 && signers <= 4)) { errors.push({ field: 'signers', he: 'כמה חותמים על התצהיר אצל הנוטריון: 1 עד 4' }); }
	if (estate !== null && !(Number.isFinite(estate) && estate >= 0 && estate < 1e11)) { errors.push({ field: 'estate', he: 'שווי העיזבון: מספר חיובי, או ריק' }); }
	if (sharePct !== null && !(Number.isFinite(sharePct) && sharePct > 0 && sharePct <= 100)) { errors.push({ field: 'sharePct', he: 'חלקכם בעיזבון: אחוז בין 0 ל-100, או ריק' }); }
	if (errors.length) { return { ok: false, errors }; }

	const court = who !== 'adult';
	const blocked = stage === 'divided' ? 'divided' : kind === 'other' ? 'not_waiver' : '';
	const amend = !blocked && stage === 'ordered';
	const status = blocked || (amend ? 'amend' : court ? 'court' : 'ok');
	const directed = kind !== 'general' && kind !== 'other';

	// The money only when the person gave both figures (a sentence, never a computation of the estate).
	const fraction = scope === 'part' ? pct / 100 : 1;
	const waived = estate !== null && sharePct !== null && scope !== 'bequest' ? r2(estate * sharePct / 100 * fraction) : null;

	// Where the share goes (s.6(ב)): the named beneficiary, or the other heirs by their shares.
	const share = { directed, kind, to: KIND_HE[kind].to, section: S.renounce_who, url: ip.law_url, rows: [] };
	if (blocked === 'divided') {
		share.to = 'אין הסתלקות אחרי החלוקה';
		share.rows.push({ he: 'העיזבון חולק: הזכות להסתלק פקעה', how: 'מה שנשאר הוא העברה או מתנה של מה שקיבלתם, עם המס שחל עליה', section: S.renounce, url: ip.law_url });
		share.rows.push({ he: 'העברת מקרקעין בלי תמורה', how: ip.land_tax.gift_he, section: `${ip.land_tax.gift_is_sale} לחוק מיסוי מקרקעין`, url: ip.land_tax.url });
	} else if (blocked === 'not_waiver') {
		share.to = 'לא הסתלקות: העברת החלק';
		share.rows.push({ he: 'אדם שאינו בן הזוג, ילד או אח של המנוח/ה', how: 'החוק לא מכיר בהסתלקות לטובתו: החלק נשאר שלכם, ואתם מעבירים אותו בהסכם בכתב', section: S.renounce_who, url: ip.law_url });
		share.rows.push({ he: 'העברת החלק בעיזבון', how: 'הסכם בכתב; ההעברה מקנה רק מה שיגיע לכם בחלוקה, ושוללת את הזכות להסתלק', section: `${S.transfer_share}(א) ו-(ג)`, url: ip.law_url });
		share.rows.push({ he: 'מתנה של מקרקעין', how: ip.land_tax.gift_he, section: `${ip.land_tax.gift_is_sale} לחוק מיסוי מקרקעין`, url: ip.land_tax.url });
	} else if (directed) {
		share.rows.push({ he: KIND_HE[kind].to, how: `מקבל/ת את ${scope === 'bequest' ? 'המנה' : scope === 'part' ? `${pct}% מחלקכם` : 'כל חלקכם'}, כאילו לא הייתם יורשים מלכתחילה`, section: S.renounce_who, url: ip.law_url });
		share.rows.push({ he: 'אתם', how: scope === 'all' ? 'לא יורשים דבר מהעיזבון' : scope === 'part' ? `נשארים עם ${r2(100 - pct)}% מחלקכם` : 'נשארים עם כל מה שהצוואה נותנת לכם מלבד המנה', section: S.renounce_who, url: ip.law_url });
	} else {
		share.rows.push({ he: basis === 'will' ? 'הזוכים האחרים, כפי שהצוואה קובעת, ואם אין הוראה: היורשים על פי דין' : 'היורשים האחרים באותה דרגה, לפי חלקיהם', how: `החלק שהסתלקתם ממנו מתחלק ביניהם; אתם נחשבים, במידה שהסתלקתם, כאילו לא הייתם ${scope === 'all' ? 'יורשים' : 'יורשים של אותו חלק'} מלכתחילה`, section: S.renounce_who, url: ip.law_url });
		share.rows.push({ he: 'אתם', how: scope === 'all' ? 'לא יורשים דבר מהעיזבון' : scope === 'part' ? `נשארים עם ${r2(100 - pct)}% מחלקכם` : 'נשארים עם כל מה שהצוואה נותנת לכם מלבד המנה', section: S.renounce_who, url: ip.law_url });
	}

	// The cost: the affidavit has no fee item at the registrar; the verification is the tariff (notary) or the lawyer's fee agreement.
	const nf = wc.notary;
	const item = ip.notary.item;
	const vatPct = wc.vat.pct;
	const notaryBase = (n) => nf.affidavit_first + Math.max(0, n - 1) * nf.affidavit_additional;
	const withVat = (n) => r2(n * (100 + vatPct) / 100);
	const cost = { lines: [], total: 0, vat: 0, vatPct, notaryAlt: null };
	if (!blocked) {
		cost.lines.push({ key: 'file', he: stage === 'filed' ? 'הגשת תצהיר ההסתלקות לרשם לענייני ירושה, לתיק הבקשה שכבר הוגשה' : 'הגשת תצהיר ההסתלקות לרשם לענייני ירושה, עם הבקשה לצו', amount: 0, section: 'אין פרט אגרה לתצהיר הסתלקות בתוספת', url: ip.registrar.url });
		if (verify === 'notary') {
			cost.lines.push({ key: 'verify', he: `אימות תצהיר אצל נוטריון: חותם ראשון${signers === 2 ? ' ועוד חותם נוסף' : signers > 2 ? ` ועוד ${signers - 1} חותמים נוספים` : ''}`, amount: notaryBase(signers), vat: true, section: item, url: nf.url });
		} else {
			cost.lines.push({ key: 'verify', he: 'אימות התצהיר אצל עורך הדין שלכם: לפי הסכם שכר הטרחה, אין תעריף', amount: null, section: ip.evidence_he, url: ip.evidence_url });
			cost.notaryAlt = { base: notaryBase(1), total: withVat(notaryBase(1)), section: item, url: nf.url };
		}
		if (amend) {
			cost.lines.push({ key: 'amend', he: `בקשה לתיקון הצו שכבר ניתן: ${ip.registrar.items.amend.he}`, amount: ip.registrar.items.amend.amount, section: `${ip.registrar.items.amend.item} לתקנות האגרות; ${S.amend} לחוק; ${R.amend}`, url: ip.registrar.url });
		}
		cost.total = r2(cost.lines.reduce((a, l) => a + (l.amount === null ? 0 : l.vat ? withVat(l.amount) : l.amount), 0));
		cost.vat = r2(cost.lines.reduce((a, l) => a + (l.vat ? withVat(l.amount) - l.amount : 0), 0));
	}

	// The clock: the four stages of the file, the one you are in, and what each means for a waiver.
	const clock = STAGES.map((k) => ({
		key: k, he: STAGE_HE[k], now: k === stage,
		what: k === 'before' ? `מותר להסתלק (${S.renounce}(א)); התצהיר מצורף לבקשה לצו` : k === 'filed' ? `מותר להסתלק; התצהיר מוגש לתיק הבקשה (${R.renounce_affidavit}), או לבית המשפט כשהתיק עבר אליו (${S.to_court})` : k === 'ordered' ? `מותר להסתלק, אבל הצו משקף חלוקה אחרת: מבקשים לתקן אותו (${S.amend}, ${R.amend}): אגרה ${ip.registrar.items.amend.amount} ₪ (${ip.registrar.items.amend.item}), וליורשים ${ip.days.amend_response} ימים לתשובה` : `אין הסתלקות (${S.renounce}(א)): מה שנשאר הוא העברה או מתנה (${S.transfer_share})`,
		section: k === 'ordered' ? S.amend : k === 'filed' ? R.renounce_affidavit : S.renounce, url: k === 'filed' ? ip.regulations_url : ip.law_url,
		amount: k === 'ordered' ? ip.registrar.items.amend.amount : 0, days: k === 'ordered' ? ip.days.amend_response : 0,
	}));

	// What to attach (reg. 16), from the registry's document list.
	const docs = ip.documents;
	const checklist = [];
	if (!blocked) {
		const ren = docs.find((d) => d.key === 'renounce');
		checklist.push({ he: `${ren.he}${verify === 'notary' ? ' או בידי נוטריון' : ''}; בתצהיר: מה החלק שמסתלקים ממנו, ולטובת מי, אם יש`, section: ren.section, url: ip.regulations_url });
		checklist.push({ he: 'צילום תעודת הזהות של המסתלק/ת (התצהיר מזהה אתכם במספר הזהות)', section: R.renounce_affidavit, url: ip.regulations_url });
		if (court) { const mr = docs.find((d) => d.key === 'minor_renounce'); checklist.push({ he: mr.he, section: mr.section, url: ip.regulations_url }); }
		if (who === 'guardian') { const gd = docs.find((d) => d.key === 'guardian'); checklist.push({ he: gd.he, section: gd.section, url: ip.regulations_url }); }
		if (directed) { checklist.push({ he: 'פרטי הנהנה (שם ומספר זהות) ואיך הוא בן הזוג, ילד או אח של המנוח/ה', section: S.renounce_who, url: ip.law_url }); }
		if (amend) { checklist.push({ he: `בקשה לתיקון הצו למי שנתן אותו, עם העתק הצו, התצהיר וקבלה על האגרה (${ip.registrar.items.amend.amount} ₪)`, section: `${S.amend}; ${R.amend}`, url: ip.law_url }); }
		if (stage === 'before') { checklist.push({ he: 'הבקשה לצו ירושה או לצו קיום עצמה, שהתצהיר מצורף אליה', section: R.request, url: ip.regulations_url }); }
	}

	// The flags.
	const flags = [];
	if (conditional) { flags.push({ code: 'void', he: `הסתלקות על תנאי בטלה (${S.renounce_conditional}). תנאי כמו "בתנאי שאמא תישאר בדירה" מבטל את ההסתלקות כולה: מוחקים את התנאי, או עושים הסכם בין היורשים במקום`, section: S.renounce_conditional, url: ip.law_url }); }
	if (court && !blocked) { flags.push({ code: 'court', he: `${who === 'minor' ? 'קטין' : 'מי שמונה לו אפוטרופוס'} מסתלק רק באישור בית המשפט (${S.renounce_minor}); את האישור מצרפים לתצהיר (${R.renounce_affidavit}). ${ip.capacity.he}`, section: S.renounce_minor, url: ip.law_url }); }
	if (!blocked) {
		flags.push({ code: 'final', he: `ההסתלקות סופית ואינה ניתנת לחזרה: רואים אתכם, במידה שהסתלקתם, כאילו לא הייתם יורשים מלכתחילה (${S.renounce_who})`, section: S.renounce_who, url: ip.law_url });
		flags.push({ code: 'transferred', he: `אם כבר העברתם או שיעבדתם את החלק בהסכם, או שנושה עיקל אותו, הזכות להסתלק נשללה (${S.transfer_share}(ג))`, section: `${S.transfer_share}(ג)`, url: ip.law_url });
		flags.push({ code: 'creditors', he: 'אם יש לכם נושים, התייעצו לפני ההסתלקות' });
		flags.push({ code: 'tax', he: `ירושה אינה מכירה לעניין מס שבח ומס רכישה (${ip.land_tax.inheritance_not_sale} לחוק מיסוי מקרקעין), והסתלקות לפי ${S.renounce} משאירה את זה כך. הסתלקות לטובת מי שהחוק לא מתיר היא העברה: מתנה, ובמקרקעין מכירה`, section: `${ip.land_tax.inheritance_not_sale} לחוק מיסוי מקרקעין`, url: ip.land_tax.url });
	} else {
		flags.push({ code: 'gift', he: ip.land_tax.gift_he, section: `${ip.land_tax.gift_is_sale} לחוק מיסוי מקרקעין`, url: ip.land_tax.url });
		if (blocked === 'not_waiver') { flags.push({ code: 'alternative', he: `אפשרות שהחוק מכיר בה: הסתלקות סתמית (לכל היורשים) או לטובת בן הזוג, ילד או אח של המנוח/ה (${S.renounce_who}), או הסכם חלוקה בין כל היורשים (${S.division_agreement})`, section: S.division_agreement, url: ip.law_url }); }
	}

	const doc = blocked ? '' : affidavit(ip, { basis, relation, scope, pct, bequest, kind, who, stage, verify, gender, directed, signers });

	return {
		ok: true, status, blocked, court, amend, directed, void: conditional, basis, relation, scope, pct, bequest, kind, who, stage, verify, signers, gender,
		estate, sharePct, waived, share, cost, clock, checklist, flags, doc,
		scopeHe: scopeText({ scope, pct }),
	};
}

/** The affidavit text, placeholders in square brackets, every legal sentence with its section. */
export function affidavit(ip, i) {
	const S = ip.sections;
	const R = ip.regulation_sections;
	const g = G[i.gender] || G.f;
	const rel = RELATION_HE[i.relation] || RELATION_HE.other;
	const lines = [];
	lines.push('תצהיר הסתלקות מירושה', `לפי ${S.renounce} ל${ip.law_he}, ו${R.renounce_affidavit} ל${ip.regulations_he}`, '');
	lines.push(`אני ${g.signed}, [שם מלא], ת"ז [מספר זהות], מרחוב [כתובת], לאחר שהוזהרתי כי עליי להצהיר את האמת וכי ${g.liable} לעונשים הקבועים בחוק אם לא אעשה כן, ${g.declare} בזה כדלקמן:`, '');
	lines.push(`1. המנוח/ה [שם המנוח/ה], ת"ז [מספר זהות], נפטר/ה ביום [תאריך הפטירה] (להלן: "המנוח/ה").`);
	lines.push(i.basis === 'will'
		? `2. אני ${rel.of[i.gender]} של המנוח/ה, ו${g.bene} על פי צוואת המנוח/ה מיום [תאריך הצוואה].`
		: `2. אני ${rel.of[i.gender]} של המנוח/ה, ו${g.heir} על פי דין.`);
	const what = i.scope === 'part'
		? `מ-${i.pct}% (${wordsPct(i.pct)}) מחלקי בעיזבון המנוח/ה`
		: i.scope === 'bequest'
			? `מהמנה שאני זכאי/ת לה על פי הצוואה: ${i.bequest || '[תיאור המנה: הנכס או הסכום שהצוואה נותנת]'}, כולה`
			: 'מחלקי בעיזבון המנוח/ה, כולו';
	lines.push(`3. אני ${g.waive} בזה ${what}, לפי ${S.renounce}(א) לחוק.`);
	lines.push(i.directed
		? `4. ההסתלקות היא לטובת [שם מלא של הנהנה], ת"ז [מספר זהות], ${KIND_HE[i.kind].doc} (${S.renounce_who} לחוק).`
		: `4. ההסתלקות סתמית, ואינה לטובת אדם מסוים; החלק שהסתלקתי ממנו יתחלק בין ${i.basis === 'will' ? 'הזוכים האחרים לפי הצוואה, ובאין הוראה בה: היורשים על פי דין' : 'היורשים האחרים לפי חלקיהם'} (${S.renounce_who} לחוק).`);
	lines.push(`5. ידוע לי שההסתלקות סופית, שאינה ניתנת לחזרה ושאינה מותנית בתנאי (${S.renounce_conditional} לחוק), ושרואים אותי, במידה שהסתלקתי, כאילו לא ${g.was} מלכתחילה (${S.renounce_who} לחוק).`);
	let n = 6;
	if (i.who !== 'adult') { lines.push(`${n}. ${i.who === 'minor' ? 'אני קטין/ה' : 'מונה לי אפוטרופוס'}, וההסתלקות טעונה אישור בית המשפט (${S.renounce_minor} לחוק); אישור בית המשפט מיום [תאריך האישור] מצורף לתצהיר זה (${R.renounce_affidavit} לתקנות).`); n += 1; }
	if (i.stage === 'ordered') { lines.push(`${n}. ${i.basis === 'will' ? 'צו קיום צוואה' : 'צו ירושה'} ניתן ביום [תאריך הצו] בתיק [מספר התיק]; תצהיר זה מצורף לבקשה לתיקון הצו לפי ${S.amend} לחוק ו${R.amend} לתקנות.`); n += 1; }
	if (i.stage === 'filed') { lines.push(`${n}. בקשה ל${i.basis === 'will' ? 'צו קיום צוואה' : 'צו ירושה'} הוגשה ביום [תאריך ההגשה] בתיק [מספר התיק], וטרם ניתן צו; תצהיר זה מוגש לתיק הבקשה (${R.renounce_affidavit} לתקנות).`); n += 1; }
	lines.push(`${n}. הנני ${g.declare} כי זה שמי, זו חתימתי ותוכן תצהירי אמת.`, '');
	lines.push('____________________', `[שם מלא], ${g.declarant}`, '');
	const ver = i.verify === 'notary' ? 'נוטריון' : 'עו"ד';
	lines.push('אישור', `אני הח"מ, ${ver} [שם מלא], מ.ר. [מספר רישיון], מאשר/ת כי ביום [תאריך] ${g.appeared} בפניי במשרדי ב-[כתובת המשרד] ${g.title} [שם מלא], ${g.identified} בת"ז [מספר זהות], ולאחר ש${g.warned} כי ${g.must} להצהיר את האמת וכי ${g.willBe} לעונשים הקבועים בחוק אם לא ${g.does} כן, ${g.confirmed} את נכונות ${g.her} דלעיל ו${g.signedIt} עליה בפניי.`, '');
	lines.push('____________________', `${ver} [שם מלא], חתימה וחותמת`);
	return lines.join('\n');
}

/** 40 -> "ארבעים אחוזים", for the affidavit's figure in words; decimals stay digits. */
export function wordsPct(n) {
	const v = Number(n);
	if (!Number.isInteger(v) || v < 1 || v > 99) { return `${n} אחוזים`; }
	const ones = ['', 'אחד', 'שניים', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה'];
	const teens = ['עשרה', 'אחד עשר', 'שנים עשר', 'שלושה עשר', 'ארבעה עשר', 'חמישה עשר', 'שישה עשר', 'שבעה עשר', 'שמונה עשר', 'תשעה עשר'];
	const tens = ['', '', 'עשרים', 'שלושים', 'ארבעים', 'חמישים', 'שישים', 'שבעים', 'שמונים', 'תשעים'];
	let w;
	if (v < 10) { w = ones[v]; } else if (v < 20) { w = teens[v - 10]; } else { w = tens[Math.floor(v / 10)] + (v % 10 ? ` ו${ones[v % 10]}` : ''); }
	return `${w} ${v === 1 ? 'אחוז' : 'אחוזים'}`;
}

/** The same renouncer in every kind of waiver, for the side-by-side (the page table and the comparison). */
export function byKind(registry, input) {
	const out = {};
	for (const k of KINDS) {
		const r = compute(registry, Object.assign({}, input, { kind: k, relation: input.relation === 'spouse' && k === 'spouse' ? 'child' : input.relation }));
		out[k] = r.ok ? { status: r.status, blocked: r.blocked, to: r.share.to, section: r.share.section, court: r.court, amend: r.amend } : null;
	}
	return out;
}
