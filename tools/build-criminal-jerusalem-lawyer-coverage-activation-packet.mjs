import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const DEFAULT_SOURCE_DATE = DEFAULT_REPORT_DATE;

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    sourceDate: process.env.SOURCE_DATE || DEFAULT_SOURCE_DATE,
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

function outputFiles(reportDate) {
  const base = `criminal-jerusalem-lawyer-coverage-activation-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    ownerTemplateCsv: path.join(ROOT, '.project-control', `criminal-jerusalem-prospect-activation-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function readText(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Missing required source file: ${relativePath}`);
  }
  return readFileSync(fullPath, 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
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

function hasAll(text, needles) {
  return needles.every((needle) => text.includes(needle));
}

function hasAny(text, needles) {
  return needles.some((needle) => text.includes(needle));
}

function normalizeLocalUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url || '';
  }
}

function findAlternative(alternativeRows, option) {
  return alternativeRows.find((row) => row.option === option) || {};
}

function buildSourceSummary(unblockerReport) {
  const blockedRow = (unblockerReport.blockedRows || []).find((row) => row.slug === 'criminal-lawyer-jerusalem')
    || (unblockerReport.blockedRows || [])[0]
    || {};
  const areaAlternative = findAlternative(unblockerReport.alternativeRows || [], 'area_only_directory');
  const cityAlternative = findAlternative(unblockerReport.alternativeRows || [], 'city_only_directory');
  const contactAlternative = findAlternative(unblockerReport.alternativeRows || [], 'contact_form_fallback');

  return {
    slug: blockedRow.slug || 'criminal-lawyer-jerusalem',
    practiceArea: 'criminal-law',
    city: 'jerusalem',
    sourceDirectoryUrl: blockedRow.url || 'https://jus-tice.co.il/lawyers/?city=jerusalem&area=criminal-law',
    sourceDirectoryPath: normalizeLocalUrl(blockedRow.url || 'https://jus-tice.co.il/lawyers/?city=jerusalem&area=criminal-law'),
    exactCardCount: Number(blockedRow.lawyer_card_count ?? 0),
    exactGate: blockedRow.gate || '',
    areaOnlyPath: areaAlternative.path || normalizeLocalUrl(areaAlternative.url),
    areaOnlyCardCount: Number(areaAlternative.lawyer_card_count ?? 0),
    cityOnlyPath: cityAlternative.path || normalizeLocalUrl(cityAlternative.url),
    cityOnlyCardCount: Number(cityAlternative.lawyer_card_count ?? 0),
    contactPath: contactAlternative.path || normalizeLocalUrl(contactAlternative.url),
    contactStatus: contactAlternative.status || '',
    unblockerStatus: unblockerReport.status || '',
  };
}

function buildGateRows({ sourceSummary, prospectsSource, crmSource, sourceReportExists }) {
  const prospectCptPrivate = hasAll(prospectsSource, [
    'register_post_type',
    "'justice_prospect'",
    "'public'          => false",
    "'show_in_rest'    => false",
  ]);
  const prospectAdminOnly = hasAll(prospectsSource, ["'show_ui'         => true", "'show_in_menu'    => 'justice-lawyer-onboarding'"]);
  const requiredFields = [
    'prospect_firm_name',
    'prospect_practice_area',
    'prospect_city',
    'prospect_target_plan',
    'prospect_priority',
    'prospect_outreach_status',
    'prospect_response_fit',
    'prospect_contact_name',
    'prospect_contact_email',
    'prospect_contact_phone',
    'prospect_source_url',
    'prospect_demand_signal',
    'prospect_next_action_at',
    'prospect_expected_monthly_nis',
    'prospect_agreed_lead_fee_ils',
    'prospect_billing_contact_email',
    'prospect_lead_fee_terms_ready',
    'prospect_terms_note',
    'prospect_owner_note',
    'prospect_license_verified',
    'prospect_specialty_verified',
    'prospect_payment_path_ready',
    'prospect_verification_note',
  ];
  const prospectFieldsReady = hasAll(prospectsSource, requiredFields);
  const verificationRulesReady = hasAll(prospectsSource, [
    'justice_theme_lawyer_prospect_verification_missing',
    'prospect_license_verified',
    'prospect_specialty_verified',
    'within_15_min',
    'same_day',
    'prospect_payment_path_ready',
    'prospect_lead_fee_terms_ready',
    'prospect_agreed_lead_fee_ils',
    'prospect_billing_contact_email',
  ]);
  const ownerSalesQueueReady = hasAll(crmSource, [
    'justice_theme_crm_render_lawyer_sales_pipeline',
    'edit.php?post_type=justice_prospect',
    'post-new.php?post_type=justice_prospect',
  ]) && hasAny(crmSource, ['owner sales queue, not a public listing', 'Track lawyers to contact for paid coverage']);
  const sourceCoverageBlocked = sourceSummary.unblockerStatus === 'DIRECTORY_COVERAGE_UNBLOCKER_READY_NO_PUBLIC_CHANGE'
    && sourceSummary.exactCardCount === 0
    && sourceSummary.areaOnlyCardCount === 0
    && sourceSummary.cityOnlyCardCount > 0;

  return [
    {
      row_type: 'gate',
      id: 'CJLA-GATE-01',
      gate: 'source_unblocker_available',
      status: sourceReportExists && sourceSummary.unblockerStatus ? 'PASS' : 'BLOCKED',
      evidence: `Source unblocker status: ${sourceSummary.unblockerStatus || 'missing'}.`,
      next_action: 'Use the source blocker as private evidence only; do not publish from it.',
    },
    {
      row_type: 'gate',
      id: 'CJLA-GATE-02',
      gate: 'criminal_jerusalem_exact_coverage_missing',
      status: sourceCoverageBlocked ? 'PASS' : 'REVIEW',
      evidence: `Exact criminal+Jerusalem card count ${sourceSummary.exactCardCount}; area-only criminal ${sourceSummary.areaOnlyCardCount}; city-only Jerusalem ${sourceSummary.cityOnlyCardCount}.`,
      next_action: sourceCoverageBlocked
        ? 'Treat private matching-lawyer coverage as the safest unblocker.'
        : 'Review the source report before using this packet.',
    },
    {
      row_type: 'gate',
      id: 'CJLA-GATE-03',
      gate: 'prospect_cpt_private_admin_only',
      status: prospectCptPrivate && prospectAdminOnly ? 'PASS' : 'BLOCKED',
      evidence: prospectCptPrivate && prospectAdminOnly
        ? 'justice_prospect is non-public, hidden from REST and available in the owner onboarding menu.'
        : 'Could not prove justice_prospect is private/admin-only.',
      next_action: 'Use wp-admin prospect entry only; do not create public lawyer cards from this packet.',
    },
    {
      row_type: 'gate',
      id: 'CJLA-GATE-04',
      gate: 'prospect_fields_ready',
      status: prospectFieldsReady ? 'PASS' : 'BLOCKED',
      evidence: prospectFieldsReady
        ? `${requiredFields.length} prospect fields needed for coverage activation are registered.`
        : 'One or more expected prospect fields are missing.',
      next_action: 'Fill only owner-known, no-PII fields in the private CSV/template before any live entry.',
    },
    {
      row_type: 'gate',
      id: 'CJLA-GATE-05',
      gate: 'verification_rules_ready',
      status: verificationRulesReady ? 'PASS' : 'BLOCKED',
      evidence: verificationRulesReady
        ? 'Verification helper checks license, specialty, response fit, payment path, terms, fee and billing contact.'
        : 'Could not prove prospect verification helper covers all required readiness checks.',
      next_action: 'Do not mark a prospect routable until these fields are complete in wp-admin.',
    },
    {
      row_type: 'gate',
      id: 'CJLA-GATE-06',
      gate: 'owner_sales_queue_ready',
      status: ownerSalesQueueReady ? 'PASS' : 'REVIEW',
      evidence: ownerSalesQueueReady
        ? 'Lead CRM exposes Lawyer Prospects as the owner sales queue, not a public listing.'
        : 'Could not prove the CRM dashboard links to the prospect queue.',
      next_action: 'Use the owner queue for paid-coverage follow-up after owner approval.',
    },
    {
      row_type: 'gate',
      id: 'CJLA-GATE-07',
      gate: 'no_live_action_authorized',
      status: 'PASS',
      evidence: 'This packet approves 0 CMS writes, public changes, CRM records, contacts, routing, invoices, payments, emails, WhatsApp, TalkTo or uPress actions.',
      next_action: 'Keep this as a preparation artifact until the owner explicitly approves private live entry.',
    },
  ];
}

function buildActivationRows(sourceSummary) {
  const evidence = [
    `Exact directory ${sourceSummary.sourceDirectoryPath} has ${sourceSummary.exactCardCount} lawyer cards.`,
    `Area-only criminal directory ${sourceSummary.areaOnlyPath || '/lawyers/?area=criminal-law'} has ${sourceSummary.areaOnlyCardCount} lawyer cards.`,
    `City-only Jerusalem directory ${sourceSummary.cityOnlyPath || '/lawyers/?city=jerusalem'} has ${sourceSummary.cityOnlyCardCount} lawyer cards but is not criminal-specific.`,
    `Contact fallback ${sourceSummary.contactPath || '/contact/?area=criminal-law&city=jerusalem'} is review-only.`,
  ].join(' ');

  return [
    {
      row_type: 'activation',
      id: 'CJ-COVERAGE-01',
      stage: 'private_prospect_entry',
      owner_action: 'Create or verify one private Lawyer Prospect for criminal-law in jerusalem.',
      wp_admin_field: 'prospect_practice_area, prospect_city, prospect_target_plan, prospect_priority, prospect_outreach_status, prospect_source_url, prospect_demand_signal',
      recommended_value: 'criminal-law | jerusalem | lead_partner | hot | research | /lawyers/?city=jerusalem&area=criminal-law | exact directory has 0 lawyer cards',
      evidence,
      completion_rule: 'Private prospect row exists in wp-admin or owner template; no public profile/card is created from this packet.',
      forbidden_without_approval: 'Do not create or publish a public lawyer card.',
    },
    {
      row_type: 'activation',
      id: 'CJ-COVERAGE-02',
      stage: 'license_check',
      owner_action: 'Verify Israeli Bar/license status from an owner-approved source.',
      wp_admin_field: 'prospect_license_verified, prospect_verification_note',
      recommended_value: '1 only after owner/admin verification; note private source/date.',
      evidence: 'Required by justice_theme_lawyer_prospect_verification_missing().',
      completion_rule: 'License checkbox is 1 and note identifies the private verification evidence.',
      forbidden_without_approval: 'Do not infer license status from marketing copy alone.',
    },
    {
      row_type: 'activation',
      id: 'CJ-COVERAGE-03',
      stage: 'specialty_fit',
      owner_action: 'Verify real criminal-law fit and Jerusalem service coverage.',
      wp_admin_field: 'prospect_specialty_verified, prospect_owner_note',
      recommended_value: '1 only after human review; note criminal-law plus Jerusalem coverage.',
      evidence: 'Exact directory coverage is blocked until a matching lawyer exists.',
      completion_rule: 'Specialty checkbox is 1 and owner note explains why this prospect fits criminal-law/Jerusalem.',
      forbidden_without_approval: 'Do not mark a general Jerusalem lawyer as criminal-law coverage without evidence.',
    },
    {
      row_type: 'activation',
      id: 'CJ-COVERAGE-04',
      stage: 'response_fit',
      owner_action: 'Record response readiness for paid lead handling.',
      wp_admin_field: 'prospect_response_fit',
      recommended_value: 'within_15_min or same_day',
      evidence: 'Verification helper accepts only within_15_min or same_day for readiness.',
      completion_rule: 'Response fit is one of the accepted values.',
      forbidden_without_approval: 'Do not route urgent criminal-law leads to a prospect with unknown response fit.',
    },
    {
      row_type: 'activation',
      id: 'CJ-COVERAGE-05',
      stage: 'payment_terms',
      owner_action: 'Record manual payment path and agreed qualified-lead fee terms.',
      wp_admin_field: 'prospect_payment_path_ready, prospect_lead_fee_terms_ready, prospect_agreed_lead_fee_ils, prospect_terms_note',
      recommended_value: '1 | 1 | owner-filled numeric fee | manual invoice/payment terms note',
      evidence: 'Grow/Meshulam automated payment remains blocked; manual invoice fallback requires explicit terms and fee evidence.',
      completion_rule: 'Payment path and terms are 1, agreed lead fee is greater than 0, and terms note is complete.',
      forbidden_without_approval: 'Do not invoice, mark paid, or claim revenue from this packet.',
    },
    {
      row_type: 'activation',
      id: 'CJ-COVERAGE-06',
      stage: 'billing_contact',
      owner_action: 'Record billing contact email only after owner/admin has permission to store it.',
      wp_admin_field: 'prospect_billing_contact_email',
      recommended_value: 'owner-filled valid email',
      evidence: 'Verification helper blocks readiness without a valid billing email.',
      completion_rule: 'Billing contact email is valid and owner-approved for private storage.',
      forbidden_without_approval: 'Do not place personal email addresses in repo artifacts.',
    },
    {
      row_type: 'activation',
      id: 'CJ-COVERAGE-07',
      stage: 'routable_profile_review',
      owner_action: 'Only after the private prospect is ready, prepare a separate fact-gated public lawyer-card/profile review.',
      wp_admin_field: 'separate owner-approved profile/profile-card workflow',
      recommended_value: 'not approved by this packet',
      evidence: 'justice_prospect is private/admin-only; directory cards require separate public profile readiness.',
      completion_rule: 'Separate owner approval exists and public-card facts are reviewed before any CMS/public record action.',
      forbidden_without_approval: 'Do not convert a private prospect into a public routable lawyer profile.',
    },
    {
      row_type: 'activation',
      id: 'CJ-COVERAGE-08',
      stage: 'coverage_gate_rerun',
      owner_action: 'After owner-approved private/profile work, rerun the city/practice coverage gate.',
      wp_admin_field: 'repo-local verification only',
      recommended_value: 'node tools/build-city-practice-priority-draft-briefs.mjs --reportDate=YYYY-MM-DD',
      evidence: 'The source blocker was produced by the city/practice coverage gate.',
      completion_rule: 'Exact criminal+Jerusalem directory has at least one matching lawyer card before public draft/link reliance.',
      forbidden_without_approval: 'Do not use broader city or contact fallback publicly from this packet alone.',
    },
  ];
}

function buildOwnerTemplateRows(sourceSummary) {
  return [
    {
      row_type: 'owner_template',
      template_id: 'CJ-PROSPECT-TEMPLATE-01',
      prospect_title: '',
      prospect_firm_name: '',
      prospect_practice_area: 'criminal-law',
      prospect_city: 'jerusalem',
      prospect_target_plan: 'lead_partner',
      prospect_priority: 'hot',
      prospect_outreach_status: 'research',
      prospect_response_fit: '',
      prospect_contact_name: '',
      prospect_contact_email: '',
      prospect_contact_phone: '',
      prospect_source_url: sourceSummary.sourceDirectoryPath,
      prospect_demand_signal: 'Exact criminal-law/Jerusalem directory has 0 lawyer cards; city-only Jerusalem has coverage but is not criminal-specific.',
      prospect_expected_monthly_nis: '',
      prospect_agreed_lead_fee_ils: '',
      prospect_billing_contact_email: '',
      prospect_lead_fee_terms_ready: '',
      prospect_license_verified: '',
      prospect_specialty_verified: '',
      prospect_payment_path_ready: '',
      prospect_terms_note: '',
      prospect_owner_note: '',
      prospect_verification_note: '',
      private_entry_ready: 'no',
      forbidden_without_fresh_approval: 'No public profile/card, contact, routing, invoice, payment, email, WhatsApp, TalkTo or uPress action.',
    },
  ];
}

function buildMarkdown({ reportDate, sourceDate, status, sourceSummary, gateRows, activationRows, ownerTemplateRows }) {
  return [
    `# Criminal Jerusalem Lawyer Coverage Activation Packet - ${reportDate}`,
    '',
    `Status: ${status}`,
    `Source date: ${sourceDate}`,
    '',
    'Scope: private owner/admin activation worksheet for the criminal-law/Jerusalem directory coverage gap. This packet does not create WordPress records, publish a lawyer profile, contact anyone, route a lead, invoice, take payment, send email/WhatsApp/TalkTo, change SEO settings or deploy.',
    '',
    '## Source Blocker',
    '',
    `- Exact directory: ${sourceSummary.sourceDirectoryPath}`,
    `- Exact lawyer cards: ${sourceSummary.exactCardCount}`,
    `- Area-only criminal cards: ${sourceSummary.areaOnlyCardCount}`,
    `- City-only Jerusalem cards: ${sourceSummary.cityOnlyCardCount} (review-only; not criminal-specific)`,
    `- Contact fallback status: ${sourceSummary.contactStatus || 'not checked'} (review-only)`,
    '',
    '## Gates',
    '',
    '| ID | Gate | Status | Evidence | Next Action |',
    '| --- | --- | --- | --- | --- |',
    ...gateRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.gate)} | ${mdCell(row.status)} | ${mdCell(row.evidence)} | ${mdCell(row.next_action)} |`,
    ),
    '',
    '## Activation Checklist',
    '',
    '| ID | Stage | Owner Action | WP Admin Field | Recommended Value | Completion Rule | Forbidden Without Approval |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...activationRows.map(
      (row) =>
        `| ${mdCell(row.id)} | ${mdCell(row.stage)} | ${mdCell(row.owner_action)} | ${mdCell(row.wp_admin_field)} | ${mdCell(row.recommended_value)} | ${mdCell(row.completion_rule)} | ${mdCell(row.forbidden_without_approval)} |`,
    ),
    '',
    '## Owner Template',
    '',
    '| Template ID | Practice | City | Plan | Priority | Status | Source URL | Demand Signal | Private Entry Ready | Forbidden Without Fresh Approval |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...ownerTemplateRows.map(
      (row) =>
        `| ${mdCell(row.template_id)} | ${mdCell(row.prospect_practice_area)} | ${mdCell(row.prospect_city)} | ${mdCell(row.prospect_target_plan)} | ${mdCell(row.prospect_priority)} | ${mdCell(row.prospect_outreach_status)} | ${mdCell(row.prospect_source_url)} | ${mdCell(row.prospect_demand_signal)} | ${mdCell(row.private_entry_ready)} | ${mdCell(row.forbidden_without_fresh_approval)} |`,
    ),
    '',
    '## Review',
    '',
    'The concrete next step is not a public content edit. It is a private owner/admin coverage activation step: identify one real criminal-law lawyer who serves Jerusalem, verify license/specialty/response fit/payment terms/billing contact in the private prospect flow, then rerun the directory coverage gate. Only after exact coverage exists should a public draft, internal link, or lawyer-card/profile workflow be considered.',
    '',
  ].join('\n');
}

function printHelp() {
  console.log('Usage: node tools/build-criminal-jerusalem-lawyer-coverage-activation-packet.mjs [--reportDate=YYYY-MM-DD] [--sourceDate=YYYY-MM-DD]');
}

function main() {
  const args = parseArgs();
  if (args.help) {
    printHelp();
    return;
  }

  const files = outputFiles(args.reportDate);
  const sourcePath = `.reports/city-practice-directory-coverage-unblocker-${args.sourceDate}.json`;
  const sourceReportExists = existsSync(path.join(ROOT, sourcePath));
  const unblockerReport = readJson(sourcePath);
  const sourceSummary = buildSourceSummary(unblockerReport);
  const prospectsSource = readText('inc/lawyer-prospects.php');
  const crmSource = readText('inc/lead-crm.php');
  const gateRows = buildGateRows({ sourceSummary, prospectsSource, crmSource, sourceReportExists });
  const activationRows = buildActivationRows(sourceSummary);
  const ownerTemplateRows = buildOwnerTemplateRows(sourceSummary);
  const blockedGateCount = gateRows.filter((row) => row.status === 'BLOCKED').length;
  const reviewGateCount = gateRows.filter((row) => row.status === 'REVIEW').length;
  const status = blockedGateCount
    ? 'CRIMINAL_JERUSALEM_COVERAGE_ACTIVATION_BLOCKED_NO_LIVE_ACTION'
    : reviewGateCount
      ? 'CRIMINAL_JERUSALEM_COVERAGE_ACTIVATION_READY_WITH_REVIEW_NO_LIVE_ACTION'
      : 'CRIMINAL_JERUSALEM_COVERAGE_ACTIVATION_PACKET_READY_NO_LIVE_ACTION';

  const report = {
    reportDate: args.reportDate,
    sourceDate: args.sourceDate,
    status,
    sourceStatus: unblockerReport.status,
    sourcePath,
    sourceSummary,
    gateCount: gateRows.length,
    activationRowCount: activationRows.length,
    ownerTemplateRowCount: ownerTemplateRows.length,
    passGateCount: gateRows.filter((row) => row.status === 'PASS').length,
    reviewGateCount,
    blockedGateCount,
    publicChangesApproved: 0,
    cmsWritesApproved: 0,
    seoSettingsChanged: 0,
    crmRecordsCreated: 0,
    lawyerProfilesCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailsSent: 0,
    whatsAppOrTalkToActions: 0,
    upressDeploymentRequired: false,
    gates: gateRows,
    activationRows,
    ownerTemplateRows,
    files: Object.fromEntries(Object.entries(files).map(([key, value]) => [key, path.relative(ROOT, value).replace(/\\/g, '/')])),
  };

  writeText(files.projectMd, buildMarkdown({ reportDate: args.reportDate, sourceDate: args.sourceDate, status, sourceSummary, gateRows, activationRows, ownerTemplateRows }));
  writeText(
    files.projectCsv,
    toCsv([...gateRows, ...activationRows], [
      'row_type',
      'id',
      'gate',
      'status',
      'stage',
      'owner_action',
      'wp_admin_field',
      'recommended_value',
      'evidence',
      'completion_rule',
      'next_action',
      'forbidden_without_approval',
    ]),
  );
  writeText(
    files.ownerTemplateCsv,
    toCsv(ownerTemplateRows, [
      'row_type',
      'template_id',
      'prospect_title',
      'prospect_firm_name',
      'prospect_practice_area',
      'prospect_city',
      'prospect_target_plan',
      'prospect_priority',
      'prospect_outreach_status',
      'prospect_response_fit',
      'prospect_contact_name',
      'prospect_contact_email',
      'prospect_contact_phone',
      'prospect_source_url',
      'prospect_demand_signal',
      'prospect_expected_monthly_nis',
      'prospect_agreed_lead_fee_ils',
      'prospect_billing_contact_email',
      'prospect_lead_fee_terms_ready',
      'prospect_license_verified',
      'prospect_specialty_verified',
      'prospect_payment_path_ready',
      'prospect_terms_note',
      'prospect_owner_note',
      'prospect_verification_note',
      'private_entry_ready',
      'forbidden_without_fresh_approval',
    ]),
  );
  writeText(files.reportJson, `${JSON.stringify(report, null, 2)}\n`);
  writeText(
    files.reportCsv,
    toCsv([...gateRows, ...activationRows, ...ownerTemplateRows], [
      'row_type',
      'id',
      'template_id',
      'gate',
      'status',
      'stage',
      'owner_action',
      'wp_admin_field',
      'recommended_value',
      'evidence',
      'completion_rule',
      'next_action',
      'prospect_practice_area',
      'prospect_city',
      'prospect_target_plan',
      'prospect_priority',
      'prospect_outreach_status',
      'prospect_source_url',
      'prospect_demand_signal',
      'private_entry_ready',
      'forbidden_without_approval',
      'forbidden_without_fresh_approval',
    ]),
  );

  console.log(
    JSON.stringify(
      {
        reportDate: report.reportDate,
        sourceDate: report.sourceDate,
        status: report.status,
        sourceStatus: report.sourceStatus,
        exactCardCount: report.sourceSummary.exactCardCount,
        areaOnlyCardCount: report.sourceSummary.areaOnlyCardCount,
        cityOnlyCardCount: report.sourceSummary.cityOnlyCardCount,
        gateCount: report.gateCount,
        activationRowCount: report.activationRowCount,
        ownerTemplateRowCount: report.ownerTemplateRowCount,
        passGateCount: report.passGateCount,
        reviewGateCount: report.reviewGateCount,
        blockedGateCount: report.blockedGateCount,
        publicChangesApproved: report.publicChangesApproved,
        cmsWritesApproved: report.cmsWritesApproved,
        crmRecordsCreated: report.crmRecordsCreated,
        lawyerProfilesCreated: report.lawyerProfilesCreated,
        invoicesOrPaymentsCreated: report.invoicesOrPaymentsCreated,
        emailsSent: report.emailsSent,
        upressDeploymentRequired: report.upressDeploymentRequired,
        files: report.files,
      },
      null,
      2,
    ),
  );
}

main();
