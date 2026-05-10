# Slug Normalization Rules
## Date: 2026-05-10
## Phase: Analysis and Recommendation

---

This document defines the standard translation matrix for converting Hebrew legal terms into clean English URL slugs.

## 1. Practice Areas (Top-Level Silos)

| Hebrew | English Slug |
| :--- | :--- |
| דיני משפחה / גירושין | `/family-law/` |
| משפט פלילי | `/criminal-law/` |
| מקרקעין / נדל"ן | `/real-estate-law/` |
| דיני עבודה | `/labor-law/` |
| נזיקין / תאונות | `/personal-injury/` |
| דיני תעבורה | `/traffic-law/` |
| צוואות וירושות | `/wills-estates/` |
| רשלנות רפואית | `/medical-malpractice/` |
| מסחרי / חברות | `/corporate-law/` |
| מיסים | `/tax-law/` |
| סייבר ופרטיות | `/cyber-privacy/` |

## 2. Common Service Modifiers

| Hebrew | English Slug |
| :--- | :--- |
| עורך דין | `/lawyer/` (or `/attorney/` - stick to lawyer for consistency) |
| מומלץ / הטוב ביותר | Remove from slug (e.g., not `/best-lawyer/`) |
| הסכם | `/agreement/` |
| תביעה | `/lawsuit/` |
| חוזה | `/contract/` |

## 3. Cities

| Hebrew | English Slug |
| :--- | :--- |
| תל אביב | `/tel-aviv/` |
| ירושלים | `/jerusalem/` |
| חיפה | `/haifa/` |
| ראשון לציון | `/rishon-lezion/` |
| פתח תקווה | `/petah-tikva/` |
| באר שבע | `/beer-sheva/` |

## 4. Formatting Rules

1.  **Lowercase:** All slugs must be strictly lowercase.
2.  **Hyphens:** Use hyphens (`-`) for spaces. Never use underscores (`_`).
3.  **Stop Words:** Remove stop words (and, the, to, for, in, on, of).
    *   *Example:* "How to file for divorce in Israel" -> `/file-divorce-israel/`
4.  **Length:** Keep slugs under 5 words if possible.

---

## * AUDIT V2 REMARKS — 2026-05-10 14:01 IST

> Cross-ref: `project-control/deep-dive-audit-v2.md`

* **RULES DEFINED BUT NOT IMPLEMENTED.** All 10 seed lawyers use Hebrew slugs: `/lawyers/עוד-מאיה-רוטנברג/`. None follow the English pattern defined above.
* **Practice areas MIXED:** Some new terms (environmental-law, insurance-law, blockchain-crypto) use English slugs correctly. Legacy terms (family-law, criminal-law) use bare WP category slugs without `/practice-areas/` prefix. Rules above need to account for this migration.
* **City slugs NOT APPLIED.** "Herzliya" appears in English in one lawyer record while others are Hebrew. Normalization table above (§3) is correct but not enforced in data.
