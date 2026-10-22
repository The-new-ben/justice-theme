/**
 * The road-accident and personal-injury wave UI (22.10.2026, HAD-591): the injured person's clock (shaon-nezikin, prefix
 * jt63) on /tort-lawyer/. The picture is the clock itself, drawn as two ribbons: the first 30 days, one cell a day from the
 * injury, with the steps that have a date pinned to their day and today ruled; and the long ribbon from the injury to the
 * last day to sue, with the policy's limitation, the National Insurance deadlines and today as numbered marks on it. Both
 * have a text equivalent. Under them: the first-30-days checklist (each step with its kind: a duty of law, a right, a
 * condition of a benefit, the Institute's procedure or practical advice), who pays, which court, the fee caps, the rules of
 * the clock, what changed and when, the scenario for the simulation and the next steps; a one-page summary prints on its own.
 */
import { shCompute, shBand, SH_SUBS } from './shaon-engine.js';
import { addDays, addMonths, daysBetween, parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'shaon-nezikin';
export const PAGE = '/tort-lawyer/';
const P = 'jt63';
const SH_SIM = (purpose) => `https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=${purpose}&topic=personal-injury`;
const SH_ROAD_PAGE = '/israel-road-accident-compensation-law/';
const SH_WORK_PAGE = '/work-accident-guide/';
const SH_DIS_PAGE = '/regulations-insurance-1956/';

/** One click to a full profile, each relative to today: the injury so many days ago. */
export const PRESETS = {
	road: { he: 'תאונת דרכים · בנסיעה ברכב · לפני שבועיים', type: 'road', role: 'passenger', back: 14, age: 34, job: 'employee' },
	commute: { he: 'בדרך לעבודה · בנהיגה · שכירים', type: 'both', role: 'driver', back: 5, age: 41, job: 'employee' },
	work: { he: 'תאונת עבודה · עצמאים', type: 'work', back: 20, age: 46, job: 'self' },
	fall: { he: 'החלקה בחנות · יש ביטוח תאונות אישיות', type: 'other', sub: 'fall', back: 10, age: 52, job: 'employee', policy: 'accident' },
	minor: { he: 'פגיעה בגיל 12 · ברגל, מרכב', type: 'road', role: 'pedestrian', back: 30, age: 12, birthMonths: 149, job: 'none' },
};
const SH_BLANK = { type: 'road', role: 'passenger', hitrun: false, sub: 'fall', injury: '', today: '', age: '', birth: '', job: 'employee', discovered: '', policy: 'none', policyRight: '', docs: '', demand: '', decision: '', decisionDate: '', amount: '' };
/** A preset applied on a day: the injury `back` days before it. */
export function shPreset(key, today) {
	const p = PRESETS[key];
	if (!p) { return null; }
	const injury = addDays(today, -p.back);
	return Object.assign({}, SH_BLANK, { type: p.type, role: p.role || 'passenger', sub: p.sub || 'fall', job: p.job, policy: p.policy || 'none', age: p.age, injury, today, birth: p.birthMonths ? addMonths(injury, -p.birthMonths) : '' });
}
export const EXAMPLE = shPreset('road', '2026-10-22');

const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text || 'מקור')}</a>` : '');
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const shIso = (text) => { const raw = String(text || '').trim(); return raw ? (parseDate(raw) || raw) : ''; };
const TYPE_HE = { road: 'תאונת דרכים', work: 'תאונת עבודה', both: 'תאונת דרכים שהיא גם תאונת עבודה', other: 'פגיעה אחרת', malpractice: 'טיפול רפואי' };
const ROLE_HE = { driver: 'בנהיגה', passenger: 'בנסיעה ברכב', pedestrian: 'ברגל, מרכב' };
const SUB_HE = { fall: 'נפילה או החלקה', assault: 'תקיפה', dog: 'נשיכת כלב', student: 'תלמידים: ביטוח התלמידים', other: 'פגיעה אחרת' };
const KIND_HE = { law: 'חובה או מועד בחוק', right: 'זכות שלכם', condition: 'תנאי לזכאות', procedure: 'הנוהל של הגוף', advice: 'עצה מעשית' };
const typeLabel = (r) => (r.type === 'other' ? SUB_HE[r.sub] : `${TYPE_HE[r.type]}${r.type === 'road' || r.type === 'both' ? `, ${ROLE_HE[r.role]}` : ''}`);
const dayHe = (n) => (n === 1 ? 'יום אחד' : `${n} ימים`);

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, SH_BLANK, input || {});
	const preset = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return /^\d{4}-\d{2}-\d{2}$/.test(i.today || '') && i.injury === addDays(i.today, -p.back) && p.type === i.type && String(p.age) === String(i.age) && (p.role || 'passenger') === i.role && (p.policy || 'none') === i.policy && p.job === i.job; }) || '';
	const date = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 8.10.2026" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const num = (id, label, v, ph, hint, suffix) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label>${suffix ? '<div class="jtool-input jtool-input--money">' : ''}<input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v === '' || v === undefined || v === null ? '' : v)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${suffix ? `<span class="jtool-input__suffix" aria-hidden="true">${suffix}</span></div>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const sel = (id, label, v, opts, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><select id="${P}-${id}" aria-describedby="${P}-${id}-e">${opts.map(([val, l]) => `<option value="${esc(val)}"${String(v) === val ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint">${esc(hint)}</p>` : ''}</div>`;
	const road = i.type === 'road' || i.type === 'both';
	const minor = i.age !== '' && Number(i.age) < 18;
	const more = Boolean(i.discovered || i.policy !== 'none' || i.demand || i.decision || i.amount);
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא את כל השדות לפי היום; אפשר לשנות כל שדה.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>איך קרתה הפגיעה</legend><div class="jtool-chips">${chip('type', 'road', 'תאונת דרכים', i.type === 'road')}${chip('type', 'work', 'תאונת עבודה', i.type === 'work')}${chip('type', 'both', 'תאונת דרכים בדרך לעבודה או בעבודה', i.type === 'both')}${chip('type', 'other', 'פגיעה אחרת: נפילה, תקיפה, כלב', i.type === 'other')}${chip('type', 'malpractice', 'טיפול רפואי', i.type === 'malpractice')}</div></fieldset>`
		+ `<div data-if-road${road ? '' : ' hidden'}><fieldset class="jtool-field"><legend>איפה הייתם בתאונה</legend><div class="jtool-chips">${chip('role', 'driver', 'בנהיגה', i.role === 'driver')}${chip('role', 'passenger', 'בנסיעה ברכב', i.role === 'passenger')}${chip('role', 'pedestrian', 'ברגל, מרכב שפגע', i.role === 'pedestrian')}</div></fieldset>`
		+ `<div class="jtool-chips ${P}-checks">${chip('hit', '1', 'הנהג לא ידוע, לרכב אין ביטוח, או שהמבטח בפירוק', Boolean(i.hitrun), 'checkbox')}</div></div>`
		+ `<div class="jtool-row" data-if-other${i.type === 'other' ? '' : ' hidden'}>${sel('sub', 'סוג הפגיעה', i.sub, SH_SUBS.map((s) => [s, { fall: 'נפילה או החלקה (רחוב, חנות, בניין)', assault: 'תקיפה', dog: 'נשיכת כלב', student: 'תלמיד או תלמידה (ביטוח התלמידים)', other: 'אחר' }[s]]))}</div>`
		+ `<div class="jtool-row">${date('inj', 'יום הפגיעה', i.injury, 'היום שבו קרתה התאונה או הפגיעה')}${num('age', 'הגיל ביום הפגיעה', i.age, 'לדוגמה: 34', 'עד גיל 18 ההתיישנות לא רצה')}</div>`
		+ `<div class="jtool-row" data-if-minor${minor ? '' : ' hidden'}>${date('birth', 'תאריך לידה', i.birth, 'רק לקטין: מכאן נספרות שבע השנים')}</div>`
		+ `<fieldset class="jtool-field"><legend>עבודה ביום הפגיעה</legend><div class="jtool-chips">${chip('job', 'employee', 'שכירים', i.job === 'employee')}${chip('job', 'self', 'עצמאים', i.job === 'self')}${chip('job', 'none', 'לא עובדים', i.job === 'none')}</div><p class="jtool-hint">קובע את הטפסים ואת דמי הביטוח הלאומי.</p></fieldset>`
		+ `<details class="jtool-more ${P}-more"${more ? ' open' : ''}><summary>פרטים שמזיזים מועדים: גילוי מאוחר, פוליסה, דרישה, החלטה, סכום</summary>`
		+ `<div class="jtool-row">${date('disc', 'הנזק התגלה רק ביום', i.discovered, 'אם התגלה אחרי יום הפגיעה (סעיף 89(2) לפקודת הנזיקין)')}${num('amt', 'סכום התביעה המשוער', i.amount === '' ? '' : money(i.amount, 0), 'לא חובה', 'לבחירת בית המשפט ולתקרת שכר הטרחה', '₪')}</div>`
		+ `<div class="jtool-row">${sel('pol', 'פוליסה פרטית שלכם', i.policy, [['none', 'אין, או לא רלוונטי'], ['accident', 'ביטוח תאונות אישיות (3 שנים)'], ['health', 'ביטוח בריאות, אשפוז או סיעודי (5 שנים)']])}${date('pright', 'היום שבו קמה הזכות לפי הפוליסה', i.policyRight, 'בנכות: לפי תנאי הפוליסה; ריק = יום הפגיעה')}${date('docs', 'המבטח קיבל את התביעה והמסמכים ב', i.docs, 'מכאן 30 ימים לתשלום')}</div>`
		+ `<div class="jtool-row" data-if-road${road ? '' : ' hidden'}>${date('dem', 'נשלחה דרישה בכתב לתשלום תכוף ב', i.demand, 'מכאן 60 ימים')}</div>`
		+ `<div class="jtool-row">${sel('dec', 'התקבלה החלטה של הביטוח הלאומי', i.decision, [['', 'לא'], ['medical', 'ועדה רפואית (דרג ראשון), נפגעי עבודה'], ['appeals', 'ועדה רפואית לעררים, נפגעי עבודה'], ['clerk', 'פקיד תביעות: דחייה או החלטה אחרת']])}${date('decd', 'ההחלטה התקבלה ביום', i.decisionDate, '')}</div>`
		+ '</details>';
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return r.outOfScope ? r.errors[0].he : ''; }
	const ca = reg.car_accident;
	const parts = [];
	if (r.deadline) {
		parts.push(`לפי כלל החוק, היום האחרון להגשת תביעה על נזק הגוף הוא ${isoToHe(r.deadline)}${r.lim && r.lim.minor ? ` (שבע שנים מגיל ${ca.limitation.adult_age})` : r.capped ? ` (${reg.injury_sheon.torts.late_cap_years} שנים מיום אירוע הנזק)` : r.late ? ' (שבע שנים מיום גילוי הנזק)' : ' (שבע שנים מיום הפגיעה)'}${r.lim && r.lim.rolled ? ', אחרי מעבר מיום מנוחה' : ''}.`);
	} else {
		parts.push('כדי לחשב את היום האחרון לתביעה של קטין, צריך תאריך לידה.');
	}
	if (r.pol) { parts.push(`התביעה לפי הפוליסה מתיישנת ב-${isoToHe(r.pol.deadline)} (${r.pol.years} שנים).`); }
	const nii = r.events.find((e) => e.key === 'nii_claim');
	if (nii) { parts.push(`לביטוח הלאומי מגישים עד ${isoToHe(nii.date)}.`); }
	const acc = r.events.find((e) => e.key === 'accident_claim');
	if (acc) { parts.push(`דמי תאונה: תביעה עד ${isoToHe(acc.date)}.`); }
	if (r.daysSince !== null) { parts.push(r.daysSince === 0 ? 'הפגיעה היום.' : `עברו ${dayHe(r.daysSince)} מהפגיעה.`); }
	return parts.join(' ');
}

