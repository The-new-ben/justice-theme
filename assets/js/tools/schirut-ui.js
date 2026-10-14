/**
 * Wave 5 UI: the residential-lease generator (HAD-504). The form takes what a landlord and a tenant actually agree on;
 * the result shows the security cap as a meter, the check of every choice against the Fair Rental chapter, and the
 * whole lease, each clause with its sections (hover or tap a section to read it). Copy and print only: the lease is
 * text in the page, never a file on our server.
 * Privacy: names, the address, the furniture list and the defects are never put in the share link or saved on the
 * device; they stay in the open page only.
 */
import { compute, contractText, citeLabel, depositCap, PAYS, FORBIDDEN } from './schirut-engine.js';
import {
	esc, ils, money, parseMoney, isoToHe, encodeState, decodeState,
	track, copyText, toast, shareUrl, whatsappUrl, store, stickyBar, isStale, ilToday,
} from './instrument.js';

export const TOOL_ID = 'chozeh-schirut';
const P = 'jt12';

export const EXAMPLE = {
	rent: 6000, months: 12, start: '2026-11-01', payDay: 1, method: 'transfer', index: false,
	option: 'tenant', optionMonths: 12, optionPct: 3, exit: 'none', replacement: true,
	cash: 0, bank: 18000, other: 0, note: 0, guarantors: 0, guarantorMax: '',
	returnDays: '', repairDays: '', urgentDays: '', optTenantDays: '', optLandlordDays: '', exitTenantDays: '', exitLandlordDays: '',
	pays: { arnona: true, water: true, power: true, gas: true, vaad: true }, forbidden: { insurance: false, broker: false, systems: false },
	asIs: false, parking: false, storage: false, pets: 'ask', smoking: false, relative: false,
	furniture: '', defects: '', landlord: '', tenant: '', address: '', city: '',
};

const PAY_LABEL = { arnona: 'ארנונה', water: 'מים', power: 'חשמל', gas: 'גז וחימום', vaad: 'ועד בית (אחזקה שוטפת)' };
const FORBID_LABEL = { insurance: 'ביטוח המבנה', broker: 'דמי התיווך של המתווך של המשכיר', systems: 'קניית דוד, מזגן או מערכת קבועה' };
const METHOD_LABEL = { transfer: 'העברה בנקאית', checks: 'שיקים', standing: 'הוראת קבע' };
const LEVEL_MARK = { bad: '✕', warn: '!', info: 'i', ok: '✓' };
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

/** A section chip: hover or focus shows the section, a tap pins it (mount() toggles aria-expanded). */
function citeChip(rc, key, uid) {
	const text = rc.cites[key] || '';
	const href = key === 'protected' ? rc.protected_law_url : key === 'guarantee' ? rc.guarantee_law_url : rc.law_url;
	const law = key === 'protected' ? rc.protected_law_he : key === 'guarantee' ? rc.guarantee_law_he : rc.law_he;
	const isSection = !['protected', 'guarantee'].includes(key);
	return `<span class="jt12-ref"><button type="button" class="jt12-cite${isSection ? ' jt12-cite--sec' : ''}" aria-expanded="false" aria-controls="${uid}"${isSection ? ` aria-label="${esc(citeLabel(key))}"` : ''}>${esc(isSection ? key : citeLabel(key))}</button>`
		+ `<span class="jt12-pop" id="${uid}" role="note"><strong>${esc(citeLabel(key))}, ${esc(law)}</strong> ${esc(text)} <a href="${esc(href)}" target="_blank" rel="noopener">לנוסח המלא</a></span></span>`;
}

/* ---------------- Pure renderers ---------------- */

