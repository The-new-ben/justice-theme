/**
 * The family + land wave UI (HAD-579): buying an apartment from a contractor (dira-mikablan, prefix jt45).
 * Two pictures from the world of a new-build purchase. The payment schedule strip: each payment of the contract as a
 * bar on the time line from the signing to the delivery (time runs right to left), its linked part drawn solid and the
 * unlinked first 20% open, the residential building input index (CBS series 200010) as a line over the bars, the
 * contract delivery date as the dashed end of the linkage, and today. The warranty clock: one track per kind of defect
 * of the addendum to the Sale (Apartments) Law, the inspection period solid and the three warranty years hatched,
 * the 20 years of a fundamental defect, and a today marker; the nearest end is drawn strongest. Each picture has a table
 * as its text equivalent and a one-sentence summary for screen readers. Under them: the delay compensation month by
 * month (s.5א), the securities for every payment (Investments Law), the dated list (.ics), the scenario for the
 * simulation and the next steps; a one-page buyer sheet prints on its own.
 */
import { kbCompute, kbKnownMonth, kbIndex } from './kablan-engine.js';
import { addMonths, parseDate, daysBetween } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, decodeList, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'dira-mikablan';
const P = 'jt45';
const KB_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=court_rehearsal&topic=real-estate';

export const EXAMPLE = {
	price: 2000000, signDate: '2023-03-01', deliveryDate: '2026-03-01', actualDate: '2026-11-15', rent: 6000, linkShare: 50,
	payments: [{ pct: 20, date: '2023-03-01' }, { pct: 20, date: '2023-09-01' }, { pct: 20, date: '2024-06-01' }, { pct: 20, date: '2025-06-01' }, { pct: 20, date: '2026-11-15' }],
	baseMonth: '', excused: false,
};

/** One click to a common payment schedule: the percentages; the dates spread from the signing to the contract delivery. */
export const PRESETS = {
	five: { he: 'חמישה תשלומים של 20%', pcts: [20, 20, 20, 20, 20] },
	twenty80: { he: '20% בחתימה, 80% במסירה', pcts: [20, 80] },
	seven: { he: '7% בחתימה ואחריו חמישה תשלומים', pcts: [7, 13, 20, 20, 20, 20] },
};
export function kbPresetPayments(key, signDate, deliveryDate) {
	const p = PRESETS[key];
	if (!p) { return []; }
	const months = Math.max(1, Math.round(daysBetween(signDate, deliveryDate) / 30.4375));
	const n = p.pcts.length;
	return p.pcts.map((pct, i) => ({ pct, date: i === 0 ? signDate : i === n - 1 ? deliveryDate : addMonths(signDate, Math.round(months * i / (n - 1))) }));
}
const kbPresetOf = (pays) => Object.keys(PRESETS).find((k) => PRESETS[k].pcts.join('.') === (pays || []).map((p) => Number(p.pct)).join('.')) || '';

const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const kbMonthHe = (ym) => (ym ? `${Number(ym.slice(5))}.${ym.slice(0, 4)}` : '');
const kbStage = { signing: 'לפני החתימה', waiting: 'מחכים למסירה', after: 'אחרי המסירה' };
function kbCite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const kbChip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
function kbToIso(text) {
	const raw = String(text || '').trim();
	if (!raw) { return ''; }
	return parseDate(raw) || raw;
}
function kbBand(n) {
	if (!(n > 0)) { return 'אפס'; }
	if (n < 10000) { return 'פחות מ-10 אלף ₪'; }
	if (n < 100000) { const lo = Math.floor(n / 10000) * 10; return `בין ${lo} ל-${lo + 10} אלף ₪`; }
	const lo = Math.floor(n / 50000) * 50;
	return `בין ${lo} ל-${lo + 50} אלף ₪`;
}
function kbPriceBand(n) {
	const m = n / 1000000;
	if (m < 1) { return 'פחות ממיליון ₪'; }
	const lo = Math.floor(m * 2) / 2;
	return `בין ${lo} ל-${lo + 0.5} מיליון ₪`;
}
/** The sticky figure: the delay compensation when there is one, else the linkage; the same string on the server and in the
 * browser (the snapshot never shows a raw number). */
