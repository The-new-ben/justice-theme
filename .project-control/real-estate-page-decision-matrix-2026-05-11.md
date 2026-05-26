# Real Estate Page Decision Matrix

Date: 2026-05-11  
Status: VERIFIED / REVIEW ONLY / OWNER APPROVAL REQUIRED / NO URL CHANGE

This matrix classifies the current real-estate, apartment purchase/sale, land registry, tax, rental, contractor/defect and international-property pages before any rewrite, merge, redirect, canonical, sitemap, menu, breadcrumb, related-card, lawyer-card or CMS execution.

It does not approve public changes.

## Evidence Used

VERIFIED:
- `project-control/content-master-inventory.csv`
- `project-control/content-quality-audit.csv`
- `project-control/url-migration-map.csv`
- `project-control/gsc-keyword-page-map.csv`
- `project-control/gsc-content-priorities.csv`
- `project-control/real-estate-owner-approval-packet.md`
- `project-control/real-estate-source-legal-checklist-2026-05-11.md`
- `project-control/real-estate-source-legal-checklist-2026-05-11.csv`

NOT VERIFIED:
- Full GSC API export.
- GA4 landing-page and conversion behavior for real-estate pages.
- Direct owner/legal review of the page body claims.
- Full manual SERP screenshots for every real-estate subtopic.
- Final WordPress CMS/page-editor state after any uPress cache or production pull.

## Decision Summary

VERIFIED:
- `/real-estate-attorney/` is the current published commercial real-estate lawyer candidate and should be compared in place before any URL strategy.
- `/real-estate-lawyer/` remains a strategic future slug only. It is not approved as a live migration target.
- `/real-estate-lawyer-cost-2025/` is protected as a high-impression support page. It should not be redirected, canonicalized away, noindexed or rewritten blindly.
- The homepage is currently carrying some real-estate lawyer intent and should later route to the approved pillar, but no homepage edits are approved by this matrix.
- Buying-apartment and sale-agreement clean slugs are future-only until existing old/current pages are compared.
- Land registry, registration, tax, rental and contractor/defect pages are support pages, not broad commercial pillars by default.
- International property pages must be separated from Israeli real-estate lawyer-service intent.

BLOCKED:
- No public content rewrite.
- No title/H1/meta update.
- No URL change.
- No 301 redirect.
- No noindex or canonical change.
- No sitemap inclusion/exclusion change.
- No homepage, menu, breadcrumb, related-card or lawyer-card update.
- No wp-admin, CMS database or template execution.

## Page-Level Matrix

### RE-PAGE-001 - Current Commercial Candidate

Current URL: `https://jus-tice.co.il/real-estate-attorney/`  
Post ID: `1149`  
Current title: `עורך דין מקרקעין מומלץ | עורך דין מקרקעין מחיר | ייעוץ חינם`  
Inventory: `6,941` words.  
Quality audit: `6/10`, `KEEP_OR_MAKE_PILLAR_REVIEW`.

Decision:
- Intended role: current no-URL-change commercial candidate.
- Problem type: possible title/intent overload; needs comparison with future slug and support pages.
- Recommended action: `COMPARE_AS_CURRENT_PRIMARY`.
- Traffic risk: `MEDIUM`, because it is an existing service URL and should not be replaced without a map.
- Source/legal gate: required before any body/title refresh.

Status:
- VERIFIED / REVIEW ONLY.

### RE-PAGE-002 - Strategic Future Slug

Future URL: `https://jus-tice.co.il/real-estate-lawyer/`  
Current exact public URL: NOT VERIFIED / not found in the public inventory as an existing current URL.

Decision:
- Intended role: future clean English commercial pillar only if approved.
- Problem type: URL migration risk.
- Recommended action: `MIGRATION_MAP_REQUIRED`.
- Traffic risk: `HIGH` if used without mapping from `/real-estate-attorney/`, `/israeli_land_and_property_laws/` and old Hebrew URLs.

Status:
- BLOCKED / FUTURE ONLY.

### RE-PAGE-003 - Homepage Real-Estate Signal

Current URL: `https://jus-tice.co.il/`  
GSC signal: homepage has visible impressions for `עורך דין מקרקעין` and related free-consultation variants in the existing map.

