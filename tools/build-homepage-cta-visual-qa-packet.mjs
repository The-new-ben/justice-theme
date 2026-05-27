import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), '..');
const DEFAULT_REPORT_DATE = new Date().toISOString().slice(0, 10);
const LIVE_HOMEPAGE = 'https://jus-tice.co.il/';

function parseArgs() {
  const args = {
    reportDate: process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    auditDate: process.env.AUDIT_DATE || process.env.REPORT_DATE || DEFAULT_REPORT_DATE,
    desktopScreenshot: '',
    mobileScreenshot: '',
    sourceAudit: '',
  };

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--reportDate=')) {
      args.reportDate = arg.slice('--reportDate='.length);
    } else if (arg.startsWith('--auditDate=')) {
      args.auditDate = arg.slice('--auditDate='.length);
    } else if (arg.startsWith('--desktopScreenshot=')) {
      args.desktopScreenshot = arg.slice('--desktopScreenshot='.length);
    } else if (arg.startsWith('--mobileScreenshot=')) {
      args.mobileScreenshot = arg.slice('--mobileScreenshot='.length);
    } else if (arg.startsWith('--sourceAudit=')) {
      args.sourceAudit = arg.slice('--sourceAudit='.length);
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  for (const [name, value] of Object.entries({ reportDate: args.reportDate, auditDate: args.auditDate })) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new Error(`--${name} must be YYYY-MM-DD`);
    }
  }

  if (!args.desktopScreenshot) {
    args.desktopScreenshot = path.join(ROOT, '.project-control', 'visual-evidence', `homepage-cta-density-desktop-${args.reportDate}.png`);
  } else if (!path.isAbsolute(args.desktopScreenshot)) {
    args.desktopScreenshot = path.join(ROOT, args.desktopScreenshot);
  }

  if (!args.mobileScreenshot) {
    args.mobileScreenshot = path.join(ROOT, '.project-control', 'visual-evidence', `homepage-cta-density-mobile-iphone-${args.reportDate}.png`);
  } else if (!path.isAbsolute(args.mobileScreenshot)) {
    args.mobileScreenshot = path.join(ROOT, args.mobileScreenshot);
  }

  if (!args.sourceAudit) {
    args.sourceAudit = path.join(ROOT, '.reports', `live-public-cta-density-${args.auditDate}.json`);
  } else if (!path.isAbsolute(args.sourceAudit)) {
    args.sourceAudit = path.join(ROOT, args.sourceAudit);
  }

  return args;
}

function outputFiles(reportDate) {
  const base = `homepage-cta-visual-qa-packet-${reportDate}`;
  return {
    projectMd: path.join(ROOT, '.project-control', `${base}.md`),
    projectCsv: path.join(ROOT, '.project-control', `${base}.csv`),
    reportJson: path.join(ROOT, '.reports', `${base}.json`),
    reportCsv: path.join(ROOT, '.reports', `${base}.csv`),
  };
}

