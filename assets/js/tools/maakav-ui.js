/**
 * Divorce-world UI: the child-support payment tracker (HAD-539).
 * One picture from the subject: a ledger, one bar per month, the paid part in navy and the open part hatched in the
 * instrument's danger red, so a missed month is visible before any number is read. The log lives in this browser
 * only (localStorage), with export and import as a file; there is no share link and no WhatsApp button here on purpose.
 */
import { mkTrack, mkLetter, mkExport, mkImport, MK_EVERY } from './maakav-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe,
	track, download, copyText, toast, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'maakav-mezonot';
const P = 'jt21';
export const EXAMPLE = {
	amount: 3000, base: '2024-01-10', first: '2026-01-10', every: 12, asOf: '2026-10-14',
	payments: [{ date: '2026-01-12', amount: 3000, note: '' }, { date: '2026-02-10', amount: 3000, note: '' }, { date: '2026-03-11', amount: 1500, note: 'חלקי' }],
	meta: { creditor: '', debtor: '', file: '' },
};
const MK_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const v0 = (x) => (x === '' || x === undefined || x === null ? '' : x);

function mkToIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
function moneyField(id, label, v, hint = '') {
	return `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v0(v) === '' ? '' : money(v, 0))}" placeholder="0" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>${hint ? `<p class="jtool-hint">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}
function dateField(id, label, v, placeholder) {
	return `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="${esc(placeholder)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, m) {
	const cs = reg.child_support;
	const row = (p, i) => `<li class="jtool-rep__row jt21-pay" data-pay="${i}"><div class="jtool-field"><label class="jtool-label" for="${P}-pd-${i}">תאריך</label><input id="${P}-pd-${i}" type="text" inputmode="numeric" autocomplete="off" value="${esc(p && p.date ? isoToHe(p.date) : '')}" placeholder="10.1.2026"></div><div class="jtool-field"><label class="jtool-label" for="${P}-pa-${i}">סכום</label><div class="jtool-input jtool-input--money"><input id="${P}-pa-${i}" type="text" inputmode="decimal" autocomplete="off" value="${esc(p && v0(p.amount) !== '' ? money(p.amount, 0) : '')}" placeholder="0"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div></div><button class="jtool-iconbtn" type="button" data-remove-pay="${i}" aria-label="מחיקת תשלום ${i + 1}">✕</button><p class="jtool-error jt21-pay__e" id="${P}-payment-${i}-e" role="alert"></p></li>`;
	return `<div class="jtool-row">${moneyField('am', 'המזונות לחודש בפסק הדין או בהסכם', m.amount)}${dateField('base', 'תאריך פסק הדין או ההסכם (הבסיס להצמדה)', m.base, 'לדוגמה: 10.1.2024')}</div>`
		+ `<div class="jtool-row">${dateField('first', 'התשלום הראשון שבמעקב', m.first, 'לדוגמה: 10.1.2026')}<fieldset class="jtool-field"><legend>הצמדה למדד: עדכון כל</legend><div class="jtool-chips">${MK_EVERY.map((e) => chip('ev', String(e), e ? `${e} חודשים` : 'בלי הצמדה', Number(m.every) === e)).join('')}</div></fieldset></div>`
		+ `<p class="jtool-hint">${esc(cs.indexation.he.split(';')[0])}. יום התשלום בחודש נלקח מהתשלום הראשון.</p>`
		+ `<div class="jtool-field"><span class="jtool-label" id="${P}-pays-l">מה שולם בפועל</span><ul class="jtool-rep" aria-labelledby="${P}-pays-l" data-pays>${(m.payments || []).map(row).join('')}</ul><button class="jtool-linkbtn" type="button" data-add-pay>+ עוד תשלום</button></div>`
		+ `<details class="jtool-more"><summary>שמות ומספר תיק, למכתב הדרישה בלבד</summary><div class="jtool-row" style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${P}-cr">שם הזוכה (מי שמקבל)</label><input id="${P}-cr" type="text" autocomplete="off" value="${esc((m.meta && m.meta.creditor) || '')}"></div><div class="jtool-field"><label class="jtool-label" for="${P}-db">שם החייב (מי שמשלם)</label><input id="${P}-db" type="text" autocomplete="off" value="${esc((m.meta && m.meta.debtor) || '')}"></div></div><div class="jtool-field"><label class="jtool-label" for="${P}-fl">בית המשפט או בית הדין ומספר התיק</label><input id="${P}-fl" type="text" autocomplete="off" value="${esc((m.meta && m.meta.file) || '')}"></div><p class="jtool-hint">השמות נכנסים רק לטקסט המכתב ולא נשמרים בקובץ הייצוא.</p></details>`
		+ `<p class="jtool-hint jt21-privacy"><strong>פרטיות:</strong> הרישום נשמר בדפדפן שלכם בלבד (localStorage) ולא נשלח אלינו ולא לאף אחד. אפשר לייצא לקובץ, לייבא אותו במכשיר אחר, ולמחוק בכל רגע.</p>`;
}

