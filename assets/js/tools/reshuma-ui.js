/**
 * The medical-malpractice wave UI (22.10.2026, HAD-594): the medical-records request generator (bakashat-reshuma, prefix
 * jt69) on /obtaining-medical-records-copy/. The picture is a routing slip, the paper that travels with a records request:
 * from -> to -> what -> the legal basis -> the cost -> the answer time -> kept until, each box stamped with its section; and
 * beside it the letter itself, generated from the same choices, to download as Word, print or copy. Under them: what to
 * attach, the cost lines and the free items, what to do when no answer comes, how long a hospital keeps each document, what
 * changed and when, the scenario for the expert cross-examination rehearsal, and the next steps.
 * The reader's name and ID number are typed only into the letter fields: they stay in the page, never in the share link, the
 * saved answers, the analytics or the scenario.
 */
import { rsCompute, rsBand, rsDocs, RS_DOCS } from './reshuma-engine.js';
import { addDays, addMonths, parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import { wordDocument, WORD_MIME } from './word-document.js';
import {
	esc, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'bakashat-reshuma';
export const PAGE = '/obtaining-medical-records-copy/';
const P = 'jt69';
const RS_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=witness_prep&topic=medical-malpractice';
const RS_CLOCK = '/medical-malpractice-statute-of-limitations/';
const RS_CASE = '/what-is-medical-malpractice-definition-examples/';
const RS_COST = '/medical-malpractice-cost/';

const WHO_HE = { self: 'המטופל', parent: 'הורה של קטין', guardian: 'אפוטרופוס', poa: 'מיופה כוח, קרוב משפחה', heir: 'קרוב או יורש של מי שנפטר', rep: 'עורך דין או מומחה, עם ויתור סודיות' };
const WHERE_HE = { hospital: 'בית חולים', hmo: 'קופת חולים', clinic: 'מרפאה או רופא פרטי', idf: 'חיל הרפואה, צה"ל' };
const WHERE_TO = { hospital: 'בית החולים', hmo: 'קופת החולים', clinic: 'המרפאה', idf: 'חיל הרפואה' };
const OWNER_HE = { other: 'לא ממשלתי ולא עירוני', state: 'ממשלתי או עירוני', unknown: 'לא ידוע' };
const FORMAT_HE = { any: 'לא ידוע', digital: 'ממוחשבת', paper: 'על נייר' };
const LEVEL = { ok: 'ok', info: 'info', warn: 'warn', danger: 'danger' };
const FILL_HE = { treated: 'יום הטיפול', docs: 'המסמכים' };

/** One click to a full situation, each relative to today. */
export const PRESETS = {
	surgery: { he: 'ניתוח בבית חולים · המטופל מבקש', who: 'self', where: 'hospital', owner: 'other', docs: ['op', 'an', 'nu', 'co', 'im'], months: 19 },
	birth: { he: 'לידה · הורה מבקש את תיק הלידה', who: 'parent', where: 'hospital', owner: 'other', docs: ['ct', 'adm', 'nu', 'co', 'su'], months: 26, born: true },
	hmo: { he: 'אבחון מאוחר · קופת חולים', who: 'self', where: 'hmo', docs: ['all'], months: 40 },
	deceased: { he: 'פטירה לפני שבועיים · קרוב משפחה', who: 'heir', where: 'hospital', owner: 'unknown', docs: ['all'], days: 35, died: 14 },
	lawyer: { he: 'עורך דין עם ויתור סודיות', who: 'rep', where: 'hospital', owner: 'unknown', docs: ['all'], months: 50 },
	gap: { he: 'חסר גיליון הרדמה · בקשת השלמה', who: 'self', where: 'hospital', owner: 'other', docs: [], missing: ['an'], months: 19 },
};
const RS_BLANK = { who: 'self', where: 'hospital', owner: 'unknown', docs: [], missing: [], format: 'any', treated: '', birth: '', death: '', pages: '', today: '' };
/** A preset applied on a day. */
export function rsPreset(key, today) {
	const p = PRESETS[key];
	if (!p) { return null; }
	const treated = p.days ? addDays(today, -p.days) : addMonths(today, -p.months);
	return Object.assign({}, RS_BLANK, {
		who: p.who, where: p.where, owner: p.owner || 'unknown', docs: rsDocs(p.docs), missing: rsDocs(p.missing || []), treated, today,
		birth: p.born ? treated : '', death: p.died ? addDays(today, -p.died) : '',
	});
}
export const EXAMPLE = rsPreset('surgery', '2026-10-22');

const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text || 'מקור')}</a>` : '');
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const rsIsoIn = (text) => { const raw = String(text || '').trim(); return raw ? (parseDate(raw) || raw) : ''; };
const docHe = (reg, code) => reg.malpractice_reshuma.documents[code].he;
// A parent of a patient who is an adult today asks with the patient's waiver (r.asWho 'rep'): every summary says so.
const whoHe = (r) => (r.adultNow ? 'הורה, בהסכמת המטופל הבגיר' : WHO_HE[r.who]);
const situation = (r) => `${whoHe(r)}, ${WHERE_HE[r.where]}`;

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, RS_BLANK, input || {});
	const docs = rsDocs(i.docs);
	const missing = rsDocs(i.missing);
	const D = reg.malpractice_reshuma.documents;
	const preset = Object.keys(PRESETS).find((k) => { const x = rsPreset(k, i.today || '2026-10-22'); return x && x.who === i.who && x.where === i.where && x.treated === i.treated && x.docs.join() === docs.join() && x.missing.join() === missing.join(); }) || '';
	const date = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 10.3.2025" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const sel = (id, label, v, opts, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><select id="${P}-${id}">${opts.map(([val, l]) => `<option value="${esc(val)}"${String(v) === val ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>${hint ? `<p class="jtool-hint">${esc(hint)}</p>` : ''}</div>`;
	const docChips = (name, list, withAll) => `<div class="jtool-chips ${P}-docs">${(withAll ? RS_DOCS : RS_DOCS.filter((c) => c !== 'all')).map((c) => chip(name, c, D[c].he, list.includes(c), 'checkbox')).join('')}</div>`;
	const more = Boolean(missing.length || i.pages !== '' || i.format !== 'any' || (i.birth && i.who !== 'parent'));
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא את כל השדות לפי היום; אפשר לשנות כל שדה.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>מי מבקש</legend><div class="jtool-chips">${Object.keys(WHO_HE).map((w) => chip('who', w, WHO_HE[w], i.who === w)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>ממי מבקשים</legend><div class="jtool-chips">${Object.keys(WHERE_HE).map((w) => chip('where', w, WHERE_HE[w], i.where === w)).join('')}</div></fieldset>`
		+ `<div class="jtool-row" data-if-hospital${i.where === 'hospital' ? '' : ' hidden'}>${sel('own', 'בית החולים הוא', i.owner, Object.entries(OWNER_HE), 'קובע אם תקנות השמירה חלות')}</div>`
		+ `<fieldset class="jtool-field" aria-describedby="${P}-docs-e"><legend>מה מבקשים</legend>${docChips('doc', docs, true)}<p class="jtool-error" id="${P}-docs-e" role="alert"></p></fieldset>`
		+ `<div class="jtool-row">${date('tr', 'יום הטיפול', i.treated, 'גם תאריך משוער מספיק: ממנו נבדקות 5 השנים ותקופות השמירה')}</div>`
		+ `<div class="jtool-row" data-if-parent${i.who === 'parent' ? '' : ' hidden'}>${date('birth', 'תאריך הלידה של הקטין', i.who === 'parent' ? i.birth : '', 'בלידה: יום הלידה')}</div>`
		+ `<div class="jtool-row" data-if-heir${i.who === 'heir' ? '' : ' hidden'}>${date('death', 'תאריך הפטירה', i.death, 'ממנו נספרים 30 הימים של תקנה 3(ד)')}</div>`
		+ `<details class="jtool-more ${P}-more"${more ? ' open' : ''}><summary>פרטים נוספים: סוג הרשומה, עמודים, מסמכים שחסרו בהעתק</summary>`
		+ `<div class="jtool-row">${sel('fmt', 'הרשומה', i.format, Object.entries(FORMAT_HE), 'ממוחשבת או על נייר: משנה את התשלום המרבי')}<div class="jtool-field"><label class="jtool-label" for="${P}-pages">מספר עמודים, אם ידוע</label><input id="${P}-pages" type="text" inputmode="numeric" autocomplete="off" value="${esc(i.pages === '' ? '' : i.pages)}" placeholder="לא חובה" aria-describedby="${P}-pages-e"><p class="jtool-error" id="${P}-pages-e" role="alert"></p></div></div>`
		+ `<div class="jtool-row" data-if-notparent${i.who === 'parent' ? ' hidden' : ''}>${date('birth2', 'תאריך הלידה של המטופל, אם היה קטין', i.who === 'parent' ? '' : i.birth, 'בודק אם מותר לבער מסמכים לפני גיל 18')}</div>`
		+ `<fieldset class="jtool-field"><legend>כבר קיבלתם העתק וחסרים בו מסמכים?</legend>${docChips('miss', missing, false)}<p class="jtool-hint">המכתב יהפוך לבקשה להשלמה, והתרחיש לסימולציה יעסוק בפער.</p></fieldset>`
		+ '</details>';
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const M = reg.malpractice_reshuma;
	const parts = [];
	parts.push(r.adultNow ? `המטופל בגיר היום: ההורה מקבל את הרשומה רק בהסכמת המטופל, בכתב ויתור על סודיות (${M.law.disclose_section} לחוק זכויות החולה).`
		: r.who === 'rep' ? `עורך דין או מומחה מקבלים את הרשומה בהסכמת המטופל (${M.law.disclose_section} לחוק זכויות החולה).`
		: r.who === 'heir' ? `אחרי פטירה, הרשומה נמסרת ליורשים שמציגים צו או תצהיר (${M.circular.sections.deceased} ל${M.circular.short_he}).`
			: `לפי ${M.law.right_section} לחוק זכויות החולה יש זכות לקבל העתק מהרשומה הרפואית.`);
	if (r.capped) {
		const bits = [];
		if (r.digitalMax !== null) { bits.push(`העתק ממוחשב: עד ${nis(r.digitalMax)} לכל הבקשה`); }
		if (r.paperMax !== null) { bits.push(`על נייר: עד ${nis(r.paperMax)}${r.paper.extraPairs ? ` ל-${r.paper.pages} עמודים` : ' ל-10 עמודים'}`); }
		parts.push(`${bits.join('; ')}.`);
	} else {
		parts.push(`לבקשה הזו אין תשלום מרבי בתקנות; בתעריפון משרד הבריאות העתקת עד 10 עמודים היא ${nis(M.tariff.items.L0268.amount)}.`);
	}
	parts.push('אין בחוק מספר ימים למענה.');
	if (r.retention && r.retention.earliest) { parts.push(`לפי תקנות השמירה, מותר לבער חלק מהמסמכים כבר ב-${isoToHe(r.retention.earliest)}.`); }
	if (r.followup) { parts.push(`חסרים בהעתק: ${r.missing.map((c) => docHe(reg, c)).join(', ')}.`); }
	return parts.join(' ');
}

