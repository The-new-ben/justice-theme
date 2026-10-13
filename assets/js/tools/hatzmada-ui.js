/**
 * T04 UI: the instrument for CPI linkage and the Interest Adjudication Law (HAD-485).
 * Board: https://claude.ai/artifact/JHKhphmy9L1QbYYUk2KX4e (T04-desktop, T04-360).
 *
 * renderForm / renderResult / renderDetails are pure (string in, string out), so the same code
 * writes the server snapshot (tools/build-justice-tools-snapshots.mjs) and the live page.
 */
import { compute, heMonth } from './hatzmada-engine.js';
import {
	esc, ils, num, pct, money, amount, parseMoney, isoToHe, encodeState, decodeState, decodeList, csv,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'hatzmada';
const P = 'jt4';

export const EXAMPLE = {
	principal: 40000, start: '2025-03-01', end: '2026-10-01', mode: 'linked', rule: 'known', due: '',
	payments: [{ date: '2025-09-01', amount: 10000 }, { date: '2026-03-01', amount: 5000 }],
};

const MODES = {
	link: { label: 'הצמדה בלבד', sec: 'סעיף 2(א)(1)' },
	linked: { label: 'הצמדה וריבית צמודה', sec: 'סעיף 2(א)(2)' },
	shekel: { label: 'ריבית שקלית', sec: 'סעיף 2(א)' },
};
const SHORT = ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'];
const shortMonth = (key) => { const [y, m] = key.split('-').map(Number); return `${SHORT[m - 1]} ${String(y).slice(2)}`; };

function cite(reg, text, href) {
	const url = href || reg.interest.law_url;
	return ` <a class="jtool-cite" href="${esc(url)}" target="_blank" rel="noopener">${esc(text)}</a>`;
}

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += y >= 70 ? 1900 : 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(input) {
	const chip = (name, value, label, checked) => `<label class="jtool-chip"><input type="radio" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const pay = (p, i) => `<li class="jtool-rep__row" data-row="${i}">`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-pd-${i}">תאריך התשלום</label><input id="${P}-pd-${i}" type="text" inputmode="numeric" autocomplete="off" data-pay-date value="${esc(isoToHe(p.date))}" placeholder="לדוגמה: 1.9.2025"></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-pa-${i}">סכום</label><div class="jtool-input jtool-input--money"><input id="${P}-pa-${i}" type="text" inputmode="decimal" autocomplete="off" data-pay-amount value="${esc(p.amount ? money(p.amount, 0) : '')}" placeholder="לדוגמה: 5,000"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div></div>`
		+ `<button class="jtool-iconbtn" type="button" data-remove="${i}" aria-label="מחיקת תשלום ${i + 1}">✕</button></li>`;
	return `<fieldset class="jtool-field"><legend>מה מוסיפים לסכום</legend><div class="jtool-chips">`
		+ chip('mode', 'link', MODES.link.label, input.mode === 'link')
		+ chip('mode', 'linked', MODES.linked.label, input.mode === 'linked')
		+ chip('mode', 'shekel', MODES.shekel.label, input.mode === 'shekel')
		+ `</div><p class="jtool-hint">פסק הדין קובע מה מוסיפים. "ריבית והצמדה" בלי פירוט נחשבת ריבית שקלית (סעיף 2(ד)).</p></fieldset>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-amt">הסכום שנפסק או החוב</label><div class="jtool-input jtool-input--money"><input id="${P}-amt" name="amount" type="text" inputmode="decimal" autocomplete="off" value="${esc(money(input.principal, input.principal % 1 ? 2 : 0))}" aria-describedby="${P}-amt-h ${P}-amt-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-hint" id="${P}-amt-h">לדוגמה: 12,000. בלי ריבית והפרשי הצמדה.</p><p class="jtool-error" id="${P}-amt-e" role="alert"></p></div>`
		+ `<div class="jtool-row">`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-from">מתאריך</label><input id="${P}-from" name="start" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.start))}" aria-describedby="${P}-from-h ${P}-from-e"><p class="jtool-hint" id="${P}-from-h">בדרך כלל יום הגשת התביעה (סעיף 2(ב))</p><p class="jtool-error" id="${P}-from-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-to">עד תאריך</label><input id="${P}-to" name="end" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.end))}" aria-describedby="${P}-to-h ${P}-to-e"><p class="jtool-hint" id="${P}-to-h">יום התשלום. <button class="jtool-linkbtn" type="button" data-today style="min-height:0;padding:0">היום</button></p><p class="jtool-error" id="${P}-to-e" role="alert"></p></div>`
		+ `</div>`
		+ `<div class="jtool-field"><span class="jtool-label" id="${P}-pays-l">תשלומים חלקיים</span><ul class="jtool-rep" aria-labelledby="${P}-pays-l" data-payments>${input.payments.map(pay).join('')}</ul>`
		+ `<button class="jtool-linkbtn" type="button" data-add>+ עוד תשלום</button><p class="jtool-error" id="${P}-pays-e" role="alert"></p></div>`
		+ `<details class="jtool-more"${input.rule === 'month' || input.due ? ' open' : ''}><summary>אפשרויות מתקדמות</summary>`
		+ `<fieldset class="jtool-field" style="margin-top:8px"><legend>איזה מדד</legend><div class="jtool-chips">${chip('rule', 'known', 'המדד הידוע (לפי החוק)', input.rule !== 'month')}${chip('rule', 'month', 'מדד החודש (בחוזים)', input.rule === 'month')}</div>`
		+ `<p class="jtool-hint">החוק מצמיד לפי המדד הידוע ביום העדכון (סעיף 1). חוזים רבים מצמידים למדד של החודש עצמו.</p></fieldset>`
		+ `<div class="jtool-field" style="margin-top:8px"><label class="jtool-label" for="${P}-due">מועד הפירעון, אם חלף</label><input id="${P}-due" name="due" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.due))}" placeholder="לדוגמה: 1.6.2026" aria-describedby="${P}-due-h ${P}-due-e"><p class="jtool-hint" id="${P}-due-h">מהיום הזה נוספות ריבית שקלית ודמי פיגורים (סעיפים 5 ו-5א). בלי מועד שנקבע: 30 ימים מההחלטה (סעיף 1).</p><p class="jtool-error" id="${P}-due-e" role="alert"></p></div>`
		+ `</details>`;
}

