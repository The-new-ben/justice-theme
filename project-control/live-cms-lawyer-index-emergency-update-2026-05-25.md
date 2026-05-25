# Live CMS Lawyer Index Emergency Update - 2026-05-25

## What Changed Live

Created 8 real WordPress `justice_lawyer` records through the WordPress REST API using the owner-provided application password. These are CMS-backed records, not hard-coded cards.

All 8 new records are basic public-index cards:

| ID | Lawyer | Slug | Source | Practice handling |
| --- | --- | --- | --- | --- |
| 20533 | שלמה פרידמן | public-basic-shlomo-friedman | PsakDin | דיני משפחה + גירושין together |
| 20534 | מארי שני עשהאל | public-basic-mari-shani-asael | PsakDin | דיני משפחה + גירושין together |
| 20535 | שמואל גרוס | public-basic-shmuel-gross | PsakDin | דיני משפחה + גירושין together |
| 20536 | טלי בן יקיר | public-basic-tali-ben-yakir | PsakDin | דיני משפחה + גירושין together |
| 20537 | איל בר-לב | public-basic-eyal-barlev | LawReviews | דיני משפחה + גירושין together |
| 20538 | ד"ר איריס טרומן | public-basic-iris-truman | LawReviews | דיני משפחה + גירושין together |
| 20539 | מורן גוהר | public-basic-moran-gohar | LawReviews | דיני משפחה + גירושין together |
| 20540 | אביטל רבינוביץ | public-basic-avital-rabinovich | LawReviews | דיני משפחה + גירושין together |

## Safety Rules Used

- No competitor photos copied.
- No competitor reviews copied.
- No ratings, "recommended", "verified", or success claims added.
- No contact details added unless already verified and approved.
- Each card is marked as `public_index`, `free`, `inactive`, `unverified`, `public`, and unclaimed.
- Internal notes explicitly say not to copy reviews/photos and not to claim verification.

## Verification

- Admin REST verification passed for IDs 20533-20540.
- Public REST verification shows the new records are exposed by the `justice_lawyer` endpoint.
- The visible directory currently shows the newest CMS card, but the HTML page/cache did not yet refresh to show the full batch.
- Direct lawyer mini-site URLs currently return 404 on live because the host is missing the CPT single route. A narrow theme fallback was added locally in `inc/lawyer-rest-guards.php` and must be pulled live before the mini-site URLs can be re-tested.

## Revenue View

Current MRR from these cards: ₪0.

What materially advanced: there is now real conversion inventory in the CMS. The next revenue step is outreach/claim flow: invite these lawyers to claim the card, verify details, add real profile content/photo, then convert to paid plan or paid lead routing.

Reasonable near-term expectation after outreach:

- 8 public-index cards now live in the CMS.
- 1-2 claimed conversations is realistic if outreach happens this week.
- First paid conversion target remains one lawyer at ₪349-₪749/month or a manual invoice bridge before automated recurring billing is fully active.

## Still Blocked

- Full mini-site display waits for the route fallback to be deployed and verified.
- Full directory display may require cache purge or deployment refresh.
- Real payment/subscription proof still requires completing the Grow/Morning WooCommerce/API setup and running an owner-approved real transaction.
