/**
 * Rights wave 2B UI (21.10.2026): the child allowance and the savings plan (kitzbat-yeladim). Two pictures from the
 * Institute's own world: the family ledger (the children's file: a row per child, oldest first, with a ribbon on one shared
 * calendar from the first month of the allowance to the month of 18, the savings stripe under it, the withdrawal window to
 * 21 and the grant marks, and a "today" line through all the rows), and the step chart of the family's monthly total as the
 * children leave the count. The tables, the dates and the .ics say the same in text. The result-first card
 * ([justice_tool_lead]) carries the family's monthly total on the first screen, and the rehearse link hands the reader's
 * figures to the jus-tice.com simulation (sim-handoff.js, the wave-2A bar, HAD-585).
 */
import {
	compute, profile, familyTable, currentRow, amountAt, shiftMonth, ymHe, BENEFITS, MAX_KIDS, ORD_HE,
} from './yeladim-engine.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, num, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'kitzbat-yeladim';
const P = 'jt52';
const SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=family-law';

/** The example: three children, 11, 6 and 2 years old on the registry's check day (asOf empty = checked_on). */
export const EXAMPLE = {
	kids: [{ birth: '2015-01-22', sex: '', arrive: '' }, { birth: '2020-06-04', sex: '', arrive: '' }, { birth: '2024-03-10', sex: '', arrive: '' }],
	benefit: 'none', single: false, addSave: false, asOf: '',
};

const BEN_LABEL = { none: 'לא', hb: 'הבטחת הכנסה', mz: 'מזונות מהביטוח הלאומי', hh: 'אזרח ותיק או שאירים, עם השלמת הכנסה', old: 'אזרח ותיק או שאירים, בלי השלמה', nc: 'נכות כללית' };
const QUICK = [['one', 'ילד אחד בן שנה'], ['three', 'שלושה ילדים: 2, 6, 11'], ['five', 'חמישה ילדים'], ['support', 'ארבעה ילדים והבטחת הכנסה'], ['shift', 'הבכור בן 18 בחודש הבא']];
const MARK = { bad: '✕', warn: '!', info: 'i' };
const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const NUM_HE = ['', 'אחד', 'שני', 'שלושה', 'ארבעה', 'חמישה', 'שישה', 'שבעה', 'שמונה', 'תשעה', 'עשרה', 'אחד עשר', 'שנים עשר'];
const kidsWord = (n) => (n === 1 ? 'ילד אחד' : `${NUM_HE[n] || n} ילדים`);
const toKids = (n) => `ל${kidsWord(n)}`;
const mIdx = (key) => { const [y, m] = key.split('-').map(Number); return y * 12 + m - 1; };
const byBirth = (a, b) => (a.birth < b.birth ? -1 : a.birth > b.birth ? 1 : a.i - b.i);
const ord = (pos) => ORD_HE[pos - 1] || `${pos}`;

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
const showDate = (v) => (/^\d{4}-\d{2}-\d{2}$/.test(toIso(v)) ? isoToHe(toIso(v)) : String(v || ''));

/* ---------------- Pure renderers ---------------- */

function kidRow(k, i, count) {
	const sex = k.sex === 'b' || k.sex === 'g' ? k.sex : '';
	const opt = (v, label) => `<option value="${v}"${sex === v ? ' selected' : ''}>${esc(label)}</option>`;
	return `<li class="${P}-kid" data-kid="${i}"><div class="${P}-kid__head"><span class="${P}-kid__n">ילד ${i + 1}</span>${count > 1 ? `<button type="button" class="jtool-linkbtn" data-act="del-kid" data-del="${i}" aria-label="הסרת ילד ${i + 1}">הסרה</button>` : ''}</div>`
		+ `<div class="${P}-kid__row"><div class="jtool-field"><label class="jtool-label" for="${P}-k${i}">תאריך לידה</label><input id="${P}-k${i}" type="text" inputmode="decimal" autocomplete="off" value="${esc(showDate(k.birth))}" placeholder="לדוגמה: 10.3.2024" aria-describedby="${P}-k${i}-e"></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-s${i}">בן או בת</label><select id="${P}-s${i}">${opt('', 'לא חובה')}${opt('b', 'בן')}${opt('g', 'בת')}</select></div></div>`
		+ `<p class="jtool-error" id="${P}-k${i}-e" role="alert"></p>`
		+ `<details class="${P}-arr"${k.arrive ? ' open' : ''}><summary>אימוץ או עלייה: הגיע אחרי הלידה</summary><div class="jtool-field"><label class="jtool-label" for="${P}-a${i}">יום הקבלה למשפחה או הכניסה לארץ</label><input id="${P}-a${i}" type="text" inputmode="decimal" autocomplete="off" value="${esc(showDate(k.arrive))}" placeholder="לא חובה" aria-describedby="${P}-a${i}-e"></div><p class="jtool-error" id="${P}-a${i}-e" role="alert"></p></details></li>`;
}

export function renderForm(reg, input) {
	const yl = reg.rights_yeladim;
	const sv = yl.savings;
	const kids = Array.isArray(input.kids) && input.kids.length ? input.kids.slice(0, MAX_KIDS) : [{ birth: '', sex: '', arrive: '' }];
	const benefit = BENEFITS.includes(input.benefit) ? input.benefit : 'none';
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	return `<div class="${P}-quick" role="group" aria-label="משפחה לדוגמה בלחיצה אחת"><span class="${P}-quick__h">בלחיצה אחת:</span>${QUICK.map(([k, label]) => `<button type="button" class="${P}-qp" data-act="profile" data-profile="${k}">${esc(label)}</button>`).join('')}</div>`
		+ `<fieldset class="jtool-field"><legend>הילדים, כל ילד עם תאריך הלידה שלו</legend><ol class="${P}-kids">${kids.map((k, i) => kidRow(k, i, kids.length)).join('')}</ol>`
		+ `<div class="${P}-adds">${kids.length < MAX_KIDS ? `<button type="button" class="${P}-add" data-act="add-kid">+ ילד</button>` : ''}${kids.length < MAX_KIDS - 1 ? `<button type="button" class="${P}-add" data-act="add-twins">+ תאומים</button>` : ''}</div>`
		+ `<p class="jtool-error" id="${P}-kids-e" role="alert"></p><p class="jtool-hint">${esc(yl.allowance.order_he)}; ${esc(yl.allowance.start_he)} (${esc(yl.allowance.start_section)}). בן או בת: רק למועד מענק בר או בת המצווה בחיסכון.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מישהו מההורים מקבל אחת מהקצבאות האלה?</legend><div class="jtool-chips">${BENEFITS.map((k) => chip('ben', k, BEN_LABEL[k], benefit === k)).join('')}</div>`
		+ `<p class="jtool-hint">${esc(yl.supplement.he)} (${esc(yl.supplement.section)}). ${esc(yl.study.who_he)}.</p><p class="jtool-error" id="${P}-benefit-e" role="alert"></p></fieldset>`
		+ `<div class="jtool-chips">${chip('single', '1', 'הורה עצמאי (משפחה חד-הורית)', input.single === true, 'checkbox')}${chip('add', '1', `ההורים מוסיפים ${sv.parent_add} ₪ לחיסכון של כל ילד`, input.addSave === true, 'checkbox')}</div>`
		+ `<p class="jtool-hint">${esc(sv.add_he)}.</p>`;
}