export function renderForm(reg, input) {
	const rc = reg.rent_contract;
	const chip = (name, value, label, checked, type = 'radio') => `<label class="jtool-chip"><input type="${type}" name="${P}-${name}" value="${value}"${checked ? ' checked' : ''}><span>${esc(label)}</span></label>`;
	const moneyField = (id, label, value, hint = '', ph = '0') => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><div class="jtool-input jtool-input--money"><input id="${P}-${id}" type="text" inputmode="decimal" autocomplete="off" value="${esc(value ? money(value, 0) : '')}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><span class="jtool-input__suffix" aria-hidden="true">₪</span></div>${hint ? `<p class="jtool-hint">${esc(hint)}</p>` : ''}<p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const numField = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" inputmode="numeric" autocomplete="off" value="${esc(value === '' || value === undefined || value === null ? '' : String(value))}" placeholder="${esc(ph)}" aria-describedby="${P}-${id}-e"><p class="jtool-error" id="${P}-${id}-e" role="alert"></p></div>`;
	const textField = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><input id="${P}-${id}" type="text" autocomplete="off" value="${esc(value || '')}" placeholder="${esc(ph)}"></div>`;
	const area = (id, label, value, ph) => `<div class="jtool-field"><label class="jtool-label" for="${P}-${id}">${esc(label)}</label><textarea id="${P}-${id}" class="jt12-area" rows="3" placeholder="${esc(ph)}">${esc(value || '')}</textarea></div>`;
	const opt = input.option || 'none';
	const ex = input.exit || 'none';
	const pays = input.pays || {};
	const forb = input.forbidden || {};
	const rentNum = Number(input.rent) || 0;
	const capNow = rentNum > 0 ? depositCap(rc, rentNum, Number(input.months) || 12).cap : null;
	return `<div class="jtool-row">${moneyField('rent', 'דמי שכירות לחודש', input.rent, '', 'לדוגמה: 6,000')}${numField('months', 'תקופה (חודשים)', input.months, '12')}</div>`
		+ `<div class="jtool-row"><div class="jtool-field"><label class="jtool-label" for="${P}-start">יום הכניסה לדירה</label><input id="${P}-start" type="text" inputmode="numeric" autocomplete="off" value="${esc(isoToHe(input.start || ''))}" placeholder="לדוגמה: 1.11.2026" aria-describedby="${P}-start-e"><p class="jtool-error" id="${P}-start-e" role="alert"></p></div>${numField('payDay', 'יום התשלום בחודש', input.payDay, '1')}</div>`
		+ `<fieldset class="jtool-field"><legend>איך משלמים</legend><div class="jtool-chips">${Object.keys(METHOD_LABEL).map((k) => chip('pm', k, METHOD_LABEL[k], (input.method || 'transfer') === k)).join('')}${chip('idx', '1', 'צמוד למדד', input.index, 'checkbox')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>ערובות שהמשכיר מבקש</legend><p class="jtool-hint" data-jt12-cap>${capNow === null ? 'הזינו דמי שכירות כדי לראות את התקרה.' : `מזומן, ערבות בנקאית וערבות מחברת ביטוח: יחד עד ${esc(nis(capNow))} (סעיף 25י(ב)).`}</p>`
		+ `<div class="jtool-row">${moneyField('bank', 'ערבות בנקאית', input.bank)}${moneyField('cash', 'פיקדון במזומן', input.cash)}</div>`
		+ `<div class="jtool-row">${moneyField('other', 'ערבות מחברת ביטוח או מבעל רישיון אשראי', input.other)}${moneyField('note', 'שטר חוב', input.note, 'לא נספר בתקרה')}</div>`
		+ `<div class="jtool-chips" role="group" aria-label="מספר ערבים">${[0, 1, 2, 3].map((k) => chip('gn', String(k), k === 0 ? 'בלי ערבים' : k === 1 ? 'ערב אחד' : `${k} ערבים`, Number(input.guarantors || 0) === k)).join('')}</div>`
		+ `<div data-if-guarantors${Number(input.guarantors || 0) > 0 ? '' : ' hidden'} style="margin-top:8px">${moneyField('gmax', 'סכום הערבות המרבי בכתב הערבות', input.guarantorMax, '', 'לא חובה')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>הארכה (אופציה)</legend><div class="jtool-chips">${chip('op', 'none', 'בלי', opt === 'none')}${chip('op', 'tenant', 'לשוכר', opt === 'tenant')}${chip('op', 'landlord', 'למשכיר', opt === 'landlord')}${chip('op', 'both', 'לשניהם', opt === 'both')}</div>`
		+ `<div class="jtool-row" data-if-option${opt === 'none' ? ' hidden' : ''} style="margin-top:8px">${numField('om', 'עוד כמה חודשים', input.optionMonths, '12')}${numField('opct', 'שינוי בשכר הדירה באופציה (%)', input.optionPct, '0')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>יציאה מוקדמת</legend><div class="jtool-chips">${chip('ex', 'none', 'אין', ex === 'none')}${chip('ex', 'tenant', 'השוכר רשאי לצאת', ex === 'tenant')}${chip('ex', 'both', 'שני הצדדים', ex === 'both')}${chip('ex', 'landlord', 'רק המשכיר', ex === 'landlord')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px">${chip('rep', '1', 'השוכר יכול להביא שוכר חלופי', input.replacement !== false, 'checkbox')}</div></fieldset>`
		+ `<fieldset class="jtool-field"><legend>מה השוכר משלם בנוסף</legend><div class="jtool-chips">${PAYS.map((k) => chip(`py-${k}`, '1', PAY_LABEL[k], pays[k] !== false, 'checkbox')).join('')}</div>`
		+ `<p class="jtool-hint" style="margin-top:8px">המשכיר מבקש שהשוכר ישלם גם:</p><div class="jtool-chips">${FORBIDDEN.map((k) => chip(`fb-${k}`, '1', FORBID_LABEL[k], forb[k], 'checkbox')).join('')}${chip('asis', '1', 'סעיף "הדירה נמסרת כמות שהיא"', input.asIs, 'checkbox')}</div></fieldset>`
		+ `<details class="jtool-more"${input.landlord || input.tenant || input.address || input.defects || input.furniture ? ' open' : ''}><summary>הפרטים לחוזה (נשארים רק בדף הזה)</summary>`
		+ `<div class="jtool-row" style="margin-top:8px">${textField('ll', 'שם המשכיר', input.landlord, 'לא חובה')}${textField('tn', 'שם השוכר', input.tenant, 'לא חובה')}</div>`
		+ `<div class="jtool-row">${textField('adr', 'כתובת הדירה', input.address, 'רחוב, מספר, דירה')}${textField('city', 'עיר', input.city, 'לא חובה')}</div>`
		+ `<div class="jtool-chips">${chip('pk', '1', 'חניה צמודה', input.parking, 'checkbox')}${chip('st', '1', 'מחסן צמוד', input.storage, 'checkbox')}${chip('smk', '1', 'בלי עישון בדירה', input.smoking, 'checkbox')}</div>`
		+ `<div class="jtool-chips" style="margin-top:8px" role="group" aria-label="בעלי חיים">${chip('pet', 'ask', 'חיות: בהסכמה', (input.pets || 'ask') === 'ask')}${chip('pet', 'yes', 'חיות: מותר', input.pets === 'yes')}${chip('pet', 'no', 'חיות: אסור', input.pets === 'no')}</div>`
		+ area('fur', 'ריהוט ואבזרים (נספח א\')', input.furniture, 'שורה לכל פריט: מקרר, מזגן בסלון, ארון בחדר השינה')
		+ area('def', 'פגמים שהמשכיר יודע עליהם', input.defects, 'לדוגמה: רטיבות בקיר חדר השירות')
		+ `<p class="jtool-hint">שמות, כתובת, ריהוט ופגמים לא נכנסים לקישור השיתוף ולא נשמרים במכשיר. מספרי תעודת הזהות ממלאים בכתב יד בחתימה.</p></details>`
		+ `<details class="jtool-more"${['returnDays', 'repairDays', 'urgentDays', 'optTenantDays', 'optLandlordDays', 'exitTenantDays', 'exitLandlordDays'].some((k) => input[k] !== '' && input[k] !== undefined) || input.relative ? ' open' : ''}><summary>מועדים שהמשכיר ביקש לשנות</summary>`
		+ `<p class="jtool-hint" style="margin-top:8px">ריק = מה שהחוק קובע. הזינו מה שהמשכיר מציע, והבדיקה תגיד אם זה חוקי.</p>`
		+ `<div class="jtool-row">${numField('rd', 'ימים לתיקון ליקוי', input.repairDays, String(rc.repairs.days))}${numField('ud', 'ימים לתיקון דחוף', input.urgentDays, String(rc.repairs.urgent_days))}</div>`
		+ `<div class="jtool-row">${numField('ret', 'ימים להחזרת הערובה', input.returnDays, String(rc.deposit.return_days))}${numField('otd', 'השוכר מודיע על האופציה, ימים לפני הסוף', input.optTenantDays, String(rc.option.tenant_days))}</div>`
		+ `<div class="jtool-row">${numField('old', 'המשכיר מודיע על האופציה שלו, ימים לפני', input.optLandlordDays, String(rc.option.landlord_days))}${numField('etd', 'הודעת יציאה של השוכר, ימים מראש', input.exitTenantDays, String(rc.exit.tenant_days))}</div>`
		+ `<div class="jtool-row">${numField('eld', 'הודעת יציאה של המשכיר, ימים מראש', input.exitLandlordDays, String(rc.exit.landlord_days))}<div class="jtool-field"><span class="jtool-label">קרבה</span><div class="jtool-chips">${chip('rel', '1', 'השוכר קרוב משפחה של המשכיר', input.relative, 'checkbox')}</div></div></div></details>`;
}

