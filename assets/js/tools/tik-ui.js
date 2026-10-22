/**
 * The medical-malpractice wave UI (22.10.2026, HAD-594): "do I have a case" (tik-rashlanut, prefix jt68) on
 * /what-is-medical-malpractice-definition-examples/ (and embedded on /medical-malpractice-lawyer-birth-recommended/).
 * The picture is a patient's chart: a case file with five element tabs across its top (duty, breach, causation, damage,
 * informed consent), each tab coloured by its status (the facts point to it / to prove / missing), and under each tab the
 * evidence pinned to it like slips: what proves it and where it comes from. Under the chart: who carries the burden and when
 * it moves (s.41, the evidentiary damage of a missing record), the expert-opinion rule (reg. 87), the evidence to gather,
 * the parallel tracks (none of which stops the clock), the plain limitation date with a link to the full clock, what
 * changed and when, the scenario for the expert cross-examination rehearsal and the next steps; a one-page summary prints.
 * Never a verdict: the check says which elements the facts point to, what proves each and what is missing.
 */
import { tkCompute, tkBand, tkPatient } from './tik-engine.js';
import { addDays, parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'tik-rashlanut';
export const PAGE = '/what-is-medical-malpractice-definition-examples/';
const P = 'jt68';
const TK_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=witness_prep&topic=medical-malpractice';

/** One click to a full profile, each relative to today: the event so many days ago. */
export const PRESETS = {
	surgery: { he: 'ניתוח · בהרדמה · נזק קבוע', kind: 'surgery', patient: 'adult', back: 499, outcome: 'permanent', have: ['discharge'], informed: 'unknown', unaware: true },
	birth: { he: 'לידה · התינוק נפגע · יש מכתב שחרור', kind: 'birth', patient: 'baby', back: 420, outcome: 'permanent', have: ['discharge'], informed: 'unknown' },
	diagnosis: { he: 'אבחון מאוחר · המחלה התקדמה · רופא אחר אמר שטעו', kind: 'diagnosis', patient: 'adult', back: 900, outcome: 'progress', have: ['discharge', 'second'], informed: 'unknown' },
	consent: { he: 'לא הסבירו את הסיכונים · בלי נזק גופני', kind: 'consent', patient: 'adult', back: 200, outcome: 'none', have: ['consent'], informed: 'no' },
	dental: { he: 'שתלים · נזק זמני · יש טופס הסכמה', kind: 'dental', patient: 'adult', back: 150, outcome: 'temporary', have: ['consent'], informed: 'yes' },
};
const TK_BLANK = { kind: 'surgery', patient: 'adult', event: '', birth: '', today: '', outcome: 'permanent', have: [], informed: 'unknown', unaware: false, missing: false, discovered: '' };
/** A preset applied on a day: the event `back` days before it. */
export function tkPreset(key, today) {
	const p = PRESETS[key];
	if (!p) { return null; }
	return Object.assign({}, TK_BLANK, { kind: p.kind, patient: p.patient, outcome: p.outcome, have: p.have.slice(), informed: p.informed, unaware: Boolean(p.unaware), missing: false, event: addDays(today, -p.back), today });
}
export const EXAMPLE = tkPreset('surgery', '2026-10-22');

const KIND_HE = { birth: 'לידה', surgery: 'ניתוח', diagnosis: 'אבחון מאוחר או שגוי', anesthesia: 'הרדמה', medication: 'תרופה', dental: 'טיפול שיניים', consent: 'ההסבר לפני הטיפול' };
const PATIENT_HE = { adult: 'בגיר', minor: 'קטין', baby: 'התינוק נפגע', mother: 'היולדת נפגעה', both: 'התינוק והיולדת' };
const OUTCOME_HE = { permanent: 'נזק קבוע או נכות', temporary: 'נזק זמני', progress: 'המחלה התקדמה', death: 'המטופל נפטר', none: 'בלי נזק גופני ידוע' };
const HAVE_HE = { record: 'התיק הרפואי המלא', discharge: 'מכתב שחרור או סיכום ביקור', consent: 'טופס ההסכמה', second: 'רופא אחר אמר שטעו', opinion: 'חוות דעת של מומחה רפואי' };
const INFORMED_HE = { unknown: 'לא ברור', no: 'לא הסבירו', yes: 'הסבירו', emergency: 'זה היה מצב חירום' };
export const STATUS_HE = { facts: 'העובדות מצביעות עליו', prove: 'צריך להוכיח', missing: 'חסר' };
export const ELEMENT_HE = { duty: 'חובת זהירות', breach: 'הפרת החובה', causation: 'קשר סיבתי', damage: 'נזק', consent: 'הסכמה מדעת' };
const WHO_HE = { patient: 'המטופל', baby: 'התינוק', mother: 'היולדת' };
const KIND_PAGE = { birth: ['/birth-injury/', 'פגיעה בלידה: סוגי המקרים ומה בודקים'], surgery: ['/medical-malpractice-surgery/', 'רשלנות בניתוח: מה בודקים בדוח הניתוח'], diagnosis: ['/misdiagnosis-delayed-diagnosis/', 'אבחון מאוחר או שגוי: איך מוכיחים'], anesthesia: ['/anesthesia-medical-malpractice/', 'רשלנות בהרדמה: גיליון ההרדמה והסיכונים'], medication: ['/medical-malpractice-common-errors-doctors-hospitals/', 'טעויות נפוצות, גם בתרופות'], dental: ['/dental-malpractice/', 'רשלנות בטיפול שיניים'], consent: ['/informed-consent-treatment/', 'הסכמה מדעת: מה חייבים להסביר'] };

const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text || 'מקור')}</a>` : '');
const chip = (name, value, label, checked, type = 'radio', attr = '') => `<label class="jtool-chip"${attr}><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const tkIso = (text) => { const raw = String(text || '').trim(); return raw ? (parseDate(raw) || raw) : ''; };
const dayHe = (n) => (n === 1 ? 'יום אחד' : `${money(n, 0)} ימים`);
const listHe = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} ו${xs[xs.length - 1]}`);
const byStatus = (r, s) => r.elements.filter((e) => e.status === s).map((e) => ELEMENT_HE[e.code]);
/** An expert opinion proves the breach and the causation (reg. 87(a)); the other elements are proved by documents. */
const needsExpert = (r) => !r.expert.have && r.elements.some((e) => (e.code === 'breach' || e.code === 'causation') && e.status === 'prove');
const kindLabel = (r) => `${KIND_HE[r.kind]}${r.kind === 'birth' ? `, ${PATIENT_HE[r.patient]}` : r.patient === 'minor' ? ', קטין' : ''}`;
const whoDate = (p) => `${WHO_HE[p.who]}: ${isoToHe(p.deadline)}${p.minor ? ` (7 שנים מגיל 18)` : ''}`;

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, TK_BLANK, input || {});
	const birthKind = i.kind === 'birth';
	const pat = tkPatient(i.kind, i.patient);
	const preset = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return /^\d{4}-\d{2}-\d{2}$/.test(i.today || '') && i.event === addDays(i.today, -p.back) && p.kind === i.kind && p.patient === pat && p.outcome === i.outcome && p.informed === i.informed && p.have.join() === (i.have || []).join() && Boolean(p.unaware) === Boolean(i.unaware) && !i.missing; }) || '';
	const date = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 10.6.2025" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const have = i.have || [];
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא את כל השדות; אפשר לשנות כל שדה.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>מה קרה</legend><div class="jtool-chips">${Object.keys(KIND_HE).map((k) => chip('kind', k, k === 'consent' ? 'רק ההסבר לפני הטיפול' : KIND_HE[k], i.kind === k)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מי נפגע</legend><div class="jtool-chips ${P}-pat">`
		+ ['baby', 'mother', 'both'].map((k) => chip('pat', k, PATIENT_HE[k], birthKind && pat === k, 'radio', ` data-if-birth${birthKind ? '' : ' hidden'}`)).join('')
		+ ['adult', 'minor'].map((k) => chip('pat', k, k === 'adult' ? 'בגיר (מגיל 18) ביום הטיפול' : 'קטין ביום הטיפול', !birthKind && pat === k, 'radio', ` data-if-other${birthKind ? ' hidden' : ''}`)).join('')
		+ '</div></fieldset>'
		+ `<div class="jtool-row">${date('ev', 'יום הטיפול (בלידה: יום הלידה)', i.event, 'ממנו נספרות שבע השנים')}<div data-if-minor${!birthKind && pat === 'minor' ? '' : ' hidden'}>${date('birth', 'תאריך הלידה של המטופל', i.birth, 'רק לקטין: הזמן עד גיל 18 לא נספר')}</div></div>`
		+ `<fieldset class="jtool-field"><legend>מה הנזק</legend><div class="jtool-chips">${Object.keys(OUTCOME_HE).map((k) => chip('out', k, OUTCOME_HE[k], i.outcome === k)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>הוסבר לכם לפני הטיפול על הסיכונים ועל החלופות?</legend><div class="jtool-chips">${Object.keys(INFORMED_HE).map((k) => chip('inf', k, INFORMED_HE[k], i.informed === k)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מה כבר יש בידיכם</legend><div class="jtool-chips ${P}-checks">${Object.keys(HAVE_HE).map((k) => chip('have', k, HAVE_HE[k], have.includes(k), 'checkbox')).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>עובדות שמזיזות את נטל ההוכחה</legend><div class="jtool-chips ${P}-checks">${chip('una', '1', 'הייתי בהרדמה או לא יכולתי לדעת מה נעשה', Boolean(i.unaware), 'checkbox')}${chip('mis', '1', 'חלק מהרשומה חסר או לא נמסר', Boolean(i.missing), 'checkbox')}</div></fieldset>`
		+ `<details class="jtool-more ${P}-more"${i.discovered ? ' open' : ''}><summary>הנזק התגלה מאוחר יותר?</summary>${date('disc', 'הנזק, או הקשר שלו לטיפול, התגלה ביום', i.discovered, 'לא חובה. עובר לשעון, שמחשב גילוי מאוחר (סעיף 89(2) לפקודת הנזיקין)')}</details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const parts = [];
	const facts = byStatus(r, 'facts');
	const prove = byStatus(r, 'prove');
	const miss = byStatus(r, 'missing');
	parts.push(`לפי מה שהזנתם, העובדות מצביעות על ${facts.length ? listHe(facts) : 'אף יסוד עדיין'}.`);
	if (prove.length) { parts.push(`צריך להוכיח: ${listHe(prove)}${needsExpert(r) ? `, בעיקר בחוות דעת של מומחה (${r.expert.section})` : ''}.`); }
	if (miss.length) { parts.push(`חסר: ${listHe(miss)}.`); }
	if (r.people.length) {
		parts.push(r.people.length === 1 ? `היום האחרון לתביעה לפי הכלל הפשוט: ${isoToHe(r.deadline)}.` : `הימים האחרונים לתביעה לפי הכלל הפשוט: ${r.people.map(whoDate).join('; ')}.`);
	} else {
		parts.push('כדי לחשב את היום האחרון לתביעה של קטין, צריך תאריך לידה.');
	}
	return parts.join(' ');
}

/** The picture: the patient's chart, five tabs coloured by status, the evidence pinned under each. */
export function chart(reg, r) {
	if (!r.ok) { return ''; }
	const strip = r.elements.map((e, k) => `<li class="${P}-ft ${P}-ft--${e.status}"><b>${k + 1}</b><span>${esc(ELEMENT_HE[e.code])}</span></li>`).join('');
	const tabs = r.elements.map((e, k) => `<li class="${P}-tab ${P}-tab--${e.status}" id="${P}-el-${e.code}">`
		+ `<div class="${P}-tab__head"><span class="${P}-tab__n" aria-hidden="true">${k + 1}</span><strong class="${P}-tab__name">${esc(ELEMENT_HE[e.code])}</strong><span class="${P}-st ${P}-st--${e.status}">${esc(STATUS_HE[e.status])}</span></div>`
		+ `<p class="${P}-tab__why">${esc(e.why)}.${cite(e.section, e.url)}</p>`
		+ `<ul class="${P}-pins" aria-label="מה מוכיח את ${esc(ELEMENT_HE[e.code])}">${e.proves.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`
		+ (e.notes.length ? `<ul class="${P}-notes">${e.notes.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '')
		+ '</li>').join('');
	const sum = `תיק המטופל, חמישה יסודות. ${r.elements.map((e, k) => `${k + 1}. ${ELEMENT_HE[e.code]}: ${STATUS_HE[e.status]}`).join('. ')}.`;
	return `<figure class="${P}-chart"><figcaption class="${P}-chart__h">תיק המטופל: חמשת היסודות <span class="${P}-chart__count"><bdi>${r.counts.facts}</bdi> העובדות מראות · <bdi>${r.counts.prove}</bdi> צריך להוכיח · <bdi>${r.counts.missing}</bdi> חסר</span></figcaption>`
		+ `<p class="jtool-visually-hidden">${esc(sum)}</p>`
		+ `<ol class="${P}-strip" aria-hidden="true">${strip}</ol>`
		+ `<ol class="${P}-tabs">${tabs}</ol></figure>`;
}

