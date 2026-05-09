# Pillar Content Production System
Date: 2026-05-09

## Decision
Jus-Tice content must be Hebrew-first in UI/content with short English slugs. Articles must not be thin SEO stubs. The production target for major pillars is 5,000-word-class, source-backed, reviewed legal content connected to lawyers, lead forms, tools, and internal links.

## VERIFIED
- Current repo article seeders create draft starters only.
- User requires long, complex, logical articles based on SERP reverse engineering.
- Initial SERP sample for divorce-lawyer topics shows that competing pages commonly cover price, agreement divorce, mediation, child support, custody, property division, process, documents, risks, and FAQs.

## NOT VERIFIED
- Full top-10 Google SERP capture for each keyword.
- People Also Ask capture.
- Google Search Console query/page data.
- Legal review by a licensed lawyer.

## Required Article Standard
Each pillar or major supporting article must include:
- Hebrew title and H1.
- Short English slug.
- Clear search intent statement.
- Target keyword and secondary keyword list.
- SERP notes: directory results, firm pages, guides, Q&A, government/legal sources, and price pages.
- 5,000-word-class content target for pillars, unless the SERP clearly prefers a shorter format.
- Author and reviewer fields.
- Last updated date.
- Legal disclaimer.
- Table of contents.
- Practical decision framework.
- Documents checklist.
- Process timeline.
- Cost/fee explanation where relevant.
- FAQ section based on real user questions.
- Related lawyer mini-site block.
- Related legal tools block.
- Internal links to pillar/supporting pages.
- Internal links from supporting pages back to the pillar.
- No fake rankings, fake verification, or unsupported claims.

## First Cluster: Family / Divorce
Primary pillar:
- Hebrew title: עורך דין גירושין
- English slug: `/divorce-lawyer/`
- Search intent: mixed commercial and informational. The user wants to understand process, cost, risks, and choose a lawyer.
- Primary lawyer connection: Advocate Maya Rotenberg, family law.

Supporting pages:
- `/consensual-divorce/` - גירושין בהסכמה
- `/divorce-mediation/` - גישור גירושין
- `/child-support/` - מזונות ילדים
- `/child-custody/` - משמורת ילדים
- `/divorce-property-division/` - חלוקת רכוש בגירושין
- `/family-dispute-resolution/` - בקשה ליישוב סכסוך
- `/ketubah-divorce/` - כתובה בגירושין
- `/prenuptial-agreement/` - הסכם ממון

## Article Build Flow
1. Capture SERP for the keyword.
2. Identify intent and page type Google rewards.
3. Choose one primary URL.
4. Create outline with sections and internal links.
5. Draft full article in Hebrew.
6. Attach lawyer/profile/tool modules through CMS fields, not hardcoded copy.
7. Mark as draft until legal/editorial review.
8. Publish only after author/reviewer/source checks.
9. Add internal links from supporting pages.
10. Track in content inventory and cannibalization map.

## Risks
- Legal/YMYL content can damage trust if it looks machine-written, shallow, or unreviewed.
- Publishing many short pages can create cannibalization and thin-content risk.
- Price claims must be dated, sourced, and framed as ranges, not guarantees.
- Lawyer reviews and ratings require moderation, policy, and legal/ethical review before monetization claims.
