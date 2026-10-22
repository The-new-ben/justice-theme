/**
 * The medical-malpractice wave UI (22.10.2026, HAD-594): the malpractice limitation clock (shaon-refui, prefix jt70) on
 * /medical-malpractice-statute-of-limitations/. The picture is a limitation register drawn as a clock ribbon: one time axis
 * from the treatment day with the year ticks, the war window as a hatched band and today as a deep-green rule; under it one
 * lane per reading of the law (the safe 7 years, the late-discovery date with its 10-year cap line, the minor's 18th
 * birthday where the clock waits, the parents, the estate and the dependants, an impairment, the policy), each bar ending at
 * its last day, the safe day drawn solid and the others by their condition. A text equivalent goes with it. Under it: the
 * readings side by side with their conditions, the Ministry of Health tracks beside the clock (none has a deadline in the
 * texts read, none stops the clock), what the Supreme Court said (in words, with the file numbers), the scenario for the
 * expert's cross-examination and the next steps; a one-page summary prints on its own.
 */
import { htCompute, htBand, HT_FOUND } from './hityashnut-engine.js';
import { addMonths, addYears, daysBetween, parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'shaon-refui';
export const PAGE = '/medical-malpractice-statute-of-limitations/';
const P = 'jt70';
const HT_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=witness_prep&topic=medical-malpractice';
const HT_CASE_PAGE = '/what-is-medical-malpractice-definition-examples/';
const HT_RECORDS_PAGE = '/obtaining-medical-records-copy/';
const HT_COST_PAGE = '/medical-malpractice-cost/';

/** One click to a full profile, each relative to today (years and months back). */
export const PRESETS = {
	adult: { he: 'מבוגר · טיפול לפני שנה · הנזק ידוע', back: [1, 0] },
	late: { he: 'הנזק עצמו התגלה 3 שנים אחרי הטיפול', back: [5, 0], disc: [2, 0], found: 'damage' },
	link: { he: 'הנזק ידוע, הקשר לטיפול התברר עכשיו', back: [9, 0], disc: [0, 1], found: 'link' },
	birth: { he: 'פגיעה בלידה · הילד בן 6', back: [6, 0], atBirth: true },
	death: { he: 'המטופל נפטר לפני חצי שנה', back: [3, 0], death: [0, 6] },
};
const HT_BLANK = { treatment: '', today: '', minor: false, birth: '', discovered: '', found: 'damage', death: '', incap: false, incapFrom: '', incapTo: '', filed: '', dismissed: '', policy: 'none', policyRight: '' };
const htBack = (today, ym) => addMonths(today, -(ym[0] * 12 + ym[1]));
/** A preset applied on a day. */
export function htPreset(key, today) {
	const p = PRESETS[key];
	if (!p) { return null; }
	const treatment = htBack(today, p.back);
	return Object.assign({}, HT_BLANK, { treatment, today, minor: Boolean(p.atBirth), birth: p.atBirth ? treatment : '', discovered: p.disc ? htBack(today, p.disc) : '', found: p.found || 'damage', death: p.death ? htBack(today, p.death) : '' });
}
/** The example: an adult treated on 10.1.2021 whose damage itself showed only on 5.9.2023, computed on 22.10.2026. */
export const EXAMPLE = Object.assign({}, HT_BLANK, { treatment: '2021-01-10', today: '2026-10-22', discovered: '2023-09-05', found: 'damage' });

const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text || 'מקור')}</a>` : '');
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const htIso = (text) => { const raw = String(text || '').trim(); return raw ? (parseDate(raw) || raw) : ''; };
const KIND_HE = { safe: 'בטוח', alt: 'מותנה', open: 'שאלה פתוחה' };
const dayHe = (n) => (n === 1 ? 'יום אחד' : `${money(n, 0)} ימים`);
const whoHe = (r, x) => (x.who === 'parents' ? 'ההורים' : x.who === 'dependants' ? 'התלויים' : r.death ? 'העיזבון' : r.minor ? 'הילד' : 'המטופל');
/** The condition of a reading in a few words, for the sentence, the lead card and the brief. */
const IF_HE = {
	base: 'אם הנזק היה ניתן לגילוי כבר ביום הטיפול', damage_late: 'אם יוכח שהנזק עצמו לא היה ניתן לגילוי קודם', link_late: 'אם יוכח שהקשר לטיפול לא היה ניתן לגילוי קודם',
	damage_late_minor: 'לפי הקריאה המקילה של השאלה הפתוחה', incapacity: 'אם יוכח הליקוי', war_revived: 'אם בית המשפט לא יחליט אחרת (סעיף 15א(ד))', estate_hendel: 'לפי ההצעה של השופט הנדל',
};
const ifHe = (x) => IF_HE[x.code] || 'אם יוכח התנאי';
const leadHe = (reg, x) => `${x.he}${x.added && !x.floor ? `, ועוד ${x.added} ימי המלחמה` : ''}${x.rolled ? ', ומעבר מיום מנוחה' : ''}`;
/** The conditional day to show next to the safe one: after a strict reading of an open question, its lenient reading. */
export function altOf(r) {
	const pick = (k) => r.later.find((x) => x.kind === k);
	return r.lead.kind === 'open' ? pick('open') || pick('alt') : pick('alt') || pick('open');
}
const caseOf = (reg, code) => reg.malpractice_hityashnut.case_law.find((c) => c.code === code);
const caseRef = (reg, code) => { const c = caseOf(reg, code); return c ? `${c.file} (${isoToHe(c.date)})` : ''; };
const presetOf = (i) => Object.keys(PRESETS).find((k) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(i.today || '')) { return false; }
	const p = htPreset(k, i.today);
	return ['treatment', 'birth', 'discovered', 'found', 'death'].every((f) => String(p[f] || '') === String(i[f] || '')) && !i.incap && !i.filed && (i.policy || 'none') === 'none';
}) || '';

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, HT_BLANK, input || {});
	const preset = presetOf(i);
	const date = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 10.1.2021" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const sel = (id, label, v, opts) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><select id="${P}-${id}" aria-describedby="${P}-${id}-e">${opts.map(([val, l]) => `<option value="${esc(val)}"${String(v) === val ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const minor = Boolean(i.minor || i.birth);
	const more = Boolean(i.death || i.incap || i.filed || (i.policy && i.policy !== 'none'));
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא את התאריכים לפי היום; אפשר לשנות כל שדה.</p></fieldset>'
		+ `<div class="jtool-row">${date('tr', 'יום הטיפול', i.treatment, 'היום שבו ניתן הטיפול או נעשתה הפעולה. אם הנזק הופיע אחר כך, הכלי סופר מהמוקדם.')}</div>`
		+ `<div class="jtool-chips ${P}-checks">${chip('minor', '1', 'המטופל היה קטין ביום הטיפול (כולל פגיעה בלידה)', minor, 'checkbox')}</div>`
		+ `<div class="jtool-row" data-if-minor${minor ? '' : ' hidden'}>${date('birth', 'תאריך הלידה של המטופל', i.birth, 'בפגיעה בלידה: אותו תאריך כמו יום הטיפול. עד גיל 18 השעון של הילד לא רץ.')}</div>`
		+ `<div class="jtool-row">${date('disc', 'הנזק או הקשר לטיפול התגלו רק ביום', i.discovered, 'לא חובה. היום שבו נודע, או שבזהירות סבירה היה אפשר לדעת.')}</div>`
		+ `<fieldset class="jtool-field"><legend>מה התגלה באיחור</legend><div class="jtool-chips">${chip('found', 'damage', 'הנזק עצמו (סעיף 89(2): עד 10 שנים מהנזק)', i.found !== 'link')}${chip('found', 'link', 'הנזק היה ידוע; הקשר לטיפול או הרשלנות התבררו מאוחר (סעיף 8)', i.found === 'link')}</div></fieldset>`
		+ `<details class="jtool-more ${P}-more"${more ? ' open' : ''}><summary>עוד מצבים שמזיזים את המועד: פטירה, ליקוי, תביעה שהוגשה, פוליסה</summary>`
		+ `<div class="jtool-row">${date('death', 'המטופל נפטר ביום', i.death, 'לתביעת העיזבון ולתביעת התלויים')}</div>`
		+ `<div class="jtool-chips ${P}-checks">${chip('incap', '1', 'המטופל לא היה מסוגל לדאוג לענייניו בגלל ליקוי נפשי או שכלי, ולא היה לו אפוטרופוס', Boolean(i.incap), 'checkbox')}</div>`
		+ `<div class="jtool-row" data-if-incap${i.incap ? '' : ' hidden'}>${date('ifrom', 'הליקוי התחיל ביום', i.incapFrom, 'ריק = מיום הטיפול')}${date('ito', 'הליקוי הסתיים, או מונה אפוטרופוס שידע, ביום', i.incapTo, 'ריק = עדיין נמשך')}</div>`
		+ `<div class="jtool-row">${date('filed', 'תביעה הוגשה לבית המשפט ביום', i.filed, 'ההגשה עוצרת את השעון')}${date('dism', 'התביעה נמחקה או נדחתה כך שאפשר להגיש חדשה, ביום', i.dismissed, 'לא דחייה לגופו של עניין')}</div>`
		+ `<div class="jtool-row">${sel('pol', 'פוליסה פרטית של המטופל', i.policy, [['none', 'אין, או לא רלוונטי'], ['accident', 'ביטוח תאונות אישיות או נכות (3 שנים)'], ['health', 'ביטוח בריאות, מחלות, אשפוז או סיעודי (5 שנים)']])}${date('pright', 'היום שבו קמה הזכות לפי הפוליסה', i.policyRight, 'בנכות: לפי תנאי הפוליסה; ריק = יום הטיפול')}</div>`
		+ '</details>';
}