export function kbStickyFigure(r) {
	if (!r.ok) { return '—'; }
	return ils(r.delay.compMonths && !r.delay.excused && r.input.rent > 0 ? r.delay.total : r.pay.diffTotal, 0);
}
const kbLeft = (days) => (days > 0 ? `עוד ${money(days, 0)} ימים` : days === 0 ? 'היום' : 'עבר');

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const fl = reg.fl_kablan;
	const pays = input.payments || [];
	const preset = kbPresetOf(pays);
	const date = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 1.3.2026" aria-describedby="${P}-${id}-e"><p class="jtool-hint">${esc(hint)}</p><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const moneyField = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v === '' || v === undefined || v === null ? '' : money(v, 0))}" placeholder="0" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-hint">${esc(hint)}</p><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const rows = pays.map((p, i) => `<tr><th scope="row">${i + 1}</th><td><label class="jtool-visually-hidden" for="${P}-pp${i}">אחוז מהמחיר בתשלום ${i + 1}</label><input class="${P}-pct" id="${P}-pp${i}" type="text" inputmode="decimal" autocomplete="off" value="${esc(String(p.pct ?? ''))}"><span aria-hidden="true">%</span></td>`
		+ `<td><label class="jtool-visually-hidden" for="${P}-pd${i}">תאריך תשלום ${i + 1}</label><input class="${P}-pdate" id="${P}-pd${i}" type="text" inputmode="numeric" autocomplete="off" value="${esc(p.date ? isoToHe(p.date) : '')}" placeholder="1.9.2026"></td>`
		+ `<td>${pays.length > 1 ? `<button type="button" class="jtool-iconbtn" data-act="delpay" data-i="${i}" aria-label="להסיר את תשלום ${i + 1}">✕</button>` : ''}</td></tr>`).join('');
	return `<div class="jtool-row">${moneyField('price', 'מחיר הדירה בחוזה', input.price, 'כולל מע"מ, כפי שכתוב בחוזה')}${date('sign', 'יום החתימה על החוזה', input.signDate, 'קובע את הנוסח של החוק שחל ואת המדד הבסיסי')}</div>`
		+ `<div class="jtool-row">${date('deliv', 'מועד המסירה שבחוזה', input.deliveryDate, 'ממנו נספר האיחור, ועד אליו לכל היותר ההצמדה')}${date('actual', 'מסירה בפועל או צפויה (לא חובה)', input.actualDate, 'בלי תאריך: האיחור נספר עד היום')}</div>`
		+ `<fieldset class="jtool-field"><legend>לוח התשלומים</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ `<p class="jtool-hint">לחיצה ממלאת לוח נפוץ בין החתימה למסירה; אפשר לשנות כל אחוז ותאריך לפי החוזה.</p>`
		+ `<div class="${P}-paywrap"><table class="${P}-paytable"><thead><tr><th scope="col">#</th><th scope="col">אחוז מהמחיר</th><th scope="col">תאריך</th><th scope="col"><span class="jtool-visually-hidden">הסרה</span></th></tr></thead><tbody>${rows}</tbody></table></div>`
		+ `<p class="jtool-error" id="${P}-pays-e" role="alert"></p><button type="button" class="jtool-linkbtn" data-act="addpay">הוספת תשלום</button></fieldset>`
		+ `<fieldset class="jtool-field"><legend>כמה מכל תשלום צמוד למדד תשומות הבנייה</legend><div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-share">החלק הצמוד מכל תשלום, באחוזים</label><input id="${P}-share" type="text" inputmode="decimal" autocomplete="off" value="${esc(String(input.linkShare ?? ''))}" aria-describedby="${P}-share-e"><p class="jtool-hint">בחוזה מ-7.7.2022: עד ${fl.linkage.max_share_pct}% (${esc(fl.linkage.half.section)}), ו-${fl.linkage.unlinked_first_pct}% הראשונים מהמחיר לא צמודים</p><p class="jtool-error" id="${P}-share-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-base">חודש המדד הבסיסי (לא חובה)</label><input id="${P}-base" type="text" inputmode="numeric" autocomplete="off" value="${esc(input.baseMonth ? kbMonthHe(input.baseMonth) : '')}" placeholder="${esc(input.signDate ? kbMonthHe(kbKnownMonth(reg, input.signDate)) : '1.2023')}" aria-describedby="${P}-base-e"><p class="jtool-hint">בלי חודש: המדד הידוע ביום החתימה</p><p class="jtool-error" id="${P}-base-e" role="alert"></p></div></div></fieldset>`
		+ `<div class="jtool-row">${moneyField('rent', 'שכר דירה חודשי של דירה דומה', input.rent, fl.delay.rent_he)}`
		+ `<div class="jtool-field" style="justify-content:flex-end"><div class="jtool-chips">${kbChip('exc', '1', 'האיחור נגרם רק בגללנו, או בסיכול', input.excused, 'checkbox')}</div></div></div>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const d = r.delay;
	const parts = [];
	if (d.compMonths && r.input.rent > 0) {
		parts.push(`איחור של ${d.months} חודשים (חודש או חלק ממנו)${d.toToday ? ' עד היום' : ''}: פיצוי של ${nis(d.total)} על ${d.compMonths} חודשים לפי ${r.regime === 'new' ? 'סעיף 5א' : 'סעיף 5א בנוסח הקודם'}`);
	} else if (d.months && d.excused) {
		parts.push(`איחור של ${d.months} חודשים, בלי פיצוי לפי החוק כי סומן שהאיחור באשמת הקונה או בסיכול`);
	} else if (d.months && !d.started) {
		parts.push(`איחור של ${money(d.days, 0)} ימים, בתוך ${r.regime === 'new' ? 'החודש' : '60 הימים'} שבו החוק לא מזכה בפיצוי`);
	} else if (d.compMonths) {
		parts.push(`איחור של ${d.months} חודשים: פיצוי על ${d.compMonths} חודשים, לפי שכר הדירה שתקלידו`);
	} else {
		parts.push('אין איחור במסירה לפי התאריכים');
	}
	parts.push(`הפרשי ההצמדה למדד תשומות הבנייה ${r.pay.rows.some((x) => x.pending) ? 'עד כה ' : ''}${nis(r.pay.diffTotal)} על ${nis(r.pay.linkedTotal)} צמודים`);
	const n = r.warranty.nearest[0];
	if (n) { parts.push(`המועד הקרוב באחריות: ${isoToHe(n.date)}, ${n.he}`); }
	return `${parts.join('; ')}.`;
}

/** The payment schedule strip: bars per payment (linked part solid), the index line, the end of the linkage, today. */
export function kbStrip(reg, r) {
	const W = 420; const L = 14; const R = 406; const BASE = 160;
	const rows = r.pay.rows;
	const t0 = r.input.signDate;
	const ends = [r.input.deliveryDate, r.input.actualDate || '', ...rows.map((x) => x.date)].filter(Boolean);
	const t1 = ends.reduce((m, x) => (x > m ? x : m), t0);
	const span = Math.max(1, daysBetween(t0, t1));
	const x = (iso) => R - (daysBetween(t0, iso) / span) * (R - L);
	const maxPct = Math.max(...rows.map((p) => p.pct), 1);
	const bars = rows.map((p) => {
		const h = Math.max(4, p.pct / maxPct * 70);
		const hl = p.amount ? h * p.linked / p.amount : 0;
		const cx = x(p.date);
		return `<rect class="${P}-bar" x="${(cx - 7).toFixed(1)}" y="${(BASE - h).toFixed(1)}" width="14" height="${h.toFixed(1)}"></rect>`
			+ (hl ? `<rect class="${P}-bar--linked" x="${(cx - 7).toFixed(1)}" y="${(BASE - hl).toFixed(1)}" width="14" height="${hl.toFixed(1)}"></rect>` : '')
			+ `<text class="${P}-lbl" x="${cx.toFixed(1)}" y="${(BASE - h - 4).toFixed(1)}" text-anchor="middle">${p.pct}%</text>`;
	}).join('');
	const line = r.pay.line;
	const maxCh = Math.max(1, ...line.map((p) => Math.abs(p.change)));
	const known = (ym) => { const [y, m] = ym.split('-').map(Number); const t = y * 12 + m; return `${Math.floor(t / 12)}-${String(t % 12 + 1).padStart(2, '0')}-16`; };
	const pts = line.map((p) => { const d = known(p.month); const dd = d < t0 ? t0 : d > t1 ? t1 : d; return `${x(dd).toFixed(1)},${(70 - p.change / maxCh * 50).toFixed(1)}`; }).join(' ');
	const last = line[line.length - 1];
	const vline = (iso, cls, label, y) => (iso && iso >= t0 && iso <= t1 ? `<line class="${P}-${cls}" x1="${x(iso).toFixed(1)}" x2="${x(iso).toFixed(1)}" y1="14" y2="${BASE}"></line><text class="${P}-lbl ${P}-lbl--${cls}" x="${x(iso).toFixed(1)}" y="${y}" text-anchor="middle">${esc(label)}</text>` : '');
	const sum = `${rows.length} תשלומים בין ${isoToHe(t0)} ל-${isoToHe(rows[rows.length - 1].date)}; צמודים ${nis(r.pay.linkedTotal)} מתוך ${nis(r.pay.total)}. המדד עלה מאז חודש הבסיס ${kbMonthHe(r.pay.baseMonth)} ב-${last ? money(last.change, 1) : '0'}% עד ${last ? kbMonthHe(last.month) : ''}; הפרשי ההצמדה ${nis(r.pay.diffTotal)}.`;
	return `<figure class="${P}-fig"><svg class="${P}-strip" viewBox="0 0 ${W} 190" role="img" aria-labelledby="${P}-strip-t ${P}-strip-d" focusable="false"><title id="${P}-strip-t">לוח התשלומים וקו מדד תשומות הבנייה</title><desc id="${P}-strip-d">${esc(sum)}</desc>`
		+ `<line class="${P}-axis" x1="${L}" x2="${R}" y1="${BASE}" y2="${BASE}"></line>${bars}`
		+ (pts ? `<polyline class="${P}-idx" points="${pts}"></polyline>` : '')
		+ (last ? `<text class="${P}-lbl ${P}-lbl--idx" x="${Math.max(L + 30, Math.min(R - 30, x((() => { const d = known(last.month); return d > t1 ? t1 : d; })()))).toFixed(1)}" y="${Math.max(12, 70 - last.change / maxCh * 50 - 8).toFixed(1)}" text-anchor="middle">מדד ${last.change >= 0 ? '+' : '−'}${money(Math.abs(last.change), 1)}%</text>` : '')
		+ vline(r.input.deliveryDate, 'deliv', r.regime === 'new' ? 'מסירה בחוזה: סוף ההצמדה' : 'מסירה בחוזה', 176)
		+ (r.input.actualDate && r.input.actualDate !== r.input.deliveryDate ? vline(r.input.actualDate, 'actual', r.delivered ? 'נמסרה' : 'מסירה צפויה', 188) : '')
		+ vline(r.today, 'today', 'היום', 28)
		+ `<text class="${P}-lbl" x="${R}" y="${BASE + 14}" text-anchor="start">${isoToHe(t0)}</text></svg>`
		+ `<figcaption>הזמן זורם מימין לשמאל. עמודה מלאה: החלק הצמוד; עמודה פתוחה: החלק שלא צמוד. הקו הירוק: השינוי במדד מחודש הבסיס${r.pay.rows.some((p) => p.pending) ? '; החודשים שעוד לא פורסמו לא מצוירים' : ''}.</figcaption></figure>`;
}

/** The payments table: the text equivalent of the strip, with the linkage and the security for each payment. */
export function kbPayTable(reg, r) {
	const fl = reg.fl_kablan;
	const rows = r.pay.rows.map((p) => `<tr${p.past ? '' : ` class="${P}-future"`}><th scope="row"><bdi>${isoToHe(p.date)}</bdi><small>תשלום ${p.n}, ${p.pct}%</small></th>`
		+ `<td data-th="סכום ובטוחה">${ils(p.amount, 0)}${p.secured ? `<small>בטוחה על ${nis(p.secured)}, עד ${isoToHe(p.guaranteeBy)}</small>` : `<small>בתוך ${fl.guarantee.free_pct}% שמותר בלי בטוחה</small>`}</td>`
		+ `<td data-th="צמוד">${p.linked ? `${ils(p.linked, 0)}<small>מדד ${kbMonthHe(p.indexUsed)}${p.capped ? `, עד המסירה בחוזה ${isoToHe(p.capDate)}` : ''}${p.pending ? ` (של ${kbMonthHe(p.indexMonth)} עוד לא פורסם)` : ''}</small>` : `לא צמוד${p.unlinked && r.regime === 'new' ? '<small>מתוך 20% הראשונים</small>' : ''}`}</td>`
		+ `<td data-th="הפרש הצמדה">${p.linked ? `${ils(p.diff, 0)}${p.pending ? '<small>עד כה</small>' : ''}` : '—'}</td></tr>`).join('');
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-pay-cap" tabindex="0"><table class="jtool-table ${P}-pays"><caption id="${P}-pay-cap">התשלומים: הבטוחה, החלק הצמוד והמדד של כל תשלום. מדד בסיס: ${kbMonthHe(r.pay.baseMonth)} (${money(r.pay.base.published, 1)}, בסיס ${esc(r.pay.base.base === '2011-07' ? 'יולי 2011' : 'יולי 2025')}); מקדם קישור בין הבסיסים ${fl.index.chaining.coefficient}. ${esc(fl.index.known_rule_he)}.</caption>`
		+ `<thead><tr><th scope="col">מתי</th><th scope="col">סכום ובטוחה</th><th scope="col">צמוד</th><th scope="col">הפרש הצמדה</th></tr></thead><tbody>${rows}</tbody>`
		+ `<tfoot><tr><th scope="row">סך הכול</th><td data-th="סכום ובטוחה">${ils(r.pay.total, 0)}</td><td data-th="צמוד">${ils(r.pay.linkedTotal, 0)}</td><td data-th="הפרש הצמדה">${ils(r.pay.diffTotal, 0)}</td></tr></tfoot></table></div>`;
}

