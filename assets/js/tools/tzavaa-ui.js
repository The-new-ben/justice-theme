/**
 * Wave 4 UI: what a will costs, from signing to the probate order (HAD-502). Invented tool.
 * Board: Claude Design canvas "Tools wave 4" (co.il tzavaa at 1280 and 360, states).
 * The cost track shows the three moments of a will (signing, deposit, the heirs' probate request); the table and the
 * path say the same in text, each line with its regulation.
 */
import { compute, byForm, FORMS } from './tzavaa-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState,
	track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'tzavaa';
const P = 'jt11';

export const EXAMPLE = { form: 'notary', people: 1, docs: 'one', deposit: true, recent: [false, false], words: 0, foreign: false, night: false, outside: false, hours: '', lawyer: '', lawyerVat: true, online: true, barRef: true, estate: '' };

const FORM_LABEL = { notary: 'בפני נוטריון', registrar: 'בפני רשם לענייני ירושה', witnesses: 'בעדים', handwritten: 'בכתב יד' };
const FORM_LONG = { notary: 'בפני נוטריון (צוואה בפני רשות)', registrar: 'בפני רשם לענייני ירושה', witnesses: 'בפני שני עדים', handwritten: 'בכתב ידכם' };

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const wc = reg.will_cost;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const f = FORMS.includes(input.form) ? input.form : 'notary';
	const two = Number(input.people) === 2;
	const recent = Array.isArray(input.recent) ? input.recent : [false, false];
	return `<fieldset class="jtool-field"><legend>איך עושים את הצוואה</legend><div class="jtool-chips">${['notary', 'registrar', 'witnesses', 'handwritten'].map((k) => chip('form', k, FORM_LONG[k], f === k)).join('')}</div>`
		+ `<p class="jtool-hint">ארבע הצורות שבחוק (סעיף 18). נוטריון נחשב לרשות כמו שופט (סעיף 22(ז)).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מי עושה צוואה</legend><div class="jtool-chips">${chip('ppl', '1', 'אדם אחד', !two)}${chip('ppl', '2', 'בני זוג, צוואות הדדיות', two)}</div>`
		+ `<div class="jtool-chips" data-if-two data-if-form="notary"${two && f === 'notary' ? '' : ' hidden'} style="margin-top:8px">${chip('docs', 'one', 'במסמך אחד', input.docs !== 'two')}${chip('docs', 'two', 'בשני מסמכים', input.docs === 'two')}</div>`
		+ `<p class="jtool-hint">צוואות הדדיות: כל אחד מבני הזוג עושה צוואה בהסתמך על צוואת השני, במסמך אחד או בשניים (סעיף 8א).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>הפקדה אצל הרשם לענייני ירושה</legend><div class="jtool-chips">${chip('dep', '1', 'להפקיד את הצוואה', input.deposit, 'checkbox')}</div>`
		+ `<div class="jtool-chips" data-if-deposit${input.deposit ? '' : ' hidden'} style="margin-top:8px">${chip('rc0', '1', two ? 'המצווה הראשון הפקיד צוואה אחרת ב-5 השנים האחרונות' : 'כבר הפקדתי צוואה אחרת ב-5 השנים האחרונות', recent[0], 'checkbox')}<span data-if-two${two ? '' : ' hidden'}>${chip('rc1', '1', 'המצווה השני הפקיד צוואה אחרת ב-5 השנים האחרונות', recent[1], 'checkbox')}</span></div>`
		+ `<p class="jtool-hint">${esc(wc.registrar.indexed_he)}. ההפקדה פטורה מאגרה כשלא הופקדה צוואה קודמת ב-${wc.registrar.deposit_free_years} השנים שלפני (פרט 5א).</p></fieldset>`
		+ `<details class="jtool-more" data-if-form="notary"${f === 'notary' ? '' : ' hidden'}${input.words || input.foreign || input.night || input.outside ? ' open' : ''}><summary>תוספות אצל הנוטריון</summary>`
		+ `<div class="jtool-row" style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${P}-words">הנוטריון מתרגם את הצוואה: כמה מילים</label><input id="${P}-words" type="text" inputmode="numeric" autocomplete="off" value="${esc(input.words || '')}" placeholder="0 אם אין תרגום" aria-describedby="${P}-words-e"><p class="jtool-error" id="${P}-words-e" role="alert"></p></div>`
		+ `<div class="jtool-field" data-if-outside${input.outside ? '' : ' hidden'}><label class="jtool-label" for="${P}-hours">כמה שעות מחוץ למשרד, מהיציאה ועד החזרה</label><input id="${P}-hours" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.hours || '')}" placeholder="לדוגמה: 1.5" aria-describedby="${P}-hours-e"><p class="jtool-error" id="${P}-hours-e" role="alert"></p></div></div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('out', '1', 'הנוטריון מגיע אלינו (בית, בית חולים)', input.outside, 'checkbox')}${chip('ngt', '1', 'בין 19:00 ל-08:00 או ביום מנוחה', input.night, 'checkbox')}${chip('frn', '1', 'האישור בשפה זרה שאינה ערבית או אנגלית', input.foreign, 'checkbox')}</div>`
		+ `<p class="jtool-hint">התעריף לפי ${esc(wc.notary.regulation_he)}, מ-${isoToHe(wc.notary.from)}. נוטריון שבא אליכם גובה גם הוצאות נסיעה, שאין להן סכום בתקנות.</p></details>`
		+ `<details class="jtool-more"${input.lawyer ? ' open' : ''}><summary>יש לכם הצעת מחיר מעורך דין?</summary>`
		+ `<div class="jtool-field" style="margin-top:8px"><label class="jtool-label" for="${P}-law">שכר הטרחה לפי ההצעה</label><div class="jtool-input jtool-input--money"><input id="${P}-law" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.lawyer ? money(input.lawyer, 0) : '')}" placeholder="לפי ההצעה שקיבלתם" aria-describedby="${P}-lawyer-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-lawyer-e" role="alert"></p></div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('lvi', '1', 'הסכום כבר כולל מע"מ', input.lawyerVat === false, 'checkbox')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('bar', '1', 'להציג את התעריף המינימלי המומלץ של לשכת עורכי הדין', input.barRef, 'checkbox')}</div>`
		+ `<div class="jtool-field" style="margin-top:8px" data-if-bar${input.barRef ? '' : ' hidden'}><label class="jtool-label" for="${P}-est">שווי העיזבון בערך (לבקשה לצו קיום בידי עורך דין)</label><div class="jtool-input jtool-input--money"><input id="${P}-est" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.estate ? money(input.estate, 0) : '')}" placeholder="לא חובה" aria-describedby="${P}-estate-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-estate-e" role="alert"></p></div>`
		+ `<p class="jtool-hint">${esc(wc.bar.note_he)}. אין תעריף מחייב לשכר טרחה על צוואה; הכלי מוסיף את ההצעה שהזנתם, ולא ממליץ על מחיר.</p></details>`
		+ `<fieldset class="jtool-field"><legend>אחרי הפטירה: הבקשה לצו קיום</legend><div class="jtool-chips">${chip('onl', '1', 'הגשה מקוונת', input.online !== false)}${chip('onl', '0', 'הגשה רגילה', input.online === false)}</div></fieldset>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const wc = reg.will_cost;
	const who = r.people === 2 ? 'לבני זוג' : 'לאדם אחד';
	const make = r.now.find((l) => l.key === 'make');
	const makeTxt = r.form === 'notary' ? `${nis(Math.round(make.amount * (100 + r.vatPct)) / 100)} כולל מע"מ ${r.vatPct}%` : make.amount ? nis(make.amount) : 'בלי אגרה';
	const dep = r.deposit ? r.now.filter((l) => l.key.startsWith('deposit')).reduce((a, l) => a + l.amount, 0) : null;
	return `צוואה ${FORM_LABEL[r.form]} ${who}: ${makeTxt}.`
		+ (dep === null ? '' : dep === 0 ? ' ההפקדה אצל הרשם: חינם.' : ` ההפקדה אצל הרשם: ${nis(dep)}.`)
		+ ` אחרי הפטירה: צו קיום צוואה ${nis(r.probateEach)}${r.online ? ' בהגשה מקוונת' : ''}${r.people === 2 ? ' לכל אחד' : ''}, ועוד הוצאות פרסום (${wc.publication_section}).`;
}

