import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);

const sourceFiles = {
  crm: path.join(ROOT, 'inc', 'lead-crm.php'),
  router: path.join(ROOT, 'inc', 'lead-routing.php'),
  runbookJson: path.join(ROOT, '.reports', `whatsapp-talkto-paid-handoff-runbook-${DEFAULT_REPORT_DATE}.json`),
};

const sourceReferences = [
  {
    id: 'SRC-IL-COMMS-30A',
    title: 'Knesset: Communications Law amendment, section 30A',
    url: 'https://fs.knesset.gov.il/17/law/17_lsr_299991.pdf',
    relevance: 'Commercial messages generally require explicit prior consent, include sender identity/contact details and allow refusal/opt-out.',
  },
  {
    id: 'SRC-PPA-DB-REG',
    title: 'Israel Privacy Protection Authority: database registration after Amendment 13',
    url: 'https://www.gov.il/he/service/registration_in_the_database',
    relevance: 'Personal-data databases remain subject to privacy, purpose limitation, confidentiality, data-security and data-subject-right duties even when registration is not required.',
  },
  {
    id: 'SRC-PPA-DATA-MIN',
    title: 'Israel Privacy Protection Authority: data minimization public guidance',
    url: 'https://www.gov.il/BlobFolder/rfp/data_minimization_public_hearing/he/data_minimization_public_hearing.pdf',
    relevance: 'Consent and privacy notices should be clear, direct, accessible and tied to the purpose of collection/use.',
  },
];

