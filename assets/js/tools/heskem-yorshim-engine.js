/**
 * The heirs' distribution agreement with an equalization ledger (הסכם חלוקת עיזבון ומאזן בין יורשים), the inheritance
 * wave (21.10.2026). Invented: no Hebrew tool computes the exact amount of outside money in a division and writes the
 * agreement around it.
 *
 * Dependency-free ES module. Every rule comes from registry.inheritance_process (and the VAT rate from registry.will_cost):
 *  - Succession Law s.110: the heirs may divide the estate among themselves by agreement; s.111: or by a court order;
 *    the forced rules of ss.112-117 apply only without an agreement. s.8: an agreement about a person's inheritance made
 *    in his lifetime is void, so the agreement is made after the death. ss.121-122: without an estate manager the heirs
 *    manage and divide the estate themselves, together.
 *  - No court and no registrar approves the agreement, unless a party is a minor or under guardianship: then the
 *    court's approval in advance (Legal Capacity Law s.20; a guardian, s.47).
 *  - Land Taxation Law s.4: an inheritance is not a sale; s.5(ג)(4): the first division of the estate's assets among the
 *    heirs is not a sale, before or after the order's registration, as long as no consideration was given in money or
 *    money's worth that is not an estate asset. So an equalization paid from estate money is not a sale, and the part
 *    paid from an heir's own money is a sale of that part: the ledger finds that exact amount and the pairs; the taxes
 *    themselves are the site's purchase-tax and appreciation-tax calculators' job. s.49ב(5): the inherited home sold later.
 *  - Registration (Bar tariff item 11(9)(ח), per land unit, non-binding, before VAT) when the estate holds real estate.
 *  - Disputes: mediation (Courts Law s.79ג), the family court (Succession Law s.151); partition of a co-owned flat with
 *    no agreement: Land Law ss.37-40.
 */

export const RELATIONS = ['spouse', 'child', 'sibling', 'parent', 'other'];
export const RELATION_HE = { spouse: 'בן/בת זוג', child: 'ילד/ה', sibling: 'אח/ות', parent: 'הורה', other: 'אחר' };
export const ASSET_TYPES = ['flat', 'cash', 'car', 'shares', 'business', 'other'];
export const ASSET_HE = { flat: 'דירה', cash: 'כסף וחסכונות', car: 'רכב', shares: 'מניות וניירות ערך', business: 'עסק', other: 'אחר' };
export const MAX_HEIRS = 8;
export const MIN_HEIRS = 2;
export const MAX_ASSETS = 10;

const r2 = (n) => Math.round(n * 100) / 100;
const EPS = 0.005;
const BLANK = '____________';

export function heirLabel(h, i) {
	const t = h && typeof h.label === 'string' ? h.label.trim() : '';
	return t || `יורש/ת ${i + 1}`;
}

/** Entered money: a finite number above zero and below a sane ceiling. */
const isMoney = (v) => v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v)) && Number(v) > 0 && Number(v) < 1e10;

/**
 * The equalization plan: the heirs who received more than their share (positive delta) pay the heirs who received less,
 * largest first. Each payer pays first by forgoing his share of the estate's liquid money (the cash allocated "common"
 * and the proceeds of assets sold), then from his own money when that is allowed; what neither covers is "missing".
 */
