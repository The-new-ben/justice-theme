/**
 * Wave 3 UI: purchase tax and the full cost of buying a home (HAD-498).
 * Board: Claude Design canvas "Tools wave 3" (co.il mas-rechisha at 1280 and 360, states).
 * The bracket ladder shows how the price climbs the brackets; the table and the path say the same in text.
 */
import { compute, taxFor, TRACKS } from './rechisha-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale,
} from './instrument.js';

export const TOOL_ID = 'mas-rechisha';
const P = 'jt7';

export const EXAMPLE = { price: 2650000, date: '2026-10-13', track: 'single', contractor: false, delivery: '', aliyah: '', lawyerPct: 0.5, brokerPct: 2, other: 0 };
export const PRICE_POINTS = [1500000, 2000000, 2500000, 3000000, 4000000, 6000000, 8000000];

const TRACK_LABEL = { single: 'דירה יחידה', replacement: 'דירה חלופית', additional: 'דירה נוספת', oleh: 'עולה חדש', disabled: 'נכה (תקנה 11)' };
const TRACK_LONG = { single: 'דירה יחידה', replacement: 'דירה חלופית (אמכור את הקודמת)', additional: 'דירה נוספת (משקיעים)', oleh: 'עולה חדש', disabled: 'נכה, עיוור או נפגע (תקנה 11)' };

