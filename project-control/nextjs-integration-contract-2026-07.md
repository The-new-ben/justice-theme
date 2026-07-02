# The REAL backend contract for justice-nextjs-app (ground truth)

Date: 2026-07-02. Purpose: any auditor or builder working on the
Next.js app must check its integrations against THIS, not against
guesses. The previous external audit claimed leads flow into
justice-core/v1/leads; that endpoint does not accept public POSTs at
all. Everything below is verified against the live theme code in this
repo and the deployment handoff.

## 1. Lead intake (the only public write path)
- POST https://jus-tice.co.il/wp-json/justice/v1/legal-tools/lead
- Public, no auth. Server-side guards: honeypot field lead_hp (must be
  empty), required lead_name + lead_phone + lead_consent, optional
  lead_email, tool_id, tool_title, lang, fields (JSON string),
  draft_excerpt, area (practice-areas slug, validated), lead_channel
  (whatsapp/phone/video/email), review_request ("1" requests attorney
  review), optional file lead_document (pdf/doc/docx/jpg/png, stored
  private).
- What happens server-side: creates a private justice_legal_request,
  then bridges to a real justice_lead which the classifier (prio 20)
  and routing engine (prio 30) process: area match, paid-subscription
  check, monthly caps, lawyer email notification, billing queue.
- Anything that does NOT go through this endpoint does not reach the
  CRM, routing or billing. localStorage is not a CRM.

## 2. AI generation (guarded proxy, never a raw key)
- POST https://jus-tice.co.il/wp-json/justice/v1/generate
- The OpenAI key lives ONLY on the WordPress server (mu-plugin).
  Budget guards: 30 requests/day sitewide, 3/day per IP, $1.50/day.
- A raw OPENAI_API_KEY inside the Next.js app is forbidden: it
  bypasses every cost and abuse guard on a public endpoint.
- Compliance: AI output is ALWAYS framed as a draft for attorney
  review. No success probabilities, no case-value estimates, no
  outcome promises, fake or real. This is Israeli Bar rules plus the
  FTC/DoNotPay precedent. An "evaluator" must output a structured
  case summary and questions for a lawyer, not a score.

## 3. Payments
- Live model: manual approval then invoice. NO auto-billing. The
  WooCommerce store on jus-tice.co.il is in coming-soon mode; there
  is no live public checkout to redirect to.
- Client-supplied amount/credits in a redirect URL is a price
  tampering hole and must never drive a charge.
- Until the owner ships a payment project, payment buttons must lead
  to the plans/contact flow (https://jus-tice.co.il/lawyer-plans/).

## 4. Reviews
- The only legitimate reviews pipeline is the WordPress verified
  case-linked system: one-time tokens minted per routed lead, 1-5
  score + feedback, owner moderation queue, aggregates recomputed
  from approved reviews only, Review schema on profiles.
- A parallel reviews store or approval path in the Next.js app
  (secret-key approve routes, local arrays) splits the corpus and
  breaks the verified-only guarantee. Read-only display of approved
  data is fine; writing/approving reviews outside WP is not.

## 5. Read APIs available to the app (public, no auth)
- GET /wp-json/justice/v1/knowledge/schemas | articles | professionals
  (courtai-compatible contract names; professionals carries rating +
  reviewCount computed from approved reviews only).
- GET /wp-json/justice/v1/legal-tools/matched-lawyers?area={slug}
  (approved public profiles, verified first, rating second).

## 6. Brand and content rules the app must match
- Design system: ivory canvas, navy #122c52, coral #e8624f, Frank
  Ruhl Libre 700 display + Assistant UI, WCAG AA (coral text on light
  = #b8391f). Hebrew RTL first-class, not an afterthought.
- No AI-generated people images, no stock "perfect lawyer" photos.
  EEAT people are real and consenting only.
- No em/en dashes, no Hebrew AI-teller phrases, no superlatives or
  guarantees, every displayed number computed from real data.
