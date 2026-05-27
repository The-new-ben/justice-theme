import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const files = {
  plans: path.join(ROOT, 'inc', 'lawyer-plans.php'),
  checkoutFallback: path.join(ROOT, 'inc', 'payment-compliance-routes.php'),
  registration: path.join(ROOT, 'page-lawyer-registration.php'),
  onboarding: path.join(ROOT, 'inc', 'lawyer-onboarding.php'),
  dashboardPage: path.join(ROOT, 'page-lawyer-dashboard.php'),
  dashboardLogic: path.join(ROOT, 'inc', 'lawyer-dashboard.php'),
  dashboardJs: path.join(ROOT, 'assets', 'js', 'lawyer-dashboard.js'),
  crm: path.join(ROOT, 'inc', 'lead-crm.php'),
  growChecker: path.join(ROOT, 'tools', 'check-grow-payment-compliance.mjs'),
  oldLiveFunnelChecker: path.join(ROOT, 'tools', 'check-live-lawyer-revenue-funnel.mjs'),
};

const gates = [
  {
    id: 'LSE-01',
    gate: 'paid_plan_catalog_and_checkout_mapping',
    file: 'plans',
    markers: [
      'justice_theme_lawyer_plans',
      'justice_theme_paid_lawyer_plan_keys',
      'justice_theme_plan_checkout_ready',
      'justice_theme_plan_pre_checkout_url',
      'justice_theme_plan_checkout_url',
      'justice_theme_lawyer_plan_payment_requirement_rows',
    ],
    nextAction: 'Use the plan payment requirements table before any paid-plan walkthrough.',
    ownerNotice: 'This proves plan/catalog hooks exist; it does not prove provider products are live.',
  },
  {
    id: 'LSE-02',
    gate: 'manual_invoice_checkout_fallback',
    file: 'checkoutFallback',
    markers: [
      'name="payment_path" value="manual_invoice"',
      'name="plan_interest"',
      'id="billing_first_name"',
      'id="billing_last_name"',
      'id="billing_phone"',
      'id="billing_email"',
      'id="terms"',
      '/sample-terms-and-conditions-template/',
      '/cancellation/',
      '/privacy/',
    ],
    nextAction: 'During walkthrough, open the fallback checkout path and verify customer fields, terms, cancellation and privacy links.',
    ownerNotice: 'This is the safe no-charge path while Grow/Morning are not fully proven.',
  },
  {
    id: 'LSE-03',
    gate: 'lawyer_registration_captures_plan_and_billing',
    file: 'registration',
    markers: [
      'lawyer-registration-form',
      'lawyer-registration-account-path',
      'lawyer-registration-billing-fields',
      'name="payment_path"',
      'name="plan_interest"',
      'billing_legal_name',
      'billing_invoice_email',
      'manual_invoice',
    ],
    nextAction: 'Create only an owner-approved test lawyer/profile in the live walkthrough, then confirm billing metadata lands on the draft profile.',
    ownerNotice: 'No test lawyer should be created without owner approval because it touches live CRM/profile data.',
  },
  {
    id: 'LSE-04',
    gate: 'onboarding_admin_payment_queue',
    file: 'onboarding',
    markers: [
      'justice_theme_handle_lawyer_registration',
      'payment_followup_status',
      'manual_payment_link_url',
      'manual_invoice_reference',
      'justice_theme_send_lawyer_manual_payment_link_email',
      'justice_theme_lawyer_onboarding_billing_meta_query',
      'justice_theme_lawyer_payment_queue_export_url',
      'justice_theme_render_lawyer_onboarding_investor_demo_panel',
    ],
    nextAction: 'In wp-admin, verify the lawyer appears in the correct billing queue and only send payment email from an owner-approved test record.',
    ownerNotice: 'The queue exists, but real email/payment proof still requires an approved live record.',
  },
  {
    id: 'LSE-05',
    gate: 'lawyer_dashboard_payment_and_service_requests',
    file: 'dashboardPage',
    markers: [
      'lawyer-dashboard-plan-status__payment-link',
      'Complete payment',
      'manual invoice review',
      '$primary_paid_plan_key',
      'data-service-request-preset="payment_link"',
      "empty( $payment_preset['desired_plan'] )",
      'data-service-request-preset="<?php echo esc_attr( $preset_key ); ?>"',
      "array( 'upgrade', 'downgrade', 'cancel', 'refund', 'invoice', 'lead_quality', 'complaint' )",
      "'presets'     => array( 'payment_link', 'invoice' )",
      "'presets'     => array( 'upgrade', 'downgrade', 'cancel' )",
      "'presets'     => array( 'lead_quality', 'complaint', 'refund' )",
      'Requests are saved to the profile and sent to Jus-Tice for owner review before account or payment action.',
      'justice_lawyer_lead_stage_update',
    ],
    nextAction: 'Walk through the lawyer dashboard after a claimed profile exists: payment link, upgrade, downgrade, cancel, refund, invoice, lead-quality, complaint and lead-stage update.',
    ownerNotice: 'Requires a real logged-in lawyer user linked to a claimed lawyer profile; dashboard copy keeps payment/account actions under owner review.',
  },
  {
    id: 'LSE-06',
    gate: 'lawyer_dashboard_request_handlers',
    file: 'dashboardLogic',
    markers: [
      'justice_theme_lawyer_service_request_options',
      'billing_question',
      'payment_link_request',
      'invoice_copy',
      'upgrade_plan',
      'downgrade_plan',
      'cancel_subscription',
      'refund_request',
      'complaint',
      'lead_quality',
      'justice_theme_lawyer_dashboard_service_presets',
      "'payment_link'",
      "'upgrade'",
      "'downgrade'",
      "'cancel'",
      "'refund'",
      "'invoice'",
      "'latest_service_request_status'",
      "'pending_service_request'",
      'justice_theme_handle_lawyer_service_request',
      "'payment_link_request' === $request_type",
      "'plan_type', true",
      "'free' !== $current_plan",
      '$desired_plan = $current_plan',
      'justice_theme_notify_lawyer_service_request',
      'justice_theme_handle_lawyer_lead_stage_update',
    ],
    nextAction: 'Submit one controlled dashboard service request and one lead-stage update only after the live test lawyer exists.',
    ownerNotice: 'This proves all current lifecycle request types are routed into saved owner-review requests; it does not prove a live lawyer session or lead assignment exists.',
  },
  {
    id: 'LSE-07',
    gate: 'dashboard_presets_are_form_fill_only',
    file: 'dashboardJs',
    markers: [
      '[data-service-request-preset]',
      'setFieldValue',
      '#service-request-type',
      '#service-request-urgency',
      '#service-request-desired-plan',
      '#service-request-subject',
      '#service-request-message',
      'focusServiceDesk',
    ],
    nextAction: 'Use dashboard preset buttons only as form-fill helpers during the live walkthrough; owner/admin review remains required before payment, plan or refund changes.',
    ownerNotice: 'Dashboard presets do not charge, refund, cancel, upgrade or downgrade automatically.',
  },
  {
    id: 'LSE-08',
    gate: 'qualified_lead_billing_proof_fields',
    file: 'crm',
    markers: [
      'qualified_lead_billing_status',
      'qualified_lead_invoice_reference',
      'qualified_lead_payment_evidence_url',
      'justice_theme_crm_render_qualified_lead_billing_queue',
      'justice-qualified-lead-billing-status',
      'justice-qualified-lead-invoice-reference',
      'justice-qualified-lead-payment-evidence-url',
    ],
    nextAction: 'After a controlled lead is assigned, record invoice/reference for invoice-stage follow-up and private payment evidence before paid revenue is counted.',
    ownerNotice: 'Revenue is not proven until private payment evidence is recorded; invoice/reference supports invoice-stage follow-up.',
  },
  {
    id: 'LSE-09',
    gate: 'grow_compliance_checker_available',
    file: 'growChecker',
    markers: [
      "'.project-control'",
      "'.reports'",
      'check-grow-payment-compliance',
      'terms',
      'cancellation',
      'privacy',
    ],
    nextAction: 'Run the Grow checker before provider/payment walkthrough and keep the generated artifacts private.',
    ownerNotice: 'This checks public compliance markers, not live recurring billing.',
  },
];