const rows = [
  {
    id: 'CLIENT-FRESH-01',
    audience: 'client',
    scenario: 'fresh inbound WhatsApp or TalkTo message',
    consent_state: 'fresh_inbound_needs_details',
    status: 'READY_FOR_OWNER_LEGAL_REVIEW',
    hebrew_template: 'שלום, קיבלנו את הפנייה שלך דרך Jus-Tice. כדי להבין אם אפשר לעזור, אפשר לכתוב בקצרה מה הנושא ומה העיר/האזור? אם תרצה/י שנבדוק התאמה לעורך דין או ספק מתאים, כתוב/כתבי במפורש: "אני מאשר/ת להעביר את הפרטים שלי לצורך התאמה".',
    crm_update_if_sent: 'Keep routing_hold=1; keep consent_status=fresh_inbound_needs_details until explicit wording is received.',
    allowed_use: 'Reply to a current inbound lead that asked for help and needs details/permission clarification.',
    blocked_use: 'Do not send as a bulk message; do not release PII to a partner from this message alone.',
    stop_rule: 'If the person says no, stop and set consent_status=do_not_contact.',
  },
  {
    id: 'CLIENT-FRESH-02',
    audience: 'client',
    scenario: 'fresh inbound gave problem but not match permission',
    consent_state: 'fresh_inbound_needs_details',
    status: 'READY_FOR_OWNER_LEGAL_REVIEW',
    hebrew_template: 'תודה. לפני שנעביר פרטים לגורם מתאים, נצטרך אישור מפורש ממך. אם את/ה מסכים/ה שנעביר שם, טלפון ותיאור קצר של הפנייה לצורך התאמה, השב/י: "מאשר/ת התאמה". אפשר גם לבקש שלא נעביר פרטים.',
    crm_update_if_sent: 'Move to explicit_match_consent only after the user replies with clear affirmative wording.',
    allowed_use: 'Clarify matching permission after a current user provided case context.',
    blocked_use: 'Do not treat silence, emoji, missed call, or button click as match permission.',
    stop_rule: 'If permission is unclear, keep routing_hold=1 and do not preview PII.',
  },
  {
    id: 'CLIENT-LEGACY-01',
    audience: 'client',
    scenario: 'old untreated WhatsApp or TalkTo lead',
    consent_state: 'legacy_needs_repermission',
    status: 'BLOCKED_LEGAL_OWNER_APPROVAL_BEFORE_SENDING',
    hebrew_template: 'שלום, בעבר פנית ל-Jus-Tice בנושא משפטי. אם זה עדיין רלוונטי וברצונך שנבדוק אפשרות התאמה לעורך דין או ספק מתאים, השב/י "מאשר/ת התאמה". אם אינך מעוניין/ת שנפנה שוב, השב/י "הסר".',
    crm_update_if_sent: 'Use only after owner/legal approval; keep routing_hold=1 until affirmative re-permission is recorded.',
    allowed_use: 'Small owner-approved re-permission batch only after suppression/do-not-contact checks.',
    blocked_use: 'Do not send to old leads as routine marketing, and do not route legacy rows before renewed permission.',
    stop_rule: 'Any opt-out, complaint, ambiguity or no response keeps the lead blocked.',
  },
  {
    id: 'CLIENT-STOP-01',
    audience: 'client',
    scenario: 'user asks not to be contacted',
    consent_state: 'do_not_contact',
    status: 'READY_FOR_OWNER_LEGAL_REVIEW',
    hebrew_template: 'קיבלנו. לא נפנה אליך שוב בנושא זה. אם תרצה/י בעתיד לפתוח פנייה חדשה, אפשר לפנות דרך האתר Jus-Tice.',
    crm_update_if_sent: 'Set consent_status=do_not_contact; keep routing_hold=1; record opt-out note and date.',
    allowed_use: 'Confirm stop request one time if operationally needed.',
    blocked_use: 'Do not include offers, partner names, prices or persuasion.',
    stop_rule: 'No further client outreach unless the same person later initiates a new request.',
  },
  {
    id: 'PARTNER-PREVIEW-01',
    audience: 'lawyer_or_supplier',
    scenario: 'no-PII partner preview before terms',
    consent_state: 'owner_verified_consent_or_explicit_match_consent',
    status: 'READY_FOR_OWNER_LEGAL_REVIEW',
    hebrew_template: 'יש לנו פנייה בתחום [תחום], באזור [אזור כללי], עם דחיפות [נמוכה/בינונית/גבוהה]. בשלב זה לא מועברים שם, טלפון, מסמכים או פרטי זיהוי. האם אתם מקבלים פניות מסוג זה, מה זמינות המענה, ומה תנאי התשלום/עמלת הליד שאתם מאשרים מראש?',
    crm_update_if_sent: 'Record anonymized_preview_status and partner_terms_status; do not release PII yet.',
    allowed_use: 'Ask a potential partner about fit and commercial terms using anonymized facts.',
    blocked_use: 'Do not attach screenshots, raw chat, full city/address, documents, phone or email.',
    stop_rule: 'If partner does not accept terms/billing contact, do not release client PII.',
  },
  {
    id: 'PARTNER-TERMS-01',
    audience: 'lawyer_or_supplier',
    scenario: 'partner terms confirmation',
    consent_state: 'owner_verified_consent_or_explicit_match_consent',
    status: 'READY_FOR_OWNER_LEGAL_REVIEW',
    hebrew_template: 'כדי להתקדם עם התאמת פנייה, נא אשרו בכתב: סוג הפניות שאתם מקבלים, מחיר/עמלה מוסכמים, איש קשר לחשבונית/תשלום, זמן תגובה צפוי, והאם קיימת מגבלת קיבולת. רק לאחר אישור ותיעוד, ובכפוף לאישור הלקוח, נוכל לשקול העברת פרטים מזהים.',
    crm_update_if_sent: 'Record partner_terms_status, min fee, billing contact and owner note.',
    allowed_use: 'Confirm commercial terms before any PII release.',
    blocked_use: 'Do not promise exclusivity, guaranteed case quality, guaranteed volume or legal outcome.',
    stop_rule: 'Missing billing contact or fee keeps owner_handoff_release_status blocked.',
  },
  {
    id: 'OWNER-RELEASE-01',
    audience: 'owner_admin',
    scenario: 'final pre-handoff checklist',
    consent_state: 'explicit_match_consent_or_owner_verified_consent',
    status: 'INTERNAL_ONLY',
    hebrew_template: 'לפני מסירה: 1. יש אישור לקוח מפורש? 2. יש תקציר ללא מידע עודף? 3. שותף קיבל תנאים ומחיר? 4. יש איש קשר לחיוב? 5. נרשמה החלטת בעלים? 6. נפתח מעקב חשבונית/תשלום? אם אחד חסר - לא מעבירים.',
    crm_update_if_sent: 'Use as owner_handoff_release_note checklist; no outbound message required.',
    allowed_use: 'Internal owner/admin gate before manual handoff.',
    blocked_use: 'Do not bypass because the lead is urgent or high-value.',
    stop_rule: 'Any missing item keeps routing_hold=1.',
  },
  {
    id: 'BILLING-01',
    audience: 'lawyer_or_supplier',
    scenario: 'manual invoice/payment proof after approved handoff',
    consent_state: 'approved_manual_handoff',
    status: 'READY_FOR_OWNER_LEGAL_REVIEW',
    hebrew_template: 'בהתאם לתנאים שאושרו מראש עבור הפנייה, נבקש להסדיר תשלום לפי הפרטים שנרשמו. נא לשלוח אישור תשלום/אסמכתא או פרטי חיוב לחשבונית. התשלום יירשם רק לאחר קבלת אסמכתא.',
    crm_update_if_sent: 'Record qualified_lead_invoice_reference or qualified_lead_payment_evidence_url before marking paid.',
    allowed_use: 'After owner release and partner terms are documented.',
    blocked_use: 'Do not send before the partner accepted the fee and the handoff was approved.',
    stop_rule: 'No payment evidence means no paid revenue claim.',
  },
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
  const base = `whatsapp-talkto-consent-message-pack-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    templateCsv: path.join(ROOT, '.project-control', `whatsapp-talkto-consent-message-template-${reportDate}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function readSource(filePath) {
  return existsSync(filePath) ? readFileSync(filePath, 'utf8') : '';
}

function codeChecks() {
  const crm = readSource(sourceFiles.crm);
  const router = readSource(sourceFiles.router);
  return [
    {
      id: 'CODE-01',
      gate: 'manual bridge has consent states',
      status: crm.includes('function justice_theme_crm_manual_lead_consent_options') && crm.includes('explicit_match_consent') ? 'PASS' : 'MISSING',
      evidence: 'inc/lead-crm.php consent options',
    },
    {
      id: 'CODE-02',
      gate: 'external leads remain held unless consent is routeable',
      status: router.includes('routing_hold') && router.includes('owner_verified_consent') ? 'PASS' : 'MISSING',
      evidence: 'inc/lead-routing.php routing guard',
    },
    {
      id: 'CODE-03',
      gate: 'partner preview and terms queue exist',
      status: crm.includes('justice_theme_crm_render_partner_preview_queue') && crm.includes('partner_terms_status') ? 'PASS' : 'MISSING',
      evidence: 'inc/lead-crm.php partner preview queue',
    },
    {
      id: 'CODE-04',
      gate: 'owner handoff release exists',
      status: crm.includes('justice_theme_crm_render_owner_handoff_release_queue') && crm.includes('approved_manual_handoff') ? 'PASS' : 'MISSING',
      evidence: 'inc/lead-crm.php owner release queue',
    },
    {
      id: 'CODE-05',
      gate: 'payment proof guard exists',
      status: crm.includes('qualified_lead_payment_evidence_url') && crm.includes('qualified_lead_invoice_reference') ? 'PASS' : 'MISSING',
      evidence: 'inc/lead-crm.php billing proof fields',
    },
  ];
}

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(csvRows, columns) {
  const body = csvRows.map((row) => columns.map((column) => csvEscape(row[column])).join(',')).join('\n');
  return `${columns.join(',')}\n${body}${body ? '\n' : ''}`;
}

function writeText(filePath, text) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, text, 'utf8');
}

