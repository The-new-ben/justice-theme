# Jus-Tice Article Production Standard

Status: ACTIVE_WORKING_STANDARD
Owner intent: publish useful money/SEO pages fast, without thin content, copied competitor text, or disconnected drafts.

## Non-Negotiable Gates Before Writing

1. Define the page role:
   - Pillar: main money page, usually 5,000+ words.
   - Supporting article: 1,500+ words minimum, normally 2,000-3,500 when the topic is commercial.
   - Local money support page: 1,500+ words minimum, tied to a city + practice intent.
   - Public-body/reference page: shorter is allowed only if it answers one narrow official-information intent.

2. Define the anti-cannibalization target:
   - Primary keyword.
   - Parent pillar URL.
   - Existing pages that must not be replaced.
   - Internal links up to the pillar, sideways to related support pages, and down to conversion routes.

3. Research first:
   - Search Google for the target keyword and note the top-ranking page types.
   - Record competitor title patterns, repeated intent words, FAQ themes, and SERP modules.
   - Use official sources for legal/process facts whenever possible.
   - Save a source-audit CSV before publishing.

4. Match user intent:
   - If the searcher wants a lawyer, the article must answer “what should I do now?”
   - If the searcher wants a definition, do not turn the page into a sales page.
   - If the searcher is in a transaction, include documents, timing, risks, and questions to ask.

5. Include revenue path:
   - Customer CTA: contact / leave details.
   - Lawyer CTA when relevant: join plans / open profile.
   - Do not promise legal results or guaranteed leads.

## Reusable Prompt

Use this prompt with a human-reviewed ChatGPT/Claude/Gemini session when writing content without API:

```text
Write a Hebrew Jus-Tice article for the keyword: [PRIMARY KEYWORD].

Page role: [pillar / supporting / local money support].
Minimum length: [NUMBER] words.
Parent pillar URL: [URL].
Existing pages to protect from cannibalization: [URLS].
Internal links that must appear naturally: [URL + Hebrew anchor text list].
Official sources: [source list].
Competitor/SERP intent notes: [short notes from top results].

Rules:
- Do not copy competitor wording.
- Write for Israeli users in practical Hebrew.
- Start with the real user problem and what they need to check now.
- Use clear H2/H3 structure.
- Include document checklist, common mistakes, FAQ, and legal disclaimer where relevant.
- Mention local facts only when supported by source audit.
- Avoid unsupported claims like “best”, “guaranteed”, “free legal advice”, or fake reviews.
- Make it useful enough that a stressed user can act immediately.
- Add natural internal links with Markdown format: [anchor](/slug/).
```

## Publishing QA

Before deployment or CMS publication:

1. Word count is above the required minimum.
2. Source audit exists.
3. No raw competitor copy.
4. Internal links render as real links.
5. Canonical points to the final URL.
6. Page returns a real 200, not homepage fallback.
7. Sitemap includes the final URL.
8. CTA path works for users and lawyers.
9. The page does not steal the parent pillar’s broader keyword intent.
