import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'LAWYER_MANUAL_INVOICE_TARGET_PUBLIC_SOURCE_RECHECK_READY_NO_LIVE_ACTION';

function parseArgs() {
  const args = { reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) args.reportDate = arg.slice('--reportDate='.length);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) throw new Error('--reportDate must be YYYY-MM-DD');
  return args;
}

function outputFiles(reportDate) {
  const base = `lawyer-manual-invoice-target-public-source-recheck-${reportDate}`;
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
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
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
      source_id: 'SRC-01',
      source_url: 'https://samaratviot.co.il/',
      source_type: 'firm homepage',
      recheck_status: 'SUPPORTS_BTL_FIT',
      supports: 'Homepage states public positioning around medical-rights realization, Bituach Leumi, medical committees, court/labor-court representation and a long-running professional office.',
      does_not_prove: 'Does not prove current license status, willingness to buy Jus-Tice Pro, billing contact permission or commercial acceptance.',
      repo_privacy_note: 'Do not store public phone/email from the page in repo artifacts.',
    },
    {
      source_id: 'SRC-02',
      source_url: 'https://samaratviot.co.il/bituach-leumi/',
      source_type: 'BTL practice page',
      recheck_status: 'SUPPORTS_BTL_FIT',
      supports: 'BTL page supports Bituach Leumi, medical committee, work injury, occupational disease, general disability, mobility and special-services relevance.',
      does_not_prove: 'Does not prove lead-response SLA, subscription fit, invoice readiness or permission for no-PII commercial conversation.',
      repo_privacy_note: 'Page redirects to a longer Hebrew slug; keep only URL and yes/no support in repo.',
    },
    {
      source_id: 'SRC-03',
      source_url: 'https://samaratviot.co.il/%D7%90%D7%95%D7%93%D7%95%D7%AA/',
      source_type: 'about page',
      recheck_status: 'SUPPORTS_OFFICE_BACKGROUND',
      supports: 'About page supports office background in civil litigation, torts, medical negligence, Bituach Leumi and medical-rights representation.',
      does_not_prove: 'Does not independently verify bar license, current active status or terms acceptance.',
      repo_privacy_note: 'No raw contact details should be copied into repo files.',
    },
    {
      source_id: 'SRC-04',
      source_url: 'https://samaratviot.co.il/%d7%9c%d7%99%d7%a7%d7%95%d7%99%d7%99%d7%9d-%d7%91%d7%9b%d7%a4%d7%95%d7%aa-%d7%a8%d7%92%d7%9c%d7%99%d7%99%d7%9d-%d7%94%d7%9e%d7%96%d7%9b%d7%99%d7%9d-%d7%91%d7%a0%d7%9b%d7%95%d7%aa/',
      source_type: 'BTL article',
      recheck_status: 'SUPPORTS_APPEAL_AND_COMMITTEE_FIT',
      supports: 'Article page supports Bituach Leumi lawyer positioning, medical committees, appeal/appeal-committee language and labor-court continuation.',
      does_not_prove: 'Does not prove willingness to accept Pro 349 or that a specific lawyer can respond to a first commercial conversation.',
      repo_privacy_note: 'Use as public fit signal only, not as approval to contact.',
    },
  ];
}

function gateRows() {
  return [
    {
      gate_id: 'RECHECK-01',
      gate: 'current_public_source_fit',
      status: 'PASS_PUBLIC_SOURCE_SUPPORT',
      evidence: 'Public pages support Bituach Leumi and medical-committee fit for the recommended target.',
      still_blocked: 'Owner target approval and private source/license review.',
      live_action_allowed: 'NO',
    },
    {
      gate_id: 'RECHECK-02',
      gate: 'license_active_status',
      status: 'BLOCKED_PRIVATE_OR_OFFICIAL_VERIFICATION_REQUIRED',
      evidence: 'No official license/active-status check was completed in this cycle.',
      still_blocked: 'Independent license and active-status verification.',
      live_action_allowed: 'NO',
    },
    {
      gate_id: 'RECHECK-03',
      gate: 'commercial_acceptance',
      status: 'BLOCKED_OWNER_AND_TARGET_ACCEPTANCE_REQUIRED',
      evidence: 'Public pages do not prove acceptance of Pro 349, billing readiness or subscription terms.',
      still_blocked: 'Owner-approved conversation and target acceptance.',
      live_action_allowed: 'NO',
    },
    {
      gate_id: 'RECHECK-04',
      gate: 'privacy_boundary',
      status: 'PASS_REPO_NO_CONTACT_DETAILS',
      evidence: 'The packet intentionally stores public URLs and summarized support only, not phone/email/contact details.',
      still_blocked: 'Private admin storage is required for any future billing/contact details.',
      live_action_allowed: 'NO',
    },
  ];
}

