/**
 * Inheritance without a will: who inherits what (wave 3, HAD-498).
 *
 * Dependency-free ES module. Exact fractions (never floating shares), every rule from the Succession Law
 * (חוק הירושה, התשכ"ה-1965), read in the consolidated text on registry.yerusha.checked_on:
 *  - s.10: the heirs are the spouse and the relatives (children and their descendants, parents and their
 *    descendants, grandparents and their descendants).
 *  - s.11(א): the spouse takes the household movables (including a passenger car) and, of the rest:
 *    (1) half, if the deceased left children or their descendants, or parents; (2) two thirds, if siblings
 *    or their descendants, or grandparents; and in case (2), a spouse married 3 years or more who lived
 *    with the deceased in an apartment that is part of the estate takes the deceased's whole share in that
 *    apartment and two thirds of the rest. s.11(ב): with none of those relatives, the spouse takes it all.
 *  - s.12: children come before parents, parents before grandparents. s.13: equal shares within a class.
 *  - s.14(א)-(ב): the children of a relative who died first inherit in his place, equally; except when the
 *    deceased left a spouse and parents or grandparents. In the parents' and grandparents' lines: a living
 *    parent then takes the whole parents' part, and living grandparents the whole grandparents' part. Whether
 *    the exception also bars the children of a predeceased CHILD is not settled by the text alone, so that
 *    line is marked as a legal question (unresolved) instead of being split (review, PR 124).
 *  - s.55: partners in a shared household, neither married to another, are treated as if the deceased had
 *    bequeathed the partner what a spouse would inherit, unless the will says otherwise.
 *  - s.17: with no heir at all, the State inherits.
 * The tool models one generation of representation (grandchildren, nephews and nieces); uncles, aunts and
 * cousins are named, not split.
 */

/* ---------------- Exact fractions ---------------- */
function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
export function frac(n, d = 1) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; }
export function fadd(a, b) { return frac(a[0] * b[1] + b[0] * a[1], a[1] * b[1]); }
export function fsub(a, b) { return frac(a[0] * b[1] - b[0] * a[1], a[1] * b[1]); }
export function fmul(a, b) { return frac(a[0] * b[0], a[1] * b[1]); }
export function fdiv(a, n) { return frac(a[0], a[1] * n); }
export function fval(a) { return a[0] / a[1]; }
export const ZERO = [0, 1];
export const ONE = [1, 1];

const int = (v, max = 30) => { const n = Number(v); return Number.isInteger(n) && n >= 0 && n <= max ? n : NaN; };

/**
 * input = {
 *   spouse: 'married' | 'partner' | 'none',
 *   spouseApartment: bool  (married 3+ years and lived with the deceased in an apartment in the estate),
 *   children: n alive, childLines: [k, ...] (a child who died first, leaving k children),
 *   mother: bool, father: bool (alive),
 *   siblingsFull, siblingsFather, siblingsMother: n alive (full, half through the father, half through the mother),
 *   siblingLines: [{ side: 'full'|'father'|'mother', kids: k }, ...] (a sibling who died first, leaving k children),
 *   grandparents: 0-4 alive, grandOthersNone: bool (the grandparents who died left no other descendants),
 *   apartment: value of the deceased's share in the home (optional), other: value of the rest (optional),
 * }
 */