/** One plain sentence: the safe day, the conditional day, what is left. */
export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const parts = [];
	const lead = r.lead;
	const who = r.death ? 'לתביעת העיזבון' : 'להגשת התביעה';
	if (r.filed && !r.dismissed) {
		parts.push(r.filedStatus === 'ok' ? `התביעה הוגשה ב-${isoToHe(r.filed)}, לפני היום האחרון הבטוח (${isoToHe(lead.deadline)}): ההגשה עצרה את השעון.` : r.filedStatus === 'alt' ? `התביעה הוגשה ב-${isoToHe(r.filed)}, אחרי היום הבטוח (${isoToHe(lead.deadline)}): היא בזמן רק אם יתקבל אחד המועדים המותנים.` : `התביעה הוגשה ב-${isoToHe(r.filed)}, אחרי כל המועדים שהכלי מחשב: צריך חריג, ועורך דין.`);
		return parts.join(' ');
	}
	parts.push(`היום האחרון הבטוח ${who} הוא ${isoToHe(lead.deadline)} (${leadHe(reg, lead)}).`);
	const alt = altOf(r);
	if (alt) { parts.push(`${ifHe(alt)}: עד ${isoToHe(alt.deadline)}.`); }
	if (r.parents) { parts.push(`תביעת ההורים על נזקם שלהם: עד ${isoToHe(r.parents.deadline)}.`); }
	if (r.dependants) { parts.push(`תביעת התלויים: עד ${isoToHe(r.dependants.deadline)}.`); }
	if (r.daysLeft !== null) { parts.push(r.daysLeft >= 0 ? `נשארו ${dayHe(r.daysLeft)}.` : `המועד הבטוח עבר לפני ${dayHe(-r.daysLeft)}.`); }
	return parts.join(' ');
}

