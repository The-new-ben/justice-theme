/**
 * Wave 4 UI: road-accident compensation under the 1975 law and its regulations (HAD-502).
 * Board: Claude Design canvas "Tools wave 4" (co.il teunat-drachim at 1280 and 360, states).
 * The formula bar shows how the share of the statutory maximum is built (hospital days, disability, the age cut);
 * the fee panel shows what is left of an offer after the lawyer's maximum fee at each stage.
 */
import { compute, STAGES, EXCLUSIONS } from './teuna-engine.js';
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
	return `<div data-if-alive${input.death ? ' hidden' : ''}><div class="jtool-row">${field('dis', 'אחוזי נכות רפואית לצמיתות', input.disability ?? '', { suffix: '%', ph: 'לדוגמה: 20', hint: 'כפי שקבע המומחה מטעם בית המשפט או הוסכם' })}${field('days', 'ימי אשפוז בגלל התאונה', input.days ?? '', { mode: 'numeric', ph: '0 אם לא אושפזתם' })}</div>`
		+ `<div class="jtool-row" style="margin-top:12px">${field('age', 'הגיל ביום התאונה', input.age ?? '', { mode: 'numeric', ph: 'בשנים שלמות' })}${field('acc', 'יום התאונה', isoToHe(input.accident || ''), { mode: 'numeric', ph: 'לדוגמה: 10.3.2025' })}</div>`
		+ `<div data-if-minor${minor ? '' : ' hidden'} style="margin-top:12px">${field('birth', 'תאריך הלידה (לקטין: ההתיישנות מתחילה בגיל 18)', isoToHe(input.birth || ''), { mode: 'numeric', ph: 'לדוגמה: 4.6.2012' })}</div></div>`
		+ `<div data-if-dead${input.death ? '' : ' hidden'}>${field('acc2', 'יום התאונה', isoToHe(input.accident || ''), { mode: 'numeric', ph: 'לדוגמה: 10.3.2025' })}</div>`
		+ `<div class="jtool-chips">${chip('dth', '1', 'הנפגע נפטר בתאונה', input.death, 'checkbox')}${chip('wrk', '1', 'בדרך לעבודה או בעבודה', input.work, 'checkbox')}</div>`
		+ `<details class="jtool-more"${input.amount ? ' open' : ''}><summary>הצעה של חברת הביטוח, ושכר טרחה מקסימלי</summary>`
		+ `<div style="margin-top:8px">${field('amt', 'סכום הפיצוי שהוצע או נפסק', input.amount ? money(input.amount, 0) : '', { money: true, suffix: '₪', ph: 'לדוגמה: 150,000' })}</div>`
		+ `<fieldset class="jtool-field" style="margin-top:8px"><legend>באיזה שלב</legend><div class="jtool-chips">${STAGES.map((s) => chip('stg', s, STAGE_LABEL[s], (input.stage || 'none') === s)).join('')}</div></fieldset>`
		+ `<p class="jtool-hint">${esc(ca.fees.refund_he)}. מע"מ ${ca.fees.vat_pct}% נוסף על האחוז (${esc(ca.fees.vat_section)}).</p></details>`
		+ `<details class="jtool-more" data-if-alive${input.death ? ' hidden' : ''}${input.income ? ' open' : ''}><summary>הפסד השתכרות: התקרה והבסיס</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${field('inc', 'הכנסה חודשית לפני התאונה, ברוטו', input.income ? money(input.income, 0) : '', { money: true, suffix: '₪', ph: 'לדוגמה: 12,000' })}${field('mon', 'חודשים שלא עבדתם בכלל', input.months ?? '', { ph: 'לדוגמה: 4' })}</div></details>`
		+ `<details class="jtool-more" data-if-alive${input.death ? ' hidden' : ''}${input.max ? ' open' : ''}><summary>קיבלתם את הסכום המקסימלי בשקלים?</summary>`
		+ `<div style="margin-top:8px">${field('max', 'הסכום המקסימלי לכאב וסבל, כפי שנמסר לכם', input.max ? money(input.max, 0) : '', { money: true, suffix: '₪', ph: 'מפסק דין או ממכתב המבטח' })}</div>`
		+ `<p class="jtool-hint">${esc(ca.nonpecuniary.max_he)}.</p></details>`
		+ `<details class="jtool-more"${excluded.length ? ' open' : ''}><summary>בדיקת זכאות: מי לא מקבל פיצוי (סעיף 7)</summary><div class="jtool-chips" style="margin-top:8px">${EXCLUSIONS.map((x) => chip('ex', x, EXCL_LABEL[x], excluded.includes(x), 'checkbox')).join('')}</div>`
		+ `<p class="jtool-hint">האחריות מוחלטת: לא משנה מי אשם בתאונה (סעיף 2(ג)). אלה המקרים היחידים שבהם אין זכאות, עם חריגים בסעיפים 7א ו-7ב.</p></details>`;
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
		: [{ date: '', what: `תביעת העיזבון או התלויים: ${lim.years} שנים מהיום שבו נולדה העילה`, rule: `${lim.section}; סעיף 6`, href: lim.url }];
	out.push({ date: '', what: `תשלומים תכופים (הוצאות ריפוי ומחיה): ${ca.interim_days} ימים מקבלת דרישה בכתב אצל המבטח`, rule: ca.sections.interim, href: ca.law_url });
	return out;
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
	const r = compute(reg, Object.assign({ today: reg.car_accident.checked_on }, EXAMPLE));
	const np = reg.car_accident.nonpecuniary;
	const dis = r.np.parts.find((p) => p.key === 'disability');
	const hos = r.np.parts.find((p) => p.key === 'hospital');
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.np.pct,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { today: reg.car_accident.checked_on }),
		method: `<ol><li>נכות לצמיתות: ${pctTxt(dis.raw)} × ${pctTxt(np.disability_pct_per_pct)} מהסכום המקסימלי לכל אחוז = ${pctTxt(dis.raw)}${cite(np.sections.disability, reg.car_accident.regs_url)}</li>`
			+ `<li>הפחתת גיל: בגיל ${EXAMPLE.age} ביום התאונה, ${pctTxt(dis.ageCut)} פחות: ${pctTxt(dis.raw)} × ${pctTxt(100 - dis.ageCut)} = ${pctTxt(dis.pct)}${cite(np.sections.age, reg.car_accident.regs_url)}</li>`
			+ `<li>אשפוז: ${hos.days} ימים × ${pctTxt(np.hospital_permille / 10)} = ${pctTxt(hos.pct)}${cite(np.sections.hospital, reg.car_accident.regs_url)}</li>`
			+ `<li>סך הכול: ${pctTxt(r.np.pct)} מהסכום המקסימלי.${cite(np.max_section, reg.car_accident.law_url)}</li>`
			+ `<li>על הצעה של ${money(EXAMPLE.amount, 0)} ₪ בלי תביעה: שכר טרחה עד ${pctTxt(r.fees.none.pct)} ועוד מע"מ ${r.vat}% = ${money(r.fees.none.withVat)} ₪, ונשארים ${money(r.fees.none.net)} ₪.${cite('סעיף 16(א); כלל 4', reg.car_accident.law_url)}</li></ol>`,
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
	return {
		disability: num('dis'), days: num('days'), age: num('age'),
		accident: toIso(val(death ? `#${P}-acc2` : `#${P}-acc`)), birth: toIso(val(`#${P}-birth`)), death,
		work: Boolean(root.querySelector(`input[name="${P}-wrk"]:checked`)),
		amount: moneyOf('amt'), stage: (root.querySelector(`input[name="${P}-stg"]:checked`) || {}).value || 'none',
		income: moneyOf('inc'), months: num('mon'), max: moneyOf('max'),
		excluded: [...root.querySelectorAll(`input[name="${P}-ex"]:checked`)].map((x) => x.value),
	};
}

