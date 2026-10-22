/**
 * The road-accident and personal-injury wave UI (22.10.2026, HAD-591): the disability-degree instrument (shiklul-nechut,
 * prefix jt62) on /regulations-insurance-1956/. The picture is the one the regulations describe in words: a bar of the
 * person's whole capacity (100%), from which each impairment, the largest first, cuts its share of what is still left
 * (reg. 11(ב)); the reg. 15 increase is drawn as a hatched extension, the grant and pension lines of the law (9%, 20%)
 * and the general-disability gates (40%, 60%) are ticks under the bar, and what stays uncut is the "remaining capacity".
 * The bar has a sentence of text for screen readers. Under it: what the degree means for a work injury (nothing / grant /
 * pension, with the reader's daily injury allowance), for general disability (the 1984 rules and the medical gates) and
 * for a road accident (the 1976 regulations' share of the maximum), each with a link that opens the sibling tool with
 * the numbers filled in; the dates the regulations set (.ics); the list of common items with their numbers and %; the
 * hearing and sight tables; what changed and when; the scenario for the simulation (the medical committee) and the next
 * steps; a one-page summary prints on its own.
 */
import { skCompute, skBand, skItem, skColumn, SK_MAX_ITEMS } from './shiklul-engine.js';
import { parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'shiklul-nechut';
export const PAGE = '/regulations-insurance-1956/';
const P = 'jt62';
const SK_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=witness_prep&topic=personal-injury';
/** The sibling instruments of the cluster (pages from the wave's contract; each opens with its own share state). */
export const SIBLINGS = {
	avoda: '/work-accident-guide/',
	drachim: '/israel-road-accident-compensation-law/',
	nechut: '/general-disability-pension-2026/',
};
const SK_BLANK = { items: [], lefty: false, kind: 'stable', r15: '', r15pct: '', age: '', daily: '', decided: '', received: '', appealReceived: '', tempTo: '', injury: '' };

/** One click to a full profile: the items of a common situation (the reader's own dates and amounts stay). */
export const PRESETS = {
	btl: { he: 'גב 20% וברך 10% (דוגמת המוסד)', kind: 'stable', r15: '', items: [{ code: 'c37-7b' }, { code: 'c48-2z1', side: 'l' }] },
	r15: { he: 'גב וכתף, תקנה 15 בשליש', kind: 'stable', r15: 't', items: [{ code: 'c37-7c' }, { code: 'c41-4c', side: 'r' }] },
	grant: { he: 'ברך וצלקת: מענק', kind: 'stable', r15: '', items: [{ code: 'c48-2z1', side: 'r' }, { code: 'c75-1b' }] },
	prev: { he: 'מצב קודם בגב: 30% פחות 10%', kind: 'stable', r15: '', items: [{ code: 'c37-7c', prev: 10 }] },
	ptsd: { he: 'פוסט-טראומה ושמיעה, נכות זמנית', kind: 'temp', r15: '', items: [{ code: 'c34b3' }, { code: 'hear', a: 45, b: 30 }] },
};
const skRow = (x) => Object.assign({ code: '', pct: '', side: 'r', prev: '', a: '', b: '' }, x || {});
/** A preset on top of the reader's own extra fields (age, daily allowance, dates). */
export function skPreset(key, keep) {
	const p = PRESETS[key];
	if (!p) { return null; }
	return Object.assign({}, SK_BLANK, keep || {}, { kind: p.kind, r15: p.r15, r15pct: '', lefty: false, items: p.items.map(skRow) });
}
export const EXAMPLE = skPreset('btl', { age: 45, daily: 400, decided: '2026-10-01', received: '2026-10-08' });

const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const pctTxt = (n) => `${(Math.round(Number(n) * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`;
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const skIso = (text) => { const raw = String(text || '').trim(); return raw ? (parseDate(raw) || raw) : ''; };
const show = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : String(v));
const countHe = (n) => (n === 1 ? 'פגימה אחת' : `${n} פגימות`);
const kindHe = (k) => (k === 'temp' ? 'דרגה זמנית' : 'דרגה יציבה (לצמיתות)');
const outcomeHe = { pension: 'קצבת נכות חודשית', grant: 'מענק חד-פעמי', temp: 'קצבה לתקופת הנכות הזמנית', none: 'אין תשלום מהביטוח הלאומי' };

/* ---------------- Pure renderers ---------------- */

function itemOptions(reg, code) {
	const S = reg.injury_shiklul;
	const groups = Object.entries(S.areas).map(([area, he]) => {
		const opts = S.items.filter((x) => x.area === area).map((x) => {
			const v = x.pct !== undefined ? `${x.pct}%` : (x.r === x.l ? `${x.r}%` : `ימין ${x.r}%, שמאל ${x.l}%`);
			return `<option value="${esc(x.id)}"${code === x.id ? ' selected' : ''}>${esc(`${x.item}: ${x.he} (${v})`)}</option>`;
		}).join('');
		const tables = area === 'senses'
			? `<option value="hear"${code === 'hear' ? ' selected' : ''}>${esc(`${S.tables.hearing.item}: ליקוי שמיעה, לפי הלוח (דציבלים בכל אוזן)`)}</option><option value="see"${code === 'see' ? ' selected' : ''}>${esc(`${S.tables.vision.item}: ליקוי ראייה, לפי הלוח (חדות בכל עין)`)}</option>`
			: '';
		return `<optgroup label="${esc(he)}">${tables}${opts}</optgroup>`;
	}).join('');
	return `<option value="free"${!code ? ' selected' : ''}>אחר: להזין את האחוז שנקבע</option>${groups}`;
}

