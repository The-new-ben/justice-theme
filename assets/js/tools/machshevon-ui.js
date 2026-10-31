/**
 * The divorce calculator and price list UI (HAD-616, 31.10.2026): "מחשבון גירושין" and "מחירון גירושין" (machshevon-gerushin,
 * prefix jt72) on /divorce-lawyer/, in the prices chapter. The picture is a fee schedule, not a card: the three figures (low,
 * expected, high) on one ruled band, each side's share under it, then the itemised bill in the order of an official schedule
 * (fees, professionals, experts), each line marked "רשמי" (a regulation's amount), "שוק" (what offices publish) or "שלכם"
 * (the reader's quote); then the four routes side by side, what raises and what lowers this bill (computed, never asserted),
 * the time, and the price list itself (the page table): every row with its source and the day it was read.
 */
import { mgCompute, mgScenarios, mgSavings, mgMarket, mgOfficial, mgClock, mgDuration, mgBandOf, MG_ROUTES, MG_SUBJECTS, MG_EXPERTS } from './machshevon-engine.js';
import {
	esc, money, isoToHe, encodeState, decodeState, track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'machshevon-gerushin';
export const PAGE = '/divorce-lawyer/';
const P = 'jt72';

export const ROUTE_HE = { agree: 'בהסכמה', mediate: 'בגישור', compromise: 'פשרה באמצע הדרך', contested: 'מחלוקת מלאה' };
const ROUTE_LONG = {
	agree: 'גירושין בהסכמה: הסכם חתום שמוגש לאישור',
	mediate: 'גישור גירושין: מגשר אחד לשניכם, ובדיקה של עורך דין לכל צד',
	compromise: 'פשרה באמצע הדרך: נפתחו תביעות, ונסגרו בהסכם לפני פסק דין',
	contested: 'מחלוקת מלאה: בקשה ליישוב סכסוך, תביעות, מומחים ופסק דין',
};
const FORUM_HE = { rabbinical: 'בית הדין הרבני', family: 'בית המשפט לענייני משפחה' };
const SUBJ_HE = { support: 'מזונות ילדים', custody: 'משמורת וזמני שהות', property: 'רכוש ואיזון משאבים' };
const EXP_HE = { actuary: 'אקטואר לחלוקת פנסיה', appraiser: 'שמאי מקרקעין לדירה', business: 'מעריך שווי לעסק', courtExpert: 'מומחה מטעם בית המשפט', coordinator: 'מתאם הורי' };
const MORE_HE = { appeal: 'ערעור', execution: 'הוצאה לפועל', prenup: 'הסכם ממון', notary: 'אימות חתימה אצל נוטריון' };
const REP_HE = { each: 'עורך דין לכל צד', one: 'עורך דין אחד לשניכם', self: 'בלי עורך דין', aid: 'סיוע משפטי לצד א' };
const SPLIT_HE = { equal: 'חצי-חצי', a: 'צד א משלם', b: 'צד ב משלם', pct: 'לפי אחוז' };
const KIND_HE = { official: 'רשמי', market: 'שוק', own: 'שלכם' };
const PAYER_HE = { a: 'צד א', b: 'צד ב', each: 'כל צד', split: 'משותף' };

const BLANK = { route: 'agree', forum: 'rabbinical', support: false, custody: false, property: false, actuary: false, appraiser: false, business: false, courtExpert: false, coordinator: false, hours: '', joint: false, appeal: false, execution: false, prenup: false, notary: false, pleader: false, rep: 'each', quote: '', quoteVat: 'plus', split: 'equal', pct: '', abroad: false };
/** One click to a common profile: selections only, never a price. */
export const PRESETS = {
	plain: { he: 'בהסכמה, בלי ילדים ובלי דירה', route: 'agree' },
	kids: { he: 'בהסכמה, עם ילדים ודירה', route: 'agree', support: true, custody: true, property: true },
	mediate: { he: 'בגישור: ילדים, דירה ופנסיה', route: 'mediate', support: true, custody: true, property: true, actuary: true, appraiser: true },
	half: { he: 'נפתחו תביעות ונסגרו בפשרה', route: 'compromise', forum: 'family', support: true, custody: true, property: true, appraiser: true },
	war: { he: 'מחלוקת מלאה על הכול', route: 'contested', forum: 'family', support: true, custody: true, property: true, actuary: true, appraiser: true, courtExpert: true },
};
export function mgPreset(key) {
	const p = PRESETS[key];
	if (!p) { return null; }
	const out = Object.assign({}, BLANK);
	for (const k of Object.keys(BLANK)) { if (p[k] !== undefined) { out[k] = p[k]; } }
	return out;
}
export const EXAMPLE = mgPreset('kids');

const nis = (n) => `${money(n, 0)} ש"ח`;
const shk = (n) => `<span class="jtool-amt"><bdi>${money(n, 0)}</bdi> ₪</span>`;
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text || 'מקור')}</a>` : '');
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const box = (name, label, checked, hint = '') => `<label class="jtool-chip ${P}-tick"><input type="checkbox" name="${P}-${name}" value="1"${checked ? ' checked' : ''}><span>${esc(label)}${hint ? ` <small>${esc(hint)}</small>` : ''}</span></label>`;
const mgUrl = (u) => { try { return decodeURI(u); } catch (e) { return u; } };
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
/** A source's name: a link for official pages and Adv. Maya Rotenberg's office, the name and the site for other offices. */
const srcName = (s) => (s.link ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name_he)}</a>` : `${esc(s.name_he)} <span dir="ltr">${esc(host(s.url))}</span>`);
const months = (d) => (d && d.low !== null ? (d.low === d.high ? `${d.low} חודשים` : `${d.low} עד ${d.high} חודשים`) : 'לא נבדק');

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, BLANK, input || {});
	const disputed = i.route === 'compromise' || i.route === 'contested';
	const preset = Object.keys(PRESETS).find((k) => { const x = mgPreset(k); return Object.keys(BLANK).every((f) => String(x[f]) === String(i[f])); }) || '';
	const field = (id, label, v, ph, hint, suffix) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label>${suffix ? '<div class="jtool-input jtool-input--money">' : ''}<input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v === '' || v === undefined || v === null ? '' : (suffix === '₪' ? money(v, 0) : v))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${suffix ? `<span class="jtool-input__suffix" aria-hidden="true">${suffix}</span></div>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const more = Boolean(i.quote || i.split !== 'equal' || i.abroad);
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>1. המסלול</legend><div class="jtool-chips ${P}-seg">${MG_ROUTES.map((r) => chip('route', r, ROUTE_HE[r], i.route === r)).join('')}</div><p class="jtool-hint" data-${P}-route-hint>${esc(ROUTE_LONG[i.route])}</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>2. הערכאה</legend><div class="jtool-chips ${P}-seg">${chip('forum', 'rabbinical', FORUM_HE.rabbinical, i.forum === 'rabbinical')}${chip('forum', 'family', FORUM_HE.family, i.forum === 'family')}</div><p class="jtool-hint">איפה מאשרים את ההסכם או מגישים את התביעות. הגט עצמו ניתן תמיד בבית הדין הרבני.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>3. מה פתוח ביניכם</legend><div class="jtool-chips">${MG_SUBJECTS.map((s) => box(s, SUBJ_HE[s], i[s])).join('')}</div><p class="jtool-hint">בהסכמה ובגישור כל נושא נסגר בהסכם אחד; במחלוקת כל נושא הוא תביעה עם אגרה משלה.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>4. מומחים</legend><div class="jtool-chips">${MG_EXPERTS.map((x) => box(x, EXP_HE[x], i[x])).join('')}</div>`
		+ `<div class="jtool-row" data-if-coord${i.coordinator ? '' : ' hidden'}>${field('hrs', 'שעות תיאום הורי', i.hours, 'המספר שלכם', 'בלי מספר: המחיר לשעה אחת', '')}</div>`
		+ `<div data-if-disputed${disputed ? '' : ' hidden'}>${box('joint', 'מומחה מוסכם אחד במקום מומחה לכל צד', i.joint)}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>5. אחרי פסק הדין ותוספות</legend><div class="jtool-chips">${Object.keys(MORE_HE).map((x) => box(x, MORE_HE[x], i[x])).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>6. ייצוג</legend><div class="jtool-chips">${Object.keys(REP_HE).map((r) => chip('rep', r, REP_HE[r], i.rep === r)).join('')}</div><div data-if-rb${i.forum === 'rabbinical' ? '' : ' hidden'}>${box('pleader', 'טוען רבני במקום עורך דין', i.pleader, 'רק בבית הדין הרבני')}</div></fieldset>`
		+ `<details class="jtool-more ${P}-more"${more ? ' open' : ''}><summary>עוד: הצעת מחיר שקיבלתם, חלוקת ההוצאות, בן זוג בחו"ל</summary>`
		+ `<div class="jtool-row">${field('quote', 'הצעת מחיר שקיבלתם מעורך דין (צד א)', i.quote, 'לא חובה', 'מחליפה את הטווח שמשרדים מפרסמים, רק לצד א', '₪')}<fieldset class="jtool-field"><legend>ההצעה</legend><div class="jtool-chips">${chip('qvat', 'plus', 'ועוד מע"מ', i.quoteVat !== 'incl')}${chip('qvat', 'incl', 'כולל מע"מ', i.quoteVat === 'incl')}</div></fieldset></div>`
		+ `<fieldset class="jtool-field"><legend>מי משלם את ההוצאות המשותפות (מגשר, מומחה מוסכם, אגרת האישור)</legend><div class="jtool-chips">${Object.keys(SPLIT_HE).map((s) => chip('split', s, SPLIT_HE[s], i.split === s)).join('')}</div></fieldset>`
		+ `<div class="jtool-row" data-if-pct${i.split === 'pct' ? '' : ' hidden'}>${field('pct', 'החלק של צד א', i.pct, 'לדוגמה: 60', 'באחוזים; צד ב משלם את השאר', '%')}</div>`
		+ `<div class="jtool-chips">${box('abroad', 'אחד מבני הזוג גר בחו"ל', i.abroad)}</div>`
		+ '</details>';
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const t = r.totals;
	const subj = r.subjects.length ? `, ${r.subjects.map((s) => SUBJ_HE[s]).join(', ')}` : '';
	return `${ROUTE_HE[r.route]} ב${FORUM_HE[r.forum]}${subj}: צפוי כ-${nis(t.mid.gross)} לשניכם יחד, בטווח של ${nis(t.low.gross)} עד ${nis(t.high.gross)}, כולל מע"מ ${r.vatPct}%. צד א כ-${nis(r.sides.a.mid)}, צד ב כ-${nis(r.sides.b.mid)}.`;
}