export function equalize(heirs, privateMoney) {
	const payers = heirs.filter((h) => h.delta > EPS).map((h) => ({ i: h.i, left: h.delta, cap: r2(Math.min(h.delta, h.cashShare)) })).sort((a, b) => b.left - a.left);
	const receivers = heirs.filter((h) => h.delta < -EPS).map((h) => ({ i: h.i, need: r2(-h.delta) })).sort((a, b) => b.need - a.need);
	const pairs = [];
	const give = (p, source) => {
		for (const r of receivers) {
			const room = source === 'estate' ? p.cap : p.left;
			if (room <= EPS) { break; }
			if (r.need <= EPS) { continue; }
			const amount = r2(Math.min(room, r.need));
			pairs.push({ from: p.i, to: r.i, amount, source });
			r.need = r2(r.need - amount);
			p.left = r2(p.left - amount);
			if (source === 'estate') { p.cap = r2(p.cap - amount); }
		}
	};
	payers.forEach((p) => give(p, 'estate'));
	payers.forEach((p) => give(p, privateMoney ? 'private' : 'missing'));
	const sum = (source) => r2(pairs.filter((x) => x.source === source).reduce((a, x) => a + x.amount, 0));
	return { pairs, fromEstate: sum('estate'), fromPrivate: sum('private'), missing: sum('missing') };
}

/**
 * input = {
 *   heirs: [{ label (document only, never in the share link), relation (RELATIONS), share (percent when custom) }] (2-8),
 *   custom (bool: shares by percent, else equal), assets: [{ type (ASSET_TYPES), value, to (heir index | 'common' | 'sell') }] (1-10),
 *   privateMoney (bool: an heir may pay equalization from his own money), minor (bool: a minor or a person under
 *   guardianship among the heirs), stage ('before' | 'after' the order), basis ('law': צו ירושה | 'will': צו קיום צוואה)
 * }
 */
