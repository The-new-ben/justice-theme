/**
 * The rights wave 2A UI (22.10.2026, HAD-578): the work grant (maanak-avoda) on /maanak-avoda/.
 * The picture is the law's own shape: the grant curve of the reader's family (it rises from the floor, holds a plateau,
 * then falls to the ceiling), with the reader's income marked on it, so the reader sees where they stand and what a raise
 * does. Under it, the payment calendar of s.12 by the filing date, the deadline, and every component with its section.
 * The result hands off to the jus-tice.com simulation with the scenario written (sim-handoff.js).
 */
import { compute, MAANAK_DEFAULT, curve, grantBand } from './maanak-engine.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'maanak-avoda';
const P = 'jt44';
const NET_PATH = '/net-salary-calculator/';

export const EXAMPLE = Object.assign({}, MAANAK_DEFAULT, { filed: '2026-10-22' });

const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const nis = (n) => `${money(n, Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2)} ₪`;

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const rm = reg.rights_maanak;
	const i = Object.assign({}, MAANAK_DEFAULT, input || {});
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const text = (id, label, value, ph, hint = '') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" class="jtool-input" type="text" inputmode="numeric" autocomplete="off" value="${esc(value)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const fam = i.single ? 'single' : i.spouse ? 'couple' : 'alone';
	return `<fieldset class="jtool-field"><legend>שנת המס שעליה מגישים</legend><div class="jtool-chips">${rm.years_open.map((y) => chip('yr', y, `${y}${y === rm.claim_year ? ' (מגישים עכשיו)' : ' (עד 31.12.2026)'}`, Number(i.year) === y)).join('')}</div><p class="jtool-error" id="${P}-year-e" role="alert"></p>`
		+ `<p class="jtool-hint">${esc(rm.next_year_he)}.</p></fieldset>`
		+ `<div class="jtool-row">${text('inc', 'הכנסה חודשית ממוצעת מעבודה (ברוטו)', i.income, 'לדוגמה: 5,000', 'סך הברוטו בשנה חלקי חודשי העבודה; כולל דמי לידה ומילואים')}${text('mon', 'חודשי עבודה בשנה', i.months, '12', 'בלי חודשים של דמי אבטלה')}</div>`
		+ `<div class="jtool-row">${text('kids', 'ילדים מתחת לגיל 19', i.kids, '0')}${text('tod', 'מתוכם פעוטות (מתחת לגיל 3 בשנה)', i.toddlers, '0')}</div>`
		+ `<fieldset class="jtool-field"><legend>מצב משפחתי</legend><div class="jtool-chips">${chip('fam', 'couple', 'נשוי/אה או ידוע/ה בציבור', fam === 'couple')}${chip('fam', 'single', 'הורה יחיד (הילדים אצלי, בלי בן/בת זוג)', fam === 'single')}${chip('fam', 'alone', 'בלי בן/בת זוג', fam === 'alone')}</div></fieldset>`
		+ `<div class="jtool-row" data-if-couple${fam === 'couple' ? '' : ' hidden'}>${text('sp', 'הכנסה חודשית ממוצעת של בן/בת הזוג', i.spouseIncome, '0', 'עבודה, עסק ופנסיה; 0 אם אין')}</div>`
		+ `<div class="jtool-row">${text('by', 'שנת לידה', i.by, 'לדוגמה: 1990')}<fieldset class="jtool-field"><legend>מגדר</legend><div class="jtool-chips">${chip('sex', 'f', 'אישה', i.sex !== 'm')}${chip('sex', 'm', 'גבר', i.sex === 'm')}</div><p class="jtool-hint">רק למסלול של עובדת מגיל 60</p></fieldset></div>`
		+ `<details class="jtool-more"${i.extra || i.realEstate ? ' open' : ''}><summary>פנסיה, נכס נוסף, מועד ההגשה</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${text('ext', 'הכנסה נוספת בחודש (פנסיה, גמלת נפגעי עבודה)', i.extra, '0')}${text('fil', 'מתי מגישים (תאריך)', isoToHe(i.filed), 'היום', 'לפי התאריך נקבע לוח התשלומים')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('re', '1', 'לי, לבן/בת הזוג או לילד יש נכס מקרקעין נוסף (מעל 50%) מלבד דירת מגורים יחידה', i.realEstate, 'checkbox')}</div>`
		+ `<p class="jtool-hint">${esc(rm.real_estate.he)}.</p></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	if (r.mode === 'bands') {
		return r.eligible
			? `ב-${r.year} ההכנסה בטווח המענק (${money(r.band[0], 0)} עד ${money(r.band[1], 0)} ₪ בחודש). רשות המסים לא פרסמה את נקודות הביניים של 2024, ולכן את הסכום המדויק נותן הסימולטור הרשמי; המקסימום: ${money(r.maxYear, 0)} ₪ בשנה. מגישים עד 31.12.2026.`
			: `לפי מה שהזנתם, אין זכאות למענק עבודה על ${r.year}: ${r.reasons.map((x) => x.he).join('; ')}.`;
	}
	if (!r.eligible) { return `לפי מה שהזנתם, אין זכאות למענק עבודה על ${r.year}: ${r.reasons.map((x) => x.he).join('; ')}.`; }
	const pay = r.pay.rows.length ? ` אם מגישים עד ${isoToHe(`${r.year + 1}-11-30`)}: ${r.pay.rows.length === 1 ? `תשלום אחד ב-${isoToHe(r.pay.rows[0].date)}` : `${r.pay.rows.length} תשלומים, הראשון ב-${isoToHe(r.pay.rows[0].date)}`}.` : '';
	return `מגיע לכם מענק עבודה של כ-${nis(r.annual)} על ${r.year}: ${nis(r.monthly)} לחודש × ${r.p.months} חודשי עבודה.${pay} מגישים באזור האישי ברשות המסים עד ${isoToHe(r.deadline)}.`;
}

/** The grant curve: monthly grant against monthly income for the reader's family, the reader's point on it. */
export function grantCurve(reg, r) {
	if (!r.ok || r.mode !== 'full') { return ''; }
	const c = curve(reg.rights_maanak, r.p);
	const W = 640;
	const H = 220;
	const L = 44;
	const B = 30;
	const top = Math.max(...c.pts.map((x) => x[1]), r.monthly, 1);
	const yMax = Math.ceil(top / 200) * 200;
	const x = (v) => L + ((W - L - 12) * v) / c.max;
	const y = (v) => H - B - ((H - B - 14) * v) / yMax;
	const line = c.pts.map((pt, i) => `${i ? 'L' : 'M'}${x(pt[0]).toFixed(1)},${y(pt[1]).toFixed(1)}`).join(' ');
	const area = `${line} L${x(c.max).toFixed(1)},${y(0).toFixed(1)} L${x(0).toFixed(1)},${y(0).toFixed(1)} Z`;
	const ticks = [];
	for (let v = 0; v <= c.max; v += c.max > 10000 ? 2000 : 1000) { ticks.push(v); }
	const yt = [0, yMax / 2, yMax];
	const me = Math.min(r.p.income, c.max);
	const meY = r.monthly;
	const s = r.schedule;
	const lab = `עקומת המענק ל${r.p.single ? 'הורה יחיד' : r.p.kids ? 'הורה' : 'מי שאין לו ילדים'}${r.p.toddlers ? ' עם פעוט' : ''}: המענק מתחיל מעל ${money(s.floor, 0)} ₪, מגיע ל-${money(Math.max(...c.pts.map((pt) => pt[1])), 0)} ₪ בחודש ויורד עד ${money(s.ceiling, 0)} ₪. ההכנסה שלכם: ${money(r.p.income, 0)} ₪, המענק ${money(r.monthly, 0)} ₪ בחודש.`;
	return `<figure class="${P}-curve"><figcaption class="${P}-curve__h">איפה אתם על עקומת המענק <span>(${r.year}, בלי הכנסת בן/בת הזוג)</span></figcaption>`
		+ `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(lab)}" preserveAspectRatio="xMidYMid meet">`
		+ yt.map((v) => `<line x1="${L}" x2="${W - 12}" y1="${y(v).toFixed(1)}" y2="${y(v).toFixed(1)}" class="${P}-grid"/><text x="${L - 6}" y="${(y(v) + 4).toFixed(1)}" class="${P}-ty" text-anchor="end">${money(v, 0)}</text>`).join('')
		+ ticks.map((v) => `<text x="${x(v).toFixed(1)}" y="${H - 10}" class="${P}-tx" text-anchor="middle">${v ? `${v / 1000}K` : '0'}</text>`).join('')
		+ `<path d="${area}" class="${P}-area"/><path d="${line}" class="${P}-line"/>`
		+ `<line x1="${x(me).toFixed(1)}" x2="${x(me).toFixed(1)}" y1="${y(0).toFixed(1)}" y2="${y(meY).toFixed(1)}" class="${P}-me-l"/>`
		+ `<circle cx="${x(me).toFixed(1)}" cy="${y(meY).toFixed(1)}" r="6" class="${P}-me"/>`
		+ `</svg><p class="${P}-curve__keys"><span><i class="${P}-k ${P}-k--line" aria-hidden="true"></i>המענק החודשי לפי ההכנסה החודשית הממוצעת</span><span><i class="${P}-k ${P}-k--me" aria-hidden="true"></i>אתם: ${money(r.p.income, 0)} ₪ → ${money(r.monthly, 0)} ₪</span></p></figure>`;
}

