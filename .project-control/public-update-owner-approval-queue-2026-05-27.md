# Public Update Owner Approval Queue - 2026-05-27

Status: OWNER_APPROVAL_QUEUE_READY_NOT_APPROVED

Source packet date: 2026-05-27

Scope: private owner/SEO queue for the managed-service public-update candidates. This does not publish, edit CMS content, add internal links, alter title/H1/meta, create redirects/canonicals/noindex/sitemap/taxonomy entries, create leads, contact lawyers, invoice, charge payment, send email, use WhatsApp/TalkTo or deploy uPress.

## Summary

- Queue rows: 5
- Ready for owner review: 2
- Candidate after owner context choice: 2
- Explicitly blocked routes: 1
- Rental packet status: OWNER_REVIEW_PACKET_READY_NOT_APPROVED
- Demand-letter packet status: OWNER_REVIEW_PACKET_READY_NOT_APPROVED
- Public-copy marker hits across source packets: 0
- Public changes approved by this queue: 0

## Approval Queue

| Rank | Workstream | Target | Status | Owner Decision Needed | Why This Order | Source Packet | Associated Pages | Next After Approval | Hard Blocker |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | rental_agreement | https://jus-tice.co.il/rental-agreement/ | READY_FOR_OWNER_REVIEW_NOT_APPROVED | Approve, edit or reject the existing-route rental-agreement update packet. | It upgrades an existing route and avoids creating a duplicate lease/rental page. | .project-control/rental-agreement-public-update-approval-packet-2026-05-27.md | /rental-agreement-guide/; /landlord-obligations-israel/; /tenant-rights-israel/; /landlord-rights-israel/; /tenant-eviction-defense/; /eviction-notice-israel/; /commercial-lease-israel/; /contract-law-israel/ | Run source/legal review, SEO length review, CMS draft/update, mobile duplicate-CTA QA, then send Hebrew publication email with associated pages. | No CMS edit, link, title/H1/meta change or CTA publication before owner/SEO/legal approval. |
| 2 | demand_letter_employment | https://jus-tice.co.il/labor-lawyer/ | READY_FOR_OWNER_REVIEW_NOT_APPROVED | Choose whether employment is the first demand-letter context. | It is the highest-risk existing route in the demand-letter packet and should be handled before any generic demand-letter copy. | .project-control/demand-letter-public-update-approval-packet-2026-05-27.md | /wrongful-termination-israel/; /employment-contract-termination/; /severance-pay-calculator/ | Keep broad labor-law intent intact; add only a contextual subsection/CTA and run mobile duplicate-CTA QA. | No generic demand-letter title, page or above-the-fold rewrite. |
| 3 | demand_letter_consumer | https://jus-tice.co.il/consumer-rights-israel/ | CANDIDATE_AFTER_OWNER_CHOOSES_CONTEXT | Decide if consumer refund/cancellation is a better first demand-letter context than employment. | Lower route risk than employment, but still needs consumer-law source review. | .project-control/demand-letter-public-update-approval-packet-2026-05-27.md | /small-claims-court-israel/; /consumer-lawyer/ | Add only consumer-remedy wording after rights/evidence explanation; avoid generic legal-letter framing. | No public checkout or fixed price until legal/payment gates are approved. |
| 4 | demand_letter_rental_dispute | https://jus-tice.co.il/eviction-notice-israel/ | CANDIDATE_AFTER_RENTAL_AND_OWNER_REVIEW | Decide if rental-dispute demand letters should wait until rental-agreement copy is settled. | Useful route, but it can blur with rental-agreement review unless sequencing is deliberate. | .project-control/demand-letter-public-update-approval-packet-2026-05-27.md | /tenant-eviction-defense/; /landlord-rights-israel/; /rental-agreement-guide/ | Keep eviction/dispute intent separate from lease drafting or review. | Do not mix rental-dispute demand-letter copy with the rental agreement managed-service CTA. |
| 99 | generic_demand_letter | NEW_GENERIC_DEMAND_LETTER_ROUTE | BLOCKED_DO_NOT_CREATE | No approval recommended. | Generic intent collides with employment, consumer, rental and small-claims pages. | .project-control/demand-letter-public-update-approval-packet-2026-05-27.md | /labor-lawyer/; /consumer-rights-israel/; /small-claims-court-israel/; /eviction-notice-israel/; /wrongful-termination-israel/ | Keep blocked unless owner/SEO later provides a separate strategy. | No /demand-letter/ page, generic H1/meta or one-size-fits-all letter promise. |

## Recommended Owner Decision

1. Review rental agreement first because it upgrades an existing route and has a complete owner-review packet.
2. Pick at most one demand-letter context next. Do not approve all three at once.
3. Keep the generic demand-letter page blocked.
4. Before any public update, run legal/source review, SEO review, mobile CTA duplicate QA and publication email workflow.

## Safety Statement

This queue exists to avoid abandoned or scattered public-update ideas. It is not approval to publish or monetize anything.