/** The clock: the first 30 days, one cell a day, and the long ribbon to the last day, both with a text equivalent. */
export function ribbon(reg, r) {
	if (!r.ok) { return ''; }
	const today = r.today;
	const dated = r.steps.filter((s) => s.due && s.due > r.injury && daysBetween(r.injury, s.due) <= 30);
	const cells = [];
	for (let n = 0; n <= 30; n += 1) {
		const d = addDays(r.injury, n);
		const marks = dated.filter((s) => s.due === d);
		const cls = [`${P}-c`];
		if (n === 0) { cls.push(`${P}-c--inj`); }
		if (today && d < today && n > 0) { cls.push(`${P}-c--past`); }
		if (today && d === today) { cls.push(`${P}-c--today`); }
		if (marks.length) { cls.push(`${P}-c--mark`); }
		cells.push(`<li class="${cls.join(' ')}" title="${esc(`${isoToHe(d)}${n === 0 ? ': יום הפגיעה' : ''}${marks.length ? `: ${marks.map((m) => m.dueHe).join(', ')}` : ''}${today && d === today ? ': היום' : ''}`)}"><b>${n}</b><small>${n === 0 ? 'פגיעה' : today && d === today ? 'היום' : marks.length ? esc(marks[0].dueHe.replace(/^עד /, '')) : `${Number(d.slice(8))}.${Number(d.slice(5, 7))}`}</small></li>`);
	}
	// The long ribbon: every dated event from the injury to the last of them, as numbered marks at their place in time.
	const end = r.events.length ? r.events[r.events.length - 1].date : r.injury;
	const span = Math.max(1, daysBetween(r.injury, end));
	const later = r.events.filter((e) => e.key !== 'injury');
	// A square-root time scale: the first weeks and months, where most dates fall, get room; seven years still fit.
	const pos = (d) => Math.min(100, Math.max(0, Math.round(Math.sqrt(Math.max(0, daysBetween(r.injury, d)) / span) * 1000) / 10));
	let last = -100;
	let lvl = 0;
	const marks = later.map((e, k) => {
		const x = pos(e.date);
		lvl = x - last < 9 ? (lvl + 1) % 3 : 0;
		last = x;
		return `<span class="${P}-m ${P}-m--${e.kind}${lvl ? ` ${P}-m--l${lvl}` : ''}" style="inset-inline-start:${x}%"><i aria-hidden="true">${k + 1}</i></span>`;
	}).join('');
	const todayMark = today && today >= r.injury && today <= end ? `<span class="${P}-m ${P}-m--today" style="inset-inline-start:${pos(today)}%"><i aria-hidden="true">היום</i></span>` : '';
	const years = [];
	for (let y = 1; addMonths(r.injury, 12 * y) < end; y += 1) { years.push(`<span class="${P}-y" style="inset-inline-start:${pos(addMonths(r.injury, 12 * y))}%"></span>`); }
	const legend = later.map((e, k) => `<li class="${P}-lg ${P}-lg--${e.kind}${today && e.kind !== 'start' && e.date < today ? ` ${P}-lg--past` : ''}"><i aria-hidden="true">${k + 1}</i><bdi>${isoToHe(e.date)}</bdi> <span>${esc(e.he)}</span></li>`).join('');
	const sum = `ההתחלה ${isoToHe(r.injury)}${today ? `, היום ${isoToHe(today)} (${dayHe(Math.max(0, r.daysSince))} אחרי)` : ''}. ${later.map((e) => `${isoToHe(e.date)}: ${e.he}`).join('. ')}.`;
	return `<figure class="${P}-clock"><figcaption class="${P}-clock__h">השעון של הפגיעה: ${r.deadline ? `עד ${isoToHe(r.deadline)}` : 'מיום הפגיעה'}</figcaption>`
		+ `<p class="jtool-visually-hidden">${esc(sum)}</p>`
		+ `<p class="${P}-clock__sub" aria-hidden="true">30 הימים הראשונים</p><ol class="${P}-cells" aria-hidden="true">${cells.join('')}</ol>`
		+ `<p class="${P}-clock__sub" aria-hidden="true">עד היום האחרון (הקו מכווץ: החודשים הראשונים רחבים יותר)</p><div class="${P}-bar" aria-hidden="true"><span class="${P}-bar__fill" style="inline-size:${today ? pos(today) : 0}%"></span>${years.join('')}${marks}${todayMark}</div>`
		+ `<ol class="${P}-legend">${legend}</ol></figure>`;
}

