/**
 * T03 UI: recuperation pay (דמי הבראה) under the private-sector extension order (HAD-490).
 * Board: https://claude.ai/artifact/759KGxB7GDSy5NHaajW8sJ (Main = T03 at 1280, T03-360, States).
 * Pure renderers write the server snapshot and the live page from the same code.
 */
import { compute } from './havraa-engine.js';
import {
	esc, ils, num, money, amount, parseMoney, isoToHe, encodeState, decodeState, decodeList, csv,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'havraa';
const P = 'jt3';

export const EXAMPLE = { mode: 'year', sector: 'private', years: 4, jobPct: 100, havraaYear: 2026, leaveMonths: 0, lowPay: false };
export const EXAMPLE_PERIOD = { mode: 'period', sector: 'private', start: '2021-03-01', end: '2026-08-31', jobPct: 100, paid: 0, leaves: [], lowPay: false, applyDeduction: true };
const lowOf = (lp, y) => Boolean(lp && (typeof lp === 'object' ? lp[y] : lp));

const fmtDays = (d) => Number(d).toLocaleString('en-US', { maximumFractionDigits: 2 });

function cite(text, href) {
	return ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>`;
}
const orderCite = (reg, text) => cite(text, reg.havraa.order_url);
function priceRow(reg, from) { return reg.havraa.private_rates.find((r) => r.from === from) || reg.havraa.private_rates[0]; }
function priceCite(reg, from) {
	const row = priceRow(reg, from);
	const m = row.source_he.match(/ילקוט הפרסומים (\d+).*?(סעיף \d+)/);
	return cite(m ? `י"פ ${m[1]}, ${m[2]}` : 'מדריך משרד העבודה', row.url);
}
function dedFor(reg, year) { return reg.havraa.deductions.find((d) => d.year === year); }

function toIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += y >= 70 ? 1900 : 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/* ---------------- Pure renderers ---------------- */

function leaveRow(l, i) {
	return `<li class="jtool-rep__row" data-row="${i}">`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-lf-${i}">מתאריך</label><input id="${P}-lf-${i}" type="text" inputmode="numeric" autocomplete="off" data-leave-from value="${esc(isoToHe(l.from || ''))}" placeholder="לדוגמה: 1.1.2024"></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-lt-${i}">עד תאריך</label><input id="${P}-lt-${i}" type="text" inputmode="numeric" autocomplete="off" data-leave-to value="${esc(isoToHe(l.to || ''))}" placeholder="לדוגמה: 31.3.2024"></div>`
		+ `<button class="jtool-iconbtn" type="button" data-remove-leave="${i}" aria-label="מחיקת תקופת חופשה ללא תשלום ${i + 1}">✕</button></li>`;
}

export function renderForm(reg, input) {
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const period = input.mode === 'period';
	const last = Number(reg.havraa.private_rates[reg.havraa.private_rates.length - 1].from.slice(0, 4));
	const years = [last, last - 1, last - 2];
	return `<fieldset class="jtool-field"><legend>מה לחשב</legend><div class="jtool-chips">${chip('mode', 'year', 'כמה מגיע לי השנה', !period)}${chip('mode', 'period', 'עזבתי, או שלא שילמו לי שנים', period)}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>איפה אתם עובדים</legend><div class="jtool-chips">${chip('sector', 'private', 'מגזר פרטי', input.sector !== 'public')}${chip('sector', 'public', 'שירות ציבורי', input.sector === 'public')}</div>`
		+ `<p class="jtool-hint">המחשבון מחשב לפי צו ההרחבה למגזר הפרטי. בשירות הציבורי חלים הסכמים אחרים.</p></fieldset>`
		+ `<div data-mode-year${period ? ' hidden' : ''}>`
		+ `<div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-years">שנים מלאות אצל המעסיק</label><input id="${P}-years" type="text" inputmode="numeric" autocomplete="off" value="${esc(input.years ?? 4)}" aria-describedby="${P}-years-h ${P}-years-e"><p class="jtool-hint" id="${P}-years-h">4 שנים מלאות = אתם בשנת העבודה ה-5</p><p class="jtool-error" id="${P}-years-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-pct">אחוז משרה</label><input id="${P}-pct" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.jobPct ?? 100)}" aria-describedby="${P}-pct-h ${P}-pct-e"><p class="jtool-hint" id="${P}-pct-h">משרה חלקית: חלק יחסי (סעיף 5(ג))</p><p class="jtool-error" id="${P}-pct-e" role="alert"></p></div></div>`
		+ `<fieldset class="jtool-field" style="margin-top:12px"><legend>לאיזו שנת הבראה</legend><div class="jtool-chips">${years.map((y) => chip('year', y, String(y), Number(input.havraaYear || last) === y)).join('')}</div></fieldset>`
		+ `</div>`
		+ `<div data-mode-period${period ? '' : ' hidden'}>`
		+ `<div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-start">התחלתי לעבוד</label><input id="${P}-start" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.start || ''))}" placeholder="לדוגמה: 1.3.2021" aria-describedby="${P}-start-e"><p class="jtool-error" id="${P}-start-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-end">סיימתי לעבוד</label><input id="${P}-end" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.end || ''))}" placeholder="ריק = עדיין עובד/ת" aria-describedby="${P}-end-h ${P}-end-e"><p class="jtool-hint" id="${P}-end-h">עדיין עובדים? השאירו ריק</p><p class="jtool-error" id="${P}-end-e" role="alert"></p></div></div>`
		+ `<div class="jtool-row" style="margin-top:12px"><div class="jtool-field"><label class="jtool-label" for="${P}-ppct">אחוז משרה</label><input id="${P}-ppct" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.jobPct ?? 100)}" aria-describedby="${P}-ppct-e"><p class="jtool-error" id="${P}-ppct-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-paid">כמה שולם כדמי הבראה בתקופה</label><div class="jtool-input jtool-input--money"><input id="${P}-paid" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.paid ? money(input.paid, 0) : '0')}" aria-describedby="${P}-paid-h ${P}-paid-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-hint" id="${P}-paid-h">לפי התלושים. לא יודעים? השאירו 0</p><p class="jtool-error" id="${P}-paid-e" role="alert"></p></div></div>`
		+ `</div>`
		+ `<details class="jtool-more"${lowOf(input.lowPay, 2024) || lowOf(input.lowPay, 2025) || input.leaveMonths || (input.leaves && input.leaves.length) || input.applyDeduction === false ? ' open' : ''}><summary>אפשרויות מתקדמות</summary>`
		+ `<div class="jtool-field" style="margin-top:8px" data-mode-year${period ? ' hidden' : ''}><label class="jtool-label" for="${P}-leave">חודשי חופשה ללא תשלום בשנה הזאת</label><input id="${P}-leave" type="text" inputmode="numeric" autocomplete="off" value="${esc(input.leaveMonths || 0)}" aria-describedby="${P}-leave-h ${P}-leave-e"><p class="jtool-hint" id="${P}-leave-h">לא נספרים לזכאות. חופשת לידה כן נספרת (סעיף 6)</p><p class="jtool-error" id="${P}-leave-e" role="alert"></p></div>`
		+ `<div class="jtool-field" style="margin-top:8px" data-mode-period${period ? '' : ' hidden'}><span class="jtool-label" id="${P}-leaves-l">תקופות של חופשה ללא תשלום (חל"ת)</span><ul class="jtool-rep" aria-labelledby="${P}-leaves-l" data-leaves>${(input.leaves && input.leaves.length ? input.leaves : [{ from: '', to: '' }]).map(leaveRow).join('')}</ul>`
		+ `<button class="jtool-linkbtn" type="button" data-add-leave>+ עוד תקופה</button><p class="jtool-hint">לא נספרות לזכאות (סעיף 6). חופשת לידה כן נספרת, ואין להזין אותה כאן.</p><p class="jtool-error" id="${P}-leaves-e" role="alert"></p></div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('low24', '1', 'שכר נמוך ב-2024 (חצי יום ניכוי)', lowOf(input.lowPay, 2024), 'checkbox')}${chip('low25', '1', 'שכר נמוך ב-2025 (חצי יום ניכוי)', lowOf(input.lowPay, 2025), 'checkbox')}${chip('noded', '1', 'לחשב בלי הניכוי שבחוק', input.applyDeduction === false, 'checkbox')}</div>`
		+ `<p class="jtool-hint">חצי יום: ב-2025 למי ששכרו הממוצע באוקטובר עד דצמבר 2024 לא עלה על ${money(dedFor(reg, 2025).half_salary_max, 0)} ₪; ב-2024 למי שהיה זכאי ל-5 ימים ושכרו בינואר עד מרץ 2024 לא עלה על ${money(dedFor(reg, 2024).half_salary_max, 0)} ₪ (יחסית לאחוז המשרה).</p>`
		+ `</details>`;
}

