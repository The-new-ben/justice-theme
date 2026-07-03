# SERP anatomy: עורך דין גירושין (2026-07-02)

Full-page mapping of the divorce-lawyer SERP: who ranks, what their
pages contain, what Google's autocomplete reveals about demand, and why
Google chose each winner. Method now codified in
.claude/skills/serp-anatomy. Our standing from GSC (Google's own
position telemetry): 81,023 impressions/month across 217 query
variants, near zero clicks.

## 1. Demand map from Google autocomplete (live API, real data)

Top non-geo suggestion for the head term: מחיר. Geo variants dominate
volume: תל אביב, מרכז, באר שבע, חיפה, ירושלים, אשדוד, צפון, ראשון
לציון, רמת גן, כפר סבא, כרמיאל, מודיעין, נתניה. Reputation modifiers:
מומלץ, המלצות, ביקורות, תותח, הכי טובים. People also search lawyer
NAMES plus ביקורות or תמונות: profile pages with real photos and
reviews are a distinct demand class.

Untapped suggestion intents (no strong page of ours):
- עורך דין גירושין מטעם המדינה / מהמדינה (legal aid eligibility)
- עורך דין גירושין מנרקסיסט (high-emotion niche, article gap)
- כמה עולה לעשות הסכם גירושין אצל עורך דין (agreement-cost variant)
- One firm (הרשקוביץ) owns an autocomplete suggestion WITH its brand
  attached to the phrase דיני משפחה וצוואות: entity association at
  its strongest. That exact phrase gets 1,242 impr/mo in our GSC at
  position 18.5.

## 2. SERP composition by intent

### Head (עורך דין גירושין, 8.5k impr, we are at ~84)
10 of 10 organic results are individual practitioner sites. Zero
directories. Google classifies this as hire-a-person intent.
Title formula every winner uses: head keyword first, then דיני משפחה,
then a YEARS number (20/25/38 שנות ניסיון or הצלחה). One winner even
carries a phone number in the title.

### Price (כמה עולה + מחיר + עלות + שכר טרחה, ~6.4k impr, we are at ~50)
Article format wins. rotenberglaw.co.il (owner asset) is #1.
Winners share: year in H1 (2025/2026), concrete ranges stated early,
transparency disclaimers, FAQ, heavy internal mesh.

