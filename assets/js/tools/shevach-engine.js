/**
 * Wave 5 (HAD-504): capital gains tax (מס שבח) when an individual sells a home, and what is left from the sale.
 *
 * Dependency-free ES module. Every number comes from registry.shevach and the CBS index in registry.cpi:
 *  - Gain = sale value less the acquisition balance (price, the costs of buying and selling, improvements; s.47, s.39).
 *    The inflationary amount is the rise of that balance with the index "as last published before the day" (s.47),
 *    from each cost's own day; the real gain is the rest.
 *  - Periods (s.47, by days): the real gain up to 7.11.2001, from then to 31.12.2011, and after 1.1.2012. An individual
 *    pays the top rate of s.121 on the first (47% in 2026), up to 20% on the second and up to 25% on the third
 *    (s.48א(ב)(1), (ב1)); the inflationary amount that accrued up to 31.12.1993 is taxed at 10% (s.48א(ג)(1)).
 *  - A qualifying home bought before 1.1.2014 and sold taxable: the real gain up to 1.1.2014 is exempt and the rest is
 *    taxed at 25%, the inflationary amount at 0% (the "linear" rule, s.48א(ב2), (ג)(2)).
 *  - The only home, held 18 months, no exempt sale in the 18 months before: exempt (s.49ב(2)) up to the ceiling of
 *    s.49א(א1) (5,008,000 from 1.1.2025 to 31.12.2027); above it, the share of the price above the ceiling is taxed as
 *    a qualifying home.
 *  - Above 5,385,285 a taxable sale enters the surtax base (Ordinance s.121ב(ה)); flagged, not computed.
 *  - Declaration within 30 days (s.73(א)), payment within 60 (s.90א), an objection within 30 days of the assessment
 *    (s.87(א)), an appeal within 30 days of the decision (s.88); an end on a rest day moves to the next day.
 */

import { addDays, addMonths, parseDate, daysBetween, offRestDays } from './dates.js';

const r2 = (n) => Math.round(n * 100) / 100;
const blank = (v) => v === '' || v === undefined || v === null;
const heIso = (iso) => iso.split('-').reverse().map(Number).join('.');
export const STATUSES = ['single', 'qualified', 'other'];

/** The CBS index on one chained scale, and the month known on a day (published on the 15th, known from the 16th). */
export function chainCpi(cpi) {
	const bases = cpi.bases;
	const factorTo = new Map();
	let f = 1;
	for (let i = bases.length - 1; i >= 0; i--) {
		if (i < bases.length - 1) { f *= bases[i].to_next; }
		factorTo.set(bases[i].id, f);
	}
	const values = new Map(cpi.series.map(([k, v]) => [k, v]));
	const baseOf = (key) => (bases.find((b) => key >= b.from && key <= b.to) || bases[bases.length - 1]).id;
	const knownFrom = cpi.known_from_day || 16;
	const shift = (key, n) => {
		const [y, m] = key.split('-').map(Number);
		const t = y * 12 + (m - 1) + n;
		return `${Math.floor(t / 12)}-${String(t % 12 + 1).padStart(2, '0')}`;
	};
	return {
		first: cpi.series[0][0],
		latest: cpi.series[cpi.series.length - 1][0],
		has: (key) => values.has(key),
		chained: (key) => values.get(key) / factorTo.get(baseOf(key)),
		knownMonth(day) {
			const [y, m, d] = day.split('-').map(Number);
			return shift(`${y}-${String(m).padStart(2, '0')}`, d >= knownFrom ? -1 : -2);
		},
	};
}

