/**
 * The rights wave UI (21.10.2026): the credit-points builder (nekudot-zikui) on /nekudot-zikui/.
 * The points ledger shows the year's points as one strip, category by category, the way a payslip lists them; the
 * year strip under it shows 2020-2026 side by side, so the years a refund can still be asked for stand out and lead to
 * the refund calculator. The table, the Form 101 map and the .ics say the same in text, each line with its section.
 */
import { computePoints, profileForm, readProfile, profileState, profileFromState, PROFILE_KEYS, PROFILE_DEFAULT, fmtPts, fmtNis, yearsRange, kidsPeriod, bandPts, taxYear } from './mas-engine.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'nekudot-zikui';
const P = 'jt29';
const REFUND_PATH = '/guide-tax-calculator-updated-2025/';

export const EXAMPLE = Object.assign({}, PROFILE_DEFAULT, { gender: 'f', marital: 'married', kids: [[2019, 1], [2023, 1]], degree: 'ba', degreeYear: 2024, degreeYears: 3, year: 2026 });

const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : '');
const ptsHtml = (n) => `<bdi>${esc(fmtPts(n))}</bdi>`;
const GROUP = { resident: 'base', woman: 'base', support: 'family', single: 'family', sole: 'family', alimony: 'family', spouse: 'family', disabled: 'family', degree: 'study', ma: 'study', soldier: 'service', reservist: 'service', immigrant: 'service' };
const groupOf = (key) => GROUP[key] || (key.startsWith('kid') ? 'kids' : 'base');
const GROUP_HE = { base: 'תושבות ומגדר', kids: 'ילדים', family: 'משפחה', study: 'לימודים', service: 'שירות ועלייה' };

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const rt = reg.rights_tax;
	const y = Number(input.year) || rt.current_year;
	const chip = (value, label, checked) => `<label class="jtool-chip"><input type="radio" name="${P}-yr" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	return `<fieldset class="jtool-field"><legend>שנת המס</legend><div class="jtool-chips">${yearsRange(rt).slice().reverse().map((yy) => chip(yy, String(yy), yy === y)).join('')}</div><p class="jtool-error" id="${P}-year-e" role="alert"></p>`
		+ `<p class="jtool-hint">כל שנה לפי הכללים והסכומים שלה. על ${rt.current_year - rt.refund.years_back} עד ${rt.current_year - 1} אפשר עוד לבקש החזר (סעיף 160).</p></fieldset>`
		+ profileForm(P, rt, input);
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const kids = r.lines.filter((l) => l.key.startsWith('kid')).reduce((a, l) => a + l.pts, 0);
	return `ב-${r.year} מגיעות ${fmtPts(r.total)} נקודות זיכוי${kids ? `, מתוכן ${fmtPts(kids)} בעד הילדים` : ''}: ${fmtNis(r.monthly)} בחודש, ${fmtNis(r.value)} בשנה (נקודה = ${fmtNis(r.pointMonth)} בחודש).`
		+ (r.missed.length ? ` בשנים ${r.missed.map((m) => m.year).join(', ')} מגיעות יותר מהבסיס; אם המעסיק לא נתן אותן, אפשר לבקש החזר.` : '');
}

/** The ledger: one strip, a segment per category, widths by points. */
function ledger(r) {
	const groups = {};
	r.lines.forEach((l) => { const g = groupOf(l.key); groups[g] = (groups[g] || 0) + l.pts; });
	const order = ['base', 'kids', 'family', 'study', 'service'].filter((g) => groups[g]);
	return `<div class="${P}-ledger" role="img" aria-label="${esc(`${fmtPts(r.total)} נקודות ב-${r.year}: ${order.map((g) => `${GROUP_HE[g]} ${fmtPts(groups[g])}`).join(', ')}`)}">`
		+ `<p class="${P}-ledger__h">נקודות הזיכוי ב-${r.year}, לפי סוג</p>`
		+ `<div class="${P}-ledger__bar">${order.map((g) => `<span class="${P}-seg ${P}-seg--${g}" style="flex-grow:${groups[g]}"><bdi>${esc(fmtPts(groups[g]))}</bdi></span>`).join('')}</div>`
		+ `<p class="${P}-ledger__keys">${order.map((g) => `<span><i class="${P}-k ${P}-seg--${g}" aria-hidden="true"></i>${esc(GROUP_HE[g])}</span>`).join('')}</p></div>`;
}

/** The years: 2020-2026 side by side; a refund can still be asked for the marked ones. */
function yearStrip(r) {
	const max = Math.max(...r.years.map((y) => y.total), 1);
	return `<ol class="${P}-years" aria-label="נקודות הזיכוי בכל שנה, ${esc(String(r.years[0].year))} עד ${esc(String(r.years[r.years.length - 1].year))}">`
		+ r.years.map((y) => `<li class="${P}-yr${y.year === r.year ? ` ${P}-yr--here` : ''}${y.refundable && y.extra > 0 ? ` ${P}-yr--back` : ''}">`
			+ `<span class="${P}-yr__bar" style="height:${Math.max(4, Math.round((y.total / max) * 110))}px" aria-hidden="true"></span>`
			+ `<strong class="${P}-yr__pts"><bdi>${esc(fmtPts(y.total))}</bdi></strong><span class="${P}-yr__y"><bdi>${y.year}</bdi></span>`
			+ `<span class="${P}-yr__v">${ils(y.value, 0)}</span></li>`).join('')
		+ `</ol><p class="${P}-years__note"><span class="${P}-k ${P}-k--back" aria-hidden="true"></span>שנה שאפשר עוד לבקש עליה החזר, אם המעסיק נתן פחות נקודות. <a href="${esc(REFUND_PATH)}" data-act="refund">לחשב את ההחזר</a></p>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const rt = reg.rights_tax;
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--ok">✓ ${r.current ? `לפי הכללים של ${r.year}` : `שנה שעברה: ${r.year}`}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}נקודות זיכוי ב-${r.year}</p>`
		+ `<strong class="jtool-verdict__figure">${ptsHtml(r.total)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown"><div><dt>בחודש</dt><dd>${ils(r.monthly)}</dd></div><div><dt>בשנה</dt><dd>${ils(r.value)}</dd></div><div><dt>נקודה אחת</dt><dd>${ils(r.pointMonth, 0)} בחודש</dd></div></dl>`
		+ `<p class="jtool-scope">הסכום מקוזז מהמס, לא משולם בכסף: מי שהמס שלו נמוך מהשווי לא מקבל את ההפרש (${esc(rt.point_section)}).</p></div>`
		+ ledger(r) + yearStrip(r)
		+ (r.notes.length ? `<ul class="jtool-flags">${r.notes.map((n) => `<li>${esc(n.he)}</li>`).join('')}</ul>` : '');
}