function rowHtml(reg, it, i, n, lefty) {
	const S = reg.injury_shiklul;
	const code = it.code || '';
	const def = code && code !== 'hear' && code !== 'see' ? skItem(reg, code) : null;
	const limb = def && def.limb;
	const id = (k) => `${P}-${k}${i}`;
	const num = (k, label, v, ph, hint) => `<div class="jtool-field ${P}-f"><label class="jtool-label" for="${id(k)}">${esc(label)}</label><input id="${id(k)}" type="text" inputmode="decimal" autocomplete="off" value="${esc(show(v))}" placeholder="${esc(ph)}"${hint ? ` aria-describedby="${id(k)}-h"` : ''}>${hint ? `<p class="jtool-hint" id="${id(k)}-h">${esc(hint)}</p>` : ''}</div>`;
	const visionSel = (k, label, v) => `<div class="jtool-field ${P}-f"><label class="jtool-label" for="${id(k)}">${esc(label)}</label><select id="${id(k)}">${S.tables.vision.labels.map((l, j) => `<option value="${j}"${String(v) === String(j) ? ' selected' : ''}>${esc(l === 'NLP' ? 'אין תפיסת אור (NLP)' : l)}</option>`).join('')}</select></div>`;
	let body = '';
	if (code === 'hear') {
		body = `<div class="jtool-row">${num('ha', 'אוזן ימין: ירידה בדציבלים', it.a, 'לדוגמה: 45', S.tables.hearing.freq_he)}${num('hb', 'אוזן שמאל: ירידה בדציבלים', it.b, 'לדוגמה: 30', '')}</div>`;
	} else if (code === 'see') {
		body = `<div class="jtool-row">${visionSel('va', 'עין ימין: חדות ראייה עם תיקון', it.a === '' ? 0 : it.a)}${visionSel('vb', 'עין שמאל: חדות ראייה עם תיקון', it.b === '' ? 0 : it.b)}</div>`;
	} else if (!def) {
		body = `<div class="jtool-row">${num('p', 'אחוז הנכות שנקבע לפגימה', it.pct, 'לדוגמה: 10', 'כפי שכתוב בפרוטוקול הוועדה, לצד מספר הסעיף')}</div>`;
	}
	const side = limb ? `<div class="jtool-field ${P}-f"><label class="jtool-label" for="${id('s')}">צד</label><select id="${id('s')}"><option value="r"${it.side !== 'l' ? ' selected' : ''}>ימין</option><option value="l"${it.side === 'l' ? ' selected' : ''}>שמאל</option></select></div>` : '';
	const col = skColumn(it.side, lefty);
	const val = def ? (def.pct !== undefined ? `${def.pct}%` : `${def[col]}% (עמודת ${col === 'l' ? 'שמאל' : 'ימין'} בתוספת)`) : '';
	const tag = def ? `<p class="${P}-row__tag">פרט <bdi>${esc(def.item)}</bdi>: ${esc(def.he)} · <bdi>${esc(val)}</bdi></p>` : '';
	return `<li class="${P}-row" data-row="${i}"><div class="${P}-row__head"><span class="${P}-row__n" aria-hidden="true">${i + 1}</span><div class="jtool-field ${P}-f ${P}-f--item"><label class="jtool-label" for="${id('c')}">פגימה ${i + 1}</label><select id="${id('c')}" data-sk-code>${itemOptions(reg, code)}</select></div>`
		+ `${n > 1 ? `<button type="button" class="jtool-iconbtn ${P}-rm" data-act="remove" data-row="${i}" aria-label="${esc(`להסיר את פגימה ${i + 1}`)}">✕</button>` : ''}</div>`
		+ `${tag}${body}<div class="jtool-row">${side}${num('v', 'מתוך זה: מצב קודם (באחוזים)', it.prev, 'ריק = אין', 'ליקוי באותו מקום שהיה לפני הפגיעה ומופחת ממנה')}</div>`
		+ `<p class="jtool-error" id="${P}-item${i}-e" role="alert"></p></li>`;
}

