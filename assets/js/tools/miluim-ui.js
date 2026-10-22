/**
 * Rights guide wave 2B UI (21.10.2026): reserve-duty pay, the IDF's 2026 grants and the dismissal protection
 * (tagmulei-miluim). Two pictures from the reservist's own paperwork: a pay slip of the reward (the basis against the floor
 * and the ceiling lines, the days, the 40% addition, the total), and the service calendar: a row per month, a cell per day,
 * the days served and then the protected days after them, with the last protected day marked. The tables, the checklist
 * and the .ics say the same in text. The result-first card ([justice_tool_lead]) carries the total on the first screen, and
 * the rehearse link hands the reader's figures to the jus-tice.com simulation (sim-handoff.js, the wave-2A bar, HAD-585).
 */
import { compute, byIncome, basisMonths, monthHe, paidDays, grantsFor, STATUS, TIERS } from './miluim-engine.js';
import { daysBetween } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, num, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'tagmulei-miluim';
const P = 'jt51';

export const EXAMPLE = {
	status: 'employee', wageMode: 'same', wage: 15000, wages: [], employerPays: true, short60: false, stopped: false,
	start: '2026-11-01', end: '2026-11-30', prior: 0, emergency: false, prevEnd: '', prevWage: '', tier: '', old8: 0, kid14: false, special: false,
};
/** One click, a whole profile (the bar of wave 2B). */
export const PROFILES = {
	emp: { label: 'שכיר, 15,000 ₪, 30 ימי מילואים', input: EXAMPLE },
	self: { label: 'עצמאית, 12,000 ₪, 45 ימים', input: Object.assign({}, EXAMPLE, { status: 'self', wage: 12000, end: '2026-12-15' }) },
	student: { label: 'סטודנט, 20 ימים', input: Object.assign({}, EXAMPLE, { status: 'student', wage: '', end: '2026-11-20' }) },
	none: { label: 'לא עובד, 10 ימים', input: Object.assign({}, EXAMPLE, { status: 'none', wage: '', end: '2026-11-10' }) },
	combat: { label: 'לוחם במדרג א\'+, 70 ימים בשנה, ילד עד 14', input: Object.assign({}, EXAMPLE, { wage: 20000, prior: 40, tier: 'ap', kid14: true }) },
};