export function verdictSentence(reg, r) {
	if (!r.ok) { return ''; }
	const rc = reg.rent_contract;
	return `שכר דירה של ${nis(r.rent)} ל-${r.months} חודשים: ערובה שעולה כסף לשוכר עד ${nis(r.cap.cap)} (הנמוך מבין ${nis(r.cap.byTerm)} לשליש מהתקופה ו-${nis(r.cap.byMonths)} לשלושה חודשים).`
		+ ` תיקון ליקוי עד ${rc.repairs.days} ימים, דחוף עד ${rc.repairs.urgent_days}; הערובה חוזרת תוך ${rc.deposit.return_days} ימים.`
		+ (r.bad ? ` ${r.bad === 1 ? 'דרישה אחת' : `${r.bad} דרישות`} מהמשכיר נגד החוק, ובחוזה הן מתוקנות.` : ' אין בחוזה סעיף נגד החוק.');
}

/** The security meter: the two statutory limits, the lower one is the cap, and what was asked. */
function meter(reg, r) {
	const top = Math.max(r.cap.byTerm, r.cap.byMonths, r.counted, 1);
	const w = (v) => `${Math.max(0.5, (v / top) * 100).toFixed(2)}%`;
	const over = r.counted > r.cap.cap + 0.005;
	return `<div class="jt12-meter" role="img" aria-label="${esc(`תקרת הערובה ${nis(r.cap.cap)}; התבקשו ${nis(r.counted)}`)}">`
		+ `<p class="jt12-meter__h">כמה ערובה מותר לבקש (סעיף 25י(ב))</p>`
		+ `<div class="jt12-meter__row${r.cap.binding === 'term' ? ' jt12-meter__row--cap' : ''}"><span>שליש מהתקופה</span><span class="jt12-meter__bar"><i style="width:${w(r.cap.byTerm)}"></i></span><strong>${ils(r.cap.byTerm, 0)}</strong></div>`
		+ `<div class="jt12-meter__row${r.cap.binding === 'months' ? ' jt12-meter__row--cap' : ''}"><span>${reg.rent_contract.deposit.months} חודשי שכירות</span><span class="jt12-meter__bar"><i style="width:${w(r.cap.byMonths)}"></i></span><strong>${ils(r.cap.byMonths, 0)}</strong></div>`
		+ `<div class="jt12-meter__row jt12-meter__row--asked${over ? ' jt12-meter__row--over' : ''}"><span>מה שהתבקש</span><span class="jt12-meter__bar"><i style="width:${w(Math.min(r.counted, r.cap.cap))}"></i>${over ? `<b style="width:${w(r.counted - r.cap.cap)}"></b>` : ''}</span><strong>${ils(r.counted, 0)}</strong></div>`
		+ `<p class="jt12-meter__legend"><span><i class="jt12-k jt12-k--cap"></i>התקרה: ${ils(r.cap.cap, 0)}</span>${over ? `<span><i class="jt12-k jt12-k--over"></i>מעל התקרה: ${ils(r.counted - r.cap.cap, 0)}</span>` : ''}<span>שטר חוב וערבים לא נספרים</span></p></div>`;
}

