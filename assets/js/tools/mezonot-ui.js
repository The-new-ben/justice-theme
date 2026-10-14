/**
 * Family wave UI: child support after בע"מ 919/15, with CPI linkage and the National Insurance fallback (HAD-506).
 * One picture from the subject: the two shares the ruling weighs, side by side for parent A: the share of the income
 * and the share of the nights. The gap between them is what one parent pays the other in the ratio method; the strip of
 * 14 nights under it is the custody split. Every line of the result names its paragraph or judgment; "needs" are
 * estimates from published judgments the user can change, never an official figure.
 */
import { computeSupport, indexSupport, mzNii, mzAgeOn } from './mezonot-engine.js';
import { parseDate } from './dates.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'mezonot';
const P = 'jt16';
export const EXAMPLE = {
	mode: 'calc', parentA: 'אבא', law: 'jewish', incomeA: 14000, incomeB: 9000, housingA: 4500, housingB: 5000,
	children: ['2022-03-01', '2017-06-01'], nightsA: 5, needsDependent: '', needsIndependent: '', necessary: '', housingShare: '', central: '',
	extras: { education: '', health: '', childcare: '' },
	madad: { amount: 3000, base: '2023-02-10', every: 3 }, nii: { over55: false, remarried: false, judgment: '' },
};
export const EXAMPLE_MADAD = Object.assign({}, EXAMPLE, { mode: 'madad' });

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ` <span class="jtool-cite">${esc(text)}</span>`; }
const nis = (n) => `${money(n, Math.round(n) === n ? 0 : 2)} ₪`;
const v0 = (x) => (x === '' || x === undefined || x === null ? '' : x);
const other = (p) => (p === 'אבא' ? 'אמא' : 'אבא');
/** Parent labels: A is the parent the form calls "הורה א'", B the other. */
const names = (m) => ({ A: m.parentA === 'אמא' ? 'אמא' : 'אבא', B: other(m.parentA === 'אמא' ? 'אמא' : 'אבא') });

export function toSupportInput(m) {
	return {
		incomeA: m.incomeA, incomeB: m.incomeB, housingA: m.housingA, housingB: m.housingB, children: m.children,
		nightsA: m.nightsA, father: m.law === 'proportional' ? '' : (m.parentA === 'אמא' ? 'B' : 'A'), law: m.law,
		needsDependent: m.needsDependent, needsIndependent: m.needsIndependent, necessary: m.necessary,
		housingShare: m.housingShare, central: m.central, extras: m.extras, asOf: m.asOf,
	};
}

/* ---------------- Pure renderers ---------------- */

function moneyField(id, label, v, hint) {
	return `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v0(v) === '' ? '' : money(v, Number(v) % 1 ? 2 : 0))}" placeholder="0" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}
function textField(id, label, v, placeholder, hint) {
	return `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v0(v))}" placeholder="${esc(placeholder || '')}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;

function kidRow(b, i) {
	return `<li class="jtool-rep__row jt16-kid" data-kid="${i}"><div class="jtool-field"><label class="jtool-label" for="${P}-kid-${i}">ילד/ה ${i + 1}: תאריך לידה</label><input id="${P}-kid-${i}" type="text" inputmode="numeric" autocomplete="off" value="${esc(b ? isoToHe(b) : '')}" placeholder="לדוגמה: 1.6.2017" aria-describedby="${P}-kid-${i}-e"><p class="jtool-error" id="${P}-kid-${i}-e" role="alert"></p></div>`
		+ `<button class="jtool-iconbtn" type="button" data-remove-kid="${i}" aria-label="מחיקת ילד/ה ${i + 1}">✕</button></li>`;
}

