/**
 * The medical-malpractice wave UI (22.10.2026, HAD-594): the cost and fee estimator of a malpractice claim (alut-tviaa-refuit,
 * prefix jt71) on /medical-malpractice-cost/. The picture is a cost ledger: the compensation at the top, each cost deducted
 * on its own line with who is paid and when, down to what is left to the family; beside it the court fee's track, from the
 * filing to the judgment, with who pays the fee at each way a claim can end. Both have a text equivalent. Under them: the
 * expert-opinion rules (and the prices firms publish, labelled as not official and never totalled unless the reader picks
 * one), the lawyer's fee rules (no maximum in the law for this claim), what failing costs, legal aid by the published table,
 * the exemption from the fee, the scenario for the expert's cross-examination rehearsal and the next steps; a one-page
 * summary prints on its own.
 */
import { mcCompute, mcBand, mcBandOf } from './mechir-engine.js';
import { addDays, parseDate } from './dates.js';
import { openSimulation } from './sim-handoff.js';
import {
	esc, ils, money, isoToHe, encodeState, decodeState, ics,
	track, download, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'alut-tviaa-refuit';
export const PAGE = '/medical-malpractice-cost/';
const P = 'jt71';
const MC_SIM = 'https://jus-tice.com/#/simulation?entry=role&audience=guest&lang=he&purpose=witness_prep&topic=medical-malpractice';
const MC_CASE_PAGE = '/what-is-medical-malpractice-definition-examples/';
const MC_CLOCK_PAGE = '/medical-malpractice-statute-of-limitations/';
const MC_RECORDS_PAGE = '/obtaining-medical-records-copy/';

/** One click to a full profile; the filing day (when the profile has one) is `back` days before today. Illustrative
 * numbers, never a price list: the fee % and the expert quotes are what a reader might have been offered. */
export const PRESETS = {
	filed: { he: 'הוגשה תביעה בשלום · פיצוי צפוי 600 אלף', stage: 'filed', amount: 1200000, comp: 600000, feePct: 20, vat: 'plus', e1: 15000, e2: 6000, back: 7, dp: 30, dd: 10 },
	pre: { he: 'לפני הגשה · הצעת פשרה 250 אלף', stage: 'pre', amount: 800000, comp: 250000, feePct: 20, vat: 'plus', e1: 10000 },
	district: { he: 'במחוזי · פסק דין על 1.2 מיליון', stage: 'judgment', outcome: 'won', amount: 4000000, comp: 1200000, feePct: 20, vat: 'plus', e1: 20000, e2: 12000, dp: 45, dd: 20 },
	lost: { he: 'התביעה נדחתה', stage: 'judgment', outcome: 'lost', amount: 900000, e1: 15000, courtExpert: 8000 },
	early: { he: 'פשרה לפני סוף קדם המשפט', stage: 'settled', when: 'early', amount: 700000, comp: 300000, feePct: 20, vat: 'incl', e1: 12000, back: 200 },
};
const MC_BLANK = { stage: 'pre', when: 'early', outcome: 'won', amount: '', comp: '', feePct: '', vat: 'plus', e1: '', e2: '', e3: '', courtExpert: '', filing: '', defOpinion: '', courtOpinion: '', household: '', income: '', dp: '', dd: '', today: '' };
/** A profile applied on a day. */
export function mcPreset(key, today) {
	const p = PRESETS[key];
	if (!p) { return null; }
	const out = Object.assign({}, MC_BLANK, { today });
	for (const k of Object.keys(MC_BLANK)) { if (p[k] !== undefined) { out[k] = p[k]; } }
	if (p.back !== undefined) { out.filing = addDays(today, -p.back); }
	return out;
}
export const EXAMPLE = mcPreset('filed', '2026-10-22');

const nis = (n) => `${money(n, Math.round(n * 100) % 100 ? 2 : 0)} ש"ח`;
const shk = (n) => ils(n, Math.round(n * 100) % 100 ? 2 : 0);
const cite = (text, href) => (href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text || 'מקור')}</a>` : '');
const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${esc(value)}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
const STAGE_HE = { pre: 'לפני הגשת תביעה', filed: 'הוגשה תביעה', settled: 'הסתיים בפשרה', judgment: 'ניתן פסק דין' };
const WHEN_HE = { early: 'לפני סוף ישיבת קדם המשפט השלישית', mid: 'אחרי קדם המשפט, לפני שמיעת הראיות', late: 'אחרי שהתחילה שמיעת הראיות' };
const END_HE = {
	early: 'פשרה, גישור, בוררות או ביטול לפני סוף ישיבת קדם המשפט השלישית',
	dropped: 'ביטול, מחיקה או דחייה לפני שמיעת הראיות',
	settle_mid: 'פשרה, גישור או בוררות לפני שמיעת הראיות',
	won: 'פסק דין לטובתכם, או פשרה אחרי שהתחילה שמיעת הראיות',
	lost: 'פסק דין שדוחה את התביעה',
};
const courtHe = (r) => (r.court.code === 'district' ? 'בית המשפט המחוזי' : 'בית משפט השלום');
const mcIso = (text) => { const raw = String(text || '').trim(); return raw ? (parseDate(raw) || raw) : ''; };
const mcUrl = (u) => { try { return decodeURI(u); } catch (e) { return u; } };
const mcFigure = (r) => (r.hasComp ? r.net : r.lost ? r.failCost : r.outOfPocket);

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const i = Object.assign({}, MC_BLANK, input || {});
	const sc = reg.small_claims;
	const preset = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return p.stage === i.stage && String(p.amount) === String(i.amount) && String(p.comp || '') === String(i.comp) && (p.outcome || 'won') === i.outcome && (p.when || 'early') === i.when && String(p.e1 || '') === String(i.e1); }) || '';
	const field = (id, label, v, ph, hint, suffix) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label>${suffix ? '<div class="jtool-input jtool-input--money">' : ''}<input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(v === '' || v === undefined || v === null ? '' : (suffix === '₪' ? money(v, 0) : v))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}">${suffix ? `<span class="jtool-input__suffix" aria-hidden="true">${suffix}</span></div>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const date = (id, label, v, hint) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(v ? isoToHe(v) : '')}" placeholder="לדוגמה: 15.10.2026" aria-describedby="${P}-${id}-e${hint ? ` ${P}-${id}-h` : ''}"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p>${hint ? `<p class="jtool-hint" id="${P}-${id}-h">${esc(hint)}</p>` : ''}</div>`;
	const lost = i.stage === 'judgment' && i.outcome === 'lost';
	const more = Boolean(i.courtExpert || i.filing || i.defOpinion || i.courtOpinion || i.household || i.income || i.dp || i.dd);
	return `<fieldset class="jtool-field"><legend>מצב נפוץ, בלחיצה אחת</legend><div class="jtool-chips ${P}-presets">${Object.entries(PRESETS).map(([k, v]) => `<button type="button" class="${P}-preset" data-act="preset" data-preset="${k}" aria-pressed="${k === preset ? 'true' : 'false'}">${esc(v.he)}</button>`).join('')}</div>`
		+ '<p class="jtool-hint">המספרים במצבים הם להמחשה בלבד, לא מחירון. אפשר לשנות כל שדה.</p></fieldset>'
		+ `<fieldset class="jtool-field"><legend>איפה התביעה עומדת</legend><div class="jtool-chips">${['pre', 'filed', 'settled', 'judgment'].map((s) => chip('stage', s, STAGE_HE[s], i.stage === s)).join('')}</div></fieldset>`
		+ `<div class="jtool-row" data-if-settled${i.stage === 'settled' ? '' : ' hidden'}><div class="jtool-field"><label class="jtool-label" for="${P}-when">מתי הסתיים</label><select id="${P}-when">${['early', 'mid', 'late'].map((w) => `<option value="${w}"${i.when === w ? ' selected' : ''}>${esc(WHEN_HE[w])}</option>`).join('')}</select><p class="jtool-hint">קובע מי משלם את יתרת האגרה (תקנה 5(ב) לתקנות האגרות).</p></div></div>`
		+ `<fieldset class="jtool-field" data-if-judgment${i.stage === 'judgment' ? '' : ' hidden'}><legend>פסק הדין</legend><div class="jtool-chips">${chip('out', 'won', 'לטובתכם', i.outcome === 'won')}${chip('out', 'lost', 'התביעה נדחתה', i.outcome === 'lost')}</div></fieldset>`
		+ `<div class="jtool-row">${field('amt', 'סכום התביעה', i.amount, 'לדוגמה: 1,200,000', `עד ${money(sc.magistrate_max, 0)} ש"ח ביום ההגשה: בית משפט השלום; מעליו: המחוזי`, '₪')}<div data-if-comp${lost ? ' hidden' : ''}>${field('comp', 'הפיצוי הצפוי, או ההצעה שקיבלתם', i.comp, 'לא חובה', 'המספר שלכם: ממנו מחושב מה נשאר', '₪')}</div></div>`
		+ `<div class="jtool-row" data-if-fee${lost ? ' hidden' : ''}>${field('pct', 'שכר הטרחה בהצעה של עורך הדין', i.feePct, 'לדוגמה: 20', 'באחוזים מהפיצוי. אין תקרה בחוק לרשלנות רפואית', '%')}<fieldset class="jtool-field"><legend>מע"מ</legend><div class="jtool-chips">${chip('vat', 'plus', 'ועוד מע"מ', i.vat === 'plus')}${chip('vat', 'incl', 'כולל מע"מ', i.vat === 'incl')}</div></fieldset></div>`
		+ `<div class="jtool-row">${field('e1', 'חוות דעת רפואית 1: המחיר שהוצע לכם', i.e1, 'לא חובה', 'אין מחירון רשמי לחוות דעת', '₪')}${field('e2', 'חוות דעת 2', i.e2, 'לא חובה', '', '₪')}${field('e3', 'חוות דעת 3', i.e3, 'לא חובה', '', '₪')}</div>`
		+ `<details class="jtool-more ${P}-more"${more ? ' open' : ''}><summary>עוד פרטים: מומחה בית המשפט, מועדים, פער הנכות, סיוע משפטי</summary>`
		+ `<div class="jtool-row">${field('cexp', 'החלק שלכם בשכר המומחה של בית המשפט', i.courtExpert, 'רק אם נקבע', 'בית המשפט קובע מי משלם (תקנה 92)', '₪')}${date('fil', i.stage === 'pre' ? 'יום ההגשה המתוכנן' : 'יום הגשת התביעה', i.filing, 'ממנו נספרים 15 ימים לבקשת פטור מאגרה')}</div>`
		+ `<div class="jtool-row" data-if-filed${i.stage === 'pre' ? ' hidden' : ''}>${date('dop', 'חוות הדעת של הנתבע הומצאה ביום', i.defOpinion, 'מכאן 60 ימים לחוות דעת נגדית')}${date('cop', 'חוות הדעת של מומחה בית המשפט התקבלה ביום', i.courtOpinion, 'מכאן 14 ימים לשאלות הבהרה')}</div>`
		+ `<div class="jtool-row">${field('dp', 'נכות לפי המומחה שלכם', i.dp, 'לדוגמה: 30', 'לתרגול החקירה הנגדית בלבד', '%')}${field('dd', 'נכות לפי המומחה של הנתבע', i.dd, 'לדוגמה: 10', '', '%')}</div>`
		+ `<div class="jtool-row">${field('hh', 'נפשות במשק הבית', i.household, 'לדוגמה: 3', 'לבדיקת הסף של הסיוע המשפטי', '')}${field('inc', 'הכנסה חודשית ברוטו של משק הבית', i.income, 'לא חובה', 'לא נשמרת בקישור ולא נשלחת', '₪')}</div>`
		+ '</details>';
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const parts = [];
	if (r.lost) {
		parts.push(`התביעה נדחתה: משלמים את מלוא האגרה, ${nis(r.court.full)} (${reg.malpractice_mechir.fees.dismissed_section} לתקנות האגרות)${r.expertsTotal || r.courtExpert ? `, ועם חוות הדעת ${nis(r.failCost)}` : ''}, בלי ההוצאות שבית המשפט עשוי לפסוק לנתבע.`);
	} else if (r.hasComp) {
		const fee = r.fee + r.feeVat;
		parts.push(`מפיצוי של ${nis(r.comp)} נשארים לכם ${nis(r.net)} (${r.netShare}%)${fee ? `, אחרי שכר טרחה ומע"מ של ${nis(fee)}` : ''}${r.expertsTotal ? `, חוות דעת של ${nis(r.expertsTotal)}` : ''}${r.courtExpert ? `, מומחה בית המשפט ${nis(r.courtExpert)}` : ''}${r.courtFee ? ` ואגרה של ${nis(r.courtFee)}` : ''}.`);
	} else {
		parts.push(`בלי סכום פיצוי אין חשבון של מה שנשאר. עד עכשיו: ${nis(r.outOfPocket)} מכיסכם.`);
	}
	parts.push(`${r.stage === 'pre' ? 'תביעה בסכום הזה מוגשת' : 'התביעה'} ב${courtHe(r)}; האגרה בה ${nis(r.court.full)}, ובהגשה משלמים רק ${nis(r.court.first)}.`);
	return parts.join(' ');
}

