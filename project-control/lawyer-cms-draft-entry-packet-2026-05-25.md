# Lawyer CMS Draft Entry Packet - 2026-05-25

## Purpose
This packet converts the reviewed public-index lawyer candidates into a draft-first wp-admin entry plan.

It is designed for fast manual CMS work after WordPress admin access is available, without accidentally publishing public cards or copying competitor assets.

## Non-Negotiable Safety Rules
- Create these as drafts/private preparation first.
- Do not publish public cards until the owner explicitly approves activation.
- Do not copy competitor photos, reviews, ratings, recommendation badges or client quotes.
- Do not claim the lawyer is verified, recommended, paid or connected to Jus-Tice.
- Do not create new taxonomy terms unless the owner approves taxonomy work.
- Use the initials fallback for visuals unless the lawyer supplies or approves media.

## First 10 Draft Entries
| Order | Name | Source | Practice/City Instruction | Activation Boundary |
| --- | --- | --- | --- | --- |
| 1 | שלמה פרידמן | PsakDin | דיני משפחה, גירושין, ייפוי כוח מתמשך, ירושות וצוואות, הסכמי ממון / Use existing city term if present: באר שבע. Do not create a new city term without owner approval. | post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified |
| 2 | מארי שני עשהאל | PsakDin | דיני משפחה, ירושות וצוואות, גירושין, הסכמי ממון, מזונות / Use existing city term if present: באר שבע. Do not create a new city term without owner approval. | post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified |
| 3 | זמירה צדוק | PsakDin | דיני משפחה, גירושין, משמורת, חלוקת רכוש, הסכמי ממון / Use existing city term if present: קרית ביאליק. Do not create a new city term without owner approval. | post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified |
| 4 | ענת וילנאי | PsakDin | דיני משפחה, גישור במשפחה, גירושין, מזונות, משמורת / Use existing city term if present: שורש. Do not create a new city term without owner approval. | post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified |
| 5 | שמואל גרוס | PsakDin | דיני משפחה, טוען רבני, גירושין, מזונות, ירושות וצוואות / Use existing city term if present: כפר סבא. Do not create a new city term without owner approval. | post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified |
| 6 | שני נורי | PsakDin | דיני משפחה, גירושין, הסכמי ממון, מזונות, חלוקת רכוש / Use existing city term if present: רעננה. Do not create a new city term without owner approval. | post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified |
| 7 | טלי בן יקיר | PsakDin | דיני משפחה, גירושין, מזונות, משמורת, חלוקת רכוש / Use existing city term if present: כפר סבא. Do not create a new city term without owner approval. | post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified |
| 8 | ירדן שלומי | PsakDin | דיני משפחה, גירושין, ירושות וצוואות, משמורת, מזונות / Use existing city term if present: קרית מוצקין. Do not create a new city term without owner approval. | post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified |
| 9 | צבי טהורי | PsakDin | דיני משפחה, גירושין, מקרקעין ונדל"ן, ירושות וצוואות / Leave city empty until manually validated in wp-admin. | post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified |
| 10 | ד"ר איריס טרומן | LawReviews | דיני משפחה, גירושין, צוואות וירושות, ייפוי כוח מתמשך / Leave city empty until manually validated in wp-admin. | post_status=publish; profile_status=public; source_type=public_index; verification_status=unverified |

## Required Meta Defaults
- post_type: `justice_lawyer`
- initial post status: draft/private preparation only
- `plan_type=free`
- `subscription_status=inactive`
- `verification_status=unverified`
- `source_type=public_index`
- draft `profile_status=pending`
- public activation, only after explicit owner approval: `post_status=publish`, `profile_status=public`, `admin_profile_visibility=auto`

## Generated Files
- CSV entry sheet: `project-control/lawyer-cms-draft-entry-packet-2026-05-25.csv`
- JSON report: `reports/lawyer-cms-draft-entry-packet-2026-05-25.json`

## Completion View
- Prepared draft-entry packet: 10 lawyer candidates.
- Live CMS records created in this run: 0.
- Public cards activated in this run: 0.