/** The scenario for the simulation: computed facts only, never a name, an ID, a hospital or an address. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const who = r.kind === 'birth' ? PATIENT_HE[r.patient] : r.patient === 'minor' ? 'מטופל קטין' : 'מטופל בגיר';
	const facts = byStatus(r, 'facts');
	const prove = byStatus(r, 'prove');
	const side = { birth: 'בית החולים', surgery: 'בית החולים', anesthesia: 'בית החולים', diagnosis: 'הקופה או בית החולים', medication: 'המוסד הרפואי', dental: 'המרפאה', consent: 'המוסד הרפואי' }[r.kind];
	const topics = [];
	const st = (code) => (r.elements.find((e) => e.code === code) || {}).status;
	if (st('breach') !== 'missing') { topics.push('הסטייה מהרמה של מטפל סביר'); }
	if (st('causation') !== 'missing') { topics.push('הקשר בין הטיפול לנזק'); }
	if (st('consent') !== 'missing') { topics.push('ההסבר שניתן לפני הטיפול'); }
	if (r.missing) { topics.push('הרשומה החסרה'); }
	const clock = r.deadline ? ` היום האחרון לתביעה לפי הכלל הפשוט: ${isoToHe(r.deadline)}.` : '';
	return `תיק רשלנות רפואית: ${KIND_HE[r.kind]} ב-${isoToHe(r.event)}, ${who}, ${OUTCOME_HE[r.outcome]}. העובדות מצביעות על ${facts.length ? listHe(facts) : 'אף יסוד עדיין'}${prove.length ? `; צריך להוכיח ${listHe(prove)}` : ''}.${r.missing ? ' חלק מהרשומה הרפואית חסר.' : ''}${r.unaware ? ' המטופל היה בהרדמה ולא ידע מה נעשה.' : ''}${clock} השאלה לתרגול: חקירה נגדית של המומחה הרפואי מטעם ${side} על ${listHe(topics.length ? topics : ['הטיפול שניתן'])}. איך שואלים אותו שאלות קצרות, בלי להתווכח על רפואה?`;
}

/* ---------------- Share state and the links between the cluster's tools ---------------- */