/** The cost ledger: the compensation at the top, every cost on its own line, the net under a double rule. */
export function ledger(reg, r) {
	if (!r.ok) { return ''; }
	const base = r.hasComp ? r.comp : Math.max(1, r.lost ? r.failCost : r.outOfPocket);
	const w = (v) => Math.max(0.6, Math.min(100, Math.round(v / base * 1000) / 10));
	const rows = [];
	if (r.hasComp) { rows.push(`<li class="${P}-row ${P}-row--top"><span class="${P}-row__what">הפיצוי${r.stage === 'pre' ? ' (ההצעה)' : r.stage === 'filed' ? ' הצפוי' : ''}</span><span class="${P}-row__bar"><i style="inline-size:100%"></i></span><span class="${P}-row__amt"><bdi>${money(r.comp, 0)}</bdi></span></li>`); }
	const lines = r.lost ? [{ code: 'court_fee', v: r.court.full, he: 'אגרת בית המשפט, כולה', who: 'לקופת בית המשפט', when: 'אחרי פסק הדין' }].concat(r.lines.filter((x) => x.code !== 'court_fee')) : r.lines;
	lines.forEach((x) => {
		rows.push(`<li class="${P}-row ${P}-row--${x.code.replace(/\d$/, '')}"><span class="${P}-row__what">${esc(x.he)}<small>${esc(x.who)} · ${esc(x.when)}</small></span><span class="${P}-row__bar"><i style="inline-size:${w(x.v)}%"></i></span><span class="${P}-row__amt"><bdi>${r.hasComp ? '−' : ''}${money(x.v, Math.round(x.v * 100) % 100 ? 2 : 0)}</bdi></span></li>`);
	});
	const total = r.hasComp ? r.net : r.lost ? r.failCost : r.outOfPocket;
	const totalHe = r.hasComp ? 'נשאר לכם' : r.lost ? 'מכיסכם כשהתביעה נדחית' : 'מכיסכם עד עכשיו';
	rows.push(`<li class="${P}-row ${P}-row--net${r.hasComp && r.net < 0 ? ` ${P}-row--neg` : ''}"><span class="${P}-row__what">${totalHe}${r.hasComp && r.netShare !== null ? `<small>${r.netShare}% מהפיצוי</small>` : ''}</span><span class="${P}-row__bar"><i style="inline-size:${r.hasComp ? w(Math.max(0, total)) : 100}%"></i></span><span class="${P}-row__amt"><bdi>${money(total, Math.round(total * 100) % 100 ? 2 : 0)}</bdi></span></li>`);
	const sum = `${r.hasComp ? `פיצוי ${nis(r.comp)}. ` : ''}${lines.map((x) => `${x.he}: ${nis(x.v)}, ${x.who}, ${x.when}`).join('. ')}. ${totalHe}: ${nis(total)}.`;
	return `<figure class="${P}-ledger"><figcaption class="${P}-ledger__h">${r.hasComp ? 'ספר החשבון של הפיצוי: מה יורד, למי ומתי' : r.lost ? 'מה עולה תביעה שנדחתה' : 'מה כבר יצא מהכיס'}</figcaption>`
		+ `<p class="jtool-visually-hidden">${esc(sum)}</p><ol class="${P}-rows" aria-hidden="true">${rows.join('')}</ol>`
		+ `<p class="${P}-ledger__note">${r.lost ? 'שכר הטרחה לפי תוצאה הוא 0 כשאין פיצוי, אם כך כתוב בהסכם. ' : ''}${esc(reg.malpractice_mechir.fee.base_he)}.</p></figure>`;
}