function checkList(r) {
	const order = { bad: 0, warn: 1, info: 2, ok: 3 };
	const list = r.flags.slice().sort((a, b) => order[a.level] - order[b.level]);
	return `<ul class="jt12-check" aria-label="בדיקת החוזה מול החוק">${list.map((f) => `<li class="jt12-check__i jt12-check__i--${f.level}"><span class="jt12-check__m" aria-hidden="true">${LEVEL_MARK[f.level]}</span><span>${esc(f.he)}`
		+ (f.asked ? ` <span class="jt12-swap">ביקשתם: <s>${esc(f.asked)}</s> · בחוזה: <strong>${esc(f.lawful)}</strong></span>` : '') + '</span></li>').join('')}</ul>`;
}

export function renderResult(reg, r, opts = {}) {
	if (!r.ok) {
		return `<div class="jtool-verdict" data-jtool-live aria-live="polite"><p class="jtool-state jtool-state--danger">✕ צריך לתקן את הקלט</p>`
			+ `<p class="jtool-verdict__sentence">${r.errors.map((e) => esc(e.he)).join(' ')}</p></div>`;
	}
	return `<div class="jtool-verdict" data-jtool-live aria-live="polite" aria-atomic="true">`
		+ (r.bad ? `<p class="jtool-state jtool-state--danger">✕ ${r.bad === 1 ? 'דרישה אחת נגד החוק: תוקנה בחוזה' : `${r.bad} דרישות נגד החוק: תוקנו בחוזה`}</p>` : '<p class="jtool-state jtool-state--ok">✓ החוזה עומד בחוק השכירות ההוגנת</p>')
		+ `<p class="jtool-verdict__label">${opts.example ? 'דוגמה מחושבת: ' : ''}הערובה המרבית שמותר לבקש</p>`
		+ `<strong class="jtool-verdict__figure">${ils(r.cap.cap, 0)}</strong>`
		+ `<p class="jtool-verdict__sentence">${esc(verdictSentence(reg, r))}</p>`
		+ `<p class="jtool-scope">החוזה המלא למטה: ${r.clauses.length} סעיפים${r.guarantors ? ' ושני נספחים' : ' ונספח ציוד'}, כל סעיף עם הסעיף בחוק שעליו הוא נשען.</p></div>`
		+ meter(reg, r)
		+ checkList(r);
}