export function renderForm(reg, m) {
	const cs = reg.child_support;
	const n = names(m);
	const mode = ['calc', 'madad', 'nii'].includes(m.mode) ? m.mode : 'calc';
	const tabs = `<fieldset class="jtool-field jt16-modes"><legend>מה בודקים</legend><div class="jtool-chips">${chip('mode', 'calc', 'כמה מזונות', mode === 'calc')}${chip('mode', 'madad', 'עדכון הסכום למדד', mode === 'madad')}${chip('mode', 'nii', 'לא משלמים? ביטוח לאומי', mode === 'nii')}</div></fieldset>`;
	const calc = `<div data-if-mode="calc"${mode === 'calc' ? '' : ' hidden'}>`
		+ `<fieldset class="jtool-field"><legend>הורה א' הוא</legend><div class="jtool-chips">${chip('pa', 'אבא', 'אבא', n.A === 'אבא')}${chip('pa', 'אמא', 'אמא', n.A === 'אמא')}</div></fieldset>`
		+ `<div class="jtool-row">${moneyField('ia', `הכנסה נטו של ${n.A} (הורה א')`, m.incomeA, 'מכל המקורות, לחודש')}${moneyField('ib', `הכנסה נטו של ${n.B} (הורה ב')`, m.incomeB, 'מכל המקורות, לחודש')}</div>`
		+ `<div class="jtool-field"><span class="jtool-label" id="${P}-kids-l">הילדים</span><ul class="jtool-rep" aria-labelledby="${P}-kids-l" data-kids>${(m.children || []).map(kidRow).join('')}</ul><button class="jtool-linkbtn" type="button" data-add-kid>+ עוד ילד/ה</button><p class="jtool-error" id="${P}-children-e" role="alert"></p></div>`
		+ `<div class="jtool-field jt16-nights"><label class="jtool-label" for="${P}-na">לילות אצל ${esc(n.A)} מתוך 14</label><div class="jt6-stepper"><button class="jtool-iconbtn" type="button" data-step="na" data-delta="-1" aria-label="פחות לילות">−</button><input id="${P}-na" type="text" inputmode="numeric" autocomplete="off" value="${esc(v0(m.nightsA))}" aria-describedby="${P}-na-h ${P}-na-e"><button class="jtool-iconbtn" type="button" data-step="na" data-delta="1" aria-label="עוד לילות">+</button></div><p class="jtool-hint" id="${P}-na-h">סופי שבוע לסירוגין: 2-4; חלוקה שווה: 7</p><p class="jtool-error" id="${P}-na-e" role="alert"></p></div>`
		+ `<div class="jtool-row">${moneyField('ha', `דיור של ${n.A}`, m.housingA, 'שכירות או משכנתא, ועוד ארנונה ואחזקה')}${moneyField('hb', `דיור של ${n.B}`, m.housingB, 'שכירות או משכנתא, ועוד ארנונה ואחזקה')}</div>`
		+ `<details class="jtool-more"${v0(m.needsDependent) !== '' || v0(m.housingShare) !== '' ? ' open' : ''}><summary>הצרכים, המדור והדין (אומדן שאפשר לשנות)</summary>`
		+ `<p class="jtool-hint" style="margin-top:8px">${esc(cs.needs.estimate_he)}. ${esc(cs.needs.default_he)}.</p>`
		+ `<div class="jtool-row">${moneyField('nd', 'צרכים תלויי שהות, לילד', v0(m.needsDependent) === '' ? cs.needs.dependent : m.needsDependent, 'מזון, היגיינה, פנאי')}${moneyField('ni', 'צרכים שאינם תלויי שהות, לילד', v0(m.needsIndependent) === '' ? cs.needs.independent : m.needsIndependent, 'ביגוד, טלפון, ביטוחים')}</div>`
		+ `<div class="jtool-row">${moneyField('nn', 'מתוכם הכרחיים (עד גיל 6)', v0(m.necessary) === '' ? cs.needs.necessary : m.necessary, 'בע"מ 919/15, פסקה 22: כ-1,300 עד 1,400')}${textField('hs', 'חלק הילדים בכל בית, באחוזים', v0(m.housingShare) === '' ? '' : m.housingShare, '30 / 40 / 50', 'ריק: 30% לילד, 40% לשניים, 50% לשלושה ומעלה')}</div>`
		+ `<fieldset class="jtool-field"><legend>ההורה המרכז (פסקה 61(ב))</legend><div class="jtool-chips">${chip('ce', '', 'מי שהילדים אצלו יותר', !m.central)}${chip('ce', 'A', n.A, m.central === 'A')}${chip('ce', 'B', n.B, m.central === 'B')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>הדין</legend><div class="jtool-chips">${chip('law', 'jewish', 'הורים יהודים (דין אישי)', m.law !== 'proportional')}${chip('law', 'proportional', 'חלוקה יחסית בכל הגילים (סעיף 3א)', m.law === 'proportional')}</div></fieldset></details>`
		+ `<details class="jtool-more"${['education', 'health', 'childcare'].some((k) => v0(m.extras && m.extras[k]) !== '') ? ' open' : ''}><summary>הוצאות חינוך, בריאות ומעון (מחציות)</summary><div class="jtool-row" style="margin-top:8px">${moneyField('xe', 'חינוך וחוגים, לחודש', m.extras && m.extras.education)}${moneyField('xh', 'בריאות שלא בסל, לחודש', m.extras && m.extras.health)}</div><div class="jtool-row">${moneyField('xc', 'מעון או צהרון, לחודש', m.extras && m.extras.childcare)}<div></div></div></details>`
		+ `</div>`;
	const md = m.madad || {};
	const madad = `<div data-if-mode="madad"${mode === 'madad' ? '' : ' hidden'}>`
		+ `<div class="jtool-row">${moneyField('ma', 'הסכום החודשי שנקבע', md.amount)}${textField('mb', 'תאריך פסק הדין או ההסכם', md.base ? isoToHe(md.base) : '', 'לדוגמה: 10.2.2023', 'המדד הבסיסי הוא המדד הידוע ביום הזה')}</div>`
		+ `<fieldset class="jtool-field"><legend>כל כמה חודשים מעדכנים</legend><div class="jtool-chips">${[3, 6, 12].map((k) => chip('mev', String(k), k === 3 ? 'כל 3 חודשים' : k === 6 ? 'כל חצי שנה' : 'פעם בשנה', Number(md.every || cs.indexation.every_months) === k)).join('')}</div><p class="jtool-hint">${esc(cs.indexation.form_he)}.</p></fieldset></div>`;
	const nn = m.nii || {};
	const nii = `<div data-if-mode="nii"${mode === 'nii' ? '' : ' hidden'}>`
		+ `<p class="jtool-hint">מספר הילדים לפי הרשימה בלשונית "כמה מזונות" (${(m.children || []).length}).</p>`
		+ `<div class="jtool-chips">${chip('o55', '1', 'מקבלת הקצבה בת 55 ומעלה', nn.over55, 'checkbox')}${chip('rem', '1', 'נישאה שוב או חיה עם בן זוג', nn.remarried, 'checkbox')}</div>`
		+ `<div class="jtool-row">${moneyField('nj', 'הסכום שבפסק הדין (לא חובה)', nn.judgment)}<div></div></div></div>`;
	return tabs + calc + madad + nii;
}

/** Parent A's two shares: income and nights. The gap is the ratio method's engine. */
function shares(r, n) {
	const inc = Math.round(r.ratio.income * 100);
	const nights = Math.round(r.custody * 100);
	const bar = (label, pct, cls) => `<div class="jt16-share"><span class="jt16-share__l">${esc(label)}</span><span class="jt16-share__track"><i class="jt16-share__fill ${cls}" style="width:${pct}%"></i></span><bdi class="jt16-share__v">${pct}%</bdi></div>`;
	const strip = Array.from({ length: 14 }, (_, i) => `<i class="jt16-night${i < r.nightsA ? ' jt16-night--a' : ''}"></i>`).join('');
	return `<figure class="jt16-shares" aria-label="החלק של ${esc(n.A)} בהכנסות ובלילות">${bar(`${n.A}: חלק בהכנסות`, inc, 'jt16-share__fill--inc')}${bar(`${n.A}: חלק בלילות`, nights, 'jt16-share__fill--time')}`
		+ `<div class="jt16-strip" aria-hidden="true">${strip}</div><figcaption>${esc(`${r.nightsA} מתוך 14 לילות אצל ${n.A}. ${inc > nights ? `הפער, ${inc - nights} נקודות אחוז, הוא מה שמזיז כסף מ${n.A} ל${n.B}` : inc < nights ? `${n.A} נושא/ת יותר בזמן מאשר בהכנסה` : 'החלקים שווים'}.`)}</figcaption></figure>`;
}

