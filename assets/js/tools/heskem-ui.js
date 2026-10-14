/**
 * Family wave UI: the divorce agreement and parenting plan generator (HAD-506).
 * One picture from the subject: the two-week calendar of nights, the way parents actually plan it, with the holidays of
 * the coming Hebrew year under it. The child-support clause is computed by the child-support engine with the plan's
 * nights, and the property clause by the balancing engine; the draft says which numbers came from where.
 */
import { draftAgreement } from './heskem-engine.js';
import { HR_PATTERNS, HR_DAYS } from './horut-engine.js';
import { parseDate } from './dates.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState,
	track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'heskem-gerushin';
const P = 'jt19';
export const EXAMPLE = {
	route: 'family', parentA: 'אבא', children: ['2018-05-01', '2021-09-15'], custody: 'joint', pattern: 'weekends_2mid', custom: [],
	holidays: 'alternate', firstA: true, law: 'jewish',
	support: { incomeA: 15000, incomeB: 9000, housingA: 4000, housingB: 5500, amount: '', payDay: 10 },
	property: { home: 'b_keeps', homeValue: 2500000, mortgage: 800000, aAssets: 300000, bAssets: 150000, aDebts: 20000, bDebts: '', pension: true },
	names: { a: '', b: '' },
};
export const EXAMPLE_HORUT = Object.assign({}, EXAMPLE, { onlyPlan: true, pattern: 'two_two_five', holidays: 'split' });
const HOME = { none: 'אין דירה משותפת', sell: 'מוכרים ומחלקים', a_keeps: "הורה א' נשאר/ת בדירה", b_keeps: "הורה ב' נשאר/ת בדירה" };
const CUSTODY = { joint: 'משמורת משותפת', mother: 'אצל האם, זמני שהות עם האב', father: 'אצל האב, זמני שהות עם האם' };

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const v0 = (x) => (x === '' || x === undefined || x === null ? '' : x);
const nis = (n) => `${money(n, Math.round(n) === n ? 0 : 2)} ₪`;
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const docName = (p) => (p === 'אבא' ? 'האב' : 'האם');

