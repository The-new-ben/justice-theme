/**
 * T02 UI: minimum-wage checker and back-pay (HAD-485).
 * Board: https://claude.ai/artifact/JHKhphmy9L1QbYYUk2KX4e (T02-desktop, T02-360).
 * Pure renderers write the server snapshot and the live page from the same code.
 */
import { compute } from './minwage-engine.js';
import {
	esc, ils, num, money, amount, parseMoney, isoToHe, encodeState, decodeState, csv,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale,
} from './instrument.js';

export const TOOL_ID = 'sachar-minimum';
const P = 'jt2';

export const EXAMPLE = { age: 'adult', payType: 'hourly', from: '2025-01', to: '2026-09', pay: 33, hours: 182, jobPct: 100, divisor: 182 };

const AGES = { adult: '18 ומעלה', age17: '17', age16: '16', under16: 'מתחת ל-16', apprentice: 'חניך' };
const HE_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const heMonth = (key) => { const [y, m] = key.split('-').map(Number); return `${HE_MONTHS[m - 1]} ${y}`; };
const monthHe = (key) => { const [y, m] = key.split('-').map(Number); return `${m}.${y}`; };

function lawCite(reg, text, href) {
	return ` <a class="jtool-cite" href="${esc(href || reg.min_wage.law_url)}" target="_blank" rel="noopener">${esc(text)}</a>`;
}

function toMonth(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{4})$/);
	if (m) { return `${m[2]}-${m[1].padStart(2, '0')}`; }
	return raw;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(input) {
	const chip = (name, value, label, checked) => `<label class="jtool-chip"><input type="radio" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const hourly = input.payType === 'hourly';
	return `<fieldset class="jtool-field"><legend>גיל העובד</legend><div class="jtool-chips">${Object.entries(AGES).map(([k, v]) => chip('age', k, v, input.age === k)).join('')}</div>`
		+ `<p class="jtool-hint">חניך: לפי חוק החניכות, לומד לפחות יומיים בשבוע.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>איך משלמים לכם</legend><div class="jtool-chips">${chip('pt', 'hourly', 'לפי שעה', hourly)}${chip('pt', 'monthly', 'משכורת חודשית', !hourly)}</div></fieldset>`
		+ `<div class="jtool-row" data-hourly${hourly ? '' : ' hidden'}>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-rate">שכר לשעה בתלוש</label><div class="jtool-input jtool-input--money"><input id="${P}-rate" type="text" inputmode="decimal" autocomplete="off" value="${esc(hourly ? input.pay : '')}" placeholder="לדוגמה: 33" aria-describedby="${P}-rate-h ${P}-rate-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-hint" id="${P}-rate-h">שכר יסוד ותוספות קבועות בלבד (סעיף 3)</p><p class="jtool-error" id="${P}-rate-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-hours">שעות בחודש</label><input id="${P}-hours" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.hours || 182)}" aria-describedby="${P}-hours-h ${P}-hours-e"><p class="jtool-hint" id="${P}-hours-h">לפי התלוש. משרה מלאה: 182 שעות</p><p class="jtool-error" id="${P}-hours-e" role="alert"></p></div>`
		+ `</div>`
		+ `<div class="jtool-row" data-monthly${hourly ? ' hidden' : ''}>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-salary">שכר חודשי ברוטו שנספר</label><div class="jtool-input jtool-input--money"><input id="${P}-salary" type="text" inputmode="decimal" autocomplete="off" value="${esc(hourly ? '' : money(input.pay, 0))}" placeholder="לדוגמה: 6,000" aria-describedby="${P}-salary-h ${P}-salary-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-hint" id="${P}-salary-h">בלי ותק, משמרות, פרמיות, משכורת 13 והחזר הוצאות (סעיף 3)</p><p class="jtool-error" id="${P}-salary-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-pct">אחוז משרה</label><input id="${P}-pct" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.jobPct ?? 100)}" aria-describedby="${P}-pct-h ${P}-pct-e"><p class="jtool-hint" id="${P}-pct-h">משרה חלקית: מינימום יחסי (סעיף 2(ב))</p><p class="jtool-error" id="${P}-pct-e" role="alert"></p></div>`
		+ `</div>`
		+ `<div class="jtool-row">`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-from">מחודש</label><input id="${P}-from" type="text" inputmode="numeric" autocomplete="off" value="${esc(monthHe(input.from))}" placeholder="לדוגמה: 1.2025" aria-describedby="${P}-from-e"><p class="jtool-error" id="${P}-from-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-to">עד חודש</label><input id="${P}-to" type="text" inputmode="numeric" autocomplete="off" value="${esc(monthHe(input.to))}" placeholder="לדוגמה: 9.2026" aria-describedby="${P}-to-e"><p class="jtool-error" id="${P}-to-e" role="alert"></p></div>`
		+ `</div>`
		+ `<details class="jtool-more"${input.divisor === 186 ? ' open' : ''}><summary>אפשרויות מתקדמות</summary>`
		+ `<fieldset class="jtool-field" style="margin-top:8px"><legend>שכר מינימום לשעה לפי</legend><div class="jtool-chips">${chip('div', '182', '182 שעות בחודש', input.divisor !== 186)}${chip('div', '186', '186 שעות (סעיף 1)', input.divisor === 186)}</div>`
		+ `<p class="jtool-hint">המוסד לביטוח לאומי מפרסם את שני השיעורים. לנוער ולחניכים: חלקי 173 שעות (תקנה 5א).</p></fieldset></details>`;
}