const STATUS_LABEL = { employee: 'עבודה שכירה', self: 'עבודה עצמאית', student: 'לימודים (סטודנט)', none: 'בלי עבודה' };
const STATUS_SHORT = { employee: 'שכיר', self: 'עצמאי', student: 'סטודנט', none: 'לא עובד' };
const PAYER_LABEL = { employer: 'המעסיק (והמוסד מחזיר לו)', claim: 'הביטוח הלאומי, בתביעה אישית', self: 'הביטוח הלאומי, אוטומטית', institute: 'הביטוח הלאומי' };
const GRANT_LABEL = { special: 'תגמול מיוחד', personal: 'מענק הוצאות אישיות', family: 'מענק משפחה מוגדל', household: 'מענק כלכלת הבית מוגדל', special_family: 'מענק משפחה מיוחדת', voucher: 'שובר נופש', wallet: 'ארנק דיגיטלי' };
const MARK = { bad: '✕', warn: '!', info: 'i' };
const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const mn = (n) => money(n, Math.round(n * 100) % 100 ? 2 : 0);
const dn = (n) => money(n, Number.isInteger(n) ? 0 : 1);
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const filled = (v) => !(v === '' || v === undefined || v === null || Number.isNaN(v));
const tierHe = (reg, t) => (t ? `מדרג ${reg.rights_miluim.grants.tier_he[t]}` : 'מדרג לא ידוע');

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
const sameInput = (a, b) => stateOf(Object.assign({}, EXAMPLE, a)) === stateOf(Object.assign({}, EXAMPLE, b));

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const ml = reg.rights_miluim;
	const p = ml.pay;
	const g = ml.grants;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const field = (id, label, value, ph, mode = 'numeric') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="${mode}" autocomplete="off" value="${esc(filled(value) ? String(value) : '')}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const moneyField = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${label}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(filled(value) ? money(value, value % 1 ? 2 : 0) : '')}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const status = STATUS.includes(input.status) ? input.status : 'employee';
	const each = input.wageMode === 'each';
	const income = status === 'employee' || status === 'self' || (status === 'none' && input.stopped === true);
	const startIso = toIso(input.start);
	const labels = /^\d{4}-\d{2}-\d{2}$/.test(startIso) ? basisMonths(startIso).map(monthHe) : ['החודש הראשון', 'השני', 'השלישי', 'הרביעי', 'החמישי', 'השישי (האחרון)'];
	const wages = Array.isArray(input.wages) ? input.wages : [];
	const tier = TIERS.includes(input.tier) ? input.tier : '';
	const prevOpen = input.emergency === true || filled(input.prevEnd) || filled(input.prevWage);
	const grantsOpen = Boolean(tier) || input.kid14 === true || input.special === true || Number(input.old8) > 0;
	const prof = Object.keys(PROFILES).map((k) => `<button type="button" class="${P}-prof" data-profile="${k}" aria-pressed="${sameInput(input, PROFILES[k].input) ? 'true' : 'false'}">${esc(PROFILES[k].label)}</button>`).join('');
	return `<div class="${P}-profiles" role="group" aria-label="פרופיל מוכן בלחיצה אחת"><span class="${P}-profiles__h">בלחיצה אחת:</span>${prof}</div>`
		+ `<fieldset class="jtool-field"><legend>מה עשיתם בחודשים שלפני השירות</legend><div class="jtool-chips">${STATUS.map((k) => chip('st', k, STATUS_LABEL[k], status === k)).join('')}</div><p class="jtool-error" id="${P}-status-e" role="alert"></p></fieldset>`
		+ `<div class="jtool-chips" data-if-none${status === 'none' ? '' : ' hidden'}>${chip('sp', '1', `הפסקתי לעבוד פחות מ-${ml.stopped.days} ימים לפני השירות`, input.stopped === true, 'checkbox')}</div>`
		+ `<fieldset class="jtool-field" data-if-income${income ? '' : ' hidden'}><legend>ההכנסה ברוטו בחודשים שלפני חודש השירות</legend><div class="jtool-chips">${chip('wm', 'same', 'אותה הכנסה בכל חודש', !each)}${chip('wm', 'each', '6 חודשים, כל חודש לחוד', each)}</div>`
		+ `<div data-if-wm="same"${each ? ' hidden' : ''} style="margin-top:8px">${moneyField('wage', `<span data-if-st="self"${status === 'self' ? '' : ' hidden'}>ההכנסה החודשית שעליה משולמות המקדמות</span><span data-if-st="other"${status === 'self' ? ' hidden' : ''}>שכר חודשי ברוטו</span>`, input.wage, 'לדוגמה: 15,000')}</div>`
		+ `<div class="${P}-six" data-if-wm="each"${each ? '' : ' hidden'}>${labels.map((l, i) => `<div data-w="${i}">${moneyField(`w${i}`, esc(l), wages[i], i < 3 ? 'רק כשחסרים ימי עבודה' : 'ברוטו')}</div>`).join('')}</div>`
		+ `<p class="jtool-hint">${esc(p.he)} (${esc(p.section_base)}). ${esc(p.includes_he)}.</p></fieldset>`
		+ `<div class="jtool-chips" data-if-emp${status === 'employee' ? '' : ' hidden'}>${chip('ep', '1', 'שכר חודשי, או 75 ימי עבודה לפחות ב-3 החודשים אצל אותו מעסיק', input.employerPays !== false, 'checkbox')}${chip('sh', '1', `עבדתי פחות מ-${p.short_days} ימים ב-3 החודשים`, input.short60 === true, 'checkbox')}</div>`
		+ `<div class="jtool-row">${field('start', 'היום הראשון של השירות', isoToHe(startIso), 'לדוגמה: 1.11.2026')}${field('end', 'היום האחרון של השירות', isoToHe(toIso(input.end)), 'לדוגמה: 30.11.2026')}</div>`
		+ `<div class="jtool-row">${field('prior', 'ימי מילואים קודמים באותה שנה (לפני השירות הזה)', Number(input.prior) ? input.prior : '', '0')}</div>`
		+ `<p class="jtool-hint">${esc(ml.addition.he)} (${esc(ml.addition.section)}). הימים הקודמים קובעים את ההגנה המורחבת, את המענקים ואת נקודות הזיכוי.</p>`
		+ `<details class="jtool-more"${prevOpen ? ' open' : ''}><summary>שירות קודם וצו 8 (תקופת חירום)</summary>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('em', '1', 'השירות בתקופת חירום (צו 8)', input.emergency === true, 'checkbox')}</div>`
		+ `<div class="jtool-row">${field('pe', 'היום האחרון של השירות הקודם', isoToHe(toIso(input.prevEnd)), 'לא חובה')}${moneyField('pw', 'ההכנסה החודשית לפני השירות הקודם (בחירום: לפני השירות הראשון בתקופת החירום)', input.prevWage, 'לא חובה')}</div>`
		+ `<p class="jtool-hint">${esc(ml.drag.he)} (${esc(ml.drag.section)}). ${esc(ml.emergency.page_he)} (${esc(ml.emergency.section)}).</p></details>`
		+ `<details class="jtool-more"${grantsOpen ? ' open' : ''}><summary>מענקי צה"ל ל-${g.year}: מדרג הפעילות והמשפחה</summary>`
		+ `<fieldset class="jtool-field" style="margin-top:8px"><legend>מדרג הפעילות של היחידה</legend><div class="jtool-chips">${chip('tr', '', 'לא יודע/ת', !tier)}${TIERS.map((t) => chip('tr', t, g.tier_he[t], tier === t)).join('')}</div></fieldset>`
		+ `<p class="jtool-hint">${esc(g.tier_examples_he)}.</p>`
		+ `<div class="jtool-row">${field('o8', `ימי צו 8 מ-${isoToHe(g.old8.from)} עד ${isoToHe(g.old8.to)}`, Number(input.old8) ? input.old8 : '', '0')}</div>`
		+ `<div class="jtool-chips">${chip('kd', '1', 'יש לי ילד עד גיל 14', input.kid14 === true, 'checkbox')}${chip('sf', '1', 'הורה לתלמיד עם צרכים מיוחדים או לילד שמקבל גמלת ילד נכה', input.special === true, 'checkbox')}</div></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const parts = [`תגמול מילואים של ${nis(r.daily)} ליום${r.atMax ? ' (המקסימום)' : r.atMin || !r.needsIncome ? ' (המינימום)' : ''} על ${r.days} ימי שירות, ${dn(r.pd.paid)} ימים לתשלום עם התוספת: ${nis(r.reward)} ברוטו${r.comp ? `, ועוד פיצוי לעצמאי ${nis(r.comp)}` : ''}.`];
	parts.push(r.payer === 'employer' ? 'המעסיק ממשיך לשלם את השכר במועד הרגיל והביטוח הלאומי מחזיר לו את התגמול.' : r.payer === 'self' ? 'הביטוח הלאומי משלם ישירות, בדרך כלל אוטומטית.' : 'הביטוח הלאומי משלם ישירות.');
	if (r.extOn) { parts.push(`אסור לפטר בלי היתר מוועדת התעסוקה עד ${isoToHe(r.p30.to)}, ועד ${isoToHe(r.extTo)} רק מטעמים מיוחדים שאינם קשורים לשירות${r.ext === 'check' ? ' (אם היו 7 ימים רצופים)' : ''}.`); } else if (r.after) { parts.push(`אסור לפטר בלי היתר מוועדת התעסוקה עד ${isoToHe(r.p30.to)}.`); } else { parts.push('אסור לפטר בלי היתר רק בימי השירות עצמם, ופיטורים בגלל המילואים בטלים תמיד.'); }
	return parts.join(' ');
}

/** The pay slip: the basis against the floor and ceiling lines, then the lines of the reward. */
function payslip(reg, r) {
	const ml = reg.rights_miluim;
	const p = ml.pay;
	const scale = r.max * 1.15;
	const pos = (v) => Math.max(0, Math.min(100, (v / scale) * 100)).toFixed(2);
	const rawShown = r.needsIncome || r.prevDaily !== null ? r.raw : 0;
	const label = `מד התגמול ליום: מינימום ${mn(r.min)}, מקסימום ${mn(r.max)}, לפי ההכנסה ${mn(rawShown)}, משולם ${mn(r.daily)} ש"ח`;
	const gauge = `<div class="${P}-gauge" role="img" aria-label="${esc(label)}"><div class="${P}-gauge__track"><span class="${P}-gauge__fill" style="width:${pos(r.daily)}%"></span>`
		+ `<span class="${P}-gauge__line ${P}-gauge__line--min" style="inset-inline-start:${pos(r.min)}%"></span><span class="${P}-gauge__line ${P}-gauge__line--max" style="inset-inline-start:${pos(r.max)}%"></span>`
		+ (rawShown > 0 && rawShown !== r.daily ? `<span class="${P}-gauge__raw" style="inset-inline-start:${pos(rawShown)}%"></span>` : '')
		+ `</div><div class="${P}-gauge__scale"><span style="inset-inline-start:${pos(r.min)}%">מינימום <bdi>${mn(r.min)}</bdi></span><span style="inset-inline-start:${pos(r.max)}%">מקסימום <bdi>${mn(r.max)}</bdi></span></div></div>`;
	const rows = [];
	if (r.needsIncome) { rows.push([`בסיס: <bdi>${mn(r.base.sum)} ÷ ${p.quarter_divisor}</bdi>`, mn(r.base.daily)]); }
	if (r.prevDaily !== null && r.rule !== 'base') { rows.push([r.rule === '274b' ? 'לפי השירות הראשון בחירום' : 'לפי השירות הקודם', mn(r.raw)]); }
	if (!r.needsIncome && r.rule === 'min') { rows.push(['בלי הכנסה: התגמול המזערי', mn(r.min)]); }
	rows.push(['תגמול ליום', mn(r.daily)]);
	rows.push(['ימי שירות', dn(r.days)]);
	rows.push([`תוספת 40% (שארית ${r.pd.rem})`, `+${dn(r.pd.add)}`]);
	rows.push(['ימים לתשלום', dn(r.pd.paid)]);
	rows.push([`תגמול: <bdi>${mn(r.daily)} × ${dn(r.pd.paid)}</bdi>`, mn(r.reward)]);
	if (r.comp) { rows.push([`פיצוי לעצמאי: <bdi>${mn(r.compDaily)} × ${dn(r.pd.paid)}</bdi>`, mn(r.comp)]); }
	return `<div class="${P}-slip"><p class="${P}-slip__h">תלוש תגמול המילואים, ${esc(isoToHe(r.start))} עד ${esc(isoToHe(r.end))}</p>${gauge}`
		+ `<dl class="${P}-slip__rows">${rows.map(([a, b]) => `<div><dt>${a}</dt><dd><bdi>${b}</bdi></dd></div>`).join('')}<div class="${P}-slip__total"><dt>סך הכול ברוטו</dt><dd><bdi>${mn(r.total)}</bdi> ₪</dd></div></dl></div>`;
}

