/**
 * Betterment levy: how much, when, and how to contest it (wave 3, HAD-498).
 *
 * Dependency-free ES module. Every rule comes from registry.betterment: the Third Schedule to the Planning
 * and Building Law (התוספת השלישית לחוק התכנון והבניה, התשכ"ה-1965), read in the consolidated text:
 *  - s.3: the levy is half the betterment; s.3א(א): a quarter in an urban-renewal (pinui-binui) plan for
 *    housing, unless the local authority set half, a quarter or none for the area (s.3א(ב)).
 *  - s.19(ב)(9): no levy on a protected space (mamad) within the area the civil-defence law sets;
 *    s.19(ב)(10)(א): no levy on a TAMA 38 permit, but a quarter on the part beyond 2.5 extended typical floors;
 *    s.19(ב)(10א)(א): a quarter in a seismic-resilience plan.
 *  - s.7(א): paid no later than the realisation (a permit, a sale, a use); s.7(ב): partial realisation pays pro
 *    rata; s.11(א): co-owners pay by their shares.
 *  - s.19(ג)(1): building or extending a home for the holder or a relative is not a realisation if the home
 *    is no more than 140 m2 after it; above that, the levy is paid pro rata on the extra area.
 *    s.19(ג)(2): selling such a home is not a realisation after 4 years of living in it.
 *  - s.14(א): appeal to the appeals committee within 45 days of the assessment; s.14(ב): a decisive appraiser
 *    on the amount only, within the same days, and his decision appealable within 45 days; s.14(ב1): an
 *    assessment of up to 90,000 NIS can first be sent back to the committee with an appraiser's opinion.
 */

const DAY = 86400000;
const ms = (iso) => Date.parse(`${iso}T00:00:00Z`);
const isoOf = (t) => new Date(t).toISOString().slice(0, 10);
export function addDays(iso, n) { return isoOf(ms(iso) + n * DAY); }
export function parseDate(text) {
	const raw = String(text || '').trim();
	let m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	let y; let mo; let d;
	if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; } else {
		m = raw.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
		if (!m) { return null; }
		d = +m[1]; mo = +m[2]; y = +m[3];
		if (y < 100) { y += 2000; }
	}
	const t = Date.UTC(y, mo - 1, d);
	const back = new Date(t);
	if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) { return null; }
	return isoOf(t);
}

export const PLANS = ['regular', 'pinui', 'seismic', 'tama38', 'mamad'];
export const EVENTS = ['sale', 'permit', 'use'];
const r2 = (n) => Math.round(n * 100) / 100;

/**
 * Mode "estimate" ({ mode: 'estimate', betterment, share, plan, event, ownHome, areaAfter, areaBefore, tamaBeyond })
 *   betterment: the rise in value from the plan (the appraiser's "after" minus "before"), in NIS.
 *   tamaBeyond: TAMA 38 only, the part of the betterment that comes from area beyond 2.5 extended floors.
 * Mode "assessment" ({ mode: 'assessment', levy, received, mine, kind: 'plan'|'schedule' })
 *   levy: the levy in the committee's assessment; received: the day it reached you; mine: your appraiser's levy.
 */