/** The court fee's track: filing -> the third pre-trial session -> the evidence -> the judgment, and who pays at each ending. */
export function feeTrack(reg, r) {
	if (!r.ok) { return ''; }
	const f = reg.malpractice_mechir.fees;
	const at = { pre: 0, filed: 1, settled: r.when === 'early' ? 2 : r.when === 'mid' ? 3 : 4, judgment: 4 }[r.stage];
	const stations = [['לפני הגשה', 'אין אגרה'], ['הגשת התביעה', `${nis(r.court.first)} (${r.court.firstItem})`], [`סוף קדם משפט ${f.early_sessions}`, 'עד כאן: פשרה בלי יתרה'], ['שמיעת הראיות', 'מכאן: זכייה או פשרה, הנתבע משלם'], ['פסק דין', `האגרה ${nis(r.court.full)}`]];
	const track = stations.map(([h, s], k) => `<li class="${P}-st${k === at ? ` ${P}-st--now` : ''}${k < at ? ` ${P}-st--past` : ''}"><b>${esc(h)}</b><small>${esc(s)}</small></li>`).join('');
	const mine = r.end;
	const rows = r.endings.rows.map((x) => `<tr${x.code === mine ? ` class="${P}-mine"` : ''}><td data-th="איך מסתיים">${esc(END_HE[x.code])}${x.code === mine ? ' <strong>(אצלכם)</strong>' : ''}${x.low ? ' <small>(תקנה 5(ג))</small>' : ''}</td><td data-th="אתם משלמים">${shk(x.plaintiff)}</td><td data-th="הנתבע משלם">${shk(x.defendant)}</td><td data-th="התקנה">${cite(x.section, f.url)}</td></tr>`).join('');
	return `<figure class="${P}-track"><figcaption class="${P}-ledger__h">האגרה לאורך התביעה: ${esc(courtHe(r))}</figcaption>`
		+ `<ol class="${P}-stations" aria-label="שלבי התביעה והאגרה">${track}</ol>`
		+ `<div class="jtool-scroll" role="region" aria-label="מי משלם את האגרה בכל סיום" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">איך התביעה מסתיימת</th><th scope="col">אתם משלמים בסך הכול</th><th scope="col">הנתבע משלם</th><th scope="col">התקנה</th></tr></thead><tbody>${rows}</tbody>`
		+ `<caption>${esc(f.rule_he)} (${esc(f.rule_section)}). "אתם משלמים" כולל את מה ששולם בהגשה; כשהנתבע משלם, הוא מחזיר לכם אותו. ${r.court.code === 'district' ? `${esc(f.low_he)} (${esc(f.low_section)}). ` : ''}${esc(f.waive_he)} (${esc(f.waive_section)}). סכומי 2026, בלי הפרשי הצמדה (${esc(f.index_section)}).</caption></table></div></figure>`;
}

/** The prices firms and institutes publish for an opinion: NOT official, never totalled unless the reader picks one. */
export function rangesBox(reg) {
	const ex = reg.malpractice_mechir.experts;
	return `<div class="${P}-ranges"><p class="${P}-ranges__h"><strong>לפי פרסומי משרדים ומכונים</strong> (לא מקור רשמי ולא נכנס לחישוב, אלא אם בוחרים):</p><ul>`
		+ ex.published_ranges.map((x) => `<li><span class="${P}-src">${esc(x.name_he)}</span> <span class="${P}-url" dir="ltr">${esc(mcUrl(x.url))}</span> · נקרא ${isoToHe(x.read_on)}: ${esc(x.range_he)}.${x.low ? ` <button type="button" class="jtool-linkbtn" data-act="pick" data-amount="${x.low}">להזין ${esc(nis(x.low))} כהצעה</button>` : ''}</li>`).join('')
		+ '</ul></div>';
}

/** The scenario for the simulation: computed facts only, amounts as bands, never a name, an ID or a hospital. */
export function aiBrief(reg, r) {
	if (!r.ok) { return ''; }
	const stage = { pre: 'התביעה עוד לא הוגשה', filed: 'התביעה הוגשה', settled: 'יש משא ומתן לפשרה', judgment: r.lost ? 'התביעה נדחתה ושוקלים ערעור' : 'ניתן פסק דין' }[r.stage];
	const gap = r.gap !== null ? ` המומחה מטעם התובע קבע נכות של ${r.dp}% והמומחה מטעם בית החולים ${r.dd}%: פער של ${r.gap} נקודות, והוא שקובע את רוב הפיצוי.` : ' יש מחלוקת בין חוות הדעת הרפואיות על הקשר בין הטיפול לנזק ועל היקף הנכות.';
	const money2 = r.hasComp ? ` הפיצוי שעל הפרק ${mcBand(r.comp)}.` : '';
	return `תביעת רשלנות רפואית בסכום ${mcBand(r.amount)}, ב${courtHe(r)}. ${stage}.${gap}${money2} השאלה לתרגול: חקירה נגדית של המומחה הרפואי מטעם בית החולים. איך שואלים אותו על דרגת הנכות שקבע, על הספרות שעליה הוא מסתמך ועל מה שכתוב ברשומה הרפואית, בלי להתווכח ובלי שאלות פתוחות?`;
}

/* ---------------- Share state and the cluster links ---------------- */

const ST = { pre: 'p', filed: 'f', settled: 's', judgment: 'j' };
const WH = { early: 'e', mid: 'm', late: 'l' };
const OU = { won: 'w', lost: 'l' };
const VA = { plus: 'p', incl: 'i' };
const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
/** The share keys: s stage, w when settled, o outcome, a amount, c compensation, f fee %, v VAT, e g h the expert quotes,
 * k the court expert's share, d filing day, t defence opinion day, u court opinion day, n persons, p q the disability %.
 * The household's income is never in the link. */
export const KEYS = ['s', 'w', 'o', 'a', 'c', 'f', 'v', 'e', 'g', 'h', 'k', 'd', 't', 'u', 'n', 'p', 'q'];
const n0 = (v) => (v === '' || v === undefined || v === null ? '' : Number(v));
export function stateOf(input) {
	const i = Object.assign({}, MC_BLANK, input || {});
	return encodeState({
		s: ST[i.stage] || 'p', w: i.stage === 'settled' ? WH[i.when] || 'e' : '', o: i.stage === 'judgment' ? OU[i.outcome] || 'w' : '',
		a: n0(i.amount), c: n0(i.comp), f: n0(i.feePct), v: VA[i.vat] || 'p', e: n0(i.e1), g: n0(i.e2), h: n0(i.e3), k: n0(i.courtExpert),
		d: i.filing || '', t: i.stage === 'pre' ? '' : i.defOpinion || '', u: i.stage === 'pre' ? '' : i.courtOpinion || '', n: n0(i.household), p: n0(i.dp), q: n0(i.dd),
	});
}
/** Reverse of stateOf. A partial state (a sibling's link without the stage: it knows only some numbers) fills the claim's
 * numbers from `base` (stage, amount, compensation, fee, VAT, opinions; never a date or a disability %) and lists what came
 * from it in `filled`; a full state (it has the stage) leaves a missing value empty. */
