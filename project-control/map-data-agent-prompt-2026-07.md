# Data-collection agent prompt: legal places of Tel Aviv + Gush Dan

Owner mission 2026-07-02. Paste the block below to the collection agent.
The import endpoint on jus-tice.co.il is live and admin-authenticated:
POST /wp-json/justice/v1/map/import-places accepting {"places": [...]}
(dedupes by name+address hash, rejects coordinates outside Israel).

---- PROMPT STARTS BELOW THIS LINE ----

You are collecting a verified dataset of legal places in Tel Aviv and
Gush Dan (Ramat Gan, Givatayim, Bnei Brak, Holon, Bat Yam, Petah Tikva,
Herzliya, Rishon LeZion) for an interactive map. Public, lawful sources
only: official websites, government directories (gov.il court listings,
the Israel Bar Association public directory, official municipal pages),
and public business listings. Never scrape behind logins, never collect
personal emails or mobile numbers of individuals, never guess data.

For each place produce ONE JSON object with EXACTLY these fields:
- name: official Hebrew name.
- type: one of law_office | court | rabbinical | legal_aid |
  enforcement | notary | mediation | bar | institution.
- address: full Hebrew street address including city.
- city: city name in Hebrew.
- lat, lng: decimal WGS84 coordinates of the address (geocode it; must
  fall inside Israel).
- phone: the OFFICE landline as published officially, or empty string.
- website: the official site URL, or empty string.
- source: the URL where you verified the entry.

Rules of evidence: every entry must trace to a source URL you actually
opened. If two sources disagree on the address, prefer the official
site, then gov.il, and note nothing else. Skip permanently closed
places. Do not invent ratings, sizes or descriptions; this dataset is
location + identity only.

Start with, in this order: (1) all courts and tribunals in the area
(Magistrate, District, Labor, Family, Rabbinical, Traffic,
Enforcement/Hotzaa LaPoal offices), (2) Legal Aid bureaus and the Bar
Association offices, (3) the 100 largest law firms by public prominence
(Dun's 100 / BDI listings as a seed list, verified against each firm's
own site), (4) certified mediation centers and notary offices with
official listings.

Deliver in batches: a single JSON document per batch in the exact form
{"places": [ ...max 200 objects... ]}
plus a short log listing entries you SKIPPED and why (dead site,
unverifiable address, duplicate). Accuracy over volume: 150 verified
entries beat 500 guessed ones.

---- PROMPT ENDS ABOVE THIS LINE ----
