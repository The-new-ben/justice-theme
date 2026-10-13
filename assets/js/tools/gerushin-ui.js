/**
 * Wave 4 UI: what a divorce costs, and the law's own clocks (HAD-502).
 * Board: Claude Design canvas "Tools wave 4" (co.il gerushin at 1280 and 360, states).
 * Two lanes, agreement and dispute, drawn with the statutory days; the fee table says the same in text, each line with
 * its item in the regulations. The balance of resources answers "who pays whom" under the 1973 law.
 */
import { compute, byRoute, ROUTES } from './gerushin-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'gerushin';
const P = 'jt9';

export const EXAMPLE = { route: 'agree', forum: 'rabbinical', children: true, property: true, abroad: false, certificates: 2, lawyer: 'bar', start: '', extended: false, notJewish: false, before1974: false, balance: null };

const ROUTE_LABEL = { agree: 'בהסכמה, עם הסכם', mediate: 'יישוב סכסוך ואז הסכם', court: 'הליך במחלוקת' };
const ROUTE_LONG = { agree: 'בהסכמה: יש לנו הסכם, או שנחתום', mediate: 'יישוב סכסוך ביחידת הסיוע, ואז הסכם', court: 'במחלוקת: תביעות בבית הדין או בבית המשפט' };
const FORUM_LABEL = { rabbinical: 'בית הדין הרבני', family: 'בית המשפט לענייני משפחה' };

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
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
	const dc = reg.divorce_cost;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const route = ROUTES.includes(input.route) ? input.route : 'agree';
	const b = input.balance || { a: {}, b: {} };
	const mf = (id, label, v) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v ? money(v, 0) : '')}" placeholder="0" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	return `<fieldset class="jtool-field"><legend>איך אתם מתגרשים</legend><div class="jtool-chips">${ROUTES.map((k) => chip('route', k, ROUTE_LONG[k], route === k)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend data-forum-legend>${route === 'court' ? 'איפה נדונים הרכוש והילדים' : 'איפה מאשרים את ההסכם'}</legend><div class="jtool-chips">${chip('forum', 'rabbinical', FORUM_LABEL.rabbinical, input.forum !== 'family')}${chip('forum', 'family', FORUM_LABEL.family, input.forum === 'family')}</div>`
		+ `<p class="jtool-hint">הגט עצמו ניתן תמיד בבית הדין הרבני. רכוש וילדים אפשר לכרוך בתביעת הגירושין שם, או להגיש לבית המשפט לענייני משפחה.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מה צריך להסדיר</legend><div class="jtool-chips">${chip('kids', '1', 'ילדים מתחת לגיל 18', input.children, 'checkbox')}${chip('prop', '1', 'רכוש לחלוקה', input.property, 'checkbox')}${chip('abr', '1', 'אחד מאיתנו גר בחוץ לארץ', input.abroad, 'checkbox')}</div></fieldset>`
		+ `<div class="jtool-row" data-if-clock${route === 'agree' || input.abroad ? ' hidden' : ''}><div class="jtool-field"><label class="jtool-label" for="${P}-start">יום הגשת הבקשה ליישוב סכסוך</label><input id="${P}-start" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.start || ''))}" placeholder="לדוגמה: 1.11.2026" aria-describedby="${P}-start-e"><p class="jtool-error" id="${P}-start-e" role="alert"></p></div>`
		+ `<div class="jtool-field" style="justify-content:flex-end"><div class="jtool-chips">${chip('ext', '1', 'יחידת הסיוע האריכה את הפגישות', input.extended, 'checkbox')}</div></div></div>`
		+ `<details class="jtool-more"${input.balance ? ' open' : ''}><summary>איזון משאבים: מי משלם למי</summary>`
		+ `<p class="jtool-hint" style="margin-top:8px">כל הנכסים שעל שם כל אחד, כולל דירה, חסכונות, קרן השתלמות ופנסיה (סעיף 5(ג)). בשורה השנייה: מה שלא מאזנים: ${esc(dc.property_law.excluded_he)}.</p>`
		+ `<div class="jt9-cols"><div><p class="jt9-col__h">בן או בת הזוג א'</p>${mf('aa', 'כל הנכסים', b.a && b.a.assets)}${mf('ax', 'מתוכם לא לאיזון', b.a && b.a.excluded)}${mf('ad', 'חובות', b.a && b.a.debts)}</div>`
		+ `<div><p class="jt9-col__h">בן או בת הזוג ב'</p>${mf('ba', 'כל הנכסים', b.b && b.b.assets)}${mf('bx', 'מתוכם לא לאיזון', b.b && b.b.excluded)}${mf('bd', 'חובות', b.b && b.b.debts)}</div></div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('pre', '1', 'נישאנו לפני 1.1.1974', input.before1974, 'checkbox')}</div></details>`
		+ `<details class="jtool-more"><summary>עורך דין ולמי הכלי מתאים</summary><div class="jtool-chips" style="margin-top:8px">${chip('bar', '1', 'להציג את התעריף המינימלי המומלץ של לשכת עורכי הדין', input.lawyer === 'bar', 'checkbox')}${chip('nj', '1', 'אנחנו לא בני זוג יהודים', input.notJewish, 'checkbox')}</div>`
		+ `<p class="jtool-hint">${esc(dc.bar.note_he)}. הכלי לא ממליץ על מחיר.</p></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const main = r.lines.filter((l) => l.amount > 0 && !l.key.endsWith('_tr') && l.key !== 'certificates').map((l) => `${l.he} ${nis(l.amount)}`);
	const cert = r.lines.find((l) => l.key === 'certificates');
	return `${ROUTE_LABEL[r.route]} (${FORUM_LABEL[r.forum]}): ${main.join('; ')}${cert ? `; תעודות גירושין ${nis(cert.amount)}` : ''}. סידור הגט עצמו בלי אגרה${r.abroad ? ', חוץ מהסדר מיוחד' : ''}. בסך הכול ${nis(r.total)} באגרות.`;
}

/** Two lanes, agreement and dispute, with the law's days; the chosen lane is drawn solid. */
function lanes(reg, r) {
	const d = reg.divorce_cost.disputes;
	const c = r.clock;
	const dateOr = (iso, days) => (iso ? `<bdi>${isoToHe(iso)}</bdi>` : `יום ${days}`);
	const agreeSteps = [['הסכם בכתב', 'אתם קובעים'], ['אישור ההסכם', r.forum === 'family' ? 'בית המשפט' : 'בית הדין'], ['סידור הגט', 'בלי אגרה'], ['תעודות', 'לכל צד']];
	const abroad = r.route !== 'agree' && !c;
	const courtSteps = abroad ? [
		['תביעות, בלי בקשה ליישוב סכסוך', 'מקום המושב של אחד מכם בחוץ לארץ (סעיף 4א(1))'],
		['דיונים ופסק דין', 'החוק לא קובע משך'],
	] : [
		['בקשה ליישוב סכסוך', c ? dateOr(c.start, 0) : 'יום 0'],
		[`עד ${d.meetings_max} פגישות מהו"ת`, c ? `עד ${dateOr(c.meetingsBy, c.meetingsDays)}` : `עד יום ${d.meetings_days}`],
		['סוף עיכוב ההליכים', c ? dateOr(c.stayEnds, c.stayDays) : `יום ${d.stay_days}`],
		// s.4: a priority window for the spouse who filed the request, then the other spouse may file too; never a
		// deadline after which claims are barred (review, PR 126).
		['מי שהגיש את הבקשה תובע ראשון', c ? `עד ${dateOr(c.claimsBy, c.stayDays + c.claimDays)}, ואז גם הצד השני` : `${d.claim_days} ימים, ואז גם הצד השני`],
		['דיונים ופסק דין', 'החוק לא קובע משך'],
	];
	const lane = (key, title, steps, on) => `<div class="jt9-lane${on ? ' jt9-lane--on' : ''}"><p class="jt9-lane__h">${esc(title)}${on ? ' (אתם)' : ''}</p><ol>${steps.map(([t, s]) => `<li><span class="jt9-lane__t">${esc(t)}</span><span class="jt9-lane__s">${s}</span></li>`).join('')}</ol></div>`;
	return `<div class="jt9-lanes" role="group" aria-label="הדרך לגירושין, לפי החוק">${lane('agree', 'בהסכמה', agreeSteps, r.route === 'agree')}${lane('court', r.route === 'mediate' ? 'יישוב סכסוך' : 'במחלוקת', courtSteps, r.route !== 'agree')}</div>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state ${r.outOfScope ? 'jtool-state--info' : 'jtool-state--danger'}">${r.outOfScope ? 'מחוץ לתחום של הכלי' : '✕ צריך לתקן את הקלט'}</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const bar = r.bar;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ לפי תקנות האגרות</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}כמה עולות האגרות, ${esc(ROUTE_LABEL[r.route])}</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.total, r.total % 1 ? 2 : 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ (bar.shown ? `<p class="jtool-scope">עם עורך דין, לפי התעריף המינימלי המומלץ של הלשכה (לא מחייב): לפחות <strong>${ils(bar.total, 0)}</strong> ועוד מע"מ ${bar.vatPct}%, ${ils(bar.withVat)}, לכל צד${bar.lines.some((l) => l.amount === null) ? ', ובתביעה רכושית לפי שווי הרכוש' : ''}.</p>` : '')
		+ (r.balance ? `<p class="jtool-scope">איזון משאבים: ${r.balance.payer ? `<strong>${r.balance.payer === 'a' ? "בן הזוג א' משלם לבן הזוג ב'" : "בן הזוג ב' משלם לבן הזוג א'"} ${ils(r.balance.pay)}</strong>` : 'אין תשלום: השווי שווה'} (מחצית ההפרש, סעיף 6(ב)).</p>` : '')
		+ `</div>`
		+ lanes(reg, r)
		+ (r.flags.length ? `<ul class="jtool-flags">${r.flags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '');
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const dc = reg.divorce_cost;
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-fee-h">האגרות, שורה אחרי שורה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-fee-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">איפה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.lines.map((l) => `<tr><td data-th="מה">${esc(l.he)}</td><td data-th="איפה">${esc(FORUM_LABEL[l.who])}</td><td data-th="סכום">${l.amount ? ils(l.amount, 0) : 'פטור'}</td><td data-th="הכלל">${cite(l.section, l.url)}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול באגרות</td><td data-th="איפה">${r.byWho.family ? `בית הדין ${nis(r.byWho.rabbinical)}; בית המשפט ${nis(r.byWho.family)}` : 'בית הדין הרבני'}</td><td data-th="סכום">${ils(r.total, 0)}</td><td data-th="הכלל">—</td></tr></tbody>`
		+ `<caption>אגרות בית הדין הרבני ${esc(dc.rabbinical.indexed_he)}; אגרות בית המשפט ${esc(dc.family.indexed_he)}. ערעור לבית הדין הגדול: ${nis(dc.rabbinical.appeal)} (${esc(dc.rabbinical.items.appeal)}).</caption></table></div></div>`;
	// The same family on every route.
	const routes = byRoute(reg, { forum: r.forum, children: r.children, property: r.property, abroad: r.abroad, certificates: r.certificates });
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-routes-h">אותה משפחה, שלוש דרכים</h3></div><div class="jt7-scns jt10-fees">`
		+ ROUTES.map((k) => { const v = routes[k]; const here = k === r.route; return `<div class="jt7-scn${here ? ' jt7-scn--here' : ''}"><p>${esc(ROUTE_LABEL[k])}${here ? ' (אתם)' : ''}</p><strong>${v ? ils(v.total, 0) : '—'}</strong><small>באגרות; עורך דין לפחות ${v ? nis(v.bar) : '—'} ועוד מע"מ, לכל צד</small></div>`; }).join('')
		+ `</div><p class="jt7-scns__note">האגרות לפי ${esc(FORUM_LABEL[r.forum])}. החוק לא קובע כמה זמן נמשך הליך במחלוקת, ולכן אין כאן משך כזה.</p></div>`;
	// The lawyer reference.
	if (r.bar.shown) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-bar-h">עורך דין: התעריף המינימלי המומלץ, לכל צד</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-bar-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">השירות</th><th scope="col">לפני מע"מ</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ r.bar.lines.map((l) => `<tr><td data-th="השירות">${esc(l.min ? 'עריכת הסכם לפסק הגט' : l.he)}</td><td data-th="לפני מע&quot;מ">${l.amount === null ? 'לפי שווי' : `${l.min ? 'לא פחות מ-' : ''}${ils(l.amount, 0)}`}</td><td data-th="הכלל">${cite(l.section, dc.bar.url)}</td></tr>`).join('')
			+ `<tr class="jtool-table__total"><td data-th="השירות">לפחות, לפני מע"מ</td><td data-th="לפני מע&quot;מ">${ils(r.bar.total, 0)}</td><td data-th="הכלל">עם מע"מ ${r.bar.vatPct}%: ${esc(nis(r.bar.withVat))}</td></tr></tbody>`
			+ `<caption>${esc(dc.bar.note_he)}.</caption></table></div></div>`;
	}
	// The balance of resources.
	if (r.balance) {
		const bl = r.balance;
		const row = (k, s) => `<tr><td data-th="מי">${k === 'a' ? "בן הזוג א'" : "בן הזוג ב'"}</td><td data-th="כל הנכסים">${ils(s.assets, 0)}</td><td data-th="לא לאיזון">${ils(s.excluded, 0)}</td><td data-th="חובות">${ils(s.debts, 0)}</td><td data-th="לאיזון">${ils(s.net)}</td></tr>`;
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-bal-h">איזון משאבים</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-bal-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מי</th><th scope="col">כל הנכסים</th><th scope="col">לא לאיזון</th><th scope="col">חובות</th><th scope="col">לאיזון</th></tr></thead><tbody>`
			+ row('a', bl.a) + row('b', bl.b)
			+ `<tr class="jtool-table__total"><td data-th="מי">${bl.payer ? (bl.payer === 'a' ? "א' משלם ל-ב'" : "ב' משלם ל-א'") : 'אין תשלום'}</td><td data-th="כל הנכסים">ההפרש ${esc(nis(Math.abs(bl.diff)))}</td><td data-th="לא לאיזון">—</td><td data-th="חובות">—</td><td data-th="לאיזון">${ils(bl.pay)}</td></tr></tbody>`
			+ `<caption>מחצית ההפרש בין שווי הנכסים לאיזון, אחרי ניכוי החובות (סעיפים 5, 6(א)-(ב)). בית המשפט או בית הדין רשאים, בנסיבות מיוחדות, לקבוע יחס אחר (סעיף 8). אפשר לבקש איזון מוקדם שנה אחרי פתיחת הליך, או אחרי 9 חודשי פירוד (סעיף 5א).</caption></table></div></div>`;
	}
	// The clock, with dates.
	if (r.clock) {
		const dl = deadlines(reg, r);
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שבחוק</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ dl.map((d) => { const past = opts.today && d.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="עד תאריך"><bdi>${isoToHe(d.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(d.what)}</td><td data-th="הכלל">${cite(d.rule, dc.disputes.url)}</td></tr>`; }).join('')
			+ `</tbody><caption>${esc(dc.disputes.permanent_he)}. ${esc(dc.disputes.free_he)}.</caption></table></div></div>`;
	}
	return out;
}

export function deadlines(reg, r) {
	const d = reg.divorce_cost.disputes;
	const c = r.clock;
	if (!c) { return []; }
	// An end moved off a Saturday or a holiday says so, with the rule (Interpretation Law s.10(ג); review, PR 126).
	const moved = (k) => (c.rolled && c.rolled[k] ? `; היום האחרון חל ביום מנוחה ועבר ליום שאחריו (${d.interpretation_he})` : '');
	return [
		{ date: c.meetingsBy, what: `עד ${d.meetings_max} פגישות מידע, היכרות ותיאום ביחידת הסיוע, בלי תשלום${c.extended ? ' (אחרי הארכה של 15 ימים)' : ''}${moved('meetings')}`, rule: `${d.sections.meetings}, ${d.sections.meetings_days}` },
		{ date: c.stayEnds, what: `סוף עיכוב ההליכים: עד אז אי אפשר להגיש תביעה (${c.stayDays} ימים)${moved('stay')}`, rule: d.sections.stay },
		{ date: c.claimsBy, what: `סוף ${c.claimDays} הימים שבהם רק מי שהגיש את הבקשה ליישוב סכסוך רשאי לתבוע, בכל ערכאה מוסמכת; אחר כך גם הצד השני רשאי לתבוע בעניינים שלא נתבעו${moved('claims')}`, rule: d.sections.claims },
	];
}

/** Page section: three common families on the three routes, from the same engine. */
export function routesTable(reg) {
	const fams = [
		{ he: 'בלי ילדים ובלי רכוש', children: false, property: false },
		{ he: 'עם ילדים, בלי רכוש לחלוקה', children: true, property: false },
		{ he: 'עם ילדים ורכוש', children: true, property: true },
	];
	const rows = fams.map((f) => {
		const cells = ['rabbinical', 'family'].map((forum) => {
			const x = byRoute(reg, { forum, children: f.children, property: f.property, certificates: 2 });
			return `<td data-th="${forum === 'rabbinical' ? 'בהסכמה' : 'במחלוקת, רכוש וילדים בבית המשפט'}">${ils(forum === 'rabbinical' ? x.agree.total : x.court.total, 0)}</td>`;
		});
		const rab = byRoute(reg, { forum: 'rabbinical', children: f.children, property: f.property, certificates: 2 });
		return `<tr><td data-th="המשפחה">${esc(f.he)}</td>${cells[0]}<td data-th="במחלוקת, הכול בבית הדין">${ils(rab.court.total, 0)}</td>${cells[1]}</tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>אגרות בלבד, כולל שתי תעודות גירושין; עורכי דין ומומחים לא כלולים. מאותו מנוע של הכלי.</caption><thead><tr><th scope="col">המשפחה</th><th scope="col">בהסכמה</th><th scope="col">במחלוקת, הכול בבית הדין</th><th scope="col">במחלוקת, רכוש וילדים בבית המשפט</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const rb = reg.divorce_cost.rabbinical;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.total,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>הסכם גירושין שמקבל תוקף של פסק דין בבית הדין הרבני: ${money(rb.agreement, 0)} ₪${cite(rb.items.agreement, rb.url)}</li>`
			+ `<li>אין צורך בבקשה ליישוב סכסוך: גירושין בהסכמה ובקשה לאישור הסכם אינם "תובענה בעניין של סכסוך משפחתי"${cite('סעיף 2', reg.divorce_cost.disputes.url)}</li>`
			+ `<li>סידור הגט כששני בני הזוג בארץ: פטור${cite(rb.items.get_free, rb.url)}</li>`
			+ `<li>תעודת גירושין לכל אחד: 2 × ${money(rb.certificate, 0)} = ${money(rb.certificate * 2, 0)} ₪${cite(rb.items.certificate, rb.url)}</li>`
			+ `<li>סך הכול באגרות: ${money(r.total, 0)} ₪. עורך דין, לפי התעריף המינימלי המומלץ: לפחות ${money(r.bar.total, 0)} ₪ ועוד מע"מ לכל צד.</li></ol>`,
		compare_table: routesTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const bal = { a: { assets: m('aa'), excluded: m('ax'), debts: m('ad') }, b: { assets: m('ba'), excluded: m('bx'), debts: m('bd') } };
	const any = [bal.a.assets, bal.a.excluded, bal.a.debts, bal.b.assets, bal.b.excluded, bal.b.debts].some((x) => x !== '');
	return {
		route: (root.querySelector(`input[name="${P}-route"]:checked`) || {}).value || 'agree',
		forum: (root.querySelector(`input[name="${P}-forum"]:checked`) || {}).value || 'rabbinical',
		children: on('kids'), property: on('prop'), abroad: on('abr'), extended: on('ext'), before1974: on('pre'),
		lawyer: on('bar') ? 'bar' : 'none', notJewish: on('nj'), certificates: 2,
		start: toIso(val(`#${P}-start`)), balance: any ? bal : null,
	};
}

const RT = { agree: 'a', mediate: 'm', court: 'c' };
const stateOf = (i) => encodeState({ r: RT[i.route] || 'a', f: i.forum === 'family' ? 'f' : '', k: i.children ? 1 : '', p: i.property ? 1 : '', x: i.abroad ? 1 : '', e: i.extended ? 1 : '', d: i.start, l: i.lawyer === 'bar' ? '' : 0, n: i.notJewish ? 1 : '', q: i.before1974 ? 1 : '',
	b: i.balance ? [[i.balance.a.assets || 0, i.balance.a.excluded || 0], [i.balance.a.debts || 0, i.balance.b.assets || 0], [i.balance.b.excluded || 0, i.balance.b.debts || 0]] : '' });
const KEYS = ['r', 'f', 'k', 'p', 'x', 'e', 'd', 'l', 'n', 'q', 'b'];
function inputOf(s) {
	if (!s.r) { return null; }
	let balance = null;
	if (s.b) {
		const v = String(s.b).split('~').map((x) => x.split('_').map(Number));
		if (v.length === 3 && v.every((x) => x.length === 2 && x.every((n) => n >= 0))) {
			balance = { a: { assets: v[0][0], excluded: v[0][1], debts: v[1][0] }, b: { assets: v[1][1], excluded: v[2][0], debts: v[2][1] } };
		}
	}
	return {
		route: Object.keys(RT).find((k) => RT[k] === s.r) || 'agree', forum: s.f === 'f' ? 'family' : 'rabbinical',
		children: s.k === '1', property: s.p === '1', abroad: s.x === '1', extended: s.e === '1', start: s.d || '',
		lawyer: s.l === '0' ? 'none' : 'bar', notJewish: s.n === '1', before1974: s.q === '1', certificates: 2, balance,
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const dc = reg.divorce_cost;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(dc.checked_on, dc.refresh_every_days) || (dc.next_update && today >= dc.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרות התעדכנו'); }
	}
	// A live page counts the clock from today unless a shared link says otherwise.
	const startField = root.querySelector(`#${P}-start`);
	if (startField && !window.location.hash && !startField.value) { startField.value = isoToHe(today); }
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok || r.outOfScope) { return; }
		const ids = { 'a-assets': 'aa', 'a-excluded': 'ax', 'a-debts': 'ad', 'b-assets': 'ba', 'b-excluded': 'bx', 'b-debts': 'bd', start: 'start' };
		for (const e of r.errors) {
			const id = ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const f = id && root.querySelector(`#${P}-${id}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const route = (root.querySelector(`input[name="${P}-route"]:checked`) || {}).value || 'agree';
		// No statutory clock on the agreement route or when a spouse lives abroad (s.4א(1)): its inputs hide too, so
		// nothing on screen is silently ignored (review, PR 126).
		const abroad = Boolean(root.querySelector(`input[name="${P}-abr"]:checked`));
		form.querySelectorAll('[data-if-clock]').forEach((el) => { el.hidden = route === 'agree' || abroad; });
		const lg = form.querySelector('[data-forum-legend]');
		if (lg) { lg.textContent = route === 'court' ? 'איפה נדונים הרכוש והילדים' : 'איפה מאשרים את ההסכם'; }
	};
	const run = (input, opts = {}) => {
		// The engine validates the day itself (a real calendar day); an empty field counts from today.
		const r = compute(reg, Object.assign({}, input, { start: input.start || today }));
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today });
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.total, 0) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.route }); }
		if (!r.ok && r.outOfScope) { track('tool_out_of_scope', { tool_id: TOOL_ID }); }
		return r;
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
		if (timer) { clearTimeout(timer); timer = null; }
		const input = readForm(root);
		const r = run(input, { silent: true }); // fresh, and the screen shows the same result
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok && r.clock) {
			download('gerushin.ics', 'text/calendar;charset=utf-8', ics(deadlines(reg, r).map((d) => ({ date: d.date, summary: `גירושין: ${d.what}` })), new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי תקנות האגרות ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(dc.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.route : 'error' });
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
