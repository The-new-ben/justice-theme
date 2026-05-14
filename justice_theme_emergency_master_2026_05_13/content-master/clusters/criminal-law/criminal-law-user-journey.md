# Criminal Law — User Journey Review
**Date:** 2026-05-14

## Persona
A scared Israeli who was summoned to a police investigation or needs a criminal lawyer urgently.

---

## Journey Steps

### 1. User lands on homepage
- **Works:** Homepage loads, RTL correct, professional design
- **Missing:** Need to verify Criminal Law is visible in Practice Areas section
- **Priority:** HIGH — must verify via browser

### 2. User finds Criminal Law
- **Works:** Category `criminal-law` (ID 730) exists with 18 articles
- **Confusing:** User may not know to look under "Practice Areas"
- **Missing:** Clear "Criminal Law" CTA on homepage
- **Priority:** HIGH

### 3. User reaches Criminal Law category/practice page
- **Works:** `/category/criminal-law/` shows correct articles
- **Missing:** No intro text explaining what this section covers
- **Missing:** No direct link to the pillar page
- **Priority:** HIGH — add intro text

### 4. User reaches Criminal Law pillar
- **Works:** `/criminal-defense-attorney/` (22.4K chars) covers key topics
- **Works:** Hub navigation links to all 17 spokes
- **Missing:** Lawyer CTA could be more prominent
- **Priority:** MEDIUM

### 5. User sees practical help
- **Works:** Articles cover investigation rights, arrest, plea bargain, record deletion
- **Missing:** Quick "What to do RIGHT NOW" emergency section
- **Priority:** MEDIUM

### 6. User can navigate to subtopics
- **Works:** Drug crimes, fraud, murder, DUI, shoplifting, tax crimes, appeal
- **Missing:** Sex offenses, family violence, military, white-collar (not yet created)
- **Priority:** HIGH — create missing sub-practice pages

### 7. User sees disclaimer
- **Works:** Legal disclaimer on every article
- **Priority:** COMPLETE

### 8. User sees lead/contact CTA
- **Works:** E-E-A-T footer has consultation prompt
- **Missing:** Standalone contact form or WhatsApp link on articles
- **Priority:** MEDIUM

### 9. User can find lawyer
- **Works:** Sharon Nahari profile at `/lawyers/advocate-sharon-nahari/`
- **Missing:** "Find a Criminal Lawyer" link from articles to lawyer directory
- **Priority:** HIGH

### 10. Mobile usability
- **Works:** Theme is RTL responsive
- **Missing:** Not verified via actual mobile browser test
- **Priority:** NEEDS_VERIFICATION

---

## Overall Assessment

| Question | Answer |
|----------|--------|
| Does Criminal Law feel important enough? | Yes, 18 articles + pillar is substantial |
| Does it overpower other legal fields? | No, other fields have legacy content |
| Does site feel like full legal portal? | Partially — other fields need similar treatment |
| Biggest user journey gap? | No clear "I need a lawyer NOW" emergency flow |