export function groups(r) {
	const out = [];
	for (const row of r.rows) {
		const g = out[out.length - 1];
		if (g && g.rateFrom === row.rateFrom && g.due === row.due && g.paid === row.paid) {
			g.to = row.month; g.months += 1; g.gapSum = Math.round((g.gapSum + row.gap) * 100) / 100;
		} else {
			out.push({ from: row.month, to: row.month, rateFrom: row.rateFrom, hourlyMin: row.hourlyMin, monthlyMin: row.monthlyMin, due: row.due, paid: row.paid, gap: row.gap, months: 1, gapSum: row.gap });
		}
	}
	return out;
}

export function verdictSentence(r, input) {
	const span = `${heMonth(r.from)} עד ${heMonth(r.to)}`;
	if (r.state === 'ok') {
		return `השכר שהזנתם לא נמוך משכר המינימום באף אחד מ-${r.months} החודשים (${span}).`;
	}
	const how = r.payType === 'hourly' ? `ב-${amount(input.pay)} ₪ לשעה ו-${amount(input.hours, 0)} שעות בחודש` : `בשכר חודשי של ${amount(input.pay)} ₪`;
	const gs = groups(r).filter((g) => g.gap > 0).map((g) => `מ${heMonth(g.from)} חסרים ${amount(g.gap)} ₪ בחודש`);
	return `${how}, השכר נמוך משכר המינימום ב-${r.monthsShort} מתוך ${r.months} חודשים. ${gs.join(', ')}. סך הכול ${amount(r.gapTotal)} ₪.`;
}

