/**
 * Wave 3 UI: betterment levy, how much, when, and how to contest it (HAD-498).
 * Board: Claude Design canvas "Tools wave 3" (co.il hetel-hashbacha at 1280 and 360, both modes).
 * Two modes: "כמה אשלם" (an estimate from the rise in value) and "קיבלתי שומה" (routes and deadlines
 * to contest an assessment). The plan strip shows the share of the rise the levy takes.
 */
import { compute, PLANS, EVENTS } from './hashbacha-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale,
} from './instrument.js';

export const TOOL_ID = 'hetel-hashbacha';
const P = 'jt8';

export const EXAMPLE = { mode: 'estimate', betterment: 800000, share: 50, plan: 'regular', event: 'sale', ownHome: false, areaBefore: '', areaAfter: '', tamaBeyond: '', mamadBeyond: '' };
export const EXAMPLE_HOME = { mode: 'estimate', betterment: 600000, share: 100, plan: 'regular', event: 'permit', ownHome: true, areaBefore: 100, areaAfter: 160 };
export const EXAMPLE_ASSESSMENT = { mode: 'assessment', levy: 84000, received: '2026-10-01', mine: 52000, kind: 'plan' };

const PLAN_LABEL = { regular: 'תוכנית, הקלה או שימוש חורג', pinui: 'פינוי ובינוי', seismic: 'תוכנית חיזוק מפני רעידות אדמה', tama38: 'היתר לפי תמ"א 38', mamad: 'בניית ממ"ד' };
const EVENT_LABEL = { sale: 'מוכרים', permit: 'מקבלים היתר בנייה', use: 'מתחילים שימוש חדש' };

