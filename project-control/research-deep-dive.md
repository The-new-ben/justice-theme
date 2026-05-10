# Competitor Deep Dive

**Sources verified via web search May 2026.** See bottom for citations.

---

## 1. din.co.il — direct Israeli competitor (Hebrew)

**Position:** The dominant Israeli legal portal. Combines lawyer directory + forums + content + video.

### What din.co.il does well

| Surface | Detail |
|---|---|
| **Volume** | ~13,707 lawyers indexed, ~5,541 recommendations, hundreds of legal forums (one per practice area), tens of thousands of articles + court summaries. |
| **Lawyer directory** | Sortable by field of work + geographic location; each lawyer profile has practice areas, professional experience, recommendations. |
| **Lawyer-managed forums** | ~200 forums each managed by a lawyer in that field. This converts forum participation into authority + lead acquisition for the lawyer. |
| **Court rulings database** | Articles + summaries of court decisions across all areas of law. |
| **Video channel** | Hundreds of video clips by lawyers in different fields — strong E-E-A-T signal. |
| **Adjacent professionals** | Database of expert doctors, accountants, translators, engineers, appraisers. Recognizes legal cases need cross-disciplinary support. |
| **Recommendation system** | Public-facing recommendation count per lawyer. |

### What we should adapt

1. **Lawyer-managed Q&A** — Instead of a faceless contact form, the lead form on a lawyer's profile should let them post answers publicly that build their profile. (Future feature.)
2. **Recommendation system** — Build a structured recommendation collection. Compliance-bounded — Bar rules limit how recommendations are presented.
3. **Adjacent professional directory** — Phase 3+ feature.
4. **Video integration** — Lawyer profile field for YouTube video URL.

### What we will do better

- **Modern UI** — din.co.il's UI is dated (2008-era). A premium, mobile-first design is differentiating.
- **AI-driven intake** — Faster, more accurate lead routing.
- **Honest verification** — `verification_status` shown explicitly. din.co.il's "recommendation count" can be gamed.
- **Schema.org structured data** — din.co.il's pages don't fully expose Attorney/LegalService schema.

### What we will NOT copy

- Forum architecture — high moderation burden, spam-prone, slow ROI.
- Volume-first strategy — quality lawyer profiles > 13,000 stub profiles.

---

## 2. psakdin.co.il — direct Israeli competitor (court rulings + lawyers)

**Position:** Court rulings database + lawyer directory. Strongly content-led; weaker on directory UX.

### What psakdin.co.il does well

| Surface | Detail |
|---|---|
| **Court rulings database** | Searchable by lawyer name, case number, judge. Vast structured data. |
| **Topical depth** | Family law, real estate, inheritance, wills, defamation, national insurance, bankruptcy, contract law, commercial law, labor law, insurance claims, criminal law, real estate, consumer rights, intellectual property, family law, corporate law, debt collection, medical malpractice, personal injury, taxation, traffic, military affairs, national insurance. |
| **Israeli Bar membership** | Free membership for licensed lawyers — built-in trust + funnel. |
| **Search facets** | By lawyer, by case number, by judge — three pivots. |

### What we should adapt

1. **Topic taxonomy depth** — Our 10–12 practice areas should expand to ~25 sub-topics matching psakdin's coverage.
2. **Search by judge / case number** — Not now, but a useful future SEO play (each judge becomes a long-tail authority page).
3. **Lawyer authentication via Bar membership** — Phase 1: integration with Israel Bar Association (lsb.org.il) lookup so we can auto-verify license status.

### What we will do better

- **UI/UX** — psakdin is dense and academic; we go premium and accessible.
- **Lead capture** — psakdin doesn't aggressively monetize; our paid placements are more transparent and effective.

### What we will NOT copy

- Court rulings database scraping — copyright + complexity.
- "Pay per ruling view" model — paywall friction kills SEO.

---

## 3. Justia.com — international model (English)

