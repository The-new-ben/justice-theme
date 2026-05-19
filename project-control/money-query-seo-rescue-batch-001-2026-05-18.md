# Money Query SEO Rescue Batch 001 - 2026-05-18

## Goal

Recover qualified legal traffic by fixing high-impression, low-CTR pages that already have Google visibility but are not converting impressions into clicks or leads.

This batch is intentionally conservative:

- Do not redirect high-impression URLs yet.
- Do not delete old pages yet.
- Do not overwrite live CMS content without owner approval.
- First fix title/H1/intro/search intent/internal links on the existing URL.
- Add contextual internal links from relevant hubs and articles using crawlable `<a href="">` links with descriptive anchor text.

## Research Signal

Google's current link guidance is very direct: Google uses links to discover pages and understand relevance, links should be real crawlable anchors, and anchor text should be descriptive, concise, and relevant to both pages. This matches the site problem: many pages exist, but Google and users need clearer pathways to the money pages.

Current law-firm SEO guidance is also consistent: the strongest legal sites use practice-area hub pages, supporting articles, local/practical pages, clear attorney credibility, and internal linking between related intent layers.

## Batch Selection From GSC Mirror

Data source: `content-master/gsc/gsc-url-summary.csv`.

Priority is based on:

1. High impressions.
2. Very low CTR.
3. Legal money intent.
4. Existing or near-existing lawyer monetization path.
5. Safe to improve without redirecting.

## Priority Pages

### P1 - `/real-estate-attorney`

- GSC: 88,601 impressions, 17 clicks, 0.02% CTR, average position 58.6.
- Problem: enormous demand but weak click capture.
- Intent: "real estate lawyer", "property purchase lawyer", "property sale lawyer".
- First action: make this the clean real-estate lawyer hub.
- Suggested title: `עורך דין מקרקעין - קנייה, מכירה, חוזים ורישום זכויות | Jus-Tice`
- Suggested H1: `עורך דין מקרקעין לקנייה, מכירה ורישום נכס`
- Intro job: answer who needs a lawyer, what documents to prepare, when to call, and how Jus-Tice connects to relevant lawyers.
- Internal links to add:
  - `/lawyer-for-buying-or-selling-a-house/`
  - `/israel-real-estate-price-forecast/`
  - `/buying-property-in-greece/`
  - `/lawyers/?area=real-estate`

### P2 - `/criminal-defense-attorney`

- GSC: 62,561 impressions, 10 clicks, 0.02% CTR, average position 56.4.
- Intent: urgent criminal lawyer.
- First action: convert into the main criminal defense commercial hub, linked from criminal pillar content.
- Suggested title: `עורך דין פלילי - חקירה, מעצר וכתב אישום | Jus-Tice`
- Suggested H1: `עורך דין פלילי לפני חקירה, מעצר או כתב אישום`
- Intro job: urgent first steps, what not to say before advice, what to prepare, and lawyer matching CTA.
- Internal links to add:
  - `/police-investigation/`
  - `/indictment/`
  - `/sex-crime-lawyer/`
  - `/apply-for-police-criminal-information-certificates/`
  - `/lawyers/?area=criminal-law`

### P3 - `/lawyer-for-buying-or-selling-a-house`

- GSC: 35,650 impressions, 3 clicks, 0.01% CTR, average position 61.5.
- Intent: transactional property lawyer.
- First action: keep as support page for `/real-estate-attorney`, not a competing hub.
- Suggested title: `עורך דין לקניית דירה או מכירת דירה - מה בודקים לפני חתימה`
- Suggested H1: `עורך דין לקנייה או מכירה של דירה`
- Internal links:
  - Up to `/real-estate-attorney/` with anchor `עורך דין מקרקעין`.
  - To lawyer directory filtered by real estate.

### P4 - `/labor-lawyer`

- GSC: 29,862 impressions, 3 clicks, 0.01% CTR, average position 67.0.
- Intent: employment lawyer.
- First action: create or improve employment-law partner landing path before investing in deep content.
- Suggested title: `עורך דין דיני עבודה - פיטורים, זכויות עובדים ומעסיקים | Jus-Tice`
- Suggested H1: `עורך דין דיני עבודה לעובדים ומעסיקים`
- Business note: no strong partner coverage means this should also feed the Unserved Demand Ledger and partner recruitment.