/** The service calendar: a row per month, a cell per day: served, protected 30 days, protected days 31 to 60. */
function calendar(reg, r) {
	const kinds = { svc: 'ימי שירות', after: '30 ימי הגנה אחרי השירות', ext: r.ext === 'check' ? 'ימים 31 עד 60 (אם היו 7 ימים רצופים)' : 'הגנה מורחבת, ימים 31 עד 60', free: 'בלי הגנה מיוחדת' };
	const rows = r.strip.map((m) => {
		const cells = m.cells.map((c) => `<i class="${P}-c ${P}-c--${c.k}${c.first ? ` ${P}-c--first` : ''}${c.last ? ` ${P}-c--last` : ''}${c.stop ? ` ${P}-c--stop` : ''}"></i>`).join('');
		const has = (d) => m.cells.some((c) => c.d === d);
		const mark = has(r.protectEnd) && r.protectEnd !== r.end ? `סוף ההגנה ${isoToHe(r.protectEnd)}` : has(r.end) ? `סוף השירות ${isoToHe(r.end)}` : '';
		return `<li class="${P}-m"><span class="${P}-m__n">${esc(monthHe(m.ym))}</span><span class="${P}-m__days" aria-hidden="true">${cells}</span>${mark ? `<span class="${P}-m__k">${esc(mark)}</span>` : ''}</li>`;
	}).join('');
	const used = new Set();
	r.strip.forEach((m) => m.cells.forEach((c) => used.add(c.k)));
	const legend = ['svc', 'after', 'ext', 'free'].filter((k) => used.has(k)).map((k) => `<span><i class="${P}-c ${P}-c--${k}"></i>${esc(kinds[k])}</span>`).join('')
		+ (r.protectEnd !== r.end ? `<span><i class="${P}-c ${P}-c--after ${P}-c--stop"></i>היום האחרון של ההגנה</span>` : '');
	const label = `יומן השירות וההגנה: שירות ${isoToHe(r.start)} עד ${isoToHe(r.end)}${r.p30 ? `, הגנה עד ${isoToHe(r.p30.to)}` : ''}${r.extOn ? `, הגנה מורחבת עד ${isoToHe(r.extTo)}` : ''}`;
	return `<div class="${P}-cal" role="group" aria-label="${esc(label)}"><p class="${P}-cal__h">יומן השירות וההגנה מפיטורים, יום אחרי יום</p><ol class="${P}-cal__ms">${rows}</ol><p class="${P}-cal__legend">${legend}</p></div>`;
}

/** The one-line reason to rehearse, tied to the result: the dismissal protection is an employee's; everyone else talks to the Institute. */
function rehearseWhy(reg, r) {
	if (r.status !== 'employee') {
		return `<p class="${P}-why"><strong>תרגול:</strong> ${esc(`התגמול משולם ישירות מהביטוח הלאומי. חסר תשלום, או שהסכום נמוך מ-${nis(r.total)}? כדאי לתרגל את השיחה עם פקיד התביעות.`)} <a href="#jtool-${TOOL_ID}-next" data-act="rehearse" data-${P}-rehearse>לתרגול השיחה</a></p>`;
	}
	const why = r.extOn
		? `קיבלתם הזמנה לשימוע או מכתב פיטורים עד ${isoToHe(r.protectEnd)}? המעסיק צריך היתר, ובוועדת התעסוקה עליו להוכיח שזה לא בגלל המילואים. כדאי לתרגל את הדיון.`
		: r.after
			? `קיבלתם הזמנה לשימוע או מכתב פיטורים עד ${isoToHe(r.protectEnd)}? בלי היתר מוועדת התעסוקה הפיטורים אסורים. כדאי לתרגל את הדיון בוועדה.`
			: 'גם אחרי שירות קצר פיטורים בגלל המילואים בטלים, והמעסיק צריך להוכיח טעם אחר. כדאי לתרגל את הדיון בוועדת התעסוקה.';
	return `<p class="${P}-why"><strong>תרגול:</strong> ${esc(why)} <a href="#jtool-${TOOL_ID}-next" data-act="rehearse" data-${P}-rehearse>לתרגול הדיון</a></p>`;
}

/** The next steps: the official service, the IDF's grants, the credit-points builder, the guide. */
export function nextSteps(reg, r) {
	const ml = reg.rights_miluim;
	const out = [];
	if (r.payer === 'employer') { out.push({ he: 'לבדוק בתלוש שהתגמול שולם, ואם הוא גבוה מהשכר לבקש את ההפרש', url: ml.pages.employer }); } else { out.push({ he: `להגיש תביעה אישית לתגמול, טופס ${ml.payer.personal_form} עם טופס ${ml.payer.army_form}`, url: ml.pages.form_502 }); }
	out.push({ he: `לבדוק את מענקי ${ml.grants.year} לפי המדרג באתר המילואים`, url: ml.grants.url });
	if (r.points > 0) { out.push({ he: `לחשב את נקודות הזיכוי של ${r.taxYear}`, path: ml.tax.path }); } else { out.push({ he: 'לבדוק מה מנוכה מהתגמול לביטוח לאומי ובריאות', path: '/national-insurance-calculator/' }); }
	out.push({ he: 'מה לעשות כשמזמינים לשימוע אחרי המילואים', path: '/hearing-before-dismissal/' });
	return out;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const state = `<p class="jtool-state jtool-state--ok">✓ ${r.days} ימי שירות, ${dn(r.pd.paid)} ימים לתשלום</p>`;
	let out = `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}תגמול מילואים, סך הכול ברוטו</p>`
		+ `<strong class="jtool-verdict__figure">${ilsn(r.total)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>ליום</dt><dd>${ilsn(r.daily)}</dd></div><div><dt>ימים לתשלום</dt><dd>${num(r.pd.paid, Number.isInteger(r.pd.paid) ? 0 : 1)}</dd></div><div><dt>משלם</dt><dd>${esc(PAYER_LABEL[r.payer])}</dd></div><div><dt>הגנה מפיטורים עד</dt><dd><bdi>${esc(isoToHe(r.protectEnd))}</bdi></dd></div></dl></div>`;
	out += `<div class="${P}-pics">${payslip(reg, r)}${calendar(reg, r)}</div>`;
	const flags = r.flags.filter((x) => x.level !== 'info');
	if (flags.length) { out += `<ul class="jtool-flags">${flags.map((x) => `<li><strong aria-hidden="true">${MARK[x.level]}</strong> ${esc(x.he)}</li>`).join('')}</ul>`; }
	out += rehearseWhy(reg, r);
	out += `<div class="${P}-next"><p class="${P}-next__h">הצעדים הבאים</p><ol>${nextSteps(reg, r).map((x) => `<li><a href="${esc(x.url || x.path)}"${x.url ? ' target="_blank" rel="noopener"' : ''}>${esc(x.he)}</a></li>`).join('')}</ol></div>`;
	return out;
}