function taxRegular(sv, realGain, shares, inflTaxable) {
	const rt = sv.rates;
	const parts = [
		{ key: 'pre2001', share: shares.pre2001, rate: rt.pre2001 },
		{ key: 'mid', share: shares.mid, rate: rt.mid },
		{ key: 'post2012', share: shares.post2012, rate: rt.post2012 },
	].filter((p) => p.share > 0).map((p) => Object.assign(p, { gain: r2(realGain * p.share), tax: r2(realGain * p.share * p.rate / 100) }));
	if (inflTaxable > 0) { parts.push({ key: 'inflation', share: null, rate: rt.inflation, gain: r2(inflTaxable), tax: r2(inflTaxable * rt.inflation / 100) }); }
	return { parts, tax: r2(parts.reduce((a, p) => a + p.tax, 0)) };
}

function taxLinear(sv, realGain, shares) {
	const rt = sv.rates;
	const parts = [
		{ key: 'exempt', share: shares.linear, rate: 0, gain: r2(realGain * shares.linear), tax: 0 },
		{ key: 'post2014', share: 1 - shares.linear, rate: rt.post2012, gain: r2(realGain * (1 - shares.linear)), tax: r2(realGain * (1 - shares.linear) * rt.post2012 / 100) },
	];
	return { parts, tax: parts[1].tax };
}

/**
 * input = { status ('single'|'qualified'|'other'), buyDate, buyPrice, buyCosts, improve, improveDate, saleDate, salePrice,
 *           saleCosts, mortgage, priorExempt (an exempt single-home sale in the 18 months before), rented, residential
 *           (confirmed mainly residential use, s.49(א); default true), offPlan (bought
 *           before it was built), dwellingDate (the day it became a dwelling), gift (received as a gift, s.49ו),
 *           giftLived + livedFrom (lived in it permanently as owner, from that day), giftMinor (received before 18) }
 */