### Local תל אביב + במרכז (~15k impr incl במרכז, we are at ~30 and #10 live)
Practitioner sites plus ONE directory (d.co.il #4): local intent
tolerates aggregators. rotenberglaw holds #2 and #5. Our Maya profile
is #10 live. Three of ten results are owner-controlled.

### מומלץ family (~12.5k impr, we are at 30-60)
Practitioners plus review platforms (מידרג). Nobody ranks without
visible ratings. Our verified-review system is built; stars unlit
until first approved case-linked reviews.

## 3. Landing page teardowns (what the winners actually contain)

### rotenberglaw price guide (#1 price SERP, owner asset)
H1 carries year. 9 H2 sections, ~4,000 words. Concrete ranges early:
consultation 500-1,500; consent divorce 7,000-20,000; litigation
30,000-150,000+; mediation 700-2,000/hour. Author EEAT (Dun's, BDI,
בע"מ 919/15). 80+ internal links. Weaknesses to exploit on OUR page:
no price TABLE, no FAQ schema, no calculator.

### sayag-law price page (מחירון 2026)
The strongest FORMAT on the price SERP: comparison table with 8
service categories, an interactive cost calculator, secondary cost
table (אגרות, שמאות), year 2026 in H1, Google stars badge (4.5, 15+
reviews), bar-association citations, estimate-only disclaimer. This is
the format target to beat.

### lucymeir (head SERP)
4,500-5,500 words on the homepage. Quantified claim: 8 מתוך 10 מקרים
מסתיימים בהסכם. 8 embedded testimonial videos, TV section, Dun's
badge, 3 staff bios, 20+ divorce service pages, 8+ CTAs, sticky phone.
Positioning: negotiation-first (התגרשו אחרת).

### gerushin.co.il / ליבוביץ (head SERP, exact-match domain)
38 שנות ניסיון repeated. 500+ articles on site, 80+ internal links on
the homepage, 5 NAMED testimonials with photos, media authority
(Walla forum, bar lectures). Depth is the moat.

### OUR Maya profile (live #10 on TLV SERP)
Strengths: trust density (license 32125, Dun's, BDI, בע"מ 919/15,
verified badge, 4-step process, sources cited). Gaps found by
teardown, ranked by SERP impact:
1. Zero social proof rendered: no stars, no testimonials (system
   built, needs first approved reviews).
2. Word depth 1,100-1,400 vs winners' 2,500-5,500.
3. FAQ has 4 items; winners carry 8-12.
4. Video section exists but EMPTY (remove or fill; empty section is
   a negative quality signal).
5. No fee-transparency block (winners state ranges; bar-safe as
   estimate disclosure).
6. Title lacks תל אביב token on a local-intent SERP.
7. Verify Attorney/Person + Breadcrumb JSON-LD actually renders on
   the profile (schema built platform-wide; confirm on this URL).

## 3b. Number-one pages, verbatim signals (curl, raw HTML)

### Head #1: divorce1.co.il (הרשקוביץ)
- TITLE: "עורך דין גירושין, דיני משפחה וצוואות >> משרד עורכי דין יוסי הרשקוביץ"
- H1: TWO H1s ("ראשי" + "משרד עורך דין גירושין יוסי הרשקוביץ ושות'"),
  technically sloppy markup that still ranks #1.
- First paragraph: hero boilerplate ("מסורת של מצוינות ותוצאות") with
  phone CTA. Not content-led.
- JSON-LD: Organization, WebSite, BreadcrumbList, SearchAction (no
  Person, no Article).
- modified_time 2026-05, WordPress.
- Verdict: wins on ENTITY and history (exact-topic domain, years of
  links, the brand owns an autocomplete suggestion), not on on-page
  polish. Lesson: head-term entry cost is entity strength, so build
  the profile person-entity and the silo before attacking it.

### Price #1: rotenberglaw.co.il 2025 guide (owner asset)
- TITLE = H1 exactly: "כמה יעלה עורך דין לענייני גירושין בשנת 2025,
  מדריך ומחירים עדכניים" (year in H1).
- META DESCRIPTION: MISSING ENTIRELY, and the page still holds #1.
  Content depth plus entity beats meta polish.
- First paragraph: textbook intent mirror: names the emotional and
  legal complexity, states that price ranges are WIDE, then promises
  the factor breakdown. No fluff opener.
- JSON-LD: Person, ContactPoint, GeoCoordinates, PostalAddress,
  OpeningHoursSpecification (local person-entity stack), but NO
  Article and NO FAQPage: both are free upgrades for our own page
  (and for the owner asset itself).
- Lesson for OUR price page: match the format (year H1, ranges early,
  factor breakdown), then EXCEED with what #1 lacks: price TABLE,
  FAQPage schema, meta description, calculator (sayag has the table
  and calculator but weaker entity).

### Local #1: gohar-law.co.il (עורך דין גירושין במרכז)
- TITLE packs three variants: "עורך דין גירושין במרכז - עורך דין
  לענייני משפחה בתל אביב אתי גוהר - ייעוץ מקצועי בתיקי משפחה".
- H1 mirrors the query EXACTLY: "עורך דין גירושין במרכז".
- First paragraph opens with STATISTICS (כ-40% מהנישואים הראשונים,
  כ-60% מהשניים מתגרשים) then repeats the query phrase and promises
  agreement-first handling. Numbers in the first two sentences.
- JSON-LD: Article + Person + Organization + BreadcrumbList (the
  fullest stack of the three).
- modified_time 2024-10: local SERPs tolerate staleness; entity and
  exact-match H1 carry it.
- Lesson for Maya's profile: exact city phrase in title and H1
  variant, statistics in the opening, Person plus Article schema.

## 4. Why Google chose the winners (transferable rules)

1. Intent-format match beats authority: an article cannot win the
   head term; a firm homepage cannot win the price query.
2. Person-entity EEAT is the head-term currency: name, photo, years
   number IN TITLE, media proof, named testimonials.
3. Exclusive topical focus: winners' entire sites are family law.
   Generalist portals appear only where intent tolerates aggregation
   (local, price, מומלץ).
4. Quantified claims outrank adjectives: 8 מתוך 10, 38 שנים, 4.5
   כוכבים. Never unverifiable superlatives.
5. Freshness is a title token on price SERPs (2025/2026 in H1), not
   just a lastmod date.
6. Internal mesh depth (80+ topical links, 20+ service pages) marks
   the topical authority threshold.
7. Autocomplete is the demand oracle: it surfaces the modifiers
   Google itself completes toward (מחיר first, then cities, then
   reputation).

## 5. Play sequence (agreed logic, pending owner go per strike)

1. PRICE strike: rebuild our divorce-cost page to beat sayag's
   format (table + FAQ schema + year H1 + ranges as estimates with
   disclaimer). We hold the #1 site's playbook and its weaknesses.
2. Maya profile: title + תל אביב token; first case-linked reviews to
   light stars; FAQ to 10; fill or drop video block; fee-estimate
   block; depth toward 2,500 words. Target: #10 to #5 on the TLV SERP.
3. מומלץ family: directory + profiles once real stars render.
4. Head term: last; requires the family-law silo mesh + person EEAT
   at practitioner grade.

Do not retitle winners twice in one GSC cycle. Measure at next pull.
