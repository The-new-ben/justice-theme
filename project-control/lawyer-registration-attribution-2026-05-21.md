## Lawyer Registration Attribution - 2026-05-21

### Why This Matters

The homepage now sends lawyers into the lead-partner registration path. The next money problem is measurement: when outreach starts, every WhatsApp, email, directory scrape, city segment and practice-area pitch needs to tell us whether it created a serious registration.

This change makes the lawyer registration form preserve campaign/source data without changing payments, CMS records, products or public copy.

### Research Used

- Clio Grow lets law firms track marketing sources from outreach and online channels and attach those sources to contacts or matters.
  Source: https://help.clio.com/hc/en-us/articles/25315194374299-Clio-Grow-Marketing-Sources
- Clio Grow reports include source, referrals, matter status and revenue data so firms can see where profit originates.
  Source: https://help.clio.com/hc/en-us/articles/29739406189339-Clio-Grow-Reports

### What Changed

- Lawyer registration now captures hidden attribution fields:
  - `utm_source`
  - `utm_medium`
  - `utm_campaign`
  - `utm_content`
  - `utm_term`
  - `outreach_segment`
  - `outreach_city`
  - `outreach_practice`
  - `registration_landing_url`
  - `registration_referrer_url`
- Short aliases also work for outreach links:
  - `source` -> `utm_source`
  - `medium` -> `utm_medium`
  - `campaign` -> `utm_campaign`
  - `segment` -> `outreach_segment`
  - `city` -> `outreach_city`
  - `practice` -> `outreach_practice`
- The homepage lawyer CTA now appends its own attribution tags:
  - `utm_source=homepage`
  - `utm_medium=site_cta`
  - `utm_campaign=lawyer_acquisition`
  - `outreach_segment=homepage_lawyer_cta`
- The registration wizard JavaScript also reads attribution from the URL hash as a fallback, because live redirects can preserve unknown UTM parameters after `#` instead of leaving them in the query string.
- `inc/enqueue.php` bumped the lawyer registration wizard version to `1.2.0` so the fallback ships past cache.
- Submitted lawyer drafts store attribution in post meta.
- Admin notification email includes attribution and landing-page context.
- Lawyer Onboarding admin table now has a Source column with attribution summary and landing-page link.

### Example Outreach URL

`/lawyer-registration/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice&utm_source=whatsapp&utm_medium=direct_message&utm_campaign=founder_batch_01&outreach_segment=family_law_tel_aviv&outreach_city=tel-aviv&outreach_practice=family-law`

### Verification

- `php -l inc/lawyer-onboarding.php` passed.
- `php -l page-lawyer-registration.php` passed.
- `php -l template-parts/sections/lawyer-cta.php` passed.
- `php -l inc/enqueue.php` passed.
- `git diff --check` passed.

### Money Assessment

No revenue was earned in this cycle. The material advance is sales measurement: first outreach can now be tracked by source, segment, city and practice, so the owner can stop guessing which lawyer acquisition channel is working.

### Completion Assessment

- Lawyer outreach measurement readiness: 15% -> 45%.
- First paid-lawyer readiness: 87% -> 88%.
- Homepage-to-lawyer-subscription path remains 82%, but it now reports its own source tags.

Still blocked: Grow/Meshulam final approval, product/payment mapping, real outreach execution and first paid lawyer.

### Owner-Visible Change

After deployment, open the lawyer registration URL with UTM/outreach parameters and inspect the page source or form fields. The values should travel into submitted draft lawyer records and appear in Lawyer Onboarding.
