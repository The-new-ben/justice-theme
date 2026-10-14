/**
 * Wave 5 UI: capital gains tax on selling a home, and what is left in hand (HAD-504). The holding strip lays the years
 * of ownership on the law's periods (7.11.2001, 1.1.2012, 1.1.2014): each period with its rate, the exempt part in teal.
 * The table, the three scenarios and the .ics say the same in text.
 */
import { compute, STATUSES } from './shevach-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'mas-shevach';
const P = 'jt14';

export const EXAMPLE = { status: 'qualified', buyDate: '2010-06-01', buyPrice: 1200000, buyCosts: 60000, improve: '', improveDate: '', saleDate: '2026-10-01', salePrice: 2600000, saleCosts: 30000, mortgage: '', priorExempt: false, rented: false };

const STATUS_LONG = { single: 'הדירה היחידה שלי', qualified: 'דירה נוספת למגורים (גם מושכרת)', other: 'נכס שאינו דירת מגורים' };
const PATH_LABEL = { exempt: 'פטור: דירה יחידה', partial: 'פטור חלקי: מעל התקרה', linear: 'החישוב הלינארי המוטב', regular: 'חישוב רגיל', loss: 'אין שבח' };
const MARK = { bad: '✕', warn: '!', info: 'i', ok: '✓' };
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const pct1 = (x) => `${(x * 100).toFixed(1)}%`;
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
const monthHe = (key) => `${Number(key.slice(5))}.${key.slice(0, 4)}`;

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const sv = reg.shevach;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const dateField = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(value || ''))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const moneyField = (id, label, value, ph, hint = '') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(value === '' || value === undefined || value === null ? '' : money(value, 0))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>${hint ? `<p class="jtool-hint">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const st = STATUSES.includes(input.status) ? input.status : 'single';
	return `<fieldset class="jtool-field"><legend>מה נמכר</legend><div class="jtool-chips">${STATUSES.map((k) => chip('st', k, STATUS_LONG[k], st === k)).join('')}</div>`
		+ `<p class="jtool-hint" data-if-status="single"${st === 'single' ? '' : ' hidden'}>${esc(sv.single_he)}.</p><p class="jtool-hint" data-if-status="qualified"${st === 'qualified' ? '' : ' hidden'}>${esc(sv.qualified_he)}.</p></fieldset>`
		+ `<div class="jtool-row">${dateField('bd', 'יום הרכישה', input.buyDate, 'לדוגמה: 1.6.2010')}${moneyField('bp', 'מחיר הרכישה', input.buyPrice, 'לדוגמה: 1,200,000')}</div>`
		+ `<div class="jtool-row">${dateField('sd', 'יום המכירה (חתימת החוזה)', input.saleDate, 'לדוגמה: 1.10.2026')}${moneyField('spr', 'מחיר המכירה', input.salePrice, 'לדוגמה: 2,600,000')}</div>`
		+ `<details class="jtool-more"${input.buyCosts || input.improve || input.saleCosts ? ' open' : ''}><summary>הוצאות שמנכים מהשבח</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${moneyField('bc', 'הוצאות ברכישה', input.buyCosts, '0', 'מס רכישה, עורך דין, תיווך (עד 2%), שמאי')}${moneyField('sc', 'הוצאות במכירה', input.saleCosts, '0', 'עורך דין, תיווך (עד 2%), שמאי')}</div>`
		+ `<div class="jtool-row">${moneyField('imp', 'שיפוצים והשבחות', input.improve, '0', 'לא תיקונים שוטפים')}<div data-if-improve${input.improve ? '' : ' hidden'}>${dateField('id', 'מתי (בערך) שופצה הדירה', input.improveDate, 'לדוגמה: 1.6.2015')}</div></div></details>`
		+ `<details class="jtool-more"${input.mortgage || input.priorExempt || input.rented ? ' open' : ''}><summary>עוד פרטים</summary>`
		+ `<div style="margin-top:8px">${moneyField('mtg', 'יתרת משכנתא לסילוק (לחישוב מה נשאר ביד)', input.mortgage, '0')}</div>`
		+ `<div class="jtool-chips">${chip('pe', '1', 'מכרתי דירה אחרת בפטור כזה ב-18 החודשים שלפני', input.priorExempt, 'checkbox')}${chip('rn', '1', 'הדירה הושכרה', input.rented, 'checkbox')}</div></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	if (r.path === 'loss') { return `אין שבח: ${nis(r.salePrice)} לא עולה על מחיר הרכישה וההוצאות.`; }
	if (r.path === 'exempt') { return `פטור ממס שבח כדירה יחידה: שבח של ${nis(r.gain)}, מס 0. נשאר לכם ${nis(r.net)} אחרי הוצאות המכירה${r.mortgage ? ' והמשכנתא' : ''}.`; }
	return `שבח של ${nis(r.gain)}, מתוכו ${nis(r.inflationary)} אינפלציה ו-${nis(r.realGain)} שבח ריאלי.`
		+ ` מס משוער ${nis(r.tax)} (${PATH_LABEL[r.path]}), ${pct1(r.effective)} מהשבח. נשאר לכם ${nis(r.net)}.`;
}