/** The three figures on one ruled band: low, expected, high. */
function band(r) {
	const t = r.totals;
	const span = Math.max(1, t.high.gross - t.low.gross);
	const at = Math.round((t.mid.gross - t.low.gross) / span * 1000) / 10;
	return `<div class="${P}-band" role="group" aria-label="נמוך, צפוי וגבוה">`
		+ `<div class="${P}-band__rule" aria-hidden="true"><i style="inset-inline-start:${Math.max(0, Math.min(100, at))}%"></i></div>`
		+ `<dl class="${P}-band__dl"><div><dt>נמוך</dt><dd>${shk(t.low.gross)}</dd></div><div class="${P}-band__mid"><dt>צפוי</dt><dd>${shk(t.mid.gross)}</dd></div><div><dt>גבוה</dt><dd>${shk(t.high.gross)}</dd></div></dl></div>`;
}

/** Each side's share, expected and the range. */
function sidesBox(r) {
	const row = (k, he) => `<div class="${P}-side"><dt>${he}</dt><dd><strong>${shk(r.sides[k].mid)}</strong><small><bdi>${money(r.sides[k].low, 0)}</bdi>–<bdi>${money(r.sides[k].high, 0)}</bdi></small></dd></div>`;
	return `<dl class="${P}-sides">${row('a', 'צד א')}${row('b', 'צד ב')}</dl>`;
}