export function inputOf(s, base) {
	if (!s || !KEYS.some((k) => s[k] !== undefined && s[k] !== '')) { return null; }
	const has = (k) => s[k] !== undefined && s[k] !== '';
	const partial = !has('s');
	if (partial && !base) { return null; }
	const num = (v) => (v === undefined || v === '' ? '' : Number(v));
	const b = Object.assign({}, MC_BLANK, partial ? { stage: base.stage, when: base.when, outcome: base.outcome, amount: base.amount, comp: base.comp, feePct: base.feePct, vat: base.vat, e1: base.e1, e2: base.e2, e3: base.e3 } : {});
	const filled = partial ? [['a', 'amount'], ['c', 'comp'], ['f', 'feePct'], ['e', 'e1']].filter(([k]) => !has(k)).map(([, f]) => f) : [];
	return Object.assign({}, b, {
		stage: has('s') ? back(ST, s.s, 'pre') : b.stage, when: has('w') ? back(WH, s.w, 'early') : b.when, outcome: has('o') ? back(OU, s.o, 'won') : b.outcome,
		amount: has('a') ? num(s.a) : b.amount, comp: has('c') ? num(s.c) : b.comp, feePct: has('f') ? num(s.f) : b.feePct, vat: has('v') ? back(VA, s.v, 'plus') : b.vat,
		e1: has('e') ? num(s.e) : b.e1, e2: has('g') ? num(s.g) : (has('e') ? '' : b.e2), e3: has('h') ? num(s.h) : (has('e') ? '' : b.e3), courtExpert: has('k') ? num(s.k) : '',
		filing: s.d || '', defOpinion: s.t || '', courtOpinion: s.u || '', household: has('n') ? num(s.n) : '', income: '', dp: has('p') ? num(s.p) : '', dd: has('q') ? num(s.q) : '', filled,
	});
}
/** The link the sibling instruments build into this tool: '/medical-malpractice-cost/#s=<state>' (numbers and dates only). */
export function stateLink(reg, input) {
	return `${PAGE}#s=${stateOf(Object.assign({}, MC_BLANK, input || {}))}`;
}
/** The case check (tik-rashlanut). Nothing this tool holds fills its facts (what happened, when, the outcome): its page. */
export function caseLink() {
	return MC_CASE_PAGE;
}
/** The malpractice clock (shaon-refui). The cost tool knows no treatment or birth date: its page. */
export function clockLink() {
	return MC_CLOCK_PAGE;
}

