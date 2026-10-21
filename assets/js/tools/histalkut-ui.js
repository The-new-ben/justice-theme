/**
 * The inheritance wave UI: the waiver-of-inheritance affidavit generator (histalkut, jt24). Invented tool.
 * The picture is the share flow of a court file: the deceased, the renouncer's share, and where the law sends it (the
 * named beneficiary, the other heirs, or a wall when it is not a waiver at all). The affidavit under it is a sheet in the
 * court's own typeface, every clause with its section; the tables and the path say the same in text.
 */
import { compute, byKind, scopeText, KINDS, KIND_HE, RELATION_HE, STAGE_HE, WHO_HE, STAGES } from './histalkut-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState,
	track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'histalkut';
const P = 'jt24';

export const EXAMPLE = { basis: 'law', relation: 'child', scope: 'all', pct: '', bequest: '', kind: 'spouse', who: 'adult', stage: 'before', conditional: false, verify: 'lawyer', signers: 1, gender: 'f', estate: '', sharePct: '' };

const REL_LABEL = { child: 'ילד/ה', spouse: 'בן/בת זוג', sibling: 'אח/ות', parent: 'הורה', grandchild: 'נכד/ה', other: 'אחר' };
const STATUS_HE = {
	ok: 'מותר להסתלק',
	court: 'מותר, באישור בית המשפט',
	amend: 'מותר, עם בקשה לתיקון הצו',
	not_waiver: 'זו לא הסתלקות',
	divided: 'אי אפשר להסתלק',
};

