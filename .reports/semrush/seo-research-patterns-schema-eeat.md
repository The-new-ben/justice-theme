# SEO Research Report — Hebrew Legal SERPs + Schema + E-E-A-T + Calculator
**Research by subagent on:** 2026-05-22
**Topics:** Hebrew SERP patterns, child support calculator (בע"מ 919/15), disavow process, E-E-A-T for legal sites, complete schema markup

---

## TASK 1: Hebrew Legal SERP Patterns

### What Content Formats Win in Israeli Legal SERPs?

**Winner: Long-form guides + Q&A pages (hybrid format)**

1. **Comprehensive FAQ/Guide pages** — 2,000–4,000 words covering a topic end-to-end in plain Hebrew. Rank for many related keywords simultaneously.
2. **Q&A pages** — Dedicated "שאלות ותשובות" perform exceptionally well. Matches how Israelis ask legal questions (informal phrasing, not statute-based).
3. **Interactive calculator pages** — Extreme dwell time (5–12 minutes), very low bounce rate. Critical for מחשבון מזונות, מחשבון פיצויי פיטורים.
4. **Law firm profile pages** — Rank for geo + practice-area combos but lose to informational content on general queries.
5. **Court ruling summaries** — "פסק דין + keyword" attract researcher intent and earn editorial backlinks.

### Hebrew SEO Specifics
- Hebrew is morphologically complex — use all inflected forms naturally (גירושין/גרושים/גירושיו). Cover variations, don't keyword-stuff.
- RTL technical implementation must be flawless — broken RTL signals poor UX quality to Google
- Search intent in Hebrew legal: **60% informational / 40% transactional**
- `hreflang` needed ONLY if you add Arabic or English content

### Why kolzchut.org.il Dominates

**kolzchut.org.il is literally government infrastructure:**
1. Governmental Status — operates under formal government decision since 2021, funded by Ministry of Justice + National Digital Agency → quasi-official `.gov.il` treatment
2. Gets natural backlinks from ALL gov.il ministries, municipalities, public hospitals, academic institutions
3. 7,000+ entries — massive topical authority across ALL legal verticals simultaneously
4. Written in simple plain Hebrew — matches exactly how people search
5. Zero commercial intent → Google rewards in YMYL verticals

**Strategic implication:** Cannot out-kolzchut kolzchut. WIN by targeting transactional queries (עורך דין X), cost queries, comparison queries. Use their content as a reference for comprehensiveness, then add commercial conversion layers.

---

## TASK 2: Child Support Calculator — Build Spec

### The Formula: הלכת בע"מ 919/15 (2017 Supreme Court)

**There is NO single rigid formula** — Israeli courts use guidelines from 2017 Supreme Court ruling. Multi-step calculation:

**Step 1:** Determine child's total monthly needs (essential + non-essential)
**Step 2:** Calculate each parent's "available income" (gross minus self-support reserve ~₪5,500/month minimum)
**Step 3:** Apply income ratio (each contributes proportionally to share of combined net income)
**Step 4:** Custody time offset (more custody time = more direct expenses absorbed = credit)
**Step 5:** Court adjustment (special needs, large income gaps, existing assets can modify)

**Ages 0–6:** Father pays ALL essential needs (religious personal law applies)
**Ages 6–18:** Shared proportional obligation per 919/15

### Calculator Input/Output Spec

```
INPUTS:
- Parent A net income: [₪ field]
- Parent B net income: [₪ field]
- Number of children: [1–6 dropdown]
- Ages of children: [ranges: 0-6 / 6-18]
- Custody split (%): [slider 0–100]
- Special needs: [checkbox]

OUTPUT:
- Estimated range ₪X–₪Y/month
- Legal disclaimer: "כלי עזר בלבד — אינו מחליף ייעוץ משפטי"
```

**Complexity:** Medium. 4–6 input fields + JavaScript formula engine. Prominent legal disclaimer required.

### Why Calculator Pages Rank So Well
1. Extreme dwell time (5–15 minutes) → Google interprets as high relevance
2. Zero-click defense — even with AI Overview, users click through to USE the tool
3. Lead magnet — captures people at research stage; form after calculator = lead
4. Backlink magnet — other sites link to calculators as resources
5. Keywords captured: מחשבון מזונות, חישוב מזונות, מזונות לפי הלכת 919/15, כמה מזונות אצלם
6. gerushin.co.il uses their calculator as #1 traffic driver — ranks for dozens of related long-tails

### Recommended Page Structure for /child-support/

```
H1: מחשבון מזונות ילדים 2025 — לפי הלכת בע"מ 919/15
[Interactive calculator — above fold]
H2: מהי הלכת בע"מ 919/15?
H2: איך מחשבים מזונות ילדים — שלב אחר שלב
H2: מחשבון מדד מזונות לפי מספר ילדים
H2: מזונות במשמורת משותפת — הבדלים חשובים
H2: מתי ניתן לשנות את סכום המזונות?
H2: שאלות נפוצות על מזונות ילדים [FAQPage schema]
H2: עורכי דין מומלצים למזונות ילדים
CTA: "קבל ייעוץ חינם מעורך דין מזונות"
Author bio: attorney with credentials
```

---

## TASK 3: Disavow File — Complete Spec

### Exact File Format

```txt
# Google Disavow File — jus-tice.co.il
# Created: 2026-05-22
# Purpose: Remove toxic casino/gambling spam links

domain:best-casino-payid-australia.com
domain:mostbet.com
domain:moscowtimes.top
domain:mostbet-sport.com
domain:mostbet-casino.com
```

### File Requirements
- Format: Plain `.txt` file, UTF-8 or 7-bit ASCII
- Max size: 2MB, Max lines: 100,000
- One URL or domain per line
- Comments start with `#`
- `domain:example.com` = disavows ALL pages on domain (recommended for spam networks)
- **IMPORTANT: Every new upload REPLACES the old file entirely. Always include all previously disavowed domains.**

### Step-by-Step Submission
1. Export full backlink list from SEMrush (Backlink Audit → Toxic tab → Export all)
2. Sort by anchor text — flag all: "best casino", "mostbet", "kasyno", "casino", "gambling"
3. Create disavow.txt using format above
4. Go to: https://search.google.com/search-console/disavow-links
5. Select property: jus-tice.co.il
6. Click "Disavow Links" → "Upload disavow list"
7. Processing time: 2–6 weeks

### Domains to Definitely Disavow
| Domain/Anchor | Reason | Priority |
|--------------|---------|----------|
| `best-casino-payid-australia.com` | Zero relevance + casino anchor | 🔴 HIGH |
| `mostbet` (any domain) | Known gambling spam network, mass-injected into WordPress | 🔴 HIGH |
| `moscowtimes.top` | `.top` TLD + Russian news spam pattern | 🔴 HIGH |
| `kasyno` (Polish casino) | Foreign language gambling, irrelevant | 🔴 HIGH |

**Caveat:** Google says it ignores random spam automatically. BUT for YMYL legal site, gambling anchors create E-E-A-T trust damage — strongly recommended to disavow.

---

## TASK 4: E-E-A-T for Legal Sites — Full Signal Map

### 4 E-E-A-T Dimensions (Priority Order for Legal/YMYL)

**🏆 Trustworthiness (Most Critical)**
- HTTPS everywhere
- Physical address + phone on EVERY page (header/footer)
- Privacy policy + terms of service
- Israeli Bar Association registration number displayed
- No misleading claims or outcome guarantees (bar ethics + E-E-A-T)
- "עודכן לאחרונה" date on every article
- External validation: links FROM authoritative Israeli legal/government sources

**🎓 Expertise**
- Every article must have a **named attorney author** (not "צוות המערכת")
- Author bio: full name, bar number, years experience, practice areas, law school
- Link author bio to Israeli Bar Association member directory entry
- Cite: Supreme Court rulings, Knesset legislation, gov.il sources
- Content must reflect current law (2024–2025 updates)

**🏛️ Authoritativeness**
- Backlinks from: Israeli legal publications, law faculties (TAU, Hebrew U), legal news (calcalist legal section, TheMarker)
- Mentions in Israeli press
- Guest contributions to established legal publications
- Legal directory listings: Israeli Bar Association, Dun & Bradstreet Israel, זה"ב
- Brand searches by name = authority signal

**💡 Experience**
- Case study summaries (anonymized): "לקוח שלנו קיבל X ₪ בתביעה מסוג Y"
- Attorney photos + video introductions
- "כמה שנים ניסיון" explicitly stated in bios and practice area pages
- Awards, speaking engagements, media appearances listed

### Attorney Bio Page Checklist
```
✅ Professional photo
✅ Full name + "עו"ד" designation
✅ Israeli Bar number
✅ Law school + graduation year
✅ Years of practice
✅ List of practice areas
✅ Notable cases (anonymized)
✅ Publications/articles written
✅ External links: Bar Association profile, LinkedIn
✅ Person schema markup
```

### Legal Article Checklist
```
✅ Named attorney author + link to bio
✅ Publish date + "עודכן:" last-updated date
✅ Sources cited (gov.il, court rulings with case numbers)
✅ "הכותב/ת עו"ד [Name], [X] שנות ניסיון ב[practice area]"
✅ Article/BlogPosting schema with author property
✅ Minimum 1,000 words of substantive legal content
```

### Proven Case Study (English law firm, same principles)
- Attorney bios + Person schema + Article schema + FAQPage schema
- Rankings improved from position 32.8 → 11.3 (65% gain)
- Impressions: +93% (373K → 719K)
- 2,721 AI citation mentions in Bing Copilot

---

## TASK 5: Schema Markup — Complete Code Ready to Implement

### Schema 1: LegalService + WebSite @graph (Sitewide — add to `<head>`)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LegalService",
      "@id": "https://jus-tice.co.il/#organization",
      "name": "Justice — מאגר משפטי ישראלי",
      "alternateName": "jus-tice.co.il",
      "url": "https://jus-tice.co.il",
      "logo": "https://jus-tice.co.il/wp-content/uploads/logo.png",
      "description": "מאגר משפטי מקיף לישראל — מידע על עורכי דין, פסקי דין, חוקים ומדריכים משפטיים בעברית",
      "telephone": "+972-XX-XXXXXXX",
      "email": "info@jus-tice.co.il",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "[כתובת]",
        "addressLocality": "[עיר]",
        "postalCode": "[מיקוד]",
        "addressCountry": "IL"
      },
      "areaServed": {
        "@type": "Country",
        "name": "Israel"
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Sunday","Monday","Tuesday","Wednesday","Thursday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "inLanguage": "he"
    },
    {
      "@type": "WebSite",
      "@id": "https://jus-tice.co.il/#website",
      "url": "https://jus-tice.co.il",
      "name": "Justice — מאגר משפטי ישראלי",
      "inLanguage": "he",
      "publisher": {"@id": "https://jus-tice.co.il/#organization"},
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://jus-tice.co.il/?s={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
}
</script>
```

### Schema 2: FAQPage (add to every pillar page's FAQ section)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "איך מחשבים מזונות ילדים בישראל?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "חישוב מזונות ילדים בישראל מתבצע לפי הלכת בע\"מ 919/15 (2017). לילדים מגיל 6 עד 18, החובה מוטלת על שני ההורים לפי יחס הכנסותיהם ולפי חלוקת זמני המשמורת."
      }
    },
    {
      "@type": "Question",
      "name": "כמה מזונות משלמים על ילד אחד?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "סכום המזונות לילד אחד תלוי בהכנסות שני ההורים ובזמני המשמורת. בממוצע, עבור ילד אחד, הסכום נע בין 1,500 ל-4,000 ₪ לחודש."
      }
    },
    {
      "@type": "Question",
      "name": "האם אפשר להפחית מזונות?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "כן. ניתן לפנות לבית המשפט לענייני משפחה בבקשה להפחתת מזונות במקרים של שינוי מהותי בנסיבות: ירידה משמעותית בהכנסות, שינוי בסדר המשמורת, הגעת ילד לגיל 18."
      }
    }
  ]
}
</script>
```