/** The routing slip: from, to, what, the legal basis, the cost, the answer time, kept until; a real list, read as text. */
export function slip(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const M = reg.malpractice_reshuma;
	const what = r.followup ? `השלמה: ${r.missing.map((c) => docHe(reg, c)).join(', ')}` : r.docs.map((c) => docHe(reg, c)).join(', ');
	const cost = r.capped ? (r.digitalMax !== null ? `עד ${nis(r.digitalMax)} ממוחשב${r.paperMax !== null ? `; עד ${nis(r.paperMax)} על נייר` : ''}` : `עד ${nis(r.paperMax)} על נייר`) : `אין תקרה בתקנות; תעריפון: ${nis(M.tariff.items.L0268.amount)} ל-10 עמודים`;
	const costSec = r.capped ? (r.digitalMax !== null ? `${M.regs.sections.computerised}` : M.regs.sections.paper) : 'תעריפון, L0268';
	const kept = r.retention ? (r.retention.earliest ? `מותר לבער מ-${isoToHe(r.retention.earliest)}` : 'לא חושב') : r.where === 'hospital' ? 'תקנות השמירה לא חלות (בית חולים ממשלתי או עירוני)' : 'לא נקבעה תקופה בטקסטים שנקראו';
	const basis = r.basis[0];
	const basisHe = r.who === 'heir' ? `${M.circular.sections.deceased} ל${M.circular.short_he}` : `${basis.section} לחוק זכויות החולה`;
	const rows = [
		['מאת', whoHe(r), '', ''],
		['אל', `${r.where === 'hospital' ? 'מחלקת רשומות ומידע רפואי, ' : ''}${WHERE_TO[r.where]}`, '', ''],
		['מה', what, '', ''],
		['לפי', basisHe, 'נוסח רשמי', basis.url],
		['עלות', cost, costSec, ''],
		['מענה', 'לא נקבע מספר ימים; המוסד מפרסם את זמן המענה', `${M.circular.sections.publish} לחוזר`, ''],
		['נשמר', kept, r.retention ? M.retention.section : '', ''],
	];
	const mini = Boolean(opts.mini);
	return `<figure class="${P}-slip${mini ? ` ${P}-slip--mini` : ''}"${mini ? ' aria-hidden="true"' : ''}><figcaption class="${P}-slip__h">תלוש הבקשה: ${r.followup ? 'בקשה להשלמת מסמכים' : 'בקשה להעתק רשומה רפואית'}</figcaption><ol class="${P}-slip__rows">`
		+ rows.map(([k, v, s, url], n) => `<li class="${P}-slip__row"><span class="${P}-slip__n" aria-hidden="true">${n + 1}</span><span class="${P}-slip__k">${esc(k)}</span><span class="${P}-slip__v">${esc(v)}</span>${s ? `<span class="${P}-stamp">${url && !mini ? cite(s, url) : esc(s)}</span>` : ''}</li>`).join('')
		+ '</ol></figure>';
}

/** The scenario for the simulation: computed facts only, never a name, an ID, an address or the institution's name. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const M = reg.malpractice_reshuma;
	const at = { hospital: 'בית החולים', hmo: 'קופת החולים', clinic: 'המרפאה', idf: 'חיל הרפואה' }[r.where];
	const when = `${Number(r.treated.slice(5, 7))}.${r.treated.slice(0, 4)}`;
	const asked = r.docs.length ? r.docs.map((c) => docHe(reg, c)).join(', ') : r.missing.map((c) => docHe(reg, c)).join(', ');
	const base = `טיפול ב${at} בחודש ${when}. ${whoHe(r)} ביקש העתק מהרשומה הרפואית: ${asked}.`;
	if (r.followup) {
		const gap = docHe(reg, r.missing[0]);
		return `${base} בהעתק שהתקבל חסר ${r.missing.map((c) => docHe(reg, c)).join(', ')}. לפי ${M.law.record_section} לחוק זכויות החולה המוסד חייב לתעד את מהלך הטיפול ולשמור את הרשומה. השאלה לתרגול: חקירה נגדית של המומחה הרפואי מטעם ${at} על הפער ברשומה: מה היה אמור להיות כתוב ב${gap}, מי היה אחראי לתעד, ואיך המומחה קובע מה קרה בלי המסמך?`;
	}
	const first = docHe(reg, r.docs[0]);
	return `${base} הרשומה היא הבסיס לחוות הדעת של שני הצדדים. השאלה לתרגול: חקירה נגדית של המומחה הרפואי מטעם ${at} על הרשומה: מה כתוב ב${first}, מה לא תועד בזמן אמת, ועל אילו מסמכים המומחה נשען כשכתב את חוות דעתו?`;
}

/**
 * For the siblings: the documents that usually tell the story of each kind of event (the case check's kinds), to tick them in
 * a link here, e.g. `stateLink(reg, { treated: event, docs: KIND_DOCS.birth })`. A suggestion of what to ask for, not a rule.
 */
export const KIND_DOCS = {
	birth: ['adm', 'ct', 'nu', 'co', 'su'], surgery: ['op', 'an', 'im', 'nu', 'co'], anesthesia: ['op', 'an', 'nu', 'co'],
	diagnosis: ['all'], medication: ['nu', 'lb', 'su'], dental: ['all'], consent: ['op', 'co'],
};