/** The holding strip: ownership laid on the law's periods, each part with its rate. */
function strip(reg, r) {
	if (!r.ok || r.path === 'loss') { return ''; }
	const sv = reg.shevach;
	const d = sv.dates;
	const P0 = r.shares.days;
	const segs = [];
	const dayShare = (from, to) => Math.max(0, Math.min(Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000), P0)) / P0;
	const maxIso = (a, b) => (a > b ? a : b);
	const minIso = (a, b) => (a < b ? a : b);
	const add = (from, to, label, rate, kind) => {
		const a = maxIso(from, r.buyDate);
		const b = minIso(to, r.saleDate);
		if (b > a) { segs.push({ share: dayShare(a, b), label, rate, kind }); }
	};
	const exemptAll = r.path === 'exempt';
	if (exemptAll) {
		add('1900-01-01', '2999-01-01', 'כל התקופה: פטור', 0, 'free');
	} else if (r.path === 'linear' || (r.path === 'partial' && r.linear)) {
		add('1900-01-01', d.transition, 'עד 1.1.2014: פטור', 0, 'free');
		add(d.transition, '2999-01-01', `מ-1.1.2014: ${sv.rates.post2012}%`, sv.rates.post2012, 'tax');
	} else {
		add('1900-01-01', d.start, `עד 7.11.2001: ${sv.rates.pre2001}%`, sv.rates.pre2001, 'top');
		add(d.start, d.change, `2001-2011: עד ${sv.rates.mid}%`, sv.rates.mid, 'mid');
		add(d.change, '2999-01-01', `מ-2012: ${sv.rates.post2012}%`, sv.rates.post2012, 'tax');
	}
	return `<div class="jt14-strip" role="img" aria-label="${esc(segs.map((s) => `${s.label}, ${pct1(s.share)} מהתקופה`).join('; '))}">`
		+ `<p class="jt14-strip__h">השבח הריאלי לפי תקופות הבעלות (${esc(isoToHe(r.buyDate))} עד ${esc(isoToHe(r.saleDate))})</p>`
		+ `<div class="jt14-strip__bar">${segs.map((s) => `<span class="jt14-seg jt14-seg--${s.kind}" style="width:${(s.share * 100).toFixed(2)}%"><b>${s.share > 0.14 ? esc(s.label) : ''}</b></span>`).join('')}</div>`
		+ `<p class="jt14-strip__legend">${segs.map((s) => `<span><i class="jt14-k jt14-k--${s.kind}"></i>${esc(s.label)} · ${pct1(s.share)}</span>`).join('')}</p></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const state = r.path === 'exempt' ? '<p class="jtool-state jtool-state--ok">✓ פטור ממס שבח</p>' : r.path === 'loss' ? '<p class="jtool-state jtool-state--info">אין שבח</p>' : `<p class="jtool-state jtool-state--info">${esc(PATH_LABEL[r.path])}</p>`;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}מס שבח משוער</p>`
		+ `<strong class="jtool-verdict__figure">${ilsn(r.tax)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>שבח</dt><dd>${ils(Math.max(r.gain, 0), 0)}</dd></div><div><dt>שבח ריאלי</dt><dd>${ils(r.realGain, 0)}</dd></div><div><dt>נשאר ביד</dt><dd>${ils(r.net, 0)}</dd></div></dl></div>`
		+ strip(reg, r)
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li><strong aria-hidden="true">${MARK[f.level]}</strong> ${esc(f.he)}</li>`).join('')}</ul>` : '');
}

