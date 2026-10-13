/**
 * The instrument shell shared by every jus-tice.co.il tool (HAD-485).
 * Pure helpers (formatting, share-link state, CSV, .ics) work in Node for the snapshot build
 * and the tests; the DOM helpers run only in the browser. No external libraries.
 */

export const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export function esc(text) { return String(text ?? '').replace(/[&<>"']/g, (c) => ESC[c]); }

/** 12,345.67 ₪, number first, tabular, isolated so RTL never flips it. */
export function money(n, digits = 2) {
	const v = Number(n) || 0;
	const s = Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
	return `${v < 0 ? '−' : ''}${s}`;
}
/** 40,000 for whole amounts, 28,547.33 otherwise: for sentences, not tables. */
export function amount(n) {
	const v = Math.round((Number(n) || 0) * 100) / 100;
	return money(v, Number.isInteger(v) ? 0 : 2);
}
export function ils(n, digits = 2) { return `<span class="jtool-amt"><bdi>${money(n, digits)}</bdi> ₪</span>`; }
export function num(n, digits = 2) { return `<bdi>${money(n, digits)}</bdi>`; }
export function pct(n) { return `<bdi>${Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 })}%</bdi>`; }

/** Accepts 12000, 12,000, "12 אלף", "12.5k"; returns a number or NaN. */
export function parseMoney(text) {
	let raw = String(text ?? '').trim().replace(/[₪\s]/g, '');
	if (!raw) { return NaN; }
	let mult = 1;
	if (/אלף$/.test(raw)) { mult = 1000; raw = raw.replace(/אלף$/, ''); }
	if (/[kK]$/.test(raw)) { mult = 1000; raw = raw.slice(0, -1); }
	raw = raw.replace(/,/g, '');
	if (!/^\d+(\.\d+)?$/.test(raw)) { return NaN; }
	return Number(raw) * mult;
}

/** Today's civil date in Israel (YYYY-MM-DD): never the UTC date or the device's own zone (wave 3 review, PR 124;
 * shared by every tool from wave 4, HAD-502). */
export function ilToday(now = new Date()) {
	try {
		return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
	} catch (e) {
		return now.toISOString().slice(0, 10);
	}
}

export function isoToHe(iso) {
	if (!iso) { return ''; }
	const [y, m, d] = iso.split('-').map(Number);
	return d ? `${d}.${m}.${y}` : `${m}.${y}`;
}

/**
 * Share state lives in the URL fragment (#s=...), never in a query string, so it never reaches
 * the server, analytics or logs. Only the tool's answers are encoded; there is no field for a
 * name, an ID number or a phone.
 */
export function encodeState(obj) {
	const parts = [];
	for (const [k, v] of Object.entries(obj)) {
		if (v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length)) { continue; }
		const val = Array.isArray(v) ? v.map((x) => x.join('_')).join('~') : String(v);
		parts.push(`${k}${val.replace(/[^0-9A-Za-z._~-]/g, '')}`);
	}
	return parts.join('/');
}

/** Reverse of encodeState: "a40000/f2025-03-01/p2025-09-01_10000~2026-03-01_5000". */
export function decodeState(text, keys) {
	const out = {};
	const raw = String(text || '').replace(/^#/, '').replace(/^s=/, '');
	if (!raw) { return out; }
	for (const seg of raw.split('/')) {
		const k = seg.charAt(0);
		if (keys.includes(k) && /^[0-9A-Za-z._~-]*$/.test(seg.slice(1))) { out[k] = seg.slice(1); }
	}
	return out;
}

export function decodeList(text) {
	if (!text) { return []; }
	return String(text).split('~').map((x) => x.split('_')).filter((x) => x.length === 2);
}

export function csv(rows) {
	return '﻿' + rows.map((r) => r.map((c) => {
		const s = String(c ?? '');
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
	}).join(',')).join('\r\n');
}

export function ics(events, stampIso) {
	const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//jus-tice.co.il//tools//HE', 'CALSCALE:GREGORIAN'];
	events.forEach((e, i) => {
		const d = e.date.replace(/-/g, '');
		lines.push('BEGIN:VEVENT', `UID:${d}-${i}@jus-tice.co.il`, `DTSTAMP:${stampIso.replace(/[-:]/g, '').slice(0, 15)}Z`,
			`DTSTART;VALUE=DATE:${d}`, `SUMMARY:${e.summary}`, `DESCRIPTION:${e.description || 'חושב ב-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.'}`, 'END:VEVENT');
	});
	lines.push('END:VCALENDAR');
	return lines.join('\r\n');
}

/** Analytics: tool_id, page and a result band only. Never an amount, a date or free text. */
export function track(event, params = {}) {
	if (typeof window === 'undefined') { return; }
	const payload = Object.assign({ tool_id: params.tool_id || '', page: window.location.pathname }, params.band ? { band: params.band } : {}, params.channel ? { channel: params.channel } : {}, params.type ? { type: params.type } : {});
	try {
		// One transport only: gtag already writes to the data layer, so pushing as well would count twice.
		if (typeof window.gtag === 'function') {
			window.gtag('event', event, payload);
		} else if (Array.isArray(window.dataLayer)) {
			window.dataLayer.push(Object.assign({ event }, payload));
		}
	} catch (e) { /* analytics must never break the tool */ }
}

/* ---------------- Browser-only helpers ---------------- */

export function download(filename, mime, text) {
	const blob = new Blob([text], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url; a.download = filename; a.rel = 'noopener';
	document.body.appendChild(a); a.click(); a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (e) {
		const ta = document.createElement('textarea');
		ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
		document.body.appendChild(ta); ta.select();
		let ok = false;
		try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
		ta.remove();
		return ok;
	}
}

export function toast(root, text) {
	const el = root.querySelector('[data-jtool-toast]');
	if (!el) { return; }
	el.textContent = text;
	clearTimeout(el._t);
	el._t = setTimeout(() => { el.textContent = ''; }, 4000);
}

export function shareUrl(stateText) {
	const base = window.location.href.split('#')[0].split('?')[0];
	return `${base}#s=${stateText}`;
}

export function whatsappUrl(text) {
	return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Saved answers on this device only, and only when the person asks; always clearable. */
export const store = {
	get(key) { try { return window.localStorage.getItem(key); } catch (e) { return null; } },
	set(key, value) { try { window.localStorage.setItem(key, value); return true; } catch (e) { return false; } },
	clear(key) { try { window.localStorage.removeItem(key); } catch (e) { /* ignore */ } },
};

/** Sticky mini result bar on phones while the inputs are on screen. */
export function stickyBar(root) {
	const bar = root.querySelector('.jtool-sticky');
	const result = root.querySelector('.jtool-verdict');
	const form = root.querySelector('.jtool-form');
	if (!bar || !result || !form || typeof IntersectionObserver === 'undefined') { return; }
	let formVisible = false;
	let resultVisible = false;
	const update = () => { bar.dataset.show = formVisible && !resultVisible ? '1' : '0'; };
	new IntersectionObserver((entries) => { entries.forEach((e) => { formVisible = e.isIntersecting; }); update(); }).observe(form);
	new IntersectionObserver((entries) => { entries.forEach((e) => { resultVisible = e.isIntersecting; }); update(); }).observe(result);
}

/** Registry freshness: amber "may have changed" state once checked_on + refresh_every_days passes. */
export function isStale(checkedOn, refreshDays, now = new Date()) {
	const t = Date.parse(`${checkedOn}T00:00:00Z`);
	if (Number.isNaN(t)) { return false; }
	return now.getTime() - t > refreshDays * 86400000;
}