export function compute(registry, input) {
	const sv = registry.shevach;
	const cpi = chainCpi(registry.cpi);
	const errors = [];
	const status = STATUSES.includes(input.status) ? input.status : 'single';
	const buyDate = parseDate(input.buyDate);
	const saleDate = parseDate(input.saleDate);
	const amt = (k) => (blank(input[k]) ? 0 : Number(input[k]));
	const buyPrice = Number(input.buyPrice);
	const salePrice = Number(input.salePrice);
	const buyCosts = amt('buyCosts');
	const improve = amt('improve');
	const saleCosts = amt('saleCosts');
	const mortgage = amt('mortgage');
	if (!buyDate) { errors.push({ field: 'buyDate', he: 'יום הרכישה: תאריך מלא, לדוגמה 1.6.2010' }); }
	if (!saleDate) { errors.push({ field: 'saleDate', he: 'יום המכירה: תאריך מלא' }); }
	if (buyDate && saleDate && saleDate <= buyDate) { errors.push({ field: 'saleDate', he: 'יום המכירה אחרי יום הרכישה' }); }
	// Only sales inside the period the registry's amounts hold for (the exemption ceiling of instruction 1/2026): a sale
	// outside it would use another year's ceiling and rates (review, PR 128).
	if (saleDate && (saleDate < sv.sale_from || saleDate > sv.sale_to)) { errors.push({ field: 'saleDate', he: `המחשבון מחשב מכירות מ-${sv.sale_from.split('-').reverse().map(Number).join('.')} עד ${sv.sale_to.split('-').reverse().map(Number).join('.')}, לפי הסכומים שבתוקף בהן. למכירה בתאריך אחר השתמשו בסימולטור של רשות המסים.` }); }
	// s.49ב(2) counts 18 months from the day the home became a dwelling: for a home bought before it was built, that day.
	const offPlan = status === 'single' && Boolean(input.offPlan);
	const dwellingDate = offPlan ? parseDate(input.dwellingDate) : null;
	if (offPlan && !dwellingDate) { errors.push({ field: 'dwellingDate', he: 'דירה שנקנתה לפני שנבנתה: מתי היא נמסרה לכם ונעשתה לדירת מגורים (טופס 4 או המסירה)' }); }
	if (offPlan && dwellingDate && buyDate && saleDate && (dwellingDate < buyDate || dwellingDate > saleDate)) { errors.push({ field: 'dwellingDate', he: 'יום המסירה בין יום הרכישה ליום המכירה' }); }
	if (buyDate && cpi.knownMonth(buyDate) < cpi.first) { errors.push({ field: 'buyDate', he: 'רכישה לפני 16.3.1990: המחשבון לא מחזיק מדד ישן יותר. לרכישה כזאת השתמשו בסימולטור של רשות המסים.' }); }
	if (!(buyPrice > 0 && buyPrice < 1e10)) { errors.push({ field: 'buyPrice', he: 'מחיר הרכישה: מספר חיובי' }); }
	if (!(salePrice > 0 && salePrice < 1e10)) { errors.push({ field: 'salePrice', he: 'מחיר המכירה: מספר חיובי' }); }
	for (const k of ['buyCosts', 'improve', 'saleCosts', 'mortgage']) {
		const v = amt(k);
		if (!(Number.isFinite(v) && v >= 0 && v < 1e10)) { errors.push({ field: k, he: 'סכום: מספר חיובי או ריק' }); }
	}
	const improveDate = improve > 0 ? parseDate(input.improveDate) : null;
	// A gift (s.49ו): the single-home exemption waits for a cooling period. Received before 18, the count starts at 18
	// (s.49ו(ב)): the tool does not hold the birth date, so that case goes to the simulator (review, PR 128).
	const gift = status === 'single' && Boolean(input.gift);
	const giftLived = gift && Boolean(input.giftLived);
	const livedFrom = giftLived ? parseDate(input.livedFrom) : null;
	if (gift && input.giftMinor) { errors.push({ field: 'gift', he: `דירה שקיבלתם במתנה לפני גיל ${sv.gift.adult_age}: תקופת הצינון נספרת מהיום שמלאו לכם ${sv.gift.adult_age} (סעיף 49ו(ב)). את המקרה הזה המחשבון לא מחשב; השתמשו בסימולטור של רשות המסים.` }); }
	if (giftLived && !livedFrom) { errors.push({ field: 'livedFrom', he: 'מתי התחלתם לגור בדירה דרך קבע: תאריך מלא' }); }
	if (giftLived && livedFrom && saleDate && livedFrom > saleDate) { errors.push({ field: 'livedFrom', he: 'תחילת המגורים לפני יום המכירה' }); }
	if (improve > 0 && !improveDate) { errors.push({ field: 'improveDate', he: 'מתי שופצה הדירה: תאריך מלא' }); }
	if (improve > 0 && improveDate && buyDate && saleDate && (improveDate < buyDate || improveDate > saleDate)) { errors.push({ field: 'improveDate', he: 'השיפוץ בין יום הרכישה ליום המכירה' }); }
	if (errors.length) { return { ok: false, errors }; }

	const flags = [];
	const add = (level, code, he, section) => flags.push({ level, code, he, section: section || '' });
	// The index known on each day (s.47); a sale after the last index in the registry uses the last one, flagged.
	const known = (day) => { const k = cpi.knownMonth(day); return k > cpi.latest ? cpi.latest : k; };
	const kSale = known(saleDate);
	if (cpi.knownMonth(saleDate) > cpi.latest) { add('warn', 'index_ahead', `המדד הידוע ביום המכירה עוד לא פורסם: החישוב לפי המדד האחרון שפורסם (${Number(cpi.latest.slice(5))}.${cpi.latest.slice(0, 4)}). השומה תהיה לפי המדד שיהיה ידוע ביום המכירה.`, 'סעיף 47'); }
	const kBuy = known(buyDate);
	const ratio = (k) => cpi.chained(kSale) / cpi.chained(k);
	const acq = buyPrice + buyCosts;
	const balance = r2(acq + improve + saleCosts);
	const gain = r2(salePrice - balance);
	const adjusted = r2(acq * ratio(kBuy) + (improve ? improve * ratio(known(improveDate)) : 0) + saleCosts);
	const inflationary = gain > 0 ? Math.min(Math.max(r2(adjusted - balance), 0), gain) : 0;
	const realGain = gain > 0 ? r2(gain - inflationary) : 0;
	// The inflationary amount that accrued up to 31.12.1993 (taxable, s.47 "סכום אינפלציוני חייב").
	let inflTaxable = 0;
	if (gain > 0 && buyDate <= sv.dates.inflation_end) {
		const k93 = known(sv.dates.inflation_end);
		const r93 = (k) => cpi.chained(k93) / cpi.chained(k) - 1;
		let v = acq * r93(kBuy);
		if (improve && improveDate <= sv.dates.inflation_end) { v += improve * r93(known(improveDate)); }
		inflTaxable = Math.min(r2(Math.max(v, 0)), inflationary);
	}
	// Periods by days (s.47).
	const P = daysBetween(buyDate, saleDate);
	const d = sv.dates;
	const pre2001 = buyDate < d.start ? Math.min(daysBetween(buyDate, d.start), P) / P : 0;
	const mid = buyDate < d.change ? Math.max(0, Math.min(daysBetween(buyDate > d.start ? buyDate : d.start, d.change), P)) / P : 0;
	const linear = buyDate < d.transition ? Math.min(daysBetween(buyDate, d.transition), P) / P : 0;
	const shares = { pre2001, mid, post2012: Math.max(0, 1 - pre2001 - mid), linear, days: P };

	const regular = taxRegular(sv, realGain, shares, inflTaxable);
	const lin = buyDate < d.transition ? taxLinear(sv, realGain, shares) : null;
	const held = (dwellingDate || buyDate) <= addMonths(saleDate, -sv.single.hold_months);
	// Both reliefs need a qualifying dwelling (s.49(א): mainly residential use in 4/5 of the period or the last 4 years;
	// empty counts). The person confirms it; without it the sale is taxed as any other right (review, PR 128).
	const residential = status !== 'other' && input.residential !== false;
	if (status !== 'other' && !residential) { add('bad', 'not_residential', 'הדירה לא שימשה בעיקר למגורים: אין פטור לדירה יחידה ואין חישוב לינארי (סעיף 49(א)). החישוב הרגיל.', 'סעיף 49(א)'); }
	// The gift's cooling period runs from the day the seller became the owner (4 years), or from the day the owner began
	// to live there permanently (3 years); living there before the gift counts from the gift (s.49ו(א)).
	const coolFrom = gift ? (giftLived && livedFrom > buyDate ? livedFrom : buyDate) : null;
	const coolEnd = gift ? addMonths(coolFrom, giftLived ? sv.gift.lived_months : sv.gift.other_months) : null;
	const giftOk = !gift || saleDate >= coolEnd;
	const singleOk = status === 'single' && residential && held && !input.priorExempt && giftOk;
	let path = !residential ? 'regular' : (lin ? 'linear' : 'regular');
	let tax = path === 'linear' ? lin.tax : regular.tax;
	let exemptShare = 0;
	if (status === 'single') {
		if (residential && !held) { add('bad', 'held', `הדירה בבעלותכם פחות מ-${sv.single.hold_months} חודשים מאז שהיתה לדירת מגורים: אין פטור לדירה יחידה (${sv.single.section}). החישוב כדירת מגורים חייבת.`, sv.single.section); }
		if (residential && !giftOk) { add('bad', 'gift_cooling', `קיבלתם את הדירה במתנה: הפטור לדירה יחידה ניתן רק ${giftLived ? `${sv.gift.lived_months / 12} שנים מהיום שהתחלתם לגור בה דרך קבע כבעלים` : `${sv.gift.other_months / 12} שנים מהיום שקיבלתם אותה`}, כלומר במכירה מ-${heIso(coolEnd)} (סעיף 49ו(א)(${giftLived ? 2 : 1})). עד אז החישוב כדירת מגורים חייבת.`, sv.gift.section); }
		if (residential && gift && giftOk) { add('ok', 'gift_cooled', `דירה שהתקבלה במתנה: תקופת הצינון הסתיימה (${heIso(coolEnd)}), והפטור אפשרי (סעיף 49ו(א)).`, sv.gift.section); }
		if (residential && input.priorExempt) { add('bad', 'prior', `מכרתם דירה אחרת בפטור כזה ב-${sv.single.gap_months} החודשים שלפני: אין פטור נוסף (${sv.single.section}). החישוב כדירת מגורים חייבת.`, sv.single.section); }
	}
	if (singleOk) {
		if (salePrice <= sv.single.ceiling) {
			path = 'exempt'; tax = 0; exemptShare = 1;
		} else {
			exemptShare = sv.single.ceiling / salePrice;
			path = 'partial';
			tax = r2(tax * (1 - exemptShare));
			add('warn', 'ceiling', `מחיר המכירה מעל תקרת הפטור (${sv.single.ceiling.toLocaleString('en-US')} ₪): החלק היחסי של השבח שמעל התקרה (${(100 - exemptShare * 100).toFixed(1)}%) חייב במס כדירת מגורים מזכה (${sv.single.ceiling_section}).`, sv.single.ceiling_section);
		}
	}
	if (gain <= 0) { path = 'loss'; tax = 0; add('info', 'loss', 'אין שבח: מחיר המכירה לא עולה על מחיר הרכישה וההוצאות, ולכן אין מס שבח. את ההצהרה מגישים בכל מקרה (סעיף 73).', 'סעיף 47'); }
	if (tax > 0 && salePrice > sv.surtax.threshold) { add('warn', 'surtax', `מכירה חייבת במס של דירה ביותר מ-${sv.surtax.threshold.toLocaleString('en-US')} ₪: השבח הריאלי נכנס להכנסה החייבת במס יסף (${sv.surtax.section}): ${sv.surtax.rate}% על ההכנסה שמעל ${sv.surtax.income_threshold.toLocaleString('en-US')} ₪ בשנה, ועוד ${sv.surtax.capital_rate}% על הכנסה ממקורות הוניים. המחשבון לא מחשב את מס היסף.`, sv.surtax.section); }
	if (path === 'regular' && shares.pre2001 > 0 && realGain > 0) { add('info', 'marginal', `על החלק שעד 7.11.2001 חל השיעור הגבוה בסעיף 121 (${sv.rates.pre2001}%), ועל החלק עד 31.12.2011 עד ${sv.rates.mid}%. מוכר שהכנסתו נמוכה יכול לבקש שיעור נמוך יותר (סעיף 48א(ב)(2)).`, 'סעיף 48א(ב1)'); }
	if (input.rented) { add('info', 'depreciation', `${sv.depreciation_he}.`, 'סעיף 47'); }

	const net = r2(salePrice - tax - saleCosts - mortgage);
	const rest = (iso) => offRestDays(iso, sv.independence_days);
	const dl = sv.deadlines;
	const deadlines = [
		{ key: 'declare', date: rest(addDays(saleDate, dl.declare_days)), he: `הצהרה למיסוי מקרקעין (מוכר וקונה), ${dl.declare_days} ימים מיום המכירה`, section: dl.declare_section },
		{ key: 'pay', date: rest(addDays(saleDate, dl.pay_days)), he: `תשלום המס לפי השומה העצמית, ${dl.pay_days} ימים מיום המכירה`, section: dl.pay_section },
	];
	const scen = {
		exempt: singleOk && gain > 0 ? tax : null,
		linear: lin && residential ? lin.tax : null,
		regular: regular.tax,
	};
	return {
		ok: true, status, path, buyDate, saleDate, buyPrice, salePrice, buyCosts, improve, improveDate, saleCosts, mortgage,
		balance, gain, adjusted, inflationary, realGain, inflTaxable, shares, regular, linear: lin, exemptShare, held, singleOk,
		tax, net, effective: gain > 0 ? tax / gain : 0, deadlines, flags, kBuy, kSale, scen,
	};
}