export function pathLines(reg, r, input) {
	const mw = reg.min_wage;
	const lines = [];
	const youth = r.age !== 'adult';
	lines.push(`לכל חודש לקחנו את שכר המינימום שבתוקף באותו חודש, מהטבלה של ${esc(mw.publisher_he)}${lawCite(reg, 'סעיף 1')}`);
	if (youth) {
		const pctV = mw.youth_pct[r.age];
		lines.push(`${esc(AGES[r.age] === 'חניך' ? 'חניך' : `עובד בגיל ${AGES[r.age]}`)}: ${pctV}% משכר המינימום, ולשעה: השכר החודשי חלקי ${mw.youth_hours_divisor}. משרה מלאה: ${mw.youth_full_time_weekly_hours} שעות בשבוע${lawCite(reg, 'תקנות 4 עד 6', mw.youth_regulations_url)}`);
	}
	const gs = groups(r);
	if (r.payType === 'hourly') {
		lines.push(`שכר מינימום לשעה${youth ? '' : ` בהיקף ${r.rows[0].divisor} שעות`}: ${[...new Map(gs.map((g) => [g.rateFrom, g])).values()].map((g) => `<bdi>${money(g.hourlyMin)}</bdi> ₪ (מ-${isoToHe(g.rateFrom)})`).join(', ')}`);
		lines.push(`מגיע בחודש: שכר המינימום לשעה כפול ${money(input.hours, 0)} שעות. שולם: <bdi>${money(input.pay)} × ${money(input.hours, 0)} = ${money(input.pay * input.hours)}</bdi> ₪${lawCite(reg, 'סעיף 2(א)')}`);
	} else {
		lines.push(`שכר מינימום לחודש: ${[...new Map(gs.map((g) => [g.rateFrom, g])).values()].map((g) => `<bdi>${money(g.monthlyMin)}</bdi> ₪ (מ-${isoToHe(g.rateFrom)})`).join(', ')}`);
		lines.push(`מגיע בחודש: שכר המינימום${Number(input.jobPct) !== 100 ? ` כפול ${money(input.jobPct, 0)}% משרה` : ''}. שולם: <bdi>${money(input.pay)}</bdi> ₪${lawCite(reg, Number(input.jobPct) !== 100 ? 'סעיף 2(ב)' : 'סעיף 2(א)')}`);
	}
	lines.push(`השכר שנספר: שכר יסוד ותוספות קבועות. תוספות ותק, משמרות, פרמיות, משכורת 13 והחזר הוצאות לא נספרים${lawCite(reg, 'סעיף 3')}`);
	const parts = gs.filter((g) => g.gap > 0).map((g) => `${g.months} × ${money(g.gap)}`);
	lines.push(parts.length ? `פער: מגיע פחות שולם, רק כשהוא חיובי. <bdi>${parts.join(' + ')} = ${money(r.gapTotal)}</bdi> ₪` : 'פער: אין חודש שבו שולם פחות מהמינימום.');
	return lines;
}