### Schema 3: BreadcrumbList (inner pages)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "דף הבית", "item": "https://jus-tice.co.il/"},
    {"@type": "ListItem", "position": 2, "name": "דיני משפחה", "item": "https://jus-tice.co.il/family-law/"},
    {"@type": "ListItem", "position": 3, "name": "מחשבון מזונות ילדים", "item": "https://jus-tice.co.il/family-law/child-support/"}
  ]
}
</script>
```

### Schema 4: Person (attorney bio pages)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://jus-tice.co.il/lawyers/attorney-name/#person",
  "name": "שם עורך הדין",
  "jobTitle": "עורך דין",
  "worksFor": {
    "@type": "LegalService",
    "@id": "https://jus-tice.co.il/#organization"
  },
  "alumniOf": {
    "@type": "EducationalOrganization",
    "name": "אוניברסיטת תל אביב — הפקולטה למשפטים"
  },
  "knowsAbout": ["דיני משפחה", "גירושין", "מזונות ילדים", "משמורת"],
  "memberOf": {
    "@type": "Organization",
    "name": "לשכת עורכי הדין בישראל"
  },
  "url": "https://jus-tice.co.il/lawyers/attorney-name/",
  "image": "https://jus-tice.co.il/wp-content/uploads/attorney-photo.jpg",
  "sameAs": [
    "https://www.linkedin.com/in/attorney-name",
    "https://www.israelbar.org.il/member/XXXXXX"
  ]
}
</script>
```

