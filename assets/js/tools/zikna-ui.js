/**
 * The rights wave 2B UI (22.10.2026, HAD-585): the old-age pension and the retirement-age clock (kitzbat-zikna, jt50).
 * Two pictures from the Institute's own desk: the retirement-age clock (a life line from the birth date, broken after 55,
 * through the retirement age with the women's schedule step for the reader's month of birth, the income-test window to 70,
 * 80, the transition-grant months and today's line), and the pension ledger (the basic pension, the dependants, the
 * seniority and the deferral increments stacked to the total of each phase, the income-test reduction drawn as a cut).
 * The phases table, the gate list and the dates table say the same in text; the .ics carries only the dates the law sets.
 */
import { compute, zkMonthHe, ZK_FAMS, ZK_STATUS } from './zikna-engine.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'kitzbat-zikna';
const P = 'jt50';

const BASE = { sex: 'f', birth: '', fam: 'single', spouseBirth: '', spouseIncome: '', spousePension: false, together: true, kids: 0, years: '', status: 'worker', work: '', other: '', workYears: '', waive: false, disability: false, immigrant: false, grantWork: false, decision: '' };
export const EXAMPLE = Object.assign({}, BASE, { sex: 'f', birth: '1964-08-09', years: 28, work: 11000, grantWork: true });
/** One click, a whole profile: the quick chips above the form. */
export const PROFILES = [
	{ he: 'אישה ילידת 1965', input: Object.assign({}, BASE, { sex: 'f', birth: '1965-03-10', years: 30 }) },
	{ he: 'גבר יליד 1959 שממשיך לעבוד', input: Object.assign({}, BASE, { sex: 'm', birth: '1959-06-20', fam: 'couple', spouseBirth: '1962-04-02', years: 40, work: 16000 }) },
	{ he: 'זוג, הוא בן 70', input: Object.assign({}, BASE, { sex: 'm', birth: '1956-09-03', fam: 'couple', spouseBirth: '1958-05-01', years: 45, work: 25000 }) },
	{ he: 'אישה ילידת 1962, 30 שנות ביטוח', input: Object.assign({}, BASE, { sex: 'f', birth: '1962-05-05', years: 30 }) },
	{ he: 'דחיית הקצבה לגיל 70', input: Object.assign({}, BASE, { sex: 'm', birth: '1960-01-12', years: 35, work: 20000 }) },
];

