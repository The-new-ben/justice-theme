import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');

const CANONICAL_AREAS = [
  'family-law',
  'criminal-law',
  'real-estate-law',
  'medical-malpractice-law',
  'personal-injury-law',
  'traffic-law',
  'labor-law',
  'inheritance-law',
  'thailand-law',
  'general',
];

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || new Date().toISOString().slice(0, 10),
  };

  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  });

  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.reportDate)) {
    throw new Error('--reportDate must be YYYY-MM-DD');
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `lead-area-vocabulary-safety-${reportDate}`;
  return {
    reportCsv: path.join(ROOT, 'reports', `${base}.csv`),
    reportJson: path.join(ROOT, 'reports', `${base}.json`),
    projectCsv: path.join(ROOT, 'project-control', `${base}.csv`),
    projectMd: path.join(ROOT, 'project-control', `${base}.md`),
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasMapEntry(source, key, value) {
  const pattern = new RegExp(`'${escapeRegex(key)}'\\s*=>\\s*'${escapeRegex(value)}'`);
  return pattern.test(source);
}

function hasAll(source, values) {
  return values.every((value) => source.includes(value));
}

function check(id, scope, risk, ok, evidence, nextStep) {
  return {
    check_id: id,
    scope,
    status: ok ? 'VERIFIED' : 'BLOCKED',
    risk,
    evidence,
    next_step: ok ? 'Keep as controlled lead-area vocabulary baseline.' : nextStep,
  };
}

function formHasHardcodedAreaOptions(source) {
  return CANONICAL_AREAS.some((area) => new RegExp(`<option\\s+value=["']${escapeRegex(area)}["']`).test(source));
}

function markdownReport(rows, reportDate) {
  const blocked = rows.filter((row) => row.status !== 'VERIFIED');
  const header = [
    `# Lead Area Vocabulary Safety - ${reportDate}`,
    '',
    `Status: ${blocked.length === 0 ? 'VERIFIED' : 'BLOCKED'}`,
    '',
    'Scope: repo-local static verification for public lead-area vocabulary, validation, classifier aliases, CRM labels, routing fallback, and public form rendering.',
    '',
    'This check prevents public lead forms from drifting away from the accepted lead_area values used by lead validation, classifier normalization, CRM display, and lawyer routing.',
    '',
    '## Results',
    '',
    '| Check | Status | Risk | Evidence |',
    '| --- | --- | --- | --- |',
  ];

  const table = rows.map(
    (row) => `| ${row.check_id} | ${row.status} | ${row.risk} | ${row.evidence.replace(/\|/g, '/') || '-'} |`
  );

  const footer = [
    '',
    '## Upload Notes',
    '',
    '- FIXED: public lead-area options now have one canonical renderer and one accepted-value source.',
    '- VERIFIED: both lead forms call the shared renderer instead of owning separate legal-area option blocks.',
    '- VERIFIED: legacy aliases still normalize into the canonical routing slugs before CRM/routing usage.',
    '- NOT VERIFIED LIVE: submit a controlled lead after deployment and verify legal_area, ai_detected_area, CRM label, and assigned-lawyer routing.',
    '- BLOCKED: no wp-admin, database, email, uPress, GSC, redirect plugin, or public production action was performed by this repo-local check.',
    '',
  ];

  return [...header, ...table, ...footer].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/check-lead-area-vocabulary-safety.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const files = {
  functions: readFileSync(path.join(ROOT, 'functions.php'), 'utf8'),
  spamGuard: readFileSync(path.join(ROOT, 'inc', 'lead-spam-guard.php'), 'utf8'),
  classifier: readFileSync(path.join(ROOT, 'inc', 'lead-classifier.php'), 'utf8'),
  crm: readFileSync(path.join(ROOT, 'inc', 'lead-crm.php'), 'utf8'),
  routing: readFileSync(path.join(ROOT, 'inc', 'lead-routing.php'), 'utf8'),
  leadForm: readFileSync(path.join(ROOT, 'template-parts', 'forms', 'lead-form.php'), 'utf8'),
  askLawyer: readFileSync(path.join(ROOT, 'template-parts', 'sections', 'ask-lawyer.php'), 'utf8'),
  intentPyramid: readFileSync(path.join(ROOT, 'template-parts', 'sections', 'homepage-intent-pyramid.php'), 'utf8'),
};

const includeOrder = [
  "'inc/lead-spam-guard.php'",
  "'inc/lead-ui.php'",
  "'inc/lead-crm.php'",
  "'inc/lead-classifier.php'",
  "'inc/lead-routing.php'",
].map((needle) => files.functions.indexOf(needle));

const aliasChecks = [
  ['family', 'family-law'],
  ['criminal', 'criminal-law'],
  ['real_estate', 'real-estate-law'],
  ['medical_malpractice', 'medical-malpractice-law'],
  ['medical-malpractice', 'medical-malpractice-law'],
  ['inheritance', 'inheritance-law'],
  ['torts', 'personal-injury-law'],
  ['other', 'general'],
];

const leadFormUsesSharedRenderer =
  files.leadForm.includes('justice_theme_render_lead_area_options( $lead_prefill_area )') &&
  !formHasHardcodedAreaOptions(files.leadForm);

const askLawyerUsesSharedRenderer =
  files.askLawyer.includes("justice_theme_render_lead_area_options( $lead_prefill_area, __( 'בחרו תחום', 'justice-theme' ) )") &&
  !formHasHardcodedAreaOptions(files.askLawyer);

const rows = [
  check(
    'LEAD-AREA-CANONICAL-OPTIONS',
    'lead_area_vocabulary',
    'CRITICAL',
    files.spamGuard.includes('function justice_theme_lead_area_options(): array') && hasAll(files.spamGuard, CANONICAL_AREAS),
    'Canonical public lead-area option helper exists with all accepted commercial/legal area slugs.',
    'Add justice_theme_lead_area_options() and include every accepted public lead_area slug.'
  ),
  check(
    'LEAD-AREA-VALUES-DERIVED',
    'lead_area_validation',
    'CRITICAL',
    files.spamGuard.includes('return array_keys( justice_theme_lead_area_options() );'),
    'Accepted public lead_area values are derived from canonical option keys.',
    'Make justice_theme_lead_area_values() derive from justice_theme_lead_area_options().'
  ),
  check(
    'LEAD-AREA-RENDERER',
    'lead_area_forms',
    'HIGH',
    files.spamGuard.includes('function justice_theme_render_lead_area_options( string $selected = \'\', string $placeholder = \'\' ): void') &&
      files.spamGuard.includes('foreach ( justice_theme_lead_area_options() as $area_value => $area_label )'),
    'Shared select-option renderer loops over canonical lead-area options.',
    'Add a shared renderer and use it in every public lead_area select.'
  ),
  check(
    'LEAD-AREA-ASK-FORM',
    'ask_lawyer_form',
    'HIGH',
    askLawyerUsesSharedRenderer,
    'Ask-lawyer form uses the shared lead-area renderer and has no hardcoded legal-area options.',
    'Replace the ask-lawyer hardcoded lead_area options with justice_theme_render_lead_area_options().'
  ),
  check(
    'LEAD-AREA-GLOBAL-FORM',
    'lead_form_template',
    'HIGH',
    leadFormUsesSharedRenderer,
    'Reusable lead form uses the shared lead-area renderer and has no hardcoded legal-area options.',
    'Replace the reusable lead form hardcoded lead_area options with justice_theme_render_lead_area_options().'
  ),
  check(
    'LEAD-AREA-INCLUDE-ORDER',
    'theme_bootstrap',
    'HIGH',
    includeOrder.every((index) => index >= 0) && includeOrder.every((index, position, all) => position === 0 || all[position - 1] < index),
    'Lead spam guard loads before lead UI, CRM, classifier, and routing files.',
    'Load inc/lead-spam-guard.php before templates or handlers can call the shared lead-area helpers.'
  ),
  check(
    'LEAD-AREA-NORMALIZER-ALIASES',
    'lead_classifier',
    'CRITICAL',
    aliasChecks.every(([key, value]) => hasMapEntry(files.classifier, key, value)),
    'Legacy and shorthand lead_area aliases normalize into canonical routing slugs.',
    'Restore legacy alias mapping in justice_theme_normalize_lead_area().'
  ),
  check(
    'LEAD-AREA-LABELS',
    'lead_crm_display',
    'HIGH',
    CANONICAL_AREAS.every((area) => files.classifier.includes(`'${area}'`)) &&
      files.classifier.includes('function justice_theme_lead_area_label( string $area ): string'),
    'CRM/display label helper covers canonical public lead-area slugs.',
    'Ensure justice_theme_lead_area_label() labels every canonical public lead_area value.'
  ),
  check(
    'LEAD-AREA-ROUTING-FALLBACK',
    'lead_routing',
    'CRITICAL',
    files.routing.includes("get_post_meta( $post_id, 'ai_detected_area', true )") &&
      files.routing.includes("?: get_post_meta( $post_id, 'legal_area', true )") &&
      files.routing.includes('justice_theme_find_routing_lawyers( $area )'),
    'Lead routing prefers AI-detected area, falls back to legal_area, and searches lawyers by area.',
    'Preserve area fallback and lawyer lookup in lead routing.'
  ),
  check(
    'LEAD-AREA-CRM-FALLBACK',
    'lead_crm',
    'HIGH',
    files.crm.includes("get_post_meta( $post_id, 'ai_detected_area', true ) ?: get_post_meta( $post_id, 'legal_area', true ) ?: get_post_meta( $post_id, 'lead_area', true )") &&
      files.crm.includes('justice_theme_lead_area_label'),
    'CRM display falls back through ai_detected_area, legal_area, lead_area and formats through the label helper.',
    'Preserve CRM fallback order and label formatting for lead-area display.'
  ),
  check(
    'LEAD-AREA-HOMEPAGE-INTENT',
    'homepage_intent_links',
    'MEDIUM',
    ['family-law', 'criminal-law', 'real-estate-law', 'medical-malpractice-law', 'personal-injury-law', 'labor-law'].every(
      (area) => files.intentPyramid.includes(`'slug'        => '${area}'`) && files.intentPyramid.includes(`/lawyers/?area=${area}`)
    ),
    'Homepage intent cards use canonical lead-area slugs in lawyer-directory links.',
    'Keep homepage intent area params aligned with canonical lead-area vocabulary.'
  ),
];

const blockedRows = rows.filter((row) => row.status !== 'VERIFIED');
const outputs = outputFiles(args.reportDate);
const columns = ['check_id', 'scope', 'status', 'risk', 'evidence', 'next_step'];
const csv = toCsv(rows, columns);

writeText(outputs.reportCsv, csv);
writeText(outputs.projectCsv, csv);
writeText(outputs.reportJson, JSON.stringify(rows, null, 2) + '\n');
writeText(outputs.projectMd, markdownReport(rows, args.reportDate));

console.table(rows.map(({ check_id, status, risk }) => ({ check_id, status, risk })));
console.log(`Lead area vocabulary safety: ${rows.length - blockedRows.length}/${rows.length} VERIFIED`);
console.log(`Wrote ${path.relative(ROOT, outputs.projectMd)} and ${path.relative(ROOT, outputs.reportCsv)}`);

if (blockedRows.length > 0) {
  process.exitCode = 1;
}