function payCalendar(reg, r) {
	const rm = reg.rights_maanak;
	if (!r.ok || r.mode !== 'full' || !r.eligible) { return ''; }
	if (!r.pay.rows.length) {
		return `<p class="${P}-late">${esc(rm.payments.late_he)}.${cite(rm.payments.section, rm.payments.url)}</p>`;
	}
	return `<ol class="${P}-pay" aria-label="לוח התשלומים">${r.pay.rows.map((x, i) => `<li><span class="${P}-pay__n"><bdi>${i + 1}</bdi></span><span class="${P}-pay__d"><bdi>${esc(isoToHe(x.date))}</bdi></span><strong>${ils(x.amount)}</strong></li>`).join('')}</ol>`
		+ `<p class="${P}-pay__note">${r.pay.single ? `מענק של עד ${money(reg.rights_maanak.years[String(r.year)].single_payment_max, 0)} ₪ משולם בתשלום אחד. ` : 'תשלומים שווים לפי מועד ההגשה. '}${esc(rm.decision.he)}.${cite(rm.payments.section, rm.payments.url)}</p>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const rm = reg.rights_maanak;
	const y = rm.years[String(r.year)];
	if (r.mode === 'bands') {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--${r.eligible ? 'ok' : 'warn'}">${r.eligible ? '✓ בטווח המענק' : '! מחוץ לטווח'} · שנת המס ${r.year}</p>`
			+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}מענק עבודה על ${r.year}</p>`
			+ `<strong class="jtool-verdict__figure">${r.eligible ? `עד ${ils(r.maxYear, 0)}` : 'אין זכאות'}</strong>`
			+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
			+ `<p class="jtool-scope">${esc(y.inner_he)}.${cite('הסימולטור של רשות המסים', rm.simulator_url)}${cite('מדריך 2024', y.guide_url)}</p></div>`;
	}
	const state = r.eligible ? 'ok' : 'warn';
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--${state}">${r.eligible ? '✓ זכאות לפי החוק' : '! אין זכאות לפי מה שהוזן'} · שנת המס ${r.year}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}מענק עבודה על ${r.year}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.annual, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>לחודש</dt><dd>${ils(r.monthly)}</dd></div><div><dt>חודשי עבודה</dt><dd><bdi>${r.p.months}</bdi></dd></div><div><dt>המקסימום למשפחה כזו</dt><dd>${ils(r.maxMonth)} לחודש</dd></div></dl>`
		+ `<p class="jtool-scope">${esc(y.index_he)}. המענק פטור ממס ולא נספר כהכנסה לביטוח לאומי (${esc(rm.not_income.section)}).</p></div>`
		+ grantCurve(reg, r)
		+ payCalendar(reg, r)
		+ (r.notes.length ? `<ul class="jtool-flags">${r.notes.map((n) => `<li>${esc(n.he)}</li>`).join('')}</ul>` : '');
}