const KC = { birth: 'b', surgery: 's', diagnosis: 'd', anesthesia: 'a', medication: 'm', dental: 't', consent: 'c' };
const PC = { adult: 'a', minor: 'm', baby: 'b', mother: 'o', both: 't' };
const OC = { permanent: 'p', temporary: 't', progress: 'g', death: 'd', none: 'n' };
const HC = { record: 'r', discharge: 'l', consent: 'c', second: 's', opinion: 'x' };
const IC = { unknown: 'u', no: 'n', yes: 'y', emergency: 'e' };
const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
/** k kind, p patient, e event day, b birth day (a minor only), o outcome, h what the reader holds ('0' = nothing), i informed,
 * u unaware, x part of the record missing, g the discovery day. Numbers, letters and dates only. */
export const KEYS = ['k', 'p', 'e', 'b', 'o', 'h', 'i', 'u', 'x', 'g'];
export function stateOf(i) {
	const pat = tkPatient(i.kind, i.patient);
	return encodeState({
		k: KC[i.kind] || 's', p: PC[pat], e: i.event || '', b: pat === 'minor' ? i.birth || '' : '', o: OC[i.outcome] || 'p',
		h: (i.have || []).map((h) => HC[h] || '').join('') || '0', i: IC[i.informed] || 'u', u: i.unaware ? 1 : '', x: i.missing ? 1 : '', g: i.discovered || '',
	});
}
/** The fields a partial link (a sibling's) may leave out; they come from `base` (the example) and are named in `filled`. */
const TK_FILL = [['kind', 'k'], ['event', 'e'], ['outcome', 'o'], ['have', 'h'], ['informed', 'i']];
export const FILL_HE = { kind: 'סוג האירוע', event: 'יום הטיפול', outcome: 'הנזק', have: 'מה יש בידיכם', informed: 'ההסבר לפני הטיפול' };
export function inputOf(s, base) {
	if (!s || !KEYS.some((k) => s[k] !== undefined && s[k] !== '')) { return null; }
	if (!s.e && !base) { return null; }
	const has = (k) => s[k] !== undefined && s[k] !== '';
	const b = Object.assign({}, TK_BLANK, base || {});
	const filled = base ? TK_FILL.filter(([, k]) => !has(k)).map(([f]) => f) : [];
	const kind = has('k') ? back(KC, s.k, 'surgery') : b.kind;
	return Object.assign({}, TK_BLANK, {
		kind, patient: tkPatient(kind, has('p') ? back(PC, s.p, '') : (has('k') ? '' : b.patient)), event: s.e || b.event, birth: s.b || '',
		outcome: has('o') ? back(OC, s.o, 'permanent') : b.outcome,
		have: has('h') ? String(s.h).split('').map((c) => back(HC, c, '')).filter(Boolean) : (b.have || []).slice(),
		informed: has('i') ? back(IC, s.i, 'unknown') : b.informed, unaware: s.u === '1', missing: s.x === '1', discovered: s.g || '', filled,
	});
}
/** The link the sibling instruments build into this tool: '/what-is-medical-malpractice-definition-examples/#s=<state>'. */
export function stateLink(reg, input) {
	return `${PAGE}#s=${stateOf(Object.assign({}, TK_BLANK, input || {}))}`;
}

