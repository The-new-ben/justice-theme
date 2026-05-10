# Slug Normalization Rules

**Use:** When creating or editing any URL slug on jus-tice.co.il.

---

## 1. Hard rules

| # | Rule |
|---|---|
| 1 | ASCII only. No Hebrew, no Cyrillic, no emoji, no `&`, `?`, `+`, `%`, `'`, `"`. |
| 2 | Lowercase only. Never `Divorce-Lawyer`. |
| 3 | Words joined by single `-` (kebab-case). NEVER `_`, NEVER spaces, NEVER `.`. |
| 4 | Maximum 60 characters. Beyond that, trim semantically. |
| 5 | Money keyword goes first. `divorce-lawyer` ✓ — `lawyer-divorce` ✗. |
| 6 | Singular over plural unless plural is the actual search term. `divorce-lawyer` ✓ — `divorce-lawyers` only if SERP demands it. |
| 7 | No stop words (`the`, `a`, `of`, `in`, `for`) unless removing them changes meaning. |
| 8 | No trailing numbers. `divorce-lawyer-2` is a duplicate symptom — fix the duplicate, do not normalize the suffix. |
| 9 | No date prefixes. `2026-divorce-lawyer` is wrong — page lifetime exceeds the year. |
| 10 | No category prefix in the slug. `family-law-divorce-lawyer` is wrong — that's what the breadcrumb is for. |

---

## 2. Hebrew → English slug map (canonical)

| Hebrew topic | Slug |
|---|---|
| עורך דין גירושין | `divorce-lawyer` |
| עורך דין פלילי | `criminal-lawyer` |
| עורך דין תעבורה | `traffic-lawyer` |
| עורך דין מקרקעין | `real-estate-lawyer` |
| עורך דין דיני עבודה | `labor-lawyer` |
| עורך דין ירושה | `inheritance-lawyer` |
| עורך דין רשלנות רפואית | `medical-malpractice-lawyer` |
| עורך דין נזיקין | `personal-injury-lawyer` |
| עורך דין משפחה | `family-lawyer` |
| עורך דין מסחרי | `commercial-lawyer` |
| עורך דין ביטוח לאומי | `social-security-lawyer` |
| עורך דין הגירה | `immigration-lawyer` |
| גירושין בהסכמה | `consensual-divorce` |
| גישור גירושין | `divorce-mediation` |
| מזונות ילדים | `child-support` |
| משמורת ילדים | `child-custody` |
| חלוקת רכוש | `divorce-property-division` |
| בקשה ליישוב סכסוך | `dispute-resolution-request` |
| הסכם ממון | `prenuptial-agreement` |
| חקירה במשטרה | `police-investigation` |
| כתב אישום | `indictment` |
| מעצר ימים | `pretrial-detention` |
| עבירות סמים | `drug-offenses` |
| עבירות מין | `sex-offenses` |
| צווארון לבן | `white-collar-crime` |
| נהיגה בשכרות | `drunk-driving` |
| השעיית רישיון | `license-suspension` |
| ביטול דוחות | `traffic-tickets` |
| קניית דירה | `buying-apartment` |
| חוזה מכר | `real-estate-purchase-agreement` |
| רישום בטאבו | `land-registry` |
| ליקויי בנייה | `construction-defects` |
| התחדשות עירונית | `urban-renewal` |
| פיטורים שלא כדין | `wrongful-termination` |
| הסכם עבודה | `employment-agreement` |
| צוואה | `will` |
| ניהול עיזבון | `estate-administration` |
| התנגדות לצוואה | `will-contest` |

---

## 3. City slugs (canonical, English)

| Hebrew | Slug |
|---|---|
| תל אביב | `tel-aviv` |
| ירושלים | `jerusalem` |
| חיפה | `haifa` |
| ראשון לציון | `rishon-lezion` |
| פתח תקווה | `petah-tikva` |
| אשדוד | `ashdod` |
| נתניה | `netanya` |
| באר שבע | `beer-sheva` |
| חולון | `holon` |
| בני ברק | `bnei-brak` |
| רמת גן | `ramat-gan` |
| אשקלון | `ashkelon` |
| רחובות | `rehovot` |
| בת ים | `bat-yam` |
| הרצליה | `herzliya` |
| כפר סבא | `kfar-saba` |
| מודיעין | `modiin` |
| נצרת | `nazareth` |
| לוד | `lod` |
| רמלה | `ramla` |

These slugs MUST match `taxonomy-city.php` (`jte_seed_cities()` in the plugin) so the city filter URL maps correctly.

---

## 4. Lawyer profile slugs

Format: `{english-firstname}-{english-lastname}` OR `{firm-slug}`.

Avoid:
- `lawyer-john-doe` (redundant — the URL is already under `/lawyers/`)
- `john-doe-attorney` (redundant)
- `john_doe`, `johndoe`, `JohnDoe`

Prefer:
- `john-doe`
- `cohen-rotenberg-law` (when it's a firm profile)

If two lawyers share a name, append a city: `john-doe-tel-aviv`. NEVER append `-2`.

---

## 5. Article slugs

Article slugs may differ from the title to optimize for the keyword. Examples:

| Article title (Hebrew) | Slug |
|---|---|
| מדריך מקיף לגירושין בהסכמה | `consensual-divorce-guide` |
| מה לעשות כשמזמינים אותך לחקירה במשטרה | `police-investigation-what-to-do` |
| כל מה שצריך לדעת על קניית דירה ראשונה | `buying-first-apartment-guide` |
| איך לבטל דוח תנועה | `how-to-cancel-traffic-ticket` |

Rule of thumb: the slug is the **search query in English keywords**, not the headline.

---

## 6. Operational checklist

Before publishing any new URL:

- [ ] Slug follows all 10 hard rules in §1
- [ ] If it's a topic, slug appears in §2 mapping (or is added)
- [ ] If it's a city, slug appears in §3
- [ ] No existing URL targets the same keyword (check `cannibalization-map.csv`)
- [ ] If migrating from an old URL, entry exists in `url-migration-map.csv` with redirect type
- [ ] Internal links updated
- [ ] Breadcrumb makes sense
- [ ] If it's a pillar PAGE, FAQ section exists, lawyer carousel exists