/** What to write on Form 101, as a numbered list (also copied as text). */
export function form101List(reg, r) {
	const rt = reg.rights_tax;
	const items = rt.form101.items;
	const out = [];
	const seen = new Set();
	r.lines.forEach((l) => {
		if (!l.f101 || seen.has(l.f101)) { return; }
		seen.add(l.f101);
		out.push({ item: l.f101, he: l.key.startsWith('kid') ? 'הילדים, לפי קבוצות הגיל' : l.he, section: l.section });
	});
	if (r.lines.some((l) => l.key.startsWith('kid'))) { out.push({ item: items.kids_list, he: 'שם, תאריך לידה ומספר זהות של כל ילד, ואצל מי הוא גר', section: '' }); }
	if (r.lines.some((l) => l.key === 'degree' || l.key === 'ma')) { out.push({ item: 'טופס 119', he: rt.points.degree.form_he, section: rt.points.degree.sections.ba }); }
	out.push({ item: items.one_employer, he: 'נקודות ומדרגות אצל מעסיק אחד בלבד', section: '' });
	return out;
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const rt = reg.rights_tax;
	const row = taxYear(rt, r.year);
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-pts-h">כמה נקודות, על מה, ולפי איזה סעיף</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-pts-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">על מה</th><th scope="col">נקודות</th><th scope="col">בשנה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.lines.map((l) => `<tr><td data-th="על מה">${esc(l.he)}</td><td data-th="נקודות">${ptsHtml(l.pts)}</td><td data-th="בשנה">${ils(l.pts * row.point_year)}</td><td data-th="הכלל">${cite(l.section, l.url)}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="על מה">סך הכול ב-${r.year}</td><td data-th="נקודות">${ptsHtml(r.total)}</td><td data-th="בשנה">${ils(r.value)}</td><td data-th="הכלל">נקודה = ${esc(fmtNis(row.point_month))} בחודש${cite(rt.point_section, row.url)}</td></tr></tbody>`
		+ `<caption>${esc(row.source_he)}. ${row.frozen ? `${esc(rt.freeze.he)}. ` : ''}החישוב השנתי; המעסיק נותן כל חודש 1/12 מהנקודות.</caption></table></div></div>`;
	// Form 101: the boxes to tick.
	const list = form101List(reg, r);
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-101-h">מה לכתוב בטופס 101${r.current ? '' : ` (לשנה הנוכחית, ${rt.current_year})`}</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ol class="${P}-form">${list.map((x) => `<li><span class="${P}-form__box" aria-hidden="true">✓</span><strong>${esc(x.item)}</strong><span>${esc(x.he)}</span></li>`).join('')}</ol>`
		+ `<p class="${P}-form__note">${esc(rt.form101.when_he)}${r.current ? '' : `. על ${r.year} כבר אי אפשר למלא טופס 101: מבקשים החזר בטופס 135`}.${cite('טופס 101', rt.form101.url)}</p></div>`;
	// Two employers.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-two-h">שתי משרות: טופס 116 ותיאום מס</h3></div>`
		+ `<p class="${P}-two">${esc(rt.coordination.he)}. ${esc(rt.coordination.current_year_only_he)}.${cite('תיאום מס מקוון', rt.coordination.service_url)}${cite(`טופס ${rt.coordination.form}`, rt.coordination.form_url)}</p>`
		+ `<p class="${P}-two">${esc(rt.towns.he)}.${cite(`${rt.towns.section}: רשימת היישובים`, rt.towns.url)}</p></div>`;
	// Every year.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-yrs-h">אותו פרופיל, כל שנה מ-${r.years[0].year}</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">מועדי ההחזר ליומן (.ics)</button></div></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-yrs-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">שנה</th><th scope="col">נקודות</th><th scope="col">בחודש</th><th scope="col">בשנה</th><th scope="col">החזר עד</th></tr></thead><tbody>`
		+ r.years.map((y) => `<tr${y.year === r.year ? ' class="jtool-table__total"' : ''}><td data-th="שנה"><bdi>${y.year}</bdi></td><td data-th="נקודות">${ptsHtml(y.total)}</td><td data-th="בחודש">${ils(y.monthly)}</td><td data-th="בשנה">${ils(y.value)}</td><td data-th="החזר עד">${y.refundable ? `<bdi>${esc(isoToHe(y.deadline))}</bdi>` : '—'}</td></tr>`).join('')
		+ `</tbody><caption>כל שנה לפי הכללים ושווי הנקודה שלה. מעל הבסיס (${esc(fmtPts(r.base))} נקודות) המעסיק נותן רק מה שהצהרתם בטופס 101; את מה שלא ניתן מבקשים בטופס 135, עד שש שנים אחורה (${esc(rt.refund.section)}).</caption></table></div>`
		+ `<p class="${P}-two"><a class="jtool-btn jtool-btn--primary" href="${esc(REFUND_PATH)}" data-act="refund">לחשב את ההחזר לשנים האלה</a></p></div>`;
	return out;
}

/** Page section: the credit point and the children table of every year, from the registry. */
export function pointsTable(reg) {
	const rt = reg.rights_tax;
	const ages = [[0, 'שנת הלידה'], [1, '1'], [2, '2'], [3, '3'], [4, '4-5'], [6, '6-12'], [13, '13-17'], [18, '18']];
	const rows = yearsRange(rt).slice().reverse().map((y) => {
		const row = taxYear(rt, y);
		const per = kidsPeriod(rt, y);
		const cell = (bands, a) => `<bdi>${esc(fmtPts(bandPts(bands, a)))}</bdi>`;
		return `<tr><td data-th="שנה"><bdi>${y}</bdi></td><td data-th="נקודה בחודש">${ils(row.point_month, 0)}</td><td data-th="בשנה">${ils(row.point_year, 0)}</td>`
			+ ages.map(([a, label]) => `<td data-th="ילד ${esc(label)}">${cell(per.col1, a)} / ${cell(per.col2, a)}</td>`).join('') + `<td data-th="מקור"><a href="${esc(row.url)}" target="_blank" rel="noopener">${esc(row.source_he)}</a></td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>שווי נקודת זיכוי ונקודות הזיכוי לילדים לפי שנה. בכל תא: אישה נשואה או הורה שהילד גר איתו / גבר נשוי או הורה שהילד לא גר איתו (${esc(rt.points.kids_sections.married_woman)} ו-(5); ${esc(rt.points.kids_sections.single_with)} ו-(1א))</caption>`
		+ `<thead><tr><th scope="col">שנה</th><th scope="col">נקודה בחודש</th><th scope="col">בשנה</th>${ages.map(([, label]) => `<th scope="col">ילד ${esc(label)}</th>`).join('')}<th scope="col">מקור</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const rt = reg.rights_tax;
	const r = computePoints(reg, EXAMPLE);
	const row = taxYear(rt, r.year);
	const per = kidsPeriod(rt, r.year);
	const kid = (i) => r.lines.find((l) => l.key === `kid${i}`);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.total,
		sticky: ptsHtml(r.total),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>תושבת ישראל: 2 נקודות ועוד רבע נקודת נסיעה = ${fmtPts(rt.points.resident.pts + rt.points.travel.pts)}${cite(rt.points.resident.section, rt.law_url)}${cite(rt.points.travel.section, rt.law_url)}</li>`
			+ `<li>אישה: ${fmtPts(rt.points.woman.pts)} נקודה${cite(rt.points.woman.section, rt.law_url)}</li>`
			+ `<li>ילד/ה שנולד/ה ב-2019, בגיל ${r.year - 2019} ב-${r.year}: ${fmtPts(kid(0).pts)} נקודות; ילד/ה שנולד/ה ב-2023, בגיל ${r.year - 2023}: ${fmtPts(kid(1).pts)} נקודות${cite(rt.points.kids_sections.married_woman, rt.law_url)}${cite('הטבלה מ-2024', per.url)}</li>`
			+ `<li>תואר ראשון שהסתיים ב-2024 אחרי 3 שנות לימוד: נקודה אחת ב-2025, 2026 ו-2027${cite(rt.points.degree.sections.ba, rt.law_url)}</li>`
			+ `<li>סך הכול ${fmtPts(r.total)} נקודות × ${money(row.point_month, 0)} ₪ = ${money(r.monthly)} ₪ בחודש; × ${money(row.point_year, 0)} ₪ = ${money(r.value)} ₪ בשנה${cite(rt.point_section, row.url)}</li></ol>`,
		compare_table: pointsTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

export function stateOf(i) {
	return encodeState(Object.assign({ y: Number(i.year) && Number(i.year) !== 0 ? i.year : '' }, profileState(i)));
}
export const KEYS = ['y'].concat(PROFILE_KEYS);
export function inputOf(s) {
	if (!s || !s.G) { return null; }
	return Object.assign(profileFromState(s), { year: s.y ? Number(s.y) : '' });
}

function readForm(root) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const p = readProfile(val, on, pick, root.querySelectorAll('[data-kid]').length);
	p.year = Number(pick('yr', '')) || '';
	return p;
}

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
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן ששווי הנקודה התעדכן ב-1 בינואר'); }
	}
	const ids = { year: 'year', degreeYear: 'dgy', degreeYears: 'dgn', maYear: 'may', maYears: 'man', discharge: 'dis', served: 'srv', aliyah: 'aly', reserve: 'res', disabled: 'dsb' };
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
		const r = computePoints(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? ptsHtml(r.total) : '—'; }
		// Every link to the refund page (the result, the details and the next-step button) carries the profile.
		root.querySelectorAll(`a[href*="${REFUND_PATH}"]`).forEach((a) => { a.setAttribute('href', `${a.getAttribute('href').split('#')[0]}#s=${stateOf(input)}`); });
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.total < 3 ? 'base' : r.total < 6 ? 'mid' : 'high' }); }
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
	const fromHash = inputOf(decodeState(window.location.hash, KEYS));
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(fromHash, { silent: true });
	} else {
		run(readForm(root), { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		if (act === 'kid-add') {
			input.kids = input.kids.concat([['', 1]]);
			redraw(input, `#${P}-kid-${input.kids.length - 1}`);
			return;
		}
		if (act === 'kid-del') {
			const n = Number(b.getAttribute('data-kid-del'));
			input.kids = input.kids.filter((k, i) => i !== n);
			redraw(input, '[data-act="kid-add"]');
			return;
		}
		const r = computePoints(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או טלפון.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי פקודת מס הכנסה ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(rt.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(form101List(reg, r).map((x, i) => `${i + 1}. ${x.item}: ${x.he}`).join('\n'));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'ics' && r.ok) {
			const ev = r.years.filter((y) => y.refundable && y.extra > 0).map((y) => ({ date: y.deadline, summary: `החזר מס ${y.year}: היום האחרון להגיש טופס 135`, description: `סעיף 160 לפקודת מס הכנסה. חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.` }));
			if (ev.length) { download('nekudot-zikui.ics', 'text/calendar;charset=utf-8', ics(ev, new Date().toISOString())); } else { toast(root, 'אין שנה פתוחה עם נקודות מעל הבסיס.'); }
			track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
		} else if (act === 'refund') {
			track('tool_next_click', { tool_id: TOOL_ID, band: r.ok && r.missed.length ? 'missed' : 'none' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? 'ok' : 'error' });
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