export function verdictSentence(r) {
	if (r.mode === 'year') {
		if (r.state === 'not_yet') { return `הזכאות מתחילה רק אחרי שנת עבודה מלאה. כשתשלימו אותה מגיעים לכם ${r.full} ימים גם עליה: ${r.full} × ${money(r.price)} = ${money(r.full * r.price)} ₪ במשרה מלאה.`; }
		const head = `בשנת העבודה ה-${r.k} מגיעים ${fmtDays(r.full)} ימי הבראה${r.jobPct !== 100 || r.share !== 1 ? ` (${fmtDays(r.daysDue)} ימים לפי היקף המשרה)` : ''}. כל יום שווה ${money(r.price)} ₪ בשנת ההבראה ${r.year}`;
		return r.deduction
			? `${head}, כלומר ${amount(r.gross)} ₪, פחות ${amount(r.deduction)} ₪ שהחוק ניכה ב-${r.year}: ${amount(r.net)} ₪ לפני מס.`
			: `${head}, כלומר ${amount(r.net)} ₪ לפני מס.`;
	}
	if (r.state === 'not_eligible') { return `עבדתם ${isoToHe(r.start)} עד ${isoToHe(r.end)}, פחות משנה. דמי הבראה מגיעים לפי הצו רק אחרי שהושלמה שנת העבודה הראשונה.`; }
	const span = `${isoToHe(r.start)} עד ${isoToHe(r.end)}`;
	const ded = r.deduction ? `. בניכוי מה שהחוק הוריד ב-2024 וב-2025 (${amount(r.deduction)} ₪)` : '';
	const paid = r.paid ? `, ואחרי ${amount(r.paid)} ₪ ששולמו` : '';
	if (r.state === 'paid') { return `על ${span} מגיעים ${fmtDays(r.daysDue)} ימי הבראה בשווי ${amount(r.net)} ₪, ושולמו ${amount(r.paid)} ₪. לא נשאר חוב.`; }
	return `על ${span} מגיעים ${fmtDays(r.daysDue)} ימי הבראה בשווי ${amount(r.gross)} ₪${ded}${paid}, המעסיק חייב לכם ${amount(r.gap)} ₪.`;
}

