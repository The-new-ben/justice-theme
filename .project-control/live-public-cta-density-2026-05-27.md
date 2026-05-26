# Live Public CTA Density Audit - 2026-05-27

Status: PASS_WITH_DENSITY_REVIEWS

Base URL: https://jus-tice.co.il

Scope: read-only live audit for public visitor-facing CTA density and repetition. It checks whether sampled pages still feel like legal-help pages instead of noisy sales surfaces.

Safety: no login, CMS edit, title/H1/meta/body change, URL change, redirect, canonical/noindex, sitemap, taxonomy, lead, lawyer, supplier, invoice, payment, email, WhatsApp, TalkTo, wp-admin or uPress action was performed.

## Page Results

| Path | Status | HTTP | Primary CTAs | Unique CTA Texts | Article CTA Count | Duplicate Sidebar Class | Repeated Text | Repeated Href | Issues |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- | --- |
| / | REVIEW | 200 | 10 | 5 | 0 | 0 | שליחת פנייה (6) | - | repeated_primary_cta_text_review |
| /find-lawyer-how-to-find-good-attorney/ | PASS | 200 | 1 | 1 | 1 | 0 | - | - | - |
| /most-recommended-family-lawyer/ | PASS | 200 | 1 | 1 | 1 | 0 | - | - | - |
| /experienced-family-law-attorney/ | PASS | 200 | 1 | 1 | 1 | 0 | - | - | - |
| /national-insurance-attorney/ | PASS | 200 | 2 | 2 | 0 | 0 | - | - | - |
| /bituach-leumi-appeal-guide/ | PASS | 200 | 2 | 2 | 0 | 0 | - | - | - |
| /rental-agreement/ | PASS | 200 | 1 | 1 | 1 | 0 | - | - | - |
| /labor-lawyer/ | PASS | 200 | 1 | 1 | 1 | 0 | - | - | - |
| /consumer-rights-israel/ | PASS | 200 | 1 | 1 | 1 | 0 | - | - | - |
| /eviction-notice-israel/ | PASS | 200 | 1 | 1 | 1 | 0 | - | - | - |

## Interpretation

- No hard duplicate article CTA or missing-primary-CTA issue was found in the sampled pages.
- Some sampled pages have repeated CTA text/href patterns. Review manually before adding new public CTAs or managed-service copy.
- Article pages remain specifically guarded because the owner saw repeated mobile help CTAs while scrolling.
- Public managed-service pages/CTAs remain blocked until owner/SEO/legal approval and mobile duplicate-CTA QA are complete.

## Sample CTA Evidence