**Position:** Global free lawyer directory + legal content + premium-placement monetization. Extremely strong SEO baseline.

### What Justia does well

| Surface | Detail |
|---|---|
| **Free profiles** | Every lawyer profile has full contact info, education, associations, practice areas, links to website/blog/social. |
| **Profile fields** | Practice areas, experience, fees, education, affiliations, jurisdictions, awards, languages, office locations, multiple phone numbers, multiple emails. |
| **SEO authority** | Justia profiles consistently rank in Google because Justia itself is high-DA. Any lawyer with a complete profile gets SEO halo. |
| **Premium Placement (paid)** | Enhanced listing above organic results, by practice area + metro area. Clear paid-vs-organic separation. |
| **Anti-duplicate-content guidance** | Warns lawyers not to paste bios from elsewhere — directly addresses the duplicate content trap. |
| **Practice-area limit** | Free profile shows in first 6 practice areas only — keeps SERPs clean and forces lawyers to specialize. |
| **Off-site SEO add-on** | Backlink building from the Justia link graph. |

### What we should adapt — DEEPLY

1. **Field-rich profiles** — our `justice_lawyer` CPT already has all these fields. Improve admin UX so lawyers actually fill them.
2. **Premium placement model** — already designed (`plan_type`, `priority_score`, `featured_until`). Wire to payment plugin.
3. **Practice-area cap** — limit free profiles to N areas; paid plans unlock more.
4. **Educational content for lawyers** — onboarding articles explaining "what makes a great profile" (SEO, photos, descriptions).
5. **Duplicate-content warning** — show in admin when lawyer's bio matches their main website's bio (use checksum).

### What we will do better

- **Hebrew + Israeli legal context** — Justia is English-only. We own the Israeli market.
- **Tighter integration with Israeli Bar verification** — license number + status pulled live.
- **Better mobile UX** — Justia's mobile is functional but not premium.

### What we will NOT copy

- Litigation tracking / case-law database — different product, different team.
- "Justia Connect" community feature — social-network features are high-cost.

---

## 4. Midrag.co.il — Israeli service-provider directory model (NOT legal)

**Position:** Israel's largest provider rating site, founded 2003. 144 service fields, 2M+ reviews. Massive corporate client base (Pelephone, Partner, Intel, Bank Mizrahi, DHL, etc.).

### What Midrag does well

| Surface | Detail |
|---|---|
| **Verified rating system** | Members rate professionals verbally + numerically AFTER receiving service. Built-in fraud control because review = post-service. |
| **Highest-ranked at top** | Default sort is rating — incentive aligned with quality. |
| **Mobile app + web** | iOS/Android apps drive habitual use. |
| **Corporate B2B2C distribution** | Big employers offer Midrag membership as a perk. Massive funnel. |
| **Trust positioning** | "Recommendations from fellow members" — peer trust over algorithmic. |

### What we should adapt

1. **Post-service-only reviews** — clients can only review a lawyer if they had an actual lead/case routed through us. Prevents fake reviews.
2. **Numeric + verbal review** — both star rating and free-text testimonial.
3. **B2B2C positioning** — partner with HR departments, unions, professional associations to offer "Jus-Tice for members" — they get vetted lawyers, we get distribution.
4. **Mobile app** — Phase 3+. PWA first.

### What we will do better

- **Compliance** — legal services have specific Bar rules around reviews/recommendations. We'll structure review presentation to match.
- **Lead-quality matching** — we know the lead's case type, can match better than Midrag's category-only pairing.

### What we will NOT copy

- "Pay to rank higher" hidden monetization — Midrag has been criticized for this. We make paid placements explicit ("פרופיל ממומן" badge).

---

## 5. Common patterns across all four (signals to follow)

