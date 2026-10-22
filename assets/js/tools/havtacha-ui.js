/**
 * The rights wave 2B UI (21.10.2026): income support (havtachat-hachnasa). Two pictures from the claims officer's own desk:
 * the gate ladder (one rung per condition of the law: residence, age, the employment test, the exclusions, the car, the
 * assets and the income test; a rung that holds is drawn whole, a rung that fails is broken, a rung to check is dashed),
 * and the income staircase (a column per step of work income: the income at the bottom, the benefit on top, the lines
 * where the first disregard ends, where the single parent's band ends, where the determining amount takes over from 55
 * and where the benefit ends), so "every extra shekel of work: how much stays" is visible. The tables, the checklist and
 * the .ics say the same in text. The result-first card ([justice_tool_lead]) carries the monthly benefit (or the failing gate)
 * on the first screen, and the rehearse link hands the reader's figures to the jus-tice.com simulation (sim-handoff.js, the
 * wave-2A bar, HAD-585).
 */
import { compute, monthHe, FAMS, EMPS, CARS, EXCLS, RESS } from './havtacha-engine.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'havtachat-hachnasa';
const P = 'jt53';

const BASE = { fam: 'single', kids: 0, age: '', sex: '', born: '', spouseAge: '', emp: 'registered', spouseEmp: 'registered', work: '', spouseWork: '', pension: '', other: '', car: 'none', carValue: '', carEx: false, savings: '', realty: false, res: 'yes', excl: 'none', month: '2026-11', decision: '', hearing: '' };
export const EXAMPLE = Object.assign({}, BASE, { fam: 'parent', kids: 2, age: 34, work: 3000 });
/** One click, a whole profile: the quick chips above the form. */
export const PROFILES = [
	{ he: 'יחידה בת 40 בלי הכנסה', input: Object.assign({}, BASE, { fam: 'single', age: 40, sex: 'f' }) },
	{ he: 'הורה יחיד עם 2 ילדים, עובד 3,000 ₪', input: EXAMPLE },
	{ he: 'זוג עם 3 ילדים, אחד עובד', input: Object.assign({}, BASE, { fam: 'couple', kids: 3, age: 38, spouseAge: 36, emp: 'fulltime', work: 4500 }) },
	{ he: 'בן 57, דורש עבודה', input: Object.assign({}, BASE, { fam: 'single', age: 57, sex: 'm' }) },
	{ he: 'זוג צעיר, בני 22 ו-23', input: Object.assign({}, BASE, { fam: 'couple', age: 22, spouseAge: 23 }) },
];