export function renderResult(reg, r, input, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state ${r.outOfScope ? 'jtool-state--info' : 'jtool-state--danger'}">${r.outOfScope ? 'מחוץ לתחום של הכלי' : '✕ צריך לתקן את הקלט'}</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p>`
			+ (r.outOfScope ? `<p class="jtool-scope"><a href="${esc(reg.min_wage.source_url)}" target="_blank" rel="noopener">הטבלה המלאה של המוסד לביטוח לאומי</a></p>` : '') + '</div>';
	}
	const ok = r.state === 'ok';
	const state = ok ? `<p class="jtool-state jtool-state--ok">✓ לא נמוך מהמינימום</p>` : `<p class="jtool-state jtool-state--danger">✕ שולם פחות מהמינימום ב-${r.monthsShort} מתוך ${r.months} חודשים</p>`;
	const label = `${opts.example ? 'דוגמה מחושבת: ' : ''}${ok ? 'הפער' : 'הפער המצטבר'}, ${heMonth(r.from)} עד ${heMonth(r.to)}`;
	const cur = r.current;
	const tiles = [`<div><dt>מגיע</dt><dd>${ils(r.dueTotal)}</dd></div>`, `<div><dt>שולם</dt><dd>${ils(r.paidTotal)}</dd></div>`,
		`<div><dt>המינימום מ-${isoToHe(cur.from)}</dt><dd>${r.payType === 'hourly' ? `${ils(cur.hourly)} לשעה` : ils(cur.monthly)}</dd></div>`];
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}<p class="jtool-verdict__label">${esc(label)}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.gapTotal)}</strong><p class="jtool-verdict__sentence">${esc(verdictSentence(r, input))}</p>`
		+ `<p class="jtool-scope">הנחנו שהסכום שהזנתם כולל רק רכיבים שנספרים לשכר מינימום (סעיף 3). שעות נוספות, ימי חג וחופשה לא נבדקים כאן.</p><dl class="jtool-breakdown">${tiles.join('')}</dl></div>`
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ `<details class="jtool-path" open><summary>איך חישבנו</summary><ol>${pathLines(reg, r, input).map((l) => `<li>${l}</li>`).join('')}</ol></details>`;
}

export function letterText(reg, r, input) {
	const short = groups(r).filter((g) => g.gap > 0);
	const lines = [
		'לכבוד',
		'[שם המעסיק]',
		'',
		`הנדון: הפרשי שכר מינימום לתקופה ${monthHe(short[0].from)} עד ${monthHe(short[short.length - 1].to)}`,
		'',
		`לפי חוק שכר מינימום, התשמ"ז-1987, סעיף 2, ${r.age === 'adult' ? 'עובד שמלאו לו 18 שנים' : 'עובד'} זכאי לשכר עבודה שלא יפחת משכר המינימום${r.age === 'adult' ? '' : ' החל עליו לפי תקנות שכר מינימום (נוער עובד וחניכים), התשמ"ח-1987'}.`,
		`בתקופה האמורה שולם לי ${r.payType === 'hourly' ? `${amount(input.pay)} ₪ לשעה` : `${amount(input.pay)} ₪ לחודש`}, פחות משכר המינימום שפרסם המוסד לביטוח לאומי.`,
		'',
		'הפירוט:',
		...short.map((g) => `${monthHe(g.from)} עד ${monthHe(g.to)}: ${g.months} חודשים × ${money(g.gap)} ₪ = ${money(g.gapSum)} ₪`),
		`סך הכול: ${money(r.gapTotal)} ₪`,
		'',
		'אבקש להעביר את הפרשי השכר תוך [מספר] ימים, ולעדכן את שכרי מעתה.',
		'',
		'בכבוד רב,',
		'[שם העובד]',
		'',
		`(החישוב נעשה ב-jus-tice.co.il לפי טבלת שכר המינימום של המוסד לביטוח לאומי, שנבדקה ב-${isoToHe(reg.min_wage.checked_on)}. מידע כללי, לא ייעוץ משפטי.)`,
	];
	return lines.join('\n');
}