/** The itemised bill, in the order of a schedule: fees, professionals, experts. */
export function bill(reg, r) {
	if (!r.ok) { return ''; }
	const order = { fee: 0, pro: 1, expert: 2 };
	const lines = r.lines.slice().sort((a, b) => order[a.group] - order[b.group]);
	const vat = (v, l) => (l.vat ? v * (100 + r.vatPct) / 100 : v);
	const cell = (l) => (l.low === l.high ? shk(vat(l.mid, l)) : `${shk(vat(l.mid, l))}<small><bdi>${money(vat(l.low, l), 0)}</bdi>–<bdi>${money(vat(l.high, l), 0)}</bdi></small>`) + (l.payer === 'each' ? '<small>לכל צד</small>' : '');
	const src = (l) => (l.kind === 'official' ? cite(l.section || 'התקנה', l.url) : l.kind === 'market' ? ` <a class="jtool-cite" href="#${P}-row-${esc(l.id)}">${l.n} מקורות</a>` : ' <small>ההצעה שהזנתם</small>');
	const rows = lines.map((l) => `<tr class="${P}-l ${P}-l--${l.kind}"><td class="${P}-c-item" data-th="פריט">${esc(l.he)}</td><td class="${P}-c-kind" data-th="סוג"><span class="${P}-kind ${P}-kind--${l.kind}">${KIND_HE[l.kind]}</span></td><td class="${P}-c-amt" data-th="צפוי (טווח)">${cell(l)}</td><td class="${P}-c-who" data-th="מי משלם">${PAYER_HE[l.payer]}</td><td class="${P}-c-src" data-th="מקור">${src(l)}</td></tr>`).join('');
	const t = r.totals;
	return `<div class="jtool-scroll" role="region" aria-label="החשבון המפורט" tabindex="0"><table class="jtool-table ${P}-bill"><caption>החשבון המפורט, כולל מע"מ ${r.vatPct}% על שירותים מקצועיים (אגרות פטורות ממע"מ)</caption>`
		+ `<thead><tr><th scope="col">פריט</th><th scope="col">סוג</th><th scope="col">צפוי (טווח)</th><th scope="col">מי משלם</th><th scope="col">מקור</th></tr></thead><tbody>${rows}</tbody>`
		+ `<tfoot><tr><th scope="row" colspan="2">סך הכול לשניכם</th><td data-th="צפוי (טווח)">${shk(t.mid.gross)}<small><bdi>${money(t.low.gross, 0)}</bdi>–<bdi>${money(t.high.gross, 0)}</bdi></small></td><td colspan="2" data-th="מתוכו מע״מ"><small>מתוכו מע"מ: <bdi>${money(t.mid.vat, 0)}</bdi> ₪</small></td></tr></tfoot></table></div>`;
}