/** The share link of this tool, for its siblings: '/obtaining-medical-records-copy/#s=<state>'. Codes and dates only. */
export function stateLink(reg, input) {
	return `${PAGE}#s=${stateOf(Object.assign({}, RS_BLANK, input || {}))}`;
}

/**
 * The limitation clock (shaon-refui) with the reader's dates, by its own keys (hityashnut-ui.js KEYS, read from the clock
 * lane's worktree on 22.10.2026 22:53): t the treatment day, n a minor (1) with b the birth day, m the death day.
 */
export function clockLink(r) {
	if (!r || !r.ok) { return RS_CLOCK; }
	const minor = Boolean(r.birth) && r.ageAtTreat !== null && r.ageAtTreat < 18;
	return `${RS_CLOCK}#s=${encodeState({ t: r.treated, n: minor ? 1 : '', b: minor ? r.birth : '', m: r.death || '' })}`;
}
/**
 * The "do I have a case" check (tik-rashlanut) with the reader's facts, by its own keys (tik-ui.js KEYS, read from the case
 * lane's worktree on 22.10.2026 22:53): k the kind of event (b birth, s surgery, a anesthesia alone) when the documents name it,
 * e the event day, x a part of the record missing (1). What it does not know (the outcome, the patient) its page fills
 * from its example and says so.
 */
export function caseLink(r) {
	if (!r || !r.ok) { return RS_CASE; }
	const all = [...r.docs, ...r.missing];
	const k = all.includes('ct') ? 'b' : all.includes('op') ? 's' : all.includes('an') ? 'a' : '';
	return `${RS_CASE}#s=${encodeState({ k, e: r.treated, x: r.followup ? 1 : '' })}`;
}

/** The "what to do now" list: the official route first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const M = reg.malpractice_reshuma;
	const official = [];
	const kinds = r.where === 'hmo' ? ['hmo'] : ['hospital'];
	M.where.filter((w) => kinds.includes(w.kind)).slice(0, 2).forEach((w) => official.push({ he: `לאן שולחים, למשל: ${w.he}`, url: w.url }));
	official.push({ he: `${M.circular.short_he}: מה כל מוסד חייב לפרסם, ומי מקבל את הרשומה`, url: M.circular.page_url });
	if (r.where === 'hmo') { official.push({ he: `${M.complaints.nhi_he}`, url: M.complaints.nhi_url }); }
	official.push({ he: `${M.complaints.commission_he}: אם הבקשה לא נענית`, url: M.complaints.commission_url });
	const links = [];
	if (r.followup) { links.push({ path: '/evidentiary-damage-records/', he: 'נזק ראייתי: מה קורה כשחסר מסמך ברשומה' }); }
	links.push({ path: clockLink(r), he: 'השעון: עד מתי אפשר לתבוע, עם יום הטיפול שלכם' });
	links.push({ path: caseLink(r), he: 'האם יש עילה: מה צריך להוכיח ואילו מסמכים מוכיחים' });
	if (r.who === 'heir') { links.push({ path: '/applying-order-heirs-registrar/', he: 'צו ירושה: איך מבקשים אותו מהרשם' }); }
	if (r.retention) { links.push({ path: '/preservation-medical-records-regulations/', he: 'תקנות שמירת הרשומות: כל התקופות' }); }
	links.push({ path: '/attaching-expert-opinion-claim/', he: 'חוות דעת רפואית: למה היא נשענת על הרשומה' });
	return { official, links: links.slice(0, 4) };
}

/* ---------------- The letter ---------------- */

const BLANK = '__________';
const LF = ['pname', 'pid', 'rname', 'rid', 'inst', 'when', 'mail', 'phone', 'addr'];
const LF_HE = { pname: 'שם המטופל', pid: 'מספר זהות של המטופל', rname: 'שם המבקש (אם אינו המטופל)', rid: 'מספר זהות של המבקש', inst: 'שם המוסד והמחלקה', when: 'מתי היה הטיפול (במילים, לא חובה)', mail: 'דואר אלקטרוני לקבלת ההעתק', phone: 'טלפון', addr: 'כתובת למשלוח' };
const fv = (f, k) => String((f && f[k]) || '').trim();

/**
 * The letter as parts: a title, dated lines, paragraphs and numbered lists, built from the result and the letter fields.
 * Every legal sentence carries its section. Gender-neutral (passive, nouns). Returns [] when the result has errors.
 */