export function renderDetails(reg, r, input, compareR, compareLabel) {
	if (!r.ok) { return ''; }
	const rows = groups(r).map((g) => `<tr><td data-th="חודשים">${monthHe(g.from)}${g.to !== g.from ? ` עד ${monthHe(g.to)}` : ''}</td>`
		+ `<td data-th="${r.payType === 'hourly' ? 'מינימום לשעה' : 'מינימום לחודש'}">${num(r.payType === 'hourly' ? g.hourlyMin : g.monthlyMin)}</td><td data-th="בתוקף מ">${isoToHe(g.rateFrom)}</td>`
		+ `<td data-th="מגיע בחודש">${num(g.due)}</td><td data-th="שולם בחודש">${num(g.paid)}</td>`
		+ `<td data-th="פער בחודש"${g.gap > 0 ? ' class="jtool-neg"' : ''}>${g.gap > 0 ? num(g.gap) : '0.00 ✓'}</td><td data-th="חודשים">${g.months}</td>`
		+ `<td data-th="פער לתקופה"${g.gapSum > 0 ? ' class="jtool-neg"' : ''}>${num(g.gapSum)}</td></tr>`).join('');
	const table = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-table-h">חודש אחרי חודש</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="csv">הורדת CSV (כל חודש בשורה)</button><button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-table-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">חודשים</th><th scope="col">${r.payType === 'hourly' ? 'מינימום לשעה' : 'מינימום לחודש'}</th><th scope="col">בתוקף מ</th><th scope="col">מגיע בחודש</th><th scope="col">שולם בחודש</th><th scope="col">פער בחודש</th><th scope="col">חודשים</th><th scope="col">פער לתקופה</th></tr></thead>`
		+ `<tbody>${rows}<tr class="jtool-table__total"><td data-th="סך הכול" colspan="6">סך הכול</td><td data-th="חודשים">${r.months}</td><td data-th="פער">${num(r.gapTotal)}</td></tr></tbody>`
		+ `<caption>שכר המינימום: ${esc(reg.min_wage.source_name)}. נבדק ${isoToHe(reg.min_wage.checked_on)}. חישוב כללי, לא ייעוץ משפטי.</caption></table></div></div>`;
	let compare = '';
	if (compareR && compareR.ok) {
		const delta = Math.round((r.gapTotal - compareR.gapTotal) * 100) / 100;
		compare = `<div class="jtool-compare" data-compare><h3>מה אם: ${esc(compareLabel.title)}</h3><div class="jtool-compare__grid">`
			+ `<div class="jtool-compare__col"><p>א. ${esc(compareLabel.a)}</p><strong>${ils(r.gapTotal)}</strong></div>`
			+ `<div class="jtool-compare__col jtool-compare__col--b"><p>ב. ${esc(compareLabel.b)}</p><strong>${ils(compareR.gapTotal)}</strong></div></div>`
			+ `<p class="jtool-delta">ההפרש: ${ils(Math.abs(delta))}. ${esc(compareLabel.note)}</p></div>`;
	}
	const letter = r.state === 'ok' ? '' : `<div class="jtool-tablewrap" data-letter><div class="jtool-tablewrap__head"><h3 id="${P}-letter-h">מכתב דרישה למעסיק (טיוטה)</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="letter-copy">העתקת המכתב</button></div></div>`
		+ `<pre class="jtool-letter" style="margin:0;padding:16px;white-space:pre-wrap;font:400 1rem/1.7 var(--jtool-font);direction:rtl;text-align:right">${esc(letterText(reg, r, input))}</pre></div>`;
	return table + compare + letter;
}

export function compareFor(input) {
	if (input.age === 'adult' && input.payType === 'hourly') {
		const b = input.divisor === 186 ? 182 : 186;
		return { input: Object.assign({}, input, { divisor: b }), label: { title: `לפי ${b} שעות בחודש`, a: `לפי ${input.divisor === 186 ? 186 : 182} שעות`, b: `לפי ${b} שעות`, note: 'המוסד לביטוח לאומי מפרסם את שני השיעורים. איזה חל תלוי בהיקף המשרה המלאה במקום העבודה.' } };
	}
	if (input.age !== 'adult') {
		return { input: Object.assign({}, input, { age: 'adult' }), label: { title: 'אילו העובד היה בן 18', a: `גיל ${AGES[input.age]}`, b: '18 ומעלה', note: 'שכר המינימום לנוער הוא אחוז משכר המינימום למבוגר.' } };
	}
	return null;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const cmp = compareFor(EXAMPLE);
	const c = cmp ? compute(reg, cmp.input) : null;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.gapTotal,
		form: renderForm(EXAMPLE),
		result: renderResult(reg, r, EXAMPLE, { example: true }),
		details: renderDetails(reg, r, EXAMPLE, c, cmp ? cmp.label : null),
		method: `<ol>${pathLines(reg, r, EXAMPLE).map((l) => `<li>${l}</li>`).join('')}</ol>`,
		sentence: verdictSentence(r, EXAMPLE),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	const payType = checked('pt') || 'hourly';
	return {
		age: checked('age') || 'adult', payType,
		pay: parseMoney(payType === 'hourly' ? val(`#${P}-rate`) : val(`#${P}-salary`)),
		hours: parseMoney(val(`#${P}-hours`)), jobPct: parseMoney(val(`#${P}-pct`)),
		from: toMonth(val(`#${P}-from`)), to: toMonth(val(`#${P}-to`)), divisor: Number(checked('div') || 182),
	};
}