/** The track: signing, deposit, probate, each a station with its cost. */
function trackHtml(reg, r) {
	const vat = (l) => (l.vat ? Math.round(l.amount * (100 + r.vatPct)) / 100 : l.amount);
	const sum = (keys) => r.now.filter((l) => keys(l.key)).reduce((a, l) => a + vat(l), 0);
	const stations = [
		{ when: 'היום', what: 'החתימה', amount: sum((k) => !k.startsWith('deposit')), note: r.form === 'notary' ? 'כולל מע"מ' : r.form === 'registrar' ? 'אגרה' : 'אין אגרה' },
		{ when: 'היום', what: 'ההפקדה', amount: r.deposit ? sum((k) => k.startsWith('deposit')) : null, note: r.deposit ? 'אצל הרשם' : 'לא בחרתם' },
		{ when: 'אחרי הפטירה', what: 'צו קיום', amount: r.laterTotal, note: r.online ? 'מקוון, 85%' : 'הגשה רגילה' },
	];
	return `<ol class="jt11-track" aria-label="העלויות לפי שלבים">${stations.map((s) => `<li class="jt11-st${s.amount === 0 ? ' jt11-st--free' : ''}${s.amount === null ? ' jt11-st--off' : ''}">`
		+ `<span class="jt11-st__when">${esc(s.when)}</span><span class="jt11-st__what">${esc(s.what)}</span>`
		+ `<strong class="jt11-st__amt">${s.amount === null ? '—' : s.amount === 0 ? 'חינם' : ils(s.amount, s.amount % 1 ? 2 : 0)}</strong><span class="jt11-st__note">${esc(s.note)}</span></li>`).join('')}</ol>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const flags = r.flags.filter((f) => f.code !== 'notary_fixed');
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ ${r.free ? 'יש כאן פריט פטור מאגרה' : 'לפי התעריפים הרשמיים'}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}כמה עולה הצוואה היום, חתימה והפקדה</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.nowTotal)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<p class="jtool-scope">כל הדרך, מהחתימה ועד צו הקיום: <strong>${ils(r.total)}</strong>${r.now.some((l) => l.quote) ? ', כולל שכר הטרחה שהזנתם' : ''}.</p>`
		+ (r.bar.shown ? `<p class="jtool-scope">עם עורך דין, לפי התעריף המינימלי המומלץ של הלשכה (לא מחייב): עריכת ${r.people === 2 ? 'שתי הצוואות ההדדיות' : 'הצוואה'} לפחות <strong>${ils(r.bar.make, 0)}</strong>, ובקשה לצו קיום לפחות <strong>${ils(r.bar.probateEach, r.bar.probateEach % 1 ? 2 : 0)}</strong>${r.people === 2 ? ' לכל עיזבון' : ''}, ועוד מע"מ.</p>` : '')
		+ `</div>`
		+ trackHtml(reg, r)
		+ (flags.length ? `<ul class="jtool-flags">${flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '');
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const wc = reg.will_cost;
	const rows = r.now.map((l) => [l.he, l.vat ? Math.round(l.amount * (100 + r.vatPct)) / 100 : l.amount, l.section, l.url, l.vat]).concat(r.later.map((l) => [l.he, l.amount, l.section, l.url, false]));
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-cost-h">כמה, על מה, ולפי איזה סעיף</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-cost-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([what, v, rule, href, vat]) => `<tr><td data-th="מה">${esc(what)}${vat ? ` (כולל מע"מ ${r.vatPct}%)` : ''}</td><td data-th="סכום">${v === 0 ? 'חינם' : ils(v)}</td><td data-th="הכלל">${rule ? cite(rule, href) : '—'}</td></tr>`).join('')
		+ `<tr><td data-th="מה">פרסום הבקשה באתר האפוטרופוס הכללי וברשומות</td><td data-th="סכום">על המבקש, בלי סכום רשמי</td><td data-th="הכלל">${cite(wc.publication_section, wc.regulations_url)}</td></tr>`
		+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול, מהחתימה ועד צו הקיום</td><td data-th="סכום">${ils(r.total)}</td><td data-th="הכלל">${r.vatOnly ? `מתוכו מע"מ ${ils(r.vatOnly)}` : '—'}</td></tr></tbody>`
		+ `<caption>אגרות הרשם ותעריף הנוטריונים מ-${isoToHe(wc.registrar.from)}; מתעדכנים כל 1 בינואר. ${esc(wc.court_he)}.</caption></table></div></div>`;
	// The same choices in each form, side by side.
	const forms = byForm(reg, { people: r.people, docs: r.docs, deposit: r.deposit, recent: r.now.filter((l) => l.key.startsWith('deposit')).map((l) => l.amount > 0), online: r.online });
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-forms-h">אותה צוואה, ארבע צורות</h3></div><div class="jt7-scns">`
		+ FORMS.map((k) => { const v = forms[k]; const here = k === r.form; return `<div class="jt7-scn${here ? ' jt7-scn--here' : ''}"><p>${esc(FORM_LABEL[k])}${here ? ' (אתם)' : ''}</p><strong>${v ? (v.now ? ils(v.now, v.now % 1 ? 2 : 0) : 'חינם') : '—'}</strong><small>${v ? `היום; ועוד ${nis(v.later)} אחרי הפטירה` : ''}</small></div>`; }).join('')
		+ `</div><p class="jt7-scns__note">אגרות ותעריפים בלבד, בלי שכר טרחה ובלי תוספות. צוואה בכתב יד או בעדים: אין אגרה, אבל קל יותר לתקוף אותה כשהיא לא נעשתה כדין (סעיפים 19, 20 ו-25).</p></div>`;
	// The lawyer reference.
	if (r.bar.shown) {
		const bar = wc.bar;
		const rows2 = [
			[r.people === 2 ? 'עריכת שתי צוואות הדדיות' : 'עריכת צוואה רגילה', r.bar.make, r.people === 2 ? bar.items.mutual : bar.items.will],
			[`בקשה לצו קיום בלי התנגדות: ${bar.probate_pct}% מערך העיזבון${r.bar.estate === null ? '' : ` (${nis(r.bar.estate)})`}, לא פחות מ-${nis(bar.probate_min)}${r.people === 2 ? ', לכל עיזבון' : ''}`, r.bar.probateEach, bar.items.probate],
			['הפקדת צוואה שערך מישהו אחר', bar.deposit_other, bar.items.deposit_other],
		];
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-bar-h">עורך דין: התעריף המינימלי המומלץ</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-bar-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">השירות</th><th scope="col">לפני מע"מ</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ rows2.map(([t, v, s2]) => `<tr><td data-th="השירות">${esc(t)}</td><td data-th="לפני מע&quot;מ">${ils(v, v % 1 ? 2 : 0)}</td><td data-th="הכלל">${cite(s2, bar.url)}</td></tr>`).join('')
			+ `<tr class="jtool-table__total"><td data-th="השירות">עריכה וצו קיום, לפחות</td><td data-th="לפני מע&quot;מ">${ils(r.bar.total, r.bar.total % 1 ? 2 : 0)}</td><td data-th="הכלל">עם מע"מ ${r.vatPct}%: ${esc(nis(r.bar.withVat))}</td></tr></tbody>`
			+ `<caption>${esc(bar.note_he)}. בהתנגדות, התעריף לצו הקיום גבוה ב-${bar.objection_add_pct}%.</caption></table></div></div>`;
	}
	// What to bring.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">מה לוקחים איתכם</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ul class="jt11-list">${checklist(reg, r).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
	return out;
}

export function checklist(reg, r) {
	const wc = reg.will_cost;
	const out = [];
	if (r.form === 'notary') { out.push('תעודה מזהה בתוקף לכל מצווה; נוסח הצוואה מוכן, בשפה שאתם מבינים (אם לא, הנוטריון מתרגם ומאשר את התרגום)'); }
	if (r.form === 'registrar') { out.push('תעודה מזהה; את דברי הצוואה אומרים בעל פה לרשם, או מגישים בכתב בעצמכם (סעיף 22(א))'); }
	if (r.form === 'witnesses') { out.push('שני עדים בגירים שלא מקבלים דבר בצוואה, וגם לא בני הזוג שלהם (סעיפים 24 ו-35); תאריך וחתימה מולם (סעיף 20)'); }
	if (r.form === 'handwritten') { out.push('הצוואה כולה בכתב ידכם, עם תאריך וחתימה בכתב ידכם (סעיף 19)'); }
	if (r.deposit) { out.push('הפקדה: מגיעים בעצמכם למשרד הרשם לענייני ירושה עם המקור ותעודה מזהה, ומקבלים אישור הפקדה (תקנה 6). צוואה בפני רשות שנחתמה בחתימה אלקטרונית מאושרת: אפשר גם באתר האפוטרופוס הכללי (תקנה 6א)'); }
	out.push('אחרי הפטירה: היורשים מגישים בקשה לצו קיום עם הצוואה המקורית ותעודת הפטירה, ושולחים הודעה ליורשים ולזוכים (תקנה 14)');
	return out;
}

/** Page section: every form for one and two testators, from the same engine. */
export function formsTable(reg) {
	const rows = FORMS.map((k) => {
		const one = compute(reg, { form: k, people: 1, deposit: true, recent: [false, false], online: true });
		const two = compute(reg, { form: k, people: 2, docs: 'one', deposit: true, recent: [false, false], online: true });
		const cell = (x) => (x.nowTotal ? ils(x.nowTotal, x.nowTotal % 1 ? 2 : 0) : 'חינם');
		return `<tr><td data-th="הצורה">${esc(FORM_LONG[k])}</td><td data-th="אדם אחד, היום">${cell(one)}</td><td data-th="בני זוג, היום">${cell(two)}</td><td data-th="צו קיום, לכל מצווה">${ils(one.probateEach, one.probateEach % 1 ? 2 : 0)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>כמה עולה כל צורת צוואה: חתימה והפקדה ראשונה (פטורה), ואחר כך צו הקיום בהגשה מקוונת. נוטריון כולל מע"מ ${reg.will_cost.vat.pct}%; בני זוג אצל נוטריון: מסמך אחד.</caption><thead><tr><th scope="col">הצורה</th><th scope="col">אדם אחד, היום</th><th scope="col">בני זוג, היום</th><th scope="col">צו קיום, לכל מצווה</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const make = r.now.find((l) => l.key === 'make');
	const nf = reg.will_cost.notary;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.nowTotal,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>אישור צוואה בפני נוטריון, חותם ראשון: ${money(make.amount, 0)} ₪${cite(nf.item_will, nf.url)}</li>`
			+ `<li>מע"מ ${r.vatPct}%: ${money(make.amount, 0)} × ${(100 + r.vatPct) / 100} = ${money(r.nowTotal)} ₪${cite('תקנה 1', nf.url)}</li>`
			+ `<li>הפקדה אצל הרשם, בלי הפקדה קודמת ב-5 השנים האחרונות: פטור${cite(reg.will_cost.registrar.item_deposit_free, reg.will_cost.registrar.url)}</li>`
			+ `<li>אחרי הפטירה, בקשה מקוונת לצו קיום: ${money(reg.will_cost.registrar.order, 0)} × ${reg.will_cost.registrar.online_pct}% = ${money(r.probateEach)} ₪${cite(reg.will_cost.registrar.online_section, reg.will_cost.registrar.url)}</li>`
			+ `<li>סך הכול: ${money(r.total)} ₪, ועוד הוצאות הפרסום, שאין להן סכום רשמי.</li></ol>`,
		compare_table: formsTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const num = (id) => { const v = val(`#${P}-${id}`).trim().replace(/,/g, ''); return v === '' ? '' : Number(v); };
	const law = val(`#${P}-law`).trim();
	return {
		form: (root.querySelector(`input[name="${P}-form"]:checked`) || {}).value || 'notary',
		people: Number((root.querySelector(`input[name="${P}-ppl"]:checked`) || {}).value || 1),
		docs: (root.querySelector(`input[name="${P}-docs"]:checked`) || {}).value || 'one',
		deposit: on('dep'), recent: [on('rc0'), on('rc1')],
		words: num('words'), hours: num('hours'), outside: on('out'), night: on('ngt'), foreign: on('frn'),
		lawyer: law === '' ? '' : parseMoney(law), lawyerVat: !on('lvi'),
		barRef: on('bar'), estate: !on('bar') || val(`#${P}-est`).trim() === '' ? '' : parseMoney(val(`#${P}-est`)),
		online: ((root.querySelector(`input[name="${P}-onl"]:checked`) || {}).value || '1') === '1',
	};
}

const FM = { notary: 'n', registrar: 'r', witnesses: 'w', handwritten: 'h' };
const stateOf = (i) => encodeState({ f: FM[i.form] || 'n', p: i.people === 2 ? 2 : '', d: i.docs === 'two' ? 2 : '', x: i.deposit ? '' : 0, a: i.recent && i.recent[0] ? 1 : '', b: i.recent && i.recent[1] ? 1 : '', w: i.words || '', o: i.outside ? i.hours || 1 : '', n: i.night ? 1 : '', g: i.foreign ? 1 : '', l: i.lawyer || '', v: i.lawyerVat === false ? 1 : '', k: i.online === false ? 0 : '', r: i.barRef ? '' : 0, e: i.estate || '' });
const KEYS = ['f', 'p', 'd', 'x', 'a', 'b', 'w', 'o', 'n', 'g', 'l', 'v', 'k', 'r', 'e'];
function inputOf(s) {
	if (!s.f) { return null; }
	return {
		form: Object.keys(FM).find((k) => FM[k] === s.f) || 'notary', people: s.p === '2' ? 2 : 1, docs: s.d === '2' ? 'two' : 'one',
		deposit: s.x !== '0', recent: [s.a === '1', s.b === '1'], words: s.w ? Number(s.w) : 0,
		outside: Boolean(s.o), hours: s.o ? Number(s.o) : '', night: s.n === '1', foreign: s.g === '1',
		lawyer: s.l ? Number(s.l) : '', lawyerVat: s.v !== '1', online: s.k !== '0', barRef: s.r !== '0', estate: s.e ? Number(s.e) : '',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const wc = reg.will_cost;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(wc.checked_on, wc.refresh_every_days) || (wc.next_update && today >= wc.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהתעריפים התעדכנו ב-1 בינואר'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const ids = { lawyer: 'law', words: 'words', hours: 'hours', estate: 'est' };
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${ids[e.field] || e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const f = (root.querySelector(`input[name="${P}-form"]:checked`) || {}).value || 'notary';
		const two = ((root.querySelector(`input[name="${P}-ppl"]:checked`) || {}).value || '1') === '2';
		form.querySelectorAll('[data-if-form]').forEach((el) => { el.hidden = el.getAttribute('data-if-form') !== f || (el.hasAttribute('data-if-two') && !two); });
		form.querySelectorAll('[data-if-two]:not([data-if-form])').forEach((el) => { el.hidden = !two; });
		form.querySelectorAll('[data-if-deposit]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-dep"]:checked`); });
		form.querySelectorAll('[data-if-outside]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-out"]:checked`); });
		form.querySelectorAll('[data-if-bar]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-bar"]:checked`); });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.nowTotal) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.form }); }
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
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		// A click while the debounce is pending runs it now; every action computes what the form holds now.
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי האגרות ותעריף הנוטריונים ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(wc.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(checklist(reg, r).map((x, i) => `${i + 1}. ${x}`).join('\n'));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.form : 'error' });
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