const MARK = { bad: '✕', warn: '!', info: 'i' };
const STATE = { ok: '✓', check: '!', no: '✕', route: 'i', part: '½' };
const STATE_HE = { ok: 'עובר', check: 'לבדיקה', no: 'לא עובר', route: 'מסלול אחר', part: 'חלקית' };
const GATE_HE = { insured: 'מבוטחים', age: 'הגיל', achshara: 'תקופת אכשרה', income: 'מבחן הכנסות עד 70', spouse: 'בן או בת הזוג' };
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const m2 = (n) => money(n, Math.round(n * 100) % 100 ? 2 : 0);
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}"${href.charAt(0) === '/' ? '' : ' target="_blank" rel="noopener"'}>${esc(text)}</a>` : '');
const ageHe = (y, m) => `${y}${m ? ` ו-${m} חודשים` : ''}`;
const famHe = (r) => (r.couple ? (r.paySpouse ? 'זוג' : 'בני זוג, בלי תוספת לבן הזוג') : 'יחיד');

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 1900; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const z = reg.rights_zikna;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const show = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : String(v));
	const field = (id, label, value, ph, mode = 'numeric') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="${mode}" autocomplete="off" value="${esc(value)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const moneyField = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(isNum(value) ? money(value, value % 1 ? 2 : 0) : show(value))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const sex = input.sex === 'm' ? 'm' : input.sex === 'f' ? 'f' : '';
	const fam = ZK_FAMS.includes(input.fam) ? input.fam : 'single';
	const status = ZK_STATUS.includes(input.status) ? input.status : 'worker';
	const kids = Math.min(Number(input.kids) || 0, 3);
	const by = Number(String(toIso(input.birth)).slice(0, 4));
	const grantShown = sex === 'f' && by >= z.grant.born_from && by <= z.grant.born_to;
	const profiles = `<div class="${P}-quick" role="group" aria-label="פרופילים מוכנים"><p class="${P}-quick__h">בלחיצה אחת:</p><div class="jtool-chips">${PROFILES.map((p, i) => `<button class="${P}-qchip" type="button" data-act="profile" data-profile="${i}">${esc(p.he)}</button>`).join('')}</div></div>`;
	return profiles
		+ `<fieldset class="jtool-field"><legend>גבר או אישה</legend><div class="jtool-chips">${chip('sex', 'f', 'אישה', sex === 'f')}${chip('sex', 'm', 'גבר', sex === 'm')}</div><p class="jtool-error" id="${P}-sex-e" role="alert"></p></fieldset>`
		+ `${field('birth', 'תאריך לידה', isoToHe(toIso(input.birth)), 'לדוגמה: 9.8.1964')}<p class="jtool-hint">${esc(z.ages.women_he)}. גבר: ${z.ages.men_now}.</p>`
		+ `<fieldset class="jtool-field" data-if-woman${sex === 'f' ? '' : ' hidden'}><legend>תקופת אכשרה לאישה</legend><div class="jtool-chips">${chip('status', 'worker', 'עבדתי או שילמתי דמי ביטוח', status === 'worker')}${chip('status', 'exempt', 'פטורה (רווקה, גרושה, אלמנה ועוד)', status === 'exempt')}${chip('status', 'housewife', 'עקרת בית, נשואה למבוטח', status === 'housewife')}</div><p class="jtool-hint">${esc(z.achshara.exempt_he)}.</p></fieldset>`
		+ `${field('years', 'שנות ביטוח בביטוח לאומי', show(input.years), 'לדוגמה: 28')}<p class="jtool-hint">${esc(z.seniority.he)}. ${esc(z.achshara.he)}.</p>`
		+ `<fieldset class="jtool-field"><legend>מי במשפחה</legend><div class="jtool-chips">${chip('fam', 'single', 'יחיד', fam === 'single')}${chip('fam', 'couple', 'בני זוג', fam === 'couple')}</div><p class="jtool-error" id="${P}-fam-e" role="alert"></p></fieldset>`
		+ `<div data-if-couple${fam === 'couple' ? '' : ' hidden'}><div class="jtool-row">${field('spouseBirth', 'תאריך הלידה של בן או בת הזוג', isoToHe(toIso(input.spouseBirth)), 'לדוגמה: 2.4.1962')}${moneyField('spouseIncome', 'הכנסת בן או בת הזוג בחודש, ברוטו', input.spouseIncome, '0')}</div>`
		+ `<div class="jtool-chips">${chip('together', '1', 'נשואים או חיים יחד שנה לפחות, או שיש ילד משותף', input.together !== false, 'checkbox')}${chip('spension', '1', 'בן או בת הזוג מקבלים קצבה מהביטוח הלאומי', input.spousePension === true, 'checkbox')}</div><p class="jtool-hint">${esc(z.spouse.wife_he)}. ${esc(z.spouse.husband_he)}.</p></div>`
		+ `<fieldset class="jtool-field"><legend>ילדים שאתם מפרנסים</legend><div class="jtool-chips">${[0, 1, 2, 3].map((n) => chip('kids', n, n === 3 ? '3 ומעלה' : String(n), kids === n)).join('')}</div><p class="jtool-hint">${esc(z.spouse.child_he)}.</p></fieldset>`
		+ `${moneyField('work', 'הכנסה מעבודה בחודש, ברוטו, בין גיל הפרישה ל-70 (0 אם לא תעבדו)', input.work, 'לדוגמה: 11,000')}`
		+ `${moneyField('other', 'הכנסה שלא מעבודה בחודש (שכר דירה, ריבית; לא פנסיה)', input.other, '0')}<p class="jtool-hint">${esc(z.income_test.excluded_he)}.</p>`
		+ `<details class="jtool-more"${show(input.workYears) || input.waive || input.disability || input.immigrant || input.decision ? ' open' : ''}><summary>עוד מצבים: כמה שנים עובדים, ויתור, נכות, עלייה, החלטה</summary><div style="margin-top:8px">`
		+ `${field('workYears', 'כמה שנים תעבדו אחרי גיל הפרישה (ריק: עד 70)', show(input.workYears), 'לדוגמה: 2')}`
		+ `<div class="jtool-chips">${chip('waive', '1', 'לוותר על קצבה חלקית ולקבל תוספת דחייה', input.waive === true, 'checkbox')}${chip('disab', '1', 'קיבלתי קצבת נכות כללית עד גיל הפרישה', input.disability === true, 'checkbox')}${chip('immig', '1', 'עליתי לראשונה אחרי גיל 62 (גבר) או אחרי גיל הפרישה (אישה)', input.immigrant === true, 'checkbox')}</div>`
		+ `<div data-if-grant${grantShown ? '' : ' hidden'} style="margin-top:8px"><div class="jtool-chips">${chip('gwork', '1', 'עבדתי בארבעת החודשים שמגיל 62', input.grantWork === true, 'checkbox')}</div><p class="jtool-hint">${esc(z.grant.he)}. ${esc(z.grant.rate_he)}.</p></div>`
		+ `${field('decision', 'היום שבו נמסרה החלטה של הביטוח הלאומי (לא חובה)', isoToHe(toIso(input.decision)), 'לדוגמה: 1.12.2026')}<p class="jtool-hint">${esc(z.appeal.he)}.</p></div></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const z = reg.rights_zikna;
	if (r.verdict === 'no') { return `לפי מה שהוזן אין זכאות לקצבת אזרח ותיק: ${r.gates.find((g) => g.state === 'no').he}.`; }
	if (r.immigrant) { return `${z.insured.special_he}: לפי הסכומים הבסיסיים ${nis(r.head.pay)} בחודש, והזכאות נבדקת בסניף.`; }
	const h = r.head;
	const out = [`קצבת אזרח ותיק של ${nis(h.pay)} בחודש מ-${isoToHe(h.from)} (${famHe(r)}, ${h.he}).`];
	if (r.seventy && r.seventy !== h) { out.push(`בגיל ${r.elig.years}, ב-${isoToHe(r.elig.date)}: ${nis(r.seventy.pay)}${r.deferPct ? `, עם תוספת דחייה של ${r.deferPct}%` : ''}.`); }
	if (!r.toSeventy) { out.push(`גיל הפרישה ${ageHe(r.ret.years, r.ret.months)}, ב-${isoToHe(r.ret.date)}.`); }
	if (r.test && r.test.state === 'partial' && !r.waived) { out.push(`ההכנסה מעבודה מורידה ${nis(Math.round(r.test.deduction * 100) / 100)} מהקצבה המלאה (${nis(r.start.full)}).`); }
	if (r.grant && r.grant.state !== 'no' && !r.grant.past) { out.push(`מענק מעבר: עד ${nis(r.grant.rate)} לחודש, 4 חודשים מ-${isoToHe(r.grant.from)}; מגישים עד ${isoToHe(r.grant.deadline)}.`); }
	if (r.verdict === 'check') { out.push(`לבדיקה: ${r.gates.filter((g) => g.state === 'check').map((g) => GATE_HE[g.key]).join(', ')}.`); }
	return out.join(' ');
}

/**
 * The retirement-age clock: the life line from the birth date (broken after 58) to 82, right to left. The labels never meet:
 * each post's label (retirement age above the line, 70 and 80 below it, today above) takes the nearest free row on its side,
 * a row where it does not touch another label, does not sit on another post's leader and keeps its own leader clear; the
 * today line is cut wherever it would cross any text. All y values are relative to the line; the viewBox fits the rows used.
 */
function clock(reg, r) {
	const z = reg.rights_zikna;
	const w = 360;
	const right = 350;
	const brk = 318;
	const left = 14;
	const lo = 58;
	const hi = 82;
	const lh = 24;
	const rowH = 82;
	const yrs = (iso) => { const [y, m, d] = iso.split('-').map(Number); const [by, bm, bd] = r.birth.split('-').map(Number); return (y - by) + (m - bm) / 12 + (d - bd) / 365; };
	const xa = (a) => (a <= lo ? right - (Math.max(0, a) / lo) * (right - brk - 8) : brk - ((Math.min(a, hi) - lo) / (hi - lo)) * (brk - left));
	const f = (v) => v.toFixed(1);
	// Hebrew at 17 units (dates and ticks at 15): about 9.3 and 8 units a character, with a margin.
	const width = (line) => String(line.t).length * (line.c === 'date' || line.c === 'tick' || line.c === 'win' ? 8 : 9.3) + 12;
	const boxes = [];
	const placed = [];
	const text = (cx, y, t, c) => `<text class="${P}-ck__t ${P}-ck__t--${c}" x="${f(cx)}" y="${f(y)}" text-anchor="middle">${esc(t)}</text>`;
	/** Put a label in the nearest free row: its side first, then the other side. */
	const place = (lab) => {
		const wd = Math.max(...lab.lines.map(width));
		const cx = Math.min(w - 2 - wd / 2, Math.max(2 + wd / 2, lab.x));
		const h = lab.lines.length * lh + 2;
		const sides = lab.side === 'above' ? ['above', 'below'] : ['below', 'above'];
		for (let row = 0; row < 4; row += 1) {
			for (const side of sides) {
				const y0 = side === 'above' ? -28 - row * rowH - h : 46 + row * rowH;
				const box = { x0: cx - wd / 2, x1: cx + wd / 2, y0, y1: y0 + h };
				const ok = placed.every((p) => {
					if (p.side !== side) { return true; }
					if (p.row === row && box.x0 < p.box.x1 + 6 && p.box.x0 - 6 < box.x1) { return false; }
					if (lab.post && p.row < row && lab.x > p.box.x0 - 4 && lab.x < p.box.x1 + 4) { return false; }
					if (p.post && p.row > row && p.x > box.x0 - 4 && p.x < box.x1 + 4) { return false; }
					return true;
				});
				if (ok) { const out = Object.assign({}, lab, { side, row, box, cx }); placed.push(out); boxes.push(box); return out; }
			}
		}
		return null;
	};
	const cond = r.conditional;
	const xc = xa(cond.years + cond.months / 12);
	const x70 = xa(r.elig.years + r.elig.months / 12);
	const x80 = xa(z.amounts.from80);
	const xt = xa(r.now.years + r.now.months / 12);
	const ret = r.toSeventy ? null : place({ x: xc, post: true, side: 'above', lines: [{ t: 'גיל הפרישה', c: 'ret' }, { t: ageHe(cond.years, cond.months), c: 'ret' }, { t: isoToHe(cond.date), c: 'date' }] });
	const seventy = place({ x: x70, post: true, side: 'below', lines: [{ t: `גיל ${ageHe(r.elig.years, r.elig.months)}`, c: 'elig' }].concat(r.toSeventy ? [{ t: 'הקצבה מתחילה', c: 'elig' }] : []).concat([{ t: isoToHe(r.elig.date), c: 'date' }]) });
	const eighty = place({ x: x80, post: true, side: 'below', lines: [{ t: `גיל ${z.amounts.from80}`, c: 'eighty' }, { t: isoToHe(r.at80), c: 'date' }] });
	const today = place({ x: xt, post: false, side: 'above', lines: [{ t: `היום, גיל ${r.now.years}`, c: 'today' }] });
	let back = '';
	let front = '';
	// The income-test window above the line, its name inside when it fits.
	if (r.window > 0) {
		back += `<rect class="${P}-ck__win" x="${f(x70)}" y="-22" width="${f(xc - x70)}" height="21"></rect>`;
		if (r.stop < r.elig.date) { const xs = xa(yrs(r.stop)); back += `<line class="${P}-ck__stop" x1="${f(xs)}" x2="${f(xs)}" y1="-22" y2="-1"></line>`; }
		const wl = width({ t: 'מבחן הכנסות', c: 'win' });
		if (xc - x70 > wl + 8) { const cx = (xc + x70) / 2; front += text(cx, -5, 'מבחן הכנסות', 'win'); boxes.push({ x0: cx - wl / 2, x1: cx + wl / 2, y0: -21, y1: -1 }); }
	}
	// The transition grant's 4 months from 62, a short bar on the line (it ends where the women's retirement age can start).
	if (r.grant) {
		const g1 = xa(yrs(r.grant.from));
		const g2 = xa(yrs(r.grant.to));
		back += `<rect class="${P}-ck__grant${r.grant.state === 'no' ? ` ${P}-ck__grant--no` : ''}" x="${f(g2)}" y="-9" width="${f(Math.max(3, g1 - g2))}" height="8"></rect>`;
	}
	// The women's schedule step: a bracket under the line, from 62 to the reader's retirement age.
	if (r.sex === 'f' && r.womenStep > 0) {
		const x62 = xa(z.ages.women_now_from);
		const xr = xa(r.ret.years + r.ret.months / 12);
		back += `<path class="${P}-ck__step" d="M${f(x62)} 6 V13 H${f(xr)} V6"></path>`;
	}
	// The life line, the break, the birth, the ticks (a tick's number gives way to a post's leader and to the labels).
	back += `<line class="${P}-ck__life" x1="${f(right)}" x2="${f(brk)}" y1="0" y2="0"></line><line class="${P}-ck__life" x1="${f(brk - 8)}" x2="${f(left)}" y1="0" y2="0"></line>`;
	back += `<path class="${P}-ck__brk" d="M${f(brk + 1)} -7 L${f(brk - 3)} 7 M${f(brk - 5)} -7 L${f(brk - 9)} 7"></path><circle class="${P}-ck__birth" cx="${f(right)}" cy="0" r="4.5"></circle>`;
	const ticks = [{ x: right, t: r.birth.slice(0, 4) }].concat([60, 65, 70, 75, 80].map((a) => ({ x: xa(a), t: String(a), tick: true })));
	const leaders = placed.filter((p) => p.post && p.side === 'below').map((p) => p.x);
	ticks.forEach((k) => {
		if (k.tick) { back += `<line class="${P}-ck__tick" x1="${f(k.x)}" x2="${f(k.x)}" y1="0" y2="6"></line>`; }
		const wd = width({ t: k.t, c: 'tick' });
		const cx = Math.min(w - 2 - wd / 2, Math.max(2 + wd / 2, k.x));
		const box = { x0: cx - wd / 2, x1: cx + wd / 2, y0: 17, y1: 39 };
		if (leaders.some((x) => x > box.x0 - 3 && x < box.x1 + 3) || boxes.some((b) => b.x0 < box.x1 && box.x0 < b.x1 && b.y0 < box.y1 && box.y0 < b.y1)) { return; }
		boxes.push(box);
		front += text(cx, 34, k.t, 'tick');
	});
	// The posts: a leader from the line to the label, never into another label; then the label.
	placed.forEach((p) => {
		const cls = p === ret ? 'ret' : p === today ? 'today' : p === eighty ? 'eighty' : 'elig';
		if (p.post) { back += `<line class="${P}-ck__post ${P}-ck__post--${cls}" x1="${f(p.x)}" x2="${f(p.x)}" y1="${p.side === 'above' ? -1 : 1}" y2="${f(p.side === 'above' ? p.box.y1 + 4 : p.box.y0 - 4)}"></line>`; }
		p.lines.forEach((line, i) => { front += text(p.cx, p.box.y0 + 18 + i * lh, line.t, line.c); });
	});
	// The frame: the rows actually used.
	const top = Math.min(-28, ...boxes.map((b) => b.y0)) - 6;
	const bottom = Math.max(41, ...boxes.map((b) => b.y1)) + 6;
	// Today: a dashed line over the whole height, cut wherever it would cross text.
	// It runs from its own label to the far edge of the picture.
	const own = today ? today.box : null;
	const end = own && own.y0 > 0 ? own.y0 - 4 : bottom - 2;
	const cuts = boxes.filter((b) => b !== own && xt > b.x0 - 3 && xt < b.x1 + 3).map((b) => [b.y0 - 4, b.y1 + 4]).sort((a, b) => a[0] - b[0]);
	let from = own && own.y0 < 0 ? own.y1 + 4 : top + 2;
	let todayLine = '';
	cuts.forEach(([a, b]) => { if (b <= from) { return; } if (a > from + 2) { todayLine += `<line class="${P}-ck__today" x1="${f(xt)}" x2="${f(xt)}" y1="${f(from)}" y2="${f(Math.min(a, end))}"></line>`; } from = Math.max(from, b); });
	if (end > from + 2) { todayLine += `<line class="${P}-ck__today" x1="${f(xt)}" x2="${f(xt)}" y1="${f(from)}" y2="${f(end)}"></line>`; }
	const label = `שעון גיל הפרישה: נולדתם ב-${r.birth.slice(0, 4)}; ${r.toSeventy ? '' : `גיל הפרישה ${ageHe(cond.years, cond.months)} ב-${isoToHe(cond.date)}; `}גיל ${ageHe(r.elig.years, r.elig.months)} ב-${isoToHe(r.elig.date)}; ${z.amounts.from80} ב-${isoToHe(r.at80)}; היום אתם בני ${r.now.years}`;
	return `<svg class="${P}-ck__svg" viewBox="0 ${f(top)} ${w} ${f(bottom - top)}" role="img" aria-label="${esc(label)}">${back}${todayLine}${front}</svg>`;
}

/** The pension ledger: one bar per phase, the parts stacked, the income-test reduction as a cut. */
function ledgerBars(reg, r) {
	const rows = r.phases.map((ph) => {
		const p = ph.p;
		const cut = ph.test && ph.test.state !== 'full' && !ph.test.disability ? Math.max(0, p.total - ph.pay) : 0;
		return { ph, p, cut, sum: p.total };
	});
	const top = Math.max(...rows.map((x) => x.sum), 1);
	const seg = (cls, v, label) => (v > 0 ? `<span class="${P}-lg__s ${P}-lg__s--${cls}" style="width:${(v / top * 100).toFixed(2)}%" title="${esc(`${label}: ${nis(v)}`)}"></span>` : '');
	const body = rows.map(({ ph, p, cut }) => {
		const kept = cut ? Math.max(0, p.total - cut) : p.total;
		const scale = p.total ? kept / p.total : 0;
		const parts = cut && kept === 0 ? seg('cut', p.total, 'מבחן ההכנסות')
			: seg('base', p.base * (cut ? scale : 1), 'הקצבה הבסיסית') + seg('dep', (p.spouse + p.children) * (cut ? scale : 1), 'תוספת תלויים') + seg('sen', p.seniority * (cut ? scale : 1), 'תוספת ותק') + seg('def', p.deferral * (cut ? scale : 1), 'תוספת דחייה') + seg('cut', cut, 'מבחן ההכנסות');
		return `<li class="${P}-lg__row"><span class="${P}-lg__h"><strong>${esc(isoToHe(ph.from))}</strong> ${esc(ph.he)}</span><span class="${P}-lg__bar" aria-hidden="true">${parts}</span><span class="${P}-lg__v">${ilsn(ph.pay)}</span></li>`;
	}).join('');
	return `<figure class="${P}-lg"><figcaption class="${P}-lg__cap">פנקס הקצבה, בערכי ${esc(reg.rights_zikna.from.slice(0, 4))}: מה בונה כל שקל, ומה מבחן ההכנסות חותך</figcaption><ol class="${P}-lg__rows">${body}</ol>`
		+ `<p class="${P}-lg__key"><span><i class="${P}-k ${P}-k--base"></i>קצבה בסיסית</span><span><i class="${P}-k ${P}-k--dep"></i>בן זוג וילדים</span><span><i class="${P}-k ${P}-k--sen"></i>תוספת ותק</span><span><i class="${P}-k ${P}-k--def"></i>תוספת דחייה</span><span><i class="${P}-k ${P}-k--cut"></i>נחתך במבחן ההכנסות</span></p></figure>`;
}

function ladder(reg, r) {
	const rungs = r.gates.map((g) => `<li class="${P}-rung ${P}-rung--${g.state}"><span class="${P}-rung__s"><b aria-hidden="true">${STATE[g.state]}</b> ${STATE_HE[g.state]}</span><span class="${P}-rung__t"><strong>${esc(GATE_HE[g.key])}</strong><small>${esc(g.he)}</small></span></li>`).join('');
	return `<div class="${P}-gates"><p class="${P}-gates__h">התנאים, אחד אחד</p><ol class="${P}-gates__list">${rungs}</ol></div>`;
}

function nextBlock(reg, r) {
	return `<div class="${P}-next"><p class="${P}-next__h"><strong>מה עושים עכשיו</strong></p><ol class="${P}-next__list">${r.next.map((x) => `<li><a href="${esc(x.url)}"${x.kind === 'official' ? ' target="_blank" rel="noopener"' : ''}>${esc(x.he)}</a>${x.kind === 'official' ? ' <small>(אתר ממשלתי)</small>' : ''}</li>`).join('')}</ol>`
		+ `<p class="${P}-rehearse">${esc(r.rehearse.he)}. <a href="${esc(r.rehearse.url)}" target="_blank" rel="noopener" data-act="rehearse">לתרגול עם דמויות AI</a></p></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const state = r.verdict === 'no' ? '<p class="jtool-state jtool-state--danger">✕ אין זכאות לפי מה שהוזן</p>'
		: r.verdict === 'route' ? '<p class="jtool-state jtool-state--info">i גמלת אזרח ותיק מיוחדת</p>'
			: r.verdict === 'check' ? '<p class="jtool-state jtool-state--warn">! זכאות, בכפוף לבדיקה</p>'
				: '<p class="jtool-state jtool-state--ok">✓ יש זכאות לקצבת אזרח ותיק</p>';
	const h = r.head;
	let out = `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}קצבת אזרח ותיק לחודש, מ-${esc(isoToHe(h.from))}</p>`
		+ `<strong class="jtool-verdict__figure">${r.verdict === 'no' ? '—' : ils(h.pay, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`;
	if (r.verdict !== 'no') {
		out += `<dl class="jtool-breakdown"><div><dt>${r.toSeventy ? 'הקצבה מתחילה' : 'גיל הפרישה'}</dt><dd><bdi>${esc(isoToHe(r.conditional.date))}</bdi></dd></div>`
			+ `<div><dt>בגיל ${r.elig.years}</dt><dd>${r.seventy ? ilsn(r.seventy.pay) : '—'}</dd></div>`
			+ `<div><dt>נכנס לחשבון, אחרי ביטוח בריאות</dt><dd>${ilsn(r.net)}</dd></div>`
			+ `<div><dt>${r.test && !r.test.disability ? 'ההכנסה מעבודה שבה הקצבה נגמרת' : 'בגיל 80'}</dt><dd>${r.test && !r.test.disability ? ilsn(r.test.end) : ilsn(r.phases[r.phases.length - 1].pay)}</dd></div></dl>`;
	}
	out += '</div>';
	out += `<figure class="${P}-ck">${clock(reg, r)}<figcaption class="${P}-ck__cap"><span><i class="${P}-k ${P}-k--win"></i>חלון מבחן ההכנסות</span>${r.sex === 'f' && r.womenStep > 0 ? `<span><i class="${P}-k ${P}-k--step"></i>הדרגה של חוק גיל פרישה: ${r.womenStep} חודשים אחרי 62</span>` : ''}${r.grant ? `<span><i class="${P}-k ${P}-k--grant"></i>4 חודשי מענק המעבר</span>` : ''}<span><i class="${P}-k ${P}-k--today"></i>היום</span></figcaption></figure>`;
	out += ledgerBars(reg, r);
	out += ladder(reg, r);
	const flags = r.flags.filter((x) => x.level !== 'info');
	if (flags.length) { out += `<ul class="jtool-flags">${flags.map((x) => `<li><strong aria-hidden="true">${MARK[x.level]}</strong> ${esc(x.he)}${cite(x.section || 'המוסד לביטוח לאומי', x.url)}</li>`).join('')}</ul>`; }
	out += nextBlock(reg, r);
	return out;
}

