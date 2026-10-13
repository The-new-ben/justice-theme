/**
 * Wave 3 UI: inheritance without a will, who inherits what (HAD-498).
 * Board: Claude Design canvas "Tools wave 3" (co.il yerusha at 1280 and 360, states).
 * Pure renderers write the server snapshot and the live page from the same code. The family chart is a
 * picture of the same rows the heirs table lists; the table is what screen readers get.
 */
import { compute, fracText } from './yerusha-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState,
	track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale,
} from './instrument.js';

export const TOOL_ID = 'yerusha';
const P = 'jt6';

export const EXAMPLE = { spouse: 'married', spouseApartment: false, children: 2, childLines: [], mother: false, father: false, siblingsFull: 0, siblingsFather: 0, siblingsMother: 0, siblingLines: [], grandparents: 0, grandOthersNone: false, apartment: 2400000, other: 600000, otherRelatives: false };
// The second worked example on the page: no children, a spouse of 10 years in the family home, two siblings.
export const EXAMPLE_HOME = { spouse: 'married', spouseApartment: true, children: 0, childLines: [], mother: false, father: false, siblingsFull: 2, siblingsFather: 0, siblingsMother: 0, siblingLines: [], grandparents: 0, apartment: 2400000, other: 600000 };

const GROUP_LABEL = { spouse: 'בן הזוג', children: 'ילדים ונכדים', parents: 'הורים ואחים', grandparents: 'סבים', unresolved: 'דור שהכלי לא מחלק' };
const SPOUSE = { married: 'נשוי/אה', partner: 'ידועים בציבור', none: 'אין' };

function cite(text, href) { return ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>`; }
const lawCite = (reg, text) => cite(text, reg.yerusha.law_url);
const pctText = (h) => `${(Math.round(h.pct * 100) / 100).toLocaleString('en-US', { maximumFractionDigits: 2 })}%`;

/* ---------------- Pure renderers ---------------- */

function stepper(id, label, value, hint, max = 30) {
	return `<div class="jtool-field jt6-count"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label>`
		+ `<div class="jt6-stepper"><button class="jtool-iconbtn" type="button" data-step="${id}" data-delta="-1" aria-label="פחות: ${esc(label)}">−</button>`
		+ `<input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(value ?? 0)}" data-max="${max}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">`
		+ `<button class="jtool-iconbtn" type="button" data-step="${id}" data-delta="1" aria-label="עוד: ${esc(label)}">+</button></div>`
		+ (hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : '') + `<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
}

function lineRow(kind, l, i) {
	const sides = kind === 'sib' ? `<div class="jtool-field"><label class="jtool-label" for="${P}-sl-side-${i}">אח/ות</label><select id="${P}-sl-side-${i}" data-line-side><option value="full"${l.side === 'full' ? ' selected' : ''}>משני ההורים</option><option value="father"${l.side === 'father' ? ' selected' : ''}>מצד האב</option><option value="mother"${l.side === 'mother' ? ' selected' : ''}>מצד האם</option></select></div>` : '';
	const lbl = kind === 'sib' ? 'כמה ילדים השאיר/ה' : 'כמה ילדים (נכדים) השאיר/ה';
	return `<li class="jtool-rep__row" data-line="${kind}" data-row="${i}">${sides}`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-${kind}l-${i}">${lbl}</label><input id="${P}-${kind}l-${i}" type="text" inputmode="numeric" autocomplete="off" data-line-kids value="${esc(kind === 'sib' ? l.kids : l)}"></div>`
		+ `<button class="jtool-iconbtn" type="button" data-remove-line="${kind}" data-index="${i}" aria-label="מחיקת שורה ${i + 1}">✕</button></li>`;
}