### Schema 5: Article (legal articles — with E-E-A-T author)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "כותרת המאמר המשפטי",
  "description": "תיאור קצר (160 תווים)",
  "author": {
    "@type": "Person",
    "@id": "https://jus-tice.co.il/lawyers/attorney-name/#person"
  },
  "publisher": {
    "@type": "LegalService",
    "@id": "https://jus-tice.co.il/#organization"
  },
  "datePublished": "2025-01-15",
  "dateModified": "2025-05-22",
  "inLanguage": "he",
  "url": "https://jus-tice.co.il/articles/article-slug/"
}
</script>
```

### Schema 6: CollectionPage + ItemList (lawyer directory pages)

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "עורכי דין פליליים מומלצים בישראל",
  "description": "רשימת עורכי דין פליליים המומלצים לפי חוות דעת לקוחות",
  "url": "https://jus-tice.co.il/criminal-defense-attorney/",
  "mainEntity": {
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "LegalService",
          "name": "שם משרד עו\"ד",
          "url": "https://jus-tice.co.il/lawyers/attorney-name/",
          "telephone": "+972-XX-XXXXXXX",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "תל אביב",
            "addressCountry": "IL"
          }
        }
      }
    ]
  }
}
</script>
```

---

## Priority Action Plan (Ranked by Impact)

| Priority | Action | Expected Impact |
|----------|--------|-----------------|
| 🔴 1 | Submit disavow file | Protect E-E-A-T trust score |
| 🔴 2 | Add LegalService + WebSite @graph sitewide | Rich results + knowledge panel |
| 🔴 3 | Create attorney bio pages with Person schema | Core E-E-A-T requirement |
| 🔴 4 | Add author byline + Article schema to all articles | E-E-A-T + AI citation eligibility |
| 🟡 5 | Build child support calculator (מחשבון מזונות) | High traffic + leads, KD 9 |
| 🟡 6 | Add FAQPage schema to all Q&A sections | Featured snippet + AI Overview |
| 🟡 7 | Add BreadcrumbList schema to inner pages | Better SERP display |
| 🟢 8 | Target transactional queries kolzchut doesn't own | Long-term traffic |
| 🟢 9 | Build topical clusters: גירושין, מזונות, פלילי, נזיקין | Domain authority growth |

**Schema validation tools:**
- https://search.google.com/test/rich-results
- https://validator.schema.org/
