/**
 * The rights wave UI (21.10.2026): the salaried tax-refund calculator (hechzer-mas) on /guide-tax-calculator-updated-2025/.
 * The reader copies Form 106 into one row per tax year; the engine computes each year with its own brackets and points
 * (from the same profile as the credit-points builder). The bracket staircase shows where the income stands on that
 * year's steps; the Form 106 map shows which line each figure comes from and the Form 135 code it goes to. The table,
 * the documents list and the .ics of the deadlines say the same in text, each line with its section.
 */
import { computeRefund, computePoints, profileForm, readProfile, profileState, profileFromState, PROFILE_KEYS, PROFILE_DEFAULT, fmtPts, fmtNis, refundYears, taxYear, yearsRange } from './mas-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'hechzer-mas';
const P = 'jt30';
const POINTS_PATH = '/nekudot-zikui/';

export const EXAMPLE = Object.assign({}, PROFILE_DEFAULT, {
	gender: 'm', marital: 'single', degree: 'ba', degreeYear: 2023, degreeYears: 3,
	rows: [{ y: 2024, income: 105000, tax: 11000, months: 7, emp: 2.25, jobs: 1, coord: false, don: '', life: '', pen: '', pts: '' }],
});

const ROW_FIELDS = ['y', 'income', 'tax', 'months', 'emp', 'jobs', 'coord', 'don', 'life', 'pen', 'pts'];
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const ilsn = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const blankV = (v) => v === '' || v === undefined || v === null;

/* ---------------- Pure renderers ---------------- */

function rowHtml(rt, row, i, count) {
	const f = rt.form106.fields;
	const id = (k) => `${P}-${k}-${i}`;
	const moneyField = (k, label, ph) => `<div class="jtool-field"><label class="jtool-label" for="${id(k)}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${id(k)}" type="text" inputmode="decimal" autocomplete="off" value="${esc(blankV(row[k]) ? '' : money(row[k], Number(row[k]) % 1 ? 2 : 0))}" placeholder="${esc(ph)}" aria-describedby="${id(k)}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${id(k)}-e" role="alert"></p></div>`;
	const numField = (k, label, ph) => `<div class="jtool-field"><label class="jtool-label" for="${id(k)}">${esc(label)}</label><input id="${id(k)}" type="text" inputmode="decimal" autocomplete="off" value="${esc(blankV(row[k]) ? '' : row[k])}" placeholder="${esc(ph)}" aria-describedby="${id(k)}-e"><p class="jtool-error" id="${id(k)}-e" role="alert"></p></div>`;
	const years = refundYears(rt);
	const more = !blankV(row.don) || !blankV(row.life) || !blankV(row.pen) || !blankV(row.pts) || Number(row.jobs) > 1;
	return `<li class="${P}-row" data-row="${i}"><div class="${P}-row__head"><div class="jtool-field"><label class="jtool-label" for="${id('y')}">שנת המס</label><select id="${id('y')}" aria-describedby="${id('y')}-e">${years.slice().reverse().map((y) => `<option value="${y}"${Number(row.y) === y ? ' selected' : ''}>${y}</option>`).join('')}</select><p class="jtool-error" id="${id('y')}-e" role="alert"></p></div>`
		+ (count > 1 ? `<button class="jtool-iconbtn" type="button" data-act="row-del" data-row-del="${i}" aria-label="להסיר את השנה">✕</button>` : '') + '</div>'
		+ `<div class="jtool-row">${moneyField('income', `הכנסה ממשכורת (שדה ${f.salary.field})`, 'לדוגמה: 105,000')}${moneyField('tax', `מס שנוכה (שדה ${f.tax.field})`, 'לדוגמה: 11,000')}</div>`
		+ `<div class="jtool-row">${numField('months', 'חודשי עבודה (מסומנים בראש הטופס)', '12')}${numField('emp', 'נקודות שהמעסיק נתן (חלק ג, סעיף 16)', 'לדוגמה: 2.25')}</div>`
		+ `<details class="jtool-more"${more ? ' open' : ''}><summary>עוד באותה שנה: מעסיק נוסף, תרומות, ביטוח</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${numField('jobs', 'כמה מעסיקים היו בשנה', '1')}<div class="jtool-field"><span class="jtool-label">תיאום מס</span><div class="jtool-chips"><label class="jtool-chip"><input type="checkbox" name="${id('coord')}" value="1"${row.coord ? ' checked' : ''}><span>נעשה תיאום מס</span></label></div></div></div>`
		+ `<div class="jtool-row">${moneyField('don', `תרומות עם קבלה (שדה ${f.donations.field})`, '0')}${moneyField('life', `ביטוח חיים ששילמתם (שדה ${f.life.field})`, '0')}</div>`
		+ `<div class="jtool-row">${moneyField('pen', 'קופת גמל לקצבה, הפקדה עצמית', '0')}${numField('pts', 'נקודות שמגיעות לכם, אם ידוע (ריק = לפי הפרטים למטה)', 'לפי הפרטים')}</div></details></li>`;
}

