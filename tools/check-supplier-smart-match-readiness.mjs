import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

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

function usage() {
  return `Check supplier smart-match and safe-bid readiness infrastructure.

Usage:
  node tools/check-supplier-smart-match-readiness.mjs --reportDate=YYYY-MM-DD
`;
}

function outputFiles(reportDate) {
  const base = `supplier-smart-match-readiness-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
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

function main() {
  const args = parseArgs();
  if (args.help) {
    process.stdout.write(usage());
    return;
  }

  const suppliersPath = path.join(ROOT, 'inc', 'lawyer-suppliers.php');
  const crmPath = path.join(ROOT, 'inc', 'lead-crm.php');
  const publicProvidersPath = path.join(ROOT, 'template-parts', 'sections', 'legal-service-providers.php');
  const markerPath = path.join(ROOT, 'deployment-marker.txt');

  const suppliers = readFileSync(suppliersPath, 'utf8');
  const crm = readFileSync(crmPath, 'utf8');
  const publicProviders = readFileSync(publicProvidersPath, 'utf8');
  const marker = readFileSync(markerPath, 'utf8');

  const rows = [
    {
      check: 'category_intent_mapping',
      status: suppliers.includes('justice_theme_lawyer_supplier_requested_categories') && suppliers.includes('portuguese') && suppliers.includes('aliyah') ? 'PASS' : 'FAIL',
      evidence: 'Supplier lead-context mapping includes immigration/citizenship/cross-border signals.',
      next_step: 'Use this for owner-reviewed matching; extend only after real supplier quote data appears.',
    },
    {
      check: 'readiness_score',
      status: suppliers.includes('justice_theme_lawyer_supplier_match_readiness') && suppliers.includes("'quote_ready'") && suppliers.includes("'near_ready'") ? 'PASS' : 'FAIL',
      evidence: 'Supplier records are scored with labels before quotes are requested.',
      next_step: 'Resolve blockers before sending any supplier first-contact request.',
    },
    {
      check: 'safe_bid_packet',
      status: suppliers.includes('justice_theme_lawyer_supplier_safe_bid_packet') && suppliers.includes('do not send client personal details') ? 'PASS' : 'FAIL',
      evidence: 'An internal quote packet explicitly blocks first-contact PII sharing.',
      next_step: 'Only use after client consent and with anonymized facts until supplier terms are accepted.',
    },
    {
      check: 'admin_supplier_column',
      status: suppliers.includes("supplier_match") && suppliers.includes('Smart match') ? 'PASS' : 'FAIL',
      evidence: 'wp-admin Suppliers list exposes the readiness score to the owner/admin.',
      next_step: 'After deployment, open wp-admin Suppliers and review score/blocker text.',
    },
    {
      check: 'crm_supplier_column',
      status: crm.includes('<th>Smart match</th>') && crm.includes('Safe bid packet') ? 'PASS' : 'FAIL',
      evidence: 'Justice CRM supplier table shows score and a copyable safe-bid packet.',
      next_step: 'Use the packet for immigration/citizenship suppliers only after consent and owner review.',
    },
    {
      check: 'public_surface_guard',
      status: !publicProviders.includes('match_readiness') && !publicProviders.includes('Safe bid packet') ? 'PASS' : 'FAIL',
      evidence: 'Public supplier cards do not expose internal scoring or bidding language.',
      next_step: 'Keep scoring, bids, commissions and business-plan language out of public user pages.',
    },
    {
      check: 'deployment_marker',
      status: marker.includes('supplier-smart-match-admin-v1') ? 'PASS' : 'FAIL',
      evidence: marker.trim().replace(/\n/g, ' | '),
      next_step: 'After uPress pull, verify the live marker matches supplier-smart-match-admin-v1.',
    },
  ];

  const status = rows.every((row) => row.status === 'PASS') ? 'PASS' : 'FAIL';
  const columns = ['check', 'status', 'evidence', 'next_step'];
  const files = outputFiles(args.reportDate);
  const markdownRows = rows
    .map((row) => `| ${row.check} | ${row.status} | ${row.evidence} | ${row.next_step} |`)
    .join('\n');
  const markdown = `# Supplier Smart-Match Readiness - ${args.reportDate}

Status: ${status}

Scope: repo-local/admin-only infrastructure for supplier registration, immigration/citizenship supplier matching, and controlled quote/bid readiness. This does not create supplier records, contact suppliers, contact clients, publish CMS pages, expose bids publicly, change URLs, redirects, canonicals, noindex, sitemaps, taxonomies, payments or public database rows.

## Results

| Check | Status | Evidence | Next Step |
| --- | --- | --- | --- |
${markdownRows}

## Owner Operating Rule

- Client data stays inside Jus-Tice until the client gives permission for handoff.
- The first supplier request should be anonymized and should ask only for price, scope, timeline, required documents, responsible licensed professional, and the commercial term for Jus-Tice.
- Public users should see legal help and service clarity, not bid mechanics, supplier commissions, or the investor revenue logic.
`;

  const payload = {
    report_date: args.reportDate,
    status,
    rows,
    safety: {
      public_cms_changed: false,
      public_supplier_records_created: false,
      outbound_messages_sent: false,
      client_pii_shared: false,
      urls_changed: false,
      redirects_changed: false,
      canonicals_changed: false,
      noindex_changed: false,
      sitemaps_changed: false,
      taxonomies_changed: false,
      payments_changed: false,
    },
  };

  writeText(files.projectMd, markdown);
  writeText(files.projectCsv, toCsv(rows, columns));
  writeText(files.reportJson, JSON.stringify(payload, null, 2));
  writeText(files.reportCsv, toCsv(rows, columns));

  process.stdout.write(`Status: ${status}\n`);
  process.stdout.write(`Wrote ${path.relative(ROOT, files.projectMd)}\n`);

  if (status !== 'PASS') {
    process.exitCode = 1;
  }
}

main();