export function verdictSentence(reg, r, m) {
	if (!r.ok) { return ''; }
	const n = names(m);
	if (!r.payer) { return `השיטות חלוקות בכיוון: בין ${r.low < 0 ? `${n.B} משלם/ת ${nis(-r.low)}` : nis(r.low)} ל-${r.high > 0 ? `${n.A} משלם/ת ${nis(r.high)}` : nis(r.high)}. לרוב אין העברה, או העברה קטנה.`; }
	const payer = n[r.payer];
	const payee = n[r.payee];
	return `${payer} משלם/ת ל${payee} ${nis(r.low)} עד ${nis(r.high)} לחודש, לכל הילדים יחד, לפי שיטות החישוב שבפסיקה אחרי בע"מ 919/15. הוצאות חינוך ובריאות מתחלקות לפי יחס ההכנסות: ${Math.round(r.ratio.income * 100)}% על ${n.A}.`;
}

function madadSentence(x) {
	return x.ok ? `${nis(x.amount)} מ-${isoToHe(x.base)}, צמוד למדד ומעודכן כל ${x.every} חודשים: היום ${nis(x.current)} (עדכון אחרון ב-${isoToHe(x.lastUpdate)} לפי מדד ${x.lastMonth.split('-').reverse().map(Number).join('.')}; העדכון הבא ב-${isoToHe(x.next)}).` : '';
}

export function renderResult(reg, m, r, opts = {}) {
	const cs = reg.child_support;
	const n = names(m);
	const errorBox = (errs) => `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${errs.map((e) => esc(e.he)).join(' ')}</p></div>`;
	if (m.mode === 'madad') {
		const x = r;
		if (!x.ok) { return errorBox(x.errors); }
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי מדד המחירים לצרכן של הלמ"ס</p>`
			+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}הסכום המעודכן היום</p><strong class="jtool-verdict__figure">${ils(x.current, 0)}</strong>`
			+ `<p class="jtool-verdict__sentence">${esc(madadSentence(x))}</p><p class="jtool-scope">${esc(cs.indexation.he)}.</p></div>`;
	}
	if (m.mode === 'nii') {
		const x = r;
		if (!x.ok) { return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--info">אין זכאות לפי מה שסימנתם</p><p class="jtool-verdict__sentence">${x.errors.map((e) => esc(e.he)).join(' ')}.</p></div>`; }
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי סכומי הביטוח הלאומי מ-${esc(isoToHe(cs.nii.from))}</p>`
			+ `<p class="jtool-verdict__label">${esc(x.row.he)}${m.nii && m.nii.over55 ? ', מגיל 55' : ''}</p><strong class="jtool-verdict__figure">${ils(x.amount, 0)}</strong>`
			+ `<p class="jtool-verdict__sentence">${esc(`כשמי שחייב לא משלם, הביטוח הלאומי משלם עד ${nis(x.table)} לחודש${x.lower ? `, ולכן את הסכום שבפסק הדין, ${nis(x.amount)}` : ''}. מלוא הסכום כשההכנסה עד ${nis(x.cap)}; מעל זה הוא פוחת.`)}</p><p class="jtool-scope">${esc(cs.nii.lower_he)}.</p></div>`;
	}
	if (!r.ok) { return errorBox(r.errors); }
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי בע"מ 919/15 והפסיקה שאחריו</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${r.payer ? `${esc(n[r.payer])} משלם/ת ל${esc(n[r.payee])}, לחודש` : 'כיוון התשלום לא ברור'}</p>`
		+ `<strong class="jtool-verdict__figure">${r.payer ? `${ils(r.low, 0)} – ${ils(r.high, 0)}` : 'אין העברה, או קטנה'}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r, m))}</p>`
		+ `<p class="jtool-scope">אומדן לפי השיטות שבפסיקה, לא פסק דין. הצרכים הם סכומים שנקבעו בתיקים אחרים, ואפשר לשנות אותם.</p></div>`
		+ shares(r, n)
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '');
}

/** What moves the number: the same family with one input changed. */
function sensitivity(reg, m, r) {
	const mid = (x) => (x.ok ? (x.payer === 'B' ? -1 : 1) * (x.low + x.high) / 2 : null);
	const base = mid(r);
	const n = names(m);
	const rows = [
		[`לילה אחד יותר אצל ${n.A} בשבועיים`, Object.assign({}, m, { nightsA: Math.min(14, Number(m.nightsA) + 1) })],
		[`הכנסה של ${n.A} גבוהה ב-1,000 ₪`, Object.assign({}, m, { incomeA: (Number(m.incomeA) || 0) + 1000 })],
		[`הכנסה של ${n.B} גבוהה ב-1,000 ₪`, Object.assign({}, m, { incomeB: (Number(m.incomeB) || 0) + 1000 })],
		['צרכים גבוהים ב-200 ₪ לילד', Object.assign({}, m, { needsDependent: (Number(v0(m.needsDependent) === '' ? reg.child_support.needs.dependent : m.needsDependent)) + 200 })],
	];
	return rows.map(([label, mm]) => {
		const x = computeSupport(reg, toSupportInput(mm));
		const d = mid(x) === null || base === null ? null : Math.round(mid(x) - base);
		return { label, delta: d };
	});
}