function cite(text, href) { return ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>`; }
const lawCite = (reg, text) => cite(text, reg.betterment.law_url);
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
function daysBetween(a, b) { return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86400000); }

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
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const b = reg.betterment;
	const est = input.mode !== 'assessment';
	const moneyField = (id, label, value, hint, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(value ? money(value, 0) : '')}" placeholder="${esc(ph || '')}" aria-describedby="${hint ? `${P}-${id}-h ` : ''}${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	return `<fieldset class="jtool-field"><legend>מה לבדוק</legend><div class="jtool-chips">${chip('mode', 'estimate', 'כמה אשלם', est)}${chip('mode', 'assessment', 'קיבלתי שומה ואני רוצה להשיג', !est)}</div></fieldset>`
		+ `<div data-mode-estimate${est ? '' : ' hidden'}>`
		+ `<div class="jtool-row">${moneyField('bet', 'בכמה עלה שווי הנכס בגלל התוכנית', input.betterment, 'ההשבחה: השווי אחרי פחות השווי לפני, לפי שמאי', 'לדוגמה: 800,000')}`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-share">החלק שלכם בנכס</label><div class="jtool-input"><input id="${P}-share" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.share ?? 100)}" aria-describedby="${P}-share-h ${P}-share-e"><span class="jtool-input__suffix" aria-hidden="true">%</span></div><p class="jtool-hint" id="${P}-share-h">שותפים משלמים לפי החלק (${esc(b.partners_section)})</p><p class="jtool-error" id="${P}-share-e" role="alert"></p></div></div>`
		+ `<fieldset class="jtool-field"><legend>מה גרם לעליית השווי</legend><div class="jtool-chips">${PLANS.map((k) => chip('plan', k, PLAN_LABEL[k], (input.plan || 'regular') === k)).join('')}</div></fieldset>`
		+ `<div data-if-plan="tama38"${input.plan === 'tama38' ? '' : ' hidden'}>${moneyField('tama', 'החלק מההשבחה שמקורו בשטח מעבר ל-2.5 קומות', input.tamaBeyond, 'עליו בלבד היטל של רבע (סעיף 19(ב)(10)(א))', '0 אם אין')}</div>`
		+ `<div data-if-plan="mamad"${input.plan === 'mamad' ? '' : ' hidden'}>${moneyField('mamx', 'החלק מההשבחה שמקורו בשטח נוסף, מעבר לממ"ד', input.mamadBeyond, 'רק ממ"ד בשטח שנקבע לפי חוק ההתגוננות האזרחית פטור (סעיף 19(ב)(9)). על שטח נוסף: היטל רגיל של מחצית (סעיף 3)', '0 אם אין')}</div>`
		+ `<fieldset class="jtool-field"><legend>מתי זה קורה</legend><div class="jtool-chips">${EVENTS.map((k) => chip('evt', k, EVENT_LABEL[k], (input.event || 'sale') === k)).join('')}</div></fieldset>`
		+ `<div data-if-event="permit"${input.event === 'permit' ? '' : ' hidden'}><div class="jtool-chips">${chip('home', '1', 'בונים או מרחיבים דירה למגורים שלי או של קרוב', input.ownHome, 'checkbox')}</div>`
		+ `<div class="jtool-row" data-if-home${input.ownHome ? '' : ' hidden'} style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${P}-ab">שטח הדירה היום</label><div class="jtool-input"><input id="${P}-ab" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.areaBefore ?? '')}" aria-describedby="${P}-areaBefore-e"><span class="jtool-input__suffix" aria-hidden="true">מ"ר</span></div><p class="jtool-error" id="${P}-areaBefore-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-aa">שטח הדירה אחרי הבנייה</label><div class="jtool-input"><input id="${P}-aa" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.areaAfter ?? '')}" aria-describedby="${P}-areaAfter-h ${P}-areaAfter-e"><span class="jtool-input__suffix" aria-hidden="true">מ"ר</span></div><p class="jtool-hint" id="${P}-areaAfter-h">עד ${b.residence_max_sqm} מ"ר אחרי הבנייה: לא משלמים בהיתר (${esc(b.residence_section)})</p><p class="jtool-error" id="${P}-areaAfter-e" role="alert"></p></div></div></div>`
		+ `</div>`
		+ `<div data-mode-assessment${est ? ' hidden' : ''}>`
		+ `<div class="jtool-row">${moneyField('levy', 'סכום ההיטל בשומה של הוועדה', input.levy, '', 'לדוגמה: 84,000')}`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-rcv">מתי קיבלתם את השומה</label><input id="${P}-rcv" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.received || ''))}" placeholder="לדוגמה: 1.10.2026" aria-describedby="${P}-received-e"><p class="jtool-error" id="${P}-received-e" role="alert"></p></div></div>`
		+ `<div class="jtool-row">${moneyField('mine', 'ההיטל לפי שמאי מטעמכם (לא חובה)', input.mine, 'כדי לראות כמה אפשר לחסוך', '')}`
		+ `<fieldset class="jtool-field"><legend>סוג השומה</legend><div class="jtool-chips">${chip('kind', 'plan', 'שומה עליי (מימוש)', input.kind !== 'schedule')}${chip('kind', 'schedule', 'לוח שומה לכל התוכנית', input.kind === 'schedule')}</div></fieldset></div>`
		+ `</div>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	if (r.mode === 'assessment') {
		return `אפשר להשיג על השומה עד ${isoToHe(r.appealBy)}${r.recheck && !r.schedule ? `, ובהיטל של עד ${money(reg.betterment.recheck_max, 0)} ₪ גם לבקש מהוועדה לבחון מחדש` : ''}.${r.saving ? ` לפי השמאי שלכם, ההפרש: ${nis(r.saving)}.` : ''}`;
	}
	if (r.levy === 0) { return `${PLAN_LABEL[r.plan]}: אין היטל השבחה על החלק הזה (${reg.betterment.rates[r.plan].section}).`; }
	const part = { tama38: 'שמקורו בשטח שמעבר ל-2.5 קומות', mamad: 'שמקורו בשטח נוסף, מעבר לממ"ד' }[r.plan];
	const base = part && r.beyond !== null
		? `היטל השבחה של ${nis(r.levy)}: ${r.rate[0]}/${r.rate[1]} מהחלק ${part} (${nis(r.beyond)}). השאר פטור.`
		: `היטל השבחה של ${nis(r.levy)}: ${r.rate[0]}/${r.rate[1]} מההשבחה ${r.share < 100 ? `שלכם (${r.share}% מ-${nis(r.betterment)})` : `של ${nis(r.betterment)}`}.`;
	if (r.deferred > 0) { return `${base} ${r.due > 0 ? `עכשיו משלמים ${nis(r.due)}, ו-${nis(r.deferred)} נדחים` : 'בהיתר לא משלמים: הבנייה למגורים שלכם לא נחשבת מימוש'}.`; }
	return `${base} משלמים ${r.timing}.`;
}

