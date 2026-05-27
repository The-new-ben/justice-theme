# Legaltech GitHub Transfer Review - 2026-05-27

Status: LEGALTECH_GITHUB_REVIEW_READY_INTERNAL_ONLY_NO_PUBLIC_CHANGE

Scope: private research transfer packet. This file does not copy third-party code into Jus-Tice, approve dependencies, create AI spend, publish content, change CMS/SEO, contact suppliers, create accounts, run external LLMs, or deploy uPress.

## Sources Reviewed

| Source | What It Is | Relevance To Jus-Tice | Transfer Decision |
| --- | --- | --- | --- |
| `Vaquill-AI/awesome-legaltech` | Broad curated map of legaltech APIs, datasets, MCP servers, platforms, B2C/access-to-justice and document workflows | Useful as a market map, not as direct Israeli legal content | Use categories to shape our roadmap and anti-drift checks |
| `chen-friedman/awesome-legaltech` | Legaltech list with Israel/Hebrew entries such as Legal-HeBERT, Open Knesset and Hebrew transcription resources | More relevant to Hebrew/Israel than the Vaquill list | Use for Hebrew/Israel research and future local data review |
| `Open-Source-Legal/OpenContracts` / `cite` | Self-hosted document annotation, semantic search, MCP and ground-truth/versioned knowledge concepts | Strong fit for our evidence gates and source-backed content workflow | Adapt pattern: every legal/content claim should point to a reviewed source packet |
| `lawglance/lawglance` | Open-source RAG legal assistant focused on public legal access | Strong product-direction signal: public user first, lawyer second | Adapt pattern: guided legal help by situation before supplier/lawyer monetization |
| `blopa/Contract-Builder` | Google Sheets powered legal-document generation | Useful no-code pattern for early paid document/service products | Adapt pattern: structured templates for rental/demand/appeal prep, but only after legal review |
| `documenso/documenso` | Open-source document signing / DocuSign alternative | Relevant later for lawyer/supplier terms and client consent | Park until payment/supplier loop is proven; do not self-host now |
| `SuffolkLITLab/docassemble-AssemblyLine` | Guided interviews and court-form automation | Strong fit for intake and document-prep flows | Adapt pattern: issue-specific guided interview, especially Bituach Leumi and rental |
| `dealfluence/adeu` | DOCX to Markdown and back with tracked changes | Useful for human-supervised legal document review | Park as future document workflow; no direct integration now |
| `Legal-HeBERT` | Hebrew legal/law-domain model direction | Relevant to Israeli-language ranking/classification research | Research only; no model/API use now |
| `data-gov-il-mcp` | MCP for Israeli government open data | Potential source discovery layer for public datasets | Research only; no connector installed or external data action now |

## What I Actually Used

I used the GitHub repositories as product and workflow intelligence. I did not copy code into the Jus-Tice theme. I translated the useful patterns into internal Jus-Tice artifacts:

- public legal-help-first homepage direction;
- source-backed content/evidence gates;
- Bituach Leumi first-paid-lead operator command;
- controlled lawyer-subscription proof review;
- project-manager anti-drift startup protocol.

## What Not To Use Directly Yet

| Pattern | Why Not Now | Safer Jus-Tice Version |
| --- | --- | --- |
| US/India case-law APIs and MCP servers | Wrong jurisdiction for Israeli public legal help | Use as architecture inspiration only |
| Generic legal RAG assistant | Legal-risk and hallucination risk without Israeli verified corpus | Use guided intake and human-reviewed source packets first |
| E-sign platform integration | Too early before first supplier/payment loop works | Manual acceptance/proof rows first |
| Full document automation | Needs legal review, templates and liability boundaries | Start with one owner-approved document/service packet |
| Browser/agent automation for accounts | Login/MFA/payment/provider safety risk | Human-supervised owner action plus no-PII review artifacts |

## Transfer To Revenue Roadmap

| Rank | Idea | Revenue Link | Next Internal Step | Publication Status |
| ---: | --- | --- | --- | --- |
| 1 | Guided Bituach Leumi intake and operator proof | Closest to first paid lead | Fill BTL-REV-01 through BTL-REV-03 private evidence | Not published |
| 2 | Lawyer/supplier terms acceptance workflow | Supports paid supplier conversion | Manual proof rows before e-sign automation | Not published |
| 3 | Rental agreement / legal document service packet | Public conversion opportunity on existing route | Owner/legal approval for exact existing-page update | Not published |
| 4 | Source-backed legal content gates | Protects SEO and trust | Attach each update to GSC/source/cannibalization packet | Internal only |
| 5 | Hebrew legal data discovery | Future indexing/research moat | Evaluate Open Knesset, Legal-HeBERT and official Israeli data availability | Research only |

## Honesty Statement

- I reviewed public GitHub material and translated patterns into Jus-Tice-specific internal work.
- I did not install third-party legaltech software.
- I did not copy third-party code.
- I did not run ChatGPT, Claude, Gemini or paid LLM APIs.
- I did not use browser login automation.
- I did not create a supplier, client, invoice, payment, provider mutation or live end-to-end transaction.
- Those live actions need explicit owner approval, credentials/tool access and a safe test scope.

## Source Links

- https://github.com/Vaquill-AI/awesome-legaltech
- https://github.com/chen-friedman/awesome-legaltech
- https://github.com/Open-Source-Legal/OpenContracts
- https://github.com/lawglance/lawglance
- https://github.com/blopa/Contract-Builder
- https://github.com/documenso/documenso
- https://github.com/SuffolkLITLab/docassemble-AssemblyLine
- https://github.com/dealfluence/adeu
- https://github.com/avichaychriqui/Legal-HeBERT
- https://github.com/DavidOsherdiagnostica/data-gov-il-mcp