/** The four routes, same selections, side by side. */
export function scenarioTable(reg, input, r) {
	const sc = mgScenarios(reg, input);
	const cols = MG_ROUTES.map((k) => {
		const x = sc[k];
		const now = k === r.route;
		return `<tr class="${now ? `${P}-now` : ''}"><th scope="row">${esc(ROUTE_HE[k])}${now ? ' <small>(הבחירה שלכם)</small>' : ''}</th><td data-th="צפוי">${x ? shk(x.mid) : '—'}</td><td data-th="טווח">${x ? `<bdi>${money(x.low, 0)}</bdi>–<bdi>${money(x.high, 0)}</bdi>` : '—'}</td><td data-th="צד א">${x ? shk(x.a) : '—'}</td><td data-th="זמן">${x ? esc(months(x.dur)) : '—'}</td><td data-th=""><button type="button" class="jtool-linkbtn" data-act="route" data-route="${k}"${now ? ' disabled' : ''}>לחשב כך</button></td></tr>`;
	}).join('');
	return `<div class="jtool-scroll" role="region" aria-label="ארבעת המסלולים זה לצד זה" tabindex="0"><table class="jtool-table ${P}-scen"><caption>אותם נושאים ואותם מומחים, בארבעת המסלולים (${esc(FORUM_HE[r.forum])}, כולל מע"מ)</caption><thead><tr><th scope="col">מסלול</th><th scope="col">צפוי לשניכם</th><th scope="col">טווח</th><th scope="col">צד א</th><th scope="col">זמן</th><th scope="col"><span class="jtool-visually-hidden">פעולה</span></th></tr></thead><tbody>${cols}</tbody></table></div>`;
}

/** What raises this bill (the reader's largest lines) and what would lower it (computed savings). */
export function leversBox(reg, input, r) {
	const top = r.byMid.filter((x) => x.mid > 0).slice(0, 3);
	const save = mgSavings(reg, input);
	return `<div class="${P}-levers"><div class="${P}-lever ${P}-lever--up"><h4>מה מייקר אצלכם</h4><ol>${top.map((x) => `<li>${esc(x.he)}: ${shk(x.mid)}</li>`).join('')}</ol></div>`
		+ `<div class="${P}-lever ${P}-lever--down"><h4>מה יוזיל</h4>${save.length ? `<ol>${save.map((x) => `<li>${esc(x.he)}: חוסך כ-${shk(x.save)}</li>`).join('')}</ol>` : `<p>${esc(reg.fl_mechiron.no_savings_he)}</p>`}</div></div>`;
}

function timeBox(reg, r) {
	const c = r.clock;
	const law = r.disputed && !r.abroad ? `<li>מה שהחוק קובע: עד ${c.max} פגישות מהו"ת ביחידת הסיוע בתוך ${c.meetings} ימים (אפשר להאריך ב-${c.extend}), ${c.stay} ימי עיכוב הליכים (או ${c.stayExtended}), ואז ${c.claims} ימים להגשת תביעה למי שפתח.${cite(reg.divorce_cost.disputes.sections.stay, reg.divorce_cost.disputes.url)}</li>` : '';
	const d = r.dur;
	const src = d.sources && d.sources.length ? ` <a class="jtool-cite" href="#mechiron-gerushin-table">לפי ${d.sources.length} ${d.sources.length === 1 ? 'מקור' : 'מקורות'}</a>` : '';
	return `<div class="${P}-time"><h4>כמה זמן</h4><ul>${law}<li>${esc(ROUTE_HE[r.route])}: ${esc(months(d))}${d.low !== null ? src : ` <small>${esc(reg.fl_mechiron.duration_unknown_he)}</small>`}. ${esc(reg.fl_mechiron.duration_note_he)}</li></ul></div>`;
}