/** The scenario for the simulation: computed facts only, never a name, an ID or an address. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const what = r.type === 'other' ? SUB_HE[r.sub] : typeLabel(r);
	const who = r.pays.find((p) => p.role === 'primary');
	const payer = who ? { vehicle: 'מבטח החובה של הרכב', own_vehicle: 'מבטח החובה של הרכב', hitting: 'מבטח החובה של הרכב הפוגע', karnit: 'קרנית', nii_work: 'הביטוח הלאומי והמעסיק', dog_owner: 'בעל הכלב ומבטח האחריות שלו', assailant: 'מי שתקף', student_policy: 'ביטוח התלמידים', wrongdoer: 'מי שהתרשל ומבטח האחריות שלו' }[who.code] || 'הגורם האחראי' : 'הגורם האחראי';
	const clock = r.deadline ? ` לפי חוק ההתיישנות היום האחרון לתביעה הוא ${isoToHe(r.deadline)}.` : '';
	const pol = r.pol ? ` יש פוליסה פרטית שמתיישנת ב-${isoToHe(r.pol.deadline)}.` : '';
	const base = `פגיעה בגיל ${r.age}: ${what}, ב-${isoToHe(r.injury)}. מי שמשלם בעיקר: ${payer}.${clock}${pol}`;
	if (r.type === 'work') {
		return `${base} הביטוח הלאומי ישלם דמי פגיעה עד ${reg.injury_sheon.nii.work.days} ימים, ואם תישאר נכות היא תיקבע בוועדה רפואית. השאלה לתרגול: הוועדה הרפואית. איך מתארים את הפגיעה ואת המגבלות ביום יום, אילו מסמכים מביאים, ואיך עונים לשאלות הרופאים בלי להגזים ובלי להמעיט?`;
	}
	return `${base} השאלה לתרגול: הדיון הראשון בבית המשפט. איך מציגים את מה שקרה, את הטיפול הרפואי ואת הנזק, ואיך עונים על שאלות על התיעוד מהימים הראשונים ועל הפניות לרופאים?`;
}

/** The share link of this tool, for its siblings: '/tort-lawyer/#s=<state>'. Numbers and dates only. */
export function stateLink(reg, input) {
	return `${PAGE}#s=${stateOf(input)}`;
}

/**
 * The road-accident tool (teunat-drachim) with the reader's facts filled in, by its own keys (teuna-ui.js KEYS, read from
 * the teuna lane's worktree on 22.10.2026): t accident day, a age, b birth (minor), w on the way to / at work, g inside (i)
 * or outside (o) the vehicle, j Karnit, q the interim-payment demand day, u late discovery. Numbers and dates only.
 */
export function roadLink(r) {
	return `${SH_ROAD_PAGE}#s=${encodeState({ t: r.injury, a: r.age, b: r.minor && r.birth ? r.birth : '', w: r.type === 'both' ? 1 : '', g: r.role === 'pedestrian' ? 'o' : 'i', j: r.hitrun ? 1 : '', q: r.demand || '', u: r.late ? 1 : '' })}`;
}