export function compute(registry, input) {
	const ip = registry.inheritance_process;
	const errors = [];
	const heirsIn = Array.isArray(input.heirs) ? input.heirs : [];
	const assetsIn = Array.isArray(input.assets) ? input.assets : [];
	const custom = Boolean(input.custom);
	const n = heirsIn.length;
	if (n < MIN_HEIRS || n > MAX_HEIRS) { errors.push({ field: 'heirs', he: `היורשים: בין ${MIN_HEIRS} ל-${MAX_HEIRS}` }); }
	if (custom) {
		let sum = 0;
		heirsIn.forEach((h, i) => {
			const v = Number(h.share);
			if (h.share === '' || h.share === null || h.share === undefined || !Number.isFinite(v) || v < 0 || v > 100) { errors.push({ field: `share-${i}`, he: 'החלק באחוזים: מספר בין 0 ל-100' }); } else { sum += v; }
		});
		if (!errors.some((e) => e.field.startsWith('share-')) && Math.abs(sum - 100) > 0.01) { errors.push({ field: 'shares', he: `החלקים צריכים להסתכם ב-100%; עכשיו ${r2(sum)}%` }); }
	}
	if (assetsIn.length < 1 || assetsIn.length > MAX_ASSETS) { errors.push({ field: 'assets', he: `הנכסים: לפחות נכס אחד, עד ${MAX_ASSETS}` }); }
	assetsIn.forEach((a, i) => {
		if (!isMoney(a.value)) { errors.push({ field: `asset-${i}`, he: 'שווי הנכס: מספר חיובי בשקלים' }); }
		const to = a.to;
		const ok = to === 'common' || to === 'sell' || (Number.isInteger(Number(to)) && Number(to) >= 0 && Number(to) < n && to !== '');
		if (!ok) { errors.push({ field: `asset-${i}`, he: 'למי הנכס: יורש/ת מהרשימה, משותף, או נמכר' }); }
	});
	if (errors.length) { return { ok: false, errors }; }

	const total = r2(assetsIn.reduce((a, x) => a + Number(x.value), 0));
	const shares = heirsIn.map((h) => (custom ? Number(h.share) / 100 : 1 / n));
	const assets = assetsIn.map((a, i) => ({ i, type: ASSET_TYPES.includes(a.type) ? a.type : 'other', value: Number(a.value), to: a.to === 'common' || a.to === 'sell' ? a.to : Number(a.to) }));
	// The estate's liquid money that the heirs can steer in the agreement: cash left common, and the proceeds of what is sold.
	const liquid = assets.filter((a) => a.to === 'sell' || (a.to === 'common' && a.type === 'cash'));
	const estateCash = r2(liquid.reduce((a, x) => a + x.value, 0));
	const pooled = r2(assets.filter((a) => a.to === 'common' || a.to === 'sell').reduce((a, x) => a + x.value, 0));
	const heirs = heirsIn.map((h, i) => {
		const own = assets.filter((a) => a.to === i);
		const direct = r2(own.reduce((a, x) => a + x.value, 0));
		const entitled = r2(total * shares[i]);
		const received = r2(direct + pooled * shares[i]);
		return {
			i, label: heirLabel(h, i), relation: RELATIONS.includes(h.relation) ? h.relation : 'other', share: shares[i], pct: r2(shares[i] * 100),
			entitled, received, delta: r2(received - entitled), cashShare: r2(estateCash * shares[i]), direct, assets: own.map((a) => a.i),
		};
	});
	const privateMoney = Boolean(input.privateMoney);
	const plan = equalize(heirs, privateMoney);
	const equalization = r2(heirs.filter((h) => h.delta > EPS).reduce((a, h) => a + h.delta, 0));
	const balanced = equalization <= EPS;
	// Who buys what from whom: a private payment is consideration outside the estate; when the payer received exactly one
	// flat and nothing else in kind, the bought part is that fraction of the flat.
	const buys = plan.pairs.filter((p) => p.source === 'private').map((p) => {
		const payer = heirs[p.from];
		const inKind = payer.assets.map((k) => assets[k]);
		const flat = inKind.length === 1 && inKind[0].type === 'flat' ? inKind[0] : null;
		return Object.assign({}, p, { fraction: flat ? r2(p.amount / flat.value * 100) : null, asset: flat ? flat.i : null, land: inKind.some((a) => a.type === 'flat') });
	});
	const flats = assets.filter((a) => a.type === 'flat');
	const kept = flats.filter((a) => a.to !== 'sell');
	const realEstate = flats.length > 0;
	const bar = ip.bar;
	const vat = (registry.will_cost && registry.will_cost.vat) || ip.vat;
	const units = kept.length;
	const registration = { units, perUnit: bar.registration_per_unit, total: r2(bar.registration_per_unit * units), withVat: r2(bar.registration_per_unit * units * (100 + vat.pct) / 100), vatPct: vat.pct, item: bar.items.registration, url: bar.url, note: bar.note_he };
	const minor = Boolean(input.minor);
	const stage = input.stage === 'before' ? 'before' : 'after';
	const basis = input.basis === 'will' ? 'will' : 'law';
	const lt = ip.land_tax;
	const flags = [];
	if (!balanced && plan.fromEstate > EPS) { flags.push({ code: 'estate', he: `${fmt(plan.fromEstate)} ₪ מהאיזון באים מכספי העיזבון: ${lt.division_he} (${lt.division_not_sale} לחוק מיסוי מקרקעין).` }); }
	if (plan.fromPrivate > EPS) {
		const landBuys = buys.filter((b) => b.land);
		flags.push({ code: 'private', he: landBuys.length
			? `${fmt(plan.fromPrivate)} ₪ מגיעים מכסף פרטי: תמורה שאינה מנכסי העיזבון. החלק הזה הוא מכירה לעניין חוק מיסוי מקרקעין (${lt.division_not_sale}): מי שמשלם רוכש חלק בדירה (מס רכישה), ומי שמקבל מוכר אותו (מס שבח). הכלי לא מחשב את המס; מחשבוני מס הרכישה ומס השבח של האתר עושים זאת.`
			: `${fmt(plan.fromPrivate)} ₪ מגיעים מכסף פרטי: תמורה שאינה מנכסי העיזבון. אצל מי שמשלם אין מקרקעין בחלוקה הזאת, ולכן חוק מיסוי מקרקעין לא חל על התשלום; את המס על נכס אחר (מניות, עסק) בודקים עם עורך דין.` });
	}
	if (plan.missing > EPS) { flags.push({ code: 'missing', he: `כספי העיזבון מכסים רק ${fmt(plan.fromEstate)} ₪ מהאיזון, וחסרים ${fmt(plan.missing)} ₪. סמנו "גם מכסף פרטי של יורש", הוסיפו נכס שנמכר והפדיון מתחלק, או שנו את החלוקה.` }); }
	if (minor) { flags.push({ code: 'minor', he: `אחד היורשים קטין או שמונה לו אפוטרופוס: ההסכם טעון אישור בית המשפט מראש. ${ip.capacity.he}.` }); }
	else { flags.push({ code: 'no_court', he: `ההסכם לא טעון אישור של בית משפט ולא של הרשם לענייני ירושה: היורשים רשאים לחלק את העיזבון ביניהם בהסכם (${ip.sections.division_agreement} לחוק הירושה), ובלי מנהל עיזבון הם מנהלים ומחלקים אותו יחד (${ip.sections.no_manager} ו-${ip.sections.heirs_together.replace('סעיף ', '')}).` }); }
	if (stage === 'before') { flags.push({ code: 'before', he: `לפני הצו: ההסכם נערך אחרי הפטירה (הסכם בחיי המוריש בטל, ${ip.sections.agreement_in_life_void}), והחלוקה מבוצעת עם מתן הצו. חלוקה ראשונה של נכסי העיזבון אינה מכירה גם לפני רישום הצו (${lt.division_not_sale}).` }); }
	if (kept.length) { flags.push({ code: 'inherited_home', he: `דירה שהתקבלה בירושה ונמכרת אחר כך: ${lt.inherited_home_he} (${lt.inherited_home}).` }); }
	if (realEstate) { flags.push({ code: 'partition', he: `בלי הסכם על דירה משותפת: ${ip.land_law.partition_he}.` }); }

	const out = {
		ok: true, total, n, custom, heirs, assets, estateCash, pooled, equalization, balanced, privateMoney, minor, stage, basis,
		pairs: plan.pairs, fromEstate: plan.fromEstate, fromPrivate: plan.fromPrivate, missing: plan.missing, buys,
		realEstate, flats: flats.map((a) => a.i), registration, flags,
		payers: heirs.filter((h) => h.delta > EPS).map((h) => h.i), receivers: heirs.filter((h) => h.delta < -EPS).map((h) => h.i),
	};
	out.text = draftText(registry, out);
	out.checklist = checklist(registry, out);
	return out;
}