export function nextLinks(reg, r) {
	const out = [];
	if (r.subjects.includes('support')) { out.push({ href: '#jtool-mezonot', he: 'כמה מזונות: מחשבון המזונות' }); }
	if (r.subjects.includes('property')) { out.push({ href: '#jtool-izun', he: 'מי משלם למי באיזון: מחשבון איזון המשאבים' }); }
	out.push({ href: '#jtool-mapat-gerushin', he: 'מפת הדרכים: כל תחנה עם האגרה והתאריך' });
	if (r.route === 'agree' || r.route === 'mediate') { out.push({ href: '#jtool-heskem-gerushin', he: 'טיוטת הסכם גירושין מהנתונים שלכם' }); }
	out.push({ href: '/divorce-costs-2025/', he: 'עלויות גירושין: הסבר מלא ודוגמאות' });
	return out.slice(0, 5);
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ ${r.outOfScope ? 'מחוץ לתחום הכלי' : 'צריך לתקן את הקלט'}</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const m = reg.fl_mechiron;
	const flags = r.flags.filter((x) => x.code !== 'missing');
	const miss = r.flags.find((x) => x.code === 'missing');
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">`
		+ `<p class="jtool-state jtool-state--ok">✓ אגרות לפי התקנות, ושכר טרחה ומומחים לפי מה שמשרדים מפרסמים</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${esc(ROUTE_LONG[r.route])}, ${esc(FORUM_HE[r.forum])}</p>`
		+ band(r)
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ sidesBox(r) + '</div>'
		+ `<div class="${P}-sec"><h3 class="${P}-h">החשבון המפורט</h3>${bill(reg, r)}</div>`
		+ `<div class="${P}-sec"><h3 class="${P}-h">השוואה בין תרחישים</h3>${scenarioTable(reg, opts.input || {}, r)}</div>`
		+ leversBox(reg, opts.input || {}, r)
		+ timeBox(reg, r)
		+ (flags.length ? `<ul class="jtool-flags ${P}-flags">${flags.map((x) => `<li>${esc(x.he)}</li>`).join('')}</ul>` : '')
		+ (miss ? `<p class="jtool-hint">${esc(miss.he)}</p>` : '')
		+ `<div class="${P}-next"><h4>הצעד הבא</h4><ul>${nextLinks(reg, r).map((x) => `<li><a href="${esc(x.href)}">${esc(x.he)}</a></li>`).join('')}</ul><p class="${P}-reviewed">${esc(m.reviewed_he)} · עודכן ${isoToHe(m.checked_on)}</p></div>`;
}

/* ---------------- The price list (the page table) ---------------- */

/** One official row of the price list. */
function officialRow(reg, row) {
	const o = mgOfficial(reg, row.id);
	if (!o) { return ''; }
	const amt = o.unchecked ? `<strong class="${P}-unchecked">לא נבדק</strong>` : o.amount === 0 ? `<strong>${esc(o.zero_he || 'בלי תשלום')}</strong>` : `${shk(o.amount)}`;
	return `<tr id="${P}-row-${esc(o.id)}"><td class="${P}-c-item" data-th="הפריט">${esc(o.he)}${o.note_he ? `<small>${esc(o.note_he)}</small>` : ''}</td><td class="${P}-c-amt" data-th="הסכום">${amt}</td><td class="${P}-c-vat" data-th="מע״מ">${esc(o.vat ? 'ועוד מע"מ' : 'בלי מע"מ')}</td><td class="${P}-c-src" data-th="המקור">${o.url ? `<a href="${esc(o.url)}" target="_blank" rel="noopener">${esc(o.src_he)}</a>` : esc(o.src_he)}${o.item ? `, ${esc(o.item)}` : ''}</td><td class="${P}-c-date" data-th="נבדק">${esc(isoToHe(o.checked_on || reg.fl_mechiron.checked_on))}</td></tr>`;
}

