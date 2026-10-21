/**
 * The inheritance wave UI (21.10.2026): the heirs' distribution agreement with an equalization ledger
 * (/heirs-distribution-agreement/). One picture from the subject: the heirs' ledger, a beam per heir with what the
 * order gives him against what the division hands him, the gap marked as what he pays or receives. Under it the
 * payment pairs, the exact amount that comes from outside the estate (the s.5(ג)(4) gate), the agreement draft with
 * its sections, and the checklist. The draft and the table say the same as the ledger, each line with its section.
 */
import { compute, heirLabel, fmt, RELATIONS, RELATION_HE, ASSET_TYPES, ASSET_HE, MAX_HEIRS, MAX_ASSETS } from './heskem-yorshim-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState,
	track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'heskem-yorshim';
const P = 'jt26';

export const EXAMPLE = {
	stage: 'after', basis: 'law', custom: false, privateMoney: true, minor: false,
	heirs: [{ label: '', relation: 'sibling', share: '' }, { label: '', relation: 'sibling', share: '' }, { label: '', relation: 'sibling', share: '' }],
	assets: [{ type: 'flat', value: 2400000, to: 0 }, { type: 'cash', value: 600000, to: 'common' }, { type: 'car', value: 60000, to: 1 }],
};

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const nis = (n) => `${fmt(n)} ₪`;
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const pctHtml = (p) => `<bdi>${Number(p).toLocaleString('en-US', { maximumFractionDigits: 2 })}%</bdi>`;
const SOURCE_HE = { estate: 'מכספי העיזבון', private: 'מכסף פרטי', missing: 'חסר (אין מקור)' };

/* ---------------- Pure renderers ---------------- */

function heirRow(h, i, custom) {
	const label = typeof h.label === 'string' ? h.label : '';
	return `<li class="jtool-rep__row jt26-row jt26-row--heir" data-heir="${i}">`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-hl-${i}">כינוי בטיוטה</label><input id="${P}-hl-${i}" type="text" autocomplete="off" value="${esc(label)}" placeholder="יורש/ת ${i + 1}" data-heir-label></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-hr-${i}">הקרבה למנוח/ה</label><select id="${P}-hr-${i}" data-heir-rel>${RELATIONS.map((k) => `<option value="${k}"${h.relation === k ? ' selected' : ''}>${esc(RELATION_HE[k])}</option>`).join('')}</select></div>`
		+ `<div class="jtool-field" data-if-custom${custom ? '' : ' hidden'}><label class="jtool-label" for="${P}-share-${i}">החלק באחוזים</label><input id="${P}-share-${i}" type="text" inputmode="decimal" autocomplete="off" value="${esc(h.share === '' || h.share === undefined || h.share === null ? '' : String(h.share))}" placeholder="לפי הצו" aria-describedby="${P}-share-${i}-e" data-heir-share><p class="jtool-error" id="${P}-share-${i}-e" role="alert"></p></div>`
		+ `<button class="jtool-iconbtn" type="button" data-remove-heir="${i}" aria-label="מחיקת יורש/ת ${i + 1}">✕</button></li>`;
}

function assetRow(a, i, heirs) {
	const to = a.to === 'common' ? 'x' : a.to === 'sell' ? 's' : String(a.to);
	const opts = heirs.map((h, k) => `<option value="${k}"${to === String(k) ? ' selected' : ''}>${esc(heirLabel(h, k))}</option>`).join('')
		+ `<option value="x"${to === 'x' ? ' selected' : ''}>משותף לכולם לפי החלקים</option><option value="s"${to === 's' ? ' selected' : ''}>נמכר והפדיון מתחלק</option>`;
	return `<li class="jtool-rep__row jt26-row jt26-row--asset" data-asset="${i}">`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-at-${i}">סוג הנכס</label><select id="${P}-at-${i}" data-asset-type>${ASSET_TYPES.map((k) => `<option value="${k}"${a.type === k ? ' selected' : ''}>${esc(ASSET_HE[k])}</option>`).join('')}</select></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-av-${i}">שווי מוסכם</label><div class="jtool-input jtool-input--money"><input id="${P}-av-${i}" type="text" inputmode="decimal" autocomplete="off" value="${esc(a.value === '' || a.value === undefined || a.value === null ? '' : money(a.value, 0))}" placeholder="0" aria-describedby="${P}-asset-${i}-e" data-asset-value><span class="jtool-input__suffix" aria-hidden="true">₪</span></div></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-ato-${i}">למי</label><select id="${P}-ato-${i}" data-asset-to>${opts}</select></div>`
		+ `<button class="jtool-iconbtn" type="button" data-remove-asset="${i}" aria-label="מחיקת נכס ${i + 1}">✕</button>`
		+ `<p class="jtool-error jt26-row__err" id="${P}-asset-${i}-e" role="alert"></p></li>`;
}

