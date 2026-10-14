/**
 * Family wave UI: the prenup draft generator (הסכם ממון), HAD-506.
 * One picture from the subject: the approval route as a row of gates (notary, marriage registrar, family court,
 * rabbinical court); the ones the law closes at your stage are struck through, with the section that closes them.
 * Then the draft itself, as a numbered legal document to copy. No download is faked: copy, or print to PDF.
 */
import { draftMamon, mmRoutesFor, MM_ROUTES } from './mamon-engine.js';
import { parseDate } from './dates.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState,
	track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'heskem-mamon';
const P = 'jt18';
export const EXAMPLE = {
	timing: 'before', route: 'notary', regime: 'graded', home: 'a', homeAddress: '', gradePct: 5, gradeCap: 50, residenceMonths: 6,
	pension: 'law', business: 'none', businessGrowth: 'separate', fruits: true, jointAccount: true, household: 'income', second: false,
	names: { a: '', b: '' }, wedding: '', copies: 2,
	assetsA: [{ label: 'דירה', value: 2400000 }, { label: 'חיסכון בקרן השתלמות', value: 120000 }], assetsB: [{ label: 'חיסכון בבנק', value: 90000 }],
};
const TIMING = { before: 'לפני הנישואין', during: 'אחרי הנישואין', cohab: 'ידועים בציבור' };
const REGIME = { separate: 'הפרדה רכושית מלאה', law_except: 'איזון לפי החוק, עם חריגים', graded: 'הסכם מדורג (הדירה בהדרגה)' };
const HOME = { none: 'אין דירה', a: "דירה של צד א'", b: "דירה של צד ב'", joint_new: 'נקנה דירה יחד' };

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ` <span class="jtool-cite">${esc(text)}</span>`; }
const v0 = (x) => (x === '' || x === undefined || x === null ? '' : x);
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;

function assetRow(side, x, i) {
	return `<li class="jtool-rep__row" data-asset="${side}-${i}"><div class="jtool-field"><label class="jtool-label" for="${P}-${side}-l-${i}">נכס או חוב</label><input id="${P}-${side}-l-${i}" type="text" autocomplete="off" value="${esc(x.label || '')}" placeholder="לדוגמה: דירה ברחובות"></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-${side}-v-${i}">שווי</label><div class="jtool-input jtool-input--money"><input id="${P}-${side}-v-${i}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v0(x.value) === '' ? '' : money(x.value, 0))}" placeholder="0"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div></div>`
		+ `<button class="jtool-iconbtn" type="button" data-remove-asset="${side}-${i}" aria-label="מחיקת שורה">✕</button></li>`;
}

