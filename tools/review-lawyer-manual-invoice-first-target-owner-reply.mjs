import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const EXPECTED_ROWS = [
  {
    row_id: 'OWNER-LMI-01',
    decision_needed: 'Approve lawyer subscription manual invoice as the next lane.',
    allowed_answers: ['yes', 'no', 'wait'],
    pass_answers: ['yes'],
    blocked_reason: 'Owner has not approved the lawyer manual-invoice lane.',
    next_step: 'Owner answers yes, no or wait.',
  },
  {
    row_id: 'OWNER-LMI-02',
    decision_needed: 'Choose target mode.',
    allowed_answers: ['target_named', 'generic_draft_only', 'wait'],
    pass_answers: ['target_named', 'generic_draft_only'],
    blocked_reason: 'Owner has not selected target_named or generic_draft_only.',
    next_step: 'Owner selects exactly one target mode. Keep raw contact details out of repo files.',
  },
  {
    row_id: 'OWNER-LMI-03',
    decision_needed: 'Approve first-offer plan and price.',
    allowed_answers: ['pro_349', 'featured_749', 'lead_partner_1490', 'other', 'wait'],
    pass_answers: ['pro_349'],
    blocked_reason: 'Owner has not approved the recommended Pro 349 ILS monthly first offer.',
    next_step: 'Owner approves pro_349, or overrides with a written reason before any live action.',
  },
  {
    row_id: 'OWNER-LMI-04',
    decision_needed: 'Approve or edit Hebrew message draft.',
    allowed_answers: ['approve', 'edit_first', 'no', 'wait'],
    pass_answers: ['approve'],
    blocked_reason: 'Owner has not approved the exact Hebrew message.',
    next_step: 'Owner approves the draft or asks for edits. No send is allowed from this review.',
  },
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    filledCsv: '',
  };
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--filledCsv=')) {
      args.filledCsv = arg.slice('--filledCsv='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }
  if (!args.filledCsv) {
    args.filledCsv = path.join(
      ROOT,
      '.project-control',
      `lawyer-manual-invoice-first-target-checklist-${args.reportDate}-owner-reply.csv`,
    );
  }
  args.filledCsv = path.resolve(ROOT, args.filledCsv);
  return args;
}

