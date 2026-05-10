# Lawyer Funnel Strategy

Date: 2026-05-10  
Status: BUSINESS STRATEGY V1 - no payment implementation executed

## Funnel Goal

Turn Jus-Tice from an information site into a lawyer marketplace without harming public trust.

The funnel should show lawyers:
- where they appear.
- what leads they can receive.
- how their mini-site looks.
- how content supports their authority.
- how analytics proves value.

## Funnel Stages

1. Awareness:
   - lawyer sees directory, mini-site example or article attribution.
2. Interest:
   - lawyer visits `/lawyer-registration/` or pricing/plan page.
3. Qualification:
   - lawyer submits practice areas, cities, contact details and content needs.
4. Profile setup:
   - free or paid profile created as draft/reviewed.
5. Content connection:
   - relevant pillar/support articles attached to profile.
6. Lead routing:
   - lead form and call/WhatsApp events route to the profile/CRM.
7. Reporting:
   - monthly views, clicks, leads and article engagement.
8. Upsell:
   - mini-site, featured placement, article package, AI intake/CRM or media package.

## Product Ladder

Candidate products:
- Free profile.
- Pro profile.
- Featured listing.
- Lead partner.
- Mini-site package.
- Article/content package.
- Video/media package.
- SEO reputation package.
- AI intake/CRM package.

Status: NEEDS OWNER PRICING DECISION.

## Trust Rules

Do not sell:
- fake rankings.
- unverified recommendation labels.
- inflated lawyer status.
- exclusivity that cannot be honored.

Every paid placement should be visibly and ethically handled.

## CMS/CRM Requirements

Required fields:
- plan tier.
- billing status.
- lead routing rules.
- profile completeness.
- approved practice areas.
- approved cities.
- connected article list.
- event summary.
- monthly report visibility.

## Measurement

Critical events:
- `lawyer_signup_start`
- `lawyer_signup_submit`
- `lawyer_profile_view`
- `lawyer_card_click`
- `generate_lead`
- `phone_click`
- `whatsapp_click`

## Next Action

Map current lawyer onboarding forms and admin queues to these stages before adding payments.