export function renderForm(reg, input) {
	const rt = reg.rights_tax;
	const rows = Array.isArray(input.rows) && input.rows.length ? input.rows : [{ y: rt.current_year - 1 }];
	return `<fieldset class="jtool-field"><legend>טופס 106 של כל שנה</legend><ol class="${P}-rows" data-rows>${rows.map((row, i) => rowHtml(rt, row, i, rows.length)).join('')}</ol><p class="jtool-error" id="${P}-rows-e" role="alert"></p>`
		+ (rows.length < refundYears(rt).length ? `<button class="jtool-linkbtn" type="button" data-act="row-add">+ להוסיף שנת מס</button>` : '')
		+ `<p class="jtool-hint">שני מעסיקים באותה שנה: מחברים את ההכנסות (${esc(rt.form106.fields.salary.field)}) ואת המס (${esc(rt.form106.fields.tax.field)}) מכל טופסי 106 לשורה אחת. ${esc(rt.form106.two_fields_he)}.</p></fieldset>`
		+ `<details class="jtool-more"${input.marital === 'married' || (input.kids || []).length || input.degree !== 'none' ? ' open' : ''}><summary>הנקודות שמגיעות לכם: מגדר, ילדים, תואר, שירות</summary><div class="${P}-profile">${profileForm(P, rt, input)}</div></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	if (!r.years.length) { return `נשאר למלא את טופס 106 לשנים ${r.pending.join(', ')}: ההכנסה (שדה 158/172) והמס שנוכה (שדה 042).`; }
	const parts = [];
	if (r.total > 0) { parts.push(`לפי החישוב, החזר של ${fmtNis(r.total)}: ${r.years.filter((y) => y.refund > 0).map((y) => `${y.y} ${fmtNis(y.refund)}`).join(', ')}.`); }
	r.years.filter((y) => y.owe > 0).forEach((y) => { parts.push(`ב-${y.y} נוכה פחות מהחבות, ב-${fmtNis(y.owe)}: אין החזר על השנה הזאת.`); });
	r.years.filter((y) => y.refund === 0 && y.owe === 0).forEach((y) => { parts.push(`ב-${y.y} המס שנוכה שווה לחבות: אין החזר.`); });
	if (r.pending.length) { parts.push(`חסר עוד טופס 106 לשנים ${r.pending.join(', ')}.`); }
	return parts.join(' ');
}

/** The staircase: the year's brackets as steps (right to left), the income as a marker, the paid part shaded. */
export function staircase(reg, yr) {
	const rt = reg.rights_tax;
	const row = taxYear(rt, yr.y);
	const W = 420;
	const H = 200;
	const top = 22;
	const base = H - 30;
	const caps = row.brackets.filter((b) => b[0] !== null).map((b) => b[0]);
	const I = yr.income;
	let xmax = caps.find((c) => c >= I * 1.15 && c >= caps[1]) || Math.max(I * 1.2, caps[caps.length - 1] * 1.15);
	if (I > row.surtax.threshold * 0.9) { xmax = Math.max(xmax, row.surtax.threshold * 1.15, I * 1.1); }
	const x = (v) => W - (Math.min(v, xmax) / xmax) * W;
	// The tallest step on screen sets the scale, so the steps the reader stands on are readable.
	let lowCap = 0;
	let maxRate = 0;
	for (const [cap, rate] of row.brackets) { if (lowCap < xmax) { maxRate = rate; } lowCap = cap === null ? Infinity : cap; }
	if (xmax > row.surtax.threshold) { maxRate = 47 + row.surtax.pct; }
	const h = (rate) => (rate / (maxRate * 1.08)) * (base - top);
	let low = 0;
	let rects = '';
	let labels = '';
	for (const [cap, rate] of row.brackets) {
		const hi = cap === null ? xmax : Math.min(cap, xmax);
		if (low >= xmax) { break; }
		const paidTo = Math.min(Math.max(I, low), hi);
		if (paidTo > low) { rects += `<rect class="${P}-st ${P}-st--paid" x="${x(paidTo).toFixed(1)}" y="${(base - h(rate)).toFixed(1)}" width="${(x(low) - x(paidTo)).toFixed(1)}" height="${h(rate).toFixed(1)}"></rect>`; }
		if (hi > paidTo) { rects += `<rect class="${P}-st ${P}-st--free" x="${x(hi).toFixed(1)}" y="${(base - h(rate)).toFixed(1)}" width="${(x(paidTo) - x(hi)).toFixed(1)}" height="${h(rate).toFixed(1)}"></rect>`; }
		const w = x(low) - x(hi);
		if (w > 30) { labels += `<text class="${P}-st__rate" x="${((x(low) + x(hi)) / 2).toFixed(1)}" y="${(base - h(rate) - 6).toFixed(1)}" text-anchor="middle">${rate}%</text>`; }
		if (cap !== null && cap < xmax && w > 46) { labels += `<text class="${P}-st__cap" x="${x(cap).toFixed(1)}" y="${(base + 16).toFixed(1)}" text-anchor="middle">${money(cap, 0)}</text>`; }
		low = hi;
	}
	if (xmax > row.surtax.threshold) {
		const sx = x(row.surtax.threshold);
		rects += `<rect class="${P}-st ${P}-st--surtax" x="0" y="${(base - h(47 + row.surtax.pct)).toFixed(1)}" width="${sx.toFixed(1)}" height="${(h(47 + row.surtax.pct) - h(47)).toFixed(1)}"></rect>`;
		labels += `<text class="${P}-st__rate" x="${(sx / 2).toFixed(1)}" y="${(base - h(50) - 6).toFixed(1)}" text-anchor="middle">+${row.surtax.pct}%</text>`;
	}
	const mx = x(I).toFixed(1);
	const marker = I > 0 ? `<line class="${P}-mark" x1="${mx}" x2="${mx}" y1="${top - 8}" y2="${base}"></line><text class="${P}-mark__t" x="${mx}" y="${top - 12}" text-anchor="${Number(mx) < 60 ? 'start' : Number(mx) > W - 60 ? 'end' : 'middle'}">${money(I, 0)}</text>` : '';
	const g = yr.gross;
	return `<figure class="${P}-stairs"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(`מדרגות המס של ${yr.y}: הכנסה של ${fmtNis(I)}, המדרגה השולית ${g.marginal}%, מס לפני נקודות ${fmtNis(g.total)}`)}" focusable="false">`
		+ `<line class="${P}-axis" x1="0" x2="${W}" y1="${base}" y2="${base}"></line>${rects}${labels}${marker}</svg>`
		+ `<figcaption>מדרגות המס של <bdi>${yr.y}</bdi> (${esc(rt.brackets_section)}), מימין לשמאל. המקווקו מעל ההכנסה שלכם לא חל עליכם; המס לפני נקודות: ${ilsn(g.total)}, המדרגה השולית <bdi>${g.marginal}%</bdi>.</figcaption></figure>`;
}