function mdCell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function markdownReport(reportDate, outputs, checks) {
  const passingChecks = checks.filter((check) => check.status === 'PASS').length;
  const blockedTemplates = rows.filter((row) => row.status.includes('BLOCKED')).length;
  const summaryStatus = passingChecks === checks.length
    ? 'CONSENT_MESSAGE_PACK_READY_FOR_OWNER_LEGAL_REVIEW_NO_SEND'
    : 'BLOCKED_CODE_GATE_MISSING';

  const lines = [
    `# WhatsApp / TalkTo Consent Message Pack - ${reportDate}`,
    '',
    `Status: ${summaryStatus}`,
    '',
    'Purpose: give owner/operators exact private wording and stop rules for current inbound WhatsApp/TalkTo leads, old untreated leads, no-PII partner previews and manual billing proof without sending anything automatically.',
    '',
    'Safety: no mailbox login, message send, CMS publish, database edit, CRM lead creation, client contact, lawyer/supplier contact, WhatsApp action, TalkTo action, webhook, payment, invoice, public page, SEO setting, redirect, canonical/noindex, sitemap, taxonomy, GSC, GA4, wp-admin or uPress action was performed.',
    '',
    'Legal posture: these are operational drafts for owner/legal review, not legal advice. Legacy re-permission is explicitly blocked until owner/legal approval and suppression checks.',
    '',
    '## Generated Files',
    '',
    `- Private report: \`${path.relative(ROOT, outputs.projectMd)}\``,
    `- Private CSV: \`${path.relative(ROOT, outputs.projectCsv)}\``,
    `- Blank operator template: \`${path.relative(ROOT, outputs.templateCsv)}\``,
    `- Machine JSON: \`${path.relative(ROOT, outputs.reportJson)}\``,
    `- Machine CSV: \`${path.relative(ROOT, outputs.reportCsv)}\``,
    '',
    '## Summary',
    '',
    `- Message rows: ${rows.length}`,
    `- Client-facing rows: ${rows.filter((row) => row.audience === 'client').length}`,
    `- Partner-facing rows: ${rows.filter((row) => row.audience === 'lawyer_or_supplier').length}`,
    `- Internal owner rows: ${rows.filter((row) => row.audience === 'owner_admin').length}`,
    `- Blocked pending legal/owner approval: ${blockedTemplates}`,
    `- Static code gates passing: ${passingChecks}/${checks.length}`,
    '- Messages sent: 0',
    '- CRM records created: 0',
    '- Partner/client contacts made: 0',
    '- Public changes approved: 0',
    '',
    '## Source References',
    '',
    '| ID | Source | URL | Why It Matters |',
    '| --- | --- | --- | --- |',
    ...sourceReferences.map((source) => `| ${mdCell(source.id)} | ${mdCell(source.title)} | ${mdCell(source.url)} | ${mdCell(source.relevance)} |`),
    '',
    '## Static Code Gates',
    '',
    '| ID | Gate | Status | Evidence |',
    '| --- | --- | --- | --- |',
    ...checks.map((check) => `| ${check.id} | ${check.gate} | ${check.status} | ${check.evidence} |`),
    '',
    '## Message Rows',
    '',
    '| ID | Audience | Scenario | Consent State | Status | Hebrew Template | CRM Update If Sent | Allowed Use | Blocked Use | Stop Rule |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) => `| ${mdCell(row.id)} | ${mdCell(row.audience)} | ${mdCell(row.scenario)} | ${mdCell(row.consent_state)} | ${mdCell(row.status)} | ${mdCell(row.hebrew_template)} | ${mdCell(row.crm_update_if_sent)} | ${mdCell(row.allowed_use)} | ${mdCell(row.blocked_use)} | ${mdCell(row.stop_rule)} |`),
    '',
    '## Operator Rule',
    '',
    'The safest path is: current inbound help request -> details request -> explicit match permission -> routing hold remains -> no-PII partner preview -> accepted partner terms and billing contact -> owner release -> manual handoff -> invoice/payment proof. Old leads do not skip into this path; they stay parked until re-permission is approved and recorded.',
    '',
    '## Linear Anchors',
    '',
    '- Parent: `HAD-87` WhatsApp/TalkTo consent-safe CRM.',
    '- Related: `HAD-102` paid handoff runbook, `HAD-79` supplier marketplace, `HAD-97` smart-match readiness, `HAD-76` first paid lead.',
    '',
  ];

  return { text: lines.join('\n'), status: summaryStatus };
}

