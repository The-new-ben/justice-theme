import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourcePreflight: '',
    sourceGrow: '',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--sourcePreflight=')) {
      args.sourcePreflight = arg.slice('--sourcePreflight='.length);
    } else if (arg.startsWith('--sourceGrow=')) {
      args.sourceGrow = arg.slice('--sourceGrow='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  args.sourcePreflight = resolveSource(
    args.sourcePreflight,
    `lawyer-subscription-e2e-preflight-${args.reportDate}.json`,
    'lawyer-subscription-e2e-preflight-',
  );
  args.sourceGrow = resolveSource(
    args.sourceGrow,
    `grow-payment-compliance-live-${args.reportDate}.json`,
    'grow-payment-compliance-live-',
  );

  return args;
}

function resolveSource(sourcePath, preferredName, prefix) {
  if (sourcePath) {
    return path.isAbsolute(sourcePath) ? sourcePath : path.join(ROOT, sourcePath);
  }

  const preferredPath = path.join(ROOT, '.reports', preferredName);
  if (existsSync(preferredPath)) {
    return preferredPath;
  }

  const latest = readdirSync(path.join(ROOT, '.reports'), { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.startsWith(prefix) && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort()
    .at(-1);

  return latest ? path.join(ROOT, '.reports', latest) : preferredPath;
}

function outputFiles(reportDate) {
  const base = `manual-invoice-revenue-fallback-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    templateCsv: path.join(ROOT, '.project-control', `manual-invoice-revenue-fallback-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function readText(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), 'utf8');
}

function readOptionalJson(filePath) {
  if (!existsSync(filePath)) {
    return {
      exists: false,
      path: path.relative(ROOT, filePath).replace(/\\/g, '/'),
      summary: {},
    };
  }

  const json = JSON.parse(readFileSync(filePath, 'utf8'));
  return {
    exists: true,
    path: path.relative(ROOT, filePath).replace(/\\/g, '/'),
    summary: json.summary || json,
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

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function markerGate({ id, gate, file, markers, evidence, nextAction, ownerNotice }) {
  const source = readText(file);
  const missing = markers.filter((marker) => !source.includes(marker));

  return {
    id,
    gate,
    status: missing.length ? 'BLOCKED' : 'PASS',
    file,
    evidence: missing.length ? `${markers.length - missing.length}/${markers.length} markers found` : `${markers.length}/${markers.length} markers found`,
    missing_markers: missing.join(' | '),
    source_evidence: evidence,
    next_action: nextAction,
    owner_notice: ownerNotice,
    live_action_taken: 'no',
  };
}

function sourceReportDate(source) {
  return source.summary?.reportDate || source.summary?.runDate || '';
}

function sourceFreshnessGate(reportDate, preflight, grow) {
  const preflightDate = sourceReportDate(preflight);
  const growDate = sourceReportDate(grow);
  const missing = [];

  if (!preflight.exists || preflightDate !== reportDate) {
    missing.push(`subscription preflight source date is ${preflightDate || 'missing'}`);
  }
  if (!grow.exists || growDate !== reportDate) {
    missing.push(`Grow compliance source date is ${growDate || 'missing'}`);
  }

  return {
    id: 'MIF-09',
    gate: 'same_day_source_reports',
    status: missing.length ? 'REVIEW' : 'PASS',
    file: '.reports',
    evidence: missing.length ? missing.join(' | ') : `subscription preflight and Grow compliance sources both match ${reportDate}`,
    missing_markers: missing.join(' | '),
    source_evidence: 'Manual invoice/payment fallback packets must not quietly rely on stale payment-provider or subscription preflight reports.',
    next_action: missing.length
      ? 'Rerun the missing same-day source report before using this packet in an owner payment walkthrough.'
      : 'Use this packet as the current same-day private source chain for manual invoice/payment proof.',
    owner_notice: 'A same-day source chain is still not payment proof; it only keeps the owner runbook current.',
    live_action_taken: 'no',
  };
}

function buildGateRows() {
  return [
    markerGate({
      id: 'MIF-01',
      gate: 'manual_invoice_checkout_fallback',
      file: 'inc/payment-compliance-routes.php',
      markers: [
        'payment_path',
        'manual_invoice',
        'billing_first_name',
        'billing_last_name',
        'billing_phone',
        'billing_email',
        'id="terms"',
        '/sample-terms-and-conditions-template/',
        '/cancellation/',
        '/privacy/',
      ],
      evidence: 'Manual invoice checkout path exposes payer fields and legal approval links.',
      nextAction: 'Use as a no-charge fallback path while live provider checkout remains blocked.',
      ownerNotice: 'This confirms the fallback surface exists; it does not create a payment link or invoice.',
    }),
    markerGate({
      id: 'MIF-02',
      gate: 'onboarding_payment_queue',
      file: 'inc/lawyer-onboarding.php',
      markers: [
        'payment_followup_status',
        'manual_payment_link_url',
        'manual_invoice_reference',
        'justice_theme_send_lawyer_manual_payment_link_email',
        'justice_theme_lawyer_payment_queue_export_url',
      ],
      evidence: 'Lawyer onboarding stores payment follow-up status, manual link and invoice reference.',
      nextAction: 'Owner/admin can use the queue only for an approved controlled lawyer record.',
      ownerNotice: 'No email is sent and no lawyer record is edited by this packet.',
    }),
    markerGate({
      id: 'MIF-03',
      gate: 'lawyer_dashboard_payment_requests',
      file: 'page-lawyer-dashboard.php',
      markers: [
        'payment_link',
        'upgrade',
        'downgrade',
        'cancel',
        'refund',
        'invoice',
        'data-service-request-preset',
      ],
      evidence: 'Lawyer dashboard exposes structured billing/service request presets.',
      nextAction: 'Use service requests for payment-link, invoice, refund, cancellation, upgrade and downgrade drills.',
      ownerNotice: 'Dashboard requests create review queues; they do not mutate provider subscriptions by themselves.',
    }),
    markerGate({
      id: 'MIF-04',
      gate: 'service_request_handlers',
      file: 'inc/lawyer-dashboard.php',
      markers: [
        'justice_theme_lawyer_service_request_options',
        'payment_link_request',
        'upgrade_plan',
        'downgrade_plan',
        'cancel_subscription',
        'refund_request',
        'invoice_copy',
        'justice_theme_handle_lawyer_service_request',
      ],
      evidence: 'Dashboard handlers define the billing/service request types and save handler.',
      nextAction: 'Controlled live drills should verify each request type lands in owner review before any provider action.',
      ownerNotice: 'Refund/cancel/upgrade/downgrade must stay owner-reviewed and provider-confirmed.',
    }),
    markerGate({
      id: 'MIF-05',
      gate: 'qualified_lead_billing_queue',
      file: 'inc/lead-crm.php',
      markers: [
        'qualified_lead_billing_status',
        'qualified_lead_invoice_reference',
        'qualified_lead_payment_evidence_url',
        'justice_theme_crm_render_qualified_lead_billing_queue',
      ],
      evidence: 'CRM qualified lead queue stores billing status, invoice reference and evidence URL.',
      nextAction: 'Use only after lead consent, accepted lawyer/supplier terms, owner release and billing contact exist.',
      ownerNotice: 'This packet does not create leads, assign lawyers or send invoices.',
    }),
    markerGate({
      id: 'MIF-06',
      gate: 'paid_status_proof_guard',
      file: 'inc/lead-crm.php',
      markers: [
        "'paid' === $billing_status && '' === $invoice_reference && '' === $payment_evidence_url",
        'qualified_lead_paid_at',
      ],
      evidence: 'CRM save handler downgrades an attempted paid status to invoice_sent when proof is missing.',
      nextAction: 'Mark paid only when invoice/reference or payment evidence exists.',
      ownerNotice: 'This is the key anti-overclaim guard for first paid lead reporting.',
    }),
    markerGate({
      id: 'MIF-07',
      gate: 'grow_checker_private',
      file: 'tools/check-grow-payment-compliance.mjs',
      markers: [
        '.project-control',
        '.reports',
        'manual_invoice',
        'terms',
        'cancellation',
        'privacy',
      ],
      evidence: 'Grow compliance checker writes private reports and checks manual invoice/legal-policy markers.',
      nextAction: 'Rerun live compliance before a provider approval/payment walkthrough.',
      ownerNotice: 'Live provider KYC/product mapping remains outside this static private packet.',
    }),
    markerGate({
      id: 'MIF-08',
      gate: 'e2e_preflight_runtime_blockers',
      file: 'tools/check-lawyer-subscription-e2e-preflight.mjs',
      markers: [
        'PASS_WITH_RUNTIME_BLOCKERS',
        'runtimeBlockers',
        'Grow/Meshulam/Morning',
        'real transaction/reference',
        'invoice or receipt proof',
      ],
      evidence: 'Subscription preflight explicitly separates static pass from runtime payment/provider blockers.',
      nextAction: 'Keep manual proof ledger until controlled live provider/payment drills are approved.',
      ownerNotice: 'Subscription revenue cannot be counted from static proof alone.',
    }),
  ];
}

function buildOperatorRows(preflight, grow) {
  const preflightStatus = preflight.summary?.status || 'missing';
  const growStatus = grow.exists ? `${grow.summary?.passCount || 0} Grow compliance passes` : 'missing';

  return [
    {
      id: 'RUN-01',
      stage: 'controlled_scope',
      allowed_action: 'Use one owner-approved controlled lawyer, supplier or lead only.',
      required_evidence: 'Owner approval, source record type and no-PII internal reference.',
      blocked_without: 'Owner approval and controlled test scope.',
      forbidden_action: 'Do not bulk import, message old leads, create public records or contact partners.',
      source_context: `Preflight: ${preflightStatus}; Grow: ${growStatus}.`,
    },
    {
      id: 'RUN-02',
      stage: 'terms_and_fee',
      allowed_action: 'Confirm accepted terms, per-lead or subscription fee, billing contact and invoice recipient.',
      required_evidence: 'Accepted terms status, agreed fee, billing contact yes/no.',
      blocked_without: 'Accepted lawyer/supplier terms or billing contact.',
      forbidden_action: 'Do not route paid leads or send invoice requests without terms and fee clarity.',
      source_context: 'Onboarding and CRM both store payment/status references but still require real owner/admin evidence.',
    },
    {
      id: 'RUN-03',
      stage: 'manual_invoice_request',
      allowed_action: 'Prepare a no-PII manual invoice/request packet for owner/operator use.',
      required_evidence: 'Plan/lead type, amount, owner-approved source ID, no sensitive chat or payment data.',
      blocked_without: 'Billing contact, accepted terms and owner release.',
      forbidden_action: 'Do not send an invoice, email, WhatsApp or provider request from this generated packet.',
      source_context: 'The generated template is blank on purpose and must be filled in the approved private system.',
    },
    {
      id: 'RUN-04',
      stage: 'invoice_sent_status',
      allowed_action: 'After the owner manually sends the invoice/payment request, record the invoice/reference and set invoice_sent.',
      required_evidence: 'Invoice reference or private payment-request reference.',
      blocked_without: 'A real sent invoice/payment request.',
      forbidden_action: 'Do not mark paid at this stage.',
      source_context: 'Lead CRM and lawyer onboarding both support invoice/manual payment references.',
    },
    {
      id: 'RUN-05',
      stage: 'paid_status',
      allowed_action: 'Set paid only after invoice/reference or payment evidence URL exists.',
      required_evidence: 'Invoice/reference, receipt/payment proof URL or owner evidence link.',
      blocked_without: 'Invoice/reference or payment proof.',
      forbidden_action: 'Do not count revenue, announce first paid lead or update paid_at without evidence.',
      source_context: 'CRM paid-status guard prevents paid with empty invoice/reference and empty payment evidence URL.',
    },
    {
      id: 'RUN-06',
      stage: 'subscription_changes',
      allowed_action: 'Use dashboard service requests for upgrade, downgrade, cancellation, invoice copy and refund review.',
      required_evidence: 'Service request row, owner decision, provider action result and reference if money moved.',
      blocked_without: 'Controlled live lawyer dashboard and provider/admin confirmation.',
      forbidden_action: 'Do not mutate live provider subscription state directly from a chat request.',
      source_context: 'Dashboard presets and handlers exist; live drills remain runtime blockers.',
    },
  ];
}

function buildTemplateRows() {
  return [
    {
      evidence_id: 'MIF-TEMPLATE-001',
      revenue_path: 'lawyer_subscription',
      source_record_type: 'lawyer_profile',
      source_record_id_private: '',
      owner_approved_controlled_test: '',
      accepted_terms_status: '',
      agreed_fee_ils: '',
      billing_contact_present: '',
      invoice_reference: '',
      payment_evidence_present: '',
      billing_status: '',
      allowed_next_action: 'Owner may send manual payment link/invoice only after terms and billing contact are complete.',
      forbidden_action: 'Do not mark paid from registration alone.',
      operator_note_no_pii: '',
    },
    {
      evidence_id: 'MIF-TEMPLATE-002',
      revenue_path: 'qualified_lead',
      source_record_type: 'crm_lead',
      source_record_id_private: '',
      owner_approved_controlled_test: '',
      accepted_terms_status: '',
      agreed_fee_ils: '',
      billing_contact_present: '',
      invoice_reference: '',
      payment_evidence_present: '',
      billing_status: '',
      allowed_next_action: 'Set ready_to_bill or invoice_sent only after consent, terms, owner release and billing details exist.',
      forbidden_action: 'Do not route or bill an old lead without fresh permission.',
      operator_note_no_pii: '',
    },
    {
      evidence_id: 'MIF-TEMPLATE-003',
      revenue_path: 'bituach_leumi_controlled_lead',
      source_record_type: 'crm_lead',
      source_record_id_private: '',
      owner_approved_controlled_test: '',
      accepted_terms_status: '',
      agreed_fee_ils: '',
      billing_contact_present: '',
      invoice_reference: '',
      payment_evidence_present: '',
      billing_status: '',
      allowed_next_action: 'Keep lead packet, invoice reference and payment proof together before first-paid-lead claim.',
      forbidden_action: 'Do not announce first paid lead before proof exists.',
      operator_note_no_pii: '',
    },
    {
      evidence_id: 'MIF-TEMPLATE-004',
      revenue_path: 'refund_or_cancel',
      source_record_type: 'lawyer_service_request',
      source_record_id_private: '',
      owner_approved_controlled_test: '',
      accepted_terms_status: '',
      agreed_fee_ils: '',
      billing_contact_present: '',
      invoice_reference: '',
      payment_evidence_present: '',
      billing_status: '',
      allowed_next_action: 'Record service request, owner decision and provider confirmation before changing billing state.',
      forbidden_action: 'Do not refund or cancel by memory/chat only.',
      operator_note_no_pii: '',
    },
    {
      evidence_id: 'MIF-TEMPLATE-005',
      revenue_path: 'upgrade_or_downgrade',
      source_record_type: 'lawyer_service_request',
      source_record_id_private: '',
      owner_approved_controlled_test: '',
      accepted_terms_status: '',
      agreed_fee_ils: '',
      billing_contact_present: '',
      invoice_reference: '',
      payment_evidence_present: '',
      billing_status: '',
      allowed_next_action: 'Record requested plan, timing, owner decision and payment/reference before plan-state change.',
      forbidden_action: 'Do not switch live plan state without billing evidence.',
      operator_note_no_pii: '',
    },
  ];
}

function buildSourceRows(preflight, grow) {
  return [
    {
      id: 'SRC-01',
      source: preflight.path,
      exists: preflight.exists ? 'yes' : 'no',
      status: preflight.summary?.status || '',
      interpretation: preflight.exists
        ? 'Subscription preflight passed static gates but still has runtime blockers for controlled live user, provider setup and real invoice/payment proof.'
        : 'Subscription preflight source report was not found; rerun the preflight before a live walkthrough.',
    },
    {
      id: 'SRC-02',
      source: grow.path,
      exists: grow.exists ? 'yes' : 'no',
      status: grow.exists ? `${grow.summary?.passCount || 0} pass checks` : '',
      interpretation: grow.exists
        ? 'Latest Grow compliance evidence shows public checkout/legal-policy checks, but provider KYC/product mapping and real payment proof remain separate blockers.'
        : 'Grow compliance source report was not found; rerun live compliance before provider/payment approval.',
    },
  ];
}

function buildSummary(reportDate, gateRows, operatorRows, templateRows, preflight, grow) {
  const blockedRows = gateRows.filter((row) => row.status !== 'PASS');
  const sourceFreshnessRow = gateRows.find((row) => row.id === 'MIF-09');
  const preflightRuntimeBlockers = Array.isArray(preflight.summary?.runtimeBlockers)
    ? preflight.summary.runtimeBlockers.length
    : 0;

  return {
    reportDate,
    status: blockedRows.length
      ? 'MANUAL_INVOICE_FALLBACK_BLOCKED_STATIC_GATES'
      : 'MANUAL_INVOICE_FALLBACK_READY_NO_LIVE_PAYMENT_ACTION',
    staticGateCount: gateRows.length,
    staticPassCount: gateRows.length - blockedRows.length,
    staticBlockedCount: blockedRows.length,
    operatorRunRows: operatorRows.length,
    templateRows: templateRows.length,
    sourcePreflight: preflight.path,
    sourcePreflightStatus: preflight.summary?.status || '',
    sourcePreflightRuntimeBlockers: preflightRuntimeBlockers,
    sourceGrow: grow.path,
    sourceGrowPassCount: grow.summary?.passCount || 0,
    sourcePreflightDate: sourceReportDate(preflight),
    sourceGrowDate: sourceReportDate(grow),
    sourceReportsCurrent: sourceFreshnessRow?.status === 'PASS' ? 'yes' : 'review',
    liveRecordsCreated: 0,
    invoicesSent: 0,
    paymentsCreated: 0,
    paidStatusesSet: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    emailsSent: 0,
    whatsAppOrTalkToActions: 0,
    publicChangesApproved: 0,
    providerSettingsChanged: 0,
    upressDeploymentRequired: false,
  };
}

function markdownReport(summary, gateRows, operatorRows, sourceRows) {
  return [
    `# Manual Invoice Revenue Fallback Packet - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: private owner/admin revenue fallback packet only. It source-checks manual invoice, CRM billing proof, dashboard service requests and payment-provider readiness boundaries. It does not create records, publish content, send invoices, send email, contact leads/lawyers/suppliers, mark anything paid, change provider settings or deploy.',
    '',
    '## Summary',
    '',
    `- Static gates: ${summary.staticPassCount}/${summary.staticGateCount} passed.`,
    `- Operator run rows: ${summary.operatorRunRows}.`,
    `- Blank no-PII evidence template rows: ${summary.templateRows}.`,
    `- Source subscription preflight: ${summary.sourcePreflightStatus || 'missing'} (${summary.sourcePreflightRuntimeBlockers} runtime blockers).`,
    `- Source Grow compliance: ${summary.sourceGrowPassCount} pass checks.`,
    `- Same-day source chain: ${summary.sourceReportsCurrent} (preflight ${summary.sourcePreflightDate || 'missing'}; Grow ${summary.sourceGrowDate || 'missing'}).`,
    `- Live actions taken: ${summary.liveRecordsCreated} records, ${summary.invoicesSent} invoices, ${summary.paymentsCreated} payments, ${summary.paidStatusesSet} paid statuses, ${summary.emailsSent} emails.`,
    '',
    '## Source Reports',
    '',
    '| ID | Source | Exists | Status | Interpretation |',
    '| --- | --- | --- | --- | --- |',
    ...sourceRows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.source)} | ${mdCell(row.exists)} | ${mdCell(row.status)} | ${mdCell(row.interpretation)} |`),
    '',
    '## Static Gates',
    '',
    '| ID | Gate | Status | File | Evidence | Missing Markers | Next Action |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...gateRows.map((row) =>
      `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.file)} | ${mdCell(row.evidence)}; ${mdCell(row.source_evidence)} | ${mdCell(row.missing_markers || '-')} | ${mdCell(row.next_action)} |`,
    ),
    '',
    '## Operator Run Order',
    '',
    '| ID | Stage | Allowed Action | Required Evidence | Blocked Without | Forbidden Action |',
    '| --- | --- | --- | --- | --- | --- |',
    ...operatorRows.map((row) =>
      `| ${mdCell(row.id)} | ${mdCell(row.stage)} | ${mdCell(row.allowed_action)} | ${mdCell(row.required_evidence)} | ${mdCell(row.blocked_without)} | ${mdCell(row.forbidden_action)} |`,
    ),
    '',
    '## Review',
    '',
    'The repo has enough source support for a manual invoice fallback workflow, but only as a controlled private operating packet. The strongest guard is the CRM paid-status proof rule: paid lead revenue should not be counted unless an invoice/reference or payment evidence URL exists. Grow/Meshulam/Morning live KYC/product/payment behavior remains outside static proof, so this packet keeps revenue handling manual, documented and proof-first.',
    '',
    '## Completion Assessment',
    '',
    'Manual invoice fallback packet: 100% complete as a private source-checked artifact. Live paid-lead/subscription execution remains blocked until the owner approves a controlled live record, accepted terms and billing contact are present, and real invoice/payment proof is recorded.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-manual-invoice-revenue-fallback-packet.mjs [--reportDate=YYYY-MM-DD] [--sourcePreflight=.reports/file.json] [--sourceGrow=.reports/file.json]');
  process.exit(0);
}

const preflight = readOptionalJson(args.sourcePreflight);
const grow = readOptionalJson(args.sourceGrow);
const gateRows = [...buildGateRows(), sourceFreshnessGate(args.reportDate, preflight, grow)];
const operatorRows = buildOperatorRows(preflight, grow);
const templateRows = buildTemplateRows();
const sourceRows = buildSourceRows(preflight, grow);
const summary = buildSummary(args.reportDate, gateRows, operatorRows, templateRows, preflight, grow);
const files = outputFiles(args.reportDate);

const gateColumns = [
  'id',
  'gate',
  'status',
  'file',
  'evidence',
  'missing_markers',
  'source_evidence',
  'next_action',
  'owner_notice',
  'live_action_taken',
];
const templateColumns = [
  'evidence_id',
  'revenue_path',
  'source_record_type',
  'source_record_id_private',
  'owner_approved_controlled_test',
  'accepted_terms_status',
  'agreed_fee_ils',
  'billing_contact_present',
  'invoice_reference',
  'payment_evidence_present',
  'billing_status',
  'allowed_next_action',
  'forbidden_action',
  'operator_note_no_pii',
];

writeText(files.projectMd, markdownReport(summary, gateRows, operatorRows, sourceRows));
writeText(files.projectCsv, toCsv(gateRows, gateColumns));
writeText(files.templateCsv, toCsv(templateRows, templateColumns));
writeText(files.reportJson, `${JSON.stringify({ summary, sourceRows, gateRows, operatorRows, templateRows }, null, 2)}\n`);
writeText(files.reportCsv, toCsv(gateRows, gateColumns));

console.log(
  JSON.stringify(
    {
      ...summary,
      files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
    },
    null,
    2,
  ),
);

if (summary.staticBlockedCount > 0) {
  process.exitCode = 1;
}