const ST = { none: 'n', settle: 's', judgment: 'j' };
const EX = { intent: 'i', unauthorised: 'u', licence: 'l', felony: 'f', uninsured: 'n', owner: 'o' };
const stateOf = (i) => encodeState({ d: i.disability, h: i.days, a: i.age, t: i.accident, b: i.birth, x: i.death ? 1 : '', w: i.work ? 1 : '', m: i.amount, s: ST[i.stage] || 'n', c: i.income, o: i.months, k: i.max, e: (i.excluded || []).map((x) => EX[x]).join('') });
const KEYS = ['d', 'h', 'a', 't', 'b', 'x', 'w', 'm', 's', 'c', 'o', 'k', 'e'];
function inputOf(s) {
	if (!s.t) { return null; }
	const n = (v) => (v === undefined ? '' : Number(v));
	return {
		disability: n(s.d), days: n(s.h), age: n(s.a), accident: s.t, birth: s.b || '', death: s.x === '1', work: s.w === '1',
		amount: n(s.m), stage: Object.keys(ST).find((k) => ST[k] === s.s) || 'none', income: n(s.c), months: n(s.o), max: n(s.k),
		excluded: (s.e || '').split('').map((c) => Object.keys(EX).find((k) => EX[k] === c)).filter(Boolean),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const ca = reg.car_accident;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(ca.checked_on, ca.refresh_every_days) || (ca.next_update && today >= ca.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהשכר הממוצע התעדכן'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok || r.outOfScope) { return; }
		const death = Boolean(root.querySelector(`input[name="${P}-dth"]:checked`));
		const ids = { disability: 'dis', days: 'days', age: 'age', accident: death ? 'acc2' : 'acc', birth: 'birth', amount: 'amt', income: 'inc', months: 'mon', max: 'max' };
		for (const e of r.errors) {
			const id = ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const death = Boolean(root.querySelector(`input[name="${P}-dth"]:checked`));
		form.querySelectorAll('[data-if-alive]').forEach((el) => { el.hidden = death; });
		form.querySelectorAll('[data-if-dead]').forEach((el) => { el.hidden = !death; });
		const a = (root.querySelector(`#${P}-age`) || {}).value;
		form.querySelectorAll('[data-if-minor]').forEach((el) => { el.hidden = a === '' || a === undefined || !(Number(a) < ca.limitation.adult_age); });
		// One accident day, whichever field is on screen.
		const src = root.querySelector(death ? `#${P}-acc` : `#${P}-acc2`);
		const dst = root.querySelector(death ? `#${P}-acc2` : `#${P}-acc`);
		if (src && dst && src.value && !dst.value) { dst.value = src.value; }
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, Object.assign({ today }, input));
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today });
		if (sticky) { sticky.innerHTML = r.ok ? (r.figureKind === 'nis' ? ils(r.npAmount) : r.figureKind === 'pct' ? `<bdi>${pctTxt(r.np.pct)}</bdi>` : '—') : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.np.kind }); }
		if (!r.ok && r.outOfScope) { track('tool_out_of_scope', { tool_id: TOOL_ID }); }
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
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, Object.assign({ today }, input));
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok) {
			download('teunat-drachim.ics', 'text/calendar;charset=utf-8', ics(deadlines(reg, r).filter((d) => d.date).map((d) => ({ date: d.date, summary: `תאונת דרכים: ${d.what}` })), new Date().toISOString()));
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
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.np.kind : 'error' });
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