const MARK = { bad: '✕', warn: '!', info: 'i' };
const STATE = { ok: '✓', check: '!', no: '✕', route: 'i' };
const STATE_HE = { ok: 'עובר', check: 'לבדיקה', no: 'נכשל', route: 'מסלול אחר' };
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const m2 = (n) => money(n, Math.round(n * 100) % 100 ? 2 : 0);
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}"${href.charAt(0) === '/' ? '' : ' target="_blank" rel="noopener"'}>${esc(text)}</a>` : '');
const KIND_HE = { single: 'יחיד', couple: 'זוג', couple1: 'זוג עם ילד', couple2: 'זוג עם 2 ילדים ומעלה', parent1: 'הורה יחיד עם ילד', parent2: 'הורה יחיד עם 2 ילדים ומעלה' };
const GATE_HE = { res: 'תושבות', age: 'גיל', emp: 'מבחן התעסוקה', excl: 'לימודים, קיבוץ, צבא', car: 'רכב', assets: 'חסכונות ונכסים', income: 'מבחן ההכנסה' };
const ymHe = (ym) => (ym ? `${Number(ym.slice(5))}.${ym.slice(0, 4)}` : '');

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
function toYm(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{4})$/);
	return m ? `${m[2]}-${m[1].padStart(2, '0')}` : raw;
}
function groupHe(reg, r) {
	const ag = reg.rights_havtacha.age;
	return r.young ? `בני ${ag.min} עד ${ag.young_to} שמתייצבים` : r.col === 'c' ? `מגיל ${ag.older_from}` : `מתחת לגיל ${ag.older_from}`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const hv = reg.rights_havtacha;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const show = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : String(v));
	const field = (id, label, value, ph, mode = 'numeric') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="${mode}" autocomplete="off" value="${esc(value)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const moneyField = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(isNum(value) ? money(value, value % 1 ? 2 : 0) : show(value))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const fam = FAMS.includes(input.fam) ? input.fam : 'single';
	const kids = Math.min(Number(input.kids) || 0, 4);
	const age = Number(input.age);
	const emp = EMPS.includes(input.emp) ? input.emp : 'registered';
	const sEmp = EMPS.includes(input.spouseEmp) ? input.spouseEmp : 'registered';
	const car = CARS.includes(input.car) ? input.car : 'none';
	const res = RESS.includes(input.res) ? input.res : 'yes';
	const excl = EXCLS.includes(input.excl) ? input.excl : 'none';
	const empChips = (name, v) => `${chip(name, 'registered', 'רשום ומתייצב', v === 'registered')}${chip(name, 'fulltime', 'עובד 36 שעות ומעלה', v === 'fulltime')}${chip(name, 'exempt', 'בקבוצת פטור', v === 'exempt')}${chip(name, 'none', 'לא רשום ולא פטור', v === 'none')}`;
	const cr = hv.car;
	const profiles = `<div class="${P}-quick" role="group" aria-label="פרופילים מוכנים"><p class="${P}-quick__h">בלחיצה אחת:</p><div class="jtool-chips">${PROFILES.map((p, i) => `<button class="${P}-qchip" type="button" data-act="profile" data-profile="${i}">${esc(p.he)}</button>`).join('')}</div></div>`;
	return profiles
		+ `<fieldset class="jtool-field"><legend>מי במשפחה</legend><div class="jtool-chips">${chip('fam', 'single', 'יחיד, בלי ילדים', fam === 'single')}${chip('fam', 'couple', 'בני זוג', fam === 'couple')}${chip('fam', 'parent', 'הורה יחיד', fam === 'parent')}</div><p class="jtool-error" id="${P}-fam-e" role="alert"></p></fieldset>`
		+ `<fieldset class="jtool-field" data-if-kids${fam === 'single' ? ' hidden' : ''}><legend>ילדים</legend><div class="jtool-chips">${[0, 1, 2, 3, 4].map((n) => chip('kids', n, n === 4 ? '4 ומעלה' : String(n), kids === n)).join('')}</div><p class="jtool-hint">${esc(hv.amounts.child_he)}.</p><p class="jtool-error" id="${P}-kids-e" role="alert"></p></fieldset>`
		+ `<div class="jtool-row">${field('age', 'גיל', show(input.age), 'לדוגמה: 34')}<div data-if-couple${fam === 'couple' ? '' : ' hidden'}>${field('spouseAge', 'גיל בן או בת הזוג', show(input.spouseAge), 'לדוגמה: 36')}</div></div>`
		+ `<fieldset class="jtool-field" data-if-55${age >= hv.age.older_from ? '' : ' hidden'}><legend>מגיל ${hv.age.older_from}: גיל הפרישה ותוספת לאישה תלויים במין</legend><div class="jtool-chips">${chip('sex', 'm', 'גבר', input.sex === 'm')}${chip('sex', 'f', 'אישה', input.sex === 'f')}</div>`
		+ `<div data-if-born${input.sex === 'f' && age >= 60 ? '' : ' hidden'} style="margin-top:8px">${field('born', 'חודש הלידה (חודש.שנה)', ymHe(toYm(input.born)), 'לדוגמה: 3.1964')}<p class="jtool-hint">${esc(hv.age.women_he)}; ${esc(hv.women.he)}.</p></div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מבחן התעסוקה</legend><div class="jtool-chips">${empChips('emp', emp)}</div><p class="jtool-hint">${esc(hv.employment.he)}. ${esc(hv.employment.fulltime_he)}. קבוצות הפטור: ${esc(hv.employment.groups_he.join(', '))}.</p><p class="jtool-error" id="${P}-emp-e" role="alert"></p></fieldset>`
		+ `${moneyField('work', 'הכנסה חודשית מעבודה, ברוטו (0 אם אין)', input.work, 'לדוגמה: 3,000')}<p class="jtool-hint">${esc(hv.work.includes_he)}.</p>`
		+ `<div data-if-couple${fam === 'couple' ? '' : ' hidden'}><fieldset class="jtool-field"><legend>בן או בת הזוג מול שירות התעסוקה</legend><div class="jtool-chips">${empChips('semp', sEmp)}</div><p class="jtool-error" id="${P}-spouseEmp-e" role="alert"></p></fieldset>${moneyField('spouseWork', 'הכנסה חודשית מעבודה של בן או בת הזוג', input.spouseWork, '0')}</div>`
		+ `<details class="jtool-more"${(Number(input.pension) || 0) + (Number(input.other) || 0) > 0 ? ' open' : ''}><summary>פנסיה או הכנסה אחרת (מזונות, שכר דירה, קצבה)</summary><div style="margin-top:8px">${moneyField('pension', 'פנסיה מעבודה, בחודש (של המשפחה)', input.pension, '0')}<p class="jtool-hint">${esc(hv.work.pension_he)}.</p>${moneyField('other', 'הכנסה אחרת בחודש (של המשפחה)', input.other, '0')}<p class="jtool-hint">${esc(hv.other_income.he)}. ${esc(hv.other_income.excluded_he)}.</p></div></details>`
		+ `<details class="jtool-more"${car !== 'none' ? ' open' : ''}><summary>רכב או אופנוע</summary><div class="jtool-chips" style="margin-top:8px">${chip('car', 'none', 'אין', car === 'none')}${chip('car', 'one', 'רכב אחד', car === 'one')}${chip('car', 'two', 'שני רכבים', car === 'two')}</div>`
		+ `<div data-if-car${car === 'none' ? ' hidden' : ''} style="margin-top:8px">${moneyField('carValue', 'שווי הרכב לפי המחירון', input.carValue, `לדוגמה: 30,000`)}<p class="jtool-hint">${esc(cr.value_he)}. ${esc(cr.rule_he)}.</p>`
		+ `<div class="jtool-chips">${chip('carex', '1', 'מתקיים אחד החריגים', input.carEx === true, 'checkbox')}</div><p class="jtool-hint">החריגים: ${esc(cr.exceptions_he.join('; '))}.</p></div></details>`
		+ `<details class="jtool-more"${(Number(input.savings) || 0) > 0 || input.realty === true ? ' open' : ''}><summary>חסכונות ונכסים</summary><div style="margin-top:8px">${moneyField('savings', 'חסכונות ופיקדונות של המשפחה', input.savings, '0')}<div class="jtool-chips">${chip('realty', '1', 'יש נכס מקרקעין נוסף, חוץ מהדירה שגרים בה', input.realty === true, 'checkbox')}</div><p class="jtool-hint">${esc(hv.assets.he)}.</p></div></details>`
		+ `<details class="jtool-more"${res !== 'yes' || excl !== 'none' ? ' open' : ''}><summary>תושבות, לימודים, קיבוץ, צבא</summary><fieldset class="jtool-field" style="margin-top:8px"><legend>תושבות</legend><div class="jtool-chips">${chip('res', 'yes', `תושבים ${hv.residence.months} חודשים ומעלה`, res === 'yes')}${chip('res', 'new', `פחות מ-${hv.residence.months} חודשים`, res === 'new')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>האם אחד מאלה נכון לגביכם</legend><div class="jtool-chips">${chip('excl', 'none', 'אף אחד', excl === 'none')}${chip('excl', 'student', 'לומדים במוסד להשכלה גבוהה', excl === 'student')}${chip('excl', 'yeshiva', 'תלמיד ישיבה', excl === 'yeshiva')}${chip('excl', 'kibbutz', 'חבר קיבוץ או מושב שיתופי', excl === 'kibbutz')}${chip('excl', 'army', 'שירות סדיר (אתם או בן הזוג)', excl === 'army')}</div></fieldset></details>`
		+ `<fieldset class="jtool-field"><legend>המועדים (לא חובה)</legend><div class="jtool-row">${field('month', 'חודש הגשת התביעה (חודש.שנה)', ymHe(toYm(input.month)), 'לדוגמה: 11.2026')}${field('decision', 'היום שבו נמסרה החלטה', isoToHe(toIso(input.decision)), 'לדוגמה: 1.12.2026')}</div>`
		+ `${field('hearing', 'היום שבו הגיעה הודעה על שימוע', isoToHe(toIso(input.hearing)), 'לדוגמה: 1.12.2026')}<p class="jtool-hint">${esc(hv.clock.retro_he)}.</p></fieldset>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const hv = reg.rights_havtacha;
	if (r.route) { return `${hv.age.retirement_he} (טופס ${hv.claim.old_age_form}).`; }
	if (!r.eligible) {
		const g = r.gates.find((x) => x.state === 'no');
		return `אין זכאות להבטחת הכנסה לפי מה שהוזן. ${GATE_HE[g.key]}: ${g.he}.`;
	}
	const c = r.calc;
	if (r.conflict) { return `לפי תקנה 9 ההכנסה (${nis(r.W + r.pension + r.other)}) מגיעה לסכום הקובע (${nis(Math.round(r.det.amount * 100) / 100)}), ולכן אין תשלום; הטבלה של הביטוח הלאומי מראה קצבה חלקית עד הכנסה של ${nis(r.published)}. כדאי להגיש תביעה ולבקש את החישוב מפקיד התביעות.`; }
	const out = [`הבטחת הכנסה של ${nis(r.monthly)} בחודש (${KIND_HE[r.kind]}, ${groupHe(reg, r)}): הקצבה המלאה ${nis(c.full)}${c.income ? `, פחות ${nis(c.income)} הכנסה שנחשבת` : ''}${c.capBinds ? `, ולא יותר מהסכום הקובע פחות ההכנסה` : ''}${c.carDed ? `, פחות ${nis(c.carDed)} בגלל הרכב` : ''}.`];
	if (r.W > 0) { out.push(`עם ההכנסה מעבודה: ${nis(r.total)} לחודש, ומכל 100 ₪ נוספים נשארים ${r.keep} ₪${r.nextKeep && r.nextKeep.keep !== r.keep ? ` עד הכנסה של ${nis(r.nextKeep.from)}` : ''}.`); }
	if (r.verdict === 'check') { out.push(`לבדיקה: ${r.gates.filter((g) => g.state === 'check').map((g) => GATE_HE[g.key]).join(', ')}.`); }
	const fb = r.deadlines.find((d) => d.key === 'file_by');
	if (fb) { out.push(`להגיש עד ${isoToHe(fb.date)} כדי לקבל בעד ${monthHe(r.month)}.`); }
	return out.join(' ');
}

/** The gate ladder: one rung per condition of the law, whole, dashed or broken. */
function ladder(reg, r) {
	const rungs = r.gates.map((g) => `<li class="${P}-rung ${P}-rung--${g.state}"><span class="${P}-rung__bar" aria-hidden="true"><i></i><i></i></span><span class="${P}-rung__t"><strong>${esc(GATE_HE[g.key])}</strong><small>${esc(g.he)}</small></span><span class="${P}-rung__s"><b aria-hidden="true">${STATE[g.state]}</b> ${STATE_HE[g.state]}</span></li>`).join('');
	return `<figure class="${P}-lad"><figcaption class="${P}-lad__h">סולם התנאים: כל שלב שעובר מחזיק את הסולם, שלב שנכשל שובר אותו</figcaption><ol class="${P}-lad__rungs">${rungs}</ol></figure>`;
}

/** The income staircase: a column per step of work income, the income below and the benefit above, with the law's lines. */
function staircase(reg, r) {
	const bars = r.bars;
	if (!bars.length) { return ''; }
	const step = bars.length > 1 ? bars[1].w - bars[0].w : 500;
	const span = bars[bars.length - 1].w + step;
	const w = 360;
	const h = 180;
	const pad = 6;
	const top = 14;
	const bottom = 20;
	const yMax = Math.max(...bars.map((b) => b.w + b.pay)) * 1.08 || 1;
	const xv = (v) => w - pad - (v / span) * (w - 2 * pad);
	const y = (v) => top + (1 - v / yMax) * (h - top - bottom);
	const f = (v) => v.toFixed(1);
	let out = '';
	bars.forEach((b) => {
		const x0 = xv(b.w + step) + 1;
		const x1 = xv(b.w) - 1;
		const here = r.W >= b.w && r.W < b.w + step;
		if (b.w > 0) { out += `<rect class="${P}-ch__w" x="${f(x0)}" y="${f(y(b.w))}" width="${f(x1 - x0)}" height="${f(y(0) - y(b.w))}"></rect>`; }
		if (b.pay > 0) { out += `<rect class="${P}-ch__p${here ? ` ${P}-ch__p--here` : ''}" x="${f(x0)}" y="${f(y(b.w + b.pay))}" width="${f(x1 - x0)}" height="${f(y(b.w) - y(b.w + b.pay))}"></rect>`; }
	});
	const lines = [{ v: r.calc.first - r.calc.dP, k: 'first' }];
	if (r.kind.startsWith('parent')) { lines.push({ v: reg.rights_havtacha.work.parent.band, k: 'band' }); }
	if (r.capFrom !== null && r.capFrom !== undefined) { lines.push({ v: r.capFrom, k: 'cap' }); }
	if (r.end) { lines.push({ v: r.end, k: 'end' }); }
	lines.forEach((l) => { if (l.v > 0 && l.v < span) { out += `<line class="${P}-ch__l ${P}-ch__l--${l.k}" x1="${f(xv(l.v))}" x2="${f(xv(l.v))}" y1="${top}" y2="${f(y(0))}"></line>`; } });
	out += `<line class="${P}-ch__full" x1="${pad}" x2="${w - pad}" y1="${f(y(r.calc.full))}" y2="${f(y(r.calc.full))}"></line>`;
	if (r.W > 0 && r.W < span) { out += `<line class="${P}-ch__you" x1="${f(xv(r.W))}" x2="${f(xv(r.W))}" y1="${top - 6}" y2="${f(y(0))}"></line>`; }
	const tick = (v, anchor) => `<text class="${P}-ch__t" x="${f(xv(v))}" y="${h - 5}" text-anchor="${anchor}">${money(v, 0)}</text>`;
	const label = `ההכנסה מעבודה והקצבה בכל הכנסה מ-0 עד ${money(span - step, 0)} ₪: אצלכם ${money(r.W, 0)} ₪ הכנסה ועוד ${money(r.monthly, 0)} ₪ קצבה${r.end ? `; הקצבה נגמרת בהכנסה של ${money(r.end, 0)} ₪` : ''}`;
	return `<svg class="${P}-ch__svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><line class="${P}-ch__base" x1="${pad}" x2="${w - pad}" y1="${f(y(0))}" y2="${f(y(0))}"></line>${out}${tick(0, 'end')}${tick(span - step, 'start')}</svg>`;
}