/** The clock ribbon: a time axis and one lane per reading, with a text equivalent. */
export function ribbon(reg, r) {
	if (!r.ok) { return ''; }
	const war = reg.car_accident.limitation.war;
	const lanes = r.readings.filter((x) => x.deadline);
	const ends = lanes.map((x) => x.deadline).concat(r.pol ? [r.pol.deadline] : []).concat(r.today ? [r.today] : []).concat(r.cap && r.late ? [r.cap.deadline] : []);
	const from = r.treatment;
	const to = ends.reduce((a, b) => (b > a ? b : a), addYears(from, 1));
	const span = Math.max(1, daysBetween(from, to));
	const pos = (d) => Math.min(100, Math.max(0, Math.round(daysBetween(from, d) / span * 1000) / 10));
	const years = Math.ceil(span / 365.25);
	const step = years <= 8 ? 1 : years <= 16 ? 2 : 5;
	const ticks = [];
	for (let y = step; addYears(from, y) <= to; y += step) { const d = addYears(from, y); ticks.push(`<span class="${P}-tick" style="inset-inline-start:${pos(d)}%"><bdi>${d.slice(0, 4)}</bdi></span>`); }
	const warBand = war.to >= from && war.from <= to ? `<span class="${P}-war" style="inset-inline-start:${pos(war.from > from ? war.from : from)}%;inline-size:${Math.max(0.6, pos(war.to) - pos(war.from > from ? war.from : from))}%"></span>` : '';
	const now = r.today && r.today >= from && r.today <= to ? `<span class="${P}-now" style="inset-inline-start:${pos(r.today)}%"></span>` : '';
	const lane = (x, label, tag, cls, extra) => {
		const s = x.start && x.start > from ? x.start : from;
		const pause = x.start && x.start > from && x.who !== 'dependants' && x.code !== 'estate_hendel' ? `<span class="${P}-pause" style="inset-inline-start:0%;inline-size:${pos(x.start)}%"></span>` : '';
		const lead = x === r.lead;
		return `<li class="${P}-lane ${P}-lane--${cls}${lead ? ` ${P}-lane--lead` : ''}${r.today && x.deadline < r.today ? ` ${P}-lane--gone` : ''}"><p class="${P}-lane__h"><span class="${P}-tag ${P}-tag--${cls}">${esc(tag)}</span> ${esc(label)} <bdi class="${P}-lane__d">${isoToHe(x.deadline)}</bdi></p>`
			+ `<div class="${P}-track" aria-hidden="true">${warBand}${pause}<span class="${P}-bar" style="inset-inline-start:${pos(s)}%;inline-size:${Math.max(0.8, pos(x.deadline) - pos(s))}%"></span>${extra || ''}<span class="${P}-end" style="inset-inline-start:${pos(x.deadline)}%"></span>${now}</div></li>`;
	};
	const rows = lanes.map((x) => {
		const cap = x.code === 'damage_late' && r.cap && r.cap.deadline !== x.deadline ? `<span class="${P}-cap" style="inset-inline-start:${pos(r.cap.deadline)}%"></span>` : '';
		return lane(x, `${whoHe(r, x)}: ${x.he}`, x === r.lead ? 'היום הבטוח' : KIND_HE[x.kind], x === r.lead ? 'lead' : x.kind, cap);
	});
	if (r.pol) { rows.push(lane({ start: r.pol.start, deadline: r.pol.deadline, who: 'policy' }, `הפוליסה הפרטית: ${r.pol.years} שנים`, 'פוליסה', 'policy')); }
	const marks = [];
	if (r.late) { marks.push(`<span class="${P}-pin" style="inset-inline-start:${pos(r.discovered)}%" title="${esc(`גילוי: ${isoToHe(r.discovered)}`)}">ג</span>`); }
	if (r.minor && r.adult18 && r.adult18 <= to) { marks.push(`<span class="${P}-pin" style="inset-inline-start:${pos(r.adult18)}%" title="${esc(`גיל 18: ${isoToHe(r.adult18)}`)}">18</span>`); }
	if (r.death) { marks.push(`<span class="${P}-pin" style="inset-inline-start:${pos(r.death)}%" title="${esc(`פטירה: ${isoToHe(r.death)}`)}">פ</span>`); }
	if (r.filed) { marks.push(`<span class="${P}-pin ${P}-pin--filed" style="inset-inline-start:${pos(r.filed)}%" title="${esc(`הגשה: ${isoToHe(r.filed)}`)}">ת</span>`); }
	const sum = `השעון מיום הטיפול ${isoToHe(r.treatment)}${r.today ? ` עד היום ${isoToHe(r.today)}` : ''}. ${lanes.map((x) => `${KIND_HE[x.kind]}${x === r.lead ? ', היום הבטוח' : ''}: ${whoHe(r, x)}, ${x.he}, עד ${isoToHe(x.deadline)}`).join('. ')}.${r.cap && r.late ? ` תקרת 10 השנים מיום הנזק: ${isoToHe(r.cap.deadline)}.` : ''}${r.pol ? ` הפוליסה: עד ${isoToHe(r.pol.deadline)}.` : ''}`;
	const keys = [`<li><span class="${P}-k ${P}-k--lead"></span>היום הבטוח</li>`, `<li><span class="${P}-k ${P}-k--alt"></span>מותנה</li>`, `<li><span class="${P}-k ${P}-k--open"></span>שאלה פתוחה</li>`, `<li><span class="${P}-k ${P}-k--pause"></span>השעון עוד לא רץ</li>`]
		.concat(warBand ? [`<li><span class="${P}-k ${P}-k--war"></span>ימי המלחמה, לא נספרים</li>`] : []).concat(now ? [`<li><span class="${P}-k ${P}-k--now"></span>היום</li>`] : [])
		.concat(r.late && r.cap ? [`<li><span class="${P}-k ${P}-k--cap"></span>תקרת 10 השנים</li>`] : []);
	return `<figure class="${P}-rib"><figcaption class="${P}-rib__h">שעון ההתיישנות: מיום הטיפול ${isoToHe(r.treatment)} עד ${isoToHe(r.lead.deadline)}</figcaption>`
		+ `<p class="jtool-visually-hidden">${esc(sum)}</p>`
		+ `<div class="${P}-axis" aria-hidden="true"><span class="${P}-tick ${P}-tick--0" style="inset-inline-start:0%"><bdi>${from.slice(0, 4)}</bdi></span>${ticks.join('')}${marks.join('')}</div>`
		+ `<ol class="${P}-lanes">${rows.join('')}</ol>`
		+ `<ul class="${P}-keys" aria-hidden="true">${keys.join('')}</ul></figure>`;
}

/** The scenario for the expert's cross-examination: computed facts only, never a name, an ID or a hospital. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const who = r.minor ? 'מטופל שהיה קטין ביום הטיפול' : 'מטופל בגיר';
	const disc = r.late ? `${r.found === 'damage' ? 'הנזק עצמו התגלה' : 'הקשר בין הנזק לטיפול התברר'} רק ב-${isoToHe(r.discovered)}.` : 'הנזק התגלה סמוך לטיפול.';
	const alt = altOf(r);
	const dates = `לפי הקריאה הבטוחה של חוק ההתיישנות, היום האחרון להגשת התביעה הוא ${isoToHe(r.lead.deadline)}${alt ? `; ${ifHe(alt)}: ${isoToHe(alt.deadline)}` : ''}.`;
	const death = r.death ? ` המטופל נפטר, והתביעה עברה לעיזבון.` : '';
	return `טיפול רפואי ב-${isoToHe(r.treatment)}, ${who}. ${disc}${death} ${dates} השאלה לתרגול: חקירה נגדית של המומחה הרפואי מטעם בית החולים, שטוען שאפשר היה לגלות את הנזק ואת הקשר לטיפול כבר מוקדם יותר. מה ידע המטופל ומתי, אילו סימנים הופיעו, ומה זהירות סבירה הייתה מגלה?`;
}

/** The share link of this tool, for its siblings: '/medical-malpractice-statute-of-limitations/#s=<state>'. Dates only. */
export function stateLink(reg, input) {
	return `${PAGE}#s=${stateOf(input)}`;
}
/**
 * The records-request generator (bakashat-reshuma) with the reader's dates, by its own keys (reshuma-ui.js KEYS, read from the
 * records lane's worktree on 22.10.2026 22:59): w who asks (s the patient, p a parent of a minor today, h an heir), t the
 * treatment day, b the birth day (a minor), x the death day. The documents are not known here: its page fills them from its
 * example and says so. Codes and dates only.
 */