function changeWhy(r, p) {
	if (p.first) { return 'היום'; }
	const kidOf = (i) => r.kids.find((k) => k.i === i);
	const left = p.left.map((i) => `לילד ${i + 1} מלאו 18 (${isoToHe(kidOf(i).at18)})`);
	const joined = p.joined.map((i) => `ילד ${i + 1} נכנס למניין`);
	return left.concat(joined).join('; ') + (p.left.length && p.n ? '; האחרים עולים מקום' : '');
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const yl = reg.rights_yeladim;
	const al = yl.allowance;
	const sv = yl.savings;
	const out = [];
	if (!r.n) {
		const next = r.periods.find((p) => p.n);
		out.push(next ? `הקצבה תתחיל ב-${isoToHe(`${next.from}-01`)}: ${nis(next.total)} בחודש ${toKids(next.n)}, ועוד ${nis(next.savings)} לחיסכון.` : `אין החודש ילד מתחת לגיל ${al.end_age} במניין, ולכן אין קצבת ילדים.`);
		return out.join(' ');
	}
	const parts = r.now.list.map((x) => x.amount + x.supp).join(' + ');
	out.push(`קצבת ילדים של ${nis(r.monthly)} בחודש ${toKids(r.n)}${r.n > 1 ? ` (${parts})` : ''}, ב-${al.pay_day} בכל חודש${r.now.supplement ? `, כולל תוספת של ${nis(r.now.supplement)}` : ''}.`);
	out.push(`הביטוח הלאומי מפקיד עוד ${nis(r.now.savings)} בחודש לחיסכון של ${r.n === 1 ? 'הילד' : 'הילדים'} (${sv.monthly} ₪ לכל ילד)${r.addSave ? `, וההורים מוסיפים מהקצבה עוד ${nis(r.now.parentAdd)}` : ''}.`);
	out.push(`ב-12 החודשים הקרובים ${nis(r.next12)}.`);
	const next = r.periods.length > 1 ? r.periods[1] : null;
	if (next) { out.push(`ב-${isoToHe(`${next.from}-01`)} הקצבה ${next.total < r.monthly ? 'יורדת' : 'עולה'} ל-${nis(next.total)}: ${changeWhy(r, next)}.`); }
	return out.join(' ');
}

/** The family ledger: a row per child on one calendar, the allowance ribbon, the savings stripe, the grants, today. */
function ledger(reg, r) {
	const yl = reg.rights_yeladim;
	const sv = yl.savings;
	const kids = r.kids.slice().sort(byBirth);
	if (!kids.length) { return ''; }
	const t0 = Math.min(...kids.map((k) => mIdx(k.birth.slice(0, 7))));
	const t1 = Math.max(...kids.map((k) => mIdx(k.at21.slice(0, 7)))) + 1;
	const span = Math.max(1, t1 - t0);
	const at = (key) => Math.max(0, Math.min(100, ((mIdx(key) - t0) / span) * 100));
	const box = (from, to) => `inset-inline-start:${at(from).toFixed(2)}%;width:${Math.max(0.6, at(shiftMonth(to, 1)) - at(from)).toFixed(2)}%`;
	const now = at(r.M0);
	const rows = kids.map((k) => {
		const saveFrom = k.start > sv.deposits_from ? k.start : sv.deposits_from;
		const marks = k.grants.map((g) => `<b class="${P}-mk${g.cond ? ` ${P}-mk--cond` : ''}" style="inset-inline-start:${at(g.date.slice(0, 7)).toFixed(2)}%"></b>`).join('');
		const amt = k.status === 'active' ? `${ilsn(k.amountNow + k.suppNow)}<small>${esc(ord(k.posNow))} במניין</small>` : k.status === 'ended' ? '<small>מעל 18</small>' : `<small>מ-${esc(isoToHe(`${k.start}-01`))}</small>`;
		return `<li class="${P}-row ${P}-row--${k.status}"><span class="${P}-row__who"><strong>ילד ${k.i + 1}</strong><small><bdi>${esc(isoToHe(k.birth))}</bdi>${k.age !== null ? ` · גיל ${k.age}` : ' · צפוי'}</small></span>`
			+ `<span class="${P}-row__track" aria-hidden="true"><i class="${P}-band ${P}-band--paid" style="${box(k.start, k.end)}"></i>`
			+ (saveFrom <= k.end ? `<i class="${P}-band ${P}-band--save" style="${box(saveFrom, k.end)}"></i>` : '')
			+ `<i class="${P}-band ${P}-band--free" style="${box(shiftMonth(k.end, 1), k.at21.slice(0, 7))}"></i>${marks}<i class="${P}-now" style="inset-inline-start:${now.toFixed(2)}%"></i></span>`
			+ `<span class="${P}-row__amt">${amt}</span></li>`;
	}).join('');
	const y0 = Math.floor(t0 / 12);
	const y1 = Math.floor((t1 - 1) / 12);
	const step = y1 - y0 > 24 ? 10 : 5;
	let ticks = '';
	for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) { ticks += `<span style="inset-inline-start:${at(`${y}-01`).toFixed(2)}%">${y}</span>`; }
	const label = `תיק הילדים: ${kids.map((k) => `ילד ${k.i + 1}, קצבה ${ymHe(k.start)} עד ${ymHe(k.end)}`).join('; ')}`;
	return `<figure class="${P}-led" aria-label="${esc(label)}"><figcaption class="${P}-led__h">תיק הילדים: מתי הקצבה וההפקדות לחיסכון של כל ילד, מהחודש הראשון ועד גיל 21</figcaption><ol class="${P}-led__rows">${rows}</ol>`
		+ `<div class="${P}-axis" aria-hidden="true"><span class="${P}-axis__pad"></span><span class="${P}-axis__track">${ticks}</span><span class="${P}-axis__pad2"></span></div>`
		+ `<p class="${P}-led__legend"><span><i class="${P}-k ${P}-k--paid"></i>קצבת ילדים</span><span><i class="${P}-k ${P}-k--save"></i>הפקדה לחיסכון</span><span><i class="${P}-k ${P}-k--free"></i>מ-18 עד 21: משיכה באישור הורה</span><span><i class="${P}-k ${P}-k--mk"></i>מענק לחיסכון</span><span><i class="${P}-k ${P}-k--now"></i>היום</span></p></figure>`;
}

