/**
 * The rights wave 2A UI (22.10.2026, HAD-578): gross to net 2026 (sachar-neto) on /net-salary-calculator/.
 * The picture is the payslip itself: one strip for the gross, cut into what reaches the account and what each deduction
 * takes, and a second strip for what the month costs the employer. Under it, the payslip lines with their rules, the tax
 * of the month through the brackets, the second job with and without tax coordination, and the next steps. The reader can
 * start from a monthly gross, an hourly wage or the net they want. The result hands off to the jus-tice.com simulation.
 */
import { computeNeto, NETO_DEFAULT, NETO_BANDS, netoKids, netoBand } from './neto-engine.js';
import { profileForm, readProfile, profileState, profileFromState, PROFILE_KEYS, PROFILE_DEFAULT, fmtPts } from './mas-engine.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState,
	track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'sachar-neto';
const P = 'jt45';
const GRANT_PATH = '/maanak-avoda/';
const BAND_HE = { work: 'מגיל 18 עד גיל הפרישה', u18: 'מתחת לגיל 18', w_ret: 'אישה בין גיל הפרישה שלה ל-67', r67: 'גיל 67 עד 70, בלי קצבת אזרח ותיק', oap: 'מקבל/ת קצבת אזרח ותיק' };
const MODE_HE = { gross: 'ברוטו → נטו', hourly: 'שכר לשעה', net: 'נטו → ברוטו' };

export const EXAMPLE = Object.assign({}, NETO_DEFAULT, { profile: Object.assign({}, PROFILE_DEFAULT, { gender: 'f', marital: 'married', kids: [] }) });