export function letterParts(reg, r, fields) {
	if (!r.ok) { return []; }
	const M = reg.malpractice_reshuma;
	const L = M.law;
	const R = M.regs;
	const C = M.circular;
	const f = fields || {};
	// The letter's basis: a parent of a patient who is an adult today asks with the patient's waiver, as a representative.
	const lw = r.asWho || r.who;
	const pname = fv(f, 'pname') || BLANK;
	const pid = fv(f, 'pid') || BLANK;
	const inst = fv(f, 'inst');
	const out = [];
	out.push({ kind: 'title', text: r.followup ? 'בקשה להשלמת מסמכים חסרים ברשומה הרפואית' : 'בקשה לקבלת העתק מהרשומה הרפואית' });
	out.push({ kind: 'line', text: `תאריך: ${isoToHe(r.today)}` });
	const to = r.where === 'hospital' ? `מחלקת רשומות ומידע רפואי, ${inst || BLANK}`
		: r.where === 'hmo' ? `${inst || `קופת החולים ${BLANK}`}, הגורם המטפל בבקשות להעתק רשומה רפואית`
			: r.where === 'clinic' ? `${inst || BLANK} (המטפל או המרפאה)` : `חיל הרפואה, צבא הגנה לישראל${inst ? `, ${inst}` : ''}`;
	out.push({ kind: 'line', text: `לכבוד: ${to}` });
	out.push({ kind: 'subject', text: `הנדון: ${r.followup ? 'השלמת מסמכים ברשומה הרפואית' : 'בקשה להעתק רשומה רפואית'} של ${pname}, מספר זהות ${pid}` });
	const when = fv(f, 'when') ? `${fv(f, 'when')} (סביב ${isoToHe(r.treated)})` : `סביב ${isoToHe(r.treated)}`;
	const lawRef = `${L.right_section} ל${L.he}`;
	const opening = {
		self: `מוגשת בזאת בקשה לקבל העתק מהרשומה הרפואית שלי, לפי ${lawRef}, בעניין הטיפול שניתן לי ${when}.`,
		parent: `מוגשת בזאת בקשה, כהורה ואפוטרופוס טבעי של הקטין ${pname} (${M.capacity.parents_section} ל${M.capacity.he}), לקבל העתק מהרשומה הרפואית של הקטין, לפי ${lawRef}, בעניין הטיפול ${when}.`,
		guardian: `מוגשת בזאת בקשה, כאפוטרופוס לגוף של ${pname} שמונה בצו בית משפט (העתק מצורף), לקבל העתק מהרשומה הרפואית, לפי ${lawRef}, בעניין הטיפול ${when}.`,
		poa: `מוגשת בזאת בקשה, כמיופה כוח של ${pname} ומקרובי המשפחה (ייפוי הכוח וכתב הוויתור מצורפים), לקבל העתק מהרשומה הרפואית, לפי ${lawRef}, בעניין הטיפול ${when}.`,
		heir: `מוגשת בזאת בקשה מכוח זכות הירושה, לאחר פטירת ${pname}${r.death ? ` ביום ${isoToHe(r.death)}` : ''}, לקבל העתק מהרשומה הרפואית, לפי ${C.sections.deceased} ל${C.he}, בעניין הטיפול ${when}.`,
		rep: `מוגשת בזאת בקשה, מטעם ${pname} ובהסכמתו בכתב, לקבל העתק מהרשומה הרפואית, לפי ${L.disclose_section} ל${L.he}, בעניין הטיפול ${when}. כתב ויתור על סודיות רפואית חתום מצורף.`,
	}[lw];
	out.push({ kind: 'p', text: opening });
	if (r.where === 'idf') { out.push({ kind: 'p', text: `לעניין סעיפים 17 עד 23 לחוק, חיל הרפואה הוא מוסד רפואי (${L.idf_section}).` }); }
	if (r.followup) {
		out.push({ kind: 'p', text: 'בהעתק שהתקבל חסרים המסמכים הבאים:' });
		r.missing.forEach((c) => out.push({ kind: 'li', text: docHe(reg, c) }));
		out.push({ kind: 'p', text: `לפי ${L.record_section} לחוק, המטפל חייב לתעד את מהלך הטיפול ברשומה, והמוסד אחראי לשמירתה (${L.keep_section}). מבוקש להשלים את המסמכים החסרים, ואם מסמך מסוים אינו קיים או לא נשמר, לאשר זאת בכתב ולציין מדוע.` });
	}
	if (r.docs.length) {
		out.push({ kind: 'p', text: r.followup ? 'וכן מבוקשים גם המסמכים הבאים:' : 'המסמכים המבוקשים:' });
		if (r.docs.includes('all')) {
			out.push({ kind: 'li', text: 'התיק הרפואי המלא, לרבות גיליון הקבלה, דוחות ניתוח, רישום ההרדמה, רישומי הסיעוד, טופסי ההסכמה, תוצאות המעבדה, בדיקות הדימות ופענוחיהן, גיליון חדר המיון ומכתב השחרור' });
		} else {
			r.docs.forEach((c) => out.push({ kind: 'li', text: docHe(reg, c) }));
		}
		out.push({ kind: 'li', text: 'וכל מסמך אחר ברשומה הנוגע לטיפול הזה' });
	}
	out.push({ kind: 'p', text: 'מבוקש לקבל את ההעתק בקובץ ממוחשב, בדואר אלקטרוני או על גבי תקליטור, ואת בדיקות הדימות על תקליטור.' });
	if (r.capped) {
		const dec = r.dec && r.dec.capped ? ` הבקשה מוגשת בתוך ${R.deceased_days} ימים מיום הפטירה ונוגעת לטיפולים בששת החודשים שקדמו לה, ולכן חל עליה התשלום המרבי (${R.sections.deceased}).` : '';
		out.push({ kind: 'p', text: `לפי ${R.sections.computerised} ל${R.he}, התשלום המרבי בעד העתק רשומה ממוחשבת שנוצרה בחמש השנים שקדמו לבקשה הוא ${nis(R.computerised_max)} לבקשה, כולל המרה לקובץ, וכל תקליטור נוסף בלי תשלום; העתק של רשומה שאינה ממוחשבת: לכל היותר לפי תעריפון משרד הבריאות (${R.sections.paper}).${dec} לפי ${R.sections.filing} לא ייגבה תשלום בעד הגשת הבקשה, והתשלום ייגבה במועד המסירה.` });
		const free = r.docItems.filter((d) => d.cost === 'free_once');
		if (free.length) { out.push({ kind: 'p', text: `${free.map((d) => d.he).join(' ו')} ניתנים בלי תשלום פעם אחת, בגמר הטיפול או בשחרור (${R.sections.free}).` }); }
	} else {
		out.push({ kind: 'p', text: 'מבוקש לקבל מראש פירוט של הסכום, לפי תעריפון משרד הבריאות, לפני הפקת ההעתק.' });
	}
	out.push({ kind: 'p', text: 'מבוקש לשמור את הרשומה המקורית במלואה, ולא לבער ממנה דבר, כל עוד העניין פתוח.' });
	out.push({ kind: 'p', text: `נודה למענה בהקדם, ובכל מקרה בתוך זמן המענה שהמוסד מפרסם (${C.sections.publish} ל${C.short_he}). אם יוחלט שלא למסור מידע מסוים (${L.withhold_section} לחוק), מבוקשת הודעה בכתב על כך.` });
	const contact = [fv(f, 'mail') && `דואר אלקטרוני: ${fv(f, 'mail')}`, fv(f, 'phone') && `טלפון: ${fv(f, 'phone')}`, fv(f, 'addr') && `כתובת: ${fv(f, 'addr')}`].filter(Boolean);
	out.push({ kind: 'p', text: `פרטים ליצירת קשר: ${contact.length ? contact.join(' · ') : `דואר אלקטרוני ${BLANK} · טלפון ${BLANK}`}` });
	out.push({ kind: 'p', text: 'מצורפים:' });
	(lw === 'self' ? ['צילום תעודה מזהה עם תמונה'] : r.attach.filter((a) => !/^אם ההורים/.test(a))).forEach((a) => out.push({ kind: 'li', text: a }));
	out.push({ kind: 'line', text: 'בכבוד רב,' });
	const signer = lw === 'self' ? pname : fv(f, 'rname') || BLANK;
	const signerId = lw === 'self' ? pid : fv(f, 'rid') || BLANK;
	out.push({ kind: 'sig', text: `שם: ${signer} · מספר זהות: ${signerId} · חתימה: ${BLANK}` });
	if (lw === 'rep' || lw === 'poa') {
		out.push({ kind: 'h', text: 'נספח: כתב ויתור על סודיות רפואית' });
		out.push({ kind: 'p', text: `בזאת ניתנת הסכמתי למסור ל-${fv(f, 'rname') || BLANK} (פרטי המבקש ופרטי הקשר: ${BLANK}) את המידע הרפואי הבא מהרשומה הרפואית שלי ב-${inst || BLANK}: ${r.docs.includes('all') ? 'התיק הרפואי המלא' : [...r.docs, ...r.missing].map((c) => docHe(reg, c)).join(', ')}. ההסכמה פוטרת את המוסד מחובת הסודיות לגבי מידע זה בלבד, ומטענות בגין מסירתו (${L.disclose_section} לחוק; ${C.sections.waiver} ל${C.short_he}).` });
		out.push({ kind: 'line', text: `פרטי המטופל: שם מלא ${pname} · מספר זהות ${pid} · שנת לידה ${BLANK} · כתובת ${BLANK} · טלפון ${BLANK}` });
		out.push({ kind: 'line', text: `סייגים: ${BLANK}` });
		out.push({ kind: 'line', text: `תאריך: ${BLANK} · חתימת המטופל: ${BLANK}` });
		out.push({ kind: 'line', text: `העד (רופא, אחות, עורך דין, בעל מקצוע בריאות ברישיון, רשם רפואי, מורשה חתימה בבנק או סוכן ביטוח): שם ${BLANK} · מספר רישיון ${BLANK} · חתימה ${BLANK}` });
	}
	return out;
}

export function letterText(parts) {
	let n = 0;
	return parts.map((x) => {
		if (x.kind === 'li') { n += 1; return `${n}. ${x.text}`; }
		n = 0;
		return x.kind === 'title' || x.kind === 'h' ? `${x.text}\n` : x.text;
	}).join('\n');
}

export function letterHtml(parts) {
	let html = '';
	let open = false;
	parts.forEach((x) => {
		if (x.kind === 'li') {
			if (!open) { html += '<ol>'; open = true; }
			html += `<li>${esc(x.text)}</li>`;
			return;
		}
		if (open) { html += '</ol>'; open = false; }
		if (x.kind === 'title') { html += `<p class="${P}-letter__title">${esc(x.text)}</p>`; } else if (x.kind === 'h') { html += `<p class="${P}-letter__title ${P}-letter__annex">${esc(x.text)}</p>`; } else if (x.kind === 'subject') { html += `<p class="${P}-letter__subject">${esc(x.text)}</p>`; } else { html += `<p class="${P}-letter__${x.kind}">${esc(x.text)}</p>`; }
	});
	if (open) { html += '</ol>'; }
	return html;
}

/** The letter as an editable Word file (word-document.js): a title, a draft notice, the paragraphs, numbered items. */
export function exportWordLetter(reg, r, fields) {
	const parts = letterParts(reg, r, fields);
	if (!parts.length) { return null; }
	const paragraphs = [];
	let n = 0;
	parts.forEach((x, k) => {
		if (x.kind === 'title') { paragraphs.push({ text: x.text, style: 'Title' }); if (k === 0) { paragraphs.push({ text: 'טיוטה מ-jus-tice.co.il: לבדוק ולהשלים את הפרטים, למחוק שורה זו ולחתום.', style: 'Notice' }); } return; }
		if (x.kind === 'h') { n = 0; paragraphs.push({ text: x.text, style: 'Heading1' }); return; }
		if (x.kind === 'li') { n += 1; paragraphs.push({ text: `${n}. ${x.text}` }); return; }
		n = 0;
		paragraphs.push({ text: x.text, keepNext: x.kind === 'subject' });
	});
	return { bytes: wordDocument(paragraphs), filename: r.followup ? 'medical-records-missing.docx' : 'medical-records-request.docx', mime: WORD_MIME };
}

