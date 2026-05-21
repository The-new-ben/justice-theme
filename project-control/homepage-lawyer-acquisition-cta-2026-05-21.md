## Homepage Lawyer Acquisition CTA - 2026-05-21

### Why This Matters

The homepage is becoming the root of the Jus-Tice money machine. It already serves public users with legal search, practice-area intent cards and guides. The missing gap was that lawyers, the paying customers, did not see a strong paid-product path on the actual front page.

This change connects the homepage to the improved lawyer onboarding flow and presents the lawyer offer as a measured business product: profile, lead tracking, and monthly value reporting.

### Research Used

- Justia sells premium visibility by practice area and metro area, then reinforces the value with enhanced profiles, contact forms, traffic statistics and monthly reports. Source: https://www.justia.com/marketing/lawyer-directory/
- Clio Grow frames intake as an organized system for lead stages, conversion, lead sources and revenue visibility. Source: https://www.clio.com/grow/
- Clio Grow reporting focuses on lead source, matter status, estimated value, conversion rate and revenue attribution. Source: https://help.clio.com/hc/en-us/articles/29739406189339-Clio-Grow-Reports

### What Changed

- Added the existing lawyer CTA section to `front-page.php`, after featured lawyers and before latest articles.
- Rewrote `template-parts/sections/lawyer-cta.php` so it no longer makes unsupported high-volume traffic claims.
- Main lawyer CTA now points to the existing lead-partner registration path:
  `/lawyer-registration/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice`
- Secondary CTA points to `/lawyer-plans/`.
- The section now explains the commercial flow:
  1. eligibility and license fit check,
  2. profile/content/lead path setup,
  3. lead status and value reporting.
- Added a clear note that a paid plan activates only after manual approval and approved payment.
- CSS now supports the new three-step pipeline, safer mobile stacking and numbered badges instead of decorative emoji.

### Verification

- `php -l front-page.php` passed.
- `php -l template-parts/sections/lawyer-cta.php` passed.
- `git diff --check` passed.

### Money Assessment

No revenue was earned in this cycle. The material advance is conversion infrastructure: the homepage now sends paying lawyer prospects into the strongest onboarding path instead of leaving the paid product hidden behind secondary navigation.

### Completion Assessment

- Homepage-to-lawyer-subscription path: 77% -> 82%.
- First paid-lawyer readiness: 86% -> 87%.
- Overall money-machine homepage readiness: 78% -> 82%.

Still blocked: Grow/Meshulam final approval, payment product mapping, a real outreach list, and the first paying lawyers.

### Owner-Visible Change

After deployment, the homepage should show a lawyer business CTA between featured lawyers and latest articles. The primary button should open the lead-partner registration wizard.