export function renderForm(reg, m) {
	const pn = reg.prenup;
	const allowed = mmRoutesFor(pn, m.timing);
	const route = allowed.includes(m.route) ? m.route : allowed[0];
	const owned = m.home === 'a' || m.home === 'b';
	return `<fieldset class="jtool-field"><legend>מתי חותמים</legend><div class="jtool-chips">${Object.entries(TIMING).map(([k, v]) => chip('t', k, v, m.timing === k)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מי מאשר או מאמת</legend><div class="jtool-chips">${MM_ROUTES.map((k) => (allowed.includes(k) ? chip('r', k, pn.routes[k].he, route === k) : '')).join('')}</div><p class="jtool-hint">${esc(m.timing === 'during' ? pn.during_he : m.timing === 'cohab' ? 'ידועים בציבור: מאשרים בבית המשפט לענייני משפחה' : 'לפני החתונה: נוטריון, רושם הנישואין, בית המשפט או בית הדין')}.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>ההסדר הרכושי</legend><div class="jtool-chips">${Object.entries(REGIME).map(([k, v]) => chip('g', k, v, m.regime === k)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>דירת המגורים</legend><div class="jtool-chips">${Object.entries(HOME).map(([k, v]) => chip('h', k, v, m.home === k)).join('')}</div></fieldset>`
		+ `<div class="jtool-row" data-if-owned${owned ? '' : ' hidden'}><div class="jtool-field"><label class="jtool-label" for="${P}-addr">כתובת הדירה (לא חובה)</label><input id="${P}-addr" type="text" autocomplete="off" value="${esc(m.homeAddress || '')}" placeholder="נשאר במכשיר שלכם"></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-res">חודשי מגורים לצד השני אחרי פרידה</label><input id="${P}-res" type="text" inputmode="numeric" autocomplete="off" value="${esc(v0(m.residenceMonths))}" aria-describedby="${P}-residenceMonths-e"><p class="jtool-error" id="${P}-residenceMonths-e" role="alert"></p></div></div>`
		+ `<div class="jtool-row" data-if-graded${owned && m.regime === 'graded' ? '' : ' hidden'}><div class="jtool-field"><label class="jtool-label" for="${P}-gp">אחוז מהדירה לכל שנת נישואין</label><input id="${P}-gp" type="text" inputmode="decimal" autocomplete="off" value="${esc(v0(m.gradePct))}" aria-describedby="${P}-gradePct-e"><p class="jtool-error" id="${P}-gradePct-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-gc">עד אחוז</label><input id="${P}-gc" type="text" inputmode="decimal" autocomplete="off" value="${esc(v0(m.gradeCap))}" aria-describedby="${P}-gradeCap-e"><p class="jtool-error" id="${P}-gradeCap-e" role="alert"></p></div></div>`
		+ `<details class="jtool-more"${m.business !== 'none' || m.pension === 'own' ? ' open' : ''}><summary>פנסיה, עסק, ירושות וחשבון משותף</summary>`
		+ `<fieldset class="jtool-field" style="margin-top:8px"><legend>פנסיה וחסכונות</legend><div class="jtool-chips">${chip('pe', 'law', 'מה שנצבר בנישואין מתאזן', m.pension !== 'own')}${chip('pe', 'own', 'כל אחד שומר את שלו', m.pension === 'own')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>עסק או מניות</legend><div class="jtool-chips">${chip('b', 'none', 'אין', m.business === 'none')}${chip('b', 'a', "של צד א'", m.business === 'a')}${chip('b', 'b', "של צד ב'", m.business === 'b')}</div></fieldset>`
		+ `<fieldset class="jtool-field" data-if-business${m.business === 'none' ? ' hidden' : ''}><legend>עליית הערך של העסק בנישואין</legend><div class="jtool-chips">${chip('bg', 'separate', 'נשארת של הבעלים', m.businessGrowth !== 'shared')}${chip('bg', 'shared', 'מתאזנת', m.businessGrowth === 'shared')}</div></fieldset>`
		+ `<div class="jtool-chips">${chip('fr', '1', 'גם הפירות ועליית הערך של נכס נפרד נשארים נפרדים', m.fruits !== false, 'checkbox')}${chip('ja', '1', 'חשבון משותף להוצאות הבית', m.jointAccount, 'checkbox')}${chip('sc', '1', 'לאחד מאיתנו או לשנינו ילדים מקשר קודם', m.second, 'checkbox')}</div>`
		+ `<fieldset class="jtool-field" data-if-joint${m.jointAccount ? '' : ' hidden'}><legend>כל אחד מפקיד בחשבון המשותף</legend><div class="jtool-chips">${chip('hh', 'equal', 'סכום שווה', m.household !== 'income')}${chip('hh', 'income', 'לפי ההכנסות', m.household === 'income')}</div></fieldset></details>`
		+ `<details class="jtool-more"${(m.assetsA || []).length + (m.assetsB || []).length ? ' open' : ''}><summary>הנספחים: הנכסים והחובות של כל אחד</summary><p class="jtool-hint" style="margin-top:8px">הגילוי המלא הוא מה שמחזיק הסכם ממון. השורות נשארות במכשיר, לא נשלחות לשום מקום.</p>`
		+ `<div class="jt9-cols jt18-cols"><div><p class="jt9-col__h">צד א'</p><ul class="jtool-rep" data-assets="a">${(m.assetsA || []).map((x, i) => assetRow('a', x, i)).join('')}</ul><button class="jtool-linkbtn" type="button" data-add-asset="a">+ שורה</button></div>`
		+ `<div><p class="jt9-col__h">צד ב'</p><ul class="jtool-rep" data-assets="b">${(m.assetsB || []).map((x, i) => assetRow('b', x, i)).join('')}</ul><button class="jtool-linkbtn" type="button" data-add-asset="b">+ שורה</button></div></div></details>`
		+ `<details class="jtool-more"><summary>שמות ותאריך החתונה, לטיוטה (לא חובה)</summary><div class="jtool-row" style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${P}-na">שם צד א'</label><input id="${P}-na" type="text" autocomplete="off" value="${esc((m.names && m.names.a) || '')}"></div><div class="jtool-field"><label class="jtool-label" for="${P}-nb">שם צד ב'</label><input id="${P}-nb" type="text" autocomplete="off" value="${esc((m.names && m.names.b) || '')}"></div></div>`
		+ `<div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-wd">תאריך החתונה</label><input id="${P}-wd" type="text" inputmode="numeric" autocomplete="off" value="${esc(m.wedding ? isoToHe(m.wedding) : '')}" placeholder="לדוגמה: 20.3.2027"></div><div class="jtool-field"><label class="jtool-label" for="${P}-cp">עותקים לאימות</label><input id="${P}-cp" type="text" inputmode="numeric" autocomplete="off" value="${esc(v0(m.copies))}"></div></div><p class="jtool-hint">השמות נכנסים רק לטקסט שאתם מעתיקים. הם לא נשמרים בקישור השיתוף.</p></details>`;
}