function moneyField(id, label, v) {
	return `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v0(v) === '' ? '' : money(v, 0))}" placeholder="0" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}

/** The two-week calendar. In custom mode every night is a button that switches the parent. */
export function calendar(m, nights) {
	const pa = docName(m.parentA);
	const pb = docName(m.parentA === 'אבא' ? 'אמא' : 'אבא');
	const custom = m.pattern === 'custom';
	const cell = (x, i) => {
		const who = x === 'A' ? pa : pb;
		const label = `${HR_DAYS[i % 7]}, שבוע ${i < 7 ? 1 : 2}: ${who}`;
		return custom
			? `<button type="button" class="jt19-night jt19-night--${x.toLowerCase()}" data-night="${i}" aria-pressed="${x === 'A'}" aria-label="${esc(label)}">${esc(who === 'האב' ? 'אב' : 'אם')}</button>`
			: `<span class="jt19-night jt19-night--${x.toLowerCase()}" role="img" aria-label="${esc(label)}">${esc(who === 'האב' ? 'אב' : 'אם')}</span>`;
	};
	return `<div class="jt19-cal" role="group" aria-label="תוכנית שבועיים: איפה הילדים לנים">`
		+ `<div class="jt19-cal__days" aria-hidden="true"><span></span>${HR_DAYS.map((d) => `<span>${esc(d)}</span>`).join('')}</div>`
		+ [0, 1].map((w) => `<div class="jt19-cal__week"><span class="jt19-cal__w">שבוע ${w + 1}</span>${nights.slice(w * 7, w * 7 + 7).map((x, i) => cell(x, w * 7 + i)).join('')}</div>`).join('')
		+ `<p class="jt19-cal__legend"><span><i class="jt19-k jt19-k--a"></i>${esc(pa)}: ${nights.filter((x) => x === 'A').length} לילות</span><span><i class="jt19-k jt19-k--b"></i>${esc(pb)}: ${nights.filter((x) => x === 'B').length} לילות</span></p></div>`;
}

export function renderForm(reg, m) {
	const s = m.support || {};
	const p = m.property || {};
	const only = Boolean(m.onlyPlan);
	const kid = (b, i) => `<li class="jtool-rep__row" data-kid="${i}"><div class="jtool-field"><label class="jtool-label" for="${P}-kid-${i}">ילד/ה ${i + 1}: תאריך לידה</label><input id="${P}-kid-${i}" type="text" inputmode="numeric" autocomplete="off" value="${esc(b ? isoToHe(b) : '')}" placeholder="לדוגמה: 1.6.2017" aria-describedby="${P}-kid-${i}-e"><p class="jtool-error" id="${P}-kid-${i}-e" role="alert"></p></div><button class="jtool-iconbtn" type="button" data-remove-kid="${i}" aria-label="מחיקת ילד/ה ${i + 1}">✕</button></li>`;
	return `<fieldset class="jtool-field"><legend>הורה א' הוא</legend><div class="jtool-chips">${chip('pa', 'אבא', 'אבא', m.parentA !== 'אמא')}${chip('pa', 'אמא', 'אמא', m.parentA === 'אמא')}</div></fieldset>`
		+ `<div class="jtool-field"><span class="jtool-label" id="${P}-kids-l">הילדים</span><ul class="jtool-rep" aria-labelledby="${P}-kids-l" data-kids>${(m.children || []).map(kid).join('')}</ul><button class="jtool-linkbtn" type="button" data-add-kid>+ עוד ילד/ה</button><p class="jtool-error" id="${P}-children-e" role="alert"></p></div>`
		+ `<fieldset class="jtool-field"><legend>משמורת</legend><div class="jtool-chips">${Object.entries(CUSTODY).map(([k, v]) => chip('cu', k, v, m.custody === k)).join('')}</div></fieldset>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-pat">הסדר הלינות בשבועיים</label><select id="${P}-pat">${Object.entries(HR_PATTERNS).map(([k, v]) => `<option value="${k}"${m.pattern === k ? ' selected' : ''}>${esc(v.he)}</option>`).join('')}<option value="custom"${m.pattern === 'custom' ? ' selected' : ''}>אחר: לוחצים על הלילות בלוח</option></select><p class="jtool-hint">${esc(reg.divorce_agreement.schedule_he)}.</p></div>`
		+ `<fieldset class="jtool-field"><legend>חגים וחופש גדול</legend><div class="jtool-chips">${chip('ho', 'alternate', 'חג לכל הורה לסירוגין', m.holidays !== 'split')}${chip('ho', 'split', 'חגים ארוכים חצי-חצי', m.holidays === 'split')}${chip('fa', '1', "בשנה זוגית מתחילים אצל הורה א'", m.firstA !== false, 'checkbox')}</div></fieldset>`
		+ (only ? '' : `<fieldset class="jtool-field"><legend>איפה מאשרים</legend><div class="jtool-chips">${chip('rt', 'family', 'בית המשפט לענייני משפחה', m.route !== 'rabbinical')}${chip('rt', 'rabbinical', 'בית הדין הרבני', m.route === 'rabbinical')}</div></fieldset>`
		+ `<details class="jtool-more" open><summary>מזונות: מהמחשבון של בע"מ 919/15</summary><div class="jtool-row" style="margin-top:8px">${moneyField('ia', "הכנסה נטו, הורה א'", s.incomeA)}${moneyField('ib', "הכנסה נטו, הורה ב'", s.incomeB)}</div>`
		+ `<div class="jtool-row">${moneyField('ha', "דיור, הורה א'", s.housingA)}${moneyField('hb', "דיור, הורה ב'", s.housingB)}</div>`
		+ `<div class="jtool-row">${moneyField('am', 'סכום שסיכמתם (לא חובה)', s.amount)}<div></div></div><p class="jtool-hint">בלי סכום, ההסכם יכלול את אמצע הטווח של המחשבון, לפי הלילות שבלוח. עם סכום, לא צריך את ההכנסות.</p>`
		+ `<fieldset class="jtool-field"><legend>מי משלם את הסכום שסיכמתם</legend><div class="jtool-chips">${chip('sp', '', 'לפי החישוב', !s.payer)}${chip('sp', 'A', "הורה א'", s.payer === 'A')}${chip('sp', 'B', "הורה ב'", s.payer === 'B')}</div></fieldset></details>`
		+ `<details class="jtool-more" open><summary>רכוש: מהמחשבון של איזון המשאבים</summary><fieldset class="jtool-field" style="margin-top:8px"><legend>הדירה המשותפת</legend><div class="jtool-chips">${Object.entries(HOME).map(([k, v]) => chip('hm', k, v, (p.home || 'none') === k)).join('')}</div></fieldset>`
		+ `<div class="jtool-row">${moneyField('hv', 'שווי הדירה', p.homeValue)}${moneyField('mo', 'יתרת המשכנתא', p.mortgage)}</div>`
		+ `<div class="jtool-row">${moneyField('aa', "שאר הנכסים לאיזון, הורה א'", p.aAssets)}${moneyField('ba', "שאר הנכסים לאיזון, הורה ב'", p.bAssets)}</div>`
		+ `<div class="jtool-row">${moneyField('ad', "חובות, הורה א'", p.aDebts)}${moneyField('bd', "חובות, הורה ב'", p.bDebts)}</div>`
		+ `<div class="jtool-chips">${chip('pe', '1', 'לחלק את הפנסיה דרך הקופות', p.pension, 'checkbox')}</div></details>`)
		+ `<details class="jtool-more"><summary>שמות, לטיוטה (לא חובה)</summary><div class="jtool-row" style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${P}-na">שם הורה א'</label><input id="${P}-na" type="text" autocomplete="off" value="${esc((m.names && m.names.a) || '')}"></div><div class="jtool-field"><label class="jtool-label" for="${P}-nb">שם הורה ב'</label><input id="${P}-nb" type="text" autocomplete="off" value="${esc((m.names && m.names.b) || '')}"></div></div><p class="jtool-hint">השמות נכנסים רק לטקסט שאתם מעתיקים, לא לקישור השיתוף.</p></details>`;
}