/** The plan strip: the rise in value, and the part of it the levy takes. */
function strip(reg, r) {
	if (r.mode !== 'estimate' || !r.yours) { return ''; }
	const take = r.levy / r.yours;
	const due = r.due / r.yours;
	return `<div class="jt8-strip" aria-hidden="true"><span class="jt8-strip__due" style="width:${(due * 100).toFixed(2)}%"></span><span class="jt8-strip__deferred" style="width:${((take - due) * 100).toFixed(2)}%"></span><span class="jt8-strip__keep"></span></div>`
		+ `<p class="jt8-strip__legend" aria-hidden="true"><span><i class="jt8-k jt8-k--due"></i>משלמים עכשיו</span>${r.deferred > 0 ? '<span><i class="jt8-k jt8-k--deferred"></i>נדחה</span>' : ''}<span><i class="jt8-k jt8-k--keep"></i>נשאר אצלכם</span></p>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	if (r.mode === 'assessment') {
		const today = opts.today || r.received;
		const left = daysBetween(today, r.appealBy);
		const state = left < 0 ? '<p class="jtool-state jtool-state--danger">✕ המועד עבר. יושב ראש ועדת הערר רשאי להאריך מטעמים מיוחדים</p>'
			: left <= 10 ? `<p class="jtool-state jtool-state--warn">! נשארו ${left} ימים</p>` : `<p class="jtool-state jtool-state--ok">✓ יש זמן: ${left} ימים</p>`;
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
			+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}שומה של ${esc(nis(r.levy))} שהתקבלה ב-${isoToHe(r.received)}</p>`
			+ `<strong class="jtool-verdict__figure">עד <bdi>${isoToHe(r.appealBy)}</bdi></strong>`
			+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p></div>`
			+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
			+ `<details class="jtool-path" open><summary>שלוש דרכים להשיג, לפי הסעיף</summary><ul class="jtool-conds">${routesList(reg, r)}</ul></details>`;
	}
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state ${r.levy === 0 ? 'jtool-state--ok' : 'jtool-state--info'}">${r.levy === 0 ? '✓ פטור' : `${esc(PLAN_LABEL[r.plan])}: ${r.beyond !== null ? 'פטור חלקי' : `${r.rate[0]}/${r.rate[1]}`}`}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}היטל השבחה ${r.share < 100 ? `על ${r.share}% מ-` : 'על '}${esc(nis(r.betterment))} השבחה</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.deferred > 0 ? r.due : r.levy, (r.deferred > 0 ? r.due : r.levy) % 1 ? 2 : 0)}</strong>`
		+ strip(reg, r)
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<p class="jtool-scope">הערכה מהמספר שהזנתם. הסכום הקובע הוא בשומה של הוועדה המקומית, צמוד למדד הנמוך מבין מדד המחירים לצרכן ומדד תשומות הבנייה (${esc(reg.betterment.linkage_section)}).</p></div>`
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '')
		+ `<details class="jtool-path" open><summary>איך חישבנו</summary><ol>${r.lines.map((l) => `<li>${esc(l.he)}: <bdi>${esc(nis(l.value))}</bdi>${lawCite(reg, l.section)}</li>`).join('')}<li>מועד התשלום: ${esc(r.timing)}${lawCite(reg, reg.betterment.pay_section)}</li></ol></details>`;
}

function routesList(reg, r) {
	const b = reg.betterment;
	const items = [];
	if (r.recheck && !r.schedule) { items.push(`<li class="jtool-cond jtool-cond--yes"><span class="jtool-cond__mark" aria-hidden="true">1</span><span><strong>בקשה לבחינה מחדש בוועדה</strong>: בהיטל של עד ${money(b.recheck_max, 0)} ₪, עם שומה של שמאי מטעמכם, עד ${isoToHe(r.appealBy)}. השמאי של הוועדה מחליט תוך ${b.recheck_decide_days} ימים.${lawCite(reg, b.recheck_section)}</span></li>`); }
	items.push(`<li class="jtool-cond jtool-cond--yes"><span class="jtool-cond__mark" aria-hidden="true">${items.length + 1}</span><span><strong>שמאי מכריע</strong>: כשהמחלוקת רק על הסכום, פונים ליושב ראש מועצת שמאי המקרקעין עד ${isoToHe(r.appealBy)}. על החלטתו אפשר לערור תוך ${b.appraiser_appeal_days} ימים.${lawCite(reg, b.appraiser_section)}</span></li>`);
	items.push(`<li class="jtool-cond jtool-cond--yes"><span class="jtool-cond__mark" aria-hidden="true">${items.length + 1}</span><span><strong>ערר לוועדת הערר לפיצויים ולהיטל השבחה</strong>: גם כשחולקים על עצם החיוב, עד ${isoToHe(r.appealBy)}${r.schedule ? ' (שנה מהצגת לוח השומה)' : ` (${b.appeal_days} ימים)`}.${lawCite(reg, b.appeal_section)}</span></li>`);
	return items.join('');
}

export function renderDetails(reg, r, compareR) {
	if (!r.ok) { return ''; }
	const b = reg.betterment;
	if (r.mode === 'assessment') {
		let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועד שלכם</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
			+ `<ol class="jtool-steps"><li>קיבלתם את השומה: <bdi>${isoToHe(r.received)}</bdi></li><li>המועד האחרון להשגה בכל אחת מהדרכים: <strong><bdi>${isoToHe(r.appealBy)}</bdi></strong>${lawCite(reg, b.appeal_section)}</li><li>מכירה או מימוש אחר לא יירשמו בטאבו בלי אישור שההיטל שולם או שניתנה ערובה לתשלומו.${lawCite(reg, 'סעיף 10(א)')}</li></ol></div>`;
		if (r.mine !== null) {
			out += `<div class="jtool-compare"><h3>כמה אפשר לחסוך</h3><div class="jtool-compare__grid"><div class="jtool-compare__col"><p>א. לפי שומת הוועדה</p><strong>${ils(r.levy, 0)}</strong></div><div class="jtool-compare__col jtool-compare__col--b"><p>ב. לפי השמאי שלכם</p><strong>${ils(r.mine, 0)}</strong></div></div>`
				+ `<p class="jtool-delta">ההפרש: ${ils(r.saving || 0, 0)}. מול זה: שכר השמאי ועורך הדין, והזמן.</p></div>`;
		}
		return out;
	}
	let out = '';
	if (compareR && compareR.ok) {
		out += `<div class="jtool-compare" data-compare><h3>מה אם: ${r.plan === 'regular' ? 'זו הייתה תוכנית פינוי ובינוי' : 'זו הייתה תוכנית רגילה'}</h3><div data-compare-out>${renderCompareOut(r, compareR)}</div></div>`;
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3>מה עוד כדאי לדעת</h3></div><ul class="jtool-notes">`
		+ `<li><strong>מי משלם:</strong> בעל המקרקעין, ואם הם מוחכרים לדורות, החוכר.${lawCite(reg, 'סעיף 2(א)')}</li>`
		+ `<li><strong>מימוש חלקי:</strong> משלמים רק על החלק שמומש.${lawCite(reg, b.partial_section)}</li>`
		+ `<li><strong>מחסן עד ${b.storage_max_sqm} מ"ר</strong> לכל דירה נחשב חלק מדירת המגורים לעניין הפטור.${lawCite(reg, b.storage_section)}</li>`
		+ `<li><strong>הוועדה דחתה את השומה עד המימוש?</strong> אפשר לדרוש שתיערך, והיא נערכת תוך ${b.demand_days} ימים.${lawCite(reg, b.demand_section)}</li></ul></div>`;
	return out;
}