const stateOf = (i) => encodeState({ g: i.age, y: i.payType, w: i.pay, h: i.payType === 'hourly' ? i.hours : '', j: i.payType === 'monthly' ? i.jobPct : '', f: i.from, t: i.to, v: i.divisor === 186 ? 186 : '' });
function inputOf(s) {
	if (!s.w) { return null; }
	return { age: AGES[s.g] ? s.g : 'adult', payType: s.y === 'monthly' ? 'monthly' : 'hourly', pay: Number(s.w), hours: Number(s.h) || 182, jobPct: Number(s.j) || 100, from: s.f || '', to: s.t || '', divisor: s.v === '186' ? 186 : 182 };
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(reg.min_wage.checked_on, reg.min_wage.refresh_every_days)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהנתונים התעדכנו'); }
	}
	const showErrors = (r, input) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const map = { from: 'from', to: 'to', pay: input.payType === 'hourly' ? 'rate' : 'salary', hours: 'hours', jobPct: 'pct' };
		for (const e of r.errors) {
			const key = map[e.field];
			const box = root.querySelector(`#${P}-${key}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${key}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		const cmp = r.ok ? compareFor(input) : null;
		const c = cmp ? compute(reg, cmp.input) : null;
		showErrors(r, input);
		result.innerHTML = renderResult(reg, r, input);
		details.innerHTML = renderDetails(reg, r, input, c, cmp ? cmp.label : null);
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.gapTotal) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.state === 'ok' ? 'at_or_above' : 'below_minimum' }); }
		if (!r.ok && r.outOfScope) { track('tool_out_of_scope', { tool_id: TOOL_ID }); }
	};
	const schedule = (ev) => {
		if (ev && ev.target && ev.target.name === `${P}-pt`) {
			const hourly = ev.target.value === 'hourly';
			form.querySelector('[data-hourly]').hidden = !hourly;
			form.querySelector('[data-monthly]').hidden = hourly;
		}
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => run(readForm(root)), 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, ['g', 'y', 'w', 'h', 'j', 'f', 't', 'v']));
	if (fromHash) {
		form.innerHTML = renderForm(fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	}
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		// Wave 4 (HAD-502): run a pending debounce now and act on a fresh compute, never the last debounced result.
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'csv' && r.ok) {
			const head = ['חודש', 'מינימום לחודש', 'מינימום לשעה', 'בתוקף מ', 'מגיע', 'שולם', 'פער'];
			const body = r.rows.map((x) => [monthHe(x.month), x.monthlyMin.toFixed(2), x.hourlyMin.toFixed(2), isoToHe(x.rateFrom), x.due.toFixed(2), x.paid.toFixed(2), x.gap.toFixed(2)]);
			body.push(['סך הכול', '', '', '', r.dueTotal.toFixed(2), r.paidTotal.toFixed(2), r.gapTotal.toFixed(2)]);
			body.push([`מקור: ${reg.min_wage.source_name}; נבדק ${isoToHe(reg.min_wage.checked_on)}. חישוב כללי, לא ייעוץ משפטי.`]);
			download('sachar-minimum.csv', 'text/csv;charset=utf-8', csv([head, ...body]));
			track('tool_download', { tool_id: TOOL_ID, type: 'csv' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שם, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			const text = `${verdictSentence(r, input)} · חושב ב-jus-tice.co.il לפי חוק שכר מינימום (נתונים מ-${isoToHe(r.current.from)}) ${link}`;
			window.open(whatsappUrl(text), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(r, input)} (חושב ב-jus-tice.co.il, ${isoToHe(reg.min_wage.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if ((act === 'letter' || act === 'letter-copy') && r.ok && r.state !== 'ok') {
			const box = root.querySelector('[data-letter]');
			if (box) { box.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
			if (act === 'letter-copy') {
				const ok = await copyText(letterText(reg, r, input));
				toast(root, ok ? 'המכתב הועתק. השלימו את השמות לפני השליחה.' : 'לא הצלחנו להעתיק.');
			}
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'save') {
			store.set('jtool-sachar-minimum', stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'clear') {
			store.clear('jtool-sachar-minimum');
			toast(root, 'נמחק מהמכשיר.');
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
