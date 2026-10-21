/**
 * The parenting-time planner on /child-custody/ (HAD-579): a school wall planner of the year (navy = parent A, pale green
 * = B, vacations ruled with their names), the age rules, the support band of /child-support/, the scenario, next steps.
 */
import { compute, MM_TEMPLATES, MM_DAYS, mmNights, mmCompare, mmBreaks } from './mishmoret-engine.js';
import { parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'mishmoret';
const MMP = 'jt41';
export const EXAMPLE = {
	parentA: 'אבא', children: ['2022-03-01', '2017-06-01'], template: 'two_two_five', custom: [], start: '2026-11-01',
	stage: 'k6', holidays: 'halves', firstA: true, incomeA: 14000, incomeB: 9000, housingA: 4500, housingB: 5000,
};
const MM_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=divorce';
const MM_RULE_HE = { halves: 'חופשות ארוכות חצי-חצי, קצרות לסירוגין', alternate: 'כל חופשה שלמה להורה אחד, לסירוגין', none: 'בלי חלוקה: הלוח הקבוע ממשיך' };
const MM_SHORT = { rh: 'ראש השנה', tishrei: 'כיפור וסוכות', hanukkah: 'חנוכה', purim: 'פורים', pesach: 'פסח', indep: 'עצמאות', shavuot: 'שבועות', summer: 'החופש הגדול' };
const MM_MONTHS = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'];
const MM_MONTHS_SHORT = ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳'];
const MM_DAY_LETTERS = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'];
const MM_TPL_CODE = { weekends_eve: 'e', weekends_mid: 'm', weekends_2mid: 'w', two_two_three: 't', two_two_five: 'f', three_four: 'h', week_week: 'k', custom: 'c' };

const mmWho = (x, parentA) => (x === 'A' ? (parentA === 'אמא' ? 'האם' : 'האב') : (parentA === 'אמא' ? 'האב' : 'האם'));
const mmShortWho = (x, parentA) => (mmWho(x, parentA) === 'האב' ? 'אב' : 'אם');
/** "pays" in the payer's own gender: the parents are named, so no slash form is needed. */
const mmPays = (name) => (name === 'האם' ? 'משלמת' : 'משלם');
const mmNis = (n) => `${money(n, 0)} ₪`;
const mmV0 = (x) => (x === '' || x === undefined || x === null ? '' : x);
const mmAddDay = (iso, n) => new Date(Date.parse(`${iso}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);
function mmCite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ` <span class="jtool-cite">${esc(text)}</span>`; }
const mmChip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${MMP}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const mmTplShort = (key) => MM_TEMPLATES[key].he.split(':')[0];

/* ---------------- Pure renderers ---------------- */

function mmMoneyField(id, label, v, hint) {
	return `<div class="jtool-field"><label class="jtool-label" for="${MMP}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${MMP}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(mmV0(v) === '' ? '' : money(v, Number(v) % 1 ? 2 : 0))}" placeholder="0" aria-describedby="${MMP}-${id}-e${hint ? ` ${MMP}-${id}-h` : ''}"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>${hint ? `<p class="jtool-hint" id="${MMP}-${id}-h">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${MMP}-${id}-e" role="alert"></p></div>`;
}
function mmKidRow(b, i) {
	return `<li class="jtool-rep__row ${MMP}-kid" data-kid="${i}"><div class="jtool-field"><label class="jtool-label" for="${MMP}-kid-${i}">ילד/ה ${i + 1}: תאריך לידה</label><input id="${MMP}-kid-${i}" type="text" inputmode="numeric" autocomplete="off" value="${esc(b ? isoToHe(b) : '')}" placeholder="לדוגמה: 1.6.2017" aria-describedby="${MMP}-kid-${i}-e"><p class="jtool-error" id="${MMP}-kid-${i}-e" role="alert"></p></div>`
		+ `<button class="jtool-iconbtn" type="button" data-remove-kid="${i}" aria-label="מחיקת ילד/ה ${i + 1}">✕</button></li>`;
}

/** The fortnight as a board: in "custom" every night is a button that moves it to the other parent. */
export function board(m, nights) {
	const custom = m.template === 'custom';
	const cell = (x, i) => {
		const label = `${MM_DAYS[i % 7]}, שבוע ${i < 7 ? 1 : 2}: ${mmWho(x, m.parentA)}`;
		return custom
			? `<button type="button" class="${MMP}-n ${MMP}-n--${x.toLowerCase()}" data-night="${i}" aria-pressed="${x === 'A'}" aria-label="${esc(label)}">${esc(mmShortWho(x, m.parentA))}</button>`
			: `<span class="${MMP}-n ${MMP}-n--${x.toLowerCase()}" role="img" aria-label="${esc(label)}">${esc(mmShortWho(x, m.parentA))}</span>`;
	};
	return `<div class="${MMP}-board" role="group" aria-label="השבועיים של ההסדר, לילה אחרי לילה">`
		+ `<div class="${MMP}-board__days" aria-hidden="true"><span></span>${MM_DAY_LETTERS.map((d) => `<span>${esc(d)}</span>`).join('')}</div>`
		+ [0, 1].map((w) => `<div class="${MMP}-board__wk"><span class="${MMP}-board__w">שבוע ${w + 1}</span>${nights.slice(w * 7, w * 7 + 7).map((x, i) => cell(x, w * 7 + i)).join('')}</div>`).join('')
		+ `<p class="${MMP}-board__k">${custom ? 'לוחצים על לילה כדי להעביר אותו להורה השני. ' : ''}${esc(mmWho('A', m.parentA))}: <bdi>${nights.filter((x) => x === 'A').length}</bdi> מתוך 14 לילות.</p></div>`;
}

export function renderForm(reg, m) {
	const fl = reg.fl_mishmoret;
	const n = { A: mmWho('A', m.parentA), B: mmWho('B', m.parentA) };
	const nights = mmNights(m.template, m.custom);
	return `<fieldset class="jtool-field"><legend>הורה א' (הלוח סופר לו את הלילות)</legend><div class="jtool-chips">${mmChip('pa', 'אבא', 'אבא', m.parentA !== 'אמא')}${mmChip('pa', 'אמא', 'אמא', m.parentA === 'אמא')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>ההסדר</legend><div class="jtool-chips ${MMP}-tpls">${Object.entries(MM_TEMPLATES).map(([k, v]) => mmChip('tpl', k, v.chip, (m.template || 'two_two_five') === k)).join('')}</div><p class="jtool-hint">${esc(reg.divorce_agreement.schedule_he)}.</p><p class="jtool-error" id="${MMP}-custom-e" role="alert"></p></fieldset>`
		+ `<div class="jtool-field" data-jt41-board>${board(m, nights)}</div>`
		+ `<div class="jtool-field"><span class="jtool-label" id="${MMP}-kids-l">הילדים</span><ul class="jtool-rep" aria-labelledby="${MMP}-kids-l" data-kids>${(m.children || []).map(mmKidRow).join('')}</ul><button class="jtool-linkbtn" type="button" data-add-kid>+ עוד ילד/ה</button><p class="jtool-error" id="${MMP}-children-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${MMP}-start">הלוח מתחיל ביום ראשון</label><input id="${MMP}-start" type="text" inputmode="numeric" autocomplete="off" value="${esc(m.start ? isoToHe(m.start) : '')}" placeholder="לדוגמה: 1.11.2026" aria-describedby="${MMP}-start-e"><p class="jtool-error" id="${MMP}-start-e" role="alert"></p></div>`
		+ `<details class="jtool-more ${MMP}-more"${m.stage === 'mid' || m.stage === 'high' || m.holidays === 'alternate' || m.holidays === 'none' || m.firstA === false ? ' open' : ''}><summary>חופשות בית הספר: מי לוקח מה (${esc(MM_RULE_HE[m.holidays || 'halves'])})</summary>`
		+ `<fieldset class="jtool-field"><legend>לוח החופשות של משרד החינוך, ${esc(fl.school_year.he)}</legend><div class="jtool-chips">${Object.entries(fl.stages).map(([k, v]) => mmChip('stage', k, v.he, (m.stage || 'k6') === k)).join('')}</div><p class="jtool-hint">${esc(fl.school_year.sector_he)}. ${esc(fl.school_year.maonot_he)}.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>חופשות בית הספר</legend><div class="jtool-chips">${['halves', 'alternate', 'none'].map((k) => mmChip('hol', k, MM_RULE_HE[k], (m.holidays || 'halves') === k)).join('')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${mmChip('fa', '1', `החופשה הראשונה של השנה אצל ${n.A}`, m.firstA !== false, 'checkbox')}</div><p class="jtool-hint">${esc(fl.template.he)}. ${esc(fl.template.halves_he)}.</p></fieldset></details>`
		+ `<details class="jtool-more ${MMP}-more"><summary>הכנסות ודיור, בשביל המזונות (לא חובה)</summary><fieldset class="jtool-field ${MMP}-money"><legend class="${MMP}-sr">הכנסות ודיור</legend>`
		+ `<div class="jtool-row">${mmMoneyField('ia', `הכנסה נטו של ${n.A}`, m.incomeA, 'מכל המקורות, לחודש')}${mmMoneyField('ib', `הכנסה נטו של ${n.B}`, m.incomeB, 'מכל המקורות, לחודש')}</div>`
		+ `<div class="jtool-row">${mmMoneyField('ha', `דיור של ${n.A}`, m.housingA, 'שכירות או משכנתא')}${mmMoneyField('hb', `דיור של ${n.B}`, m.housingB, 'שכירות או משכנתא')}</div>`
		+ `<p class="jtool-hint">הסכומים של הדוגמה במחשבון המזונות. מוחקים את ההכנסות כדי לראות רק את הלוח.</p></fieldset></details>`;
}

/** The year as a school wall planner: month rows of nights, the vacations ruled under them, a notch on handovers. */
export function ribbon(r) {
	const A = mmWho('A', r.parentA);
	const B = mmWho('B', r.parentA);
	const rows = r.months.map((mo) => {
		const [y, mm] = mo.key.split('-').map(Number);
		const cells = mo.days.map((d, i) => `<i class="${MMP}-d ${MMP}-${d.who.toLowerCase()}${d.hol ? ` ${MMP}-h` : ''}${d.handover ? ` ${MMP}-x` : ''}"${i === 0 && mo.first > 1 ? ` style="grid-column-start:${mo.first}"` : ''}></i>`).join('');
		const spans = [];
		for (const d of mo.days) {
			const day = Number(d.iso.slice(8, 10));
			const last = spans[spans.length - 1];
			if (d.hol && last && last.key === d.hol && last.to === day - 1) { last.to = day; } else if (d.hol) { spans.push({ key: d.hol, from: day, to: day }); }
		}
		// The name only where it has room (3 nights or more).
		const labels = spans.map((s) => `<b class="${MMP}-hl" style="grid-column:${s.from} / ${s.to + 1}">${s.to - s.from >= 2 ? esc(MM_SHORT[s.key] || '') : ''}</b>`).join('');
		return `<div class="${MMP}-row"><span class="${MMP}-row__m">${esc(MM_MONTHS_SHORT[mm - 1])} ${String(y).slice(2)}</span><span class="${MMP}-row__g">${cells}${labels}</span></div>`;
	}).join('');
	const sr = r.months.map((mo) => {
		const [y, mm] = mo.key.split('-').map(Number);
		return `<li>${esc(MM_MONTHS[mm - 1])} ${y}: ${mo.a} לילות אצל ${esc(A)}, ${mo.b} אצל ${esc(B)}${mo.hol.length ? `; חופשה: ${esc(mo.hol.map((k) => MM_SHORT[k]).join(', '))}` : ''}.</li>`;
	}).join('');
	return `<figure class="${MMP}-ribbon">`
		+ `<figcaption class="${MMP}-ribbon__h">12 החודשים, לילה אחרי לילה, מ-<bdi>${esc(isoToHe(r.year.from))}</bdi> עד <bdi>${esc(isoToHe(r.year.to))}</bdi></figcaption>`
		+ `<div class="${MMP}-share" aria-hidden="true"><i class="${MMP}-share__a" style="width:${r.year.aPct}%"><bdi>${r.year.aPct}%</bdi></i><i class="${MMP}-share__b"><bdi>${r.year.bPct}%</bdi></i></div>`
		+ `<div class="${MMP}-rows" aria-hidden="true">${rows}</div>`
		+ `<ul class="${MMP}-sr">${sr}</ul>`
		+ `<p class="${MMP}-legend"><span><i class="${MMP}-k ${MMP}-k--a"></i>${esc(A)}: <bdi>${r.year.a}</bdi> לילות</span><span><i class="${MMP}-k ${MMP}-k--b"></i>${esc(B)}: <bdi>${r.year.b}</bdi> לילות</span><span><i class="${MMP}-k ${MMP}-k--h"></i>חופשת בית ספר</span><span><i class="${MMP}-k ${MMP}-k--x"></i>יום מעבר: <bdi>${r.handovers.length}</bdi> בשנה</span></p></figure>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const A = mmWho('A', r.parentA);
	const B = mmWho('B', r.parentA);
	const eve = r.evenings.length ? `, ועוד ${r.evenings.length} ערבים בלי לינה אצל ${A}` : '';
	return `ב-12 החודשים מ-${isoToHe(r.year.from)}: ${r.year.a} לילות אצל ${A} (${r.year.aPct}%) ו-${r.year.b} אצל ${B}${eve}; בממוצע ${r.nights14} לילות מתוך 14 אצל ${A}, ו-${r.handovers.length} מעברים בין הבתים. חופשות בית הספר לפי לוח משרד החינוך: ${MM_RULE_HE[r.rule]}, ${r.year.shiftedToA + r.year.shiftedToB} לילות עוברים בגללן להורה השני.`;
}

const MM_BRACKET = {
	under6: (cs) => [`מזונות: עד גיל ${cs.ages.father_only_to} אב יהודי חב לבדו בצרכים ההכרחיים; מה שמעבר להם, לפי יחס ההכנסות`, cs.ruling.paras.under6],
	'6to15': (cs) => [`מזונות: בגילאי ${cs.ages.father_only_to} עד ${cs.ages.equal_from} שני ההורים חבים, לפי היכולת הכלכלית היחסית ולפי חלוקת המשמורת בפועל`, 'ההכרעה'],
	'15to18': (cs) => [`מזונות: מגיל ${cs.ages.equal_from} עד ${cs.ages.adult} שני ההורים במידה שווה`, cs.ruling.paras.over15],
};
const MM_MILE = {
	six: (fl) => `סוף חזקת הגיל הרך (${fl.law.sections.no_agreement}); בית המשפט שומע את הילד (${fl.child_heard.sections.age}); במזונות, שני ההורים לפי יכולתם (בע"מ 919/15)`,
	fifteen: () => 'במזונות: שני ההורים במידה שווה (בע"מ 919/15)',
	adult: (fl) => `בגיר (${fl.law.sections.minor} לחוק הכשרות): ההסדר לקטינים מסתיים`,
};

/** Every child: the rules on the plan's first day, each with its section, and the next birthday that changes them. */
export function agesBlock(reg, r) {
	const fl = reg.fl_mishmoret;
	const cs = reg.child_support;
	const items = r.kids.map((k) => {
		if (!k.minor) { return `<li class="${MMP}-kid"><strong>ילד/ה ${k.idx + 1}, בן/בת ${k.age}</strong><p>${esc(fl.law.minor_he)}.${mmCite(fl.law.sections.minor, fl.law.url)}</p></li>`; }
		const rules = [];
		if (k.tender) { rules.push(`<li>חזקת הגיל הרך: ${esc(fl.law.no_agreement_he.replace(/ \(סעיף 25\)$/, ''))}; בהסכם אפשר הסדר אחר, באישור בית המשפט.${mmCite(fl.law.sections.no_agreement, fl.law.url)}${mmCite(fl.law.sections.agreement, fl.law.url)}</li>`); }
		rules.push(k.heard
			? `<li>שמיעת הילד: בבית המשפט נשמעים ילדים מגיל ${fl.child_heard.from_age}, והדעה שלו מקבלת משקל לפי גילו ובגרותו.${mmCite(fl.child_heard.sections.age, fl.child_heard.url)}${mmCite(fl.child_heard.sections.right, fl.child_heard.url)}</li>`
			: `<li>שמיעת הילד: לפני גיל ${fl.child_heard.from_age} רק אם בית המשפט רואה לנכון, למשל כשאחים גדולים נשמעים.${mmCite(fl.child_heard.sections.age, fl.child_heard.url)}</li>`);
		const br = MM_BRACKET[k.bracket](cs);
		rules.push(`<li>${esc(br[0])}.${mmCite(br[1], cs.ruling.url)}</li>`);
		const next = k.milestones[0];
		return `<li class="${MMP}-kid"><strong>ילד/ה ${k.idx + 1}, בן/בת ${k.age}</strong><ul>${rules.join('')}</ul>`
			+ (next ? `<p class="${MMP}-kid__next">ב-<bdi>${esc(isoToHe(next.date))}</bdi>, בגיל ${next.years}: ${esc(MM_MILE[next.key](fl))}.</p>` : '') + '</li>';
	}).join('');
	return `<section class="${MMP}-ages" aria-labelledby="${MMP}-ages-h"><h4 id="${MMP}-ages-h">כללי הגיל, לכל ילד</h4><ol class="${MMP}-kids">${items}</ol>`
		+ `<p class="jtool-hint">${esc(fl.law.natural_he)}.${mmCite(fl.law.sections.natural, fl.law.url)} ${esc(fl.welfare.report_he.replace(/ \(סעיף 2\)$/, ''))}; ${esc(fl.welfare.parties_he.replace(/ \(סעיף 4\)$/, ''))}.${mmCite(fl.welfare.sections.report, fl.welfare.url)}${mmCite(fl.welfare.sections.parties, fl.welfare.url)}</p></section>`;
}

/** The link that opens /child-support/ with the same family and the plan's nights (the tool's own #s= state). */
export function supportLink(r) {
	if (!r.support) { return '/child-support/'; }
	const s = r.support.input;
	const state = encodeState({
		o: 'c', p: r.parentA === 'אמא' ? 'm' : '', i: [[s.incomeA, s.incomeB], [s.housingA, s.housingB]],
		k: s.children.map((b) => [String(b).replace(/-/g, ''), 0]), n: s.nightsA, d: [[-1, -1], [-1, -1]],
		x: [[0, 0], [0, 0]], a: [[0, ''], [3, 0]], b: [[0, 0], [-1, 0]],
	});
	return `/child-support/#s=${state}/@mezonot`;
}

export function moneyBlock(reg, r) {
	const cs = reg.child_support;
	const A = mmWho('A', r.parentA);
	const names = { A, B: mmWho('B', r.parentA) };
	const head = `<section class="${MMP}-money" aria-labelledby="${MMP}-money-h"><h4 id="${MMP}-money-h">מה החלוקה עושה למזונות, לפי בע"מ 919/15</h4>`;
	if (!r.support) { return `${head}<p>כדי לראות את המזונות, ממלאים את ההכנסות בטופס. בלי הכנסות הכלי מחשב רק את הלוח.</p></section>`; }
	if (!r.support.ok) { return `${head}<p class="jtool-error">${r.support.errors.map((e) => esc(e.he)).join(' ')}</p></section>`; }
	const x = r.support.result;
	const line = x.payer
		? `${names[x.payer]} ${mmPays(names[x.payer])} ל${names[x.payee]} ${mmNis(x.low)} עד ${mmNis(x.high)} לחודש, לכל הילדים יחד`
		: 'השיטות חלוקות בכיוון: לרוב אין העברה, או העברה קטנה';
	const rows = r.support.table.map((t) => `<tr${t.mine ? ` class="${MMP}-mine"` : ''}><td data-th="לילות אצל ${esc(A)}"><bdi>${t.nightsA}</bdi> מתוך 14${t.mine ? ' (הלוח שלכם)' : t.nightsA === 7 ? ' (חלוקה שווה)' : ''}</td><td data-th="מזונות לחודש">${t.ok && t.payer ? `${esc(names[t.payer])}: <span class="jtool-amt"><bdi>${esc(money(t.low, 0))}</bdi> עד <bdi>${esc(money(t.high, 0))}</bdi> ₪</span>` : 'אין העברה, או קטנה'}</td></tr>`).join('');
	return `${head}<p class="${MMP}-money__line"><strong>${esc(line)}.</strong> ${esc(`בממוצע השנתי ${r.nights14} לילות מתוך 14 אצל ${A} (${r.year.aPct}%), וזה מה שמחשבון המזונות מקבל.`)}${mmCite('בע"מ 919/15, ההכרעה', cs.ruling.url)}</p>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${MMP}-money-h" tabindex="0"><table class="jtool-table ${MMP}-moneytab"><thead><tr><th scope="col">לילות אצל ${esc(A)}</th><th scope="col">מזונות לחודש</th></tr></thead><tbody>${rows}</tbody><caption>אותה משפחה בשלוש חלוקות נפוצות. אומדן לפי השיטות שבפסיקה, לא פסק דין; הצרכים הם סכומים מתיקים אחרים.</caption></table></div>`
		+ `<p><a class="jtool-btn" href="${esc(supportLink(r))}" data-act="support">לפתוח את מחשבון המזונות עם המספרים האלה</a></p></section>`;
}

/** The scenario for the jus-tice.com simulation: computed facts only, no names or details, ending with the question. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const A = mmWho('A', r.parentA);
	const B = mmWho('B', r.parentA);
	const minors = r.kids.filter((k) => k.minor);
	const ages = minors.map((k) => k.age).sort((a, b) => a - b);
	const kids = minors.length === 1 ? `ילד אחד בן ${ages[0]}` : `${minors.length} ילדים בני ${ages.slice(0, -1).join(', ')} ו-${ages[ages.length - 1]}`;
	let band = 'ההכנסות לא הוזנו, ולכן אין עדיין טווח מזונות';
	if (r.support && r.support.ok) {
		const x = r.support.result;
		const lo = Math.floor(x.low / 100) * 100;
		const hi = Math.ceil(x.high / 100) * 100;
		const payer = x.payer === 'A' ? A : B;
		band = x.payer ? `לפי בע"מ 919/15, ${payer} ${mmPays(payer)} בערך ${money(lo, 0)} עד ${money(hi, 0)} ש"ח לחודש` : 'לפי בע"מ 919/15, כמעט אין העברת מזונות';
	}
	const tender = r.anyTender ? ` ילד אחד לפחות מתחת לגיל ${reg.fl_mishmoret.law.tender_until}, וחזקת הגיל הרך עולה.` : '';
	return `הורים נפרדים, ${kids}. ההסדר המוצע: ${mmTplShort(r.template)}. ב-12 החודשים הקרובים ${r.year.a} לילות אצל ${A} (${r.year.aPct}%) ו-${r.year.b} אצל ${B}, וחופשות בית הספר: ${MM_RULE_HE[r.rule]}. ${band}.${tender} השאלה לתרגול: איך מסכמים בגישור את הלוח, את החגים ואת החופש הגדול, ומה זה עושה למזונות?`;
}

export function nextBlock(reg, r) {
	const fl = reg.fl_mishmoret;
	return `<section class="${MMP}-next" aria-labelledby="${MMP}-next-h"><h4 id="${MMP}-next-h">מה עושים עכשיו</h4><ol>`
		+ `<li>בהסכמה: מכניסים את הלוח להסכם הורות ומגישים <a href="${esc(fl.services.agreement_url)}" target="_blank" rel="noopener">בקשה לאישור הסכם בבית המשפט לענייני משפחה</a>; הוא מאשר רק הסכם שלטובת הילד.${mmCite(fl.law.sections.agreement, fl.law.url)} <a href="/divorce-agreement/">לבנות הסכם גירושין עם תוכנית הורות</a>.</li>`
		+ `<li>בלי הסכמה: לפני כל תביעה בענייני הילדים מגישים <a href="${esc(fl.services.dispute_url)}" target="_blank" rel="noopener">בקשה ליישוב סכסוך</a>, ונפגשים ביחידת הסיוע. <a href="/request-for-family-dispute-settlements/">איך מגישים בקשה ליישוב סכסוך</a>.</li>`
		+ `<li>לפני הפגישה: <a href="/divorce-mediation/">גישור גירושין, ומה מכינים אליו</a>, ו<a href="${esc(supportLink(r))}">מחשבון המזונות עם הלוח הזה</a>.</li>`
		+ `<li>החופשות: <a href="${esc(fl.services.moe_url)}" target="_blank" rel="noopener">${esc(fl.services.moe_he)}</a>; ${esc(fl.school_year.next_published_he)}.</li></ol></section>`;
}

/** The one-page parenting-plan summary: shown only in print. */
export function printBlock(reg, r, printedOn) {
	const fl = reg.fl_mishmoret;
	const A = mmWho('A', r.parentA);
	const B = mmWho('B', r.parentA);
	const x = r.support && r.support.ok ? r.support.result : null;
	const row = (k, v) => `<tr><th scope="row">${esc(k)}</th><td>${v}</td></tr>`;
	return `<div class="${MMP}-print"><p class="${MMP}-print__h">תוכנית הורות: סיכום לשנה מ-<bdi>${esc(isoToHe(r.year.from))}</bdi> עד <bdi>${esc(isoToHe(r.year.to))}</bdi></p>`
		+ `<p class="${MMP}-print__d">הודפס ב-<bdi data-jt41-printed>${esc(isoToHe(printedOn))}</bdi> מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי; הסדר שהות הוא תבנית שבית המשפט מאשר רק אם היא לטובת הילד.</p>`
		+ `<table class="${MMP}-print__t"><tbody>`
		+ row('הילדים', esc(r.kids.map((k) => `בן/בת ${k.age}`).join(', ')))
		+ row('ההסדר', esc(MM_TEMPLATES[r.template].he))
		+ row('החופשות', esc(`${fl.stages[r.stage].he}, ${fl.school_year.he}: ${MM_RULE_HE[r.rule]}`))
		+ row('לילות בשנה', `${esc(A)} <bdi>${r.year.a}</bdi> (<bdi>${r.year.aPct}%</bdi>), ${esc(B)} <bdi>${r.year.b}</bdi> (<bdi>${r.year.bPct}%</bdi>)`)
		+ row('מעברים בין הבתים', `<bdi>${r.handovers.length}</bdi> בשנה`)
		+ row('מזונות (אומדן)', x ? (x.payer ? `${esc(x.payer === 'A' ? A : B)}: <bdi>${esc(money(x.low, 0))}</bdi> עד <bdi>${esc(money(x.high, 0))}</bdi> ₪ לחודש, לפי <bdi>${r.nights14}</bdi> לילות מתוך 14` : 'אין העברה, או קטנה') : 'לא חושב')
		+ `</tbody></table>`
		+ `<ol class="${MMP}-print__path"><li>${esc(`שבועיים לפי ההסדר: ${r.nightsA} לילות אצל ${A} ו-${r.nightsB} אצל ${B}.`)}</li><li>${esc(`חופשות בית הספר לפי חוזר המנכ"ל של משרד החינוך (${fl.stages[r.stage].notice_he}), ${MM_RULE_HE[r.rule]}: ${r.year.holidayNights} לילות של חופשה, מהם ${r.year.shiftedToA + r.year.shiftedToB} עברו להורה השני.`)}</li><li>${esc(`סך הכול ${r.year.a} ו-${r.year.b} לילות; ${r.nights14} מתוך 14 בממוצע, כשחלוקה שווה היא 7 מתוך 14 (בע"מ 919/15, פסקה 3).`)}</li>${x ? `<li>${esc('המזונות: מנוע מחשבון המזונות של האתר, לפי בע"מ 919/15 והפסיקה שאחריו.')}</li>` : ''}</ol>`
		+ `<ul class="${MMP}-print__src"><li>${esc(`${fl.stages[r.stage].notice_he}, ${isoToHe(fl.stages[r.stage].published)}`)}</li><li>${esc(`${fl.law.he}, ${fl.law.sections.agreement} ו-${fl.law.sections.no_agreement} (נוסח ל-${isoToHe(fl.law.current_to)})`)}</li><li>${esc(`${fl.child_heard.he}, ${fl.child_heard.sections.right} ו-${fl.child_heard.sections.age}`)}</li><li>${esc(`${fl.ruling.he} (${isoToHe(fl.ruling.date)})`)}</li><li>${esc(`נבדק ב-${isoToHe(fl.checked_on)}`)}</li></ul></div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const A = mmWho('A', r.parentA);
	const B = mmWho('B', r.parentA);
	const fl = reg.fl_mishmoret;
	const state = r.equal ? `חלוקה שווה: ${fl.ruling.equal_nights} לילות מתוך ${fl.ruling.equal_of}, כמו בהגדרה של בע"מ 919/15` : (r.nights14 > fl.ruling.equal_nights ? `רוב הלילות אצל ${A}` : `רוב הלילות אצל ${B}`);
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ ${esc(state)}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה: ' : ''}לילות ב-12 החודשים הקרובים אצל ${esc(A)}</p>`
		+ `<strong class="jtool-verdict__figure"><bdi dir="ltr">${r.year.a} / 365</bdi></strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p></div>`
		+ ribbon(r)
		+ `<div class="jtool-actions ${MMP}-cal"><button class="jtool-btn" type="button" data-act="ics">כל המעברים והחופשות ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="ics-a">היומן של ${esc(A)}</button><button class="jtool-btn" type="button" data-act="ics-b">היומן של ${esc(B)}</button></div>`
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ agesBlock(reg, r)
		+ moneyBlock(reg, r)
		+ `<section class="${MMP}-brief" aria-labelledby="${MMP}-brief-h"><h4 id="${MMP}-brief-h">התרחיש לסימולציה</h4><p class="${MMP}-brief__text">${esc(aiBrief(reg, r))}</p><a class="jtool-btn jtool-btn--primary" href="${esc(MM_SIM)}" target="_blank" rel="noopener" data-act="rehearse">לתרגל את הגישור עם הנתונים שלכם</a></section>`
		+ nextBlock(reg, r)
		+ printBlock(reg, r, opts.today || fl.checked_on);
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const fl = reg.fl_mishmoret;
	const A = mmWho('A', r.parentA);
	const B = mmWho('B', r.parentA);
	const st = fl.stages[r.stage];
	const hol = r.breaks.map((b) => {
		const who = b.parts.length ? b.parts.map((p) => `${mmWho(p.who, r.parentA)} <bdi>${p.nights}</bdi>`).join(', ') : 'לפי הלוח הקבוע';
		return `<tr><td data-th="החופשה">${esc(b.he)}</td><td data-th="הלילות"><bdi>${esc(isoToHe(b.from))}</bdi> עד <bdi>${esc(isoToHe(b.to))}</bdi> (<bdi>${b.nights}</bdi>)</td><td data-th="אצל מי">${who}</td><td data-th="שינוי מהלוח">${b.shifted ? `<bdi>${b.shifted}</bdi> לילות` : 'אין'}</td><td data-th="מקור">${mmCite(`${st.notice_he}, ${b.section_he}`, st.url)}</td></tr>`;
	}).join('');
	const out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${MMP}-hol-h">חופשות בית הספר ב-12 החודשים: אצל מי</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הורדה ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${MMP}-hol-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">החופשה</th><th scope="col">הלילות</th><th scope="col">אצל מי</th><th scope="col">שינוי מהלוח</th><th scope="col">מקור</th></tr></thead><tbody>${hol || '<tr><td colspan="5">אין חופשה של שנת הלימודים בחלון הזה</td></tr>'}</tbody>`
		+ `<caption>${esc(`${st.he}, שנת הלימודים ${fl.school_year.he}. ${fl.template.he}. ${MM_RULE_HE[r.rule]}.`)}</caption></table></div></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${MMP}-year-h">השנה במספרים</h3></div><div class="jtool-scroll" role="region" aria-labelledby="${MMP}-year-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">${esc(A)}</th><th scope="col">${esc(B)}</th></tr></thead><tbody>`
		+ `<tr><td data-th="מה">לילות לפי הלוח הקבוע</td><td data-th="${esc(A)}"><bdi>${r.year.regularA}</bdi></td><td data-th="${esc(B)}"><bdi>${r.year.regularB}</bdi></td></tr>`
		+ `<tr><td data-th="מה">לילות שעברו בגלל החופשות</td><td data-th="${esc(A)}"><bdi>+${r.year.shiftedToA}</bdi> / <bdi>−${r.year.shiftedToB}</bdi></td><td data-th="${esc(B)}"><bdi>+${r.year.shiftedToB}</bdi> / <bdi>−${r.year.shiftedToA}</bdi></td></tr>`
		+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול</td><td data-th="${esc(A)}"><bdi>${r.year.a}</bdi> (<bdi>${r.year.aPct}%</bdi>)</td><td data-th="${esc(B)}"><bdi>${r.year.b}</bdi> (<bdi>${r.year.bPct}%</bdi>)</td></tr>`
		+ `</tbody><caption>${esc(`מעברים בין הבתים בשנה: ${r.handovers.length}; שהיות רצופות: ${r.stays.length}. לילה נספר לפי הערב שבו הוא מתחיל.`)}</caption></table></div></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${MMP}-law-h">הכללים, כל אחד עם המקור</h3></div><ul class="${MMP}-law">`
		+ [[fl.law.natural_he, fl.law.sections.natural, fl.law.url], [fl.law.consent_he, fl.law.sections.consent, fl.law.url], [fl.law.agreement_he, fl.law.sections.agreement, fl.law.url], [fl.law.no_agreement_he, fl.law.sections.no_agreement, fl.law.url],
			[fl.ruling.equal_he, `בע"מ 919/15, ${fl.ruling.paras.equal}`, fl.ruling.url], [fl.ruling.tender_he, `בע"מ 919/15, ${fl.ruling.paras.tender}`, fl.ruling.url],
			[fl.child_heard.right_he, fl.child_heard.sections.right, fl.child_heard.url], [fl.child_heard.age_he, fl.child_heard.sections.age, fl.child_heard.url], [fl.child_heard.how_he, fl.child_heard.sections.alone, fl.child_heard.url], [fl.child_heard.agreement_he, fl.child_heard.sections.agreement, fl.child_heard.url],
			[fl.welfare.report_he, fl.welfare.sections.report, fl.welfare.url], [fl.welfare.parties_he, fl.welfare.sections.parties, fl.welfare.url]]
			.map(([t, s, u]) => `<li>${esc(t)}.${mmCite(s, u)}</li>`).join('')
		+ `</ul></div>`;
	return out;
}

/** The ICS events: 'all' = every handover, vacation part and age milestone; 'A' / 'B' = that parent's stays. */
export function icsEvents(reg, r, which = 'all') {
	if (!r.ok) { return []; }
	const fl = reg.fl_mishmoret;
	if (which === 'A' || which === 'B') {
		return r.stays.filter((s) => s.who === which).map((s) => ({ date: s.from, summary: `הילדים אצלך: ${s.nights} ${s.nights === 1 ? 'לילה' : 'לילות'}`, description: `מהערב של ${isoToHe(s.from)} עד הבוקר של ${isoToHe(mmAddDay(s.to, 1))}. תוכנית הורות מ-jus-tice.co.il, מידע כללי.` }));
	}
	const ev = r.handovers.map((h) => ({ date: h.date, summary: `מעבר: הילדים עוברים ל${mmWho(h.to, r.parentA)}`, description: 'יום מעבר לפי תוכנית ההורות. מידע כללי, לא ייעוץ משפטי.' }));
	for (const b of r.breaks) {
		for (const p of b.parts) { ev.push({ date: p.from, summary: `${b.he}: הילדים אצל ${mmWho(p.who, r.parentA)}`, description: `${p.nights} לילות, עד הבוקר של ${isoToHe(mmAddDay(p.to, 1))}. ${b.text_he}.` }); }
	}
	for (const k of r.kids) {
		for (const m of k.milestones) { ev.push({ date: m.date, summary: `ילד/ה ${k.idx + 1} בן/בת ${m.years}`, description: `${MM_MILE[m.key](fl)}.` }); }
	}
	return ev.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/** Page section: the templates side by side, with the example family's support band at each split. */
export function compareTable(reg) {
	const fam = { incomeA: EXAMPLE.incomeA, incomeB: EXAMPLE.incomeB, housingA: EXAMPLE.housingA, housingB: EXAMPLE.housingB, children: EXAMPLE.children, father: 'A', law: 'jewish', asOf: EXAMPLE.start };
	const rows = mmCompare(reg, fam).map((c) => `<tr><td data-th="ההסדר">${esc(c.he)}</td><td data-th="לילות אצל הורה א'"><bdi>${c.nightsA}</bdi> מתוך 14${c.evening ? ', ועוד ערב בשבוע' : ''}</td><td data-th="מעברים בשבועיים"><bdi>${c.handovers}</bdi></td><td data-th="מזונות לחודש">${c.support && c.support.payer ? `<bdi>${esc(money(c.support.low, 0))}</bdi> עד <bdi>${esc(money(c.support.high, 0))}</bdi> ₪` : 'אין העברה, או קטנה'}</td></tr>`).join('');
	const ages = compute(reg, Object.assign({}, EXAMPLE, { incomeA: '', incomeB: '' })).kids.map((k) => k.age);
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`הסדרי שהות נפוצים והמזונות שיוצאים מהם: האב הוא הורה א', הכנסות נטו ${money(EXAMPLE.incomeA, 0)} ₪ (אב) ו-${money(EXAMPLE.incomeB, 0)} ₪ (אם), דיור ${money(EXAMPLE.housingA, 0)} ו-${money(EXAMPLE.housingB, 0)} ₪, ילדים בני ${ages.join(' ו-')}. אומדן מאותו מנוע של מחשבון המזונות; ההסדרים הם תבניות, לא חוק.`)}</caption><thead><tr><th scope="col">ההסדר</th><th scope="col">לילות אצל הורה א'</th><th scope="col">מעברים בשבועיים</th><th scope="col">האב משלם לחודש</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** Page section: the vacations of the school year by stage, nights included, with the circular. */
export function holidaysTable(reg) {
	const fl = reg.fl_mishmoret;
	const by = Object.fromEntries(Object.keys(fl.stages).map((s) => [s, mmBreaks(fl, s)]));
	const rows = fl.breaks.map((b, i) => `<tr><td data-th="החופשה">${esc(b.he)}</td><td data-th="מתי">${esc(b.text_he)}</td>${Object.keys(fl.stages).map((s) => `<td data-th="לילות, ${esc(fl.stages[s].he)}"><bdi>${by[s][i].nights}</bdi></td>`).join('')}</tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(`חופשות בית הספר בשנת הלימודים ${fl.school_year.he}, ${fl.school_year.sector_he}, לפי חוזר המנכ"ל של משרד החינוך (הודעות 0363 ו-0364, ${isoToHe(fl.stages.k6.published)}). לילות: מהערב של יום הלימודים האחרון עד הבוקר שבו חוזרים.`)}</caption><thead><tr><th scope="col">החופשה</th><th scope="col">מתי</th>${Object.values(fl.stages).map((v) => `<th scope="col">לילות, ${esc(v.he)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

/** The result-first card ([justice_tool_lead]): same markup on the server and in the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב לפי המקרה שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">לילות בשנה אצל כל הורה</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const A = mmWho('A', r.parentA);
	const x = r.support && r.support.ok ? r.support.result : null;
	const money$ = x ? (x.payer ? `${mmWho(x.payer, r.parentA)} ${mmPays(mmWho(x.payer, r.parentA))} ${mmNis(x.low)} עד ${mmNis(x.high)} לחודש` : 'כמעט אין העברה') : 'בלי הכנסות, בלי טווח מזונות';
	const ages = r.kids.filter((k) => k.minor).map((k) => k.age).sort((a, b) => a - b);
	const line = `${mmTplShort(r.template)}, ${ages.length === 1 ? `ילד בן ${ages[0]}` : `ילדים בני ${ages.join(' ו-')}`}, חופשות ${MM_RULE_HE[r.rule]}. מזונות לפי בע"מ 919/15: ${money$}.`;
	return `<p class="jtool-lead__label">${opts.example ? 'דוגמה מחושבת' : 'החישוב שלכם'}: לילות ב-12 החודשים אצל ${esc(A)}</p>`
		+ `<p class="jtool-lead__row"><strong class="jtool-lead__figure"><bdi dir="ltr">${r.year.a}/365</bdi></strong><span class="jtool-lead__unit"><bdi>${r.year.aPct}%</bdi> · <bdi>${r.nights14}</bdi> מתוך 14 בממוצע${r.equal ? ', חלוקה שווה' : ''}</span></p>`
		+ `<p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const fl = reg.fl_mishmoret;
	const A = mmWho('A', EXAMPLE.parentA);
	const B = mmWho('B', EXAMPLE.parentA);
	const x = r.support.result;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.year.a,
		sticky: `<bdi dir="ltr">${r.year.a}/365</bdi>`,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>ההסדר: ${esc(MM_TEMPLATES[EXAMPLE.template].he)}: ${r.nightsA} לילות מתוך 14 אצל ${esc(A)}, ${r.handovers14} מעברים בשבועיים.</li>`
			+ `<li>365 לילות מיום ראשון ${esc(isoToHe(r.year.from))}: לפי הלוח הקבוע ${r.year.regularA} אצל ${esc(A)} ו-${r.year.regularB} אצל ${esc(B)}.</li>`
			+ `<li>חופשות בית הספר לפי חוזר המנכ"ל של משרד החינוך לשנת ${esc(fl.school_year.he)} (${esc(fl.stages.k6.he)}), ${esc(MM_RULE_HE[EXAMPLE.holidays])}: ${r.year.holidayNights} לילות של חופשה, ${r.year.shiftedToA + r.year.shiftedToB} מהם עוברים להורה השני.${mmCite(fl.stages.k6.notice_he, fl.stages.k6.url)}</li>`
			+ `<li>סך הכול ${r.year.a} לילות אצל ${esc(A)} (${r.year.aPct}%) ו-${r.year.b} אצל ${esc(B)}: ${r.nights14} מתוך 14 בממוצע; חלוקה שווה היא ${fl.ruling.equal_nights} מתוך ${fl.ruling.equal_of}.${mmCite(`בע"מ 919/15, ${fl.ruling.paras.equal}`, fl.ruling.url)}</li>`
			+ `<li>המזונות, באותו מנוע של מחשבון המזונות: ${esc(A)} ${mmPays(A)} ל${esc(B)} ${esc(mmNis(x.low))} עד ${esc(mmNis(x.high))} לחודש.${mmCite('בע"מ 919/15, ההכרעה', reg.child_support.ruling.url)}</li></ol>`,
		compare_table: compareTable(reg),
		holidays_table: holidaysTable(reg),
		sentence: verdictSentence(reg, r),
		brief: aiBrief(reg, r),
		lead: leadCard(reg, r, { example: true }),
	};
}

/* ---------------- Browser ---------------- */

/** Blank travels as -1, so an explicit 0 survives the link. */
const mmOv = (v) => (v === '' || v === undefined || v === null || Number.isNaN(v) ? -1 : v);
export const stateOf = (m) => encodeState({
	p: m.parentA === 'אמא' ? 'm' : '', k: (m.children || []).map((b) => [String(b).replace(/-/g, ''), 0]),
	t: MM_TPL_CODE[m.template] || 'f', n: m.template === 'custom' ? (m.custom || []).join('.') : '', s: m.start,
	g: m.stage === 'mid' ? 'm' : m.stage === 'high' ? 'h' : '', h: m.holidays === 'alternate' ? 'a' : m.holidays === 'none' ? 'n' : '',
	f: m.firstA === false ? 0 : '', i: [[mmOv(m.incomeA), mmOv(m.incomeB)], [mmOv(m.housingA), mmOv(m.housingB)]],
});
export const KEYS = ['p', 'k', 't', 'n', 's', 'g', 'h', 'f', 'i'];
export function modelOf(s) {
	if (!s.t && !s.s) { return null; }
	const pairs = (t) => String(t || '').split('~').filter(Boolean).map((x) => x.split('_'));
	const ymd = (x) => (/^\d{8}$/.test(x) ? `${x.slice(0, 4)}-${x.slice(4, 6)}-${x.slice(6, 8)}` : '');
	const zo = (x) => (x === undefined || x === '' || x === '-1' ? '' : Number(x));
	const i = pairs(s.i);
	return {
		parentA: s.p === 'm' ? 'אמא' : 'אבא', children: pairs(s.k).map((p) => ymd(p[0])).filter(Boolean),
		template: Object.keys(MM_TPL_CODE).find((k) => MM_TPL_CODE[k] === s.t) || 'two_two_five',
		custom: s.n ? String(s.n).split('.').filter(Boolean).map(Number) : [], start: s.s || '',
		stage: s.g === 'm' ? 'mid' : s.g === 'h' ? 'high' : 'k6', holidays: s.h === 'a' ? 'alternate' : s.h === 'n' ? 'none' : 'halves', firstA: s.f !== '0',
		incomeA: zo(i[0] && i[0][0]), incomeB: zo(i[0] && i[0][1]), housingA: zo(i[1] && i[1][0]), housingB: zo(i[1] && i[1][1]),
	};
}

function mmToIso(text) {
	const v = String(text || '').trim();
	return v === '' ? '' : (parseDate(v) || v);
}
function readModel(root, custom) {
	const val = (id) => ((root.querySelector(`#${MMP}-${id}`) || {}).value || '').trim();
	const m$ = (id) => { const v = val(id); return v === '' ? '' : parseMoney(v); };
	const checked = (name) => (root.querySelector(`input[name="${MMP}-${name}"]:checked`) || {}).value;
	return {
		parentA: checked('pa') === 'אמא' ? 'אמא' : 'אבא',
		children: [...root.querySelectorAll('[data-kid] input')].map((x) => mmToIso(x.value)).filter((x) => x !== ''),
		template: checked('tpl') || 'two_two_five', custom: custom.slice(), start: mmToIso(val('start')),
		stage: checked('stage') || 'k6', holidays: checked('hol') || 'halves', firstA: Boolean(checked('fa')),
		incomeA: m$('ia'), incomeB: m$('ib'), housingA: m$('ha'), housingB: m$('hb'),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	let own = false;
	const fl = reg.fl_mishmoret;
	const saveKey = `jtool-${TOOL_ID}`;
	const today = ilToday();
	let custom = [];
	let started = false;
	let timer = null;
	let last = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(fl.checked_on, fl.refresh_every_days) || (fl.next_update && today >= fl.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שלוח החופשות התעדכן'); }
	}
	const ids = { start: 'start', custom: 'custom', children: 'children', incomeA: 'ia', incomeB: 'ib', housingA: 'ha', housingB: 'hb' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const km = /^child-(\d+)$/.exec(e.field);
			const id = km ? `kid-${km[1]}` : ids[e.field];
			const box = id && root.querySelector(`#${MMP}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${MMP}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const run = (m, opts = {}) => {
		if (m.template !== 'custom') { custom = []; }
		const r = compute(reg, m);
		showErrors(r);
		result.innerHTML = renderResult(reg, r, { today });
		details.innerHTML = renderDetails(reg, r);
		const holder = form.querySelector('[data-jt41-board]');
		if (holder) { holder.innerHTML = board(m, mmNights(m.template, m.custom)); }
		if (sticky) { sticky.innerHTML = r.ok ? `<bdi dir="ltr">${r.year.a}/365</bdi>` : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.equal ? 'equal' : 'primary' }); }
		last = r;
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readModel(root, custom)); }, 160);
	};
	// A share link names its tool (/@mishmoret); on a page with several tools only that tool reads it (HAD-541).
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? modelOf(decodeState(window.location.hash, KEYS)) : null;
	if (fromHash) {
		own = true;
		custom = fromHash.custom.slice();
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		run(fromHash, { silent: true });
	} else {
		// The coming 12 months: the plan starts on the coming Sunday, never before the example's day.
		const d = new Date(`${today}T00:00:00Z`);
		const sunday = new Date(d.getTime() + ((7 - d.getUTCDay()) % 7) * 86400000).toISOString().slice(0, 10);
		const field = root.querySelector(`#${MMP}-start`);
		if (field && sunday > EXAMPLE.start) { field.value = isoToHe(sunday); }
		run(readModel(root, custom), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	// The card's jump: to the form, first field focused (the page anchor is the fallback without the script).
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector('input:not([type="radio"]):not([type="checkbox"])');
			if (first) { setTimeout(() => first.focus({ preventScroll: true }), 350); }
			track('tool_lead_click', { tool_id: TOOL_ID });
		});
	}
	const mine = () => { own = true; };
	form.addEventListener('input', mine, true);
	form.addEventListener('change', mine, true);
	form.addEventListener('click', (ev) => { if (ev.target.closest('[data-night], [data-add-kid], [data-remove-kid]')) { own = true; } }, true);
	form.addEventListener('input', schedule);
	form.addEventListener('change', (ev) => {
		// Switching to "custom" starts from the nights of the plan that was on screen.
		if (ev.target && ev.target.name === `${MMP}-tpl` && ev.target.value === 'custom' && last && last.ok) { custom = last.nights.map((x, i) => (x === 'A' ? i : -1)).filter((i) => i >= 0); }
		schedule();
	});
	root.addEventListener('click', async (ev) => {
		const night = ev.target.closest('button[data-night]');
		if (night) {
			const i = Number(night.getAttribute('data-night'));
			custom = custom.includes(i) ? custom.filter((x) => x !== i) : custom.concat(i).sort((a, b) => a - b);
			if (timer) { clearTimeout(timer); timer = null; }
			run(readModel(root, custom));
			const again = root.querySelector(`button[data-night="${i}"]`);
			if (again) { again.focus(); }
			return;
		}
		const add = ev.target.closest('[data-add-kid]');
		const rm = ev.target.closest('[data-remove-kid]');
		if (add || rm) {
			const m = readModel(root, custom);
			const kids = [...root.querySelectorAll('[data-kid] input')].map((x) => mmToIso(x.value));
			if (add && kids.length < reg.child_support.max_children) { kids.push(''); }
			if (rm) { kids.splice(Number(rm.getAttribute('data-remove-kid')), 1); }
			form.innerHTML = renderForm(reg, Object.assign({}, m, { children: kids }));
			run(Object.assign({}, m, { children: kids.filter((k) => k !== '') }));
			if (add) { const lastKid = form.querySelector('[data-kid]:last-child input'); if (lastKid) { lastKid.focus(); } }
			return;
		}
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		const m = readModel(root, custom);
		// A link the reader clicked must stay in the page to open: compute without redrawing for the two links.
		const r = act === 'rehearse' || act === 'support' ? compute(reg, m) : run(m, { silent: true });
		const link = `${shareUrl(stateOf(m))}/@${TOOL_ID}`;
		if ((act === 'ics' || act === 'ics-a' || act === 'ics-b') && r.ok) {
			const which = act === 'ics-a' ? 'A' : act === 'ics-b' ? 'B' : 'all';
			download(which === 'all' ? 'mishmoret.ics' : `mishmoret-parent-${which.toLowerCase()}.ics`, 'text/calendar;charset=utf-8', ics(icsEvents(reg, r, which), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			root.querySelectorAll('[data-jt41-printed]').forEach((el) => { el.textContent = isoToHe(ilToday()); });
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if ((act === 'link' || act === 'save') && !r.ok) {
			toast(root, 'יש שדה שצריך לתקן. תקנו אותו, ואז אפשר לשתף או לשמור.');
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו תאריכי לידה וסכומים בלבד, בלי שמות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · תוכנית הורות מ-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.)`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The scenario goes to the simulation by the window handoff (never in a URL); without it, to the clipboard.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? (r.equal ? 'equal' : 'primary') : 'error' });
			const brief = r.ok ? aiBrief(reg, r) : '';
			const purpose = (/purpose=([a-z_]+)/.exec(b.getAttribute('href') || '') || [])[1] || 'mediation';
			if (brief && openSimulation(brief, purpose, b.getAttribute('href'))) {
				ev.preventDefault();
				toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.');
			} else {
				if (brief) { copyText(brief); }
				toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			}
		} else if (act === 'support') {
			track('tool_next_click', { tool_id: TOOL_ID, type: 'mezonot' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(m));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = modelOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { custom = s.custom.slice(); form.innerHTML = renderForm(reg, s); run(s); }
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
