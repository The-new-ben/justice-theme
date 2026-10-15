/**
 * Divorce-world UI: the divorce roadmap (HAD-539).
 * One picture from the subject: a rail of stations, phase under phase, each station a box you tick, with the day it
 * falls on and the fee it costs printed on the station itself; the done part of the rail fills in navy. Progress is
 * saved in this browser; a share link carries the route and the ticks, never a name.
 */
import { mpBuild, mpRouteHe, MP_ROUTES } from './mapat-engine.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'mapat-gerushin';
const P = 'jt22';
export const EXAMPLE = { route: 'mediate', forum: 'family', children: true, property: true, pension: true, start: '2026-11-01', extended: false, done: ['docs'] };
const ROUTE_LONG = { agree: 'בהסכמה: יש הסכם, או שנחתום', mediate: 'יישוב סכסוך ביחידת הסיוע, ואז הסכם', court: 'במחלוקת: תביעות בבית הדין או בבית המשפט' };
const FORUM_HE = { rabbinical: 'בית הדין הרבני', family: 'בית המשפט לענייני משפחה' };
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
function mpToIso(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (m) { return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`; }
	m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
	if (!m) { return raw; }
	let y = +m[3]; if (y < 100) { y += 2000; }
	return `${y}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
const SIM = { mediation: 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=mediation&topic=divorce', court_rehearsal: 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=court_rehearsal&topic=divorce' };

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, m) {
	return `<fieldset class="jtool-field"><legend>איך אתם מתגרשים</legend><div class="jtool-chips">${MP_ROUTES.map((k) => chip('route', k, ROUTE_LONG[k], (m.route || 'agree') === k)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend data-forum-legend>${m.route === 'court' ? 'איפה נדונים הרכוש והילדים' : 'איפה מאשרים את ההסכם'}</legend><div class="jtool-chips">${chip('forum', 'rabbinical', FORUM_HE.rabbinical, m.forum !== 'family')}${chip('forum', 'family', FORUM_HE.family, m.forum === 'family')}</div><p class="jtool-hint">הגט עצמו ניתן תמיד בבית הדין הרבני.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מה צריך להסדיר</legend><div class="jtool-chips">${chip('kids', '1', 'ילדים מתחת לגיל 18', m.children, 'checkbox')}${chip('prop', '1', 'דירה או רכוש לחלוקה', m.property, 'checkbox')}${chip('pen', '1', 'פנסיה או קרן השתלמות', m.pension, 'checkbox')}</div></fieldset>`
		+ `<div class="jtool-row" data-if-clock${m.route === 'agree' ? ' hidden' : ''}><div class="jtool-field"><label class="jtool-label" for="${P}-start">יום הגשת הבקשה ליישוב סכסוך</label><input id="${P}-start" type="text" inputmode="numeric" autocomplete="off" value="${esc(m.start ? isoToHe(m.start) : '')}" placeholder="לדוגמה: 1.11.2026" aria-describedby="${P}-start-e"><p class="jtool-error" id="${P}-start-e" role="alert"></p></div><div class="jtool-field" style="justify-content:flex-end"><div class="jtool-chips">${chip('ext', '1', 'יחידת הסיוע האריכה את הפגישות', m.extended, 'checkbox')}</div></div></div>`
		+ `<p class="jtool-hint">מסמנים כל שלב שבוצע; ההתקדמות נשמרת בדפדפן הזה בלבד. ${esc(reg.divorce_cost.scope_he)}.</p>`;
}

/** The rail: phases and their stations, each a checkbox. */
export function rail(reg, r) {
	const phases = r.phases.map((p) => `<li class="jt22-phase"><p class="jt22-phase__h">${esc(p.he)}</p><ol class="jt22-steps">`
		+ p.steps.map((s) => {
			const cost = s.cost ? (s.cost.amount === null ? `<span class="jt22-st__cost">לפי הסכם</span>` : s.cost.amount === 0 ? `<span class="jt22-st__cost jt22-st__cost--free">פטור מאגרה</span>` : `<span class="jt22-st__cost">${ils(s.cost.amount, 0)}</span>`) : '';
			const link = s.link ? (s.link.sim ? `<a class="jt22-st__link" href="${esc(SIM[s.link.sim])}" target="_blank" rel="noopener" data-act="rehearse">${esc(s.link.label)}</a>` : s.link.hash ? `<a class="jt22-st__link" href="#${esc(s.link.hash)}">${esc(s.link.label)}</a>` : `<a class="jt22-st__link" href="${esc(s.link.path)}">${esc(s.link.label)}</a>`) : '';
			return `<li class="jt22-st${s.done ? ' jt22-st--done' : ''}"><input class="jt22-st__box" type="checkbox" id="${P}-s-${s.id}" data-step="${esc(s.id)}"${s.done ? ' checked' : ''}><label class="jt22-st__t" for="${P}-s-${s.id}">${esc(s.he)}</label><span class="jt22-st__meta">${s.when ? `<span class="jt22-st__when">${esc(s.when)}</span>` : ''}${cost}</span>`
				+ (s.do.length ? `<ul class="jt22-st__do">${s.do.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : '')
				+ `<span class="jt22-st__foot">${link}${s.cost && s.cost.section ? cite(s.cost.section, s.cost.url) : s.source ? cite(s.source.he, s.source.url) : ''}</span></li>`;
		}).join('') + '</ol></li>').join('');
	return `<ol class="jt22-rail" aria-label="שלבי הגירושין">${phases}</ol>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const c = r.clock;
	return `${mpRouteHe(r.route)}, ${FORUM_HE[r.forum]}: ${r.progress.total} שלבים, ${r.progress.done} בוצעו. אגרות במסלול ${nis(r.fees.total)} כולל שתי תעודות גירושין; עורך דין לפי התעריף המינימלי המומלץ של הלשכה לפחות ${nis(r.fees.bar.total)} ועוד מע"מ לכל צד.${c ? ` השעון שבחוק: פגישות עד ${isoToHe(c.meetingsBy)}, סוף עיכוב ההליכים ${isoToHe(c.stayEnds)}, ומי שהגיש את הבקשה תובע ראשון עד ${isoToHe(c.claimsBy)}.` : ' בלי בקשה ליישוב סכסוך: הסכם מובא ישר לאישור.'}`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ ${esc(mpRouteHe(r.route))}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה: ' : ''}ההתקדמות במפה</p>`
		+ `<strong class="jtool-verdict__figure"><bdi>${r.progress.done}</bdi> / <bdi>${r.progress.total}</bdi></strong>`
		+ `<div class="jt22-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${r.progress.total}" aria-valuenow="${r.progress.done}" aria-label="שלבים שבוצעו"><i style="width:${r.progress.pct}%"></i></div>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p></div>`
		+ rail(reg, r);
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	const dc = reg.divorce_cost;
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-fee-h">האגרות במסלול, שורה אחרי שורה</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-fee-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">איפה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.fees.lines.map((l) => `<tr><td data-th="מה">${esc(l.he)}</td><td data-th="איפה">${esc(FORUM_HE[l.who])}</td><td data-th="סכום">${l.amount ? ils(l.amount, 0) : 'פטור'}</td><td data-th="הכלל">${cite(l.section, l.url)}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול באגרות</td><td data-th="איפה">—</td><td data-th="סכום">${ils(r.fees.total, 0)}</td><td data-th="הכלל">—</td></tr></tbody>`
		+ `<caption>${esc(dc.bar.note_he)}. עורך דין לפי התעריף: לפחות ${esc(nis(r.fees.bar.total))} ועוד מע"מ ${r.fees.bar.vatPct}%, לכל צד.</caption></table></div></div>`;
	if (r.clock) {
		const c = r.clock;
		const rows = [[c.meetingsBy, `עד ${c.meetings} פגישות מהו"ת ביחידת הסיוע`, `${dc.disputes.sections.meetings}, ${dc.disputes.sections.meetings_days}`], [c.stayEnds, `סוף עיכוב ההליכים (${c.stayDays} ימים)`, dc.disputes.sections.stay], [c.claimsBy, `סוף ${c.claimDays} הימים שבהם רק מי שהגיש את הבקשה תובע`, dc.disputes.sections.claims]];
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">המועדים שבחוק</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button></div></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">עד תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ rows.map(([d, what, rule]) => { const past = opts.today && d < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="עד תאריך"><bdi>${isoToHe(d)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(what)}</td><td data-th="הכלל">${cite(rule, dc.disputes.url)}</td></tr>`; }).join('')
			+ `</tbody><caption>${esc(dc.disputes.permanent_he)}. ${esc(dc.disputes.free_he)}.</caption></table></div></div>`;
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-text-h">הצ'קליסט כטקסט</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copytext">העתקה</button></div></div><pre class="jtool-letter" role="region" aria-labelledby="${P}-text-h" tabindex="0">${esc(r.text)}</pre></div>`;
	return out;
}

/** Page section: the three routes side by side, steps and fees, for the same family. */
export function compareTable(reg) {
	const rows = MP_ROUTES.map((k) => {
		const x = mpBuild(reg, Object.assign({}, EXAMPLE, { route: k, done: [] }));
		return `<tr><td data-th="המסלול">${esc(mpRouteHe(k))}</td><td data-th="שלבים"><bdi>${x.progress.total}</bdi></td><td data-th="אגרות">${ils(x.fees.total, 0)}</td><td data-th="עורך דין, לפחות">${ils(x.fees.bar.total, 0)} + מע"מ</td><td data-th="מה קובע את הזמן">${esc(k === 'agree' ? 'מהירות החתימה והתור לדיון האישור' : k === 'mediate' ? `${reg.divorce_cost.disputes.stay_days} ימי עיכוב הליכים, ואז אישור ההסכם` : `${reg.divorce_cost.disputes.stay_days} ימי עיכוב, ואז תביעות; החוק לא קובע משך לדיונים`)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>אותה משפחה (ילדים, דירה ופנסיה, בבית המשפט לענייני משפחה) בשלושת המסלולים; אגרות כולל שתי תעודות גירושין</caption><thead><tr><th scope="col">המסלול</th><th scope="col">שלבים</th><th scope="col">אגרות</th><th scope="col">עורך דין, לפחות</th><th scope="col">מה קובע את הזמן</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = mpBuild(reg, EXAMPLE);
	const c = r.clock;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.fees.total,
		sticky: ils(r.fees.total, 0),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>המסלול: ${esc(mpRouteHe(r.route))} ב${esc(FORUM_HE[r.forum])}, עם ילדים, דירה ופנסיה: ${r.progress.total} שלבים בחמישה פרקים.</li>`
			+ `<li>השעון שבחוק, מיום הבקשה ${isoToHe(r.start)}: עד ${c.meetings} פגישות מהו"ת עד ${isoToHe(c.meetingsBy)} (${c.meetingsDays} ימים), סוף עיכוב ההליכים ${isoToHe(c.stayEnds)} (${c.stayDays} ימים), ו-${c.claimDays} ימים שבהם רק מי שהגיש את הבקשה תובע, עד ${isoToHe(c.claimsBy)}.</li>`
			+ `<li>האגרות: ${r.fees.lines.filter((l) => l.amount > 0).map((l) => `${esc(l.he)} ${esc(nis(l.amount))}`).join('; ')}; סך הכול ${esc(nis(r.fees.total))}.</li>`
			+ `<li>עורך דין, לפי התעריף המינימלי המומלץ של הלשכה (לא מחייב): לפחות ${esc(nis(r.fees.bar.total))} ועוד מע"מ, לכל צד.</li></ol>`,
		compare_table: compareTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root, done) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	return {
		route: (root.querySelector(`input[name="${P}-route"]:checked`) || {}).value || 'agree',
		forum: (root.querySelector(`input[name="${P}-forum"]:checked`) || {}).value || 'rabbinical',
		children: on('kids'), property: on('prop'), pension: on('pen'), extended: on('ext'),
		start: mpToIso(val(`#${P}-start`)), done: done.slice(),
	};
}
const RT = { agree: 'a', mediate: 'm', court: 'c' };
const stateOf = (i) => encodeState({ r: RT[i.route] || 'a', f: i.forum === 'family' ? 'f' : '', k: i.children ? 1 : '', p: i.property ? 1 : '', n: i.pension ? 1 : '', e: i.extended ? 1 : '', d: i.start, x: (i.done || []).join('.') });
const KEYS = ['r', 'f', 'k', 'p', 'n', 'e', 'd', 'x'];
function inputOf(s) {
	if (!s.r) { return null; }
	return { route: Object.keys(RT).find((k) => RT[k] === s.r) || 'agree', forum: s.f === 'f' ? 'family' : 'rabbinical', children: s.k === '1', property: s.p === '1', pension: s.n === '1', extended: s.e === '1', start: s.d || '', done: s.x ? String(s.x).split('.').filter(Boolean) : [] };
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const dc = reg.divorce_cost;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let done = [];
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(dc.checked_on, dc.refresh_every_days) || (dc.next_update && today >= dc.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרות התעדכנו'); }
	}
	const sync = () => {
		const route = (root.querySelector(`input[name="${P}-route"]:checked`) || {}).value || 'agree';
		form.querySelectorAll('[data-if-clock]').forEach((el) => { el.hidden = route === 'agree'; });
		const lg = form.querySelector('[data-forum-legend]');
		if (lg) { lg.textContent = route === 'court' ? 'איפה נדונים הרכוש והילדים' : 'איפה מאשרים את ההסכם'; }
	};
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
	const run = (input, opts = {}) => {
		const r = mpBuild(reg, Object.assign({}, input, { start: input.start || today }));
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today });
		if (sticky) { sticky.innerHTML = r.ok ? `<bdi>${r.progress.done}</bdi>/<bdi>${r.progress.total}</bdi>` : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.route }); }
		if (r.ok && !opts.noSave) { store.set(saveKey, stateOf(input)); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root, done)); }, 160);
	};
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	const saved = fromHash ? null : inputOf(decodeState(store.get(saveKey) || '', KEYS));
	const initial = fromHash || saved;
	if (initial) {
		done = initial.done.slice();
		form.innerHTML = renderForm(reg, initial);
		if (fromHash) { const note = root.querySelector('[data-jtool-shared]'); if (note) { note.hidden = false; } }
		run(initial, { silent: true, noSave: true });
	} else {
		// A fresh visit counts the clock from today, and the result is recomputed for that day (the server HTML holds the
		// example's day; Codex review, PR 137).
		const startField = root.querySelector(`#${P}-start`);
		if (startField) { startField.value = isoToHe(today); }
		run(readForm(root, done), { silent: true, noSave: true });
	}
	root.querySelectorAll('[data-jtool-saved]').forEach((n) => n.remove());
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	result.addEventListener('change', (ev) => {
		const box = ev.target.closest('[data-step]');
		if (!box) { return; }
		const id = box.getAttribute('data-step');
		done = box.checked ? done.concat(id) : done.filter((x) => x !== id);
		if (timer) { clearTimeout(timer); timer = null; }
		run(readForm(root, done));
		const again = root.querySelector(`[data-step="${id}"]`);
		if (again) { again.focus(); }
		track('tool_result', { tool_id: TOOL_ID, band: box.checked ? 'step_done' : 'step_undone' });
	});
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		const input = readForm(root, done);
		const r = run(input, { silent: true });
		const link = shareUrl(stateOf(input));
		if (act === 'ics' && r.ok && r.clock) {
			const c = r.clock;
			download('gerushin-map.ics', 'text/calendar;charset=utf-8', ics([{ date: c.meetingsBy, summary: 'גירושין: סוף פגישות המהו"ת ביחידת הסיוע' }, { date: c.stayEnds, summary: 'גירושין: סוף עיכוב ההליכים' }, { date: c.claimsBy, summary: 'גירושין: סוף החלון שבו רק מגיש הבקשה תובע' }], new Date().toISOString()));
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'copytext' && r.ok) {
			const ok = await copyText(r.text);
			toast(root, ok ? 'הצ\'קליסט הועתק.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות או פרטים מזהים.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · מפת הדרכים לגירושין מ-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (נבנה ב-jus-tice.co.il)`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.route : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { done = s.done.slice(); form.innerHTML = renderForm(reg, s); sync(); run(s); }
		} else if (act === 'clear') {
			store.clear(saveKey);
			done = [];
			run(readForm(root, done), { noSave: true });
			toast(root, 'ההתקדמות נמחקה מהמכשיר.');
		} else if (act === 'lawyer') {
			track('tool_lawyer_click', { tool_id: TOOL_ID });
		}
	});
	sync();
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
