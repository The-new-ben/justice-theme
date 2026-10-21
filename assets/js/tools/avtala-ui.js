/**
 * The rights wave UI (21.10.2026): unemployment benefit (dmei-avtala). The picture is the benefit ledger the Institute
 * keeps for a claim: one row per month from the registration day, one cell per calendar day (Saturdays are never paid,
 * the five waiting days of every four months, the 90 days after a resignation, the paid days, the 126th day where the
 * ceiling steps down, the last day), with the daily amount drawn against the ceiling line above it. The tables, the
 * checklist and the .ics say the same in text.
 */
import { compute, byAge, baseMonths, monthHe, ENDINGS } from './avtala-engine.js';
import {
	esc, ils, money, num, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'dmei-avtala';
const P = 'jt31';

export const EXAMPLE = { age: 35, women: false, deps: 2, ending: 'fired', stop: '2026-10-15', reg: '2026-10-18', months: 18, wageMode: 'same', wage: 12000, wages: [], repeat: false };

const END_LABEL = {
	fired: 'פוטרתי', contract: 'החוזה הסתיים', resign_ok: 'התפטרתי מסיבה מוצדקת', resign: 'התפטרתי בלי סיבה מוכרת',
	leave: 'חל"ת ביוזמת המעסיק, 30 יום ומעלה', leave_short: 'חל"ת ביוזמת המעסיק, פחות מ-30 יום', leave_own: 'חל"ת ביוזמתי',
};
const MARK = { bad: '✕', warn: '!', info: 'i' };
const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ₪`;
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
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

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const av = reg.rights_avtala;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const field = (id, label, value, ph, mode = 'numeric', err = id) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="${mode}" autocomplete="off" value="${esc(value)}" placeholder="${esc(ph)}" aria-describedby="${P}-${err}-e"><p class="jtool-error" id="${P}-${err}-e" role="alert"></p></div>`;
	const moneyField = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(value === '' || value === undefined || value === null || Number.isNaN(value) ? '' : money(value, value % 1 ? 2 : 0))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const age = Number(input.age);
	const deps = Number(input.deps) || 0;
	const end = ENDINGS.includes(input.ending) ? input.ending : 'fired';
	const each = input.wageMode === 'each';
	const regIso = toIso(input.reg);
	const labels = /^\d{4}-\d{2}-\d{2}$/.test(regIso) ? baseMonths(regIso).map(monthHe) : ['החודש הראשון', 'השני', 'השלישי', 'הרביעי', 'החמישי', 'השישי (האחרון)'];
	const wages = Array.isArray(input.wages) ? input.wages : [];
	return `<div class="jtool-row">${field('age', 'גיל ביום הרישום', input.age === '' || input.age === undefined ? '' : String(input.age), 'לדוגמה: 35')}`
		+ `<fieldset class="jtool-field"><legend>כמה תלויים</legend><div class="jtool-chips">${[0, 1, 2, 3].map((n) => chip('dep', n, n === 3 ? '3 ומעלה' : String(n), Math.min(deps, 3) === n)).join('')}</div><p class="jtool-error" id="${P}-deps-e" role="alert"></p></fieldset></div>`
		+ `<p class="jtool-hint">תלויים: ${esc(av.days.dependents_he)}.</p>`
		+ `<div class="jtool-chips" data-if-57${age >= av.women.from_age ? '' : ' hidden'}>${chip('wom', '1', 'אישה שנולדה מ-1.1.1960 ואילך', input.women === true, 'checkbox')}</div>`
		+ `<fieldset class="jtool-field"><legend>איך הסתיימה העבודה</legend><div class="jtool-chips">${ENDINGS.map((k) => chip('end', k, END_LABEL[k], end === k)).join('')}</div><p class="jtool-error" id="${P}-ending-e" role="alert"></p>`
		+ `<div class="jtool-hint" data-if-end="resign_ok"${end === 'resign_ok' ? '' : ' hidden'}><p class="jtool-hint">התפטרות מוצדקת לפי המוסד, למשל:</p><ul class="${P}-why">${av.resign.reasons_he.map((x) => `<li>${esc(x)}</li>`).join('')}</ul><p class="jtool-hint">${esc(av.resign.docs_he)}.</p></div>`
		+ `<p class="jtool-hint" data-if-end="resign"${end === 'resign' ? '' : ' hidden'}>בלי סיבה מוכרת: ${num(av.resign.wait_days, 0)} ימים בלי דמי אבטלה מיום הפסקת העבודה (${esc(av.resign.section)}). אם יש סיבה מהרשימה, בחרו "התפטרתי מסיבה מוצדקת".</p>`
		+ `<p class="jtool-hint" data-if-end="leave"${end.startsWith('leave') ? '' : ' hidden'}>${esc(av.leave.own_he)}. ${esc(av.leave.vacation_he)}.</p></fieldset>`
		+ `<div class="jtool-row">${field('stop', 'יום הפסקת העבודה', isoToHe(toIso(input.stop)), 'לדוגמה: 15.10.2026')}${field('reg', 'יום הרישום בשירות התעסוקה', isoToHe(regIso), 'לדוגמה: 18.10.2026')}</div>`
		+ `<p class="jtool-hint">${esc(av.register.start_he)}.</p>`
		+ `${field('months', `בכמה מ-${av.qualify.window_months} החודשים שלפני חודש הרישום עבדתם כשכירים`, input.months === '' || input.months === undefined ? '' : String(input.months), `0 עד ${av.qualify.window_months}`)}`
		+ `<p class="jtool-hint">${esc(av.qualify.partial_he)}. צריך ${num(av.qualify.months, 0)} חודשים (${esc(av.qualify.section)}).</p>`
		+ `<fieldset class="jtool-field"><legend>השכר ברוטו ב-6 החודשים שלפני חודש הרישום</legend><div class="jtool-chips">${chip('wm', 'same', 'אותו שכר בכל החודשים', !each)}${chip('wm', 'each', 'שכר שונה בכל חודש', each)}</div>`
		+ `<div data-if-wm="same"${each ? ' hidden' : ''} style="margin-top:8px">${moneyField('wage', 'שכר חודשי ברוטו', input.wage, 'לדוגמה: 12,000')}</div>`
		+ `<div class="${P}-six" data-if-wm="each"${each ? '' : ' hidden'}>${labels.map((l, i) => `<div data-w="${i}">${moneyField(`w${i}`, l, wages[i], 'ברוטו')}</div>`).join('')}</div>`
		+ `<p class="jtool-hint">${esc(av.base.he)} (${esc(av.base.section)}). חודש בלי שכר מדלגים עליו ולוקחים את החודש הקודם שבו עבדתם.</p></fieldset>`
		+ `<details class="jtool-more"${input.repeat ? ' open' : ''}><summary>כבר קיבלתם דמי אבטלה בעבר?</summary>`
		+ `<div class="jtool-chips" style="margin-top:8px"><span data-if-age="under40"${age >= av.repeat.under_age ? ' hidden' : ''}>${chip('rep', '1', 'קיבלתי דמי אבטלה על כל הימים המרביים, בתביעה שהתחילה ב-4 השנים האחרונות', input.repeat === true, 'checkbox')}</span>`
		+ `<span data-if-age="over40"${age >= av.repeat.under_age ? '' : ' hidden'}>${chip('rep2', '1', 'קיבלתי דמי אבטלה ב-11 החודשים שלפני חודש הרישום', input.repeat === true, 'checkbox')}</span></div>`
		+ `<p class="jtool-hint">${esc(av.repeat.renew_he)}.</p></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const av = reg.rights_avtala;
	if (!r.eligible) {
		const g = r.gates.find((x) => !x.ok);
		return `אין זכאות לדמי אבטלה כרגע. ${g.he}.`;
	}
	const parts = [`דמי אבטלה של ${nis(r.benefit1)} ליום${r.capped ? ' (התקרה)' : ''}, כ-${nis(r.monthly)} בחודש מלא של ${av.month.table_days} ימים.`];
	parts.push(`עד ${r.maxDays} ימים: ${nis(r.total)} בסך הכול${r.unused ? `, אם ינוצלו ${r.paid} ימים עד ${isoToHe(r.windowEnd)}` : ''}.`);
	if (r.status === 'wait') { parts.push(`בגלל ההתפטרות, דמי האבטלה מתחילים מ-${isoToHe(r.firstPaid)}.`); }
	if (r.firstPay && r.lastPay) { parts.push(`התשלום הראשון בסביבות ${isoToHe(r.firstPay)}, האחרון בסביבות ${isoToHe(r.lastPay)}.`); }
	return parts.join(' ');
}

/** The daily amount against the ceiling line, over the payment days (day 1 at the right). Numbers live in the legend. */
function ceilingChart(reg, r) {
	const av = reg.rights_avtala;
	const n = Math.max(r.maxDays, 1);
	const w = 360;
	const h = 132;
	const pad = 6;
	const top = 20;
	const bottom = 22;
	const yMax = Math.max(r.capFirst, r.ben.raw) * 1.12;
	const x = (day) => w - pad - ((day - 1) / n) * (w - 2 * pad);
	const y = (v) => top + (1 - v / yMax) * (h - top - bottom);
	const segs = [];
	const cut = (a, b, cap) => { if (a <= b) { segs.push({ a, b, cap }); } };
	cut(1, Math.min(av.cap.first_days, n), r.capFirst);
	if (r.mx.womenCap) {
		cut(av.cap.first_days + 1, Math.min(av.women.cap_from_day - 1, n), av.cap.after);
		cut(av.women.cap_from_day, n, av.women.cap);
	} else { cut(av.cap.first_days + 1, n, av.cap.after); }
	const f = (v) => v.toFixed(1);
	let area = '';
	let labels = '';
	let d = '';
	let prevV = null;
	segs.forEach((s, i) => {
		const v = Math.min(r.ben.raw, s.cap);
		const x0 = x(s.b + 1);
		const x1 = x(s.a);
		area += `<rect class="${P}-ch__amt" x="${f(x0)}" y="${f(y(v))}" width="${f(x1 - x0)}" height="${f(y(0) - y(v))}"></rect>`;
		d += `${i ? 'L' : 'M'}${f(x1)} ${f(y(s.cap))} H${f(x0)} `;
		// The ceiling's amount above its line, at the segment's start; the paid amount inside the bar when it changes.
		if (x1 - x0 > 34) { labels += `<text class="${P}-ch__v ${P}-ch__v--cap" x="${f(x1 - 3)}" y="${f(y(s.cap) - 4)}" text-anchor="end">${money(s.cap)}</text>`; }
		if (v !== prevV && x1 - x0 > 34) {
			const inside = y(0) - y(v) > 18;
			labels += `<text class="${P}-ch__v${inside ? ` ${P}-ch__v--in` : ''}" x="${f(x1 - 4)}" y="${f(inside ? y(v) + 14 : y(v) - 4)}" text-anchor="end">${money(v)}</text>`;
		}
		prevV = v;
	});
	const ticks = [1].concat(n > av.cap.first_days ? [av.cap.first_days + 1] : []).concat(r.mx.womenCap && n >= av.women.cap_from_day ? [av.women.cap_from_day] : []);
	const tick = (day, anchor) => `<text class="${P}-ch__t" x="${f(x(day))}" y="${h - 6}" text-anchor="${anchor}">${day}</text>`;
	return `<svg class="${P}-ch__svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(`דמי האבטלה ליום מול התקרה: ${nis(r.benefit1)} מול ${nis(r.capFirst)} ב-${av.cap.first_days} הימים הראשונים${n > av.cap.first_days ? `, ו-${nis(r.benefit2)} מול ${nis(av.cap.after)} מיום ${av.cap.first_days + 1}` : ''}`)}">`
		+ `<line class="${P}-ch__base" x1="${pad}" x2="${w - pad}" y1="${f(y(0))}" y2="${f(y(0))}"></line>${area}<path class="${P}-ch__cap" d="${d.trim()}"></path>${labels}`
		+ ticks.map((t, i) => tick(t, i === 0 ? 'end' : 'middle')).join('') + (n > 1 ? tick(n, 'start') : '')
		+ (n > av.cap.first_days ? `<line class="${P}-ch__step" x1="${f(x(av.cap.first_days + 1))}" x2="${f(x(av.cap.first_days + 1))}" y1="${top}" y2="${f(y(0))}"></line>` : '')
		+ `</svg>`;
}

/** The benefit ledger: one row per month, one cell per calendar day. */
function ledger(reg, r) {
	const av = reg.rights_avtala;
	const kinds = { sat: 'שבת', wait: 'ימי המתנה', hold: '90 הימים אחרי התפטרות', paid: 'יום משולם', paid2: `יום משולם, מיום ${av.cap.first_days + 1}` };
	const rows = r.rows.map((row, ri) => {
		const [y, m] = row.key.split('-').map(Number);
		const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
		const byDay = {};
		row.cells.forEach((c) => { byDay[Number(c.d.slice(8))] = c; });
		const cells = [];
		for (let day = 1; day <= last; day += 1) {
			const c = byDay[day];
			let cls = c ? c.k : (ri === 0 ? 'pre' : 'post');
			if (c && c.d === r.firstPaid) { cls += ` ${P}-c--first`; }
			if (c && c.d === r.stepDay) { cls += ` ${P}-c--step`; }
			if (c && c.d === r.lastPaid) { cls += ` ${P}-c--last`; }
			cells.push(`<i class="${P}-c ${P}-c--${cls}"></i>`);
		}
		const note = [row.paid ? `${row.paid} ימים משולמים` : '', row.wait ? `${row.wait} ימי המתנה` : '', row.hold ? `${row.hold} ימים בהמתנה להתפטרות` : ''].filter(Boolean).join(' · ');
		return `<li class="${P}-led__row"><span class="${P}-led__m">${esc(row.he)}</span><span class="${P}-led__sum">${row.paid ? `${ilsn(row.amount)}<small>משולם ${esc(isoToHe(row.payDate))}</small>` : '<small>אין תשלום</small>'}</span>`
			+ `<span class="${P}-led__strip" aria-hidden="true">${cells.join('')}</span><span class="${P}-led__note">${esc(note)}</span></li>`;
	}).join('');
	const used = new Set(r.days.map((c) => c.k));
	const legend = ['paid', 'paid2', 'wait', 'hold', 'sat'].filter((k) => used.has(k)).map((k) => `<span><i class="${P}-c ${P}-c--${k}"></i>${esc(kinds[k])}</span>`).join('');
	return `<div class="${P}-led" role="group" aria-label="יומן דמי האבטלה לפי חודשים"><p class="${P}-led__h">יומן התשלומים מיום הרישום, ${esc(isoToHe(r.reg))}</p><ol class="${P}-led__rows">${rows}</ol>`
		+ `<p class="${P}-led__legend">${legend}${r.stepDay ? `<span><i class="${P}-c ${P}-c--paid ${P}-c--step"></i>יום ${av.cap.first_days + 1}: התקרה יורדת</span>` : ''}<span><i class="${P}-c ${P}-c--paid ${P}-c--last"></i>היום האחרון</span></p></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const av = reg.rights_avtala;
	const state = !r.eligible ? '<p class="jtool-state jtool-state--danger">✕ אין זכאות כרגע</p>' : r.status === 'wait' ? `<p class="jtool-state jtool-state--warn">! זכאות אחרי ${av.resign.wait_days} ימים</p>` : '<p class="jtool-state jtool-state--ok">✓ יש זכאות לדמי אבטלה</p>';
	const flags = r.flags.filter((x) => x.level !== 'info');
	let out = `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}דמי אבטלה ליום${r.eligible && r.maxDays > av.cap.first_days ? `, ב-${av.cap.first_days} הימים הראשונים` : ''}</p>`
		+ `<strong class="jtool-verdict__figure">${r.eligible ? ils(r.benefit1) : ils(0, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`;
	if (r.eligible) {
		out += `<dl class="jtool-breakdown"><div><dt>בחודש מלא, ${av.month.table_days} ימים</dt><dd>${ilsn(r.monthly)}</dd></div><div><dt>ימים מרביים</dt><dd>${num(r.maxDays, 0)}</dd></div><div><dt>סך הכול</dt><dd>${ilsn(r.total)}</dd></div><div><dt>התשלום האחרון</dt><dd>${r.lastPay ? `<bdi>${esc(isoToHe(r.lastPay))}</bdi>` : '—'}</dd></div></dl>`;
	}
	out += '</div>';
	if (r.eligible) {
		out += `<figure class="${P}-ch">${ceilingChart(reg, r)}<figcaption class="${P}-ch__cap-t"><span><i class="${P}-k ${P}-k--amt"></i>אצלכם ${esc(nis(r.benefit1))}${r.maxDays > av.cap.first_days && r.benefit2 < r.benefit1 ? `, ${esc(nis(r.benefit2))} מיום ${av.cap.first_days + 1}` : ''}${r.benefit3 !== null && r.maxDays >= av.women.cap_from_day && r.benefit3 < r.benefit2 ? `, ${esc(nis(r.benefit3))} מיום ${av.women.cap_from_day}` : ''}</span><span><i class="${P}-k ${P}-k--cap"></i>התקרה ${esc(nis(r.capFirst))}${r.maxDays > av.cap.first_days ? ` עד יום ${av.cap.first_days}, ${esc(nis(av.cap.after))} מיום ${av.cap.first_days + 1}` : ''}${r.mx.womenCap && r.maxDays >= av.women.cap_from_day ? `, ${esc(nis(av.women.cap))} מיום ${av.women.cap_from_day}` : ''}</span></figcaption></figure>`;
		out += ledger(reg, r);
	}
	if (flags.length) { out += `<ul class="jtool-flags">${flags.map((x) => `<li><strong aria-hidden="true">${MARK[x.level]}</strong> ${esc(x.he)}</li>`).join('')}</ul>`; }
	return out;
}