/** The step chart: the family's monthly total (allowance and supplement) from this month until the youngest turns 18. */
function stepChart(reg, r) {
	const ps = r.periods;
	if (!ps.length) { return ''; }
	const w = 360;
	const h = 156;
	const pad = 8;
	const top = 20;
	const bottom = 22;
	const months = ps.reduce((a, p) => a + p.months, 0);
	const yMax = Math.max(1, ...ps.map((p) => p.total)) * 1.18;
	const xv = (m) => w - pad - (m / months) * (w - 2 * pad);
	const y = (v) => top + (1 - v / yMax) * (h - top - bottom);
	const f = (v) => v.toFixed(1);
	let out = '';
	let acc = 0;
	ps.forEach((p, idx) => {
		const x0 = xv(acc + p.months);
		const x1 = xv(acc);
		out += `<rect class="${P}-st__bar${idx === 0 ? ` ${P}-st__bar--now` : ''}" x="${f(x0)}" y="${f(y(p.total))}" width="${f(Math.max(1, x1 - x0 - 1))}" height="${f(y(0) - y(p.total))}"></rect>`;
		if (x1 - x0 > 34 && p.total > 0) { out += `<text class="${P}-st__v" x="${f((x0 + x1) / 2)}" y="${f(y(p.total) - 5)}" text-anchor="middle">${money(p.total, 0)}</text>`; }
		acc += p.months;
	});
	const first = mIdx(ps[0].from);
	const last = first + months;
	const y0 = Math.floor(first / 12) + 1;
	const y1 = Math.floor(last / 12);
	const stepY = y1 - y0 > 12 ? 4 : y1 - y0 > 6 ? 2 : 1;
	let ticks = '';
	for (let yr = y0; yr <= y1; yr += stepY) {
		const xx = xv(yr * 12 - first);
		ticks += `<line class="${P}-st__tick" x1="${f(xx)}" x2="${f(xx)}" y1="${f(y(0))}" y2="${f(y(0) + 4)}"></line><text class="${P}-st__t" x="${f(xx)}" y="${h - 6}" text-anchor="middle">${yr}</text>`;
	}
	const label = `הקצבה לחודש מ-${ymHe(ps[0].from)}: ${ps.map((p) => `${money(p.total, 0)} ₪ עד ${ymHe(p.to)}`).join(', ')}`;
	return `<figure class="${P}-st"><figcaption class="${P}-st__h">כמה נכנס כל חודש, עד שהצעיר במשפחה בן 18 (בסכומי ${esc(reg.rights_yeladim.from.slice(0, 4))})</figcaption><svg class="${P}-st__svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><line class="${P}-st__base" x1="${pad}" x2="${w - pad}" y1="${f(y(0))}" y2="${f(y(0))}"></line>${out}${ticks}</svg></figure>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const state = r.n ? `<p class="jtool-state jtool-state--ok">✓ ${esc(kidsWord(r.n))} במניין, נכון ל-${esc(ymHe(r.M0))}</p>`
		: r.periods.length ? '<p class="jtool-state jtool-state--info">i הקצבה עוד לא התחילה</p>' : '<p class="jtool-state jtool-state--danger">✕ אין ילד מתחת לגיל 18 במניין</p>';
	const nextChange = r.periods.length > 1 ? r.periods[1] : null;
	let out = `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}קצבת ילדים לחודש${r.now.supplement ? ', עם התוספת' : ''}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.monthly, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>בחודש לחיסכון</dt><dd>${ils(r.now.savings + r.now.parentAdd, 0)}</dd></div>`
		+ `<div><dt>ב-12 החודשים הקרובים</dt><dd>${ils(r.next12, 0)}</dd></div>`
		+ `<div><dt>עד שהצעיר בן 18</dt><dd>${ils(r.remaining, 0)}</dd></div>`
		+ `<div><dt>השינוי הבא בקצבה</dt><dd>${nextChange ? `<bdi>${esc(isoToHe(`${nextChange.from}-01`))}</bdi>` : '—'}</dd></div></dl></div>`;
	out += ledger(reg, r) + stepChart(reg, r);
	const flags = r.flags.filter((x) => x.level !== 'info');
	if (flags.length) { out += `<ul class="jtool-flags">${flags.map((x) => `<li><strong aria-hidden="true">${MARK[x.level]}</strong> ${esc(x.he)}</li>`).join('')}</ul>`; }
	return out;
}

/** The reason to rehearse, tied to the result. */
export function rehearseReason(reg, r) {
	const pay = reg.rights_yeladim.payee;
	return r.single
		? `הורה עצמאי: הקצבה (${r.n ? nis(r.monthly) : 'לפי מספר הילדים'}) ומענק הלימודים משולמים להורה שהילדים אצלו; ${pay.agree_he}. כדאי להגיע לשיחה עם ההורה השני מוכנים.`
		: `אם ההורים נפרדים: הקצבה${r.n ? ` (${nis(r.monthly)} בחודש)` : ''} נשארת אצל האם גם במשמורת משותפת, אלא אם מסכימים אחרת או שנקבע בפסק דין; והקופה והמסלול של החיסכון${r.n ? ` (${nis(r.now.savings)} בחודש)` : ''} הם החלטה משותפת. כדאי לתרגל את השיחה לפני הגישור.`;
}

/** What to do now: 2-4 concrete steps, each a link, and the rehearsal with its reason. */
export function nextSteps(reg, r) {
	const yl = reg.rights_yeladim;
	const c = yl.claim;
	const sv = yl.savings;
	const sg = yl.study;
	const out = [];
	const fresh = r.kids.some((k) => k.status === 'expected' || k.status === 'waiting' || (k.age === 0));
	out.push(fresh
		? { he: `${c.auto_he}. ${c.claim_he}; ${c.deadline_he}`, label: 'איך מקבלים את הקצבה', url: c.url }
		: { he: `לוודא שהקצבה משולמת בעד כל ילד ובסכום הנכון (${nis(r.monthly)} בחודש). ${c.claim_he}; ${c.deadline_he}`, label: 'הגשת תביעה לקצבת ילדים', url: c.url });
	out.push({ he: `${sv.default_he}. ${sv.add_he}`, label: 'המידע האישי על החיסכון של כל ילד', url: sv.personal_url });
	if (r.study.on || r.suppOn) {
		out.push(r.study.on
			? { he: `מענק לימודים: ${sg.auto_he}. ${sg.claim_he}`, label: 'הגשת תביעה למענק לימודים', url: sg.claim_url }
			: { he: `${yl.supplement.he}`, label: 'סכום קצבת הילדים והתוספת', url: yl.supplement.url });
	}
	out.push(r.single
		? { he: 'מזונות הילדים שההורה השני משלם הם בנפרד מקצבת הילדים, ונקבעים לפי ההלכה החדשה', label: 'מחשבון מזונות ילדים', path: '/child-support/' }
		: { he: 'בעד הילדים מגיעות גם נקודות זיכוי במס הכנסה, שמקטינות את המס בתלוש', label: 'נקודות זיכוי בעד ילדים', path: '/nekudot-zikui/' });
	return out;
}
export function checklistText(reg, r) {
	return nextSteps(reg, r).map((x, i) => `${i + 1}. ${x.he} (${x.label})`).concat([`${nextSteps(reg, r).length + 1}. ${rehearseReason(reg, r)}`]).join('\n');
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const yl = reg.rights_yeladim;
	const al = yl.allowance;
	const sv = yl.savings;
	const sp = yl.supplement;
	const sg = yl.study;
	const btl = reg.rights_btl;
	const row = currentRow(reg);
	let out = '';
	// 1. This month, child by child.
	const rows = [];
	r.now.list.forEach((x) => {
		const k = r.kids.find((y) => y.i === x.i);
		rows.push([`ילד ${x.i + 1} (נולד <bdi>${esc(isoToHe(k.birth))}</bdi>): ה${esc(ord(x.pos))} במניין`, ilsn(x.amount), `${x.pos >= al.high_from && x.pos <= al.high_to ? 'השני עד הרביעי' : 'הראשון, והחמישי ואילך'}: סכום בסיסי 2${cite(al.section, yl.law_url)}${cite(al.def_section, yl.law_general_url)}`]);
		if (x.supp) { rows.push([`תוספת לילד ה${esc(ord(x.pos))}`, ilsn(x.supp), `<bdi>${sp.pct_of_income_support}% × ${money(btl.basic_amount.b2_income_support, 0)}</bdi>, לפי הקצבה של ההורה${cite(sp.section, yl.law_url)}${cite('התוספת', sp.url)}`]); }
	});
	if (r.n) {
		out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-calc-h">כמה, על מה, ולפי איזה סעיף</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-calc-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ rows.map(([a, b, c]) => `<tr><td data-th="מה">${a}</td><td data-th="סכום">${b}</td><td data-th="הכלל">${c}</td></tr>`).join('')
			+ `<tr class="jtool-table__total"><td data-th="מה">קצבת ילדים, ${esc(ymHe(r.M0))}</td><td data-th="סכום">${ilsn(r.monthly)}</td><td data-th="הכלל">ב-${al.pay_day} לחודש${cite('מועד התשלום', al.pay_url)}</td></tr>`
			+ (r.addSave ? `<tr><td data-th="מה">ההורים מוסיפים לחיסכון: <bdi>${sv.parent_add} × ${r.n}</bdi></td><td data-th="סכום">−${ilsn(r.now.parentAdd)}</td><td data-th="הכלל">יורד מהקצבה${cite(sv.add_section, yl.law_url)}${cite('הכפלת החיסכון', sv.double_url)}</td></tr><tr><td data-th="מה">נכנס לחשבון הבנק</td><td data-th="סכום">${ilsn(r.toBank)}</td><td data-th="הכלל">הקצבה פחות התוספת לחיסכון</td></tr>` : '')
			+ `<tr><td data-th="מה">הפקדת הביטוח הלאומי לחיסכון: <bdi>${sv.monthly} × ${r.n}</bdi></td><td data-th="סכום">${ilsn(r.now.savings)}</td><td data-th="הכלל">מעבר לקצבה, בחיסכון על שם כל ילד${cite(sv.base_section, yl.law_url)}${cite('סכום החיסכון', sv.url)}</td></tr>`
			+ `</tbody><caption>${esc(al.pay_he)}. ${esc(al.tax_he)} (${esc(al.tax_section)}). ${esc(al.debt_he)}. הסכומים מ-${esc(isoToHe(yl.from))}.</caption></table></div></div>`;
	}
	// 2. The gates.
	const icon = { ok: '✓', no: '✕', check: '!' };
	out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-gate-h">התנאים, אחד אחד</h3></div><ul class="${P}-gate">`
		+ r.gates.map((g) => `<li class="${P}-gate__i ${P}-gate__i--${g.state}"><strong aria-hidden="true">${icon[g.state]}</strong> ${esc(g.he)}${cite(g.section, g.url)}</li>`).join('')
		+ `</ul></div>`;
	// 3. The timeline in text (the step chart).
	if (r.periods.length) {
		out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-tl-h">הקצבה לאורך השנים, עד שהצעיר בן 18</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-tl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מ</th><th scope="col">עד</th><th scope="col">חודשים</th><th scope="col">במניין</th><th scope="col">לחודש</th><th scope="col">מה משתנה</th></tr></thead><tbody>`
			+ r.periods.map((p) => `<tr${p.first ? ` class="${P}-you"` : ''}><td data-th="מ">${esc(ymHe(p.from))}</td><td data-th="עד">${esc(ymHe(p.to))}</td><td data-th="חודשים">${num(p.months, 0)}</td><td data-th="במניין">${num(p.n, 0)}</td><td data-th="לחודש">${ilsn(p.total)}</td><td data-th="מה משתנה">${esc(changeWhy(r, p))}</td></tr>`).join('')
			+ `<tr class="jtool-table__total"><td data-th="מ" colspan="4">סך הכול עד ${esc(ymHe(r.lastEnd))}</td><td data-th="לחודש">${ilsn(r.remaining)}</td><td data-th="מה משתנה">ועוד ${esc(nis(r.remainingSave))} הפקדות לחיסכון</td></tr>`
			+ `</tbody><caption>${esc(al.count_he)}. ${esc(al.end_he)}${cite(al.start_section, yl.law_url)}. בסכומי ${esc(yl.from.slice(0, 4))}; ${esc(al.update_he)}.</caption></table></div></div>`;
	}
	// 4. The savings, child by child: deposits only.
	const sk = r.kids.slice().sort((a, b) => (a.birth < b.birth ? -1 : a.birth > b.birth ? 1 : a.i - b.i));
	out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-sv-h">החיסכון לכל ילד: מה עוד יופקד</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-sv-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">ילד</th><th scope="col">הפקדות מהחודש עד גיל 18</th><th scope="col">מענקים</th><th scope="col">עד גיל 18</th><th scope="col">חודשים שכבר הופקדו</th></tr></thead><tbody>`
		+ sk.map((k) => {
			const dep = `<bdi>${k.monthsAhead} × ${sv.monthly}${r.addSave ? ' × 2' : ''}</bdi> = ${ilsn(k.depositsAhead + k.parentAhead)}`;
			const grants = k.grants.length ? k.grants.map((g) => `${esc(g.he)}: ${ilsn(g.amount)} (<bdi>${esc(isoToHe(g.date))}</bdi>)`).join('<br>') : 'אין עוד מענקים';
			return `<tr><td data-th="ילד">ילד ${k.i + 1}, <bdi>${esc(isoToHe(k.birth))}</bdi></td><td data-th="הפקדות מהחודש עד גיל 18">${k.monthsAhead ? dep : 'אין'}</td><td data-th="מענקים">${grants}</td><td data-th="עד גיל 18">${ilsn(k.toEighteen)}</td><td data-th="חודשים שכבר הופקדו">${num(k.monthsPast, 0)}</td></tr>`;
		}).join('')
		+ `</tbody><caption>${esc(sv.return_he)}. ${esc(sv.report_he)}, ושם רואים גם את ההפקדות שכבר נעשו (בסכומים של השנים ההן). ${esc(sv.withdraw_he)}${cite(sv.withdraw_section, yl.law_url)}${cite('משיכת החיסכון', sv.withdraw_url)}</caption></table></div></div>`;
	// 5. The supplement and the study grant.
	const inRange = r.study.kids.length;
	const studyRows = [
		[`שנת הלימודים ${esc(sg.school_year_he)}`, `ילדים שנולדו <bdi>${esc(isoToHe(sg.born_from))}</bdi> עד <bdi>${esc(isoToHe(sg.born_to))}</bdi>`, ilsn(sg.amount), `<bdi>${esc(isoToHe(sg.pay_date))}</bdi>${r.study.past ? ' (שולם)' : ''}`],
		[`שנת הלימודים ${esc(sg.prev.school_year_he)}`, `ילדים שנולדו <bdi>${esc(isoToHe(sg.prev.born_from))}</bdi> עד <bdi>${esc(isoToHe(sg.prev.born_to))}</bdi>`, ilsn(sg.prev.amount), esc(sg.prev.paid_he)],
	];
	out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-sg-h">מענק לימודים ותוספת לקצבה</h3></div>`
		+ `<p class="${P}-note">${r.study.on ? `במשפחה הזאת: ${inRange ? `${inRange} ${inRange === 1 ? 'ילד' : 'ילדים'} בטווח התאריכים, <bdi>${inRange} × ${money(sg.amount, 0)} = ${money(r.study.total, 0)}</bdi> ₪` : 'אין ילד בטווח התאריכים של השנה'} (${esc(r.study.via === 'single' ? 'הורה עצמאי' : `${r.study.nJA} ילדים וקצבה מהרשימה`)}).` : `במשפחה הזאת אין זכאות למענק לפי מה שהוזן. ${esc(sg.who_he)}.`} ${r.suppOn ? `התוספת לקצבה: ${r.now.supplement ? `${nis(r.now.supplement)} בחודש` : 'אין, כי צריך 3 ילדים לפחות במניין'}.` : ''}${cite(sg.amount_section, yl.law_url)}${cite('מענק לימודים', sg.url)}</p>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-sg-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">שנה</th><th scope="col">לאילו ילדים</th><th scope="col">לכל ילד</th><th scope="col">תשלום</th></tr></thead><tbody>`
		+ studyRows.map(([a, b, c, d]) => `<tr><td data-th="שנה">${a}</td><td data-th="לאילו ילדים">${b}</td><td data-th="לכל ילד">${c}</td><td data-th="תשלום">${d}</td></tr>`).join('')
		+ `</tbody><caption>${esc(sg.auto_he)}. ${esc(sg.late_he)}. ${esc(sg.next_he)}.</caption></table></div></div>`;
	// 6. What changed and when.
	const hist = [Object.assign({ cur: true }, row)].concat(yl.history.rows);
	const fam = (rw) => r.now.list.reduce((a, x) => a + amountAt(yl, rw, x.pos), 0);
	out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-hist-h">מה השתנה ומתי</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-hist-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מ-</th><th scope="col">הראשון, החמישי ואילך</th><th scope="col">השני עד הרביעי</th>${r.n ? '<th scope="col">אותם ילדים, בלי התוספת</th>' : ''}<th scope="col">מקור</th></tr></thead><tbody>`
		+ hist.map((h) => `<tr${h.cur ? ` class="${P}-you"` : ''}><td data-th="מ-"><bdi>${esc(isoToHe(h.from))}</bdi></td><td data-th="הראשון, החמישי ואילך">${ilsn(h.first_fifth)}</td><td data-th="השני עד הרביעי">${ilsn(h.second_to_fourth)}</td>${r.n ? `<td data-th="אותם ילדים, בלי התוספת">${ilsn(fam(h))}</td>` : ''}<td data-th="מקור">${cite('הסכום הבסיסי', yl.history.url)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(al.update_he)}${cite(al.update_section, yl.law_general_url)}. ${r.n ? `לאותם ילדים: ${esc(nis(r.compare.prev))} ב-${esc(r.compare.prevFrom.slice(0, 4))}, ${esc(nis(r.compare.cur))} ב-${esc(yl.from.slice(0, 4))}. ` : ''}מענק הלימודים: ${esc(money(sg.prev.amount, 0))} ₪ ב-${esc(sg.prev.school_year_he)}, ${esc(money(sg.amount, 0))} ₪ ב-${esc(sg.school_year_he)}. ${esc(sv.freeze_he)}.</caption></table></div></div>`;
	// 7. The dates.
	out += `<div class="jtool-tablewrap ${P}-p-tight"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ (r.deadlines.length ? r.deadlines.map((x) => `<tr><td data-th="תאריך"><bdi>${esc(isoToHe(x.date))}</bdi></td><td data-th="מה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section, x.url)}</td></tr>`).join('') : '<tr><td data-th="תאריך">—</td><td data-th="מה">אין מועדים קדימה</td><td data-th="מקור">—</td></tr>')
		+ `</tbody><caption>${esc(al.pay_he)}. ליומן נכנסים רק המועדים שהחוק או הביטוח הלאומי קובעים; מענק בר או בת מצווה בלי בן או בת נשאר בטבלה, כי הגיל שונה.</caption></table></div></div>`;
	// 8. What to do now.
	out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-next-h">מה עושים עכשיו</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button><button class="jtool-btn" type="button" data-act="print">הדפסה</button></div></div>`
		+ `<ol class="${P}-list">${nextSteps(reg, r).map((x) => `<li>${esc(x.he)}. ${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.label)}</a>` : `<a href="${esc(x.path)}">${esc(x.label)}</a>`}</li>`).join('')}`
		+ `<li>${esc(rehearseReason(reg, r))} <a href="${esc(SIM)}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את השיחה בסימולציה</a></li></ol></div>`;
	const info = r.flags.filter((x) => x.level === 'info');
	if (info.length) { out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-info-h">עוד במשפחה הזאת</h3></div><ul class="${P}-info">${info.map((x) => `<li>${esc(x.he)}</li>`).join('')}</ul></div>`; }
	return out;
}