function templateCsv() {
  return toCsv(
    [
      {
        source_thread_id: '',
        lead_id_private: '',
        selected_message_id: '',
        owner_legal_approved: '',
        sent_by_owner_at: '',
        reply_received_at: '',
        consent_status_after_reply: '',
        crm_note_private: '',
      },
    ],
    [
      'source_thread_id',
      'lead_id_private',
      'selected_message_id',
      'owner_legal_approved',
      'sent_by_owner_at',
      'reply_received_at',
      'consent_status_after_reply',
      'crm_note_private',
    ]
  );
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-whatsapp-talkto-consent-message-pack.mjs [--reportDate=YYYY-MM-DD]');
  process.exit(0);
}

const outputs = outputFiles(args.reportDate);
const checks = codeChecks();
const report = markdownReport(args.reportDate, outputs, checks);
const columns = [
  'id',
  'audience',
  'scenario',
  'consent_state',
  'status',
  'hebrew_template',
  'crm_update_if_sent',
  'allowed_use',
  'blocked_use',
  'stop_rule',
];

writeText(outputs.projectMd, report.text);
writeText(outputs.projectCsv, toCsv(rows, columns));
writeText(outputs.templateCsv, templateCsv());
writeText(outputs.reportCsv, toCsv(rows, columns));
writeText(
  outputs.reportJson,
  `${JSON.stringify({
    reportDate: args.reportDate,
    status: report.status,
    summary: {
      messageRows: rows.length,
      clientRows: rows.filter((row) => row.audience === 'client').length,
      partnerRows: rows.filter((row) => row.audience === 'lawyer_or_supplier').length,
      internalOwnerRows: rows.filter((row) => row.audience === 'owner_admin').length,
      blockedPendingLegalOwnerApproval: rows.filter((row) => row.status.includes('BLOCKED')).length,
      staticChecks: checks.length,
      staticChecksPassing: checks.filter((check) => check.status === 'PASS').length,
      messagesSent: 0,
      crmRecordsCreated: 0,
      partnerContactsMade: 0,
      clientContactsMade: 0,
      publicChangesApproved: 0,
      cmsWritesApproved: 0,
      seoSettingsChanged: 0,
      upressDeploymentRequired: false,
    },
    sourceReferences,
    checks,
    rows,
  }, null, 2)}\n`
);

console.log(JSON.stringify({
  reportDate: args.reportDate,
  status: report.status,
  rows: rows.length,
  staticChecks: checks.length,
  staticChecksPassing: checks.filter((check) => check.status === 'PASS').length,
  messagesSent: 0,
  publicChangesApproved: 0,
  upressDeploymentRequired: false,
}, null, 2));