export function renderDetails(reg, m, r) {
	const cs = reg.child_support;
	const n = names(m);
	if (m.mode === 'madad') {
		if (!r.ok) { return ''; }
		return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-up-h">העדכונים האחרונים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">העדכון הבא ביומן (.ics)</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-up-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">יום העדכון</th><th scope="col">המדד הידוע</th><th scope="col">מקדם</th><th scope="col">הסכום</th></tr></thead><tbody>`
			+ `<tr><td data-th="יום העדכון"><bdi>${isoToHe(r.base)}</bdi> (בסיס)</td><td data-th="המדד הידוע">${esc(r.baseMonth.split('-').reverse().map(Number).join('.'))}: <bdi>${esc(String(r.baseIndex))}</bdi></td><td data-th="מקדם"><bdi>1</bdi></td><td data-th="הסכום">${ils(r.amount)}</td></tr>`
			+ r.updates.map((u) => `<tr><td data-th="יום העדכון"><bdi>${isoToHe(u.day)}</bdi></td><td data-th="המדד הידוע">${esc(u.month.split('-').reverse().map(Number).join('.'))}: <bdi>${esc(String(u.index))}</bdi>${u.stale ? ' (המדד האחרון שבידינו)' : ''}</td><td data-th="מקדם"><bdi>${esc(u.factor.toFixed(4))}</bdi></td><td data-th="הסכום">${ils(u.amount)}</td></tr>`).join('')
			+ `</tbody><caption>המקדם הוא היחס בין המדד הידוע ביום העדכון למדד הידוע ביום הבסיס, כולל מקדמי הקישור של הלמ"ס בין בסיסים. המדד מתפרסם ב-15 בחודש. ${esc(cs.indexation.he)}.</caption></table></div></div>`;
	}
	if (m.mode === 'nii') {
		const ni = cs.nii;
		return niiTable(reg, r.key, `${P}-nii-h`)
			+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3>התנאים</h3></div><ol class="jtool-steps"><li>${esc(ni.conditions_he)}.${cite('תנאי זכאות', ni.sources[1].url)}</li><li>${esc(ni.lower_he)}.${cite('סעיף 3', ni.law_url)}</li><li>${esc(cs.collection.he)}.${cite('טופס 207', cs.collection.url)}</li></ol></div>`;
	}
	if (!r.ok) { return ''; }
	const meth = cs.methods;
	const pc = r.perChild.map((c, i) => {
		const label = c.bracket === 'under6' ? 'עד גיל 6' : c.bracket === 'under6-shared' ? 'עד גיל 6, חלוקה יחסית' : c.bracket === '6to15' ? '6 עד 15' : '15 עד 18';
		const val = c.method === 'father'
			? `בלי קיזוז ${nis(Math.abs(c.values.fatherHigh))}; עם קיזוז מה שהאב מוציא בעין ${nis(Math.abs(c.values.fatherLow))}`
			: `שיטת היחסים ${nis(c.values.ratio)}; ברירת המחדל של פסקה 61 ${nis(c.values.para61)}`;
		const src = c.method === 'father' ? cite(cs.ruling.paras.under6, cs.ruling.url) : `${cite('פסקה 61', meth.para61.url)}${cite('שיטת היחסים (עותק)', meth.ratio.url)}`;
		return `<tr><td data-th="ילד/ה">${i + 1} (בן/בת <bdi>${c.age}</bdi>)</td><td data-th="קבוצת גיל">${esc(label)}</td><td data-th="החישוב">${esc(val)}</td><td data-th="מקור">${src}</td></tr>`;
	}).join('');
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-kids-h">כל ילד, לפי הגיל והשיטה</h3></div><div class="jtool-scroll" role="region" aria-labelledby="${P}-kids-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">ילד/ה</th><th scope="col">קבוצת גיל</th><th scope="col">החישוב</th><th scope="col">מקור</th></tr></thead><tbody>${pc}</tbody>`
		+ `<caption>יחס ההכנסות ${Math.round(r.ratio.income * 100)}% / ${100 - Math.round(r.ratio.income * 100)}%; ההכנסה הפנויה (אחרי החלק של ההורה בדיור שלו) ${Math.round(r.ratio.disposable * 100)}% / ${100 - Math.round(r.ratio.disposable * 100)}%; מדור: ${Math.round(r.housingShare * 100)}% מכל בית, ${nis(r.housing.A)} אצל ${esc(n.A)} ו-${nis(r.housing.B)} אצל ${esc(n.B)}. הסכום החיובי: ${esc(n.A)} משלם/ת.</caption></table></div></div>`;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-yrs-h">לאורך השנים</h3></div><div class="jtool-scroll" role="region" aria-labelledby="${P}-yrs-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתאריך</th><th scope="col">עד תאריך</th><th scope="col">גילים</th><th scope="col">אומדן חודשי</th></tr></thead><tbody>`
		+ r.periods.map((x) => `<tr><td data-th="מתאריך"><bdi>${isoToHe(x.from)}</bdi></td><td data-th="עד תאריך">${x.to ? `<bdi>${isoToHe(x.to)}</bdi>` : '—'}</td><td data-th="גילים"><bdi>${esc(x.ages.join(', '))}</bdi></td><td data-th="אומדן חודשי">${x.payer ? `${esc(n[x.payer])} משלם/ת ${esc(nis(x.low))} עד ${esc(nis(x.high))}` : 'כיוון לא ברור'}</td></tr>`).join('')
		+ r.service.map((s) => `<tr class="jtool-muted"><td data-th="מתאריך"><bdi>${isoToHe(s.from)}</bdi></td><td data-th="עד תאריך">סוף השירות</td><td data-th="גילים">ילד/ה ${s.idx + 1}, שירות חובה</td><td data-th="אומדן חודשי">שליש: ${esc(nis(s.low))} עד ${esc(nis(s.high))}</td></tr>`).join('')
		+ `</tbody><caption>הסכום משתנה ביום ההולדת ה-6, ה-15 וה-18. ${esc(cs.service.he)}.${cite(cs.service.source_he, cs.service.url)}</caption></table></div></div>`;
	if (r.extras.total > 0) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-ex-h">הוצאות חינוך, בריאות ומעון</h3></div><div class="jt7-scns jt10-fees"><div class="jt7-scn"><p>סך ההוצאות לחודש</p><strong>${ils(r.extras.total, 0)}</strong><small>חינוך ${nis(r.extras.education)}, בריאות ${nis(r.extras.health)}, מעון ${nis(r.extras.childcare)}</small></div><div class="jt7-scn"><p>${esc(n.A)}</p><strong>${ils(r.extras.split.A, 0)}</strong><small>${Math.round(r.ratio.income * 100)}% לפי ההכנסות</small></div><div class="jt7-scn"><p>${esc(n.B)}</p><strong>${ils(r.extras.split.B, 0)}</strong><small>${100 - Math.round(r.ratio.income * 100)}%</small></div></div><p class="jt7-scns__note">הוצאות חריגות מתחלקות לפי כושר ההשתכרות (בע"מ 919/15, חוות דעת השופטת ברק-ארז, פסקה 61(ג)).</p></div>`;
	}
	const sens = sensitivity(reg, m, r);
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-sens-h">מה מזיז את הסכום</h3></div><ul class="jtool-notes">${sens.map((s) => `<li>${esc(s.label)}: ${s.delta === null ? '—' : s.delta === 0 ? 'בלי שינוי' : `${s.delta > 0 ? 'עוד' : 'פחות'} ${esc(nis(Math.abs(s.delta)))} באמצע הטווח`}</li>`).join('')}</ul></div>`;
	const d = cs.deadlines;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">מועדים ושינוי הסכום</h3></div><ol class="jtool-steps">`
		+ `<li>${esc(d.appeal_he)}.${cite(d.appeal_source_he, d.appeal_url)}</li>`
		+ `<li>${esc(d.leave_he)}.</li>`
		+ `<li>${esc(d.change_he)}.${cite('סעיף 13', cs.law.url)}</li>`
		+ `<li>${esc(d.late_he)}.${cite('סעיף 11', cs.law.url)}</li>`
		+ `<li>${esc(d.interim_he)}.${cite('סעיף 10', cs.law.url)} ${esc(d.from_filing_he)}.</li>`
		+ `<li>${esc(cs.rabbinical_he)}.${cite('תיק 1163727/2', cs.rabbinical_url)}</li></ol></div>`;
	out += needsTable(reg, `${P}-cases-h`);
	return out;
}