function letterBlock(reg, r, fields) {
	const f = fields || {};
	const show = (k) => (k === 'rname' || k === 'rid' ? r.who !== 'self' : true);
	return `<div class="jtool-tablewrap ${P}-letter"><div class="jtool-tablewrap__head"><h3 id="${P}-letter-h" tabindex="-1">${r.followup ? 'המכתב: בקשה להשלמת מסמכים' : 'המכתב לבקשת הרשומה'}</h3><div class="jtool-actions"><button class="jtool-btn jtool-btn--primary" type="button" data-act="download-word">הורדת קובץ וורד</button><button class="jtool-btn" type="button" data-act="copy-letter">העתקת המכתב</button><button class="jtool-btn" type="button" data-act="print-letter">הדפסת המכתב</button></div></div>`
		+ `<p class="${P}-note">השם ומספר הזהות נכתבים רק כאן ונשארים בדף שלכם: הם לא נכנסים לקישור השיתוף, לשמירה במכשיר או לתרחיש.</p>`
		+ `<div class="${P}-letter__grid"><div class="${P}-letter__side"><div class="${P}-lf">${LF.filter(show).map((k) => `<div class="jtool-field"><label class="jtool-label" for="${P}-lf-${k}">${esc(LF_HE[k])}</label><input id="${P}-lf-${k}" data-lf="${k}" type="text" autocomplete="off" value="${esc(fv(f, k))}"></div>`).join('')}</div>${slip(reg, r, { mini: true })}</div>`
		+ `<div class="${P}-letter__doc" data-${P}-letter lang="he" dir="rtl">${letterHtml(letterParts(reg, r, f))}</div></div>`
		+ `<p class="${P}-note">קובץ הוורד נוצר במכשיר שלכם וניתן לעריכה. שולחים לפי הדרך שהמוסד מפרסם: טופס מקוון, דואר אלקטרוני או מסירה ביד.</p></div>`;
}

