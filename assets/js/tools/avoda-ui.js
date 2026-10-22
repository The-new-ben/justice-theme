/**
 * The road-accident and personal-injury wave UI (22.10.2026, HAD-591): the work-injury journey (teunat-avoda, prefix jt61)
 * on /work-accident-guide/. The picture is a benefit ledger along a time axis, the way the National Insurance Institute pays
 * it: the injury day (the employer pays), the days that are not paid, the injury-allowance days to the 91st, then the
 * medical committee and what follows it, a one-off grant or a monthly pension; under it two gauges with the 2026 ceilings
 * drawn as lines (1,314.25 a day, 39,428 a month). The axis has a one-sentence text equivalent and a ledger table. Under it:
 * is it a work accident (the presumptions and the exceptions, each with its section), the dates (.ics), the degree table,
 * what changed and when, the scenario for the simulation (the medical committee) and the next steps; a one-page summary
 * prints on its own. stateLink() builds a link into this tool with the reader's numbers for the sibling instruments.
 */
import { compute, avBand, avDegree, avFull, avWhole, AV_WHERE, AV_ISSUES } from './avoda-engine.js';
import { addDays } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'teunat-avoda';
export const PAGE = '/work-accident-guide/';
const P = 'jt61';
const AV_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=witness_prep&topic=personal-injury';
const AV_ROAD_PAGE = '/israel-road-accident-compensation-law/';
const AV_WEIGH_PAGE = '/regulations-insurance-1956/';

/** One click to a full profile; every date is relative to the reference day (today in the browser, 22.10.2026 on the server). */
export const PRESETS = {
	m1: { he: 'שכיר · 12,000 ₪ · 45 ימים · 15% לצמיתות', kind: 'employee', wage: 12000, days: 45, back: 234, degree: 15, stable: true, decisionBack: 17, where: 'work' },
	short: { he: 'שכירה · 9,000 ₪ · 10 ימי היעדרות', kind: 'employee', wage: 9000, days: 10, back: 20, where: 'work' },
	self: { he: 'עצמאי · 20,000 ₪ · 91 ימים · 25%', kind: 'self', wage: 20000, days: 91, back: 150, degree: 25, stable: true, decisionBack: 10, where: 'work' },
	way: { he: 'תאונת דרכים בדרך לעבודה · 30 ימים', kind: 'employee', wage: 10000, days: 30, back: 60, where: 'way', road: true },
	high: { he: 'שכר 60,000 ₪ · 91 ימים · 100% זמנית', kind: 'employee', wage: 60000, days: 91, back: 120, degree: 100, stable: false, where: 'work' },
};
const AV_BLANK = { kind: 'employee', injury: '', age: '', wage: '', quarter: '', days: '', partDays: '', partHours: '', where: 'work', road: false, issues: [], degree: '', stable: true, reg15: '', tempTo: '', decision: '', appealDecision: '', rejection: '', claimDate: '' };
/** A preset on a reference day: the injury `back` days before it, the committee decision `decisionBack` days before it. */
export function avPreset(key, ref) {
	const p = PRESETS[key];
	if (!p) { return null; }
	return Object.assign({}, AV_BLANK, {
		kind: p.kind, wage: p.wage, days: p.days, where: p.where, road: Boolean(p.road), degree: p.degree ?? '', stable: p.stable !== false,
		injury: addDays(ref, -p.back), decision: p.decisionBack ? addDays(ref, -p.decisionBack) : '',
	});
}
export const EXAMPLE = avPreset('m1', '2026-10-22');
const presetOf = (i) => Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return p.kind === i.kind && String(p.wage) === String(i.wage) && String(p.days) === String(i.days) && p.where === i.where && String(p.degree ?? '') === String(i.degree ?? '') && (p.stable !== false) === (i.stable !== false); }) || '';