/**
 * The work-injury tool (teunat-avoda) with the reader's facts filled in, by its own keys (avoda-ui.js KEYS, read from the
 * avoda lane's worktree on 22.10.2026): k employee (w) or self-employed (s), t injury day, a age, r a road accident.
 * Its page fills the wage and the days from its own example and says so.
 */
export function workLink(r) {
	return `${SH_WORK_PAGE}#s=${encodeState({ k: r.job === 'self' ? 's' : 'w', t: r.injury, a: r.age, r: r.type === 'both' ? 1 : '' })}`;
}

/** The "what to do now" list: the official route first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const sh = reg.injury_sheon;
	const out = [];
	const links = [];
	if (r.type === 'road' || r.type === 'both') {
		out.push({ he: `${sh.traffic.report_he} (משטרת ישראל)`, url: sh.traffic.report_url });
		links.push({ path: roadLink(r), he: 'כמה פיצוי: מחשבון חוק הפיצויים עם יום התאונה והגיל שלכם' });
		if (r.hitrun) { links.push({ path: '/karnit-fund-uninsured-hit-run/', he: 'תביעה לקרנית: פגע וברח ורכב בלי ביטוח' }); }
	}
	if (r.type === 'work' || r.type === 'both') {
		out.push({ he: 'ביטוח לאומי: נפגעי עבודה, הטפסים ודמי הפגיעה', url: sh.nii.work.page_url });
		links.push({ path: workLink(r), he: 'תאונת עבודה: דמי פגיעה, נכות ומענק, עם יום הפגיעה שלכם' });
		if (r.type === 'both') { links.push({ path: '/combined-road-work-accident-benefits/', he: 'תאונת דרכים שהיא גם תאונת עבודה: מה מנוכה' }); }
	}
	if (r.type === 'other') {
		if (r.sub !== 'student' && r.age >= sh.nii.accident.min_age) { out.push({ he: 'ביטוח לאומי: תביעה לדמי תאונה', url: sh.nii.accident.claim_url }); }
		if (r.sub === 'student') { out.push({ he: sh.students.he, url: sh.students.url }); }
		if (r.sub === 'fall') { links.push({ path: '/personal-injury-slip-fall/', he: 'החלקה ונפילה: מי אחראי ומה מוכיחים' }); }
		links.push({ path: '/nezikin-ordinance-negligence/', he: 'רשלנות לפי פקודת הנזיקין: מה צריך להוכיח' });
	}
	if (r.pol) {
		out.push({ he: 'חוק חוזה הביטוח: הודעה, מסמכים ומועד התשלום', url: sh.insurance.url });
		links.push({ path: '/three-years-insurance-limitation/', he: 'שלוש שנות התיישנות בביטוח: מתי מתחילים לספור' });
	}
	if (r.dec) { out.push({ he: r.dec.kind === 'clerk' ? 'ועדת תביעות וערעור לבית הדין לעבודה' : 'ערר על החלטת הוועדה הרפואית', url: r.dec.items[0].url }); }
	out.push({ he: `${sh.patient.he}, ${sh.patient.section}: העתק הרשומה הרפואית`, url: sh.patient.url });
	links.push({ path: '/evidentiary-damage-records/', he: 'אילו מסמכים מוכיחים את הנזק' });
	links.push({ path: '/contingency-fee-injury-claims/', he: 'שכר טרחה באחוזים: מה החוק מתיר' });
	return { official: out, links: links.slice(0, 4) };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		if (r.outOfScope) {
			return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--info">i רשלנות רפואית: שעון אחר</p><p class="jtool-verdict__sentence">${esc(r.errors[0].he)}</p></div>`;
		}
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const ca = reg.car_accident;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	const purpose = r.type === 'work' ? 'witness_prep' : 'court_rehearsal';
	const state = r.expired ? '<p class="jtool-state jtool-state--danger">! לפי כלל החוק המועד עבר: בדקו את החריגים למטה</p>'
		: r.deadline ? `<p class="jtool-state jtool-state--ok">✓ לפי ${esc(ca.limitation.section)} לחוק ההתיישנות${r.capped ? ` ו${esc(reg.injury_sheon.torts.late_cap_section)} לפקודת הנזיקין` : ''}</p>` : '<p class="jtool-state jtool-state--warn">! חסר תאריך לידה של הקטין</p>';
	const fig = r.deadline ? `<bdi>${isoToHe(r.deadline)}</bdi>` : '—';
	const rows = [];
	if (r.daysLeft !== null) { rows.push(`<div><dt>${r.daysLeft >= 0 ? 'ימים עד היום האחרון' : 'ימים מאז היום האחרון'}</dt><dd><bdi>${money(Math.abs(r.daysLeft), 0)}</bdi></dd></div>`); }
	if (r.daysSince !== null) { rows.push(`<div><dt>מאז הפגיעה</dt><dd>${esc(dayHe(r.daysSince))}</dd></div>`); }
	if (r.pol) { rows.push(`<div><dt>התיישנות הפוליסה</dt><dd><bdi>${isoToHe(r.pol.deadline)}</bdi></dd></div>`); }
	const nii = r.events.find((e) => e.key === 'nii_claim' || e.key === 'accident_claim');
	if (nii) { rows.push(`<div><dt>${nii.key === 'nii_claim' ? 'תביעה לביטוח הלאומי עד' : 'דמי תאונה: תביעה עד'}</dt><dd><bdi>${isoToHe(nii.date)}</bdi></dd></div>`); }
	const flags = r.flags;
	const stepsHtml = r.steps.map((s) => {
		const past = r.today && s.deadline && s.due < r.today;
		return `<li class="${P}-step ${P}-step--${s.kind}${past ? ` ${P}-step--past` : ''}"><span class="${P}-kind">${esc(KIND_HE[s.kind])}</span><span class="${P}-when">${s.due && s.dueHe.indexOf('עד') === 0 ? `${esc(s.dueHe)} · <bdi>${isoToHe(s.due)}</bdi>` : esc(s.dueHe)}${past ? ' (עבר)' : ''}</span><p>${esc(s.he)}.${s.section ? cite(s.section, s.url) : s.url ? cite('מקור רשמי', s.url) : ''}</p></li>`;
	}).join('');
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${esc(typeLabel(r))}, היום האחרון להגשת תביעה על נזק הגוף</p>`
		+ `<strong class="jtool-verdict__figure">${fig}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ ribbon(reg, r)
		+ (flags.length ? `<ul class="jtool-flags ${P}-flags">${flags.map((f) => `<li class="${P}-flag ${P}-flag--${f.level}">${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-box"><h3 class="${P}-h">30 הימים הראשונים: מה עושים, מי, ועד מתי</h3><ol class="${P}-steps">${stepsHtml}</ol><p class="${P}-note">כל צעד מסומן: חובה או מועד שבחוק, זכות, תנאי לזכאות, נוהל של הגוף, או עצה מעשית. "מיד" ו"מיד ככל האפשר" הם לשון החוק: אין בו מספר ימים.</p></div>`
		+ `<div class="${P}-box"><h3 class="${P}-h">מי משלם</h3><ul class="${P}-pays">${r.pays.map((p) => `<li class="${P}-pay ${P}-pay--${p.role}"><span class="${P}-kind">${p.role === 'primary' ? 'בעיקר' : p.role === 'also' ? 'גם' : 'לבדוק'}</span> ${esc(p.he)}${p.section ? cite(p.section, p.url) : p.url ? cite('מקור רשמי', p.url) : ''}</li>`).join('')}</ul></div>`
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${SH_SIM(purpose)}" target="_blank" rel="noopener" data-act="rehearse">${r.type === 'work' ? 'לתרגל את הוועדה הרפואית' : 'לתרגל את הדיון הראשון'}</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** Which court, by the amount on the filing day (reg.small_claims), and where the other disputes go. */
export function courtTable(reg, r) {
	const sc = reg.small_claims;
	const c = reg.injury_sheon.courts;
	const court = r && r.ok ? r.court : { code: 'unknown', small: sc.ceiling[sc.ceiling.length - 1].amount, max: sc.magistrate_max };
	const mine = (code) => (court.code === code ? ` class="${P}-mine"` : '');
	const rows = [
		['small', `עד ${nis(court.small)}`, 'בית משפט לתביעות קטנות', `תקרה מ-${isoToHe(sc.ceiling[sc.ceiling.length - 1].from)}; עד ${sc.max_claims_per_year} תביעות בשנה`, sc.service_url],
		['magistrate', `עד ${nis(court.max)} ביום ההגשה`, 'בית משפט השלום', `${sc.magistrate_section} ל${c.he}; ${c.raise_he}`, c.url],
		['district', `מעל ${nis(court.max)}`, 'בית המשפט המחוזי', `${sc.district_section} ל${c.he}`, c.url],
		['labor', 'תביעה נגד הביטוח הלאומי', 'בית הדין האזורי לעבודה', `${c.labor_nii_section} ל${c.labor_he}`, c.labor_url],
		['tort', 'עובד נגד המעסיק, על פי פקודת הנזיקין', 'בית המשפט האזרחי לפי הסכום', `${c.labor_tort_section} ל${c.labor_he}`, c.labor_url],
		['interim', 'בקשה לתשלום תכוף (תאונת דרכים)', 'בית משפט השלום', `סעיף 5א(ב) ל${reg.injury_sheon.road.he}`, reg.injury_sheon.road.url],
	];
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-ct-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">התביעה</th><th scope="col">בית המשפט</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([code, what, where, rule, url]) => `<tr${mine(code)}><td data-th="התביעה">${esc(what)}${court.code === code ? ' <strong>(הסכום שלכם)</strong>' : ''}</td><td data-th="בית המשפט">${esc(where)}</td><td data-th="הכלל">${cite(rule, url)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(c.magistrate_he)}. הסכומים לפי ${esc(sc.name_he)} ו${esc(c.he)}, נוסח ל-${isoToHe(c.current_to)}.</caption></table></div>`;
}

