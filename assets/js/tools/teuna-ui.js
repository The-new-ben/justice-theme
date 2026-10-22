/**
 * Wave 4 UI: road-accident compensation under the 1975 law and its regulations (HAD-502).
 * Board: Claude Design canvas "Tools wave 4" (co.il teunat-drachim at 1280 and 360, states).
 * The formula bar shows how the share of the statutory maximum is built (hospital days, disability, the age cut);
 * the fee panel shows what is left of an offer after the lawyer's maximum fee at each stage.
 *
 * The injury wave (22.10.2026, HAD-591) adds, without changing any export above it (new parts use the jt60 prefix):
 * the result-first lead card, five one-click profiles, who pays (ss.2-3, 12), the claim ledger by head of damage with
 * the statutory caps drawn as ceiling lines and the fee bar at 8 / 11 / 13% (the picture), loss of earning capacity to
 * the retirement age entered (s.4(א)(1)-(2), undiscounted: no law sets the capitalisation rate), the route to the
 * maximum in shekels, interim payments and the court expert's days (.ics), the "what changed" table, the scenario for
 * the simulation (the expert and the testimony, sim-handoff.js), the next steps, a one-page print and the share state
 * the sibling tools link into (stateLink). Bundle: instrument.js, sim-handoff.js, dates.js, teuna-engine.js, teuna-ui.js.
 */
import { compute, tnCompute, STAGES, EXCLUSIONS } from './teuna-engine.js';
import { addDays, addMonths, addYears } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'teunat-drachim';
const P = 'jt10';

export const EXAMPLE = { disability: 20, days: 5, age: 40, accident: '2025-03-10', birth: '', death: false, max: '', income: '', months: '', amount: 150000, stage: 'none', work: false, excluded: [] };

const STAGE_LABEL = { none: 'בלי תביעה', settle: 'פשרה אחרי תביעה', judgment: 'פסק דין' };
const EXCL_LABEL = { intent: 'גרם לתאונה במתכוון', unauthorised: 'נהג ברכב בלי רשות, או נסע בו בידיעה', licence: 'נהג בלי רישיון נהיגה', felony: 'השתמש ברכב לעבירה מסוג פשע', uninsured: 'נהג בלי ביטוח חובה', owner: 'בעל הרכב והרשה לנהוג בו בלי ביטוח' };

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const pctTxt = (n) => `${(Math.round(n * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`;
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
	const ca = reg.car_accident;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const field = (id, label, value, opts = {}) => `<div class="jtool-field"${opts.attr || ''}><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input${opts.money ? ' jtool-input--money' : ''}"><input id="${P}-${id}" type="text" inputmode="${opts.mode || 'decimal'}" autocomplete="off" value="${esc(value)}" placeholder="${esc(opts.ph || '')}" aria-describedby="${opts.hint ? `${P}-${id}-h ` : ''}${P}-${id}-e">${opts.suffix ? `<span class="jtool-input__suffix" aria-hidden="true">${opts.suffix}</span>` : ''}</div>${opts.hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(opts.hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const minor = input.age !== '' && input.age !== undefined && Number(input.age) < ca.limitation.adult_age;
	const excluded = input.excluded || [];
	return tnProfilesHtml(reg, input)
		+ `<div data-if-alive${input.death ? ' hidden' : ''}><div class="jtool-row">${field('dis', 'אחוזי נכות רפואית לצמיתות', input.disability ?? '', { suffix: '%', ph: 'לדוגמה: 20', hint: 'כפי שקבע המומחה מטעם בית המשפט או הוסכם' })}${field('days', 'ימי אשפוז בגלל התאונה', input.days ?? '', { mode: 'numeric', ph: '0 אם לא אושפזתם' })}</div>`
		+ `<div class="jtool-row" style="margin-top:12px">${field('age', 'הגיל ביום התאונה', input.age ?? '', { mode: 'numeric', ph: 'בשנים שלמות' })}${field('acc', 'יום התאונה', isoToHe(input.accident || ''), { mode: 'numeric', ph: 'לדוגמה: 10.3.2025' })}</div>`
		+ `<div data-if-minor${minor ? '' : ' hidden'} style="margin-top:12px">${field('birth', 'תאריך הלידה (לקטין: ההתיישנות מתחילה בגיל 18)', isoToHe(input.birth || ''), { mode: 'numeric', ph: 'לדוגמה: 4.6.2012' })}</div></div>`
		+ `<div data-if-dead${input.death ? '' : ' hidden'}>${field('acc2', 'יום התאונה', isoToHe(input.accident || ''), { mode: 'numeric', ph: 'לדוגמה: 10.3.2025' })}</div>`
		+ `<div class="jtool-chips">${chip('dth', '1', 'הנפגע נפטר בתאונה', input.death, 'checkbox')}${chip('wrk', '1', 'בדרך לעבודה או בעבודה', input.work, 'checkbox')}</div>`
		+ `<details class="jtool-more"${input.amount ? ' open' : ''}><summary>הצעה של חברת הביטוח, ושכר טרחה מקסימלי</summary>`
		+ `<div style="margin-top:8px">${field('amt', 'סכום הפיצוי שהוצע או נפסק', input.amount ? money(input.amount, 0) : '', { money: true, suffix: '₪', ph: 'לדוגמה: 150,000' })}</div>`
		+ `<fieldset class="jtool-field" style="margin-top:8px"><legend>באיזה שלב</legend><div class="jtool-chips">${STAGES.map((s) => chip('stg', s, STAGE_LABEL[s], (input.stage || 'none') === s)).join('')}</div></fieldset>`
		+ `<p class="jtool-hint">${esc(ca.fees.refund_he)}. מע"מ ${ca.fees.vat_pct}% נוסף על האחוז (${esc(ca.fees.vat_section)}).</p></details>`
		+ `<details class="jtool-more" data-if-alive${input.death ? ' hidden' : ''}${input.income ? ' open' : ''}><summary>הפסד השתכרות בעבר ובעתיד: התקרה, הנכות התפקודית ועד איזה גיל</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${field('inc', 'הכנסה חודשית לפני התאונה, ברוטו', input.income ? money(input.income, 0) : '', { money: true, suffix: '₪', ph: 'לדוגמה: 12,000' })}${field('mon', 'חודשים שלא עבדתם בכלל', input.months ?? '', { ph: 'לדוגמה: 4' })}</div>`
		+ tnFutureFields(reg, input) + '</details>'
		+ `<details class="jtool-more"${input.max ? ' open' : ''}><summary>קיבלתם את הסכום המקסימלי בשקלים?</summary>`
		+ `<div style="margin-top:8px">${field('max', 'הסכום המקסימלי לכאב וסבל, כפי שנמסר לכם', input.max ? money(input.max, 0) : '', { money: true, suffix: '₪', ph: 'מפסק דין או ממכתב המבטח' })}</div>`
		+ `<p class="jtool-hint">${esc(ca.nonpecuniary.max_he)}.</p></details>`
		+ `<details class="jtool-more"${excluded.length ? ' open' : ''}><summary>בדיקת זכאות: מי לא מקבל פיצוי (סעיף 7)</summary><div class="jtool-chips" style="margin-top:8px">${EXCLUSIONS.map((x) => chip('ex', x, EXCL_LABEL[x], excluded.includes(x), 'checkbox')).join('')}</div>`
		+ `<p class="jtool-hint">האחריות מוחלטת: לא משנה מי אשם בתאונה (סעיף 2(ג)). אלה המקרים היחידים שבהם אין זכאות, עם חריגים בסעיפים 7א ו-7ב.</p></details>`
		+ tnMoreFields(reg, input);
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const np = r.np;
	if (np.kind === 'death') { return `במות הנפגע: ${pctTxt(np.pct)} מהסכום המקסימלי לעיזבון (תקנה 4)${r.npAmount !== null ? `, ${nis(r.npAmount)}` : ''}.`; }
	if (np.kind === 'other') { return `בלי נכות לצמיתות ובלי ימי אשפוז: סכום מוסכם או פסוק, עד ${pctTxt(np.upTo)} מהסכום המקסימלי (תקנה 2(ב)).`; }
	const dis = np.parts.find((p) => p.key === 'disability');
	const hos = np.parts.find((p) => p.key === 'hospital');
	const bits = [];
	if (dis) { bits.push(`${pctTxt(dis.raw)} נכות${dis.ageCut ? `, פחות ${pctTxt(dis.ageCut)} בגלל הגיל, הם ${pctTxt(dis.pct)}` : ''}`); }
	if (hos) { bits.push(`${hos.days} ימי אשפוז הם ${pctTxt(hos.pct)}`); }
	return `כאב וסבל: ${bits.join('; ')}. בסך הכול ${pctTxt(np.pct)} מהסכום המקסימלי${r.npAmount !== null ? `, ${nis(r.npAmount)}` : ''}.`;
}

