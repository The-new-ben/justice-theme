/**
 * The rights wave UI (21.10.2026): the general disability pension (kitzbat-nechut). Two pictures from the Institute's own
 * world: the degree ladder (the four degrees of incapacity as rungs, each with the monthly pension for the reader's family
 * and wage, the medical-disability scale with its thresholds above it), and the wage-and-pension ledger (one column per
 * wage step: the wage at the bottom, the pension above it, the lines where schedule 8.1 starts to cut and where the pension
 * ends), so "every extra shekel of work: how much stays" is visible. The tables, the checklist and the .ics say the same.
 */
import { compute, pensionAt, byWage, STATUSES, SPOUSE_KINDS } from './nechut-engine.js';
import {
	esc, ils, money, num, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'kitzbat-nechut';
const P = 'jt33';

export const EXAMPLE = { age: 45, sex: '', status: 'new', homemaker: false, medMode: 'total', med: 60, single: '', meds: [], degree: 74, spouse: 'dep', kids: 2, wage: 3000, other: '', det: '2026-03-01', claim: '2026-06-01', notice: '2026-10-01', ruling: '', full6: false };

const MARK = { bad: '✕', warn: '!', info: 'i' };
const isNum = (v) => typeof v === 'number' && Number.isFinite(v);
const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const pctTxt = (n) => `${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`;
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const kidsHe = (n) => (n === 1 ? 'לילד אחד' : `ל-${n} ילדים`).replace('ל-2 ילדים', 'לשני ילדים');

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const nc = reg.rights_nechut;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const field = (id, label, value, ph, mode = 'numeric') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="${mode}" autocomplete="off" value="${esc(value)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const show = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : String(v));
	const moneyField = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(isNum(value) ? money(value, value % 1 ? 2 : 0) : show(value))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const age = Number(input.age);
	const status = STATUSES.includes(input.status) ? input.status : 'new';
	const list = input.medMode === 'list';
	const meds = Array.isArray(input.meds) ? input.meds : [];
	const deg = Number(input.degree);
	const sp = SPOUSE_KINDS.includes(input.spouse) ? input.spouse : 'none';
	const kids = Math.min(Number(input.kids) || 0, 3);
	const hm = input.homemaker === true;
	const md = nc.medical;
	const dp = nc.dependents;
	return `<div class="jtool-row">${field('age', 'גיל', show(input.age), 'לדוגמה: 45')}`
		+ `<fieldset class="jtool-field"><legend>מה המצב היום</legend><div class="jtool-chips">${chip('st', 'new', 'תביעה ראשונה', status === 'new')}${chip('st', 'receiving', 'כבר מקבלים קצבה', status === 'receiving')}</div><p class="jtool-error" id="${P}-status-e" role="alert"></p></fieldset></div>`
		+ `<fieldset class="jtool-field" data-if-62${age >= nc.age.women_from ? '' : ' hidden'}><legend>גיל הפרישה תלוי במין</legend><div class="jtool-chips">${chip('sex', 'm', 'גבר', input.sex === 'm')}${chip('sex', 'f', 'אישה', input.sex === 'f')}</div><p class="jtool-hint">גבר: ${num(nc.age.men_max, 0)}. ${esc(nc.age.women_he)}.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>הנכות הרפואית שנקבעה (או שאתם מצפים לה)</legend><div class="jtool-chips">${chip('mm', 'total', 'אחוז כולל', !list)}${chip('mm', 'list', 'כמה ליקויים', list)}</div>`
		+ `<div class="jtool-row" data-if-mm="total"${list ? ' hidden' : ''} style="margin-top:8px">${field('med', 'נכות רפואית כוללת, באחוזים', show(input.med), 'לדוגמה: 60', 'decimal')}${field('single', `הליקוי הגדול לבדו (כשהכולל פחות מ-${md.min}%)`, show(input.single), 'לדוגמה: 25', 'decimal')}</div>`
		+ `<div class="${P}-meds" data-if-mm="list"${list ? '' : ' hidden'}>${[0, 1, 2, 3, 4, 5].map((i) => field(`m${i}`, `ליקוי ${i + 1}`, show(meds[i]), '%', 'decimal')).join('')}</div>`
		+ `<p class="jtool-hint">${esc(md.weighted_he)}. התנאי: ${num(md.min, 0)}%, או ${num(md.alt_min, 0)}% כשליקוי אחד לבדו ${num(md.single_min, 0)}% לפחות (${esc(md.section)}).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>דרגת אי-הכושר להשתכר</legend><div class="jtool-chips">${chip('deg', '0', `פחות מ-${nc.degree.min_loss}%`, deg === 0)}${nc.degree.levels.map((d) => chip('deg', String(d), `${d}%`, deg === d)).join('')}</div>`
		+ `<p class="jtool-hint">פקיד התביעות קובע אחת מהדרגות האלה, ומעל ${num(nc.degree.full_above, 0)}% הדרגה מלאה (${esc(nc.degree.section)}). ${esc(nc.degree.he_75)}.</p><p class="jtool-error" id="${P}-degree-e" role="alert"></p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>בן או בת זוג</legend><div class="jtool-chips">${chip('sp', 'none', 'אין', sp === 'none')}${chip('sp', 'dep', `יש, עם הכנסה עד ${money(dp.spouse_income_max, 0)} ₪ ובלי קצבה`, sp === 'dep')}${chip('sp', 'earns', 'יש, עם הכנסה גבוהה יותר או קצבה', sp === 'earns')}</div><p class="jtool-error" id="${P}-spouse-e" role="alert"></p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>ילדים</legend><div class="jtool-chips">${[0, 1, 2, 3].map((n) => chip('kids', n, n === 3 ? '3 ומעלה' : String(n), kids === n)).join('')}</div><p class="jtool-hint">${esc(dp.kids_he)}.</p><p class="jtool-error" id="${P}-kids-e" role="alert"></p></fieldset>`
		+ `<div data-if-hm="0"${hm ? ' hidden' : ''}>${moneyField('wage', 'הכנסה חודשית מעבודה, ברוטו (0 אם לא עובדים)', input.wage, 'לדוגמה: 3,000')}<p class="jtool-hint">${esc(nc.work.income_he)}.</p></div>`
		+ `<details class="jtool-more"${(Number(input.other) || 0) > 0 ? ' open' : ''}><summary>יש הכנסה שלא מעבודה (פנסיה, שכר דירה, קצבה אחרת)?</summary><div style="margin-top:8px">${moneyField('other', 'הכנסה חודשית שלא מעבודה', input.other, 'לדוגמה: 2,000')}<p class="jtool-hint">${esc(nc.other_income.he)} (${esc(nc.other_income.section)}).</p></div></details>`
		+ `<details class="jtool-more"${hm ? ' open' : ''}><summary>אישה נשואה שלא עבדה: מסלול עקרת בית</summary><div class="jtool-chips" style="margin-top:8px">${chip('hm', '1', 'מסלול עקרת בית', hm, 'checkbox')}</div><p class="jtool-hint">${esc(nc.homemaker.def_he)}. ${esc(nc.homemaker.test_he)}; הנכות הרפואית הנדרשת ${num(md.homemaker_min, 0)}%; ${esc(dp.homemaker_he)}.</p></details>`
		+ `<fieldset class="jtool-field"><legend>המועדים (לא חובה)</legend><div class="jtool-row">${field('det', 'מאיזה יום לא יכולתם לעבוד', isoToHe(toIso(input.det)), 'לדוגמה: 1.3.2026')}${field('claim', 'יום הגשת התביעה', isoToHe(toIso(input.claim)), 'לדוגמה: 1.6.2026')}</div>`
		+ `${field('notice', 'היום שבו הגיעה ההחלטה (אחוזים או דרגה)', isoToHe(toIso(input.notice)), 'לדוגמה: 1.10.2026')}`
		+ `<details class="jtool-more"${input.ruling || input.full6 ? ' open' : ''}><summary>ועדת עררים, ודרגה ${nc.degree.levels[nc.degree.levels.length - 1]}% ל-${nc.clock.early_min_months} חודשים</summary><div style="margin-top:8px">${field('ruling', 'היום שבו הגיעה החלטת ועדת העררים', isoToHe(toIso(input.ruling)), 'לדוגמה: 1.12.2026')}</div>`
		+ `<div class="jtool-chips">${chip('f6', '1', `נקבעה דרגה ${nc.degree.levels[nc.degree.levels.length - 1]}% ל-${nc.clock.early_min_months} חודשים לפחות`, input.full6 === true, 'checkbox')}</div><p class="jtool-hint">${esc(nc.clock.early_he)} (${esc(nc.clock.early_section)}).</p></details></fieldset>`;
}