/** One market row: the range over its sources, and each source with its link and read day. */
function marketRow(reg, row) {
	const x = mgMarket(reg, row.id);
	if (!x) { return ''; }
	const srcs = (x.sources || []).map((s) => (s.status === 'not_checked' ? '' : `<li>${srcName(s)}: ${s.low && s.high && s.low !== s.high ? `<bdi>${money(s.low, 0)}</bdi>–<bdi>${money(s.high, 0)}</bdi>` : `<bdi>${money(s.low || s.high, 0)}</bdi>`} ₪ ${esc(s.vat === 'incl' ? '(כולל מע"מ)' : s.vat === 'plus' ? '(ועוד מע"מ)' : '(מע"מ לא צוין)')}</li>`)).join('');
	const amount = x.low === null ? `<strong class="${P}-unchecked">לא נבדק</strong>` : `<bdi>${money(x.low, 0)}</bdi>–<bdi>${money(x.high, 0)}</bdi> ₪<small>אמצע: <bdi>${money(x.mid, 0)}</bdi> ₪, לפני מע"מ</small>`;
	const n = x.n || 0;
	return `<tr id="${P}-row-${esc(x.id)}"><td class="${P}-c-item" data-th="הפריט">${esc(x.he)}<small>${esc(x.unit_he)}${x.note_he ? ` · ${esc(x.note_he)}` : ''}</small></td><td class="${P}-c-amt" data-th="הטווח">${amount}</td><td class="${P}-c-vat" data-th="מע״מ">ועוד מע"מ</td><td class="${P}-c-src" data-th="המקורות">${srcs ? `<details class="${P}-srcbox"><summary>${n === 1 ? 'מקור אחד' : `${n} מקורות`}</summary><ul class="${P}-srcs">${srcs}</ul></details>` : esc(x.unchecked_he || 'לא מצאנו מחיר מפורסם שאפשר לבדוק')}</td><td class="${P}-c-date" data-th="נבדק">${esc(isoToHe(reg.fl_mechiron.checked_on))}</td></tr>`;
}

/** The price list: every official row of the family-law schedules the site reads, and every market row with its sources. */
export function priceTable(reg) {
	const m = reg.fl_mechiron;
	const groups = m.price_groups.map((g) => {
		const rows = g.kind === 'official'
			? m.official.filter((o) => o.group === g.id).map((o) => officialRow(reg, o)).join('')
			: m.market.filter((o) => o.group === g.id).map((o) => marketRow(reg, o)).join('');
		if (!rows) { return ''; }
		const head = g.kind === 'official' ? '<tr><th scope="col">הפריט</th><th scope="col">הסכום</th><th scope="col">מע"מ</th><th scope="col">המקור</th><th scope="col">נבדק</th></tr>' : '<tr><th scope="col">הפריט</th><th scope="col">הטווח שמתפרסם</th><th scope="col">מע"מ</th><th scope="col">המקורות</th><th scope="col">נבדק</th></tr>';
		const count = (rows.match(/<tr /g) || []).length;
		return `<details class="${P}-group"${g.open ? ' open' : ''}><summary><span class="${P}-kind ${P}-kind--${g.kind === 'official' ? 'official' : 'market'}">${g.kind === 'official' ? 'רשמי' : 'שוק'}</span> ${esc(g.he)} <small>(${count})</small></summary><div class="jtool-datawrap ${P}-pl" role="region" aria-label="${esc(g.he)}" tabindex="0"><table class="jtool-datatable ${P}-price"><thead>${head}</thead><tbody>${rows}</tbody></table></div></details>`;
	}).join('');
	const dur = Object.keys(m.durations).map((k) => {
		const d = mgDuration(reg, k);
		const src = (d.sources || []).filter((s) => s.status !== 'not_checked').map((s) => `${srcName(s)}: ${s.low === s.high ? s.low : `${s.low}–${s.high}`}`).join('; ');
		return `<tr><td data-th="המסלול">${esc(m.durations[k].he)}</td><td data-th="כמה זמן">${esc(months(d))}</td><td data-th="המקורות">${src || esc(m.duration_unknown_he)}</td></tr>`;
	}).join('');
	const c = mgClock(reg);
	return `<div class="${P}-pricelist" id="mechiron-gerushin-table"><p class="${P}-pl__lede">${esc(m.pricelist_lede_he)}</p>${groups}`
		+ `<details class="${P}-group" open><summary><span class="${P}-kind ${P}-kind--market">זמן</span> כמה זמן לוקחים גירושין, לפי המסלול</summary><div class="jtool-datawrap ${P}-pl" role="region" aria-label="כמה זמן לוקחים גירושין" tabindex="0"><table class="jtool-datatable ${P}-price"><thead><tr><th scope="col">המסלול</th><th scope="col">כמה זמן</th><th scope="col">המקורות</th></tr></thead><tbody>${dur}<tr><td data-th="המסלול">מה שהחוק קובע בכל מחלוקת</td><td data-th="כמה זמן">${c.meetings} ימים לפגישות, ${c.stay} (או ${c.stayExtended}) ימי עיכוב, ${c.claims} ימים לתביעה</td><td data-th="המקורות"><a href="${esc(reg.divorce_cost.disputes.url)}" target="_blank" rel="noopener">${esc(reg.divorce_cost.disputes.law_he)}</a>, סעיפים 3 ו-4</td></tr></tbody></table></div></details>`
		+ `<p class="${P}-reviewed">${esc(m.reviewed_he)} · עודכן ${isoToHe(m.checked_on)}; תאריך הבדיקה מול המקור ליד כל שורה · ${esc(m.pricelist_foot_he)}</p></div>`;
}