/** The "what to do now" list: the official routes first, then 2-4 pages of this site that fit the result. */
export function nextActions(reg, r) {
	const m = reg.malpractice_mechir;
	const out = [{ he: 'הרשות השופטת: טבלת האגרות בבתי המשפט', url: m.fees.guide_url }];
	const links = [];
	if (r.aid.status !== 'above') { out.push({ he: 'משרד המשפטים: בקשה לסיוע משפטי (מקוון או במוקד 6405*)', url: m.legal_aid.service_url }); }
	if (r.stage === 'pre') {
		links.push({ path: caseLink(), he: 'לפני הכול: האם יש עילה, ומה צריך להוכיח' });
		links.push({ path: MC_RECORDS_PAGE, he: 'הצעד הראשון לחוות דעת: בקשה להעתק התיק הרפואי' });
		links.push({ path: clockLink(), he: 'עד מתי אפשר להגיש: שעון ההתיישנות ברשלנות רפואית' });
	} else {
		links.push({ path: clockLink(), he: 'עד מתי אפשר להגיש: שעון ההתיישנות ברשלנות רפואית' });
		links.push({ path: caseLink(), he: 'מה צריך להוכיח בכל אחד מיסודות התביעה' });
	}
	links.push({ path: '/attaching-expert-opinion-claim/', he: 'חוות הדעת שמצרפים לכתב התביעה' });
	links.push({ path: r.lost ? '/costs-litigation-losing-party/' : '/medical-malpractice-attorney/', he: r.lost ? 'הוצאות משפט לצד שהפסיד' : 'שכר טרחה של עורך דין רשלנות רפואית' });
	return { official: out, links: links.slice(0, 4) };
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p><p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const m = reg.malpractice_mechir;
	const ex = m.experts;
	const fe = m.fee;
	const la = m.legal_aid;
	const fx = m.fees.exempt;
	const fig = mcFigure(r);
	const state = r.lost ? '<p class="jtool-state jtool-state--warn">! התביעה נדחתה: מה זה עולה</p>'
		: r.hasComp && r.net < 0 ? '<p class="jtool-state jtool-state--danger">! העלויות גבוהות מהפיצוי</p>'
			: `<p class="jtool-state jtool-state--ok">✓ לפי ${esc(m.fees.rule_section)} לתקנות האגרות ו${esc(reg.small_claims.magistrate_section)} לחוק בתי המשפט</p>`;
	const label = r.hasComp ? 'נשאר לכם מהפיצוי, אחרי כל העלויות' : r.lost ? 'מכיסכם כשהתביעה נדחית (בלי הוצאות לנתבע)' : 'מכיסכם עד עכשיו';
	const rows = [];
	rows.push(`<div><dt>בית המשפט</dt><dd>${esc(courtHe(r))}</dd></div>`);
	rows.push(`<div><dt>אגרה בהגשה / מלאה</dt><dd><bdi>${money(r.court.first, 0)}</bdi> / <bdi>${money(r.court.full, 0)}</bdi> ש"ח</dd></div>`);
	if (r.fee) { rows.push(`<div><dt>שכר טרחה ומע"מ</dt><dd>${shk(r.fee + r.feeVat)} <small>(${r.feeShare}%)</small></dd></div>`); }
	if (r.expertsTotal) { rows.push(`<div><dt>חוות דעת (ההצעות שלכם)</dt><dd>${shk(r.expertsTotal)}</dd></div>`); }
	if (!r.lost) { rows.push(`<div><dt>אם התביעה נדחית</dt><dd>${shk(r.failCost)}</dd></div>`); }
	const flags = r.flags.filter((x) => x.code !== 'no_cap' && x.code !== 'road_cap');
	const aid = r.aid;
	const aidLine = aid.status === 'within' ? `ההכנסה שהזנתם (${nis(aid.income)}) לא עולה על הסף של ${aid.persons} נפשות, ${nis(aid.limit)}: עוברים את מבחן ההכנסה. אגרת ההשתתפות: ${nis(aid.participation)}.`
		: aid.status === 'above' ? `ההכנסה שהזנתם (${nis(aid.income)}) גבוהה מהסף של ${aid.persons} נפשות, ${nis(aid.limit)}: לפי הטבלה אין זכאות כלכלית.`
			: `הסף ל-${aid.persons} נפשות: הכנסה עד ${nis(aid.limit)} בחודש${aid.persons > la.base_persons ? '' : `, ועוד ${nis(la.per_person)} לכל נפש מהרביעית`}.`;
	const brief = aiBrief(reg, r);
	const na = nextActions(reg, r);
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">${state}`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${esc(label)}</p>`
		+ `<strong class="jtool-verdict__figure">${shk(fig)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<dl class="jtool-breakdown">${rows.join('')}</dl></div>`
		+ ledger(reg, r)
		+ feeTrack(reg, r)
		+ (flags.length ? `<ul class="jtool-flags ${P}-flags">${flags.map((x) => `<li class="${P}-flag ${P}-flag--${x.level}">${esc(x.he)}${x.section ? cite(x.section, x.url) : ''}</li>`).join('')}</ul>` : '')
		+ `<div class="${P}-box"><h3 class="${P}-h">חוות דעת רפואית: אין מחירון רשמי</h3><ul class="${P}-rules">`
		+ `<li>${esc(ex.no_tariff_he)}. הכלי מחבר רק את המחירים שהזנתם.</li>`
		+ `<li>${esc(ex.attach_he)}.${cite(ex.attach_section, ex.url)} ${esc(ex.postpone_he)}.${cite(ex.postpone_section, ex.url)}</li>`
		+ `<li>${esc(ex.counter_he)}.${cite(ex.counter_section, ex.url)}</li>`
		+ `<li>${esc(ex.court_he)}.${cite(ex.court_section, ex.url)} ${esc(ex.pay_he)}.${cite(ex.pay_section, ex.url)} ${esc(ex.deposit_he)}.${cite(ex.deposit_section, ex.url)}</li>`
		+ `<li>${esc(m.costs.expenses_he)}.${cite(m.costs.expenses_section, ex.url)}</li></ul>${rangesBox(reg)}</div>`
		+ `<div class="${P}-box"><h3 class="${P}-h">שכר הטרחה: אין תקרה בחוק לתביעה הזאת</h3><ul class="${P}-rules">`
		+ `<li>${esc(fe.cap_he)}.</li><li>${esc(fe.road_he)}.${cite(fe.road_section, fe.road_url)}</li>`
		+ `<li>${esc(fe.max_he)}.${cite(fe.max_section, fe.bar_url)} ${esc(fe.excessive_he)}.${cite(fe.excessive_section, fe.bar_url)}</li>`
		+ `<li>${esc(fe.separate_he)}.${cite(fe.separate_section, fe.bar_url)} ${esc(fe.refund_he)}.${cite(fe.refund_section, fe.bar_url)}</li>`
		+ `<li>${esc(fe.pct_he)}.${cite(fe.pct_section, fe.ethics_url)} ${esc(fe.expenses_he)}.${cite(fe.expenses_section, fe.ethics_url)}</li>`
		+ `<li>מע"מ ${r.vatPct}% על שכר הטרחה${r.fee ? `: ${r.vat === 'plus' ? `${r.feePct}% ועוד מע"מ = ${nis(r.fee)} + ${nis(r.feeVat)}` : `${r.feePct}% כולל מע"מ = ${nis(r.fee)} + מע"מ ${nis(r.feeVat)}`}` : ''}.${cite(reg.car_accident.fees.vat_he, reg.car_accident.fees.vat_url)}</li></ul></div>`
		+ `<div class="${P}-box ${P}-box--fail"><h3 class="${P}-h">אם התביעה נדחית</h3><p>משלמים את מלוא האגרה, ${shk(r.court.full)}${cite(m.fees.dismissed_section, m.fees.url)}${r.expertsTotal || r.courtExpert ? `, ועם חוות הדעת ${shk(r.failCost)}` : ''}. ${esc(m.costs.award_he)}${cite(m.costs.award_section, ex.url)}; ${esc(m.costs.tariff_he)}${cite(m.costs.tariff_section, ex.url)}. ${esc(m.costs.factors_he)}${cite(m.costs.factors_section, ex.url)}. ${esc(m.costs.security_he)}${cite(m.costs.security_section, ex.url)}. את ההוצאות לנתבע הכלי לא מחשב: אין להן סכום קבוע.</p></div>`
		+ `<div class="${P}-box"><h3 class="${P}-h">סיוע משפטי של משרד המשפטים</h3><ul class="${P}-rules">`
		+ `<li>${esc(la.matters_he)}.${cite(la.matters_section, la.regs_url)}</li>`
		+ `<li>${esc(aidLine)}${cite(`טבלת זכאות מ-${isoToHe(la.table_from)}`, la.table_url)} רכוש שאפשר לממש: עד ${shk(la.property_max)}; ${esc(la.means_he)}.${cite(la.means_section, la.regs_url)}</li>`
		+ `<li>${esc(la.merits_he)}.${cite(la.merits_section, la.law_url)} ${esc(la.lawyer_he)}; ${esc(la.participation_he)}.${cite(la.participation_section, la.regs_url)}</li>`
		+ `<li>${esc(la.costs_he)}.${cite('משרד המשפטים', la.service_url)} ${esc(la.repay_he)}.${cite(la.repay_section, la.regs_url)} ${esc(fx.legal_aid_he)}.${cite(fx.legal_aid_section, m.fees.url)}</li></ul></div>`
		+ `<div class="${P}-box"><h3 class="${P}-h">פטור מאגרה למי שאין ביכולתו לשלם</h3><ul class="${P}-rules">`
		+ `<li>${esc(fx.request_he)}${r.filing ? `: עד ${isoToHe(r.events.find((e) => e.key === 'exempt').date)}` : ''}.${cite(fx.request_section, m.fees.url)} ${esc(fx.affidavit_he)}.${cite(fx.affidavit_section, m.fees.url)}</li>`
		+ `<li>${esc(fx.test_he)}.${cite(fx.test_section, m.fees.url)} ${esc(fx.evidence_he)}.${cite(fx.evidence_section, m.fees.url)}</li>`
		+ `<li>${esc(fx.installments_he)}.${cite(fx.installments_section, m.fees.url)} ${esc(fx.winner_he)}.${cite(fx.winner_section, m.fees.url)}</li></ul></div>`
		+ `<div class="${P}-brief"><h4>התרחיש לסימולציה</h4><p data-${P}-brief>${esc(brief)}</p><a class="jtool-btn" href="${MC_SIM}" target="_blank" rel="noopener" data-act="rehearse">לתרגל חקירה נגדית של המומחה</a></div>`
		+ `<div class="${P}-next"><h4>מה עושים עכשיו</h4><ul>${na.official.map((x) => `<li><a href="${esc(x.url)}" target="_blank" rel="noopener">${esc(x.he)}</a></li>`).join('')}`
		+ `${na.links.map((x) => `<li><a href="${esc(x.path)}">${esc(x.he)}</a></li>`).join('')}</ul></div>`;
}