export function renderForm(reg, input) {
	const ip = reg.inheritance_process;
	const heirs = Array.isArray(input.heirs) ? input.heirs : [];
	const assets = Array.isArray(input.assets) ? input.assets : [];
	const custom = Boolean(input.custom);
	return `<fieldset class="jtool-field"><legend>איפה אתם בתהליך</legend><div class="jtool-chips">${chip('st', 'after', 'אחרי שניתן הצו', input.stage !== 'before')}${chip('st', 'before', 'לפני הצו', input.stage === 'before')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('bs', 'law', 'צו ירושה (אין צוואה)', input.basis !== 'will')}${chip('bs', 'will', 'צו קיום צוואה', input.basis === 'will')}</div>`
		+ `<p class="jtool-hint">ההסכם נערך אחרי הפטירה (${esc(ip.sections.agreement_in_life_void)}), לפני הצו או אחריו; החלוקה מבוצעת עם הצו.</p></fieldset>`
		+ `<div class="jtool-field"><span class="jtool-label" id="${P}-heirs-l">היורשים וחלקיהם לפי הצו</span>`
		+ `<div class="jtool-chips">${chip('sh', 'equal', 'חלקים שווים', !custom)}${chip('sh', 'custom', 'חלקים לפי אחוזים', custom)}</div>`
		+ `<ul class="jtool-rep" aria-labelledby="${P}-heirs-l" data-heirs>${heirs.map((h, i) => heirRow(h, i, custom)).join('')}</ul>`
		+ `<button class="jtool-linkbtn" type="button" data-add-heir${heirs.length >= MAX_HEIRS ? ' hidden' : ''}>+ עוד יורש/ת</button>`
		+ `<p class="jtool-error" id="${P}-heirs-e" role="alert"></p><p class="jtool-error" id="${P}-shares-e" role="alert"></p>`
		+ `<p class="jtool-hint">הכינויים נכנסים רק לטיוטה, לא לקישור השיתוף. חלקים לפי אחוזים: כשהצו נותן לבן הזוג מחצית והיתר לילדים, או כשהצוואה קובעת חלקים.</p></div>`
		+ `<div class="jtool-field"><span class="jtool-label" id="${P}-assets-l">נכסי העיזבון, ולמי כל נכס הולך בהסכם</span>`
		+ `<ul class="jtool-rep" aria-labelledby="${P}-assets-l" data-assets>${assets.map((a, i) => assetRow(a, i, heirs)).join('')}</ul>`
		+ `<button class="jtool-linkbtn" type="button" data-add-asset${assets.length >= MAX_ASSETS ? ' hidden' : ''}>+ עוד נכס</button>`
		+ `<p class="jtool-error" id="${P}-assets-e" role="alert"></p>`
		+ `<p class="jtool-hint">שווי מוסכם: מה שכל היורשים מקבלים כשווי הנכס היום. כסף שנשאר "משותף" ופדיון של נכס שנמכר הם הכסף שממנו מאזנים קודם.</p></div>`
		+ `<fieldset class="jtool-field"><legend>מאיפה משלמים את האיזון</legend><div class="jtool-chips">${chip('pm', '1', 'גם מכסף פרטי של יורש, לא רק מכספי העיזבון', input.privateMoney, 'checkbox')}</div>`
		+ `<p class="jtool-hint">${esc(ip.land_tax.division_he)} (${esc(ip.land_tax.division_not_sale)}). כסף פרטי: החלק הזה הוא מכירה.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>בין היורשים</legend><div class="jtool-chips">${chip('mn', '1', 'קטין, או מי שמונה לו אפוטרופוס', input.minor, 'checkbox')}</div>`
		+ `<p class="jtool-hint">רק אז ההסכם טעון אישור בית המשפט מראש (${esc(ip.capacity.minor_property)} לחוק הכשרות).</p></fieldset>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const lt = reg.inheritance_process.land_tax;
	let s;
	if (r.balanced) {
		s = `החלוקה מאוזנת: כל יורש מקבל בדיוק את חלקו${r.custom ? '' : ` (${nis(r.heirs[0].entitled)} לכל אחד)`}, ואין תשלומי איזון.`;
	} else if (r.missing > 0) {
		s = `צריך תשלומי איזון של ${nis(r.equalization)}, אבל כספי העיזבון מכסים רק ${nis(r.fromEstate)}: חסרים ${nis(r.missing)}. סמנו תשלום מכסף פרטי, הוסיפו נכס שנמכר, או שנו את החלוקה.`;
	} else if (r.fromPrivate > 0) {
		s = `צריך תשלומי איזון של ${nis(r.equalization)}: ${r.fromEstate > 0 ? `${nis(r.fromEstate)} מכספי העיזבון, ו` : ''}${nis(r.fromPrivate)} מגיעים מכסף פרטי: החלק הזה הוא מכירה לעניין מיסוי מקרקעין (${lt.division_not_sale}).`;
	} else {
		s = `צריך תשלומי איזון של ${nis(r.equalization)}, כולם מכספי העיזבון: לא מכירה (${lt.division_not_sale} לחוק מיסוי מקרקעין).`;
	}
	return `${s} ${r.minor ? 'אחד היורשים קטין או חסוי: ההסכם טעון אישור בית המשפט מראש.' : 'ההסכם לא טעון אישור של בית משפט או של הרשם.'}`;
}

/** The ledger beam: a bar per heir, the entitled value as a tick, the received value filled, the gap marked. */
export function beamHtml(r) {
	const scale = Math.max(...r.heirs.map((h) => Math.max(h.entitled, h.received)), 1);
	const w = (v) => Math.max(0, Math.min(100, v / scale * 100)).toFixed(2);
	const bars = r.heirs.map((h) => {
		const over = h.delta > 0;
		const base = Math.min(h.entitled, h.received);
		const gap = Math.abs(h.delta);
		const what = over ? `משלם ${nis(h.delta)}` : h.delta < 0 ? `מקבל ${nis(-h.delta)}` : 'מאוזן';
		return `<div class="jt26-bar${over ? ' jt26-bar--over' : h.delta < 0 ? ' jt26-bar--under' : ''}"><span class="jt26-bar__who">${esc(h.label)}</span>`
			+ `<span class="jt26-bar__track"><span class="jt26-bar__fill" style="width:${w(base)}%"></span>`
			+ (gap > 0 ? `<span class="jt26-bar__gap" style="inset-inline-start:${w(base)}%;width:${w(gap)}%"></span>` : '')
			+ `<span class="jt26-bar__tick" style="inset-inline-start:${w(h.entitled)}%"></span></span>`
			+ `<span class="jt26-bar__v">${ils(h.received, 0)} <small>${esc(what)}</small></span></div>`;
	}).join('');
	return `<figure class="jt26-beam" aria-hidden="true"><div class="jt26-beam__bars">${bars}</div>`
		+ `<figcaption><span><i class="jt26-k jt26-k--fill"></i>מה היורש מקבל בחלוקה</span><span><i class="jt26-k jt26-k--tick"></i>חלקו לפי הצו: ${r.custom ? 'לפי האחוזים' : nis(r.heirs[0].entitled)}</span><span><i class="jt26-k jt26-k--over"></i>עודף, משלם</span><span><i class="jt26-k jt26-k--under"></i>חסר, מקבל</span></figcaption></figure>`
		+ `<table class="jtool-visually-hidden"><caption>המאזן בין היורשים</caption><thead><tr><th scope="col">יורש/ת</th><th scope="col">מגיע לפי הצו</th><th scope="col">מקבל בחלוקה</th><th scope="col">הפרש</th></tr></thead><tbody>`
		+ r.heirs.map((h) => `<tr><td>${esc(h.label)}</td><td>${nis(h.entitled)}</td><td>${nis(h.received)}</td><td>${h.delta > 0 ? `משלם ${nis(h.delta)}` : h.delta < 0 ? `מקבל ${nis(-h.delta)}` : 'מאוזן'}</td></tr>`).join('') + '</tbody></table>';
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const state = r.balanced ? ['ok', '✓ החלוקה מאוזנת, בלי תשלומי איזון']
		: r.missing > 0 ? ['warn', '! כספי העיזבון לא מספיקים לאיזון']
			: r.fromPrivate > 0 ? ['warn', '! חלק מהאיזון מכסף פרטי: מכירה לעניין מיסוי מקרקעין']
				: ['ok', '✓ איזון מכספי העיזבון בלבד: לא מכירה'];
	const keyFlags = r.flags.filter((f) => ['private', 'missing', 'minor'].includes(f.code));
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--${state[0]}">${esc(state[1])}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}תשלומי האיזון בחלוקה הזאת</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.equalization, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<p class="jtool-scope">שווי העיזבון לפי ההסכם ${ils(r.total, 0)}; ${r.n} יורשים${r.custom ? ' לפי האחוזים שהזנתם' : `, ${nis(r.heirs[0].entitled)} לכל אחד`}.${r.fromPrivate > 0 && r.buys.some((b) => b.fraction !== null) ? ` הכסף הפרטי קונה ${pctHtml(r.buys.filter((b) => b.fraction !== null).reduce((a, b) => a + b.fraction, 0))} מהדירה.` : ''}</p>`
		+ `<div class="jtool-actions" style="margin-top:12px"><button class="jtool-btn jtool-btn--primary" type="button" data-act="copy-doc">העתקת ההסכם</button></div></div>`
		+ beamHtml(r)
		+ (keyFlags.length ? `<ul class="jtool-flags">${keyFlags.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>` : '');
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const ip = reg.inheritance_process;
	const lt = ip.land_tax;
	const L = (i) => r.heirs[i].label;
	let out = `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-ledger-h">המאזן: מה מגיע לכל יורש, ומה הוא מקבל</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-ledger-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">יורש/ת</th><th scope="col">החלק</th><th scope="col">מגיע לפי הצו</th><th scope="col">מקבל בחלוקה</th><th scope="col">הפרש</th></tr></thead><tbody>`
		+ r.heirs.map((h) => `<tr><td data-th="יורש/ת">${esc(h.label)} <small>(${esc(RELATION_HE[h.relation])})</small></td><td data-th="החלק">${pctHtml(h.pct)}</td><td data-th="מגיע לפי הצו">${ils(h.entitled, 0)}</td><td data-th="מקבל בחלוקה">${ils(h.received, 0)}</td><td data-th="הפרש"${h.delta < 0 ? ' class="jtool-neg"' : ''}>${h.delta > 0 ? `+${fmt(h.delta)} ₪, משלם` : h.delta < 0 ? `−${fmt(-h.delta)} ₪, מקבל` : 'מאוזן'}</td></tr>`).join('')
		+ `<tr class="jtool-table__total"><td data-th="יורש/ת">סך העיזבון</td><td data-th="החלק">100%</td><td data-th="מגיע לפי הצו">${ils(r.total, 0)}</td><td data-th="מקבל בחלוקה">${ils(r.total, 0)}</td><td data-th="הפרש">איזון ${ils(r.equalization, 0)}</td></tr></tbody>`
		+ `<caption>מגיע = החלק לפי הצו × שווי העיזבון; מקבל = הנכסים שהוקצו ליורש ועוד חלקו במשותף ובנמכר. היורשים רשאים לחלק אחרת בהסכם${cite(ip.sections.division_agreement, ip.law_url)}, ובלי הסכם חלים הכללים הכפויים${cite(ip.sections.division_rules, ip.law_url)}.</caption></table></div></div>`;
	if (!r.balanced) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-pairs-h">מי משלם למי, ומאיפה</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-pairs-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">משלם</th><th scope="col">מקבל</th><th scope="col">סכום</th><th scope="col">המקור</th><th scope="col">המשמעות</th></tr></thead><tbody>`
			+ r.pairs.map((p) => {
				const b = p.source === 'private' ? r.buys.find((x) => x.from === p.from && x.to === p.to && x.amount === p.amount) : null;
				const meaning = p.source === 'estate' ? `לא מכירה${cite(lt.division_not_sale, lt.url)}`
					: p.source === 'private' ? (b && b.land ? `מכירה${b.fraction !== null ? ` של ${pctHtml(b.fraction)} מהדירה` : ''}: ${esc(L(p.from))} רוכש/ת (מס רכישה), ${esc(L(p.to))} מוכר/ת (מס שבח)${cite(lt.division_not_sale, lt.url)}` : 'תמורה מחוץ לעיזבון; אין מקרקעין אצל המשלם')
						: 'אין מקור: לבחור כסף פרטי, מכירה או חלוקה אחרת';
				return `<tr${p.source === 'missing' ? ' class="jtool-muted"' : ''}><td data-th="משלם">${esc(L(p.from))}</td><td data-th="מקבל">${esc(L(p.to))}</td><td data-th="סכום">${ils(p.amount, 0)}</td><td data-th="המקור">${esc(SOURCE_HE[p.source])}</td><td data-th="המשמעות">${meaning}</td></tr>`;
			}).join('')
			+ `<tr class="jtool-table__total"><td data-th="משלם">סך הכול</td><td data-th="מקבל">—</td><td data-th="סכום">${ils(r.equalization, 0)}</td><td data-th="המקור">עיזבון ${esc(nis(r.fromEstate))}${r.fromPrivate > 0 ? `; פרטי ${esc(nis(r.fromPrivate))}` : ''}${r.missing > 0 ? `; חסר ${esc(nis(r.missing))}` : ''}</td><td data-th="המשמעות">${r.fromPrivate > 0 ? `כסף מחוץ לעיזבון: ${esc(nis(r.fromPrivate))}` : 'הכול מתוך העיזבון'}</td></tr></tbody>`
			+ `<caption>הסדר: קודם היורש שקיבל הכי הרבה מוותר על חלקו בכספי העיזבון לטובת מי שחסר לו הכי הרבה; רק מה שהעיזבון לא מכסה בא מכסף פרטי.</caption></table></div></div>`;
	}
	if (r.fromPrivate > 0) {
		out += `<div class="jt26-tax"><p class="jt26-tax__h">השער של סעיף 5(ג)(4): ${ils(r.fromPrivate, 0)} מחוץ לעיזבון</p>`
			+ `<p>${esc(lt.division_he)}${cite(lt.division_not_sale, lt.url)}. ירושה עצמה אינה מכירה${cite(lt.inheritance_not_sale, lt.url)}. הסכום הזה הוא תמורה שאינה מנכסי העיזבון, ולכן החלק שנקנה בו הוא מכירה: ${r.buys.map((b) => `${esc(L(b.from))} קונה מ${esc(L(b.to))} ${b.fraction !== null ? `${pctHtml(b.fraction)} מהדירה ב-` : ''}${ils(b.amount, 0)}`).join('; ')}.</p>`
			+ `<p>הכלי לא מחשב את המס. את מס הרכישה של מי שמשלם מחשבים ב<a href="/acquisition-tax-brackets-2026/">מחשבון מס רכישה</a>, ואת מס השבח של מי שמקבל ב<a href="/land-appreciation-tax/">מחשבון מס שבח</a>; דירת ירושה שנמכרת: ${esc(lt.inherited_home)}.</p></div>`;
	}
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-doc-h">טיוטת ההסכם</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-doc">העתקה</button><button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button></div></div>`
		+ `<pre class="jtool-letter jt26-doc" role="region" aria-labelledby="${P}-doc-h" tabindex="0">${esc(r.text)}</pre></div>`;
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">מה צריך ביד לפני החתימה</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
		+ `<ul class="jtool-notes">${r.checklist.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
	if (r.realEstate) {
		const g = r.registration;
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-reg-h">רישום בטאבו: התעריף המומלץ של הלשכה</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-reg-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">לפני מע"מ</th><th scope="col">הכלל</th></tr></thead><tbody>`
			+ `<tr><td data-th="מה">כשעורך הדין שהוציא את הצו רושם את המקרקעין</td><td data-th="לפני מע&quot;מ">בלי תעריף נוסף</td><td data-th="הכלל">${cite(g.item, g.url)}</td></tr>`
			+ (g.units ? `<tr><td data-th="מה">אחרת: רישום ${g.units === 1 ? 'יחידת מקרקעין אחת' : `${g.units} יחידות מקרקעין`}, ${esc(nis(g.perUnit))} ליחידה</td><td data-th="לפני מע&quot;מ">${ils(g.total, 0)}</td><td data-th="הכלל">${cite(g.item, g.url)} עם מע"מ ${g.vatPct}%: ${esc(nis(g.withVat))}</td></tr>` : '')
			+ `</tbody><caption>${esc(g.note)}. אין תעריף לעריכת ההסכם עצמו; הכלי לא ממליץ על מחיר.</caption></table></div></div>`;
	}
	const rest = r.flags.filter((f) => !['private', 'missing', 'minor'].includes(f.code));
	if (rest.length) { out += `<ul class="jtool-flags">${rest.map((f) => `<li>${esc(f.he)}</li>`).join('')}</ul>`; }
	return out;
}