/* The sibling tools, by their own share keys (read from their worktrees near the end of the run; see notes.md). */
const TK_CLOCK = '/medical-malpractice-statute-of-limitations/';
const TK_RECORDS = '/obtaining-medical-records-copy/';
const TK_COST = '/medical-malpractice-cost/';
/**
 * The full clock (shaon-refui) with the reader's facts, by its own keys (hityashnut-ui.js KEYS, read from the clock lane's
 * worktree on 22.10.2026 22:47): t the treatment day, n a minor (1) with b the birth day, c the discovery day. A birth with
 * both claimants opens the clock for the one whose plain date comes first (the safe date), unless `who` names the other.
 * The death day and the found-what choice are not known here: the clock asks for them. Numbers and dates only.
 */
export function clockLink(r, who) {
	if (!r || !r.ok) { return TK_CLOCK; }
	const first = r.people.length ? r.people.slice().sort((a, b) => (a.deadline < b.deadline ? -1 : 1))[0].who : 'patient';
	const pick = who && r.people.some((p) => p.who === who) ? who : first;
	const birth = pick === 'baby' ? r.event : r.patient === 'minor' && r.birth ? r.birth : '';
	return `${TK_CLOCK}#s=${encodeState({ t: r.event, n: birth ? 1 : '', b: birth, c: r.discovered && r.discovered > r.event ? r.discovered : '' })}`;
}
/**
 * The documents the records generator ticks for each kind of event (a copy of KIND_DOCS in reshuma-ui.js, wired by the
 * integrator on 22.10.2026; the records test checks the two stay equal). A suggestion of what to ask for, not a rule.
 */
export const TK_RECORD_DOCS = {
	birth: ['adm', 'ct', 'nu', 'co', 'su'], surgery: ['op', 'an', 'im', 'nu', 'co'], anesthesia: ['op', 'an', 'nu', 'co'],
	diagnosis: ['all'], medication: ['nu', 'lb', 'su'], dental: ['all'], consent: ['op', 'co'],
};
/**
 * The records-request generator (bakashat-reshuma) with the event's documents ticked, by its own keys (reshuma-ui.js KEYS):
 * w who asks (s the patient, p a parent of a minor), p where (h a hospital, c a clinic for dental care), o the hospital's
 * owner (u unknown), d the documents, t the treatment day, b the birth day of a minor. Codes and dates only.
 */
export function recordsLink(r) {
	if (!r || !r.ok) { return TK_RECORDS; }
	const docs = TK_RECORD_DOCS[r.kind] || ['all'];
	const child = r.kind === 'birth' ? (r.patient === 'mother' ? '' : r.event) : r.patient === 'minor' && r.birth ? r.birth : '';
	const where = r.kind === 'dental' ? 'c' : 'h';
	return `${TK_RECORDS}#s=${encodeState({ w: child ? 'p' : 's', p: where, o: where === 'h' ? 'u' : '', d: docs.join('.'), t: r.event, b: child })}`;
}
/** The cost and fee tool (alut-tviaa-refuit). */
export function costLink(r) {
	return TK_COST;
}