export function renderForm(reg, input) {
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const childLines = input.childLines || [];
	const sibLines = input.siblingLines || [];
	const hasSib = input.siblingsFull || input.siblingsFather || input.siblingsMother || sibLines.length;
	return `<fieldset class="jtool-field"><legend>בן או בת זוג במות המוריש</legend><div class="jtool-chips">${Object.entries(SPOUSE).map(([k, v]) => chip('sp', k, v, (input.spouse || 'none') === k)).join('')}</div>`
		+ `<div class="jtool-chips" data-if-spouse${input.spouse === 'none' ? ' hidden' : ''}>${chip('apt', '1', `נשואים ${reg.yerusha.spouse_apartment_min_years} שנים ויותר וגרו יחד בדירה שבעיזבון`, input.spouseApartment, 'checkbox')}</div></fieldset>`
		+ `<div class="jtool-row">${stepper('kids', 'ילדים בחיים', input.children, 'כולל ילדים מאומצים ומקשר קודם')}`
		+ `<fieldset class="jtool-field"><legend>הורים בחיים</legend><div class="jtool-chips">${chip('mom', '1', 'אמא', input.mother, 'checkbox')}${chip('dad', '1', 'אבא', input.father, 'checkbox')}</div></fieldset></div>`
		+ `<div class="jtool-field"><span class="jtool-label" id="${P}-cl-l">ילד שנפטר לפני המוריש והשאיר ילדים</span><ul class="jtool-rep" aria-labelledby="${P}-cl-l" data-lines="child">${childLines.map((k, i) => lineRow('child', k, i)).join('')}</ul><button class="jtool-linkbtn" type="button" data-add-line="child">+ הוספה</button><p class="jtool-error" id="${P}-childLines-e" role="alert"></p></div>`
		+ `<details class="jtool-more"${hasSib ? ' open' : ''}><summary>אחים ואחיות (חשוב כשאין ילדים)</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${stepper('sibf', 'אחים משני ההורים', input.siblingsFull)}${stepper('sibd', 'אחים מצד האב בלבד', input.siblingsFather)}</div>`
		+ `<div class="jtool-row">${stepper('sibm', 'אחים מצד האם בלבד', input.siblingsMother)}<div></div></div>`
		+ `<div class="jtool-field"><span class="jtool-label" id="${P}-sl-l">אח או אחות שנפטרו והשאירו ילדים</span><ul class="jtool-rep" aria-labelledby="${P}-sl-l" data-lines="sib">${sibLines.map((l, i) => lineRow('sib', l, i)).join('')}</ul><button class="jtool-linkbtn" type="button" data-add-line="sib">+ הוספה</button><p class="jtool-error" id="${P}-siblingLines-e" role="alert"></p></div>`
		+ `</details>`
		+ `<details class="jtool-more"${input.grandparents || input.otherRelatives ? ' open' : ''}><summary>סבים, סבתות ודודים (כשאין ילדים, הורים ואחים)</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${stepper('gp', 'סבים וסבתות בחיים', input.grandparents, 'עד 4', 4)}<div></div></div>`
		+ `<div class="jtool-chips">${chip('gpn', '1', 'לסבים שנפטרו אין צאצאים חיים (דודים או בני דודים)', input.grandOthersNone, 'checkbox')}${chip('unc', '1', 'יש דודים או בני דודים', input.otherRelatives, 'checkbox')}</div></details>`
		+ `<details class="jtool-more"${input.apartment || input.other ? ' open' : ''}><summary>שווי העיזבון, כדי לראות סכומים (לא חובה)</summary>`
		+ `<div class="jtool-row" style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${P}-apt-v">חלקו של המוריש בדירת המגורים</label><div class="jtool-input jtool-input--money"><input id="${P}-apt-v" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.apartment ? money(input.apartment, 0) : '')}" placeholder="לדוגמה: 2,400,000" aria-describedby="${P}-apartment-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-apartment-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-oth-v">כל השאר (כסף, נכסים)</label><div class="jtool-input jtool-input--money"><input id="${P}-oth-v" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.other ? money(input.other, 0) : '')}" placeholder="לדוגמה: 600,000" aria-describedby="${P}-other-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-other-e" role="alert"></p></div></div>`
		+ `<p class="jtool-hint">בלי המיטלטלין של משק הבית והמכונית: הם של בן הזוג (סעיף 11(א)). חובות העיזבון משולמים לפני החלוקה.</p></details>`;
}

export function describe(r) {
	if (!r.ok) { return ''; }
	if (r.state) { return 'אין בן זוג ואין קרובים שהחוק מונה, ולכן המדינה יורשת (סעיף 17).'; }
	if (r.unknown) { return 'יורשים צאצאי הסבים (דודים ובני דודים). הכלי לא מחלק את הדור הזה.'; }
	const people = r.heirs.filter((h) => !h.unresolved);
	const groups = {};
	for (const h of people) { const k = `${h.group}|${fracText(h.share)}`; (groups[k] = groups[k] || []).push(h); }
	const parts = Object.values(groups).map((g) => {
		const f = fracText(g[0].share);
		if (g[0].group === 'spouse') { return `לבן הזוג ${f}${r.spouseApt ? ' ועוד כל חלקו של המוריש בדירה' : ''}`; }
		const k = g[0].key;
		const noun = k.startsWith('grandchild') ? 'נכדים' : k.startsWith('child') ? 'ילדים' : k.startsWith('sibline') ? 'אחיינים' : k.startsWith('sib') ? 'אחים' : k.startsWith('grand') ? 'סבים' : 'יורשים';
		return g.length > 1 ? `ל-${g.length} ${noun} ${f} לכל אחד` : `ל${g[0].label} ${f}`;
	});
	return `בלי צוואה, העיזבון מתחלק כך: ${parts.join('; ')}.${r.unresolved ? ' חלק מהעיזבון עובר לדור שהכלי לא מחלק.' : ''}`;
}