/** The cost rules, one row each, with the amount and the section: the page table (compare_table). */
export function rulesTable(reg) {
	const m = reg.malpractice_mechir;
	const sc = reg.small_claims;
	const f = m.fees;
	const ex = m.experts;
	const fe = m.fee;
	const la = m.legal_aid;
	const ca = reg.car_accident;
	const rows = [
		['באיזה בית משפט', `עד ${nis(sc.magistrate_max)}: השלום; מעליו: המחוזי`, 'הסכום ביום ההגשה', `${sc.magistrate_section} ו${sc.district_section} ל${m.court.he}`, m.court.url],
		['אגרת תביעה על נזק גוף בשלום', `${nis(f.magistrate.full)} (${f.magistrate.full_item})`, 'סכום קבוע, לא אחוז', `${f.rule_section} לתקנות האגרות`, f.url],
		['אגרת תביעה על נזק גוף במחוזי', `${nis(f.district.full)} (${f.district.full_item})`, 'סכום קבוע, לא אחוז', `${f.rule_section} לתקנות האגרות`, f.url],
		['מה משלמים בהגשה', `${nis(f.magistrate.first)} בשלום; ${nis(f.district.first)} במחוזי`, `${f.magistrate.first_item} ו${f.district.first_item}`, `${f.first_section}`, f.url],
		['פשרה או ביטול עד סוף קדם המשפט השלישי', 'אין יתרה', 'התובע', f.early_section, f.url],
		['ביטול או דחייה לפני שמיעת הראיות', 'שליש מהאגרה', 'התובע', f.third_section, f.url],
		['פשרה לפני שמיעת הראיות', 'שליש מהאגרה, ומחזיר לתובע', 'הנתבע', f.defendant_third_section, f.url],
		['פסק דין לטובת התובע, או פשרה מאוחרת', 'כל האגרה, ומחזיר לתובע', 'הנתבע', f.defendant_full_section, f.url],
		['התביעה נדחתה בפסק דין', 'כל האגרה', 'התובע', f.dismissed_section, f.url],
		[`במחוזי, פיצוי מתחת ל-${f.low_pct}% מסמכות השלום`, 'הנתבע לפי שיעור השלום; התובע משלים', 'שניהם', f.low_section, f.url],
		['פטור מאגרה', `בקשה עם תצהיר, עד ${f.exempt.request_days} ימים`, 'מי שאין ביכולתו לשלם', `${f.exempt.request_section}, ${f.exempt.test_section}`, f.url],
		['חוות דעת רפואית לכתב התביעה', 'אין תעריף רשמי', 'התובע מזמין ומשלם', ex.attach_section, ex.url],
		['חוות דעת נגדית', `${ex.counter_days} ימים מההמצאה`, 'התובע', ex.counter_section, ex.url],
		['מומחה מטעם בית המשפט', 'השכר לפי החלטת בית המשפט', 'בעלי הדין, כפי שיורה', `${ex.court_section}, ${ex.pay_section}`, ex.url],
		['שכר טרחת עורך דין ברשלנות רפואית', 'אין תקרה בחוק', 'לפי ההסכם', `${fe.max_section}, ${fe.excessive_section} ל${fe.bar_he}`, fe.bar_url],
		['התקרה בתאונות דרכים (לא חלה כאן)', `${ca.fees.stages.none.pct}%, ${ca.fees.stages.settle.pct}%, ${ca.fees.stages.judgment.pct}%`, 'רק לפי חוק הפיצויים', `${fe.road_section} לחוק הפיצויים`, fe.road_url],
		['מע"מ על שכר הטרחה', `${ca.fees.vat_pct}%`, 'הלקוח', ca.fees.vat_he, ca.fees.vat_url],
		['הוצאות משפט לצד שזכה', 'לפי שיקול בית המשפט', 'הצד שהפסיד', `${m.costs.award_section}, ${m.costs.tariff_section}`, ex.url],
		['סיוע משפטי: מבחן הכנסה', `עד ${nis(la.income_base)} ל-1 עד ${la.base_persons} נפשות, ועוד ${nis(la.per_person)} לכל נפש`, `מ-${isoToHe(la.table_from)}`, la.means_section, la.table_url],
		['סיוע משפטי: אגרת השתתפות', `${nis(la.participation_low)} או ${nis(la.participation_high)}`, `מ-${isoToHe(la.participation_from)}`, la.participation_section, la.regs_url],
	];
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>כמה עולה תביעת רשלנות רפואית: הכללים והסכומים הרשמיים. ${esc(f.he)} (נוסח ל-${isoToHe(f.current_to)}, ${esc(f.notice_he)}), ${esc(ex.he)}, ${esc(fe.bar_he)}, ${esc(la.regs_he)} וטבלת משרד המשפטים; נבדק ${isoToHe(m.checked_on)}.</caption><thead><tr><th scope="col">מה</th><th scope="col">כמה</th><th scope="col">מי או מתי</th><th scope="col">הסעיף</th></tr></thead><tbody>`
		+ rows.map(([what, much, who, src, url]) => `<tr><td data-th="מה">${esc(what)}</td><td data-th="כמה">${esc(much)}</td><td data-th="מי או מתי">${esc(who)}</td><td data-th="הסעיף">${cite(src, url)}</td></tr>`).join('')
		+ '</tbody></table></div>';
}

/** What changed and when: only values an official text dates. */
export function changesTable(reg) {
	const rows = reg.malpractice_mechir.changes.slice().sort((a, b) => (a.from < b.from ? -1 : a.from > b.from ? 1 : 0));
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-chg-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">מתי</th><th scope="col">מה השתנה</th><th scope="col">מקור</th></tr></thead><tbody>`
		+ rows.map((x) => `<tr><td data-th="מתי"><bdi>${isoToHe(x.from)}</bdi></td><td data-th="מה השתנה">${esc(x.he)}</td><td data-th="מקור">${cite(x.src_he, x.url)}</td></tr>`).join('')
		+ `</tbody><caption>רק ערכים שפורסמו בנוסח רשמי, עם התאריך שלהם. האגרות מתעדכנות ב-1 בינואר (${esc(reg.malpractice_mechir.fees.update_section)}).</caption></table></div>`;
}

function datesTable(reg, r, opts = {}) {
	if (!r.events.length) {
		return `<p class="${P}-note">אין עדיין מועד שתקנה קובעת: הזינו את יום הגשת התביעה (או היום המתוכנן), ואם הומצאה חוות דעת של הנתבע או של מומחה בית המשפט, את היום. יתרת האגרה משולמת בסוף ההליך, לפי איך שהוא מסתיים, ולכן אין לה תאריך קבוע.</p>`;
	}
	return `<div class="jtool-scroll" role="region" aria-labelledby="${P}-dl-h" tabindex="0"><table class="jtool-table ${P}-wrap"><thead><tr><th scope="col">תאריך</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.events.map((e) => { const past = opts.today && e.kind !== 'start' && e.date < opts.today; return `<tr${past ? ' class="jtool-muted"' : ''}><td data-th="תאריך"><bdi>${isoToHe(e.date)}</bdi>${past ? ' (עבר)' : ''}</td><td data-th="מה">${esc(e.he)}</td><td data-th="הכלל">${cite(e.section, e.url)}</td></tr>`; }).join('')
		+ `</tbody><caption>רק מועדים שתקנה קובעת. יתרת האגרה משולמת בסוף ההליך ואין לה תאריך קבוע. מועד שנופל ביום מנוחה עובר ליום שאחריו (${esc(reg.car_accident.limitation.interpretation_he)}); ימי פגרה לא מנוכים, ולכן זה המועד המוקדם (${esc(reg.malpractice_mechir.experts.count_section)}).</caption></table></div>`;
}

function methodList(reg, r) {
	const m = reg.malpractice_mechir;
	const sc = reg.small_claims;
	const items = [];
	items.push(`סכום התביעה ${nis(r.amount)} ${r.amount > sc.magistrate_max ? 'גבוה מ' : 'לא עולה על '}${nis(sc.magistrate_max)} ביום ההגשה: ${courtHe(r)} (${r.court.section} לחוק בתי המשפט)`);
	items.push(`תביעה לפיצויים בשל נזק גוף: אגרה קבועה, ${r.court.fullItem}: ${nis(r.court.full)} (${m.fees.rule_section}); בהגשה רק ${r.court.firstItem}: ${nis(r.court.first)} (${m.fees.first_section})`);
	items.push(`${STAGE_HE[r.stage]}${r.stage === 'settled' ? `, ${WHEN_HE[r.when]}` : ''}: החלק שלכם באגרה ${nis(r.courtFee)}`);
	if (r.fee) { items.push(`שכר טרחה: ${nis(r.comp)} × ${r.feePct}% ${r.vat === 'plus' ? `= ${nis(r.fee)}, ועוד מע"מ ${r.vatPct}% = ${nis(r.feeVat)}` : `= ${nis(r.fee + r.feeVat)} כולל מע"מ: ${nis(r.fee)} ומע"מ ${nis(r.feeVat)}`}`); }
	if (r.expertsTotal) { items.push(`חוות דעת (המחירים שלכם): ${r.experts.map((x) => nis(x.v)).join(' + ')} = ${nis(r.expertsTotal)}`); }
	if (r.courtExpert) { items.push(`החלק שלכם בשכר המומחה של בית המשפט: ${nis(r.courtExpert)} (${m.experts.pay_section})`); }
	if (r.hasComp) { items.push(`נשאר: ${nis(r.comp)} − ${nis(r.deductions)} = ${nis(r.net)}`); }
	if (!r.lost) { items.push(`אם התביעה נדחית: ${nis(r.court.full)} אגרה${r.expertsTotal || r.courtExpert ? ` + ${nis(r.expertsTotal + r.courtExpert)} חוות דעת` : ''} = ${nis(r.failCost)} (${m.fees.dismissed_section}), ועוד הוצאות שבית המשפט עשוי לפסוק`); }
	return `<ol class="${P}-method">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>`;
}

/** The one-page print: inputs, the ledger, the method, the dates, sources with dates, the day printed. */
export function printSummary(reg, r, printedOn) {
	if (!r.ok) { return ''; }
	const m = reg.malpractice_mechir;
	return '<h3>כמה עולה תביעת רשלנות רפואית: סיכום</h3>'
		+ `<p><strong>הנתונים:</strong> ${esc(STAGE_HE[r.stage])}; סכום התביעה ${esc(nis(r.amount))}${r.hasComp ? `; פיצוי ${esc(nis(r.comp))}` : ''}${r.feePct !== null ? `; שכר טרחה ${r.feePct}% ${r.vat === 'plus' ? 'ועוד מע"מ' : 'כולל מע"מ'}` : ''}${r.expertsTotal ? `; חוות דעת ${esc(nis(r.expertsTotal))}` : ''}.</p>`
		+ `<p><strong>התוצאה:</strong> ${esc(verdictSentence(reg, r))}</p>`
		+ `<p><strong>החשבון:</strong> ${r.lines.map((x) => `${esc(x.he)} ${esc(nis(x.v))}`).join('; ')}${r.hasComp ? `; נשאר ${esc(nis(r.net))}` : ''}.</p>`
		+ `<p><strong>דרך החישוב:</strong></p>${methodList(reg, r)}`
		+ (r.events.length ? `<p><strong>מועדים:</strong> ${r.events.map((e) => `${isoToHe(e.date)} ${esc(e.he)}`).join('; ')}.</p>` : '')
		+ `<p><strong>מקורות:</strong> ${esc(m.fees.he)}, נוסח ל-${isoToHe(m.fees.current_to)}, ו${esc(m.fees.notice_he)}; ${esc(m.experts.he)}, נוסח ל-${isoToHe(m.experts.current_to)}; ${esc(m.court.he)}, נוסח ל-${isoToHe(m.court.current_to)}; ${esc(m.fee.bar_he)}; ${esc(m.legal_aid.regs_he)} וטבלת הזכאות מ-${isoToHe(m.legal_aid.table_from)}. נבדק ${isoToHe(m.checked_on)}.</p>`
		+ `<p>הודפס ב-${isoToHe(printedOn)} מ-jus-tice.co.il. מידע כללי, לא ייעוץ משפטי.</p>`;
}

export function renderDetails(reg, r, opts = {}) {
	if (!r.ok) { return ''; }
	return `<div class="${P}-screen">`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-m-h">איך חושב, צעד אחר צעד</h3></div>${methodList(reg, r)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-dl-h">מועדים שהתקנות קובעות</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="ics">הוספה ליומן (.ics)</button><button class="jtool-btn" type="button" data-act="print">הדפסת סיכום</button></div></div>${datesTable(reg, r, opts)}</div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chg-h">מה השתנה ומתי</h3></div>${changesTable(reg)}</div>`
		+ `</div><div class="${P}-print">${printSummary(reg, r, opts.printedOn || opts.today || reg.malpractice_mechir.checked_on)}</div>`;
}