/** 1,234,567 or 1,234.50: for the document and the flags (plain text, no HTML). */
export function fmt(n) {
	const v = r2(Number(n) || 0);
	return Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 });
}
const hyNis = (n) => `${fmt(n)} ₪`;
const pctText = (p) => `${Number(p).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`;

/** How each asset is named in the agreement, with placeholders for the identifying details. */
export function assetText(a) {
	const v = hyNis(a.value);
	switch (a.type) {
		case 'flat': return `הדירה ברחוב [כתובת], הידועה כגוש [גוש] חלקה [חלקה] תת-חלקה [תת-חלקה], בשווי מוסכם של ${v}`;
		case 'cash': return `הכספים והחסכונות בסך ${v} (חשבון מספר [מספר חשבון] בבנק [שם הבנק וסניף])`;
		case 'car': return `הרכב מסוג [דגם] מספר רישוי [מספר רישוי], בשווי מוסכם של ${v}`;
		case 'shares': return `המניות וניירות הערך בשווי מוסכם של ${v} (חשבון מספר [מספר חשבון])`;
		case 'business': return `הזכויות בעסק [שם העסק ומספרו] בשווי מוסכם של ${v}`;
		default: return `[תיאור הנכס] בשווי מוסכם של ${v}`;
	}
}

/** The verbs of the division clause in the asset's gender and number (a flat is feminine, cash is plural, a car is masculine). */
const VERBS = {
	flat: { common: 'תישאר בבעלות משותפת של היורשים לפי חלקיהם', sell: 'תימכר בידי היורשים יחד, והתמורה נטו, אחרי הוצאות המכירה, תחולק ביניהם לפי חלקיהם', one: (who) => `תועבר במלואה ל${who}, ותירשם על שמו/ה בלשכת רישום המקרקעין` },
	cash: { common: 'יחולקו בין היורשים לפי חלקיהם', sell: 'יחולקו בין היורשים לפי חלקיהם', one: (who) => `יועברו במלואם ל${who}` },
	car: { common: 'יישאר בבעלות משותפת של היורשים לפי חלקיהם', sell: 'יימכר בידי היורשים יחד, והתמורה נטו תחולק ביניהם לפי חלקיהם', one: (who) => `יועבר במלואו ל${who}, ויירשם על שמו/ה במשרד הרישוי` },
	shares: { common: 'יישארו בבעלות משותפת של היורשים לפי חלקיהם', sell: 'יימכרו, והתמורה נטו תחולק בין היורשים לפי חלקיהם', one: (who) => `יועברו במלואן ל${who}, ויירשמו על שמו/ה` },
	business: { common: 'יישארו בבעלות משותפת של היורשים לפי חלקיהם', sell: 'יימכרו, והתמורה נטו תחולק בין היורשים לפי חלקיהם', one: (who) => `יועברו במלואן ל${who}, ויירשמו על שמו/ה ברשם הרלוונטי` },
	other: { common: 'יישאר בבעלות משותפת של היורשים לפי חלקיהם', sell: 'יימכר, והתמורה נטו תחולק בין היורשים לפי חלקיהם', one: (who) => `יועבר במלואו ל${who}` },
};
export function divisionText(a, who) {
	const v = VERBS[a.type] || VERBS.other;
	if (a.to === 'common') { return `${assetText(a)} ${v.common}${a.type === 'cash' ? ', בכפוף לתשלומי האיזון שבסעיף 3' : ''}.`; }
	if (a.to === 'sell') { return `${assetText(a)} ${v.sell}, בכפוף לתשלומי האיזון שבסעיף 3.`; }
	return `${assetText(a)} ${v.one(who)}.`;
}

