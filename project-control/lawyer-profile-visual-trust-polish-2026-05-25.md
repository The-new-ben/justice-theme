# Lawyer Profile Visual + Trust Polish - 2026-05-25

## Trigger

Owner/investor feedback identified two urgent trust issues:

- Homepage lawyer cards were visually broken: profile media overlapped card text.
- A public Maya Rotenberg-style profile appeared too much like a premium advertising profile while containing unverified/inaccurate factual claims.

## Competitor Research Checked

- Din: public lawyer profiles combine field/category, area, direct contact actions, office narrative, reviews/recommendations, and related articles. Example research URL: https://www.din.co.il/lawyers/6340/8624/
- PsakDin: lawyer pages emphasize practice areas, office profile, services, rulings, and adjacent legal-services links. Example research URL: https://www.psakdin.co.il/Lawyers/1116
- LawReviews: positions the product around detailed profiles, filtered search, real customer reviews, and review verification. Research URLs: https://www.lawreviews.co.il/ and https://www.lawreviews.co.il/about
- Avvo: strong pattern is issue/location search, detailed profiles, ratings/reviews, Q&A, and clear explanation of rating sources. Research URL: https://www.avvo.com/
- Justia: strong pattern is practice/location directory, extensive contact/profile data, education, associations, practice areas, external presence links, and profile claiming/premium placement. Research URL: https://www.justia.com/lawyers
- CSS/image handling: MDN guidance confirms fixed aspect ratio plus object-fit prevents image overflow/layout shift while preserving the image ratio. Research URLs: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit and https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Box_sizing/Aspect_ratios

## Implemented

- Fixed homepage/directory card layout so the image/initials media stays inside a bounded portrait box and cannot overlap the text column.
- Bumped the CSS asset version so the live site can refresh the corrected layout.
- Changed public card image policy: unverified public-basic profiles no longer display questionable uploaded thumbnails; they fall back to controlled initials cards unless the profile is paid, verified, lawyer-submitted, owner-verified, or verified-public.
- Changed single profile hero image policy with the same trust rule.
- Added a stricter Maya Rotenberg media guard: the current questionable photo is not displayed until an explicitly verified/owned source is supplied.
- Tightened Maya Rotenberg safety logic: a profile with this identity now needs a stronger approval signal than a generic `public/published` status. Seed/demo/fake-like profiles remain blocked.
- Removed the forced legacy Maya article attachment from single lawyer profiles.
- Stopped unverified public-basic profiles from auto-filling unrelated practice-area article modules. Contextual article fallback is now reserved for verified or paid profiles.
- Stopped the current Maya profile from borrowing connected article authority until the profile facts and media are source-checked.

## Honest Statement

I did research the requested competitor directions in this cycle and used them as product/design guidance, not as copied text, copied photos, copied reviews, or copied ratings.

I did not copy Maya Rotenberg's real photo into the site. Without a verified owned/licensed source, putting a real person's photo into our CMS would create a copyright and trust risk. The safer fix is to stop showing unverified photos and require verified/owner-provided assets.

## Revenue Impact

This does not create immediate revenue by itself. It removes a visible investor/customer trust defect in the lawyer-card/profile layer, which is required before outreach and sponsored-card conversion can credibly work.

## Remaining

- Replace any unverified profile facts in the CMS itself after source-by-source validation.
- Add a verified profile completeness checklist in wp-admin: photo source, education source, bar/license source, practice focus source, reviews source, and media/source links.
- Add sponsored legal-service professional modules only after the placement rules are clear and the profile owner page is not diluted by competitor ads.