/** Page section: the family's total by the number of children, with and without the supplement, and the savings. */
export function amountsTable(reg) {
	const yl = reg.rights_yeladim;
	const t = familyTable(reg, 6);
	const rows = t.map((x) => `<tr><td data-th="ילדים במניין">${num(x.n, 0)}</td><td data-th="הילד הזה מוסיף">${ilsn(x.add)}</td><td data-th="קצבה לחודש">${ilsn(x.total)}</td><td data-th="עם התוספת">${x.withSupp !== x.total ? ilsn(x.withSupp) : '—'}</td><td data-th="לחיסכון, לחודש">${ilsn(x.savings)}</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`קצבת ילדים לחודש מ-${isoToHe(yl.from)}, לפי מספר הילדים במניין: הראשון והחמישי ואילך ${money(currentRow(reg).first_fifth, 0)} ₪, השני עד הרביעי ${money(currentRow(reg).second_to_fourth, 0)} ₪ (${yl.allowance.section}); התוספת ${money(yl.supplement.amount, 0)} ₪ לילד השלישי והרביעי למקבלי הבטחת הכנסה, מזונות או השלמת הכנסה (${yl.supplement.section}); ועוד ${money(yl.savings.monthly, 0)} ₪ לכל ילד לחיסכון`)}${cite('סכום הקצבה', yl.pages.rates)}</caption><thead><tr><th scope="col">ילדים במניין</th><th scope="col">הילד הזה מוסיף</th><th scope="col">קצבה לחודש</th><th scope="col">עם התוספת</th><th scope="col">לחיסכון, לחודש</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the savings plan's grants by birth year, and the deposits of a child born this year. */
export function savingsTable(reg) {
	const yl = reg.rights_yeladim;
	const sv = yl.savings;
	const full = 12 * yl.allowance.end_age + 1;
	const rows = [
		['נולד עד 31.12.2016', '—', '—', ilsn(sv.grant_18), ilsn(sv.grant_21)],
		['נולד מ-1.1.2017', ilsn(sv.grant_3), `${ilsn(sv.grant_mitzvah)} (גיל ${sv.mitzvah_girl} לבת, ${sv.mitzvah_boy} לבן)`, '—', ilsn(sv.grant_21)],
	].map(([a, b, c, d, e]) => `<tr><td data-th="הילד">${a}</td><td data-th="גיל ${sv.grant_3_age}">${b}</td><td data-th="בר או בת מצווה">${c}</td><td data-th="גיל 18">${d}</td><td data-th="גיל 21, אם לא נמשך">${e}</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`מענקים לחיסכון לכל ילד מ-${isoToHe(sv.from)} (${sv.grants_section}, ${sv.withdraw_section}). ילד שנולד עד ה-15 בחודש וכל החודשים בארץ: ${full} הפקדות של ${sv.monthly} ₪ = ${money(full * sv.monthly, 0)} ₪ עד גיל 18, וכפול עם תוספת ההורים; בלי תשואה, שתלויה בקופה ובמסלול`)}${cite('סכום החיסכון', sv.url)}</caption><thead><tr><th scope="col">הילד</th><th scope="col">גיל ${sv.grant_3_age}</th><th scope="col">בר או בת מצווה</th><th scope="col">גיל 18</th><th scope="col">גיל 21, אם לא נמשך</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** The children's ages, oldest first, in words ("בגיל 2", "בגילים 11, 6 ו-2"); a child not yet born is left out. */