/** The formula bar: the share of the maximum, built from its parts; the age cut drawn as the part taken away. */
function formulaBar(reg, r) {
	const np = r.np;
	if (np.kind !== 'formula') { return ''; }
	const seg = np.parts.map((p) => {
		const w = Math.max(1.2, p.pct);
		const cut = p.key === 'disability' && p.ageCut ? Math.max(0.6, p.raw - p.pct) : 0;
		// A label only where it fits; the legend names every colour.
		return `<span class="jt10-seg jt10-seg--${p.key}" style="width:${w.toFixed(2)}%">${w >= 7 ? `<b>${esc(p.key === 'hospital' ? 'אשפוז' : 'נכות')}</b>` : ''}</span>${cut ? `<span class="jt10-seg jt10-seg--cut" style="width:${cut.toFixed(2)}%" aria-hidden="true"></span>` : ''}`;
	}).join('');
	return `<div class="jt10-formula"><p class="jt10-formula__h">מתוך 100% של הסכום המקסימלי</p><div class="jt10-bar" role="img" aria-label="${esc(`${pctTxt(np.pct)} מהסכום המקסימלי`)}">${seg}</div>`
		+ `<p class="jt10-formula__legend"><span><i class="jt10-k jt10-k--disability"></i>נכות</span><span><i class="jt10-k jt10-k--hospital"></i>אשפוז</span>${np.ageCut ? '<span><i class="jt10-k jt10-k--cut"></i>הפחתת גיל</span>' : ''}</p></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state ${r.outOfScope ? 'jtool-state--warn' : 'jtool-state--danger'}">${r.outOfScope ? 'ייתכן שאין זכאות לפי החוק' : '✕ צריך לתקן את הקלט'}</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const ca = reg.car_accident;
	const fig = r.figureKind === 'nis' ? ils(r.npAmount) : r.figureKind === 'pct' ? `<bdi>${pctTxt(r.np.pct)}</bdi>` : `<bdi>עד ${pctTxt(r.np.upTo)}</bdi>`;
	const fee = r.fees[r.stage];
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי הנוסחה שבתקנות</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}כאב וסבל, ${r.figureKind === 'nis' ? 'בשקלים' : 'כשיעור מהסכום המקסימלי'}</p>`
		+ `<strong class="jtool-verdict__figure">${fig}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ (fee ? `<p class="jtool-scope">מתוך פיצוי של ${esc(nis(r.amount))}: עורך דין יגבה לכל היותר <strong>${ils(fee.withVat)}</strong> (${pctTxt(fee.pct)} ועוד מע"מ, ${esc(STAGE_LABEL[r.stage])}), ונשארים לכם לפחות <strong>${ils(fee.net)}</strong>.</p>` : '')
		+ (r.lim ? `<p class="jtool-scope">התביעה מתיישנת ב-<strong><bdi>${isoToHe(r.lim.deadline)}</bdi></strong>${r.lim.added ? ` (כולל ${r.lim.added} ימים שלא נספרו בגלל המלחמה)` : ''}.${cite(ca.limitation.section, ca.limitation.url)}</p>` : '')
		+ `</div>`
		+ formulaBar(reg, r)
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '');
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const ca = reg.car_accident;
	const np = ca.nonpecuniary;
	let out = '';
	// 1. The formula, line by line.
	const lines = [];
	if (r.np.kind === 'death') { lines.push([`מות הנפגע: ${pctTxt(np.death_pct)} מהסכום המקסימלי, לעיזבון`, np.sections.death]); }
	if (r.np.kind === 'other') { lines.push([`בלי נכות לצמיתות ובלי אשפוז: עד ${pctTxt(np.no_permanent_max_pct)} מהסכום המקסימלי, בהסכמה או בפסק דין`, np.sections.other]); }
	for (const p of r.np.parts || []) {
		if (p.key === 'hospital') { lines.push([`${p.days} ימי אשפוז × ${np.hospital_permille} פרומיל (${pctTxt(np.hospital_permille / 10)} ליום) = ${pctTxt(p.pct)}`, np.sections.hospital]); }
		if (p.key === 'disability') {
			lines.push([`${pctTxt(p.raw)} נכות לצמיתות × ${pctTxt(np.disability_pct_per_pct)} לכל אחוז = ${pctTxt(p.raw)}`, np.sections.disability]);
			if (p.ageCut) { lines.push([`הפחתת גיל: ${pctTxt(p.ageCut)} (אחוז לכל שנה מעל ${np.age_from}), ${pctTxt(p.raw)} × ${pctTxt(100 - p.ageCut)} = ${pctTxt(p.pct)}`, np.sections.age]); }
		}
	}
	if (r.np.pct !== null) { lines.push([`סך הכול: ${pctTxt(r.np.pct)} מהסכום המקסימלי${r.npAmount !== null ? ` × ${nis(r.max)} = ${nis(r.npAmount)}` : ''}`, np.max_section]); }
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-np-h">כאב וסבל, שורה אחרי שורה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-np-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">החישוב</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ lines.map(([t, s]) => `<tr><td data-th="החישוב">${esc(t)}</td><td data-th="הכלל">${cite(s, s.startsWith('תקנה') ? ca.regs_url : ca.law_url)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(np.max_he)}.</caption></table></div></div>`;
	// 2. The fee cap at every stage.
	if (r.fees.none) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-fee-h">כמה נשאר לכם מ-${esc(nis(r.amount))}</h3></div><div class="jt7-scns jt10-fees">`
			+ STAGES.map((s) => { const f = r.fees[s]; const here = s === r.stage; return `<div class="jt7-scn${here ? ' jt7-scn--here' : ''}"><p>${esc(STAGE_LABEL[s])}${here ? ' (אתם)' : ''}</p><strong>${ils(f.net, f.net % 1 ? 2 : 0)}</strong><small>שכר טרחה עד ${pctTxt(f.pct)} + מע"מ: ${esc(nis(f.withVat))}</small><small>${cite(f.section, s === 'none' || s === 'judgment' ? ca.law_url : ca.fees.rules_url)}</small></div>`; }).join('')
			+ `</div><p class="jt7-scns__note">התקרה לפי ${esc(ca.fees.rules_he)}, ו${esc(ca.fees.refund_he)}. גמלאות ביטוח לאומי, אם יש, מנוכות מהפיצוי לפני כן.</p></div>`;
	}
	// 3. Loss of earnings: the ceiling and the base.
	const nii = ca.earnings.nii[ca.earnings.nii.length - 1];
	const ceil = Math.round(ca.earnings.ceiling_multiple * Math.min(nii.s1, nii.s2));
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-earn-h">הפסד השתכרות: התקרה</h3></div><ul class="jt11-list">`
		+ `<li>הכנסה שמעל פי ${ca.earnings.ceiling_multiple} מהשכר הממוצע במשק לא נספרת. השכר הממוצע הוא הגבוה מבין נתוני הלמ"ס והביטוח הלאומי ביום קביעת הפיצוי.${cite(ca.earnings.section, ca.law_url)}</li>`
		+ `<li>לפי הביטוח הלאומי מ-${isoToHe(nii.from)}: ${money(nii.s1, 0)} ₪ (סעיף 1) ו-${money(nii.s2, 0)} ₪ (סעיף 2). לכן התקרה לחודש היא לפחות <strong>${ils(ceil, 0)}</strong>.${cite('ביטוח לאומי', nii.url)}</li>`
		+ `<li>הפיצוי פטור ממס, ולכן ההפסד נמדד אחרי מס הכנסה, וההפחתה בשל המס לא עולה על ${ca.earnings.tax_cap_pct}%.${cite(ca.earnings.tax_section, ca.law_url)}</li>`
		+ (r.earnings ? `<li>לפי ההכנסה שהזנתם: הבסיס לחודש שלא עבדתם בכלל הוא בין <strong>${ils(r.earnings.lowPerMonth)}</strong> ל-<strong>${ils(r.earnings.highPerMonth)}</strong>${r.earnings.months ? `, ול-${r.earnings.months} חודשים בין ${ils(r.earnings.low)} ל-${ils(r.earnings.high)}` : ''}. ההפסד העתידי תלוי בנכות התפקודית שבית המשפט קובע.</li>` : '')
		+ `</ul></div>`;
	// 4. The dates.
	const dl = deadlines(reg, r);
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ dl.map((d) => { const past = opts.today && d.date && d.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="עד תאריך">${d.date ? `<bdi>${isoToHe(d.date)}</bdi>${past ? ' (עבר)' : ''}` : '—'}</td><td data-th="מה">${esc(d.what)}</td><td data-th="הכלל">${cite(d.rule, d.href)}</td></tr>`; }).join('')
		+ `</tbody><caption>חישוב כללי, לא ייעוץ משפטי. גילוי מאוחר של עובדות יכול לדחות את תחילת ההתיישנות (סעיף 8 לחוק ההתיישנות).</caption></table></div></div>`;
	return out;
}

export function deadlines(reg, r) {
	const ca = reg.car_accident;
	const lim = ca.limitation;
	const out = r.lim ? [{ date: r.lim.deadline, what: `התיישנות: ${lim.years} שנים${r.lim.minor ? ' מגיל 18' : ' מיום התאונה'}${r.lim.added ? `, ועוד ${r.lim.added} ימים שלא נספרים (7.10.2023 עד 6.4.2024)` : ''}${r.lim.rolled ? '; היום האחרון חל ביום מנוחה ועבר ליום שאחריו' : ''}`, rule: r.lim.added ? `${lim.section}, ${lim.war.section}` : lim.section, href: lim.url }]
		// No date: either a death claim (the estate's or the dependants' claim arises on the death), or a minor whose
		// birth date is missing, whose period starts at 18; each gets its own row (review, PR 126).
		: r.death ? [{ date: '', what: `תביעת העיזבון או התלויים: ${lim.years} שנים מהיום שבו נולדה העילה`, rule: `${lim.section}; סעיף 6`, href: lim.url }]
			: [{ date: '', what: `התיישנות לקטין: ${lim.years} שנים מגיל 18. הזינו את תאריך הלידה כדי לחשב את התאריך`, rule: `${lim.section}, ${lim.minor_section}`, href: lim.url }];
	// The injury wave: the dated steps of tnCompute() join the table and the .ics; the undated interim row stays until the
	// reader gives the day the written demand reached the insurer. Dated rows by date, undated rows after them.
	const ev = (r.tn && r.tn.events) || [];
	if (!ev.some((e) => e.code === 'interim_due')) { out.push({ date: '', what: `תשלומים תכופים (הוצאות ריפוי ומחיה): ${ca.interim_days} ימים מקבלת דרישה בכתב אצל המבטח`, rule: ca.sections.interim, href: ca.law_url }); }
	for (const e of ev) { out.push({ date: e.date, what: e.he, rule: e.section, href: e.url, code: e.code }); }
	return out.map((x, i) => [x, i]).sort((a, b) => (a[0].date && b[0].date ? (a[0].date < b[0].date ? -1 : a[0].date > b[0].date ? 1 : a[1] - b[1]) : a[0].date ? -1 : b[0].date ? 1 : a[1] - b[1])).map((x) => x[0]);
}

/** Page section: the share of the maximum by disability and age, from the same engine. */
export function shareTable(reg) {
	const ages = [25, 40, 55, 70];
	const dis = [5, 10, 20, 30, 50, 100];
	const head = ages.map((a) => `<th scope="col">גיל ${a}</th>`).join('');
	const rows = dis.map((d) => `<tr><td data-th="נכות">${d}%</td>${ages.map((a) => { const r = compute(reg, { disability: d, days: 0, age: a, accident: '2026-01-01', excluded: [] }); return `<td data-th="גיל ${a}"><bdi>${pctTxt(r.np.pct)}</bdi></td>`; }).join('')}</tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>כאב וסבל כשיעור מהסכום המקסימלי, לפי אחוזי נכות וגיל ביום התאונה, בלי ימי אשפוז (תקנות 2(א)(2) ו-3). כל יום אשפוז מוסיף ${pctTxt(reg.car_accident.nonpecuniary.hospital_permille / 10)}.</caption><thead><tr><th scope="col">נכות</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const today = reg.car_accident.checked_on;
	const r = reg.injury_teuna ? tnCompute(reg, Object.assign({ today }, EXAMPLE)) : compute(reg, Object.assign({ today }, EXAMPLE));
	const np = reg.car_accident.nonpecuniary;
	const dis = r.np.parts.find((p) => p.key === 'disability');
	const hos = r.np.parts.find((p) => p.key === 'hospital');
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.np.pct,
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: tnResult(reg, r, { example: true }),
		details: tnDetails(reg, r, { today, printedOn: reg.injury_teuna ? reg.injury_teuna.checked_on : today }),
		method: `<ol><li>נכות לצמיתות: ${pctTxt(dis.raw)} × ${pctTxt(np.disability_pct_per_pct)} מהסכום המקסימלי לכל אחוז = ${pctTxt(dis.raw)}${cite(np.sections.disability, reg.car_accident.regs_url)}</li>`
			+ `<li>הפחתת גיל: בגיל ${EXAMPLE.age} ביום התאונה, ${pctTxt(dis.ageCut)} פחות: ${pctTxt(dis.raw)} × ${pctTxt(100 - dis.ageCut)} = ${pctTxt(dis.pct)}${cite(np.sections.age, reg.car_accident.regs_url)}</li>`
			+ `<li>אשפוז: ${hos.days} ימים × ${pctTxt(np.hospital_permille / 10)} = ${pctTxt(hos.pct)}${cite(np.sections.hospital, reg.car_accident.regs_url)}</li>`
			+ `<li>סך הכול: ${pctTxt(r.np.pct)} מהסכום המקסימלי.${cite(np.max_section, reg.car_accident.law_url)}</li>`
			+ `<li>על הצעה של ${money(EXAMPLE.amount, 0)} ₪ בלי תביעה: שכר טרחה עד ${pctTxt(r.fees.none.pct)} ועוד מע"מ ${r.vat}% = ${money(r.fees.none.withVat)} ₪, ונשארים ${money(r.fees.none.net)} ₪.${cite('סעיף 16(א); כלל 4', reg.car_accident.law_url)}</li>`
			+ (reg.injury_teuna ? tnMethodTail(reg, r) : '') + '</ol>',
		compare_table: shareTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const num = (id) => { const v = val(`#${P}-${id}`).trim().replace(/,/g, '').replace('%', ''); return v === '' ? '' : Number(v); };
	const moneyOf = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const death = Boolean(root.querySelector(`input[name="${P}-dth"]:checked`));
	// Only what is on screen is read: in death mode the living-claim fields are hidden, so they are not read at all, and
	// a hidden birth-date field is never read either (review, PR 126).
	const alive = (fn) => (death ? '' : fn());
	return Object.assign({
		disability: alive(() => num('dis')), days: alive(() => num('days')), age: alive(() => num('age')),
		accident: toIso(val(death ? `#${P}-acc2` : `#${P}-acc`)), birth: death || (root.querySelector('[data-if-minor]') || {}).hidden ? '' : toIso(val(`#${P}-birth`)), death,
		work: Boolean(root.querySelector(`input[name="${P}-wrk"]:checked`)),
		amount: moneyOf('amt'), stage: (root.querySelector(`input[name="${P}-stg"]:checked`) || {}).value || 'none',
		income: alive(() => moneyOf('inc')), months: alive(() => num('mon')), max: moneyOf('max'),
		excluded: [...root.querySelectorAll(`input[name="${P}-ex"]:checked`)].map((x) => x.value),
	}, tnReadForm(root, death));
}

/** The injury wave's fields (jt60 ids); in death mode the living-claim fields are not read, like the ones above. */
function tnReadForm(root, death) {
	const val = (id) => (root.querySelector(`#${Q}-${id}`) || {}).value || '';
	const numOf = (id) => { const v = val(id).trim().replace(/,/g, '').replace('%', ''); return v === '' ? '' : Number(v); };
	const moneyOf = (id) => { const v = val(id).trim(); return v === '' ? '' : parseMoney(v); };
	const on = (name) => Boolean(root.querySelector(`input[name="${Q}-${name}"]:checked`));
	const alive = (fn) => (death ? '' : fn());
	return {
		functional: alive(() => numOf('fn')), retire: alive(() => numOf('ret')),
		medical: alive(() => moneyOf('med')), help: alive(() => moneyOf('help')), travel: alive(() => moneyOf('trv')),
		demand: alive(() => toIso(val('dem'))), expertNotice: alive(() => toIso(val('exn'))), opinion: alive(() => toIso(val('opn'))),
		late: !death && on('late'), role: (root.querySelector(`input[name="${Q}-role"]:checked`) || {}).value || '', multi: on('multi'), karnit: on('karnit'),
	};
}

/* ---------------- Share state (exported for the sibling tools: numbers only, never a name) ---------------- */

const ST = { none: 'n', settle: 's', judgment: 'j' };
const EX = { intent: 'i', unauthorised: 'u', licence: 'l', felony: 'f', uninsured: 'n', owner: 'o' };
const TN_ROLE = { in: 'i', out: 'o' };
/** d disability %, h hospital days, a age, t accident day, b birth day (minor), x death, w on the way to work, m offer,
 * s stage, c income, o months off work, k the maximum entered, e exclusions; the injury wave: f functional %, r the age
 * the loss runs to, y medical, z help, v travel, q the interim demand day, n the expert's appointment notice, p the
 * opinion received, u late discovery, g inside (i) or outside (o) the vehicle, l several vehicles, j Karnit. */
export const KEYS = ['d', 'h', 'a', 't', 'b', 'x', 'w', 'm', 's', 'c', 'o', 'k', 'e', 'f', 'r', 'y', 'z', 'v', 'q', 'n', 'p', 'u', 'g', 'l', 'j'];
export function stateOf(i) {
	const v = (x) => (typeof x === 'number' && !Number.isFinite(x) ? '' : x);
	return encodeState({
		d: v(i.disability), h: v(i.days), a: v(i.age), t: i.accident, b: i.birth, x: i.death ? 1 : '', w: i.work ? 1 : '', m: v(i.amount), s: ST[i.stage] || 'n', c: v(i.income), o: v(i.months), k: v(i.max), e: (i.excluded || []).map((x) => EX[x]).join(''),
		f: v(i.functional), r: v(i.retire), y: v(i.medical), z: v(i.help), v: v(i.travel), q: i.demand, n: i.expertNotice, p: i.opinion, u: i.late ? 1 : '', g: TN_ROLE[i.role] || '', l: i.multi ? 1 : '', j: i.karnit ? 1 : '',
	});
}
/** A link from a sibling tool may carry only some numbers (say, the weighted disability): the four fields the formula
 * needs and the link lacks come from the example, and `filled` names them so the page can say so. */
export function inputOf(s) {
	if (!s || !KEYS.some((k) => s[k] !== undefined && s[k] !== '')) { return null; }
	const n = (x) => (x === undefined || x === '' ? '' : Number(x));
	const filled = [];
	const core = (k, field) => {
		if (s[k] !== undefined && s[k] !== '') { return field === 'accident' ? s[k] : Number(s[k]); }
		if (!s.t) { filled.push(field); return EXAMPLE[field]; }
		return '';
	};
	return {
		disability: core('d', 'disability'), days: core('h', 'days'), age: core('a', 'age'), accident: core('t', 'accident'), birth: s.b || '', death: s.x === '1', work: s.w === '1',
		amount: n(s.m), stage: Object.keys(ST).find((k) => ST[k] === s.s) || 'none', income: n(s.c), months: n(s.o), max: n(s.k),
		excluded: (s.e || '').split('').map((c) => Object.keys(EX).find((k) => EX[k] === c)).filter(Boolean),
		functional: n(s.f), retire: n(s.r), medical: n(s.y), help: n(s.z), travel: n(s.v), demand: s.q || '', expertNotice: s.n || '', opinion: s.p || '',
		late: s.u === '1', role: s.g === 'i' ? 'in' : s.g === 'o' ? 'out' : '', multi: s.l === '1', karnit: s.j === '1', filled,
	};
}
/** '<page path>#s=<state>': the link a sibling tool builds to open this instrument with the reader's numbers. */
export function stateLink(reg, input) {
	const page = (reg.injury_teuna && reg.injury_teuna.page) || '/israel-road-accident-compensation-law/';
	return `${page}#s=${stateOf(input)}`;
}

/* ---------------- The injury wave: profiles, lead card, picture, panels ---------------- */

const Q = 'jt60';
const TN_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=witness_prep&topic=personal-injury';
const TN_FILLED_HE = { disability: 'אחוזי הנכות', days: 'ימי האשפוז', age: 'הגיל', accident: 'יום התאונה' };

/** One click to a full profile; the accident day is that many months before today, and the reader's offer is kept. */
export const PROFILES = {
	y25: { he: 'גיל 25 · 10% נכות · 3 ימי אשפוז', disability: 10, days: 3, age: 25, back: 12 },
	a45: { he: 'גיל 45 · 20% נכות · שבוע אשפוז · שכר 15,000', disability: 20, days: 7, age: 45, back: 18, income: 15000, months: 3, functional: 15, retire: 67 },
	none: { he: 'בלי נכות לצמיתות ובלי אשפוז', disability: 0, days: 0, age: 35, back: 6 },
	minor: { he: 'קטין בן 12 · 15% נכות', disability: 15, days: 4, age: 12, back: 24, minor: true },
	work: { he: 'בדרך לעבודה · 10% נכות · שכר 9,000', disability: 10, days: 2, age: 38, back: 10, work: true, income: 9000, months: 2, functional: 10, retire: 67 },
};
const TN_BLANK = { birth: '', death: false, max: '', income: '', months: '', amount: '', stage: 'none', work: false, excluded: [], functional: '', retire: '', medical: '', help: '', travel: '', demand: '', expertNotice: '', opinion: '', late: false, role: '', multi: false, karnit: false };
export function tnProfile(key, today, keep = {}) {
	const p = PROFILES[key];
	if (!p) { return null; }
	const accident = addMonths(today, -p.back);
	return Object.assign({}, TN_BLANK, { amount: keep.amount ?? '', stage: keep.stage || 'none', max: keep.max ?? '' }, {
		disability: p.disability, days: p.days, age: p.age, accident, birth: p.minor ? addDays(addYears(accident, -p.age), -100) : '',
		work: Boolean(p.work), income: p.income ?? '', months: p.months ?? '', functional: p.functional ?? '', retire: p.retire ?? '',
	});
}

function tnProfilesHtml(reg, input) {
	if (!reg.injury_teuna) { return ''; }
	return `<fieldset class="jtool-field ${Q}-pfs"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${Q}-profiles">${Object.entries(PROFILES).map(([k, v]) => `<button type="button" class="${Q}-profile" data-act="tn-profile" data-profile="${k}" aria-pressed="false">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">כל מצב ממלא את כל הפרטים, עם יום תאונה כמה חודשים לפני היום; אפשר לשנות כל שדה. הצעה שהזנתם נשארת.</p></fieldset>';
}

function tnField(id, label, value, opts = {}) {
	return `<div class="jtool-field"><label class="jtool-label" for="${Q}-${id}">${esc(label)}</label><div class="jtool-input${opts.money ? ' jtool-input--money' : ''}"><input id="${Q}-${id}" type="text" inputmode="${opts.mode || 'decimal'}" autocomplete="off" value="${esc(value)}" placeholder="${esc(opts.ph || '')}" aria-describedby="${opts.hint ? `${Q}-${id}-h ` : ''}${Q}-${id}-e">${opts.suffix ? `<span class="jtool-input__suffix" aria-hidden="true">${opts.suffix}</span>` : ''}</div>${opts.hint ? `<p class="jtool-hint" id="${Q}-${id}-h">${opts.hint}</p>` : ''}<p class="jtool-error" id="${Q}-${id}-e" role="alert"></p></div>`;
}
const tnMoney = (v) => (v === '' || v === undefined || v === null || Number.isNaN(Number(v)) ? '' : money(v, 0));

function tnFutureFields(reg, input) {
	const ti = reg.injury_teuna;
	if (!ti) { return ''; }
	return `<div class="jtool-row" style="margin-top:12px">${tnField('fn', 'נכות תפקודית: כמה מכושר ההשתכרות אבד', input.functional ?? '', { suffix: '%', ph: 'לדוגמה: 15', hint: esc('כפי שבית המשפט קבע או הוסכם; היא יכולה להיות שונה מהנכות הרפואית') })}`
		+ `${tnField('ret', 'עד איזה גיל לחשב את ההפסד', input.retire ?? '', { mode: 'numeric', ph: 'לדוגמה: 67', hint: `${esc(ti.future.retire_he)}.${cite('ביטוח לאומי', ti.future.retire_url)}` })}</div>`;
}

function tnMoreFields(reg, input) {
	const ti = reg.injury_teuna;
	if (!ti) { return ''; }
	const radio = (name, value, label, checked) => `<label class="jtool-chip"><input type="radio" name="${Q}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const box = (name, label, checked) => `<label class="jtool-chip"><input type="checkbox" name="${Q}-${name}" value="1"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const hid = input.death ? ' hidden' : '';
	const anyExp = input.medical || input.help || input.travel;
	const anyDate = input.demand || input.expertNotice || input.opinion || input.late;
	return `<details class="jtool-more ${Q}-who"${input.role || input.karnit || input.multi ? ' open' : ''}><summary>את מי תובעים: נהג, נוסע או הולך רגל</summary>`
		+ `<fieldset class="jtool-field" style="margin-top:8px"><legend>איפה הייתם בתאונה</legend><div class="jtool-chips">${radio('role', 'in', 'ברכב: נהג או נוסע', input.role === 'in')}${radio('role', 'out', 'מחוץ לרכב, למשל הולך רגל', input.role === 'out')}</div></fieldset>`
		+ `<div class="jtool-chips">${box('multi', 'היו מעורבים כמה כלי רכב', input.multi)}${box('karnit', 'פגע וברח, או רכב בלי ביטוח חובה', input.karnit)}</div></details>`
		+ `<details class="jtool-more" data-if-alive${hid}${anyExp ? ' open' : ''}><summary>הוצאות שכבר הוצאתם (עם קבלות)</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${tnField('med', 'רפואה, תרופות ואשפוז', tnMoney(input.medical), { money: true, suffix: '₪', ph: '0' })}${tnField('help', 'עזרה וסיעוד', tnMoney(input.help), { money: true, suffix: '₪', ph: '0' })}</div>`
		+ `<div class="jtool-row" style="margin-top:12px">${tnField('trv', 'נסיעות והוצאות אחרות', tnMoney(input.travel), { money: true, suffix: '₪', ph: '0' })}</div>`
		+ `<p class="jtool-hint">${esc(ti.ordinance.particulars_he)} (${esc(ti.ordinance.particulars_section)} לפקודת הנזיקין).</p></details>`
		+ `<details class="jtool-more" data-if-alive${hid}${anyDate ? ' open' : ''}><summary>מועדים: תשלום תכוף, המומחה, נזק שהתגלה מאוחר</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${tnField('dem', 'היום שבו הדרישה בכתב לתשלום תכוף הגיעה למבטח', isoToHe(input.demand || ''), { mode: 'numeric', ph: 'לדוגמה: 1.6.2025' })}</div>`
		+ `<div class="jtool-row" style="margin-top:12px">${tnField('exn', 'היום שבו קיבלתם הודעה על מינוי המומחה', isoToHe(input.expertNotice || ''), { mode: 'numeric', ph: 'לדוגמה: 3.5.2026' })}${tnField('opn', 'היום שבו קיבלתם את חוות דעת המומחה', isoToHe(input.opinion || ''), { mode: 'numeric', ph: 'לדוגמה: 10.8.2026' })}</div>`
		+ `<div class="jtool-chips">${box('late', 'הנזק התגלה מאוחר יותר, לא ביום התאונה', input.late)}</div>`
		+ '<p class="jtool-hint">כל מועד שחוק או תקנה קובעים נכנס לטבלת המועדים ולקובץ היומן.</p></details>';
}

const tnRange = (lo, hi) => (lo === hi ? ils(lo, 0) : `${ils(lo, 0)} עד ${ils(hi, 0)}`);
const tnW = (x) => Math.max(0, Math.min(100, x)).toFixed(2);
const tnIls = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);

/** The result-first card at the top of the page ([justice_tool_lead]): the same markup on the server and in the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי הנתונים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">פיצויים בתאונת דרכים</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const np = r.np;
	const who = opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: ';
	const tn = r.tn || {};
	let label;
	let fig;
	let unit;
	if (np.kind === 'death') {
		label = `${who}כאב וסבל לעיזבון, במות הנפגע`;
		fig = r.npAmount !== null ? `<bdi>${money(r.npAmount, 0)}</bdi>` : `<bdi>${pctTxt(np.pct)}</bdi>`;
		unit = r.npAmount !== null ? '₪ (תקנה 4)' : 'מהסכום המקסימלי (תקנה 4)';
	} else if (np.kind === 'other') {
		label = `${who}כאב וסבל בלי נכות לצמיתות ובלי אשפוז`;
		fig = `<bdi>עד ${pctTxt(np.upTo)}</bdi>`;
		unit = 'מהסכום המקסימלי, בהסכמה או בפסק דין (תקנה 2(ב))';
	} else {
		const dis = np.parts.find((p) => p.key === 'disability');
		const hos = np.parts.find((p) => p.key === 'hospital');
		label = `${who}כאב וסבל לפי התקנות${dis ? `, ${pctTxt(dis.raw)} נכות` : ''}${tn.age !== null && tn.age !== undefined ? `, גיל ${tn.age}` : ''}${hos ? `, ${hos.days} ימי אשפוז` : ''}`;
		fig = r.npAmount !== null ? `<bdi>${money(r.npAmount, 0)}</bdi>` : `<bdi>${pctTxt(np.pct)}</bdi>`;
		unit = r.npAmount !== null ? '₪ על כאב וסבל' : 'מהסכום המקסימלי';
	}
	const bits = [];
	const fee = r.fees[r.stage];
	if (fee) { bits.push(`מהצעה של ${nis(r.amount)} (${STAGE_LABEL[r.stage]}) נשארים לכם לפחות ${nis(fee.net)} אחרי שכר טרחה ומע"מ.`); }
	if (tn.future) { bits.push(`הפסד כושר השתכרות: ${money(tn.future.low, 0)} עד ${money(tn.future.high, 0)} ₪ לחודש.`); }
	if (r.lim) { bits.push(`ההתיישנות: ${isoToHe(r.lim.deadline)}.`); }
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">${fig}</strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(bits.join(' '))}</p>${go}`;
}

/** The scenario for the simulation: computed facts only (amounts as bands), never a name, an ID or an address. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const tn = r.tn || {};
	const lim = r.lim ? ` התביעה מתיישנת ב-${isoToHe(r.lim.deadline)}.` : '';
	const ask = ' השאלה לתרגול: הבדיקה אצל המומחה הרפואי שמינה בית המשפט והעדות. איך מתארים את הפגיעה, הכאבים והמגבלות בעבודה ובבית בצורה מדויקת, בלי להגזים ובלי להמעיט, ואיך עונים לשאלות של עורך הדין של חברת הביטוח?';
	if (r.np.kind === 'death') {
		return `תביעה של העיזבון והתלויים אחרי מות אדם בתאונת דרכים. לפי תקנה 4, הפיצוי לעיזבון על כאב וסבל הוא ${pctTxt(r.np.pct)} מהסכום המקסימלי, והתלויים תובעים את הפסד הממון שלהם. השאלה לתרגול: העדות של בני המשפחה על התלות הכלכלית ועל ההוצאות. איך מציגים אותן בבהירות, ואיך עונים לחקירה של עורך הדין של חברת הביטוח?`;
	}
	const head = r.np.kind === 'other'
		? `אדם שנפגע בתאונת דרכים${tn.age !== null ? ` בגיל ${tn.age}` : ''}, בלי נכות לצמיתות ובלי אשפוז. הפיצוי על כאב וסבל מוסכם או נפסק, עד ${pctTxt(r.np.upTo)} מהסכום המקסימלי.`
		: `אדם שנפגע בתאונת דרכים בגיל ${tn.age}, עם ${pctTxt(r.np.parts.find((p) => p.key === 'disability') ? r.np.parts.find((p) => p.key === 'disability').raw : 0)} נכות רפואית לצמיתות${tn.days ? ` ו-${tn.days} ימי אשפוז` : ''}. לפי התקנות, כאב וסבל הם ${pctTxt(r.np.pct)} מהסכום המקסימלי.`;
	const fut = tn.future ? ` הכנסה לפני התאונה כ-${money(Math.round(tn.future.income / 1000) * 1000, 0)} ₪ לחודש, ונכות תפקודית של ${tn.future.f}%.` : '';
	const work = tn.work ? ' התאונה הייתה בדרך לעבודה, ולכן היא גם תאונת עבודה בביטוח הלאומי.' : '';
	return `${head}${fut}${work}${lim}${ask}`;
}

/** Linking into the sibling tools of the cluster with the reader's numbers, through each tool's own share state (keys
 * read from their UI files in the wave's worktrees on 22.10.2026); a plain page link when there is no number to carry.
 *  - shiklul-nechut (shiklul-ui.js KEYS: k kind 's' stable, i items "code_pct_side_prev_a_b" with code 'f' = a free %,
 *    a age, j injury day): the medical disability as one free item, to split into its impairments there;
 *  - teunat-avoda (avoda-ui.js KEYS: k 'w' employee, t injury day, a age, w monthly wage, l 'y' on the way to work,
 *    r 1 = also a road accident). Numbers and dates only, never a name. */
export function tnSiblingLinks(reg, r) {
	const tn = r.tn || {};
	const dis = r.ok && r.np && r.np.parts ? r.np.parts.find((p) => p.key === 'disability') : null;
	const age = tn.age !== null && tn.age !== undefined ? tn.age : '';
	const wage = tn.future ? Math.round(tn.future.income) : (r.earnings ? Math.round(r.earnings.income) : '');
	return {
		shiklul: dis ? `/regulations-insurance-1956/#s=${encodeState({ k: 's', i: [['f', String(dis.raw), 'r', '', '', '']], a: age, j: r.accident || '' })}` : '/regulations-insurance-1956/',
		avoda: tn.work && r.accident ? `/work-accident-guide/#s=${encodeState({ k: 'w', t: r.accident, a: age, w: wage, l: 'y', r: 1 })}` : '/work-accident-guide/',
	};
}

/** "What to do now": the official route first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const ca = reg.car_accident;
	const ti = reg.injury_teuna;
	const tn = r.tn || {};
	const sib = tnSiblingLinks(reg, r);
	const official = [];
	if (tn.who && tn.who.code === 'karnit') {
		official.push({ he: `תביעה לקרנית: ${ti.who.karnit_suit_he} (${ti.who.karnit_section})`, url: ti.who.karnit_suit_url });
	} else {
		official.push({ he: `לברר מי מבטח את הרכב בביטוח חובה, לפי מספר הרישוי, בשאילתה של קרנית (${ti.who.insurer_lookup_section})`, url: ti.who.insurer_lookup_url });
	}
	if (!r.death) { official.push({ he: `לשלוח למבטח דרישה בכתב לתשלום תכוף של הוצאות ריפוי ומחיה: הוא משלם תוך ${ca.interim_days} ימים (${ca.sections.interim}), ואחר כך אפשר לפנות לבית משפט השלום (${ti.interim.court_section})`, url: ca.law_url }); }
	if (tn.work) { official.push({ he: `תביעה בביטוח הלאומי לדמי פגיעה ולנכות מעבודה; הגמלה תנוכה מהפיצויים (${ti.nii.section} לחוק הביטוח הלאומי)`, url: ti.nii.work_url }); }
	if (!r.death) { official.push({ he: `בתביעה לבית המשפט: בקשה למינוי מומחה רפואי מצורפת לכתב התביעה (${ti.expert.request_section} ל${ti.expert.regs_he})`, url: ti.expert.url }); }
	const links = [];
	if (!r.death) { links.push({ path: '/sole-court-expert-road-accident/', he: 'המומחה הרפואי מטעם בית המשפט: איך מתכוננים לבדיקה' }); }
	if (!r.death) { links.push({ path: sib.shiklul, he: 'איך נקבעים ומשוקללים אחוזי הנכות לפי תקנות 1956' }); }
	if (tn.work) { links.push({ path: sib.avoda, he: 'תאונה בדרך לעבודה: דמי פגיעה ונכות מעבודה' }); }
	if (tn.who && tn.who.code === 'karnit') { links.push({ path: '/karnit-fund-uninsured-hit-run/', he: 'קרנית: פגע וברח ורכב בלי ביטוח' }); }
	if (tn.future) { links.push({ path: '/ceiling-lost-earnings-triple-wage/', he: 'תקרת הפסד ההשתכרות: פי 3 מהשכר הממוצע' }); }
	if (r.amount) { links.push({ path: '/eight-eleven-thirteen-fee-tariff/', he: 'שכר טרחה בתאונת דרכים: 8%, 11% או 13%' }); }
	if (links.length < 4) { links.push({ path: '/car-accident-auto-injury-lawyer/', he: 'מתי צריך עורך דין לתאונת דרכים' }); }
	return { official, links: links.slice(0, 4) };
}

function tnWhoBox(reg, r) {
	const w = r.tn.who;
	const ti = reg.injury_teuna;
	const main = w.code ? `${esc(w.he)}.${cite(w.section, w.url || reg.car_accident.law_url)}` : `${esc(ti.who.vehicle_he)}.${cite(ti.who.vehicle_section, reg.car_accident.law_url)} סמנו בתיבה "את מי תובעים" אם הייתם ברכב או מחוצה לו.`;
	return `<div class="${Q}-whobox"><h4>מי משלם</h4><p>${main}</p><p class="${Q}-small">${esc(w.lookup.he)}.${cite(w.lookup.section, w.lookup.url)}</p></div>`;
}

/** The picture: a claim ledger, one line per head of damage, each bar drawn against the cap the law sets for it. */
export function tnLedgerFig(reg, r) {
	const ca = reg.car_accident;
	const ti = reg.injury_teuna;
	const L = r.tn.ledger;
	const fut = r.tn.future;
	const income = r.earnings ? r.earnings.income : (fut ? fut.income : 0);
	const capPast = (L.rows.find((x) => x.code === 'past') || {}).cap;
	const S = Math.max(income || 0, capPast ? capPast.amount : 1) * 1.12;
	const exp = L.rows.filter((x) => x.kind === 'amount');
	const maxExp = exp.length ? Math.max(...exp.map((x) => x.amount)) : 1;
	const track = (label, fill, cap, over, cls) => `<div class="${Q}-track${cls ? ` ${cls}` : ''}" role="img" aria-label="${esc(label)}"><span class="${Q}-fill" style="width:${tnW(fill)}%"></span>${over ? `<span class="${Q}-over" style="inset-inline-start:${tnW(fill)}%;width:${tnW(over)}%"></span>` : ''}${cap !== null ? `<span class="${Q}-cap${cap > 92 ? ` ${Q}-cap--end` : ''}" style="inset-inline-start:${tnW(cap)}%"><i>תקרה</i></span>` : ''}</div>`;
	const urlOf = (code) => (code === 'nonpec' ? ca.regs_url : code === 'travel' ? ti.ordinance.url : ca.law_url);
	const items = L.rows.map((row) => {
		let val = '';
		let bar = '';
		let rule = '';
		if (row.code === 'nonpec') {
			const pct = row.kind === 'upto' ? row.upTo : row.pct;
			val = row.kind === 'upto' ? `<bdi>עד ${pctTxt(pct)}</bdi> מהסכום המקסימלי` : `<bdi>${pctTxt(pct)}</bdi> מהסכום המקסימלי${row.amount !== null ? ` · ${ils(row.amount, 0)}` : ''}`;
			bar = track(`${pctTxt(pct)} מתוך 100% של הסכום המקסימלי`, pct, 100, 0, row.kind === 'upto' ? `${Q}-track--upto` : '');
			rule = `התקרה: הסכום המקסימלי, ${money(ca.nonpecuniary.max_lira, 0)} לירות צמודות למדד; בתוכו הנוסחה של התקנות.`;
		} else if (row.code === 'past') {
			const cap = row.cap.amount;
			val = row.kind === 'empty' ? 'הזינו הכנסה לפני התאונה' : `${ils(row.perMonth, 0)} לחודש${row.months ? ` · ${row.months} חודשים: ${tnRange(row.low, row.high)}` : ''}`;
			bar = track(row.kind === 'empty' ? `תקרה של לפחות ${money(cap, 0)} ₪ לחודש` : `הכנסה ${money(row.perMonth, 0)} ₪ לחודש מול תקרה של לפחות ${money(cap, 0)} ₪`, row.kind === 'empty' ? 0 : Math.min(row.perMonth, cap) / S * 100, cap / S * 100, row.kind !== 'empty' && row.perMonth > cap ? (row.perMonth - cap) / S * 100 : 0);
			rule = `קו התקרה: לפחות ${money(cap, 0)} ₪ לחודש, פי ${ca.earnings.ceiling_multiple} מהשכר הממוצע; מה שמעליו לא נספר. אחרי מס, ההפחתה עד ${ca.earnings.tax_cap_pct}%.`;
		} else if (row.code === 'future') {
			val = row.kind === 'empty' ? 'הזינו הכנסה ונכות תפקודית' : `${tnIls(row.perMonth)} לחודש לפני מס${row.months !== null ? ` · ${row.months} חודשים: ${tnRange(row.low, row.high)}, בלי היוון` : ' · הזינו עד איזה גיל'}`;
			bar = row.kind === 'empty' ? track('לא הוזנו הכנסה ונכות תפקודית', 0, null, 0) : track(`הפסד של ${money(row.perMonth, 0)} ₪ לחודש מול תקרה מופחתת של ${money(row.cap.amount, 0)} ₪`, row.perMonth / S * 100, row.cap.amount / S * 100, 0);
			rule = row.kind === 'empty' ? esc(ti.earnings.partial_he) : `${esc(ti.earnings.partial_he)}: ${money(fut.ceil, 0)} × ${fut.f}% = ${money(row.cap.amount)} ₪.`;
		} else {
			val = row.kind === 'empty' ? 'לא הוזן' : ils(row.amount, 0);
			bar = row.kind === 'empty' ? '' : track(`${money(row.amount, 0)} ₪, בלי תקרה בחוק`, row.amount / maxExp * 88, null, 0, `${Q}-track--free`);
			rule = row.code === 'medical' ? `בלי תקרה בחוק. משולמות כתשלום תכוף תוך ${ca.interim_days} ימים מדרישה בכתב.` : row.code === 'help' ? 'בלי תקרה בחוק. תשלום חודשי לסיעוד ולמחיה עד ההחלטה הסופית, כתשלום תכוף.' : 'בלי תקרה בחוק. צריך פירוט וקבלות.';
		}
		return `<li class="${Q}-head ${Q}-head--${row.code}${row.kind === 'empty' ? ` ${Q}-head--empty` : ''}"><div class="${Q}-head__top"><span class="${Q}-head__name">${esc(row.he)}</span><span class="${Q}-head__val">${val}</span></div>${bar}<p class="${Q}-head__rule">${typeof rule === 'string' ? rule : ''}${cite(row.section, urlOf(row.code))}</p></li>`;
	}).join('');
	const open = L.nonpecOpen !== null ? `, ועוד ${pctTxt(L.nonpecOpen)} מהסכום המקסימלי לכאב וסבל` : '';
	const sum = L.high > 0
		? `<p class="${Q}-sum">בשקלים, לפני ניכויים ובלי היוון: <strong>${tnRange(L.low, L.high)}</strong>${esc(open)}.</p>`
		: `<p class="${Q}-sum">עוד לא הוזנו סכומים בשקלים${esc(open)}.</p>`;
	const nii = r.tn.work ? `<p class="${Q}-small">${esc(ti.nii.he)}.${cite(`${ti.nii.section} לחוק הביטוח הלאומי`, ti.nii.url)}</p>` : '';
	return `<figure class="${Q}-ledger" aria-labelledby="${Q}-ledger-h"><figcaption class="${Q}-ledger__h" id="${Q}-ledger-h">פנקס התביעה: כל ראש נזק מול התקרה שהחוק קובע לו</figcaption><ol class="${Q}-heads">${items}</ol>${sum}${nii}${r.amount ? tnFeeBar(reg, r) : ''}</figure>`;
}

/** The fee bar: the offer as one bar, the lawyer's maximum with VAT at the reader's stage, the three stages as ticks. */
function tnFeeBar(reg, r) {
	const here = r.fees[r.stage];
	const share = here.withVat / r.amount * 100;
	const ticks = STAGES.map((s) => `<span class="${Q}-tick${s === r.stage ? ` ${Q}-tick--here` : ''}" style="inset-inline-start:${tnW(r.fees[s].withVat / r.amount * 100)}%"></span>`).join('');
	const keys = STAGES.map((s) => `<li${s === r.stage ? ` class="${Q}-here"` : ''}><b>${pctTxt(r.fees[s].pct)}</b> ${esc(STAGE_LABEL[s])}: ${ils(r.fees[s].withVat)} עם מע"מ, נשארים ${ils(r.fees[s].net)}</li>`).join('');
	return `<div class="${Q}-fee"><p class="${Q}-fee__h">שכר הטרחה המקסימלי מתוך ${esc(nis(r.amount))}</p><div class="${Q}-feebar" role="img" aria-label="${esc(`${pctTxt(r.fees[r.stage].pct)} ועוד מע"מ, ${nis(here.withVat)}; נשארים ${nis(here.net)}`)}"><span class="${Q}-feebar__fee" style="width:${tnW(share)}%"></span>${ticks}</div><ul class="${Q}-fee__keys">${keys}</ul></div>`;
}

function tnFuturePanel(reg, r) {
	const ca = reg.car_accident;
	const ti = reg.injury_teuna;
	const f = r.tn.future;
	if (r.death) { return ''; }
	const items = [];
	if (f) {
		items.push(`ההכנסה שנספרת: ${money(f.income, 0)} ₪${f.capped ? `, אבל רק עד ההכנסה המרבית, לפחות ${money(f.ceil, 0)} ₪` : ''} = ${money(f.counted, 0)} ₪ לחודש.${cite(ca.earnings.section, ca.law_url)}`);
		items.push(`× נכות תפקודית ${f.f}% = <strong>${tnIls(f.gross)}</strong> לחודש לפני מס. ${esc(ti.earnings.partial_he)}: ${money(f.ceil, 0)} × ${f.f}% = ${money(f.reducedCap)} ₪.${cite(ti.earnings.partial_section, ca.law_url)}`);
		items.push(`אחרי מס: בין ${tnIls(f.low)} (הפחתה של ${ca.earnings.tax_cap_pct}% לכל היותר) ל-${tnIls(f.high)} לחודש.${cite(ca.earnings.tax_section, ca.law_url)}`);
		items.push(f.months !== null
			? `מהיום עד ${isoToHe(f.end)}, גיל ${f.retire}${f.exact ? '' : ' (לכל המאוחר, לפי הגיל ביום התאונה בשנים שלמות)'}: ${f.months} חודשים × ההפסד לחודש = <strong>${tnRange(f.totalLow, f.totalHigh)}</strong>, בלי היוון.`
			: 'הזינו עד איזה גיל לחשב, והכלי יכפיל במספר החודשים מהיום ועד אז.');
	} else {
		items.push('הזינו הכנסה חודשית ונכות תפקודית בתיבה "הפסד השתכרות", והכלי יחשב את ההפסד לחודש ועד הגיל שתבחרו.');
	}
	items.push(`${esc(ti.future.capitalisation_he)}.`);
	items.push(`${esc(ti.future.periodic_rule_he)}.${cite(`${ti.future.periodic_section}; ${ti.future.periodic_law_section} לחוק`, ti.future.periodic_url)} ${esc(ti.future.periodic_increase_he)}.${cite(ti.future.periodic_increase_section, ti.future.periodic_url)}`);
	return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${Q}-fut-h">הפסד כושר השתכרות בעתיד</h3></div><ul class="${Q}-list">${items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`;
}

function tnMaxPanel(reg, r) {
	const ca = reg.car_accident;
	const ti = reg.injury_teuna;
	const np = ca.nonpecuniary;
	const items = [
		`החוק קובע ${money(np.max_lira, 0)} לירות.${cite(np.max_section, ca.law_url)}`,
		`הסכום צמוד למדד המחירים לצרכן מיום תחילת החוק, ${isoToHe(ca.law_from)}, ${esc(ti.max.increase_he)}.${cite(`${np.linkage_section}; ${ti.law_start.section.split(';')[0]}`, ca.law_url)}`,
		`${esc(ti.max.currency_he)}.${cite(ti.max.currency_section, ti.max.currency_url)}`,
		`את ההצמדה למדד אפשר לבדוק במחשבון ההצמדה של הלשכה המרכזית לסטטיסטיקה.${cite('מחשבון ההצמדה של הלמ"ס', ti.max.cbs_calculator_url)}`,
		`${esc(ti.max.none_he)}. ${esc(ti.max.report_he)}; ${esc(ti.max.report_use_he)}.${cite('הדו"ח ב-gov.il', ti.max.report_url)}`,
		`קיבלתם את הסכום המקסימלי בפסק דין או במכתב של המבטח? <button class="jtool-linkbtn" type="button" data-act="tn-max">להזין אותו</button>, והכלי יתרגם כל אחוז לשקלים.`,
	];
	return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${Q}-max-h">הסכום המקסימלי לכאב וסבל: הדרך לשקלים</h3></div><ol class="${Q}-method">${items.map((x) => `<li>${x}</li>`).join('')}</ol></div>`;
}

function tnRules(reg, r) {
	const ca = reg.car_accident;
	const ti = reg.injury_teuna;
	const li = (text, section, url) => `<li>${esc(text)}.${cite(section, url)}</li>`;
	const sib = tnSiblingLinks(reg, r);
	const who = [li(ti.who.vehicle_he, ti.who.vehicle_section, ca.law_url), li(ti.who.inside_he, ti.who.inside_section, ca.law_url), li(ti.who.outside_he, ti.who.outside_section, ca.law_url), li(`קרנית משלמת כש${ti.who.karnit_reasons_he}`, ti.who.karnit_section, ti.who.karnit_suit_url), li(ti.who.permitted_he, ti.who.permitted_section, ca.law_url), li(ti.who.dependants_he, ti.who.dependants_section, ca.law_url), li(ti.who.exclusive_he, ti.who.exclusive_section, ca.law_url), li(ti.who.insurer_lookup_he, ti.who.insurer_lookup_section, ti.who.insurer_lookup_url), li(ti.who.motorcycle_he, ti.who.motorcycle_section, ca.law_url), li(ti.who.compromise_he, ti.who.compromise_section, ca.law_url)].join('');
	const interim = [li(ca.interim_he, ca.sections.interim, ca.law_url), li(ti.interim.items_he, 'סעיף 5(ב)(1)-(2)', ca.law_url), li(ti.interim.court_he, ti.interim.court_section, ca.law_url), li(ti.interim.decision_he, ti.interim.decision_section, ca.law_url), li(ti.interim.late_he, ti.interim.late_section, ca.law_url), li(`אחרי החלטה, בקשה חדשה רק כשעברו ${ti.interim.again_months} חודשים והנסיבות השתנו`, ti.interim.again_section, ca.law_url), li(ti.interim.max_he, ti.interim.max_section, ca.law_url), li(ti.interim.refund_he, ti.interim.refund_section, ca.law_url), li(ti.interim.health_he, ti.interim.health_section, ca.law_url)].join('');
	const expert = [li(ca.expert_he, ca.sections.expert, ca.law_url), `<li>${esc(ti.expert.criteria_he)}.${cite(ti.expert.criteria_section, ca.regs_url)} <a href="${esc(sib.shiklul)}">איך משקללים כמה פגיעות</a></li>`, li('נכות שנקבעה לפי דין אחר (למשל בוועדה של הביטוח הלאומי) לפני שמיעת הראיות מחייבת גם בתביעה, אלא אם בית המשפט התיר להביא ראיות לסתור', ca.sections.other_law, ca.law_url), li(ti.expert.request_he, ti.expert.request_section, ti.expert.url), li(`הבקשה למינוי לא נדונה לפני ${ti.expert.hearing_days} ימים מהמצאת כתב ההגנה`, ti.expert.hearing_section, ti.expert.url), li(ti.expert.docs_he, ti.expert.docs_section, ti.expert.url), li(`בעלי הדין האחרים יכולים להשלים מסמכים תוך ${ti.expert.others_days} ימים`, ti.expert.others_section, ti.expert.url), li(`התנגדות לבדיקה או לדרישת מסמכים: תוך ${ti.expert.object_days} ימים`, ti.expert.object_section, ti.expert.url), li(ti.expert.opinion_he, ti.expert.opinion_section, ti.expert.url), li(ti.expert.questions_he, ti.expert.questions_section, ti.expert.url), li(ti.expert.summon_he, ti.expert.summon_section, ti.expert.url), li(ti.expert.procedure_he, ti.expert.procedure_section, ti.expert.url)].join('');
	const more = [li(`${ti.nii.he}; ${ti.nii.no_suit_he}`, `${ti.nii.section}, (ב)(1)`, ti.nii.url), li(ti.ordinance.insurance_he, `${ti.ordinance.insurance_section} לפקודת הנזיקין`, ti.ordinance.url), li(ti.ordinance.particulars_he, `${ti.ordinance.particulars_section} לפקודת הנזיקין`, ti.ordinance.url), li(ti.ordinance.discovery_he, `${ti.ordinance.discovery_section} לפקודת הנזיקין`, ti.ordinance.url), li(`${ti.limitation.revive_he}; ${ti.limitation.court_he}`, `${ti.limitation.revive_section}, ${ti.limitation.court_section} לחוק ההתיישנות`, ti.limitation.url), li(`פקודת הנזיקין חלה על התביעה בסעיפים שהחוק מונה: ${ti.ordinance.applied_he}`, ti.ordinance.applied_section, ca.law_url)].join('');
	return `<details class="jtool-more ${Q}-rules"><summary>כל הכללים: מי משלם, תשלום תכוף, המומחה, ניכויים והתיישנות, עם הסעיפים</summary>`
		+ `<h4>מי משלם</h4><ul class="${Q}-list">${who}</ul><h4>תשלומים תכופים</h4><ul class="${Q}-list">${interim}</ul><h4>המומחה הרפואי מטעם בית המשפט</h4><ul class="${Q}-list">${expert}</ul><h4>ניכויים, ביטוח פרטי והתיישנות</h4><ul class="${Q}-list">${more}</ul></details>`;
}

/** What changed and when: only values an official text dates. */
export function changesTable(reg) {
	const ca = reg.car_accident;
	const ti = reg.injury_teuna;
	const nii = ca.earnings.nii[ca.earnings.nii.length - 1];
	const rows = [
		{ when: ca.law_from, what: `${ti.law_start.he}: כאב וסבל לפי הנוסחה, ותקרה של ${money(ca.nonpecuniary.max_lira, 0)} לירות צמודות למדד`, src: ti.law_start.section, url: ca.law_url },
		{ when: ti.expert.from, what: `${ti.expert.regs_he} נכנסו לתוקף (${ti.expert.amended_he})`, src: 'תקנה 23(א)', url: ti.expert.url },
		{ when: ti.vat.prev_from, what: `מע"מ ${ti.vat.prev_pct}% על שכר הטרחה`, src: ti.vat.prev_gazette_he, url: ti.vat.url },
		{ when: ti.nii.from, what: `${ti.nii.no_suit_he}; הגמלה מופחתת מהפיצויים`, src: `${ti.nii.section} לחוק הביטוח הלאומי`, url: ti.nii.url },
	];
	for (const w of ti.earnings.avg_wage_rows) { rows.push({ when: w.from, what: `שכר ממוצע ${money(w.s1, 0)} ₪ (סעיף 1) ו-${money(w.s2, 0)} ₪ (סעיף 2): תקרת ההכנסה לפחות ${money(ca.earnings.ceiling_multiple * Math.min(w.s1, w.s2), 0)} ₪ לחודש`, src: 'ביטוח לאומי', url: ti.earnings.avg_wage_url }); }
	rows.push({ when: nii.from, what: `שכר ממוצע ${money(nii.s1, 0)} ₪ (סעיף 1) ו-${money(nii.s2, 0)} ₪ (סעיף 2): תקרת ההכנסה לפחות ${money(ca.earnings.ceiling_multiple * Math.min(nii.s1, nii.s2), 0)} ₪ לחודש`, src: 'ביטוח לאומי', url: nii.url });
	rows.push({ when: '2024', what: `${ti.limitation.amendment_he}: ${isoToHe(ca.limitation.war.from)} עד ${isoToHe(ca.limitation.war.to)} לא נספרים בהתיישנות`, src: ca.limitation.war.section, url: ca.limitation.url });
	rows.push({ when: ti.vat.from, what: `מע"מ ${ca.fees.vat_pct}% על שכר הטרחה`, src: ti.vat.gazette_he, url: ti.vat.url });
	rows.sort((a, b) => (a.when < b.when ? -1 : a.when > b.when ? 1 : 0));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${Q}-chg-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתי"><bdi>${/^\d{4}-\d{2}-\d{2}$/.test(x.when) ? isoToHe(x.when) : esc(x.when)}</bdi></td><td data-th="מה השתנה">${esc(x.what)}</td><td data-th="מקור">${cite(x.src, x.url)}</td></tr>`).join('')
		+ `</tbody><caption>רק ערכים שפורסמו בנוסח רשמי, עם התאריך שלהם. נוסח החוק בנבו: עדכני ל-${isoToHe(ca.law_current_to)}.</caption></table></div>`;
}

function tnMethod(reg, r) {
	const ca = reg.car_accident;
	const np = ca.nonpecuniary;
	const out = [];
	if (r.np.kind === 'death') { out.push(`במות הנפגע: ${pctTxt(np.death_pct)} מהסכום המקסימלי לעיזבון (${np.sections.death})`); }
	if (r.np.kind === 'other') { out.push(`בלי נכות ובלי אשפוז: עד ${pctTxt(np.no_permanent_max_pct)} מהסכום המקסימלי (${np.sections.other})`); }
	for (const p of r.np.parts || []) {
		if (p.key === 'disability') { out.push(`${pctTxt(p.raw)} נכות × ${pctTxt(np.disability_pct_per_pct)} = ${pctTxt(p.raw)}${p.ageCut ? `; פחות ${pctTxt(p.ageCut)} בגלל הגיל = ${pctTxt(p.pct)} (${np.sections.age})` : ''} (${np.sections.disability})`); }
		if (p.key === 'hospital') { out.push(`${p.days} ימי אשפוז × ${pctTxt(np.hospital_permille / 10)} = ${pctTxt(p.pct)} (${np.sections.hospital})`); }
	}
	if (r.np.pct !== null) { out.push(`כאב וסבל: ${pctTxt(r.np.pct)} מהסכום המקסימלי${r.npAmount !== null ? ` × ${nis(r.max)} = ${nis(r.npAmount)}` : ''}`); }
	if (r.earnings) { out.push(`הפסד השתכרות: ${nis(r.earnings.income)} לחודש, תקרה לפחות ${nis(r.earnings.ceilingAtLeast)} (${ca.earnings.section})${r.earnings.months ? `; ${r.earnings.months} חודשים: ${nis(r.earnings.low)} עד ${nis(r.earnings.high)}` : ''}`); }
	const f = r.tn && r.tn.future;
	if (f) { out.push(`הפסד כושר השתכרות: ${nis(f.counted)} × ${f.f}% = ${nis(f.gross)} לחודש לפני מס${f.months !== null ? `; ${f.months} חודשים עד גיל ${f.retire}: ${nis(f.totalLow)} עד ${nis(f.totalHigh)}, בלי היוון` : ''}`); }
	const fee = r.fees[r.stage];
	if (fee) { out.push(`שכר טרחה: ${pctTxt(fee.pct)} מ-${nis(r.amount)} ועוד מע"מ ${r.vat}% = ${nis(fee.withVat)}; נשארים ${nis(fee.net)} (${fee.section})`); }
	if (r.lim) { out.push(`התיישנות: ${isoToHe(r.lim.deadline)} (${ca.limitation.section}${r.lim.minor ? `, ${ca.limitation.minor_section}` : ''}${r.lim.added ? `, ${ca.limitation.war.section}` : ''})`); }
	return out;
}

/** Two more steps of the page's method list (snapshot().method), from the registry. */
function tnMethodTail(reg, r) {
	const ca = reg.car_accident;
	const ti = reg.injury_teuna;
	const nii = ca.earnings.nii[ca.earnings.nii.length - 1];
	return `<li>הפסד השתכרות: הכנסה מעל פי ${ca.earnings.ceiling_multiple} מהשכר הממוצע לא נספרת, ולפי הביטוח הלאומי התקרה היא לפחות ${money(ca.earnings.ceiling_multiple * Math.min(nii.s1, nii.s2), 0)} ₪ לחודש; בנכות תפקודית חלקית גם התקרה מופחתת באותו שיעור.${cite(ti.earnings.partial_section, ca.law_url)}</li>`
		+ `<li>תשלום תכוף: ${ca.interim_days} ימים מקבלת דרישה בכתב, ואחר כך בקשה לבית משפט השלום.${cite(`${ca.sections.interim}; ${ti.interim.court_section}`, ca.law_url)}</li>`;
}

/** The one-page print: the inputs, the result, the ledger, the computation path, the dates, the sources with dates. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const ca = reg.car_accident;
	const ti = reg.injury_teuna;
	const tn = r.tn || {};
	const inputs = [];
	if (!r.death) { inputs.push(`גיל ביום התאונה ${tn.age}`); inputs.push(`יום התאונה ${isoToHe(r.accident)}`); }
	if (r.earnings) { inputs.push(`הכנסה ${nis(r.earnings.income)} לחודש`); }
	if (tn.future) { inputs.push(`נכות תפקודית ${tn.future.f}%`); }
	if (r.amount) { inputs.push(`הצעה ${nis(r.amount)} (${STAGE_LABEL[r.stage]})`); }
	const ledger = tn.ledger ? tn.ledger.rows.filter((x) => x.kind !== 'empty').map((x) => `${x.he}: ${x.code === 'nonpec' ? `${pctTxt(x.kind === 'upto' ? x.upTo : x.pct)} מהסכום המקסימלי` : x.low !== null ? (x.low === x.high ? nis(x.low) : `${nis(x.low)} עד ${nis(x.high)}`) : `${nis(x.perMonth)} לחודש`}`).join('; ') : '';
	const dates = deadlines(reg, r).filter((d) => d.date);
	return `<h3>פיצויים בתאונת דרכים: סיכום</h3>`
		+ `<p><strong>הנתונים:</strong> ${esc(inputs.join('; '))}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ (ledger ? `<p><strong>פנקס התביעה:</strong> ${esc(ledger)}.</p>` : '')
		+ `<p><strong>דרך החישוב:</strong></p><ol>${tnMethod(reg, r).map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`
		+ (dates.length ? `<p><strong>מועדים:</strong> ${dates.map((d) => `${isoToHe(d.date)} ${esc(d.what)}`).join('; ')}.</p>` : '')
		+ `<p><strong>מקורות:</strong> ${esc(ca.law_he)}, נוסח ל-${isoToHe(ca.law_current_to)}; ${esc(ca.regs_he)}, נוסח ל-${isoToHe(ca.regs_current_to)}; ${esc(ca.fees.rules_he)}; ${esc(ca.limitation.he)}; ${esc(ti.expert.regs_he)}; ${esc(ti.future.periodic_he)}; ${esc(ti.ordinance.he)}; חוק הביטוח הלאומי, ${esc(ti.nii.section)}; השכר הממוצע של הביטוח הלאומי מ-${isoToHe(ca.earnings.nii[ca.earnings.nii.length - 1].from)}. נבדק ${isoToHe(ti.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

/** The result column: the wave-4 verdict and formula bar, then who pays, the new flags, the scenario and the next steps. */
export function tnResult(reg, r, opts = {}) {
	const base = renderResult(reg, r, opts);
	if (!r.ok || !r.tn || !reg.injury_teuna) { return base; }
	const filled = opts.filled && opts.filled.length ? `<p class="jtool-scope ${Q}-filled">הקישור הביא רק חלק מהנתונים. ${esc(opts.filled.map((f) => TN_FILLED_HE[f]).join(', '))} מולאו מהדוגמה: כדאי לעדכן אותם.</p>` : '';
	const flags = r.tn.flags.length ? `<ul class="jtool-flags ${Q}-flags">${r.tn.flags.map((f) => `<li>${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul>` : '';
	const na = nextActions(reg, r);
	return filled + base + tnWhoBox(reg, r) + flags
		+ `<div class="${Q}-brief"><h4>התרחיש לסימולציה</h4><p data-${Q}-brief>${esc(aiBrief(reg, r))}</p><a class="jtool-btn" href="${TN_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את הבדיקה אצל המומחה ואת העדות</a></div>`
		+ `<div class="${Q}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** The details: the ledger first, the wave-4 tables (formula, fees, ceiling, dates), then the new panels and the print. */
export function tnDetails(reg, r, opts = {}) {
	if (!r.ok || !r.tn || !reg.injury_teuna) { return renderDetails(reg, r, opts); }
	return `<div class="${Q}-screen">${tnLedgerFig(reg, r)}${renderDetails(reg, r, opts)}${tnFuturePanel(reg, r)}${tnMaxPanel(reg, r)}`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${Q}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>${tnRules(reg, r)}</div>`
		+ `<div class="${Q}-print">${printSummary(reg, r, opts.printedOn || opts.today || reg.injury_teuna.checked_on)}</div>`;
}

/* ---------------- Browser ---------------- */

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const ca = reg.car_accident;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	const calc = (input) => (reg.injury_teuna ? tnCompute(reg, Object.assign({ today }, input)) : compute(reg, Object.assign({ today }, input)));
	let own = false;
	let started = false;
	let timer = null;
	let shownDeath = Boolean(root.querySelector(`input[name="${P}-dth"]:checked`));
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(ca.checked_on, ca.refresh_every_days) || (ca.next_update && today >= ca.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהשכר הממוצע התעדכן'); }
	}
	const ids = { disability: `${P}-dis`, days: `${P}-days`, age: `${P}-age`, birth: `${P}-birth`, amount: `${P}-amt`, income: `${P}-inc`, months: `${P}-mon`, max: `${P}-max`, functional: `${Q}-fn`, retire: `${Q}-ret`, medical: `${Q}-med`, help: `${Q}-help`, travel: `${Q}-trv`, demand: `${Q}-dem`, expertNotice: `${Q}-exn`, opinion: `${Q}-opn` };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok || r.outOfScope) { return; }
		const death = Boolean(root.querySelector(`input[name="${P}-dth"]:checked`));
		for (const e of r.errors) {
			const id = e.field === 'accident' ? `${P}-${death ? 'acc2' : 'acc'}` : ids[e.field];
			const box = id && root.querySelector(`#${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const press = (key) => form.querySelectorAll(`.${Q}-profile`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-profile') === key ? 'true' : 'false'));
	const sync = () => {
		const death = Boolean(root.querySelector(`input[name="${P}-dth"]:checked`));
		form.querySelectorAll('[data-if-alive]').forEach((el) => { el.hidden = death; });
		form.querySelectorAll('[data-if-dead]').forEach((el) => { el.hidden = !death; });
		const a = (root.querySelector(`#${P}-age`) || {}).value;
		form.querySelectorAll('[data-if-minor]').forEach((el) => { el.hidden = a === '' || a === undefined || !(Number(a) < ca.limitation.adult_age); });
		// One accident day: when the death box changes, the field that was on screen hands its value to the one that now
		// is, always, so the date read is the date seen (review, PR 126).
		if (death !== shownDeath) {
			const src = root.querySelector(shownDeath ? `#${P}-acc2` : `#${P}-acc`);
			const dst = root.querySelector(death ? `#${P}-acc2` : `#${P}-acc`);
			if (src && dst) { dst.value = src.value; }
			shownDeath = death;
		}
	};
	const run = (input, opts = {}) => {
		const r = calc(input);
		showErrors(r);
		result.innerHTML = tnResult(reg, r, { filled: opts.filled });
		details.innerHTML = tnDetails(reg, r, { today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? (r.figureKind === 'nis' ? ils(r.npAmount) : r.figureKind === 'pct' ? `<bdi>${pctTxt(r.np.pct)}</bdi>` : '—') : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.np.kind }); }
		if (!r.ok && r.outOfScope && !opts.silent) { track('tool_out_of_scope', { tool_id: TOOL_ID }); }
		return r;
	};
	const schedule = (ev) => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		if (ev && ev.type === 'input') { press(''); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	// A share link is "#s=..." and may name its tool (/@teunat-drachim); on a page with several tools only this tool reads
	// it, and a plain page anchor is never read as answers.
	const hash = window.location.hash || '';
	const shareOwner = (/\/@([a-z-]+)$/.exec(hash) || [])[1];
	const fromHash = /^#s=/.test(hash) && (!shareOwner || shareOwner === TOOL_ID) ? inputOf(decodeState(hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		shownDeath = Boolean(fromHash.death);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(fromHash, { silent: true, filled: fromHash.filled });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector(`.${Q}-profile, input:not([type="radio"]):not([type="checkbox"])`);
			if (first) { setTimeout(() => first.focus({ preventScroll: true }), 350); }
			track('tool_lead_click', { tool_id: TOOL_ID });
		});
	}
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'tn-profile') {
			const key = b.getAttribute('data-profile');
			const input = tnProfile(key, today, readForm(root));
			if (!input) { return; }
			own = true;
			form.innerHTML = renderForm(reg, input);
			shownDeath = false;
			sync();
			press(key);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: key });
			return;
		}
		if (act === 'tn-max') {
			const field = root.querySelector(`#${P}-max`);
			if (field) { const d = field.closest('details'); if (d) { d.open = true; } field.focus(); }
			return;
		}
		const input = readForm(root);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics' && r.ok) {
			download('teunat-drachim.ics', 'text/calendar;charset=utf-8', ics(deadlines(reg, r).filter((d) => d.date).map((d) => ({ date: d.date, summary: `תאונת דרכים: ${d.what}`, description: `${d.rule}. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי תקנות הפיצויים לנפגעי תאונות דרכים ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(ca.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.np.kind : 'error' });
			const brief = r.ok && r.tn ? aiBrief(reg, r) : '';
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
			if (s) { own = true; form.innerHTML = renderForm(reg, s); shownDeath = Boolean(s.death); sync(); run(s); }
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