/* ---------------- Method and print ---------------- */

export function methodList(reg) {
	return `<ol class="${P}-method">${reg.fl_mechiron.method_he.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const m = reg.fl_mechiron;
	return '<h3>מחשבון גירושין: סיכום</h3>'
		+ `<p><strong>התרחיש:</strong> ${esc(ROUTE_LONG[r.route])}; ${esc(FORUM_HE[r.forum])}; ${r.subjects.length ? esc(r.subjects.map((s) => SUBJ_HE[s]).join(', ')) : 'בלי נושאים פתוחים'}; ${esc(REP_HE[r.rep])}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>החשבון:</strong> ${r.lines.map((l) => `${esc(l.he)} ${l.low === l.high ? esc(nis(l.mid)) : `${esc(nis(l.mid))} (${money(l.low, 0)}–${money(l.high, 0)})`}${l.vat ? ' ועוד מע"מ' : ''}`).join('; ')}.</p>`
		+ `<p><strong>איך חישבנו:</strong></p>${methodList(reg)}`
		+ `<p>${esc(m.reviewed_he)}. הנתונים נבדקו ב-${isoToHe(m.checked_on)}; הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי ולא הצעת מחיר.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	return `<div class="${P}-screen"><div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חישבנו</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${methodList(reg)}</div></div>`
		+ `<div class="${P}-print">${printSummary(reg, r, opts.printedOn || reg.fl_mechiron.checked_on)}</div>`;
}

/* ---------------- Share state ---------------- */

const RT = { agree: 'a', mediate: 'm', compromise: 'c', contested: 'd' };
const FO = { rabbinical: 'r', family: 'f' };
const RP = { each: 'e', one: 'o', self: 's', aid: 'l' };
const SP = { equal: 'e', a: 'a', b: 'b', pct: 'p' };
const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
const BITS = ['support', 'custody', 'property', 'actuary', 'appraiser', 'business', 'courtExpert', 'coordinator', 'joint', 'appeal', 'execution', 'prenup', 'notary', 'pleader', 'abroad'];
/** The share keys: r route, f forum, b the ticked boxes (a bitmask over BITS), h coordinator hours, p representation, q quote,
 * v the quote's VAT, s split, c side A's percent. Selections and numbers only. */
export const KEYS = ['r', 'f', 'b', 'h', 'p', 'q', 'v', 's', 'c'];
export function stateOf(input) {
	const i = Object.assign({}, BLANK, input || {});
	const bits = BITS.reduce((n, k, idx) => (i[k] ? n + 2 ** idx : n), 0);
	return encodeState({ r: RT[i.route], f: FO[i.forum], b: bits ? bits.toString(36) : '', h: i.coordinator && i.hours !== '' ? i.hours : '', p: RP[i.rep], q: i.quote === '' ? '' : i.quote, v: i.quote !== '' && i.quoteVat === 'incl' ? 'i' : '', s: SP[i.split], c: i.split === 'pct' && i.pct !== '' ? i.pct : '' });
}
export function inputOf(s) {
	if (!s || !s.r) { return null; }
	const bits = s.b ? parseInt(s.b, 36) : 0;
	const out = Object.assign({}, BLANK, { route: back(RT, s.r, 'agree'), forum: back(FO, s.f, 'rabbinical'), rep: back(RP, s.p, 'each'), split: back(SP, s.s, 'equal') });
	BITS.forEach((k, idx) => { out[k] = Boolean(bits & (2 ** idx)); });
	out.hours = s.h ? Number(s.h) : '';
	out.quote = s.q ? Number(s.q) : '';
	out.quoteVat = s.v === 'i' ? 'incl' : 'plus';
	out.pct = s.c ? Number(s.c) : '';
	return out;
}

/* ---------------- Snapshot (server HTML) ---------------- */