export function checklist(reg, r) {
	const ml = reg.rights_miluim;
	const pay = ml.payer;
	const out = [{ he: `לשמור את אישור השירות מהצבא (טופס ${pay.army_form}) ולבדוק שהתאריכים נכונים`, section: 'תנאי הזכאות', url: ml.pages.conditions }];
	if (r.payer === 'employer') {
		out.push({ he: `${pay.employer_he}`, section: pay.section, url: pay.employer_url });
		out.push({ he: `${pay.diff_he}`, section: pay.transfer_section, url: ml.law_url });
	} else if (r.payer === 'self') {
		out.push({ he: `${ml.self.auto_he}`, section: 'אופן הגשת התביעה', url: pay.claim_url });
		out.push({ he: `${ml.self.he}`, section: 'פיצוי לעצמאי', url: ml.self.url });
	} else {
		out.push({ he: `${pay.personal_he}${r.payer === 'claim' ? '; שכיר מצרף תלושי שכר של 6 החודשים שלפני השירות' : ''}`, section: `טופס ${pay.personal_form}`, url: ml.pages.form_502 });
	}
	if (r.payer !== 'employer') { out.push({ he: `${ml.claim.he}; ${ml.claim.safe_he}: עד ${isoToHe(r.deadlines.find((d) => d.key === 'claim').date)}`, section: ml.claim.section, url: ml.claim.url }); }
	if (r.rule === '274b' && r.sub === 'over') { out.push({ he: 'העלייה בהכנסה מעל 20% מעבודה: המעסיק מגיש בקשת הפרשים מקוונת, ומי שתובע לבד מגיש בקשה בתביעה האישית', section: ml.emergency.section, url: ml.emergency.diff_url }); }
	out.push({ he: `אם מגיעה הזמנה לשימוע, מכתב פיטורים או הוצאה לחל"ת עד ${isoToHe(r.protectEnd)}: לבקש לראות את היתר ועדת התעסוקה; בלי היתר הפיטורים אסורים`, section: ml.protect.during_section, url: ml.protect.law_url });
	out.push({ he: ml.protect.legal_aid_he, section: 'ייצוג משפטי', url: ml.protect.legal_aid_url });
	if (r.spouse) { out.push({ he: `לבן או בת הזוג: ${r.spouse} ימי היעדרות בתשלום מעבר לדין לפי ${r.cum} הימים המצטברים שלכם השנה (${ml.protect.order.spouse_he})`, section: ml.protect.order.spouse_section, url: ml.protect.order.url }); }
	if (r.points > 0) { out.push({ he: `ב-${r.taxYear}: להפיק באזור האישי באתר המילואים את אישור נקודות הזיכוי ולמסור למעסיק עם טופס 101`, section: 'נקודות זיכוי', url: ml.tax.url }); }
	if (r.n26 > 0) { out.push({ he: `לברר את מדרג הפעילות במוקד המילואים (1111, שלוחה 4 ואז 1) ולעקוב אחרי המענקים באזור האישי`, section: `מדיניות ${ml.grants.year}`, url: ml.grants.url }); }
	return out;
}
export function checklistText(reg, r) { return checklist(reg, r).map((x, i) => `${i + 1}. ${x.he} (${x.section})`).join('\n'); }

/** The protection, period by period, with its rule. */
export function periods(reg, r) {
	const pr = reg.rights_miluim.protect;
	const ord = pr.order;
	const he = {
		during: `בזמן השירות: ${pr.during_he}`,
		after: `30 ימים אחרי השירות: ${pr.after_he}`,
		ext: `ימים 31 עד 60: ${r.ext === 'check' ? 'אם היו גם 7 ימים רצופים, ' : ''}אסור לפטר או להוציא לחל"ת, אלא מטעמים מיוחדים ובלי קשר לשירות`,
	};
	const sec = { during: [pr.during_section, pr.law_url], after: [pr.after_section, pr.law_url], ext: [`${ord.section} ו-${ord.unpaid_section.replace('סעיף ', '')}`, ord.url] };
	return r.windows.map((w) => ({ from: w.from, to: w.to, he: he[w.key], section: sec[w.key][0], url: sec[w.key][1], key: w.key }));
}