Decision:
- Intended role: legal portal entry page that routes to the approved real-estate pillar.
- Problem type: homepage is acting as accidental real-estate service page.
- Recommended action: `HOMEPAGE_ROUTING_REVIEW`.
- Traffic risk: `MEDIUM`.

Status:
- REVIEW ONLY. No homepage edit approved.

### RE-PAGE-004 - High-Impression Cost / Sale Lawyer Support

Current URL: `https://jus-tice.co.il/real-estate-lawyer-cost-2025/`  
Post ID: `12655`  
Current title: `עורך דין מכירת דירה מחיר (2025) | תפקידו של עורך הדין בעסקאות מקרקעין`  
Inventory: `11,330` words.  
Quality audit: `6/10`, `KEEP_OR_MAKE_PILLAR_REVIEW`.

GSC signal:
- Strong visible support impressions for sale-lawyer, apartment-buying and sale-agreement variants.

Decision:
- Intended role: protected cost/sale-support page.
- Problem type: overloaded support page, not main commercial pillar.
- Recommended action: `KEEP_AS_SUPPORT_AND_PROTECT`.
- Traffic risk: `HIGH`.

Status:
- VERIFIED / PROTECTED.

### RE-PAGE-005 - Broad Law / Property-Laws Page

Current URL: `https://jus-tice.co.il/israeli_land_and_property_laws/`  
Post ID: `10089`  
Current title: `עורך דין מקרקעין | חוקי הקרקע והקניין בישראל`  
Inventory: `5,479` words.  
Quality audit: `6/10`, `KEEP_OR_MAKE_PILLAR_REVIEW`.  
URL map currently proposes `/real-estate-lawyer/`, but no URL change was executed.

Decision:
- Intended role: broad informational/support or merge-review page.
- Problem type: may compete with the commercial real-estate lawyer page if used as a pillar.
- Recommended action: `COMPARE_BEFORE_MIGRATION`.
- Traffic risk: `HIGH` because a future clean slug is already proposed in the map.

Status:
- REVIEW ONLY / URL MIGRATION BLOCKED.

### RE-PAGE-006 - Hebrew Fee/Price Page

Current URL: `https://jus-tice.co.il/%D7%9E%D7%97%D7%99%D7%A8%D7%95%D7%9F-%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99-%D7%A2%D7%95%D7%A8%D7%9A-%D7%93%D7%99%D7%9F-%D7%A0%D7%93%D7%9C%D7%9F/`  
Post ID: `12065`  
Current title: `מחירון שירותי עורך דין נדל”ן 2025`  
Inventory: `9,735` words.

Decision:
- Intended role: fee/cost support or merge-review asset.
- Problem type: possible duplication with `/real-estate-lawyer-cost-2025/`.
- Recommended action: `SIDE_BY_SIDE_COST_REVIEW`.
- Traffic risk: `UNKNOWN` until GSC page filter is checked.

Status:
- REVIEW ONLY.

### RE-PAGE-007 - Buy/Sell Lawyer Support

Current URL: `https://jus-tice.co.il/lawyer-for-buying-or-selling-a-house/`  
Post ID: `1142`  
Current title: `עורך דין קניית דירה | עו”ד מכירת דירה | מומחה בעסקאות מקרקעין`  
Inventory: `2,192` words.  
Quality audit: `5/10`, `KEEP_OR_SUPPORT_PILLAR_REVIEW`.

Decision:
- Intended role: buying/selling support page or merge candidate.
- Problem type: overlaps buying-apartment, sale-lawyer and broad real-estate lawyer intent.
- Recommended action: `COMPARE_AS_SUPPORT`.
- Traffic risk: `UNKNOWN`.

Status:
- REVIEW ONLY.

### RE-PAGE-008 - Future Buying-Apartment Slug

Future URL: `https://jus-tice.co.il/buying-apartment/`  
Current exact public URL: NOT VERIFIED as current exact URL.  
URL map has duplicate-target notes from old buying-apartment content.

Known competing/supporting assets:
- Old Hebrew unequal-shares buying article, post ID `11261`, proposed to `/buying-apartment/`.
- First-apartment guide under `/articles/`, post ID `10136`, also proposed to `/buying-apartment/`.
- `/apartment/`, `/lawyer-for-buying-or-selling-a-house/`, and `/real-estate-lawyer-cost-2025/`.