/* ---------------- Result ---------------- */

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const M = reg.malpractice_reshuma;
	const R = M.regs;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	const b0 = r.basis[0];
	const state = r.adultNow ? '<p class="jtool-state jtool-state--danger">! המטופל בגיר היום: צריך את הסכמתו</p>'
		: `<p class="jtool-state jtool-state--ok">✓ ${esc(r.who === 'rep' ? `בהסכמת המטופל: ${b0.section}` : r.who === 'heir' ? `יורשים: ${b0.section}` : `הזכות: ${b0.section} לחוק זכויות החולה`)}</p>`;
	const label = r.capped ? (r.lead.kind === 'digital' ? 'התשלום המרבי להעתק ממוחשב של כל הבקשה' : 'התשלום המרבי להעתק על נייר') : 'אין תשלום מרבי בתקנות; כך בתעריפון משרד הבריאות';
	const rows = [];
	if (r.digitalMax !== null) { rows.push(`<div><dt>העתק ממוחשב</dt><dd>עד <bdi>${nis(r.digitalMax)}</bdi></dd></div>`); }
	if (r.paperMax !== null) { rows.push(`<div><dt>על נייר</dt><dd>עד <bdi>${nis(r.paperMax)}</bdi></dd></div>`); }
	rows.push('<div><dt>זמן מענה בחוק</dt><dd>לא נקבע</dd></div>');
	if (r.retention && r.retention.earliest) { rows.push(`<div><dt>מותר לבער מ-</dt><dd><bdi>${isoToHe(r.retention.earliest)}</bdi></dd></div>`); }
	if (r.dec && r.dec.capped) { rows.push(`<div><dt>להגיש עד</dt><dd><bdi>${isoToHe(r.dec.end)}</bdi></dd></div>`); }
	const flags = r.flags.map((x) => `<li class="${P}-flag ${P}-flag--${LEVEL[x.level] || 'info'}">${esc(x.he)}${x.section ? cite(x.section, x.url) : ''}</li>`).join('');
	const costRows = r.lines.map((l) => `<tr><td data-th="מה">${esc(l.he)}</td><td data-th="סכום">${l.kind === 'max' ? 'עד ' : l.kind === 'each' ? 'לכל זוג עמודים: ' : l.kind === 'info' ? 'לצילום ראשון: ' : ''}<bdi>${nis(l.amount)}</bdi></td><td data-th="המקור">${cite(l.section, l.url)}</td></tr>`).join('');
	const docRows = r.docItems.map((d) => `<li class="${P}-doc ${P}-doc--${d.cost}"><span class="${P}-kind">${d.cost === 'free_once' ? 'בלי תשלום, פעם אחת' : d.cost === 'free_if_out' ? 'בלי תשלום אם לא באשפוז' : 'חלק מהבקשה'}</span> ${esc(d.he)}</li>`).join('');
	const free = r.free.map((x) => `<li>${esc(x.he)}${cite(x.section, R.url)}</li>`).join('');
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${esc(situation(r))}: ${esc(label)}</p>`
		+ `<strong class="jtool-verdict__figure"><bdi>${nis(r.lead.amount)}</bdi></strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ slip(reg, r)
		+ (flags ? `<ul class="jtool-flags ${P}-flags">${flags}</ul>` : '')
		+ `<div class="${P}-box"><h3 class="${P}-h">מה מצרפים לבקשה</h3><ol class="${P}-attach">${r.attach.map((a) => `<li>${esc(a)}</li>`).join('')}</ol><ul class="${P}-basis">${r.basis.map((b) => `<li>${esc(b.he)}${cite(b.section, b.url)}</li>`).join('')}</ul></div>`
		+ `<div class="${P}-box"><h3 class="${P}-h">כמה זה עולה</h3>${r.capReasons.length ? `<p class="${P}-note">${esc(r.capReasons.join('. '))}.</p>` : ''}`
		+ `<div class="jtool-scroll" role="region" aria-label="שורות העלות" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">המקור</th></tr></thead><tbody>${costRows}</tbody><caption>${esc(r.capped ? `${R.short_he} חלות על ${R.capped_he}, על רשומה שנוצרה ב-${R.years} השנים שלפני הבקשה. כל הרשומה במוסד אחד היא בקשה אחת (${R.sections.unit}).` : `${M.tariff.he}, ${M.tariff.column_he}, בתוקף מ-${isoToHe(M.tariff.from)}. התקנות לא קובעות תקרה לבקשה הזו.`)}</caption></table></div>`
		+ (docRows ? `<ul class="${P}-docs-cost">${docRows}</ul>` : '')
		+ (free ? `<p class="${P}-sub">בלי תשלום לפי התקנות:</p><ul class="${P}-free">${free}</ul>` : '') + '</div>'
		+ `<div class="${P}-box"><h3 class="${P}-h">כמה זמן מחכים, ומה עושים כשאין תשובה</h3><p>${esc(r.response.he)}${cite(`${r.response.section} ל${M.circular.short_he}`, M.circular.url)}.</p>`
		+ `<ol class="${P}-steps"><li>${esc(`פונים לממונה על זכויות המטופל במוסד: ${M.law.officer_he}`)}${cite(M.law.officer_section, M.law.url)}</li>`
		+ `<li>${esc('אם הוחלט לא למסור מידע: ההחלטה עוברת לוועדת האתיקה, שרשאית לבטל אותה')}${cite(M.law.ethics_section, M.law.url)}</li>`
		+ `<li>${esc(M.law.objection_he)}${cite(M.law.objection_section, M.law.url)}</li>`
		+ `<li>${esc(`${M.complaints.commission_he}: תלונה על המוסד או על הקופה`)}${cite('משרד הבריאות', M.complaints.commission_url)}</li></ol></div>`
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${RS_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל חקירה נגדית של המומחה</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** How long a hospital keeps each requested document (the 1976 regulations), every reading with its row and date. */
export function retentionTable(reg, r, opts = {}) {
	const K = reg.malpractice_reshuma.retention;
	if (!r.retention) {
		return `<p class="${P}-note">${esc(r.where === 'hospital' ? `${K.state_he} (${K.state_section}).` : `התקנות חלות על ${K.scope_he}; לא נמצאה תקופה במספר ל${WHERE_TO[r.where]} בטקסטים שנקראו.`)}</p>`;
	}
	const body = r.retention.items.map((x) => x.rows.map((row, k) => {
		const past = opts.today && row.date < opts.today;
		return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="המסמך">${k === 0 ? `<strong>${esc(x.he)}</strong>` : ''}</td><td data-th="פרט בתוספת">${esc(`${row.n}. ${row.he}`)}</td><td data-th="כמה זמן">${esc(row.readings.map((y) => y.he).join('; '))}</td><td data-th="מותר לבער מ-"><bdi>${isoToHe(row.date)}</bdi>${past ? ' (עבר)' : ''}</td></tr>`;
	}).join('')).join('');
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-ret-h" tabindex="0"><table class="jtool-table ${P}-wrap ${P}-ret"><thead><tr><th scope="col">המסמך</th><th scope="col">פרט בתוספת</th><th scope="col">כמה זמן</th><th scope="col">מותר לבער מ-</th></tr></thead><tbody>${body}</tbody>`
		+ `<caption>${esc(`${K.he}, ${K.section} (נוסח ל-${isoToHe(K.current_to)}). נספר מיום הטיפול: טיפול או רישום מאוחר יותר דוחה את המועד. בכל מסמך, השורה הראשונה היא המוקדמת. רופא רשאי להורות לשמור יותר (${K.doctor_section}).`)}</caption></table></div>`;
}

/** What changed and when: only values an official text dates. */
export function changesTable(reg, r) {
	const M = reg.malpractice_reshuma;
	const R = M.regs;
	const start = r && r.ok ? r.start : addDays(R.published, R.start_days);
	const rows = [
		{ key: M.retention.newborn.from, what: M.retention.newborn.rule_he, src: M.retention.newborn.he, url: M.retention.newborn.url },
		{ key: R.applies_from, what: `התקנות חלות על רשומה שנוצרה מיום זה (${R.sections.applies})`, src: R.sections.applies, url: R.url },
		{ key: R.published, what: `פורסמו ${R.he} (${R.kt_he})`, src: R.kt_he, url: R.url },
		{ key: start, what: `תחילת התקנות, ${R.start_days} ימים מהפרסום: העתק ממוחשב עד ${nis(R.computerised_max)} (${R.sections.start})`, src: R.sections.start, url: R.url },
		{ key: R.paper_from, what: `תחילת ${R.sections.paper}: העתק על נייר לפי תעריפון משרד הבריאות`, src: R.sections.start, url: R.url },
		{ key: M.circular.published, what: `פורסם ${M.circular.he}; בתוקף מ-${isoToHe(M.circular.from)}, עודכן ${isoToHe(M.circular.updated)}`, src: M.circular.short_he, url: M.circular.page_url },
	];
	M.tariff.history.forEach((h) => rows.push({ key: h.from, what: `תעריפון: איתור והעתקת מסמכים עד 10 עמודים (L0268), ${nis(h.L0268)}`, src: 'תעריפון משרד הבריאות', url: h.url }));
	rows.sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתי"><bdi>${isoToHe(x.key)}</bdi></td><td data-th="מה השתנה">${esc(x.what)}</td><td data-th="מקור">${cite(x.src, x.url)}</td></tr>`).join('')
		+ `</tbody><caption>רק ערכים שפורסמו בנוסח רשמי, עם התאריך שלהם. התעריפון מתעדכן כמה פעמים בשנה (ב-${isoToHe(M.tariff.from)}: העלאה של ${M.tariff.raise_pct}%).</caption></table></div>`;
}

/** The rules, one row each, with the section: the page table (compare_table). */
export function rulesTable(reg) {
	const M = reg.malpractice_reshuma;
	const L = M.law;
	const R = M.regs;
	const T = M.tariff;
	const C = M.circular;
	const K = M.retention;
	const rows = [
		['הזכות לקבל מידע מהרשומה, כולל העתק', 'המטופל', `${L.right_section} לחוק`, L.url],
		['מידע שעלול לגרום נזק חמור', 'המטפל רשאי לא למסור; ועדת האתיקה מחליטה', `${L.withhold_section}-(ה) לחוק`, L.url],
		['מסירה לעורך דין, מומחה או אחר', 'בהסכמת המטופל, בכתב ויתור', `${L.disclose_section} לחוק; ${C.sections.waiver} לחוזר`, L.url],
		['קטין', 'אחד ההורים, אלא אם השני מתנגד', `${M.capacity.parents_section} לחוק הכשרות; ${C.sections.minor} לחוזר`, M.capacity.url],
		['אחרי פטירה', 'היורשים: צו ירושה, צו קיום צוואה, צו בית משפט או תצהיר', `${C.sections.deceased} לחוזר`, C.url],
		['חיל הרפואה', 'מוסד רפואי לעניין סעיפים 17 עד 23', `${L.idf_section} לחוק`, L.url],
		['העתק ממוחשב', `עד ${nis(R.computerised_max)} לבקשה, כולל המרה; תקליטור נוסף ${nis(R.extra_disc)}`, `${R.sections.computerised} והתוספת`, R.url],
		['העתק על נייר', `תעריפון: ${nis(T.items.L0268.amount)} עד 10 עמודים, ${nis(T.items.L0269.amount)} לכל 2 עמודים נוספים (מ-${isoToHe(T.from)})`, `${R.sections.paper}; תעריפון L0268, L0269`, T.file_url],
		['למי חלה התקרה', `${R.capped_he}; לא מבטח, לא עורך דין`, `${R.sections.computerised}; ${R.sections.definitions}`, R.url],
		['איזו רשומה', `שנוצרה ב-${R.years} השנים שלפני הבקשה, ומיום ${isoToHe(R.applies_from)}`, `${R.sections.five}; ${R.sections.applies}`, R.url],
		['קרוב של מי שנפטר', `תקרה על ${R.deceased_months} החודשים שלפני הפטירה, אם ביקש בתוך ${R.deceased_days} ימים`, R.sections.deceased, R.url],
		['בלי תשלום', 'צפייה מקוונת, הגשת הבקשה, מכתב השחרור וגיליון המיון פעם אחת, מרשמים והפניות', `${R.sections.online}-${R.sections.rx}`, R.url],
		['זמן מענה', 'לא נקבע מספר ימים; כל מוסד מפרסם את זמן המענה שלו', `${C.sections.publish} לחוזר`, C.url],
		['תיק אשפוז בבית חולים', `${K.rows['1'].years} שנים מהאשפוז האחרון; בלי גליון סיכום ${K.rows['1'].no_summary_years}, או ${K.rows['1'].death_years} אחרי פטירה`, `${K.section}, פרט 1`, K.url],
		['גליון סיכום מחלה', `${K.rows['3'].years} שנה`, `${K.section}, פרט 3`, K.url],
		['מסמכי חדר מיון', `${K.rows['6'].years} שנים`, `${K.section}, פרט 6`, K.url],
		['צילומי רנטגן', `${K.rows['13'].years} שנים, או ${K.rows['13'].death_years} אחרי פטירה`, `${K.section}, פרט 13`, K.url],
		['בית חולים ממשלתי או עירוני', 'תקופות התקנות לא חלות', K.state_section, K.url],
		['רשומת תינוק (מ-1.7.2005)', `${K.newborn.years} שנה, או ${K.newborn.death_years} אחרי פטירה; לרשומת היולדת מומלץ ${K.newborn.mother_years}`, 'חוזרי מינהל הרפואה 21/2005, 42/2006', K.newborn.url],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הכללים של בקשת הרשומה: מי, כמה, ועד מתי שומרים. ${esc(L.he)} (נוסח ל-${isoToHe(L.current_to)}), ${esc(R.he)} (נוסח ל-${isoToHe(R.current_to)}), ${esc(T.he)} (מ-${isoToHe(T.from)}), ${esc(C.short_he)} (עודכן ${isoToHe(C.updated)}), ${esc(K.he)} (נוסח ל-${isoToHe(K.current_to)}); נבדק ${isoToHe(M.checked_on)}.</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">הסעיף</th></tr></thead><tbody>`
		+ rows.map(([what, rule, src, url]) => `<tr><td data-th="מה">${esc(what)}</td><td data-th="הכלל">${esc(rule)}</td><td data-th="הסעיף">${cite(src, url)}</td></tr>`).join('')
		+ '</tbody></table></div>';
}

function methodList(reg, r) {
	const M = reg.malpractice_reshuma;
	const R = M.regs;
	const items = [];
	items.push(`${whoHe(r)} מבקש מ${WHERE_TO[r.where]}: ${r.basis.map((b) => b.section).join('; ')}`);
	items.push(`יום הטיפול ${isoToHe(r.treated)}; ${R.years} השנים שלפני הבקשה מתחילות ב-${isoToHe(r.fiveFrom)} (${R.sections.five})${r.regsApply ? '' : `; לפני ${isoToHe(R.applies_from)} התקנות לא חלות (${R.sections.applies})`}`);
	if (r.capped) {
		if (r.digitalMax !== null) { items.push(`העתק ממוחשב: עד ${nis(r.digitalMax)} לכל הבקשה (${R.sections.computerised} והתוספת)`); }
		if (r.paperMax !== null) { items.push(`על נייר: ${nis(r.paper.base)} עד 10 עמודים${r.paper.extraPairs ? ` ועוד ${r.paper.extraPairs} × ${nis(M.tariff.items.L0269.amount)} ל-${r.paper.pages - 10} העמודים הנוספים = ${nis(r.paper.total)}` : ''} (${R.sections.paper}; תעריפון מ-${isoToHe(M.tariff.from)})`); }
	} else {
		items.push(`אין תשלום מרבי: ${r.capReasons.join('; ')}`);
	}
	if (r.dec) { items.push(`פטירה ${isoToHe(r.death)}: ${R.deceased_days} ימים עד ${isoToHe(r.dec.plainEnd)}${r.dec.rolled ? `, יום מנוחה, ולכן ${isoToHe(r.dec.end)}` : ''}; הטיפולים מ-${isoToHe(r.dec.from)} (${R.sections.deceased})`); }
	items.push(`זמן מענה: ${r.response.he} (${r.response.section})`);
	if (r.retention) { r.retention.items.forEach((x) => items.push(`${x.he}: מותר לבער מ-${isoToHe(x.earliest)} (פרט ${x.rows[0].n}, ${x.rows[0].readings[0].he})`)); }
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

/** The one-page print: the request, the result, the cost, the dates, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const M = reg.malpractice_reshuma;
	return '<h3>בקשת הרשומה הרפואית: סיכום</h3>'
		+ `<p><strong>הבקשה:</strong> ${esc(situation(r))}; יום הטיפול ${isoToHe(r.treated)}; ${esc(r.docs.length ? r.docs.map((c) => docHe(reg, c)).join(', ') : '')}${r.followup ? `; חסרים: ${esc(r.missing.map((c) => docHe(reg, c)).join(', '))}` : ''}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p>${methodList(reg, r)}`
		+ `<p><strong>מצרפים:</strong> ${esc(r.attach.join('; '))}.</p>`
		+ (r.events.length ? `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.he)}`).join('; ')}.</p>` : '')
		+ `<p><strong>מקורות:</strong> ${esc(M.law.he)}, נוסח ל-${isoToHe(M.law.current_to)}; ${esc(M.regs.he)}, נוסח ל-${isoToHe(M.regs.current_to)}; ${esc(M.tariff.he)} מ-${isoToHe(M.tariff.from)}; ${esc(M.circular.he)}; ${esc(M.retention.he)}, נוסח ל-${isoToHe(M.retention.current_to)}. נבדק ${isoToHe(M.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const M = reg.malpractice_reshuma;
	const where = M.where.map((w) => `<li><a href="${esc(w.url)}" target="_blank" rel="noopener">${esc(w.he)}</a></li>`).join('');
	return `<div class="${P}-screen">`
		+ letterBlock(reg, r, opts.letter)
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-ret-h">כמה זמן בית החולים שומר כל מסמך</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${retentionTable(reg, r, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חושב, צעד אחר צעד</h3></div>${methodList(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-w-h">לאן שולחים: הדפים של הגופים עצמם</h3></div><ul class="${P}-where">${where}</ul><p class="${P}-note">כל מוסד מפרסם את הטופס, הדרך לפנות והתעריף שלו (${esc(M.circular.sections.publish)} ל${esc(M.circular.short_he)}). הדפים כאן הם כתובות לשליחה בלבד; הסכומים בכלי לקוחים מהתקנות ומהתעריפון.</p></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg, r)}</div>`
		+ `</div><div class="${P}-print" data-${P}-print>${printSummary(reg, r, opts.printedOn || opts.today || M.checked_on)}</div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]). Same markup on the server and in the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'להכין את המכתב שלכם' : 'לשנות את הבקשה'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">בקשת התיק הרפואי</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const M = reg.malpractice_reshuma;
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'הבקשה שלכם: '}${situation(r)}`;
	const unit = r.capped ? (r.lead.kind === 'digital' ? 'לכל היותר להעתק ממוחשב של כל הבקשה' : 'לכל היותר להעתק על נייר') : 'בתעריפון; אין תקרה בתקנות לבקשה הזו';
	const line = `${r.capped ? `${M.regs.sections.computerised} לתקנות התשלום המרבי. ` : ''}${r.paperMax !== null && r.digitalMax !== null ? `על נייר: עד ${nis(r.paperMax)} ל-10 עמודים. ` : ''}אין בחוק מספר ימים למענה.${r.retention && r.retention.earliest ? ` מותר לבער חלק מהמסמכים מ-${isoToHe(r.retention.earliest)}.` : ''} המכתב מוכן להורדה.`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure"><bdi>${nis(r.lead.amount)}</bdi></strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const r = rsCompute(reg, EXAMPLE);
	const M = reg.malpractice_reshuma;
	const R = M.regs;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.lead.amount,
		sticky: `<bdi>${nis(r.lead.amount)}</bdi>`,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { today: EXAMPLE.today, printedOn: EXAMPLE.today }),
		method: `<ol><li>המטופל מבקש את הרשומה שלו מבית חולים: זכות לקבל מידע מהרשומה, כולל העתק${cite(M.law.right_section, M.law.url)}</li>`
			+ `<li>יום הטיפול ${isoToHe(EXAMPLE.treated)}: בתוך ${R.years} השנים שלפני הבקשה (מ-${isoToHe(r.fiveFrom)}), ולכן חל התשלום המרבי${cite(R.sections.five, R.url)}</li>`
			+ `<li>העתק ממוחשב של כל הבקשה: עד ${nis(R.computerised_max)}, כולל המרה לקובץ ובדיקות דימות על תקליטור${cite(`${R.sections.computerised} והתוספת`, R.url)}</li>`
			+ `<li>העתק על נייר: עד ${nis(M.tariff.items.L0268.amount)} ל-10 עמודים ועוד ${nis(M.tariff.items.L0269.amount)} לכל 2 עמודים${cite(`${R.sections.paper}; תעריפון מ-${isoToHe(M.tariff.from)}`, M.tariff.file_url)}</li>`
			+ `<li>רישומי הסיעוד: מותר לבער מ-${isoToHe(r.retention.earliest)}, ${M.retention.rows['17'].years} שנים${cite(`${M.retention.section}, פרט 17`, M.retention.url)}</li></ol>`,
		compare_table: rulesTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

const WH = { self: 's', parent: 'p', guardian: 'g', poa: 'y', heir: 'h', rep: 'r' };
const PL = { hospital: 'h', hmo: 'k', clinic: 'c', idf: 'i' };
const OW = { other: 'o', state: 's', unknown: 'u' };
const FM = { any: 'a', digital: 'd', paper: 'p' };
const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
/** w who, p where, o the hospital's owner, d the documents (codes joined by dots), m the missing documents, f the format,
 * t the treatment day, b the birth day, x the death day, n the pages. Codes, numbers and dates only: never a name. */
export const KEYS = ['w', 'p', 'o', 'd', 'm', 'f', 't', 'b', 'x', 'n'];
export function stateOf(i) {
	const docs = rsDocs(i.docs);
	const missing = rsDocs(i.missing).filter((c) => c !== 'all');
	return encodeState({
		w: WH[i.who] || 's', p: PL[i.where] || 'h', o: i.where === 'hospital' || !i.where ? OW[i.owner] || 'u' : '', d: docs.join('.'), m: missing.join('.'),
		f: i.format && i.format !== 'any' ? FM[i.format] : '', t: i.treated || '', b: i.birth || '', x: i.who === 'heir' ? i.death || '' : '',
		n: i.pages === '' || i.pages === undefined || i.pages === null ? '' : Number(i.pages),
	});
}
/**
 * Back from a share state. A state without the treatment day or without any document (a sibling that knows only some facts)
 * takes them from `base` (the page passes the example) and lists them in `filled`, so the page can say so; without `base`
 * it returns null.
 */
export function inputOf(s, base) {
	if (!s || !KEYS.some((k) => s[k] !== undefined && s[k] !== '')) { return null; }
	const has = (k) => s[k] !== undefined && s[k] !== '';
	const filled = [];
	if (!has('t')) { if (!base) { return null; } filled.push('treated'); }
	if (!has('d') && !has('m')) { if (!base) { return null; } filled.push('docs'); }
	const b = base || {};
	return Object.assign({}, RS_BLANK, {
		who: back(WH, s.w, 'self'), where: back(PL, s.p, 'hospital'), owner: back(OW, s.o, 'unknown'),
		docs: has('d') ? rsDocs(String(s.d).split('.')) : has('m') ? [] : (b.docs || []).slice(), missing: has('m') ? rsDocs(String(s.m).split('.')).filter((c) => c !== 'all') : [],
		format: back(FM, s.f, 'any'), treated: s.t || b.treated, birth: s.b || '', death: s.x || '', pages: has('n') ? Number(s.n) : '', filled,
	});
}

/* ---------------- Browser ---------------- */

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const many = (name) => Array.from(root.querySelectorAll(`input[name="${P}-${name}"]:checked`)).map((x) => x.value);
	const who = pick('who', 'self');
	const pages = String(val('pages')).replace(/[,\s]/g, '');
	return {
		who, where: pick('where', 'hospital'), owner: val('own') || 'unknown', docs: many('doc'), missing: many('miss'), format: val('fmt') || 'any',
		treated: rsIsoIn(val('tr')), birth: rsIsoIn(who === 'parent' ? val('birth') : val('birth2')), death: who === 'heir' ? rsIsoIn(val('death')) : '',
		pages: pages === '' ? '' : pages, today,
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const M = reg.malpractice_reshuma;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	const letter = {};
	let own = false;
	let started = false;
	let timer = null;
	let last = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(M.checked_on, M.refresh_every_days) || (M.next_update && today >= M.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהתעריפון התעדכן'); }
	}
	const ids = { treated: 'tr', birth: 'birth', death: 'death', pages: 'pages', docs: 'docs' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			let id = ids[e.field];
			if (e.field === 'birth' && root.querySelector(`#${P}-birth2`) && !root.querySelector('[data-if-notparent]').hidden) { id = 'birth2'; }
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = (input) => {
		form.querySelectorAll('[data-if-hospital]').forEach((el) => { el.hidden = input.where !== 'hospital'; });
		form.querySelectorAll('[data-if-parent]').forEach((el) => { el.hidden = input.who !== 'parent'; });
		form.querySelectorAll('[data-if-notparent]').forEach((el) => { el.hidden = input.who === 'parent'; });
		form.querySelectorAll('[data-if-heir]').forEach((el) => { el.hidden = input.who !== 'heir'; });
		const key = Object.keys(PRESETS).find((k) => { const x = rsPreset(k, today); return x.who === input.who && x.where === input.where && x.treated === input.treated && x.docs.join() === rsDocs(input.docs).join() && x.missing.join() === rsDocs(input.missing).join(); }) || '';
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = rsCompute(reg, input);
		last = r;
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today: input.today, printedOn: today, letter });
		if (sticky) { sticky.innerHTML = r.ok ? `<bdi>${nis(r.lead.amount)}</bdi>` : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: rsBand(r) }); }
		return r;
	};
	const current = () => readForm(root, today);
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = current(); sync(input); run(input); }, 160);
	};
	// The letter fields live in the details block: typing there redraws only the letter, never the result (focus stays).
	details.addEventListener('input', (ev) => {
		const el = ev.target.closest('[data-lf]');
		if (!el) { return; }
		letter[el.getAttribute('data-lf')] = el.value;
		const doc = details.querySelector(`[data-${P}-letter]`);
		if (doc && last && last.ok) { doc.innerHTML = letterHtml(letterParts(reg, last, letter)); }
	});
	// A share link may name its tool (/@bakashat-reshuma); on a page with several tools only this tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS), Object.assign({}, EXAMPLE, rsPreset('surgery', today))) : null;
	const fromHash = parsed ? Object.assign(parsed, { today }) : null;
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) {
			note.hidden = false;
			if (fromHash.filled && fromHash.filled.length) { note.textContent = `נפתח מקישור. מהדוגמה הושלמו: ${fromHash.filled.map((f) => FILL_HE[f]).join(', ')}. אפשר לשנות.`; }
		}
		sync(fromHash);
		run(fromHash, { silent: true });
	} else {
		last = rsCompute(reg, EXAMPLE);
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
	// The summary prints as it is; the letter swaps into the print box and the page hides everything else (body.jt69-pl).
	const printWith = (html) => {
		const box = root.querySelector(`[data-${P}-print]`);
		const keep = box ? box.innerHTML : '';
		if (box && html) { box.innerHTML = html; document.body.classList.add(`${P}-pl`); }
		window.print();
		if (box && html) { setTimeout(() => { box.innerHTML = keep; document.body.classList.remove(`${P}-pl`); }, 0); }
	};
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'preset') {
			const input = rsPreset(b.getAttribute('data-preset'), today);
			if (!input) { return; }
			own = true;
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		const input = own ? current() : Object.assign({}, EXAMPLE);
		const r = own ? run(input, { silent: true }) : rsCompute(reg, input);
		last = r;
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (['download-word', 'copy-letter', 'print-letter', 'ics', 'print'].includes(act) && !r.ok) {
			toast(root, 'צריך לתקן את השדה המסומן לפני הכנת המכתב.');
			return;
		}
		if (act === 'download-word') {
			try {
				const file = exportWordLetter(reg, r, letter);
				download(file.filename, file.mime, file.bytes);
				toast(root, 'קובץ הוורד ירד למכשיר. אפשר לערוך, לחתום ולשלוח.');
				track('tool_download', { tool_id: TOOL_ID, type: 'word' });
			} catch (e) {
				toast(root, 'לא הצלחנו ליצור קובץ וורד. אפשר להעתיק את המכתב או להדפיס.');
			}
		} else if (act === 'copy-letter') {
			const ok = await copyText(letterText(letterParts(reg, r, letter)));
			toast(root, ok ? 'המכתב הועתק.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy_letter' });
		} else if (act === 'print-letter') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print_letter' });
			printWith(`<div class="${P}-letter__doc">${letterHtml(letterParts(reg, r, letter))}</div>`);
		} else if (act === 'ics') {
			if (!r.events.length) { toast(root, 'אין לבקשה הזו מועד שחוק או תקנה קובעים. זמן המענה לא נקבע בחוק.'); return; }
			download('bakashat-reshuma.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `הרשומה הרפואית: ${e.he}`, description: `${e.section}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			printWith('');
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק קודים ותאריכים, בלי שם ובלי תעודת זהות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (jus-tice.co.il, ${isoToHe(M.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: rsBand(r) });
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
			toast(root, 'נשמר במכשיר הזה בלבד, בלי השם ומספר הזהות. אפשר למחוק בכל רגע.');
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