export function checklist(reg, r) {
	const av = reg.rights_avtala;
	const c = av.claim;
	const out = [
		{ he: 'נרשמים באתר שירות התעסוקה, מיד עם הפסקת העבודה (או בטופס המשולב באתר הממשלתי: רישום ותביעה יחד)', section: 'שירות התעסוקה', url: av.register.taasuka_url },
		{ he: `מתייצבים בלשכת התעסוקה הקרובה למקום המגורים, בתוך ${av.register.office_days} יום מהרישום באתר, ואחר כך בימים שהלשכה קובעת`, section: 'תנאי רביעי', url: av.register.url },
		{ he: `מגישים לביטוח הלאומי תביעה לדמי אבטלה, טופס ${c.form}, באתר, בתוך ${c.deadline_months} חודשים מההתייצבות הראשונה`, section: `טופס ${c.form}`, url: c.form_url },
		{ he: c.employer_he, section: `טופס ${c.employer_form}`, url: c.url },
	];
	c.docs_he.forEach((x, i) => {
		if (i === 2 && r.ending !== 'resign_ok') { return; }
		if (i === 3 && !String(r.ending).startsWith('leave')) { return; }
		out.push({ he: x, section: 'המסמכים לתביעה', url: c.url });
	});
	out.push({ he: 'פרטי חשבון הבנק שעל שמכם, לתשלום', section: 'תשלום הקצבה', url: av.pay.url });
	return out;
}
export function checklistText(reg, r) { return checklist(reg, r).map((x, i) => `${i + 1}. ${x.he} (${x.section})`).join('\n'); }

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const av = reg.rights_avtala;
	const rt = av.rates;
	let out = '';
	// 1. The calculation, line by line.
	const rows = [
		[`השכר ב-6 החודשים (${esc(monthHe(r.baseMonths[0]))} עד ${esc(monthHe(r.baseMonths[5]))})`, ilsn(r.base.total), `ההכנסה החייבת בדמי ביטוח${cite(av.base.section, av.law_url)}`],
		[`שכר יומי ממוצע: <bdi>${money(r.base.total, 0)} ÷ ${av.base.divisor}</bdi>`, ilsn(r.base.avg), `חלקי ${av.base.divisor}${cite('דף החישוב של המוסד', av.base.url)}`],
	];
	r.ben.tiers.forEach((t, i) => { if (t.part > 0) { rows.push([`${esc(t.he)}: <bdi>${money(t.part)} × ${t.pct}%</bdi>`, ilsn(t.amount), `${r.ben.young ? `מתחת לגיל ${rt.young_under}` : `מגיל ${rt.young_under}`}${i ? '' : `, הסכום היומי הבסיסי ${ilsn(rt.basic_daily)}`}${cite("לוח ז'", rt.schedule_url)}`]); } });
	rows.push(['דמי אבטלה ליום לפי השכר', ilsn(r.ben.raw), `סכום המדרגות${cite(rt.section, rt.url)}`]);
	if (r.eligible) {
		rows.push([`ליום, ב-${av.cap.first_days} ימי התשלום הראשונים`, ilsn(r.benefit1), `עד ${nis(r.capFirst)}${cite(r.repeatUnder ? av.repeat.section : av.cap.section, r.repeatUnder ? av.repeat.url : av.cap.url)}`]);
		if (r.maxDays > av.cap.first_days) { rows.push([`ליום, מיום התשלום ה-${av.cap.first_days + 1}`, ilsn(r.benefit2), `עד ${nis(av.cap.after)}, שני שלישים${cite(av.cap.section, av.cap.url)}`]); }
		if (r.benefit3 !== null && r.maxDays >= av.women.cap_from_day) { rows.push([`ליום, מיום התשלום ה-${av.women.cap_from_day}`, ilsn(r.benefit3), `עד ${nis(av.women.cap)}${cite(av.women.cap_section, av.women.url)}`]); }
		rows.push(['ימים מרביים', num(r.maxDays, 0), `${r.repeatUnder ? `${av.repeat.days_pct}% מ-${r.baseDays}` : `גיל ${r.age}, ${r.deps >= av.days.dependents_many ? `${av.days.dependents_many} תלויים ומעלה` : `${r.deps} תלויים`}`}${cite(r.repeatUnder ? av.repeat.section : r.daysSection, r.repeatUnder ? av.repeat.url : av.days.url)}`]);
		rows.push([`בחודש מלא: <bdi>${money(r.benefit1)} × ${av.month.table_days}</bdi>`, ilsn(r.monthly), `כמו בטבלת המוסד${cite('סכום הקצבה', av.month.table_url)}`]);
		rows.push(['ימי המתנה שלא משולמים', num(r.waitingCount, 0), `${av.waiting.days} בכל ${av.waiting.every_months} חודשים, לא מהמכסה${cite(av.waiting.section, av.waiting.url)}`]);
		if (r.holdCount) { rows.push(['ימים בהמתנה להתפטרות', num(r.holdCount, 0), `${av.resign.wait_days} ימים מיום הפסקת העבודה${cite(av.resign.section, av.resign.url)}`]); }
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-calc-h">כמה, על מה, ולפי איזה סעיף</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-calc-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ rows.map(([a, b, c]) => `<tr><td data-th="מה">${a}</td><td data-th="סכום">${b}</td><td data-th="הכלל">${c}</td></tr>`).join('')
		+ (r.eligible ? `<tr class="jtool-table__total"><td data-th="מה">סך הכול, ${num(r.paid, 0)} ימים</td><td data-th="סכום">${ilsn(r.total)}</td><td data-th="הכלל">ברוטו, לפני ניכויים</td></tr>` : '')
		+ `</tbody><caption>${esc(av.deductions.he)}. הסכומים מ-${esc(isoToHe(av.from))}.</caption></table></div></div>`;
	// 2. The gate.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-gate-h">תנאי הזכאות</h3></div><ul class="${P}-gate">`
		+ r.gates.map((g) => `<li class="${P}-gate__i ${P}-gate__i--${g.ok ? 'ok' : 'no'}"><strong aria-hidden="true">${g.ok ? '✓' : '✕'}</strong> ${esc(g.he)}${g.section ? cite(g.section, g.url) : cite('המוסד לביטוח לאומי', g.url)}</li>`).join('')
		+ `</ul></div>`;
	// 3. Month by month (the ledger in text).
	if (r.eligible && r.rows.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-mon-h">חודש אחרי חודש</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-mon-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">חודש</th><th scope="col">ימים משולמים</th><th scope="col">ימי המתנה</th><th scope="col">סכום</th><th scope="col">משולם בסביבות</th></tr></thead><tbody>`
			+ r.rows.map((row) => `<tr><td data-th="חודש">${esc(row.he)}</td><td data-th="ימים משולמים">${num(row.paid, 0)}</td><td data-th="ימי המתנה">${num(row.wait + row.hold, 0)}</td><td data-th="סכום">${row.paid ? ilsn(row.amount) : '—'}</td><td data-th="משולם בסביבות">${row.payDate ? `<bdi>${esc(isoToHe(row.payDate))}</bdi>` : '—'}</td></tr>`).join('')
			+ `<tr class="jtool-table__total"><td data-th="חודש">סך הכול</td><td data-th="ימים משולמים">${num(r.paid, 0)}</td><td data-th="ימי המתנה">${num(r.waitingCount + r.holdCount, 0)}</td><td data-th="סכום">${ilsn(r.total)}</td><td data-th="משולם בסביבות">${r.lastPay ? `<bdi>${esc(isoToHe(r.lastPay))}</bdi>` : '—'}</td></tr></tbody>`
			+ `<caption>${esc(av.month.paid_weekdays_he)}. ${esc(av.pay.he)}. החישוב מניח התייצבות מלאה בכל חודש.</caption></table></div></div>`;
	}
	// 4. The dates to keep.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ r.deadlines.map((x) => `<tr><td data-th="תאריך"><bdi>${esc(isoToHe(x.date))}</bdi></td><td data-th="מה">${esc(x.he)}</td><td data-th="מקור">${cite(x.section, x.url)}</td></tr>`).join('')
		+ `</tbody></table></div></div>`;
	// 5. The same wage at every age band.
	if (r.eligible) {
		const ages = byAge(reg, { age: r.age, deps: r.deps, ending: r.ending, stop: r.stop, reg: r.reg, months: r.months, wageMode: r.wageMode, wage: r.wages[0], wages: r.wages });
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-age-h">אותו שכר, אותם תלויים, כל גיל</h3></div><div class="jt7-scns ${P}-scns">`
			+ ages.map(({ band, r: x }) => { const here = r.age >= band.from && r.age < band.to && !r.mx.women; return `<div class="jt7-scn${here ? ' jt7-scn--here' : ''}"><p>גיל ${band.from} עד ${band.to}${here ? ' (אתם)' : ''}</p><strong>${x.ok && x.eligible ? ilsn(x.total) : '—'}</strong><small>${x.ok && x.eligible ? `${x.maxDays} ימים, ${nis(x.benefit1)} ליום` : ''}</small></div>`; }).join('')
			+ `</div><p class="jt7-scns__note">מתחת לגיל ${av.rates.young_under} השיעורים נמוכים יותר, ומ-${av.days.dependents_many} תלויים מספר הימים עולה. הימים עשויים להשתנות כשהגיל או מספר התלויים משתנים בתקופת האבטלה.</p></div>`;
	}
	// 6. What to file and what to bring.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">מה עושים עכשיו, ומה מצרפים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ol class="${P}-list">${checklist(reg, r).map((x) => `<li>${esc(x.he)}${cite(x.section, x.url)}</li>`).join('')}</ol></div>`;
	const info = r.flags.filter((x) => x.level === 'info');
	if (info.length) { out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-info-h">עוד לפני שמגישים</h3></div><ul class="${P}-info">${info.map((x) => `<li>${esc(x.he)}</li>`).join('')}</ul></div>`; }
	return out;
}

/** Page section: the maximum days by age and dependents, straight from the registry. */
export function daysTable(reg) {
	const av = reg.rights_avtala;
	const rows = av.days.bands.map((b) => `<tr><td data-th="גיל">${b.from} עד ${b.to}</td><td data-th="עד 2 תלויים">${num(b.few, 0)} ימים</td><td data-th="3 תלויים ומעלה">${num(b.many, 0)} ימים</td><td data-th="מקור">${cite(b.few_section, av.days.url)}</td></tr>`).join('')
		+ `<tr><td data-th="גיל">אישה שנולדה מ-1.1.1960, מגיל ${av.women.from_age}</td><td data-th="עד 2 תלויים">${num(av.women.days, 0)} ימים</td><td data-th="3 תלויים ומעלה">${num(av.women.days, 0)} ימים</td><td data-th="מקור">${cite(`${av.women.section_57}, ${av.women.section_60}`, av.women.url)}</td></tr>`;
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מספר ימי האבטלה המרביים לפי גיל ותלויים (${esc(av.days.section)}). ${esc(av.days.window_he)}; לנשים שנולדו מ-1960, בתוך ${av.women.window_months} חודשים.</caption><thead><tr><th scope="col">גיל</th><th scope="col">עד 2 תלויים</th><th scope="col">3 תלויים ומעלה</th><th scope="col">מקור</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the daily and monthly amount by wage, both age groups, from the same engine. */
export function wageTable(reg) {
	const av = reg.rights_avtala;
	const wages = [4000, 6000, 8000, 10000, 12000, 15000, 20000, 25000];
	const base = Object.assign({}, EXAMPLE, { wageMode: 'same' });
	const y = av.rates.young_under;
	const rows = wages.map((w) => {
		const a = compute(reg, Object.assign({}, base, { wage: w, age: y }));
		const b = compute(reg, Object.assign({}, base, { wage: w, age: y - 1 }));
		return `<tr><td data-th="שכר חודשי ברוטו">${ilsn(w)}</td><td data-th="מגיל ${y}, ליום">${ilsn(a.benefit1)}</td><td data-th="מגיל ${y}, לחודש">${ilsn(a.monthly)}</td><td data-th="מתחת ל-${y}, ליום">${ilsn(b.benefit1)}</td><td data-th="מתחת ל-${y}, לחודש">${ilsn(b.monthly)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>דמי אבטלה לפי שכר קבוע ב-6 החודשים, מ-${esc(isoToHe(av.from))}: ליום, ולחודש של ${av.month.table_days} ימים. התקרה ${esc(nis(av.cap.first))} ליום ב-${av.cap.first_days} הימים הראשונים (${esc(av.cap.section)}).</caption><thead><tr><th scope="col">שכר חודשי ברוטו</th><th scope="col">מגיל ${y}, ליום</th><th scope="col">מגיל ${y}, לחודש</th><th scope="col">מתחת ל-${y}, ליום</th><th scope="col">מתחת ל-${y}, לחודש</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const av = reg.rights_avtala;
	const t = r.ben.tiers;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.benefit1,
		sticky: ils(r.benefit1),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>תנאי הזכאות: גיל ${r.age}, ${r.months} חודשי עבודה מתוך ${av.qualify.window_months}, פיטורים, רישום בשירות התעסוקה ב-${isoToHe(r.reg)}${cite(av.age.section, av.law_url)}${cite(av.qualify.section, av.law_url)}</li>`
			+ `<li>השכר היומי הממוצע: השכר ב-6 החודשים חלקי ${av.base.divisor}, <bdi>${money(r.base.total, 0)} ÷ ${av.base.divisor} = ${money(r.base.avg)}</bdi> ₪${cite(av.base.section, av.law_url)}${cite('דף החישוב של המוסד', av.base.url)}</li>`
			+ `<li>המדרגות, מגיל ${av.rates.young_under}, על הסכום היומי הבסיסי ${money(av.rates.basic_daily, 0)} ₪: ${t.map((x) => `<bdi>${money(x.part)} × ${x.pct}% = ${money(x.amount)}</bdi>`).join('; ')}; סך הכול ${money(r.ben.raw)} ₪ ליום${cite("לוח ז'", av.rates.schedule_url)}${cite(av.rates.section, av.rates.url)}</li>`
			+ `<li>התקרה: ${money(av.cap.first)} ₪ ב-${av.cap.first_days} ימי התשלום הראשונים ו-${money(av.cap.after)} ₪ מהיום ה-${av.cap.first_days + 1}; ${money(r.ben.raw)} ₪ מתחת לשתיהן${cite(av.cap.section, av.cap.url)}</li>`
			+ `<li>הימים: גיל ${r.mx.band.from} עד ${r.mx.band.to} עם ${r.deps} תלויים, ${r.maxDays} ימים${cite(r.daysSection, av.law_url)}${cite('הטבלה של המוסד', av.days.url)}</li>`
			+ `<li>ימי המתנה: ${av.waiting.days} ימים בכל ${av.waiting.every_months} חודשים לא משולמים (${r.waitingCount} כאן), ולא יורדים מהמכסה${cite(av.waiting.section, av.law_url)}</li>`
			+ `<li>בחודש מלא: <bdi>${money(r.benefit1)} × ${av.month.table_days} = ${money(r.monthly)}</bdi> ₪; בסך הכול: <bdi>${money(r.benefit1)} × ${r.paid} = ${money(r.total)}</bdi> ₪, עד ${isoToHe(r.lastPaid)}, והתשלום האחרון בסביבות ${isoToHe(r.lastPay)}${cite('תשלום הקצבה', av.pay.url)}</li></ol>`,
		compare_table: daysTable(reg) + wageTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

export function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const int = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : (/^\d+$/.test(v) ? Number(v) : NaN); };
	const age = int('age');
	const under40 = age === '' || Number.isNaN(age) || age < 40;
	return {
		age, women: on('wom'), deps: Number(radio('dep', '0')), ending: radio('end', 'fired'),
		stop: toIso(val(`#${P}-stop`)), reg: toIso(val(`#${P}-reg`)), months: int('months'),
		wageMode: radio('wm', 'same'), wage: m('wage'), wages: [0, 1, 2, 3, 4, 5].map((i) => m(`w${i}`)),
		repeat: under40 ? on('rep') : on('rep2'),
	};
}

const EM = { fired: 'f', contract: 'c', resign_ok: 'j', resign: 'r', leave: 'l', leave_short: 's', leave_own: 'o' };
export function stateOf(i) {
	const each = i.wageMode === 'each';
	return encodeState({ a: i.age, w: i.women ? 1 : '', d: i.deps || '', e: EM[i.ending] || 'f', s: i.stop, g: i.reg, m: i.months, p: each ? '' : i.wage, x: each ? (i.wages || []).map((v) => (v === '' || v === undefined || v === null ? '' : String(v))).join('~') : '', r: i.repeat ? 1 : '' });
}
export const KEYS = ['a', 'w', 'd', 'e', 's', 'g', 'm', 'p', 'x', 'r'];
export function inputOf(s) {
	if (!s.a || !s.s || !s.g) { return null; }
	const each = Boolean(s.x);
	return {
		age: Number(s.a), women: s.w === '1', deps: s.d ? Number(s.d) : 0, ending: Object.keys(EM).find((k) => EM[k] === s.e) || 'fired',
		stop: s.s, reg: s.g, months: s.m ? Number(s.m) : 0, wageMode: each ? 'each' : 'same', wage: each ? '' : (s.p ? Number(s.p) : ''),
		wages: each ? s.x.split('~').map((v) => (v === '' ? '' : Number(v))) : [], repeat: s.r === '1',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const av = reg.rights_avtala;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(av.checked_on, av.refresh_every_days) || (av.next_update && today >= av.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהסכומים התעדכנו ב-1 בינואר'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const v = (root.querySelector(`#${P}-age`) || {}).value || '';
		const age = /^\d+$/.test(v.trim()) ? Number(v.trim()) : null;
		form.querySelectorAll('[data-if-57]').forEach((el) => { el.hidden = !(age !== null && age >= av.women.from_age); });
		form.querySelectorAll('[data-if-age]').forEach((el) => { const over = age !== null && age >= av.repeat.under_age; el.hidden = el.getAttribute('data-if-age') === 'over40' ? !over : over; });
		const end = (root.querySelector(`input[name="${P}-end"]:checked`) || {}).value || 'fired';
		form.querySelectorAll('[data-if-end]').forEach((el) => { const k = el.getAttribute('data-if-end'); el.hidden = k === 'leave' ? !end.startsWith('leave') : k !== end; });
		const wm = (root.querySelector(`input[name="${P}-wm"]:checked`) || {}).value || 'same';
		form.querySelectorAll('[data-if-wm]').forEach((el) => { el.hidden = el.getAttribute('data-if-wm') !== wm; });
		const regIso = toIso((root.querySelector(`#${P}-reg`) || {}).value || '');
		if (/^\d{4}-\d{2}-\d{2}$/.test(regIso)) {
			const names = baseMonths(regIso).map(monthHe);
			form.querySelectorAll('[data-w]').forEach((el) => { const l = el.querySelector('label'); if (l) { l.textContent = names[Number(el.getAttribute('data-w'))]; } });
		}
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok && r.eligible ? ils(r.benefit1) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.status }); }
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
			download('dmei-avtala.ics', 'text/calendar;charset=utf-8', ics(r.deadlines.map((d) => ({ date: d.date, summary: `דמי אבטלה: ${d.he}` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(checklistText(reg, r));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק הביטוח הלאומי ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(av.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.status : 'error' });
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
