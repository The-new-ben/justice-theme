# Situation Card Lead Prefill

Date: 2026-05-27

## What Changed

- Added a direct intake action to each homepage legal-help situation card.
- Prefills the Ask a Lawyer form with the legal area and the selected situation.
- Carries `lead_source_surface=homepage_legal_help_router` plus UTM/source keyword context into the CRM submission path.
- Lets in-page clicks update hidden CRM fields without a reload.

## Revenue Path

Public visitor -> homepage situation card -> prefilled legal inquiry -> CRM lead tagged by situation source -> manual qualification -> lawyer/supplier handoff -> invoice, subscription, or paid lead action.

## Blockers

- This is pushed code only until uPress pulls the latest Git revision for the live theme.
- Grow/Meshulam KYC/payment readiness remains unresolved, so paid checkout is still not end-to-end ready.
- No new customer, lawyer, supplier, or payment is verified from this change yet.

## Readiness To Profit

Estimated: 48%.

The public intake path is getting more measurable and easier to use, but live deployment and payment readiness are still the critical blockers.