| Path | Sample CTAs |
| --- | --- |
| / | מצאו עורך דין -> https://jus-tice.co.il/lawyers/ <br> שליחת פנייה -> https://jus-tice.co.il/contact/?lawyer_id=20551 <br> שליחת פנייה -> https://jus-tice.co.il/contact/?lawyer_id=20550 <br> שליחת פנייה -> https://jus-tice.co.il/contact/?lawyer_id=20549 <br> שליחת פנייה -> https://jus-tice.co.il/contact/?lawyer_id=20548 <br> שליחת פנייה -> https://jus-tice.co.il/contact/?lawyer_id=20547 <br> פנייה לשותפות -> https://jus-tice.co.il/contact/?source=legal-service-provider-marketplace&#038;role=supplier <br> Appeal calculator מחשבון ערעור ביטוח לאומי בדיקת פער כספי, דחיפות ומסמכים לפני פנייה לעורך דין בתחום ביטוח לאומי. בדיקה ראשונית -> https://jus-tice.co.il/bituach-leumi-appeal-guide/ |
| /find-lawyer-how-to-find-good-attorney/ | שליחת פנייה עם הקשר מהמאמר -> https://jus-tice.co.il/?lead_message=קראתי%20את%20המאמר%20איך%20למצוא%20עורך%20דין%20מומלץ?%20כיצד%20לבחור%20עו"ד%20טוב%20ואני%20רוצה%20לבדוק%20האם%20המקרה%20שלי%20מתאים%20לפנייה%20לעורך%20דין.&#038;utm_source=article_contextual_cta&#038;utm_medium=single_articles&#038;utm_campaign=content_to_lead&#038;utm_term=lawyer-directory&#038;source_keyword=find-lawyer-how-to-find-good-attorney#ask-lawyer |
| /most-recommended-family-lawyer/ | שליחת פנייה עם הקשר מהמאמר -> https://jus-tice.co.il/?lead_area=family-law&#038;lead_message=קראתי%20את%20המאמר%20המלצות%202026%20עורך%20דין%20לענייני%20משפחה%20מומלץ%20<br>%20התייעצות%20עם%20עורך%20דין%20לענייני%20משפחה%20וירושה%20ואני%20רוצה%20לבדוק%20האם%20המקרה%20שלי%20מתאים%20לפנייה%20לעורך%20דין.&#038;utm_source=article_contextual_cta&#038;utm_medium=single_articles&#038;utm_campaign=content_to_lead&#038;utm_term=family-law&#038;source_keyword=most-recommended-family-lawyer#ask-lawyer |
| /experienced-family-law-attorney/ | שליחת פנייה עם הקשר מהמאמר -> https://jus-tice.co.il/?lead_area=family-law&#038;lead_message=קראתי%20את%20המאמר%20עורך%20דין%20לענייני%20משפחה%20תותח%20מעל%2020%20שנות%20נסיון%20<br>%20ייעוץ%20חינם%20&#8211;%20נתונים%20עדכניים%20בדיני%20המשפחה%20ואני%20רוצה%20לבדוק%20האם%20המקרה%20שלי%20מתאים%20לפנייה%20לעורך%20דין.&#038;utm_source=article_contextual_cta&#038;utm_medium=single_articles&#038;utm_campaign=content_to_lead&#038;utm_term=family-law&#038;source_keyword=experienced-family-law-attorney#ask-lawyer |
| /national-insurance-attorney/ | שליחת פרטים לבדיקה -> #btl-appeal-lead <br> שליחת בדיקה ראשונית -> button |
| /bituach-leumi-appeal-guide/ | שליחת פרטים לבדיקה -> #btl-appeal-lead <br> שליחת בדיקה ראשונית -> button |
| /rental-agreement/ | שליחת פנייה עם הקשר מהמאמר -> https://jus-tice.co.il/?lead_area=real-estate-law&#038;lead_message=קראתי%20את%20המאמר%20מה%20זה%20הסכם%20שכירות%20<br>%20חוזה%20שכירות%20ואני%20רוצה%20לבדוק%20האם%20המקרה%20שלי%20מתאים%20לפנייה%20לעורך%20דין.&#038;utm_source=article_contextual_cta&#038;utm_medium=single_articles&#038;utm_campaign=content_to_lead&#038;utm_term=real-estate&#038;source_keyword=rental-agreement#ask-lawyer |
| /labor-lawyer/ | שליחת פנייה עם הקשר מהמאמר -> https://jus-tice.co.il/?lead_message=קראתי%20את%20המאמר%20עורך%20דין%20דיני%20עבודה%20<br>%20ייעוץ%20משפטי%20בדיני%20עבודה%20ואני%20רוצה%20לבדוק%20האם%20המקרה%20שלי%20מתאים%20לפנייה%20לעורך%20דין.&#038;utm_source=article_contextual_cta&#038;utm_medium=single_articles&#038;utm_campaign=content_to_lead&#038;utm_term=lawyer-directory&#038;source_keyword=labor-lawyer#ask-lawyer |
| /consumer-rights-israel/ | שליחת פנייה עם הקשר מהמאמר -> https://jus-tice.co.il/?lead_message=קראתי%20את%20המאמר%20זכויות%20צרכן%20בישראל%20<br>%20ביטול,%20החזר,%20תביעה%20<br>%20Jus-Tice%20ואני%20רוצה%20לבדוק%20האם%20המקרה%20שלי%20מתאים%20לפנייה%20לעורך%20דין.&#038;utm_source=article_contextual_cta&#038;utm_medium=single_post&#038;utm_campaign=content_to_lead&#038;source_keyword=consumer-rights-israel#ask-lawyer |
| /eviction-notice-israel/ | שליחת פנייה עם הקשר מהמאמר -> https://jus-tice.co.il/?lead_message=קראתי%20את%20המאמר%20פינוי%20שוכר%20<br>%20הליך,%20מכתב,%20זכויות%20שוכר%20<br>%20Jus-Tice%20ואני%20רוצה%20לבדוק%20האם%20המקרה%20שלי%20מתאים%20לפנייה%20לעורך%20דין.&#038;utm_source=article_contextual_cta&#038;utm_medium=single_post&#038;utm_campaign=content_to_lead&#038;source_keyword=eviction-notice-israel#ask-lawyer |