function familyHe(r) {
	const c = r.calc;
	const parts = [];
	if (c.spouse) { parts.push('לבן או בת הזוג'); }
	if (c.kidsN) { parts.push(kidsHe(c.kidsN)); }
	return parts.length ? `, עם תוספת ${parts.join(' ו')}` : '';
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const nc = reg.rights_nechut;
	if (!r.eligible) {
		const g = r.gates.find((x) => x.state === 'no');
		return `אין זכאות לקצבת נכות כללית לפי מה שהוזן. ${g.he}.`;
	}
	const out = [];
	if (r.monthly > 0) {
		out.push(`קצבת נכות של ${nis(r.monthly)} בחודש (דרגה ${r.degree}%${familyHe(r)}): ${nis(r.annual)} בשנה.`);
		if (r.wage > 0) { out.push(`עם שכר של ${nis(r.wage)} מעבודה ההכנסה החודשית ${nis(r.total)}, ומכל 100 ₪ נוספים בשכר נשארים ${r.keep} ₪${r.nextKeep ? ` עד שכר של ${nis(r.nextKeep.from)}` : ''}.`); }
	} else {
		out.push(`בשכר של ${nis(r.wage)} לא משולמת קצבה (דרגה ${r.degree}%). הדרגה נשמרת: כשההכנסה יורדת מתחת ל-${nis(nc.work.new_claim_max)}, הקצבה חוזרת בלי ועדה רפואית.`);
	}
	if (r.verdict === 'check') { out.push('בדקו את גיל הפרישה שלכם.'); }
	if (r.appealBy) { out.push(`ערר על ההחלטה עד ${isoToHe(r.appealBy)}.`); }
	return out.join(' ');
}

