import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const routes = [
  'https://jus-tice.co.il/',
  'https://jus-tice.co.il/lawyer-plans/',
  'https://jus-tice.co.il/checkout/?plan_interest=lead_partner&pre_checkout=1&payment_path=manual_invoice',
  'https://jus-tice.co.il/lawyer-registration/?plan_interest=lead_partner&payment_path=manual_invoice',
  'https://jus-tice.co.il/lawyer-dashboard/',
  'wp-admin -> Lawyer Onboarding',
  'wp-admin -> Justice CRM -> Qualified lead billing queue',
];

function buildRows(reportDate) {
  return [
  {
    id: 'WALK-01',
    phase: 'preflight',
    action: 'Confirm owner approval for a controlled lawyer test identity and controlled test email/phone.',
    owner_approval: 'required',
    evidence_to_capture: 'Owner approval note, test identity, test email inbox owner, test phone owner.',
    stop_condition: 'Stop if the identity is a real lawyer/client who did not consent to the test.',
    status: 'blocked_until_owner_controlled_test',
  },
  {
    id: 'WALK-02',
    phase: 'preflight',
    action: 'Confirm payment path to test: manual invoice only, Grow payment link, Meshulam link, Morning invoice or no-charge dry run.',
    owner_approval: 'required',
    evidence_to_capture: 'Selected payment path, provider link or explicit no-charge note.',
    stop_condition: 'Stop before any charge unless provider link and amount are owner-approved.',
    status: 'blocked_until_payment_path_selected',
  },
  {
    id: 'WALK-03',
    phase: 'preflight',
    action: 'Run current static and live read-only gates before touching live records.',
    owner_approval: 'not_required',
    evidence_to_capture: `.project-control/lawyer-subscription-e2e-preflight-${reportDate}.md and .project-control/lawyer-revenue-funnel-live-${reportDate}.md when refreshed for the same day.`,
    stop_condition: 'Stop if either gate returns REVIEW, BLOCKED_STATIC_GATES or stale checker warnings.',
    status: 'ready',
  },
  {
    id: 'WALK-04',
    phase: 'public_check',
    action: 'Verify homepage stays legal-help-first and lawyer path is secondary.',
    owner_approval: 'not_required',
    evidence_to_capture: 'Screenshot or report row showing user-first homepage, quiet lawyer CTA and no internal revenue-plan language.',
    stop_condition: 'Stop if homepage exposes internal revenue/business-plan language.',
    status: 'ready',
  },
  {
    id: 'WALK-05',
    phase: 'plan_checkout',
    action: 'Open lawyer plans page and choose lead_partner manual-invoice path.',
    owner_approval: 'not_required',
    evidence_to_capture: 'Plan selected, URL params, pricing context, manual-invoice fallback visible.',
    stop_condition: 'Stop if pricing or plan copy promises guaranteed leads/results.',
    status: 'ready',
  },
  {
    id: 'WALK-06',
    phase: 'plan_checkout',
    action: 'Open checkout fallback and verify billing fields, terms, cancellation and privacy links.',
    owner_approval: 'not_required',
    evidence_to_capture: 'Required field list, checked terms link, cancellation link, privacy link.',
    stop_condition: 'Stop if terms checkbox or cancellation/privacy links are missing.',
    status: 'ready',
  },
  {
    id: 'WALK-07',
    phase: 'registration',
    action: 'Submit controlled lawyer registration with plan_interest and payment_path preserved.',
    owner_approval: 'required',
    evidence_to_capture: 'Registration URL, form values without sensitive ID docs, success screen, created profile/post ID.',
    stop_condition: 'Stop before submit unless owner approved live record creation.',
    status: 'blocked_until_owner_controlled_test',
  },
  {
    id: 'WALK-08',
    phase: 'admin_onboarding',
    action: 'Open the created lawyer profile/onboarding record and verify billing metadata and manual payment queue.',
    owner_approval: 'required',
    evidence_to_capture: 'Profile/post ID, plan type, billing legal name, invoice email, payment_followup_status, manual_invoice_reference.',
    stop_condition: 'Stop if billing metadata is missing or profile is public before approval.',
    status: 'blocked_until_live_record_exists',
  },
  {
    id: 'WALK-09',
    phase: 'payment',
    action: 'Add approved manual payment link or invoice reference and send payment-link email only to controlled inbox.',
    owner_approval: 'required',
    evidence_to_capture: 'Manual payment link URL, invoice reference, sent timestamp, recipient controlled inbox proof.',
    stop_condition: 'Stop if email recipient is not controlled or link amount/provider is not approved.',
    status: 'blocked_until_payment_path_selected',
  },
  {
    id: 'WALK-10',
    phase: 'dashboard',
    action: 'Log in as the controlled lawyer user and verify dashboard plan status, payment link, service request presets and lead-stage form visibility.',
    owner_approval: 'required',
    evidence_to_capture: 'Dashboard URL, linked profile ID, payment CTA state, available presets, no unassigned lead PII visible.',
    stop_condition: 'Stop if the dashboard exposes leads not assigned to the controlled lawyer.',
    status: 'blocked_until_controlled_lawyer_login',
  },
  {
    id: 'WALK-11',
    phase: 'service_requests',
    action: 'Submit one controlled request each for payment link, upgrade, downgrade, cancel, refund and invoice.',
    owner_approval: 'required',
    evidence_to_capture: 'Service request IDs, request types, statuses, timestamps and linked lawyer profile.',
    stop_condition: 'Stop if any request triggers automatic refund/charge/cancel without owner approval.',
    status: 'blocked_until_controlled_lawyer_login',
  },
  {
    id: 'WALK-12',
    phase: 'lead_crm',
    action: 'Attach one consented controlled lead to the controlled lawyer and update lead stage from dashboard.',
    owner_approval: 'required',
    evidence_to_capture: 'Lead ID, consent status, routing_hold state, assigned lawyer ID, stage update note.',
    stop_condition: 'Stop if the lead is not consented, not controlled or contains real client PII not approved for the test.',
    status: 'blocked_until_controlled_lead_exists',
  },
  {
    id: 'WALK-13',
    phase: 'billing_proof',
    action: 'Record qualified lead billing status, invoice reference for invoice-stage follow-up and private payment evidence URL before paid revenue is counted.',
    owner_approval: 'required',
    evidence_to_capture: 'qualified_lead_billing_status, qualified_lead_invoice_reference, qualified_lead_payment_evidence_url.',
    stop_condition: 'Stop before marking paid if private payment evidence URL is missing.',
    status: 'blocked_until_payment_evidence',
  },
  {
    id: 'WALK-14',
    phase: 'exit_review',
    action: 'Summarize what passed, what failed, and whether money may be counted.',
    owner_approval: 'required',
    evidence_to_capture: 'Final owner-approved walkthrough summary with links to private evidence artifacts.',
    stop_condition: 'Do not send public success update or revenue claim if any proof field is missing.',
    status: 'blocked_until_all_prior_steps_pass',
  },
  ];
}