function cite(text, href) { return href ? ` <a class="jtool-cite" href="${esc(href)}" target="_blank" rel="noopener">${esc(text)}</a>` : ''; }
const nis = (n) => `${money(n, n % 1 ? 2 : 0)} ₪`;

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const ip = reg.inheritance_process;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const will = input.basis === 'will';
	const scope = ['all', 'part', 'bequest'].includes(input.scope) ? input.scope : 'all';
	const notary = input.verify === 'notary';
	const signers = Number(input.signers) || 1;
	return `<fieldset class="jtool-field"><legend>על פי מה יורשים</legend><div class="jtool-chips">${chip('basis', 'law', 'ירושה על פי דין', !will)}${chip('basis', 'will', 'צוואה', will)}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מי מסתלק/ת: הקרבה למנוח/ה</legend><div class="jtool-chips">${Object.keys(REL_LABEL).map((k) => chip('rel', k, REL_LABEL[k], (input.relation || 'child') === k)).join('')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('gen', 'f', 'נקבה', input.gender !== 'm')}${chip('gen', 'm', 'זכר', input.gender === 'm')}${chip('who', 'adult', WHO_HE.adult, (input.who || 'adult') === 'adult')}${chip('who', 'minor', WHO_HE.minor, input.who === 'minor')}${chip('who', 'guardian', WHO_HE.guardian, input.who === 'guardian')}</div>`
		+ `<p class="jtool-hint">המין בוחר את נוסח התצהיר (מצהיר/ה, חתם/ה). קטין או מי שמונה לו אפוטרופוס: ההסתלקות טעונה אישור בית המשפט (${esc(ip.sections.renounce_minor)}).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>על מה מסתלקים</legend><div class="jtool-chips">${chip('scope', 'all', 'הכול', scope === 'all')}${chip('scope', 'part', 'חלק מהחלק שלי', scope === 'part')}<span data-if-will${will ? '' : ' hidden'}>${chip('scope', 'bequest', 'מנה מסוימת שבצוואה', scope === 'bequest')}</span></div>`
		+ `<div class="jtool-row" style="margin-top:8px"><div class="jtool-field" data-if-part${scope === 'part' ? '' : ' hidden'}><label class="jtool-label" for="${P}-pct">איזה אחוז מהחלק שלכם</label><div class="jtool-input jtool-input--money"><input id="${P}-pct" type="text" inputmode="numeric" autocomplete="off" value="${esc(input.pct || '')}" placeholder="1 עד 99" aria-describedby="${P}-pct-e"><span class="jtool-input__suffix" aria-hidden="true">%</span></div><p class="jtool-error" id="${P}-pct-e" role="alert"></p></div>`
		+ `<div class="jtool-field" data-if-bequest${scope === 'bequest' ? '' : ' hidden'}><label class="jtool-label" for="${P}-beq">המנה: מה הצוואה נותנת לכם</label><input id="${P}-beq" type="text" autocomplete="off" maxlength="120" value="${esc(input.bequest || '')}" placeholder="לדוגמה: הדירה ברחוב..." aria-describedby="${P}-scope-e"><p class="jtool-error" id="${P}-scope-e" role="alert"></p></div></div>`
		+ `<p class="jtool-hint">מסתלקים מהחלק כולו או מקצתו, ובצוואה גם ממנה מסוימת (${esc(ip.sections.renounce)}(א)). תיאור המנה נשאר אצלכם ולא נכנס לקישור השיתוף.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>לטובת מי</legend><div class="jtool-chips">${KINDS.map((k) => chip('kind', k, KIND_HE[k].label, (input.kind || 'general') === k)).join('')}</div>`
		+ `<p class="jtool-hint">הסתלקות מכוונת יש רק לטובת בן הזוג, ילד או אח של המנוח/ה (${esc(ip.sections.renounce_who)}). לטובת כל אדם אחר זו העברה (${esc(ip.sections.transfer_share)}), לא הסתלקות.</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>באיזה שלב התיק</legend><div class="jtool-chips">${STAGES.map((k) => chip('stage', k, STAGE_HE[k], (input.stage || 'before') === k)).join('')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('cond', '1', 'ההסתלקות מותנית במשהו', input.conditional, 'checkbox')}</div>`
		+ `<p class="jtool-hint">מסתלקים מהפטירה ועד חלוקת העיזבון; אחרי צו, מבקשים גם לתקן אותו. הסתלקות על תנאי בטלה (${esc(ip.sections.renounce_conditional)}).</p></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מי מאמת את התצהיר</legend><div class="jtool-chips">${chip('ver', 'lawyer', 'עורך דין', !notary)}${chip('ver', 'notary', 'נוטריון', notary)}</div>`
		+ `<div class="jtool-chips" data-if-notary${notary ? '' : ' hidden'} style="margin-top:8px">${[1, 2, 3, 4].map((n) => chip('sig', String(n), n === 1 ? 'חותם אחד' : `${n} חותמים`, signers === n)).join('')}</div><p class="jtool-error" id="${P}-signers-e" role="alert"></p>`
		+ `<p class="jtool-hint">${esc(ip.evidence_he)}. אצל נוטריון השכר קבוע בתקנות (${esc(ip.notary.item)}), ועוד מע"מ; אצל עורך דין לפי הסכם שכר הטרחה.</p></fieldset>`
		+ `<details class="jtool-more"${input.estate || input.sharePct ? ' open' : ''}><summary>כמה זה שווה? (לא חובה)</summary>`
		+ `<div class="jtool-row" style="margin-top:8px"><div class="jtool-field"><label class="jtool-label" for="${P}-est">שווי העיזבון בערך</label><div class="jtool-input jtool-input--money"><input id="${P}-est" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.estate ? money(input.estate, 0) : '')}" placeholder="לא חובה" aria-describedby="${P}-estate-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div><p class="jtool-error" id="${P}-estate-e" role="alert"></p></div>`
		+ `<div class="jtool-field"><label class="jtool-label" for="${P}-shr">חלקכם בעיזבון</label><div class="jtool-input jtool-input--money"><input id="${P}-shr" type="text" inputmode="decimal" autocomplete="off" value="${esc(input.sharePct || '')}" placeholder="לדוגמה: 25" aria-describedby="${P}-sharePct-e"><span class="jtool-input__suffix" aria-hidden="true">%</span></div><p class="jtool-error" id="${P}-sharePct-e" role="alert"></p></div></div>`
		+ `<p class="jtool-hint">רק למשפט "אתם מוותרים על כ-...". מי יורש כמה: <a href="/succession-law-israel/">המחשבון</a>.</p></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const ip = reg.inheritance_process;
	const S = ip.sections;
	const rel = RELATION_HE[r.relation][r.gender];
	const whoHe = r.who === 'adult' ? (r.gender === 'm' ? 'בגיר' : 'בגירה') : r.who === 'minor' ? (r.gender === 'm' ? 'קטין' : 'קטינה') : 'עם אפוטרופוס';
	const whatHe = r.scope === 'all' ? `מכל ${r.gender === 'm' ? 'חלקו' : 'חלקה'}` : r.scope === 'part' ? `מ-${r.pct}% ${r.gender === 'm' ? 'מחלקו' : 'מחלקה'}` : 'ממנה שבצוואה';
	const basisHe = r.basis === 'will' ? 'על פי צוואה' : 'בירושה על פי דין';
	const toHe = r.kind === 'general' ? 'הסתלקות סתמית, לכל היורשים' : `לטובת ${KIND_HE[r.kind].to}`;
	const head = `${rel} של המנוח/ה, ${whoHe}, ${r.gender === 'm' ? 'מסתלק' : 'מסתלקת'} ${whatHe} ${basisHe}, ${toHe}: `;
	if (r.blocked === 'divided') {
		return `${head}העיזבון כבר חולק, ואי אפשר להסתלק (${S.renounce}(א)). מה שנשאר הוא העברה או מתנה של מה שקיבלתם (${S.transfer_share}), ובמקרקעין: מכירה לעניין מס שבח ומס רכישה.`;
	}
	if (r.blocked === 'not_waiver') {
		return `${head}זו לא הסתלקות. החוק מכיר בהסתלקות מכוונת רק לטובת בן הזוג, ילד או אח של המנוח/ה (${S.renounce_who}); לטובת אדם אחר זו העברת החלק (${S.transfer_share}), כלומר מתנה, ובמקרקעין: מכירה לפי חוק מיסוי מקרקעין.`;
	}
	const costHe = r.verify === 'notary' ? `אצל נוטריון ${nis(r.cost.lines.find((l) => l.key === 'verify').amount)} ועוד מע"מ ${r.cost.vatPct}%: ${nis(r.cost.total - (r.amend ? ip.registrar.items.amend.amount : 0))}` : 'אצל עורך הדין שלכם, לפי הסכם שכר הטרחה';
	let out = `${head}מותר (${S.renounce}(א) ו-${S.renounce_who.replace('סעיף ', '')}). התצהיר ${r.stage === 'filed' ? 'מוגש לתיק הבקשה' : 'מוגש לרשם עם הבקשה לצו'} (${ip.regulation_sections.renounce_affidavit}), בלי אגרה; האימות ${costHe}.`;
	if (r.court) { out += ` ${r.who === 'minor' ? 'קטין' : 'מי שמונה לו אפוטרופוס'} מסתלק רק באישור בית המשפט (${S.renounce_minor}), והאישור מצורף לתצהיר.`; }
	if (r.amend) { out += ` ניתן כבר צו: ההסתלקות משנה את החלוקה, ולכן מבקשים לתקן אותו (${S.amend}, ${ip.regulation_sections.amend}): אגרה ${nis(ip.registrar.items.amend.amount)}, וליורשים ${ip.days.amend_response} ימים לתשובה.`; }
	if (r.void) { out += ` כפי שהוגדרה, ההסתלקות מותנית, ולכן בטלה (${S.renounce_conditional}): מוחקים את התנאי לפני החתימה.`; }
	return out;
}