function nextBlock(reg, r) {
	if (!r.next.length) { return ''; }
	return `<div class="${P}-next"><p class="${P}-next__h"><strong>מה עושים עכשיו</strong></p><ol class="${P}-next__list">${r.next.map((x) => `<li><a href="${esc(x.url)}"${x.kind === 'official' ? ' target="_blank" rel="noopener"' : ''}>${esc(x.he)}</a>${x.kind === 'official' ? ' <small>(אתר ממשלתי)</small>' : ''}</li>`).join('')}</ol>`
		+ `<p class="${P}-rehearse">${esc(r.rehearse.he)}. <a href="${esc(r.rehearse.url)}" target="_blank" rel="noopener" data-act="rehearse">לתרגול עם דמויות AI</a></p></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const state = r.route ? '<p class="jtool-state jtool-state--info">i מגיל הפרישה: השלמת הכנסה לקצבת אזרח ותיק</p>'
		: !r.eligible ? '<p class="jtool-state jtool-state--danger">✕ אין זכאות לפי מה שהוזן</p>'
			: r.verdict === 'check' ? '<p class="jtool-state jtool-state--warn">! זכאות, בכפוף לבדיקה</p>'
				: '<p class="jtool-state jtool-state--ok">✓ יש זכאות להבטחת הכנסה</p>';
	let out = `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}הבטחת הכנסה לחודש${r.calc ? `, ${esc(KIND_HE[r.kind])}` : ''}</p>`
		+ `<strong class="jtool-verdict__figure">${r.route ? '—' : ils(r.monthly, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`;
	if (r.eligible && r.calc) {
		const fb = r.deadlines.find((d) => d.key === 'file_by');
		out += `<dl class="jtool-breakdown"><div><dt>בשנה</dt><dd>${ils(r.annual, 0)}</dd></div>`
			+ `<div><dt>הכנסה כוללת לחודש</dt><dd>${ilsn(r.total)}</dd></div>`
			+ `<div><dt>מכל 100 ₪ נוספים מעבודה</dt><dd>${ils(r.keep, 0)}</dd></div>`
			+ `<div><dt>${r.health ? 'נכנס לחשבון' : fb ? 'להגיש עד' : 'הקצבה המלאה'}</dt><dd>${r.health ? ilsn(r.net) : fb ? `<bdi>${esc(isoToHe(fb.date))}</bdi>` : ilsn(r.calc.full)}</dd></div></dl>`;
	}
	out += '</div>';
	out += ladder(reg, r);
	if (r.calc) {
		if (!r.eligible) { out += `<p class="${P}-note">${esc(`אילו התנאים היו מתקיימים: ${nis(r.calc.pay)} בחודש (${KIND_HE[r.kind]}, ${groupHe(reg, r)}).`)}</p>`; }
		out += `<figure class="${P}-ch">${staircase(reg, r)}<figcaption class="${P}-ch__cap"><span><i class="${P}-k ${P}-k--w"></i>הכנסה מעבודה</span><span><i class="${P}-k ${P}-k--p"></i>הבטחת הכנסה</span><span><i class="${P}-k ${P}-k--full"></i>הקצבה המלאה: ${esc(nis(r.calc.full))}</span>`
			+ `<span><i class="${P}-k ${P}-k--first"></i>עד כאן ההכנסה לא נוגעת בקצבה: ${esc(nis(r.calc.first - r.calc.dP))}</span>`
			+ (r.kind.startsWith('parent') ? `<span><i class="${P}-k ${P}-k--band"></i>מכאן 60% במקום 25%: ${esc(nis(reg.rights_havtacha.work.parent.band))}</span>` : '')
			+ (r.capFrom !== null && r.capFrom !== undefined ? `<span><i class="${P}-k ${P}-k--cap"></i>מכאן הסכום הקובע: כל שקל מוריד שקל, מ-${esc(nis(r.capFrom))}</span>` : '')
			+ (r.end ? `<span><i class="${P}-k ${P}-k--end"></i>הקצבה נגמרת: ${esc(nis(r.end))}</span>` : '')
			+ `<span><i class="${P}-k ${P}-k--you"></i>אתם: ${esc(nis(r.W))} ועוד ${esc(nis(r.monthly))}</span></figcaption></figure>`;
	}
	const flags = r.flags.filter((x) => x.level !== 'info');
	if (flags.length) { out += `<ul class="jtool-flags">${flags.map((x) => `<li><strong aria-hidden="true">${MARK[x.level]}</strong> ${esc(x.he)}${cite(x.section || 'המוסד לביטוח לאומי', x.url)}</li>`).join('')}</ul>`; }
	out += nextBlock(reg, r);
	return out;
}

export function checklist(reg, r) {
	const hv = reg.rights_havtacha;
	const cl = hv.claim;
	const out = cl.docs_he.map((x, i) => ({ he: x, section: i === 0 ? `טופס ${cl.form}` : 'המסמכים לתביעה', url: i === 0 ? cl.form_url : hv.clock.claim_url }));
	if (r.ok && !r.route) {
		out.push({ he: hv.employment.he, section: 'התייצבות', url: hv.employment.taasuka_url });
		out.push({ he: hv.clock.full_month_he, section: 'חודש מלא', url: hv.employment.url });
	}
	out.push({ he: hv.clock.changes_he, section: 'הודעה על שינויים', url: hv.clock.changes_url });
	out.push({ he: hv.related.he, section: 'קצבאות נוספות', url: hv.related.url });
	return out;
}
export function checklistText(reg, r) { return checklist(reg, r).map((x, i) => `${i + 1}. ${x.he} (${x.section})`).join('\n'); }

function whyHe(hv, key) {
	return {
		none: 'בלי הכנסה מעבודה', first: 'עד כאן הניכוי הראשון: הקצבה מלאה', first_up: 'מכאן חלק מכל שקל נחשב', band: 'סוף החלק של 25% (הורה יחיד)',
		band_up: 'מכאן 60% מכל שקל נחשבים', cap: 'מכאן הסכום הקובע: כל שקל מוריד שקל', car: `עד כאן ההפחתה משווי הרכב ${money(hv.car.credit_other, 0)} ש"ח`, car_up: `מכאן "עובד": ההפחתה משווי הרכב ${money(hv.car.credit_worker, 0)} ש"ח`,
		last: 'ההכנסה האחרונה עם קצבה', end: 'הקצבה נגמרת', you: 'אתם',
	}[key] || '';
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const hv = reg.rights_havtacha;
	const btl = reg.rights_btl;
	const avg = btl.avg_wage.s2_benefits;
	let out = '';
	// 1. The ledger: the full benefit, the countable income line by line, the cap, the car, the benefit.
	if (r.calc) {
		const c = r.calc;
		const pctRow = hv.amounts.pct[r.kind];
		const pc = r.col === 'c' ? pctRow.c : pctRow.b;
		const exact = btl.basic_amount.b3 * pc / 100 - (r.col === 'c' && pctRow.less_point ? btl.basic_amount.b2_income_support : 0);
		const fam = r.kind === 'single' ? 'single' : 'family';
		const rows = [];
		rows.push([`הקצבה המלאה: ${esc(KIND_HE[r.kind])}, ${esc(groupHe(reg, r))}`, ilsn(r.young ? hv.amounts.b[r.kind] : c.base), `<bdi>${pc}% × ${money(btl.basic_amount.b3, 0)}${r.col === 'c' && pctRow.less_point ? ` − ${money(btl.basic_amount.b2_income_support, 0)}` : ''} = ${money(exact)}</bdi>, מעוגל לשקל${cite(hv.amounts.section, hv.law_url)}${cite('סכום הקצבה', hv.amounts.url)}`]);
		if (r.young) { rows.push([`בני ${hv.age.min} עד ${hv.age.young_to} שמתייצבים: ${hv.amounts.young_pct}%`, ilsn(c.base), `הטבלה של המוסד; החוק מתיר ${hv.amounts.young_law_min_pct}% עד ${hv.amounts.young_law_max_pct}%${cite(hv.age.young_section, hv.law_url)}`]); }
		if (c.women) { rows.push([`תוספת לאישה מגיל ${hv.women.from_age} (ילידות ${hv.women.born_from} עד ${hv.women.born_to})`, `+${ilsn(hv.women.amount)}`, `<bdi>${hv.women.pct}% × ${money(btl.basic_amount.b3, 0)}</bdi>${cite(hv.women.section, hv.law_url)}`]); }
		if (r.W > 0) { rows.push([`הכנסה מעבודה${r.fam === 'couple' ? ' של שניכם' : ''}`, ilsn(r.W), `ברוטו, כולל דמי אבטלה, לידה ופגיעה${cite('מה נחשב', hv.work.income_url)}`]); }
		if (r.pension > 0) { rows.push([`פנסיה, פחות הניכוי הראשון שחל קודם עליה: <bdi>${m2(r.pension)} − ${m2(c.dP)}</bdi>`, ilsn(c.pensionCounted), `${cite('תקנה 12', hv.regs_url)}${cite(r.col === 'c' ? hv.work.section_c : hv.work.section_b, hv.law_url)}`]); }
		if (r.W > 0) {
			rows.push([`הניכוי הראשון: <bdi>${hv.work.first_pct[r.col][fam]}% × ${money(avg, 0)} = ${money(avg * hv.work.first_pct[r.col][fam] / 100)}</bdi>, מעוגל ל-${money(c.first, 0)}${c.dP ? `, אחרי ${money(c.dP, 0)} מהפנסיה` : ''}`, `−${ilsn(c.dW)}`, `לא נחשב${cite(r.col === 'c' ? hv.work.section_c : hv.work.section_b, hv.law_url)}${cite('חישוב לפי הכנסה מעבודה', hv.work.url)}`]);
			c.parts.forEach((p) => { if (p.base > 0) { rows.push([`${p.key === 'low' ? `החלק עד ${money(hv.work.parent.band, 0)}` : p.key === 'high' ? `החלק שמעל ${money(hv.work.parent.band, 0)}` : 'היתרה'}: <bdi>${p.pct}% × ${m2(p.base)}</bdi>`, ilsn(Math.round(p.amt * 100) / 100), p.key === 'rest' ? `נחשב${cite(r.col === 'c' ? hv.work.section_c : hv.work.section_b, hv.law_url)}` : `הורה יחיד${cite(hv.work.parent_section, hv.law_url)}`]); } });
			rows.push(['הכנסה מעבודה שנחשבת, מעוגלת לשקל', ilsn(c.workCounted), c.counted === c.workCounted ? 'שקלים שלמים' : `<bdi>${m2(c.counted)}</bdi>, מעוגל ל-${money(c.workCounted, 0)}`]);
		}
		if (r.other > 0) { rows.push(['הכנסה אחרת, במלואה', ilsn(r.other), `${esc(hv.other_income.he)}${cite(hv.other_income.section, hv.other_income.url)}`]); }
		rows.push([`הקצבה המלאה פחות ההכנסה שנחשבת: <bdi>${money(c.full, 0)} − ${money(c.income, 0)}</bdi>`, ilsn(Math.max(0, c.before)), `${cite('סעיף 5(ב)', hv.law_url)}`]);
		if (r.det) { rows.push([`הסכום הקובע מגיל ${hv.age.older_from}: <bdi>${r.det.pct}% × ${money(avg, 0)} = ${money(r.det.byWage)}</bdi>, הגבוה מנקודות הזיכוי (<bdi>${r.det.points} × ${money(r.det.point, 0)}</bdi>), פחות ההכנסה כולה: <bdi>${m2(r.W + r.pension + r.other)}</bdi>`, ilsn(Math.max(0, c.cap)), `${c.capBinds ? 'נמוך יותר, ולכן זה הסכום' : 'גבוה יותר, לא משנה'}${cite(hv.determining.section, hv.regs_url)}`]); }
		if (c.carDed) { rows.push([`רכב: <bdi>${hv.car.rate_pct}% × (${money(r.carValue, 0)} − ${money(c.credit, 0)})</bdi>`, `−${ilsn(c.carDed)}`, `${c.worker ? `הכנסה מעבודה מעל ${money(hv.car.worker_from, 0)}` : 'לא "עובד" לפי התקנה'}${cite(hv.car.section, hv.regs_url)}`]); }
		if (c.belowMin) { rows.push([`פחות מ-${hv.min_pay} ש"ח`, ilsn(0), `לא משולם${cite(hv.min_pay_section, hv.law_url)}`]); }
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-calc-h">כמה, על מה, ולפי איזה סעיף</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-calc-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ rows.map(([a, b, cc]) => `<tr><td data-th="מה">${a}</td><td data-th="סכום">${b}</td><td data-th="הכלל">${cc}</td></tr>`).join('')
			+ `<tr class="jtool-table__total"><td data-th="מה">הבטחת הכנסה לחודש${r.eligible ? '' : ' (אילו התנאים התקיימו)'}</td><td data-th="סכום">${ilsn(c.pay)}</td><td data-th="הכלל">בשנה ${ilsn(c.pay * 12)}</td></tr>`
			+ (r.health ? `<tr><td data-th="מה">${esc(hv.deductions.health_he)}</td><td data-th="סכום">${ilsn(r.net)}</td><td data-th="הכלל">נכנס לחשבון${cite('ניכויים מהקצבה', hv.deductions.url)}</td></tr>` : '')
			+ `</tbody><caption>${esc(`${hv.clock.pay_he}. הסכומים מ-${isoToHe(hv.from)}, ברוטו.`)}</caption></table></div></div>`;
	}
	// 2. The gates, with the section of each.
	out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-gate-h">תנאי הזכאות, אחד אחד</h3></div><ul class="${P}-gate">`
		+ r.gates.map((g) => `<li class="${P}-gate__i ${P}-gate__i--${g.state}"><strong aria-hidden="true">${STATE[g.state]}</strong> ${esc(GATE_HE[g.key])}: ${esc(g.he)}${cite(g.section || 'המוסד לביטוח לאומי', g.url)}</li>`).join('') + '</ul></div>';
	// 3. The staircase in text.
	if (r.ledger.length) {
		out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-led-h">הכנסה וקצבה: כמה נשאר מכל שקל</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-led-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">הכנסה מעבודה</th><th scope="col">הבטחת הכנסה</th><th scope="col">ביחד</th><th scope="col">מ-100 ₪ נוספים נשארים</th><th scope="col">מה קורה כאן</th></tr></thead><tbody>`
			+ r.ledger.map((x) => `<tr${x.you ? ` class="${P}-you"` : ''}><td data-th="הכנסה מעבודה">${ilsn(x.w)}</td><td data-th="הבטחת הכנסה">${ilsn(x.pay)}</td><td data-th="ביחד">${ilsn(x.total)}</td><td data-th="מ-100 ₪ נוספים נשארים">${ils(x.keep, 0)}</td><td data-th="מה קורה כאן">${esc(whyHe(hv, x.you ? 'you' : x.why))}</td></tr>`).join('')
			+ `</tbody><caption>${esc(`הקצבה נגמרת בהכנסה של ${money(r.end, 0)} ₪, כי סכום של פחות מ-${hv.min_pay} ש"ח לא משולם (${hv.min_pay_section})${r.published ? `; בטבלה של המוסד, בלי הכלל הזה: ${money(r.published, 0)} ₪` : ''}`)}${cite('סכום הקצבה', hv.amounts.url)}</caption></table></div></div>`;
	}
	// 4. The same family and income in every age group.
	if (r.columns.length) {
		out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-age-h">אותה משפחה, אותה הכנסה, בכל קבוצת גיל</h3></div><div class="jt7-scns ${P}-scns">`
			+ r.columns.map((x) => `<div class="jt7-scn${x.here ? ' jt7-scn--here' : ''}"><p>${esc(x.he)}${x.here ? ' (אתם)' : ''}</p><strong>${ilsn(x.pay)}</strong><small>מלאה ${esc(nis(x.full))}</small></div>`).join('')
			+ `</div><p class="jt7-scns__note">${esc(`${hv.amounts.couple_he}. מגיל ${hv.age.older_from} הניכוי הראשון גדל ל-${money(hv.work.first.c.single, 0)} ש"ח (יחיד) או ${money(hv.work.first.c.family, 0)} ש"ח, ונחשבים 60% מהיתרה.`)}</p></div>`;
	}
	// 5. The dates.
	if (r.deadlines.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3>${r.deadlines.some((d) => d.ics) ? '<div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div>' : ''}</div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">מקור</th></tr></thead><tbody>`
			+ r.deadlines.map((x) => `<tr${x.ics ? ` class="${P}-dl--key"` : ''}><td data-th="תאריך"><bdi>${esc(isoToHe(x.date))}</bdi></td><td data-th="מה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section || 'המוסד לביטוח לאומי', x.url)}</td></tr>`).join('')
			+ `</tbody><caption>${esc(`${hv.clock.pay_he} (לדוגמה ${isoToHe(hv.clock.pay_example)}). ${hv.clock.appeal_he}.`)}${cite('לוח התשלומים', hv.clock.pay_url)}</caption></table></div></div>`;
	} else {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3></div><p class="${P}-note">${esc(`${hv.clock.retro_he}. ${hv.clock.pay_he}. ${hv.clock.appeal_he}.`)}</p></div>`;
	}
	// 6. What to file.
	out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">מה מגישים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ol class="${P}-list">${checklist(reg, r).map((x) => `<li>${esc(x.he)}${cite(x.section, x.url)}</li>`).join('')}</ol></div>`;
	// 7. What changed and when.
	out += historyTable(reg, `${P}-noprint`);
	const info = r.flags.filter((x) => x.level === 'info');
	if (info.length) { out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-info-h">עוד לפני שמגישים</h3></div><ul class="${P}-info">${info.map((x) => `<li>${esc(x.he)}${cite(x.section || 'המוסד לביטוח לאומי', x.url)}</li>`).join('')}</ul></div>`; }
	return out;
}

/** "What changed and when": the published basic amount 3 and income-support point by year, and what the 2026 amounts rest on. */
export function historyTable(reg, extra = '') {
	const hv = reg.rights_havtacha;
	const btl = reg.rights_btl;
	const rows = hv.history.concat([{ from: btl.from, b3: btl.basic_amount.b3, point: btl.basic_amount.b2_income_support, change_pct: btl.basic_amount.b3_change_pct }]);
	return `<div class="jtool-tablewrap${extra ? ` ${extra}` : ''}"><div class="jtool-tablewrap__head"><h3 id="${P}-hist-h">מה השתנה ומתי</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-hist-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתאריך</th><th scope="col">סכום בסיסי 3</th><th scope="col">נקודת קצבה</th><th scope="col">שינוי</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתאריך"><bdi>${esc(isoToHe(x.from))}</bdi></td><td data-th="סכום בסיסי 3">${ilsn(x.b3)}</td><td data-th="נקודת קצבה">${ilsn(x.point)}</td><td data-th="שינוי"><bdi>${x.change_pct}%</bdi></td></tr>`).join('')
		+ `</tbody><caption>${esc(`${hv.amounts.basic_he}. כל סכום בטבלת הקצבאות הוא אחוז קבוע מהסכום הבסיסי (${hv.amounts.section}), ולכן הוא עולה ב-1 בינואר בשיעור הזה.`)}${cite('הסכום הבסיסי', hv.history_url)}</caption></table></div></div>`;
}

/** Page section: the 2026 amounts by family and age group, and the Institute's maximum work income. */
export function amountsTable(reg) {
	const hv = reg.rights_havtacha;
	const a = hv.amounts;
	const kinds = ['single', 'couple', 'couple1', 'couple2', 'parent1', 'parent2'];
	const rows = kinds.map((k) => `<tr><td data-th="הרכב המשפחה">${esc(KIND_HE[k])}</td><td data-th="20 עד 24, מתייצבים">${ilsn(a.young[k])}</td><td data-th="עד 54">${ilsn(a.b[k])}</td><td data-th="55 עד גיל הפרישה">${ilsn(a.c[k])}</td><td data-th="הכנסה מעבודה מרבית, עד 54">${ilsn(a.max_work.b[k])}</td><td data-th="הכנסה מעבודה מרבית, מ-55">${ilsn(a.max_work.c[k])}</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`הבטחת הכנסה מ-${isoToHe(hv.from)}, לפי הרכב המשפחה וקבוצת הגיל, ובשני הטורים האחרונים ההכנסה מעבודה המרבית שעדיין משאירה קצבה חלקית (כשזו ההכנסה היחידה), כפי שהמוסד מפרסם (${a.section}; ${hv.age.young_section})`)}${cite('סכום הקצבה', a.url)}</caption>`
		+ `<thead><tr><th scope="col">הרכב המשפחה</th><th scope="col">20 עד 24, מתייצבים</th><th scope="col">עד 54</th><th scope="col">55 עד גיל הפרישה</th><th scope="col">הכנסה מעבודה מרבית, עד 54</th><th scope="col">הכנסה מעבודה מרבית, מ-55</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the income disregards by family and age group. */
export function disregardTable(reg) {
	const hv = reg.rights_havtacha;
	const wk = hv.work;
	const rows = [['single', 'יחיד'], ['couple', 'זוג'], ['couple1', 'זוג עם ילד'], ['couple2', 'זוג עם 2 ילדים ומעלה']].map(([k, he]) => `<tr><td data-th="הרכב המשפחה">${esc(he)}</td><td data-th="עד 55: לא נחשב">${ilsn(wk.first.b[k === 'single' ? 'single' : 'family'])}</td><td data-th="עד 55: נחשב מהיתרה"><bdi>${wk.counted_pct.b[k]}%</bdi></td><td data-th="מ-55: לא נחשב">${ilsn(wk.first.c[k === 'single' ? 'single' : 'family'])}</td><td data-th="מ-55: נחשב מהיתרה"><bdi>${wk.counted_pct.c}%</bdi></td></tr>`).join('')
		+ `<tr><td data-th="הרכב המשפחה">הורה יחיד</td><td data-th="עד 55: לא נחשב">${ilsn(wk.first.b.family)}</td><td data-th="עד 55: נחשב מהיתרה"><bdi>${wk.parent.low_pct}%</bdi> עד ${ilsn(wk.parent.band)}, <bdi>${wk.parent.high_pct}%</bdi> מעליו</td><td data-th="מ-55: לא נחשב">${ilsn(wk.first.c.family)}</td><td data-th="מ-55: נחשב מהיתרה"><bdi>${wk.parent.low_pct}%</bdi> עד ${ilsn(wk.parent.band)}, <bdi>${wk.parent.high_pct}%</bdi> מעליו</td></tr>`;
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`מה נחשב מההכנסה מעבודה, מ-${isoToHe(hv.from)}: קודם סכום שלא נחשב בכלל, ואז אחוז מהיתרה שמופחת מהקצבה (${wk.section_b}; ${wk.section_c})`)}${cite('חישוב לפי הכנסה מעבודה', wk.url)}</caption>`
		+ `<thead><tr><th scope="col">הרכב המשפחה</th><th scope="col">עד 55: לא נחשב</th><th scope="col">עד 55: נחשב מהיתרה</th><th scope="col">מ-55: לא נחשב</th><th scope="col">מ-55: נחשב מהיתרה</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

const EMP_HE = { registered: 'רשום ומתייצב בשירות התעסוקה', fulltime: 'עבודה של 36 שעות בשבוע ומעלה', exempt: 'בקבוצת פטור מהתייצבות', none: 'לא רשום בשירות התעסוקה ולא בקבוצת פטור' };
const EXCL_HE = { student: 'לימודים במוסד להשכלה גבוהה', yeshiva: 'לימודים בישיבה', kibbutz: 'חברות בקיבוץ או במושב שיתופי', army: 'שירות סדיר במשפחה' };
const keepHe = (k) => money(k, Number.isInteger(k) ? 0 : 1);
/** Who the tool computed for, in the reader's own answers: the family, the ages, the work income. */
function whoHe(r) {
	const fam = r.fam === 'single' ? 'יחיד' : r.fam === 'couple' ? `בני זוג${r.kids ? ` עם ${r.kids === 1 ? 'ילד' : `${r.kids} ילדים`}` : ''}` : `הורה יחיד עם ${r.kids === 1 ? 'ילד' : `${r.kids} ילדים`}`;
	const age = r.fam === 'couple' && r.spouseAge !== null && r.spouseAge !== '' ? `בגילים ${r.age} ו-${r.spouseAge}` : `גיל ${r.age}`;
	return `${fam}, ${age}, ${r.W > 0 ? `הכנסה מעבודה ${nis(r.W)} בחודש` : 'בלי הכנסה מעבודה'}`;
}
/** The hearing that fits the result, and the simulation's purpose for it: a rejection or a decision goes to the regional
 * labour court (court_rehearsal); everything else is the claims officer or the investigator (witness_prep, the catalog's). */
export function rehearsal(r) {
	if (r.ok && !r.route && (r.verdict === 'no' || r.decision)) {
		return { purpose: 'court_rehearsal', ask: 'אני רוצה להתכונן לדיון בבית הדין האזורי לעבודה, שבו מערערים על החלטת הביטוח הלאומי, ולהבין מה לטעון ואילו מסמכים להביא.' };
	}
	if (r.ok && !r.route && r.hearing) {
		return { purpose: 'witness_prep', ask: 'אני רוצה להתכונן לשימוע ולשיחה עם החוקר של הביטוח הלאומי: מה לומר על ההכנסות, על הרכב ועל מי שגר בבית, ואילו מסמכים להביא.' };
	}
	if (r.ok && !r.route && (r.car !== 'none' || r.fam === 'couple')) {
		return { purpose: 'witness_prep', ask: 'אני רוצה להתכונן לשיחה עם פקיד התביעות או עם החוקר של הביטוח הלאומי: הרכב, בן או בת הזוג, ההכנסות ומי גר בבית.' };
	}
	if (r.ok && r.route) {
		return { purpose: 'witness_prep', ask: 'אני רוצה להתכונן לשיחה עם פקיד התביעות על קצבת אזרח ותיק ועל השלמת ההכנסה, ולהבין אילו מסמכים להביא.' };
	}
	return { purpose: 'witness_prep', ask: 'אני רוצה להתכונן לבירור אצל פקיד התביעות בביטוח הלאומי: ההכנסות, ההתייצבות בשירות התעסוקה ומה משתנה כשמתחילים לעבוד.' };
}

/** The result-first card at the top of the page ([justice_tool_lead]): the monthly benefit of the example (or of the
 * reader's own answers once they change anything), or "no entitlement" with the gate that failed, one line of why, and a
 * jump to the form. Same markup on the server and in the browser, so the card never shifts the layout. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הנתונים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">הבטחת הכנסה</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const hv = reg.rights_havtacha;
	const label = `${opts.example ? 'דוגמה מחושבת' : 'החישוב שלכם'}: הבטחת הכנסה לחודש`;
	const card = (figure, unit, line) => `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${figure}</strong>${unit ? `<span class="jtool-lead__unit">${unit}</span>` : ''}</p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
	if (r.route) { return card('השלמת הכנסה', 'לקצבת אזרח ותיק', `${whoHe(r)}. ${hv.age.retirement_he} (טופס ${hv.claim.old_age_form}).`); }
	if (!r.eligible) {
		const g = r.gates.find((x) => x.state === 'no');
		return card('אין זכאות', '', `${whoHe(r)}. התנאי שנכשל: ${GATE_HE[g.key]}: ${g.he}.${r.calc ? ` אילו התנאים היו מתקיימים: ${nis(r.calc.pay)} בחודש.` : ''}`);
	}
	if (r.conflict) { return card(ils(0, 0), 'לפי תקנה 9', `${whoHe(r)}. ההכנסה מגיעה לסכום הקובע, ולכן אין תשלום; בטבלה של הביטוח הלאומי יש קצבה חלקית עד הכנסה של ${nis(r.published)}. כדאי להגיש תביעה ולבקש את החישוב.`); }
	const fb = r.deadlines.find((d) => d.key === 'file_by');
	const check = r.verdict === 'check' ? ` לבדיקה: ${r.gates.filter((g) => g.state === 'check').map((g) => GATE_HE[g.key]).join(', ')}.` : '';
	const line = `${whoHe(r)}.${r.W > 0 ? ` ביחד עם העבודה ${nis(r.total)} בחודש; מכל 100 ₪ נוספים נשארים ${keepHe(r.keep)} ₪.` : ` הקצבה המלאה, ${groupHe(reg, r)}.`}${check}${fb ? ` להגיש עד ${isoToHe(fb.date)}.` : ''}`;
	return card(ils(r.monthly, 0), `לחודש · ${ils(r.annual, 0)} בשנה`, line);
}

/** The scenario for the simulation: the tool's figures and choices only, never a name, an ID or an address. */
export function scenarioText(reg, r) {
	if (!r.ok) { return ''; }
	const hv = reg.rights_havtacha;
	const adds = [];
	if (r.pension > 0) { adds.push(`פנסיה ${nis(r.pension)} בחודש`); }
	if (r.other > 0) { adds.push(`הכנסה אחרת ${nis(r.other)} בחודש`); }
	if (r.car !== 'none') { adds.push(`${r.car === 'two' ? 'שני רכבים' : 'רכב'}${r.carValue ? ` בשווי ${nis(r.carValue)}` : ''}`); }
	if (r.savings > 0) { adds.push(`חסכונות ${nis(r.savings)}`); }
	if (r.realty) { adds.push('נכס מקרקעין נוסף'); }
	if (r.res === 'new') { adds.push(`תושבות של פחות מ-${hv.residence.months} חודשים`); }
	if (r.excl !== 'none') { adds.push(EXCL_HE[r.excl]); }
	const emp = `${EMP_HE[r.emp]}${r.fam === 'couple' ? `; בן או בת הזוג: ${EMP_HE[r.spouseEmp]}` : ''}`;
	let res;
	if (r.route) {
		res = `לפי החישוב: ${hv.age.retirement_he}.`;
	} else if (!r.eligible) {
		const g = r.gates.find((x) => x.state === 'no');
		res = `לפי החישוב לפי חוק הבטחת הכנסה אין זכאות: ${GATE_HE[g.key]}: ${g.he}.${r.calc ? ` אילו התנאים היו מתקיימים: ${nis(r.calc.pay)} בחודש.` : ''}`;
	} else if (r.conflict) {
		res = `לפי החישוב ההכנסה מגיעה לסכום הקובע ואין תשלום, אבל בטבלה של הביטוח הלאומי יש קצבה חלקית עד הכנסה של ${nis(r.published)}.`;
	} else {
		res = `לפי החישוב לפי חוק הבטחת הכנסה: ${nis(r.monthly)} בחודש (${KIND_HE[r.kind]}, הקצבה המלאה ${nis(r.calc.full)}${r.calc.income ? `, פחות ${nis(r.calc.income)} הכנסה שנחשבת` : ''})${r.verdict === 'check' ? `, בכפוף לבדיקה של: ${r.gates.filter((g) => g.state === 'check').map((g) => GATE_HE[g.key]).join(', ')}` : ''}.`;
	}
	const events = `${r.hearing ? ' הגיעה הודעה על שימוע לפני הפסקת הקצבה.' : ''}${r.decision ? ' התקבלה החלטה של הביטוח הלאומי.' : ''}`;
	return `הבטחת הכנסה. ${whoHe(r)}; ${emp}.${adds.length ? ` ${adds.join(', ')}.` : ''} ${res}${events} ${rehearsal(r).ask}`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const hv = reg.rights_havtacha;
	const btl = reg.rights_btl;
	const c = r.calc;
	const avg = btl.avg_wage.s2_benefits;
	const low = c.parts.find((p) => p.key === 'low');
	const fb = r.deadlines.find((d) => d.key === 'file_by');
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.monthly,
		sticky: ils(r.monthly, 0),
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>תנאי הזכאות: תושבות ${hv.residence.months} חודשים, גיל ${r.age} (מגיל ${hv.age.min}), רשום ומתייצב בשירות התעסוקה, בלי רכב ובלי סייג של לימודים${cite(hv.residence.section, hv.law_url)}${cite(hv.employment.section, hv.law_url)}${cite(hv.exclusions.section, hv.law_url)}</li>`
			+ `<li>הקצבה המלאה להורה יחיד עם ${r.kids} ילדים מתחת לגיל ${hv.age.older_from}: <bdi>${hv.amounts.pct[r.kind].b}% × ${money(btl.basic_amount.b3, 0)} = ${money(btl.basic_amount.b3 * hv.amounts.pct[r.kind].b / 100)}</bdi>, מעוגל ל-${money(c.full, 0)} ₪ (סכום בסיסי 3 מ-${isoToHe(btl.from)})${cite(hv.amounts.section, hv.law_url)}${cite('סכום הקצבה', hv.amounts.url)}</li>`
			+ `<li>הניכוי הראשון: <bdi>${hv.work.first_pct.b.family}% × ${money(avg, 0)} = ${money(avg * hv.work.first_pct.b.family / 100)}</bdi>, ${money(c.first, 0)} ₪ שלא נחשבים${cite(hv.work.section_b, hv.law_url)}</li>`
			+ `<li>הורה יחיד: <bdi>${hv.work.parent.low_pct}% × (${money(r.W, 0)} − ${money(c.dW, 0)}) = ${money(low.amt)}</bdi> ₪ נחשבים, כי ההכנסה מתחת ל-${money(hv.work.parent.band, 0)} ₪, שהם <bdi>${hv.work.parent.band_pct}% × ${money(avg, 0)}</bdi>${cite(hv.work.parent_section, hv.law_url)}${cite('חישוב לפי הכנסה מעבודה', hv.work.url)}</li>`
			+ `<li>הקצבה: <bdi>${money(c.full, 0)} − ${money(c.workCounted, 0)} = ${money(r.monthly, 0)}</bdi> ₪ בחודש; עם ההכנסה מעבודה <bdi>${money(r.W, 0)} + ${money(r.monthly, 0)} = ${money(r.total, 0)}</bdi> ₪; מכל 100 ₪ נוספים נשארים ${r.keep} ₪ עד ${money(r.nextKeep.from, 0)} ₪, ואחר כך ${r.nextKeep.keep} ₪; הקצבה נגמרת ב-${money(r.end, 0)} ₪${cite('סעיף 5(ב)', hv.law_url)}${cite(hv.min_pay_section, hv.law_url)}</li>`
			+ `<li>המועדים: התביעה ב${monthHe(r.month)}, עד ${isoToHe(fb.date)}, בלי תשלום רטרואקטיבי; התשלום ב-${hv.clock.pay_day} בחודש עבור החודש הקודם${cite(hv.clock.section, hv.law_url)}${cite('תקופת הזכאות', hv.clock.url)}</li></ol>`,
		compare_table: amountsTable(reg) + disregardTable(reg) + historyTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

export function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const int = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : (/^\d+$/.test(v) ? Number(v) : NaN); };
	const fam = radio('fam', 'single');
	return {
		fam, kids: fam === 'single' ? 0 : Number(radio('kids', '0')), age: int('age'), sex: radio('sex', ''), born: toYm(val(`#${P}-born`)), spouseAge: fam === 'couple' ? int('spouseAge') : '',
		emp: radio('emp', 'registered'), spouseEmp: radio('semp', 'registered'), work: m('work'), spouseWork: fam === 'couple' ? m('spouseWork') : '', pension: m('pension'), other: m('other'),
		car: radio('car', 'none'), carValue: m('carValue'), carEx: on('carex'), savings: m('savings'), realty: on('realty'), res: radio('res', 'yes'), excl: radio('excl', 'none'),
		month: toYm(val(`#${P}-month`)), decision: toIso(val(`#${P}-decision`)), hearing: toIso(val(`#${P}-hearing`)),
	};
}

const FC = { single: 's', couple: 'c', parent: 'p' };
const EC = { registered: 'r', fulltime: 'f', exempt: 'x', none: 'n' };
const CC = { none: 'n', one: '1', two: '2' };
const XC = { none: 'n', student: 's', yeshiva: 'y', kibbutz: 'k', army: 'a' };
const keyOf = (map, code, d) => Object.keys(map).find((k) => map[k] === code) || d;
const cell = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : String(v));
export function stateOf(i) {
	return encodeState({
		f: FC[i.fam] || 's', k: i.fam === 'single' ? '' : cell(i.kids), a: cell(i.age), x: i.sex, b: i.born, g: i.fam === 'couple' ? cell(i.spouseAge) : '',
		e: EC[i.emp] || 'r', h: i.fam === 'couple' ? EC[i.spouseEmp] || 'r' : '', w: cell(i.work), v: i.fam === 'couple' ? cell(i.spouseWork) : '', p: cell(i.pension), o: cell(i.other),
		c: i.car && i.car !== 'none' ? CC[i.car] : '', q: i.car && i.car !== 'none' ? cell(i.carValue) : '', j: i.carEx ? 1 : '', s: cell(i.savings), l: i.realty ? 1 : '',
		r: i.res === 'new' ? 'n' : '', u: i.excl && i.excl !== 'none' ? XC[i.excl] : '', m: i.month, d: i.decision, t: i.hearing,
	});
}
export const KEYS = ['f', 'k', 'a', 'x', 'b', 'g', 'e', 'h', 'w', 'v', 'p', 'o', 'c', 'q', 'j', 's', 'l', 'r', 'u', 'm', 'd', 't'];
export function inputOf(s) {
	if (!s.f || !s.a) { return null; }
	const fam = keyOf(FC, s.f, 'single');
	const n = (v) => (v === undefined || v === '' ? '' : Number(v));
	return {
		fam, kids: fam === 'single' ? 0 : (s.k ? Number(s.k) : 0), age: Number(s.a), sex: s.x === 'f' || s.x === 'm' ? s.x : '', born: s.b || '', spouseAge: fam === 'couple' ? n(s.g) : '',
		emp: keyOf(EC, s.e, 'registered'), spouseEmp: fam === 'couple' ? keyOf(EC, s.h, 'registered') : 'registered', work: n(s.w), spouseWork: fam === 'couple' ? n(s.v) : '', pension: n(s.p), other: n(s.o),
		car: s.c ? keyOf(CC, s.c, 'none') : 'none', carValue: s.c ? n(s.q) : '', carEx: s.j === '1', savings: n(s.s), realty: s.l === '1', res: s.r === 'n' ? 'new' : 'yes', excl: s.u ? keyOf(XC, s.u, 'none') : 'none',
		month: s.m || '', decision: s.d || '', hearing: s.t || '',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const hv = reg.rights_havtacha;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(hv.checked_on, hv.refresh_every_days) || (hv.next_update && today >= hv.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהסכומים התעדכנו ב-1 בינואר'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const fam = (root.querySelector(`input[name="${P}-fam"]:checked`) || {}).value || 'single';
		const v = ((root.querySelector(`#${P}-age`) || {}).value || '').trim();
		const age = /^\d+$/.test(v) ? Number(v) : null;
		const sex = (root.querySelector(`input[name="${P}-sex"]:checked`) || {}).value || '';
		const car = (root.querySelector(`input[name="${P}-car"]:checked`) || {}).value || 'none';
		form.querySelectorAll('[data-if-kids]').forEach((el) => { el.hidden = fam === 'single'; });
		form.querySelectorAll('[data-if-couple]').forEach((el) => { el.hidden = fam !== 'couple'; });
		form.querySelectorAll('[data-if-55]').forEach((el) => { el.hidden = !(age !== null && age >= hv.age.older_from); });
		form.querySelectorAll('[data-if-born]').forEach((el) => { el.hidden = !(sex === 'f' && age !== null && age >= 60); });
		form.querySelectorAll('[data-if-car]').forEach((el) => { el.hidden = car === 'none'; });
	};
	const band = (r) => (!r.ok ? 'error' : r.route ? 'route' : !r.eligible ? 'no' : r.monthly >= 4000 ? '4000+' : r.monthly >= 2000 ? '2000-3999' : 'under-2000');
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok && r.eligible ? ils(r.monthly, 0) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: band(r) }); }
	};
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	// The card's jump: to the form, the first visible field focused (the page anchor is the fallback without the script).
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = Array.from(form.querySelectorAll('input[type="text"]')).find((el) => !el.closest('[hidden]'));
			if (first) { setTimeout(() => first.focus({ preventScroll: true }), 350); }
			track('tool_lead_click', { tool_id: TOOL_ID });
		});
	}
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (act === 'profile') {
			const p = PROFILES[Number(b.getAttribute('data-profile'))];
			if (p) { own = true; form.innerHTML = renderForm(reg, p.input); sync(); run(p.input); track('tool_start', { tool_id: TOOL_ID, type: 'profile' }); }
			return;
		}
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			// Only the dates the law or the Institute sets (the claim month's last day, the hearing's 14 days, the appeal's 12 months).
			const events = r.deadlines.filter((d) => d.ics);
			if (events.length) {
				download('havtachat-hachnasa.ics', 'text/calendar;charset=utf-8', ics(events.map((d) => ({ date: d.date, summary: `הבטחת הכנסה: ${d.he}` })), new Date().toISOString()));
				track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
			}
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(checklistText(reg, r));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק הבטחת הכנסה ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(hv.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: band(r) });
			if (r.ok && openSimulation(scenarioText(reg, r), rehearsal(r).purpose, b.getAttribute('href'))) { ev.preventDefault(); toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.'); }
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { own = true; form.innerHTML = renderForm(reg, s); sync(); run(s); }
		} else if (act === 'clear') {
			store.clear(saveKey);
			toast(root, 'נמחק מהמכשיר.');
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});
	// The printed summary ends with the sources: a closed <details> does not print, so it opens for the print and closes after.
	const sources = root.querySelector('details.jtool-sources');
	let sourcesOpen = true;
	window.addEventListener('beforeprint', () => { if (sources) { sourcesOpen = sources.open; sources.open = true; } });
	window.addEventListener('afterprint', () => { if (sources && !sourcesOpen) { sources.open = false; } });
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