/** The steps to claim, as a numbered list (also copied as text). */
export function steps(reg, r) {
	const rm = reg.rights_maanak;
	const y = rm.years[String(r.year)];
	return [
		{ he: `להיכנס לאזור האישי ברשות המסים ולהגיש "בקשה למענק עבודה" לשנת ${r.year} (רישום חד-פעמי עם שאלות זיהוי)`, url: rm.claim_url },
		{ he: `לבדוק שהמעסיק דיווח על השכר; אם לא, לצרף טופס 106. עצמאי: להגיש קודם את הדוח השנתי`, url: rm.service_url },
		{ he: `לאשר את חשבון הבנק ואת ההצהרה, ולשמור את מספר הבקשה`, url: rm.service_url },
		{ he: `מועד אחרון: ${y.deadline_he}`, url: y.deadline_url },
		{ he: `לבדוק את סטטוס הבקשה ואת התשלומים באתר רשות המסים`, url: rm.status_url },
		{ he: `קיבלתם החלטה שגויה? ${rm.objection.he}`, url: rm.law_url },
	];
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const rm = reg.rights_maanak;
	let out = '';
	if (r.mode === 'full') {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-calc-h">איך חושב המענק, רכיב אחר רכיב</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-calc-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">רכיב</th><th scope="col">לחודש</th><th scope="col">הסעיף בחוק</th></tr></thead><tbody>`
			+ (r.lines.length ? r.lines.map((l) => `<tr><td data-th="רכיב">${esc(l.he)}</td><td data-th="לחודש">${l.info ? '—' : ils(l.amount)}</td><td data-th="הסעיף בחוק">${cite(l.section, rm.law_url)}</td></tr>`).join('') : `<tr><td data-th="רכיב">${esc(r.reasons.map((x) => x.he).join('; ') || 'אין רכיב מזכה')}</td><td data-th="לחודש">—</td><td data-th="הסעיף בחוק">${cite((r.reasons[0] || {}).section || 'סעיף 2', rm.law_url)}</td></tr>`)
			+ `<tr class="jtool-table__total"><td data-th="רכיב">סך הכול: ${money(r.monthly)} ₪ × ${r.p.months} חודשים</td><td data-th="לחודש">${ils(r.monthly)}</td><td data-th="הסעיף בחוק">${ils(r.annual)} בשנה</td></tr></tbody>`
			+ `<caption>${esc(rm.notice_he)}. ${esc(rm.years['2025'].min_he)}.</caption></table></div></div>`;
	}
	const list = steps(reg, r);
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-steps-h">מה עושים עכשיו</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הצעדים</button><button class="jtool-btn" type="button" data-act="ics">המועדים ליומן (.ics)</button></div></div>`
		+ `<ol class="${P}-steps">${list.map((x) => `<li>${esc(x.he)}${cite('לאתר', x.url)}</li>`).join('')}</ol>`
		+ `<p class="${P}-note">${esc(rm.post_he)}. ${esc(rm.work_income_he)}. ${esc(rm.relative_he)}.</p></div>`;
	// The neighbours: the net salary (where the income comes from) and the refund.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-next-h">באותו תיק</h3></div><ul class="${P}-links">`
		+ `<li><a href="${esc(NET_PATH)}" data-act="net">מחשבון שכר נטו 2026</a>: מה נשאר מהברוטו, ומה הדוח של המעסיק אומר</li>`
		+ `<li><a href="/guide-tax-calculator-updated-2025/">החזר מס לשכירים</a>: בקשה נפרדת, אפשר להגיש את שתיהן</li>`
		+ `<li><a href="/nekudot-zikui/">נקודות זיכוי</a>: הורים לפעוטות מקבלים גם נקודות במס</li>`
		+ `<li><a href="/unemployment-benefits-eligibility/">דמי אבטלה</a>: חודש של דמי אבטלה לא נספר למענק</li>`
		+ `<li><a href="/maternity-allowance/">דמי לידה</a>: נספרים כהכנסת עבודה למענק</li>`
		+ `<li><a href="/sachar-minimum-2026/">שכר המינימום 2026</a>: מתחת לו, בדקו קודם את השכר עצמו</li>`
		+ `</ul></div>`;
	return out;
}

/** Page section: the 2025 schedule of every family, from the registry, with the 2024 bands. */
export function bandsTable(reg) {
	const rm = reg.rights_maanak;
	const y = rm.years['2025'];
	const y4 = rm.years['2024'];
	const pct = rm.parent_pct / 100;
	const rows = [
		['בלי ילדים, מגיל 55', y.regular.k12, 1, y4.bands.k12],
		['הורה לילד אחד או שניים', y.regular.k12, pct, y4.bands.k12],
		['הורה ל-3 ילדים ומעלה', y.regular.k3, pct, y4.bands.k3],
		['הורה יחיד, ילד אחד או שניים', y.single.k12, y.single.pct / 100, y4.bands.single_k12],
		['הורה יחיד, 3 ילדים ומעלה', y.single.k3, y.single.pct / 100, y4.bands.single_k3],
		['עובדת מגיל 60 (ילידת 1960 ואילך)', y.women60, 1, y4.bands.women60],
	];
	const tr = rows.map(([he, s, k, b]) => `<tr><td data-th="מי">${esc(he)}</td><td data-th="המענק מתחיל מעל">${ils(s.floor, 0)}</td><td data-th="המקסימום מ-">${ils(s.p1, 0)}</td><td data-th="המקסימום עד">${ils(s.p2, 0)}</td><td data-th="התקרה">${ils(s.ceiling, 0)}</td><td data-th="מענק מרבי לחודש">${ils(s.max * k, 0)}</td><td data-th="מרבי לשנה">${ils(s.max * k * 12, 0)}</td><td data-th="2024: טווח ההכנסה">${money(b[0], 0)} עד ${money(b[1], 0)}</td><td data-th="סעיף">${cite(s.section, rm.law_url)}</td></tr>`).join('');
	const t = y.toddler;
	const trT = `<tr><td data-th="מי">תוספת לכל פעוט (מתחת לגיל 3)</td><td data-th="המענק מתחיל מעל">${ils(t.floor, 0)}</td><td data-th="המקסימום מ-">${ils(t.p1, 0)}</td><td data-th="המקסימום עד">${ils(t.k12.p2, 0)} / ${ils(t.k3.p2, 0)}</td><td data-th="התקרה">${ils(t.k12.published_top, 0)} / ${ils(t.k3.published_top, 0)}</td><td data-th="מענק מרבי לחודש">${ils(t.max, 0)}</td><td data-th="מרבי לשנה">${ils(t.max * 12, 0)}</td><td data-th="2024: טווח ההכנסה">${money(y4.bands.toddler_k12[0], 0)} עד ${money(y4.bands.toddler_k12[1], 0)} / ${money(y4.bands.toddler_k3[1], 0)}</td><td data-th="סעיף">${cite(t.section, rm.law_url)}</td></tr>`;
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מענק עבודה לשנת המס 2025 (סכומים בש"ח לחודש, לפי ההכנסה החודשית הממוצעת). ההורים: כבר כולל 150%. "1-2 / 3+": ילד אחד או שניים / שלושה ומעלה. עמודת 2024: הטווח שפרסמה רשות המסים</caption>`
		+ `<thead><tr><th scope="col">מי</th><th scope="col">המענק מתחיל מעל</th><th scope="col">המקסימום מ-</th><th scope="col">המקסימום עד</th><th scope="col">התקרה</th><th scope="col">מענק מרבי לחודש</th><th scope="col">מרבי לשנה</th><th scope="col">2024: טווח ההכנסה</th><th scope="col">סעיף</th></tr></thead><tbody>${tr}${trT}</tbody></table></div>`;
}

export function snapshot(reg) {
	const rm = reg.rights_maanak;
	const r = compute(reg, EXAMPLE);
	const y = rm.years['2025'];
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.annual,
		sticky: ils(r.annual, 0),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>ההכנסה החודשית הממוצעת: ${money(EXAMPLE.income, 0)} ₪, בין ${money(y.regular.k12.p1, 0)} ל-${money(y.regular.k12.p2, 0)} ₪: המענק הבסיסי ${money(y.regular.k12.max, 0)} ₪${cite(y.regular.k12.section, rm.law_url)}</li>`
			+ `<li>הורה: ${money(y.regular.k12.max, 0)} × ${rm.parent_pct}% = ${money(y.regular.k12.max * rm.parent_pct / 100, 0)} ₪${cite(rm.parent_section, rm.law_url)}</li>`
			+ `<li>פעוט אחד: ${money(y.toddler.max, 0)} ₪ (ההכנסה בין ${money(y.toddler.p1, 0)} ל-${money(y.toddler.k12.p2, 0)})${cite(y.toddler.section, rm.law_url)}</li>`
			+ `<li>בן/בת הזוג מרוויח/ה ${money(EXAMPLE.spouseIncome, 0)} ₪: יחד ${money(EXAMPLE.income + EXAMPLE.spouseIncome, 0)} ₪, פחות מ-${money(y.spouse_toddler.base, 0)} ₪ ועוד התוספות, ולכן אין הפחתה${cite(y.spouse_toddler.section, rm.law_url)}</li>`
			+ `<li>${money(r.monthly, 0)} ₪ × ${EXAMPLE.months} חודשים = ${money(r.annual, 0)} ₪; הגשה ב-${isoToHe(EXAMPLE.filed)}: שני תשלומים של ${money(r.pay.rows[0].amount, 0)} ₪, ב-${isoToHe(r.pay.rows[0].date)} וב-${isoToHe(r.pay.rows[1].date)}${cite(rm.payments.section, rm.payments.url)}</li></ol>`,
		compare_table: bandsTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/** The scenario for the simulation: the tool's figures only, never a name or an ID. */
export function scenarioText(reg, r) {
	if (!r.ok) { return ''; }
	const p = r.p;
	const tod = p.toddlers ? ` (${p.toddlers === 1 ? 'אחד מהם פעוט' : `${p.toddlers} מהם פעוטות`})` : '';
	const fam = p.single ? `הורה יחיד ל-${p.kids} ילדים${tod}` : p.kids ? `הורה ל-${p.kids} ילדים${tod}${p.spouse ? ', נשוי/אה' : ''}` : 'בלי ילדים מתחת לגיל 19';
	const sp = p.spouse ? ` הכנסת בן/בת הזוג: ${money(p.spouseIncome, 0)} ₪ בחודש.` : '';
	const res = r.mode === 'full' ? (r.eligible ? `לפי החישוב לפי חוק מענק עבודה מגיע מענק של ${money(r.monthly, 0)} ₪ לחודש, ${money(r.annual, 0)} ₪ לשנה.` : `לפי החישוב אין זכאות: ${r.reasons.map((x) => x.he).join('; ')}.`) : (r.eligible ? 'ההכנסה בטווח המענק לפי מדריך רשות המסים.' : 'ההכנסה מחוץ לטווח המענק.');
	return `מענק עבודה (מס הכנסה שלילי) לשנת המס ${r.year}. ${fam}. הכנסה חודשית ממוצעת מעבודה: ${money(p.income, 0)} ₪, ${p.months} חודשי עבודה.${sp} ${res} אני רוצה להתכונן לשיחה עם פקיד השומה ברשות המסים או להשגה על ההחלטה, ולהבין מה לטעון ואילו מסמכים להביא.`;
}

/* ---------------- Browser ---------------- */

export function stateOf(i) {
	return encodeState({ y: i.year, b: i.by, x: i.sex === 'm' ? 'm' : 'f', k: i.kids, t: i.toddlers, f: i.single ? 's' : i.spouse ? 'c' : 'a', i: i.income, m: i.months, e: i.extra || '', p: i.spouse ? i.spouseIncome : '', r: i.realEstate ? 1 : '' });
}
export const KEYS = ['y', 'b', 'x', 'k', 't', 'f', 'i', 'm', 'e', 'p', 'r'];
export function inputOf(s) {
	if (!s || !s.i) { return null; }
	const n = (v, d) => (v === undefined || v === '' ? d : Number(v));
	return { year: n(s.y, 2025), by: n(s.b, n(s.k, 0) > 0 ? MAANAK_DEFAULT.by : ''), sex: s.x === 'm' ? 'm' : 'f', kids: n(s.k, 0), toddlers: n(s.t, 0), single: s.f === 's', spouse: s.f === 'c', income: n(s.i, ''), months: n(s.m, 12), extra: n(s.e, 0), spouseIncome: n(s.p, 0), realEstate: s.r === '1', filed: '' };
}

function heToIso(text, fallback) {
	const m = String(text || '').trim().match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
	if (!m) { return fallback; }
	return `${m[3]}-${String(m[2]).padStart(2, '0')}-${String(m[1]).padStart(2, '0')}`;
}

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const fam = pick('fam', 'couple');
	const num = (id, d) => { const v = String(val(id)).replace(/[,\s₪]/g, ''); return v === '' ? d : Number(v); };
	return {
		year: Number(pick('yr', '2025')), by: num('by', ''), sex: pick('sex', 'f'), kids: num('kids', 0), toddlers: num('tod', 0),
		single: fam === 'single', spouse: fam === 'couple', income: num('inc', ''), months: num('mon', 12), extra: num('ext', 0),
		spouseIncome: num('sp', 0), realEstate: Boolean(root.querySelector(`input[name="${P}-re"]:checked`)), filed: heToIso(val('fil'), today),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const rm = reg.rights_maanak;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(rm.checked_on, rm.refresh_every_days) || (rm.next_update && today >= rm.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהסכומים התעדכנו ב-1 בינואר'); }
	}
	const ids = { year: 'year', by: 'by', kids: 'kids', toddlers: 'tod', income: 'inc', months: 'mon', extra: 'ext', spouseIncome: 'sp' };
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
		const fam = (root.querySelector(`input[name="${P}-fam"]:checked`) || {}).value || 'couple';
		form.querySelectorAll('[data-if-couple]').forEach((el) => { el.hidden = fam !== 'couple'; });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok && r.mode === 'full' ? ils(r.annual, 0) : '—'; }
		// The net-salary link carries the income, so the reader does not type it twice.
		root.querySelectorAll(`a[href*="${NET_PATH}"]`).forEach((a) => { if (r.ok && input.income) { a.setAttribute('href', `${NET_PATH}#s=g${Math.round(Number(input.income))}`); } });
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: grantBand(r) }); }
		return r;
	};
	const schedule2 = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root, today)); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		form.innerHTML = renderForm(reg, Object.assign({}, fromHash, { filed: today }));
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(readForm(root, today), { silent: true });
	} else {
		const f = root.querySelector(`#${P}-fil`);
		if (f) { f.value = isoToHe(today); }
		run(readForm(root, today), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule2);
	form.addEventListener('change', schedule2);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root, today), { silent: true }); }
		const input = readForm(root, today);
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
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק מענק עבודה ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(rm.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(steps(reg, r).map((x, i) => `${i + 1}. ${x.he} (${x.url})`).join('\n'));
			toast(root, ok ? 'הצעדים הועתקו.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'ics' && r.ok) {
			const y = rm.years[String(r.year)];
			const evs = [{ date: y.deadline_online, summary: `מענק עבודה ${r.year}: היום האחרון להגיש בקשה מקוונת`, description: `${rm.law_short_he}, סעיף 7. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` }];
			if (y.deadline_post && y.deadline_post >= today) { evs.push({ date: y.deadline_post, summary: `מענק עבודה ${r.year}: היום האחרון להגיש בסניף הדואר`, description: 'חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.' }); }
			if (r.mode === 'full' && r.eligible && input.filed <= `${r.year + 1}-11-30`) { evs.push({ date: `${r.year + 1}-11-30`, summary: `מענק עבודה ${r.year}: הגשה עד היום = תשלום ב-15.12`, description: `${rm.payments.section}. חושב ב-jus-tice.co.il.` }); }
			(r.pay && r.pay.rows ? r.pay.rows : []).forEach((x, i) => evs.push({ date: x.date, summary: `מענק עבודה ${r.year}: תשלום ${i + 1} (${money(x.amount, 0)} ₪ לפי החישוב)`, description: `${rm.payments.section}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` }));
			download('maanak-avoda.ics', 'text/calendar;charset=utf-8', ics(evs, new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'net') {
			track('tool_next_click', { tool_id: TOOL_ID, band: 'net' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: grantBand(r) });
			if (r.ok && openSimulation(scenarioText(reg, r), 'court_rehearsal', b.getAttribute('href'))) { ev.preventDefault(); toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.'); }
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, Object.assign(s, { filed: today })); sync(); run(readForm(root, today), { silent: true }); }
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