/** The delay compensation month by month (s.5א). */
export function kbDelayTable(reg, r) {
	const fl = reg.fl_kablan;
	const d = r.delay;
	const dl = fl.delay[r.regime];
	const head = `<p class="jtool-scope">${esc(dl.rule.he)}${kbCite(dl.rule.section, dl.rule.url)}. ${esc(dl.pay.he)}${kbCite(dl.pay.section, dl.pay.url)}.</p>`;
	if (!d.months) { return `${head}<p class="jtool-scope">לפי התאריכים אין איחור: המסירה ${r.input.actualDate ? 'בפועל או הצפויה' : ''} לא אחרי ${isoToHe(r.input.deliveryDate)}.</p>`; }
	if (!d.started) { return `${head}<p class="jtool-scope">האיחור ${money(d.days, 0)} ימים, ולא עבר ${r.regime === 'new' ? 'חודש' : '60 ימים'} מהמועד שבחוזה (${isoToHe(d.startDate)}): אין פיצוי לפי הסעיף.</p>`; }
	if (d.excused) { return `${head}<p class="jtool-scope">${esc(dl.except.he)}${kbCite(dl.except.section, dl.except.url)}.</p>`; }
	const rows = d.rows.map((x) => `<tr${x.pay <= r.today ? '' : ` class="${P}-future"`}><th scope="row">חודש ${x.k}<small>${isoToHe(x.from)} עד ${isoToHe(x.to)}${x.partial ? ', חלק מחודש' : ''}</small></th><td data-th="מכפיל">× ${x.mult}<small>${esc(x.item)}</small></td><td data-th="פיצוי">${r.input.rent > 0 ? ils(x.amount, 0) : '—'}</td><td data-th="משולם עד"><bdi>${isoToHe(x.pay)}</bdi></td></tr>`).join('');
	return `${head}<div class="jtool-scroll" role="region" aria-labelledby="${P}-delay-cap" tabindex="0"><table class="jtool-table"><caption id="${P}-delay-cap">איחור של ${d.months} חודשים מ-${isoToHe(r.input.deliveryDate)}${d.toToday ? ' עד היום' : d.expected ? ` עד המסירה הצפויה ${isoToHe(r.input.actualDate)}` : ` עד ${isoToHe(r.input.actualDate)}`}; פיצוי על ${d.compMonths} חודשים${r.input.rent > 0 ? `, לפי שכר דירה של ${nis(r.input.rent)}` : ''}. אם החוזה נותן פיצוי גבוה יותר, מגיע הגבוה (${esc(dl.rule.section)}).</caption>`
		+ `<thead><tr><th scope="col">חודש האיחור</th><th scope="col">מכפיל</th><th scope="col">פיצוי</th><th scope="col">משולם עד</th></tr></thead><tbody>${rows}</tbody>`
		+ `<tfoot><tr><th scope="row">סך הכול</th><td data-th="מכפיל">${d.compMonths} חודשים</td><td data-th="פיצוי">${r.input.rent > 0 ? ils(d.total, 0) : '—'}</td><td data-th="משולם עד">${r.input.rent > 0 && d.paidByToday ? `${nis(d.paidByToday)} כבר היו צריכים להיות משולמים` : '—'}</td></tr></tfoot></table></div>`;
}