function agesHe(r) {
	const ages = r.kids.slice().sort(byBirth).filter((k) => k.age !== null).map((k) => k.age);
	if (!ages.length) { return ''; }
	const word = (a, and) => (a === 0 ? `${and ? 'ו' : ''}מתחת לשנה` : `${and ? 'ו-' : ''}${a}`);
	if (ages.length === 1) { return `בגיל ${word(ages[0], false)}`; }
	return `בגילים ${ages.slice(0, -1).map((a) => word(a, false)).join(', ')} ${word(ages[ages.length - 1], true)}`;
}
function familyHe(r) {
	const ages = agesHe(r);
	return `${kidsWord(r.kids.length)}${ages ? ` ${ages}` : ''}${r.single ? ', הורה עצמאי' : ''}${r.benefit !== 'none' ? `, קצבת ההורה: ${BEN_LABEL[r.benefit]}` : ''}`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): the family's monthly allowance of the example (or of
 * the reader's own children once they change anything), the savings beside it, the next change, and a jump to the form.
 * Same markup on the server and in the browser, so the card never shifts the layout when the script takes over. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הנתונים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">קצבת ילדים</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const al = reg.rights_yeladim.allowance;
	const label = `${opts.example ? 'דוגמה מחושבת' : 'החישוב שלכם'}: קצבת ילדים לחודש`;
	if (!r.n) {
		const start = r.periods.find((p) => p.n);
		if (!start) {
			return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">אין קצבה</strong></p><p class="jtool-lead__line">${esc(`${familyHe(r)}: אין ילד מתחת לגיל ${al.end_age} במניין, ולכן אין קצבת ילדים.`)}</p>${go}`;
		}
		return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${ils(start.total, 0)}</strong><span class="jtool-lead__unit">לחודש מ-<bdi>${esc(isoToHe(`${start.from}-01`))}</bdi></span></p>`
			+ `<p class="jtool-lead__line">${esc(`${familyHe(r)}. הקצבה עוד לא התחילה; ממנה והלאה גם ${nis(start.savings)} בחודש לחיסכון.`)}</p>${go}`;
	}
	const next = r.periods.length > 1 ? r.periods[1] : null;
	const line = `${familyHe(r)}. ב-12 החודשים הקרובים ${nis(r.next12)}${next ? `; מ-${isoToHe(`${next.from}-01`)} הקצבה ${next.total < r.monthly ? 'יורדת' : 'עולה'} ל-${nis(next.total)}` : ''}.`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${ils(r.monthly, 0)}</strong><span class="jtool-lead__unit">לחודש · ועוד ${ils(r.now.savings, 0)} לחיסכון</span></p>`
		+ `<p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

/** The scenario for the simulation: the family's figures and choices only, never a name, an ID or a birth date. */
export function scenarioText(reg, r) {
	if (!r.ok) { return ''; }
	const yl = reg.rights_yeladim;
	const next = r.periods.length > 1 ? r.periods[1] : null;
	let res;
	if (r.n) {
		res = `לפי החישוב לפי חוק הביטוח הלאומי: קצבת ילדים של ${nis(r.monthly)} בחודש${r.now.supplement ? ` (כולל תוספת של ${nis(r.now.supplement)})` : ''}, ועוד ${nis(r.now.savings)} בחודש שהביטוח הלאומי מפקיד לחיסכון של ${r.n === 1 ? 'הילד' : 'הילדים'}${r.addSave ? `; ההורים מוסיפים מהקצבה ${nis(r.now.parentAdd)} בחודש` : ''}. ב-12 החודשים הקרובים ${nis(r.next12)}${next ? `; מ-${isoToHe(`${next.from}-01`)} הקצבה ${next.total < r.monthly ? 'יורדת' : 'עולה'} ל-${nis(next.total)} בחודש` : ''}.`;
	} else {
		const start = r.periods.find((p) => p.n);
		res = start ? `לפי החישוב הקצבה תתחיל ב-${isoToHe(`${start.from}-01`)}: ${nis(start.total)} בחודש.` : `לפי החישוב אין ילד מתחת לגיל ${yl.allowance.end_age} במניין, ולכן אין קצבת ילדים.`;
	}
	const study = r.study.on && r.study.total ? ` מענק הלימודים: ${nis(r.study.total)}.` : '';
	const ask = 'אני רוצה להתכונן לשיחה עם ההורה השני על הפרידה, או לגישור: מי מקבל את הקצבה, מי מנהל את החיסכון של כל ילד, באיזו קופה ובאיזה מסלול, ומה כותבים על זה בהסכם.';
	return `קצבת ילדים וחיסכון לכל ילד. משפחה עם ${familyHe(r)}. ${res}${study} ${ask}`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const yl = reg.rights_yeladim;
	const al = yl.allowance;
	const sv = yl.savings;
	const row = currentRow(reg);
	const ks = r.kids.slice().sort(byBirth);
	const young = ks[ks.length - 1];
	const old = ks[0];
	const ps = r.periods;
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
		method: `<ol><li>המניין: רק ילדים שעוד לא מלאו להם ${al.end_age} ונמצאים בישראל, מהגדול לצעיר; ב-${ymHe(r.M0)} שלושה ילדים${cite(al.child_section, yl.law_url)}</li>`
			+ `<li>הסכום לפי המקום במניין: הראשון ${money(row.first_fifth, 0)} ₪, השני והשלישי ${money(row.second_to_fourth, 0)} ₪, כלומר <bdi>${r.now.list.map((x) => money(x.amount, 0)).join(' + ')} = ${money(r.monthly, 0)}</bdi> ₪ בחודש, ב-${al.pay_day} לחודש${cite(al.section, yl.law_url)}${cite(al.def_section, yl.law_general_url)}${cite('סכום הקצבה', yl.pages.rates)}</li>`
			+ `<li>תחילה וסוף: ילד ${old.i + 1} נולד ב-${isoToHe(old.birth)}, אחרי ה-${al.start_cutoff_day} בחודש, ולכן הקצבה מ-${ymHe(old.start)}; היא משולמת עד סוף החודש שבו מלאו לו ${al.end_age}, ${isoToHe(old.endDay)}${cite(al.start_section, yl.law_url)}</li>`
			+ `<li>השנים הבאות: <bdi>${ps.map((p) => `${money(p.total, 0)} × ${p.months}`).join(' + ')} = ${money(r.remaining, 0)}</bdi> ₪ עד ${ymHe(r.lastEnd)}; כשהבכור יוצא מהמניין, השני הופך לראשון ומקבל ${money(row.first_fifth, 0)} ₪${cite(al.section, yl.law_url)}</li>`
			+ `<li>החיסכון: <bdi>${sv.monthly} × ${r.n} = ${money(r.now.savings, 0)}</bdi> ₪ בחודש מעבר לקצבה; לילד ${young.i + 1}, <bdi>${young.monthsAhead} × ${sv.monthly} = ${money(young.depositsAhead, 0)}</bdi> ₪ עד גיל 18, ועוד ${money(sv.grant_3, 0)} ₪ בגיל ${sv.grant_3_age} ו-${money(sv.grant_mitzvah, 0)} ₪ בבר או בת מצווה; ${money(sv.grant_21, 0)} ₪ בגיל 21 אם לא נמשך כסף; בלי תשואה${cite(sv.base_section, yl.law_url)}${cite('סכום החיסכון', sv.url)}</li>`
			+ `<li>תוספת ומענק לימודים: אין כאן קצבה מהרשימה ולא הורה עצמאי, ולכן אין תוספת (${money(yl.supplement.amount, 0)} ₪ לילד השלישי והרביעי) ואין מענק לימודים (${money(yl.study.amount, 0)} ₪ לילד)${cite(yl.supplement.section, yl.law_url)}${cite(yl.study.section, yl.law_url)}</li></ol>`,
		compare_table: amountsTable(reg) + savingsTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

export function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const kids = Array.from(root.querySelectorAll(`li.${P}-kid`)).map((li) => {
		const i = li.getAttribute('data-kid');
		return { birth: toIso(val(`#${P}-k${i}`)), sex: val(`#${P}-s${i}`), arrive: toIso(val(`#${P}-a${i}`)) };
	});
	return { kids, benefit: radio('ben', 'none'), single: on('single'), addSave: on('add'), asOf: '' };
}