export function renderCompareOut(r, c) {
	const val = (x) => (x.deferred > 0 ? x.due : x.levy);
	const delta = Math.round((val(c) - val(r)) * 100) / 100;
	return `<div class="jtool-compare__grid"><div class="jtool-compare__col"><p>א. ${esc(PLAN_LABEL[r.plan])}</p><strong>${ils(val(r), 0)}</strong></div>`
		+ `<div class="jtool-compare__col jtool-compare__col--b"><p>ב. ${esc(PLAN_LABEL[c.plan])}</p><strong>${ils(val(c), 0)}</strong></div></div>`
		+ `<p class="jtool-delta" aria-live="polite">${delta === 0 ? 'אותו סכום.' : `${delta > 0 ? 'עוד' : 'פחות'} ${ils(Math.abs(delta), 0)}.`}</p>`;
}

export function compareFor(input) { return Object.assign({}, input, { plan: input.plan === 'regular' ? 'pinui' : 'regular' }); }

/** Page section: the levy on common rises in value, by plan type, from the same engine. */
export function levyTable(reg) {
	const rows = [200000, 500000, 800000, 1500000, 3000000].map((v) => {
		const cells = ['regular', 'pinui', 'mamad'].map((p) => { const r = compute(reg, { mode: 'estimate', betterment: v, share: 100, plan: p, event: 'sale' }); return ils(r.levy, 0); });
		return `<tr><td data-th="ההשבחה">${ils(v, 0)}</td><td data-th="תוכנית רגילה (1/2)">${cells[0]}</td><td data-th="פינוי ובינוי (1/4)">${cells[1]}</td><td data-th="ממ&quot;ד בשטח שנקבע (פטור)">${cells[2]}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>היטל ההשבחה לפי עליית השווי וסוג התוכנית, מאותו מנוע. פינוי ובינוי: אלא אם הרשות המקומית קבעה אחרת לאזור. ממ"ד: רק בשטח שנקבע לפי חוק ההתגוננות האזרחית; שטח נוסף משלם מחצית.</caption><thead><tr><th scope="col">ההשבחה</th><th scope="col">תוכנית רגילה (1/2)</th><th scope="col">פינוי ובינוי (1/4)</th><th scope="col">ממ"ד בשטח שנקבע (פטור)</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const c = compute(reg, compareFor(EXAMPLE));
	const home = compute(reg, EXAMPLE_HOME);
	const a = compute(reg, EXAMPLE_ASSESSMENT);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.levy,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, c),
		method: `<ol>${r.lines.map((l) => `<li>${esc(l.he)}: <bdi>${esc(nis(l.value))}</bdi>${lawCite(reg, l.section)}</li>`).join('')}</ol>`,
		method_table: `<p>ועוד שתי דוגמאות. הרחבת דירה של 100 מ"ר ל-160 מ"ר למגורים שלכם, השבחה של ${nis(EXAMPLE_HOME.betterment)}: ${esc(verdictSentence(reg, home))} ושומה של ${nis(EXAMPLE_ASSESSMENT.levy)} שהתקבלה ב-${isoToHe(EXAMPLE_ASSESSMENT.received)}: ${esc(verdictSentence(reg, a))}</p>`,
		compare_table: levyTable(reg),
		sentence: verdictSentence(reg, r),
		assessment: { input: EXAMPLE_ASSESSMENT, result: renderResult(reg, a, { example: true, today: EXAMPLE_ASSESSMENT.received }), details: renderDetails(reg, a), sentence: verdictSentence(reg, a) },
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	const mode = checked('mode') === 'assessment' ? 'assessment' : 'estimate';
	if (mode === 'assessment') {
		const mine = val(`#${P}-mine`).trim();
		return { mode, levy: parseMoney(val(`#${P}-levy`)), received: toIso(val(`#${P}-rcv`)), mine: mine === '' ? '' : parseMoney(mine), kind: checked('kind') || 'plan' };
	}
	const num = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : Number(v.replace(/,/g, '')); };
	return {
		mode, betterment: parseMoney(val(`#${P}-bet`)), share: num('share'), plan: checked('plan') || 'regular', event: checked('evt') || 'sale',
		ownHome: Boolean(checked('home')), areaBefore: num('ab'), areaAfter: num('aa'), tamaBeyond: val(`#${P}-tama`).trim() === '' ? '' : parseMoney(val(`#${P}-tama`)),
		mamadBeyond: val(`#${P}-mamx`).trim() === '' ? '' : parseMoney(val(`#${P}-mamx`)),
	};
}