export function pathLines(reg, r, input) {
	const lines = [];
	const law = reg.interest;
	const startHe = isoToHe(r.start);
	const endHe = isoToHe(r.end);
	lines.push(`קרן: ${ils(r.principal)} מ-<bdi>${startHe}</bdi>. התקופה מתחילה ביום הגשת התביעה, אלא אם בית המשפט קבע מועד אחר${cite(reg, 'סעיף 2(ב)')}`);
	if (r.mode !== 'shekel' || r.arrearsFrom) {
		lines.push(`מדד יסודי: ${esc(heMonth(r.index.from.month))}, <bdi>${r.index.from.value}</bdi> נקודות בבסיס ממוצע ${esc(r.index.from.base)}. זה ${r.rule === 'month' ? 'מדד החודש' : 'המדד הידוע'} ב-<bdi>${startHe}</bdi>${cite(reg, 'סעיף 1')}`);
		lines.push(`מדד חדש: ${esc(heMonth(r.index.to.month))}, <bdi>${r.index.to.value}</bdi> נקודות בבסיס ממוצע ${esc(r.index.to.base)}${r.index.chain !== 1 ? `, עם מקדם קישור בין הבסיסים של <bdi>${Math.round(r.index.chain * 1e6) / 1e6}</bdi> כמו בלמ"ס` : ''}. שינוי של ${pct(r.index.changePct)}${cite(reg, 'סעיף 1')}`);
		lines.push(`הפרשי הצמדה: בכל תקופה, היתרה כפול המדד החדש חלקי המדד היסודי. סך הכול ${ils(r.linkage)}${cite(reg, 'סעיף 1, "הפרשי הצמדה"')}`);
	}
	if (r.mode === 'linked') {
		lines.push(`ריבית צמודה: בכל יום, היתרה כפול השיעור השנתי חלקי 365, לפי שיעור הרבעון שפרסם החשב הכללי. סך הכול ${ils(r.interestLinked)}${cite(reg, 'סעיף 4א(א)')}`);
		lines.push(`הריבית מצטרפת לקרן אחת ל-12 חודשים ובמועד הפירעון, ועד אז גם היא צמודה למדד${cite(reg, 'סעיף 4א(ב), (ג)')}`);
	}
	if (r.mode === 'shekel') {
		lines.push(`ריבית שקלית: בכל יום, היתרה כפול השיעור השנתי חלקי 365, בלי הצמדה. מצטרפת לקרן אחת ל-12 חודשים. סך הכול ${ils(r.interest)}${cite(reg, 'סעיף 4א')}`);
	}
	if (r.arrearsFrom) {
		lines.push(`מ-<bdi>${isoToHe(r.arrearsFrom)}</bdi>, תקופת הפיגור: ריבית שקלית על הקרן העדכנית, בלי הפרשי הצמדה${r.mode !== 'shekel' ? `. סך הכול ${ils(r.interestShekel)}` : ''}${cite(reg, 'סעיף 5(1)')}`);
		lines.push(`דמי פיגורים: כל 3 חודשים מתום 3 חודשים מהפירעון, הקרן העדכנית במועד הצירוף האחרון כפול השיעור השנתי חלקי 4. לא מצטרפים לקרן. סך הכול ${ils(r.fees)}${cite(reg, 'סעיף 5א')}`);
	}
	if (r.paid > 0) {
		lines.push(`תשלומים: ${ils(r.paid)} ירדו מהקרן העדכנית ביום ששולמו${cite(reg, 'סעיף 1, "קרן עדכנית"')}`);
	}
	const parts = [money(r.principal)];
	if (r.linkage) { parts.push(`${r.linkage < 0 ? '−' : '+'} ${money(Math.abs(r.linkage))}`); }
	if (r.interest) { parts.push(`+ ${money(r.interest)}`); }
	if (r.fees) { parts.push(`+ ${money(r.fees)}`); }
	if (r.paid) { parts.push(`− ${money(r.paid)}`); }
	lines.push(`יתרה ב-<bdi>${endHe}</bdi>: <bdi>${parts.join(' ')} = ${money(r.total)}</bdi> ₪`);
	return lines;
}

export function verdictSentence(r) {
	const start = isoToHe(r.start);
	const end = isoToHe(r.end);
	const paid = r.paid ? `, אחרי תשלומים של ${amount(r.paid)} ₪,` : '';
	if (r.mode === 'link' && !r.arrearsFrom) {
		return `${amount(r.principal)} ₪ מ-${start}${paid} שווים ב-${end} ${amount(r.total)} ₪, עם הפרשי הצמדה של ${amount(r.linkage)} ₪.`;
	}
	const bits = [];
	if (r.linkage) { bits.push(`הפרשי הצמדה של ${amount(r.linkage)} ₪`); }
	if (r.interest) { bits.push(`${r.mode === 'linked' && !r.arrearsFrom ? 'ריבית צמודה' : 'ריבית'} של ${amount(r.interest)} ₪`); }
	if (r.fees) { bits.push(`דמי פיגורים של ${amount(r.fees)} ₪`); }
	return `חוב של ${amount(r.principal)} ₪ מ-${start}${paid} עומד ב-${end} על ${amount(r.total)} ₪${bits.length ? `: ${bits.join(', ')}` : ''}.`;
}

export function renderResult(reg, r, input, opts = {}) {
	if (!r.ok) {
		const out = r.outOfScope;
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state ${out ? 'jtool-state--info' : 'jtool-state--danger'}">${out ? 'מחוץ לתחום של הכלי' : '✕ צריך לתקן את הקלט'}</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p>`
			+ (out ? `<p class="jtool-scope">לתקופה מוקדמת יותר: <a href="${esc(reg.cpi.official_calculator_url)}" target="_blank" rel="noopener">מחשבון ההצמדה של הלמ"ס</a>.</p>` : '')
			+ `</div>`;
	}
	const warn = r.flags.length > 0;
	const state = warn ? '<p class="jtool-state jtool-state--warn">! שימו לב לפני שמשתמשים בסכום</p>'
		: (r.mode === 'link' && !r.arrearsFrom ? '<p class="jtool-state jtool-state--info">✓ חושב לפי מדד המחירים לצרכן</p>' : '<p class="jtool-state jtool-state--info">✓ חושב לפי החוק בנוסחו מ-1.1.2025</p>');
	const label = opts.example ? `דוגמה מחושבת: היתרה ב-${isoToHe(r.end)}` : `היתרה ב-${isoToHe(r.end)}`;
	const scope = r.mode === 'link'
		? 'הנחנו שאין הסכם אחר בין הצדדים על הצמדה. הצמדה לפי מדד המחירים לצרכן הכללי.'
		: 'הנחנו שאין הסכם בין הצדדים על הצמדה או ריבית (סעיף 6). מועד פירעון שחלף מוסיף ריבית שקלית ודמי פיגורים.';
	const tiles = [`<div><dt>קרן</dt><dd>${ils(r.principal)}</dd></div>`];
	if (r.mode !== 'shekel' || r.linkage) { tiles.push(`<div><dt>הפרשי הצמדה</dt><dd>${ils(r.linkage)}</dd></div>`); }
	if (r.interest) { tiles.push(`<div><dt>${r.mode === 'linked' && !r.arrearsFrom ? 'ריבית צמודה' : 'ריבית'}</dt><dd>${ils(r.interest)}</dd></div>`); }
	if (r.fees) { tiles.push(`<div><dt>דמי פיגורים</dt><dd>${ils(r.fees)}</dd></div>`); }
	if (r.paid) { tiles.push(`<div><dt>שולם</dt><dd>${ils(-r.paid)}</dd></div>`); }
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${esc(label)}</p><strong class="jtool-verdict__figure">${ils(r.total)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(r))}</p>`
		+ (r.overpaid > 0 ? `<p class="jtool-scope">החוב נפרע. שולם ביתר <bdi>${money(r.overpaid)} ₪</bdi>.</p>` : '')
		+ `<p class="jtool-scope">${esc(scope)}</p><dl class="jtool-breakdown">${tiles.join('')}</dl></div>`
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ `<details class="jtool-path" open><summary>איך חישבנו</summary><ol>${pathLines(reg, r, input).map((l) => `<li>${l}</li>`).join('')}</ol></details>`;
}

function eventText(row) {
	const e = [];
	if (row.arrears) { e.push('תחילת הפיגור'); }
	if (row.join) { e.push('צירוף ריבית לקרן'); }
	if (row.payment) { e.push(`תשלום ${money(row.payment)}`); }
	if (row.fee) { e.push(`דמי פיגורים ${money(row.fee)}`); }
	return e.join(' · ');
}

export function tableRows(r) {
	return r.rows.map((row) => ({
		from: isoToHe(row.from), to: isoToHe(row.to), days: row.days, open: row.openTotal,
		index: row.indexFrom ? `${shortMonth(row.indexFrom)} ← ${shortMonth(row.indexTo)}` : '',
		linkage: row.linkage, rate: row.rate, interest: row.interest, event: eventText(row), close: row.closeTotal,
	}));
}

export function renderDetails(reg, r, compareR, compareMode) {
	if (!r.ok) { return ''; }
	const rows = tableRows(r).map((t) => `<tr><td data-th="מתאריך">${t.from}</td><td data-th="עד תאריך">${t.to}</td><td data-th="ימים">${t.days}</td>`
		+ `<td data-th="יתרה בפתיחה">${num(t.open)}</td><td data-th="מדד">${esc(t.index)}</td>`
		+ `<td data-th="הפרשי הצמדה"${t.linkage < 0 ? ' class="jtool-neg"' : ''}>${num(t.linkage)}</td>`
		+ `<td data-th="שיעור שנתי">${t.rate === null ? '' : pct(t.rate)}</td><td data-th="ריבית">${num(t.interest)}</td>`
		+ `<td data-th="אירוע">${esc(t.event)}</td><td data-th="יתרה בסגירה">${num(t.close)}</td></tr>`).join('');
	const total = `<tr class="jtool-table__total"><td data-th="סך הכול" colspan="5">סך הכול</td><td data-th="הפרשי הצמדה">${num(r.linkage)}</td><td data-th=""></td>`
		+ `<td data-th="ריבית">${num(r.interest)}</td><td data-th="אירועים">${[r.paid ? `שולם ${money(r.paid)}` : '', r.fees ? `דמי פיגורים ${money(r.fees)}` : ''].filter(Boolean).join(' · ')}</td><td data-th="יתרה">${num(r.total)}</td></tr>`;
	const table = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-table-h">טבלת חישוב לבית המשפט</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="csv">הורדת CSV</button><button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-table-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתאריך</th><th scope="col">עד תאריך</th><th scope="col">ימים</th><th scope="col">יתרה בפתיחה</th><th scope="col">מדד</th><th scope="col">הפרשי הצמדה</th><th scope="col">שיעור שנתי</th><th scope="col">ריבית</th><th scope="col">אירוע</th><th scope="col">יתרה בסגירה</th></tr></thead>`
		+ `<tbody>${rows}${total}</tbody><caption>מדדים: ${esc(reg.cpi.publisher_he)}, סדרה ${reg.cpi.code}. שיעורי ריבית: ${esc(reg.interest.publisher_he)}, לפי רבעון. חושב ב-jus-tice.co.il, הנתונים נבדקו ב-${isoToHe(reg.checked_on)}. חישוב כללי, לא ייעוץ משפטי.</caption></table></div></div>`;
	let compare = '';
	if (compareR && compareR.ok) {
		const delta = Math.round((r.total - compareR.total) * 100) / 100;
		const opts = Object.entries(MODES).map(([k, v]) => `<option value="${k}"${k === compareMode ? ' selected' : ''}>${esc(v.label)}</option>`).join('');
		compare = `<div class="jtool-compare" data-compare><h3>מה אם: אותו חוב, חישוב אחר</h3>`
			+ `<div class="jtool-field" style="margin-bottom:12px"><label class="jtool-label" for="${P}-cmp">עמודה ב'</label><select id="${P}-cmp" data-compare-mode>${opts}</select></div>`
			+ `<div class="jtool-compare__grid"><div class="jtool-compare__col"><p>א. ${esc(MODES[r.mode].label)}, החישוב שלמעלה</p><strong>${ils(r.total)}</strong></div>`
			+ `<div class="jtool-compare__col jtool-compare__col--b"><p>ב. ${esc(MODES[compareMode].label)}, ${esc(MODES[compareMode].sec)}</p><strong>${ils(compareR.total)}</strong></div></div>`
			+ `<p class="jtool-delta" aria-live="polite">ההפרש: ${ils(Math.abs(delta))} ${delta >= 0 ? 'לטובת עמודה א\'' : 'לטובת עמודה ב\''}</p></div>`;
	}
	return table + compare;
}