export function recordsLink(r) {
	if (!r || !r.ok) { return HT_RECORDS_PAGE; }
	const heir = Boolean(r.death);
	const minorNow = Boolean(r.minor && r.adult18 && r.today && r.adult18 > r.today);
	return `${HT_RECORDS_PAGE}#s=${encodeState({ w: heir ? 'h' : minorNow ? 'p' : 's', t: r.treatment, b: r.minor && r.birth ? r.birth : '', x: heir ? r.death : '' })}`;
}
/**
 * The "do I have a case" check (tik-rashlanut) with the reader's facts, by its own keys (tik-ui.js KEYS, read from the case
 * lane's worktree on 22.10.2026 22:59): k b for an injury at birth, p the patient (a adult, m minor, b baby), e the event day,
 * b the birth day (a minor), o d for a death, g the discovery day. The kind of treatment and what the reader holds are not known
 * here: its page fills them from its example and says so. Codes and dates only.
 */
export function caseLink(r) {
	if (!r || !r.ok) { return HT_CASE_PAGE; }
	const atBirth = Boolean(r.minor && r.birth === r.treatment);
	return `${HT_CASE_PAGE}#s=${encodeState({ k: atBirth ? 'b' : '', p: atBirth ? 'b' : r.minor ? 'm' : 'a', e: r.treatment, b: r.minor && !atBirth ? r.birth : '', o: r.death ? 'd' : '', g: r.late ? r.discovered : '' })}`;
}

/** The "what to do now" list: the official routes first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const mh = reg.malpractice_hityashnut;
	const sh = reg.injury_sheon;
	const out = [
		{ he: `${sh.patient.he}, ${sh.patient.section}: העתק של הרשומה הרפואית, מהיום`, url: sh.patient.url },
		{ he: 'משרד הבריאות: תלונה לנציבות קבילות הציבור למקצועות רפואיים (לא עוצרת את השעון)', url: mh.tracks.find((t) => t.code === 'professions').url },
	];
	const links = [
		{ path: recordsLink(r), he: 'מכתב בקשה לתיק הרפואי: מה מגיע ותוך כמה זמן' },
		{ path: caseLink(r), he: 'האם יש עילה: חמשת היסודות ומה מוכיח כל אחד' },
	];
	if (r.death) { links.push({ path: '/succession-law-israel/', he: 'מי היורשים: העיזבון הוא שתובע' }); } else if (r.minor) { links.push({ path: '/birth-injury/', he: 'פגיעה בלידה: מה בודקים בתיק' }); } else { links.push({ path: HT_COST_PAGE, he: 'כמה עולה תביעה: חוות דעת, אגרה ושכר טרחה' }); }
	links.push({ path: '/attaching-expert-opinion-claim/', he: 'חוות דעת רפואית לכתב התביעה: למה מתחילים מוקדם' });
	return { official: out, links: links.slice(0, 4) };
}

/** The readings side by side: whose claim, the last day, the rule, the condition, safe / conditional / open. */
export function readingsTable(reg, r) {
	const rows = r.readings.map((x) => {
		const cases = (x.cases || []).map((c) => { const k = caseOf(reg, c); return k ? cite(k.file, k.url) : ''; }).join('');
		const gone = r.today && x.deadline && x.deadline < r.today;
		return `<tr class="${P}-r ${P}-r--${x === r.lead ? 'lead' : x.kind}${gone ? ' jtool-muted' : ''}"><td data-th="של מי">${esc(whoHe(r, x))}</td><td data-th="היום האחרון">${x.deadline ? `<bdi>${isoToHe(x.deadline)}</bdi>${gone ? ' (עבר)' : ''}` : 'אין עדיין תאריך'}</td><td data-th="הכלל">${esc(x.he)}${cite(x.section, x.url)}</td><td data-th="התנאי">${esc(x.cond)}${cases}</td><td data-th="מה זה"><span class="${P}-tag ${P}-tag--${x === r.lead ? 'lead' : x.kind}">${x === r.lead ? 'היום הבטוח' : esc(KIND_HE[x.kind])}</span></td></tr>`;
	}).join('');
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-rd-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">של מי</th><th scope="col">היום האחרון</th><th scope="col">הכלל</th><th scope="col">התנאי</th><th scope="col">מה זה</th></tr></thead><tbody>${rows}</tbody>`
		+ '<caption>היום הבטוח הוא המוקדם מבין הקריאות שעשויות לחול. מועד מותנה תלוי בעובדה שצריך להוכיח; שאלה פתוחה היא שאלה שבית המשפט העליון לא הכריע בה.</caption></table></div>';
}

/** The tracks beside the court clock: none has a deadline in the texts read, none stops the clock. */
export function tracksTable(reg, r) {
	const mh = reg.malpractice_hityashnut;
	const sh = reg.injury_sheon;
	const rows = mh.tracks.map((t) => `<tr><td data-th="המסלול">${esc(t.he)}</td><td data-th="מי מטפל">${esc(t.who_he)}</td><td data-th="מועד">${esc(t.deadline_he)}</td><td data-th="עוצר את השעון?">לא</td><td data-th="מקור">${cite(t.section || 'השירות באתר משרד הבריאות', t.url)}${t.law_url ? cite('נוסח החוק', t.law_url) : ''}${t.booklet_url ? cite('חוברת ועדות הבדיקה', t.booklet_url) : ''}</td></tr>`);
	if (r && r.ok && r.pol) { rows.push(`<tr class="${P}-mine"><td data-th="המסלול">התביעה לפי הפוליסה הפרטית</td><td data-th="מי מטפל">חברת הביטוח</td><td data-th="מועד"><bdi>${isoToHe(r.pol.deadline)}</bdi> (${r.pol.years} שנים)</td><td data-th="עוצר את השעון?">לא; גם מסירת התביעה למבטח לא עוצרת את הפוליסה</td><td data-th="מקור">${cite(`${sh.insurance.limit_section} ו${sh.insurance.warn_section} לחוק חוזה הביטוח`, sh.insurance.url)}</td></tr>`); }
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-tk-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">המסלול</th><th scope="col">מי מטפל</th><th scope="col">מועד</th><th scope="col">עוצר את השעון?</th><th scope="col">מקור</th></tr></thead><tbody>${rows.join('')}</tbody>`
		+ `<caption>${esc(mh.tracks_he)}. נבדק ${isoToHe(mh.checked_on)} בנוסח החוקים ובדפי משרד הבריאות.</caption></table></div>`;
}