const nis = (n) => `${money(n, avWhole(n) ? 0 : 2)} ₪`;
const amt = (n) => ils(n, avWhole(n) ? 0 : 2);
const pctHe = (n) => `${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`;
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const kindHe = (r) => (r.kind === 'self' ? 'עובד עצמאי' : 'עובד שכיר');
const daysHe = (n) => (n === 1 ? 'יום אחד' : `${n} ימים`);
const stableHe = (stable) => (stable ? 'לצמיתות' : 'זמנית');
const WHERE_HE = { work: 'בזמן העבודה', way: 'בדרך לעבודה או ממנה', break: 'בהפסקת אוכל', rescue: 'בזמן הצלה או מניעת נזק', other_person: 'מפגיעה של אדם אחר במקום העבודה', committee: 'בתפקיד בוועד העובדים' };
const ISSUE_HE = { deviation: 'בדרך הייתה עצירה או סטייה של ממש', devok: 'הסטייה הייתה כדי ללוות ילד או לתפילת בוקר', gross: 'רשלנות פושעת בדרך', breach: 'רשלנות נגד הוראות בטיחות או המעסיק', unregistered: 'עצמאי שלא היה רשום בביטוח הלאומי' };
const avIso = (text) => { const raw = String(text || '').trim(); if (!raw) { return ''; } const m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/); if (!m) { return raw; } const y = Number(m[3]) < 100 ? 2000 + Number(m[3]) : Number(m[3]); return `${y}-${String(m[2]).padStart(2, '0')}-${String(m[1]).padStart(2, '0')}`; };

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const av = reg.injury_avoda;
	const i = Object.assign({}, AV_BLANK, input || {});
	const preset = presetOf(i);
	const date = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 2.3.2026" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const num = (id, label, v, ph, hint, suffix) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label>${suffix ? '<div class="jtool-input jtool-input--money">' : ''}<input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v === '' || v === undefined || v === null ? '' : v)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${suffix ? `<span class="jtool-input__suffix" aria-hidden="true">${suffix}</span></div>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const issues = Array.isArray(i.issues) ? i.issues : [];
	const moreOpen = Boolean(i.quarter || i.partDays || issues.length || i.age);
	const afterOpen = Boolean(i.degree !== '' && i.degree !== undefined && i.degree !== null) || Boolean(i.reg15);
	const datesOpen = Boolean(i.appealDecision || i.rejection || i.claimDate);
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא את כל השדות לפי היום; אפשר לשנות כל שדה.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>מי נפגע</legend><div class="jtool-chips">${chip('kind', 'employee', 'עובד שכיר', i.kind !== 'self')}${chip('kind', 'self', 'עובד עצמאי', i.kind === 'self')}</div></fieldset>`
		+ `<div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-where">איפה קרתה התאונה</label><select id="${P}-where">${AV_WHERE.map((w) => `<option value="${w}"${i.where === w ? ' selected' : ''}>${esc(WHERE_HE[w])}</option>`).join('')}</select></div>`
		+ `<div class="jtool-field"><span class="jtool-label">רכב</span><div class="jtool-chips">${chip('road', '1', 'תאונת דרכים (היה מעורב רכב)', Boolean(i.road), 'checkbox')}</div></div></div>`
		+ `<div class="jtool-row">${date('inj', 'יום הפגיעה', i.injury, '')}${num('days', 'ימי אי-כושר אחרי יום הפגיעה', i.days, 'לדוגמה: 45', 'לפי התעודות הרפואיות')}</div>`
		+ `<div class="jtool-row">${num('wage', 'שכר חודשי ממוצע ב-3 החודשים שלפני (ברוטו)', i.wage === '' ? '' : money(i.wage, 0), 'לא חובה', 'החייב בדמי ביטוח, כולל שעות נוספות ומענקים', '₪')}</div>`
		+ `<details class="jtool-more ${P}-more"${moreOpen ? ' open' : ''}><summary>עוד פרטים: גיל, הכנסה מדויקת, אי-כושר חלקי, חריגים</summary>`
		+ `<div class="jtool-row">${num('age', 'הגיל ביום הפגיעה', i.age, 'לא חובה', `מתחת לגיל ${av.disability.young_age} המענק מחושב אחרת`)}${num('q', 'ההכנסה ב-3 החודשים, סך הכול', i.quarter === '' ? '' : money(i.quarter, 0), 'ריק = השכר × 3', 'אם ידוע, גובר על השכר החודשי', '₪')}</div>`
		+ `<div class="jtool-row">${num('pd', 'ימים של אי-כושר חלקי (עבודה בשעות מצומצמות)', i.partDays, '0', '')}${num('ph', 'שעות אי-כושר ביום', i.partHours, `עד ${av.allowance.partial_hours}`, '')}</div>`
		+ `<fieldset class="jtool-field"><legend>האם קרה אחד מאלה (חריגים בחוק)</legend><div class="jtool-chips ${P}-issues">${AV_ISSUES.map((x) => chip('iss', x, ISSUE_HE[x], issues.includes(x), 'checkbox')).join('')}</div></fieldset></details>`
		+ `<details class="jtool-more ${P}-after"${afterOpen ? ' open' : ''}><summary>אחרי הוועדה הרפואית: אחוז הנכות ותקנה 15</summary>`
		+ `<div class="jtool-row">${num('deg', 'אחוז הנכות שקבעה הוועדה', i.degree, 'לדוגמה: 15', 'לפי המבחנים, לפני תקנה 15')}${num('r15', 'תקנה 15: בכמה הוועדה הגדילה (% מהדרגה)', i.reg15, '0', `עד ${av.regs.reg15.max_share} (עד מחצית)`)}</div>`
		+ `<fieldset class="jtool-field"><legend>סוג הדרגה</legend><div class="jtool-chips">${chip('st', 'p', 'לצמיתות (יציבה)', i.stable !== false)}${chip('st', 't', 'זמנית', i.stable === false)}</div></fieldset>`
		+ `<div class="jtool-row" data-if-temp${i.stable === false ? '' : ' hidden'}>${date('tt', 'הדרגה הזמנית עד', i.tempTo, '')}</div></details>`
		+ `<details class="jtool-more ${P}-dates"${datesOpen ? ' open' : ''}><summary>מועדים: החלטות, דחייה, הגשת התביעה</summary>`
		+ `<div class="jtool-row">${date('dec', 'קיבלתי את החלטת הוועדה הרפואית ב-', i.decision, `ממנו נספרים ${av.regs.reg27.days} הימים לערר`)}${date('adec', 'קיבלתי את החלטת הוועדה לעררים ב-', i.appealDecision, '')}</div>`
		+ `<div class="jtool-row">${date('rej', 'תאריך מכתב דחייה מפקיד התביעות', i.rejection, '')}${date('cd', 'הגשתי את התביעה לנכות ב-', i.claimDate, 'לבדיקת איחור')}</div></details>`;
}

/** The ledger of the time axis: each stretch of days with who pays and how much, then the committee and the benefit. */
export function ledger(reg, r) {
	const A = reg.injury_avoda.allowance;
	const rows = [];
	const pd = r.pd;
	if (r.kind === 'employee') { rows.push({ kind: 'day0', days: 1, label: 'יום הפגיעה', note: `המעסיק משלם את שכר היום (${A.injury_day_section})`, amount: null }); } else { rows.push({ kind: 'day0', days: 1, label: 'יום הפגיעה', note: 'לא משולם', amount: null }); }
	if (pd.waiting) { rows.push({ kind: 'wait', days: pd.waiting, label: pd.waiting === 1 ? 'יום 1' : `ימים 1 עד ${pd.waiting}`, note: `לא משולמים: פחות מ-${A.waiting_unless_days} ימי אי-כושר (${A.waiting_section})`, amount: null }); }
	if (pd.selfFirst) { rows.push({ kind: 'self', days: pd.selfFirst, label: `ימים ${pd.waiting + 1} עד ${pd.waiting + pd.selfFirst}`, note: `לא משולמים לעצמאי (${A.self_first_section})`, amount: null }); }
	if (pd.paid) { rows.push({ kind: 'paid', days: pd.paid, label: pd.paid === 1 ? `יום ${pd.first}` : `ימים ${pd.first} עד ${pd.last}`, note: r.daily ? `${pd.paid} × ${nis(r.daily.daily)} (${A.section})${r.kind === 'employee' && pd.paid >= A.first_period_days ? `; את ${A.first_period_days} הימים הראשונים המעסיק מחזיר לביטוח הלאומי (${A.first_period_section})` : ''}` : `${daysHe(pd.paid)} של דמי פגיעה (${A.section})`, amount: r.allowance }); }
	if (pd.within < A.max_days) { rows.push({ kind: 'rest', days: A.max_days - pd.within, label: `ימים ${pd.within + 1} עד ${A.max_days}`, note: 'לא נוצלו: דמי פגיעה רק בעד ימי אי-כושר', amount: null }); }
	if (r.partial) { rows.push({ kind: 'partial', days: r.partial.used, label: 'אי-כושר חלקי', note: r.partial.perDay !== null ? `${r.partial.used} × ${nis(r.partial.perDay)} (${r.partial.hoursUsed} שעות × שמינית, ${A.partial_section})${r.partial.unclear ? `; ${r.partial.unclear} מהימים אולי לא משולמים, ולכן מ-${nis(r.partial.low)}` : ''}` : `${r.partial.used} ימים (${A.partial_section})`, amount: r.partial.amount }); }
	return rows;
}