function holidaysTable(m, d) {
	const pa = docName(m.parentA);
	const pb = docName(m.parentA === 'אבא' ? 'אמא' : 'אבא');
	const who = (x) => (x === 'A' ? pa : pb);
	return d.plan.years.map((y) => `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3>חגים, שנת ${esc(String(y[0] ? y[0].hebrewYear : ''))}</h3></div><div class="jtool-scroll" role="region" aria-label="החגים" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">החג</th><th scope="col">מתי</th><th scope="col">אצל מי</th></tr></thead><tbody>`
		+ y.map((h) => `<tr><td data-th="החג">${esc(h.he)}</td><td data-th="מתי">${h.start ? `<bdi>${isoToHe(h.start)}</bdi> עד <bdi>${isoToHe(h.end)}</bdi>` : '—'}</td><td data-th="אצל מי">${h.halves ? `${esc(who(h.halves[0].who))} עד <bdi>${isoToHe(h.halves[0].to)}</bdi>, אחר כך ${esc(who(h.halves[1].who))}` : esc(who(h.who))}</td></tr>`).join('')
		+ `</tbody></table></div></div>`).join('');
}

export function verdictSentence(reg, d) {
	if (!d.ok) { return ''; }
	const parts = d.kids ? [`טיוטת ${d.title}: ${d.clauses.length} פרקים ונספח תוכנית הורות`, `${d.plan.nightsA} לילות מתוך 14 אצל ${docName(d.parentA)}`] : [`טיוטת ${d.title}: ${d.clauses.length} פרקים, בלי ילדים`];
	if (d.amount !== null && d.payer) { parts.push(`מזונות ${nis(d.amount)} לחודש`); }
	if (d.buyout && d.buyout.amount > 0) { parts.push(`רכישת החלק בדירה ${nis(d.buyout.amount)}`); }
	if (d.balance && d.balance.ok) { parts.push(d.balance.payer ? `תשלום איזון ${nis(d.balance.pay)}` : 'בלי תשלום איזון'); }
	return `${parts.join('; ')}. ההסכם טעון אישור${d.only ? ' בית המשפט' : ` ${d.route === 'rabbinical' ? 'בית הדין הרבני' : 'בית המשפט לענייני משפחה'}`}, שבודק שההסדרים לילדים לטובתם.`;
}