/** The warranty clock: a track per kind of defect from the delivery day, inspection solid, warranty hatched, today. */
export function kbClock(reg, r) {
	const w = r.warranty;
	const fl = reg.fl_kablan.warranty;
	const X0 = 296; const X1 = 8; const YEARS = fl.fundamental_years; const RH = 20;
	const xy = (years) => X0 - (years / YEARS) * (X0 - X1);
	const items = w.items.slice().sort((a, b) => a.years - b.years || a.n - b.n);
	const near = new Set(w.nearest.map((e) => (e.kind === 'insp' || e.kind === 'warr' ? `${e.kind}${e.n}` : e.kind)));
	const todayY = daysBetween(w.d0, r.today) / 365.25;
	const rowsSvg = items.map((it, i) => {
		const y = 18 + i * RH;
		const hot = near.has(`insp${it.n}`) || near.has(`warr${it.n}`) ? ` ${P}-row--near` : '';
		return `<g class="${P}-row${hot}"><text class="${P}-lbl ${P}-lbl--row" x="412" y="${y + 12}" text-anchor="start">${esc(it.short_he || it.he)} · ${it.years}</text>`
			+ `<rect class="${P}-insp" x="${xy(it.years).toFixed(1)}" y="${y + 3}" width="${(X0 - xy(it.years)).toFixed(1)}" height="12"></rect>`
			+ `<rect class="${P}-warr" x="${xy(it.years + fl.warranty_years).toFixed(1)}" y="${y + 3}" width="${(xy(it.years) - xy(it.years + fl.warranty_years)).toFixed(1)}" height="12"></rect></g>`;
	}).join('');
	const yF = 18 + items.length * RH;
	const fund = `<g class="${P}-row${near.has('fund') ? ` ${P}-row--near` : ''}"><text class="${P}-lbl ${P}-lbl--row" x="412" y="${yF + 12}" text-anchor="start">אי-התאמה יסודית · 20</text><rect class="${P}-fund" x="${X1}" y="${yF + 3}" width="${X0 - X1}" height="12"></rect></g>`;
	const vis = `<line class="${P}-visible" x1="${xy(fl.visible_years).toFixed(1)}" x2="${xy(fl.visible_years).toFixed(1)}" y1="10" y2="${yF + 18}"></line>`;
	const tY = todayY >= 0 && todayY <= YEARS ? `<line class="${P}-today" x1="${xy(todayY).toFixed(1)}" x2="${xy(todayY).toFixed(1)}" y1="6" y2="${yF + 20}"></line><text class="${P}-lbl ${P}-lbl--today" x="${xy(todayY).toFixed(1)}" y="${yF + 32}" text-anchor="middle">היום</text>` : '';
	const ticks = [0, 5, 10, 15, 20].map((t) => `<text class="${P}-lbl ${P}-tick" x="${xy(t).toFixed(1)}" y="8" text-anchor="middle">${t}</text>`).join('');
	const n = w.nearest[0];
	const sum = `מיום ${w.fromContract ? 'המסירה שבחוזה' : 'המסירה'} ${isoToHe(w.d0)}: תקופות הבדק בין שנה לשבע שנים לפי סוג הליקוי, ואחריהן שלוש שנות אחריות; אי-התאמה יסודית 20 שנים, עד ${isoToHe(w.fundamental)}. ${n ? `המועד הקרוב: ${isoToHe(n.date)}, ${n.he} (${kbLeft(w.nearestLeft)}).` : ''}`;
	return `<figure class="${P}-fig"><svg class="${P}-clock" viewBox="0 0 420 ${yF + 38}" role="img" aria-labelledby="${P}-clock-t ${P}-clock-d" focusable="false"><title id="${P}-clock-t">שעון הבדק והאחריות לפי סוג הליקוי</title><desc id="${P}-clock-d">${esc(sum)}</desc>${ticks}${rowsSvg}${fund}${vis}${tY}</svg>`
		+ `<figcaption>שנים מיום ${w.fromContract ? 'המסירה שבחוזה' : 'המסירה'}, מימין לשמאל. מלא: תקופת הבדק (התוספת לחוק); מקווקו: שלוש שנות האחריות (${esc(fl.warranty.section)}); קו מנוקד: שנה להודעה על מה שאפשר היה לגלות במסירה (${esc(fl.visible.section)}).</figcaption></figure>`;
}