function buildEvidenceTemplateRows() {
  return [
    {
      field_id: 'EVID-01',
      field: 'owner_controlled_test_approval',
      required_before_step: 'WALK-01',
      expected_value_type: 'approve / reject / park / needs_more_evidence',
      repo_storage_rule: 'no_pii_summary_only',
      blank_owner_value: '',
    },
    {
      field_id: 'EVID-02',
      field: 'controlled_identity_alias',
      required_before_step: 'WALK-01',
      expected_value_type: 'short alias, not real name unless owner explicitly approves live record evidence storage',
      repo_storage_rule: 'no_pii_summary_only',
      blank_owner_value: '',
    },
    {
      field_id: 'EVID-03',
      field: 'controlled_inbox_and_phone_owner_confirmed',
      required_before_step: 'WALK-01',
      expected_value_type: 'yes / no plus private evidence location',
      repo_storage_rule: 'do_not_store_email_or_phone',
      blank_owner_value: '',
    },
    {
      field_id: 'EVID-04',
      field: 'selected_payment_path',
      required_before_step: 'WALK-02',
      expected_value_type: 'manual_invoice / approved_payment_link / provider_link / no_charge_dry_run',
      repo_storage_rule: 'provider/path label only, no full payment URL',
      blank_owner_value: '',
    },
    {
      field_id: 'EVID-05',
      field: 'live_registration_allowed',
      required_before_step: 'WALK-07',
      expected_value_type: 'yes / no',
      repo_storage_rule: 'approval note only',
      blank_owner_value: '',
    },
    {
      field_id: 'EVID-06',
      field: 'controlled_lawyer_profile_or_post_id',
      required_before_step: 'WALK-08',
      expected_value_type: 'wp-admin ID or private evidence location',
      repo_storage_rule: 'ID ok only if owner confirms test record',
      blank_owner_value: '',
    },
    {
      field_id: 'EVID-07',
      field: 'controlled_lawyer_user_login_confirmed',
      required_before_step: 'WALK-10',
      expected_value_type: 'yes / no plus private evidence location',
      repo_storage_rule: 'no password, no email address',
      blank_owner_value: '',
    },
    {
      field_id: 'EVID-08',
      field: 'service_request_ids',
      required_before_step: 'WALK-11',
      expected_value_type: 'payment_link / upgrade / downgrade / cancel / refund / invoice request IDs',
      repo_storage_rule: 'IDs only, no sensitive message body',
      blank_owner_value: '',
    },
    {
      field_id: 'EVID-09',
      field: 'controlled_consented_lead_id',
      required_before_step: 'WALK-12',
      expected_value_type: 'lead ID plus consent/routing hold status',
      repo_storage_rule: 'ID and status only, no client PII',
      blank_owner_value: '',
    },
    {
      field_id: 'EVID-10',
      field: 'invoice_or_payment_reference',
      required_before_step: 'WALK-13',
      expected_value_type: 'invoice reference, payment evidence location or no-charge dry-run note',
      repo_storage_rule: 'reference/location only, no full payment link',
      blank_owner_value: '',
    },
    {
      field_id: 'EVID-11',
      field: 'revenue_counting_decision',
      required_before_step: 'WALK-14',
      expected_value_type: 'count_revenue / do_not_count / blocked',
      repo_storage_rule: 'owner decision and proof summary only',
      blank_owner_value: '',
    },
  ];
}

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
  const base = `lawyer-subscription-controlled-walkthrough-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    evidenceTemplateCsv: path.join(ROOT, '.project-control', `lawyer-subscription-controlled-evidence-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(items, columns = ['id', 'phase', 'action', 'owner_approval', 'evidence_to_capture', 'stop_condition', 'status']) {
  return `${columns.join(',')}\n${items.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n')}\n`;
}

