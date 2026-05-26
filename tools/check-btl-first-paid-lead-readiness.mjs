import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const requiredSourceColumns = [
  'candidate',
  'source_url',
  'source_type',
  'apparent_focus',
  'source_evidence_summary',
  'priority',
  'crm_action',
  'verification_status',
  'missing_before_routing',
];

const codeFiles = {
  crm: path.join(ROOT, 'inc', 'lead-crm.php'),
  prospects: path.join(ROOT, 'inc', 'lawyer-prospects.php'),
  routing: path.join(ROOT, 'inc', 'lead-routing.php'),
};

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
  };

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
  const base = `btl-first-paid-lead-readiness-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
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

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function readText(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        index++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        index++;
      }
      row.push(field);
      if (row.some((cell) => cell.trim() !== '')) {
        rows.push(row);
      }
      row = [];
      field = '';
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((cell) => cell.trim() !== '')) {
    rows.push(row);
  }

  if (rows.length < 1) {
    return [];
  }

  const headers = rows.shift().map((header) => header.trim());
  return rows
    .filter((item) => item.length === headers.length)
    .map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index] || ''])));
}

function includesAll(text, needles) {
  return needles.every((needle) => text.includes(needle));
}

function makeGate(id, gate, status, evidence, nextAction, ownerNotice = '') {
  return {
    id,
    gate,
    status,
    evidence,
    next_action: nextAction,
    owner_notice: ownerNotice,
  };
}

function buildRows() {
  const crm = readText(codeFiles.crm);
  const prospects = readText(codeFiles.prospects);
  const routing = readText(codeFiles.routing);
  const sourcePackCsv = path.join(ROOT, '.project-control', 'btl-specialist-prospect-shortlist-2026-05-26.csv');
  const sourcePackMd = path.join(ROOT, '.project-control', 'btl-specialist-prospect-shortlist-2026-05-26.md');
  const routeIntent = path.join(ROOT, '.project-control', 'bituach-leumi-route-intent-review-2026-05-26.md');
  const sourceRows = parseCsv(readText(sourcePackCsv));
  const columns = sourceRows.length ? Object.keys(sourceRows[0]) : [];
  const highPriorityRows = sourceRows.filter((row) => String(row.priority || '').toLowerCase() === 'high');
  const rows = [];

  rows.push(
    makeGate(
      'BTL-01',
      'private_source_pack_loaded',
      existsSync(sourcePackCsv) && sourceRows.length >= 3 && requiredSourceColumns.every((column) => columns.includes(column)) ? 'PASS' : 'BLOCKED',
      `${sourceRows.length} candidate rows; ${highPriorityRows.length} high-priority rows; columns=${columns.join('|')}`,
      'Create the first 3-6 private prospects from `.project-control/btl-specialist-prospect-shortlist-2026-05-26.csv`.',
      'No candidate is a recommendation or public listing until manually verified.'
    )
  );

  rows.push(
    makeGate(
      'BTL-02',
      'crm_supply_panel_available',
      includesAll(crm, [
        'justice_theme_crm_render_btl_supply_panel',
        'justice_theme_crm_render_btl_next_source_actions',
        'justice_theme_crm_render_btl_source_pack_candidates',
        'justice_theme_crm_render_btl_outreach_pack',
      ])
        ? 'PASS'
        : 'BLOCKED',
      'Justice CRM has source-pack conversion, candidate table and outreach packet functions.',
      'Use wp-admin -> Justice CRM -> Bituach Leumi specialist supply to create private prospects.',
      'This screen is owner-only and does not send outreach automatically.'
    )
  );

  rows.push(
    makeGate(
      'BTL-03',
      'prospect_verification_fields_available',
      includesAll(prospects, [
        'prospect_license_verified',
        'prospect_specialty_verified',
        'prospect_payment_path_ready',
        'prospect_agreed_lead_fee_ils',
        'prospect_billing_contact_email',
        'prospect_lead_fee_terms_ready',
        'justice_theme_lawyer_prospect_verification_missing',
      ])
        ? 'PASS'
        : 'BLOCKED',
      'Private prospect records include license, specialty, response, payment path, lead fee, terms and billing-contact gates.',
      'Do not mark a prospect ready until all verification-missing checks return empty.',
      'This is the main protection against routing leads to unverified lawyers.'
    )
  );

  rows.push(
    makeGate(
      'BTL-04',
      'manual_outreach_and_activation_packet_available',
      includesAll(prospects, [
        'justice_theme_lawyer_prospect_outreach_message',
        'Jus-Tice specialist acceptance note',
        'Jus-Tice routable specialist activation packet',
        'Open email draft',
        'Open WhatsApp draft',
      ])
        ? 'PASS'
        : 'BLOCKED',
      'Prospect edit screen has manual-send outreach, terms acceptance and routable activation copy.',
      'Use these packets manually; record terms before setting prospect status to won/onboarding.',
      'Nothing is sent automatically from the prospect screen.'
    )
  );

  rows.push(
    makeGate(
      'BTL-05',
      'routing_consent_and_hold_guard_available',
      includesAll(routing, [
        "get_post_meta( $post_id, 'routing_hold'",
        'external_sources',
        'explicit_match_consent',
        'owner_verified_consent',
        'Routing blocked: external WhatsApp/TalkTo/manual lead lacks explicit match consent',
      ])
        ? 'PASS'
        : 'BLOCKED',
      'Lead router blocks held/manual external leads unless explicit or owner-verified match consent exists.',
      'Keep WhatsApp/TalkTo/legacy leads on hold until consent evidence is recorded.',
      'Pressing a WhatsApp button is not enough for lawyer/supplier PII handoff.'
    )
  );

  rows.push(
    makeGate(
      'BTL-06',
      'btl_revenue_hint_and_billing_queue_available',
      includesAll(routing, [
        'justice_theme_prime_lead_revenue_hint_on_save',
        'qualified_appeal_lead',
        'suggested_lead_price_ils',
        'qualified_lead_billing_status',
        'ready_to_bill',
      ]) && includesAll(crm, ['justice_theme_crm_render_qualified_lead_billing_queue', 'qualified_lead_payment_evidence_url'])
        ? 'PASS'
        : 'BLOCKED',
      'National-insurance leads can be tagged as qualified appeal leads and moved to manual billing after routing.',
      'After one controlled routed lead, save invoice/reference before marking invoice sent or paid.',
      'Revenue remains unproven until a real invoice/payment evidence record exists.'
    )
  );

  rows.push(
    makeGate(
      'BTL-07',
      'controlled_test_drill_available',
      includesAll(crm, [
        'justice_theme_crm_render_btl_first_test_preflight',
        'justice_theme_crm_render_btl_controlled_test_drill',
        'justice_theme_crm_btl_controlled_test_drill_copy',
        'btl_first_billable_test',
      ])
        ? 'PASS'
        : 'BLOCKED',
      'Justice CRM has a first paid-lead preflight and controlled-test drill.',
      'Run the controlled test only after 3 verified prospects and 3 active routable specialists exist.',
      'This report cannot prove live database counts; check the admin panel before testing.'
    )
  );

  rows.push(
    makeGate(
      'BTL-08',
      'anti_cannibalization_boundary_documented',
      existsSync(routeIntent) && includesAll(readText(routeIntent), ['/national-insurance-attorney/', '/bituach-leumi-appeal-guide/', 'READY_FOR_OWNER_SEO_REVIEW_NOT_UPLOAD'])
        ? 'PASS'
        : 'BLOCKED',
      'Bituach Leumi attorney route and appeal-guide route have a private intent split packet.',
      'Do not edit public title/H1/body/canonical/redirect/noindex/sitemap/taxonomy until owner/SEO/GSC approval.',
      'Public pages must explain legal help to the reader, never Jus-Tice revenue logic.'
    )
  );

  rows.push(
    makeGate(
      'BTL-09',
      'private_path_references_clean',
      existsSync(sourcePackMd) && readText(sourcePackMd).includes('`.project-control/btl-specialist-prospect-shortlist-2026-05-26.csv`') && crm.includes(".project-control/btl-specialist-prospect-shortlist-2026-05-26.md")
        ? 'PASS'
        : 'REVIEW',
      'Source-pack references should point future agents to dot-private `.project-control` artifacts.',
      'Fix any remaining non-dot private report references before telling a remote operator where to work.',
      'Private docs should not suggest public theme-root artifact paths.'
    )
  );

  rows.push(
    makeGate(
      'BTL-10',
      'runtime_revenue_proof',
      'RUNTIME_BLOCKED',
      'Repo can verify infrastructure, but cannot prove live WP DB has 3 verified prospects, 3 routable paid lawyers, one consented lead, or payment proof.',
      'Owner/admin must create or verify private prospects, activate routable lawyer profiles, run one consented controlled lead, then record invoice/payment proof.',
      'Do not claim first paid Bituach Leumi revenue until the CRM has actual payment evidence.'
    )
  );

  return { rows, sourceRows };
}

function markdownReport(reportDate, summary, rows) {
  return [
    `# Bituach Leumi First Paid-Lead Readiness - ${reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: repo-local readiness check for the Bituach Leumi specialist-to-first-paid-lead loop. This does not publish CMS content, create leads, create lawyer/prospect records, contact anyone, change routing, send email/WhatsApp, invoice, charge payment, change SEO controls or deploy uPress.',
    '',
    '## Summary',
    '',
    `- Static gates passing: ${summary.passCount}/${summary.staticGateCount}`,
    `- Runtime blockers preserved: ${summary.runtimeBlockers}`,
    `- Source-pack candidates: ${summary.sourcePackCandidates}`,
    `- High-priority candidates: ${summary.highPriorityCandidates}`,
    `- Public changes approved by this report: 0`,
    '',
    '## Gate Results',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.id} | ${row.gate} | ${row.status} | ${row.evidence.replace(/\|/g, '/')} | ${row.next_action.replace(/\|/g, '/')} |`),
    '',
    '## Owner Run Order',
    '',
    '1. Open `wp-admin -> Justice CRM -> Bituach Leumi specialist supply`.',
    '2. Create the first 3-6 private prospects from `.project-control/btl-specialist-prospect-shortlist-2026-05-26.csv`.',
    '3. For each prospect, verify license/status, Bituach Leumi appeal experience, same-day response, manual payment path, per-lead fee and billing contact.',
    '4. Convert only verified prospects into routable lawyer profiles with owner approval.',
    '5. Run one controlled consented Bituach Leumi lead only after the preflight is green.',
    '6. Record invoice/payment evidence before marking revenue as paid.',
    '',
    '## Safety Statement',
    '',
    'This report verifies infrastructure and preserves blockers. It is not approval to publish or edit Bituach Leumi public pages, change title/H1/meta, create redirects/canonicals/noindex/sitemap/taxonomy entries, route real leads, contact lawyers/suppliers, or claim payment revenue.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/check-btl-first-paid-lead-readiness.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const { rows, sourceRows } = buildRows();
const passCount = rows.filter((row) => row.status === 'PASS').length;
const runtimeBlockers = rows.filter((row) => row.status === 'RUNTIME_BLOCKED').length;
const staticGateCount = rows.filter((row) => row.status !== 'RUNTIME_BLOCKED').length;
const reviewCount = rows.filter((row) => row.status === 'REVIEW').length;
const blockedCount = rows.filter((row) => row.status === 'BLOCKED').length;
const summary = {
  reportDate: args.reportDate,
  status: blockedCount > 0 ? 'BLOCKED_STATIC_GATES' : reviewCount > 0 ? 'PASS_WITH_REVIEW_ITEMS' : 'PASS_WITH_RUNTIME_BLOCKERS',
  passCount,
  staticGateCount,
  reviewCount,
  blockedCount,
  runtimeBlockers,
  sourcePackCandidates: sourceRows.length,
  highPriorityCandidates: sourceRows.filter((row) => String(row.priority || '').toLowerCase() === 'high').length,
};
const files = outputFiles(args.reportDate);
const columns = ['id', 'gate', 'status', 'evidence', 'next_action', 'owner_notice'];
const csv = toCsv(rows, columns);

writeText(files.projectMd, markdownReport(args.reportDate, summary, rows));
writeText(files.projectCsv, csv);
writeText(files.reportJson, `${JSON.stringify({ summary, rows, files }, null, 2)}\n`);
writeText(files.reportCsv, csv);

console.log(JSON.stringify(summary, null, 2));