const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const pctTxt = (n) => `${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`;
const amt = (n) => money(n, Number.isInteger(Math.round(n * 100) / 100) ? 0 : 2);

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const rt = reg.rights_tax;
	const rn = reg.rights_neto;
	const i = Object.assign({}, NETO_DEFAULT, input || {});
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const text = (id, label, value, ph, hint = '') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" class="jtool-input" type="text" inputmode="decimal" autocomplete="off" value="${esc(value)}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	return `<fieldset class="jtool-field"><legend>מאיפה מתחילים</legend><div class="jtool-chips">${Object.keys(MODE_HE).map((m) => chip('mode', m, MODE_HE[m], i.mode === m)).join('')}</div></fieldset>`
		+ `<div data-if-mode="gross"${i.mode === 'gross' ? '' : ' hidden'}>${text('gross', 'שכר בסיס חודשי ברוטו', i.gross, 'לדוגמה: 12,000', 'בלי שעות נוספות ונסיעות; אותן מוסיפים למטה')}</div>`
		+ `<div class="jtool-row" data-if-mode="hourly"${i.mode === 'hourly' ? '' : ' hidden'}>${text('hourly', 'שכר לשעה', i.hourly, 'לדוגמה: 45')}${text('hours', 'שעות בחודש', i.hours, '182', `משרה מלאה: ${rn.overtime.divisor} שעות (שבוע של ${rn.overtime.week_hours})`)}</div>`
		+ `<div data-if-mode="net"${i.mode === 'net' ? '' : ' hidden'}>${text('net', 'כמה נטו אתם רוצים לקבל', i.net, 'לדוגמה: 10,000', 'המחשבון מוצא את הברוטו שצריך לבקש')}</div>`
		+ `<details class="jtool-more" open><summary>נקודות זיכוי (${esc(String(rt.current_year))})</summary>`
		+ `<div style="margin-top:8px">${text('pts', 'מספר נקודות ידוע (לא חובה)', i.points, 'ריק = לפי הפרטים למטה', 'מופיע בתלוש או בטופס 106; אם ממלאים, הוא גובר על החישוב')}</div>`
		+ profileForm(P, rt, i.profile || PROFILE_DEFAULT) + '</details>'
		+ `<details class="jtool-more" open><summary>פנסיה וקרן השתלמות</summary>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('pen', '1', 'מפקידים לפנסיה (חובה ברוב המשרות)', i.pension, 'checkbox')}${chip('sf', '1', 'יש קרן השתלמות', i.sf, 'checkbox')}</div>`
		+ `<div class="jtool-row" data-if-pen${i.pension ? '' : ' hidden'} style="margin-top:8px">${text('pe', 'עובד/ת לפנסיה, %', i.pe, '6')}${text('pr', 'מעסיק לתגמולים, %', i.pr, '6.5')}${text('ps', 'מעסיק לפיצויים, %', i.ps, '6')}</div>`
		+ `<div class="jtool-row" data-if-sf${i.sf ? '' : ' hidden'} style="margin-top:8px">${text('sfe', 'עובד/ת לקרן השתלמות, %', i.sfe, '2.5')}${text('sfr', 'מעסיק לקרן השתלמות, %', i.sfr, '7.5')}</div>`
		+ `<p class="jtool-hint">${esc(rn.pension.he)}.</p></details>`
		+ `<details class="jtool-more"${i.ot125 || i.ot150 || i.travel || i.extra ? ' open' : ''}><summary>שעות נוספות, נסיעות ותוספות</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${text('o1', 'שעות נוספות ב-125% (שעתיים ראשונות ביום)', i.ot125, '0')}${text('o2', 'שעות נוספות ב-150% (משעה שלישית, ובמנוחה השבועית)', i.ot150, '0')}</div>`
		+ `<div class="jtool-row">${text('tr', 'החזר נסיעות בחודש', i.travel, '0', `עד ${rn.travel.max_day.toFixed(2)} ₪ ליום עבודה`)}${text('ex', 'תוספות אחרות בחודש (בונוס, שווי)', i.extra, '0')}</div></details>`
		+ `<details class="jtool-more"${i.band !== 'work' ? ' open' : ''}><summary>גיל וביטוח לאומי</summary><div class="jtool-chips" style="margin-top:8px">${NETO_BANDS.map((b) => chip('band', b, BAND_HE[b], i.band === b)).join('')}</div></details>`
		+ `<details class="jtool-more"${i.second ? ' open' : ''}><summary>עבודה נוספת אצל מעסיק אחר</summary>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('sec', '1', 'יש לי משרה שנייה', i.second, 'checkbox')}</div>`
		+ `<div data-if-sec${i.second ? '' : ' hidden'} style="margin-top:8px">${text('g2', 'ברוטו במשרה השנייה בחודש', i.gross2, 'לדוגמה: 3,000')}<div class="jtool-chips">${chip('coord', '0', 'בלי תיאום מס', !i.coord)}${chip('coord', '1', 'עם תיאום מס', i.coord)}</div></div></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const from = r.p.mode === 'net' ? `כדי לקבל ${amt(r.p.net)} ₪ נטו צריך ברוטו של ${amt(r.gross)} ₪` : `מ-${amt(r.gross)} ₪ ברוטו נשארים ${amt(r.net)} ₪ נטו`;
	return `${from} בחודש (${r.year}): מס הכנסה ${money(r.tax)} ₪, ביטוח לאומי ${money(r.bl)} ₪, ביטוח בריאות ${money(r.health)} ₪${r.pension ? `, פנסיה ${money(r.pension)} ₪` : ''}${r.study ? `, קרן השתלמות ${money(r.study)} ₪` : ''}. מכל 1,000 ₪ תוספת נשארים ${money(r.keep, 0)} ₪.`;
}

/** The payslip strip: the gross cut into net and deductions; the employer's cost under it. */
export function payslipStrip(reg, r) {
	if (!r.ok || !(r.gross > 0)) { return ''; }
	const segs = [
		['net', 'נטו לחשבון', r.net], ['tax', 'מס הכנסה', r.tax], ['bl', 'ביטוח לאומי', r.bl], ['health', 'ביטוח בריאות', r.health],
		['pen', 'פנסיה (חלק העובד)', r.pension], ['sf', 'קרן השתלמות (חלק העובד)', r.study],
	].filter((s) => s[2] > 0);
	const m = r.m;
	const emp = [
		['gross', 'ברוטו', r.gross], ['er', 'פנסיה (מעסיק)', m.er], ['es', 'פיצויים', m.es], ['kr', 'קרן השתלמות (מעסיק)', m.kr], ['ebl', 'ביטוח לאומי (מעסיק)', m.bl.employer],
	].filter((s) => s[2] > 0);
	const bar = (rows, total, label) => `<div class="${P}-strip" role="img" aria-label="${esc(`${label}: ${rows.map((s) => `${s[1]} ${money(s[2])} ₪`).join(', ')}`)}">${rows.map((s) => `<span class="${P}-seg ${P}-seg--${s[0]}" style="flex-grow:${Math.max(0.0001, s[2] / total)}" title="${esc(`${s[1]}: ${money(s[2])} ₪`)}"><bdi>${s[2] / total >= 0.09 ? esc(money(s[2], 0)) : ''}</bdi></span>`).join('')}</div>`;
	return `<div class="${P}-slip"><p class="${P}-slip__h">לאן הולך הברוטו <span>(${money(r.gross)} ₪ = 100%)</span></p>${bar(segs, r.gross, 'חלוקת הברוטו')}`
		+ `<p class="${P}-keys">${segs.map((s) => `<span><i class="${P}-k ${P}-seg--${s[0]}" aria-hidden="true"></i>${esc(s[1])} <bdi>${esc(pctTxt(Math.round((s[2] / r.gross) * 1000) / 10))}</bdi></span>`).join('')}</p>`
		+ `<p class="${P}-slip__h">כמה החודש עולה למעסיק <span>(${money(r.employerCost)} ₪)</span></p>${bar(emp, r.employerCost, 'עלות המעסיק')}`
		+ `<p class="${P}-keys">${emp.map((s) => `<span><i class="${P}-k ${P}-seg--${s[0]}" aria-hidden="true"></i>${esc(s[1])}</span>`).join('')}</p></div>`;
}

function secondBox(reg, r) {
	const s = r.sec;
	if (!s) { return ''; }
	const rn = reg.rights_neto;
	return `<div class="${P}-two"><p class="${P}-two__h">המשרה השנייה: ${money(s.gross)} ₪ ברוטו</p><dl class="jtool-breakdown">`
		+ `<div><dt>בלי תיאום מס</dt><dd>${ils(s.netFlat)} נטו</dd></div><div><dt>עם תיאום מס</dt><dd>${ils(s.netCoord)} נטו</dd></div><div><dt>ההפרש בחודש</dt><dd>${ils(s.stuck)}</dd></div></dl>`
		+ `<p class="jtool-scope">${esc(rn.second_job.he)}. ${esc(rn.second_job.bl_he)}. את מה שנוכה ביותר מקבלים בחזרה בהחזר מס, אבל אחרי שנה.${cite('תיאום מס מקוון', rn.second_job.coordination_url)}${cite('מכתב בל/651', rn.second_job.bl_url)}</p></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const head = r.p.mode === 'net' ? 'הברוטו שצריך' : 'שכר נטו לחודש';
	const fig = r.p.mode === 'net' ? r.gross : r.net;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי המדרגות, הנקודות והשיעורים של ${r.year}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${head}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(fig)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>מס הכנסה</dt><dd>${ils(r.tax)}</dd></div><div><dt>ביטוח לאומי ובריאות</dt><dd>${ils(r.bl + r.health)}</dd></div><div><dt>נקודות זיכוי</dt><dd><bdi>${esc(fmtPts(r.m.points))}</bdi></dd></div><div><dt>מדרגת המס השולית</dt><dd><bdi>${r.marginal}%</bdi></dd></div><div><dt>שיעור הניכוי האפקטיבי</dt><dd><bdi>${esc(pctTxt(r.effective))}</bdi></dd></div><div><dt>עלות למעסיק</dt><dd>${ils(r.employerCost)}</dd></div></dl>`
		+ `<p class="jtool-scope">זהה לשיטה החודשית של תקנות הניכוי ממשכורת. נבדק מול מחשבון הביטוח הלאומי ורשות המסים (10,000 ₪, 2.25 נקודות: ביטוח לאומי ובריאות 608.46 ₪, מס לפני זיכוי הפנסיה 575.10 ₪).</p></div>`
		+ payslipStrip(reg, r) + secondBox(reg, r)
		+ (r.notes.length ? `<ul class="jtool-flags">${r.notes.map((n) => `<li>${esc(n.he)}</li>`).join('')}</ul>` : '');
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const rt = reg.rights_tax;
	const rb = reg.rights_bituach;
	const rn = reg.rights_neto;
	const m = r.m;
	const row = (he, amount, rule) => `<tr><td data-th="שורה בתלוש">${he}</td><td data-th="בחודש">${ils(amount)}</td><td data-th="בשנה">${ils(amount * 12)}</td><td data-th="הכלל">${rule}</td></tr>`;
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-slip-h">התלוש, שורה אחר שורה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-slip-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">שורה בתלוש</th><th scope="col">בחודש</th><th scope="col">בשנה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ row('שכר בסיס', m.S, r.p.mode === 'hourly' ? `${money(r.p.hourly)} ₪ × ${money(r.p.hours, 0)} שעות` : '—')
		+ (m.ot ? row('שעות נוספות', m.ot, `שכר שעה ${money(m.hourlyRate)} ₪ × 125% / 150%${cite(rn.overtime.section, rn.overtime.url)}`) : '')
		+ (r.p.travel ? row('החזר נסיעות', r.p.travel, `${esc(rn.travel.he)}${cite('צו ההרחבה', rn.travel.url)}`) : '')
		+ (r.p.extra ? row('תוספות', r.p.extra, 'הכנסה חייבת') : '')
		+ (m.imp.total ? row('זקיפת הפקדות מעסיק מעל התקרה', m.imp.total, `${esc(rn.employer_ceiling.section)}${cite('לוח העזר 2026', rn.employer_ceiling.cap_url)}`) : '')
		+ row('<strong>ברוטו</strong>', m.G, '')
		+ row('מס הכנסה', -m.tax.tax, `${money(m.tax.before)} ₪ לפי המדרגות, פחות ${esc(fmtPts(m.points))} נקודות × ${rt.years[String(r.year)].point_month} ₪ = ${money(m.tax.pointsValue)} ₪${m.credit ? `, ופחות זיכוי פנסיה ${money(m.credit)} ₪` : ''}${cite('סעיף 121', rt.years[String(r.year)].url)}${m.credit ? cite('סעיף 45א', rn.pension_credit.url) : ''}`)
		+ row('ביטוח לאומי', -m.bl.bl, `${pctTxt(m.bl.rate.bl[0])} עד ${money(rb.tier.amount, 0)} ₪, ${pctTxt(m.bl.rate.bl[1])} מעליהם עד ${money(rb.max.amount, 0)} ₪${cite(rb.tier.section, rb.employee.url)}`)
		+ row('ביטוח בריאות', -m.bl.health, `${pctTxt(m.bl.rate.health[0])} / ${pctTxt(m.bl.rate.health[1])}${cite('שיעורי דמי ביטוח בריאות', rb.employee.health_url)}`)
		+ (m.ep ? row('פנסיה, חלק העובד', -m.ep, `${pctTxt(r.p.pe)} משכר הבסיס${cite('צו ההרחבה', rn.pension.url)}`) : '')
		+ (m.ke ? row('קרן השתלמות, חלק העובד', -m.ke, `${pctTxt(r.p.sfe)}, לפי הסכם`) : '')
		+ `<tr class="jtool-table__total"><td data-th="שורה בתלוש">נטו</td><td data-th="בחודש">${ils(r.net)}</td><td data-th="בשנה">${ils(r.yearNet)}</td><td data-th="הכלל">${esc(rn.method.rounding_he)}</td></tr></tbody>`
		+ `<caption>${esc(rn.method.he)} (${esc(rn.method.section)}).</caption></table></div></div>`;
	// The tax of the month through the brackets.
	const br = m.tax.brackets.filter((b) => b.part > 0);
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-tax-h">מס ההכנסה של החודש, מדרגה אחר מדרגה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-tax-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מדרגה (לחודש)</th><th scope="col">שיעור</th><th scope="col">הסכום במדרגה</th><th scope="col">המס</th></tr></thead><tbody>`
		+ br.map((b) => `<tr><td data-th="מדרגה (לחודש)">${money(b.from / 12)} עד ${b.to === null ? 'ומעלה' : money(b.to / 12)}</td><td data-th="שיעור"><bdi>${b.rate}%</bdi></td><td data-th="הסכום במדרגה">${ils(b.part / 12)}</td><td data-th="המס">${ils(b.tax / 12)}</td></tr>`).join('')
		+ (m.tax.surtax ? `<tr><td data-th="מדרגה (לחודש)">מס יסף</td><td data-th="שיעור"><bdi>${rt.years[String(r.year)].surtax.pct}%</bdi></td><td data-th="הסכום במדרגה">—</td><td data-th="המס">${ils(m.tax.surtax)}</td></tr>` : '')
		+ `<tr class="jtool-table__total"><td data-th="מדרגה (לחודש)">לפני הזיכויים</td><td data-th="שיעור">—</td><td data-th="הסכום במדרגה">${ils(m.taxable)}</td><td data-th="המס">${ils(m.tax.before)}</td></tr></tbody>`
		+ `<caption>${esc(rt.years[String(r.year)].source_he)}. ${esc(rt.years[String(r.year)].change_he || '')}</caption></table></div></div>`;
	// The employer.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-emp-h">עלות המעסיק</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-emp-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">רכיב</th><th scope="col">בחודש</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ `<tr><td data-th="רכיב">ברוטו</td><td data-th="בחודש">${ils(m.G)}</td><td data-th="הכלל">—</td></tr>`
		+ (m.er ? `<tr><td data-th="רכיב">פנסיה, תגמולי מעסיק</td><td data-th="בחודש">${ils(m.er)}</td><td data-th="הכלל">${pctTxt(r.p.pr)}; פטור עד ${pctTxt(rn.employer_ceiling.tagmulim_max_pct)} משכר של עד ${money(rn.employer_ceiling.tagmulim_salary_cap, 0)} ₪${cite(rn.employer_ceiling.section, rn.employer_ceiling.url)}</td></tr>` : '')
		+ (m.es ? `<tr><td data-th="רכיב">פיצויים</td><td data-th="בחודש">${ils(m.es)}</td><td data-th="הכלל">${pctTxt(r.p.ps)}; פטור עד ${money(rn.employer_ceiling.severance_year_cap, 0)} ₪ בשנה</td></tr>` : '')
		+ (m.kr ? `<tr><td data-th="רכיב">קרן השתלמות, מעסיק</td><td data-th="בחודש">${ils(m.kr)}</td><td data-th="הכלל">${pctTxt(r.p.sfr)}; פטור משכר של עד ${money(rn.study_fund.salary_cap, 0)} ₪${cite(rn.study_fund.section, rn.study_fund.url)}</td></tr>` : '')
		+ `<tr><td data-th="רכיב">ביטוח לאומי, מעסיק</td><td data-th="בחודש">${ils(m.bl.employer)}</td><td data-th="הכלל">${pctTxt(m.bl.rate.employer[0])} / ${pctTxt(m.bl.rate.employer[1])}${cite('שיעורי דמי ביטוח', rb.employee.url)}</td></tr>`
		+ `<tr class="jtool-table__total"><td data-th="רכיב">עלות כוללת</td><td data-th="בחודש">${ils(r.employerCost)}</td><td data-th="הכלל">${ils(r.employerCost * 12)} בשנה</td></tr></tbody></table></div></div>`;
	// Next steps.
	const k = netoKids(r.p.profile, reg.rights_maanak ? reg.rights_maanak.claim_year : r.year - 1);
	const grant = reg.rights_maanak && r.gross > 0 && r.gross <= reg.rights_maanak.years['2025'].single.k3.ceiling;
	const grantHash = `${GRANT_PATH}#s=i${Math.round(r.gross)}/k${k.kids}/t${k.toddlers}/f${r.p.profile.marital === 'single' ? (k.kids ? 's' : 'a') : 'c'}`;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-next-h">מה עושים עם המספר</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-slip">העתקת התלוש המחושב</button></div></div><ul class="${P}-links">`
		+ (grant ? `<li><a href="${esc(grantHash)}" data-act="grant">בדיקת זכאות למענק עבודה</a>: בשכר כזה ייתכן שמגיע מענק מרשות המסים (מס הכנסה שלילי)</li>` : '')
		+ `<li><a href="/nekudot-zikui/">נקודות זיכוי</a>: לבדוק שהמעסיק נותן את כולן, ולמלא טופס 101 נכון</li>`
		+ `<li><a href="/guide-tax-calculator-updated-2025/">החזר מס לשכירים</a>: על שנים שבהן נוכה יותר מדי (משרה שנייה, חלק משנה, נקודות שלא ניתנו)</li>`
		+ `<li><a href="/national-insurance-calculator/">דמי ביטוח לאומי ובריאות</a>: כל מעמד וגיל, וכמה מעסיקים</li>`
		+ `<li><a href="/overtime-pay-israel/">שעות נוספות</a> ו<a href="/weekly-rest-holiday-pay/">עבודה במנוחה השבועית</a>: מה מגיע לפי החוק</li>`
		+ `<li><a href="/payslip-requirements/">תלוש שכר</a>: מה חייב להופיע בו, ומה עושים כשחסר</li>`
		+ `<li><a href="/keren-hishtalmut/">קרן השתלמות</a> ו<a href="/pension-rights-israel/">זכויות פנסיה</a></li>`
		+ `<li><a href="/severance-pay-calculator/">פיצויי פיטורים</a>, <a href="/havraa-pay-calculator/">דמי הבראה</a>, <a href="/annual-leave-calculator/">ימי חופשה</a> ו<a href="/sick-pay-accrual/">ימי מחלה</a>: הזכויות שמחושבות מאותו שכר</li>`
		+ `<li><a href="/sachar-minimum-2026/">שכר המינימום 2026</a> ו<a href="/halanat-sachar/">הלנת שכר</a></li>`
		+ `</ul><p class="${P}-note">${esc(rn.second_job.coordination_he)}.${cite('תיאום מס מקוון', rn.second_job.coordination_url)}${cite('טופס 101', rn.second_job.form101_url)}</p></div>`;
	return out;
}

/** Page section: the net of common salaries in 2026, computed by the same engine (pension 6%, no study fund). */
export function netTable(reg) {
	const rb = reg.rights_btl;
	const mw = reg.min_wage.rows[reg.min_wage.rows.length - 1];
	const levels = [mw.monthly, 8000, 10000, 12000, rb.avg_wage.s2_contributions, 15000, 20000, 25000, 30000, 40000, 50000];
	const man = { gender: 'm', marital: 'single', kids: [] };
	const woman = { gender: 'f', marital: 'single', kids: [] };
	const rows = levels.map((g) => {
		const a = computeNeto(reg, { gross: g, profile: man });
		const b = computeNeto(reg, { gross: g, profile: woman });
		const tag = g === mw.monthly ? ' (שכר מינימום)' : g === rb.avg_wage.s2_contributions ? ' (השכר הממוצע)' : '';
		return `<tr><td data-th="ברוטו">${ils(g)}${esc(tag)}</td><td data-th="נטו, גבר (2.25 נקודות)">${ils(a.net)}</td><td data-th="נטו, אישה (2.75 נקודות)">${ils(b.net)}</td><td data-th="מס הכנסה (גבר)">${ils(a.tax)}</td><td data-th="ביטוח לאומי ובריאות">${ils(a.bl + a.health)}</td><td data-th="פנסיה 6%">${ils(a.pension)}</td><td data-th="עלות למעסיק">${ils(a.employerCost)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>כמה נטו מכל ברוטו ב-2026: משרה אחת, בלי ילדים, פנסיה 6% (מעסיק 6.5% + 6% פיצויים), בלי קרן השתלמות. מחושב במנוע של המחשבון</caption>`
		+ `<thead><tr><th scope="col">ברוטו</th><th scope="col">נטו, גבר (2.25 נקודות)</th><th scope="col">נטו, אישה (2.75 נקודות)</th><th scope="col">מס הכנסה (גבר)</th><th scope="col">ביטוח לאומי ובריאות</th><th scope="col">פנסיה 6%</th><th scope="col">עלות למעסיק</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const rt = reg.rights_tax;
	const rb = reg.rights_bituach;
	const rn = reg.rights_neto;
	const r = computeNeto(reg, EXAMPLE);
	const m = r.m;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.net,
		sticky: ils(r.net),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>ברוטו ${money(m.G, 0)} ₪ × 12 = ${money(m.G * 12, 0)} ₪ בשנה, דרך מדרגות ${r.year}: ${money(m.tax.before * 12)} ₪, כלומר ${money(m.tax.before)} ₪ בחודש${cite('סעיף 121', rt.years[String(r.year)].url)}</li>`
			+ `<li>אישה: ${fmtPts(m.points)} נקודות × ${rt.years[String(r.year)].point_month} ₪ = ${money(m.tax.pointsValue)} ₪${cite('סעיפים 34, 36 ו-36א', rt.law_url)}</li>`
			+ `<li>פנסיה 6%: ${money(m.ep)} ₪; זיכוי 35% עד 7% משכר של עד ${money(rn.pension_credit.cap_month, 0)} ₪ = ${money(m.credit)} ₪${cite('סעיף 45א', rn.pension_credit.url)}</li>`
			+ `<li>מס הכנסה: ${money(m.tax.before)} − ${money(m.tax.pointsValue)} − ${money(m.credit)} = ${money(m.tax.tax)} ₪</li>`
			+ `<li>ביטוח לאומי ובריאות: ${money(rb.tier.amount, 0)} ₪ בשיעור המופחת ו-${money(m.G - rb.tier.amount, 0)} ₪ בשיעור המלא = ${money(m.bl.bl)} + ${money(m.bl.health)} ₪${cite(rb.tier.section, rb.employee.url)}</li>`
			+ `<li>נטו: ${money(m.G)} − ${money(m.tax.tax)} − ${money(m.bl.bl)} − ${money(m.bl.health)} − ${money(m.ep)} = ${money(r.net)} ₪</li></ol>`,
		compare_table: netTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/** The scenario for the simulation: the tool's figures only, never a name, an ID or an employer's name. */
export function scenarioText(reg, r) {
	if (!r.ok) { return ''; }
	const sec = r.sec ? ` יש לי גם משרה שנייה של ${money(r.sec.gross, 0)} ₪ ברוטו, ${r.p.coord ? 'עם' : 'בלי'} תיאום מס.` : '';
	return `תלוש השכר שלי לשנת ${r.year}: ברוטו ${money(r.gross, 0)} ₪ בחודש, ${fmtPts(r.m.points)} נקודות זיכוי${r.pension ? `, פנסיה ${pctTxt(r.p.pe)}` : ''}${r.m.ot ? `, שעות נוספות ${money(r.m.ot, 0)} ₪` : ''}. לפי החישוב לפי מדרגות המס ושיעורי הביטוח הלאומי, הנטו צריך להיות ${money(r.net, 0)} ₪ (מס הכנסה ${money(r.tax, 0)} ₪, ביטוח לאומי ובריאות ${money(r.bl + r.health, 0)} ₪).${sec} אני רוצה להתכונן לשיחה עם המעסיק על התלוש: לבדוק שהניכויים נכונים, ולבקש תיקון או העלאה.`;
}

/* ---------------- Browser ---------------- */

export function stateOf(i) {
	const p = i.profile || PROFILE_DEFAULT;
	return encodeState(Object.assign({
		m: i.mode !== 'gross' ? i.mode.charAt(0) : '', g: i.mode === 'gross' ? i.gross : '', h: i.mode === 'hourly' ? i.hourly : '', o: i.mode === 'hourly' ? i.hours : '',
		n: i.mode === 'net' ? i.net : '', a: i.ot125 || '', b: i.ot150 || '', t: i.travel || '', x: i.extra || '',
		p: i.pension ? '' : '0', e: i.pension && Number(i.pe) !== 6 ? i.pe : '', r: i.pension && Number(i.pr) !== 6.5 ? i.pr : '', s: i.pension && Number(i.ps) !== 6 ? i.ps : '',
		f: i.sf ? 1 : '', c: i.second ? i.gross2 : '', d: i.second && i.coord ? 1 : '', k: i.band !== 'work' ? i.band : '', z: i.points === '' || i.points === undefined ? '' : i.points,
	}, profileState(p)));
}
export const KEYS = ['m', 'g', 'h', 'o', 'n', 'a', 'b', 't', 'x', 'p', 'e', 'r', 's', 'f', 'c', 'd', 'k', 'z'].concat(PROFILE_KEYS);
export function inputOf(s) {
	if (!s || (!s.g && !s.h && !s.n)) { return null; }
	const num = (v, d) => (v === undefined || v === '' ? d : Number(v));
	const mode = s.m === 'h' ? 'hourly' : s.m === 'n' ? 'net' : 'gross';
	const prof = s.G ? profileFromState(s) : Object.assign({}, EXAMPLE.profile);
	return Object.assign({}, NETO_DEFAULT, {
		mode, gross: num(s.g, NETO_DEFAULT.gross), hourly: num(s.h, NETO_DEFAULT.hourly), hours: num(s.o, 182), net: num(s.n, NETO_DEFAULT.net),
		ot125: num(s.a, 0), ot150: num(s.b, 0), travel: num(s.t, 0), extra: num(s.x, 0), pension: s.p !== '0', pe: num(s.e, 6), pr: num(s.r, 6.5), ps: num(s.s, 6),
		sf: s.f === '1', second: Boolean(s.c), gross2: num(s.c, 0), coord: s.d === '1', band: NETO_BANDS.includes(s.k) ? s.k : 'work', points: s.z === undefined ? '' : num(s.z, ''),
		profile: prof,
	});
}

function readForm(root) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const num = (id, d) => { const v = String(val(id)).replace(/[,\s₪%]/g, ''); return v === '' ? d : Number(v); };
	return {
		mode: pick('mode', 'gross'), gross: num('gross', ''), hourly: num('hourly', ''), hours: num('hours', 182), net: num('net', ''),
		ot125: num('o1', 0), ot150: num('o2', 0), travel: num('tr', 0), extra: num('ex', 0),
		pension: on('pen'), pe: num('pe', 6), pr: num('pr', 6.5), ps: num('ps', 6), sf: on('sf'), sfe: num('sfe', 2.5), sfr: num('sfr', 7.5),
		band: pick('band', 'work'), points: num('pts', ''), second: on('sec'), gross2: num('g2', 0), coord: pick('coord', '0') === '1',
		profile: readProfile(val, on, pick, root.querySelectorAll('[data-kid]').length),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const rn = reg.rights_neto;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(rn.checked_on, rn.refresh_every_days) || (rn.next_update && today >= rn.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהמדרגות והשיעורים התעדכנו ב-1 בינואר'); }
	}
	const ids = { gross: 'gross', hourly: 'hourly', hours: 'hours', net: 'net', ot125: 'o1', ot150: 'o2', travel: 'tr', extra: 'ex', pe: 'pe', pr: 'pr', ps: 'ps', sfe: 'sfe', sfr: 'sfr', points: 'pts', gross2: 'g2', degreeYear: 'dgy', degreeYears: 'dgn', maYear: 'may', maYears: 'man', discharge: 'dis', served: 'srv', aliyah: 'aly', reserve: 'res', disabled: 'dsb' };
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
		const mode = (root.querySelector(`input[name="${P}-mode"]:checked`) || {}).value || 'gross';
		form.querySelectorAll('[data-if-mode]').forEach((el) => { el.hidden = el.getAttribute('data-if-mode') !== mode; });
		form.querySelectorAll('[data-if-pen]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-pen"]:checked`); });
		form.querySelectorAll('[data-if-sf]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-sf"]:checked`); });
		form.querySelectorAll('[data-if-sec]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-sec"]:checked`); });
		const single = ((root.querySelector(`input[name="${P}-ms"]:checked`) || {}).value || 'married') === 'single';
		const dg = (root.querySelector(`input[name="${P}-dg"]:checked`) || {}).value || 'none';
		form.querySelectorAll('[data-if-single]').forEach((el) => { el.hidden = !single; });
		form.querySelectorAll('[data-if-married]').forEach((el) => { el.hidden = single; });
		form.querySelectorAll('[data-if-degree]').forEach((el) => { el.hidden = dg === 'none'; });
		form.querySelectorAll('[data-if-ma]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-ma"]:checked`); });
	};
	const run = (input, opts = {}) => {
		const r = computeNeto(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.p.mode === 'net' ? r.gross : r.net) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: netoBand(r) }); }
		return r;
	};
	const later = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	const redraw = (input, focusSel) => {
		form.innerHTML = renderForm(reg, input);
		sync();
		run(input, { silent: true });
		const el = focusSel && root.querySelector(focusSel);
		if (el) { el.focus(); }
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		redraw(fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
	} else {
		sync();
		run(readForm(root), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', later);
	form.addEventListener('change', later);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		if (act === 'kid-add') {
			input.profile.kids = input.profile.kids.concat([['', 1]]);
			redraw(input, `#${P}-kid-${input.profile.kids.length - 1}`);
			return;
		}
		if (act === 'kid-del') {
			const n = Number(b.getAttribute('data-kid-del'));
			input.profile.kids = input.profile.kids.filter((k, i) => i !== n);
			redraw(input, '[data-act="kid-add"]');
			return;
		}
		const r = computeNeto(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או שם מעסיק.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if ((act === 'copy' || act === 'copy-slip') && r.ok) {
			const m = r.m;
			const lines = [`ברוטו: ${money(m.G)} ₪`, `מס הכנסה: ${money(r.tax)} ₪ (${fmtPts(m.points)} נקודות זיכוי)`, `ביטוח לאומי: ${money(r.bl)} ₪`, `ביטוח בריאות: ${money(r.health)} ₪`]
				.concat(r.pension ? [`פנסיה (עובד): ${money(r.pension)} ₪`] : []).concat(r.study ? [`קרן השתלמות (עובד): ${money(r.study)} ₪`] : [])
				.concat([`נטו: ${money(r.net)} ₪`, `עלות למעסיק: ${money(r.employerCost)} ₪`, `(חושב ב-jus-tice.co.il לפי ${r.year}, ${isoToHe(rn.checked_on)}. מידע כללי, לא ייעוץ משפטי.)`]);
			const ok = await copyText(act === 'copy' ? `${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il)` : lines.join('\n'));
			toast(root, ok ? 'הועתק.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: act });
		} else if (act === 'grant') {
			track('tool_next_click', { tool_id: TOOL_ID, band: 'grant' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: netoBand(r) });
			if (r.ok && openSimulation(scenarioText(reg, r), 'mediation', b.getAttribute('href'))) { ev.preventDefault(); toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.'); }
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { redraw(s); }
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