/** The degree ladder: the medical scale with its thresholds, then a rung per degree with the pension at it. */
function ladder(reg, r) {
	const nc = reg.rights_nechut;
	const md = nc.medical;
	const max = Math.max(1, ...r.ladder.map((x) => x.pay));
	const ticks = [{ v: md.single_min, he: `${md.single_min}%`, k: 'single' }, { v: md.alt_min, he: `${md.alt_min}%`, k: 'alt' }]
		.concat(r.homemaker ? [{ v: md.homemaker_min, he: `${md.homemaker_min}%`, k: 'hm' }] : [])
		.concat([{ v: md.min, he: `${md.min}%`, k: 'min' }]);
	const pos = (v) => `${Math.max(0, Math.min(100, v)).toFixed(1)}%`;
	const scale = `<div class="${P}-scale" role="img" aria-label="${esc(`נכות רפואית ${pctTxt(r.med)} מול הסף: ${md.min}%, או ${md.alt_min}% עם ליקוי יחיד של ${md.single_min}%`)}"><span class="${P}-scale__track"><i class="${P}-scale__fill${r.medVia ? '' : ` ${P}-scale__fill--no`}" style="width:${pos(r.med)}"></i>`
		+ ticks.map((t) => `<b class="${P}-scale__tick ${P}-scale__tick--${t.k}" style="inset-inline-start:${pos(t.v)}"></b>`).join('')
		+ (r.single ? `<b class="${P}-scale__one" style="inset-inline-start:${pos(r.single)}"></b>` : '')
		+ `</span><span class="${P}-scale__labels">${ticks.map((t) => `<em style="inset-inline-start:${pos(t.v)}">${esc(t.he)}</em>`).join('')}</span>`
		+ `<span class="${P}-scale__cap">${esc(`נכות רפואית ${pctTxt(r.med)}${r.single ? `, הליקוי הגדול ${pctTxt(r.single)}` : ''}. הסף: ${r.homemaker ? `${md.homemaker_min}% במסלול עקרת בית` : `${md.min}%, או ${md.alt_min}% כשליקוי אחד לבדו ${md.single_min}%`}`)}</span></div>`;
	const rungs = r.ladder.map((x) => `<li class="${P}-rung${x.here ? ` ${P}-rung--here` : ''}"><span class="${P}-rung__d">${x.degree}%</span><span class="${P}-rung__bar" aria-hidden="true"><i style="width:${(x.pay / max * 100).toFixed(1)}%"></i></span><span class="${P}-rung__v">${x.pay ? ilsn(x.pay) : 'אין תשלום'}${x.here ? '<small>אתם</small>' : ''}</span></li>`).join('')
		+ `<li class="${P}-rung ${P}-rung--none${r.degree === 0 ? ` ${P}-rung--here` : ''}"><span class="${P}-rung__d">פחות מ-${nc.degree.min_loss}%</span><span class="${P}-rung__bar" aria-hidden="true"></span><span class="${P}-rung__v">אין קצבה${r.degree === 0 ? '<small>אתם</small>' : ''}</span></li>`;
	return `<figure class="${P}-lad"><figcaption class="${P}-lad__h">סולם הדרגות: הקצבה לחודש לכל דרגה, באותה משפחה ובאותו שכר</figcaption>${scale}<ol class="${P}-lad__rungs">${rungs}</ol></figure>`;
}