export function renderDetails(reg, r) {
	if (!r.ok) { return ''; }
	const rc = reg.rent_contract;
	let n = 0;
	const uid = () => { n += 1; return `${P}-c${n}`; };
	const doc = r.clauses.map((cl, i) => `<li class="jt12-cl"><div class="jt12-cl__head"><p class="jt12-cl__t"><span class="jt12-cl__n"><bdi>${i + 1}</bdi></span>${esc(cl.title)}</p><p class="jt12-cl__refs">${cl.cites.map((k) => citeChip(rc, k, uid())).join('')}</p></div>`
		+ cl.paras.map((p, j) => `<p class="jt12-cl__p">${cl.paras.length > 1 ? `<span class="jt12-cl__sub"><bdi>${i + 1}.${j + 1}</bdi></span>` : ''}${esc(p)}</p>`).join('') + '</li>').join('');
	const furniture = r.furniture ? r.furniture.split(/\n|,|;/).map((x) => x.trim()).filter(Boolean) : [];
	const appA = `<li class="jt12-cl jt12-cl--app"><div class="jt12-cl__head"><p class="jt12-cl__t">נספח א': הריהוט והאבזרים</p><p class="jt12-cl__refs">${citeChip(rc, '25ג', uid())}</p></div>`
		+ (furniture.length ? `<ol class="jt12-app">${furniture.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : '<p class="jt12-cl__p">מפרטים כאן כל פריט שנשאר בדירה, ובמסירה מסמנים את מצבו. השאירו שורות ריקות למילוי ביד.</p>') + '</li>';
	const appB = r.guarantors ? `<li class="jt12-cl jt12-cl--app"><div class="jt12-cl__head"><p class="jt12-cl__t">נספח ב': כתב ערבות</p><p class="jt12-cl__refs">${citeChip(rc, 'guarantee', uid())}</p></div>`
		+ `<p class="jt12-cl__p">${esc(`אנו החתומים מטה ערבים, יחד ולחוד, לקיום חיובי השוכר לפי חוזה השכירות לדירה ב${[r.names.address || '__________', r.names.city].filter(Boolean).join(', ')}, עד סכום של ${r.guarantorMax ? nis(r.guarantorMax) : '__________ ₪'}.`)}</p>`
		+ `<p class="jt12-cl__p">${Array.from({ length: r.guarantors }, (_, k) => `${k + 1}. שם: __________ ת"ז: __________ חתימה: __________`).map(esc).join('<br>')}</p></li>` : '';
	const sched = r.schedule.map((s) => `<li class="jt12-sch jt12-sch--${s.state}"><span>${esc(s.item)}</span><small>${{ filled: 'בחוזה', hand: 'למילוי ביד', ids: 'בחוזה; ת"ז ביד', list: 'בנספח א\'', declared: 'הצהרה: אין פגם ידוע' }[s.state]}</small></li>`).join('');
	return `<div class="jtool-tablewrap jt12-docwrap"><div class="jtool-tablewrap__head"><h3 id="${P}-doc-h">חוזה שכירות למגורים</h3><div class="jtool-actions"><button class="jtool-btn jtool-btn--primary" type="button" data-act="copy-contract">העתקת החוזה</button><button class="jtool-btn" type="button" data-act="copy-sources">העתקה עם הסעיפים בחוק</button><button class="jtool-btn" type="button" data-act="print">הדפסה</button></div></div>`
		+ `<p class="jt12-doc__note">${esc(rc.bill.he)}. לפי ${esc(rc.law_he)}, נוסח עדכני ל-${esc(isoToHe(rc.law_current_to))}. מעבר עם העכבר או נגיעה בסעיף מציגים את לשון החוק.</p>`
		+ `<ol class="jt12-doc" aria-labelledby="${P}-doc-h">${doc}${appA}${appB}</ol>`
		+ `<div class="jt12-sign"><span>המשכיר: __________</span><span>השוכר: __________</span></div></div>`
		+ `<div class="jtool-tablewrap"><div class="jtool-tablewrap__head"><h3 id="${P}-sch-h">מה החוק מחייב לכלול (התוספת השנייה)</h3></div><ul class="jt12-schlist" aria-labelledby="${P}-sch-h">${sched}</ul></div>`;
}

/** Page section: the cap for common rents and terms, from the same engine. */
export function capTable(reg) {
	const rc = reg.rent_contract;
	const rents = [3500, 4500, 6000, 8000, 12000];
	const terms = [6, 9, 12, 24];
	const rows = rents.map((rent) => `<tr><td data-th="שכר דירה לחודש">${ils(rent, 0)}</td>${terms.map((m) => `<td data-th="${m} חודשים">${ils(depositCap(rc, rent, m).cap, 0)}</td>`).join('')}</tr>`).join('');
	return `<div class="jtool-datawrap"><table class="jtool-datatable"><caption>כמה ערובה מותר לבקש לפי סעיף 25י(ב): הנמוך מבין שכר הדירה לשליש מהתקופה ושלושה חודשי שכירות</caption><thead><tr><th scope="col">שכר דירה לחודש</th>${terms.map((m) => `<th scope="col">${m} חודשים</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function snapshot(reg) {
	const r = compute(reg, EXAMPLE);
	const rc = reg.rent_contract;
	return {
		tool: TOOL_ID,
		registry_version: reg.registry_version,
		input: EXAMPLE,
		total: r.cap.cap,
		form: renderForm(reg, EXAMPLE),
		result: renderResult(reg, r, { example: true }),
		details: renderDetails(reg, r),
		method: `<ol><li>שליש מתקופת השכירות: ${money(r.rent, 0)} × ${r.months} ÷ 3 = ${money(r.cap.byTerm, 0)} ₪ <a class="jtool-cite" href="${esc(rc.law_url)}" target="_blank" rel="noopener">סעיף 25י(ב)(1)</a></li>`
			+ `<li>שלושה חודשי שכירות: ${money(r.rent, 0)} × ${rc.deposit.months} = ${money(r.cap.byMonths, 0)} ₪ <a class="jtool-cite" href="${esc(rc.law_url)}" target="_blank" rel="noopener">סעיף 25י(ב)(2)</a></li>`
			+ `<li>התקרה היא הנמוך מביניהם: ${money(r.cap.cap, 0)} ₪, לכל הערובות שעולות כסף לשוכר יחד.</li>`
			+ `<li>הערבות הבנקאית שבדוגמה, ${money(r.counted, 0)} ₪, בתוך התקרה, וחוזרת תוך ${rc.deposit.return_days} ימים מהחזרת הדירה <a class="jtool-cite" href="${esc(rc.law_url)}" target="_blank" rel="noopener">סעיף 25י(ה)</a></li></ol>`,
		compare_table: capTable(reg),
		sentence: verdictSentence(reg, r),
	};
}

/* ---------------- Browser ---------------- */

function readForm(root) {
	const val = (sel) => (root.querySelector(sel) || {}).value || '';
	const on = (name) => Boolean(root.querySelector(`input[name="${P}-${name}"]:checked`));
	const radio = (name, d) => (root.querySelector(`input[name="${P}-${name}"]:checked`) || {}).value || d;
	const m = (id) => { const v = val(`#${P}-${id}`).trim(); return v === '' ? '' : parseMoney(v); };
	const n = (id) => { const v = val(`#${P}-${id}`).trim().replace(/,/g, ''); return v === '' ? '' : Number(v); };
	const pays = {}; PAYS.forEach((k) => { pays[k] = on(`py-${k}`); });
	const forbidden = {}; FORBIDDEN.forEach((k) => { forbidden[k] = on(`fb-${k}`); });
	return {
		rent: m('rent'), months: n('months'), start: toIso(val(`#${P}-start`)), payDay: n('payDay'), method: radio('pm', 'transfer'), index: on('idx'),
		option: radio('op', 'none'), optionMonths: n('om'), optionPct: n('opct'), exit: radio('ex', 'none'), replacement: on('rep'),
		cash: m('cash'), bank: m('bank'), other: m('other'), note: m('note'), guarantors: Number(radio('gn', '0')), guarantorMax: m('gmax'),
		returnDays: n('ret'), repairDays: n('rd'), urgentDays: n('ud'), optTenantDays: n('otd'), optLandlordDays: n('old'), exitTenantDays: n('etd'), exitLandlordDays: n('eld'),
		pays, forbidden, asIs: on('asis'), parking: on('pk'), storage: on('st'), pets: radio('pet', 'ask'), smoking: on('smk'), relative: on('rel'),
		furniture: val(`#${P}-fur`), defects: val(`#${P}-def`), landlord: val(`#${P}-ll`), tenant: val(`#${P}-tn`), address: val(`#${P}-adr`), city: val(`#${P}-city`),
	};
}

const MT = { transfer: 't', checks: 'c', standing: 's' };
const OP = { none: 'n', tenant: 't', landlord: 'l', both: 'b' };
const bits = (obj, keys) => keys.map((k) => (obj[k] ? 1 : 0)).join('');
/** Only the terms go into the link; names, the address, furniture and defects never do. */
export const shareState = (i) => encodeState({
	r: i.rent || '', m: i.months === 12 ? '' : i.months, s: i.start || '', d: i.payDay === 1 ? '' : i.payDay, p: MT[i.method] || 't', i: i.index ? 1 : '',
	o: OP[i.option] || 'n', q: i.option !== 'none' ? i.optionMonths : '', u: i.option !== 'none' ? i.optionPct : '', e: OP[i.exit] || 'n', x: i.replacement === false ? 0 : '',
	c: i.cash || '', b: i.bank || '', g: i.other || '', h: i.note || '', k: i.guarantors || '', M: i.guarantorMax || '',
	y: i.returnDays, f: i.repairDays, z: i.urgentDays, A: i.optTenantDays, B: i.optLandlordDays, C: i.exitTenantDays, D: i.exitLandlordDays,
	P: bits(i.pays || {}, PAYS), F: bits(i.forbidden || {}, FORBIDDEN), a: i.asIs ? 1 : '', v: i.parking ? 1 : '', w: i.storage ? 1 : '', j: i.pets === 'yes' ? 'y' : i.pets === 'no' ? 'n' : '', n: i.smoking ? 1 : '', l: i.relative ? 1 : '',
});
const KEYS = ['r', 'm', 's', 'd', 'p', 'i', 'o', 'q', 'u', 'e', 'x', 'c', 'b', 'g', 'h', 'k', 'M', 'y', 'f', 'z', 'A', 'B', 'C', 'D', 'P', 'F', 'a', 'v', 'w', 'j', 'n', 'l'];
function inputOf(s) {
	if (!s.r) { return null; }
	const back = (map, v, d) => Object.keys(map).find((k) => map[k] === v) || d;
	const num = (v) => (v === undefined || v === '' ? '' : Number(v));
	const fromBits = (text, keys) => { const o = {}; keys.forEach((k, ix) => { o[k] = text ? text.charAt(ix) === '1' : true; }); return o; };
	return Object.assign({}, EXAMPLE, {
		rent: Number(s.r), months: s.m ? Number(s.m) : 12, start: s.s || '', payDay: s.d ? Number(s.d) : 1, method: back(MT, s.p, 'transfer'), index: s.i === '1',
		option: back(OP, s.o, 'none'), optionMonths: s.q ? Number(s.q) : 12, optionPct: s.u ? Number(s.u) : 0, exit: back(OP, s.e, 'none'), replacement: s.x !== '0',
		cash: num(s.c), bank: num(s.b), other: num(s.g), note: num(s.h), guarantors: s.k ? Number(s.k) : 0, guarantorMax: num(s.M),
		returnDays: num(s.y), repairDays: num(s.f), urgentDays: num(s.z), optTenantDays: num(s.A), optLandlordDays: num(s.B), exitTenantDays: num(s.C), exitLandlordDays: num(s.D),
		pays: fromBits(s.P, PAYS), forbidden: s.F ? fromBits(s.F, FORBIDDEN) : { insurance: false, broker: false, systems: false },
		asIs: s.a === '1', parking: s.v === '1', storage: s.w === '1', pets: s.j === 'y' ? 'yes' : s.j === 'n' ? 'no' : 'ask', smoking: s.n === '1', relative: s.l === '1',
		furniture: '', defects: '', landlord: '', tenant: '', address: '', city: '',
	});
}

export function mount(root, reg) {
	const form = root.querySelector('[data-jtool-form]');
	const result = root.querySelector('[data-jtool-result]');
	const details = root.querySelector('[data-jtool-details]');
	const sticky = root.querySelector('[data-jtool-sticky-figure]');
	const rc = reg.rent_contract;
	const today = ilToday();
	const saveKey = `jtool-${TOOL_ID}`;
	let started = false;
	let timer = null;
	track('tool_view', { tool_id: TOOL_ID });
	if (isStale(rc.checked_on, rc.refresh_every_days) || (rc.next_update && today >= rc.next_update)) {
		const stamp = root.querySelector('.jtool-stamp');
		if (stamp) { stamp.classList.add('jtool-stamp--stale'); stamp.insertAdjacentText('beforeend', ' · ייתכן שהחוק התעדכן'); }
	}
	const ids = { rent: 'rent', months: 'months', start: 'start', payDay: 'payDay', cash: 'cash', bank: 'bank', other: 'other', note: 'note', guarantorMax: 'gmax', returnDays: 'ret', repairDays: 'rd', urgentDays: 'ud', optTenantDays: 'otd', optLandlordDays: 'old', exitTenantDays: 'etd', exitLandlordDays: 'eld', optionMonths: 'om', optionPct: 'opct' };
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
		form.querySelectorAll('[data-if-option]').forEach((el) => { el.hidden = ((root.querySelector(`input[name="${P}-op"]:checked`) || {}).value || 'none') === 'none'; });
		form.querySelectorAll('[data-if-guarantors]').forEach((el) => { el.hidden = ((root.querySelector(`input[name="${P}-gn"]:checked`) || {}).value || '0') === '0'; });
	};
	const run = (input, opts = {}) => {
		const r = compute(reg, input);
		showErrors(r);
		result.innerHTML = renderResult(reg, r);
		details.innerHTML = renderDetails(reg, r);
		const capHint = form.querySelector('[data-jt12-cap]');
		if (capHint && r.ok) { capHint.textContent = `מזומן, ערבות בנקאית וערבות מחברת ביטוח: יחד עד ${nis(r.cap.cap)} (סעיף 25י(ב)).`; }
		if (sticky) { sticky.innerHTML = r.ok ? ils(r.cap.cap, 0) : '—'; }
		if (r.ok && !opts.silent) { track('tool_result', { tool_id: TOOL_ID, band: r.bad ? 'fixed' : 'clean' }); }
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
	if (store.get(saveKey) && !fromHash) { const nb = root.querySelector('[data-jtool-saved]'); if (nb) { nb.hidden = false; } }
	form.addEventListener('input', schedule);
	form.addEventListener('change', schedule);
	root.addEventListener('click', async (ev) => {
		const chipBtn = ev.target.closest('.jt12-cite');
		if (chipBtn) {
			const open = chipBtn.getAttribute('aria-expanded') === 'true';
			root.querySelectorAll('.jt12-cite[aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
			chipBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
			return;
		}
		const b = ev.target.closest('[data-act]');
		if (!b) { return; }
		const act = b.getAttribute('data-act');
		if (timer) { clearTimeout(timer); timer = null; run(readForm(root), { silent: true }); }
		const input = readForm(root);
		const r = compute(reg, input);
		const link = shareUrl(shareState(input));
		if (act === 'print') {
			track('tool_download', { tool_id: TOOL_ID, type: 'print' });
			window.print();
		} else if ((act === 'copy-contract' || act === 'copy-sources') && r.ok) {
			const ok = await copyText(contractText(rc, r, act === 'copy-sources'));
			toast(root, ok ? 'החוזה הועתק. הדביקו אותו במסמך, עברו עליו וחתמו.' : 'לא הצלחנו להעתיק.');
			track('tool_letter', { tool_id: TOOL_ID });
		} else if (act === 'link') {
			const ok = await copyText(link);
			toast(root, ok ? 'הקישור הועתק. אין בו שמות, כתובת או פרטים אישיים.' : link);
			track('tool_share', { tool_id: TOOL_ID, channel: 'link' });
		} else if (act === 'whatsapp' && r.ok) {
			window.open(whatsappUrl(`${verdictSentence(reg, r)} · נבדק ב-jus-tice.co.il מול חוק השכירות ${link}`), '_blank', 'noopener');
			track('tool_share', { tool_id: TOOL_ID, channel: 'whatsapp' });
		} else if (act === 'copy' && r.ok) {
			const ok = await copyText(`${verdictSentence(reg, r)} (jus-tice.co.il, ${isoToHe(rc.checked_on)})`);
			toast(root, ok ? 'התוצאה הועתקה.' : 'לא הצלחנו להעתיק.');
			track('tool_share', { tool_id: TOOL_ID, channel: 'copy' });
		} else if (act === 'rehearse') {
			track('tool_rehearse_click', { tool_id: TOOL_ID, band: r.ok && r.bad ? 'fixed' : 'clean' });
		} else if (act === 'save') {
			store.set(saveKey, shareState(input));
			toast(root, 'התנאים נשמרו במכשיר הזה בלבד, בלי שמות וכתובת. אפשר למחוק בכל רגע.');
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
	root.addEventListener('keydown', (ev) => {
		if (ev.key === 'Escape') { root.querySelectorAll('.jt12-cite[aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false')); }
	});
	stickyBar(root);
	root.setAttribute('data-jtool-ready', '1');
}