export function pathLines(reg, r) {
	const hv = reg.havraa;
	const lines = [];
	if (r.mode === 'year') {
		lines.push(`שנת העבודה ה-${r.k}: ${r.full} ימי הבראה לפי טבלת הוותק${orderCite(reg, 'סעיף 5(א)')}`);
		lines.push(r.state === 'not_yet' ? `הזכאות קמה רק אחרי שהושלמה שנת העבודה הראשונה, ואז גם על החלק היחסי שלה${orderCite(reg, 'סעיף 5(ב)')}` : `הזכאות קיימת כי הושלמה שנת העבודה הראשונה${orderCite(reg, 'סעיף 5(ב)')}`);
		lines.push(`מחיר יום הבראה לשנת ההבראה ${r.year}: <bdi>${money(r.price)}</bdi> ₪${priceCite(reg, r.priceFrom)}`);
		if (r.state === 'not_yet') { return lines; }
		lines.push(`חלקיות: ${money(r.jobPct, 0)}% משרה${r.leave ? `, ${r.leave} חודשי חופשה ללא תשלום לא נספרים` : ''}${orderCite(reg, r.leave ? 'סעיפים 5(ג) ו-6' : 'סעיף 5(ג)')}`);
		lines.push(`<bdi>${fmtDays(r.full)} × ${money(r.price)} × ${money(r.jobPct, 0)}%${r.leave ? ` × ${12 - r.leave}/12` : ''} = ${money(r.gross)}</bdi> ₪`);
		if (r.deduction) {
			const d = dedFor(reg, r.year);
			lines.push(`ניכוי לפי החוק: ${r.half ? 'חצי יום' : 'יום הבראה אחד'}, <bdi>${money(r.deduction)}</bdi> ₪, שהמעסיק מעביר למדינה${cite(`${d.law_he.replace(/, התשפ"[דה]-20\d\d$/, '')}, סעיף 3(א)`, d.url)}`);
		}
		return lines;
	}
	if (r.state === 'not_eligible') {
		lines.push(`העבודה נמשכה פחות משנה. דמי הבראה מגיעים רק אחרי השלמת שנת העבודה הראשונה${orderCite(reg, 'סעיף 5(ב)')}`);
		return lines;
	}
	lines.push(`שנות עבודה מ-<bdi>${isoToHe(r.start)}</bdi>: לכל שנה מספר הימים לפי הוותק באותה שנה (5, 6, 7 ... עד 10)${orderCite(reg, 'סעיף 5(א)')}`);
	lines.push(`משרה של ${money(r.jobPct, 0)}%, ושנה אחרונה חלקית לפי חודשים${orderCite(reg, 'סעיפים 5(ב) ו-5(ג)')}`);
	if (r.leaveMonths) { lines.push(`חופשה ללא תשלום לא נספרת: ${fmtDays(r.leaveMonths)} חודשים ירדו מהשנים שבהן היו${orderCite(reg, 'סעיף 6')}`); }
	lines.push(r.valuation === 'latest'
		? `כל השנים לפי המחיר האחרון שפורסם, <bdi>${money(hv.private_rates[hv.private_rates.length - 1].rate)}</bdi> ₪, בלי ניכוי`
		: `כל שנה לפי מחיר יום ההבראה ב-1 ביולי שבתוכה (התשלום ביוני עד ספטמבר): 378 ₪ משנת 2014, 418 ₪ מ-1.7.2023, ${money(hv.private_rates[hv.private_rates.length - 1].rate)} ₪ לשנת ${hv.private_rates[hv.private_rates.length - 1].from.slice(0, 4)}${orderCite(reg, 'סעיף 5(ד)')}`);
	if (r.deduction) { lines.push(`ב-2024 וב-2025: פחות יום הבראה שהחוק ניכה (${money(r.deduction)} ₪ בסך הכול)${cite('חוקי 2024 ו-2025, סעיפים 3(א) ו-8', dedFor(reg, 2025).url)}`); }
	if (r.flags.some((f) => f.code === 'limitation')) { lines.push(`שנים שמועד התשלום שלהן היה לפני <bdi>${isoToHe(r.limitFrom)}</bdi> לא נכללו: 7 שנות התיישנות ממועד התשלום${cite('חוק ההתיישנות, סעיפים 5(1) ו-6', hv.limitation_url)}`); }
	lines.push(`<bdi>${money(r.gross)}${r.deduction ? ` − ${money(r.deduction)}` : ''}${r.paid ? ` − ${money(r.paid)} ששולמו` : ''} = ${money(r.state === 'paid' ? 0 : r.gap)}</bdi> ₪`);
	return lines;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		const out = r.outOfScope;
		const pub = r.sector === 'public' ? reg.havraa.public_rates.map((p) => `${p.year}: ${money(p.rate)} ₪`).join(' · ') : '';
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state ${out ? 'jtool-state--info' : 'jtool-state--danger'}">${out ? 'מחוץ לתחום של הכלי' : '✕ צריך לתקן את הקלט'}</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p>`
			+ (pub ? `<p class="jtool-scope">להשוואה, ערך יום הבראה בשירות הציבורי: ${pub}. <a href="${esc(reg.havraa.public_rates[0].url)}" target="_blank" rel="noopener">החשב הכללי</a>, <a href="${esc(reg.havraa.public_rates[2].url)}" target="_blank" rel="noopener">משרד החינוך</a>.</p>` : '')
			+ `</div>`;
	}
	let state;
	let label;
	let figure;
	let tiles = [];
	if (r.mode === 'year') {
		if (r.state === 'not_yet') {
			state = '<p class="jtool-state jtool-state--info">עוד לא: השנה הראשונה לא הושלמה</p>';
			label = 'דמי הבראה כרגע';
			figure = ils(0);
		} else {
			state = `<p class="jtool-state jtool-state--ok">✓ זכאים: ${fmtDays(r.daysDue)} ימי הבראה</p>`;
			label = `${opts.example ? 'דוגמה מחושבת: ' : ''}דמי הבראה לשנת ${r.year}${r.jobPct === 100 ? ', משרה מלאה' : `, ${money(r.jobPct, 0)}% משרה`}`;
			figure = ils(r.net);
			tiles = [`<div><dt>ימים</dt><dd><bdi>${fmtDays(r.daysDue)}</bdi></dd></div>`, `<div><dt>מחיר יום</dt><dd>${ils(r.price)}</dd></div>`];
			if (r.deduction) { tiles.push(`<div><dt>ניכוי לפי החוק</dt><dd>${ils(-r.deduction)}</dd></div>`); } else { tiles.push(`<div><dt>אחוז משרה</dt><dd><bdi>${money(r.jobPct, 0)}%</bdi></dd></div>`); }
		}
	} else if (r.state === 'not_eligible') {
		state = '<p class="jtool-state jtool-state--danger">✕ אין זכאות לפי הצו</p>';
		label = `עבודה של פחות משנה`;
		figure = ils(0);
	} else {
		const owed = r.state === 'owed';
		state = owed ? `<p class="jtool-state jtool-state--danger">✕ ${r.paid ? 'לא שולם הכול' : `לא שולמו דמי הבראה ל-${r.years} שנות עבודה`}</p>` : '<p class="jtool-state jtool-state--ok">✓ שולם כל מה שמגיע</p>';
		label = `${opts.example ? 'דוגמה מחושבת: ' : ''}${owed ? 'מגיע לכם' : 'יתרה'}, ${isoToHe(r.start)} עד ${isoToHe(r.end)}`;
		figure = ils(r.gap);
		tiles = [`<div><dt>ימים</dt><dd><bdi>${fmtDays(r.daysDue)}</bdi></dd></div>`, `<div><dt>לפני הניכוי</dt><dd>${ils(r.gross)}</dd></div>`];
		if (r.deduction) { tiles.push(`<div><dt>ניכוי לפי החוק</dt><dd>${ils(-r.deduction)}</dd></div>`); }
		if (r.paid) { tiles.push(`<div><dt>שולם</dt><dd>${ils(-r.paid)}</dd></div>`); }
	}
	const scope = r.mode === 'year'
		? `משולם בדרך כלל באחד מחודשי הקיץ, ${esc(reg.havraa.payment_months_he)} (סעיף 5(ד)). הסכם קיבוצי או חוזה אישי יכולים לתת יותר, לא פחות.`
		: 'כל שנת עבודה חושבה לפי מחיר יום ההבראה ב-1 ביולי שבתוכה. הצו לא קובע באיזה מחיר משלמים שנה שלא שולמה, ולכן למטה גם חישוב לפי המחיר של היום.';
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}<p class="jtool-verdict__label">${esc(label)}</p>`
		+ `<strong class="jtool-verdict__figure">${figure}</strong><p class="jtool-verdict__sentence">${esc(verdictSentence(r))}</p>`
		+ `<p class="jtool-scope">${scope}</p>${tiles.length ? `<dl class="jtool-breakdown">${tiles.join('')}</dl>` : ''}</div>`
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ `<details class="jtool-path" open><summary>איך חישבנו</summary><ol>${pathLines(reg, r).map((l) => `<li>${l}</li>`).join('')}</ol></details>`;
}

export function letterText(reg, r) {
	const rows = r.rows.filter((v) => !v.barred);
	return [
		'לכבוד',
		'[שם המעסיק]',
		'',
		`הנדון: דמי הבראה שלא שולמו, ${isoToHe(r.start)} עד ${isoToHe(r.end)}`,
		'',
		`לפי ${reg.havraa.order_he}, סעיף 5, עובד שהשלים שנת עבודה זכאי לדמי הבראה לפי הוותק, ובמשרה חלקית באופן יחסי.`,
		`בתקופה האמורה ${r.paid ? `שולמו לי ${money(r.paid)} ₪ בלבד` : 'לא שולמו לי דמי הבראה'}.`,
		'',
		'הפירוט:',
		...rows.map((v) => `שנת עבודה ${v.k} (${isoToHe(v.from)} עד ${isoToHe(v.to)}): ${fmtDays(v.daysDue)} ימים × ${money(v.price)} ₪ = ${money(v.gross)} ₪${v.deduction ? `, פחות ${money(v.deduction)} ₪ שנוכו לפי החוק` : ''}`),
		`סך הכול: ${money(r.gross)} ₪${r.deduction ? `, בניכוי ${money(r.deduction)} ₪ לפי חוקי 2024 ו-2025` : ''}${r.paid ? `, פחות ${money(r.paid)} ₪ ששולמו` : ''}: ${money(r.gap)} ₪.`,
		'',
		'אבקש להעביר את הסכום תוך [מספר] ימים.',
		'',
		'בכבוד רב,',
		'[שם העובד]',
		'',
		`(החישוב נעשה ב-jus-tice.co.il לפי צו ההרחבה ומחירי יום ההבראה שנבדקו ב-${isoToHe(reg.havraa.checked_on)}. מידע כללי, לא ייעוץ משפטי.)`,
	].join('\n');
}

export function compareFor(reg, input) {
	if (input.sector === 'public') { return null; }
	if (input.mode === 'period') {
		const latest = reg.havraa.private_rates[reg.havraa.private_rates.length - 1];
		return { input: Object.assign({}, input, { valuation: 'latest' }), label: { title: 'כל השנים לפי מחיר היום', a: 'כל שנה לפי המחיר ב-1 ביולי שבה, בניכוי שבחוק', b: `כל השנים לפי ${money(latest.rate)} ₪, בלי ניכוי`, note: 'איזו דרך נכונה בתביעה שלכם הוא עניין לבית הדין לעבודה או לעורך דין.' } };
	}
	const year = Number(input.havraaYear) || 0;
	const first = Number(reg.havraa.private_rates[0].from.slice(0, 4));
	if (!year || year - 1 < first) { return null; }
	return { input: Object.assign({}, input, { havraaYear: year - 1 }), label: { title: 'אותו ותק בשנה שעברה', a: `${year}`, b: `${year - 1}${dedFor(reg, year - 1) ? ', אחרי ניכוי לפי החוק' : ''}`, note: dedFor(reg, year - 1) ? `ב-${year - 1} המחיר הוקפא והמעסיק ניכה יום הבראה אחד והעביר אותו למדינה.` : '' } };
}

export function renderDetails(reg, r, compareR, compareLabel) {
	if (!r.ok) { return ''; }
	let out = '';
	if (r.mode === 'period' && r.rows && r.rows.length) {
		const rows = r.rows.map((v) => `<tr${v.barred ? ' class="jtool-muted"' : ''}><td data-th="שנת עבודה">${v.k}</td><td data-th="תקופה">${isoToHe(v.from)} עד ${isoToHe(v.to)}</td><td data-th="ימים בטבלה">${v.full}</td>`
			+ `<td data-th="חלק מהשנה">${v.fraction === 1 && !v.leave ? 'מלאה' : `${fmtDays(Math.round((v.fraction * 12 - v.leave) * 100) / 100)} מתוך 12 חודשים${v.leave ? ` (חל"ת ${fmtDays(Math.round(v.leave * 100) / 100)})` : ''}`}</td><td data-th="ימי הבראה">${fmtDays(v.daysDue)}</td>`
			+ `<td data-th="מחיר יום">${num(v.price)}</td><td data-th="סכום">${num(v.gross)}</td>`
			+ `<td data-th="ניכוי לפי החוק"${v.deduction ? ' class="jtool-neg"' : ''}>${v.deduction ? num(-v.deduction) : '0.00'}</td>`
			+ `<td data-th="מגיע">${v.barred ? 'מחוץ לתקופה' : num(v.net)}</td></tr>`).join('');
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-table-h">שנה אחרי שנה</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="csv">הורדת CSV</button><button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-table-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">שנת עבודה</th><th scope="col">תקופה</th><th scope="col">ימים בטבלה</th><th scope="col">חלק מהשנה</th><th scope="col">ימי הבראה</th><th scope="col">מחיר יום</th><th scope="col">סכום</th><th scope="col">ניכוי לפי החוק</th><th scope="col">מגיע</th></tr></thead>`
			+ `<tbody>${rows}<tr class="jtool-table__total"><td data-th="סך הכול" colspan="4">סך הכול</td><td data-th="ימי הבראה">${fmtDays(r.daysDue)}</td><td data-th=""></td><td data-th="סכום">${num(r.gross)}</td><td data-th="ניכוי">${num(-r.deduction)}</td><td data-th="מגיע">${num(r.net)}</td></tr></tbody>`
			+ `<caption>ימים לפי ותק: ${esc(reg.havraa.order_he)}, סעיף 5(א). מחירים: ${reg.havraa.private_rates.map((p) => `${money(p.rate)} ₪ ${esc(p.label_he)}`).join(', ')}. נבדק ${isoToHe(reg.havraa.checked_on)}. חישוב כללי, לא ייעוץ משפטי.</caption></table></div></div>`;
	}
	if (compareR && compareR.ok && compareLabel) {
		const a = r.mode === 'period' ? r.gap : r.net;
		const b = compareR.mode === 'period' ? compareR.gap : compareR.net;
		const delta = Math.round((a - b) * 100) / 100;
		out += `<div class="jtool-compare" data-compare><h3>מה אם: ${esc(compareLabel.title)}</h3><div class="jtool-compare__grid">`
			+ `<div class="jtool-compare__col"><p>א. ${esc(compareLabel.a)}</p><strong>${ils(a)}</strong></div>`
			+ `<div class="jtool-compare__col jtool-compare__col--b"><p>ב. ${esc(compareLabel.b)}</p><strong>${ils(b)}</strong></div></div>`
			+ `<p class="jtool-delta">ההפרש: ${ils(Math.abs(delta))}. ${esc(compareLabel.note)}</p></div>`;
	}
	if (r.mode === 'period' && r.state === 'owed') {
		out += `<div class="jtool-tablewrap" data-letter><div class="jtool-tablewrap__head"><h3 id="${P}-letter-h">מכתב דרישה למעסיק (טיוטה)</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="letter-copy">העתקת המכתב</button></div></div>`
			+ `<pre class="jtool-letter">${esc(letterText(reg, r))}</pre></div>`;
	}
	return out;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const cmp = compareFor(reg, EXAMPLE);
	const c = cmp ? compute(reg, cmp.input) : null;
	const p = compute(reg, EXAMPLE_PERIOD);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.net,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, c, cmp ? cmp.label : null),
		method: `<ol>${pathLines(reg, p).map((l) => `<li>${l}</li>`).join('')}</ol>`,
		method_table: renderDetails(reg, p, null, null).replace(/<div class="jtool-tablewrap" data-letter>[\s\S]*$/, '').replace(/ data-act="[a-z-]+"/g, '').replace(new RegExp(`${P}-table-h`, 'g'), `${P}-method-table-h`),
		sentence: verdictSentence(p),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	const mode = checked('mode') || 'year';
	const pctText = val(mode === 'period' ? `#${P}-ppct` : `#${P}-pct`);
	return {
		mode, sector: checked('sector') || 'private',
		years: val(`#${P}-years`).trim() === '' ? NaN : Number(val(`#${P}-years`).trim()),
		jobPct: pctText.trim() === '' ? 100 : parseMoney(pctText.replace(/%/g, '')), havraaYear: Number(checked('year')) || undefined,
		leaveMonths: Number(val(`#${P}-leave`)) || 0,
		start: toIso(val(`#${P}-start`)), end: toIso(val(`#${P}-end`)), paid: val(`#${P}-paid`).trim() === '' ? 0 : parseMoney(val(`#${P}-paid`)),
		leaves: [...root.querySelectorAll('[data-leaves] li')].map((li) => ({ from: toIso(li.querySelector('[data-leave-from]').value.trim()), to: toIso(li.querySelector('[data-leave-to]').value.trim()) })),
		lowPay: { 2024: Boolean(checked('low24')), 2025: Boolean(checked('low25')) }, applyDeduction: !checked('noded'),
	};
}

const stateOf = (i) => encodeState({
	m: i.mode === 'period' ? 'p' : 'y', c: i.sector === 'public' ? 'pub' : '', j: i.jobPct === 100 ? '' : i.jobPct,
	y: i.mode === 'period' ? '' : i.years, h: i.mode === 'period' ? '' : i.havraaYear, l: i.leaveMonths || '',
	s: i.mode === 'period' ? i.start : '', e: i.mode === 'period' ? i.end : '', p: i.mode === 'period' && i.paid ? i.paid : '',
	w: `${lowOf(i.lowPay, 2024) ? '4' : ''}${lowOf(i.lowPay, 2025) ? '5' : ''}`, d: i.applyDeduction === false ? 0 : '',
	v: i.mode === 'period' ? (i.leaves || []).filter((l) => l.from && l.to).map((l) => [l.from, l.to]) : '',
});
const KEYS = ['m', 'c', 'j', 'y', 'h', 'l', 's', 'e', 'p', 'w', 'd', 'v'];
function inputOf(s) {
	if (!s.m) { return null; }
	const period = s.m === 'p';
	return {
		mode: period ? 'period' : 'year', sector: s.c === 'pub' ? 'public' : 'private', jobPct: Number(s.j) || 100,
		years: s.y === undefined ? 4 : Number(s.y), havraaYear: Number(s.h) || undefined, leaveMonths: Number(s.l) || 0,
		start: s.s || '', end: s.e || '', paid: Number(s.p) || 0, applyDeduction: s.d !== '0',
		lowPay: { 2024: /4/.test(s.w || ''), 2025: /5/.test(s.w || '') },
		leaves: decodeList(s.v).map(([from, to]) => ({ from, to })),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const today = ilToday(); // the Israel civil date, not UTC (HAD-502)
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(reg.havraa.checked_on, reg.havraa.refresh_every_days)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהנתונים התעדכנו'); }
	}
	const showErrors = (r, input) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok || r.outOfScope) { return; }
		const map = { years: 'years', jobPct: input.mode === 'period' ? 'ppct' : 'pct', leave: 'leave', leaves: 'leaves', start: 'start', end: 'end', paid: 'paid' };
		for (const e of r.errors) {
			const key = map[e.field];
			const box = key && root.querySelector(`#${P}-${key}-e`);
			if (box) { box.textContent = e.he; }
			const f = key && root.querySelector(`#${P}-${key}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const run = (input, opts = {}) => {
		const full = Object.assign({}, input, { asOf: today });
		const r = compute(reg, full);
		const cmp = r.ok ? compareFor(reg, full) : null;
		const c = cmp ? compute(reg, cmp.input) : null;
		showErrors(r, input);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, c, cmp ? cmp.label : null);
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.mode === 'period' ? r.gap : r.net) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.mode === 'period' ? r.state : `year_${r.state}` }); }
		if (!r.ok && r.outOfScope) { track('tool_out_of_scope', { tool_id: TOOL_ID }); }
	};
	const toggle = () => {
		const period = (root.querySelector(`input[name="${P}-mode"]:checked`) || {}).value === 'period';
		form.querySelectorAll('[data-mode-year]').forEach((el) => { el.hidden = period; });
		form.querySelectorAll('[data-mode-period]').forEach((el) => { el.hidden = !period; });
	};
	const schedule = (ev) => {
		if (ev && ev.target && ev.target.name === `${P}-mode`) { toggle(); }
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => run(readForm(root)), 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	}
	const saved = store.get('jtool-havraa');
	if (saved && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const add = ev.target.closest('[data-add-leave]');
		const del = ev.target.closest('[data-remove-leave]');
		if (add || del) {
			const list = root.querySelector('[data-leaves]');
			const rows = [...list.querySelectorAll('li')].map((li) => ({ from: toIso(li.querySelector('[data-leave-from]').value.trim()), to: toIso(li.querySelector('[data-leave-to]').value.trim()) }));
			if (add) { rows.push({ from: '', to: '' }); } else { rows.splice(Number(del.getAttribute('data-remove-leave')), 1); }
			list.innerHTML = (rows.length ? rows : [{ from: '', to: '' }]).map(leaveRow).join('');
			const focus = list.querySelector(add ? 'li:last-child [data-leave-from]' : '[data-leave-from]');
			if (focus) { focus.focus(); }
			schedule();
			return;
		}
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		// Wave 4 (HAD-502): run a pending debounce now and act on a fresh compute, never the last debounced result.
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, Object.assign({}, input, { asOf: today }));
		const link = shareUrl(stateOf(input));
		if (act === 'csv' && r.ok && r.mode === 'period') {
			const head = ['שנת עבודה', 'מתאריך', 'עד תאריך', 'ימים בטבלה', 'חלק מהשנה', 'ימים', 'מחיר יום', 'סכום', 'ניכוי לפי החוק', 'מגיע'];
			const body = r.rows.map((v) => [v.k, isoToHe(v.from), isoToHe(v.to), v.full, v.fraction, v.daysDue, v.price, v.gross.toFixed(2), v.deduction.toFixed(2), v.barred ? 'מחוץ לתקופה' : v.net.toFixed(2)]);
			body.push(['סך הכול', '', '', '', '', r.daysDue, '', r.gross.toFixed(2), r.deduction.toFixed(2), r.net.toFixed(2)]);
			body.push(['שולם', '', '', '', '', '', '', '', '', r.paid.toFixed(2)], ['יתרה', '', '', '', '', '', '', '', '', r.gap.toFixed(2)]);
			body.push([`מקור: ${reg.havraa.order_he}; מחירים לפי צווי ההרחבה; נבדק ${isoToHe(reg.havraa.checked_on)}. חישוב כללי, לא ייעוץ משפטי.`]);
			download('dmei-havraa.csv', 'text/csv;charset=utf-8', csv([head, ...body]));
			track('tool_download', { tool_id: TOOL_ID, type: 'csv' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שם, תעודת זהות, טלפון או שם המעסיק.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(r)} · חושב ב-jus-tice.co.il לפי צו ההרחבה לדמי הבראה (נתונים מ-${isoToHe(reg.havraa.checked_on)}) ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(r)} (חושב ב-jus-tice.co.il, ${isoToHe(reg.havraa.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'letter' || act === 'letter-copy') {
			if (!(r.ok && r.mode === 'period' && r.state === 'owed')) {
				const tab = root.querySelector(`input[name="${P}-mode"][value="period"]`);
				if (tab && !tab.checked) { tab.checked = true; toggle(); run(readForm(root)); }
				toast(root, 'כדי להפיק מכתב: מלאו את תאריכי העבודה ואת מה ששולם.');
				const f = root.querySelector(`#${P}-start`);
				if (f) { f.focus(); }
				return;
			}
			const box = root.querySelector('[data-letter]');
			if (box) { box.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
			if (act === 'letter-copy') {
				const ok = await copyText(letterText(reg, r));
				toast(root, ok ? 'המכתב הועתק. השלימו את השמות לפני השליחה.' : 'לא הצלחנו להעתיק.');
			}
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'save') {
			store.set('jtool-havraa', stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get('jtool-havraa') || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, s); run(s); }
		} else if (act === 'clear') {
			store.clear('jtool-havraa');
			toast(root, 'נמחק מהמכשיר.');
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
