# Competitor Signup Funnel Audit - 2026-05-25

## Honest Scope Statement

I inspected the public competitor pages and public signup/login stages that were reachable without creating accounts, submitting forms, bypassing protections, or touching competitor systems. I did not submit fake forms, create accounts, pay competitors, or access private dashboards. Any private post-submit stage remains inferred from public copy only.

## Competitors Checked

### din.co.il

Public pages checked:
- https://www.din.co.il/adv.asp
- https://www.din.co.il/live/UserForm.asp

Observed public funnel:
1. Marketing promise: fast/free signup, focused exposure, legal audience, more clients.
2. Signup fields: office/business name, email for receiving user inquiries, mobile phone not shown publicly, password, password confirmation, terms/privacy agreement.
3. Value ladder: targeted advertising, more clients, article publishing, case/judgment publishing, legal forums and direct user contact.
4. Growth message: combines site listing with broader digital advertising channels.

What we copied as a pattern, not wording:
- Make the first step feel fast and concrete.
- Explain why each field matters.
- Connect registration to articles, professional proof and lead contact.

### psakdin.co.il

Public pages checked:
- https://www.psakdin.co.il/
- https://www.psakdin.co.il/Register?UserType=Lawyer
- https://www.psakdin.co.il/%D7%9B%D7%A0%D7%99%D7%A1%D7%94?UserType=New
- https://www.psakdin.co.il/Lawyers

Observed public funnel:
1. Clear header split: login, registration and free subscription for Israel Bar members.
2. Registration form presents user details: email, full name, phone, user type and terms approval.
3. The broader site reinforces authority through legal content, case law, magazine articles, forms, legal services and large practice/city taxonomies.
4. Lawyer pages are connected to article/content authority, not isolated profile cards.

What we copied as a pattern, not wording:
- Signup should feel like entering a professional legal ecosystem.
- It should visibly connect user details, terms, subscription/account route and content authority.

### lawreviews.co.il

Public pages checked:
- https://www.lawreviews.co.il/
- https://www.lawreviews.co.il/about
- https://www.lawreviews.co.il/join
- https://www.lawreviews.co.il/spa/login

Observed public funnel:
1. Marketing promise: digital customer journey, reputation building, online trust and new clients.
2. Join form fields: full name, main field, phone, email and consent for contact/terms.
3. Product value: rich lawyer profile, Google visibility, reviews, direct contact, appointment requests, multiple office addresses, media, articles and service quality tracking.
4. Trust model: review verification, invoice-based proof for unsolicited reviews, inability for lawyers to simply delete negative reviews, and review collection links.
5. Operational value: tracks inquiries that did not receive a response so relevant leads are not missed.

What we copied as a pattern, not wording:
- Sell trust, verified reputation and service-quality control.
- Make profile richness and follow-up part of the product, not an afterthought.

## Changes Applied To Jus-Tice

- Added `lawyer-plans-market-proof__signup-stages` to the lawyer plans page: fast opening, trust profile, measurable reputation/leads and business activation.
- Added `lawyer-registration-account-path__fields` to the registration page: explains the operational fields needed to activate, measure and bill the lawyer account.
- Bumped public polish CSS to `4.3.4`.
- Updated deployment marker to `2026-05-25-competitor-signup-funnel-v1`.

## What Is Still Not Done

- I did not reach any competitor private dashboards.
- I did not create competitor accounts.
- I did not copy competitor text verbatim.
- The new Jus-Tice copy is not live until this commit is pushed and uPress pulls the theme.