/** The agreement: title, parties, recitals, nine clauses and the signatures. Labels and placeholders only. */
export function draftText(registry, r) {
	const ip = registry.inheritance_process;
	const lt = ip.land_tax;
	const L = (i) => r.heirs[i].label;
	const order = r.basis === 'will' ? 'צו קיום צוואה' : 'צו ירושה';
	const byWhat = r.basis === 'will' ? 'הזוכים על פי הצוואה' : 'היורשים על פי דין';
	const sharesLine = r.heirs.map((h) => `${h.label} (${RELATION_HE[h.relation]}) ${r.custom ? pctText(h.pct) : `1/${r.n}`}`).join('; ') + (r.custom ? '' : ' (חלקים שווים)');
	const lines = ['הסכם חלוקת עיזבון', `שנערך ונחתם ב[עיר] ביום [תאריך]`, '', 'בין:'];
	r.heirs.forEach((h) => { lines.push(`${h.label}, ת"ז [מספר זהות], מרחוב [כתובת] (להלן: "${h.label}")`); });
	lines.push('(להלן יחד: "היורשים" או "הצדדים")', '');
	lines.push(`הואיל ו[שם המנוח/ה] ז"ל, ת"ז [מספר זהות] (להלן: "המנוח/ה"), נפטר/ה ביום [תאריך הפטירה];`);
	lines.push(r.stage === 'after'
		? `והואיל וביום [תאריך הצו] ניתן ${order} מספר [מספר הצו] על עיזבון המנוח/ה (להלן: "הצו");`
		: `והואיל וטרם ניתן ${order} על עיזבון המנוח/ה, והצדדים הגישו או יגישו בקשה ל${order} (להלן: "הצו"), וחלוקת העיזבון לפי הסכם זה תבוצע עם מתן הצו;`);
	lines.push(`והואיל ו-${byWhat} הם הצדדים להסכם זה, וחלקיהם בעיזבון: ${sharesLine};`);
	lines.push(`והואיל וסעיף 110 לחוק הירושה, התשכ"ה-1965, מתיר ליורשים לחלק את נכסי העיזבון ביניהם בהסכם, בלי צורך בצו בית משפט (סעיף 111), והסכם זה נערך אחרי הפטירה (סעיף 8);`);
	lines.push('והואיל והצדדים מבקשים לחלק ביניהם את נכסי העיזבון בדרך המפורטת בהסכם זה, גם אם היא שונה מחלקיהם, ולאזן ביניהם כמפורט להלן;');
	lines.push('והואיל וכל צד קיבל, או הוצע לו לקבל, ייעוץ משפטי עצמאי, והוא חותם בהסכמה חופשית ובהבינו את משמעות ההסכם ותוצאותיו;');
	lines.push('', 'לפיכך הוסכם, הוצהר והותנה בין הצדדים כדלקמן:', '');
	const clauses = [];
	const add = (title, items) => { clauses.push({ title, items: items.filter(Boolean) }); };
	add('הגדרות ומבוא', [
		'המבוא להסכם זה הוא חלק בלתי נפרד ממנו.',
		'"העיזבון": כל נכסי המנוח/ה ביום הפטירה, זכויותיו/ה וחובותיו/ה; "הנכסים": הנכסים המפורטים בסעיף 2; "החלק על פי הצו": חלקו של כל יורש בעיזבון כמפורט במבוא.',
		`שווי הנכסים המוסכם נקבע על ידי הצדדים לצורך הסכם זה בלבד [או: לפי חוות דעת שמאי מיום [תאריך]], וסך שווי העיזבון לפי ההסכם: ${hyNis(r.total)}.`,
	]);
	add('החלוקה', r.assets.map((a) => divisionText(a, a.to === 'common' || a.to === 'sell' ? '' : L(a.to)))
		.concat(['כל נכס אחר של העיזבון שלא פורט בסעיף זה, אם יימצא, יחולק בין היורשים לפי חלקיהם על פי הצו.']));
	const payLines = [];
	if (r.balanced) {
		payLines.push(`לפי החלוקה שבסעיף 2 מקבל כל יורש נכסים בשווי חלקו בעיזבון${r.custom ? '' : ` (${hyNis(r.heirs[0].entitled)} לכל אחד)`}, ואין בין הצדדים תשלומי איזון.`);
	} else {
		payLines.push(`חלקו של כל יורש בשווי העיזבון לפי ההסכם: ${r.heirs.map((h) => `${h.label} ${hyNis(h.entitled)}`).join('; ')}. סך תשלומי האיזון: ${hyNis(r.equalization)}.`);
		r.pairs.forEach((p) => {
			if (p.source === 'estate') { payLines.push(`${L(p.from)} מוותר/ת לטובת ${L(p.to)} על ${hyNis(p.amount)} מתוך חלקו/ה בכספי העיזבון שבסעיף 2, וסכום זה ישולם ל${L(p.to)} מכספי העיזבון ולא מכספו/ה של ${L(p.from)}.`); }
			else if (p.source === 'private') {
				const b = r.buys.find((x) => x.from === p.from && x.to === p.to && x.amount === p.amount);
				payLines.push(`${L(p.from)} ישלם/תשלם ל${L(p.to)} ${hyNis(p.amount)} מכספו/ה הפרטי עד יום [תאריך התשלום]${b && b.fraction !== null ? `, כנגד העברת חלקו/ה של ${L(p.to)} בדירה (${pctText(b.fraction)} מהזכויות בדירה)` : ''}.`);
			} else { payLines.push(`${L(p.from)} ישלם/תשלם ל${L(p.to)} ${hyNis(p.amount)} [מקור התשלום: להשלים], עד יום [תאריך התשלום].`); }
		});
		if (r.fromPrivate > EPS) { payLines.push(`הצדדים יודעים שהסכום של ${hyNis(r.fromPrivate)} הוא תמורה בכסף שאינה מנכסי העיזבון, ולכן חלק זה של החלוקה הוא מכירה לעניין חוק מיסוי מקרקעין (${lt.division_not_sale}); הצדדים ידווחו עליו למנהל מיסוי מקרקעין במועד, וכל צד יישא במס החל עליו על פי דין.`); }
		else if (r.missing <= EPS) { payLines.push(`הצדדים מצהירים שלא ניתנה ולא תינתן תמורה בכסף או בשווה כסף שאינה מנכסי העיזבון, ולכן החלוקה לפי הסכם זה אינה מכירה (${lt.division_not_sale} לחוק מיסוי מקרקעין).`); }
	}
	add('תשלומי איזון', payLines);
	add('הצהרות הצדדים', [
		'הצדדים מצהירים שלמיטב ידיעתם אין לעיזבון נכסים נוספים מלבד הנכסים, ואם יימצאו, יחולו עליהם הוראות סעיף 2.',
		'חובות העיזבון, הוצאות הקבורה וההוצאות לקבלת הצו ישולמו מנכסי העיזבון לפני החלוקה, וכל יורש יישא ביתרה לפי חלקו על פי הצו.',
		r.fromPrivate > EPS ? `מלבד התשלום הפרטי שבסעיף 3, לא ניתנה ולא תינתן תמורה שאינה מנכסי העיזבון.` : 'לא ניתנה ולא תינתן תמורה בכסף או בשווה כסף שאינה מנכסי העיזבון, לא בהסכם זה ולא מחוצה לו.',
		'אף צד לא הסתלק מחלקו בעיזבון, ואין לאף צד טענה כלפי תוקף הצו.',
	]);
	add('רישום ושיתוף פעולה', [
		r.realEstate ? `הצדדים יחתמו על כל מסמך הדרוש לרישום הזכויות בדירה בלשכת רישום המקרקעין על שם מי שזוכה בה לפי סעיף 2, לרבות הבקשה לרישום ירושה, הצהרות למיסוי מקרקעין וייפוי כוח, בתוך [מספר] ימים מהחתימה${r.stage === 'before' ? ' או ממתן הצו, לפי המאוחר' : ''}.` : '',
		'הצדדים יחתמו על הוראות לבנקים ולכל גוף אחר שמחזיק בנכסי העיזבון, לחלוקת הכספים והזכויות לפי הסכם זה, ויציגו את הצו לכל גוף שידרוש אותו.',
		'עד השלמת הרישום והחלוקה ינהלו הצדדים את נכסי העיזבון יחד, ולא יעשו בהם עסקה בלי הסכמת כולם (סעיפים 121 ו-122 לחוק הירושה).',
	]);
	add('הוצאות', [
		`הוצאות הרישום, האגרות ושכר הטרחה לעריכת הסכם זה יתחלקו בין הצדדים לפי חלקיהם על פי הצו [או: כל צד יישא בהוצאותיו].${r.registration.units ? ` רישום הדירה בלשכת רישום המקרקעין: כשעורך הדין שהוציא את הצו רושם, אין תעריף נוסף; אחרת, התעריף המינימלי המומלץ של לשכת עורכי הדין הוא ${hyNis(r.registration.perUnit)} ליחידת מקרקעין לפני מע"מ (לא מחייב).` : ''}`,
		r.fromPrivate > EPS ? 'מס רכישה על החלק הנרכש יחול על מי שמשלם, ומס שבח, אם יחול, על מי שמקבל את התשלום, אלא אם הסכימו הצדדים אחרת בכתב.' : '',
	]);
	if (r.minor) {
		add('קטין או חסוי', [
			`בין הצדדים קטין או מי שמונה לו אפוטרופוס, ולכן הסכם זה טעון אישור בית המשפט מראש (${ip.capacity.minor_property} ו-${ip.capacity.guardian.replace('סעיף ', '')} לחוק הכשרות המשפטית והאפוטרופסות, התשכ"ב-1962). ההסכם ייכנס לתוקף עם מתן האישור, והצדדים יגישו את הבקשה לאישור בתוך [מספר] ימים מהחתימה.`,
		]);
	}
	add('יישוב מחלוקות', [
		'מחלוקת בביצוע הסכם זה תובא תחילה לגישור אצל מגשר מוסכם, ובהיעדר הסכמה על זהות המגשר, אצל מגשר שימנה [גוף ממנה].',
		'לא יושבה המחלוקת בגישור בתוך [מספר] ימים, תובא ההכרעה לבית המשפט לענייני משפחה (סעיף 151 לחוק הירושה).',
		r.realEstate ? 'כל עוד הדירה רשומה על שם כמה יורשים, אין בהסכם זה כדי לשלול מכל שותף את זכותו לדרוש פירוק שיתוף לפי סעיף 37 לחוק המקרקעין, בכפוף להוראות הסכם זה.' : '',
	]);
	add('כללי', [
		'הסכם זה ממצה את ההסכמות בין הצדדים בעניין חלוקת העיזבון, וכל שינוי בו ייעשה בכתב ובחתימת כל הצדדים.',
		'ההסכם נחתם אחרי פטירת המנוח/ה, וכל צד קיבל עותק חתום ממנו.',
		'כתובות הצדדים לצורך הסכם זה הן כמפורט במבוא.',
	]);
	clauses.forEach((c, k) => {
		lines.push(`${k + 1}. ${c.title}`);
		c.items.forEach((t, j) => lines.push(`${k + 1}.${j + 1} ${t}`));
		lines.push('');
	});
	lines.push('ולראיה באו הצדדים על החתום:', '');
	r.heirs.forEach((h) => { lines.push(`${BLANK}  ${h.label}`); });
	return lines.join('\n');
}