const runtimeBlockers = [
  'A controlled live lawyer user and claimed lawyer profile are required for dashboard login and plan-status proof.',
  'A controlled live registration must be owner-approved before creating/editing production lawyer records.',
  'Grow/Meshulam/Morning provider setup, product mapping and real payment-link behavior remain outside static repo proof.',
  'Private payment evidence must be recorded before subscription revenue is counted; invoice/reference alone supports invoice-stage follow-up.',
  'Dashboard preset buttons are form-fill helpers only; owner/admin must review each payment, upgrade, downgrade, cancellation, refund or invoice request before changing plan/payment state.',
  'Upgrade, downgrade, cancellation and refund flows need one controlled live service-request drill each.',
  'Lead revenue needs a consented controlled lead, accepted lawyer/supplier terms, owner release and billing evidence.',
];

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
  const base = `lawyer-subscription-e2e-preflight-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function readText(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, columns) {
  const body = rows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function inspectGate(gate) {
  const filePath = files[gate.file];
  const text = readText(filePath);
  const missing = gate.markers.filter((marker) => !text.includes(marker));
  const relativeFile = path.relative(ROOT, filePath).replace(/\\/g, '/');

  return {
    id: gate.id,
    gate: gate.gate,
    status: !existsSync(filePath) || missing.length ? 'BLOCKED' : 'PASS',
    file: relativeFile,
    evidence: existsSync(filePath)
      ? `${gate.markers.length - missing.length}/${gate.markers.length} markers found`
      : 'Source file missing',
    missing_markers: missing.join('|'),
    next_action: missing.length ? `Restore or verify missing markers: ${missing.join(', ')}` : gate.nextAction,
    owner_notice: gate.ownerNotice,
  };
}

function oldCheckerWarning() {
  const text = readText(files.oldLiveFunnelChecker);
  const staleMarkers = [
    'Homepage exposes lawyer revenue entrypoints',
    "fs.mkdir( 'project-control'",
    "fs.mkdir( 'reports'",
    '`project-control/lawyer-revenue-funnel-live-',
    '`reports/lawyer-revenue-funnel-live-',
  ].filter((marker) => text.includes(marker));

  return {
    id: 'LSE-10',
    gate: 'stale_live_funnel_checker_quarantined',
    status: staleMarkers.length ? 'WARN' : 'PASS',
    file: path.relative(ROOT, files.oldLiveFunnelChecker).replace(/\\/g, '/'),
    evidence: staleMarkers.length
      ? `Old checker still has stale markers: ${staleMarkers.join('|')}`
      : 'No stale marker detected in old live funnel checker.',
    missing_markers: '',
    next_action: staleMarkers.length
      ? 'Do not run tools/check-live-lawyer-revenue-funnel.mjs for current proof until it is migrated to the customer-first homepage and dot-private artifact paths.'
      : 'Old checker appears safe for review, but prefer this current preflight for the subscription walkthrough.',
    owner_notice: 'This warning prevents a false failure caused by the intentionally removed homepage lawyer-pricing strip.',
  };
}