export function compute(registry, input) {
	const y = registry.yerusha;
	const errors = [];
	const children = int(input.children ?? 0);
	const childLines = (input.childLines || []).map((k) => int(k));
	const sib = { full: int(input.siblingsFull ?? 0), father: int(input.siblingsFather ?? 0), mother: int(input.siblingsMother ?? 0) };
	const siblingLines = (input.siblingLines || []).map((l) => ({ side: ['full', 'father', 'mother'].includes(l.side) ? l.side : 'full', kids: int(l.kids) }));
	const grand = int(input.grandparents ?? 0, 4);
	if (Number.isNaN(children)) { errors.push({ field: 'children', he: 'מספר הילדים צריך להיות מספר שלם, 0 עד 30' }); }
	if (childLines.some(Number.isNaN)) { errors.push({ field: 'childLines', he: 'מספר הנכדים צריך להיות מספר שלם' }); }
	for (const k of ['full', 'father', 'mother']) { if (Number.isNaN(sib[k])) { errors.push({ field: `sib-${k}`, he: 'מספר האחים צריך להיות מספר שלם, 0 עד 30' }); } }
	if (siblingLines.some((l) => Number.isNaN(l.kids))) { errors.push({ field: 'siblingLines', he: 'מספר ילדי האח צריך להיות מספר שלם' }); }
	if (Number.isNaN(grand)) { errors.push({ field: 'grand', he: 'מספר הסבים והסבתות החיים: 0 עד 4' }); }
	const apartment = input.apartment === '' || input.apartment === undefined || input.apartment === null ? null : Number(input.apartment);
	const other = input.other === '' || input.other === undefined || input.other === null ? null : Number(input.other);
	if (apartment !== null && !(apartment >= 0 && apartment < 1e11)) { errors.push({ field: 'apartment', he: 'שווי הדירה צריך להיות מספר חיובי' }); }
	if (other !== null && !(other >= 0 && other < 1e11)) { errors.push({ field: 'other', he: 'שווי שאר העיזבון צריך להיות מספר חיובי' }); }
	if (errors.length) { return { ok: false, errors }; }

	const spouse = ['married', 'partner'].includes(input.spouse) ? input.spouse : 'none';
	const S = y.sections;
	const flags = [];
	const path = [];
	const heirs = []; // { key, label, group, share: [n,d] of the rest, apt: [n,d] of the apartment, rule }

	const kidLines = childLines.filter((k) => k > 0);
	const hasDescendants = children > 0 || kidLines.length > 0;
	const parentsAlive = (input.mother ? 1 : 0) + (input.father ? 1 : 0);
	const sibLines = siblingLines.filter((l) => l.kids > 0);
	const sibCount = sib.full + sib.father + sib.mother + sibLines.length;
	const hasParentsLine = parentsAlive > 0 || sibCount > 0;

	// 1. The spouse's part (s.11).
	let spouseRest = ZERO;
	let spouseApt = false;
	let spouseCase = 'none';
	if (spouse !== 'none') {
		if (hasDescendants || parentsAlive > 0) {
			spouseRest = frac(y.spouse_half[0], y.spouse_half[1]);
			spouseCase = 'half';
		} else if (sibCount > 0 || grand > 0) {
			spouseRest = frac(y.spouse_two_thirds[0], y.spouse_two_thirds[1]);
			spouseCase = 'two_thirds';
			if (input.spouseApartment && spouse === 'married') { spouseApt = true; }
			if (input.spouseApartment && spouse === 'partner') {
				flags.push({ code: 'partner_apartment', he: `כלל הדירה (בן זוג נשוי ${y.spouse_apartment_min_years} שנים ויותר שגר עם המוריש) כתוב בסעיף 11(א)(2) על בן זוג נשוי. אם הוא חל גם על ידוע בציבור לפי סעיף 55, זו שאלה משפטית, ולכן הכלי לא החיל אותו.` });
			}
		} else {
			spouseRest = ONE;
			spouseCase = 'all';
		}
	}
	const rest = fsub(ONE, spouseRest);
	if (spouse !== 'none') {
		heirs.push({ key: 'spouse', label: spouse === 'married' ? 'בן/בת הזוג' : 'בן/בת הזוג (ידועים בציבור)', group: 'spouse', share: spouseRest, apt: spouseApt ? ONE : spouseRest, rule: spouseCase === 'all' ? S.spouse_all : S.spouse });
	}

	// 2. The relatives' part (ss.12-14).
	let line = 'none';
	// One row per person: a full sibling takes from both parents' halves, so the two parts are summed.
	const add = (key, label, group, share, rule) => {
		if (share[0] <= 0) { return; }
		const found = heirs.find((h) => h.key === key);
		if (found) { found.share = fadd(found.share, share); found.apt = spouseApt ? ZERO : found.share; return; }
		heirs.push({ key, label, group, share, apt: spouseApt ? ZERO : share, rule });
	};
	if (rest[0] > 0) {
		if (hasDescendants) {
			line = 'children';
			const stirpes = children + kidLines.length;
			const each = fdiv(rest, stirpes);
			for (let i = 0; i < children; i += 1) { add(`child-${i + 1}`, `ילד/ה ${i + 1}`, 'children', each, S.equal); }
			// s.14(א), end: with a spouse and a parent or grandparent alive, the representation provisions do not apply.
			const repQuestion = spouse !== 'none' && (parentsAlive > 0 || grand > 0) && kidLines.length > 0;
			kidLines.forEach((k, i) => {
				if (repQuestion) {
					heirs.push({ key: `childline-${i + 1}`, label: `ילדי ילד/ה שנפטר/ה ${i + 1}: שאלה משפטית`, group: 'unresolved', gen: 'children', share: each, apt: each, rule: S.represent, unresolved: true });
					return;
				}
				for (let j = 0; j < k; j += 1) { add(`grandchild-${i + 1}-${j + 1}`, `נכד/ה ${j + 1} (מילד שנפטר ${i + 1})`, 'children', fdiv(each, k), S.represent); }
			});
			if (repQuestion) {
				flags.push({ code: 'rep_children_question', he: 'סעיף 14(א) קובע שהוראות הייצוג לא חלות כשהמוריש הניח בן זוג וגם הורה, סב או סבתא. אם זה חל גם על ילדים של ילד שנפטר, הם לא יורשים במקומו וחלקו עובר לשאר היורשים; אם לא, הם יורשים את חלקו בשווה. הלשון לבדה לא מכריעה, ולכן הכלי לא חילק את החלק הזה: בדקו עם עורך דין.' });
			}
		} else if (hasParentsLine) {
			line = 'parents';
			// With a spouse and a living parent, there is no representation in the parents' line (s.14(א), end).
			const noRep = spouse !== 'none' && parentsAlive > 0;
			const sideHas = {
				father: input.father ? 'alive' : (sib.full + sib.father + sibLines.filter((l) => l.side !== 'mother').length > 0 ? 'line' : 'empty'),
				mother: input.mother ? 'alive' : (sib.full + sib.mother + sibLines.filter((l) => l.side !== 'father').length > 0 ? 'line' : 'empty'),
			};
			if (noRep) {
				for (const p of ['father', 'mother']) { if (sideHas[p] === 'line') { sideHas[p] = 'blocked'; } }
			}
			const live = ['father', 'mother'].filter((p) => sideHas[p] === 'alive' || sideHas[p] === 'line');
			const half = fdiv(rest, live.length);
			for (const p of live) {
				if (sideHas[p] === 'alive') { add(p, p === 'father' ? 'האב' : 'האם', 'parents', half, S.equal); continue; }
				// A parent who died first: his half goes to his children (the deceased's full siblings and the half
				// siblings on his side), equally; a sibling who died first is replaced by his children (s.14).
				const units = [];
				for (let i = 0; i < sib.full; i += 1) { units.push({ key: `sib-full-${i + 1}`, label: `אח/ות ${i + 1}` }); }
				for (let i = 0; i < sib[p]; i += 1) { units.push({ key: `sib-${p}-${i + 1}`, label: `אח/ות חורג/ת מצד ${p === 'father' ? 'האב' : 'האם'} ${i + 1}` }); }
				sibLines.forEach((l, i) => { if (l.side === 'full' || l.side === p) { units.push({ key: `sibline-${i + 1}`, kids: l.kids, label: `ילדי אח/ות שנפטר/ה ${i + 1}` }); } });
				const each = fdiv(half, units.length);
				for (const u of units) {
					if (u.kids) {
						for (let j = 0; j < u.kids; j += 1) { add(`${u.key}-${j + 1}`, `אחיין/ית ${j + 1} (${u.label})`, 'parents', fdiv(each, u.kids), S.represent); }
					} else {
						add(u.key, u.label, 'parents', each, S.represent);
					}
				}
			}
			if (noRep && (sideHas.father === 'blocked' || sideHas.mother === 'blocked')) {
				flags.push({ code: 'no_representation', he: 'כשיש בן זוג והורה אחד חי, האחים לא באים במקום ההורה שנפטר, וההורה החי מקבל את כל החלק של ההורים (סעיף 14(א), סיפה).' });
			}
		} else if (grand > 0) {
			line = 'grandparents';
			const noRep = spouse !== 'none';
			if (noRep || input.grandOthersNone || grand === 4) {
				const each = fdiv(rest, grand);
				for (let i = 0; i < grand; i += 1) { add(`grand-${i + 1}`, `סב/תא ${i + 1}`, 'grandparents', each, S.equal); }
				if (noRep && grand < 4) { flags.push({ code: 'no_representation_grand', he: 'כשיש בן זוג וסב או סבתא חיים, צאצאי הסבים שנפטרו (דודים ובני דודים) לא באים במקומם (סעיף 14(א), סיפה).' }); }
			} else {
				const each = fdiv(rest, 4);
				for (let i = 0; i < grand; i += 1) { add(`grand-${i + 1}`, `סב/תא ${i + 1}`, 'grandparents', each, S.equal); }
				heirs.push({ key: 'grand-lines', label: 'צאצאי הסבים שנפטרו (דודים, דודות, בני דודים)', group: 'unresolved', share: fmul(rest, frac(4 - grand, 4)), apt: fmul(rest, frac(4 - grand, 4)), rule: S.represent, unresolved: true });
				flags.push({ code: 'grand_lines', he: 'החלק של כל סב או סבתא שנפטרו עובר לצאצאיהם (דודים, דודות, ובמקום מי שנפטר, ילדיהם). הכלי לא מחלק את הדור הזה: בדקו מי חי.' });
			}
		} else if (spouse === 'none') {
			line = input.otherRelatives ? 'unknown' : 'state';
		}
	}

	if (spouse === 'partner') { flags.push({ code: 'partner', he: 'ידועים בציבור: לפי סעיף 55, רואים כאילו המוריש ציווה לבן הזוג את מה שבן זוג נשוי היה יורש, אם שניהם לא היו נשואים לאחר ואם בצוואה אין הוראה אחרת. צריך להוכיח חיי משפחה במשק בית משותף.' }); }
	if (spouse !== 'none') { flags.push({ code: 'deduct', he: 'מה שמגיע לבן הזוג מכוח הנישואין (למשל כתובה) מנוכה מחלקו בעיזבון, אבל לא מה שמגיע לו לפי חוק יחסי ממון או הסכם ממון (סעיף 11(ג)).' }); }

	// 3. The money, when values were given.
	const aptV = apartment || 0;
	const otherV = other || 0;
	for (const h of heirs) {
		h.pct = fval(h.share) * 100;
		h.amount = (apartment !== null || other !== null) ? Math.round((fval(h.apt) * aptV + fval(h.share) * otherV) * 100) / 100 : null;
	}

	// 4. The calculation path, one rule per line.
	if (spouse !== 'none') {
		path.push({ rule: S.spouse, he: 'בן הזוג נוטל קודם את המיטלטלין של משק הבית המשותף, כולל מכונית נוסעים.' });
		if (spouseCase === 'half') { path.push({ rule: 'סעיף 11(א)(1)', he: `המוריש הניח ${hasDescendants ? 'ילדים או צאצאיהם' : 'הורה'}: לבן הזוג חצי משאר העיזבון.` }); }
		if (spouseCase === 'two_thirds') { path.push({ rule: 'סעיף 11(א)(2)', he: `המוריש הניח ${sibCount > 0 ? 'אחים או צאצאיהם' : 'סבים או סבתות'} (ולא ילדים או הורים): לבן הזוג שני שלישים משאר העיזבון${spouseApt ? ', ובנוסף כל חלקו של המוריש בדירה שגרו בה, כי היו נשואים 3 שנים ויותר' : ''}.` }); }
		if (spouseCase === 'all') { path.push({ rule: S.spouse_all, he: 'אין ילדים, הורים, אחים או סבים: בן הזוג יורש את כל העיזבון.' }); }
	}
	if (line === 'children') { path.push({ rule: `${S.order}, ${S.equal}`, he: `הילדים קודמים להורים ולשאר הקרובים, וחולקים בשווה${spouse !== 'none' ? ' את החצי השני' : ''}.` }); }
	if (line === 'children' && kidLines.length) { path.push({ rule: S.represent, he: 'ילד שנפטר לפני המוריש והשאיר ילדים: הילדים שלו באים במקומו וחולקים בשווה את חלקו.' }); }
	if (line === 'parents') { path.push({ rule: `${S.order}, ${S.equal}`, he: `אין ילדים: ההורים יורשים${spouse !== 'none' ? ' את מה שנשאר אחרי בן הזוג' : ''}, חצי לכל הורה.` }); }
	if (line === 'parents' && parentsAlive < 2) { path.push({ rule: S.represent, he: 'הורה שנפטר לפני המוריש: ילדיו (האחים של המוריש, כולל אחים חורגים מצדו) באים במקומו, אלא אם יש בן זוג והורה אחר חי.' }); }
	if (line === 'grandparents') { path.push({ rule: `${S.order}, ${S.equal}`, he: 'אין ילדים, הורים או אחים: הסבים והסבתות יורשים בחלקים שווים.' }); }
	if (line === 'state') { path.push({ rule: S.state, he: 'אין בן זוג ואין קרובים שהחוק מונה: המדינה יורשת.' }); }
	if (line === 'unknown') { path.push({ rule: S.heirs, he: 'אין בן זוג, ילדים, הורים, אחים או סבים, אבל יש דודים או בני דודים: הם יורשים כצאצאי הסבים. הכלי לא מחלק את הדור הזה.' }); }

	// The registrar's fee: 85% when the request is filed online (reg. 1(א)).
	const fee = { fee: y.fees.order_fee, online: Math.round(y.fees.order_fee * y.fees.online_pct) / 100, from: y.fees.from };
	return { ok: true, spouse, spouseCase, spouseApt, line, heirs, flags, path, fee, apartment, other, unresolved: heirs.some((h) => h.unresolved), question: heirs.some((h) => h.unresolved && h.gen === 'children'), state: line === 'state', unknown: line === 'unknown' };
}

/** "1/6" style label, with the percent. */
export function fracText(f) { return f[1] === 1 ? String(f[0]) : `${f[0]}/${f[1]}`; }