/** The three ways to split a flat and cash among three heirs, from the same engine, for the page. */
export function compareTable(reg) {
	const lt = reg.inheritance_process.land_tax;
	const three = [{ relation: 'sibling' }, { relation: 'sibling' }, { relation: 'sibling' }];
	const flat = 2400000;
	const cash = 600000;
	const sell = compute(reg, { heirs: three, assets: [{ type: 'flat', value: flat, to: 'sell' }, { type: 'cash', value: cash, to: 'common' }] });
	const estate = compute(reg, { heirs: three, assets: [{ type: 'flat', value: flat, to: 0 }, { type: 'cash', value: cash, to: 'common' }], privateMoney: false });
	const priv = compute(reg, { heirs: three, assets: [{ type: 'flat', value: flat, to: 0 }, { type: 'cash', value: cash, to: 'common' }], privateMoney: true });
	const frac = priv.buys.reduce((a, b) => a + (b.fraction || 0), 0);
	const rows = [
		['מוכרים את הדירה ומחלקים את הפדיון', `אין: כל אחד מקבל ${nis(sell.heirs[0].entitled)}`, `החלוקה בין היורשים אינה מכירה; המכירה לקונה היא מכירת היורשים, ודירת ירושה נבדקת לפי ${lt.inherited_home}`, cite(lt.division_not_sale, lt.url) + cite(lt.inherited_home, lt.url), 'המוכרים: מחשבון מס שבח'],
		['אחד מקבל את הדירה ומשלם איזון מכספי העיזבון בלבד', `${nis(estate.equalization)}; הכסף בעיזבון מכסה ${nis(estate.fromEstate)}, חסרים ${nis(estate.missing)}`, 'לא מכירה, כל עוד התמורה היא מנכסי העיזבון', cite(lt.division_not_sale, lt.url), 'אף אחד'],
		['אחד מקבל את הדירה ומשלים את האיזון מכסף פרטי', `${nis(priv.equalization)}; ${nis(priv.fromEstate)} מהעיזבון ו-${nis(priv.fromPrivate)} פרטי`, `מכירה של ${Number(frac).toLocaleString('en-US', { maximumFractionDigits: 2 })}% מהדירה: מי שמשלם רוכש, מי שמקבל מוכר`, cite(lt.division_not_sale, lt.url), 'המשלם: מחשבון מס רכישה; המקבלים: מחשבון מס שבח'],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>דירה בשווי ${esc(nis(flat))} ו-${esc(nis(cash))} במזומן, שלושה אחים בחלקים שווים: שלוש דרכים לחלק, ומה כל אחת אומרת לעניין מיסוי מקרקעין</caption><thead><tr><th scope="col">הדרך</th><th scope="col">תשלומי איזון</th><th scope="col">מכירה?</th><th scope="col">הסעיף</th><th scope="col">מי צריך מחשבון מס</th></tr></thead><tbody>`
		+ rows.map(([a, b, c, d, e]) => `<tr><td data-th="הדרך">${esc(a)}</td><td data-th="תשלומי איזון">${esc(b)}</td><td data-th="מכירה?">${esc(c)}</td><td data-th="הסעיף">${d}</td><td data-th="מי צריך מחשבון מס">${esc(e)}</td></tr>`).join('')
		+ '</tbody></table></div>';
}

export function stickyFigure(r) { return r.ok ? ils(r.equalization, 0) : '—'; }

export function snapshot(reg) {
	const ip = reg.inheritance_process;
	const lt = ip.land_tax;
	const r = compute(reg, EXAMPLE);
	const h = r.heirs;
	const frac = r.buys.reduce((a, b) => a + (b.fraction || 0), 0);
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.equalization,
		sticky: stickyFigure(r),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>שווי העיזבון לפי ההסכם: ${r.assets.map((a) => `${ASSET_HE[a.type]} ${money(a.value, 0)}`).join(' + ')} = ${money(r.total, 0)} ₪.</li>`
			+ `<li>החלק של כל יורש לפי הצו: ${r.n} אחים בחלקים שווים, ${money(h[0].entitled, 0)} ₪ לכל אחד. היורשים רשאים לחלק אחרת בהסכם ביניהם${cite(ip.sections.division_agreement, ip.law_url)}; בלי הסכם, בצו בית משפט${cite(ip.sections.division_court, ip.law_url)} לפי הכללים הכפויים${cite(ip.sections.division_rules, ip.law_url)}. ההסכם נערך אחרי הפטירה${cite(ip.sections.agreement_in_life_void, ip.law_url)}.</li>`
			+ `<li>מה כל יורש מקבל בחלוקה: הנכסים שהוקצו לו ועוד חלקו בכסף המשותף: ${h.map((x) => `${x.label} ${money(x.received, 0)}`).join('; ')} ₪.</li>`
			+ `<li>ההפרש מול החלק: ${h.map((x) => `${x.label} ${x.delta >= 0 ? '+' : '−'}${money(Math.abs(x.delta), 0)}`).join('; ')} ₪; סך תשלומי האיזון ${money(r.equalization, 0)} ₪.</li>`
			+ `<li>קודם מכספי העיזבון: ${h[0].label} מוותר/ת על חלקו/ה בכסף המשותף, ${money(r.fromEstate, 0)} ₪, לטובת מי שחסר לו הכי הרבה. חלוקה ראשונה של נכסי העיזבון אינה מכירה כל עוד אין תמורה מחוץ לעיזבון${cite(lt.division_not_sale, lt.url)}; ירושה אינה מכירה${cite(lt.inheritance_not_sale, lt.url)}.</li>`
			+ `<li>היתרה, ${money(r.fromPrivate, 0)} ₪, באה מכסף פרטי: תמורה שאינה מנכסי העיזבון, ולכן מכירה של ${Number(frac).toLocaleString('en-US', { maximumFractionDigits: 2 })}% מהדירה: מס רכישה למי שמשלם, מס שבח למי שמקבל, במחשבוני האתר${cite(lt.division_not_sale, lt.url)}.</li>`
			+ `<li>אישור: ההסכם לא טעון אישור בית משפט או רשם; רק כשיש קטין או חסוי בין היורשים, אישור בית המשפט מראש${cite(ip.capacity.minor_property, ip.capacity.url)}${cite(ip.capacity.guardian, ip.capacity.url)}.</li>`
			+ `<li>רישום הדירה בטאבו: בלי תעריף נוסף כשעורך הדין שהוציא את הצו רושם; אחרת ${money(r.registration.perUnit, 0)} ₪ ליחידת מקרקעין לפני מע"מ, לא מחייב${cite(r.registration.item, r.registration.url)}.</li></ol>`,
		compare_table: compareTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const checked = (name) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const custom = checked('sh') === 'custom';
	const heirs = [...root.querySelectorAll('[data-heir]')].map((row) => {
		const share = ((row.querySelector('[data-heir-share]') || {}).value || '').trim().replace(',', '.');
		return { label: ((row.querySelector('[data-heir-label]') || {}).value || '').trim(), relation: (row.querySelector('[data-heir-rel]') || {}).value || 'other', share: custom ? (share === '' ? '' : Number(share)) : '' };
	});
	const assets = [...root.querySelectorAll('[data-asset]')].map((row) => {
		const v = ((row.querySelector('[data-asset-value]') || {}).value || '').trim();
		const to = (row.querySelector('[data-asset-to]') || {}).value || '0';
		return { type: (row.querySelector('[data-asset-type]') || {}).value || 'other', value: v === '' ? '' : parseMoney(v), to: to === 'x' ? 'common' : to === 's' ? 'sell' : Number(to) };
	});
	return { stage: checked('st') === 'before' ? 'before' : 'after', basis: checked('bs') === 'will' ? 'will' : 'law', custom, heirs, assets, privateMoney: on('pm'), minor: on('mn') };
}

/* Share link: choices, relations, shares, assets; never the labels. */
const REL_CODE = { spouse: 's', child: 'c', sibling: 'b', parent: 'p', other: 'o' };
const TYPE_CODE = { flat: 'f', cash: 'c', car: 'r', shares: 'h', business: 'b', other: 'o' };
export const stateOf = (i) => encodeState({
	t: i.stage === 'before' ? 'b' : '', b: i.basis === 'will' ? 'w' : '', c: i.custom ? 1 : '', p: i.privateMoney ? 1 : '', m: i.minor ? 1 : '',
	h: (i.heirs || []).map((h) => [REL_CODE[h.relation] || 'o', i.custom && h.share !== '' && h.share !== undefined && h.share !== null ? h.share : '']),
	a: (i.assets || []).map((a) => [`${TYPE_CODE[a.type] || 'o'}.${a.to === 'common' ? 'x' : a.to === 'sell' ? 's' : a.to}`, a.value === '' || a.value === undefined || a.value === null ? '' : a.value]),
});
const KEYS = ['t', 'b', 'c', 'p', 'm', 'h', 'a'];
export function inputOf(s) {
	if (!s.h || !s.a) { return null; }
	const pairs = (t) => String(t || '').split('~').filter(Boolean).map((x) => x.split('_'));
	const custom = s.c === '1';
	const rel = (code) => Object.keys(REL_CODE).find((k) => REL_CODE[k] === code) || 'other';
	const typ = (code) => Object.keys(TYPE_CODE).find((k) => TYPE_CODE[k] === code) || 'other';
	return {
		stage: s.t === 'b' ? 'before' : 'after', basis: s.b === 'w' ? 'will' : 'law', custom, privateMoney: s.p === '1', minor: s.m === '1',
		heirs: pairs(s.h).map((p) => ({ label: '', relation: rel(p[0]), share: custom && p[1] !== undefined && p[1] !== '' ? Number(p[1]) : '' })),
		assets: pairs(s.a).map((p) => { const [t, to] = String(p[0]).split('.'); return { type: typ(t), value: p[1] === undefined || p[1] === '' ? '' : Number(p[1]), to: to === 'x' ? 'common' : to === 's' ? 'sell' : Number(to) }; }),
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const ip = reg.inheritance_process;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(ip.checked_on, ip.refresh_every_days) || (ip.next_update && today >= ip.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהתעריפים התעדכנו ב-1 בינואר'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const m = /^(share|asset)-(\d+)$/.exec(e.field);
			const f = m ? root.querySelector(`#${P}-${m[1] === 'share' ? 'share' : 'av'}-${m[2]}`) : null;
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const custom = (root.querySelector(`input[name="${P}-sh"]:checked`) || {}).value === 'custom';
		form.querySelectorAll('[data-if-custom]').forEach((el) => { el.hidden = !custom; });
		// A heir's label names him in every asset's "to whom" list, as it is typed.
		const labels = [...form.querySelectorAll('[data-heir-label]')].map((el, i) => el.value.trim() || `יורש/ת ${i + 1}`);
		form.querySelectorAll('[data-asset-to]').forEach((sel) => { labels.forEach((t, i) => { const o = sel.querySelector(`option[value="${i}"]`); if (o && o.textContent !== t) { o.textContent = t; } }); });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = stickyFigure(r); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.balanced ? 'balanced' : r.missing > 0 ? 'missing' : r.fromPrivate > 0 ? 'private' : 'estate' }); }
		return r;
	};
	const schedule = () => {
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		sync();
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; run(readForm(root)); }, 160);
	};
	const rerender = (input, focusSel) => {
		form.innerHTML = renderForm(reg, input);
		sync();
		run(input);
		if (focusSel) { const el = form.querySelector(focusSel); if (el) { el.focus(); } }
	};
	// HAD-541: a share link names its tool (/@heskem-yorshim); on a page with several tools only that tool reads it.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const fromHash = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash, KEYS)) : null;
	if (fromHash) {
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync();
		run(fromHash, { silent: true });
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const addH = ev.target.closest('[data-add-heir]');
		const rmH = ev.target.closest('[data-remove-heir]');
		const addA = ev.target.closest('[data-add-asset]');
		const rmA = ev.target.closest('[data-remove-asset]');
		if (addH || rmH || addA || rmA) {
			const input = readForm(root);
			if (addH && input.heirs.length < MAX_HEIRS) { input.heirs.push({ label: '', relation: 'child', share: '' }); }
			if (rmH && input.heirs.length > 1) {
				const k = Number(rmH.getAttribute('data-remove-heir'));
				input.heirs.splice(k, 1);
				// Assets that went to the removed heir go back to "common"; the ones after him keep their heir.
				input.assets.forEach((a) => { if (typeof a.to === 'number') { if (a.to === k) { a.to = 'common'; } else if (a.to > k) { a.to -= 1; } } });
			}
			if (addA && input.assets.length < MAX_ASSETS) { input.assets.push({ type: 'cash', value: '', to: 'common' }); }
			if (rmA && input.assets.length > 1) { input.assets.splice(Number(rmA.getAttribute('data-remove-asset')), 1); }
			if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
			rerender(input, addH ? '[data-heir]:last-child [data-heir-label]' : addA ? '[data-asset]:last-child [data-asset-value]' : null);
			return;
		}
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		// A click while the debounce is pending runs it now; every action computes what the form holds now.
		if (timer) { clearTimeout(timer); timer = null; }
		const input = readForm(root);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'copy-doc' && r.ok) {
			const ok = await copyText(`${r.text}\n\nטיוטה שנבנתה ב-jus-tice.co.il (${isoToHe(ip.checked_on)}). מידע כללי, לא ייעוץ משפטי: עורך דין צריך לעבור על ההסכם לפני החתימה, ולבדוק את המס כשיש תשלום מכסף פרטי.`);
			toast(root, ok ? 'ההסכם הועתק. הדביקו אותו במסמך, השלימו את הפרטים בסוגריים, ועברו עליו עם עורך דין.' : 'לא הצלחנו להעתיק. אפשר לסמן את הטקסט ולהעתיק ידנית.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if ((act === 'link' || act === 'save' || act === 'whatsapp') && !r.ok) {
			toast(root, 'יש שדה שצריך לתקן. תקנו אותו, ואז אפשר לשתף או לשמור.');
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו כינויים, שמות או תעודות זהות.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp') {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il לפי חוק הירושה וחוק מיסוי מקרקעין ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(ip.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(r.checklist.map((x, i) => `${i + 1}. ${x}`).join('\n'));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? (r.fromPrivate > 0 ? 'private' : 'estate') : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד, בלי כינויים. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { rerender(s, null); }
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