/** The share bar: one segment per heir, in the order of the table. Hidden from screen readers (the table says it). */
function shareBar(r) {
	if (!r.heirs.length) { return ''; }
	return `<div class="jt6-bar" aria-hidden="true">${r.heirs.map((h) => `<span class="jt6-bar__seg jt6-g-${h.group}" style="width:${Math.max(0.8, h.pct).toFixed(3)}%"><b>${esc(fracText(h.share))}</b></span>`).join('')}</div>`;
}

/** The family chart: generations as rows, heirs filled, the deceased and the non-heirs outlined. */
function familyChart(r, input) {
	const node = (who, h, cls = '') => `<div class="jt6-node${h ? ` jt6-node--heir jt6-g-${h.group}` : ''}${cls}"><span class="jt6-node__who">${esc(who)}</span>${h ? `<span class="jt6-node__share">${esc(fracText(h.share))}</span>` : ''}</div>`;
	const find = (key) => r.heirs.find((h) => h.key === key);
	const rows = [];
	if (input.mother || input.father || r.line === 'parents') {
		rows.push(`<div class="jt6-gen" data-gen="parents">${node('אבא', find('father'), input.father ? '' : ' jt6-node--gone')}${node('אמא', find('mother'), input.mother ? '' : ' jt6-node--gone')}</div>`);
	}
	const sibs = r.heirs.filter((h) => h.group === 'parents' && h.key !== 'father' && h.key !== 'mother');
	const center = [node('המוריש/ה', null, ' jt6-node--self')];
	if (r.spouse !== 'none') { center.unshift(node(r.spouse === 'married' ? 'בן/בת הזוג' : 'ידוע/ה בציבור', find('spouse'))); }
	rows.push(`<div class="jt6-gen jt6-gen--center" data-gen="self">${center.join('')}${sibs.map((h) => node(h.label, h)).join('')}</div>`);
	const kids = r.heirs.filter((h) => h.group === 'children');
	if (kids.length) { rows.push(`<div class="jt6-gen" data-gen="children">${kids.map((h) => node(h.label, h)).join('')}</div>`); }
	const grand = r.heirs.filter((h) => h.group === 'grandparents' || h.group === 'unresolved');
	if (grand.length) { rows.unshift(`<div class="jt6-gen" data-gen="grand">${grand.map((h) => node(h.label, h, h.unresolved ? ' jt6-node--open' : '')).join('')}</div>`); }
	return `<div class="jt6-chart" aria-hidden="true">${rows.join('')}</div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const state = r.state ? '<p class="jtool-state jtool-state--info">המדינה יורשת</p>'
		: r.unknown || r.unresolved ? '<p class="jtool-state jtool-state--warn">! חלק מהחלוקה תלוי בדור שהכלי לא מחלק</p>'
			: r.spouse === 'partner' ? '<p class="jtool-state jtool-state--warn">! ידועים בציבור: צריך להוכיח את הקשר</p>'
				: '<p class="jtool-state jtool-state--ok">✓ החלוקה לפי חוק הירושה</p>';
	const n = r.heirs.filter((h) => !h.unresolved).length;
	const figure = r.state ? 'המדינה' : `${n} ${n === 1 ? 'יורש/ת' : 'יורשים'}`;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${esc(opts.label || 'ירושה על פי דין, בלי צוואה')}</p>`
		+ `<strong class="jtool-verdict__figure">${esc(figure)}</strong>`
		+ shareBar(r)
		+ `<p class="jtool-verdict__sentence">${esc(describe(r))}</p></div>`
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ `<details class="jtool-path" open><summary>איך חילקנו, סעיף אחרי סעיף</summary><ol>${r.path.map((l) => `<li>${esc(l.he)}${lawCite(reg, l.rule)}</li>`).join('')}</ol></details>`;
}