Decision:
- Intended role: future support page after comparison.
- Problem type: duplicate target slug and migration risk.
- Recommended action: `BUILD_SIDE_BY_SIDE_BEFORE_NEW_PAGE`.
- Traffic risk: `HIGH`.

Status:
- BLOCKED / FUTURE ONLY.

### RE-PAGE-009 - Apartment Abroad / International Framing

Current URL: `https://jus-tice.co.il/apartment/`  
Post ID: `10860`  
Current title: `רכישת דירה בחו”ל | מדריך סוגי דירות | השקעות נדל”ן חו”ל`  
Inventory: `5,553` words.  
Quality audit: `3/10`, `REWRITE`.

Decision:
- Intended role: international/abroad property support, not Israeli buying-apartment pillar.
- Problem type: semantic contamination of Israeli real-estate cluster.
- Recommended action: `SEPARATE_FROM_LOCAL_CLUSTER`.
- Traffic risk: `LOW_TO_MEDIUM` based on currently weak GSC support signal in the checked map.

Status:
- REVIEW ONLY.

### RE-PAGE-010 - Contractor/Defect Support

Current URL: `https://jus-tice.co.il/common-construction-defects-and-how-to-manage-them/`  
Post ID: `10175`  
Current title: `דירה חדשה רכישה | ליקויי בנייה נפוצים וכיצד לטפל בהם`  
Inventory: `1,824` words.  
Quality audit: `5/10`, `KEEP_OR_SUPPORT_PILLAR_REVIEW`.

Decision:
- Intended role: support page for new-apartment/contractor/defect topics.
- Problem type: needs source/legal gate for Sale Law, delivery defects and claim language.
- Recommended action: `KEEP_AS_SUPPORT_AFTER_SOURCE_REVIEW`.
- Traffic risk: `UNKNOWN`.

Status:
- REVIEW ONLY.

### RE-PAGE-011 - Land Registry Support

Current URL: `https://jus-tice.co.il/land-registration/`  
Post ID: `10541`  
Current title: `מרשם המקרקעין | פנקס זכויות מקרקעין`  
Inventory: `434` words.  
Quality audit: `2/10`, `EXPAND`.

Decision:
- Intended role: support page only.
- Problem type: thin content and official-source dependency.
- Recommended action: `EXPAND_AFTER_SOURCE_REVIEW`.
- Traffic risk: `UNKNOWN`.

Status:
- REVIEW ONLY.

### RE-PAGE-012 - Registration Rights Support

Current URL: `https://jus-tice.co.il/registration-of-real-estate-israel/`  
Post ID: `10503`  
Current title: `רישום זכויות מקרקעין בישראל | לשכת רישום מקרקעין`  
Inventory: `487` words.  
Quality audit: `2/10`, `EXPAND`.

Decision:
- Intended role: support page or merge-review with land registry.
- Problem type: thin duplicate/overlap risk.
- Recommended action: `MERGE_OR_EXPAND_REVIEW`.
- Traffic risk: `UNKNOWN`.

Status:
- REVIEW ONLY.

### RE-PAGE-013 - Huge Registration Procedure Page

Current URL: `https://jus-tice.co.il/real-estate-registration-procedure-israel/`  
Post ID: `10508`  
Current title: `real estate registration procedure in israel`  
Inventory: `117,178` words.  
Quality audit: `3/10`, `REWRITE`.

Decision:
- Intended role: source-mined review asset, not publish-forward pillar by word count.
- Problem type: extreme length, likely quality/duplication/readability risk.
- Recommended action: `AUDIT_BEFORE_REWRITE_OR_MERGE`.
- Traffic risk: `UNKNOWN`.

Status:
- REVIEW ONLY / HIGH EDITORIAL RISK.

### RE-PAGE-014 - Land Appreciation Tax Support

Current URL: `https://jus-tice.co.il/land-appreciation-tax/`  
Post ID: `10528`  
Current title: `מס שבח מקרקעין | מחשבון מס שבח | מי זכאי להחזר מס שבח מקרקעין`  
Inventory: `2,781` words.  
Quality audit: `6/10`, `KEEP_OR_MAKE_PILLAR_REVIEW`.