/** The National Insurance amounts by family (also the [justice_tool_section part="nii"] table). */
export function niiTable(reg, key, hid) {
	const ni = reg.child_support.nii;
	return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${hid}">הביטוח הלאומי: כמה משלם, לפי המשפחה</h3></div><div class="jtool-scroll" role="region" aria-labelledby="${hid}" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">המשפחה</th><th scope="col">עד גיל 55</th><th scope="col">מגיל 55</th><th scope="col">מלוא הסכום עד הכנסה של</th></tr></thead><tbody>`
		+ ni.rows.map((x) => `<tr${key === x.key ? ' class="jtool-table__total"' : ''}><td data-th="המשפחה">${esc(x.he)}</td><td data-th="עד גיל 55">${ils(x.under55, 0)}</td><td data-th="מגיל 55">${x.over55 === null ? '—' : ils(x.over55, 0)}</td><td data-th="מלוא הסכום עד הכנסה של">${ils(x.cap_under55, 0)}${x.cap_over55 ? ` / ${ils(x.cap_over55, 0)}` : ''}</td></tr>`).join('')
		+ `</tbody><caption>בתוקף מ-${esc(isoToHe(ni.from))}. ${esc(ni.cap_he)}. ${esc(ni.health_he)}.${cite('ביטוח לאומי', ni.url)}</caption></table></div></div>`;
}

/** The needs courts set, judgment by judgment (also the [justice_tool_section part="needs"] table). */
export function needsTable(reg, hid) {
	const cs = reg.child_support;
	return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${hid}">צרכים שבתי המשפט קבעו (אומדן)</h3></div><div class="jtool-scroll" role="region" aria-labelledby="${hid}" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">פסק הדין</th><th scope="col">צרכים לילד, בלי מדור</th><th scope="col">מדור</th></tr></thead><tbody>`
		+ cs.needs.cases.map((c) => `<tr><td data-th="פסק הדין">${cite(`${c.he} (${isoToHe(c.date)})`, c.url)}</td><td data-th="צרכים לילד, בלי מדור">${ils(c.total, 0)}${c.dependent ? ` (${nis(c.dependent)} תלויי שהות, ${nis(c.independent)} לא)` : ''}${c.necessary ? `; הכרחיים ${nis(c.necessary)}` : ''}</td><td data-th="מדור">${esc(c.housing_he || '—')}</td></tr>`).join('')
		+ `</tbody><caption>${esc(cs.needs.supreme_he)}. ${esc(cs.needs.estimate_he)}.</caption></table></div></div>`;
}

/** The figure in the sticky bar, for the server snapshot and for every recalculation. */
export function stickyFigure(m, r) {
	if (m.mode === 'madad') { return r.ok ? ils(r.current, 0) : '—'; }
	if (m.mode === 'nii') { return r.ok === false ? '—' : ils(r.amount, 0); }
	return r.ok && r.payer ? `${ils(r.low, 0)}–${ils(r.high, 0)}` : '—';
}

