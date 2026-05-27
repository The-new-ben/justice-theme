import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'FIRST_REVENUE_LANE_SCORECARD_READY_OWNER_DECISION_REQUIRED';

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
  const base = `first-revenue-lane-scorecard-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectHtml: path.join(ROOT, '.project-control', `${base}.html`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerReplyCsv: path.join(ROOT, '.project-control', `${base}-owner-reply.csv`),
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

function laneRows() {
  return [
    {
      lane_id: 'LANE-01',
      lane: 'lawyer_subscription_manual_invoice',
      recommendation_rank: 1,
      score_100: 86,
      why_this_rank: 'Closest to money because it does not require client PII, a live matched lead, or payment-provider approval. The lawyer registration and manual invoice follow-up path already exist.',
      existing_assets: 'lawyer registration billing fields; lawyer onboarding payment follow-up; manual invoice path; prospect outreach links; plan-payment admin path',
      next_owner_action: 'Approve one controlled lawyer outreach or choose one existing lawyer/prospect to offer a paid manual-invoice plan.',
      required_owner_inputs: 'lawyer/prospect target; plan or monthly price; billing contact; approved message wording',
      proof_needed_before_revenue_claim: 'manual invoice reference can mark invoice_sent; private payment evidence is required before paid revenue',
      main_blocker: 'No owner-selected lawyer/prospect and no approved outreach/action.',
      live_action_allowed_now: 'NO',
      readiness_to_profit_percent: 86,
      live_revenue_impact_percent: 0,
    },
    {
      lane_id: 'LANE-02',
      lane: 'btl_qualified_appeal_lead_fee',
      recommendation_rank: 2,
      score_100: 78,
      why_this_rank: 'Strong revenue fit and already has Bituach Leumi prospect/readiness packets, but it needs verified specialists plus a consented lead and owner release before billing.',
      existing_assets: 'BTL revenue hints; held lead triage; first paid lead preflight; controlled test drill; prospect activation packet; manual terms packet',
      next_owner_action: 'Approve verifying one Bituach Leumi specialist and exact lead-fee terms, or provide a consented controlled lead for a no-PII drill.',
      required_owner_inputs: 'selected specialist; fee; billing contact; client permission if a real lead is used',
      proof_needed_before_revenue_claim: 'accepted partner terms, owner release, invoice reference and private payment evidence',
      main_blocker: 'Requires live CRM/admin evidence and consented lead handling; higher privacy and routing risk than subscription.',
      live_action_allowed_now: 'NO',
      readiness_to_profit_percent: 78,
      live_revenue_impact_percent: 0,
    },
    {
      lane_id: 'LANE-03',
      lane: 'supplier_or_uk_cross_border_handoff_fee',
      recommendation_rank: 3,
      score_100: 63,
      why_this_rank: 'Commercially interesting but less ready because partner type, accepted terms, jurisdiction fit and first demand source are not as narrow as the subscription or BTL lanes.',
      existing_assets: 'UK WhatsApp supplier handoff packet; supplier/partner terms patterns; manual invoice proof rules',
      next_owner_action: 'Choose one supplier category and one real supplier candidate, then approve terms-only verification.',
      required_owner_inputs: 'supplier category; partner target; fee; jurisdiction scope; billing contact',
      proof_needed_before_revenue_claim: 'accepted supplier terms, owner release, invoice reference and private payment evidence',
      main_blocker: 'Too broad without a selected supplier category and partner.',
      live_action_allowed_now: 'NO',
      readiness_to_profit_percent: 63,
      live_revenue_impact_percent: 0,
    },
    {
      lane_id: 'LANE-04',
      lane: 'homepage_conversion_deployment',
      recommendation_rank: 4,
      score_100: 54,
      why_this_rank: 'Useful for future inbound conversion, but it does not create money until owner approves route QA, merge, uPress deployment and a measured conversion path.',
      existing_assets: 'homepage human-help implementation; static visual QA; owner deployment approval packet',
      next_owner_action: 'Approve real WordPress route QA only; do not merge or uPress until route QA passes.',
      required_owner_inputs: 'route QA approval; later merge/uPress approval',
      proof_needed_before_revenue_claim: 'live deployment plus conversion evidence',
      main_blocker: 'Owner has not approved live/staging route QA or deployment.',
      live_action_allowed_now: 'NO',
      readiness_to_profit_percent: 54,
      live_revenue_impact_percent: 0,
    },
  ];
}

function ownerDecisionRows() {
  return [
    {
      row_id: 'OWNER-FR-01',
      decision_needed: 'Select exactly one first-revenue lane for the next live-approved action.',
      recommended_answer: 'lawyer_subscription_manual_invoice',
      allowed_answers: 'lawyer_subscription_manual_invoice | btl_qualified_appeal_lead_fee | supplier_or_uk_cross_border_handoff_fee | wait',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-FR-02',
      decision_needed: 'Approve whether Codex may prepare a live/admin action checklist for the selected lane, still without sending/contacting/publishing.',
      recommended_answer: 'yes_prepare_checklist_only',
      allowed_answers: 'yes_prepare_checklist_only | no | wait',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-FR-03',
      decision_needed: 'If the lane is lawyer subscription, name the target or allow a generic one-target outreach draft only.',
      recommended_answer: 'generic_draft_only_until_target_named',
      allowed_answers: 'target_named | generic_draft_only | wait',
      owner_answer: '',
      owner_note: '',
    },
  ];
}

function buildMarkdown({ summary, lanes, ownerRows }) {
  return [
    `# First revenue lane scorecard - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project Manager Check',
    '',
    'Active goal: stop spreading effort across every idea and choose one lane that can plausibly create first revenue fastest.',
    `Readiness to profit: recommended lane ${summary.recommendedLaneReadinessPercent}% operational readiness, ${summary.liveRevenueImpactPercent}% live revenue impact.`,
    `Honesty: ${summary.honestyStatement}`,
    '',
    '## Recommendation',
    '',
    `Recommended first lane: \`${summary.recommendedLane}\`.`,
    '',
    'Reason: this lane can ask a lawyer to pay by manual invoice without requiring a live client handoff, client PII release, or Grow/Meshulam approval first. It still needs owner approval before any outreach or CRM action.',
    '',
    '## Lane Scorecard',
    '',
    '| Rank | Lane | Score | Why | Existing assets | Next owner action | Inputs needed | Proof before revenue | Blocker | Live action now |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...lanes.map((row) => `| ${row.recommendation_rank} | ${row.lane} | ${row.score_100} | ${mdCell(row.why_this_rank)} | ${mdCell(row.existing_assets)} | ${mdCell(row.next_owner_action)} | ${mdCell(row.required_owner_inputs)} | ${mdCell(row.proof_needed_before_revenue_claim)} | ${mdCell(row.main_blocker)} | ${row.live_action_allowed_now} |`),
    '',
    '## Owner Decision Rows',
    '',
    '| ID | Decision needed | Recommended | Allowed answers | Owner answer | Note |',
    '| --- | --- | --- | --- | --- | --- |',
    ...ownerRows.map((row) => `| ${row.row_id} | ${mdCell(row.decision_needed)} | ${row.recommended_answer} | ${mdCell(row.allowed_answers)} | ${row.owner_answer} | ${row.owner_note} |`),
    '',
    '## What This Does Not Do',
    '',
    '- Does not send outreach.',
    '- Does not create a CRM record.',
    '- Does not create an invoice or payment request.',
    '- Does not mark anything paid.',
    '- Does not publish or deploy anything.',
  ].join('\n');
}

