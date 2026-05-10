# Entity And Schema Review

Date: 2026-05-10  
Status: REVIEW PLAN - no schema code changes executed

## Entity Goal

Define Jus-Tice consistently as:
- Hebrew legal portal.
- lawyer directory.
- legal information platform.
- Israeli legal-tech and lead-routing service.

This entity should be reflected in homepage copy, footer, schema, social metadata, internal links and business pages.

## Current Known Schema

PARTIAL / CODE-SIDE:
- WebSite + SearchAction are present according to prior code/live review.
- Article schema exists in the theme.
- BreadcrumbList schema exists.
- Conservative Attorney/LegalService schema was added for lawyer mini-site pages.

NOT VERIFIED LIVE:
- Exact live JSON-LD output after latest pulls/cache.
- Whether schema data matches visible page content.
- Whether all required/recommended fields are complete.
- Whether mobile and desktop render equivalent structured data.

## Recommended Schema Types

Homepage:
- Organization or LegalService-like entity if data is accurate.
- WebSite with SearchAction.

Article pages:
- Article.
- BreadcrumbList.
- FAQPage only where FAQ content is visible and reviewed.

Practice/pillar pages:
- Article or CollectionPage depending final template.
- BreadcrumbList.
- FAQPage where visible/reviewed.

Lawyer profiles:
- Person or Attorney/LegalService where data is sourced and visible.
- Do not add aggregateRating/review unless real and compliant.

Directory:
- CollectionPage / ItemList only after profile data is real and intentional.

## Structured Data Rules

- Do not add structured data about information not visible to users.
- Prefer complete, accurate properties over many weak/inaccurate properties.
- Validate in Rich Results Test after deployment.

## Next Action

Create a schema QA checklist per template after the next live visual/HTML verification pass.