### P5 - `/sex-crime-lawyer`

- GSC: 27,904 impressions, 34 clicks, 0.12% CTR, average position 56.0.
- Intent: high urgency and high sensitivity.
- First action: legal tone review plus user-path clarity, not aggressive marketing.
- Suggested title: `עורך דין עבירות מין - ייעוץ לפני חקירה וייצוג בהליך פלילי`
- Suggested H1: `עורך דין עבירות מין: חקירה, זכויות וייצוג`
- Must include: careful disclaimer, victim/suspect distinction, urgent consultation CTA, no sensational language.

### P6 - medical birth malpractice URL

- GSC: 27,275 impressions, 1 click, 0.00% CTR, average position 60.6.
- Intent: birth-related medical malpractice lawyer.
- First action: decide whether this is a money page or support page. If money page, add lawyer CTA and medical-malpractice hub links.
- Suggested title: `עורך דין רשלנות רפואית בלידה - בדיקת מקרה וזכויות`

### P7 - `/prenup-attorney`

- GSC: 20,894 impressions, 1 click, 0.00% CTR, average position 55.4.
- Intent: prenuptial agreement lawyer.
- First action: make commercial page distinct from informational prenup guides.
- Suggested title: `עורך דין הסכם ממון - ניסוח, בדיקה ואישור הסכם | Jus-Tice`
- Suggested H1: `עורך דין הסכם ממון לפני נישואין או בפרק ב'`
- Internal links:
  - `/prenuptial-agreements-overview/`
  - `/changing-or-canceling-a-prenuptial-agreement/`
  - `/lawyers/?area=family-law`

### P8 - `/traffic-lawyer`

- GSC: 20,330 impressions, 0 clicks, 0.00% CTR, average position 67.9.
- Intent: traffic lawyer.
- First action: service-page rewrite and internal links from Eye Hawk / license / Marvad pages.
- Suggested title: `עורך דין תעבורה - דוחות, שלילה, נהיגה בשכרות ותאונות`
- Suggested H1: `עורך דין תעבורה לטיפול בדוחות, שלילה ותאונות`

### P9 - `/immigration-lawyer`

- GSC: 43,300 impressions, 100 clicks, 0.23% CTR, average position 40.5.
- Intent: immigration / foreign jurisdiction lawyer.
- First action: classify sub-intents into countries and feed unserved demand.
- Business note: this is directly related to the Thailand-lawyer call. If no partner exists, log demand and recruit country-specialist lawyers.

### P10 - `/german-passport`

- GSC: 46,747 impressions, 13 clicks, 0.03% CTR, average position 43.2.
- Intent: German passport / citizenship assistance.
- First action: decide if Jus-Tice has lawyer/service coverage. If yes, strengthen CTA. If no, feed Unserved Demand Ledger.

## Exclusions For This Batch

- `/beginners-guide-how-to-choose-the-best-website-builder`: high impressions but not legal money intent.
- `legalzoom`: branded competitor/info query, low priority.
- generic legal encyclopedia pages without lawyer-intent should support hubs, not lead the rescue.

## Execution Rules

1. Preserve all high-impression URLs until post-change GSC data proves a redirect is safe.
2. Every page gets one primary intent and one primary CTA.
3. Every page links upward to its practice hub and sideways to 2-4 related support pages.
4. Anchor text must describe the destination, not "read more".
5. For YMYL/legal pages, content must be practical, cautious, jurisdiction-aware, and avoid outcome promises.
6. If no paying lawyer coverage exists, add a business action: log/recruit partner instead of pretending coverage.

## Next Implementation Commit

Start with `/real-estate-attorney` and `/criminal-defense-attorney` because they combine highest impressions, clear commercial intent, and broad support clusters. The first implementation should produce draft title/H1/intro/CTA/internal-link blocks in repo docs or a safe importer draft, not publish live CMS changes without owner approval.

## Sources

- Google Search Central, link best practices: https://developers.google.com/search/docs/crawling-indexing/links-crawlable
- Brand Vision, law-firm SEO guide: https://www.brandvm.com/post/law-firm-seo-guide
- Digital Neighbor, 2026 law-firm website content guide: https://digitalneighbor.com/law-firm-website-content-guide