/** The "what to do now" list: the official route first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const T = reg.malpractice_tik;
	const official = [
		{ he: 'משרד הבריאות: תלונה לנציבות קבילות הציבור למקצועות רפואיים', url: T.tracks.complaint_url },
		{ he: `${T.patient.he}, ${T.patient.access_section}: הזכות לעותק מהרשומה`, url: T.patient.url },
	];
	const links = [
		{ path: recordsLink(r), he: 'מכתב לבקשת התיק הרפואי, עם המסמכים של האירוע שלכם' },
		{ path: clockLink(r), he: 'השעון: היום האחרון לתביעה, כולל גילוי מאוחר וקטינים' },
		{ path: KIND_PAGE[r.kind][0], he: KIND_PAGE[r.kind][1] },
		{ path: costLink(r), he: 'כמה זה עולה: אגרה, חוות דעת ושכר טרחה' },
	];
	return { official, links };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const T = reg.malpractice_tik;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	const rows = [];
	rows.push(`<div><dt>צריך להוכיח</dt><dd><bdi>${r.counts.prove}</bdi> יסודות</dd></div>`);
	if (r.counts.missing) { rows.push(`<div><dt>חסר</dt><dd><bdi>${r.counts.missing}</bdi></dd></div>`); }
	if (r.deadline) { rows.push(`<div><dt>היום האחרון לפי הכלל הפשוט</dt><dd><bdi>${isoToHe(r.deadline)}</bdi></dd></div>`); }
	if (r.daysLeft !== null && r.daysLeft >= 0) { rows.push(`<div><dt>ימים עד אז</dt><dd><bdi>${money(r.daysLeft, 0)}</bdi></dd></div>`); }
	const state = r.expired ? '<p class="jtool-state jtool-state--danger">! לפי הכלל הפשוט המועד עבר: בדקו את החריגים בשעון</p>'
		: `<p class="jtool-state jtool-state--info">i בדיקה של היסודות לפי ${esc(T.torts.negligence_section)} לפקודת הנזיקין, לא הכרעה</p>`;
	const burden = r.burden.map((b) => `<li class="${P}-b ${P}-b--${b.level}">${esc(b.he)}.${cite(b.section, b.url)}</li>`).join('');
	const evid = r.evidence.map((x) => `<li class="${P}-ev${x.have ? ` ${P}-ev--have` : ''}"><span class="${P}-ev__mark">${x.have ? 'יש' : 'לאסוף'}</span><strong>${esc(x.he)}</strong><span class="${P}-ev__from">${esc(x.from)}${x.kind === 'law' && x.section ? cite(x.section, x.url) : ''}</span></li>`).join('');
	const tracks = r.tracks.map((t) => `<li><strong>${esc(t.title)}</strong><p>${esc(t.he)}.${cite(t.rule, t.url)}</p></li>`).join('');
	const people = r.people.map((p) => `<li><strong>${esc(WHO_HE[p.who])}</strong>: <bdi>${isoToHe(p.deadline)}</bdi> (${p.minor ? `7 שנים מיום ההולדת ה-18, ${isoToHe(p.start)}` : `7 שנים מ-${isoToHe(p.start)}`}${p.added ? `, ועוד ${p.added} ימי מלחמה` : ''}${p.rolled ? ', אחרי מעבר מיום מנוחה' : ''})</li>`).join('');
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${esc(kindLabel(r))}, ${esc(OUTCOME_HE[r.outcome])}: יסודות שהעובדות כבר מראות</p>`
		+ `<strong class="jtool-verdict__figure"><bdi>${r.counts.facts}</bdi> מתוך 5</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ chart(reg, r)
		+ (r.flags.length ? `<ul class="jtool-flags ${P}-flags">${r.flags.map((f) => `<li class="${P}-flag ${P}-flag--${f.level}">${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-box"><h3 class="${P}-h">מי צריך להוכיח, ומתי הנטל עובר</h3><ul class="${P}-burden">${burden}</ul></div>`
		+ `<div class="${P}-box"><h3 class="${P}-h">חוות דעת של מומחה: חובה לצרף לתביעה</h3><p class="${P}-p">${esc(r.expert.he)} (${esc(r.expert.section)}).${cite(r.expert.section, r.expert.url)} ${r.expert.have ? 'סימנתם שיש בידיכם חוות דעת.' : `המומחה המתאים כאן: ${esc(r.expert.field)}.`}</p><p class="${P}-p">${esc(r.expert.rows[0].he)} (${esc(r.expert.rows[0].section)}); ${esc(r.expert.rows[1].he)} (${esc(r.expert.rows[1].section)}).</p></div>`
		+ `<div class="${P}-box"><h3 class="${P}-h">מה לאסוף, ומאיפה</h3><ul class="${P}-evid">${evid}</ul><p class="${P}-p"><a href="${esc(recordsLink(r))}">להכין מכתב לבקשת התיק הרפואי</a> · <a href="${esc(costLink(r))}">כמה עולה חוות דעת ומה האגרה</a></p></div>`
		+ `<div class="${P}-box"><h3 class="${P}-h">מסלולים במקביל לתביעה</h3><p class="${P}-p">אף אחד מהם הוא לא תביעה, והזמן להגשת תביעה ממשיך לרוץ: חוק ההתיישנות לא מונה תלונה או בירור בין מה שעוצר אותו.${cite('חוק ההתיישנות', reg.car_accident.limitation.url)} על נציבות הקבילות לחוק ביטוח בריאות ממלכתי נאמר במפורש: ${esc(T.tracks.no_extension_he)}.${cite(T.tracks.nhi_sections, T.tracks.nhi_authority_url)}</p><ul class="${P}-tracks">${tracks}</ul></div>`
		+ `<div class="${P}-box ${P}-dates"><h3 class="${P}-h">עד מתי: הכלל הפשוט</h3>${people ? `<ul>${people}</ul>` : '<p class="' + P + '-p">לקטין צריך תאריך לידה כדי לחשב.</p>'}<p class="${P}-p">לפי ${esc(reg.car_accident.limitation.section)} ו${esc(reg.car_accident.limitation.minor_section)} לחוק ההתיישנות. גילוי מאוחר, תקרת 10 השנים ומקרה מוות: <a href="${esc(clockLink(r))}">בשעון של רשלנות רפואית</a>${r.patient === 'both' ? ` (ולתינוק: <a href="${esc(clockLink(r, 'baby'))}">השעון עם תאריך הלידה</a>)` : ''}.</p></div>`
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${TK_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל חקירה נגדית של המומחה</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** The rules of the check, one row each: the page table (compare_table). */
export function rulesTable(reg) {
	const T = reg.malpractice_tik;
	const O = T.torts;
	const Pt = T.patient;
	const C = T.procedure;
	const L = T.caselaw;
	const lim = reg.car_accident.limitation;
	const rows = [
		['חובת זהירות', 'כלפי מי שמטפל סביר צריך לצפות שייפגע', `${O.duty_section} לפקודת הנזיקין`, O.url],
		['הפרת החובה (התרשלות)', 'סטייה ממה שמטפל סביר ומיומן היה עושה באותן נסיבות', `${O.negligence_section} לפקודת הנזיקין`, O.url],
		['נזק', 'אבדן חיים, רווחה גופנית ועוד; בלי נזק אין עוולה', `${O.damage_section} ו${O.negligence_section} לפקודת הנזיקין`, O.url],
		['קשר סיבתי', 'הנזק נגרם בגלל הסטייה, לפי מאזן ההסתברויות', `${O.negligence_section} לפקודת הנזיקין`, O.url],
		['הסכמה מדעת', 'הסבר סביר ומוקדם: אבחנה, טיפול, סיכונים, חלופות; לניתוח בכתב', `${Pt.consent_section} ו${Pt.written_section} לחוק זכויות החולה`, Pt.url],
		['טיפול דחוף בלי הסכמה', 'רק כשבגלל החירום אי אפשר לקבל אותה', `${Pt.emergency_section} לחוק זכויות החולה`, Pt.url],
		['"הדבר מעיד על עצמו"', 'שלושה תנאים: לא יכולתם לדעת, שליטה מלאה של הנתבע, האירוע מתיישב יותר עם רשלנות', `${O.res_ipsa_section} לפקודת הנזיקין`, O.url],
		['נזק ראייתי', 'רשומה חסרה או לא מלאה: הנטל עובר למוסד', `${Pt.record_section} לחוק זכויות החולה; ${L.evidentiary_file}`, L.comptroller_url],
		['פגיעה באוטונומיה', 'פיצוי על החלטה בלי מידע, גם בלי קשר לנזק הגופני', L.autonomy_files.join(', '), L.comptroller_url],
		['חוות דעת רפואית', 'מצורפת לכתב התביעה; בלעדיה ובלי פטור, אין מומחה רפואי מטעמכם', `${C.expert_section}, ${C.exempt_section}, ${C.sanction_section}`, C.url],
		['מומחה מטעם בית המשפט', 'במינוי בהסכמה חוות הדעת של הצדדים לא נכנסות כראיה', `${C.court_expert_section}, ${C.agreed_section}`, C.url],
		['שאלות הבהרה למומחה בית המשפט', `בקשת רשות בתוך ${C.questions_days} ימים`, C.questions_section, C.url],
		['עותק מהרשומה', 'זכות המטופל, ממטפל או ממוסד', `${Pt.access_section} לחוק זכויות החולה`, Pt.url],
		['ועדת בדיקה', 'הממצאים והמסקנות למטופל; הפרוטוקול רק בצו', `${Pt.inquiry_section} לחוק זכויות החולה`, Pt.url],
		['התיישנות, הכלל הפשוט', `${lim.years} שנים; לקטין מגיל ${lim.adult_age}`, `${lim.section} ו${lim.minor_section} לחוק ההתיישנות`, lim.url],
		['נזק שהתגלה מאוחר', 'מיום הגילוי, ולא יותר מ-10 שנים מיום הנזק', `${O.late_section} לפקודת הנזיקין`, O.url],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הכללים של הבדיקה: מה צריך להוכיח, ומה מזיז את הנטל. ${esc(O.he)} (נוסח ל-${isoToHe(O.current_to)}), ${esc(Pt.he)} (נוסח ל-${isoToHe(Pt.current_to)}), ${esc(C.he)} (נוסח ל-${isoToHe(C.current_to)}), חוק ההתיישנות; נבדק ${isoToHe(T.checked_on)}.</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">המקור</th></tr></thead><tbody>`
		+ rows.map(([what, rule, src, url]) => `<tr><td data-th="מה">${esc(what)}</td><td data-th="הכלל">${esc(rule)}</td><td data-th="המקור">${cite(src, url)}</td></tr>`).join('')
		+ '</tbody></table></div>';
}

/** What changed and when: only dates an official text states. */
export function changesTable(reg) {
	const T = reg.malpractice_tik;
	const lim = reg.car_accident.limitation;
	const rows = T.changes.map((c) => ({ key: c.from, when: /^\d{4}$/.test(c.from) ? c.from : isoToHe(c.from), what: c.he, src: c.source, url: c.url }));
	rows.push({ key: '2024', when: '2024', what: `חוק ההתיישנות, תיקון מס' 8 (חרבות ברזל): הימים ${isoToHe(lim.war.from)} עד ${isoToHe(lim.war.to)} לא נספרים בתקופה שעוד רצה`, src: `${lim.war.section} לחוק ההתיישנות`, url: lim.url });
	rows.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתי"><bdi>${esc(x.when)}</bdi></td><td data-th="מה השתנה">${esc(x.what)}</td><td data-th="מקור">${cite(x.src, x.url)}</td></tr>`).join('')
		+ '</tbody><caption>רק מה שנוסח רשמי מתארך.</caption></table></div>';
}

/** The expert rules, regulation by regulation. */
function expertTable(reg, r) {
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-ex-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">התקנה</th><th scope="col">מה היא קובעת</th></tr></thead><tbody>`
		+ [{ section: r.expert.section, he: r.expert.he }].concat(r.expert.rows).map((x) => `<tr><td data-th="התקנה">${cite(x.section, r.expert.url)}</td><td data-th="מה היא קובעת">${esc(x.he)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(reg.malpractice_tik.procedure.he)}, נוסח ל-${isoToHe(reg.malpractice_tik.procedure.current_to)}.</caption></table></div>`;
}

/** Every date of the result: the event, the 18th birthday of a minor, the plain last day of each claimant. */
export function tkEvents(reg, r) {
	if (!r.ok) { return []; }
	const ev = [];
	ev.push({ key: 'event', date: r.event, kind: 'start', he: `${r.kind === 'birth' ? 'יום הלידה' : 'יום הטיפול'}` });
	r.people.forEach((p) => {
		if (p.minor) { ev.push({ key: `adult_${p.who}`, date: p.start, kind: 'start', he: `${WHO_HE[p.who]}: יום ההולדת ה-18, מכאן נמנות 7 השנים`, section: reg.car_accident.limitation.minor_section }); }
		ev.push({ key: `limit_${p.who}`, date: p.deadline, kind: 'limit', he: `${WHO_HE[p.who]}: היום האחרון להגשת תביעה לפי הכלל הפשוט`, section: reg.car_accident.limitation.section });
	});
	if (r.discovered && r.discovered > r.event) { ev.push({ key: 'discovered', date: r.discovered, kind: 'start', he: 'יום הגילוי (השעון מחשב לפיו)' }); }
	return ev.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

function datesTable(reg, r) {
	const url = reg.car_accident.limitation.url;
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ tkEvents(reg, r).map((e) => `<tr><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi></td><td data-th="מה">${esc(e.he)}</td><td data-th="הכלל">${e.section ? cite(`${e.section} לחוק ההתיישנות`, url) : ''}</td></tr>`).join('')
		+ `</tbody><caption>הכלל הפשוט: 7 שנים, לקטין מגיל 18, בלי ימי המלחמה, ויום מנוחה עובר ליום שאחריו (${esc(reg.car_accident.limitation.interpretation_he)}). החריגים בשעון.</caption></table></div>`;
}

function methodList(reg, r) {
	const T = reg.malpractice_tik;
	const items = [];
	items.push(`האירוע: ${KIND_HE[r.kind]}, ${isoToHe(r.event)}; ${r.kind === 'birth' ? PATIENT_HE[r.patient] : r.patient === 'minor' ? 'קטין' : 'בגיר'}; ${OUTCOME_HE[r.outcome]}`);
	r.elements.forEach((e) => items.push(`${ELEMENT_HE[e.code]}: ${STATUS_HE[e.status]} (${e.section})`));
	if (r.missing) { items.push(`רשומה חסרה: הנטל יכול לעבור למוסד (${T.caselaw.evidentiary_file})`); }
	if (r.unaware) { items.push(`בהרדמה או בלי יכולת לדעת: התנאי הראשון של ${T.torts.res_ipsa_section}`); }
	items.push(`חוות דעת של מומחה: ${T.procedure.expert_section}`);
	r.people.forEach((p) => items.push(`${WHO_HE[p.who]}: ${p.minor ? `מגיל 18 (${isoToHe(p.start)})` : `מ-${isoToHe(p.start)}`} ועוד 7 שנים = ${isoToHe(p.plain)}${p.added ? ` + ${p.added} ימי מלחמה` : ''}${p.rolled ? ', ממעבר מיום מנוחה' : ''}: ${isoToHe(p.deadline)}`));
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

/** The one-page print: inputs, the five elements, the burden, the dates, sources with the check date, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const T = reg.malpractice_tik;
	return '<h3>בדיקת תיק רשלנות רפואית: סיכום</h3>'
		+ `<p><strong>הנתונים:</strong> ${esc(KIND_HE[r.kind])}; ${isoToHe(r.event)}; ${esc(r.kind === 'birth' ? PATIENT_HE[r.patient] : r.patient === 'minor' ? 'קטין' : 'בגיר')}; ${esc(OUTCOME_HE[r.outcome])}; הסבר לפני הטיפול: ${esc(INFORMED_HE[r.informed])}; בידיכם: ${esc(r.have.length ? r.have.map((h) => HAVE_HE[h]).join(', ') : 'כלום עדיין')}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<ol>${r.elements.map((e) => `<li><strong>${esc(ELEMENT_HE[e.code])}: ${esc(STATUS_HE[e.status])}.</strong> ${esc(e.why)}. מה מוכיח: ${esc(e.proves.join('; '))}.</li>`).join('')}</ol>`
		+ `<p><strong>הנטל:</strong> ${r.burden.map((b) => esc(b.he)).join(' ')}</p>`
		+ `<p><strong>מועדים:</strong> ${tkEvents(reg, r).map((e) => `${isoToHe(e.date)} ${esc(e.he)}`).join('; ')}.</p>`
		+ `<p><strong>מקורות:</strong> ${esc(T.torts.he)}, נוסח ל-${isoToHe(T.torts.current_to)}; ${esc(T.patient.he)}, נוסח ל-${isoToHe(T.patient.current_to)}; ${esc(T.procedure.he)}, נוסח ל-${isoToHe(T.procedure.current_to)}; ${esc(reg.car_accident.limitation.he)}; ${esc(T.caselaw.comptroller_he)}. נבדק ${isoToHe(T.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי: אם יש עילה, מכריע בית המשפט לפי הראיות וחוות הדעת.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך נבדק, צעד אחר צעד</h3></div>${methodList(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${datesTable(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-ex-h">חוות הדעת והמומחים: התקנות</h3></div>${expertTable(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || reg.malpractice_tik.checked_on)}</div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): how many of the five elements the example's (or the
 * reader's) facts already show, what is still to prove, and the plain last day. Same markup on the server and the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לבדוק את המקרה שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">בדיקת תיק רשלנות רפואית</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'הבדיקה שלכם: '}${kindLabel(r)}, ${OUTCOME_HE[r.outcome]}`;
	const prove = byStatus(r, 'prove');
	const line = `${prove.length ? `צריך להוכיח: ${listHe(prove)}${needsExpert(r) ? `, בעיקר בחוות דעת של מומחה (${r.expert.section})` : ''}.` : byStatus(r, 'missing').length ? `חסר: ${listHe(byStatus(r, 'missing'))}.` : 'לפי מה שסימנתם, יש עובדות לכל היסודות; בבית המשפט מוכיחים את כולם.'}${r.deadline ? ` היום האחרון לתביעה לפי הכלל הפשוט: ${isoToHe(r.deadline)}.` : ''}`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure"><bdi>${r.counts.facts}</bdi> מתוך 5</strong><span class="jtool-lead__unit">יסודות שהעובדות כבר מראות</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const r = tkCompute(reg, EXAMPLE);
	const T = reg.malpractice_tik;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.counts.facts,
		sticky: `<bdi>${r.counts.facts}</bdi> מתוך 5`,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { today: EXAMPLE.today, printedOn: EXAMPLE.today }),
		method: `<ol><li>חובת זהירות: מטפל חב חובת זהירות כלפי המטופל${cite(T.torts.duty_section, T.torts.url)}</li>`
			+ `<li>הפרת החובה וקשר סיבתי: מוכיחים בחוות דעת של מומחה שמצורפת לתביעה${cite(T.procedure.expert_section, T.procedure.url)}${cite(T.torts.negligence_section, T.torts.url)}</li>`
			+ `<li>נזק: ${esc(OUTCOME_HE[EXAMPLE.outcome])}${cite(T.torts.damage_section, T.torts.url)}</li>`
			+ `<li>הסכמה מדעת: לניתוח, בכתב ועם תמצית ההסבר${cite(T.patient.written_section, T.patient.url)}</li>`
			+ `<li>בהרדמה: התנאי הראשון של "הדבר מעיד על עצמו"${cite(T.torts.res_ipsa_section, T.torts.url)}</li>`
			+ `<li>${reg.car_accident.limitation.years} שנים מ-${isoToHe(EXAMPLE.event)}: ${isoToHe(r.deadline)}${cite(reg.car_accident.limitation.section, reg.car_accident.limitation.url)}</li></ol>`,
		compare_table: rulesTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	return {
		kind: pick('kind', 'surgery'), patient: pick('pat', 'adult'), event: tkIso(val('ev')), birth: tkIso(val('birth')), today,
		outcome: pick('out', 'permanent'), informed: pick('inf', 'unknown'),
		have: Array.from(root.querySelectorAll(`input[name="${P}-have"]:checked`)).map((x) => x.value),
		unaware: Boolean(root.querySelector(`input[name="${P}-una"]:checked`)), missing: Boolean(root.querySelector(`input[name="${P}-mis"]:checked`)),
		discovered: tkIso(val('disc')),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const T = reg.malpractice_tik;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(T.checked_on, T.refresh_every_days) || (T.next_update && today >= T.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהחוק התעדכן'); }
	}
	const ids = { event: 'ev', birth: 'birth', discovered: 'disc' };
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
		const birthKind = input.kind === 'birth';
		form.querySelectorAll('[data-if-birth]').forEach((el) => { el.hidden = !birthKind; });
		form.querySelectorAll('[data-if-other]').forEach((el) => { el.hidden = birthKind; });
		// The checked patient must be one the kind allows: otherwise check the kind's default chip.
		const pat = tkPatient(input.kind, input.patient);
		const chipEl = form.querySelector(`input[name="${P}-pat"][value="${pat}"]`);
		if (chipEl && !chipEl.checked) { chipEl.checked = true; }
		form.querySelectorAll('[data-if-minor]').forEach((el) => { el.hidden = !(!birthKind && pat === 'minor'); });
		const key = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return input.event === addDays(input.today || today, -p.back) && p.kind === input.kind && p.patient === pat && p.outcome === input.outcome && p.informed === input.informed && p.have.join() === input.have.join() && Boolean(p.unaware) === Boolean(input.unaware) && !input.missing; }) || '';
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
		return Object.assign({}, input, { patient: pat });
	};
	const run = (input, opts = {}) => {
		const r = tkCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today: input.today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? `<bdi>${r.counts.facts}</bdi> מתוך 5` : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: tkBand(r) }); }
		return r;
	};
	// The example keeps its own "today"; the reader's first change moves the dates to today.
	const current = () => sync(readForm(root, today));
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(current()); }, 160);
	};
	// A share link may name its tool (/@tik-rashlanut); on a page with several tools only this tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS), Object.assign({}, EXAMPLE, { today })) : null;
	const fromHash = parsed ? Object.assign(parsed, { today }) : null;
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(sync(fromHash), { silent: true });
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
			const first = form.querySelector(`.${P}-preset`);
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
			const input = tkPreset(b.getAttribute('data-preset'), today);
			if (!input) { return; }
			own = true;
			form.innerHTML = renderForm(reg, input);
			run(sync(input));
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		const input = own ? current() : Object.assign({}, EXAMPLE);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok) {
			const events = tkEvents(reg, r).filter((e) => e.kind !== 'start' || e.key.indexOf('adult') === 0);
			download('tik-rashlanut.ics', 'text/calendar;charset=utf-8', ics(events.map((e) => ({ date: e.date, summary: `תיק רשלנות רפואית: ${e.he}`, description: `${e.section ? `${e.section} לחוק ההתיישנות` : 'חוק ההתיישנות'}. הכלל הפשוט, חושב ב-jus-tice.co.il; החריגים בשעון של רשלנות רפואית.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק תאריכים ואותיות, בלי שמות ובלי תעודת זהות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · נבדק ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (jus-tice.co.il, ${isoToHe(T.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: tkBand(r) });
			const brief = r.ok ? aiBrief(reg, r) : '';
			if (brief && openSimulation(brief, 'witness_prep', b.getAttribute('href'))) {
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
			if (s) { own = true; s.today = today; form.innerHTML = renderForm(reg, s); run(sync(s)); }
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