function readJson(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required JSON: ${filePath}`);
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function pngInfo(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`Missing screenshot: ${filePath}`);
  }

  const bytes = readFileSync(filePath);
  const signature = bytes.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') {
    throw new Error(`Not a PNG screenshot: ${filePath}`);
  }

  return {
    path: path.relative(ROOT, filePath).replace(/\\/g, '/'),
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    bytes: bytes.length,
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

function homepageAuditRow(audit) {
  return (audit.rows || []).find((row) => row.path === '/' || row.url === LIVE_HOMEPAGE) || {};
}

function buildRows({ desktop, mobile, homepage }) {
  return [
    {
      id: 'HVQA-01',
      section: 'source_audit',
      status: homepage.status === 'REVIEW' ? 'REVIEW_CONFIRMED' : 'SOURCE_AUDIT_NOT_REVIEW',
      evidence: `Live CTA density audit found homepage status ${homepage.status || 'missing'}, primary CTA count ${homepage.primary_cta_count || 'missing'}, unique CTA texts ${homepage.unique_primary_cta_texts || 'missing'} and repeated text groups ${homepage.repeated_text_groups || '-'}.`,
      review: 'The repeated lawyer-card action label remains a real decision item before adding more homepage CTAs or managed-service copy.',
      recommended_next_step: 'Do not add new homepage CTA blocks; choose a quieter card-action treatment only after owner/design approval.',
      blocker: 'No public homepage change is approved by this packet.',
      public_change_approved: 'no',
    },
    {
      id: 'HVQA-02',
      section: 'desktop_screenshot',
      status: 'SCREENSHOT_CAPTURED',
      evidence: `${desktop.path} (${desktop.width}x${desktop.height}, ${desktop.bytes} bytes).`,
      review: 'Desktop top-to-mid homepage view shows the hero, search form, trust chips, three-step user path and the start of the lawyer section. The page still reads as legal help first.',
      recommended_next_step: 'If a public implementation is approved, use this as the before-state for desktop comparison.',
      blocker: 'Screenshot does not approve changing labels, links or layout.',
      public_change_approved: 'no',
    },
    {
      id: 'HVQA-03',
      section: 'mobile_screenshot',
      status: 'SCREENSHOT_CAPTURED',
      evidence: `${mobile.path} (${mobile.width}x${mobile.height}, ${mobile.bytes} bytes).`,
      review: 'Mobile iPhone-width view shows the header/menu, hero, search form, trust chips, stats and three-step path. The repeated lawyer-card buttons sit lower than the captured top flow, so lower-section QA is still required before publication.',
      recommended_next_step: 'Before any live change, capture the actual lawyer-card area after a local or staging implementation and rerun CTA density.',
      blocker: 'Do not treat this screenshot as proof that the repeated card buttons are solved.',
      public_change_approved: 'no',
    },
    {
      id: 'HVQA-04',
      section: 'implementation_direction',
      status: 'OWNER_REVIEW_ONLY',
      evidence: 'Prior packet option B is still the lowest-risk path: make repeated lawyer-card actions visually quieter instead of changing the user promise.',
      review: 'A style-only card-action treatment is safer than new Hebrew labels, because the current links go to contact URLs and copy changes could create a mismatch.',
      recommended_next_step: 'If approved, implement a secondary-card action style, then run mobile/desktop screenshots, CTA density audit, business-language audit and Hebrew public-change email.',
      blocker: 'Owner/design approval and post-change QA are missing.',
      public_change_approved: 'no',
    },
    {
      id: 'HVQA-05',
      section: 'public_safety',
      status: 'HARD_GUARDRAIL',
      evidence: 'No business-plan, supplier marketplace, package economics, revenue or internal routing language is needed for the user-facing homepage decision.',
      review: 'The homepage should stay focused on legal help, user problem selection, lawyer fit, trust and guidance.',
      recommended_next_step: 'Keep lawyer join/revenue surfacing on the sidelines and do not expose internal strategy.',
      blocker: 'Any public text change needs exact owner/legal/content review.',
      public_change_approved: 'no',
    },
  ];
}

function buildSummary(reportDate, auditDate, rows, desktop, mobile, homepage) {
  return {
    reportDate,
    auditDate,
    status: 'HOMEPAGE_CTA_VISUAL_QA_READY_NO_PUBLIC_CHANGE',
    targetRoute: LIVE_HOMEPAGE,
    homepageAuditStatus: homepage.status || '',
    homepagePrimaryCtaCount: Number(homepage.primary_cta_count || 0),
    homepageUniquePrimaryCtaTexts: Number(homepage.unique_primary_cta_texts || 0),
    homepageRepeatedTextGroups: homepage.repeated_text_groups || '',
    screenshotsCaptured: 2,
    desktopScreenshot: desktop.path,
    desktopViewport: `${desktop.width}x${desktop.height}`,
    mobileScreenshot: mobile.path,
    mobileViewport: `${mobile.width}x${mobile.height}`,
    visualQaRows: rows.length,
    lowerLawyerCardSectionStillNeedsQa: true,
    publicChangesApproved: 0,
    cmsChangesApproved: 0,
    crmRecordsCreated: 0,
    leadOrLawyerContactActions: 0,
    invoicesOrPaymentsCreated: 0,
    emailSent: 0,
    upressDeploymentRequired: false,
  };
}

function markdownReport(summary, rows) {
  return [
    `# Homepage CTA Visual QA Packet - ${summary.reportDate}`,
    '',
    `Status: ${summary.status}`,
    '',
    `Target route: ${summary.targetRoute}`,
    `Source CTA audit date: ${summary.auditDate}`,
    '',
    'Scope: private visual QA packet only. It captures before-state screenshots and interprets the existing CTA-density finding. It does not publish, edit CMS content, change homepage labels/links/layout, alter SEO settings, create leads, contact anyone, send email or deploy.',
    '',
    '## Summary',
    '',
    `- Homepage audit status: ${summary.homepageAuditStatus}`,
    `- Primary CTAs counted by source audit: ${summary.homepagePrimaryCtaCount}`,
    `- Unique primary CTA texts: ${summary.homepageUniquePrimaryCtaTexts}`,
    `- Repeated text groups: ${summary.homepageRepeatedTextGroups || '-'}`,
    `- Desktop screenshot: ${summary.desktopScreenshot} (${summary.desktopViewport})`,
    `- Mobile screenshot: ${summary.mobileScreenshot} (${summary.mobileViewport})`,
    `- Public changes approved: ${summary.publicChangesApproved}`,
    '',
    '## Review Rows',
    '',
    '| ID | Section | Status | Evidence | Review | Next Step | Blocker |',
    '| --- | --- | --- | --- | --- | --- | --- |',
    ...rows.map((row) =>
      `| ${row.id} | ${row.section} | ${row.status} | ${mdCell(row.evidence)} | ${mdCell(row.review)} | ${mdCell(row.recommended_next_step)} | ${mdCell(row.blocker)} |`
    ),
    '',
    '## Decision',
    '',
    'Do not publish a homepage CTA change from this packet alone. The safest candidate, if the owner approves, is a visual-only quieter secondary treatment for repeated lawyer-card actions. Exact public implementation still needs local/staging screenshots, live CTA-density rerun, public business-language audit and Hebrew owner email after live verification.',
    '',
    '## Safety Statement',
    '',
    'This packet writes private repo artifacts and screenshots only. It does not publish CMS content, change redirects/canonicals/noindex/sitemaps/taxonomies, contact clients/lawyers/suppliers, import leads, send email/WhatsApp/TalkTo, create invoices/payments, claim revenue or require uPress deployment.',
    '',
  ].join('\n');
}

const args = parseArgs();

if (args.help) {
  console.log('Usage: node tools/build-homepage-cta-visual-qa-packet.mjs [--reportDate=YYYY-MM-DD] [--auditDate=YYYY-MM-DD]');
  process.exit(0);
}

const audit = readJson(args.sourceAudit);
const homepage = homepageAuditRow(audit);
const desktop = pngInfo(args.desktopScreenshot);
const mobile = pngInfo(args.mobileScreenshot);
const rows = buildRows({ desktop, mobile, homepage });
const summary = buildSummary(args.reportDate, args.auditDate, rows, desktop, mobile, homepage);
const files = outputFiles(args.reportDate);
const columns = [
  'id',
  'section',
  'status',
  'evidence',
  'review',
  'recommended_next_step',
  'blocker',
  'public_change_approved',
];
const csv = toCsv(rows, columns);

writeText(files.projectMd, markdownReport(summary, rows));
writeText(files.projectCsv, csv);
writeText(files.reportJson, `${JSON.stringify({ summary, rows }, null, 2)}\n`);
writeText(files.reportCsv, csv);

console.log(JSON.stringify({ ...summary, files }, null, 2));