export function snapshot(reg) {
	const r = mgCompute(reg, EXAMPLE);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.totals.mid.gross,
		sticky: shk(r.totals.mid.gross),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true, input: EXAMPLE }),
		details: renderDetails(reg, r, { printedOn: reg.fl_mechiron.checked_on }),
		method: methodList(reg),
		compare_table: priceTable(reg),
		sentence: verdictSentence(reg, r),
		// The answer box (inc/justice-tools-divorce-calc.php): the same engine's figures, never typed in PHP.
		answer: (() => {
			const ag = mgMarket(reg, 'lawyer_agreement');
			const co = mgMarket(reg, 'lawyer_contested');
			return { agree_n: ag.n, agree_low: ag.low, agree_high: ag.high, contested_low: co.low, contested_high: co.high, rb_agreement: mgOfficial(reg, 'rb_agreement').amount, fam_agreement: mgOfficial(reg, 'fam_agreement').amount, certificate: mgOfficial(reg, 'rb_certificate').amount, vat: reg.divorce_cost.vat.pct };
		})(),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const tick = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const amt = (id) => { const v = String(val(id)).replace(/[,\s₪%]/g, ''); return v === '' ? '' : Number(v); };
	const out = { route: pick('route', 'agree'), forum: pick('forum', 'rabbinical'), rep: pick('rep', 'each'), split: pick('split', 'equal'), quoteVat: pick('qvat', 'plus'), hours: amt('hrs'), quote: amt('quote'), pct: amt('pct') };
	for (const k of BITS) { out[k] = tick(k); }
	return out;
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const m = reg.fl_mechiron;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(m.checked_on, m.refresh_every_days) || (m.next_update && today >= m.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרות התעדכנו'); }
	}
	const ids = { pct: 'pct', quote: 'quote', hours: 'hrs', rep: 'quote' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const id = ids[e.field];
			const b = id && root.querySelector(`#${P}-${id}-e`);
			if (b) { b.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = (input) => {
		const disputed = input.route === 'compromise' || input.route === 'contested';
		form.querySelectorAll('[data-if-coord]').forEach((el) => { el.hidden = !input.coordinator; });
		form.querySelectorAll('[data-if-disputed]').forEach((el) => { el.hidden = !disputed; });
		form.querySelectorAll('[data-if-rb]').forEach((el) => { el.hidden = input.forum !== 'rabbinical'; });
		form.querySelectorAll('[data-if-pct]').forEach((el) => { el.hidden = input.split !== 'pct'; });
		const hint = form.querySelector(`[data-${P}-route-hint]`);
		if (hint) { hint.textContent = ROUTE_LONG[input.route]; }
		const key = Object.keys(PRESETS).find((k) => { const x = mgPreset(k); return Object.keys(BLANK).every((f) => String(x[f]) === String(input[f])); }) || '';
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = mgCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r, { input });
		details.innerHTML = renderDetails(reg, r, { printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? shk(r.totals.mid.gross) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: mgBandOf(r) }); }
		return r;
	};
	const current = () => readForm(root);
	const apply = (input) => { own = true; form.innerHTML = renderForm(reg, input); sync(input); return run(input); };
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = current(); sync(input); run(input); }, 140);
	};
	// A share link names its tool (/@machshevon-gerushin): the page holds nine tools, and only this one reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (parsed) {
		apply(parsed);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
	}
	if (store.get(saveKey) && !parsed) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'preset') {
			const input = mgPreset(b.getAttribute('data-preset'));
			if (input) { apply(input); track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') }); }
			return;
		}
		if (act === 'route') {
			const input = Object.assign(own ? current() : Object.assign({}, EXAMPLE), { route: b.getAttribute('data-route') });
			apply(input);
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			track('tool_scenario', { tool_id: TOOL_ID, band: input.route });
			return;
		}
		const input = own ? current() : Object.assign({}, EXAMPLE);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק הבחירות שלכם, בלי שמות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`מחשבון גירושין: ${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (מחשבון גירושין, jus-tice.co.il, ${isoToHe(m.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { apply(s); }
		} else if (act === 'clear') {
			store.clear(saveKey);
			toast(root, 'נמחק מהמכשיר.');
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});
	// A "N sources" link in the bill points at its row of the price list: open the row's group before the browser scrolls.
	document.addEventListener('click', (ev) => {
		const a = ev.target.closest(`a[href^="#${P}-row-"]`);
		if (!a) { return; }
		const row = document.getElementById(a.getAttribute('href').slice(1));
		const group = row && row.closest('details');
		if (group && !group.open) { group.open = true; }
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