/** What the Supreme Court said: words and file numbers, never a computed number. */
export function caseList(reg, r, all) {
	const codes = all ? reg.malpractice_hityashnut.case_law.map((c) => c.code) : Array.from(new Set(['s8_vs_89', 'objective'].concat(...r.readings.map((x) => x.cases || []))));
	return `<ul class="${P}-cases">${codes.map((c) => caseOf(reg, c)).filter(Boolean).map((c) => `<li class="${P}-case ${P}-case--${c.status}"><span class="${P}-tag ${P}-tag--${c.status === 'open' ? 'open' : 'safe'}">${c.status === 'open' ? 'פתוח' : 'הלכה'}</span> <strong>${esc(c.file)}</strong> ${esc(c.name_he)}, <bdi>${isoToHe(c.date)}</bdi>: ${esc(c.point_he)}.${cite('פסק הדין', c.url)}</li>`).join('')}</ul>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const L0 = reg.car_accident.limitation;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	const lead = r.lead;
	const state = r.filed && !r.dismissed ? (r.filedStatus === 'ok' ? '<p class="jtool-state jtool-state--ok">✓ התביעה הוגשה בזמן: השעון נעצר</p>' : r.filedStatus === 'alt' ? '<p class="jtool-state jtool-state--warn">! הוגשה אחרי היום הבטוח: תלוי בתנאי</p>' : '<p class="jtool-state jtool-state--danger">! הוגשה אחרי כל המועדים: צריך חריג</p>')
		: r.status === 'expired' ? '<p class="jtool-state jtool-state--danger">! לפי הקריאה הבטוחה המועד עבר: בדקו את החריגים למטה</p>'
			: r.status === 'expired-safe' ? '<p class="jtool-state jtool-state--warn">! היום הבטוח עבר; נשאר מועד מותנה</p>'
				: lead.kind === 'open' ? '<p class="jtool-state jtool-state--warn">! הקריאה המחמירה של שאלה פתוחה</p>'
					: `<p class="jtool-state jtool-state--ok">✓ לפי ${esc(L0.section)} לחוק ההתיישנות${r.pMinor ? ` ו${esc(L0.minor_section)}` : ''}</p>`;
	const rows = [];
	if (r.daysLeft !== null) { rows.push(`<div><dt>${r.daysLeft >= 0 ? 'ימים עד היום הבטוח' : 'ימים מאז היום הבטוח'}</dt><dd><bdi>${money(Math.abs(r.daysLeft), 0)}</bdi></dd></div>`); }
	const alt = altOf(r);
	if (alt) { rows.push(`<div><dt>${alt.kind === 'open' ? 'לפי הקריאה המקילה' : 'מותנה בהוכחה'}</dt><dd><bdi>${isoToHe(alt.deadline)}</bdi></dd></div>`); }
	if (r.parents) { rows.push(`<div><dt>תביעת ההורים</dt><dd><bdi>${isoToHe(r.parents.deadline)}</bdi></dd></div>`); }
	if (r.dependants) { rows.push(`<div><dt>תביעת התלויים</dt><dd><bdi>${isoToHe(r.dependants.deadline)}</bdi></dd></div>`); }
	if (r.cap && r.late) { rows.push(`<div><dt>תקרת 10 השנים</dt><dd><bdi>${isoToHe(r.cap.deadline)}</bdi></dd></div>`); }
	if (r.pol) { rows.push(`<div><dt>הפוליסה הפרטית</dt><dd><bdi>${isoToHe(r.pol.deadline)}</bdi></dd></div>`); }
	if (r.daysSince !== null) { rows.push(`<div><dt>מאז הטיפול</dt><dd>${esc(dayHe(r.daysSince))}</dd></div>`); }
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${r.death ? 'תביעת העיזבון' : 'תביעת רשלנות רפואית'}, היום האחרון הבטוח להגשה</p>`
		+ `<strong class="jtool-verdict__figure"><bdi>${isoToHe(lead.deadline)}</bdi></strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ ribbon(reg, r)
		+ (r.flags.length ? `<ul class="jtool-flags ${P}-flags">${r.flags.map((f) => `<li class="${P}-flag ${P}-flag--${f.level}">${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-box"><h3 class="${P}-h" id="${P}-rd-h">המועדים זה לצד זה, כל אחד עם התנאי שלו</h3>${readingsTable(reg, r)}</div>`
		+ `<div class="${P}-box"><h3 class="${P}-h" id="${P}-tk-h">המסלולים שליד השעון: תלונה, ועדת בדיקה, קובלנה, פוליסה</h3>${tracksTable(reg, r)}</div>`
		+ `<div class="${P}-box"><h3 class="${P}-h">מה אמר בית המשפט העליון</h3>${caseList(reg, r)}<p class="${P}-note">פסקי הדין מתוארים במילים, עם מספר התיק; הכלי לא הופך אותם למספר.</p></div>`
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${HT_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל חקירה נגדית של המומחה</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** The rules of the malpractice clock, one row each: the page table (compare_table). */
export function rulesTable(reg) {
	const L0 = reg.car_accident.limitation;
	const sh = reg.injury_sheon;
	const SL = sh.limitation;
	const ST = sh.torts;
	const I = sh.insurance;
	const mh = reg.malpractice_hityashnut;
	const ML = mh.limitation;
	const MT = mh.torts;
	const rows = [
		['תביעת רשלנות רפואית על נזק גוף', `${L0.years} שנים`, 'מהיום שבו נולדה העילה: היום שבו אירע הנזק', `${L0.section} ו${SL.start_section} לחוק ההתיישנות; ${ST.late_cap_section} לפקודת הנזיקין`, L0.url],
		['הנזק עצמו התגלה מאוחר', `${L0.years} שנים, ולכל היותר ${ST.late_cap_years} מיום הנזק`, 'מיום הגילוי', `${ST.late_cap_section} לפקודת הנזיקין; ${caseRef(reg, 's8_vs_89')}`, ST.url],
		['הנזק ידוע, הקשר לטיפול או הרשלנות התבררו מאוחר', `${L0.years} שנים, בלי תקרה`, 'מהיום שבו נודעו, אם גם בזהירות סבירה לא היו מתגלים קודם', `${SL.late_section} לחוק ההתיישנות; ${caseRef(reg, 'no_cap_link')}`, L0.url],
		['קטין ביום הטיפול', `${L0.years} שנים`, `מיום ההולדת ה-${L0.adult_age}, כלומר עד גיל 25`, `${L0.minor_section} לחוק ההתיישנות; ${caseRef(reg, 'minor_25')}`, L0.url],
		['קטין, ונזק שהתגלה מאוחר', 'לא הוכרע', `אם תקרת ${ST.late_cap_years} השנים רצה גם לפני גיל ${L0.adult_age}`, `${ST.late_cap_section}; ${L0.minor_section}; ${caseRef(reg, 'minor_cap')}`, ST.url],
		['ההורים על נזקם שלהם', `${L0.years} שנים`, 'מיום הטיפול או הלידה; הקטינות של הילד לא עוצרת', `${L0.minor_section} לחוק ההתיישנות; ${caseRef(reg, 'minor_25')}`, L0.url],
		['ליקוי נפשי או שכלי בלי אפוטרופוס', 'הזמן לא נספר', `ולפחות ${ML.incapacity_floor_years} שנים מסוף הליקוי`, `${SL.incapacity_section} ו${ML.after_stay_section} לחוק ההתיישנות`, L0.url],
		['הטעיה ביודעין, כולל הסתרת עובדה', 'המרוץ מושעה', 'כל עוד ההטעיה מונעת את התביעה', `${SL.misconduct_section} לחוק ההתיישנות`, L0.url],
		['הודאה בכתב או תשלום של חלק', 'מתחיל מחדש', 'מיום ההודאה', `${SL.admission_section} לחוק ההתיישנות`, L0.url],
		['המטופל נפטר: תביעת העיזבון', 'אותו מועד של המטופל', `ולא פחות משנה מהפטירה; לילד שנפטר העיכוב לא עובר ליורשים`, `${MT.estate_section} לפקודת הנזיקין; ${ML.inheritance_section} לחוק ההתיישנות; ${caseRef(reg, 'estate_minor')}`, MT.url],
		['המטופל נפטר: תביעת התלויים', `${L0.years} שנים`, `מיום הפטירה; ${MT.who_files_months} חודשים ראשונים מגיש העיזבון`, `${MT.dependants_section}-${MT.who_files_section.replace('סעיף ', '')} לפקודת הנזיקין`, MT.url],
		['הוגשה תביעה', 'השעון נעצר', 'ביום ההגשה; פנייה, תלונה או מכתב לא עוצרים', `${ML.filed_section} לחוק ההתיישנות`, L0.url],
		['תביעה שנמחקה ואפשר להגיש חדשה', 'הזמן שהייתה תלויה לא נספר', `ולפחות ${ML.after_dismissal_years} שנה מהמחיקה`, `${ML.dismissed_section} ו${ML.after_stay_section} לחוק ההתיישנות`, L0.url],
		['תקופת המלחמה', `לא נספרים ${isoToHe(L0.war.from)} עד ${isoToHe(L0.war.to)}`, 'בכל תביעה אזרחית שתקופתה רצה ערב התיקון', `${L0.war.section} ו${SL.war_other_laws_section}`, L0.url],
		['היום האחרון ביום מנוחה', 'עובר ליום שאחריו', 'שבת, חג או יום העצמאות', L0.interpretation_he, L0.url],
		['בית חולים ממשלתי', 'אותם כללים', 'החוק חל גם על המדינה', `${ML.state_section} לחוק ההתיישנות`, L0.url],
		['תביעה לפי פוליסה פרטית', `${I.limit_years} שנים; ${I.limit_long_years} ב${I.limit_long_he}`, 'מיום מקרה הביטוח; בנכות מיום שקמה הזכות', `${I.limit_section} לחוק חוזה הביטוח`, I.url],
		['תלונה, ועדת בדיקה, קובלנה משמעתית', 'אין מועד בנוסחים שנקראו', 'לא עוצרות את השעון', 'סעיפים 21 ו-25 לחוק זכויות החולה; סעיף 41 לפקודת הרופאים', reg.injury_sheon.patient.url],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הכללים של שעון ההתיישנות ברשלנות רפואית: מה, כמה זמן, ומאיזה יום. ${esc(L0.he)} (נוסח ל-${isoToHe(ML.current_to)}), ${esc(ST.he)} (נוסח ל-${isoToHe(ST.current_to)}), ${esc(I.he)}, ופסקי הדין של בית המשפט העליון; נבדק ${isoToHe(mh.checked_on)}.</caption><thead><tr><th scope="col">מה</th><th scope="col">כמה זמן</th><th scope="col">מאיזה יום</th><th scope="col">הסעיף</th></tr></thead><tbody>`
		+ rows.map(([what, len, from, src, url]) => `<tr><td data-th="מה">${esc(what)}</td><td data-th="כמה זמן">${esc(len)}</td><td data-th="מאיזה יום">${esc(from)}</td><td data-th="הסעיף">${cite(src, url)}</td></tr>`).join('')
		+ '</tbody></table></div>';
}

/** What changed and when: only dated official texts, and the bill that was never enacted, marked as such. */
export function changesTable(reg) {
	const mh = reg.malpractice_hityashnut;
	const L0 = reg.car_accident.limitation;
	const rows = [
		{ when: isoToHe(mh.torts.from), what: `פקודת הנזיקין [נוסח חדש] נכנסה לתוקף, עם ${reg.injury_sheon.torts.late_cap_section}: גילוי מאוחר של נזק, עד ${reg.injury_sheon.torts.late_cap_years} שנים מיום הנזק`, src: `${mh.torts.from_section} לפקודה`, url: mh.torts.url },
		{ when: '2004', what: `${mh.bill_2004.what_he}. ${mh.bill_2004.status_he}`, src: mh.bill_2004.he, url: mh.bill_2004.url },
		{ when: `${isoToHe(L0.war.from)}-${isoToHe(L0.war.to)}`, what: 'ימי המלחמה שלא נספרים בהתיישנות (חרבות ברזל)', src: `${L0.war.section} לחוק ההתיישנות`, url: L0.url },
		{ when: isoToHe(mh.limitation.war_published), what: `${mh.limitation.war_published_he}. תקופה שהסתיימה לפני הפרסום נחשבת כלא הסתיימה, אבל בית המשפט רשאי להחליט אחרת (סעיף 15א(ג)-(ד))`, src: 'ספר החוקים 3151', url: mh.limitation.war_published_url },
	];
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">מתי</th><th scope="col">מה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתי"><bdi>${esc(x.when)}</bdi></td><td data-th="מה">${esc(x.what)}</td><td data-th="מקור">${cite(x.src, x.url)}</td></tr>`).join('')
		+ '</tbody><caption>רק נוסחים רשמיים עם התאריך שלהם; הצעת החוק משנת 2004 מסומנת כמו שהיא: לא נחקקה.</caption></table></div>';
}

function datesTable(reg, r, opts = {}) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = opts.today && e.kind !== 'start' && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.he)}</td><td data-th="הכלל">${e.section || e.url ? cite(e.section || 'מקור רשמי', e.url) : ''}</td></tr>`; }).join('')
		+ `</tbody><caption>רק מועדים שחוק קובע. מועד שנופל ביום מנוחה עובר ליום שאחריו (${esc(reg.car_accident.limitation.interpretation_he)}).</caption></table></div>`;
}

function methodList(reg, r) {
	const L0 = reg.car_accident.limitation;
	const sh = reg.injury_sheon;
	const items = [];
	items.push(`יום הטיפול ${isoToHe(r.treatment)}: ${sh.limitation.start_he} (${sh.limitation.start_section}); ברשלנות, היום שבו אירע הנזק (${sh.torts.late_cap_section}). הכלי סופר מיום הטיפול, המוקדם ביותר`);
	if (r.pMinor) { items.push(`קטין: הזמן עד גיל ${L0.adult_age} לא נספר (${L0.minor_section}): ההתחלה ${isoToHe(r.adult18)}`); }
	if (r.diedMinor) { items.push(`ילד שנפטר ב-${isoToHe(r.death)}: עיכוב הקטינות לא עובר ליורשים בגירים (${caseRef(reg, 'estate_minor')}); נספר מיום הטיפול`); }
	for (const x of r.readings) {
		if (!x.deadline) { items.push(`${whoHe(r, x)}: ${x.he}. ${x.cond}`); continue; }
		const parts = [];
		if (x.floor === 'death') { parts.push(`שנה מהפטירה: ${isoToHe(x.plain)}`); } else if (x.floor === 'dismissed') { parts.push(`שנה מהמחיקה: ${isoToHe(x.plain)}`); } else if (x.plain) { parts.push(`${x.capped ? `${sh.torts.late_cap_years} שנים מיום הנזק` : `${L0.years} שנים מ-${isoToHe(x.start)}`}: ${isoToHe(x.plain)}`); }
		if (x.added) { parts.push(`ועוד ${x.added} ימי המלחמה (${L0.war.section})`); }
		if (x.extra) { parts.push(`ועוד ${x.extra} ימי ליקוי (${sh.limitation.incapacity_section})`); }
		if (x.pending && x.floor !== 'dismissed') { parts.push(`ועוד ${x.pending} ימים שהתביעה הייתה תלויה (${reg.malpractice_hityashnut.limitation.dismissed_section})`); }
		if (x.rolled) { parts.push(`ומעבר מיום מנוחה (${L0.interpretation_he})`); }
		items.push(`${x === r.lead ? 'היום הבטוח' : KIND_HE[x.kind]}, ${whoHe(r, x)}: ${parts.join(', ')} = ${isoToHe(x.deadline)}`);
	}
	if (r.pol) { items.push(`פוליסה: ${r.pol.years} שנים מ-${isoToHe(r.pol.start)} (${sh.insurance.limit_section})${r.pol.added ? `, ועוד ${r.pol.added} ימי מלחמה` : ''}: ${isoToHe(r.pol.deadline)}; התרעות המבטח ${r.pol.warns.map((w) => isoToHe(w.date)).join(' ו-')} (${sh.insurance.warn_section})`); }
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

/** The one-page print: inputs, result, the readings, the dates, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const mh = reg.malpractice_hityashnut;
	const sh = reg.injury_sheon;
	const facts = [`יום הטיפול ${isoToHe(r.treatment)}`];
	if (r.birth && r.minor) { facts.push(`תאריך לידה ${isoToHe(r.birth)}`); }
	if (r.late) { facts.push(`${r.found === 'damage' ? 'הנזק התגלה' : 'הקשר התברר'} ${isoToHe(r.discovered)}`); }
	if (r.death) { facts.push(`פטירה ${isoToHe(r.death)}`); }
	if (r.incap) { facts.push(`ליקוי${r.incapTo ? ` עד ${isoToHe(r.incapTo)}` : ' נמשך'}`); }
	if (r.filed) { facts.push(`תביעה הוגשה ${isoToHe(r.filed)}${r.dismissed ? `, נמחקה ${isoToHe(r.dismissed)}` : ''}`); }
	return '<h3>שעון ההתיישנות ברשלנות רפואית: סיכום</h3>'
		+ `<p><strong>הנתונים:</strong> ${esc(facts.join('; '))}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p>${methodList(reg, r)}`
		+ `<p><strong>המועדים:</strong> ${r.readings.filter((x) => x.deadline).map((x) => `${whoHe(r, x)}, ${x === r.lead ? 'היום הבטוח' : KIND_HE[x.kind]}: ${isoToHe(x.deadline)} (${esc(x.cond)})`).join('; ')}.</p>`
		+ `<p><strong>ליד השעון:</strong> ${esc(mh.tracks_he)}.</p>`
		+ `<p><strong>מקורות:</strong> ${esc(sh.limitation.he)}, נוסח ל-${isoToHe(mh.limitation.current_to)}; ${esc(sh.torts.he)}, נוסח ל-${isoToHe(sh.torts.current_to)}; ${esc(sh.insurance.he)}; חוק זכויות החולה; פסקי הדין ${esc(Array.from(new Set(r.readings.flatMap((x) => x.cases || []))).map((c) => caseRef(reg, c)).filter(Boolean).join(', ') || caseRef(reg, 's8_vs_89'))}. נבדק ${isoToHe(mh.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חושב, צעד אחר צעד</h3></div>${methodList(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">כל המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${datesTable(reg, r, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-cl-h">כל פסקי הדין שהכלי מתאר</h3></div>${caseList(reg, r, true)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || reg.malpractice_hityashnut.checked_on)}</div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): the safe last day of the example (or of the reader),
 * the conditional day in one line, and a jump to the form. Same markup on the server and in the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי יום הטיפול שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">שעון ההתיישנות ברשלנות רפואית</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const L0 = reg.car_accident.limitation;
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}טיפול ב-${isoToHe(r.treatment)}${r.late ? `, ${r.found === 'damage' ? 'הנזק התגלה' : 'הקשר התברר'} ב-${isoToHe(r.discovered)}` : ''}${r.death ? `, פטירה ב-${isoToHe(r.death)}` : ''}`;
	const alt = altOf(r);
	const line = `${r.lead.he}${r.lead.added && !r.lead.floor ? ` (${r.lead.added} ימי המלחמה לא נספרים, ${L0.war.section})` : ''}${r.lead.rolled ? ', אחרי מעבר מיום מנוחה' : ''}, לפי ${L0.section} לחוק ההתיישנות.${alt ? ` ${ifHe(alt)}: עד ${isoToHe(alt.deadline)}.` : ''}${r.parents ? ` ההורים, על נזקם שלהם: עד ${isoToHe(r.parents.deadline)}.` : ''}`;
	const unit = r.filed && !r.dismissed ? 'התביעה הוגשה: השעון נעצר' : 'היום האחרון הבטוח להגשת התביעה';
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure"><bdi>${isoToHe(r.lead.deadline)}</bdi></strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const r = htCompute(reg, EXAMPLE);
	const L0 = reg.car_accident.limitation;
	const sh = reg.injury_sheon;
	const alt = r.later.find((x) => x.kind === 'alt');
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.daysLeft,
		sticky: `<bdi>${isoToHe(r.lead.deadline)}</bdi>`,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { today: EXAMPLE.today, printedOn: EXAMPLE.today }),
		method: `<ol><li>יום הטיפול ${isoToHe(EXAMPLE.treatment)}: מכאן נספרת ההתיישנות, כי הנזק לא יכול לקרות לפני הטיפול${cite(sh.limitation.start_section, L0.url)}${cite(sh.torts.late_cap_section, sh.torts.url)}</li>`
			+ `<li>${L0.years} שנים: ${isoToHe(r.lead.plain)}${cite(L0.section, L0.url)}</li>`
			+ `<li>ועוד ${r.lead.added} ימים מ-${isoToHe(L0.war.from)} עד ${isoToHe(L0.war.to)} שלא נספרים: ${isoToHe(r.lead.deadline)}, היום האחרון הבטוח${cite(L0.war.section, L0.url)}</li>`
			+ `<li>הנזק עצמו התגלה ב-${isoToHe(EXAMPLE.discovered)}: אם יוכח שלא היה אפשר לגלות אותו קודם, ${L0.years} שנים מהגילוי ועוד ימי המלחמה: ${isoToHe(alt.deadline)}; התקרה של ${sh.torts.late_cap_years} שנים מיום הנזק (${isoToHe(r.cap.deadline)}) מאוחרת יותר${cite(sh.torts.late_cap_section, sh.torts.url)}</li></ol>`,
		compare_table: rulesTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

const PO = { none: 'n', accident: 'a', health: 'h' };
const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
/** t treatment, n minor, b birth, c discovered, w what was found late (d damage / l link), m death, i impairment, h its
 * start, k its end, f filed, x dismissed, p policy (n/a/h), q the right under the policy. Dates and codes only. */
export const KEYS = ['t', 'n', 'b', 'c', 'w', 'm', 'i', 'h', 'k', 'f', 'x', 'p', 'q'];
export function stateOf(i) {
	const minor = Boolean(i.minor || i.birth);
	return encodeState({
		t: i.treatment || '', n: minor ? 1 : '', b: minor ? i.birth || '' : '', c: i.discovered || '', w: i.discovered ? (i.found === 'link' ? 'l' : 'd') : '',
		m: i.death || '', i: i.incap ? 1 : '', h: i.incap ? i.incapFrom || '' : '', k: i.incap ? i.incapTo || '' : '',
		f: i.filed || '', x: i.filed ? i.dismissed || '' : '', p: i.policy && i.policy !== 'none' ? PO[i.policy] : '', q: i.policy && i.policy !== 'none' ? i.policyRight || '' : '',
	});
}
/**
 * Back from a share state. A state without the treatment day (a sibling that knows only some facts) takes it from `base`
 * (the page passes the example) and lists it in `filled`, so the page can say so; without `base` it returns null.
 */
export function inputOf(s, base) {
	if (!s || !KEYS.some((k) => s[k] !== undefined && s[k] !== '')) { return null; }
	if (!s.t && !base) { return null; }
	const filled = s.t ? [] : ['treatment'];
	return Object.assign({}, HT_BLANK, {
		treatment: s.t || base.treatment, minor: s.n === '1' || Boolean(s.b), birth: s.b || '', discovered: s.c || '', found: s.w === 'l' ? 'link' : 'damage',
		death: s.m || '', incap: s.i === '1', incapFrom: s.h || '', incapTo: s.k || '', filed: s.f || '', dismissed: s.x || '',
		policy: back(PO, s.p, 'none'), policyRight: s.q || '', filled,
	});
}

/* ---------------- Browser ---------------- */

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const checked = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const minor = checked('minor');
	const incap = checked('incap');
	return {
		treatment: htIso(val('tr')), today, minor, birth: minor ? htIso(val('birth')) : '', discovered: htIso(val('disc')), found: HT_FOUND.includes(pick('found', 'damage')) ? pick('found', 'damage') : 'damage',
		death: htIso(val('death')), incap, incapFrom: incap ? htIso(val('ifrom')) : '', incapTo: incap ? htIso(val('ito')) : '', filed: htIso(val('filed')), dismissed: htIso(val('dism')),
		policy: val('pol') || 'none', policyRight: htIso(val('pright')),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const mh = reg.malpractice_hityashnut;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(mh.checked_on, mh.refresh_every_days) || (mh.next_update && today >= mh.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהחוק התעדכן'); }
	}
	const ids = { treatment: 'tr', birth: 'birth', discovered: 'disc', death: 'death', incapFrom: 'ifrom', incapTo: 'ito', filed: 'filed', dismissed: 'dism', policyRight: 'pright' };
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
		form.querySelectorAll('[data-if-minor]').forEach((el) => { el.hidden = !input.minor; });
		form.querySelectorAll('[data-if-incap]').forEach((el) => { el.hidden = !input.incap; });
		const key = presetOf(input);
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = htCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today: input.today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? `<bdi>${isoToHe(r.lead.deadline)}</bdi>` : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: htBand(r) }); }
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
	// A share link may name its tool (/@shaon-refui); on a page with several tools only this tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS), EXAMPLE) : null;
	const fromHash = parsed ? Object.assign(parsed, { today }) : null;
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; if (fromHash.filled.length) { note.textContent = `${note.textContent} יום הטיפול לא הגיע בקישור: הוצב יום הדוגמה, ${isoToHe(EXAMPLE.treatment)}. תקנו אותו.`; } }
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
			const input = htPreset(b.getAttribute('data-preset'), today);
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
			download('shaon-refui.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `שעון ההתיישנות: ${e.he}`, description: `${e.section || 'מקור רשמי'}. חושב ב-jus-tice.co.il לפי כלל החוק; עורך דין בודק חריגים. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק תאריכים, בלי שמות ובלי תעודת זהות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(mh.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: htBand(r) });
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