/** The result-first card at the top of the page ([justice_tool_lead]): what is left of the compensation in the example (or
 * the reader's numbers once they change anything), the fee in one line, and a jump to the form. Same markup on the server
 * and in the browser. */
export function leadCard(reg, r, opts = {}) {
	const go = `<a class="jtool-lead__go" href="#jtool-${TOOL_ID}" data-lead-go>${opts.example ? 'לחשב עם המספרים שלכם' : 'לשנות את הנתונים'}</a>`;
	if (!r.ok) {
		return `<p class="jtool-lead__label">כמה עולה תביעת רשלנות רפואית</p><p class="jtool-lead__row"><strong class="jtool-lead__figure">—</strong></p><p class="jtool-lead__line">${esc(r.errors.map((e) => e.he).join(' '))}</p>${go}`;
	}
	const label = `${opts.example ? 'דוגמה מחושבת: ' : 'החישוב שלכם: '}תביעה של ${nis(r.amount)} ב${courtHe(r)}${r.hasComp ? `, פיצוי ${nis(r.comp)}` : ''}`;
	const unit = r.hasComp ? 'ש"ח נשארים לכם מהפיצוי' : r.lost ? 'ש"ח מכיסכם כשהתביעה נדחית' : 'ש"ח מכיסכם עד עכשיו';
	const line = `אגרה: ${nis(r.court.first)} בהגשה, ${nis(r.court.full)} אם התביעה נדחית. ${r.fee ? `שכר טרחה ומע"מ: ${nis(r.fee + r.feeVat)}. ` : ''}לשכר טרחה ברשלנות רפואית אין תקרה בחוק.`;
	return `<p class="jtool-lead__label">${esc(label)}</p><p class="jtool-lead__row"><strong class="jtool-lead__figure"><bdi>${money(mcFigure(r), Math.round(mcFigure(r) * 100) % 100 ? 2 : 0)}</bdi></strong><span class="jtool-lead__unit">${esc(unit)}</span></p><p class="jtool-lead__line">${esc(line)}</p>${go}`;
}