const PL = { regular: 'r', pinui: 'p', seismic: 's', tama38: 't', mamad: 'm' };
const EV = { sale: 's', permit: 'p', use: 'u' };
const stateOf = (i) => (i.mode === 'assessment'
	? encodeState({ k: 'a', l: i.levy, d: i.received, y: i.mine, j: i.kind === 'schedule' ? 's' : '' })
	: encodeState({ k: 'e', b: i.betterment, s: i.share, p: PL[i.plan] || 'r', e: EV[i.event] || 's', h: i.ownHome ? 1 : '', o: i.areaBefore, n: i.areaAfter, t: i.tamaBeyond, x: i.mamadBeyond }));
const KEYS = ['k', 'l', 'd', 'y', 'j', 'b', 's', 'p', 'e', 'h', 'o', 'n', 't', 'x'];
function inputOf(s) {
	if (s.k === 'a' && s.l) { return { mode: 'assessment', levy: Number(s.l), received: s.d || '', mine: s.y === undefined ? '' : Number(s.y), kind: s.j === 's' ? 'schedule' : 'plan' }; }
	if (s.k === 'e' && s.b) {
		const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
		return { mode: 'estimate', betterment: Number(s.b), share: s.s === undefined ? 100 : Number(s.s), plan: back(PL, s.p, 'regular'), event: back(EV, s.e, 'sale'), ownHome: s.h === '1', areaBefore: s.o === undefined ? '' : Number(s.o), areaAfter: s.n === undefined ? '' : Number(s.n), tamaBeyond: s.t === undefined ? '' : Number(s.t), mamadBeyond: s.x === undefined ? '' : Number(s.x) };
	}
	return null;
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const b = reg.betterment;
	const today = new Date().toISOString().slice(0, 10);
	const saveKey = `jtool-${TOOL_ID}`;
	let last = null;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(b.checked_on, b.refresh_every_days)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהחוק התעדכן'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const ids = { betterment: 'bet', share: 'share', tamaBeyond: 'tama', mamadBeyond: 'mamx', areaBefore: 'ab', areaAfter: 'aa', levy: 'levy', received: 'rcv', mine: 'mine' };
		const boxes = { betterment: 'bet', tamaBeyond: 'tama', mamadBeyond: 'mamx' };
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${boxes[e.field] || e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${ids[e.field] || e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const mode = (root.querySelector(`input[name="${P}-mode"]:checked`) || {}).value === 'assessment' ? 'assessment' : 'estimate';
		form.querySelectorAll('[data-mode-estimate]').forEach((el) => { el.hidden = mode !== 'estimate'; });
		form.querySelectorAll('[data-mode-assessment]').forEach((el) => { el.hidden = mode !== 'assessment'; });
		const plan = (root.querySelector(`input[name="${P}-plan"]:checked`) || {}).value;
		form.querySelectorAll('[data-if-plan]').forEach((el) => { el.hidden = el.getAttribute('data-if-plan') !== plan; });
		const evt = (root.querySelector(`input[name="${P}-evt"]:checked`) || {}).value;
		form.querySelectorAll('[data-if-event]').forEach((el) => { el.hidden = el.getAttribute('data-if-event') !== evt; });
		const home = Boolean(root.querySelector(`input[name="${P}-home"]:checked`));
		form.querySelectorAll('[data-if-home]').forEach((el) => { el.hidden = !home; });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		const c = r.ok && r.mode === 'estimate' ? compute(reg, compareFor(input)) : null;
		showErrors(r);
		result.innerHTML = renderResult(reg, r, { today });
		details.innerHTML = renderDetails(reg, r, c);
		if (sticky) { sticky.innerHTML = r.ok ? (r.mode === 'assessment' ? `<bdi>${isoToHe(r.appealBy)}</bdi>` : ils(r.deferred > 0 ? r.due : r.levy, 0)) : '—'; }
		last = { r, input };
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.mode === 'assessment' ? (r.recheck ? 'assessment_small' : 'assessment') : r.plan }); }
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
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
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const btn = ev.target.closest('[data-act]');
		if (!btn) { return; }
		const act = btn.getAttribute('data-act');
		const input = readForm(root);
		const r = last ? last.r : compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok && r.mode === 'assessment') {
			download('hetel-hashbacha.ics', 'text/calendar;charset=utf-8', ics([{ date: r.appealBy, summary: 'היטל השבחה: מועד אחרון להשגה על השומה' }], new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, כתובת נכס או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי התוספת השלישית לחוק התכנון והבניה ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(b.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.mode : 'error' });
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