function buildHtml({ summary, lanes, ownerRows }) {
  const laneRowsHtml = lanes.map((row) => `
    <tr>
      <td>${row.recommendation_rank}</td>
      <td><code>${htmlEscape(row.lane)}</code></td>
      <td>${row.score_100}</td>
      <td>${htmlEscape(row.why_this_rank)}</td>
      <td>${htmlEscape(row.next_owner_action)}</td>
      <td>${htmlEscape(row.main_blocker)}</td>
    </tr>`).join('');
  const ownerRowsHtml = ownerRows.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.row_id)}</code></td>
      <td>${htmlEscape(row.decision_needed)}</td>
      <td><code>${htmlEscape(row.recommended_answer)}</code></td>
      <td>${htmlEscape(row.allowed_answers)}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>First revenue lane scorecard</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f7f8fa; color: #172033; line-height: 1.55; }
    main { max-width: 1160px; margin: 0 auto; padding: 32px 18px 56px; }
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
  <h1>First revenue lane scorecard</h1>
  <p>${htmlEscape(summary.reportDate)}</p>
  <section class="status">
    <p><strong>Status:</strong> <code>${htmlEscape(summary.status)}</code></p>
    <p><strong>Recommended lane:</strong> <code>${htmlEscape(summary.recommendedLane)}</code></p>
    <p><strong>Readiness:</strong> ${summary.recommendedLaneReadinessPercent}% recommended-lane readiness, ${summary.liveRevenueImpactPercent}% live impact.</p>
    <p><strong>Honesty:</strong> ${htmlEscape(summary.honestyStatement)}</p>
  </section>
  <h2>Lane scorecard</h2>
  <table>
    <thead><tr><th>Rank</th><th>Lane</th><th>Score</th><th>Why</th><th>Next owner action</th><th>Blocker</th></tr></thead>
    <tbody>${laneRowsHtml}</tbody>
  </table>
  <h2>Owner decisions</h2>
  <table>
    <thead><tr><th>ID</th><th>Decision</th><th>Recommended</th><th>Allowed answers</th></tr></thead>
    <tbody>${ownerRowsHtml}</tbody>
  </table>