/** The Form 106 map: the lines the figures come from, with the Form 135 code they go to. */
export function form106Map(reg, yr) {
	const rt = reg.rights_tax;
	const f = rt.form106.fields;
	const months = [];
	for (let m = 1; m <= 12; m += 1) { months.push(`<li class="${P}-m${m <= yr.months ? ` ${P}-m--on` : ''}"><bdi>${m}</bdi></li>`); }
	const line = (where, code, value) => `<div class="${P}-f106__line"><dt>${esc(where)}</dt><dd>${code ? `<span class="${P}-code"><bdi>${esc(code)}</bdi></span>` : ''}<span class="${P}-f106__v">${value}</span></dd></div>`;
	return `<div class="${P}-f106" role="group" aria-label="${esc(`טופס 106 של ${yr.y}: מאיזו שורה כל מספר`)}"><div class="${P}-f106__head"><strong>טופס 106</strong><span>שנת המס <bdi>${yr.y}</bdi></span></div>`
		+ `<div class="${P}-f106__months"><span>${esc(f.months.where)}: ${yr.months} מתוך 12</span><ol aria-hidden="true">${months.join('')}</ol></div>`
		+ `<dl>${line(f.salary.where, f.salary.field, ilsn(yr.income))}${line(f.tax.where, f.tax.field, ilsn(yr.tax))}`
		+ (yr.donation.amount ? line(f.donations.where, f.donations.field, ilsn(yr.donation.amount)) : '')
		+ (yr.life ? line(f.life.where, f.life.field, ilsn(yr.life)) : '')
		+ line(f.points.where, '', yr.emp === null ? 'לא הוזן' : `<bdi>${esc(fmtPts(yr.emp))}</bdi> נקודות`) + '</dl>'
		+ `<p class="${P}-f106__note">הקודים בתיבות הם השדות של הדוח השנתי: אותו מספר נכתב בטופס 135 באותו שדה. ${esc(rt.form106.two_fields_he)}.</p></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	if (!r.years.length) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--info">i ממתין לטופס 106</p><p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p></div>`;
	}
	const rt = reg.rights_tax;
	const main = r.years.slice().sort((a, b) => b.refund - a.refund)[0];
	const flags = main.reasons.filter((x) => x.code !== 'none');
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">`
		+ (r.total > 0 ? `<p class="jtool-state jtool-state--ok">✓ נוכה יותר מהחבות</p>` : `<p class="jtool-state jtool-state--warn">! אין החזר בשנים שהוזנו</p>`)
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}החזר מס לפי החישוב השנתי</p>`
		+ `<strong class="jtool-verdict__figure">${ilsn(r.total)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>מס לפי החוק, ${main.y}</dt><dd>${ilsn(main.liability)}</dd></div><div><dt>נוכה (שדה 042)</dt><dd>${ilsn(main.tax)}</dd></div><div><dt>נקודות</dt><dd><bdi>${esc(fmtPts(main.points))}</bdi> × ${ils(main.pointYear, 0)}</dd></div></dl>`
		+ `<p class="jtool-scope">ההחזר משולם עם הפרשי הצמדה וריבית של <bdi>${rt.refund.interest.pct}%</bdi> לשנה, שלא חושבו כאן (${esc(rt.refund.interest.section)}).</p></div>`
		+ staircase(reg, main) + form106Map(reg, main)
		+ (flags.length ? `<ul class="jtool-flags">${flags.map((x) => `<li>${esc(x.he)}</li>`).join('')}</ul>` : '');
}

export function documentsList(reg, r) {
	const rt = reg.rights_tax;
	const years = r.ok ? r.years.filter((y) => y.refund > 0).map((y) => y.y) : [];
	return [`טופס 135 לכל שנה${years.length ? ` (${years.join(', ')})` : ''}: מקוון באזור האישי, או מודפס למשרד פקיד השומה`].concat(rt.refund.documents);
}

export function renderDetails(reg, r) {
	if (!r.ok || !r.years.length) { return ''; }
	const rt = reg.rights_tax;
	const f = rt.form106.fields;
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-yrs-h">כל שנה עם המדרגות והנקודות שלה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-yrs-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">שנה</th><th scope="col">הכנסה (${esc(f.salary.field)})</th><th scope="col">מס לפי המדרגות</th><th scope="col">נקודות</th><th scope="col">תרומות</th><th scope="col">חבות</th><th scope="col">נוכה (${esc(f.tax.field)})</th><th scope="col">החזר</th></tr></thead><tbody>`
		+ r.years.map((y) => `<tr><td data-th="שנה"><bdi>${y.y}</bdi>${cite('לוח העזר', y.source)}</td><td data-th="הכנסה">${ilsn(y.income)}</td><td data-th="מס לפי המדרגות">${ilsn(y.gross.total)}${y.gross.surtax ? ` (כולל מס נוסף ${ilsn(y.gross.surtax)})` : ''}</td>`
			+ `<td data-th="נקודות"><bdi>${esc(fmtPts(y.points))}</bdi> × ${ils(y.pointYear, 0)} = ${ilsn(y.ptsValue)}${y.unused ? ` (מנוצל ${ilsn(y.ptsCredit)})` : ''}</td><td data-th="תרומות">${y.donation.applied ? ilsn(y.donation.applied) : '—'}</td>`
			+ `<td data-th="חבות">${ilsn(y.liability)}</td><td data-th="נוכה">${ilsn(y.tax)}</td><td data-th="החזר"${y.owe ? ' class="jtool-neg"' : ''}>${y.refund ? ilsn(y.refund) : y.owe ? `חוסר ${ilsn(y.owe)}` : '0'}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="שנה">סך הכול</td><td data-th="הכנסה">—</td><td data-th="מס לפי המדרגות">—</td><td data-th="נקודות">—</td><td data-th="תרומות">—</td><td data-th="חבות">—</td><td data-th="נוכה">—</td><td data-th="החזר">${ilsn(r.total)}</td></tr></tbody>`
		+ `<caption>חבות = מס לפי המדרגות (${esc(rt.brackets_section)}, ${esc(rt.surtax_section)}) פחות נקודות הזיכוי (${esc(rt.point_section)}), אף פעם לא מתחת לאפס, ופחות זיכוי התרומות (${esc(rt.donation.section)}). החזר = מה שנוכה פחות החבות.</caption></table></div></div>`;
	// Why: the reasons, year by year.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-why-h">למה יש (או אין) החזר</h3></div><ul class="jtool-notes" style="padding-top:12px !important">`
		+ r.years.map((y) => (y.reasons.length ? y.reasons : [{ he: 'המעסיק ניכה לפי החבות השנתית: אין הפרש.', section: '', url: '' }]).map((x) => `<li><strong><bdi>${y.y}</bdi>:</strong> ${esc(x.he)}${x.section ? cite(x.section, x.url) : x.url ? cite('מקור', x.url) : ''}</li>`).join('')).join('')
		+ r.years.filter((y) => y.insuranceUpTo > 0).map((y) => `<li><strong><bdi>${y.y}</bdi>:</strong> ביטוח חיים וקופת גמל בהפקדה עצמית: זיכוי אפשרי של עד ${esc(fmtNis(y.insuranceUpTo))}, בתוך התקרות; לא נוסף להחזר. ${esc(rt.insurance.he)}.${cite(rt.insurance.section, rt.law_url)}</li>`).join('')
		+ '</ul></div>';
	// The brackets of the main year, step by step.
	const main = r.years.slice().sort((a, b) => b.refund - a.refund)[0];
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-br-h">המדרגות של ${main.y}, שקל אחרי שקל</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-br-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מדרגה</th><th scope="col">שיעור</th><th scope="col">החלק שלכם</th><th scope="col">מס</th></tr></thead><tbody>`
		+ main.gross.brackets.filter((b) => b.part > 0).map((b) => `<tr><td data-th="מדרגה">${b.to === null ? `מעל ${ils(b.from, 0)}` : `${ils(b.from, 0)} עד ${ils(b.to, 0)}`}</td><td data-th="שיעור"><bdi>${b.rate}%</bdi></td><td data-th="החלק שלכם">${ilsn(b.part)}</td><td data-th="מס">${ilsn(b.tax)}</td></tr>`).join('')
		+ (main.gross.surtax ? `<tr><td data-th="מדרגה">מס נוסף מעל ${ils(taxYear(rt, main.y).surtax.threshold, 0)}</td><td data-th="שיעור"><bdi>${taxYear(rt, main.y).surtax.pct}%</bdi></td><td data-th="החלק שלכם">${ilsn(main.gross.surtaxOver)}</td><td data-th="מס">${ilsn(main.gross.surtax)}</td></tr>` : '')
		+ `<tr class="jtool-table__total"><td data-th="מדרגה">מס לפני נקודות</td><td data-th="שיעור">—</td><td data-th="החלק שלכם">${ilsn(main.income)}</td><td data-th="מס">${ilsn(main.gross.total)}</td></tr></tbody>`
		+ `<caption>${esc(taxYear(rt, main.y).source_he)}${taxYear(rt, main.y).frozen ? `. ${esc(rt.freeze.he)}` : ''}.</caption></table></div></div>`;
	// Next: Form 135, the documents, the deadlines.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-next-h">איך מגישים: טופס 135</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת רשימת המסמכים</button><button class="jtool-btn" type="button" data-act="ics">המועדים ליומן (.ics)</button></div></div>`
		+ `<ol class="jtool-steps"><li>נכנסים לאזור האישי ברשות המסים ופותחים תיק להחזר מס; זה לא פותח תיק פעיל במס הכנסה.${cite('הגשה מקוונת', rt.refund.online_url)}${cite('האזור האישי', rt.refund.personal_url)}</li>`
		+ `<li>ממלאים טופס 135 לכל שנה: ההכנסה בשדה ${esc(f.salary.field)}, המס בשדה ${esc(f.tax.field)}, תרומות ${esc(f.donations.field)}, ומצרפים את המסמכים.${cite('טופס 135', rt.refund.form_url)}${cite('דף השירות', rt.refund.service_url)}</li>`
		+ `<li>מקבלים הודעת שומה, וההחזר מועבר לחשבון הבנק שבטופס.</li></ol>`
		+ `<ul class="jtool-notes">${documentsList(reg, r).map((d) => `<li>${esc(d)}</li>`).join('')}</ul>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-next-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">שנה</th><th scope="col">היום האחרון להגיש</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.years.map((y) => `<tr><td data-th="שנה"><bdi>${y.y}</bdi></td><td data-th="היום האחרון"><bdi>${esc(isoToHe(y.deadline))}</bdi></td><td data-th="הכלל">שש שנים מתום שנת המס${cite(rt.refund.section, rt.law_url)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(rt.refund.interest.he)} (${esc(rt.refund.interest.section)}).</caption></table></div>`
		+ `<p class="${P}-pts"><a href="${esc(POINTS_PATH)}" data-act="points">לבדוק את נקודות הזיכוי לכל שנה</a></p></div>`;
	return out;
}

/** Page section: the annual brackets, the surtax line and the credit point of every year, from the registry. */
export function bracketsTable(reg) {
	const rt = reg.rights_tax;
	const rows = yearsRange(rt).slice().reverse().map((y) => {
		const row = taxYear(rt, y);
		const caps = row.brackets.map((b) => b[0]);
		return `<tr><td data-th="שנה"><bdi>${y}</bdi></td>${[0, 1, 2, 3, 4].map((i) => `<td data-th="${row.brackets[i][1]}% עד">${ils(caps[i], 0)}</td>`).join('')}<td data-th="47% מעל">${ils(caps[4], 0)}</td><td data-th="מס נוסף 3% מעל">${ils(row.surtax.threshold, 0)}</td><td data-th="נקודת זיכוי">${ils(row.point_month, 0)} / ${ils(row.point_year, 0)}</td><td data-th="מקור"><a href="${esc(row.url)}" target="_blank" rel="noopener">${esc(row.source_he)}</a></td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>מדרגות מס הכנסה שנתיות על הכנסה מעבודה, ${rt.first_year} עד ${rt.current_year} (${esc(rt.brackets_section)} ו-${esc(rt.surtax_section)}). 2025 ו-2026 בהקפאה; ב-2026 רווחו מדרגות 20% ו-31%.</caption>`
		+ `<thead><tr><th scope="col">שנה</th><th scope="col">10% עד</th><th scope="col">14% עד</th><th scope="col">20% עד</th><th scope="col">31% עד</th><th scope="col">35% עד</th><th scope="col">47% מעל</th><th scope="col">מס נוסף 3% מעל</th><th scope="col">נקודת זיכוי, חודש / שנה</th><th scope="col">מקור</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const rt = reg.rights_tax;
	const r = computeRefund(reg, EXAMPLE);
	const y = r.years[0];
	const row = taxYear(rt, y.y);
	const b = y.gross.brackets.filter((x) => x.part > 0);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.total,
		sticky: ilsn(r.total),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>שכיר ב-${y.y}, ${y.months} חודשים, הכנסה של ${money(y.income, 0)} ₪ (שדה ${esc(rt.form106.fields.salary.field)}) ומס שנוכה ${money(y.tax, 0)} ₪ (שדה ${esc(rt.form106.fields.tax.field)})${cite('טופס 106', rt.form106.url)}</li>`
			+ `<li>המדרגות של ${y.y}: ${b.map((x) => `${money(x.part, 0)} × ${x.rate}% = ${money(x.tax)}`).join('; ')}; מס לפני נקודות ${money(y.gross.total)} ₪${cite(rt.brackets_section, rt.law_url)}${cite(row.source_he, row.url)}</li>`
			+ `<li>נקודות: 2.25 לתושב ונקודה לתואר ראשון שהסתיים ב-2023 = ${fmtPts(y.points)} × ${money(row.point_year, 0)} ₪ = ${money(y.ptsValue)} ₪; המעסיק נתן ${fmtPts(y.emp)}${cite('סעיפים 34 ו-36', rt.law_url)}${cite(rt.points.degree.sections.ba, rt.law_url)}</li>`
			+ `<li>חבות: ${money(y.gross.total)} − ${money(y.ptsCredit)} = ${money(y.liability)} ₪${cite(rt.point_section, rt.law_url)}</li>`
			+ `<li>החזר: ${money(y.tax, 0)} − ${money(y.liability)} = ${money(y.refund)} ₪, עד ${isoToHe(y.deadline)}${cite(rt.refund.section, rt.law_url)}</li></ol>`,
		compare_table: bracketsTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

const rowState = (row) => ROW_FIELDS.map((k) => (k === 'coord' ? (row.coord ? 1 : '') : blankV(row[k]) ? '' : String(row[k])));
export function stateOf(i) {
	return encodeState(Object.assign({ r: (i.rows || []).map(rowState) }, profileState(i)));
}
export const KEYS = ['r', 'y'].concat(PROFILE_KEYS);
export function inputOf(s) {
	if (!s || (!s.r && !s.G)) { return null; }
	const rows = String(s.r || '').split('~').filter(Boolean).map((x) => x.split('_')).filter((x) => x.length === ROW_FIELDS.length).map((x) => {
		const o = {};
		ROW_FIELDS.forEach((k, j) => { o[k] = k === 'coord' ? x[j] === '1' : x[j] === '' ? '' : Number(x[j]); });
		return o;
	});
	const p = s.G ? profileFromState(s) : Object.assign({}, PROFILE_DEFAULT);
	return Object.assign(p, { rows });
}

function readForm(root) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const p = readProfile(val, on, pick, root.querySelectorAll('[data-kid]').length);
	const m = (id) => { const v = val(id).trim(); return v === '' ? '' : parseMoney(v); };
	const n = (id) => { const v = val(id).trim().replace(/,/g, ''); return v === '' ? '' : Number(v); };
	p.rows = [...root.querySelectorAll('[data-row]')].map((li, i) => ({
		y: Number(val(`y-${i}`)) || '', income: m(`income-${i}`), tax: m(`tax-${i}`), months: n(`months-${i}`), emp: n(`emp-${i}`), jobs: n(`jobs-${i}`),
		coord: Boolean(root.querySelector(`input[name="${P}-coord-${i}"]:checked`)), don: m(`don-${i}`), life: m(`life-${i}`), pen: m(`pen-${i}`), pts: n(`pts-${i}`),
	}));
	return p;
}

const band = (r) => (!r.ok ? 'error' : r.total <= 0 ? 'none' : r.total < 2000 ? 'lt2k' : r.total < 5000 ? '2k-5k' : r.total < 10000 ? '5k-10k' : 'gt10k');

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const rt = reg.rights_tax;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(rt.checked_on, rt.refresh_every_days) || (rt.next_update && today >= rt.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · שנת מס חדשה: ייתכן שהסכומים התעדכנו'); }
	}
	const ids = { degreeYear: 'dgy', degreeYears: 'dgn', maYear: 'may', maYears: 'man', discharge: 'dis', served: 'srv', aliyah: 'aly', reserve: 'res', disabled: 'dsb' };
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
		const single = ((root.querySelector(`input[name="${P}-ms"]:checked`) || {}).value || 'married') === 'single';
		const dg = (root.querySelector(`input[name="${P}-dg"]:checked`) || {}).value || 'none';
		form.querySelectorAll('[data-if-single]').forEach((el) => { el.hidden = !single; });
		form.querySelectorAll('[data-if-married]').forEach((el) => { el.hidden = single; });
		form.querySelectorAll('[data-if-degree]').forEach((el) => { el.hidden = dg === 'none'; });
		form.querySelectorAll('[data-if-ma]').forEach((el) => { el.hidden = !root.querySelector(`input[name="${P}-ma"]:checked`); });
	};
	const run = (input, opts = {}) => {
		const r = computeRefund(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? ilsn(r.total) : '—'; }
		// Every link to the builder carries the profile, so the points there are the reader's own.
		root.querySelectorAll(`a[href*="${POINTS_PATH}"]`).forEach((a) => { a.setAttribute('href', `${a.getAttribute('href').split('#')[0]}#s=${encodeState(profileState(input))}`); });
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: band(r) }); }
		return r;
	};
	const schedule = () => {
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
	let fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash && !fromHash.rows.length) {
		// Sent from the credit-points builder: the years with points above the base wait for their Form 106.
		const pts = computePoints(reg, fromHash);
		const years = pts.ok && pts.missed.length ? pts.missed.map((m) => m.year) : [rt.current_year - 1];
		fromHash.rows = years.map((y) => ({ y, income: '', tax: '', months: '', emp: '', jobs: '', coord: false, don: '', life: '', pen: '', pts: '' }));
	}
	if (fromHash) {
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		redraw(fromHash);
	} else {
		run(readForm(root), { silent: true });
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
		if (act === 'row-add') {
			const used = input.rows.map((x) => Number(x.y));
			const next = refundYears(rt).slice().reverse().find((y) => !used.includes(y));
			if (next) { input.rows.push({ y: next, income: '', tax: '', months: '', emp: '', jobs: '', coord: false, don: '', life: '', pen: '', pts: '' }); }
			redraw(input, `#${P}-income-${input.rows.length - 1}`);
			return;
		}
		if (act === 'row-del') {
			const n = Number(b.getAttribute('data-row-del'));
			input.rows = input.rows.filter((x, i) => i !== n);
			redraw(input, '[data-act="row-add"]');
			return;
		}
		if (act === 'kid-add') { input.kids = input.kids.concat([['', 1]]); redraw(input, `#${P}-kid-${input.kids.length - 1}`); return; }
		if (act === 'kid-del') { const n = Number(b.getAttribute('data-kid-del')); input.kids = input.kids.filter((k, i) => i !== n); redraw(input, '[data-act="kid-add"]'); return; }
		const r = computeRefund(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות, טלפון או שם מעסיק.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי פקודת מס הכנסה ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(rt.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy-list') {
			const ok = await copyText(documentsList(reg, r).map((x, i) => `${i + 1}. ${x}`).join('\n'));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'ics' && r.ok) {
			const evs = r.years.map((y) => ({ date: y.deadline, summary: `החזר מס ${y.y}: היום האחרון להגיש טופס 135`, description: `סעיף 160 לפקודת מס הכנסה: שש שנים מתום שנת המס. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` }));
			download('hechzer-mas.ics', 'text/calendar;charset=utf-8', ics(evs, new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'points') {
			track('tool_next_click', { tool_id: TOOL_ID, band: band(r) });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: band(r) });
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