/** The picture: the injury-allowance window on a time axis, the steps after it, and the two 2026 ceilings as lines. */
export function axis(reg, r) {
	if (!r.ok) { return ''; }
	const A = reg.injury_avoda.allowance;
	const D = reg.injury_avoda.disability;
	const rows = ledger(reg, r).filter((x) => x.kind !== 'partial');
	const label = { day0: r.kind === 'employee' ? 'המעסיק' : '', wait: 'לא משולם', self: 'לא משולם', paid: 'דמי פגיעה', rest: `עד יום ${A.max_days}` };
	const segs = rows.map((x) => `<span class="${P}-seg ${P}-seg--${x.kind}" style="flex-grow:${x.kind === 'day0' ? 4 : x.days}"><b>${x.kind === 'day0' ? 'יום 0' : `<bdi>${x.days}</bdi>`}</b><small>${esc(label[x.kind])}</small></span>`).join('');
	const steps = [];
	if (r.degree) {
		steps.push(`<li class="${P}-step"><b>הוועדה הרפואית</b><small><bdi>${pctHe(r.degree.final)}</bdi> ${stableHe(r.stable)}</small></li>`);
		if (r.benefit === 'grant') { steps.push(`<li class="${P}-step ${P}-step--grant"><b>${r.grant !== null ? `מענק ${amt(r.grant)}` : 'מענק חד-פעמי'}</b><small>${D.grant_months} קצבאות חודשיות (${esc(D.grant_section)})</small></li>`); }
		if (r.benefit === 'pension') { steps.push(`<li class="${P}-step ${P}-step--pension"><b>${r.monthly !== null ? `קצבה ${amt(r.monthly)} לחודש` : 'קצבה חודשית'}</b><small>${r.stable ? 'כל חודש, ב-28 בחודש' : 'לתקופת הדרגה הזמנית'}</small></li>`); }
		if (r.benefit === 'none') { steps.push(`<li class="${P}-step ${P}-step--none"><b>לא משולם</b><small>פחות מ-${r.stable ? D.grant_min : D.temp_min}%; אפשר לערור</small></li>`); }
	} else {
		steps.push(`<li class="${P}-step ${P}-step--open"><b>הוועדה הרפואית</b><small>אם נשארה נכות: תביעה ${esc(reg.injury_avoda.forms.disability.code)}</small></li>`);
		steps.push(`<li class="${P}-step ${P}-step--open"><b>מענק או קצבה</b><small>${D.grant_min}% עד פחות מ-${D.pension_min}% לצמיתות: מענק; ${D.pension_min}% ומעלה: קצבה</small></li>`);
	}
	const gauge = (title, value, cap, capHe) => {
		const w = Math.max(2, Math.min(100, value / cap * 100));
		return `<div class="${P}-gauge"><p class="${P}-gauge__t">${esc(title)}: <strong>${amt(value)}</strong></p><div class="${P}-gauge__bar"><span class="${P}-gauge__fill" style="width:${w.toFixed(1)}%"></span><span class="${P}-gauge__cap" title="${esc(capHe)}"></span></div><p class="${P}-gauge__cap-l">${esc(capHe)}</p></div>`;
	};
	const gauges = [];
	if (r.daily) { gauges.push(gauge('דמי פגיעה ליום', r.daily.daily, A.max_daily, `התקרה: ${nis(A.max_daily)} ליום מ-${isoToHe(A.max_daily_from)}`)); }
	if (r.full !== null && r.full !== undefined) { gauges.push(gauge('קצבה לנכות של 100%', r.full, D.max_monthly, `התקרה: ${nis(D.max_monthly)} לחודש מ-${isoToHe(D.max_monthly_from)}`)); }
	const parts = [`יום הפגיעה ${isoToHe(r.injury)}`];
	if (r.pd.waiting) { parts.push(`${daysHe(r.pd.waiting)} לא משולמים`); }
	if (r.pd.selfFirst) { parts.push(`${r.pd.selfFirst} ימים ראשונים לא משולמים לעצמאי`); }
	parts.push(r.pd.paid ? `${daysHe(r.pd.paid)} של דמי פגיעה${r.allowance !== null ? `, ${nis(r.allowance)}` : ''} עד ${isoToHe(r.allowanceEnd)}` : 'אין ימים של דמי פגיעה');
	if (r.degree) { parts.push(`ואחרי הוועדה ${pctHe(r.degree.final)} ${stableHe(r.stable)}: ${r.benefit === 'grant' ? `מענק${r.grant !== null ? ` ${nis(r.grant)}` : ''}` : r.benefit === 'pension' ? `קצבה${r.monthly !== null ? ` ${nis(r.monthly)} לחודש` : ''}` : 'לא משולם'}`); }
	const ledgerRows = ledger(reg, r).map((x) => `<tr class="${P}-l--${x.kind}"><td data-th="תקופה">${esc(x.label)}</td><td data-th="מה משולם">${esc(x.note)}</td><td data-th="סכום">${x.amount !== null && x.amount !== undefined ? amt(x.amount) : '—'}</td></tr>`).join('');
	return `<figure class="${P}-axis"><figcaption class="${P}-axis__h">המסלול על ציר הזמן: מיום הפגיעה ועד המענק או הקצבה</figcaption>`
		+ `<p class="jtool-visually-hidden">${esc(`${parts.join('; ')}.`)}</p>`
		+ `<div class="${P}-track" aria-hidden="true"><div class="${P}-days">${segs}</div><ol class="${P}-steps">${steps.join('')}</ol></div>`
		+ (gauges.length ? `<div class="${P}-gauges">${gauges.join('')}</div>` : '')
		+ `<div class="jtool-scroll" role="region" aria-label="פנקס התשלומים" tabindex="0"><table class="jtool-table ${P}-ledger"><thead><tr><th scope="col">תקופה</th><th scope="col">מה משולם</th><th scope="col">סכום</th></tr></thead><tbody>${ledgerRows}</tbody></table></div></figure>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const A = reg.injury_avoda.allowance;
	const head = `${kindHe(r)} שנפגע ${WHERE_HE[r.where]} ב-${isoToHe(r.injury)}, ${daysHe(r.days)} של אי-כושר אחרי יום הפגיעה.`;
	const ia = r.daily ? ` דמי פגיעה: ${A.pct}% מ-${nis(r.daily.base)} ליום${r.daily.capped ? ', עד התקרה' : ''} = ${nis(r.daily.daily)} ליום, בעד ${daysHe(r.pd.paid)}: ${nis(r.allowance)} ברוטו (${A.section}).` : ` דמי פגיעה בעד ${daysHe(r.pd.paid)}; הסכום לפי השכר שתזינו (${A.section}).`;
	let dis = '';
	if (r.degree) {
		const d = r.degree;
		const what = r.benefit === 'grant' ? `מענק חד-פעמי${r.grant !== null ? ` של ${nis(r.grant)}` : ''}` : r.benefit === 'pension' ? `קצבה${r.monthly !== null ? ` של ${nis(r.monthly)}` : ''} בחודש` : 'לא משולם מענק ולא קצבה';
		dis = ` נכות ${stableHe(r.stable)} של ${pctHe(d.final)}${d.share ? ` (כולל תקנה 15)` : ''}: ${what}.`;
	}
	const acc = r.accident.status === 'no' ? ' שימו לב: סומן חריג שבו החוק לא רואה בתאונה תאונת עבודה.' : '';
	return `${head}${ia}${dis}${acc}`;
}

/** The scenario for the simulation: computed facts only, never a name, an ID or an address. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const G = reg.injury_avoda.regs;
	const money1 = r.daily ? ` דמי הפגיעה חושבו כ-${nis(r.daily.daily)} ליום, ${nis(r.allowance)} בעד ${daysHe(r.pd.paid)}.` : '';
	const dis = r.degree ? ` הוועדה הרפואית קבעה ${pctHe(r.degree.final)} ${stableHe(r.stable)}, ${r.benefit === 'grant' ? `שמזכים במענק${r.grant !== null ? ` של ${nis(r.grant)}` : ''}` : r.benefit === 'pension' ? `שמזכים בקצבה${r.monthly !== null ? ` של ${nis(r.monthly)} בחודש` : ''}` : 'פחות מהסף לתשלום'}.` : ' עוד לא נקבעה דרגת נכות.';
	return `${kindHe(r)} נפגע בתאונת עבודה ${WHERE_HE[r.where]} ולא עבד ${daysHe(r.days)}.${money1}${dis} השאלה לתרגול: ההופעה בפני הוועדה הרפואית של הביטוח הלאומי. איך מתארים את המגבלות בעבודה ובבית, אילו מסמכים מביאים, מתי מבקשים להתחשב במקצוע לפי תקנה 15, ומה עושים אם צריך לערור בתוך ${G.reg27.days} יום?`;
}

/** The "what to do now" list: the official route first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const av = reg.injury_avoda;
	const out = [];
	const arar = r.events.find((e) => e.key === 'arar');
	if (arar) { out.push({ he: `ערר על החלטת הוועדה הרפואית עד ${isoToHe(arar.date)} (${av.regs.reg27.section}), בכתב ובנימוקים`, url: av.pages.wd_arar }); }
	if (r.rejection) { out.push({ he: `על דחייה: ועדת התביעות (${av.forms.claims_committee.code}) או בית הדין לעבודה; ${av.help.aid_he}`, url: av.pages.claims_committee }); }
	out.push({ he: `תביעה לדמי פגיעה (${av.forms.claim.code}) עם התעודה הרפואית הראשונה, עד ${isoToHe(r.claimBy)}`, url: av.pages.ia_claim });
	out.push(r.kind === 'self' ? { he: `לטיפול רפואי: הפניה לעצמאי (${av.forms.referral_self.code})`, url: av.forms.referral_self.url } : { he: `לבקש מהמעסיק טופס ${av.forms.referral.code} לטיפול רפואי בקופת החולים`, url: av.forms.referral.url });
	if (!r.degree || r.pd.over) { out.push({ he: `נשארה נכות או עברו ${av.allowance.max_days} ימים: תביעה לקביעת דרגת נכות מעבודה (${av.forms.disability.code})`, url: av.pages.wd_claim }); }
	out.push({ he: `${av.help.yad_he}, ${av.help.yad_phone}`, url: av.pages.wd_committee });
	const links = [];
	if (r.road) { links.push({ path: '/combined-road-work-accident-benefits/', he: 'תאונת דרכים שהיא גם תאונת עבודה: מה מנוכה ממה' }); }
	if (r.degree && r.degree.share) { links.push({ path: '/functional-disability-increase-half/', he: 'תקנה 15: הגדלת הנכות עד מחצית' }); }
	if (r.benefit === 'grant' || r.benefit === 'pension') { links.push({ path: '/grant-versus-pension-work-disability/', he: 'מענק או קצבה: מה ההבדל ומתי עוברים' }); }
	links.push({ path: '/committee-work-disability-degree/', he: 'הוועדה הרפואית לנכות מעבודה: איך מתכוננים' });
	links.push({ path: '/injury-allowance-2026-rates/', he: 'דמי פגיעה: השיעור והתקרה' });
	links.push({ path: weighLink(reg, r), he: 'כמה ליקויים: איך משקללים את אחוזי הנכות' });
	return { official: out, links: links.slice(0, 4) };
}

/** The link into the road-accident tool with the numbers that apply there (s.80(1) + the road law): the injury date, the
 * monthly income, the age and the committee's degree by the criteria (before reg. 15, which is a work-injury rule). The
 * road tool's own keys (teuna-ui.js stateOf: t accident, c income, a age, d disability, w work). */
export function roadLink(reg, r) {
	if (!r.ok) { return AV_ROAD_PAGE; }
	const s = encodeState({ t: r.injury, w: 1, c: r.wage !== null ? Math.round(r.wage) : '', a: r.age !== null ? r.age : '', d: r.degree && r.stable ? r.degree.base : '' });
	return `${AV_ROAD_PAGE}#s=${s}`;
}

