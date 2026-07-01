# Legaltech OSS + Harvey research digest

Date: 2026-07-03. For: AI roadmap wires beyond courtai.

## Harvey patterns to copy (verified via harvey.ai + credible reviews)
1. Ground every answer to an exact source passage; no uncited output.
2. Matter-centric "Vault": documents scoped per matter, AI runs inside.
3. Tabular bulk review: row per document, column per question.
4. No-code workflow agents grounded in "golden examples".
5. Lawyer-in-the-loop Shared Spaces: client drafts under lawyer
   oversight with audit trail (maps to our review_request flow).
6. "Draft for professional review" framing everywhere (we already do).
7. Curated prompt/workflow library instead of a blank chatbox.
8. Meet users in their tools (Word/Outlook add-ins, mobile voice).

## OSS verdicts (A=port concept, B=data source, C=embed, D=skip)
- docassemble (MIT, active): C. Guided-interview sidecar, RTL-capable.
- SuffolkLITLab AssemblyLine (MIT): A. Court-form -> interview method.
- freelawproject/eyecite (BSD-2): A. Hebrew citation parser concept
  (patterns for בג"ץ / ע"א / פ"ד) to link + verify citations.
- freelawproject/courtlistener (AGPL): A. Architecture blueprint only.
- lawglance (Apache-2.0): A. RAG pipeline shape for "ask the law".
- LexNLP (AGPL, stale), Blackstone (inactive), accordproject,
  openlaw-core (archived): D.

## Israeli / Hebrew assets that actually exist
- HF dataset LevMuchnik/SupremeCourtOfIsrael: 751k Supreme Court
  decisions, rich metadata, OpenRAIL. Best ready RAG corpus. (B)
- avichr/Legal-heBERT (HF weights): Hebrew legal embeddings. (B/C)
- Knesset OData (knesset.gov.il/Odata/ParliamentInfo.svc): live bills
  and legislation metadata, official. (B)
- data.gov.il CKAN API: Ministry of Justice datasets. (B)
- Supreme Court official JSON: supremedecisions.court.gov.il. (B)
- Nevo/Takdin: proprietary, no usable OSS scrapers, ToS risk. Skip.

## Top 3 wires (priority)
1. Grounded Hebrew RAG: index the Supreme Court corpus + Knesset OData
   behind the existing OpenAI proxy, lawglance-style; every knowledge
   answer returns source snippets; Hebrew citation parser links them.
   (New infra: vector store; propose as a dedicated project.)
2. Docassemble sidecar for guided interviews on Israeli court forms
   using the AssemblyLine methodology. (Separate hosting.)
3. Harvey-style Shared Spaces on our marketplace: AI draft -> "טיוטה
   לבדיקת עורך דין" -> routed lawyer review with audit trail. Our
   review_request flow is step one; add lawyer-side review UI next.