export function snapshot(reg) {
	const r = mcCompute(reg, EXAMPLE);
	const m = reg.malpractice_mechir;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.net,
		sticky: shk(r.net),
		lead: leadCard(reg, r, { example: true }),
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r, { today: EXAMPLE.today, printedOn: EXAMPLE.today }),
		method: `<ol><li>תביעה של ${esc(nis(EXAMPLE.amount))}: עד ${esc(nis(reg.small_claims.magistrate_max))} ביום ההגשה, ולכן בית משפט השלום${cite(reg.small_claims.magistrate_section, m.court.url)}</li>`
			+ `<li>תביעה לפיצויים בשל נזק גוף: אגרה קבועה של ${esc(nis(m.fees.magistrate.full))}, ובהגשה ${esc(nis(m.fees.magistrate.first))}${cite(m.fees.rule_section, m.fees.url)}${cite(m.fees.first_section, m.fees.url)}</li>`
			+ `<li>שכר טרחה ${EXAMPLE.feePct}% מפיצוי של ${esc(nis(EXAMPLE.comp))}: ${esc(nis(r.fee))}, ועוד מע"מ ${r.vatPct}%: ${esc(nis(r.feeVat))}${cite(reg.car_accident.fees.vat_he, reg.car_accident.fees.vat_url)}</li>`
			+ `<li>שתי חוות דעת לפי ההצעות: ${esc(nis(r.expertsTotal))} (אין להן מחירון רשמי)${cite(m.experts.attach_section, m.experts.url)}</li>`
			+ `<li>נשאר: ${esc(nis(r.net))}; אם התביעה נדחית: ${esc(nis(r.failCost))}${cite(m.fees.dismissed_section, m.fees.url)}</li></ol>`,
		compare_table: rulesTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root, today) {
	const val = (id) => (root.querySelector(`#${P}-${id}`) || {}).value || '';
	const pick = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const amt = (id) => { const v = String(val(id)).replace(/[,\s₪%]/g, ''); return v === '' ? '' : Number(v); };
	return {
		stage: pick('stage', 'pre'), when: val('when') || 'early', outcome: pick('out', 'won'), amount: amt('amt'), comp: amt('comp'), feePct: amt('pct'),
		vat: pick('vat', 'plus'), e1: amt('e1'), e2: amt('e2'), e3: amt('e3'), courtExpert: amt('cexp'), filing: mcIso(val('fil')), defOpinion: mcIso(val('dop')),
		courtOpinion: mcIso(val('cop')), household: amt('hh'), income: amt('inc'), dp: amt('dp'), dd: amt('dd'), today,
	};
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const lead = document.querySelector(`[data-jtool-lead="${TOOL_ID}"]`);
	const m = reg.malpractice_mechir;
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
	const ids = { amount: 'amt', comp: 'comp', feePct: 'pct', e1: 'e1', e2: 'e2', e3: 'e3', courtExpert: 'cexp', filing: 'fil', defOpinion: 'dop', courtOpinion: 'cop', household: 'hh', income: 'inc', dp: 'dp', dd: 'dd' };
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		for (const e of r.errors) {
			const id = ids[e.field];
			const box = id && root.querySelector(`#${P}-${id}-e`);
			if (box) { box.textContent = e.he; }
			const fld = id && root.querySelector(`#${P}-${id}`);
			if (fld) { fld.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = (input) => {
		const lost = input.stage === 'judgment' && input.outcome === 'lost';
		form.querySelectorAll('[data-if-settled]').forEach((el) => { el.hidden = input.stage !== 'settled'; });
		form.querySelectorAll('[data-if-judgment]').forEach((el) => { el.hidden = input.stage !== 'judgment'; });
		form.querySelectorAll('[data-if-filed]').forEach((el) => { el.hidden = input.stage === 'pre'; });
		form.querySelectorAll('[data-if-comp], [data-if-fee]').forEach((el) => { el.hidden = lost; });
		const lab = form.querySelector(`label[for="${P}-fil"]`);
		if (lab) { lab.textContent = input.stage === 'pre' ? 'יום ההגשה המתוכנן' : 'יום הגשת התביעה'; }
		const key = Object.keys(PRESETS).find((k) => { const p = PRESETS[k]; return p.stage === input.stage && String(p.amount) === String(input.amount) && String(p.comp || '') === String(input.comp) && (p.outcome || 'won') === input.outcome && (p.when || 'early') === input.when && String(p.e1 || '') === String(input.e1); }) || '';
		form.querySelectorAll(`.${P}-preset`).forEach((b) => b.setAttribute('aria-pressed', b.getAttribute('data-preset') === key ? 'true' : 'false'));
	};
	const run = (input, opts = {}) => {
		const r = mcCompute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r, { today: input.today, printedOn: today });
		if (sticky) { sticky.innerHTML = r.ok ? shk(mcFigure(r)) : '—'; }
		if (lead) { lead.innerHTML = leadCard(reg, r, { example: !own }); }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: mcBandOf(r) }); }
		return r;
	};
	// The example keeps its own "today" (the day it was computed); the reader's first change moves the dates to today.
	const current = () => readForm(root, today);
	const schedule = () => {
		own = true;
		if (!started) { started = true; track('tool_start', { tool_id: TOOL_ID }); }
		clearTimeout(timer);
		timer = setTimeout(() => { timer = null; const input = current(); sync(input); run(input); }, 160);
	};
	// A share link may name its tool (/@alut-tviaa-refuit); on a page with several tools only this tool reads it. A sibling's
	// partial link fills the rest from the example and says so.
	const shareOwner = (/\/@([a-z-]+)$/.exec(window.location.hash) || [])[1];
	const parsed = !shareOwner || shareOwner === TOOL_ID ? inputOf(decodeState(window.location.hash.replace(/\/@[a-z-]+$/, ''), KEYS), EXAMPLE) : null;
	const fromHash = parsed ? Object.assign(parsed, { today }) : null;
	if (fromHash) {
		own = true;
		form.innerHTML = renderForm(reg, fromHash);
		const note = root.querySelector('[data-jtool-shared]');
		if (note) { note.hidden = false; }
		sync(fromHash);
		run(fromHash, { silent: true });
		if (fromHash.filled && fromHash.filled.length) { toast(root, `נפתח עם הנתונים מהקישור. ${fromHash.filled.map((x) => ({ amount: 'סכום התביעה', comp: 'הפיצוי', feePct: 'אחוז שכר הטרחה', e1: 'מחיר חוות הדעת' }[x])).join(', ')}: מהדוגמה, ואפשר לשנות.`); }
	}
	if (store.get(saveKey) && !fromHash) { const n = root.querySelector('[data-jtool-saved]'); if (n) { n.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	if (lead) {
		lead.addEventListener('click', (ev) => {
			if (!ev.target.closest('[data-lead-go]')) { return; }
			ev.preventDefault();
			form.scrollIntoView({ behavior: 'smooth', block: 'start' });
			const first = form.querySelector(`.${P}-preset, input:not([type="radio"]):not([type="checkbox"])`);
			if (first) { setTimeout(() => first.focus({ preventScroll: true }), 350); }
			track('tool_lead_click', { tool_id: TOOL_ID });
		});
	}
	root.addEventListener('click', async (ev) => {
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; }
		if (act === 'preset') {
			const input = mcPreset(b.getAttribute('data-preset'), today);
			if (!input) { return; }
			own = true;
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			track('tool_preset', { tool_id: TOOL_ID, band: b.getAttribute('data-preset') });
			return;
		}
		if (act === 'pick') {
			// The reader picks a published figure as their own quote: it fills the first empty opinion field.
			const v = Number(b.getAttribute('data-amount')) || 0;
			const input = own ? current() : Object.assign({}, EXAMPLE);
			const slot = ['e1', 'e2', 'e3'].find((k) => input[k] === '' || input[k] === undefined) || 'e3';
			input[slot] = v;
			own = true;
			form.innerHTML = renderForm(reg, input);
			sync(input);
			run(input);
			toast(root, 'הסכום הוזן כהצעה שלכם. זה מספר שמשרד או מכון פרסמו, לא מחיר רשמי.');
			track('tool_pick', { tool_id: TOOL_ID });
			return;
		}
		const input = own ? current() : Object.assign({}, EXAMPLE);
		const r = run(input, { silent: true });
		const link = `${shareUrl(stateOf(input))}/@${TOOL_ID}`;
		if (act === 'ics') {
			if (r.ok && r.events.length) {
				download('alut-tviaa-refuit.ics', 'text/calendar;charset=utf-8', ics(r.events.map((e) => ({ date: e.date, summary: `תביעת רשלנות רפואית: ${e.he}`, description: `${e.section}. חושב ב-jus-tice.co.il; ימי פגרה לא מנוכים. מידע כללי, לא ייעוץ משפטי.` })), new Date().toISOString()));
				track('tool_download', { tool_id: TOOL_ID, type: 'ics' });
			} else {
				toast(root, 'אין עדיין מועד שתקנה קובעת: הזינו את יום הגשת התביעה.');
			}
		} else if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. יש בו רק מספרים ותאריכים, בלי שמות ובלי ההכנסה.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · חושב ב-jus-tice.co.il ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (חושב ב-jus-tice.co.il, ${isoToHe(m.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			// The simulation refuses a case story in its URL: the brief travels by the one-time window handoff
			// (sim-handoff.js); when a popup is blocked, it goes to the clipboard and the plain link opens as is.
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: mcBandOf(r) });
			const brief = r.ok ? aiBrief(reg, r) : '';
			const purpose = (/purpose=([a-z_]+)/.exec(b.getAttribute('href') || '') || [])[1] || 'witness_prep';
			if (brief && openSimulation(brief, purpose, b.getAttribute('href'))) {
				ev.preventDefault();
				toast(root, 'נפתח תרגול עם הנתונים שלכם. הדמויות הן AI, והתרגול אינו נשמר אצלנו.');
			} else {
				if (brief) { copyText(brief); }
				toast(root, 'התרחיש הועתק. בסימולציה, הדביקו אותו בתיאור המקרה.');
			}
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד, בלי ההכנסה. אפשר למחוק בכל רגע.');
		} else if (act === 'restore') {
			const s = inputOf(decodeState(store.get(saveKey) || '', KEYS));
			if (s) { own = true; s.today = today; form.innerHTML = renderForm(reg, s); sync(s); run(s); }
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