/** What to have in hand before signing. */
export function checklist(registry, r) {
	const out = [];
	out.push(r.stage === 'after' ? `${r.basis === 'will' ? 'צו קיום הצוואה' : 'צו הירושה'} (העתק מאושר), ותעודת הפטירה` : `אישור הגשת הבקשה ל${r.basis === 'will' ? 'צו קיום צוואה' : 'צו ירושה'}, ותעודת הפטירה; ההסכם מבוצע עם מתן הצו`);
	out.push('תעודה מזהה של כל יורש/ת, וייפוי כוח כשמישהו חותם בשם אחר');
	if (r.realEstate) { out.push('נסח רישום עדכני מלשכת רישום המקרקעין לכל דירה, ואישור על יתרת המשכנתא אם יש'); }
	out.push('אישורי יתרה מהבנקים ומהגופים שמחזיקים בכספים ובניירות הערך, ליום הפטירה והיום');
	out.push('הערכת שווי מוסכמת לכל נכס (שמאי לדירה, מחירון לרכב), כדי שהמאזן ייבנה על שווי שכולם מקבלים');
	if (r.fromPrivate > EPS) { out.push('לחלק שנרכש בכסף פרטי: הצהרה למנהל מיסוי מקרקעין, וחישוב מס הרכישה ומס השבח במחשבוני האתר או אצל עורך דין'); }
	if (r.minor) { out.push('בקשה לאישור בית המשפט לענייני משפחה להסכם, בשם הקטין או החסוי, לפני הביצוע'); }
	out.push('רשימת חובות העיזבון וההוצאות שכבר שולמו, כי החובות נפרעים לפני החלוקה');
	return out;
}