/** The grants: one tier as lines, or every tier side by side when the tier is not known. */
function grantsBlock(reg, r) {
	const ml = reg.rights_miluim;
	const g = ml.grants;
	const desc = (key) => g[key].he;
	if (!r.n26) { return `<p class="${P}-note">${esc(r.flags.find((f) => f.code === 'grants_year').he)}</p>`; }
	const days = `${r.n26} ימי שירות ב-${g.year}${r.old8 ? ` ועוד ${r.old8} ימי צו 8 קודמים` : ''}`;
	const cell = (x, t) => {
		if (!x.ok) {
			if (x.key === 'family' && !r.kid14) { return 'רק עם ילד עד 14'; }
			if (x.key === 'special_family' && !r.special) { return 'רק להורה כאמור'; }
			if ((x.key === 'household' || x.key === 'wallet') && !x.tierOk) { return 'לא במדרג הזה'; }
			return '—';
		}
		if (x.key === 'personal' && x.low !== x.amount) { return `${ilsn(x.low)} עד ${ilsn(x.amount)}`; }
		if (x.key === 'voucher' && x.approx) { return `כ-${ilsn(x.amount)}`; }
		return ilsn(x.amount);
	};
	const rule = (key) => {
		if (key === 'special') { return `מהיום ה-${g.special.from_day}, ${g.special.counts_old8 ? 'כולל ימי צו 8 קודמים במניין' : ''}; משולם ${isoToHe(g.special.paid_on)}`; }
		if (key === 'personal') { return `40 ימים לפחות; לכל יום מהיום ה-${g.personal.from_day} (או ה-${g.personal.heading_from_day}, ראו למטה)`; }
		if (key === 'family') { return `40 ימים לפחות וילד עד גיל ${g.family.child_age}; לכל יום מהיום ה-${g.family.from_day}`; }
		if (key === 'household') { return `${g.household.min_days} ימים, מדרגים א'+, א' ו-ב'; ${g.household.paid_he}`; }
		if (key === 'special_family') { return `${g.special_family.min_days} ימים; הורה לתלמיד עם צרכים מיוחדים או לילד עם גמלת ילד נכה`; }
		if (key === 'voucher') { return `${g.voucher.min_days} ימים; תוספת לכל יום עד היום ה-${g.voucher.to_day}; ${g.voucher.valid_he}`; }
		return `${g.wallet.min_days} ימים, מדרגים א'+, א' ו-ב'`;
	};
	const keys = ['special', 'personal', 'family', 'household', 'special_family', 'voucher', 'wallet'];
	let out = '';
	if (r.grants.length === 1) {
		const one = r.grants[0];
		out += `<div class="jtool-scroll" role="region" aria-labelledby="${P}-gr-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מענק</th><th scope="col">סכום</th><th scope="col">התנאי</th></tr></thead><tbody>`
			+ keys.map((k) => { const x = one.lines.find((l) => l.key === k); return `<tr><td data-th="מענק">${esc(GRANT_LABEL[k])}${x.rate && x.ok ? ` <bdi>(${x.days} × ${x.rate})</bdi>` : ''}</td><td data-th="סכום">${cell(x, one.tier)}</td><td data-th="התנאי">${esc(rule(k))}${cite('מדיניות 2026', g.url)}</td></tr>`; }).join('')
			+ `<tr class="jtool-table__total"><td data-th="מענק">כסף, ${esc(tierHe(reg, one.tier))}</td><td data-th="סכום">${one.cashLow !== one.cash ? `${ilsn(one.cashLow)} עד ${ilsn(one.cash)}` : ilsn(one.cash)}</td><td data-th="התנאי">ועוד שובר וארנק בשווי ${esc(nis(one.other))}</td></tr>`
			+ `</tbody><caption>${esc(days)}, ${esc(tierHe(reg, one.tier))}. ${esc(g.budget_he)}.</caption></table></div>`;
	} else {
		out += `<div class="jtool-scroll" role="region" aria-labelledby="${P}-gr-h" tabindex="0"><table class="jtool-table ${P}-tiers"><thead><tr><th scope="col">מענק</th>${r.grants.map((x) => `<th scope="col">${esc(g.tier_he[x.tier])}</th>`).join('')}</tr></thead><tbody>`
			+ keys.map((k) => `<tr><td data-th="מענק">${esc(GRANT_LABEL[k])}</td>${r.grants.map((x) => `<td data-th="${esc(g.tier_he[x.tier])}">${cell(x.lines.find((l) => l.key === k), x.tier)}</td>`).join('')}</tr>`).join('')
			+ `</tbody><caption>${esc(days)}, לכל מדרג. ${esc(g.budget_he)}.</caption></table></div>`;
	}
	const facts = keys.map((k) => `<li>${esc(desc(k))}</li>`).join('');
	out += `<ul class="${P}-info">${facts}<li>${esc(g.personal.check_he)}.</li>${g.info.map((x) => `<li>${esc(x.he)}</li>`).join('')}</ul>`;
	return out;
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const ml = reg.rights_miluim;
	const btl = reg.rights_btl;
	const p = ml.pay;
	const pr = ml.protect;
	let out = '';
	// 1. The calculation, line by line.
	const rows = [];
	if (r.needsIncome) {
		const lab = r.base.kind === 'best3' ? '3 החודשים הגבוהים מתוך 6' : `3 החודשים (${esc(monthHe(r.months[3]))} עד ${esc(monthHe(r.months[5]))})`;
		rows.push([`ההכנסה ב-${lab}`, ilsn(r.base.sum), `${r.base.kind === 'best3' ? `פחות מ-${p.short_days} ימי עבודה${cite(p.section_short, ml.law_url)}` : `החודשים שלפני חודש השירות${cite(p.section_base, ml.law_url)}`}${r.base.floored.some(Boolean) ? `; חודש נמוך נחשב <bdi>${mn(r.floor)}</bdi> (68% מהסכום הבסיסי)${cite(p.section_floor, ml.law_url)}` : ''}`]);
		rows.push([`<bdi>${mn(r.base.sum)} ÷ ${p.quarter_divisor}</bdi>`, ilsn(r.base.daily), `ליום${cite('סכום התגמול', p.url)}`]);
	}
	if (r.prevDaily !== null) { rows.push([`השירות הקודם: <bdi>${mn(Math.max(r.prevWage, r.floor))} × ${p.quarter_months} ÷ ${p.quarter_divisor}</bdi>`, ilsn(r.prevDaily), r.rule === '274b' ? `בחירום, לפני השירות הראשון${cite(ml.emergency.section, ml.emergency.url)}` : r.rule === '279' ? `בתוך ${ml.drag.days} ימים${cite(ml.drag.section, ml.law_url)}` : 'לא חל כאן']); }
	if (r.rule === '274b') { rows.push(['הבסיס אחרי כלל ה-20%', ilsn(r.raw), `${r.sub === 'down' ? 'ההכנסה הקודמת' : r.sub === 'up' ? 'ההכנסה הנוכחית' : `ההכנסה הקודמת ועוד ${ml.emergency.raise_pct}%`}${cite(ml.emergency.section, ml.law_url)}`]); }
	rows.push(['המינימום ליום', ilsn(r.min), `<bdi>${money(btl.basic_amount[p.basic_key], 0)} × ${p.min_pct}% ÷ ${p.divisor_month}</bdi>${cite(p.section_min, ml.law_url)}`]);
	rows.push(['המקסימום ליום', ilsn(r.max), `<bdi>${money(btl.basic_amount[p.basic_key], 0)} × ${p.max_mult} ÷ ${p.divisor_month}</bdi>${cite(p.section_max, ml.law_url)}${cite('סכום התגמול', p.url)}`]);
	rows.push(['התגמול ליום', ilsn(r.daily), r.atMax ? 'המקסימום' : r.atMin || !r.needsIncome ? 'המינימום' : 'לפי ההכנסה']);
	rows.push(['לחודש (לשם השוואה)', ilsn(r.monthly), `<bdi>${mn(r.daily)} × ${p.divisor_month}</bdi>`]);
	rows.push([`ימי שירות: ${r.pd.weeks} שבועות ועוד ${r.pd.rem} ימים`, num(r.days, 0), `${esc(isoToHe(r.start))} עד ${esc(isoToHe(r.end))}`]);
	rows.push(['ימים לתשלום', num(r.pd.paid, Number.isInteger(r.pd.paid) ? 0 : 1), `<bdi>${r.pd.weeks} × 7 + ${r.pd.rem === 6 ? '7' : `${r.pd.rem} × 1.4`}</bdi>${cite(ml.addition.section, ml.law_url)}`]);
	rows.push([`התגמול: <bdi>${mn(r.daily)} × ${dn(r.pd.paid)}</bdi>`, ilsn(r.reward), `ברוטו${cite('סכום התגמול', p.url)}`]);
	if (r.comp) { rows.push([`פיצוי לעצמאי: <bdi>${mn(r.compDaily)} × ${dn(r.pd.paid)}</bdi>`, ilsn(r.comp), `${ml.self.comp_pct}% מהתגמול, ויחד לא יותר מהמקסימום${cite('פיצוי לעובד עצמאי', ml.self.url)}`]); }
	if (r.claimTotal !== null) { rows.push(['בבקשת הפרשים (אם העלייה מעבודה)', ilsn(r.claimTotal), `<bdi>${mn(r.claimDaily)} × ${dn(r.pd.paid)}</bdi>${cite('בקשת הפרש', ml.emergency.diff_url)}`]); }
	if (r.byMonth.length > 1) { rows.push(['הימים לפי חודש', r.byMonth.map((m) => `${esc(monthHe(m.ym))}: ${m.days}`).join(' · '), 'התגמול לפי הבסיס של חודש תחילת השירות']); }
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-calc-h">כמה, על מה, ולפי איזה סעיף</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-calc-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([x, y, z]) => `<tr><td data-th="מה">${x}</td><td data-th="סכום">${y}</td><td data-th="הכלל">${z}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול ברוטו</td><td data-th="סכום">${ilsn(r.total)}</td><td data-th="הכלל">${esc(PAYER_LABEL[r.payer])}</td></tr>`
		+ `</tbody><caption>${esc(ml.deductions.he)}. הסכומים מ-${esc(isoToHe(ml.from))}.</caption></table></div></div>`;
	// 2. The gates.
	const gates = [];
	const gate = (state, he, section, url) => gates.push({ state, he, section, url });
	gate('ok', `שירות מילואים כחוק, לפי אישור הצבא (טופס ${ml.payer.army_form})`, 'תנאי הזכאות', ml.pages.conditions);
	gate('ok', `${STATUS_SHORT[r.status]}: ${r.needsIncome ? 'התגמול לפי ההכנסה' : 'התגמול המזערי'}`, r.needsIncome ? p.section_base : p.section_min, p.status_url);
	if (r.status === 'employee') { gate(r.employerPays ? 'ok' : 'no', r.employerPays ? 'שכר חודשי או 75 ימים אצל אותו מעסיק: המעסיק משלם' : 'פחות מ-75 ימים ולא בשכר חודשי: תביעה אישית', ml.payer.section, ml.payer.url); }
	if (r.status === 'self') { gate('check', 'פיצוי 25% לעצמאי: רק למי שמדווח ומשלם דמי ביטוח כסדרם', 'פיצוי לעצמאי', ml.self.url); }
	gate(r.after ? 'ok' : 'no', `יותר מיומיים רצופים (${r.days} ${r.days === 1 ? 'יום' : 'ימים'}): 30 ימי הגנה אחרי השירות`, pr.after_section, pr.law_url);
	gate(r.ext === 'ok' ? 'ok' : r.ext === 'check' ? 'check' : 'no', `60 ימים מצטברים בשנה (${r.cum}) ו-7 ימים רצופים: הגנה בימים 31 עד 60`, pr.order.section, pr.order.url);
	if (r.prevEnd) { gate(r.rule === '274b' || r.rule === '279' ? 'ok' : 'no', r.rule === '274b' ? `שירות נוסף בחירום: ה-1 בחודש ${r.gapMonth} ימים אחרי השירות הקודם, פחות מ-${ml.emergency.gap_days}` : `שירות נוסף: ${r.gapStart} ימים אחרי השירות הקודם${r.emergency ? '' : `, ${ml.drag.days} לכל היותר`}`, r.emergency ? ml.emergency.section : ml.drag.section, r.emergency ? ml.emergency.url : ml.law_url); }
	if (r.n26) {
		const one = r.tier ? r.grants[0] : null;
		gate(r.n26 + r.old8 >= ml.grants.personal.min_days ? 'ok' : 'no', `40 ימים (${r.n26}${r.old8 ? ` + ${r.old8}` : ''}): מענק הוצאות אישיות${r.kid14 ? ' ומענק משפחה' : ''}`, `מדיניות ${ml.grants.year}`, ml.grants.url);
		gate(r.n26 + r.old8 >= ml.grants.special.from_day ? 'ok' : 'no', `יותר מ-60 ימים: תגמול מיוחד מהיום ה-${ml.grants.special.from_day}`, `מדיניות ${ml.grants.year}`, ml.grants.url);
		gate(r.n26 >= ml.grants.voucher.min_days ? 'ok' : 'no', `45 ימים ב-${ml.grants.year} (${r.n26}): שובר נופש${one && one.lines.find((l) => l.key === 'household').tierOk ? ' ומענק כלכלת הבית' : ''}`, `מדיניות ${ml.grants.year}`, ml.grants.url);
		if (!r.tier) { gate('check', 'מדרג הפעילות לא ידוע: הסכומים לכל מדרג', `מדיניות ${ml.grants.year}`, ml.grants.url); }
	}
	gate(r.points > 0 ? (r.taxOk === false ? 'no' : r.taxOk ? 'ok' : 'check') : 'no', r.points > 0 ? `${r.yearDays} ימים ב-${r.svcYear}: ${r.points} נקודות זיכוי ב-${r.taxYear}${r.taxOk === null ? ', אם המדרג א\'+, א\' או ב\'' : r.taxOk ? '' : ', אבל רק במדרגים א\'+, א\' ו-ב\''}` : `${r.yearDays} ימים ב-${r.svcYear}: פחות מ-30, בלי נקודות זיכוי ב-${r.taxYear}`, 'סעיף 39ב', ml.tax.url);
	if (r.addBand) { gate('check', `התגמול הנוסף של רשות המסים לפי הטבלה שפורסמה לשירות ב-2025: ${money(r.addBand[2], 0)} ש"ח ל-${r.addBand[0]} ימים ומעלה; טבלת ${ml.grants.year} טרם פורסמה`, 'תגמולים', ml.grants.additional_2025.url); }
	const sym = { ok: '✓', no: '✕', check: '?' };
	out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-gate-h">התנאים, אחד אחד</h3></div><ul class="${P}-gate">`
		+ gates.map((x) => `<li class="${P}-gate__i ${P}-gate__i--${x.state}"><strong aria-hidden="true">${sym[x.state]}</strong> ${esc(x.he)}${cite(x.section, x.url)}</li>`).join('')
		+ `</ul></div>`;
	// 3. The protection, period by period.
	const segs = periods(reg, r);
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-per-h">ההגנה מפיטורים, תקופה אחרי תקופה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-per-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מ</th><th scope="col">עד</th><th scope="col">ימים</th><th scope="col">מה אסור</th></tr></thead><tbody>`
		+ segs.map((s) => `<tr><td data-th="מ"><bdi>${esc(isoToHe(s.from))}</bdi></td><td data-th="עד"><bdi>${esc(isoToHe(s.to))}</bdi></td><td data-th="ימים">${num(daysBetween(s.from, s.to) + 1, 0)}</td><td data-th="מה אסור">${esc(s.he)}${cite(s.section, s.url)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(pr.cause_he)}${cite(pr.cause_section, pr.law_url)}. ${esc(pr.notice_he)}${cite(pr.notice_section, pr.law_url)}. פיצוי בוועדת התעסוקה: לפחות <bdi>${money(r.remedy.avg5, 0)}</bdi> ש"ח (5 פעמים השכר הממוצע${r.remedy.wage5 ? `, או 5 משכורות: ${money(r.remedy.wage5, 0)}` : ''}, הגבוה)${cite(pr.remedy.section, pr.law_url)}; ערעור תוך ${pr.appeal.days} ימים${cite(pr.appeal.section, pr.law_url)}.</caption></table></div></div>`;
	// 4. The grants of the year.
	out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-gr-h">מענקי צה"ל ל-${ml.grants.year}</h3></div>${grantsBlock(reg, r)}</div>`;
	// 5. The dates to keep.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ r.deadlines.map((x) => `<tr><td data-th="תאריך"><bdi>${esc(isoToHe(x.date))}</bdi></td><td data-th="מה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section, x.url)}</td></tr>`).join('')
		+ `</tbody></table></div></div>`;
	// 6. What to do now.
	out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">מה עושים עכשיו</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ol class="${P}-list">${checklist(reg, r).map((x) => `<li>${esc(x.he)}${cite(x.section, x.url)}</li>`).join('')}</ol></div>`;
	// 7. What changed and when.
	const hist = ml.history.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
	out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-hist-h">מה השתנה ומתי</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-hist-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתאריך</th><th scope="col">מה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ hist.map((x) => `<tr><td data-th="מתאריך"><bdi>${esc(isoToHe(x.date))}</bdi></td><td data-th="מה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section, x.url)}</td></tr>`).join('')
		+ `</tbody></table></div></div>`;
	const info = r.flags.filter((x) => x.level === 'info');
	if (info.length) { out += `<div class="jtool-tablewrap ${P}-p-no"><div class="jtool-tablewrap__head"><h3 id="${P}-info-h">עוד לפני שמגישים</h3></div><ul class="${P}-info">${info.map((x) => `<li>${esc(x.he)}</li>`).join('')}</ul></div>`; }
	return out;
}

/** Page section: the reward by monthly income, for 30 days of service, from the same engine. */
export function incomeTable(reg) {
	const ml = reg.rights_miluim;
	const list = [6000, 8000, 12000, 15000, 20000, 30000, 40000, 51910, 60000];
	const rows = byIncome(reg, EXAMPLE, list).map((x) => `<tr><td data-th="הכנסה חודשית ברוטו">${ilsn(x.wage)}</td><td data-th="ליום">${ilsn(x.daily)}${x.daily >= ml.pay.max_daily ? ' (מקסימום)' : x.atMin ? ' (מינימום)' : ''}</td><td data-th="30 ימי שירות (30.8 לתשלום)">${ilsn(x.total)}</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>תגמול מילואים לשכיר לפי הכנסה קבועה ב-3 החודשים, מ-${esc(isoToHe(ml.from))}: ליום ול-30 ימי שירות (30.8 ימים לתשלום עם התוספת). מינימום ${esc(nis(ml.pay.min_daily))} ומקסימום ${esc(nis(ml.pay.max_daily))} ליום.</caption><thead><tr><th scope="col">הכנסה חודשית ברוטו</th><th scope="col">ליום</th><th scope="col">30 ימי שירות (30.8 לתשלום)</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the 40% addition, service days to days paid, as the Institute's own table. */