Decision:
- Intended role: tax support page.
- Problem type: tax/legal accuracy and source freshness.
- Recommended action: `KEEP_AS_TAX_SUPPORT_AFTER_SOURCE_REVIEW`.
- Traffic risk: `UNKNOWN`.

Status:
- REVIEW ONLY.

### RE-PAGE-015 - Rental Agreement Support

Current URL: `https://jus-tice.co.il/rental-agreement/`  
Post ID: `9988`  
Current title: `מה זה הסכם שכירות | חוזה שכירות`  
Inventory: `5,460` words.  
Quality audit: `6/10`, `REVIEW_CLASSIFY`.

Decision:
- Intended role: rental support page, separate from purchase/sale lawyer pillar.
- Problem type: rental intent should not be merged into purchase/sale service intent.
- Recommended action: `KEEP_AS_RENTAL_SUPPORT`.
- Traffic risk: `UNKNOWN`.

Status:
- REVIEW ONLY.

### RE-PAGE-016 - Online Rent Agreement Empty Page

Current URL: `https://jus-tice.co.il/online-rent-agreement/`  
Post ID: `12626`  
Current title: `חוזה שכירות אונליין (עדכני 2025)`  
Inventory: `0` words.  
Quality audit: `2/10`, `REVIEW_CLASSIFY`.

Decision:
- Intended role: tool/product placeholder or remove/merge candidate later.
- Problem type: empty/thin page risk.
- Recommended action: `OWNER_REVIEW_BEFORE_NOINDEX_OR_REMOVE`.
- Traffic risk: `UNKNOWN`.

Status:
- REVIEW ONLY / NO DELETION.

### RE-PAGE-017 - International Property Cluster

Example current URL: `https://jus-tice.co.il/buying-property-in-greece/`  
Post ID: `8932`  
Current title: `רכישת נכס ביוון | תהליך קניית בית ביוון | כמה עולה דירה ביוון`  
Inventory: `29,988` words.  
Quality audit: `8/10`, `KEEP_OR_MAKE_PILLAR_REVIEW`.

Decision:
- Intended role: separate international-property/investment cluster.
- Problem type: heuristic selected it as real-estate pillar by word count, which is wrong for local Israeli legal-service intent.
- Recommended action: `SEPARATE_INTERNATIONAL_CLUSTER`.
- Traffic risk: `MEDIUM`.

Status:
- VERIFIED / SEPARATE FROM LOCAL PILLAR.

### RE-PAGE-018 - TMA / Urban Renewal Support

Current URL: `https://jus-tice.co.il/tma-38-and-urban-renewal-lawyer/`  
Post ID: `1134`  
Current title: `עורך דין תמ”א 38 והתחדשות עירונית`  
Inventory: `575` words.

Decision:
- Intended role: real-estate support or future urban-renewal subcluster.
- Problem type: thin specialist service page.
- Recommended action: `EXPAND_OR_SUPPORT_REVIEW`.
- Traffic risk: `UNKNOWN`.

Status:
- REVIEW ONLY.

## Approval-Gated Next Steps

1. Create a real-estate side-by-side comparison for `/real-estate-attorney/`, `/israeli_land_and_property_laws/`, `/real-estate-lawyer-cost-2025/`, fee pages, buying-apartment candidates and registry/tax pages.
2. Run direct GSC browser page filters for the top current candidates:
   - `/real-estate-attorney/`
   - `/real-estate-lawyer-cost-2025/`
   - `/israeli_land_and_property_laws/`
   - `/lawyer-for-buying-or-selling-a-house/`
   - `/land-registration/`
3. Keep `/real-estate-lawyer/`, `/buying-apartment/` and `/real-estate-purchase-agreement/` future-only until side-by-side review, redirect map, canonical plan, sitemap plan and owner approval exist.
4. Build a real-estate internal-link plan only after page roles are approved.
5. Do not publish or upload content changes until design/template, mobile, breadcrumbs, related-content, lawyer-card and sitemap implications are checked together.

## Safety Statement

VERIFIED:
- This matrix is documentation-only.
- No public URLs, redirects, content bodies, titles, H1s, meta descriptions, canonical tags, sitemap entries, robots/noindex rules, menus, breadcrumbs, related cards, lawyer cards, CRM/review modules, wp-admin settings or database rows were changed.