export function compute(registry, input) {
	const b = registry.betterment;
	const errors = [];
	const flags = [];
	if (input.mode === 'assessment') {
		const levy = Number(input.levy);
		const received = parseDate(input.received);
		const mine = input.mine === '' || input.mine === undefined || input.mine === null ? null : Number(input.mine);
		if (!(levy > 0 && levy < 1e10)) { errors.push({ field: 'levy', he: 'סכום ההיטל בשומה צריך להיות גדול מ-0' }); }
		if (!received) { errors.push({ field: 'received', he: 'מתי קיבלתם את השומה? לדוגמה: 1.10.2026' }); }
		if (mine !== null && !(mine >= 0 && mine < 1e10)) { errors.push({ field: 'mine', he: 'ההיטל לפי השמאי שלכם: מספר 0 או יותר' }); }
		if (errors.length) { return { ok: false, errors }; }
		const schedule = input.kind === 'schedule';
		const appealBy = schedule ? addYearsIso(received, b.schedule_appeal_years) : addDays(received, b.appeal_days);
		const recheck = levy <= b.recheck_max;
		const saving = mine === null ? null : r2(Math.max(0, levy - mine));
		const routes = [];
		if (recheck && !schedule) { routes.push({ code: 'recheck', by: appealBy, section: b.recheck_section }); }
		routes.push({ code: 'appraiser', by: appealBy, section: b.appraiser_section });
		routes.push({ code: 'appeal', by: appealBy, section: b.appeal_section });
		if (mine !== null && mine > levy) { flags.push({ code: 'mine_higher', he: 'ההיטל לפי השמאי שלכם גבוה מזה שבשומה. אין כאן מה להשיג על הסכום.' }); }
		return { ok: true, mode: 'assessment', levy: r2(levy), received, mine, saving, appealBy, schedule, recheck, routes, flags };
	}

	const betterment = Number(input.betterment);
	const share = input.share === '' || input.share === undefined || input.share === null ? 100 : Number(input.share);
	const plan = PLANS.includes(input.plan) ? input.plan : 'regular';
	const event = EVENTS.includes(input.event) ? input.event : 'sale';
	if (!(betterment > 0 && betterment < 1e11)) { errors.push({ field: 'betterment', he: 'ההשבחה (עליית השווי) צריכה להיות גדולה מ-0' }); }
	if (!(share > 0 && share <= 100)) { errors.push({ field: 'share', he: 'החלק שלכם בנכס: יותר מ-0 ועד 100 אחוז' }); }
	const areaAfter = input.areaAfter === '' || input.areaAfter === undefined || input.areaAfter === null ? null : Number(input.areaAfter);
	const areaBefore = input.areaBefore === '' || input.areaBefore === undefined || input.areaBefore === null ? 0 : Number(input.areaBefore);
	const ownHome = Boolean(input.ownHome) && event === 'permit';
	if (ownHome && !(areaAfter > 0 && areaAfter < 10000)) { errors.push({ field: 'areaAfter', he: 'שטח הדירה אחרי הבנייה, במ"ר' }); }
	if (ownHome && !(areaBefore >= 0 && areaBefore < areaAfter)) { errors.push({ field: 'areaBefore', he: 'שטח הדירה לפני הבנייה צריך להיות קטן מהשטח אחריה' }); }
	const tamaBeyond = input.tamaBeyond === '' || input.tamaBeyond === undefined || input.tamaBeyond === null ? 0 : Number(input.tamaBeyond);
	if (plan === 'tama38' && !(tamaBeyond >= 0 && tamaBeyond <= betterment)) { errors.push({ field: 'tamaBeyond', he: 'החלק שמעבר ל-2.5 קומות לא יכול לעלות על כל ההשבחה' }); }
	if (errors.length) { return { ok: false, errors }; }

	const yours = r2(betterment * share / 100);
	const R = b.rates[plan];
	let levyFull;
	const lines = [];
	if (share < 100) { lines.push({ code: 'share', he: `החלק שלכם: ${share}% מההשבחה`, section: b.partners_section, value: yours }); }
	if (plan === 'tama38') {
		const beyond = r2(tamaBeyond * share / 100);
		levyFull = r2(beyond * R.beyond_rate[0] / R.beyond_rate[1]);
		lines.push({ code: 'tama', he: 'היתר לפי תמ"א 38: פטור, חוץ מרבע ההשבחה שמקורה בשטח שמעבר ל-2.5 קומות טיפוסיות מורחבות', section: R.section, value: levyFull });
	} else {
		levyFull = r2(yours * R.rate[0] / R.rate[1]);
		lines.push({ code: 'rate', he: `שיעור ההיטל: ${R.rate[0] === 0 ? 'פטור' : `${R.rate[0]}/${R.rate[1]} מההשבחה`}`, section: R.section, value: levyFull });
	}
	if (plan === 'pinui') { flags.push({ code: 'pinui_local', he: R.local_he }); }

	// The home-for-the-family deferral (s.19(ג)(1)): up to 140 m2 after the work, no payment at the permit.
	let deferred = 0;
	let due = levyFull;
	if (ownHome) {
		const added = areaAfter - areaBefore;
		const over = Math.max(0, areaAfter - b.residence_max_sqm);
		const payShare = added > 0 ? Math.min(1, over / added) : 0;
		due = r2(levyFull * payShare);
		deferred = r2(levyFull - due);
		lines.push({ code: 'home', he: over > 0 ? `הדירה תהיה ${areaAfter} מ"ר, ${over} מ"ר מעל ${b.residence_max_sqm}: משלמים עכשיו רק על החלק היחסי שמעל (${Math.round(payShare * 1000) / 10}% מהתוספת)` : `הדירה תהיה ${areaAfter} מ"ר, לא יותר מ-${b.residence_max_sqm}: הבנייה למגורים שלכם או של קרוב לא נחשבת מימוש, ולא משלמים עכשיו`, section: b.residence_section, value: due });
		flags.push({ code: 'home_later', he: `הפטור הזה דוחה את התשלום, ולא מוחק אותו: מכירה בתוך ${b.residence_sale_years} שנים מגמר הבנייה עלולה להיחשב מימוש (${b.residence_sale_section}).` });
	}
	const timing = { sale: 'במכירה, לפני רישום ההעברה', permit: 'כשמקבלים את היתר הבנייה', use: 'כשמתחילים את השימוש שההקלה או השימוש החורג מתירים' }[event];
	return {
		ok: true, mode: 'estimate', betterment: r2(betterment), share, yours, plan, event, levy: levyFull, due, deferred, lines, flags, timing,
		rate: plan === 'tama38' ? R.beyond_rate : R.rate,
	};
}

function addYearsIso(iso, n) {
	const [y, m, d] = iso.split('-').map(Number);
	const last = new Date(Date.UTC(y + n, m, 0)).getUTCDate();
	return `${String(y + n).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(Math.min(d, last)).padStart(2, '0')}`;
}
