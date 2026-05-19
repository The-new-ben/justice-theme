# Uncovered Demand Lead Monetization Model - 2026-05-19

Status: ACTIVE  
Trigger: owner reported calls from users seeking lawyers in categories where Jus-Tice has no paying partner yet, e.g. "Thailand lawyer".

## Research Snapshot

- Legal lead-generation ethics research consistently flags three risks: paying for a recommendation, fee-splitting with non-lawyers, and misleading users about why a lawyer is shown.
- Israeli lawyer advertising rules allow online advertising and professional presentation, but advertising must not mislead the public, harm the dignity of the profession, or create unsupported superiority claims.
- Current law-firm lead-generation practice favors speed-to-lead, precise practice-area filtering, and clear qualification. Poorly qualified purchased leads create churn and distrust.

## Business Interpretation

The owner is right: unanswered/unmonetized calls are money leaking. But the answer should not be an unsafe "pay per referral" product first. The safer product is:

1. Capture every uncovered request.
2. Classify it by practice, jurisdiction, urgency, city/language, and budget/intent.
3. Put it into an **Uncovered Demand Queue**.
4. Use the queue to recruit lawyers into paid subscription/coverage plans.
5. Route only after the lawyer is onboarded, properly disclosed, and inside a compliant paid plan.

## Recommended Model

### Phase 1 - Capture and Learn

Every call or form that cannot be matched should still become structured business data.

Required fields:
- request type;
- jurisdiction/country;
- Israeli connection;
- city;
- urgency;
- language;
- contact consent;
- desired outcome;
- whether the user already has documents/deadline/court date;
- whether a lawyer category is currently uncovered.

Owner-visible value:
- fewer forgotten calls;
- daily list of missing lawyer categories;
- evidence for which lawyer niches to recruit next.

### Phase 2 - Partner Acquisition

When a category appears repeatedly, Jus-Tice uses it as a sales asset:

> "We received X relevant requests this month in Thailand/foreign-law matters. We are opening one compliant partner slot for this category."

Revenue model:
- subscription-only coverage slot;
- no fee split;
- no guarantee of outcome;
- clear label if paid/featured;
- capped leads by tier;
- response SLA as part of the plan.

### Phase 3 - Routing

When a paying lawyer covers the category:

- user receives neutral, transparent matching language;
- lawyer receives the structured intake;
- lead is counted against plan cap;
- response time is tracked;
- unresolved/no-response leads can be reassigned only under the published routing rules.

### Phase 4 - Niche Landing Pages

Only after enough demand is observed:

- create a controlled niche hub, e.g. `/thailand-lawyer-israel/`;
- include disclaimers about foreign jurisdiction limits;
- list only verified coverage;
- avoid "best/top" language;
- connect to the editorial policy and intake form.

## What Not To Do Yet

- Do not charge the user a "connection fee" before a clear legal/compliance review.
- Do not tell the user that a lawyer is "recommended" unless a compliant recommendation standard exists.
- Do not sell the same urgent lead to many lawyers without disclosure.
- Do not give legal advice during intake.
- Do not promise a lawyer exists for a category before coverage is verified.
- Do not take a percentage of legal fees unless a licensed-lawyer compliant structure is approved by legal counsel.

## Practical Product Definition

New internal status for leads:

| Status | Meaning | Business action |
|---|---|---|
| covered_routable | Matching paying lawyer exists | Route under plan rules |
| covered_nonpaying | Lawyer exists but not in paid plan | Recruit lawyer or handle manually with owner approval |
| uncovered_recruit | Demand exists, no lawyer coverage | Add to partner acquisition queue |
| unsupported | Outside site scope or unsafe | Send neutral no-match response |
| urgent_manual | Deadline/court/safety urgency | Owner/manual escalation, no automation-only handling |

## Completion Assessment

Lead monetization/intake moved from **24% to 30%** in planning maturity because the leakage path is now defined. It is not live revenue yet.

## Next Implementation

1. Add an internal `coverage_status` field to lead CRM.
2. Add an "Uncovered Demand Queue" admin/report view.
3. Add a daily/weekly report listing top uncovered categories.
4. Create a lawyer recruitment script from the queue evidence.
5. Add a safe no-match user email/WhatsApp template.

## Honest Money Statement

This cycle did not earn money. It prevents future waste by converting unmatched calls into data that can recruit paying lawyers and justify niche paid coverage plans.