/** The fee caps of the road law (reg.car_accident.fees), with the reader's amount when given. */
export function feeTable(reg, r) {
	const f = reg.car_accident.fees;
	const has = r && r.ok && r.fees.length;
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-fee-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">שלב</th><th scope="col">תקרה</th>${has ? '<th scope="col">על הסכום שלכם, עם מע"מ</th>' : ''}<th scope="col">סעיף</th></tr></thead><tbody>`
		+ ['none', 'settle', 'judgment'].map((s) => { const x = has ? r.fees.find((y) => y.stage === s) : null; return `<tr><td data-th="שלב">${esc(f.stages[s].he)}</td><td data-th="תקרה"><bdi>${f.stages[s].pct}%</bdi> ועוד מע"מ</td>${has ? `<td data-th="על הסכום שלכם">${ils(x.withVat)}</td>` : ''}<td data-th="סעיף">${cite(f.stages[s].section, f.rules_url)}</td></tr>`; }).join('')
		+ `</tbody><caption>${esc(f.rules_he)}; מע"מ ${f.vat_pct}% (${esc(f.vat_he)}). ${esc(f.refund_he)}. התקרה היא לתאונות דרכים; בתביעות לביטוח הלאומי יש הגבלה נפרדת, ובתביעת נזיקין אחרת החוק שנבדק כאן לא קובע תקרה.</caption></table></div>`;
}