function cite(text, href) { return ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>`; }
function trackCite(reg, track) {
	const t = reg.purchase_tax.tracks[track === 'replacement' ? 'single' : track];
	return cite(t.section, ['oleh', 'disabled'].includes(track) ? reg.purchase_tax.regulations_url : reg.purchase_tax.law_url);
}
const lawCite = (reg, text) => cite(text, reg.purchase_tax.law_url);
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const t = input.track || 'single';
	const pt = reg.purchase_tax;
	return `<div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-price">מחיר הדירה</label><div class="jtool-input jtool-input--money"><input id="${P}-price" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.price ? money(input.price, 0) : '')}" placeholder="לדוגמה: 2,650,000" aria-describedby="${P}-price-h ${P}-price-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-hint" id="${P}-price-h">החישוב לדירה שלמה. קונים רק חלק? הזינו את שווי הדירה כולה והכפילו את המס בחלק שלכם (תקנה 2(2)(ב) לתקנות מס רכישה)</p><p class="jtool-error" id="${P}-price-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-date">יום החתימה</label><input id="${P}-date" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.date || ''))}" placeholder="לדוגמה: 13.10.2026" aria-describedby="${P}-date-e"><p class="jtool-error" id="${P}-date-e" role="alert"></p></div></div>`
		+ `<fieldset class="jtool-field"><legend>מי קונה</legend><div class="jtool-chips">${TRACKS.map((k) => chip('trk', k, TRACK_LONG[k], t === k)).join('')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('nr', '1', 'הרוכש אינו תושב ישראל', input.nonResident, 'checkbox')}</div>`
		+ `<p class="jtool-hint">${esc(pt.couple_he)}. ${esc(pt.share_ignored_he)}. ${esc(pt.resident_he)}.</p></fieldset>`
		+ `<div data-if-track="replacement"${t === 'replacement' ? '' : ' hidden'}><div class="jtool-chips">${chip('ctr', '1', 'קונים מקבלן', input.contractor, 'checkbox')}</div>`
		+ `<div class="jtool-field" style="margin-top:8px" data-if-contractor${input.contractor ? '' : ' hidden'}><label class="jtool-label" for="${P}-dlv">מועד המסירה לפי החוזה</label><input id="${P}-dlv" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.delivery || ''))}" placeholder="לדוגמה: 31.12.2027" aria-describedby="${P}-delivery-e"><p class="jtool-error" id="${P}-delivery-e" role="alert"></p></div></div>`
		+ `<div data-if-track="disabled oleh"${t === 'disabled' || t === 'oleh' ? '' : ' hidden'}><div class="jtool-chips">${chip('dot', '1', 'יש לי עוד דירה, והיא לא נמכרת כחלופית', input.otherHome, 'checkbox')}${chip('used', '1', 'כבר קיבלתי את ההטבה (עולה: פעם אחת; נכה: פעמיים)', input.reliefUsed, 'checkbox')}</div><div class="jtool-chips" data-if-track="disabled"${t === 'disabled' ? '' : ' hidden'} style="margin-top:8px">${chip('nfh', '1', 'הדירה לא נקנית למגורים שלי (להשקעה)', input.notForHousing, 'checkbox')}</div><p class="jtool-hint">הטבת עולה: רק בדירה יחידה או חלופית (תקנה 12א(א)). נכה: ${esc(pt.tracks.disabled.sole_he)}</p></div>`
		+ `<div class="jtool-field" data-if-track="oleh"${t === 'oleh' ? '' : ' hidden'}><label class="jtool-label" for="${P}-aly">תאריך העלייה</label><input id="${P}-aly" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.aliyah || ''))}" placeholder="לדוגמה: 1.5.2024" aria-describedby="${P}-aliyah-e"><p class="jtool-error" id="${P}-aliyah-e" role="alert"></p></div>`
		+ `<details class="jtool-more"${input.lawyerPct || input.brokerPct || input.other ? ' open' : ''}><summary>כל עלויות הקנייה, לא רק המס</summary>`
		+ `<div class="jtool-row" style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${P}-law">שכר טרחת עורך הדין</label><div class="jtool-input"><input id="${P}-law" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.lawyerPct ?? '')}" placeholder="לפי ההצעה שקיבלתם" aria-describedby="${P}-lawyer-e"><span class="jtool-input__suffix" aria-hidden="true">%</span></div><p class="jtool-error" id="${P}-lawyer-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-brk">דמי תיווך</label><div class="jtool-input"><input id="${P}-brk" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.brokerPct ?? '')}" placeholder="0 אם אין מתווך" aria-describedby="${P}-broker-e"><span class="jtool-input__suffix" aria-hidden="true">%</span></div><p class="jtool-error" id="${P}-broker-e" role="alert"></p></div></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-oth">עוד עלויות (שמאי, בדק בית, יועץ משכנתא)</label><div class="jtool-input jtool-input--money"><input id="${P}-oth" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.other ? money(input.other, 0) : '')}" placeholder="0" aria-describedby="${P}-other-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-other-e" role="alert"></p></div>`
		+ `<p class="jtool-hint">על שכר הטרחה ודמי התיווך נוסף מע"מ ${pt.vat_pct}% (מ-${isoToHe(pt.vat_from)}). האחוזים הם שלכם, לפי ההצעות שקיבלתם; הכלי לא ממליץ על מחיר.</p></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const add = r.scenarios.additional;
	const base = `מס רכישה של ${nis(r.tax)} על ${TRACK_LABEL[r.track]} ב-${nis(r.price)}, ${r.effective}% מהמחיר.`;
	if (r.track === 'additional') { return base; }
	return add === null ? base : `${base} על אותה דירה כדירה נוספת: ${nis(add)}.`;
}

/** The ladder: each bracket, how much of the price sits in it and what it costs. */
function ladder(reg, r) {
	const max = r.lines.reduce((a, l) => Math.max(a, l.part), 1);
	// Darker for a higher rate: the ladder reads as a climb. Navy family only.
	const tone = (rate) => (rate >= 10 ? '#0E2E4F' : rate >= 8 ? '#14477D' : rate >= 5 ? '#2F5F9E' : rate > 0.5 ? '#3E6DA6' : '#4A6F99');
	const rows = r.lines.map((l) => `<li class="jt7-step${l.rate === 0 ? ' jt7-step--zero' : ''}" style="--jt7-w:${Math.max(3, (l.part / max) * 100).toFixed(2)}%;--jt7-c:${tone(l.rate)}">`
		+ `<span class="jt7-step__rate"><bdi>${l.rate}%</bdi></span>`
		+ `<span class="jt7-step__range">${r.flat ? 'על כל השווי' : `${money(l.from, 0)} עד ${money(l.to, 0)} ₪`}</span>`
		+ `<span class="jt7-step__bar" aria-hidden="true"><i></i></span>`
		+ `<span class="jt7-step__tax">${ils(l.tax, l.tax % 1 ? 2 : 0)}</span></li>`).join('');
	return `<ol class="jt7-ladder" aria-label="המדרגות">${rows}</ol>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state ${r.outOfScope ? 'jtool-state--info' : 'jtool-state--danger'}">${r.outOfScope ? 'מחוץ לתחום של הכלי' : '✕ צריך לתקן את הקלט'}</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const state = `<p class="jtool-state ${r.track === 'additional' ? 'jtool-state--info' : 'jtool-state--ok'}">${r.track === 'additional' ? 'מדרגות דירה נוספת' : `✓ מדרגות ${esc(TRACK_LABEL[r.track])}`}</p>`;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}מס רכישה על ${esc(nis(r.price))}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.tax)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ (r.total > r.tax ? `<p class="jtool-scope">עם עורך דין, תיווך ועלויות נוספות: <strong>${ils(r.total)}</strong> מעבר למחיר.</p>` : '')
		+ `</div>`
		+ (r.flags.filter((f) => !f.soft).length ? `<ul class="jtool-flags">${r.flags.filter((f) => !f.soft).map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ `<details class="jtool-path" open><summary>המדרגות, אחת אחרי השנייה</summary>${ladder(reg, r)}<p class="jt7-ladder__cite">החישוב מדורג: כל שיעור חל רק על החלק שבתוך המדרגה.${trackCite(reg, r.track)}</p></details>`;
}

export function deadlines(reg, r) {
	const pt = reg.purchase_tax;
	const out = [
		{ date: r.declare, what: `הצהרה לרשות המסים (${pt.declare_days} יום מהרכישה)`, rule: pt.declare_section, href: pt.law_url },
		{ date: r.pay, what: `תשלום המס (${pt.pay_days} יום מהרכישה). אחר כך מתווספים הפרשי הצמדה וריבית`, rule: `${pt.pay_section}, ${pt.late_section}`, href: pt.law_url },
	];
	if (r.replacement && r.replacement.ok) {
		const rp = r.replacement;
		out.push({ date: rp.deadline, what: `למכור את הדירה הקודמת (${rp.contractor && rp.via === 'delivery' ? `${rp.months} חודשים מהמסירה` : rp.contractor ? `${rp.months} חודשים מהרכישה, מאוחר מ-12 חודשים מהמסירה` : `${rp.months} חודשים מהרכישה`}${rp.extended ? `; הוארך בגלל המלחמה מ-${isoToHe(rp.original)}` : ''})`, rule: rp.extended ? 'הוראת ביצוע 2/2026' : pt.replacement.section, href: rp.extended ? pt.replacement.war.url : pt.law_url });
	}
	return out.sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function renderDetails(reg, r, compareR, opts = {}) {
	if (!r.ok) { return ''; }
	const pt = reg.purchase_tax;
	// Side by side: the same price and day on every track the buyer might be on.
	const cards = ['single', 'additional', 'oleh', 'disabled'].map((k) => {
		const v = r.scenarios[k];
		const here = k === r.track || (k === 'single' && r.track === 'replacement');
		return `<div class="jt7-scn${here ? ' jt7-scn--here' : ''}"><p>${esc(TRACK_LABEL[k])}${here ? ' (אתם)' : k === 'oleh' || k === 'disabled' ? ' (אם זכאים)' : ''}</p><strong>${v === null ? '—' : ils(v, v % 1 ? 2 : 0)}</strong><small>${v === null ? 'לא חל ביום הזה' : `${(Math.round(v / r.price * 10000) / 100)}% מהמחיר`}</small></div>`;
	}).join('');
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-scn-h">אותה דירה, ארבעה מצבים</h3></div><div class="jt7-scns">${cards}</div>`
		+ `<p class="jt7-scns__note">דירה נוספת: ${esc(pt.tracks.additional.source_he)}. עולה ונכה: ההטבה בתנאים שבתקנות.</p></div>`;
	// The full cost on top of the price.
	const rows = [
		['מס רכישה', r.tax, `${r.section}`, r.track === 'oleh' || r.track === 'disabled' ? pt.regulations_url : pt.law_url],
		r.lawyer ? [`שכר טרחת עורך דין, כולל מע"מ ${r.vat}%`, r.lawyer, 'מע"מ: צו שיעור המס, סעיף 1', pt.vat_url] : null,
		r.broker ? [`דמי תיווך, כולל מע"מ ${r.vat}%`, r.broker, 'מע"מ: צו שיעור המס, סעיף 1', pt.vat_url] : null,
		r.other ? ['עלויות נוספות שהזנתם', r.other, '', ''] : null,
	].filter(Boolean);
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-cost-h">כמה כסף צריך מעבר למחיר</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-cost-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([what, v, rule, href]) => `<tr><td data-th="מה">${esc(what)}</td><td data-th="סכום">${ils(v)}</td><td data-th="הכלל">${rule ? cite(rule, href) : '—'}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול מעבר למחיר</td><td data-th="סכום">${ils(r.total)}</td><td data-th="הכלל">${esc(`${Math.round(r.total / r.price * 10000) / 100}% מהמחיר`)}</td></tr></tbody>`
		+ `<caption>${r.lawyer || r.broker ? 'שכר הטרחה ודמי התיווך לפי האחוזים שהזנתם.' : 'רוצים לראות גם עורך דין ותיווך? פתחו "כל עלויות הקנייה" בטופס.'} אגרות רישום ומשכנתא לא כלולות.</caption></table></div></div>`;
	const dl = deadlines(reg, r);
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שלכם</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה עושים</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ dl.map((d) => { const past = opts.today && d.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="עד תאריך"><bdi>${isoToHe(d.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה עושים">${esc(d.what)}</td><td data-th="הכלל">${cite(d.rule, d.href)}</td></tr>`; }).join('')
		+ `</tbody><caption>חישוב כללי, לא ייעוץ משפטי. את ההצהרה מגיש בדרך כלל עורך הדין של הקונה.</caption></table></div></div>`;
	if (compareR && compareR.ok) {
		out += `<div class="jtool-compare" data-compare><h3>מה אם: מחיר אחר</h3>`
			+ `<div class="jtool-field" style="margin-bottom:12px"><label class="jtool-label" for="${P}-cmp">מחיר לבדיקה בעמודה ב'</label><div class="jtool-input jtool-input--money"><input id="${P}-cmp" type="text" inputmode="decimal" autocomplete="off" data-compare-amount value="${esc(money(compareR.price, 0))}"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div></div>`
			+ `<div data-compare-out>${renderCompareOut(r, compareR)}</div></div>`;
	}
	return out;
}

export function renderCompareOut(r, c) {
	if (!c || !c.ok) { return `<p class="jtool-delta" aria-live="polite">${c && c.errors ? esc(c.errors.map((e) => e.he).join(' ')) : ''}</p>`; }
	const delta = Math.round((c.tax - r.tax) * 100) / 100;
	return `<div class="jtool-compare__grid"><div class="jtool-compare__col"><p>א. ${esc(nis(r.price))}</p><strong>${ils(r.tax)}</strong></div>`
		+ `<div class="jtool-compare__col jtool-compare__col--b"><p>ב. ${esc(nis(c.price))}</p><strong>${ils(c.tax)}</strong></div></div>`
		+ `<p class="jtool-delta" aria-live="polite">${delta >= 0 ? 'עוד' : 'פחות'} ${ils(Math.abs(delta))} מס${c.price !== r.price ? `, על הפרש של ${esc(nis(Math.abs(c.price - r.price)))} במחיר` : ''}.</p>`;
}

export function compareFor(reg, input) {
	const b = Number(input.comparePrice) > 0 ? Number(input.comparePrice) : Math.round((Number(input.price) || 0) * 1.1 / 10000) * 10000;
	return Object.assign({}, input, { price: b });
}

/** Page section: the tax at common prices, single home against additional home and oleh, from the same engine. */
export function priceTable(reg, on) {
	const pt = reg.purchase_tax;
	const rows = PRICE_POINTS.map((p) => {
		const s = taxFor(pt, 'single', p, on);
		const a = taxFor(pt, 'additional', p, on);
		const o = taxFor(pt, 'oleh', p, on);
		const cell = (x) => (x.refused ? '—' : ils(x.tax, x.tax % 1 ? 2 : 0));
		return `<tr><td data-th="מחיר הדירה">${ils(p, 0)}</td><td data-th="דירה יחידה">${cell(s)}</td><td data-th="דירה נוספת">${cell(a)}</td><td data-th="עולה חדש">${cell(o)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מס רכישה לפי מחיר הדירה, ברכישה ב-${isoToHe(on)}, מאותו מנוע.</caption><thead><tr><th scope="col">מחיר הדירה</th><th scope="col">דירה יחידה</th><th scope="col">דירה נוספת</th><th scope="col">עולה חדש</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const c = compute(reg, compareFor(reg, EXAMPLE));
	const steps = r.lines.map((l) => `<li>${l.rate === 0 ? `עד ${money(l.to, 0)} ₪: 0%, בלי מס` : `${money(l.from, 0)} עד ${money(l.to, 0)} ₪ (${money(l.part, 0)} ₪) × ${l.rate}% = ${money(l.tax)} ₪`}${lawCite(reg, r.section)}</li>`).join('');
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.tax,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, c),
		method: `<ol>${steps}<li>סך הכול: ${money(r.tax)} ₪, ${r.effective}% מהמחיר.</li></ol>`,
		compare_table: priceTable(reg, EXAMPLE.date),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const pct = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : Number(v.replace(',', '.')); };
	return {
		price: parseMoney(val(`#${P}-price`)), date: toIso(val(`#${P}-date`)),
		track: (root.querySelector(`input[name="${P}-trk"]:checked`) || {}).value || 'single',
		contractor: Boolean(root.querySelector(`input[name="${P}-ctr"]:checked`)), delivery: toIso(val(`#${P}-dlv`)), aliyah: toIso(val(`#${P}-aly`)),
		otherHome: Boolean(root.querySelector(`input[name="${P}-dot"]:checked`)),
		reliefUsed: Boolean(root.querySelector(`input[name="${P}-used"]:checked`)),
		nonResident: Boolean(root.querySelector(`input[name="${P}-nr"]:checked`)),
		notForHousing: Boolean(root.querySelector(`input[name="${P}-nfh"]:checked`)),
		lawyerPct: pct('law'), brokerPct: pct('brk'), other: val(`#${P}-oth`).trim() === '' ? 0 : parseMoney(val(`#${P}-oth`)),
		comparePrice: parseMoney(val(`#${P}-cmp`)),
	};
}

const TR = { single: 's', replacement: 'r', additional: 'a', oleh: 'o', disabled: 'd' };
const stateOf = (i) => encodeState({ p: i.price, d: i.date, t: TR[i.track] || 's', c: i.contractor ? 1 : '', v: i.delivery, a: i.aliyah, l: i.lawyerPct, b: i.brokerPct, o: i.other || '', x: i.otherHome ? 1 : '', u: i.reliefUsed ? 1 : '', n: i.nonResident ? 1 : '', h: i.notForHousing ? 1 : '' });
const KEYS = ['p', 'd', 't', 'c', 'v', 'a', 'l', 'b', 'o', 'x', 'u', 'n', 'h'];
function inputOf(s) {
	if (!s.p) { return null; }
	return { price: Number(s.p), date: s.d || '', track: Object.keys(TR).find((k) => TR[k] === s.t) || 'single', contractor: s.c === '1', delivery: s.v || '', aliyah: s.a || '', lawyerPct: s.l === undefined ? '' : Number(s.l), brokerPct: s.b === undefined ? '' : Number(s.b), other: Number(s.o) || 0, otherHome: s.x === '1', reliefUsed: s.u === '1', nonResident: s.n === '1', notForHousing: s.h === '1' };
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const pt = reg.purchase_tax;
	const today = new Date().toISOString().slice(0, 10);
	const saveKey = `jtool-${TOOL_ID}`;
	let last = null;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(pt.checked_on, pt.refresh_every_days) || (pt.next_update && today >= pt.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהמדרגות התעדכנו'); }
	}
	// A live page starts on today's date unless a shared link says otherwise.
	const dateField = root.querySelector(`#${P}-date`);
	if (dateField && !window.location.hash) { dateField.value = isoToHe(today); }
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok || r.outOfScope) { return; }
		const ids = { price: 'price', date: 'date', delivery: 'dlv', aliyah: 'aly', lawyer: 'law', broker: 'brk', other: 'oth' };
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${ids[e.field] || e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const t = (root.querySelector(`input[name="${P}-trk"]:checked`) || {}).value || 'single';
		form.querySelectorAll('[data-if-track]').forEach((el) => { el.hidden = !(el.getAttribute('data-if-track') || '').split(' ').includes(t); });
		const c = Boolean(root.querySelector(`input[name="${P}-ctr"]:checked`));
		form.querySelectorAll('[data-if-contractor]').forEach((el) => { el.hidden = !c; });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		const c = r.ok ? compute(reg, compareFor(reg, input)) : null;
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, c, { today });
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.tax) : '—'; }
		last = { r, input };
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.track }); }
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => run(readForm(root)), 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	} else if (dateField) {
		run(readForm(root), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	let cmpTimer = null;
	details.addEventListener('input', (ev) => {
		if (!ev.target.matches('[data-compare-amount]') || !last || !last.r.ok) { return; }
		clearTimeout(cmpTimer);
		cmpTimer = setTimeout(() => {
			const out = details.querySelector('[data-compare-out]');
			const c = compute(reg, Object.assign({}, last.input, { price: parseMoney(ev.target.value) }));
			if (out) { out.innerHTML = renderCompareOut(last.r, c); }
			track('tool_compare', { tool_id: TOOL_ID });
		}, 200);
	});
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		const input = readForm(root);
		const r = last ? last.r : compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			download('mas-rechisha.ics', 'text/calendar;charset=utf-8', ics(deadlines(reg, r).map((d) => ({ date: d.date, summary: `מס רכישה: ${d.what}` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי מדרגות רשות המסים ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(pt.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.track : 'error' });
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