const BC = { none: 'n', hb: 'h', mz: 'm', hh: 's', old: 'o', nc: 'd' };
const keyOf = (map, code, d) => Object.keys(map).find((k) => map[k] === code) || d;
export function stateOf(i) {
	const kids = (i.kids || []).filter((k) => /^\d{4}-\d{2}-\d{2}$/.test(k.birth || '')).map((k) => `${k.birth}${k.sex === 'b' || k.sex === 'g' ? k.sex : ''}${/^\d{4}-\d{2}-\d{2}$/.test(k.arrive || '') ? `a${k.arrive}` : ''}`);
	return encodeState({ k: kids.join('~'), b: i.benefit && i.benefit !== 'none' ? BC[i.benefit] : '', u: i.single ? 1 : '', p: i.addSave ? 1 : '' });
}
export const KEYS = ['k', 'b', 'u', 'p'];
export function inputOf(s) {
	if (!s.k) { return null; }
	const kids = s.k.split('~').map((x) => x.match(/^(\d{4}-\d{2}-\d{2})([bg]?)(?:a(\d{4}-\d{2}-\d{2}))?$/)).filter(Boolean).map((m) => ({ birth: m[1], sex: m[2] || '', arrive: m[3] || '' }));
	if (!kids.length) { return null; }
	return { kids: kids.slice(0, MAX_KIDS), benefit: keyOf(BC, s.b, 'none'), single: s.u === '1', addSave: s.p === '1', asOf: '' };
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const yl = reg.rights_yeladim;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(yl.checked_on, yl.refresh_every_days) || (yl.next_update && today >= yl.next_update)) {
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
	const band = (r) => (r.ok ? `${r.status}${r.suppOn ? '-supp' : ''}` : 'error');
	const withToday = (input) => Object.assign({}, input, { asOf: today });
	const run = (input, opts = {}) => {
		const r = compute(reg, withToday(input));
		showErrors(r);
		result.innerHTML = renderResult(reg, r, opts);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.monthly, 0) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: band(r) }); }
		return r;
	};
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	const redraw = (input, focusId) => {
		own = true;
		form.innerHTML = renderForm(reg, input);
		run(input);
		const f = focusId ? root.querySelector(`#${focusId}`) : null;
		if (f && typeof f.focus === 'function') { f.focus(); }
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	} else if (today.slice(0, 7) !== yl.checked_on.slice(0, 7)) {
		// The server example is computed for the check month; a later visit sees the same family counted from this month.
		run(readForm(root), { silent: true, example: true });
	}
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	// The card's jump: to the form, the first birth date focused (the page anchor is the fallback without the script).
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
		const btn = ev.target.closest('[data-act]');
		if (!btn) { return; }
		const act = btn.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		if (act === 'add-kid' || act === 'add-twins') {
			const kids = input.kids.concat(act === 'add-twins' ? [{ birth: '', sex: '', arrive: '' }, { birth: '', sex: '', arrive: '' }] : [{ birth: '', sex: '', arrive: '' }]).slice(0, MAX_KIDS);
			redraw(Object.assign({}, input, { kids }), `${P}-k${input.kids.length}`);
			if (act === 'add-twins') {
				const a = root.querySelector(`#${P}-k${input.kids.length}`);
				const b = root.querySelector(`#${P}-k${input.kids.length + 1}`);
				if (a && b) { a.addEventListener('change', () => { if (!b.value) { b.value = a.value; schedule(); } }, { once: true }); }
			}
			return;
		}
		if (act === 'del-kid') {
			const n = Number(btn.getAttribute('data-del'));
			const kids = input.kids.filter((k, i) => i !== n);
			redraw(Object.assign({}, input, { kids: kids.length ? kids : [{ birth: '', sex: '', arrive: '' }] }), `${P}-k${Math.max(0, n - 1)}`);
			return;
		}
		if (act === 'profile') {
			const p = profile(btn.getAttribute('data-profile'), today);
			if (p) { redraw(p); track('tool_start', { tool_id: TOOL_ID, type: 'profile' }); }
			return;
		}
		const r = compute(reg, withToday(input));
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			const events = r.deadlines.filter((d) => d.ics);
			download('kitzbat-yeladim.ics', 'text/calendar;charset=utf-8', ics(events.map((d) => ({ date: d.date, summary: `קצבת ילדים: ${d.he}` })), new Date().toISOString()));
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
			toast(root, ok ? 'הקישור הועתק. יש בו רק תאריכי הלידה שהקלדתם, בלי שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק הביטוח הלאומי ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(yl.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: band(r) });
			if (r.ok && openSimulation(scenarioText(reg, r), 'mediation', btn.getAttribute('href'))) { ev.preventDefault(); toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.'); }
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { redraw(s); }
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