/** The rules of the clock, one row each, with the period and the section: the page table (compare_table). */
export function rulesTable(reg) {
	const ca = reg.car_accident;
	const sh = reg.injury_sheon;
	const L = sh.limitation;
	const T = sh.torts;
	const I = sh.insurance;
	const N = sh.nii;
	const lim = ca.limitation;
	const rows = [
		['תביעה על נזק גוף (נזיקין ותאונות דרכים)', `${lim.years} שנים`, 'מיום שנולדה העילה: יום הפגיעה, או יום הנזק', `${lim.section} ו${L.start_section} לחוק ההתיישנות; ${T.start_section} לפקודת הנזיקין; ${T.road_applies_section} לחוק הפיצויים`, lim.url],
		['קטין ביום הפגיעה', `${lim.years} שנים`, `מיום ההולדת ה-${lim.adult_age}`, `${lim.minor_section} לחוק ההתיישנות`, lim.url],
		['נזק שהתגלה מאוחר', `${lim.years} שנים, ולכל היותר ${T.late_cap_years}`, `מיום הגילוי; ${T.late_cap_years} שנים מיום אירוע הנזק`, `${T.late_cap_section} לפקודת הנזיקין; ${L.late_section} לחוק ההתיישנות`, T.url],
		['תקופת המלחמה', `לא נספרים ${isoToHe(lim.war.from)} עד ${isoToHe(lim.war.to)}`, 'לתקופה שרצה ערב התיקון, גם בחוק אחר', `${lim.war.section} ו${L.war_other_laws_section}`, lim.url],
		['היום האחרון ביום מנוחה', 'עובר ליום שאחריו', 'שבת, חג או יום העצמאות', lim.interpretation_he, lim.url],
		['הטעיה, איום, ניצול מצוקה; הודאה בכתב או תשלום; ליקוי נפשי', 'המרוץ מושעה או מתחיל מחדש', 'לפי העובדות', `${L.misconduct_section}, ${L.admission_section}, ${L.incapacity_section} לחוק ההתיישנות`, lim.url],
		['תקיפה מינית בקטין או התעללות', 'לא נספר הזמן', `עד גיל ${L.sexual_age}`, `${L.sexual_section} לחוק ההתיישנות`, lim.url],
		['הסכם על התיישנות', `לא פחות מ-${L.agreed_min_months} חודשים`, 'בחוזה נפרד בכתב', `${L.agreed_section} לחוק ההתיישנות`, lim.url],
		['תביעה לפי פוליסה פרטית', `${I.limit_years} שנים; ${I.limit_long_years} ב${I.limit_long_he}`, 'מיום מקרה הביטוח; בנכות מיום שקמה הזכות לפי הפוליסה', `${I.limit_section} לחוק חוזה הביטוח`, I.url],
		['התרעה של חברת הביטוח', `${I.warn_months.join(' ו-')} חודשים לפני הסוף`, 'למי שהודיע על המקרה', `${I.warn_section} לחוק חוזה הביטוח`, I.url],
		['תשלום התגמולים', `${I.pay_days} ימים`, 'מהיום שהיו בידי המבטח המידע והמסמכים', `${I.pay_section} לחוק חוזה הביטוח`, I.url],
		['תשלום תכוף בתאונת דרכים', `${ca.interim_days} ימים; עד ${sh.road.interim_max_years} שנים מהתאונה`, 'מהדרישה בכתב', `${ca.sections.interim}, ${sh.road.interim_court_section}, ${sh.road.interim_max_section} לחוק הפיצויים`, ca.law_url],
		['גמלה בביטוח הלאומי (דמי פגיעה, נכות מעבודה)', `${N.claim_months} חודשים`, 'מיום שנוצרה העילה', `${N.claim_section} לחוק הביטוח הלאומי`, N.claim_url],
		['דמי תאונה (לא דרכים ולא עבודה)', `${N.accident.claim_days} ימים; בדיקה בתוך ${N.accident.exam_hours} שעות`, 'מיום התאונה', 'המוסד לביטוח לאומי', N.accident.claim_url],
		['ערר על ועדה רפואית, נפגעי עבודה', `${N.work.medical_appeal_days} ימים`, 'מקבלת ההודעה', 'המוסד לביטוח לאומי', N.work.medical_appeal_url],
		['ערעור לבית הדין על ועדת העררים', `${N.work.court_days} ימים`, 'מקבלת ההודעה; שאלה משפטית בלבד', 'המוסד לביטוח לאומי', N.work.medical_appeal_url],
		['ועדת תביעות; תביעה לבית הדין לעבודה', `${N.appeal.committee_months} חודשים; ${N.appeal.court_months} חודשים`, 'מתאריך מכתב הדחייה או ההחלטה', 'המוסד לביטוח לאומי', N.appeal.court_url],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הכללים של השעון: מה מתיישן, תוך כמה זמן, ומאיזה יום. ${esc(lim.he || 'חוק ההתיישנות')} (נוסח ל-${isoToHe(L.current_to)}), ${esc(T.he)} (נוסח ל-${isoToHe(T.current_to)}), ${esc(I.he)} (נוסח ל-${isoToHe(I.current_to)}), חוק הביטוח הלאומי ודפי המוסד; נבדק ${isoToHe(sh.checked_on)}. לרשלנות רפואית כללים משלה.</caption><thead><tr><th scope="col">מה</th><th scope="col">כמה זמן</th><th scope="col">מאיזה יום</th><th scope="col">הסעיף</th></tr></thead><tbody>`
		+ rows.map(([what, len, from, src, url]) => `<tr><td data-th="מה">${esc(what)}</td><td data-th="כמה זמן">${esc(len)}</td><td data-th="מאיזה יום">${esc(from)}</td><td data-th="הסעיף">${cite(src, url)}</td></tr>`).join('')
		+ '</tbody></table></div>';
}

/** What changed and when: only values an official text dates. */
export function changesTable(reg) {
	const sh = reg.injury_sheon;
	const ca = reg.car_accident;
	const sc = reg.small_claims;
	const small = sc.ceiling[sc.ceiling.length - 1];
	const rows = sh.nii.work.changes.map((c) => ({ key: c.from, when: isoToHe(c.from), what: c.he, src: `${c.section} לחוק הביטוח הלאומי`, url: sh.nii.work.url }));
	rows.push({ key: `${sh.limitation.amendment_year}-01-01`, when: String(sh.limitation.amendment_year), what: `תיקון מס' 8 לחוק ההתיישנות (חרבות ברזל): הימים ${isoToHe(ca.limitation.war.from)} עד ${isoToHe(ca.limitation.war.to)} לא נספרים בתקופה שעוד רצה`, src: `${ca.limitation.war.section} לחוק ההתיישנות`, url: ca.limitation.url });
	rows.push({ key: small.from, when: isoToHe(small.from), what: `התקרה בתביעות קטנות: ${nis(small.amount)}`, src: small.source_he, url: small.url });
	rows.push({ key: sh.students.from, when: isoToHe(sh.students.from), what: `שנת הביטוח של תאונות התלמידים ${isoToHe(sh.students.from)} עד ${isoToHe(sh.students.to)}: סכום הביטוח הבסיסי ${nis(sh.students.base_sum)}`, src: 'משרד החינוך, הפוליסה', url: sh.students.url });
	rows.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתי"><bdi>${esc(x.when)}</bdi></td><td data-th="מה השתנה">${esc(x.what)}</td><td data-th="מקור">${cite(x.src, x.url)}</td></tr>`).join('')
		+ '</tbody><caption>רק ערכים שפורסמו בנוסח רשמי, עם התאריך שלהם.</caption></table></div>';
}

function datesTable(reg, r, opts = {}) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = opts.today && e.kind !== 'start' && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.he)}</td><td data-th="הכלל">${e.section || e.url ? cite(e.section || 'מקור רשמי', e.url) : ''}</td></tr>`; }).join('')
		+ `</tbody><caption>רק מועדים שחוק, תקנה או הגוף הרשמי קובעים. מועד שנופל ביום מנוחה עובר ליום שאחריו (${esc(reg.car_accident.limitation.interpretation_he)}).</caption></table></div>`;
}

function methodList(reg, r) {
	const ca = reg.car_accident;
	const sh = reg.injury_sheon;
	const items = [];
	items.push(`יום הפגיעה ${isoToHe(r.injury)}: ${esc(sh.limitation.start_he)} (${esc(sh.limitation.start_section)}); ${esc(sh.torts.act_he)} (${esc(sh.torts.start_section)} לפקודת הנזיקין)${r.type === 'road' || r.type === 'both' ? `, וזה חל גם על תאונת דרכים (${esc(sh.torts.road_applies_section)} לחוק הפיצויים)` : ''}`);
	if (r.lim && r.lim.minor) { items.push(`קטין: הזמן עד גיל ${ca.limitation.adult_age} לא נספר (${ca.limitation.minor_section}): ההתחלה ${isoToHe(r.lim.start)}`); }
	if (r.late) { items.push(`הנזק התגלה ב-${isoToHe(r.discovered)}: מכאן נספר (${sh.torts.late_cap_section}), אבל לא יותר מ-${sh.torts.late_cap_years} שנים מיום הנזק${r.cap ? `: ${isoToHe(r.cap.deadline)}` : ''}`); }
	if (r.lim) {
		items.push(`${ca.limitation.years} שנים (${ca.limitation.section} לחוק ההתיישנות): ${isoToHe(r.lim.plain)}`);
		if (r.lim.added) { items.push(`עוד ${r.lim.added} ימים שלא נספרים, ${isoToHe(ca.limitation.war.from)} עד ${isoToHe(ca.limitation.war.to)} (${ca.limitation.war.section})`); }
		if (r.lim.rolled) { items.push(`היום יוצא ביום מנוחה, ולכן עובר ליום שאחריו (${ca.limitation.interpretation_he})`); }
		items.push(`היום האחרון לפי כלל החוק: ${isoToHe(r.deadline)}`);
	} else {
		items.push(`קטין בלי תאריך לידה: אין יום אחרון לחשב (${ca.limitation.minor_section})`);
	}
	if (r.pol) { items.push(`פוליסה: ${r.pol.years} שנים מ-${isoToHe(r.pol.start)} (${sh.insurance.limit_section})${r.pol.added ? `, ועוד ${r.pol.added} ימי מלחמה` : ''}: ${isoToHe(r.pol.deadline)}; התרעות המבטח ${r.pol.warns.map((w) => isoToHe(w.date)).join(' ו-')} (${sh.insurance.warn_section})`); }
	if (r.type === 'work' || r.type === 'both') { items.push(`ביטוח לאומי: ${sh.nii.claim_months} חודשים מיום הפגיעה (${sh.nii.claim_section}); דמי פגיעה עד ${sh.nii.work.days} ימים`); }
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

/** The one-page print: inputs, result, the steps, the dates, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const sh = reg.injury_sheon;
	return `<h3>השעון של הפגיעה: סיכום</h3>`
		+ `<p><strong>הנתונים:</strong> ${esc(typeLabel(r))}; יום הפגיעה ${isoToHe(r.injury)}; גיל ${r.age}${r.discovered ? `; הנזק התגלה ${isoToHe(r.discovered)}` : ''}${r.pol ? `; פוליסה ${r.pol.years === sh.insurance.limit_years ? 'תאונות אישיות' : 'בריאות'}` : ''}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p>${methodList(reg, r)}`
		+ `<p><strong>30 הימים הראשונים:</strong> ${r.steps.map((s) => `${esc(s.dueHe)}: ${esc(s.he.split(':')[0])}`).join('; ')}.</p>`
		+ `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.he)}`).join('; ')}.</p>`
		+ `<p><strong>מקורות:</strong> ${esc(sh.limitation.he)}, נוסח ל-${isoToHe(sh.limitation.current_to)}; ${esc(sh.torts.he)}, נוסח ל-${isoToHe(sh.torts.current_to)}; ${esc(sh.insurance.he)}, נוסח ל-${isoToHe(sh.insurance.current_to)}; ${esc(sh.road.he)}, נוסח ל-${isoToHe(sh.road.current_to)}; ${esc(sh.nii.he)}; המוסד לביטוח לאומי. נבדק ${isoToHe(sh.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חושב, צעד אחר צעד</h3></div>${methodList(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">כל המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${datesTable(reg, r, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-ct-h">באיזה בית משפט</h3></div>${courtTable(reg, r)}</div>`
		+ (r.type === 'road' || r.type === 'both' ? `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-fee-h">שכר הטרחה המרבי בתאונת דרכים</h3></div>${feeTable(reg, r)}</div>` : '')
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || reg.injury_sheon.checked_on)}</div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): the last day to sue of the example (or of the reader
 * once they change anything), with the first steps in one line, and a jump to the form. Same markup on the server and in
 * the browser, so the card never shifts the layout. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי יום הפגיעה שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">השעון של הנפגע</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}${typeLabel(r)}, פגיעה ב-${isoToHe(r.injury)}`;
	const fig = r.deadline ? `<bdi>${isoToHe(r.deadline)}</bdi>` : '—';
	const unit = r.deadline ? 'היום האחרון לתביעה על נזק הגוף' : 'חסר תאריך לידה';
	const open = r.steps.length;
	const line = `לפי ${reg.car_accident.limitation.section} לחוק ההתיישנות${r.lim && r.lim.rolled ? ', אחרי מעבר מיום מנוחה' : ''}.${r.daysSince !== null ? ` עברו ${dayHe(r.daysSince)} מהפגיעה.` : ''} ${open} צעדים ל-30 הימים הראשונים, כל אחד עם המקור שלו.`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${fig}</strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const r = shCompute(reg, EXAMPLE);
	const ca = reg.car_accident;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.daysLeft,
		sticky: `<bdi>${isoToHe(r.deadline)}</bdi>`,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { today: EXAMPLE.today, printedOn: EXAMPLE.today }),
		method: `<ol><li>תאונת דרכים, בנסיעה ברכב: מבטח החובה של הרכב משלם על נזק הגוף בלי קשר לאשם${cite(reg.injury_sheon.road.passengers_section, reg.injury_sheon.road.url)}</li>`
			+ `<li>יום הפגיעה ${isoToHe(EXAMPLE.injury)}: מכאן נספרת ההתיישנות${cite(reg.injury_sheon.limitation.start_section, ca.limitation.url)}${cite(reg.injury_sheon.torts.start_section, reg.injury_sheon.torts.url)}</li>`
			+ `<li>${ca.limitation.years} שנים: ${isoToHe(r.lim.plain)}${cite(ca.limitation.section, ca.limitation.url)}</li>`
			+ (r.lim.rolled ? `<li>${isoToHe(r.lim.plain)} חל ${new Date(`${r.lim.plain}T00:00:00Z`).getUTCDay() === 6 ? 'בשבת' : 'ביום מנוחה'}, ולכן היום האחרון הוא ${isoToHe(r.deadline)}${cite(ca.limitation.interpretation_he, ca.limitation.url)}</li>` : `<li>היום האחרון: ${isoToHe(r.deadline)}</li>`)
			+ `<li>תשלום תכוף: ${ca.interim_days} ימים מדרישה בכתב, ועד שנתיים מהתאונה (${isoToHe(r.events.find((e) => e.key === 'interim_max').date)})${cite(ca.sections.interim, ca.law_url)}</li></ol>`,
		compare_table: rulesTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

