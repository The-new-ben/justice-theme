# MASTER EXECUTION QUEUE — jus-tice.co.il
28-day GSC window ending 2026-07-19. Built from 10-miner sweep + adversarial verdicts. REJECTs dropped, MODIFY plans applied over originals, cross-miner duplicates resolved (ledger below).

## Dropped (REJECT)
1. **919/15 explainer merge** (mezonot family) — both pages are raw court documents (Supreme Court full text + implementing family-court ruling). Never merge rulings. Optional zero-risk hygiene: retitle /custody-alimony-ruling-new-919-15/ to its real case numbers (logged in Tier 4).
2. **Causing-death-in-road-accidents merge** (labor-traffic) — both "articles" are source documents (State-Attorney Guideline 2.1 full text + full sentencing verdict ת"פ 35549-06-20). Merge would destroy source docs. Replaced by a new-page item (Tier 3 G-7), both docs stay reference_keep with prominent links.

## Cross-miner conflict ledger (de-dup decisions)
- **/family-law-lawyer-divorce-wills-law-recommendations/** — claimed by two verdicts for different winners. Resolved: transplant its how-to-choose + first-meeting sections, 301 → **/divorce-lawyer/** (content is a divorce-firm chooser; family-verdict wins over inheritance-verdict).
- **Criminal fee winner** — /criminal-law-price-list-.../ (2 miners) beats strike-zone's /how-much-will-.../ pick. The pos-7.8 page merges IN (its pos 6-8 queries ride the 301).
- **Teudat yosher** — merge /criminal-record-check/ (2 miners) beats query-sweep's spoke_keep; its unique sections (מה מופיע, התיישנות ומחיקה, השלכות) + a dedicated בדיקת-רישום-לפי-ת"ז H2 must be carried.
- **DUI winner** — /driving-under-influence/ (combined 2026 pillar, best positions, verified deepest alcohol content) per criminal-family CONFIRM; overrides labor-traffic MODIFY and resolves query-sweep's third-cannibal flag. All three others 301 in.
- **Drug-lawyer winner** — /drug-offenses-criminal-lawyer/ (914 imp @13.3 page-level, 4 clicks) per criminal family; overrides money-gaps' impression-holder pick.
- **Rental info winner** — /rental-agreement/ (2 miners) over query-sweep's merge-into-template; /online-rent-agreement/ stays the transactional winner.
- **רישום מכר** — differentiate (query-sweep MODIFY) over merge: /registration-of-real-estate-israel/ is a nav-linked institution page; retitle to institution-only, monitor, merge only if split persists.
- **Abroad cluster** — /buying-property-abroad-guide/ stays spoke (process hub, verified distinct); /apartment/ 301s into IT, not the winner. rental-2025 refocused to rental-yield spoke (not 301'd yet).
- **Extradition /criminal-procedure-article-8066/** — transplant+301 (criminal verdict verified it is a doctrinal article, not a law text) over query-sweep's reference-retitle.
- **Breathalyzer** — safe alternative adopted: winner /yanshuf-breathalyzer-test/ (pos 8.1), 301 the machine-translated BAC page in. Protects the only top-10 ranking in the cluster.
- **Business license** — winner inverted to /business-license/ (beats the "winner" on every lawyer query; other page is a 1-paragraph stub).

Machinery conventions: all page 301s via the redirect snippet map (snippets channel, PUT+curl — nginx blocks POST); uploads-file redirects/noindex via nginx-level rules (WP redirects don't fire on /wp-content/uploads/); titles/meta via Yoast-meta snippet; content edits via bridge snippet 240.

---

## TIER 1 — CONSOLIDATIONS (100+ imp head terms), ranked by impressions × feasibility

### #1 [consolidate] Real-estate fee cluster — ~4,264 page-imp
- **Winner:** /real-estate-lawyer-cost-2025/ (2,868 imp). **301:** /lawyer-price-list-real-estate-2025/ (1,396 imp, transplant its full מחירון table first — incl. יד-2 0.5%, מקבלן 0.25-0.5% rows), /lawyer-real-estate-costs-2025/ (0 imp, bare 301).
- **GSC:** "עלות עורך דין קניית דירה" 158 imp split 63@43/62@70; "עורך דין מכירת דירה מחיר" 187 split 74@32/57@80; "שכר טרחת עורך דין קניית דירה" 143; "יד שניה" 117 — every fee query a coin-flip.
- **Execute:** retitle winner H1 to "שכר טרחת עורך דין בקנייה ומכירת דירה: מחירון נדל"ן מלא" (kills the sell-side hire leak); transplant table; 2×301 via redirect map; cross-link with /lawyer-for-buying-or-selling-a-house/. Transplant: **yes**. FAQ schema: **yes** ("מתי משלמים" — 313-imp query).

### #2 [consolidate] Divorce cost cluster — ~2,018 imp
- **Winner:** /divorce-costs-2025/ (1,601 imp @32.5, wins every cost query). **301:** /divorce-lawyer-cost/ (417 imp @75.1) after transplanting its scenario price table (הסכמה 5-25K / מחלוקות 12-60K / סכסוך 25-200K).
- **GSC:** "כמה עולה עורך דין גירושין" 269 split 106@36/80@56/79@84; "עורך דין גירושין מחיר" 145 split 83@25/54@73; "שכר טרחה עו"ד גירושין" 231 across 4 pages.
- **Execute:** transplant table → 301 → add "עלות גירושין בהסכמה" H2 (52 imp) → anchor-links from /divorce-lawyer/ + /lawyer-fees-guide/. PHASED: do NOT gut /lawyer-fee-outlook/'s divorce section (holds best pos 34 on the 231-imp family) until winner outranks it in next window. Transplant: yes. FAQ schema: yes.

### #3 [consolidate] Inheritance hire-intent trio — 1,911 imp
- **Winner:** /inheritance-lawyer/ (sitewide nav/breadcrumb/mega-menu pillar, best pos 47.8 — MODIFY inverted the original direction; zero template rewiring needed). **301:** /lawyer-wills-inheritances/ (1,406 imp @62-90, transplant best of its 8,800 words — prune hard), /inheritance-lawyer-guide/ (0 imp, transplant services+price table: צוואה 1-3K, צו ירושה 3-8K, התנגדות 15-80K).
- **GSC:** "עורך דין צוואות וירושות" 339@68.7; "עורך דין צוואות" 286@81.7; "עורך דין ירושה" 275@47.8 — both phrasings, one hire intent, 0 clicks.
- **Execute:** rewrite winner around both heads, keep curated-links hub block as section, transplant, 2×301. Transplant: **yes**. FAQ schema: **yes** (מחירון עורכי דין צוואה 10 imp).

### #4 [consolidate] תעודת יושר block — ~1,500 imp at pos 20-35
- **Winner:** /apply-for-police-criminal-information-certificates/. **301:** /criminal-record-check/ (610 imp @46.7, loses every issuance query).
- **GSC:** ~25 split queries: הנפקת תעודת יושר 108 (106@22 vs 2@46); איך מוציאים 99 (98@26); מהמשטרה 75 (43@31/32@46); בקשה לתעודת מידע פלילי 68@10.9.
- **Execute:** transplant record-check's unique sections (מה מופיע ברישום, התיישנות ומחיקה, השלכות) + dedicated H2s: "בדיקת רישום פלילי לפי תעודת זהות" (54 imp) and "תעודת יושר לשגרירות/אפוסטיל" (59@13.7) → 301. DO NOT touch /petition-approval-debt-arrangement-creditors/ (בקשת בגיר form, pos 8-12, 14 clicks — separate CTR item S-5). Transplant: yes. FAQ schema: yes.

### #5 [consolidate] Criminal fee cluster (defend the #3) — ~1,728 imp
- **Winner:** /criminal-law-price-list-lawyer-recommended-review-costs/ (1,058 imp, 23 clicks, pos 2.8 on "עורך דין פלילי מחירון" 68 imp). **301:** /criminal-lawyer-cost/ (104 imp — transplant its 2026 tables/payment-structures/FAQ; drop the stale 2021 public-defender table), Hebrew slug /עלות-עורך-דין-פלילי.../ (267 imp — already canonicals to winner; transplant its traffic-fee rows into a new anchored H2 "עלות עורך דין תעבורה"), /how-much-will-a-criminal-defense-lawyer-cost/ (299 imp @42.9; its pos 6-8 queries ride the 301).
- **GSC:** "עורך דין פלילי מחירון" 111 imp on 5 pages; "עורך דין פלילי שכר" 116 on 7.
- **Execute:** 3 transplant-merges (NOT bare 301s), add מחיקת-רישום pricing block (154-imp query) linking /police-records-data-deletion/. Keep salary spoke /criminal-law-lawyer-criminal-israel/ untouched. Transplant: yes. FAQ schema: yes.

### #6 [consolidate] מזונות ילדים pillar — ~2,600 page-imp
- **Winner:** /child-support/ (2,386 imp @64; already absorbs calculator-2023 301). **301:** /child-support-guide/ (248 imp @59 — transplant its "כמה מזונות ממוצע 2025" table + FAQ minimum figures; it OUTRANKS the pillar on minimum-2025 variants), /child-support-calculation/ (53 imp @90, thin).
- **GSC:** "מזונות ילדים" 198 (196@68/2@74); "מינימום מזונות לילד 2025" 84 (54@39/30@31); "מזונות מינימום 2025" 80 (44@33/36@28 — guide ranks better!); "מזונות ילדים חישוב" 83 split 3 ways.
- **Execute:** add visible H2 "מזונות מינימום 2025" (today buried in FAQ only) + transplanted table, keep "2025/חישוב" in title → 2×301. Transplant: yes. FAQ schema: yes.

### #7 [consolidate] Divorce-lawyer pillar finish — 805-imp head
- **Winner:** /divorce-lawyer/ (already absorbs 5 chooser 301s incl. /lawyer-divorce/ 1,203 imp — live). **301:** /lawyer-divorce-guide-proceedings-costs-rights/ (11 imp — transplant "מה עושה עו"ד גירושין" + step-by-step process; price sections → /divorce-costs-2025/), /family-law-lawyer-divorce-wills-law-recommendations/ (119 imp — transplant how-to-choose-a-firm + first-meeting prep; conflict-ledger resolution).
- **GSC:** "עורך דין גירושין" 805 imp: women-vs-men 347@75 / lawyer-divorce 293@65 / the-rec 112@88 / divorce-lawyer 53@71.
- **Execute:** 2 transplant-merges; re-point /lawyer-divorce-rights/ + /lawyer-divorce-israel/ 301s directly at winner (kill chains); on /women-lawyer-vs-men-divorce-lawyer/ rewrite H1+lead to the עורכת-דין intent (344-imp own head, title already half-fixed) and de-optimize the masculine head. Transplant: yes. FAQ schema: yes.

### #8 [consolidate] Invest-abroad mega-cluster — ~1,800 imp
- **Winner:** /guide-israeli-apartment-2025/ (3,286 imp, pos 6-12 on best heads). **301:** /israelis-real-estate/ (1 imp, near-verbatim duplicate title) → winner; /apartment/ (59 imp, thin definition) → **/buying-property-abroad-guide/** (spoke_keep: verified distinct how-to process hub).
- **GSC:** "השקעות נדלן באירופה" 181 split 103@77/66@53; "דירה להשקעה בחול" 124 3-way; "קניית דירה באירופה" 84 (46@12 leads).
- **Execute:** refocus /real-estate-israelis-guide-complete-rental-2025/ strictly to rental/Airbnb yield (its legit head "נדלן מניב בחול" 99 imp) — strip generic invest-Europe sections; retitle /real-estate-investing/ to legal-accompaniment only (drop "המדריך לרכישת נכס" from title); bidirectional links winner ↔ process hub. Transplant: no (role separation). FAQ schema: no.

### #9 [consolidate] Portugal buy/invest — ~1,300 imp
- **Winner:** /buying-property-in-portugal/ (leads buy heads at 21-30). **301:** /guide-buying-property-portugal-israelis/ (best positions 16.8 — transplant content + property-search widget), /portugal-real-estate/ (448 imp — transplant market-data/invest sections, per MODIFY), /portugal-overview-real-estate/ (0 imp), /real-estate-comparative-guide/ (16 imp).
- **GSC:** "דירה בפורטוגל" 154 3-way; "נדלן בפורטוגל" 106; "השקעות בפורטוגל" 119 (porto 60@24 leaking).
- **Execute:** broaden winner title/H2 to cover השקעה (home for 117-imp national invest queries); de-optimize Porto page's generic national phrasing (stays city spoke). 4×301. Transplant: yes. FAQ schema: yes.

### #10 [consolidate] רשלנות רפואית בניתוח — ~1,000 imp
- **Winner:** /medical-malpractice-surgery/ (809 imp, pos 22-40). **301:** /surgical-errors-medical-malpractice/ (208 imp @74-98 — NO transplant, page verified empty of niche content), /medical-malpractice-lawyer-lawsuit-surgery-medical/ (9 imp, fold process steps).
- **GSC:** "רשלנות רפואית בניתוח" 339 (332@36 vs 7@98); ניתוחי גב 68@87, נוירוכירורגיה 50@75, קיצור קיבה 27@82 — long-tail landing on nothing.
- **Execute:** retitle winner to exact "רשלנות רפואית בניתוח" (current title drops רפואית); WRITE NEW niche H2s (גב/עמוד שדרה, נוירוכירורגיה, בריאטרי, פלסטי/מתיחת בטן, זיהומים) to capture the 208-imp tail; 2×301; keep anesthesia spoke. Transplant: no (write new). FAQ schema: yes.

### #11 [consolidate] עורך דין פלילי מומלץ — 496-imp head
- **Winner:** /criminal-defense-attorney/ (hub, already absorbs counsel-israel 301). **301:** /lawyer-near-me-criminal-law/ (186 imp @36.6 — thin "בקרבתי" listicle holding the cluster's best positions).
- **GSC:** "עורך דין פלילי מומלץ" 496 on 5 pages (170@78/154@55/85@80/84@35).
- **Execute:** MANDATORY before 301: add "עורך דין פלילי מומלץ" H2 + per-city block to the hub (current title/H1 lack the word — without it the 330 imp leak back to famous/worldwide); internal links from all 24 criminal articles. Transplant: partial (city list). FAQ schema: yes.

### #12 [consolidate] מפורסמים/מובילים criminal — ~1,370 page-imp
- **Winner:** /famous-criminal-defense-lawyer/ (622 imp @34.5, Israel-focused). **301:** /best-criminal-defence-lawyers-worldwide/ (745 imp @45.4 — transplant Israeli sections from the 265KB page first), /lawyers-criminal/ (2 imp, movies/TV micro-page).
- **GSC:** "עורך דין פלילי מוביל" 167/3 pages; "מפורסם" 75/4 (already @15.5 on famous); identical query-set splits on every term.
- **Execute:** transplant → 2×301 → consolidation pushes the whole ~450-imp "מפורסמים/מובילים" basket toward top-10. Transplant: yes. FAQ schema: no.

### #13 [consolidate] עורך דין רשלנות בלידה — 246-imp head
- **Winner:** /medical-malpractice-lawyer-birth-recommended/ (580 imp, all birth/pregnancy/C-section heads; representation twin already 301s in). **301:** /birth-injury-lawyer/ (40 imp @73-90, same hire intent — move its service-framing section in).
- **GSC:** "עורך דין רשלנות רפואית בלידה" 246: 198@43 / 30@56 / 18@90; "ניתוח קיסרי" 145 split.
- **Execute:** transplant-merge → 301; add dedicated "ניתוח קיסרי" H2+FAQ (121-145 imp gap — verdict: H2, NOT a new page). Keep info spokes (/medical-negligence-pregnancy/, /birth-injury/) as reference. Transplant: yes. FAQ schema: yes.

### #14 [consolidate] סכסוכי ירושה 3-way — ~800 imp
- **Winner:** Hebrew slug /סכסוך-ירושה-כיצד-מתמודדים-מה-ניתן-לתק/ (holds heads: 209/357 plural, 105/211 singular, pos 31-45). **301:** /inheritance-disputes-lawyer/ (2,121 words — transplant its dispute-guide body: registrar/court path, apartment disputes, uncooperative heir, estate manager), /inheritance-dispute/ (826 words, thinnest).
- **GSC:** "סכסוכי ירושה" 357 3-way; "סכסוך ירושה" 211; "סכסוך ירושה בין אחים" 72@84.5 + 19@63.9 effectively unserved.
- **Execute:** transplant → 2×301 → named H2 "סכסוך ירושה בין אחים" + keep "מה ניתן לתקוף" H2 verbatim, cross-link /will-probate-objection/. Transplant: yes. FAQ schema: yes.

### #15 [consolidate] DUI cluster — ~750+ imp (conflict-ledger resolution)
- **Winner:** /driving-under-influence/ (combined alcohol+drugs 2026 pillar; positions 28-48 vs 77-89; deepest verified alcohol content). **301:** /driving-under-the-influence/ (417 imp @80.9 — equity transfer), /driving-under-the-influence-of-drugs/ (transplant unique sections: saliva/urine/blood test powers, presumption rebuttal), /drunk-driving-defense/ (fix its illegal thresholds to 240 µg/liter breath BEFORE absorbing its table).
- **GSC:** "נהיגה תחת השפעת סמים עונש" 101@28.4 on winner; punishment family ~300 imp @75-90 on old page.
- **Execute:** 3 transplant-merges; align 240 (legal) vs 290 (enforcement) thresholds in one canonical section; /articles/ variants already 301 — request recrawl. /traffic-lawyer/ spoke untouched. Transplant: yes. FAQ schema: yes.

### #16 [consolidate] Medical-malpractice lawyer hub — ~570 imp
- **Winner:** /medical-malpractice-lawyer/ (pos 36.5, already absorbs 1130 301). **301:** /medical-malpractice-lawyers-law-medical-israel/ (331 imp commercial queries @60-86 — transplant any local-selection content), /medical-malpractice-lawyer-recommended/ (0 imp, near-empty).
- **GSC:** "עורכי דין רשלנות רפואית" 86@86 + 47 + 46 + 23 — all on the wrong article.
- **Execute:** 2×301 via redirect map; keep US-jurisdiction spoke (pos 6.2, 2 clicks) untouched. Transplant: light. FAQ schema: yes.

### #17 [consolidate] Portugal relocation — ~800 imp
- **Winner:** /portugal-relocation/ (236@14 head; sitelinks live). **301:** /immigration-to-portugal/ (76@62; H1 literally duplicates "רילוקיישן לפורטוגל | הגירה לפורטוגל").
- **GSC:** "רילוקיישן לפורטוגל" 312 split 236@14/76@62; "הגירה לפורטוגל" 239 split 109@15/95@50.
- **Execute:** transplant its NIF/bank/D7 + lawyer section → 301; add H2 exactly "רילוקיישן לפורטוגל עם ילדים: בתי ספר, בריאות וקצבאות" (53@7.4 jump-link). Citizenship + corporate spokes stay. Transplant: yes. FAQ schema: yes.

### #18 [consolidate+file-cannibal] Wills info + צוואה docx — ~600 imp potential
- **Winner:** Hebrew slug /צוואה-בישראל-כיצד-עושים-סוגים-תוקף-ומ/ (only URL Google shows for the info head). **301:** /guide-complete-wills-updated-2025/ (11,500-word flagship @7.0 longtail — transplant IN FULL before 301), /will-and-testament/ (0 imp).
- **File:** build "צוואה לדוגמא להורדה חינם" template page (free-divorce-template pattern), host download, then nginx-level 301 of /wp-content/uploads/2020/09/צוואה.docx → template page (uploads bypass WP redirects). Fold /wp-content/uploads/2021/02/inheritance_he-1.doc into same fix.
- **GSC:** צוואות 8@47; sample intent 12 imp ranking on the raw docx @64-80.
- **Execute:** transplant → 2×301 → template page → nginx 301. Interlink winner→template. Transplant: yes. FAQ schema: yes.

### #19 [consolidate] Divorce mediation 7→2 — ~800 page-imp
- **Winner:** /divorce-mediation/ (best position on 4/5 shared queries). **301:** /mediation-divorce/ (314 imp, mirror-slug what-is), /divorce-mediation-guide/ (stillborn second hub), /divorce-mediation-basics/, /divorce-mediation-cons-pros/ (fold as pros/cons section), /lawyers-mediation-divorce-experts-2023/.
- **GSC:** "גישור גירושין" 270 split 143@83/127@60; "גישור לפני גירושין" 107; "מגשרת גירושין" 97.
- **Execute:** transplant best what-is + pros/cons sections → 5×301. KEEP /family-mediation-updated-trends/ (356 imp own queries — distinct institutional intent). Add "גישור גירושין מחיר" anchor from /divorce-costs-2025/. Transplant: yes. FAQ schema: yes.

### #20 [consolidate] חוזה שכירות info head — ~700 imp
- **Winner:** /rental-agreement/ (308 imp head-holder; wiki-stub content gets fully replaced). **301:** /rental-agreement-guide/ (10 imp @14.8 — the better asset; transplant "מה חייב להיות + סעיפים מסוכנים" wholesale).
- **GSC:** "חוזה שכירות" 48@65; "הסכם שכירות" 43@59.5; guide @14.8 on small sample.
- **Execute:** transplant-as-replacement → 301 → hard cross-link with /online-rent-agreement/ (download CTA above the fold; that page stays the transactional winner — see S-3). /lease/ (חכירה) untouched. Transplant: yes. FAQ schema: yes.

### #21 [consolidate] עורך דין בארה"ב — ~694 imp
- **Winner:** /usa-lawyers/ (pos 5-36 on every query). **301:** /choose-usa-attorney/ (35@26.5 — transplant chooser checklist: state licensing, fee evaluation, vetting; MANDATORY, winner body is thin US-stats filler).
- **GSC:** "עורך דין ארצות הברית" 174 (55@16/30@68); "ייצוג משפטי ארצות הברית" 143 (37@5/35@26).
- **Execute:** transplant → 301; keep ABA reference + licensing spoke (avoid duplicating licensing vs the spoke). Transplant: yes (mandatory). FAQ schema: no.

### #22 [consolidate] שכר טרחה כללי (fees hub) — ~500 imp
- **Winner:** /lawyer-fee-outlook/ (beats guide on every query, 28-42 vs 70-84). **301:** /lawyer-fees-guide/ — FULL transplant first: fees-by-field tables + pricing-structure table moved to top of winner, winner retitled to מחירון intent ("שכר טרחת עורך דין: מחירון מעודכן לפי תחום"), global-trends content pushed down. If guide serves as nav hub: noindex alternative, transplant still required.
- **GSC:** "מחירון עורכי דין" 223 (60@28/60@82); "מתי משלמים שכר טרחה" 46 (41@37).
- **Execute:** transplant+retitle → 301/noindex → anchor-links out to vertical cost pages (divorce/criminal/RE). Transplant: yes. FAQ schema: yes.

### #23 [consolidate] עורך דין סייבר — ~340 imp
- **Winner:** /lawyers-cyber/ (125 imp @26-33, deepest article). **301:** /cyber-lawyer/ (exact-match title @49-57 — transplant title/sections), /cybercrime-lawyer-roll/ (thin, 19 imp tail).
- **GSC:** "עורך דין סייבר" 265 4-way: hub 104@30 / lawyers-cyber 97@33 / cyber-lawyer 46@57 / roll 18@95.
- **Execute:** 2×301; hub /practice-areas/cyber-law/ stays (never merge articles into hub). Transplant: yes. FAQ schema: no.

### #24 [consolidate] עורך דין סמים (hire) — ~600 query-imp
- **Winner:** /drug-offenses-criminal-lawyer/ (914 page-imp @13.3, 4 clicks, 2025 guide — conflict-ledger resolution). **301:** /drug-offenses-criminal-law-lawyer-recommendations-criminal/ (428 imp @80, machine-translated 2022 blocker), /drug-related-crime/ (86 imp @74.7).
- **GSC:** "עורך דין סמים" 166/3 pages all @75-80; "עורך דין פלילי סמים" 124/2.
- **Execute:** 2×301; clean title around the hire head. Info layer (/drug-crimes/) stays — see #28. Transplant: no. FAQ schema: yes.

### #25 [consolidate] הסגרה — ~280 imp
- **Winner:** /extradition-guide/ (586 imp @16.2, wins both heads). **301:** /criminal-procedure-article-8066-israel-rights/ (53@61 — verified doctrinal ARTICLE, not law text; transplant "תנאי ההסגרה וסייגיה" sections; ledger resolution).
- **GSC:** "הסגרה" 186 3-way (70@28/63@32/53@61); "הסכם הסגרה" 94 (72@27).
- **Execute:** transplant → 301; /petition-offenses-criminal/ (real ruling תה"ג 14271-06-20) stays reference_keep with link + generic הסגרה removed from its title. Transplant: yes. FAQ schema: yes.

### #26 [redirect] סחר בסמים duplicate — 207-imp head @18.6
- **Winner:** /drug-trafficking/ (370 imp @18, page 2). **301:** /drug-trafficking-2/ (literal WP "-2" duplicate, live, self-canonical).
- **Execute:** immediate 301 + internal links from the drug cluster + add penalties-by-section informational block (פקודת הסמים ס' 13/14/21 table — informational SERP). Transplant: no. FAQ schema: yes.

### #27 [consolidate] ערעור פלילי — 77 imp
- **Winner:** /criminal-appeal/ (2026 article, 69 imp head). **301:** /criminal-appeal-guide/ (5 imp), /criminal-appeal-process/ (0 imp, self-indexed third copy).
- **Execute:** absorb grounds-vs-odds table + appeal-cost figures (15-80K ILS) from the losers first → 2×301. Transplant: yes. FAQ schema: yes.

### #28 [consolidate] עבירות סמים info + hygiene — ~160 imp
- **Winner:** /drug-crimes/ (30 imp @56.7). **301:** /drug-offenses-israel/ (1 imp — absorb its penalties table + "גישת הביקוש 2019" section first). Also resolve page-layer duplicate /drug-offense-guide/ (20443) vs 20266 — fold both.
- **Execute:** transplant → 301. Transplant: yes. FAQ schema: no.

### #29 [consolidate] עבירות הונאה — ~160 imp
- **Winner:** /fraud-types/ (80 imp + 78 from /articles/ 301 already live). **301:** /fraud-offenses-israel/ (59 imp @67.4 — absorb its offense/penalty table incl. money-laundering + securities rows).
- **Execute:** transplant → 301 → GSC recrawl request for /articles/fraud-types/ residual (58@43). Transplant: yes. FAQ schema: no.

### #30 [transplant] עורך דין פלילי תל אביב — ~130 imp
- **Winner:** /criminal-lawyer-tel-aviv/ (strategic city-layer slug, 5 imp). **301:** /top-criminal-lawyer-tel-aviv/ (124 imp @54.5 — transplant full content incl. "מומלץ בתל אביב" section @41.6), /criminal-law-tel-aviv-lawyer-criminal-recommended/ (3 imp, old translated third).
- **Execute:** transplant → 2×301 → then city-layer link bar "עורך דין פלילי לפי עיר" from the hub + LocalBusiness/FAQ schema across ~28 criminal city pages (currently invisible: TLV 5@88.8, חיפה 6@45). Transplant: yes. FAQ schema: yes.

### #31 [transplant] להב 433 — 1,853 page-imp, 41 clicks
- **Winner:** /lahav-433/ (pos 3.8-7.6 navigational head). **301:** /lahav-433-guide/ (99 imp @20 — transplant "מה קורה כשזומנים לחקירה", "עונשים", "הגנה משפטית", FAQ; unifies חקירות הונאה 40 imp).
- **Execute:** transplant → 301; dedupe spammy title (keyword twice) to "להב 433: טלפון, כתובת ומבנה היחידה | Jus-Tice"; FAQ schema with phone/address Q&A (covers טלפון 244@5.7, כתובת 59@7.6). Transplant: yes. FAQ schema: **yes**.

### #32 [consolidate] עורך דין בסין — ~239 imp
- **Winner:** /china-lawyers/ (canonical country page). **301:** /top-lawyers-for-israelis-china/ (chooser article; transplant entrepreneurs/companies angle). 50/50 splits incl. dead-tie 34@14/34@13.
- **Execute:** transplant → 301. Hong-Kong spoke stays. Transplant: yes. FAQ schema: no.

### #33 [consolidate] מיסוי בפורטוגל — ~374 imp
- **Winner:** /taxation-in-portugal/ (pos 6-29). **301:** /list-of-taxes-portugal/ (transplant tax-type table). Relocation pillar tax H2s link to winner.
- **Execute:** transplant → 301. Transplant: yes. FAQ schema: no.

### #34 [file-cannibal] הסכם גירושין docx 2021 — ~400 imp aggregate + 244-imp head
- **Winner:** /free-divorce-agreement-template/ (3,883 imp @20.4). **File:** /wp-content/uploads/2021/03/נוסח-הסכם-גירושין-דוגמא-2021.docx ranks @18-51 on ~15 money queries AND is the pillar's own download CTA (verified loop risk).
- **Execute (strict order):** (1) publish fresh 2026 docx + PDF at NEW uploads URLs; (2) add H2 "הסכם מזונות דוגמא" with dedicated mezonot sample file (29-imp query where the docx beats the page 33 vs 70) + H2 "הסכם גירושין PDF" (106@14.7); (3) sweep ALL internal links off the 2021 file; (4) only then nginx-level 301 old docx → pillar. Transplant: n/a. FAQ schema: yes (with S-1).

### #35 [consolidate] Israel price stats — 2,232-imp winner
- **Winner:** /israel-real-estate-price-forecast/ (@17.6). **301:** /real-estate-statistics-2025/ (4 imp) + /real-estate-market-statistics/ (1 imp) — the two publish CONTRADICTORY 2024 deal data; accuracy liability as well as cannibal.
- **Execute:** 2×301 + refresh data tables; de-optimize TLV price mentions on /guide-israeli-apartment-2025/ (326-imp foreign-language split). Transplant: no. FAQ schema: no.

### #36 [consolidate-batch] Medical-malpractice small merges + pillar rebuild
- (a) 301 /medical-malpractice-house/ → /medical-malpractice-common-errors-doctors-hospitals/; sharpen title to בבית חולים; hand medication queries (55 imp) to the תרופות Hebrew-slug spoke via links. (b) 301 /medical-malpractice-costs/ → /medical-malpractice-cost/ (+year refresh). (c) 301 /medical-malpractice-tips-damages-lawsuit/ → /medical-malpractice-compensation/; in-content links from law-account's compensation sections. (d) 301 /medical-malpractice-8271/ → diagnosis Hebrew-slug winner (cleanest merge in family). (e) REBUILD /medical-malpractice/ (head slug squatted by 0-imp stub) as family pillar; 301 four 0-imp satellites (-lawsuit, tips-lawsuit-20, tips-20, 1572); pillar owns bare head + first-steps + documents, links out to הוכחה/הגדרה/doctrine (avoid a new 3-way vs law-account + proof guide). (f) Fix BROKEN /medical-expert-testimony-malpractice-lawsuit/ (family-law title on medical slug) → rebuild as expert-opinion asset, consolidate with witnesses article (feeds 250-imp חוות-דעת gap G-6). FAQ schema: pillar yes.

### #37 [consolidate] דיני מעצרים split-transplant — ~416 imp
- **Winner:** /arrest-rights/ (2026 pillar). **301:** /criminal-law-review-procedure-law-detention-2025/ (96 imp @35) — SPLIT transplant per MODIFY: detention-law sections → /arrest-rights/; general criminal-procedure survey (evidence, public defender, youth, 2023-25 amendments) → /criminal-defense-attorney/ hub. Then 301.
- **File:** nginx noindex the 2023 בקשת-מעצר PDF (ranks 46 vs page 65) + internal link to /detention-before-charge-or-trial/.
- **Execute:** split transplant → 301 → PDF noindex. Detention spokes stay (rebuild = gap G-9). Transplant: yes. FAQ schema: yes.

### #38 [consolidate-batch] Family-law small merges (all CONFIRM)
- (a) /alimony-israel/ ← 301 /divorce-spousal-support/ (1 imp; both sections covered). (b) /child-custody-modification/ ← transplant ALL 3 sections (שינוי נסיבות table, הליך, FAQ) from /custody-modification-israel/ → 301 (61-imp head; winner is a one-section mesh page — bare 301 forbidden). (c) /joint-custody-shared-parenting/ ← transplant full article from Hebrew-slug page 20240 → 301 (head 56 imp + תנאים 52@24; winner currently empty mesh). (d) /child-custody/ ← split-transplant from /child-custody-guide/ (סוגי משמורת + כיצד קובע → pillar; "משמורת בלעדית" section → /mom-full-custody/) → 301. (e) /cohabiting-couples-rights/ ← 301 /common-law-marriage/ (route its agreement section as link to /cohabitation-agreement/). (f) /infidelity-statistics-reasons-suspicions/ ← 301 two what-is satellites (carry legal-consequences + halachic sections). (g) /domestic-violence/ ← 301 two 0-imp duplicates (keep family-court victim sections: מזונות דחופים, hotlines 1202/1203). (h) Hebrew pension slug ← merge missing rows (סעיף 14, actuary 3-8K) → 301 /divorce-pension-split/. (i) /free-affidavit-sample/: de-optimize תצהיר mentions on divorce pillar + link (60-imp query @16). Transplants: yes throughout. FAQ schema: (b),(c),(g) yes.

### #39 [consolidate-batch] Query-sweep small merges
- (a) /company-formation-israel/ ← embed טופס 1 download prominently → 301 /companyregistrationform2/ (~193 imp). (b) /digital-signature/ ← 301 /electronic-signature/ (keep "חתימה אלקטרונית" legal-term section). (c) /consultant-real-estate/ ← 301 /consultant-real-estate-guide-comprehensive/ (carry consultant-vs-agent table; ~112 imp). (d) /portugal-golden-visa/ ← 301 /invest-in-portugal-for-citizenship/; differentiate generic /golden-visa/ hub title. (e) /business-license/ ← 301 /lawyer-licensing-business/ stub (winner INVERTED per verdict); add "מתי צריך עורך דין רישוי עסקים" section; retitle to lead with cost ("כמה עולה רישיון עסק" 96 imp @6-8). (f) /romanian-passport/ ← add explicit "עורך דין לאזרחות רומנית" section; de-optimize citizenship terms on /romania-lawyers/ (~280 imp). (g) /work-accident-guide/ ← merge /workplace-accident-guide/ ADOPTING its structure (two-track, checklist, FAQ); fix the claims-deadline contradiction (12 months, not 90 days) → 301. (h) /employment-contract/ ← transplant guide (fix typos) → 301 /employment-contract-guide/. (i) /yanshuf-breathalyzer-test/ = winner ← 301 /blood-alcohol-content-breathalyzer/ (machine-translated; ledger safe alternative, protects pos 8.1); add "בדיקת ינשוף מדדים" H2 (54 imp). Transplants: per-item. FAQ schema: (a),(e),(g) yes.

### #40 [title-fix-batch] Differentiations (no 301) — resolve splits by de-optimization
- (a) **Beit Hadar** (MODIFY): /beit-hadar-ruling-new-roof-tenants-precedent/ retitle to pure ruling reference "ע"א 7808/21 בית הדר — פסק הדין המלא"; analysis winner /building-rights-...-7808/ links down. Never merge a full judgment.
- (b) **Greece** (MODIFY): condense buy-process H2 on /greece-price-list/ to summary+link (it LEADS "רכישת בית ביוון" 63@38 — the leak source; do NOT touch its price tables/jump-links); de-optimize buy phrasing on /investing-in-greece-real-estate/; trim מחירים from buy-pillar H1. Monitor 6-8 weeks; merge investing only if split persists.
- (c) **Portugal lawyers** (MODIFY): run the עורך-דין-פורטוגל head-query check FIRST; then /legal-services-in-portugal/ = ייצוג pillar (pos 2), /portugal-lawyers/ = directory; strip ייצוג phrasing from directory title, cross-link. No merge on current evidence.
- (d) **רישום מכר** (ledger): /registration-of-real-estate-israel/ retitle to institution-only "לשכת רישום המקרקעין (טאבו)" + prominent link to /request/ (winner for the action intent); monitor, merge later if still splitting.
- (e) **CP/birth crossed titles** (MODIFY): /malpractice-cerebral-palsy/ retitle to CP + WRITE CP-specific H2s (גורמים, ראשי נזק ייחודיים, סיעוד לכל החיים) + trim duplicated how-to-sue sections in favor of links to /birth-injury/; /birth-injury/ drops שיתוק מוחין from title, links to CP winner. 210-imp query.
- (f) **הגדרה restore** (MODIFY): /what-is-medical-malpractice-definition-examples/ — add leading H2 "מהי רשלנות רפואית? הגדרה וארבעת היסודות" + definition box (300-imp query @14.5, closest page-1 shot in the family); then 301 /medical-malpractice-8269/ in.
- (g) **מקרים/דוגמאות:** winner /medical-malpractice-israel-medical/ ← bare 301 /medical-malpractice-7583/ (verified: nothing to transplant) + build כתב-תביעה-לדוגמא section (64-imp query skews sample-document intent).
- (h) **tax-investigation-guide:** remove "ועבירות מס" from title, link to /tax-crimes/ pillar (138@32 head-holder). Tax trio otherwise healthy.
- (i) **AI ranking:** /ai-lawyer-ranking/ retitle to lawyer-rankings-guides intent (content verified as Chambers-style directory review, NOT AI tools); /lawyer-ai-course/ de-optimize generic terms. Winner /ai-for-law-firms/ untouched.
- (j) **International law:** /international-litigation/ + /criminal-law-lawyer-international/ drop generic "עורך דין בינלאומי" optimization, link to /lawyer-international/.
- (k) **Murder US page:** prominent link to /murder-charges/ (stop Hebrew-query leak; no merge — US comparative layer wins pos 6-17 own queries).
- (l) **Rotenberg advertorial:** NO rel=canonical (non-duplicates); plain contextual link to /the-recommended-family-lawyers/ + brand-focused title; noindex only with owner sign-off.
- (m) **יישוב סכסוך form page:** retitle /request-for-family-dispute-settlements/ to טופס+להורדה only, embed downloadable form, cross-link the guide (differentiate, don't merge — form page hits pos 15 on download queries).
- (n) **Speeding:** upgrade /speeding/ (1,051 imp @73.5) to penalties+points pillar with penalty/points table; /speeding-ticket-guide/ refocus to appeal-only WITH real appeal content (בקשה להישפט תוך 90 יום, הסבה, פגמי מדידה) or merge in.
- (o) **Recommended-family cluster residue:** sweep internal links off /most-recommended-family-lawyer/ (301 live); de-optimize hire phrasing on /family-law/ + /online-family-law-services/; verify GSC re-attribution of the מומלץ positions (34-37) — recover sections from WP revisions if they don't transfer.

---

## TIER 2 — STRIKE-ZONE CTR FIXES (pos 3-20, ranked by clicks recoverable)

### S-1 [rich-result] הסכם גירושין pillar — ~49 clicks/mo (biggest real money strike)
- **Page:** /free-divorce-agreement-template/ — 1,298 imp @8.3, 0 clicks. Title already fixed to 2026; the 28d window mostly served the old title.
- **Execute:** GSC reindex request + verify SERP shows new title; add FAQPage schema (מה חייב להופיע בהסכם, כמה עולה אישור). Covers מסמך גירושין 97@5.7, הסכמי גירושין 64@5.8. Pairs with #34 (docx fix).

### S-2 [title-fix] Country-layer batch retitle — ~55 clicks/mo, ~1,200 imp, 15 pages
- **Pages:** india/spain/japan/canada/belgium/australia/mexico/brazil/italy/france/uk/poland/cyprus + /lawyer-israeli/ (Thailand — also flag slug rename to /thailand-lawyers/ w/ 301).
- **GSC:** 0 clicks at pos 3-10 across the layer (עו"ד בספרד 40@3.0, עורך דין הודו 69@4.3, ייצוג עסקי ביפן 168-imp page).
- **Execute:** one Cyprus-pattern template via Yoast snippet: "עורך דין ב[מדינה] לישראלים: עסקאות, נדל"ן וליטיגציה". FAQ schema: optional.

### S-3 [rich-result] חוזה שכירות אונליין — ~20 clicks/mo
- **Page:** /online-rent-agreement/ — 373 imp @6.9, 3 clicks; also חוזה שכירות סטנדרטי להדפסה 43@9.9.
- **Execute:** reindex (title just fixed); pull "מילוי חינם בלי הרשמה" into title; FAQPage schema; add "להדפסה" H2 + downloadable PDF version.

### S-4 [rich-result] Posta family — realistic 150-350 clicks/mo (owner decision pending)
- **Page:** /posta/ — ~9,600 imp/28d across 14 variants, 21 clicks (פוסטה פשע 4,590@5, פלילי 2,530@5.9). Brand-navigational.
- **Execute (only lever while cluster fate is pending):** NewsArticle/LiveBlog schema + visible fresh timestamps; anchored H2 "פשע בצפון" (440@6.1) for jump-link.

### S-5 [title-fix+rich-result] בקשת בגיר police form — ~17 clicks/mo, ~530 imp family @8-10
- **Page:** /petition-approval-debt-arrangement-creditors/ (misleading slug, winning content — do NOT touch URL).
- **Execute:** retitle "בקשת בגיר לקבלת אישור משטרה: טופס מקוון ומדריך מילוי מהיר"; HowTo schema; link official police form; correct-anchor internal links. Slug rename = owner decision only (flagged, risky).

### S-6 [title-fix] מרב"ד entity — 660 imp @13.1, 5 clicks
- **Page:** /medical-fitness-tests-for-driving-marvad-info/.
- **Execute:** add plain spelling to title "מרב"ד (מרבד) — המכון הרפואי לבטיחות בדרכים: זימון, בדיקות וערעור"; crisp first-line definition (מה זה מרבד 99@6.1); phone/address box (מרבד טלפון 26@18.2). Refocus /medical-institute-for-road-safety/ to ערר-only (keep its מי-מקבל-זימון section); embed-then-noindex the two 2021 marvad PDFs (nginx X-Robots-Tag), forms belong on /standards-of-medical-fitness-to-drive/.

### S-7 [title-fix] תוצרת כחול לבן — 1,337 imp @5, 3 clicks
- **Page:** /53431-10-21/ (verdict reference — never merge). Retitle front-loading the channel name: "תוצרת כחול לבן: העונש שנגזר על יוצר ערוץ הטלגרם (ת"פ 53431-10-21)".

### S-8 [rich-result] תעודת יושר block post-merge — ~600 imp → top-10 conversion
- After #4 ships: reindex; the 2026 title converts at top-10. בקשה לתעודת מידע פלילי 68@10.9 + לשגרירות 59@13.7 get dedicated H2 anchors. FAQ schema: yes.

### S-9 [internal-links] Inheritance-order on-page — 1,026 imp family, pos ~30
- **Page:** /inheritance-order/ (healthy, no cannibal). Add downloadable-form block ABOVE the fold (טופס צו ירושה להורדה 10@5.1 = page 1, 0 clicks), מצב-בקשה section, צו ירושה ברבנות section. FAQ schema: yes.

### S-10 [title-fix-batch] Judge/party-name verdict layer — ~450 imp
- Prefix judge name at title start on verdict pages (אורית בן דור ליבל 172@7.8, מורן ואלך ניסן 67@6.5, ענת הלר כריש 47@7...). Reference layer — title-only, no merges.

### S-11 [title-fix] תשניק סב-לידתי — ~400 imp family, 0 clicks
- **Page:** /perinatal-asphyxia/. Retitle from trilingual keyword pipe to "תשניק סב-לידתי בלידה: גורמים, השלכות ומתי זו רשלנות רפואית" + FAQ schema; feeds malpractice funnel.

### S-12 [title-fix] Homepage search intent — 280 imp
- Retitle homepage to "חיפוש עורך דין לפי שם, תחום ועיר | Jus-Tice" + WebSite SearchAction schema (sitelinks search box).

### S-13 [internal-links] International inheritance H2 pack — ~130 imp at pos 13-20 (only clicking page in family)
- **Page:** /international-inheritance-wills-lawyer/ (388 imp, 5 clicks). Add H2s: נכס בישראל כשהיורשים בחו"ל (27@20), מכירת נכס ע"י יורשים בחו"ל (22@19 — highest lead value), ירושה בגרמניה (24@16.6), חוק הירושה הצרפתי (23@18.3); CTR-polish title on דירת ירושה כשהיורשים בחו"ל (34@13.5). FAQ schema: yes.

### S-14 [rich-result] Rankings pages — 122 imp
- /chambers-and-partners/: add "Band 1 בישראל" firms table (query 67@6.6 ranks WRONG page); exact-anchor link from /dun-bradstreet/ sec-5. /the-legal-500/: retitle "The Legal 500: דירוג משרדי עורכי הדין הישראליים לפי תחומים" + Israel M&A section (55@8.2).

### S-15 [technical] Sitemap noindex — 84+ imp leakage
- noindex /site-map/ + /sitemap-jus-tice/ (soaking רשלנות רפואית הגדרה 84 imp + privacy queries); add internal links from personal-injury hub to the definition winner (#40f).

### S-16 [internal-links] Military lawyer push — 126 imp @9.6
- /military-lawyer-israel-court-martial-defense/ (title already fixed): internal links from criminal hub + homepage practice block + 3-4 verdict pages, price table + FAQ schema (עורך דין צבאי מחיר 126@10 → top-5).

### S-17 [internal-links] שכר טרחה רשלנות רפואית — 118 imp @26.2
- /medical-malpractice-attorney/ (correct dedicated asset): links from all malpractice spokes + percentages table (also 'כמה אחוזים לוקח').

### S-18 [content] Answer-box batch — definitional snippets
- /prosecutor/: opening line "הצד התובע את הנאשם נקרא התביעה..." (131@4.7). /court-judge/: רשם-מול-שופט comparison table (43@7.9). /expert-lawyers-judges-directory-israel/: HowTo "איך מגישים מועמדות לשפיטה" (77 imp). /traffic-lawyer/: "מהם דיני התעבורה" intro H2 (62@6.4, 0 clicks). /greece-price-list/: עלויות שיפוץ H2 (60@12.1). /israel-portugal-relations/: practical-hook retitle (219 imp, accept partial).
- **No-action (decay by design):** about-usa/about-cyprus trivia (~1,070 imp zero-click SERPs, pages already re-themed); exclude from CTR KPIs.

### S-19 [content] Custody strike pair — ~330 imp
- /mom-full-custody/: expand the empty mesh page (משמורת בלעדית לאם 31@20.5 — only true strike-zone query in family), target משמורת מלאה (39@60), receive "משמורת בלעדית" section from #38(d), link FROM ruling /verdict-custody-37049-07-18/ (@13). /tender-years.../: rewrite+expand (חזקת הגיל הרך 129@56 + 230 imp available, no new page needed).

### S-20 [content] הסכם ממון spokes — ~350 imp
- /prenup-attorney/ (48@71): exact-anchor links from prenup pillar + cost page + 20246; 2026 mini-refresh. /how-much-does-prenup-cost/ (64 imp @23-24): strengthen links; /prenuptial-agreement-sample/: ensure pillar links with anchor "הסכם ממון סטנדרטי להורדה" (28@39).

---

## TIER 3 — MONEY-KEYWORD GAPS (by demand)

### G-1 [rebuild] מחיקת רישום פלילי — ~1,300 imp (biggest gap on site)
- /police-records-data-deletion/ (1,525 imp @70.8) rebuilt as money pillar titled "מחיקת רישום פלילי": H1 on head (188+182 imp), step-by-step procedure, חלוף-הזמן timetables, FAQ schema, price block cross-linked with #5 winner (מחיקת רישום פלילי מחיר 154 imp), links from criminal hub + teudat-yosher winner.

### G-2 [new-page] מחירון עורך דין תעבורה — ~774 imp
- New /traffic-lawyer-cost/ on the proven price-list template (#3-ranked criminal pattern): שלילה, שכרות, נקודות, ערעור דוח tables. GSC: עורך דין תעבורה מחיר 250@25.9 + כמה עולה 267@27.2 all landing on criminal price pages while /traffic-lawyer/ sits @77. Links from /traffic-lawyer/, criminal price-list (anchored traffic H2 from #5), speeding pages. Must differ substantively from criminal tables (no 6th cannibal). FAQ schema: yes.

### G-3 [rebuild] שימוע לפני כתב אישום — ~450 imp, urgent-intent
- Deep rewrite /pre-indictment-hearing/ (שימוע לפני הגשת כתב אישום 250@72.6, שימוע פלילי 156@82.7): rights, prep, success rates, mistakes; FAQ schema; links from hub, indictment pages, offense pages. Highest lead-value emergency query in criminal.

### G-4 [new-page] פתיחת תיק גירושין ברבנות — ~358 imp autocomplete cluster
- "פתיחת תיק גירושין ברבנות: אגרה, מסמכים ותהליך 2026" — all variants pos 25-31 on /divorce-costs-2025/ with no dedicated asset. Links from divorce-costs + agreement pillar. FAQ schema: yes.

### G-5 [rebuild] כתב אישום + ביטול — ~630 imp
- Strengthen /criminal-indictment/ (כתב אישום פלילי 156@62.7, כתב אישום 147@76.4) with internal links from all offense pages; refocus /criminal-indictment-cancellation-withdrawal-israel/ around ביטול כתב אישום as head (257@78.8; it already ranks 29.5 on חזרה מכתב אישום) — grounds, stats, request template.

### G-6 [new-page] חוות דעת רפואית משפטית pillar — ~250 imp + 373-imp stale page
- Refresh /court-legal-opinion-experts-medical-2023/ (373 imp, 3 clicks @48.6) or clean URL 301ing it in; fold witnesses article + rebuilt expert-testimony slug (#36f); cover price, who-pays, per-specialty (פלסטיקה 44, חיפה 52, קרדיולוג 25). FAQ schema: yes.

### G-7 [new-page] גרימת מוות ברשלנות pillar — ~380 imp (REJECT replacement)
- New editorial guide "גרימת מוות ברשלנות: יסודות העבירה, העונשים והפסיקה" incl. תאונות דרכים section (עונש על הריגה בתאונת דרכים 71 imp + גרימת מוות בתאונה 66 + general family ~240 imp @74-91). Both source documents (Guideline 2.1, verdict רימר, parents Guideline 2.22) stay reference_keep with prominent links IN. Cross-family: coordinate criminal+traffic.

### G-8 [new-page] חוק לתיקון דיני משפחה (מזונות) 1959 — ~236 imp
- Dedicated law-reference page (statute text + plain-Hebrew section commentary + link to /child-support/). NOT hosted on /practice-areas/family-law/ (MODIFY: wrong page type). Linked from both family-law hubs. Fixes 4 statute queries at pos 41-48.

### G-9 [rebuild] מעצר spokes — ~320 imp
- Rebuild /detention-before-charge-or-trial/ (מעצר עד תום ההליכים 144@70) + /detention-days/ (78@89.6) with 2026 content (timelines, process diagram, rights), linked from /arrest-rights/ after #37.

### G-10 [new-page] איחור במסירת דירה מקבלן — ~204 imp
- Money guide "איחור במסירת דירה מקבלן: פיצויים לפי חוק המכר" + compensation table + downloadable מכתב התראה template. All variants currently land on ruling /compensation-apartment-contractor-10300-02-21/ @78-83 (stays reference, links in).

### G-11 [rebuild] עורך דין עבירות מין — ~357 page-imp
- E-E-A-T rewrite /sex-crime-lawyer/ (עורך דין עבירות מין 85@76; zero clicks): process, סד"פ, registry; links from hub + city pages. No cannibal — pure content-strength gap.

### G-12 [new-page] עורך דין מזונות — 152 imp
- New /child-support-lawyer/ ("מתי צריך, כמה עולה ואיך בוחרים") — queries currently land on /online-family-law-services/ @90+. Links from /child-support/ (2,386 imp), /divorce-lawyer/, 26 family-law city pages.

### G-13 [new-page] Country-page batch — ~400 imp
- /new-zealand-lawyers/ (127 imp; DLA-Piper profile ranks 13-18 in its place), /philippines-lawyers/ (120), /slovakia-real-estate/ (90, greece-price-list template), Thailand re-slug (#S-2), /egypt-lawyers/ (20, low priority). Proven country template.

### G-14 [new-page] ניכור הורי pillar — head invisible
- "ניכור הורי: זיהוי, תביעה, פיצויים וסנקציות" — head absent from top-100; תביעת ניכור הורי 32@39.5 splits between two rulings. All 4+ rulings link in (reference layer intact).

### G-15 [new-page] תביעת כתובה pillar — head invisible, authority proven
- "תביעת כתובה בגירושין: מתי משלמים, סכומים והליך בבית הדין הרבני" — zero of 7,976 queries contain כתובה while 8+ ketubah rulings rank top-10 on long-tails. Hub-link every ruling.

### G-16 [rebuild] עורך דין דיני עבודה — ~493 page-imp
- Rewrite/expand /labor-lawyer/ (heads at 46-55, 0 clicks); employer/employee structure; links with exact anchor from 20+ new labor pages + city pages. Plus new anchor articles: שימוע לפני פיטורים (0 GSC, proven demand proxy), התפטרות guide (80 imp on law-text page), מכתב התפטרות template (33 imp), שעות נוספות calculator (52 imp).

### G-17 [new-page] ביטול פסילה / שלילת רישיון service spoke — ~131 imp
- Commercial spoke of /traffic-lawyer/ (ביטול פסילה 40@52, ביטול נקודות 31@36, שלילת רישיון 30@47). Plus פגע וברח article (58@67.8, no asset).

### G-18 [new-page] Real-estate money spokes — ~250 imp
- מס שבח interactive calculator on /land-appreciation-tax/ (calculator family ~55 imp; child-support-calculator pattern) + repoint /real-estate-tax-israel/ to מס רכישה; פינוי בינוי template-download rebuild (34 imp); תמ"א 38 lawyer rewrite + reindex (91 imp + 97-imp /articles/ residual); חוק המכר section on /buying-apartment-from-contractor/ (44 imp landing on fee page); עורכי דין מקרקעין מומלצים directory page (64@38.1); קניית דירה ראשונה retitle after guide-pair merge (28@60).

### G-19 [new-page] Inheritance small spokes — ~250 imp
- הסתלקות מירושה + affidavit download (43 imp); מס ירושה rewrite /inheritance-tax-israel/ (64 imp); צוואה הדדית spoke (0 imp, core-term hole); ידועה בציבור ירושה section (12 imp); מנהל עיזבון deepen /will-executor-israel/; זכויות-דיירים long-tail via #14.

### G-20 [new-page] Mezonot small spokes — ~200 imp
- מדור ודמי מדור spoke (72 imp); מזונות עבר article linked from ruling (40 imp); מזונות הורים article (40 imp — wrong-intent landing today); הסדרי שהות spoke under /child-custody/ + agreement-sample section on template pillar (10@16.3).

### G-21 [new-page] Misc verified gaps — ~450 imp
- עורך דין אתיופי directory page (79 imp @5.9 — intent mismatch vs /ethiopia-lawyer/, near-guaranteed top-3); אחוז הגירושין בישראל stats page (52@5.2, CBS data, yearly refresh); תקיפת בן/בת זוג page (52 imp, rulings link in); צו חיפוש guide (64@34.2 on ruling); כתב אישום אלימות במשפחה defense spoke (30 imp); הסכם פירוד ידועים בציבור template (51 imp); rechev/greece-lawyers HTML page + noindex 2 PDF lawyer lists (24 imp); pharmacist-registry HTML article + nginx noindex 2020 PDF (64@9.5); קורקינט חשמלי pillar (26 imp on ruling); תביעות קטנות cost section (48 imp); עורך דין תאונות דרכים rewrite /car-accident-auto-injury-lawyer/ (84 imp @92).

---

## TIER 4 — TECHNICAL / HYGIENE
1. **Redirect-chain kills:** /lawyer-divorce-rights/ + /lawyer-divorce-israel/ → point directly at /divorce-lawyer/ (currently chain via guide page being merged in #7).
2. **GSC recrawl requests:** all live 301s still credited in GSC (/articles/* variants, most-recommended, lawyer-1130, birth-representation, calculator-2023 — verify live, mezonot note says confirm).
3. **Canonical audit:** /articles/-prefixed variants indexed alongside canonical (maximize-an-inheritance, real-estate-attorney, real-estate-usa, mom-full-custody 1@9).
4. **Slug-content mismatches (title fixes only, URLs untouched):** /criminal-conviction-appeal-options-israel/ = dangerous-dog article (143@2.0 — fix internal title only); /labor-law-article-7305-employee-rights-israel/ = tort content on labor slug; /real-estate-investment-new-york-surgery-manhattan/ — inspect for spam remnant, remove or fold.
5. **Police-station squatter:** /child-support-alimony-updated-guidelines-2023/ carries 2,245 imp @17 of police-station queries on a mezonot slug — re-slug to /police-stations-israel/ + 301 (do NOT 301 into /child-support/). Owner sign-off.
6. **919/15 optional hygiene (from REJECT):** retitle /custody-alimony-ruling-new-919-15/ to "תמ"ש 17545-07-16 | מזונות ומשמורת אחרי הלכת 919/15" (zero-imp, zero-risk); interlink both rulings ↔ /child-support/.
7. **Monitoring windows:** re-run strike-zone miner in 30 days (title fixes invisible in current window); watch משמורת-משותפת rankings post-301 (#38c); watch law-account פיצויים split after linking (#36c); Greece + rishum-mekher differentiation reviews at 6-8 weeks.
8. **Rulings/law-text guardrail (site rule):** never merge פסקי דין or statute texts — all such pages in this queue are reference_keep with links only.

---

## SUMMARY

| Metric | Value |
|---|---|
| Clusters mined (10 miners) | 127 |
| REJECTed (dropped/replaced) | 2 |
| Cross-miner duplicate claims resolved | 11 (see ledger) |
| Distinct confirmed/modified cluster actions | ~68 (40 Tier-1 queue slots incl. 3 batches) |
| 301 redirects to ship (pages) | ~75 |
| File-cannibals (nginx-level) | 6 (2 docx, 1 doc, 3 PDF noindex) |
| CTR strike items | 20 (44 flagged queries covered) |
| Gap items | 21 ranked (35+ keywords) |
| **Impressions at stake (28d)** | **~50,000** (Tier-1 ~28K, Tier-2 ~16K incl. 9.6K Posta brand-nav, Tier-3 ~7.5K demand) |
| Clicks recoverable (CTR tier) | ~700 nominal gap; ~200-250/mo realistic |

**Top 5 moves by impact:**
1. **#1 Real-estate fee consolidation** — ~4,300 imp, 3 pages → 1, retitle + table transplant + 2×301.
2. **#2 Divorce-cost consolidation** — ~2,000 imp with heads already at pos 24-35; single transplant+301 is the push to top-10.
3. **#3 Inheritance hire-intent consolidation into /inheritance-lawyer/** — 1,911 imp of pure commercial intent, 0 clicks today.
4. **#4 תעודת יושר block** — ~1,500 imp stuck at pos 20-35 purely from equity split; one transplant+301 moves the whole block.
5. **S-1 + #34 Divorce-agreement pillar CTR + docx file fix** — 1,298 imp @8.3 with 0 clicks (~49 clicks/mo) — fastest payback, near-zero new work, plus kills the site's biggest file-cannibal.