| Pattern | All four | What it means for Jus-Tice |
|---|---|---|
| Search-first homepage | ✓ | Hero search must be the first interactive element. ✅ Done. |
| Practice area + city as primary axes | ✓ | Practice-area + city taxonomies are correct architecture. ✅ Done. |
| Profile = the asset | ✓ | The lawyer profile page is THE conversion surface. Must be premium. (✅ template solid; data quality TBD) |
| Footer dense link bar | ✓ | Already done — practice areas + cities. ✅ |
| Trust signals visible above fold | ✓ | Stats section + verification badges. ⚠️ Trust section is conditional now. |
| Lead form in 2+ places | ✓ | Hero search + ask-lawyer + per-lawyer inquiry. ✅ |
| Free profile + paid upgrade | ✓ | `plan_type` already supports free/pro/featured/lead_partner/full_service. ✅ |
| Mobile-first | ✓ | All four have decent mobile. Ours: ✅ done. |
| Hebrew (or local language) primary | ✓ for Israeli sites | ✅ Done. |
| Schema.org structured data | partial | We just added Attorney + LegalService. ✅ Done. |

---

## 6. Anti-patterns observed (avoid)

| Anti-pattern | Seen at | Why we avoid |
|---|---|---|
| Cluttered 2008-era UI | din.co.il | Bounce rate killer on mobile |
| Fake "best lawyers" lists | many directory clones | Bar rule violation + Google penalty |
| Hidden paid placements | various | Trust killer |
| Forum SEO spam | din.co.il (somewhat) | High moderation burden + spam vector |
| Pop-up overlays everywhere | various | Mobile UX killer + ranking penalty |
| Required registration to view content | psakdin (partial) | Kills organic SEO |
| Duplicate location pages with thin content | various lawyer-marketing sites | Penalty risk; we noindex combinatorial filters |

---

## 7. Quick take-aways → tasks

| Take-away | Task |
|---|---|
| din.co.il forum architecture is a moat | Phase 2: build "ask the lawyer" Q&A archive with named answer attribution |
| Justia field richness is the gold standard | Already matched; focus on admin UX |
| Midrag post-service review model | Build into the lead-status flow: when status=converted, trigger review request |
| psakdin Bar membership integration | Phase 2: integrate Israel Bar Association lookup API |
| Modern UI is the differentiator | Continue visual polish work |
| Lawyer education content (Justia onboarding articles) | Phase 1: write 5 onboarding guides for lawyers |
| Multi-channel: web + app | Phase 3: PWA |

---

## Sources

- [Din (אתר אינטרנט) – Wikipedia](https://he.wikipedia.org/wiki/Din_(%D7%90%D7%AA%D7%A8_%D7%90%D7%99%D7%A0%D7%98%D7%A8%D7%A0%D7%98))
- [din.co.il homepage](https://www.din.co.il/)
- [din.co.il lawyer search](https://www.din.co.il/SearchLawyer.asp?it=31)
- [psakdin.co.il](https://www.psakdin.co.il/)
- [Justia Lawyer Directory](https://www.justia.com/lawyers)
- [Justia Free Professional Profiles](https://lawyers.justia.com/lawyer-directory-listings)
- [Justia Premium Placements](https://www.justia.com/marketing/lawyer-directory/)
- [Midrag — service-rating LTD](https://il.linkedin.com/company/midrag)
- [Justia review on Lawyerist (2026)](https://lawyerist.com/reviews/seo-marketing/justia/)

Sources:
- [Din (אתר אינטרנט) – Wikipedia](https://he.wikipedia.org/wiki/Din_(%D7%90%D7%AA%D7%A8_%D7%90%D7%99%D7%A0%D7%98%D7%A8%D7%A0%D7%98))
- [din.co.il homepage](https://www.din.co.il/)
- [psakdin.co.il](https://www.psakdin.co.il/)
- [Justia Lawyer Directory](https://www.justia.com/lawyers)
- [Justia Premium Placements](https://www.justia.com/marketing/lawyer-directory/)
- [Justia review on Lawyerist (2026)](https://lawyerist.com/reviews/seo-marketing/justia/)
- [Midrag - Service rating LTD](https://il.linkedin.com/company/midrag)
