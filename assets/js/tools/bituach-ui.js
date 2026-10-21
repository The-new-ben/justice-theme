/**
 * The rights wave UI (21.10.2026): National Insurance and health contributions, tool dmei-bituach (/national-insurance-calculator/).
 * The picture is the subject's own paper: the payslip's compulsory-deduction lines (and the self-employed advance voucher,
 * the pension slip), and the two-step tier bar with the ceiling line on which every source of income sits in the order of
 * the law. The tables, the coordination block and the .ics say the same in text, each line with its source.
 */
import { compute, STATUSES, BANDS, NONE_KINDS, monthOf, bandFor, duesAhead, tierParts, charge } from './bituach-engine.js';
import {
	esc, ils, money, pct, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'dmei-bituach';
const P = 'jt28';

export const EXAMPLE = { status: 'employee', band: 'work', salary: 14000, extra: ['', ''], mode: 'full', selfIncome: '', pension: '', noneKind: 'none', passive: '', disabled: false, pensionExempt: false, sex: '', born: '', oap: false, month: '2026-10' };

const STATUS_LABEL = { employee: 'שכיר/ה', self: 'עצמאי/ת', both: 'שכיר/ה וגם עצמאי/ת', none: 'לא עובד/ת', pension: 'פנסיה מוקדמת' };
const BAND_LABEL = { u18: 'מתחת לגיל 18', work: 'מגיל 18 ועד גיל הפרישה', w_ret: 'אישה, מגיל הפרישה שלה ועד 67, בלי קצבת אזרח ותיק', r67: 'מגיל 67 ועד 70, בלי קצבת אזרח ותיק', oap: 'מקבל/ת קצבת אזרח ותיק, או מגיל 70' };
const NONE_LABEL = { none: 'בלי הכנסות', student: 'סטודנט/ית', passive: 'יש הכנסה שלא מעבודה (שכירות, דיבידנד, ריבית)' };
const SRC_LABEL = { salary: 'שכר', self: 'הכנסה כעצמאי', pension: 'פנסיה מוקדמת', passive: 'הכנסה שלא מעבודה' };

const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const cite = (text, href) => (href && text ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const r2u = (n) => Math.round((Number(n) + 1e-9) * 100) / 100;
const blank = (v) => v === '' || v === undefined || v === null;

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const rb = reg.rights_bituach;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const moneyField = (id, field, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(blank(value) ? '' : money(value, Number(value) % 1 ? 2 : 0))}" placeholder="${esc(ph)}" aria-describedby="${P}-${field}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-${field}-e" role="alert"></p></div>`;
	const status = STATUSES.includes(input.status) ? input.status : 'employee';
	const band = BANDS.includes(input.band) ? input.band : 'work';
	const show = (list) => (list.split(' ').includes(status) ? '' : ' hidden');
	const extra = Array.isArray(input.extra) ? input.extra : [];
	const noneKind = NONE_KINDS.includes(input.noneKind) ? input.noneKind : 'none';
	const hasExtra = extra.some((v) => !blank(v));
	return `<fieldset class="jtool-field"><legend>המעמד בביטוח הלאומי</legend><div class="jtool-chips">${STATUSES.map((k) => chip('st', k, STATUS_LABEL[k], status === k)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>הגיל</legend><div class="jtool-chips">${BANDS.map((k) => chip('bd', k, BAND_LABEL[k], band === k)).join('')}</div><p class="jtool-error" id="${P}-band-e" role="alert"></p>`
		+ `<details class="jtool-more" data-age${input.born ? ' open' : ''}><summary>לא בטוחים מתי גיל הפרישה? לפי חודש הלידה</summary>`
		+ `<div class="jtool-chips" style="margin-top:8px" role="group" aria-label="גיל הפרישה נקבע לפי">${chip('sx', 'm', 'גבר', input.sex !== 'f')}${chip('sx', 'f', 'אישה', input.sex === 'f')}</div>`
		+ `<div class="jtool-field" style="margin-top:8px"><label class="jtool-label" for="${P}-born">חודש ושנת לידה</label><input id="${P}-born" type="text" inputmode="numeric" autocomplete="off" value="${esc(input.born ? isoToHe(monthOf(input.born) || '') : '')}" placeholder="לדוגמה: 4/1963" aria-describedby="${P}-born-e"><p class="jtool-error" id="${P}-born-e" role="alert"></p></div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('oap', '1', 'מקבל/ת קצבת אזרח ותיק', input.oap, 'checkbox')}</div>`
		+ `<p class="jtool-hint">גיל הפרישה לגבר 67; לאישה 62 עד 65, לפי חודש הלידה, כמו בטבלה של הביטוח הלאומי. מגיל ${rb.retirement.entitlement_age} קצבת אזרח ותיק משולמת בלי מבחן הכנסות. חודש הלידה לא נשמר בקישור השיתוף.</p><p class="jtool-hint" data-age-out aria-live="polite"></p></details></fieldset>`
		+ `<div data-show="employee both pension"${show('employee both pension')}>${moneyField('sal', 'salary', status === 'pension' ? 'שכר חודשי ברוטו, אם עובדים גם כשכירים (לא חובה)' : 'שכר חודשי ברוטו (אצל המעסיק העיקרי)', input.salary, status === 'pension' ? '0 אם לא עובדים' : 'לדוגמה: 14,000')}`
		+ `<details class="jtool-more"${hasExtra ? ' open' : ''}><summary>עובדים אצל יותר ממעסיק אחד?</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${moneyField('x0', 'extra0', 'שכר אצל מעסיק נוסף', extra[0], 'לא חובה')}${moneyField('x1', 'extra1', 'שכר אצל מעסיק שלישי', extra[1], 'לא חובה')}</div>`
		+ `<fieldset class="jtool-field" style="margin-top:8px"><legend>איך המעסיק הנוסף מנכה</legend><div class="jtool-chips">${chip('md', 'full', 'בשיעור מלא: סימנתי בטופס 101 שיש לי הכנסה נוספת', input.mode !== 'tier')}${chip('md', 'tier', 'כל מעסיק מנכה כאילו הוא היחיד', input.mode === 'tier')}</div></fieldset>`
		+ `<p class="jtool-hint">כל מעסיק משלם את חלקו כאילו הוא המעסיק היחיד (${esc(rb.coordination.section_each)}). המעסיק המשני מנכה מהעובד בשיעור המלא גם מתחת למדרגה, אחרי שסימנתם בטופס 101 הכנסה נוספת (${esc(rb.coordination.section_secondary)}). ההפרש מול החוק מוחזר או נגבה (${esc(rb.coordination.section_diff)}).</p></details>`
		+ `<div class="jtool-chips" data-show="employee both"${show('employee both')} style="margin-top:8px">${chip('dis', '1', 'יש לי אישור שנתי מהביטוח הלאומי (מקבלי קצבת נכות כללית או נכות מעבודה)', input.disabled, 'checkbox')}</div></div>`
		+ `<div data-show="self both"${show('self both')}>${moneyField('se', 'selfIncome', 'הכנסה חייבת חודשית מהעסק (רווח לפני מס, אחרי הוצאות)', input.selfIncome, 'לדוגמה: 12,000')}`
		+ `<p class="jtool-hint">${esc(rb.min_self.definition_he)} (${esc(rb.min_self.definition_section)}). לפני החיוב מנכים ${rb.self.deduct_pct}% מדמי הביטוח הלאומי (${esc(rb.self.base_section)}).</p></div>`
		+ `<div data-show="pension"${show('pension')}>${moneyField('pn', 'pension', 'פנסיה מוקדמת חודשית ברוטו', input.pension, 'לדוגמה: 6,000')}`
		+ `<div class="jtool-chips">${chip('pex', '1', 'יש לי אישור פטור לפנסיה (אלמנה עם קצבת שאירים, נכות 75% ומעלה)', input.pensionExempt, 'checkbox')}</div>`
		+ `<p class="jtool-hint">${esc(rb.pension.definition_he)}.</p></div>`
		+ `<div data-show="none"${show('none')}><fieldset class="jtool-field"><legend>מה המצב</legend><div class="jtool-chips">${NONE_KINDS.map((k) => chip('nk', k, NONE_LABEL[k], noneKind === k)).join('')}</div><p class="jtool-error" id="${P}-noneKind-e" role="alert"></p></fieldset>`
		+ `<div data-if-passive${noneKind === 'passive' ? '' : ' hidden'}>${moneyField('pv', 'passive', 'הכנסה חודשית שלא מעבודה', input.passive, 'לדוגמה: 12,000')}<p class="jtool-hint">${nis(rb.passive_exempt.amount)} הראשונים בחודש לא נספרים (${esc(rb.passive_exempt.section)}).</p></div></div>`;
}

function slipRow(label, value, mod = '') {
	// A deduction line carries its minus inside the isolated number, so RTL never moves it to the other side.
	return `<div class="jt28-slip__row${mod ? ` jt28-slip__row--${mod}` : ''}"><dt>${esc(label)}</dt><dd>${value === null ? '—' : `<bdi>${money(mod === 'minus' ? -value : value)}</bdi>`}</dd></div>`;
}

/** The compulsory-deduction lines of each payslip, the self-employed voucher and the not-working payment. */
export function slipsHtml(reg, r) {
	const rb = reg.rights_bituach;
	const slips = [];
	const many = r.payers.length > 1;
	r.payers.forEach((p, i) => {
		const c = p.charge;
		const title = p.kind === 'pension' ? 'תלוש פנסיה מוקדמת' : many ? `תלוש שכר · ${i === 0 ? 'המעסיק העיקרי' : `מעסיק ${i + 1}`}` : 'תלוש שכר';
		const rows = slipRow(p.kind === 'pension' ? 'פנסיה ברוטו' : 'שכר ברוטו', p.amount)
			+ slipRow('ביטוח לאומי', c.bl, 'minus') + slipRow('דמי ביטוח בריאות', c.health, 'minus')
			+ slipRow('אחרי ביטוח לאומי ובריאות', r2u(p.amount - c.total), 'sum');
		const employer = p.kind === 'salary' ? charge(tierParts(p.amount, 0, r.T, r.M), p.rate).employer : null;
		const emp = employer === null ? '' : `<p class="jt28-slip__sub">הפרשות המעסיק</p><dl class="jt28-slip__rows">${slipRow('ביטוח לאומי, חלק המעסיק', employer)}${slipRow('עלות השכר', r2u(p.amount + employer), 'sum')}</dl>`;
		slips.push(`<div class="jt28-slip"><p class="jt28-slip__head"><span>${esc(title)}</span><span>ניכויי חובה</span></p><dl class="jt28-slip__rows">${rows}</dl>${emp}${many && i > 0 && r.mode === 'full' ? '<p class="jt28-slip__note">מעסיק משני: שיעור מלא מהשקל הראשון</p>' : ''}</div>`);
	});
	if (r.self) {
		const c = r.self.charge;
		const next = duesAhead(rb, ilToday())[0];
		slips.push(`<div class="jt28-slip jt28-slip--voucher"><p class="jt28-slip__head"><span>מקדמה חודשית לעצמאי</span><span>תשלום ישיר</span></p><dl class="jt28-slip__rows">`
			+ slipRow('הכנסה חייבת', r.self.income)
			+ slipRow(r.self.minApplied ? 'בסיס: ההכנסה המזערית' : `בסיס אחרי ניכוי ${rb.self.deduct_pct}%`, r.self.base)
			+ slipRow('ביטוח לאומי', c.bl, 'minus') + slipRow('דמי ביטוח בריאות', c.health, 'minus') + slipRow('לתשלום בחודש', c.total, 'sum')
			+ `</dl>${next ? `<p class="jt28-slip__note">מועד התשלום הבא: <bdi>${isoToHe(next)}</bdi></p>` : ''}</div>`);
	}
	if (r.none) {
		const n = r.none;
		const head = n.kind === 'oap' ? 'מנוכה מקצבת אזרח ותיק' : 'תשלום ישיר לביטוח הלאומי';
		const rows = n.kind === 'student' ? slipRow('דמי ביטוח לאומי ובריאות יחד', n.total, 'sum')
			: n.kind === 'oap' ? slipRow('דמי ביטוח בריאות, יחיד בלי השלמת הכנסה', n.total, 'sum')
			: (n.kind === 'passive' ? slipRow('הכנסה שלא מעבודה', n.income) + slipRow(`נספר (אחרי ${money(rb.passive_exempt.amount, 0)} ₪ שלא נספרים)`, n.counted) : '')
				+ slipRow('ביטוח לאומי', n.bl, 'minus') + slipRow('דמי ביטוח בריאות', n.health, 'minus') + slipRow('בחודש', n.total, 'sum');
		slips.push(`<div class="jt28-slip jt28-slip--voucher"><p class="jt28-slip__head"><span>${esc(head)}</span><span>בחודש</span></p><dl class="jt28-slip__rows">${rows}</dl></div>`);
	}
	if (r.oapHealth && r.status !== 'none') {
		slips.push(`<div class="jt28-slip jt28-slip--voucher"><p class="jt28-slip__head"><span>מנוכה מקצבת אזרח ותיק</span><span>בחודש</span></p><dl class="jt28-slip__rows">${slipRow('דמי ביטוח בריאות, יחיד בלי השלמת הכנסה', r.oapHealth, 'sum')}</dl></div>`);
	}
	return slips.length ? `<div class="jt28-slips" aria-label="שורות הניכוי">${slips.join('')}</div>` : '';
}

/** The two-step bar: the reduced tier, the full tier and the ceiling line, with each income source in the order of the law. */
export function barHtml(reg, r) {
	const segs = [];
	if (r.salary) { segs.push({ k: 'salary', amount: r.S, parts: r.salary.parts }); }
	if (r.self) { segs.push({ k: 'self', amount: r.self.base, parts: r.self.parts }); }
	if (r.pension && r.pension.counted > 0) { segs.push({ k: 'pension', amount: r.pension.counted, parts: r.pension.parts }); }
	if (r.none && r.none.kind === 'passive' && r.none.counted > 0) { segs.push({ k: 'passive', amount: r.none.counted, parts: r.none.parts }); }
	if (!segs.length) { return ''; }
	const total = segs.reduce((t, s) => t + s.amount, 0);
	const scale = total >= r.M * 0.7 ? Math.max(total, r.M) * 1.06 : Math.max(total, r.T) * 1.35;
	const at = (x) => `${Math.min(100, (x / scale) * 100).toFixed(2)}%`;
	const zone = (from, to, k) => (to > from ? `<span class="jt28-bar__zone jt28-bar__zone--${k}" style="inset-inline-start:${at(from)};width:${at(Math.min(to, scale) - from)}"></span>` : '');
	let pos = 0;
	const bars = segs.map((s) => { const html = `<span class="jt28-bar__seg jt28-bar__seg--${s.k}" style="inset-inline-start:${at(pos)};width:${at(Math.min(s.amount, scale - pos))}"></span>`; pos += s.amount; return html; }).join('');
	const maxIn = r.M <= scale;
	const label = segs.map((s) => `${SRC_LABEL[s.k]} ${money(s.amount, 0)} ₪`).join(', ');
	const legend = segs.map((s) => `<li><i class="jt28-key jt28-key--${s.k}" aria-hidden="true"></i>${esc(SRC_LABEL[s.k])} <bdi>${money(s.amount, Math.round(s.amount * 100) % 100 ? 2 : 0)}</bdi> ₪: <bdi>${money(s.parts.reduced, s.parts.reduced % 1 ? 2 : 0)}</bdi> ₪ בשיעור מופחת, <bdi>${money(s.parts.full, s.parts.full % 1 ? 2 : 0)}</bdi> ₪ בשיעור מלא</li>`).join('');
	return `<figure class="jt28-bar"><figcaption class="jt28-bar__cap">שתי מדרגות ותקרה: על מה משלמים כמה</figcaption>`
		+ `<div class="jt28-bar__track" role="img" aria-label="${esc(`${label}. המדרגה המופחתת עד ${money(r.T, 0)} ₪, התקרה ${money(r.M, 0)} ₪`)}">`
		+ zone(0, r.T, 'low') + zone(r.T, r.M, 'high') + (maxIn ? zone(r.M, scale, 'over') : '') + bars
		+ `<span class="jt28-bar__zl" style="inset-inline-start:${at(r.T / 2)}">שיעור מופחת</span><span class="jt28-bar__zl" style="inset-inline-start:${at((r.T + Math.min(r.M, scale)) / 2)}">שיעור מלא</span>`
		+ (maxIn ? `<span class="jt28-bar__zl jt28-bar__zl--over" style="inset-inline-start:${at((r.M + scale) / 2)}">פטור</span>` : '')
		+ `<span class="jt28-bar__line" style="inset-inline-start:${at(r.T)}"><b>מדרגה <bdi>${money(r.T, 0)}</bdi></b></span>`
		+ (maxIn ? `<span class="jt28-bar__line jt28-bar__line--max" style="inset-inline-start:${at(r.M)}"><b>תקרה <bdi>${money(r.M, 0)}</bdi></b></span>` : `<span class="jt28-bar__more">התקרה <bdi>${money(r.M, 0)}</bdi> ₪ ←</span>`)
		+ `</div><ul class="jt28-bar__legend">${legend}</ul></figure>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const m = r.monthly;
	const c = r.coord;
	const coordTxt = c && c.kind === 'refund' ? ` בתלושים נוכו יחד ${nis(c.actual)}, ${nis(c.diff)} בחודש יותר מהחוק: אפשר לבקש את ההפרש בחזרה.` : c && c.kind === 'owe' ? ` בתלושים נוכו יחד ${nis(c.actual)}, ${nis(-c.diff)} בחודש פחות מהחוק: את ההפרש הביטוח הלאומי גובה.` : '';
	if (r.status === 'employee') {
		if (r.band === 'oap') { return `מהשכר לא מנכים דמי ביטוח לאומי ובריאות; המעסיק משלם ${nis(r.salary.employer)} בחודש. מקצבת אזרח ותיק מנוכים ${nis(r.oapHealth)} דמי ביטוח בריאות.`; }
		if (r.band === 'u18') { return `עד גיל 18 לא מנכים מהשכר (${nis(r.S)}) דמי ביטוח לאומי ובריאות; המעסיק משלם ${nis(m.employer)} בחודש, ועלות השכר ${nis(r.S + m.employer)}.${coordTxt}`; }
		if (m.bl === 0) { return `שכר ברוטו ${nis(r.S)}, עם אישור שנתי: מנכים רק דמי ביטוח בריאות, ${nis(m.health)} בחודש. המעסיק משלם ${nis(m.employer)}, ועלות השכר ${nis(r.S + m.employer)}.${coordTxt}`; }
		return `שכר ברוטו ${nis(r.S)}${r.salaries.length > 1 ? ` (${r.salaries.length} מעסיקים)` : ''}: לפי החוק מנכים ${nis(m.total)} בחודש, ${nis(m.bl)} ביטוח לאומי ו-${nis(m.health)} דמי ביטוח בריאות. המעסיק${r.salaries.length > 1 ? 'ים משלמים' : ' משלם'} עוד ${nis(m.employer)}, ועלות השכר ${nis(r.S + m.employer)}.${coordTxt}`;
	}
	if (r.status === 'self') {
		return `הכנסה חייבת של ${nis(r.self.income)} בחודש: ${r.self.minApplied ? `משלמים על ההכנסה המזערית, ${nis(r.self.base)}` : `הבסיס לדמי הביטוח ${nis(r.self.base)} אחרי ניכוי ${reg.rights_bituach.self.deduct_pct}% מדמי הביטוח הלאומי`}, והמקדמה החודשית ${nis(r.self.charge.total)}: ${nis(r.self.charge.bl)} ביטוח לאומי ו-${nis(r.self.charge.health)} ביטוח בריאות.`;
	}
	if (r.status === 'both') {
		const roomTxt = r.self.room > 0 ? `השיעור המופחת חל על ההכנסה כעצמאי רק עד ${nis(r.self.room)}, ההפרש בין השכר למדרגה.` : 'השכר כבר ממצה את המדרגה המופחתת, ולכן על ההכנסה כעצמאי חל השיעור המלא.';
		return `מהשכר (${nis(r.S)}) מנכים ${nis(r.salary.charge.total)}, ועל ההכנסה כעצמאי (${nis(r.self.income)}) משלמים מקדמה של ${nis(r.self.charge.total)}; יחד ${nis(m.total)} בחודש. ${roomTxt}`;
	}
	if (r.status === 'pension') {
		const pn = r.pension;
		const pTxt = pn.retired ? 'מהפנסיה לא מנכים, כי היא משתלמת מגיל הפרישה' : pn.exempt ? 'מהפנסיה לא מנכים, באישור הפטור' : `מהפנסיה (${nis(pn.amount)}) מנכים ${nis(pn.charge.total)}`;
		return `${pTxt}${r.salary ? `, ומהשכר (${nis(r.S)}) ${nis(r.salary.charge.total)}` : ''}; יחד ${nis(m.total)} בחודש לפי החוק.${coordTxt}`;
	}
	const n = r.none;
	if (n.kind === 'oap') { return `מי שמקבל קצבת אזרח ותיק ולא עובד: מהקצבה מנוכים ${nis(n.total)} דמי ביטוח בריאות בחודש (יחיד בלי השלמת הכנסה).`; }
	if (n.kind === 'student') { return `סטודנט/ית שלא עובד/ת משלם/ת ${nis(n.total)} בחודש, דמי ביטוח לאומי ובריאות יחד.`; }
	if (n.kind === 'passive') { return `הכנסה שלא מעבודה של ${nis(n.income)} בחודש: נספרים ${nis(n.counted)}, ומשלמים ${nis(n.total)} בחודש${n.minApplied ? ', הסכום המינימלי' : ''}: ${nis(n.bl)} ביטוח לאומי ו-${nis(n.health)} ביטוח בריאות.`; }
	return `מי שלא עובד ואין לו הכנסות משלם ${nis(n.total)} בחודש: ${nis(n.bl)} ביטוח לאומי ו-${nis(n.health)} דמי ביטוח בריאות.`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const label = r.status === 'self' || (r.status === 'none' && r.none.kind !== 'oap') ? 'כמה משלמים בחודש' : r.status === 'none' ? 'כמה מנוכה מהקצבה בחודש' : 'כמה מנכים בחודש, לפי החוק';
	const state = r.coord && r.coord.kind === 'refund' ? '<p class="jtool-state jtool-state--warn">! נוכה יותר מהחוק: מגיע החזר</p>' : r.coord && r.coord.kind === 'owe' ? '<p class="jtool-state jtool-state--warn">! נוכה פחות מהחוק: יהיה חיוב</p>' : `<p class="jtool-state jtool-state--ok">✓ לפי שיעורי ${esc(String(reg.rights_bituach.year))}</p>`;
	const flags = r.flags;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${esc(label)}</p>`
		+ `<strong class="jtool-verdict__figure">${ilsn(r.monthly.total)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<p class="jtool-scope">בשנה: <strong>${ilsn(r.annual.total)}</strong>${r.monthly.employer ? `, והמעסיק עוד <strong>${ilsn(r.annual.employer)}</strong>` : ''}.</p></div>`
		+ slipsHtml(reg, r) + barHtml(reg, r)
		+ (flags.length ? `<ul class="jtool-flags">${flags.map((f) => `<li>${esc(f.he)}${cite(f.section, f.url)}</li>`).join('')}</ul>` : '');
}

/** One row per income source and tier: how much, at what rate, with the source. */
function linesTable(reg, r) {
	const rb = reg.rights_bituach;
	const rows = [];
	const push = (src, part, amount, rate, c, side, url, employerRates) => {
		if (!(amount > 0)) { return; }
		const i = part === 'reduced' ? 0 : 1;
		const bl = part === 'reduced' ? c.blR : c.blF;
		const h = part === 'reduced' ? c.hR : c.hF;
		const e = employerRates ? r2u(amount * employerRates[i] / 100) : null;
		rows.push(`<tr><td data-th="מקור">${esc(src)}</td><td data-th="החלק">${part === 'reduced' ? 'עד המדרגה' : 'מעל המדרגה'}: ${ilsn(amount)}</td><td data-th="ביטוח לאומי">${pct(rate.bl[i])} = ${ilsn(bl)}</td><td data-th="בריאות">${pct(rate.health[i])} = ${ilsn(h)}</td><td data-th="מעסיק">${e === null ? '—' : `${pct(employerRates[i])} = ${ilsn(e)}`}</td><td data-th="מקור">${cite(side, url)}</td></tr>`);
	};
	if (r.salary) {
		const c = r.salary.charge;
		const many = r.salaries.length > 1;
		push(many ? 'שכר, כל המעסיקים יחד' : 'שכר', 'reduced', r.salary.parts.reduced, r.salary.rate, c, 'דף השיעורים לשכירים', rb.employee.url, many ? null : r.salary.rate.employer);
		push(many ? 'שכר, כל המעסיקים יחד' : 'שכר', 'full', r.salary.parts.full, r.salary.rate, c, 'דף השיעורים לשכירים', rb.employee.url, many ? null : r.salary.rate.employer);
	}
	if (r.self) {
		push('הכנסה כעצמאי (הבסיס)', 'reduced', r.self.parts.reduced, r.self.rate, r.self.charge, 'דף השיעורים לעצמאים', rb.self.url, null);
		push('הכנסה כעצמאי (הבסיס)', 'full', r.self.parts.full, r.self.rate, r.self.charge, 'דף השיעורים לעצמאים', rb.self.url, null);
	}
	if (r.pension) {
		push('פנסיה מוקדמת', 'reduced', r.pension.parts.reduced, r.pension.rate, r.pension.charge, 'דף השיעורים לפנסיה מוקדמת', rb.pension.url, null);
		push('פנסיה מוקדמת', 'full', r.pension.parts.full, r.pension.rate, r.pension.charge, 'דף השיעורים לפנסיה מוקדמת', rb.pension.url, null);
	}
	if (r.none && r.none.kind === 'passive' && !r.none.minApplied) {
		push('הכנסה שלא מעבודה', 'reduced', r.none.parts.reduced, rb.none.passive, r.none.charge, 'דף השיעורים למי שלא עובד', rb.none.url, null);
		push('הכנסה שלא מעבודה', 'full', r.none.parts.full, rb.none.passive, r.none.charge, 'דף השיעורים למי שלא עובד', rb.none.url, null);
	}
	if (!rows.length) { return ''; }
	return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-lines-h">על איזה חלק, באיזה שיעור</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-lines-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מקור</th><th scope="col">החלק</th><th scope="col">ביטוח לאומי</th><th scope="col">בריאות</th><th scope="col">מעסיק</th><th scope="col">מקור</th></tr></thead><tbody>${rows.join('')}`
		+ `<tr class="jtool-table__total"><td data-th="מקור">סך הכול בחודש</td><td data-th="החלק">—</td><td data-th="ביטוח לאומי">${ilsn(r.monthly.bl)}</td><td data-th="בריאות">${ilsn(r.monthly.health)}</td><td data-th="מעסיק">${r.monthly.employer ? ilsn(r.monthly.employer) : '—'}</td><td data-th="מקור">—</td></tr></tbody>`
		+ `<caption>המדרגה המופחתת ${nis(rb.tier.amount)} (${esc(rb.tier.section)}, ${esc(rb.tier.amendment_he)}); ההכנסה המרבית ${nis(rb.max.amount)} (${esc(rb.max.section)}). מ-${isoToHe(rb.from)}.</caption></table></div></div>`;
}

/** Several payers: what the payslips deducted, what the law asks, and how to settle the difference. */
function coordHtml(reg, r) {
	const c = r.coord;
	if (!c) { return ''; }
	const co = reg.rights_bituach.coordination;
	const rows = r.payers.map((p, i) => `<tr><td data-th="משלם">${p.kind === 'pension' ? 'משלם הפנסיה' : i === 0 ? 'המעסיק העיקרי' : `מעסיק ${i + 1}`}</td><td data-th="ברוטו">${ilsn(p.amount)}</td><td data-th="איך מנכה">${i > 0 && r.mode === 'full' ? 'שיעור מלא מהשקל הראשון' : 'כאילו הוא היחיד'}</td><td data-th="נוכה">${ilsn(p.charge.total)}</td></tr>`).join('');
	const form = c.form ? co[c.form === 'max' ? 'form_max' : 'form_low'] : null;
	const steps = [];
	if (c.kind === 'refund') {
		steps.push(`על שנים קודמות: בקשה לתיאום דמי ביטוח באתר הביטוח הלאומי${form ? `, או טופס ${form.number} (${form.he})` : ''}, עד ${co.refund_years} שנים אחורה.`);
		steps.push(`${co.current_year_he}.`);
	} else if (c.kind === 'owe') {
		steps.push(`ההפרש נגבה מהעובד (${co.section_diff}). כדי שלא יצטבר חוב, מבקשים אישור לתיאום דמי ביטוח ומעבירים אותו למעסיק המשני.`);
	}
	return `<div class="jtool-tablewrap jt28-coord"><div class="jtool-tablewrap__head"><h3 id="${P}-coord-h">כמה מעסיקים: מה נוכה ומה מגיע לפי החוק</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-coord-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">משלם</th><th scope="col">ברוטו</th><th scope="col">איך מנכה</th><th scope="col">נוכה</th></tr></thead><tbody>${rows}`
		+ `<tr><td data-th="משלם">נוכה בתלושים יחד</td><td data-th="ברוטו">${ilsn(c.total)}</td><td data-th="איך מנכה">—</td><td data-th="נוכה">${ilsn(c.actual)}</td></tr>`
		+ `<tr><td data-th="משלם">לפי החוק: כאילו מעסיק אחד</td><td data-th="ברוטו">${ilsn(Math.min(c.total, r.M))}</td><td data-th="איך מנכה">מדרגה אחת ותקרה אחת</td><td data-th="נוכה">${ilsn(c.law)}</td></tr>`
		+ `<tr class="jtool-table__total"><td data-th="משלם">${c.kind === 'refund' ? 'נוכה ביותר, בחודש' : c.kind === 'owe' ? 'נוכה בחסר, בחודש' : 'הפרש'}</td><td data-th="ברוטו">—</td><td data-th="איך מנכה">בשנה: ${ilsn(c.annual)}</td><td data-th="נוכה">${ilsn(Math.abs(c.diff))}</td></tr></tbody>`
		+ `<caption>${esc(co.section_each)}: כל מעסיק משלם כאילו הוא היחיד; ${esc(co.section_diff)}: ההפרש מול "מעסיק אחד" מוחזר או נגבה. סדר הניכוי: ${esc(co.order_he)}.</caption></table></div>`
		+ (steps.length ? `<ol class="jtool-steps">${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` : '')
		+ `<p class="jt28-links">${cite('מתי צריך תיאום', co.when_url)}${cite('בקשה מקוונת', co.online_url)}${form ? cite(`טופס ${form.number}`, form.url) : ''}${cite('החזר על שנים קודמות', co.refund_url)}</p></div>`;
}

/** The self-employed: the base, the 52% deduction for income tax, the dues days and the form that changes the advance. */
function selfHtml(reg, r, today) {
	if (!r.self) { return ''; }
	const rb = reg.rights_bituach;
	const s = r.self;
	const dues = duesAhead(rb, today);
	const steps = [
		s.minApplied ? `ההכנסה (${nis(s.income)}) נמוכה מההכנסה המזערית: הבסיס ${nis(s.base)} (${rb.min_self.section}).`
			: `הבסיס לדמי הביטוח: ההכנסה פחות ${rb.self.deduct_pct}% מדמי הביטוח הלאומי שעליה (בלי בריאות). לפי הנוסחה של הביטוח הלאומי, ${nis(s.income)} הופכים לבסיס של ${nis(s.base)} (${rb.self.base_section}).`,
		`עד ${nis(s.room)} מהבסיס בשיעור מופחת (${s.rate.bl[0]}% ביטוח לאומי, ${s.rate.health[0]}% בריאות), והשאר בשיעור מלא (${s.rate.bl[1]}% ו-${s.rate.health[1]}%).`,
		`המקדמה: ${nis(s.charge.total)} בחודש, ${nis(r2u(s.charge.total * 12))} בשנה. ${rb.self.advance_he}.`,
		`במס הכנסה: ${rb.self.deduct_pct}% מדמי הביטוח הלאומי ששולמו מותרים בניכוי, ${nis(s.deduct)} בחודש, ${nis(s.deductAnnual)} בשנה (${rb.self.deduct_section}).`,
		`ההכנסה השתנתה ב-${rb.advance_fix.min_change_pct}% לפחות? ${rb.advance_fix.he} (טופס ${rb.advance_fix.form}), ${rb.advance_fix.rule_he}.`,
	];
	return `<div class="jtool-tablewrap jt28-self"><div class="jtool-tablewrap__head"><h3 id="${P}-self-h">המקדמה של העצמאי</h3><div class="jtool-actions">${dues.length ? '<button class="jtool-btn" type="button" data-act="ics">מועדי התשלום ליומן (.ics)</button>' : ''}</div></div>`
		+ `<ol class="jtool-steps">${steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`
		+ (dues.length ? `<p class="jt28-dues"><strong>מועדי הדיווח והתשלום שנשארו ב-${esc(String(rb.year))}:</strong> ${dues.map((d) => `<bdi>${isoToHe(d)}</bdi>`).join(' · ')}. בהוראת קבע החיוב ב-${rb.dues.standing_order_day} בחודש, על החודש שלפניו.</p>` : '')
		+ `<p class="jt28-links">${cite('לוח המועדים', rb.dues.url)}${cite(`טופס ${rb.advance_fix.form}`, rb.advance_fix.url)}${cite('הדוגמה של הביטוח הלאומי', rb.self.example_url)}${cite('סעיף 47א', rb.self.deduct_url)}</p></div>`;
}

/** What to do next, in order: the personal area, the form, the refund. */
export function nextSteps(reg, r) {
	if (!r.ok) { return []; }
	const rb = reg.rights_bituach;
	const first = r.status === 'self'
		? 'להשוות את המקדמה המחושבת לדרישת התשלום ולבדוק את ההכנסה שעליה היא מבוססת'
		: r.status === 'both'
			? 'לבדוק בנפרד את הניכויים בתלוש השכר ואת המקדמה על ההכנסה מהעסק'
			: r.status === 'none'
				? (r.none.kind === 'oap' ? 'לבדוק את ניכוי דמי הבריאות בפירוט קצבת האזרח הוותיק' : 'לבדוק שהמעמד וההכנסות מעודכנים, ולהשוות לדרישת התשלום')
				: r.status === 'pension'
					? `להשוות לניכויים בתלוש הפנסיה${r.S > 0 ? ' ובתלוש השכר' : ''}`
					: 'להשוות לשורות "ביטוח לאומי" ו"ביטוח בריאות" בתלוש';
	const out = [`${first}, ולבדוק את הדיווחים באזור האישי באתר הביטוח הלאומי (${rb.personal_url}).`];
	if (r.coord && r.coord.kind === 'refund') { const f = rb.coordination[r.coord.form === 'max' ? 'form_max' : 'form_low']; out.push(`לבקש את מה שנוכה ביותר: בקשה מקוונת לתיאום דמי ביטוח, או טופס ${f.number}, עד ${rb.coordination.refund_years} שנים אחורה.`); }
	if (r.coord && r.coord.kind === 'owe') { out.push('לבקש אישור לתיאום דמי ביטוח לשנה הנוכחית ולמסור אותו למעסיק המשני, כדי שההפרש לא יצטבר לחוב.'); }
	if (r.salaries && r.salaries.length > 1) { out.push('לסמן בטופס 101 של המעסיק המשני שיש הכנסה נוספת (בתחילת העבודה ובתחילת כל שנה).'); }
	if (r.self) { out.push(`עצמאי/ת: לשלם את המקדמה עד מועד התשלום בכל חודש, ולתקן אותה בטופס ${rb.advance_fix.form} כשההכנסה משתנה ב-${rb.advance_fix.min_change_pct}% לפחות.`); }
	if (r.pension && r.S > 0 && !r.pension.retired && !r.pension.exempt) { out.push('מקבל/ת פנסיה מוקדמת ושכר: לסמן בטופס 101 של משלם הפנסיה שיש הכנסה נוספת; משלם הפנסיה הוא המעסיק המשני.'); }
	if (r.status === 'none' && r.none.kind !== 'oap') { out.push('מי שלא עובד/ת: להודיע לביטוח הלאומי על המעמד בטופס דין וחשבון רב שנתי, ולשלם ישירות.'); }
	return out;
}

/** Route the follow-up from the same result as the calculation, never a stale employee example. */
export function nextAction(reg, r) {
	if (!r.ok) {
		return { text: 'הצעד הבא: להשלים או לתקן את פרטי החישוב לפני בדיקת התוצאה.', label: 'חזרה לפרטי החישוב', href: `#jtool-${TOOL_ID}`, kind: 'input' };
	}
	if (r.coord && ['refund', 'owe'].includes(r.coord.kind)) {
		return { text: 'הצעד הבא: לבדוק את ההפרש בין הניכויים אצל המשלמים ואת אפשרויות תיאום דמי הביטוח.', label: 'לפירוט ההפרש ותיאום דמי הביטוח', href: `#${P}-coord-h`, kind: 'coordination' };
	}
	if (r.status === 'self') {
		return { text: 'הצעד הבא: להשוות את המקדמה לדרישת התשלום ולבדוק את מועדי התשלום ואפשרויות עדכון ההכנסה.', label: 'למקדמה, למועדי התשלום ולעדכון ההכנסה', href: `#${P}-self-h`, kind: 'advance' };
	}
	if (r.status === 'both') {
		return { text: 'הצעד הבא: לבדוק גם את הניכויים בתלוש וגם את המקדמה על ההכנסה מהעסק.', label: 'לרשימת הבדיקות לשכיר ולעצמאי', href: `#${P}-next-h`, kind: 'mixed' };
	}
	if (r.status === 'none') {
		return { text: r.none.kind === 'oap' ? 'הצעד הבא: להשוות את ניכוי דמי הבריאות לפירוט קצבת האזרח הוותיק באזור האישי.' : 'הצעד הבא: לבדוק באזור האישי שהמעמד וההכנסות מעודכנים, ולהשוות לדרישת התשלום.', label: 'לבדיקת הדיווחים באזור האישי בביטוח הלאומי', href: reg.rights_bituach.personal_url, kind: 'personal' };
	}
	if (r.status === 'pension') {
		return { text: `הצעד הבא: להשוות את החישוב לניכויים בתלוש הפנסיה${r.S > 0 ? ' ובתלוש השכר' : ''}, ולבדוק את הדיווחים והאישורים.`, label: 'לרשימת הבדיקות לפנסיה', href: `#${P}-next-h`, kind: 'pension' };
	}
	// The existing server-rendered employee action is retained, including its rehearsal URL and tracking.
	return { kind: 'employee' };
}

export function updateNextAction(root, reg, r, employeeAction) {
	const box = root.querySelector(`#jtool-${TOOL_ID}-next`);
	const text = box && box.querySelector('.jtool-next__text');
	const link = box && box.querySelector('.jtool-next__cta > a.jtool-btn--primary');
	if (!text || !link || !employeeAction) { return; }
	const action = nextAction(reg, r);
	const values = action.kind === 'employee' ? employeeAction : action;
	text.textContent = values.text;
	link.textContent = values.label;
	link.setAttribute('href', values.href);
	for (const name of ['target', 'rel', 'data-act']) {
		const value = action.kind === 'employee' ? employeeAction[name] : null;
		if (value) { link.setAttribute(name, value); } else { link.removeAttribute(name); }
	}
	box.setAttribute('data-followup-kind', action.kind);
}

/** A click can arrive during the input debounce; read the action only after its result is current. */
export function actionAfterFlush(target, flush) {
	flush();
	const button = target.closest('[data-act]');
	return button ? button.getAttribute('data-act') : null;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const rb = reg.rights_bituach;
	const today = opts.today || ilToday();
	let out = linesTable(reg, r) + coordHtml(reg, r) + selfHtml(reg, r, today);
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-year-h">חודש ושנה</h3></div><div class="jtool-scroll" role="region" aria-labelledby="${P}-year-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">בחודש</th><th scope="col">בשנה</th></tr></thead><tbody>`
		+ (r.none && r.none.kind === 'student' ? '' : `<tr><td data-th="מה">דמי ביטוח לאומי</td><td data-th="בחודש">${ilsn(r.monthly.bl)}</td><td data-th="בשנה">${ilsn(r.annual.bl)}</td></tr><tr><td data-th="מה">דמי ביטוח בריאות</td><td data-th="בחודש">${ilsn(r.monthly.health)}</td><td data-th="בשנה">${ilsn(r.annual.health)}</td></tr>`)
		+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול</td><td data-th="בחודש">${ilsn(r.monthly.total)}</td><td data-th="בשנה">${ilsn(r.annual.total)}</td></tr>`
		+ (r.monthly.employer ? `<tr><td data-th="מה">חלק המעסיק</td><td data-th="בחודש">${ilsn(r.monthly.employer)}</td><td data-th="בשנה">${ilsn(r.annual.employer)}</td></tr>` : '')
		+ `</tbody><caption>${r.status === 'self' || r.status === 'both' ? 'המקדמה מחושבת לפי ההכנסה שבידי הביטוח הלאומי; אחרי השומה הסופית מחושבים ההפרשים.' : 'החודש כפול 12, בשיעורים ובסכומים של 2026.'}</caption></table></div></div>`;
	if (r.age) {
		const a = r.age;
		out += `<p class="jt28-age">לפי חודש הלידה: גיל <bdi>${a.ageY}</bdi>${a.ageM ? ` ו-<bdi>${a.ageM}</bdi> חודשים` : ''}. גיל הפרישה <bdi>${a.ret.y}</bdi>${a.ret.m ? ` ו-<bdi>${a.ret.m}</bdi> חודשים` : ''}, בחודש <bdi>${esc(a.retMonth)}</bdi>; גיל ${rb.retirement.entitlement_age} בחודש <bdi>${esc(a.month70)}</bdi>.${a.edge ? ' החודש הזה הוא חודש יום ההולדת: מהו השיעור בו, תלוי ביום המדויק.' : ''}${cite('טבלת גיל הפרישה', rb.retirement.url)}</p>`;
	}
	const steps = nextSteps(reg, r);
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-next-h">מה עושים עכשיו</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ol class="jtool-steps">${steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol><p class="jt28-links">${cite('האזור האישי', rb.personal_url)}${cite('שיעורי דמי הביטוח', rb.source_url)}${cite('חוק הביטוח הלאומי, פרק ט"ו', rb.law_url)}</p></div>`;
	return out;
}

/** Page section: every published rate of 2026 in one table, from the registry. */
export function ratesTable(reg) {
	const rb = reg.rights_bituach;
	const e = rb.employee;
	const s = rb.self;
	const two = (a) => `${pct(a[0])} / ${pct(a[1])}`;
	const rows = [
		['שכיר/ה, מגיל 18 ועד גיל הפרישה', `ביטוח לאומי ${pct(e.work.bl[0])}, בריאות ${pct(e.work.health[0])}`, `ביטוח לאומי ${pct(e.work.bl[1])}, בריאות ${pct(e.work.health[1])}`, two(e.work.employer), e.url],
		['שכיר/ה מתחת לגיל 18', 'אין ניכוי מהעובד', 'אין ניכוי מהעובד', two(e.u18.employer), e.url],
		['אישה מגיל הפרישה שלה ועד 67, בלי קצבת אזרח ותיק', `יחד ${pct(e.w_ret.total[0])}`, `יחד ${pct(e.w_ret.total[1])}`, two(e.w_ret.employer), e.url],
		['מגיל 67 ועד 70, בלי קצבת אזרח ותיק', `יחד ${pct(e.r67.total[0])}`, `יחד ${pct(e.r67.total[1])}`, two(e.r67.employer), e.url],
		['מקבלי קצבת אזרח ותיק', 'אין ניכוי מהשכר', 'אין ניכוי מהשכר', two(e.oap.employer), e.url],
		['מקבלי קצבת נכות עם אישור שנתי', `בריאות בלבד ${pct(e.disabled.health[0])}`, `בריאות בלבד ${pct(e.disabled.health[1])}`, two(e.disabled.employer), e.url],
		['עצמאי/ת, מגיל 18 ועד גיל הפרישה', `ביטוח לאומי ${pct(s.work.bl[0])}, בריאות ${pct(s.work.health[0])}`, `ביטוח לאומי ${pct(s.work.bl[1])}, בריאות ${pct(s.work.health[1])}`, '—', s.url],
		['עצמאי/ת מגיל הפרישה, בלי קצבת אזרח ותיק', `יחד ${pct(s.ret.total[0])}`, `יחד ${pct(s.ret.total[1])}`, '—', s.url],
		['עצמאי/ת מתחת ל-18, או עם קצבת אזרח ותיק', `ביטוח לאומי ${pct(s.u18.bl[0])}`, `ביטוח לאומי ${pct(s.u18.bl[1])}`, '—', s.url],
		['פנסיה מוקדמת', `ביטוח לאומי ${pct(rb.pension.bl[0])}, בריאות ${pct(rb.pension.health[0])}`, `ביטוח לאומי ${pct(rb.pension.bl[1])}, בריאות ${pct(rb.pension.health[1])}`, '—', rb.pension.url],
		[`הכנסה שלא מעבודה (אחרי ${money(rb.passive_exempt.amount, 0)} ₪ שלא נספרים)`, `ביטוח לאומי ${pct(rb.none.passive.bl[0])}, בריאות ${pct(rb.none.passive.health[0])}`, `ביטוח לאומי ${pct(rb.none.passive.bl[1])}, בריאות ${pct(rb.none.passive.health[1])}`, '—', rb.none.url],
		['לא עובד/ת, בלי הכנסות', `<bdi>${money(rb.none.total, 0)}</bdi> ₪ בחודש (<bdi>${money(rb.none.bl, 0)}</bdi> ביטוח לאומי, <bdi>${money(rb.none.health, 0)}</bdi> בריאות)`, '—', '—', rb.none.url],
		['סטודנט/ית שלא עובד/ת', `<bdi>${money(rb.student.total, 0)}</bdi> ₪ בחודש`, '—', '—', rb.student.url],
	].map(([who, low, high, emp, url]) => `<tr><td data-th="מי">${esc(who)}</td><td data-th="עד ${money(rb.tier.amount, 0)} ₪">${low}</td><td data-th="מעל ${money(rb.tier.amount, 0)} ₪">${high}</td><td data-th="המעסיק">${emp}</td><td data-th="מקור"><a href="${esc(url)}" target="_blank" rel="noopener">הביטוח הלאומי</a></td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>שיעורי דמי ביטוח לאומי ובריאות מ-${isoToHe(rb.from)}: עד המדרגה המופחתת (${money(rb.tier.amount, 0)} ₪) ומעליה ועד ההכנסה המרבית (${money(rb.max.amount, 0)} ₪). עצמאי/ת שהכנסתו נמוכה מ-${money(rb.min_self.amount, 0)} ₪ משלם/ת לפי ההכנסה המזערית.</caption><thead><tr><th scope="col">מי</th><th scope="col">עד ${money(rb.tier.amount, 0)} ₪</th><th scope="col">מעל ${money(rb.tier.amount, 0)} ₪</th><th scope="col">המעסיק</th><th scope="col">מקור</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const rb = reg.rights_bituach;
	const r = compute(reg, EXAMPLE);
	const c = r.salary.charge;
	const pr = r.salary.parts;
	const e = r.salary.rate;
	const n0 = (x) => money(x, x % 1 ? 2 : 0);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.monthly.total,
		sticky: ilsn(r.monthly.total),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { today: rb.checked_on }),
		method: `<ol><li>השכר ${n0(r.S)} ₪ מתחלק לשני חלקים: ${n0(pr.reduced)} ₪ עד המדרגה המופחתת, ו-${n0(pr.full)} ₪ מעליה${cite(rb.tier.section, rb.tier.url)}; עד ההכנסה המרבית, ${n0(rb.max.amount)} ₪${cite(rb.max.section, rb.max.url)}</li>`
			+ `<li>ביטוח לאומי: ${n0(pr.reduced)} × ${e.bl[0]}% = ${money(c.blR)} ₪, ועוד ${n0(pr.full)} × ${e.bl[1]}% = ${money(c.blF)} ₪; יחד ${money(c.bl)} ₪${cite('דף השיעורים לשכירים', rb.employee.url)}</li>`
			+ `<li>דמי ביטוח בריאות: ${n0(pr.reduced)} × ${e.health[0]}% = ${money(c.hR)} ₪, ועוד ${n0(pr.full)} × ${e.health[1]}% = ${money(c.hF)} ₪; יחד ${money(c.health)} ₪${cite('שיעורי דמי ביטוח בריאות', rb.employee.health_url)}</li>`
			+ `<li>ניכוי מהשכר: ${money(c.total)} ₪ בחודש, ${money(r.annual.total)} ₪ בשנה.</li>`
			+ `<li>חלק המעסיק: ${n0(pr.reduced)} × ${e.employer[0]}% = ${money(c.eR)} ₪, ועוד ${n0(pr.full)} × ${e.employer[1]}% = ${money(c.eF)} ₪; יחד ${money(r.salary.employer)} ₪, ועלות השכר ${money(r.salary.cost)} ₪${cite('דף השיעורים לשכירים', rb.employee.url)}</li></ol>`,
		compare_table: ratesTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root, month) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const pick = (name, def) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || def;
	const amt = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	return {
		status: pick('st', 'employee'), band: pick('bd', 'work'), salary: amt('sal'), extra: [amt('x0'), amt('x1')],
		mode: pick('md', 'full'), selfIncome: amt('se'), pension: amt('pn'), noneKind: pick('nk', 'none'), passive: amt('pv'),
		disabled: on('dis'), pensionExempt: on('pex'), sex: pick('sx', 'm'), born: val(`#${P}-born`).trim(), oap: on('oap'), month,
	};
}

const SM = { employee: 'e', self: 's', both: 'b', none: 'n', pension: 'p' };
const BM = { u18: 'u', work: 'w', w_ret: 'f', r67: 'r', oap: 'o' };
const NM = { none: 'n', student: 's', passive: 'p' };
const keyOf = (map, v) => Object.keys(map).find((k) => map[k] === v);
/** The share link holds the answers that change the figure, never the month of birth (the band is shared instead). */
export function stateOf(i, band) {
	const extra = (i.extra || []).filter((v) => !blank(v));
	return encodeState({ s: SM[i.status] || 'e', b: BM[band || i.band] || 'w', w: i.salary, x: extra.join('~'), m: i.mode === 'tier' ? 't' : '', e: i.selfIncome, p: i.pension, k: i.status === 'none' ? NM[i.noneKind] : '', i: i.status === 'none' && i.noneKind === 'passive' ? i.passive : '', d: i.disabled ? 1 : '', q: i.pensionExempt ? 1 : '' });
}
export const KEYS = ['s', 'b', 'w', 'x', 'm', 'e', 'p', 'k', 'i', 'd', 'q'];
export function inputOf(s) {
	if (!s.s || !keyOf(SM, s.s)) { return null; }
	const n = (v) => (v === undefined || v === '' ? '' : Number(v));
	const extra = (s.x || '').split('~').filter(Boolean).map(Number).concat(['', '']).slice(0, 2);
	return {
		status: keyOf(SM, s.s), band: keyOf(BM, s.b) || 'work', salary: n(s.w), extra, mode: s.m === 't' ? 'tier' : 'full',
		selfIncome: n(s.e), pension: n(s.p), noneKind: keyOf(NM, s.k) || 'none', passive: n(s.i), disabled: s.d === '1', pensionExempt: s.q === '1',
		sex: '', born: '', oap: false, month: '',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const nextBox = root.querySelector(`#jtool-${TOOL_ID}-next`);
	const nextLink = nextBox && nextBox.querySelector('.jtool-next__cta > a.jtool-btn--primary');
	const employeeAction = nextLink ? {
		text: nextBox.querySelector('.jtool-next__text').textContent,
		label: nextLink.textContent, href: nextLink.getAttribute('href'),
		target: nextLink.getAttribute('target'), rel: nextLink.getAttribute('rel'), 'data-act': nextLink.getAttribute('data-act'),
	} : null;
	const rb = reg.rights_bituach;
	const today = ilToday();
	const month = today.slice(0, 7);
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(rb.checked_on, rb.refresh_every_days) || (rb.next_update && today >= rb.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהשיעורים התעדכנו ב-1 בינואר'); }
	}
	const ids = { salary: 'sal', extra0: 'x0', extra1: 'x1', selfIncome: 'se', pension: 'pn', passive: 'pv', born: 'born' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${ids[e.field] || e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const st = (root.querySelector(`input[name="${P}-st"]:checked`) || {}).value || 'employee';
		form.querySelectorAll('[data-show]').forEach((el) => { el.hidden = !el.getAttribute('data-show').split(' ').includes(st); });
		const nk = (root.querySelector(`input[name="${P}-nk"]:checked`) || {}).value || 'none';
		form.querySelectorAll('[data-if-passive]').forEach((el) => { el.hidden = nk !== 'passive'; });
		const lab = root.querySelector(`label[for="${P}-sal"]`);
		if (lab) { lab.textContent = st === 'pension' ? 'שכר חודשי ברוטו, אם עובדים גם כשכירים (לא חובה)' : 'שכר חודשי ברוטו (אצל המעסיק העיקרי)'; }
	};
	const ageOut = (input) => {
		const out = form.querySelector('[data-age-out]');
		const born = monthOf(input.born);
		if (!out) { return; }
		if (!born || born > month) { out.textContent = ''; return; }
		const a = bandFor(rb, input.sex, born, month, input.oap);
		out.textContent = `גיל הפרישה: ${a.ret.y}${a.ret.m ? ` ו-${a.ret.m} חודשים` : ''}, בחודש ${a.retMonth}. החישוב לפי: ${BAND_LABEL[a.band]}.`;
		const chipEl = form.querySelector(`input[name="${P}-bd"][value="${a.band}"]`);
		if (chipEl) { chipEl.checked = true; }
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today });
		updateNextAction(root, reg, r, employeeAction);
		if (sticky) { sticky.innerHTML = r.ok ? ilsn(r.monthly.total) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: `${r.status}_${r.incomeBand}` }); }
		return r;
	};
	const schedule = (ev) => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		// A band chip chosen by hand wins over the birth month: the month field is cleared.
		if (ev && ev.target && ev.target.name === `${P}-bd`) { const b = form.querySelector(`#${P}-born`); if (b && b.value) { b.value = ''; } }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = readForm(root, month); ageOut(input); run(input); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(Object.assign(fromHash, { month }), { silent: true });
	} else {
		// The server HTML holds the example as of the registry's day; the live page recomputes it for today (dues ahead).
		run(readForm(root, month), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const act = actionAfterFlush(ev.target, () => {
			if (timer) { clearTimeout(timer); timer = null; run(readForm(root, month), { silent: true }); }
		});
		if (!act) { return; }
		const input = readForm(root, month);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input, r.ok ? r.band : input.band));
		if (act === 'ics' && r.ok) {
			const dues = duesAhead(rb, today);
			const each = r.self ? ` (${money(r.self.charge.total)} ₪ לפי החישוב)` : '';
			download('dmei-bituach.ics', 'text/calendar;charset=utf-8', ics(dues.map((d) => ({ date: d, summary: `מקדמת דמי ביטוח לאומי ובריאות לעצמאי: מועד הדיווח והתשלום${each}`, description: `לפי לוח המועדים של הביטוח הלאומי. בהוראת קבע החיוב ב-${rb.dues.standing_order_day} בחודש. חושב ב-jus-tice.co.il, מידע כללי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(nextSteps(reg, r).map((x, i) => `${i + 1}. ${x}`).join('\n'));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות, טלפון או תאריך לידה.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי שיעורי הביטוח הלאומי ל-${rb.year} ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(rb.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.status : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input, r.ok ? r.band : input.band));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, s); sync(); run(Object.assign(s, { month })); }
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