/** The wage-and-pension ledger: a column per wage step, the wage below and the pension above, with the law's lines. */
function wageChart(reg, r) {
	const bars = r.bars;
	if (!bars.length) { return ''; }
	const step = bars.length > 1 ? bars[1].w - bars[0].w : 1000;
	const span = bars[bars.length - 1].w + step;
	const w = 360;
	const h = 176;
	const pad = 6;
	const top = 14;
	const bottom = 20;
	const yMax = Math.max(...bars.map((b) => b.w + b.pay)) * 1.08;
	const xv = (v) => w - pad - (v / span) * (w - 2 * pad);
	const y = (v) => top + (1 - v / yMax) * (h - top - bottom);
	const f = (v) => v.toFixed(1);
	let out = '';
	bars.forEach((b) => {
		const x0 = xv(b.w + step) + 1;
		const x1 = xv(b.w) - 1;
		const here = r.wage >= b.w && r.wage < b.w + step;
		out += `<rect class="${P}-ch__w" x="${f(x0)}" y="${f(y(b.w))}" width="${f(x1 - x0)}" height="${f(y(0) - y(b.w))}"></rect>`;
		if (b.pay > 0) { out += `<rect class="${P}-ch__p${here ? ` ${P}-ch__p--here` : ''}" x="${f(x0)}" y="${f(y(b.w + b.pay))}" width="${f(x1 - x0)}" height="${f(y(b.w) - y(b.w + b.pay))}"></rect>`; }
	});
	const lines = [];
	const th = r.th;
	if (r.degree === 100) { lines.push({ v: th.tiers[0], k: 'cut' }); } else if (isNum(r.cross)) { lines.push({ v: r.cross, k: 'cut' }); }
	if (r.end) { lines.push({ v: r.end, k: 'end' }); }
	lines.forEach((l) => { if (l.v < span) { out += `<line class="${P}-ch__l ${P}-ch__l--${l.k}" x1="${f(xv(l.v))}" x2="${f(xv(l.v))}" y1="${top}" y2="${f(y(0))}"></line>`; } });
	if (r.wage > 0 && r.wage < span) { out += `<line class="${P}-ch__you" x1="${f(xv(r.wage))}" x2="${f(xv(r.wage))}" y1="${top - 6}" y2="${f(y(0))}"></line>`; }
	const tick = (v, anchor) => `<text class="${P}-ch__t" x="${f(xv(v))}" y="${h - 5}" text-anchor="${anchor}">${money(v, 0)}</text>`;
	const label = `השכר והקצבה בכל שכר מ-0 עד ${money(span - step, 0)} ₪: אצלכם ${money(r.wage, 0)} ₪ שכר ועוד ${money(r.monthly, 0)} ₪ קצבה${r.end ? `; הקצבה נגמרת בשכר של ${money(r.end, 0)} ₪` : ''}`;
	const last = r.end && r.end < span ? tick(r.end, r.end > span - 2 * step ? 'start' : 'middle') : tick(span - step, 'start');
	return `<svg class="${P}-ch__svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><line class="${P}-ch__base" x1="${pad}" x2="${w - pad}" y1="${f(y(0))}" y2="${f(y(0))}"></line>${out}${tick(0, 'end')}${last}</svg>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const nc = reg.rights_nechut;
	const state = !r.eligible ? '<p class="jtool-state jtool-state--danger">✕ אין זכאות לפי מה שהוזן</p>'
		: r.verdict === 'check' ? '<p class="jtool-state jtool-state--warn">! זכאות, אם עוד לא הגעתם לגיל הפרישה</p>'
			: r.monthly > 0 ? '<p class="jtool-state jtool-state--ok">✓ יש זכאות לקצבת נכות כללית</p>'
				: '<p class="jtool-state jtool-state--info">i הדרגה נשמרת, הקצבה מושהית בגלל השכר</p>';
	let out = `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}קצבת נכות לחודש${r.degree ? `, דרגה ${r.degree}%` : ''}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.monthly, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`;
	if (r.eligible && r.calc) {
		const start = r.clock ? r.clock.payFrom : null;
		out += `<dl class="jtool-breakdown"><div><dt>בשנה</dt><dd>${ils(r.annual, 0)}</dd></div>`
			+ `<div><dt>שכר ועוד קצבה</dt><dd>${ilsn(r.total)}</dd></div>`
			+ `<div><dt>מכל 100 ₪ נוספים בשכר</dt><dd>${ils(r.homemaker ? 0 : r.keep, 0)}</dd></div>`
			+ `<div><dt>${r.appealBy ? 'ערר עד' : 'הקצבה מ'}</dt><dd>${r.appealBy ? `<bdi>${esc(isoToHe(r.appealBy))}</bdi>` : start ? `<bdi>${esc(isoToHe(start))}</bdi>` : '—'}</dd></div></dl>`;
	}
	out += '</div>';
	if (r.calc && r.eligible) {
		out += ladder(reg, r);
		if (!r.homemaker) {
			const lim = r.degree === 100 ? r.th.tiers[0] : r.cross;
			out += `<figure class="${P}-ch">${wageChart(reg, r)}<figcaption class="${P}-ch__cap"><span><i class="${P}-k ${P}-k--w"></i>השכר</span><span><i class="${P}-k ${P}-k--p"></i>הקצבה</span>`
				+ `<span><i class="${P}-k ${P}-k--cut"></i>מכאן השכר מקטין את הקצבה: ${esc(nis(Math.ceil(lim)))}</span>${r.end ? `<span><i class="${P}-k ${P}-k--end"></i>הקצבה נגמרת: ${esc(nis(r.end))}</span>` : ''}`
				+ `<span><i class="${P}-k ${P}-k--you"></i>אתם: ${esc(nis(r.wage))} שכר ועוד ${esc(nis(r.monthly))} קצבה</span></figcaption></figure>`;
		}
	} else if (r.calc && !r.eligible) {
		out += `<p class="${P}-note">${esc(`אילו התנאים היו מתקיימים, בדרגה ${r.degree}% הקצבה הייתה ${nis(r.calc.pay)} בחודש.`)}</p>`;
	}
	const flags = r.flags.filter((x) => x.level !== 'info');
	if (flags.length) { out += `<ul class="jtool-flags">${flags.map((x) => `<li><strong aria-hidden="true">${MARK[x.level]}</strong> ${esc(x.he)}</li>`).join('')}</ul>`; }
	return out;
}

export function checklist(reg, r) {
	const nc = reg.rights_nechut;
	const c = nc.claim;
	const out = [{ he: `תביעה לקצבת נכות, טופס ${c.form}: מקוון באתר הממשלתי, או בטלפון ${c.phone} עם נציג שממלא איתכם`, section: `טופס ${c.form}`, url: c.form_url }];
	c.docs_he.slice(1).forEach((x, i) => { out.push({ he: x, section: 'המסמכים לתביעה', url: i === 0 ? c.docs_calculator_url : c.url }); });
	out.push({ he: c.fast_he, section: 'מסלול מהיר', url: c.fast_url });
	c.committee_he.forEach((x) => out.push({ he: `לוועדה הרפואית: ${x}`, section: 'בדיקה על ידי ועדה רפואית', url: c.committee_url }));
	out.push({ he: c.prep_he, section: 'יד מכוונת', url: c.prep_url });
	out.push({ he: c.income_support_he, section: 'הבטחת הכנסה', url: c.income_support_url });
	out.push({ he: nc.changes.he, section: 'הודעה על שינויים', url: nc.changes.url });
	return out;
}
export function checklistText(reg, r) { return checklist(reg, r).map((x, i) => `${i + 1}. ${x.he} (${x.section})`).join('\n'); }

function whyHe(nc, key) {
	const t = nc.work.tiers;
	const at = (i) => `מכאן כל שקל מקטין ב-${t[i].rate} אגורות`;
	return {
		none: 'בלי עבודה', t21: `עד ${nc.work.full_add_pct}% מהשכר הממוצע: תוספות לפי הדרגה`, t21up: 'שקל אחד מעל: התוספות מלאות', t1: 'עד כאן השכר לא נוגע בקצבה',
		t2: at(2), t3: at(3), cross: 'עד כאן הקצבה של הדרגה לא יורדת', last: 'השכר האחרון עם קצבה', end: 'הקצבה נגמרת', you: 'אתם',
	}[key] || '';
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const nc = reg.rights_nechut;
	const btl = reg.rights_btl;
	const pg = nc.pages;
	let out = '';
	// 1. The calculation, line by line.
	if (r.calc) {
		const c = r.calc;
		const full = nc.pension.amounts['100'];
		const row = nc.pension.amounts[String(r.degree)];
		const rows = [[`הקצבה לדרגה ${r.degree}%`, ilsn(c.pension), `לפי טבלת ${nc.from.slice(0, 4)}${cite(r.degree === 100 ? nc.pension.section : nc.pension.partial_section, nc.law_url)}${cite('סכום הקצבה', nc.pension.url)}`]];
		if (c.spouse) { rows.push([`תוספת לבן או בת הזוג${r.degree !== 100 ? (c.addFull ? ' (מלאה)' : ` (${r.degree}%)`) : ''}`, ilsn(c.addFull ? full.spouse : row.spouse), `הכנסה עד ${nis(nc.dependents.spouse_income_max)} ובלי קצבה${cite(nc.dependents.spouse_section, nc.schedules_url)}`]); }
		if (c.kidsN) { rows.push([`תוספת ${kidsHe(c.kidsN)}${r.degree !== 100 ? (c.addFull ? ' (מלאה)' : ` (${r.degree}%)`) : ''}`, ilsn(c.addFull ? c.kidsN * full.child : Math.round(r.degree / 100 * c.kidsN * full.child)), `${nis(full.child)} לכל ילד בדרגה מלאה, רק לשני הראשונים${cite(nc.dependents.section, nc.law_url)}`]); }
		if (c.fullAdd && r.degree !== 100) { rows.push(['התוספות כאן', ilsn(c.addB), c.addFull ? `מלאות: ההכנסה מעבודה מעל ${nis(nc.work.full_add_from)}${cite(nc.work.full_add_section, nc.law_url)}` : `${r.degree}% מ-${nis(c.fullAdd)}, מעוגל לשקל${cite(nc.pension.partial_section, nc.law_url)}`]); }
		if (r.degree !== 100) { rows.push(['הסכום לפי הדרגה', ilsn(c.own), 'הקצבה והתוספות']); }
		c.ded.parts.forEach((p) => { if (p.part > 0 && p.rate > 0) { rows.push([`${esc(p.he)}: <bdi>${money(p.part)} × ${p.rate}%</bdi>`, ilsn(p.cut), `הפחתה מהשכר${cite(nc.work.tiers_section, nc.schedules_url)}`]); } });
		if (!r.homemaker && r.wage > 0) { rows.push([`מהקצבה המלאה עם התוספות (${nis(full.pension + c.fullAdd)}) פחות ההפחתה (${nis(c.ded.rounded)})`, ilsn(Math.max(0, c.fromFull)), `${c.ded.rounded ? 'ההפחתה מעוגלת לשקל' : `שכר עד ${nis(nc.work.free_upto)} לא מקטין`}${cite(nc.work.tiers_section, nc.work.url)}`]); }
		if (r.degree !== 100 && !r.homemaker && r.wage > 0) { rows.push(['משולם הנמוך מהשניים', ilsn(Math.max(0, Math.min(c.own, c.fromFull))), `${c.laronBinds ? 'השכר כבר מקטין' : 'הסכום לפי הדרגה'}${cite(nc.work.tiers_section.split(';')[0], nc.law_url)}`]); }
		if (c.otherCut) { rows.push([`הכנסה שלא מעבודה: <bdi>${money(c.other, 0)} − ${money(c.disregard, 0)}</bdi>, עד הקצבה המלאה`, `−${ilsn(c.otherCut)}`, `${cite(nc.other_income.section, nc.law_url)}`]); }
		if (c.belowMin) { rows.push([`פחות מ-${nc.work.min_pct_of_basic}% מהסכום הבסיסי (${nis(Math.round(r.th.minPay * 100) / 100)})`, ilsn(0), `לא משולם${cite(nc.work.min_section, nc.law_url)}`]); }
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-calc-h">כמה, על מה, ולפי איזה סעיף</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-calc-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ rows.map(([a, b, cc]) => `<tr><td data-th="מה">${a}</td><td data-th="סכום">${b}</td><td data-th="הכלל">${cc}</td></tr>`).join('')
			+ `<tr class="jtool-table__total"><td data-th="מה">קצבה לחודש${r.eligible ? '' : ' (אילו התנאים התקיימו)'}</td><td data-th="סכום">${ilsn(c.pay)}</td><td data-th="הכלל">בשנה ${ilsn(c.pay * 12)}</td></tr>`
			+ `</tbody><caption>${esc(nc.clock.pay_he)}. הסכומים מ-${esc(isoToHe(nc.from))}, ברוטו.</caption></table></div></div>`;
		// 2. How the full pension is built from basic amount 4.
		const unit = btl.basic_amount.b4 * nc.pension.single_full_pct / 100;
		const comp = nc.pension.components.map((x) => [`${x.pct}% × ${money(unit, 0)}`, ilsn(Math.round(unit * x.pct) / 100), `${esc(x.he)}${cite(x.section, nc.law_url)}`]);
		const exact = Math.round(unit * nc.pension.components.reduce((a, x) => a + x.pct, 0)) / 100;
		const dp = nc.dependents;
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-build-h">איך בנויה הקצבה המלאה</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-build-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">רכיב</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ `<tr><td data-th="רכיב">קצבת יחיד מלאה: <bdi>${nc.pension.single_full_pct}% × ${money(btl.basic_amount.b4, 0)}</bdi></td><td data-th="סכום">${ilsn(unit)}</td><td data-th="הכלל">${esc(nc.pension.basic_he)}${cite(nc.pension.single_full_section, nc.law_url)}${cite('הסכום הבסיסי', btl.basic_amount.url)}</td></tr>`
			+ comp.map(([a, b, cc]) => `<tr><td data-th="רכיב"><bdi>${a}</bdi></td><td data-th="סכום">${b}</td><td data-th="הכלל">${cc}</td></tr>`).join('')
			+ `<tr class="jtool-table__total"><td data-th="רכיב">קצבה חודשית מלאה (${nc.pension.total_pct_of_basic}% מהסכום הבסיסי)</td><td data-th="סכום">${ilsn(exact)}</td><td data-th="הכלל">המוסד משלם ${nis(full.pension)}</td></tr>`
			+ `<tr><td data-th="רכיב">בן זוג: <bdi>${dp.spouse_pct}% × ${money(btl.basic_amount.b4, 0)} + ${dp.uplift_pct}%</bdi></td><td data-th="סכום">${ilsn(Math.round(btl.basic_amount.b4 * dp.spouse_pct * (100 + dp.uplift_pct) / 100) / 100)}</td><td data-th="הכלל">המוסד משלם ${nis(full.spouse)}${cite(dp.section, nc.law_url)}</td></tr>`
			+ `<tr><td data-th="רכיב">ילד: <bdi>${dp.child_pct}% × ${money(btl.basic_amount.b4, 0)} + ${dp.uplift_pct}%</bdi></td><td data-th="סכום">${ilsn(Math.round(btl.basic_amount.b4 * dp.child_pct * (100 + dp.uplift_pct) / 100) / 100)}</td><td data-th="הכלל">המוסד משלם ${nis(full.child)}${cite(dp.section, nc.law_url)}</td></tr>`
			+ `</tbody><caption>הקצבה החודשית הנוספת (הקח"ן) היא היום חלק מהקצבה המלאה, ולכן משולמת רק בדרגה מלאה. דרגה חלקית: הדרגה כפול ${nc.pension.components.filter((x) => x.partial === 'degree').map((x) => `${x.pct}%`).join(' ועוד ')}, ועוד ${nc.pension.components.filter((x) => x.partial === 'whole').map((x) => `${x.pct}%`).join('')} במלואו.</caption></table></div></div>`;
	}
	// 3. The gate.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-gate-h">תנאי הזכאות</h3></div><ul class="${P}-gate">`
		+ r.gates.map((g) => `<li class="${P}-gate__i ${P}-gate__i--${g.state}"><strong aria-hidden="true">${g.state === 'ok' ? '✓' : g.state === 'check' ? '!' : '✕'}</strong> ${esc(g.he)}${g.section ? cite(g.section, g.url) : cite('המוסד לביטוח לאומי', g.url)}</li>`).join('')
		+ `</ul>${r.weighted && r.weighted.steps.length ? `<p class="${P}-wsteps">החישוב המשוקלל: ${r.weighted.steps.map((s) => `<bdi>${pctTxt(s.p)} מתוך ${pctTxt(s.from)} = ${pctTxt(s.add)}</bdi>`).join(' + ')} = <bdi>${pctTxt(r.weighted.total)}</bdi>${cite('קביעת אחוז הנכות הרפואית', pg.medical)}${r.weighted.rounded !== r.weighted.total && nc.medical.round_section ? `, ${esc(nc.medical.round_he)}: <bdi>${pctTxt(r.weighted.rounded)}</bdi>${cite(nc.medical.round_section, nc.medical.round_url)}` : ''}</p>` : ''}</div>`;
	// 4. The ledger in text: wage, pension, total, and what stays of the next 100 shekels.
	if (r.ledger.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-led-h">שכר וקצבה: כמה נשאר מכל שקל</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-led-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">שכר ברוטו</th><th scope="col">קצבה</th><th scope="col">ביחד</th><th scope="col">מ-100 ₪ נוספים נשארים</th><th scope="col">מה קורה כאן</th></tr></thead><tbody>`
			+ r.ledger.map((x) => `<tr${x.you ? ` class="${P}-you"` : ''}><td data-th="שכר ברוטו">${ilsn(x.w)}</td><td data-th="קצבה">${ilsn(x.pay)}</td><td data-th="ביחד">${ilsn(x.total)}</td><td data-th="מ-100 ₪ נוספים נשארים">${ils(x.keep, 0)}</td><td data-th="מה קורה כאן">${esc(whyHe(nc, x.you ? 'you' : x.why))}</td></tr>`).join('')
			+ `</tbody><caption>${esc(`לוח ח1: עד ${pctTxt(nc.work.tiers[0].to_pct)} מהשכר הממוצע (${money(nc.work.free_upto, 0)} ₪) בלי הפחתה, ואחר כך ${nc.work.tiers.slice(1).map((t) => `${t.rate}%`).join(', ')} מכל שקל נוסף; קצבה של פחות מ-${nc.work.min_pct_of_basic}% מהסכום הבסיסי לא משולמת`)}${cite(nc.work.tiers_section, nc.work.tables[String(r.degree)] || nc.work.url)}</caption></table></div></div>`;
	}
	// 5. Every degree, the same family and wage.
	if (r.ladder.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-deg-h">אותה משפחה, אותו שכר, כל דרגה</h3></div><div class="jt7-scns ${P}-scns">`
			+ r.ladder.map((x) => `<div class="jt7-scn${x.here ? ' jt7-scn--here' : ''}"><p>דרגה ${x.degree}%${x.here ? ' (אתם)' : ''}</p><strong>${ilsn(x.pay)}</strong><small>${x.pay ? `בשנה ${money(x.pay * 12, 0)} ₪` : 'אין תשלום'}</small></div>`).join('')
			+ `</div><p class="jt7-scns__note">${esc(`${nc.degree.he_75}. דרגה זמנית נקבעת לשנתיים לכל היותר (${nc.degree.temp_section}). ${nc.recheck.he}.`)}</p></div>`;
	}
	// 6. The clock.
	if (r.deadlines.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">מקור</th></tr></thead><tbody>`
			+ r.deadlines.map((x) => `<tr${x.ics ? ` class="${P}-dl--key"` : ''}><td data-th="תאריך"><bdi>${esc(isoToHe(x.date))}</bdi></td><td data-th="מה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section || 'המוסד לביטוח לאומי', x.url)}</td></tr>`).join('')
			+ `</tbody><caption>${esc(`${nc.appeal.rest_he}. ${nc.appeal.lower_he}. ${nc.clock.pay_he}.`)}</caption></table></div></div>`;
	} else {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3></div><p class="${P}-note">${esc(`הזינו את היום שממנו לא יכולתם לעבוד ואת יום התביעה: הקצבה מתחילה בתום ${nc.clock.wait_days} ימים, ומשולמת לכל היותר בעד ${nc.clock.retro_months} החודשים שלפני חודש התביעה. מהיום שבו הגיעה החלטה יש ${nc.appeal.days} ימים לערר.`)}</p></div>`;
	}
	// 7. What to file, what to bring to the committee.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">מה מגישים, ואיך מתכוננים לוועדה הרפואית</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ol class="${P}-list">${checklist(reg, r).map((x) => `<li>${esc(x.he)}${cite(x.section, x.url)}</li>`).join('')}</ol></div>`;
	const info = r.flags.filter((x) => x.level === 'info');
	if (info.length) { out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-info-h">עוד לפני שמגישים</h3></div><ul class="${P}-info">${info.map((x) => `<li>${esc(x.he)}</li>`).join('')}</ul></div>`; }
	return out;
}

/** Page section: the 2026 amounts by degree, from the registry. */
export function amountsTable(reg) {
	const nc = reg.rights_nechut;
	const t = nc.pension.amounts;
	const rows = nc.degree.levels.slice().reverse().map((d) => {
		const a = t[String(d)];
		const most = pensionAt(reg, { degree: d, spouseDep: true, kids: nc.dependents.children_max, wage: 0 }).pay;
		return `<tr><td data-th="דרגת אי-כושר">${d === 100 ? '100% (או 75%)' : `${d}%`}</td><td data-th="קצבה לחודש">${ilsn(a.pension)}</td><td data-th="לכל ילד (עד 2)">${ilsn(a.child)}</td><td data-th="לבן או בת זוג">${ilsn(a.spouse)}</td><td data-th="עם בן זוג ושני ילדים">${ilsn(most)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`קצבת נכות כללית ותוספות התלויים מ-${isoToHe(nc.from)}, לפי דרגת אי-הכושר, בלי הכנסה מעבודה (${nc.pension.section}, ${nc.pension.partial_section}, ${nc.dependents.section})`)}${cite('סכום הקצבה', nc.pension.url)}</caption><thead><tr><th scope="col">דרגת אי-כושר</th><th scope="col">קצבה לחודש</th><th scope="col">לכל ילד (עד 2)</th><th scope="col">לבן או בת זוג</th><th scope="col">עם בן זוג ושני ילדים</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the pension of a single person by work income, every degree, from the same engine. */
export function workTable(reg) {
	const nc = reg.rights_nechut;
	const wages = [0, 4000, nc.work.free_upto, 8000, 9000, 10000, nc.work.crossover['74'], 12000, 13000, 14000, 16000];
	const cols = nc.degree.levels.slice().reverse().map((d) => ({ d, rows: byWage(reg, d, wages) }));
	const rows = wages.map((w, i) => `<tr><td data-th="שכר חודשי ברוטו">${ilsn(w)}</td>${cols.map((c) => `<td data-th="דרגה ${c.d}%">${ilsn(c.rows[i].pay)}</td>`).join('')}</tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`הקצבה ליחיד לפי השכר מעבודה, מ-${isoToHe(nc.from)}: בדרגה מלאה השכר מקטין את הקצבה מ-${money(nc.work.free_upto, 0)} ₪; בדרגה חלקית הקצבה לא יורדת עד ${Object.entries(nc.work.crossover).map(([d, v]) => `${money(v, 0)} ₪ (${d}%)`).join(', ')} (${nc.work.tiers_section})`)}${cite('לעבוד ולקבל קצבת נכות', nc.work.url)}</caption><thead><tr><th scope="col">שכר חודשי ברוטו</th>${cols.map((c) => `<th scope="col">דרגה ${c.d}%</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const nc = reg.rights_nechut;
	const c = r.calc;
	const th = r.th;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.monthly,
		sticky: ils(r.monthly, 0),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>תנאי הזכאות: גיל ${r.age}, נכות רפואית ${r.med}% (לפחות ${nc.medical.min}%), דרגת אי-כושר ${r.degree}%, הכנסה מעבודה ${money(r.wage, 0)} ₪, עד ${money(nc.work.new_claim_max, 0)} ₪${cite(nc.medical.section, nc.law_url)}${cite(nc.degree.section, nc.law_url)}${cite(nc.work.new_claim_section, nc.law_url)}</li>`
			+ `<li>הקצבה לדרגה ${r.degree}%: ${money(c.pension, 0)} ₪, מטבלת ${nc.from.slice(0, 4)} שנגזרת מסכום בסיסי 4 (${money(reg.rights_btl.basic_amount.b4, 0)} ₪)${cite(nc.pension.partial_section, nc.law_url)}${cite('סכום הקצבה', nc.pension.url)}</li>`
			+ `<li>התוספות: בן או בת זוג ${money(nc.pension.amounts['100'].spouse, 0)} ₪ ושני ילדים <bdi>2 × ${money(nc.pension.amounts['100'].child, 0)}</bdi> ₪ = ${money(c.fullAdd, 0)} ₪; ההכנסה מעבודה (${money(r.wage, 0)} ₪) מעל ${nc.work.full_add_pct}% מהשכר הממוצע (<bdi>${money(th.avg, 0)} × ${nc.work.full_add_pct}% = ${money(th.t21)}</bdi> ₪), ולכן התוספות מלאות ולא ${r.degree}% מהן (${money(c.partialAdd, 0)} ₪)${cite(nc.work.full_add_section, nc.law_url)}</li>`
			+ `<li>השכר מול לוח ח1: ${money(r.wage, 0)} ₪ מתחת ל-${nc.work.tiers[0].to_pct}% מהשכר הממוצע (${money(th.tiers[0])} ₪), אין הפחתה; הקצבה המלאה עם התוספות ${money(c.fromFull, 0)} ₪ גבוהה מהסכום לפי הדרגה, ולכן משולם <bdi>${money(c.pension, 0)} + ${money(c.addB, 0)} = ${money(c.pay, 0)}</bdi> ₪${cite(nc.work.tiers_section, nc.schedules_url)}</li>`
			+ `<li>שכר ועוד קצבה: <bdi>${money(r.wage, 0)} + ${money(r.monthly, 0)} = ${money(r.total, 0)}</bdi> ₪ בחודש; בלי עבודה הקצבה ${money(r.noWork.pay, 0)} ₪; בשנה <bdi>${money(r.monthly, 0)} × 12 = ${money(r.annual, 0)}</bdi> ₪; הקצבה לא יורדת עד שכר של ${money(nc.work.crossover[String(r.degree)], 0)} ₪, ונגמרת ב-${money(r.end, 0)} ₪${cite('הטבלה לדרגה ' + r.degree + '%', nc.work.tables[String(r.degree)])}</li>`
			+ `<li>המועדים: התאריך הקובע ${isoToHe(r.det)}, הקצבה מ-${isoToHe(r.clock.start)} (היום ה-${nc.clock.wait_days + 1}); התביעה ב-${isoToHe(r.claim)} משלמת לכל היותר מ-${isoToHe(r.clock.retroFrom)}; ההחלטה ב-${isoToHe(r.notice)}, ערר עד ${isoToHe(r.appealBy)}${cite(nc.clock.start_section, nc.law_url)}${cite(nc.clock.retro_section, nc.general_law_url)}${cite('ערעור', nc.appeal.url)}</li></ol>`,
		compare_table: amountsTable(reg) + workTable(reg),
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
	const pc = (id) => { const v = val(`#${P}-${id}`).trim().replace('%', ''); return v === '' ? '' : (/^\d+(\.\d+)?$/.test(v) ? Number(v) : NaN); };
	const list = radio('mm', 'total') === 'list';
	return {
		age: int('age'), sex: radio('sex', ''), status: radio('st', 'new'), homemaker: on('hm'), medMode: list ? 'list' : 'total',
		med: list ? '' : pc('med'), single: list ? '' : pc('single'), meds: list ? [0, 1, 2, 3, 4, 5].map((i) => pc(`m${i}`)) : [],
		degree: Number(radio('deg', '0')), spouse: radio('sp', 'none'), kids: Number(radio('kids', '0')), wage: m('wage'), other: m('other'),
		det: toIso(val(`#${P}-det`)), claim: toIso(val(`#${P}-claim`)), notice: toIso(val(`#${P}-notice`)), ruling: toIso(val(`#${P}-ruling`)), full6: on('f6'),
	};
}

const SC = { new: 'n', receiving: 'r' };
const PC = { none: 'n', dep: 'd', earns: 'e' };
const keyOf = (map, code, d) => Object.keys(map).find((k) => map[k] === code) || d;
const cell = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : String(v));
export function stateOf(i) {
	const list = i.medMode === 'list';
	return encodeState({
		a: i.age, x: i.sex, s: SC[i.status] || 'n', h: i.homemaker ? 1 : '', q: list ? 'l' : '', m: list ? '' : cell(i.med), g: list ? '' : cell(i.single),
		l: list ? (i.meds || []).map(cell).join('~') : '', d: cell(i.degree), p: PC[i.spouse] || 'n', k: i.kids || '', w: i.wage || '', o: i.other || '',
		t: i.det, c: i.claim, n: i.notice, r: i.ruling, f: i.full6 ? 1 : '',
	});
}
export const KEYS = ['a', 'x', 's', 'h', 'q', 'm', 'g', 'l', 'd', 'p', 'k', 'w', 'o', 't', 'c', 'n', 'r', 'f'];
export function inputOf(s) {
	if (!s.a || !s.s || s.d === undefined) { return null; }
	const list = s.q === 'l';
	return {
		age: Number(s.a), sex: s.x === 'f' || s.x === 'm' ? s.x : '', status: keyOf(SC, s.s, 'new'), homemaker: s.h === '1', medMode: list ? 'list' : 'total',
		med: !list && s.m ? Number(s.m) : '', single: !list && s.g ? Number(s.g) : '', meds: list && s.l ? s.l.split('~').map((v) => (v === '' ? '' : Number(v))) : [],
		degree: Number(s.d), spouse: keyOf(PC, s.p, 'none'), kids: s.k ? Number(s.k) : 0, wage: s.w ? Number(s.w) : '', other: s.o ? Number(s.o) : '',
		det: s.t || '', claim: s.c || '', notice: s.n || '', ruling: s.r || '', full6: s.f === '1',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const nc = reg.rights_nechut;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(nc.checked_on, nc.refresh_every_days) || (nc.next_update && today >= nc.next_update)) {
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
		const v = ((root.querySelector(`#${P}-age`) || {}).value || '').trim();
		const age = /^\d+$/.test(v) ? Number(v) : null;
		form.querySelectorAll('[data-if-62]').forEach((el) => { el.hidden = !(age !== null && age >= nc.age.women_from); });
		const mm = (root.querySelector(`input[name="${P}-mm"]:checked`) || {}).value || 'total';
		form.querySelectorAll('[data-if-mm]').forEach((el) => { el.hidden = el.getAttribute('data-if-mm') !== mm; });
		const hm = Boolean(root.querySelector(`input[name="${P}-hm"]:checked`));
		form.querySelectorAll('[data-if-hm]').forEach((el) => { el.hidden = el.getAttribute('data-if-hm') !== (hm ? '1' : '0'); });
	};
	const band = (r) => (!r.ok ? 'error' : !r.eligible ? 'no' : r.monthly === 0 ? 'stopped' : r.degree === 100 ? 'full' : 'partial');
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok && r.eligible ? ils(r.monthly, 0) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: band(r) }); }
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			const events = r.deadlines.filter((d) => d.ics);
			download('kitzbat-nechut.ics', 'text/calendar;charset=utf-8', ics((events.length ? events : r.deadlines).map((d) => ({ date: d.date, summary: `קצבת נכות: ${d.he}` })), new Date().toISOString()));
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
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(nc.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: band(r) });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, s); sync(); run(s); }
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