export function checklist(reg, r) {
	const z = reg.rights_zikna;
	const out = [
		{ he: 'תביעה לקצבת אזרח ותיק: מקוונת או ידנית, עם המסמכים, ישירות לסניף', section: 'הגשת התביעה', url: z.claim.url },
		{ he: z.claim.he, section: 'המסמכים', url: z.claim.url },
		{ he: z.claim.mail_he, section: 'הטופס בדואר', url: z.claim.url },
	];
	if (r.ok && r.couple) { out.push({ he: 'לתוספת עבור בן או בת הזוג: מידע או אישורים על ההכנסות שלהם', section: 'תוספת תלויים', url: z.spouse.url }); }
	if (r.ok && r.test && !r.test.disability) { out.push({ he: z.income_test.report_he, section: 'מבחן הכנסות', url: z.income_test.extra_url }); }
	if (r.ok && r.work > 0) { out.push({ he: 'שכיר שמקבל קצבה: אישור מהביטוח הלאומי למעסיק, כדי שיפסיק לנכות דמי ביטוח בריאות מהשכר', section: 'ניכויים', url: z.health.url }); }
	if (r.ok && r.grant && r.grant.state !== 'no' && !r.grant.past) { out.push({ he: `בקשה למענק מעבר, ${z.grant.deadline_he}: באזור האישי, בטופס באתר או בסניף`, section: z.grant.section, url: z.grant.claim_url }); }
	out.push({ he: z.claim.retro_he, section: 'רטרואקטיבי', url: z.claim.url });
	return out;
}
export function checklistText(reg, r) { return checklist(reg, r).map((x, i) => `${i + 1}. ${x.he} (${x.section})`).join('\n'); }

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const z = reg.rights_zikna;
	const btl = reg.rights_btl;
	const it = z.income_test;
	const b3 = btl.basic_amount.b3;
	const p = r.start;
	let out = '';
	// 1. The ledger of the first phase, line by line, with the law.
	const rows = [];
	rows.push([`הקצבה הבסיסית: <bdi>${p.base === z.amounts.basic80 ? z.amounts.pct.basic80 : z.amounts.pct.basic}% × ${money(b3, 0)} = ${money(b3 * (p.base === z.amounts.basic80 ? z.amounts.pct.basic80 : z.amounts.pct.basic) / 100)}</bdi>, מעוגל לשקל`, ilsn(p.base), `סכום בסיסי 3 מ-${esc(isoToHe(btl.from))}${cite(z.amounts.section, z.law_url)}${cite('סכום הקצבה', z.amounts.url)}`]);
	if (p.spouse) { rows.push([`תוספת לבן או בת הזוג: <bdi>${z.amounts.pct.spouse}% × ${money(b3, 0)} = ${money(b3 * z.amounts.pct.spouse / 100)}</bdi>`, `+${ilsn(p.spouse)}`, `${esc(r.gates.find((g) => g.key === 'spouse').he)}${cite('סעיף 244(ב)(1); סעיף 247', z.law_url)}`]); }
	if (p.children) { rows.push([`תוספת ל-${p.kids === 1 ? 'ילד' : `${p.kids} ילדים`}: <bdi>${p.kids} × ${z.amounts.pct.child}% × ${money(b3, 0)}</bdi>, ${money(z.amounts.child, 0)} לילד`, `+${ilsn(p.children)}`, `עד ${z.amounts.max_children} ילדים${cite('סעיף 244(ב)(2)', z.law_url)}${cite('תוספת עבור ילדים', z.amounts.dependants_url)}`]); }
	rows.push([`תוספת ותק: <bdi>${z.seniority.pct_per_year}% × ${r.years}</bdi> שנים${r.basicOnly ? ' (קצבה בסיסית, בלי ותק)' : r.years * z.seniority.pct_per_year > z.seniority.max_pct ? `, עד ${z.seniority.max_pct}%` : ''} = <bdi>${p.senPct}%</bdi> מ-${money(p.subtotal, 0)}`, `+${ilsn(p.seniority)}`, `${cite(z.seniority.section, z.law_url)}${cite('תוספת ותק', z.seniority.url)}`]);
	rows.push(['הקצבה המלאה', ilsn(p.full), `<bdi>${money(p.subtotal, 0)} × ${(100 + p.senPct) / 100}</bdi>, מעוגל לשקל`]);
	const t = r.test;
	if (t && t.disability) { rows.push(['מבחן הכנסות', ilsn(0), `${esc(it.disability_he)}${cite('מעבר מקצבאות אחרות', z.from_other.url)}`]); } else if (t) {
		rows.push([`ההכנסה המרבית: ${r.deps === 0 ? `<bdi>${it.max_pct.none}%</bdi>` : `<bdi>${r.max.pct}%</bdi> (${r.deps} תלויים)`} × <bdi>${money(btl.avg_wage.s2_benefits, 0)}</bdi> = <bdi>${money(r.max.exact)}</bdi>`, ilsn(t.max), `השכר הממוצע לפי סעיף 2${cite(it.table_section, it.tables_url)}${cite('מבחן הכנסות מעבודה', it.work_url)}`]);
		rows.push([`הכנסה שנחשבת: מעבודה ${m2(t.work)}${t.other ? `, ושלא מעבודה ${m2(t.other)} פחות <bdi>${it.both_other_mult} × ${money(t.max, 0)}</bdi> = ${m2(t.otherCounted)}` : ''}`, ilsn(t.counted), t.other ? `${esc(it.other_he)}${cite('הכנסות שלא מעבודה', it.other_url)}` : `${esc(it.excluded_he)}${cite(it.section, z.law_url)}`]);
		if (t.excess > 0) {
			rows.push([`מבחן ההכנסות: <bdi>${it.deduct_pct}% × (${m2(t.counted)} − ${money(t.max, 0)}) = ${m2(t.deduction)}</bdi>`, `−${ilsn(Math.min(t.deduction, p.full))}`, `${t.state === 'none' ? `נשאר פחות מ-${money(it.min_partial, 0)} ש"ח (${it.min_partial_pct}% מהקצבה הבסיסית): לא משולם` : 'קצבה חלקית'}${cite(it.section, z.law_url)}${cite('קצבה חלקית', it.partial_url)}`]);
			rows.push([`הקצבה החלקית: <bdi>${money(p.full, 0)} − ${m2(t.deduction)} = ${m2(t.partial)}</bdi>${t.state === 'partial' ? ', מעוגל לשקל' : ''}`, ilsn(t.pay), t.state === 'partial' ? `לא פחות מ-${money(it.min_partial, 0)} ש"ח` : `פחות מ-${money(it.min_partial, 0)} ש"ח: עד גיל ${r.elig.years} לא משולם`]);
		}
		if (r.waived) { rows.push(['ויתור על הקצבה החלקית', ilsn(0), `${esc(it.waive_he)}${cite('סעיף 249(ג)', z.law_url)}`]); }
	}
	const p1 = r.phases[0];
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-calc-h">כמה, על מה, ולפי איזה סעיף</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-calc-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([a, b, c]) => `<tr><td data-th="מה">${a}</td><td data-th="סכום">${b}</td><td data-th="הכלל">${c}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="מה">קצבה לחודש מ-${esc(isoToHe(p1.from))}</td><td data-th="סכום">${ilsn(p1.pay)}</td><td data-th="הכלל">${esc(p1.he)}</td></tr>`
		+ `<tr><td data-th="מה">דמי ביטוח בריאות שיורדים מהקצבה</td><td data-th="סכום">−${ilsn(r.health)}</td><td data-th="הכלל">${esc(r.health ? z.health.he : z.health.wife_he)}${cite('ניכויים מהקצבה', z.health.url)}</td></tr>`
		+ `</tbody><caption>${esc(`${z.claim.pay_he}. הסכומים בערכי ${z.from.slice(0, 4)}, ברוטו; הסכום הבסיסי מתעדכן ב-1 בינואר לפי המדד.`)}${cite('הסכום הבסיסי', z.history_url)}</caption></table></div></div>`;
	// 2. The phases: the text of the clock and the ledger.
	out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-ph-h">הקצבה לאורך השנים</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-ph-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתאריך</th><th scope="col">עד</th><th scope="col">מה</th><th scope="col">בסיס ותלויים</th><th scope="col">ותק</th><th scope="col">דחייה</th><th scope="col">לחודש</th></tr></thead><tbody>`
		+ r.phases.map((ph) => `<tr${ph === r.head ? ` class="${P}-you"` : ''}><td data-th="מתאריך"><bdi>${esc(isoToHe(ph.from))}</bdi></td><td data-th="עד">${ph.to ? `<bdi>${esc(isoToHe(ph.to))}</bdi>` : '—'}</td><td data-th="מה">${esc(ph.he)}</td><td data-th="בסיס ותלויים">${ilsn(ph.p.subtotal)}</td><td data-th="ותק">${ilsn(ph.p.seniority)}</td><td data-th="דחייה">${ph.p.deferral ? ilsn(ph.p.deferral) : '—'}</td><td data-th="לחודש">${ilsn(ph.pay)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(`${z.deferral.he}${r.deferYears ? `: כאן ${r.deferYears} שנים, ${r.deferPct}%` : ''}. ${z.deferral.nine_he}.`)}${cite(z.deferral.section, z.law_url)}${cite('תוספת דחיית קצבה', z.deferral.url)}</caption></table></div></div>`;
	// 3. The gates.
	out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-gate-h">תנאי הזכאות, עם הסעיף של כל אחד</h3></div><ul class="${P}-gate">`
		+ r.gates.map((g) => `<li class="${P}-gate__i ${P}-gate__i--${g.state}"><strong aria-hidden="true">${STATE[g.state]}</strong> ${esc(GATE_HE[g.key])}: ${esc(g.he)}${cite(g.section || 'המוסד לביטוח לאומי', g.url)}</li>`).join('') + '</ul></div>';
	// 4. The income staircase in text.
	if (t && !t.disability) {
		const pts = [0, t.max, t.max + 1, t.end - 1, t.end].filter((w, i, a) => w >= 0 && a.indexOf(w) === i);
		if (r.work > 0 && !pts.includes(r.work)) { pts.push(r.work); }
		pts.sort((a, b) => a - b);
		const why = (w) => (w === r.work && r.work > 0 ? 'אתם' : w === 0 ? 'בלי הכנסה מעבודה' : w === t.max ? 'ההכנסה המרבית: קצבה מלאה' : w === t.max + 1 ? 'מכאן 60% מכל שקל יורדים' : w === t.end - 1 ? 'השקל האחרון עם קצבה' : w === t.end ? 'הקצבה לא משולמת' : '');
		const at = (w) => { const x = Math.max(0, w + t.otherCounted - t.max); const part = p.full - x * it.deduct_pct / 100; return x === 0 ? p.full : part >= it.min_partial ? Math.floor(part + 0.5 + 1e-9) : 0; };
		out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-led-h">הכנסה מעבודה וקצבה, עד גיל ${r.elig.years}</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-led-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">הכנסה מעבודה</th><th scope="col">קצבה</th><th scope="col">ביחד</th><th scope="col">מה קורה כאן</th></tr></thead><tbody>`
			+ pts.map((w) => `<tr${w === r.work && r.work > 0 ? ` class="${P}-you"` : ''}><td data-th="הכנסה מעבודה">${ilsn(w)}</td><td data-th="קצבה">${ilsn(at(w))}</td><td data-th="ביחד">${ilsn(w + at(w))}</td><td data-th="מה קורה כאן">${esc(why(w))}</td></tr>`).join('')
			+ `</tbody><caption>${esc(`הקצבה נגמרת בהכנסה של ${money(t.end, 0)} ₪ לקצבה מלאה של ${money(p.full, 0)} ₪. בדף של המוסד: ${money(it.end_single, 0)} ₪ ליחיד ו-${money(it.end_couple, 0)} ₪ לזוג, לקצבה עם תוספת ותק מלאה.`)}${cite('קצבה חלקית', it.partial_url)}</caption></table></div></div>`;
	}
	// 5. The dates.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3>${r.deadlines.some((d) => d.ics) ? '<div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div>' : ''}</div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ r.deadlines.map((x) => `<tr class="${x.ics ? `${P}-dl--key` : x.past ? `${P}-dl--past` : ''}"><td data-th="תאריך"><bdi>${esc(isoToHe(x.date))}</bdi>${x.past ? ' <small>(עבר)</small>' : ''}</td><td data-th="מה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section || 'המוסד לביטוח לאומי', x.url)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(`${z.claim.first_he}. ${z.claim.retro_he}.`)}${cite('תשלום הקצבה', z.claim.payment_url)}</caption></table></div></div>`;
	// 6. The transition grant.
	if (r.grant) {
		const g = r.grant;
		const gr = z.grant;
		out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-gr-h">מענק המעבר לנשים ילידות ${gr.born_from} עד ${gr.born_to}</h3></div>`
			+ `<p class="${P}-note">${esc(`${gr.he}: מ-${isoToHe(g.from)} עד ${isoToHe(g.to)}. ילידת ${r.birth.slice(0, 4)}: עד ${money(g.rate, 0)} ₪ לחודש, עד ${money(g.total, 0)} ₪ ב-${g.months} חודשים. ${gr.rate_he}. ${gr.deadline_he}: ${isoToHe(g.deadline)}${g.past ? ' (המועד עבר)' : ''}. ${g.state === 'no' ? (r.grantWork ? 'לפי מה שהוזן עבדתם בחודשים האלה, ולכן אין מענק בעדם.' : 'לפי מה שהוזן תנאי הזכאות לקצבה לא מתקיים.') : ''}`)}${cite(gr.section, gr.law_url)}${cite('סכום המענק', gr.amount_url)}</p>`
			+ `<ul class="${P}-info">${gr.conditions_he.map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>`;
	}
	// 7. What to file.
	out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">מה מגישים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ol class="${P}-list">${checklist(reg, r).map((x) => `<li>${esc(x.he)}${cite(x.section, x.url)}</li>`).join('')}</ol></div>`;
	// 8. What changed and when.
	out += historyTable(reg, `${P}-noprint`);
	const info = r.flags.filter((x) => x.level === 'info');
	if (info.length) { out += `<div class="jtool-tablewrap ${P}-noprint"><div class="jtool-tablewrap__head"><h3 id="${P}-info-h">עוד לפני שמגישים</h3></div><ul class="${P}-info">${info.map((x) => `<li>${esc(x.he)}${cite(x.section || 'המוסד לביטוח לאומי', x.url)}</li>`).join('')}</ul></div>`; }
	return out;
}

/** "What changed and when": basic amount 3 by year, the maximum income of the income test, the women's retirement age. */
export function historyTable(reg, extra = '') {
	const z = reg.rights_zikna;
	const btl = reg.rights_btl;
	const it = z.income_test;
	const rows = z.history.map((x) => [isoToHe(x.from), 'סכום בסיסי 3', `${money(x.b3, 0)} ₪ (${x.change_pct}%)`, cite('הסכום הבסיסי', z.history_url)]);
	rows.push([isoToHe(btl.from), 'סכום בסיסי 3, ומכאן הקצבה ליחיד', `${money(btl.basic_amount.b3, 0)} ₪ (${btl.basic_amount.b3_change_pct}%); ${z.amounts.pct.basic}% = ${money(z.amounts.basic, 0)} ₪`, cite('סכום הקצבה', z.amounts.url)]);
	it.history.forEach((x) => rows.push([x.from ? isoToHe(x.from) : `עד ${isoToHe(x.to)}`, `ההכנסה המרבית במבחן ההכנסות (${x.table})`, `${x.none}% מהשכר הממוצע ליחיד, ${x.one}% עם תלוי${x.from && !x.to ? `; ב-${btl.from.slice(0, 4)}: ${money(it.single, 0)} ו-${money(it.couple, 0)} ₪` : ''}`, cite('לוח ט1', it.tables_url)]));
	rows.push([isoToHe('2022-01-01'), 'מענק מעבר לנשים (סעיף 269א, תיקון 228); גיל הפרישה לנשים עולה בהדרגה מ-62 ל-65', 'ילידות 1960: 62 ו-4 חודשים; ילידות 1970 ואילך: 65', cite('חוק גיל פרישה', z.retirement_law_url)]);
	return `<div class="jtool-tablewrap${extra ? ` ${extra}` : ''}"><div class="jtool-tablewrap__head"><h3 id="${P}-hist-h">מה השתנה ומתי</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-hist-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתאריך</th><th scope="col">מה</th><th scope="col">ערך</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתאריך"><bdi>${esc(x[0])}</bdi></td><td data-th="מה">${esc(x[1])}</td><td data-th="ערך"><bdi>${esc(x[2])}</bdi></td><td data-th="מקור">${x[3]}</td></tr>`).join('')
		+ `</tbody><caption>${esc(`כל סכום בקצבה הוא אחוז קבוע מהסכום הבסיסי (${z.amounts.section}), ולכן הוא עולה ב-1 בינואר בשיעור עליית המדד.`)}</caption></table></div></div>`;
}

/** Page section: the retirement age by month of birth. */
export function agesTable(reg) {
	const z = reg.rights_zikna;
	const ymHe = (ym) => (ym ? `${Number(ym.slice(5))}/${ym.slice(0, 4)}` : '');
	const rows = z.ages.women_retirement.filter((x) => !x[0] || x[0] >= '1947-05').map((x) => `<tr><td data-th="נולדה">${x[0] && x[1] ? (x[0].slice(0, 4) === x[1].slice(0, 4) && x[0].slice(5) === '01' && x[1].slice(5) === '12' ? x[0].slice(0, 4) : `${ymHe(x[0])} עד ${ymHe(x[1])}`) : x[0] ? `${ymHe(x[0])} ואילך` : `עד ${ymHe(x[1])}`}</td><td data-th="גיל הפרישה">${esc(ageHe(x[2], x[3]))}</td><td data-th="מעל 62">${(x[2] - z.ages.women_now_from) * 12 + x[3]} חודשים</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`גיל הפרישה לאישה לפי חודש הלידה (${z.ages.retirement_section}); גבר: ${z.ages.men_now}; גיל הזכאות, בלי מבחן הכנסות: ${z.ages.men_eligibility} לגברים ולנשים`)}${cite('גיל הפרישה', z.ages.url)}</caption>`
		+ `<thead><tr><th scope="col">נולדה</th><th scope="col">גיל הפרישה</th><th scope="col">מעל 62</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the 2026 amounts by family, from the Institute's table, and the supplement's targets. */
export function amountsTable(reg) {
	const z = reg.rights_zikna;
	const a = z.amounts.published;
	const sup = z.supplement.table;
	const sn = z.seniority;
	const line = (he, k, k80, sk) => `<tr><td data-th="הרכב המשפחה">${esc(he)}</td><td data-th="קצבה בסיסית">${ilsn(a[k])}</td><td data-th="עם ותק מלא (50%)">${ilsn(Math.floor(a[k] * (100 + sn.max_pct) / 100 + 0.5 + 1e-9))}</td><td data-th="מגיל 80">${k80 ? ilsn(a[k80]) : '—'}</td><td data-th="עם השלמת הכנסה, עד 70">${ilsn(sup.to70[sk])}</td></tr>`;
	const rows = line('יחיד', 'single', 'single80', 'single') + line('זוג', 'couple', 'couple80', 'couple') + line('יחיד וילד', 'single_child', null, 'single_child') + line('יחיד ו-2 ילדים ויותר', 'single_children', null, 'single_children') + line('זוג וילד', 'couple_child', null, 'couple_child') + line('זוג ו-2 ילדים ויותר', 'couple_children', null, 'couple_children');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`קצבת אזרח ותיק לחודש מ-${isoToHe(z.from)}, לפי הרכב המשפחה (${z.amounts.section}; ${z.amounts.section80}); עם תוספת ותק של ${sn.max_pct}% (25 שנות ביטוח ומעלה); ובעמודה האחרונה הקצבה עם תוספת השלמת הכנסה עד גיל 70`)}${cite('סכום הקצבה', z.amounts.url)}${cite('השלמת הכנסה', z.supplement.amounts_url)}</caption>`
		+ `<thead><tr><th scope="col">הרכב המשפחה</th><th scope="col">קצבה בסיסית</th><th scope="col">עם ותק מלא (50%)</th><th scope="col">מגיל 80</th><th scope="col">עם השלמת הכנסה, עד 70</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the income test of 2026. */
export function incomeTable(reg) {
	const z = reg.rights_zikna;
	const it = z.income_test;
	const row = (he, work, end, other, both) => `<tr><td data-th="מי">${esc(he)}</td><td data-th="קצבה מלאה עד (עבודה)">${ilsn(work)}</td><td data-th="אין קצבה מעל (עבודה)">${ilsn(end)}</td><td data-th="קצבה מלאה עד (לא מעבודה)">${ilsn(other[0])}</td><td data-th="אין קצבה מעל (לא מעבודה)">${ilsn(other[1])}</td><td data-th="גם וגם: עבודה / לא מעבודה">${ilsn(both[0])} / ${ilsn(both[1])}</td></tr>`;
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`מבחן ההכנסות מגיל הפרישה עד 70, לחודש, מ-${isoToHe(z.from)} (${it.section}; ${it.table_section}). בין שני הספים: קצבה חלקית, ${it.deduct_pct}% מההפרש יורדים, ולא פחות מ-${money(it.min_partial, 0)} ש"ח. הספים העליונים לקצבה עם ותק מלא`)}${cite('הכנסות מעבודה', it.work_url)}${cite('הכנסות שלא מעבודה', it.other_url)}${cite('גם וגם', it.both_url)}</caption>`
		+ `<thead><tr><th scope="col">מי</th><th scope="col">קצבה מלאה עד (עבודה)</th><th scope="col">אין קצבה מעל (עבודה)</th><th scope="col">קצבה מלאה עד (לא מעבודה)</th><th scope="col">אין קצבה מעל (לא מעבודה)</th><th scope="col">גם וגם: עבודה / לא מעבודה</th></tr></thead>`
		+ `<tbody>${row('יחיד', it.single, it.end_single, it.other.single, it.both.single)}${row('עם בן או בת זוג', it.couple, it.end_couple, it.other.couple, it.both.couple)}</tbody></table></div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]). Same markup on the server and in the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הנתונים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">קצבת זקנה</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const label = `${opts.example ? 'דוגמה מחושבת' : 'החישוב שלכם'}: קצבת זקנה (אזרח ותיק)`;
	const who = `${r.sex === 'f' ? 'אישה ילידת' : 'גבר יליד'} ${zkMonthHe(r.birth.slice(0, 7))}`;
	if (r.verdict === 'no') {
		return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">אין זכאות</strong></p><p class="jtool-lead__line">${esc(`${who}: ${r.gates.find((g) => g.state === 'no').he}`)}</p>${go}`;
	}
	const h = r.head;
	const line = `${who}, ${famHe(r)}, ${r.years} שנות ביטוח. ${r.toSeventy ? `הקצבה מגיל ${r.elig.years}` : `גיל הפרישה ${ageHe(r.ret.years, r.ret.months)}, ב-${isoToHe(r.ret.date)}`}${r.seventy && r.seventy !== h ? `; בגיל ${r.elig.years}: ${nis(r.seventy.pay)}` : ''}${r.grant && r.grant.state !== 'no' && !r.grant.past ? `; מענק מעבר עד ${nis(r.grant.total)}` : ''}.`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${ils(h.pay, 0)}</strong><span class="jtool-lead__unit">לחודש מ-${esc(isoToHe(h.from))}</span></p>`
		+ `<p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const z = reg.rights_zikna;
	const btl = reg.rights_btl;
	const r = compute(reg, EXAMPLE);
	const it = z.income_test;
	const t = r.test;
	const s = r.phases.find((x) => x.key === 'seventy');
	const e = r.phases.find((x) => x.key === 'eighty');
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.head.pay,
		sticky: ils(r.head.pay, 0),
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>גיל הפרישה לאישה ילידת ${zkMonthHe(r.birth.slice(0, 7))}: ${ageHe(r.ret.years, r.ret.months)}, ${r.womenStep} חודשים אחרי 62; ${isoToHe(r.birth)} ועוד ${ageHe(r.ret.years, r.ret.months)} = ${isoToHe(r.ret.date)}${cite('חוק גיל פרישה, התוספת, חלק ב\'', z.retirement_law_url)}${cite('גיל הפרישה', z.ages.url)}</li>`
			+ `<li>תקופת אכשרה: ${r.years} שנות ביטוח, ${r.years * 12} חודשים, יותר מ-${z.achshara.total_months}${cite(z.achshara.section, z.law_url)}</li>`
			+ `<li>הקצבה ליחיד: <bdi>${z.amounts.pct.basic}% × ${money(btl.basic_amount.b3, 0)} = ${money(btl.basic_amount.b3 * z.amounts.pct.basic / 100)}</bdi>, ${money(z.amounts.basic, 0)} ₪; ותק: <bdi>${z.seniority.pct_per_year}% × ${r.years} = ${r.years * z.seniority.pct_per_year}%</bdi>, עד ${z.seniority.max_pct}%: <bdi>${money(z.amounts.basic, 0)} × 1.5 = ${money(r.start.full, 0)}</bdi> ₪${cite(z.amounts.section, z.law_url)}${cite(z.seniority.section, z.law_url)}</li>`
			+ `<li>מבחן הכנסות עד 70: <bdi>${it.max_pct.none}% × ${money(btl.avg_wage.s2_benefits, 0)} = ${money(r.max.exact)}</bdi>, ההכנסה המרבית ${money(t.max, 0)} ₪; <bdi>${it.deduct_pct}% × (${money(t.work, 0)} − ${money(t.max, 0)}) = ${m2(t.deduction)}</bdi>; <bdi>${money(r.start.full, 0)} − ${m2(t.deduction)} = ${m2(t.partial)}</bdi>, ${money(t.pay, 0)} ₪ לחודש; הקצבה נגמרת בהכנסה של ${money(t.end, 0)} ₪${cite(it.section, z.law_url)}${cite(it.table_section, it.tables_url)}${cite('קצבה חלקית', it.partial_url)}</li>`
			+ `<li>בגיל 70, ב-${isoToHe(r.elig.date)}: ${money(s.pay, 0)} ₪ בלי מבחן הכנסות; מגיל 80: <bdi>${z.amounts.pct.basic80}% × ${money(btl.basic_amount.b3, 0)}</bdi> = ${money(z.amounts.basic80, 0)} ₪, ועם הוותק ${money(e.pay, 0)} ₪${cite(z.ages.section, z.law_url)}${cite(z.amounts.section80, z.law_url)}</li>`
			+ `<li>התשלום הראשון: נולדה ב-${Number(r.birth.slice(8))} לחודש, לפני ה-${z.claim.cutoff_day}, ולכן עבור ${zkMonthHe(r.firstPay.ym)}, ב-${isoToHe(r.firstPay.date)}; תביעה עד ${isoToHe(r.deadlines.find((d) => d.key === 'claim_by').date)} בלי לאבד חודשים${cite('תשלום הקצבה', z.claim.payment_url)}${cite('הגשת התביעה', z.claim.url)}</li></ol>`,
		compare_table: agesTable(reg) + amountsTable(reg) + incomeTable(reg) + historyTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/** The scenario for the simulation: the tool's figures only, never a name, an ID or a full birth date. */
export function scenarioText(reg, r) {
	if (!r.ok) { return ''; }
	const who = `${r.sex === 'f' ? 'אישה ילידת' : 'גבר יליד'} ${zkMonthHe(r.birth.slice(0, 7))}`;
	const fam = r.couple ? `בני זוג${r.paySpouse ? ', בן או בת הזוג תלויים בי' : ''}` : 'יחיד';
	const inc = r.work || r.other ? ` הכנסה מעבודה ${money(r.work, 0)} ₪ בחודש${r.other ? `, הכנסה אחרת ${money(r.other, 0)} ₪` : ''}.` : '';
	const res = r.verdict === 'no' ? `לפי החישוב אין זכאות: ${r.gates.find((g) => g.state === 'no').he}.` : `לפי החישוב: ${verdictSentence(reg, r)}`;
	const ask = r.decision || r.verdict === 'no' ? 'אני רוצה להתכונן לדיון בבית הדין האזורי לעבודה על החלטת הביטוח הלאומי, ולהבין מה לטעון ואילו מסמכים להביא.'
		: 'אני רוצה להתכונן לשיחה עם פקיד התביעות בביטוח הלאומי על קצבת הזקנה: ההכנסות, תקופות הביטוח והתוספות.';
	return `קצבת אזרח ותיק (קצבת זקנה). ${who}, ${fam}, ${r.years} שנות ביטוח.${inc} ${res} ${ask}`;
}

/* ---------------- Browser ---------------- */

export function readForm(root, today) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const int = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : (/^\d+$/.test(v) ? Number(v) : NaN); };
	const fam = radio('fam', 'single');
	const sex = radio('sex', '');
	return {
		sex, birth: toIso(val(`#${P}-birth`)), fam, spouseBirth: fam === 'couple' ? toIso(val(`#${P}-spouseBirth`)) : '', spouseIncome: fam === 'couple' ? m('spouseIncome') : '',
		spousePension: fam === 'couple' && on('spension'), together: fam === 'couple' ? on('together') : true, kids: Number(radio('kids', '0')), years: int('years'),
		status: sex === 'f' ? radio('status', 'worker') : 'worker', work: m('work'), other: m('other'), workYears: int('workYears'), waive: on('waive'), disability: on('disab'),
		immigrant: on('immig'), grantWork: on('gwork'), decision: toIso(val(`#${P}-decision`)), today,
	};
}

const SC = { worker: '', exempt: 'e', housewife: 'h' };
const cell = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : String(v));
export function stateOf(i) {
	const c = i.fam === 'couple';
	return encodeState({
		x: i.sex, b: i.birth, f: c ? 'c' : 's', g: c ? i.spouseBirth : '', i: c ? cell(i.spouseIncome) : '', p: c && i.spousePension ? 1 : '', t: c && i.together === false ? 0 : '',
		k: i.kids ? cell(i.kids) : '', y: cell(i.years), s: i.sex === 'f' ? SC[i.status] || '' : '', w: cell(i.work), o: cell(i.other), n: cell(i.workYears),
		v: i.waive ? 1 : '', d: i.disability ? 1 : '', m: i.immigrant ? 1 : '', r: i.grantWork ? 1 : '', c: i.decision,
	});
}
export const KEYS = ['x', 'b', 'f', 'g', 'i', 'p', 't', 'k', 'y', 's', 'w', 'o', 'n', 'v', 'd', 'm', 'r', 'c'];
export function inputOf(s) {
	if (!s || !s.x || !s.b) { return null; }
	const n = (v) => (v === undefined || v === '' ? '' : Number(v));
	const c = s.f === 'c';
	return {
		sex: s.x === 'm' ? 'm' : 'f', birth: s.b, fam: c ? 'couple' : 'single', spouseBirth: c ? s.g || '' : '', spouseIncome: c ? n(s.i) : '', spousePension: c && s.p === '1', together: !(c && s.t === '0'),
		kids: s.k ? Number(s.k) : 0, years: n(s.y), status: s.s === 'e' ? 'exempt' : s.s === 'h' ? 'housewife' : 'worker', work: n(s.w), other: n(s.o), workYears: n(s.n),
		waive: s.v === '1', disability: s.d === '1', immigrant: s.m === '1', grantWork: s.r === '1', decision: s.c || '',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const z = reg.rights_zikna;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(z.checked_on, z.refresh_every_days) || (z.next_update && today >= z.next_update)) {
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
		const sex = (root.querySelector(`input[name="${P}-sex"]:checked`) || {}).value || '';
		const by = Number(toIso((root.querySelector(`#${P}-birth`) || {}).value || '').slice(0, 4));
		form.querySelectorAll('[data-if-couple]').forEach((el) => { el.hidden = fam !== 'couple'; });
		form.querySelectorAll('[data-if-woman]').forEach((el) => { el.hidden = sex !== 'f'; });
		form.querySelectorAll('[data-if-grant]').forEach((el) => { el.hidden = !(sex === 'f' && by >= z.grant.born_from && by <= z.grant.born_to); });
	};
	const band = (r) => (!r.ok ? 'error' : r.verdict === 'no' ? 'no' : r.verdict === 'route' ? 'route' : r.test && r.test.state !== 'full' ? `test-${r.test.state}` : r.head.pay >= 4000 ? '4000+' : r.head.pay >= 2500 ? '2500-3999' : 'under-2500');
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r, { example: Boolean(opts.example) });
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok && r.verdict !== 'no' ? ils(r.head.pay, 0) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: band(r) }); }
		return r;
	};
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root, today)); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(Object.assign({}, fromHash, { today }), { silent: true });
	} else {
		// The server rendered the example on the registry's date; today's line moves to the reader's own day.
		run(Object.assign({}, EXAMPLE, { today }), { silent: true, example: true });
	}
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector('input:not([type="radio"]):not([type="checkbox"])');
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
			if (p) { own = true; form.innerHTML = renderForm(reg, p.input); sync(); run(Object.assign({}, p.input, { today })); track('tool_start', { tool_id: TOOL_ID, type: 'profile' }); }
			return;
		}
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root, today), { silent: true }); }
		const input = readForm(root, today);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			const events = r.deadlines.filter((d) => d.ics);
			download('kitzbat-zikna.ics', 'text/calendar;charset=utf-8', ics(events.map((d) => ({ date: d.date, summary: `קצבת זקנה: ${d.he}` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
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
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק הביטוח הלאומי ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(z.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: band(r) });
			if (r.ok && openSimulation(scenarioText(reg, r), r.rehearse.purpose, b.getAttribute('href'))) { ev.preventDefault(); toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.'); }
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { own = true; form.innerHTML = renderForm(reg, s); sync(); run(Object.assign({}, s, { today })); }
		} else if (act === 'clear') {
			store.clear(saveKey);
			toast(root, 'נמחק מהמכשיר.');
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});
	// Chrome does not print the inside of a closed <details>: open the sources for the printout, then restore.
	const sources = root.querySelector('details.jtool-sources');
	let sourcesOpen = true;
	window.addEventListener('beforeprint', () => { if (sources) { sourcesOpen = sources.open; sources.open = true; } });
	window.addEventListener('afterprint', () => { if (sources && !sourcesOpen) { sources.open = false; } });
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
