/**
 * Divorce statistics (HAD-616, Ben 31.10.2026: "the statistics on divorce, something sophisticated, a tool you can check by
 * years and by all kinds of things"): "נתוני גירושין בישראל" (netunei-gerushin, prefix jt75) on /divorce-lawyer/, in the
 * chapter "מה זה גירושין". Seventy years of the official series by community (the Central Bureau of Statistics), one year
 * against another, six measures, the published breakdowns (age, city, district, the rabbinical courts' claims), "your age
 * against the table", and the rabbinical courts' own counts by year. Every number is in reg.fl_netunim
 * (tools/justice_tools_fl_netunim.py) with its table and publication; a year a source did not publish is missing.
 */
import { esc, money, isoToHe, encodeState, decodeState, track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, ilToday } from './instrument.js';

export const TOOL_ID = 'netunei-gerushin';
export const PAGE = '/divorce-lawyer/';
const P = 'jt75';
const W = 640;
const H = 220;

/** One series, {year: value}. "ratio" is computed from the two published counts of the same year. */
export function ntSeries(reg, metric, group) {
	const n = reg.fl_netunim;
	if (metric === 'ratio') {
		const d = n.series.count[group] || {};
		const m = n.series.marriages[group] || {};
		const out = {};
		for (const y of Object.keys(d)) { if (m[y]) { out[y] = Math.round((d[y] / m[y]) * 1000) / 10; } }
		return out;
	}
	return (n.series[metric] || {})[group] || {};
}
export function ntYears(reg, metric, group) {
	const s = ntSeries(reg, metric, group);
	return Object.keys(s).filter((y) => typeof s[y] === 'number').sort();
}
export function ntGroups(reg, metric) {
	return reg.fl_netunim.groups.filter((g) => ntYears(reg, metric, g.id).length > 1);
}

export function ntDefaults(reg) {
	const n = reg.fl_netunim;
	const last = String(n.latest_year);
	return { metric: 'count', group: 'all', year: last, vs: String(Number(last) - 10), cut: n.breakdowns[0].id, age: '' };
}

const fmt = (kind, v) => (kind === 'count' ? money(v, 0) : (Math.round(v * 10) / 10).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }));

function sentenceOf(i, metric, group, value) {
	const g = group.id === 'all' ? '' : ` ${group.among_he}`;
	switch (metric.id) {
		case 'count': return `בשנת ${i.year} התגרשו בישראל ${fmt('count', value)} זוגות${group.id === 'all' ? '' : ` ${group.in_he}`}`;
		case 'rate': return `בשנת ${i.year} היו בישראל ${fmt('rate', value)} גירושין לכל 1,000 תושבים${g}`;
		case 'married': return `בשנת ${i.year} התגרשו ${fmt('rate', value)} מכל 1,000 נשואים ונשואות בני 15 ומעלה${g}`;
		case 'ratio': return `בשנת ${i.year} נרשמו ${fmt('rate', value)} גירושין לכל 100 חתונות${g}`;
		case 'age_m': return `בשנת ${i.year} הגיל החציוני של גבר שהתגרש היה ${fmt('age', value)}${g}`;
		default: return `בשנת ${i.year} הגיל החציוני של אישה שהתגרשה היה ${fmt('age', value)}${g}`;
	}
}

/** The age line: the reader's age against the 2024 table, women and men, share and rate per 1,000 married. */
function ageLine(reg, age) {
	const n = reg.fl_netunim;
	const f = n.breakdowns.find((b) => b.id === 'age_f');
	const m = n.breakdowns.find((b) => b.id === 'age_m');
	if (!f || !m) { return null; }
	const pick = (b) => b.rows.find((r) => age >= r.lo && (r.hi === null || age <= r.hi));
	const rf = pick(f);
	const rm = pick(m);
	if (!rf || !rm) { return null; }
	const tf = f.rows.reduce((s, r) => s + r.value, 0);
	const tm = m.rows.reduce((s, r) => s + r.value, 0);
	return { band: rf.he, year: f.year, wives: rf.value, husbands: rm.value, shareF: Math.round((rf.value / tf) * 1000) / 10, shareM: Math.round((rm.value / tm) * 1000) / 10, rateF: rf.rate, rateM: rm.rate };
}