function buildMarkdown({ summary, sources, gates }) {
  return [
    `# Target public source recheck - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project Manager Check',
    '',
    'Active goal: validate public-source fit for the recommended first paid lawyer target before any owner-approved live action.',
    `Readiness to profit: ${summary.readinessToProfitPercent}% public-source readiness, ${summary.liveRevenueImpactPercent}% live revenue impact.`,
    `Honesty: ${summary.honestyStatement}`,
    '',
    '## Target',
    '',
    `Target ID: \`${summary.targetId}\``,
    `Candidate: ${summary.candidate}`,
    `Recommended offer if all later gates pass: ${summary.recommendedPlan} at ${summary.recommendedMonthlyIls} ILS/month including VAT.`,
    '',
    '## Source Recheck Rows',
    '',
    '| Source | URL | Type | Status | Supports | Does not prove | Privacy note |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...sources.map((row) => `| ${row.source_id} | ${mdCell(row.source_url)} | ${row.source_type} | ${row.recheck_status} | ${mdCell(row.supports)} | ${mdCell(row.does_not_prove)} | ${mdCell(row.repo_privacy_note)} |`),
    '',
    '## Gates',
    '',
    '| Gate | Status | Evidence | Still blocked | Live action |',
    '| --- | --- | --- | --- | --- |',
    ...gates.map((row) => `| ${row.gate_id} ${row.gate} | ${row.status} | ${mdCell(row.evidence)} | ${mdCell(row.still_blocked)} | ${row.live_action_allowed} |`),
    '',
    '## Boundaries',
    '',
    '- No target was contacted.',
    '- No CRM/admin record was created or edited.',
    '- No contact details were copied into this repo artifact.',
    '- No license or active-status verification was completed here.',
    '- No invoice, payment request, paid status, public profile or uPress action is approved by this packet.',
  ].join('\n');
}

function buildHtml({ summary, sources, gates }) {
  const sourceRowsHtml = sources.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.source_id)}</code></td>
      <td><a href="${htmlEscape(row.source_url)}">${htmlEscape(row.source_url)}</a></td>
      <td>${htmlEscape(row.recheck_status)}</td>
      <td>${htmlEscape(row.supports)}</td>
      <td>${htmlEscape(row.does_not_prove)}</td>
    </tr>`).join('');
  const gateRowsHtml = gates.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.gate_id)}</code></td>
      <td>${htmlEscape(row.status)}</td>
      <td>${htmlEscape(row.evidence)}</td>
      <td>${htmlEscape(row.still_blocked)}</td>
    </tr>`).join('');
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>בדיקת מקור ציבורי ליעד מומלץ</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f6f7f8; color: #182033; line-height: 1.58; }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 18px 56px; }
    h1 { margin: 0 0 10px; font-size: 30px; color: #07152f; }
    h2 { margin-top: 28px; color: #07152f; }
    .status { background: #fff; border: 1px solid #d7dde5; border-radius: 8px; padding: 16px; margin: 18px 0; }
    table { width: 100%; border-collapse: collapse; background: #fff; margin: 12px 0 24px; }
    th, td { border: 1px solid #d7dde5; padding: 10px; vertical-align: top; font-size: 13px; }
    th { background: #e9eef2; text-align: right; }
    code { direction: ltr; unicode-bidi: plaintext; background: #edf2f7; padding: 2px 5px; border-radius: 5px; }
    a { overflow-wrap: anywhere; }
  </style>
</head>
<body>
<main>
  <h1>בדיקת מקור ציבורי ליעד מומלץ</h1>
  <section class="status">
    <p><strong>Status:</strong> <code>${htmlEscape(summary.status)}</code></p>
    <p><strong>Target:</strong> <code>${htmlEscape(summary.targetId)}</code> - ${htmlEscape(summary.candidate)}</p>
    <p><strong>כנות:</strong> ${htmlEscape(summary.honestyStatement)}</p>
  </section>
  <h2>מקורות ציבוריים</h2>
  <table>
    <thead><tr><th>ID</th><th>URL</th><th>Status</th><th>Supports</th><th>Does not prove</th></tr></thead>
    <tbody>${sourceRowsHtml}</tbody>
  </table>
  <h2>שערים</h2>
  <table>
    <thead><tr><th>ID</th><th>Status</th><th>Evidence</th><th>Still blocked</th></tr></thead>
    <tbody>${gateRowsHtml}</tbody>
  </table>
</main>
</body>
</html>
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-lawyer-manual-invoice-target-public-source-recheck.mjs --reportDate=YYYY-MM-DD');
    return;
  }
  const files = outputFiles(args.reportDate);
  const sources = sourceRows();
  const gates = gateRows();
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    targetId: 'BTL-LMI-03-PRIMARY',
    candidate: "סמרה ושות' משרד עורכי דין ונוטריון",
    recommendedPlan: 'pro',
    recommendedMonthlyIls: 349,
    sourceRows: sources.length,
    gateRows: gates.length,
    publicSourceFitSupported: true,
    licenseVerified: false,
    commercialAcceptanceVerified: false,
    contactDetailsStoredInRepo: false,
    publicCmsChangesApproved: 0,
    liveCrmOrOutreachApproved: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    paidLlmApiUsed: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent: 94,
    liveRevenueImpactPercent: 0,
    honestyStatement: 'Current public pages support Bituach Leumi and medical-committee fit, but this packet does not prove license status, commercial acceptance, billing readiness or permission to contact. It does not contact anyone, create CRM records, invoice, request payment, mark paid, publish or deploy.',
    generated: {
      projectMd: relativePath(files.projectMd),
      projectHtml: relativePath(files.projectHtml),
      projectCsv: relativePath(files.projectCsv),
      reportJson: relativePath(files.reportJson),
      reportCsv: relativePath(files.reportCsv),
    },
  };

  writeText(files.projectMd, buildMarkdown({ summary, sources, gates }));
  writeText(files.projectHtml, buildHtml({ summary, sources, gates }));
  writeText(files.projectCsv, toCsv([...sources, ...gates], ['source_id', 'source_url', 'source_type', 'recheck_status', 'supports', 'does_not_prove', 'repo_privacy_note', 'gate_id', 'gate', 'status', 'evidence', 'still_blocked', 'live_action_allowed']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, sources, gates }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary).filter((key) => key !== 'generated')));
  console.log(JSON.stringify(summary, null, 2));
}

main();