export function renderForm(reg, input) {
	const S = reg.injury_shiklul;
	const i = Object.assign({}, SK_BLANK, input || {});
	const items = (i.items && i.items.length ? i.items : [skRow()]).slice(0, SK_MAX_ITEMS).map(skRow);
	const preset = Object.keys(PRESETS).find((k) => {
		const p = PRESETS[k];
		return p.kind === i.kind && p.r15 === (i.r15 || '') && !i.lefty && p.items.length === items.length && p.items.every((x, j) => { const y = items[j]; return (x.code || '') === y.code && (x.side || 'r') === y.side && show(x.prev) === show(y.prev) && show(x.a) === show(y.a) && show(x.b) === show(y.b); });
	}) || '';
	const r15 = S.r15;
	const date = (id, key, label, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(i[key] ? isoToHe(i[key]) : '')}" placeholder="לדוגמה: 1.10.2026" aria-describedby="${P}-${key}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${key}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const num = (id, key, label, ph, hint, suffix) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label>${suffix ? '<div class="jtool-input jtool-input--money">' : ''}<input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(show(i[key]))}" placeholder="${esc(ph)}" aria-describedby="${P}-${key}-e${hint ? ` ${P}-${id}-h` : ''}">${suffix ? `<span class="jtool-input__suffix" aria-hidden="true">${suffix}</span></div>` : ''}<p class="jtool-error" id="${P}-${key}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const extra = Boolean(i.age !== '' || i.daily !== '' || i.decided || i.received || i.appealReceived || i.tempTo || i.injury);
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא את הפגימות; הגיל, דמי הפגיעה והתאריכים שהזנתם נשארים.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>סוג הדרגה</legend><div class="jtool-chips">${chip('kind', 'stable', 'לצמיתות (יציבה)', i.kind !== 'temp')}${chip('kind', 'temp', 'זמנית', i.kind === 'temp')}</div><p class="jtool-hint">${esc(`${S.law.stable_he} (${S.law.stable_section} לחוק).`)}</p></fieldset>`
		+ `<fieldset class="jtool-field ${P}-items"><legend>הפגימות שנקבעו (מספר הסעיף והאחוז בפרוטוקול)</legend><ol class="${P}-rows">${items.map((it, j) => rowHtml(reg, it, j, items.length, i.lefty)).join('')}</ol>`
		+ `<p class="jtool-error" id="${P}-items-e" role="alert"></p>${items.length < SK_MAX_ITEMS ? `<button type="button" class="jtool-btn ${P}-add" data-act="add">+ להוסיף פגימה</button>` : ''}`
		+ `<div class="jtool-chips ${P}-opts">${chip('lefty', '1', 'איטר יד ימין (משתמש ביד שמאל)', Boolean(i.lefty), 'checkbox')}</div></fieldset>`
		+ `<fieldset class="jtool-field ${P}-r15"${i.kind === 'temp' ? ' data-off="1"' : ''}><legend>תקנה 15: ההגדלה שהוועדה נתנה (אם נתנה)</legend><div class="jtool-chips">${chip('r15', '', 'לא הוחלה', !i.r15)}${r15.steps.map((s) => chip('r15', s.code, `ב${s.he}`, i.r15 === s.code)).join('')}${chip('r15', 'x', 'שיעור אחר', i.r15 === 'x')}</div>`
		+ `<div class="jtool-row" data-if-r15x${i.r15 === 'x' ? '' : ' hidden'}>${num('r15p', 'r15pct', 'ההגדלה באחוזים מהדרגה (עד 50)', 'לדוגמה: 20', '')}</div><p class="jtool-error" id="${P}-r15-e" role="alert"></p>`
		+ `<p class="jtool-hint">${esc(`${i.kind === 'temp' ? `${r15.stable_he}. ` : ''}עד מחצית מהדרגה; כשהדרגה פחותה מ-${r15.under}%, לא יותר מ-${r15.grant_cap}% (${r15.section}). זו החלטה של הוועדה: הכלי לא מנבא אותה, רק מחשב את מה שנקבע.`)}</p></fieldset>`
		+ `<details class="jtool-more ${P}-extra"${extra ? ' open' : ''}><summary>לתוצאה מלאה: גיל, דמי פגיעה ותאריכים</summary>`
		+ `<div class="jtool-row">${num('age', 'age', 'גיל ביום הפגיעה', 'לא חובה', 'לפיצוי על כאב וסבל בתאונת דרכים (תקנה 3) ולכלי הנכות הכללית')}${num('daily', 'daily', 'דמי פגיעה ליום', 'לא חובה', 'מהמכתב של הביטוח הלאומי; הקצבה המלאה היא פי 30 (סעיף 105)', '₪')}</div>`
		+ `<div class="jtool-row">${date('dec', 'decided', 'יום החלטת הוועדה הרפואית', 'כתוב בפרוטוקול')}${date('rec', 'received', 'היום שבו ההחלטה הגיעה אליכם', 'ממנו סופרים את 30 ימי הערר')}</div>`
		+ `<div class="jtool-row">${date('apr', 'appealReceived', 'היום שבו הגיעה החלטת הוועדה לעררים', 'אם הייתה')}${i.kind === 'temp' ? date('tto', 'tempTo', 'סוף תקופת הנכות הזמנית', 'כפי שקבעה הוועדה') : ''}${date('inj', 'injury', 'יום הפגיעה', 'לקישור לכלי תאונות הדרכים')}</div></details>`;
}

/** The weighting written out: "20% + 10% מתוך 80% = 28%". */
export function weightingText(reg, r) {
	if (!r.ok || !r.steps.length) { return ''; }
	const parts = r.steps.map((s, i) => (i === 0 ? `${pctTxt(s.add)} במלואו` : `ועוד ${pctTxt(s.pct)} מתוך ${pctTxt(s.from)} שנשארו (${pctTxt(s.add)})`));
	return `${parts.join(', ')}: סך הכול ${pctTxt(r.medical)}`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const S = reg.injury_shiklul;
	const L = S.law;
	const list = r.units.map((u) => pctTxt(u.pct)).join(', ');
	const w = r.units.length > 1 ? `בשקלול לפי ${S.rules.weighting.section} (הגבוה במלואו, וכל אחד אחריו מתוך מה שנשאר): ${pctTxt(r.medical)}.` : `דרגה לפי המבחנים: ${pctTxt(r.medical)}.`;
	const r15 = r.r15 ? ` לפי ${S.r15.section} הוגדלה ל-${pctTxt(r.r15.value)}.` : '';
	const round = r.rounded ? ` השבר עוגל כלפי מעלה (${S.rules.rounding.section}).` : '';
	let what = '';
	if (r.outcome === 'pension') { what = `${kindHe(r.kind)} של ${pctTxt(r.degree)}: קצבת נכות חודשית (${L.pension_section}${r.kind === 'stable' ? '(1)' : '(2)'})${r.money.monthly !== null ? `, ${nis(r.money.monthly)} בחודש לפי דמי הפגיעה שהזנתם` : ''}.`; }
	if (r.outcome === 'temp') { what = `${kindHe(r.kind)} של ${pctTxt(r.degree)}: קצבה לתקופה שהוועדה קבעה (${L.pension_section}(2))${r.money.monthly !== null ? `, ${nis(r.money.monthly)} בחודש לפי דמי הפגיעה שהזנתם` : ''}.`; }
	if (r.outcome === 'grant') { what = `${kindHe(r.kind)} של ${pctTxt(r.degree)}: מענק חד-פעמי של ${L.grant_months} קצבאות חודשיות (${L.grant_section}, ${L.grant_calc_section})${r.money.grant !== null ? `, ${nis(r.money.grant)} לפי דמי הפגיעה שהזנתם` : ''}.`; }
	if (r.outcome === 'none') { what = `${kindHe(r.kind)} של ${pctTxt(r.degree)}: פחות מ-${L.grant_min}%, ולכן אין קצבה ואין מענק (${L.pension_section}, ${L.grant_section}).`; }
	return `${countHe(r.items.length)}${r.units.length > 1 ? ` (${list})` : ''}. ${w}${r15}${round} ${what}`;
}

/** The remaining-capacity bar: each impairment cuts its share of what is left; reg. 15 hatched; the law's lines as ticks. */
export function capacityBar(reg, r) {
	if (!r.ok) { return ''; }
	const S = reg.injury_shiklul;
	const nc = reg.rights_nechut.medical;
	const w = (n) => `${Math.max(0, Math.min(100, Number(n))).toFixed(2)}%`;
	const segs = r.steps.map((s, i) => {
		const u = r.units[i];
		return `<span class="${P}-seg ${P}-seg--${i % 4}" style="inline-size:${w(s.add)}" title="${esc(`${u.label}: ${pctTxt(s.pct)} מתוך ${pctTxt(s.from)} = ${pctTxt(s.add)}`)}">${s.add >= 6 ? `<b>${esc(pctTxt(s.add))}</b>` : ''}</span>`;
	}).join('');
	const r15 = r.r15 && r.r15.added > 0 ? `<span class="${P}-seg ${P}-seg--r15" style="inline-size:${w(r.r15.added)}" title="${esc(`תקנה 15: ועוד ${pctTxt(r.r15.added)}`)}">${r.r15.added >= 6 ? `<b>${esc(`+${pctTxt(r.r15.added)}`)}</b>` : ''}</span>` : '';
	const restPct = Math.max(0, 100 - r.medical - (r.r15 ? r.r15.added : 0));
	const rest = `<span class="${P}-rest" style="inline-size:${w(restPct)}">${restPct >= 14 ? `<b>${esc(`${pctTxt(restPct)} כושר שנותר`)}</b>` : ''}</span>`;
	const ticks = [{ v: S.law.grant_min, he: `${S.law.grant_min}%: מענק` }, { v: S.law.pension_stable_min, he: `${S.law.pension_stable_min}%: קצבה` }, { v: nc.alt_min, he: `${nc.alt_min}%` }, { v: nc.min, he: `${nc.min}%: נכות כללית` }]
		.map((t) => `<span class="${P}-tick${r.degree >= t.v ? ` ${P}-tick--on` : ''}" style="inset-inline-start:${w(t.v)}"><i></i><small>${esc(t.he)}</small></span>`).join('');
	const steps = r.steps.map((s, i) => `<li><span class="${P}-key ${P}-seg--${i % 4}" aria-hidden="true"></span>${esc(r.units[i].label)} <bdi>(${esc(r.units[i].item || 'אחוז חופשי')})</bdi>: ${i === 0 ? `<bdi>${esc(pctTxt(s.pct))}</bdi> במלואו` : `<bdi>${esc(pctTxt(s.pct))}</bdi> מתוך <bdi>${esc(pctTxt(s.from))}</bdi> שנשארו = <bdi>${esc(pctTxt(s.add))}</bdi>`}; נשארו <bdi>${esc(pctTxt(s.rest))}</bdi></li>`).join('')
		+ (r.r15 ? `<li><span class="${P}-key ${P}-seg--r15" aria-hidden="true"></span>${esc(`תקנה 15: ${pctTxt(r.medical)} × ${r.r15.code === 'x' ? `${pctTxt(r.r15.frac * 100)} נוספים` : (S.r15.steps.find((x) => x.code === r.r15.code) || {}).he} = `)}<bdi>${esc(pctTxt(r.r15.raw))}</bdi>${r.r15.capped ? esc(`, עד ${r.r15.limit}%`) : ''}</li>` : '');
	const sum = `${r.steps.map((s, i) => `${r.units[i].label}: ${pctTxt(s.pct)} מתוך ${pctTxt(s.from)} שנשארו, ${pctTxt(s.add)}`).join('; ')}. סך הכול ${pctTxt(r.medical)}${r.r15 ? `, ועם תקנה 15 ${pctTxt(r.r15.value)}` : ''}; נשארו ${pctTxt(restPct)} מהכושר.`;
	return `<figure class="${P}-cap"><figcaption class="${P}-cap__h">הכושר שנשאר: כל פגימה לוקחת את חלקה ממה שנשאר (${esc(S.rules.weighting.section)})</figcaption>`
		+ `<p class="jtool-visually-hidden">${esc(sum)}</p><div class="${P}-barwrap" aria-hidden="true"><div class="${P}-bar">${segs}${r15}${rest}</div><div class="${P}-ticks">${ticks}</div></div>`
		+ `<ol class="${P}-steps">${steps}</ol></figure>`;
}

/** The share link of this tool, for the sibling tools of the cluster: '/regulations-insurance-1956/#s=<state>'. */
export function stateLink(reg, input) {
	return `${PAGE}#s=${stateOf(input)}`;
}

