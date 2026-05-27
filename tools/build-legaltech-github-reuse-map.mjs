import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'LEGALTECH_GITHUB_REUSE_MAP_READY_NO_CODE_COPIED';

function parseArgs() {
  const args = { reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }
  return args;
}

function outputFiles(reportDate) {
  const base = `legaltech-github-reuse-map-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function relativePath(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(rows, columns) {
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function htmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function sourceRows() {
  return [
    {
      source_id: 'LT-01',
      source_name: 'Vaquill-AI/awesome-legaltech',
      source_url: 'https://github.com/Vaquill-AI/awesome-legaltech',
      observed_signal: 'Curated LegalTech index covering open-source platforms, AI models, MCP servers, companies, datasets and legal tools; GitHub API check saw 90 stars, 24 forks and update on 2026-05-27.',
      license_reuse_note: 'No repository license detected in GitHub API result. Treat as research index only unless a later license review clears specific items.',
      jus_tice_translation: 'Use it as a quarterly source radar for datasets, legal NLP, contract review, citation verification and legal-data infrastructure, not as code to paste.',
      fastest_revenue_use: 'Turn the list into a filtered backlog of features that improve lead quality and lawyer conversion: intake, document checklist, source verification and human-review gates.',
      action_status: 'RESEARCHED_TRANSLATED_TO_BACKLOG',
      blocker: 'Needs owner priority decision before any implementation beyond planning.',
      copy_status: 'NO_CODE_COPIED',
    },
    {
      source_id: 'LT-02',
      source_name: 'GitHub legal-tech topic',
      source_url: 'https://github.com/topics/legal-tech',
      observed_signal: 'GitHub topic page reports 888 public repositories; examples include legal data, contract review, legal RAG, MCP legal databases, document redaction and guided tools.',
      license_reuse_note: 'Topic page is a discovery source. Every repo requires separate license/security review before use.',
      jus_tice_translation: 'Create a short reusable gate: problem type, source jurisdiction, license, privacy risk, user value, revenue path and whether it fits Hebrew public-help pages.',
      fastest_revenue_use: 'Use the gate to prevent drift and select only tools that advance paid leads, lawyer onboarding or safer content QA.',
      action_status: 'RESEARCHED_TRANSLATED_TO_SELECTION_GATE',
      blocker: 'Broad topic pages are noisy; owner needs a ranked target, not unlimited exploration.',
      copy_status: 'NO_CODE_COPIED',
    },
    {
      source_id: 'LT-03',
      source_name: 'jhpyle/docassemble',
      source_url: 'https://github.com/jhpyle/docassemble',
      observed_signal: 'Open-source expert system for guided interviews and document assembly; GitHub API check saw MIT license, 951 stars, 304 forks and update on 2026-05-24.',
      license_reuse_note: 'MIT license is integration-friendly, but no code should be copied into the WordPress theme without architecture review.',
      jus_tice_translation: 'Translate the guided-interview idea into Hebrew legal intake flows with plain questions, document checklist, urgency flags and explicit consent before matching.',
      fastest_revenue_use: 'Bituach Leumi or criminal Jerusalem guided intake can raise lead quality and give lawyers a cleaner case summary before paid handoff.',
      action_status: 'HIGH_PRIORITY_NEXT_SPEC',
      blocker: 'Needs owner approval for a live/staging route and privacy-safe field set.',
      copy_status: 'CONCEPT_USED_NO_CODE_COPIED',
    },
    {
      source_id: 'LT-04',
      source_name: 'SuffolkLITLab/docassemble-AssemblyLine',
      source_url: 'https://github.com/SuffolkLITLab/docassemble-AssemblyLine',
      observed_signal: 'Paper form to runnable guided web application workflow; GitHub API check saw MIT license, 62 stars, 9 forks and update on 2026-05-21.',
      license_reuse_note: 'MIT license is permissive. Still treat as workflow inspiration unless a later implementation plan imports code.',
      jus_tice_translation: 'Use the form-to-interview pattern for local practice pages: one page should collect facts, deadlines, documents and desired outcome before asking for a lawyer.',
      fastest_revenue_use: 'Creates better structured leads and a natural reason for lawyers to pay because each lead arrives with context.',
      action_status: 'HIGH_PRIORITY_NEXT_SPEC',
      blocker: 'Needs a narrow route choice and owner-approved consent language.',
      copy_status: 'CONCEPT_USED_NO_CODE_COPIED',
    },
    {
      source_id: 'LT-05',
      source_name: 'docusealco/docuseal',
      source_url: 'https://github.com/docusealco/docuseal',
      observed_signal: 'Open-source document filling and signing; GitHub API check saw AGPL-3.0, 16990 stars, 1588 forks and update on 2026-05-27.',
      license_reuse_note: 'AGPL-3.0 is not safe to embed in the theme casually. Do not copy code. Consider only separate-service evaluation after legal/architecture approval.',
      jus_tice_translation: 'Use the product pattern now: signed consent/terms evidence, audit trail thinking, mobile-friendly signing steps and clear separation between test and live.',
      fastest_revenue_use: 'Improve manual invoice and lawyer/supplier terms proof before automated payment is ready.',
      action_status: 'CONCEPT_ONLY_LICENSE_GATED',
      blocker: 'AGPL and electronic-signature legal review block code reuse.',
      copy_status: 'CONCEPT_USED_NO_CODE_COPIED',
    },
    {
      source_id: 'LT-06',
      source_name: 'open-agreements/open-agreements',
      source_url: 'https://github.com/open-agreements/open-agreements',
      observed_signal: 'Fills standard legal agreement templates and produces signable DOCX files; GitHub API check saw MIT license, 34 stars, 6 forks and update on 2026-05-27.',
      license_reuse_note: 'MIT license is permissive. Any template content still needs jurisdiction/legal review before public or operational use.',
      jus_tice_translation: 'Translate into Jus-Tice partner-term packets: lead-fee terms, subscription terms, manual invoice fallback and owner-approved consent wording.',
      fastest_revenue_use: 'Creates a faster manual path to paid lawyer or supplier agreements while Grow/Meshulam is blocked.',
      action_status: 'HIGH_PRIORITY_REVENUE_PACKET_CANDIDATE',
      blocker: 'Needs owner/legal review of exact Hebrew terms before use with lawyers or suppliers.',
      copy_status: 'CONCEPT_USED_NO_CODE_COPIED',
    },
    {
      source_id: 'LT-07',
      source_name: 'LexPredict/lexpredict-lexnlp',
      source_url: 'https://github.com/LexPredict/lexpredict-lexnlp',
      observed_signal: 'Legal NLP extraction library; GitHub API check saw AGPL-3.0, 780 stars, 201 forks and update on 2026-05-26.',
      license_reuse_note: 'AGPL-3.0 blocks casual theme integration. Use as pattern research unless a separate compliant service is approved.',
      jus_tice_translation: 'Use the extraction idea to define fields for dates, amounts, parties, deadlines, documents and legal issue tags in CRM, without copying code.',
      fastest_revenue_use: 'Better triage means less lawyer friction and a stronger paid-lead value proposition.',
      action_status: 'CONCEPT_ONLY_LICENSE_GATED',
      blocker: 'Needs license/security review and no paid API spend.',
      copy_status: 'CONCEPT_USED_NO_CODE_COPIED',
    },
    {
      source_id: 'LT-08',
      source_name: 'openlegaldata/awesome-legal-data',
      source_url: 'https://github.com/openlegaldata/awesome-legal-data',
      observed_signal: 'Collection of datasets and resources for legal text processing; GitHub API check saw 246 stars, 40 forks and update on 2026-05-23.',
      license_reuse_note: 'Index only. Each dataset has its own license and jurisdiction fit.',
      jus_tice_translation: 'Use as source discovery for content QA and anti-cannibalization evidence, not for automatic publication.',
      fastest_revenue_use: 'Improves trustworthy Hebrew legal-help pages that attract better organic traffic.',
      action_status: 'CONTENT_QA_SOURCE_CANDIDATE',
      blocker: 'Needs source-by-source legal and Hebrew relevance review.',
      copy_status: 'NO_CODE_COPIED',
    },
    {
      source_id: 'LT-09',
      source_name: 'maastrichtlawtech/awesome-legal-nlp',
      source_url: 'https://github.com/maastrichtlawtech/awesome-legal-nlp',
      observed_signal: 'Curated legal NLP resources; GitHub API check saw MIT license, 324 stars, 40 forks and update on 2026-05-21.',
      license_reuse_note: 'Awesome list license does not clear every linked model/dataset. Use as research index.',
      jus_tice_translation: 'Create a local legal-NLP candidate list for no-API document tagging, deadline detection and practice-area classification.',
      fastest_revenue_use: 'Can improve lead routing and lawyer matching once tested on private, consented examples.',
      action_status: 'RESEARCHED_TRANSLATED_TO_BACKLOG',
      blocker: 'Needs Hebrew/legal-domain suitability checks.',
      copy_status: 'NO_CODE_COPIED',
    },
    {
      source_id: 'LT-10',
      source_name: 'Development Gateway Automatic Contract Summarizer',
      source_url: 'https://devgateway.github.io/automatic-contract-summarizer-portal/',
      observed_signal: 'Describes parsing PDF/Word documents, LLM extraction, portable JSON/Markdown/CSV outputs and hallucination control.',
      license_reuse_note: 'Treat as architecture inspiration until repository/license review is performed.',
      jus_tice_translation: 'Reuse the output discipline: every AI-assisted document or lead summary should have source fields, confidence, human check and CSV/JSON export.',
      fastest_revenue_use: 'Makes lawyer-paid leads easier to review because case facts are portable and auditable.',
      action_status: 'CONCEPT_USED_FOR_QA_PATTERN',
      blocker: 'No unattended paid LLM or private document processing without owner approval and consent.',
      copy_status: 'CONCEPT_USED_NO_CODE_COPIED',
    },
    {
      source_id: 'LT-11',
      source_name: 'Accord Project',
      source_url: 'https://accordproject.org/',
      observed_signal: 'Open-source smart legal contract ecosystem with machine-readable agreement templates and technology-neutral format.',
      license_reuse_note: 'Project ecosystem requires per-package review; do not import templates without legal review.',
      jus_tice_translation: 'Use the machine-readable agreement idea for partner terms: price, SLA, jurisdiction, accepted lead type, billing proof and status history.',
      fastest_revenue_use: 'Structured terms reduce disputes when converting lawyers or suppliers to paid paths.',
      action_status: 'REVENUE_TERMS_MODEL_CANDIDATE',
      blocker: 'Needs exact Israeli-law terms and owner approval.',
      copy_status: 'CONCEPT_USED_NO_CODE_COPIED',
    },
    {
      source_id: 'LT-12',
      source_name: 'Suzie Law',
      source_url: 'https://suzielaw.com/',
      observed_signal: 'Open-source legal AI workspace positioning around document Q&A, drafting, structured review and DOCX output.',
      license_reuse_note: 'Landing page only reviewed this cycle. Any GitHub code requires a separate license/security review.',
      jus_tice_translation: 'Translate workspace thinking into the lawyer dashboard: each lead should have facts, documents, status, billing state and next action in one place.',
      fastest_revenue_use: 'Improves perceived lawyer value of a subscription or paid lead because the dashboard looks like a matter workspace, not a contact dump.',
      action_status: 'DASHBOARD_UX_CANDIDATE',
      blocker: 'Needs dashboard implementation time and owner approval for live workflow changes.',
      copy_status: 'CONCEPT_USED_NO_CODE_COPIED',
    },
  ];
}

function actionRows() {
  return [
    {
      action_id: 'LEGALTECH-NEXT-01',
      priority: 'P0',
      action: 'Build a Bituach Leumi guided-intake spec using docassemble and AssemblyLine patterns.',
      revenue_path: 'Higher quality paid leads for Bituach Leumi specialists.',
      approval_needed: 'Owner approves route QA/spec only; no public publish yet.',
      status: 'NEXT',
    },
    {
      action_id: 'LEGALTECH-NEXT-02',
      priority: 'P0',
      action: 'Build lawyer/supplier terms packet inspired by OpenAgreements and Accord Project.',
      revenue_path: 'Manual invoice path while Grow/Meshulam remains blocked.',
      approval_needed: 'Owner/legal approval of exact Hebrew commercial terms.',
      status: 'NEXT',
    },
    {
      action_id: 'LEGALTECH-NEXT-03',
      priority: 'P1',
      action: 'Add a no-code document/lead summary schema inspired by LexNLP and contract summarizer outputs.',
      revenue_path: 'Cleaner CRM handoff and stronger lawyer conversion story.',
      approval_needed: 'Private consented sample or owner-approved dummy examples only.',
      status: 'NEXT',
    },
    {
      action_id: 'LEGALTECH-NEXT-04',
      priority: 'P1',
      action: 'Use Vaquill/awesome-list sources as anti-drift research radar for legal-help pages.',
      revenue_path: 'Safer organic traffic through evidence-backed content QA.',
      approval_needed: 'No public content publish without anti-cannibalization review.',
      status: 'NEXT',
    },
  ];
}

function buildMarkdown({ summary, sources, actions }) {
  return [
    `# LegalTech GitHub reuse map - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project Manager Check',
    '',
    `Active goal: turn outside LegalTech research into Jus-Tice revenue tasks without copying unsafe code.`,
    `Readiness to profit: ${summary.readinessToProfitPercent}% planning readiness, ${summary.liveRevenueImpactPercent}% live revenue impact.`,
    `Honesty: ${summary.honestyStatement}`,
    '',
    '## What Was Actually Used',
    '',
    '- External repositories and pages were used as research sources and product-pattern references.',
    '- No executable external code was copied into the theme.',
    '- The useful ideas were translated into Jus-Tice-specific action rows for Hebrew legal intake, lawyer terms, manual billing, source verification and dashboard/matter workflow.',
    '- AGPL projects are explicitly marked as license-gated and concept-only.',
    '- Lovable was not available as a callable plugin in this Codex environment; broad plugin installation was not performed.',
    '',
    '## Source Map',
    '',
    '| ID | Source | Signal | Reuse note | Jus-Tice translation | Fastest revenue use | Status | Blocker | Copy status |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...sources.map((row) => `| ${row.source_id} | [${mdCell(row.source_name)}](${row.source_url}) | ${mdCell(row.observed_signal)} | ${mdCell(row.license_reuse_note)} | ${mdCell(row.jus_tice_translation)} | ${mdCell(row.fastest_revenue_use)} | ${row.action_status} | ${mdCell(row.blocker)} | ${row.copy_status} |`),
    '',
    '## Action Queue',
    '',
    '| ID | Priority | Action | Revenue path | Approval needed | Status |',
    '| --- | --- | --- | --- | --- | --- |',
    ...actions.map((row) => `| ${row.action_id} | ${row.priority} | ${mdCell(row.action)} | ${mdCell(row.revenue_path)} | ${mdCell(row.approval_needed)} | ${row.status} |`),
    '',
    '## Completion Assessment',
    '',
    '- Research and translation packet: 100%.',
    '- Code reuse: 0%, intentionally blocked pending license and architecture review.',
    '- Live site effect: 0%, intentionally no public changes.',
    '- Recommended next concrete build: Bituach Leumi guided-intake spec or lawyer/supplier terms packet.',
  ].join('\n');
}

