# courtai deep-dive digest (brain, contracts, marketplace, comms)

Date: 2026-07-02. Source: public repo The-new-ben/courtai, read page-by-page.
Purpose: shared knowledge base for future integration; what jus-tice now mirrors.

## Vision (quoted from docs/VISION.md and README)
- "Justice delayed is justice denied. Justice simulated is justice prepared."
- "replacing the $50,000 mock trial with a $50/month simulation" (THEMIS)
- Platform: lead matching + case management + WhatsApp messaging + digital
  contracts + System3 PAC-Reasoning multi-agent consensus.

## The brain: System3 PAC-Reasoning (src/services/ai/system3/)
Pipeline: multi-agent analysis (3+ providers) -> consensus via pairwise
similarity (0-1) -> contradiction detection (factual/logical/ethical/
procedural; severity by agent confidence) -> quality assessment
(reliability = avgConfidence - 0.1 per contradiction, capped) -> final
answer with PAC bounds (epsilon = sqrt(ln(2/delta)/(2n))).
Human-review rule: needs_human_review when consensus < 0.6 OR
reliability < 0.65 OR any critical contradiction.
jus-tice mapping: review_request=1 lead flow (attorney review) is our HITL.

## Court logic (src/juris-arena/engine/)
- CaseStrengthAnalyzer: LLM scores last 12 transcript turns ->
  {plaintiff 0-100, defense 0-100, momentum, reasoning}. Arena tool's
  analysis section now instructs this exact output format.
- ContradictionDetector: compares a speaker's new statement against their
  last 5; severity minor/major with explanation. Mirrored as the arena's
  contradictions section.

## Contracts (docs/schemas/, served by GET /api/schemas)
- case.json: id,title,summary,jurisdiction,category,goal,status,
  simulationFlag,parties,evidence,timeline,readinessScore(0-100),
  confidenceScore(0-1)...
- professional.json: fullName,role(lawyer|mediator|consultant|
  expert_witness|arbitrator),specializations,jurisdictions,
  experienceYears,rating,reviewCount,tier,verificationStatus,contact
  (incl. whatsapp,calendlyUrl)...
- simulation_run.json: caseId,mode(practice|live_trial|coaching),
  participants(role incl. judge/prosecution/defense/witness, confidence),
  phases,events(objection|ruling|statement...),metrics(engagementScore).
- file.json: fileName,mimeType,hash,storagePath,ocrText,evidenceType,
  chainOfCustody.
- payment.json: paymentType(deposit|retainer|milestone|subscription),
  status,stripePaymentIntentId,lineItems,auditTrail.
jus-tice mirror: justice/v1/knowledge/schemas + /articles +
/professionals expose courtai-compatible names and professional aliases.

## Marketplace, reputation, comms (verified models)
- Professionals table fields incl. license_number, bar_association,
  rating, total_ratings, availability_status, languages.
- Reputation = real per-case ratings (1-5 + feedback) aggregated
  client-side. jus-tice deliberately shows only real signals (verified
  status, years, type) until a real reviews system exists.
- Docs: Supabase storage "evidence" bucket + Tesseract OCR on upload,
  evidence_versions with chain of custody. jus-tice counterpart: gated
  upload -> private attachment on the request + attorney review flag.
- Comms: WhatsApp Business webhook -> process_incoming_lead RPC;
  LiveKit video hearings; Google Calendar/Calendly sync; meetings table
  meeting_type in_person|video|phone; notification_preferences
  (email/whatsapp/in_app, digest realtime|daily|weekly).
  jus-tice counterpart today: preferred-channel select
  (whatsapp/phone/video/email) captured at the gate and carried on the
  routed lead.
- HITL: HITLAnnotation marketplace (SFT/Rank tasks), cases carry
  summary_reviewed flag, AdminVerification queue for professionals.

## Deferred (needs the real courtai deployment or new infra)
LiveKit video rooms, WhatsApp Business webhook, Calendly/Google Calendar
sync, per-case ratings system, HITL annotation marketplace, Stripe.