export function deadlines(reg, r) { return r.ok ? r.deadlines : []; }

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const sv = reg.shevach;
	const law = sv.law_url;
	const rs = sv.rate_sections;
	const rows = [
		['מחיר המכירה', ils(r.salePrice, 0), ''],
		['מחיר הרכישה והוצאות הרכישה', ils(r.buyPrice + r.buyCosts, 0), cite(sv.deductions.section, law)],
	];
	if (r.improve) { rows.push([`שיפוצים והשבחות (${isoToHe(r.improveDate)})`, ils(r.improve, 0), cite(sv.deductions.improve_section, law)]); }
	if (r.saleCosts) { rows.push(['הוצאות המכירה', ils(r.saleCosts, 0), cite(`${sv.deductions.lawyer_section}, ${sv.deductions.broker_sell_section}`, law)]); }
	rows.push(['השבח', ilsn(Math.max(r.gain, 0)), cite('סעיף 47', law)]);
	if (r.gain > 0) {
		rows.push([`הצמדה למדד: מדד ${monthHe(r.kBuy)} עד מדד ${monthHe(r.kSale)} (המדד הידוע)`, ilsn(r.inflationary), `סכום אינפלציוני${cite('סעיף 47', law)}`]);
		rows.push(['השבח הריאלי', ilsn(r.realGain), cite('סעיף 47', law)]);
		const parts = r.path === 'linear' || (r.path === 'partial' && r.linear) ? r.linear.parts : r.regular.parts;
		const name = { pre2001: 'עד 7.11.2001', mid: '7.11.2001 עד 31.12.2011', post2012: 'מ-1.1.2012', exempt: 'עד 1.1.2014: פטור', post2014: 'מ-1.1.2014', inflation: 'אינפלציה עד 31.12.1993' };
		const sec = { pre2001: rs.pre2001, mid: rs.mid, post2012: rs.post2012, exempt: rs.linear, post2014: rs.linear, inflation: rs.inflation };
		if (r.path !== 'exempt') {
			parts.forEach((p) => rows.push([`${name[p.key]}${p.share !== null ? ` (${pct1(p.share)} מהימים)` : ''}: ${p.rate}%`, p.rate === 0 ? 'פטור' : ilsn(p.tax), cite(sec[p.key], law)]));
		}
		if (r.path === 'partial') { rows.push([`פטור יחסי עד התקרה (${pct1(r.exemptShare)} מהשבח)`, `−${ils(r.regular && r.linear ? r.linear.tax * r.exemptShare : r.regular.tax * r.exemptShare)}`, cite(sv.single.ceiling_section, sv.single.url)]); }
	}
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-calc-h">החישוב, שורה אחרי שורה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-calc-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([a, b, c]) => `<tr><td data-th="מה">${esc(a)}</td><td data-th="סכום">${b}</td><td data-th="הכלל">${c || '—'}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="מה">מס שבח משוער</td><td data-th="סכום">${ilsn(r.tax)}</td><td data-th="הכלל">${r.gain > 0 ? `${pct1(r.effective)} מהשבח` : '—'}</td></tr></tbody>`
		+ `<caption>הצמדה לפי מדד המחירים לצרכן של הלמ"ס, המדד הידוע ביום (סעיף 47). הערכה: השומה של מיסוי מקרקעין קובעת.</caption></table></div></div>`;
	// Three ways the same sale is taxed.
	const scen = [['exempt', 'דירה יחידה', r.scen.exempt], ['linear', 'לינארי מוטב', r.scen.linear], ['regular', 'חישוב רגיל', r.scen.regular]];
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-sc-h">אותה מכירה, שלוש דרכים</h3></div><div class="jt7-scns jt14-scns">`
		+ scen.map(([k, label, v]) => { const here = r.path === k || (r.path === 'partial' && k === 'exempt'); return `<div class="jt7-scn${here ? ' jt7-scn--here' : ''}"><p>${esc(label)}${here ? ' (אתם)' : ''}</p><strong>${v === null ? '—' : ils(v, 0)}</strong><small>${v === null ? (k === 'exempt' ? 'לא חל: לא דירה יחידה, או בלי 18 חודשי בעלות' : 'לא חל: נקנתה מ-2014') : k === 'exempt' ? (r.path === 'partial' ? `פטור רק עד ${money(sv.single.ceiling, 0)} ₪` : `פטור עד ${money(sv.single.ceiling, 0)} ₪`) : k === 'linear' ? 'דירת מגורים שנקנתה לפני 2014' : 'נכס אחר, או בלי ההטבות'}</small></div>`; }).join('')
		+ `</div><p class="jt7-scns__note">פטור לדירה יחידה (${esc(sv.single.section)}), החישוב הלינארי המוטב (${esc(rs.linear)}), חישוב רגיל (${esc(rs.post2012)}).</p></div>`;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-net-h">מה נשאר ביד</h3></div><dl class="jtool-breakdown jt14-net"><div><dt>מחיר המכירה</dt><dd>${ils(r.salePrice, 0)}</dd></div><div><dt>מס שבח</dt><dd>−${ilsn(r.tax)}</dd></div><div><dt>הוצאות המכירה</dt><dd>−${ils(r.saleCosts, 0)}</dd></div>${r.mortgage ? `<div><dt>סילוק המשכנתא</dt><dd>−${ils(r.mortgage, 0)}</dd></div>` : ''}<div><dt>נשאר</dt><dd>${ilsn(r.net)}</dd></div></dl></div>`;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.deadlines.map((d) => `<tr><td data-th="תאריך">${esc(isoToHe(d.date))}</td><td data-th="מה">${esc(d.he)}</td><td data-th="הכלל">${cite(d.section, law)}</td></tr>`).join('')
		+ `<tr><td data-th="תאריך">30 ימים מהשומה</td><td data-th="מה">השגה על השומה, אם לא מסכימים</td><td data-th="הכלל">${cite(sv.deadlines.objection_section, law)}</td></tr>`
		+ `<tr><td data-th="תאריך">30 ימים מההחלטה</td><td data-th="מה">ערר לוועדת הערר על ההחלטה בהשגה</td><td data-th="הכלל">${cite(sv.deadlines.appeal_section, law)}</td></tr>`
		+ `</tbody><caption>יום אחרון שחל בשבת או בחג עובר ליום שאחריו (${esc(sv.interpretation_he)}).</caption></table></div></div>`;
	return out;
}