export function otherMode(mode) { return mode === 'linked' ? 'link' : 'linked'; }

/** Page section: the same example under each reading of the law, from the same engine. */
export function compareTable(reg, input) {
	const rows = [
		['הצמדה בלבד', 'סעיף 2(א)(1)', Object.assign({}, input, { mode: 'link' })],
		['הצמדה וריבית צמודה', 'סעיף 2(א)(2)', Object.assign({}, input, { mode: 'linked' })],
		['ריבית שקלית', 'סעיף 2(א)', Object.assign({}, input, { mode: 'shekel' })],
		['הצמדה בלבד, לפי מדד החודש (חוזים)', 'חוזה בין הצדדים', Object.assign({}, input, { mode: 'link', rule: 'month' })],
	].map(([label, sec, inp]) => {
		const r = compute(reg, inp);
		return `<tr><td data-th="מה נפסק">${esc(label)}</td><td data-th="לפי">${esc(sec)}</td><td data-th="הפרשי הצמדה">${ils(r.linkage)}</td><td data-th="ריבית">${ils(r.interest)}</td><td data-th="יתרה"><strong>${ils(r.total)}</strong></td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`${amount(input.principal)} ₪ מ-${isoToHe(input.start)}, תשלומים של ${amount(input.payments.reduce((a, p) => a + p.amount, 0))} ₪, נכון ל-${isoToHe(input.end)}`)}</caption>`
		+ `<thead><tr><th scope="col">מה נפסק</th><th scope="col">לפי</th><th scope="col">הפרשי הצמדה</th><th scope="col">ריבית</th><th scope="col">יתרה</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Server snapshot: the example, rendered by the same code the page runs. */
export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const cmpMode = otherMode(EXAMPLE.mode);
	const c = compute(reg, Object.assign({}, EXAMPLE, { mode: cmpMode }));
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.total,
		form: renderForm(EXAMPLE),
		result: renderResult(reg, r, EXAMPLE, { example: true }),
		details: renderDetails(reg, r, c, cmpMode),
		method: `<ol>${pathLines(reg, r, EXAMPLE).map((l) => `<li>${l}</li>`).join('')}</ol>`,
		compare_table: compareTable(reg, EXAMPLE),
		sentence: verdictSentence(r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	// Keep what the person typed when it does not parse, so the engine can name the bad row.
	const amountOf = (text) => { const t = String(text || '').trim(); if (!t) { return ''; } const v = parseMoney(t); return Number.isNaN(v) ? t : v; };
	const payments = [...root.querySelectorAll('[data-payments] li')].map((li) => ({
		date: toIso(li.querySelector('[data-pay-date]').value.trim()), amount: amountOf(li.querySelector('[data-pay-amount]').value),
	})).filter((p) => p.date || p.amount !== '');
	return {
		principal: parseMoney(val(`#${P}-amt`)), start: toIso(val(`#${P}-from`)), end: toIso(val(`#${P}-to`)),
		mode: checked('mode') || 'linked', rule: checked('rule') || 'known', due: toIso(val(`#${P}-due`)), payments,
	};
}

function stateFromInput(input) {
	return encodeState({ a: input.principal, f: input.start, t: input.end, m: input.mode, r: input.rule === 'month' ? 'month' : '', d: input.due,
		p: input.payments.filter((p) => p.date && p.amount > 0).map((p) => [p.date, p.amount]) });
}

function inputFromState(s) {
	if (!s.a) { return null; }
	return {
		principal: Number(s.a), start: s.f || '', end: s.t || '', mode: MODES[s.m] ? s.m : 'linked', rule: s.r === 'month' ? 'month' : 'known', due: s.d || '',
		payments: decodeList(s.p).map(([date, amount]) => ({ date, amount: Number(amount) })),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	let compareMode = otherMode(EXAMPLE.mode);
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });

	if (isStale(reg.cpi.checked_on, reg.cpi.refresh_every_days)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהנתונים התעדכנו'); }
	}

	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const map = { principal: 'amt', start: 'from', end: 'to', due: 'due', payments: 'pays' };
		for (const e of r.errors) {
			const key = map[e.field];
			const box = root.querySelector(`#${P}-${key}-e`);
			if (box) { box.textContent = e.he; }
			const field = root.querySelector(`#${P}-${key}`);
			if (field) { field.setAttribute('aria-invalid', 'true'); }
		}
	};

	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		const c = r.ok ? compute(reg, Object.assign({}, input, { mode: compareMode })) : null;
		showErrors(r);
		result.innerHTML = renderResult(reg, r, input);
		details.innerHTML = renderDetails(reg, r, c, compareMode);
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.total) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.flags.length ? 'attention' : r.mode }); }
		if (!r.ok && r.outOfScope) { track('tool_out_of_scope', { tool_id: TOOL_ID }); }
	};

	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => run(readForm(root)), 160);
	};

	const redrawForm = (input) => { form.innerHTML = renderForm(input); };

	const fromHash = inputFromState(decodeState(window.location.hash, ['a', 'f', 't', 'm', 'r', 'd', 'p']));
	if (fromHash) {
		redrawForm(fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	}

	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	form.addEventListener('click', (ev) => {
		const t = ev.target.closest('button');
		if (!t) { return; }
		if (t.hasAttribute('data-add')) {
			const input = readForm(root);
			input.payments.push({ date: '', amount: 0 });
			redrawForm(input);
			const rows = form.querySelectorAll('[data-pay-date]');
			rows[rows.length - 1].focus();
		} else if (t.hasAttribute('data-remove')) {
			const input = readForm(root);
			const i = Number(t.getAttribute('data-remove'));
			const all = [...form.querySelectorAll('[data-payments] li')].map((li) => ({ date: toIso(li.querySelector('[data-pay-date]').value), amount: parseMoney(li.querySelector('[data-pay-amount]').value) }));
			all.splice(i, 1);
			input.payments = all;
			redrawForm(input);
			toast(root, 'התשלום נמחק.');
			form.querySelector('[data-add]').focus();
			run(readForm(root));
		} else if (t.hasAttribute('data-today')) {
			form.querySelector(`#${P}-to`).value = isoToHe(ilToday());
			schedule();
		}
	});

	details.addEventListener('change', (ev) => {
		if (ev.target.matches('[data-compare-mode]')) {
			compareMode = ev.target.value;
			run(readForm(root), { silent: true });
			track('tool_compare', { tool_id: TOOL_ID });
			root.querySelector('[data-compare-mode]').focus();
		}
	});

	// Wave 4 (HAD-502): a click while the 160 ms debounce is pending runs it now, so the screen and the export agree,
	// and every action computes what the form holds now, never the last debounced result.
	const flush = () => { if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); } };
	const csvText = () => {
		const r = compute(reg, readForm(root));
		if (!r.ok) { return null; }
		const head = ['מתאריך', 'עד תאריך', 'ימים', 'יתרה בפתיחה', 'מדד', 'הפרשי הצמדה', 'שיעור שנתי', 'ריבית', 'אירוע', 'יתרה בסגירה'];
		const body = tableRows(r).map((t) => [t.from, t.to, t.days, t.open.toFixed(2), t.index, t.linkage.toFixed(2), t.rate === null ? '' : `${t.rate}%`, t.interest.toFixed(2), t.event, t.close.toFixed(2)]);
		body.push(['סך הכול', '', '', '', '', r.linkage.toFixed(2), '', r.interest.toFixed(2), `שולם ${r.paid.toFixed(2)}${r.fees ? `; דמי פיגורים ${r.fees.toFixed(2)}` : ''}`, r.total.toFixed(2)]);
		body.push([`מקור: ${reg.cpi.source_name}; ${reg.interest.source_name}; נבדק ${isoToHe(reg.checked_on)}. חישוב כללי, לא ייעוץ משפטי.`]);
		return csv([head, ...body]);
	};

	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		flush();
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateFromInput(input));
		if (act === 'csv') {
			const text = csvText();
			if (text) { download('hatzmada-table.csv', 'text/csv;charset=utf-8', text); track('tool_download', { tool_id: TOOL_ID, type: 'csv' }); }
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שם, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			const text = `${verdictSentence(r)} · חושב ב-jus-tice.co.il לפי חוק פסיקת ריבית והצמדה (מדד ${heMonth(reg.cpi.latest_month)}) ${link}`;
			window.open(whatsappUrl(text), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(r)} (חושב ב-jus-tice.co.il, ${isoToHe(reg.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'save') {
			store.set('jtool-hatzmada', stateFromInput(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'clear') {
			store.clear('jtool-hatzmada');
			toast(root, 'נמחק מהמכשיר.');
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID });
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});

	const saved = !fromHash && store.get('jtool-hatzmada');
	if (saved) {
		const s = inputFromState(decodeState(saved, ['a', 'f', 't', 'm', 'r', 'd', 'p']));
		if (s) { const note = root.querySelector('[data-jtool-saved]'); if (note) { note.hidden = false; } }
		root.addEventListener('click', (ev) => {
			if (ev.target.closest('[data-act="restore"]') && s) { redrawForm(s); run(s); }
		});
	}
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
