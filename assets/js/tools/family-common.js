/**
 * Helpers shared by the family-law tools (HAD-506). The build concatenates a tool's modules into one scope, so every
 * name here starts with "f" and no family engine declares a helper of its own with a generic name: the divorce-agreement
 * generator bundles the child-support and the balancing engines next to its own.
 */

export const fDay = 86400000;
export const fMs = (iso) => Date.parse(`${iso}T00:00:00Z`);
export const fIsoOf = (t) => new Date(t).toISOString().slice(0, 10);
/** A real calendar day in ISO form (31.2 is not a day). */
export const fIsIso = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(fMs(s)) && fIsoOf(fMs(s)) === s;
export const fR2 = (n) => Math.round(n * 100) / 100;
export const fR10 = (n) => Math.round(n / 10) * 10;
/** A field counts as entered when it holds anything, even a malformed number, so a bad value is an error, never skipped. */
export const fEntered = (v) => v !== '' && v !== undefined && v !== null;
export const fVal = (v) => (fEntered(v) ? Number(v) : 0);
/** The same day n months later; from the 31st, the last day of a shorter month. */
export function fAddMonths(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const t = y * 12 + (m - 1) + n;
	const ny = Math.floor(t / 12);
	const nm = (t % 12) + 1;
	const last = new Date(Date.UTC(ny, nm, 0)).getUTCDate();
	return `${String(ny).padStart(4, '0')}-${String(nm).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}