export function kbClockTable(reg, r) {
	const w = r.warranty;
	const fl = reg.fl_kablan.warranty;
	const nearDate = w.nearestDate;
	const tr = (he, end, rule, extra = '') => `<tr${end === nearDate ? ` class="${P}-near"` : ''}><th scope="row">${esc(he)}</th><td data-th="עד"><bdi>${isoToHe(end)}</bdi>${end === nearDate ? '<small>המועד הקרוב</small>' : ''}</td><td data-th="נשארו">${kbLeft(daysBetween(r.today, end))}</td><td data-th="הכלל">${rule}${extra}</td></tr>`;
	const rows = [tr('הודעה על ליקוי שאפשר היה לגלות במסירה', w.visible, kbCite(fl.visible.section, fl.visible.url))]
		.concat(w.items.slice().sort((a, b) => a.years - b.years || a.n - b.n).map((it) => tr(`${it.he}: בדק ${it.years === 1 ? 'שנה' : `${it.years} שנים`}`, it.inspEnd, kbCite(it.item, fl.inspection.url)) + tr(`${it.short_he || it.he}: אחריות 3 שנים`, it.warrEnd, kbCite(fl.warranty.section, fl.warranty.url))))
		.concat([tr('אי-התאמה יסודית', w.fundamental, kbCite(fl.fundamental.section, fl.fundamental.url))]);
	return `<details class="jtool-more ${P}-clockmore"><summary>כל התאריכים בטבלה (${w.items.length * 2 + 2} מועדים)</summary><div class="jtool-scroll" role="region" aria-labelledby="${P}-clock-cap" tabindex="0"><table class="jtool-table"><caption id="${P}-clock-cap">מיום ${w.fromContract ? 'המסירה שבחוזה (הקלידו מסירה בפועל לדיוק)' : 'המסירה'} ${isoToHe(w.d0)}. ${esc(fl.inspection.he)}. ${esc(fl.warranty.he)}. ${esc(fl.hidden.he)} (${esc(fl.hidden.section)}).</caption>`
		+ `<thead><tr><th scope="col">מה</th><th scope="col">עד</th><th scope="col">נשארו</th><th scope="col">הכלל</th></tr></thead><tbody>${rows.join('')}</tbody></table></div></details>`;
}

/** The securities checklist (Investments Law), by stage. */
export function kbChecklist(reg, r) {
	const g = reg.fl_kablan.guarantee;
	const fl = reg.fl_kablan;
	const li = (x) => `<li>${esc(x.he)}${kbCite(x.section, x.url)}</li>`;
	return `<div class="${P}-check"><p class="${P}-check__h">לפני החתימה</p><ul>${[g.notice, g.free, fl.linkage.half, fl.delay.waiver].map(li).join('')}</ul>`
		+ `<p class="${P}-check__h">בכל תשלום</p><ul>${[g.voucher, g.per_payment, g.vat, g.costs, g.lender, g.cap].map(li).join('')}</ul>`
		+ `<p class="${P}-check__h">הבטוחות שהחוק מכיר</p><ul>${g.securities.map(li).join('')}</ul>`
		+ `<p class="${P}-check__h">אחרי המסירה</p><ul>${[g.replace, fl.registration, fl.warranty.repair, fl.legal_fees].map(li).join('')}</ul>`
		+ `<button class="jtool-btn" type="button" data-act="copy-list">להעתיק את רשימת הבדיקה</button></div>`;
}

export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const d = r.delay;
	const sc = reg.small_claims;
	const ceiling = sc && sc.ceiling && sc.ceiling.length ? sc.ceiling[sc.ceiling.length - 1].amount : 0;
	const head = { signing: 'קונים לפני חתימה על חוזה לדירה חדשה מקבלן', waiting: 'קונים של דירה חדשה מקבלן מחכים למסירה', after: 'קונים קיבלו דירה חדשה מקבלן' }[r.stage];
	let delay = '';
	if (d.compMonths && !d.excused) {
		delay = ` המסירה שבחוזה נקבעה ל-${isoToHe(r.input.deliveryDate)}; האיחור ${d.months} חודשים${d.toToday ? ' עד היום' : ''}, והפיצוי לפי סעיף 5א ${r.input.rent > 0 ? kbBand(d.total) : `על ${d.compMonths} חודשים`}.`;
	} else if (d.months) {
		delay = ` האיחור במסירה ${d.months} חודשים, בלי פיצוי לפי החוק.`;
	}
	const n = r.warranty.nearest[0];
	const near = n ? ` המועד הקרוב בבדק ובאחריות: ${isoToHe(n.date)}, ${n.he}.` : '';
	const link = r.pay.diffTotal ? ` הפרשי ההצמדה למדד תשומות הבנייה ${kbBand(r.pay.diffTotal)}.` : '';
	let q;
	if (r.stage === 'signing') {
		q = 'השאלה לתרגול: הפגישה עם עורך הדין של הקבלן לפני החתימה. מה מבקשים בלוח התשלומים, בהצמדה ובבטוחות?';
	} else if (d.compMonths && !d.excused) {
		q = `השאלה לתרגול: השיחה עם הקבלן על הפיצוי, ואם אין הסכמה, ${r.input.rent > 0 && ceiling && d.total <= ceiling ? 'תביעה קטנה' : 'תביעה בבית משפט השלום'}. איך מציגים את החישוב ומה עונים לטענת כוח עליון?`;
	} else {
		q = 'השאלה לתרגול: השיחה עם הקבלן על ליקוי שהתגלה, ואם אין תיקון, תביעה. איך מראים שהליקוי התגלה בתקופת הבדק, ומה עונים לטענה שהקונה גרם לו?';
	}
	return `${head}, במחיר ${kbPriceBand(r.input.price)}.${delay}${link}${near} ${q}`;
}