function heirsTable(reg, r) {
	const withMoney = r.heirs.some((h) => h.amount !== null);
	const rows = r.heirs.map((h) => `<tr${h.unresolved ? ' class="jtool-muted"' : ''}><td data-th="מי">${esc(h.label)}</td><td data-th="חלק"><bdi>${esc(fracText(h.share))}</bdi></td><td data-th="אחוז"><bdi>${esc(pctText(h))}</bdi></td>`
		+ (withMoney ? `<td data-th="סכום">${h.amount === null ? '—' : ils(h.amount, h.amount % 1 ? 2 : 0)}</td>` : '')
		+ `<td data-th="הכלל">${lawCite(reg, h.rule)}</td></tr>`).join('');
	return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-heirs-h">מי יורש כמה</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-table">העתקת הטבלה</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-heirs-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מי</th><th scope="col">חלק</th><th scope="col">אחוז</th>${withMoney ? '<th scope="col">סכום</th>' : ''}<th scope="col">הכלל</th></tr></thead><tbody>${rows}</tbody>`
		+ `<caption>${r.spouseApt ? 'החלקים הם משאר העיזבון; הדירה כולה לבן הזוג (סעיף 11(א)(2)). ' : ''}לפני החלוקה: המיטלטלין והמכונית לבן הזוג, וחובות העיזבון. ${r.heirs.some((h) => h.amount !== null) ? 'הסכומים לפי השווי שהזנתם.' : ''}</caption></table></div></div>`;
}

export function renderDetails(reg, r, compareR, input) {
	if (!r.ok) { return ''; }
	const y = reg.yerusha;
	let out = `<div class="jt6-chartwrap"><h3 class="jt6-chartwrap__h">עץ היורשים</h3>${familyChart(r, input || {})}</div>`;
	out += r.heirs.length ? heirsTable(reg, r) : '';
	// The order and its cost: the registrar's fee (85% online), the objection window, the war exemption.
	out += `<div class="jtool-tablewrap" id="${P}-order-h"><div class="jtool-tablewrap__head"><h3>צו ירושה: כמה עולה ומתי</h3></div><ol class="jtool-steps">`
		+ `<li>מגישים בקשה לצו ירושה לרשם לענייני ירושה, אפשר באינטרנט.${cite('שירות הבקשה', y.service_url)}</li>`
		+ `<li>האגרה ב-${new Date(`${r.fee.from}T00:00:00Z`).getUTCFullYear()}: ${ils(r.fee.fee, 0)}, ובהגשה מקוונת ${y.fees.online_pct}% ממנה, ${ils(r.fee.online)}. מתעדכנת ב-1 בינואר.${cite(y.fees.section, y.fees.url)}</li>`
		+ `<li>הבקשה מתפרסמת, ומי שרוצה להתנגד מגיש התנגדות בתוך ${esc(y.objection_he)}.${cite(y.objection_section, y.regulations_url)}</li>`
		+ `<li>בן זוג, ילד, הורה או אח של מי שנפטר עקב פעולות איבה או בשירות צבאי פטורים מהאגרה.${cite(y.fees.exempt_section, y.fees.url)}</li></ol></div>`;
	if (compareR && compareR.ok) {
		out += `<div class="jtool-compare" data-compare><h3>מה אם: ${r.spouse === 'none' ? 'היה בן זוג' : 'לא היה בן זוג'}</h3><div data-compare-out>${renderCompareOut(r, compareR)}</div></div>`;
	}
	return out;
}

export function renderCompareOut(r, c) {
	const top = (x) => x.heirs.filter((h) => !h.unresolved).slice(0, 4).map((h) => `${h.label}: ${fracText(h.share)}`).join(' · ') || (x.state ? 'המדינה' : '—');
	return `<div class="jtool-compare__grid"><div class="jtool-compare__col"><p>א. כפי שהזנתם</p><strong class="jt6-small">${esc(top(r))}</strong></div>`
		+ `<div class="jtool-compare__col jtool-compare__col--b"><p>ב. ${r.spouse === 'none' ? 'עם בן זוג נשוי' : 'בלי בן זוג'}</p><strong class="jt6-small">${esc(top(c))}</strong></div></div>`
		+ `<p class="jtool-delta" aria-live="polite">${r.spouse === 'none' ? 'בן זוג נוטל חצי או שני שלישים, ולפעמים הכול (סעיף 11).' : 'בלי בן זוג, הקרובים מקבלים את כל העיזבון לפי סדר העדיפות (סעיף 12).'}</p>`;
}

export function compareFor(input) { return Object.assign({}, input, { spouse: input.spouse === 'none' ? 'married' : 'none', spouseApartment: false }); }

export function tableText(r) {
	return r.heirs.map((h) => `${h.label}: ${fracText(h.share)} (${pctText(h)})${h.amount !== null ? `, ${money(h.amount, h.amount % 1 ? 2 : 0)} ₪` : ''}`).join('\n');
}

/** Page section: the shares in the common family situations, from the same engine. */
export function casesTable(reg) {
	const cases = [
		['בן זוג וילד אחד', { spouse: 'married', children: 1 }],
		['בן זוג ושלושה ילדים', { spouse: 'married', children: 3 }],
		['בן זוג, בלי ילדים, אמא בחיים', { spouse: 'married', mother: true }],
		['בן זוג ושני אחים, בלי דירה משותפת', { spouse: 'married', siblingsFull: 2 }],
		['בן זוג ואחים, נשואים 3 שנים וגרו בדירה', { spouse: 'married', siblingsFull: 2, spouseApartment: true }],
		['שני ילדים, בלי בן זוג', { spouse: 'none', children: 2 }],
		['בלי בן זוג וילדים, שני ההורים בחיים', { spouse: 'none', mother: true, father: true }],
		['רק בן זוג', { spouse: 'married' }],
	];
	const rows = cases.map(([label, inp]) => {
		const r = compute(reg, inp);
		const parts = r.heirs.map((h) => `${h.label} ${fracText(h.share)}`).join(', ');
		return `<tr><td data-th="המצב">${esc(label)}</td><td data-th="החלוקה">${esc(parts)}${r.spouseApt ? ' (והדירה לבן הזוג)' : ''}</td><td data-th="הכלל">${esc(r.path.map((l) => l.rule).filter((v, i, a) => a.indexOf(v) === i).join(', '))}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>חלוקת ירושה ללא צוואה במצבים הנפוצים, מאותו מנוע. בלי המיטלטלין והמכונית שעוברים לבן הזוג.</caption><thead><tr><th scope="col">המצב</th><th scope="col">החלוקה</th><th scope="col">הכלל</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const c = compute(reg, compareFor(EXAMPLE));
	const home = compute(reg, EXAMPLE_HOME);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.heirs.length,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true, label: 'בן זוג נשוי ושני ילדים' }),
		details: renderDetails(reg, r, c, EXAMPLE),
		method: `<ol>${r.path.map((l) => `<li>${esc(l.he)}${lawCite(reg, l.rule)}</li>`).join('')}</ol>`,
		method_table: `<p>ועוד דוגמה: ${esc(describe(home))} בשווי שהוזן (דירה ${money(EXAMPLE_HOME.apartment, 0)} ₪ ועוד ${money(EXAMPLE_HOME.other, 0)} ₪), בן הזוג מקבל ${money(home.heirs[0].amount, 0)} ₪ וכל אח ${money(home.heirs[1].amount, 0)} ₪.</p>`,
		compare_table: casesTable(reg),
		sentence: describe(r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const n = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? 0 : Number(v); };
	const money0 = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	return {
		spouse: (root.querySelector(`input[name="${P}-sp"]:checked`) || {}).value || 'none',
		spouseApartment: on('apt'), children: n('kids'), mother: on('mom'), father: on('dad'),
		childLines: Array.from(root.querySelectorAll('[data-line="child"] [data-line-kids]')).map((i) => (i.value.trim() === '' ? 0 : Number(i.value))),
		siblingsFull: n('sibf'), siblingsFather: n('sibd'), siblingsMother: n('sibm'),
		siblingLines: Array.from(root.querySelectorAll('[data-line="sib"]')).map((row) => ({ side: (row.querySelector('[data-line-side]') || {}).value || 'full', kids: Number((row.querySelector('[data-line-kids]') || {}).value || 0) })),
		grandparents: n('gp'), grandOthersNone: on('gpn'), otherRelatives: on('unc'),
		apartment: money0('apt-v'), other: money0('oth-v'),
	};
}