/** The engine: the selections in, the sentence, the series, the change, the breakdown and the age line out. */
export function ntCompute(reg, input) {
	const n = reg.fl_netunim;
	const i = Object.assign(ntDefaults(reg), input || {});
	if (!n.metrics.some((m) => m.id === i.metric)) { i.metric = 'count'; }
	if (!ntGroups(reg, i.metric).some((g) => g.id === i.group)) { i.group = 'all'; }
	const years = ntYears(reg, i.metric, i.group);
	if (!years.includes(i.year)) { i.year = years[years.length - 1]; }
	if (!years.includes(i.vs) || i.vs === i.year) {
		const back = String(Number(i.year) - 10);
		i.vs = years.includes(back) ? back : (years[0] === i.year ? years[years.length - 1] : years[0]);
	}
	if (!n.breakdowns.some((b) => b.id === i.cut)) { i.cut = n.breakdowns[0].id; }
	const errors = [];
	let age = null;
	const a = String(i.age || '').trim();
	if (a !== '') {
		const v = Number(a);
		if (!Number.isInteger(v) || v < 15 || v > 99) { errors.push({ field: 'age', he: 'גיל בין 15 ל-99' }); } else { age = ageLine(reg, v); }
	}
	if (errors.length) { return { ok: false, errors, input: i }; }
	const series = ntSeries(reg, i.metric, i.group);
	const metric = n.metrics.find((m) => m.id === i.metric);
	const group = n.groups.find((g) => g.id === i.group);
	const value = series[i.year];
	const before = series[i.vs];
	let sentence = sentenceOf(i, metric, group, value);
	let change = null;
	if (typeof before === 'number') {
		if (metric.kind === 'age') {
			change = Math.round((value - before) * 10) / 10;
			sentence += change === 0 ? `, כמו בשנת ${i.vs}` : `, ${Math.abs(change).toLocaleString('en-US')} שנים ${change > 0 ? 'יותר' : 'פחות'} מבשנת ${i.vs} (${fmt('age', before)})`;
		} else {
			change = Math.round(((value - before) / before) * 1000) / 10;
			sentence += change === 0 ? `, כמו בשנת ${i.vs}` : `, ${Math.abs(change).toLocaleString('en-US')}% ${change > 0 ? 'יותר' : 'פחות'} מבשנת ${i.vs} (${fmt(metric.kind, before)})`;
		}
	}
	sentence += '.';
	return { ok: true, input: i, metric, group, years, series, value, before, change, sentence, cut: n.breakdowns.find((b) => b.id === i.cut), age };
}

/** The chart: bars in an SVG that stretches to the width, the labels in HTML so they never shrink on a phone. */
function chartBlock(r) {
	const ys = r.years;
	const vals = ys.map((y) => r.series[y]);
	const lo = r.metric.kind === 'age' ? Math.floor(Math.min(...vals) * 0.9) : 0;
	const max = Math.max(...vals);
	const span = (max - lo) * 1.08 || 1;
	const bw = W / ys.length;
	const bars = ys.map((y, k) => {
		const h = Math.max(1, Math.round(((r.series[y] - lo) / span) * H));
		const cls = y === r.input.year ? `${P}-bar is-year` : (y === r.input.vs ? `${P}-bar is-vs` : `${P}-bar`);
		return `<rect class="${cls}" x="${(k * bw + bw * 0.12).toFixed(1)}" y="${H - h}" width="${(bw * 0.76).toFixed(1)}" height="${h}"><title>${y}: ${fmt(r.metric.kind, r.series[y])}</title></rect>`;
	}).join('');
	const at = (y) => (((ys.indexOf(y) + 0.5) / ys.length) * 100).toFixed(2);
	// A label near an edge grows inward, so it never leaves the column.
	const edge = (y) => { const x = Number(at(y)); return x > 88 ? ' is-end' : (x < 12 ? ' is-start' : ''); };
	const marks = [...new Set([ys[0], ys[ys.length - 1], r.input.vs, r.input.year])];
	const peak = ys[vals.indexOf(max)];
	return `<div class="${P}-chart" dir="ltr">`
		+ `<span class="${P}-peak${edge(peak)}" style="left:${at(peak)}%">${fmt(r.metric.kind, max)} (${peak})</span>`
		+ `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="${esc(`${r.metric.he}${r.group.id === 'all' ? '' : `, ${r.group.he}`}, ${ys[0]} עד ${ys[ys.length - 1]}; השיא ${fmt(r.metric.kind, max)} בשנת ${peak}`)}">${bars}</svg>`
		+ `<div class="${P}-axis">${marks.map((y) => `<span class="${y === r.input.year ? 'is-year' : (y === r.input.vs ? 'is-vs' : '')}${edge(y)}" style="left:${at(y)}%">${y}</span>`).join('')}</div></div>`;
}