</main>
</body>
</html>
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-first-revenue-lane-scorecard.mjs --reportDate=YYYY-MM-DD');
    return;
  }

  const files = outputFiles(args.reportDate);
  const lanes = laneRows();
  const ownerRows = ownerDecisionRows();
  const recommended = lanes.find((lane) => lane.recommendation_rank === 1);
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    laneRows: lanes.length,
    ownerDecisionRows: ownerRows.length,
    recommendedLane: recommended.lane,
    recommendedLaneReadinessPercent: recommended.readiness_to_profit_percent,
    publicCmsChangesApproved: 0,
    liveCrmOrOutreachApproved: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    paidLlmApiUsed: 0,
    upressDeploymentRequired: false,
    liveRevenueImpactPercent: 0,
    honestyStatement: 'This scorecard chooses a recommended first-revenue lane, but it does not authorize outreach, CRM edits, invoices, payments, publication or deployment.',
    generated: {
      projectMd: relativePath(files.projectMd),
      projectHtml: relativePath(files.projectHtml),
      projectCsv: relativePath(files.projectCsv),
      ownerReplyCsv: relativePath(files.ownerReplyCsv),
      reportJson: relativePath(files.reportJson),
      reportCsv: relativePath(files.reportCsv),
    },
  };

  writeText(files.projectMd, buildMarkdown({ summary, lanes, ownerRows }));
  writeText(files.projectHtml, buildHtml({ summary, lanes, ownerRows }));
  writeText(files.projectCsv, toCsv(lanes, ['lane_id', 'lane', 'recommendation_rank', 'score_100', 'why_this_rank', 'existing_assets', 'next_owner_action', 'required_owner_inputs', 'proof_needed_before_revenue_claim', 'main_blocker', 'live_action_allowed_now', 'readiness_to_profit_percent', 'live_revenue_impact_percent']));
  writeText(files.ownerReplyCsv, toCsv(ownerRows, ['row_id', 'decision_needed', 'recommended_answer', 'allowed_answers', 'owner_answer', 'owner_note']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, lanes, ownerRows }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary).filter((key) => key !== 'generated')));

  console.log(JSON.stringify(summary, null, 2));
}

main();