/** Page section: the same sale with the purchase in different years, from the same engine. */
export function yearsTable(reg) {
	const years = [1995, 2005, 2010, 2013, 2016, 2020];
	const rows = years.map((y) => {
		const base = { buyDate: `${y}-06-01`, buyPrice: 1000000, saleDate: '2026-10-01', salePrice: 2500000 };
		const q = compute(reg, Object.assign({ status: 'qualified' }, base));
		const o = compute(reg, Object.assign({ status: 'other' }, base));
		return `<tr><td data-th="שנת הרכישה"><bdi>${y}</bdi></td><td data-th="שבח ריאלי">${ils(q.realGain, 0)}</td><td data-th="דירת מגורים מזכה">${ils(q.tax, 0)}</td><td data-th="בלי הטבת דירת מגורים">${ils(o.tax, 0)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מס שבח משוער על דירה שנקנתה ב-1,000,000 ₪ ונמכרת ב-1.10.2026 ב-2,500,000 ₪, בלי הוצאות, לפי שנת הרכישה (לא דירה יחידה)</caption><thead><tr><th scope="col">שנת הרכישה</th><th scope="col">שבח ריאלי</th><th scope="col">דירת מגורים מזכה</th><th scope="col">בלי הטבת דירת מגורים</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const sv = reg.shevach;
	const lin = r.linear;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.tax,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>שבח: ${money(r.salePrice, 0)} − ${money(r.buyPrice + r.buyCosts, 0)} − ${money(r.saleCosts, 0)} = ${money(r.gain, 0)} ₪${cite('סעיפים 39 ו-47', sv.law_url)}</li>`
			+ `<li>סכום אינפלציוני: ${money(r.buyPrice + r.buyCosts, 0)} ₪ צמוד ממדד ${monthHe(r.kBuy)} למדד ${monthHe(r.kSale)} = ${money(r.adjusted - r.saleCosts)} ₪, כלומר ${money(r.inflationary)} ₪ (כמו מחשבון ההצמדה של הלמ"ס)${cite('סעיף 47', sv.law_url)}</li>`
			+ `<li>שבח ריאלי: ${money(r.gain, 0)} − ${money(r.inflationary)} = ${money(r.realGain)} ₪</li>`
			+ `<li>דירת מגורים מזכה שנקנתה לפני 1.1.2014: ${pct1(r.shares.linear)} מהימים פטורים, והשאר ${sv.rates.post2012}%: ${money(lin.parts[1].gain)} × ${sv.rates.post2012}% = ${money(r.tax)} ₪${cite(sv.rate_sections.linear, sv.law_url)}</li>`
			+ `<li>בלי ההטבה, בחישוב רגיל: ${money(r.regular.tax)} ₪. ההפרש: ${money(r.regular.tax - r.tax)} ₪.</li></ol>`,
		compare_table: yearsTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	return {
		status: (root.querySelector(`input[name="${P}-st"]:checked`) || {}).value || 'single',
		buyDate: toIso(val(`#${P}-bd`)), buyPrice: m('bp'), saleDate: toIso(val(`#${P}-sd`)), salePrice: m('spr'),
		buyCosts: m('bc'), saleCosts: m('sc'), improve: m('imp'), improveDate: toIso(val(`#${P}-id`)), mortgage: m('mtg'),
		priorExempt: on('pe'), rented: on('rn'),
	};
}

const ST = { single: 's', qualified: 'q', other: 'o' };
const stateOf = (i) => encodeState({ t: ST[i.status] || 's', a: i.buyDate, b: i.buyPrice || '', c: i.saleDate, d: i.salePrice || '', e: i.buyCosts || '', f: i.saleCosts || '', g: i.improve || '', h: i.improve ? i.improveDate : '', m: i.mortgage || '', p: i.priorExempt ? 1 : '', r: i.rented ? 1 : '' });
const KEYS = ['t', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'm', 'p', 'r'];
function inputOf(s) {
	if (!s.a || !s.c) { return null; }
	const n = (v) => (v ? Number(v) : '');
	return { status: Object.keys(ST).find((k) => ST[k] === s.t) || 'single', buyDate: s.a, buyPrice: n(s.b), saleDate: s.c, salePrice: n(s.d), buyCosts: n(s.e), saleCosts: n(s.f), improve: n(s.g), improveDate: s.h || '', mortgage: n(s.m), priorExempt: s.p === '1', rented: s.r === '1' };
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const sv = reg.shevach;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(sv.checked_on, sv.refresh_every_days) || (sv.next_update && today >= sv.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהסכומים התעדכנו'); }
	}
	const ids = { buyDate: 'bd', buyPrice: 'bp', saleDate: 'sd', salePrice: 'spr', buyCosts: 'bc', saleCosts: 'sc', improve: 'imp', improveDate: 'id', mortgage: 'mtg' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const id = ids[e.field] || e.field;
			const box = root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const st = (root.querySelector(`input[name="${P}-st"]:checked`) || {}).value || 'single';
		form.querySelectorAll('[data-if-status]').forEach((el) => { el.hidden = el.getAttribute('data-if-status') !== st; });
		const imp = (root.querySelector(`#${P}-imp`) || {}).value || '';
		form.querySelectorAll('[data-if-improve]').forEach((el) => { el.hidden = imp.trim() === '' || parseMoney(imp) === 0; });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? ilsn(r.tax) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.path }); }
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
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			download('mas-shevach.ics', 'text/calendar;charset=utf-8', ics(r.deadlines.map((d) => ({ date: d.date, summary: `מס שבח: ${d.he}` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או כתובת.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק מיסוי מקרקעין ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (הערכה, jus-tice.co.il, ${isoToHe(sv.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.path : 'error' });
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