/** The approval gates: open at your stage, or closed by the law, each with its section. */
function gates(reg, d, timing) {
	const pn = reg.prenup;
	return `<ol class="jt18-gates" aria-label="מי יכול לאשר את ההסכם">${MM_ROUTES.map((k) => {
		const r = pn.routes[k];
		const open = d.routeAllowed.includes(k);
		const here = d.route === k;
		return `<li class="jt18-gate${open ? '' : ' jt18-gate--shut'}${here ? ' jt18-gate--here' : ''}"><span class="jt18-gate__who">${esc(r.he)}</span><span class="jt18-gate__law">${esc(r.section)}</span><span class="jt18-gate__state">${here ? 'הדרך שלכם' : open ? 'אפשרי' : timing === 'during' ? 'רק לפני החתונה' : 'לא בשלב הזה'}</span></li>`;
	}).join('')}</ol>`;
}

export function verdictSentence(reg, d) {
	if (!d.ok) { return ''; }
	const c = d.cost;
	const r = reg.prenup.routes[d.route];
	return `טיוטת ${d.title} עם ${d.clauses.length} סעיפים ושני נספחים, ${REGIME[d.regime]}. אישור: ${r.he} (${r.section}). ${c.known ? `עלות האישור: ${money(c.total, 2)} ₪${c.vat ? ` כולל מע"מ ${c.vatPct}%` : ''}.` : c.he + '.'}`;
}