/** The share flow: the deceased, the renouncer's share, and where the law sends it. */
function flowHtml(reg, r) {
	const basisHe = r.basis === 'will' ? 'צוואה' : 'ירושה על פי דין';
	const shareHe = r.scope === 'part' ? `${r.pct}% מהחלק` : r.scope === 'bequest' ? `המנה${r.bequest ? `: ${r.bequest}` : ''}` : 'כל החלק';
	const blocked = Boolean(r.blocked);
	const toHe = r.share.to;
	const toSub = r.blocked === 'divided' ? 'העיזבון חולק' : r.blocked === 'not_waiver' ? `העברה, ${reg.inheritance_process.sections.transfer_share}` : `${reg.inheritance_process.sections.renounce_who}`;
	const amountHe = r.waived !== null ? ` כ-${nis(r.waived)}` : '';
	return `<ol class="jt24-flow${blocked ? ' jt24-flow--blocked' : ''}" aria-hidden="true">`
		+ `<li class="jt24-node jt24-node--from"><span class="jt24-node__k">המנוח/ה</span><strong class="jt24-node__v">העיזבון</strong><span class="jt24-node__s">${esc(basisHe)}</span></li>`
		+ `<li class="jt24-node jt24-node--share"><span class="jt24-node__k">${esc(RELATION_HE[r.relation][r.gender])}, ${r.gender === 'm' ? 'מסתלק' : 'מסתלקת'}</span><strong class="jt24-node__v">${esc(shareHe)}</strong><span class="jt24-node__s">${r.waived !== null ? esc(`כ-${nis(r.waived)}`) : esc(WHO_HE[r.who])}</span></li>`
		+ `<li class="jt24-node jt24-node--to${blocked ? ' jt24-node--wall' : ''}"><span class="jt24-node__k">${blocked ? 'עצור' : 'עובר אל'}</span><strong class="jt24-node__v">${esc(toHe)}</strong><span class="jt24-node__s">${esc(toSub)}</span></li></ol>`
		+ `<p class="jt24-flow__text">${esc(`${basisHe}: ${RELATION_HE[r.relation][r.gender]} של המנוח/ה ${r.gender === 'm' ? 'מסתלק' : 'מסתלקת'} מ${shareHe}${amountHe}; ${blocked ? `עצור: ${toHe}` : `החלק עובר אל ${toHe}`}`)}${cite(r.share.section, r.share.url)}</p>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	const ip = reg.inheritance_process;
	const state = r.void ? 'danger' : r.blocked ? 'danger' : r.status === 'ok' ? 'ok' : 'warn';
	const mark = state === 'ok' ? '✓' : state === 'warn' ? '!' : '✕';
	const pill = r.void ? `הסתלקות על תנאי בטלה (${ip.sections.renounce_conditional})` : STATUS_HE[r.status];
	const figure = r.blocked ? (r.blocked === 'divided' ? 'אין הסתלקות' : 'לא הסתלקות') : r.scopeHe;
	const shown = r.flags.filter((f) => ['void', 'court', 'gift', 'alternative'].includes(f.code));
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true"><p class="jtool-state jtool-state--${state}">${mark} ${esc(pill)}</p>`
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}${r.blocked ? 'מה הדין' : 'על מה מסתלקים'}</p>`
		+ `<strong class="jtool-verdict__figure">${esc(figure)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ (r.blocked ? '' : `<p class="jtool-scope">${r.cost.total ? `עלות לפי התעריפים: <strong>${ils(r.cost.total, r.cost.total % 1 ? 2 : 0)}</strong>${r.cost.vat ? `, מתוכה מע"מ ${esc(nis(r.cost.vat))}` : ''}` : 'אגרות ותעריפים: אין; שכר הטרחה של עורך הדין לפי ההסכם איתו'}${r.waived !== null ? `. אתם מוותרים על כ-<strong>${ils(r.waived, 0)}</strong>` : ''}.</p>`)
		+ `</div>`
		+ flowHtml(reg, r)
		+ (shown.length ? `<ul class="jtool-flags">${shown.map((f) => `<li>${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul>` : '');
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const ip = reg.inheritance_process;
	let out = '';
	// 1. Where the share goes.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-share-h">מה קורה לחלק</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-share-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מי</th><th scope="col">מה</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.share.rows.map((row) => `<tr><td data-th="מי">${esc(row.he)}</td><td data-th="מה">${esc(row.how)}</td><td data-th="הכלל">${cite(row.section, row.url)}</td></tr>`).join('')
		+ `</tbody><caption>הכלי לא מחשב את חלקי היורשים; מי יורש כמה: <a href="/succession-law-israel/">המחשבון</a>.</caption></table></div></div>`;
	if (!r.blocked) {
		// 2. The affidavit.
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-doc-h">התצהיר, מוכן להשלמה</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-doc">העתקת התצהיר</button><button class="jtool-btn" type="button" data-act="print">הדפסה / PDF</button></div></div>`
			+ `<pre class="jtool-letter jt24-doc" role="region" aria-labelledby="${P}-doc-h" tabindex="0" dir="rtl">${esc(r.doc)}</pre>`
			+ `<p class="jt24-doc__note">הסוגריים המרובעים הם המקומות שממלאים. ${esc(ip.evidence_he)}.</p></div>`;
		// 3. The cost.
		const rows = r.cost.lines.map((l) => `<tr><td data-th="מה">${esc(l.he)}${l.vat ? ` (כולל מע"מ ${r.cost.vatPct}%)` : ''}</td><td data-th="סכום">${l.amount === null ? 'לפי ההסכם' : l.amount === 0 ? 'חינם' : ils(l.vat ? Math.round(l.amount * (100 + r.cost.vatPct)) / 100 : l.amount)}</td><td data-th="הכלל">${cite(l.section, l.url)}</td></tr>`);
		if (r.cost.notaryAlt) { rows.push(`<tr class="jtool-muted"><td data-th="מה">לחלופין, אימות אצל נוטריון, חותם אחד: ${esc(nis(r.cost.notaryAlt.base))} ועוד מע"מ ${r.cost.vatPct}%</td><td data-th="סכום">${ils(r.cost.notaryAlt.total)}</td><td data-th="הכלל">${cite(r.cost.notaryAlt.section, r.cost.notaryAlt.url)}</td></tr>`); }
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-cost-h">כמה זה עולה</h3></div>`
			+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-cost-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">מה</th><th scope="col">סכום</th><th scope="col">הכלל</th></tr></thead><tbody>${rows.join('')}`
			+ `<tr class="jtool-table__total"><td data-th="מה">סך הכול באגרות ובתעריפים</td><td data-th="סכום">${r.cost.total ? ils(r.cost.total) : 'חינם'}</td><td data-th="הכלל">${r.cost.vat ? `מתוכו מע"מ ${ils(r.cost.vat)}` : '—'}</td></tr></tbody>`
			+ `<caption>תעריף הנוטריונים מ-${isoToHe(reg.will_cost.notary.from)} (${esc(ip.notary.item)}: ${esc(nis(reg.will_cost.notary.affidavit_first))} לחותם ראשון, ${esc(nis(reg.will_cost.notary.affidavit_additional))} לכל חותם נוסף, ועוד מע"מ ${reg.will_cost.vat.pct}%); אגרות הרשם מ-${isoToHe(ip.registrar.from)}. שכר טרחת עורך דין על התצהיר: אין תעריף.</caption></table></div></div>`;
	}
	// 4. The clock: the four stages of the file.
	out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-clock-h">השעון: באיזה שלב אפשר להסתלק</h3></div>`
		+ `<div class="jtool-scroll" role="region" aria-labelledby="${P}-clock-h" tabindex="0"><table class="jtool-table"><thead><tr><th scope="col">השלב</th><th scope="col">מה הדין</th><th scope="col">הכלל</th></tr></thead><tbody>`
		+ r.clock.map((c) => `<tr class="${c.now ? 'jt24-now' : 'jtool-muted'}"><td data-th="השלב">${esc(c.he)}${c.now ? ' (אתם)' : ''}</td><td data-th="מה הדין">${esc(c.what)}</td><td data-th="הכלל">${cite(c.section, c.url)}</td></tr>`).join('')
		+ `</tbody><caption>${esc(ip.days.amend_he)}. ${esc(ip.courts.religious_he)}.</caption></table></div></div>`;
	// 5. What to attach.
	if (r.checklist.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-chk-h">מה מצרפים</h3><div class="jtool-actions"><button class="jtool-btn" type="button" data-act="copy-list">העתקת הרשימה</button></div></div>`
			+ `<ul class="jtool-notes">${r.checklist.map((x) => `<li>${esc(x.he)}${cite(x.section, x.url)}</li>`).join('')}</ul></div>`;
	}
	// 6. The flags that are not in the verdict.
	const rest = r.flags.filter((f) => !['void', 'court', 'gift', 'alternative'].includes(f.code));
	if (rest.length) {
		out += `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-flags-h">לפני שחותמים</h3></div><ul class="jtool-notes">${rest.map((f) => `<li>${esc(f.he)}${f.section ? cite(f.section, f.url) : ''}</li>`).join('')}</ul></div>`;
	}
	return out;
}

export function checklistText(r) {
	return r.checklist.map((x, i) => `${i + 1}. ${x.he} (${x.section})`).join('\n');
}

/** Page section: the four kinds of waiver side by side, from the registry's sections. */
export function kindsTable(reg) {
	const ip = reg.inheritance_process;
	const S = ip.sections;
	const kinds = byKind(reg, EXAMPLE);
	const rows = [
		['general', 'הסתלקות סתמית', 'כן', `${S.renounce}(א)-(ב)`, `ירושה, לא מכירה (${ip.land_tax.inheritance_not_sale} לחוק מיסוי מקרקעין)`],
		['spouse', 'מכוונת לטובת בן/בת הזוג של המנוח/ה', 'כן', S.renounce_who, `ירושה, לא מכירה (${ip.land_tax.inheritance_not_sale})`],
		['child', 'מכוונת לטובת ילד או אח של המנוח/ה', 'כן', S.renounce_who, `ירושה, לא מכירה (${ip.land_tax.inheritance_not_sale})`],
		['other', '"לטובת אדם אחר"', 'לא: זו העברת החלק, לא הסתלקות', `${S.renounce_who}; ${S.transfer_share}`, `מתנה; במקרקעין מכירה (${ip.land_tax.gift_is_sale})`],
	].map(([k, he, allowed, section, tax]) => {
		const approval = k === 'other' ? 'הסכם בכתב; קטין: אישור בית המשפט' : `בגיר: אין; קטין או מי שמונה לו אפוטרופוס: אישור בית המשפט (${S.renounce_minor})`;
		const to = kinds[k] ? kinds[k].to : '';
		return `<tr><td data-th="הסוג">${esc(he)}</td><td data-th="מותר?">${esc(allowed)}</td><td data-th="לאן עובר החלק">${esc(to)}</td><td data-th="הסעיף">${esc(section)}</td><td data-th="המס">${esc(tax)}</td><td data-th="אישור">${esc(approval)}</td></tr>`;
	}).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>ארבעת סוגי ההסתלקות לפי ${esc(S.renounce)} ל${esc(ip.law_he)}: למי מותר להפנות אותה, מה קורה לחלק, המס והאישור. אחרי חלוקת העיזבון אין הסתלקות בכלל.</caption><thead><tr><th scope="col">הסוג</th><th scope="col">מותר?</th><th scope="col">לאן עובר החלק</th><th scope="col">הסעיף</th><th scope="col">המס</th><th scope="col">אישור</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const ip = reg.inheritance_process;
	const r = compute(reg, EXAMPLE);
	const nf = reg.will_cost.notary;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.cost.total,
		sticky: `<bdi>${esc(r.scopeHe)}</bdi>`,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>בת בגירה של המנוח, יורשת על פי דין, מסתלקת מכל חלקה: מותר אחרי הפטירה וכל עוד העיזבון לא חולק, בהודעה בכתב לרשם לענייני ירושה${cite(`${ip.sections.renounce}(א)`, ip.law_url)}</li>`
			+ `<li>לטובת אמה, בת הזוג של המנוח: הסתלקות מכוונת מותרת רק לטובת בן הזוג, ילד או אח של המנוח; לטובת כל אדם אחר זו העברה${cite(ip.sections.renounce_who, ip.law_url)}${cite(ip.sections.transfer_share, ip.law_url)}</li>`
			+ `<li>בגירה: אין צורך באישור בית המשפט; קטין או מי שמונה לו אפוטרופוס: טעון אישור${cite(ip.sections.renounce_minor, ip.law_url)}</li>`
			+ `<li>לפני שהוגשה בקשה לצו: התצהיר מצורף לבקשה, ואין לו פרט אגרה${cite(ip.regulation_sections.renounce_affidavit, ip.regulations_url)}; אחרי צו היה צריך לבקש לתקן אותו: ${money(ip.registrar.items.amend.amount, 0)} ₪ ו-${ip.days.amend_response} ימים לתשובת היורשים${cite(ip.sections.amend, ip.law_url)}${cite(ip.registrar.items.amend.item, ip.registrar.url)}</li>`
			+ `<li>בלי תנאי: הסתלקות על תנאי בטלה${cite(ip.sections.renounce_conditional, ip.law_url)}</li>`
			+ `<li>האימות אצל עורך דין: לפי הסכם שכר הטרחה, אין תעריף; אצל נוטריון ${money(nf.affidavit_first, 0)} ₪ לחותם ראשון ו-${money(nf.affidavit_additional, 0)} ₪ לכל חותם נוסף, ועוד מע"מ ${reg.will_cost.vat.pct}%: ${money(r.cost.notaryAlt.total)} ₪ לחותם אחד${cite(ip.notary.item, nf.url)}</li>`
			+ `<li>המס: ירושה אינה מכירה, וההסתלקות משאירה את זה כך${cite(`${ip.land_tax.inheritance_not_sale} לחוק מיסוי מקרקעין`, ip.land_tax.url)}</li></ol>`,
		compare_table: kindsTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const pick = (name, dflt) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || dflt;
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const basis = pick('basis', 'law');
	let scope = pick('scope', 'all');
	if (basis === 'law' && scope === 'bequest') { scope = 'all'; }
	const pct = val(`#${P}-pct`).trim().replace(/,/g, '').replace(/%/g, '');
	const shr = val(`#${P}-shr`).trim().replace(/,/g, '').replace(/%/g, '');
	const est = val(`#${P}-est`).trim();
	return {
		basis, relation: pick('rel', 'child'), scope, pct: pct === '' ? '' : Number(pct), bequest: val(`#${P}-beq`).trim(),
		kind: pick('kind', 'general'), who: pick('who', 'adult'), stage: pick('stage', 'before'), conditional: on('cond'),
		verify: pick('ver', 'lawyer'), signers: Number(pick('sig', '1')), gender: pick('gen', 'f'),
		estate: est === '' ? '' : parseMoney(est), sharePct: shr === '' ? '' : Number(shr),
	};
}

const RL = { child: 'c', spouse: 's', sibling: 'b', parent: 'p', grandchild: 'g', other: 'o' };
const KD = { general: 'g', spouse: 's', child: 'c', sibling: 'b', other: 'o' };
const ST = { before: 'b', filed: 'f', ordered: 'o', divided: 'd' };
const WH = { adult: 'a', minor: 'm', guardian: 'g' };
const SC = { all: 'a', part: 'p', bequest: 'q' };
const keyOf = (map, v) => Object.keys(map).find((k) => map[k] === v);
/** The share state: the answers only; the bequest's description never leaves the device. */
export const stateOf = (i) => encodeState({ b: i.basis === 'will' ? 'w' : 'l', r: RL[i.relation] || 'c', s: SC[i.scope] || 'a', p: i.scope === 'part' ? i.pct || '' : '', k: KD[i.kind] || 'g', w: WH[i.who] || 'a', t: ST[i.stage] || 'b', c: i.conditional ? 1 : '', v: i.verify === 'notary' ? 'n' : '', n: i.verify === 'notary' && Number(i.signers) > 1 ? i.signers : '', g: i.gender === 'm' ? 'm' : '', e: i.estate || '', h: i.sharePct || '' });
export const KEYS = ['b', 'r', 's', 'p', 'k', 'w', 't', 'c', 'v', 'n', 'g', 'e', 'h'];
export function inputOf(s) {
	if (!s.b) { return null; }
	return {
		basis: s.b === 'w' ? 'will' : 'law', relation: keyOf(RL, s.r) || 'child', scope: keyOf(SC, s.s) || 'all', pct: s.s === 'p' && s.p ? Number(s.p) : '', bequest: '',
		kind: keyOf(KD, s.k) || 'general', who: keyOf(WH, s.w) || 'adult', stage: keyOf(ST, s.t) || 'before', conditional: s.c === '1',
		verify: s.v === 'n' ? 'notary' : 'lawyer', signers: s.v === 'n' && s.n ? Number(s.n) : 1, gender: s.g === 'm' ? 'm' : 'f',
		estate: s.e ? Number(s.e) : '', sharePct: s.h ? Number(s.h) : '',
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
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהאגרות והתעריף התעדכנו ב-1 בינואר'); }
	}
	const showErrors = (r) => {
		root.querySelectorAll('.jtool-error').forEach((e) => { e.textContent = ''; });
		root.querySelectorAll('[aria-invalid]').forEach((e) => e.removeAttribute('aria-invalid'));
		if (r.ok) { return; }
		const ids = { pct: 'pct', estate: 'est', sharePct: 'shr', scope: 'beq' };
		for (const e of r.errors) {
			const box = root.querySelector(`#${P}-${e.field}-e`);
			if (box) { box.textContent = e.he; }
			const f = root.querySelector(`#${P}-${ids[e.field] || e.field}`);
			if (f) { f.setAttribute('aria-invalid', 'true'); }
		}
	};
	const sync = () => {
		const will = ((root.querySelector(`input[name="${P}-basis"]:checked`) || {}).value || 'law') === 'will';
		const beq = root.querySelector(`input[name="${P}-scope"][value="bequest"]`);
		if (!will && beq && beq.checked) { const all = root.querySelector(`input[name="${P}-scope"][value="all"]`); if (all) { all.checked = true; } }
		const scope = (root.querySelector(`input[name="${P}-scope"]:checked`) || {}).value || 'all';
		const notary = ((root.querySelector(`input[name="${P}-ver"]:checked`) || {}).value || 'lawyer') === 'notary';
		form.querySelectorAll('[data-if-will]').forEach((el) => { el.hidden = !will; });
		form.querySelectorAll('[data-if-part]').forEach((el) => { el.hidden = scope !== 'part'; });
		form.querySelectorAll('[data-if-bequest]').forEach((el) => { el.hidden = scope !== 'bequest'; });
		form.querySelectorAll('[data-if-notary]').forEach((el) => { el.hidden = !notary; });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		if (sticky) { sticky.innerHTML = r.ok ? (r.blocked ? '—' : `<bdi>${esc(r.scopeHe)}</bdi>`) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.status }); }
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
		// A click while the debounce is pending runs it now; every action computes what the form holds now.
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(stateOf(input));
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, תעודת זהות או תיאור המנה.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · נבדק ב-jus-tice.co.il לפי חוק הירושה ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (נבדק ב-jus-tice.co.il, ${isoToHe(ip.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'copy-doc') {
			if (!r.ok || !r.doc) { toast(root, r.ok ? 'במצב הזה אין תצהיר הסתלקות: ראו מה הדין למעלה.' : 'קודם מתקנים את הקלט.'); return; }
			const ok = await copyText(`${r.doc}\n\nנוסח שנבנה ב-jus-tice.co.il (${isoToHe(ip.checked_on)}) לפי ${ip.sections.renounce} ל${ip.law_he} ו${ip.regulation_sections.renounce_affidavit} ל${ip.regulations_he}. מידע כללי, לא ייעוץ משפטי; חותמים רק בפני עורך דין, נוטריון, שופט או רשם.`);
			toast(root, ok ? 'התצהיר הועתק. ממלאים את הסוגריים המרובעים וחותמים בפני עורך דין.' : 'לא הצלחנו להעתיק. אפשר לסמן את הטקסט ולהעתיק ידנית.');
			track('tool_letter', { tool_id: TOOL_ID, band: r.status });
		} else if (act === 'copy-list' && r.ok) {
			const ok = await copyText(checklistText(r));
			toast(root, ok ? 'הרשימה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_download', { tool_id: TOOL_ID, type: 'copy-list' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok ? r.status : 'error' });
		} else if (act === 'save') {
			store.set(saveKey, stateOf(input));
			toast(root, 'נשמר במכשיר הזה בלבד, בלי תיאור המנה. אפשר למחוק בכל רגע.');
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
