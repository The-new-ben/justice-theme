import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const STATUS = 'LAWYER_MANUAL_INVOICE_FIRST_TARGET_SHORTLIST_READY_OWNER_SELECTION_REQUIRED';

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceDate: process.env.SOURCE_DATE || DEFAULT_REPORT_DATE,
  };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--sourceDate=')) {
      args.sourceDate = arg.slice('--sourceDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  for (const [key, value] of Object.entries({ reportDate: args.reportDate, sourceDate: args.sourceDate })) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${key} must be YYYY-MM-DD`);
    }
  }
  return args;
}

function sourceFile(sourceDate) {
  return path.join(ROOT, '.reports', `btl-first-prospect-activation-packet-${sourceDate}.json`);
}

function outputFiles(reportDate) {
  const base = `lawyer-manual-invoice-first-target-shortlist-${reportDate}`;
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

function scoreRow(row) {
  let score = 50;
  if (row.queue === 'primary') score += 16;
  if (row.priority === 'high') score += 8;
  if (row.source_type === 'firm site') score += 8;
  if (/appeal|ערעור|ועדות|medical committee|labor-court|בית הדין/i.test(`${row.apparent_focus} ${row.source_evidence_summary}`)) score += 7;
  if (/25\+|since 2010|established/i.test(row.source_evidence_summary || '')) score += 3;
  if (/Lead Partner|Featured/i.test(row.crm_action || '')) score -= 4;
  return score;
}

function buyerAngle(row) {
  if (/firm site/i.test(row.source_type || '') && /בית הדין|labor-court/i.test(`${row.apparent_focus} ${row.source_evidence_summary}`)) {
    return 'Strong BTL positioning with broader court/appeal continuation; use Pro first to avoid overpromising lead volume.';
  }
  if (/25\+/.test(row.source_evidence_summary || '')) {
    return 'Established BTL signal; Pro can be framed as a measured profile test before higher exposure plans.';
  }
  if (/article/i.test(row.source_type || '')) {
    return 'Specific appeal-content signal; good for fit review, but not a first contact until license and commercial terms are verified.';
  }
  return 'Relevant BTL signal; use only after owner-approved private verification.';
}

function buildShortlist(activationRows) {
  return activationRows
    .filter((row) => ['primary', 'backup'].includes(row.queue))
    .map((row) => ({
      target_id: `BTL-LMI-${String(row.step).padStart(2, '0')}-${row.queue.toUpperCase()}`,
      queue: row.queue,
      source_rank: row.step,
      candidate: row.candidate,
      source_type: row.source_type,
      source_url: row.source_url,
      apparent_focus: row.apparent_focus,
      evidence_summary: row.source_evidence_summary,
      verification_status: row.verification_status,
      recommended_offer: 'Pro 349 ILS/month incl. VAT by manual invoice',
      shortlist_score: scoreRow(row),
      buyer_angle: buyerAngle(row),
      first_private_check: 'Verify license, active status, BTL fit, billing email and permission for a no-PII commercial conversation.',
      blocked_until_owner_approval: 'YES',
      live_action_allowed: 'NO',
    }))
    .sort((a, b) => b.shortlist_score - a.shortlist_score || a.source_rank - b.source_rank);
}

function ownerRows(shortlist) {
  return [
    {
      row_id: 'OWNER-TARGET-01',
      decision_needed: 'Choose exactly one first target id, or wait.',
      recommended_answer: shortlist[0]?.target_id || 'wait',
      allowed_answers: shortlist.map((row) => row.target_id).concat(['wait']).join(' | '),
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-TARGET-02',
      decision_needed: 'Approve target use mode.',
      recommended_answer: 'private_fit_review_only',
      allowed_answers: 'private_fit_review_only | generic_draft_only | wait',
      owner_answer: '',
      owner_note: '',
    },
    {
      row_id: 'OWNER-TARGET-03',
      decision_needed: 'Approve no-contact boundary until private fit review passes.',
      recommended_answer: 'yes',
      allowed_answers: 'yes | no | wait',
      owner_answer: '',
      owner_note: '',
    },
  ];
}

function buildMarkdown({ summary, shortlist, owners }) {
  return [
    `# Lawyer manual invoice first-target shortlist - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project Manager Check',
    '',
    'Active goal: select one owner-approved target for the first paid lawyer subscription test.',
    `Readiness to profit: ${summary.readinessToProfitPercent}% target-selection readiness, ${summary.liveRevenueImpactPercent}% live revenue impact.`,
    `Honesty: ${summary.honestyStatement}`,
    '',
    '## Recommendation',
    '',
    `Recommended first target for owner review: \`${summary.recommendedTargetId}\` at score ${summary.recommendedTargetScore}.`,
    '',
    'This is not approval to contact the target. It is a shortlist for owner selection and private verification only.',
    '',
    '## Shortlist',
    '',
    '| Target ID | Candidate | Queue | Score | Source type | Offer | Buyer angle | First private check | Live action |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...shortlist.map((row) => `| ${row.target_id} | ${mdCell(row.candidate)} | ${row.queue} | ${row.shortlist_score} | ${mdCell(row.source_type)} | ${mdCell(row.recommended_offer)} | ${mdCell(row.buyer_angle)} | ${mdCell(row.first_private_check)} | ${row.live_action_allowed} |`),
    '',
    '## Source URLs Already In Prior Packet',
    '',
    '| Target ID | Public source URL | Evidence summary |',
    '| --- | --- | --- |',
    ...shortlist.map((row) => `| ${row.target_id} | ${mdCell(row.source_url)} | ${mdCell(row.evidence_summary)} |`),
    '',
    '## Owner Reply Rows',
    '',
    '| ID | Decision needed | Recommended | Allowed answers | Owner answer | Note |',
    '| --- | --- | --- | --- | --- | --- |',
    ...owners.map((row) => `| ${row.row_id} | ${mdCell(row.decision_needed)} | ${mdCell(row.recommended_answer)} | ${mdCell(row.allowed_answers)} | ${row.owner_answer} | ${row.owner_note} |`),
    '',
    '## Boundaries',
    '',
    '- No target was contacted.',
    '- No CRM/admin record was created or edited.',
    '- No source was reverified in a browser during this cycle.',
    '- No phone/email/contact detail was added to this repo artifact.',
    '- No invoice, payment request, paid status, public profile or uPress action is approved by this packet.',
  ].join('\n');
}

function buildHtml({ summary, shortlist }) {
  const rows = shortlist.map((row) => `
    <tr>
      <td><code>${htmlEscape(row.target_id)}</code></td>
      <td>${htmlEscape(row.candidate)}</td>
      <td>${htmlEscape(row.queue)}</td>
      <td>${htmlEscape(row.shortlist_score)}</td>
      <td>${htmlEscape(row.source_type)}</td>
      <td>${htmlEscape(row.recommended_offer)}</td>
      <td>${htmlEscape(row.buyer_angle)}</td>
      <td><a href="${htmlEscape(row.source_url)}">${htmlEscape(row.source_url)}</a></td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>בחירת יעד ראשון לחשבונית ידנית</title>
  <style>
    body { margin: 0; font-family: Arial, sans-serif; background: #f6f7f8; color: #182033; line-height: 1.58; }
    main { max-width: 1180px; margin: 0 auto; padding: 32px 18px 56px; }
    h1 { margin: 0 0 10px; font-size: 30px; color: #07152f; }
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
  <h1>Shortlist ליעד ראשון במסלול Pro ידני</h1>
  <section class="status">
    <p><strong>Status:</strong> <code>${htmlEscape(summary.status)}</code></p>
    <p><strong>מומלץ לבדיקה:</strong> <code>${htmlEscape(summary.recommendedTargetId)}</code></p>
    <p><strong>כנות:</strong> ${htmlEscape(summary.honestyStatement)}</p>
  </section>
  <table>
    <thead><tr><th>ID</th><th>מועמד</th><th>תור</th><th>ציון</th><th>מקור</th><th>הצעה</th><th>זווית מכירה</th><th>URL ציבורי</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</main>
</body>
</html>
`;
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/build-lawyer-manual-invoice-first-target-shortlist.mjs --reportDate=YYYY-MM-DD [--sourceDate=YYYY-MM-DD]');
    return;
  }

  const sourcePath = sourceFile(args.sourceDate);
  if (!existsSync(sourcePath)) {
    throw new Error(`Source report not found: ${sourcePath}`);
  }
  const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const shortlist = buildShortlist(source.activationRows || []);
  const owners = ownerRows(shortlist);
  const files = outputFiles(args.reportDate);
  const summary = {
    status: STATUS,
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    sourceReport: relativePath(sourcePath),
    sourceStatus: source.summary?.status || '',
    shortlistRows: shortlist.length,
    ownerDecisionRows: owners.length,
    recommendedTargetId: shortlist[0]?.target_id || '',
    recommendedTargetScore: shortlist[0]?.shortlist_score || 0,
    recommendedPlan: 'pro',
    recommendedMonthlyIls: 349,
    publicCmsChangesApproved: 0,
    liveCrmOrOutreachApproved: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    paidLlmApiUsed: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent: 92,
    liveRevenueImpactPercent: 0,
    honestyStatement: 'This shortlist reuses the existing BTL prospect packet and was not live-browser reverified in this cycle. It selects candidates for owner review only; it does not contact anyone, create CRM records, invoice, request payment, mark paid, publish or deploy.',
    generated: {
      projectMd: relativePath(files.projectMd),
      projectHtml: relativePath(files.projectHtml),
      projectCsv: relativePath(files.projectCsv),
      ownerReplyCsv: relativePath(files.ownerReplyCsv),
      reportJson: relativePath(files.reportJson),
      reportCsv: relativePath(files.reportCsv),
    },
  };

  writeText(files.projectMd, buildMarkdown({ summary, shortlist, owners }));
  writeText(files.projectHtml, buildHtml({ summary, shortlist }));
  writeText(files.projectCsv, toCsv(shortlist, ['target_id', 'queue', 'source_rank', 'candidate', 'source_type', 'source_url', 'apparent_focus', 'evidence_summary', 'verification_status', 'recommended_offer', 'shortlist_score', 'buyer_angle', 'first_private_check', 'blocked_until_owner_approval', 'live_action_allowed']));
  writeText(files.ownerReplyCsv, toCsv(owners, ['row_id', 'decision_needed', 'recommended_answer', 'allowed_answers', 'owner_answer', 'owner_note']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, shortlist, owners }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary).filter((key) => key !== 'generated')));

  console.log(JSON.stringify(summary, null, 2));
}

main();