const TY = { road: 'r', work: 'w', both: 'b', other: 'o', malpractice: 'm' };
const RO = { driver: 'd', passenger: 'p', pedestrian: 'w' };
const SU = { fall: 'f', assault: 'a', dog: 'g', student: 's', other: 'o' };
const JO = { employee: 'e', self: 's', none: 'n' };
const PO = { none: 'n', accident: 'a', health: 'h' };
const DE = { medical: 'm', appeals: 'a', clerk: 'c' };
const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
export const KEYS = ['y', 'r', 'u', 'k', 'i', 'a', 'b', 'e', 'c', 'p', 'q', 'o', 'm', 'x', 'z', 's'];
export function stateOf(i) {
	const road = i.type === 'road' || i.type === 'both';
	const minor = i.age !== '' && i.age !== undefined && Number(i.age) < 18;
	return encodeState({
		y: TY[i.type] || 'r', r: road ? RO[i.role] || 'p' : '', u: i.type === 'other' ? SU[i.sub] || 'f' : '', k: road && i.hitrun ? 1 : '',
		i: i.injury || '', a: i.age === '' || i.age === undefined ? '' : Number(i.age), b: minor ? i.birth || '' : '', e: JO[i.job] || 'e',
		c: i.discovered || '', p: PO[i.policy] || 'n', q: i.policy && i.policy !== 'none' ? i.policyRight || '' : '', o: i.policy && i.policy !== 'none' ? i.docs || '' : '',
		m: road ? i.demand || '' : '', x: DE[i.decision] || '', z: i.decision ? i.decisionDate || '' : '', s: i.amount === '' || i.amount === undefined ? '' : Math.round(Number(i.amount)),
	});
}
export function inputOf(s) {
	if (!s || !s.i) { return null; }
	const num = (v) => (v === undefined || v === '' ? '' : Number(v));
	return Object.assign({}, SH_BLANK, {
		type: back(TY, s.y, 'road'), role: back(RO, s.r, 'passenger'), sub: back(SU, s.u, 'fall'), hitrun: s.k === '1', injury: s.i,
		age: num(s.a), birth: s.b || '', job: back(JO, s.e, 'employee'), discovered: s.c || '', policy: back(PO, s.p, 'none'),
		policyRight: s.q || '', docs: s.o || '', demand: s.m || '', decision: back(DE, s.x, ''), decisionDate: s.z || '', amount: num(s.s),
	});
}