/** The links into the sibling tools with the numbers filled in (numbers and dates only, never a name). The keys are each
 * tool's own (read from the sibling worktrees on 22.10.2026; each tool fills what a link does not carry from its example):
 *  - teunat-drachim (teuna-ui.js KEYS: d disability %, a age, t accident day): the degree by the tests, before reg. 15;
 *  - teunat-avoda (avoda-ui.js KEYS: d the committee's degree before reg. 15, s 'p' stable / 't' temporary, e the reg. 15
 *    increase in % of the degree, m the decision day, x the appeals committee's decision, u the end of a temporary
 *    degree, t injury day, a age);
 *  - kitzbat-nechut (nechut-ui.js KEYS: a age, s status, q 'l' = a list, l the impairments, d the incapacity degree; its
 *    inputOf needs a, s and d): the degree of incapacity is not ours to know, so it opens at "under 50%" for the reader
 *    to set, and only when an age was given. */
export function siblingLinks(reg, r) {
	if (!r.ok) { return { drachim: SIBLINGS.drachim, nechut: SIBLINGS.nechut, avoda: SIBLINGS.avoda }; }
	const age = r.age === null ? '' : r.age;
	const r2 = (n) => Math.round(n * 100) / 100;
	const drachim = r.kind === 'stable' ? `${SIBLINGS.drachim}#s=${encodeState({ d: r.road.pct, a: age, t: r.injury || '' })}` : SIBLINGS.drachim;
	const avoda = `${SIBLINGS.avoda}#s=${encodeState({ d: r2(r.medical), s: r.kind === 'temp' ? 't' : 'p', e: r.r15 ? r2(r.r15.frac * 100) : '', m: r.received || r.decided || '', x: r.appealReceived || '', u: r.kind === 'temp' ? (r.tempTo || '') : '', t: r.injury || '', a: age })}`;
	const genList = r.general.units.map((u) => r2(u.pct));
	const nechut = r.age !== null && genList.length && genList.length <= 6 ? `${SIBLINGS.nechut}#s=${encodeState({ a: r.age, s: 'n', q: 'l', l: genList.join('~'), d: 0 })}` : SIBLINGS.nechut;
	return { drachim, nechut, avoda };
}

/** What the degree means in the three systems that use the same list. */
export function meaningTable(reg, r) {
	if (!r.ok) { return ''; }
	const S = reg.injury_shiklul;
	const L = S.law;
	const nc = reg.rights_nechut.medical;
	const ca = reg.car_accident;
	const links = siblingLinks(reg, r);
	const work = r.outcome === 'none' ? `פחות מ-${L.grant_min}%: אין קצבה ואין מענק`
		: r.outcome === 'grant' ? `מענק של ${L.grant_months} קצבאות חודשיות${r.money.grant !== null ? `: ${nis(r.money.grant)}` : ''}`
			: `${r.outcome === 'temp' ? 'קצבה לתקופה הזמנית' : 'קצבה חודשית'}${r.money.monthly !== null ? `: ${nis(r.money.monthly)} בחודש (${pctTxt(r.degree)} מ-${nis(r.money.full)})` : ` של ${pctTxt(r.degree)} מהקצבה המלאה`}`;
	const workRule = `${r.kind === 'stable' ? `${L.pension_stable_min}% ומעלה קצבה, ${L.grant_min}% עד פחות מ-${L.grant_below}% מענק` : `${L.pension_temp_min}% ומעלה קצבה`}`;
	const gate = r.general.gate === 'min' ? `עובר את סף ${nc.min}%` : r.general.gate === 'alt' ? `עובר את סף ${nc.alt_min}% עם ליקוי אחד של ${nc.single_min}% לפחות` : `מתחת לסף (${nc.min}%, או ${nc.alt_min}% עם ליקוי של ${nc.single_min}%)`;
	const gen = `${pctTxt(r.general.pct)} נכות רפואית: ${gate}${r.general.out.length ? `; לא נספרו: ${r.general.out.map((x) => x.item).join(', ')}` : ''}`;
	const road = r.kind !== 'stable' ? 'בתאונת דרכים נספרת נכות לצמיתות בלבד (תקנה 2(א)(2))'
		: `${pctTxt(r.road.pct)} לפי המבחנים: ${pctTxt(r.road.share)} מהסכום המקסימלי לכאב וסבל${r.road.ageCut ? ` (אחרי הפחתה של ${r.road.ageCut}% בגלל הגיל)` : r.age === null ? ' (לפני הפחתת הגיל: להזין גיל)' : ''}`;
	const rows = [
		{ who: 'נפגעי עבודה (הביטוח הלאומי)', what: work, rule: `${esc(workRule)}${cite(`${L.pension_section}, ${L.grant_section}`, L.url)}`, href: links.avoda, go: 'לכלי תאונת העבודה עם הדרגה הזאת' },
		{ who: 'נכות כללית', what: gen, rule: `${esc(S.general.rounding_he)}; בלי תקנה 15${cite(S.general.rounding_section, S.general.url)}${cite(nc.section, reg.rights_nechut.law_url)}`, href: links.nechut, go: links.nechut.includes('#s=') ? 'לבדיקת קצבה עם האחוזים האלה (את דרגת אי-הכושר בוחרים שם)' : 'לכלי קצבת הנכות הכללית' },
		{ who: 'תאונת דרכים', what: road, rule: `${esc(S.road.tests_he)}${cite(S.road.tests_section, ca.regs_url)}${cite(S.road.binding_section, ca.law_url)}`, href: links.drachim, go: links.drachim.includes('#s=') ? 'לחישוב הפיצוי עם הנכות הזאת' : 'לכלי הפיצויים בתאונת דרכים' },
	];
	return `<div class="jtool-scroll ${P}-meaning" role="region" aria-labelledby="${P}-mean-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">איפה</th><th scope="col">מה הדרגה אומרת</th><th scope="col">הכלל</th><th scope="col">הצעד הבא</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="איפה"><strong>${esc(x.who)}</strong></td><td data-th="מה הדרגה אומרת">${esc(x.what)}</td><td data-th="הכלל">${x.rule}</td><td data-th="הצעד הבא"><a href="${esc(x.href)}" data-sk-sibling>${esc(x.go)}</a></td></tr>`).join('')
		+ '</tbody><caption>אותה רשימת ליקויים, שלוש מערכות: כל אחת עם הוועדה, הכללים והתקרות שלה. הכלי מחשב לפי הכללים; את הקביעה עושה הוועדה או בית המשפט.</caption></table></div>';
}