function markdownReport(summary, rows) {
  const walkthrough = [
    '1. Visitor sees legal-help-first site; lawyer join flow remains secondary.',
    '2. Lawyer selects a paid plan or fallback manual-invoice path.',
    '3. Registration captures plan interest, account path and billing fields.',
    '4. Admin onboarding queue records invoice/payment link status.',
    '5. Lawyer dashboard exposes payment link and form-fill-only service request presets for payment, invoice, upgrade, downgrade, cancellation, refund, lead-quality and complaint scenarios.',
    '6. A controlled lead is assigned and stage-updated from the lawyer dashboard.',
    '7. CRM records invoice/reference for invoice-stage follow-up and private payment evidence before paid revenue is counted.',
  ];

  return [
    `# Lawyer Subscription E2E Preflight - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    'Scope: repo-local, no-PII static preflight for the later lawyer registration, subscription, payment, dashboard, CRM, upgrade/downgrade/cancel/refund and lead-billing walkthrough.',
    '',
    '## What This Proves',
    '',
    `- Static gates passing: ${summary.passCount}/${summary.totalGates}`,
    `- Warnings: ${summary.warnCount}`,
    `- Blocked static gates: ${summary.blockedCount}`,
    '- Public CMS/database state was not changed.',
    '- No lawyer, lead, supplier, invoice, payment, email, WhatsApp or TalkTo record was created.',
    '',
    '## Runtime Blockers',
    '',
    ...summary.runtimeBlockers.map((blocker) => `- ${blocker}`),
    '',
    '## Walkthrough Order',
    '',
    ...walkthrough.map((item) => `- ${item}`),
    '',
    '## Gate Results',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${row.id} | ${row.gate} | ${row.status} | ${row.evidence.replace(/\|/g, '/')} | ${row.next_action.replace(/\|/g, '/')} |`),
    '',
    '## Safety Statement',
    '',
    'This preflight writes only dot-private `.project-control` and `.reports` artifacts. It does not publish or update public pages, titles, H1s, meta, redirects, canonicals, noindex, sitemaps, taxonomies, leads, lawyer records, suppliers, products, invoices, payment links, emails, WhatsApp/TalkTo messages, GSC, GA4 or provider settings.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/check-lawyer-subscription-e2e-preflight.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const rows = [...gates.map(inspectGate), oldCheckerWarning()];
const blockedRows = rows.filter((row) => row.status === 'BLOCKED');
const warnRows = rows.filter((row) => row.status === 'WARN');
const passRows = rows.filter((row) => row.status === 'PASS');
const summary = {
  reportDate: args.reportDate,
  status: blockedRows.length ? 'BLOCKED_STATIC_GATES' : 'PASS_WITH_RUNTIME_BLOCKERS',
  totalGates: rows.length,
  passCount: passRows.length,
  warnCount: warnRows.length,
  blockedCount: blockedRows.length,
  runtimeBlockers,
  blockers: [...blockedRows.map((row) => `${row.id}: ${row.gate}`), ...runtimeBlockers],
};
const outputs = outputFiles(args.reportDate);
const columns = ['id', 'gate', 'status', 'file', 'evidence', 'missing_markers', 'next_action', 'owner_notice'];

writeText(outputs.projectMd, markdownReport(summary, rows));
writeText(outputs.projectCsv, toCsv(rows, columns));
writeText(outputs.reportCsv, toCsv(rows, columns));
writeText(outputs.reportJson, `${JSON.stringify({ summary, rows, outputs }, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      ...summary,
      outputs,
    },
    null,
    2
  )
);

if (blockedRows.length) {
  process.exitCode = 1;
}