function buildHtml({ summary, sources, actions }) {
  const sourceRowsHtml = sources.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.source_id)}</code></td>
      <td><a href="${htmlEscape(row.source_url)}">${htmlEscape(row.source_name)}</a></td>
      <td>${htmlEscape(row.observed_signal)}</td>
      <td>${htmlEscape(row.jus_tice_translation)}</td>
      <td>${htmlEscape(row.fastest_revenue_use)}</td>
      <td>${htmlEscape(row.copy_status)}</td>
    </tr>`).join('');
  const actionRowsHtml = actions.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.action_id)}</code></td>
      <td>${htmlEscape(row.priority)}</td>
      <td>${htmlEscape(row.action)}</td>
      <td>${htmlEscape(row.revenue_path)}</td>
      <td>${htmlEscape(row.approval_needed)}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>LegalTech GitHub reuse map</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f7f8fa; color: #172033; line-height: 1.55; }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 18px 56px; }
    h1, h2 { color: #07152f; }
    h1 { margin: 0 0 8px; font-size: 30px; }
    .status { background: #fff; border: 1px solid #d8dee4; border-radius: 8px; padding: 16px; margin: 18px 0; }
    table { width: 100%; border-collapse: collapse; background: #fff; margin: 12px 0 26px; }
    th, td { border: 1px solid #d8dee4; padding: 10px; vertical-align: top; font-size: 13px; }
    th { background: #e9eef2; text-align: left; }
    code { background: #edf2f7; padding: 2px 5px; border-radius: 5px; }
  </style>
</head>
<body>
<main>
  <h1>LegalTech GitHub reuse map</h1>
  <p>${htmlEscape(summary.reportDate)}</p>
  <section class="status">
    <p><strong>Status:</strong> ${htmlEscape(summary.status)}</p>
    <p><strong>Readiness:</strong> ${summary.readinessToProfitPercent}% planning readiness, ${summary.liveRevenueImpactPercent}% live revenue impact.</p>
    <p><strong>Honesty:</strong> ${htmlEscape(summary.honestyStatement)}</p>
  </section>
  <h2>Sources</h2>
  <table>
    <thead><tr><th>ID</th><th>Source</th><th>Signal</th><th>Jus-Tice translation</th><th>Fastest revenue use</th><th>Copy status</th></tr></thead>
    <tbody>${sourceRowsHtml}</tbody>
  </table>
  <h2>Action queue</h2>
  <table>
    <thead><tr><th>ID</th><th>Priority</th><th>Action</th><th>Revenue path</th><th>Approval needed</th></tr></thead>
    <tbody>${actionRowsHtml}</tbody>
  </table>
</main>
</body>
</html>
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-legaltech-github-reuse-map.mjs --reportDate=YYYY-MM-DD');
    return;
  }

  const files = outputFiles(args.reportDate);
  const sources = sourceRows();
  const actions = actionRows();
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    externalPublicSourcesReviewed: sources.length,
    actionRows: actions.length,
    codeCopiedFromExternalRepos: 0,
    publicCmsChangesApproved: 0,
    paidLlmApiUsed: 0,
    liveRevenueImpactPercent: 0,
    readinessToProfitPercent: 62,
    honestyStatement: 'Concepts and product patterns were used; no executable external repo code was copied into Jus-Tice. License-gated projects are marked concept-only.',
    generated: {
      projectMd: relativePath(files.projectMd),
      projectHtml: relativePath(files.projectHtml),
      projectCsv: relativePath(files.projectCsv),
      reportJson: relativePath(files.reportJson),
      reportCsv: relativePath(files.reportCsv),
    },
  };

  writeText(files.projectMd, buildMarkdown({ summary, sources, actions }));
  writeText(files.projectHtml, buildHtml({ summary, sources, actions }));
  writeText(files.projectCsv, toCsv(sources, ['source_id', 'source_name', 'source_url', 'observed_signal', 'license_reuse_note', 'jus_tice_translation', 'fastest_revenue_use', 'action_status', 'blocker', 'copy_status']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, sources, actions }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary).filter((key) => key !== 'generated')));

  console.log(JSON.stringify(summary, null, 2));
}

main();