export function renderResult(reg, d, opts = {}) {
	if (!d.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן</p><p class="jtool-verdict__sentence">${d.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const c = d.cost;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי חוק יחסי ממון, סעיפים 1-3</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה: ' : ''}עלות האישור בדרך שבחרתם</p>`
		+ `<strong class="jtool-verdict__figure">${c.known ? ils(c.total, c.total % 1 ? 2 : 0) : 'לבדוק'}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, d))}</p>`
		+ `<div class="jtool-actions" style="margin-top:12px"><button class="jtool-btn jtool-btn--primary" type="button" data-act="copydoc">העתקת הטיוטה המלאה</button></div></div>`
		+ gates(reg, d, d.timing)
		+ `<ul class="jtool-flags">${d.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>`;
}

export function renderDetails(reg, d) {
	if (!d.ok) { return ''; }
	const pn = reg.prenup;
	const r = pn.routes[d.route];
	const c = d.cost;
	return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-doc-h">הטיוטה</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copydoc">העתקה</button><button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button></div></div>`
		+ `<pre class="jtool-letter jt18-doc" role="region" aria-labelledby="${P}-doc-h" tabindex="0">${esc(d.text)}</pre></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-route-h">האישור: ${esc(r.he)}</h3></div><ol class="jtool-steps">${d.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`
		+ (c.known ? `<div class="jtool-scroll" role="region" aria-labelledby="${P}-route-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ `<tr><td data-th="מה">${esc(d.route === 'notary' ? 'אימות הסכם הממון' : 'אגרת אישור ההסכם')}</td><td data-th="סכום">${ils(c.fee, 0)}</td><td data-th="הכלל">${cite(c.item, c.url)}</td></tr>`
			+ (c.extra ? `<tr><td data-th="מה">עותקים נוספים באותו מעמד</td><td data-th="סכום">${ils(c.extra, 0)}</td><td data-th="הכלל">${cite(c.copyItem, c.url)}</td></tr>` : '')
			+ (c.vat ? `<tr><td data-th="מה">מע"מ ${c.vatPct}%</td><td data-th="סכום">${ils(c.vat)}</td><td data-th="הכלל">${cite('תקנה 1', c.url)}</td></tr>` : '')
			+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול</td><td data-th="סכום">${ils(c.total)}</td><td data-th="הכלל">${esc(c.law)}</td></tr></tbody></table></div>` : `<p class="jt7-scns__note">${esc(c.he)}.</p>`)
		+ `</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3>מה להביא</h3></div><ol class="jtool-steps">${d.checklist.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3>מה לבדוק עם עורך דין לפני החתימה</h3></div><ul class="jtool-notes">${d.lawyer.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>`;
}

/** Page section: the four routes side by side (the comparison table of the page). */
export function compareTable(reg) {
	const pn = reg.prenup;
	const rows = MM_ROUTES.map((k) => {
		const r = pn.routes[k];
		const cost = r.fee === null || r.fee === undefined ? 'לא מצאנו אגרה נפרדת' : `${money(r.fee, 0)} ש"ח${r.vat ? ` ועוד מע"מ ${pn.vat.pct}%` : ''}`;
		const when = r.when.map((w) => ({ before: 'לפני הנישואין', wedding: 'בשעת הנישואין', during: 'אחרי הנישואין', cohab: 'ידועים בציבור' }[w])).join(', ');
		return `<tr><td data-th="מי">${esc(r.he)}</td><td data-th="מתי">${esc(when)}</td><td data-th="עלות">${esc(cost)}${r.fee_item ? ` (${esc(r.fee_item)})` : ''}</td><td data-th="מקור">${cite(r.section, pn.law_url)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מי מאשר הסכם ממון, מתי, ובכמה</caption><thead><tr><th scope="col">מי</th><th scope="col">מתי</th><th scope="col">עלות</th><th scope="col">מקור</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: what a prenup can and cannot do, each line with its source (the "numbers" part). */
export function numbersTable(reg) {
	const pn = reg.prenup;
	const law = (sec) => cite(sec, pn.law_url);
	const c5620 = pn.cases.find((x) => x.key === '5620_24') || { url: pn.law_url };
	const n = pn.routes.notary;
	const withVat = Math.round(n.fee * (1 + pn.vat.pct / 100));
	const rows = [
		['צורה', 'בכתב בלבד', law('סעיף 1')],
		['תוקף', 'רק באישור בית המשפט לענייני משפחה או בית הדין הרבני, אחרי שבדקו שהבנתם והסכמתם בחופשיות', law('סעיף 2(א)-(ב)')],
		['לפני החתונה', 'גם נוטריון או רושם הנישואין יכולים לאמת', law('סעיף 2(ג)-(ג1)')],
		['אחרי החתונה', 'רק בית המשפט או בית הדין; נוטריון ורושם לא', law('סעיף 2(א)') + cite('נוהל רישום נישואין, סעיף 89(ו)', pn.procedure.url)],
		['עלות אצל נוטריון', `${money(n.fee, 0)} ש"ח ועוד מע"מ ${pn.vat.pct}% (${money(withVat, 0)} ש"ח), ועוד ${money(n.fee_copy, 0)} ש"ח לכל עותק נוסף`, cite(`${n.fee_item} ו-${n.fee_copy_item}`, n.fee_url)],
		['אגרת בית המשפט', `${money(pn.routes.court.fee, 0)} ש"ח`, cite(pn.routes.court.fee_item, pn.routes.court.fee_url)],
		['אגרת בית הדין הרבני', `${money(pn.routes.rabbinical.fee, 0)} ש"ח`, cite(pn.routes.rabbinical.fee_item, pn.routes.rabbinical.fee_url)],
		['מה שלא נקבע בהסכם', 'חל עליו הסדר איזון המשאבים שבחוק', law('סעיף 3(א)')],
		['מזונות ילדים ומשמורת', 'הסכם ממון לא קובע אותם; הסכם על מזונות ילד לא קושר את הילד בלי אישור', cite('חוק המזונות, סעיף 12(א)', pn.maint_law.url)],
		['ידועים בציבור', 'חוק יחסי ממון חל רק על נשואים; ההסכם ביניכם הוא חוזה', cite('בע"מ 5620/24, פסקה 20', c5620.url)],
		['הסכם שלא אושר', 'עשוי לחייב אם נהגתם לפיו, אבל לא כדאי לסמוך על זה', cite('בע"מ 5620/24, פסקה 28', c5620.url)],
	];
	return `<div class="jtool-page"><div class="jtool-datawrap"><table class="jtool-datatable"><caption>הסכם ממון: הכללים והעלויות, כל שורה עם המקור</caption><thead><tr><th scope="col">מה</th><th scope="col">הכלל</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map(([a, b, x]) => `<tr><td data-th="מה">${esc(a)}</td><td data-th="הכלל">${esc(b)}</td><td data-th="מקור">${x}</td></tr>`).join('')
		+ `</tbody></table></div><p class="jtool-updated">נבדק מול החוק והתקנות בנבו ומול נוהל רישום הנישואין ב-${esc(isoToHe(pn.checked_on))}.</p></div>`;
}

/** The figure in the sticky bar. */
export function stickyFigure(d) { return d.ok && d.cost.known ? ils(d.cost.total) : '—'; }

export function snapshot(reg) {
	const d = draftMamon(reg, EXAMPLE);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: d.cost.known ? d.cost.total : 0,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, d, { example: true }),
		details: renderDetails(reg, d),
		method: `<ol><li>בחירת השלב: לפני הנישואין, אחריהם או ידועים בציבור. השלב קובע מי יכול לאשר${cite('סעיף 2', reg.prenup.law_url)}</li><li>בחירת ההסדר: הפרדה מלאה, איזון עם חריגים או הסכם מדורג; מה שלא נקבע בהסכם, חל עליו החוק${cite('סעיף 3(א)', reg.prenup.law_url)}</li><li>סעיפים לדירה, לפנסיה, לעסק, לירושות ולחובות, ונספחי גילוי לכל צד</li><li>סעיף שאומר שההסכם לא קובע מזונות ילדים או משמורת${cite('סעיף 12(א) לחוק המזונות', reg.prenup.maint_law.url)}</li><li>תנאי התוקף: האימות או האישור שבחרתם, והעלות הרשמית שלו</li></ol>`,
		compare_table: compareTable(reg),
		numbers: numbersTable(reg),
		sticky: stickyFigure(d),
		sentence: verdictSentence(reg, d),
	};
}

/* ---------------- Browser ---------------- */

function readModel(root) {
	const val = (id) => ((root.querySelector(`#${P}-${id}`) || {}).value || '').trim();
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const rows = (side) => [...root.querySelectorAll(`[data-assets="${side}"] [data-asset]`)].map((li) => {
		const i = li.getAttribute('data-asset').split('-')[1];
		const v = val(`${side}-v-${i}`);
		return { label: val(`${side}-l-${i}`), value: v === '' ? '' : parseMoney(v) };
	});
	const num = (id) => { const v = val(id); return v === '' ? '' : Number(v.replace('%', '')); };
	const wd = val('wd');
	return {
		timing: checked('t') || 'before', route: checked('r') || '', regime: checked('g') || 'separate', home: checked('h') || 'none',
		homeAddress: val('addr'), residenceMonths: num('res'), gradePct: num('gp'), gradeCap: num('gc'),
		pension: checked('pe') || 'law', business: checked('b') || 'none', businessGrowth: checked('bg') || 'separate',
		fruits: on('fr'), jointAccount: on('ja'), second: on('sc'), household: checked('hh') || 'equal',
		names: { a: val('na'), b: val('nb') }, wedding: wd === '' ? '' : (parseDate(wd) || wd), copies: val('cp') === '' ? 1 : num('cp'),
		assetsA: rows('a'), assetsB: rows('b'),
	};
}

/* The share link carries the choices only: no names, no address, no asset lines. */
const stateOf = (m) => encodeState({
	t: m.timing, r: m.route, g: m.regime, h: m.home, p: m.pension, b: m.business, w: m.businessGrowth,
	f: m.fruits ? 1 : 0, j: m.jointAccount ? 1 : 0, s: m.second ? 1 : 0, o: m.household,
	n: [[m.gradePct || 0, m.gradeCap || 0], [m.residenceMonths || 0, m.copies || 1]],
});
const KEYS = ['t', 'r', 'g', 'h', 'p', 'b', 'w', 'f', 'j', 's', 'o', 'n'];
function modelOf(s) {
	if (!s.t || !s.g) { return null; }
	const n = String(s.n || '').split('~').map((x) => x.split('_').map(Number));
	return Object.assign({}, EXAMPLE, {
		timing: s.t, route: s.r || '', regime: s.g, home: s.h || 'none', pension: s.p || 'law', business: s.b || 'none', businessGrowth: s.w || 'separate',
		fruits: s.f !== '0', jointAccount: s.j === '1', second: s.s === '1', household: s.o || 'equal',
		gradePct: (n[0] && n[0][0]) || '', gradeCap: (n[0] && n[0][1]) || '', residenceMonths: n[1] ? n[1][0] : 0, copies: (n[1] && n[1][1]) || 1,
		names: { a: '', b: '' }, assetsA: [], assetsB: [],
	});
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const pn = reg.prenup;
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	let last = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(pn.checked_on, pn.refresh_every_days) || (pn.next_update && ilToday() >= pn.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהתעריפים התעדכנו'); }
	}
	const showErrors = (d) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		if (d.ok) { return; }
		for (const e of d.errors) { const box = root.querySelector(`#${P}-${e.field}-e`); if (box) { box.textContent = e.he; } }
	};
	const sync = (rerender) => {
		const m = readModel(root);
		if (rerender) {
			// The routes the law allows depend on the stage: rebuild the form, keep what was typed.
			form.innerHTML = renderForm(reg, m);
			return readModel(root);
		}
		const owned = m.home === 'a' || m.home === 'b';
		form.querySelectorAll('[data-if-owned]').forEach((el) => { el.hidden = !owned; });
		form.querySelectorAll('[data-if-graded]').forEach((el) => { el.hidden = !(owned && m.regime === 'graded'); });
		form.querySelectorAll('[data-if-business]').forEach((el) => { el.hidden = m.business === 'none'; });
		form.querySelectorAll('[data-if-joint]').forEach((el) => { el.hidden = !m.jointAccount; });
		return m;
	};
	const run = (m, opts = {}) => {
		const d = draftMamon(reg, m);
		last = d;
		showErrors(d);
		result.innerHTML = renderResult(reg, d);
		details.innerHTML = renderDetails(reg, d);
		if (sticky) { sticky.innerHTML = stickyFigure(d); }
		if (d.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: `${d.timing}-${d.route}` }); }
		return d;
	};
	const schedule = (ev) => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		const rerender = ev && ev.target && ev.target.name === `${P}-t`;
		const m = sync(rerender);
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(rerender ? m : readModel(root)); }, 160);
	};
	const fromHash = modelOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	} else {
		last = draftMamon(reg, readModel(root));
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const add = ev.target.closest('[data-add-asset]');
		const rm = ev.target.closest('[data-remove-asset]');
		if (add || rm) {
			const m = readModel(root);
			if (add) { (add.getAttribute('data-add-asset') === 'a' ? m.assetsA : m.assetsB).push({ label: '', value: '' }); }
			if (rm) { const [side, i] = rm.getAttribute('data-remove-asset').split('-'); (side === 'a' ? m.assetsA : m.assetsB).splice(Number(i), 1); }
			form.innerHTML = renderForm(reg, m);
			form.querySelectorAll('details').forEach((dd) => { if (dd.querySelector('[data-assets]')) { dd.open = true; } });
			run(m);
			return;
		}
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		const m = readModel(root);
		const d = run(m, { silent: true });
		const link = shareUrl(stateOf(m));
		if (act === 'copydoc' && d.ok) {
			const ok = await copyText(`${d.text}\n\nטיוטה שנבנתה ב-jus-tice.co.il לפי חוק יחסי ממון בין בני זוג (${isoToHe(pn.checked_on)}). זו טיוטה כללית, לא ייעוץ משפטי; לפני חתימה, עורך דין צריך לעבור עליה.`);
			toast(root, ok ? 'הטיוטה הועתקה. הדביקו אותה במסמך ועברו עליה עם עורך דין.' : 'לא הצלחנו להעתיק. אפשר לסמן את הטקסט ולהעתיק ידנית.');
			track('tool_download', { tool_id: TOOL_ID, type: 'copy-draft' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק הבחירות שלכם, בלי שמות ובלי נכסים.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && d.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, d)} ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && d.ok) {
			const ok = await copyText(verdictSentence(reg, d));
			toast(root, ok ? 'הסיכום הועתק.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: d.ok ? d.timing : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(m));
			toast(root, 'הבחירות נשמרו במכשיר הזה בלבד (בלי שמות ונכסים).');
		} else if (act === 'restore') {
			const s = modelOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, s); run(s); }
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