function outputFiles(reportDate) {
  const base = `lawyer-manual-invoice-first-target-owner-reply-review-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    escalationCsv: path.join(ROOT, '.project-control', `${base}-escalation.csv`),
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

function parseCsv(text) {
  const rows = [];
  let current = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      current.push(field);
      field = '';
    } else if (char === '\n') {
      current.push(field.replace(/\r$/, ''));
      rows.push(current);
      current = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field.length || current.length) {
    current.push(field.replace(/\r$/, ''));
    rows.push(current);
  }
  if (!rows.length) {
    return [];
  }
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).filter((row) => row.some((fieldValue) => fieldValue.trim() !== '')).map((row) => {
    const object = {};
    headers.forEach((header, index) => {
      object[header] = row[index] ?? '';
    });
    return object;
  });
}

function hasPrivatePattern(value) {
  const text = String(value ?? '');
  const patterns = [
    /https?:\/\//i,
    /www\./i,
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
    /(?:\+972|0)(?:[\s-]?\d){8,10}/,
    /\b(?:sk-|ghp_|xoxb-|AIza|AKIA)[A-Za-z0-9_-]{8,}/,
  ];
  return patterns.some((pattern) => pattern.test(text));
}

function reviewRows(filledRows) {
  const byId = new Map();
  const duplicateIds = new Set();
  for (const row of filledRows) {
    const rowId = String(row.row_id ?? '').trim();
    if (!rowId) {
      continue;
    }
    if (byId.has(rowId)) {
      duplicateIds.add(rowId);
    }
    byId.set(rowId, row);
  }

  const reviews = EXPECTED_ROWS.map((expected) => {
    const row = byId.get(expected.row_id) || {};
    const ownerAnswer = String(row.owner_answer ?? '').trim();
    const ownerNote = String(row.owner_note ?? '').trim();
    const allowed = expected.allowed_answers.includes(ownerAnswer);
    const pass = allowed && expected.pass_answers.includes(ownerAnswer);
    const privatePatternFound = hasPrivatePattern(ownerNote);

    let status = 'BLOCKED';
    let reason = expected.blocked_reason;
    if (!ownerAnswer) {
      reason = 'Owner answer is blank.';
    } else if (!allowed) {
      reason = `Owner answer "${ownerAnswer}" is not allowed for this row.`;
    } else if (privatePatternFound) {
      reason = 'Owner note appears to contain a URL, email, phone number or token. Keep raw contact details outside repo artifacts.';
    } else if (pass) {
      status = 'PASS';
      reason = 'Owner answer satisfies this gate.';
    } else if (ownerAnswer === 'edit_first') {
      reason = 'Owner requested message edits before approval.';
    } else if (ownerAnswer === 'other' || ownerAnswer === 'featured_749' || ownerAnswer === 'lead_partner_1490') {
      reason = 'Owner selected a non-recommended commercial option; require explicit written reason and a new checklist before live action.';
    }

    return {
      row_id: expected.row_id,
      decision_needed: expected.decision_needed,
      owner_answer: ownerAnswer,
      owner_note_present: ownerNote ? 'yes' : 'no',
      status,
      reason,
      private_pattern_found: privatePatternFound ? 'yes' : 'no',
      next_step: status === 'PASS' ? 'Keep this answer; continue checking the remaining gates.' : expected.next_step,
      live_action_allowed: 'NO',
    };
  });

  const expectedIds = new Set(EXPECTED_ROWS.map((row) => row.row_id));
  const unknownRows = filledRows
    .map((row) => String(row.row_id ?? '').trim())
    .filter((rowId) => rowId && !expectedIds.has(rowId));

  return { reviews, duplicateIds: [...duplicateIds], unknownRows };
}

function escalationRows(reviews, duplicateIds, unknownRows, filledCsv) {
  const rows = [];
  for (const review of reviews) {
    if (review.status !== 'PASS') {
      rows.push({
        issue_id: `${review.row_id}-BLOCKED`,
        severity: 'BLOCKER',
        source: relativePath(filledCsv),
        issue: review.reason,
        next_step: review.next_step,
        live_action_allowed: 'NO',
      });
    }
    if (review.private_pattern_found === 'yes') {
      rows.push({
        issue_id: `${review.row_id}-PRIVATE-PATTERN`,
        severity: 'BLOCKER',
        source: relativePath(filledCsv),
        issue: 'Possible private URL/email/phone/token pattern in owner_note.',
        next_step: 'Move raw contact details to private admin only and keep this CSV to sanitized pointers.',
        live_action_allowed: 'NO',
      });
    }
  }
  for (const duplicateId of duplicateIds) {
    rows.push({
      issue_id: `${duplicateId}-DUPLICATE`,
      severity: 'BLOCKER',
      source: relativePath(filledCsv),
      issue: 'Duplicate owner decision row.',
      next_step: 'Keep exactly one row per owner decision id.',
      live_action_allowed: 'NO',
    });
  }
  for (const unknownRow of unknownRows) {
    rows.push({
      issue_id: `${unknownRow}-UNKNOWN`,
      severity: 'REVIEW',
      source: relativePath(filledCsv),
      issue: 'Unknown row id ignored by the reviewer.',
      next_step: 'Remove or map this row to an expected owner decision id.',
      live_action_allowed: 'NO',
    });
  }
  return rows;
}

function summarize({ reviews, duplicateIds, unknownRows, escalations, reportDate, filledCsv }) {
  const passRows = reviews.filter((row) => row.status === 'PASS').length;
  const blockedRows = reviews.length - passRows;
  const privacyFlagRows = reviews.filter((row) => row.private_pattern_found === 'yes').length;
  const answers = Object.fromEntries(reviews.map((row) => [row.row_id, row.owner_answer]));
  const allRequiredPass = blockedRows === 0 && duplicateIds.length === 0 && privacyFlagRows === 0;
  const targetMode = answers['OWNER-LMI-02'] || '';
  const genericDraftOnly = allRequiredPass && targetMode === 'generic_draft_only';
  const targetNamed = allRequiredPass && targetMode === 'target_named';

  let status = 'LAWYER_MANUAL_INVOICE_OWNER_REPLY_REVIEW_BLOCKED_NO_LIVE_ACTION';
  let readinessToProfitPercent = 88;
  if (genericDraftOnly) {
    status = 'LAWYER_MANUAL_INVOICE_OWNER_REPLY_READY_GENERIC_DRAFT_ONLY_NO_LIVE_ACTION';
    readinessToProfitPercent = 90;
  } else if (targetNamed) {
    status = 'LAWYER_MANUAL_INVOICE_OWNER_REPLY_READY_PRIVATE_TARGET_PREP_NO_SEND';
    readinessToProfitPercent = 92;
  }

  return {
    status,
    reportDate,
    filledCsv: relativePath(filledCsv),
    requiredRows: reviews.length,
    passRows,
    blockedRows,
    duplicateRows: duplicateIds.length,
    unknownRows: unknownRows.length,
    escalationRows: escalations.length,
    privacyFlagRows,
    readyForGenericDraftOnly: genericDraftOnly,
    readyForPrivateTargetPrep: targetNamed,
    liveContactAllowed: false,
    liveCrmOrOutreachApproved: 0,
    invoicesOrPaymentsCreated: 0,
    revenueClaimsApproved: 0,
    publicCmsChangesApproved: 0,
    paidLlmApiUsed: 0,
    upressDeploymentRequired: false,
    readinessToProfitPercent,
    liveRevenueImpactPercent: 0,
    honestyStatement: 'This reviewer can clear an internal owner-decision gate, but it never sends outreach, creates CRM records, invoices, requests payment, marks paid, publishes or deploys.',
  };
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function buildMarkdown(summary, reviews, escalations) {
  return [
    `# Lawyer manual invoice owner reply review - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    '## Project Manager Check',
    '',
    'Active goal: first paid lawyer subscription through manual invoice.',
    `Readiness to profit: ${summary.readinessToProfitPercent}% internal readiness, ${summary.liveRevenueImpactPercent}% live revenue impact.`,
    `Honesty: ${summary.honestyStatement}`,
    '',
    '## Review Rows',
    '',
    '| Row | Answer | Status | Reason | Next step | Live action allowed |',
    '| --- | --- | --- | --- | --- | --- |',
    ...reviews.map((row) => `| ${row.row_id} | ${mdCell(row.owner_answer)} | ${row.status} | ${mdCell(row.reason)} | ${mdCell(row.next_step)} | ${row.live_action_allowed} |`),
    '',
    '## Escalations',
    '',
    escalations.length
      ? [
          '| Issue | Severity | Issue | Next step |',
          '| --- | --- | --- | --- |',
          ...escalations.map((row) => `| ${row.issue_id} | ${row.severity} | ${mdCell(row.issue)} | ${mdCell(row.next_step)} |`),
        ].join('\n')
      : 'No escalation rows. The output still does not authorize sending, invoicing or publishing.',
    '',
    '## Safety Boundary',
    '',
    '- No lawyer contact is allowed by this review.',
    '- No CRM/admin write is allowed by this review.',
    '- No invoice or payment request is allowed by this review.',
    '- No paid/revenue claim is allowed by this review.',
    '- No public CMS or uPress action is allowed by this review.',
  ].join('\n');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node tools/review-lawyer-manual-invoice-first-target-owner-reply.mjs --reportDate=YYYY-MM-DD [--filledCsv=path]');
    return;
  }
  if (!existsSync(args.filledCsv)) {
    throw new Error(`Owner reply CSV not found: ${args.filledCsv}`);
  }

  const filledRows = parseCsv(readFileSync(args.filledCsv, 'utf8'));
  const files = outputFiles(args.reportDate);
  const { reviews, duplicateIds, unknownRows } = reviewRows(filledRows);
  const escalations = escalationRows(reviews, duplicateIds, unknownRows, args.filledCsv);
  const summary = summarize({ reviews, duplicateIds, unknownRows, escalations, reportDate: args.reportDate, filledCsv: args.filledCsv });
  summary.generated = {
    projectMd: relativePath(files.projectMd),
    projectCsv: relativePath(files.projectCsv),
    escalationCsv: relativePath(files.escalationCsv),
    reportJson: relativePath(files.reportJson),
    reportCsv: relativePath(files.reportCsv),
  };

  writeText(files.projectMd, buildMarkdown(summary, reviews, escalations));
  writeText(files.projectCsv, toCsv(reviews, ['row_id', 'decision_needed', 'owner_answer', 'owner_note_present', 'status', 'reason', 'private_pattern_found', 'next_step', 'live_action_allowed']));
  writeText(files.escalationCsv, toCsv(escalations, ['issue_id', 'severity', 'source', 'issue', 'next_step', 'live_action_allowed']));
  writeText(files.reportJson, `${JSON.stringify({ ...summary, reviews, escalations }, null, 2)}\n`);
  writeText(files.reportCsv, toCsv([summary], Object.keys(summary).filter((key) => key !== 'generated')));

  console.log(JSON.stringify(summary, null, 2));
}

main();
