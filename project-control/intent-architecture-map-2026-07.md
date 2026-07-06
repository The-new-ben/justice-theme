# Intent architecture map, 2026-07-06

The structural doctrine after the deep scan. Source data: GSC
query+page pull, 28 days (2026-06-06 to 2026-07-04), 10,670 rows,
analyzed for intent collisions (a query splitting impressions across
2+ of our URLs). Found: 115 cannibalized queries. This file names ONE
canonical owner per intent per family. Every future article, title
change, or mesh edit must respect this map. The writer's
anti-cannibalization check now includes it.

## The law (applies to every future action)

1. One intent = one canonical page. Before creating or retitling
   anything, find the intent's owner here or add it here.
2. A fighting page is never deleted: it gets ONE distinct sub-intent
   (retitle per serp-strike) or is merged into the canonical
   (content absorbed, then hidden or 301, per-URL owner approval for
   301s of live URLs).
3. Cross-type slug collisions are now blocked in code
   (inc/slug-collision-guard.php). The 12 historical collisions were
   consolidated 2026-07-06 (see content-expedition-log).
4. Redirects point DIRECTLY at the canonical (45 two-hop chains were
   flattened 2026-07-06; keep it that way).

## FAMILY (worst cannibalization, fix first)

- עורך דין גירושין (head): canonical /divorce-lawyer/ (pillar).
  Fighters and their assigned sub-intents:
  - /women-lawyer-vs-men-divorce-lawyer/ owns עורכת דין גירושין (it
    already wins that query, 223 impr): retitle to the female-lawyer
    intent explicitly.
  - /lawyer-divorce/ merge-candidate into the pillar (staged, owner
    approval).
  - /the-recommended-family-lawyers/ + /most-recommended-family-lawyer/
    are TWO pages on one intent (מומלץ). Merge into ONE family-lawyers
    rating page (staged: keep the-recommended-family-lawyers, absorb
    the other, then hide it). The מומלץ intent lives there only.
- עורך דין משפחה / לענייני משפחה: canonical /family-law/ (2K stub,
  needs the 141K merge source, article 7310, absorbed and edited).
  /online-family-law-services/ owns the online sub-intent only.
- כמה עולה עורך דין גירושין: canonical /divorce-costs-2025/
  (expedition entry 35). /divorce-lawyer-cost/ merge-candidate
  (staged). /lawyer-fees-guide/ owns the ALL-fields fee-guide intent,
  title must not say גירושין first.
- הסכם גירושין: canonical /free-divorce-agreement-template/ (pos 7.4,
  1,339 impr, snippet target, entry 34). /consensual-divorce/ owns the
  PROCESS intent גירושין בהסכמה only: retitle away from the agreement
  wording.
- גישור גירושין: canonical /divorce-mediation/ (post-consolidation
  keeper). /mediation-divorce/ is a mirror duplicate: merge-candidate
  (staged).

## CRIMINAL

- עורך דין פלילי (head): canonical /criminal-defense-attorney/
  (consolidated 2026-07-06, single body, legacy redirect equity now
  flows here).
- עורך דין פלילי מומלץ: canonical /criminal-lawyers-rating/ (the
  rating page built for exactly this). Fighters to retitle to their
  own sub-intents: /lawyer-near-me-criminal-law/ (near-me intent),
  /famous-criminal-defense-lawyer/ (מפורסם, keeps its win),
  /best-criminal-defence-lawyers-worldwide/ (international intent,
  remove the superlative from the title).
- Cost: canonical /how-much-will-a-criminal-defense-lawyer-cost/
  (384 impr vs 110). /criminal-lawyer-cost/ merge-candidate (staged).
  /criminal-law-price-list/ is already 404, nothing to do.
- Staged 301 awaiting owner: /criminal-law-counsel-criminal-israel/
  into the pillar (June plan: no value lost).

## MEDICAL MALPRACTICE

- Pillar /medical-malpractice-lawyer/ consolidated (shadow hidden,
  merge source article 11607 staged for the entry-26 rebuild).
- רשלנות רפואית בלידה: TWO fighters,
  /medical-malpractice-lawyer-birth-recommended/ (260 impr, pos 41)
  vs /medical-malpractice-lawyer-birth-representation/ (42 impr).
  Canonical: -recommended (the winner). Merge -representation into it
  (staged). CORRECTION to expedition entry 29: this is a STRENGTHEN of
  the winner, do NOT create the new birth-injury-malpractice-lawyer
  slug.
- שיתוק מוחין: canonical /malpractice-cerebral-palsy/. /birth-injury/
  (consolidated 2026-07-06) owns the broader birth-injury intent;
  its title must lead with פגיעה בלידה, not שיתוק מוחין.

## ABROAD

- Portugal: canonical /portugal-relocation/ (pos 15-16 on both
  רילוקיישן לפורטוגל and הגירה לפורטוגל, closest page-1 win in the
  family). /immigration-to-portugal/ merge-candidate or retitle to
  visa-paths sub-intent (decide at entry-61 recon).
  /corporate-immigration-portugal/ keeps the B2B intent.

## REAL ESTATE

- עורך דין קניית דירה: canonical /lawyer-for-buying-or-selling-a-house/
  (entry 17). /real-estate-lawyer-cost-2025/ owns COST only: its title
  must lead with שכר טרחה/מחיר, never with קניית דירה.
  /real-estate-attorney/ (pillar) owns the head terms only.

## LABOR

- הטרדה מינית בעבודה: TWO published articles duplicate the intent:
  /employment-sexual-harassment/ vs /sexual-harassment-work/.
  Canonical: decide by GSC at entry-51 recon, merge the loser.
  CORRECTION to expedition entry 51: consolidate-and-strengthen, not
  new.

## Residual index hygiene (self-healing, no action)

- 47 old /articles/-prefixed URLs still earn ~1,100 impr; they 301 to
  the canonical root forms with correct self-canonicals. Google will
  drain them; do not touch.
- Sitemap clean (no hidden merged-src slugs). Exact-duplicate titles:
  zero. Redirect loops: zero.

## Prevention now in code

- inc/slug-collision-guard.php: cross-type slug uniqueness enforced on
  save (page vs articles vs post).
- Writer law addition: before any new article, check THIS map plus
  the live query: same-query search via GSC data, not only the slug.