/** The scenario for the simulation: computed facts only, never a name, an ID or an address. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const S = reg.injury_shiklul;
	const parts = r.units.map((u) => `${u.label} ${pctTxt(u.pct)}`).join(', ');
	const what = outcomeHe[r.outcome];
	return `בתרחיש: פגיעה בעבודה עם ${countHe(r.items.length)} לפי רשימת הליקויים (${parts}). בשקלול לפי ${S.rules.weighting.section} הדרגה היא ${pctTxt(r.medical)}${r.r15 ? `, ועם ${S.r15.section} ${pctTxt(r.r15.value)}` : ''}, ${kindHe(r.kind)}: ${what}. השאלה לתרגול: הוועדה הרפואית. איך מתארים את המגבלות בכל פריט, אילו מסמכים מביאים, ואיך מציגים את ההשפעה על העבודה ועל ההכנסה (${S.r15.cond_section})?`;
}

/** The "what to do now" list: the official route first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const S = reg.injury_shiklul;
	const out = [];
	out.push({ he: `לערור על ההחלטה, אם יש טעם: בכתב, בתוך ${S.appeal.days} ימים מהיום שהיא הגיעה (${S.appeal.section})`, url: S.appeal.url });
	out.push({ he: `לבדוק את החישוב גם במחשבון של המוסד, עם מספרי הסעיפים מהפרוטוקול`, url: S.institute.calculator_url });
	if (r.ok && r.kind === 'stable' && r.degree >= S.rules.income_review.min) { out.push({ he: `ירידה ניכרת בהכנסות אחרי הקביעה: בקשה לפי ${S.rules.income_review.section}, בין ${S.rules.income_review.from_months} ל-${S.rules.income_review.to_months} חודשים מהקביעה`, url: S.r15.page_url }); }
	out.push({ he: `${S.cumulative.form_he} (כשיש פגיעה קודמת בעבודה)`, url: S.cumulative.form_url });
	const links = [];
	links.push({ path: '/committee-work-disability-degree/', he: 'הוועדה הרפואית לנפגעי עבודה: איך מתכוננים' });
	if (r.ok && (r.r15 || (r.kind === 'stable' && r.medical >= 9))) { links.push({ path: '/functional-disability-increase-half/', he: 'תקנה 15: הגדלה של עד מחצית, מתי ואיך' }); }
	if (r.ok && (r.outcome === 'grant' || r.outcome === 'pension')) { links.push({ path: '/grant-versus-pension-work-disability/', he: 'מענק או קצבה: מה ההבדל בפועל' }); }
	links.push({ path: '/representation-medical-committee-lawyer/', he: 'ייצוג בוועדה רפואית ובערר' });
	return { official: out, links: links.slice(0, 4) };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const S = reg.injury_shiklul;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	const state = `<p class="jtool-state jtool-state--ok">✓ לפי ${esc(S.rules.weighting.section)} לתקנות קביעת דרגת נכות</p>`;
	const rows = [`<div><dt>שקלול לפי המבחנים</dt><dd><bdi>${esc(pctTxt(r.medical))}</bdi></dd></div>`];
	if (r.r15) { rows.push(`<div><dt>אחרי תקנה 15</dt><dd><bdi>${esc(pctTxt(r.r15.value))}</bdi></dd></div>`); }
	if (r.rounded) { rows.push(`<div><dt>עיגול כלפי מעלה (תקנה 19א)</dt><dd><bdi>${esc(pctTxt(r.degree))}</bdi></dd></div>`); }
	rows.push(`<div><dt>בנפגעי עבודה</dt><dd>${esc(outcomeHe[r.outcome])}</dd></div>`);
	if (r.money.monthly !== null && r.outcome !== 'none') { rows.push(`<div><dt>${r.outcome === 'grant' ? 'המענק' : 'הקצבה לחודש'}</dt><dd><span class="jtool-amt"><bdi>${money(r.outcome === 'grant' ? r.money.grant : r.money.monthly, 2)}</bdi> ₪</span></dd></div>`); }
	const flags = r.flags;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}דרגת נכות משוקללת, ${esc(kindHe(r.kind))}</p>`
		+ `<strong class="jtool-verdict__figure"><bdi>${esc(pctTxt(r.degree))}</bdi></strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ capacityBar(reg, r)
		+ `<div class="${P}-mean"><h4 id="${P}-mean-h">מה הדרגה אומרת: נפגעי עבודה, נכות כללית, תאונת דרכים</h4>${meaningTable(reg, r)}</div>`
		+ (flags.length ? `<ul class="jtool-flags ${P}-flags">${flags.map((f) => `<li class="${P}-flag ${P}-flag--${f.level}">${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${SK_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את הוועדה הרפואית עם הנתונים שלכם</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

function methodList(reg, r) {
	const S = reg.injury_shiklul;
	const L = S.law;
	const items = [];
	r.items.forEach((it) => {
		const src = it.code === 'hear' ? `הלוח של פרט ${it.item}: ${it.table.a} ו-${it.table.b} דציבל` : it.code === 'see' ? `הלוח של פרט ${it.item}: ${S.tables.vision.labels[it.table.a]} ו-${S.tables.vision.labels[it.table.b]}` : it.def ? `פרט ${it.item}${it.def.r !== undefined ? ` (עמודת ${(it.side === 'l') !== r.lefty ? 'שמאל' : 'ימין'})` : ''}` : 'אחוז חופשי';
		items.push(`${it.label}: ${src} = ${pctTxt(it.base)}${it.prev ? `, פחות מצב קודם ${pctTxt(it.prev)} = ${pctTxt(it.net)} (${L.previous_section})` : ''}`);
	});
	r.units.filter((u) => u.kind === 'joint' && u.members.length > 1).forEach((u) => items.push(`${u.label}: ${u.members.map((m) => pctTxt(m.net)).join(' ו-')} בשקלול = ${pctTxt(u.raw)}${u.capped ? `, עד התקרה ${u.cap}%` : ''} (${S.rules.joint_cap.section})`));
	if (r.units.length > 1) { items.push(`שקלול (${S.rules.weighting.section}): ${weightingText(reg, r)}`); }
	if (r.r15) { items.push(`${S.r15.section}: ${pctTxt(r.medical)} ועוד ${pctTxt(r.r15.frac * 100)} = ${pctTxt(r.r15.raw)}${r.r15.capped ? `, עד ${r.r15.limit}%` : ''}`); }
	if (r.rounded) { items.push(`${S.rules.rounding.section}: ${pctTxt(r.degreeRaw)} מזכה בקצבה ומעוגל ל-${pctTxt(r.degree)}`); }
	items.push(`${kindHe(r.kind)} של ${pctTxt(r.degree)}: ${outcomeHe[r.outcome]} (${L.pension_section}, ${L.grant_section})`);
	if (r.money.full !== null) { items.push(`הקצבה המלאה: ${nis(r.money.daily)} × ${L.full_days} = ${nis(r.money.full)} (${L.full_section}); ${pctTxt(r.degree)} ממנה = ${nis(r.money.monthly)} (${L.partial_section})${r.money.grant !== null ? `; מענק: ${nis(r.money.monthly)} × ${L.grant_months} = ${nis(r.money.grant)} (${L.grant_calc_section})` : ''}`); }
	items.push(`נכות כללית (תקנות 1984): ${r.general.steps.length ? r.general.steps.map((s) => pctTxt(s.pct)).join(', ') : 'אין פריטים שנספרים'} = ${pctTxt(r.general.raw)}, מעוגל ל-${pctTxt(r.general.pct)} (${S.general.rounding_section})`);
	if (r.kind === 'stable') { items.push(`תאונת דרכים: ${pctTxt(r.road.pct)} × 1% = ${pctTxt(r.road.raw)} מהסכום המקסימלי${r.road.ageCut ? `, פחות ${r.road.ageCut}% בגלל הגיל = ${pctTxt(r.road.share)}` : ''} (תקנות 2(א)(2) ו-3 לתקנות 1976)`); }
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

function datesTable(reg, r, opts = {}) {
	if (!r.events.length) { return `<p class="jtool-hint">${esc('אין מועדים: מזינים את יום החלטת הוועדה ואת היום שבו היא הגיעה (בחלק "לתוצאה מלאה"), והכלי מוסיף את מועד הערר ואת החלונות לקביעה מחדש.')}</p>`; }
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = opts.today && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.he)}</td><td data-th="הכלל">${cite(e.section, e.url)}</td></tr>`; }).join('')
		+ `<caption>${esc(`רק מועדים שהתקנות או המוסד קובעים. מועד אחרון שנופל ביום מנוחה עובר ליום שאחריו (${reg.car_accident.limitation.interpretation_he}).`)}</caption></table></div>`;
}

/** The page table: the common items of the schedule with their numbers and %, and the general-disability exclusions. */
export function itemsTable(reg, r) {
	const S = reg.injury_shiklul;
	const mine = new Set(r && r.ok ? r.items.map((it) => it.code) : []);
	const rows = S.items.map((x) => {
		const v = x.pct !== undefined ? `${x.pct}%` : (x.r === x.l ? `${x.r}% (ימין ושמאל)` : `ימין ${x.r}%, שמאל ${x.l}%`);
		return `<tr${mine.has(x.id) ? ` class="${P}-mine"` : ''}><td data-th="פרט"><bdi>${esc(x.item)}</bdi></td><td data-th="הליקוי">${esc(x.he)}${mine.has(x.id) ? ' <strong>(אצלכם)</strong>' : ''}</td><td data-th="אחוז"><bdi>${esc(v)}</bdi></td><td data-th="תחום">${esc(S.areas[x.area])}</td><td data-th="בנכות כללית">${x.general_out ? 'לא נספר' : 'נספר'}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable ${P}-items-t"><caption>${esc(`ליקויים נפוצים מהתוספת ל${S.regs.he} (חלק א'), מספר הפרט והאחוז כפי שהם מודפסים, נוסח עדכני (${S.regs.last_amend_he}). "לא נספר": הפרט לא נכלל ברשימת הליקויים של תקנות הנכות הכללית (התוספת לתקנות 1984). הרשימה המלאה בתקנות עצמן.`)}</caption><thead><tr><th scope="col">פרט</th><th scope="col">הליקוי</th><th scope="col">אחוז</th><th scope="col">תחום</th><th scope="col">בנכות כללית</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** The two-dimensional tables of the schedule (sight 52(1), hearing 72(1)), with the reader's cell marked. */
export function lookupTables(reg, r) {
	const S = reg.injury_shiklul;
	const hear = r && r.ok ? r.items.find((it) => it.code === 'hear') : null;
	const see = r && r.ok ? r.items.find((it) => it.code === 'see') : null;
	const V = S.tables.vision;
	const H = S.tables.hearing;
	const band = (b) => (b[1] === null ? `מעל ${b[0] - 1}` : `${b[0]}-${b[1]}`);
	const vt = `<table class="jtool-datatable ${P}-grid"><caption>${esc(`פרט ${V.item}: ${V.he}. שורה: עין אחת; עמודה: העין השנייה.`)}</caption><thead><tr><th scope="col">עין / עין</th>${V.labels.map((l) => `<th scope="col"><bdi>${esc(l)}</bdi></th>`).join('')}</tr></thead><tbody>`
		+ V.grid.map((row, i) => `<tr><th scope="row"><bdi>${esc(V.labels[i])}</bdi></th>${row.map((c, j) => `<td${see && see.table.row === i && see.table.col === j ? ` class="${P}-hit"` : ''}><bdi>${c}</bdi></td>`).join('')}</tr>`).join('') + '</tbody></table>';
	const ht = `<table class="jtool-datatable ${P}-grid"><caption>${esc(`פרט ${H.item}: ${H.he}, בדציבלים (${H.freq_he}). שורה: אוזן אחת; עמודה: האוזן השנייה.`)}</caption><thead><tr><th scope="col">אוזן / אוזן</th>${H.bands.map((b) => `<th scope="col"><bdi>${esc(band(b))}</bdi></th>`).join('')}</tr></thead><tbody>`
		+ H.grid.map((row, i) => `<tr><th scope="row"><bdi>${esc(band(H.bands[i]))}</bdi></th>${row.map((c, j) => `<td${hear && hear.table.row === i && hear.table.col === j ? ` class="${P}-hit"` : ''}><bdi>${c}</bdi></td>`).join('')}</tr>`).join('') + '</tbody></table>';
	return `<div class="jtool-datawrap">${vt}</div><div class="jtool-datawrap">${ht}</div>`;
}

/** What changed and when: only values an official text dates. */
export function changesTable(reg) {
	const S = reg.injury_shiklul;
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ S.changes.map((x) => `<tr><td data-th="מתי"><bdi>${esc(isoToHe(x.date))}</bdi></td><td data-th="מה השתנה">${esc(x.he)}</td><td data-th="מקור">${cite(x.src, x.url)}</td></tr>`).join('')
		+ '</tbody><caption>רק שינויים שפורסמו בנוסח רשמי, עם התאריך שלהם.</caption></table></div>';
}

/** The other rules of the regulations, in words with their numbers. */
function rulesList(reg) {
	const S = reg.injury_shiklul;
	const R = S.rules;
	const L = S.law;
	const li = (he, sec, url) => `<li>${esc(he)}.${cite(sec, url)}</li>`;
	return `<ul class="${P}-list">${li(R.item.he, R.item.section, S.regs.url)}${li(R.joint_cap.he, R.joint_cap.section, S.regs.url)}${li(R.limb_cap.he, R.limb_cap.section, S.regs.url)}${li(R.eye_cap.he, R.eye_cap.section, S.regs.url)}`
		+ `${li(R.muscles.he, R.muscles.section, S.regs.url)}${li(R.nerve.he, R.nerve.section, S.regs.url)}${li(R.lefty.he, R.lefty.section, S.regs.url)}${li(R.similar.he, R.similar.section, S.regs.url)}`
		+ `${li(R.paired.he, R.paired.section, S.regs.url)}${li(S.r15.cond_he, S.r15.cond_section, S.regs.url)}${li(S.r15.only_he, S.r15.only_section, S.regs.url)}${li(S.r15.circular_he, 'חוזר המוסד', S.r15.circular_url)}`
		+ `${li(R.special100.he, R.special100.section, S.regs.url)}${li(R.income_review.he, R.income_review.section, S.regs.url)}${li(R.improve.he, R.improve.section, S.regs.url)}${li(R.needy.he, R.needy.section, S.regs.url)}`
		+ `${li(R.rounding.he, R.rounding.section, S.regs.url)}${li(R.start.he, R.start.section, S.regs.url)}${li(R.aggravation.he, R.aggravation.section, S.regs.url)}${li(R.aggravation_from.he, R.aggravation_from.section, S.regs.url)}`
		+ `${li(S.cumulative.he, `${S.cumulative.section}; ${S.cumulative.law_section} לחוק`, S.regs.url)}${li(L.previous_he, L.previous_section, L.url)}${li(L.unstable_he, L.unstable_section, L.url)}`
		+ `${li(S.appeal.powers_he, S.appeal.powers_section, S.regs.url)}${li(S.appeal.withdraw_he, 'חוברת המוסד', S.institute.booklet_url)}${li(L.court_he, L.court_section, L.url)}${li(L.binding_he, L.binding_section, L.url)}${li(S.road.binding_he, `${S.road.binding_section} לחוק הפיצויים`, reg.car_accident.law_url)}</ul>`;
}

/** The one-page print: inputs, result, the computation path, the dates, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const S = reg.injury_shiklul;
	return '<h3>דרגת נכות משוקללת: סיכום</h3>'
		+ `<p><strong>הנתונים:</strong> ${esc(kindHe(r.kind))}; ${esc(r.items.map((it) => `${it.label} (${it.item || 'אחוז חופשי'}) ${pctTxt(it.net)}`).join('; '))}${r.lefty ? '; איטר יד ימין' : ''}${r.r15 ? `; ${esc(S.r15.section)}` : ''}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p>${methodList(reg, r)}`
		+ (r.events.length ? `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.he)}`).join('; ')}.</p>` : '')
		+ `<p><strong>מקורות:</strong> ${esc(S.regs.he)}, נוסח עדכני (${esc(S.regs.last_amend_he)}); ${esc(S.law.he)}; ${esc(S.general.he)}; ${esc(reg.car_accident.regs_he)}; המוסד לביטוח לאומי: חוזר תקנה 15 (${isoToHe(S.r15.circular_from)}) ודפי הערר. נבדק ${isoToHe(S.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי; את הדרגה קובעת הוועדה הרפואית.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const S = reg.injury_shiklul;
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חושב, צעד אחר צעד</h3></div>${methodList(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics"${r.events.length ? '' : ' disabled'}>הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${datesTable(reg, r, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-it-h">ליקויים נפוצים: מספר הפרט והאחוז</h3></div>${itemsTable(reg, r)}</div>`
		+ `<details class="jtool-more ${P}-tables"><summary>לוח הראייה (${esc(S.tables.vision.item)}) ולוח השמיעה (${esc(S.tables.hearing.item)})</summary>${lookupTables(reg, r)}</details>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-r-h">מה עוד התקנות והחוק קובעים</h3></div>${rulesList(reg)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || S.checked_on)}</div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): the degree of the example (or of the reader once
 * they change anything), what it means and the weighting in one line, and a jump to the form. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הפרוטוקול שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">שקלול אחוזי נכות</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const S = reg.injury_shiklul;
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}שקלול ${countHe(r.items.length)}${r.units.length > 1 ? ` (${r.units.map((u) => pctTxt(u.pct)).join(' ו-')})` : ''}, ${kindHe(r.kind)}`;
	const unit = `דרגה משוקללת · ${outcomeHe[r.outcome]}`;
	const cash = r.money.monthly !== null && r.outcome !== 'none' ? ` דמי פגיעה ${nis(r.money.daily)} ליום: ${r.outcome === 'grant' ? `מענק ${nis(r.money.grant)}` : `${nis(r.money.monthly)} בחודש`}.` : '';
	const line = `${r.units.length > 1 ? `${weightingText(reg, r)} (${S.rules.weighting.section}).` : `לפי ${S.rules.item.section}.`}${r.r15 ? ` עם ${S.r15.section}: ${pctTxt(r.r15.value)}.` : ''}${cash}`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure"><bdi>${esc(pctTxt(r.degree))}</bdi></strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const r = skCompute(reg, EXAMPLE);
	const S = reg.injury_shiklul;
	const s1 = r.steps[0];
	const s2 = r.steps[1];
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.degree,
		sticky: `<bdi>${pctTxt(r.degree)}</bdi>`,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>שני ליקויים מהרשימה: ${esc(r.units[0].label)} ${pctTxt(s1.pct)} (פרט ${esc(r.units[0].item)}) ו${esc(r.units[1].label)} ${pctTxt(s2.pct)} (פרט ${esc(r.units[1].item)})${cite(S.rules.item.section, S.regs.url)}</li>`
			+ `<li>הגבוה במלואו, ${pctTxt(s1.add)}; השני מתוך ${pctTxt(s2.from)} שנשארו: ${pctTxt(s2.add)}; סך הכול ${pctTxt(r.medical)}${cite(S.rules.weighting.section, S.regs.url)}${cite('דוגמת המוסד', S.institute.permanent_url)}</li>`
			+ `<li>דרגה יציבה של ${pctTxt(r.degree)}: ${S.law.pension_stable_min}% ומעלה, קצבה חודשית${cite(S.law.pension_section, S.law.url)}</li>`
			+ `<li>דמי פגיעה ${nis(r.money.daily)} ליום: קצבה מלאה ${nis(r.money.full)}, ו-${pctTxt(r.degree)} ממנה ${nis(r.money.monthly)} בחודש${cite(`${S.law.full_section}, ${S.law.partial_section}`, S.law.url)}</li>`
			+ `<li>ערר בתוך ${S.appeal.days} ימים מהיום שההחלטה הגיעה: עד ${isoToHe((r.events.find((e) => e.key === 'appeal') || {}).date || '')}${cite(S.appeal.section, S.appeal.url)}</li></ol>`,
		compare_table: itemsTable(reg, null),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

export const KEYS = ['k', 'i', 'l', 'r', 'x', 'a', 'd', 'c', 'v', 'p', 'e', 'j'];
const R15C = { q: 'q', t: 't', h: 'h', x: 'x' };
const cell = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? '' : String(v));
export function stateOf(i) {
	const items = (i.items || []).map(skRow).filter((it) => it.code || cell(it.pct) !== '').slice(0, SK_MAX_ITEMS)
		.map((it) => [it.code || 'f', it.code ? '' : cell(it.pct), it.side === 'l' ? 'l' : 'r', cell(it.prev), cell(it.a), cell(it.b)]);
	return encodeState({
		k: i.kind === 'temp' ? 't' : 's', i: items, l: i.lefty ? 1 : '', r: R15C[i.r15] || '', x: i.r15 === 'x' ? cell(i.r15pct) : '',
		a: cell(i.age), d: cell(i.daily), c: i.decided || '', v: i.received || '', p: i.appealReceived || '', e: i.kind === 'temp' ? (i.tempTo || '') : '', j: i.injury || '',
	});
}
export function inputOf(s) {
	if (!s || !s.i) { return null; }
	const num = (v) => (v === undefined || v === '' ? '' : Number(v));
	const items = String(s.i).split('~').map((x) => x.split('_')).filter((x) => x.length === 6).slice(0, SK_MAX_ITEMS)
		.map(([code, pct, side, prev, a, b]) => skRow({ code: code === 'f' ? '' : code, pct: num(pct), side: side === 'l' ? 'l' : 'r', prev: num(prev), a: num(a), b: num(b) }));
	if (!items.length) { return null; }
	return Object.assign({}, SK_BLANK, {
		kind: s.k === 't' ? 'temp' : 'stable', items, lefty: s.l === '1', r15: R15C[s.r] || '', r15pct: s.r === 'x' ? num(s.x) : '',
		age: num(s.a), daily: num(s.d), decided: s.c || '', received: s.v || '', appealReceived: s.p || '', tempTo: s.e || '', injury: s.j || '',
	});
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value ?? d;
	const amt = (id) => { const v = String(val(id)).replace(/[,\s₪%]/g, ''); return v === '' ? '' : Number(v); };
	const items = [...root.querySelectorAll(`.${P}-row`)].map((li) => {
		const i = li.getAttribute('data-row');
		const sel = val(`c${i}`);
		const code = sel === 'free' ? '' : sel;
		return skRow({ code, pct: code ? '' : amt(`p${i}`), side: val(`s${i}`) === 'l' ? 'l' : 'r', prev: amt(`v${i}`), a: code === 'hear' ? amt(`ha${i}`) : code === 'see' ? amt(`va${i}`) : '', b: code === 'hear' ? amt(`hb${i}`) : code === 'see' ? amt(`vb${i}`) : '' });
	});
	return {
		items, lefty: Boolean(root.querySelector(`input[name="${P}-lefty"]:checked`)), kind: pick('kind', 'stable') === 'temp' ? 'temp' : 'stable',
		r15: pick('r15', ''), r15pct: amt('r15p'), age: amt('age'), daily: amt('daily'), decided: skIso(val('dec')), received: skIso(val('rec')),
		appealReceived: skIso(val('apr')), tempTo: skIso(val('tto')), injury: skIso(val('inj')),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const S = reg.injury_shiklul;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(S.checked_on, S.refresh_every_days) || (S.next_update && today >= S.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהתקנות התעדכנו'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const m = /^item(\d+)$/.exec(e.field);
			const f = m ? root.querySelector(`#${P}-c${m[1]}`) : root.querySelector(`#${P}-${{ age: 'age', daily: 'daily', decided: 'dec', received: 'rec', appealReceived: 'apr', tempTo: 'tto', injury: 'inj', r15: 'r15p' }[e.field] || ''}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const run = (input, opts = {}) => {
		const r = skCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? `<bdi>${pctTxt(r.degree)}</bdi>` : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: skBand(r) }); }
		return r;
	};
	// A structural change (an item chosen, the kind, reg. 15) redraws the form; focus stays on the same field.
	const redraw = (input, focusId) => {
		form.innerHTML = renderForm(reg, input);
		if (focusId) { const f = form.querySelector(`#${focusId}`); if (f) { f.focus({ preventScroll: true }); } }
	};
	const schedule = (ev) => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		const t = ev && ev.target;
		const structural = ev && ev.type === 'change' && t && (t.hasAttribute('data-sk-code') || t.name === `${P}-kind` || t.name === `${P}-r15`);
		clearTimeout(timer);
		if (structural) {
			const input = readForm(root);
			redraw(input, t.id || '');
			if (!t.id) { const back = form.querySelector(`input[name="${t.name}"][value="${t.value}"]`); if (back) { back.focus({ preventScroll: true }); } }
			run(input);
			return;
		}
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	// A share link names its tool (/@shiklul-nechut); on a page with several tools only this tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (fromHash) {
		own = true;
		redraw(fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
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
			const first = form.querySelector(`.${P}-preset, select`);
			if (first) { setTimeout(() => first.focus({ preventScroll: true }), 350); }
			track('tool_lead_click', { tool_id: TOOL_ID });
		});
	}
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) {
			if (ev.target.closest('[data-sk-sibling]')) { track('tool_sibling_click', { tool_id: TOOL_ID }); }
			return;
		}
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'preset' || act === 'add' || act === 'remove') {
			own = true;
			const cur = readForm(root);
			let input = cur;
			let focus = '';
			if (act === 'preset') {
				input = skPreset(b.getAttribute('data-preset'), { age: cur.age, daily: cur.daily, decided: cur.decided, received: cur.received, appealReceived: cur.appealReceived, tempTo: cur.tempTo, injury: cur.injury });
				if (!input) { return; }
				track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			} else if (act === 'add') {
				input = Object.assign({}, cur, { items: cur.items.concat([skRow()]).slice(0, SK_MAX_ITEMS) });
				focus = `${P}-c${input.items.length - 1}`;
			} else {
				const n = Number(b.getAttribute('data-row'));
				input = Object.assign({}, cur, { items: cur.items.filter((x, j) => j !== n) });
				focus = `${P}-c${Math.max(0, n - 1)}`;
			}
			redraw(input, focus);
			run(input);
			return;
		}
		const input = own ? readForm(root) : EXAMPLE;
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok && r.events.length) {
			download('shiklul-nechut.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `דרגת נכות: ${e.he}`, description: `${e.section}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק אחוזים, מספרי סעיפים ותאריכים: אין שמות ואין תעודת זהות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי תקנות קביעת דרגת נכות ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(S.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: skBand(r) });
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
			if (s) { own = true; redraw(s); run(s); }
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