/* ---------------- Browser ---------------- */

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const amt = (id) => { const v = String(val(id)).replace(/[,\s₪]/g, ''); return v === '' ? '' : Number(v); };
	return {
		type: pick('type', 'road'), role: pick('role', 'passenger'), hitrun: Boolean(root.querySelector(`input[name="${P}-hit"]:checked`)), sub: val('sub') || 'fall',
		injury: shIso(val('inj')), today, age: amt('age'), birth: shIso(val('birth')), job: pick('job', 'employee'), discovered: shIso(val('disc')),
		policy: val('pol') || 'none', policyRight: shIso(val('pright')), docs: shIso(val('docs')), demand: shIso(val('dem')),
		decision: val('dec'), decisionDate: shIso(val('decd')), amount: amt('amt'),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const sh = reg.injury_sheon;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(sh.checked_on, sh.refresh_every_days) || (sh.next_update && today >= sh.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהחוק התעדכן'); }
	}
	const ids = { injury: 'inj', age: 'age', birth: 'birth', discovered: 'disc', policyRight: 'pright', docs: 'docs', demand: 'dem', decisionDate: 'decd', amount: 'amt' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok || r.outOfScope) { return; }
		for (const e of r.errors) {
			const id = ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = (input) => {
		const road = input.type === 'road' || input.type === 'both';
		form.querySelectorAll('[data-if-road]').forEach((el) => { el.hidden = !road; });
		form.querySelectorAll('[data-if-other]').forEach((el) => { el.hidden = input.type !== 'other'; });
		form.querySelectorAll('[data-if-minor]').forEach((el) => { el.hidden = !(input.age !== '' && Number(input.age) < 18); });
		const key = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return input.injury === addDays(input.today || today, -p.back) && p.type === input.type && String(p.age) === String(input.age) && (p.role || 'passenger') === input.role && (p.policy || 'none') === input.policy && p.job === input.job; }) || '';
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = shCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today: input.today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok && r.deadline ? `<bdi>${isoToHe(r.deadline)}</bdi>` : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if ((r.ok || r.outOfScope) && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: shBand(r) }); }
		return r;
	};
	// The example keeps its own "today" (the day it was computed); the reader's first change moves the clock to today.
	const current = () => readForm(root, today);
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = current(); sync(input); run(input); }, 160);
	};
	// A share link may name its tool (/@shaon-nezikin); on a page with several tools only this tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	const fromHash = parsed ? Object.assign(parsed, { today }) : null;
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync(fromHash);
		run(fromHash, { silent: true });
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
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'preset') {
			const input = shPreset(b.getAttribute('data-preset'), today);
			if (!input) { return; }
			own = true;
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		const input = own ? current() : Object.assign({}, EXAMPLE);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok) {
			download('shaon-nezikin.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `השעון של הפגיעה: ${e.he}`, description: `${e.section || 'מקור רשמי'}. חושב ב-jus-tice.co.il לפי כלל החוק; עורך דין בודק חריגים. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק תאריכים ומספרים, בלי שמות ובלי תעודת זהות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(sh.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: shBand(r) });
			const brief = r.ok ? aiBrief(reg, r) : '';
			const purpose = (/purpose=([a-z_]+)/.exec(b.getAttribute('href') || '') || [])[1] || 'court_rehearsal';
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
			if (s) { own = true; s.today = today; form.innerHTML = renderForm(reg, s); sync(s); run(s); }
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