function buildMarkdown(reportDate, rows, evidenceRows) {
  const blocked = rows.filter((row) => row.status.startsWith('blocked')).length;
  const ready = rows.filter((row) => row.status === 'ready').length;

  return [
    `# Lawyer Subscription Controlled Walkthrough - ${reportDate}`,
    '',
    'Status: READY_SCRIPT_WITH_RUNTIME_BLOCKERS',
    '',
    'Purpose: give the owner, Codex and remote team one controlled end-to-end script for lawyer registration, subscription/payment, manual invoice, dashboard, CRM, upgrade/downgrade/cancel/refund and lead-billing proof.',
    '',
    '## Summary',
    '',
    `- Steps: ${rows.length}`,
    `- Ready read-only steps: ${ready}`,
    `- Runtime-blocked live steps: ${blocked}`,
    `- Evidence template rows: ${evidenceRows.length}`,
    '- No live lawyer, client, lead, payment, invoice, email, WhatsApp, TalkTo or CMS/public page action is authorized by this packet alone.',
    '- Real revenue may be counted only after private payment evidence is recorded; invoice/reference alone supports invoice-stage follow-up.',
    '',
    '## Routes And Screens',
    '',
    ...routes.map((route) => `- ${route}`),
    '',
    '## Walkthrough Steps',
    '',
    '| ID | Phase | Action | Approval | Evidence | Stop Condition | Status |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) =>
      [
        row.id,
        row.phase,
        row.action,
        row.owner_approval,
        row.evidence_to_capture,
        row.stop_condition,
        row.status,
      ]
        .map((cell) => String(cell).replace(/\|/g, '/'))
        .join(' | ')
        .replace(/^/, '| ')
        .replace(/$/, ' |')
    ),
    '',
    '## Required Evidence Before Claiming Revenue',
    '',
    '- Controlled lawyer profile/post ID.',
    '- Controlled lawyer user ID/login proof.',
    '- Plan key and payment path.',
    '- Payment provider link or manual invoice reference.',
    '- Transaction/reference proof when a charge is tested.',
    '- Invoice/receipt proof or private evidence URL.',
    '- Service request IDs for payment link, upgrade, downgrade, cancel, refund and invoice.',
    '- Controlled consented lead ID and assigned lawyer ID.',
    '- Qualified lead billing status, invoice reference for invoice-stage follow-up and private payment evidence URL for paid revenue.',
    '',
    '## Evidence Capture Template',
    '',
    `Use \`.project-control/lawyer-subscription-controlled-evidence-template-${reportDate}.csv\` during the owner walkthrough. Keep real emails, phone numbers, payment URLs, passwords and client PII out of repo artifacts; store only IDs, yes/no status and private evidence locations.`,
    '',
    '## After Fill Review',
    '',
    `Run \`tools/review-lawyer-subscription-controlled-evidence.mjs\` against the filled no-PII CSV. Use \`.project-control/lawyer-subscription-controlled-evidence-review-gate-${reportDate}.md\` to see what remains blocked before any live registration, provider action, invoice, payment, dashboard proof, CRM lead proof or revenue claim.`,
    '',
    '## Safety Statement',
    '',
    'This packet writes only dot-private `.project-control` and `.reports` artifacts. It does not publish or update public pages, titles, H1s, meta, redirects, canonicals, noindex, sitemaps, taxonomies, leads, lawyer records, suppliers, products, invoices, payment links, emails, WhatsApp/TalkTo messages, GSC, GA4 or provider settings.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-lawyer-subscription-controlled-walkthrough.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const outputs = outputFiles(args.reportDate);
const rows = buildRows(args.reportDate);
const evidenceTemplateRows = buildEvidenceTemplateRows();
const summary = {
  reportDate: args.reportDate,
  status: 'READY_SCRIPT_WITH_RUNTIME_BLOCKERS',
  stepCount: rows.length,
  readyReadOnlySteps: rows.filter((row) => row.status === 'ready').length,
  blockedRuntimeSteps: rows.filter((row) => row.status.startsWith('blocked')).length,
  evidenceTemplateRows: evidenceTemplateRows.length,
  routes,
  outputs,
};

writeText(outputs.projectMd, buildMarkdown(args.reportDate, rows, evidenceTemplateRows));
writeText(outputs.projectCsv, toCsv(rows));
writeText(outputs.evidenceTemplateCsv, toCsv(evidenceTemplateRows, ['field_id', 'field', 'required_before_step', 'expected_value_type', 'repo_storage_rule', 'blank_owner_value']));
writeText(outputs.reportCsv, toCsv(rows));
writeText(outputs.reportJson, `${JSON.stringify({ summary, rows, evidenceTemplateRows }, null, 2)}\n`);

console.log(JSON.stringify(summary, null, 2));