/** Page section: "how much for 1, 2, 3 children" (the most searched question), from the same engine. */
export function compareTable(reg) {
	const kidsSets = [['2016-01-01'], ['2016-01-01', '2014-01-01'], ['2016-01-01', '2014-01-01', '2012-01-01']];
	const nights = [2, 4, 7];
	const on = reg.child_support.checked_on;
	const ages = kidsSets[2].map((b) => mzAgeOn(b, on)).sort((a, b) => a - b);
	const head = nights.map((x) => `<th scope="col">${x === 7 ? 'חלוקה שווה (7 מ-14)' : `${x} לילות מ-14 אצל האב`}</th>`).join('');
	const rows = kidsSets.map((kids) => {
		const cells = nights.map((nA) => {
			const r = computeSupport(reg, { incomeA: 12000, incomeB: 8000, housingA: 4500, housingB: 4500, children: kids, nightsA: nA, father: 'A', law: 'jewish', asOf: on });
			return `<td data-th="${nA} לילות">${r.ok && r.payer ? `${esc(nis(r.low))} עד ${esc(nis(r.high))}` : 'אין העברה או קטנה'}</td>`;
		}).join('');
		return `<tr><td data-th="ילדים">${kids.length === 1 ? 'ילד אחד' : `${kids.length} ילדים`}</td>${cells}</tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>כמה האב משלם לחודש: הכנסות נטו 12,000 ₪ (אב) ו-8,000 ₪ (אם), דיור 4,500 ₪ בכל בית, ילדים בני ${ages[0]}, ${ages[1]} ו-${ages[2]} ביום החישוב. אומדן מאותו מנוע של הכלי.</caption><thead><tr><th scope="col">ילדים</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the rules and amounts, each with its source (the "numbers" part). */
export function numbersTable(reg) {
	const cs = reg.child_support;
	const r = cs.ruling;
	const years = cs.needs.cases.map((c) => Number(c.date.slice(0, 4)));
	const two = cs.nii.rows.find((x) => x.key === 'woman2');
	const rows = [
		['מלידה עד גיל 6', 'אב יהודי חב לבדו בצרכים ההכרחיים, גם כשמצבו הכלכלי רע; מעבר להכרחי, לפי יחס ההכנסות', cite(r.paras.under6, r.url)],
		['גילאי 6 עד 15', 'שני ההורים, לפי היכולת הכלכלית היחסית מכל המקורות ולפי חלוקת המשמורת בפועל', cite('ההכרעה', r.url)],
		['גילאי 15 עד 18', 'מדין צדקה, על שני ההורים במידה שווה', cite(r.paras.over15, r.url)],
		['משמורת משותפת', 'הוצאות שוטפות ומדור בעין; הורה מרכז לשאר הצרכים; הוצאות חריגות לפי כושר ההשתכרות', cite(r.paras.default61, r.url)],
		['צרכים הכרחיים', 'כ-1,300 עד 1,400 ש"ח לילד, כפי שתיאר העליון את הנוהג', cite(r.paras.needs, r.url)],
		[`צרכים שנקבעו בפסקי דין ${Math.min(...years)}-${Math.max(...years)}`, `${money(Math.min(...cs.needs.cases.map((c) => c.total)), 0)} עד ${money(Math.max(...cs.needs.cases.map((c) => c.total)), 0)} ש"ח לילד בלי מדור (אומדן)`, cite('פסקי הדין בטבלה', cs.needs.cases[0].url)],
		['חלק הילדים במדור', '30% לילד, 40% לשניים; כשליש עד מחצית', cite('תלה"מ 73366-01-23', cs.housing.url) + cite(r.paras.needs, r.url)],
		['שירות חובה', 'שליש מהסכום שערב השירות, מגיל 18 או סיום התיכון', cite('תלה"מ 17791-01-22', cs.service.url)],
		['הצמדה למדד', 'לפי פסק הדין: כל 3, 6 או 12 חודשים', cite('תמ"ש 45117-02-24', cs.indexation.sources[0].url) + cite('תיק 1465673/1', cs.indexation.sources[1].url)],
		['שינוי מזונות', 'בשינוי נסיבות; לא לפני חצי שנה מבקשה קודמת (שיקול דעת)', cite('סעיף 13', cs.law.url)],
		['ערעור', `${cs.deadlines.appeal_days} ימים מהמצאת פסק הדין`, cite('תקנה 45', cs.deadlines.appeal_url)],
		['ביטוח לאומי, אישה עם 2 ילדים', `${money(two.under55, 0)} ש"ח (מגיל 55: ${money(two.over55, 0)})`, cite('ביטוח לאומי', cs.nii.url)],
	];
	return `<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>מזונות ילדים: הכללים והסכומים, כל שורה עם המקור</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map(([a, b, c]) => `<tr><td data-th="מה">${esc(a)}</td><td data-th="הכלל">${esc(b)}</td><td data-th="מקור">${c}</td></tr>`).join('')
		+ `</tbody></table></div><p class="jtool-updated">נבדק מול פסק הדין באתר בית המשפט העליון, פסקי הדין שפורסמו ב-gov.il, נבו והביטוח הלאומי ב-${esc(isoToHe(cs.checked_on))}.</p></div>`;
}

function madadOf(reg, m) { return indexSupport(reg, Object.assign({}, m.madad, { asOf: m.asOf })); }
function niiOf(reg, m) { return mzNii(reg, Object.assign({ children: (m.children || []).length }, m.nii)); }
export function runModel(reg, m) {
	if (m.mode === 'madad') { return madadOf(reg, m); }
	if (m.mode === 'nii') { return niiOf(reg, m); }
	return computeSupport(reg, toSupportInput(m));
}

export function snapshot(reg) {
	const on = reg.child_support.checked_on;
	const m = Object.assign({}, EXAMPLE, { asOf: on });
	const r = runModel(reg, m);
	const mm = Object.assign({}, EXAMPLE_MADAD, { asOf: on });
	const x = runModel(reg, mm);
	const n = names(m);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.ok ? r.high : 0,
		form: renderForm(reg, m),
		result: renderResult(reg, m, r, { example: true }),
		details: renderDetails(reg, m, r),
		method: `<ol><li>יחס ההכנסות מכל המקורות: ${esc(n.A)} ${nis(m.incomeA)}, ${esc(n.B)} ${nis(m.incomeB)}, כלומר ${Math.round(r.ratio.income * 100)}%.${cite('בע"מ 919/15, ההכרעה', reg.child_support.ruling.url)}</li>`
			+ `<li>זמני השהות: ${m.nightsA} לילות מתוך 14 אצל ${esc(n.A)} (${Math.round(r.custody * 100)}%).</li>`
			+ `<li>מדור: ${Math.round(r.housingShare * 100)}% מעלות כל בית הם חלק הילדים: ${nis(r.housing.A)} ו-${nis(r.housing.B)}.${cite('פסקה 22', reg.child_support.ruling.url)}</li>`
			+ `<li>צרכים לילד: ${nis(r.needs.dependent)} תלויי שהות ו-${nis(r.needs.independent)} שאינם (אומדן מפסיקה), מתוכם ${nis(r.necessary)} הכרחיים.</li>`
			+ r.perChild.map((c, i) => `<li>ילד/ה ${i + 1}, בן/בת ${c.age}: ${c.method === 'father' ? `עד גיל 6 האב חב לבדו בהכרחי; ${nis(Math.abs(c.values.fatherLow))} עד ${nis(Math.abs(c.values.fatherHigh))}` : `שיטת היחסים ${nis(c.values.ratio)}, פסקה 61 ${nis(c.values.para61)}`}.</li>`).join('')
			+ `<li>הטווח: ${esc(n[r.payer] || '')} משלם/ת ${nis(r.low)} עד ${nis(r.high)} לחודש.</li></ol>`,
		compare_table: compareTable(reg),
		numbers: numbersTable(reg),
		nii_table: `<div class="jtool-page">${niiTable(reg, '', 'jt16-niis-h')}</div>`,
		needs_table: `<div class="jtool-page">${needsTable(reg, 'jt16-needs-h')}</div>`,
		sticky: stickyFigure(m, r),
		sentence: verdictSentence(reg, r, m),
		madad: {
			input: EXAMPLE_MADAD, total: x.ok ? x.current : 0, sticky: stickyFigure(mm, x),
			form: renderForm(reg, mm), result: renderResult(reg, mm, x, { example: true }), details: renderDetails(reg, mm, x),
			method: `<ol><li>המדד הבסיסי: המדד הידוע ביום פסק הדין או ההסכם (מתפרסם ב-15 בחודש).</li><li>בכל יום עדכון: הסכום כפול המדד הידוע באותו יום, חלקי המדד הבסיסי.</li><li>בין העדכונים הסכום קבוע. דוגמה: ${esc(madadSentence(x))}</li></ol>`,
			sentence: madadSentence(x),
		},
	};
}

/* ---------------- Browser ---------------- */

function readModel(root, prev) {
	const val = (id) => ((root.querySelector(`#${P}-${id}`) || {}).value || '').trim();
	const m$ = (id) => { const v = val(id); return v === '' ? '' : parseMoney(v); };
	const d$ = (id) => { const v = val(id); return v === '' ? '' : (parseDate(v) || v); };
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	const kids = [...root.querySelectorAll('[data-kid] input')].map((i) => { const v = i.value.trim(); return v === '' ? '' : (parseDate(v) || v); });
	const hs = val('hs').replace('%', '');
	const na = val('na');
	return {
		mode: checked('mode') || 'calc', parentA: checked('pa') || 'אבא', law: checked('law') || 'jewish',
		incomeA: m$('ia'), incomeB: m$('ib'), housingA: m$('ha'), housingB: m$('hb'), children: kids.filter((k) => k !== ''),
		nightsA: na === '' ? '' : (/^\d+$/.test(na) ? Number(na) : NaN), needsDependent: m$('nd'), needsIndependent: m$('ni'), necessary: m$('nn'),
		housingShare: hs === '' ? '' : Number(hs), central: checked('ce') || '',
		extras: { education: m$('xe'), health: m$('xh'), childcare: m$('xc') },
		madad: { amount: m$('ma'), base: d$('mb'), every: Number(checked('mev') || 3) },
		nii: { over55: Boolean(checked('o55')), remarried: Boolean(checked('rem')), judgment: m$('nj') },
		asOf: prev.asOf,
	};
}

/* Share link: amounts, dates of birth and choices only; no names. */
const MODES = { calc: 'c', madad: 'm', nii: 'n' };
/** An override whose blank means "use the default": blank travels as -1, so an explicit 0 (e.g. a 0% housing share) survives. */
const ov = (v) => (v === '' || v === undefined || v === null ? -1 : v);
export const stateOf = (m) => encodeState({
	o: MODES[m.mode] || 'c', p: m.parentA === 'אמא' ? 'm' : '', l: m.law === 'proportional' ? 'p' : '',
	i: [[m.incomeA || 0, m.incomeB || 0], [m.housingA || 0, m.housingB || 0]], k: (m.children || []).map((b) => [String(b).replace(/-/g, ''), 0]),
	n: m.nightsA, d: [[ov(m.needsDependent), ov(m.needsIndependent)], [ov(m.necessary), ov(m.housingShare)]], c: m.central,
	x: [[m.extras.education || 0, m.extras.health || 0], [m.extras.childcare || 0, 0]],
	a: [[m.madad.amount || 0, String(m.madad.base || '').replace(/-/g, '')], [m.madad.every || 3, 0]],
	b: [[m.nii.over55 ? 1 : 0, m.nii.remarried ? 1 : 0], [ov(m.nii.judgment), 0]],
});
const KEYS = ['o', 'p', 'l', 'i', 'k', 'n', 'd', 'c', 'x', 'a', 'b'];
const ymd = (x) => (/^\d{8}$/.test(x) ? `${x.slice(0, 4)}-${x.slice(4, 6)}-${x.slice(6, 8)}` : '');
export function modelOf(s) {
	if (!s.o || !s.i) { return null; }
	const pairs = (t) => String(t || '').split('~').filter(Boolean).map((x) => x.split('_'));
	const z = (x) => (x === undefined || x === '' || x === '0' ? '' : Number(x));
	const zo = (x) => (x === undefined || x === '' || x === '-1' ? '' : Number(x));
	const i = pairs(s.i); const d = pairs(s.d); const x = pairs(s.x); const a = pairs(s.a); const b = pairs(s.b);
	return {
		mode: Object.keys(MODES).find((k) => MODES[k] === s.o) || 'calc', parentA: s.p === 'm' ? 'אמא' : 'אבא', law: s.l === 'p' ? 'proportional' : 'jewish',
		incomeA: z(i[0] && i[0][0]), incomeB: z(i[0] && i[0][1]), housingA: z(i[1] && i[1][0]), housingB: z(i[1] && i[1][1]),
		children: pairs(s.k).map((p) => ymd(p[0])).filter(Boolean), nightsA: s.n === undefined || s.n === '' ? 7 : Number(s.n),
		needsDependent: zo(d[0] && d[0][0]), needsIndependent: zo(d[0] && d[0][1]), necessary: zo(d[1] && d[1][0]), housingShare: zo(d[1] && d[1][1]),
		central: s.c === 'A' || s.c === 'B' ? s.c : '', extras: { education: z(x[0] && x[0][0]), health: z(x[0] && x[0][1]), childcare: z(x[1] && x[1][0]) },
		madad: { amount: z(a[0] && a[0][0]), base: ymd((a[0] && a[0][1]) || ''), every: Number((a[1] && a[1][0]) || 3) },
		nii: { over55: Boolean(b[0] && b[0][0] === '1'), remarried: Boolean(b[0] && b[0][1] === '1'), judgment: zo(b[1] && b[1][0]) },
	};
}


export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const cs = reg.child_support;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	let model = { asOf: today };
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(cs.checked_on, cs.refresh_every_days) || (cs.next_update && today >= cs.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהסכומים התעדכנו'); }
	}
	const ids = { incomeA: 'ia', incomeB: 'ib', housingA: 'ha', housingB: 'hb', nightsA: 'na', needsDependent: 'nd', needsIndependent: 'ni', necessary: 'nn', housingShare: 'hs', amount: 'ma', base: 'mb', 'extra-education': 'xe', 'extra-health': 'xh', 'extra-childcare': 'xc', children: 'children' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (!r || r.ok !== false || !r.errors) { return; }
		for (const e of r.errors) {
			const km = /^child-(\d+)$/.exec(e.field);
			const id = km ? `kid-${km[1]}` : ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const mode = (root.querySelector(`input[name="${P}-mode"]:checked`) || {}).value || 'calc';
		form.querySelectorAll('[data-if-mode]').forEach((el) => { el.hidden = el.getAttribute('data-if-mode') !== mode; });
	};
	const run = (m, opts = {}) => {
		model = m;
		const r = runModel(reg, m);
		showErrors(r);
		result.innerHTML = renderResult(reg, m, r);
		details.innerHTML = renderDetails(reg, m, r);
		if (sticky) { sticky.innerHTML = stickyFigure(m, r); }
		if (!opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: m.mode === 'calc' ? (r.ok ? (r.payer ? 'pays' : 'none') : 'error') : m.mode }); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readModel(root, model)); }, 160);
	};
	// A live page: today is the day of the estimate. The mode the page asked for opens first.
	const startMode = root.getAttribute('data-jtool-mode') === 'madad' ? 'madad' : 'calc';
	const fromHash = modelOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		fromHash.asOf = today;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	} else {
		const m = readModel(root, { asOf: today });
		m.mode = startMode;
		run(m, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const nn = root.querySelector('[data-jtool-saved]'); if (nn) { nn.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const step = ev.target.closest('[data-step]');
		if (step) {
			const f = root.querySelector(`#${P}-${step.getAttribute('data-step')}`);
			const v = Math.max(0, Math.min(14, (Number(f.value) || 0) + Number(step.getAttribute('data-delta'))));
			f.value = String(v);
			schedule();
			return;
		}
		const add = ev.target.closest('[data-add-kid]');
		const rm = ev.target.closest('[data-remove-kid]');
		if (add || rm) {
			const m = readModel(root, model);
			const kids = [...root.querySelectorAll('[data-kid] input')].map((i) => { const v = i.value.trim(); return v === '' ? '' : (parseDate(v) || v); });
			if (add && kids.length < cs.max_children) { kids.push(''); }
			if (rm) { kids.splice(Number(rm.getAttribute('data-remove-kid')), 1); }
			m.children = kids;
			form.innerHTML = renderForm(reg, m);
			sync();
			run(Object.assign({}, m, { children: kids.filter((k) => k !== '') }));
			if (add) { const last = form.querySelector('[data-kid]:last-child input'); if (last) { last.focus(); } }
			return;
		}
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		const m = readModel(root, model);
		const r = run(m, { silent: true });
		const link = shareUrl(stateOf(m));
		const sentence = m.mode === 'madad' ? madadSentence(r) : m.mode === 'nii' ? `הביטוח הלאומי משלם עד ${nis(r.table)} לחודש (${r.row.he}).` : verdictSentence(reg, r, m);
		if (act === 'ics' && m.mode === 'madad' && r.ok) {
			download('mezonot-madad.ics', 'text/calendar;charset=utf-8', ics([{ date: r.next, summary: 'מזונות: עדכון הסכום למדד', description: `הסכום עכשיו ${money(r.current, 2)} ש"ח. חשבו מחדש ב-jus-tice.co.il.` }], new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו סכומים ותאריכי לידה בלבד, בלי שמות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && (r.ok !== false)) {
			window.open(whatsappUrl(`${sentence} · חושב ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && (r.ok !== false)) {
			const ok = await copyText(`${sentence} (חושב ב-jus-tice.co.il, ${isoToHe(cs.checked_on)}. מידע כללי, לא ייעוץ משפטי.)`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: m.mode });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(m));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = modelOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { s.asOf = today; form.innerHTML = renderForm(reg, s); sync(); run(s); }
		} else if (act === 'clear') {
			store.clear(saveKey);
			toast(root, 'נמחק מהמכשיר.');
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
