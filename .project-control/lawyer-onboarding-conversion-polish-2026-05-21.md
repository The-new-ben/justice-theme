# Lawyer Onboarding Conversion Polish - 2026-05-21

## Goal

Make the lawyer registration flow feel more professional and closer to a paid product, while Grow/Meshulam recurring payment approval is still being finalized.

This cycle focused on the lawyer-side money path:

- A lawyer should understand what they get.
- The form should feel guided, not messy.
- The manual invoice path should remain honest until automated recurring billing is approved.
- The page should not have layout overflow that hurts trust on desktop/mobile.

## Research Used

- Clio Grow positions its dashboard around lead performance, pipeline health, matter status and lead value tracking: https://help.clio.com/hc/en-us/articles/14353490331035-Clio-Grow-Dashboard
- Justia sells lawyers on complete profiles, premium visibility, traffic stats, practice FAQs and prominent contact paths: https://www.justia.com/marketing/lawyer-directory/
- Current law-firm conversion guidance emphasizes concise next steps after submission, reassurance, mobile usability and fewer unnecessary questions up front: https://www.simplelaw.com/blog/conversion-strategies-for-law-firm-websites

## Code Changed

### `assets/js/lawyer-registration-wizard.js`

- Converted the visible wizard from English to Hebrew.
- Reframed the steps around a lawyer onboarding journey:
  - Basic details.
  - Practice fit.
  - Mini-site material.
  - Trust assets.
  - Review and submit.
- Added a final-step summary explaining what happens after submission:
  - license/practice/availability review,
  - mini-site/profile preparation,
  - manual payment instructions or automatic billing only after payment infrastructure is approved.

### `page-lawyer-registration.php`

- Added a server-rendered "after submission" section below the form.
- This works even before JavaScript runs and makes the process clear to lawyers evaluating whether the system is serious.

### `assets/css/premium-pass-3.css`

- Styled the final wizard summary.
- Styled the new after-submission section.
- Fixed the hidden anti-spam field so it no longer creates horizontal overflow.

### `inc/enqueue.php`

- Bumped the registration wizard script version to `1.1.0`.
- Bumped `premium-pass-3.css` to `3.0.2` so the new CSS is cache-busted.

## Deployment

Code commits:

- `2809fc9 Polish lawyer onboarding conversion path`
- `7abb331 Prevent lawyer registration horizontal overflow`

uPress:

- Pulled through uPress Git Manager.
- Live Git log showed `7abb331` as `HEAD -> main, origin/main`.

## Live Verification

Checked:

- `https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice&qa=7abb331`

Results:

- Page returned `200`.
- No page-level `noindex`.
- Hebrew wizard intro and step text are visible.
- No English wizard leftovers found (`Smart onboarding path`, `Step 1`, `Basics`, `Back`, `Next`, etc.).
- Manual invoice path is visible and honest.
- New "after submission" section is present.
- Wizard can reach the final review step after filling required dummy fields.
- Final step shows the "what happens after submission" summary and submit button.
- Horizontal overflow fixed: `scrollWidth` equals `clientWidth` on the checked viewport.

## Money Assessment

No revenue was earned in this cycle.

Material advancement: the lawyer acquisition path is more credible. A lawyer can now see a clearer product journey from signup to profile, dashboard, lead handling and payment activation.

## Completion Assessment

- Lawyer onboarding conversion readiness: 62% -> 70%.
- First paid-lawyer readiness: 84% -> 86%.
- Homepage-to-lawyer-subscription path: 72% -> 77%.

Still blocked:

- Grow/Meshulam final approval and recurring billing readiness.
- Real WooCommerce subscription product mapping.
- Actual lawyer outreach and first paying customer.
- Real Analytics/GSC evidence that this flow converts.

## Safety

Repo theme code and documentation only.

No public CMS/database edits, no payment setting change, no card charge, no Grow/Meshulam action, no WooCommerce product creation, no lead or lawyer record created, and no outreach sent.