const SP = { married: 'm', partner: 'p', none: 'n' };
const SIDE = { full: 'b', father: 'f', mother: 'm' };
const stateOf = (i) => encodeState({
	s: SP[i.spouse] || 'n', a: i.spouseApartment ? 1 : '', c: i.children || '', g: (i.childLines || []).join('.'),
	m: i.mother ? 1 : '', f: i.father ? 1 : '', b: i.siblingsFull || '', x: i.siblingsFather || '', y: i.siblingsMother || '',
	l: (i.siblingLines || []).map((l) => `${SIDE[l.side] || 'b'}${l.kids}`).join('.'), r: i.grandparents || '', o: i.grandOthersNone ? 1 : '', u: i.otherRelatives ? 1 : '',
	h: i.apartment || '', t: i.other || '',
});
const KEYS = ['s', 'a', 'c', 'g', 'm', 'f', 'b', 'x', 'y', 'l', 'r', 'o', 'u', 'h', 't'];
function inputOf(s) {
	if (!s.s) { return null; }
	const side = Object.fromEntries(Object.entries(SIDE).map(([k, v]) => [v, k]));
	return {
		spouse: Object.keys(SP).find((k) => SP[k] === s.s) || 'none', spouseApartment: s.a === '1', children: Number(s.c) || 0,
		childLines: s.g ? s.g.split('.').map(Number) : [], mother: s.m === '1', father: s.f === '1',
		siblingsFull: Number(s.b) || 0, siblingsFather: Number(s.x) || 0, siblingsMother: Number(s.y) || 0,
		siblingLines: s.l ? s.l.split('.').map((t) => ({ side: side[t.charAt(0)] || 'full', kids: Number(t.slice(1)) || 0 })) : [],
		grandparents: Number(s.r) || 0, grandOthersNone: s.o === '1', otherRelatives: s.u === '1',
		apartment: s.h ? Number(s.h) : '', other: s.t ? Number(s.t) : '',
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const y = reg.yerusha;
	const saveKey = `jtool-${TOOL_ID}`;
	let last = null;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(y.checked_on, y.refresh_every_days) || (y.next_update && new Date().toISOString().slice(0, 10) >= y.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרה התעדכנה'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const map = { children: 'kids', 'sib-full': 'sibf', 'sib-father': 'sibd', 'sib-mother': 'sibm', grand: 'gp', apartment: 'apartment', other: 'other', childLines: 'childLines', siblingLines: 'siblingLines' };
		for (const e of r.errors) {
			const key = map[e.field] || e.field;
			const box = root.querySelector(`#${P}-${key}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${key === 'apartment' ? 'apt-v' : key === 'other' ? 'oth-v' : key}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const syncVisibility = () => {
		const sp = (root.querySelector(`input[name="${P}-sp"]:checked`) || {}).value || 'none';
		form.querySelectorAll('[data-if-spouse]').forEach((el) => { el.hidden = sp === 'none'; });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		const c = r.ok ? compute(reg, compareFor(input)) : null;
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, c, input);
		if (sticky) { sticky.textContent = r.ok ? `${r.heirs.filter((h) => !h.unresolved).length}` : '—'; }
		last = { r, input };
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.line + (r.spouse === 'none' ? '' : '_spouse') }); }
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		syncVisibility();
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
	if (store.get(saveKey) && !fromHash) { const nEl = root.querySelector('[data-jtool-saved]'); if (nEl) { nEl.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const step = ev.target.closest('[data-step]');
		if (step) {
			const f = root.querySelector(`#${P}-${step.getAttribute('data-step')}`);
			if (f) { const max = Number(f.getAttribute('data-max')) || 30; f.value = String(Math.min(max, Math.max(0, (Number(f.value) || 0) + Number(step.getAttribute('data-delta'))))); schedule(); }
			return;
		}
		const addLine = ev.target.closest('[data-add-line]');
		if (addLine) {
			const kind = addLine.getAttribute('data-add-line');
			const list = root.querySelector(`[data-lines="${kind}"]`);
			const i = list.children.length;
			list.insertAdjacentHTML('beforeend', lineRow(kind, kind === 'sib' ? { side: 'full', kids: 1 } : 1, i));
			const first = list.lastElementChild && list.lastElementChild.querySelector('select, input');
			if (first) { first.focus(); }
			schedule();
			return;
		}
		const rm = ev.target.closest('[data-remove-line]');
		if (rm) { const row = rm.closest('li'); if (row) { row.remove(); } schedule(); return; }
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		const input = readForm(root);
		const r = last ? last.r : compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${describe(r)} · חושב ב-jus-tice.co.il לפי חוק הירושה ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if ((act === 'copy' || act === 'copy-table') && r.ok) {
			const ok = await copyText(`${describe(r)}\n${tableText(r)}\n(חושב ב-jus-tice.co.il לפי חוק הירושה, ${isoToHe(y.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.line : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { form.innerHTML = renderForm(reg, s); run(s); }
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
