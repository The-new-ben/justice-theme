# Lead AI / Intake Classification
Date: 2026-05-09

## VERIFIED
- Repo now includes `inc/lead-classifier.php`.
- Every saved `justice_lead` receives rule-based intake metadata:
  - `ai_classification_status = rule_based_v1`
  - `ai_detected_area`
  - `ai_detected_urgency`
  - `ai_summary`
  - `routing_notes`
  - `ai_classification_hash`
- The owner CRM now prefers `ai_detected_area` when displaying lead area.
- The classifier normalizes current form values:
  - `family` -> `family-law`
  - `criminal` -> `criminal-law`
  - `traffic` -> `traffic-law`
  - `real_estate` -> `real-estate-law`
  - `labor` -> `labor-law`
  - `damages` -> `torts`

## NOT VERIFIED
- Live lead submissions after Upress pull.
- Real CRM routing to a lawyer.
- External AI integration.
- Hebrew keyword coverage quality across real lead samples.

## Decision
Start with deterministic classification before external AI.

Reason:
- No API key or external dependency is required.
- It is safer for legal intake because it creates routing hints, not legal advice.
- It gives the CRM immediate structure for area, urgency and summary.

## Guardrails
- Classification is only an operational hint.
- Every lead still requires human review before lawyer assignment.
- The system must not provide legal advice or promise outcomes.

## Next AI Layer
1. Collect real lead samples.
2. Compare rule-based classification against manual owner labels.
3. Add OpenAI-based summarization/classification behind an admin-only API key.
4. Store model version, confidence, prompt version and review result.
5. Add lawyer matching only after verified practice-area/city data is clean.