/** The link into the weighting tool with the committee's degree as one free item, so the reader adds the other impairments
 * there; the tool's own keys (shiklul-ui.js stateOf: k 's' stable / 't' temporary, i items "code_pct_side_prev_a_b" with
 * code 'f' = a free %, r 'x' + x the reg. 15 share, a age, d the day's injury allowance, j the injury day, v the decision
 * received). Without a degree, the page opens as it is. */
export function weighLink(reg, r) {
	if (!r.ok || !r.degree) { return AV_WEIGH_PAGE; }
	const d = r.degree;
	const s = encodeState({ k: r.stable ? 's' : 't', i: [['f', String(d.base), 'r', '', '', '']], r: d.share ? 'x' : '', x: d.share || '', a: r.age !== null ? r.age : '', d: r.daily ? r.daily.daily : '', j: r.injury, v: r.decision || '' });
	return `${AV_WEIGH_PAGE}#s=${s}`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const av = reg.injury_avoda;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	const st = r.accident.status;
	const state = st === 'no' ? '<p class="jtool-state jtool-state--danger">! סומן חריג: לפי החוק ייתכן שזו לא תאונת עבודה (פרטים למטה)</p>' : st === 'check' ? '<p class="jtool-state jtool-state--warn">? צריך לבדוק אם החזקה חלה (פרטים למטה)</p>' : `<p class="jtool-state jtool-state--ok">✓ ${esc(r.accident.circ.he.split(',')[0])}: ${esc(r.accident.circ.section)} לחוק הביטוח הלאומי</p>`;
	const fig = r.allowance !== null ? amt(r.allowance) : `<bdi>${r.pd.paid}</bdi> ימים`;
	const rows = [];
	if (r.daily) { rows.push(`<div><dt>דמי פגיעה ליום</dt><dd>${amt(r.daily.daily)}${r.daily.capped ? ' (התקרה)' : ''}</dd></div>`); }
	rows.push(`<div><dt>ימים בתשלום</dt><dd><bdi>${r.pd.paid}</bdi> מתוך <bdi>${r.days}</bdi></dd></div>`);
	if (r.partial && r.partial.amount !== null) { rows.push(`<div><dt>דמי פגיעה מופחתים</dt><dd>${r.partial.unclear ? `${amt(r.partial.low)} עד ` : ''}${amt(r.partial.amount)}</dd></div>`); }
	if (r.degree) {
		rows.push(`<div><dt>דרגת הנכות</dt><dd><bdi>${pctHe(r.degree.final)}</bdi> ${stableHe(r.stable)}</dd></div>`);
		if (r.benefit === 'grant' && r.grant !== null) { rows.push(`<div><dt>מענק חד-פעמי</dt><dd>${amt(r.grant)}</dd></div>`); }
		if (r.benefit === 'pension' && r.monthly !== null) { rows.push(`<div><dt>קצבה חודשית</dt><dd>${amt(r.monthly)}</dd></div>`); }
		if (r.full !== null && r.benefit !== 'none') { rows.push(`<div><dt>קצבה לנכות של 100%</dt><dd>${amt(r.full)}</dd></div>`); }
	}
	rows.push(`<div><dt>תביעה עד</dt><dd><bdi>${isoToHe(r.claimBy)}</bdi></dd></div>`);
	const flags = r.flags.filter((f) => f.code !== 'presumption');
	const roadBox = r.road ? `<div class="${P}-road"><h4>גם חוק פיצויים לנפגעי תאונות דרכים</h4><p>${esc(av.road.deduct_he)} (${esc(av.road.deduct_section)}).</p><a class="jtool-btn" href="${esc(roadLink(reg, r))}" data-${P}-road>לחשב לפי חוק הפיצויים, עם הנתונים האלה</a></div>` : '';
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}דמי פגיעה, ${esc(kindHe(r))}${r.daily ? `, ${esc(nis(r.daily.daily))} ליום` : ''}</p>`
		+ `<strong class="jtool-verdict__figure">${fig}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ axis(reg, r)
		+ (flags.length ? `<ul class="jtool-flags ${P}-flags">${flags.map((f) => `<li class="${P}-flag ${P}-flag--${f.level}">${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul>` : '')
		+ roadBox
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${AV_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את הוועדה הרפואית עם הנתונים שלכם</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** What each degree pays, at the reader's wage and at the maximum: the law's thresholds with the 2026 ceilings. */
export function degreeTable(reg, r) {
	const D = reg.injury_avoda.disability;
	const av = reg.injury_avoda;
	const daily = r && r.ok && r.daily ? r.daily : null;
	const full = daily ? avFull(reg, daily) : null;
	const max = D.max_monthly;
	const cell = (deg, stable, base) => {
		const d = avDegree(reg, deg, stable, 0);
		if (d.kind === 'none') { return 'לא משולם'; }
		if (base === null) { return d.kind === 'grant' ? 'מענק' : 'קצבה'; }
		const m = Math.round(base * d.final) / 100;
		return d.kind === 'grant' ? `מענק ${nis(Math.round(m * D.grant_months * 100) / 100)}` : `${nis(m)} לחודש`;
	};
	const rows = [5, 9, 10, 15, 19, 20, 25, 30, 50, 75, 100].map((deg) => `<tr><td data-th="דרגה"><bdi>${deg}%</bdi></td><td data-th="לצמיתות${full !== null ? `, שכר ${money(r.quarter / 3, 0)} ₪` : ''}">${esc(cell(deg, true, full))}</td><td data-th="לצמיתות, בתקרה">${esc(cell(deg, true, max))}</td><td data-th="זמנית${full !== null ? `, שכר ${money(r.quarter / 3, 0)} ₪` : ''}">${esc(cell(deg, false, full))}</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable ${P}-degrees"><caption>מה משולם לפי דרגת הנכות מעבודה: פחות מ-${D.grant_min}% כלום; דרגה יציבה של ${D.grant_min}% עד פחות מ-${D.pension_min}% מענק של ${D.grant_months} קצבאות; ${D.pension_min}% ומעלה, או דרגה זמנית של ${D.temp_min}% ומעלה, קצבה חודשית (סעיפים 104 עד 107 ל${esc(av.law.he)}). קצבה של 100% היא דמי הפגיעה ליום כפול ${D.full_days}, עד ${nis(max)} לחודש מ-${isoToHe(D.max_monthly_from)}${full !== null ? `; בשכר של ${nis(r.quarter / 3)} היא ${nis(full)}` : ''}. לפני תקנה 15 ולפני העיגול של תקנה 19א.</caption><thead><tr><th scope="col">דרגה</th><th scope="col">לצמיתות${full !== null ? `, שכר ${money(r.quarter / 3, 0)} ₪` : ''}</th><th scope="col">לצמיתות, בתקרה</th><th scope="col">זמנית${full !== null ? `, שכר ${money(r.quarter / 3, 0)} ₪` : ''}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** What changed and when: only values an official text dates. */
export function changesTable(reg) {
	const av = reg.injury_avoda;
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ av.changes.map((x) => `<tr><td data-th="מתי"><bdi>${isoToHe(x.date)}</bdi></td><td data-th="מה השתנה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section, x.url)}</td></tr>`).join('')
		+ '</tbody><caption>רק ערכים שפורסמו בנוסח רשמי, עם תאריך התחילה שלהם (הערות התיקון בנוסח שמפרסם הביטוח הלאומי).</caption></table></div>';
}

function datesTable(reg, r, opts = {}) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = opts.today && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.he)}</td><td data-th="הכלל">${cite(e.section, e.url)}</td></tr>`; }).join('')
		+ `</tbody><caption>מועד אחרון שחל ביום מנוחה עובר ליום שאחריו (${esc(reg.injury_avoda.deadlines.interpretation_he)}).</caption></table></div>`;
}

function methodList(reg, r) {
	const av = reg.injury_avoda;
	const A = av.allowance;
	const D = av.disability;
	const items = [];
	if (r.quarter !== null) {
		items.push(`השכר הרגיל ליום: ${r.quarterFromTotal ? `ההכנסה ב-3 החודשים, ${nis(r.quarter)}` : `${nis(r.quarter / 3)} × 3 = ${nis(r.quarter)}`}, חלקי ${A.quarter_days} = ${nis(r.daily.base)} (${A.base_section})`);
		items.push(`דמי פגיעה ליום: ${A.pct}% × ${nis(r.daily.base)} = ${nis(r.daily.raw)}${r.daily.capped ? `, יותר מהתקרה: ${nis(A.max_daily)}` : ''} (${A.section}; התקרה ${A.cap_pct}% מהסכום הבסיסי ${money(reg.rights_btl.basic_amount.b1, 0)} ₪ × ${A.cap_multiple} ÷ ${A.cap_divisor} = ${nis(A.max_daily)})`);
	}
	items.push(`הימים: ${r.days} ימי אי-כושר; עד ${A.max_days} (${A.max_section})${r.pd.waiting ? `; פחות מ-${A.waiting_unless_days}, ולכן ${r.pd.waiting} הראשונים לא משולמים (${A.waiting_section})` : ''}${r.pd.selfFirst ? `; עצמאי: ${r.pd.selfFirst} הימים הראשונים לא משולמים (${A.self_first_section})` : ''}: ${r.pd.paid} ימים בתשלום`);
	if (r.allowance !== null) { items.push(`דמי הפגיעה: ${r.pd.paid} × ${nis(r.daily.daily)} = ${nis(r.allowance)} ברוטו; ${A.deductions_he}`); }
	if (r.partial && r.partial.amount !== null) { items.push(`אי-כושר חלקי: ${r.partial.used} ימים × ${nis(r.daily.daily)} ÷ ${A.partial_hours} × ${r.partial.hoursUsed} שעות = ${nis(r.partial.amount)} (${A.partial_section})${r.partial.unclear ? `; אם ${r.partial.unclear} הימים הראשונים שלו לא משולמים (${[r.partial.waitLeft ? A.waiting_section : '', r.partial.selfLeft ? A.self_first_section : ''].filter(Boolean).join(', ')}): ${nis(r.partial.low)}` : ''}`); }
	if (r.degree) {
		const d = r.degree;
		if (d.share) { items.push(`תקנה 15: ${d.base}% × (1 + ${d.share}%) = ${d.capped ? `${Math.round(d.base * (1 + d.share / 100) * 100) / 100}%, ובדרגה של פחות מ-${av.regs.reg15.grant_cap_below}% עד ${av.regs.reg15.grant_cap}%: ${d.beforeRound}%` : `${d.beforeRound}%`} (${av.regs.reg15.section})`); }
		if (d.rounded) { items.push(`עיגול כלפי מעלה של דרגה שמזכה בקצבה: ${d.beforeRound}% → ${d.final}% (${av.regs.reg19a.section})`); }
		if (r.full !== null) { items.push(`קצבה לנכות של 100%: ${r.daily.capped ? `בתקרה, ${nis(D.max_monthly)}` : `${nis(r.daily.daily)} × ${D.full_days} = ${nis(r.full)}`} (${D.full_section})`); }
		if (r.monthly !== null && r.benefit !== 'none') { items.push(`לפי הדרגה: ${nis(r.full)} × ${d.final}% = ${nis(r.monthly)} לחודש (${D.pension_section})`); }
		if (r.benefit === 'grant' && r.grant !== null) { items.push(r.young && r.young.applies ? `נפגע לפני גיל ${D.young_age}: כאילו השכר הוא השכר הממוצע ${nis(r.young.avg)}: 100% = ${nis(r.young.full)}, × ${d.final}% = ${nis(r.young.monthly)}, × ${D.grant_months} = ${nis(r.grant)} (${D.young_section})` : `מענק: ${nis(r.monthly)} × ${D.grant_months} = ${nis(r.grant)} (${D.grant_section})`); }
		if (r.benefit === 'none') { items.push(`${d.final}% ${stableHe(r.stable)}: פחות מ-${r.stable ? D.grant_min : D.temp_min}%, לא משולם (${D.entitle_section})`); }
	}
	items.push(`התביעה: ${av.deadlines.claim_months} חודשים מיום הפגיעה, עד ${isoToHe(r.claimBy)} (${av.deadlines.claim_section} ודפי הביטוח הלאומי)`);
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

function rulesList(reg) {
	const av = reg.injury_avoda;
	const a = av.accident;
	return `<ul class="${P}-list"><li>${esc(a.work_he)}.${cite(a.work_section, av.law.url)}</li>`
		+ a.circumstances.filter((c) => c.code !== 'work').map((c) => `<li>${esc(c.he)}.${cite(c.section, av.law.url)}</li>`).join('')
		+ `<li>${esc(a.btl_more_he)}.${cite('דף הביטוח הלאומי', av.pages.what_is)}</li>`
		+ `<li>${esc(a.deviation.he)}. ${esc(a.deviation.ok_he)}.${cite(`${a.deviation.section}, ${a.deviation.ok_section}`, av.law.url)}</li>`
		+ `<li>${esc(a.gross.he)}.${cite(a.gross.section, av.law.url)}</li>`
		+ `<li>${esc(a.breach.he)}.${cite(a.breach.section, av.law.url)}</li>`
		+ `<li>${esc(a.self_registered.he)}.${cite(a.self_registered.section, av.law.url)}</li>`
		+ `<li>${esc(a.hernia_he)}. ${esc(a.hearing_he)}. ${esc(a.disease_he)}.${cite('סעיפים 84, 84א, 85', av.law.url)}</li></ul>`;
}

/** The one-page print: inputs, result, the computation path, the dates, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const av = reg.injury_avoda;
	return '<h3>תאונת עבודה: סיכום החישוב</h3>'
		+ `<p><strong>הנתונים:</strong> ${esc(kindHe(r))}; ${esc(WHERE_HE[r.where])}${r.road ? ', תאונת דרכים' : ''}; יום הפגיעה ${isoToHe(r.injury)}; ${r.days} ימי אי-כושר${r.quarter !== null ? `; הכנסה ב-3 החודשים ${esc(nis(r.quarter))}` : ''}${r.degree ? `; נכות ${esc(pctHe(r.degree.base))} ${stableHe(r.stable)}${r.degree.share ? `, תקנה 15: ${r.degree.share}%` : ''}` : ''}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p>${methodList(reg, r)}`
		+ `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.he)}`).join('; ')}.</p>`
		+ `<p><strong>מקורות:</strong> ${esc(av.law.he)}, ${esc(av.law.chapter_he)} וסעיפים 296, 328א; ${esc(av.regs.he)}; דפי המוסד לביטוח לאומי: ${esc(av.allowance.max_daily_he)}, ${esc(av.disability.max_monthly_he)}; הסכום הבסיסי והשכר הממוצע 2026 (נבדק ${isoToHe(reg.rights_btl.checked_on)}). נבדק ${isoToHe(av.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי; את הזכאות קובע הביטוח הלאומי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const av = reg.injury_avoda;
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חושב, צעד אחר צעד</h3></div>${methodList(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${datesTable(reg, r, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-deg-h">מה משולם לפי דרגת הנכות</h3></div>${degreeTable(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-acc-h">מתי זו תאונת עבודה, ומתי לא</h3></div>${rulesList(reg)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-more-h">עוד כללים שחשוב להכיר</h3></div><ul class="${P}-list">`
		+ `<li>${esc(av.allowance.sick_days_he)}; ${esc(av.allowance.deductions_he)}.${cite('דף הביטוח הלאומי', av.pages.ia_rate)}</li>`
		+ `<li>${esc(av.allowance.employer_reg22_he)}.${cite('תקנה 22', av.pages.ia_period)}</li>`
		+ `<li>${esc(av.regs.reg36.he)}.${cite(av.regs.reg36.section, av.regs.url)}</li>`
		+ `<li>${esc(av.combine.he)}.${cite(av.combine.section, av.combine.url)}</li>`
		+ `<li>${esc(av.third_party.he)}; ${esc(av.third_party.on_account_he)}.${cite(av.third_party.section, av.third_party.url)}</li>`
		+ `<li>${esc(av.help.advance_he)}; ${esc(av.help.fee_he)}.${cite('דף הביטוח הלאומי', av.pages.fee_limit)}</li></ul></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || av.checked_on)}</div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): the injury allowance of the example (or of the
 * reader once they change anything), the grant or pension after the committee and the claim date, and a jump to the form.
 * Same markup on the server and in the browser, so the card never shifts the layout. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הנתונים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">דמי פגיעה ונכות מעבודה</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}${kindHe(r)}${r.quarter !== null ? `, ${nis(r.quarter / 3)} בחודש` : ''}, ${daysHe(r.days)} של אי-כושר`;
	const fig = r.allowance !== null ? amt(r.allowance) : `<bdi>${r.pd.paid}</bdi>`;
	const unit = r.allowance !== null ? `דמי פגיעה ל-${daysHe(r.pd.paid)} · ${nis(r.daily.daily)} ליום` : 'ימים של דמי פגיעה';
	const after = r.degree ? ` אחרי הוועדה: ${pctHe(r.degree.final)} ${stableHe(r.stable)} = ${r.benefit === 'grant' ? `מענק${r.grant !== null ? ` ${nis(r.grant)}` : ''}` : r.benefit === 'pension' ? `קצבה${r.monthly !== null ? ` ${nis(r.monthly)} לחודש` : ''}` : 'לא משולם'}.` : '';
	const line = `${reg.injury_avoda.allowance.pct}% מהשכר הרגיל, עד ${nis(reg.injury_avoda.allowance.max_daily)} ליום (סעיף 97).${after} תביעה עד ${isoToHe(r.claimBy)}.${r.accident.status === 'no' ? ' סומן חריג: ייתכן שזו לא תאונת עבודה.' : ''}`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${fig}</strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const av = reg.injury_avoda;
	const A = av.allowance;
	const D = av.disability;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.allowance,
		sticky: amt(r.allowance),
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>השכר הרגיל ליום: ${money(EXAMPLE.wage, 0)} ₪ × 3 ÷ ${A.quarter_days} = ${nis(r.daily.base)}${cite(A.base_section, av.law.url)}</li>`
			+ `<li>דמי פגיעה ליום: ${A.pct}% = ${nis(r.daily.daily)}, עד ${nis(A.max_daily)} מ-${isoToHe(A.max_daily_from)}${cite(A.section, A.max_daily_url)}</li>`
			+ `<li>${r.days} ימי אי-כושר, ${A.waiting_unless_days} לפחות, ולכן משולמים מהיום שאחרי הפגיעה: ${r.pd.paid} × ${nis(r.daily.daily)} = ${nis(r.allowance)}${cite(`${A.max_section}, ${A.waiting_section}`, av.pages.ia_period)}</li>`
			+ `<li>קצבה של 100%: ${nis(r.daily.daily)} × ${D.full_days} = ${nis(r.full)}; ${r.degree.final}% לצמיתות = ${nis(r.monthly)}${cite(`${D.full_section}, ${D.pension_section}`, D.max_monthly_url)}</li>`
			+ `<li>דרגה יציבה של ${D.grant_min}% עד פחות מ-${D.pension_min}%: מענק של ${D.grant_months} קצבאות, ${nis(r.grant)}${cite(D.grant_section, D.max_monthly_url)}</li></ol>`,
		compare_table: degreeTable(reg, r),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

const KIND_CODE = { employee: 'w', self: 's' };
const WHERE_CODE = { work: 'w', way: 'y', break: 'b', rescue: 'r', other_person: 'o', committee: 'c' };
const ISSUE_CODE = { deviation: 'd', devok: 'o', gross: 'g', breach: 'b', unregistered: 'u' };
const keyOf = (map, v) => Object.keys(map).find((k) => map[k] === v);
export const KEYS = ['k', 't', 'a', 'w', 'q', 'n', 'p', 'h', 'l', 'r', 'i', 'd', 's', 'e', 'm', 'x', 'j', 'u', 'c'];
export function stateOf(i) {
	return encodeState({
		k: KIND_CODE[i.kind] || 'w', t: i.injury || '', a: i.age, w: i.wage === '' || i.wage === undefined || i.wage === null ? '' : Math.round(Number(i.wage)),
		q: i.quarter === '' || i.quarter === undefined || i.quarter === null ? '' : Math.round(Number(i.quarter)), n: i.days, p: i.partDays, h: i.partHours,
		l: WHERE_CODE[i.where] || 'w', r: i.road ? 1 : '', i: (i.issues || []).map((x) => ISSUE_CODE[x] || '').join(''), d: i.degree,
		s: i.stable === false ? 't' : (i.degree === '' || i.degree === undefined || i.degree === null ? '' : 'p'), e: i.reg15, m: i.decision || '',
		x: i.appealDecision || '', j: i.rejection || '', u: i.tempTo || '', c: i.claimDate || '',
	});
}
/** Reverse of stateOf. A sibling's link may carry only part of the state (the degree from the weighting tool, the injury
 * day and the wage from the road tool): with a `base` profile, only what the computation needs and the link lacks (the
 * injury day, the wage, the days, the kind, the place) comes from it, and `filled` names those fields; every other field
 * the link does not name stays empty. Without a base, the link must carry the injury day. */
const AV_FILL = { injury: 't', wage: 'w', days: 'n' };
export function inputOf(s, base) {
	if (!s || !KEYS.some((k) => s[k] !== undefined && s[k] !== '')) { return null; }
	if (!s.t && !base) { return null; }
	const n = (v) => (v === undefined || v === '' ? '' : Number(v));
	const has = (k) => s[k] !== undefined && s[k] !== '';
	const b = Object.assign({}, AV_BLANK, base ? { kind: base.kind, injury: base.injury, wage: base.wage, days: base.days, where: base.where } : {});
	const filled = base ? Object.keys(AV_FILL).filter((f) => !has(AV_FILL[f])) : [];
	return Object.assign({}, b, {
		kind: has('k') ? (keyOf(KIND_CODE, s.k) || 'employee') : b.kind, injury: s.t || b.injury, age: has('a') ? n(s.a) : b.age,
		wage: has('w') ? n(s.w) : b.wage, quarter: has('q') ? n(s.q) : b.quarter, days: has('n') ? n(s.n) : b.days,
		partDays: has('p') ? n(s.p) : b.partDays, partHours: has('h') ? n(s.h) : b.partHours, where: has('l') ? (keyOf(WHERE_CODE, s.l) || 'work') : b.where,
		road: has('r') ? s.r === '1' : b.road, issues: has('i') ? String(s.i).split('').map((c) => keyOf(ISSUE_CODE, c)).filter(Boolean) : b.issues,
		degree: has('d') ? n(s.d) : b.degree, stable: has('s') ? s.s !== 't' : true, reg15: has('e') ? n(s.e) : b.reg15,
		decision: s.m || '', appealDecision: s.x || '', rejection: s.j || '', tempTo: s.u || '', claimDate: s.c || '', filled,
	});
}
/** The link the sibling instruments build into this tool: '/work-accident-guide/#s=<state>' (numbers and dates only). */
export function stateLink(reg, input) {
	return `${PAGE}#s=${stateOf(Object.assign({}, AV_BLANK, input || {}))}`;
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const amtOf = (id) => { const v = String(val(id)).replace(/[,\s₪]/g, ''); return v === '' ? '' : Number(v); };
	return {
		kind: pick('kind', 'employee'), where: val('where') || 'work', road: Boolean(root.querySelector(`input[name="${P}-road"]:checked`)),
		injury: avIso(val('inj')), days: amtOf('days'), wage: amtOf('wage'), age: amtOf('age'), quarter: amtOf('q'), partDays: amtOf('pd'), partHours: amtOf('ph'),
		issues: [...root.querySelectorAll(`input[name="${P}-iss"]:checked`)].map((x) => x.value),
		degree: amtOf('deg'), stable: pick('st', 'p') !== 't', reg15: amtOf('r15'), tempTo: avIso(val('tt')),
		decision: avIso(val('dec')), appealDecision: avIso(val('adec')), rejection: avIso(val('rej')), claimDate: avIso(val('cd')),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const av = reg.injury_avoda;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(av.checked_on, av.refresh_every_days) || (av.next_update && today >= av.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהתקרות התעדכנו ב-1 בינואר'); }
	}
	const ids = { injury: 'inj', age: 'age', wage: 'wage', quarter: 'q', days: 'days', partDays: 'pd', partHours: 'ph', degree: 'deg', reg15: 'r15', decision: 'dec', appealDecision: 'adec', rejection: 'rej', tempTo: 'tt', claimDate: 'cd' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const id = ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = (input) => {
		form.querySelectorAll('[data-if-temp]').forEach((el) => { el.hidden = input.stable !== false; });
		const key = presetOf(input);
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok && r.allowance !== null ? amt(r.allowance) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: avBand(r) }); }
		return r;
	};
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = readForm(root); sync(input); run(input); }, 160);
	};
	// A share link may name its tool (/@teunat-avoda); on a page with several tools only this tool reads it. A sibling's link
	// may carry only part of the state (the degree from the weighting tool): the rest comes from today's example profile.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const state = decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS);
	// The reader's own link names this tool and carries the whole state; a sibling's link carries part of it.
	const fromHash = shareOwner === TOOL_ID ? inputOf(state) : !shareOwner ? inputOf(state, avPreset('m1', today)) : null;
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync(fromHash);
		run(fromHash, { silent: true });
		const FILL_HE = { injury: 'יום הפגיעה', wage: 'השכר', days: 'ימי אי-כושר' };
		if (fromHash.filled && fromHash.filled.length) { toast(root, `נפתח עם הנתונים מהכלי הקודם. ${fromHash.filled.map((f) => FILL_HE[f]).join(', ')}: מהדוגמה, ואפשר לשנות.`); }
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector(`.${P}-preset, input:not([type="radio"]):not([type="checkbox"])`);
			if (first) { setTimeout(() => first.focus({ preventScroll: true }), 350); }
			track('tool_lead_click', { tool_id: TOOL_ID });
		});
	}
	root.addEventListener('click', async (ev) => {
		const road = ev.target.closest(`[data-${P}-road]`);
		if (road) { track('tool_crosslink', { tool_id: TOOL_ID, band: 'teunat-drachim' }); return; }
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'preset') {
			const input = avPreset(b.getAttribute('data-preset'), today);
			if (!input) { return; }
			own = true;
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		const input = readForm(root);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok) {
			download('teunat-avoda.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `תאונת עבודה: ${e.he}`, description: `${e.section}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
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
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(av.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: avBand(r) });
			const brief = r.ok ? aiBrief(reg, r) : '';
			const purpose = (/purpose=([a-z_]+)/.exec(b.getAttribute('href') || '') || [])[1] || 'witness_prep';
			if (brief && openSimulation(brief, purpose, b.getAttribute('href'))) {
				ev.preventDefault();
				toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.');
			} else {
				if (brief) { copyText(brief); }
				toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			}
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { own = true; form.innerHTML = renderForm(reg, s); sync(s); run(s); }
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