/** The "what to do now" list: the official pages and forms, the next date, and 2-4 pages of this site. */
export function nextActions(reg, r) {
	const fl = reg.fl_kablan;
	const sc = reg.small_claims;
	const out = [];
	if (r.stage === 'signing') { out.push({ he: `לבקש בכתב את ההודעה על הבטוחות ואת פנקס השוברים (${fl.guarantee.notice.section})`, url: fl.guarantee.url, official: true }); }
	out.push({ he: 'מה תיקון 9 לחוק המכר משנה בהצמדה ובפיצוי על איחור (משרד הבינוי והשיכון)', url: fl.law.amend9_url, official: true });
	const ceiling = sc && sc.ceiling && sc.ceiling.length ? sc.ceiling[sc.ceiling.length - 1].amount : 0;
	const late = r.delay.compMonths && !r.delay.excused;
	const small = late && r.input.rent > 0 && ceiling && r.delay.total <= ceiling;
	if (small) { out.push({ he: `אם הקבלן לא משלם: תביעה קטנה עד ${money(ceiling, 0)} ₪, באתר הרשות השופטת`, url: sc.service_url, official: true }); }
	if (late && r.input.rent > 0 && ceiling && r.delay.total > ceiling) { out.push({ he: `הפיצוי מעל תקרת התביעות הקטנות (${money(ceiling, 0)} ₪): אם הקבלן לא משלם, תביעה בבית משפט השלום`, url: sc.law_url, official: true }); }
	out.push({ he: 'לבדוק את המדד במחשבון ההצמדה של הלמ"ס', url: fl.index.official_calculator_url, official: true });
	const ev = r.events.find((e) => e.date >= r.today);
	if (ev) { out.push({ he: `המועד הבא: ${isoToHe(ev.date)}, ${ev.what}`, rule: ev.rule }); }
	const links = [];
	if (small) { links.push({ path: '/small-claims-court-israel/', he: 'תביעה קטנה על פיצוי איחור: האגרה והמועדים' }); }
	if (late && !small) { links.push({ path: '/real-estate-developer-defect/', he: 'תביעה נגד קבלן: איחור וליקויים' }); }
	if (r.stage === 'after' && !(late && !small)) { links.push({ path: '/real-estate-developer-defect/', he: 'ליקויי בנייה מקבלן: הזכויות והתביעה' }); }
	links.push({ path: '/hatzmada-madad/', he: 'מחשבון הצמדה למדד המחירים לצרכן' });
	if (r.stage === 'signing') { links.push({ path: '/acquisition-tax-brackets-2026/', he: 'כמה מס רכישה על הדירה' }, { path: '/real-estate-lawyer-cost-2025/', he: 'כמה עולה עורך דין לקניית דירה' }); }
	if (r.stage !== 'signing') { links.push({ path: '/tabu-registration-fees-2026/', he: 'רישום הדירה בטאבו: האגרות' }); }
	links.push({ path: '/real-estate-attorney/', he: 'כל הנושאים בדיני מקרקעין' });
	return { official: out, links: links.slice(0, 4) };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const fl = reg.fl_kablan;
	const d = r.delay;
	const comp = d.compMonths && !d.excused && r.input.rent > 0;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי חוק המכר (דירות)${r.regime === 'new' ? ' בנוסח תיקון 9' : ', הנוסח שלפני תיקון 9'} ומדד הלמ"ס עד ${kbMonthHe(fl.index.latest_month)}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${comp ? `הפיצוי על איחור של ${d.months} חודשים במסירה` : 'הפרשי ההצמדה למדד תשומות הבנייה'} · ${esc(kbStage[r.stage])}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(comp ? d.total : r.pay.diffTotal, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<p class="jtool-scope">המדד הבא יחול מ-${isoToHe(fl.next_update)}. שכר הדירה, המחיר והתאריכים הם שלכם; החוק לא קובע שכר דירה.</p></div>`
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-part"><h3 id="${P}-h-pay">1. התשלומים וההצמדה למדד תשומות הבנייה</h3>${kbStrip(reg, r)}${kbPayTable(reg, r)}</div>`
		+ `<div class="${P}-part"><h3 id="${P}-h-delay">2. איחור במסירה: הפיצוי לפי סעיף 5א</h3>${kbDelayTable(reg, r)}</div>`
		+ `<div class="${P}-part"><h3 id="${P}-h-clock">3. שעון הבדק והאחריות</h3>${kbClock(reg, r)}${kbClockTable(reg, r)}</div>`
		+ `<div class="${P}-part"><h3 id="${P}-h-check">4. הבטוחות: רשימת בדיקה לפי חוק ההבטחה</h3>${kbChecklist(reg, r)}</div>`
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${KB_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את השיחה עם הנתונים שלכם</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li>${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a>` : esc(x.he)}${x.rule ? ` (${esc(x.rule)})` : ''}</li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

export function deadlinesTable(reg, r) {
	if (!r.events.length) { return '<p class="jtool-scope">אין מועדים עתידיים לפי התאריכים שהוקלדו.</p>'; }
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => `<tr><td data-th="עד תאריך"><bdi>${isoToHe(e.date)}</bdi></td><td data-th="מה">${esc(e.what)}</td><td data-th="הכלל">${esc(e.rule)}</td></tr>`).join('')
		+ `</tbody><caption>${r.events.length} מועדים מהיום: תשלומים, הערבויות, הפיצוי על האיחור וסופי הבדק והאחריות. ספירת 14 ימי העסקים לערבות: ימים א'-ה' בלי ימי המנוחה שבחוק.</caption></table></div>`;
}

/** The one-page buyer sheet: inputs, result, the computation path, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const fl = reg.fl_kablan;
	const d = r.delay;
	const n = r.warranty.nearest[0];
	return `<h3>קניית דירה מקבלן: דף הקונה</h3>`
		+ `<p><strong>החוזה:</strong> מחיר ${nis(r.input.price)}; נחתם ${isoToHe(r.input.signDate)} (${r.regime === 'new' ? 'חל תיקון 9' : 'לפני תיקון 9'}); מסירה בחוזה ${isoToHe(r.input.deliveryDate)}${r.input.actualDate ? `; מסירה ${r.delivered ? 'בפועל' : 'צפויה'} ${isoToHe(r.input.actualDate)}` : ''}; ${r.pay.rows.length} תשלומים; צמוד ${r.input.linkShare}% מכל תשלום.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>דרך החישוב:</strong></p><ol><li>הצמדה: ${r.pay.rows.filter((p) => p.linked).map((p) => `${nis(p.linked)} × (${kbMonthHe(p.indexUsed)} / ${kbMonthHe(r.pay.baseMonth)} − 1) = ${nis(p.diff)}`).join('; ')} (${esc(fl.linkage.half.section)}, ${esc(fl.linkage.until.section)}; מקדם קישור ${fl.index.chaining.coefficient})</li>`
		+ `<li>איחור: ${d.compMonths ? `${d.compMonths} חודשים, ${d.rows.map((x) => `×${x.mult}`).join(' ')}${r.input.rent > 0 ? ` על ${nis(r.input.rent)} = ${nis(d.total)}` : ''}` : 'אין פיצוי לפי הסעיף'} (${esc(fl.delay[r.regime].rule.section)})</li>`
		+ `<li>בדק ואחריות מ-${isoToHe(r.warranty.d0)}: ${n ? `המועד הקרוב ${isoToHe(n.date)}, ${esc(n.he)}` : ''}; יסודית עד ${isoToHe(r.warranty.fundamental)} (${esc(fl.warranty.fundamental.section)})</li></ol>`
		+ (r.events.length ? `<p><strong>מועדים:</strong> ${r.events.slice(0, 14).map((e) => `${isoToHe(e.date)} ${esc(e.what)}`).join('; ')}${r.events.length > 14 ? ` ועוד ${r.events.length - 14}` : ''}.</p>` : '')
		+ `<p><strong>מקורות:</strong> ${fl.sources.map((s) => `${esc(s.he)} (${esc(s.sections_he)})`).join('; ')}. נבדק ${isoToHe(fl.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const fl = reg.fl_kablan;
	return `<div class="${P}-screen"><div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">כל המועדים ליומן</h3>${r.events.length ? '<div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">דף הקונה להדפסה</button></div>' : ''}</div>${deadlinesTable(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-law-h">מה החוק אומר, בקצרה</h3></div><ul class="${P}-list">${[fl.linkage.none, fl.linkage.half, fl.linkage.until, fl.linkage.index_def, fl.arrears.rule, fl.delay.new.except, fl.delay.waiver].map((x) => `<li>${esc(x.he)}${kbCite(x.section, x.url)}</li>`).join('')}<li>${esc(fl.linkage.first20_he)}${kbCite('תיקון 9', fl.linkage.first20_url)}</li><li>${esc(fl.linkage.old_he)}</li></ul></div></div>`
		+ `<div class="${P}-print">${printSummary(reg, r, opts.printedOn || r.today)}</div>`;
}

/** Page section: the inspection periods of the addendum, and the two versions of the delay compensation. */
export function compareTable(reg) {
	const fl = reg.fl_kablan;
	const w = fl.warranty;
	const rows = w.items.slice().sort((a, b) => a.years - b.years || a.n - b.n).map((it) => `<tr><td data-th="סוג הליקוי">${esc(it.he)}</td><td data-th="תקופת בדק">${it.years === 1 ? 'שנה' : `${it.years} שנים`}</td><td data-th="סוף האחריות">${it.years + w.warranty_years} שנים מהמסירה</td><td data-th="הכלל">${esc(it.item)}</td></tr>`).join('');
	const tier = (t) => `${t.to_month ? `חודשים ${t.from_month}-${t.to_month}` : `מחודש ${t.from_month}`}: דמי שכירות × ${t.mult}`;
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>תקופות הבדק והאחריות לפי סוג הליקוי: התוספת לחוק המכר (דירות) וסעיף 4(ג); אי-התאמה יסודית 20 שנים (סעיף 4(א)(4)); הודעה על ליקוי גלוי תוך שנה (סעיף 4א). נבדק ${isoToHe(fl.checked_on)}.</caption><thead><tr><th scope="col">סוג הליקוי</th><th scope="col">תקופת בדק</th><th scope="col">סוף האחריות</th><th scope="col">הכלל</th></tr></thead><tbody>${rows}</tbody></table></div>`
		+ `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>הפיצוי על איחור במסירה לפי סעיף 5א: שני הנוסחים, לפי יום החתימה על החוזה.</caption><thead><tr><th scope="col">חוזה</th><th scope="col">מתי מתחיל</th><th scope="col">המדרגות</th></tr></thead><tbody>`
		+ `<tr><td data-th="חוזה">נחתם מ-${isoToHe(fl.delay.new.from)}</td><td data-th="מתי מתחיל">אחרי חודש מהמועד שבחוזה</td><td data-th="המדרגות">${fl.delay.new.tiers.map(tier).join('; ')}</td></tr>`
		+ `<tr><td data-th="חוזה">נחתם עד ${isoToHe(fl.delay.old.to)}</td><td data-th="מתי מתחיל">אחרי 60 ימים, מהיום הראשון</td><td data-th="המדרגות">${fl.delay.old.tiers.map(tier).join('; ')}</td></tr></tbody></table></div>`;
}

export function snapshot(reg) {
	const fl = reg.fl_kablan;
	const r = kbCompute(reg, Object.assign({}, EXAMPLE, { today: fl.checked_on }));
	const p = r.pay.rows;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.delay.total,
		sticky: kbStickyFigure(r),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: fl.checked_on }),
		method: `<ol><li>המדד הבסיסי: המדד הידוע ביום החתימה ${isoToHe(EXAMPLE.signDate)} הוא מדד ${kbMonthHe(r.pay.baseMonth)}, ${money(r.pay.base.published, 1)} (בסיס יולי 2011)${kbCite(fl.linkage.index_def.section, fl.linkage.index_def.url)}</li>`
			+ `<li>20% הראשונים (התשלום בחתימה, ${nis(p[0].amount)}) לא צמודים; מכל תשלום אחר צמוד ${EXAMPLE.linkShare}%${kbCite(fl.linkage.half.section, fl.linkage.half.url)}</li>`
			+ `<li>התשלום האחרון (${isoToHe(p[4].date)}) צמוד רק עד המסירה שבחוזה ${isoToHe(EXAMPLE.deliveryDate)}: מדד ${kbMonthHe(p[4].indexUsed)}, ${money(kbIndex(reg, p[4].indexUsed).published, 1)} בבסיס יולי 2025, כפול מקדם הקישור ${fl.index.chaining.coefficient}${kbCite(fl.linkage.until.section, fl.linkage.until.url)}</li>`
			+ `<li>הפרשי ההצמדה: ${p.filter((x) => x.linked).map((x) => nis(x.diff)).join(' + ')} = ${nis(r.pay.diffTotal)}</li>`
			+ `<li>איחור מ-${isoToHe(EXAMPLE.deliveryDate)} עד ${isoToHe(EXAMPLE.actualDate)}: ${r.delay.months} חודשים (חודש או חלק ממנו); החודש הראשון בלי פיצוי, חודשים 2-4 × 1, חודשים 5-${r.delay.months} × 1.25: ${nis(r.delay.total)}${kbCite(fl.delay.new.rule.section, fl.delay.new.rule.url)}</li>`
			+ `<li>שעון הבדק מ-${isoToHe(r.warranty.d0)}: המועד הקרוב ${isoToHe(r.warranty.nearestDate)}${kbCite(fl.warranty.visible.section, fl.warranty.visible.url)}; יסודית עד ${isoToHe(r.warranty.fundamental)}</li></ol>`,
		compare_table: compareTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Share state ---------------- */

export const KEYS = ['p', 's', 'd', 'a', 'r', 'l', 'y', 'b', 'x'];
export const stateOf = (i) => encodeState({
	p: i.price === '' || i.price === undefined ? '' : Math.round(Number(i.price)), s: i.signDate || '', d: i.deliveryDate || '', a: i.actualDate || '',
	r: i.rent === '' || i.rent === undefined || i.rent === null ? '' : Math.round(Number(i.rent)), l: i.linkShare === '' || i.linkShare === undefined ? '' : i.linkShare,
	y: (i.payments || []).map((p) => [String(p.pct), p.date || '']), b: i.baseMonth || '', x: i.excused ? 1 : '',
});
export function inputOf(s) {
	if (!s.p || !s.s) { return null; }
	return {
		price: Number(s.p), signDate: s.s, deliveryDate: s.d || '', actualDate: s.a || '', rent: s.r === undefined || s.r === '' ? '' : Number(s.r),
		linkShare: s.l === undefined || s.l === '' ? 0 : Number(s.l), payments: decodeList(s.y).map(([pct, date]) => ({ pct: Number(pct), date })),
		baseMonth: s.b || '', excused: s.x === '1',
	};
}

/* ---------------- Browser ---------------- */

function kbMonthIso(text) {
	const m = String(text || '').trim().match(/^(\d{1,2})[./-](\d{4})$/);
	return m ? `${m[2]}-${m[1].padStart(2, '0')}` : String(text || '').trim();
}

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const m = (sel) => { const v = val(sel).trim(); return v === '' ? '' : parseMoney(v); };
	const pcts = [...root.querySelectorAll(`.${P}-pct`)];
	const dates = [...root.querySelectorAll(`.${P}-pdate`)];
	return {
		price: m(`#${P}-price`), signDate: kbToIso(val(`#${P}-sign`)), deliveryDate: kbToIso(val(`#${P}-deliv`)), actualDate: kbToIso(val(`#${P}-actual`)),
		rent: m(`#${P}-rent`), linkShare: val(`#${P}-share`).trim() === '' ? 0 : Number(val(`#${P}-share`).replace('%', '')),
		payments: pcts.map((el, i) => ({ pct: el.value.trim() === '' ? NaN : Number(el.value.replace('%', '')), date: kbToIso((dates[i] || {}).value) })),
		baseMonth: kbMonthIso(val(`#${P}-base`)), excused: Boolean(root.querySelector(`input[name="${P}-exc"]:checked`)),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const fl = reg.fl_kablan;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(fl.checked_on, fl.refresh_every_days) || (fl.next_update && today >= fl.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שפורסם מדד חדש'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const ids = { price: 'price', signDate: 'sign', deliveryDate: 'deliv', actualDate: 'actual', rent: 'rent', linkShare: 'share', baseMonth: 'base' };
		for (const e of r.errors) {
			const id = ids[e.field] || (/^pay|paysum/.test(e.field) ? 'pays' : '');
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = `${box.textContent ? `${box.textContent} ` : ''}${e.he}`; }
			const f = id && id !== 'pays' && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = (input) => {
		const key = kbPresetOf(input.payments);
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = kbCompute(reg, Object.assign({}, input, { today }));
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { printedOn: today });
		if (sticky) { sticky.innerHTML = kbStickyFigure(r); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: `${r.stage}-${r.regime}-${r.delay.compMonths ? 'late' : 'ontime'}` }); }
		return r;
	};
	const rerender = (input) => { form.innerHTML = renderForm(reg, input); sync(input); return run(input); };
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = readForm(root); sync(input); run(input); }, 160);
	};
	// The server HTML was computed on the day the data was checked; the live page recomputes for today at once.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (fromHash) {
		rerender(fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
	} else if (today !== fl.checked_on) {
		run(EXAMPLE, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'preset' || act === 'addpay' || act === 'delpay') {
			const input = readForm(root);
			if (act === 'preset') {
				const key = b.getAttribute('data-preset');
				const sd = input.signDate && /^\d{4}-\d{2}-\d{2}$/.test(input.signDate) ? input.signDate : EXAMPLE.signDate;
				const dd = input.deliveryDate && /^\d{4}-\d{2}-\d{2}$/.test(input.deliveryDate) && input.deliveryDate > sd ? input.deliveryDate : addMonths(sd, 36);
				input.payments = kbPresetPayments(key, sd, dd);
				track('tool_preset', { tool_id: TOOL_ID, band: key });
			} else if (act === 'addpay') {
				input.payments.push({ pct: NaN, date: '' });
			} else {
				input.payments.splice(Number(b.getAttribute('data-i')), 1);
			}
			rerender(input);
			return;
		}
		const input = readForm(root);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok && r.events.length) {
			download('dira-mikablan.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `דירה מקבלן: ${e.what}`, description: `${e.rule}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או כתובת.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק המכר (דירות) ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(fl.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy-list' && r.ok) {
			const g = fl.guarantee;
			const lines = [g.notice, g.free, g.voucher, g.per_payment, g.vat, g.costs, g.lender, ...g.securities, g.replace, fl.registration].map((x) => `- ${x.he} (${x.section})`);
			const ok = await copyText(`רשימת בדיקה: קניית דירה מקבלן\n${lines.join('\n')}`);
			toast(root, ok ? 'רשימת הבדיקה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy-list' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when the popup or the protocol is unavailable, it goes to the clipboard and the link opens.
			const brief = r.ok ? aiBrief(reg, r) : '';
			const purpose = (/purpose=([a-z_]+)/.exec(b.getAttribute('href') || '') || [])[1] || 'court_rehearsal';
			if (brief && openSimulation(brief, purpose, b.getAttribute('href'))) {
				ev.preventDefault();
				toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.');
			} else {
				if (brief) { copyText(brief); }
				toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			}
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.stage : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { rerender(s); }
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