export function renderResult(reg, m, d, opts = {}) {
	if (!d.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן</p><p class="jtool-verdict__sentence">${d.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const noKids = !d.only && !d.kids;
	const bal = d.balance && d.balance.ok ? (d.balance.payer ? ils(d.balance.pay, 0) : 'בלי תשלום') : 'לבדוק';
	const figure = d.only ? `<bdi>${d.plan.nightsA}</bdi> / <bdi>14</bdi>` : noKids ? bal : d.amount !== null && d.payer ? ils(d.amount, 0) : 'לבדוק';
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ ${d.only ? 'תוכנית הורות לפי סעיף 24 לחוק הכשרות' : noKids ? 'הסכם גירושין: הגט והרכוש' : 'הסכם מלא: ילדים, מזונות ורכוש'}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה: ' : ''}${d.only ? `לילות אצל ${esc(docName(d.parentA))}` : noKids ? 'תשלום האיזון בטיוטה' : 'המזונות בטיוטה, לחודש'}</p>`
		+ `<strong class="jtool-verdict__figure">${figure}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, d))}</p>`
		+ (!d.only && d.support && d.support.ok && d.support.payer ? `<p class="jtool-scope">הטווח לפי מחשבון המזונות עם הלילות שבלוח: ${esc(nis(d.support.low))} עד ${esc(nis(d.support.high))}.</p>` : '')
		+ `<div class="jtool-actions" style="margin-top:12px"><button class="jtool-btn jtool-btn--primary" type="button" data-act="copydoc">העתקת הטיוטה המלאה</button></div></div>`
		+ (d.kids ? calendar(m, d.plan.nights) : '')
		+ `<ul class="jtool-flags">${d.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>`;
}

export function renderDetails(reg, m, d) {
	if (!d.ok) { return ''; }
	const da = reg.divorce_agreement;
	const r = da.routes[d.route];
	return (d.kids ? holidaysTable(m, d) : '')
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-doc-h">הטיוטה</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copydoc">העתקה</button><button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button></div></div><pre class="jtool-letter jt18-doc" role="region" aria-labelledby="${P}-doc-h" tabindex="0">${esc(d.text)}</pre></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3>האישור: ${esc(r.he)}</h3></div><ol class="jtool-steps">${d.steps.map((s) => `<li>${esc(s)}</li>`).join('')}<li>אגרה: ${esc(nis(r.fee))}${cite(r.fee_item, r.fee_url)}; ${esc(da.no_request_he)}.${cite('סעיף 2', da.disputes_url)}</li></ol></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3>מה לבדוק עם עורך דין לפני החתימה</h3></div><ul class="jtool-notes">${d.lawyer.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>`;
}

/** Page section: the common schedules side by side, with their nights. */
export function compareTable() {
	const rows = Object.entries(HR_PATTERNS).map(([k, v]) => `<tr><td data-th="ההסדר">${esc(v.he)}</td><td data-th="לילות אצל ההורה השני"><bdi>${v.a.length}</bdi> מתוך 14</td><td data-th="מי מתאים">${esc({ weekends: 'ילדים קטנים, או מרחק גדול בין הבתים', weekends_mid: 'ההסדר הנפוץ כשהילדים גרים בעיקר אצל הורה אחד', weekends_2mid: 'קשר רציף עם שני ההורים בלי לעבור בית בכל יום', two_two_five: 'חלוקה שווה עם מעט מעברים; בתי ספר קרובים', three_four: 'חלוקה שווה עם ימים קבועים לכל הורה', week_week: 'ילדים גדולים; מעבר אחד בשבוע' }[k])}</td></tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הסדרי לינה נפוצים בשבועיים (תבניות; בית המשפט מאשר לפי טובת הילד)</caption><thead><tr><th scope="col">ההסדר</th><th scope="col">לילות אצל ההורה השני</th><th scope="col">מי מתאים</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: how a divorce agreement gets its force, each line with its source (the "numbers" part). */
export function numbersTable(reg) {
	const da = reg.divorce_agreement;
	const c919 = da.cases.find((x) => x.key === '919_15') || { url: da.maint_law.url };
	const rows = [
		['אישור בבית המשפט לענייני משפחה', `אגרה ${money(da.routes.family.fee, 0)} ש"ח; טופס 3 (הרצאת פרטים) ועותק אחד`, cite(da.routes.family.fee_item, da.routes.family.fee_url)],
		['אישור בבית הדין הרבני', `אגרה ${money(da.routes.rabbinical.fee, 0)} ש"ח; דיון בנוכחות שניכם, ואז סידור הגט`, cite(da.routes.rabbinical.fee_item, da.routes.rabbinical.fee_url)],
		['בקשה ליישוב סכסוך', 'לא צריך לפני אישור הסכם: בקשה לאישור הסכם אינה תובענה', cite('סעיף 2', da.disputes_url)],
		['הסדרי הילדים', 'מאושרים רק אם הם לטובת הילד', cite('סעיף 24', da.capacity_url)],
		['בלי הסכם', 'בית המשפט מחליט לפי טובת הילד; ילדים עד גיל 6 אצל אמם אם אין סיבות מיוחדות', cite('סעיף 25', da.capacity_url)],
		['מזונות בהסכם', 'לא קושרים את הילד בלי אישור; גם אחרי אישור הילד יכול לתבוע אם טובתו לא נבחנה', cite('סעיף 12(א)', da.maint_law.url) + cite('בע"מ 919/15, פסקה 83', c919.url)],
		['רכוש בהסכם', 'הסכם שאושר בפסק הדין להתרת הנישואין דינו כהסכם ממון מאושר', cite('סעיף 2(ד)', da.prop_law.url)],
		['פנסיה', 'מתחלקת דרך הקופה, על פי פסק הדין או ההסכם המאושר', cite('חוק 2014', da.pension_law.url)],
		['הסדרי שהות', 'אין בחוק נוסחה; תבניות נפוצות בטבלת ההסדרים', cite('סעיף 24', da.capacity_url)],
	];
	return `<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>הסכם גירושין: איך הוא מקבל תוקף, כל שורה עם המקור</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map(([a, b, x]) => `<tr><td data-th="מה">${esc(a)}</td><td data-th="הכלל">${esc(b)}</td><td data-th="מקור">${x}</td></tr>`).join('')
		+ `</tbody></table></div><p class="jtool-updated">נבדק מול החוקים והתקנות בנבו ומול gov.il ב-${esc(isoToHe(da.checked_on))}.</p></div>`;
}

/** The figure in the sticky bar. */
export function stickyFigure(d) { return d.ok ? (d.only ? `<bdi>${d.plan.nightsA}</bdi>/14` : d.amount ? ils(d.amount, 0) : !d.kids && d.balance && d.balance.ok ? ils(d.balance.pay, 0) : '—') : '—'; }

export function snapshot(reg) {
	const on = reg.divorce_agreement.checked_on;
	const m = Object.assign({}, EXAMPLE, { from: on });
	const d = draftAgreement(reg, m);
	const mh = Object.assign({}, EXAMPLE_HORUT, { from: on });
	const h = draftAgreement(reg, mh);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: d.amount || 0,
		form: renderForm(reg, m),
		result: renderResult(reg, m, d, { example: true }),
		details: renderDetails(reg, m, d),
		method: `<ol><li>תוכנית ההורות: הסדר הלינות בשבועיים וחלוקת החגים בשנה העברית, לפי לוח השנה. אין בחוק נוסחה; בית המשפט מאשר לפי טובת הילד${cite('סעיף 24', reg.divorce_agreement.capacity_url)}</li><li>המזונות: מחשבון בע"מ 919/15 עם הלילות שבלוח, ההכנסות והדיור; בטיוטה אמצע הטווח, אלא אם סיכמתם סכום</li><li>הרכוש: מחשבון איזון המשאבים: הדירה, שאר הנכסים והחובות, ומי משלם למי מחצית ההפרש${cite('סעיף 6(ב)', reg.divorce_agreement.prop_law.url)}</li><li>סעיפי גט, סילוק טענות ואישור, ונספח תוכנית ההורות</li></ol>`,
		compare_table: compareTable(),
		numbers: numbersTable(reg),
		sticky: stickyFigure(d),
		sentence: verdictSentence(reg, d),
		horut: {
			input: EXAMPLE_HORUT, total: h.plan ? h.plan.nightsA : 0, sticky: stickyFigure(h),
			form: renderForm(reg, mh), result: renderResult(reg, mh, h, { example: true }), details: renderDetails(reg, mh, h),
			method: `<ol><li>בוחרים הסדר לינות בשבועיים, או מסמנים לילה-לילה בלוח</li><li>בוחרים איך מתחלקים החגים: חג להורה לסירוגין, או חגים ארוכים חצי-חצי, והסדר מתחלף כל שנה</li><li>הכלי מחשב את תאריכי החגים בשנה הנוכחית ובשנה הבאה לפי הלוח העברי, ובונה הסכם הורות לאישור בית המשפט${cite('סעיף 24', reg.divorce_agreement.capacity_url)}</li></ol>`,
			sentence: verdictSentence(reg, h),
		},
	};
}

/* ---------------- Browser ---------------- */

function readModel(root, prev) {
	const val = (id) => ((root.querySelector(`#${P}-${id}`) || {}).value || '').trim();
	const m$ = (id) => { const v = val(id); return v === '' ? '' : parseMoney(v); };
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const kids = [...root.querySelectorAll('[data-kid] input')].map((i) => { const v = i.value.trim(); return v === '' ? '' : (parseDate(v) || v); }).filter((k) => k !== '');
	const pattern = val('pat') || 'weekends_mid';
	// Switching to "other" starts from the nights of the schedule that was on screen.
	const custom = pattern === 'custom' && !(prev.custom || []).length && HR_PATTERNS[prev.pattern] ? [...HR_PATTERNS[prev.pattern].a] : (prev.custom || []);
	return {
		onlyPlan: prev.onlyPlan, from: prev.from, custom,
		route: checked('rt') || 'family', parentA: checked('pa') || 'אבא', children: kids, custody: checked('cu') || 'joint',
		pattern, holidays: checked('ho') || 'alternate', firstA: on('fa'),
		support: { incomeA: m$('ia'), incomeB: m$('ib'), housingA: m$('ha'), housingB: m$('hb'), amount: m$('am'), payer: checked('sp') || '', payDay: 10 },
		property: { home: checked('hm') || 'none', homeValue: m$('hv'), mortgage: m$('mo'), aAssets: m$('aa'), bAssets: m$('ba'), aDebts: m$('ad'), bDebts: m$('bd'), pension: on('pe') },
		names: { a: val('na'), b: val('nb') },
	};
}

/* Share link: choices, birth dates and amounts; never names. */
const ov = (v) => (v === '' || v === undefined || v === null ? -1 : v);
export const stateOf = (m) => encodeState({
	o: m.onlyPlan ? 1 : '', r: m.route === 'rabbinical' ? 'r' : '', a: m.parentA === 'אמא' ? 'm' : '', k: (m.children || []).map((b) => [String(b).replace(/-/g, ''), 0]),
	c: m.custody, p: m.pattern, n: m.pattern === 'custom' ? [[m.custom.join('.'), 0]] : '', h: m.holidays === 'split' ? 's' : '', f: m.firstA === false ? 0 : '',
	s: [[m.support.incomeA || 0, m.support.incomeB || 0], [m.support.housingA || 0, m.support.housingB || 0], [ov(m.support.amount), { A: 1, B: 2 }[m.support.payer] || 0]],
	q: [[{ none: 0, sell: 1, a_keeps: 2, b_keeps: 3 }[m.property.home] || 0, m.property.pension ? 1 : 0], [ov(m.property.homeValue), m.property.mortgage || 0], [ov(m.property.aAssets), ov(m.property.bAssets)], [ov(m.property.aDebts), ov(m.property.bDebts)]],
});
const KEYS = ['o', 'r', 'a', 'k', 'c', 'p', 'n', 'h', 'f', 's', 'q'];
const ymd = (x) => (/^\d{8}$/.test(x) ? `${x.slice(0, 4)}-${x.slice(4, 6)}-${x.slice(6, 8)}` : '');
export function modelOf(s) {
	if (!s.k && !s.q) { return null; }
	const pairs = (t) => String(t || '').split('~').filter(Boolean).map((x) => x.split('_'));
	const z = (x) => (x === undefined || x === '' || x === '0' ? '' : Number(x));
	const zo = (x) => (x === undefined || x === '' || x === '-1' ? '' : Number(x));
	const sp = pairs(s.s); const q = pairs(s.q);
	return {
		onlyPlan: s.o === '1', route: s.r === 'r' ? 'rabbinical' : 'family', parentA: s.a === 'm' ? 'אמא' : 'אבא', children: pairs(s.k).map((p) => ymd(p[0])).filter(Boolean),
		custody: ['joint', 'mother', 'father'].includes(s.c) ? s.c : 'joint', pattern: HR_PATTERNS[s.p] || s.p === 'custom' ? s.p : 'weekends_mid',
		custom: s.n ? String(pairs(s.n)[0][0]).split('.').filter(Boolean).map(Number) : [], holidays: s.h === 's' ? 'split' : 'alternate', firstA: s.f !== '0',
		support: { incomeA: z(sp[0] && sp[0][0]), incomeB: z(sp[0] && sp[0][1]), housingA: z(sp[1] && sp[1][0]), housingB: z(sp[1] && sp[1][1]), amount: zo(sp[2] && sp[2][0]), payer: ['', 'A', 'B'][Number(sp[2] && sp[2][1]) || 0], payDay: 10 },
		property: { home: ['none', 'sell', 'a_keeps', 'b_keeps'][Number(q[0] && q[0][0]) || 0], pension: Boolean(q[0] && q[0][1] === '1'), homeValue: zo(q[1] && q[1][0]), mortgage: z(q[1] && q[1][1]), aAssets: zo(q[2] && q[2][0]), bAssets: zo(q[2] && q[2][1]), aDebts: zo(q[3] && q[3][0]), bDebts: zo(q[3] && q[3][1]) },
		names: { a: '', b: '' },
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const da = reg.divorce_agreement;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	const only = root.getAttribute('data-jtool-mode') === 'horut';
	let model = { onlyPlan: only, from: today, custom: [] };
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(da.checked_on, da.refresh_every_days) || (da.next_update && today >= da.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרות התעדכנו'); }
	}
	const showErrors = (d) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		if (d.ok) { return; }
		for (const e of d.errors) {
			const map = { 'support-incomeA': 'ia', 'support-incomeB': 'ib', 'support-housingA': 'ha', 'support-housingB': 'hb', 'support-amount': 'am', 'support-children': 'children', children: 'children' };
			const km = /child-(\d+)$/.exec(e.field);
			const id = km ? `kid-${km[1]}` : map[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
		}
	};
	const run = (m, opts = {}) => {
		model = m;
		const d = draftAgreement(reg, m);
		showErrors(d);
		result.innerHTML = renderResult(reg, m, d);
		details.innerHTML = renderDetails(reg, m, d);
		if (sticky) { sticky.innerHTML = stickyFigure(d); }
		if (d.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: d.only ? 'plan' : d.route }); }
		return d;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readModel(root, model)); }, 160);
	};
	const fromHash = modelOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		fromHash.from = today;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	} else {
		run(readModel(root, model), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const night = ev.target.closest('[data-night]');
		if (night) {
			// Custom schedule: switch the parent of one night, keep the rest.
			const i = Number(night.getAttribute('data-night'));
			const set = new Set(model.custom && model.custom.length ? model.custom : (HR_PATTERNS[model.pattern] || { a: [] }).a);
			if (set.has(i)) { set.delete(i); } else { set.add(i); }
			const m = readModel(root, Object.assign({}, model, { custom: [...set].sort((a, b) => a - b) }));
			run(m);
			const again = root.querySelector(`[data-night="${i}"]`);
			if (again) { again.focus(); }
			return;
		}
		const add = ev.target.closest('[data-add-kid]');
		const rm = ev.target.closest('[data-remove-kid]');
		if (add || rm) {
			const kids = [...root.querySelectorAll('[data-kid] input')].map((i) => { const v = i.value.trim(); return v === '' ? '' : (parseDate(v) || v); });
			if (add && kids.length < 6) { kids.push(''); }
			if (rm) { kids.splice(Number(rm.getAttribute('data-remove-kid')), 1); }
			const m = readModel(root, model);
			form.innerHTML = renderForm(reg, Object.assign({}, m, { children: kids }));
			run(readModel(root, model));
			if (add) { const last = form.querySelector('[data-kid]:last-child input'); if (last) { last.focus(); } }
			return;
		}
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		const m = readModel(root, model);
		const d = run(m, { silent: true });
		const link = shareUrl(stateOf(m));
		if (act === 'copydoc' && d.ok) {
			const ok = await copyText(`${d.text}\n\nטיוטה שנבנתה ב-jus-tice.co.il (${isoToHe(da.checked_on)}). זו טיוטה כללית, לא ייעוץ משפטי; ההסכם טעון אישור בית המשפט או בית הדין, ועורך דין צריך לעבור עליו.`);
			toast(root, ok ? 'הטיוטה הועתקה. הדביקו אותה במסמך ועברו עליה עם עורך דין.' : 'לא הצלחנו להעתיק. אפשר לסמן את הטקסט ולהעתיק ידנית.');
			track('tool_download', { tool_id: TOOL_ID, type: 'copy-draft' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && d.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, d)} ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && d.ok) {
			const ok = await copyText(verdictSentence(reg, d));
			toast(root, ok ? 'הסיכום הועתק.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: d.ok ? 'ok' : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(m));
			toast(root, 'נשמר במכשיר הזה בלבד, בלי שמות.');
		} else if (act === 'restore') {
			const s = modelOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { s.from = today; form.innerHTML = renderForm(reg, s); run(s); }
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