/** The ledger: one bar per instalment, paid in navy, open hatched. */
export function ledger(r) {
	const max = Math.max(...r.rows.map((x) => x.amount), 1);
	const bars = r.rows.map((x) => {
		const [y, mm] = x.due.split('-').map(Number);
		const paidW = Math.round((x.paid / max) * 100);
		const openW = Math.round((x.open / max) * 100);
		const state = !x.late ? 'מועד עתידי' : x.open > 0 ? (x.paid > 0 ? 'שולם חלקית' : 'לא שולם') : 'שולם';
		return `<div class="jt21-bar${x.open > 0 && x.late ? ' jt21-bar--open' : ''}" role="img" aria-label="${esc(MK_MONTHS[mm - 1])} ${y}: ${esc(state)}, מגיע ${esc(nis(x.amount))}, שולם ${esc(nis(x.paid))}"><span class="jt21-bar__m">${esc(MK_MONTHS[mm - 1].slice(0, 3))} <bdi>${String(y).slice(2)}</bdi></span><span class="jt21-bar__track"><i class="jt21-bar__paid" style="width:${paidW}%"></i><b class="jt21-bar__open" style="width:${openW}%"></b></span><span class="jt21-bar__v">${x.open > 0 ? ils(x.open, 0) : '✓'}</span></div>`;
	}).join('');
	return `<figure class="jt21-ledger"><p class="jt21-ledger__h">חודש אחרי חודש: מה שולם ומה פתוח</p>${bars}<figcaption><span><i class="jt21-k jt21-k--paid"></i>שולם</span> <span><i class="jt21-k jt21-k--open"></i>פתוח</span></figcaption></figure>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const t = r.totals;
	if (!(t.open > 0)) { return `כל ${r.rows.length} התשלומים עד ${isoToHe(r.asOf)} שולמו במלואם${t.credit > 0 ? `, ויש יתרת זכות של ${nis(t.credit)}` : ''}. הסכום החודשי היום: ${nis(r.current)}${r.next ? `; העדכון הבא למדד ב-${isoToHe(r.next)}` : ''}.`; }
	return `${t.openCount} תשלומים פתוחים מתוך ${r.rows.length} עד ${isoToHe(r.asOf)}: קרן ${nis(t.open)}, הפרשי הצמדה ${nis(t.linkage)} וריבית ${nis(t.interest)}, סך הכול ${nis(t.total)}. הסכום החודשי היום: ${nis(r.current)}${r.next ? `; העדכון הבא למדד ב-${isoToHe(r.next)}` : ''}.`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const open = r.totals.open > 0;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state ${open ? 'jtool-state--warn' : 'jtool-state--ok'}">${open ? '! יש פיגור בתשלומים' : '✓ אין פיגור'}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה: ' : ''}${open ? `החוב ליום ${isoToHe(r.asOf)}, כולל הצמדה וריבית` : 'שולם עד היום'}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(open ? r.totals.total : r.totals.paid, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ (open ? `<div class="jtool-actions" style="margin-top:12px"><button class="jtool-btn jtool-btn--primary" type="button" data-act="copyletter">העתקת מכתב הדרישה</button></div>` : '')
		+ `</div>`
		+ ledger(r)
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '');
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const cs = reg.child_support;
	const law = reg.interest;
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-rows-h">התשלומים, שורה אחרי שורה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-rows-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מועד</th><th scope="col">מגיע</th><th scope="col">עדכון למדד</th><th scope="col">שולם</th><th scope="col">פתוח</th><th scope="col">הצמדה</th><th scope="col">ריבית</th><th scope="col">לתשלום היום</th></tr></thead><tbody>`
		+ r.rows.map((x) => `<tr${!x.late ? ' class="jtool-muted"' : ''}><td data-th="מועד"><bdi>${isoToHe(x.due)}</bdi></td><td data-th="מגיע">${ils(x.amount)}</td><td data-th="עדכון למדד">${x.update ? `<bdi>${isoToHe(x.update)}</bdi> (×<bdi>${x.factor}</bdi>)` : '—'}</td><td data-th="שולם">${ils(x.paid)}</td><td data-th="פתוח"${x.open > 0 ? ' class="jtool-neg"' : ''}>${ils(x.open)}</td><td data-th="הצמדה">${ils(x.linkage)}</td><td data-th="ריבית">${ils(x.interest)}</td><td data-th="לתשלום היום">${x.open > 0 ? ils(x.total) : '—'}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="מועד">סך הכול</td><td data-th="מגיע">${ils(r.totals.due)}</td><td data-th="עדכון למדד">—</td><td data-th="שולם">${ils(r.totals.paid)}</td><td data-th="פתוח">${ils(r.totals.open)}</td><td data-th="הצמדה">${ils(r.totals.linkage)}</td><td data-th="ריבית">${ils(r.totals.interest)}</td><td data-th="לתשלום היום">${ils(r.totals.total)}</td></tr></tbody>`
		+ `<caption>הצמדה וריבית צמודה מיום הפירעון של כל תשלום, לפי סעיפים 1 ו-4א ל${esc(law.law_he)}; דמי פיגורים (סעיף 5א) ואגרות הוצאה לפועל נוספים בתיק ההוצאה לפועל, לא כאן. תשלום מכסה קודם את התשלום הישן ביותר שנותר פתוח.</caption></table></div></div>`;
	if (r.totals.open > 0) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-letter-h">מכתב דרישה, מוכן להעתקה</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copyletter">העתקה</button><button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button></div></div><pre class="jtool-letter" role="region" aria-labelledby="${P}-letter-h" tabindex="0">${esc(mkLetter(reg, r))}</pre></div>`;
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-next-h">מה עושים כשלא משלמים</h3></div><ol class="jtool-steps">`
		+ `<li>מכתב דרישה (למעלה), עם פירוט התשלומים והסכום ליום המכתב.</li>`
		+ `<li>פתיחת תיק מזונות בלשכת ההוצאה לפועל: במסלול מזונות הלשכה גובה בעצמה, בלי עורך דין. ${esc(cs.indexation.form_he)}.</li>`
		+ `<li>${esc(cs.nii.he)}: המוסד לביטוח לאומי משלם במקום החייב את הנמוך מבין פסק הדין לסכום שבתקנות, וגובה ממנו. <a href="${esc(cs.nii.url)}" target="_blank" rel="noopener">הסכומים באתר הביטוח הלאומי</a>.</li>`
		+ `<li>${esc(cs.deadlines.late_he)}.</li></ol></div>`
		+ `<div class="jtool-tablewrap jt21-store"><div class="jtool-tablewrap__head"><h3>הרישום במכשיר הזה</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="export">ייצוא לקובץ (JSON)</button><label class="jtool-btn jt21-import">ייבוא מקובץ<input type="file" accept="application/json,.json" data-import hidden></label><button class="jtool-btn" type="button" data-act="clear">מחיקה מהמכשיר</button></div></div><p class="jt12-doc__note">נשמר אוטומטית בדפדפן הזה בכל שינוי. שום דבר לא נשלח אלינו. קובץ הייצוא מכיל את ההגדרות והתשלומים בלבד, בלי שמות.</p></div>`;
	return out;
}

/** Page section: the next updates of the example amount, from the CPI series. */
export function numbersTable(reg, r) {
	const rows = r.rows.filter((x) => x.update).reduce((acc, x) => { if (!acc.some((y) => y.update === x.update)) { acc.push(x); } return acc; }, []);
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הצמדה למדד של ${esc(nis(r.amount))} מיום ${esc(isoToHe(r.base))}, כל ${r.every} חודשים, לפי המדד הידוע ביום העדכון (הלמ"ס)</caption><thead><tr><th scope="col">יום העדכון</th><th scope="col">מקדם</th><th scope="col">הסכום המעודכן</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="יום העדכון"><bdi>${isoToHe(x.update)}</bdi></td><td data-th="מקדם"><bdi>${x.factor}</bdi></td><td data-th="הסכום המעודכן">${ils(x.amount)}</td></tr>`).join('')
		+ (r.next ? `<tr><td data-th="יום העדכון"><bdi>${isoToHe(r.next)}</bdi> (הבא)</td><td data-th="מקדם">לפי המדד שיהיה ידוע</td><td data-th="הסכום המעודכן">—</td></tr>` : '')
		+ `</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = mkTrack(reg, EXAMPLE);
	const first = r.rows[0];
	const third = r.rows[2];
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.totals.total,
		sticky: ils(r.totals.total, 0),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>הסכום בפסק הדין: ${esc(nis(r.amount))} מיום ${isoToHe(r.base)}, צמוד למדד כל ${r.every} חודשים: ביום ${isoToHe(first.update)} הוא מתעדכן למדד הידוע באותו יום חלקי המדד הידוע ביום פסק הדין, ×${first.factor}, כלומר ${esc(nis(first.amount))}.</li>`
			+ `<li>התשלומים שנרשמו מכסים קודם את הישן ביותר: ${isoToHe(first.due)} ו-${isoToHe(r.rows[1].due)} שולמו במלואם, ב-${isoToHe(third.due)} שולמו ${esc(nis(third.paid))} ונותרו ${esc(nis(third.open))}, ואחריו ${r.totals.openCount - 1} תשלומים שלא שולמו כלל.</li>`
			+ `<li>על כל יתרה פתוחה נוספים הפרשי הצמדה וריבית צמודה מיום הפירעון עד ${isoToHe(r.asOf)} (סעיפים 1 ו-4א לחוק פסיקת ריבית והצמדה): ${esc(nis(r.totals.linkage))} ו-${esc(nis(r.totals.interest))}.</li>`
			+ `<li>סך הכול לתשלום היום: ${esc(nis(r.totals.total))}. הסכום החודשי היום: ${esc(nis(r.current))}; העדכון הבא ב-${isoToHe(r.next)}.</li></ol>`,
		compare_table: numbersTable(reg, r),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root, asOf) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const payments = [...root.querySelectorAll('[data-pay]')].map((li) => {
		const i = li.getAttribute('data-pay');
		const d = val(`#${P}-pd-${i}`).trim();
		const a = val(`#${P}-pa-${i}`).trim();
		return { date: d ? mkToIso(d) : '', amount: a === '' ? '' : parseMoney(a), note: '' };
	});
	return {
		amount: m('am'), base: mkToIso(val(`#${P}-base`)), first: mkToIso(val(`#${P}-first`)),
		every: Number((root.querySelector(`input[name="${P}-ev"]:checked`) || {}).value || 3),
		asOf, payments,
		meta: { creditor: val(`#${P}-cr`), debtor: val(`#${P}-db`), file: val(`#${P}-fl`) },
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const cs = reg.child_support;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	// No share link and no WhatsApp for a payment log: nothing about a person's money leaves this browser.
	root.querySelectorAll('[data-act="link"], [data-act="whatsapp"], [data-act="save"], [data-act="restore"]').forEach((b) => b.remove());
	root.querySelectorAll('[data-jtool-shared], [data-jtool-saved]').forEach((n) => n.remove());
	if (isStale(cs.checked_on, cs.refresh_every_days)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהמדד או הריבית התעדכנו'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const ids = { amount: 'am', base: 'base', first: 'first' };
		for (const e of r.errors) {
			const id = ids[e.field] || e.field;
			const box = root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const persist = (input) => { store.set(saveKey, mkExport(input)); };
	const run = (input, opts = {}) => {
		const r = mkTrack(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.totals.open > 0 ? r.totals.total : 0, 0) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.totals.open > 0 ? 'arrears' : 'paid' }); }
		if (!opts.noSave) { persist(input); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root, today)); }, 200);
	};
	const load = (m) => { form.innerHTML = renderForm(reg, Object.assign({ meta: {} }, m)); run(Object.assign({ asOf: today, meta: {} }, m), { silent: true, noSave: true }); };
	const saved = mkImport(store.get(saveKey) || '');
	if (saved) { load(saved); toast(root, 'נטען הרישום השמור במכשיר הזה.'); } else {
		// The live page runs the example as of today, not as of the registry's day.
		run(Object.assign({}, EXAMPLE, { asOf: today }), { silent: true, noSave: true });
	}
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('change', (ev) => {
		const inp = ev.target.closest('[data-import]');
		if (!inp || !inp.files || !inp.files[0]) { return; }
		const reader = new FileReader();
		reader.onload = () => {
			const m = mkImport(reader.result);
			if (!m) { toast(root, 'הקובץ אינו קובץ ייצוא של הכלי הזה.'); return; }
			load(m); persist(Object.assign({ asOf: today, meta: {} }, m)); toast(root, 'הרישום יובא ונשמר במכשיר הזה.');
		};
		reader.readAsText(inp.files[0]);
	});
	root.addEventListener('click', async (ev) => {
		const add = ev.target.closest('[data-add-pay]');
		if (add) {
			const list = form.querySelector('[data-pays]');
			const i = list.querySelectorAll('[data-pay]').length;
			list.insertAdjacentHTML('beforeend', `<li class="jtool-rep__row jt21-pay" data-pay="${i}"><div class="jtool-field"><label class="jtool-label" for="${P}-pd-${i}">תאריך</label><input id="${P}-pd-${i}" type="text" inputmode="numeric" autocomplete="off" value="" placeholder="10.1.2026"></div><div class="jtool-field"><label class="jtool-label" for="${P}-pa-${i}">סכום</label><div class="jtool-input jtool-input--money"><input id="${P}-pa-${i}" type="text" inputmode="decimal" autocomplete="off" value="" placeholder="0"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div></div><button class="jtool-iconbtn" type="button" data-remove-pay="${i}" aria-label="מחיקת תשלום ${i + 1}">✕</button><p class="jtool-error jt21-pay__e" id="${P}-payment-${i}-e" role="alert"></p></li>`);
			const f = form.querySelector(`#${P}-pd-${i}`);
			if (f) { f.focus(); }
			return;
		}
		const rm = ev.target.closest('[data-remove-pay]');
		if (rm) {
			const li = rm.closest('[data-pay]');
			if (li) { li.remove(); }
			// Re-number so the engine's error fields match the rows on screen.
			[...form.querySelectorAll('[data-pay]')].forEach((row, i) => { row.setAttribute('data-pay', String(i)); row.querySelectorAll('input').forEach((f) => { f.id = f.id.replace(/-(pd|pa)-\d+$/, `-$1-${i}`); }); row.querySelectorAll('label').forEach((l) => { l.htmlFor = l.htmlFor.replace(/-(pd|pa)-\d+$/, `-$1-${i}`); }); const e = row.querySelector('.jt21-pay__e'); if (e) { e.id = `${P}-payment-${i}-e`; } rm.setAttribute('data-remove-pay', String(i)); });
			schedule();
			return;
		}
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		const input = readForm(root, today);
		const r = run(input, { silent: true });
		if (act === 'copyletter' && r.ok) {
			const ok = await copyText(mkLetter(reg, r));
			toast(root, ok ? 'מכתב הדרישה הועתק.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il)`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'export') {
			download('mezonot-maakav.json', 'application/json;charset=utf-8', mkExport(input));
			track('tool_download', { tool_id: TOOL_ID, type: 'json' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'clear') {
			store.clear(saveKey);
			load(Object.assign({}, EXAMPLE, { payments: [] }));
			toast(root, 'הרישום נמחק מהמכשיר הזה.');
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? (r.totals.open > 0 ? 'arrears' : 'paid') : 'error' });
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