export function additionTable(reg) {
	const ml = reg.rights_miluim;
	const rows = ml.addition.table.slice(0, 12).map(([d]) => { const x = paidDays(ml, d); return `<tr><td data-th="ימי שירות">${num(d, 0)}</td><td data-th="ימים לתשלום">${num(x.paid, Number.isInteger(x.paid) ? 0 : 1)}</td><td data-th="התוספת">${x.add ? `+${num(x.add, Number.isInteger(x.add) ? 0 : 1)}` : '—'}</td></tr>`; }).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>התוספת לימי השירות (${esc(ml.addition.section)}): ${esc(ml.addition.he)}.</caption><thead><tr><th scope="col">ימי שירות</th><th scope="col">ימים לתשלום</th><th scope="col">התוספת</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the 2026 grants by tier for 30, 45, 60 and 90 days (no family facts). */
export function grantsTable(reg) {
	const ml = reg.rights_miluim;
	const g = ml.grants;
	const list = [30, 45, 60, 90];
	const rows = TIERS.map((t) => `<tr><td data-th="מדרג">${esc(g.tier_he[t])}</td>${list.map((n) => { const x = grantsFor(ml, t, n, 0, false, false); return `<td data-th="${n} ימים">${ilsn(x.cash)}${x.cashLow !== x.cash ? ` <span class="${P}-or">(או ${esc(nis(x.cashLow))})</span>` : ''}${x.other ? ` + ${esc(nis(x.other))}` : ''}</td>`; }).join('')}</tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מענקי צה"ל ל-${g.year} בכסף לפי מדרג וימי שירות בשנה, בלי ילדים ובלי ימי צו 8 קודמים; אחרי הפלוס: שובר נופש וארנק דיגיטלי. ${esc(g.budget_he)}.</caption><thead><tr><th scope="col">מדרג</th>${list.map((n) => `<th scope="col">${n} ימים</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** The reader's income as the tool read it: the monthly wage, the 3 months of the basis, or the minimum. */
function incomeHe(r) {
	if (!r.needsIncome) { return 'התגמול המזערי'; }
	return r.wageMode === 'same' ? `${money(r.six[r.six.length - 1], 0)} ₪ ברוטו בחודש` : `${money(r.base.sum, 0)} ₪ ב-3 החודשים של הבסיס`;
}
const PAYER_LINE = { employer: 'המעסיק משלם עם השכר, והביטוח הלאומי מחזיר לו', claim: 'הביטוח הלאומי משלם, בתביעה אישית', self: 'הביטוח הלאומי משלם, בדרך כלל אוטומטית', institute: 'הביטוח הלאומי משלם' };

/** The result-first card at the top of the page ([justice_tool_lead]): the total of the example (or of the reader's own
 * answers once they change anything), the reward a day, one line of why, and a jump to the form. Same markup on the server
 * and in the browser, so the card never shifts the layout when the script takes over. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הנתונים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">תגמול מילואים</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const label = `${opts.example ? 'דוגמה מחושבת' : 'החישוב שלכם'}: תגמול מילואים, סך הכול ברוטו`;
	const prot = r.status !== 'employee' ? '' : r.after ? ` אסור לפטר בלי היתר מוועדת התעסוקה עד ${isoToHe(r.p30.to)}${r.extOn ? `, ועד ${isoToHe(r.extTo)} רק מטעמים מיוחדים` : ''}.` : ' אסור לפטר בלי היתר בימי השירות עצמם.';
	const one = r.tier && r.grants.length === 1 ? r.grants[0] : null;
	const grants = one && one.cash > 0 ? ` מענקי צה"ל ב${tierHe(reg, one.tier)}: עוד ${one.cashLow !== one.cash ? `${money(one.cashLow, 0)} עד ${nis(one.cash)}` : nis(one.cash)}.` : '';
	const line = `${STATUS_LABEL[r.status]}, ${incomeHe(r)}, ${r.days} ימי שירות (${isoToHe(r.start)} עד ${isoToHe(r.end)})${r.comp ? `, כולל פיצוי לעצמאי של ${nis(r.comp)}` : ''}. ${PAYER_LINE[r.payer]}.${prot}${grants}`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${ilsn(r.total)}</strong><span class="jtool-lead__unit">${ilsn(r.daily)} ליום · <bdi>${dn(r.pd.paid)}</bdi> ימים לתשלום</span></p>`
		+ `<p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

/** The scenario for the simulation: the tool's figures and choices only, never a name, an ID or an employer. */
export function scenarioText(reg, r) {
	if (!r.ok) { return ''; }
	const res = `לפי החישוב לפי חוק הביטוח הלאומי: תגמול של ${nis(r.daily)} ליום, ${dn(r.pd.paid)} ימים לתשלום עם התוספת, ${nis(r.total)} ברוטו${r.comp ? ` (כולל פיצוי לעצמאי של ${nis(r.comp)})` : ''}; ${PAYER_LINE[r.payer]}.`;
	let prot = '';
	let ask = 'אני רוצה להתכונן לשיחה עם פקיד התביעות בביטוח הלאומי על חישוב התגמול, ולהבין מה לבדוק ואילו מסמכים להביא.';
	if (r.status === 'employee') {
		prot = r.extOn ? `אסור לפטר אותי בלי היתר מוועדת התעסוקה עד ${isoToHe(r.p30.to)}, ועד ${isoToHe(r.extTo)} רק מטעמים מיוחדים שאינם קשורים לשירות.`
			: r.after ? `אסור לפטר אותי בלי היתר מוועדת התעסוקה עד ${isoToHe(r.p30.to)}.` : 'השירות היה קצר: אסור לפטר בלי היתר רק בימי השירות עצמם, ופיטורים בגלל המילואים בטלים תמיד.';
		ask = 'אני רוצה להתכונן לדיון בוועדת התעסוקה, אם המעסיק יבקש היתר לפטר אותי אחרי המילואים, ולשיחה עם המעסיק על החזרה לעבודה: מה לטעון ואילו מסמכים להביא.';
	}
	const svc = `שירות מילואים של ${r.days} ימים, ${isoToHe(r.start)} עד ${isoToHe(r.end)}${Number(r.prior) ? `, אחרי ${r.prior} ימי מילואים קודמים באותה שנה` : ''}${r.emergency ? ', בצו 8' : ''}.`;
	return `תגמולי מילואים והגנה מפיטורים. ${STATUS_LABEL[r.status]}, ${incomeHe(r)}. ${svc} ${res}${prot ? ` ${prot}` : ''} ${ask}`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const ml = reg.rights_miluim;
	const btl = reg.rights_btl;
	const p = ml.pay;
	const pr = ml.protect;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.total,
		sticky: ilsn(r.total),
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>הבסיס: השכר ב-3 החודשים ${monthHe(r.months[3])} עד ${monthHe(r.months[5])}, <bdi>${money(r.base.sum, 0)} ÷ ${p.quarter_divisor} = ${money(r.base.daily)}</bdi> ₪ ליום${cite(p.section_base, ml.law_url)}${cite('סכום התגמול', p.url)}</li>`
			+ `<li>המינימום והמקסימום: <bdi>${money(btl.basic_amount[p.basic_key], 0)} × ${p.min_pct}% ÷ ${p.divisor_month} = ${money(p.min_daily)}</bdi> ו-<bdi>${money(btl.basic_amount[p.basic_key], 0)} × ${p.max_mult} ÷ ${p.divisor_month} = ${money(p.max_daily)}</bdi> ₪ ליום מ-${isoToHe(p.from)}; ${money(r.daily)} ₪ ביניהם${cite(p.section_max, ml.law_url)}</li>`
			+ `<li>הימים: ${r.days} ימי שירות = ${r.pd.weeks} שבועות ועוד ${r.pd.rem}; <bdi>${r.pd.weeks} × 7 + ${r.pd.rem} × 1.4 = ${dn(r.pd.paid)}</bdi> ימים לתשלום${cite(ml.addition.section, ml.law_url)}</li>`
			+ `<li>התגמול: <bdi>${money(r.daily)} × ${dn(r.pd.paid)} = ${money(r.total)}</bdi> ₪ ברוטו; המעסיק ממשיך לשלם את השכר במועד הרגיל, והמוסד מחזיר לו את התגמול${cite(ml.payer.section, ml.law_url)}${cite(ml.payer.transfer_section, ml.law_url)}</li>`
			+ `<li>ההגנה: אסור לפטר בזמן השירות, ובשירות של יותר מיומיים גם 30 ימים אחריו, עד ${isoToHe(r.p30.to)}${cite(pr.after_section, pr.law_url)}; מי שצבר 60 ימים בשנה ושירת 7 ימים ברצף מוגן גם בימים 31 עד 60${cite(pr.order.section, pr.order.url)}</li>`
			+ `<li>מעבר לתגמול: מענקי צה"ל לפי מדרג וימי השירות בשנה${cite('מדיניות 2026', ml.grants.url)}, ו-${r.points} נקודות זיכוי ב-${r.taxYear} על ${r.yearDays} ימים ב-${r.svcYear}, במדרגים א'+, א' ו-ב'${cite('סעיף 39ב', ml.tax.url)}</li></ol>`,
		compare_table: incomeTable(reg) + additionTable(reg) + grantsTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

export function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const radio = (name, d) => { const el = root.querySelector(`input[name="${P}-${name}"]:checked`); return el ? el.value : d; };
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const int = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : (/^\d+$/.test(v) ? Number(v) : NaN); };
	return {
		status: radio('st', 'employee'), wageMode: radio('wm', 'same'), wage: m('wage'), wages: [0, 1, 2, 3, 4, 5].map((i) => m(`w${i}`)),
		employerPays: on('ep'), short60: on('sh'), stopped: on('sp'), start: toIso(val(`#${P}-start`)), end: toIso(val(`#${P}-end`)),
		prior: int('prior'), emergency: on('em'), prevEnd: toIso(val(`#${P}-pe`)), prevWage: m('pw'), tier: radio('tr', ''), old8: int('o8'),
		kid14: on('kd'), special: on('sf'),
	};
}

const SC = { employee: 'e', self: 's', student: 't', none: 'n' };
const keyOf = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
const n2 = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : String(v));
export function stateOf(i) {
	const each = i.wageMode === 'each';
	const income = i.status === 'employee' || i.status === 'self' || (i.status === 'none' && i.stopped === true);
	return encodeState({
		k: SC[i.status] || 'e', m: income && each ? 'x' : '', w: income && !each ? n2(i.wage) : '', x: income && each ? (i.wages || []).map(n2).join('~') : '',
		p: i.status === 'employee' && i.employerPays === false ? 0 : '', h: i.status === 'employee' && i.short60 ? 1 : '', o: i.status === 'none' && i.stopped ? 1 : '',
		s: i.start, e: i.end, r: Number(i.prior) ? i.prior : '', g: i.emergency ? 1 : '', v: i.prevEnd || '', q: n2(i.prevWage),
		t: TIERS.includes(i.tier) ? i.tier : '', c: Number(i.old8) ? i.old8 : '', j: i.kid14 ? 1 : '', z: i.special ? 1 : '',
	});
}
export const KEYS = ['k', 'm', 'w', 'x', 'p', 'h', 'o', 's', 'e', 'r', 'g', 'v', 'q', 't', 'c', 'j', 'z'];
export function inputOf(s) {
	if (!s.s || !s.e || !s.k) { return null; }
	const num1 = (v) => (v === undefined || v === '' ? '' : Number(v));
	const each = s.m === 'x';
	return {
		status: keyOf(SC, s.k, 'employee'), wageMode: each ? 'each' : 'same', wage: each ? '' : num1(s.w), wages: each && s.x ? s.x.split('~').map((v) => (v === '' ? '' : Number(v))) : [],
		employerPays: s.p !== '0', short60: s.h === '1', stopped: s.o === '1', start: s.s, end: s.e, prior: s.r ? Number(s.r) : 0,
		emergency: s.g === '1', prevEnd: s.v || '', prevWage: num1(s.q), tier: TIERS.includes(s.t) ? s.t : '', old8: s.c ? Number(s.c) : 0,
		kid14: s.j === '1', special: s.z === '1',
	};
}

const band = (r) => (!r.ok ? 'error' : `${r.status}-${r.atMax ? 'max' : r.atMin || !r.needsIncome ? 'min' : 'mid'}`);

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const ml = reg.rights_miluim;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	const serverRehearse = root.querySelector('.jtool-next a[data-act="rehearse"]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(ml.checked_on, ml.refresh_every_days) || (ml.next_update && today >= ml.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהסכומים או המענקים התעדכנו'); }
	}
	const wireRehearse = () => {
		if (!serverRehearse) { return; }
		root.querySelectorAll(`[data-${P}-rehearse]`).forEach((a) => { a.setAttribute('href', serverRehearse.getAttribute('href')); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener'); });
	};
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
		const st = (root.querySelector(`input[name="${P}-st"]:checked`) || {}).value || 'employee';
		const stopped = Boolean(root.querySelector(`input[name="${P}-sp"]:checked`));
		const income = st === 'employee' || st === 'self' || (st === 'none' && stopped);
		form.querySelectorAll('[data-if-income]').forEach((el) => { el.hidden = !income; });
		form.querySelectorAll('[data-if-emp]').forEach((el) => { el.hidden = st !== 'employee'; });
		form.querySelectorAll('[data-if-none]').forEach((el) => { el.hidden = st !== 'none'; });
		form.querySelectorAll('[data-if-st]').forEach((el) => { el.hidden = (el.getAttribute('data-if-st') === 'self') !== (st === 'self'); });
		const wm = (root.querySelector(`input[name="${P}-wm"]:checked`) || {}).value || 'same';
		form.querySelectorAll('[data-if-wm]').forEach((el) => { el.hidden = el.getAttribute('data-if-wm') !== wm; });
		const startIso = toIso((root.querySelector(`#${P}-start`) || {}).value || '');
		if (/^\d{4}-\d{2}-\d{2}$/.test(startIso)) {
			const names = basisMonths(startIso).map(monthHe);
			form.querySelectorAll('[data-w]').forEach((el) => { const l = el.querySelector('label'); if (l) { l.textContent = names[Number(el.getAttribute('data-w'))]; } });
		}
		const now = readForm(root);
		form.querySelectorAll('[data-profile]').forEach((b) => { b.setAttribute('aria-pressed', sameInput(now, PROFILES[b.getAttribute('data-profile')].input) ? 'true' : 'false'); });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		wireRehearse();
		if (sticky) { sticky.innerHTML = r.ok ? ilsn(r.total) : '—'; }
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
	const load = (input) => { own = true; form.innerHTML = renderForm(reg, input); sync(); run(input); };
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	} else {
		wireRehearse();
	}
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	// The card's jump: to the form, first field focused (the page anchor is the fallback without the script).
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
		const prof = ev.target.closest('[data-profile]');
		if (prof && PROFILES[prof.getAttribute('data-profile')]) {
			if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
			clearTimeout(timer); timer = null;
			load(PROFILES[prof.getAttribute('data-profile')].input);
			track('tool_profile', { tool_id: TOOL_ID, type: prof.getAttribute('data-profile') });
			return;
		}
		const btn = ev.target.closest('[data-act]');
		if (!btn) { return; }
		const act = btn.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			download('tagmulei-miluim.ics', 'text/calendar;charset=utf-8', ics(r.deadlines.map((d) => ({ date: d.date, summary: `מילואים: ${d.he}` })), new Date().toISOString()));
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
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(ml.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? (r.status !== 'employee' ? 'institute' : r.extOn ? 'ext' : r.after ? 'after' : 'short') : 'error' });
			if (r.ok && openSimulation(scenarioText(reg, r), 'court_rehearsal', btn.getAttribute('href'))) { ev.preventDefault(); toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.'); }
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { load(s); }
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
