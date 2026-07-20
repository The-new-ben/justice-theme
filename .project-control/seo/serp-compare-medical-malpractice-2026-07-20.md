# Row-by-row source comparison — עורך דין רשלנות רפואית
**Ours:** https://jus-tice.co.il/medical-malpractice-lawyer/ (route-rendered pillar)
**Theirs (#1):** https://ginzburgadv.co.il/practices/רשלנות-רפואית/ (firm practice page, 30-yr brand)
Method: raw HTML as Googlebot fetches it, parsed signal-by-signal, 2026-07-20.

| # | Signal | Theirs (#1) | Ours | Verdict → Action |
|---|--------|-------------|------|------------------|
| 1 | Title | Head phrase first + trust number ("למעלה מ-30 שנות ניסיון") + person brand | Head phrase first + task words ("תביעה, פיצויים ובדיקת עילה") | Ours solid. Add a scale-trust element a directory can honestly claim: "המדריך המלא + השוואת משרדים" (not years). |
| 2 | Meta description | Second-person emotional hook ("נפגעתם מ...?") + differentiator ("מייצגים תובעים בלבד") | Informational promise + free tool | Near-parity. Test a second-person opener; keep the free-tool hook (unique). |
| 3 | H1 | עורך דין רשלנות רפואית | Identical | Parity. |
| 4 | **Exact-phrase density** | **"עורך דין רשלנות רפואית" ×16, "רשלנות רפואית" ×88 in 2,750 words (~3.2% family density)** | ×4 / ×64 in 5,968 words (~1%) | **Their core weapon.** Raise ours to 10-14 natural placements: one H2 carrying the phrase, intro sentence, 2-3 FAQ questions rephrased, image alts, closing CTA line. Never stuff — mirror their *placement pattern* (headings + nav + body). |
| 5 | **Menu anchors (sitewide)** | Menu = keyword farm: every practice is an "עורך דין X" anchor passing exact-match internal anchors from every page | Topics bar mixed bare topics ("רשלנות רפואית") | **EXECUTED 2026-07-20 (c83f0d81):** all 7 practice anchors normalized to עורך-דין form. Live at next pull. |
| 6 | First visible bytes | Title → phone → full address (NAP) → menu | Skip-link → menu → hero | Add org NAP (address line) to header/footer sitewide — feeds LocalBusiness trust. |
| 7 | Schema | WebPage, ImageObject, Breadcrumb, WebSite, Organization, FAQPage(7) | LegalService ✓, FAQPage(13) ✓ but **duplicated FAQPage + duplicated WebSite + CollectionPage/WebPage conflict** | We're richer but dirtier. Dedupe FAQPage + WebSite, drop CollectionPage on route pages. Neither side has AggregateRating — our future reviews-engine can win this row outright. |
| 8 | Content depth | 2,750 words; אבחון ×48; success stories with sums ("מיליון" ×4) | 5,968 words; התיישנות ×17, חוות דעת ×32, שכר טרחה ×9 — informational depth WE WIN | Add the two blocks they win with: (a) "פיצויים שנפסקו בפועל" — real sums from OUR rulings library (information gain no firm can match at scale); (b) misdiagnosis (אבחון) H2 — their 48 vs our 13 marks a subtopic gap. |
| 9 | E-E-A-T | Person, 30 years, address, success stories | No person, no years (directory), free tools ✓ | Directory equivalents: verified-index scale numbers, reviewed-by-lawyer byline on the pillar, rulings-derived data tables. |
| 10 | Conversion signals | 4 forms, 5 tel links | 2 forms, 3 tel, WhatsApp widget | Parity in practice. |
| 11 | Internal links | 323 (mega practice mesh) | 166 | Ours adequate; density fix (#4) matters more than count. |
| 12 | Robots/canonical | Clean | Clean | Parity. |

## Execution state
- Row 5 executed sitewide (commit c83f0d81, live at next pull).
- Leak fix executed (the "כפילות SEO" line): template + live bridge snippet 247. Site-wide DB sweep clean.
- Rows 4, 6, 7, 8 queued as the malpractice-pillar work item; the same 12-row method now applies to each money pillar (divorce, criminal, real-estate, inheritance) — one comparison file each.