function cutBars(reg, r) {
	const c = r.cut;
	const total = c.rows.reduce((s, x) => s + x.value, 0);
	const max = Math.max(...c.rows.map((x) => x.value));
	const mine = r.age && c.kind === 'age' ? r.age.band : null;
	const shown = (x) => (c.show === 'share' ? `${Math.round((x.value / total) * 1000) / 10}%` : `${(Math.round(x.value * 10) / 10).toLocaleString('en-US')}${c.unit_he === '%' ? '%' : ''}`);
	return `<div class="${P}-cut"><p class="${P}-cut__head">${esc(c.he)} (${c.year})</p><div class="${P}-rows">${c.rows.map((x) => `<div class="${P}-row${mine === x.he ? ' is-you' : ''}"><span class="${P}-row__label">${esc(x.he)}</span><span class="${P}-row__bar" aria-hidden="true"><span style="width:${Math.max(2, Math.round((x.value / max) * 100))}%"></span></span><span class="${P}-row__val"><bdi>${shown(x)}</bdi></span></div>`).join('')}</div>${c.note_he ? `<p class="${P}-note">${esc(c.note_he)}</p>` : ''}</div>`;
}

export function renderForm(reg, input) {
	const n = reg.fl_netunim;
	const i = Object.assign(ntDefaults(reg), input || {});
	const chip = (name, value, label, checked) => `<label class="jtool-chip"><input type="radio" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const years = ntYears(reg, i.metric, i.group).slice().reverse();
	const opts = (sel) => years.map((y) => `<option value="${y}"${y === sel ? ' selected' : ''}>${y}</option>`).join('');
	return `<fieldset class="jtool-field"><legend>1. מה לבדוק</legend><div class="jtool-chips">${n.metrics.map((m) => chip('metric', m.id, m.he, i.metric === m.id)).join('')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>2. מי</legend><div class="jtool-chips">${ntGroups(reg, i.metric).map((g) => chip('group', g.id, g.he, i.group === g.id)).join('')}</div></fieldset>`
		+ `<div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-year">3. שנה</label><select id="${P}-year">${opts(i.year)}</select></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-vs">מול שנה</label><select id="${P}-vs">${opts(i.vs)}</select></div></div>`
		+ `<fieldset class="jtool-field"><legend>4. פילוח</legend><div class="jtool-chips">${n.breakdowns.map((b) => chip('cut', b.id, b.tab_he, i.cut === b.id)).join('')}</div></fieldset>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-age">5. בני כמה אתם? <small>(לא חובה)</small></label><input id="${P}-age" type="text" inputmode="numeric" autocomplete="off" value="${esc(i.age)}" placeholder="לדוגמה: 38" aria-describedby="${P}-age-e"><p class="jtool-error" id="${P}-age-e" role="alert"></p></div>`;
}

export function verdictSentence(reg, r) { return r.ok ? r.sentence : ''; }

export function renderResult(reg, r, opts = {}) {
	const n = reg.fl_netunim;
	if (!r.ok) { return `<p class="jtool-hint">${esc(r.errors[0].he)}</p>`; }
	const src = n.sources.find((s) => s.id === r.metric.source);
	const a = r.age;
	const age = a ? `<p class="${P}-you">בגיל ${esc(a.band)} התגרשו בשנת ${a.year} <bdi>${money(a.wives, 0)}</bdi> נשים ו-<bdi>${money(a.husbands, 0)}</bdi> גברים: <bdi>${a.shareF}%</bdi> מהנשים ו-<bdi>${a.shareM}%</bdi> מהגברים שהתגרשו באותה שנה. מכל 1,000 נשים נשואות בגיל הזה התגרשו <bdi>${fmt('rate', a.rateF)}</bdi>, ומכל 1,000 גברים נשואים <bdi>${fmt('rate', a.rateM)}</bdi>.</p>` : '';
	return `<div class="jtool-verdict ${P}-verdict" aria-live="polite">${opts.example ? `<p class="jtool-example">${n.latest_year}, השנה האחרונה שהלמ"ס פרסמה, מול עשר שנים קודם. בחרו מדד, עדה, שנה ופילוח.</p>` : ''}`
		+ `<p class="${P}-sentence">${esc(r.sentence)}</p>`
		+ `<p class="${P}-note">${esc(r.metric.note_he)}.</p>`
		+ age
		+ `<p class="${P}-reviewed">מקור: <a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.name_he)}</a> (פורסם ${esc(src.published)}). ${esc(n.reviewed_he)} · עודכן ${isoToHe(n.checked_on)} · <a href="#${P}-live">לתרשים ולפילוח</a></p></div>`;
}

/** The full-width part under the form: the chart over the years, the legend, the breakdown. Redrawn on every change. */
export function liveBlock(reg, r) {
	if (!r.ok) { return `<div class="${P}-live" id="${P}-live"></div>`; }
	const v = (y) => `<bdi>${fmt(r.metric.kind, r.series[y])}</bdi>`;
	return `<div class="${P}-live" id="${P}-live"><h3 class="${P}-h">${esc(r.metric.he)}${r.group.id === 'all' ? '' : `, ${esc(r.group.he)}`}: ${r.years[0]} עד ${r.years[r.years.length - 1]}</h3>`
		+ chartBlock(r)
		+ `<p class="${P}-legend"><span class="${P}-key is-year"></span>${r.input.year}: ${v(r.input.year)} <span class="${P}-key is-vs"></span>${r.input.vs}: ${v(r.input.vs)}</p>`
		+ cutBars(reg, r) + '</div>';
}

/** The table by year and community (the server HTML crawlers and AI agents read), the rabbinical courts' tables, the method. */
export function yearTable(reg) {
	const n = reg.fl_netunim;
	const cols = n.groups.filter((g) => ntYears(reg, 'count', g.id).length > 1);
	const years = ntYears(reg, 'count', 'all').slice().reverse();
	const m = n.series.marriages.all;
	const cell = (v) => (typeof v === 'number' ? `<bdi>${money(v, 0)}</bdi>` : '—');
	return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-t-h">גירושין בישראל לפי שנה ודת, ${years[years.length - 1]} עד ${years[0]}</h3></div><details class="${P}-more"><summary>הטבלה המלאה: ${years.length} שנים</summary><div class="jtool-datawrap"><table class="jtool-datatable ${P}-table"><caption>${esc(n.table_caption_he)}</caption><thead><tr><th scope="col">שנה</th>${cols.map((g) => `<th scope="col">${esc(g.id === 'all' ? 'כל הזוגות' : g.he)}</th>`).join('')}<th scope="col">חתונות</th></tr></thead><tbody>${years.map((y) => `<tr><th scope="row" data-th="שנה">${y}</th>${cols.map((g) => `<td data-th="${esc(g.id === 'all' ? 'כל הזוגות' : g.he)}">${cell(ntSeries(reg, 'count', g.id)[y])}</td>`).join('')}<td data-th="חתונות">${cell(m[y])}</td></tr>`).join('')}</tbody></table></div></details></div>`;
}

export function rabbinicalTables(reg) {
	const n = reg.fl_netunim;
	return n.rabbinical_tables.map((t) => {
		const src = n.sources.find((s) => s.id === t.source);
		return `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-${t.id}-h">${esc(t.he)}</h3></div><div class="jtool-datawrap"><table class="jtool-datatable"><caption>${esc(t.caption_he)}${src ? ` <a href="${esc(src.url)}" target="_blank" rel="noopener">למקור</a>` : ''}</caption><thead><tr><th scope="col">שנה</th>${t.cols.map((c) => `<th scope="col">${esc(c.he)}</th>`).join('')}</tr></thead><tbody>${t.rows.slice().reverse().map((row) => `<tr><th scope="row" data-th="שנה">${row.year}</th>${t.cols.map((c) => `<td data-th="${esc(c.he)}">${typeof row[c.id] === 'number' ? `<bdi>${money(row[c.id], 0)}</bdi>` : '—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
	}).join('');
}

export function methodList(reg) {
	return `<ol class="jtool-method-list">${reg.fl_netunim.method_he.map((t) => `<li>${esc(t)}</li>`).join('')}</ol>`;
}

/** The line the print stylesheet shows: the current sentence, never the server's example (PR 176 review). */
export function printText(reg, r, printedOn) {
	return r.ok ? `${r.sentence} (נתוני גירושין בישראל, jus-tice.co.il, ${isoToHe(printedOn || reg.fl_netunim.checked_on)})` : '';
}

export function renderDetails(reg, r, opts = {}) {
	return `<div class="${P}-screen">${liveBlock(reg, r)}${yearTable(reg)}${rabbinicalTables(reg)}<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך קוראים את הנתונים</h3></div>${methodList(reg)}</div></div>`
		+ `<div class="${P}-print">${esc(printText(reg, r, opts.printedOn))}</div>`;
}

export const KEYS = ['m', 'g', 'y', 'v', 'c', 'a'];
export function stateOf(reg, input) {
	const n = reg.fl_netunim;
	return encodeState({ m: String(n.metrics.findIndex((x) => x.id === input.metric)), g: String(n.groups.findIndex((x) => x.id === input.group)), y: input.year, v: input.vs, c: String(n.breakdowns.findIndex((x) => x.id === input.cut)), a: String(input.age || '') });
}
export function inputOf(reg, s) {
	const n = reg.fl_netunim;
	if (!s || s.m === undefined) { return null; }
	const out = ntDefaults(reg);
	const m = n.metrics[Number(s.m)];
	const g = n.groups[Number(s.g)];
	const c = n.breakdowns[Number(s.c)];
	if (m) { out.metric = m.id; }
	if (g) { out.group = g.id; }
	if (c) { out.cut = c.id; }
	if (/^\d{4}$/.test(s.y || '')) { out.year = s.y; }
	if (/^\d{4}$/.test(s.v || '')) { out.vs = s.v; }
	if (/^\d{2}$/.test(s.a || '')) { out.age = s.a; }
	return out;
}

export function snapshot(reg) {
	const input = ntDefaults(reg);
	const r = ntCompute(reg, input);
	const n = reg.fl_netunim;
	const yr = String(n.latest_year);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input,
		total: r.value,
		sticky: `<bdi>${money(r.value, 0)}</bdi>`,
		form: renderForm(reg, input),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { printedOn: n.checked_on }),
		method: methodList(reg),
		sentence: verdictSentence(reg, r),
		// The answer box and the page's summary read these: the same figures the tool prints, never retyped.
		answer: {
			year: yr, count: r.value, vs: r.input.vs, before: r.before, change: r.change,
			jews: n.series.count.jews[yr], muslims: n.series.count.muslims[yr], christians: n.series.count.christians[yr], druze: n.series.count.druze[yr],
			marriages: n.series.marriages.all[yr], rate: n.series.rate.all[yr], married: n.series.married.all[yr],
			age_m: n.series.age_m.all[yr], age_f: n.series.age_f.all[yr],
			peak_prev: (() => { const s = n.series.count.all; const ys = Object.keys(s).filter((y) => y !== yr); const top = ys.reduce((a, b) => (s[b] > s[a] ? b : a)); return { year: top, value: s[top] }; })(),
			rb_year: (() => { const t = n.rabbinical_tables.find((x) => x.id === 'files'); const row = t.rows[t.rows.length - 1]; return { year: row.year, couples: row.couples }; })(),
			consent_days: n.facts.consent_days, women_filed_pct: n.facts.women_filed_pct,
		},
	};
}

function readForm(root) {
	const val = (sel) => { const el = root.querySelector(sel); return el ? el.value : ''; };
	const pick = (name) => { const el = root.querySelector(`input[name="${P}-${name}"]:checked`); return el ? el.value : ''; };
	return { metric: pick('metric'), group: pick('group'), year: val(`#${P}-year`), vs: val(`#${P}-vs`), cut: pick('cut'), age: val(`#${P}-age`) };
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const n = reg.fl_netunim;
	const saveKey = `jtool-${TOOL_ID}`;
	let own = false;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	const run = (input, opts = {}) => {
		const r = ntCompute(reg, input);
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		if (!r.ok) { const el = root.querySelector(`#${P}-age-e`); if (el) { el.textContent = r.errors[0].he; } }
		result.innerHTML = renderResult(reg, r);
		const live = root.querySelector(`.${P}-live`);
		if (live) { live.outerHTML = liveBlock(reg, r); }
		const print = root.querySelector(`.${P}-print`);
		if (print) { print.textContent = printText(reg, r, ilToday()); }
		// The engine may move the comparison year (a year against itself): the menus show what was computed (PR 176 review).
		if (r.ok) {
			const y = root.querySelector(`#${P}-year`);
			const v = root.querySelector(`#${P}-vs`);
			if (y && y.value !== r.input.year) { y.value = r.input.year; }
			if (v && v.value !== r.input.vs) { v.value = r.input.vs; }
		}
		if (sticky && r.ok) { sticky.innerHTML = `<bdi>${fmt(r.metric.kind, r.value)}</bdi>`; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: `${r.input.metric}-${r.input.group}-${r.input.cut}` }); }
		return r;
	};
	const current = () => (own ? readForm(root) : ntDefaults(reg));
	const apply = (input) => {
		own = true;
		const r = ntCompute(reg, input);
		const fixed = r.input || input;
		form.innerHTML = renderForm(reg, fixed);
		return run(fixed);
	};
	const changed = (ev) => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		const input = readForm(root);
		// A new measure or community changes which years exist: redraw the form around the engine's corrected choice.
		if (ev && ev.target && /-(metric|group)$/.test(ev.target.name || '')) { apply(input); return; }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(input); }, 120);
	};
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = shareOwner === TOOL_ID ? inputOf(reg, decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS)) : null;
	if (parsed) {
		apply(parsed);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
	}
	if (store.get(saveKey) && !parsed) { const s = root.querySelector('[data-jtool-saved]'); if (s) { s.hidden = false; } }
	form.addEventListener('change', changed);
	form.addEventListener('input', (ev) => { if (ev.target && ev.target.id === `${P}-age`) { changed(ev); } });
	root.addEventListener('click', async (ev) => {
		const el = ev.target.closest('[data-act]');
		if (!el) { return; }
		const act = el.getAttribute('data-act');
		const input = current();
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(reg, r.input || input))}/@${TOOL_ID}`;
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${r.sentence} · נתוני גירושין בישראל, jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const src = n.sources.find((s) => s.id === r.metric.source);
			const ok = await copyText(`${r.sentence} (מקור: ${src.name_he}, ${src.published}; jus-tice.co.il)`);
			toast(root, ok ? 'המשפט והמקור הועתקו.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(reg, r.input || input));
			toast(root, 'נשמר במכשיר הזה בלבד.');
		} else if (act === 'restore') {
			const s = inputOf(reg, decodeState(store.get(saveKey) || '', KEYS));
			if (s) { apply(s); }
		} else if (act === 'clear') {
			store.clear(saveKey);
			toast(root, 'נמחק מהמכשיר.');
		}
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
